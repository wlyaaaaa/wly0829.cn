"""按需运行的只读数字重取；不接入构建，不修改页面。"""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from contextlib import closing
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP
import glob
import json
import os
from pathlib import Path
import re
import sqlite3
import subprocess
import sys
import time

sys.dont_write_bytecode = True
from checks import audit_pages
from inventory import build_inventory, write_inventory, strict_findings
from engine.content import bound_json
from validation import LEDGER, validate_entries, validate_method, registry_errors, positive
from apply_edits import qualified_date_review

ROOT = Path(__file__).resolve().parents[2]
BEIJING = timezone(timedelta(hours=8))
NUMBER = re.compile(r"\d[\d,]*(?:\.\d+)?")
TIERS = (("block", "发布前阻断"), ("advisory", "提醒，不阻断"))


def read_text(path):
    raw = Path(path).read_bytes()
    encoding = "utf-32" if raw.startswith((b"\xff\xfe\x00\x00", b"\x00\x00\xfe\xff")) else (
        "utf-16" if raw.startswith((b"\xff\xfe", b"\xfe\xff")) else "utf-8-sig")
    return raw.decode(encoding)


def read_json(path):
    return json.loads(read_text(path))


def pages(root):
    return [bound_json(p, read=read_text, root=root) for p in sorted((root / "sources/pages").glob("*/page.json"))]


def bounded(argv, seconds, cwd=None):
    flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
    proc = subprocess.Popen(argv, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                            encoding="utf-8", errors="replace", creationflags=flags, cwd=cwd)
    try:
        out, err = proc.communicate(timeout=seconds)
    except subprocess.TimeoutExpired:
        cleanup_unverified = False
        if os.name == "nt":
            try:
                subprocess.run(["taskkill", "/PID", str(proc.pid), "/T", "/F"], check=True,
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                               creationflags=flags, timeout=5)
            except (OSError, subprocess.SubprocessError):
                cleanup_unverified = True
        if proc.poll() is None:
            proc.kill()
        proc.wait(timeout=5)
        note = "；子进程清理未核实" if cleanup_unverified else "，已停止本次读取"
        raise TimeoutError("单条来源超时" + note) from None
    if proc.returncode:
        raise RuntimeError(f"读取程序退出码 {proc.returncode}；未取得新值")
    return out


def resolve(path, root):
    p = Path(os.path.expandvars(path))
    return p if p.is_absolute() else root / p


def matching_files(method, root):
    base = resolve(method["path"], root)
    if not base.exists():
        raise FileNotFoundError("来源目录或文件不可用")
    if base.is_file():
        return [base]
    def match(rel, patterns):
        return any(re.fullmatch(glob.translate(x, recursive=True), rel) for x in patterns)
    candidates = base.rglob("*")
    if method.get("tracked"):
        names = bounded(["git", "-C", str(base), "ls-files", "-z"], 30).split("\0")
        candidates = (base / n for n in names if n)
    return [p for p in candidates if p.is_file()
            and match(p.relative_to(base).as_posix(), method.get("include", ["**/*"]))
            and not match(p.relative_to(base).as_posix(), method.get("exclude", []))]


def field_value(value, field):
    for key in re.findall(r"[^.\[\]]+", field):
        value = value[int(key)] if isinstance(value, list) else value[key]
    return value


def pointer_value(value, method):
    for key in method.get("pointer", []):
        value = value[int(key)] if isinstance(value, list) else value[key]
    return len(value) if method.get("operation") == "length" else value


def timestamp(text):
    parsed = datetime.fromisoformat(str(text).replace("Z", "+00:00"))
    # 无时区日志按本机时区读取；输出统一北京时间。
    return parsed.astimezone(BEIJING)


def ledger_values(methods, entry, root):
    path = resolve(entry["path"], root)
    now = datetime.now(BEIJING)
    counts, last = [0] * len(methods), [None] * len(methods)
    groups = {}
    for i, method in enumerate(methods):
        filters = dict(entry.get("filter", {}), **method.get("filter", {}))
        group = groups.setdefault(json.dumps(filters, sort_keys=True), (filters, {}))
        group[1].setdefault(method["key"], []).append(i)
    with path.open(encoding="utf-8-sig") as stream:
        if entry.get("format", "jsonl") == "json":
            records = pointer_value(json.load(stream), entry)
        else:
            records = (json.loads(line) for line in stream if line.strip())
        for row in records:
            for filters, keys in groups.values():
                if any(field_value(row, k) != v for k, v in filters.items()):
                    continue
                indices = keys.get(field_value(row, entry.get("key_field", "key")), [])
                if not indices:
                    continue
                used = timestamp(field_value(row, entry.get("time_field", "used_at")))
                if used <= now:
                    for i in indices:
                        if now - timedelta(days=7) <= used:
                            counts[i] += 1
                        if last[i] is None or used > last[i]:
                            last[i] = used
    return [counts[i] if m["operation"] == "count_7d" else
            last[i].isoformat(timespec="seconds") if last[i] else None for i, m in enumerate(methods)]


def retrieve(method, root, entries=None, cache=None):
    entries = entries if entries is not None else read_json(root / "sources/refresh/entries.json") if (root / "sources/refresh/entries.json").exists() else {}
    cache = cache if cache is not None else {}
    validate_method(method, entries)
    kind = method["kind"]
    if kind == "entry":
        name = method["entry"]
        entry = entries[name]
        entry_cache = cache.setdefault("entries", {})
        if name not in entry_cache:
            validate_entries({name: entry})
            try:
                entry_cache[name] = json.loads(bounded(entry["argv"], cache.get("entry_timeouts", {}).get(name, method.get("timeout", entry.get("timeout", 20))),
                                                cwd=str(resolve(entry["cwd"], root))))
            except Exception as exc:
                entry_cache[name] = exc
        if isinstance(entry_cache[name], Exception):
            raise entry_cache[name]
        value = pointer_value(entry_cache[name], method)
    elif kind == "sqlite_ro":
        path = resolve(method["path"], root).resolve()
        with closing(sqlite3.connect(path.as_uri() + "?mode=ro", uri=True)) as connection:
            allowed = {sqlite3.SQLITE_SELECT, sqlite3.SQLITE_READ, sqlite3.SQLITE_FUNCTION}
            connection.set_authorizer(lambda action, a, b, c, d: sqlite3.SQLITE_OK if action in allowed else sqlite3.SQLITE_DENY)
            connection.set_progress_handler(lambda: 1 if time.monotonic() > cache.get("deadline", float("inf")) else 0, 10000)
            rows = connection.execute(method["sql"]).fetchmany(2)
            if len(rows) != 1 or len(rows[0]) != 1:
                raise ValueError("sqlite_ro 必须返回单行单列计数或状态")
            value = rows[0][0]
    elif kind == "log_window":
        now, count, last = datetime.now(BEIJING), 0, None
        files = matching_files(method, root)
        if not files:
            raise ValueError("没有匹配到日志文件")
        for path in files:
            for line in read_text(path).splitlines():
                if not re.search(method["pattern"], line):
                    continue
                found = re.search(r"\d{4}-\d\d-\d\d[T ]\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)?", line)
                used = timestamp(found[0]) if found else None
                if method.get("days") is not None or method.get("operation") == "last_time":
                    if used is None:
                        raise ValueError("匹配日志缺可解析时间，不能判断时间窗或最后时间")
                    if used > now or method.get("days") is not None and used < now - timedelta(days=method["days"]):
                        continue
                count += 1
                if used and (last is None or used > last):
                    last = used
        value = last.isoformat(timespec="seconds") if method.get("operation") == "last_time" and last else None if method.get("operation") == "last_time" else count
    elif kind == "usage_ledger":
        value = ledger_values([method], entries[LEDGER], root)[0]
    elif kind == "git_count":
        value = int(bounded(["git", "-C", str(resolve(method["path"], root)),
                             "rev-list", "--count", method.get("ref", "HEAD")], 30).strip())
    elif kind in ("file_count", "line_count"):
        files = matching_files(method, root)
        if kind == "line_count" and not files:
            raise ValueError("目录可读但没有匹配到代码文件；核对统计路径和范围，不能用零冒充新数")
        value = len(files) if kind == "file_count" else sum(
            read_text(p).count("\n") if method.get("newline_only") else
            sum(bool(line) if method.get("empty_only") else bool(line.strip()) or not method.get("nonempty")
                for line in read_text(p).splitlines()) for p in files)
    elif kind in ("json", "rules_inspect"):
        value = read_json(resolve(method["path"], root)) if kind == "json" else json.loads(bounded([
            "pwsh", "-NoProfile", "-File", "E:/.agents/tools/Invoke-EAgentRulesRelease.ps1",
            "-Mode", "Inspect", "-Json"], 30))
        if kind == "rules_inspect" and (value.get("status") != "pass" or value.get("reason") != "e_rules_active_verified"):
            raise ValueError("活动规则未核验通过，不能把指针文字当作现行结果")
        for key in method.get("pointer", []):
            value = value[key]
        if method.get("operation") == "length":
            value = len(value)
    elif kind == "regex_count":
        files = matching_files(method, root)
        if not files:
            raise ValueError("没有匹配到统计文件；核对路径和范围")
        value = sum(len(re.findall(method["pattern"], read_text(p),
                    re.M if "m" in method.get("flags", "") else 0)) for p in files)
    elif kind in ("page_count", "feature_count", "group_count"):
        selected = pages(root)
        if kind == "page_count":
            value = sum(all(k not in method or p.get(k) == method[k] for k in ("status", "public"))
                        and (not method.get("kinds") or p.get("kind") in method["kinds"]) for p in selected)
        elif kind == "feature_count":
            value = sum(1 for p in selected if p.get("kind") in ("project", "frozen")
                        for f in p.get("registry", {}).get("features", [])
                        if "status" not in method or f.get("status") == method["status"])
        else:
            p = next(p for p in selected if p["page"] == method["page"])
            value = len(next(g for g in p["registry"]["groups"] if g["id"] == method["group"])["members"])
    else:
        raise ValueError("未实现的重取办法，交人工处理")
    if isinstance(value, (list, dict)) or value is None:
        raise ValueError("来源未返回一个数字或版本值")
    if any(k in method for k in ("scale", "round_to", "digits", "offset")):
        value = Decimal(str(value)) * Decimal(str(method.get("scale", 1)))
        step = Decimal(str(method.get("round_to", 1))) if "round_to" in method else None
        if step:
            value = (value / step).quantize(Decimal(1), rounding=ROUND_HALF_UP) * step
        value += Decimal(str(method.get("offset", 0)))
        if "digits" in method:
            value = value.quantize(Decimal(10) ** -method["digits"], rounding=ROUND_HALF_UP)
        value = float(value)
    return value


def retrieve_batch(methods, root, entries, seconds):
    cache = {"deadline": time.monotonic() + seconds}
    cache["entry_timeouts"] = {name: max(m.get("timeout", entries[name].get("timeout", 20))
                                      for m in methods if m.get("entry") == name)
                               for name in {m["entry"] for m in methods if m["kind"] == "entry"} if name in entries}
    if all(m["kind"] == "usage_ledger" for m in methods):
        for method in methods:
            validate_method(method, entries)
        return ledger_values(methods, entries[LEDGER], root)
    result = []
    method_cache = cache.setdefault("methods", {})
    for method in methods:
        try:
            key = json.dumps(method, sort_keys=True)
            if key not in method_cache:
                method_cache[key] = retrieve(method, root, entries, cache)
            result.append(method_cache[key])
        except Exception as exc:
            result.append({"error": f"来源读取失败（{type(exc).__name__}）：{exc}"})
    return result


def comparable(value):
    try:
        return Decimal(str(value).replace(",", "").strip())
    except Exception:
        return str(value).strip()


def page_value(record, page, root):
    observed = record.get("as_of")
    if record.get("dynamic"):
        if record["retrieve"]["kind"] not in ("page_count", "feature_count", "group_count"):
            raise ValueError("动态页面值只能从本仓库的页面登记统计")
        return retrieve(record["retrieve"], root), observed
    screen = next(s for s in page["screens"] if s["id"] == record["screen"])
    text = screen.get("text", "")
    visible_text = text
    if record.get("field"):
        text = field_value(page, record["field"])
        if not isinstance(text, (str, int, float)):
            raise ValueError("展示字段须定位字符串或标量")
        text = str(text)
        if "start" in record:
            start, end = record["start"], record["end"]
            if type(start) is not int or type(end) is not int or not 0 <= start < end <= len(text):
                raise ValueError("页面字符范围无效，保留旧日期/数值")
            text = text[start:end]
            return text, observed
        if not record.get("page_pattern") and not record.get("page_number"):
            return text, observed
    if record.get("page_number"):
        number = next(n for n in page.get("registry", {}).get("numbers", [])
                      if n["id"] == record["page_number"])
        observed = number.get("as_of", observed)
        text = number["text"]
    if record.get("page_pattern"):
        matches = list(re.finditer(record["page_pattern"], text, re.M))
        if len(matches) != 1:
            raise ValueError("页面定位未匹配；不能用登记值冒充页面现值")
        value = matches[0].group(1)
    else:
        if not record.get("page_number"):
            raise ValueError("未登记页面数值定位")
        value = NUMBER.findall(text)[record.get("value_index", 0)]
    if record.get("page_number") and record.get("automatic"):
        visible_numbers = [comparable(v) for v in NUMBER.findall(visible_text)]
        if comparable(value) not in visible_numbers and str(value) not in visible_text:
            raise ValueError("数字登记与可见正文未对上；同步登记或按正文重绑后再取数")
    return value, observed


def collect(root, registry, total_seconds=300, item_seconds=6, today=None, entries=None, workers=8, entries_path=None):
    today = today or datetime.now(BEIJING).date()
    started = time.monotonic()
    # 留出 taskkill/进程等待（各最多5秒）及审计/落盘尾段；总时限不是额外清理预算。
    deadline = started + max(0, total_seconds - 15)
    entries_path = entries_path or root / "sources/refresh/entries.json"
    entries = entries if entries is not None else read_json(entries_path) if entries_path.exists() else {}
    validate_entries(entries)
    invalid = {e["record_id"]: "; ".join(e["errors"]) for e in registry_errors(registry["records"], entries)}
    catalog = {p["page"]: p for p in pages(root)}
    rows, groups = [], {}
    for record in registry["records"]:
        row = dict(record, old_value=None, new_value=None, status="unavailable", reason="")
        page = catalog.get(record["page"], {})
        row["page_title"] = page.get("title", record["page"])
        row["screen_title"] = next((s.get("title", record["screen"]) for s in page.get("screens", [])
                                    if s["id"] == record["screen"]), record["screen"])
        try:
            row["old_value"], row["page_date"] = page_value(record, catalog[record["page"]], root)
        except (KeyError, ValueError, StopIteration, IndexError) as exc:
            row["page_error"] = str(exc) or "页面或数字登记不存在"
            row["page_date"] = record.get("as_of")
        screen = next((s for s in page.get("screens", []) if s["id"] == record["screen"]), {})
        if (record.get("historical") or record.get("frozen") or page.get("kind") == "frozen"
                or page.get("status") in {"frozen", "冻结", "已冻结", "historical", "历史"}
                or screen.get("section") in {"history", "evolution", "timeline"}):
            row.update(status="historical", reason="历史事实或冻结项目，本轮不重取")
        elif record.get("qualifies") and record.get("date_semantics") != "coverage_end":
            row["reason"] = "等待被注明数字的观察日期"
        elif record["id"] in invalid:
            row["reason"] = invalid[record["id"]]
        elif record.get("private") and not (record.get("automatic") and record.get("scope_status") == "verified"):
            row.update(status="domain_fact_task", reason="领域入口事实任务：按 source_location 核对；程序未读取来源")
        elif not record.get("automatic"):
            row["reason"] = record["retrieve"].get("instructions", "人工口径，未取得新值")
        elif record.get("scope_status") != "verified":
            row.update(status="scope_pending", reason=record.get("scope_reason", "统计口径未确认一致，不能算作变化"))
        elif row.get("page_error"):
            row["reason"] = row["page_error"]
        else:
            method = record["retrieve"]
            key = ("entry:" + method["entry"] if method["kind"] == "entry" else
                   "usage_ledger" if method["kind"] == "usage_ledger" else json.dumps(method, sort_keys=True))
            groups.setdefault(key, []).append(row)
        try:
            row["overdue"] = row["status"] != "historical" and (today - date.fromisoformat(row["page_date"])).days > 7
        except (TypeError, ValueError):
            row["overdue"] = False
            row["date_unknown"] = True
        rows.append(row)

    def run_group(selected):
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            return [{"error": "总重取时限已到，跳过剩余来源"}] * len(selected), None
        methods = [r["retrieve"] for r in selected]
        seconds = min(remaining, max([item_seconds] + [m.get("timeout", entries.get(LEDGER if m["kind"] == "usage_ledger" else m.get("entry", ""), {}).get("timeout", item_seconds)) for m in methods]))
        try:
            argv = [sys.executable, str(Path(__file__).resolve()), "--retrieve-batch", json.dumps(methods, ensure_ascii=False),
                    "--root", str(root), "--entries", str(entries_path), "--item-seconds", str(seconds)]
            values = json.loads(bounded(argv, seconds))
            if not isinstance(values, list) or len(values) != len(selected):
                raise ValueError("来源批次结果数量不符")
            return values, datetime.now(BEIJING).isoformat(timespec="seconds")
        except (OSError, ValueError, RuntimeError, TimeoutError, subprocess.SubprocessError) as exc:
            return [{"error": str(exc)}] * len(selected), None

    with ThreadPoolExecutor(max_workers=max(8, workers)) as pool:
        pending = {pool.submit(run_group, selected): selected for selected in groups.values()}
        for future in as_completed(pending):
            values, observed = future.result()
            for row, value in zip(pending[future], values):
                if value is None or isinstance(value, (dict, list)):
                    row["reason"] = value.get("error", "来源未返回标量") if isinstance(value, dict) else "来源未返回标量"
                else:
                    row.update(new_value=value, source_observed_at=observed,
                               status="unchanged" if comparable(row["old_value"]) == comparable(value) else "changed")
    by_id = {r["id"]: r for r in rows}
    for row in rows:
        if row.get("qualifies") and row["status"] != "historical":
            qualified = [by_id.get(ref, {}) for ref in row["qualifies"]]
            if row["id"] in invalid or row.get("page_error") or not all(r.get("status") in {"changed", "unchanged"} and r.get("source_observed_at") and r.get("page") == row["page"] and not r.get("qualifies") for r in qualified):
                row.update(new_value=None, status="unavailable", reason="被注明数字含 Unknown 或日期定位无效，保留旧截至日期")
            else:
                coverage_end = row.get("date_semantics") == "coverage_end"
                if coverage_end:
                    try:
                        if row["status"] not in {"changed", "unchanged"}:
                            raise ValueError("来源未返回覆盖末日")
                        value = date.fromisoformat(str(row["new_value"])).isoformat()
                    except ValueError:
                        row.update(new_value=None, status="unavailable", reason="覆盖末日来源 Unknown 或日期无效，保留旧截至日期")
                        continue
                else:
                    value = min(timestamp(r["source_observed_at"]).date().isoformat() for r in qualified)
                review = None if coverage_end else qualified_date_review(catalog[row["page"]], row)
                row.update(new_value=None if review else value, date_candidate=value, manual_review_reason=review,
                           source_observed_at=min(r["source_observed_at"] for r in qualified), scope_status="verified",
                           status="manual_review" if review else "unchanged" if row["old_value"] == value else "changed",
                           reason=review or ("登记来源的真实覆盖末日" if coverage_end else "被注明数字最早观察日期"))
    audit = audit_pages(root / "sources/pages", today, registry.get("retired_names", []))
    for finding in audit["findings"]:
        finding["page_title"] = catalog.get(finding["page"].split("/")[0], {}).get("title", finding["page"])
    automatic = [r for r in rows if r.get("automatic") and not r.get("qualifies") and r["status"] != "historical" and r.get("manual_reason") != "source_broken"]
    return {"schema": "content-refresh.result.v1", "observed_at": datetime.now(BEIJING).isoformat(timespec="seconds"),
            "baseline": registry.get("baseline"), "pages_checked": audit["pages_checked"],
            "numbers_checked": len(rows), "rows": rows, "findings": audit["findings"],
            "retrieval_seconds": round(time.monotonic() - started, 3), "workers": max(8, workers),
            "automatic_total": len(automatic), "automatic_obtained": sum(r["status"] in {"changed", "unchanged"} for r in automatic),
            "automatic_success_ratio": sum(r["status"] in {"changed", "unchanged"} for r in automatic) / len(automatic) if automatic else None}


def task_text(result, registry):
    lines = ["# 按需更新任务单", "", "## 写法要点（本次内容审查）", ""]
    lines += [f"- {point}" for point in registry["writing_points"]]
    lines += ["", f"重取时间：{result['observed_at']}（北京时间）。本程序未修改、发布任何页面。",
              "只改变化的句子及受影响的同页解释，并同步数字登记；成功重取的过期数字更新日期。取不到时保留原日期并移出首屏。",
              "历史演进数字不动；检查命中是待复核线索，必要的技术事实移到技术依据层。", ""]
    for title, selected in (
        ("日期口径需人工核对（不自动替换）", [r for r in result["rows"] if r["status"] == "manual_review"]),
        ("已重取且变化", [r for r in result["rows"] if r["status"] == "changed"]),
        ("未取得新值（含领域入口事实任务）", [r for r in result["rows"] if r["status"] in ("unavailable", "domain_fact_task")]),
        ("口径待核，不计入变化", [r for r in result["rows"] if r.get("automatic") and r.get("scope_status") != "verified"]),
        ("超过七天仍待处理", [r for r in result["rows"] if r["overdue"]])):
        lines += [f"## {title}", ""]
        lines += [f"- {r['page']} / {r['screen']}：{r['label']}；页面 {r['old_value']} → 重取 {r['new_value']}；"
                  f"原日期 {r.get('page_date')}；来源 {r['source_location']}；口径 {r.get('measurement_scope', '')}；{r['reason']}；{r.get('scope_reason', '')}" for r in selected] or ["无。"]
        lines.append("")
    lines += ["## 来源口径与基线缺口", ""]
    lines += [f"- {r['page']} / {r['screen']}：{r['known_gap']}" for r in result["rows"] if r.get("known_gap")]
    for tier, title in TIERS:
        lines += ["", f"## {title}", ""]
        lines += [f"- {f['page']} / {f['screen']} / {f['field']}:{f['line']}：{f['message']}；{f['excerpt']}"
                  for f in result["findings"] if f["tier"] == tier] or ["无。"]
    return "\n".join(lines)


def report_content(result, task):
    changed = [r for r in result["rows"] if r["status"] == "changed"]
    missing = [r for r in result["rows"] if r["status"] in ("unavailable", "domain_fact_task")]
    overdue = [r for r in result["rows"] if r["overdue"]]
    pending = [r for r in result["rows"] if r.get("automatic") and r.get("scope_status") != "verified"]
    blocks = [{"type": "metrics", "items": [{"value": v, "label": k} for k, v in (
        ("检查页面", result["pages_checked"]), ("登记数字", result["numbers_checked"]),
        ("重取后变化", len(changed)), ("未取得新值", len(missing)), ("写法命中", len(result["findings"])))]}]
    for title, selected in (("同口径的真变化", changed), ("日期口径需人工核对，不自动替换", [r for r in result["rows"] if r["status"] == "manual_review"]), ("口径待核，不计入变化", pending), ("取不到哪些", missing), ("超过七天待处理", overdue)):
        blocks += [{"type": "heading", "text": title}, {"type": "table", "columns":
            ["页 / 段", "数字含义", "页面旧数", "重取新数", "原日期", "来源与说明"], "rows":
            [[r["page_title"] + " / " + r["screen_title"] + "（" + r["screen"] + "）", r["label"], str(r["old_value"]) if r["old_value"] is not None else "未绑定正文数字",
              str(r["new_value"]) if r["new_value"] is not None else "未取到", r.get("page_date") or "未登记日期",
              r["source_location"] + "；" + r.get("measurement_scope", "") + "；" + r["reason"] + "；" + r.get("scope_reason", "") + ("；" + r["known_gap"] if r.get("known_gap") else "")] for r in selected]}] if selected else [
                {"type": "heading", "text": title}, {"type": "text", "text": "本次无此项。"}]
    for tier, title in TIERS:
        found = [f for f in result["findings"] if f["tier"] == tier]
        blocks += [{"type": "heading", "text": f"{title}（{len(found)}项）"}, {"type": "table", "columns":
                   ["页 / 段", "位置", "原因", "原文"], "rows":
                   [[f["page_title"] + " / " + f["screen"], f"{f['field']}:{f['line']}", f["message"], f["excerpt"]] for f in found]}]
    gaps = [r for r in result["rows"] if r.get("known_gap")]
    if gaps:
        blocks += [{"type": "heading", "text": "来源口径与基线缺口"}, {"type": "points", "items":
                    [r["page_title"] + " / " + r["label"] + "：" + r["known_gap"] for r in gaps]}]
    blocks += [{"type": "details", "summary": "给 AI 的完整更新任务单", "blocks":
                [{"type": "markdown", "text": task}], "open": False}]
    return {"title": "个人总看板 · 按需更新结果", "generator": "内容重取程序", "purpose":
            "把页面数字与登记来源对照，指出这次需要更新的句子。", "conclusion":
            [f"内容基线 {result['baseline']}；检查于 {result['observed_at']}（北京时间）；{len(changed)} 个同口径真变化，{len(pending)} 个口径待核。",
             "本次完成的是只读检查，页面内容尚未修改或发布。已登记只读入口仅取计数和状态；人工口径与取不到的新数保留原日期。"], "blocks": blocks}


def main():
    command_started = time.monotonic()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--registry", type=Path)
    parser.add_argument("--entries", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--inventory", action="store_true", help="只清点带日期/现状的作者输入，输出分组事实任务；不重取或生成网页")
    parser.add_argument("--strict", action="store_true", help="漏登记列出页/屏/原文并非零退出")
    parser.add_argument("--only", help="只检查逗号分隔的页")
    parser.add_argument("--no-report", action="store_true", help="只交机器清单和任务文件，不生成汇报网页")
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--total-seconds", type=float, default=300)
    parser.add_argument("--item-seconds", type=float, default=6)
    parser.add_argument("--retrieve", help=argparse.SUPPRESS)
    parser.add_argument("--retrieve-batch", help=argparse.SUPPRESS)
    args = parser.parse_args()
    entries_path = args.entries or (args.registry.parent if args.registry else args.root / "sources/refresh") / "entries.json"
    entries = read_json(entries_path) if entries_path.exists() else {}
    if args.retrieve or args.retrieve_batch:
        try:
            validate_entries(entries)
            value = retrieve_batch(json.loads(args.retrieve_batch), args.root, entries, args.item_seconds) if args.retrieve_batch else retrieve(json.loads(args.retrieve), args.root, entries)
        except Exception as exc:
            value = {"error": f"来源读取失败（{type(exc).__name__}）：{exc}"}
        print(json.dumps(value, ensure_ascii=False))
        return 0
    try:
        positive(args.total_seconds, "总时限")
        positive(args.item_seconds, "单项时限")
        validate_entries(entries)
    except ValueError as exc:
        parser.error(str(exc))
    registry = read_json(args.registry or args.root / "sources/refresh/registry.json")
    if registry.get("schema") != "content-refresh.sources.v1" or not isinstance(registry.get("records"), list):
        parser.error("来源表格式不符，records 必须是数组")
    output = args.output or Path("E:/Cache/content-refresh") / datetime.now(BEIJING).strftime("%Y%m%d-%H%M%S-%f")
    output.mkdir(parents=True, exist_ok=True)
    inventory = build_inventory(args.root / "sources/pages", registry["records"], entries)
    only = set(args.only.split(",")) if args.only else None
    if only:
        inventory["items"] = [i for i in inventory["items"] if i["page"] in only]
        inventory["review_stamps"] = [i for i in inventory.get("review_stamps", []) if i["page"] in only]
        registry = dict(registry, records=[r for r in registry["records"] if r["page"] in only])
        inventory["review_stamp_record_ids"] = sorted(set(inventory.get("review_stamp_record_ids", [])) & {r["id"] for r in registry["records"]})
    findings = strict_findings(inventory, registry["records"], entries) if args.strict else []
    inventory["strict_findings"] = findings
    write_inventory(output, inventory)
    if findings:
        for finding in findings:
            print(f"{finding['page']} / {finding['screen']} / {finding['field']}：{finding['excerpt']}；{finding['reason']}")
        print(json.dumps({"status": "incomplete", "missing": len(findings), "output": str(output)}, ensure_ascii=False))
        return 2
    if args.strict and not only and inventory["coverage"].get("required_items") and inventory["coverage"]["automatic_ratio"] < .85:
        print(json.dumps({"status": "insufficient_automatic_coverage", "coverage": inventory["coverage"]}, ensure_ascii=False))
        return 2
    if args.inventory:
        print(json.dumps({"status": "inventoried", "output": str(output), "coverage": inventory["coverage"]}, ensure_ascii=False))
        return 0
    (output / "tmp").mkdir(exist_ok=True)
    for key in ("TEMP", "TMP", "TMPDIR"):
        os.environ[key] = str((output / "tmp").resolve())
    command_deadline = command_started + args.total_seconds
    stamps = set(inventory.get("review_stamp_record_ids", []))
    registry = dict(registry, records=[r for r in registry["records"] if r["id"] not in stamps])
    result = collect(args.root, registry, max(0, command_deadline - time.monotonic() - 5), args.item_seconds, entries=entries, workers=args.workers, entries_path=entries_path)
    from apply_edits import build_number_edits
    (output / "number-edits.json").write_text(json.dumps(build_number_edits(args.root, result), ensure_ascii=False, indent=2), encoding="utf-8")
    task = task_text(result, registry)
    (output / "opus-task.md").write_text(task, encoding="utf-8")
    (output / "result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.no_report:
        print(json.dumps({"status": "checked", "output": str(output), "retrieval_seconds": result["retrieval_seconds"],
                          "automatic_success_ratio": result["automatic_success_ratio"]}, ensure_ascii=False))
        return 0
    content = output / "report-content.json"
    content.write_text(json.dumps(report_content(result, task), ensure_ascii=False), encoding="utf-8")
    html = output / "result.html"
    try:
        report_seconds = min(180, command_deadline - time.monotonic() - 10)
        if report_seconds <= 0:
            raise TimeoutError("总时限已到；机器结果已保存，汇报网页未生成")
        receipt = json.loads(bounded(["pwsh", "-NoProfile", "-File",
            "E:/.agents/skills/report-page/scripts/New-ReportPage.ps1", "-ContentPath", str(content),
            "-OutputPath", str(html), "-NoOpen", "-KeepDays", "0"], report_seconds))
        (output / "report-receipt.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2), encoding="utf-8")
        if (not html.is_file() or receipt.get("status") != "created" or receipt.get("opened") is not False
                or receipt.get("checks", {}).get("passed") is not True
                or Path(receipt.get("path", "")).resolve() != html.resolve()):
            raise RuntimeError("汇报网页生成或自检失败，不能交付为成功结果")
    except (OSError, ValueError, RuntimeError, TimeoutError, subprocess.SubprocessError) as exc:
        print(json.dumps({"status": "report_failed", "reason": str(exc), "output": str(output)}, ensure_ascii=False))
        return 1
    print(json.dumps({"status": "checked", "webpage": str(html)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

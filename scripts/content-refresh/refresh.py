"""按需运行的只读数字重取；不接入构建，不修改页面。"""
import argparse
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP
import glob
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time

sys.dont_write_bytecode = True
from checks import audit_pages

ROOT = Path(__file__).resolve().parents[2]
BEIJING = timezone(timedelta(hours=8))
NUMBER = re.compile(r"\d[\d,]*(?:\.\d+)?")


def read_text(path):
    raw = Path(path).read_bytes()
    encoding = "utf-32" if raw.startswith((b"\xff\xfe\x00\x00", b"\x00\x00\xfe\xff")) else (
        "utf-16" if raw.startswith((b"\xff\xfe", b"\xfe\xff")) else "utf-8-sig")
    return raw.decode(encoding)


def read_json(path):
    return json.loads(read_text(path))


def pages(root):
    return [read_json(p) for p in sorted((root / "sources/pages").glob("*/page.json"))]


def bounded(argv, seconds):
    flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
    proc = subprocess.Popen(argv, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                            encoding="utf-8", errors="replace", creationflags=flags)
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
    p = Path(path)
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


def retrieve(method, root):
    kind = method["kind"]
    if kind == "git_count":
        value = int(bounded(["git", "-C", str(resolve(method["path"], root)),
                             "rev-list", "--count", method.get("ref", "HEAD")], 30).strip())
    elif kind in ("file_count", "line_count"):
        files = matching_files(method, root)
        if kind == "line_count" and not files:
            raise ValueError("目录可读但没有匹配到代码文件；核对统计路径和范围，不能用零冒充新数")
        value = len(files) if kind == "file_count" else sum(
            read_text(p).count("\n") if method.get("newline_only") else
            sum(bool(line.strip()) or not method.get("nonempty")
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
    if record.get("page_number"):
        number = next(n for n in page.get("registry", {}).get("numbers", [])
                      if n["id"] == record["page_number"])
        observed = number.get("as_of", observed)
        text = number["text"]
    if record.get("page_pattern"):
        found = re.search(record["page_pattern"], text, re.M)
        if not found:
            raise ValueError("页面定位未匹配；不能用登记值冒充页面现值")
        value = found.group(1)
    else:
        if not record.get("page_number"):
            raise ValueError("未登记页面数值定位")
        value = NUMBER.findall(text)[record.get("value_index", 0)]
    if record.get("page_number") and record.get("automatic"):
        visible_numbers = [comparable(v) for v in NUMBER.findall(visible_text)]
        if comparable(value) not in visible_numbers and str(value) not in visible_text:
            raise ValueError("数字登记与可见正文未对上；同步登记或按正文重绑后再取数")
    return value, observed


def collect(root, registry, total_seconds=120, item_seconds=6, today=None):
    today = today or datetime.now(BEIJING).date()
    deadline = time.monotonic() + total_seconds
    catalog = {p["page"]: p for p in pages(root)}
    rows, cache = [], {}
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
        if record.get("historical") or record.get("frozen"):
            row.update(status="historical", reason="历史事实或冻结项目，本轮不重取")
        elif record.get("private"):
            row.update(status="needs_personal_data", reason="需本人资料：仅登记个数来源，本轮未读取")
        elif not record.get("automatic"):
            row["reason"] = record["retrieve"].get("instructions", "人工口径，未取得新值")
        elif row.get("page_error"):
            row["reason"] = row["page_error"]
        else:
            try:
                key = json.dumps(record["retrieve"], sort_keys=True)
                if key not in cache:
                    remaining = deadline - time.monotonic()
                    if remaining <= 0:
                        raise TimeoutError("总重取时限已到，跳过剩余来源")
                    argv = [sys.executable, str(Path(__file__).resolve()), "--retrieve",
                            key, "--root", str(root)]
                    reply = json.loads(bounded(argv, min(item_seconds, remaining)))
                    if isinstance(reply, dict) and "error" in reply:
                        raise ValueError(reply["error"])
                    cache[key] = reply
                row["new_value"] = cache[key]
                row["status"] = "unchanged" if comparable(row["old_value"]) == comparable(cache[key]) else "changed"
                row["source_observed_at"] = datetime.now(BEIJING).isoformat(timespec="seconds")
            except (OSError, ValueError, RuntimeError, TimeoutError, subprocess.SubprocessError) as exc:
                row["reason"] = str(exc)
        try:
            row["overdue"] = row["status"] != "historical" and (today - date.fromisoformat(row["page_date"])).days > 7
        except (TypeError, ValueError):
            row["overdue"] = False
            row["date_unknown"] = True
        rows.append(row)
    audit = audit_pages(root / "sources/pages", today, registry.get("retired_names", []))
    for finding in audit["findings"]:
        finding["page_title"] = catalog.get(finding["page"].split("/")[0], {}).get("title", finding["page"])
    return {"schema": "content-refresh.result.v1", "observed_at": datetime.now(BEIJING).isoformat(timespec="seconds"),
            "baseline": registry.get("baseline"), "pages_checked": audit["pages_checked"],
            "numbers_checked": len(rows), "rows": rows, "findings": audit["findings"]}


def task_text(result, registry):
    lines = ["# 按需更新任务单", "", "## 写法要点（本次内容审查）", ""]
    lines += [f"- {point}" for point in registry["writing_points"]]
    lines += ["", f"重取时间：{result['observed_at']}（北京时间）。本程序未修改、发布任何页面。",
              "只改变化的句子及受影响的同页解释，并同步数字登记；成功重取的过期数字更新日期。取不到时保留原日期并移出首屏。",
              "历史演进数字不动；检查命中是待复核线索，必要的技术事实移到技术依据层。", ""]
    for title, selected in (
        ("已重取且变化", [r for r in result["rows"] if r["status"] == "changed"]),
        ("未取得新值", [r for r in result["rows"] if r["status"] in ("unavailable", "needs_personal_data")]),
        ("超过七天仍待处理", [r for r in result["rows"] if r["overdue"]])):
        lines += [f"## {title}", ""]
        lines += [f"- {r['page']} / {r['screen']}：{r['label']}；页面 {r['old_value']} → 重取 {r['new_value']}；"
                  f"原日期 {r.get('page_date')}；来源 {r['source_location']}；{r['reason']}" for r in selected] or ["无。"]
        lines.append("")
    lines += ["## 来源口径与基线缺口", ""]
    lines += [f"- {r['page']} / {r['screen']}：{r['known_gap']}" for r in result["rows"] if r.get("known_gap")]
    lines += ["", "## 写法检查命中（逐项判断，不自动删改）", ""]
    lines += [f"- {f['page']} / {f['screen']} / {f['field']}:{f['line']}：{f['message']}；{f['excerpt']}"
              for f in result["findings"]] or ["无。"]
    return "\n".join(lines)


def report_content(result, task):
    changed = [r for r in result["rows"] if r["status"] == "changed"]
    missing = [r for r in result["rows"] if r["status"] in ("unavailable", "needs_personal_data")]
    overdue = [r for r in result["rows"] if r["overdue"]]
    blocks = [{"type": "metrics", "items": [{"value": v, "label": k} for k, v in (
        ("检查页面", result["pages_checked"]), ("登记数字", result["numbers_checked"]),
        ("重取后变化", len(changed)), ("未取得新值", len(missing)), ("写法命中", len(result["findings"])))]}]
    for title, selected in (("变了哪些", changed), ("取不到哪些", missing), ("超过七天待处理", overdue)):
        blocks += [{"type": "heading", "text": title}, {"type": "table", "columns":
            ["页 / 段", "数字含义", "页面旧数", "重取新数", "原日期", "来源与说明"], "rows":
            [[r["page_title"] + " / " + r["screen_title"] + "（" + r["screen"] + "）", r["label"], str(r["old_value"]) if r["old_value"] is not None else "未绑定正文数字",
              str(r["new_value"]) if r["new_value"] is not None else "未取到", r.get("page_date") or "未登记日期",
              r["source_location"] + "；" + r["reason"] + ("；" + r["known_gap"] if r.get("known_gap") else "")] for r in selected]}] if selected else [
                {"type": "heading", "text": title}, {"type": "text", "text": "本次无此项。"}]
    blocks += [{"type": "heading", "text": "写法检查命中"}, {"type": "table", "columns":
               ["页 / 段", "位置", "要复核的原因", "原文"], "rows":
               [[f["page_title"] + " / " + f["screen"], f"{f['field']}:{f['line']}", f["message"], f["excerpt"]]
                for f in result["findings"]]}] if result["findings"] else []
    gaps = [r for r in result["rows"] if r.get("known_gap")]
    if gaps:
        blocks += [{"type": "heading", "text": "来源口径与基线缺口"}, {"type": "points", "items":
                    [r["page_title"] + " / " + r["label"] + "：" + r["known_gap"] for r in gaps]}]
    blocks += [{"type": "details", "summary": "给 AI 的完整更新任务单", "blocks":
                [{"type": "markdown", "text": task}], "open": False}]
    return {"title": "个人总看板 · 按需更新结果", "generator": "内容重取程序", "purpose":
            "把页面数字与登记来源对照，指出这次需要更新的句子。", "conclusion":
            [f"检查于 {result['observed_at']}（北京时间）；{len(changed)} 个数字有变化，{len(overdue)} 个超过七天待处理。",
             "本次完成的是只读检查，页面内容尚未修改或发布。私人来源未读取；人工口径与取不到的新数保留原日期。"], "blocks": blocks}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--registry", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--total-seconds", type=float, default=120)
    parser.add_argument("--item-seconds", type=float, default=6)
    parser.add_argument("--retrieve", help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.retrieve:
        try:
            value = retrieve(json.loads(args.retrieve), args.root)
        except Exception as exc:
            value = {"error": f"来源读取失败（{type(exc).__name__}）：{exc}"}
        print(json.dumps(value, ensure_ascii=False))
        return 0
    if args.total_seconds <= 0 or args.item_seconds <= 0:
        parser.error("时限必须大于零")
    registry = read_json(args.registry or args.root / "sources/refresh/registry.json")
    if registry.get("schema") != "content-refresh.sources.v1" or not registry.get("records"):
        parser.error("来源表格式不符或没有登记数字")
    result = collect(args.root, registry, args.total_seconds, args.item_seconds)
    output = args.output or Path("E:/Cache/content-refresh") / datetime.now(BEIJING).strftime("%Y%m%d-%H%M%S-%f")
    output.mkdir(parents=True, exist_ok=True)
    (output / "tmp").mkdir(exist_ok=True)
    for key in ("TEMP", "TMP", "TMPDIR"):
        os.environ[key] = str((output / "tmp").resolve())
    task = task_text(result, registry)
    (output / "opus-task.md").write_text(task, encoding="utf-8")
    (output / "result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    content = output / "report-content.json"
    content.write_text(json.dumps(report_content(result, task), ensure_ascii=False), encoding="utf-8")
    html = output / "result.html"
    try:
        receipt = json.loads(bounded(["pwsh", "-NoProfile", "-File",
            "E:/.agents/skills/report-page/scripts/New-ReportPage.ps1", "-ContentPath", str(content),
            "-OutputPath", str(html), "-NoOpen", "-KeepDays", "0"], 180))
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

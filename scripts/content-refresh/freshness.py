"""按需更新的时间依据、频率与原位闭环；不运行后台任务。"""
from datetime import date, datetime, timedelta, timezone
from html import unescape
from html.parser import HTMLParser
import json
import hashlib
from pathlib import Path
import re

BEIJING = timezone(timedelta(hours=8))
BASE_POLICY = dict(current="every_request", semantic_review_days=28, historical="preserve")
BASES = {"live_read", "snapshot_timestamp", "coverage_end", "unknown"}
LIVE_METHODS = {"git_count", "file_count", "line_count", "regex_count", "page_count", "group_count", "feature_count", "sqlite_ro", "rules_inspect", "log_window"}


def now():
    return datetime.now(BEIJING).isoformat(timespec="seconds")


def valid_time(value):
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).isoformat()
    except (ValueError, TypeError):
        return None


def cadence(record, policy=None, today=None, historical=False, targeted=False):
    policy, today = dict(BASE_POLICY, **(policy or {})), today or datetime.now(BEIJING).date()
    kind = "historical" if historical or record.get("historical") or record.get("frozen") else record.get("freshness_class", "current")
    due, reason, stamp = kind == "current", "every_request", True
    if kind == "historical":
        due, reason = False, "historical_preserve"
    elif kind == "semantic":
        stamp = valid_time(record.get("semantic_checked_at"))
        due = targeted or record.get("source_changed") is True or not stamp or (today - date.fromisoformat(stamp[:10])).days >= policy["semantic_review_days"]
        reason = "targeted_project" if targeted else "source_changed" if record.get("source_changed") else "semantic_checked_at_unknown" if not stamp else "semantic_review_due" if due else "semantic_current"
    return dict(freshness_class=kind, refresh_due=due, freshness_status="due_unknown" if kind == "semantic" and not stamp else "due" if due else "current", cadence_reason=reason, overdue=due)


def metadata(document, method, entry=None, checked_at=None):
    config = dict(entry or {}, **method)
    checked_at = checked_at or now()
    values = {}
    for name in ("source_observed_at", "source_coverage_end"):
        pointer = config.get(name + "_pointer")
        try:
            value = document
            if pointer is not None:
                for key in pointer:
                    value = value[int(key)] if isinstance(value, list) else value[key]
            else:
                value = document.get(name) if isinstance(document, dict) else None
                if value is None and isinstance(document, dict) and isinstance(document.get("metadata"), dict):
                    value = document["metadata"].get(name)
            stamp = valid_time(value)
            values[name] = stamp[:10] if name == "source_coverage_end" and stamp else stamp
        except (KeyError, IndexError, TypeError, ValueError):
            values[name] = None
    basis = config.get("observation_basis", "live_read" if method.get("kind") in LIVE_METHODS else "coverage_end" if method.get("kind") == "usage_ledger" else "unknown")
    if basis == "live_read":
        values["source_observed_at"] = checked_at
    elif basis not in {"snapshot_timestamp", "coverage_end"} or not values["source_observed_at" if basis == "snapshot_timestamp" else "source_coverage_end"]:
        basis = "unknown"
        values = dict(source_observed_at=None, source_coverage_end=None)
    return dict(checked_at=checked_at, observation_basis=basis, **values)


def review_tasks(inventory, rows, targeted=()):
    tasks = [dict(id="review:" + i["id"], page=i["page"], field=i["field"], kind=i["kind"],
                  reason="需要实际人工核对并提供本轮依据", status="pending")
             for i in inventory.get("items", []) if not i.get("historical") and (not targeted or i["page"] in targeted)
             and (i.get("review_stamp") or i["kind"] == "status_line.state")]
    return tasks


def semantic_due(inventory, rows=()):
    pages = {t["page"] for t in inventory.get("semantic_reviews", [])}
    pages.update(r["page"] for r in rows if r.get("freshness_class") == "semantic" and r.get("refresh_due"))
    return dict(count=len(pages), pages=sorted(pages))


def sync_registry(path, rows):
    """只同步已完成原位回读的记录，不改历史或失败项。"""
    path = Path(path)
    if not path.exists():
        return dict(status="not_present", records=[])
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    updates, changed = {r["id"]: r for r in rows}, []
    for record in data["records"]:
        row = updates.get(record["id"])
        if row is None or row.get("status") == "historical":
            continue
        record["current_value"] = row["new_value"]
        for key in ("checked_at", "source_observed_at", "source_coverage_end", "observation_basis"):
            record[key] = row.get(key)
        record["observed_at"] = row.get("source_observed_at")
        changed.append(record["id"])
    if changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
        actual = {r["id"]: r for r in json.loads(path.read_text(encoding="utf-8-sig"))["records"]}
        if any(actual[rid]["current_value"] != updates[rid]["new_value"] for rid in changed):
            raise ValueError("来源登记同步回读不一致")
    return dict(status="synced", records=changed)


class DisplayText(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts, self.hidden = [], 0

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}: self.hidden += 1
        elif tag in {"p", "div", "br", "li", "section", "h1", "h2", "h3"}: self.parts.append(" ")

    def handle_endtag(self, tag):
        if tag in {"script", "style"}: self.hidden = max(0, self.hidden - 1)
        elif tag in {"p", "div", "li", "section"}: self.parts.append(" ")

    def handle_data(self, data):
        if not self.hidden: self.parts.append(data)


def display_readback(root, dist, page, fragment):
    md = root / "site-astro/src/content/pages" / (page + ".md")
    text = md.read_text("utf-8-sig") if md.exists() else ""
    route = json.loads(text.split("\n---\n", 1)[0][4:]).get("url", "/" + page + "/") if text.startswith("---\n") else "/" + page + "/"
    target = Path(dist) / route.lstrip("/")
    target = target / "index.html" if not target.suffix else target
    parser = DisplayText(); parser.feed(target.read_text("utf-8-sig"))
    normalize = lambda value: " ".join(unescape(value).split())
    return "verified" if normalize(fragment) and normalize(fragment) in normalize("".join(parser.parts)) else "failed"


def derived_md_line(root, page, screen):
    md = root / "site-astro/src/content/pages" / (page + ".md")
    text = md.read_text("utf-8-sig")
    match = re.search(r"::screen\{#" + re.escape(screen) + r"\b[^\n]*\}\n\n```typeset\n(.*?)\n```", text, re.S)
    if not match:
        return None
    line = json.loads(match[1]).get("screen", {}).get("derived_as_of")
    return line if isinstance(line, str) and re.fullmatch(r"数字截至 \d{4} 年 \d{1,2} 月 \d{1,2} 日", line) else None


def verified_field(root, proof):
    from apply_edits import field_at, digest
    parent, key = field_at(json.loads((root / proof["file"]).read_text("utf-8-sig")), proof["field"])
    return proof.get("status") == "verified" and digest(parent[key]) == proof.get("sha256")


def close_run(root, result, report=None, dist=None):
    from refresh import pages, page_value, comparable
    from apply_edits import same_value, field_at, digest
    from authors import resolve_author
    root, report = Path(root), report or {}
    run_id = result.get("run_id")
    if not run_id or result.get("schema") != "content-refresh.result.v1":
        raise ValueError("闭环只接受含 run_id 的真实 collect 结果")
    if report and report.get("run_id") != run_id:
        raise ValueError("应用回执与取数 run_id 不一致")
    catalog = {p["page"]: p for p in pages(root)}
    applied = {r["record_id"]: r for r in report.get("record_readback", []) if r.get("status") == "verified"}
    markdown = {m["page"]: m for m in report.get("markdown_readback", [])}
    outcomes, synced = [], []
    for row in result["rows"]:
        status, reason, display = "pending", row.get("reason", ""), "not_checked"
        if row["status"] == "historical":
            status = "historical_preserved"
        elif row.get("freshness_class") == "semantic":
            status = "semantic_due" if row.get("refresh_due") else "semantic_current"
        else:
            try:
                proof = applied.get(row["id"])
                if row["status"] == "changed" and proof:
                    locator = proof["locator"]
                    if resolve_author(root, row["page"], locator.get("logical_field", locator["field"])) != {k: locator[k] for k in ("file", "field")}:
                        raise ValueError("真实作者定位已变化")
                    document = json.loads((root / locator["file"]).read_text("utf-8-sig")) if locator.get("file") else catalog[row["page"]]
                    parent, key = field_at(document, locator["field"])
                    if digest(parent[key]) != proof["field_sha256"]:
                        raise ValueError("应用后字段又发生变化")
                    actual = parent[key][locator["start"]:locator["end"]]
                else:
                    actual, _ = page_value(row, catalog[row["page"]], root)
                equal = lambda value: comparable(actual) == comparable(value) or same_value(str(actual), value)
                if row["status"] == "changed":
                    fields = [f for f in report.get("field_readback", []) if row["id"] in f.get("record_ids", [])]
                    md = markdown.get(row["page"], {})
                    md_path = root / "site-astro/src/content/pages" / (row["page"] + ".md")
                    verified = fields and all(verified_field(root, f) for f in fields)
                    verified = verified and md.get("status") == "verified" and md_path.is_file() and hashlib.sha256(md_path.read_bytes()).hexdigest() == md.get("sha256")
                    # 带时分的截至写的是取数时刻，记录新值只有日期；按应用时实际写入的文字核对。
                    written = equal(row["new_value"]) or proof and actual == proof["locator"].get("expected")
                    if row["id"] in applied and written and verified:
                        date_line = derived_md_line(root, row["page"], row["screen"]) if row.get("derive_as_of") else None
                        if row.get("derive_as_of") and not date_line:
                            raise ValueError("派生截至日期未进入渲染输入")
                        if dist is not None:
                            display = display_readback(root, dist, row["page"], proof.get("fragment", str(actual)))
                            if display != "verified": raise ValueError("成品未找到新片段")
                            if date_line and display_readback(root, dist, row["page"], date_line) != "verified":
                                raise ValueError("成品未找到派生截至日期")
                        status = "applied_readback_verified"
                        synced.append(row)
                    else:
                        reason = "变化项缺同轮字段、记录或 Markdown 成功回读"
                elif row["status"] == "unchanged" and row.get("checked_at") and row.get("observation_basis") != "unknown" and equal(row["new_value"]):
                    if row.get("derive_as_of"):
                        md = markdown.get(row["page"], {})
                        md_path = root / "site-astro/src/content/pages" / (row["page"] + ".md")
                        if (not proof or md.get("status") != "verified" or not md_path.is_file()
                                or hashlib.sha256(md_path.read_bytes()).hexdigest() != md.get("sha256")):
                            raise ValueError("派生日期缺同轮应用与 Markdown 回读")
                        date_line = derived_md_line(root, row["page"], row["screen"])
                        if not date_line:
                            raise ValueError("派生截至日期未进入渲染输入")
                        if dist is not None and display_readback(root, dist, row["page"], date_line) != "verified":
                            raise ValueError("成品未找到派生截至日期")
                    status = "checked_unchanged"
                    synced.append(row)
                elif row["status"] in {"unavailable", "domain_fact_task", "scope_pending"} and row.get("checked_at") and reason and equal(row["old_value"]):
                    status = "unknown_preserved"
            except (OSError, KeyError, ValueError, IndexError, StopIteration) as exc:
                if dist is not None and row["status"] == "changed": display = "failed"
                reason = "原位回读失败：" + str(exc)
        outcomes.append(dict(record_id=row["id"], status=status, reason=reason, display_readback=display))
    resolutions = {r.get("id"): r for r in report.get("manual_closures", [])
                   if r.get("id") and r.get("run_id") == run_id and valid_time(r.get("checked_at")) and r.get("evidence") and r.get("status") == "completed"}
    tasks = [dict(t, status="completed" if t["id"] in resolutions else "pending") for t in result.get("manual_tasks", [])]
    for outcome in outcomes:
        if outcome["status"] == "semantic_due" and "semantic:" + next(r["page"] for r in result["rows"] if r["id"] == outcome["record_id"]) in resolutions:
            outcome["status"] = "manual_completed"
    semantic = {rid[9:]: dict(checked_at=r["checked_at"], run_id=run_id, evidence=r["evidence"])
                for rid, r in resolutions.items() if rid.startswith("semantic:") and rid[9:] in result.get("semantic_due", {}).get("pages", [])}
    if semantic:
        path = root / "sources/refresh/semantic-reviews.json"
        data = json.loads(path.read_text("utf-8-sig")) if path.exists() else dict(schema="content-refresh.semantic-reviews.v1", pages={})
        data["pages"].update(semantic)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    pending = [o for o in outcomes if o["status"] in {"pending", "manual_pending"}] + [t for t in tasks if t["status"] == "pending"]
    return dict(schema="content-refresh.closure.v1", run_id=run_id, checked_at=now(),
                status="incomplete" if pending else "closed", rows=outcomes, manual_tasks=tasks,
                semantic_due=result.get("semantic_due", dict(count=0, pages=[])),
                registry_sync=sync_registry(result.get("registry_path") or root / "sources/refresh/registry.json", synced), pending=len(pending))

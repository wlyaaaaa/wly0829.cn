"""按需更新的时间依据、频率与原位闭环；不运行后台任务。"""
from datetime import date, datetime, timedelta, timezone
from html import unescape
from html.parser import HTMLParser
from functools import lru_cache
import json
import hashlib
from pathlib import Path
import re
import runpy
import sys
from editorial_ledger import stage_reviews

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "src/typeset"))

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
    excluded = {r["page"] for r in rows if r.get("status") == "excluded"}
    tasks = [dict(id="review:" + i["id"], page=i["page"], field=i["field"], kind=i["kind"],
                  reason="需要实际人工核对并提供本轮依据", status="pending")
             for i in inventory.get("items", []) if i["page"] not in excluded and not i.get("historical") and (not targeted or i["page"] in targeted)
             and (i.get("review_stamp") or i["kind"] == "status_line.state")]
    return tasks


def semantic_due(inventory, rows=()):
    excluded = {r["page"] for r in rows if r.get("status") == "excluded"}
    pages = {t["page"] for t in inventory.get("semantic_reviews", []) if t["page"] not in excluded}
    pages.update(r["page"] for r in rows if r["page"] not in excluded and r.get("freshness_class") == "semantic" and r.get("refresh_due"))
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
    STATUS_LABELS = {"在用": "on", "待验收": "pending", "待实施": "ring", "没用过": "unused", "说不准": "uncertain", "已停用": "off"}

    def __init__(self):
        super().__init__(); self.parts, self.hidden = [], 0
        self.stack, self.feature_articles, self.live_bindings = [], [], set()

    def append(self, text):
        self.parts.append(text)
        for frame in self.stack:
            if "feature" in frame: frame["feature"]["parts"].append(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        frame = dict(tag=tag, attrs=attrs)
        if tag == "article" and "feature-item" in attrs.get("class", "").split():
            frame["feature"] = dict(parts=[], state=attrs.get("data-state"), projected=False)
            self.feature_articles.append(frame["feature"])
        if not self.hidden:
            article = next((f["feature"] for f in reversed(self.stack) if "feature" in f), None)
            label = attrs.get("data-text", "")
            word = label[1:-1] if label.startswith("〈") and label.endswith("〉") else label
            if (tag == "span" and "feature-status-dot" in attrs.get("class", "").split() and article and word in self.STATUS_LABELS
                    and self.STATUS_LABELS.get(word) == attrs.get("data-state") == article["state"]):
                # 图例代替原状态词，只在同一张真实功能卡内恢复其语义。
                article["parts"].append(label); article["projected"] = True
            screen = next((f["attrs"] for f in reversed(self.stack) if f["tag"] == "section" and "ts-screen" in f["attrs"].get("class", "").split()), {})
            live = next((f["attrs"] for f in reversed(self.stack) if f["attrs"].get("data-comp") in {"live_strip", "live_box"}), {})
            if (screen.get("id") and live and live.get("data-status-line") != "static"
                    and attrs.get("data-hot") == "live" and attrs.get("data-href")):
                self.live_bindings.add((screen["id"], live["data-comp"], attrs["data-href"]))
        if tag in {"script", "style"}: self.hidden += 1
        elif tag in {"p", "div", "br", "li", "section", "h1", "h2", "h3"}: self.append(" ")
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append(frame)

    def handle_endtag(self, tag):
        if tag in {"script", "style"}: self.hidden = max(0, self.hidden - 1)
        elif tag in {"p", "div", "li", "section"}: self.append(" ")
        index = next((i for i in range(len(self.stack) - 1, -1, -1) if self.stack[i]["tag"] == tag), None)
        if index is not None: del self.stack[index:]

    def handle_data(self, data):
        if not self.hidden: self.append(data)


def dynamic_status_replaces_static(text, parser):
    """只认可官方首屏渲染输入及同屏成品中确有对应动态热区的既有优先规则。"""
    match = re.search(r"::screen\{#[^\n]*\}\n\n```typeset\n(.*?)\n```", text, re.S)
    if not match: return False
    meta = json.loads(match[1]); screen = meta.get("screen", {})
    keys = screen.get("live", [])
    if screen.get("section") != "top" or not keys or not isinstance(keys, list): return False
    layouts = meta.get("layout", {})
    if not layouts: return False
    for layout in layouts.values():
        blocks = layout.get("blocks", [])
        title = next((i for i, b in enumerate(blocks) if b.get("type") == "chapter_title"), None)
        live = [b for b in blocks[(title + 1):] if b.get("type") in {"live_strip", "live_box"}] if title is not None else []
        if not live or any(b.get("static_items") for b in live): return False
        for block in live:
            bound = block.get("keys", keys)
            if isinstance(bound, str): bound = [bound]
            if not bound or any((screen["id"], block["type"], key) not in parser.live_bindings for key in bound): return False
    return True


@lru_cache(maxsize=1)
def display_rules():
    return runpy.run_path(str(Path(__file__).resolve().parents[2] / "site-astro/tools/convert_page.py"))


def display_readback(root, dist, page, fragment, proof=None):
    from apply_edits import display_fragment, field_at
    from engine.parse import canon, expected_text
    md = root / "site-astro/src/content/pages" / (page + ".md")
    text = md.read_text("utf-8-sig") if md.exists() else ""
    route = json.loads(text.split("\n---\n", 1)[0][4:]).get("url", "/" + page + "/") if text.startswith("---\n") else "/" + page + "/"
    target = Path(dist) / route.lstrip("/")
    target = target / "index.html" if not target.suffix else target
    parser = DisplayText(); parser.feed(target.read_text("utf-8-sig"))
    visible = canon(unescape("".join(parser.parts)))
    def displayed(value):
        expected = expected_text(unescape(value))
        return bool(expected) and (expected in visible or any(article["projected"] and expected in canon(unescape("".join(article["parts"]))) for article in parser.feature_articles))
    if proof and proof.get("locator", {}).get("file"):
        locator = proof["locator"]
        document = json.loads((root / locator["file"]).read_text("utf-8-sig"))
        parent, key = field_at(document, locator["field"])
        if "{{" not in parent[key]:
            fragment = display_fragment(parent[key], locator["start"], locator["end"])
        if displayed(fragment):
            return "verified"
        field = locator.get("logical_field", locator["field"])
        status = json.loads((root / "sources/pages" / page / "page.json").read_text("utf-8-sig")).get("status_line", {})
        if status and field.startswith("status_line.") and dynamic_status_replaces_static(text, parser):
            from authors import markdown_checks
            if markdown_checks(root, [page]).get(page): return "not_displayed_by_contract"
        if status and (field.startswith("status_line.") or field.endswith(".as_of") or "截至" in fragment):
            rules = display_rules(); items, note = rules["status_items"](status)
            if field == "status_line.source" and len(str(status.get("source", "")).strip()) > 16:
                return "not_displayed_by_contract"
            if field == "status_line.last.at" and items:
                fragment = items[0]["text"]
            elif field in {"status_line.as_of", "status_line.source"}:
                fragment = note
            elif (field.endswith(".as_of") and parent[key] == status.get("as_of")
                    or rules["same_day_note"](expected_text(fragment), status.get("as_of"))):
                fragment = note
        if field.endswith(".as_of") and re.fullmatch(r"\d{4}-\d{2}-\d{2}", parent[key]):
            year, month, day = parent[key].split("-")
            dated = f"数字截至 {year} 年 {int(month)} 月 {int(day)} 日"
            if expected_text(dated) in visible: return "verified"
    return "verified" if displayed(fragment) else "failed"


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
    from apply_edits import same_value, field_at, digest, locate, display_fragment, CHINESE_DATE
    from authors import resolve_author, markdown_checks
    from selection import Selection
    root, report = Path(root), report or {}
    run_id = result.get("run_id")
    if not run_id or result.get("schema") != "content-refresh.result.v1":
        raise ValueError("闭环只接受含 run_id 的真实 collect 结果")
    if report and report.get("run_id") != run_id:
        raise ValueError("应用回执与取数 run_id 不一致")
    catalog = {p["page"]: p for p in pages(root)}
    selection = Selection(root, result.get("manual_owner_request", []))
    _, excluded = selection.partition(result["rows"])
    excluded_ids = {r["record_id"] for r in excluded}
    applied = {r["record_id"]: r for r in report.get("record_readback", []) if r.get("status") == "verified"}
    markdown = {m["page"]: m for m in report.get("markdown_readback", [])}
    resolutions = {r.get("id"): r for r in report.get("manual_closures", [])
                   if r.get("id") and r.get("run_id") == run_id and valid_time(r.get("checked_at")) and r.get("evidence") and r.get("status") == "completed"}
    submitted = {r.get("id") for r in report.get("manual_closures", [])}
    submitted.update("record:" + r["id"] for r in result["rows"] if r.get("manual_closure_required"))
    manual_sources = {r["id"] for r in result["rows"] if r["status"] in {"unavailable", "domain_fact_task"}
                      and r.get("automatic") is False and r.get("retrieve", {}).get("kind") == "manual"
                      and not r.get("page_error") and r.get("scope_status") == "verified"}
    manual_pages = {r["page"] for r in result["rows"] if (r["status"] == "manual_review" and r.get("qualifies")
                    or r["id"] in manual_sources) and "record:" + r["id"] in resolutions}
    manual_markdown = markdown_checks(root, manual_pages) if dist is not None and manual_pages else {}
    outcomes, synced = [], []
    for row in result["rows"]:
        status, reason, display = "pending", row.get("reason", ""), "not_checked"
        if row["id"] in excluded_ids:
            status, reason = "excluded", selection.reason(row["page"]) or row.get("reason", "取数时未纳入本轮")
        elif row["status"] == "historical":
            status = "historical_preserved"
        elif row.get("freshness_class") == "semantic":
            status = "semantic_due" if row.get("refresh_due") else "semantic_current"
        else:
            try:
                if (row["id"] == "how-model-roster-updated-date" and row["status"] in {"changed", "unchanged"}
                        and report.get("model_roster_sync", {}).get("status") != "verified"):
                    raise ValueError("公开模型快照同步未通过")
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
                            display = display_readback(root, dist, row["page"], proof.get("fragment", str(actual)), proof)
                            if display not in {"verified", "not_displayed_by_contract"}: raise ValueError("成品未找到新片段")
                            if date_line and display_readback(root, dist, row["page"], date_line) != "verified":
                                raise ValueError("成品未找到派生截至日期")
                        status = "source_only_verified" if display == "not_displayed_by_contract" else "applied_readback_verified"
                        if status == "source_only_verified": reason = "作者与官方 Markdown 已回读；按渲染契约此静态字段不显示（首屏动态状态条优先或来源长注省略），不计成品显示通过"
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
                elif row["status"] == "manual_review" and row.get("qualifies") or row["id"] in manual_sources and "record:" + row["id"] in submitted:
                    closed = resolutions.get("record:" + row["id"], {})
                    source = row["id"] in manual_sources
                    if (not isinstance(closed.get("evidence"), str) or not closed["evidence"].strip()
                            or closed.get("actual_value") is None or str(closed["actual_value"]).strip().lower() in {"", "unknown", "未知", "none", "null"}
                            or not equal(closed["actual_value"])):
                        raise ValueError("人工事实缺同轮核对、仍未知或与当前展示值不同")
                    if source:
                        observed = datetime.fromisoformat(str(closed.get("source_observed_at")))
                        checked = datetime.fromisoformat(str(closed.get("checked_at")))
                        if (not observed.tzinfo or not checked.tzinfo or observed > checked or closed.get("manual_scope_verified") is not True
                                or not isinstance(closed.get("source_location"), str) or not closed["source_location"].strip()):
                            raise ValueError("人工来源缺真实时间、位置或逐项口径确认")
                    elif not (CHINESE_DATE.fullmatch(str(actual)) or valid_time(actual)) or not same_value(str(actual), actual):
                        raise ValueError("人工日期不是有效日期")
                    chinese = CHINESE_DATE.fullmatch(str(actual))
                    if (chinese and not chinese[1] and re.match(r"\d{4}-", str(closed["actual_value"]))
                            and str(closed["actual_value"])[:4] != str(row.get("date_candidate", ""))[:4]):
                        raise ValueError("人工日期年份与来源候选不一致")
                    md, md_path = markdown.get(row["page"], {}), root / "site-astro/src/content/pages" / (row["page"] + ".md")
                    if (not manual_markdown.get(row["page"]) or md.get("status") != "verified" or not md_path.is_file()
                            or hashlib.sha256(md_path.read_bytes()).hexdigest() != md.get("sha256")):
                        raise ValueError("人工日期缺当前作者转换与 Markdown 成功回读")
                    field = row.get("field", row.get("page_field"))
                    locator = resolve_author(root, row["page"], field)
                    parent, key = field_at(json.loads((root / locator["file"]).read_text("utf-8-sig")), locator["field"])
                    start, end = locate(parent[key], row)
                    bound, bound_key = field_at(catalog[row["page"]], field)
                    fragment = display_fragment(parent[key], start, end, bound[bound_key])
                    proof = dict(locator=dict(locator, logical_field=field, start=start, end=end))
                    display = display_readback(root, dist, row["page"], fragment, proof)
                    if display not in {"verified", "not_displayed_by_contract"}: raise ValueError("成品未找到人工日期的实际上下文")
                    status = "source_only_verified" if display == "not_displayed_by_contract" else "manual_source_verified" if source else "manual_review_verified"
                    reason = ("作者与官方 Markdown 已回读；按渲染契约此静态字段不显示（首屏动态状态条优先或来源长注省略），不计成品显示通过："
                              if display == "not_displayed_by_contract" else "人工已核对作者、Markdown 与成品：") + str(closed["evidence"])
                elif (row["status"] in {"unavailable", "domain_fact_task", "scope_pending"} and row.get("checked_at") and reason and equal(row["old_value"])
                      and not (row.get("raw_status") in {"changed", "unchanged"} and row.get("raw_new_value") is not None)):
                    status = "unknown_preserved"
            except (OSError, KeyError, ValueError, IndexError, StopIteration) as exc:
                if dist is not None and row["status"] == "changed": display = "failed"
                reason = "原位回读失败：" + str(exc)
        outcomes.append(dict(record_id=row["id"], status=status, reason=reason, display_readback=display))
    tasks = [dict(t, status="completed" if t["id"] in resolutions else "pending")
             for t in selection.partition(result.get("manual_tasks", []))[0]]
    for outcome in outcomes:
        if outcome["status"] == "semantic_due" and "semantic:" + next(r["page"] for r in result["rows"] if r["id"] == outcome["record_id"]) in resolutions:
            outcome["status"] = "manual_completed"
    semantic = {rid[9:]: dict(checked_at=r["checked_at"], run_id=run_id, evidence=r["evidence"])
                for rid, r in resolutions.items() if rid.startswith("semantic:") and not selection.reason(rid[9:]) and rid[9:] in result.get("semantic_due", {}).get("pages", [])}
    if semantic:
        stage_reviews(root, semantic)
    pending = [o for o in outcomes if o["status"] in {"pending", "manual_pending"}] + [t for t in tasks if t["status"] == "pending"]
    semantic_pages = [p for p in result.get("semantic_due", {}).get("pages", []) if not selection.reason(p)]
    return dict(schema="content-refresh.closure.v1", run_id=run_id, checked_at=now(),
                excluded=excluded,
                status="incomplete" if pending else "closed", rows=outcomes, manual_tasks=tasks,
                semantic_due=dict(count=len(semantic_pages), pages=semantic_pages),
                registry_sync=dict(status="pending_publication", records=[]), registry_pending=synced, pending=len(pending))

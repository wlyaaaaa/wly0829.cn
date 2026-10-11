"""只清点作者输入；不重取来源、不联网、不生成网页。"""
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import re
import sys

from checks import DATE, HISTORY, WORDS
from validation import record_errors, registry_errors, validate_entries, LEDGER

BEIJING = timezone(timedelta(hours=8))
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "src/typeset"))
from engine import parse as parser
from engine.layout import assign_by_spec


def current_prefix(ref, candidates):
    """与转换器相同的正文归一和只差数字定位；歧义时不猜。"""
    ref = parser.canon(parser.normalize(ref.split("|")[0]))
    if ref and any(t.startswith(ref) for t in candidates):
        return ref
    digits = lambda value: re.sub(r"\d[\d,.]*", "#", value)
    prefixes = {t[:k] for t in candidates for k in range(1, min(len(t), len(ref) + 12) + 1)
                if digits(ref) != ref and digits(t[:k]) == digits(ref)}
    return next(iter(prefixes)) if len(prefixes) == 1 else ""


def strings(value, field=""):
    if isinstance(value, dict):
        for key, item in value.items():
            yield from strings(item, f"{field}.{key}" if field else key)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from strings(item, f"{field}[{index}]")
    elif isinstance(value, str):
        yield field, value


def source_project(record):
    source = str(record.get("retrieve", {}).get("path", "")) + " " + record.get("source_location", "")
    source = source.replace("\\", "/")
    if re.search(r"/PCConfig(?:/|\b)|/AiUsageLedger(?:/|\b)|AI\s*使用小记录", source, re.I):
        return "pcconfig"
    if re.search(r"/\.agents(?:/|\b)", source, re.I):
        return "agents"
    found = re.search(r"/(?:Projects|20_Projects)/(?:Tools/|Backups/|Archives/)?([^/；，\s]+)", source, re.I)
    if found:
        owner = record["page"].removeprefix("skill-")
        return owner if re.sub(r"[-_.]", "", owner).lower() == re.sub(r"[-_.]", "", found[1]).lower() else found[1]
    return "wly0829.cn" if "本仓库" in source else record.get("source_project", record["page"].removeprefix("skill-"))


def matches(record, item, page, text):
    """绑定实际字段/捕获位置；同屏存在另一条来源不构成匹配。"""
    if record["page"] != item["page"] or item["screen"] not in {
            record["screen"], *record.get("affected_screens", [])}:
        return False
    field = record.get("field", record.get("page_field"))
    if field and field != item["field"]:
        return False
    if field and ("start" in record or "end" in record):
        start, end = record.get("start", 0), record.get("end", len(text))
        return (type(start) is int and type(end) is int and 0 <= start < end <= len(text)
                and start < item["end"] and end > item["start"])
    if record.get("page_pattern") and (field or re.fullmatch(r"screens\[\d+\]\.text", item["field"])):
        try:
            found_values = list(re.finditer(record["page_pattern"], text, re.M))
            for found in found_values if len(found_values) == 1 else []:
                start, end = found.span(1 if found.lastindex else 0)
                if start < item["end"] and end > item["start"]:
                    return True
        except re.error:
            return False
        return False
    if field:
        # 正文整字段可能含多条事实；无范围/唯一捕获不能一次盖住它们。
        return not re.fullmatch(r"screens\[\d+\]\.text", field)
    number_id = record.get("page_number")
    number = next((n for n in page.get("registry", {}).get("numbers", []) if n.get("id") == number_id), None)
    if not number:
        return False
    if item.get("page_number") == number_id:
        return True
    if not re.fullmatch(r"screens\[\d+\]\.text", item["field"]) or item["kind"] not in {"first_screen_card", "as_of"}:
        return False
    needle = parser.canon(number.get("text", ""))
    # 只有一个孤立数字不能证明含义；完整数字登记原话必须在所属正文唯一出现。
    if not needle or re.fullmatch(r"[\d,.]+", needle):
        return False
    pattern = r"(?<![\d.])" + re.escape(needle) + r"(?![\d.])"
    return (len(re.findall(pattern, parser.canon(text))) == 1
            and bool(re.search(pattern, parser.canon(item["excerpt"]))))


def build_inventory(pages_root, records, entries=None):
    paths = sorted(Path(pages_root).glob("*/page.json"))
    items, cutoff_surfaces = [], Counter()
    status_pages, cutoff_pages, matched_private, historical_pairs, located_records = set(), set(), set(), set(), set()
    by_page, source_aliases = defaultdict(list), {}
    ids = {r["id"] for r in records}
    valid_ids = {r["id"] for r in records if not record_errors(r, entries or {}, ids)}
    for record in records:
        by_page[record["page"]].append(record)
    for path in paths:
        page = json.loads(path.read_text(encoding="utf-8-sig"))
        slug = page.get("page", path.parent.name)
        if page.get("kind") in {"project", "frozen"}:
            source_aliases[re.sub(r"[-_.]", "", slug).lower()] = slug
        screens = page.get("screens", [])
        first = next(iter(screens), {})
        numbers = page.get("registry", {}).get("numbers", [])
        frozen = page.get("kind") == "frozen" or page.get("status") in {"frozen", "冻结", "已冻结", "historical", "历史"}
        historical_pairs.update((slug, s["id"]) for s in screens if frozen or
            s.get("section") in {"history", "evolution", "timeline"} or HISTORY.search(s.get("title", "")))

        def add(kind, field, text, start=0, end=None, screen=None, surface="visible", original_date=None):
            found = re.match(r"screens\[(\d+)\]", field)
            screen = screen or (screens[int(found[1])] if found else first)
            number_match = re.match(r"registry\.numbers\[(\d+)\]", field)
            number = numbers[int(number_match[1])] if number_match else None
            if number:
                screen = next((s for s in screens if s["id"] in number.get("screens", [])), first)
            end = len(text) if end is None else end
            line_start, line_end = text.rfind("\n", 0, start) + 1, text.find("\n", end)
            excerpt = text[start:end] if kind == "first_screen_card" else text[line_start:line_end if line_end >= 0 else len(text)]
            historical = (slug, screen.get("id")) in historical_pairs
            item = dict(id=f"item-{len(items) + 1}", page=slug, screen=screen.get("id", ""),
                        kind=kind, surface=surface, field=field, start=start, end=end,
                        line=text.count("\n", 0, start) + 1, excerpt=excerpt,
                        original_date=original_date, historical=historical, page_number=number.get("id") if number else None)
            bound = [r for r in by_page[slug] if matches(r, item, page, text)]
            active = [r for r in bound if not r.get("historical") and not r.get("frozen")]
            sources = active or bound
            hint = page.get("status_line", {}).get("source", "") if field.startswith("status_line.") else ""
            automatic = (surface == "visible" and not historical and bool(active)
                         and all(r["id"] in valid_ids and r.get("automatic") and r.get("scope_status") == "verified" for r in active))
            item.update(record_ids=[r["id"] for r in bound], active_record_ids=[r["id"] for r in active], registered=bool(bound), automatic=automatic,
                        registration_status="已登记" if bound else "待登记·人工取数",
                        source_projects=sorted({source_project(r) for r in sources}) or [source_project(dict(page=slug, source_location=hint))],
                        source_locations=sorted({r["source_location"] for r in sources}) or ([hint] if hint else []),
                        private=any(r.get("private") for r in active),
                        requires_refresh=surface == "visible" and not historical)
            if item["requires_refresh"]:
                matched_private.update(r["id"] for r in active if r.get("private"))
            items.append(item)

        for field, text in strings(page):
            leaf = field.rsplit(".", 1)[-1]
            surface = "visible" if (field.startswith("screens[") and leaf in WORDS | {"source_note"}) or field.startswith("status_line.") else (
                "reference" if field.startswith("registry.") else "author")
            found = re.match(r"screens\[(\d+)\]", field)
            screen = screens[int(found[1])] if found else first
            if surface == "visible" and (slug, screen.get("id")) not in historical_pairs:
                probe = dict(page=slug, screen=screen.get("id", ""), field=field, start=0, end=len(text),
                             kind="first_screen_card", excerpt=text)
                located_records.update(r["id"] for r in by_page[slug] if not r.get("historical")
                                       and not r.get("frozen") and matches(r, probe, page, text))
            for occurrence in re.finditer("截至", text):
                cutoff_pages.add(slug)
                cutoff_surfaces[surface] += 1
                dated = DATE.search(text, occurrence.end())
                add("as_of", field, text, occurrence.start(),
                    dated.end() if dated and "\n" not in text[occurrence.end():dated.start()] else occurrence.end(), surface=surface,
                    original_date=dated[0] if dated and "\n" not in text[occurrence.end():dated.start()] else None)
            if leaf == "source_note":
                add("source_note", field, text, surface=surface)
        status = page.get("status_line")
        if status:
            status_pages.add(slug)
            for name in ("as_of", "last", "state"):
                if name in status:
                    value = status[name]
                    field = "status_line." + name
                    if name == "last" and isinstance(value, dict) and "at" in value:
                        field += ".at"
                    add("status_line." + name, field,
                        str(value["at"]) if field.endswith(".at") else
                        json.dumps(value, ensure_ascii=False) if isinstance(value, dict) else str(value),
                        original_date=value.get("at") if isinstance(value, dict) else status.get("as_of"))
            for index, fact in enumerate(status.get("facts", [])):
                add("status_line.facts", f"status_line.facts[{index}]", str(fact), original_date=status.get("as_of"))
        layout_path = path.with_name("layout.json")
        layout = json.loads(layout_path.read_text(encoding="utf-8-sig")) if layout_path.exists() else []
        source_notes = []
        for sheet in layout:
            for block in sheet.get("blocks", []):
                key = (sheet.get("screen"), block.get("text_ref", ""))
                if block.get("variant") == "source_note" and key not in source_notes:
                    source_notes.append(key)
        text = first.get("text", "")
        dated = re.search(r"截至[^\n]*", text)
        card_date = DATE.search(dated[0])[0] if dated and DATE.search(dated[0]) else (status or {}).get("as_of")
        line_spans, offset = [], 0
        for line in text.splitlines(keepends=True):
            line_spans.append((offset, offset + len(line.rstrip("\r\n")), parser.canon(parser.normalize(line.rstrip("\r\n")))))
            offset += len(line)
        nodes = parser.parse(text)
        texts = [parser.node_text(node) for node in nodes]
        sheets = [s for s in layout if s.get("screen") == first.get("id")]
        sheet = next((s for s in sheets if s.get("orientation") == "h"), next(iter(sheets), {}))
        blocks = [dict(b) for b in sheet.get("blocks", [])]
        for block in blocks:
            if block.get("text_ref"):
                prefix = current_prefix(block["text_ref"], texts)
                if prefix:
                    block["text_ref"] = prefix
        assigned = assign_by_spec(nodes, blocks, []) if blocks else []
        stat_lines = {line for b in assigned if b["type"] == "stat_card" for n in b["nodes"] for line in n.get("src", [])}
        cursor = 0
        for node in nodes:
            selected = node["type"] == "stats" or any(line in stat_lines for line in node.get("src", []))
            for line in node.get("src", []):
                start = text.find(line, cursor)
                end = start + len(line)
                if start < 0:
                    start, end = next(((a, b) for a, b, canonical in line_spans if a >= cursor and canonical == parser.canon(line)), (-1, -1))
                if start >= 0:
                    cursor = end
                    if node["type"] == "table" and selected:
                        if line != node["src"][0]:
                            continue
                        for cell in re.finditer(r"[^|]+", text[start:end]):
                            if cell[0].strip():
                                add("first_screen_card", "screens[0].text", text, start + cell.start(), start + cell.end(), original_date=card_date)
                    elif (node["type"] == "stats" or re.match(r"\s*\d[^｜|]{0,35}[｜|]", line)
                            or re.match(r"\s*\d+\.\s+\*\*\d", line)
                            or (selected and re.match(r"\s*\*\*", line))):
                        add("first_screen_card", "screens[0].text", text, start, cursor,
                            original_date=card_date)
        for screen_id, ref in source_notes:
            screen = next((s for s in screens if s["id"] == screen_id), {})
            text, offset = screen.get("text", ""), 0
            prefix = current_prefix(ref, [parser.canon(p) for p in text.split("\n\n")])
            for paragraph in text.split("\n\n"):
                if prefix and parser.canon(paragraph).startswith(prefix):
                    index = screens.index(screen)
                    add("source_note", f"screens[{index}].text", text, offset, offset + len(paragraph), screen=screen)
                    break
                offset += len(paragraph) + 2
            else:
                add("source_note", "layout.source_note", text, screen=screen, surface="reference")
                items[-1].update(excerpt="来源注未定位，请核对该屏当前正文：" + text[:200],
                    registration_status="待登记·来源注位置待人工复核", requires_refresh=not items[-1]["historical"])
    # 私人登记未能绑定当前展示位置时仍交领域入口复核，不读取或冒充已定位。
    for record in records:
        if (record.get("private") and not record.get("historical") and not record.get("frozen")
                and (record["page"], record["screen"]) not in historical_pairs and record["id"] not in located_records):
            items.append(dict(id=f"item-{len(items) + 1}", page=record["page"], screen=record["screen"],
                kind="source_record", surface="reference", field="source_registry." + record["id"],
                excerpt=record["label"], original_date=record.get("as_of"), record_ids=[record["id"]],
                registered=True, registration_status="已登记·展示位置待复核", automatic=False, private=True,
                historical=False, requires_refresh=True, source_projects=[source_project(record)],
                source_locations=[record["source_location"]]))
    for item in items:
        item["source_projects"] = sorted({source_aliases.get(re.sub(r"[-_.]", "", name).lower(), name) for name in item["source_projects"]})
        if item["kind"] in {"as_of", "status_line.as_of"} and not item["historical"]:
            cards = [i for i in items if i["page"] == item["page"] and i["screen"] == item["screen"]
                     and i["kind"] == "first_screen_card" and not i["historical"]]
            nearby = [i for i in cards if item["kind"] == "status_line.as_of" or abs(i["line"] - item["line"]) <= 6]
            while nearby:
                expanded = [i for i in cards if any(abs(i["line"] - n["line"]) <= 3 for n in nearby)]
                if len(expanded) == len(nearby):
                    break
                nearby = expanded
            item["qualifies_suggestion"] = sorted({rid for i in nearby for rid in i["active_record_ids"]})
    return dict(schema="content-refresh.inventory.v1", observed_at=datetime.now(BEIJING).isoformat(timespec="seconds"),
                located_record_ids=sorted(located_records),
                historical_record_ids=sorted(r["id"] for r in records if r.get("historical") or r.get("frozen")
                                             or (r["page"], r["screen"]) in historical_pairs),
                coverage=dict(pages_checked=len(paths), cutoff_occurrences=sum(cutoff_surfaces.values()),
                    cutoff_pages=len(cutoff_pages), cutoff_surfaces=dict(cutoff_surfaces),
                    status_line_pages=len(status_pages), item_kinds=dict(Counter(i["kind"] for i in items))), items=items)


def strict_findings(inventory, records, entries=None, invalid_record_ids=()):
    """只检查清单和页面位置；从不读取来源，自动建议不构成登记。"""
    entries, by_id = entries or {}, {r["id"]: r for r in records}
    ids, invalid = set(by_id), set(invalid_record_ids)
    invalid.update(r["id"] for r in records if record_errors(r, entries, ids))
    for name, config in entries.items():
        try:
            validate_entries({name: config})
        except (ValueError, TypeError):
            invalid.update(r["id"] for r in records if r.get("retrieve", {}).get("entry") == name or
                           (name == LEDGER and r.get("retrieve", {}).get("kind") == "usage_ledger"))
    located = set(inventory.get("located_record_ids", [])) | {
        rid for i in inventory["items"] if i.get("surface") == "visible" and not i.get("historical")
        for rid in i.get("active_record_ids", [])}

    def mode(record, item, visiting=()):
        rid = record["id"]
        if rid in invalid or rid in visiting or record.get("historical") or record.get("frozen"):
            return None
        if record.get("qualifies"):
            refs = [by_id.get(ref) for ref in record["qualifies"]]
            if any(not r or r["id"] not in located or r["page"] != item["page"] or r.get("qualifies") for r in refs):
                return None
            modes = [mode(r, item, (*visiting, rid)) for r in refs]
            return ("automatic" if all(m == "automatic" for m in modes) else "manual") if all(modes) else None
        if record.get("retrieve", {}).get("kind") == "manual":
            return "manual"
        return "automatic" if record.get("automatic") and record.get("scope_status") == "verified" else None

    findings = []
    for item in inventory["items"]:
        if not item.get("requires_refresh") or item.get("historical") or item["kind"] == "status_line.state":
            continue
        active = [by_id[rid] for rid in item.get("active_record_ids", []) if rid in by_id]
        dated = item["kind"] in {"as_of", "status_line.as_of"}
        modes = [mode(r, item) for r in active if not dated or r.get("qualifies")]
        if not any(modes):
            reason = ("展示位置未定位" if item["kind"] == "source_record" else
                      "截至日期缺有效 qualifies" if dated else "缺有效自动记录或合规 manual")
            findings.append({k: item.get(k) for k in ("page", "screen", "field", "line", "excerpt")}
                            | {"reason": reason, "record_ids": item.get("record_ids", []),
                               "qualifies_suggestion": item.get("qualifies_suggestion", [])})
        item["automatic"] = bool(modes) and all(m == "automatic" for m in modes)
        item["strict_status"] = "automatic" if item["automatic"] else "manual" if any(modes) else "missing"
    reported = {rid for f in findings for rid in f.get("record_ids", [])}
    historical = set(inventory.get("historical_record_ids", [])) - located
    for error in registry_errors(records, entries):
        rid = error["record_id"]
        if rid in reported or rid in historical:
            continue
        record = by_id.get(rid, {})
        findings.append(dict(page=record.get("page", ""), screen=record.get("screen", ""),
                             field="source_registry." + rid, line=1, excerpt=record.get("label", rid),
                             reason="来源格式错误：" + "; ".join(error["errors"]), record_ids=[rid]))
    inventory["coverage"].update(strict_inventory_summary(inventory, findings))
    return findings


def strict_inventory_summary(inventory, findings=()):
    active = [i for i in inventory["items"] if i.get("requires_refresh") and i.get("surface") == "visible"
              and not i.get("historical") and i["kind"] != "status_line.state"]
    automatic = sum(i.get("strict_status") == "automatic" for i in active)
    return dict(required_items=len(active), automatic_items=automatic,
                manual_items=sum(i.get("strict_status") == "manual" for i in active),
                missing_items=sum(i.get("strict_status") == "missing" for i in active),
                location_gaps=sum(i.get("reason") == "展示位置未定位" for i in findings),
                automatic_ratio=automatic / len(active) if active else 1.0)


def fact_tasks(inventory, group_size=25):
    groups = defaultdict(list)
    for item in inventory["items"]:
        if item["requires_refresh"]:
            groups[" + ".join(item["source_projects"])].append(item)
    lines = ["# 给 GPT 的分组事实任务单", "", f"清点时间：{inventory['observed_at']}（北京时间）。",
             "清点程序没有重取来源。每组交一个事实子代理；只读取登记的领域入口，公开口径按活动公开分级原文和页面规则。",
             "每项交回来源、观察时间、同口径新值或具名 Unknown；取不到保留原日期。历史/冻结项不自动激活。",
             "author/reference 的截至命中用于覆盖核对，不冒充新展示事实；私人来源登记的位置待复核项另列。", ""]
    for project, items in sorted(groups.items()):
        for offset in range(0, len(items), group_size):
            chunk = items[offset:offset + group_size]
            lines += [f"## 来源项目：{project} · 第 {offset // group_size + 1} 组（{len(chunk)} 项）", ""]
            for item in chunk:
                action = (("可自动重取（只读计数/状态，本次清点未执行）" if item["private"] else
                           "可自动重取（本次清点未执行）") if item["automatic"] else
                          "领域入口事实任务（程序未读来源）" if item["private"] else "人工核对、取数")
                source = "；".join(item["source_locations"]) or "待登记来源，先核对所属项目的领域入口"
                excerpt = item["excerpt"].replace("\n", " ")
                lines.append(f"- {item['id']}｜{item['page']} / {item['screen']} / {item['field']}:{item.get('line', 1)}"
                    f"｜{excerpt}｜原日期 {item['original_date'] or 'Unknown'}｜{item['registration_status']}"
                    f"（{', '.join(item.get('active_record_ids', item['record_ids'])) or '无记录 id'}）｜{action}｜来源：{source}")
            lines.append("")
    return "\n".join(lines)


def write_inventory(output, inventory):
    (output / "dated-inventory.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding="utf-8")
    (output / "fact-tasks.md").write_text(fact_tasks(inventory), encoding="utf-8")

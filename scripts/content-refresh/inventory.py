"""只清点作者输入；不重取来源、不联网、不生成网页。"""
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import re
import sys

from checks import HISTORY, WORDS
from validation import record_errors, registry_errors, validate_entries, LEDGER
from apply_edits import EVENT_DATE

BEIJING = timezone(timedelta(hours=8))
COUNT_CONTENT = re.compile(r"\d[\d,.]*(?:\s*/\s*\d[\d,.]*)?\s*(?:个|项|件|次|条|份|组|页|行|人|台|块|张|种|套|屏|层|路|节|秒|分钟|字节|[KMGT]i?B|%)|(?:数量|计数|总数|条目|[一-龥A-Za-z_]{1,24}数)\s*[:：｜|]\s*[*` ]*\d[\d,.]*")
# 识别紧接“截至”的日期写法，不向后搜索数量、版本或另一句中的日期。
DATE_NUMBER = r"[\d〇零一二三四五六七八九十两]+"
DATE_CN = rf"(?:{DATE_NUMBER}\s*年\s*)?{DATE_NUMBER}\s*月\s*{DATE_NUMBER}\s*日?"
DATE_SHORT = r"(?:1[0-2]|0?[1-9])/(?:3[01]|[12]\d|0?[1-9])(?=[ \t,，。：；;）)]|(?:[ T]?\d{1,2}:\d{2})|$)"
DATE_POINT = rf"(?:{DATE_CN}|\d{{4}}[-/]\d{{1,2}}[-/]\d{{1,2}}|{DATE_SHORT})"
DATE_RANGE = rf"{DATE_POINT}(?:[ \t]*[–—~～至到-][ \t]*(?:{DATE_POINT}|{DATE_NUMBER}\s*日?))?"
CUTOFF_DATE = re.compile(rf"[ \t:：（(*`【\[]*(?:北京时间[ \t]*)?(?P<date>{DATE_RANGE}|"
                         rf"{DATE_NUMBER}\s*月(?:底|初|末|[上下中]旬)|今天|今日|昨天|昨日|前天|昨晚|今早|"
                         rf"现在|目前|本周|上周|本月|上月|\{{\{{[^{{}}\n]*\bas_of\b[^{{}}\n]*\}}\}})"
                         rf"(?:[ T]?\d{{1,2}}:\d{{2}}(?::\d{{2}})?)?(?![\d〇零一二三四五六七八九十两年月日./\\])")
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "src/typeset"))
from engine import parse as parser
from engine.layout import assign_by_spec
from engine.content import bound_json


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


def build_inventory(pages_root, records, entries=None, policy=None, targeted=()):
    paths = sorted(Path(pages_root).glob("*/page.json"))
    items, cutoff_surfaces = [], Counter()
    status_pages, cutoff_pages, matched_private, historical_pairs, located_records = set(), set(), set(), set(), set()
    by_page, source_aliases, page_catalog = defaultdict(list), {}, {}
    ids = {r["id"] for r in records}
    valid_ids = {r["id"] for r in records if not record_errors(r, entries or {}, ids)}
    for record in records:
        by_page[record["page"]].append(record)
    referenced = {found for folder in (Path(pages_root), Path(pages_root).parent / "creative") for source in sorted(folder.rglob("*.json"))
                  for found in re.findall(r"\{\{([a-z0-9-]+)\.registry\.numbers\.([a-z0-9-]+)\.(text|as_of)\}\}", source.read_text("utf-8-sig"))}
    for path in paths:
        page = (bound_json(path, lambda p: p.read_text(encoding="utf-8-sig"), root=path.parents[3])
                if path.parent.parent.name == "pages" and path.parents[2].name == "sources"
                else json.loads(path.read_text(encoding="utf-8-sig")))
        slug = page.get("page", path.parent.name)
        page_catalog[slug] = page
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
                        original_date=original_date, historical=historical, page_number=number.get("id") if number else None,
                        parent=page.get("parent"))
            bound = [r for r in by_page[slug] if matches(r, item, page, text)]
            active = [r for r in bound if not r.get("historical") and not r.get("frozen")]
            if bound and not active:
                historical = True
                item["historical"] = True
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
            if kind in {"as_of", "status_line.as_of"}:
                marks = ("\n", "。", "；", ";", "！", "!", "？", "?")
                a = max(text.rfind(mark, 0, start) for mark in marks) + 1
                stops = [text.find(mark, end) for mark in marks]
                b = min((i for i in stops if i >= 0), default=len(text))
                context = text[a:b]
                local = dict(item, start=a, end=b, excerpt=context)
                numeric_cutoff = bool(re.search(r"(?:数字|数量|计数|统计|总数)\s*截至", context))
                direct = [r for r in active if r["id"] in valid_ids and r.get("automatic")
                          and r.get("scope_status") == "verified" and not r.get("qualifies")
                          and re.fullmatch(DATE_POINT + r"(?:[ T]\d{1,2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})?)?", str(r.get("current_value", "")))
                          and (r.get("page_pattern") or "start" in r or kind == "status_line.as_of")]
                event = bool(EVENT_DATE.search(context) or re.search(r"读取截至.*已入库|截至.*已采到的部分", context))
                direct = [r for r in direct if (event and not numeric_cutoff)
                          or r.get("date_semantics") in {"coverage_end", "event_date", "event_time"}]
                item.update(count_context=bool(COUNT_CONTENT.search(context)), event_date=event,
                            date_context=context, numeric_cutoff=numeric_cutoff,
                            status_review=kind == "status_line.as_of" and "只读查看" in hint and "未重新核对" in hint,
                            local_record_ids=[r["id"] for r in by_page[slug] if matches(r, local, page, text)],
                            direct_date=bool(direct), direct_date_record_ids=[r["id"] for r in direct])
            if item["requires_refresh"]:
                matched_private.update(r["id"] for r in active if r.get("private"))
            items.append(item)

        for field, text in strings(page):
            leaf = field.rsplit(".", 1)[-1]
            surface = "visible" if (field.startswith("screens[") and leaf in WORDS | {"source_note"}) or field.startswith("status_line.") else (
                "reference" if field.startswith("registry.") else "author")
            found = re.match(r"screens\[(\d+)\]", field)
            screen = screens[int(found[1])] if found else first
            numbered = re.fullmatch(r"registry\.numbers\[(\d+)\]\.(text|as_of)", field)
            if numbered and (slug, page["registry"]["numbers"][int(numbered[1])].get("id"), numbered[2]) in referenced:
                surface = "visible"  # 首页等处经 {{页.registry.numbers.编号.字段}} 直接显示这一条
            if surface == "visible" and (slug, screen.get("id")) not in historical_pairs:
                probe = dict(page=slug, screen=screen.get("id", ""), field=field, start=0, end=len(text),
                             kind="first_screen_card", excerpt=text)
                located_records.update(r["id"] for r in by_page[slug] if not r.get("historical")
                                       and not r.get("frozen") and matches(r, probe, page, text))
            for occurrence in re.finditer("截至", text):
                cutoff_pages.add(slug)
                cutoff_surfaces[surface] += 1
                dated = CUTOFF_DATE.match(text, occurrence.end())
                if not dated:
                    continue
                if re.search(r"(?:今天|今日)截至(?:现在|目前)[（(](?:今天|今日)标未完结", text[max(0, occurrence.start() - 2):dated.end("date") + 12]):
                    continue
                add("as_of", field, text, occurrence.start(),
                    dated.end("date"), surface=surface, original_date=dated["date"])
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
                    items[-1]["snapshot_review"] = name == "last" and isinstance(value, dict) and value.get("label") == "快照核对"
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
        dated = next((found for word in re.finditer("截至", text)
                      if (found := CUTOFF_DATE.match(text, word.end()))), None)
        card_date = dated["date"] if dated else (status or {}).get("as_of")
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
                        for cell in re.finditer(r"[^|]+", text[start:end]):
                            if (COUNT_CONTENT.search(cell[0]) or re.fullmatch(r"[*` ]*[\d〇零一二三四五六七八九十两][\d,.〇零一二三四五六七八九十两]*[*` ]*", cell[0])
                                    or re.search(r"[〇零一二三四五六七八九十两]+\s*(?:个|项|件|次|条|份|组|页|行|人|台|块|张|种|套|屏|层|路|节|秒|分钟)", cell[0])):
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
    card_ids = {rid for i in items if i["kind"] == "first_screen_card" for rid in i["active_record_ids"]}
    date_only_ids = {rid for i in items if i["kind"] in {"as_of", "status_line.as_of"}
                     for rid in i["active_record_ids"]} - card_ids
    numeric_ids = {r["id"] for r in records if r["id"] in located_records and not r.get("qualifies")
                   and r["id"] not in date_only_ids
                   and (r["id"] in card_ids or r.get("retrieve", {}).get("operation") in {"length", "count_7d"}
                        or type(r.get("current_value")) in {int, float} or re.fullmatch(r"[\d,.]+", str(r.get("current_value", ""))))}
    for item in items:
        item["source_projects"] = sorted({source_aliases.get(re.sub(r"[-_.]", "", name).lower(), name) for name in item["source_projects"]})
        if item.get("snapshot_review") and not item["historical"]:
            item.update(source_kind=item["kind"], kind="review_stamp", review_stamp=True, requires_refresh=False, automatic=False)
        if item["kind"] in {"as_of", "status_line.as_of"} and not item["historical"]:
            cards = [i for i in items if i["page"] == item["page"] and i["screen"] == item["screen"]
                     and i["kind"] == "first_screen_card" and not i["historical"]]
            nearby = [i for i in cards if item["kind"] == "status_line.as_of" or abs(i["line"] - item["line"]) <= 6]
            while nearby:
                expanded = [i for i in cards if any(abs(i["line"] - n["line"]) <= 3 for n in nearby)]
                if len(expanded) == len(nearby):
                    break
                nearby = expanded
            item["qualifies_suggestion"] = sorted({rid for i in nearby for rid in i["active_record_ids"]
                if item["numeric_cutoff"] or rid in item["local_record_ids"]})
            qualified = any(r.get("qualifies") for r in by_page[item["page"]] if r["id"] in item["record_ids"])
            numeric = bool(numeric_ids.intersection(item["local_record_ids"]))
            module_stamp = item["kind"] == "status_line.as_of" and bool(item["parent"])
            explicit_review = bool(re.search(r"事实核对截至|(?:源码|项目|整页)核对截至|快照核对[：:\s]*截至|(?:项目|源码)(?:现状|事实)截至.*核对", item["date_context"]))
            if (item["surface"] == "visible" and not qualified and not item["direct_date"]
                    and (module_stamp or item["status_review"] or explicit_review or (not numeric and not item["count_context"] and not item["numeric_cutoff"] and not item["event_date"]
                         and (re.search(r"核对|事实截至|做好了.*待验收", item["date_context"]) or item["parent"])))):
                item.update(source_kind=item["kind"], kind="review_stamp", review_stamp=True, requires_refresh=False, automatic=False, qualifies_suggestion=[])
    stamps = [i for i in items if i.get("review_stamp")]
    stamp_ids = {rid for i in stamps for rid in i["record_ids"]} - numeric_ids - {
        rid for i in items if i["requires_refresh"] and not i["historical"] for rid in i["record_ids"]}
    from refresh import page_value
    bindings = []
    for record in records:
        classification = "historical" if record.get("historical") or record.get("frozen") or (record["page"], record["screen"]) in historical_pairs else "review_stamp" if record["id"] in stamp_ids else "current"
        try:
            if record.get("dynamic"):
                bindings.append(dict(record_id=record["id"], classification=classification, status="dynamic"))
                continue
            value, _ = page_value(record, page_catalog[record["page"]], Path(pages_root).parents[1])
            bindings.append(dict(record_id=record["id"], classification=classification, status="readable", value=value))
        except (KeyError, ValueError, IndexError, StopIteration, re.error) as exc:
            bindings.append(dict(record_id=record["id"], classification=classification, status="binding_error", reason=str(exc) or "页面定位不存在"))
    from freshness import cadence
    review_path = Path(pages_root).parent / "refresh/semantic-reviews.json"
    reviews = json.loads(review_path.read_text(encoding="utf-8-sig")).get("pages", {}) if review_path.exists() else {}
    historical_ids = {b["record_id"] for b in bindings if b["classification"] == "historical"}
    basis_gaps = [dict(record_id=r["id"], page=r["page"], reason="观察依据未登记") for r in records
                  if r["id"] not in historical_ids and r.get("automatic")
                  and r.get("retrieve", {}).get("kind") in {"json", "entry"}
                  and r.get("observation_basis", (entries or {}).get(r["retrieve"].get("entry"), {}).get("observation_basis")) is None]
    offset_gaps = [dict(b, page=next(r["page"] for r in records if r["id"] == b["record_id"])) for b in bindings
                   if b["classification"] == "current" and b.get("reason") == "字符偏移已漂移或无法证明，需改用唯一上下文重绑"]
    semantic = []
    for slug, page in page_catalog.items():
        if page.get("kind") == "frozen" or page.get("status") in {"frozen", "冻结", "已冻结", "historical", "历史"}:
            continue
        state = cadence(dict(freshness_class="semantic", semantic_checked_at=reviews.get(slug, {}).get("checked_at"), source_changed=page.get("source_changed")), policy, targeted=slug in targeted)
        if state["refresh_due"]:
            semantic.append(dict(id="semantic-page:" + slug, page=slug, kind="semantic", reason=state["cadence_reason"], status="pending"))
    return dict(schema="content-refresh.inventory.v1", observed_at=datetime.now(BEIJING).isoformat(timespec="seconds"),
                semantic_reviews=semantic, semantic_due=dict(count=len(semantic), pages=[s["page"] for s in semantic]),
                targeted_pages=sorted(targeted), observation_basis_gaps=basis_gaps, offset_binding_gaps=offset_gaps,
                record_bindings=bindings,
                review_stamps=stamps, review_stamp_record_ids=sorted(stamp_ids),
                located_record_ids=sorted(located_records),
                historical_record_ids=sorted(r["id"] for r in records if r.get("historical") or r.get("frozen")
                                             or (r["page"], r["screen"]) in historical_pairs),
                coverage=dict(pages_checked=len(paths), observation_basis_gaps=len(basis_gaps), offset_binding_gaps=len(offset_gaps), cutoff_occurrences=sum(cutoff_surfaces.values()),
                    cutoff_pages=len(cutoff_pages), cutoff_surfaces=dict(cutoff_surfaces),
                    status_line_pages=len(status_pages), item_kinds=dict(Counter(i["kind"] for i in items))), items=items)


def strict_findings(inventory, records, entries=None, invalid_record_ids=()):
    """只检查清单和页面位置；从不读取来源，自动建议不构成登记。"""
    entries, by_id = entries or {}, {r["id"]: r for r in records}
    ids, invalid = set(by_id), set(invalid_record_ids)
    binding_errors = [b for b in inventory.get("record_bindings", []) if b["record_id"] in by_id and b["status"] == "binding_error" and b["classification"] == "current"]
    binding_ids = {b["record_id"] for b in binding_errors}
    offset_ids = {b["record_id"] for b in inventory.get("offset_binding_gaps", [])}
    invalid.update(r["id"] for r in records if record_errors(r, entries, ids))
    for name, config in entries.items():
        try:
            validate_entries({name: config})
        except (ValueError, TypeError):
            invalid.update(r["id"] for r in records if r.get("retrieve", {}).get("entry") == name or
                           (name == LEDGER and r.get("retrieve", {}).get("kind") == "usage_ledger"))
    source_invalid = set(invalid)
    invalid.update(binding_ids)
    located = set(inventory.get("located_record_ids", [])) | {
        rid for i in inventory["items"] if i.get("surface") == "visible" and not i.get("historical")
        for rid in i.get("active_record_ids", [])}

    def mode(record, item, visiting=()):
        rid = record["id"]
        offset_gap = rid in offset_ids and rid not in source_invalid
        if (rid in invalid and not offset_gap) or rid in visiting or record.get("historical") or record.get("frozen"):
            return None
        if record.get("qualifies"):
            refs = [by_id.get(ref) for ref in record["qualifies"]]
            if any(not r or (r["id"] not in located and r["id"] not in offset_ids) or r["page"] != item["page"] or r.get("qualifies") for r in refs):
                return None
            modes = [mode(r, item, (*visiting, rid)) for r in refs]
            if all(modes) and (offset_gap or "offset_binding_gap" in modes):
                return "offset_binding_gap"
            return ("automatic" if all(m == "automatic" for m in modes) else "manual") if all(modes) else None
        if offset_gap and (record.get("retrieve", {}).get("kind") == "manual" or record.get("automatic") and record.get("scope_status") == "verified"):
            return "offset_binding_gap"
        if record.get("retrieve", {}).get("kind") == "manual":
            return "manual"
        return "automatic" if record.get("automatic") and record.get("scope_status") == "verified" else None

    findings = []
    for item in inventory["items"]:
        if not item.get("requires_refresh") or item.get("historical") or item["kind"] == "status_line.state":
            continue
        active = [by_id[rid] for rid in item.get("active_record_ids", []) if rid in by_id]
        dated = item["kind"] in {"as_of", "status_line.as_of"}
        modes = [mode(r, item) for r in active if not dated or r.get("qualifies")
                 or r["id"] in item.get("direct_date_record_ids", [])]
        if not any(modes):
            reason = ("展示位置未定位" if item["kind"] == "source_record" else
                      "截至日期缺有效 qualifies" if dated else "缺有效自动记录或合规 manual")
            related = {ref for r in active for ref in r.get("qualifies") or [] if ref in binding_ids} if dated else set()
            findings.append({k: item.get(k) for k in ("page", "screen", "field", "line", "excerpt")}
                            | {"reason": reason, "record_ids": sorted(set(item.get("record_ids", [])) | related),
                               "qualifies_suggestion": item.get("qualifies_suggestion", [])})
        item["automatic"] = bool(modes) and all(m == "automatic" for m in modes)
        item["strict_status"] = "automatic" if item["automatic"] else "manual" if any(modes) else "missing"
        if "offset_binding_gap" in modes:
            item["strict_status"] = "offset_binding_gap"
    reported = {rid for f in findings for rid in f.get("record_ids", [])}
    historical = set(inventory.get("historical_record_ids", [])) - located
    for error in registry_errors(records, entries):
        rid = error["record_id"]
        if rid in reported or rid in historical or rid in inventory.get("review_stamp_record_ids", []):
            continue
        record = by_id.get(rid, {})
        findings.append(dict(page=record.get("page", ""), screen=record.get("screen", ""),
                             field="source_registry." + rid, line=1, excerpt=record.get("label", rid),
                             reason="来源格式错误：" + "; ".join(error["errors"]), record_ids=[rid]))
    reported = {rid for f in findings for rid in f.get("record_ids", [])}
    for binding in binding_errors:
        if binding["record_id"] in offset_ids and binding["record_id"] not in source_invalid:
            continue
        if binding["record_id"] not in reported:
            record = by_id[binding["record_id"]]
            field = record.get("field", record.get("page_field"))
            existing = next((f for f in findings if field and not re.fullmatch(r"screens\[\d+\]\.text", field)
                             and (f["page"], f["screen"], f["field"]) == (record["page"], record["screen"], field)), None)
            if existing is not None:
                existing["record_ids"].append(record["id"])
                continue
            findings.append(dict(page=record["page"], screen=record["screen"], field=record.get("field", "source_registry." + record["id"]),
                                 line=1, excerpt=record.get("label", record["id"]), reason="原位绑定不可读：" + binding["reason"], record_ids=[record["id"]]))
    unique = []
    for finding in findings:
        previous = [f for f in unique if set(f["record_ids"]) & set(finding["record_ids"])]
        if not previous:
            unique.append(finding)
        else:
            previous[0]["record_ids"] = sorted(set(finding["record_ids"]).union(*(f["record_ids"] for f in previous)))
            for duplicate in previous[1:]:
                unique.remove(duplicate)
    findings = unique
    inventory["coverage"].update(strict_inventory_summary(inventory, findings))
    return findings


def strict_inventory_summary(inventory, findings=()):
    active = [i for i in inventory["items"] if i.get("requires_refresh") and i.get("surface") == "visible"
              and not i.get("historical") and i["kind"] != "status_line.state" and i.get("strict_status") != "offset_binding_gap"]
    automatic = sum(i.get("strict_status") == "automatic" for i in active)
    return dict(required_items=len(active), automatic_items=automatic,
                manual_items=sum(i.get("strict_status") == "manual" for i in active),
                missing_items=sum(i.get("strict_status") == "missing" for i in active),
                location_gaps=sum(i.get("reason") == "展示位置未定位" for i in findings),
                automatic_ratio=automatic / len(active) if active else 1.0)


def fact_tasks(inventory, group_size=25):
    targeted = set(inventory.get("targeted_pages", []))
    groups = defaultdict(list)
    for item in inventory["items"]:
        if item["requires_refresh"] and not (targeted and item["kind"] == "status_line.state" and item["page"] not in targeted):
            groups[" + ".join(item["source_projects"])].append(item)
    lines = ["# 给 GPT 的分组事实任务单", "", f"清点时间：{inventory['observed_at']}（北京时间）。",
             "清点程序没有重取来源。每组交一个事实子代理；只读取登记的领域入口，公开口径按活动公开分级原文和页面规则。",
             "每项交回来源、观察时间、同口径新值或具名 Unknown；取不到保留原日期。历史/冻结项不自动激活。",
             "author/reference 的截至命中用于覆盖核对，不冒充新展示事实；私人来源登记的位置待复核项另列。", ""]
    if inventory.get("offset_binding_gaps"):
        lines += [f"字符偏移待重绑：{len(inventory['offset_binding_gaps'])} 条（已单列缺口，不计严格盘点缺失；未证明可改数）。", ""]
    stamps = [s for s in inventory.get("review_stamps", []) if not targeted or s["page"] in targeted]
    if inventory.get("semantic_reviews"):
        lines += ["## 语义复核到期（不阻断本轮事实闭环）", "",
                  "、".join(s["page"] for s in inventory["semantic_reviews"]), ""]
    if stamps:
        lines += ["## 核对戳（事实组更新，不机械取数）", "", "核对本页事实后更新日期；没有实际核对或证据不可用时保留原日期。", ""]
        for stamp in stamps:
            lines.append(f"- {stamp['page']} / {stamp['screen']} / {stamp['field']}:{stamp.get('line', 1)}｜"
                         f"{stamp['excerpt']}｜原日期 {stamp['original_date'] or 'Unknown'}｜人工核对，不要求自动数字来源")
        lines.append("")
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

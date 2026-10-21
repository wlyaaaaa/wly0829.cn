"""只生成和应用已核验位置的数字、日期替换；不写叙述内容。"""
import argparse
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
from hashlib import sha256
import json
from pathlib import Path
import re
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]
NUMBER = re.compile(r"-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?")
CHINESE_DATE = re.compile(r"(?:(\d{4})\s*年\s*)?(\d{1,2})\s*月\s*(\d{1,2})\s*日(?:\s+(\d{1,2}):(\d{2})(:\d{2})?)?")
DATETIME = re.compile(r"\d{4}-\d{2}-\d{2}([ T])\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?")
EVENT_DATE = re.compile(r"(?:最近(?:一次)?|最后(?:一次)?|上(?:一)?次)\s*(?:写入|使用|运行|同步|采集|访问|更新)|(?:数据|记录|账本)\s*(?:记到|覆盖到)|数据水位")
BEIJING = timezone(timedelta(hours=8))


def field_at(page, field):
    parts = re.findall(r"[^.\[\]]+|\[\d+\]", field)
    if ".".join(parts).replace(".[", "[") != field:
        raise ValueError("字段路径无效")
    parent = page
    for part in parts[:-1]:
        parent = parent[int(part[1:-1])] if part.startswith("[") else parent[part]
    key = int(parts[-1][1:-1]) if parts[-1].startswith("[") else parts[-1]
    if not isinstance(parent[key], str):
        raise ValueError("目标字段不是字符串")
    return parent, key


def digest(text):
    return sha256(text.encode("utf-8")).hexdigest()


def formatted(old, value):
    """仅接受独立数字或日期，沿用页面已有的分隔符和日期写法。"""
    stamp = DATETIME.fullmatch(old)
    if stamp:
        if not DATETIME.fullmatch(str(value)):
            raise ValueError("日期时间新值缺少时分")
        original, new = datetime.fromisoformat(old), datetime.fromisoformat(str(value))
        new = new.replace(tzinfo=BEIJING) if new.tzinfo is None else new
        new = new.astimezone(original.tzinfo or BEIJING)
        text = new.strftime("%Y-%m-%d") + stamp[1] + new.strftime("%H:%M:%S" if stamp[2] else "%H:%M")
        if stamp[3]:
            text += "." + f"{new.microsecond:06d}"[:len(stamp[3]) - 1]
        return text + (stamp[4] or "")
    chinese = CHINESE_DATE.fullmatch(old)
    if chinese and chinese[4]:
        incoming = CHINESE_DATE.fullmatch(str(value))
        new = (datetime(int(incoming[1] or chinese[1] or 2000), int(incoming[2]), int(incoming[3]),
                        int(incoming[4]), int(incoming[5]), int((incoming[6] or ":0")[1:]))
               if incoming else datetime.fromisoformat(str(value)))
        new = (new.replace(tzinfo=BEIJING) if new.tzinfo is None else new).astimezone(BEIJING)
        values = iter(([new.year] if chinese[1] else []) + [new.month, new.day, new.hour, new.minute] + ([new.second] if chinese[6] else []))
        return re.sub(r"\d+", lambda m: str(next(values)).zfill(len(m[0])), old)
    if chinese or re.fullmatch(r"\d{4}-\d{2}-\d{2}", old):
        incoming = CHINESE_DATE.fullmatch(str(value))
        new = date(int(incoming[1] or (chinese[1] if chinese else None) or 2000),
                   int(incoming[2]), int(incoming[3])) if incoming else date.fromisoformat(str(value)[:10])
        if DATETIME.fullmatch(str(value)):
            observed = datetime.fromisoformat(str(value))
            new = (observed.replace(tzinfo=BEIJING) if observed.tzinfo is None else observed).astimezone(BEIJING).date()
        if not chinese:
            return new.isoformat()
        values = iter(([new.year] if chinese[1] else []) + [new.month, new.day])
        return re.sub(r"\d+", lambda m: str(next(values)).zfill(len(m[0]))
                      if m[0].startswith("0") else str(next(values)), old)
    if not NUMBER.fullmatch(old):
        raise ValueError("old_value_not_whole_number")
    if isinstance(value, str) and not NUMBER.fullmatch(value):
        raise ValueError("新值不是完整数字")
    number = Decimal(str(value).replace(",", ""))
    if not number.is_finite():
        raise ValueError("新值不是有限数字")
    return format(number, ",f" if "," in old else "f")


def same_value(fragment, value):
    try:
        return formatted(fragment, value) == fragment or (
            NUMBER.fullmatch(fragment) and Decimal(fragment.replace(",", "")) ==
            Decimal(str(value).replace(",", "")))
    except (ValueError, InvalidOperation):
        return False


def locate(text, row, number=False):
    if "start" in row or "end" in row:
        start, end = row.get("start"), row.get("end")
        if not isinstance(start, int) or not isinstance(end, int) or not 0 <= start < end <= len(text):
            raise ValueError("字符范围无效")
        return start, end
    if row.get("page_pattern"):
        matches = list(re.finditer(row["page_pattern"], text, re.M))
        if len(matches) != 1:
            raise ValueError("页面定位不是唯一匹配")
        return matches[0].span(1 if matches[0].lastindex else 0)
    if number:
        return list(NUMBER.finditer(text))[row.get("value_index", row.get("original_value_index", 0))].span()
    return 0, len(text)


def whole_number(text, start, end):
    fragment = text[start:end]
    if re.fullmatch(r"-?[\d,.]+", fragment) and (not NUMBER.fullmatch(fragment)
            or re.search(r"\d[.,]?$", text[:start]) or re.match(r"(?:\d|[.,]\d)", text[end:])):
        raise ValueError("old_value_not_whole_number")


def body_link(page, row, field, start, end, number, rows):
    parent, key = field_at(page, field)
    text = parent[key]
    anchors = ([number] if number else page.get("registry", {}).get("numbers", [])) + [row]
    pattern = re.sub(r"\\[dDsSwWbB]", "", row.get("page_pattern", ""))
    matches = list(re.finditer(row["page_pattern"], text, re.M)) if row.get("page_pattern") else []
    proven = bool(row.get("field") == field and row.get("page_pattern")
                  and re.search(r"[\u3400-\u9fff]{2}|[A-Za-z]{2}", pattern)
                  and len(matches) == 1 and matches[0].lastindex
                  and matches[0].span(1) == (start, end))
    if row.get("source_precision") == "estimated" and row.get("display_precision") == "exact":
        raise ValueError("estimated_source_cannot_replace_exact")
    for anchor in anchors:
        phrase = anchor.get("text", "")
        if re.fullmatch(r"(?:个|份|次|条|页|行|项|组|种|千|万|亿|秒|分钟|小时|天|[KMGTPE]?i?B)*", re.sub(r"[\d\W_]+", "", phrase), re.I):
            continue
        if any(m.start() <= start < end <= m.end() for m in re.finditer(re.escape(phrase), text)):
            scope = row.get("measurement_scope", "")
            if re.search(r"估算|估计|estimate", scope) and re.search(r"精确|逐条", text + anchor.get("meaning", "")):
                continue
            proven = True
    if not proven:
        raise ValueError("scope_mismatch_or_unverified")
    paired = [r for r in rows if row["id"] in r.get("qualifies", [])]
    if paired:
        if any(r.get("new_value") is None or r.get("status") not in {"changed", "unchanged"}
               or r.get("date_semantics") != "coverage_end" and qualified_date_review(page, r) for r in paired):
            raise ValueError("as_of_link_required")
        return None  # 显式日期记录独占截至编辑，支持跨字段配对。
    sentences = list(re.finditer(r"[^\n。；;！!？?]+", text))
    own = next(i for i, m in enumerate(sentences) if m.start() <= start < m.end())
    spans = [sentences[own]]
    for i in (own - 1, own + 1):
        if 0 <= i < len(sentences) and re.match(r"\s*[-*#]*\s*(?:本轮|数字|数据|统计)?(?:观察)?(?:截至|截止|观察于|采样于)", sentences[i][0]):
            spans.append(sentences[i])
    qualified = set()
    for date_row in rows:
        if row["id"] in date_row.get("qualifies", []) and date_row.get("field", date_row.get("page_field")) == field:
            if date_row.get("new_value") is None:
                raise ValueError("as_of_link_required")
            a, b = locate(text, date_row)
            qualified.add((a, b))
            spans.extend(m for m in sentences if m.start() <= a < b <= m.end())
    candidates = {}
    pattern = re.compile(DATETIME.pattern + "|" + CHINESE_DATE.pattern + r"|\d{4}-\d{2}-\d{2}")
    for sentence in spans:
        if EVENT_DATE.search(sentence[0]):
            continue
        for stamp in pattern.finditer(sentence[0]):
            a, b = sentence.start() + stamp.start(), sentence.start() + stamp.end()
            prefix, suffix = sentence[0][:stamp.start()], sentence[0][stamp.end():]
            safe = re.search(r"(?:截至|截止|观察于|采样于|观察时间|核对时间|统计时间)\s*(?:北京时间\s*)?$", prefix)
            bracketed = re.search(r"[（(]\s*(?:北京时间\s*)?$", prefix) and re.match(r"\s*[）)]", suffix)
            if safe or bracketed or any(a <= x < y <= b for x, y in qualified):
                candidates[(a, b)] = stamp[0]
    if len(candidates) != 1:
        raise ValueError("as_of_link_required")
    return next(iter(candidates))


def qualified_date_review(page, row):
    """日期所说的事件时间不能被计数的本轮观察日期替换。"""
    field = row.get("field") or row.get("page_field") or ""
    if field.startswith("status_line.last"):
        return "需人工核对：上次使用或运行的事件时间，不能替换为本轮观察日期"
    try:
        if field:
            parent, key = field_at(page, field)
            text = parent[key]
        else:
            text = next(s.get("text", "") for s in page["screens"] if s["id"] == row["screen"])
        start, end = locate(text, row)
    except (KeyError, ValueError, IndexError, StopIteration, re.error):
        return "需人工核对：日期上下文未能定位，保留旧日期"
    # 只看日期所在句，避免别的句子提到“上次使用”就误拦本轮观察日期。
    marks = ("\n", "。", "；", ";", "！", "!", "？", "?")
    a = max(text.rfind(mark, 0, start) for mark in marks) + 1
    ends = [text.find(mark, end) for mark in marks]
    b = min((i for i in ends if i >= 0), default=len(text))
    if EVENT_DATE.search(text[a:b]):
        return "需人工核对：日期句说明最近写入、上次使用或资料覆盖时间，不能替换为本轮观察日期"
    return None


def build_number_edits(root, result):
    root, pages, edits, skipped, manual_reviews = Path(root), {}, {}, [], []
    accepted = set()
    links, owners, unpaired = defaultdict(set), defaultdict(set), defaultdict(list)
    for row in result["rows"]:
        for ref in row.get("qualifies", []):
            links[row["id"]].add(ref)
            links[ref].add(row["id"])
    for row in result["rows"]:
        if row["id"] not in links and row.get("status") != "historical" and not row.get("dynamic"):
            unpaired[(row["page"], row.get("screen"), row.get("field", "").split(".")[0])].append(row["id"])
    for group in unpaired.values():
        for rid in group:
            links[rid].update(group)
    for row in sorted(result["rows"], key=lambda r: bool(r.get("qualifies"))):
        if row.get("manual_review_reason"):
            manual_reviews.append({k: row.get(k) for k in ("page", "field", "old_value", "date_candidate", "source_observed_at")} |
                                  {"record_id": row["id"], "status": "需人工核对", "reason": row["manual_review_reason"]})
            continue
        if (row.get("status") not in {"changed", "unchanged"} or row.get("scope_status") != "verified"
                or not row.get("source_observed_at") or row.get("historical") or row.get("frozen")
                or row.get("dynamic")
                or row.get("old_value") is None or row.get("new_value") is None):
            continue
        slug, rid = row["page"], row["id"]
        try:
            if slug not in pages:
                pages[slug] = json.loads((root / "sources/pages" / slug / "page.json").read_text(encoding="utf-8-sig"))
            page = pages[slug]
            if row.get("requires_semantic_refresh"):
                raise ValueError("scope_mismatch_or_unverified")
            if row.get("source_precision") == "estimated" and row.get("display_precision") == "exact":
                raise ValueError("estimated_source_cannot_replace_exact")
            review = qualified_date_review(page, row) if row.get("qualifies") and row.get("date_semantics") != "coverage_end" else None
            if review:
                manual_reviews.append(dict(page=slug, record_id=rid, field=row.get("field"), old_value=row["old_value"],
                    date_candidate=row["new_value"], source_observed_at=row["source_observed_at"], status="需人工核对", reason=review))
                continue
            if row.get("qualifies") and not set(row["qualifies"]) <= accepted:
                raise ValueError("as_of_link_required")
            numbers = page.get("registry", {}).get("numbers", [])
            nid = row.get("page_number") or row.get("registry_number")
            ni = next((i for i, n in enumerate(numbers) if n.get("id") == nid), None)
            si = next((i for i, s in enumerate(page.get("screens", [])) if s["id"] == row.get("screen")), None)
            field = row.get("field", row.get("page_field")) or (
                f"screens[{si}].text" if row.get("page_pattern") and si is not None else f"registry.numbers[{ni}].text")
            parent, key = field_at(page, field)
            start, end = locate(parent[key], row, field.startswith("registry.numbers["))
            whole_number(parent[key], start, end)
            if NUMBER.fullmatch(str(row["new_value"])) and not NUMBER.fullmatch(str(row["old_value"])):
                raise ValueError("old_value_not_whole_number")
            if not same_value(parent[key][start:end], row["old_value"]):
                raise ValueError("原位置的值与重取旧值不一致")
            if same_value(str(row["old_value"]), row["new_value"]) and any(
                    r.get("date_semantics") == "coverage_end" and rid in r.get("qualifies", []) for r in result["rows"]):
                accepted.add(rid)
                continue
            if row.get("qualifies"):
                for stamp in CHINESE_DATE.finditer(parent[key]):
                    if stamp.start() == start and end <= stamp.end():
                        end = stamp.end()

            pending = []
            def add(target, a, b, value):
                container, leaf = field_at(page, target)
                old = container[leaf][a:b]
                new = formatted(old, value)
                if old != new:
                    pending.append(dict(page=slug, file=f"sources/pages/{slug}/page.json", field=target,
                        start=a, end=b, old_value=old, new_value=new,
                        observed_at=row["source_observed_at"], record_id=rid))
            number = numbers[ni] if ni is not None else None
            if field.startswith("screens[") and NUMBER.fullmatch(parent[key][start:end]):
                linked = body_link(page, row, field, start, end, number, result["rows"])
                if linked:
                    add(field, *linked, row.get("source_coverage_end") or row["source_observed_at"])
            value = row["new_value"]
            stamp = CHINESE_DATE.fullmatch(parent[key][start:end])
            if row.get("qualifies") and (DATETIME.fullmatch(parent[key][start:end]) or stamp and stamp[4]):
                observed = datetime.fromisoformat(row["source_observed_at"]).astimezone(BEIJING)
                if row.get("date_semantics") == "coverage_end" or str(value)[:10] != observed.date().isoformat():
                    raise ValueError("覆盖末日不提供时分，不能用取数时刻替代")
                value = row["source_observed_at"]
            add(field, start, end, value)
            if ni is not None and not row.get("qualifies"):
                number = numbers[ni]
                nf = f"registry.numbers[{ni}].text"
                a, b = locate(number["text"], {k: row[k] for k in ("value_index", "original_value_index") if k in row}, True)
                if not same_value(number["text"][a:b], row["old_value"]):
                    raise ValueError("数字登记与正文口径不一致")
                add(nf, a, b, row["new_value"])
                if number.get("as_of"):
                    add(f"registry.numbers[{ni}].as_of", 0, len(number["as_of"]), row.get("source_coverage_end") or row["source_observed_at"])
                # 完整登记原话在其绑定屏唯一出现时，才同步正文；绝不按裸数字搜索。
                screens = {row.get("screen"), *row.get("affected_screens", []), *number.get("screens", [])}
                for index, screen in enumerate(page.get("screens", [])):
                    if screen["id"] not in screens or screen.get("section") in {"history", "evolution", "timeline"}:
                        continue
                    text = screen.get("text", "")
                    hits = list(re.finditer(r"(?<![\d.,])" + re.escape(number["text"]), text))
                    if not NUMBER.fullmatch(number["text"]) and len(hits) == 1:
                        target = f"screens[{index}].text"
                        start, end = hits[0].start() + a, hits[0].start() + b
                        whole_number(text, start, end)
                        linked = body_link(page, row, target, start, end, number, result["rows"])
                        add(target, start, end, row["new_value"])
                        if linked:
                            add(target, *linked, row.get("source_coverage_end") or row["source_observed_at"])
            for edit in pending:
                location = (slug, edit["field"], edit["start"], edit["end"])
                for prior in owners[location]:
                    links[rid].add(prior)
                    links[prior].add(rid)
                if location in edits and edits[location]["new_value"] != edit["new_value"]:
                    raise ValueError("同一位置有冲突的新值")
            for edit in pending:
                location = (slug, edit["field"], edit["start"], edit["end"])
                owners[location].add(rid)
                edits[location] = edit
            accepted.add(rid)
        except (OSError, KeyError, ValueError, IndexError, InvalidOperation, re.error) as exc:
            skipped.append(dict(page=slug, record_id=rid, reason=str(exc)))
    grouped = defaultdict(list)
    for edit in edits.values():
        grouped[(edit["page"], edit["field"])].append(edit)
    blocked = {r["id"] for r in result["rows"]} - accepted
    for (slug, field), group in grouped.items():
        ordered = sorted(group, key=lambda e: e["start"])
        if any(a["end"] > b["start"] for a, b in zip(ordered, ordered[1:])):
            blocked.update(e["record_id"] for e in group)
            skipped.extend(dict(page=slug, record_id=e["record_id"], reason="字符范围互相重叠") for e in group)
    pending = list(blocked)
    while pending:
        for rid in links[pending.pop()] - blocked:
            blocked.add(rid)
            pending.append(rid)
    reported = {r["record_id"] for r in skipped}
    skipped.extend(dict(page=r["page"], record_id=r["id"], reason="as_of_link_required")
                   for r in result["rows"] if r["id"] in (blocked & accepted) - reported)
    valid = []
    for (slug, field), group in grouped.items():
        group = [e for e in group if e["record_id"] not in blocked]
        parent, key = field_at(pages[slug], field)
        before, after = parent[key], parent[key]
        for edit in sorted(group, key=lambda e: e["start"], reverse=True):
            after = after[:edit["start"]] + edit["new_value"] + after[edit["end"]:]
        for edit in group:
            edit.update(field_before_sha256=digest(before), field_after_sha256=digest(after))
        valid.extend(group)
    return dict(schema="content-refresh.number-edits.v1", edits=valid, skipped=skipped, manual_reviews=manual_reviews)


def apply_edits(root, payload, only=None):
    if payload.get("schema") != "content-refresh.number-edits.v1":
        raise ValueError("改数单格式不支持")
    root, grouped = Path(root), defaultdict(list)
    report = dict(applied=0, already_applied=0, skipped=[], changed_files=[])
    for edit in payload["edits"]:
        if only and edit["page"] not in only:
            continue
        grouped[edit["file"]].append(edit)
    for filename, edits in grouped.items():
        try:
            if any(filename != f"sources/pages/{e['page']}/page.json" or not re.fullmatch(r"[\w-]+", e["page"]) for e in edits):
                raise ValueError("目标必须是指定页面的 page.json")
            path = root / filename
            raw = path.read_text(encoding="utf-8-sig")
            page, fields, changed, file_applied, file_already = json.loads(raw), defaultdict(list), False, 0, 0
            for edit in edits:
                fields[edit["field"]].append(edit)
            for field, group in fields.items():
                parent, key = field_at(page, field)
                original = parent[key]
                ordered = sorted(group, key=lambda e: e["start"])
                hashes = {(e.get("field_before_sha256"), e.get("field_after_sha256")) for e in group}
                if len(hashes) != 1 or any(a["end"] > b["start"] for a, b in zip(ordered, ordered[1:])):
                    raise ValueError("同字段改数单冲突")
                if group[0].get("field_after_sha256") == digest(original):
                    file_already += len(group)
                    continue
                if group[0].get("field_before_sha256") not in {None, digest(original)}:
                    raise ValueError("字段已变化，原字符范围需重取")
                limit = len(original)
                for edit in sorted(group, key=lambda e: e["start"], reverse=True):
                    a, b, old, new = edit["start"], edit["end"], edit["old_value"], edit["new_value"]
                    try:
                        scalars = formatted(old, new) == new
                    except (ValueError, InvalidOperation, TypeError):
                        scalars = False
                    if not scalars:
                        raise ValueError("改数单只能替换数字或日期")
                    elif not 0 <= a < b <= limit or original[a:b] != old:
                        raise ValueError("旧值不在原位置")
                    elif old == new:
                        file_already += 1
                    else:
                        whole_number(original, a, b)
                        parent[key] = parent[key][:a] + new + parent[key][b:]
                        number = re.fullmatch(r"registry\.numbers\[(\d+)\]\.text", field)
                        if number and edit.get("record_id") and edit.get("observed_at"):
                            page["registry"]["numbers"][int(number[1])]["source"] = (
                                f"见来源记录 {edit['record_id']}，观察于 {edit['observed_at']}")
                        file_applied += 1
                        changed = True
                    limit = a
                if group[0].get("field_after_sha256") not in {None, digest(parent[key])}:
                    raise ValueError("字段新哈希与替换结果不一致")
            report["already_applied"] += file_already
            if changed:
                rendered = json.dumps(page, ensure_ascii=False, indent=2) + "\n"
                path.write_text(rendered, encoding="utf-8", newline="\r\n" if "\r\n" in path.read_bytes().decode("utf-8-sig") else "\n")
                report["applied"] += file_applied
                report["changed_files"].append(filename)
        except (OSError, KeyError, ValueError, IndexError, TypeError) as exc:
            report["skipped"].extend(dict(edit, reason=str(exc)) for edit in edits)
    return report


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("edits", type=Path)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--only", help="只处理逗号分隔的页面")
    args = parser.parse_args(argv)
    payload = json.loads(args.edits.read_text(encoding="utf-8-sig"))
    report = apply_edits(args.root, payload, set(args.only.split(",")) if args.only else None)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if report["skipped"] else 0


if __name__ == "__main__":
    raise SystemExit(main())

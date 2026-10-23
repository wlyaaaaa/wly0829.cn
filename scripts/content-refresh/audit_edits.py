"""改数单人工审计：逐处列旧值→新值，标出最容易写错的几类（小数位变了、日期倒退、时分精度变了、数字跳变过半、不是数字或日期）。

只读改数单，不改任何文件；标出的项由 GPT 对照来源核过再决定是否应用。
用法：python -B -X utf8 scripts/content-refresh/audit_edits.py <取数目录>/number-edits.json
"""
from decimal import Decimal
import json
from pathlib import Path
import re
import sys

NUMERIC = re.compile(r"-?[\d,]+(?:\.\d+)?")
DATE = re.compile(r"(?:(\d{4})\s*年\s*|(\d{4})-)?(\d{1,2})(?:\s*月\s*|-)(\d{1,2})\s*日?(?:[ T](\d{1,2}):(\d{2}))?")


def flags(old, new):
    old, new, marks = str(old), str(new), []
    if NUMERIC.fullmatch(old) and NUMERIC.fullmatch(new):
        places = lambda s: len(s.split(".")[1]) if "." in s else 0
        if places(old) != places(new):
            marks.append("小数位变化")
        a, b = Decimal(old.replace(",", "")), Decimal(new.replace(",", ""))
        if a and abs(b - a) / abs(a) > Decimal("0.5"):
            marks.append(f"跳变 {float((b - a) / a):+.0%}")
        return marks
    da, db = DATE.search(old), DATE.search(new)
    if not (da and db):
        return ["非数字非日期"]
    key = lambda m: (int(m[1] or m[2] or 0), int(m[3]), int(m[4]), int(m[5] or 0), int(m[6] or 0))
    if (key(db)[0] and key(da)[0] and key(db) < key(da)) or (not (key(db)[0] and key(da)[0]) and key(db)[1:] < key(da)[1:]):
        marks.append("日期倒退")
    if bool(da[5]) != bool(db[5]):
        marks.append("时分精度变化")
    return marks


def main(path):
    payload = json.loads(Path(path).read_text("utf-8-sig"))
    flagged = 0
    for edit in payload["edits"]:
        marks = flags(edit["old_value"], edit["new_value"])
        flagged += bool(marks)
        print(("!! " if marks else "   ") + f"{edit['page']}  {edit['record_id']}  {edit['old_value']!r} → {edit['new_value']!r}"
              + (f"  [{'，'.join(marks)}]" if marks else ""))
    print(f"\n改动 {len(payload['edits'])} 处，待核 {flagged} 处，跳过 {len(payload['skipped'])} 处，人工核对 {len(payload.get('manual_reviews', []))} 处")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1]))

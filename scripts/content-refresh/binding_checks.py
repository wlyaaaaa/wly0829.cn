"""登记与页面的对应自检：只读当前作者文件，不读来源；严格盘点据此拦下下次按需更新必然失败或写错的绑定。"""
import json
from pathlib import Path
import re
import sys

from apply_edits import NUMBER, locate, same_value
from authors import resolve_author

# 正文里“10 月 22 日 06:47 计数”“（10 月 22 日数）”这类观察时间；前面带“那次、当时”的是历史，不算
OBSERVED = re.compile(r"(?<![\d.])(\d{1,2}) ?月 ?(\d{1,2}) ?日(?: ?(\d{1,2}):(\d{2}))?(?:（北京时间）)? ?(?:这次|本轮|再|又|重新|实际)?"
                      r"(计数|重数|数|重读|读取|读|再看|看|核对|查|统计|现场读)(?![据字])")
PAST = re.compile(r"(那次|当时|此前|之前|原先|历史|旧页|曾|上次)[^。；\n]{0,6}$")
STOP = "。；\n|"  # 表格按格算
HISTORY_SECTIONS = {"history", "evolution", "timeline"}


def _walk(doc, field):
    for part in re.findall(r"[^.\[\]]+|\[\d+\]", field):
        doc = doc[int(part[1:-1])] if part.startswith("[") else doc[part]
    return doc


def _bound(root, page):
    sys.path.insert(0, str(Path(root) / "src/typeset"))
    from engine.content import bound_json
    return bound_json(Path(root) / f"sources/pages/{page}/page.json", read=lambda p: Path(p).read_text("utf-8-sig"))


def field_text(root, page, field, cache):
    """作者文件里的原文；含 {{…}} 占位的字段按展开后的文字核对（项目总览等页的数字由占位算出）。"""
    if (page, field) not in cache:
        target = resolve_author(root, page, field)
        text = _walk(json.loads((Path(root) / target["file"]).read_text("utf-8-sig")), target["field"])
        if isinstance(text, str) and "{{" in text:
            text = _walk(_bound(root, page), field)
        cache[page, field] = text
    return cache[page, field]


def _same(a, b):
    try:
        return same_value(a, b)
    except Exception:
        return str(a).replace(",", "") == str(b).replace(",", "")


def binding_findings(root, records):
    """pattern：自动现值的 page_pattern 在当前字段里不是恰好一处；digits：取数小数位和页面写法不同；
    mirror：挂着 registry_number 的页内数字表数值已和正文不同（应用时必定失败、连带截至日期推不动）；
    observed：自动数字同句里有没登记的观察时间（数字会变、时间不会，下次就成了错配）。"""
    root, cache = Path(root), {}
    out = {"pattern": [], "digits": [], "mirror": [], "observed": [], "manual_qualified": []}
    by_id = {r["id"]: r for r in records}
    frozen = {}
    for r in records:  # 截至日期同时连着自动项和人工项：人工项取不到新值，这个日期和同组自动数字就永远推不动
        if r.get("historical") or not r.get("qualifies"):
            continue
        if r["page"] not in frozen:
            page = json.loads((root / f"sources/pages/{r['page']}/page.json").read_text("utf-8-sig"))
            frozen[r["page"]] = page.get("kind") == "frozen" or page.get("status") in {"frozen", "冻结", "已冻结", "historical", "历史"}
        manual = [q for q in r["qualifies"] if not by_id.get(q, {}).get("automatic") or (by_id.get(q, {}).get("retrieve") or {}).get("kind") == "manual"]
        if manual and len(manual) < len(r["qualifies"]) and not frozen[r["page"]]:  # 只连人工项的日期随人工核对一起改
            out["manual_qualified"].append(dict(record_id=r["id"], page=r["page"], field=r.get("field"),
                reason="截至日期连着人工项 " + "、".join(manual) + "：拆成自动项和人工项各自的日期，或把人工项改成自动取数"))
    pages = {}
    spans = {}
    for r in records:
        if r.get("historical") or not r.get("field") or not r.get("page_pattern"):
            continue
        try:
            text = field_text(root, r["page"], r["field"], cache)
        except (OSError, KeyError, IndexError, ValueError, TypeError) as exc:
            out["pattern"].append(dict(record_id=r["id"], page=r["page"], field=r["field"], reason=f"字段取不到：{exc}"))
            continue
        hits = [m for m in re.finditer(r["page_pattern"], str(text), re.M) if m.lastindex]
        spans.setdefault((r["page"], r["field"]), []).extend((m.span(1), r) for m in hits)
        if len(hits) != 1:
            if r.get("automatic"):
                out["pattern"].append(dict(record_id=r["id"], page=r["page"], field=r["field"], reason=f"page_pattern 命中 {len(hits)} 处，应恰好 1 处"))
            continue
        fragment = hits[0].group(1)
        digits = (r.get("retrieve") or {}).get("digits")
        places = len(fragment.split(".")[1]) if "." in fragment else 0
        if digits is not None and NUMBER.fullmatch(fragment) and places != digits:
            out["digits"].append(dict(record_id=r["id"], page=r["page"], field=r["field"], reason=f"页面写 {fragment}（{places} 位小数），retrieve.digits={digits}"))
        number_id = r.get("registry_number")
        if number_id and not r.get("qualifies"):
            if r["page"] not in pages:
                pages[r["page"]] = json.loads((root / f"sources/pages/{r['page']}/page.json").read_text("utf-8-sig"))
            number = next((n for n in pages[r["page"]].get("registry", {}).get("numbers", []) if n.get("id") == number_id), None)
            try:
                a, b = locate(number["text"], {k: r[k] for k in ("value_index", "original_value_index") if k in r}, True)
                drift = not _same(number["text"][a:b], fragment)
            except (TypeError, ValueError, KeyError, IndexError):
                drift = True
            if drift:
                out["mirror"].append(dict(record_id=r["id"], page=r["page"], field=r["field"],
                    reason=f"页内数字表 {number_id} 写 {number['text'] if number else '（不存在）'!r}，正文是 {fragment}；同步数字表或去掉 registry_number"))
    for (page, field), found in spans.items():
        text = cache.get((page, field))
        if not isinstance(text, str) or not field.startswith(("screens[", "status_line.source")):
            continue
        if field.startswith("screens["):
            screen = _walk(pages.get(page) or pages.setdefault(page, json.loads((root / f"sources/pages/{page}/page.json").read_text("utf-8-sig"))), field.rsplit(".", 1)[0])
            if screen.get("section") in HISTORY_SECTIONS:
                continue
        auto = [s for s, r in found if r.get("automatic") and not r.get("qualifies") and not r.get("historical")]
        for m in OBSERVED.finditer(text):
            if PAST.search(text[max(0, m.start() - 12):m.start()]) or any(a <= m.start(1) < b or m.start() <= a < m.end() for (a, b), _ in found):
                continue
            a = max(text.rfind(c, 0, m.start()) for c in STOP) + 1
            b = min([i for i in (text.find(c, m.end()) for c in STOP) if i >= 0] or [len(text)])
            if any(a <= s[0] < b for s in auto):
                out["observed"].append(dict(page=page, field=field, excerpt=text[max(0, m.start() - 20):m.end() + 4].replace("\n", " "),
                    reason="同句自动数字会推进、这个观察时间不会：登记日期联动记录（qualifies 同句数字），或改成不另写时间"))
    return out

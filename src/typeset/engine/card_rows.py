"""Choose wider existing layouts when text would make narrow, uneven card rows."""
from math import ceil
import re

PROTECTED_PAGES = {"home", "cockpit", "computer-access"}
CARD_TYPES = {"content_card", "points_card", "quote", "source_text_card"}


def protected_page(page):
    if isinstance(page, str):
        return page.strip("/") in PROTECTED_PAGES
    return (any(page.get(key) in PROTECTED_PAGES for key in ("page", "kind", "id"))
            or page.get("url") in ("/", "/cockpit/", "/computer-access/"))


def text_load(value):
    if isinstance(value, dict):
        return sum(text_load(value.get(key, "")) for key in ("name", "lead", "text", "cols", "items", "lines"))
    if isinstance(value, list):
        return sum(map(text_load, value))
    # Latin characters occupy less horizontal space; markup is not displayed.
    return sum(1 if ord(c) >= 0x2e80 else .55 for c in re.sub(r"\*\*|`", "", str(value)))


def balanced_columns(loads, columns, width=1672, icon=False, last_wide=False, font=24):
    for count in range(columns, 0, -1):
        capacity = max(1, (width / count - 56 - (76 if icon else 0)) / font)
        rows = [loads[i:i + count] for i in range(0, len(loads), count)]
        if last_wide and rows and len(rows[-1]) > 1:
            rows[-1:] = [rows[-1][:-1], rows[-1][-1:]]
        bad = False
        for row in rows:
            if len(row) < 2:
                continue
            lines = sorted(ceil(n / capacity) + 2 for n in row)
            # Six body lines are about 200 canvas px; compare the two tallest cards.
            bad |= lines[-1] - lines[-2] >= 6 and lines[-1] > 1.8 * max(1, lines[-2])
        if not bad:
            return count
    return 1


def fit_card_rows(page, orient, blocks):
    """Mutate layout specs only; source nodes, font roles and source order remain intact."""
    if protected_page(page):
        return 0
    changed = 0
    for block in blocks:
        kind, spec, nodes = block["type"], block["spec"], block["nodes"]
        if kind not in CARD_TYPES | {"flow"}:
            continue
        if kind == "flow":
            # Bespoke branches, bands and explicit turns own their topology.
            if spec.get("direction", "vertical" if orient == "v" else "horizontal") != "horizontal" or any(spec.get(k) for k in
                    ("item_rows", "row_counts", "rows", "turn_after", "branches", "branch_after", "path", "variant",
                     "hero_after_item", "illustration_after_item", "decoration_after")):
                continue
            if any(n.get("type") not in ("steps", "card") for n in nodes):
                continue
            loads = [text_load(item) for n in nodes for item in (n["items"] if n["type"] == "steps" else [n])]
            default = min(6, len(loads))
        else:
            split_paras = kind == "points_card" and spec.get("split_paras") is True and nodes and all(n.get("type") == "para" for n in nodes)
            if spec.get("whole_block") or spec.get("split_cards") is False and not split_paras or any(spec.get(k) for k in
                    ("item_pages", "body_columns", "inner_columns", "item_cards", "split_after", "column_fill")):
                continue
            loads = []
            for node in nodes:
                if node.get("type") == "bullets" and kind == "content_card" and all(it.get("lead") for it in node["items"]):
                    loads.extend(map(text_load, node["items"]))
                elif split_paras or not loads or node.get("type") in ("card", "group", "h1", "h2", "h3"):
                    loads.append(text_load(node))
                else:
                    loads[-1] += text_load(node)
            default = (2 if sum(loads) / max(1, len(loads)) > 60 or len(loads) == 4 else min(3, len(loads))) if kind == "content_card" else 1
        key = "columns_v" if orient == "v" else "columns"
        columns = spec.get(key, spec.get("columns", default) if kind == "flow" or orient == "h" else 1)
        if type(columns) is not int or columns < 2 or len(loads) < 2:
            continue
        width = spec.get("width", "100%")
        canvas, font = (941, 36) if orient == "v" else (1672, 24)
        width = canvas * float(width[:-1]) / 100 if isinstance(width, str) and re.fullmatch(r"\d+(?:\.\d+)?%", width) else canvas
        count = balanced_columns(loads, columns, width, spec.get("illustration") in ("left_inside", "right_inside"), spec.get("last_full_width"), font=font)
        if count != columns:
            if kind == "flow" and spec.get("row_order"):
                groups = [list(map(int, re.findall(r"\d+", part))) for part in str(spec["row_order"]).split("/")]
                if [n for group in groups for n in group] != list(range(1, len(loads) + 1)):
                    continue
                spec["row_order"] = " / ".join("-".join(map(str, group[i:i + count])) for group in groups for i in range(0, len(group), count))
            spec[key] = count
            if kind != "flow" and count > 1 and len(loads) % count == 1 and loads[-1] > 80: spec["last_full_width"] = True
            if kind == "flow" and count == 1:
                spec["direction"] = "vertical"
            changed += 1
    return changed

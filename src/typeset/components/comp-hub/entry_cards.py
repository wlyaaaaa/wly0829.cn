"""入口图卡的 link_grid 分支；普通分组计数原样交回传入的函数。

entry_cards / image_card 明确启用；有 icons 或 illustration 的规格也只
在真实首链接段落、链接卡名或 linkrow 上启用。段落仅提升原首链接，
其余原文全部作为说明；linkrow 按原记号逐链接拆卡。图只按明确名单、
名字映射或 ctx.slots 的槽号取，不消费 ctx.take_icons 的排序游标。
"""

import html
import importlib
import math
from pathlib import Path
import re
import sys


ENTRY_VARIANTS = frozenset(("entry_cards", "entry_card", "entry", "image_card", "image_cards", "image-card"))
SPEC_FIELDS = {"link_grid": (
    "variant", "columns", "portrait_columns", "columns_v", "rows", "portrait_rows", "gridlayout",
    "illustration", "illustration_v", "icons", "icon_map", "icon_slots", "align", "connector", "entry_arrow_refs",
    # These belong to the unchanged count-grid fallback.
    "label_position", "count_position", "freeze_last",
)}
_TOKEN = re.compile(r"〔[^〔〕]+〕|【[^【】]+】|［[^［］]+］")
_COUNT = re.compile(r"^[0-9０-９][0-9０-９,，.．]*\s*(?:个项目|个|项|条|份|次)\s*$")


def _entries(node):
    kind = node.get("type")
    if kind == "linkrow":
        source = "\n".join(node.get("src", []))
        tokens = _TOKEN.findall(source)
        if tokens and not _TOKEN.sub("", source).strip():
            return [(token, "") for token in tokens]
        if not source and node.get("links"):
            return [(f"〔{name}〕", "") for name in node["links"]]
        return None
    if kind == "para":
        text = node.get("text", "")
        token = _TOKEN.match(text)
        if token:
            return [(token.group(), text[token.end():])]
    if kind == "card" and _TOKEN.fullmatch(node.get("name", "")):
        return [(node["name"], node.get("text", ""))]
    return None


def _plain(text):
    return re.sub(r"[〔〕【】［］]|\*\*|`", "", text).strip()


def _issue(ctx, message, kind="asset"):
    ctx.warn(message)
    ctx.incomplete(message, kind)


def _count_row(node):
    text = node.get("text", "") if node.get("type") == "para" else ""
    tokens = list(_TOKEN.finditer(text))
    return bool(tokens and tokens[0].start() == 0 and all(
        _COUNT.fullmatch(_plain(text[token.end():tokens[i + 1].start() if i + 1 < len(tokens) else len(text)]).replace("｜", ""))
        for i, token in enumerate(tokens)))


def _requested(spec, records):
    entries = [entry for _, items in records if items for entry in items]
    if not entries:
        return False
    variant = spec.get("variant")
    if variant in ENTRY_VARIANTS:
        return True
    if variant not in (None, "") or spec.get("count_position"):
        return False
    # Image specifications cannot accidentally convert the old label/count grid.
    if (any(_count_row(node) for node, _ in records) or
            any(_COUNT.fullmatch(_plain(body).replace("｜", "")) for _, body in entries)):
        return False
    icons = spec.get("icons")
    has_icons = icons == "auto" or isinstance(icons, (list, tuple)) and bool(icons) or bool(spec.get("icon_map"))
    illustration = spec.get("illustration_v", spec.get("illustration"))
    return bool(has_icons or illustration not in (None, "", "none", "auto", False))


def _rows(spec, ctx, count):
    columns = spec.get("columns", 2 if ctx.orient == "v" else 4)
    if ctx.orient == "v":
        columns = spec.get("portrait_columns", spec.get("columns_v", columns))
    if not isinstance(columns, int) or isinstance(columns, bool) or columns < 1:
        _issue(ctx, "入口卡 columns 无效；保留全部入口并按该方向默认列数排。", "composition")
        columns = 2 if ctx.orient == "v" else 4
    rows = spec.get("portrait_rows") if ctx.orient == "v" else None
    if rows is None:
        rows = spec.get("rows", spec.get("gridlayout"))
    if rows is not None:
        if (isinstance(rows, (list, tuple)) and rows and
                all(isinstance(n, int) and not isinstance(n, bool) and n > 0 for n in rows) and sum(rows) == count):
            return list(rows)
        _issue(ctx, "入口卡 rows/gridlayout 与实际入口数不符；保留全部入口并按 columns 排。", "composition")
    return [min(columns, count - i) for i in range(0, count, columns)]


def _resolve(ctx, path):
    if not isinstance(path, str) or not path:
        return None
    resolved = ctx.resolve(path)
    return ctx.asset_url(resolved) if Path(resolved).is_file() else None


def _slot_metadata(ctx):
    """Only inspect the engine's active asset source; never read candidate mappings."""
    assets = importlib.import_module("engine.assets")
    rows = assets.for_screen(ctx.screen["id"], "icon", ctx.orient)
    return {int(float(row.get("slot_ordinal") or 0)): row for row in rows}


def _icons(spec, ctx, names, placement):
    if spec.get("icons") == "none" or placement == "none":
        return [(None, None, False)] * len(names)
    explicit = spec.get("icons")
    mapping = spec.get("icon_map")
    if isinstance(mapping, dict):
        explicit = [mapping.get(name, mapping.get(_plain(name))) for name in names]
    if isinstance(explicit, (list, tuple)):
        result = []
        for i, name in enumerate(names):
            url = _resolve(ctx, explicit[i] if i < len(explicit) else None)
            if not url:
                _issue(ctx, f"入口卡“{_plain(name)}”缺少明确名单中的图标；保留该图槽。")
            result.append((url, i + 1, True))
        return result
    # Use ordinal lookup, including absent slots. Never zip a compressed icon list.
    slots = dict(ctx.slots("icon"))
    ordinals = spec.get("icon_slots")
    if ordinals is None:
        ordinals = list(range(1, len(names) + 1))
    if not isinstance(ordinals, (list, tuple)) or len(ordinals) != len(names):
        _issue(ctx, "入口卡 icon_slots 与入口数不符；未推定其它素材映射，保留所有图槽。")
        return [(None, None, True)] * len(names)
    metadata = _slot_metadata(ctx) if slots else {}
    result = []
    for name, ordinal in zip(names, ordinals):
        valid = isinstance(ordinal, int) and not isinstance(ordinal, bool) and ordinal > 0
        url = slots.get(ordinal) if valid else None
        record = metadata.get(ordinal, {}) if valid else {}
        if not url:
            _issue(ctx, f"入口卡“{_plain(name)}”的图标槽 {ordinal} 缺少素材；保留该槽，不挪后续图标。")
        else:
            verified = record.get("semantic_verified") or record.get("mapping_verified")
            status = record.get("semantic_status", "")
            if not verified and status not in ("matched_existing_objects", "source_clause_matched"):
                _issue(ctx, f"入口卡“{_plain(name)}”的图标槽 {ordinal} 语义映射未核实；保留槽位映射，素材仍未完成。")
            if status in ("unresolved_semantics_fallback", "unresolved", "unmapped"):
                url = None
        result.append((url, ordinal if valid else None, True))
    return result


def _text(ctx, text, role):
    return f'<div class="hub-entry-{role} tb" data-role="entry-{role}">{ctx.inline(text)}</div>'


def _entry_arrows(spec, ctx, records):
    """仅按唯一的原入口完整名称绑定；配置不是新文案或入口排序指令。"""
    if "entry_arrow_refs" not in spec:
        return {}
    refs = spec["entry_arrow_refs"]
    if not isinstance(refs, list) or any(not isinstance(ref, str) or not ref for ref in refs):
        _issue(ctx, "entry_arrow_refs 必须是原入口完整名称的字符串数组；未推定入口箭头。", "composition")
        return {}
    names = [_plain(name) for _, items in records if items for name, _ in items]
    bindings = {}
    for ref in refs:
        if refs.count(ref) != 1:
            _issue(ctx, f"entry_arrow_refs 重复指定“{ref}”；未重复或猜测添加入口箭头。", "composition")
        elif names.count(ref) != 1:
            _issue(ctx, f"入口箭头“{ref}”没有唯一匹配的原入口完整名称；未按位置或部分字猜测。", "composition")
        else:
            bindings[names.index(ref)] = ref
    return bindings


def _entry_arrow(ref):
    # 复用 core 已有箭头轮廓；形状无字，颜色和显示尺寸取共享正文/强调变量。
    return (f'<svg class="hub-entry-arrow arrow" data-comp="arrow" data-entry-arrow-ref="{html.escape(ref, quote=True)}" '
            'viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false" '
            'xmlns="http://www.w3.org/2000/svg"><path d="M0 20H65V0L100 50L65 100V80H0Z" fill="currentColor"></path></svg>')


def _render(block, ctx, records, arrow_refs=None):
    spec = block.get("spec", {})
    entries = [entry for _, items in records if items for entry in items]
    sizes = _rows(spec, ctx, len(entries))
    tracks = math.lcm(*sizes)
    placement = spec.get("illustration", "left_inside" if ctx.orient == "v" else "top_inside")
    if ctx.orient == "v":
        placement = spec.get("illustration_v", placement)
    if placement not in ("top_inside", "left_inside", "none"):
        _issue(ctx, f"入口卡 illustration={placement!r} 尚未支持；按该方向默认位置保留图槽。", "composition")
        placement = "left_inside" if ctx.orient == "v" else "top_inside"
    if spec.get("connector") not in (None, "", "none", "auto", False):
        _issue(ctx, "入口卡只支持 connector=none；连接构图尚未完成。", "composition")
    icons = _icons(spec, ctx, [name for name, _ in entries], placement)
    align = "center" if spec.get("align") == "center" else "left"
    out = [f'<div class="c-hub-entry-cards" data-comp="link_grid" data-orient="{ctx.orient}" '
           f'data-align="{align}" style="--hub-entry-tracks:{tracks};--hub-entry-min-font:{ctx.min_font}px">']
    index, row, row_index, column, in_row = 0, 1, 0, 1, 0
    for node, items in records:
        if items is None:
            if column > 1:
                row += 1
                column = 1
            core = sys.modules.get("components_core") or importlib.import_module("components.core")
            out.append(f'<div class="hub-entry-extra" style="grid-row:{row};grid-column:1 / -1">{core.node_html(node, ctx)}</div>')
            row += 1
            continue
        for name, body in items:
            url, ordinal, reserve = icons[index]
            arrow_ref = (arrow_refs or {}).get(index)
            if arrow_ref and not reserve:
                _issue(ctx, f"入口“{arrow_ref}”没有对应图标位；原内容保留，未将链接尾部箭头代作图标箭头。", "composition")
            span = tracks // sizes[row_index]
            card_placement = placement if reserve else "none"
            out.append(f'<article class="hub-entry-card card" data-entry-index="{index + 1}" '
                       f'data-illustration="{card_placement}" style="grid-row:{row};grid-column:{column} / span {span}">')
            if reserve:
                slot = html.escape(str(ordinal or ""), quote=True)
                arrow_attr = f' data-entry-arrow-ref="{html.escape(arrow_ref, quote=True)}"' if arrow_ref else ''
                out.append(f'<div class="hub-entry-icon" data-icon-slot="{slot}"{arrow_attr}>')
                if url:
                    out.append(f'<img src="{html.escape(str(url), quote=True)}" alt="">')
                if arrow_ref:
                    out.append(_entry_arrow(arrow_ref))
                    ctx.warn(f"入口“{arrow_ref}”图标区新增无字箭头外观待本人复查。")
                out.append('</div>')
            out.append('<div class="hub-entry-copy">' + _text(ctx, name, "name"))
            if body:
                out.append(_text(ctx, body, "body"))
            out.append('</div></article>')
            index += 1
            in_row += 1
            column += span
            if in_row == sizes[row_index]:
                row += 1
                row_index += 1
                column = 1
                in_row = 0
    return ''.join(out) + '</div>'


def wrap_link_grid(fallback):
    """Return the standard two-argument renderer without changing fallback calls."""
    def link_grid(block, ctx):
        records = [(node, _entries(node)) for node in block.get("nodes", [])]
        arrow_refs = _entry_arrows(block.get("spec", {}), ctx, records)
        if not _requested(block.get("spec", {}), records):
            if arrow_refs:
                _issue(ctx, "entry_arrow_refs 没有实际入口图卡及其图标位可承接；原链接网格保留，未新增箭头。", "composition")
            return fallback(block, ctx)
        return _render(block, ctx, records, arrow_refs)
    return link_grid

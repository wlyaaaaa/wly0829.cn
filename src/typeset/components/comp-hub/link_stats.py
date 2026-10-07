"""总页入口和表头数字卡；文字只取 nodes，DOM 保持定稿节点顺序。

columns / portrait_columns（兼容 columns_v）控制列数；rows 或 gridlayout
可用逐行正整数数组。每方向规格中的 columns 也适用于该方向。
统计卡的无字外壳和文字用 data-cell 对应，可直接核对每格的文字边界。
header_value_table: label_position=above/left/below（below 表头是数字）；
number_header_table 明确把原表头当数字、数据行当说明。
emphasis_first_ratio（默认强调时1.25）或 emphasis_first_width（fr/百分比）
只改变首格。portrait_emphasis_first_ratio/width 可单独覆盖竖版。
icons=auto 连续领取当前屏图标，列表按格映射，icon_map 按原文名映射。
para_fields/paragraph_stats 支持数字｜说明、**数字**说明；真实数字card/para亦支持。
numbered_fields/numbered_pipe 支持 lead 或 cols 中的数字 steps；lead_value 支持 bullets/card。
数字 group 与紧随的 para 说明合成一格；每周一10:30这类真实数字时间亦保留。
序号独立显示在数值前，不合成数字。ctx.slots 按原槽号取图，缺槽留空并记未完成。
items_layout 消费 number/body_position、两栏width、icon_position、as_of_split。
其它 stat_card 变体直接调用 registry 已载入的 core 原函数。
"""

import importlib
import html
import math
from fractions import Fraction
from pathlib import Path
import re
import sys


_LINK = re.compile(r"〔[^〔〕]+〕|【[^【】]+】|［[^［］]+］")
_COUNT = re.compile(r"^(.*?)([0-9０-９][0-9０-９,，.．]*\s*(?:个项目|个|项|条|份|次))\s*$", re.S)
_NUMBER = re.compile(r"^(?:至少|约|近|超过|不少于|最多|不足)?\s*[0-9０-９]")
_PERIOD = re.compile(r"^每(?:周[一二三四五六日天]|天|月|年)?\s*[0-9０-９]")
_KEY = re.compile(r"^(?:Ctrl|Alt|Shift|Win|Meta)(?:\+[A-Za-z0-9]+)+$", re.I)
_FIELD_VARIANTS = {"para_fields", "mixed_fields", "numbered_fields", "numbered_pipe", "paragraph_stats", "lead_value"}
_VARIANTS = _FIELD_VARIANTS | {None, "", "header_value_table", "number_header_table"}

# 由族入口登记；这里只列本组件实际读取并核对的字段。
STAT_CARD_SPEC_FIELDS = (
    "columns", "columns_v", "portrait_columns", "rows", "portrait_rows", "gridlayout",
    "variant", "para_fields", "numbered_pipe", "lead_value", "paragraph_stats", "numbered_fields", "mixed_fields",
    "icons", "icon_map", "icon_slots", "illustration", "illustration_v", "illustration_source", "illustration_index",
    "label_position", "emphasis_first", "emphasis_first_ratio", "emphasis_first_width",
    "portrait_emphasis_first_ratio", "portrait_emphasis_first_width", "items_layout", "portrait_items_layout", "layout",
    "historical", "tone", "align", "connector", "preserve_source_order", "expected_cards", "item_count", "card_count", "number_style", "size",
)
SPEC_FIELDS = {"stat_card": STAT_CARD_SPEC_FIELDS}


def _core():
    # engine.registry 的实际包名是 components_core；直接复用同一实例。
    return sys.modules.get("components_core") or importlib.import_module("components.core")


def _text(ctx, text, cls, tag="div", attrs=""):
    return f'<{tag} class="{cls} tb"{attrs}>{ctx.inline(text)}</{tag}>'


_VALUE_TOKEN = re.compile(
    r"(?P<number>[0-9０-９]+(?:[,，.．][0-9０-９]+)*(?:(?:[×xX:：–—~～-])[0-9０-９]+(?:[,，.．][0-9０-９]+)*)*(?:[%％])?)"
    r"|(?P<unit>[A-Za-z\u3400-\u9fff]+)"
)
def _value_piece(fragment, seen_number=False):
    """保留原空白和标点，仅给数字原串、完整单位词增加不可断组。"""
    plain = html.unescape(fragment)
    tokens = list(_VALUE_TOKEN.finditer(plain))
    out, position, index = [], 0, 0

    def unit(text):
        if seen_number:
            return f'<span class="hub-stat-detail-unit" data-role="body">{html.escape(text)}</span>'
        return html.escape(text)

    while index < len(tokens):
        token = tokens[index]
        out.append(html.escape(plain[position:token.start()], quote=False))
        text = token.group()
        kind = "number" if token.lastgroup == "number" else "unit"
        if kind == "number":
            seen_number = True
        body = html.escape(text, quote=False) if kind == "number" else unit(text)
        end = token.end()
        if kind == "number" and len(text) <= 2 and index + 1 < len(tokens):
            following = tokens[index + 1]
            gap = plain[end:following.start()]
            if following.lastgroup == "unit" and gap and gap.isspace():
                # 60 帧、1 秒一刷、1 个自动任务：数值与完整说明词同一组。
                body += html.escape(gap, quote=False) + unit(following.group())
                end, index, kind = following.end(), index + 1, "quantity"
        out.append(f'<span class="hub-stat-value-group" data-stat-group="{kind}">{body}</span>')
        position, index = end, index + 1
    out.append(html.escape(plain[position:], quote=False))
    return ''.join(out), seen_number


def _stat_value(ctx, text, cls, attrs=""):
    rendered = ctx.inline(text)
    plain = _plain(text)
    literal = (re.fullmatch(r"[0-9０-９]+[A-Za-z]+", plain) or
               re.match(r"^\d{4}\s*年", plain) or (_PERIOD.match(plain) and re.search(r"[:：]\d", plain)))
    if _numeric(text) and not literal:
        # 保留 inline 的原链接、粗体和热区标签，分组只处理其可见文字片段。
        parts, seen_number = [], False
        for piece in re.split(r"(<[^>]+>)", rendered):
            if not piece:
                continue
            if piece.startswith('<'):
                parts.append(piece)
            else:
                body, seen_number = _value_piece(piece, seen_number)
                parts.append(body)
        rendered = ''.join(parts)
    return f'<div class="{cls} tb"{attrs}>{rendered}</div>'


def _rows(spec, ctx, count, default):
    columns = spec.get("columns", default)
    if ctx.orient == "v":
        columns = spec.get("portrait_columns", spec.get("columns_v", columns))
    if isinstance(columns, (list, tuple)):
        columns = columns[0] if columns else default
    if not isinstance(columns, int) or isinstance(columns, bool) or columns < 1:
        ctx.warn("入口/统计列数无效；使用该方向默认列数。")
        columns = default
    rows = spec.get("portrait_rows") if ctx.orient == "v" else None
    if rows is None:
        rows = spec.get("rows", spec.get("gridlayout"))
    if rows is not None:
        if (isinstance(rows, (list, tuple)) and all(isinstance(n, int) and not isinstance(n, bool) and n > 0 for n in rows)
                and sum(rows) == count):
            return list(rows)
        ctx.warn("入口/统计 rows 或 gridlayout 与实际格数不符；按 columns 排完所有格。")
    return [min(columns, count - n) for n in range(0, count, columns)]


def _clean(text, divided=False):
    # 当前 expected_text 仅将 sep_row 项目数字行里的 · 视为记号。
    return text.replace("｜", "") if divided else text


def _split(text):
    if "｜" in text:
        return [_clean(part.strip(), True) for part in text.split("｜")]
    match = _COUNT.match(text)
    if match and match[1].strip():
        return [match[1].strip(), match[2]]
    return [text]


def _inline_entries(text):
    """多入口段落按每个原有链接拆分，保留链接间所有原文。"""
    matches = list(_LINK.finditer(text))
    if not matches or text[:matches[0].start()].strip():
        return [_split(text)]
    return [[match.group(), _clean(text[match.end():matches[i + 1].start() if i + 1 < len(matches) else len(text)].strip(), "｜" in text)]
            for i, match in enumerate(matches)]


def _entries(node):
    kind = node["type"]
    if kind == "para":
        return _inline_entries(node["text"])
    if kind == "linkrow":
        tokens = _LINK.findall("\n".join(node.get("src", [])))
        return [[token] for token in tokens or [f'〔{t}〕' for t in node.get("links", [])]]
    if kind == "card":
        return [[node["name"], *_split(node.get("text", ""))]]
    if kind in ("bullets", "steps", "stats"):
        rows = []
        for item in node.get("items", []):
            lead = item.get("lead", item.get("num"))
            text = item.get("text", "")
            parts = [lead, *_split(text)] if lead is not None else _split(text)
            if kind == "steps":
                parts[0] = str(item["n"]) + "　" + parts[0]
            rows.append(parts)
        return rows
    if kind == "table":
        rows = ([node["header"]] if node.get("header") is not None else []) + node.get("rows", [])
        return [[_clean(cell, "｜" in "\n".join(node.get("src", []))) for cell in row] for row in rows]
    return None


def link_grid(block, ctx):
    spec = block.get("spec", {})
    records = []
    for node in block.get("nodes", []):
        entries = _entries(node)
        if entries is None:
            records.append((None, _core().node_html(node, ctx)))
        else:
            records.extend((entry, None) for entry in entries)
    count = sum(entry is not None for entry, _ in records)
    rows = _rows(spec, ctx, count, 1 if ctx.orient == "v" else 3)
    # 不将普通尾段移到入口前后；其它节点原位跨满网格。
    columns = max(rows, default=1)
    out = [f'<div class="c-hub-links" data-comp="link_grid" data-orient="{ctx.orient}" '
           f'style="--hub-link-columns:{columns};--hub-min-font:{ctx.min_font}px">']
    index, row, col = 0, 1, 1
    for entry, extra in records:
        if entry is None:
            out.append(f'<div class="hub-link-extra" style="grid-row:{row};grid-column:1 / -1">{extra}</div>')
            row += 1
            col = 1
            continue
        frozen = (spec.get("freeze_last") and index == count - 1) or any("冻结" in value for value in entry)
        cls = " hub-link-frozen" if frozen else ""
        # 非等宽行按共同的网格列数定位；实际 projects-home 为 3×3 / 1×9。
        out.append(f'<article class="hub-link-cell card{cls}" style="grid-row:{row};grid-column:{col}">')
        for i, value in enumerate(entry):
            role = "hub-link-label" if i == 0 else "hub-link-count" if i == len(entry) - 1 else "hub-link-detail"
            out.append(_text(ctx, value, role))
        out.append('</article>')
        row_index = next((i for i, end in enumerate(_ends(rows)) if index < end), 0)
        index += 1
        col += 1
        if col > rows[row_index]:
            row += 1
            col = 1
    return ''.join(out) + '</div>'


def _ends(rows):
    total = 0
    for size in rows:
        total += size
        yield total


def _plain(text):
    return re.sub(r"\*\*|`", "", text).strip()


def _issue(ctx, message, kind="composition"):
    if hasattr(ctx, "incomplete"):
        ctx.incomplete(message, kind)
    else:
        ctx.warn(message)


def _numeric(text):
    text = _plain(text)
    return bool(_NUMBER.match(text) or _PERIOD.match(text))


def _size_attr(spec, ctx):
    """中档只收紧卡片留白，数字和正文字形角色均不变。"""
    size = spec.get("size")
    if size is None:
        return ""
    if size != "medium":
        _issue(ctx, f"stat_card 未实现 size={size!r}；保留默认留白，字号不变。")
        return ""
    return ' data-size="medium"'


def _mode(spec, ctx):
    mode = spec.get("illustration_v", spec.get("illustration", "top_inside")) if ctx.orient == "v" else spec.get("illustration", "top_inside")
    mode = {"right": "right_inside", "left": "left_inside"}.get(mode, mode)
    if mode not in ("left_inside", "top_inside", "right_inside", "above_card", "none"):
        _issue(ctx, f"stat_card 的插画方位 {mode!r} 未实现；保留数字与说明，图槽留空。")
        return "none"
    return mode


def _icons(names, spec, ctx, mode=None):
    """按明确名单或原图槽号取图；缺槽不挪后面的图，也不改画素材。"""
    count = len(names)
    if not count or spec.get("icons") == "none" or mode == "none":
        return [None] * count
    mapping = spec.get("icon_map")
    paths = spec.get("icons")
    if isinstance(mapping, dict):
        paths = [mapping.get(name, mapping.get(_plain(name))) for name in names]
    if isinstance(paths, (list, tuple)):
        result = []
        for i, name in enumerate(names):
            path = paths[i] if i < len(paths) else None
            resolved = ctx.resolve(path) if isinstance(path, str) and path else None
            if resolved and Path(resolved).is_file():
                result.append(ctx.asset_url(resolved))
            else:
                result.append(None)
                _issue(ctx, f"统计格 {i + 1}（{_plain(name)}）缺少已映射图标；保留空图槽。", "asset")
        return result
    role = "illustration" if spec.get("illustration_source") in ("illustration", "illustrations") else "icon"
    if not hasattr(ctx, "slots"):
        _issue(ctx, f"统计区无法按原图槽号取 {count} 个{role}；图槽留空。", "asset")
        return [None] * count
    try:
        slots = dict(ctx.slots(role) or [])
    except (OSError, ValueError, TypeError, AttributeError) as exc:
        _issue(ctx, f"统计区无法读取{role}原图槽号（{type(exc).__name__}）；图槽留空。", "asset")
        return [None] * count
    cursor = getattr(ctx, "_icon_i", 0) if role == "icon" else spec.get("illustration_index", 0)
    if not isinstance(cursor, int) or isinstance(cursor, bool) or cursor < 0:
        _issue(ctx, "stat_card 的 illustration_index 无效；主插画槽留空。")
        return [None] * count
    ordinals = spec.get("icon_slots", list(range(cursor + 1, cursor + count + 1)))
    if not isinstance(ordinals, (list, tuple)) or len(ordinals) != count:
        _issue(ctx, "统计 icon_slots 与数字格数不符；图槽留空，不推定其它映射。")
        return [None] * count
    result = []
    for name, ordinal in zip(names, ordinals):
        valid = isinstance(ordinal, int) and not isinstance(ordinal, bool) and ordinal > 0
        path = slots.get(ordinal) if valid else None
        if not path:
            _issue(ctx, f"统计格（{_plain(name)}）的{role}槽 {ordinal} 缺少素材；保留空槽。", "asset")
        result.append(path)
    if role == "icon" and "icon_slots" not in spec:
        # 即便中间缺图也推进逻辑槽号，后面的组不能复用已经分配的槽。
        ctx._icon_i = cursor + count
    return result


def _icon(url, cls="hub-stat-icon", reserve=False):
    body = f'<img src="{html.escape(str(url), quote=True)}" alt="">' if url else ''
    return f'<div class="{cls}{" hub-stat-icon-empty" if not url else ""}" aria-hidden="true">{body}</div>' if url or reserve else ''


def _first_ratio(spec, ctx, size):
    def get(key):
        return spec.get("portrait_" + key, spec.get(key)) if ctx.orient == "v" else spec.get(key)
    ratio = get("emphasis_first_ratio")
    width = get("emphasis_first_width")
    try:
        if width is not None:
            if isinstance(width, str) and width.endswith("%"):
                share = float(width[:-1]) / 100
                if not 0 < share < 1:
                    raise ValueError
                ratio = share * (size - 1) / (1 - share)
            else:
                ratio = float(str(width).removesuffix("fr"))
        if ratio is None:
            ratio = 1.25 if spec.get("emphasis_first") else 1
        ratio = float(ratio)
        if not math.isfinite(ratio) or ratio <= 0:
            raise ValueError
        return Fraction(str(ratio)).limit_denominator(20)
    except (TypeError, ValueError, ZeroDivisionError):
        ctx.warn("emphasis_first_width/ratio 无效；首格使用等宽。")
        return Fraction(1)


def _table_positions(sizes, spec, ctx):
    """虚拟公共网格精确承接不同行宽度；竖版第二行不会跟着首格变宽。"""
    weights = [[Fraction(1) for _ in range(size)] for size in sizes]
    if weights:
        weights[0][0] = _first_ratio(spec, ctx, sizes[0])
    unit_rows = [[int(w * math.lcm(*(x.denominator for x in row))) for w in row] for row in weights]
    totals = [sum(row) for row in unit_rows]
    tracks = math.lcm(*totals) if totals else 1
    positions = []
    for row, (units, total) in enumerate(zip(unit_rows, totals)):
        start = 1
        for unit in units:
            span = unit * tracks // total
            positions.append((row, start, span))
            start += span
    return tracks, positions


def _table_stats(node, spec, ctx):
    header, values = node.get("header"), node.get("rows", [])
    if not header or len(values) != 1 or len(values[0]) != len(header):
        _issue(ctx, "header_value_table 需要等长表头和一行数值；保留原表格排法。")
        return _core().node_html(node, ctx)
    layout = _layout(spec, ctx)
    _check_spec(spec, ctx, len(header), layout)
    if layout:
        _issue(ctx, "stat_card 的表格变体尚未执行 items_layout；保留表头/数据构图。")
    sizes = _rows(spec, ctx, len(header), 2 if ctx.orient == "v" else 4)
    position = spec.get("label_position", "left" if ctx.orient == "v" else "above")
    if position not in ("left", "above", "below"):
        _issue(ctx, f"stat_card 的 label_position={position!r} 未实现；按表头在上保留原文。")
        position = "above"
    left, below = position == "left", position == "below"
    mode = _mode(spec, ctx)
    icons = _icons(header if below else values[0], spec, ctx, mode)
    reserve = mode != "none" and spec.get("icons") != "none"
    top = reserve and mode in ("top_inside", "above_card")
    tracks, positions = _table_positions(sizes, spec, ctx)
    height = (1 if left else 2) + int(top)
    historical = _historical(spec)
    out = [f'<div class="grid stats hub-stat-grid card hub-stat-{position} hub-stat-mode-{mode}{" hub-stat-no-icon" if not reserve else ""}{" hub-stat-historical" if historical else ""}" '
           f'style="--hub-stat-columns:{tracks};--hub-stat-gap:var(--gap-card)">']
    for i, (row, start, span) in enumerate(positions):
        r = row * (height + 1) + 1
        shell_top = r + int(top and mode == "above_card")
        shell_height = height - int(top and mode == "above_card")
        pos = f'grid-row:{shell_top} / span {shell_height};grid-column:{start} / span {span}'
        emphasis = ' hub-stat-emphasis' if i == 0 and spec.get("emphasis_first") else ''
        out.append(f'<div class="hub-stat-shell card stat{emphasis}" data-cell="{i}" style="{pos}"></div>')
        if reserve:
            icon_height = 1 if top else height
            out.append(f'<div class="hub-stat-icon{" hub-stat-icon-empty" if not icons[i] else ""}" aria-hidden="true" data-cell="{i}" '
                       f'style="grid-row:{r} / span {icon_height};grid-column:{start} / span {span}">'
                       + (f'<img src="{html.escape(str(icons[i]), quote=True)}" alt="">' if icons[i] else '') + '</div>')
    for row in range(len(sizes) - 1):
        out.append(f'<div class="hub-stat-row-gap" aria-hidden="true" style="grid-row:{(row + 1) * (height + 1)};grid-column:1 / -1"></div>')
    # G1 的一个 table 节点必须是全部表头在前、全部数字在后。
    for source, texts in (("header", header), ("body", values[0])):
        for i, text in enumerate(texts):
            row, start, span = positions[i]
            role = "value" if (source == "header") == below else "label"
            r = row * (height + 1) + 1 + int(top) + (0 if source == "header" or left else 1)
            side = (' hub-stat-side-label' if source == "header" else ' hub-stat-side-value') if left else ''
            data_role = "num" if role == "value" else "body"
            render_text = _stat_value if role == "value" else _text
            out.append(render_text(ctx, text, f"hub-stat-{role}{side}", attrs=f' data-role="{data_role}" data-cell="{i}" style="grid-row:{r};grid-column:{start} / span {span}"'))
    return ''.join(out) + '</div>'


def _field(node, spec, has_stats):
    kind = node["type"]
    if kind == "card":
        name = node["name"]
        if _numeric(name) or (has_stats and _KEY.fullmatch(_plain(name))):
            return [(name, node.get("text", ""))]
    if kind == "para":
        text = node["text"]
        if importlib.import_module("engine.parse").sep_row(text):
            text = text.replace("·", "")
        if "｜" in text:
            name, description = text.split("｜", 1)
        else:
            match = re.match(r"^\*\*(.+?)\*\*[\s　]*(.+)$", text, re.S)
            if not match:
                return None
            name, description = match.groups()
        if _numeric(name):
            return [(name.strip(), description.strip())]
    if kind == "stats":
        return [(item["num"], item["text"]) for item in node["items"]]
    if kind in ("steps", "bullets"):
        items = node.get("items", [])
        fields = []
        for item in items:
            lead, body = item.get("lead"), item.get("text", "")
            cols = item.get("cols")
            if not lead and cols:
                lead, body = cols[0], "　".join(cols[1:])
            elif not lead and "｜" in body:
                lead, body = body.split("｜", 1)
            if not lead or not _numeric(lead):
                return None
            # 原编号是真字，只出现一次，独立小字角色，不拼成“12台”。
            fields.append((lead, body, str(item["n"]) if kind == "steps" else None))
        return fields or None
    return None


def _fields(nodes, spec):
    """数字组名与紧随的段落合成一格，其它节点保留在原位。"""
    has_stats = any(node["type"] == "stats" for node in nodes)
    fields, i = [], 0
    while i < len(nodes):
        node = nodes[i]
        if node["type"] == "group" and _numeric(node.get("name", "")):
            j, body = i + 1, []
            while j < len(nodes) and nodes[j]["type"] == "para":
                body.append(nodes[j]["text"])
                j += 1
            fields.append((node, [(node["name"], body)]))
            i = j
        else:
            fields.append((node, _field(node, spec, has_stats)))
            i += 1
    return fields


def _layout(spec, ctx):
    layout = spec.get("items_layout", spec.get("layout", {}))
    if ctx.orient == "v":
        layout = spec.get("portrait_items_layout", layout)
    if not isinstance(layout, dict):
        _issue(ctx, "stat_card 的 items_layout/layout 不是对象；该项构图未执行。")
        return {}
    known = {"node_type", "item_count", "order", "rows", "icon_position", "number_position", "body_position",
             "number_column_width", "body_column_width", "as_of_position", "as_of_style", "as_of_split"}
    for key in layout.keys() - known:
        _issue(ctx, f"stat_card 不认 items_layout.{key}；该项构图未执行。")
    return layout


def _historical(spec):
    return bool(spec.get("historical")) or spec.get("tone") == "historical"


def _check_spec(spec, ctx, count, layout):
    for key in ("expected_cards", "item_count", "card_count"):
        if key in spec and spec[key] != count:
            _issue(ctx, f"stat_card 的 {key}={spec[key]!r} 与真实数字格 {count} 不符。")
    if "item_count" in layout and layout["item_count"] != count:
        _issue(ctx, f"stat_card 的 items_layout.item_count 与真实数字格 {count} 不符。")
    if layout.get("order") not in (None, list(range(1, count + 1))):
        _issue(ctx, "stat_card 尚未执行 items_layout.order 的改序；原文顺序保留。")
    for key, options in {"number_position": ("left", "middle_left"), "body_position": ("right", "under_number"),
                         "as_of_position": ("bottom",), "as_of_style": ("gray",), "node_type": ("stats", "para", "steps", "group", "card", "bullets")}.items():
        if key in layout and layout[key] not in options:
            _issue(ctx, f"stat_card 尚未执行 items_layout.{key}={layout[key]!r}。")
    number_position, body_position = layout.get("number_position"), layout.get("body_position")
    if number_position and body_position and (number_position, body_position) not in (("left", "right"), ("middle_left", "under_number")):
        _issue(ctx, f"stat_card 尚未执行 items_layout 的数字/说明方位组合 {number_position}/{body_position}。")
    if spec.get("tone") not in (None, "", "historical"):
        _issue(ctx, f"stat_card 尚未执行 tone={spec['tone']!r}。")
    if spec.get("number_style") not in (None, "", "stat"):
        _issue(ctx, f"stat_card 尚未执行 number_style={spec['number_style']!r}。")
    if spec.get("connector") not in (None, "", "none", "auto"):
        _issue(ctx, f"stat_card 尚未执行 connector={spec['connector']!r}。")
    if spec.get("align") not in (None, "", "left", "center", "right", "auto"):
        _issue(ctx, f"stat_card 尚未执行 align={spec['align']!r}。")
    if _historical(spec):
        ctx.warn("统计历史灰底与小插画适度去色是新样式，待组件样张及本人确认；毛笔标题浓度不变。")


def _body_parts(body, layout):
    parts = list(body) if isinstance(body, (list, tuple)) else [body]
    result = []
    for i, part in enumerate(parts):
        split = part.rfind("截至") if layout.get("as_of_split") or layout.get("as_of_position") else -1
        group_date = len(parts) > 1 and i == len(parts) - 1 and (part.startswith("截至") or re.match(r"^\d+\s*月.*日", part))
        if split >= 0:
            if part[:split]:
                result.append((part[:split], False))
            result.append((part[split:], True))
        else:
            result.append((part, bool(group_date)))
    return result


def _width(value, default):
    try:
        value = float(str(value).removesuffix("%").removesuffix("fr"))
        return value if math.isfinite(value) and value > 0 else default
    except (TypeError, ValueError):
        return default


def _field_stats(block, ctx, fields, layout):
    spec = block.get("spec", {})
    count = sum(len(value) for _, value in fields if value is not None)
    names = [item[0] for _, value in fields if value is not None for item in value]
    mode = _mode(spec, ctx)
    icons = _icons(names, spec, ctx, mode)
    reserve = mode != "none" and spec.get("icons") != "none"
    default = 2 if ctx.orient == "v" else min(count, 4) or 1
    row_spec = dict(spec)
    if "rows" in layout:
        row_ids = layout["rows"]
        if isinstance(row_ids, list) and all(isinstance(row, list) and row for row in row_ids) and [i for row in row_ids for i in row] == list(range(1, count + 1)):
            row_spec["rows"] = [len(row) for row in row_ids]
        else:
            _issue(ctx, "stat_card 的 items_layout.rows 不对应原文连续格；该分行未执行。")
    sizes = _rows(row_spec, ctx, count, default)
    tracks, positions = _table_positions(sizes, dict(spec, emphasis_first=False), ctx)
    side = layout.get("number_position") == "left" and layout.get("body_position") == "right"
    icon_position = layout.get("icon_position", "left_above_number" if side else "top_left")
    if icon_position not in ("top_left", "left_above_number"):
        _issue(ctx, f"统计 icon_position={icon_position!r} 尚未支持，按该数字布局的默认位置排。")
        icon_position = "left_above_number" if side else "top_left"
    left_width = _width(layout.get("number_column_width"), 34)
    right_width = _width(layout.get("body_column_width"), 64)
    _check_spec(spec, ctx, count, layout)
    for key in ("number_column_width", "body_column_width"):
        if key in layout and _width(layout[key], 0) == 0:
            _issue(ctx, f"stat_card 的 items_layout.{key} 无效；该列宽未执行。")
    historical = _historical(spec)
    alignment = spec.get("align") if spec.get("align") in ("left", "center", "right") else "left"
    out = [f'<div class="c-hub-stats hub-stat-align-{alignment}{" hub-stat-historical" if historical else ""}" data-comp="stat_card" data-orient="{ctx.orient}"{_size_attr(spec, ctx)} '
           f'style="--hub-min-font:{ctx.min_font}px"><div class="grid stats hub-stat-fields" '
           f'style="grid-template-columns:repeat({tracks},minmax(0,1fr))">']
    index, offset, last_row = 0, 0, -1
    for node, value in fields:
        if value is None:
            next_row = positions[index][0] if index < len(positions) else len(sizes)
            extra_row = max(last_row + 1, next_row + offset)
            out.append(f'<div class="hub-stat-extra" style="grid-row:{extra_row + 1}">' + _core().node_html(node, ctx) + '</div>')
            offset, last_row = extra_row + 1 - next_row, extra_row
            continue
        for item in value:
            name, body = item[:2]
            ordinal = item[2] if len(item) > 2 else None
            row, start, span = positions[index]
            last_row = row + offset
            style = f' style="grid-row:{row + offset + 1};grid-column:{start} / span {span};--hub-stat-number-width:{left_width:g}fr;--hub-stat-body-width:{right_width:g}fr"'
            cls = ' hub-stat-detail-side' if side else ''
            cls += ' hub-stat-no-icon' if not reserve else ''
            cls += f' hub-stat-mode-{mode}'
            outside = reserve and mode == "above_card"
            if outside:
                out.append(f'<div class="stat hub-stat-item"{style}>')
                out.append(_icon(icons[index], "hub-field-icon", reserve))
                out.append(f'<article class="card hub-stat-field{cls}" data-icon-position="{icon_position}">')
            else:
                out.append(f'<article class="card stat hub-stat-field{cls}" data-icon-position="{icon_position}"{style}>')
                out.append(_icon(icons[index], "hub-field-icon", reserve))
            out.append(f'<div class="hub-field-number-line{" hub-field-numbered" if ordinal is not None else ""}">')
            if ordinal is not None:
                out.append(_text(ctx, ordinal, "hub-field-ordinal", "span", ' data-role="stat-ordinal"'))
            out.append(_stat_value(ctx, name, "num hub-field-value", attrs=' data-role="num"'))
            out.append('</div>')
            parts = _body_parts(body, layout)
            out.append('<div class="hub-field-description">')
            for part, date in parts:
                out.append(_text(ctx, part, "hub-stat-asof" if date else "body hub-field-body", attrs=' data-role="body"'))
            out.append('</div>')
            out.append('</article>')
            if outside:
                out.append('</div>')
            index += 1
    return ''.join(out) + '</div></div>'


def stat_card(block, ctx):
    spec = block.get("spec", {})
    variant = spec.get("variant")
    if variant not in _VARIANTS:
        return _core().COMPONENTS["stat_card"](block, ctx)
    if spec.get("variant") not in ("header_value_table", "number_header_table"):
        nodes = block.get("nodes", [])
        # 数字表头的真实单行表无需页代理另写 alias；全部表头/全部说明的 DOM 次序仍不变。
        if any(node["type"] == "table" and node.get("header") and all(_numeric(t) for t in node["header"]) for node in nodes):
            out = [f'<div class="c-hub-stats" data-comp="stat_card" data-orient="{ctx.orient}"{_size_attr(spec, ctx)} style="--hub-min-font:{ctx.min_font}px">']
            for node in nodes:
                out.append(_table_stats(node, dict(spec, label_position="below"), ctx) if node["type"] == "table" else _core().node_html(node, ctx))
            return ''.join(out) + '</div>'
        fields = _fields(nodes, spec)
        layout = _layout(spec, ctx)
        if any(value is not None for _, value in fields):
            return _field_stats(block, ctx, fields, layout)
        if variant in _FIELD_VARIANTS or any(spec.get(key) for key in _FIELD_VARIANTS):
            _issue(ctx, "stat_card 的数字变体未找到可用的真实数字字段；原文按原节点保留。")
        return _core().COMPONENTS["stat_card"](block, ctx)
    out = [f'<div class="c-hub-stats" data-comp="stat_card" data-orient="{ctx.orient}" '
           f'{_size_attr(spec, ctx)} style="--hub-min-font:{ctx.min_font}px">']
    for node in block.get("nodes", []):
        table_spec = dict(spec, label_position="below") if spec.get("variant") == "number_header_table" else spec
        out.append(_table_stats(node, table_spec, ctx) if node["type"] == "table" else _core().node_html(node, ctx))
    return ''.join(out) + '</div>'


COMPONENTS = {"link_grid": link_grid, "stat_card": stat_card}

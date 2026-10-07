"""项目独立卡与分组目录卡；可见文字只取 block.nodes。

规格：columns / portrait_columns 是数字区或目录网格的最大列数；
目录还可传列数数组，逐组指定（规则总页用 [3, 4, 3]）。
illustration 支持 right_inside（项目默认）、left_inside（目录默认）、
top_inside、above_card、outside、none。illustration_index 选择项目插画。
项目数字：number_rows 是各行格数，须合计等于实际格数；竖版独立使用
portrait_number_rows。number_column_widths 是逐行正数比例，竖版对应
portrait_number_column_widths。stat_alignment 为 left/center/right；
stat_style 为 rounded_thin_border 或 soft_filled_borderless。
separator_after_date 控制无字日期分隔线，separator_before_footer 控制直达前
第二条无字线；status_style=soft_filled_pill 为浅绿实底状态胶囊。
link_fill_width 让直达入口均分余宽。
目录：icon_map 按定稿链接名指定路径；icons 可为显式路径数组（节点顺序），
group_icons 可按组名或组序号给字典/路径数组，group_illustrations 可逐组指定
插画方式。路径相对 typeset-assets；不按 ctx.icons 排序猜语义。
group_style 为 framed/plain，规则目录默认 framed，其它目录默认 plain。
无文字节点时仅提醒，不从 ctx.screen.card 或 scene 回填定稿。
"""

import html
import math
from pathlib import Path
import re
import hashlib
from urllib.parse import unquote, urlsplit
from urllib.request import url2pathname


_LINK = re.compile(r"〔[^〔〕]+〕")
_BELONGS = re.compile(r"〔属于：[^〔〕]+〕\s*$")
_MODES = {"right_inside", "left_inside", "top_inside", "above_card", "outside", "none"}


def _columns(spec, orient, default, group=0):
    value = spec.get("portrait_columns" if orient == "v" else "columns", default)
    if isinstance(value, (tuple, list)):
        value = value[group] if group < len(value) else default
    try:
        value = int(value)
    except (TypeError, ValueError):
        value = default
    return max(1, value)


def _mode(spec, default):
    value = spec.get("illustration", default)
    return value if value in _MODES else default


def _image(url, cls, ctx):
    # 引擎返回的 file:/// 地址原样保留；仅本地原始路径交给转换器。
    url = str(url)
    if not re.match(r"^(?:file|https?|data):", url, re.IGNORECASE):
        url = ctx.asset_url(url)
    return f'<div class="{cls}"><img src="{html.escape(str(url), quote=True)}" alt=""></div>'


def _text(ctx, value, cls="hub-body", tag="p"):
    return f'<{tag} class="{cls} tb">{ctx.inline(value)}</{tag}>'


def _node(node, ctx):
    """保留分入块的其余节点；不依赖共享 helper 或其它组件注册。"""
    kind = node["type"]
    if kind in ("h1", "h2", "h3"):
        return _text(ctx, node["text"], "hub-heading", "div")
    if kind == "para":
        return _text(ctx, node["text"])
    if kind == "group":
        return _text(ctx, node["name"], "hub-group-name", "div")
    if kind == "card":
        return (_text(ctx, node["name"], "hub-name", "div") +
                _text(ctx, node["text"]))
    if kind in ("bullets", "steps", "stats", "legend"):
        rows = []
        for item in node.get("items", []):
            parts = []
            if kind == "steps":
                parts.append(_text(ctx, str(item["n"]), "hub-item-number", "span"))
            if kind == "legend":
                parts.append(_text(ctx, item["dot"], "hub-item-number", "span"))
            lead = item.get("lead", item.get("num"))
            if lead is not None:
                parts.append(_text(ctx, lead, "hub-name", "span"))
            parts.append(_text(ctx, item.get("text", ""), "hub-body", "span"))
            rows.append('<div class="hub-item">' + ''.join(parts) + '</div>')
        return '<div class="hub-list">' + ''.join(rows) + '</div>'
    if kind == "table":
        rows = []
        if node.get("header") is not None:
            rows.append(node["header"])
        rows.extend(node.get("rows", []))
        return '<div class="hub-table">' + ''.join(
            '<div class="hub-table-row">' + ''.join(
                _text(ctx, cell, "hub-body", "span") for cell in row) + '</div>'
            for row in rows) + '</div>'
    if kind == "code":
        return _text(ctx, '\n'.join(node.get("lines", [])), "hub-code", "pre")
    if kind in ("linkrow", "now"):
        # links 不区分按钮与链接；有 src 时保留定稿中的原始括号类型。
        label = _text(ctx, node["label"], "hub-name", "span") if kind == "now" else ""
        tokens = re.findall(r"〔[^〔〕]+〕|【[^【】]+】", '\n'.join(node.get("src", [])))
        if not tokens:
            tokens = [f'〔{link}〕' for link in node.get("links", [])]
        return '<div class="hub-links">' + label + ''.join(
            _text(ctx, token, "hub-pill", "span") for token in tokens) + '</div>'
    raise ValueError(f"目录卡不能无声丢弃节点类型：{kind!r}")


def _number_cells(text):
    cells = text.split("｜")
    if not cells or any("·" not in cell for cell in cells):
        return None
    return [tuple(part.strip() for part in cell.split("·", 1)) for cell in cells]


def _project_number_text(value, ctx):
    """项目数字保留大字号，完整单位用本项目正文；非数量原样交给 inline。"""
    if not isinstance(value, str):
        return ctx.inline(value)

    def span(text, cls):
        return f'<span class="{cls}">{ctx.inline(text)}</span>'

    # 两个短量合成的刷新指标作为整体保留，避免拆成几行。
    if re.fullmatch(r"\d+\s*帧/\d+\s*秒一刷", value):
        pieces = [span(part, "hub-number-atom" if part.isdigit() else "hub-number-unit")
                  for part in re.split(r"(\d+)", value) if part]
        return '<span class="hub-number-combination">' + ''.join(pieces) + '</span>'
    number = r"(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?"
    expression = rf"{number}(?:\s*[–→×]\s*{number})*"
    # 仅覆盖真实数量单位。版本、日期、IP、路径及复合日期/时间不由这个规则猜拆。
    unit = r"(?:万\s*)?(?:个|次|秒|条|种|处|套|小时|行|轮|GiB|GB|KiB|KB|MiB|MB|TiB|TB|项|层|张|分钟|块屏|台|组|天|课|字|段|份|页|%|件|级|道|期|帧)"
    match = re.fullmatch(rf"({expression})(\s*{unit})?", value)
    if not match:
        return ctx.inline(value)
    parts, position = [], 0
    for atom in re.finditer(number, match[1]):
        if atom.start() > position:
            parts.append('<wbr>' + span(match[1][position:atom.start()], "hub-number-operator"))
        parts.append(span(atom.group(), "hub-number-atom"))
        position = atom.end()
    if match[2]:
        parts.append('<wbr>' + span(match[2], "hub-number-unit"))
    return ''.join(parts)


def _numbers(cells, ctx, spec):
    if not cells:
        return ""
    if len(cells) > 10:
        ctx.warn("项目数字超过 10 格，仍完整排出；请核对定稿与规格。")
    column_spec = spec
    if "columns" not in spec and "stat_columns" in spec:
        column_spec = dict(spec, columns=spec["stat_columns"])
    columns = _columns(column_spec, ctx.orient, 2 if ctx.orient == "v" else 5)
    # 均分为若干满行：5 格默认 5 一行，指定 columns=4 时 2+3；7 格为 3+4。
    row_count = math.ceil(len(cells) / columns)
    count, remainder = divmod(len(cells), row_count)
    row_sizes = [count + (1 if row >= row_count - remainder else 0) for row in range(row_count)]
    requested = spec.get("portrait_number_rows" if ctx.orient == "v" else "number_rows")
    if requested is not None:
        if (isinstance(requested, (list, tuple)) and requested and
                all(isinstance(size, int) and not isinstance(size, bool) and size > 0 for size in requested) and
                sum(requested) == len(cells)):
            row_sizes = list(requested)
        else:
            ctx.warn("项目 number_rows 与定稿实际数字格数不符；按完整定稿自动满行排布，未补空格或漏格。")
    if spec.get("stat_count") is not None and spec["stat_count"] != len(cells):
        ctx.warn("项目 stat_count 与定稿实际数字格数不符；保留全部实际数字格。")
    widths = spec.get("portrait_number_column_widths" if ctx.orient == "v" else "number_column_widths")
    if widths is not None and (not isinstance(widths, (list, tuple)) or len(widths) != len(row_sizes)):
        ctx.warn("项目 number_column_widths 行数与数字区不符；本区使用等宽格。")
        widths = None
    alignment = spec.get("stat_alignment", "left")
    if alignment not in ("left", "center", "right"):
        alignment = "left"
    stat_style = spec.get("stat_style", "rounded_thin_border")
    if stat_style not in ("rounded_thin_border", "soft_filled_borderless"):
        stat_style = "rounded_thin_border"
    parts, position = [f'<div class="hub-numbers hub-stat-{stat_style}" data-stat-align="{alignment}">'], 0
    for row, size in enumerate(row_sizes):
        template = f'repeat({size}, minmax(0, 1fr))'
        if widths is not None:
            proportions = widths[row]
            if (isinstance(proportions, (list, tuple)) and len(proportions) == size and
                    all(isinstance(value, (int, float)) and not isinstance(value, bool) and
                        math.isfinite(value) and value > 0 for value in proportions)):
                template = ' '.join(f'minmax(0, {value:g}fr)' for value in proportions)
            else:
                ctx.warn(f"项目 number_column_widths 第 {row + 1} 行无效；该行使用等宽格。")
        parts.append(f'<div class="hub-number-row" style="--hub-number-columns:{size};grid-template-columns:{template}">')
        for value, label in cells[position:position + size]:
            parts.append('<div class="hub-number-cell card">' +
                         '<div class="hub-number-value tb">' + _project_number_text(value, ctx) + '</div>' +
                         _text(ctx, label, "hub-number-label", "div") + '</div>')
        parts.append('</div>')
        position += size
    return ''.join(parts) + '</div>'


def _badge_icon(style, ctx):
    if style == "private":
        return ('<svg class="hub-badge-icon" viewBox="0 0 24 24" aria-hidden="true">'
                '<path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="2"/>'
                '<rect x="4" y="10" width="16" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>'
                '<circle cx="12" cy="15" r="1.5" fill="currentColor"/>'
                '<path d="M12 16v3" stroke="currentColor" stroke-width="2"/></svg>')
    # 原图 22 已点名并画出 GitHub 白猫头。SVG 视口只引用该无字区域，
    # 不引入臆造品牌形状；其后方 GitHub 字样不在视口里。
    source = Path(__file__).resolve().parent / "assets" / "projects-home-22.png"
    if not source.is_file():
        ctx.warn("公开项目徽章缺少已核对的本地 GitHub 猫头原图；保留定稿徽章文字。")
        return ""
    url = html.escape(ctx.asset_url(str(source)), quote=True)
    return ('<svg class="hub-badge-icon" viewBox="1316 93 60 58" aria-hidden="true">'
            f'<image href="{url}" width="1586" height="992"/></svg>')


def _project_header(node, ctx, spec):
    parts = ['<header class="hub-project-header"><div class="hub-project-title-line">',
             _text(ctx, node["name"], "hub-project-name", "div")]
    # 拆出定稿首行已有的状态和可见性；不靠 card 对象添徽章。
    labels = re.split(r"[\s　]+", node.get("text", "").strip(), maxsplit=1)
    if labels and labels[0]:
        style = {"常用": "daily", "偶尔用": "occasional", "冻结": "frozen"}.get(labels[0], "plain")
        variant = " hub-status-soft_filled_pill" if spec.get("status_style") == "soft_filled_pill" and style != "frozen" else ""
        parts.append(_text(ctx, labels[0], f"hub-status hub-status-{style}{variant}", "span"))
    parts.append('</div>')
    if len(labels) == 2 and labels[1]:
        style = "public" if "〔GitHub〕" in labels[1] else "private"
        parts.append(f'<span class="hub-visibility hub-visibility-{style}">' + _badge_icon(style, ctx) +
                     _text(ctx, labels[1], "hub-visibility-label", "span") + '</span>')
    return ''.join(parts) + '</header>'


def _project_body(nodes, ctx, spec):
    parts = []
    for node in nodes:
        if node["type"] == "stats":
            parts.append(_numbers([(it["num"], it["text"]) for it in node["items"]], ctx, spec))
            continue
        if node["type"] == "para":
            text = node["text"]
            cells = _number_cells(text)
            if cells is not None:
                parts.append(_numbers(cells, ctx, spec))
            elif text.startswith(("截至北京时间", "统计于北京时间")):
                parts.append(_text(ctx, text, "hub-stat-date"))
                if spec.get("separator_after_date"):
                    parts.append('<div class="hub-date-separator" aria-hidden="true"></div>')
            elif text.startswith(("停下原因：", "现在：")):
                parts.append(_text(ctx, text, "hub-frozen-note"))
            elif text.startswith("直达："):
                if spec.get("separator_before_footer"):
                    parts.append('<div class="hub-date-separator hub-footer-separator" aria-hidden="true"></div>')
                matches = list(_LINK.finditer(text))
                if not matches:
                    parts.append(_text(ctx, text, "hub-direct-label"))
                    continue
                fill = " hub-direct-fill" if spec.get("link_fill_width") else ""
                layout = ' data-link-layout="one_row"' if spec.get('link_layout') == 'one_row' else ''
                pieces, position = [f'<div class="hub-direct{fill}"{layout}>'], 0
                for match in matches:
                    if text[position:match.start()].strip():
                        pieces.append(_text(ctx, text[position:match.start()], "hub-direct-label", "span"))
                    pieces.append(_text(ctx, match.group(), "hub-pill", "span"))
                    position = match.end()
                if text[position:].strip():
                    pieces.append(_text(ctx, text[position:], "hub-direct-label", "span"))
                parts.append(''.join(pieces) + '</div>')
            else:
                parts.append(_node(node, ctx))
        else:
            parts.append(_node(node, ctx))
    return ''.join(parts)


def render_project_tile(block, ctx):
    """一张或多张独立项目卡；columns 只控制卡内数字区。"""
    nodes, spec = block.get("nodes", []), block.get("spec", {})
    mode = _mode(spec, "right_inside")
    parts = [f'<div class="c-project-tiles" data-comp="project_tile" data-orient="{ctx.orient}" '
             f'style="--hub-min-font:{ctx.min_font}px">']
    if not nodes:
        ctx.warn("project_tile 没有分配到 nodes；未从 screen.card 或 scene 回填文字。")
        return ''.join(parts) + '</div>'
    groups = []
    for node in nodes:
        if node["type"] == "card" or not groups:
            groups.append([])
        groups[-1].append(node)
    illustrations = ctx.illustrations() if mode != "none" else []
    try:
        first_image = max(0, int(spec.get("illustration_index", 0)))
    except (TypeError, ValueError):
        first_image = 0
    known_bad = False
    if ctx.screen.get("id") == "projects-home-22" and first_image == 0 and illustrations:
        candidate = urlsplit(str(illustrations[0]))
        bad_path = Path(url2pathname(candidate.path)) if candidate.scheme == 'file' else Path(str(illustrations[0]))
        known_bad = (bad_path.name == 'projects-home-22-illustration-01.png' and bad_path.is_file() and
                     hashlib.sha256(bad_path.read_bytes()).hexdigest() == 'b47a887f3e8ea86e7025b9d7ae9c6c93d7c4109f2ff1713be9fadeec6e78db35')
    if known_bad:
        # 根代理亲看确认默认候选含额外猫头徽章、空牌和数字子格边；
        # 不能以卡内的真实徽章来抵销插画污染。保留无字构图槽等待合格素材。
        illustrations = []
        ctx.warn("projects-home-22 默认插画已确证含额外猫头徽章、空牌及子格边，已过滤；本屏仍缺合格插画，保留无字构图位。")
    for index, group in enumerate(groups):
        url = illustrations[first_image + index] if first_image + index < len(illustrations) else None
        if not url and mode != "none":
            ctx.warn(f"project_tile 插画 {first_image + index + 1} 缺失；保留 {mode} 的无字构图空位。")
        if url and mode in ("outside", "above_card"):
            parts.append(_image(url, "hub-project-art hub-art-outside", ctx))
        parts.append(f'<article class="hub-project-card card hub-art-{mode}{" hub-no-art" if not url else ""}">')
        body = group
        if group[0]["type"] == "card":
            parts.append(_project_header(group[0], ctx, spec))
            body = group[1:]
        # 第一段和右半幅插画共享上半区，后续数字区铺满卡宽。
        intro = []
        while body and body[0]["type"] == "para" and _number_cells(body[0]["text"]) is None and not body[0]["text"].startswith(("截至北京时间", "统计于北京时间", "停下原因：", "现在：", "直达：")):
            intro.append(body[0])
            body = body[1:]
        parts.append('<div class="hub-project-top"><div class="hub-project-intro">' +
                     ''.join(_node(node, ctx) for node in intro) + '</div>')
        if url and mode not in ("outside", "above_card"):
            parts.append(_image(url, "hub-project-art", ctx))
        elif not url and mode not in ("none", "outside", "above_card"):
            parts.append('<div class="hub-project-art hub-art-placeholder" aria-hidden="true"></div>')
        parts.append('</div>')
        parts.append(_project_body(body, ctx, spec))
        parts.append('</article>')
    return ''.join(parts) + '</div>'


def _directory_title(item):
    title = item.get("lead")
    if title is None:
        match = _LINK.match(item.get("text", ""))
        title = match.group() if match else None
    return title


def _title_key(title):
    return re.sub(r"\*\*|`|[〔〕【】]", "", title or "").strip()


def _group_value(value, index, name):
    if isinstance(value, dict):
        return value.get(name, value.get(str(index)))
    if isinstance(value, (list, tuple)) and 0 <= index < len(value):
        return value[index]
    return None


def _directory_icon(item, ctx, spec, group_index, group_name, item_index, absolute_index):
    """显式分配的路径是语义依据；素材排序仅是存储顺序。"""
    name = _title_key(_directory_title(item))
    assigned = None
    group_icons = _group_value(spec.get("group_icons"), group_index, group_name)
    if isinstance(group_icons, dict):
        assigned = group_icons.get(name)
    elif isinstance(group_icons, (list, tuple)) and item_index < len(group_icons):
        assigned = group_icons[item_index]
    mapping = spec.get("icon_map")
    if assigned is None and isinstance(mapping, dict):
        grouped = mapping.get(group_name)
        assigned = grouped.get(name) if isinstance(grouped, dict) else mapping.get(name)
    explicit = spec.get("icons")
    if assigned is None and isinstance(explicit, dict):
        assigned = explicit.get(name)
    if assigned is None and isinstance(explicit, (list, tuple)) and absolute_index < len(explicit):
        assigned = explicit[absolute_index]
    if not isinstance(assigned, str) or not assigned.strip() or assigned == "none":
        ctx.warn(f"directory_tile “{name or '未命名条目'}”缺少已核对的图标映射；保留无字图标位。")
        return None
    assigned = assigned.strip()
    basename = unquote(assigned.replace("\\", "/").split("/")[-1]).split("?")[0].lower()
    decoration = spec.get("decorative_icons", [])
    decoration_names = {str(path).replace("\\", "/").split("/")[-1].lower()
                        for path in decoration if isinstance(path, str)} if isinstance(decoration, (list, tuple)) else set()
    if (ctx.screen.get("id") == "rules-home-02" and basename == "rules-home-02-icon-01.png") or basename in decoration_names:
        ctx.warn(f"directory_tile “{name}”映射到装饰叶枝；已排除并保留无字图标位。")
        return None
    parsed = urlsplit(assigned)
    if parsed.scheme.lower() == "file":
        path = Path(url2pathname(parsed.path))
        if not path.is_file():
            ctx.warn(f"directory_tile “{name}”图标文件缺失：{assigned}；保留无字图标位。")
            return None
        return assigned
    if re.match(r"^(?:https?|data):", assigned, re.IGNORECASE):
        return assigned
    path = Path(assigned)
    if not path.is_absolute():
        from engine import assets
        asset_root = Path(assets.ASSET_ROOT)
        path = asset_root / path
    if not path.is_file():
        ctx.warn(f"directory_tile “{name}”图标文件缺失：{path}；保留无字图标位。")
        return None
    return ctx.asset_url(str(path))


DIRECTORY_TILE_SPEC_FIELDS = (
    "columns", "columns_v", "portrait_columns", "illustration", "group_illustrations", "icon_map", "icons",
    "group_icons", "group_style", "decorative_icons", "icon_policy", "group_heading", "group_heading_style",
    "group_heading_font", "group_heading_font_family", "heading_size", "group_heading_asset", "group_heading_assets",
    "group_heading_source_image", "group_heading_source_box", "group_heading_icon", "group_heading_variant",
    "size", "group_heading_layout", "separator", "group_heading_brush", "copy_labels", "connector", "variant",
)
SPEC_FIELDS = {"directory_tile": DIRECTORY_TILE_SPEC_FIELDS}


def _directory_issue(ctx, message, kind="composition"):
    if hasattr(ctx, "incomplete"):
        ctx.incomplete(message, kind)
    else:
        ctx.warn(message)


def _directory_copy_labels(spec, ctx):
    labels = spec.get("copy_labels")
    if labels is None:
        return None
    if not isinstance(labels, (list, tuple)) or list(labels) != ["拿", "给"]:
        _directory_issue(ctx, f"directory_tile 未实现 copy_labels={labels!r}；原文保留，不添加标签。")
        return None
    return tuple(labels)


def _directory_copy_body(text, ctx, labels):
    """标签只切原文中的拿：/给：；链接、按钮、引号内文案不从规格复写。"""
    if not labels:
        return _text(ctx, text)
    pattern = re.compile(r"(?<![^\s。；;！？])(" + "|".join(re.escape(label) for label in labels) + r")([：:])")
    matches = list(pattern.finditer(text))
    if not matches:
        return _text(ctx, text)
    out = []
    if matches[0].start():
        out.append(_text(ctx, text[:matches[0].start()]))
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        direction = "in" if match.group(1) == labels[0] else "out"
        # 无字箭头来自 scene 的入/出方向；所有可见字仍取原文片段，经 inline。
        path = "M3 12H21 M15 6L21 12L15 18" if direction == "in" else "M21 12H3 M9 6L3 12L9 18"
        out.append(f'<div class="hub-directory-flow-line" data-direction="{direction}">'
                   '<svg class="hub-directory-flow-arrow" viewBox="0 0 24 24" aria-hidden="true">'
                   f'<path d="{path}" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
                   '<div class="hub-body tb" data-role="body">'
                   f'<strong class="hub-directory-flow-label">{ctx.inline(match.group(1))}</strong>'
                   + ctx.inline(text[match.start(2):end]) + '</div></div>')
    return ''.join(out)


def _directory_entry(item, ctx, icon, mode, copy_labels=None, attrs=""):
    text, lead = item.get("text", ""), item.get("lead")
    title = lead
    if title is None:
        match = _LINK.match(text)
        if match:
            title, text = match.group(), text[match.end():]
    belongs = _BELONGS.search(text)
    label = belongs.group().strip() if belongs else None
    body = text[:belongs.start()].rstrip() if belongs else text
    outside = mode in ("outside", "above_card")
    parts = [f'<div class="hub-directory-entry"{attrs}>'] if outside else []
    if outside:
        parts.append(_image(icon, "hub-directory-icon hub-icon-outside", ctx) if icon else
                     '<div class="hub-directory-icon hub-icon-outside hub-icon-placeholder" aria-hidden="true"></div>')
    parts.append(f'<article class="hub-directory-card card hub-art-{mode}{" hub-no-art" if mode == "none" or outside else ""}"{attrs if not outside else ""}>')
    if icon and mode != "none" and not outside:
        parts.append(_image(icon, "hub-directory-icon", ctx))
    elif not icon and mode != "none" and not outside:
        parts.append('<div class="hub-directory-icon hub-icon-placeholder" aria-hidden="true"></div>')
    parts.append('<div class="hub-directory-copy">')
    if title is not None:
        parts.append(_text(ctx, title, "hub-directory-name", "div"))
    if body:
        parts.append(_directory_copy_body(body, ctx, copy_labels) if copy_labels else _text(ctx, body))
    if label:
        parts.append(_text(ctx, label, "hub-belongs", "div"))
    return ''.join(parts) + '</div></article>' + ('</div>' if outside else '')


def _directory_flow_icons(items, spec, ctx, mode):
    if mode == "none" or spec.get("icons") == "none":
        return [None] * len(items)
    if isinstance(spec.get("icons"), (list, tuple, dict)) or isinstance(spec.get("icon_map"), dict) or spec.get("group_icons"):
        return [_directory_icon(item, ctx, spec, 0, "", index, index) for index, item in enumerate(items)]
    cursor = getattr(ctx, "_icon_i", 0)
    try:
        slots = dict(ctx.slots("icon"))
    except (AttributeError, OSError, TypeError, ValueError):
        _directory_issue(ctx, "directory_tile 无法按原图槽号取图；保留原卡片的空图槽。", "asset")
        return [None] * len(items)
    # 只读取引擎已经接纳的活动素材清单；合法共用兜底按 API 记到屏和槽，
    # 不把候选映射或素材存储顺序当成新的语义依据。
    try:
        from engine import assets
        metadata = {ordinal: record for ordinal, record in assets.slots(ctx.screen["id"], "icon", ctx.orient)}
    except (AttributeError, KeyError, OSError, TypeError, ValueError):
        metadata = {}
    out = []
    for index, item in enumerate(items):
        ordinal = cursor + index + 1
        icon = slots.get(ordinal)
        if icon:
            # 共用普通目录现行路径与 decorative_icons 排除规则；不是另一套过滤器。
            icon = _directory_icon(item, ctx, dict(spec, icons=[icon]), 0, "", 0, 0)
            record = metadata.get(ordinal) or {}
            if icon and record.get("fallback"):
                ctx.warn(f"directory_tile {ctx.screen['id']} 图标槽 {ordinal} 使用共用素材库兜底 {record.get('key', '')}；"
                         f"semantic_status={record.get('semantic_status', '')}，按现行 API 保留并登记原槽。")
        if not icon:
            _directory_issue(ctx, f"directory_tile “{_title_key(item['lead'])}”的图标槽 {ordinal} 缺少素材；保留空槽，不挪后图。", "asset")
        out.append(icon)
    ctx._icon_i = cursor + len(items)
    return out


def _directory_flow(nodes, spec, ctx, mode, labels):
    """workflow 的真实 card 节点排成目录卡；原说明的拿/给标签各显示一次。"""
    if spec.get("icons") == "none":
        mode = "none"
    size = spec.get("size", "medium")
    if size not in ("medium", "large"):
        _directory_issue(ctx, f"directory_tile 未实现 size={size!r}；按默认留白保留原文。")
        size = "medium"
    items = [{"lead": node["name"], "text": node.get("text", "")} for node in nodes if node["type"] == "card"]
    icons = _directory_flow_icons(items, spec, ctx, mode)
    if mode != "none" and spec.get("icon_policy", "uniform") == "uniform" and any(icon is None for icon in icons):
        ctx.warn("目录图标尚未全部映射，本块统一按无图标排；完整映射到齐后统一启用。")
        mode = "none"
        icons = [None] * len(items)
    parts = [f'<div class="c-directory-tiles hub-directory-flow" data-comp="directory_tile" data-orient="{ctx.orient}" '
             f'data-size="{size}" style="--hub-min-font:{ctx.min_font}px">']
    index, position = 0, 0
    while position < len(nodes):
        if nodes[position]["type"] != "card":
            parts.append(_node(nodes[position], ctx))
            position += 1
            continue
        end = position
        while end < len(nodes) and nodes[end]["type"] == "card":
            end += 1
        count = end - position
        columns = _columns(spec, ctx.orient, 1 if ctx.orient == "v" else 3)
        parts.append(f'<div class="hub-directory-grid" style="--hub-columns:{columns * 2}">')
        for item_index in range(count):
            row, col = divmod(item_index, columns)
            row_size = min(columns, count - row * columns)
            start = col * 2 + 1 + columns - row_size
            attrs = f' style="grid-row:{row + 1};grid-column:{start} / span 2"'
            parts.append(_directory_entry(items[index], ctx, icons[index], mode, labels, attrs))
            index += 1
        parts.append('</div>')
        position = end
    return ''.join(parts) + '</div>'


def _directory_grouped_list(nodes, spec, ctx):
    """原 card 名称作组头，正文只按原全角分隔符拆成清单项。"""
    if not nodes or any(node.get("type") != "card" for node in nodes):
        _directory_issue(ctx, "directory_tile.grouped_list 需要原 card 分组节点；保留全部原节点。")
        return ''.join(_node(node, ctx) for node in nodes)
    groups = []
    for index, node in enumerate(nodes):
        items = [item for item in re.split(r"　+", node.get("text", "")) if item]
        if not items:
            _directory_issue(ctx, f"directory_tile.grouped_list 第 {index + 1} 组没有原条目；保留原文。")
        entries = ''.join(
            f'<div class="hub-grouped-item tb" data-map-sign="{index}-{item_index}" '
            f'data-group-item="{item_index}">{ctx.inline(item)}</div>'
            for item_index, item in enumerate(items))
        groups.append(
            f'<section class="hub-directory-group hub-grouped-group card" data-map-region="{index}" '
            f'data-group-count="{len(items)}">' +
            _text(ctx, node["name"], "hub-group-name", "div") +
            f'<div class="hub-grouped-items">{entries}</div></section>')
    columns = _columns(spec, ctx.orient, 1 if ctx.orient == "v" else 3)
    return (f'<div class="c-directory-tiles hub-grouped-list" data-comp="directory_tile" '
            f'data-variant="grouped_list" data-orient="{ctx.orient}" '
            f'style="--hub-columns:{columns};--hub-min-font:{ctx.min_font}px">' +
            ''.join(groups) + '</div>')


def render_directory_tile(block, ctx):
    """组名与说明在网格上方，规则默认三列、技能四列、竖版一列。"""
    nodes, spec = block.get("nodes", []), block.get("spec", {})
    if spec.get("variant") == "grouped_list":
        return _directory_grouped_list(nodes, spec, ctx)
    if spec.get("variant") not in (None, "", "auto"):
        _directory_issue(ctx, f"directory_tile 未实现 variant={spec['variant']!r}；保留原节点。")
    if ctx.orient == "v" and "portrait_columns" not in spec and "columns_v" in spec:
        spec = dict(spec, portrait_columns=spec["columns_v"])
    mode = _mode(spec, "left_inside")
    labels = _directory_copy_labels(spec, ctx)
    if spec.get("connector") not in (None, "", "none", "auto"):
        _directory_issue(ctx, f"directory_tile 未实现 connector={spec['connector']!r}；原文保留。")
    if labels and any(node["type"] == "card" for node in nodes):
        return _directory_flow(nodes, spec, ctx, mode, labels)
    size = spec.get('size', 'medium')
    if size not in ('medium','large'):
        ctx.incomplete(f'directory_tile 未实现 size={size}', 'composition')
        size = 'medium'
    head_layout = spec.get('group_heading_layout', 'stacked_description' if ctx.orient == 'v' else 'inline_description')
    if head_layout not in ('inline_description','stacked_description'):
        ctx.incomplete(f'directory_tile 未实现 group_heading_layout={head_layout}', 'composition')
    separator = spec.get('separator')
    brush_path = Path(__file__).resolve().parent / 'assets' / 'strip-brush.png'
    separator_html = (f'<img class="hub-directory-separator" src="{html.escape(ctx.asset_url(str(brush_path)), quote=True)}" alt="" aria-hidden="true">'
                      if separator == 'brush_after_group' and brush_path.exists() else '')
    if separator not in (None,'none','brush_after_group'):
        ctx.incomplete(f'directory_tile 未实现 separator={separator}', 'composition')
    parts = [f'<div class="c-directory-tiles" data-comp="directory_tile" data-orient="{ctx.orient}" '
             f'data-size="{size}" data-heading-layout="{html.escape(str(head_layout), quote=True)}" style="--hub-min-font:{ctx.min_font}px">']
    if not nodes:
        ctx.warn("directory_tile 没有分配到 nodes；未读取 scene 添字。")
        return ''.join(parts) + '</div>'
    default = 1 if ctx.orient == "v" else (4 if ctx.screen.get("id", "").startswith("skills-home-") else 3)
    framed = spec.get("group_style", "framed" if ctx.screen.get("id", "").startswith("rules-home-") else "plain") == "framed"
    resolved_icons, planned_icons = {}, []
    planned_group, planned_name, planned_index = -1, '', 0
    for node in nodes:
        if node['type'] in ('card','group'):
            planned_group += 1
            planned_name = _title_key(node['name'])
        elif node['type'] == 'bullets':
            planned_mode = _group_value(spec.get('group_illustrations'), max(0, planned_group), planned_name)
            planned_mode = planned_mode if planned_mode in _MODES else mode
            if spec.get('icons') == 'none':
                planned_mode = 'none'
            for item_index, item in enumerate(node['items']):
                if planned_mode != 'none':
                    url = _directory_icon(item, ctx, spec, max(0, planned_group), planned_name, item_index, planned_index)
                    resolved_icons[planned_index] = url
                    planned_icons.append(url)
                planned_index += 1
    uniform_without_icons = spec.get('icon_policy', 'uniform') == 'uniform' and any(url is None for url in planned_icons)
    if uniform_without_icons:
        ctx.warn('目录图标尚未全部映射，本块统一按无图标排；完整映射到齐后统一启用。')
    icon_index, group_index, group_name, group_open = 0, -1, "", False
    for node in nodes:
        kind = node["type"]
        if kind in ("card", "group"):
            if group_open:
                parts.append('</section>')
                parts.append(separator_html)
            group_index += 1
            group_name = _title_key(node["name"])
            cls = "hub-directory-group card hub-group-framed" if framed else "hub-directory-group hub-group-plain"
            parts.append(f'<section class="{cls}">')
            group_open = True
            wants_brush = bool(spec.get('group_heading_brush')) or any(str(spec.get(key, '')).lower() == 'brush' for key in
                              ('group_heading', 'group_heading_style', 'group_heading_font', 'group_heading_font_family'))
            if wants_brush:
                heading_fields = {
                    'align', 'font', 'heading_style', 'heading_font', 'heading_size',
                    'heading_asset', 'heading_source_image', 'heading_source_box', 'heading_icon',
                    'group_heading', 'group_heading_style', 'group_heading_font', 'group_heading_font_family',
                    'group_heading_asset', 'group_heading_assets', 'group_heading_source_image',
                    'group_heading_source_box', 'group_heading_icon', 'group_heading_variant',
                }
                # 卡片图位与图标不属于组头；只传明确的组头字段。
                heading_spec = {key: value for key, value in spec.items() if key in heading_fields}
                heading_spec['group_heading'] = 'brush'
                heading = ctx.render({'type':'section_heading', 'spec':heading_spec,
                                      'nodes':[{'type':'group','name':node['name'],'src':[]}]})
            else:
                heading = _text(ctx, node["name"], "hub-group-name", "span")
            parts.append('<div class="hub-directory-group-head">' + heading)
            if kind == "card":
                parts.append(_text(ctx, node["text"], "hub-group-description", "span"))
            parts.append('</div>')
        elif kind == "bullets":
            columns = _columns(spec, ctx.orient, default, max(0, group_index))
            group_mode = _group_value(spec.get("group_illustrations"), max(0, group_index), group_name)
            group_mode = group_mode if group_mode in _MODES else mode
            if spec.get("icons") == "none":
                group_mode = "none"
            if uniform_without_icons:
                group_mode = 'none'
            parts.append(f'<div class="hub-directory-grid" style="--hub-columns:{columns}">')
            for item_index, item in enumerate(node["items"]):
                icon = resolved_icons.get(icon_index) if group_mode != "none" else None
                parts.append(_directory_entry(item, ctx, icon, group_mode, labels))
                icon_index += 1
            parts.append('</div>')
        else:
            if kind in ("h1", "h2", "h3") and group_open:
                parts.append('</section>')
                group_open = False
            parts.append(_node(node, ctx))
    if group_open:
        parts.append('</section>')
        parts.append(separator_html)
    return ''.join(parts) + '</div>'


COMPONENTS = {"project_tile": render_project_tile, "directory_tile": render_directory_tile}

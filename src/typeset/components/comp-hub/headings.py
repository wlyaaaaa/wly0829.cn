"""组标题、分组横条和可伸长的空列表框；遵循 COMPONENTS-API v2。"""
from pathlib import Path
from html import escape
import hashlib
import math
import re
from urllib.parse import urlsplit


HERE = Path(__file__).resolve().parent

SPEC_FIELDS = {"section_heading": ["columns", "columns_v", "brush", "illustration",
                                    "icons", "brand", "background", "connector", "heading_size"],
               "title_strip": ["size", "min_height"]}


def _section_incomplete(ctx, field, value, reason, kind="composition"):
    ctx.incomplete(f"section_heading.{field}={value!r} 未执行：{reason}", kind)


def _published_section_icon(ctx, *, key=None, phrase=None):
    """只按发布映射里的明确品牌键/原 scene 物件取图，不领素材顺序。"""
    from engine import assets
    mapping = assets.manifest()
    rows = ([row for group in mapping.values() for row in group] if key else
            mapping.get(ctx.screen.get("id"), []))
    candidates = []
    for row in rows:
        if (not row.get("_lib") or row.get("role") != "icon" or
                row.get("status") != "ready" or row.get("fallback") or
                row.get("semantic_status") not in ("scene_explicit_primary_object",
                                                     "automatically_accepted_per_b2bc0efe")):
            continue
        if key is not None and row.get("key") != key:
            continue
        if phrase is not None and row.get("source_phrase") != phrase:
            continue
        if row.get("orientations") and ctx.orient not in row["orientations"]:
            continue
        candidates.append(row)
    paths = {str(Path(row["path"]).resolve()) for row in candidates if row.get("path")}
    if len(paths) != 1:
        return None
    path = Path(next(iter(paths)))
    hashes = {row.get("sha256") for row in candidates if row.get("sha256")}
    if not path.is_file() or len(hashes) != 1:
        return None
    if hashlib.sha256(path.read_bytes()).hexdigest() != next(iter(hashes)):
        return None
    return ctx.asset_url(str(path))


def _section_scene_phrase(scene, name):
    quoted = re.escape(name)
    # 当前审计的两种原 scene 写法：组名“配…”和组名后括注“小图标：…”。
    match = re.search(rf"“{quoted}”配([^，；）]+)", scene)
    if not match:
        match = re.search(rf"“{quoted}”（[^）]*小图标：([^）]+)）", scene)
    return match[1].strip() if match else None


def _text(s, ctx, role="body"):
    return f'<div class="hub-{role} tb">{ctx.inline(str(s))}</div>'


def _node(node, ctx):
    """保留分给此块的全部定稿；未知节点明确提醒，不静默丢字。"""
    t = node.get("type")
    if t in ("h1", "h2", "h3", "group"):
        return _text(node.get("text", node.get("name", "")), ctx, "heading")
    if t == "card":
        return _text(node.get("name", ""), ctx, "heading") + _text(node.get("text", ""), ctx)
    if t in ("para",):
        return _text(node.get("text", ""), ctx)
    if t in ("bullets", "stats", "steps"):
        rows = []
        for item in node.get("items", []):
            if t == "steps":
                cols = item.get("cols")
                s = f'{item["n"]} ' if item.get("n") is not None else ""
                s += "　".join(str(x) for x in cols) if cols else (
                    (f'**{item["lead"]}**　' if item.get("lead") else "") + item.get("text", ""))
            else:
                lead = item.get("num") if t == "stats" else item.get("lead")
                s = (f'**{lead}**　' if lead else "") + item.get("text", "")
            rows.append(_text(s, ctx))
        return '<div class="hub-list">' + "".join(rows) + '</div>'
    if t in ("linkrow", "now"):
        s = node.get("label", "") + "　".join(f'〔{x}〕' for x in node.get("links", []))
        return _text(s, ctx)
    if t == "legend":
        return _text("　".join(f'{x.get("dot", "")} {x.get("text", "")}' for x in node.get("items", [])), ctx)
    if t == "table":
        rows = ([node["header"]] if node.get("header") else []) + node.get("rows", [])
        return '<div class="hub-list">' + "".join(_text("　".join(row), ctx) for row in rows) + '</div>'
    if t == "code":
        return _text("\n".join(node.get("lines", [])), ctx)
    ctx.warn(f'comp-hub 未知节点 {t}，按 src 原顺序保留')
    return "".join(_text(line, ctx) for line in node.get("src", []))


def _nodes(nodes, ctx):
    return "".join(_node(n, ctx) for n in nodes)


def _leaf(ctx, side):
    path = HERE.parent.parent / "assets" / f"leaf-{side}.png"
    if not path.exists():
        return ""
    url = escape(ctx.asset_url(str(path)), quote=True)
    return f'<span class="hub-leaf hub-leaf-{side}" style="background-image:url(\'{url}\')" aria-hidden="true"></span>'


def render_section_heading(block, ctx):
    spec = block.get("spec", {})
    nodes = block.get("nodes", [])
    align = "center" if spec.get("align") == "center" else "left"
    size = spec.get("size", "medium")
    if size not in ("small", "medium", "large"):
        _section_incomplete(ctx, "size", size, "只支持 small/medium/large")
        size = "medium"
    if spec.get("align", "left") not in ("left", "center"):
        _section_incomplete(ctx, "align", spec["align"], "只支持 left/center")
    columns = spec.get("columns_v", spec.get("columns", 1)) if ctx.orient == "v" else spec.get("columns", 1)
    for key in ("columns", "columns_v"):
        if key in spec and (not isinstance(spec[key], int) or isinstance(spec[key], bool) or spec[key] < 1):
            _section_incomplete(ctx, key, spec[key], "每排列数必须是正整数")
    if not isinstance(columns, int) or isinstance(columns, bool) or columns < 1:
        columns = 1
    grid = "columns" in spec or "columns_v" in spec
    short_brush = spec.get("brush") == "short"
    if "brush" in spec and spec["brush"] not in (None, "none", "short"):
        _section_incomplete(ctx, "brush", spec["brush"], "当前只实现 short 短笔刷")
    if "connector" in spec and spec["connector"] != "none":
        _section_incomplete(ctx, "connector", spec["connector"], "标题块没有连接线结构")
    pale = spec.get("background") == "pale_green"
    if "background" in spec and spec["background"] not in (None, "none", "pale_green"):
        _section_incomplete(ctx, "background", spec["background"], "当前只实现 pale_green 浅绿背景")
    if "icons" in spec and spec["icons"] not in ("auto", "none"):
        _section_incomplete(ctx, "icons", spec["icons"], "当前审计只支持 auto 的语义映射或 none")
    # container 指跨兄弟组件的共同外框；此函数只能输出自己的 nodes。
    container = spec.get("container")
    if container is not None and block.get("applied_container", getattr(ctx, "applied_container", None)) != container:
        _section_incomplete(ctx, "container", container,
                            "需要父布局包住同名的标题、流程/正文及插画；当前父布局未确认共享外框已应用")
    placement = spec.get("placement")
    if placement is not None and block.get("applied_placement", getattr(ctx, "applied_placement", None)) != placement:
        row = spec.get("row")
        _section_incomplete(ctx, "placement", placement,
                            f"仅可安排本块内部；现有 row={row!r} 不保证与章标题旁置，需父布局确认")
    brush = any(str(spec.get(key, '')).lower() == 'brush' for key in
                ('heading_style', 'heading_font', 'group_heading', 'group_heading_style', 'group_heading_font', 'group_heading_font_family', 'font'))
    heading_size = spec.get('heading_size', 'small')
    scale_heading = 'heading_size' in spec and heading_size in ('small', 'medium', 'large')
    if heading_size not in ('small', 'medium', 'large'):
        _section_incomplete(ctx, 'heading_size', heading_size, '只支持 small/medium/large')
        heading_size = 'small'
    elif 'heading_size' in spec and not brush:
        _section_incomplete(ctx, 'heading_size', heading_size,
                            'heading_size 控制毛笔标题；普通粗体组名使用 size')
    parts = []
    for index, node in enumerate(nodes):
        marked = re.match(r'^\*\*(.+?)\*\*(.*)$', node.get("text", "")) if node.get("type") == "para" else None
        name = marked[1] if marked else node.get('name', node.get('text', ''))
        if brush and node.get('type') in ('h1', 'h2', 'h3', 'group', 'card', 'para'):
            sp = {'align': align, 'size': heading_size}
            explicit = spec.get('heading_asset', spec.get('group_heading_asset'))
            mapping = spec.get('group_heading_assets')
            if isinstance(mapping, dict):
                explicit = mapping.get(name, explicit)
            if explicit:
                sp['asset'] = explicit
                for key in ('source_image', 'source_box'):
                    value = spec.get('heading_' + key, spec.get('group_heading_' + key))
                    if value is not None:
                        sp[key] = value
            image = ctx.render({'type': 'chapter_title', 'spec': sp,
                                'nodes': [{'type': 'h3', 'text': name, 'src': []}]})
            tail = marked[2] if marked else node.get('text', '') if node.get('type') == 'card' else ''
            # 没明确给档位的合格图片保持原尺寸；指定档位时只限制最大高度、不放大。
            if scale_heading:
                image = f'<div class="hub-section-brush-title hub-heading-size-{heading_size}">' + image + '</div>'
            parts.append('<div class="hub-section-line">' + image + (_text(tail, ctx) if tail else '') + '</div>')
            continue
        if marked:
            parts.append('<div class="hub-section-line">' + _text(marked[1], ctx, "heading") +
                         (_text(marked[2], ctx) if marked[2] else '') + '</div>')
        elif short_brush and index == 0 and node.get("type") == "para":
            # 约法的短页眉在定稿中是普通段落；格式变成小标题，字仍来自原段落。
            parts.append(_text(node.get("text", ""), ctx, "heading"))
        else:
            parts.append(_node(node, ctx))
    if short_brush:
        brush_path = HERE / "assets" / "strip-brush.png"
        if brush_path.is_file():
            brush_html = f'<img class="hub-section-short-brush" src="{escape(ctx.asset_url(str(brush_path)), quote=True)}" alt="" aria-hidden="true">'
        else:
            brush_html = '<span class="hub-section-short-brush hub-section-art-placeholder" aria-hidden="true"></span>'
            _section_incomplete(ctx, "brush", "short", "短笔刷素材缺失", "asset")
        if parts:
            parts[0] = '<div class="hub-section-short-header">' + brush_html + parts[0] + '</div>'
        else:
            _section_incomplete(ctx, "brush", "short", "没有原页眉节点可排列短笔刷")
    icon = spec.get('heading_icon', spec.get('group_heading_icon'))
    icon_html = ""
    if icon and isinstance(icon, str):
        is_url = urlsplit(icon).scheme.lower() in ('file', 'data', 'https', 'http')
        path = ctx.resolve(icon) if hasattr(ctx, 'resolve') and not is_url else icon
        if is_url or Path(path).is_file():
            icon_html = f'<img class="hub-section-icon" src="{escape(str(path) if is_url else ctx.asset_url(str(path)), quote=True)}" alt="">'
        else:
            _section_incomplete(ctx, "heading_icon", icon, "图标文件缺失", "asset")
    illustration = spec.get("illustration", "none")
    if illustration not in ("none", "top_inside", "left_inside"):
        _section_incomplete(ctx, "illustration", illustration, "当前只实现 top_inside/left_inside/none")
        illustration = "none"
    brand = spec.get("brand")
    if brand is not None:
        source_text = " ".join(str(node.get("name", node.get("text", ""))) for node in nodes)
        named = brand in ("Claude", "OpenAI") and (brand in str(ctx.screen.get("scene", "")) or brand in source_text)
        if named:
            url = _published_section_icon(ctx, key=brand + "标志")
            icon_html = (f'<img class="hub-section-icon hub-section-brand" src="{escape(url, quote=True)}" alt="" aria-hidden="true">'
                         if url else '<span class="hub-section-icon hub-section-brand hub-section-art-placeholder" aria-hidden="true"></span>')
            if not url:
                _section_incomplete(ctx, "brand", brand, "缺少语义明确且指纹一致的已发布品牌素材", "asset")
        else:
            icon_html = '<span class="hub-section-icon hub-section-brand hub-section-art-placeholder" aria-hidden="true"></span>'
            _section_incomplete(ctx, "brand", brand, "只支持原 scene/节点已经点名的 Claude/OpenAI")
    if illustration != "none" and not icon_html:
        name = str(nodes[0].get("name", nodes[0].get("text", ""))) if nodes else ""
        phrase = _section_scene_phrase(str(ctx.screen.get("scene", "")), name)
        url = _published_section_icon(ctx, phrase=phrase) if phrase and spec.get("icons", "auto") == "auto" else None
        icon_html = (f'<img class="hub-section-icon" src="{escape(url, quote=True)}" alt="" aria-hidden="true">'
                     if url else '<span class="hub-section-icon hub-section-art-placeholder" aria-hidden="true"></span>')
        if not url:
            _section_incomplete(ctx, "illustration", illustration,
                                f"原组名 {name!r} 没有对应原 scene 物件的已发布映射；保留正确无字图位", "asset")
    if grid:
        copy_html = (f'<div class="hub-section-copy hub-section-grid" style="--hub-section-columns:{columns}">'
                     + ''.join('<div class="hub-section-item">' + part + '</div>' for part in parts) + '</div>')
    else:
        copy_html = ''.join(parts)
    variant = spec.get('variant', spec.get('group_heading_variant', ''))
    underline = variant in ('icon_underline', 'brush_line') or spec.get('underline') is True
    media_class = ' hub-section-media-top' if icon_html and illustration == "top_inside" else ''
    return (f'<div class="c-section-heading hub-align-{align} hub-size-{size}{" hub-section-underlined" if underline else ""}'
            f'{" hub-section-pale" if pale else ""}{" hub-section-short" if short_brush else ""}{media_class}" '
            f'data-comp="section_heading" data-orient="{ctx.orient}">'
            + icon_html + copy_html + '</div>')


def render_title_strip(block, ctx):
    spec = block.get("spec", {})
    size = spec.get("size", "medium")
    if size not in ("small", "medium", "large"):
        ctx.incomplete(f"title_strip.size={size!r} 未执行：只支持 small/medium/large", "composition")
        size = "medium"
    height_style = ""
    if "min_height" in spec:
        height = spec["min_height"]
        if (isinstance(height, (int, float)) and not isinstance(height, bool) and
                math.isfinite(height) and height > 0):
            height_style = f' style="--hub-strip-min-height:{height:g}px"'
        else:
            ctx.incomplete(f"title_strip.min_height={height!r} 未执行：须为正有限像素数", "composition")
    nodes = list(block.get("nodes", []))
    heading = nodes.pop(0) if nodes and nodes[0].get("type") in ("h1", "h2", "h3", "group") else None
    title = _node(heading, ctx) if heading else ""
    body = _nodes(nodes, ctx)
    leaves_on = spec.get("leaves", True)
    leaf_position = spec.get("leaf_position", "left_of_heading")
    leaf_left = _leaf(ctx, "l") if leaves_on and leaf_position != "none" else ""
    leaf_right = _leaf(ctx, "r") if leaves_on and spec.get("right_leaves", ctx.orient == "h") else ""
    layout = spec.get("layout", "stacked" if ctx.orient == "v" else "inline")
    layout = "stacked" if layout == "stacked" else "inline"
    align = "center" if spec.get("align", "center" if ctx.orient == "v" else "left") == "center" else "left"
    desc_align = "center" if spec.get("description_align", align) == "center" else "left"
    brush_position = spec.get("brush_position", "below_heading" if layout == "stacked" else "below_whole_row")
    frozen = bool(spec.get("frozen") or spec.get("muted"))
    brush = HERE / "assets" / "strip-brush.png"
    brush_html = (f'<img class="hub-brush" src="{escape(ctx.asset_url(str(brush)), quote=True)}" alt="">'
                  if brush.exists() else "")
    head = f'<div class="hub-strip-heading-group"><div class="hub-strip-heading-line">{leaf_left}{title}</div>'
    head += (brush_html if brush_position == "below_heading" else "") + '</div>'
    return (f'<div class="c-title-strip hub-strip-size-{size}{ " hub-muted" if frozen else ""}" data-comp="title_strip" '
            f'data-orient="{ctx.orient}"{height_style} '
            f'data-layout="{layout}" data-align="{align}" data-description-align="{desc_align}" '
            f'data-brush-position="{escape(str(brush_position), quote=True)}">'
            f'{leaf_right}<div class="hub-strip-text">{head}<div class="hub-strip-description">{body}</div></div>'
            + (brush_html if brush_position != "below_heading" else "") + '</div>')


def render_stretch_list(block, ctx):
    spec = block.get("spec", {})
    raw_height = spec.get("min_height", 420 if ctx.orient == "h" else 540)
    try:
        height = max(96, int(raw_height))
    except (ValueError, TypeError):
        height = 420 if ctx.orient == "h" else 540
    raw_slice = spec.get("slice", 32)
    try:
        cut = max(16, min(64, int(raw_slice)))
    except (ValueError, TypeError):
        cut = 32
    lives = ctx.screen.get("live", [])
    key = spec.get("live_key") or spec.get("key") or (lives[-1] if lives else None)
    hot = ctx.hot("live", key) if key is not None else ""
    if key is None:
        ctx.warn("stretch_list 缺 live_key，本样张只输出空框")
    leaves = _leaf(ctx, "l") if spec.get("leaves", True) else ""
    align = "hub-stretch-side" if spec.get("placement") == "side" and ctx.orient == "h" else ""
    nodes = list(block.get("nodes", []))
    links = []
    while nodes and nodes[-1].get("type") == "linkrow":
        links.insert(0, nodes.pop())
    return (f'<div class="c-stretch-list {align}" data-comp="stretch_list">'
            f'<div class="hub-fixed-copy">{_nodes(nodes, ctx)}</div>'
            f'<div class="hub-stretch-frame card" data-nine-slice="{cut}" data-slice-manifest="{escape(ctx.asset_url(str(HERE / "assets" / "stretch-slices" / "manifest.json")), quote=True)}" data-live-key="{escape(str(key or ""), quote=True)}" '
            f'style="min-height:{height}px" {hot}>{leaves}</div>'
            f'<div class="hub-after-list">{_nodes(links, ctx)}</div></div>')


COMPONENTS = {"section_heading": render_section_heading, "title_strip": render_title_strip,
              "stretch_list": render_stretch_list}

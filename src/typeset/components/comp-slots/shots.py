"""真实截图和改前改后对比：绘制空槽，供网页贴入真实图像。"""
from __future__ import annotations

import re

from .common import attr, render_nodes, screen_value, spec_of


# 根负责合入本族 __init__.SPEC_FIELDS；各字段在本模块真实消费。
SHOT_SPEC_FIELDS = {
    "screenshot": ["indices", "columns", "columns_v", "ratio", "ratios", "max_width", "max_width_v",
                   "align", "text_position", "caption_mode", "caption_per_slot", "slot_groups", "number_position",
                   "label_above", "equal_row_height", "connector", "frame_style", "protected_parts",
                   "items_layout", "requested_slots", "aspect_ratio", "index", "screenshot_index", "caption",
                   "size", "illustration", "decoration", "after_step", "withdrawn_indices", "withdrawal_note"],
    "screenshot_compare": ["indices", "columns", "columns_v", "ratio", "ratios", "max_width", "max_width_v",
                           "align", "items_layout", "aspect_ratio", "index", "screenshot_index", "text_position",
                           "caption", "size"],
}


def _flag(spec, key, ctx):
    value = spec.get(key)
    if value is not None and type(value) is not bool:
        _incomplete(ctx, f'截图 {key} 必须是 true/false；未执行该构图字段。')
    return value is True


def _items_layout(spec, supported, ctx):
    layout = spec.get("items_layout") or {}
    if not isinstance(layout, dict):
        _incomplete(ctx, '截图 items_layout 必须是字段对象；未执行该构图。')
        return {}
    for key, value in layout.items():
        if key not in supported and value not in (None, "", "none", "auto", False, [], {}):
            _incomplete(ctx, f'截图 items_layout.{key} 未实现；未把整个对象当作已执行。')
    return layout


def _caption_mode(spec, ctx):
    layout = _items_layout(spec, {"captions", "slots"}, ctx)
    per_slot = _flag(spec, "caption_per_slot", ctx)
    per_slot = _flag(spec, "label_above", ctx) or per_slot
    if layout.get("captions") in (True, "per_slot", "source_order", "每个截图下面各自图注", "每槽下面对应一段定稿图注"):
        per_slot = True
    elif layout.get("captions") not in (None, "", "none", "auto", False):
        _incomplete(ctx, '截图 items_layout.captions 取值未实现；需 caption_per_slot 或明确逐槽图注模式。')
    mode = spec.get("caption_mode", "after")
    if mode not in ("after", "source_order", "full_width"):
        _incomplete(ctx, f'截图 caption_mode={mode} 未实现；保留一次原节点文字。')
        mode = "after"
    return "source_order" if mode == "after" and per_slot else mode


def _text_position(spec, ctx):
    value = spec.get("text_position", spec.get("caption", "after"))
    if value not in ("before", "after", "below"):
        _incomplete(ctx, f'截图文字位置 {value} 未实现；保留原文在槽后。')
        return "after"
    if "caption" in spec and spec["caption"] not in ("before", "after", "below"):
        _incomplete(ctx, '截图 caption 只支持原节点文字位置 before/after/below；未新增文字。')
    return "after" if value == "below" else value


def _grid_width(spec, orient, ctx, extra_cap=None):
    key = "max_width_v" if orient == "v" else "max_width"
    value = spec.get(key)
    # 只接受正数像素或 0–100% 的规范百分比，不把任意字符串注入 CSS。
    caps = []
    if value is not None:
        if type(value) in (int, float) and value > 0:
            caps.append(f'{float(value):g}px')
        elif isinstance(value, str) and re.fullmatch(r'\s*\d+(?:\.\d+)?%\s*', value) and 0 < float(value.strip()[:-1]) <= 100:
            caps.append(f'{float(value.strip()[:-1]):g}%')
        else:
            _incomplete(ctx, f'截图 {key} 必须是正数像素或 0–100% 的百分比；未执行宽度上限。')
    size = spec.get("size")
    if size in ("small", "medium", "large"):
        caps.append({"small": "480px", "medium": "800px", "large": "100%"}[size]
                    if orient == "h" else {"small": "60%", "medium": "100%", "large": "100%"}[size])
    elif size not in (None, "", "none", "auto", False):
        _incomplete(ctx, f'截图 size={size} 未实现；未改字体或拉伸图片。')
    if extra_cap is not None:
        caps.append(f'{extra_cap:g}px')
    cap = f'max-width:{caps[0]};' if len(caps) == 1 else f'max-width:min({",".join(caps)});' if caps else ''
    align = spec.get("align", "center")
    margins = {"left": "0 auto", "center": "auto", "right": "auto 0", "auto": "auto"}
    margin = margins.get(align) if isinstance(align, str) else None
    if margin is None:
        _incomplete(ctx, f'截图 align={align} 未实现；保留默认网格居中。')
        margin = "auto"
    return cap + f'margin-inline:{margin};'


def _ratio(value):
    if isinstance(value, (int, float)) and value > 0:
        return float(value)
    if isinstance(value, (list, tuple)) and len(value) == 2:
        return float(value[0]) / float(value[1])
    if isinstance(value, str):
        match = re.search(r'(\d+(?:\.\d+)?)\s*[:：/×x]\s*(\d+(?:\.\d+)?)', value)
        if match and float(match[2]) > 0:
            return float(match[1]) / float(match[2])
    return None


def ratio_for(shot, spec, index, ctx):
    ratios = spec.get("ratios", [])
    value = ratios[index] if index < len(ratios) else spec.get("ratio", spec.get("aspect_ratio"))
    if spec.get("aspect_ratio") is not None:
        alias = _ratio(spec["aspect_ratio"])
        if alias is None or alias <= 0:
            _incomplete(ctx, '截图 aspect_ratio 不是有效正比例；未按该字段构图。')
        elif spec.get("ratio") is not None and _ratio(spec["ratio"]) is not None and abs(_ratio(spec["ratio"]) - alias) > 1e-7:
            _incomplete(ctx, '截图 ratio 与 aspect_ratio 冲突；保留明确 ratio，需页代理核对。')
    explicit = _ratio(value)
    if explicit:
        return explicit
    crop = shot.get("crop") or {}
    if crop.get("w") and crop.get("h"):
        return float(crop["w"]) / float(crop["h"])
    where = shot.get("where", "")
    inferred = _ratio(where)
    if inferred:
        return inferred
    if "接近正方形" in where:
        return 1.1
    scene = screen_value(ctx, "scene", "")
    inferred = _ratio(scene)
    if inferred:
        return inferred
    ctx.warn(f'截图 {index} 未给出可解析比例，暂用 16:9；页规格需补 ratio/ratios。')
    return 16 / 9


def _shots(block, ctx):
    spec = spec_of(block)
    shots = screen_value(ctx, "screenshots", []) or []
    indices = spec.get("indices")
    alias = spec.get("screenshot_index", spec.get("index"))
    if alias is not None:
        if type(alias) is not int or alias < 0:
            _incomplete(ctx, '截图 index/screenshot_index 必须是非负整数；未采用该源下标。')
        elif indices is None:
            indices = [alias]
        elif indices != [alias]:
            _incomplete(ctx, '截图 indices 与 index/screenshot_index 冲突；保留 indices，不重绑源。')
    withdrawn = spec.get("withdrawn_indices") or []
    if withdrawn:
        if (not isinstance(withdrawn, list) or len(withdrawn) != len(set(withdrawn))
                or any(type(i) is not int or i < len(shots) for i in withdrawn)
                or not isinstance(indices, list) or not set(withdrawn) <= set(indices)
                or not isinstance(spec.get("withdrawal_note"), str) or not spec["withdrawal_note"].strip()):
            raise ValueError('撤下截图位必须明确、无重复且不覆盖仍保留的源截图，并有中性说明。')
    if isinstance(indices, list) and any(type(i) is not int or i < 0 or (i >= len(shots) and i not in withdrawn) for i in indices):
        _incomplete(ctx, '截图选中的下标缺真实源绑定；未画额外槽。')
    selected = [(i, s) for i, s in enumerate(shots) if indices is None or i in indices]
    selected.extend((i, {"withdrawn": True}) for i in withdrawn)
    return sorted(selected, key=lambda item: item[0])


def _after_step(block, ctx):
    value = spec_of(block).get("after_step")
    if value is None:
        return ''
    if type(value) is not int or value < 1:
        _incomplete(ctx, '截图 after_step 必须是正整数；跨块位置未核对。')
        return ''
    previous = block.get("previous_step_end")
    if previous is None:
        _incomplete(ctx, f'截图 after_step={value} 缺主引擎的只读 previous_step_end；未证明跨块位置正确。')
    elif str(previous) != str(value):
        _incomplete(ctx, f'截图 after_step={value} 与前置步骤末号 {previous} 不符；需主引擎修正块顺序。')
    return f' data-after-step="{value}"'


def _shot_decoration(spec, ctx):
    placement = spec.get("illustration")
    decoration = spec.get("decoration")
    if placement not in (None, "", "none", "auto", False, "outside"):
        _incomplete(ctx, f'截图 illustration={placement} 未实现；未往空截图内部加图。')
    if decoration not in (None, "", "none", "auto", False, "leaf_edges"):
        _incomplete(ctx, f'截图 decoration={decoration} 未实现。')
        return '', ''
    if placement == "outside" and decoration != "leaf_edges":
        _incomplete(ctx, '截图 illustration:outside 需现已支持的 decoration:leaf_edges；未补造卡外插画。')
        return '', ''
    if decoration != "leaf_edges":
        return '', ''
    leaves = [url for _, url in ctx.slots("illustration") if url]
    if not leaves:
        ctx.incomplete('截图叶子探边缺本屏真实插画槽，未用其它图标替代。', "asset")
        return '', ''
    return (' slot-shot-visual-decor-outside',
            f'<img class="deco slot-shot-leaf" src="{attr(leaves[0])}" alt="" aria-hidden="true">')


def _compare_reference(layout, spec, count, ctx):
    box = layout.get("source_frame_box")
    cap, reference_ratio, reference_attr = None, None, ''
    if box is not None:
        if (isinstance(box, list) and len(box) == 4 and all(type(v) in (int, float) for v in box)
                and box[2] > box[0] >= 0 and box[3] > box[1] >= 0 and count == 1):
            cap = float(box[2] - box[0])
            reference_ratio = cap / float(box[3] - box[1])
            reference_attr = f' data-source-frame-box="{attr(",".join(str(v) for v in box))}"'
            explicit = _ratio(spec.get("ratio", spec.get("aspect_ratio")))
            if explicit is not None and abs(explicit - reference_ratio) > 1e-7:
                _incomplete(ctx, '对比槽 source_frame_box 与明确比例不一致；保留明确比例，需核对参考框。')
        else:
            _incomplete(ctx, '对比槽 source_frame_box 需单个逻辑槽及有效 [左,上,右,下] 数字框。')
    source_value = layout.get("scene_requested_ratio")
    source_ratio = _ratio(source_value) if source_value is not None else None
    if source_value is not None and (source_ratio is None or source_ratio <= 0):
        _incomplete(ctx, '对比槽 scene_requested_ratio 不是有效正比例；未用其设置完整贴图区域。')
        source_ratio = None
    return cap, reference_ratio, reference_attr, source_ratio


def _incomplete(ctx, message):
    ctx.warn(message)
    if hasattr(ctx, "incomplete"):
        ctx.incomplete(message, "composition")


def _node_units(nodes):
    """清单逐项拆成带原 src 的节点；分组只消费这些真实节点一次。"""
    units = []
    for node in nodes:
        items = node.get("items", [])
        src = node.get("src", [])
        if node.get("type") in ("bullets", "steps", "stats") and len(items) == len(src):
            units.extend(dict(node, items=[item], src=[line]) for item, line in zip(items, src))
        else:
            units.append(node)
    return units


def _caption_key(text):
    text = re.sub(r'^\s*(?:#{1,3}\s+|-\s+)', '', str(text))
    text = re.sub(r'^(\d+)\.\s+', r'\1', text)
    return re.sub(r'\s+', '', text.replace('**', '').replace('`', '').translate(
        str.maketrans('', '', '〔〕【】［］｜')))


def _slot_nodes(block, selected, ctx):
    spec = spec_of(block)
    mode = _caption_mode(spec, ctx)
    groups = spec.get("slot_groups")
    if groups is None and mode not in ("source_order", "full_width"):
        return [[] for _ in selected], [], list(block.get("nodes", []))
    units = _node_units(block.get("nodes", []))
    used, captions = set(), []
    if groups is not None:
        if not isinstance(groups, list):
            _incomplete(ctx, 'slot_groups 必须是按真实截图 index 指定的节点分组列表。')
            groups = []
        selected_indices = {index for index, _ in selected}
        if any(not isinstance(g, dict) or g.get("index") not in selected_indices for g in groups):
            _incomplete(ctx, 'slot_groups 含未被 indices 选中的截图；未画额外槽，未消费其节点。')
    for index, shot in selected:
        if groups is None:
            key = _caption_key(shot.get("caption", ""))
            positions = [i for i, node in enumerate(units) if i not in used and key and
                         _caption_key('\n'.join(node.get("src", []))) == key]
            positions = positions[:1]
        else:
            matching = [g for g in groups if isinstance(g, dict) and g.get("index") == index]
            if len(matching) > 1:
                _incomplete(ctx, f'截图 {index} 在 slot_groups 重复；仅消费第一组。')
            positions = matching[0].get("node_indices", []) if matching else []
        caption = []
        if not isinstance(positions, list):
            _incomplete(ctx, f'截图 {index} 的 node_indices 必须是列表；原节点保留。')
            positions = []
        for position in positions:
            if type(position) is not int or position < 0 or position >= len(units) or position in used:
                _incomplete(ctx, f'截图 {index} 的节点引用无效或重复：{position}；原节点不丢弃。')
                continue
            used.add(position)
            caption.append(units[position])
        if not caption:
            _incomplete(ctx, f'截图 {index} 的逐槽图注没有分配到 screenshot 节点；需页代理/主引擎接入，未复制 screenshots.caption。')
        captions.append(caption)
    first = min(used) if used else len(units)
    before = [node for i, node in enumerate(units) if i not in used and i < first]
    after = [node for i, node in enumerate(units) if i not in used and i >= first]
    return captions, before, after


def _caption_parts(nodes, spec, ctx):
    """原 card 的名字或图注圆圈编号移到槽上方，所有原字仍各出现一次。"""
    if spec.get("label_above") is True and nodes:
        first = nodes[0]
        if first.get("type") in ("card", "group") and first.get("name"):
            label = f'<div class="tb slot-shot-label" data-role="card-name">{ctx.inline(first["name"])}</div>'
            body = (f'<p class="tb" data-role="card-body">{ctx.inline(first.get("text", ""))}</p>'
                    if first.get("type") == "card" and first.get("text") else '')
            return label, body + render_nodes(nodes[1:], ctx)
        _incomplete(ctx, 'label_above 没有取得原 card/group 的名字；原图注完整保留，未补标签。')
    if spec.get("number_position") != "above" or not nodes:
        return '', render_nodes(nodes, ctx)
    first = nodes[0]
    match = re.match(r'^([①-⑳])\s*(.*)$', first.get("text", "")) if first.get("type") == "para" else None
    if not match:
        return '', render_nodes(nodes, ctx)
    rest = dict(first, text=match[2])
    return (f'<div class="tb slot-shot-number">{ctx.inline(match[1])}</div>',
            render_nodes([rest, *nodes[1:]], ctx))


def _connector(direction):
    # 纯几何箭头，不加入定稿外文字，也不进入截图热区。
    viewbox = '0 0 20 40' if direction == "down" else '0 0 40 20'
    path = 'M10 2V35M3 27L10 35L17 27' if direction == "down" else 'M2 10H35M27 3L35 10L27 17'
    return (f'<div class="slot-shot-connector slot-shot-connector-{direction}" aria-hidden="true">'
            f'<svg viewBox="{viewbox}" preserveAspectRatio="xMidYMid meet">'
            f'<path d="{path}"/></svg></div>')


def render_screenshot(block, ctx):
    spec = spec_of(block)
    selected = _shots(block, ctx)
    if any(s.get("compare") for _, s in selected):
        return render_screenshot_compare(block, ctx)
    orient = ctx.orient
    default_cols = min(len(selected), 3) if orient == "h" else min(len(selected), 2)
    cols = int(spec.get("columns_v" if orient == "v" else "columns", default_cols) or 1)
    cols = max(1, min(cols, max(len(selected), 1)))
    layout = spec.get("items_layout") or {}
    stack = layout.get("slots") if isinstance(layout, dict) else None
    if stack in ("上下整宽排列", "stacked_full_width"):
        cols = 1
    elif stack not in (None, "", "none", "auto", False):
        _incomplete(ctx, '截图 items_layout.slots 取值未实现；保留 columns/columns_v 构图。')
    captions, before, after = _slot_nodes(block, selected, ctx)
    full_width = spec.get("caption_mode") == "full_width"
    frame_style = spec.get("frame_style", "default")
    if frame_style not in ("default", "plain_white"):
        _incomplete(ctx, f'截图 frame_style={frame_style} 未实现，保留默认框。')
        frame_style = "default"
    protected = spec.get("protected_parts") or []
    if protected and orient == "v":
        _incomplete(ctx, 'protected_parts 需主引擎按原范围/路径/字节保护及指定分张；截图模块仅保留声明，不代表 v/v2/v3 已完成。')
    connector = spec.get("connector", "none")
    if connector not in ("none", "arrow"):
        _incomplete(ctx, f'截图 connector={connector} 未实现，未画替代连接线。')
    if connector == "arrow" and len(selected) < 2:
        _incomplete(ctx, '槽间箭头需要同一 screenshot 块内至少两个真实截图；跨块连接交主引擎合组。')
    equal_height = _flag(spec, "equal_row_height", ctx)
    deco_class, decoration = _shot_decoration(spec, ctx)
    ratios = [ratio_for(shot, spec, pos, ctx) for pos, (_, shot) in enumerate(selected)]
    slots, full_captions, rows, row_items = [], [], [], []
    from engine.layout import WIDTH
    row_start, row_width = 0, WIDTH[orient] - (40 if screen_value(ctx, "shape") in ("card", "strip") else 72 if orient == "h" else 56)
    limits = [spec.get("max_width_v" if orient == "v" else "max_width"), spec.get("width") if orient == "h" else None] if equal_height else []
    row_width = min([row_width] + [float(v[:-1]) * row_width / 100 if isinstance(v, str) else float(v) for v in limits if type(v) in (int, float) and v > 0 or isinstance(v, str) and re.fullmatch(r'\d+(?:\.\d+)?%', v) and 0 < float(v[:-1]) <= 100])
    minimum, gap = 14 * (24 if orient == "h" else 36), 16 if orient == "h" else 18
    for pos, (index, shot) in enumerate(selected):
        ratio = ratios[pos]
        trial = ratios[row_start:pos + 2]
        row_end = (pos + 1) % cols == 0 or pos + 1 == len(selected)
        if equal_height:
            row_end = pos + 1 == len(selected) or pos + 1 - row_start >= cols or (row_width - gap * (len(trial) - 1)) * min(trial) / sum(trial) < minimum
        last_row = len(selected) % cols
        offset = cols - last_row + 1 if last_row and pos == len(selected) - last_row else None
        start = f'grid-column-start:{offset};' if offset is not None and not equal_height else ''
        number, caption = _caption_parts(captions[pos], spec, ctx)
        to_next = connector == "arrow" and pos + 1 < len(selected)
        right = _connector("right") if to_next and not row_end else ''
        down = _connector("down") if to_next and row_end else ''
        arrow_class = ' slot-shot-item-arrow-right' if right else ''
        caption_html = f'<div class="slot-shot-caption" data-shot-caption-index="{index}">{caption}</div>' if caption and not full_width else ''
        if shot.get("withdrawn"):
            # A retired position contains only its declared source note. It
            # has no file/full-source attributes and never creates a hotspot.
            if not caption:
                raise ValueError('撤下截图位必须从定稿节点取得中性说明，不能保留空的可点击槽。')
            if spec["withdrawal_note"] not in caption:
                raise ValueError('撤下截图位的定稿节点与声明的中性说明不一致。')
            frame = (f'<div class="slot-shot-frame slot-shot-frame-{frame_style}" role="note" '
                     f'data-withdrawn-shot-index="{index}" style="'
                     f'display:grid;place-items:center;padding:16px;box-sizing:border-box;'
                     f'background:#fff;color:#53665c;pointer-events:none">{caption}</div>')
            caption_html = ''
        else:
            frame = (f'<div class="slot-shot-frame slot-shot-frame-{frame_style}" '
                     f'style="aspect-ratio:{ratio:.8f}" {ctx.hot("screenshot", index)} '
                     f'data-shot-source="{attr(shot.get("file", ""))}" '
                     f'data-shot-full-source="{attr(shot.get("full", ""))}" data-shot-fit="contain"></div>')
        item = (
            f'<div class="slot-shot-item{arrow_class}" data-shot-index="{index}" style="{start}">{number}'
            f'<div class="slot-shot-visual{deco_class}">{decoration}{frame}{right}</div>'
            f'{caption_html}'
            f'{"" if full_width else down}</div>')
        (row_items if equal_height else slots).append(item)
        if full_width and caption:
            full_captions.append(f'<div class="slot-shot-caption" data-shot-caption-index="{index}">{caption}</div>')
        if full_width and row_end:
            (row_items if equal_height else slots).append(f'<div class="slot-shot-full-captions">{"".join(full_captions)}{down}</div>')
            full_captions = []
        if equal_height and row_end:
            row_ratios = ratios[row_start:pos + 1]
            # 以真实比例分配宽度：宽/比例一致，所以同排框等高；不拉伸或裁原图。
            weights = ' '.join(f'minmax(0,{r / min(row_ratios):.12g}fr)' for r in row_ratios)
            cap = 'max-width:min(100%,14em);margin-inline:auto;' if len(row_ratios) == 1 and ratio < 1 else ''
            rows.append(f'<div class="slot-shot-row" data-shot-row="{len(rows)}" '
                        f'style="grid-template-columns:{weights};{cap}">{"".join(row_items)}</div>')
            row_items = []
            row_start = pos + 1
    text = render_nodes(after, ctx)
    width = _grid_width(spec, orient, ctx)
    grid_class = "slot-shot-grid slot-shot-grid-equal-height" if equal_height else "slot-shot-grid"
    grid = f'<div class="{grid_class}" style="--slot-columns:{cols};{width}">{"".join(rows if equal_height else slots)}</div>'
    requested = spec.get("requested_slots")
    if requested is not None and (type(requested) is not int or requested < 0 or requested != len(selected)):
        _incomplete(ctx, f'requested_slots={requested} 与定稿真实截图绑定数 {len(selected)} 不符；需定稿/素材负责人补绑定，未造槽。')
    if not selected:
        ctx.warn('screenshot 没有绑定定稿 screenshots，未画无来源的空牌子。')
    body = text + grid if _text_position(spec, ctx) == "before" else grid + text
    protected_attr = f' data-protected-parts="{attr(",".join(str(p) for p in protected))}"' if protected else ''
    return f'<div class="c-slot-shots" data-comp="screenshot"{protected_attr}{_after_step(block, ctx)}>{render_nodes(before, ctx)}{body}</div>'


def render_screenshot_compare(block, ctx):
    spec = spec_of(block)
    for key in sorted(set(SHOT_SPEC_FIELDS["screenshot"]) - set(SHOT_SPEC_FIELDS["screenshot_compare"])):
        if spec.get(key) not in (None, "", "none", "auto", False, [], {}, "default", "after"):
            _incomplete(ctx, f'对比槽不消费 screenshot.{key}；当前采用双源单槽接口，未声称该字段已执行。')
    groups = []
    for index, shot in _shots(block, ctx):
        key = shot.get("compare") or f'screenshot-{index}'
        group = next((g for g in groups if g["key"] == key), None)
        if group is None:
            group = {"key": key, "sources": [], "index": index, "shot": shot}
            groups.append(group)
        group["sources"].append(shot)
    layout = _items_layout(spec, {"slot_order", "vertical_alignment", "phone_width_fraction_of_page",
                                  "desktop_width_fraction_of_page", "caption_position", "slot_width",
                                  "frame_background", "labels_position", "source_frame_box", "scene_requested_ratio"}, ctx)
    order = layout.get("slot_order")
    if order is not None and order != [group["key"] for group in groups]:
        _incomplete(ctx, '对比槽 items_layout.slot_order 与定稿真实分组顺序不一致；未换源或重排。')
    alignment = layout.get("vertical_alignment", "bottom")
    alignments = {"bottom": "end", "top": "start", "center": "center"}
    alignment_css = alignments.get(alignment) if isinstance(alignment, str) else None
    if alignment_css is None:
        _incomplete(ctx, f'对比槽 vertical_alignment={alignment} 未实现；保留底边对齐。')
        alignment_css = "end"
    if layout.get("caption_position") not in (None, "", "none", "auto", False, "below_both", "after_both", "below"):
        _incomplete(ctx, '对比槽 caption_position 取值未实现；原文仍在两个槽后出现一次。')
    if layout.get("slot_width") not in (None, "", "none", "auto", False, "100%"):
        _incomplete(ctx, '对比槽 slot_width 只支持 100%；未改动真实槽比例。')
    if layout.get("frame_background") not in (None, "", "none", "auto", False, "blank"):
        _incomplete(ctx, '对比槽 frame_background 只支持 blank；未放真实截图或模拟 UI。')
    if layout.get("labels_position") not in (None, "", "none", "auto", False, "top_two_ends"):
        _incomplete(ctx, '对比槽 labels_position 只支持 top_two_ends；原标签保留在框上两端。')
    reference_cap, reference_ratio, reference_attr, source_ratio = _compare_reference(layout, spec, len(groups), ctx)
    if reference_ratio is not None and not spec.get("ratio") and not spec.get("ratios") and not spec.get("aspect_ratio"):
        spec = dict(spec, ratio=reference_ratio)
    nodes = list(block.get("nodes", []))
    labels = None
    before = []
    for i, node in enumerate(nodes):
        if node.get("type") == "para" and re.sub(r'\s+', '', node.get("text", "")) == "改前改后":
            labels = node
            before, nodes = nodes[:i], nodes[i + 1:]
            break
    if layout.get("labels_position") == "top_two_ends" and labels is None:
        _incomplete(ctx, '对比槽 top_two_ends 没有分配到原“改前/改后”标签节点；未补造标签。')
    default_cols = 1 if ctx.orient == "v" else len(groups) or 1
    cols = max(1, min(int(spec.get("columns_v" if ctx.orient == "v" else "columns", default_cols) or 1), len(groups) or 1))
    phone_width = layout.get("phone_width_fraction_of_page")
    desktop_width = layout.get("desktop_width_fraction_of_page")
    weighted = ''
    if phone_width is not None or desktop_width is not None:
        widths = (phone_width, desktop_width)
        if (len(groups) == 2 and cols == 2 and all(type(w) in (int, float) and 0 < w <= 1 for w in widths)):
            # 两个声明对应原顺序的手机、电脑逻辑槽；扣除栏隙后按此比例分宽。
            weighted = 'grid-template-columns:' + ' '.join(f'minmax(0,{w:g}fr)' for w in widths) + ';'
        else:
            _incomplete(ctx, '对比槽手机/电脑页宽比例需两个逻辑槽、同排两列及两个有效比例；未采用替代宽度。')
    items = []
    for pos, group in enumerate(groups):
        ratio = ratio_for(group["shot"], spec, pos, ctx)
        # 两个真实源只对应一个槽；分组里的标签来自定稿节点，第二槽重复标 data-echo。
        label_html = ''
        if labels is not None:
            echo = ' data-echo="true"' if pos else ''
            label_html = f'<div class="slot-compare-labels"{echo}><span class="tb">{ctx.inline("改前")}</span><span class="tb">{ctx.inline("改后")}</span></div>'
        roles = {s.get("role", ""): s for s in group["sources"]}
        if "before" not in roles or "after" not in roles:
            ctx.warn(f'对比槽 {group["key"]} 缺 before/after 成对绑定。')
        attrs = ''.join(f' data-shot-{role}="{attr(roles.get(role, {}).get("file", ""))}"' for role in ("before", "after"))
        viewport = ''
        if source_ratio is not None:
            fit = ('height:100%;top:0;left:50%;transform:translateX(-50%)' if source_ratio < ratio else
                   'width:100%;left:0;top:50%;transform:translateY(-50%)')
            viewport = f'<div class="slot-compare-source-area" style="{fit};aspect-ratio:{source_ratio:.8f}" data-source-ratio="{source_ratio:.8f}"></div>'
        background = ' slot-compare-frame-blank' if layout.get("frame_background") == "blank" else ''
        items.append(f'<div class="slot-compare-item">{label_html}<div class="slot-compare-frame{background}" '
                     f'style="aspect-ratio:{ratio:.8f}" {ctx.hot("screenshot", group["key"])}{attrs}{reference_attr} '
                     f'data-shot-fit="contain">{viewport}</div></div>')
    width = _grid_width(spec, ctx.orient, ctx, reference_cap)
    grid = f'<div class="slot-compare-grid" style="--slot-columns:{cols};align-items:{alignment_css};{weighted}{width}">{"".join(items)}</div>'
    text = render_nodes(nodes, ctx)
    body = text + grid if _text_position(spec, ctx) == "before" else grid + text
    return f'<div class="c-slot-compare" data-comp="screenshot_compare">{render_nodes(before, ctx)}{body}</div>'

"""按钮行与可明确指定大号、粗体的介绍段；保留定稿节点顺序。"""
from html import escape, unescape
from pathlib import Path
import re

from .primitives import node_html, _list_images, _problem, PROSE_IMAGE_FIELDS


_ANCHOR = r'<a\b[^>]*>.*?</a>'
_BUTTON_RUN = re.compile(_ANCHOR + r'(?:\s*' + _ANCHOR + r')*', re.S)
_LINK = re.compile(r'<a\b[^>]*\bdata-hot="link"[^>]*>(.*?)</a>', re.S)
_ANCHORS = re.compile(_ANCHOR, re.S)
_GENERIC_FIELDS = {'type', 'text_ref', 'row', 'row_v', 'width', 'frame', 'page_break_after',
                   'page_break_before', 'notes', 'note', 'comment', 'id', 'role', 'description',
                   'illustration_description', 'auto', 'textless', 'omit_unapproved_text',
                   'asset_role', 'container_id', 'verification', 'source_note'}
BUTTON_FIELDS = {'primary', 'variant', 'large', 'size', 'bold', 'weight', 'columns', 'columns_v',
                 'row_counts', 'portrait_last_center', 'promote_links', 'link_style',
                 'linkrow_from_para', 'inline_button', 'button_separate_line', 'container',
                 'heading', 'align', 'items_layout', 'tone', 'paragraph_roles',
                 'full_width', 'line_order', 'connector', 'illustration', 'promote_layout'}
PROSE_FIELDS = BUTTON_FIELDS | PROSE_IMAGE_FIELDS | {
    'outside_card', 'illustration_labels', 'semantic_labels', 'label_position', 'text_width_fraction',
    'status_dots'}
# 只登记 action_button 的显式入口箭头；不改变 prose 的字段与渲染。
BUTTON_FIELDS = BUTTON_FIELDS | {'entry_arrow_refs'}
_PROSE_TONES = ('normal', 'muted', 'accent', 'gray')
# 只兼容已提交的这一个旧字段值；新规格应直接写 inline_button。
_LEGACY_LAYOUT_BUTTONS = {'末尾怎么协作作细绿边按钮': '怎么协作'}


def _unfulfilled(ctx, message):
    ctx.warn(message)
    incomplete = getattr(ctx, 'incomplete', None)
    if incomplete:
        incomplete(message, 'composition')


def _as_buttons(rendered):
    # 只加样式；ctx.inline 已生成的目标、热区类型和数量都不动。
    return re.sub(
        r'<a class="([^"]*)"',
        lambda match: '<a class="' + match.group(1) + ' btn ct-action tb"',
        rendered,
    )


def _columns(spec, ctx):
    key = 'columns_v' if ctx.orient == 'v' and 'columns_v' in spec else 'columns'
    if key not in spec:
        return None
    value = spec[key]
    try:
        columns = int(value)
        if isinstance(value, bool) or str(columns) != str(value) or columns < 1:
            raise ValueError
    except (TypeError, ValueError):
        _unfulfilled(ctx, f'comp-text：{key} 应为正整数，按钮行保留默认布局。')
        return None
    return columns


def _row(rendered, spec, ctx, tag='div'):
    classes, style = 'ct-action-row', ''
    columns = _columns(spec, ctx)
    if columns is not None or spec.get('row_counts'):
        # 全角空格在grid里会形成匿名单元；只去原按钮间的空白，源字/目标不变。
        rendered = re.sub(r'(</a>)\s+(?=<a\b)', r'\1', rendered)
    anchors = list(_ANCHORS.finditer(rendered))
    counts = spec.get('row_counts')
    if counts not in (None, False, []):
        valid = (isinstance(counts, list) and bool(counts)
                 and all(isinstance(n, int) and not isinstance(n, bool) and n > 0 for n in counts)
                 and sum(counts) == len(anchors) and _BUTTON_RUN.fullmatch(rendered)
                 and (columns is None or max(counts) <= columns))
        if not valid:
            _unfulfilled(ctx, 'comp-text：row_counts 须为覆盖全部原按钮的正整数列表，且每行不超过 columns；保留原按钮。')
        else:
            # 各行共用列宽，末行少项仍靠左；不把剩余按钮拉宽成另一档。
            child_spec = {k: v for k, v in spec.items() if k != 'row_counts'}
            child_spec['columns'] = columns or max(counts)
            child_spec.pop('columns_v', None)
            parts, offset, start = [], 0, 0
            for count in counts:
                offset += count
                end = anchors[offset].start() if offset < len(anchors) else len(rendered)
                parts.append(_row(rendered[start:end], child_spec, ctx, tag))
                start = end
            return f'<{tag} class="ct-action-rows">' + ''.join(parts) + f'</{tag}>'
    if columns is not None:
        classes += ' ct-action-grid'
        style = f' style="--ct-action-columns:{columns}"'
        if ctx.orient == 'v' and spec.get('portrait_last_center') is True and len(anchors) % columns == 1:
            classes += ' ct-action-last-center'
    if spec.get('align') in ('center', 'right'):
        classes += ' ct-action-align-' + spec['align']
    return f'<{tag} class="{classes}"{style}>' + rendered + f'</{tag}>'


def _button_row(node, ctx, spec):
    # src 保有〔链接〕和【按钮】的类型及交错顺序；links 字段已丢失记号类型。
    source = " ".join(node.get("src") or [])
    if not source:
        source = " ".join("〔" + text + "〕" for text in node.get("links", []))
    return _row(_as_buttons(ctx.inline(source)), spec, ctx)


def _paired_button_paragraph(rendered, ctx, spec, labels, tone):
    """CSS 放两按钮同行、原中间说明在下一行；DOM 仍按原第一/中间/末项。"""
    requested = spec.get('promote_links')
    anchors = list(_ANCHORS.finditer(rendered))
    selected = [match for match in anchors if labels is not None and _anchor_label(match.group(0)) in labels]
    if (not isinstance(requested, list) or len(requested) != 2 or labels is None or len(labels) != 2
            or spec.get('inline_button')
            or len(selected) != 2 or selected[0] is not anchors[0] or selected[-1] is not anchors[-1]
            or rendered[:selected[0].start()].strip() or rendered[selected[-1].end():].strip()
            or not rendered[selected[0].end():selected[-1].start()].strip()):
        _unfulfilled(ctx, 'comp-text：two_buttons_note_below 需要两个唯一的首尾原链接和完整中间说明；原字原序保留。')
        return None
    first, last = selected
    note = rendered[first.end():last.start()]
    def button(match, role):
        return _as_buttons(match.group(0)).replace(' ct-action tb', ' ct-action ct-inline-action tb ct-note-button-' + role)
    classes = 'ct-prose-paragraph prose ct-action-note-layout'
    if tone in ('muted', 'accent'):
        classes += ' ct-prose-tone-' + tone
    return (f'<div class="{classes}">' + rendered[:first.start()] + button(first, 'first')
            + '<span class="ct-action-note tb">' + note + '</span>' + button(last, 'last')
            + rendered[last.end():] + '</div>')


def _paragraph(rendered, ctx, spec, paragraph_buttons=False, labels=None, tone=None):
    if spec.get('promote_layout') == 'two_buttons_note_below':
        paired = _paired_button_paragraph(rendered, ctx, spec, labels, tone)
        if paired is not None:
            return paired
        # 布局不满足原节点时保全原行内标记；不把中间未选链接误升为第三个按钮。
        paragraph_buttons = False
    if paragraph_buttons and _BUTTON_RUN.search(rendered):
        def promote(run):
            if labels is None:
                return _row(_as_buttons(run.group(0)), spec, ctx, 'span')
            # 指定列表只改这些原链接；其余链接及两侧文字维持行内顺序。
            return _ANCHORS.sub(lambda m: _as_buttons(m.group(0)).replace(' ct-action tb', ' ct-action ct-inline-action tb')
                                if _anchor_label(m.group(0)) in labels else m.group(0), run.group(0))
        layout = spec.get('items_layout') or {}
        run = _BUTTON_RUN.search(rendered)
        suffix = rendered[run.end():] if run else ''
        if (labels is None and isinstance(layout, dict) and layout.get('trailing_text_align') == 'right'
                and run and suffix.strip() and not _ANCHORS.search(suffix)):
            # 明确的尾注布局保持原 DOM 顺序：前缀、按钮、截至文字。
            prefix = rendered[:run.start()]
            shares = re.findall(r'(\d+(?:\.\d+)?)%', str(layout.get('links', '')))
            style = f' style="--ct-action-tail-share:{shares[-1]}%"' if len(shares) > 1 and 0 < float(shares[-1]) < 100 else ''
            rendered = prefix + '<span class="ct-action-tail-layout ct-action-tail-' + ctx.orient + '"' + style + '>' + promote(run)
            rendered += '<span class="ct-action-tail tb">' + suffix + '</span></span>'
        else:
            rendered = _BUTTON_RUN.sub(promote, rendered)
    classes = 'ct-prose-paragraph prose tb'
    if tone in ('muted', 'accent'):
        classes += ' ct-prose-tone-' + tone
    return f'<p class="{classes}">{rendered}</p>'


def _anchor_label(anchor):
    return unescape(re.sub(r'<[^>]+>', '', re.sub(r'^<a\b[^>]*>|</a>$', '', anchor, flags=re.S)))


def _node(node, ctx, spec, paragraph_buttons=False, labels=None, tone=None):
    kind = node.get("type")
    if kind == "linkrow":
        return _button_row(node, ctx, spec)
    if kind == "para":
        rendered = ctx.inline(node.get("text", ""))
        return _paragraph(rendered, ctx, spec, paragraph_buttons, labels, tone)
    if kind == "card":
        if (spec.get('items_layout') or {}).get('heading_style') == 'bold_sans':
            # 原名称只出现一次；标题和正文分角色，图标在标题左侧。
            return ('<div class="ct-prose-card-copy"><div class="ct-prose-card-heading name tb">'
                    + ctx.inline(node.get('name', '')) + '</div>'
                    + _paragraph(ctx.inline(node.get('text', '')), ctx, spec, False, None, tone) + '</div>')
        return _paragraph(f'<b>{ctx.inline(node.get("name", ""))}</b>　{ctx.inline(node.get("text", ""))}',
                          ctx, spec, False, None, tone)
    # 与 core 的普通正文块保持原有组件分派；不把其它节点挪到末尾。
    component = {
        "h1": "chapter_title", "h2": "chapter_title", "h3": "section_heading",
        "group": "section_heading", "now": "live_strip", "bullets": "bullet_list",
        "steps": "numbered_steps", "stats": "stat_card", "table": "table",
        "legend": "status_legend", "code": "monospace",
    }.get(kind)
    if component:
        child_spec = spec.get('heading', {}) if kind in ('h1', 'h2', 'h3', 'group') else {}
        if kind == 'bullets':
            child_spec = {"bare": True}
        return ctx.render({"type": component, "spec": child_spec, "nodes": [node]})
    return node_html(node, ctx)


def _inline_button(parts, nodes, spec, ctx):
    requested = spec.get('inline_button')
    links = [(i, m) for i, part in enumerate(parts) if nodes[i].get('type') == 'para'
             for m in _LINK.finditer(part)]
    label = requested.strip().removeprefix('〔').removesuffix('〕') if isinstance(requested, str) else None
    selected = links[-1] if requested is True and links else next(
        (link for link in links if unescape(link[1].group(1)) == label), None)
    if selected is None:
        _unfulfilled(ctx, 'comp-text：inline_button 找不到对应的原段内链接，保留原文。')
        return
    i, link = selected
    part = parts[i]
    paragraph = re.fullmatch(r'<p class="(ct-prose-paragraph [^"]*)">(.*)</p>', part, re.S)
    button = _as_buttons(link.group(0))
    if paragraph and not part[link.end():paragraph.end(2)].strip():
        prefix = part[paragraph.start(2):link.start()]
        copy = ('<div class="ct-action-copy"><p class="' + paragraph.group(1) + '">' + prefix + '</p></div>') if prefix.strip() else ''
        separate = spec.get('button_separate_line', ctx.orient == 'v') is True
        classes = 'ct-prose-action-row' + (' ct-action-separate' if separate else '')
        parts[i] = f'<div class="{classes}">' + copy + _row(button, spec, ctx) + '</div>'
    else:
        # 指定的原链接前后都有文字时，在原位置提升，不拆开其它行内标记。
        button = button.replace(' ct-action tb', ' ct-action ct-inline-action')
        parts[i] = part[:link.start()] + button + part[link.end():]


def _paragraph_tones(nodes, spec, ctx):
    default = spec.get('tone', 'normal')
    if default not in _PROSE_TONES:
        _unfulfilled(ctx, 'comp-text prose：tone 只支持 normal/muted/accent/gray，保留默认正文色。')
        default = 'normal'
    if default == 'gray':
        default = 'muted'
    tones = [default] * len(nodes)
    if 'paragraph_roles' not in spec:
        return tones
    requested = spec['paragraph_roles']
    if not isinstance(requested, list):
        _unfulfilled(ctx, 'comp-text prose：paragraph_roles 应为 {text_ref,tone} 原段落映射列表，保留默认正文色。')
        return tones
    assigned, conflicts = {}, set()
    normalize = lambda value: re.sub(r'\s+', '', value.replace('**', '').replace('`', ''))
    for role in requested:
        if (not isinstance(role, dict) or set(role) != {'text_ref', 'tone'}
                or not isinstance(role.get('text_ref'), str) or not normalize(role['text_ref'])
                or role.get('tone') not in _PROSE_TONES):
            _unfulfilled(ctx, 'comp-text prose：paragraph_roles 每项须只含原段落 text_ref 和 normal/muted/accent tone，保留该段默认色。')
            continue
        prefix = normalize(role['text_ref'])
        candidates = []
        for index, node in enumerate(nodes):
            if node.get('type') not in ('para', 'card'):
                continue
            raw = (node.get('name', '') + ' ' if node.get('type') == 'card' else '') + node.get('text', '')
            if normalize(raw).startswith(prefix):
                candidates.append(index)
        if len(candidates) != 1:
            _unfulfilled(ctx, f'comp-text prose：paragraph_roles.text_ref“{role["text_ref"]}”没有唯一原段落，保留原字与默认色。')
            continue
        index = candidates[0]
        if index in assigned:
            conflicts.add(index)
            _unfulfilled(ctx, 'comp-text prose：paragraph_roles 多项指向同一原段落，保留该段默认色。')
        assigned[index] = 'muted' if role['tone'] == 'gray' else role['tone']
    for index, tone in assigned.items():
        if index not in conflicts:
            tones[index] = tone
    return tones


def _plain_node(node, ctx):
    raw = (node.get('name', '') + ' ' if node.get('type') == 'card' else '') + node.get('text', '')
    return unescape(re.sub(r'<[^>]+>', '', ctx.inline(raw)))


def _same_source_order(nodes, requested, ctx, field):
    paragraphs = [node for node in nodes if node.get('type') in ('para', 'card')]
    normalize = lambda value: re.sub(r'\s+', '', value.replace('**', '').replace('`', ''))
    if (not isinstance(requested, list) or not requested
            or not all(isinstance(value, str) and normalize(value) for value in requested)
            or len(requested) != len(paragraphs)
            or any(not normalize(_plain_node(node, ctx)).startswith(normalize(prefix))
                   for node, prefix in zip(paragraphs, requested))):
        _unfulfilled(ctx, f'comp-text prose：{field} 须按原段顺序列出全部原文前缀；保留原顺序，不重排定稿。')
        return False
    return True


def _items_layout(spec, nodes, ctx, prose):
    """把已提交的精确布局转为实际段落结构；说明文字不进成品。"""
    if 'items_layout' not in spec:
        return ''
    layout = spec['items_layout']
    if not isinstance(layout, dict):
        _unfulfilled(ctx, 'comp-text：items_layout 应为布局对象，保留原段落。')
        spec['items_layout'] = {}
        return ''
    layout = dict(layout)
    spec['items_layout'] = layout
    classes = ''
    paragraphs = [node for node in nodes if node.get('type') in ('para', 'card')]
    allowed = {'links', 'link_style', 'trailing_text_align', 'trailing_text_position'}
    if prose:
        allowed |= {'style', 'icon', 'node_type', 'item_count', 'order', 'card_background',
                    'icon_position', 'icon_width_fraction', 'text_width_fraction',
                    'heading_style', 'links_position'}
    for key, value in layout.items():
        if key not in allowed and value not in (None, '', 'none', 'auto', False, [], {}, 'default', 'left'):
            _unfulfilled(ctx, f'comp-text：items_layout.{key} 未实现，原文字保留。')
    if 'links' in layout and layout['links'] not in ('同一行两按钮，约各42%，右端截至文字约14%', '各占整宽一行'):
        _unfulfilled(ctx, 'comp-text：items_layout.links 只支持已登记的两按钮尾注或整宽逐行布局，保留原按钮。')
    for key, supported in (('trailing_text_align', ('right', 'left')),
                           ('trailing_text_position', ('最后', 'last'))):
        if key in layout and layout[key] not in supported:
            _unfulfilled(ctx, f'comp-text：items_layout.{key} 值无效，保留原尾注。')
    if 'link_style' in layout:
        value = layout['link_style']
        if value != 'button' and not (isinstance(value, str) and value in _LEGACY_LAYOUT_BUTTONS):
            _unfulfilled(ctx, 'comp-text：items_layout.link_style 值无效，保留原链接。')
    if not prose:
        return classes
    if 'style' in layout:
        if layout['style'] == '细长浅绿卡':
            classes += ' ct-prose-strip card'
        else:
            _unfulfilled(ctx, 'comp-text prose：items_layout.style 只支持已登记的细长浅绿卡，保留原段。')
    if 'icon' in layout:
        if layout['icon'] == '麦克风' and len(paragraphs) == 1:
            files = ['_library/icons/麦克风.png']
            if ('paragraph_images' in spec and spec['paragraph_images'] != files
                    or spec.get('illustration') not in (None, 'left_inside')):
                _unfulfilled(ctx, 'comp-text prose：麦克风布局与显式段图映射冲突，保留显式映射。')
            else:
                spec['paragraph_images'], spec['illustration'] = files, 'left_inside'
        else:
            _unfulfilled(ctx, 'comp-text prose：items_layout.icon 须为单个原段的已登记麦克风图标，不猜图。')
    if 'node_type' in layout and (layout['node_type'] != 'card' or any(n.get('type') != 'card' for n in nodes)):
        _unfulfilled(ctx, 'comp-text prose：items_layout.node_type=card 须对应本块全部原 card 节点，保留原节点。')
    if 'item_count' in layout:
        count = layout['item_count']
        if not isinstance(count, int) or isinstance(count, bool) or count < 1 or count != len(paragraphs):
            _unfulfilled(ctx, 'comp-text prose：items_layout.item_count 与原条目数不符，保留全部原条目。')
    if 'order' in layout:
        order = layout['order']
        if (not isinstance(order, list) or not all(isinstance(n, int) and not isinstance(n, bool) for n in order)
                or order != list(range(1, len(paragraphs) + 1))):
            _unfulfilled(ctx, 'comp-text prose：items_layout.order 须为原条目的顺序编号，不重排定稿。')
    for key, expected in (('card_background', 'none'), ('icon_position', 'left_of_heading'),
                          ('heading_style', 'bold_sans'), ('links_position', 'inline_in_last_paragraph')):
        if key in layout and layout[key] != expected:
            _unfulfilled(ctx, f'comp-text prose：items_layout.{key} 只支持 {expected}，保留原段。')
    if layout.get('heading_style') == 'bold_sans' and any(node.get('type') != 'card' for node in paragraphs):
        _unfulfilled(ctx, 'comp-text prose：bold_sans 卡头须有原 card 名称，不能从普通段落补造标题。')
    if layout.get('icon_position') == 'left_of_heading':
        if spec.get('illustration') not in (None, 'left_inside'):
            _unfulfilled(ctx, 'comp-text prose：left_of_heading 与显式插画方位冲突，保留原文。')
        elif spec.get('illustration') is None:
            spec['illustration'] = 'left_inside'
    if layout.get('card_background') == 'none':
        classes += ' ct-prose-bare-items'
    for key, maximum in (('icon_width_fraction', .38), ('text_width_fraction', 1)):
        if key in layout:
            value = layout[key]
            if not isinstance(value, (int, float)) or isinstance(value, bool) or not 0 < value <= maximum:
                _unfulfilled(ctx, f'comp-text prose：items_layout.{key} 须为大于0、不超过{maximum}的数字，保留默认宽度。')
            elif key in spec and spec[key] != value:
                _unfulfilled(ctx, f'comp-text prose：items_layout.{key} 与顶层字段冲突，保留显式顶层宽度。')
            else:
                spec[key] = value
    if layout.get('links_position') == 'inline_in_last_paragraph':
        groups = [list(_ANCHORS.finditer(ctx.inline(n.get('text', '')))) for n in paragraphs]
        if (not groups or not groups[-1] or any(groups[:-1])
                or spec.get('inline_button') or spec.get('promote_links') or spec.get('link_style') == 'button'):
            _unfulfilled(ctx, 'comp-text prose：links_position 要求全部原链接留在末条正文内；原字和链接保留。')
    return classes


def _semantic_labels(spec, nodes, ctx):
    requested = spec.get('semantic_labels')
    if 'semantic_labels' in spec:
        originals = [part for node in nodes for part in re.split(r'\u3000|\s{2,}', _plain_node(node, ctx)) if part]
        if (not isinstance(requested, list) or not requested
                or not all(isinstance(label, str) and label for label in requested)
                or requested != originals):
            _unfulfilled(ctx, 'comp-text prose：semantic_labels 须与本块原标签逐项、逐序一致，不能补造或删字。')
        if spec.get('label_position') != 'in_illustration':
            _unfulfilled(ctx, 'comp-text prose：semantic_labels 尚未给可执行的图内位置，保留原标签。')
    if 'illustration_labels' in spec and not isinstance(spec['illustration_labels'], bool):
        _unfulfilled(ctx, 'comp-text prose：illustration_labels 应为布尔值，保留原标签。')
    if spec.get('illustration_labels') is True or spec.get('label_position') == 'in_illustration':
        _unfulfilled(ctx, 'comp-text prose：图内原标签缺少所属插画及定位合同，原标签保留，图内构图未执行。')
    elif 'label_position' in spec and spec['label_position'] not in (None, '', 'none', 'auto'):
        _unfulfilled(ctx, 'comp-text prose：label_position 只识别 in_illustration 请求，保留原标签。')


def _prose_image_parts(parts, nodes, spec, ctx):
    """逐原段接明确左图；不造外卡，不让缺图改变后续段的映射。"""
    paragraphs = [index for index, node in enumerate(nodes) if node.get('type') in ('para', 'card')]
    urls = _list_images(spec, len(paragraphs), ctx, 'prose', 'paragraph_images')
    fraction = spec.get('icon_width_fraction')
    styles = []
    if fraction is not None:
        if isinstance(fraction, (int, float)) and not isinstance(fraction, bool) and 0 < fraction <= .38:
            styles.append(f'--ct-prose-icon-width:{fraction * 100:g}%')
        else:
            _problem(ctx, 'comp-text prose：icon_width_fraction 应为大于 0、不超过 0.38 的数字，保留默认图宽。')
    text_fraction = spec.get('text_width_fraction')
    if text_fraction is not None:
        if (isinstance(text_fraction, (int, float)) and not isinstance(text_fraction, bool)
                and 0 < text_fraction <= 1 and (not styles or fraction + text_fraction <= 1)):
            styles.append(f'--ct-prose-copy-width:{text_fraction * 100:g}%')
            if styles and isinstance(fraction, (int, float)) and not isinstance(fraction, bool) and 0 < fraction <= .38:
                styles.append(f'--ct-prose-item-gap:{(1 - fraction - text_fraction) * 100:g}%')
        else:
            _problem(ctx, 'comp-text prose：text_width_fraction 应为有效比例，且图文合计不超过1，保留默认正文宽度。')
    style = ' style="' + ';'.join(styles) + '"' if styles else ''
    if urls is None:
        return parts
    for index, url in zip(paragraphs, urls):
        if url:
            parts[index] = ('<div class="ct-prose-item"' + style + '><img class="ct-prose-icon" src="'
                            + escape(url, quote=True) + '" alt=""><div class="ct-prose-item-copy">'
                            + parts[index] + '</div></div>')
        elif (spec.get('items_layout') or {}).get('icon_position') == 'left_of_heading':
            # 缺图仍保留文字列宽和原槽位，不画空替代图，不挪后续图标。
            parts[index] = ('<div class="ct-prose-item ct-prose-item-missing-icon"' + style
                            + '><div class="ct-prose-item-copy">' + parts[index] + '</div></div>')
    if any(urls):
        ctx.warn('comp-text prose：原段左图外观待本人看组件样张；缺图段保留原文，不画替代图。')
    return parts


def _content(block, ctx, classes, paragraph_buttons=False, prose=False):
    spec, nodes = dict(block.get('spec') or {}), block.get('nodes', [])
    classes += _items_layout(spec, nodes, ctx, prose)
    layout = spec.get('items_layout')
    if isinstance(layout, dict) and isinstance(layout.get('link_style'), str):
        old_value = layout['link_style']
        if old_value in _LEGACY_LAYOUT_BUTTONS:
            label = _LEGACY_LAYOUT_BUTTONS[old_value]
            if 'inline_button' in spec and spec['inline_button'] != label:
                _unfulfilled(ctx, 'comp-text：items_layout.link_style 与 inline_button 冲突，保留显式 inline_button。')
            else:
                spec['inline_button'] = label
        elif old_value == 'button':
            if 'link_style' in spec and spec['link_style'] != 'button':
                _unfulfilled(ctx, 'comp-text：items_layout.link_style 与 link_style 冲突，保留显式 link_style。')
            else:
                spec['link_style'] = 'button'
    tones = _paragraph_tones(nodes, spec, ctx)
    if any(tone in ('muted', 'accent') and node.get('type') in ('para', 'card') for node, tone in zip(nodes, tones)):
        ctx.warn('comp-text prose：灰说明与绿问句角色色待本人批准组件样张。')
    if spec.get('align') in ('center', 'right'):
        classes += ' ct-prose-align-' + spec['align']
    known_fields = PROSE_FIELDS if prose else BUTTON_FIELDS
    for key, value in spec.items():
        if key not in known_fields | _GENERIC_FIELDS and value not in (None, '', 'none', 'auto', False, [], {}, 'default', 'left'):
            _unfulfilled(ctx, f'comp-text：按钮与介绍段不支持 {key}，保留原节点；这项构图未执行。')
    labels = None
    if 'promote_links' in spec:
        requested_labels = spec['promote_links']
        if (isinstance(requested_labels, list) and all(isinstance(s, str) and s.strip() for s in requested_labels)):
            labels = {s.strip().removeprefix('〔').removesuffix('〕') for s in requested_labels}
            found = {_anchor_label(m.group(0)) for n in nodes if n.get('type') == 'para'
                     for m in _LINK.finditer(ctx.inline(n.get('text', '')))}
            for missing in sorted(labels - found):
                _unfulfilled(ctx, f'comp-text：promote_links 找不到原段内链接 {missing}，保留原文。')
        else:
            labels = set()
            _unfulfilled(ctx, 'comp-text：promote_links 应为原段内链接标签列表，保留原文。')
        paragraph_buttons = True
    if 'promote_layout' in spec and spec['promote_layout'] != 'two_buttons_note_below':
        _unfulfilled(ctx, 'comp-text：promote_layout 只支持 two_buttons_note_below，保留原段内布局。')
    if 'link_style' in spec:
        if spec['link_style'] == 'button':
            paragraph_buttons = True
            if labels is None and not any(k in spec for k in ('columns', 'columns_v', 'row_counts', 'items_layout')):
                labels = {_anchor_label(m.group(0)) for n in nodes if n.get('type') == 'para'
                          for m in _LINK.finditer(ctx.inline(n.get('text', '')))}
        elif spec['link_style'] not in (None, '', 'none', 'auto', 'default'):
            _unfulfilled(ctx, 'comp-text：link_style 只支持 button，保留原段落。')
    if 'linkrow_from_para' in spec:
        if spec['linkrow_from_para'] is True:
            paragraph_buttons = True
        elif spec['linkrow_from_para'] not in (None, False):
            _unfulfilled(ctx, 'comp-text：linkrow_from_para 应为布尔值，保留原段落。')
    if 'portrait_last_center' in spec and not isinstance(spec['portrait_last_center'], bool):
        _unfulfilled(ctx, 'comp-text：portrait_last_center 应为布尔值，保留默认按钮布局。')
    if 'align' in spec and spec['align'] not in (None, '', 'left', 'center', 'right', 'auto'):
        _unfulfilled(ctx, 'comp-text：align 只支持 left/center/right，保留默认按钮布局。')
    for key in ('primary', 'large', 'bold', 'button_separate_line'):
        if key in spec and not isinstance(spec[key], bool):
            _unfulfilled(ctx, f'comp-text：{key} 应为布尔值，保留默认行为。')
    for key, supported in (('variant', ('primary',)), ('size', ('small', 'medium', 'large')), ('weight', ('bold',))):
        if key in spec and spec[key] not in supported + (None, '', 'none', 'auto', 'default', 'normal'):
            _unfulfilled(ctx, f'comp-text：{key} 不支持 {spec[key]}，保留默认行为。')
    if spec.get('large') is True and spec.get('size') in ('small', 'medium'):
        _unfulfilled(ctx, 'comp-text：large 与 size 档位冲突，保留显式 large 的共享大档。')
    if 'connector' in spec and spec['connector'] not in (None, '', 'none', 'auto', 'default'):
        _unfulfilled(ctx, 'comp-text：段落及按钮行只支持 connector=none，连线构图未执行。')
    if not prose and spec.get('illustration') not in (None, '', 'none', 'auto'):
        _unfulfilled(ctx, 'comp-text action_button：illustration 只支持 none，插画构图未执行。')
    if 'full_width' in spec:
        if not isinstance(spec['full_width'], bool):
            _unfulfilled(ctx, 'comp-text：full_width 应为布尔值，保留原按钮宽度。')
        elif spec['full_width'] is True:
            classes += ' ct-actions-full-width'
            if _columns(spec, ctx) not in (None, 1):
                _unfulfilled(ctx, 'comp-text：full_width 与多列按钮冲突，保留显式列数。')
        else:
            classes += ' ct-actions-natural-width'
    if 'line_order' in spec and _same_source_order(nodes, spec['line_order'], ctx, 'line_order'):
        classes += ' ct-prose-ordered-lines'
    if prose:
        _semantic_labels(spec, nodes, ctx)
        if 'outside_card' in spec:
            if not isinstance(spec['outside_card'], bool):
                _unfulfilled(ctx, 'comp-text prose：outside_card 应为布尔值，保留原段。')
            elif spec['outside_card'] is True:
                if spec.get('frame') or spec.get('container'):
                    _unfulfilled(ctx, 'comp-text prose：outside_card 与外框请求冲突，保留原段，交布局方定父容器。')
                else:
                    classes += ' ct-prose-outside-card'
    requested = spec.get('inline_button')
    parts, i = [''] * len(nodes), 0
    while i < len(nodes):
        node, end = nodes[i], i + 1
        if node.get('type') == 'linkrow' and any(k in spec for k in ('columns', 'columns_v', 'row_counts', 'portrait_last_center')):
            while end < len(nodes) and nodes[end].get('type') == 'linkrow':
                end += 1
            if end > i + 1:
                node = {'type': 'linkrow', 'src': [line for n in nodes[i:end] for line in n.get('src', [])],
                        'links': [link for n in nodes[i:end] for link in n.get('links', [])]}
        parts[i] = _node(node, ctx, spec, paragraph_buttons and not requested, labels, tones[i])
        i = end
    if requested:
        _inline_button(parts, nodes, spec, ctx)
    if 'ct-prose-large' in classes:
        parts = [p.replace('ct-prose-paragraph prose tb', 'ct-prose-paragraph ct-intro tb')
                 .replace('ct-prose-paragraph prose ct-action-note-layout', 'ct-prose-paragraph ct-intro ct-action-note-layout')
                 for p in parts]
    if prose:
        parts = _prose_image_parts(parts, nodes, spec, ctx)
    if 'container' in spec:
        if spec['container'] in ('claude_card', 'codex_card'):
            # 兄弟块的共同卡面只能由布局 owner 的 frame 负责；组件不各造一张卡。
            if spec.get('frame') != spec['container']:
                _unfulfilled(ctx, 'comp-text prose：container=' + spec['container']
                             + ' 需要相邻兄弟块共同 frame，当前共同外框未执行。')
        elif spec['container'] != 'green_banner':
            _unfulfilled(ctx, 'comp-text：container 只支持 green_banner，保留原节点。')
        else:
            classes += ' ct-green-banner card'
            if nodes and nodes[0].get('type') in ('h1', 'h2', 'h3', 'group'):
                classes += ' ct-banner-with-heading ct-banner-' + ctx.orient
                parts = ['<div class="ct-banner-heading">' + parts[0] + '</div>',
                         '<div class="ct-banner-content">' + ''.join(parts[1:]) + '</div>']
    return classes, ''.join(parts)


def _action_entry_arrows(content, spec, ctx):
    """仅给唯一匹配完整原标签的现有按钮加无字形状；默认 HTML 原样返回。"""
    refs = spec.get('entry_arrow_refs')
    if refs is None or refs is False or refs == [] or refs == 'none':
        return content
    if (not isinstance(refs, list)
            or any(not isinstance(ref, str) or not ref.strip() for ref in refs)):
        _unfulfilled(ctx, 'comp-text action_button：entry_arrow_refs 须为原按钮完整名称列表，保留原按钮。')
        return content
    anchors = []
    for match in _ANCHORS.finditer(content):
        classes = re.search(r'\bclass="([^"]*)"', match.group(0))
        if classes and 'ct-action' in classes[1].split():
            anchors.append(match)
    names = [_anchor_label(match.group(0)) for match in anchors]
    if len(set(refs)) != len(refs):
        _unfulfilled(ctx, 'comp-text action_button：entry_arrow_refs 重复指定原按钮，保留原按钮，不重复加箭头。')
        return content
    if any(names.count(ref) != 1 for ref in refs):
        _unfulfilled(ctx, 'comp-text action_button：entry_arrow_refs 没有唯一匹配的原按钮完整名称，保留原字原序。')
        return content
    selected = {anchors[names.index(ref)].start(): ref for ref in refs}

    def decorate(match):
        ref = selected.get(match.start())
        if ref is None:
            return match.group(0)
        opening, label = match.group(0).split('>', 1)
        opening = re.sub(r'\bclass="([^"]*)"',
                         lambda m: 'class="' + m[1] + ' ct-action-entry-arrow"', opening, count=1)
        arrow = ('<span class="ct-action-entry-arrow-shape arrow" data-comp="arrow" '
                 'data-entry-arrow-ref="' + escape(ref, quote=True) + '" aria-hidden="true"></span>')
        return (opening + '>' + arrow + '<span class="ct-action-entry-label">'
                + label[:-4] + '</span></a>')

    return _ANCHORS.sub(decorate, content)


def render_action_button(block, ctx):
    spec = block.get("spec") or {}
    primary = spec.get("primary") is True or spec.get("variant") == "primary"
    classes = "c-text c-text-actions" + (" ct-primary" if primary else "")
    if spec.get('large') is True:
        classes += ' ct-actions-large'
    elif spec.get('size') in ('small', 'medium', 'large'):
        classes += ' ct-actions-' + spec['size']
    classes, content = _content(block, ctx, classes, paragraph_buttons=True)
    content = _action_entry_arrows(content, spec, ctx)
    return f'<div class="{classes}" data-comp="action_button">' + content + '</div>'


def _prose_status_variables():
    """只核共享颜色是否真实声明；不提供自造 fallback 色。"""
    try:
        css = (Path(__file__).resolve().parents[2] / 'style' / 'base.css').read_text(encoding='utf-8')
    except OSError:
        return ['--status-unused', '--status-uncertain']
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    missing = []
    for variable in ('--status-unused', '--status-uncertain'):
        match = re.search(r'(?<![-\w])' + re.escape(variable) + r'\s*:\s*([^;{}]+);', css)
        if not match or not match[1].strip():
            missing.append(variable)
    return missing


def _prose_status_context(block, ctx):
    spec = block.get('spec') or {}
    if 'status_dots' not in spec:
        return ctx
    if not isinstance(spec['status_dots'], bool):
        _unfulfilled(ctx, 'comp-text prose：status_dots 必须为布尔值，原图例保留。')
        return ctx
    if not spec['status_dots']:
        return ctx
    # 只接受本块完整原双状态图例；普通叙述、条目括注与其它组件不接管。
    pattern = re.compile(r'\s*灰圆点＝(?P<unused>没用过)\s+浅灰圆点＝(?P<uncertain>说不准)\s*')
    candidates = [(node, pattern.fullmatch(node.get('text', ''))) for node in block.get('nodes', [])
                  if node.get('type') == 'para' and isinstance(node.get('text'), str)]
    candidates = [(node, match) for node, match in candidates if match]
    if len(candidates) != 1:
        _unfulfilled(ctx, 'comp-text prose：status_dots 没有唯一完整原双状态图例，原字保留，不给叙述词猜状态。')
        return ctx
    selected, match = candidates[0]
    raw = selected['text']
    if (raw.count('没用过') != 1 or raw.count('说不准') != 1
            or any(node is not selected and raw in (node.get('text'), node.get('name'))
                   for node in block.get('nodes', []))):
        _unfulfilled(ctx, 'comp-text prose：status_dots 的原图例/状态词不能唯一定位，原图例保留。')
        return ctx
    missing = _prose_status_variables()
    if missing:
        _unfulfilled(ctx, 'comp-text prose：status_dots 缺少共享颜色变量 ' + '/'.join(missing) + '，点色未执行，原图例保留。')
        return ctx
    spans = [(match.start(role), match.end(role), role) for role in ('unused', 'uncertain')]

    class StatusLegendContext:
        def __getattr__(self, key):
            return getattr(ctx, key)

        def inline(self, value):
            if value != raw:
                return ctx.inline(value)
            parts, cursor = [], 0
            for start, end, role in spans:
                parts.append(ctx.inline(raw[cursor:start]))
                parts.append(f'<span class="ct-prose-status-dot ct-prose-status-{role} deco" '
                             f'data-status="{role}" aria-hidden="true"></span>')
                parts.append(ctx.inline(raw[start:end]))
                cursor = end
            parts.append(ctx.inline(raw[cursor:]))
            return ''.join(parts)

    return StatusLegendContext()


def render_prose(block, ctx):
    spec = block.get("spec") or {}
    ctx = _prose_status_context(block, ctx)
    classes = "c-text c-text-prose"
    if spec.get("large") is True or spec.get("size") == "large":
        classes += " ct-prose-large"
    elif spec.get('size') in ('small', 'medium'):
        classes += ' ct-prose-' + spec['size']
    if spec.get("bold") is True or spec.get("weight") == "bold":
        classes += " ct-prose-bold"
    classes, content = _content(block, ctx, classes, prose=True)
    return f'<div class="{classes}" data-comp="prose">' + content + '</div>'

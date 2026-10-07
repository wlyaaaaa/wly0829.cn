"""文字块的四个基础组件，遵守 COMPONENTS-API v2。"""
from html import escape, unescape
from pathlib import Path
import re


# 只列确实消费的字段；族入口由根执行者登记，布局通用字段由引擎负责。
PRIMITIVE_SPEC_FIELDS = {
    'bullet_list': ['columns', 'columns_v', 'item_cards', 'icons', 'icon_indices', 'item_images', 'illustration',
                    'bare', 'size', 'align', 'item_layout', 'connector', 'item_icon_width'],
    'tag': ['tone', 'separator', 'tag_separator', 'columns', 'columns_v', 'status_dot', 'align',
            'bold_items', 'portrait_last_center', 'size', 'shape', 'placement', 'illustration', 'connector',
            'separator_layout'],
    'notice': ['tone', 'inline_button', 'primary', 'button_full_width', 'button_align',
               'button_placement', 'button_position', 'button_separate_line', 'link_style',
               'inline_links_as_buttons', 'icons', 'icon_indices', 'illustration', 'align',
               'whole_link', 'card_link', 'columns', 'columns_v', 'size', 'whole_block', 'split_cards',
               'variant', 'layout', 'button_outside', 'ruler', 'date_flag', 'connector'],
    'monospace': ['tone', 'align', 'size', 'columns', 'columns_v', 'container', 'illustration', 'connector', 'font_role'],
}
PROSE_IMAGE_FIELDS = {'icons', 'paragraph_images', 'icon_indices', 'illustration', 'icon_width_fraction'}
_LAYOUT_FIELDS = {'type', 'text_ref', 'row', 'row_v', 'width', 'frame', 'page_break_before', 'page_break_after'}
_STATUS = {'在用': 'on', '待验收': 'pending', '待实施': 'todo', '没用过': 'unused',
           '说不准': 'uncertain', '已停用': 'off'}


def _piece(lead, text, ctx):
    head = f'<strong>{ctx.inline(lead)}</strong>' if lead else ''
    return head + (' ' if head and text else '') + ctx.inline(text or '')


def node_html(node, ctx):
    """保全节点及其顺序；文字不经 HTML 拼接直接输出。"""
    kind = node.get('type')
    if kind in ('h1', 'h2', 'h3', 'group'):
        value = node.get('name', '') if kind == 'group' else node.get('text', '')
        return f'<div class="ct-heading tb">{ctx.inline(value)}</div>'
    if kind in ('para', 'card'):
        return f'<p class="ct-paragraph tb">{_piece(node.get("name"), node.get("text"), ctx)}</p>'
    if kind in ('bullets', 'steps', 'stats'):
        rows = []
        for item in node.get('items', []):
            content = _piece(item.get('lead', item.get('num')), item.get('text'), ctx)
            if kind == 'steps':
                if item.get('cols'):
                    content = ' '.join(ctx.inline(cell) for cell in item['cols'])
                content = ctx.inline(str(item.get('n', ''))) + ' ' + content
            rows.append(f'<li class="ct-item tb">{content}</li>')
        cls = 'ct-bullets' if kind == 'bullets' else 'ct-plain-list'
        return f'<ul class="{cls}">' + ''.join(rows) + '</ul>'
    if kind == 'code':
        value = '\n'.join(node.get('lines', []))
        return f'<pre class="ct-code tb">{ctx.inline(value)}</pre>'
    if kind == 'table':
        head = node.get('header') or []
        rows = ([head] if head else []) + (node.get('rows') or [])
        # 长表在狭窄容器里按行折行，表头不复制，G1 顺序保持。
        return '<div class="ct-table-lite">' + ''.join(
            '<div class="ct-table-lite-row">' + ''.join(
                f'<div class="ct-cell-lite tb">{ctx.inline(cell)}</div>' for cell in row
            ) + '</div>' for row in rows
        ) + '</div>'
    if kind == 'legend':
        return '<div class="ct-paragraph tb">' + ' '.join(
            ctx.inline((item.get('dot') or '') + ' ' + (item.get('text') or ''))
            for item in node.get('items', [])
        ) + '</div>'
    if kind in ('linkrow', 'now') and node.get('src'):
        return f'<div class="ct-paragraph tb">{ctx.inline(" ".join(node["src"]))}</div>'
    if kind == 'linkrow':
        return '<div class="ct-paragraph tb">' + ' '.join(
            ctx.inline('〔' + value + '〕') for value in node.get('links', [])
        ) + '</div>'
    if kind == 'now':
        return '<div class="ct-paragraph tb">' + ctx.inline(node.get('label', '')) + ' ' + ' '.join(
            ctx.inline('〔' + value + '〕') for value in node.get('links', [])
        ) + '</div>'
    if kind:
        ctx.warn(f'comp-text：未识别节点 {kind}，保留 src 原文。')
    return f'<p class="ct-paragraph tb">{ctx.inline("\n".join(node.get("src", [])))}</p>'


def _nodes(block, ctx):
    return ''.join(node_html(node, ctx) for node in block.get('nodes', []))


def _incomplete(ctx, message, kind='composition'):
    method = getattr(ctx, 'incomplete', None)
    if callable(method):
        method(message, kind)


def _problem(ctx, message, kind='composition'):
    ctx.warn(message)
    _incomplete(ctx, message, kind)


def _check_fields(block, ctx, kind):
    known = set(PRIMITIVE_SPEC_FIELDS[kind]) | _LAYOUT_FIELDS
    for field, value in block.get('spec', {}).items():
        if field not in known and value not in (None, 'none', 'auto', 'left', False):
            _problem(ctx, f'comp-text {kind}：不支持字段 {field}={value}，保留完整原文。')


def _flag(spec, field, ctx, kind):
    value = spec.get(field, False)
    if not isinstance(value, bool):
        _problem(ctx, f'comp-text {kind}：不支持 {field}={value}，保留原排法。')
        return False
    return value


def _explicit_columns(spec, ctx, default=1):
    key = 'columns_v' if ctx.orient == 'v' and 'columns_v' in spec else 'columns'
    valid = {}
    for field in ('columns', 'columns_v'):
        if field not in spec:
            continue
        value = spec[field]
        try:
            count = int(value)
            if isinstance(value, bool) or count < 1 or str(count) != str(value):
                raise ValueError
            valid[field] = count
        except (ValueError, TypeError):
            _problem(ctx, f'comp-text：不支持 {field}={value}，保留文字并采用 {default} 列。')
    return valid.get(key, default)


def _align(spec, ctx, kind):
    align = spec.get('align', 'left')
    if align not in ('left', 'center', 'right'):
        _problem(ctx, f'comp-text {kind}：不支持 align={align}，保留靠左。')
        return ''
    return '' if align == 'left' else f' ct-align-{align}'


def _size_class(spec, ctx, kind):
    if 'size' not in spec:
        return ''
    value = spec['size']
    if value not in ('small', 'medium', 'large'):
        _problem(ctx, f'comp-text {kind}：不支持 size={value}，保留共享正文档位。')
        return ''
    return f' ct-size-{value}'


def _neutral_fields(spec, ctx, kind, fields):
    for field in fields:
        if field in spec and spec[field] not in (None, 'none', False):
            _problem(ctx, f'comp-text {kind}：{field} 只支持 none，未执行 {spec[field]}，保留原字。')


def _columns(spec, ctx):
    try:
        n = int(spec.get('columns', 1))
    except (ValueError, TypeError):
        n = 1
    return 1 if ctx.orient == 'v' else max(1, min(n, 4))


def _list_images(spec, count, ctx, kind='bullet_list', file_field='item_images'):
    """按本块全部清单条目的原序接显式映射；缺项不画空图列。"""
    files = spec.get(file_field, spec.get('icons'))
    indices = spec.get('icon_indices')
    no_files = files is None or files is False or files == 'none'
    position = spec.get('illustration', 'left_inside')
    if position in (None, 'none'):
        if not no_files or indices is not None:
            _problem(ctx, f'comp-text {kind}：illustration=none 与逐项图标映射冲突，保留原文。')
        return None
    if position != 'left_inside':
        _problem(ctx, f'comp-text {kind}：illustration 只支持 left_inside/none，未执行 {position}，保留原文。')
        return None
    if no_files and indices is None:
        if 'illustration' in spec:
            _problem(ctx, f'comp-text {kind}：左图没有明确逐项文件或原槽位映射，交素材方；保留原文。', 'asset')
        return None
    if not isinstance(files, list) and not no_files and files != 'auto':
        _problem(ctx, f'comp-text {kind}：icons/{file_field} 应为明确文件列表，保留原文。')
        return None
    if file_field in spec and 'icons' in spec and spec['icons'] not in (None, False, 'none', 'auto') and spec[file_field] != spec['icons']:
        _problem(ctx, f'comp-text {kind}：{file_field} 与 icons 文件映射冲突，保留原文且不猜图。')
        return None
    if indices is not None and isinstance(files, list):
        _problem(ctx, f'comp-text {kind}：文件映射与 icon_indices 同时指定，保留原文且不猜图。')
        return None
    if indices is not None:
        if not isinstance(indices, list):
            _problem(ctx, f'comp-text {kind}：icon_indices 应为原槽位号列表，保留原文。')
            return None
        slots = getattr(ctx, 'slots', None)
        mapping = dict(slots('icon')) if callable(slots) else {}
        urls = []
        for index in indices:
            url = mapping.get(index) if isinstance(index, int) and not isinstance(index, bool) else None
            if not url:
                _problem(ctx, f'comp-text {kind}：缺少指定图标槽位 {index}，该条保留原文，交素材方补映射。', 'asset')
            urls.append(url)
    elif isinstance(files, list):
        urls = []
        for source in files:
            resolver = getattr(ctx, 'resolve', None)
            path = resolver(source) if isinstance(source, str) and source and callable(resolver) else source
            if isinstance(path, str) and path and Path(path).is_file():
                urls.append(ctx.asset_url(path))
            else:
                _problem(ctx, f'comp-text {kind}：缺少指定逐项图标 {source}，该条保留原文，交素材方补素材。', 'asset')
                urls.append(None)
    else:
        missing_kind = 'asset' if files == 'auto' else 'composition'
        _problem(ctx, f'comp-text {kind}：逐项图标需要 icons/{file_field} 文件列表或 icon_indices 原槽位映射；不自动猜图，交素材方。', missing_kind)
        return None
    if len(urls) > count:
        _problem(ctx, f'comp-text {kind}：逐项图标映射多于原条目，多余素材未消费。')
    for index in range(len(urls), count):
        _problem(ctx, f'comp-text {kind}：第 {index + 1} 条缺少明确图标映射，该条保留原文，交素材方。', 'asset')
    return urls[:count] + [None] * max(0, count - len(urls))


def _list_node(node, ctx, urls, offset=0):
    if urls is None or node.get('type') not in ('bullets', 'steps', 'stats'):
        return node_html(node, ctx)
    parts = []
    for index, item in enumerate(node.get('items', [])):
        single = dict(node, items=[item], src=node.get('src', [])[index:index + 1])
        rendered = node_html(single, ctx)
        url = urls[offset + index]
        if url:
            # 文字仍由 node_html/ctx.inline 生成，只给原 li 加左图和文字容器。
            rendered = rendered.replace('<li class="ct-item tb">',
                                        '<li class="ct-item ct-item-with-icon"><img class="ct-list-icon" src="'
                                        + escape(url, quote=True) + '" alt=""><span class="ct-list-copy tb">', 1)
            rendered = rendered.replace('</li>', '</span></li>', 1)
        parts.append(re.sub(r'^<ul[^>]*>|</ul>$', '', rendered))
    cls = 'ct-bullets' if node.get('type') == 'bullets' else 'ct-plain-list'
    return f'<ul class="{cls}">' + ''.join(parts) + '</ul>'


def render_bullet_list(block, ctx):
    spec = block.get('spec', {})
    _check_fields(block, ctx, 'bullet_list')
    cards = _flag(spec, 'item_cards', ctx, 'bullet_list')
    layout = spec.get('item_layout')
    if layout not in (None, 'none', 'individual_cards'):
        _problem(ctx, f'comp-text bullet_list：不支持 item_layout={layout}，保留原清单。')
    elif layout == 'individual_cards':
        if 'item_cards' in spec and spec['item_cards'] is not True:
            _problem(ctx, 'comp-text bullet_list：item_layout 与 item_cards 冲突，保留原清单。')
            cards = False
        else:
            cards = True
    bare = _flag(spec, 'bare', ctx, 'bullet_list')
    classes = _size_class(spec, ctx, 'bullet_list') + _align(spec, ctx, 'bullet_list')
    icon_width = spec.get('item_icon_width')
    if icon_width == 'card':
        classes += ' ct-list-icon-card'
    elif icon_width not in (None, 'default'):
        _problem(ctx, f'comp-text bullet_list：不支持 item_icon_width={icon_width}，保留默认图标尺寸与原映射。')
    if bare:
        classes += ' ct-list-bare'
    _neutral_fields(spec, ctx, 'bullet_list', ('connector',))
    nodes = block.get('nodes', [])
    count = sum(len(node.get('items', [])) for node in nodes if node.get('type') in ('bullets', 'steps', 'stats'))
    urls = _list_images(spec, count, ctx)
    offset = 0
    if cards:
        cols = _explicit_columns(spec, ctx, 1) if ctx.orient == 'h' or 'columns_v' in spec else 1
        parts = []
        for node in nodes:
            if node.get('type') in ('bullets', 'steps', 'stats'):
                for i, item in enumerate(node.get('items', [])):
                    single = dict(node, items=[item], src=node.get('src', [])[i:i + 1])
                    parts.append('<div class="ct-list-card card">' + _list_node(single, ctx, urls, offset + i) + '</div>')
                offset += len(node.get('items', []))
            else:
                parts.append('<div class="ct-list-rest">' + node_html(node, ctx) + '</div>')
        ctx.warn('comp-text bullet_list：逐条小卡外观待本人批准样张。')
        return f'<div class="c-text c-text-bullets ct-list-cards{classes}" data-comp="bullet_list" style="--ct-columns:{cols}">' + ''.join(parts) + '</div>'
    # 没有 item_cards 的普通清单沿用现有默认 HTML 与竖版单列。
    cols = _explicit_columns(spec, ctx) if ctx.orient == 'h' or 'columns_v' in spec else _columns(spec, ctx)
    if ctx.orient == 'v' and 'columns' in spec:
        _explicit_columns(spec, ctx)
    parts = []
    for node in nodes:
        parts.append(_list_node(node, ctx, urls, offset))
        if node.get('type') in ('bullets', 'steps', 'stats'):
            offset += len(node.get('items', []))
    return f'<div class="c-text c-text-bullets{classes}" data-comp="bullet_list" style="--ct-columns:{cols}">' + ''.join(parts) + '</div>'


def _tag_parts(text, separator):
    """只拆标记外的分隔符；链接名、按钮名、粗体、代码里的同字不拆。"""
    if not separator:
        return [(text, '')]
    marked = r'(〔[^〔〕]*〕|【[^【】]*】|［[^［］]*］|\*\*.*?\*\*|`[^`]*`)'
    pieces, current = [], ''
    for index, chunk in enumerate(re.split(marked, text)):
        if index % 2:
            current += chunk
            continue
        fragments = chunk.split(separator)
        current += fragments[0]
        for fragment in fragments[1:]:
            pieces.append((current, separator))
            current = fragment
    pieces.append((current, ''))
    return pieces


def _bold_tag_parts(text):
    """只提取标记外的粗体；其它片段原样保留，链接与代码不切开。"""
    marked = re.compile(r'〔[^〔〕]*〕|【[^【】]*】|［[^［］]*］|`[^`]*`|\*\*.+?\*\*', re.S)
    pieces, start = [], 0
    for match in marked.finditer(text):
        if not match.group(0).startswith('**'):
            continue
        if start < match.start():
            pieces.append((text[start:match.start()], False))
        pieces.append((match.group(0), True))
        start = match.end()
    if start < len(text):
        pieces.append((text[start:], False))
    return pieces


def _center_tag_last_rows(tags, columns):
    """每个连续标签组各自居中末行；半列网格保留原列宽和 DOM 字序。"""
    group = []

    def finish():
        remainder = len(group) % columns
        if remainder:
            index = group[-remainder]
            start = columns - remainder + 1
            tags[index] = tags[index].replace('<span ', f'<span style="grid-column:{start} / span 2" ', 1)
        group.clear()

    for index, part in enumerate(tags):
        if re.match(r'<span class="(?:ct-tag-unit|ct-tag(?:\s[^\"]*)?)"', part):
            group.append(index)
        else:
            finish()
    finish()
    return tags


def render_tag(block, ctx):
    spec = block.get('spec', {})
    _check_fields(block, ctx, 'tag')
    requested = spec.get('tone', 'green')
    tone = 'gray' if requested == 'muted' else requested
    if tone not in ('green', 'gray'):
        _problem(ctx, f'comp-text tag：不支持 tone={requested}，保留完整原字并采用绿色。')
        tone = 'green'
    separator = spec.get('tag_separator', spec.get('separator'))
    if separator is not None and (not isinstance(separator, str) or not separator):
        _problem(ctx, f'comp-text tag：不支持 separator={separator}，保留原段。')
        separator = None
    if 'separator' in spec and 'tag_separator' in spec and spec['separator'] != spec['tag_separator']:
        _problem(ctx, 'comp-text tag：separator 与 tag_separator 冲突，保留原段。')
        separator = None
    separator_layout = spec.get('separator_layout')
    if separator_layout not in (None, 'attached_previous', 'attached_next'):
        _problem(ctx, f'comp-text tag：不支持 separator_layout={separator_layout}，保留原分隔字与默认排法。')
        separator_layout = None
    attached_next = separator_layout == 'attached_next'
    if attached_next and not separator:
        _problem(ctx, 'comp-text tag：separator_layout=attached_next 需要明确原 separator/tag_separator，保留原段。')
        attached_next = False
    dot = spec.get('status_dot', False)
    if not (isinstance(dot, bool) or isinstance(dot, str) and dot in _STATUS.values()):
        _problem(ctx, f'comp-text tag：不支持 status_dot={dot}，保留文字标签。')
        dot = False
    bold_items = _flag(spec, 'bold_items', ctx, 'tag')
    portrait_center = _flag(spec, 'portrait_last_center', ctx, 'tag')
    if bold_items and (separator or dot):
        _problem(ctx, 'comp-text tag：bold_items 与分隔符/status_dot 同时指定，保留原段标签。')
        bold_items = False
        separator, dot = None, False
    nodes = block.get('nodes', [])
    tags = []

    def append(text, lead=None):
        raw = ('**' + lead + '**' + (' ' if text else '') if lead else '') + (text or '')
        pieces = _tag_parts(raw, separator)
        bind_next = attached_next
        if bind_next and any(not fragment.strip() for fragment, _ in pieces):
            _problem(ctx, 'comp-text tag：原分隔字前后缺少完整标签，attached_next 未执行，保留完整原段。')
            pieces, bind_next = [(raw, '')], False
        previous = ''
        for fragment, punctuation in pieces:
            state = _STATUS.get(fragment.strip()) if dot is True else dot
            if dot is True and not state:
                _problem(ctx, f'comp-text tag：status_dot 对应不到状态词“{fragment}”，保留原字。')
            cls = 'ct-tag ct-status-tag tb' if state else 'ct-tag tb'
            marker = f'<span class="ct-status-dot ct-dot-{state}" aria-hidden="true"></span>' if state else ''
            tag = f'<span class="{cls}">' + marker + ctx.inline(fragment) + '</span>'
            if separator:
                if bind_next:
                    prefix = f'<span class="ct-tag-separator tb">{ctx.inline(previous)}</span>' if previous else ''
                    tag = '<span class="ct-tag-unit">' + prefix + tag + '</span>'
                    previous = punctuation
                else:
                    tail = f'<span class="ct-tag-separator tb">{ctx.inline(punctuation)}</span>' if punctuation else ''
                    tag = '<span class="ct-tag-unit">' + tag + tail + '</span>'
            tags.append(tag)

    for node in nodes:
        kind = node.get('type')
        if bold_items and kind == 'para':
            pieces = _bold_tag_parts(node.get('text', ''))
            if not any(is_bold for _, is_bold in pieces):
                _problem(ctx, 'comp-text tag：bold_items 找不到段落中标记外的粗体词，保留原段标签。')
                tags.append('<span class="ct-tag tb">' + ctx.inline(node.get('text', '')) + '</span>')
            else:
                units = []
                for fragment, is_bold in pieces:
                    if is_bold:
                        units.append(['<span class="ct-tag tb">' + ctx.inline(fragment) + '</span>'])
                    elif units:
                        units[-1].append('<span class="ct-tag-copy tb">' + ctx.inline(fragment) + '</span>')
                    else:
                        tags.append('<span class="ct-tag-copy ct-tag-prefix tb">' + ctx.inline(fragment) + '</span>')
                tags.extend('<span class="ct-tag-unit">' + ''.join(unit) + '</span>' for unit in units)
            continue
        if bold_items:
            _problem(ctx, f'comp-text tag：bold_items 只拆普通段落的粗体词，{kind} 节点保留原排法。')
        if kind == 'bullets':
            for item in node.get('items', []):
                if separator or dot:
                    append(item.get('text'), item.get('lead'))
                else:
                    tags.append(f'<span class="ct-tag tb">{_piece(item.get("lead"), item.get("text"), ctx)}</span>')
        elif kind in ('para', 'card', 'group', 'h1', 'h2', 'h3'):
            if separator or dot:
                append(node.get('name') if kind == 'group' else node.get('text', ''), node.get('name') if kind == 'card' else None)
            else:
                value = _piece(node.get('name'), node.get('text'), ctx) if kind == 'card' else ctx.inline(node.get('name') if kind == 'group' else node.get('text', ''))
                tags.append(f'<span class="ct-tag tb">{value}</span>')
        else:
            tags.append('<div class="ct-tag-rest">' + node_html(node, ctx) + '</div>')
    classes = _align(spec, ctx, 'tag') + _size_class(spec, ctx, 'tag')
    if attached_next:
        classes += ' ct-tag-attached-next'
    _neutral_fields(spec, ctx, 'tag', ('illustration', 'connector'))
    shape = spec.get('shape')
    if shape == 'rounded_strip':
        classes += ' ct-tag-rounded-strip'
        ctx.warn('comp-text tag：整宽圆角长条外观待本人看组件样张。')
    elif shape not in (None, 'none'):
        _problem(ctx, f'comp-text tag：不支持 shape={shape}，保留原胶囊。')
    if 'placement' in spec and spec['placement'] not in (None, 'none'):
        _problem(ctx, f'comp-text tag：placement={spec["placement"]} 需要标题与标签的跨组件行布局，当前组件无法指定相邻标题，保留原字。')
    attrs = ''
    if 'columns' in spec or ctx.orient == 'v' and 'columns_v' in spec:
        columns = _explicit_columns(spec, ctx)
        classes += ' ct-tag-grid'
        grid_style = f'--ct-tag-columns:{columns}'
        if ctx.orient == 'v' and portrait_center:
            classes += ' ct-tag-last-center'
            grid_style += f';--ct-tag-grid-columns:{columns * 2}'
            tags = _center_tag_last_rows(tags, columns)
        attrs += f' style="{grid_style}"'
    elif ctx.orient == 'v' and portrait_center:
        _problem(ctx, 'comp-text tag：portrait_last_center 需要明确 columns/columns_v，保留默认排法。')
    if tone == 'gray':
        attrs += ' data-tone="gray"'
        ctx.warn('comp-text tag：灰绿标签外观待本人批准样张。')
    if dot:
        ctx.warn('comp-text tag：状态点加原词待本人看样张；只画圆点须本人批准，当前原字可见。')
    if bold_items:
        ctx.warn('comp-text tag：段内粗体词拆标签、原前缀与标点留在标签外，待本人看组件样张。')
    if ctx.orient == 'v' and portrait_center:
        ctx.warn('comp-text tag：竖版末行标签居中外观待本人看组件样张。')
    return f'<div class="c-text c-text-tags{classes}" data-comp="tag"{attrs}>' + ''.join(tags) + '</div>'


def _notice_button_nodes(block, ctx, requested, spec=None):
    """只提升 ctx.inline 生成的原链接；原节点和热区属性均保留。"""
    parts = [node_html(node, ctx) for node in block.get('nodes', [])]
    links = [
        (index, match)
        for index, part in enumerate(parts)
        for match in re.finditer(r'<a\b[^>]*\bdata-hot="link"[^>]*>([^<]*)</a>', part)
    ]
    if requested is True:
        selected = links[-1] if links else None
    elif isinstance(requested, str):
        label = requested.strip()
        if label.startswith('〔') and label.endswith('〕'):
            label = label[1:-1]
        selected = next((link for link in links if unescape(link[1].group(1)) == label), None)
    else:
        selected = None
    if selected is None:
        message = 'comp-text notice：inline_button 找不到对应的原链接，保留原文。'
        ctx.warn(message)
        _incomplete(ctx, message)
        return ''.join(parts)

    index, link = selected
    part = parts[index]
    paragraph = re.fullmatch(r'<(p|div) class="ct-paragraph tb">(.*)</\1>', part, re.S)
    tail = paragraph and not part[link.end():paragraph.end(2)].strip()
    if requested is True and (index != len(parts) - 1 or not tail):
        message = 'comp-text notice：inline_button=true 没有段尾链接，保留原文。'
        ctx.warn(message)
        _incomplete(ctx, message)
        return ''.join(parts)

    button = re.sub(r'\bclass="([^"]*)"',
                    lambda match: 'class="' + match.group(1) + ' ct-notice-button tb"',
                    link.group(0), count=1)
    options = spec or {}
    if options.get('primary') is True:
        button = button.replace(' ct-notice-button tb', ' ct-notice-button ct-notice-button-primary tb')
    if tail:
        prefix = part[paragraph.start(2):link.start()]
        copy = (f'<div class="ct-notice-copy"><{paragraph.group(1)} class="ct-paragraph tb">'
                + prefix + f'</{paragraph.group(1)}></div>') if prefix.strip() else ''
        orient = 'v' if ctx.orient == 'v' else 'h'
        classes = ''
        placement = options.get('button_placement', options.get('button_position'))
        if placement in ('below', 'below_center') or options.get('button_separate_line') is True:
            classes += ' ct-notice-below'
        align = options.get('button_align', 'center' if placement == 'below_center' else None)
        if align:
            classes += f' ct-notice-button-{align}'
        if orient == 'v' and options.get('button_full_width') is True:
            classes += ' ct-notice-button-full'
        parts[index] = f'<div class="ct-notice-action-row ct-notice-{orient}{classes}">' + copy + button + '</div>'
    else:
        # 字串可以定位其它原链接；不能拆开的节点留在原位置，避免改变文字顺序。
        parts[index] = part[:link.start()] + button.replace(' tb"', '"') + part[link.end():]
        ctx.warn('comp-text notice：指定链接不在普通段尾，原位置采用按钮样式，保留节点顺序。')
        if any(field in options for field in ('button_align', 'button_placement', 'button_position')) or any(options.get(field) for field in ('button_full_width', 'button_separate_line')):
            _problem(ctx, 'comp-text notice：指定链接不在普通段尾，按钮位置字段未执行，保留原位置。')
    return ''.join(parts)


def _notice_figures(spec, ctx):
    """仅使用指定文件或指定原图槽位，不把整屏图标猜成此横条的图。"""
    icons, indices, position = spec.get('icons'), spec.get('icon_indices'), spec.get('illustration', 'none')
    if not (isinstance(icons, list) or icons in (None, False, 'none', 'auto')):
        _problem(ctx, f'comp-text notice：不支持 icons={icons}，保留原字且不猜图标。')
        return '', ''
    if indices is not None and not isinstance(indices, list):
        _problem(ctx, f'comp-text notice：不支持 icon_indices={indices}，保留原字且不猜槽位。')
        return '', ''
    if icons in (None, 'none', False) and indices is None and position in (None, 'none'):
        return '', ''
    if position not in ('left_inside', 'right_inside', 'top_inside', 'bottom_inside', 'bottom_right_inside'):
        _problem(ctx, f'comp-text notice：不支持或未明确 illustration={position}，保留原字。')
        return '', ''
    urls = []
    if isinstance(icons, list):
        for source in icons:
            if not isinstance(source, str) or not source:
                _problem(ctx, f'comp-text notice：图标文件映射无效 {source}，该位留空。', 'asset')
                urls.append(None)
                continue
            resolver = getattr(ctx, 'resolve', None)
            path = resolver(source) if callable(resolver) else source
            if Path(path).is_file():
                urls.append(ctx.asset_url(path))
            else:
                _problem(ctx, f'comp-text notice：缺少指定图标 {source}，该位留空。', 'asset')
                urls.append(None)
    elif isinstance(indices, list) and indices:
        slots = getattr(ctx, 'slots', None)
        mapping = dict(slots('icon')) if callable(slots) else {}
        for ordinal in indices:
            url = mapping.get(ordinal) if isinstance(ordinal, int) and not isinstance(ordinal, bool) else None
            if not url:
                _problem(ctx, f'comp-text notice：缺少图标槽位 {ordinal}，该位留空。', 'asset')
            urls.append(url)
    else:
        _problem(ctx, 'comp-text notice：图标没有本块明确文件或槽位映射，缺图交素材方，保留原字。', 'asset')
        return '', ''
    if not urls:
        _problem(ctx, 'comp-text notice：缺少本块指定图标，该位留空交素材方。', 'asset')
        return '', ''
    images = ''.join(f'<img class="ct-notice-icon" src="{escape(url, quote=True)}" alt="">' if url else '<span class="ct-notice-icon-slot" aria-hidden="true"></span>' for url in urls)
    return '<div class="ct-notice-figures">' + images + '</div>', ' ct-notice-' + position.replace('_inside', '')


def _notice_whole_link(content, spec, ctx):
    """把唯一原链接的热区搬到整条容器；链接文字与按钮外观留在原位。"""
    requested = spec.get('whole_link', spec.get('card_link'))
    if 'whole_link' in spec and 'card_link' in spec and spec['whole_link'] != spec['card_link']:
        _problem(ctx, 'comp-text notice：whole_link 与 card_link 冲突，保留原链接热区。')
        return content, ''
    if requested is None or requested is False:
        return content, ''
    if not (requested is True or isinstance(requested, str) and requested.strip()):
        _problem(ctx, 'comp-text notice：whole_link/card_link 应为 true 或唯一原链接文字，保留原链接热区。')
        return content, ''
    anchors = list(re.finditer(r'<a\b([^>]*)>(.*?)</a>', content, re.S))
    if len(anchors) != 1 or not re.search(r'\bdata-hot="link"', anchors[0].group(1)):
        _problem(ctx, 'comp-text notice：整条点击要求本条恰有一个原链接、没有其它按钮或链接；保留原热区。')
        return content, ''
    link = anchors[0]
    label = unescape(re.sub(r'<[^>]*>', '', link.group(2)))
    requested_label = requested.strip().removeprefix('〔').removesuffix('〕') if isinstance(requested, str) else label
    if requested_label != label:
        _problem(ctx, 'comp-text notice：whole_link/card_link 找不到指定的唯一原链接文字，保留原热区。')
        return content, ''
    target = re.search(r'\bdata-href="([^"]*)"', link.group(1))
    if target is None or not target.group(1):
        _problem(ctx, 'comp-text notice：唯一原链接缺少目标，整条点击未执行。')
        return content, ''
    # 原文字不再被另一个 a 包围；热区目标直接搬运 ctx.inline 的已转义属性。
    attrs = re.sub(r'\s*data-(?:hot|href)="[^"]*"', '', link.group(1))
    replacement = '<span' + attrs + '>' + link.group(2) + '</span>'
    content = content[:link.start()] + replacement + content[link.end():]
    return content, ' data-hot="link" data-href="' + target.group(1) + '"'


def _notice_groups(nodes):
    """只沿原标题与卡片边界分组，不把普通段落按字或句拆牌。"""
    groups, current = [], []
    for node in nodes:
        if node.get('type') in ('group', 'h1', 'h2', 'h3', 'card') and current:
            groups.append(current)
            current = []
        current.append(node)
    if current:
        groups.append(current)
    return groups


def _notice_implicit_button(block, ctx):
    """布局字段可选中唯一原段尾链接；多链接时不凭位置猜。"""
    parts = [node_html(node, ctx) for node in block.get('nodes', [])]
    links = [(i, m) for i, part in enumerate(parts)
             for m in re.finditer(r'<a\b[^>]*\bdata-hot="link"[^>]*>([^<]*)</a>', part)]
    if len(links) != 1:
        _problem(ctx, 'comp-text notice：按钮布局需要唯一原段尾链接，当前无法确定目标，保留原文。')
        return None
    index, link = links[0]
    paragraph = re.fullmatch(r'<(p|div) class="ct-paragraph tb">(.*)</\1>', parts[index], re.S)
    if index != len(parts) - 1 or not paragraph or parts[index][link.end():paragraph.end(2)].strip():
        _problem(ctx, 'comp-text notice：唯一原链接不在最后普通段尾，按钮布局未执行，保留原文。')
        return None
    return unescape(link.group(1))


def _notice_composed_nodes(block, ctx, requested, options):
    """单横幅三角色或纵向标题正文；外置按钮只搬原热区一次。"""
    parts = [node_html(node, ctx) for node in block.get('nodes', [])]
    links = [(i, m) for i, part in enumerate(parts)
             for m in re.finditer(r'<a\b[^>]*\bdata-hot="link"[^>]*>([^<]*)</a>', part)]
    label = requested.strip().removeprefix('〔').removesuffix('〕') if isinstance(requested, str) else None
    selected = links[-1] if requested is True and links else next(
        (link for link in links if unescape(link[1].group(1)) == label), None)
    if selected is None:
        _problem(ctx, 'comp-text notice：标题正文按钮布局找不到对应原链接，保留原文。')
        return ''.join(parts), ''
    index, link = selected
    paragraph = re.fullmatch(r'<(p|div) class="ct-paragraph tb">(.*)</\1>', parts[index], re.S)
    if index != len(parts) - 1 or not paragraph or parts[index][link.end():paragraph.end(2)].strip():
        _problem(ctx, 'comp-text notice：标题正文按钮布局需要最后普通段尾的原链接，保留原节点顺序。')
        return ''.join(parts), ''
    button = re.sub(r'\bclass="([^"]*)"', lambda m: 'class="' + m.group(1) + ' ct-notice-button tb"', link.group(0), count=1)
    if options['primary']:
        button = button.replace(' ct-notice-button tb', ' ct-notice-button ct-notice-button-primary tb')
    prefix = parts[index][paragraph.start(2):link.start()]
    parts[index] = f'<{paragraph.group(1)} class="ct-paragraph tb">' + prefix + f'</{paragraph.group(1)}>' if prefix.strip() else ''
    layout = options.get('layout')
    title = ''
    if layout:
        nodes = block.get('nodes', [])
        if len(parts) < 2 or index == 0 or nodes[0].get('type') not in ('h1', 'h2', 'h3', 'group', 'para', 'card'):
            _problem(ctx, 'comp-text notice：layout 缺少独立原标题节点，保留原文和原链接。')
            return _nodes(block, ctx), ''
        original_title = parts.pop(0)
        renderer = getattr(ctx, 'render', None)
        title_node = nodes[0]
        title_text = title_node.get('name') if title_node.get('type') == 'group' else title_node.get('text', '')
        if callable(renderer) and title_node.get('type') != 'card' and not re.search(r'〔|【|［|\*\*|`', title_text):
            original_title = renderer({'type': 'chapter_title', 'nodes': [title_node],
                                       'spec': {'size': options.get('size', 'medium'), 'align': 'left'}})
        title = '<div class="ct-notice-title">' + original_title + '</div>'
    mode = 'inline' if layout == 'inline_title_prose_button' else 'stack'
    copy = '<div class="ct-notice-copy">' + ''.join(parts) + '</div>'
    classes = f'ct-notice-layout ct-notice-layout-{mode}'
    align = options.get('button_align', 'right' if mode == 'inline' else 'center')
    classes += f' ct-notice-button-{align}'
    if options['button_full_width']:
        classes += ' ct-notice-button-full'
    outside = options['button_outside']
    content = f'<div class="{classes}">' + title + copy + ('' if outside else button) + '</div>'
    return content, button if outside else ''


def _render_notice_single(block, ctx):
    spec = block.get('spec', {})
    requested = spec.get('tone', 'green')
    tone = requested if requested in ('green', 'yellow', 'gray') else 'green'
    # 黄/灰使用主工程师共享变量，先进入组件样张，仍待本人确认外观。
    if requested not in ('green', 'yellow', 'gray'):
        message = f'comp-text notice：不支持 tone={requested}，保留完整文字并采用绿色。'
        ctx.warn(message)
        _incomplete(ctx, message)
    button = spec.get('inline_button')
    if not (button is None or isinstance(button, bool) or isinstance(button, str) and button.strip()):
        _problem(ctx, f'comp-text notice：不支持 inline_button={button}，保留完整原文。')
        button = False
    options = dict(spec)
    for field in ('primary', 'button_full_width', 'button_separate_line', 'inline_links_as_buttons',
                  'button_outside', 'ruler', 'date_flag'):
        options[field] = _flag(spec, field, ctx, 'notice')
    for field, choices in (('button_align', ('left', 'center', 'right')),
                           ('button_placement', ('right', 'below', 'below_center', 'auto')),
                           ('button_position', ('right', 'below', 'auto')),
                           ('link_style', ('link', 'button')),
                           ('layout', ('inline_title_prose_button', 'stack_title_prose_button')),
                           ('variant', ('source_note', 'green_card'))):
        if field in spec and spec[field] not in choices:
            _problem(ctx, f'comp-text notice：不支持 {field}={spec[field]}，保留原位置。')
            options.pop(field, None)
    _neutral_fields(spec, ctx, 'notice', ('connector',))
    all_buttons = options.get('link_style') == 'button' or options['inline_links_as_buttons']
    target_fields = ('button_align', 'button_placement', 'button_position', 'layout')
    if button is None and (any(field in options for field in target_fields) or any(
            options[field] for field in ('button_full_width', 'button_separate_line', 'button_outside')) or
            options['primary'] and not all_buttons):
        button = _notice_implicit_button(block, ctx)
    outside_button = ''
    if options.get('layout') or options['button_outside']:
        content, outside_button = _notice_composed_nodes(block, ctx, button, options)
    else:
        content = _notice_button_nodes(block, ctx, button, options) if button else _nodes(block, ctx)
    if all_buttons:
        def promote(match):
            opening = match.group(0)
            if 'ct-notice-button' in opening:
                return opening
            extra = ' ct-notice-button' + (' ct-notice-button-primary' if options['primary'] else '')
            return re.sub(r'class="([^"]*)"', lambda cls: 'class="' + cls.group(1) + extra + '"', opening, count=1)
        content = re.sub(r'<a\b[^>]*\bdata-hot="link"[^>]*>', promote, content)
    if any(options[k] for k in ('primary', 'button_full_width', 'button_separate_line')) or any(k in spec for k in ('button_align', 'button_placement', 'button_position')):
        if not button and not all_buttons:
            _problem(ctx, 'comp-text notice：按钮字段没有 inline_button 或 link_style=button 对应目标，保留原文。')
        if options.get('button_placement', options.get('button_position')) == 'right' and ctx.orient == 'v' and button:
            # 明确同行优先于手机默认另行；字仍可在各自栏内换行。
            content = content.replace('ct-notice-v', 'ct-notice-h')
        if not button and (options['button_full_width'] or options['button_separate_line'] or any(k in spec for k in ('button_align', 'button_placement', 'button_position'))):
            _problem(ctx, 'comp-text notice：段尾按钮布局需要 inline_button，原位置链接按钮的布局字段未执行。')
    if options['date_flag']:
        nodes = block.get('nodes', [])
        if button or len(nodes) != 1 or nodes[0].get('type') != 'card' or not nodes[0].get('name'):
            _problem(ctx, 'comp-text notice：date_flag 需要一个有原名称的独立卡片节点，当前旗标未执行，保留原文。')
        else:
            node = nodes[0]
            content = '<div class="ct-notice-date-row"><div class="ct-notice-date-name tb">' + ctx.inline(node['name']) + '</div><div class="ct-notice-copy"><p class="ct-paragraph tb">' + ctx.inline(node.get('text', '')) + '</p></div></div>'
    if options['ruler']:
        content = '<div class="ct-notice-ruler" aria-hidden="true"></div>' + content
    columns = spec.get('_notice_columns')
    if columns is not None:
        # 同一原标题统领的清单仍在一张卡里；原条目各占一格，不切段落。
        content = re.sub(r'<ul class="(ct-bullets|ct-plain-list)">',
                         lambda m: f'<ul class="{m.group(1)} ct-notice-items" style="--ct-notice-columns:{columns}">', content)
    figures, figure_class = _notice_figures(spec, ctx)
    classes = _align(spec, ctx, 'notice') + figure_class + _size_class(spec, ctx, 'notice')
    variant = options.get('variant')
    if variant:
        classes += ' ct-notice-' + variant.replace('_', '-')
    if variant == 'green_card' and tone != 'green':
        _problem(ctx, 'comp-text notice：green_card 与非绿色 tone 冲突，保留明确底色。')
    if options['date_flag']:
        classes += ' ct-notice-date-flag'
    if figures:
        content = figures + '<div class="ct-notice-text">' + content + '</div>'
    if requested in ('yellow', 'gray') or options['primary'] or all_buttons:
        ctx.warn('comp-text notice：新提示底色或按钮外观待本人批准样张。')
    if options.get('layout') or options['button_outside'] or options['ruler'] or options['date_flag'] or variant:
        ctx.warn('comp-text notice：新增通知排列、变体或无字装饰待本人看组件样张。')
    if outside_button and (spec.get('whole_link') or spec.get('card_link')):
        _problem(ctx, 'comp-text notice：button_outside 与整条点击冲突，保留外置原按钮热区。')
        whole_hot = ''
    else:
        content, whole_hot = _notice_whole_link(content, spec, ctx)
    tag = 'a' if whole_hot else 'aside'
    if whole_hot:
        classes += ' ct-notice-whole-link'
    card_class = '' if variant == 'source_note' else ' card'
    result = f'<{tag} class="c-text c-text-notice{card_class}{classes}" data-comp="notice" data-tone="{escape(str(tone), quote=True)}"{whole_hot}>' + content + f'</{tag}>'
    if outside_button:
        align = options.get('button_align', 'center')
        full = ' ct-notice-button-full' if options['button_full_width'] else ''
        result = f'<div class="c-text ct-notice-shell{_size_class(spec, ctx, "notice")}" data-comp="notice">' + result + f'<div class="ct-notice-outside-action ct-notice-button-{align}{full}">' + outside_button + '</div></div>'
    return result


def render_notice(block, ctx):
    spec = block.get('spec', {})
    _check_fields(block, ctx, 'notice')
    whole = _flag(spec, 'whole_block', ctx, 'notice')
    split = _flag(spec, 'split_cards', ctx, 'notice') if 'split_cards' in spec else None
    if whole and split:
        _problem(ctx, 'comp-text notice：whole_block 与 split_cards 冲突，保留整块外卡。')
        split = False
    explicit = 'columns' in spec or 'columns_v' in spec
    columns = _explicit_columns(spec, ctx) if explicit else 1
    if ctx.orient == 'v' and 'columns_v' not in spec:
        columns = 1
    layout = spec.get('layout')
    if layout in ('inline_title_prose_button', 'stack_title_prose_button'):
        target_columns = 3 if layout == 'inline_title_prose_button' else 1
        if explicit and columns != target_columns:
            _problem(ctx, f'comp-text notice：layout={layout} 与 columns={columns} 冲突，采用明确标题正文按钮布局。')
    groups = _notice_groups(block.get('nodes', [])) if (explicit or split) and not whole and split is not False and not spec.get('layout') else [block.get('nodes', [])]
    if len(groups) > 1:
        if spec.get('icons') not in (None, False, 'none') or spec.get('icon_indices') is not None:
            _problem(ctx, 'comp-text notice：多通知卡没有逐卡图标映射合同，保留整块与原素材映射。')
            groups = [block.get('nodes', [])]
        else:
            rendered = [_render_notice_single(dict(block, nodes=nodes, spec=dict(spec, _notice_columns=1)), ctx) for nodes in groups]
            return f'<div class="c-text ct-notice-grid" data-comp="notice" style="--ct-notice-columns:{columns}">' + ''.join(rendered) + '</div>'
    if columns > 1 and explicit and not layout and not whole and split is not False and not any(
            node.get('type') in ('bullets', 'steps', 'stats') for node in block.get('nodes', [])):
        rendered = _render_notice_single(block, ctx)
        return f'<div class="c-text ct-notice-grid" data-comp="notice" style="--ct-notice-columns:{columns}">' + rendered + '</div>'
    options = dict(spec)
    if explicit and not spec.get('layout') and not whole:
        options['_notice_columns'] = columns
    return _render_notice_single(dict(block, spec=options), ctx)


def render_monospace(block, ctx):
    spec = block.get('spec', {})
    _check_fields(block, ctx, 'monospace')
    tone = spec.get('tone', 'green')
    if tone not in ('green', 'gray', 'muted'):
        _problem(ctx, f'comp-text monospace：不支持 tone={tone}，保留原字与原绿色容器。')
        tone = 'green'
    # 常规命令沿共享正文尺度；只有明确选择的报告角色保留旧报告倍率。
    font_role = spec.get('font_role')
    report_role = font_role == 'monospace'
    if font_role not in (None, '', 'default', 'monospace'):
        _problem(ctx, f'comp-text monospace：不支持 font_role={font_role}，保留原字并采用共享正文角色。')
    classes = _align(spec, ctx, 'monospace') + _size_class(spec, ctx, 'monospace')
    if report_role:
        classes += ' ct-monospace-report'
    _neutral_fields(spec, ctx, 'monospace', ('illustration', 'connector'))
    if spec.get('container') not in (None, 'none') and spec.get('frame') != spec['container']:
        _problem(ctx, f'comp-text monospace：container={spec["container"]} 要与相邻组件共享 frame，当前未接跨块外框，保留原命令条。')
    attrs = ' data-role="monospace-report"' if report_role else ' data-role="monospace-body"'
    if tone in ('gray', 'muted'):
        classes += ' card'
        attrs += ' data-tone="gray"'
        ctx.warn('comp-text monospace：灰报告卡外观待本人批准样张。')
    content = _nodes(block, ctx)
    if 'columns' in spec or 'columns_v' in spec:
        columns = _explicit_columns(spec, ctx)
        if ctx.orient == 'v' and 'columns_v' not in spec:
            columns = 1
        classes += ' ct-monospace-grid'
        attrs += f' style="--ct-monospace-columns:{columns}"'
        content = ''.join('<div class="ct-monospace-unit">' + node_html(node, ctx) + '</div>' for node in block.get('nodes', []))
    return f'<div class="c-text c-text-monospace{classes}" data-comp="monospace"{attrs}>' + content + '</div>'

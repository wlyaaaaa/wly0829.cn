"""功能状态卡与独立图例；所有定稿节点按输入顺序可见输出。"""

import html
import re
import weakref
from pathlib import Path
from urllib.parse import unquote, urlparse

from engine.parse import expected_text, parse


_SYMBOLS = "●○✕🟢🟡⚪"
_MARK = re.compile("[" + _SYMBOLS + "]")
_STATUS = {
    "在用": "on", "待验收": "pending", "待实施": "ring",
    "没用过": "unused", "说不准": "uncertain", "已停用": "off",
    "●": "on", "○": "ring", "✕": "off", "🟢": "on",
    "🟡": "pending", "⚪": "unused",
    "绿": "on", "黄": "pending", "灰": "unused", "浅灰": "uncertain",
}
_ICON_DISABLED = weakref.WeakKeyDictionary()
_STATE_ALIASES = {
    "on": "on", "green": "on", "pending": "pending", "yellow": "pending",
    "ring": "ring", "todo": "ring", "unused": "unused", "gray": "unused",
    "grey": "unused", "uncertain": "uncertain", "pale_gray": "uncertain",
    "off": "off", "cross_gray": "off",
}
FEATURE_SPEC_FIELDS = (
    "columns", "columns_v", "portrait_columns", "flow", "rows", "item_spans",
    "row_counts", "portrait_row_counts", "last_row", "last_row_fill", "icons", "illustration",
    "status", "statuses", "status_position", "status_display", "status_text", "status_from_trailing_parentheses", "muted", "off_background",
    "group_heading", "group_heading_style", "group_heading_font", "font", "heading_size",
    "group_heading_assets", "group_heading_asset", "group_heading_source_image", "group_heading_source_box",
    "group_heading_variant", "group_heading_icons", "group_heading_icon",
    "tail_illustration", "tail_illustrations",
    "size", "numeric_emphasis", "item_count", "last_row_widths", "status_style",
    "fill_last_row", "fill_first_row", "inline_illustration_after_number", "inline_illustration_index",
    # 只在显式 variant=stat/stats 路由中交给统计组件消费。
    "variant", "tone", "historical",
)
SPEC_FIELDS = {"feature_card": FEATURE_SPEC_FIELDS,
               "status_legend": ("columns", "columns_v", "portrait_columns", "size", "items_layout", "legend_items", "align")}


def _status_map(ctx):
    """字母不自带状态；只有本屏原文明确写出的对应关系才接入。"""
    states = dict(_STATUS)
    source = ctx.screen if isinstance(getattr(ctx, "screen", None), dict) else {}
    text = '\n'.join(str(source.get(key, "")) for key in ("text", "scene", "portrait"))
    words = '|'.join(re.escape(word) for word in sorted(_STATUS, key=len, reverse=True) if word not in _SYMBOLS)
    bindings = {}
    for letter, word in re.findall(r"(?<![A-Za-z])([A-Za-z])\s*[＝=：:]\s*(" + words + r")", text):
        bindings.setdefault(letter, set()).add(_STATUS[word])
    for letter, candidates in bindings.items():
        if len(candidates) == 1:
            states[letter] = next(iter(candidates))
    return states


def _status_parts(value, states=None):
    states = states or _STATUS
    plain = re.sub(r"\*\*|`", "", str(value or "")).strip()
    words = '|'.join(re.escape(word) for word in sorted(states, key=len, reverse=True) if word not in _SYMBOLS)
    token = r"(?:[" + _SYMBOLS + r"]?\s*(?:" + words + r")|[" + _SYMBOLS + r"])"
    match = re.fullmatch(r"(" + token + r"|〈\s*" + token + r"\s*〉)(?:\s*(·)\s*(只修报错|真实数据测过))?", plain)
    return match.groups() if match else None


def _feature_para(node, states=None, explicit_state=False):
    if node.get("type") != "para":
        return None
    cols = [part.strip() for part in node.get("text", "").split("｜")]
    status = len(cols) == 3 and (_status_parts(cols[2], states) or explicit_state and re.fullmatch(r"[A-Za-z]", cols[2]))
    return cols if status and cols[0] and cols[1] else None


def _keep_status_separator(node, index=0):
    source = node.get("src", [])
    if index >= len(source):
        return True
    raw = source[index]
    return expected_text(raw).count("·") == raw.count("·")


def _canon(value):
    return re.sub(r"\s+|\*\*|[〔〕【】［］`｜]", "", str(value or ""))


def _field(value, ctx, role="feature-text", tag="div", corner=False, data_role=None):
    """将状态符号移到角上时，DOM 仍保持它在原文中的位置。"""
    value = str(value) if value is not None else ""
    value = value.replace("｜", "")
    if role == "feature-text" and "\n\n" in value:
        return ctx.render({"type": "prose", "spec": {}, "nodes": parse(value)})
    attrs = f' data-role="{data_role}"' if data_role else ''
    if not corner or not _MARK.search(value):
        return f'<{tag} class="{role} tb"{attrs}>{ctx.inline(value)}</{tag}>'
    parts, start = [], 0
    for index, match in enumerate(_MARK.finditer(value)):
        if match.start() > start:
            parts.append(f'<span class="{role} tb">{ctx.inline(value[start:match.start()])}</span>')
        symbol = match.group()
        state = (_status([value]) or _STATUS[symbol]) if index == 0 else _STATUS[symbol]
        marker_role = "feature-status-mark" if index == 0 else role
        parts.append(f'<span class="{marker_role} tb" data-state="{state}">{ctx.inline(symbol)}</span>')
        start = match.end()
    if start < len(value):
        parts.append(f'<span class="{role} tb">{ctx.inline(value[start:])}</span>')
    return f'<{tag} class="feature-field"{attrs}>{"".join(parts)}</{tag}>'


def _status(values, states=None):
    states = states or _STATUS
    for value in reversed(values):
        plain = re.sub(r"\*\*|[〔〕【】`]", "", str(value or "")).strip()
        if plain in states:
            return states[plain]
        parts = _status_parts(plain, states)
        if not parts:
            tail = re.search(r"〈[^〈〉]+〉(?:\s*·\s*(?:只修报错|真实数据测过))?\s*$", plain)
            parts = _status_parts(tail.group(), states) if tail else None
        if not parts and "｜" in plain:
            parts = _status_parts(plain.rsplit("｜", 1)[-1], states)
        if parts:
            labelled = _MARK.sub("", parts[0]).strip("〈〉 \t\n")
            return states.get(labelled, states.get(parts[0]))
        labelled = _MARK.sub("", plain).strip()
        if labelled in states:
            return states[labelled]
        match = _MARK.search(plain)
        if match:
            return _STATUS[match.group()]
    return None


def _asset_url(value, ctx):
    """上下文可能已经给出可用 URL，只有原始路径才再转换。"""
    value = str(value)
    return value if re.match(r"^(?:file:///|https?://)", value, re.IGNORECASE) else ctx.asset_url(value)


def _take_icons(nodes, spec, ctx, states=None):
    explicit_state = bool(spec.get("status") or isinstance(spec.get("statuses"), list))
    count = sum(1 if node.get("type") == "card" or _feature_para(node, states, explicit_state) else len(node.get("items", []))
                if node.get("type") in ("steps", "bullets", "stats") else 0
                for node in nodes)
    icon_spec = spec.get("icons", "auto")
    if not count or icon_spec == "none" or spec.get("illustration") == "none":
        return []
    if not isinstance(icon_spec, list) and _ICON_DISABLED.get(ctx, False):
        return []
    if isinstance(icon_spec, list):
        available = list(ctx.icons()) if hasattr(ctx, "icons") else []
        icons = []
        for name in icon_spec[:count]:
            name = str(name)
            matched = next((asset for asset in available
                            if str(asset) == name or str(asset).replace("\\", "/").rsplit("/", 1)[-1] == name), None)
            if matched is not None:
                icons.append(matched)
            elif re.match(r"^(?:file:///|https?://)", name, re.IGNORECASE):
                icons.append(name)
            else:
                icons.append(ctx.resolve(name) if hasattr(ctx, "resolve") else name)
    elif hasattr(ctx, "take_icons"):
        icons = list(ctx.take_icons(count))
    else:
        icons = list(ctx.icons())[:count] if hasattr(ctx, "icons") else []
    if len(icons) != count:
        if not isinstance(icon_spec, list):
            # take_icons 不足时不会推进游标，后续组再领会复用早先的图标。
            _ICON_DISABLED[ctx] = True
        if hasattr(ctx, "warn"):
            extra = "本屏后续功能组也停止自动分配图标。" if not isinstance(icon_spec, list) else ""
            ctx.warn(f"功能卡本组有 {count} 张，图标仅 {len(icons)} 个；本组全部不放图标，避免错配。{extra}")
        return []
    return icons


def _semantic_text(value, ctx):
    return html.unescape(re.sub(r"<[^>]*>", "", ctx.inline(str(value))))


_TRAILING_PAREN_STATES = {"在用": "on", "没用过": "unused", "说不准": "uncertain"}


def _trailing_parentheses(value, ctx):
    """只认原字段末尾完整括注的原状态词；冒号后的原说明也留在括注内。"""
    tail = re.search(r"(?P<open>[（(])(?P<body>[^（）()]*)(?P<close>[）)])\s*$", value)
    if not tail or (tail["open"], tail["close"]) not in (("（", "）"), ("(", ")")):
        ctx.incomplete("功能项没有末尾的完整括号状态；原字保留，未加状态点。", "composition")
        return None
    status = re.fullmatch(r"\s*(?P<symbol>[" + _SYMBOLS + r"])?\s*(?P<word>在用|没用过|说不准)(?:\s*[：:].*)?\s*", tail["body"])
    if not status:
        ctx.incomplete("功能项末尾括注没有已知的在用、没用过或说不准状态词；原字保留，未推定状态点。", "composition")
        return None
    return tail, status, _TRAILING_PAREN_STATES[status["word"]]


def _parenthetical_field(value, ctx, role, data_role=None):
    """圆点无字；原括号、状态词和解释仍在原字段中，经 inline 完整输出。"""
    # 名称前导冒号可能已移回名称；重新定位当前字段，避免用移动前的偏移插点。
    tail, status, state = _trailing_parentheses(value, ctx)
    prefix = ctx.inline(value[:tail.start()])
    if status["symbol"]:
        # 原括注已有符号时只保留这一枚，颜色仍按同一原状态词取共享变量。
        body = ctx.inline(value[tail.start():])
    else:
        start = tail.start("body") + status.start("word")
        dot = (f'<span class="feature-status-dot feature-inline-status-dot" data-state="{state}" '
               'data-role="status-dot" aria-hidden="true"></span>')
        body = ctx.inline(value[tail.start():start]) + dot + ctx.inline(value[start:])
    attrs = f' data-role="{data_role}"' if data_role else ''
    return (f'<div class="{role} tb"{attrs}>{prefix}<span class="feature-trailing-status" '
            f'data-state="{state}">{body}</span></div>')


def _card(fields, ctx, number=None, icon=None, illustration="left_inside", span=1,
          status_display=None, keep_separator=True, state=None, status_position="top_right", muted=False, states=None,
          numeric_emphasis=False, status_style=None, trailing_parentheses=False, preserve_status_text=False, body_nodes=()):
    states = states or _STATUS
    fields = list(fields)
    parentheses_mode = trailing_parentheses or preserve_status_text
    trailing_index = next((i for i in range(len(fields) - 1, -1, -1) if str(fields[i][1] or "").strip()), None)
    trailing = _trailing_parentheses(str(fields[trailing_index][1] or ""), ctx) if trailing_parentheses and trailing_index is not None else None
    # 正文尾的〈状态〉和独立状态格等价，字仍按原来的顺序输出。
    if not parentheses_mode and fields and not _status_parts(fields[-1][1], states):
        role, value = fields[-1]
        tail = re.search(r"〈[^〈〉]+〉(?:\s*·\s*(?:只修报错|真实数据测过))?\s*$", str(value or ""))
        if tail and _status_parts(tail.group(), states):
            fields[-1:] = [(role, str(value)[:tail.start()]), ("feature-status-text", tail.group())]
        elif "｜" in str(value or ""):
            body, status = str(value).rsplit("｜", 1)
            if _status_parts(status, states):
                fields[-1:] = [(role, body), ("feature-status-text", status)]
    if parentheses_mode:
        state = trailing[2] if trailing else None
    else:
        state = _status([value for _, value in fields], states) or state
    has_symbol = any(_MARK.search(str(value or "")) for _, value in fields)
    status_tail = _status_parts(fields[-1][1], states) if len(fields) > 1 and not parentheses_mode else None
    semantic_dot = status_display == "dot" and status_tail is not None
    pill = status_style == "pill" and status_tail is not None
    if status_style == "pill" and not status_tail and not parentheses_mode:
        ctx.incomplete("状态胶囊没有原文状态词可承接，未从场景或配置补写状态字。", "composition")
    attrs = f' data-state="{state}"' if state else ""
    attrs += f' data-illustration="{illustration}"'
    attrs += f' data-status-position="{"inline" if parentheses_mode else status_position}"'
    if muted:
        attrs += ' data-muted="true"'
    if pill:
        attrs += ' data-status-style="pill"'
    if span > 1:
        attrs += f' style="grid-column:span {span}"'
    parts = [f'<article class="feature-item card"{attrs}>']
    if state and not has_symbol and not semantic_dot and not pill and not parentheses_mode:
        # 装饰没有文字；状态词仍在原文的位置完整显示。
        parts.append(f'<span class="feature-status-dot" data-state="{state}" aria-hidden="true"></span>')
    icon_html = f'<img class="feature-icon" src="{html.escape(_asset_url(icon, ctx), quote=True)}" alt="">' if icon else ""
    if icon_html and illustration != "header_left":
        parts.append(icon_html)
    parts.append('<div class="feature-copy">')
    symbol_field = next((i for i in range(len(fields) - 1, -1, -1) if _MARK.search(str(fields[i][1] or ""))), None)
    if (len(fields) > 1 and fields[0][0] == "feature-name" and fields[1][0] == "feature-text"
            and str(fields[0][1] if fields[0][1] is not None else "").strip()):
        colon = re.match(r"^(\s*)([:：])", str(fields[1][1] or ""))
        if colon:
            # 只移动那一枚原分隔冒号；状态判断先按原字段完成，热区仍由 inline 输出。
            fields[0] = (fields[0][0], str(fields[0][1]) + colon.group())
            fields[1] = (fields[1][0], str(fields[1][1])[colon.end():])
    for index, (role, value) in enumerate(fields):
        if index == len(fields) - 1 and status_tail:
            status_word, separator, label = status_tail
            if pill:
                dot = '' if _MARK.search(status_word) else f'<span class="feature-pill-dot" data-state="{state}" aria-hidden="true"></span>'
                parts.append(f'<span class="feature-status-pill tb" data-state="{state}">{dot}{ctx.inline(status_word)}</span>')
            elif semantic_dot:
                semantic = html.escape(_semantic_text(status_word, ctx), quote=True)
                parts.append(f'<span class="feature-status-dot" data-state="{state}" data-text="{semantic}"></span>')
            else:
                parts.append(_field(status_word, ctx, "feature-status-text", corner=True))
            if label:
                label_text = (separator if separator and keep_separator else '') + label
                parts.append(f'<div class="feature-maintenance-label tb">{ctx.inline(label_text)}</div>')
            continue
        if index == 0:
            parts.append('<div class="feature-head">')
            if icon_html and illustration == "header_left":
                parts.append(icon_html)
            if number is not None:
                parts.append(_field(number, ctx, "feature-number", "span"))
            numeric = numeric_emphasis and bool(re.match(r"^[0-9０-９]", _semantic_text(value, ctx).lstrip()))
            if numeric_emphasis and not numeric:
                ctx.incomplete("数字强调的原名称字段没有数值，保留原字，未从场景补数字。", "composition")
            name_role = "feature-numeric-name" if numeric else role
            if trailing and index == trailing_index:
                parts.append(_parenthetical_field(str(value or ""), ctx, name_role, data_role="num" if numeric else None))
            else:
                parts.append(_field(value, ctx, name_role, "div", corner=not parentheses_mode and index == symbol_field, data_role="num" if numeric else None))
            parts.append('</div>')
        elif index == trailing_index and trailing:
            parts.append(_parenthetical_field(str(value or ""), ctx, role))
        else:
            parts.append(_field(value, ctx, role, corner=not parentheses_mode and index == symbol_field))
    if not fields and number is not None:
        parts.append(_field(number, ctx, "feature-number"))
    if body_nodes:
        parts.append(ctx.render({"type": "prose", "spec": {}, "nodes": body_nodes}))
    parts.append('</div></article>')
    return ''.join(parts)


def _step_fields(item):
    """cols 是解析器从 lead/text 派生的另一种视图，不重复输出同一原文。"""
    lead, text, cols = item.get("lead"), item.get("text"), item.get("cols")
    combined = (str(lead or "") + str(text or ""))
    if cols and _canon(''.join(str(c) for c in cols)) == _canon(combined):
        return [("feature-name" if i == 0 else "feature-status-text" if i == len(cols) - 1 and _status([c]) else "feature-text", c)
                for i, c in enumerate(cols)]
    fields = []
    if lead is not None:
        fields.append(("feature-name", lead))
    if text is not None:
        fields.append(("feature-text" if lead is not None else "feature-name", text))
    # 兼容直接构造的节点：非派生 cols 的独立内容也不得丢掉。
    represented = _canon(combined)
    for col in cols or []:
        if _canon(col) and _canon(col) not in represented:
            fields.append(("feature-text", col))
    return fields


def _fallback(node, ctx, prefix):
    """未列出的节点保留 src 原行；仅去除 API 定义的排版记号。"""
    parts = []
    for raw in node.get("src", []):
        line = raw.strip()
        if line.startswith("```") or re.fullmatch(r"\|?[\s:|\-]+\|?", line):
            continue
        line = re.sub(r"^#{1,3}\s+|^-\s+", "", line)
        line = re.sub(r"^(\d+)\.\s+", r"\1 ", line).replace("|", "").replace("｜", "")
        parts.append(_field(line, ctx, prefix + "-note"))
    if not parts and node.get("text") is not None:
        parts.append(_field(node["text"], ctx, prefix + "-note"))
    return ''.join(parts)


_BRACKET_LEGEND_STATES = {
    ("在用", "绿圆点"): "on", ("待验收", "黄圆点"): "pending",
    ("待实施", "空心绿圈"): "ring", ("没用过", "灰圆点"): "unused",
    ("说不准", "浅灰圆点"): "uncertain", ("已停用", "叉"): "off",
    ("在用", "绿"): "on", ("待验收", "黄"): "pending",
    ("没用过", "灰"): "unused", ("说不准", "浅灰"): "uncertain",
}
_BRACKET_LEGEND = re.compile(r"(在用|待验收|待实施|没用过|说不准|已停用)\s*[（(]([^）)]+)[）)]")


def _bracket_legend(text):
    matches = list(_BRACKET_LEGEND.finditer(text))
    # 括注首色负责状态对应，逗号后的原说明仍完整经 inline 显示。
    def state(match):
        color = re.split(r"[，,]", re.sub(r"\s+", "", match[2]), 1)[0]
        return _BRACKET_LEGEND_STATES.get((match[1], color))

    if not matches or any(state(match) is None for match in matches):
        return None
    marks = list(_MARK.finditer(text))
    if marks:
        # 有原符号的图例先沿符号切；不能把前置圆点或末尾叉并到相邻状态项。
        entries = [(text[:marks[0].start()], None)] if marks[0].start() else []
        for index, mark in enumerate(marks):
            end = marks[index + 1].start() if index + 1 < len(marks) else len(text)
            entry = text[mark.start():end]
            body = entry[len(mark.group()):].strip()
            bracket = _BRACKET_LEGEND.fullmatch(body)
            value = state(bracket) if bracket else _STATUS.get(body)
            if value is None:
                return None
            entries.append((entry, value))
        return entries
    entries = []
    if matches[0].start():
        entries.append((text[:matches[0].start()], None))
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        entries.append((text[match.start():end], state(match)))
    return entries


def _legend_node(node, ctx):
    if node.get("type") == "legend":
        entries = [str(item.get("dot", "")) + " " + str(item.get("text", "")) for item in node.get("items", [])]
    elif node.get("type") in ("para", "h1", "h2", "h3"):
        text = str(node.get("text", ""))
        bracketed = _bracket_legend(text)
        if bracketed:
            parts = []
            for entry, state in bracketed:
                if state is None:
                    parts.append(_field(entry, ctx, "legend-prefix", "span"))
                else:
                    dot = (f'<span class="legend-color-dot" data-state="{state}" aria-hidden="true"></span>'
                           if not _MARK.search(entry) else '')
                    parts.append(f'<span class="legend-item tb" data-state="{state}">{dot}{ctx.inline(entry)}</span>')
            return ''.join(parts)
        if _BRACKET_LEGEND.search(text):
            ctx.incomplete("括注图例的状态词与说明没有已知一一对应，原字保留，标记未推定。", "composition")
        matches = list(_MARK.finditer(text))
        # emoji 图例在现有解析器中是 para；在首个符号前的字仍保留。
        entries = ([text[:matches[0].start()]] if matches and text[:matches[0].start()] else [])
        entries += [text[m.start():matches[i + 1].start() if i + 1 < len(matches) else len(text)] for i, m in enumerate(matches)]
        if not matches:
            labels = list(re.finditer(r"(?:浅灰|绿|黄|红|灰)\s*[：:]", text))
            entries = ([text[:labels[0].start()]] if labels and text[:labels[0].start()] else [])
            entries += [text[m.start():labels[i + 1].start() if i + 1 < len(labels) else len(text)] for i, m in enumerate(labels)]
            if not labels:
                entries = [text]
    elif node.get("type") == "group":
        entries = [node.get("name", "")]
    else:
        return _fallback(node, ctx, "legend")
    parts = []
    for entry in entries:
        if _BRACKET_LEGEND.search(entry) and _bracket_legend(entry) is None:
            ctx.incomplete("括注图例的状态词与说明没有已知一一对应，原字保留，标记未推定。", "composition")
        state = _status([entry])
        # 相同 ● 的具体颜色来自同一条里的状态词，不推定固定 legend 顺序。
        for word, kind in sorted(_STATUS.items(), key=lambda item: len(item[0]), reverse=True):
            if word not in _SYMBOLS and word in entry:
                state = kind
                break
        attrs = f' data-state="{state}"' if state else ""
        color_label = re.match(r"^\s*(浅灰|绿|黄|红|灰)\s*[：:]", entry)
        if color_label:
            state = {'绿':'on','黄':'pending','红':'danger','灰':'unused','浅灰':'uncertain'}[color_label[1]]
            attrs = f' data-state="{state}"'
            if state == 'danger':
                base = Path(__file__).resolve().parents[2] / 'style' / 'base.css'
                if not re.search(r'--status-error\s*:', base.read_text(encoding='utf-8')):
                    ctx.incomplete('红色图例点缺共享 --status-error 颜色变量，当前只保留空心轮廓。', 'composition')
        dot = f'<span class="legend-color-dot" data-state="{state}" aria-hidden="true"></span>' if state and color_label and not _MARK.search(entry) else ''
        parts.append(f'<span class="legend-item tb"{attrs}>{dot}{ctx.inline(entry.replace("｜", ""))}</span>')
    return ''.join(parts)


def _columns(ctx, spec, group_index=0):
    columns = spec.get("portrait_columns", spec.get("columns_v", 1)) if ctx.orient == "v" else spec.get("columns", 3)
    values = columns if isinstance(columns, list) else [columns]
    if not values or any(isinstance(n, bool) or not isinstance(n, int) or n < 1 for n in values):
        raise ValueError("columns / portrait_columns 必须是正整数或正整数数组")
    return values[min(group_index, len(values) - 1)]


def _root_attrs(ctx, spec, columns=None):
    if ctx.orient not in ("h", "v"):
        raise ValueError("功能卡方向必须是 h 或 v")
    columns = _columns(ctx, spec) if columns is None else columns
    return (f'data-orient="{ctx.orient}" '
            f'style="--feature-columns:{columns};--feature-min-font:{float(ctx.min_font):g}px"')


_LEGEND_COLORS = {"绿": "on", "灰": "unused", "黄": "pending", "红": "danger", "浅灰": "uncertain", "空心灰圈": "hollow_gray"}
_LEGEND_LAMPS = {"green": "on", "gray": "unused", "yellow": "pending", "red": "danger", "hollow_gray": "hollow_gray"}


def _structured_legend_units(block, ctx):
    """仅拆原节点中的文字，配置的 text_ref 用作匹配和造型，不作为新文案输出。"""
    spec, nodes = block.get("spec", {}), block.get("nodes", [])
    configs = spec.get("legend_items", [])
    if not isinstance(configs, list):
        ctx.incomplete("legend_items 必须是按原文 text_ref 绑定的数组，未生成配置文案。", "composition")
        configs = []
    source = '\n'.join(str(node.get("text", node.get("name", ""))) for node in nodes)
    bindings = []
    seen_refs = set()
    for config in configs:
        if (not isinstance(config, dict) or config.get("kind") not in ("done", "unverified")
                or not isinstance(config.get("text_ref"), str) or not config["text_ref"]
                or config["text_ref"] in seen_refs or source.count(config["text_ref"]) != 1):
            ctx.incomplete("legend_items 的 kind/text_ref 没有唯一匹配原文，标签造型未执行，原字仍保留。", "composition")
            continue
        bindings.append((config["text_ref"], config["kind"]))
        seen_refs.add(config["text_ref"])
    if len(bindings) != len(configs):
        bindings = []
    raw = []
    for node in nodes:
        kind = node.get("type")
        if kind == "legend":
            for item in node.get("items", []):
                entry = str(item.get("dot", "")) + " " + str(item.get("text", ""))
                bracketed = _bracket_legend(entry)
                if bracketed:
                    raw.extend((text, ("bracket", state), False) for text, state in bracketed)
                else:
                    if _BRACKET_LEGEND.search(entry):
                        ctx.incomplete("括注图例的状态词与说明没有已知一一对应，原字保留，标记未推定。", "composition")
                    raw.append((entry, None, False))
            continue
        if kind not in ("para", "h1", "h2", "h3", "group"):
            raw.append((_other_node(node, ctx), "html", True))
            continue
        text = str(node.get("text", node.get("name", "")))
        positions = sorted((text.index(ref), role) for ref, role in bindings if ref in text)
        bracketed = _bracket_legend(text) if not positions else None
        if bracketed:
            raw.extend((entry, ("bracket", state), state is None) for entry, state in bracketed)
            continue
        if not positions and _BRACKET_LEGEND.search(text):
            ctx.incomplete("括注图例的状态词与说明没有已知一一对应，原字保留，标记未推定。", "composition")
        if not positions:
            marks = list(re.finditer(r"(?:空心灰圈|浅灰|绿|黄|红|灰)\s*[：:]", text)) or list(_MARK.finditer(text))
            positions = [(match.start(), None) for match in marks]
        if positions:
            if positions[0][0]:
                raw.append((text[:positions[0][0]], None, True))
            for index, (start, role) in enumerate(positions):
                end = positions[index + 1][0] if index + 1 < len(positions) else len(text)
                raw.append((text[start:end], role, False))
        else:
            raw.append((text, None, kind == "group"))
    layout = spec.get("items_layout", {})
    layout = {} if layout is None else layout
    if not isinstance(layout, dict):
        ctx.incomplete("items_layout 必须给明确图例布局对象，当前按原序基础图例显示。", "composition")
        layout = {}
    known = {"direction", "columns", "rows", "lamp_order", "text_from_node", "do_not_duplicate_text", "legend_panel"}
    if set(layout) - known:
        ctx.incomplete("items_layout 中没有执行的字段：" + ', '.join(sorted(set(layout) - known)), "composition")
    if layout.get("direction") not in (None, "horizontal"):
        ctx.incomplete(f"图例 direction={layout['direction']} 没有可执行布局，保持原文顺序。", "composition")
    for flag in ("text_from_node", "do_not_duplicate_text"):
        if flag in layout and layout[flag] is not True:
            ctx.incomplete(f"图例 {flag} 取值未执行；文字仍只从原节点完整显示一次。", "composition")
    if layout.get("legend_panel") is not None and not isinstance(layout["legend_panel"], bool):
        ctx.incomplete("legend_panel 必须是布尔值，面板未推定。", "composition")
    count = sum(not prefix for _, _, prefix in raw)
    lamps = layout.get("lamp_order")
    if lamps is not None and (not isinstance(lamps, list) or len(lamps) != count or any(not isinstance(lamp, str) or lamp not in _LEGEND_LAMPS for lamp in lamps)):
        unknown = [str(lamp) for lamp in lamps if not isinstance(lamp, str) or lamp not in _LEGEND_LAMPS] if isinstance(lamps, list) else []
        detail = " 未支持的枚举：" + ', '.join(unknown) + "。" if unknown else ''
        ctx.incomplete(f"lamp_order 必须明确映射原文 {count} 项图例，未按猜测重排或补灯。" + detail, "composition")
        lamps = None
    units, lamp_index = [], 0
    for text, role, prefix in raw:
        if role == "html":
            units.append((text, True))
            continue
        color = re.match(r"^\s*(空心灰圈|浅灰|绿|黄|红|灰)\s*[：:]", text)
        state = _LEGEND_COLORS[color[1]] if color else _status([text])
        bracket_bound = isinstance(role, tuple) and role[0] == "bracket"
        if bracket_bound:
            state, role = role[1], None
        if role in ("done", "unverified"):
            state = "on" if role == "done" else "unused"
        if not prefix and lamps:
            requested = _LEGEND_LAMPS[lamps[lamp_index]]
            if (color or bracket_bound) and requested != state:
                ctx.incomplete("lamp_order 与原文颜色标签或括注不一致，原文和原状态顺序保留。", "composition")
            else:
                state = requested
        if not prefix:
            lamp_index += 1
        attrs = f' data-state="{state}"' if state else ''
        attrs += f' data-legend-kind="{role}"' if role in ("done", "unverified") else ''
        if prefix:
            rendered = _field(text, ctx, "legend-prefix")
        else:
            dot_state = "hollow_gray" if role == "unverified" else state
            dot = f'<span class="legend-color-dot" data-state="{dot_state}" aria-hidden="true"></span>' if state and not _MARK.search(text) else ''
            rendered = f'<span class="legend-item tb"{attrs}>{dot}{ctx.inline(text)}</span>'
        units.append((rendered, prefix))
    return units, layout


def render_status_legend(block: dict, ctx) -> str:
    """独立图例；包括解析为普通段落的 🟢🟡⚪ 图例。"""
    spec = block.get("spec", {})
    structured = spec.get("items_layout") is not None or spec.get("legend_items") is not None
    units, layout = _structured_legend_units(block, ctx) if structured else ([], {})
    columns = layout.get("columns")
    if columns is not None and (isinstance(columns, bool) or not isinstance(columns, int) or columns < 1):
        ctx.incomplete("items_layout.columns 必须是正整数，图例仍用基础列数。", "composition")
        columns = None
    attrs = _root_attrs(ctx, spec, columns)
    grid = ' data-grid="true"' if columns is not None or any(field in spec for field in ("columns", "columns_v", "portrait_columns")) else ''
    size = spec.get("size")
    if size is not None and size not in ("small", "medium"):
        ctx.incomplete(f"status_legend size={size} 没有可执行的图例留白档位，按 medium 留白显示。", "composition")
        size = "medium"
    size_attr = f' data-size="{size}"' if size is not None else ''
    align = spec.get("align")
    if align not in (None, "left", "center"):
        ctx.incomplete(f"status_legend align={align} 没有可执行的对齐方式，按 left 显示。", "composition")
        align = "left"
    align_attr = f' data-align="{align}"' if align is not None else ''
    panel_attr = ' data-panel="true"' if layout.get("legend_panel") is True else ''
    parts = [f'<div class="c-status-legend" data-comp="status_legend" {attrs}{grid}{size_attr}{align_attr}{panel_attr}>']
    if structured:
        rows = layout.get("rows")
        count = sum(not prefix for _, prefix in units)
        if rows is not None and (not isinstance(rows, list) or any(isinstance(n, bool) or not isinstance(n, int) or n < 1 for n in rows) or sum(rows) != count):
            ctx.incomplete(f"图例 rows 必须按原文 {count} 项完整分排，当前行数未执行。", "composition")
            rows = None
        row_index = row_items = 0
        opened = False
        for rendered, prefix in units:
            if prefix or not rows:
                if opened and prefix:
                    parts.append('</div>'); opened = False
                parts.append(rendered)
                continue
            if not opened:
                parts.append(f'<div class="legend-layout-row" data-legend-row="{row_index + 1}" style="--legend-row-columns:{rows[row_index]}">')
                opened = True
            parts.append(rendered); row_items += 1
            if row_items == rows[row_index]:
                parts.append('</div>'); opened = False
                row_index += 1; row_items = 0
        if opened:
            parts.append('</div>')
        return ''.join(parts) + '</div>'
    for node in block.get("nodes", []):
        if node.get("type") in ("legend", "para", "h1", "h2", "h3", "group"):
            parts.append(_legend_node(node, ctx))
        else:
            parts.append(_other_node(node, ctx))
    return ''.join(parts) + '</div>'


def _other_node(node, ctx):
    kind = node.get("type")
    if kind in ("card", "steps", "bullets", "stats"):
        return render_feature_card({"nodes": [node], "spec": {"icons": "none"}}, ctx)
    if kind == "table":
        rows = ([node["header"]] if node.get("header") is not None else []) + node.get("rows", [])
        return ''.join('<div class="feature-table-row">' + ''.join(_field(c, ctx) for c in row) + '</div>' for row in rows)
    if kind == "code":
        return _field('\n'.join(node.get("lines", [])), ctx, "feature-code", "pre")
    if kind in ("linkrow", "now"):
        # 保留 src 中按钮和链接的真实括号类型，交给 ctx.inline 生成热区。
        return _fallback(node, ctx, "feature")
    return _fallback(node, ctx, "feature")


def _group_heading(value, ctx, spec, group_index):
    style = spec.get("group_heading_style", spec.get("group_heading", spec.get("group_heading_font", spec.get("font", "sans"))))
    variant = spec.get("group_heading_variant", "none")
    if style == "icon_underline":
        style, variant = "brush", "icon_underline"
    elif style == "brush_line":
        style, variant = "brush", "brush_line"
    if variant not in ("none", "icon_underline", "brush_line"):
        ctx.incomplete(f"功能组标题变体 {variant} 没有可执行的布局。", "composition")
        variant = "none"
    if variant != "none":
        ctx.warn("功能组标题的左侧装饰与下沿线新样式待样张审核。")
    size = spec.get("heading_size", "medium")
    if size not in ("small", "medium", "large"):
        ctx.incomplete(f"功能组标题 heading_size={size} 没有可执行的档位。", "composition")
        size = "medium"
    marked = re.match(r"^\*\*(.+?)\*\*(.*)$", str(value))
    heading, suffix = marked.groups() if marked else (value, "")
    assets = spec.get("group_heading_assets", {})
    asset = assets.get(heading) if isinstance(assets, dict) else assets[group_index] if isinstance(assets, list) and group_index < len(assets) else None
    asset = asset or spec.get("group_heading_asset")
    semantic = _semantic_text(heading, ctx)
    title = None
    if style == "brush":
        # 和章节标题使用同一份已核验素材，不凭文件名或槽位顺序猜组名。
        from engine import assets as engine_assets
        provider = getattr(ctx, "assets", engine_assets)
        screen_id = getattr(ctx, "screen", {}).get("id", "")
        rows = provider.for_screen(screen_id, "title", ctx.orient) if hasattr(provider, "for_screen") else []
        rows = [row for row in rows if row.get("title_exact_match") and _canon(row.get("title_text")) == _canon(semantic)]
        if not rows and hasattr(provider, "for_screen"):
            rows = [row for row in provider.for_screen(screen_id, "title")
                    if row.get("title_exact_match") and _canon(row.get("title_text")) == _canon(semantic)]
        title_spec = {"align": "left", "size": size}
        path = _local_asset(asset, ctx) if asset else None
        if path:
            title_spec["asset"] = path
            for source, target in (("group_heading_source_image", "source_image"), ("group_heading_source_box", "source_box")):
                if spec.get(source):
                    title_spec[target] = spec[source]
        if path or rows:
            if hasattr(ctx, "render") and provider is engine_assets:
                title = ctx.render({"type": "chapter_title", "spec": title_spec,
                                    "nodes": [{"type": "h3", "text": semantic, "src": []}]})
                title = title.replace('<img ', '<img class="feature-group-title-image" ', 1)
            else:
                row = rows[0] if rows else {}
                title_path = path or row["path"]
                if not row.get("source_box") or not row.get("source_image") or row.get("g4_target_reference_available") is False:
                    ctx.incomplete(f"功能组“{semantic}”的标题图没有合格原图取色对照，G4 没做。", "title")
                title = (f'<img class="feature-group-title-image" src="{html.escape(_asset_url(title_path, ctx), quote=True)}" '
                         f'alt="" data-text="{html.escape(semantic, quote=True)}">')
        if not title:
            ctx.incomplete(f"功能组“{semantic}”没有逐字一致的毛笔标题图，暂用基础组名字体。", "title")
    elif style not in ("sans", "Sans", "Noto Sans SC", "auto", "none"):
        ctx.incomplete(f"功能组标题字体 {style} 没有可执行的字体或素材映射。", "composition")
    body = title or _field(heading, ctx, "feature-group-text", "h3")
    if suffix:
        body += _field(suffix, ctx, "feature-group-note")
    icon = ""
    if variant == "icon_underline":
        entries = spec.get("group_heading_icons", {})
        entry = entries.get(heading) if isinstance(entries, dict) else entries[group_index] if isinstance(entries, list) and group_index < len(entries) else None
        path = _local_asset(entry or spec.get("group_heading_icon"), ctx)
        if path:
            icon = f'<img class="feature-group-icon" src="{html.escape(_asset_url(path, ctx), quote=True)}" alt="">'
        else:
            ctx.incomplete(f"功能组“{semantic}”的左侧图标没有明确素材绑定，未领取功能卡图标代替。", "asset")
    image_class = " feature-group-image" if title else ""
    return (f'<div class="feature-group feature-group-heading{image_class}" data-heading-size="{size}" data-heading-variant="{variant}">'
            + icon + '<div class="feature-group-heading-body">' + body + '</div></div>')


def _local_asset(value, ctx):
    if not value:
        return None
    value = str(value)
    path = unquote(urlparse(value).path).lstrip('/') if value.startswith("file:///") else value
    if not Path(path).is_absolute() and hasattr(ctx, "resolve"):
        path = ctx.resolve(path)
    return path if Path(path).is_file() else None


def _source_group(ctx, nodes):
    """功能块不含组头时，按其第一条原文找回定稿中紧邻的组名。"""
    first = next((line for node in nodes for line in node.get("src", [])), None)
    group = ""
    for node in parse(str(getattr(ctx, "screen", {}).get("text", ""))):
        if node.get("type") in ("group", "h3"):
            group = str(node.get("name", node.get("text", "")))
        if first is not None and first in node.get("src", []):
            return group
    return ""


_TAIL_REQUIRE = re.compile(r"(?:第[二2](?:排|行)|末行|尾排).{0,180}(?:空出|剩余|余格|两格).{0,80}(?:插画|画)")


def _tail_source(ctx, group):
    """仅从本组场景原句确定图位；各组共用尾排说明时同时保留各自物件句。"""
    if ctx.orient != "h" or not group:
        return False, "", None
    screen = getattr(ctx, "screen", {})
    source = str(screen.get("scene", ""))
    names = {str(n.get("name", n.get("text", ""))) for n in parse(str(screen.get("text", "")))
             if n.get("type") in ("group", "h3")}
    names.add(group)
    pattern = (r'(?:组[“「"]?)?(?P<group>' + '|'.join(re.escape(name) for name in sorted(names, key=len, reverse=True) if name)
               + r')(?:[”」"])?(?:组)?\s*(?:(?P<count>\d+)\s*张|[：:])')
    matches = list(re.finditer(pattern, source))
    match_index = next((i for i, m in enumerate(matches) if m["group"] == group), None)
    if match_index is None:
        return False, "", None
    match = matches[match_index]
    end = matches[match_index + 1].start() if match_index + 1 < len(matches) else len(source)
    clause = source[match.start():end]
    common = bool(_TAIL_REQUIRE.search(source) and re.search(r"(?:各\s*\d+\s*张|每组第一行).{0,180}(?:第[二2](?:排|行)|末行|尾排)", source))
    count = match["count"]
    if count is None and common:
        shared_count = re.search(r"各\s*(\d+)\s*张", source)
        count = shared_count[1] if shared_count else None
    return bool(_TAIL_REQUIRE.search(clause) or common), clause, int(count) if count else None


def _tail_config(spec, ctx, group):
    """tail_illustration: true/auto/none/{asset|slot, span}; 多组可按组名给 tail_illustrations。"""
    required, clause, count = _tail_source(ctx, group)
    setting = spec.get("tail_illustration")
    mapping = spec.get("tail_illustrations")
    if isinstance(mapping, dict):
        key = next((key for key in mapping if _canon(key) == _canon(group)), None)
        if key is not None:
            setting = mapping[key]
    elif mapping is not None:
        ctx.incomplete("tail_illustrations 必须按真实组名提供映射，未按候选顺序推定。", "composition")
    if setting is False or setting == "none":
        return None, clause, count
    if setting is None and (not required or spec.get("row") or _columns(ctx, spec) < 2):
        return None, clause, count
    if setting is None or setting is True or setting == "auto":
        return {}, clause, count
    if isinstance(setting, dict):
        return dict(setting), clause, count
    ctx.incomplete("tail_illustration 需要 true/auto/none 或明确 asset/slot 配置，未推定素材绑定。", "composition")
    return {}, clause, count


def _tail_rows(cards, spans, columns, row_counts):
    """模拟已有行优先跨度；行数按实际卡片计算，不按场景中可能过时的卡数算。"""
    if row_counts and (not isinstance(row_counts, list) or any(isinstance(n, bool) or not isinstance(n, int) or n < 1 for n in row_counts)):
        raise ValueError("row_counts 必须是正整数数组")
    counts = list(row_counts or [])
    if sum(counts) < len(cards):
        counts.append(len(cards) - sum(counts))
    rows, offset = [], 0
    for count in counts:
        row, used = [], 0
        for index in range(offset, min(offset + count, len(cards))):
            span = spans[index]
            if row and used + span > columns:
                rows.append(row)
                row, used = [], 0
            row.append((cards[index], span))
            used += span
        if row:
            rows.append(row)
        offset += count
    return rows


def _tail_asset(config, ctx, group, clause):
    """明确路径或原槽号优先；自动模式仅用原物件短句唯一匹配已发布清单。"""
    if config.get("asset"):
        return _local_asset(config["asset"], ctx), "asset", None
    if "slot" in config:
        slot = config["slot"]
        if isinstance(slot, bool) or not isinstance(slot, int) or slot < 1:
            ctx.incomplete("尾排插画 slot 必须是原素材的正整数槽位号，未按列表下标取图。", "composition")
            return None, "missing", None
        value = dict(ctx.slots("illustration")).get(slot) if hasattr(ctx, "slots") else None
        return _local_asset(value, ctx), "slot", slot
    from engine import assets as engine_assets
    provider = getattr(ctx, "assets", engine_assets)
    screen_id = getattr(ctx, "screen", {}).get("id", "")
    rows = provider.for_screen(screen_id, "illustration", ctx.orient) if hasattr(provider, "for_screen") else []

    def object_text(value, short=True):
        value = re.split(r"[，,；;]", str(value), 1)[0] if short else str(value)
        value = re.sub(r"一(?:个|只|张|块|幅|条|支)|着|的", "", value)
        return re.sub(r"\W|_", "", value)

    target = object_text(clause, False)
    matches = []
    for row in rows:
        named = row.get("group_name", row.get("group"))
        exact_group = named is not None and _canon(named) == _canon(group)
        source_group = group and group in str(row.get("source_phrase", ""))
        originals = row.get("original_elements", [])
        originals = originals if isinstance(originals, list) else [originals]
        objects = [object_text(value) for value in originals]
        if exact_group or source_group and any(len(value) >= 4 and value in target for value in objects):
            matches.append(row)
    if len(matches) == 1:
        row = matches[0]
        return _local_asset(row.get("path"), ctx), "source", row.get("slot_ordinal")
    return None, "missing", None


def _tail_figure(config, ctx, group, clause, row, start, span):
    path, binding, slot = _tail_asset(config, ctx, group, clause)
    attrs = (f'data-tail-row="{row}" data-tail-start="{start}" data-tail-span="{span}" '
             f'data-tail-binding="{binding}" data-tail-group="{html.escape(group, quote=True)}" '
             f'style="grid-column:{start} / span {span}"')
    if slot is not None:
        attrs += f' data-tail-slot="{html.escape(str(slot), quote=True)}"'
    if not path:
        attrs += ' data-asset-missing="true"'
        ctx.incomplete(f"功能组“{group or '本组'}”尾排第 {row} 行、从第 {start} 格起的 {span} 格插画位已留空；没有唯一明确的素材绑定或绑定素材不存在。", "asset")
    image = f'<img class="feature-tail-image" src="{html.escape(_asset_url(path, ctx), quote=True)}" alt="">' if path else ''
    return f'<figure class="feature-tail-illustration" {attrs}>{image}</figure>'


def _last_width_tracks(widths, count, ctx):
    if widths is None:
        return None
    values = []
    if isinstance(widths, list):
        for width in widths:
            match = re.fullmatch(r"(\d+(?:\.\d+)?)%", str(width))
            if not match or not 0 < float(match[1]) <= 100:
                break
            values.append(float(match[1]))
    if not values or len(values) != count or len(values) != len(widths) or abs(sum(values) - 100) > .00001:
        ctx.incomplete(f"last_row_widths 必须给实际末行 {count} 张卡对应的正百分比并合计 100%，当前比例未执行。", "composition")
        return None
    # fr 分配扣掉 gap 后的余宽，百分比直接相加会让间距造成溢出。
    return ' '.join(f'minmax(0,{value:g}fr)' for value in values)


def _inline_figure(spec, ctx, number):
    index = spec.get("inline_illustration_index")
    config = {"slot": index + 1} if isinstance(index, int) and not isinstance(index, bool) and index >= 0 else {}
    path, _, slot = _tail_asset(config, ctx, "", "")
    attrs = f'data-after-number="{number}"'
    if slot is not None:
        attrs += f' data-illustration-slot="{slot}"'
    if not path:
        attrs += ' data-asset-missing="true"'
        ctx.incomplete(f"编号 {number} 后的卡外插画位已保留；没有明确原槽号绑定或绑定素材不存在。", "asset")
    image = f'<img class="feature-inline-image" src="{html.escape(_asset_url(path, ctx), quote=True)}" alt="">' if path else ''
    return f'<figure class="feature-inline-illustration" {attrs}>{image}</figure>'


_MASONRY_INIT = r"""(() => {
  const grid = document.currentScript.previousElementSibling;
  if (!grid || !grid.classList.contains('feature-masonry-grid')) return;
  let previousWidth = 0;
  const layout = () => {
    const css = getComputedStyle(grid);
    const columns = Math.max(1, parseInt(css.getPropertyValue('--feature-columns')) || 1);
    const width = grid.clientWidth;
    if (width <= 0) return;
    const gap = Math.max(0, parseFloat(css.columnGap) || 0);
    const cardWidth = (width - gap * (columns - 1)) / columns;
    if (cardWidth <= 0) return;
    const cards = Array.from(grid.children).filter(card => card.classList.contains('feature-item'));
    cards.forEach(card => {
      card.style.position = 'absolute';
      card.style.width = cardWidth + 'px';
      card.style.height = 'auto';
    });
    const bottoms = Array(columns).fill(0);
    cards.forEach((card, index) => {
      const column = index % columns;
      card.style.left = column * (cardWidth + gap) + 'px';
      card.style.top = bottoms[column] + 'px';
      card.dataset.flowColumn = String(column + 1);
      bottoms[column] += card.getBoundingClientRect().height + gap;
    });
    grid.style.height = Math.ceil(Math.max(0, ...bottoms) - (cards.length ? gap : 0)) + 'px';
    previousWidth = width;
    grid.dataset.flowReady = 'true';
  };
  layout();
  if (document.fonts) document.fonts.ready.then(layout);
  grid.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', layout);
    img.addEventListener('error', layout);
  });
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => {
      if (grid.clientWidth !== previousWidth) layout();
    }).observe(grid);
  } else {
    window.addEventListener('resize', layout);
  }
})();"""


def _masonry_grid(cards, columns, flow):
    """原 article 顺序不变；坐标布局脚本只处理高度和位置，不插改源文字。"""
    marked = [card.replace('<article ', f'<article data-flow-column="{index % columns + 1}" ', 1)
              for index, card in enumerate(cards)]
    return (f'<div class="feature-group-grid feature-masonry-grid" data-flow="{flow}" '
            f'style="--feature-columns:{columns}">' + ''.join(marked) + '</div>'
            + '<script data-echo="true">' + _MASONRY_INIT + '</script>')


def render_feature_card(block: dict, ctx) -> str:
    """组标题跨整排；card/steps/bullets/stats 每个条目各一张卡。"""
    spec = block.get("spec", {})
    if spec.get("variant") in ("stat", "stats"):
        if spec.get("flow") in ("masonry", "independent_columns"):
            ctx.incomplete("统计变体尚未执行独立列 flow，仍保留原统计布局。", "composition")
        stat_spec = dict(spec)
        stat_spec.pop("variant")
        return ctx.render({"type": "stat_card", "spec": stat_spec, "nodes": block.get("nodes", [])})
    if spec.get("variant") is not None:
        ctx.incomplete(f"功能卡 variant={spec['variant']} 没有可执行的变体。", "composition")
    if spec.get("historical") or spec.get("tone"):
        ctx.incomplete("功能卡的历史数字外观只有显式 stat/stats 变体执行；本块仍按功能卡显示。", "composition")
    attrs = _root_attrs(ctx, spec)
    size = spec.get("size")
    if size is not None:
        if size not in ("small", "medium", "large"):
            ctx.incomplete(f"feature_card size={size} 没有可执行的留白档位，按 medium 留白显示。", "composition")
            size = "medium"
        attrs += f' data-size="{size}"'
    nodes = list(block.get("nodes", []))
    # 原文缩进的清单属于前一个编号卡；保留独立节点，复用正文组件。
    for index in range(len(nodes) - 1, 0, -1):
        before, node = nodes[index - 1:index + 1]
        if node.get("type") == "bullets" and node.get("src") and all(line[:1].isspace() for line in node["src"]) and before.get("type") == "steps":
            items = before["items"]
            nodes[index - 1:index + 1] = [dict(before, items=[*items[:-1], dict(items[-1], body_nodes=[node])])]
    states = _status_map(ctx)
    icons = _take_icons(nodes, spec, ctx, states)
    trailing_parentheses = spec.get("status_from_trailing_parentheses") is True
    preserve_status_text = "status_from_trailing_parentheses" in spec and not isinstance(spec["status_from_trailing_parentheses"], bool)
    if preserve_status_text:
        ctx.incomplete("status_from_trailing_parentheses 必须是布尔值；原状态文字保留，未推定尾部状态点。", "composition")
    status_display = spec.get("status_display")
    if status_display is None and spec.get("status_text") == "dot_only":
        status_display = "dot"
    if status_display is None:
        # Claude 08:35 已定：原状态词由 data-text 承接，默认只画角点。
        status_display = "dot"
    if status_display == "dot" and not (trailing_parentheses or preserve_status_text):
        ctx.warn("功能卡只画状态点或叉的新样式待样张审核；原状态词由 data-text 承接。")
    elif status_display not in (None, "dot", "text", "auto"):
        ctx.incomplete(f"功能卡 status_display={status_display} 没有可执行的状态表达。", "composition")
    if spec.get("status_text") not in (None, "dot_only"):
        ctx.incomplete(f"功能卡 status_text={spec['status_text']} 没有可执行的状态表达。", "composition")
    if spec.get("statuses") is not None and not isinstance(spec["statuses"], list):
        ctx.incomplete("功能卡 statuses 没有逐卡数组映射，未据此推定状态。", "composition")
    position = spec.get("status_position", "top_right")
    if position not in ("top_right", "bottom_right", "right"):
        ctx.incomplete(f"功能卡 status_position={position} 没有可执行的定位。", "composition")
        position = "top_right"
    if spec.get("muted") or spec.get("off_background") == "gray":
        ctx.warn("功能卡灰底与图标去色的新样式待样张审核；组名标题保持原笔画浓度。")
    if spec.get("off_background") not in (None, "gray", "none"):
        ctx.incomplete(f"功能卡 off_background={spec['off_background']} 没有可执行的底色。", "composition")
    numeric_emphasis = spec.get("numeric_emphasis") is True
    if spec.get("numeric_emphasis") is not None and not isinstance(spec["numeric_emphasis"], bool):
        ctx.incomplete("numeric_emphasis 必须是布尔值，未推定数字强调。", "composition")
    status_style = spec.get("status_style")
    if status_style not in (None, "pill"):
        ctx.incomplete(f"功能卡 status_style={status_style} 没有可执行的状态样式。", "composition")
        status_style = None
    for flag in ("fill_first_row", "fill_last_row"):
        if spec.get(flag) is not None and not isinstance(spec[flag], bool):
            ctx.incomplete(f"{flag} 必须是布尔值，该均分选项未执行。", "composition")
    inline_after = spec.get("inline_illustration_after_number")
    if inline_after is not None:
        numbered = [str(item.get("n")) for node in nodes if node.get("type") == "steps" for item in node.get("items", [])]
        if isinstance(inline_after, bool) or not isinstance(inline_after, int) or inline_after < 1 or numbered.count(str(inline_after)) != 1:
            ctx.incomplete("inline_illustration_after_number 必须唯一命中真实编号，插画未按条目下标或场景顺序改插。", "composition")
            inline_after = None
    parts = [f'<div class="c-feature-card" data-comp="feature_card" {attrs}>']
    card_index = 0
    group_index = 0
    has_group = False
    cards = []
    card_spans = []
    group_name = _source_group(ctx, nodes)

    def flush_cards():
        if not cards:
            return
        columns = _columns(ctx, spec, group_index)
        flow = spec.get("flow") or "row"
        if flow not in ("row", "column", "masonry", "independent_columns"):
            ctx.incomplete(f"feature_card flow={flow} 没有可执行的填充模式，仍保留原行布局。", "composition")
            flow = "row"
        tail_config, tail_clause, source_count = _tail_config(spec, ctx, group_name)
        row_counts = spec.get("portrait_row_counts", spec.get("row_counts")) if ctx.orient == "v" else spec.get("row_counts")
        if flow in ("masonry", "independent_columns"):
            conflicts = []
            if any(span != 1 for span in card_spans):
                conflicts.append("跨列卡片")
            if tail_config is not None:
                conflicts.append("尾排插画")
            if row_counts or spec.get("rows") or spec.get("last_row_widths") is not None:
                conflicts.append("明确分排或条目比例")
            if spec.get("last_row") == "fill" or any(spec.get(flag) is True for flag in ("last_row_fill", "fill_first_row", "fill_last_row")):
                conflicts.append("首末行均分")
            if spec.get("inline_illustration_after_number") is not None:
                conflicts.append("编号间跨列插画")
            if conflicts:
                ctx.incomplete("独立列 flow 不能同时执行“" + "、".join(conflicts) + "”，本块仍按原行布局保留内容。", "composition")
                flow = "row"
            else:
                parts.append(_masonry_grid(cards, columns, flow))
                cards.clear()
                card_spans.clear()
                return
        if tail_config is not None:
            rows = _tail_rows(cards, card_spans, columns, row_counts)
            used = sum(span for _, span in rows[-1])
            available = columns - used
            tail_span = tail_config.get("span", available)
            if flow == "column":
                ctx.incomplete(f"功能组“{group_name or '本组'}”为列优先布局，尾排右侧图位未执行。", "composition")
            elif not available:
                ctx.incomplete(f"功能组“{group_name or '本组'}”的实际末行已占满 {columns} 格，尾排插画没有余格，未另起一行伪作尾格。", "composition")
            elif isinstance(tail_span, bool) or not isinstance(tail_span, int) or not 1 <= tail_span <= available:
                ctx.incomplete(f"功能组“{group_name or '本组'}”实际尾排只有 {available} 格可用，要求的插画 span={tail_span} 未执行。", "composition")
            else:
                if source_count is not None and source_count != len(cards):
                    ctx.warn(f"功能组“{group_name}”原场景记 {source_count} 张，定稿实际 {len(cards)} 张；完整保留定稿，末行按实际卡数留 {available} 格图位。")
                parts.append(f'<div class="feature-group-grid" data-tail-grid="true" style="--feature-columns:{columns}">')
                for row_index, row in enumerate(rows, 1):
                    parts.append(f'<div class="feature-layout-row" data-feature-row="{row_index}" style="--feature-row-columns:{columns}">')
                    parts.extend(card for card, _ in row)
                    if row_index == len(rows):
                        parts.append(_tail_figure(tail_config, ctx, group_name, tail_clause, row_index, used + 1, tail_span))
                    parts.append('</div>')
                parts.append('</div>')
                cards.clear()
                card_spans.clear()
                return
        if flow == "column":
            if spec.get("last_row_widths") is not None or spec.get("fill_first_row") is True or spec.get("fill_last_row") is True:
                ctx.incomplete("列优先功能卡不能执行首末行均分或末行比例，仍保留原列布局。", "composition")
            rows = spec.get("rows", (len(cards) + columns - 1) // columns)
            if isinstance(rows, bool) or not isinstance(rows, int) or rows < 1:
                raise ValueError("列优先功能卡 rows 必须是正整数")
            parts.append(f'<div class="feature-group-grid" data-flow="column" '
                         f'style="--feature-columns:{columns};--feature-rows:{rows}">')
            parts.extend(cards)
            parts.append('</div>')
            cards.clear()
            card_spans.clear()
            return
        parts.append(f'<div class="feature-group-grid" style="--feature-columns:{columns}">')
        fill = spec.get("last_row") == "fill" or spec.get("last_row_fill") is True or spec.get("fill_last_row") is True
        if row_counts:
            if not isinstance(row_counts, list) or any(isinstance(n, bool) or not isinstance(n, int) or n < 1 for n in row_counts):
                raise ValueError("row_counts 必须是正整数数组")
            offset = 0
            for row_index, count in enumerate(row_counts):
                row = cards[offset:offset + count]
                if not row:
                    break
                offset += len(row)
                last = offset == len(cards)
                row_columns = len(row) if fill and last or spec.get("fill_first_row") is True and row_index == 0 else columns
                tracks = _last_width_tracks(spec.get("last_row_widths"), len(row), ctx) if last else None
                track_style = f';grid-template-columns:{tracks}' if tracks else ''
                parts.append(f'<div class="feature-layout-row" data-feature-row="{row_index + 1}" style="--feature-row-columns:{row_columns}{track_style}">')
                parts.extend(row)
                parts.append('</div>')
            # 不完整的规格也不能吞掉其余定稿；余项继续按基础列数排。
            parts.extend(cards[offset:])
            parts.append('</div>')
            cards.clear()
            card_spans.clear()
            return
        remainder = len(cards) % columns
        tail_count = remainder or min(columns, len(cards))
        tracks = _last_width_tracks(spec.get("last_row_widths"), tail_count, ctx)
        if tracks and spec.get("item_spans"):
            ctx.incomplete("last_row_widths 与非单格 item_spans 同时出现，条目比例未执行。", "composition")
            tracks = None
        if (fill and remainder or tracks or spec.get("fill_first_row") is True and len(cards) < columns) and not spec.get("item_spans"):
            remainder = tail_count
            parts.extend(cards[:-remainder])
            track_style = f';grid-template-columns:{tracks}' if tracks else ''
            parts.append(f'<div class="feature-last-row" style="--feature-last-columns:{remainder}{track_style}">')
            parts.extend(cards[-remainder:])
            parts.append('</div>')
        else:
            parts.extend(cards)
        parts.append('</div>')
        cards.clear()
        card_spans.clear()

    def begin_group(value):
        nonlocal group_index, has_group, group_name
        if has_group:
            group_index += 1
        has_group = True
        marked = re.match(r"^\*\*(.+?)\*\*", str(value))
        group_name = _semantic_text(marked[1] if marked else value, ctx)

    def add_card(fields, number=None, keep_separator=True, body_nodes=()):
        nonlocal card_index
        icon = icons[card_index] if card_index < len(icons) else None
        illustration = spec.get("illustration", "left_inside")
        if illustration == "none":
            icon = None
        if illustration not in ("top_inside", "left_inside", "header_left", "none"):
            illustration = "left_inside"
        spans = spec.get("item_spans", {})
        key = str(number if number is not None else card_index + 1)
        span = spans.get(key, spans.get(number if number is not None else card_index + 1, 1))
        if isinstance(span, bool) or not isinstance(span, int) or span < 1:
            raise ValueError("item_spans 的跨度必须是正整数")
        span = min(span, _columns(ctx, spec, group_index))
        status = spec.get("status")
        statuses = spec.get("statuses")
        if isinstance(statuses, list) and card_index < len(statuses):
            status = statuses[card_index]
        state = _status([status], states) or _STATE_ALIASES.get(str(status or "").lower())
        if status and not state:
            ctx.incomplete(f"功能卡状态 {status} 没有原文或规格里的明确颜色对应。", "composition")
        card_states = states
        if state and fields and re.fullmatch(r"[A-Za-z]", str(fields[-1][1] or "").strip()):
            card_states = dict(states, **{str(fields[-1][1]).strip(): state})
        source_state = _status([value for _, value in fields], card_states)
        if len(fields) >= 3 and re.fullmatch(r"[A-Za-z]", str(fields[-1][1] or "").strip()) and not source_state:
            ctx.incomplete(f"功能项字母状态 {str(fields[-1][1]).strip()} 没有原文或逐卡规格的明确对应关系，状态点未推定。", "composition")
        off = spec.get("off_background") == "gray" and (source_state or state) == "off"
        cards.append(_card(fields, ctx, number, icon, illustration, span, status_display, keep_separator,
                           state, position, bool(spec.get("muted") or off), card_states, numeric_emphasis, status_style,
                           trailing_parentheses, preserve_status_text, body_nodes))
        card_spans.append(span)
        card_index += 1
        if inline_after is not None and str(number) == str(inline_after):
            flush_cards()
            parts.append(_inline_figure(spec, ctx, inline_after))

    for node in nodes:
        kind = node.get("type")
        para_fields = _feature_para(node, states, bool(spec.get("status") or isinstance(spec.get("statuses"), list)))
        if kind == "para" and not para_fields:
            cols = str(node.get("text", "")).split("｜")
            if len(cols) == 3 and re.fullmatch(r"[A-Za-z]", cols[-1].strip()):
                ctx.incomplete(f"功能项字母状态 {cols[-1].strip()} 没有本屏原文中的明确对应关系，状态点未推定。", "composition")
        if kind not in ("card", "steps", "bullets", "stats") and not para_fields:
            flush_cards()
        if kind in ("group", "h1", "h2", "h3"):
            if kind in ("group", "h3"):
                begin_group(node.get("name", node.get("text", "")))
            value = node.get("name", node.get("text", ""))
            parts.append(_group_heading(value, ctx, spec, group_index) if kind in ("group", "h3") else _field(value, ctx, "feature-group", "h3"))
        elif kind == "para":
            text = node.get("text", "")
            if para_fields:
                add_card([("feature-name", para_fields[0]), ("feature-text", para_fields[1]),
                          ("feature-status-text", para_fields[2])], keep_separator=_keep_status_separator(node))
            elif _MARK.search(text) and re.match(r"^\s*(?:图例[：:]\s*)?[" + _SYMBOLS + "]", text):
                parts.append(render_status_legend({"nodes": [node], "spec": spec}, ctx))
            else:
                role = "feature-group" if re.match(r"^\*\*.+?\*\*", text) else "feature-note"
                if role == "feature-group":
                    begin_group(text)
                parts.append(_group_heading(text, ctx, spec, group_index) if role == "feature-group" else _field(text, ctx, role))
        elif kind == "legend":
            parts.append(render_status_legend({"nodes": [node], "spec": spec}, ctx))
        elif kind == "card":
            add_card([("feature-name", node.get("name", "")), ("feature-text", node.get("text", ""))])
        elif kind == "steps":
            for index, item in enumerate(node.get("items", [])):
                add_card(_step_fields(item), item.get("n"), _keep_status_separator(node, index), item.get("body_nodes", ()))
        elif kind == "bullets":
            for item in node.get("items", []):
                fields = []
                if item.get("lead") is not None:
                    fields.append(("feature-name", item["lead"]))
                fields.append(("feature-text", item.get("text", "")))
                add_card(fields)
        elif kind == "stats":
            for item in node.get("items", []):
                add_card([("feature-name", item.get("num", "")), ("feature-text", item.get("text", ""))])
        else:
            parts.append('<div class="feature-note-wrap">' + _other_node(node, ctx) + '</div>')
    flush_cards()
    if isinstance(spec.get("statuses"), list) and len(spec["statuses"]) != card_index:
        ctx.incomplete(f"功能卡共有 {card_index} 张，statuses 仅映射 {len(spec['statuses'])} 项，逐卡状态对应未完整。", "composition")
    if spec.get("item_count") is not None:
        expected = spec["item_count"]
        if isinstance(expected, bool) or not isinstance(expected, int) or expected < 1 or expected != card_index:
            ctx.incomplete(f"item_count={expected} 与实际完整输出的 {card_index} 张功能卡不符。", "composition")
        parts[0] = parts[0][:-1] + f' data-item-count="{card_index}">'
    return ''.join(parts) + '</div>'


COMPONENTS = {"feature_card": render_feature_card, "status_legend": render_status_legend}

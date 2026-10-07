"""电脑授权页的真实输入槽和明确选择的按钮状态。"""
import html
import re

from .common import render_nodes, screen_value, spec_of
from .live import _css_size


_BUTTON = re.compile(r"［([^［］]+)］|【([^【】]+)】")
_ACTION = re.compile(r"［([^［］]+)］|【([^【】]+)】|〔([^〔〕]+)〕")
_FORM_PUNCT = re.compile(r"[，。；：！？、,.!?;:）)”’」』]+")
_FORM_COPY_TAIL = re.compile(r"([\w\u3400-\u9fff][，。；：！？、,.!?;:）)”’」』]+)([\s　]*)$")
_KINDS = {"锁定": "danger", "结束": "danger", "锁定 Windows": "danger",
          "解锁": "primary", "开启": "primary", "验证并解锁资料": "primary"}


def _attr(value):
    return html.escape(str(value), quote=True)


def _label(variant):
    # variants 里的括号是状态条件说明，不是按钮上要画的字。
    return str(variant).split("（", 1)[0]


def _variant(text, variant):
    label = _label(variant)
    appearances = {"选中": "selected", "开": "selected", "勾上": "selected",
                   "没选中": "normal", "关": "normal", "没勾": "normal",
                   "不能点": "disabled"}
    if label in appearances:
        return text, appearances[label], False
    if str(variant) == text + "（N）":
        return text, "normal", True
    state = "busy" if "正在" in label or label.endswith("中…") else None
    return label, state, False


def _button(text, ctx, spec, echo=False):
    definitions = screen_value(ctx, "buttons", []) or []
    matches = [item for item in definitions if item.get("text") == text]
    where = spec.get("where", "")
    if where:
        matches = [item for item in matches if item.get("where") == where]
    ambiguous = len(matches) > 1
    definition = matches[0] if len(matches) == 1 else {}
    if ambiguous:
        ctx.warn(f"button_variants：{text} 有多个所在卡，需明确 where，未绑定目标")
    elif where and not definition:
        ctx.warn(f"button_variants：{where} 未找到按钮 {text}，未绑定目标")
    variants = definition.get("variants", []) or []
    choice = spec.get("variant", "normal")
    selected = text
    variant_state, dynamic_count = None, False
    if choice != "normal":
        if isinstance(choice, int) and not isinstance(choice, bool) and 0 <= choice < len(variants):
            selected, variant_state, dynamic_count = _variant(text, variants[choice])
        elif choice in variants:
            selected, variant_state, dynamic_count = _variant(text, choice)
        else:
            ctx.warn(f"button_variants：{text} 没有指定状态 {choice}，使用原文字样")
    default_role = _KINDS.get(text, "secondary")
    if definition and text == "复制给 AI 的说明":
        default_role = "primary"
    role = spec.get("role", default_role)
    if role not in ("primary", "secondary", "danger"):
        ctx.incomplete(f"button_variants：不支持 role={role}，保留次按钮外观", "composition")
        role = "secondary"
    state = variant_state or spec.get("state", "normal")
    if state not in ("normal", "disabled", "busy", "selected"):
        ctx.incomplete(f"button_variants：不支持 state={state}，保留正常外观", "composition")
        state = "normal"
    # 每个按钮各状态共享容纳最长字样的外框；不通过缩字或截字维持尺寸。
    labels = [text] + [_variant(text, item)[0] for item in variants]
    extent = max(sum(0.6 if ord(ch) < 128 else 1 for ch in label) for label in labels)
    height = {"small": "2.25em", "medium": "2.5em", "large": "3em"}.get(spec.get("size", "medium"))
    if height is None:
        ctx.incomplete(f'button_variants：不支持 size={spec["size"]}', "composition")
        height = "2.5em"
    size = f"--slot-button-width:{extent + 2:.2f}em;--slot-button-min-height:{height}"
    extra = ' data-echo="button-state"' if echo or selected != text else ""
    if dynamic_count:
        extra += ' data-dynamic-count="true"'
    if definition:
        actual_where = definition.get("where", "")
        extra += f' data-button-where="{_attr(actual_where)}"'
        if spec.get("address"):
            original_lines = str(screen_value(ctx, "text", "")).splitlines()
            card_name = actual_where.removesuffix("卡片")
            card_lines, in_card = [], False
            for line in original_lines:
                if line.startswith("**"):
                    if in_card:
                        break
                    in_card = line.startswith("**" + card_name + "**")
                elif in_card:
                    card_lines.append(line.strip())
            if spec["address"] in card_lines:
                extra += f' data-address="{_attr(spec["address"])}"'
            else:
                ctx.warn(f"button_variants：address 与 {actual_where} 定稿地址不匹配，未绑定地址")
        if text in ("复制给 AI 的说明", "只复制地址"):
            action = "setup-note" if text == "复制给 AI 的说明" else "address"
            extra += f' data-copy-kind="{action}"'
    key = (str(definition.get("where")) + "::" + text
           if definition and definition.get("where") and len([d for d in definitions if d.get("text") == text]) > 1
           else text if definition or not matches and not where else "")
    if ambiguous or where and not definition:
        key = ""
    if state == "disabled":
        extra += ' disabled aria-disabled="true"'
    elif state == "busy":
        extra += ' aria-busy="true"'
    elif state == "selected":
        extra += ' aria-pressed="true"'
    return (f'<button type="button" class="c-slot-controls-button tb is-{role} is-{state}" '
            f'style="{size}" data-button="{_attr(text)}" data-variant="{_attr(choice)}" '
            f'{ctx.hot("button", key)}{extra}>{ctx.inline(selected)}</button>')


class _ButtonContext:
    def __init__(self, ctx, spec):
        self._ctx, self._spec = ctx, spec

    def __getattr__(self, key):
        return getattr(self._ctx, key)

    def inline(self, text):
        if text is None:
            return self._ctx.inline(text)
        out, pos = [], 0
        for match in _BUTTON.finditer(str(text)):
            out.append(self._ctx.inline(str(text)[pos:match.start()]))
            label = match.group(1) or match.group(2)
            per_button = {key: self._spec[key] for key in ("where", "address", "variant", "size") if key in self._spec}
            per_button.update(self._spec.get("states", {}).get(label, {}))
            out.append(_button(label, self._ctx, per_button))
            pos = match.end()
        out.append(self._ctx.inline(str(text)[pos:]))
        return "".join(out)


def button_context(ctx, spec=None, nodes=None):
    """供整卡所有者接入；每张卡独立建立文字、where 和地址的上下文。"""
    scoped = dict(spec or {})
    nodes = nodes or []
    names = [node.get("name", "") for node in nodes if node.get("type") in ("card", "group")]
    if not scoped.get("where") and len(names) == 1:
        candidate = names[0] + "卡片"
        if any(item.get("where") == candidate for item in screen_value(ctx, "buttons", []) or []):
            scoped["where"] = candidate
    addresses = [str(node.get("text", "")).strip() for node in nodes
                 if node.get("type") == "para" and re.fullmatch(r"https?://\S+", str(node.get("text", "")).strip())]
    if not scoped.get("address") and len(addresses) == 1:
        scoped["address"] = addresses[0]
    if scoped.get("address"):
        source = screen_value(ctx, "text", "")
        if scoped["address"] not in str(source).splitlines():
            ctx.warn("button_variants：指定 address 不在本屏定稿地址行，未绑定该地址")
            scoped.pop("address")
    return _ButtonContext(ctx, scoped)


def _controls_nodes(nodes, ctx):
    # common 的 linkrow 用 links 重建会丢失按钮记号；原 src 保留真实类型及顺序。
    preserved = [dict(node, type="para", text="\n".join(node["src"]))
                 if node.get("type") == "linkrow" and node.get("src") else node for node in nodes]
    return render_nodes(preserved, ctx)


def _columns(spec, ctx):
    value = spec.get("columns_v", spec.get("columns", 1)) if ctx.orient == "v" else spec.get("columns", 1)
    if isinstance(value, bool) or not isinstance(value, int) or value < 1:
        ctx.incomplete(f"控件：columns 需为正整数，收到 {value}", "composition")
        return 1
    return value


def _size(spec, ctx):
    value = spec.get("size", "medium")
    if value not in ("small", "medium", "large"):
        ctx.incomplete(f"控件：不支持 size={value}", "composition")
        return "medium"
    return value


def _action_layout(nodes, node_ctx, layout, ctx):
    layout = dict(layout)
    for key in ("links_as_buttons", "keep_same_row"):
        if key in layout and type(layout[key]) is not bool:
            ctx.incomplete(f"button_variants.items_layout.{key} 必须是 true/false", "composition")
            layout[key] = False
    allowed = {"direction", "order", "links_as_buttons", "keep_same_row"}
    for key in layout.keys() - allowed:
        ctx.incomplete(f"button_variants.items_layout：不支持子字段 {key}", "composition")
    direction = layout.get("direction", "horizontal")
    if direction not in ("horizontal", "vertical"):
        ctx.incomplete(f"button_variants.items_layout：不支持 direction={direction}", "composition")
        direction = "horizontal"
    out, labels = [], []
    for node in nodes:
        raw = '\n'.join(node.get("src", [])) or node.get("text", "")
        matches = list(_ACTION.finditer(raw))
        remainder = _ACTION.sub("", raw).strip()
        if node.get("type") not in ("para", "linkrow") or not matches or remainder:
            out.append(_controls_nodes([node], node_ctx))
            ctx.incomplete("button_variants.items_layout：本块含操作行以外的正文，保留原字，操作行构图未全执行", "composition")
            continue
        pieces = []
        for match in matches:
            label = next(group for group in match.groups() if group is not None)
            labels.append(label)
            rendered = node_ctx.inline(match.group(0))
            if layout.get("links_as_buttons") and match.group(3) is not None:
                rendered = re.sub(r'<a class="([^"]*)"',
                                  lambda m: '<a class="' + m.group(1) + ' c-slot-controls-linkbutton"', rendered)
            pieces.append(f'<span class="c-slot-controls-action">{rendered}</span>')
        same_row = bool(layout.get("keep_same_row")) and direction == "horizontal"
        out.append(f'<div class="c-slot-controls-actionline is-{direction}" '
                   f'data-keep-same-row="{str(same_row).lower()}" '
                   f'style="--slot-controls-actions:{len(pieces)}">' + ''.join(pieces) + '</div>')
    if layout.get("order") is not None and layout["order"] != labels:
        ctx.incomplete("button_variants.items_layout.order 与本块原操作顺序不一致；保留原字序，需修规格分配", "composition")
    return ''.join(out)


def render_button_variants(block, ctx):
    """默认只渲染 nodes；spec.buttons 明确选择独立的变体样张。"""
    spec = spec_of(block)
    nodes = block.get("nodes", []) or []
    node_ctx = button_context(ctx, spec, nodes)
    layout = spec.get("items_layout")
    if layout is not None and not isinstance(layout, dict):
        ctx.incomplete("button_variants.items_layout 必须是构图字段对象", "composition")
    columns = _columns(spec, ctx)
    size = _size(spec, ctx)
    if isinstance(layout, dict) and layout:
        body = _action_layout(nodes, node_ctx, layout, ctx)
    else:
        body = _controls_nodes(nodes, node_ctx) if nodes else ""
    selected = spec.get("buttons", [])
    if isinstance(selected, str):
        selected = [selected]
    if selected:
        definitions = screen_value(ctx, "buttons", []) or []
        known = {item.get("text") for item in definitions}
        buttons = []
        for selection in selected:
            item = {"text": selection} if isinstance(selection, str) else selection
            text = item.get("text", "")
            if text not in known:
                ctx.warn(f"button_variants：未在本屏 buttons 找到 {text}，没有生成变体")
                continue
            buttons.append(_button(text, ctx, item, echo=True))
        body += '<div class="c-slot-controls-row">' + "".join(buttons) + '</div>'
    return (f'<div class="c-slot-buttons c-slot-controls" data-comp="button_variants" '
            f'data-size="{size}" style="--slot-controls-columns:{columns}">{body}</div>')


def _input(field, ctx, layout=None):
    layout = layout or {}
    sizing = {}
    for key, axis in (("width", "width"), ("height", "height")):
        if key in layout:
            value = _css_size(layout[key], ctx=ctx, axis=axis, layout=layout)
            numeric = re.match(r"^(-?\d+(?:\.\d+)?)", str(value or ""))
            if value is None or numeric is None or float(numeric.group(1)) <= 0:
                ctx.incomplete(f'input_field.{field}：不支持 {key}={layout[key]}', "composition")
            else:
                sizing[f"--slot-input-{key}"] = value
    if layout.get("empty", True) is not True:
        ctx.incomplete(f"input_field.{field}：输入框必须留空，empty=false 未执行", "composition")
    for key in layout.keys() - {"width", "height", "after_item", "empty"}:
        ctx.incomplete(f"input_field.{field}：不支持构图子字段 {key}", "composition")
    style = ';'.join(f'{key}:{value}' for key, value in sizing.items())
    constraints = ('type="number" inputmode="decimal" min="0.5" max="72" step="any"'
                   if field == "duration" else
                   'type="text" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="one-time-code"')
    return (f'<input class="c-slot-controls-input is-{field}" name="{field}" '
            f'data-field="{field}" data-live-part="{field}" value="" style="{_attr(style)}" {constraints} '
            f'{ctx.hot("live", "ca-form")}>')


def _form_copy(ctx, text):
    """末字与原标点一起断行，不能把动作行前的冒号留成单字行。"""
    match = _FORM_COPY_TAIL.search(text)
    if not match:
        return ctx.inline(text)
    return (ctx.inline(text[:match.start()])
            + '<span class="c-slot-controls-copy-tail">' + ctx.inline(match.group(1)) + '</span>'
            + ctx.inline(match.group(2)))


def _form_punctuation(ctx, text):
    return (f'<span class="c-slot-controls-action-punctuation tb">{ctx.inline(text)}</span>'
            if text else '')


def _form_action_tail(rendered, punctuation):
    """按钮与其后的原标点是一个 flex 项，按钮文字仍可在内部换行。"""
    return '<span class="c-slot-controls-action-tail">' + rendered + punctuation + '</span>'


class _FormContext:
    """只在原按钮位置插入空输入，保持每个源字和标点的 DOM 顺序。"""
    def __init__(self, ctx, spec, layout, fields, placed, item_number):
        self.ctx, self.spec, self.layout = ctx, spec, layout
        self.fields, self.placed, self.item_number = fields, placed, item_number
        self.field_row = None

    def __getattr__(self, key):
        return getattr(self.ctx, key)

    def inline(self, text):
        text = str(text or "")
        out, actions, pos = [], [], 0

        def flush_actions():
            if actions:
                out.append('<span class="c-slot-controls-below-action">' + ''.join(actions) + '</span>')
                actions.clear()

        for match in _BUTTON.finditer(text):
            between = text[pos:match.start()]
            if between.strip():
                flush_actions()
                out.append(_form_copy(self.ctx, between))
            elif between:
                (actions if actions else out).append(self.ctx.inline(between))
            label = match.group(1) or match.group(2)
            suffix = _FORM_PUNCT.match(text, match.end())
            punctuation = _form_punctuation(self.ctx, suffix.group() if suffix else '')
            below_action = False
            button_spec = {key: self.spec[key] for key in ("variant", "size") if key in self.spec}
            button_spec.update(self.spec.get("states", {}).get(label, {}))
            save = self.layout.get("save_default", {})
            submit = self.layout.get("submit", {})
            is_submit = (isinstance(submit, dict) and label == submit.get("text")
                         or screen_value(self.ctx, "id", "") == "computer-access-02"
                         and label == "验证并解锁资料")
            if isinstance(save, dict) and label == save.get("text") and save.get("type") == "checkbox":
                definition = next((item for item in screen_value(self.ctx, "buttons", []) or []
                                   if item.get("text") == label), None)
                if definition:
                    state = button_spec.get("state", "normal")
                    extra = ' checked' if state == "selected" else ''
                    if state == "disabled":
                        extra += ' disabled'
                    rendered = (f'<label class="c-slot-controls-checkbox tb" data-button="{_attr(label)}" '
                                f'{self.ctx.hot("button", label)}><input type="checkbox" name="save_default" '
                                f'value="true"{extra}><span>{self.ctx.inline(label)}</span></label>')
                else:
                    rendered = _button(label, self.ctx, button_spec)
                    self.ctx.incomplete("input_field：save_default 的文字不在本屏真实按钮定义中", "composition")
                rendered = _form_action_tail(rendered, punctuation)
            else:
                if isinstance(submit, dict) and label == submit.get("text"):
                    button_spec.update({key: submit[key] for key in ("role", "state") if key in submit})
                rendered = _button(label, self.ctx, button_spec)
                totp = self.layout.get("totp", {})
                if (isinstance(submit, dict) and label == submit.get("text") and "totp" in self.fields
                        and "totp" not in self.placed and isinstance(totp, dict)
                        and self.spec.get("place_fields", True)
                        and str(totp.get("after_item", 4)) == str(self.item_number)):
                    position = submit.get("position", "below_totp")
                    if position not in ("right_of_totp", "below_totp"):
                        self.ctx.incomplete(f"input_field.submit：不支持 position={position}", "composition")
                        position = "below_totp"
                    input_html = _input("totp", self.ctx, totp)
                    if self.ctx.orient == "v":
                        marker = '<span data-slot-paired-field="totp"></span>'
                        self.field_row = (marker, input_html, rendered + punctuation, position)
                        rendered = marker
                    else:
                        rendered = (f'<span class="c-slot-controls-fieldrow is-{position}">'
                                    + input_html + '<span class="c-slot-controls-submit-tail tb">'
                                    + rendered + punctuation + '</span></span>')
                    self.placed.add("totp")
                else:
                    rendered = ('<span class="c-slot-controls-submit-tail tb">' + rendered + punctuation + '</span>'
                                if is_submit else _form_action_tail(rendered, punctuation))
                    below_action = self.layout.get("buttons") == "below_copy"
            if below_action:
                actions.append(rendered)
            else:
                flush_actions()
                out.append(rendered)
            pos = suffix.end() if suffix else match.end()
        flush_actions()
        out.append(_form_copy(self.ctx, text[pos:]))
        return ''.join(out)


def _input_layout(block, ctx):
    spec, nodes = spec_of(block), block.get("nodes", []) or []
    layout = spec["items_layout"]
    allowed = {"direction", "steps_count", "number_style", "connector", "buttons", "duration", "totp",
               "submit", "save_default", "step2_buttons", "step3_buttons", "split_items_into_separate_refs",
               "card_per_step", "step_icon_subjects", "step_icon_position", "do_not_repeat_inline_buttons"}
    for key in layout.keys() - allowed:
        ctx.incomplete(f"input_field.items_layout：不支持子字段 {key}", "composition")
    for key in ("duration", "totp", "submit", "save_default"):
        if key in layout and not isinstance(layout[key], dict):
            ctx.incomplete(f"input_field.items_layout.{key} 必须是构图字段对象，未执行该字段", "composition")
    for key in ("card_per_step", "split_items_into_separate_refs", "do_not_repeat_inline_buttons"):
        if key in layout and type(layout[key]) is not bool:
            ctx.incomplete(f"input_field.items_layout.{key} 必须是 true/false", "composition")
    if layout.get("direction", "vertical") != "vertical":
        ctx.incomplete("input_field.items_layout：仅支持原四步竖排方向", "composition")
    if layout.get("number_style", "green_circle") != "green_circle":
        ctx.incomplete("input_field.items_layout：仅支持 green_circle 编号", "composition")
    if layout.get("buttons", "inline_after_copy") not in ("inline_after_copy", "below_copy"):
        ctx.incomplete("input_field.items_layout：未知按钮排法", "composition")
    if layout.get("split_items_into_separate_refs"):
        ctx.incomplete("input_field：本组件收到完整 steps，分 text_ref 需页规格先分配", "composition")
    for key, allowed_subfields in (("submit", {"text", "role", "state", "position"}),
                                   ("save_default", {"type", "text"})):
        if isinstance(layout.get(key), dict):
            for subfield in layout[key].keys() - allowed_subfields:
                ctx.incomplete(f"input_field.{key}：不支持子字段 {subfield}", "composition")
    if isinstance(layout.get("save_default"), dict) and layout["save_default"].get("type") != "checkbox":
        ctx.incomplete("input_field.save_default：只支持原保存默认时长复选框", "composition")
    columns, size = _columns(spec, ctx), _size(spec, ctx)
    fields = spec.get("fields", [spec["field"]] if spec.get("field") else ["duration", "totp"])
    fields = [fields] if isinstance(fields, str) else list(fields or [])
    fields = list(dict.fromkeys(fields))
    invalid = [field for field in fields if field not in ("duration", "totp")]
    if invalid:
        ctx.incomplete(f"input_field：不认识输入槽 {invalid}", "composition")
    fields = [field for field in fields if field in ("duration", "totp")]
    steps = [item for node in nodes if node.get("type") == "steps" for item in node.get("items", [])]
    source_buttons = [match.group(1) or match.group(2) for item in steps
                      for match in _BUTTON.finditer(item.get("text", ""))]
    for key in ("submit", "save_default"):
        config = layout.get(key)
        if isinstance(config, dict) and config.get("text") not in source_buttons:
            ctx.incomplete(f"input_field.{key}：指定文字不在本块原按钮中，未补字或补按钮", "composition")
    if layout.get("steps_count", len(steps)) != len(steps):
        ctx.incomplete("input_field.items_layout.steps_count 与真实原步骤数不一致", "composition")
    for number in (2, 3):
        expected = layout.get(f"step{number}_buttons")
        item = next((item for item in steps if str(item.get("n")) == str(number)), {})
        actual = [match.group(1) or match.group(2) for match in _BUTTON.finditer(item.get("text", ""))]
        if expected is not None and (not isinstance(expected, list) or actual[:len(expected)] != expected):
            ctx.incomplete(f"input_field：第{number}步按钮清单与原文不一致", "composition")
    connector = layout.get("connector", spec.get("connector", "none"))
    if connector not in ("none", "arrow", "thin_green_vertical_line"):
        ctx.incomplete(f"input_field：不支持 connector={connector}", "composition")
        connector = "none"
    cards = layout.get("card_per_step", False) is True
    illustration = spec.get("illustration", "none")
    if illustration not in ("none", "right_inside"):
        ctx.incomplete(f"input_field：不支持 illustration={illustration}", "composition")
    elif illustration == "right_inside" and not cards:
        ctx.incomplete("input_field：right_inside 需完整步骤卡和图标槽，未放图", "composition")
    subjects = layout.get("step_icon_subjects", [])
    icons = []
    if cards and subjects:
        if len(subjects) != len(steps) or layout.get("step_icon_position") != "upper_right_inside":
            ctx.incomplete("input_field：步骤图标清单/位置与完整步骤不一致", "composition")
        else:
            icons = ctx.take_icons(len(steps), spec)
            if len(icons) != len(steps):
                ctx.incomplete(f"input_field：四步卡缺少{len(steps)}个按原槽顺序的无字图标；不复用右侧三条说明图", "asset")
                icons = []
    field_steps = dict(spec.get("field_steps", {"duration": 3, "totp": 4}))
    step_numbers = {str(item.get("n")) for item in steps}
    for field in fields:
        if isinstance(layout.get(field), dict) and "after_item" in layout[field]:
            field_steps[field] = layout[field]["after_item"]
        if str(field_steps.get(field)) not in step_numbers:
            ctx.incomplete(f"input_field.{field}.after_item 不在本块真实步骤中；输入仍保留，指定步骤构图未执行", "composition")
    placed, out, index = set(), [], 0
    for node in nodes:
        if node.get("type") != "steps":
            out.append(_controls_nodes([node], button_context(ctx, spec)))
            continue
        for item in node.get("items", []):
            n = item.get("n", "")
            form_ctx = _FormContext(ctx, spec, layout, fields, placed, n)
            lead = '<b>' + form_ctx.inline(item["lead"]) + '</b>　' if item.get("lead") else ''
            copy = lead + form_ctx.inline(str(item.get("text", "")).replace("｜", ""))
            paired = ''
            if form_ctx.field_row:
                marker, input_html, submit_html, position = form_ctx.field_row
                copy, _, suffix = copy.partition(marker)
                paired = (f'<span class="c-slot-controls-fieldrow is-{position}">'
                          + input_html + '<span class="c-slot-controls-submit-tail tb">'
                          + submit_html + suffix + '</span></span>')
            icon = (f'<img class="c-slot-controls-step-icon" src="{_attr(icons[index])}" '
                    'alt="" aria-hidden="true">') if icons else ''
            contents = (f'<div class="c-slot-controls-step-head {"has-icon" if icon else ""}">'
                        f'<span class="slot-step-number tb">{ctx.inline(str(n))}</span>'
                        f'<div class="tb c-slot-controls-step-copy">{copy}</div>{icon}</div>{paired}')
            for field in fields:
                if field not in placed and str(field_steps.get(field)) == str(n) and spec.get("place_fields", True):
                    contents += _input(field, ctx, layout.get(field) if isinstance(layout.get(field), dict) else {})
                    placed.add(field)
            classes = 'c-slot-controls-step' + (' card' if cards else '')
            out.append(f'<div class="{classes}" data-step="{_attr(n)}">{contents}</div>')
            index += 1
    for field in fields:
        if field not in placed:
            out.append(_input(field, ctx, layout.get(field) if isinstance(layout.get(field), dict) else {}))
    return (f'<div class="c-slot-input c-slot-controls is-structured" data-comp="input_field" '
            f'data-orient="{_attr(ctx.orient)}" data-size="{size}" data-connector="{connector}" '
            f'style="--slot-controls-columns:{columns}">' + ''.join(out) + '</div>')


def render_input_field(block, ctx):
    """值、默认时长及验证码都留白，供运行时填写。"""
    spec = spec_of(block)
    if spec.get("items_layout") is not None and not isinstance(spec["items_layout"], dict):
        ctx.incomplete("input_field.items_layout 必须是构图字段对象", "composition")
    if isinstance(spec.get("items_layout"), dict) and spec["items_layout"]:
        return _input_layout(block, ctx)
    if spec.get("connector") not in (None, "", "none", "auto") or spec.get("illustration") not in (None, "", "none", "auto"):
        return _input_layout(dict(block, spec=dict(spec, items_layout={})), ctx)
    fields = spec.get("fields")
    if fields is None:
        if spec.get("field"):
            fields = [spec["field"]]
        elif screen_value(ctx, "id", "") == "computer-access-02":
            fields = ["duration", "totp"]
        else:
            fields = []
            ctx.warn("input_field：需要 fields 或 field 指定实际输入槽")
    if isinstance(fields, str):
        fields = [fields]
    valid_fields = []
    for field in fields:
        if field not in ("duration", "totp"):
            ctx.warn(f"input_field：不认识字段 {field}，没有生成输入槽")
            continue
        if field not in valid_fields:
            valid_fields.append(field)
    nodes = block.get("nodes", []) or []
    node_ctx = _ButtonContext(ctx, spec)
    field_steps = spec.get("field_steps", {"duration": 3, "totp": 4})
    placed = set()
    parts = []
    for node in nodes:
        if node.get("type") != "steps" or spec.get("place_fields", True) is False:
            parts.append(render_nodes([node], node_ctx))
            continue
        for item in node.get("items", []):
            single = dict(node, items=[item])
            contents = render_nodes([single], node_ctx)
            for field in valid_fields:
                if field not in placed and str(field_steps.get(field)) == str(item.get("n")):
                    contents += _input(field, ctx)
                    placed.add(field)
            parts.append('<div class="c-slot-controls-step">' + contents + '</div>')
    for field in valid_fields:
        if field not in placed:
            parts.append(_input(field, ctx))
    body = ''.join(parts)
    return (f'<div class="c-slot-input c-slot-controls" data-comp="input_field" '
            f'data-orient="{_attr(ctx.orient)}" data-size="{_size(spec, ctx)}" '
            f'style="--slot-controls-columns:{_columns(spec, ctx)}">{body}</div>')

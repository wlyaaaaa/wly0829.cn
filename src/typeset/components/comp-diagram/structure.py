"""对比、架构与地图：布局只消费顺序节点，不补写图中的名称。"""
from pathlib import Path
from engine.assets import ASSET_ROOT
import hashlib
import json
import re

from ._shared import attr, images, inline, render_nodes, render_unit, units


def _incomplete(ctx, message, kind="composition"):
    handler = getattr(ctx, "incomplete", None)
    if callable(handler):
        handler(message, kind)
    else:
        ctx.warn(message)


def _check_nested_fields(config, fields, ctx, label):
    for key, value in config.items():
        if key not in fields and key not in ("note", "notes", "comment", "source_note") and value not in (None, "", "none", "auto", False, [], {}):
            _incomplete(ctx, f"{label} 不消费字段 {key}，这项结构没有执行")


def _columns(spec, ctx, default=2):
    value = spec.get("columns", default)
    try:
        columns = int(value) if ctx.orient == "h" else int(spec.get("columns_v", 1))
        if columns < 1:
            raise ValueError
        return columns
    except (TypeError, ValueError):
        _incomplete(ctx, "示意图 columns 必须是整数，采用默认列数")
        return default if ctx.orient == "h" else 1


def _root(kind, ctx, extra="", style=""):
    return f'<div class="c-diagram c-diagram-{kind} {extra}" data-comp="{kind}" data-orient="{attr(ctx.orient)}" style="{attr(style)}">'


def _has_text(unit):
    return any(unit.get(k) for k in ("name", "text", "lead", "num", "n", "src", "links", "rows", "items", "lines", "header"))


def _natural_groups(items):
    """组名与后续节点不分离；独立 card 也可成为一组。"""
    grouped = []
    for item in items:
        if item.get("type") in ("group", "h1", "h2", "h3", "card") or not grouped:
            grouped.append([item])
        else:
            grouped[-1].append(item)
    if len(grouped) == 1 and not any(u.get("type") in ("group", "h1", "h2", "h3", "card") for u in items):
        return [[item] for item in items]
    return grouped


def _source_text(unit):
    return tuple(str(value).replace("**", "").replace("`", "") for value in
                 (unit.get("name") or unit.get("lead") or unit.get("num") or unit.get("text") or "", unit.get("text") or ""))


def _groups(items, declarations, ctx):
    """count 是原子单元数量；text_ref 是按定稿顺序的分组起点。"""
    if not declarations:
        return _natural_groups(items), []
    if not isinstance(declarations, list):
        _incomplete(ctx, "示意图 groups/layers/branches 必须是数组，保留原始顺序分组")
        return _natural_groups(items), []
    cursor, grouped, metadata = 0, [], []
    for declaration_index, declaration in enumerate(declarations):
        config = declaration if isinstance(declaration, dict) else {"count": declaration}
        if "text_ref" in config:
            ref = str(config["text_ref"]).split("|")[0]
            found = next((i for i in range(cursor, len(items)) if any(t.startswith(ref) for t in _source_text(items[i]))), None)
            if found is None:
                _incomplete(ctx, f"示意图分组起点不存在：{ref}")
                continue
            if found > cursor:
                grouped.append(items[cursor:found]); metadata.append({})
            cursor = found
            # 下一次 text_ref 出现之前归同一组；末组一直到结尾。
            following = declarations[declaration_index + 1:]
            next_ref = next((d.get("text_ref") for d in following if isinstance(d, dict) and d.get("text_ref")), None)
            end = next((i for i in range(cursor + 1, len(items)) if next_ref and any(t.startswith(str(next_ref).split("|")[0]) for t in _source_text(items[i]))), len(items))
        else:
            try:
                count = int(config.get("count", 1))
            except (TypeError, ValueError):
                _incomplete(ctx, "示意图分组 count 必须是整数，当前组不消费文字")
                continue
            if count <= 0:
                _incomplete(ctx, "示意图分组 count 必须大于零，跳过空组")
                continue
            end = min(len(items), cursor + count)
            if cursor + count > len(items):
                _incomplete(ctx, "示意图分组数量超过定稿单元数量，未增加空牌")
        if end > cursor:
            grouped.append(items[cursor:end]); metadata.append(config)
        cursor = end
    if cursor < len(items):
        grouped.append(items[cursor:]); metadata.append({})
        _incomplete(ctx, "示意图规格没有分配完定稿单元，剩余内容按原顺序完整保留")
    return grouped, metadata


def _topology_unit(unit, ctx, text_layout="block"):
    if text_layout != "inline" or unit.get("type") not in ("card", "item"):
        return render_unit(unit, ctx)
    name = unit.get("name") if unit.get("type") == "card" else unit.get("lead", unit.get("num"))
    parts = []
    if unit.get("n") is not None:
        parts.append(f'<span class="dg-number" data-role="step_number">{inline(unit["n"], ctx)}</span>')
    if name:
        parts.append(f'<span class="dg-name" data-role="name">{inline(name, ctx)}</span>')
    if unit.get("text"):
        parts.append(f'<span class="dg-body" data-role="body">{inline(unit["text"], ctx)}</span>')
    return '<div class="ds-inline-unit dg-body tb" data-role="body">' + ''.join(parts) + '</div>'


def _comparison_status_text(text, ctx, enabled=False):
    if not enabled:
        return inline(text, ctx)
    pattern = r"(?<=[（(＝])(没用过|说不准)(?=[）)]|$|　)"
    output, cursor = [], 0
    for match in re.finditer(pattern, text):
        output.append(inline(text[cursor:match.start()], ctx))
        status = "unused" if match.group(1) == "没用过" else "uncertain"
        output.append(f'<span class="ds-status-dot ds-status-{status}" data-status="{status}" aria-hidden="true"></span>')
        output.append(inline(match.group(1), ctx))
        cursor = match.end()
    output.append(inline(text[cursor:], ctx))
    return ''.join(output)


def _comparison_unit(unit, ctx, spec):
    if unit.get("type") != "item":
        if spec.get("status_dots") and unit.get("type") == "para":
            return '<div class="dg-body tb" data-role="body">' + _comparison_status_text(unit.get("text", ""), ctx, True) + '</div>'
        return render_unit(unit, ctx)
    parts = []
    lead = unit.get("lead", unit.get("num"))
    if spec.get("number_heading") and unit.get("n") is not None and lead:
        parts.append('<div class="ds-number-heading dg-name tb" data-role="name">' +
                     f'<span class="dg-number" data-role="step_number">{inline(unit["n"], ctx)}</span>' +
                     f'<span class="dg-name" data-role="name">{inline(lead, ctx)}</span></div>')
    else:
        if unit.get("n") is not None:
            parts.append(f'<span class="dg-number tb" data-role="step_number">{inline(unit["n"], ctx)}</span>')
        if lead:
            parts.append(f'<div class="dg-name tb" data-role="name">{inline(lead, ctx)}</div>')
    if unit.get("text"):
        parts.append('<div class="dg-body tb" data-role="body">' + _comparison_status_text(unit["text"], ctx, spec.get("status_dots", False)) + '</div>')
    return ''.join(parts)


def _panel(group, ctx, css="", icon=None, style="", attrs="", text_layout="block"):
    body = "".join(_topology_unit(unit, ctx, text_layout) for unit in group)
    if not body or not any(_has_text(unit) for unit in group):
        return body
    art = f'<img class="ds-icon" src="{attr(icon)}" alt="">' if icon else ""
    return f'<section class="card ds-panel {css}" style="{attr(style)}" {attrs}>{art}<div class="ds-panel-text">{body}</div></section>'


def _paired_comparison(grouped, spec, ctx, icons):
    if len(grouped) < 2:
        _incomplete(ctx, "paired 对比至少需要两组，保留普通分组")
        return None
    sides = []
    for group in grouped[:2]:
        first_item = next((i for i, unit in enumerate(group) if unit.get("type") == "item"), None)
        if first_item is None or any(unit.get("type") != "item" for unit in group[first_item:]):
            _incomplete(ctx, "paired 两组须由组头和单条 item 组成，保留普通分组以完整显示其它节点")
            return None
        sides.append((group[:first_item], group[first_item:]))
    left_items = sides[0][1]
    number_rows = {str(unit["n"]): i for i, unit in enumerate(left_items) if unit.get("n") is not None}
    max_items = max(len(sides[0][1]), len(sides[1][1]))
    output = [_root("comparison", ctx, "ds-comparison-paired", "--ds-columns:2"), '<div class="ds-paired-grid">']
    for side, (header, side_items) in enumerate(sides):
        column = side + 1 if ctx.orient == "h" else "1 / -1"
        # 原两组标题各只出现一次，视觉同置顶；DOM 仍是左组完整文字后右组。
        header_column = side + 1
        if header:
            output.append(_panel(header, ctx, f"ds-pair-header ds-pair-side-{side}",
                                 style=f"grid-column:{header_column};grid-row:1"))
        for index, unit in enumerate(side_items):
            paired_index = number_rows.get(str(unit.get("n")), index) if side else index
            row = paired_index + 2 if ctx.orient == "h" else 2 * paired_index + 2 + side
            connector = " ds-pair-connector" if side == 1 and spec.get("connector", "arrow") in ("arrow", "ribbon") else ""
            icon_index = sum(len(part[1]) for part in sides[:side]) + index
            output.append(_panel([unit], ctx, f"ds-pair-item ds-pair-side-{side}{connector}",
                                 icons[icon_index] if icon_index < len(icons) else None,
                                 f"grid-column:{column};grid-row:{row}"))
    footer_row = max_items + 2 if ctx.orient == "h" else max_items * 2 + 2
    for group in grouped[2:]:
        output.append(_panel(group, ctx, "ds-pair-footer", style=f"grid-column:1 / -1;grid-row:{footer_row}"))
        footer_row += 1
    output.append('</div></div>')
    ctx.warn("paired 两组原标题同置顶且各显示一次；旧侧浅灰虚线／新侧淡绿实线沿每项保持，配对箭头已实现，新外观待样张审核")
    return "".join(output)


def _mapped_icon(spec, ctx, unit, index, field="item_icon_map", list_field="item_icons", kind="icons"):
    mapping = spec.get(field) or spec.get("icon_map") or {}
    selected = None
    if isinstance(mapping, dict):
        texts = _source_text(unit)
        selected = next((value for ref, value in mapping.items() if str(ref) and any(text.startswith(str(ref).replace("**", "").replace("`", "")) for text in texts)), None)
    choices = spec.get(list_field)
    if selected is None and isinstance(choices, list) and index < len(choices):
        selected = choices[index]
    if selected is None or selected is False or selected == "" or selected == "none":
        return None
    # 此处只允许明确素材项；绝不从 auto 或 manifest 首项推断语义。
    if selected == "auto":
        _incomplete(ctx, "逐条图标需明确文件或候选索引，未使用 auto 随机分配")
        return None
    if isinstance(selected, str) and not selected.startswith(("file:", "data:")):
        path = Path(selected)
        if not path.is_absolute():
            rooted = Path(ASSET_ROOT) / path
            if rooted.is_file():
                selected = str(rooted)
    urls = images(ctx, {kind: [selected]}, kind)
    return urls[0] if urls else None


def _inline_comparison(items, spec, ctx):
    refs = spec.get("inline_groups")
    if not isinstance(refs, list) or not refs:
        _incomplete(ctx, "inline_groups 须为原文起点字符串数组，保留普通排版")
        return None
    output = [_root("comparison", ctx, "ds-comparison-inline", f"--ds-columns:{_columns(spec, ctx)}"), '<section class="card ds-panel ds-inline-panel">']
    found_any = False
    part_index = 0
    for unit in items:
        text = unit.get("text", "")
        starts = []
        cursor = 0
        if unit.get("type") == "para":
            for ref in refs:
                match = re.search(r"(?:\*\*)?" + re.escape(str(ref)) + r"(?:\*\*)?", text[cursor:])
                if match is None:
                    starts = []
                    break
                starts.append(cursor + match.start())
                cursor += match.end()
        if len(starts) != len(refs):
            output.append(f'<div class="ds-inline-unsplit">{render_unit(unit, ctx)}</div>')
            continue
        starts[0] = 0
        boundaries = starts + [len(text)]
        output.append('<div class="ds-inline-halves">')
        for start, end in zip(boundaries, boundaries[1:]):
            fragment = dict(unit, text=text[start:end])
            icon = _mapped_icon(spec, ctx, fragment, part_index, "inline_icon_map", "inline_icons")
            art = f'<img class="ds-item-icon" src="{attr(icon)}" alt="">' if icon else ""
            output.append(f'<div class="ds-inline-half {"ds-has-icon" if icon else ""}">{art}<div class="ds-inline-text">{render_unit(fragment, ctx)}</div></div>')
            part_index += 1
        output.append('</div>')
        found_any = True
    output.append('</section></div>')
    if not found_any:
        _incomplete(ctx, "inline_groups 起点未在同一 para 中按定稿顺序匹配，全部文字仍原样保留")
    if spec.get("illustration") == "left_inside" and not spec.get("inline_icon_map") and not isinstance(spec.get("inline_icons"), list):
        _incomplete(ctx, "inline_groups 两半左图尚无明确语义素材映射，未将 auto 首图误配给回执", "asset")
    return "".join(output)


def _item_comparison(grouped, spec, ctx, cols):
    output = [_root("comparison", ctx, "ds-comparison-items", f"--ds-columns:{cols};--ds-comparison-align:{spec.get('align_items', 'stretch')}"), '<div class="ds-comparison-grid">']
    item_index, missing = 0, 0
    markers = spec.get("group_markers") or []
    for group_index, group in enumerate(grouped):
        output.append('<section class="card ds-panel ds-item-group">')
        for unit in group:
            if unit.get("type") == "item":
                icon = _mapped_icon(spec, ctx, unit, item_index)
                if not icon:
                    missing += 1
                art = f'<img class="ds-item-icon" src="{attr(icon)}" alt="">' if icon else ""
                output.append(f'<div class="card ds-item-row {"ds-has-icon" if icon else ""}">{art}<div class="ds-item-text">{_comparison_unit(unit, ctx, spec)}</div></div>')
                item_index += 1
            else:
                title = _source_text(unit)[0]
                marker = markers[group_index] if group_index < len(markers) else "check" if title == "它管的" else "cross" if title == "它不管的" else None
                shape = f'<span class="ds-group-marker ds-marker-{marker}" aria-hidden="true"></span>' if marker in ("check", "cross") else ""
                output.append(f'<div class="ds-item-heading">{shape}<div class="ds-item-heading-text">{_comparison_unit(unit, ctx, spec)}</div></div>')
        output.append('</section>')
    output.append('</div></div>')
    if missing:
        _incomplete(ctx, f"comparison 逐条左图缺少 {missing} 项明确素材映射；白色内行和原文均已实现，未从 manifest 随机取组头或小锁", "asset")
    return "".join(output)


def _group_comparison(grouped, spec, ctx, cols, metadata=None):
    weights = spec.get("group_image_columns", [35, 65])
    try:
        image_weight, text_weight = float(weights[0]), float(weights[1])
        if image_weight <= 0 or text_weight <= 0:
            raise ValueError
    except (TypeError, ValueError, IndexError):
        image_weight, text_weight = 35, 65
        _incomplete(ctx, "group_image_columns 需要两个正数权重，当前结构未执行指定比例")
    header_position = spec.get("group_header_position", "with_text")
    if header_position not in ("with_image", "with_text"):
        _incomplete(ctx, f"comparison 不消费group_header_position={header_position}，原字保留")
        header_position = "with_text"
    output = [_root("comparison", ctx, "ds-comparison-group-side", f"--ds-columns:{cols};--ds-comparison-align:{spec.get('align_items', 'stretch')};--ds-group-image-track:{image_weight:g}fr;--ds-group-text-track:{text_weight:g}fr"), '<div class="ds-comparison-grid">']
    metadata = metadata or []
    asset_spec = dict(spec)
    if not asset_spec.get("group_images") and isinstance(spec.get("icons"), list):
        asset_spec["group_images"] = spec["icons"]
    source = spec.get("group_image_source", "icons")
    if source not in ("icons", "illustrations"):
        _incomplete(ctx, "group_image_source 仅支持 icons/illustrations，未猜素材类别")
        source = "icons"
    placement = spec.get("illustration", "none")
    if placement not in (None, "none", "left_inside", "top_inside", "above_card"):
        _incomplete(ctx, f"comparison 组级图未实现 illustration={placement}，完整保留组文字")
        placement = "none"
    missing = 0
    markers = spec.get("group_markers") or []
    for index, group in enumerate(grouped):
        icon = _mapped_icon(asset_spec, ctx, group[0], index, "group_icon_map", "group_images", source) if group and spec.get("image_mode") != "none" else None
        if placement not in (None, "none") and not icon:
            missing += 1
        body, heading = [], []
        for unit_index, unit in enumerate(group):
            title = _source_text(unit)[0]
            marker = markers[index] if index < len(markers) else "cross" if unit_index == 0 and title in ("不管", "它不管的") else None
            if unit_index == 0 and marker in ("check", "cross"):
                rendered = f'<div class="ds-item-heading"><span class="ds-group-marker ds-marker-{marker}" aria-hidden="true"></span><div class="ds-item-heading-text">{_comparison_unit(unit, ctx, spec)}</div></div>'
            else:
                rendered = _comparison_unit(unit, ctx, spec)
            if unit_index == 0 and header_position == "with_image" and unit.get("type") in ("group", "h1", "h2", "h3"):
                heading.append(rendered)
            else:
                body.append(rendered)
        config = metadata[index] if index < len(metadata) and isinstance(metadata[index], dict) else {}
        try:
            span = max(1, min(cols, int(config.get("span", 1)))) if ctx.orient == "h" else 1
        except (TypeError, ValueError):
            span = 1
            _incomplete(ctx, "comparison 组级 span 必须是整数，采用一列")
        art = f'<img class="ds-group-art" src="{attr(icon)}" alt="">' if icon else ""
        side = " ds-group-art-left" if (icon or heading) and placement == "left_inside" else " ds-group-art-top" if icon else ""
        left = '<div class="ds-group-image-column">' + ''.join(heading) + art + '</div>' if heading else art
        output.append(f'<section class="card ds-panel ds-group-panel{side}" style="grid-column:span {span}">{left}<div class="ds-panel-text">{"".join(body)}</div></section>')
    output.append('</div></div>')
    if missing:
        _incomplete(ctx, f"comparison 组级侧图有 {missing} 组缺明确 group_images/group_icon_map；未随机配图或生成素材", "asset")
    return "".join(output)


def _single_link(unit, ctx):
    text = str(unit.get("text", ""))
    match = re.fullmatch(r"(\s*〔[^〕]+〕)(\s+)(L[0-9]+(?:\s*[–—~～-]\s*L?[0-9]+)?)(\s*)", text)
    if match and not any(unit.get(field) for field in ("n", "lead", "num")):
        return ('<div class="ds-single-link-body">' +
                f'<div class="ds-single-link-name tb">{inline(match.group(1), ctx)}</div>' +
                f'<span class="ds-single-link-range tb">{inline(match.group(2) + match.group(3) + match.group(4), ctx)}</span></div>')
    return render_unit(unit, ctx)


def _single_comparison(grouped, spec, ctx):
    try:
        columns = max(1, min(4, int(spec.get("inner_link_columns", 1))))
    except (TypeError, ValueError):
        columns = 1
        _incomplete(ctx, "单面板 inner_link_columns 必须是整数，采用一列")
    output = [_root("comparison", ctx, "ds-comparison-single")]
    for group in grouped:
        output.append('<section class="card ds-panel ds-single-panel">')
        cursor = 0
        while cursor < len(group):
            unit = group[cursor]
            if unit.get("type") == "item" and re.match(r"\s*〔[^〕]+〕", unit.get("text", "")):
                end = cursor
                while end < len(group) and group[end].get("type") == "item" and re.match(r"\s*〔[^〕]+〕", group[end].get("text", "")):
                    end += 1
                links = group[cursor:end]
                rows = (len(links) + columns - 1) // columns
                output.append(f'<div class="ds-single-links" style="--ds-inner-columns:{columns}">')
                for index, link in enumerate(links):
                    column, row = (index // rows + 1, index % rows + 1) if spec.get("inner_link_order") == "column_major" else (index % columns + 1, index // columns + 1)
                    output.append(f'<div class="ds-single-link" style="grid-column:{column};grid-row:{row}">{_single_link(link, ctx)}</div>')
                output.append('</div>')
                cursor = end
                continue
            if unit.get("type") == "linkrow" and cursor == len(group) - 1:
                source = " ".join(unit.get("src", [])) or " ".join('〔' + label + '〕' for label in unit.get("links", []))
                button = inline(source, ctx).replace('class="lk"', 'class="btn tb ds-single-btn" role="button"').replace('data-hot="link"', 'data-hot="button"')
                output.append(f'<div class="ds-single-actions">{button}</div>')
            else:
                role = "ds-single-heading" if cursor == 0 and unit.get("type") in ("h1", "h2", "h3", "group") else "ds-single-content"
                output.append(f'<div class="{role}">{render_unit(unit, ctx)}</div>')
            cursor += 1
        output.append('</section>')
    output.append('</div>')
    return "".join(output)


def _judgement_comparison(grouped, spec, ctx, icons):
    if len(grouped) % 2:
        _incomplete(ctx, "judgement_rows 需要问／答成对分组，保留普通排版以完整显示原文")
        return None
    widths = spec.get("question_result_columns", [42, 58])
    try:
        question_width, result_width = float(widths[0]), float(widths[1])
        if question_width <= 0 or result_width <= 0:
            raise ValueError
    except (TypeError, ValueError, IndexError):
        question_width, result_width = 42, 58
        _incomplete(ctx, "question_result_columns 须为两个正数，采用 42:58")
    output = [_root("comparison", ctx, "ds-comparison-judgement", f"--ds-question-track:{question_width:g}fr;--ds-result-track:{result_width:g}fr"), '<div class="ds-judgement-rows">']
    count = len(grouped) // 2
    if spec.get("illustration") != "none" and len(icons) < count:
        _incomplete(ctx, f"判断结果卡图标缺少 {count - len(icons)} 个，仅使用实际已有的本屏图标，不补空牌或错配素材", "asset")
    for index in range(count):
        question, result = grouped[index * 2:index * 2 + 2]
        output.append('<div class="ds-judgement-row">')
        output.append(_panel(question, ctx, "ds-judgement-question"))
        arrow, answer = "", list(result)
        if answer and answer[0].get("type") == "para":
            text = answer[0].get("text", "")
            match = re.match(r"^(\s*是\s*)(→)(\s*)(.*)$", text, re.S)
            if match:
                visible_arrow = "↓" if ctx.orient == "v" else match.group(2)
                arrow = (f'<div class="ds-judgement-yes tb">{inline(match.group(1), ctx)}</div>' +
                         f'<div class="ds-judgement-arrow-symbol tb"><span class="ds-arrow-turn">{inline(visible_arrow, ctx)}</span></div>')
                answer[0] = dict(answer[0], text=match.group(3) + match.group(4))
        if not arrow:
            _incomplete(ctx, f"判断第 {index + 1} 个结果没有定稿“是 →”前缀，未补写箭头文字")
        output.append(f'<div class="ds-judgement-connector">{arrow}</div>')
        question_text = "".join(_source_text(unit)[0] for unit in question)
        warning = " ds-judgement-warn" if question_text.startswith(("②", "③")) else ""
        output.append(_panel(answer, ctx, "ds-judgement-result" + warning, icons[index] if index < len(icons) else None))
        output.append('</div>')
    output.append('</div></div>')
    ctx.warn("judgement_rows 及②③琥珀竖条为新构图，已实现待样张审核；文字均来自问答定稿")
    return "".join(output)


def render_comparison(block, ctx):
    spec = dict(block.get("spec", {}))
    if spec.get("align_items", "stretch") not in ("start", "stretch"):
        _incomplete(ctx, f"comparison 不消费 align_items={spec['align_items']}，保留默认卡高")
        spec["align_items"] = "stretch"
    if spec.get("align_items") == "start" and spec.get("layout") in ("single_panel", "judgement_rows", "paired"):
        _incomplete(ctx, "comparison align_items:start 只控制普通组卡/逐条组卡的外网格，当前专用layout没有该网格")
    items = units(block.get("nodes", []))
    normalized = []
    for unit in items:
        lead_field = "lead" if unit.get("lead") else "num" if unit.get("num") else None
        if unit.get("type") == "item" and lead_field and re.match(r"^[：:]", unit.get("text", "")):
            unit = dict(unit, **{lead_field: str(unit[lead_field]) + unit["text"][0]}, text=unit["text"][1:])
        normalized.append(unit)
    items = normalized
    for field in ("number_heading", "status_dots"):
        if spec.get(field, False) not in (True, False):
            _incomplete(ctx, f"comparison {field} 必须是布尔值，未猜呈现方式")
            spec[field] = False
        if spec.get(field) and spec.get("layout") in ("single_panel", "judgement_rows", "paired"):
            _incomplete(ctx, f"comparison {field} 只消费普通组卡/逐条组卡，当前专用layout没有执行此项")
    if spec.get("status_dots"):
        legend = "灰圆点＝没用过　浅灰圆点＝说不准"
        if legend in ctx.screen.get("text", "") and not any(legend in unit.get("text", "") for unit in items):
            _incomplete(ctx, "comparison status_dots 已接本块原项状态；原图例在其它块，须页caller绑定图例给对应组件，本块没有跨prose借字")
    grouped, metadata = _groups(items, spec.get("groups"), ctx)
    if "list_layout" in spec:
        if spec["list_layout"] == "cards":
            spec["item_cards"] = True
        else:
            _incomplete(ctx, f"comparison 不消费 list_layout={spec['list_layout']}，原条目完整保留")
    if "item_illustration" in spec:
        if spec["item_illustration"] == "left_inside":
            spec["illustration"] = "left_inside"
            spec["image_mode"] = "item"
        else:
            _incomplete(ctx, f"comparison 不消费 item_illustration={spec['item_illustration']}，未猜图位")
    if "heading_mark" in spec:
        if spec["heading_mark"] in ("check", "cross"):
            spec["group_markers"] = [spec["heading_mark"]] * len(grouped)
        else:
            _incomplete(ctx, f"comparison 不消费 heading_mark={spec['heading_mark']}，未增加记号")
    cols = _columns(spec, ctx)
    if "items_layout" in spec:
        configured = _comparison_items_layout(grouped, spec, ctx, cols)
        if configured is not None:
            return configured
    icons = images(ctx, spec)
    known_layouts = (None, "default", "single_panel", "judgement_rows", "paired", "item_rows", "group_side")
    if spec.get("layout") not in known_layouts:
        _incomplete(ctx, f"comparison 未实现 layout={spec.get('layout')}，保留原文分组")
    if spec.get("inline_groups"):
        inline_layout = _inline_comparison(items, spec, ctx)
        if inline_layout is not None:
            return inline_layout
    if spec.get("layout") == "single_panel":
        return _single_comparison(grouped, spec, ctx)
    if spec.get("layout") == "judgement_rows":
        judgement = _judgement_comparison(grouped, spec, ctx, icons)
        if judgement is not None:
            return judgement
    if spec.get("layout") == "paired":
        paired = _paired_comparison(grouped, spec, ctx, icons)
        if paired is not None:
            return paired
    mode = spec.get("image_mode")
    if mode not in (None, "item", "group", "none"):
        _incomplete(ctx, f"comparison 未实现 image_mode={mode}，按组级文字保留")
        mode = "none"
    legacy_item_rows = mode is None and spec.get("illustration") == "left_inside" and [_source_text(group[0])[0] for group in grouped if group] == ["它管的", "它不管的"]
    if mode == "item" or spec.get("item_cards") or spec.get("layout") == "item_rows" or legacy_item_rows:
        return _item_comparison(grouped, spec, ctx, cols)
    if spec.get("connector") not in (None, "none"):
        _incomplete(ctx, "普通comparison组卡未实现组间 connector，请用paired/judgement_rows明确关系")
    if mode == "none":
        spec = dict(spec, illustration="none", group_images=[])
    return _group_comparison(grouped, spec, ctx, cols, metadata)


def _comparison_items_layout(grouped, spec, ctx, cols):
    config = spec.get("items_layout")
    if not isinstance(config, dict):
        _incomplete(ctx, "comparison items_layout 必须是对象，保留原分组")
        return None
    _check_nested_fields(config, {"groups", "icons", "heading_side", "icon_side", "bullet_counts"}, ctx, "comparison items_layout")
    names = [_source_text(group[0])[0] for group in grouped if group]
    if "groups" in config and config["groups"] != names:
        _incomplete(ctx, "comparison items_layout.groups 与原组头不匹配，未重新命名或搬组")
        return None
    counts = [sum(unit.get("type") == "item" for unit in group) for group in grouped]
    if "bullet_counts" in config and config["bullet_counts"] != counts:
        _incomplete(ctx, f"comparison items_layout.bullet_counts 与原条目数{counts}不匹配，全部条目仍保留")
    if config.get("heading_side") != "left" or config.get("icon_side") != "right":
        _incomplete(ctx, "comparison items_layout 只执行 heading_side:left / icon_side:right，未猜组头图位")
        return None
    symbols = config.get("icons", [])
    if not isinstance(symbols, list):
        _incomplete(ctx, "comparison items_layout.icons 必须是按组数组，未猜图形")
        symbols = []
    if len(symbols) != len(grouped):
        _incomplete(ctx, "comparison items_layout.icons 数量与原组数不匹配，缺项未加图形", "asset")
    output = [_root("comparison", ctx, "ds-comparison-heading-side", f"--ds-columns:{cols};--ds-comparison-align:{spec.get('align_items', 'stretch')}"), '<div class="ds-comparison-grid">']
    for index, group in enumerate(grouped):
        if not group:
            continue
        symbol = symbols[index] if index < len(symbols) else None
        art = ""
        if symbol == "gray_cross":
            art = '<span class="ds-group-marker ds-marker-cross ds-header-symbol" aria-hidden="true"></span>'
        elif symbol == "toolbox":
            choices = spec.get("group_images") or []
            selected = choices[index] if isinstance(choices, list) and index < len(choices) else None
            # 灯泡等明确文件不等于工具箱；这里不把已有文件存在当作语义核验。
            if isinstance(selected, str) and re.search(r"toolbox|工具箱", Path(selected).stem, re.I):
                icon = _mapped_icon(spec, ctx, group[0], index, "group_icon_map", "group_images")
                art = f'<img class="ds-group-art" src="{attr(icon)}" alt="">' if icon else ""
            if not art:
                _incomplete(ctx, "comparison items_layout.icons=toolbox 缺明确工具箱素材绑定；未用灯泡替代", "asset")
        elif symbol is not None:
            _incomplete(ctx, f"comparison items_layout.icons={symbol} 没有图形绑定，未随机配图", "asset")
        output.append('<section class="card ds-panel ds-group-panel"><div class="ds-group-header-band">')
        output.append(f'<div class="ds-group-header-text">{render_unit(group[0], ctx)}</div>{art}</div>')
        output.append('<div class="ds-panel-text">' + ''.join(_comparison_unit(unit, ctx, spec) for unit in group[1:]) + '</div></section>')
    output.append('</div></div>')
    return ''.join(output)


def _connector(spec):
    return spec.get("connector", "arrow") in ("arrow", "ribbon", "bidirectional")


def _local_icon_path(value, ctx):
    if not isinstance(value, str) or value in ("auto", "none") or value.startswith(("file:", "data:", "http:", "https:")):
        return None
    path = Path(value)
    if not path.is_absolute():
        root = Path(ASSET_ROOT)
        direct = root / path
        page = ctx.page.get("slug", ctx.page.get("id", ctx.screen.get("id", "").rsplit("-", 1)[0]))
        path = direct if direct.is_file() else root / str(page) / path
    return path.resolve() if path.suffix.lower() == ".png" and path.is_file() else None


def _semantic_topology_icons(items, spec, order, ctx):
    leaves = [unit for unit in items if unit.get("type") != "source_arrow"]
    roles = order.split("、") if isinstance(order, str) else order if isinstance(order, list) else []
    choices = spec.get("icons")
    if len(roles) != len(leaves) or not all(isinstance(role, str) for role in roles):
        _incomplete(ctx, "topology items_layout.image_order 须为与真实原站等长的角色名数组/顿号串，未挤图序", "asset")
        return [None] * len(leaves)
    if not isinstance(choices, list) or len(choices) != len(leaves):
        _incomplete(ctx, "topology image_order 需要与原站等长的明确icons数组，未用auto/右栏槽推人物", "asset")
        return [None] * len(leaves)
    asset_root = Path(ASSET_ROOT)
    defaults = [asset_root / "_library" / "icon-catalog.jsonl", asset_root / "_library" / "round2" / "icons-avatars" / "avatar-manifest.jsonl"]
    receipts = {}

    def records(path):
        if path not in receipts:
            try:
                text = path.read_text(encoding="utf-8-sig")
                data = [json.loads(line) for line in text.splitlines() if line.strip()] if path.suffix == ".jsonl" else json.loads(text)
                receipts[path] = data if isinstance(data, list) else data.get("items", [data]) if isinstance(data, dict) else []
            except (OSError, ValueError):
                receipts[path] = []
        return receipts[path]

    def canonical(text):
        return re.sub(r"\s+|\*\*|`", "", str(text))

    resolved, missing = [], []
    for index, (unit, role, choice) in enumerate(zip(leaves, roles, choices)):
        config = choice if isinstance(choice, dict) else {"asset": choice}
        _check_nested_fields(config, {"asset", "node_ref", "text_ref", "role", "receipt"}, ctx, "topology icons逐站语义")
        valid_ref = config.get("role", role) == role
        if isinstance(choice, dict) and "node_ref" not in config and "text_ref" not in config:
            valid_ref = False
        if "node_ref" in config:
            valid_ref = valid_ref and isinstance(config["node_ref"], int) and not isinstance(config["node_ref"], bool) and config["node_ref"] == index
        if "text_ref" in config:
            valid_ref = valid_ref and any(canonical(config["text_ref"]) == canonical(text) for text in _source_text(unit))
        path = _local_icon_path(config.get("asset"), ctx)
        sources = defaults
        if config.get("receipt"):
            receipt = Path(str(config["receipt"]))
            receipt = receipt if receipt.is_absolute() else asset_root / receipt
            sources = [receipt.resolve()] if receipt.resolve().is_relative_to(asset_root.resolve()) and receipt.suffix in (".json", ".jsonl") else []
        verified = False
        if path and valid_ref:
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            for source in sources:
                for record in records(source):
                    if not isinstance(record, dict):
                        continue
                    material = record.get("standard_source") or record
                    if not isinstance(material, dict):
                        continue
                    recorded_path = _local_icon_path(material.get("asset", material.get("path")), ctx)
                    hand = role == "手" and record.get("key") in ("手", "指向手")
                    character = record.get("actor") == role and record.get("subject_kind") == "character"
                    if record.get("status") == "ready" and recorded_path == path and material.get("sha256") == digest and (hand or character):
                        if "node_ref" in record and record["node_ref"] != index:
                            continue
                        if "text_ref" in record and not any(canonical(record["text_ref"]) == canonical(text) for text in _source_text(unit)):
                            continue
                        verified = True
                        break
                if verified:
                    break
        resolved.append(ctx.asset_url(str(path)) if verified else None)
        if not verified:
            missing.append(f"第{index + 1}站{_source_text(unit)[0].strip()}[{role}]")
    if missing:
        _incomplete(ctx, "topology image_order 缺真实原站/PNG人物语义回执：" + "、".join(missing) + "；logo与通用AI头像不等于所需人物，未配错图", "asset")
        return [None] * len(leaves)
    return resolved


def _topology_icons(ctx, spec, count):
    choice = spec.get("icons", "auto")
    placement = spec.get("illustration", "top_inside" if isinstance(choice, list) else "none")
    if choice in (None, False, "none") or placement == "none":
        return [None] * count
    if choice == "auto" and callable(getattr(ctx, "slots", None)):
        slots = ctx.slots("icon")
        candidates = [None] * max([int(index) for index, _ in slots] + [count])
        for index, url in slots:
            if int(index) > 0:
                candidates[int(index) - 1] = url
    else:
        candidates = images(ctx, spec)
    if len(candidates) < count or any(url is None for url in candidates[:count]):
        _incomplete(ctx, "topology 当前节点图位与原图标槽未完整对应；不向前挤槽、不新增素材预算，本组保留文字", "asset")
        return [None] * count
    return candidates[:count]


def _topology_panel(group, ctx, spec, css="ds-node", icon=None):
    placement = spec.get("illustration", "top_inside" if isinstance(spec.get("icons"), list) else "none")
    if placement not in ("none", "left_inside", "top_inside", "above_card", "outside"):
        _incomplete(ctx, f"topology 不消费 illustration={placement}，完整保留节点原文")
        placement = "none"
    if placement == "none":
        return _panel(group, ctx, css, text_layout=spec.get("text_layout", "block"))
    if icon and placement in ("above_card", "outside"):
        inner_css = ' '.join(name for name in css.split() if name not in ("ds-node", "ds-branch"))
        return f'<div class="{css} ds-node-wrap"><img class="ds-node-art" src="{attr(icon)}" alt="">' + _panel(group, ctx, inner_css, text_layout=spec.get("text_layout", "block")) + '</div>'
    extra = " ds-node-icon-left" if icon and placement == "left_inside" else ""
    return _panel(group, ctx, css + extra, icon, text_layout=spec.get("text_layout", "block"))


def _split_source_arrows(items, separator=None):
    expanded = []
    pattern = re.escape(separator) if separator else "[→←↓↑]"
    for item in items:
        if item.get("type") == "para" and re.search(pattern, item.get("text", "")):
            for fragment in re.split("(" + pattern + ")", item["text"]):
                if fragment:
                    expanded.append({"type": "source_arrow" if re.fullmatch(pattern, fragment) else "para", "text": fragment})
        else:
            expanded.append(item)
    return expanded


def _collaboration_topology(items, spec, ctx):
    layouts = ("我在上；Claude 左/Codex 右；两者任务文件右向与报告左向；手机在下连主机",
               "同横版关系图置顶，一次呈现定稿全部图内标签")
    if spec.get("topology_layout") not in layouts:
        _incomplete(ctx, f"topology_layout={spec.get('topology_layout')} 没有明确原文绑定，未从描述补标签")
        return None
    if len(items) != 1 or items[0].get("type") != "para":
        _incomplete(ctx, "topology_layout 需一条完整图内标签原文，未从其它块借标签")
        return None
    match = re.fullmatch(r"(图里：)(我)　(Claude)　(Codex)　(任务文件)　(报告)　(手机)", items[0].get("text", ""))
    if not match:
        _incomplete(ctx, "topology_layout 六个标签与本块原文不匹配，全部原文保留")
        return None
    original = [{"type": "para", "text": text} for text in match.groups()]
    definitions = [
        {"id": "prefix", "count": 1, "shape": "context", "row": 1, "column": 1, "row_v": 1, "column_v": 1},
        {"id": "me", "count": 1, "row": 1, "column": 2, "row_v": 1, "column_v": 2},
        {"id": "claude", "count": 1, "row": 2, "column": 1, "row_v": 2, "column_v": 1},
        {"id": "codex", "count": 1, "row": 2, "column": 3, "row_v": 2, "column_v": 3},
        {"id": "task", "count": 1, "shape": "papers", "row": 2, "column": 2, "row_v": 2, "column_v": 2},
        {"id": "report", "count": 1, "shape": "papers", "row": 3, "column": 2, "row_v": 3, "column_v": 2},
        {"id": "phone", "count": 1, "row": 4, "column": 2, "row_v": 4, "column_v": 2},
    ]
    edges = [
        {"from": "me", "to": "claude", "style": "dashed", "from_side": "bottom", "to_side": "top"},
        {"from": "me", "to": "codex", "style": "dashed", "from_side": "bottom", "to_side": "top"},
        {"from": "claude", "to": "task", "from_side": "right", "to_side": "left"},
        {"from": "task", "to": "codex", "from_side": "right", "to_side": "left"},
        {"from": "codex", "to": "report", "from_side": "bottom", "to_side": "right"},
        {"from": "report", "to": "claude", "from_side": "left", "to_side": "bottom"},
        {"from": "phone", "to": "machine", "style": "dashed", "arrow": False, "from_side": "right", "to_side": "left"},
        {"from": "claude", "to": "subagents", "arrow": False, "from_side": "left", "to_side": "top"},
    ]
    # scene明确了无字机箱与五个子代理点；只构造几何形状，不生成其它标签或冒充水彩资产。
    decorations = [
        ("machine", '<div class="ds-graph-node ds-machine-node" data-graph-id="machine" style="grid-row:4;grid-column:3" aria-hidden="true"><div class="ds-machine-tower"><span class="ds-machine-slot"></span><span class="ds-machine-slot"></span><span class="ds-machine-led"></span></div></div>'),
        ("subagents", '<div class="ds-graph-node ds-subagent-node" data-graph-id="subagents" style="grid-row:3;grid-column:1" aria-hidden="true">' + '<span class="ds-subagent-dot"></span>' * 5 + '</div>'),
    ]
    roles = [("me", "人物", None), ("claude", "显示器", "Claude标志"), ("codex", "显示器", "OpenAI标志"), ("task", "白纸", None), ("report", "白纸", None), ("phone", "手机", None)]
    icons = spec.get("icons")
    ready = isinstance(icons, list) and len(icons) == len(roles)
    missing = []
    root = Path(ASSET_ROOT) / "_library" / "icons"
    for index, (node_id, subject, required_badge) in enumerate(roles):
        choice = icons[index] if ready else None
        config = choice if isinstance(choice, dict) else {"asset": choice}
        _check_nested_fields(config, {"asset", "badge"}, ctx, "topology_layout六角色icons")
        selected = _local_icon_path(config.get("asset"), ctx)
        if selected is None or selected != (root / (subject + ".png")).resolve():
            missing.append(f"{node_id}={subject}")
        else:
            definitions[index + 1]["icon"] = str(selected)
        if required_badge:
            badge = _local_icon_path(config.get("badge"), ctx)
            if badge is None or badge != (root / (required_badge + ".png")).resolve():
                missing.append(f"{node_id}.badge={required_badge}（屏内品牌）")
            else:
                definitions[index + 1]["icon_badge"] = str(badge)
    if missing:
        _incomplete(ctx, "topology_layout 六原角色需本块icons明确人物/两显示器及其Claude、OpenAI屏内徽标/两白纸/手机PNG；缺或错映射：" + "、".join(missing) + "；未把右栏四图或单独logo当六角色物件", "asset")
    else:
        ctx.warn("topology_layout 六原物件及两屏品牌PNG已组合；AI补充徽标图位中心(0.5,0.42)/宽高(0.28,0.4)，实际屏面像素位置未核，新组合列最终统一审样")
    return _graph_topology(original, dict(spec, columns=3, columns_v=3, graph_nodes=definitions, edges=edges), ctx, decorations)


def _graph_parts(group, config, ctx, text_layout="block"):
    """只有明确分隔符才拆内部节点，保留原前缀和标点。"""
    delimiter = config.get("split_delimiter")
    node_id = str(config.get("id", "node"))
    segment_refs = config.get("segment_refs")
    if not delimiter and not segment_refs:
        return "".join(_topology_unit(unit, ctx, text_layout) for unit in group), []
    output, child_ids = [], []
    index = 0
    for unit in group:
        if unit.get("type") not in ("para", "card") or (not segment_refs and delimiter not in unit.get("text", "")):
            output.append(_topology_unit(unit, ctx, text_layout))
            continue
        text = unit["text"]
        leading_fragments = []
        if unit.get("type") == "card":
            name = str(unit.get("name", ""))
            name_prefix_end = config.get("name_prefix_end")
            if name_prefix_end and name_prefix_end in name:
                cut = name.index(name_prefix_end) + len(name_prefix_end)
                output.append(f'<div class="dg-heading tb">{inline(name[:cut], ctx)}</div>')
                leading_fragments = [name[cut:]]
            else:
                output.append(f'<div class="dg-heading tb">{inline(name, ctx)}</div>')
                if name_prefix_end:
                    _incomplete(ctx, f"graph {node_id} name_prefix_end 未在原card名称匹配，未猜第一节点")
        prefix_end = config.get("prefix_end")
        if prefix_end and prefix_end in text:
            cut = text.index(prefix_end) + len(prefix_end)
            heading_class = "dg-heading ds-source-lead" if config.get("prefix_role") == "title" else "dg-heading"
            output.append(f'<div class="{heading_class} tb">{inline(text[:cut], ctx)}</div>')
            text = text[cut:]
        part_columns = config.get("part_columns_v") if ctx.orient == "v" else config.get("part_columns")
        if isinstance(part_columns, int) and part_columns > 0:
            output.append(f'<div class="ds-graph-parts ds-parts-grid" style="--ds-part-columns:{part_columns}">')
        else:
            output.append('<div class="ds-graph-parts">')
        if segment_refs:
            starts, cursor = [], 0
            for ref in segment_refs:
                found = text.find(str(ref), cursor)
                if found < 0:
                    starts = []; break
                starts.append(found); cursor = found + len(str(ref))
            if len(starts) != len(segment_refs):
                output.append(_topology_unit(dict(unit, text=text), ctx, text_layout))
                _incomplete(ctx, f"graph {node_id} segment_refs 未按原文完整匹配，未猜拆分点")
                output.append('</div>')
                continue
            starts[0] = 0
            fragments = [text[start:end] for start, end in zip(starts, starts[1:] + [len(text)])]
        else:
            fragments = text.split(str(delimiter))
        fragments = leading_fragments + fragments
        for fragment_index, fragment in enumerate(fragments):
            if fragment.strip():
                child_id = f"{node_id}-{index}"
                suffix = inline(delimiter, ctx) if not segment_refs and fragment_index < len(fragments) - 1 else ""
                output.append(f'<div class="card ds-graph-part" data-graph-id="{attr(child_id)}"><div class="tb">{inline(fragment, ctx)}{suffix}</div></div>')
                child_ids.append(child_id)
                index += 1
        output.append('</div>')
    return "".join(output), child_ids


def _graph_edges_script():
    # 明确关系不变；端口、正交通道和箭头都按最终 DOM 外框重算。
    return '''<script>(function(){
const script=document.currentScript,root=script.parentElement,svg=root.querySelector('.ds-graph-lines');
const NS='http://www.w3.org/2000/svg',vectors={left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]};
let pending=false;
const same=(a,b)=>Math.abs(a[0]-b[0])<.1&&Math.abs(a[1]-b[1])<.1;
const clean=points=>points.filter((p,i)=>!i||!same(p,points[i-1])).filter((p,i,a)=>!i||i===a.length-1||(a[i-1][0]!==p[0]||p[0]!==a[i+1][0])&&(a[i-1][1]!==p[1]||p[1]!==a[i+1][1]));
function blocked(a,b,rects){
 return rects.some(r=>a[0]===b[0]?a[0]>r.l+.1&&a[0]<r.r-.1&&Math.max(a[1],b[1])>r.t+.1&&Math.min(a[1],b[1])<r.b-.1:a[1]>r.t+.1&&a[1]<r.b-.1&&Math.max(a[0],b[0])>r.l+.1&&Math.min(a[0],b[0])<r.r-.1);
}
function crossings(a,b,paths){
 let cost=0;for(const points of paths)for(let i=1;i<points.length;i++){
  const c=points[i-1],d=points[i],horizontal=a[1]===b[1],other=c[1]===d[1];
  if(horizontal!==other){const h=horizontal?[a,b]:[c,d],v=horizontal?[c,d]:[a,b];if(v[0][0]>Math.min(h[0][0],h[1][0])+.1&&v[0][0]<Math.max(h[0][0],h[1][0])-.1&&h[0][1]>Math.min(v[0][1],v[1][1])+.1&&h[0][1]<Math.max(v[0][1],v[1][1])-.1)cost+=90;}
  else if(horizontal?a[1]===c[1]:a[0]===c[0]){const axis=horizontal?0:1;cost+=Math.max(0,Math.min(Math.max(a[axis],b[axis]),Math.max(c[axis],d[axis]))-Math.max(Math.min(a[axis],b[axis]),Math.min(c[axis],d[axis])))*.2;}
 }return cost;
}
function route(start,end,rects,paths,width,height,preferredX){
 const xs=[(start[0]+end[0])/2,10,width-10,...rects.flatMap(r=>[r.l,r.r])],ys=[(start[1]+end[1])/2,10,height-10,...rects.flatMap(r=>[r.t,r.b])];
 let best=null,bestCost=Infinity;
 const consider=points=>{points=clean(points);let cost=24*Math.max(0,points.length-2);for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i];if(a[0]!==b[0]&&a[1]!==b[1]||blocked(a,b,rects)||a[0]<2||a[0]>width-2||a[1]<2||a[1]>height-2)return;
  cost+=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+crossings(a,b,paths);
 }if(cost<bestCost){best=points;bestCost=cost;}};
 if(preferredX!=null){consider([start,[preferredX,start[1]],[preferredX,end[1]],end]);if(best)return best;}
 consider([start,end]);consider([start,[end[0],start[1]],end]);consider([start,[start[0],end[1]],end]);
 for(const x of xs)consider([start,[x,start[1]],[x,end[1]],end]);for(const y of ys)consider([start,[start[0],y],[end[0],y],end]);
 if(best)return best;
 // 卡片遮断简单折线时，仅在卡片边缘形成的通道网格中找最短路。
 const unique=values=>[...new Set(values.filter(v=>v>=2&&v<=width-2))].sort((a,b)=>a-b);
 const gx=unique([...xs,start[0],end[0]]),gy=[...new Set([...ys,start[1],end[1]].filter(v=>v>=2&&v<=height-2))].sort((a,b)=>a-b);
 const key=(x,y,dir)=>x+','+y+','+dir,queue=[{x:gx.indexOf(start[0]),y:gy.indexOf(start[1]),dir:-1,cost:0,points:[start]}],costs=new Map();
 while(queue.length){let at=0;for(let i=1;i<queue.length;i++)if(queue[i].cost<queue[at].cost)at=i;const state=queue.splice(at,1)[0],a=[gx[state.x],gy[state.y]];
  if(same(a,end))return clean(state.points);
  for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const x=state.x+dx,y=state.y+dy;if(x<0||y<0||x>=gx.length||y>=gy.length)continue;const b=[gx[x],gy[y]],dir=dx?0:1;
   if(blocked(a,b,rects))continue;const cost=state.cost+Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+(state.dir>=0&&state.dir!==dir?24:0)+crossings(a,b,paths),id=key(x,y,dir);
   if(costs.has(id)&&costs.get(id)<=cost)continue;costs.set(id,cost);queue.push({x,y,dir,cost,points:[...state.points,b]});
  }
 }return null;
}
function draw(){
 const box=root.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);svg.replaceChildren();
 const nodes=new Map(Array.from(root.querySelectorAll('[data-graph-id]')).map(n=>[n.dataset.graphId,n]));
 const get=k=>k.endsWith(':*')?Array.from(nodes).filter(([id])=>id.startsWith(k.slice(0,-2)+'-')).map(x=>x[1]):nodes.has(k)?[nodes.get(k)]:[];
 const owner=element=>element.closest('.ds-graph-node,.ds-chain-position,.ds-graph-context')||element;
 const rect=element=>{const b=element.getBoundingClientRect();return {l:b.left-box.left,r:b.right-box.left,t:b.top-box.top,b:b.bottom-box.top};};
 const frames=[...new Set([...nodes.values()].map(owner))],rects=frames.map(n=>{const r=rect(n);return {l:r.l-7,r:r.r+7,t:r.t-7,b:r.b+7};});
 const point=(element,side,other,lane)=>{const b=rect(element),c=rect(other),frame=rect(owner(element)),horizontal=side==='left'||side==='right',lo=horizontal?'t':'l',hi=horizontal?'b':'r';
  const overlapLow=Math.max(b[lo],c[lo]),overlapHigh=Math.min(b[hi],c[hi]),center=overlapHigh>overlapLow?(overlapLow+overlapHigh)/2:(b[lo]+b[hi])/2;
  const along=Math.max(b[lo]+Math.min(12,(b[hi]-b[lo])/3),Math.min(b[hi]-Math.min(12,(b[hi]-b[lo])/3),center+lane));
  return horizontal?[side==='left'?frame.l-3:frame.r+3,along]:[along,side==='top'?frame.t-3:frame.b+3];};
 const expanded=[];for(const edge of JSON.parse(root.dataset.graphEdges||'[]'))for(const from of get(edge.from))for(const to of get(edge.to))expanded.push({...edge,from,to});
 const edges=[];for(const edge of expanded){const reverse=edges.find(e=>!e.double&&!e.wrap&&!edge.wrap&&e.from===edge.to&&e.to===edge.from&&e.arrow!==false&&edge.arrow!==false&&(e.style||'solid')===(edge.style||'solid')&&(e.tone||'support')===(edge.tone||'support')&&!!e.return===!!edge.return&&e.from_side===edge.to_side&&e.to_side===edge.from_side);if(reverse)reverse.double=true;else edges.push(edge);}
 const drawn=[],heads=new Set();let unresolved=0;
 const append=(points,edge,head=false)=>{const path=document.createElementNS(NS,'path');path.setAttribute('d',points.map((p,i)=>(i?'L ':'M ')+p.join(' ')).join(' '));path.setAttribute('class','ds-graph-edge'+(head?' ds-graph-arrow':' ds-edge-'+(edge.style||'solid'))+' ds-tone-'+(edge.tone||'support'));path.dataset.edgeFrom=edge.from.dataset.graphId;path.dataset.edgeTo=edge.to.dataset.graphId;svg.append(path);};
 const arrow=(tip,previous,edge)=>{const dx=tip[0]-previous[0],dy=tip[1]-previous[1],length=Math.hypot(dx,dy);if(!length)return;const ux=dx/length,uy=dy/length,size=Math.min(8,length),key=tip.join(',')+','+ux+','+uy+','+(edge.tone||'support');if(heads.has(key))return;heads.add(key);append([[tip[0]-size*ux+size*.45*uy,tip[1]-size*uy-size*.45*ux],tip,[tip[0]-size*ux-size*.45*uy,tip[1]-size*uy+size*.45*ux]],edge,true);};
 for(const edge of edges){
  const a=rect(edge.from),b=rect(edge.to),vertical=Math.abs((a.t+a.b-b.t-b.b)/2)>=Math.abs((a.l+a.r-b.l-b.r)/2);
  const fromSide=edge.from_side||(edge.return?'left':vertical?(a.t<b.t?'bottom':'top'):(a.l<b.l?'right':'left')),toSide=edge.to_side||(edge.return?'left':vertical?(a.t<b.t?'top':'bottom'):(a.l<b.l?'left':'right'));
  const parallel=edges.filter(e=>e.from===edge.from&&e.to===edge.to||e.from===edge.to&&e.to===edge.from),lane=(parallel.indexOf(edge)-(parallel.length-1)/2)*12;
  const start=point(edge.from,fromSide,edge.to,lane),end=point(edge.to,toSide,edge.from,lane),sv=vectors[fromSide],ev=vectors[toSide],s=[start[0]+sv[0]*10,start[1]+sv[1]*10],t=[end[0]+ev[0]*10,end[1]+ev[1]*10];
  const paths=drawn.filter(e=>owner(e.from)!==owner(edge.from)&&owner(e.to)!==owner(edge.to)).map(e=>e.points),returnX=edge.return?Math.max(10,Math.min(rect(owner(edge.from)).l,rect(owner(edge.to)).l)-Number(edge.offset||18)-Math.abs(lane)):null;
  const middle=route(s,t,rects,paths,box.width,box.height,returnX);
  if(!middle){unresolved++;continue;}const points=clean([start,...middle,end]);append(points,edge);drawn.push({from:edge.from,to:edge.to,points});
  if(edge.arrow!==false){arrow(points.at(-1),points.at(-2),edge);if(edge.double)arrow(points[0],points[1],edge);}
  if(edge.wrap){const holder=root.querySelector('[data-chain-arrow="'+edge.source_arrow+'"]'),glyph=holder&&holder.querySelector('.ds-source-arrow-glyph');if(glyph){const h=holder.getBoundingClientRect();glyph.style.left=(box.left+end[0]-h.left-glyph.offsetWidth/2)+'px';glyph.style.top=(box.top+end[1]-h.top+(a.t<b.t?-glyph.offsetHeight:0))+'px';}}
 }
 root.dataset.graphRouteIssues=String(unresolved);
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;draw();});}}
schedule();if(document.fonts)document.fonts.ready.then(schedule);window.addEventListener('resize',schedule);root.querySelectorAll('img').forEach(n=>n.addEventListener('load',schedule));if(window.ResizeObserver){const observer=new ResizeObserver(schedule);observer.observe(root);root.querySelectorAll('[data-graph-id]').forEach(n=>observer.observe(n));}
})();</script>'''


def _graph_part_art(body, node_id, icon, placement):
    if not icon:
        return body
    opening = f'<div class="card ds-graph-part" data-graph-id="{attr(node_id)}">'
    start = body.find(opening)
    if start < 0:
        return body
    end = body.find('</div></div>', start)
    if end < 0:
        return body
    end += len('</div></div>')
    fragment = body[start:end]
    image = f'<img class="ds-node-art" src="{attr(icon)}" alt="">'
    if placement in ("above_card", "outside"):
        inner = fragment.replace(opening, '<div class="card ds-graph-part">', 1)
        fragment = f'<div class="ds-graph-part-wrap" data-graph-id="{attr(node_id)}">{image}{inner}</div>'
    else:
        extra = " ds-node-icon-left" if placement == "left_inside" else ""
        replacement = f'<div class="card ds-graph-part{extra}" data-graph-id="{attr(node_id)}">{image}'
        fragment = fragment.replace(opening, replacement, 1)
    return body[:start] + fragment + body[end:]


def _caption_size_class(spec, ctx):
    size = spec.get("size")
    if size in (None, "none", "auto"):
        return ""
    if size != "medium":
        _incomplete(ctx, f"topology size={size} 没有明确图内标题档位，未改正文或缩字")
        return ""
    return " ds-caption-medium"


def _graph_icon_art(icon, badge=None, css="ds-icon"):
    if not icon:
        return ""
    base = f'<img class="{css}" src="{attr(icon)}" alt="">'
    if not badge:
        return base
    return ('<div class="ds-screen-art" data-badge-box="0.5,0.42,0.28,0.4" data-badge-box-source="ai_supplement_unmeasured">' +
            base + f'<img class="ds-screen-badge badge" src="{attr(badge)}" alt=""></div>')


def _graph_topology(items, spec, ctx, unlabelled_nodes=()):
    import json
    definitions = spec.get("graph_nodes") or []
    if not items:
        _incomplete(ctx, "拓扑没有分配到原文 nodes，未用 layout_hint 或 scene 生成标签；需明确文字分配或专用无字素材")
        return _root("topology", ctx, "ds-topology-graph-empty") + '</div>'
    if not definitions:
        _incomplete(ctx, "graph 需要 graph_nodes 原文分组引用，完整保留源节点，未猜节点或关系")
        return _root("topology", ctx) + render_nodes(items, ctx) + '</div>'
    graphic_placement = spec.get("illustration", "none")
    if graphic_placement not in (None, "none", "left_inside", "top_inside", "above_card", "outside"):
        _incomplete(ctx, f"graph 不消费 illustration={graphic_placement}，原节点完整保留")
        graphic_placement = "none"
    grouped, metadata = _groups(items, definitions, ctx)
    prepared = {}
    leaf_count = 0
    row_notes = {}
    for index, group in enumerate(grouped):
        config = dict(metadata[index]) if index < len(metadata) else {}
        if config:
            config.setdefault("id", f"node-{index}")
            ref = config.get("row_note_from")
            if ref:
                text = group[0].get("text", "") if len(group) == 1 else ""
                row = config.get("row_note_row")
                if (ctx.orient == "h" and isinstance(ref, str) and text.count(ref) == 1
                        and text.index(ref) > 0 and type(row) is int and row > 0):
                    cut = text.index(ref)
                    row_notes[index] = (text[cut:], row)
                    group = [dict(group[0], text=text[:cut])]
                else:
                    _incomplete(ctx, "graph整行补充缺唯一原文切点或实际行，原字保留")
            prepared[index] = _graph_parts(group, config, ctx, spec.get("text_layout", "block"))
            children = prepared[index][1]
            leaf_count += len(children) if children else int(config.get("shape") != "context")
    slot_numbers = spec.get("graph_icon_slots")
    automatic_icons = None
    if isinstance(slot_numbers, list):
        if callable(getattr(ctx, "slots", None)):
            slot_map = dict(ctx.slots("icon"))
        else:
            slot_map = {index + 1: url for index, url in enumerate(ctx.icons())}
        automatic_icons = [slot_map.get(number) if isinstance(number, int) else None for number in slot_numbers]
        if len(automatic_icons) != leaf_count or any(icon is None for icon in automatic_icons):
            _incomplete(ctx, "graph明确图标槽与真实叶节点未完整对应，缺图仅记asset，不补图或画空牌", "asset")
    if graphic_placement not in (None, "none") and automatic_icons is None and not any(isinstance(definition, dict) and definition.get("icon") is not None for definition in definitions):
        _incomplete(ctx, "graph 节点图尚无明确icon/graph_icon_slots映射，只记录未完成，不处理缺素材", "asset")
    icon_cursor = 0
    edges, ids, source_groups = [], set(), {}
    panels = []
    for index, group in enumerate(grouped):
        config = dict(metadata[index]) if index < len(metadata) else {}
        if not config:
            panels.append(f'<div class="ds-graph-context">{render_nodes(group, ctx)}</div>')
            continue
        node_id = str(config.get("id", f"node-{index}"))
        if node_id in ids:
            _incomplete(ctx, f"graph_nodes 重复 id：{node_id}，未覆盖已有节点")
            node_id = f"{node_id}-{index}"
        ids.add(node_id); config["id"] = node_id
        source_groups[node_id] = group
        _check_nested_fields(config, {"id", "count", "text_ref", "shape", "row", "column", "row_v", "column_v",
                                      "row_span", "column_span", "row_v_span", "column_v_span", "align_self", "icon", "icon_badge",
                                      "split_delimiter", "prefix_end", "prefix_role", "name_prefix_end", "segment_refs", "part_columns", "part_columns_v", "row_note_from", "row_note_row"}, ctx, "graph_nodes")
        shape = config.get("shape", "card")
        if shape not in ("card", "database", "papers", "capsules", "context", "isolated"):
            _incomplete(ctx, f"未知图形 shape：{shape}，用完整原文卡")
            shape = "card"
        body, child_ids = prepared.get(index, ("".join(_topology_unit(unit, ctx, spec.get("text_layout", "block")) for unit in group), []))
        ids.update(child_ids)
        row_key, column_key = ("row_v", "column_v") if ctx.orient == "v" else ("row", "column")
        placement = []
        for key, css in ((row_key, "grid-row"), (column_key, "grid-column")):
            value = config.get(key)
            if isinstance(value, int) and value > 0:
                span = config.get(key + "_span", 1)
                placement.append(f"{css}:{value} / span {span}" if isinstance(span, int) and span > 1 else f"{css}:{value}")
        if config.get("align_self") in ("start", "center", "end", "stretch"):
            placement.append(f"align-self:{config['align_self']}")
        if ctx.orient == "v" and not placement:
            placement.append("grid-column:1 / -1")
        if child_ids and automatic_icons is not None:
            for child_id in child_ids:
                icon = automatic_icons[icon_cursor] if icon_cursor < len(automatic_icons) else None
                body = _graph_part_art(body, child_id, icon, graphic_placement)
                icon_cursor += 1
            icon = None
        else:
            icon = _mapped_icon({"item_icons": [config.get("icon")]}, ctx, group[0], 0) if config.get("icon") is not None else None
            if config.get("icon") is not None and icon is None:
                _incomplete(ctx, f"graph 节点{node_id}明确icon未解析到实际素材，原字仍保留", "asset")
            if not child_ids and config.get("shape") != "context":
                if icon is None and automatic_icons is not None:
                    icon = automatic_icons[icon_cursor] if icon_cursor < len(automatic_icons) else None
                icon_cursor += 1
        badge = _mapped_icon({"item_icons": [config.get("icon_badge")]}, ctx, group[0], 0) if config.get("icon_badge") is not None else None
        if config.get("icon_badge") is not None and (badge is None or icon is None):
            _incomplete(ctx, f"graph 节点{node_id}屏内徽标或主体PNG未解析完整，未画悬空品牌图", "asset")
        art = _graph_icon_art(icon, badge)
        if shape == "context":
            panels.append(f'<div class="ds-graph-context" data-graph-id="{attr(node_id)}" style="{attr(";".join(placement))}">{body}</div>')
        else:
            icon_left = " ds-node-icon-left" if icon and graphic_placement == "left_inside" else ""
            if icon and graphic_placement in ("above_card", "outside"):
                panels.append(f'<div class="ds-graph-node ds-graph-above" data-graph-id="{attr(node_id)}" style="{attr(";".join(placement))}">{_graph_icon_art(icon, badge, "ds-node-art")}<section class="card ds-panel ds-shape-{shape}"><div class="ds-graph-node-text">{body}</div></section></div>')
            else:
                panels.append(f'<section class="card ds-panel ds-graph-node ds-shape-{shape}{icon_left}" data-graph-id="{attr(node_id)}" style="{attr(";".join(placement))}">{art}<div class="ds-graph-node-text">{body}</div></section>')
        if index in row_notes:
            text, note_row = row_notes[index]
            panels[-1] = ('<div class="ds-graph-note-pair">' + panels[-1]
                          + f'<div class="ds-graph-row-note dg-body tb" data-role="body" style="grid-row:{note_row}">{inline(text, ctx)}</div></div>')
    for node_id, markup in unlabelled_nodes:
        if node_id in ids:
            _incomplete(ctx, f"无字图形节点id重复：{node_id}，未覆盖原图节点")
            continue
        ids.add(node_id)
        panels.append(markup)
    for index, instance in enumerate(spec.get("node_instances", [])):
        if not isinstance(instance, dict) or instance.get("source") not in source_groups:
            _incomplete(ctx, "node_instances 必须引用本块已有 graph_nodes id，未从其它块或scene补字")
            continue
        _check_nested_fields(instance, {"id", "source", "label_fields", "row", "column", "row_v", "column_v"}, ctx, "node_instances")
        node_id = str(instance.get("id", f"instance-{index}"))
        if node_id in ids:
            _incomplete(ctx, f"node_instances 重复 id：{node_id}，未覆盖已有节点")
            continue
        fields = instance.get("label_fields", ["lead", "name", "num"])
        if not isinstance(fields, list) or any(field not in ("lead", "name", "num", "text") for field in fields):
            _incomplete(ctx, "node_instances label_fields 只支持明确原节点lead/name/num/text字段")
            continue
        labels = [str(unit[field]) for unit in source_groups[instance["source"]] for field in fields if unit.get(field)]
        if not labels:
            _incomplete(ctx, f"node_instances {node_id} 没有可回显的源字段，未画空牌")
            continue
        ids.add(node_id)
        placement = []
        for key, css in ((("row_v", "grid-row"), ("column_v", "grid-column")) if ctx.orient == "v" else (("row", "grid-row"), ("column", "grid-column"))):
            if isinstance(instance.get(key), int) and instance[key] > 0:
                placement.append(f"{css}:{instance[key]}")
        body = ''.join(f'<div class="dg-name tb">{inline(label, ctx)}</div>' for label in labels)
        panels.append(f'<section class="card ds-panel ds-graph-node ds-graph-instance" data-graph-id="{attr(node_id)}" data-echo="true" style="{attr(";".join(placement))}">{body}</section>')
    for edge in spec.get("edges", []):
        if not isinstance(edge, dict):
            _incomplete(ctx, "graph edges 项必须明确 from/to 节点 ID，未推断端点")
            continue
        _check_nested_fields(edge, {"from", "to", "style", "tone", "return", "offset", "from_side", "to_side", "arrow"}, ctx, "edges")
        start, end = edge.get("from"), edge.get("to")
        if any(edge.get(side) not in (None, "left", "right", "top", "bottom") for side in ("from_side", "to_side")):
            _incomplete(ctx, "edges from_side/to_side 只支持left/right/top/bottom，未猜非法端点")
            continue
        def exists(key):
            return isinstance(key, str) and (key in ids or key.endswith(":*") and any(value.startswith(key[:-2] + "-") for value in ids))
        if not exists(start) or not exists(end):
            _incomplete(ctx, f"graph 连线端点不存在：{start} → {end}，未画猜测线")
            continue
        if edge.get("style", "solid") not in ("solid", "dashed", "dotted") or edge.get("tone", "support") not in ("support", "context", "counter"):
            _incomplete(ctx, "graph 连线只支持明确 solid/dashed/dotted 和 support/context/counter，未替换用户指定关系")
            continue
        if edge.get("tone") == "counter":
            theme = Path(__file__).resolve().parents[2] / "style" / "base.css"
            theme_source = theme.read_text(encoding="utf-8") if theme.is_file() else ""
            theme_source = re.sub(r"/\*.*?\*/", "", theme_source, flags=re.S)
            if not re.search(r"--diagram-counter\s*:", theme_source):
                _incomplete(ctx, "counter反例线尚缺源橙色共享变量--diagram-counter，当前只有浅琥珀回退，源配色未完成")
        edges.append(edge)
    if spec.get("isolated") and edges:
        _incomplete(ctx, "isolated graph 不接受连出其它节点的edges，未画孤立框外连接")
        edges = []
    if not edges and not spec.get("isolated"):
        _incomplete(ctx, "graph 未提供有效 edges，只有明确源节点图形，没有猜连接")
    columns = _columns(spec, ctx, 4)
    gutter = 0
    for edge in edges:
        if edge.get("return"):
            try:
                gutter = max(gutter, max(0, min(200, float(edge.get("offset", 18)))))
            except (TypeError, ValueError):
                _incomplete(ctx, "回连 offset 必须是数字，采用默认18px")
                edge["offset"] = 18
                gutter = max(gutter, 18)
    opening = _root("topology", ctx, "ds-topology-graph" + _caption_size_class(spec, ctx), f"--ds-columns:{columns};--ds-return-gutter:{gutter:g}px")
    opening = opening[:-1] + f' data-graph-edges="{attr(json.dumps(edges, ensure_ascii=False))}">'
    line_layer = '<svg class="ds-graph-lines" aria-hidden="true"></svg>' if edges else ''
    script = _graph_edges_script() if edges else ''
    return opening + line_layer + '<div class="ds-graph-grid">' + ''.join(panels) + '</div>' + script + '</div>'


def _label_units(nodes, spec):
    labels, references = [], []
    for node_index, unit in enumerate(units(nodes)):
        if spec.get("label_split") == "ideographic_space" and unit.get("type") in ("para", "card"):
            if unit.get("type") == "card" and unit.get("name"):
                labels.append({"type": "group", "name": unit["name"]})
                references.append([node_index, "name"])
            for part_index, text in enumerate(part for part in re.split(r"　+", unit.get("text", "")) if part.strip()):
                labels.append({"type": "para", "text": text})
                references.append([node_index, part_index])
        else:
            labels.append(unit)
            references.append(node_index)
    return labels, references


def _normalized_labels(nodes, spec, ctx, kind="topology"):
    positions = spec.get("label_positions") or []
    labels, references = _label_units(nodes, spec)
    background = _map_background(dict(spec, map_asset=spec.get("asset") or spec.get("map_asset")), ctx)
    if not background or len(positions) != len(labels):
        _incomplete(ctx, "插画标签需要明确本地无字底图和每块原文的完整 label_positions，未猜位置，原字完整保留")
        return _root(kind, ctx, "ds-labels-missing") + render_nodes(nodes, ctx) + '</div>'
    valid = []
    for index, (unit, position) in enumerate(zip(labels, positions)):
        if not isinstance(position, dict):
            _incomplete(ctx, "label_positions 每项须为明确坐标对象，原文保持原排")
            return _root(kind, ctx, "ds-labels-missing") + render_nodes(nodes, ctx) + '</div>'
        _check_nested_fields(position, {"text_ref", "node_ref", "x", "y", "width"}, ctx, "label_positions")
        for ref_field in ("text_ref", "node_ref"):
            ref = position.get(ref_field)
            if ref is None:
                continue
            ref_matches = ref == index if isinstance(ref, int) else ref == references[index] if isinstance(ref, list) else any(text.startswith(str(ref).replace("**", "").replace("`", "")) for text in _source_text(unit))
            if not ref_matches:
                _incomplete(ctx, f"label_positions 第{index + 1}项{ref_field}引用不对应本位置原文：{ref}，未将标签错配到底图")
                return _root(kind, ctx, "ds-labels-missing") + render_nodes(nodes, ctx) + '</div>'
        try:
            x, y, width = float(position["x"]), float(position["y"]), float(position["width"])
            if not (0 <= x <= 1 and 0 <= y <= 1 and 0 < width <= 1 and x + width / 2 <= 1 and x - width / 2 >= 0):
                raise ValueError
        except (TypeError, KeyError, ValueError):
            _incomplete(ctx, "label_positions 坐标须为 0～1 的中心 x/y 和合法 width，原文不移入未经核对位置")
            return _root(kind, ctx, "ds-labels-missing") + render_nodes(nodes, ctx) + '</div>'
        valid.append((unit, x, y, width))
    ratio = str(spec.get("aspect_ratio", "auto"))
    fixed_aspect = ratio != "auto"
    if fixed_aspect:
        valid_ratio = bool(re.fullmatch(r"[0-9]+(?:\.[0-9]+)?\s*/\s*[0-9]+(?:\.[0-9]+)?", ratio))
        if valid_ratio:
            valid_ratio = all(float(value.strip()) > 0 for value in ratio.split("/"))
        if not valid_ratio:
            _incomplete(ctx, "标签底图 aspect_ratio 需要明确正数比例，保留实际素材原比例")
            ratio, fixed_aspect = "auto", False
    extra = "ds-normalized-labels" + (" ds-labels-fixed-aspect" if fixed_aspect else "")
    output = [_root(kind, ctx, extra, f"--ds-label-aspect:{ratio}"), '<div class="ds-label-canvas">', f'<img class="ds-label-background" src="{attr(background)}" alt="">']
    for index, (unit, x, y, width) in enumerate(valid):
        output.append(_panel([unit], ctx, "ds-placed-label", style=f"left:{x * 100:g}%;top:{y * 100:g}%;width:{width * 100:g}%", attrs=f'data-label-index="{index}" data-label-node-ref="{attr(json.dumps(references[index], ensure_ascii=False))}"'))
    output.append('</div></div>')
    ctx.warn("插画原文标签已按显式归一化坐标接入；底图无字核验及实际文字相交／越界仍需浏览器验收")
    return "".join(output)


def render_topology(block, ctx):
    spec = dict(block.get("spec", {}))
    if spec.get("text_layout", "block") not in ("block", "inline"):
        _incomplete(ctx, f"topology 不消费 text_layout={spec['text_layout']}，原文保留分段")
        spec["text_layout"] = "block"
    items = units(block.get("nodes", []))
    item_layout = spec.get("items_layout")
    narrow_cards = False
    semantic_icons = None
    if item_layout is not None:
        if not isinstance(item_layout, dict):
            _incomplete(ctx, "topology items_layout 必须是对象，原文完整保留")
        else:
            _check_nested_fields(item_layout, {"split_at", "count", "keep_original_separators", "card_shape", "image_order"}, ctx, "topology items_layout")
            if item_layout.get("split_at") in ("→", "←", "↓", "↑"):
                if item_layout.get("keep_original_separators", True) is True:
                    items = _split_source_arrows(items, item_layout["split_at"])
                    spec["split_arrows"] = False
                else:
                    _incomplete(ctx, "topology items_layout.keep_original_separators 不能删除定稿分隔符，仍完整保留")
            elif "split_at" in item_layout:
                _incomplete(ctx, f"topology 不消费 items_layout.split_at={item_layout['split_at']}，未猜拆分点")
            actual = sum(unit.get("type") != "source_arrow" for unit in items)
            if "count" in item_layout and item_layout["count"] != actual:
                _incomplete(ctx, f"topology items_layout.count={item_layout['count']} 与原文{actual}站不匹配，未删或补节点")
            if item_layout.get("card_shape") == "窄圆角":
                narrow_cards = True
            elif "card_shape" in item_layout:
                _incomplete(ctx, f"topology 不消费 items_layout.card_shape={item_layout['card_shape']}，使用普通卡")
            if "image_order" in item_layout:
                semantic_icons = _semantic_topology_icons(items, spec, item_layout["image_order"], ctx)
    if "topology_layout" in spec:
        configured = _collaboration_topology(items, spec, ctx)
        if configured is not None:
            return configured
    outside_layout = None
    if "placement" in spec or "text_position" in spec:
        pair = (spec.get("placement"), spec.get("text_position"))
        outside_layout = {("left", "right"): "image_left", ("above", "below"): "image_top"}.get(pair)
        if outside_layout is None or spec.get("illustration") != "outside":
            _incomplete(ctx, f"topology 不消费 placement/text_position={pair}，需明确outside图文对应位置")
            outside_layout = None
        else:
            spec["asset_layout"] = outside_layout
    if spec.get("layout") == "labels" or spec.get("label_positions"):
        return _normalized_labels(block.get("nodes", []), spec, ctx)
    if spec.get("asset"):
        selected_asset = spec["asset"]
        if isinstance(selected_asset, dict):
            selected_asset = selected_asset.get(ctx.orient)
        if isinstance(selected_asset, str) and not selected_asset.startswith(("file:", "data:")):
            rooted = Path(ASSET_ROOT) / selected_asset
            if rooted.is_file():
                selected_asset = str(rooted)
        art = images(ctx, {"illustrations": [selected_asset]}, "illustrations") if selected_asset else []
        if art:
            placement = spec.get("asset_layout", "image_left" if ctx.orient == "h" else "image_top")
            if placement not in ("image_left", "image_top"):
                _incomplete(ctx, "asset_layout 仅支持 image_left/image_top，按方向排版")
                placement = "image_left" if ctx.orient == "h" else "image_top"
            weights = spec.get("asset_columns", [48, 52])
            try:
                art_weight, text_weight = float(weights[0]), float(weights[1])
                if art_weight <= 0 or text_weight <= 0:
                    raise ValueError
            except (TypeError, ValueError, IndexError):
                art_weight, text_weight = 48, 52
            return (_root("topology", ctx, "ds-topology-asset ds-asset-" + placement, f"--ds-art-track:{art_weight:g}fr;--ds-art-text-track:{text_weight:g}fr") +
                    f'<img class="ds-topology-art" src="{attr(art[0])}" alt="">' +
                    render_nodes(block.get("nodes", []), ctx) + '</div>')
        _incomplete(ctx, "架构专用无字 asset 未找到，保留说明原文", "asset")
    if outside_layout:
        _incomplete(ctx, "topology outside图文位置已接入；缺本块明确专用asset，未从其它插画挑桥图", "asset")
        return (_root("topology", ctx, "ds-topology-asset ds-asset-" + outside_layout + " ds-asset-missing") +
                render_nodes(block.get("nodes", []), ctx) + '</div>')
    if spec.get("split_arrows"):
        items = _split_source_arrows(items)
    if (spec.get("layout") == "branches" and [item.get("name") for item in items] == ["GitHub", "本机", "生成器", "两份结果", "用的时候"]):
        graph_spec = dict(spec, columns=4, columns_v=1, graph_icon_slots=[1, 2, 3, 4, 5, 6], graph_nodes=[
            {"id":"github","count":1,"row":1,"column":1,"row_v":1,"column_v":1},
            {"id":"local","count":1,"row":2,"column":1,"row_v":2,"column_v":1},
            {"id":"generator","count":1,"row":1,"row_span":2,"column":2,"align_self":"center","row_v":3,"column_v":1},
            {"id":"results","count":1,"shape":"capsules","split_delimiter":"；","part_columns":1,"part_columns_v":1,"row":1,"row_span":2,"column":3,"align_self":"center","row_v":4,"column_v":1},
            {"id":"use","count":1,"row":1,"row_span":2,"column":4,"align_self":"center","row_v":5,"column_v":1}],
            edges=[{"from":"github","to":"generator"},{"from":"local","to":"generator"},
                   {"from":"generator","to":"results:*"},{"from":"results:*","to":"use"}])
        return _graph_topology(items, graph_spec, ctx)
    if spec.get("layout") == "graph" or spec.get("graph_nodes"):
        return _graph_topology(items, spec, ctx)
    hint = spec.get("layout_hint", "")
    if not items:
        _incomplete(ctx, "topology 没有分配到原文nodes，且没有可用专用asset；未画空牌或源外标签")
    if ((hint.startswith("四入口竖列→一个守门节点→三目的节点竖列→一个恢复副本") or hint.startswith("入口2×2→守门整宽→业务三小卡一排→恢复副本整宽")) and len(items) == 4
            and all(item.get("type") == "para" for item in items)
            and items[0].get("text", "").startswith("入口：")
            and "Secret Broker" in items[1].get("text", "")
            and "KDBX" in items[2].get("text", "")
            and "恢复副本" in items[3].get("text", "")):
        graph_spec = dict(spec, graph_nodes=[
            {"id":"entries","count":1,"shape":"capsules","split_delimiter":"｜","prefix_end":"：","part_columns":1,"part_columns_v":2,"row":1,"column":1},
            {"id":"guard","count":1,"row":1,"column":2},
            {"id":"destinations","count":1,"shape":"capsules","split_delimiter":"｜","prefix_end":"→","part_columns":1,"part_columns_v":3,"row":1,"column":3},
            {"id":"backup","count":1,"row":1,"column":4}],
            edges=[{"from":"entries:*","to":"guard"},{"from":"guard","to":"destinations:*"},{"from":"destinations:*","to":"backup"}])
        return _graph_topology(items, graph_spec, ctx)
    if hint:
        _incomplete(ctx, "layout_hint 未含可消费的原文节点引用，需 graph_nodes/edges 或专用无字 asset；未从 scene 补标签")
    layout = spec.get("layout")
    if not layout:
        layout = "layers" if spec.get("layers") else "branches" if spec.get("branches") else "chain" if spec.get("chain") else "list"
    if layout not in ("chain", "layers", "branches", "list"):
        _incomplete(ctx, f"未知架构 layout：{layout}，按原顺序完整显示，不推断关系")
        layout = "list"
    if layout == "list":
        _incomplete(ctx, "架构缺少 chain/layers/branches 规格：当前仅为内容排版，没有推断源图架构")
    if spec.get("connector") == "ribbon":
        _incomplete(ctx, "topology ribbon 未实现原丝带构图，当前只有几何箭头，节点原文仍完整保留")
    icons = semantic_icons if semantic_icons is not None else images(ctx, spec)
    connected = layout != "list" and _connector(spec) and not any(item.get("type") == "source_arrow" for item in items)
    extras = "ds-connected" if connected else ""
    if spec.get("connector") == "bidirectional":
        extras += " ds-bidirectional"
    direction = spec.get("direction", "vertical" if ctx.orient == "v" else "horizontal")
    if direction not in ("vertical", "horizontal"):
        _incomplete(ctx, f"topology 不消费 direction={direction}，按实际方向完整保留文字")
        direction = "vertical" if ctx.orient == "v" else "horizontal"
    try:
        chain_columns = int(spec.get("chain_columns", 0))
    except (TypeError, ValueError):
        chain_columns = 0
        _incomplete(ctx, "chain_columns 必须是整数，按方向排版")
    if chain_columns > 1:
        _incomplete(ctx, "chain_columns 目前只消费1的窄栏纵链，多个定列请用graph_nodes明确原文节点位置")
    if layout == "chain" and (direction == "vertical" or chain_columns == 1):
        extras += " ds-chain-vertical"
    output = [_root("topology", ctx, f"ds-topology-{layout} {extras}" + (" ds-chain-narrow" if narrow_cards else "") + _caption_size_class(spec, ctx), f"--ds-columns:{_columns(spec, ctx, 3)}")]
    if layout in ("chain", "list"):
        declarations = spec.get("chain") if isinstance(spec.get("chain"), list) else spec.get("groups")
        grouped, _ = _groups(items, declarations, ctx) if declarations else ([[item] for item in items], [])
        node_count = sum(not (len(group) == 1 and group[0].get("type") == "source_arrow") for group in grouped)
        icons = semantic_icons if semantic_icons is not None else _topology_icons(ctx, spec, node_count)
        icon_index = 0
        chain_columns = _columns(spec, ctx, 3)
        wrap_chain = ctx.orient == "h" and layout == "chain" and direction == "horizontal" and "columns" in spec and chain_columns < node_count
        alternating = len(grouped) == node_count * 2 - 1 and all((len(group) == 1 and group[0].get("type") == "source_arrow") == (index % 2 == 1) for index, group in enumerate(grouped))
        geometric_chain = wrap_chain and connected and not any(unit.get("type") == "source_arrow" for group in grouped for unit in group)
        if wrap_chain and not alternating and not geometric_chain:
            _incomplete(ctx, "topology 横chain换排需真实N站与N−1原源箭头交替分组；当前原文结构不符合，未猜跨排连接")
            wrap_chain = False
        wrap_edges = []
        if wrap_chain:
            tracks = ' '.join(['minmax(0, 1fr)'] * chain_columns) if geometric_chain else ' '.join('minmax(0, 1fr)' if index % 2 == 0 else '1.5em' for index in range(chain_columns * 2 - 1))
            extra = 'ds-chain-grid ds-chain-geometric ' if geometric_chain else 'ds-chain-grid '
            output[0] = output[0].replace('class="c-diagram c-diagram-topology ', 'class="c-diagram c-diagram-topology ' + extra, 1).replace('style="', f'style="--ds-chain-tracks:{attr(tracks)};', 1)
        output.append('<div class="ds-chain">')
        for i, group in enumerate(grouped):
            if len(group) == 1 and group[0].get("type") == "source_arrow":
                placement, extra, marker = "", "", ""
                if wrap_chain:
                    previous = icon_index - 1
                    row, column = previous // chain_columns * 2 + 1, previous % chain_columns * 2 + 2
                    marker = f' data-chain-arrow="{previous}"'
                    if previous % chain_columns == chain_columns - 1:
                        extra = " ds-chain-wrap-arrow"
                        placement = f'grid-row:{row + 1};grid-column:1 / -1'
                        reverse = group[0]["text"] in ("←", "↑")
                        wrap_edges.append({"from":f"chain-{previous + 1 if reverse else previous}","to":f"chain-{previous if reverse else previous + 1}",
                                           "from_side":"top" if reverse else "bottom","to_side":"bottom" if reverse else "top", "arrow":False,"wrap":True,"source_arrow":previous})
                    else:
                        placement = f'grid-row:{row};grid-column:{column}'
                visible_arrow = "↓" if ctx.orient == "v" and layout == "chain" and group[0]["text"] == "→" else group[0]["text"]
                output.append(f'<div class="ds-source-arrow{extra}" data-arrow="{attr(group[0]["text"])}"{marker} style="{attr(placement)}"><div class="ds-source-arrow-glyph tb"><span class="ds-arrow-turn">{inline(visible_arrow, ctx)}</span></div></div>')
            else:
                panel = _topology_panel(group, ctx, spec, "ds-node", icons[icon_index] if icon_index < len(icons) else None)
                if wrap_chain:
                    row, column = ((icon_index // chain_columns + 1, icon_index % chain_columns + 1) if geometric_chain else
                                   (icon_index // chain_columns * 2 + 1, icon_index % chain_columns * 2 + 1))
                    panel = f'<div class="ds-chain-position" data-graph-id="chain-{icon_index}" style="grid-row:{row};grid-column:{column}">{panel}</div>'
                    if geometric_chain and icon_index:
                        crossing = icon_index % chain_columns == 0
                        edge = {"from": f"chain-{icon_index - 1}", "to": f"chain-{icon_index}",
                                "from_side": "bottom" if crossing else "right", "to_side": "top" if crossing else "left"}
                        wrap_edges.append(edge)
                        if spec.get("connector") == "bidirectional":
                            wrap_edges.append(dict(edge, **{"from": edge["to"], "to": edge["from"],
                                                            "from_side": edge["to_side"], "to_side": edge["from_side"]}))
                output.append(panel)
                icon_index += 1
        output.append("</div>")
        if wrap_edges:
            import json
            output[0] = output[0][:-1] + f' data-graph-edges="{attr(json.dumps(wrap_edges, ensure_ascii=False))}">'
            output.append('<svg class="ds-graph-lines" aria-hidden="true"></svg>' + _graph_edges_script())
    elif layout == "layers":
        grouped, metadata = _groups(items, spec.get("layers"), ctx)
        icons = _topology_icons(ctx, spec, sum(len(group) for group in grouped))
        cursor = 0
        output.append('<div class="ds-layers">')
        for i, group in enumerate(grouped):
            config = metadata[i] if i < len(metadata) else {}
            columns = _columns(config, ctx, min(3, len(group)))
            output.append(f'<div class="ds-layer" style="--ds-layer-columns:{columns}">')
            for unit in group:
                output.append(_topology_panel([unit], ctx, spec, "ds-node", icons[cursor] if cursor < len(icons) else None)); cursor += 1
            output.append("</div>")
        output.append("</div>")
    else:
        # root_count 个单元是主干，随后每一组是规格明确声明的分支。
        try:
            root_count = int(spec.get("root_count", 1))
            if root_count < 1:
                raise ValueError
        except (TypeError, ValueError):
            root_count = 1
            _incomplete(ctx, "branches root_count 必须是正整数，默认1且保留全部原文")
        grouped, _ = _groups(items[root_count:], spec.get("branches"), ctx)
        icons = _topology_icons(ctx, spec, 1 + len(grouped))
        output.append('<div class="ds-branch-root">' + _topology_panel(items[:root_count], ctx, spec, "ds-node", icons[0] if icons else None) + '</div>')
        output.append('<div class="ds-branches">')
        for i, group in enumerate(grouped):
            output.append(_topology_panel(group, ctx, spec, "ds-node ds-branch", icons[i + 1] if i + 1 < len(icons) else None))
        output.append('</div>')
    output.append('</div>')
    return "".join(output)


def _map_background(spec, ctx):
    value = spec.get("map_asset")
    if isinstance(value, dict):
        value = value.get(ctx.orient)
    if not value:
        _incomplete(ctx, "地图缺少专用无字、无连线全景水彩底图 map_asset；保留占位，不使用其它插画冒充", "asset")
        return None
    if str(value).startswith("data:image/"):
        return str(value)
    # 专用底图必须是本地存在的明确文件，不接受远程地址或自动候选插画。
    path = Path(value)
    if not path.is_absolute():
        asset_root = Path(ASSET_ROOT)
        page = ctx.screen.get("id", "").rsplit("-", 1)[0]
        path = asset_root / page / path
    if not path.is_file():
        _incomplete(ctx, f"地图专用底图不存在：{path}", "asset")
        return None
    return ctx.asset_url(str(path))


def _map_card(node, ctx, index, icons, sign_columns=None, compact=False):
    """全角空格分开项目牌；不从规格标题生成任何可见标签。"""
    kind = node.get("type")
    if kind == "para" and node.get("text", "").startswith("这一例用到："):
        # 定稿中的中点依然可见，项目名仅由这行原文切出。
        prefix, body = node["text"].split("：", 1)
        output = [f'<section class="card ds-map-region" data-map-region="{index}">',
                  f'<div class="dg-heading tb">{inline(prefix + "：", ctx)}</div>',
                  f'<div class="ds-map-signs{ " ds-map-signs-grid" if sign_columns else ""}" style="--ds-sign-columns:{sign_columns or 1}">']
        fragments = re.split(r"(\s*·\s*)", body)
        if compact:
            # 中点留在前一块原项目牌的末尾，DOM原序仍等于原句，且分隔符不额外占网格列。
            for part_index in range(0, len(fragments), 2):
                fragment = fragments[part_index]
                suffix = fragments[part_index + 1] if part_index + 1 < len(fragments) else ""
                if fragment.strip():
                    output.append(f'<div class="card ds-map-sign" data-map-sign="{index}-{part_index // 2}"><div class="tb">{inline(fragment, ctx)}<span class="ds-map-separator">{inline(suffix, ctx)}</span></div></div>')
            output.append('</div></section>')
            return ''.join(output)
        for part_index, fragment in enumerate(fragments):
            if not fragment.strip():
                continue
            if "·" in fragment and fragment.strip() == "·":
                output.append(f'<div class="ds-map-separator tb">{inline(fragment, ctx)}</div>')
            else:
                output.append(f'<div class="card ds-map-sign" data-map-sign="{index}-{part_index}"><div class="tb">{inline(fragment, ctx)}</div></div>')
        output.append('</div></section>')
        return "".join(output)
    if kind != "card":
        return _panel([node], ctx, "ds-map-region")
    output = [f'<section class="card ds-map-region" data-map-region="{index}">',
              f'<div class="dg-heading tb">{inline(node.get("name", ""), ctx)}</div>',
              f'<div class="ds-map-signs{ " ds-map-signs-grid" if sign_columns else ""}" style="--ds-sign-columns:{sign_columns or 1}">']
    text = str(node.get("text", ""))
    fragments = [fragment for fragment in re.split(r"　+", text) if fragment.strip()]
    if not fragments:
        output.append(f'<div class="tb">{inline(text, ctx)}</div>')
    for i, fragment in enumerate(fragments):
        art = f'<img class="ds-map-icon" src="{attr(icons[i])}" alt="">' if i < len(icons) else ""
        output.append(f'<div class="card ds-map-sign" data-map-sign="{index}-{i}">{art}<div class="tb">{inline(fragment, ctx)}</div></div>')
    output.append('</div></section>')
    return "".join(output)


def _map_node_columns(nodes, spec, ctx):
    config = spec.get("node_layout")
    if config is None:
        return {}
    if not isinstance(config, dict):
        _incomplete(ctx, "map node_layout 必须为对象，保留原项目牌")
        return {}
    _check_nested_fields(config, {"center", "region_signs", "bases", "outside"}, ctx, "map node_layout")
    patterns = {"center": "四块牌两行两列", "region_signs": "一行两块", "bases": "三块横排",
                "outside": "Google / 网站 / GitHub / 副机分别在岸边；竖版外面一组两列两行"}
    accepted = {}
    for key, value in config.items():
        if key not in patterns:
            continue
        if value == patterns[key]:
            accepted[key] = True
        else:
            _incomplete(ctx, f"map 不消费 node_layout.{key}={value}，未猜项目牌布局")
    result = {}
    for index, node in enumerate(nodes):
        if node.get("type") != "card":
            continue
        name = node.get("name")
        fragments = [part for part in re.split(r"　+", node.get("text", "")) if part.strip()]
        key = "center" if name == "中间" else "bases" if name == "三个底座" else "outside" if name == "外面" else "region_signs"
        if key not in accepted:
            continue
        expected_count = {"center": 4, "bases": 3, "outside": 4}.get(key)
        if expected_count is not None and len(fragments) != expected_count:
            _incomplete(ctx, f"map node_layout.{key} 要求{expected_count}块，原文实际{len(fragments)}块，未删补牌子")
        result[index] = 3 if key == "bases" else 2
        if key == "outside" and ctx.orient == "h":
            _incomplete(ctx, "map node_layout.outside 横版岸边四处位置缺逐牌实测坐标；暂保留原序2列牌，未称已定位")
    return result


def _map_positions_source(spec, ctx):
    reference = spec.get("positions_source")
    if reference is None:
        return None
    if reference != "page.registry.map_layout":
        _incomplete(ctx, f"map 不消费 positions_source={reference}，未从其它文档拼坐标")
        return "unsupported"
    page = getattr(ctx, "page", {})
    registry = page.get("registry", {}) if isinstance(page, dict) else {}
    layout = registry.get("map_layout") if isinstance(registry, dict) else None
    if not isinstance(layout, dict):
        _incomplete(ctx, "map positions_source=page.registry.map_layout 未在当前page找到真实对象，未猜坐标")
        return "missing"
    orientation = "landscape" if ctx.orient == "h" else "portrait"
    if not isinstance(layout.get(orientation), dict):
        _incomplete(ctx, f"map registry.map_layout 缺当前{orientation}结构，未使用另一方向坐标")
    measured = layout.get("measured")
    if not isinstance(measured, dict) or not measured:
        _incomplete(ctx, "map positions_source 已读取当前page.registry.map_layout；只有生图目标/顺序，measured为空，仍缺实际底图逐牌外框坐标")
        return "unmeasured"
    _incomplete(ctx, "map registry.map_layout.measured 尚缺与每块原文匹配的label_positions规范；未把未知坐标对象当完成")
    return "unbound"


def render_map(block, ctx):
    spec = block.get("spec", {})
    nodes = block.get("nodes", [])
    if spec.get("label_positions"):
        return _normalized_labels(nodes, spec, ctx, "map")
    if spec.get("regions") and all(isinstance(region, dict) and {"x", "y", "width"} <= region.keys() for region in spec["regions"]):
        return _normalized_labels(nodes, dict(spec, label_positions=spec["regions"]), ctx, "map")
    background = _map_background(spec, ctx)
    cols = _columns(spec, ctx, 3)
    if ctx.orient == "v" and "columns_v" not in spec:
        cols = 2
    if spec.get("relations") or spec.get("connector") not in (None, "none"):
        _incomplete(ctx, "地图关系线／光点由网页覆盖，本组件没有把关系画进底图或图片")
    positions = spec.get("regions") or []
    layout = spec.get("layout")
    compact = layout in ("sidebar", "footer")
    if layout not in (None, "grid_regions", "islands", "sidebar", "footer"):
        _incomplete(ctx, f"map 不消费 layout={layout}，保留原区域卡")
    sign_columns = _map_node_columns(nodes, spec, ctx)
    position_status = _map_positions_source(spec, ctx)
    if spec.get("illustration") not in (None, "none", "outside"):
        _incomplete(ctx, f"map 不消费 illustration={spec.get('illustration')}，未猜图位")
    if not positions and not compact:
        _incomplete(ctx, "地图没有 regions 布局规格：当前是保留定稿顺序的区域占位，尚未复现源图岛屿位置")
    if compact:
        _incomplete(ctx, "map sidebar/footer 已将原项目牌按指定列数紧凑排版；缺本例岛屿/逐牌锚点，当前未复现局部地图位置")
    extra = ("ds-map-ready" if background else "ds-map-missing") + (" ds-map-compact ds-map-" + layout if compact else "")
    if spec.get("illustration") == "outside":
        extra += " ds-map-art-outside"
    opening = _root("map", ctx, extra, f"--ds-columns:{cols}")
    if position_status:
        opening = opening[:-1] + f' data-map-positions-source="{attr(spec["positions_source"])}" data-map-positions-status="{position_status}">'
    output = [opening, '<div class="ds-map-canvas" data-map-overlay="web">']
    if background:
        output.append(f'<img class="ds-map-background" src="{attr(background)}" alt="">')
    else:
        output.append('<div class="ds-map-background ds-map-placeholder" aria-hidden="true"></div>')
    output.append('<div class="ds-map-regions">')
    region_icons = spec.get("region_icons") or []
    for i, node in enumerate(nodes):
        config = positions[i] if i < len(positions) and isinstance(positions[i], dict) else {}
        # 网格行/列明示源图位置，同时 HTML 中的定稿顺序不变。
        declarations = []
        for key, css in (("row", "grid-row"), ("column", "grid-column")):
            value = config.get(key)
            if isinstance(value, int) and value > 0:
                declarations.append(f"{css}:{value}")
        if node.get("type") in ("h1", "h2", "para", "code", "table", "legend", "linkrow", "now") and not declarations:
            declarations.append("grid-column:1 / -1")
        output.append(f'<div class="ds-map-position" style="{attr(";".join(declarations))}">')
        icon_spec = region_icons[i] if i < len(region_icons) else "none"
        icon_urls = images(ctx, {"icons": icon_spec})
        output.append(_map_card(node, ctx, i, icon_urls, cols if compact else sign_columns.get(i), compact))
        output.append('</div>')
    output.append('</div></div></div>')
    return "".join(output)


SPEC_FIELDS = {
    "comparison": ["columns", "columns_v", "groups", "layout", "icons", "connector", "illustration",
                   "inline_groups", "inline_icon_map", "inline_icons", "inner_link_columns", "inner_link_order",
                   "item_cards", "item_icon_map", "item_icons", "icon_map", "group_markers",
                   "question_result_columns", "image_mode", "group_images", "group_icon_map", "group_image_source",
                   "group_image_columns", "group_header_position", "items_layout", "list_layout", "item_illustration", "heading_mark", "align_items", "number_heading", "status_dots"],
    "topology": ["columns", "columns_v", "layout", "chain", "chain_columns", "direction", "groups",
                 "split_arrows", "layers", "branches", "root_count", "connector", "icons", "illustration", "asset",
                 "asset_layout", "asset_columns", "map_asset", "layout_hint", "graph_nodes", "graph_icon_slots", "edges", "node_instances", "isolated", "size",
                 "label_positions", "label_split", "aspect_ratio", "items_layout", "topology_layout", "placement", "text_position", "text_layout"],
    "map": ["columns", "columns_v", "map_asset", "asset", "regions", "region_icons",
            "label_positions", "label_split", "aspect_ratio", "layout", "illustration", "positions_source", "node_layout", "connector", "relations"],
}

COMPONENTS = {"comparison": render_comparison, "topology": render_topology, "map": render_map}

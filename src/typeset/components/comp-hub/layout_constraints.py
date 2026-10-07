"""核对项目卡和标题条已经实现的固定排法，不从规格生成可见文字。

wrap_renderer 只复制 block/spec；原节点和 Ctx 原样交给原渲染器。
parts 仅支持能定位到原节点的 prose/stat_card/action_button 描述。
统计子块的字段可派生到父规格，其它排法不会借元数据悄悄实现。
"""
from functools import wraps
from pathlib import Path
import math
import re

from engine.parse import canon, node_text


SUPPORTED_FIELDS = {
    "title_strip": ["size", "heading_style", "columns", "illustration", "connector",
                    "description_text_ref"],
    "project_tile": ["align", "size", "connector", "icons", "title_style",
                     "title_position", "status_position", "badge_position",
                     "illustration_position", "tagline_position", "stats_position",
                     "number_label_position", "date_position", "footer_position",
                     "show_badge", "frozen", "source_regions", "parts",
                     "retirement_inline_link_style", "link_layout"],
}

_DATES = ("截至北京时间", "统计于北京时间")
_RETIREMENT = ("停下原因：", "现在：")
_HEADINGS = ("h1", "h2", "h3", "group")


def _incomplete(ctx, kind, field, value, reason):
    ctx.incomplete(f"{kind}.{field}={value!r} 未执行：{reason}", "composition")


def _check(ctx, kind, spec, field, expected, condition=True, reason="与当前固定排法不符"):
    if field in spec and (spec[field] != expected or not condition):
        _incomplete(ctx, kind, field, spec[field], reason)


def _original_text(node):
    text = node_text(node)
    if text:
        return text
    # 也允许调用方传入已解析但没有 src 的原节点；仍只读节点内容。
    return canon(str(node.get("name", "")) + str(node.get("text", "")))


def _starts(node, ref):
    if not isinstance(ref, str) or not ref.strip():
        return False
    return _original_text(node).startswith(canon(ref.split("|")[0]))


def _stat_count(node):
    if node.get("type") == "stats":
        return len(node.get("items", []))
    if node.get("type") == "para":
        cells = node.get("text", "").split("｜")
        if cells and all("·" in cell for cell in cells):
            return len(cells)
    return 0


def _project_groups(nodes):
    groups = []
    for node in nodes:
        if node.get("type") == "card" or not groups:
            groups.append([])
        groups[-1].append(node)
    return groups


def _regions(group):
    """跟 tiles.render_project_tile 同样识别开头介绍和其后的实际节点。"""
    has_header = bool(group) and group[0].get("type") == "card"
    start = 1 if has_header else 0
    intro = []
    while start < len(group):
        node = group[start]
        text = node.get("text", "")
        if (node.get("type") != "para" or _stat_count(node) or
                text.startswith(_DATES + _RETIREMENT + ("直达：",))):
            break
        intro.append(start)
        start += 1
    result = {"header": has_header, "intro": intro, "stats": [], "date": [],
              "retirement": [], "footer": []}
    for i in range(start, len(group)):
        node = group[i]
        if _stat_count(node):
            result["stats"].append(i)
        elif node.get("type") == "para":
            text = node.get("text", "")
            if text.startswith(_DATES):
                result["date"].append(i)
            elif text.startswith(_RETIREMENT):
                result["retirement"].append(i)
            elif text.startswith("直达："):
                result["footer"].append(i)
    return result


def _after(a, b):
    return bool(a and b) and max(a) < min(b)


def _source_regions(spec, groups, regions, ctx):
    if "source_regions" not in spec:
        return
    source = spec["source_regions"]
    if not isinstance(source, dict):
        _incomplete(ctx, "project_tile", "source_regions", source, "应逐项指定已支持的区域")
        return
    right = ctx.orient == "h" and spec.get("illustration", "right_inside") == "right_inside"
    for key, value in source.items():
        matches = []
        for group, reg in zip(groups, regions):
            if key == "title":
                matches.append(value == "upper_left" and reg["header"])
            elif key == "tagline":
                matches.append(value == "middle_left" and right and bool(reg["intro"]))
            elif key == "illustration":
                matches.append(value == "upper_right" and right)
            elif key == "stats":
                matches.append(value == "below_illustration" and right and bool(reg["stats"]))
            elif key == "date":
                matches.append(value == "below_stats" and _after(reg["stats"], reg["date"]))
            elif key == "retirement":
                matches.append((value is None and not reg["retirement"]) or
                    (value == "between_date_and_footer" and
                     _after(reg["date"], reg["retirement"]) and
                     _after(reg["retirement"], reg["footer"])))
            else:
                matches.append(False)
        if not matches or not all(matches):
            _incomplete(ctx, "project_tile", f"source_regions.{key}", value,
                        "区域不受支持、原节点缺失，或与当前节点顺序/插画方位不符")


def _parts(spec, nodes, ctx):
    """核对已有子块；同一父渲染器只能执行一组共用的统计规格。"""
    if "parts" not in spec:
        return
    parts = spec["parts"]
    if not isinstance(parts, (list, tuple)):
        _incomplete(ctx, "project_tile", "parts", parts, "应为按原节点顺序排列的子块列表")
        return
    proposals, previous, valid = {}, -1, True
    targets = {
        "columns": "portrait_columns" if ctx.orient == "v" else "columns",
        "stat_columns": "portrait_columns" if ctx.orient == "v" else "columns",
        "rows": "portrait_number_rows" if ctx.orient == "v" else "number_rows",
        "number_rows": "portrait_number_rows" if ctx.orient == "v" else "number_rows",
        "align": "stat_alignment", "stat_alignment": "stat_alignment",
        "stat_count": "stat_count", "stat_style": "stat_style",
        "number_column_widths": ("portrait_number_column_widths" if ctx.orient == "v"
                                 else "number_column_widths"),
    }
    for part_index, part in enumerate(parts):
        field = f"parts[{part_index}]"
        if not isinstance(part, dict):
            _incomplete(ctx, "project_tile", field, part, "子块必须带 type/text_ref")
            valid = False
            continue
        kind, ref = part.get("type"), part.get("text_ref")
        positions = [i for i, node in enumerate(nodes) if _starts(node, ref)]
        if len(positions) != 1 or positions[0] <= previous:
            _incomplete(ctx, "project_tile", field, ref, "未唯一定位到原节点，或子块顺序有冲突")
            valid = False
            continue
        position = previous = positions[0]
        node = nodes[position]
        count = _stat_count(node)
        is_footer = (node.get("type") == "para" and node.get("text", "").startswith("直达：") and
                     bool(re.search(r"〔[^〔〕]+〕", node.get("text", ""))))
        if not ((kind == "stat_card" and count) or
                (kind == "prose" and node.get("type") == "para" and not count) or
                (kind == "action_button" and is_footer)):
            _incomplete(ctx, "project_tile", field, kind, "该子块类型并非父组件实际输出的对应原节点")
            valid = False
            continue
        for key, value in part.items():
            if key in ("type", "text_ref"):
                continue
            if kind == "stat_card" and key in targets:
                target = targets[key]
                okay = True
                if key in ("columns", "stat_columns"):
                    okay = isinstance(value, int) and not isinstance(value, bool) and value > 0
                elif key in ("rows", "number_rows"):
                    okay = (isinstance(value, (list, tuple)) and bool(value) and
                            all(isinstance(n, int) and not isinstance(n, bool) and n > 0 for n in value) and
                            sum(value) == count)
                elif key in ("align", "stat_alignment"):
                    okay = value in ("left", "center", "right")
                elif key == "stat_count":
                    okay = isinstance(value, int) and not isinstance(value, bool) and value == count
                elif key == "stat_style":
                    okay = value in ("rounded_thin_border", "soft_filled_borderless")
                if not okay or (target in proposals and proposals[target] != value):
                    _incomplete(ctx, "project_tile", f"{field}.{key}", value,
                                "取值无效，或同一父组件不能执行相互冲突的子块规格")
                    valid = False
                else:
                    proposals[target] = value
            elif key in ("icons", "illustration", "connector") and value == "none":
                continue
            elif key == "align" and value == "left" and kind in ("prose", "action_button"):
                continue
            elif key == "number_label_position" and value == "below" and kind == "stat_card":
                continue
            else:
                _incomplete(ctx, "project_tile", f"{field}.{key}", value, "父组件没有执行该子块字段")
                valid = False
    for target, value in proposals.items():
        current = spec.get(target, value)
        if current != value:
            _incomplete(ctx, "project_tile", f"parts.{target}", value, "子块和父规格冲突")
            valid = False
        if target == "columns" and "stat_columns" in spec and spec["stat_columns"] != value:
            _incomplete(ctx, "project_tile", "parts.columns", value, "子块与父 stat_columns 冲突")
            valid = False
    if valid:
        for target, value in proposals.items():
            spec.setdefault(target, value)


def _statistics(spec, nodes, ctx):
    """原统计渲染器会回退的坏值，不能借已有 SPEC_FIELDS 算完成。"""
    counts = [_stat_count(node) for node in nodes if _stat_count(node)]
    column_key = "portrait_columns" if ctx.orient == "v" else "columns"
    raw_columns = spec.get(column_key, spec.get("stat_columns", 5) if ctx.orient == "h" else 2)
    valid_columns = isinstance(raw_columns, int) and not isinstance(raw_columns, bool) and raw_columns > 0
    if not valid_columns:
        _incomplete(ctx, "project_tile", column_key, raw_columns, "数字列数必须是正整数")
    if ctx.orient == "h" and "columns" in spec and "stat_columns" in spec and spec["columns"] != spec["stat_columns"]:
        _incomplete(ctx, "project_tile", "stat_columns", spec["stat_columns"], "与优先执行的 columns 冲突")
    for field, allowed in (("stat_alignment", ("left", "center", "right")),
                           ("stat_style", ("rounded_thin_border", "soft_filled_borderless"))):
        if field in spec and spec[field] not in allowed:
            _incomplete(ctx, "project_tile", field, spec[field], "该取值会被原统计渲染器回退")
    row_key = "portrait_number_rows" if ctx.orient == "v" else "number_rows"
    width_key = "portrait_number_column_widths" if ctx.orient == "v" else "number_column_widths"
    for count in counts:
        rows = spec.get(row_key)
        valid_rows = (isinstance(rows, (list, tuple)) and bool(rows) and
                      all(isinstance(n, int) and not isinstance(n, bool) and n > 0 for n in rows) and
                      sum(rows) == count)
        if row_key in spec and not valid_rows:
            _incomplete(ctx, "project_tile", row_key, rows, "行数须为正整数且合计等于实际原文数字格数")
        if valid_rows and valid_columns and max(rows) > raw_columns:
            _incomplete(ctx, "project_tile", column_key, raw_columns, "实际 number_rows 超过所要求的最大列数")
        if "stat_count" in spec and (not isinstance(spec["stat_count"], int) or
                                      isinstance(spec["stat_count"], bool) or spec["stat_count"] != count):
            _incomplete(ctx, "project_tile", "stat_count", spec["stat_count"], "与实际原文数字格数不符")
        if not valid_rows:
            row_count = math.ceil(count / (raw_columns if valid_columns else 5 if ctx.orient == "h" else 2))
            size, remainder = divmod(count, row_count)
            rows = [size + (i >= row_count - remainder) for i in range(row_count)]
        if width_key in spec:
            widths = spec[width_key]
            if (not isinstance(widths, (list, tuple)) or len(widths) != len(rows) or
                    any(not isinstance(width, (list, tuple)) or len(width) != size or
                        any(not isinstance(x, (int, float)) or isinstance(x, bool) or not math.isfinite(x) or x <= 0
                            for x in width) for width, size in zip(widths, rows))):
                _incomplete(ctx, "project_tile", width_key, widths, "逐行比例须对应实际行格数且全部为正有限数")
    if not counts and any(key in spec for key in (row_key, width_key, "stat_count", "stat_alignment", "stat_style")):
        _incomplete(ctx, "project_tile", "stats", None, "原节点没有数字区，所写统计约束没有执行对象")


def _project(spec, nodes, ctx):
    _parts(spec, nodes, ctx)
    _statistics(spec, nodes, ctx)
    groups = _project_groups(nodes)
    regions = [_regions(group) for group in groups]
    headers = bool(groups) and all(reg["header"] for reg in regions)
    labels = [re.split(r"[\s　]+", group[0].get("text", "").strip(), maxsplit=1)
              if reg["header"] else [] for group, reg in zip(groups, regions)]
    right = ctx.orient == "h" and spec.get("illustration", "right_inside") == "right_inside"
    if "illustration" in spec and spec["illustration"] not in (
            "right_inside", "left_inside", "top_inside", "above_card", "outside", "none"):
        _incomplete(ctx, "project_tile", "illustration", spec["illustration"], "该方位会被原渲染器回退")
    for field, expected in (("align", "left"), ("size", "medium"),
                            ("connector", "none"), ("icons", "none")):
        _check(ctx, "project_tile", spec, field, expected)
    for field, expected in (("title_style", "sans_bold"), ("title_position", "top_left")):
        _check(ctx, "project_tile", spec, field, expected, headers, "固定标题必须来自每张卡的首个 card 节点")
    _check(ctx, "project_tile", spec, "status_position", "after_title",
           headers and all(label and label[0] for label in labels), "没有可在原标题后输出的状态")
    _check(ctx, "project_tile", spec, "badge_position", "top_right", headers and ctx.orient == "h",
           "当前右靠徽章仅在横版首行实现；竖版另起一行")
    _check(ctx, "project_tile", spec, "illustration_position", "right_inside_above_stats", right,
           "当前插画/空位没有采用横版右内栏")
    _check(ctx, "project_tile", spec, "tagline_position", "left_inside_below_title",
           right and headers and all(reg["intro"] for reg in regions), "原介绍未进入标题下的左内栏")
    _check(ctx, "project_tile", spec, "stats_position", "full_width_below_hero",
           bool(regions) and all(reg["stats"] for reg in regions), "没有实际数字区")
    _check(ctx, "project_tile", spec, "number_label_position", "below",
           bool(regions) and all(reg["stats"] for reg in regions), "没有实际数字/说明格")
    _check(ctx, "project_tile", spec, "date_position", "below_stats",
           bool(regions) and all(_after(reg["stats"], reg["date"]) for reg in regions),
           "原日期未位于全部数字节点之后")
    _check(ctx, "project_tile", spec, "footer_position", "bottom_left",
           bool(regions) and all(reg["footer"] and reg["footer"][-1] == len(group) - 1
                                 for group, reg in zip(groups, regions)), "直达节点并非卡片末尾")
    for field, actual in (("show_badge", [len(label) == 2 and bool(label[1]) for label in labels]),
                          ("frozen", [bool(label) and label[0] == "冻结" for label in labels])):
        if field in spec and (not isinstance(spec[field], bool) or not headers or
                              not all(spec[field] == value for value in actual)):
            _incomplete(ctx, "project_tile", field, spec[field],
                        "与原首行实际徽章/冻结状态不符；不从元数据增删文字或改变状态")
    _check(ctx, "project_tile", spec, "retirement_inline_link_style", "underlined_inline",
           bool(regions) and all(reg["retirement"] for reg in regions), "没有原停下原因/现在行可用原 inline 输出")
    _source_regions(spec, groups, regions, ctx)
    # 根已接入 one_row 的 data 属性与 nowrap；其它布局仍明确未实现。
    if "link_layout" in spec and spec["link_layout"] not in (None, "none", "auto", "one_row"):
        _incomplete(ctx, "project_tile", "link_layout", spec["link_layout"],
                    "仅支持已接入的 one_row 直达入口排法")


def _title_strip(spec, nodes, ctx):
    heading = bool(nodes) and nodes[0].get("type") in _HEADINGS
    layout = spec.get("layout", "stacked" if ctx.orient == "v" else "inline")
    if "size" in spec and (spec["size"] not in ("small", "medium", "large") or not heading):
        _incomplete(ctx, "title_strip", "size", spec["size"], "标题条须有原始标题节点且档位为 small/medium/large")
    _check(ctx, "title_strip", spec, "heading_style", "sans_bold", heading,
           "标题条须有原始标题节点并使用当前粗体字体")
    _check(ctx, "title_strip", spec, "connector", "none")
    if "layout" in spec and layout not in ("inline", "stacked"):
        _incomplete(ctx, "title_strip", "layout", layout, "只实现 inline/stacked")
    if "columns" in spec:
        expected = 1 if layout == "stacked" else 2
        if (not isinstance(spec["columns"], int) or isinstance(spec["columns"], bool) or
                spec["columns"] != expected or not heading or len(nodes) < 2):
            _incomplete(ctx, "title_strip", "columns", spec["columns"], "必须对应 stacked 的一列或 inline 的标题/说明两栏")
    for field, allowed in (("description_align", ("left", "center")),
                           ("leaf_position", ("left_of_heading", "none")),
                           ("brush_position", ("below_heading", "below_whole_row"))):
        if field in spec and spec[field] not in allowed:
            _incomplete(ctx, "title_strip", field, spec[field], "取值不受当前标题条支持")
    if "align" in spec:
        _check(ctx, "title_strip", spec, "align", "center" if layout == "stacked" else "left",
               reason="现有 inline 标题靠左，stacked 标题居中")
    for field in ("leaves", "right_leaves", "frozen", "muted"):
        if field in spec and not isinstance(spec[field], bool):
            _incomplete(ctx, "title_strip", field, spec[field], "应为布尔值")
    if "illustration" in spec:
        left_leaf = spec.get("leaves", True) and spec.get("leaf_position", "left_of_heading") != "none"
        _check(ctx, "title_strip", spec, "illustration", "left_inside", bool(left_leaf),
               "本标题条的 left_inside 指现有标题左侧叶子；其它插画方位尚未实现")
        leaf_path = Path(__file__).resolve().parents[2] / "assets" / "leaf-l.png"
        if left_leaf and spec["illustration"] == "left_inside" and not leaf_path.is_file():
            ctx.incomplete("title_strip 左侧叶子素材缺失", "asset")
    if "description_text_ref" in spec:
        body = nodes[1:] if heading else nodes
        if not body or not _starts(body[0], spec["description_text_ref"]):
            _incomplete(ctx, "title_strip", "description_text_ref", spec["description_text_ref"],
                        "没有定位到当前原说明开头；仍只输出原节点文字")


def wrap_renderer(fn, kind):
    """保留 fn(block, ctx) 接口，只核对本模块明确支持的两种组件。"""
    if kind not in SUPPORTED_FIELDS:
        raise ValueError(f"layout_constraints 没有适配组件 {kind!r}")

    @wraps(fn)
    def render(block, ctx):
        spec = dict(block.get("spec", {}))
        nodes = block.get("nodes", [])
        if kind == "project_tile":
            _project(spec, nodes, ctx)
        else:
            _title_strip(spec, nodes, ctx)
        return fn(dict(block, spec=spec), ctx)

    return render

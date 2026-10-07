"""Empty live regions; all visible copy is supplied by finalized nodes."""
from html import escape
import json
from pathlib import Path
from engine.assets import ASSET_ROOT
import re
from urllib.parse import unquote, urlsplit

from .common import render_nodes, screen_value, spec_of


def _slot(ctx, key, part, classes="", extra=""):
    return (f'<div class="c-slot-live-frame {classes}" '
            f'data-live-part="{escape(str(part), quote=True)}" '
            f'{ctx.hot("live", key)} {extra}></div>')


def _keys(ctx, spec):
    values = spec.get("keys", screen_value(ctx, "live", []))
    if isinstance(values, str):
        values = [values]
    return list(values or [])


def _items_layout(spec, orient, defaults=None):
    """Read direction-specific live_box sizing without changing the source nodes."""
    result = dict(defaults or {})
    layout = spec.get("items_layout")
    if not isinstance(layout, dict):
        return result
    result.update({key: value for key, value in layout.items() if key not in ("h", "v")})
    directional = layout.get(orient)
    if isinstance(directional, dict):
        result.update(directional)
    return result


def _card_part_starts(groups, layout, ctx):
    """只按实际卡名分部；断点交给主引擎已有的完整卡切张接口。"""
    parts = layout.get("source_parts")
    if not parts:
        return {}
    names = [head.get("name", "") for head, _ in groups]
    valid = (ctx.orient == "v" and isinstance(parts, list)
             and all(isinstance(part, dict) and isinstance(part.get("groups"), list)
                     and part["groups"] and part.get("part") is not None for part in parts))
    ordered = [name for part in parts for name in part.get("groups", [])] if valid else []
    if not valid or ordered != names or len({str(part["part"]) for part in parts}) != len(parts):
        ctx.incomplete("live_box.items_layout.source_parts 不能对应本块完整卡名原顺序，指定分张未执行", "composition")
        return {}
    starts, offset = {}, 0
    for i, part in enumerate(parts):
        starts[offset] = (str(part["part"]), i > 0)
        offset += len(part["groups"])
    return starts


def _canvas_dimension(ctx, layout, axis):
    orient = getattr(ctx, "orient", "h")
    defaults = {"h": {"canvas_width": 1672, "canvas_height": 941},
                "v": {"canvas_width": 941, "canvas_height": 1672}}
    field = "canvas_width" if axis == "width" else "canvas_height"
    value = (layout or {}).get(field, defaults.get(orient, defaults["h"])[field])
    if isinstance(value, str):
        value = value.strip().lower().removesuffix("px")
    try:
        size = float(value)
    except (TypeError, ValueError):
        size = float(defaults.get(orient, defaults["h"])[field])
    return max(1.0, size)


def _css_size(value, fallback=None, ctx=None, axis=None, layout=None):
    """Translate screen-relative lengths to the fixed 1672×941 / 941×1672 canvas."""
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return f"{value}px"
    if value is None and fallback is not None:
        value = fallback
    if not isinstance(value, str):
        return fallback
    value = value.strip().lower()
    match = re.fullmatch(r"(\d+(?:\.\d+)?)\s*%\s*(?:screen\s*)?(width|height)", value)
    if match:
        pct, dimension = float(match.group(1)), match.group(2)
        if ctx is not None:
            return f"{pct * _canvas_dimension(ctx, layout, dimension) / 100:g}px"
        return fallback
    match = re.fullmatch(r"(\d+(?:\.\d+)?)\s*%\s*screen", value)
    if match:
        dimension = axis or "height"
        if ctx is not None:
            return f"{float(match.group(1)) * _canvas_dimension(ctx, layout, dimension) / 100:g}px"
        return fallback
    match = re.fullmatch(r"(\d+(?:\.\d+)?)(vw|vh)", value)
    if match:
        dimension = "width" if match.group(2) == "vw" else "height"
        if ctx is not None:
            return f"{float(match.group(1)) * _canvas_dimension(ctx, layout, dimension) / 100:g}px"
        return fallback
    aliases = {
        "two_body_lines": "2lh", "two body lines": "2lh", "two lines": "2lh",
        "one_and_a_half_body_lines": "1.5lh", "one and a half body lines": "1.5lh",
    }
    if value in aliases:
        return aliases[value]
    if re.fullmatch(r"(?:\d+(?:\.\d+)?)(?:px|%|em|rem|lh)", value):
        return value
    return fallback


def _inline_style(values):
    return escape(";".join(f"{key}:{value}" for key, value in values.items() if value), quote=True)


def _overall_defaults(ctx):
    if ctx.orient == "h":
        return {
            "lamp_diameter": "22% screen height",
            "summary_width": "55% screen width",
            "summary_height": "9% screen height",
            "quick_width": "10.5% screen width",
            "quick_height": "9% screen height",
            "quick_columns": 5,
            "lamp_alignment": "left",
            "quick_alignment": "start",
        }
    return {
        "lamp_diameter": "22% screen width",
        "summary_width": "100%",
        "summary_height": "two_body_lines",
        "quick_width": "100%",
        "quick_height": "one_and_a_half_body_lines",
        "quick_columns": 1,
        "lamp_alignment": "center",
        "quick_alignment": "stretch",
    }


def _overall(block, ctx, key):
    values = _items_layout(spec_of(block), ctx.orient, _overall_defaults(ctx))
    defaults = _overall_defaults(ctx)
    number = values.get("quick_columns", 5 if ctx.orient == "h" else 1)
    try:
        columns = max(1, min(5, int(number)))
    except (TypeError, ValueError):
        columns = 5 if ctx.orient == "h" else 1
    vars_ = {
        "--slot-live-lamp-size": _css_size(values.get("lamp_diameter"), defaults["lamp_diameter"], ctx, "height", values),
        "--slot-live-summary-width": _css_size(values.get("summary_width"), "100%", ctx, "width", values),
        "--slot-live-summary-height": _css_size(values.get("summary_height"), "2lh", ctx, "height", values),
        "--slot-live-quick-width": _css_size(values.get("quick_width"), "100%", ctx, "width", values),
        "--slot-live-quick-height": _css_size(values.get("quick_height"), "1.5lh", ctx, "height", values),
        "--slot-live-quick-columns": str(columns),
        "--slot-live-lamp-align": "center" if values.get("lamp_alignment") == "center" else "start",
        "--slot-live-quick-align": "stretch" if values.get("quick_alignment") == "stretch" else "start",
    }
    quick = "".join(_slot(ctx, key, f"quick-{i}") for i in range(1, 6))
    return (f'<div class="c-slot-live-overall" style="{_inline_style(vars_)}">'
            f'{_slot(ctx, key, "lamp", "c-slot-live-lamp")}'
            f'<div class="c-slot-live-overview">'
            f'{_slot(ctx, key, "summary", "c-slot-live-summary")}'
            f'<div class="c-slot-live-quick">{quick}</div></div></div>')


def _maintenance_pair(nodes, ctx, keys, spec):
    """Keep one parsed “现在” node, its labels, and all matching live frames in one card."""
    index = next((i for i, node in enumerate(nodes)
                  if node.get("type") == "now" and node.get("slots")), None)
    if index is None:
        ctx.incomplete("maintenance_pair 没有拿到定稿 now 标签节点", "composition")
        return render_nodes(nodes, ctx)
    node = nodes[index]
    labels = list(node.get("slots", []))
    if len(labels) != len(keys):
        ctx.incomplete("maintenance_pair 的定稿标签数与 live 键数不一致", "composition")
        return render_nodes(nodes, ctx)

    values = _items_layout(spec, ctx.orient)
    horizontal = ctx.orient == "h"
    frame_width = _css_size(values.get("frame_width"), "260px" if horizontal else "60% screen width", ctx, "width", values)
    frame_height = _css_size(values.get("frame_height"), "40px" if horizontal else "5% screen height", ctx, "height", values)
    style = _inline_style({"--slot-live-maintenance-frame-width": frame_width,
                           "--slot-live-maintenance-frame-height": frame_height})
    groups = []
    for key, label in zip(keys, labels):
        groups.append('<div class="c-slot-live-maintenance-group">'
                      f'<span class="c-slot-live-maintenance-label tb">{ctx.inline(label)}</span>'
                      f'{_slot(ctx, key, key, "c-slot-live-maintenance-frame")}'
                      '</div>')
    card = (f'<div class="c-slot-live-maintenance-card card" style="{style}">'
            f'<span class="c-slot-live-maintenance-title tb">{ctx.inline(node.get("label", ""))}</span>'
            f'<div class="c-slot-live-maintenance-groups">{"".join(groups)}</div></div>')
    return render_nodes(nodes[:index], ctx) + card + render_nodes(nodes[index + 1:], ctx)


def _single_slot_style(spec, ctx):
    values = _items_layout(spec, ctx.orient)
    width = "100%" if values.get("full_width") is True else _css_size(values.get("width"), "100%", ctx, "width", values)
    height = _css_size(values.get("height"), None, ctx, "height", values)
    return _inline_style({"--slot-live-frame-width": width,
                          "--slot-live-frame-height": height})


def _single_position_attr(spec, ctx):
    position = _items_layout(spec, ctx.orient).get("position")
    if position in (None, ""):
        return ""
    if position not in _POSITIONS:
        return ""
    return f' data-slot-position="{escape(position, quote=True)}"'


def _column_count(spec, orient, layout, default):
    field = "columns_v" if orient == "v" and spec.get("columns_v") is not None else "columns"
    value = spec.get(field, default)
    try:
        value = int(value)
    except (TypeError, ValueError):
        value = default
    maximum = 3 if layout == "cards" else 1
    return max(1, min(maximum, value))


def _validate_live_spec(spec, ctx, keys):
    if spec.get("empty") is False:
        ctx.incomplete("live_box 只输出无字实时空框，不支持 empty=false", "composition")
    if spec.get("size") not in (None, "medium", "auto", "default"):
        ctx.incomplete(f"live_box 目前只消费默认 size=medium，不支持 size={spec.get('size')}", "composition")
    if spec.get("slots") is not None:
        try:
            slot_count = int(spec["slots"])
        except (TypeError, ValueError):
            slot_count = -1
        if slot_count != len(keys):
            ctx.incomplete(f"live_box.slots={spec.get('slots')} 与实际 {len(keys)} 个实时键不一致", "composition")
    if spec.get("columns") is not None or spec.get("columns_v") is not None:
        active_layout = spec.get("layout") or spec.get("variant") or "single"
        expected = _column_count(spec, ctx.orient, active_layout, 3 if active_layout == "cards" and ctx.orient == "h" else 1)
        actual = spec.get("columns_v") if ctx.orient == "v" and spec.get("columns_v") is not None else spec.get("columns")
        try:
            if int(actual) != expected:
                ctx.incomplete(f"live_box.columns={actual} 超出当前布局支持", "composition")
        except (TypeError, ValueError):
            ctx.incomplete(f"live_box.columns={actual} 不是有效列数", "composition")


_ITEM_LAYOUT_FIELDS = {
    "overall": {"canvas_width", "canvas_height", "lamp_diameter", "lamp_alignment",
                "summary_width", "summary_height", "quick_width", "quick_height",
                "quick_columns", "quick_alignment"},
    "cards": {"canvas_width", "canvas_height", "equal_width", "equal_height", "card_order",
              "icon_position", "icon_positions", "third_icon_position", "icon_subjects", "icon_size",
              "body_then_state_then_buttons", "state_empty", "state_width", "state_height",
              "button_rows", "normal_roles", "state_alignment", "button_alignment",
              "buttons_parallel_below", "source_parts"},
    "single": {"canvas_width", "canvas_height", "position", "width", "height", "full_width"},
    "connection": {"canvas_width", "canvas_height", "position", "width", "height", "full_width"},
    "maintenance_pair": {"canvas_width", "canvas_height", "frame_width", "frame_height"},
    "sync_strip": {"canvas_width", "canvas_height", "frame_width", "frame_height"},
}
_POSITIONS = {"below_step4", "below_step4_before_notice_card", "right_column_bottom", "last"}


def _validate_items_layout(spec, ctx, layout):
    raw = spec.get("items_layout")
    if raw is None:
        return
    if not isinstance(raw, dict):
        ctx.incomplete("live_box.items_layout 必须是对象", "composition")
        return
    allowed = _ITEM_LAYOUT_FIELDS.get(layout, set())
    for key, value in raw.items():
        if key in ("h", "v"):
            if not isinstance(value, dict):
                ctx.incomplete(f"live_box.items_layout.{key} 必须是对象", "composition")
                continue
            for nested in value:
                if nested not in allowed:
                    ctx.incomplete(f"live_box.items_layout.{key}.{nested} 没有实际消费端", "composition")
        elif key not in allowed:
            ctx.incomplete(f"live_box.items_layout.{key} 没有实际消费端", "composition")
    values = _items_layout(spec, ctx.orient)
    if layout in ("single", "connection") and values.get("position") not in (None, *_POSITIONS):
        ctx.incomplete(f"live_box.items_layout.position={values.get('position')} 未实现", "composition")
    if layout in ("single", "connection") and values.get("full_width") not in (None, True):
        ctx.incomplete("live_box.items_layout.full_width 当前只支持 true", "composition")


def _group_button_rows(nodes):
    rows = []
    for node in nodes:
        if node.get("type") == "linkrow":
            rows.append(list(node.get("links", [])))
            continue
        source = "\n".join(node.get("src", []))
        labels = re.findall(r"[［【]([^］】]+)[］】]", source)
        if labels:
            rows.append(labels)
    return rows


def _button_split_index(body):
    return next((i for i, node in enumerate(body)
                 if node.get("type") in ("linkrow", "buttons") or
                 node.get("text", "").startswith(("［", "【"))), len(body))


def _card_layout_values(layout, groups, ctx):
    names = [head.get("name", "") for head, _ in groups]
    requested_order = layout.get("card_order")
    if requested_order is not None and requested_order != names:
        ctx.incomplete("live_box.items_layout.card_order 与定稿卡名原顺序不一致；为保 G1 保留定稿顺序", "composition")
    for key in ("equal_width", "equal_height"):
        value = layout.get(key)
        if value not in (None, True):
            ctx.incomplete(f"live_box.items_layout.{key}={value} 当前卡网格只支持等尺寸", "composition")
    for key in ("body_then_state_then_buttons", "state_empty", "buttons_parallel_below"):
        value = layout.get(key)
        if value not in (None, True):
            ctx.incomplete(f"live_box.items_layout.{key}={value} 当前卡结构只支持原文→空框→按钮行", "composition")
    for key in ("state_alignment", "button_alignment"):
        value = layout.get(key)
        if value not in (None, "bottom"):
            ctx.incomplete(f"live_box.items_layout.{key}={value} 当前卡结构只支持底部对齐", "composition")
    subjects = layout.get("icon_subjects")
    if subjects is not None and (not isinstance(subjects, list) or len(subjects) != len(groups)
                                 or not all(isinstance(subject, str) and subject for subject in subjects)):
        ctx.incomplete("live_box.items_layout.icon_subjects 必须逐卡给出非空说明并与卡数一致", "composition")
    rows = layout.get("button_rows")
    if rows is not None and (not isinstance(rows, list) or len(rows) != len(groups)):
        ctx.incomplete("live_box.items_layout.button_rows 须按定稿卡顺序逐卡给出", "composition")
    elif isinstance(rows, list):
        for index, ((_, body), expected) in enumerate(zip(groups, rows)):
            actual = _group_button_rows(body[_button_split_index(body):])
            if not isinstance(expected, list):
                ctx.incomplete(f"live_box.items_layout.button_rows 第 {index + 1} 项必须是标签数组", "composition")
                continue
            expected_rows = expected if expected and isinstance(expected[0], list) else [expected]
            if actual != expected_rows:
                ctx.incomplete(f"live_box.items_layout.button_rows 第 {index + 1} 卡与定稿按钮分组不一致", "composition")
    normal_roles = layout.get("normal_roles")
    if normal_roles is not None and (not isinstance(normal_roles, dict) or
                                     any(role not in ("primary", "secondary", "danger") for role in normal_roles.values())):
        ctx.incomplete("live_box.items_layout.normal_roles 只支持 primary/secondary/danger", "composition")
    if isinstance(normal_roles, dict):
        labels = {label for _, body in groups for row in _group_button_rows(body[_button_split_index(body):]) for label in row}
        unexpected = set(normal_roles) - labels
        if unexpected:
            ctx.incomplete(f"live_box.items_layout.normal_roles 找不到这些定稿按钮：{'、'.join(sorted(unexpected))}", "composition")


def _sync_strip(nodes, ctx, key):
    """The finalized name and schedule share a row beside one small blank."""
    index = next((i for i, node in enumerate(nodes)
                  if (node.get("type") == "card" and node.get("name") == "现在") or
                  (node.get("type") == "now" and node.get("label") == "现在")), None)
    if index is None:
        ctx.warn("sync_strip 未分到定稿的“现在”名称与同步说明，未补造标签")
        return render_nodes(nodes, ctx) + _slot(ctx, key, "sync", "c-slot-live-sync-frame")
    node = nodes[index]
    name = node.get("name", node.get("label", ""))
    schedule = node.get("text", "　".join(node.get("slots", [])))
    if node.get("type") == "now" and node.get("links"):
        schedule += "　" + "　".join(f'〔{text}〕' for text in node["links"])
    label = (f'<div class="c-slot-live-sync-labels">'
             f'<span class="c-slot-live-sync-name tb">{ctx.inline(name)}</span>'
             f'<span class="c-slot-live-sync-schedule tb">{ctx.inline(schedule)}</span></div>')
    return (render_nodes(nodes[:index], ctx)
            + f'<div class="c-slot-live-syncbar card">{label}'
            + _slot(ctx, key, "sync", "c-slot-live-sync-frame") + '</div>'
            + render_nodes(nodes[index + 1:], ctx))


def _groups(nodes):
    """Keep node order, assigning each named group its adjacent body."""
    before, groups, after = [], [], []
    for node in nodes:
        if node.get("type") in ("group", "card"):
            groups.append([node, []])
        elif groups and node.get("type") == "para" and (
                node.get("text", "").startswith("这里只显示") or
                node.get("text", "").startswith("绿：")):
            after.append(node)
        elif after:
            after.append(node)
        elif groups:
            groups[-1][1].append(node)
        else:
            before.append(node)
    return before, groups, after


def _local_icon_url(ctx, item, asset_root, index):
    """Resolve one explicit local path using the engine's existing asset convention."""
    if not isinstance(item, str):
        ctx.incomplete(f"live_box icons 第 {index + 1} 项必须是本地文件路径或空值", "asset")
        return None
    item = item.strip().replace("\\", "/")
    # A Windows drive or proto: is a path; URLs and UNC shares are not local assets.
    if item.startswith("//") or (re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", item)
                                 and not item.startswith("proto:")
                                 and not re.match(r"^[a-zA-Z]:/", item)):
        ctx.incomplete(f"live_box icons 第 {index + 1} 项不是本地素材路径：{item}", "asset")
        return None
    try:
        if hasattr(ctx, "resolve"):
            path = Path(ctx.resolve(item)).resolve()
        elif item.startswith("proto:"):
            name = item[6:] + ("" if item.endswith(".png") else ".png")
            path = (Path(__file__).resolve().parents[2] / "assets" / name).resolve()
        else:
            path = (asset_root / Path(item)).resolve()
        if not path.is_file():
            raise OSError("文件不存在或不是文件")
        with path.open("rb") as source:
            if not source.read(1):
                raise OSError("文件为空")
        url = ctx.asset_url(str(path))
        address = urlsplit(url)
        if address.scheme != "file" or address.netloc:
            raise ValueError("素材地址不是本地 file 地址")
        return url
    except (OSError, ValueError, TypeError) as error:
        ctx.incomplete(f"live_box icons 第 {index + 1} 个本地文件不可用：{item}（{error}）", "asset")
        return None


def _icon_urls(ctx, spec, screen_id, count):
    setting = spec.get("icons")
    if setting == "none" or setting is False:
        return [None] * count
    enabled = setting == "auto" or isinstance(setting, list) or (
        setting is None and screen_id in {"computer-access-01", "cockpit-07"})
    if not enabled:
        return [None] * count
    # The shared asset-map substitutes leaves for unresolved semantics. Keep the page-manifest
    # source slots here; the orientation-specific spec still decides which card positions show them.
    if screen_id in {"computer-access-01", "cockpit-07"}:
        page_name = {"computer-access-01": "computer-access", "cockpit-07": "cockpit"}[screen_id]
        asset_root = Path(ASSET_ROOT)
        manifest_path = asset_root / str(page_name) / "manifest.jsonl"
        source_icons = {}
        source_by_name = {}
        if manifest_path.is_file():
            for line in manifest_path.read_text(encoding="utf-8").splitlines():
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if row.get("screen_id") != screen_id or row.get("role") != "icon":
                    continue
                asset_name = str(row.get("asset", "")).replace("\\", "/")
                raw_ordinal = row.get("slot_ordinal")
                if raw_ordinal is None:
                    match = re.search(r"-icon-(\d+)\.png$", asset_name, re.IGNORECASE)
                    if not match:
                        continue
                    raw_ordinal = match.group(1)
                try:
                    number = float(raw_ordinal)
                except (TypeError, ValueError):
                    continue
                if not number.is_integer() or number < 1:
                    continue
                ordinal = int(number)
                path = (asset_root / Path(asset_name)).resolve()
                if asset_root.resolve() not in path.parents or not path.is_file():
                    continue
                url = ctx.asset_url(str(path))
                source_icons[ordinal] = url
                source_by_name[path.name] = url
        result = [source_icons.get(index + 1) for index in range(count)]
        if isinstance(setting, list):
            for index, item in enumerate(setting[:count]):
                if item is None or item == "" or isinstance(item, str) and not item.strip():
                    continue
                name = item.strip().replace("\\", "/") if isinstance(item, str) else None
                # Only a bare filename uses legacy manifest-name selection. An explicit path
                # with the same basename must be resolved as that exact file, including failure.
                if name in source_by_name:
                    result[index] = source_by_name[name]
                else:
                    result[index] = _local_icon_url(ctx, item, asset_root, index)
        missing = sum(url is None for url in result)
        if missing:
            ctx.incomplete(f"live_box.cards 的 source manifest 或显式本地路径缺 {missing} 个 icon 槽位，未使用共享装饰兜底", "asset")
        return result
    slots = getattr(ctx, "slots", lambda role="icon": [])("icon") or []
    by_name = {}
    ordered = []
    for ordinal, url in slots:
        name = Path(unquote(urlsplit(url).path)).name if url else None
        if name:
            by_name[name] = url
        ordered.append(url)
    if isinstance(setting, list):
        selected = [by_name.get(Path(str(item).replace("\\", "/")).name) for item in setting]
        for index, url in enumerate(selected):
            if url is None:
                ctx.incomplete(f"live_box icons 第 {index + 1} 个文件不在本屏 icon manifest 槽位中", "asset")
    else:
        selected = ordered
    out = list(selected[:count])
    while len(out) < count:
        out.append(None)
    missing = sum(url is None for url in out)
    if missing:
        ctx.incomplete(f"live_box.cards 缺 {missing} 个受管 icon 槽位，未补画图标", "asset")
    return out


def _card_icon_position(spec, screen_id, orient, layout, index, icon_url):
    defaults = {
        "computer-access-01": {"h": "left_inside", "v": "left_inside"},
        "cockpit-07": {"h": "top_inside", "v": "left_inside"},
    }
    fallback = defaults.get(screen_id, {}).get(orient, "left_inside" if orient == "v" else "top_inside")
    positions = layout.get("icon_positions")
    position = (positions[index] if isinstance(positions, list) and index < len(positions)
                else layout.get("icon_position") or spec.get("icon_position") or spec.get("illustration"))
    third_position = layout.get("third_icon_position", spec.get("third_icon_position"))
    if index == 2 and third_position:
        position = third_position
    if position in (None, "", "auto"):
        position = fallback
    if position == "none_for_first_two":
        position = "none" if index < 2 else fallback
    if position not in {"left_inside", "top_inside", "right_inside", "none"}:
        position = fallback
    return position if icon_url else "none"


def _cards(nodes, ctx, keys, security, spec, screen_id):
    before, groups, after = _groups(nodes)
    result = [render_nodes(before, ctx)]
    parts = ["personal-data", "unrestricted", "windows"]
    count = len(groups) if groups else len(keys)
    if security and not groups:
        count = 3
    icons = _icon_urls(ctx, spec, screen_id, count)
    layout = _items_layout(spec, ctx.orient)
    part_starts = _card_part_starts(groups, layout, ctx)
    _card_layout_values(layout, groups, ctx)
    if not layout.get("icon_position") and spec.get("illustration") in {"left_inside", "top_inside", "right_inside", "none"}:
        layout["icon_position"] = spec["illustration"]
    columns = _column_count(spec, ctx.orient, "cards", 3 if ctx.orient == "h" else 1)
    root_style = _inline_style({"--slot-live-card-columns": str(columns)})
    result.append(f'<div class="c-slot-live-cards" style="{root_style}">')
    icon_size = _css_size(layout.get("icon_size"), "64px" if ctx.orient == "v" else "72px", ctx, "width", layout)
    state_width = _css_size(layout.get("state_width"), "90%", ctx, "width", layout)
    state_height = _css_size(layout.get("state_height"), "84px" if ctx.orient == "h" else "2lh", ctx, "height", layout)
    for index in range(count):
        key = keys[0] if security else keys[min(index, len(keys) - 1)]
        part = parts[index] if index < len(parts) else str(index)
        icon_url = icons[index] if index < len(icons) else None
        icon_position = _card_icon_position(spec, screen_id, ctx.orient, layout, index, icon_url)
        icon_subjects = layout.get("icon_subjects", [])
        icon_subject = icon_subjects[index] if isinstance(icon_subjects, list) and index < len(icon_subjects) else None
        card_style = _inline_style({"--slot-live-icon-size": icon_size,
                                    "--slot-live-state-width": state_width,
                                    "--slot-live-state-height": state_height})
        subject_attr = f' data-icon-subject="{escape(icon_subject, quote=True)}"' if icon_subject else ""
        part_attributes = ""
        if index in part_starts:
            part_name, before = part_starts[index]
            part_attributes = f' data-source-part="{escape(part_name, quote=True)}"'
            if before:
                part_attributes += ' data-page-break-before="true"'
        result.append(f'<div class="c-slot-live-card card" data-icon-position="{icon_position}"{subject_attr} style="{card_style}"{part_attributes}>')
        if groups:
            head, body = groups[index]
            icon = (f'<img class="c-slot-live-icon deco" aria-hidden="true" alt="" '
                    f'data-icon-slot="{index + 1}" src="{escape(icon_url, quote=True)}">') if icon_url and icon_position != "none" else ""
            name = f'<div class="c-slot-live-name tb">{ctx.inline(head.get("name", ""))}</div>'
            # State belongs between the explanatory copy and the action row.
            split = _button_split_index(body)
            copy = render_nodes(body[:split], ctx)
            position_class = "c-slot-live-card-content--left" if icon_position in ("left_inside", "right_inside") else "c-slot-live-card-content--top"
            if icon_position == "right_inside":
                result.append(f'<div class="c-slot-live-card-content {position_class}" data-icon-side="right">{name}{icon}<div class="c-slot-live-copy">{copy}</div></div>')
            else:
                result.append(f'<div class="c-slot-live-card-content {position_class}">{icon}{name}<div class="c-slot-live-copy">{copy}</div></div>')
            state_alignment = layout.get("state_alignment", "bottom")
            state_extra = f' data-state-alignment="{escape(str(state_alignment), quote=True)}"'
            result.append(_slot(ctx, key, part, "c-slot-live-state", state_extra))
            if body[split:]:
                role_map = layout.get("normal_roles", {})
                states = {label: {"role": role, "state": "normal"}
                          for label, role in role_map.items()} if isinstance(role_map, dict) else {}
                child_spec = {"states": states} if states else {}
                buttons = ctx.render({"type": "button_variants", "spec": child_spec, "nodes": body[split:]})
                parallel = layout.get("buttons_parallel_below", True)
                alignment = layout.get("button_alignment", "bottom")
                result.append(f'<div class="c-slot-live-card-actions" data-parallel="{str(parallel).lower()}" data-button-alignment="{escape(str(alignment), quote=True)}">{buttons}</div>')
        else:
            result.append(_slot(ctx, key, part, "c-slot-live-state"))
        result.append('</div>')
    result.extend(['</div>', render_nodes(after, ctx)])
    return "".join(result)


def render_live_box(block, ctx):
    spec = spec_of(block)
    nodes = block.get("nodes", [])
    screen_id = screen_value(ctx, "id", "")
    keys = _keys(ctx, spec)
    layout = spec.get("layout") or spec.get("variant")
    if not layout:
        layout = {"personal-materials-01": "sync_strip",
                  "cockpit-01": "overall", "cockpit-07": "cards",
                  "computer-access-01": "cards"}.get(screen_id, "single")
    explicit_key = spec.get("key", spec.get("live_key"))
    if explicit_key:
        keys = [explicit_key]
        if "layout" not in spec and "variant" not in spec:
            layout = ("sync_strip" if screen_id == "personal-materials-01"
                      else "connection" if explicit_key == "ca-connection" else "single")
    now_node = next((node for node in nodes if node.get("type") == "now" and node.get("slots")), None)
    live_keys = list(screen_value(ctx, "live", []) or [])
    if screen_id == "personal-media-01" and now_node and len(now_node.get("slots", [])) == 2:
        if layout == "maintenance_pair" and keys == live_keys:
            pass
        else:
            ctx.incomplete("媒体首屏双维护标签需同一 maintenance_pair 块持有原 now 节点及 run/cloud；当前单块不吞另一块或改写显式 key，请页代理合块", "composition")
    _validate_live_spec(spec, ctx, keys)
    _validate_items_layout(spec, ctx, layout)
    if not keys:
        ctx.warn("live_box 缺少定稿 live 键；未生成实时热区")
        return f'<div class="c-slot-live" data-orient="{escape(ctx.orient, quote=True)}" data-comp="live_box">{render_nodes(nodes, ctx)}</div>'
    if layout == "overall":
        html = render_nodes(nodes, ctx) + _overall(block, ctx, keys[0])
    elif layout == "sync_strip":
        html = _sync_strip(nodes, ctx, keys[0])
    elif layout == "cards":
        security = screen_id == "cockpit-07" or spec.get("shared_key", False)
        card_keys = [key for key in keys if key != "ca-connection"]
        html = _cards(nodes, ctx, card_keys or keys, security, spec, screen_id)
    elif layout == "maintenance_pair":
        html = _maintenance_pair(nodes, ctx, keys, spec)
    else:
        slot_style = _single_slot_style(spec, ctx)
        extra = f'style="{slot_style}"' if slot_style else ""
        position = _single_position_attr(spec, ctx)
        html = render_nodes(nodes, ctx) + _slot(ctx, keys[0], spec.get("part", layout),
                                               "c-slot-live-connection" if layout == "connection" else "",
                                               extra)
        root_position = position
    if layout != "single" and layout != "connection":
        root_position = ""
    return f'<div class="c-slot-live c-slot-live--{escape(str(layout), quote=True)}" data-orient="{escape(ctx.orient, quote=True)}" data-comp="live_box"{root_position}>{html}</div>'


def _leaf_style(ctx, spec):
    path = spec.get("leaf_asset")
    if path is None:
        path = str(Path(__file__).resolve().parents[2] / "assets" / "leaf-r.png")
    url = ctx.asset_url(path)
    return escape('--slot-leaf:url(' + json.dumps(str(url)) + ')', quote=True)


def render_live_embed(block, ctx):
    spec = spec_of(block)
    keys = _keys(ctx, spec)
    key = spec.get("key", spec.get("live_key", keys[0] if keys else None))
    copy = render_nodes(block.get("nodes", []), ctx)
    if key is None:
        ctx.warn("live_embed 缺少定稿 live 键；未生成实时热区")
        return f'<div class="c-slot-embed" data-comp="live_embed">{copy}</div>'
    vertical = ctx.orient == "v"
    frames = []
    for part in (["cpu-gpu", "memory-network"] if vertical else ["all"]):
        leaves = "" if spec.get("leaves", True) is False else "".join(
            f'<span class="c-slot-embed-corner c-slot-embed-corner-{i}" aria-hidden="true" style="{_leaf_style(ctx, spec)}"></span>'
            for i in range(4))
        frames.append(f'<div class="c-slot-embed-frame card" data-live-part="{part}" '
                      f'{ctx.hot("live", key)}>{leaves}</div>')
    orient = "v" if vertical else "h"
    return (f'<div class="c-slot-embed c-slot-embed-{orient}" data-comp="live_embed">'
            f'{copy}<div class="c-slot-embed-frames">{"".join(frames)}</div></div>')

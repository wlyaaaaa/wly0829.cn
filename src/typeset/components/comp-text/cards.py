"""Text cards; nodes v2 are rendered in source order without external helpers."""

from html import escape
from pathlib import Path
import re
from engine.parse import MD_LINK_RE
from math import lcm
from urllib.parse import unquote, urlsplit


def _text(ctx, value):
    return ctx.inline("" if value is None else str(value))


def _lead(ctx, value):
    return f'<strong class="ct-lead">{_text(ctx, value)}</strong>' if value else ""


def _unfinished(ctx, message, kind="composition"):
    ctx.warn(message)
    incomplete = getattr(ctx, "incomplete", None)
    if callable(incomplete):
        incomplete(message, kind)


def _step_ports_ready(spec, ctx):
    screen = getattr(ctx, "screen", {})
    return (isinstance(screen, dict) and screen.get("id") == "rule-engineering-delivery-10"
            and spec.get("connect_to") == "steps"
            and spec.get("_points_exception_targets") == [1, 2, 3, 3, 5])


def _attach_step_ports(rendered, spec, ctx):
    if not _step_ports_ready(spec, ctx):
        return rendered
    path = Path(__file__).resolve().parents[1] / "comp-diagram" / "step-ports.js"
    if not path.is_file():
        _unfinished(ctx, "comp-text 工程10：已校验五原例外但专用step-ports.js尚不可用，原文保留。")
        return rendered
    return rendered + '<script data-echo src="' + escape(ctx.asset_url(str(path)), quote=True) + '"></script>'


def _motion_icon_picture(picture, header=False, arrow=True, extra=""):
    """在现有图槽补网站可量的空箭头；原图仍在，不把整图标作箭头。"""
    kind = "ct-motion-header-icon" if header else "ct-motion-item-icon"
    shape = '<span class="ct-motion-icon-arrow" data-comp="arrow" data-motion-icon-arrow="true" aria-hidden="true"></span>' if arrow else ""
    return f'<span class="ct-motion-icon-wrap {kind} deco" aria-hidden="true">{picture}{shape}{extra}</span>'


def _motion_dots_requested(spec):
    value = spec.get("header_icon_motion_dots")
    return value is not None and value is not False and value != "none"


def _prefix_text(value):
    """Compare a supplied source prefix without changing the rendered source."""
    return re.sub(r"\s+", "", str(value or "").replace("**", "").replace("`", ""))


def _starts_with(value, prefix):
    target = _prefix_text(prefix)
    return bool(target) and _prefix_text(value).startswith(target)


def _node(node, ctx, glossary=False):
    """Render every documented v2 node, preserving its text exactly once."""
    kind = node.get("type", "")
    if kind in ("h1", "h2", "h3", "group"):
        value = node.get("name") if kind == "group" else node.get("text")
        return f'<div class="ct-heading tb">{_text(ctx, value)}</div>'
    if kind == "card":
        return f'<p class="ct-paragraph tb">{_lead(ctx, node.get("name"))} {_text(ctx, node.get("text"))}</p>'
    if kind == "para":
        return f'<p class="ct-paragraph tb">{_text(ctx, node.get("text"))}</p>'
    if kind in ("bullets", "stats", "steps"):
        if glossary and kind != "steps":
            terms = []
            for item in node.get("items", []):
                lead = item.get("num") if kind == "stats" else item.get("lead")
                description, separator = item.get("text"), ""
                match = re.match(r'^(\s*[:：]\s*)(.*)$', description or "", re.S) if lead else None
                if match:
                    separator, description = match.groups()
                punctuation = f'<span class="ct-term-punctuation">{_text(ctx, separator)}</span>' if separator else ""
                name = f'<dt class="tb">{_text(ctx, lead)}{punctuation}</dt>' if lead else ""
                terms.append(f'<div class="ct-term">{name}<dd class="tb">{_text(ctx, description)}</dd></div>')
            return '<dl class="ct-terms">' + "".join(terms) + "</dl>"
        rows = []
        for item in node.get("items", []):
            lead = item.get("num") if kind == "stats" else item.get("lead")
            if kind == "steps":
                # cols contains the whole step payload, including lead; do not repeat lead.
                cols = item.get("cols")
                if cols:
                    body = " ".join(_text(ctx, cell) for cell in cols)
                else:
                    gap = item.get("lead_gap", " " if lead else "")
                    body = f'{_lead(ctx, lead)}{_text(ctx, gap)}{_text(ctx, item.get("text"))}'
                rows.append(f'<li class="ct-step"><span class="ct-step-number tb">{_text(ctx, item.get("n"))}</span><div class="tb">{body}</div></li>')
            else:
                gap = item.get("lead_gap", " " if lead else "")
                rows.append(f'<li class="tb">{_lead(ctx, lead)}{_text(ctx, gap)}{_text(ctx, item.get("text"))}</li>')
        cls = "ct-steps" if kind == "steps" else "ct-list"
        return f'<ul class="{cls}">' + "".join(rows) + "</ul>"
    if kind == "table":
        if ctx.orient == "v":
            # The table family owns mobile row cards and marks repeated labels data-echo.
            return ctx.render({"type": "table", "spec": {}, "nodes": [node]})
        def row(cells, header=False):
            tag = "th" if header else "td"
            return "<tr>" + "".join(f'<{tag} class="tb">{_text(ctx, cell)}</{tag}>' for cell in cells) + "</tr>"
        header = node.get("header")
        head = "<thead>" + row(header, True) + "</thead>" if header is not None else ""
        return '<table class="ct-table">' + head + "<tbody>" + "".join(row(cells) for cells in node.get("rows", [])) + "</tbody></table>"
    if kind == "code":
        if not getattr(ctx, "original_source", False):
            return '<pre class="ct-code tb">' + _text(ctx, "\n".join(node.get("lines", []))) + "</pre>"
        # 围栏里的内容是字面命令，不能再把反引号、粗体或链接当行内标记。
        literal = "\n".join(node.get("lines", []))
        if node.get("lines"):
            literal += "\n"
        return '<pre class="ct-code tb">' + escape(literal, quote=False) + "</pre>"
    if kind == "legend":
        return '<div class="ct-legend">' + "".join(f'<span class="tb">{_text(ctx, item.get("dot"))} {_text(ctx, item.get("text"))}</span>' for item in node.get("items", [])) + "</div>"
    if kind in ("linkrow", "now"):
        # src retains the original distinction between 〔link〕 and 【button】.
        if node.get("src"):
            content = _text(ctx, "\n".join(node["src"]))
        else:
            content = _text(ctx, node.get("label", "")) + " ".join(_text(ctx, "〔" + str(link) + "〕") for link in node.get("links", []))
        return f'<div class="ct-links tb">{content}</div>'
    if node.get("src"):
        ctx.warn(f"comp-text 卡片：未识别节点 {kind!r}，保留 src 原文。")
        return '<div class="ct-paragraph tb">' + _text(ctx, "\n".join(node["src"])) + "</div>"
    # An extension without src must be delegated so its content is not silently lost.
    ctx.warn(f"comp-text 卡片：扩展节点 {kind!r} 没有 src，交给 ctx.render 处理。")
    return ctx.render({"type": kind, "spec": {}, "nodes": [node]})


def _groups(nodes, split_cards=True):
    groups, current = [], []
    for node in nodes:
        if current and node.get("type") in (("card", "group", "h1", "h2", "h3") if split_cards else ("group", "h1", "h2", "h3")):
            groups.append(current)
            current = []
        current.append(node)
    if current:
        groups.append(current)
    return groups


def _shell(component, block, ctx, render_group, groups=None):
    spec = block.get("spec") or {}
    column_key = "columns_v" if ctx.orient == "v" and "columns_v" in spec else "columns"
    try:
        value = spec.get(column_key, 1)
        columns = int(value)
        if isinstance(value, bool) or str(columns) != str(value) or not 1 <= columns <= 6:
            raise ValueError
    except (TypeError, ValueError):
        _unfinished(ctx, f"comp-text {component}：{column_key}须为1至6的整数，保留完整原文和单列。")
        columns = 1
    if ctx.orient == "v" and "columns_v" not in spec:
        columns = 1
    orientation = "v" if ctx.orient == "v" else "h"
    align = "center" if spec.get("align") == "center" else "left"
    classes = f"c-text ct-{component} ct-{orientation} ct-cols-{columns} ct-align-{align}"
    if ctx.orient == "v" and "columns_v" in spec:
        classes += " ct-explicit-v-cols"
    size = spec.get("card_title_size", spec.get("size"))
    if size in ("small", "medium", "large"):
        classes += " ct-size-" + size
    elif size not in (None, "", "default"):
        _unfinished(ctx, f"comp-text {component}：size须为small/medium/large，保留共享默认标题档位。")
    if spec.get('last_full_width'):
        classes += ' ct-last-wide'
    inner = spec.get('last_inner_columns')
    style = ""
    if inner is not None:
        if isinstance(inner, int) and not isinstance(inner, bool) and 1 <= inner <= 6:
            classes += ' ct-last-inner-cols'
            style = f' style="--ct-last-inner-columns:{inner}"'
        else:
            _unfinished(ctx, "comp-text：last_inner_columns须为1至6整数，保留原清单。")
    nodes = block.get("nodes") or []
    if spec.get("item_pages"):
        _unfinished(ctx, "comp-text：此卡片入口未消费 item_pages，保留完整原字；请在 source_text_card 或 points_card 使用条目续卡接口。")
    if groups is None:
        groups = [nodes] if spec.get("whole_block") and nodes else _groups(nodes, spec.get("split_cards", True))
    content = "".join(render_group(group, index) for index, group in enumerate(groups))
    if size in ("small", "large"):
        content = content.replace('data-role="name"', f'data-role="card_title_{size}"')
    page_break = ' data-page-break-after="true"' if spec.get("page_break_after") else ""
    return f'<div class="{classes}" data-comp="{escape(component, quote=True)}"{' data-flow="independent_columns"' if component == 'source_text_card' else ''}{style}{page_break}>{content}</div>'


def _headed(group, ctx, component, glossary=False):
    first, remaining = group[0], group[1:]
    kind = first.get("type")
    if kind in ("card", "group", "h1", "h2", "h3"):
        name = first.get("name") if kind in ("card", "group") else first.get("text")
        head = f'<div class="ct-card-head tb">{_text(ctx, name)}</div>'
        body = _node({"type": "para", "text": first.get("text")}, ctx) if kind == "card" and first.get("text") else ""
    else:
        head = ""
        body = _node(first, ctx, glossary)
    body += "".join(_node(node, ctx, glossary) for node in remaining)
    return f'<section class="ct-card card ct-{component}-card">{head}<div class="ct-card-body">{body}</div></section>'


def render_quote(block, ctx):
    spec = block.get("spec") or {}
    variant = spec.get("variant")
    if variant not in (None, "", "default", "left_line"):
        _unfinished(ctx, f"comp-text 引用：不支持variant={variant}，保留原字和默认引用框。")
    style = " ct-quote-left-line" if variant == "left_line" else ""
    return _shell("quote", block, ctx, lambda group, _: f'<blockquote class="ct-card card ct-quote-card{style}">' + "".join(_node(node, ctx) for node in group) + "</blockquote>")


def render_source_text_card(block, ctx):
    # Explicit source boundaries outrank ordinary heading grouping.
    spec = block.get("spec") or {}
    nodes = block.get("nodes") or []
    if spec.get("font_role") not in (None, "", "default", "monospace"):
        _unfinished(ctx, f"comp-text 原文卡：不支持 font_role={spec.get('font_role')!r}，保留默认原文字体，指定字体角色未执行。")
    if spec.get("layout") == "ledger":
        ledger_nodes = _ledger_nodes(nodes, ctx)
        if any(node.get("type") == "table" for node in ledger_nodes):
            def ledger(group, _):
                parts = []
                for node in group:
                    if node.get("type") != "table":
                        parts.append(_node(node, ctx))
                    elif ctx.orient == "h" and len(node.get("rows") or []) > 1:
                        cut = (len(node["rows"]) + 1) // 2
                        left = dict(node, rows=node["rows"][:cut])
                        right = dict(node, header=None, rows=node["rows"][cut:])
                        pages = ''.join('<div class="ct-ledger-page">' + ctx.render({"type": "table", "spec": {}, "nodes": [part]}) + '</div>' for part in (left, right))
                        parts.append('<div class="ct-ledger-pages">' + pages + '</div>')
                    else:
                        parts.append(ctx.render({"type": "table", "spec": {}, "nodes": [node]}))
                content = ''.join(parts)
                return '<section class="ct-card card ct-source-card ct-source-ledger">' + content + '</section>'
            ctx.warn("comp-text 原文卡：账本双页文字层为新构图，待本人看样张；不代表水彩账本底图已核验。")
            return _shell("source_text_card", dict(block, nodes=ledger_nodes), ctx, ledger)
        _unfinished(ctx, "comp-text 原文卡：layout=ledger需要原四列表头及完整原记录，保留完整原文。")
    elif spec.get("layout") not in (None, "", "default"):
        _unfinished(ctx, "comp-text 原文卡：layout只支持ledger，保留原字。")
    if spec.get("inner_columns") not in (None, 1, 2):
        _unfinished(ctx, "comp-text 原文卡：inner_columns 只支持1或2，指定内栏数未执行。")
    if spec.get("icon_position") not in (None, "none", "header_left", "header_top"):
        _unfinished(ctx, "comp-text 原文卡：icon_position 只支持 header_left/header_top，指定图标位置未执行。")
    shell_spec = dict(spec)
    shell_spec.pop("item_pages", None)
    paginated = False
    groups = None
    if spec.get("item_pages") and ctx.orient == "v":
        groups = _source_pages(nodes, spec["item_pages"], ctx)
        paginated = groups is not None
    if groups is None and ctx.orient == "h" and spec.get("body_columns") == 2:
        groups = _source_split(nodes, spec.get("column_split_after_item"), ctx,
                               "column_split_after_item")
        if groups is not None:
            shell_spec["columns"] = 2
        elif spec.get("column_split_after_item") is None:
            _unfinished(ctx, "comp-text 原文卡：body_columns:2 缺明确原清单切口，两外卡未执行。")
    if groups is None:
        groups = _source_split(nodes, spec.get("split_after"), ctx)
    if groups is None and ctx.orient == "v" and spec.get("body_columns") == 1 and nodes:
        groups = [nodes]
    if spec.get("body_columns") not in (None, 1, 2):
        _unfinished(ctx, "comp-text 原文卡：body_columns 只支持1或2，保留原文，指定外卡列数未执行。")
    shell = dict(block, spec=shell_spec)
    emphasis_ref = _source_emphasis(nodes, spec, ctx)
    return _shell("source_text_card", shell, ctx,
                  lambda group, index: _source_card(group, index, spec, ctx, paginated, emphasis_ref), groups)


def _ledger_nodes(nodes, ctx):
    """原四格表头及带粗体名字的竖线清单转真实表格，不改原字或原序。"""
    output, index = [], 0
    while index < len(nodes):
        first = nodes[index]
        if (first.get("type") != "para" or len(str(first.get("text") or "").split("｜")) != 4 or
                index + 1 >= len(nodes) or nodes[index + 1].get("type") != "bullets"):
            output.append(first)
            index += 1
            continue
        listing, rows = nodes[index + 1], []
        for item in listing.get("items") or []:
            cells = str(item.get("text") or "").split("｜")
            if item.get("lead") and len(cells) == 3:
                prefix = re.match(r'^([（(][^）)]*[）)]\s*)', cells[0])
                suffix = prefix.group(1) if prefix else ""
                if suffix:
                    cells[0] = cells[0][len(suffix):]
                cells.insert(0, "**" + item["lead"] + "**" + suffix)
            if len(cells) != 4:
                break
            rows.append(cells)
        if len(rows) != len(listing.get("items") or []) or not rows:
            _unfinished(ctx, "comp-text 原文卡：账本原记录未形成完整四格，保留原清单。")
            output.extend((first, listing))
        else:
            output.append({"type": "table", "header": first["text"].split("｜"), "rows": rows,
                           "align": None, "src": list(first.get("src") or []) + list(listing.get("src") or [])})
        index += 2
    return output


def _source_pages(nodes, counts, ctx):
    """Each count consumes original bullets; continuing outer cards carry the cut."""
    total = sum(len(node.get("items") or []) for node in nodes if node.get("type") == "bullets")
    if (not isinstance(counts, list) or not counts or
            any(not isinstance(n, int) or isinstance(n, bool) or n < 1 for n in counts) or
            sum(counts) != total):
        _unfinished(ctx, "comp-text 原文卡：item_pages 必须是覆盖本块全部原 bullet 的正整数条数，保留原文，续卡未执行。")
        return None
    groups, remaining = [], list(nodes)
    for count in counts[:-1]:
        parts = _source_split(remaining, count, ctx, "item_pages")
        if parts is None:
            return None
        groups.append(parts[0])
        remaining = parts[1]
    return groups + [remaining]


def _source_head(group, index, spec, ctx, paginated):
    remaining = list(group)
    head = ""
    band = spec.get("card_header") == "pale_green_band"
    navigation = spec.get("header_navigation") == "inline_right"
    icon_position = spec.get("icon_position")
    wants_head = band or navigation or icon_position in ("header_left", "header_top")
    if spec.get("card_header") not in (None, "none", "pale_green_band"):
        _unfinished(ctx, "comp-text 原文卡：card_header 只支持 pale_green_band，指定卡头未执行。")
    if spec.get("header_navigation") not in (None, "none", "inline_right"):
        _unfinished(ctx, "comp-text 原文卡：header_navigation 只支持 inline_right，指定导航位置未执行。")
    if not remaining or not wants_head or paginated and index:
        return head, remaining
    first = remaining[0]
    kind = first.get("type")
    if kind in ("group", "h1", "h2", "h3", "card"):
        value = first.get("name") if kind in ("group", "card") else first.get("text")
        title = _text(ctx, value)
        remaining.pop(0)
        if kind == "card" and first.get("text"):
            remaining.insert(0, {"type": "para", "text": first["text"]})
    elif kind == "steps" and len(first.get("items") or []) == 1:
        item = first["items"][0]
        payload = (" ".join(_text(ctx, col) for col in item["cols"]) if item.get("cols")
                   else _lead(ctx, item.get("lead")) + " " + _text(ctx, item.get("text")))
        title = _text(ctx, item.get("n")) + " " + payload
        remaining.pop(0)
    elif kind == "para" and icon_position in ("header_left", "header_top"):
        title = _text(ctx, first.get("text"))
        remaining.pop(0)
    else:
        _unfinished(ctx, "comp-text 原文卡：指定卡头缺完整首标题，保留首节点原文，卡头未执行。")
        return head, remaining
    nav = ""
    if navigation and remaining:
        first_body = remaining[0]
        if first_body.get("type") == "linkrow" or (first_body.get("type") == "para" and
                (re.search(r"[〔【［]", first_body.get("text") or "") or MD_LINK_RE.search(first_body.get("text") or ""))):
            nav = '<div class="ct-source-navigation">' + _node(remaining.pop(0), ctx) + '</div>'
    picture = ""
    if icon_position in ("header_left", "header_top"):
        mapping = spec.get("header_icon", spec.get("icons"))
        url = _source_asset(mapping, index, list(ctx.icons()), ctx, "卡头图标")
        if url:
            picture = f'<img class="ct-source-header-icon deco" aria-hidden="true" alt="" src="{escape(url, quote=True)}">'
    cls = "ct-card-head ct-source-head" + (" ct-source-band" if band else "")
    if picture:
        cls += " ct-source-head-top" if icon_position == "header_top" else " ct-source-head-left"
    head = f'<div class="{cls}">{picture}<div class="ct-source-title tb" data-role="name">{title}</div>{nav}</div>'
    return head, remaining


def _source_asset(mapping, index, available, ctx, role):
    if mapping is None:
        _unfinished(ctx, f"comp-text 原文卡：{role} 缺显式素材映射，保留原文，未生成占位。", "asset")
        return None
    if isinstance(mapping, str) and mapping not in ("auto", "none"):
        mapping = [mapping]
    return _avatar_url(mapping, index, available, ctx, f"原文卡{role}")


def _source_inner(nodes, spec, ctx):
    """The reference begins the right column and never copies an original heading."""
    ref = spec.get("inner_split_ref")
    if not ref:
        _unfinished(ctx, "comp-text 原文卡：inner_columns:2 缺 inner_split_ref，保留单栏。")
        return None
    matches = []
    for i, node in enumerate(nodes):
        if node.get("type") == "bullets":
            for j, item in enumerate(node.get("items") or []):
                if _starts_with((item.get("lead") or "") + (item.get("text") or ""), ref):
                    matches.append((i, j))
        elif _starts_with((node.get("name") or "") + (node.get("text") or ""), ref):
            matches.append((i, None))
    if len(matches) != 1:
        _unfinished(ctx, "comp-text 原文卡：inner_split_ref 没有唯一完整原项，保留单栏。")
        return None
    i, j = matches[0]
    left, right = list(nodes[:i]), list(nodes[i:])
    if j is not None and j:
        node = nodes[i]
        left.append(dict(node, items=node["items"][:j]))
        right[0] = dict(node, items=node["items"][j:])
        if len(node.get("src") or []) == len(node["items"]):
            left[-1]["src"], right[0]["src"] = node["src"][:j], node["src"][j:]
    if not left or not right:
        _unfinished(ctx, "comp-text 原文卡：inner_split_ref 须保留左右非空原文，保留单栏。")
        return None
    for side, key in ((left, "inner_left_refs"), (right, "inner_right_refs")):
        refs = spec.get(key)
        values = [(item.get("lead") or "") + (item.get("text") or "")
                  for node in side if node.get("type") == "bullets" for item in node.get("items") or []]
        values += [(node.get("name") or "") + (node.get("text") or "")
                   for node in side if node.get("type") != "bullets"]
        if refs is not None and (not isinstance(refs, list) or any(
                not any(_starts_with(raw, value) for raw in values) for value in refs)):
            _unfinished(ctx, f"comp-text 原文卡：{key} 与指定原栏不一致，原边界照常布局，引用核对未完成。")
    return [left, right]


def _source_copy(nodes, emphasis_ref, ctx):
    parts = []
    for node in nodes:
        if node.get("type") == "bullets" and emphasis_ref:
            rows = []
            for item in node.get("items") or []:
                raw = (item.get("lead") or "") + (item.get("text") or "")
                cls = "tb ct-source-emphasis" if _starts_with(raw, emphasis_ref) else "tb"
                rows.append(f'<li class="{cls}">{_lead(ctx, item.get("lead"))} {_text(ctx, item.get("text"))}</li>')
            parts.append('<ul class="ct-list">' + ''.join(rows) + '</ul>')
        else:
            content = _node(node, ctx)
            if emphasis_ref and _starts_with((node.get("name") or "") + (node.get("text") or ""), emphasis_ref):
                content = '<div class="ct-source-emphasis">' + content + '</div>'
            parts.append(content)
    return ''.join(parts)


def _source_emphasis(nodes, spec, ctx):
    emphasis_ref = spec.get("emphasis_ref") if spec.get("emphasis") == "pale_green_rounded_panel" else None
    if spec.get("emphasis") not in (None, "none", "pale_green_rounded_panel"):
        _unfinished(ctx, "comp-text 原文卡：emphasis 只支持 pale_green_rounded_panel，指定强调未执行。")
    if emphasis_ref:
        count = sum(sum(_starts_with((item.get("lead") or "") + (item.get("text") or ""), emphasis_ref)
                        for item in node.get("items") or []) if node.get("type") == "bullets" else
                    _starts_with((node.get("name") or "") + (node.get("text") or ""), emphasis_ref) for node in nodes)
        if count != 1:
            _unfinished(ctx, "comp-text 原文卡：emphasis_ref 没有唯一完整原规则，保留原文，强调未执行。")
            emphasis_ref = None
    elif spec.get("emphasis") == "pale_green_rounded_panel":
        _unfinished(ctx, "comp-text 原文卡：浅绿强调缺 emphasis_ref，未猜选原规则。")
    return emphasis_ref


def _source_card(group, index, spec, ctx, paginated, emphasis_ref=None):
    head, nodes = _source_head(group, index, spec, ctx, paginated)
    note = ""
    ref = spec.get("row_note_from")
    if ref:
        hits = [(i, n) for i, n in enumerate(nodes) if n.get("type") == "para"
                and isinstance(ref, str) and n.get("text", "").count(ref) == 1]
        if ctx.orient == "h" and len(hits) == 1 and spec.get("row_card_notes") is True:
            i, n = hits[0]
            cut = n["text"].index(ref)
            if cut > 0 and i == len(nodes) - 1:
                note = _node(dict(n, text=n["text"][cut:]), ctx)
                nodes = [*nodes[:i], dict(n, text=n["text"][:cut])]
            else:
                _unfinished(ctx, "原文卡整行补充需从末段内部唯一切开，原字保留。")
        else:
            _unfinished(ctx, "原文卡整行补充缺横版父行或唯一原末段，原字保留。")
    inner = _source_inner(nodes, spec, ctx) if spec.get("inner_columns") == 2 and ctx.orient == "h" else None
    if inner:
        content = '<div class="ct-source-inner">' + ''.join(
            '<div class="ct-source-column">' + _source_copy(part, emphasis_ref, ctx) + '</div>' for part in inner) + '</div>'
    else:
        content = _source_copy(nodes, emphasis_ref, ctx)
    position = spec.get("illustration_v", spec.get("illustration", "none")) if ctx.orient == "v" else spec.get("illustration", "none")
    positions = ("top_inside", "left_inside", "right_inside", "bottom_inside", "bottom_right_inside")
    mapping = spec.get("illustration_asset", spec.get("illustrations"))
    scalar_continuation = paginated and index and not isinstance(mapping, (list, dict))
    header_only = mapping is None and spec.get("icon_position") in ("header_left", "header_top")
    if position in positions and not scalar_continuation and not header_only:
        url = _source_asset(mapping, index, list(ctx.illustrations()), ctx, "卡内插画")
        if url:
            image = f'<img class="ct-source-illustration deco" aria-hidden="true" alt="" src="{escape(url, quote=True)}">'
            picture = image if position == "top_inside" else ""
            content = f'<div class="ct-source-with-illustration ct-source-{position}">{picture}<div class="ct-source-copy">{content}</div>{image if not picture else ""}</div>'
    elif position not in ("none", None, *positions):
        _unfinished(ctx, f"comp-text 原文卡：不支持插画位置 {position}，保留原文。")
    if spec.get("brush") not in (None, "none", False):
        _unfinished(ctx, "comp-text 原文卡：缺合格原笔刷素材，未用 CSS 线代替。", "asset")
    break_before = ' data-page-break-before="true"' if paginated and index else ""
    headed = " ct-source-headed" if head else ""
    body_class = "ct-source-body" + (" ct-source-monospace" if spec.get("font_role") == "monospace" else "")
    card = f'<section class="ct-card card ct-source-card{headed}"{break_before}>{head}<div class="{body_class}">{content}</div></section>'
    # DOM原序仍为原段前半→后半；父行只改变视觉网格位置，G1不需放宽。
    note_row = spec.get("row_note_row", 2)
    if type(note_row) is not int or note_row < 2:
        _unfinished(ctx, "原文卡整行补充行号需为2以上整数，保留第二行。")
        note_row = 2
    return card + (f'<div class="ct-row-note" style="grid-row:{note_row}">{note}</div>' if note else "")


def _source_split(nodes, boundary, ctx, field="split_after"):
    """Split after one original bullet, including a boundary inside its node."""
    if boundary is None or boundary is False or boundary == "":
        return None
    matches, ordinal = [], 0
    for node_index, node in enumerate(nodes):
        if node.get("type") != "bullets":
            continue
        for item_index, item in enumerate(node.get("items") or []):
            ordinal += 1
            if isinstance(boundary, int) and not isinstance(boundary, bool):
                matched = boundary == ordinal
            elif isinstance(boundary, str):
                matched = _starts_with((item.get("lead") or "") + (item.get("text") or ""), boundary)
            else:
                matched = False
            if matched:
                matches.append((node_index, item_index + 1))
    if len(matches) != 1:
        _unfinished(ctx, f"comp-text 原文卡：{field} 没有唯一匹配的原清单边界，保留原文，分卡未执行。")
        return None
    node_index, cut = matches[0]
    node = nodes[node_index]
    items = node.get("items") or []
    before, after = list(nodes[:node_index]), list(nodes[node_index + 1:])
    first, second = dict(node, items=items[:cut]), dict(node, items=items[cut:])
    if len(node.get("src") or []) == len(items):
        first["src"], second["src"] = node["src"][:cut], node["src"][cut:]
    before.append(first)
    if second["items"]:
        after.insert(0, second)
    if not after:
        _unfinished(ctx, f"comp-text 原文卡：{field} 后没有原文，保留原卡，未生成空卡。")
        return None
    # The original heading stays in before; the continuing card has no repeated heading.
    return [before, after]


def render_glossary(block, ctx):
    return _shell("glossary", block, ctx, lambda group, _: _headed(group, ctx, "glossary", True))


POINTS_FIELDS = {
    "columns", "columns_v", "size", "align", "last_full_width", "last_inner_columns", "whole_block", "split_cards",
    "page_break_after", "item_pages", "item_cards", "split_clauses", "inner_columns", "inner_columns_v",
    "column_split_after", "split_after", "item_images", "icons", "item_icon_offset", "illustration",
    "illustration_asset", "illustrations", "illustration_align", "icon_position", "header_icon",
    "header_icon_source", "inset_prefixes", "inset_paras", "split_at", "linkrow_buttons", "body_tone",
    "inline_tags", "tag_separator", "tag_columns", "tag_columns_v", "tag_items", "inset_spans",
    "paragraph_bubbles", "checkbox_items", "paragraph_header_prefix",
    "address_style", "button_columns", "inline_buttons", "tag_separator_layout", "header_divider", "corner_tag_ref", "tag_ref",
    "status_tag", "item_status_dots", "commands", "command_spans", "warning_paras", "inset_tone", "inset_icon", "inset_icons",
    "item_layout", "item_columns", "list_columns", "column_fill", "column_counts", "card_title_size",
    "container", "split_paras", "table_mobile", "header_navigation", "heading_icon", "item_icons",
    "inline_links", "step_index", "connector", "items_layout", "tone", "brand", "grid_position",
    "exception_targets", "connect_to", "motion_icon_arrow", "header_icon_motion_dots",
    "full_width", "no_duplicate_title", "source_body",
}


def _points_safe_edges(value, edges):
    spans = re.finditer(r"\*\*.*?\*\*|`[^`]*`|[〔【［][^〔〕【】［］]*[〕】］]", value)
    return not any(span.start() < edge < span.end() for span in spans for edge in edges)


def _points_has_separator(value, separator):
    plain = re.sub(r"\*\*.*?\*\*|`[^`]*`|[〔【［][^〔〕【】［］]*[〕】］]", "", value)
    return isinstance(separator, str) and bool(separator) and separator in plain


def fragment_inline(value, ctx, spec):
    """Render explicitly selected original fragments without splitting inline marks."""
    value = str(value or "")
    requested = spec.get("inset_spans") or []
    if not requested:
        return _text(ctx, value)
    checked = spec.get("_points_fragments_checked", False)
    if not isinstance(requested, list):
        _unfinished(ctx, "comp-text 局部引文：inset_spans 需要精确原片段列表，保留原文。")
        return _text(ctx, value)
    spans = []
    for marker in requested:
        if checked and isinstance(marker, str) and marker not in value:
            continue
        if not isinstance(marker, str) or not marker or value.count(marker) != 1:
            _unfinished(ctx, "comp-text 局部引文：inset_spans 没有唯一原片段，保留原文，局部框未执行。")
            return _text(ctx, value)
        start = value.index(marker)
        end = start + len(marker)
        if not _points_safe_edges(value, (start, end)):
            _unfinished(ctx, "comp-text 局部引文：inset_spans 切入原行内记号，保留原文，局部框未执行。")
            return _text(ctx, value)
        spans.append((start, end))
    spans.sort()
    if any(left[1] > right[0] for left, right in zip(spans, spans[1:])):
        _unfinished(ctx, "comp-text 局部引文：inset_spans 原片段重叠，保留原文，局部框未执行。")
        return _text(ctx, value)
    output, cursor = [], 0
    for start, end in spans:
        output.extend((_text(ctx, value[cursor:start]), '<span class="ct-point-inset-span">' + _text(ctx, value[start:end]) + '</span>'))
        cursor = end
    output.append(_text(ctx, value[cursor:]))
    return ''.join(output)


def _points_fragment_spec(spec, nodes, ctx):
    """Validate source selections once across this block; never mutate source nodes."""
    spec = dict(spec)
    paras = [str(node.get("text") or "") for node in nodes if node.get("type") == "para"]
    items = [("**" + value["lead"] + "**" if value.get("lead") else "") + (value.get("text") or "")
             for node in nodes if node.get("type") == "bullets" for value in node.get("items") or []]
    for key, values, exact in (("inset_spans", paras, True), ("paragraph_bubbles", paras, False), ("checkbox_items", items, False)):
        if key not in spec:
            continue
        requested = spec[key]
        if not isinstance(requested, list) or not requested:
            _unfinished(ctx, f"comp-text 要点卡：{key} 需要非空原片段列表，指定排法未执行。")
            spec[key] = []
            continue
        valid = []
        for marker in requested:
            count = sum(value.count(marker) for value in values) if exact and isinstance(marker, str) and marker else sum(
                _starts_with(value, marker) for value in values) if isinstance(marker, str) and marker else 0
            if count != 1 or marker in valid:
                _unfinished(ctx, f"comp-text 要点卡：{key} 没有唯一匹配的原片段，指定排法未执行。")
            else:
                valid.append(marker)
        spec[key] = valid
    spec["_points_fragments_checked"] = True
    if "tag_items" in spec:
        requested, valid = spec["tag_items"], []
        if not isinstance(requested, list) or not requested:
            _unfinished(ctx, "comp-text 要点卡：tag_items 需要原条目映射列表，指定标签未执行。")
        else:
            for entry in requested:
                prefix = entry.get("item_ref") if isinstance(entry, dict) else None
                if not isinstance(prefix, str) or not prefix or sum(_starts_with(value, prefix) for value in items) != 1 or any(
                        _starts_with(value, prefix) and _starts_with(value, old["item_ref"]) for value in items for old in valid):
                    _unfinished(ctx, "comp-text 要点卡：tag_items.item_ref 没有唯一原条目，指定标签未执行。")
                elif not isinstance(entry.get("separator"), str) or not entry["separator"]:
                    _unfinished(ctx, "comp-text 要点卡：tag_items.separator 需要明确原分隔字，指定标签未执行。")
                elif not any(_starts_with(value, prefix) and _points_has_separator(value, entry["separator"]) for value in items):
                    _unfinished(ctx, "comp-text 要点卡：tag_items 的原条目没有标记外分隔字，指定标签未执行。")
                else:
                    valid.append(entry)
        spec["tag_items"] = valid
    if spec.get("inline_tags"):
        separator = spec.get("tag_separator")
        if not isinstance(separator, str) or not separator or not any(_points_has_separator(value, separator) for value in paras):
            _unfinished(ctx, "comp-text 要点卡：inline_tags 需要原段里的明确 tag_separator，指定标签未执行。")
            spec["inline_tags"] = False
    return spec


def _points_tag(node, ctx, spec, entry=None):
    requested = entry if entry is not None else {
        "separator": spec.get("tag_separator"), "columns": spec.get("tag_columns"), "columns_v": spec.get("tag_columns_v"),
        "separator_layout": spec.get("tag_separator_layout")}
    fields = {key: requested[key] for key in ("separator", "columns", "columns_v", "separator_layout") if requested.get(key) is not None}
    return ctx.render({"type": "tag", "spec": fields, "nodes": [node]})


def _points_header_parts(node, prefix):
    value = str(node.get("text") or "")
    if node.get("type") != "para" or not isinstance(prefix, str) or not re.match(r"^\*\*[^*]+\*\*", prefix):
        return None
    if not value.startswith(prefix) or not _points_safe_edges(value, (len(prefix),)):
        return None
    return prefix, value[len(prefix):]


def _points_header_values(nodes, spec):
    values = []
    for node in nodes:
        kind = node.get('type')
        if kind in ('group', 'card', 'h1', 'h2', 'h3'):
            values.append(str((node.get('name') if kind in ('group', 'card') else node.get('text')) or ''))
        elif kind == 'para' and (parts := _points_header_parts(node, spec.get('paragraph_header_prefix'))):
            values.append(parts[0])
    return values


def _points_corner_spec(spec, nodes, ctx):
    """只选择唯一原卡头后缀，不从正文造角签或移动原字。"""
    spec = dict(spec)
    explicit, alias = spec.get('corner_tag_ref'), spec.get('tag_ref')
    if explicit in (None, '') and alias in (None, ''):
        return spec
    if any(value not in (None, '') and (not isinstance(value, str) or not value.strip()) for value in (explicit, alias)):
        _unfinished(ctx, 'comp-text 要点卡：corner_tag_ref/tag_ref 需要唯一原卡头后缀文字，原字保留。')
        return spec
    ref = explicit or alias
    headers = _points_header_values(nodes, spec)
    candidates = [ref] if explicit else ['（' + ref + '）', '(' + ref + ')', ref]
    matches = [(value, marker) for marker in candidates for value in headers
               if value.rstrip().endswith(marker) and value.count(marker) == 1 and
               _points_safe_edges(value, (value.rfind(marker), value.rfind(marker) + len(marker)))]
    # legacy tag_ref 是同一个原括注的内词，优先完整括注保留原标点。
    if not explicit and any(marker != ref for _, marker in matches):
        matches = [row for row in matches if row[1] != ref]
    if len(matches) != 1 or explicit and alias and _prefix_text(explicit).strip('（）()') != _prefix_text(alias).strip('（）()'):
        _unfinished(ctx, 'comp-text 要点卡：角签没有唯一完整原卡头后缀或两引用冲突，保留原字，不造角签。')
        return spec
    spec['_points_corner_header'], spec['_points_corner_marker'] = matches[0]
    return spec


def _points_corner_context(ctx, spec, group):
    original, marker = spec.get('_points_corner_header'), spec.get('_points_corner_marker')
    if not original or original not in _points_header_values(group, spec):
        return ctx

    class CornerContext:
        def __getattr__(self, key):
            return getattr(ctx, key)

        def inline(self, value):
            output = ctx.inline(value)
            if value == original:
                token = escape(marker)
                output = output.replace(token, '<span class="ct-point-corner-tag tb">' + token + '</span>', 1)
            return output

    return CornerContext()


def _points_button_line(node):
    value = node.get('text') if node.get('type') == 'para' else '\n'.join(node.get('src') or []) if node.get('type') == 'linkrow' else None
    return value if value and re.fullmatch(r'(?:\s*(?:［[^［］]+］|【[^【】]+】)\s*)+', value) else None


def _points_items_layout(spec, nodes, ctx):
    layout = spec.get("items_layout")
    if layout is None:
        return spec
    if not isinstance(layout, dict):
        _unfinished(ctx, "comp-text 要点卡：items_layout 需要明确构造字典，原节点保留。")
        return spec
    known = {"outer_card", "title_from_group", "direction", "items_count", "separator", "icon_subjects",
             "icon_position", "body_from_entire_bullets_node", "source_part", "full_width", "title", "title_size",
             "intro_after_heading", "icon_subject", "numbered_items", "number_style", "steps_direction",
             "button_first_step", "button_role", "link_last_step", "link_style", "equal_height",
             "no_duplicate_title", "bullets_count", "bullet_style", "intro_position", "heading_style", "body_order"}
    for key in layout.keys() - known:
        _unfinished(ctx, f"comp-text 要点卡：items_layout.{key} 尚无合同，原节点保留。")
    bullets = [node for node in nodes if node.get("type") == "bullets"]
    steps = [item for node in nodes if node.get("type") == "steps" for item in node.get("items") or []]
    bullet_count = sum(len(node.get("items") or []) for node in bullets)
    first = nodes[0] if nodes else {}
    head_kind = first.get("type")
    has_head = head_kind in ("group", "card", "h1", "h2", "h3")
    for key in ("outer_card", "title_from_group", "body_from_entire_bullets_node", "intro_after_heading", "equal_height", "no_duplicate_title", "full_width"):
        if key in layout and not isinstance(layout[key], bool):
            _unfinished(ctx, f"comp-text 要点卡：items_layout.{key} 必须为布尔值，原节点保留。")
    if layout.get("outer_card") is True:
        spec["whole_block"] = True
    if layout.get("title_from_group") and head_kind != "group":
        _unfinished(ctx, "comp-text 要点卡：title_from_group 找不到原首 group，未造标题。")
    if layout.get("title") not in (None, "inside_upper_left") or layout.get("title") and not has_head:
        _unfinished(ctx, "comp-text 要点卡：items_layout.title 需要原首标题及 inside_upper_left，原序保留。")
    if layout.get("title_size") is not None:
        spec["card_title_size"] = layout["title_size"]
    for key, total in (("items_count", bullet_count), ("bullets_count", bullet_count), ("numbered_items", len(steps))):
        if key in layout and (not isinstance(layout[key], int) or isinstance(layout[key], bool) or layout[key] != total):
            _unfinished(ctx, f"comp-text 要点卡：items_layout.{key} 与全部原项数 {total} 不符，原字保全。")
    if layout.get("body_from_entire_bullets_node") and len(bullets) != 1:
        _unfinished(ctx, "comp-text 要点卡：body_from_entire_bullets_node 需要完整唯一原 bullets，原节点保留。")
    if layout.get("direction") is not None:
        if layout["direction"] != "vertical":
            _unfinished(ctx, "comp-text 要点卡：items_layout.direction 只支持 vertical，原字保留。")
        else:
            spec["inner_columns"] = spec["inner_columns_v"] = 1
    if layout.get("separator") is not None:
        if layout["separator"] == "thin_green" and bullet_count:
            spec["_points_separator"] = True
        else:
            _unfinished(ctx, "comp-text 要点卡：separator 需要 thin_green 和原条目，分隔未执行。")
    icon_position = layout.get("icon_position")
    if icon_position == "left_of_each_bullet":
        if bullet_count:
            spec["item_cards"] = True
        else:
            _unfinished(ctx, "comp-text 要点卡：left_of_each_bullet 找不到原条目，原字保留。")
    elif icon_position == "upper_right_inside":
        if has_head:
            spec["_points_header_right"] = True
        else:
            _unfinished(ctx, "comp-text 要点卡：upper_right_inside 缺原卡头，图位未执行。")
    elif icon_position is not None:
        _unfinished(ctx, "comp-text 要点卡：items_layout.icon_position 不支持该图位，原字保留。")
    subjects = layout.get("icon_subjects")
    if subjects is not None and (not isinstance(subjects, list) or len(subjects) != bullet_count or
                                 any(not isinstance(value, str) or not value for value in subjects)):
        _unfinished(ctx, "comp-text 要点卡：icon_subjects 与原项槽数不符；主体映射须由素材负责人核对。", "asset")
    if "icon_subject" in layout and (not isinstance(layout["icon_subject"], str) or not layout["icon_subject"]):
        _unfinished(ctx, "comp-text 要点卡：icon_subject 缺明确原槽主体，素材语义未核实。", "asset")
    if layout.get("number_style") is not None:
        if layout["number_style"] == "green_circle" and steps:
            spec["_points_number_circle"] = True
        else:
            _unfinished(ctx, "comp-text 要点卡：number_style 需要 green_circle 及原编号条目，编号未造。")
    if layout.get("steps_direction") not in (None, "vertical"):
        _unfinished(ctx, "comp-text 要点卡：steps_direction 只支持 vertical，原步骤仍纵排。")
    if layout.get("bullet_style") not in (None, "green_dot"):
        _unfinished(ctx, "comp-text 要点卡：bullet_style 只支持原清单 green_dot，原字保留。")
    if layout.get("intro_after_heading") and (not has_head or len(nodes) < 2 or nodes[1].get("type") != "para"):
        _unfinished(ctx, "comp-text 要点卡：intro_after_heading 找不到原标题后的完整原段，不造介绍。")
    if layout.get("intro_position") == "above_card_as_source":
        _unfinished(ctx, "comp-text 要点卡：intro_position:above_card_as_source 会把原介绍移到原标题之前，保留原标题后原序，构图需页规格负责人确认。")
    elif layout.get("intro_position") is not None:
        _unfinished(ctx, "comp-text 要点卡：items_layout.intro_position 未支持，原序保留。")
    if layout.get("equal_height") is True:
        spec["_points_equal_height"] = True
    for key in ("full_width", "no_duplicate_title", "source_part"):
        if key in layout:
            spec[key] = layout[key]
    first_payload = ((steps[0].get("lead") or "") + (steps[0].get("text") or "")) if steps else ""
    last_payload = ((steps[-1].get("lead") or "") + (steps[-1].get("text") or "")) if steps else ""
    if "button_first_step" in layout:
        label = layout["button_first_step"]
        if not isinstance(label, str) or not label or not any(mark + label + end in first_payload for mark, end in (("［", "］"), ("【", "】"))):
            _unfinished(ctx, "comp-text 要点卡：button_first_step 不在第一原步，保留原按钮。")
        elif layout.get("button_role") == "secondary":
            spec["_points_button_secondary"] = True
        else:
            _unfinished(ctx, "comp-text 要点卡：第一步按钮角色只支持 secondary，原按钮保留。")
    elif layout.get("button_role") is not None:
        _unfinished(ctx, "comp-text 要点卡：button_role 缺明确第一原步按钮，原按钮保留。")
    if "link_last_step" in layout:
        label = layout["link_last_step"]
        if not isinstance(label, str) or not label or "〔" + label + "〕" not in last_payload:
            _unfinished(ctx, "comp-text 要点卡：link_last_step 不在最后原步，保留原链接。")
        elif layout.get("link_style") == "green_underline":
            spec["_points_last_link"] = True
        else:
            _unfinished(ctx, "comp-text 要点卡：最后原步链接仅支持 green_underline，原链接保留。")
    elif layout.get("link_style") is not None:
        _unfinished(ctx, "comp-text 要点卡：link_style 缺明确最后原步链接，原链接保留。")
    if layout.get("heading_style") not in (None, "bold_sans"):
        _unfinished(ctx, "comp-text 要点卡：heading_style 仅支持共享 bold_sans，原标题保留。")
    if "body_order" in layout:
        paras = [node for node in nodes if node.get("type") == "para"]
        if layout["body_order"] == ["quote", "before", "after"] and len(paras) == 3:
            spec["_points_body_roles"] = layout["body_order"]
        else:
            _unfinished(ctx, "comp-text 要点卡：body_order 需要三段原 quote/before/after，不重排原字。")
    return spec


def _points_spec_compat(spec, nodes, ctx):
    spec = _points_items_layout(dict(spec), nodes, ctx)
    spec.pop("_points_exception_targets", None)
    if "motion_icon_arrow" in spec and spec["motion_icon_arrow"] is not None and not isinstance(spec["motion_icon_arrow"], bool):
        _unfinished(ctx, "comp-text 要点卡：motion_icon_arrow需要布尔值，保留原图/原字，未猜箭头位置。")
        spec["motion_icon_arrow"] = False
    enums = {"item_layout": (None, "", "individual_cards"), "container": (None, "", "rules_card"),
             "column_fill": (None, "", "row", "column"), "table_mobile": (None, "", "row_cards"),
             "header_navigation": (None, "", "none", "inline_right"), "heading_icon": (None, "", "none", "check", "cross"),
             "item_icons": (None, "", "none", "check", "arrow"), "inline_links": (None, "", "normal", "button"),
             "tone": (None, "", "green", "yellow"), "connector": (None, "", "none", "arrow"),
             "card_title_size": (None, "", "small", "medium", "large")}
    for key, allowed in enums.items():
        if spec.get(key) not in allowed:
            _unfinished(ctx, f"comp-text 要点卡：{key} 的值 {spec.get(key)!r} 尚未支持，原字保留。")
            spec[key] = None
    if spec.get("card_title_size"):
        spec["size"] = spec["card_title_size"]
    if spec.get("item_layout") == "individual_cards":
        spec["item_cards"] = True
    if spec.get("container") == "rules_card":
        spec["whole_block"] = True
    for key in ("item_columns", "list_columns"):
        if key in spec:
            value = spec[key]
            maximum = 4 if ctx.orient == "h" else 2
            if not isinstance(value, int) or isinstance(value, bool) or not 1 <= value <= maximum:
                _unfinished(ctx, f"comp-text 要点卡：{key} 需要本方向1至{maximum}整数列数，保留原排法。")
            else:
                spec["inner_columns" if ctx.orient == "h" else "inner_columns_v"] = value
    if "split_paras" in spec and not isinstance(spec["split_paras"], bool):
        _unfinished(ctx, "comp-text 要点卡：split_paras 必须是布尔值，保留原节点。")
        spec["split_paras"] = False
    if spec.get("split_paras") and (not nodes or any(node.get("type") != "para" for node in nodes) or spec.get("whole_block")):
        _unfinished(ctx, "comp-text 要点卡：split_paras 需要完整原 para 且不与 whole_block 冲突，保留默认原卡边界。")
        spec["split_paras"] = False
    if "column_counts" in spec:
        counts = spec["column_counts"]
        total = sum(len(node.get("items") or []) for node in nodes if node.get("type") == "bullets")
        columns = spec.get("inner_columns" if ctx.orient == "h" else "inner_columns_v", 1)
        if not isinstance(counts, list) or not counts or any(not isinstance(n, int) or isinstance(n, bool) or n < 1 for n in counts) or sum(counts) != total or len(counts) != columns or spec.get("column_fill") != "column":
            _unfinished(ctx, "comp-text 要点卡：column_counts 需在 column 填列下覆盖全部原项，列数和条数均须相符，原字保留。")
            spec["column_counts"] = None
    for key in ("full_width", "no_duplicate_title"):
        if key in spec and not isinstance(spec[key], bool):
            _unfinished(ctx, f"comp-text 要点卡：{key} 必须为布尔值，原字保留。")
            spec[key] = False
    if spec.get("full_width") and spec.get("width") not in (None, "", "100%"):
        _unfinished(ctx, "comp-text 要点卡：full_width 与父块 width 冲突，父宽须由页规格负责人统一。")
    if spec.get("no_duplicate_title"):
        titles = [node.get("name") if node.get("type") in ("group", "card") else node.get("text")
                  for node in nodes if node.get("type") in ("group", "card", "h1", "h2", "h3")]
        if not titles or titles.count(titles[0]) != 1:
            _unfinished(ctx, "comp-text 要点卡：no_duplicate_title 缺唯一原卡头，原字不删除。")
    if "source_part" in spec and (not isinstance(spec["source_part"], int) or isinstance(spec["source_part"], bool) or spec["source_part"] < 1):
        _unfinished(ctx, "comp-text 要点卡：source_part 需要正整数原分部编号，原字保留。")
        spec.pop("source_part")
    first = nodes[0] if nodes else {}
    heading_steps = first.get("items") or [] if first.get("type") == "steps" else []
    step = heading_steps[0] if len(heading_steps) == 1 and heading_steps[0].get("lead") and not heading_steps[0].get("text") and not heading_steps[0].get("cols") else None
    index = int(step["n"]) if step and str(step.get("n", "")).isdigit() else None
    has_heading = first.get("type") in ("card", "group", "h1", "h2", "h3") or step is not None or _points_header_parts(first, spec.get("paragraph_header_prefix")) is not None
    if spec.get("heading_icon") in ("check", "cross") and not has_heading:
        _unfinished(ctx, "comp-text 要点卡：heading_icon 缺完整原卡头，未补造标题或图位。")
    if spec.get("item_icons") in ("check", "arrow") and not any(node.get("type") == "bullets" for node in nodes) and not spec.get("split_clauses"):
        _unfinished(ctx, "comp-text 要点卡：item_icons 找不到原清单或明确子句，不猜图形位置。")
    if "step_index" in spec and (not isinstance(spec["step_index"], int) or isinstance(spec["step_index"], bool) or spec["step_index"] != index):
        _unfinished(ctx, "comp-text 要点卡：step_index 必须与完整原步骤编号相同，不补编号。")
    elif index is not None and (spec.get("step_index") is not None or spec.get("connector") == "arrow"):
        spec["_points_step_index"] = index
    if spec.get("illustration") == "above_card" and index is None:
        _unfinished(ctx, "comp-text 要点卡：above_card 需要完整原编号卡头确定图槽，图位未执行。")
    if spec.get("connector") == "arrow":
        screen = getattr(ctx, "screen", {})
        if index is None or not isinstance(screen, dict) or not screen.get("text"):
            _unfinished(ctx, "comp-text 要点卡：connector:arrow 缺原步骤序列，未猜下一张卡。")
        else:
            from engine.parse import parse
            numbers = [int(item["n"]) for node in parse(screen["text"]) if node.get("type") == "steps"
                       for item in node.get("items") or [] if str(item.get("n", "")).isdigit()]
            if numbers.count(index) != 1:
                _unfinished(ctx, "comp-text 要点卡：connector:arrow 原步骤编号不唯一，未猜下一张卡。")
            else:
                ordinal = numbers.index(index)
                spec["_points_next_arrow"] = ordinal + 1 < len(numbers) and numbers[ordinal + 1] == index + 1
    if spec.get("brand") not in (None, "", "none"):
        _unfinished(ctx, "comp-text 要点卡：brand 的品牌卡图位尚无明确合同，已有共享素材仍需素材/页规格负责人确认。")
    if spec.get("grid_position") not in (None, "", "none"):
        _unfinished(ctx, "comp-text 要点卡：grid_position 未执行；right_third 与本屏手机原场景最下全宽冲突，保留原序待页规格负责人确认。")
    if spec.get("connect_to") not in (None, "", "steps"):
        _unfinished(ctx, "comp-text 要点卡：connect_to 只接受 steps 的原目标声明，跨块连线未执行。")
    if "exception_targets" in spec:
        targets = spec["exception_targets"]
        rows = [(item.get("lead") or "") + (item.get("text") or "") for node in nodes if node.get("type") == "bullets" for item in node.get("items") or []]
        original = [int(match.group(1)) if (match := re.match(r"^第\s*(\d+)\s*步", row)) else None for row in rows]
        if not isinstance(targets, list) or any(not isinstance(n, int) or isinstance(n, bool) or n < 1 for n in targets) or targets != original:
            _unfinished(ctx, "comp-text 要点卡：exception_targets 与每条原‘第n步’不符，不造锚点或箭头。")
        else:
            spec["_points_exception_targets"] = targets
        if not _step_ports_ready(spec, ctx):
            _unfinished(ctx, "comp-text 要点卡：例外目标仅输出原 data-target 锚点；跨其它步骤外框的坐标/容器合同尚缺，连线未完成。")
    elif spec.get("connect_to") == "steps":
        _unfinished(ctx, "comp-text 要点卡：connect_to:steps 缺逐条原 exception_targets，跨卡连线未执行。")
    if "header_divider" in spec and not isinstance(spec["header_divider"], bool):
        _unfinished(ctx, "comp-text 要点卡：header_divider 需要布尔值，保留默认卡头分隔。")
        spec.pop("header_divider")
    spec["_points_custom"] = bool(spec.get("items_layout") or spec.get("column_fill") == "column" or
        spec.get("header_navigation") == "inline_right" or spec.get("heading_icon") in ("check", "cross") or
        spec.get("item_icons") in ("check", "arrow") or spec.get("inline_links") == "button" or
        spec.get("tone") == "yellow" or spec.get("illustration") == "above_card" or spec.get("connector") == "arrow" or
        spec.get("_points_exception_targets") or "inline_buttons" in spec or "header_divider" in spec or
        "corner_tag_ref" in spec or "tag_ref" in spec or spec.get("motion_icon_arrow") is True or _motion_dots_requested(spec))
    return spec


def _points_role_spec(spec, nodes, ctx):
    """Validate explicit original text roles; unmarked commands are never guessed."""
    spec = dict(spec)
    if spec.get("status_tag") not in (None, "", "none", "shape_only", "neutral"):
        _unfinished(ctx, "comp-text 要点卡：status_tag 只支持 shape_only/neutral，保留原字，能力标签未执行。")
        spec["status_tag"] = None
    if "item_status_dots" in spec and not isinstance(spec["item_status_dots"], bool):
        _unfinished(ctx, "comp-text 要点卡：item_status_dots 需要布尔值，保留原状态词。")
        spec["item_status_dots"] = False
    if spec.get("commands") not in (None, "", "normal", "monospace"):
        _unfinished(ctx, "comp-text 要点卡：commands 只支持 normal/monospace，保留原字，命令灰条未执行。")
        spec["commands"] = None
    if spec.get("inset_tone") not in (None, "", "green", "yellow"):
        _unfinished(ctx, "comp-text 要点卡：inset_tone 只支持 green/yellow，保留原字与默认浅绿卡内框。")
        spec["inset_tone"] = None
    paras = [str(node.get("text") or "") for node in nodes if node.get("type") == "para"]
    if "warning_paras" in spec:
        requested, valid = spec["warning_paras"], []
        if not isinstance(requested, list) or not requested:
            _unfinished(ctx, "comp-text 要点卡：warning_paras 需要非空原提示段开头列表，提示角色未执行。")
        else:
            for prefix in requested:
                if not isinstance(prefix, str) or not prefix or sum(_starts_with(value, prefix) for value in paras) != 1 or any(
                        _starts_with(value, prefix) and _starts_with(value, old) for value in paras for old in valid):
                    _unfinished(ctx, "comp-text 要点卡：warning_paras 没有唯一完整原提示段，保留原字，提示角色未执行。")
                else:
                    valid.append(prefix)
        spec["warning_paras"] = valid
        if valid:
            shared = Path(__file__).resolve().parents[2] / "style" / "base.css"
            shared_css = shared.read_text(encoding="utf-8") if shared.is_file() else ""
            shared_css = re.sub(r"/\*.*?\*/", "", shared_css, flags=re.S)
            if not all(re.search(r"--notice-orange-" + role + r"\s*:", shared_css) for role in ("bg", "line", "text")):
                _unfinished(ctx, "comp-text 要点卡：原提示段的小叉已执行；浅橙提示色缺共享 notice-orange-bg/line/text，暂用中性底，颜色未完成。")
    if "command_spans" in spec:
        requested, valid = spec["command_spans"], []
        values = list(paras)
        for node in nodes:
            if node.get("type") in ("bullets", "steps", "stats"):
                for item in node.get("items") or []:
                    values.extend(str(cell) for cell in item.get("cols") or [])
                    if not item.get("cols"):
                        values.append(str(item.get("text") or ""))
            elif node.get("type") == "code":
                values.append("\n".join(node.get("lines") or []))
        if spec.get("commands") != "monospace":
            _unfinished(ctx, "comp-text 要点卡：command_spans 需与 commands:monospace 一起使用，保留原文。")
        elif not isinstance(requested, list) or not requested:
            _unfinished(ctx, "comp-text 要点卡：command_spans 需要非空精确原命令片段列表，命令灰条未执行。")
        else:
            for marker in requested:
                matches = [value for value in values if isinstance(marker, str) and marker and marker in value]
                if len(matches) != 1 or matches[0].count(marker) != 1 or marker in valid:
                    _unfinished(ctx, "comp-text 要点卡：command_spans 没有唯一精确原片段，保留原字，命令灰条未执行。")
                elif not _points_safe_edges(matches[0], (matches[0].index(marker), matches[0].index(marker) + len(marker))):
                    _unfinished(ctx, "comp-text 要点卡：command_spans 切入原行内记号，保留原字，命令灰条未执行。")
                else:
                    valid.append(marker)
            for value in values:
                spans = sorted((value.index(marker), value.index(marker) + len(marker)) for marker in valid if marker in value)
                if any(left[1] > right[0] for left, right in zip(spans, spans[1:])):
                    _unfinished(ctx, "comp-text 要点卡：command_spans 原片段重叠，保留原字，指定命令灰条未执行。")
                    valid = []
                    break
        spec["command_spans"] = valid
    return spec


def _points_inline_context(ctx, spec):
    markers = spec.get("command_spans") or []
    button_links = spec.get("inline_links") == "button"
    capsule_buttons = spec.get("inline_buttons") == "capsule"
    if spec.get("inline_buttons") not in (None, "", "normal", "capsule"):
        _unfinished(ctx, "comp-text 要点卡：inline_buttons 只支持 normal/capsule，保留原按钮类型与目标。")
    if not markers and not button_links and not capsule_buttons:
        return ctx

    class CommandContext:
        def __getattr__(self, key):
            return getattr(ctx, key)

        def inline(self, value):
            value = "" if value is None else str(value)
            spans = sorted((value.index(marker), value.index(marker) + len(marker)) for marker in markers if marker in value)
            parts, cursor = [], 0
            for start, end in spans:
                classes = "ct-point-command" + (" ct-point-command-block" if start == 0 and end == len(value) else "")
                parts.extend((ctx.inline(value[cursor:start]), f'<span class="{classes}">' + ctx.inline(value[start:end]) + '</span>'))
                cursor = end
            parts.append(ctx.inline(value[cursor:]))
            output = ''.join(parts)
            if button_links or capsule_buttons:
                def decorate(match):
                    tag = match.group(0)
                    classes = re.search(r'(?<![\w-])class=(["\'])(.*?)\1', tag, re.S)
                    values = classes[2].split() if classes else []
                    native_button = (tag.startswith('<button') or 'inline-btn' in values
                                     or 'c-slot-controls-button' in values
                                     or re.search(r'\bdata-hot=(["\'])button\1', tag))
                    additions = []
                    if button_links and tag.startswith('<a') and 'lk' in values:
                        additions.append('ct-point-inline-button')
                    if capsule_buttons and native_button:
                        additions.append('ct-point-inline-capsule')
                    additions = [value for value in additions if value not in values]
                    if not additions:
                        return tag
                    if classes:
                        return tag[:classes.start(2)] + classes[2] + ' ' + ' '.join(additions) + tag[classes.end(2):]
                    # 只补角色类；原 tag、where、data-*、行为与 target 均保留。
                    return tag[:-1] + ' class="' + ' '.join(additions) + '">'
                output = re.sub(r'<(?:a|button)\b[^>]*>', decorate, output)
            return output

    return CommandContext()


def _points_status_sources(group):
    """只取同卡完整原 phone 段；不读兄弟卡、不把原标题当能力说明。"""
    phone = []
    for node in group:
        raw = str(node.get("text") or "")
        if node.get("type") == "para" and re.match(r"^手机上[:：]", _prefix_text(raw)):
            phone.append((raw, _prefix_text(raw)))
        elif node.get("type") == "card" and _prefix_text(node.get("name")) == "手机上" and raw:
            phone.append((raw, "手机上：" + _prefix_text(raw)))
    return phone


def _points_status_tone(phone):
    if len(phone) != 1:
        return None
    value = phone[0][1]
    match = re.match(r"^手机上[:：](手机直接做|手机经远控|要到电脑前)(?:[。，；;]|$)", value)
    # 一个原段同时说多个不同动作条件时，不把开头短句当成整段肯否。
    conclusions = set(re.findall(r"手机直接做|手机经远控|要到电脑前", value))
    if not match or len(conclusions) != 1:
        return None
    return {"手机直接做": "direct", "手机经远控": "remote", "要到电脑前": "onsite"}[match.group(1)]


def _points_status(group, spec, ctx):
    mode = spec.get("status_tag")
    if mode not in ("shape_only", "neutral"):
        return ""
    phone = _points_status_sources(group)
    tone = _points_status_tone(phone) if mode == "shape_only" else None
    if tone:
        return f'<span class="ct-point-status ct-point-status-{tone} deco" aria-hidden="true"></span>'
    if len(phone) == 1:
        # 原 phone 词由 status_context 在原正文位置包成中性标签，不再复制到卡头。
        return ""
    # 同卡无唯一 phone 原段：只加无字中性装饰，不猜作用、不借兄弟卡原字。
    return '<span class="ct-point-status ct-point-status-neutral deco" aria-hidden="true"></span>'


def _points_status_item_map(group, ctx):
    """只定位每个完整原 bullet 的尾括号状态；普通正文同词不消费。"""
    items = [item for node in group if node.get("type") == "bullets" for item in node.get("items") or []]
    if not items:
        _unfinished(ctx, "comp-text 要点卡：item_status_dots 没有完整原 bullet 条目，状态词保留。")
        return {}
    other_values = []
    for node in group:
        for key in ("name", "text", "label"):
            if isinstance(node.get(key), str):
                other_values.append(node[key])
        for item in node.get("items") or []:
            keys = ("lead", "num", "n") if node.get("type") == "bullets" else ("lead", "num", "n", "text")
            other_values.extend(item[key] for key in keys if isinstance(item.get(key), str))
            other_values.extend(value for value in item.get("cols") or [] if isinstance(value, str))
        if node.get("type") == "code":
            other_values.append("\n".join(node.get("lines") or []))
    mapped = {}
    for index, item in enumerate(items, 1):
        raw = str(item.get("text") or "")
        match = re.search(r"([（(])(在用|待验收|待实施)([）)])\s*$", raw)
        if (not match or {"（": "）", "(": ")"}[match[1]] != match[3] or raw in other_values):
            _unfinished(ctx, f"comp-text 要点卡：item_status_dots 第{index}原项没有唯一可定位的尾括号状态，原状态词保留。")
            continue
        mapped[raw] = (match.start(2), match.end(2), match[2])
    return mapped


def _points_status_context(ctx, spec, group):
    """在同卡原位置消费明确状态角色；保全底层 ctx、where、原字和热区。"""
    mode = spec.get("status_tag")
    phone = _points_status_sources(group) if mode in ("shape_only", "neutral") else []
    neutral_text = (phone[0][0] if len(phone) == 1 and
                    (mode == "neutral" or _points_status_tone(phone) is None) else None)
    item_dots = {}
    if "item_status_dots" in spec:
        if not isinstance(spec["item_status_dots"], bool):
            _unfinished(ctx, "comp-text 要点卡：item_status_dots 必须为布尔值，原状态词保留。")
        elif spec["item_status_dots"]:
            item_dots = _points_status_item_map(group, ctx)
    if neutral_text is None and not item_dots:
        return ctx

    class StatusContext:
        def __getattr__(self, key):
            return getattr(ctx, key)

        def inline(self, value):
            raw = "" if value is None else str(value)
            if raw in item_dots:
                start, end, word = item_dots[raw]
                tone = {"在用": "on", "待验收": "pending", "待实施": "todo"}[word]
                dot = (f'<span class="ct-point-item-status-dot ct-point-item-status-{tone}" '
                       f'data-text="{escape(word, quote=True)}"></span>')
                output = ctx.inline(raw[:start]) + dot + ctx.inline(raw[end:])
            else:
                output = ctx.inline(value)
            if raw == neutral_text:
                output = '<span class="ct-point-status-text ct-point-status-neutral">' + output + '</span>'
            return output

    return StatusContext()


def _points_inset_matches(node, spec):
    if node.get("type") == "para":
        prefixes = spec.get("inset_paras") or []
        return int(isinstance(prefixes, list) and any(_starts_with(node.get("text"), prefix) for prefix in prefixes if isinstance(prefix, str)))
    if node.get("type") == "bullets":
        prefixes = spec.get("inset_prefixes") or []
        if not isinstance(prefixes, list):
            return 0
        return sum(any(((item.get("lead") or "") + (item.get("text") or "")).lstrip().startswith(prefix)
                       for prefix in prefixes if isinstance(prefix, str)) for item in node.get("items") or [])
    return 0


def _points_inset(content, spec, ctx, index, tag="div", classes=""):
    classes = (classes + " ct-point-inset" + (" ct-point-inset-yellow" if spec.get("inset_tone") == "yellow" else "")).strip()
    picture = ""
    if "inset_icon" in spec or "inset_icons" in spec:
        mapping = spec.get("inset_icons")
        icon_index = index
        if mapping is None and "inset_icon" in spec:
            mapping, icon_index = [spec["inset_icon"]], 0
        if not isinstance(mapping, (list, dict)):
            _unfinished(ctx, "comp-text 要点卡：卡内便签图标需要显式 inset_icon 或 inset_icons 素材映射，未生成占位。", "asset")
        else:
            value = (mapping[icon_index] if icon_index < len(mapping) else False) if isinstance(mapping, list) else mapping.get(str(icon_index), mapping.get(icon_index, False))
            if value is None or value == "none":
                _unfinished(ctx, "comp-text 要点卡：卡内便签图标的显式映射没有素材，未生成占位。", "asset")
                url = None
            else:
                url = _avatar_url(mapping, icon_index, list(ctx.icons()), ctx, "卡内便签图标")
            if url:
                picture = f'<img class="ct-point-inset-icon deco" aria-hidden="true" alt="" src="{escape(url, quote=True)}">'
                classes += " ct-point-inset-with-icon"
                content = f'<div class="ct-point-inset-copy">{content}</div>'
    return f'<{tag} class="{classes}">{picture}{content}</{tag}>'


def _points_symbol(kind, heading=False):
    if kind not in ("check", "cross", "arrow"):
        return ""
    role = " ct-point-heading-symbol" if heading else ""
    return f'<span class="ct-point-symbol ct-point-symbol-{kind}{role} deco" aria-hidden="true"></span>'


def _points_steps(node, ctx, spec):
    rows = []
    items = node.get("items") or []
    for index, item in enumerate(items):
        payload = " ".join(_text(ctx, value) for value in item["cols"]) if item.get("cols") else f'{_lead(ctx, item.get("lead"))} {_text(ctx, item.get("text"))}'
        circle = " ct-point-number-circle" if spec.get("_points_number_circle") else ""
        body_class = "ct-point-step-body tb"
        if index == 0 and spec.get("_points_button_secondary"):
            body_class += " ct-point-button-secondary"
        if index == len(items) - 1 and spec.get("_points_last_link"):
            body_class += " ct-point-step-last-link"
        rows.append(f'<li class="ct-step"><span class="ct-step-number tb{circle}">{_text(ctx, item.get("n"))}</span><div class="{body_class}">{payload}</div></li>')
    return '<ul class="ct-steps ct-point-vertical-steps">' + ''.join(rows) + '</ul>'


def _points_headed(group, ctx, spec, group_index):
    """按真实条目或分号拆内卡，原字和标点只呈现一次。"""
    ctx = _points_button_context(ctx, spec, group)
    ctx = _points_status_context(ctx, spec, group)
    ctx = _points_corner_context(ctx, spec, group)
    item_cards = bool(spec.get("item_cards") or spec.get("split_clauses"))
    position = spec.get("illustration", "none")
    has_large = position in ("right_inside", "bottom_right_inside") or "illustration_asset" in spec or (position == "top_inside" and "illustrations" in spec)
    if spec.get("_points_header_right"):
        has_large = False
    header_position = spec.get("icon_position")
    if header_position is None and position == "top_inside" and not has_large:
        header_position = "header_top"
    has_header = header_position in ("header_left", "header_top", "header_below", "card_left")
    inset_prefixes = spec.get("inset_prefixes") or []
    inset_paras = spec.get("inset_paras") or []
    split_at = spec.get("split_at")
    fragment_fields = ("inline_tags", "tag_items", "inset_spans", "paragraph_bubbles", "checkbox_items", "paragraph_header_prefix", "warning_paras")
    role_active = spec.get("status_tag") in ("shape_only", "neutral") or spec.get("item_status_dots") or spec.get("commands") == "monospace"
    if not spec.get("_points_custom") and not role_active and not any(spec.get(key) for key in fragment_fields) and not item_cards and not has_large and not has_header and not inset_prefixes and not inset_paras and not split_at and not spec.get("linkrow_buttons") and spec.get("body_tone") != "muted" and not spec.get("inner_columns") and not spec.get("inner_columns_v") and not spec.get("address_style") and not spec.get("button_columns"):
        return _headed(group, ctx, "points")
    first, remaining = group[0], list(group[1:])
    steps = (first.get("items") or []) if first.get("type") == "steps" else []
    step_heading = len(steps) == 1 and bool(steps[0].get("lead")) and not steps[0].get("text") and not steps[0].get("cols")
    para_heading = _points_header_parts(first, spec.get("paragraph_header_prefix"))
    step_left = False
    if first.get("type") in ("card", "group", "h1", "h2", "h3") or step_heading or para_heading:
        if para_heading:
            title = fragment_inline(para_heading[0], ctx, spec)
            if para_heading[1]:
                remaining.insert(0, {"type": "para", "text": para_heading[1]})
        elif step_heading:
            title = _text(ctx, steps[0].get("n")) + " " + _lead(ctx, steps[0].get("lead"))
        else:
            name = first.get("name") if first.get("type") in ("card", "group") else first.get("text")
            title = _text(ctx, name)
        status = _points_status(group, spec, ctx)
        if status:
            title = f'<span class="ct-point-status-title"><span class="tb">{title}</span>{status}</span>'
        symbol = _points_symbol(spec.get("heading_icon"), True)
        if symbol:
            title = f'<span class="ct-point-heading-title">{symbol}<span class="tb">{title}</span></span>'
        head = f'<div class="ct-card-head tb" data-role="name">{title}</div>'
        if has_header:
            header_mapping = spec.get("header_icon", spec.get("icons", "auto"))
            if isinstance(header_mapping, str) and header_mapping not in ("auto", "none"):
                header_mapping = [header_mapping]
            header_source = ctx.illustrations() if spec.get("header_icon_source") == "illustrations" else ctx.icons()
            header_url = _avatar_url(header_mapping, group_index, list(header_source), ctx, "卡头图标")
            if header_url:
                picture = f'<img class="ct-point-header-icon deco" aria-hidden="true" alt="" src="{escape(header_url, quote=True)}">'
                dots = ""
                if _motion_dots_requested(spec) and group_index == 0:
                    from .motion_dots import render_header_icon_motion_dots
                    dots = render_header_icon_motion_dots(header_url, spec["header_icon_motion_dots"], ctx)
                arrow = spec.get("motion_icon_arrow") is True and group_index == 0
                if arrow or dots:
                    picture = _motion_icon_picture(picture, True, arrow, dots)
                top = " ct-point-head-top" if header_position in ("header_top", "header_below") else ""
                head_content = f'<span class="tb" data-role="name">{title}</span>{picture}' if header_position == "header_below" else f'{picture}<span class="tb" data-role="name">{title}</span>'
                head = f'<div class="ct-card-head ct-point-head-with-icon{top}">{head_content}</div>'
                step_left = step_heading and header_position == "header_left"
        if spec.get("_points_header_right"):
            mapping = spec.get("illustration_asset", spec.get("illustrations"))
            if isinstance(mapping, str):
                mapping = [mapping]
            if mapping is None:
                _unfinished(ctx, "comp-text 要点卡：右上卡头图缺显式 illustration_asset，未画空图位。", "asset")
            else:
                url = _avatar_url(mapping, group_index, list(ctx.illustrations()), ctx, "卡头右上图")
                if url:
                    picture = f'<img class="ct-point-header-icon ct-point-header-right-icon deco" aria-hidden="true" alt="" src="{escape(url, quote=True)}">'
                    head = f'<div class="ct-card-head ct-point-head-right"><div class="tb" data-role="name">{title}</div>{picture}</div>'
        if spec.get("header_navigation") == "inline_right" and remaining:
            nav = remaining[0]
            if nav.get("type") == "linkrow" or nav.get("type") == "para" and (re.search(r"〔[^〔〕]+〕", str(nav.get("text") or "")) or MD_LINK_RE.search(str(nav.get("text") or ""))):
                if first.get("type") == "card" and first.get("text"):
                    _unfinished(ctx, "comp-text 要点卡：原首 card 的说明在导航之前，头右导航会改原序，保留正文导航。")
                else:
                    nav_html = _node(remaining.pop(0), ctx)
                    head = head[:-6] + f'<div class="ct-point-header-navigation">{nav_html}</div></div>'
                    head = head.replace('class="ct-card-head ', 'class="ct-card-head ct-point-head-navigation ', 1)
        if first.get("type") == "card" and first.get("text"):
            remaining.insert(0, {"type": "para", "text": first["text"], "_point_subtitle": bool(spec.get("address_style"))})
    else:
        head = ""
        remaining.insert(0, first)
        if has_header:
            _unfinished(ctx, "comp-text 要点卡：卡头左图/上图需要原卡头，首节点不是可完整消费的标题，图位未执行。")
        if spec.get("status_tag") == "shape_only":
            _unfinished(ctx, "comp-text 要点卡：status_tag 需要完整原卡头，保留原字，标题旁标签未执行。")
    if head and spec.get("header_divider") is False:
        head = head.replace('class="ct-card-head', 'class="ct-card-head ct-point-head-no-divider', 1)
    if 'ct-point-corner-tag' in head:
        head = head.replace('class="ct-card-head', 'class="ct-card-head ct-point-head-corner', 1)
    ctx = _points_inline_context(ctx, spec)
    try:
        if ctx.orient == "h":
            columns = max(1, min(4, int(spec.get("inner_columns", 1))))
        else:
            columns = 2 if int(spec.get("inner_columns_v", 1)) == 2 else 1
        offset = max(0, int(spec.get("item_icon_offset", 0)))
    except (TypeError, ValueError):
        columns, offset = 1, 0
    list_cut = None
    list_boundary = spec.get("column_split_after", spec.get("split_after"))
    if not item_cards and list_boundary is not None and ctx.orient == "h":
        matches, ordinal = [], 0
        for node in remaining:
            if node.get("type") != "bullets":
                continue
            for item_index, value in enumerate(node.get("items") or []):
                ordinal += 1
                raw = (value.get("lead") or "") + (value.get("text") or "")
                matched = (list_boundary == ordinal if isinstance(list_boundary, int) and not isinstance(list_boundary, bool)
                           else _starts_with(raw, list_boundary) if isinstance(list_boundary, str) else False)
                if matched:
                    matches.append((node, item_index + 1))
        if columns != 2 or len(matches) != 1 or matches[0][1] == len(matches[0][0].get("items") or []):
            _unfinished(ctx, "comp-text 要点卡：column_split_after 需要两栏及唯一、非末项的原清单边界，保留单栏，指定分栏未执行。")
            columns = 1
        else:
            list_cut = matches[0]
    mapping = spec.get("item_images", spec.get("icons"))
    available = list(ctx.icons()) if mapping is not None else []
    index = 0
    inset_index = spec.get("_points_inset_offset", 0)
    exception_index = 0
    para_index = 0
    pending, parts = [], []

    def flush():
        if pending:
            cls = "ct-point-items" + (" ct-point-separated" if spec.get("_points_separator") else "")
            content = ''.join(pending)
            if spec.get("column_fill") == "column":
                counts = spec.get("column_counts")
                if counts and sum(counts) != len(pending):
                    _unfinished(ctx, "comp-text 要点卡：column_counts 没覆盖当前完整原内卡组，原序保留，逐列分组未执行。")
                else:
                    if not counts:
                        size = (len(pending) + columns - 1) // columns
                        counts = [min(size, len(pending) - start) for start in range(0, len(pending), size)]
                    offset, chunks = 0, []
                    for count in counts:
                        chunks.append('<div class="ct-point-item-column">' + ''.join(pending[offset:offset + count]) + '</div>')
                        offset += count
                    content = ''.join(chunks)
                    cls += " ct-point-items-column"
            parts.append(f'<div class="{cls}" style="--ct-point-columns:{columns}">' + content + '</div>')
            pending.clear()

    def item(content):
        nonlocal index
        url = _avatar_url(mapping, index + offset, available, ctx) if mapping is not None else None
        picture = f'<img class="ct-point-icon deco" aria-hidden="true" alt="" src="{escape(url, quote=True)}">' if url else ""
        if picture and spec.get("motion_icon_arrow") is True and group_index == 0 and index == 0 and not has_header:
            picture = _motion_icon_picture(picture)
        classes = "ct-point-item card" + (" ct-point-with-icon" if url else "")
        symbol = _points_symbol(spec.get("item_icons"))
        if symbol:
            content = f'<div class="ct-point-symbol-row">{symbol}<div class="tb">{content}</div></div>'
        pending.append(f'<section class="{classes}">{picture}<div class="ct-point-text tb">{content}</div></section>')
        index += 1

    for node in remaining:
        para_parts = _para_parts(node, split_at)
        inset_para = node.get("type") == "para" and isinstance(inset_paras, list) and any(
            _starts_with(node.get("text"), prefix) for prefix in inset_paras if isinstance(prefix, str))
        bubble_para = node.get("type") == "para" and any(_starts_with(node.get("text"), prefix) for prefix in spec.get("paragraph_bubbles") or [])
        tag_para = node.get("type") == "para" and spec.get("inline_tags") and _points_has_separator(str(node.get("text") or ""), spec.get("tag_separator"))
        warning_para = node.get("type") == "para" and any(_starts_with(node.get("text"), prefix) for prefix in spec.get("warning_paras") or [])
        if node.get("type") == "para" and spec.get("_points_body_roles"):
            flush()
            role = spec["_points_body_roles"][para_index]
            parts.append(f'<p class="ct-paragraph ct-point-body-{role} tb" data-point-body-role="{role}">{_text(ctx, node.get("text"))}</p>')
            para_index += 1
        elif node.get("type") == "steps" and (spec.get("_points_number_circle") or spec.get("_points_button_secondary") or spec.get("_points_last_link")):
            flush()
            parts.append(_points_steps(node, ctx, spec))
        elif warning_para:
            flush()
            if inset_para or bubble_para or tag_para or para_parts:
                _unfinished(ctx, "comp-text 要点卡：同原提示段还请求其它段落外观，已保留完整提示段，其它段落外观未执行。")
            parts.append('<div class="ct-point-warning"><span class="ct-point-warning-cross deco" aria-hidden="true"></span>' +
                         f'<p class="ct-paragraph tb">{fragment_inline(node.get("text"), ctx, spec)}</p></div>')
        elif node.get("type") == "para" and spec.get("address_style") == "monospace" and re.fullmatch(r'https?://\S+', str(node.get("text") or "")):
            flush()
            parts.append(f'<p class="ct-paragraph ct-point-address tb" data-role="address">{_text(ctx, node.get("text"))}</p>')
        elif spec.get("button_columns") and _points_button_line(node):
            flush()
            payload = _text(ctx, _points_button_line(node))
            # 不让原按钮间空白成为匿名网格项；原可见字仍由局部 ctx 输出一次。
            payload = re.sub(r'(?<=</button>)\s+(?=<button\b)', '', payload)
            payload = re.sub(r'(?<=</a>)\s+(?=<a\b)', '', payload)
            parts.append(f'<div class="ct-point-buttons" style="--ct-point-button-columns:{spec["button_columns"]}">{payload}</div>')
        elif node.get("_point_subtitle"):
            flush()
            parts.append(f'<p class="ct-paragraph ct-point-subtitle tb">{_text(ctx, node.get("text"))}</p>')
        elif tag_para:
            flush()
            content = _points_tag(node, ctx, spec)
            if spec.get("inset_spans") and any(marker in str(node.get("text") or "") for marker in spec["inset_spans"]):
                _unfinished(ctx, "comp-text 要点卡：同原段的标签与局部引文框不能同时消费，已保留标签原字，局部框未执行。")
            parts.append(f'<div class="ct-point-paragraph-bubble">{content}</div>' if bubble_para else content)
        elif para_parts or inset_para or bubble_para or node.get("type") == "para" and spec.get("inset_spans"):
            flush()
            if para_parts:
                count = len(para_parts) if ctx.orient == "h" else 1
                content = f'<div class="ct-point-paras" style="--ct-point-columns:{count}">' + ''.join(
                    f'<p class="ct-paragraph ct-point-para tb">{fragment_inline(value, ctx, spec)}</p>' for value in para_parts) + '</div>'
            else:
                content = f'<p class="ct-paragraph tb">{fragment_inline(node.get("text"), ctx, spec)}</p>'
            if inset_para:
                content = _points_inset(content, spec, ctx, inset_index)
                inset_index += 1
            parts.append(f'<div class="ct-point-paragraph-bubble">{content}</div>' if bubble_para else content)
        elif item_cards and node.get("type") == "bullets" and not spec.get("tag_items") and not spec.get("checkbox_items"):
            for value in node.get("items", []):
                item(f'{_lead(ctx, value.get("lead"))} {_text(ctx, value.get("text"))}')
        elif spec.get("split_clauses") and node.get("type") == "para":
            for clause in re.split(r'(?<=；)', node.get("text", "")):
                if clause.strip():
                    item(_text(ctx, clause))
        else:
            flush()
            if node.get("type") == "linkrow" and spec.get("linkrow_buttons"):
                parts.append(ctx.render({"type": "action_button", "spec": {}, "nodes": [node]}))
            elif node.get("type") == "bullets" and (columns > 1 or isinstance(inset_prefixes, list) and inset_prefixes or spec.get("tag_items") or spec.get("checkbox_items") or spec.get("item_icons") in ("check", "arrow") or spec.get("_points_exception_targets")):
                rows = []
                for value in node.get("items", []):
                    raw = (value.get("lead") or "") + (value.get("text") or "")
                    inset = isinstance(inset_prefixes, list) and any(raw.lstrip().startswith(prefix) for prefix in inset_prefixes if isinstance(prefix, str))
                    cls = "tb"
                    tag_entry = next((entry for entry in spec.get("tag_items") or [] if _starts_with(raw, entry["item_ref"])), None)
                    checked = any(_starts_with(raw, prefix) for prefix in spec.get("checkbox_items") or [])
                    if tag_entry:
                        content = _points_tag({"type": "bullets", "items": [value]}, ctx, spec, tag_entry)
                        cls += " ct-point-tag-row"
                    else:
                        content = f'{_lead(ctx, value.get("lead"))} {_text(ctx, value.get("text"))}'
                    if checked:
                        cls += " ct-point-checkbox-row"
                        content = '<span class="ct-point-checkbox deco" aria-hidden="true"></span><div>' + content + '</div>'
                    symbol = _points_symbol(spec.get("item_icons"))
                    if symbol:
                        cls += " ct-point-symbol-row"
                        content = symbol + '<div class="tb">' + content + '</div>'
                    target_attr = ""
                    if spec.get("_points_exception_targets"):
                        target_attr = f' data-target="{spec["_points_exception_targets"][exception_index]}"'
                        exception_index += 1
                    if inset:
                        rows.append(_points_inset(content, spec, ctx, inset_index, "li", cls))
                        inset_index += 1
                    else:
                        rows.append(f'<li class="{cls}"{target_attr}>{content}</li>')
                if columns > 1 and rows:
                    cut = list_cut[1] if list_cut and list_cut[0] is node else None
                    size = (len(rows) + columns - 1) // columns
                    counts = spec.get("column_counts")
                    if counts and sum(counts) == len(rows):
                        groups, start = [], 0
                        for count in counts:
                            groups.append(rows[start:start + count])
                            start += count
                    else:
                        groups = [rows[:cut], rows[cut:]] if cut else [rows[start:start + size] for start in range(0, len(rows), size)]
                    lists = ''.join('<ul class="ct-list">' + ''.join(items) + '</ul>' for items in groups)
                    parts.append(f'<div class="ct-point-list-columns" style="--ct-point-columns:{columns}">{lists}</div>')
                else:
                    parts.append('<ul class="ct-list">' + ''.join(rows) + '</ul>')
            elif step_heading and node.get("type") == "para" and str(node.get("text") or "").startswith("记录："):
                parts.append(f'<p class="ct-paragraph ct-point-record tb">{_text(ctx, node.get("text"))}</p>')
            else:
                parts.append(_node(node, ctx))
    flush()
    body = '<div class="ct-point-copy">' + ''.join(parts) + '</div>'
    large = None
    if has_large:
        mapping_large = spec.get("illustration_asset", spec.get("illustrations", "auto"))
        if isinstance(mapping_large, str) and mapping_large != "auto":
            mapping_large = [mapping_large]
        large = _avatar_url(mapping_large, group_index, list(ctx.illustrations()), ctx)
    if large:
        image = f'<img class="ct-point-illustration deco" aria-hidden="true" alt="" src="{escape(large, quote=True)}">'
        side = "ct-point-large-top" if position == "top_inside" else "ct-point-large-left" if position == "left_inside" else "ct-point-large-right"
        if position == "bottom_right_inside" or spec.get("illustration_align") == "bottom":
            side += " ct-point-large-bottom"
        body = f'<div class="ct-point-with-large {side}">{body}{image}</div>'
    split_class = " ct-point-split-card" if any(_para_parts(node, split_at) for node in group) else ""
    tone_class = " ct-point-body-muted" if spec.get("body_tone") == "muted" else ""
    step_class = " ct-point-step-left" if step_left else ""
    if header_position == "card_left" and has_header and 'ct-point-header-icon' in head:
        step_class += " ct-point-card-left"
    command_class = " ct-point-commands" if spec.get("commands") == "monospace" else ""
    yellow_class = " ct-point-yellow" if spec.get("tone") == "yellow" else ""
    full_class = " ct-point-full-width" if spec.get("full_width") else ""
    attrs = ' data-equal-height-requested="true"' if spec.get("_points_equal_height") else ""
    if spec.get("_points_step_index") is not None:
        attrs += f' data-step-index="{spec["_points_step_index"]}"'
    if spec.get("source_part"):
        attrs += f' data-source-part="{spec["source_part"]}"'
    source_class = " source-prose" if spec.get("source_body") is True else ""
    if spec.get("source_body") not in (None, False, True):
        _unfinished(ctx, "comp-text 要点卡：source_body 须为布尔值，原文标记未执行。")
    content = f'<section class="ct-card card ct-points-card{split_class}{step_class}{command_class}{yellow_class}{full_class}"{attrs}>{head}<div class="ct-card-body{tone_class}{source_class}">{body}</div></section>'
    if spec.get('_points_equal_height'):
        # 行级字段可写在任一兄弟块上；等整行DOM建好后核实真实父row合同。
        verify = ('<script data-echo>(()=>{const card=document.currentScript.parentElement;'
                  'const check=()=>{if(card.closest(".row.eqh")){delete card.dataset.overlayError}'
                  'else{card.dataset.overlayError="comp-text equal_height 缺已伸展父row"}};'
                  'if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",check,{once:true})}'
                  'else{check()}})();</script>')
        content = content[:-10] + verify + '</section>'
    above = ""
    if position == "above_card" and spec.get("_points_step_index") is not None:
        mapping = spec.get("icons")
        if mapping is None:
            _unfinished(ctx, "comp-text 要点卡：above_card 缺明确 icons 素材源，步骤原字保留。", "asset")
        else:
            url = _avatar_url(mapping, spec["_points_step_index"] - 1, list(ctx.icons()), ctx, "步骤上方图")
            if url:
                above = f'<img class="ct-point-above-icon deco" aria-hidden="true" alt="" src="{escape(url, quote=True)}">'
    arrow = '<span class="ct-point-connector-arrow deco" aria-hidden="true"></span>' if spec.get("_points_next_arrow") else ""
    return '<div class="ct-point-step-unit">' + above + content + arrow + '</div>' if above or arrow or spec.get("_points_step_index") is not None else content


def _points_button_context(ctx, spec, nodes):
    """Load the existing scoped-button API only for original where-defined buttons."""
    screen = getattr(ctx, "screen", {})
    buttons = screen.get("buttons", []) if isinstance(screen, dict) else getattr(screen, "buttons", [])
    labels = {item.get("text") for item in buttons or [] if item.get("where")}
    if not labels:
        return ctx
    def requested(value):
        if isinstance(value, str):
            return any((match.group(1) or match.group(2)) in labels
                       for match in re.finditer(r"［([^［］]+)］|【([^【】]+)】", value))
        if isinstance(value, dict):
            return any(requested(part) for part in value.values())
        if isinstance(value, (list, tuple)):
            return any(requested(part) for part in value)
        return False
    if not requested(nodes):
        return ctx
    from importlib import import_module
    try:
        module = import_module("components_comp-slots.controls")
    except ImportError as error:
        _unfinished(ctx, f"comp-text 要点卡：卡局部按钮控件未载入（{error}），where 复制行为未执行。")
        return ctx
    return module.button_context(ctx, spec, nodes)


def _para_parts(node, boundary):
    """Exact raw fragments mark the beginning of following paragraph columns."""
    if node.get("type") != "para" or not boundary:
        return None
    markers = [boundary] if isinstance(boundary, str) else boundary
    if not isinstance(markers, list) or not markers or any(not isinstance(value, str) or not value for value in markers):
        return None
    text = node.get("text") or ""
    if any(text.count(marker) != 1 for marker in markers):
        return None
    cuts = [text.index(marker) for marker in markers]
    if cuts[0] == 0 or cuts != sorted(set(cuts)):
        return None
    spans = re.finditer(r"\*\*.*?\*\*|`[^`]+`|[〔【［][^〔〕【】［］]+[〕】］]", text)
    if any(span.start() < cut < span.end() for span in spans for cut in cuts):
        return None
    edges = [0] + cuts + [len(text)]
    return [text[start:end] for start, end in zip(edges, edges[1:])]


def render_points_card(block, ctx):
    spec = block.get("spec") or {}
    nodes = block.get("nodes") or []
    spec = _points_spec_compat(spec, nodes, ctx)
    spec = _points_fragment_spec(spec, nodes, ctx)
    spec = _points_corner_spec(spec, nodes, ctx)
    spec = _points_role_spec(spec, nodes, ctx)
    if spec.get('address_style') not in (None, '', 'normal', 'monospace'):
        _unfinished(ctx, 'comp-text 要点卡：address_style 只支持 normal/monospace，保留原文与普通正文角色。')
        spec['address_style'] = None
    if spec.get('address_style') == 'monospace' and not any(
            node.get('type') == 'para' and re.fullmatch(r'https?://\S+', str(node.get('text') or '')) for node in nodes):
        _unfinished(ctx, 'comp-text 要点卡：address_style 找不到完整纯地址原段，灰等宽地址条未执行。')
    if spec.get('button_columns') is not None and spec.get('button_columns') is not False:
        count = spec['button_columns']
        if not isinstance(count, int) or isinstance(count, bool) or not 1 <= count <= 6:
            _unfinished(ctx, 'comp-text 要点卡：button_columns 必须为1至6的整数，保留原按钮顺序。')
            spec['button_columns'] = None
        elif not any(_points_button_line(node) for node in nodes):
            _unfinished(ctx, 'comp-text 要点卡：button_columns 找不到只含原按钮的原段，按钮网格未执行。')
    if "paragraph_header_prefix" in spec:
        groups = [nodes] if spec.get("whole_block") and nodes else _groups(nodes, spec.get("split_cards", True))
        if sum(bool(_points_header_parts(group[0], spec["paragraph_header_prefix"])) for group in groups) != 1:
            _unfinished(ctx, "comp-text 要点卡：paragraph_header_prefix 需要唯一首段的完整原粗体前缀，卡头提升未执行。")
            spec["paragraph_header_prefix"] = None
        else:
            first = next(group[0] for group in groups if _points_header_parts(group[0], spec["paragraph_header_prefix"]))
            head, rest = _points_header_parts(first, spec["paragraph_header_prefix"])
            crossing = any(marker in first["text"] and marker not in head and marker not in rest for marker in spec.get("inset_spans") or [])
            bubble = any(_starts_with(first["text"], prefix) for prefix in spec.get("paragraph_bubbles") or [])
            if crossing or bubble:
                _unfinished(ctx, "comp-text 要点卡：paragraph_header_prefix 与同原段的局部引文或气泡切口冲突，保留完整原段，卡头提升未执行。")
                spec["paragraph_header_prefix"] = None
    if spec.get("item_cards") and (spec.get("tag_items") or spec.get("checkbox_items")):
        _unfinished(ctx, "comp-text 要点卡：item_cards 与指定标签/勾选清单同时请求，已保留普通原清单，内卡未执行。")
    if ctx.orient == "v" and "inner_columns_v" in spec:
        value = spec["inner_columns_v"]
        if isinstance(value, bool) or str(value) not in ("1", "2"):
            _unfinished(ctx, "comp-text 要点卡：inner_columns_v 只支持明确1或2，保留竖版单栏，指定列数未执行。")
            spec = dict(spec, inner_columns_v=1)
    if spec.get("body_tone") not in (None, "muted"):
        _unfinished(ctx, "comp-text 要点卡：body_tone 只支持 muted，保留默认正文颜色。")
    boundary = spec.get("split_at")
    if boundary and sum(_para_parts(node, boundary) is not None for node in nodes) != 1:
        _unfinished(ctx, "comp-text 要点卡：split_at 没有唯一匹配的原段内边界，保留原段，分栏未执行。")
        spec = dict(spec, split_at=None)
    if spec.get("split_at") and spec.get("inset_spans"):
        for node in nodes:
            parts = _para_parts(node, spec["split_at"])
            if parts and any(marker in str(node.get("text") or "") and not any(marker in part for part in parts) for marker in spec["inset_spans"]):
                _unfinished(ctx, "comp-text 要点卡：split_at 切入指定局部引文，已保留完整原段及局部框，分栏未执行。")
                spec["split_at"] = None
    inset_paras = spec.get("inset_paras") or []
    if inset_paras:
        prefixes = inset_paras if isinstance(inset_paras, list) else [inset_paras]
        for prefix in prefixes:
            if not isinstance(inset_paras, list) or not isinstance(prefix, str) or not any(
                    node.get("type") == "para" and _starts_with(node.get("text"), prefix) for node in nodes):
                _unfinished(ctx, "comp-text 要点卡：inset_paras 的指定原段不在本块，卡内说明未执行；须由页规格把该原段分配到同一 points_card。")
    groups = None
    if spec.get("split_paras"):
        groups = [[node] for node in nodes]
    paginated = bool(spec.get("item_pages") and ctx.orient == "v")
    if paginated:
        groups = _source_pages(nodes, spec["item_pages"], ctx)
        paginated = groups is not None
    shell_spec = dict(spec)
    shell_spec.pop("item_pages", None)
    shell = dict(block, spec=shell_spec)
    inset_offset = 0
    def point_group(group, index):
        nonlocal inset_offset
        page_spec = dict(spec)
        page_spec["_points_inset_offset"] = inset_offset
        inset_offset += sum(_points_inset_matches(node, spec) for node in group)
        if paginated and index:
            page_spec["icon_position"] = "none"
            page_spec["item_icon_offset"] = int(spec.get("item_icon_offset", 0)) + sum(spec["item_pages"][:index])
            if not isinstance(spec.get("illustration_asset", spec.get("illustrations")), (list, dict)):
                page_spec.pop("illustration_asset", None)
                page_spec.pop("illustrations", None)
                page_spec["illustration"] = "none"
        content = _points_headed(group, ctx, page_spec, index)
        if paginated and index:
            content = content.replace('<section ', '<section data-page-break-before="true" ', 1)
        return content
    rendered = _shell("points_card", shell, ctx, point_group, groups)
    if _step_ports_ready(spec, ctx):
        pending = ' data-step-ports-layout-pending="true" data-incomplete="comp-text 工程10：原例外挂位、唯一安全切口与五线路由尚待脚本完整核验。"'
        rendered = rendered.replace('<div ', '<div' + pending + ' ', 1)
    if spec.get("motion_icon_arrow") is True and 'data-motion-icon-arrow="true"' not in rendered:
        _unfinished(ctx, "comp-text 要点卡：motion_icon_arrow缺第一卡头或第一条目的现有图标位，未向其它条目顺移或另造位置。")
    if _motion_dots_requested(spec) and 'class="ct-header-icon-motion-dot"' not in rendered:
        _unfinished(ctx, "comp-text 要点卡：header_icon_motion_dots未产生匹配的首卡头图内标记；须原卡头图位及同指纹资产，不另造位置。")
    return _attach_step_ports(rendered, spec, ctx)


def _avatar_url(mapping, index, available, ctx, role="头像"):
    """Only explicit mappings select images; preserve available URLs verbatim."""
    if mapping == "auto":
        value = index
    elif isinstance(mapping, list):
        if index >= len(mapping):
            _unfinished(ctx, f"comp-text 对话：{role} {index} 的映射缺项，未生成空占位。", "asset")
            return None
        value = mapping[index]
    elif isinstance(mapping, dict):
        if str(index) not in mapping and index not in mapping:
            _unfinished(ctx, f"comp-text 对话：{role} {index} 的映射缺项，未生成空占位。", "asset")
            return None
        value = mapping.get(str(index), mapping.get(index))
    else:
        return None
    if value is None or value == "none":
        return None
    if isinstance(value, int) and not isinstance(value, bool):
        if 0 <= value < len(available):
            return available[value]
    elif isinstance(value, str):
        for url in available:
            filename = Path(unquote(urlsplit(url).path)).name
            if value == url or value == filename:
                return url
        # Explicit local paths may point to an avatar not present in the icon manifest.
        path = value
        if value.startswith("file:"):
            path = unquote(urlsplit(value).path)
            if len(path) > 2 and path[0] == "/" and path[2] == ":":
                path = path[1:]
        elif "://" in value:
            _unfinished(ctx, f"comp-text 对话：{role} {index} 不是本地素材，未加载。", "asset")
            return None
        elif callable(getattr(ctx, "resolve", None)):
            path = ctx.resolve(value)
        if Path(path).is_file():
            return ctx.asset_url(path)
    _unfinished(ctx, f"comp-text 对话：{role} {index} 的显式映射未找到素材，未生成空占位。", "asset")
    return None


def _dialogue_assets(spec, ctx):
    mapping = spec.get("avatars", spec.get("icons"))
    right_mapping = spec.get("right_images")
    def available(value, source):
        if value is None or value == "none":
            return []
        if source == "illustrations":
            return list(ctx.illustrations())
        return list(ctx.icons())
    # Main illustrations are never guessed as people; the source must be explicit.
    return (mapping, available(mapping, spec.get("avatar_source", "icons")),
            right_mapping, available(right_mapping, spec.get("right_image_source", "icons")))


def _dialogue_annotation_spec(spec, nodes, ctx):
    """Only an explicit, unique complete source suffix may leave its own bubble."""
    requested = spec.get("annotation_spans")
    position = spec.get("annotation_position")
    if requested is None and position in (None, "", "none"):
        return spec
    spec["_dialogue_annotations"] = {}
    if position != "below" or not isinstance(requested, list) or not requested:
        _unfinished(ctx, "comp-text 对话：泡下括注须同时指定annotation_position:below和非空annotation_spans原括注列表，保留原文。")
        return spec
    values, eligible, source_values = [], [], []
    for node in nodes:
        kind = node.get("type")
        if node.get("src"):
            source_values.append("\n".join(str(line) for line in node["src"]))
        else:
            source_values.extend(str(node.get(key) or "") for key in ("name", "text"))
            source_values.extend(str(item.get(key) or "") for item in node.get("items") or []
                                 for key in ("lead", "num", "text"))
        if kind in ("para", "card"):
            value = str(node.get("text") or "")
            values.append(value)
            if kind == "para" and spec.get("split_paras"):
                eligible.extend(line for line in value.splitlines() if line.strip())
        elif kind == "bullets":
            texts = [str(item.get("text") or "") for item in node.get("items") or []]
            values.extend(texts)
            if spec.get("split_items"):
                eligible.extend(texts)
    if not (spec.get("split_items") or spec.get("split_paras")):
        groups = [nodes] if spec.get("whole_block") and nodes else _groups(nodes, spec.get("split_cards", True))
        eligible = [str(group[-1].get("text") or "") for group in groups
                    if group and group[-1].get("type") in ("para", "card")]
    selected, valid = {}, True
    for marker in requested:
        complete = isinstance(marker, str) and len(marker) >= 2 and (marker[0], marker[-1]) in (("（", "）"), ("(", ")"))
        if complete:
            depth = 0
            for index, char in enumerate(marker):
                if char == marker[0]:
                    depth += 1
                elif char == marker[-1]:
                    depth -= 1
                if depth < 0 or depth == 0 and index < len(marker) - 1:
                    complete = False
                    break
            complete = complete and depth == 0
        matches = [value for value in eligible if isinstance(marker, str) and marker and value.endswith(marker)]
        if (not complete or sum(value.count(marker) for value in source_values) != 1 or
                sum(value.endswith(marker) for value in values) != 1 or
                len(matches) != 1 or matches[0] in selected):
            _unfinished(ctx, "comp-text 对话：annotation_spans须唯一匹配同一原气泡末尾的完整括注，保留原文，泡下小字未执行。")
            valid = False
            continue
        value = matches[0]
        start = len(value) - len(marker)
        if not _points_safe_edges(value, (start, len(value))):
            _unfinished(ctx, "comp-text 对话：annotation_spans切入原行内记号，保留原文，泡下小字未执行。")
            valid = False
            continue
        insets = spec.get("inset_spans") or []
        if isinstance(insets, list) and any(isinstance(inset, str) and inset and inset in value and
                value.index(inset) < len(value) and value.index(inset) + len(inset) > start for inset in insets):
            _unfinished(ctx, "comp-text 对话：annotation_spans与inset_spans原片段重叠，保留泡内原文和原引文框，泡下小字未执行。")
            valid = False
            continue
        selected[value] = marker
    if valid:
        spec["_dialogue_annotations"] = selected
    return spec


def _dialogue_fragment_spec(block, ctx):
    spec = dict(block.get("spec") or {})
    if "bubble_per_item" in spec:
        if isinstance(spec["bubble_per_item"], bool):
            if spec["bubble_per_item"]:
                spec["split_items"] = True
        else:
            _unfinished(ctx, "comp-text 对话：bubble_per_item需要布尔值，保留原节点。")
    if "bubble_columns" in spec:
        value = spec["bubble_columns"]
        if isinstance(value, int) and not isinstance(value, bool) and 1 <= value <= 6:
            spec["columns_v" if ctx.orient == "v" else "columns"] = value
            spec["split_paras"] = True
        else:
            _unfinished(ctx, "comp-text 对话：bubble_columns须为1至6整数，保留原泡顺序。")
    layout = spec.get("items_layout")
    if layout is not None:
        if not isinstance(layout, dict):
            _unfinished(ctx, "comp-text 对话：items_layout须为布局对象，保留原节点。")
        else:
            known = {"order", "rows", "speech_bubble", "speaker_side", "keep_quotes"}
            for key in layout:
                if key not in known:
                    _unfinished(ctx, f"comp-text 对话：items_layout.{key}尚无执行合同，原字保留。")
            if layout.get("speech_bubble") is True:
                spec["split_items"] = True
                spec["split_paras"] = True
            elif layout.get("speech_bubble") not in (None, False):
                _unfinished(ctx, "comp-text 对话：speech_bubble须为布尔值，保留原节点。")
            if layout.get("order") == "column-major":
                spec["flow"] = "column"
            elif layout.get("order") not in (None, "row-major"):
                _unfinished(ctx, "comp-text 对话：order仅支持column-major/row-major，保留原顺序。")
            if "rows" in layout:
                counts = layout["rows"]
                if isinstance(counts, list) and counts and all(isinstance(n, int) and not isinstance(n, bool) and n > 0 for n in counts):
                    spec["_dialogue_column_counts"] = list(counts)
                    spec["rows"] = max(counts)
                else:
                    _unfinished(ctx, "comp-text 对话：items_layout.rows须为各列正整数泡数，保留原顺序。")
            if "speaker_side" in layout:
                if layout["speaker_side"] in ("left", "right"):
                    spec["_dialogue_speaker_side"] = layout["speaker_side"]
                else:
                    _unfinished(ctx, "comp-text 对话：speaker_side只支持left/right，保留原泡顺序。")
            if "keep_quotes" in layout and layout["keep_quotes"] is not True:
                _unfinished(ctx, "comp-text 对话：keep_quotes只能保留全部原引号，原字不删。")
    if "speaker_role" in spec and spec["speaker_role"] not in ("ai", "self"):
        _unfinished(ctx, "comp-text 对话：speaker_role只支持ai/self，保留原内容和已有图位。")
    if "secondary_illustration" in spec:
        if spec["secondary_illustration"] == "right_inside":
            spec.setdefault("right_images", "auto")
            spec.setdefault("right_image_source", "illustrations")
        elif spec["secondary_illustration"] not in (None, "none"):
            _unfinished(ctx, "comp-text 对话：secondary_illustration只支持right_inside，原图位保留。")
    if spec.get("paragraph_bubbles") is True:
        spec["split_paras"] = True
    if "container" in spec:
        if spec["container"] in ("alternative_card", "conversation_card"):
            spec["split_paras"] = True
        elif spec["container"] not in (None, "", "none"):
            _unfinished(ctx, "comp-text 对话：container仅支持alternative_card/conversation_card共享外卡，原字保留。")
    requested = spec.get("inset_spans")
    if requested is not None:
        values = []
        for node in block.get("nodes") or []:
            if node.get("type") in ("para", "card"):
                values.append(str(node.get("text") or ""))
            elif node.get("type") == "bullets":
                values.extend(str(item.get("text") or "") for item in node.get("items") or [])
        if not isinstance(requested, list) or not requested or any(not isinstance(marker, str) or not marker or sum(value.count(marker) for value in values) != 1 for marker in requested):
            _unfinished(ctx, "comp-text 对话：inset_spans须唯一匹配本块完整原文片段，保留全部原字，局部引文未执行。")
            spec["inset_spans"] = []
        spec["_points_fragments_checked"] = True
    if spec.get("row_counts") and spec.get("last_full_width") and isinstance(spec["row_counts"], list) and spec["row_counts"][-1] != 1:
        _unfinished(ctx, "comp-text 对话：末行row_counts多泡与last_full_width单泡整宽冲突，采用明确row_counts。")
        spec["last_full_width"] = False
    return _dialogue_annotation_spec(spec, block.get("nodes") or [], ctx)


def _dialogue_node(node, ctx, spec):
    if spec.get("inset_spans") and node.get("type") in ("para", "card"):
        text = fragment_inline(node.get("text"), ctx, spec)
        lead = _lead(ctx, node.get("name")) + " " if node.get("type") == "card" else ""
        return f'<p class="ct-paragraph tb">{lead}{text}</p>'
    return _node(node, ctx)


def _dialogue_annotation(value, spec):
    value = str(value or "")
    marker = spec.get("_dialogue_annotations", {}).get(value)
    return (value[:-len(marker)], marker) if marker else (value, "")


def _dialogue_turn(content, spec, index, ctx, assets, annotation=""):
    sides = spec.get("sides") or []
    side = sides[index] if isinstance(sides, list) and index < len(sides) else spec.get("_dialogue_speaker_side", "left")
    side = "right" if side == "right" else "left"
    tail = " ct-tail" if spec.get("tail", True) else ""
    position = spec.get("avatar_position", spec.get("icon_position", spec.get("speaker_position", spec.get("illustration", "outside-left"))))
    positions = {"outside-left": "left", "outside_left": "left", "left_outside": "left",
                 "left_inside": "left", "outside-right": "right", "outside_right": "right",
                 "right_outside": "right", "right_inside": "right", "bottom_inside": "bottom"}
    image_side = side if position == "outside" else positions.get(position)
    mapping, available, right_mapping, right_available = assets
    avatar = _avatar_url(mapping, index, available, ctx) if image_side else None
    right_image = _avatar_url(right_mapping, index, right_available, ctx, "右图")
    portrait = f'<img class="ct-avatar deco" aria-hidden="true" alt="" src="{escape(avatar, quote=True)}">' if avatar else ""
    right = f'<img class="ct-dialogue-right-image deco" aria-hidden="true" alt="" src="{escape(right_image, quote=True)}">' if right_image else ""
    classes = "ct-dialogue-turn"
    if spec.get("speaker_role") in ("ai", "self"):
        classes += " ct-speaker-" + spec["speaker_role"]
    if avatar:
        classes += f" ct-with-avatar ct-image-{image_side}"
    if right_image:
        classes += " ct-with-right-image"
    if annotation:
        classes += " ct-dialogue-has-annotation"
    if spec.get("compact"):
        classes += " ct-dialogue-compact"
        maximum = spec.get("max_width", "85%")
        if not (isinstance(maximum, str) and re.fullmatch(r'(?:[1-9]\d?|100)%', maximum)):
            _unfinished(ctx, "comp-text 对话：max_width须为1%至100%的明确百分比，采用85%。")
            maximum = "85%"
    tones = spec.get("bubble_tones")
    tone = tones[index] if isinstance(tones, list) and index < len(tones) else spec.get("bubble_tone", "green")
    if tone not in ("green", "white"):
        _unfinished(ctx, f"comp-text 对话：不支持bubble_tone={tone}，原字保留并采用绿色。")
    tone_class = " ct-bubble-white" if tone == "white" else ""
    bubble = f'<section class="ct-card card ct-bubble ct-side-{side}{tail}{tone_class}">{content}</section>'
    # The DOM keeps text once; CSS positions images without a generated label.
    body = portrait + bubble if image_side == "left" else bubble + portrait
    if spec.get("compact"):
        # 变量放在内泡，外层仍保留原来的网格定位style。
        body = body.replace('<section class="ct-card card ct-bubble', f'<section style="--ct-bubble-max-width:{maximum}" class="ct-card card ct-bubble', 1)
    note = f'<p class="ct-dialogue-annotation tb">{_text(ctx, annotation)}</p>' if annotation else ""
    return classes, body + right + note


def _dialogue_items(block, ctx):
    spec = block.get("spec") or {}
    try:
        key = "columns_v" if ctx.orient == "v" else "columns"
        value = spec.get(key, 1)
        columns = int(value)
        if isinstance(value, bool) or str(columns) != str(value) or not 1 <= columns <= 6:
            raise ValueError
    except (TypeError, ValueError):
        _unfinished(ctx, "comp-text 对话：气泡列数须为1至6整数，保留单列与原顺序。")
        columns = 1
    orientation = "v" if ctx.orient == "v" else "h"
    align = "center" if spec.get("align") == "center" else "left"
    assets = _dialogue_assets(spec, ctx)
    entries, index = [], 0
    for node in block.get("nodes") or []:
        kind = node.get("type")
        if kind in ("group", "h1", "h2", "h3"):
            value = node.get("name") if kind == "group" else node.get("text")
            entries.append(("ct-card-head ct-dialogue-label tb", _text(ctx, value), False))
        elif kind == "para" and not entries and spec.get("split_items") and len(str(node.get("text") or "")) <= 24 and str(node.get("text") or "").rstrip().endswith((":", "：")):
            entries.append(("ct-card-head ct-dialogue-label tb", _text(ctx, node.get("text")), False))
        elif kind == "bullets" and spec.get("split_items"):
            for item in node.get("items") or []:
                # The item has no generated bullet/number/role; original lead and text stay once.
                main, annotation = _dialogue_annotation(item.get("text"), spec)
                text = fragment_inline(main, ctx, spec) if spec.get("inset_spans") else _text(ctx, main)
                content = f'<p class="ct-paragraph tb">{_lead(ctx, item.get("lead"))} {text}</p>'
                classes, body = _dialogue_turn(content, spec, index, ctx, assets, annotation)
                entries.append((classes, body, True))
                index += 1
        elif kind == "para" and spec.get("split_paras"):
            # API v2 emits one para per line; also accept an upstream multiline para.
            for text in str(node.get("text") or "").splitlines():
                if not text.strip():
                    continue
                main, annotation = _dialogue_annotation(text, spec)
                classes, body = _dialogue_turn(_dialogue_node({"type": "para", "text": main}, ctx, spec), spec, index, ctx, assets, annotation)
                entries.append((classes, body, True))
                index += 1
        else:
            entries.append(("ct-dialogue-rest", _dialogue_node(node, ctx, spec), False))
    column_flow = orientation == "h" and columns > 1 and spec.get("flow") == "column"
    counts = spec.get("_dialogue_column_counts") if column_flow else None
    column_positions = None
    if counts:
        runs = sum(turn and (i == 0 or not entries[i-1][2]) for i, (_, _, turn) in enumerate(entries))
        if len(counts) != columns or sum(counts) != index or runs != 1:
            _unfinished(ctx, "comp-text 对话：各列泡数必须覆盖一段连续原泡且列数一致，保留原顺序。")
        else:
            column_positions = [(column + 1, row + 1) for column, count in enumerate(counts) for row in range(count)]
    row_counts = spec.get("row_counts") if orientation == "h" else None
    explicit_rows = None
    if row_counts is not None:
        runs, in_run = 0, False
        for _, _, turn in entries:
            if turn and not in_run:
                runs += 1
            in_run = turn
        valid = isinstance(row_counts, list) and row_counts and all(isinstance(n, int) and not isinstance(n, bool) and 1 <= n <= 6 for n in row_counts)
        if not valid or sum(row_counts) != index or runs != 1:
            _unfinished(ctx, "comp-text 对话：row_counts须对应一段连续气泡且正整数行数合计等于原条数，保留原顺序与默认列数。")
        else:
            columns = lcm(*row_counts)
            explicit_rows = [(row_index, item_column * (columns // count) + 1, columns // count)
                             for row_index, count in enumerate(row_counts) for item_column in range(count)]
            column_flow = False
    parts, start, row = [], 0, 1
    row_base, turn_index = None, 0
    while start < len(entries):
        end = start + 1
        if column_flow and entries[start][2]:
            while end < len(entries) and entries[end][2]:
                end += 1
            try:
                rows = max(1, int(spec.get("rows", 1)))
            except (TypeError, ValueError):
                rows = 1
            rows = max(rows, (end - start + columns - 1) // columns)
        else:
            rows = 1
        for offset, (classes, body, turn) in enumerate(entries[start:end]):
            style = ""
            if explicit_rows is not None:
                if turn:
                    if row_base is None:
                        row_base = row
                    item_row, item_column, span = explicit_rows[turn_index]
                    style = f' style="grid-row:{row_base + item_row};grid-column:{item_column} / span {span}"'
                    row = max(row, row_base + item_row + 1)
                    turn_index += 1
                else:
                    style = f' style="grid-column:1 / -1;grid-row:{row}"'
            elif column_flow:
                if turn and column_positions is not None:
                    col, item_row = column_positions[offset]
                    placement = f"grid-column:{col};grid-row:{row + item_row - 1}"
                else:
                    placement = f"grid-column:{offset // rows + 1};grid-row:{row + offset % rows}" if turn else f"grid-column:1 / -1;grid-row:{row}"
                style = f' style="{placement}"'
            if turn and spec.get("last_full_width") and index > 0 and sum(1 for _, _, t in entries[:start + offset + 1] if t) == index:
                classes += " ct-dialogue-last-wide"
            parts.append(f'<div class="{classes}"{style}>{body}</div>')
        if explicit_rows is None or not entries[start][2]:
            row += rows
        start = end
    classes = f"c-text ct-dialogue ct-dialogue-split ct-{orientation} ct-align-{align}"
    flow_class = " ct-dialogue-flow-column" if column_flow else ""
    content = "".join(parts)
    return f'<div class="{classes}" data-comp="dialogue"><section class="ct-card card ct-dialogue-frame"><div class="ct-dialogue-items{flow_class}" style="--ct-dialogue-columns:{columns}">{content}</div></section></div>'


def render_dialogue(block, ctx):
    spec = _dialogue_fragment_spec(block, ctx)
    block = dict(block, spec=spec)
    if spec.get("split_items") or spec.get("split_paras"):
        return _dialogue_items(block, ctx)
    assets = _dialogue_assets(spec, ctx)
    def turn(group, index):
        annotation = ""
        if group and group[-1].get("type") in ("para", "card"):
            main, annotation = _dialogue_annotation(group[-1].get("text"), spec)
            if annotation:
                group = group[:-1] + [dict(group[-1], text=main)]
        classes, body = _dialogue_turn("".join(_dialogue_node(node, ctx, spec) for node in group), spec, index, ctx, assets, annotation)
        # Keep the old shell and bubble markup when there are no mapped images.
        return f'<div class="{classes}">{body}</div>' if "ct-with-" in classes or "ct-speaker-" in classes or annotation else body
    return _shell("dialogue", block, ctx, turn)

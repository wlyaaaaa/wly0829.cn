"""表格组件：COMPONENTS-API V2，横版内容列宽、竖版逐行卡片。"""

import math
import html
import os
import re
import unicodedata

CSS = "style.css"


def _units(text):
    """只估算排版宽度，输出仍逐字经 ctx.inline。"""
    text = re.sub(r"\*\*|[〔〕【】`]|<br\s*/?>", "", text)
    return sum(1 if unicodedata.east_asian_width(ch) in "WF" else .55
               for ch in text)


def column_percentages(header, rows, count):
    """按列的表头和典型/最长内容分配空间；极长行不独占整表。"""
    weights = []
    for col in range(count):
        lengths = sorted(_units(row[col]) if col < len(row) else 0
                         for row in rows)
        label = _units(header[col]) if header and col < len(header) else 0
        typical = lengths[int((len(lengths) - 1) * .8)] if lengths else 0
        peak = lengths[-1] if lengths else 0
        weights.append(math.sqrt(max(1, label, typical * .7 + peak * .3)))
    # 每列保留最低份额，剩余份额按内容分配，结果严格合计 100%。
    floor = min(12, 50 / count)
    remainder = 100 - floor * count
    total = sum(weights)
    return [floor + remainder * weight / total for weight in weights]


def _table(node, ctx, spec):
    header = node.get("header")
    rows = node.get("rows") or []
    if ctx.orient not in ("h", "v"):
        raise ValueError(f"未知表格方向：{ctx.orient!r}")
    cells = ([header] if header is not None else []) + list(rows)
    if any(not isinstance(row, (list, tuple)) for row in cells):
        raise TypeError("表格的 header 和 rows 必须是单元格列表")
    if any(not isinstance(text, str) for row in cells for text in row):
        raise TypeError("表格单元格必须是定稿字符串")
    count = max((len(row) for row in cells), default=0)
    if not count:
        ctx.warn("空表格没有可见定稿文字")
        return '<div class="c-table" data-comp="table"></div>'
    if any(len(row) != count for row in cells):
        ctx.warn("表格列数不齐：保留所有原字，缺列只留空；请检查原文解析")
    align = node.get("align") or []
    icons = None
    if "icons" in spec and spec["icons"] != "none":
        declared = spec["icons"]
        if isinstance(declared, list) and len(declared) == len(rows) and all(isinstance(path, str) for path in declared):
            icons = ctx.take_icons(len(rows), spec)
            if len(icons) != len(rows) or any(not os.path.isfile(ctx.resolve(path)) for path in declared):
                icons = None
        if icons is None:
            ctx.incomplete("table icons 需要每行一个存在的素材；保留全部表格原文", "asset")

    def cell(text, tag, col, row=None):
        alignment = align[col] if col < len(align) else "left"
        if alignment not in ("left", "center", "right"):
            alignment = "left"
        attrs = f'class="tb table-cell table-{alignment}" data-table-col="{col}"'
        attrs += ' data-table-header="true"' if row is None else f' data-table-row="{row}"'
        if tag == "th":
            attrs += ' scope="col"'
        content = ctx.inline(text)
        if icons and row is not None and col == 0:
            content = (f'<span class="table-row-icon-text"><img class="table-row-icon" '
                       f'src="{html.escape(icons[row], quote=True)}" alt=""><span class="table-row-icon-label">'
                       f'{content}</span></span>')
        return f'<{tag} {attrs}>{content}</{tag}>'

    parts = [f'<div class="c-table" data-comp="table" data-orient="{ctx.orient}" '
             f'style="--table-min-font:{float(ctx.min_font):g}px">']
    if ctx.orient == "h":
        parts.append('<div class="table-frame"><table class="table-grid"><colgroup>')
        parts.extend(f'<col style="width:{width:.8f}%">'
                     for width in column_percentages(header, rows, count))
        parts.append('</colgroup>')
        if header is not None:
            parts.append('<thead><tr>')
            parts.extend(cell(header[col] if col < len(header) else "", "th", col)
                         for col in range(count))
            parts.append('</tr></thead>')
        parts.append('<tbody>')
        for row, values in enumerate(rows):
            parts.append('<tr data-table-safe-row>')
            parts.extend(cell(values[col] if col < len(values) else "", "td", col, row)
                         for col in range(count))
            parts.append('</tr>')
        parts.append('</tbody></table></div>')
    else:
        # 表头原字完整显示一次；其后卡内列名、冒号属于指定的重复标签。
        if header is not None:
            parts.append('<div class="table-header">')
            parts.extend(cell(text, "span", col) for col, text in enumerate(header))
            parts.append('</div>')
        for row, values in enumerate(rows):
            parts.append(f'<article class="table-card card" data-table-card="{row}">')
            first = values[0] if values else ""
            parts.append(f'<div class="table-head">{cell(first, "div", 0, row)}</div>')
            for col in range(1, count):
                value = values[col] if col < len(values) else ""
                parts.append('<div class="table-field">')
                if header and col < len(header) and header[col]:
                    parts.append('<span class="table-label tb" data-echo>'
                                 + ctx.inline(header[col]) + ctx.inline("：") + '</span>')
                parts.append(cell(value, "div", col, row))
                parts.append('</div>')
            parts.append('</article>')
    parts.append('</div>')
    return ''.join(parts)


def render_table(block, ctx):
    """保持块内定稿节点顺序；表格以外的节点交给 ctx.render。"""
    mapping = {"h1": "chapter_title", "h2": "chapter_title", "h3": "section_heading",
               "card": "content_card", "bullets": "bullet_list", "steps": "numbered_steps",
               "stats": "stat_card", "linkrow": "action_button", "now": "live_strip",
               "code": "monospace", "legend": "status_legend", "para": "prose"}
    parts = []
    for node in block["nodes"]:
        if node["type"] == "table":
            parts.append(_table(node, ctx, block.get("spec") or {}))
        elif node["type"] == "group":
            parts.append('<div class="c-table" data-comp="table">'
                         f'<div class="table-caption tb">{ctx.inline(node["name"])}</div></div>')
        else:
            parts.append(ctx.render({"type": mapping.get(node["type"], node["type"]),
                                     "nodes": [node], "spec": {}}))
    if len(block["nodes"]) == 1 and block["nodes"][0]["type"] == "table":
        return ''.join(parts)
    return ('<div class="c-table" data-comp="table">' + ''.join(parts) + '</div>')


COMPONENTS = {"table": render_table}

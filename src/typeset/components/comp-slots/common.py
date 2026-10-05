"""本族共享的小型节点排字器；只转换定稿节点，不补造可见文字。"""
from __future__ import annotations

import html
from collections.abc import Mapping


def spec_of(block):
    return block.get("spec", {}) or {}


def screen_value(ctx, key, default=None):
    screen = getattr(ctx, "screen", {})
    return screen.get(key, default) if isinstance(screen, Mapping) else getattr(screen, key, default)


def render_nodes(nodes, ctx):
    parts = []
    for node in nodes or []:
        kind = node.get("type", "para")
        inline = ctx.inline
        if kind in ("h1", "h2", "h3"):
            parts.append(f'<div class="tb slot-heading">{inline(node.get("text", ""))}</div>')
        elif kind == "group":
            parts.append(f'<div class="tb slot-heading">{inline(node.get("name", ""))}</div>')
        elif kind == "card":
            parts.append(f'<p class="tb"><b>{inline(node.get("name", ""))}</b>　{inline(node.get("text", ""))}</p>')
        elif kind in ("bullets", "steps", "stats"):
            items = []
            for item in node.get("items", []):
                if kind == "steps":
                    lead = f'<span class="slot-step-number">{inline(str(item.get("n", "")))}</span>　'
                else:
                    lead = ""
                name = item.get("lead", item.get("num"))
                if name:
                    lead += f'<b>{inline(name)}</b>　'
                # 全角竖线是分列标记，与引擎 G1 的 expected_text 保持一致。
                text = str(item.get("text", "")).replace("｜", "")
                items.append(f'<div class="tb slot-item">{lead}{inline(text)}</div>')
            parts.append(f'<div class="slot-list slot-list-{kind}">{"".join(items)}</div>')
        elif kind == "table":
            rows = []
            if node.get("header"):
                cells = "".join(f'<th class="tb">{inline(s)}</th>' for s in node["header"])
                rows.append(f'<tr>{cells}</tr>')
            for row in node.get("rows", []):
                rows.append('<tr>' + ''.join(f'<td class="tb">{inline(s)}</td>' for s in row) + '</tr>')
            parts.append(f'<table class="slot-table">{"".join(rows)}</table>')
        elif kind == "code":
            parts.append(f'<div class="tb slot-code">{inline(chr(10).join(node.get("lines", [])))}</div>')
        elif kind == "legend":
            parts.append('<div class="slot-legend">' + ''.join(
                f'<span class="tb">{inline(it.get("dot", "") + "　" + it.get("text", ""))}</span>'
                for it in node.get("items", [])) + '</div>')
        elif kind in ("linkrow", "now"):
            if node.get("src"):
                # linkrow 的 links 字段不区分原文的链接/按钮，保留原括号语义。
                parts.append(f'<p class="tb">{inline(chr(10).join(node["src"]))}</p>')
            else:
                prefix = inline(node.get("label", "")) if kind == "now" else ""
                parts.append(f'<p class="tb">{prefix}' + '　'.join(
                    inline(f'〔{s}〕') for s in node.get("links", [])) + '</p>')
        else:
            text = node.get("text")
            if text is None:
                # API 外节点只保留它的定稿原文，交给统一行内排字器。
                text = "\n".join(node.get("src", []))
                ctx.warn(f'comp-slots 遇到未定义节点类型 {kind}，保留原文。')
            parts.append(f'<p class="tb">{inline(text)}</p>')
    return ''.join(parts)


def attr(value):
    return html.escape(str(value), quote=True)

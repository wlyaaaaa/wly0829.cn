"""示意图族共用的逐字输出与素材入口。视觉变量由全站 base.css 提供。"""
from pathlib import Path
import html
import re


def attr(value):
    return html.escape(str(value), quote=True)


def inline(text, ctx):
    # 全角竖线是定稿列分隔符；文字仍全部走主引擎的行内入口。
    return ctx.inline(str(text or "")).replace("｜", "<wbr>")


def units(nodes):
    result = []
    for node in nodes:
        if node.get("type") in ("steps", "bullets", "stats"):
            result.extend(dict(item, type="item", source_type=node["type"]) for item in node.get("items", []))
        else:
            result.append(node)
    return result


def render_unit(unit, ctx):
    if unit.get("type") != "item":
        return render_node(unit, ctx)
    parts = []
    if unit.get("n") is not None:
        parts.append(f'<span class="dg-number tb" data-role="step_number">{inline(unit["n"], ctx)}</span>')
    lead = unit.get("lead", unit.get("num"))
    if lead:
        parts.append(f'<div class="dg-name tb" data-role="name">{inline(lead, ctx)}</div>')
    if unit.get("text"):
        parts.append(f'<div class="dg-body tb" data-role="body">{inline(unit["text"], ctx)}</div>')
    return "".join(parts)


def render_node(node, ctx):
    kind = node.get("type", "para")
    if kind == "item":
        return render_unit(node, ctx)
    if kind in ("h1", "h2", "h3", "group"):
        return f'<div class="dg-heading tb" data-role="name">{inline(node.get("text", node.get("name", "")), ctx)}</div>'
    if kind == "card":
        return (f'<div class="dg-name tb" data-role="name">{inline(node.get("name"), ctx)}</div>'
                f'<div class="dg-body tb" data-role="body">{inline(node.get("text"), ctx)}</div>')
    if kind in ("steps", "bullets", "stats"):
        return '<div class="dg-list">' + "".join('<div class="dg-entry">' + render_unit(unit, ctx) + '</div>' for unit in units([node])) + '</div>'
    if kind == "table":
        rows = ([node["header"]] if node.get("header") else []) + node.get("rows", [])
        return '<div class="dg-table">' + "".join('<div class="dg-table-row">' + "".join(f'<div class="dg-cell tb" data-role="body">{inline(cell, ctx)}</div>' for cell in row) + '</div>' for row in rows) + '</div>'
    if kind == "legend":
        return '<div class="dg-list">' + "".join(f'<div class="dg-body tb" data-role="body">{inline(item.get("dot", "") + " " + item.get("text", ""), ctx)}</div>' for item in node.get("items", [])) + '</div>'
    if kind == "linkrow":
        # src 保留按钮与链接各自的原始记号，缺 src 的客观接口用 links。
        text = " ".join(node.get("src", [])) or " ".join('〔' + link + '〕' for link in node.get("links", []))
        return f'<div class="dg-linkrow tb" data-role="body">{inline(text, ctx)}</div>'
    if kind == "now":
        return f'<div class="dg-body tb" data-role="body">{inline(node.get("label", "") + " " + " ".join("〔" + link + "〕" for link in node.get("links", [])), ctx)}</div>'
    if kind == "code":
        return f'<div class="dg-code tb" data-role="body">{inline(chr(10).join(node.get("lines", [])), ctx)}</div>'
    if "text" in node:
        return f'<div class="dg-body tb" data-role="body">{inline(node["text"], ctx)}</div>'
    source = "\n".join(node.get("src", []))
    source = re.sub(r"(?m)^#{1,3}\s+|^-\s+", "", source)
    return f'<div class="dg-body tb" data-role="body">{inline(source, ctx)}</div>' if source else ""


def render_nodes(nodes, ctx):
    return '<div class="dg-text">' + "".join(render_node(node, ctx) for node in nodes) + '</div>'


def images(ctx, spec, kind="icons"):
    choice = spec.get(kind, "auto")
    if choice in (None, "none", False):
        return []
    candidates = list(ctx.icons() if kind == "icons" else ctx.illustrations())
    if choice == "auto":
        return candidates
    if isinstance(choice, int):
        return candidates[choice:choice + 1]
    if isinstance(choice, str):
        choice = [choice]
    result = []
    from engine import assets
    root = Path(assets.ASSET_ROOT)
    page = ctx.page.get("slug", ctx.page.get("id", ctx.screen.get("id", "").rsplit("-", 1)[0]))
    for value in choice:
        if isinstance(value, int):
            if 0 <= value < len(candidates):
                result.append(candidates[value])
            continue
        if str(value).startswith(("file:", "data:")):
            result.append(str(value)); continue
        path = Path(value)
        if not path.is_absolute():
            # 主接口的相对路径从素材根起算；旧样张也允许只写本页文件名。
            rooted = root / path
            path = rooted if rooted.is_file() else root / str(page) / path
        if path.is_file():
            result.append(ctx.asset_url(str(path)))
        else:
            ctx.warn(f"示意图素材不存在：{path}")
    return result

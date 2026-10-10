"""how_flow_cards：我 → 主对话 → 子代理三张大卡（粗绿实心箭头连起），子代理底边经粗绿圆角回线回到“我”，
线中间一枚胶囊标签；下面两张宽卡各带一幅小插画。竖版卡片竖排、箭头向下，回线改成末尾一枚胶囊。

文字全部来自原文节点：五个“**名字**　说明”卡节点 + 一行胶囊标签段落；插画按规格 arts 顺序取，
徽标按 badges 叠在第 card 张卡的插画上（位置是插画宽高的比例）。线宽、颜色只用 style.css 里的本族变量。"""
import html

E = html.escape
FLOW_FIELDS = ("arts", "badges")

# 箭头和回线的几何（SVG 用户单位 = 画布像素）；粗细、颜色在 CSS 变量里，形状在这里
S, R = 10, 22            # 线宽、回线圆角半径
AW, AH = 34, 24          # 箭头头部宽、高
LOOP_H = 66              # 回线带高度（横版）


def _arrow(direction):
    """粗绿实心箭头：横版向右，竖版向下。viewBox 固定、等比缩放，不会歪。"""
    if direction == "right":
        body = (f'<rect x="0" y="{(40 - S) / 2}" width="{60 - AH}" height="{S}" rx="2"/>'
                f'<polygon points="{60 - AH - 1},{20 - AW / 2} 60,20 {60 - AH - 1},{20 + AW / 2}"/>')
        box = "0 0 60 40"
    else:
        body = (f'<rect x="{(40 - S) / 2}" y="0" width="{S}" height="{48 - AH}" rx="2"/>'
                f'<polygon points="{20 - AW / 2},{48 - AH - 1} 20,48 {20 + AW / 2},{48 - AH - 1}"/>')
        box = "0 0 40 48"
    return (f'<div class="c-how-arrow c-how-arrow--{direction}" aria-hidden="true">'
            f'<svg viewBox="{box}" focusable="false">{body}</svg></div>')


def _loop_half(with_head):
    """回线的半边：竖线从卡底下来，圆角转成横线伸向中间。右半边用同一形状水平翻转。
    SVG 不设 viewBox：坐标就是画布像素，横线用 100% 宽的矩形，圆角和箭头都不会被拉变形。"""
    x = AW / 2                       # 竖线中心离半边左缘的距离（给箭头头部留位）
    y = LOOP_H - S / 2               # 横线中心
    top = AH - 1 if with_head else 0
    path = f"M{x} {top}V{y - R}A{R} {R} 0 0 0 {x + R} {y}"
    head = f'<polygon points="{x - AW / 2},{AH} {x},0 {x + AW / 2},{AH}"/>' if with_head else ""
    return (f'<svg class="c-how-loop-half{"" if with_head else " c-how-loop-half--mirror"}" height="{LOOP_H}" focusable="false">'
            f'<path d="{path}" fill="none"/>'
            f'<rect x="{x + R - 1}" y="{y - S / 2}" width="100%" height="{S}"/>{head}</svg>')


def _card(node, art, badges, ctx, cls):
    name = node.get("name", "")
    text = node.get("text", "")
    marks = "".join(
        f'<img class="badge c-how-badge" src="{E(ctx.asset_url(ctx.resolve(b["asset"])))}" alt="{E(b.get("alt", ""))}" '
        f'style="left:{float(b["x"]) * 100:.2f}%;top:{float(b["y"]) * 100:.2f}%;width:{float(b.get("size", 0.12)) * 100:.2f}%">'
        for b in badges)
    pic = (f'<div class="c-how-art"><img class="c-how-art-img" src="{E(art)}" alt="">{marks}</div>' if art else "")
    return (f'<div class="card c-how-card {cls}">'
            f'<div class="c-how-name tb">{ctx.inline(name)}</div>{pic}'
            f'<div class="c-how-text tb">{ctx.inline(text)}</div></div>')


def render_flow_cards(block, ctx):
    sp = block["spec"]
    nodes = block["nodes"]
    cards = [n for n in nodes if n.get("type") == "card"]
    labels = [n for n in nodes if n.get("type") == "para"]
    extra = [n for n in nodes if n.get("type") not in ("card", "para")]
    if len(cards) != 5 or len(labels) != 1 or extra:
        ctx.incomplete(f"how_flow_cards 要 5 张卡和 1 行回线标签，原文分到 {len(cards)} 张卡、{len(labels)} 行标签", "composition")
    arts = []
    for p in (sp.get("arts") or [])[:len(cards)]:
        path = ctx.resolve(p)
        arts.append(ctx.asset_url(path))
    if len(arts) < len(cards):
        ctx.incomplete(f"how_flow_cards 有 {len(cards)} 张卡，只给了 {len(arts)} 幅插画", "asset")
        arts += [""] * (len(cards) - len(arts))
    by_card = {}
    for b in sp.get("badges") or []:
        by_card.setdefault(int(b.get("card", -1)), []).append(b)
    label = ctx.inline(labels[0].get("text", "")) if labels else ""
    v = ctx.orient == "v"
    top = [_card(n, arts[i], by_card.get(i, []), ctx, "c-how-card--top") for i, n in enumerate(cards[:3])]
    low = [_card(n, arts[3 + i], by_card.get(3 + i, []), ctx, "c-how-card--low") for i, n in enumerate(cards[3:])]
    if v:
        back = (f'<div class="c-how-return"><span class="c-how-pill tb">{label}'
                f'<svg class="c-how-pill-arrow" viewBox="0 0 40 24" aria-hidden="true" focusable="false">'
                f'<rect x="0" y="9" width="26" height="6" rx="2"/><polygon points="24,2 40,12 24,22"/></svg>'
                f'回到我</span></div>')
        row = _arrow("down").join(top) + back
        return (f'<div class="c-how-flow c-how-flow--v" data-comp="how_flow_cards">'
                f'<div class="c-how-top">{row}</div><div class="c-how-low">{"".join(low)}</div></div>')
    loop = (f'<div class="c-how-loop">'
            f'<div class="c-how-loop-track" aria-hidden="true">{_loop_half(True)}{_loop_half(False)}</div>'
            f'<span class="c-how-pill tb">{label}</span></div>')
    return (f'<div class="c-how-flow c-how-flow--h" data-comp="how_flow_cards">'
            f'<div class="c-how-top">{_arrow("right").join(top)}</div>{loop}'
            f'<div class="c-how-low">{"".join(low)}</div></div>')

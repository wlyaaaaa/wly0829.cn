"""有字小样只排定稿节点；全站页眉页脚仅登记引用依赖。"""

import hashlib
import math
import os
import re
from html import escape, unescape
from urllib.parse import unquote, urlsplit

from .common import render_nodes, spec_of


_VARIANTS = {"paper", "window", "directory", "terminal", "menu", "approval"}


def _incomplete(ctx, msg, kind="composition"):
    if hasattr(ctx, "incomplete"):
        ctx.incomplete(msg, kind)
    else:
        ctx.warn(msg)


class _MarkerContext:
    """分格记号不是正文；含 code 的片段也在进 inline 前去掉它。"""

    def __init__(self, ctx):
        self._ctx = ctx

    def __getattr__(self, name):
        return getattr(self._ctx, name)

    def inline(self, value):
        return self._ctx.inline(value.replace("｜", "　") if isinstance(value, str) else value)


def _key(value):
    return re.sub(r"\s+", "", value.replace("**", "").replace("`", "").replace("｜", ""))


def _label_line(node):
    # 新解析器可把“**元标签**：首片｜其它片”收成 card；以原 src 恢复完整源行。
    if node.get("type") == "card" and len(node.get("src", [])) == 1:
        return node["src"][0].strip()
    if node.get("type") == "para":
        return node.get("text", "")
    return None


def _label_requested(spec, nodes, ctx):
    if (spec.get("layout") == "illustration_labels"
            or spec.get("appearance") == "illustration_labels" or spec.get("label_text_ref")):
        return True
    # 页负责人明确要普通纸卡且禁用底图时，不让 scene 的旧标签推断覆盖它。
    if (spec.get("variant") == "paper" and spec.get("illustration") == "none"
            and spec.get("base_asset") == "none"):
        return False
    if len(nodes) != 1 or _label_line(nodes[0]) is None:
        return False
    text = _label_line(nodes[0])
    scene = ctx.screen.get("scene", "")
    # 定稿 scene 已声明的标签行也承接旧 window 规格，不把普通段落猜成图内字。
    if any(_key(text).startswith(name) and name in scene for name in ("表盘上的字", "筐上的字")):
        return True
    declared = re.findall(r'text\s*里“([^”]+)”这一行', scene)
    return any(_key(text) == _key(source) for source in declared)


def _base_art(spec, ctx, required=False):
    source = spec.get("base_asset", "auto" if required else "none")
    if source in (None, "none"):
        if required:
            _incomplete(ctx, "illustration_labels 没有绑定无字底图，保留全部源标签", "asset")
        return ""
    if source == "auto":
        index = spec.get("base_asset_index", 0)
        if isinstance(index, bool) or not isinstance(index, int) or index < 0:
            _incomplete(ctx, "document_mock 的 base_asset_index 须为从 0 开始的素材槽位索引")
            return ""
        if hasattr(ctx, "slots"):
            url = dict(ctx.slots("illustration")).get(index + 1)
        else:
            candidates = list(ctx.illustrations())
            url = candidates[index] if index < len(candidates) else None
    elif isinstance(source, str):
        path = ctx.resolve(source)
        url = ctx.asset_url(path) if os.path.isfile(path) else None
    else:
        _incomplete(ctx, "document_mock 的 base_asset 须为 auto、none 或本地无字素材路径")
        return ""
    if not url:
        _incomplete(ctx, "document_mock 没有本槽可用无字底图；不借旧裁片冒充场景", "asset")
        return ""
    return f'<img class="mock-base-art deco" aria-hidden="true" alt="" src="{escape(url, quote=True)}">'


def _base_motion_markers(art, spec, ctx, bound):
    """Only mark existing arrows on the actual, unchanged image in a bound label stage."""
    regions = spec.get("motion_regions")
    if regions is None or regions == []:
        return ""
    if not bound:
        _incomplete(ctx, "document_mock 既有箭头标记缺少实际底图与绑定标签，未加透明标记")
        return ""
    if not isinstance(regions, list):
        _incomplete(ctx, "document_mock motion_regions 须为既有箭头矩形数组，未加透明标记")
        return ""
    source = re.search(r'\bsrc="([^"]+)"', art)
    try:
        address = urlsplit(unescape(source.group(1))) if source else None
        if address is None or address.scheme != "file" or address.netloc:
            raise ValueError("实际底图不是本地文件地址")
        path = unquote(address.path)
        if re.match(r"^/[A-Za-z]:", path):
            path = path[1:]
        with open(path, "rb") as image_file:
            digest = hashlib.sha256(image_file.read()).hexdigest()
    except (OSError, ValueError) as error:
        _incomplete(ctx, f"document_mock 既有箭头实际底图不可读，未加透明标记：{error}")
        return ""
    if digest != spec.get("motion_asset_sha256"):
        _incomplete(ctx, "document_mock 既有箭头的实际底图 SHA 缺失或已变化，未加透明标记")
        return ""
    spans = []
    for region in regions:
        rect = region.get("rect") if isinstance(region, dict) else None
        if (not isinstance(region, dict) or region.get("kind") != "arrow"
                or not isinstance(rect, list) or len(rect) != 4
                or any(isinstance(value, bool) or not isinstance(value, (int, float))
                       or not math.isfinite(value) for value in rect)
                or min(rect[:2]) < 0 or min(rect[2:]) <= 0
                or rect[0] + rect[2] > 1 or rect[1] + rect[3] > 1):
            _incomplete(ctx, "document_mock 既有箭头须为图内有限归一化 xywh，kind 仅 arrow，未加该标记")
            continue
        position = ";".join(f"{key}:{value * 100:.12g}%" for key, value in zip(("left", "top", "width", "height"), rect))
        spans.append(f'<span data-comp="arrow" data-motion-region="existing-art" '
                     f'data-motion-rect="{escape(",".join(map(str, rect)), quote=True)}" '
                     f'aria-hidden="true" style="position:absolute;display:block;pointer-events:none;'
                     f'opacity:0;background:transparent;border:0;padding:0;margin:0;{position}"></span>')
    return "".join(spans)


def _mock_geometry(content, spec, ctx, minimum, inside_done=False):
    """大小只改变框/装饰；源字字号不变。插画真实进入卡内或卡外容器。"""
    size = spec.get("size", "default")
    if size not in (None, "default", "small", "medium", "large"):
        _incomplete(ctx, f"document_mock 的 size={size!r} 不在 small/medium/large 内")
        size = "default"
    elif size in ("small", "medium", "large"):
        ctx.warn(f"AI 补充：document_mock 的 {size} 档改变外框/装饰尺寸、不缩源字；档位尺寸待本人样张看")
    align = spec.get("align", "left")
    if align not in ("left", "center", "right"):
        _incomplete(ctx, "document_mock 的 align 须为 left/center/right")
        align = "left"
    placement = spec.get("illustration", "none")
    if placement in (None, "auto"):
        placement = "none"
    if placement not in ("none", "outside", "top_inside"):
        _incomplete(ctx, f"document_mock 未实现 illustration={placement!r}；保留全部源字")
        placement = "none"
    art = ""
    if placement != "none" and not inside_done:
        art = _base_art(spec, ctx, required=True)
        if art and placement == "top_inside":
            opening, sep, body = content.partition(">")
            content = opening + sep + '<div class="mock-composite-art">' + art + '</div>' + body
            art = ""
    outside = '<div class="mock-art-outside">' + art + '</div>' if art else ""
    render_text = spec.get("render_text")
    rendering = "program" if render_text is True else "empty" if render_text is False else "auto"
    return (f'<div class="c-slot-mock mock-sizing" data-mock-size="{size or "default"}" '
            f'data-mock-align="{align}" data-mock-illustration="{placement}" '
            f'data-render-text="{rendering}" data-orient="{ctx.orient}" '
            f'style="--slot-mock-min-font:{minimum:g}px">{outside}{content}</div>')


def _label_source(nodes, spec, ctx):
    ref = spec.get("label_text_ref")
    if ref is not None and (not isinstance(ref, str) or not ref.strip()):
        _incomplete(ctx, "illustration_labels 的 label_text_ref 须为源节点开头")
        return None
    index = next((i for i, n in enumerate(nodes) if _label_line(n) is not None
                  and (not ref or _key(_label_line(n)).startswith(_key(ref)))), None)
    if index is None:
        _incomplete(ctx, "illustration_labels 找不到原标签行（para 或 card 的 src）；保留全部节点")
        return None
    if not ref and len(nodes) != 1:
        _incomplete(ctx, "illustration_labels 多节点须用 label_text_ref 指定源标签段；保留全部节点")
        return None
    text = _label_line(nodes[index])
    # 元标签和冒号仍显示一次；只拆声明过的标签正文，不删标题/前缀。
    match = re.match(r"^(\*\*[^*]+\*\*[：:]\s*)(.*)$", text)
    prefix, body = (match.group(1), match.group(2)) if match else ("", text)
    labels = re.split(r"｜|[　\t]+|\s{2,}", body)
    if any(not label.strip() for label in labels):
        _incomplete(ctx, "illustration_labels 源段存在空片段；保留全部节点")
        return None
    labels = [label.strip() for label in labels]
    if "labels" in spec and spec["labels"] != labels:
        _incomplete(ctx, "illustration_labels 的 labels 与源段逐片文本不一致；保留全部节点")
        return None
    return index, prefix, labels


def _label_positions(spec, count, ctx):
    positions = spec.get("label_positions")
    if positions is None:
        _incomplete(ctx, "illustration_labels 尚未提供实测 label_positions；逐片保字不代表牌位吻合")
        return None
    if not isinstance(positions, list) or not positions:
        _incomplete(ctx, "illustration_labels 的 label_positions 须为百分比矩形数组")
        return None
    for p in positions:
        if (not isinstance(p, dict) or any(isinstance(p.get(k), bool)
                or not isinstance(p.get(k), (int, float)) or not math.isfinite(p[k])
                for k in ("x", "y", "width", "height"))
                or p["x"] < 0 or p["y"] < 0 or p["width"] <= 0 or p["height"] <= 0
                or p["x"] + p["width"] > 100 or p["y"] + p["height"] > 100
                or p.get("align", "center") not in ("left", "center", "right")):
            _incomplete(ctx, "illustration_labels 的牌位须为底图范围内有效百分比矩形；不猜坐标")
            return None
        for spacing in ("letter_spacing", "word_spacing"):
            if spacing in p and (isinstance(p[spacing], bool) or not isinstance(p[spacing], (int, float))
                                 or not math.isfinite(p[spacing])):
                _incomplete(ctx, "illustration_labels 的字距须为有限像素数；不改变原字形或字号")
                return None
        if "nowrap" in p and not isinstance(p["nowrap"], bool):
            _incomplete(ctx, "illustration_labels 的 nowrap 须为布尔值")
            return None
    bindings = spec.get("label_bindings", [{"label_index": i, "position_index": i} for i in range(count)])
    if (not isinstance(bindings, list) or len(bindings) != count
            or any(not isinstance(b, dict) or any(isinstance(b.get(k), bool)
                       or not isinstance(b.get(k), int) for k in ("label_index", "position_index"))
                   or not 0 <= b["label_index"] < count
                   or not 0 <= b["position_index"] < len(positions) for b in bindings)
            or len({b["label_index"] for b in bindings}) != count
            or len({b["position_index"] for b in bindings}) != count):
        _incomplete(ctx, "illustration_labels 的 label_bindings 须把每个源标签唯一绑定到一个牌位")
        return None
    return {b["label_index"]: positions[b["position_index"]] for b in bindings}


def _source_labels(block, ctx, minimum):
    spec, nodes = spec_of(block), list(block.get("nodes", []))
    source = _label_source(nodes, spec, ctx)
    if source is None:
        return None
    index, prefix, labels = source
    columns, rows = spec.get("label_columns", 1), spec.get("label_rows")
    if isinstance(columns, bool) or not isinstance(columns, int) or not 1 <= columns <= 12:
        _incomplete(ctx, "illustration_labels 的 label_columns 须为 1 到 12 的整数")
        columns = 1
    if rows is None:
        rows = math.ceil(len(labels) / columns)
    if isinstance(rows, bool) or not isinstance(rows, int) or rows < 1 or rows * columns < len(labels):
        _incomplete(ctx, "illustration_labels 的 label_rows 没有容纳全部源标签，已完整顺排")
        rows = math.ceil(len(labels) / columns)
    art = _base_art(spec, ctx, required=True)
    positions = _label_positions(spec, len(labels), ctx)
    bound = bool(art and positions)
    if bound:
        art = art.replace('<img ', '<img data-underlay="true" ', 1)
    parts = [f'<div class="c-slot-mock mock-source-labels" data-comp="document_mock" '
             f'data-orient="{ctx.orient}" data-label-status="{"bound" if bound else "unbound"}" '
             f'style="--slot-mock-min-font:{minimum:g}px;--mock-label-columns:{columns};--mock-label-rows:{rows}">',
             render_nodes(nodes[:index], ctx)]
    if prefix:
        parts.append(f'<div class="tb mock-label-prefix">{ctx.inline(prefix)}</div>')
    parts.append('<div class="mock-label-stage">' + art)
    parts.append(f'<div class="mock-label-{"overlay" if bound else "list"}">')
    for i, label in enumerate(labels):
        style = ""
        if bound:
            p = positions[i]
            rules = (f'left:{p["x"]:g}%;top:{p["y"]:g}%;width:{p["width"]:g}%;'
                     f'height:{p["height"]:g}%;text-align:{p.get("align", "center")}')
            for spacing in ("letter_spacing", "word_spacing"):
                if spacing in p:
                    rules += f';{spacing.replace("_", "-")}:{p[spacing]:g}px'
            if p.get("nowrap"):
                rules += ';white-space:nowrap'
            style = f' style="{rules}"'
        parts.append(f'<div class="tb mock-source-label" data-label-index="{i}"{style}>{ctx.inline(label)}</div>')
    parts.append('</div>' + _base_motion_markers(art, spec, ctx, bound)
                 + '</div>' + render_nodes(nodes[index + 1:], ctx) + '</div>')
    return "".join(parts)


def _approval_mock(nodes, spec, ctx, minimum):
    """只将既有审批原段排成静态小样，原词一次且不产生真实动作。"""
    if (len(nodes) != 1 or nodes[0].get("type") != "para"
            or not isinstance(nodes[0].get("text"), str)):
        _incomplete(ctx, "approval 小样须消费单一原 para；已保留全部源节点")
        return None
    source = _label_source(nodes, spec, ctx)
    if source is None:
        return None
    index, prefix, labels = source
    if index != 0 or prefix or labels != ["审批页", "保留", "不留"]:
        _incomplete(ctx, "approval 小样原段须精确分为审批页、保留、不留；已保留全部源节点")
        return None
    if spec.get("render_text") is False:
        _incomplete(ctx, "approval 小样不能关闭原三词显示，仍完整保字")
    ctx.warn("新外观：审批页小卡片与两个原词按钮样式，沿用已批准变量，列入最后验收页")
    buttons = "".join(f'<span class="tb mock-approval-button">{ctx.inline(label)}</span>'
                      for label in labels[1:])
    return (f'<div class="c-slot-mock mock-approval" data-comp="document_mock" '
            f'data-approval-mock="source" data-orient="{ctx.orient}" '
            f'style="--slot-mock-min-font:{minimum:g}px">'
            f'<div class="card mock-approval-preview"><div class="tb mock-approval-title">'
            f'{ctx.inline(labels[0])}</div></div>'
            f'<div class="mock-approval-buttons">{buttons}</div></div>')


def _unsigned_notice(nodes, ctx, minimum):
    ctx.warn("AI 补充：无字通知三小节、签名笔划和日期线为程序样张，浅灰线条新外观待本人看")
    if nodes:
        _incomplete(ctx, "unsigned_notice 无字样张收到正文节点；样张外完整保留原字")
    section = ('<div class="mock-notice-section"><i class="mock-notice-section-head"></i>'
               '<i class="mock-notice-line"></i><i class="mock-notice-line"></i>'
               '<i class="mock-notice-line mock-notice-short"></i></div>')
    return (f'<div class="c-slot-mock mock-unsigned-notice" data-comp="document_mock" '
            f'data-orient="{ctx.orient}" style="--slot-mock-min-font:{minimum:g}px">'
            '<div class="card mock-notice-sheet"><div class="mock-notice-decoration" aria-hidden="true">'
            '<i class="mock-notice-title-line"></i><i class="mock-notice-recipient-line"></i>'
            + section * 3 + '<div class="mock-notice-signature">'
            '<svg viewBox="0 0 140 38"><path d="M5 29 C30 6 35 9 22 30 C18 37 42 19 50 12 '
            'C56 5 46 35 58 27 S76 8 78 22 S102 33 132 11"/></svg>'
            '<i class="mock-notice-date-line"></i></div></div></div>'
            + render_nodes(nodes, ctx) + '</div>')


def _count(value, maximum, label, ctx):
    if isinstance(value, bool) or not isinstance(value, int) or not 0 <= value <= maximum:
        ctx.warn(f"document_mock 的 {label} 必须为 0 到 {maximum} 的整数，已保留全部节点")
        return 0
    return value


def _sections(nodes, starts, ctx):
    """只按显式索引分段，不能根据文本猜测菜单或纸面字段。"""
    if not nodes:
        return []
    if starts is None:
        return [nodes]
    if (not isinstance(starts, list)
            or any(isinstance(n, bool) or not isinstance(n, int) for n in starts)
            or not starts or starts[0] != 0
            or starts != sorted(set(starts))
            or starts[-1] >= len(nodes)):
        ctx.warn("document_mock 的 section_starts 无效，已顺排全部节点；索引须从 0 开始且递增")
        return [nodes]
    ends = starts[1:] + [len(nodes)]
    return [nodes[start:end] for start, end in zip(starts, ends)]


def _strings(spec, key, ctx):
    values = spec.get(key, [])
    if not isinstance(values, list) or any(not isinstance(s, str) or not s for s in values):
        ctx.warn(f"document_mock 的 {key} 必须为非空字符串数组，已忽略此字段")
        return []
    return values


class _HighlightContext:
    """原字符逐片走 ctx.inline；mark 仅提供无新增字符的视觉包裹。"""

    def __init__(self, ctx, tokens):
        self._ctx = ctx
        self._pattern = re.compile("|".join(re.escape(s) for s in sorted(set(tokens), key=len, reverse=True)))

    def __getattr__(self, name):
        return getattr(self._ctx, name)

    def inline(self, value):
        parts = []
        start = 0
        for match in self._pattern.finditer(value):
            if match.start() > start:
                parts.append(self._ctx.inline(value[start:match.start()]))
            parts.append(f'<mark class="mock-highlight">{self._ctx.inline(match.group())}</mark>')
            start = match.end()
        if start < len(value) or not parts:
            parts.append(self._ctx.inline(value[start:]))
        return "".join(parts)


def _content(nodes, ctx, headings, prefixes):
    # 让通用节点渲染器保留原有链接、按钮、编号和表格处理。
    parts = []
    for node in nodes:
        kind = node.get("type", "para")
        text = node.get("text", "")
        role = "heading" if kind in {"h1", "h2", "h3", "group"} or text in headings else "body"
        status = next((prefix.lower() for prefix in prefixes if text == prefix
                       or text.startswith(prefix) and len(text) > len(prefix)
                       and text[len(prefix)].isspace()), None)
        status_class = f" mock-status mock-status-{status}" if status else ""
        dot = '<i class="mock-status-dot" aria-hidden="true"></i>' if status else ""
        parts.append(f'<div class="mock-node mock-node-{role}{status_class}">{dot}'
                     f'{render_nodes([node], ctx)}</div>')
    return "".join(parts)


def _curved_oled(nodes, ctx, minimum):
    """仅承接规格指定的七片段；不根据其它段落猜测屏幕内容。"""
    if (len(nodes) != 1 or nodes[0].get("type") != "para"
            or not isinstance(nodes[0].get("text"), str)):
        ctx.warn("document_mock curved_oled 需单一 para 七片段，已保留普通窗口全文")
        return None
    text = nodes[0]["text"]
    fragments = text.split("　")
    if len(fragments) != 7 or any(not s.strip() for s in fragments) or "\n" in text:
        ctx.warn("document_mock curved_oled 原文不符合全角空格分隔的七片段，已保留普通窗口全文")
        return None
    # 分隔空格归到前一片，连空格在内的所有源字符仍依次经过 inline。
    chunks = [s + ("　" if i < 6 else "") for i, s in enumerate(fragments)]
    ctx.warn("AI 补充：curved_oled 为淡绿风格的程序圆弧外框与七片段样张；"
             "底图载字位置未实测，新外观待本人看")
    parts = [f'<div class="c-slot-mock card mock-curved-oled" data-comp="document_mock" '
             f'data-mock-layout="curved_oled" data-orient="{ctx.orient}" '
             f'style="--slot-mock-min-font:{minimum:g}px">', '<div class="mock-oled-top">']
    parts.extend(f'<div class="tb mock-oled-value">{ctx.inline(s)}</div>' for s in chunks[:2])
    parts.append('</div><div class="mock-oled-tiles">')
    parts.extend(f'<div class="card mock-oled-tile"><div class="tb">{ctx.inline(s)}</div></div>'
                 for s in chunks[2:5])
    parts.append('</div><div class="mock-oled-notifications">')
    parts.extend(f'<div class="card mock-oled-tile"><div class="tb">{ctx.inline(s)}</div></div>'
                 for s in chunks[5:])
    parts.append('</div></div>')
    return "".join(parts)


def prepare_mock_attachments(block, ctx):
    """给 main/card 的纯节点分配接口；源尾部五节点须整块移动而非复制。"""
    spec = spec_of(block)
    if (spec.get("layout") != "illustration_labels" and spec.get("appearance") != "illustration_labels"
            or not spec.get("attach_to")):
        return None
    nodes = list(block.get("nodes", []))
    values = [n.get("text") for n in nodes]
    expected = ["ERP", "CRM", "2026-09-22", "2026-09-23", "ready"]
    if (values != expected or any(n.get("type") != "para" for n in nodes)
            or spec.get("labels", values) != values):
        ctx.warn("illustration_labels 未符合真实五个尾部标签，保留原节点，不猜分配")
        return None
    children = []
    for index, role, subset in [(0, "swapped_dates", nodes[:4]), (1, "rejected_stamp", nodes[4:])]:
        children.append({"card_index": index, "block": {"type": "document_mock", "nodes": subset,
            "spec": {"layout": "illustration_labels", "label_role": role,
                     "labels": [n["text"] for n in subset],
                     "echo_repeats": spec.get("echo_repeats", False)}}})
    return {"attach_to": spec["attach_to"], "mock_attachments": children}


def _illustration_labels(block, ctx, minimum):
    spec = spec_of(block)
    nodes = list(block.get("nodes", []))
    values = [n.get("text") for n in nodes]
    role = spec.get("label_role")
    if role not in ("swapped_dates", "rejected_stamp") and not spec.get("attach_to"):
        return _source_labels(block, ctx, minimum)
    if any(n.get("type") != "para" or not isinstance(n.get("text"), str) for n in nodes):
        _incomplete(ctx, "illustration_labels 仅支持原文 para 标签；已保留全部原节点")
        return None
    if spec.get("labels", values) != values:
        _incomplete(ctx, "illustration_labels 的 labels 与原节点不一致；已保留全部原节点")
        return None
    if role == "swapped_dates" and len(values) == 4:
        parts = [f'<div class="c-slot-mock mock-label-art" data-comp="document_mock" '
                 f'data-label-role="swapped_dates" style="--slot-mock-min-font:{minimum:g}px">',
                 '<div class="mock-date-sheet card">']
        # DOM 仍 ERP、CRM、日期1、日期2；网格只定位各完整标签节点。
        parts.extend(f'<div class="tb mock-date-cell mock-date-cell-{i}">{ctx.inline(s)}</div>'
                     for i, s in enumerate(values))
        parts.append('</div>')
        if spec.get("echo_repeats") is True:
            parts.append('<div class="mock-date-thread" aria-hidden="true"></div>'
                         '<div class="mock-date-sheet card" data-echo>')
            swapped = [values[0], values[1], values[3], values[2]]
            parts.extend(f'<div class="tb mock-date-cell mock-date-cell-{i}">{ctx.inline(s)}</div>'
                         for i, s in enumerate(swapped))
            parts.append('</div>')
        parts.append('</div>')
        return "".join(parts)
    if role == "rejected_stamp" and len(values) == 1:
        ctx.warn("AI 补充：ready 程序印章沿用绿色变量；源图红章颜色及叉线新外观待本人样张裁定")
        return (f'<div class="c-slot-mock mock-label-art mock-stamp-paper card" data-comp="document_mock" '
                f'data-label-role="rejected_stamp" style="--slot-mock-min-font:{minimum:g}px">'
                f'<div class="mock-rejected-stamp"><div class="tb">{ctx.inline(values[0])}</div>'
                '<i aria-hidden="true"></i></div></div>')
    attachment = prepare_mock_attachments(block, ctx)
    if attachment:
        _incomplete(ctx, "illustration_labels 尾块保全；main/card 的 mock_attachments 消费端尚未接入，"
                    "不能视为已挂到目标卡")
        return '<div class="c-slot-mock mock-label-bundle">' + "".join(
            _illustration_labels(item["block"], ctx, minimum) for item in attachment["mock_attachments"]) + '</div>'
    _incomplete(ctx, "illustration_labels 缺少有效 label_role，保留原节点")
    return None


def _directory_art(spec, ctx):
    source = spec.get("directory_art", "auto")
    if source == "none":
        return ""
    if source == "auto":
        candidates = list(ctx.illustrations())
        url = candidates[0] if candidates else None
        if url:
            ctx.warn("directory 使用本屏首个无字插画候选；元数据语义仅位置推定，牛皮纸文件夹承载位置待根样张核对")
    else:
        url = ctx.asset_url(ctx.resolve(source))
    if not url:
        ctx.warn("directory 缺少本屏无字文件夹素材，保留程序文件清单框")
        return ""
    return f'<div class="mock-directory-art"><img class="deco" aria-hidden="true" alt="" src="{escape(url, quote=True)}"></div>'


def _directory_content(nodes, ctx, headings, prefixes, spec):
    icons = spec.get("file_icons", [])
    if not isinstance(icons, list) or any(not isinstance(s, str) for s in icons):
        ctx.warn("directory 的 file_icons 必须为本地无字素材路径数组，已回退程序纸片")
        icons = []
    index = 0
    parts = []
    for node in nodes:
        if node.get("type") != "bullets":
            parts.append(_content([node], ctx, headings, prefixes))
            continue
        for item in node.get("items", []):
            if index < len(icons):
                url = ctx.asset_url(ctx.resolve(icons[index]))
                art = f'<img class="mock-file-icon deco" aria-hidden="true" alt="" src="{escape(url, quote=True)}">'
            else:
                art = '<i class="mock-file-paper" aria-hidden="true"></i>'
            parts.append(f'<div class="mock-file-row">{art}<div class="mock-file-text">'
                         f'{render_nodes([dict(node, items=[item])], ctx)}</div></div>')
            index += 1
    if index > len(icons):
        ctx.warn(f"directory {index} 个文件行缺少逐项无字文件图标，用程序纸片保留全部清单；"
                 "本页三张操作图标不能当七个文件图标复用")
    return "".join(parts)


def render_document_mock(block: dict, ctx) -> str:
    """全部字只取分配节点；无字样张与图内牌位都有明确未完成边界。"""
    spec = spec_of(block)
    nodes = list(block.get("nodes", []))
    if spec.get("motion_regions") and (not _label_requested(spec, nodes, ctx)
            or spec.get("label_role") in ("swapped_dates", "rejected_stamp")
            or spec.get("attach_to") or spec.get("variant") == "approval"
            or spec.get("mock_layout") == "unsigned_notice"):
        _incomplete(ctx, "document_mock 既有箭头标记只消费实际绑定标签的底图，当前模式未加标记")
    appearance = spec.get("appearance")
    if appearance not in (None, "", "default", "illustration_labels", "notebook", "receipt", "tray_menu"):
        _incomplete(ctx, f"document_mock 未实现 appearance={appearance!r}，原节点仍完整顺排")
        appearance = None
    paper = spec.get("paper")
    paper_style = {"receipt": "receipt", "ledger": "notebook"}
    if paper in tuple(paper_style):
        if appearance and appearance != paper_style[paper]:
            _incomplete(ctx, "document_mock 的 paper 与 appearance 指定了不同纸面；按 appearance 保留源字")
        else:
            appearance = paper_style[paper]
    elif paper not in (None, "", "default", "none", "auto"):
        _incomplete(ctx, f"document_mock 未实现 paper={paper!r}；保留全部源字")
    render_text = spec.get("render_text")
    if "render_text" in spec and not isinstance(render_text, bool):
        _incomplete(ctx, "document_mock 的 render_text 须为布尔值；源字仍以程序完整排出")
        spec = dict(spec, render_text=True)
    elif render_text is False and nodes:
        _incomplete(ctx, "document_mock 的 render_text=false 与分配的源字冲突；不隐藏原文，仍程序排字")
        spec = dict(spec, render_text=True)
    scene = ctx.screen.get("scene", "")
    if (not appearance and "浅灰底" in scene and "等宽" in scene
            and any(n.get("name", n.get("text")) in spec.get("heading_refs", [])
                    for n in nodes if n.get("type") in {"group", "h1", "h2", "h3"})):
        appearance = "receipt"
    variant = spec.get("variant", "paper")
    if variant not in _VARIANTS:
        ctx.warn(f"document_mock 未知 variant={variant!r}，已按 paper 排版")
        variant = "paper"
    columns = spec.get("columns", 1)
    if isinstance(columns, bool) or not isinstance(columns, int) or not 1 <= columns <= 4:
        ctx.warn("document_mock 的 columns 必须为 1 到 4 的整数，已改为单列")
        columns = 1
    if ctx.orient == "v":
        columns = 1

    headings = set(_strings(spec, "heading_refs", ctx))
    highlights = _strings(spec, "highlights", ctx)
    prefixes = _strings(spec, "status_prefixes", ctx)
    if any(prefix not in {"P0", "P1", "P2"} for prefix in prefixes):
        ctx.warn("document_mock 的 status_prefixes 仅支持 P0/P1/P2，已忽略其它前缀")
        prefixes = [prefix for prefix in prefixes if prefix in {"P0", "P1", "P2"}]
    source_ctx = _MarkerContext(ctx)
    text_ctx = _HighlightContext(source_ctx, highlights) if highlights else source_ctx

    header_count = _count(spec.get("header_nodes", 0), len(nodes), "header_nodes", ctx)
    footer_count = _count(spec.get("footer_nodes", 0), len(nodes) - header_count,
                          "footer_nodes", ctx)
    body_end = len(nodes) - footer_count
    header = nodes[:header_count]
    body = nodes[header_count:body_end]
    footer = nodes[body_end:]
    sections = _sections(body, spec.get("section_starts"), ctx)
    minimum = float(ctx.min_font)
    if minimum <= 0:
        raise ValueError("ctx.min_font 必须为正数")
    if variant == "approval":
        approval = _approval_mock(nodes, spec, text_ctx, minimum)
        if approval is None:
            approval = (f'<div class="c-slot-mock" data-comp="document_mock" '
                        f'style="--slot-mock-min-font:{minimum:g}px">'
                        + render_nodes(nodes, text_ctx) + '</div>')
        if spec.get("illustration") not in (None, "", "none") or spec.get("base_asset") not in (None, "", "none"):
            _incomplete(ctx, "approval 小样只排源三词与卡片按钮样式，不消费外部插画")
        return _mock_geometry(approval, {**spec, "illustration": "none", "base_asset": "none"}, ctx, minimum)
    if spec.get("mock_layout") == "unsigned_notice":
        return _mock_geometry(_unsigned_notice(nodes, text_ctx, minimum), spec, ctx, minimum)
    if _label_requested(spec, nodes, ctx):
        labels = _illustration_labels(block, text_ctx, minimum)
        if labels is not None:
            return _mock_geometry(labels, spec, ctx, minimum,
                                  inside_done=spec.get("illustration") == "top_inside")
    if spec.get("mock_layout") == "curved_oled":
        curved = _curved_oled(nodes, text_ctx, minimum)
        if curved is not None:
            return _mock_geometry(curved, spec, ctx, minimum)
        variant = "window"
    elif spec.get("mock_layout") not in (None, "", "default"):
        _incomplete(ctx, f"document_mock 未实现 mock_layout={spec['mock_layout']!r}，原节点仍完整顺排")
    if spec.get("layout") not in (None, "", "default", "illustration_labels"):
        _incomplete(ctx, f"document_mock 未实现 layout={spec['layout']!r}，原节点仍完整顺排")
    appearance_class = f" mock-{appearance}" if appearance in {"notebook", "receipt", "tray_menu"} else ""
    if appearance == "notebook":
        ctx.warn("AI 补充：程序账本有装订脊与无字页线，沿用淡绿变量；源图米色及账本新外观待本人样张看")
    elif appearance == "receipt":
        if "浅灰底" in scene and "等宽" in scene:
            ctx.warn("AI 补充：依据源 scene 的浅灰底等宽回执排字；灰底小票外观待本人样张看")
        else:
            ctx.warn("AI 补充：paper=receipt 选择程序回执纸面与共享报告等宽字体；"
                     "源场景米色及底图载字位置仍待根核对，程序外框新样张待本人看")
    elif appearance == "tray_menu":
        ctx.warn("AI 补充：显示器与放大托盘菜单放在同一容器；上下组合样张待本人看，未宣称原图像素摆位已核")
    if variant == "menu" and "显示器" in scene and appearance != "tray_menu":
        _incomplete(ctx, "托盘菜单仍独立保文，尚未把提示和显示器归入同一 tray_menu 容器")
    if paper == "receipt":
        appearance_class += " mock-paper-receipt"
    parts = [f'<div class="c-slot-mock card mock-{variant}{appearance_class}" data-comp="document_mock" '
             f'data-orient="{ctx.orient}" '
             f'style="--slot-mock-columns:{columns};--slot-mock-min-font:{minimum:g}px">']
    if variant in {"window", "terminal"}:
        parts.append('<div class="mock-window-bar" aria-hidden="true">'
                     '<i></i><i></i><i></i></div>')
    if variant == "directory":
        parts.append(_directory_art(spec, ctx))
    if (appearance == "tray_menu" or spec.get("illustration") == "top_inside"
            or spec.get("base_asset") not in (None, "none") and spec.get("illustration") != "outside"):
        art = _base_art(spec, ctx, required=appearance == "tray_menu" or spec.get("illustration") == "top_inside")
        if art:
            parts.append(f'<div class="mock-composite-art">{art}</div>')
    if appearance == "tray_menu":
        parts.append('<div class="mock-tray-symbol" aria-hidden="true"></div>')
    if header:
        parts.append(f'<div class="mock-header">{_content(header, text_ctx, headings, prefixes)}</div>')
    parts.append('<div class="mock-sections">')
    for section in sections:
        content = (_directory_content(section, text_ctx, headings, prefixes, spec)
                   if variant == "directory" else _content(section, text_ctx, headings, prefixes))
        parts.append(f'<div class="mock-section">{content}</div>')
    parts.append('</div>')
    if footer:
        parts.append(f'<div class="mock-footer">{_content(footer, text_ctx, headings, prefixes)}</div>')
    parts.append('</div>')
    return _mock_geometry("".join(parts), spec, ctx, minimum,
                          inside_done=spec.get("illustration") == "top_inside")


def render_site_chrome_reference(block: dict, ctx) -> str:
    """引用不代表取得了全站构图，不补写页眉页脚，也不吞分配的节点。"""
    if hasattr(ctx, "incomplete"):
        ctx.incomplete("404 全站页眉页脚引用尚缺独立定稿与真实拼页接入；组件只登记依赖，不代表引用已完成", "composition")
    ctx.warn("site_chrome_reference：404-01 引用现有全站页眉页脚；"
             "本任务无独立定稿与构图，需由拼页方接入真实引用，当前只保留分配的定稿节点")
    return ('<div class="c-slot-chrome" data-comp="site_chrome_reference" '
            'data-reference="site-chrome" data-reference-status="unresolved">'
            f'{render_nodes(block.get("nodes", []), ctx)}</div>')

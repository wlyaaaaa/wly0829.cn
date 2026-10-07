"""core 组件族：批准样板里已有的组件，也是写法范例。其它族可覆盖这里的同名组件（core 是兜底）。"""
import html
import re

E = lambda s: html.escape(s or "", quote=False)


def _assets():
    import importlib
    return importlib.import_module("engine.assets")


def _canon(s):
    """标题核字用：先去设计前缀、双反斜杠归一（素材库里有按原串画的“标题：…”），再逐字比。"""
    import importlib
    P = importlib.import_module("engine.parse")
    return P.canon(P.normalize(s))


# ---------- 通用节点排法（组件拿到混合节点时用） ----------
def node_html(n, ctx):
    t = n["type"]
    if t in ("h1", "h2"):
        return chapter_title({"type": "chapter_title", "spec": {}, "nodes": [n]}, ctx)
    if t in ("h3", "group"):
        return section_heading({"type": "section_heading", "spec": {}, "nodes": [n]}, ctx)
    if t == "para":
        return f'<p class="prose tb">{ctx.inline(n["text"])}</p>'
    if t == "card":
        return f'<p class="prose tb"><b>{ctx.inline(n["name"])}</b>　{ctx.inline(n["text"])}</p>'
    if t == "linkrow":
        return action_button({"type": "action_button", "spec": {}, "nodes": [n]}, ctx)
    if t == "now":
        return live_strip({"type": "live_strip", "spec": {}, "nodes": [n]}, ctx)
    if t == "bullets":
        return bullet_list({"type": "bullet_list", "spec": {"bare": True}, "nodes": [n]}, ctx)
    kind = {"stats": "stat_card", "steps": "numbered_steps", "table": "table", "legend": "status_legend", "code": "monospace"}
    return ctx.render({"type": kind.get(t, "prose"), "spec": {}, "nodes": [n]})


def prose(block, ctx):
    return '<div class="c-prose">' + "".join(node_html(n, ctx) for n in block["nodes"]) + "</div>"


def fallback(block, ctx):
    return prose(block, ctx)


# ---------- 毛笔章节标题 ----------
def chapter_title(block, ctx):
    n = block["nodes"][0] if block["nodes"] else None
    text = n.get("text") or n.get("name") if n else ""
    sp = block["spec"]
    rest = "".join(node_html(x, ctx) for x in block["nodes"][1:])  # 标题块不吞后面的字
    sub = sp.get("subtitle_from")  # 长标题拆主副标题（13:50 裁定第 4 条）：从这几个字起是副标题，原字一个不少、顺序不变
    if sub and text:
        k = text.find(sub)
        if k > 0:
            main, tail = text[:k].rstrip(), text[k:]
            return (_title(main, sp, ctx) +
                    f'<div class="title-sub tb al-{E(sp.get("align") or "left")}" data-comp="chapter_title">{ctx.inline(tail)}</div>' + rest)
        ctx.incomplete(f"chapter_title 的 subtitle_from “{sub[:10]}”不在标题里，没拆", "composition")
    return _title(text, sp, ctx) + rest


def _size(sp):
    s = sp.get("size")
    return f" size-{s}" if s in ("large", "medium", "small") else ""


# 标题图档位：裁掉白边后的显示高度上限（像素，含上下各 8px 白边）。依据批准样板 agents-01/02 标题笔画高约 120–163px。
TITLE_H = {"h": {"large": 160, "medium": 118, "small": 84}, "v": {"large": 148, "medium": 110, "small": 78}}


def _title_img(path, sp, ctx, text):
    """标题图 <img>：按 size 档（默认 large）限制显示高度、只缩不放大；max_width 可再限宽。素材太小达不到档位时记缺素材。"""
    A = _assets()
    ready = A.title_ready(path)
    w, h = A.title_size(path)
    tier = sp.get("size") if sp.get("size") in ("large", "medium", "small") else "large"
    cap = TITLE_H[ctx.orient][tier]
    if h < 0.7 * cap:
        ctx.incomplete(f"标题“{text[:10]}”的标题图只有 {h}px 高，达不到 {tier} 档（{cap}px），需要更大的标题图（只缩不放大）", "asset")
    style = f"max-height:{min(h, cap)}px"
    if sp.get("max_width"):
        style += f";max-width:{E(str(sp['max_width']))}"
    return A.url(ready), style


def _title(text, sp, ctx):
    A = _assets()
    if sp.get("asset"):  # 规格直接指定标题图（需同时给 source_image/source_box 才能做 G4 取色）
        path = ctx.resolve(sp["asset"])
        al = sp.get("align", "center")
        box = sp.get("source_box")
        attr = (f' data-title-src="{E(A.local_path(sp["source_image"]))}" data-title-box="{",".join(map(str, box))}"'
                if sp.get("source_image") and box else "")
        if not attr:
            ctx.warn("标题图没给原图位置，G4 取色没做")
            ctx.incomplete(f"标题“{text[:10]}”的标题图没给原图位置，G4 取色没做", "title")
        src, st = _title_img(path, sp, ctx, text)
        return (f'<div class="title-wrap title-img tb al-{al}{_size(sp)}" data-comp="chapter_title">'
                f'<img src="{src}" style="{st}" alt=""{attr}><span class="ghost">{E(text)}</span></div>')
    rows = [r for r in A.for_screen(ctx.screen["id"], "title", ctx.orient)
            if r.get("title_exact_match") and _canon(r.get("title_text") or "") == _canon(text)]
    if not rows:  # 别的方向抠的也行（同一个模型画的字）
        rows = [r for r in A.for_screen(ctx.screen["id"], "title")
                if r.get("title_exact_match") and _canon(r.get("title_text") or "") == _canon(text)]
    if rows:
        r = rows[0]
        box, srcimg = r.get("source_box"), A.local_path(r.get("source_image") or "")
        # 共用库写明 g4_target_reference_available=false 的（原图那块已判不合格、只剩位置）：只借位置定对齐，不拿来做 G4 取色
        g4ok = r.get("g4_target_reference_available") is not False and str(r.get("g4_target_reference_available")) != "False"
        if box and srcimg:
            x0, y0, x1, y1 = box
            w = 1672 if srcimg.lower().endswith("-h.png") else 941
            auto = "center" if abs((x0 + x1) / 2 - w / 2) < 0.06 * w else "left"
            # 没有合格原图对照的新画标题：G4 改和批准样板毛笔标题标准色比（engine.render.G4_STD）
            attr = f' data-title-src="{E(srcimg)}" data-title-box="{x0},{y0},{x1},{y1}"' if g4ok else ' data-title-std="1"'
        else:  # 共用库/新画的标题没有本屏原图位置：照规格放，G4 当前屏取色记未完成（不拿生成图自己当对照）
            auto = "left" if ctx.orient == "h" else "center"
            attr = ' data-title-std="1"'
        al = sp.get("align") or auto
        src, st = _title_img(r["path"], sp, ctx, text)
        # 原图比本方向宽时按比例缩（只缩不放大）；size 档位对标题图不改尺寸（原图尺寸就是原档位）
        return (f'<div class="title-wrap title-img tb al-{al}{_size(sp)}" data-comp="chapter_title">'
                f'<img src="{src}" style="{st}" alt=""{attr}>'
                f'<span class="ghost">{E(text)}</span></div>')
    ctx.warn(f"标题“{text[:10]}”没有逐字一致的标题图，用字体兜底")
    ctx.incomplete(f"标题“{text[:10]}”没有逐字一致的标题图，用字体兜底（G4 没做）", "title")
    al = sp.get("align") or ("left" if ctx.orient == "h" else "center")
    return (f'<div class="title-wrap title-font tb al-{al}{_size(sp)}" data-comp="chapter_title"><div class="brushfont">{E(text)}</div>'
            f'<div class="brushline"></div></div>')


def section_heading(block, ctx):
    out = []
    for n in block["nodes"]:
        if n["type"] in ("h3", "group", "para") and len(out) == 0:
            t = n.get("text") or n.get("name")
            out.append(f'<div class="sechead tb" data-comp="section_heading">{ctx.inline(t)}</div>')
        else:
            out.append(node_html(n, ctx))
    return "".join(out)


# ---------- 按钮、实时条 ----------
def action_button(block, ctx):
    labels = [l for n in block["nodes"] if n["type"] == "linkrow" for l in n["links"]]
    rest = "".join(node_html(n, ctx) for n in block["nodes"] if n["type"] != "linkrow")
    return ('<div class="btnrow tb" data-comp="action_button">' + "".join(
        f'<a class="btn" {ctx.hot("button", ctx.links.get(t, ""))}>{E(t)}</a>' for t in labels) + "</div>" + rest)


def live_strip(block, ctx):
    n = next((x for x in block["nodes"] if x["type"] == "now"), None)
    frame_mode = block["spec"].get("frame_mode")
    live = block["spec"].get("keys") or ctx.screen.get("live") or []
    slots = (n or {}).get("slots") or []
    es = block["spec"].get("empty_slots")
    if es is not None and str(es).isdigit() and int(es) != (len(slots) or len(live)):
        ctx.incomplete(f"live_strip 要 {es} 个空框，定稿实时项是 {len(slots) or len(live)} 个", "composition")
    want = block["spec"].get("labels") or block["spec"].get("slots")
    if isinstance(want, list) and n and [str(x) for x in want] != slots:
        ctx.incomplete(f"live_strip 规格写的实时项 {want} 和定稿解析出的 {slots} 不一致", "composition")
    if not n:
        ctx.incomplete("live_strip 没分到“现在”行，实时条只画了空框", "composition")
    if slots:  # 每个实时项：小字名 + 留空框
        boxes = "".join(f'<div class="liveslot"><span class="livename tb">{E(w)}</span>'
                        f'<div class="livebox" {ctx.hot("live", live[i] if i < len(live) else w)}></div></div>'
                        for i, w in enumerate(slots))
    else:
        k = len(live) if live else 2
        sw = block["spec"].get("slot_width")  # 单框/固定宽：如 remote-control-01 的 "55%"
        st = f' style="flex:0 1 {E(str(sw))};max-width:{E(str(sw))}"' if sw and ctx.orient == "h" and frame_mode != "plain" else ""
        boxes = "".join(f'<div class="livebox"{st} {ctx.hot("live", live[i] if i < len(live) else i)}></div>' for i in range(k))
    fw = block["spec"].get("frame_widths")
    if slots and isinstance(fw, list) and frame_mode != "plain":  # 旧横条各实时项占宽
        parts = boxes.split('<div class="liveslot">')
        boxes = parts[0] + "".join(f'<div class="liveslot" style="flex:0 1 {E(str(fw[i]))}">' + x if i < len(fw) else '<div class="liveslot">' + x
                                   for i, x in enumerate(parts[1:]))
    btns = "".join(f'<a class="btn nowbtn tb" {ctx.hot("button", ctx.links.get(t, ""))}>{E(t)}</a>' for t in (n["links"] if n else []))
    if frame_mode == "plain":
        count = len(slots) or len(live) or 2
        grid_style = f"--live-plain-columns:{count}"
        return (f'<div class="nowbar live-plain" data-comp="live_strip" data-live-frame="plain">'
                f'<div class="nowlabel tb">{E(n["label"] if n else "现在")}</div>'
                f'<div class="live-plain-slots" style="{grid_style}">{boxes}</div>'
                f'<div class="live-plain-actions">{btns}</div></div>')
    if frame_mode not in (None, "default"):
        ctx.incomplete(f"live_strip 不支持 frame_mode={frame_mode}，保留原横条", "composition")
    ll = block["spec"].get("label_layout")
    lcls = " lbl-above" if ll == "above_frame" else ""
    if block["spec"].get("button_position") == "below":  # 驾驶舱按钮另起一行
        lcls += " btn-below"
    return (f'<div class="nowbar{lcls}" data-comp="live_strip"><div class="nowlabel tb">{E(n["label"] if n else "现在")}</div>'
            f'{boxes}{btns}</div>')


# ---------- 插画、截图位 ----------
def _ill_attrs(sp):
    """插画档位与对齐：size banner/large/medium/small，align left/center/right，target_width/target_height（像素上限）。"""
    cls = "ill"
    size = sp.get("size")
    if size in ("banner", "large", "medium", "small"):
        cls += f" {size}" if size == "banner" else f" sz-{size}"
    if sp.get("align") in ("left", "center", "right"):
        cls += f" al-{sp['align']}"
    cls += " bleed" if sp.get("bleed") else ""
    st = []

    def dim(v):  # 像素数，或 "55%" 这样的百分比
        v = str(v).strip()
        return v if v.endswith("%") else f"{int(float(v.rstrip('px')))}px"
    if sp.get("target_width"):
        st.append(f"width:{dim(sp['target_width'])};max-width:100%")
    if sp.get("target_height"):
        st.append(f"max-height:{dim(sp['target_height'])}")
    return cls, (f' style="{";".join(st)}"' if st else "")


def _illustration_motion(doc, src, sp, ctx):
    """只给已核实同 SHA 旧裁片中的已有点/箭头加透明坐标。"""
    regions = sp.get("motion_regions") or []
    if not regions:
        return doc
    import hashlib
    from urllib.parse import unquote, urlsplit
    path = unquote(urlsplit(src).path)
    if re.match(r"^/[A-Za-z]:", path):
        path = path[1:]
    with open(path, "rb") as image_file:
        same = hashlib.sha256(image_file.read()).hexdigest() == sp.get("motion_asset_sha256")
    if not same:
        ctx.incomplete("旧插画动效标记的素材指纹缺失或已变化，未加透明定位标记", "composition")
        return doc
    spans = []
    for item in regions:
        r = item.get("rect") or []
        if item.get("kind") not in ("dot", "arrow") or len(r) != 4 or any(not isinstance(x, (int, float)) for x in r) or min(r) < 0 or min(r[2:]) <= 0 or r[0] + r[2] > 1.000001 or r[1] + r[3] > 1.000001:
            ctx.incomplete("旧插画动效标记坐标无效，未加该标记", "composition")
            continue
        attr = 'data-role="status-dot"' if item["kind"] == "dot" else 'data-comp="arrow"'
        spans.append(f'<span {attr} data-motion-region="existing-art" data-motion-rect="{E(",".join(map(str, r)))}" aria-hidden="true" style="position:absolute;pointer-events:none;background:transparent;color:var(--status-on)"></span>')
    if not spans:
        return doc
    script = """<script>(()=>{const host=document.currentScript.previousElementSibling,im=host.querySelector('img');host.style.position='relative';
      const sync=()=>{if(!im.complete||!im.naturalWidth)return;const a=host.getBoundingClientRect(),b=im.getBoundingClientRect();
        let x=b.left-a.left,y=b.top-a.top,w=b.width,h=b.height;
        if(getComputedStyle(im).objectFit==='contain'){const s=Math.min(w/im.naturalWidth,h/im.naturalHeight);x+=(w-im.naturalWidth*s)/2;y+=(h-im.naturalHeight*s)/2;w=im.naturalWidth*s;h=im.naturalHeight*s;}
        for(const el of host.querySelectorAll('[data-motion-rect]')){const r=el.dataset.motionRect.split(',').map(Number);Object.assign(el.style,{left:(x+w*r[0])+'px',top:(y+h*r[1])+'px',width:(w*r[2])+'px',height:(h*r[3])+'px'});}};
      im.addEventListener('load',sync);new ResizeObserver(sync).observe(im);document.fonts.ready.then(sync);sync();})();</script>"""
    return doc[:-6] + "".join(spans) + "</div>" + script


def illustration(block, ctx):
    sp = block["spec"]
    if "gallery_assets" in sp:
        return _illustration_gallery(block, ctx)
    if sp.get("panels"):
        return _illustration_panels(sp, ctx)
    cls, st = _ill_attrs(sp)
    if sp.get("asset"):
        path = ctx.resolve(sp["asset"])
        import os
        if not os.path.exists(path):
            ctx.incomplete(f"插画素材不存在：{os.path.basename(path)}", "asset")
            return ""
        src = ctx.asset_url(path)
        return _illustration_motion(f'<div class="{cls}" data-comp="illustration"><img src="{src}" alt=""{st}></div>', src, sp, ctx)
    ills = ctx.illustrations()
    i = sp.get("index", 0)
    if i >= len(ills):
        ctx.incomplete(f"插画位（第 {i + 1} 幅）没有可用素材，留空", "asset")
        return ""
    return _illustration_motion(f'<div class="{cls}" data-comp="illustration"><img src="{ills[i]}" alt=""{st}></div>', ills[i], sp, ctx)


def _illustration_gallery(block, ctx):
    """原图注逐项配明确无字插画；缺图不造截图框，不从元数据补字。"""
    import os
    sp, nodes = block["spec"], block["nodes"]
    count = sp.get("caption_count")
    paths = sp.get("gallery_assets")
    fallback_text = lambda: "".join(node_html(n, ctx) for n in nodes)
    if (type(count) is not int or count < 1 or not isinstance(paths, list)
            or len(paths) != count or any(p is not None and (not isinstance(p, str) or not p) for p in paths)):
        ctx.incomplete("illustration.gallery_assets 需与原图注数量一致的明确路径列表", "composition")
        return fallback_text()
    captions = []
    if len(nodes) == count and all(n["type"] == "para" for n in nodes):
        captions = [n["text"] for n in nodes]
    elif len(nodes) == 1 and nodes[0]["type"] == "para":
        text = nodes[0]["text"].strip()
        if count == 1:
            captions = [text]
        else:
            match = re.fullmatch(r"(?P<caption>.+?)(?:\s+(?P=caption)){" + str(count - 1) + r"}", text)
            if match:
                captions = [match.group("caption")] * count
    if len(captions) != count:
        ctx.incomplete("illustration.gallery_assets 未能按原序分出全部原图注，保留原节点", "composition")
        return fallback_text()
    cols = sp.get("columns_v", 1) if ctx.orient == "v" else sp.get("columns", count)
    if type(cols) is not int or not 1 <= cols <= count:
        ctx.incomplete("illustration.gallery_assets 列数无效，未执行图组", "composition")
        return fallback_text()
    figures = []
    for i, (asset, caption) in enumerate(zip(paths, captions)):
        path = ctx.resolve(asset) if asset else None
        art = ""
        if path and os.path.isfile(path):
            art = f'<img src="{E(ctx.asset_url(path))}" alt="">'
        else:
            ctx.incomplete(f"无字插画图组第 {i + 1} 幅尚未交付；保留原图注，不画占位图", "asset")
        figures.append(f'<figure data-gallery-index="{i}">{art}<figcaption class="prose tb">{ctx.inline(caption)}</figcaption></figure>')
    return (f'<div class="grid core-illustration-gallery" data-comp="illustration" '
            f'style="grid-template-columns:repeat({cols},minmax(0,1fr))">{"".join(figures)}</div>')


def _illustration_panels(sp, ctx):
    """按已测原图矩形开 SVG 视窗，原 PNG 字节不改；连接箭头放在两视窗之间。"""
    import hashlib
    import os
    from PIL import Image
    path = ctx.resolve(sp.get("asset") or "")
    if not os.path.isfile(path) or hashlib.sha256(open(path, "rb").read()).hexdigest() != sp.get("panel_asset_sha256"):
        ctx.incomplete("illustration.panels 底图缺失或指纹不同，未执行矩形视窗", "composition")
        return ""
    with Image.open(path) as im:
        width, height = im.size
    rects = sp["panels"]
    if not isinstance(rects, list) or not rects or any(not isinstance(r, list) or len(r) != 4
            or any(type(v) is not int for v in r) or not (0 <= r[0] < r[2] <= width and 0 <= r[1] < r[3] <= height) for r in rects):
        ctx.incomplete("illustration.panels 需要至少一个完整有效实测矩形", "composition")
        return ""
    out = []
    for i, (x0, y0, x1, y1) in enumerate(rects):
        if i and sp.get("connector") == "arrow":
            out.append('<span class="panel-down-arrow" data-comp="arrow" aria-hidden="true"></span>')
        out.append(f'<svg class="illustration-panel" aria-hidden="true" viewBox="{x0} {y0} {x1-x0} {y1-y0}" '
                   f'style="width:100%;aspect-ratio:{x1-x0}/{y1-y0}" xmlns="http://www.w3.org/2000/svg">'
                   f'<image href="{ctx.asset_url(path)}" width="{width}" height="{height}"/></svg>')
    return f'<div class="illustration-panels" data-comp="illustration">{"".join(out)}</div>'


def screenshot(block, ctx):
    shots = ctx.screen.get("screenshots") or []
    out = []
    for i, s in enumerate(shots):
        m = re.search(r"(\d+(?:\.\d+)?)\s*[:：]\s*(\d+(?:\.\d+)?)", s.get("where", ""))
        ratio = f"{m.group(1)} / {m.group(2)}" if m else "16 / 10"
        out.append(f'<div class="shot" style="aspect-ratio:{ratio}" {ctx.hot("screenshot", i)}></div>')
    cols = min(len(out), 3 if ctx.orient == "h" else 1) or 1
    return f'<div class="grid shots" style="grid-template-columns:repeat({cols},1fr)" data-comp="screenshot">{"".join(out)}</div>'


def numbered_screenshot(block, ctx):
    """沿用真实截图空槽，在槽外列原编号索引；没有截图部位或引线语义。"""
    from engine.parse import parse

    spec = block["spec"]
    ref = spec.get("number_ref")
    indices = spec.get("indices")
    valid_ref = isinstance(ref, str) and bool(_canon(ref))
    valid_index = (isinstance(indices, list) and len(indices) == 1 and
                   type(indices[0]) is int and 0 <= indices[0] < len(ctx.screen.get("screenshots") or []))
    shot_spec = {k: v for k, v in spec.items() if k in ("indices", "ratio")}
    if not valid_index:
        shot_spec.pop("indices", None)  # 原槽照常保留，不把非法下标交给底层组件。
    content = ctx.render({"type": "screenshot", "spec": shot_spec, "nodes": block["nodes"]})
    if not valid_ref or not valid_index:
        ctx.incomplete("numbered_screenshot 缺非空原编号引用或唯一真实截图绑定", "composition")
        return content
    groups = [n for n in parse(ctx.screen.get("text", "")) if n["type"] == "steps"]
    matches = [n for n in groups if n["items"] and
               _canon(str(n["items"][0]["n"]) + (n["items"][0].get("lead") or "") +
                      n["items"][0].get("text", "")).startswith(_canon(ref))]
    if len(matches) != 1:
        ctx.incomplete("numbered_screenshot 缺唯一原编号组或唯一真实截图绑定", "composition")
        return content
    numbers = [str(item["n"]) for item in matches[0]["items"]]
    if not numbers or len(set(numbers)) != len(numbers) or any(not n.isdigit() for n in numbers):
        ctx.incomplete("numbered_screenshot 原编号必须为非重复数字", "composition")
        return content
    rail = "".join(f'<span class="badge tb" data-source-number="{E(n)}">{E(n)}</span>' for n in numbers)
    # data-echo 标注实际重复的原编号；原六条正文及编号仍在说明组件中逐字验。
    return (f'<div class="numbered-screenshot" data-comp="numbered_screenshot" '
            f'style="display:grid;grid-template-columns:minmax(0,1fr) max-content;gap:12px;align-items:stretch">'
            f'{content}<div class="screenshot-number-key" data-echo="source-number-key" '
            f'aria-label="截图说明编号" style="display:flex;flex-direction:column;justify-content:space-around;'
            f'align-items:center;gap:12px;padding:8px 0">{rail}</div></div>')


# ---------- 卡片类 ----------
def _cols(spec, n, ctx, default_h):
    if ctx.orient == "v":
        return spec.get("columns_v") or 1
    return spec.get("columns") or default_h(n)


def _stat_items(nodes):
    """数字卡条目：stats 节点；也接单张 card（**数字**｜说明）和编号条目（vault-tool-01 那种写成 1. 2. 的数字）。"""
    items, rest = [], []
    # 只有整块都是数字条目时才把单张 card / 编号条目也收成数字卡（混着别的节点时保持原顺序，不挪字）
    pure = all(n["type"] == "stats" or n["type"] == "card" or
               (n["type"] == "steps" and all(it["lead"] or it.get("cols") for it in n["items"])) for n in nodes)
    for n in nodes:
        if n["type"] == "stats":
            items += n["items"]
        elif pure and n["type"] == "card":
            items.append({"num": n["name"], "text": n["text"]})
        elif pure and n["type"] == "steps":
            for it in n["items"]:
                c = it.get("cols")
                if it["lead"]:
                    items.append({"num": it["lead"], "text": it["text"], "n": it["n"]})
                else:
                    items.append({"num": c[0], "text": "　".join(c[1:]), "n": it["n"]})
        else:
            rest.append(n)
    return items, rest


def stat_card(block, ctx):
    items, rest_nodes = _stat_items(block["nodes"])
    icons = [] if block["spec"].get("icons") == "none" else ctx.take_icons(len(items), block["spec"])
    longnum = max((len(it["num"]) for it in items), default=0) > 7
    cols = (block["spec"].get("columns_v") or (1 if longnum else 2)) if ctx.orient == "v" else (block["spec"].get("columns") or min(len(items), 4) or 1)
    cards = "".join(
        f'<div class="card stat">{f"<img class=ic src={icons[i]!r} alt=>" if icons else ""}'
        f'<div class="num tb">{('<span class="badge">' + E(it["n"]) + "</span>") if it.get("n") else ""}{ctx.inline(it["num"])}</div><div class="body tb">{ctx.inline(it["text"])}</div></div>'
        for i, it in enumerate(items))
    rest = "".join(node_html(n, ctx) for n in rest_nodes)
    return f'<div class="grid stats" style="grid-template-columns:repeat({cols},minmax(0,1fr))" data-comp="stat_card">{cards}</div>{rest}'


def _card_items(nodes):
    """把分到的节点变成卡片列表：[(name, text, extra_nodes)]。"""
    items, cur = [], None
    for n in nodes:
        t = n["type"]
        if t == "card":
            cur = [n["name"], n["text"], []]; items.append(cur)
        elif t == "bullets" and all(it["lead"] for it in n["items"]):
            for it in n["items"]:
                cur = [it["lead"], it["text"], []]; items.append(cur)
        elif t in ("group", "h3"):
            cur = [n.get("name") or n.get("text"), None, []]; items.append(cur)
        elif cur is not None:
            cur[2].append(n)
        else:
            cur = [None, None, [n]]; items.append(cur)
    return items


CARD_MODES = ("left_inside", "top_inside", "right_inside", "bottom_inside", "bottom_right_inside", "none")
TONES = {"yellow": "tone-yellow", "historical": "tone-muted", "muted": "tone-muted", "gray": "tone-muted",
         "orange": "tone-orange", "green": "tone-green"}


def _want_icons(sp):
    """规格明确要图（icons 写了 auto/列表，或 illustration 写了卡内方位）时，领不到图标就记缺素材。"""
    ic = sp.get("icons")
    return (ic == "auto" or isinstance(ic, list)) or sp.get("illustration") in ("left_inside", "top_inside", "right_inside", "above_card")


def content_card(block, ctx):
    sp = block["spec"]
    items = _card_items(block["nodes"])
    approval_node = None
    approval = sp.get("approval_mock", False)
    if type(approval) is not bool:
        ctx.incomplete("content_card.approval_mock 只接受布尔值；保留原段落", "composition")
    elif approval:
        # 审批小样取卡②第三个完整原段落，前两个正文段仍按原序排出。
        matches = [(i, j, n) for i, (_, _, extra) in enumerate(items)
                   for j, n in enumerate(extra)
                   if n["type"] == "para" and n["text"].split() == ["审批页", "保留", "不留"]]
        valid = (ctx.screen["id"] == "personal-media-02" and len(items) == 3 and len(matches) == 1
                 and matches[0][:2] == (1, 2)
                 and "".join((items[1][0] or "").split()).startswith("②拔线后")
                 and all(n["type"] == "para" for n in items[1][2][:2])
                 and "document_mock" in ctx._reg)
        if valid:
            approval_node = matches[0][2]
        else:
            ctx.incomplete("审批小样缺唯一的卡②两段正文后原三词或 document_mock 组件；保留原段落", "composition")
    if sp.get("item_illustration") not in (None, "", "none", "left_inside"):
        ctx.incomplete(f"content_card 的 item_illustration={sp['item_illustration']} 未实现", "composition")
    if sp.get("label_style") not in (None, "", "none", "green_tag"):
        ctx.incomplete(f"content_card 的 label_style={sp['label_style']} 未实现", "composition")
    mode = (sp.get("illustration_v") if ctx.orient == "v" and sp.get("illustration_v") else sp.get("illustration")) or "left_inside"
    if mode == "outside" and sp.get("media_order") == ["title", "illustration", "body"]:
        # 旧规格的 outside 指单卡原题后独立图层，保留原题→图→正文顺序。
        mode = "top_inside"; sp = dict(sp, media_order="after_heading")
    if mode == "bottom_right_inside":  # 卡内右下图：按卡内下图排、图靠右
        mode = "bottom_inside"; sp = dict(sp, _img_right=True)
    if sp.get("item_count") is not None and str(sp["item_count"]).isdigit() and int(sp["item_count"]) != len(items):
        ctx.incomplete(f"content_card 规格说 {sp['item_count']} 张卡，分到的是 {len(items)} 张", "composition")
    layout = sp.get("list_layout")
    if layout == "six_row_cards" and (len(items) != 6 or _cols(sp, len(items), ctx, lambda n: 1) != 1):
        ctx.incomplete("six_row_cards 需要六张单列原卡", "composition")
    elif layout not in (None, "", "none", "six_row_cards", "seven_plugin_theme_rows"):
        ctx.incomplete(f"content_card 的 list_layout={layout} 未实现", "composition")
    if sp.get("numbering") not in (None, "", "none", "circles"):
        ctx.incomplete(f"content_card 的 numbering={sp['numbering']} 未实现", "composition")
    if mode not in CARD_MODES:
        ctx.incomplete(f"content_card 的插画方位 {mode} 还没实现，按卡内左图排", "composition")
        mode = "left_inside"
    if sp.get("art_role") == "illustration" and not sp.get("illustration_source"):  # 旧写法：art_role/art_index = 主插画源/起点
        sp = dict(sp, illustration_source="illustration", illustration_index=sp.get("art_index", sp.get("illustration_index", 0)))
    if sp.get("illustration_source") in ("illustration", "illustrations") and mode != "none":
        # 卡内放主插画（不是小图标）：从本屏插画按顺序取，illustration_index 给起点；不够就整组不放并记缺素材
        ills = ctx.illustrations()
        k = int(sp.get("illustration_index") or 0)
        icons = ills[k:k + len(items)] if len(ills) >= k + len(items) else []
        if not icons:
            ctx.incomplete(f"content_card 要 {len(items)} 幅卡内主插画（从第 {k + 1} 幅起），本屏可用 {len(ills)} 幅，整组没放图", "asset")
    else:
        icons = [] if sp.get("icons") == "none" or mode == "none" else ctx.take_icons(len(items), block["spec"])
        if not icons and mode != "none" and sp.get("icons") != "none" and _want_icons(sp):
            ctx.incomplete(f"content_card 要 {len(items)} 个卡内图标，可用的不够，整组没放图", "asset")
    long = sum(len(it[1] or "") for it in items) / max(1, len(items)) > 60
    cols = _cols(sp, len(items), ctx, lambda n: 2 if long else min(n, 3) if n != 4 else 2)
    extra_cls = ""
    if sp.get("align") == "center":
        extra_cls += " al-center"
    tone = sp.get("tone")
    if tone in TONES:
        extra_cls += " " + TONES[tone]
    elif tone not in (None, "", "none", "default"):
        ctx.incomplete(f"content_card 的色调 tone={tone} 还没有共享样式", "composition")
    if sp.get("variant") == "isolated_dashed":
        extra_cls += " isolated-dashed"
    elif sp.get("variant") not in (None, "", "none"):
        ctx.incomplete(f"content_card 的 variant={sp['variant']} 未实现", "composition")
    if sp.get("decor") in ("leaf", "on"):  # 卡角叶子默认不画（14:4x 起）；规格要时再开
        extra_cls += " leaf"
    if sp.get("button_align") in ("bottom_right", "bottom", "bottom_left"):
        extra_cls += " btn-" + sp["button_align"].replace("_", "-")
    grid_cls = " eqh" if sp.get("equal_height") else ""
    grid_cls += " sz-icon" if sp.get("icon_size") else ""
    # 图在卡名之后、正文之前（illustration_order / media_order = after_heading，可按卡写列表）
    order = sp.get("illustration_order") or sp.get("media_order")
    corners = sp.get("corner_symbol")
    if sp.get("button_in_card") and not any(n["type"] == "linkrow" for it in items for n in it[2]):
        ctx.incomplete("content_card 要按钮在卡内，但分给它的节点里没有按钮行", "composition")
    out = []
    for i, (name, text, extra) in enumerate(items):
        positions = sp.get("illustration_positions")
        item_mode = positions[i] if isinstance(positions, list) and i < len(positions) else mode
        if item_mode not in CARD_MODES:
            ctx.incomplete(f"第 {i + 1} 张卡图位 {item_mode} 未实现", "composition")
            item_mode = mode
        underlays = sp.get("image_underlay", False)
        underlay = underlays[i] if isinstance(underlays, list) and i < len(underlays) else underlays
        if type(underlay) is not bool:
            ctx.incomplete("content_card.image_underlay 只接受布尔或逐卡布尔列表", "composition")
            underlay = False
        ua = ' data-underlay="true"' if underlay else ""
        ic = f'<div class="sideic"><img class="ic" src="{icons[i]}" alt=""{ua}></div>' if icons and item_mode != "none" else ""
        if sp.get("motion_icon_arrow") and i == 0:
            if ic:
                marker = '<span data-comp="arrow" data-motion-icon-arrow="true" aria-hidden="true" style="position:absolute;right:0;top:50%;transform:translateY(-50%);width:calc(var(--fs-body)*1.333333);height:calc(var(--fs-body)*.75);background:var(--accent);clip-path:polygon(0 20%,65% 20%,65% 0,100% 50%,65% 100%,65% 80%,0 80%);pointer-events:none"></span>'
                place = """<script>(()=>{const host=document.currentScript.parentElement,im=host.querySelector('img.ic'),a=host.querySelector('[data-motion-icon-arrow]');
                  const sync=()=>{if(!im.complete||!im.naturalWidth)return;const p=host.getBoundingClientRect(),r=im.getBoundingClientRect();let x=r.left-p.left,y=r.top-p.top,w=r.width,h=r.height;
                    if(getComputedStyle(im).objectFit==='contain'){const s=Math.min(w/im.naturalWidth,h/im.naturalHeight);x+=(w-im.naturalWidth*s)/2;y+=(h-im.naturalHeight*s)/2;w=im.naturalWidth*s;h=im.naturalHeight*s;}
                    const aw=a.getBoundingClientRect().width;Object.assign(a.style,{right:'auto',left:(x+w-aw)+'px',top:(y+h/2)+'px'});};
                  im.addEventListener('load',sync);new ResizeObserver(sync).observe(im);document.fonts.ready.then(sync);sync();})();</script>"""
                ic = ic.replace('class="sideic"', 'class="sideic" style="position:relative"').replace('</div>', marker + place + '</div>')
            else:
                ctx.incomplete("原图标箭头要求有对应图标位，当前没有图标，未新增箭头", "composition")
        oi = order[i] if isinstance(order, list) and i < len(order) else order
        mid = ic and oi in ("after_heading", "heading_image_body", ["heading", "image", "body"])
        body = ""
        if name:
            body += f'<div class="name tb">{ctx.inline(name)}</div>'
        if mid:
            body += ic.replace('class="sideic"', 'class="sideic mid"'); ic = ""
        if text:
            body += f'<div class="body tb">{ctx.inline(text)}</div>'
        body += _card_extra(extra, sp, ctx, approval_node)
        attached = [a for a in block.get("mock_attachments", []) if a.get("card_index") == i]
        if attached:
            art = "".join(ctx.render(a["block"]) for a in attached)
            # 原尾标签整节点由父引擎移动；图样插在本卡题后正文前，不复制原词。
            at = body.find('</div>') + len('</div>') if name else 0
            body = body[:at] + art + body[at:]
        cs = corners[i] if isinstance(corners, list) and i < len(corners) else corners
        if cs in ("cross", "check", "pause"):  # 卡角无字符号（画出来的形状，不是字）：退役叉/在用勾/冻结暂停
            body += f'<span class="corner-sym corner-{cs}" aria-hidden="true"></span>'
        # 卡内上图用 itop（旧样板的 .top 是首屏两栏容器，不能套在卡上）；右图 iright
        cls = "card side" + {"top_inside": " itop", "right_inside": " iright", "bottom_inside": " ibottom"}.get(item_mode, "") + ("" if icons and item_mode != "none" else " noic")
        cls += extra_cls + (" img-right" if sp.get("_img_right") else "")
        wide = ' style="grid-column:1 / -1"' if sp.get("last_full_width") and i == len(items) - 1 and len(items) > 1 else ""
        out.append(f'<div class="{cls}"{wide}>{ic}<div class="sidetext">{body}</div></div>')
    gstyle = f"grid-template-columns:repeat({cols},minmax(0,1fr))"
    iw = sp.get("illustration_width")
    if iw and str(iw).endswith("%"):  # 卡内左/右图栏占卡宽（如 38%）
        gstyle += f";--card-icon-w:{E(str(iw))}"
        grid_cls += " w-icon"
    if sp.get("icon_size"):  # 卡内图位统一尺寸（像素）：左右图是图栏宽，上下图是图位高；图在框里等比放、不裁
        gstyle += f";--card-icon:{int(float(str(sp['icon_size']).rstrip('px')))}px"
    if sp.get("grouped_items") is True:
        out = [x.replace('class="card side', 'class="card side group-item', 1) for x in out]
        return f'<div class="card grouped-items"><div class="grid sides{grid_cls}" style="{gstyle};gap:0" data-comp="content_card">{"".join(out)}</div></div>'
    if sp.get("grouped_items") not in (None, False):
        ctx.incomplete("content_card.grouped_items 只接受布尔值", "composition")
    content = f'<div class="grid sides{grid_cls}" style="{gstyle}" data-comp="content_card">{"".join(out)}</div>'
    if sp.get("connector_targets"):
        refs = sp.get("connector_target_refs") or {}
        targets = sp["connector_targets"]
        if isinstance(targets, list) and len(items) == 1 and all(isinstance(refs.get(x), str) and refs[x] for x in targets):
            # 看门狗同一原卡分两根线，不复制卡或原文。
            content = _connections(content, {"source": '.side', "targets": [{"heading": refs[x]} for x in targets], "fanout": True, "arrow": True})
        else:
            ctx.incomplete("content_card 引线缺明确目标原组名或唯一源卡", "composition")
    return content


def _card_extra(nodes, sp, ctx, approval_node=None):
    """只消费本卡已有的段落、清单与编号；标签原字仍只显示一次。"""
    out, plugin_row = [], 0
    labels = str(sp.get("paragraph_labels") or "").split("/")
    for n in nodes:
        if n is approval_node:
            out.append(ctx.render({"type": "document_mock", "spec": {"variant": "approval", "align": "center",
                                     "illustration": "none", "base_asset": "none"}, "nodes": [n]}))
        elif sp.get("numbering") == "circles" and n["type"] == "steps":
            for it in n["items"]:
                out.append(f'<div class="card-number-row"><span class="badge tb">{E(it["n"])}</span>'
                           f'<div class="body tb">{ctx.inline((it["lead"] or "") + it["text"])}</div></div>')
        elif n["type"] == "para" and sp.get("label_style") == "green_tag" and any(n["text"].startswith(x + "｜") for x in labels if x):
            lead, tail = n["text"].split("｜", 1)
            out.append(f'<p class="prose tb"><span class="card-paragraph-tag">{ctx.inline(lead)}</span>{ctx.inline(tail)}</p>')
        elif n["type"] == "para" and sp.get("list_layout") == "seven_plugin_theme_rows" and n["text"].startswith("**"):
            plugin_row += 1
            active = plugin_row in sp.get("active_icon_rows", [])
            out.append(f'<div class="card-plugin-row"><span class="plugin-symbol{ " active" if active else ""}" '
                       f'aria-hidden="true"></span><p class="prose tb">{ctx.inline(n["text"])}</p></div>')
        elif n["type"] == "bullets" and sp.get("item_illustration") == "left_inside":
            icons = ctx.take_icons(len(n["items"]), {"icons": sp["item_icons"]} if isinstance(sp.get("item_icons"), list) else None)
            if len(icons) != len(n["items"]):
                ctx.incomplete("content_card 逐项小图没有完整素材映射", "asset")
            for i, it in enumerate(n["items"]):
                raw = (it.get("lead") or "") + (it.get("text") or "")
                motion = ' data-motion-card="existing-item" class="card item-text"' if any(raw.startswith(ref) for ref in getattr(ctx, "motion_card_refs", []) if isinstance(ref, str) and ref) else ' class="item-text"'
                img = f'<img src="{icons[i]}" alt="" aria-hidden="true">' if i < len(icons) else ""
                out.append(f'<div class="card-item-row">{img}<div{motion}><p class="prose tb">'
                           f'{ctx.inline((it.get("lead") or "") + it["text"])}</p></div></div>')
        else:
            out.append(node_html(n, ctx))
    if sp.get("list_layout") == "seven_plugin_theme_rows" and plugin_row != 7:
        ctx.incomplete(f"七行插件主题卡实际找到 {plugin_row} 行", "composition")
    return "".join(out)


def _connections(content, config):
    """跨组件细线按真实DOM端口画；目标/源/坐标不足时保留原块并报告未完成。"""
    import json
    cfg = json.dumps(config, ensure_ascii=False).replace('<', '\\u003c')
    script = '''<script>(()=>{const root=document.currentScript.parentElement,c=CONFIG;
const scope=root.closest('.row')||document.querySelector('#page');
const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
svg.setAttribute('class','core-connection-lines');svg.setAttribute('aria-hidden','true');
if(getComputedStyle(scope).position==='static')scope.style.position='relative';scope.appendChild(svg);
const key=s=>s.replace(/\\s/g,'');const update=()=>{const sr=scope.getBoundingClientRect(),rr=root.getBoundingClientRect();
svg.style.left='0px';svg.style.top='0px';svg.style.width=sr.width+'px';svg.style.height=sr.height+'px';
svg.setAttribute('viewBox','0 0 '+sr.width+' '+sr.height);svg.replaceChildren();delete root.dataset.incomplete;
let sources=[...root.querySelectorAll(c.source)];if(c.fanout&&sources.length===1)sources=c.targets.map(()=>sources[0]);
if(sources.length!==c.targets.length){root.dataset.incomplete='跨组件引线源节点数量不符';return;}
const markerId='core-connection-arrow-'+(globalThis.coreConnectionNumber=(globalThis.coreConnectionNumber||0)+1);
if(c.arrow){const defs=document.createElementNS(ns,'defs'),marker=document.createElementNS(ns,'marker'),path=document.createElementNS(ns,'path');
marker.setAttribute('id',markerId);marker.setAttribute('viewBox','0 0 8 8');marker.setAttribute('refX','7');marker.setAttribute('refY','4');marker.setAttribute('markerWidth','6');marker.setAttribute('markerHeight','6');marker.setAttribute('orient','auto');
path.setAttribute('d','M0 0L8 4L0 8');path.setAttribute('fill','var(--accent)');marker.appendChild(path);defs.appendChild(marker);svg.appendChild(defs);}
for(let i=0;i<c.targets.length;i++){const a=c.targets[i];let target;
if(a.selector){const matches=[...document.querySelectorAll(a.selector)];if(matches.length===1)target=matches[0];}
else{const heads=[...scope.querySelectorAll('[data-comp=section_heading]')].filter(e=>key(e.textContent)===key(a.heading));
if(heads.length===1){target=heads[0];}}
if(!target){root.dataset.incomplete='跨组件引线目标不唯一或缺失';continue;}
const from=sources[i].getBoundingClientRect(),to=target.getBoundingClientRect();
const line=document.createElementNS(ns,'path');let points;
if(c.fanout&&to.top>=from.bottom){const x=to.left+to.width/2-sr.left,sx=Math.max(from.left-sr.left+8,Math.min(from.right-sr.left-8,x)),y=from.bottom-sr.top,ey=to.top-sr.top;
points=Math.abs(sx-x)<.5?[[sx,y],[x,ey]]:[[sx,y],[sx,(y+ey)/2],[x,(y+ey)/2],[x,ey]];}
else{const x1=from.right-sr.left,y1=from.top+from.height/2-sr.top,x2=to.left+(a.x||0)*to.width-sr.left,y2=to.top+(a.y??.5)*to.height-sr.top,m=(x1+to.left-sr.left)/2;points=[[x1,y1],[m,y1],[m,y2],[x2,y2]];}
line.setAttribute('d',points.map((p,k)=>(k?'L ':'M ')+p.join(' ')).join(' '));line.setAttribute('fill','none');
line.setAttribute('stroke','var(--accent)');line.setAttribute('stroke-width','2');if(c.dashed)line.setAttribute('stroke-dasharray','5 6');if(c.arrow)line.setAttribute('marker-end','url(#'+markerId+')');
line.dataset.connectionIndex=String(i);svg.appendChild(line);}}
requestAnimationFrame(update);document.fonts.ready.then(update);new ResizeObserver(update).observe(scope);
})();</script>'''.replace('CONFIG', cfg)
    return '<div class="core-connections" style="position:relative">' + content + script + '</div>'


def bullet_list(block, ctx):
    def motion_attr(it):
        raw = (it.get("lead") or "") + (it.get("text") or "")
        if any(isinstance(ref, str) and ref and raw.startswith(ref) for ref in getattr(ctx, "motion_card_refs", [])):
            return 'class="tb card" data-motion-card="existing-item" style="border:0;border-radius:0;background:none;box-shadow:none"'
        return 'class="tb"'
    out = []
    for n in block["nodes"]:
        if n["type"] == "bullets":
            lis = "".join(
                f'<li {motion_attr(it)}>{"<b>" + ctx.inline(it["lead"]) + "</b>　" if it["lead"] else ""}{ctx.inline(it["text"])}</li>'
                for it in n["items"])
            out.append(f'<ul class="blist">{lis}</ul>')
        else:
            out.append(node_html(n, ctx))
    inner = "".join(out)
    if block["spec"].get("bare"):
        return f'<div class="c-blist" data-comp="bullet_list">{inner}</div>'
    return f'<div class="card c-blist pad" data-comp="bullet_list">{inner}</div>'


STEP_MODES = ("above_card", "left_inside", "inside", "none", None)


def numbered_steps(block, ctx):
    sp = block["spec"]
    items = [it for n in block["nodes"] if n["type"] == "steps" for it in n["items"]]
    rest = "".join(node_html(n, ctx) for n in block["nodes"] if n["type"] != "steps")
    if sp.get("illustration") not in STEP_MODES:
        ctx.incomplete(f"numbered_steps 的插画方位 {sp.get('illustration')} 还没实现", "composition")
    if sp.get("connector") not in (None, "ribbon", "none"):
        ctx.incomplete(f"numbered_steps 的连接方式 {sp.get('connector')} 还没实现，按丝带/无连接排", "composition")
    positions = sp.get("item_illustration_v") if ctx.orient == "v" else None
    if positions is not None and (not isinstance(positions, list) or len(positions) != len(items)
            or any(p not in ("left_inside", "top_inside", "none") for p in positions)):
        ctx.incomplete("numbered_steps 的逐项图位未完整覆盖原步骤", "composition")
        positions = None
    manual = sp.get("human_action_items") or []
    if not isinstance(manual, list) or any(type(k) is not int or not 1 <= k <= len(items) for k in manual):
        ctx.incomplete("numbered_steps 的手动步骤索引无效", "composition")
        manual = []
    manual_url = ""
    if manual:
        import os
        path = ctx.resolve("_library/icons/指向手.png")
        if os.path.isfile(path):
            manual_url = ctx.asset_url(path)
        else:
            ctx.incomplete("numbered_steps 缺指向手的明确手动动作图", "asset")
    icons = [] if sp.get("icons") == "none" or sp.get("illustration") == "none" else ctx.take_icons(len(items), block["spec"])
    if not icons and sp.get("icons") != "none" and _want_icons(sp):
        ctx.incomplete(f"numbered_steps 要 {len(items)} 个图标，可用的不够，整组没放图", "asset")
    mode = "side" if ctx.orient == "h" and sp.get("item_layout") == "left_inside" else "card"
    if ctx.orient == "h" and icons:
        if sp.get("illustration") == "above_card":
            mode = "open" if sp.get("name_in_card") else "open-name"
    cols = (sp.get("columns_v") or 1) if ctx.orient == "v" else (sp.get("columns") or (len(items) if len(items) <= 6 and icons else min(3, len(items))))
    # 分张：page_break_after_item = 第几条之后换张（可写列表）；part_after_steps 同义（work-delivery-copilot）
    brk = sp.get("page_break_after_item") if sp.get("page_break_after_item") is not None else sp.get("part_after_steps")
    brk = {int(x) for x in (brk if isinstance(brk, list) else [brk]) if x is not None and str(x).isdigit()} if ctx.orient == "v" else set()
    out = []
    for i, it in enumerate(items):
        name = it["lead"] or ""
        txt = it["text"]
        c = it.get("cols")
        if c and not it["lead"]:
            name, txt = c[0], "　".join(c[1:])
        elif c and it["lead"]:  # **名**｜说明｜状态：名是 lead，其余各列是说明（不画｜）
            txt = "　".join(c[1:])
        item_position = positions[i] if positions else sp.get("illustration")
        ic = f'<img class="ic" src="{icons[i]}" alt="">' if icons and item_position != "none" else ""
        nm = f'<span class="name">{ctx.inline(name)}</span>' if name else ""
        if i + 1 in manual and manual_url:
            nm += f'<img class="manual-action" src="{manual_url}" alt="" aria-hidden="true">'
        body = f'<div class="body tb">{ctx.inline(txt)}</div>' if txt else ""
        pb = ' data-page-break-after="true"' if (i + 1) in brk and i + 1 < len(items) else ""
        if mode == "open-name":
            out.append(f'<div class="step open"{pb}><div class="stepic">{ic}</div>'
                       f'<div class="stephead tb"><span class="badge">{it["n"]}</span>{nm}</div>'
                       f'<div class="card stepbody">{body}</div></div>')
        elif mode == "open":
            out.append(f'<div class="step open"{pb}><div class="stepic">{ic}</div>'
                       f'<div class="badgerow"><span class="badge tb">{it["n"]}</span></div>'
                       f'<div class="card stepbody"><div class="stephead tb">{nm}</div>{body}</div></div>')
        elif ic and mode == "side":
            out.append(f'<div class="card step"{pb}><div class="stepic">{ic}</div>'
                       f'<div class="stephead tb"><span class="badge">{it["n"]}</span>{nm}</div>{body}</div>')
        elif ic and ctx.orient == "v" and item_position == "top_inside":
            out.append(f'<div class="card step step-top"{pb}><div class="stepic">{ic}</div>'
                       f'<div class="stephead tb"><span class="badge">{it["n"]}</span>{nm}</div>{body}</div>')
        elif ic and ctx.orient == "v":  # 竖版左图右文：编号在步骤名前，不压在图标角上
            out.append(f'<div class="card step"{pb}><div class="stepic">{ic}</div>'
                       f'<div class="stephead tb"><span class="badge">{it["n"]}</span>{nm}</div>{body}</div>')
        elif ic:
            out.append(f'<div class="card step"{pb}><div class="stepic"><span class="badge tb">{it["n"]}</span>{ic}</div>'
                       f'<div class="stephead tb">{nm}</div>{body}</div>')
        else:
            out.append(f'<div class="card step noic"{pb}><div class="stephead tb"><span class="badge">{it["n"]}</span>{nm}</div>{body}</div>')
    conn = sp.get("connector", "ribbon" if icons else "none")
    flow = ""
    if sp.get("reading_order") == "column_major" and cols > 1:  # 按列读：1–5 在左列、6–10 在右列
        rows = -(-len(items) // cols)
        flow = f";grid-auto-flow:column;grid-template-rows:repeat({rows},auto)"
    content = (f'<div class="grid steps n{len(items)} m-{mode} conn-{conn}" style="grid-template-columns:repeat({cols},minmax(0,1fr)){flow}" '
               f'data-comp="numbered_steps">{"".join(out)}</div>{rest}')
    if sp.get("annotation_target") or sp.get("annotation_connector"):
        import hashlib
        import os
        geom = sp.get("annotation_geometry") or {}
        source = geom.get("file") or ""
        points = sp.get("annotation_anchors")
        good = (sp.get("annotation_target") == "screenshot:0" and sp.get("annotation_connector") == "dashed_arrow"
                and os.path.isfile(source) and hashlib.sha256(open(source, "rb").read()).hexdigest() == geom.get("sha256")
                and isinstance(points, list) and len(points) == len(items)
                and all(isinstance(a, dict) and type(a.get('x')) in (int, float) and type(a.get('y')) in (int, float)
                        and 0 <= a['x'] <= 1 and 0 <= a['y'] <= 1 for a in points))
        if good:
            content = _connections(content, {"source": '.step', "targets": [dict(a, selector='[data-hot=screenshot][data-href="0"]') for a in points], "dashed": True, "arrow": True})
        else:
            ctx.incomplete("numbered_steps 引线缺对应截图版本的完整实测锚点", "composition")
    return content


def dialogue(block, ctx):
    ills = ctx.illustrations()
    i = block["spec"].get("speaker_index", 1 if len(ills) > 1 else 0)
    if block["spec"].get("speaker"):
        sp_img = f'<img class="speaker" src="{ctx.asset_url(ctx.resolve(block["spec"]["speaker"]))}" alt="">'
    else:
        sp_img = f'<img class="speaker" src="{ills[i]}" alt="">' if i < len(ills) else ""
    paras = "".join(f'<p>{ctx.inline(n.get("text") or "")}</p>' for n in block["nodes"] if n["type"] == "para")
    rest = "".join(node_html(n, ctx) for n in block["nodes"] if n["type"] != "para")
    return f'<div class="bubblecol" data-comp="dialogue"><div class="bubble tb">{paras}</div>{sp_img}</div>{rest}'


# ---------- 新组件的最简兜底（组件工程师的族会覆盖） ----------
def table(block, ctx):
    out = []
    for n in block["nodes"]:
        if n["type"] != "table":
            out.append(node_html(n, ctx)); continue
        head = "".join(f'<th class="tb">{ctx.inline(c)}</th>' for c in n["header"]) if n["header"] else ""
        rows = "".join("<tr>" + "".join(f'<td class="tb">{ctx.inline(c)}</td>' for c in r) + "</tr>" for r in n["rows"])
        out.append(f'<div class="card c-tablefb"><table>{"<thead><tr>" + head + "</tr></thead>" if head else ""}<tbody>{rows}</tbody></table></div>')
    return "".join(out)


def status_legend(block, ctx):
    out = []
    for n in block["nodes"]:
        if n["type"] == "legend":
            out.append('<div class="legend tb">' + "".join(
                f'<span class="lg">{ctx.inline(it["dot"])}{ctx.inline(it["text"])}</span>' for it in n["items"]) + "</div>")
        else:
            out.append(node_html(n, ctx))
    return "".join(out)


def monospace(block, ctx):
    out = []
    for n in block["nodes"]:
        if n["type"] == "code":
            out.append('<div class="card codeblock"><pre class="tb">' + E("\n".join(n["lines"])) + "</pre></div>")
        else:
            out.append(node_html(n, ctx))
    return "".join(out)


# 各组件认的规格字段（engine.layout.check_fields 用：写了别的、取值又不是 none/auto 的，记“构图未完成”）
SPEC_FIELDS = {
    "numbered_screenshot": ["indices", "ratio", "number_ref"],
    "chapter_title": ["align", "size", "asset", "source_image", "source_box", "subtitle_from", "max_width"],
    "content_card": ["columns", "columns_v", "illustration", "illustration_v", "icons", "illustration_source",
                     "illustration_index", "last_full_width", "align", "tone", "decor", "button_align", "equal_height",
                     "icon_size", "size", "button_in_card", "illustration_order", "media_order", "corner_symbol",
                     "illustration_width", "art_role", "art_index", "item_count", "motion_icon_arrow",
                     "variant", "numbering", "paragraph_labels", "label_style", "list_layout", "active_icon_rows", "approval_mock",
                     "item_illustration", "item_icons", "illustration_positions", "image_underlay", "grouped_items", "connector_targets", "connector_target_refs"],
    "numbered_steps": ["columns", "columns_v", "illustration", "icons", "connector", "name_in_card", "reading_order",
                       "page_break_after_item", "part_after_steps", "item_illustration_v", "human_action_items", "size", "item_layout",
                       "annotation_target", "annotation_connector", "annotation_anchors", "annotation_geometry"],
    "live_strip": ["keys", "labels", "slots", "slot_width", "frame_widths", "label_layout", "size", "columns", "empty_slots", "button_position", "frame_mode"],
    "illustration": ["illustration", "asset", "index", "size", "align", "bleed", "target_width", "target_height", "motion_regions", "motion_asset_sha256", "panels", "panel_asset_sha256", "connector", "gallery_assets", "caption_count", "columns", "columns_v"],
    "stat_card": ["columns", "columns_v", "icons"],
}

COMPONENTS = {
    "chapter_title": chapter_title, "section_heading": section_heading, "prose": prose,
    "action_button": action_button, "live_strip": live_strip, "illustration": illustration,
    "screenshot": screenshot, "numbered_screenshot": numbered_screenshot, "stat_card": stat_card, "content_card": content_card,
    "bullet_list": bullet_list, "numbered_steps": numbered_steps, "dialogue": dialogue,
    "table": table, "status_legend": status_legend, "monospace": monospace, "_fallback": fallback,
}

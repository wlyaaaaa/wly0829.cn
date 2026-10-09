"""生成：内容文件（src/content/pages/<页>.md）→ 每屏电脑、手机两份排好的区块 HTML（src/content/rendered/<页>.json）。

用法：python tools/render_blocks.py <页名> [<页名> ...]   或   --all        （在 site-astro 目录下运行，npm run build 会先跑它）

做法（第四轮：照现在的页面逐段对齐）
- 区块：现在网站整屏图是共用区块库 src/typeset/components（HTML + CSS）在固定画布上排好截的图。这里用同一套区块库、
  同一份样式排版，不再截图：把浏览器排好的区块（含区块自己画的连线、箭头、虚线）原样存成 HTML，网页里直接显示。
- 构图：照内容文件里写的构图（哪几块同一行、各占多宽），电脑画布 1672、手机画布 941 各排一份，显示时按栏宽等比缩放；
  没写构图的屏由区块库自动分块。不写坐标。
- 图：只用内容文件里逐条写明的图（不再查素材库映射）；原文件逐字节复制到 public/assets/，不转码、不缩图。
- 字：正文字体和现在出图用的 Noto Sans SC 是同一个文件，按每页用到的字抽成 woff2（字形不变）。
- 增量：每屏按（内容 + 区块库 + 样式）算指纹，没变的屏不重排。"""
import concurrent.futures as cf
import hashlib
import html as H
import json
import os
import re
import shutil
import sys
import time
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
REPO = os.path.dirname(SITE)
PROTO = os.path.join(REPO, "src", "typeset")
sys.path.insert(0, PROTO)
from engine import assets as A  # noqa: E402
from engine.layout import build_html, WIDTH  # noqa: E402
from engine.parse import original_markdown  # noqa: E402
from engine.registry import load as load_registry  # noqa: E402

# 三个目录都可以用环境变量换到别处（例如按活动版本试排一份规则页、不碰站点）：BLOCK_MD_DIR、BLOCK_OUT_DIR、BLOCK_PUB_DIR
MD_DIR = os.environ.get("BLOCK_MD_DIR") or os.path.join(SITE, "src", "content", "pages")
OUT_DIR = os.environ.get("BLOCK_OUT_DIR") or os.path.join(SITE, "src", "content", "rendered")
PUB = os.environ.get("BLOCK_PUB_DIR") or os.path.join(SITE, "public")
WORK = os.path.join(SITE, ".cache", "blocks")
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
SANS_FONT = "C:/Windows/Fonts/NotoSansSC-VF.ttf"
CSS_OUT = os.path.join(PUB, "assets", "_typeset", "typeset.css")
RENDER_VERSION = "r4-8"  # 排版做法改了就换，旧结果全部重排


def file_url_to_path(u):
    p = urllib.parse.unquote(u[len("file:///"):])
    return os.path.normpath(p)


def sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


# —— 素材发布：本地原文件逐字节复制到 public 下，返回网址 ——
def _under(p, root):
    try:
        return not os.path.relpath(p, root).startswith("..")
    except ValueError:  # 不同盘
        return False


def publish_path(p):
    p = os.path.normpath(p)
    if _under(p, os.path.join(REPO, "sources", "assets")):
        rel = os.path.relpath(p, os.path.join(REPO, "sources", "assets")).replace("\\", "/"); dst = os.path.join(PUB, "assets", *rel.split("/")); url = "/assets/" + rel
    elif _under(p, os.path.join(REPO, ".publish", "typeset-out", "_cache")):
        rel = "_titles/" + os.path.basename(p); dst = os.path.join(PUB, "assets", "_titles", os.path.basename(p)); url = "/assets/" + rel
    elif _under(p, PROTO):
        rel = "_typeset/" + os.path.relpath(p, PROTO).replace("\\", "/"); dst = os.path.join(PUB, "assets", *rel.split("/")); url = "/assets/" + rel
    elif _under(p, REPO):
        rel = "_repo/" + os.path.relpath(p, REPO).replace("\\", "/"); dst = os.path.join(PUB, "assets", *rel.split("/")); url = "/assets/" + rel
    else:
        raise ValueError("仓库外的文件不发布：" + p)
    if not os.path.exists(dst) or os.path.getsize(dst) != os.path.getsize(p):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(p, dst)
    return urllib.parse.quote(url, safe="/")


def rewrite_urls(text):
    return re.sub(r'file:///[^"\'\)\s<>]+', lambda m: publish_path(file_url_to_path(m.group(0))), text)


# —— 区块样式：原样搬过来，只把选择器限定在画布 .ts-canvas 里（不影响页头页尾），出图时的视口单位换成画布单位 ——
def _split_top(css):
    """顶层切成 (前导, 块体) 列表；跳过注释和字符串。"""
    out, i, n, start = [], 0, len(css), 0
    depth, head_start = 0, 0
    while i < n:
        c = css[i]
        if css.startswith("/*", i):
            j = css.find("*/", i + 2); i = n if j < 0 else j + 2; continue
        if c in "\"'":
            j = i + 1
            while j < n and css[j] != c:
                j += 2 if css[j] == "\\" else 1
            i = j + 1; continue
        if c == "{":
            if depth == 0:
                head = css[head_start:i]; body_start = i + 1
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                out.append((head.strip(), css[body_start:i])); head_start = i + 1
        elif c == ";" and depth == 0:
            out.append((css[head_start:i].strip(), None)); head_start = i + 1
        i += 1
    return out


def _split_selectors(sel):
    parts, depth, cur = [], 0, ""
    for ch in sel:
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth -= 1
        if ch == "," and depth == 0:
            parts.append(cur); cur = ""
        else:
            cur += ch
    parts.append(cur)
    return [p.strip() for p in parts if p.strip()]


ROOT = ".ts-canvas"


def _scope(sel):
    sel = re.sub(r"/\*.*?\*/", "", sel, flags=re.S).strip()
    if sel in (":root",):
        return ROOT
    if sel == "*":
        return f"{ROOT} *"
    m = re.match(r"^(html|body)((?:[.#:\[][^\s>+~]*)?)(.*)$", sel)
    if m:
        rest = m.group(3)
        # body 后面紧跟 #page：同一个元素
        rest = re.sub(r"^\s*#page\b", ":is(#ts-page,.ts-canvas)", rest)
        return f"{ROOT}:not(ts-z){m.group(2)}{rest}"
    m = re.match(r"^(\.o-[hv]|\.shape-[\w-]+)((?:\.[\w-]+)*)(\s+#page\b)?(.*)$", sel)
    if m:  # 画布方向、外形写在 body 上：现在就是画布本身（外形类改名 ts-shape-*，免得撞上站点给整屏卡片定的 .shape-* 规则）
        page = ":is(#ts-page,.ts-canvas)" if m.group(3) else ""
        cls = (m.group(1) + m.group(2)).replace(".shape-", ".ts-shape-")
        return f"{ROOT}{cls}{page}{m.group(4)}"
    if sel.startswith("#page"):
        return ":is(#ts-page,.ts-canvas)" + sel[len("#page"):]
    return f"{ROOT} {sel}"


def _vw(body):
    body = re.sub(r"(-?\d*\.?\d+)vw\b", r"calc(\1 * var(--ts-vw))", body)
    return re.sub(r"(-?\d*\.?\d+)vh\b", r"calc(\1 * var(--ts-vh))", body)


def _rules(css, base_dir, in_v=False):
    out = []
    for head, body in _split_top(css):
        head = re.sub(r"/\*.*?\*/", "", head, flags=re.S).strip()
        if body is None:
            if head.startswith("@import"):
                m = re.search(r'url\(["\']?([^"\')]+)["\']?\)', head) or re.search(r'["\']([^"\']+)["\']', head)
                p = os.path.normpath(os.path.join(base_dir, m.group(1)))
                out.append(_rules(open(p, encoding="utf-8").read(), os.path.dirname(p), in_v))
            continue
        if head.startswith("@font-face"):
            continue  # 字体另由每页的字体子集提供（同一个字体文件）
        body = re.sub(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', lambda m: _url(m.group(1), base_dir), body)
        if head.startswith("@media"):
            if re.search(r"max-width:\s*1000px", head):  # 出图时只有手机画布（941）窄于 1000
                out.append(_rules(body, base_dir, True)); continue
            out.append(head + "{" + _rules(body, base_dir, in_v) + "}"); continue
        if head.startswith("@keyframes") or head.startswith("@supports") or head.startswith("@"):
            out.append(head + "{" + body + "}"); continue
        sels = [_scope(s) for s in _split_selectors(head)]
        if in_v:
            sels = [s.replace(ROOT, ROOT + ".o-v", 1) if s.startswith(ROOT) else s for s in sels]
        out.append(",".join(sels) + "{" + _vw(body) + "}")
    return "\n".join(out)


def _url(u, base_dir):
    if u.startswith("data:") or u.startswith("http") or u.startswith("/assets/"):
        return f'url("{u}")'
    if u.startswith("file:///"):
        p = file_url_to_path(u)
    else:
        p = os.path.normpath(os.path.join(base_dir, u))
    if not os.path.exists(p):
        return f'url("{u}")'
    return f'url("{publish_path(p)}")'


def build_css(css_files):
    parts = [f"/* 由 tools/render_blocks.py 从 src/typeset 的区块样式原样生成；选择器限定在画布 {ROOT} 里 */",
             f"{ROOT}{{--ts-vw:16.72px;--ts-vh:2px}}{ROOT}.o-v{{--ts-vw:9.41px}}"]
    for f in css_files:
        parts.append(f"/* {os.path.relpath(f, REPO)} */")
        parts.append(_rules(open(f, encoding="utf-8").read(), os.path.dirname(f)))
    css = "\n".join(parts) + "\n"
    os.makedirs(os.path.dirname(CSS_OUT), exist_ok=True)
    old = open(CSS_OUT, encoding="utf-8").read() if os.path.exists(CSS_OUT) else None
    if old != css:
        open(CSS_OUT, "w", encoding="utf-8", newline="\n").write(css)
    return hashlib.sha256(css.encode()).hexdigest()[:12]


# —— 内容文件 ——
def parse_md(path):
    src = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n", src, re.S)
    fm = json.loads(m.group(1))
    body = src[m.end():]
    screens = []
    for chunk in re.split(r"(?m)^(?=::screen\{)", body):
        if not chunk.startswith("::screen{"):
            continue
        mm = re.match(r"::screen\{[^\n]*\}\n\n```typeset\n(.*?)\n```\n\n?(.*)$", chunk, re.S)
        if not mm:
            raise SystemExit(f"{path}: 屏格式不对：{chunk[:80]}")
        meta = json.loads(mm.group(1))
        text = mm.group(2)
        text = text[:-1] if text.endswith("\n") else text
        screens.append((meta, text))
    return fm, screens


def library_fingerprint():
    h = hashlib.sha256()
    for root, _, files in os.walk(PROTO):
        if "__pycache__" in root or os.sep + "assets" in root[len(PROTO):] and False:
            continue
        for f in sorted(files):
            if f.endswith((".py", ".css", ".js")):
                p = os.path.join(root, f); h.update(p.encode()); h.update(open(p, "rb").read())
    return h.hexdigest()[:16]


def prepare_page(name, reg, css_files, libfp):
    """在本进程里排出这一页每屏两份的 HTML 文件（交给浏览器排版），返回待排清单。"""
    fm, screens = parse_md(os.path.join(MD_DIR, name + ".md"))
    page = dict(fm["page"]); page["screens"] = []
    for meta, text in screens:
        s = dict(meta["screen"]); s["text"] = text
        if s["id"] in page.get("withdrawn_screenshot_screens", []):
            s["screenshots"] = []
        else:
            s["screenshots"] = s.get("screenshots", [])
        page["screens"].append(s)
    # 图：只用内容文件写明的
    A._manifest = {}
    for meta, _ in screens:
        rows = []
        for r in meta.get("images", []):
            r = dict(r); r["path"] = os.path.join(A.ASSET_ROOT, r["asset"]); r["_lib"] = True
            r.setdefault("status", "ready")  # 内容文件只写发布标记 ready 的图
            r.setdefault("title_exact_match", r.get("text_verified"))
            if os.path.exists(r["path"]):
                rows.append(r)
            else:
                print(f"  {meta['screen']['id']}: 内容文件写的图不存在 {r['asset']}")
        # 品牌图标行（via=brand）是区块库按“<品牌>标志”在整个素材库里认的图，不属于这一屏的图位：单独放一组，
        # 按名字认图时找得到，按图位顺序领图时不会占位（和现在出图时一样）
        A._manifest[meta["screen"]["id"]] = [r for r in rows if r.get("via") != "brand"]
        if any(r.get("via") == "brand" for r in rows):
            A._manifest["_brand/" + meta["screen"]["id"]] = [r for r in rows if r.get("via") == "brand"]
    jobs = []
    os.makedirs(os.path.join(WORK, name), exist_ok=True)
    for (meta, text), s in zip(screens, page["screens"]):
        lay = meta.get("layout", {})
        for o in ("h", "v"):
            sp = lay.get(o)
            if o == "v" and (sp or {}).get("portrait_required") is not True:
                # 和现在出图一样：独立卡（shape=card）、构图写了不要竖版的，手机上照用电脑那份
                if s.get("shape") == "card" or any((x or {}).get("portrait_required") is False for x in lay.values()):
                    continue
            key = hashlib.sha256(json.dumps([libfp, meta, text, o], ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:20]
            doc, info = build_html(page, s, o, reg, css_files, sp)
            hp = os.path.join(WORK, name, f"{s['id']}-{o}.html")
            with open(hp, "w", encoding="utf-8", newline="\n" if original_markdown(s) else None) as f:
                f.write(doc)
            jobs.append({"page": name, "screen": s["id"], "o": o, "html": hp, "key": key, "shape": s.get("shape") or "",
                         "replace": s.get("display_replace") or {},
                         "notes": info["notes"], "incomplete": info["incomplete"]})
    return fm, page, jobs


HYDRATE_JS = r"""async (bind) => {
  await document.fonts.ready;
  const fit = %FIT%; fit();
  await window.__typesetReady;
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const main = document.getElementById('page');
  // 区块自己的脚本已经画完（连线、箭头、虚线），HTML 里不再带脚本
  main.querySelectorAll('script').forEach(s => s.remove());
  // 图片固定成排好的大小：画布宽度不变，图没下载完时版面也不跳
  const imgs = [...main.querySelectorAll('img')];
  for (const im of imgs) {
    const r = im.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      im.setAttribute('data-ts-w', Math.round(r.width * 100) / 100);
      im.setAttribute('data-ts-h', Math.round(r.height * 100) / 100);
      im.style.width = (Math.round(r.width * 100) / 100) + 'px'; im.style.height = (Math.round(r.height * 100) / 100) + 'px';
    }
  }
  // 链接：现在网站是图上的热区，这里换成真链接（地址照原样）
  main.querySelectorAll('a[data-href]').forEach(a => { if (!a.getAttribute('href')) a.setAttribute('href', a.dataset.href); });
  main.querySelectorAll('[data-href]:not(a)').forEach(e => { e.setAttribute('role', 'link'); e.setAttribute('tabindex', '0'); });
  // 环境动画绑在哪张图：现在网站动画框住的那块（按整屏图比例）对上面积最大的图
  let art = null;
  if (bind) {
    const W = document.documentElement.scrollWidth, Hh = document.documentElement.scrollHeight;
    const R = {x: bind[0] * W, y: bind[1] * Hh, w: bind[2] * W, h: bind[3] * Hh};
    let best = 0;
    for (const im of imgs) {
      const q = im.getBoundingClientRect(); const x = q.left + scrollX, y = q.top + scrollY;
      const ix = Math.max(0, Math.min(x + q.width, R.x + R.w) - Math.max(x, R.x)), iy = Math.max(0, Math.min(y + q.height, R.y + R.h) - Math.max(y, R.y));
      const iou = ix * iy / (q.width * q.height + R.w * R.h - ix * iy);
      if (iou > best) { best = iou; art = im; }
    }
    if (art && best > 0.5) { art.setAttribute('data-ts-art', String(Math.round(best * 1000) / 1000)); } else art = null;
  }
  let artBox = null;
  if (art) {  // 插画在画布里的位置（画布像素）：动画层放在画布外面的同一位置（画布是整体缩放的，动画引擎按屏幕像素量尺寸）
    const p = main.getBoundingClientRect(), q = art.getBoundingClientRect();
    artBox = [q.left - p.left, q.top - p.top, q.width, q.height].map(v => Math.round(v * 100) / 100);
  }
  const titles = [...main.querySelectorAll('.title-img img')].map(i => i.getAttribute('src'));
  return {html: main.innerHTML, style: main.getAttribute('style') || '', height: Math.ceil(document.documentElement.scrollHeight),
          width: document.documentElement.scrollWidth, art: art ? art.getAttribute('src') : null, artBox, titles};
}"""


def hydrate(jobs, binds):
    from playwright.sync_api import sync_playwright
    from engine.render import FIT_JS as fit
    js = HYDRATE_JS.replace("%FIT%", fit)
    out = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None, headless=True,
                              args=["--disable-gpu", "--disable-lcd-text"])
        for j in jobs:
            pg = b.new_page(viewport={"width": WIDTH[j["o"]], "height": 200}, device_scale_factor=1)
            try:
                pg.goto("file:///" + j["html"].replace("\\", "/"))
                r = pg.evaluate(js, binds.get((j["screen"], j["o"])))
            except Exception as e:  # 一屏出错不拦别的屏，记下来
                print(f"  {j['screen']}-{j['o']} 排版出错：{repr(e)[:160]}", flush=True)
                r = None
            pg.close()
            if r:
                out.append({**j, **r})
        b.close()
    return out


def font_subset(name, texts):
    """正文字体子集：和出图时同一个字体文件，只留这一页用到的字。"""
    from fontTools import subset
    chars = set("".join(texts)) | set("　，。、：；！？“”‘’（）《》…—·0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -_/.:%+()[]")
    txt = "".join(sorted(chars))
    key = hashlib.sha256((txt + sha(SANS_FONT)[:12]).encode()).hexdigest()[:12]
    rel = f"_fonts/{name}-{key}.woff2"
    dst = os.path.join(PUB, "assets", *rel.split("/"))
    if not os.path.exists(dst):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["*"]; opts.name_IDs = ["*"]; opts.notdef_outline = True
        opts.hinting = True; opts.drop_tables = []
        f = subset.load_font(SANS_FONT, opts)
        sub = subset.Subsetter(opts); sub.populate(text=txt); sub.subset(f)
        subset.save_font(f, dst, opts)
    return "/assets/" + rel


RULE_FRAMES = ("rule-paper/source-frame-h.webp", "rule-paper/source-frame-v.webp")


def rule_original_html(body):
    """规则原文屏的“网页字”正文：和现在网站一样，取横版排好的原文卡正文（ct-source-body 子树），
    再走公开投影 rule_original_contract.project_original_html（去掉图、链接换成公开地址）。取不到返回空串。"""
    from html.parser import HTMLParser
    sys.path.insert(0, os.path.join(REPO, "scripts"))
    import rule_original_contract as rc

    class Cards(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=False); self.stack = []; self.parts = []
        def handle_starttag(self, tag, attrs):
            data = dict(attrs)
            inherited = self.stack[-1][2] if self.stack else False
            classes = set((data.get("class") or "").split())
            # 原文根：原文卡正文，或原文屏里单独的原文表格（和 rule_original_contract.source_root 同一规则；这里只处理原文屏，不再看 body/main）
            selected = bool(classes & {"ct-source-body", "source-prose"}) or (
                tag == "div" and "c-table" in classes and data.get("data-comp") == "table"
                and not rc.source_node_excluded(data) and not any(rc.source_node_excluded(a) for _, a, _ in self.stack))
            active = inherited or selected
            if active:
                opening = self.get_starttag_text()
                if selected and not inherited:
                    opening = rc.source_root_opening(tag, attrs, opening)
                self.parts.append(opening)
            if tag not in rc.HTML_VOID_TAGS:
                self.stack.append((tag, data, active))
        def handle_startendtag(self, tag, attrs):
            self.handle_starttag(tag, attrs)
            if tag not in rc.HTML_VOID_TAGS:
                self.handle_endtag(tag)
        def handle_endtag(self, tag):
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    if self.stack[i][2]:
                        self.parts.append("</" + tag + ">")
                    del self.stack[i:]; break
        def handle_data(self, v):
            if self.stack and self.stack[-1][2]: self.parts.append(v)
        def handle_entityref(self, n):
            if self.stack and self.stack[-1][2]: self.parts.append("&" + n + ";")
        def handle_charref(self, n):
            if self.stack and self.stack[-1][2]: self.parts.append("&#" + n + ";")
    c = Cards(); c.feed(body)
    raw = "".join(c.parts)
    # 去掉排版脚本在浏览器里加的标记（断行用的 text-wrap 和英文词包裹），回到和现在网站一样的原文卡 HTML
    raw = re.sub(r'\s*style="text-wrap-style: pretty;"', "", raw)
    raw = re.sub(r'\shref="[^"]*"', "", raw)  # 生成时给链接补的 href（现在网站的原文卡只有 data-href，由公开投影换成公开地址）
    for _ in range(4):  # 浏览器序列化时空属性写成 x=""，还原成原来的 x（一个标签里可能有几个）
        raw = re.sub(r'(<[^>]*\s[\w-]+)=""', r"\1", raw)
    for _ in range(3):
        raw = re.sub(r'<span data-typeset-word="true">([^<]*)</span>', r"\1", raw)
    if not raw.strip():
        return ""
    html_out = rc.project_original_html(raw)
    # 规则文件开头的“owner: E:\.agents”是给维护者看的元信息，页面上不显示（主持 10 月 10 日）
    return re.sub(r'<p\b[^>]*>\s*owner:.*?</p>', "", html_out, count=1, flags=re.S)


def fill_shot_frames(body):
    """截图、照片格子（data-shot-source）：现在网站是打开页面时由脚本把缩略图贴进格子；这里生成时直接放进去，
    按原比例完整放进（contain），点开看原图（data-shot-full-source）。文件不在就留空格子并提示。"""
    def one(m):
        tag = m.group(0)
        src = H.unescape(m.group(1))
        full = re.search(r'data-shot-full-source="([^"]*)"', tag)
        fit = re.search(r'data-shot-fit="([^"]*)"', tag)
        p = os.path.join(REPO, *src.replace("\\", "/").split("/"))
        if not os.path.isfile(p):
            print("  截图格子的图不在：", src, flush=True)
            return tag
        url = publish_path(p)
        href = None
        if full:
            fp = os.path.join(REPO, *H.unescape(full.group(1)).replace("\\", "/").split("/"))
            href = publish_path(fp) if os.path.isfile(fp) else None
        tag = re.sub(r'\sdata-href="[^"]*"', "", tag)
        tag = tag[:-1] + (f' data-href="{H.escape(href, quote=True)}"' if href else "") + ">"
        tag = tag.replace('style="', 'style="position:relative;', 1) if 'style="' in tag else tag[:-1] + ' style="position:relative">'
        img = (f'<img src="{H.escape(url, quote=True)}" alt="" loading="lazy" decoding="async" '
               f'style="position:absolute;inset:0;width:100%;height:100%;object-fit:{(fit.group(1) if fit else "contain") or "contain"}">')
        return tag + img
    return re.sub(r'<div class="slot-shot-frame[^"]*"[^>]*data-shot-source="([^"]+)"[^>]*>', one, body)


def rename_site_classes(body):
    """画布里和站点全局样式撞名的类改名：站点给 .source-prose 定了段距、表格、粗体等整套样式（规则原文页用），
    区块库只拿这个类当“原文正文”的标记、没有给它写样式。不改名的话站点那套会进画布，段落多出 1.1em 段距、
    表格多出边框和最小宽度，屏就比现在高（第四轮 D 类：约法 02、隐私 09 等）。区块库自己的样式不受影响。"""
    def one(m):
        names = ["ts-source-prose" if c == "source-prose" else c for c in m.group(2).split()]
        return m.group(1) + " ".join(names) + m.group(3)
    return re.sub(r'(\bclass=")([^"]*)(")', one, body)


def finish_page(name, fm, results, cssv):
    rt_p = os.path.join(SITE, "src", "chrome", "runtime", name + ".json")
    rt = json.load(open(rt_p, encoding="utf-8")) if os.path.exists(rt_p) else {}
    living = f"/_living/{name}/astro/config.json" if os.path.exists(os.path.join(PUB, "_living", name, "astro", "config.json")) else None
    screens, order, texts = {}, [], []
    motion = None
    for r in results:
        sid = r["screen"]
        if sid not in screens:
            screens[sid] = {"id": sid}; order.append(sid)
        body = rename_site_classes(fill_shot_frames(r["html"]))
        for a, b in (r.get("replace") or {}).items():  # 内容文件写明的“显示时替换”（规则原文首行标签）
            body = body.replace(a, b)
        art_src = r.get("art")
        first = sid == (order[0] if order else sid)
        # 图片：第一屏的毛笔标题和插画同步解码（下载完的那一帧就整张画出来）；后面几屏的图滚到附近再下载
        if first:
            body = re.sub(r'<img(?![^>]*\bdecoding=)([^>]*(?:data-title-std|data-ts-art)[^>]*)>', r'<img decoding="sync"\1>', body)
        else:
            body = re.sub(r'<img(?![^>]*\bloading=)', '<img loading="lazy"', body)
        overlay = ""
        if art_src and living and r.get("artBox"):
            # 动画宿主放在画布外、和插画同一位置（画布整体缩放，宿主不缩放，引擎量到的尺寸就是屏幕上的尺寸）；
            # 宿主里是同一张图（同一个地址，只下载一次），静态图一直在，动画画好第一帧才盖上
            x, y, w, h = r["artBox"]
            overlay = (f'<figure class="ts-art" data-living-config="{living}" data-art-key="%ART_KEY%" '
                       f'style="left:calc({x}px * var(--tz));top:calc({y}px * var(--tz));width:calc({w}px * var(--tz));height:calc({h}px * var(--tz))">'
                       f'<img src="{art_src}" alt="" decoding="sync"></figure>')
        body = rewrite_urls(body)
        style = rewrite_urls(r["style"])
        screens[sid][r["o"]] = {"html": body, "style": style, "height": r["height"], "shape": r["shape"], "overlay": rewrite_urls(overlay)}
        texts.append(re.sub(r"<[^>]+>", "", H.unescape(body)))
        if art_src and r["o"] == "h" and living:
            motion = {"screen": sid, "art_url": publish_path(file_url_to_path(art_src))}
        if r["o"] == "h" and r.get("titles") and motion is not None and motion.get("screen") == sid and "brush_url" not in motion:
            motion["brush_url"] = publish_path(file_url_to_path(r["titles"][0])) if r["titles"][0].startswith("file:///") else None
    font = font_subset(name, texts + [fm.get("title", ""), fm.get("tagline", "")])
    # 翻页过渡要的“这页的插画和标题是哪张图”：按文件内容算指纹
    mm = None
    if motion:
        def meta(url):
            if not url:
                return None
            p = os.path.join(PUB, *urllib.parse.unquote(url).lstrip("/").split("/"))
            from PIL import Image
            with Image.open(p) as im:
                size = list(im.size)
            return {"src": url, "size": size, "key": sha(p)}
        mm = {"screen": motion["screen"], "art": meta(motion.get("art_url")), "brush": meta(motion.get("brush_url"))}
        for sid in screens:
            for o in ("h", "v"):
                if o in screens[sid] and mm["art"]:
                    screens[sid][o]["overlay"] = screens[sid][o].get("overlay", "").replace("%ART_KEY%", mm["art"]["key"])
        if mm["brush"]:
            sid = mm["screen"]
            for o in ("h", "v"):
                if o in screens[sid]:
                    screens[sid][o]["html"] = screens[sid][o]["html"].replace(
                        f'src="{mm["brush"]["src"]}"', f'src="{mm["brush"]["src"]}" data-title-key="{mm["brush"]["key"]}"', 1)
    # 规则原文屏：页面上只出网页字原文（水彩框，和现在网站同一取法），上面一行版本标签；排好的原文卡不再另出一份（主持 10 月 10 日）
    if (fm.get("url") or "").startswith("/rules/"):
        md_text = {m["screen"]["id"]: t for m, t in parse_md(os.path.join(MD_DIR, name + ".md"))[1]}
        for r in results:
            if r["o"] == "h" and r.get("shape") == "source_text" and r["screen"] in screens:
                art = rule_original_html(r["html"])
                if art:
                    screens[r["screen"]]["article"] = art
                    first = next((x.strip() for x in md_text.get(r["screen"], "").split("\n") if x.strip()), "")
                    first = first.lstrip("#").strip().strip("*").strip()
                    for a, b in (r.get("replace") or {}).items():
                        first = first.replace(a, b)
                    if re.search(r"E\d+", first):  # “原文 · E230 版 · 续”“约法 · L18–L23 · E230”这类版本标签行
                        screens[r["screen"]]["article_label"] = first
                else:
                    print(f"  {r['screen']}：原文屏取不到原文正文，不出网页字", flush=True)
    out = {"page": name, "css": f"/assets/_typeset/typeset.css?v={cssv}", "font": font, "motion": mm,
           "sections": [], "screens": [screens[s] for s in order]}
    sec_seen = set()
    fm_screens = {m["screen"]["id"]: m["screen"] for m, _ in parse_md(os.path.join(MD_DIR, name + ".md"))[1]}
    # 屏内定位点（和现在网站同一取法）：内容文件里每屏的 anchors，加上现在网站页面数据里这屏的 screen_anchors
    # （规则页的小节别名、约法的 L1…L30 等）。别的页链到“/rules/charter/#L18”“/how/#agents”这种细位置时，落在所属那一屏的开头。
    page_points = {}
    m = re.search(r'<script id="page-data" type="application/json">(.*?)</script>', rt.get("tail", ""), re.S)
    if m:
        try:
            page_points = {x.get("id"): x.get("screen_anchors") or [] for x in json.loads(m.group(1)).get("screens") or []}
        except ValueError:
            page_points = {}
    # 本页的小节名留给小节锚点（目录条“#practice”要落到那一节开头，不落到别处同名的定位点上）
    all_secs = {fm_screens.get(s["id"], {}).get("section") for s in out["screens"]} - {None, ""}
    for s in out["screens"]:
        sec = fm_screens.get(s["id"], {}).get("section")
        s["section"] = sec
        if sec and sec not in sec_seen:
            sec_seen.add(sec); s["anchor"] = sec
        ids = [a.get("id") if isinstance(a, dict) else a for a in fm_screens.get(s["id"], {}).get("anchors") or []]
        ids = [a for a in dict.fromkeys(ids + page_points.get(s["id"], [])) if a and a not in sec_seen and a not in all_secs and a != s["id"]]
        sec_seen.update(ids)
        if ids:
            s["points"] = ids
    os.makedirs(OUT_DIR, exist_ok=True)
    json.dump(out, open(os.path.join(OUT_DIR, name + ".json"), "w", encoding="utf-8", newline="\n"), ensure_ascii=False)
    return out


def bindings(name, first_screen):
    rt_p = os.path.join(SITE, "src", "chrome", "runtime", name + ".json")
    if not os.path.exists(rt_p):
        return {}
    rt = json.load(open(rt_p, encoding="utf-8"))
    lb = rt.get("living_binding") or {}
    sid = (rt.get("album") or {}).get("entry") or first_screen
    return {(sid, o): lb[o]["rect"] for o in ("h", "v") if o in lb and lb[o].get("rect")}


def run(names, workers=6):
    t0 = time.time()
    os.chdir(REPO)  # page.json 里截图等路径相对仓库根（和现在出图时一样）
    mount = os.path.join(SITE, "src", "scripts", "living-mount.js")
    os.makedirs(os.path.join(PUB, "_living"), exist_ok=True)
    shutil.copyfile(mount, os.path.join(PUB, "_living", "living-mount.js"))
    for f in RULE_FRAMES:
        publish_path(os.path.join(REPO, "sources", "assets", *f.split("/")))
    reg, owner, css, warn = load_registry()
    css_files = [os.path.join(PROTO, "style", "base.css")] + css
    cssv = build_css(css_files)
    libfp = library_fingerprint() + cssv + RENDER_VERSION
    all_jobs, fms, binds = [], {}, {}
    failed = []
    for n in names:
        try:
            fm, page, jobs = prepare_page(n, reg, css_files, libfp)
        except Exception as e:  # 一页出错不拦别的页，最后列出来
            failed.append(n); print(f"{n}：区块库排这一页出错 {repr(e)[:200]}", flush=True); continue
        fms[n] = fm; all_jobs += jobs
        if page["screens"]:
            binds.update(bindings(n, page["screens"][0]["id"]))
    names = [n for n in names if n not in failed]
    # 增量：指纹没变的屏用上次的结果
    cache_p = os.path.join(WORK, "_cache.json")
    cache = json.load(open(cache_p, encoding="utf-8")) if os.path.exists(cache_p) else {}
    todo = [j for j in all_jobs if j["key"] not in cache]
    print(f"区块排版：{len(all_jobs)} 份（{len(names)} 页），要重排 {len(todo)} 份，用时 {time.time() - t0:.1f} 秒准备")
    chunks = [todo[i::workers] for i in range(workers)] if todo else []
    done = []
    if chunks:
        with cf.ProcessPoolExecutor(max_workers=len(chunks)) as ex:
            for res in ex.map(hydrate, chunks, [binds] * len(chunks)):
                done += res
    for r in done:
        cache[r["key"]] = {k: r.get(k) for k in ("html", "style", "height", "width", "art", "artBox", "titles")}
    json.dump(cache, open(cache_p, "w", encoding="utf-8"), ensure_ascii=False)
    by_page = {}
    for j in all_jobs:
        if j["key"] in cache:
            by_page.setdefault(j["page"], []).append({**j, **cache[j["key"]]})
    for n in names:
        try:
            finish_page(n, fms[n], by_page.get(n, []), cssv)
        except Exception as e:
            failed.append(n); print(f"{n}：收尾出错 {repr(e)[:200]}", flush=True)
    fix_dead_fragments([n for n in names if n not in failed])
    print(f"区块排版完成：{len(names) - len([f for f in failed if f in names])} 页，{time.time() - t0:.1f} 秒；出错 {len(failed)} 页 {failed}")


# 页面外壳里固定有的锚点（页头“开头”、跳到正文、项目页的“复制 AI 续作说明”）
CHROME_IDS = {"top", "content", "ai-brief"}


def fix_dead_fragments(names):
    """站内链接带的 #锚点在目标页里找不到时，退回到目标页本身（现在网站上这类链接也是指向页面开头）。
    目标页不在这次构建里（首页、驾驶舱由别的任务合入）的不动。"""
    ids_by_url = {}
    for f in os.listdir(OUT_DIR):
        n = f[:-5]
        if not f.endswith(".json") or not os.path.exists(os.path.join(MD_DIR, n + ".md")):
            continue
        url = parse_md(os.path.join(MD_DIR, n + ".md"))[0].get("url") or f"/{n}/"
        d = json.load(open(os.path.join(OUT_DIR, f), encoding="utf-8"))
        ids = set(CHROME_IDS)
        for s in d["screens"]:
            ids.add(s["id"]); ids.update(x for x in [s.get("anchor")] + (s.get("points") or []) if x)
            for blob in [s.get("article") or ""] + [(s.get(o) or {}).get("html", "") for o in ("h", "v")]:
                ids.update(H.unescape(x) for x in re.findall(r'\sid="([^"]+)"', blob))
        ids_by_url[url] = ids
    pat = re.compile(r'((?:href|data-href)=")(/[^"#?]*)#([^"]+)(")')
    for n in names:
        p = os.path.join(OUT_DIR, n + ".json")
        d = json.load(open(p, encoding="utf-8"))
        fixed = []

        def one(m):
            path, frag = m.group(2), urllib.parse.unquote(H.unescape(m.group(3)))
            if path in ids_by_url and frag not in ids_by_url[path]:
                fixed.append(path + "#" + frag)
                return m.group(1) + path + m.group(4)
            return m.group(0)
        for s in d["screens"]:
            if s.get("article"):
                s["article"] = pat.sub(one, s["article"])
            for o in ("h", "v"):
                if s.get(o):
                    s[o]["html"] = pat.sub(one, s[o]["html"])
        if fixed:
            json.dump(d, open(p, "w", encoding="utf-8", newline="\n"), ensure_ascii=False)
            print(f"  {n}：{len(fixed)} 个站内链接的锚点在目标页里没有，退回目标页本身：{sorted(set(fixed))}", flush=True)


def all_pages():
    return sorted(f[:-3] for f in os.listdir(MD_DIR) if f.endswith(".md"))


if __name__ == "__main__":
    names = sys.argv[1:]
    if not names or names == ["--all"]:
        names = all_pages()
    run(names, int(os.environ.get("BLOCK_WORKERS", "6")))

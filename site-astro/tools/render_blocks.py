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
from pathlib import Path
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

# 四个目录都可以用环境变量换到别处（例如按活动版本试排一份规则页、试排一个新页，不碰站点）：
# BLOCK_MD_DIR、BLOCK_OUT_DIR、BLOCK_PUB_DIR、BLOCK_WORK_DIR（排版缓存；和站点同时跑时要分开，免得互相盖掉）
MD_DIR = os.environ.get("BLOCK_MD_DIR") or os.path.join(SITE, "src", "content", "pages")
OUT_DIR = os.environ.get("BLOCK_OUT_DIR") or os.path.join(SITE, "src", "content", "rendered")
PUB = os.environ.get("BLOCK_PUB_DIR") or os.path.join(SITE, "public")
WORK = os.environ.get("BLOCK_WORK_DIR") or os.path.join(SITE, ".cache", "blocks")
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
SANS_FONT = "C:/Windows/Fonts/NotoSansSC-VF.ttf"
CSS_OUT = os.path.join(PUB, "assets", "_typeset", "typeset.css")
RENDER_VERSION = "r4-11"  # 同版原文、原图尺寸与视口加载接线改变，旧结果全部重排


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


_published = {}
_living_configs = {}


def publish_path(p):
    p = os.path.normpath(p)
    if not (_under(p, REPO) or _under(p, PUB)):
        raise ValueError("仓库外的文件不发布：" + p)
    st = os.stat(p)
    key = (p, st.st_size, st.st_mtime_ns)
    if key in _published:
        return _published[key]
    source_sha = sha(p)
    url = "/assets/_fingerprinted/" + source_sha + os.path.splitext(p)[1].lower()
    dst = os.path.join(PUB, *url.lstrip("/").split("/"))
    if not os.path.exists(dst) or os.path.getsize(dst) != st.st_size or sha(dst) != source_sha:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(p, dst)
        if not os.path.isfile(dst) or os.path.getsize(dst) != st.st_size or sha(dst) != source_sha:
            raise ValueError("原图复制后的 SHA256 不同：" + p)
    _published[key] = url
    return url


def rewrite_urls(text):
    return re.sub(r'file:///[^"\'\)\s<>]+', lambda m: publish_path(file_url_to_path(m.group(0))), text)


def defer_images(body, first=False):
    """首屏关键图直连；其余图片和 SVG 按视口取图，保留无 JS 原图。"""
    def inert(tag, attr):
        return re.sub(r'\b' + attr + r'="([^"]+)"', r'data-ts-src="\1"', tag, count=1)

    def svg(m):
        original = m.group(0)
        if not re.search(r'<image\b[^>]*\bhref=', original):
            return original
        lazy = re.sub(r'<image\b[^>]*>', lambda x: inert(x[0], "href"), original)
        return lazy.replace('<svg ', '<svg data-ts-lazy ', 1) + '<noscript>' + original + '</noscript>'

    if first: body = re.sub(r'(<[^>]*data-comp="illustration"[^>]*>\s*<img)\b(?![^>]*\bdata-ts-art=)', r'\1 data-ts-art="1"', body)
    body = re.sub(r'<svg\b[^>]*>.*?</svg>', svg, body, flags=re.S)
    def img(m):
        original = m.group(0)
        if 'src="' not in original:
            return original
        tag = inert(original, "src")
        if 'data-ts-src="/' in tag and 'crossorigin=' not in tag:
            tag = tag.replace('<img ', '<img crossorigin="anonymous" ', 1)
        for attr, data in (("width", "data-ts-w"), ("height", "data-ts-h")):
            size = re.search(r'\b' + data + r'="([^"]+)"', tag)
            if size and not re.search(r'\b' + attr + r'=', tag):
                tag = tag.replace('<img ', f'<img {attr}="{size[1]}" ', 1)
        if first and ('data-title-' in tag or 'data-ts-art' in tag):
            return tag.replace('data-ts-src=', 'src=', 1).replace('<img ', '<img fetchpriority="high" ', 1)
        return tag + '<noscript>' + original + '</noscript>'
    return re.sub(r'<img\b[^>]*>', img, body)


def share_living_texture(config_url, art_src):
    """静图和纹理解码像素完全相同时复用静图，不转码，不动尺寸、遮罩或效果。"""
    from PIL import Image
    path = os.path.join(PUB, *config_url.lstrip("/").split("/"))
    config = _living_configs.setdefault(path, json.load(open(path, encoding="utf-8")))
    art = file_url_to_path(art_src)
    with Image.open(art) as image:
        for side in ("h", "v"):
            texture = config.get(side, {}).get("texture", {})
            src = texture.get("src", "")
            if not src.startswith("/"):
                continue
            tp = os.path.join(PUB, *urllib.parse.unquote(src).lstrip("/").split("/"))
            if not os.path.isfile(tp):
                continue
            with Image.open(tp) as other:
                color = ("icc_profile", "gamma", "srgb")
                if (getattr(image, "n_frames", 1) == getattr(other, "n_frames", 1) == 1 and image.size == other.size and all(image.info.get(k) == other.info.get(k) for k in color)
                        and image.convert("RGBA").tobytes() == other.convert("RGBA").tobytes()):
                    url = publish_path(tp if os.path.getsize(tp) < os.path.getsize(art) else art)
                    st = os.stat(art)
                    _published[(art, st.st_size, st.st_mtime_ns)] = url
                    texture["src"] = url
    shared = os.path.join(os.path.dirname(path), "shared-config.json")
    os.makedirs(os.path.dirname(shared), exist_ok=True)
    json.dump(config, open(shared, "w", encoding="utf-8"), ensure_ascii=False)
    return publish_path(shared)


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
    src = Path(path).read_text("utf-8")
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
    for root, dirs, files in os.walk(PROTO):
        dirs[:] = sorted(d for d in dirs if d != "__pycache__")
        for name in sorted(files):
            if name.endswith((".pyc", ".pyo")):
                continue
            p = Path(root, name)
            h.update(p.relative_to(PROTO).as_posix().encode("utf-8") + b"\0")
            h.update(hashlib.sha256(p.read_bytes()).digest())
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
            art_version = "-mock-art-v1" if any(b.get("type") == "document_mock" for b in (sp or {}).get("blocks", [])) else ""
            key = hashlib.sha256(json.dumps([libfp + art_version, meta, text, o], ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:20]
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
  // contain/cover 已按原图比例绘制，保留固定框；只校正 fill（含默认值）造成的实际拉伸。
  const imgs = [...main.querySelectorAll('img')], imageCorrections = [];
  for (const im of imgs) {
    if (im.naturalWidth && im.naturalHeight) { im.setAttribute('width', im.naturalWidth); im.setAttribute('height', im.naturalHeight); }
    const r = im.getBoundingClientRect(), objectFit = getComputedStyle(im).objectFit;
    if (document.body.classList.contains('o-h') && ['contain', 'cover'].includes(objectFit)) im.setAttribute('data-ts-ratio-preserved', objectFit);
    if (r.width > 0 && r.height > 0) {
      if (document.body.classList.contains('o-h') && objectFit === 'fill' && im.naturalWidth && im.naturalHeight && Math.abs(r.width / r.height / (im.naturalWidth / im.naturalHeight) - 1) >= .01) {
        const height = r.width * im.naturalHeight / im.naturalWidth;
        imageCorrections.push({src: im.getAttribute('src'), before: [r.width, r.height], after: [r.width, height]});
        im.setAttribute('data-ts-ratio-corrected', '1'); im.setAttribute('data-ts-ratio-before', r.width + ',' + r.height);
        im.style.maxHeight = 'none'; r.height = height;
      }
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
    const only = main.querySelectorAll('[data-comp="illustration"] img, [data-comp="document_mock"] img.mock-base-art');
    if (best <= 0.5 && only.length === 1) { art = only[0]; best = 1; }
    if (art && best > 0.5) { art.setAttribute('data-ts-art', String(Math.round(best * 1000) / 1000)); } else art = null;
  }
  let artBox = null;
  if (art) {  // 插画在画布里的位置（画布像素）：动画层放在画布外面的同一位置（画布是整体缩放的，动画引擎按屏幕像素量尺寸）
    const p = main.getBoundingClientRect(), q = art.getBoundingClientRect();
    artBox = [q.left - p.left, q.top - p.top, q.width, q.height].map(v => Math.round(v * 100) / 100);
  }
  const titles = [...main.querySelectorAll('.title-img img')].map(i => i.getAttribute('src'));
  return {html: main.innerHTML, style: main.getAttribute('style') || '', height: Math.ceil(document.documentElement.scrollHeight),
          width: document.documentElement.scrollWidth, art: art ? art.getAttribute('src') : null, artBox, titles, imageCorrections,
          imageCorrectionPolicy: {correct: 'fill', preserve: ['contain', 'cover'], scope: 'o-h', tolerance: .01}};
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
            if r and "brushfont" in r.get("html", ""):
                try:
                    r["html"] = brush_titles(b, j, js, binds, r["html"])
                except Exception as e:
                    print(f"  {j['screen']}-{j['o']} 毛笔字标题转图出错：{repr(e)[:160]}", flush=True)
                    r = None
            if r:
                out.append({**j, **r})
        b.close()
    return out


# 毛笔字标题图放在区块库标题图的同一个缓存目录，发布时同样进 /assets/_titles/
BRUSH_DIR = os.path.join(REPO, ".publish", "typeset-out", "_cache")
BRUSH_PAD = 12  # 笔画可能伸出字框，四周多截一点透明边，用负边距放回原位


def brush_titles(b, j, js, binds, html_in):
    """字体兜底的标题（素材库里没有逐字一致的标题图，例如“全部功能（15 项）”）：区块库用毛笔字体（华文行楷、方正舒体，
    Windows 自带，样式里按 file:/// 引用）写字。现在网站是在出图这一步把它画进整屏图的；网页上不能分发这两个系统字体，
    所以同样在出图这一步把这几个字截成透明底的图（2 倍清晰度），页面上放图，字留作看不见的文字（可搜索、可复制）。
    版面不变：图的显示大小就是原来字框的大小。"""
    pg = b.new_page(viewport={"width": WIDTH[j["o"]], "height": 200}, device_scale_factor=2)
    caps = []
    try:
        pg.goto("file:///" + j["html"].replace("\\", "/"))
        pg.evaluate(js, binds.get((j["screen"], j["o"])))
        pg.evaluate("document.fonts.ready.then(() => true)")
        boxes = pg.evaluate("""() => [...document.querySelectorAll('.title-font .brushfont')].map(e => {
            const r = e.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; })""")
        pg.add_style_tag(content="*{visibility:hidden !important;background:transparent !important;box-shadow:none !important}"
                                 ".title-font .brushfont,.title-font .brushfont *{visibility:visible !important}")
        for x, y, w, h in boxes:
            clip = {"x": max(0, x - BRUSH_PAD), "y": max(0, y - BRUSH_PAD), "width": w + 2 * BRUSH_PAD, "height": h + 2 * BRUSH_PAD}
            png = pg.screenshot(clip=clip, omit_background=True, full_page=True)
            name = "brushfont-" + hashlib.sha256(png).hexdigest()[:16] + ".png"
            dst = os.path.join(BRUSH_DIR, name)
            if not os.path.exists(dst):
                os.makedirs(BRUSH_DIR, exist_ok=True)
                open(dst, "wb").write(png)
            caps.append((dst, w, h, x - clip["x"], y - clip["y"]))
    finally:
        pg.close()
    it = iter(caps)

    def one(m):
        cap = next(it, None)
        if cap is None:
            return m.group(0)
        dst, w, h, dx, dy = cap
        url = "file:///" + dst.replace("\\", "/")
        return (f'<div class="brushfont brushfont-img"{m.group(1)}><img src="{url}"{image_size_attrs(url)} alt="" '
                f'style="display:block;width:{w + 2 * BRUSH_PAD:.2f}px;height:{h + 2 * BRUSH_PAD:.2f}px;'
                f'margin:-{dy:.2f}px -{2 * BRUSH_PAD - dx:.2f}px -{2 * BRUSH_PAD - dy:.2f}px -{dx:.2f}px">'
                f'<span style="position:absolute;left:0;top:0;width:100%;overflow:hidden;white-space:nowrap;color:transparent;'
                f'-webkit-text-stroke:0;pointer-events:none">{m.group(2)}</span></div>')
    return re.sub(r'<div class="brushfont"([^>]*)>(.*?)</div>', one, html_in, flags=re.S)


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
        f.close()
    return "/assets/" + rel


RULE_FRAMES = ("rule-paper/source-frame-h.webp", "rule-paper/source-frame-v.webp")


def rule_body(text):
    """版本标签在 article 外；当前 Markdown 正文直接用于网页原文，不再投影画布。"""
    first, separator, rest = text.partition("\n")
    label = first.lstrip("#").strip().strip("*").strip()
    if separator and re.search(r"\bE\d+\b", label) and label.startswith(("原文", "约法")):
        return rest.lstrip("\n"), label
    return text, ""


def rule_original_html(text):
    sys.path.insert(0, os.path.join(REPO, "scripts"))
    import astro_rules
    return astro_rules.render(rule_body(text)[0])


def image_size_attrs(url):
    from PIL import Image
    path = file_url_to_path(url) if url.startswith("file:///") else os.path.join(PUB, *urllib.parse.unquote(urllib.parse.urlsplit(url).path).lstrip("/").split("/"))
    with Image.open(path) as image:
        width, height = image.size
    return f' width="{width}" height="{height}"'


def fill_shot_frames(body, shots=()):
    """截图、照片格子（data-shot-source）：现在网站是打开页面时由脚本把缩略图贴进格子；这里生成时直接放进去，
    按原比例完整放进（contain），点开看原图（data-shot-full-source）。文件不在就留空格子并提示。"""
    def one(m):
        tag = re.sub(r'\s(?:data-href|role|tabindex)="[^"]*"', '', m.group(0))
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
        tag = tag[:-1] + (f' role="button" tabindex="0" data-href="{H.escape(href, quote=True)}"' if href else "") + ">"
        tag = tag.replace('style="', 'style="position:relative;', 1) if 'style="' in tag else tag[:-1] + ' style="position:relative">'
        img = (f'<img src="{H.escape(url, quote=True)}"{image_size_attrs(url)} alt="" loading="lazy" decoding="async" '
               f'style="position:absolute;inset:0;width:100%;height:100%;object-fit:{(fit.group(1) if fit else "contain") or "contain"}">')
        return tag + img
    body = re.sub(r'<div class="slot-shot-frame[^"]*"[^>]*data-shot-source="([^"]+)"[^>]*>', one, body)

    def annotation(m):
        tag = m.group(0)
        index = re.search(r'\bdata-href="(\d+)"', tag)
        if not index:
            return tag
        tag = re.sub(r'\s(?:data-href|role|tabindex)="[^"]*"', '', tag)
        shot = shots[int(index[1])] if int(index[1]) < len(shots) else {}
        source = shot.get("full") or shot.get("file", "")
        path = os.path.join(REPO, *source.replace("\\", "/").split("/"))
        if not source or not os.path.isfile(path):
            print("  标注截图的原图不在：", source or index[1], flush=True)
            return tag
        url = H.escape(publish_path(path), quote=True)
        return tag[:-1] + f' role="button" tabindex="0" data-href="{url}">'

    return re.sub(r'<div class="[^"]*\bdd-shot\b[^"]*"[^>]*>', annotation, body)


_ALIASES = None


def alias_links(text):
    """改过地址的页（内容文件开头 old_urls）：HTML 里站内链接（href、data-href）指向旧地址的，改指现在的地址，锚点照留。"""
    global _ALIASES
    if _ALIASES is None:
        _ALIASES = {}
        for f in os.listdir(MD_DIR):
            if f.endswith(".md"):
                fm = parse_md(os.path.join(MD_DIR, f))[0]
                for old in fm.get("old_urls") or []:
                    _ALIASES[old] = fm["url"]
    for old, new in _ALIASES.items():
        text = re.sub(r'((?:href|data-href)=")' + re.escape(old.rstrip("/")) + r'(?:/|(?=["#?]))',
                      lambda m: m.group(1) + new, text)
    return text


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
    rt = json.loads(Path(rt_p).read_text("utf-8")) if os.path.exists(rt_p) else {}
    living_path = os.path.join(PUB, "_living", name, "astro", "config.json")
    if rt.get("living_config") and not os.path.isfile(living_path):
        raise ValueError(f"{name}：声明了环境动效，但插画坐标配置未生成；先运行 tools/adapt_motion.py")
    living = f"/_living/{name}/astro/config.json" if os.path.isfile(living_path) else None
    screens, order, texts = {}, [], []
    source_screens = {meta["screen"]["id"]: (meta["screen"], text) for meta, text in parse_md(os.path.join(MD_DIR, name + ".md"))[1]}
    motion = None
    for r in results:
        sid = r["screen"]
        if sid not in screens:
            screens[sid] = {"id": sid}; order.append(sid)
        body = alias_links(rename_site_classes(fill_shot_frames(r["html"], source_screens[sid][0].get("screenshots", []))))
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
            shared_living = share_living_texture(living, art_src)
            overlay = (f'<figure class="ts-art" data-living-config="{shared_living}" data-art-key="%ART_KEY%" '
                       f'style="left:calc({x}px * var(--tz));top:calc({y}px * var(--tz));width:calc({w}px * var(--tz));height:calc({h}px * var(--tz))">'
                       f'<img src="{art_src}"{image_size_attrs(art_src)} alt="" data-ts-art="1" decoding="sync"></figure>')
        body = defer_images(rewrite_urls(body), first)
        style = rewrite_urls(r["style"])
        screens[sid][r["o"]] = {"html": body, "style": style, "height": r["height"], "shape": r["shape"], "overlay": defer_images(rewrite_urls(overlay), first)}
        texts.append(re.sub(r"<[^>]+>", "", H.unescape(body)))
        if art_src and r["o"] == "h" and living:
            motion = {"screen": sid, "art_url": publish_path(file_url_to_path(art_src)), "art_key": sha(file_url_to_path(art_src))}
        if r["o"] == "h" and r.get("titles") and motion is not None and motion.get("screen") == sid and "brush_url" not in motion:
            motion["brush_url"] = publish_path(file_url_to_path(r["titles"][0])) if r["titles"][0].startswith("file:///") else None
    font = font_subset(name, texts + [text for screen, text in source_screens.values() if screen.get("source_logical_id")] + [fm.get("title", ""), fm.get("tagline", "")])
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
        mm["art"]["key"] = motion["art_key"]
        latest_living = publish_path(os.path.join(PUB, "_living", name, "astro", "shared-config.json"))
        for sid in screens:
            for o in ("h", "v"):
                if o in screens[sid] and mm["art"]:
                    screens[sid][o]["overlay"] = screens[sid][o].get("overlay", "").replace("%ART_KEY%", mm["art"]["key"])
                    screens[sid][o]["overlay"] = re.sub(r'data-living-config="[^"]+"', f'data-living-config="{latest_living}"', screens[sid][o]["overlay"])
        if mm["brush"]:
            sid = mm["screen"]
            for o in ("h", "v"):
                if o in screens[sid]:
                    screens[sid][o]["html"] = screens[sid][o]["html"].replace(
                        f'src="{mm["brush"]["src"]}"', f'src="{mm["brush"]["src"]}" data-title-key="{mm["brush"]["key"]}"', 1)
    # 规则原文屏只出一份当前 Markdown 网页正文及版本标签；排版画布不再参与原文抽取。
    if (fm.get("url") or "").startswith("/rules/"):
        for r in results:
            if r["o"] == "h" and r.get("shape") == "source_text" and r["screen"] in screens:
                screen, text = source_screens[r["screen"]]
                if not screen.get("source_logical_id") or not screen.get("source_public_sha256"):
                    raise ValueError("规则原文缺少同版公共来源绑定：" + r["screen"])
                art = alias_links(rule_original_html(text))
                if art:
                    screens[r["screen"]]["article"] = art
                    screens[r["screen"]]["source_logical_id"] = screen["source_logical_id"]
                    screens[r["screen"]]["source_public_sha256"] = screen["source_public_sha256"]
                    screens[r["screen"]]["source_rule_part"] = screen["source_rule_part"]
                    label = rule_body(text)[1]
                    if label:
                        screens[r["screen"]]["article_label"] = label
                else:
                    raise ValueError("规则原文正文为空：" + r["screen"])
    out = {"page": name, "css": publish_path(CSS_OUT), "font": font, "motion": mm,
           "source_md_sha256": sha(os.path.join(MD_DIR, name + ".md")), "render_version": RENDER_VERSION,
           "loader": publish_path(os.path.join(SITE, "src", "scripts", "living-mount.js")),
           "sections": [], "screens": [screens[s] for s in order]}
    sec_seen = set()
    fm_screens = {sid: screen for sid, (screen, text) in source_screens.items()}
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
    # 原文别名可能与另一屏的定位点重名，按全页已有锚点去重，正文不动。
    owned = all_secs | sec_seen | set(order)
    for s in out["screens"]:
        if s.get("article"):
            s["article"] = re.sub(r'<span id="([^"]+)"></span>', lambda m: "" if H.unescape(m[1]) in owned else m[0], s["article"])
    os.makedirs(OUT_DIR, exist_ok=True)
    Path(OUT_DIR, name + ".json").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8", newline="\n")
    return out


def bindings(name, first_screen):
    rt_p = os.path.join(SITE, "src", "chrome", "runtime", name + ".json")
    if not os.path.exists(rt_p):
        return {}
    rt = json.load(open(rt_p, encoding="utf-8"))
    lb = rt.get("living_binding") or {}
    sid = (rt.get("album") or {}).get("entry") or first_screen
    return {(sid, o): lb[o]["rect"] for o in ("h", "v") if o in lb and lb[o].get("rect")}


def run(names, workers=2):
    workers = min(2, max(1, workers))
    _published.clear(); _living_configs.clear()
    t0 = time.time()
    os.chdir(REPO)  # page.json 里截图等路径相对仓库根（和现在出图时一样）
    mount = os.path.join(SITE, "src", "scripts", "living-mount.js")
    os.makedirs(os.path.join(PUB, "_living"), exist_ok=True)
    shutil.copyfile(mount, os.path.join(PUB, "_living", "living-mount.js"))
    # 内容页“现在”实时位：取数、读不到时只说一次并保留上次的值（Site.astro 引用）
    shutil.copyfile(os.path.join(SITE, "src", "scripts", "live-dom.js"), os.path.join(PUB, "_living", "live-dom.js"))
    for f in RULE_FRAMES:
        # 这两张框图由全站 CSS 按固定地址引用，须同时支持空 public 的干净构建。
        dst = os.path.join(PUB, "assets", *f.split("/"))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(os.path.join(REPO, "sources", "assets", *f.split("/")), dst)
    reg, owner, css, warn = load_registry()
    css_files = [os.path.join(PROTO, "style", "base.css")] + css
    cssv = build_css(css_files)
    libfp = library_fingerprint() + cssv + RENDER_VERSION
    all_jobs, fms, binds, source_shas = [], {}, {}, {}
    failed = []
    for n in names:
        try:
            source_shas[n] = sha(os.path.join(MD_DIR, n + ".md"))
            fm, page, jobs = prepare_page(n, reg, css_files, libfp)
        except Exception as e:  # 一页出错不拦别的页，最后列出来
            failed.append(n); print(f"{n}：区块库排这一页出错 {repr(e)[:200]}", flush=True); continue
        fms[n] = fm; all_jobs += jobs
        if page["screens"]:
            binds.update(bindings(n, page["screens"][0]["id"]))
    names = [n for n in names if n not in failed]
    # 增量：指纹没变的屏用上次的结果
    cache_p = os.path.join(WORK, "_cache.json")
    cache = json.loads(Path(cache_p).read_text("utf-8")) if os.path.exists(cache_p) else {}
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
    Path(cache_p).write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
    by_page = {}
    missing = [j for j in all_jobs if j["key"] not in cache]
    incomplete_pages = {j["page"] for j in missing}
    for j in all_jobs:
        if j["key"] in cache:
            by_page.setdefault(j["page"], []).append({**j, **cache[j["key"]]})
    for n in names:
        if n in incomplete_pages:
            failed.append(n); print(f"{n}：排版缺块，不写入不完整结果", flush=True); continue
        try:
            if sha(os.path.join(MD_DIR, n + ".md")) != source_shas[n]:
                raise ValueError("排版过程中内容文件已改变，需要按新内容重新排版")
            finish_page(n, fms[n], by_page.get(n, []), cssv)
        except Exception as e:
            failed.append(n); print(f"{n}：收尾出错 {repr(e)[:200]}", flush=True)
    fix_dead_fragments([n for n in names if n not in failed])
    print(f"区块排版完成：{len(names) - len([f for f in failed if f in names])} 页，{time.time() - t0:.1f} 秒；出错 {len(failed)} 页 {failed}")
    if failed or missing:
        raise SystemExit("区块排版未完成：" + repr({"failed_pages": failed, "missing_jobs": [j["page"] + "/" + j["screen"] + "-" + j["o"] for j in missing]}))


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
    run(names, int(os.environ.get("BLOCK_WORKERS", "2")))

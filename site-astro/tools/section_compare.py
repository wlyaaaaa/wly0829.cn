"""逐段新旧并排 + “像不像”分数：新站每一屏（section.ts-screen）截图，和现在网站同一屏的整屏图（横版 / 竖版，按显示宽度缩放）并排。
用法：python tools/section_compare.py <输出目录> <现在网站构建目录> [--suffix -r4] [--widths 1440,390] [--pages a,b|all]
        [--base http://127.0.0.1:18963] [--groups <上一轮 sections.json>] [--threshold 0.9] [--no-images]
--groups：按上一轮的分段（几屏并成一段）出图，方便和上一轮逐段对照；不给就一屏一段。
标签里的轮次从 --suffix 来（-r4 → 第四轮）。"""
import argparse, io, json, os, re, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from likeness import likeness  # noqa: E402

ROOT = os.path.dirname(HERE)
ROUND = {"-r2": "第二轮", "-r3": "第三轮", "-r4": "第四轮", "-r5": "第五轮"}
ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("dist")
ap.add_argument("--suffix", default="-r4"); ap.add_argument("--widths", default="1440,390")
ap.add_argument("--pages", default="skill-report-page,localocr,rule-engineering-delivery"); ap.add_argument("--base", default="http://127.0.0.1:18963")
ap.add_argument("--groups"); ap.add_argument("--threshold", type=float, default=0.9); ap.add_argument("--no-images", action="store_true")
ap.add_argument("--images-below", type=float, default=None, help="只给分数低于这个值的段出并排图（全站跑时用）")
ap.add_argument("--index", default="sections.json", help="结果文件名（全站分几路并行跑时各写各的）")
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 22)
label = ROUND.get(a.suffix, a.suffix.strip("-"))
pages_dir = os.path.join(os.path.dirname(ROOT), "sources", "pages")
names = sorted(f[:-5] for f in os.listdir(os.path.join(ROOT, "src", "content", "rendered")) if f.endswith(".json")) if a.pages == "all" else a.pages.split(",")
groups = {}
if a.groups:
    for g in json.load(open(a.groups, encoding="utf-8")):
        groups.setdefault((g["page"], g["width"]), []).append(g["screens"])


def canon(t):
    return re.sub(r"\s+", "", t)


def transcripts(html):
    """现在网站每屏的“等价文字”（整屏图旁边给读屏用的原文），按屏和方向。"""
    import html as H
    tr = {}
    for m in re.finditer(r'data-screen-transcript="([^"]+)">(.*?)<!-- /screen-equivalent-text -->', html, re.S):
        for t in re.finditer(r'data-transcript-orientation="([hv])">(.*?)</div>', m[2], re.S):
            tr[(m[1], t[1])] = canon(H.unescape(re.sub(r"<[^>]+>", "", t[2])))
    return tr


def old_images(dist, url, page=""):
    f = os.path.join(dist, *url.strip("/").split("/"), "index.html") if url.strip("/") else os.path.join(dist, "404.html") if page == "404" else None
    if not f:
        raise FileNotFoundError(page)
    html = open(f, encoding="utf-8").read()
    old = {"_tr": transcripts(html)}
    for m in re.finditer(r'<section[^>]*data-screen="([^"]+)"(.*?)</section>', html, re.S):
        for part in re.finditer(r'data-orientation="([hv])"\s+data-both="(true|false)".*?(?:data-src|srcset|src)="(/_typeset/[^" ]+)"', m[2], re.S):
            old.setdefault((m[1], part[1]), []).append(part[3])
            if part[2] == "true":
                old.setdefault((m[1], "v" if part[1] == "h" else "h"), []).append(part[3])
    return old


def open_ready(pg, url, tries=3):
    """打开页面，等区块样式、字体、图片都到位再截（并行跑时服务器忙，偶尔样式没加载上，就重开）。"""
    for k in range(tries):
        pg.goto(url, wait_until="networkidle")
        pg.add_style_tag(content="#site-header,nav.toc{position:static!important}.skip,.back-to-top{display:none!important}")
        pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
        try:
            pg.wait_for_function("[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete)", timeout=30000)
        except Exception:
            pass
        pg.evaluate("document.fonts.ready")
        ok = pg.evaluate("""() => { const c = document.querySelector('.ts-canvas'); if (!c) return true;
            const s = [...document.styleSheets].some(x => (x.href || '').includes('/assets/_typeset/typeset.css') && (() => { try { return x.cssRules.length > 100; } catch (e) { return true; } })());
            return s && getComputedStyle(c).fontFamily.includes('Sans') && document.fonts.check('16px Sans'); }""")
        if ok:
            pg.wait_for_timeout(300); return True
        pg.wait_for_timeout(1000)
    print("  样式或字体没加载上：", url, flush=True)
    return False


def shot(pg, sid, tries=3):
    """截新版一屏。截之前等这一屏看得见的图画出来（最多等 6 秒，没到的重新要一次）；整块缩放的画布偶尔还没画出来就截成一片白，就稍等再截。
    先用元素截图（快）；机器很忙时“等元素稳定”可能一直等到超时，那就按这一屏在整页里的位置裁整页截图（慢，像素一样）。"""
    loc = pg.locator(f'section.ts-screen[id="{sid}"]')
    if loc.locator("details.rule-original-evidence").count():  # 规则原文屏：整屏图只对应排好的原文卡，网页字另比
        loc = loc.locator(".ts-o:visible").first
    im = None
    for k in range(tries):
        if k:
            pg.wait_for_timeout(500 * k)
        missing = loc.evaluate("""s => { const imgs = [...s.querySelectorAll('img')].filter(i => i.getClientRects().length && i.getAttribute('src'));
            const wait = Promise.all(imgs.map(i => i.complete && i.naturalWidth ? 1 : new Promise(r => { i.loading = 'eager'; if (i.complete) i.src = i.src;
                i.addEventListener('load', r, {once: true}); i.addEventListener('error', r, {once: true}); })));
            return Promise.race([wait, new Promise(r => setTimeout(r, 6000))]).then(() => imgs.filter(i => !(i.complete && i.naturalWidth)).length); }""")
        try:
            im = Image.open(io.BytesIO(loc.screenshot(timeout=15000, animations="disabled"))).convert("RGB")
        except Exception:
            loc.evaluate("e => e.scrollIntoView({block: 'start'})"); pg.wait_for_timeout(150)
            x, y, w, h = loc.evaluate("e => { const r = e.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; }")
            im = Image.open(io.BytesIO(pg.screenshot(clip={"x": x, "y": y, "width": w, "height": h}, full_page=True,
                                                     animations="disabled", timeout=90000))).convert("RGB")
        if im.convert("L").getextrema()[0] < 200 and not missing:
            return im
    if missing:
        print("  有图没画出来：", sid, missing, flush=True)
    else:
        print("  截图一直是空白：", sid, flush=True)
    return im


index = []
t0 = time.time()
with sync_playwright() as p:
    # 和现在出图、生成排版用同一个 Chrome（Playwright 自带的 Chromium 版本不同，个别行的换行会不一样）
    chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    b = p.chromium.launch(executable_path=chrome if os.path.exists(chrome) else None)
    for page in names:
        url = json.load(open(os.path.join(pages_dir, page, "page.json"), encoding="utf-8-sig"))["url"]
        try:
            old = old_images(a.dist, url, page)
            url = url or f"/{page}/"
        except FileNotFoundError:
            print(page, "现在网站没有这一页，跳过"); continue
        for w in [int(x) for x in a.widths.split(",")]:
          pg = b.new_page(viewport={"width": w, "height": 900}, reduced_motion="reduce")
          try:  # 一页一宽出错（例如截图超时）记下来，不拦后面的页
            open_ready(pg, a.base + url)
            ids = pg.evaluate("[...document.querySelectorAll('section.ts-screen')].map(s=>s.id)")
            # 规则原文屏只出网页字原文（排好的原文卡撤了），没法和现在的整屏图比，这里跳过，网页字另比（tools/rule_article_check.py）
            art_ids = set(pg.evaluate("[...document.querySelectorAll('section.ts-screen > article.rule-original-prose')].map(a=>a.parentElement.id)"))
            o = "h" if w >= 768 else "v"
            gs = groups.get((page, w)) or [[i] for i in ids]
            for k, g in enumerate(gs, 1):
                g = [sid for sid in g if sid not in art_ids]
                if not g:
                    continue
                news = []
                for sid in g:
                    if sid not in ids:
                        continue
                    news.append(shot(pg, sid))
                if not news:
                    continue
                tw = news[0].width
                nh = sum(im.height for im in news)
                new = Image.new("RGB", (tw, nh), "white"); y = 0
                for im in news:
                    new.paste(im, (0, y)); y += im.height
                olds = []
                for sid in g:
                    for k2, src in enumerate(old.get((sid, o), [])):
                        f = os.path.join(a.dist, src.lstrip("/"))
                        if os.path.exists(f):
                            im = Image.open(f).convert("RGB")
                            # 现在网站竖版太长时分成几张，续张顶上补了 30 像素留白（出图引擎 CONT_PAD）；拼回整屏时去掉
                            olds.append(im.crop((0, 30, im.width, im.height)) if k2 else im)
                if olds:
                    olds = [im.resize((tw, round(im.height * tw / im.width)), Image.LANCZOS) for im in olds]
                    oc = Image.new("RGB", (tw, sum(im.height for im in olds)), "white"); y = 0
                    for im in olds:
                        oc.paste(im, (0, y)); y += im.height
                    score = likeness(oc, new)
                else:
                    oc = Image.new("RGB", (tw, 40), "white"); score = None
                info = pg.evaluate("""([ids, o]) => ids.map(id => { const s = document.getElementById(id); if (!s) return null;
                    const c = s.querySelector('.ts-' + o + ' .ts-canvas') || s.querySelector('.ts-canvas');
                    return {text: c.innerText, comps: [...new Set([...c.querySelectorAll('[data-comp]')].map(e => e.dataset.comp))]}; })""", [g, o])
                same_text = []
                for sid, x in zip(g, info):
                    want = old["_tr"].get((sid, o)) or old["_tr"].get((sid, "h"))
                    same_text.append(None if (x is None or want is None) else canon(x["text"]) == want)
                comps = sorted({c for x in info if x for c in x["comps"]})
                row = {"page": page, "width": w, "section": g[0], "screens": g, "old_h": oc.height, "new_h": new.height,
                       "likeness": score, "pass": bool(score and score["score"] >= a.threshold),
                       "same_text_as_now": same_text, "blocks": comps}
                want_img = not a.no_images and (a.images_below is None or not score or score["score"] < a.images_below)
                if want_img:
                    H = max(oc.height, new.height) + 40
                    c = Image.new("RGB", (oc.width + new.width + 20, H), (236, 244, 238)); d = ImageDraw.Draw(c)
                    d.text((8, 8), f"现在 {g[0]}（{w}px）", fill=(10, 114, 50), font=font)
                    s = f"，像不像 {score['score']:.3f}" if score else ""
                    d.text((oc.width + 28, 8), f"新版 {label}（{w}px{s}）", fill=(10, 114, 50), font=font)
                    c.paste(oc, (0, 40)); c.paste(new, (oc.width + 20, 40))
                    f = os.path.join(a.out, f"{page}-{w}-{k:02d}-{g[0]}{a.suffix}.png"); c.save(f); row["file"] = f
                index.append(row)
          except Exception as e:
            index.append({"page": page, "width": w, "section": None, "error": repr(e)[:300], "likeness": None, "pass": False})
            print(page, w, "出错", repr(e)[:200], flush=True)
          pg.close()
        done = [r for r in index if r["page"] == page]
        print(page, " ".join(f"{r['width']}:{(r['section'] or '?')[len(page)+1:]}={r['likeness']['score'] if r['likeness'] else '-'}" for r in done), flush=True)
        json.dump(index, open(os.path.join(a.out, a.index), "w", encoding="utf-8"), ensure_ascii=False, indent=1)  # 每页存一次
    b.close()
json.dump(index, open(os.path.join(a.out, a.index), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(index), "段，", sum(r["pass"] for r in index), "段过门槛", a.threshold, f"，{time.time() - t0:.0f} 秒")

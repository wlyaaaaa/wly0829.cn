"""用全站试跑（GPT，提交 57a3d437 的 tools/fullsite_trial.py）同一个打分公式、同一个阈值（74 分）、同一批旧图和分组，
给新版重新打分，和第二轮规则的基线（577 组里 154 组达标）直接比。
- 旧图：试跑留下的 <页>-<段>-old.png（现在网站真实页面 1440 宽的逐段截图），不重截；
- 新图：新站同一组里各屏（section.ts-screen）1440 宽的截图，按顺序上下拼；
- 试跑里转换失败、没有旧图的页（how、rules-home）：照试跑的办法从现在网站（18961）截旧图，一屏一组。
用法：python tools/trial_score.py <试跑 compare.json> <输出目录> [--base http://127.0.0.1:18963] [--pages a,b] [--index 名]"""
import argparse, io, json, os, re, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent


def score(x, y):
    """原样照抄试跑工具 fullsite_trial.py 的 score()（提交 57a3d437），不改一个系数。"""
    h = max(x.height, y.height); w = max(x.width, y.width)
    def raster(im):
        z = Image.new('RGB', (w, h), 'white'); z.paste(im, ((w-im.width)//2, 0))
        z = z.convert('L').resize((256, max(1, round(h*256/w))), Image.Resampling.LANCZOS)
        return np.asarray(z, dtype=float)/255
    u, v = raster(x), raster(y)
    ink = (u < .94) | (v < .94)
    gray = 1-float(np.abs(u-v)[ink].mean()) if ink.any() else 1
    def density(im): return np.asarray(Image.fromarray(np.uint8((1-im)*255)).filter(ImageFilter.GaussianBlur(5)), dtype=float)/255
    du, dv = density(u), density(v)
    overlap = float(np.minimum(du,dv).sum()/max(1e-9,np.maximum(du,dv).sum()))
    height = min(x.height,y.height)/max(x.height,y.height)
    return {'score': round(100*(.5*overlap+.3*gray+.2*height),2), 'ink_overlap':round(overlap,4), 'gray_similarity':round(gray,4), 'height_ratio':round(height,4)}


ap = argparse.ArgumentParser()
ap.add_argument("compare"); ap.add_argument("out")
ap.add_argument("--base", default="http://127.0.0.1:18963"); ap.add_argument("--old-base", default="http://127.0.0.1:18961")
ap.add_argument("--pages", default=""); ap.add_argument("--index", default="trial-score.json"); ap.add_argument("--threshold", type=float, default=74)
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
trial = json.load(open(a.compare, encoding="utf-8"))["results"]
by_page = {}
for r in trial:
    by_page.setdefault(r["page"], []).append(r)
rendered = sorted(f[:-5] for f in os.listdir(REPO / "site-astro" / "src" / "content" / "rendered") if f.endswith(".json"))
names = a.pages.split(",") if a.pages else sorted(set(by_page) | set(rendered))
font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 18)
STATIC = "#site-header,nav.toc{position:static!important}.skip,.back-to-top{display:none!important}"


def url_of(page):
    d = json.load(open(REPO / "sources" / "pages" / page / "page.json", encoding="utf-8-sig"))
    return d["url"] or f"/{page}/", d


def open_ready(pg, url):
    for _ in range(3):
        pg.goto(url, wait_until="networkidle"); pg.add_style_tag(content=STATIC)
        pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
        try:
            pg.wait_for_function("[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete)", timeout=30000)
        except Exception:
            pass
        pg.evaluate("document.fonts.ready")
        if pg.evaluate("""() => { const c = document.querySelector('.ts-canvas'); if (!c) return true;
            return [...document.styleSheets].some(x => (x.href || '').includes('/assets/_typeset/typeset.css') && (() => { try { return x.cssRules.length > 100; } catch (e) { return true; } })())
              && getComputedStyle(c).fontFamily.includes('Sans') && document.fonts.check('16px Sans'); }"""):
            pg.wait_for_timeout(300); return True
        pg.wait_for_timeout(1000)
    return False


def old_shot(op, sid):
    """照试跑的办法截现在网站一屏：滚进视口、把延迟加载的图换成真地址、等图加载完再截。"""
    loc = op.locator(f'section[data-screen="{sid}"]').first
    if not loc.count() or not loc.is_visible():  # 现在网站上没有或不显示这一屏
        return None
    loc.evaluate("e => e.scrollIntoView({block: 'start'})"); op.wait_for_timeout(150)
    loc.evaluate("s=>s.querySelectorAll('img').forEach(i=>{let v=i.dataset.src||i.dataset.lazySrc;if(v)i.src=v;v=i.dataset.srcset||i.dataset.lazySrcset;if(v)i.srcset=v;i.loading='eager'})")
    try:
        op.wait_for_function("sid=>[...document.querySelector('section[data-screen=\"'+sid+'\"]').querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>1&&i.getAttribute('src')).every(i=>i.complete&&i.naturalWidth>0)", arg=sid, timeout=20000)
    except Exception:
        pass
    try:
        return Image.open(io.BytesIO(loc.screenshot(timeout=15000, animations="disabled"))).convert("RGB")
    except Exception:  # 机器忙时元素截图可能等不到“稳定”：按位置裁整页截图
        x, y, w, h = loc.evaluate("e => { const r = e.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; }")
        return Image.open(io.BytesIO(op.screenshot(clip={"x": x, "y": y, "width": w, "height": h}, full_page=True,
                                                   animations="disabled", timeout=90000))).convert("RGB")


def shot(pg, sid, tries=3):
    """截新版一屏。截之前等这一屏看得见的图画出来（最多等 6 秒，没到的重新要一次）；整块缩放的画布偶尔还没画出来就截成一片白，就稍等再截。
    先用元素截图（快）；机器很忙时“等元素稳定”可能一直等到超时，那就按这一屏在整页里的位置裁整页截图（慢，像素一样）。"""
    loc = pg.locator(f'section.ts-screen[id="{sid}"]')
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


rows = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="C:/Program Files/Google/Chrome/Application/chrome.exe", headless=True)
    for page in names:
      try:
        if page == "cockpit":
            continue
        url, d = url_of(page)
        pg = b.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        if page not in rendered:
            rows.append({"page": page, "error": "新版没有这一页（区块排版出错）"}); pg.close(); continue
        open_ready(pg, a.base + url)
        ids = set(pg.evaluate("[...document.querySelectorAll('section.ts-screen')].map(s=>s.id)"))
        groups = [g for g in by_page.get(page, []) if g.get("old_file") and g.get("score") is not None]
        extra = page not in by_page or not groups
        op = None
        if extra:  # 试跑没有旧图的页：一屏一组，旧图照试跑办法现截
            op = b.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
            op.goto(a.old_base + (d["url"] or ("/404.html" if page == "404" else "/")), wait_until="networkidle"); op.add_style_tag(content=STATIC)
            groups = [{"page": page, "section": s["id"], "screens": [s["id"]], "old_file": None, "score": None} for s in d["screens"] if not s.get("hidden")]
        for g in groups:
            news = [shot(pg, sid) for sid in g["screens"] if sid in ids]
            if not news:
                rows.append({"page": page, "section": g["section"], "error": "新版没有这几屏"}); continue
            new = Image.new("RGB", (max(i.width for i in news), sum(i.height for i in news)), "white"); y = 0
            for im in news:
                new.paste(im, (0, y)); y += im.height
            if extra:
                o = old_shot(op, g["section"])
                if o is None:
                    rows.append({"page": page, "section": g["section"], "error": "现在网站没有这一屏"}); continue
                old = o
            else:
                old = Image.open(g["old_file"]).convert("RGB")
            m = score(old, new)
            row = {"page": page, "section": g["section"], "screens": g["screens"], "trial_r2_score": g.get("score"), **m, "pass": m["score"] >= a.threshold}
            if m["score"] < a.threshold:
                pair = Image.new("RGB", (old.width + new.width + 16, max(old.height, new.height) + 32), "#ecf4ee"); dr = ImageDraw.Draw(pair)
                dr.text((8, 5), f"现在 {g['section']}", font=font, fill="#176d43"); dr.text((old.width + 24, 5), f"新版 第四轮（试跑公式 {m['score']}）", font=font, fill="#176d43")
                pair.paste(old, (0, 32)); pair.paste(new, (old.width + 16, 32))
                f = os.path.join(a.out, f"{page}-{g['section']}-trial-r4.png"); pair.save(f); row["pair"] = f
            rows.append(row)
        if op:
            op.close()
        pg.close()
        done = [r for r in rows if r.get("page") == page and "score" in r]
        print(page, len(done), "组", sum(r["pass"] for r in done), "达标", flush=True)
        json.dump(rows, open(os.path.join(a.out, a.index), "w", encoding="utf-8"), ensure_ascii=False, indent=1)  # 每页存一次，中途出错不丢
      except Exception as e:
        rows.append({"page": page, "error": repr(e)[:300]}); print(page, "出错", repr(e)[:200], flush=True)
    b.close()
json.dump(rows, open(os.path.join(a.out, a.index), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
sc = [r for r in rows if "score" in r]
print(len(sc), "组有分，", sum(r["pass"] for r in sc), "组达标", a.threshold)

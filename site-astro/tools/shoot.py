"""整页截图（每段不超过 8000px）并和现在候选同页的分段截图并排拼图。
用法：python tools/shoot.py <输出目录> <旧截图 index.json> [--tag 名字] [--base http://127.0.0.1:4391]
产出：<输出目录>/<tag>/<页>-<宽>-new-partNN.png、<页>-<宽>-side-by-side-partNN.png、shots.json"""
import argparse, json, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

PAGES = {"skill-report-page": "/skills/report-page/", "localocr": "/projects/localocr/",
         "rule-engineering-delivery": "/rules/engineering-delivery/"}
WIDTHS = (390, 1440)
SEG = 8000

ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("old_index")
ap.add_argument("--tag", default="sample"); ap.add_argument("--base", default="http://127.0.0.1:4391")
ap.add_argument("--pages", default=",".join(PAGES)); ap.add_argument("--no-compare", action="store_true")
a = ap.parse_args()
out = os.path.join(a.out, a.tag); os.makedirs(out, exist_ok=True)
old = json.load(open(a.old_index, encoding="utf-8"))
font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 28)
record = []


def capture(pg, url, w, stem):
    pg.set_viewport_size({"width": w, "height": 900})
    pg.goto(url, wait_until="networkidle")
    pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
    pg.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)"); pg.wait_for_timeout(600)
    pg.evaluate("window.scrollTo(0, 0)")
    pg.wait_for_function("[...document.images].every(i=>i.complete)", timeout=20000)
    pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(1200)
    H = pg.evaluate("document.documentElement.scrollHeight")
    parts = []
    y = 0; k = 1
    while y < H:
        h = min(SEG, H - y)
        f = os.path.join(out, f"{stem}-new-part{k:02d}.png")
        pg.screenshot(path=f, full_page=True, clip={"x": 0, "y": y, "width": w, "height": h})
        parts.append(f); y += h; k += 1
    return H, parts


def stack(files):
    ims = [Image.open(f).convert("RGB") for f in files]
    W = max(i.width for i in ims); H = sum(i.height for i in ims)
    c = Image.new("RGB", (W, H), "white"); y = 0
    for i in ims:
        c.paste(i, (0, y)); y += i.height
    return c


def side_by_side(old_files, new_files, stem, w):
    o, n = stack(old_files), stack(new_files)
    scale = 1 if w <= 400 else 0.5
    if scale != 1:
        o = o.resize((int(o.width * scale), int(o.height * scale)), Image.LANCZOS)
        n = n.resize((int(n.width * scale), int(n.height * scale)), Image.LANCZOS)
    gap, head = 24, 56
    H = max(o.height, n.height)
    files = []
    for k, y in enumerate(range(0, H, SEG - head), 1):
        h = min(SEG - head, H - y)
        c = Image.new("RGB", (o.width + n.width + gap, h + head), (236, 244, 238))
        d = ImageDraw.Draw(c)
        d.text((10, 12), f"现在候选（{w}px{'，缩小一半' if scale != 1 else ''}）", fill=(10, 114, 50), font=font)
        d.text((o.width + gap + 10, 12), f"新样板 Astro（{w}px{'，缩小一半' if scale != 1 else ''}）", fill=(10, 114, 50), font=font)
        if y < o.height:
            c.paste(o.crop((0, y, o.width, min(o.height, y + h))), (0, head))
        if y < n.height:
            c.paste(n.crop((0, y, n.width, min(n.height, y + h))), (o.width + gap, head))
        f = os.path.join(out, f"{stem}-side-by-side-part{k:02d}.png"); c.save(f); files.append(f)
    return files, o.height / scale, n.height / scale


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    for page in a.pages.split(","):
        for w in WIDTHS:
            stem = f"{page}-{w}"
            H, parts = capture(pg, a.base + PAGES[page], w, stem)
            row = {"page": page, "width": w, "height": H, "new_parts": parts}
            if not a.no_compare:
                v = next((v for v in old["views"] if v["page"] == page and v["width"] == w), None)
                if v:
                    sbs, oh, nh = side_by_side([s["path"] for s in v["segments"]], parts, stem, w)
                    row.update({"old_parts": [s["path"] for s in v["segments"]], "old_height": oh, "side_by_side": sbs})
            record.append(row); print(json.dumps({k: v for k, v in row.items() if k in ("page", "width", "height", "old_height")}, ensure_ascii=False))
    b.close()
json.dump(record, open(os.path.join(out, "shots.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

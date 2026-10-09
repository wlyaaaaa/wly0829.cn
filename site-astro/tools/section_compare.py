"""逐段新旧并排：每个新面板（一屏或并进来的续屏）截图，和现在网站同一屏的整屏图（横版 1672 / 竖版 941，按现在的显示宽度缩放）并排。
用法：python tools/section_compare.py <输出目录> <现在网站构建目录> [--widths 1440,390] [--pages a,b] [--base http://127.0.0.1:4392]"""
import argparse, json, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = {"skill-report-page": "/skills/report-page/", "localocr": "/projects/localocr/", "rule-engineering-delivery": "/rules/engineering-delivery/"}
ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("dist")
ap.add_argument("--suffix", default="-r2"); ap.add_argument("--widths", default="1440,390"); ap.add_argument("--pages", default=",".join(PAGES)); ap.add_argument("--base", default="http://127.0.0.1:4392")
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 22)
index = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for page in a.pages.split(","):
        import re as _re
        if page not in PAGES:  # 别的页：地址从 page.json 读
            PAGES[page] = json.load(open(os.path.join(os.path.dirname(ROOT), "sources", "pages", page, "page.json"), encoding="utf-8"))["url"]
        rel = PAGES[page].strip("/")
        html = open(os.path.join(a.dist, *rel.split("/"), "index.html"), encoding="utf-8").read()
        old = {}
        for m in _re.finditer(r'<section[^>]*data-screen="([^"]+)"(.*?)</section>', html, _re.S):
            for part in _re.finditer(r'data-orientation="([hv])".*?(?:data-src|srcset|src)="(/_typeset/[^" ]+)"', m[2], _re.S):
                old.setdefault((m[1], part[1]), []).append(part[2])
        for w in [int(x) for x in a.widths.split(",")]:
            pg = b.new_page(viewport={"width": w, "height": 900}, reduced_motion="reduce")
            pg.goto(a.base + PAGES[page], wait_until="networkidle")
            pg.add_style_tag(content="#site-header,nav.toc{position:static!important}.skip{display:none!important}")
            pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')"); pg.wait_for_timeout(800)
            groups = pg.evaluate("""() => [...document.querySelectorAll('section.sx-screen')].map(s => ({id: s.id, screens: [s.id, ...[...s.querySelectorAll('.screen-anchor')].map(x => x.id)]}))""")
            o = "h" if w >= 768 else "v"
            for k, g in enumerate(groups, 1):
                nf = os.path.join(a.out, f"{page}-{w}-{k:02d}-new.png")
                pg.locator("section.sx-screen").nth(k - 1).screenshot(path=nf)  # 有的面板没有 id（无屏号的续块）
                new = Image.open(nf).convert("RGB")
                olds = [Image.open(os.path.join(a.dist, src.lstrip("/"))).convert("RGB") for sid in g["screens"] for src in old.get((sid, o), [])[:1]
                        if os.path.exists(os.path.join(a.dist, src.lstrip("/")))]
                if olds:
                    tw = new.width
                    olds = [im.resize((tw, round(im.height * tw / im.width)), Image.LANCZOS) for im in olds]
                    oh = sum(im.height for im in olds)
                    oc = Image.new("RGB", (tw, oh), "white"); y = 0
                    for im in olds: oc.paste(im, (0, y)); y += im.height
                else:
                    oc = Image.new("RGB", (new.width, 40), "white")
                H = max(oc.height, new.height) + 40
                c = Image.new("RGB", (oc.width + new.width + 20, H), (236, 244, 238)); d = ImageDraw.Draw(c)
                d.text((8, 8), f"现在 {g['id']}（{w}px）", fill=(10, 114, 50), font=font)
                d.text((oc.width + 28, 8), f"新版 第二轮（{w}px）", fill=(10, 114, 50), font=font)
                c.paste(oc, (0, 40)); c.paste(new, (oc.width + 20, 40))
                f = os.path.join(a.out, f"{page}-{w}-{k:02d}-{g['id'] or 'noid'}{a.suffix}.png"); c.save(f); os.remove(nf)
                index.append({"page": page, "width": w, "section": g["id"], "screens": g["screens"], "file": f, "old_h": oc.height, "new_h": new.height})
            pg.close()
    b.close()
json.dump(index, open(os.path.join(a.out, "sections.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(index), "段")

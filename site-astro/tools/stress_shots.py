"""压力测试截图：同一节在原内容和压力内容下的样子并排（390/768/1440），并对压力页跑同样的溢出/重叠/窄栏检查。
用法：python tools/stress_shots.py <输出目录>"""
import os, sys, json
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 26)
CASES = [("加长一倍", "/skills/report-page/", "skill-report-page-05"), ("删掉一半", "/projects/localocr/", "localocr-10")]
rows = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for label, path, sid in CASES:
        for w in (390, 768, 1440):
            shots = []
            for tag, url in (("原内容", path), ("压力内容", "/stress" + path)):
                pg = b.new_page(viewport={"width": w, "height": 900})
                pg.goto("http://127.0.0.1:4391" + url, wait_until="networkidle")
                pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
                pg.wait_for_timeout(800)
                # 截单节时不让吸顶的页头、目录条和“跳到正文”压在截图上
                pg.add_style_tag(content="#site-header,nav.toc{position:static!important}.skip{display:none!important}")
                el = pg.locator("#" + sid)
                f = os.path.join(out, f"{sid}-{w}-{'orig' if tag == '原内容' else 'stress'}.png")
                el.screenshot(path=f)
                geo = pg.evaluate("""(sid) => { const s = document.getElementById(sid); const cards = [...s.querySelectorAll('.card')].map(c => { const r = c.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
                   return { overflow: document.documentElement.scrollWidth > innerWidth + 1, cards }; }""", sid)
                shots.append((tag, f, geo)); pg.close()
            ims = [Image.open(f) for _, f, _ in shots]
            W = sum(i.width for i in ims) + 24; H = max(i.height for i in ims) + 50
            c = Image.new("RGB", (W, H), (236, 244, 238)); d = ImageDraw.Draw(c); x = 0
            for (tag, _, _), im in zip(shots, ims):
                d.text((x + 8, 10), f"{tag}（{w}px）", fill=(10, 114, 50), font=font); c.paste(im, (x, 50)); x += im.width + 24
            sbs = os.path.join(out, f"{sid}-{w}-side-by-side.png"); c.save(sbs)
            rows.append({"case": label, "screen": sid, "width": w, "side_by_side": sbs,
                         "orig_cards": shots[0][2]["cards"], "stress_cards": shots[1][2]["cards"], "stress_overflow": shots[1][2]["overflow"]})
            print(label, w, "原", len(shots[0][2]["cards"]), "张卡 → 压力", len(shots[1][2]["cards"]), "张；溢出", shots[1][2]["overflow"])
    b.close()
json.dump(rows, open(os.path.join(out, "stress.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

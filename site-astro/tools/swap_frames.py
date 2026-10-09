"""录换图瞬间：页面打开后每隔约 60ms 截一次章节头插画区域，记录动画层状态，并和纯静态图（关掉动画层）逐像素比。
用法：python tools/swap_frames.py <网址路径> <宽> <输出目录> [帧数]"""
import json, os, sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops, ImageStat
path, w, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
n = int(sys.argv[4]) if len(sys.argv) > 4 else 40
os.makedirs(out, exist_ok=True)
rows = []
with sync_playwright() as p:
    b = p.chromium.launch()
    # 先拍静态参照：同一页面，禁止动画引擎（减少动态效果）
    pg = b.new_page(viewport={"width": w, "height": 900}, reduced_motion="reduce")
    pg.goto("http://127.0.0.1:4391" + path, wait_until="networkidle"); pg.wait_for_timeout(800)
    box = pg.evaluate("(()=>{const r=document.querySelector('figure[data-living-config] img').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
    clip = {"x": box[0] - 4, "y": box[1] - 4, "width": box[2] + 8, "height": box[3] + 8}
    pg.screenshot(path=os.path.join(out, "static.png"), clip=clip)
    pg.close()
    pg = b.new_page(viewport={"width": w, "height": 900})
    pg.goto("http://127.0.0.1:4391" + path, wait_until="domcontentloaded")
    t0 = pg.evaluate("performance.now()")
    for i in range(n):
        f = os.path.join(out, f"f{i:03d}.png")
        try:
            pg.screenshot(path=f, clip=clip)
        except Exception as e:
            rows.append({"i": i, "err": str(e)[:80]}); continue
        st = pg.evaluate("(()=>{const l=document.querySelector('.living-layer');return {t:performance.now(),layer:!!l,live:!!(l&&l.classList.contains('is-live')),phase:window.pageLiving&&window.pageLiving.diagnostics().phase}})()")
        a, s = Image.open(f).convert("RGB"), Image.open(os.path.join(out, "static.png")).convert("RGB")
        if a.size == s.size:
            d = ImageChops.difference(a, s); st["mean_diff"] = round(sum(ImageStat.Stat(d).mean) / 3, 2)
            st["nonwhite"] = round(sum(1 for px in a.convert("L").getdata() if px < 245) / (a.size[0] * a.size[1]), 4)
        st["i"] = i; st["t"] = round(st["t"] - t0); rows.append(st)
        pg.wait_for_timeout(60)
    b.close()
json.dump(rows, open(os.path.join(out, "frames.json"), "w"), indent=0)
for r in rows: print(r)

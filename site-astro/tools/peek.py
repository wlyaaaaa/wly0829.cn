"""开发时看一眼：python tools/peek.py <网址路径> <宽> <输出png> [起点y] [高]；同时打印控制台报错和失败请求"""
import sys
from playwright.sync_api import sync_playwright
path, w, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
y0 = int(sys.argv[4]) if len(sys.argv) > 4 else 0
h = int(sys.argv[5]) if len(sys.argv) > 5 else 3000
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": w, "height": 900})
    errs = []
    pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.type + ": " + m.text[:200]))
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)[:200] + " @ " + (e.stack or "")[:600]))
    pg.on("requestfailed", lambda r: errs.append("failed: " + r.url))
    pg.on("response", lambda r: r.status >= 400 and errs.append(f"{r.status}: {r.url}"))
    pg.goto("http://127.0.0.1:4391" + path, wait_until="networkidle")
    pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
    pg.wait_for_timeout(2500)
    H = pg.evaluate("document.documentElement.scrollHeight")
    st = pg.evaluate("[...document.querySelectorAll('[data-living-status]')].map(e=>e.dataset.livingStatus+' '+JSON.stringify(window.pageLiving&&window.pageLiving.diagnostics&&window.pageLiving.diagnostics()).slice(0,300))")
    print("height", H, "living", st, "leaves", pg.evaluate("document.querySelectorAll('.falling-leaf').length"), "washes", pg.evaluate("document.querySelectorAll('.watercolour-wash').length"))
    for e in errs[:30]:
        print("  ", e)
    pg.screenshot(path=out, full_page=True, clip={"x": 0, "y": y0, "width": w, "height": min(h, H - y0)})
    b.close()

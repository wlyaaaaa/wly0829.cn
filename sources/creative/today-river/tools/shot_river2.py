"""第二版“今天的河”自己看：无窗口 Chrome 截图。用法：python shot_river2.py [final|intro|mobile|pages|all]"""
import json
import pathlib
import sys

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "shots2"; OUT.mkdir(exist_ok=True)
MAIN = ROOT / "今天的河-第二版.html"
EVE = ROOT / "今天的河-第二版-假设下午有异常.html"
OFF = ROOT / "今天的河-第二版-读不到电脑.html"
what = sys.argv[1] if len(sys.argv) > 1 else "final"
ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]
logs = []


def open_page(b, path, w=1500, h=1000, **kw):
    pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1, **kw)
    pg.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"))
    pg.on("pageerror", lambda e: logs.append(f"[pageerror] {e}"))
    pg.goto(path.as_uri()); pg.wait_for_function("window.todayRiver && window.todayRiver.ready", timeout=20000)
    return pg


with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", headless=True, args=ARGS)
    if what in ("final", "all"):
        pg = open_page(b, MAIN)
        pg.evaluate("todayRiver.seek(10)"); pg.wait_for_timeout(700)
        pg.query_selector("#stage").screenshot(path=str(OUT / "final-stage.png"))
        pg.screenshot(path=str(OUT / "final-page.png"), full_page=True)
        info = pg.evaluate("""() => { const M = todayRiver.model; return { gl: todayRiver.gl, past: M.past.length, future: M.future.length, guards: M.guards.length, idle: M.idle.length, off: M.off.length, fog: M.fog.length,
            alerts: M.alerts.length, total: M.tasks.length, night: M.night, homes: M.tasks.reduce((o, t) => (o[t.home] = (o[t.home] || 0) + 1, o), {}),
            pastNames: M.past.map(p => p.t.name), futureNames: M.future.map(p => p.t.name).slice(0, 8), idleNames: M.idle.map(t => t.name) }; }""")
        print(json.dumps(info, ensure_ascii=False))
        pg.close()
    if what in ("intro", "all"):
        pg = open_page(b, EVE)
        frames = []
        for i, t in enumerate([0.25, 0.7, 1.2, 1.8, 2.5, 3.2, 3.9, 4.7, 5.6, 6.6]):   # 开场真实约 6 秒，最后一格是演完
            pg.evaluate(f"todayRiver.seek({t})"); pg.wait_for_timeout(450)
            p = OUT / f"intro-{i:02d}.png"; pg.query_selector("#stage").screenshot(path=str(p)); frames.append(p)
        ims = [Image.open(p).resize((750, 436), Image.LANCZOS) for p in frames]
        sheet = Image.new("RGB", (1500, 436 * 5), "white")
        for i, im in enumerate(ims):
            sheet.paste(im, ((i % 2) * 750, (i // 2) * 436))
        sheet.save(OUT / "intro-sheet.jpg", quality=86)
        pg.close()
    if what in ("pages", "all"):
        for name, path in (("afternoon", EVE), ("offline", OFF)):
            pg = open_page(b, path)
            pg.evaluate("todayRiver.seek(10)"); pg.wait_for_timeout(700)
            pg.query_selector("#stage").screenshot(path=str(OUT / f"{name}-stage.png"))
            pg.screenshot(path=str(OUT / f"{name}-page.png"), full_page=True)
            pg.close()
    if what in ("mobile", "all"):
        pg = open_page(b, MAIN, 390, 844, is_mobile=True, has_touch=True)
        pg.evaluate("todayRiver.seek(10)"); pg.wait_for_timeout(700)
        pg.screenshot(path=str(OUT / "mobile-view.png"))
        pg.screenshot(path=str(OUT / "mobile-page.png"), full_page=True)
        pg.close()
    b.close()
print("\n".join(logs) if logs else "no console output")

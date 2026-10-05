"""自查用：把一段时间里的若干格裁出鸟附近的区域拼成连环图（不出录像）。
用法：python tools/strip.py 起 止 步长 输出名 [事件...]   事件写成 秒:day:leave 这样
"""
import io
import pathlib
import sys

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).resolve().parents[1]
a, b, st, name = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
events = sorted((float(x.split(':')[0]), x.split(':')[1], x.split(':')[2], (x.split(':') + [None])[3]) for x in sys.argv[5:])
DO = r"""([k, kind, v]) => { const b = window.demo.birds[k];
  if (kind === 'force') b._force(v); else if (kind === 'tap') document.querySelector(k === 'day' ? '#lDay .lb-hit' : '#lNight .lb-hit').click();
  else if (kind === 'leave') b.leave(); else if (kind === 'arrive') b.arrive(); else if (kind === 'night') b.setNight(v === '1'); }"""
SEEK = "t => { const B = window.demo.birds; B.day.seek(t); B.night.seek(t); }"
with sync_playwright() as pw:
    br = pw.chromium.launch(channel="chrome", headless=True)
    pg = br.new_context(viewport={"width": 1040, "height": 1060}, device_scale_factor=1.5).new_page()
    js = (R / "work/bird.test.js").read_text(encoding="utf-8")
    pg.route("**/dist/bird.js", lambda r: r.fulfill(status=200, content_type="text/javascript", body=js))
    pg.goto((R / "demo.html").as_uri())
    pg.wait_for_function("window.demo && [...document.querySelectorAll('.lb-i')].every(i => i.complete && i.naturalWidth)")
    box = pg.evaluate("(() => { const r = document.querySelector('#pDay').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; })()")
    pg.evaluate(SEEK, 0)
    shots = []; t = a; ev = list(events)
    while t <= b + 1e-9:
        while ev and ev[0][0] <= t + 1e-9:
            e = ev.pop(0); pg.evaluate(SEEK, e[0]); pg.evaluate(DO, [e[1], e[2], e[3]])
        pg.evaluate(SEEK, t)
        shots.append((t, Image.open(io.BytesIO(pg.screenshot(clip=box))).convert("RGB")))
        t = round(t + st, 4)
    br.close()
import os
if os.environ.get("CROP"):
    c = [float(v) for v in os.environ["CROP"].split(",")]
    shots = [(t, im.crop((int(c[0] * im.width), int(c[1] * im.height), int(c[2] * im.width), int(c[3] * im.height)))) for t, im in shots]
font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 20)
w, h = shots[0][1].size; cw = int(os.environ.get('COLS', 4)); sc = float(os.environ.get('SC', 0.5)); tw = int(w * sc); th = int(h * sc)
board = Image.new("RGB", (tw * cw, th * ((len(shots) + cw - 1) // cw)), "white"); d = ImageDraw.Draw(board)
for i, (t, im) in enumerate(shots):
    x, y = (i % cw) * tw, (i // cw) * th
    board.paste(im.resize((tw, th), Image.LANCZOS), (x, y)); d.text((x + 6, y + th - 28), f"{t:.2f}s", fill=(200, 0, 0), font=font)
board.save(R / "work" / name)
print(R / "work" / name)

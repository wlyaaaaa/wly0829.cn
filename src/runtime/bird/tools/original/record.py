"""逐格录小鸟测试页：每秒 60 格，每格用 bird.seek(t) 把鸟定在挂上后第 t 秒（真实时间）。

- 无窗口 Chrome（headless），不弹任何窗口。
- dist/bird.js 的请求被换成 work/bird.test.js（同一份代码，只多一个录像用的 _force，用来在 12 秒里排下两个小动作和一次跳）。
- “被点一下”是真的对热区元素 .lb-hit 点了一下（走成品的点击路径）。
用法：python tools/record.py [--check] [--seconds 12.5]
"""
import hashlib
import io
import json
import pathlib
import subprocess
import sys
import time

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).resolve().parents[1]
WORK = R / "work"; WORK.mkdir(exist_ok=True)
MP4 = R / "bird-demo-60帧.mp4"
SHEET = R / "bird-demo-抽格.jpg"
FPS = 60
W, H, DSF = 1040, 1060, 1.5
args = sys.argv[1:]
check = "--check" in args
seconds = float(args[args.index("--seconds") + 1]) if "--seconds" in args else 12.5

# 白天那只：飞进来 → 看一眼 → 理毛 → 跳一步 → 被点 → 飞走 → 再飞进来；夜里那只：飞进来落下就睡，第 5.2 秒被点醒一下
EVENTS = [
    (2.6, "day", "force", "look"),
    (4.4, "day", "force", "preen"),
    (6.0, "day", "force", "hop"),
    (7.6, "day", "tap", None),
    (8.9, "day", "leave", None),
    (10.3, "day", "arrive", None),
    (5.2, "night", "tap", None),
]
EVENTS.sort()
SHEET_AT = [(0.55, "飞进来（拍翅膀）"), (1.22, "快到了：落地姿势"), (2.95, "看一眼"), (4.9, "理毛"),
            (6.27, "跳一小步（空中）"), (7.72, "被点：叫，轻轻一跳"), (9.35, "飞走"), (11.2, "再飞进来")]

DO = r"""
([k, kind, v]) => {
  const b = window.demo.birds[k];
  if (kind === 'force') b._force(v);
  else if (kind === 'tap') { const h = document.querySelector(k === 'day' ? '#lDay .lb-hit' : '#lNight .lb-hit'); if (!h || h.style.display === 'none') return 'no-hit'; h.click(); }
  else if (kind === 'leave') b.leave(); else if (kind === 'arrive') b.arrive();
  return 'ok';
}
"""
SEEK = "t => { const B = window.demo.birds; return [B.day.seek(t), B.night.seek(t)]; }"
STATE = r"""() => { const q = s => document.querySelector(s); const f = id => { const b = q(id + ' .lb'), i = q(id + ' .lb-f');
  return { vis: getComputedStyle(b).visibility, tr: b.style.transform, frame: [i.style.width, i.style.height], hit: q(id + ' .lb-hit').style.display }; };
  return { day: f('#lDay'), night: f('#lNight') }; }"""


def main():
    n = round(seconds * FPS)
    with sync_playwright() as pw:
        br = pw.chromium.launch(channel="chrome", headless=True)
        ctx = br.new_context(viewport={"width": W, "height": H}, device_scale_factor=DSF)
        pg = ctx.new_page()
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        test_js = (WORK / "bird.test.js").read_text(encoding="utf-8")
        pg.route("**/dist/bird.js", lambda route: route.fulfill(status=200, content_type="text/javascript; charset=utf-8", body=test_js))
        pg.goto((R / "demo.html").as_uri())
        pg.wait_for_function("window.demo && [...document.querySelectorAll('.lb-i')].every(i => i.complete && i.naturalWidth)", timeout=30000)
        pg.evaluate("document.fonts.ready")
        clip = pg.evaluate("(() => { const a = document.querySelector('#pDay').getBoundingClientRect(), b = document.querySelector('#pNight').closest('.card').getBoundingClientRect(); return { x: 0, y: Math.max(0, a.top - 40), width: innerWidth, height: Math.min(innerHeight, b.bottom + 4) - Math.max(0, a.top - 40) }; })()")
        day_box = pg.evaluate("(() => { const r = document.querySelector('#pDay').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; })()")
        pg.evaluate(SEEK, 0)
        ff = None
        if not check:
            ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "png", "-i", "-",
                                   "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
                                   "-r", str(FPS), "-movflags", "+faststart", str(MP4)], stdin=subprocess.PIPE)
        frames = range(n) if not check else sorted({round(s * FPS) for s, _ in SHEET_AT} | {round(x * FPS) for x in (0.2, 1.4, 1.6, 1.9, 6.1, 6.4, 9.0, 9.6, 10.6, 11.9, 5.4, 6.0)})
        ev = list(EVENTS); prev = -1.0; hashes = []; sheet = {}; log = []; t0 = time.time()
        want = {round(s * FPS): (s, lab) for s, lab in SHEET_AT}
        for i in frames:
            t = i / FPS
            while ev and ev[0][0] <= t + 1e-9:
                et, k, kind, v = ev.pop(0)
                pg.evaluate(SEEK, et)
                r = pg.evaluate(DO, [k, kind, v]); log.append([et, k, kind, v, r])
            pg.evaluate(SEEK, t)
            png = pg.screenshot(type="png", clip=clip)
            if ff: ff.stdin.write(png)
            im = Image.open(io.BytesIO(png)).convert("RGB")
            hashes.append(hashlib.md5(im.tobytes()).hexdigest())
            if i in want:
                x0 = (day_box[0] - clip["x"]) * DSF; y0 = (day_box[1] - clip["y"]) * DSF
                sheet[i] = (want[i], im.crop((int(x0), int(y0), int(x0 + day_box[2] * DSF), int(y0 + day_box[3] * DSF))))
            if check:
                im.save(WORK / f"check_{t:05.2f}.png")
            if i % 120 == 0:
                print(f"第 {i}/{n} 格，已用 {time.time() - t0:.0f} 秒", flush=True)
            prev = t
        state = pg.evaluate(STATE)
        if ff:
            ff.stdin.close(); ff.wait()
        br.close()
    # 抽 8 格拼一张：2 列 4 行
    ims = [sheet[k] for k in sorted(sheet)]
    tw = 760; th = round(tw * ims[0][1].height / ims[0][1].width)
    board = Image.new("RGB", (tw * 2 + 12, (th + 12) * ((len(ims) + 1) // 2)), "white")
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 22)
    except OSError:
        font = ImageFont.load_default()
    d = ImageDraw.Draw(board)
    for j, ((s, lab), im) in enumerate(ims):
        x, y = (j % 2) * (tw + 12), (j // 2) * (th + 12)
        board.paste(im.resize((tw, th), Image.LANCZOS), (x, y))
        txt = f"第 {s:g} 秒 · {lab}"; w = d.textlength(txt, font=font)
        d.rectangle([x + 6, y + th - 42, x + 18 + w, y + th - 6], fill="white"); d.text((x + 12, y + th - 40), txt, fill=(10, 114, 50), font=font)
    out = SHEET if not check else WORK / "check_sheet.jpg"
    board.save(out, quality=90)
    dup = sum(1 for a, b in zip(hashes, hashes[1:]) if a == b)
    res = {"frames": len(hashes), "seconds": seconds, "events": log, "page_errors": errs, "identical_adjacent_frames": dup,
           "end_state": state, "sheet": str(out), "mp4": None if check else str(MP4)}
    print(json.dumps(res, ensure_ascii=False, indent=1))
    (WORK / ("check.json" if check else "record.json")).write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()

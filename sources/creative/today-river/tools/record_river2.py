"""逐格录“今天的河”第二版：每秒 60 格，每一格里所有会动的东西都正好前进 1/60 秒。

做法（不改页面，只在录像时接管时间）：
- 页面自己的循环不跑：录像前把 requestAnimationFrame 换成空的，防卡死保险也就不会因为截图慢而误触发。
- 小鸟换姿势用的 setTimeout 换成按“录像时间”走的定时器，每格先把到点的回调跑掉。
- 脚本算位置的部分（船、钟、浮标、灯、牌子、水面着色器）用 todayRiver.seek(t)。
- 样式动画和过渡用 Web Animations API：每格先让样式生效，再把 document.getAnimations() 里的每一个暂停，
  老的把 currentTime 往前推 1000/60 毫秒，新出现的从 0 开始。
- 无窗口 Chrome 截图，直接喂给 ffmpeg 压成 H.264（yuv420p、crf 18、+faststart）。

用法：python tools/record_river2.py [main|eve|all] [--seconds 12] [--swiftshader]
"""
import hashlib
import io
import json
import pathlib
import subprocess
import sys
import time

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "shots2"; OUT.mkdir(exist_ok=True)
PAGES = {
    "main": (ROOT / "今天的河-第二版.html", ROOT / "今天的河-第二版-60帧录像.mp4"),
    "eve": (ROOT / "今天的河-第二版-假设下午有异常.html", ROOT / "今天的河-第二版-假设下午-60帧录像.mp4"),
}
FPS = 60
W, H = 1500, 900
INTRO_END = 6.6                       # 开场在真实时间第几秒演完（I.end / SPEED），用来统计开场里有没有重复的格
SHEET_AT = [0.2, 0.8, 1.4, 2.2, 3.2, 4.4, 5.6, 9.0]

args = sys.argv[1:]
which = next((a for a in args if a in ("main", "eve", "all")), "all")
seconds = float(args[args.index("--seconds") + 1]) if "--seconds" in args else 12.0
soft = "--swiftshader" in args
CHROME_ARGS = (["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] if soft
               else ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"])

# 页面脚本跑之前装好：空的 rAF、按录像时间走的定时器
INIT = r"""
(() => {
  const q = []; let vnow = 0, seq = 1;
  window.setTimeout = (fn, ms = 0, ...a) => { if (typeof fn !== 'function') return 0; const t = { id: seq++, due: vnow + Math.max(0, +ms || 0), fn, a }; q.push(t); return t.id; };
  window.clearTimeout = id => { const k = q.findIndex(t => t.id === id); if (k >= 0) q.splice(k, 1); };
  window.requestAnimationFrame = () => 0;
  window.cancelAnimationFrame = () => {};
  window.__rec = {
    now: () => vnow,
    advance(ms) { const end = vnow + ms; for (;;) { q.sort((x, y) => x.due - y.due || x.id - y.id); if (!q.length || q[0].due > end) break; const t = q.shift(); vnow = Math.max(vnow, t.due); try { t.fn(...t.a); } catch (e) { console.error(e); } } vnow = end; },
    anims: new WeakMap(), lastUT: null,
  };
})();
"""

# 一格：定时器 → seek → 样式生效 → 所有动画暂停并对齐到这一格 → 等小鸟的图解码好
FRAME = r"""
async (i) => {
  const R = window.__rec, dt = 1000 / 60, t = i / 60;
  if (i > 0) R.advance(dt);
  todayRiver.seek(t);
  const list = document.getAnimations();                 // 这一句本身会先让样式生效，新过渡在这里出现
  let fresh = 0, worst = 0;
  for (const a of list) {
    const old = R.anims.get(a), ct = old == null ? 0 : old + dt;
    if (old == null) fresh++;
    a.pause(); a.currentTime = ct; R.anims.set(a, ct);
    worst = Math.max(worst, Math.abs((a.currentTime ?? ct) - ct));
  }
  const im = document.querySelector('.bird img'); if (im && !im.complete) { try { await im.decode(); } catch (e) {} }
  const g = document.querySelector('#water').getContext('webgl'), pr = g && g.getParameter(g.CURRENT_PROGRAM);
  const uT = pr ? g.getUniform(pr, g.getUniformLocation(pr, 'uT')) : null;
  const dUT = R.lastUT == null || uT == null ? null : uT - R.lastUT; R.lastUT = uT;
  return { n: list.length, fresh, worst, uT, dUT, vt: R.now() };
}
"""


def record(key):
    src, mp4 = PAGES[key]
    n = round(seconds * FPS)
    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome", headless=True, args=CHROME_ARGS)
        ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=1)
        ctx.add_init_script(INIT)
        pg = ctx.new_page()
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        logs = []; pg.on("console", lambda m: logs.append(m.text))
        pg.goto(src.as_uri()); pg.wait_for_function("window.todayRiver && window.todayRiver.ready", polling=100, timeout=60000)
        pg.evaluate("document.fonts.ready")
        pg.evaluate("window.scrollTo(0, document.querySelector('#scroller').getBoundingClientRect().top + scrollY - 8)")
        # 小鸟的几个姿势先解码好，换姿势那一格不会闪白
        pg.evaluate("Promise.all(Object.values(window.BIRD || {}).map(p => { const im = new Image(); im.src = p.src; return im.decode().catch(() => {}); }))")
        info = pg.evaluate("""() => { const c = document.querySelector('#water'), g = c.getContext('webgl'), e = g && g.getExtension('WEBGL_debug_renderer_info'), M = todayRiver.model;
            return { gl: todayRiver.gl, renderer: e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unknown', canvas: [c.width, c.height], speed: todayRiver.SPEED,
                     guards: M.guards.length, past: M.past.length, future: M.future.length, buoys: document.querySelectorAll('.buoy').length, birdAsleep: !!document.querySelector('.bird.asleep') }; }""")
        ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "png", "-i", "-",
                               "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), "-movflags", "+faststart", str(mp4)],
                              stdin=subprocess.PIPE)
        hashes, stats, sheet, t0 = [], [], {}, time.time()
        want = {round(s * FPS): s for s in SHEET_AT if s * FPS < n}
        for i in range(n):
            st = pg.evaluate(FRAME, i)
            png = pg.screenshot(type="png")
            ff.stdin.write(png)
            im = Image.open(io.BytesIO(png)).convert("RGB")
            hashes.append(hashlib.md5(im.tobytes()).hexdigest())
            stats.append(st)
            if i in want:
                sheet[want[i]] = im.copy()
            if i % 120 == 0:
                print(f"{key} 第 {i}/{n} 格，已用 {time.time() - t0:.0f} 秒", flush=True)
        ff.stdin.close(); ff.wait()
        b.close()
    # 拼一张抽格图：2 列 4 行
    ims = [sheet[s] for s in SHEET_AT if s in sheet]
    tw, th = 750, 450
    board = Image.new("RGB", (tw * 2, th * ((len(ims) + 1) // 2)), "white")
    from PIL import ImageDraw, ImageFont
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 22)
    except OSError:
        font = ImageFont.load_default()
    for k, (s, im) in enumerate(zip([s for s in SHEET_AT if s in sheet], ims)):
        x, y = (k % 2) * tw, (k // 2) * th
        board.paste(im.resize((tw, th), Image.LANCZOS), (x, y))
        d = ImageDraw.Draw(board); d.rectangle([x + 8, y + 8, x + 150, y + 42], fill="white"); d.text((x + 16, y + 10), f"第 {s:g} 秒", fill=(10, 114, 50), font=font)
    sheet_path = OUT / f"record60-{key}-sheet.jpg"; board.save(sheet_path, quality=88)

    intro_n = round(INTRO_END * FPS)
    dup_src = [i for i in range(1, n) if hashes[i] == hashes[i - 1]]
    dut = [s["dUT"] for s in stats if s["dUT"] is not None]
    return {"mp4": str(mp4), "sheet": str(sheet_path), "page": info, "frames_captured": n, "seconds": seconds,
            "source_identical_pairs_intro": sum(1 for i in dup_src if i < intro_n), "source_identical_pairs_total": len(dup_src),
            "source_identical_at": dup_src[:20],
            "uT_step": {"min": min(dut), "max": max(dut), "expected": round(info["speed"] / FPS, 6)} if dut else None,
            "anim_currentTime_worst_error_ms": max(s["worst"] for s in stats), "anims_max": max(s["n"] for s in stats),
            "fresh_after_frame0": sum(s["fresh"] for s in stats[1:]), "virtual_clock_end_ms": stats[-1]["vt"],
            "page_errors": errs, "page_console": [x for x in logs if "今天的河" in x]}


def probe(mp4):
    """ffprobe 看帧率和格数；再把成片逐格解码，数相邻两格完全相同的有几对。"""
    pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames",
                                    "-show_entries", "stream=codec_name,pix_fmt,width,height,r_frame_rate,avg_frame_rate,nb_read_frames,duration",
                                    "-show_entries", "format=duration,size", "-of", "json", str(mp4)], capture_output=True, text=True, check=True).stdout)
    md5 = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-f", "framemd5", "-"], capture_output=True, text=True, check=True).stdout
    hs = [ln.split(",")[-1].strip() for ln in md5.splitlines() if ln and not ln.startswith("#")]
    intro_n = round(INTRO_END * FPS)
    dup = [i for i in range(1, len(hs)) if hs[i] == hs[i - 1]]
    s = pr["streams"][0]
    return {"codec": s["codec_name"], "pix_fmt": s["pix_fmt"], "size": [s["width"], s["height"]], "r_frame_rate": s["r_frame_rate"],
            "avg_frame_rate": s["avg_frame_rate"], "frames": int(s["nb_read_frames"]), "duration": float(pr["format"]["duration"]),
            "kb": round(int(pr["format"]["size"]) / 1024), "decoded_identical_pairs_intro": sum(1 for i in dup if i < intro_n), "decoded_identical_pairs_total": len(dup)}


if __name__ == "__main__":
    keys = ["main", "eve"] if which == "all" else [which]
    res = {}
    for k in keys:
        r = record(k)
        r["ffprobe"] = probe(pathlib.Path(r["mp4"]))
        res[k] = r
        print(json.dumps({k: r}, ensure_ascii=False, indent=1), flush=True)
    (OUT / "record60-result.json").write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")

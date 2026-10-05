"""第二版“今天的河”的检查：点船看详情、真显卡帧率、降速和防卡死保险、减少动态、实时录像。
用法：python check_river2.py [click|fps|guard|reduce|video|all]
注意：video 是旧的实时录像（每秒 25 格，会卡），会覆盖 *-实时录像.mp4；不卡的 60 帧录像用 tools/record_river2.py。"""
import json
import pathlib
import shutil
import subprocess
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "shots2"; OUT.mkdir(exist_ok=True)
MAIN = ROOT / "今天的河-第二版.html"
EVE = ROOT / "今天的河-第二版-假设下午有异常.html"
what = sys.argv[1] if len(sys.argv) > 1 else "all"
GPU = ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"]
READY = "window.todayRiver && window.todayRiver.ready"
MEASURE = """
(ms) => new Promise(res => {
  const ts = []; const t0 = performance.now();
  function f(now) { ts.push(now); if (now - t0 < ms) requestAnimationFrame(f); else {
    const d = []; for (let i = 1; i < ts.length; i++) d.push(ts[i] - ts[i-1]);
    d.sort((a, b) => a - b);
    res({ frames: d.length, fps: +(1000 * d.length / (ts[ts.length-1] - ts[0])).toFixed(1), median_ms: +d[Math.floor(d.length/2)].toFixed(1), p95_ms: +d[Math.floor(d.length*0.95)].toFixed(1), max_ms: +d[d.length-1].toFixed(1), still: todayRiver.still });
  } }
  requestAnimationFrame(f);
})
"""
res = {}
with sync_playwright() as pw:
    if what in ("click", "all"):
        b = pw.chromium.launch(channel="chrome", headless=True, args=GPU)
        pg = b.new_page(viewport={"width": 1500, "height": 1000}, device_scale_factor=1)
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(EVE.as_uri()); pg.wait_for_function(READY); pg.evaluate("todayRiver.seek(10)"); pg.wait_for_timeout(500)
        red = pg.query_selector(".boat.f-bad"); red.hover(); pg.wait_for_timeout(250)
        tip = pg.inner_text("#tip"); red.click(); pg.wait_for_timeout(250)
        pick = pg.inner_text("#pick")
        pg.query_selector("#stage").screenshot(path=str(OUT / "click-stage.png"))
        pg.query_selector("#pick").screenshot(path=str(OUT / "click-pick.png"))
        lamp = pg.query_selector(".lamp.l-bad"); lamp.click(); pg.wait_for_timeout(200); pick_lamp = pg.inner_text("#pick h2")
        pg.click(".sign >> text=守护在岗"); pg.wait_for_timeout(400)
        opened = pg.evaluate("document.querySelector('#g-guard').open")
        pg.click("#g-guard .row summary"); pg.wait_for_timeout(200)
        row = pg.inner_text("#g-guard .row[open]")
        pg.query_selector("#log").screenshot(path=str(OUT / "click-log.png"))
        res["click"] = {"tip": tip, "pick": pick[:260], "pick_lamp": pick_lamp, "guard_group_opened": opened, "row_open": row[:200], "errors": errs,
                        "on_marks": pg.evaluate("document.querySelectorAll('#layer .on').length")}
        b.close()
    if what in ("fps", "all"):
        b = pw.chromium.launch(channel="chrome", headless=True, args=GPU + ["--disable-frame-rate-limit", "--disable-gpu-vsync"])
        out = {}
        for name, w, h, dpr, mobile in (("电脑 1760 宽", 1760, 1100, 1.5, False), ("手机 393 宽", 393, 852, 3, True)):
            pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=dpr, is_mobile=mobile, has_touch=mobile)
            pg.goto(EVE.as_uri()); pg.wait_for_function(READY)
            info = pg.evaluate("""() => { const c = document.querySelector('#water'), g = c.getContext('webgl'), e = g.getExtension('WEBGL_debug_renderer_info');
                return { renderer: e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unknown', canvas: [c.width, c.height] }; }""")
            pg.evaluate("todayRiver.replay()")
            out[name] = {"info": info, "开场": pg.evaluate(MEASURE, 3000), "平时": pg.evaluate(MEASURE, 3000)}
            pg.close()
        res["fps_不限帧率"] = out
        b.close()
    if what in ("guard", "all"):
        b = pw.chromium.launch(channel="chrome", headless=True, args=GPU)
        out = {}
        for name, w, h, dpr, mobile in (("电脑", 1500, 1000, 1, False), ("小米 15 Pro 模拟", 393, 852, 3, True)):
            for rate in (4, 20):
                pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=dpr, is_mobile=mobile, has_touch=mobile)
                logs = []; pg.on("console", lambda m, logs=logs: logs.append(m.text))
                pg.goto(MAIN.as_uri()); pg.wait_for_function(READY, timeout=60000)
                cdp = pg.context.new_cdp_session(pg); cdp.send("Emulation.setCPUThrottlingRate", {"rate": rate})
                pg.evaluate("todayRiver.replay()")
                m = pg.evaluate(MEASURE, 9000)
                print(name, rate, m, flush=True)
                out[f"{name} 降速 {rate} 倍"] = {**m, "console": [x for x in logs if "今天的河" in x]}
                pg.close()
        # 人为把每一格拖到 150 毫秒（每秒不到 7 帧），保险应该在 7 秒左右触发
        pg = b.new_page(viewport={"width": 1500, "height": 1000}, device_scale_factor=1)
        logs = []; pg.on("console", lambda m: logs.append(m.text))
        pg.goto(MAIN.as_uri()); pg.wait_for_function(READY)
        pg.evaluate("() => { const slow = () => { const t = performance.now(); while (performance.now() - t < 150) {} window.__slow = requestAnimationFrame(slow); }; slow(); }")
        pg.wait_for_timeout(9500)
        out["人为拖到每秒不到 7 帧"] = {"still": pg.evaluate("todayRiver.still"), "console": [x for x in logs if "今天的河" in x],
                                "storage": pg.evaluate("({ local: localStorage.length, session: sessionStorage.length })")}
        # 单次长帧：卡 1.5 秒一次，不应该触发
        pg2 = b.new_page(viewport={"width": 1500, "height": 1000}, device_scale_factor=1)
        pg2.goto(MAIN.as_uri()); pg2.wait_for_function(READY); pg2.wait_for_timeout(3000)
        pg2.evaluate("() => { const t = performance.now(); while (performance.now() - t < 1500) {} }"); pg2.wait_for_timeout(6000)
        out["单次卡 1.5 秒"] = {"still": pg2.evaluate("todayRiver.still")}
        res["guard"] = out
        b.close()
    if what in ("reduce", "all"):
        b = pw.chromium.launch(channel="chrome", headless=True, args=GPU)
        ctx = b.new_context(viewport={"width": 1500, "height": 1000}, reduced_motion="reduce")
        pg = ctx.new_page(); pg.goto(MAIN.as_uri()); pg.wait_for_function(READY); pg.wait_for_timeout(2500)
        a = pg.query_selector("#stage").screenshot(path=str(OUT / "reduce-0.png")); pg.wait_for_timeout(1500)
        c = pg.query_selector("#stage").screenshot(path=str(OUT / "reduce-1.png"))
        # 元素截图本身不稳定（同一画面第一次拍和以后拍的会差几个灰度），所以再用整页截图隔 1.5 秒比一次
        f0 = pg.screenshot(); pg.wait_for_timeout(1500); f1 = pg.screenshot()
        res["reduce"] = {"两格完全一样": a == c, "整页隔1.5秒完全一样": f0 == f1,"还在跑的动画个数": pg.evaluate("document.getAnimations().filter(x => x.playState === 'running').length"), "循环在转": pg.evaluate("new Promise(r => { const c = document.querySelector('#water'); const g = c.getContext('webgl'); let n = 0; const o = g.drawArrays.bind(g); g.drawArrays = (...a) => { n++; return o(...a); }; setTimeout(() => r(n), 1200); })"), "标签都在": pg.evaluate("document.querySelectorAll('.tag.show').length"), "灯亮着": pg.evaluate("document.querySelectorAll('.lamp.lit').length")}
        b.close()
    if what in ("video", "all"):
        tmp = OUT / "video-tmp"; shutil.rmtree(tmp, ignore_errors=True)
        b = pw.chromium.launch(channel="chrome", headless=True, args=GPU)
        for name, path in (("今天的河-第二版-实时录像", MAIN), ("今天的河-第二版-假设下午-实时录像", EVE)):
            ctx = b.new_context(viewport={"width": 1500, "height": 900}, device_scale_factor=1, record_video_dir=str(tmp), record_video_size={"width": 1500, "height": 900})
            pg = ctx.new_page(); pg.goto(path.as_uri()); pg.wait_for_function(READY)
            pg.evaluate("window.scrollTo(0, document.querySelector('#scroller').getBoundingClientRect().top + scrollY - 8)")
            pg.evaluate("todayRiver.replay()"); pg.wait_for_timeout(9000)
            video = pg.video.path(); ctx.close()
            mp4 = ROOT / f"{name}.mp4"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-movflags", "+faststart", str(mp4)], check=True)
            res.setdefault("video", {})[name] = {"mp4": str(mp4), "kb": round(mp4.stat().st_size / 1024)}
        b.close()
print(json.dumps(res, ensure_ascii=False, indent=1))

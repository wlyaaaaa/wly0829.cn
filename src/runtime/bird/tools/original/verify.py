"""小鸟模块的自查（无窗口 Chrome）。结果写到 work/verify.json。
1. 接口形状（成品 dist/bird.js）
2. 用 seek 模拟 10 分钟：小动作间隔、挪地方间隔、各段时长（测试版，读 _state）
3. 叫声：醒着点一下几声、睡着点一下几声（数振荡器）
4. 真实时钟：飞进来多久落稳；滚出屏幕、页面隐藏时循环停没停
5. 减少动态：直接站好、不跑循环、点了照样叫
6. 手机宽度：鸟多高、热区多大
7. destroy 后元素清干净
"""
import json
import pathlib
import time

from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).resolve().parents[1]
URL = (R / "demo.html").as_uri()
TEST_JS = (R / "work/bird.test.js").read_text(encoding="utf-8")
INIT = r"""
(() => {
  window.__raf = 0; const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = f => { window.__raf++; return raf(f); };
  window.__osc = 0;
  const AC = window.AudioContext; if (AC) { const co = AC.prototype.createOscillator; AC.prototype.createOscillator = function () { window.__osc++; return co.call(this); }; }
})();
"""
out = {}


def page(pw, test=False, reduce=False, vw=1040, vh=1060):
    br = pw.chromium.launch(channel="chrome", headless=True, args=["--autoplay-policy=no-user-gesture-required"])
    ctx = br.new_context(viewport={"width": vw, "height": vh}, reduced_motion="reduce" if reduce else "no-preference")
    ctx.add_init_script(INIT)
    pg = ctx.new_page()
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    if test:
        pg.route("**/dist/bird.js", lambda r: r.fulfill(status=200, content_type="text/javascript", body=TEST_JS))
    pg.goto(URL)
    pg.wait_for_function("window.demo && [...document.querySelectorAll('.lb-i')].every(i => i.complete && i.naturalWidth)")
    return br, pg, errs


with sync_playwright() as pw:
    # 1 接口
    br, pg, errs = page(pw)
    out["interface"] = pg.evaluate("""() => ({ global: Object.keys(LivingBird), bird: Object.keys(demo.birds.day),
        types: Object.fromEntries(Object.keys(demo.birds.day).map(k => [k, typeof demo.birds.day[k]])),
        arrivePromise: demo.birds.day.arrive() instanceof Promise, hasForce: '_force' in demo.birds.day })""")
    # 4 真实时钟：飞进来落稳的时间（从图片读好开始算的近似值）
    t_arrive = pg.evaluate("""() => new Promise(res => { const b = demo.birds.day; const t0 = performance.now();
        b.leave().then(() => { const t1 = performance.now(); b.arrive().then(() => res({ leave_s: (t1 - t0) / 1000, arrive_s: (performance.now() - t1) / 1000 })); }); })""")
    out["real_clock_flights"] = t_arrive
    r0 = pg.evaluate("window.__raf"); time.sleep(1.0); r1 = pg.evaluate("window.__raf")
    pg.evaluate("document.body.style.paddingBottom = '4000px'; scrollTo(0, 3000)"); time.sleep(0.6)
    r2 = pg.evaluate("window.__raf"); time.sleep(1.5); r3 = pg.evaluate("window.__raf")
    pg.evaluate("scrollTo(0, 0)"); time.sleep(0.6); r4 = pg.evaluate("window.__raf"); time.sleep(1.0); r5 = pg.evaluate("window.__raf")
    pg.evaluate("Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange'))"); time.sleep(0.4)
    r6 = pg.evaluate("window.__raf"); time.sleep(1.5); r7 = pg.evaluate("window.__raf")
    out["power"] = {"raf_per_s_visible": r1 - r0, "raf_in_1_5s_scrolled_away": r3 - r2, "raf_per_s_back": r5 - r4, "raf_in_1_5s_page_hidden": r7 - r6}
    # 7 destroy
    out["destroy"] = pg.evaluate("() => { demo.birds.day.destroy(); return { stages_left_in_day: document.querySelectorAll('#lDay .lb-stage').length, seek_after: demo.birds.day.seek(3) }; }")
    out["errors_real"] = errs
    br.close()

    # 2 + 3 测试版：seek 模拟
    br, pg, errs = page(pw, test=True)
    sim = pg.evaluate(r"""() => {
      const b = demo.birds.day, log = []; let last = null; b.seek(0);
      for (let i = 0; i <= 600 * 30; i++) { const t = i / 30; b.seek(t); const s = b._state; const k = s.act || (s.vis ? 'stand' : 'out');
        if (k !== last) { log.push([+t.toFixed(3), k, s.pose, s.pi]); last = k; } }
      return log; }""")
    starts = {}
    for i, (t, k, pose, pi) in enumerate(sim):
        if k in ("pose", "hop", "up"):
            starts.setdefault(k if k != "pose" else "small", []).append(t)
    small = starts.get("small", []); moves = sorted(starts.get("hop", []) + starts.get("up", []))
    gaps = [round(b - a, 2) for a, b in zip(small, small[1:])]
    mg = [round(b - a, 2) for a, b in zip(moves, moves[1:])]
    durs = {}
    for (t, k, pose, pi), (t2, *_r) in zip(sim, sim[1:]):
        durs.setdefault(k if k != "pose" else "pose:" + pose, []).append(round(t2 - t, 2))
    allst = sorted(small + moves); ag = [round(b - a, 2) for a, b in zip(allst, allst[1:])]
    out["sim_10min"] = {"any_action_gap_min": min(ag), "any_action_gap_max": max(ag), "small_actions": len(small), "small_gap_min": min(gaps), "small_gap_max": max(gaps), "small_gap_mean": round(sum(gaps) / len(gaps), 2),
                        "moves": len(moves), "move_gap_min": min(mg) if mg else None, "move_gap_max": max(mg) if mg else None,
                        "hops": len(starts.get("hop", [])), "perch_flights": len(starts.get("up", [])),
                        "durations": {k: [min(v), max(v)] for k, v in durs.items() if k != "stand"}, "first_events": sim[:8]}
    # 3 叫声：醒着点
    out["chirp"] = pg.evaluate(r"""async () => {
      const b = demo.birds.day; b.seek(0); b.seek(3); const o0 = window.__osc;
      document.querySelector('#lDay .lb-hit').click(); const day = { osc: window.__osc - o0, act: b._state.act, pose: (b.seek(3.2), b._state.pose) };
      const n = demo.birds.night; n.seek(0); n.seek(4); const o1 = window.__osc; document.querySelector('#lNight .lb-hit').click();
      const night = { osc: window.__osc - o1, act: n._state.act, pose_at_0_5s: (n.seek(4.5), n._state.pose), pose_at_2s: (n.seek(6), n._state.pose) };
      // 点正在飞的鸟：不理
      b.seek(0); b.seek(0.5); const o2 = window.__osc; const h = document.querySelector('#lDay .lb-hit'); const shown = h.style.display; h.click();
      return { day, night, flying: { hit_display: shown, osc: window.__osc - o2 } }; }""")
    # 往回 seek 能否重现（同一时刻画面一样）
    out["seek_repeatable"] = pg.evaluate(r"""() => { const b = demo.birds.day; b.seek(0); b.seek(2.5); b._force('look'); b.seek(4); document.querySelector('#lDay .lb-hit').click(); b.seek(6.3);
      const a = document.querySelector('#lDay .lb').style.transform + '|' + b._state.pose; b.seek(1); b.seek(6.3);
      const c = document.querySelector('#lDay .lb').style.transform + '|' + b._state.pose; return { same: a === c, a, c }; }""")
    # Promise 在 seek 模式下何时兑现
    out["promise_seek"] = pg.evaluate(r"""async () => { const b = demo.birds.day; b.seek(0); b.seek(3); let done = null; const t0 = 3;
      b.leave().then(() => { done = b._state.t; }); for (let i = 1; i <= 120 && done == null; i++) { b.seek(t0 + i / 60); await Promise.resolve(); await Promise.resolve(); }
      const leave_s = done - t0; done = null; const t1 = b._state.t; b.arrive().then(() => { done = b._state.t; });
      for (let i = 1; i <= 180 && done == null; i++) { b.seek(t1 + i / 60); await Promise.resolve(); await Promise.resolve(); }
      return { leave_s: +leave_s.toFixed(3), arrive_s: +(done - t1).toFixed(3) }; }""")
    out["errors_test"] = errs
    br.close()

    # 5 减少动态
    br, pg, errs = page(pw, reduce=True)
    time.sleep(0.8)
    out["reduced"] = pg.evaluate(r"""() => { const r0 = window.__raf; const tr = document.querySelector('#lDay .lb').style.transform, vis = getComputedStyle(document.querySelector('#lDay .lb')).visibility;
      const o0 = window.__osc; document.querySelector('#lDay .lb-hit').click(); const tr2 = document.querySelector('#lDay .lb').style.transform;
      return { visible: vis, transform: tr, unchanged_after_tap: tr === tr2, osc_day_tap: window.__osc - o0, raf_total: window.__raf }; }""")
    time.sleep(1.0)
    out["reduced"]["raf_after_1s"] = pg.evaluate("window.__raf")
    out["errors_reduced"] = errs
    br.close()

    # 6 手机宽度
    br, pg, errs = page(pw, vw=375, vh=812)
    time.sleep(2.2)
    out["mobile_375"] = pg.evaluate(r"""() => { const L = document.querySelector('#lDay'), h = L.querySelector('.lb-hit'), f = L.querySelector('.lb-f');
      return { container: [L.clientWidth, L.clientHeight], bird_frame_px: [parseFloat(f.style.width).toFixed(1), parseFloat(f.style.height).toFixed(1)], stand_height_px: (0.13 * L.clientHeight).toFixed(1),
               hit_px: [h.style.width, h.style.height] }; }""")
    out["errors_mobile"] = errs
    br.close()

(R / "work/verify.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(out, ensure_ascii=False, indent=1))

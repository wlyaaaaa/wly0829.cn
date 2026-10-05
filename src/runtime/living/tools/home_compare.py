"""首页拆分前后的对比：照 p1review/freeze_compare.py 的做法（同一个验收页、同一组时刻、同样逐像素比），
改前 = 首页接入包成品（p1review/site/hero-live-new，即 p1/dist），改后 = 拆分后的包（通用部分 living.js + 首页专用 home-scene.js）。
另外比一组开场里的时刻和防卡死、减少动态的行为。
用法：python tools/home_compare.py    （先跑 pack_engine.py、pack_home.py；对比用的验收站自动搭在 work/homecmp/）
输出：work/home-compare.json、work/homecmp/shots/*.png
"""
import json

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

import browser
import common

SITE = common.ENGINE / "work" / "homecmp" / "site"
SHOTS = common.ENGINE / "work" / "homecmp" / "shots"
SHOTS.mkdir(parents=True, exist_ok=True)
WAIT_LIVE = "() => window.inst && inst.diagnostics && ['live','static'].includes(inst.diagnostics().phase)"
LAY = {"h": dict(viewport={"width": 1440, "height": 900}, device_scale_factor=1),
       "v": dict(viewport={"width": 393, "height": 852}, device_scale_factor=3, is_mobile=True, has_touch=True)}
FRAMES = [("day-seek0.8", 12, 0.8), ("day-seek1.6", 12, 1.6), ("day-seek2.6", 12, 2.6), ("day-seek3.9", 12, 3.9), ("day-freeze20", 12, 20),
          ("dusk-freeze20", 18.2, 20), ("night-freeze20", 21.5, 20), ("sleep-freeze20", 2.0, 20)]
PKGS = [("before", "hero-live-new/"), ("after", "home-split/")]


def build_site(home_source):
    """搭对比用的验收站：p1review 的首页验收页（加一行“先加载通用部分”）+ 改前的包 + 改后的包（dist/home + 引擎）。"""
    import shutil
    if SITE.exists():
        common.recycle(SITE)
    SITE.mkdir(parents=True)
    p1 = home_source.resolve() / "site"
    shutil.copytree(p1 / "hero-live-new", SITE / "hero-live-new")
    shutil.copy2(p1 / "site-orig-h.avif", SITE / "site-orig-h.avif")
    shutil.copytree(common.DIST / "home", SITE / "home-split")
    eng = json.loads((common.DIST / "_engine" / "files.json").read_text(encoding="utf-8"))
    shutil.copy2(common.DIST / "_engine" / eng["engine"], SITE / "home-split" / eng["engine"])
    hm = json.loads((SITE / "home-split" / "home.files.json").read_text(encoding="utf-8"))
    man = {"engine": hm["scene"], "core": eng["engine"], "style": hm["style"], "config": hm["config"], "homeImage": hm["homeImage"]}
    (SITE / "home-split" / "hero-live.files.json").write_text(json.dumps(man, ensure_ascii=False), encoding="utf-8")
    html = (p1 / "index.html").read_text(encoding="utf-8")
    old = "  document.write('<link rel=\"stylesheet\" href=\"' + BASE + N.css + '\">');"
    assert old in html
    html = html.replace(old, old + "\n  if (M && M.core) document.write('<script src=\"' + BASE + M.core + '\"><' + '/script>');   // 拆分后的首页：先加载通用部分 living.js")
    (SITE / "index.html").write_text(html, encoding="utf-8")


def main(home_source):
    build_site(home_source)
    res = {}
    with sync_playwright() as pw, browser.server(SITE) as base, browser.managed(pw) as br:
        for key, lay in LAY.items():
            for tag, b in PKGS:
                ctx = br.new_context(**lay)
                pg = ctx.new_page()
                errs = []
                pg.on("pageerror", lambda e: errs.append(str(e)))
                pg.goto(f"{base}/index.html?base={b}&state=ok&preview")
                pg.wait_for_function(WAIT_LIVE, timeout=20000)
                pg.wait_for_timeout(500)
                for label, hour, t in FRAMES:
                    pg.evaluate(f"() => {{ inst.setHour({hour}); inst.seek({t}); }}")
                    pg.wait_for_timeout(250)
                    pg.locator("#home-hero").screenshot(path=str(SHOTS / f"cmp-{tag}-{key}-{label}.png"))
                res.setdefault("page_errors", {})[f"{tag}-{key}"] = errs
                res.setdefault("diagnostics", {})[f"{tag}-{key}"] = pg.evaluate("() => { const d = inst.diagnostics(); return {phase: d.phase, reason: d.reason, rules: d.frameGuard && d.frameGuard.rules}; }")
                ctx.close()
            for label, _, _ in FRAMES:
                a = np.asarray(Image.open(SHOTS / f"cmp-before-{key}-{label}.png").convert("RGB"), dtype=np.int16)
                c = np.asarray(Image.open(SHOTS / f"cmp-after-{key}-{label}.png").convert("RGB"), dtype=np.int16)
                d = np.abs(a - c).max(axis=2)
                ys, xs = np.nonzero(d > 8)
                res[f"{key}-{label}"] = {"max": int(d.max()), "mean": round(float(d.mean()), 4), "pixels_over_8": int((d > 8).sum()),
                                         "diff_bbox_xyxy": [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())] if len(xs) else None, "size": [a.shape[1], a.shape[0]]}
        # 减少动态：两版都应是静止原图
        for tag, b in PKGS:
            ctx = br.new_context(**LAY["h"], reduced_motion="reduce")
            pg = ctx.new_page()
            pg.goto(f"{base}/index.html?base={b}&state=ok")
            pg.wait_for_timeout(4000)      # 等原图解码到最终质量（2.5 秒时偶尔还没到，会差出一点）
            res.setdefault("reduced_motion", {})[tag] = pg.evaluate("() => { const d = inst.diagnostics(); return {phase: d.phase, reason: d.reason}; }")
            pg.locator("#home-hero").screenshot(path=str(SHOTS / f"rm-{tag}.png"))
            ctx.close()
        a = np.asarray(Image.open(SHOTS / "rm-before.png").convert("RGB"), dtype=np.int16)
        c = np.asarray(Image.open(SHOTS / "rm-after.png").convert("RGB"), dtype=np.int16)
        res["reduced_motion"]["max_diff"] = int(np.abs(a - c).max())
        # 防卡死：每帧卡 180 毫秒，两版都应退回静态
        stall = """(() => { const raf = window.requestAnimationFrame.bind(window); window.__stall = 0;
          window.requestAnimationFrame = cb => raf(t => { if (window.__stall) { const e = performance.now() + window.__stall; while (performance.now() < e) {} } cb(performance.now()); }); })();"""
        for tag, b in PKGS:
            ctx = br.new_context(**LAY["h"])
            pg = ctx.new_page()
            pg.add_init_script(stall)
            pg.goto(f"{base}/index.html?base={b}&state=ok")
            pg.wait_for_function(WAIT_LIVE, timeout=20000)
            pg.wait_for_timeout(3000)
            pg.evaluate("() => { window.__stall = 180; }")
            pg.wait_for_timeout(11000)
            res.setdefault("guard_stall_180ms", {})[tag] = pg.evaluate("() => { const d = inst.diagnostics(); return {phase: d.phase, reason: d.reason, trigger: d.frameGuard && d.frameGuard.trigger && d.frameGuard.trigger.rule}; }")
            ctx.close()
        br.close()
    (common.ENGINE / "work" / "home-compare.json").write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(res, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    import argparse
    import pathlib
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--home-source', required=True, type=pathlib.Path)
    main(ap.parse_args().home_source)

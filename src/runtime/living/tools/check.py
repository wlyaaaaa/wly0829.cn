"""检查一页活画（预览页）：逐条给数，结果写进 art/<画名>/check/<页名>-<h|v>.json。

1. 静止对齐：所有动作停住时，画布和底下原图逐像素比（最大差、99.9% 分位、插画框四边一圈的最大差）。
   a) 按交付状态（不动的地方画布透明）；b) 强制整框都由画布画（检查贴图采样和浏览器缩放原图差多少）。
2. 减少动态：系统设了“减少动态”时画面就是原图（逐像素比）。
3. 范围图有没有盖到字：拿无字原图和整屏图里插画框那一块比，差得多的地方就是排版压在插画上的东西（字、按钮），
   范围图、各动作的几何不能落在那里；几何也不能超出插画框。
4. 硬物件不动：只开位移类动作（不开光），在 spec 里 "rigid" 圈的硬物件范围内，扣掉声明了要动的部件后，像素不能变。
5. 防卡死保险：正常播 12 秒不触发；每帧卡 180 毫秒持续 → 触发；单次卡 2.5 秒 → 不触发。
6. 帧率：正常播放时每秒画多少帧。
7. 显卡耗时：画布强制 3840×2162，连续画 20 次求平均（读回一个像素等显卡做完）。
8. 节奏规矩：来回的动作一个来回 ≥ 4 秒；招牌动作演一次后停 3～6 秒；开场 1.2～2 秒。
9. 大小：这一页的文件夹（config.json + 范围图）≤ 300 KB（目标 120 KB）。

用法：python tools/check.py <画名或页名> [--page 页名] [--orient h|v|both]
--static 并行静态并保存指纹；--performance 只补性能；默认仍逐项全跑。
--category white-single 明确采用白底单物件口径，省略长 GPU 矩阵。
--quick 兼容旧入口，只验静态，报告 complete=false，不是完整验收。
"""
import argparse
import io
import json
import statistics
import time
import hashlib
import math
import re

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

import browser
import build_preview
import common
import pack
from playwright.sync_api import sync_playwright

STALL_INIT = """(() => { const raf = window.requestAnimationFrame.bind(window); window.__stall = 0; window.__stallOnce = 0; window.__storageWrites = 0;
  for (const key of ['setItem','removeItem','clear']) { const old=Storage.prototype[key]; Storage.prototype[key]=function(...args){window.__storageWrites++;return old.apply(this,args);}; }
  window.requestAnimationFrame = cb => raf(t => { let ms = window.__stall; if (window.__stallOnce) { ms += window.__stallOnce; window.__stallOnce = 0; }
    if (ms) { const e = performance.now() + ms; while (performance.now() < e) {} } cb(performance.now()); }); })();"""

LIGHT = {"glow", "glint", "sweep", "ripple", "dots", "sparkle", "dust", "leaf"}
CONT = {"sway", "flow", "glow", "ripple", "part", "march", "drift"}


def shot(pg, clip):
    # 分数 CSS clip 会让 Chrome 对截图再采样；同一纯静态页面连拍也可能差 1。
    # 从页面设备像素网格无损裁框，避免把截图工具的重采样当成页面变化。
    image = Image.open(io.BytesIO(pg.screenshot(full_page=True))).convert("RGB")
    dpr = pg.evaluate("() => window.devicePixelRatio")
    x, y = math.floor(clip['x'] * dpr), math.floor(clip['y'] * dpr)
    right = math.ceil((clip['x'] + clip['width']) * dpr)
    bottom = math.ceil((clip['y'] + clip['height']) * dpr)
    if x < 0 or y < 0 or right > image.width or bottom > image.height:
        raise ValueError(f'检查裁框超出完整页面设备像素图：{(x,y,right,bottom)} / {image.size}')
    return np.asarray(image.crop((x,y,right,bottom)), np.int16)


def hide_layer(pg, on):
    pg.evaluate("(on) => { let s = document.getElementById('__hide'); if (on && !s) { s = document.createElement('style'); s.id='__hide'; s.textContent='.living-layer{display:none!important}'; document.head.append(s); } if (!on && s) s.remove(); }", on)
    browser.frame_settle(pg)


def stats(d, band=None):
    m = d.max(-1)
    out = {"max": int(m.max()), "p999": float(np.percentile(m, 99.9)), "mean": round(float(m.mean()), 3), "pixels_over_4": round(float((m > 4).mean()), 5)}
    if band:
        b = np.zeros(m.shape, bool)
        b[:band] = b[-band:] = True
        b[:, :band] = b[:, -band:] = True
        out["edge_max"] = int(m[b].max())
    return out


def rules(spec):
    """节奏规矩。"""
    res = {"ok": True, "items": []}
    intro = spec.get("intro", {}).get("dur", 1.6)
    if not 1.2 <= intro <= 2.0:
        res["ok"] = False
        res["items"].append(f"开场 {intro} 秒，不在 1.2～2 秒")
    groups = {}
    for e in spec.get("effects", []):
        t = e.get("time")
        if t and t.get("dur"):
            groups.setdefault(t["period"], []).append((t["start"], t["start"] + t["dur"], e.get("name", e["type"])))
        elif e["type"] in CONT and e.get("period") is not None and e["type"] != "march":
            if e.get("amount", 1) == 0 and e.get("nightBase"):
                continue
            if e["period"] < 4:
                res["ok"] = False
                res["items"].append(f"{e.get('name', e['type'])}：一个来回 {e['period']} 秒，短于 4 秒")
    for per, lst in groups.items():
        busy = max(b for a, b, n in lst) - min(a for a, b, n in lst)
        rest = per - busy
        ok = 3 <= rest <= 6.01
        res["items"].append(f"周期 {per} 秒的招牌动作：演 {busy:.1f} 秒、停 {rest:.1f} 秒" + ("" if ok else "（不在 3～6 秒）"))
        res["ok"] &= ok
    return res


def detect_overlay(crop, src, size):
    """在实际烘焙分辨率检测，再把结果映射到范围图；避免上采样边缘误报。"""
    native = crop.size
    measured = (min(size[0], native[0]), min(size[1], native[1]))
    crop = crop.resize(measured, Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    src = src.resize(native, Image.Resampling.LANCZOS).resize(measured, Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    d = np.abs(np.asarray(crop, np.int16) - np.asarray(src, np.int16)).max(-1)
    overlay = ndimage.binary_opening(d > 48, iterations=1)
    return np.asarray(Image.fromarray((overlay * 255).astype('uint8')).resize(size, Image.Resampling.NEAREST)) > 0


def overlay_map(art, page, orient, size):
    """整屏图插画框里和无字原图明显不同的像素，返回 size 大小的 0/1 数组。"""
    return detect_overlay(common.crop_box(page, orient), common.illustration(art, orient=orient), size)


def geometry_in_box(spec):
    bad = []

    def walk(o, path):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in pack.POINT_KEYS and isinstance(v, list) and len(v) == 2 and all(isinstance(x, (int, float)) for x in v):
                    if not (-0.001 <= v[0] <= 1.001 and -0.001 <= v[1] <= 1.001):
                        bad.append(f"{path}.{k}={v}")
                elif k in pack.POINTS_KEYS and isinstance(v, list):
                    for q in v:
                        if not (-0.001 <= q[0] <= 1.001 and -0.001 <= q[1] <= 1.001):
                            bad.append(f"{path}.{k}含{q}")
                else:
                    walk(v, f"{path}.{k}")
        elif isinstance(o, list):
            for i, v in enumerate(o):
                walk(v, f"{path}[{i}]")
    walk(spec.get("effects", []), "effects")
    for p in spec.get("bird", {}).get("perches", []):
        if not (0 <= p["x"] <= 1 and 0 <= p["y"] <= 1):
            bad.append(f"落脚点 {p}")
    return bad


def input_fingerprint(art, page, orient):
    """静态证据绑定真实源码、配置、范围图、底图和坐标合同。"""
    paths = set(common.SRC.glob('*'))
    paths.add(common.CONTRACT)
    paths.add(common.ENGINE / 'contract-overrides.json')
    paths.update(common.ART.joinpath(art).glob('*.json'))
    for f in common.ART.joinpath(art).rglob('*'):
        if f.is_file() and f.suffix.lower() in {'.json', '.webp', '.png', '.jpg', '.jpeg'} and not set(f.relative_to(common.ART / art).parts[:-1]) & {'preview', 'check', 'shots', 'video', 'work'}:
            paths.add(f)
    screens = []
    for name in common.art_table()[art]['pages']:
        for direction in ('h', 'v'):
            if common.measured(name, direction):
                screens.append(common.screen(name, direction))
                paths.update((common.source_path(art, direction), common.screen_image_path(name, direction), common.site_image(name, direction)))
    paths.update(build_preview.BIRD_DIST.glob('*'))
    for name in ('common.py', 'pack.py', 'build_preview.py', 'check.py'):
        paths.add(common.ENGINE / 'tools' / name)
    files = {str(f.resolve()): hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(paths) if f.is_file()}
    payload = {'schema': 'living-check-input.v1', 'art': art, 'page': page, 'orient': orient, 'screens': screens, 'files': files}
    raw = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')
    return {'sha256': hashlib.sha256(raw).hexdigest(), 'files': files, 'schema': payload['schema']}


def _write_report(rep, suffix=''):
    out = common.ART / rep['art'] / 'check'
    out.mkdir(parents=True, exist_ok=True)
    path = out / f"{rep['page']}-{rep['orient']}{suffix}.json"
    if path.exists():
        old = path.read_bytes()
        try:
            failed = not json.loads(old).get('acceptance', {}).get('passed', False)
        except (ValueError, TypeError):
            failed = True
        if failed:
            prior = out / 'prior-failures'
            prior.mkdir(exist_ok=True)
            (prior / f"{path.stem}-{hashlib.sha256(old).hexdigest()[:16]}.json").write_bytes(old)
    path.write_text(json.dumps(rep, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    return path


def _run_static(art, page, orient):
    spec = common.load_spec(art, orient)
    path = common.ART / art / "preview" / f"{page}-{orient}.html"
    with browser.build_lock(art):
        build_preview.build(art, page, (orient,))
    rep = {"page": page, "art": art, "orient": orient, "at_beijing": common.beijing_now(),
           "engine_source_sha256": build_preview.evidence(path),
           "pixel_capture": "full-page-device-pixels-lossless-crop",
           "overlay_sampling": "native-baked-resolution-no-upsample"}
    rep["rules"] = rules(spec)
    rep["geometry_outside_box"] = geometry_in_box(spec)
    # 范围图盖字
    masks = {}
    for m in ("m0", "m1"):
        f = common.mask_dir(art, orient) / f"{m}.webp"
        if f.exists():
            masks[m] = np.asarray(Image.open(f).convert("RGB"), np.float32) / 255
    if masks:
        any_m = np.max(np.stack([a.max(-1) for a in masks.values()]), axis=0)
        ov = overlay_map(art, page, orient, (any_m.shape[1], any_m.shape[0]))
        hit = (any_m > 0.05) & ov
        rep["masks_over_text"] = {"overlay_pixels": int(ov.sum()), "mask_pixels_on_overlay": int(hit.sum())}
    with browser.build_lock(art):
        tmp = common.ART / art / "work" / "_chk"
        try:
            sizes = pack.build(art, out_root=tmp, quiet=True)
            rep["size_bytes"] = {r["page"]: r["bytes"] for r in sizes}
        finally:
            common.recycle(tmp)
    with sync_playwright() as pw, browser.managed(pw, scope='capture') as br:
        # ---- 1. 静止对齐 ----
        pg = browser.open_preview(br, path, orient)
        pg.add_init_script(STALL_INIT)
        rep["load"] = browser.wait_ready(pg)
        if rep['load'].get('phase') != 'live':
            rep['runtime_failure'] = rep['load']
            rep['acceptance'] = {'passed':False,'checks':{'load_live':False}}
            out = common.ART / art / 'check'; out.mkdir(exist_ok=True)
            br.close()
            return rep
        pg.evaluate("() => { living.setHour(12); living.setDebug({noBird: true}); }")
        clip = browser.box_clip(pg, 0.0)
        band = 3
        hide_layer(pg, True)
        orig = shot(pg, clip)
        hide_layer(pg, False)
        pg.evaluate("() => { living.setDebug({only: 'none', noIntro: true}); living.seek(30); }")
        browser.frame_settle(pg)
        rep["rest_shipped"] = stats(np.abs(shot(pg, clip) - orig), band)
        pg.evaluate("() => { living.setDebug({full: true}); living.seek(30); }")
        browser.frame_settle(pg)
        rep["rest_full_canvas"] = stats(np.abs(shot(pg, clip) - orig), band)
        pg.evaluate("() => { living.setDebug({full: false}); }")
        # ---- 4. 硬物件不动 ----
        H, W = orig.shape[:2]
        rig = Image.new("L", (W, H), 0)
        d = ImageDraw.Draw(rig)
        for poly in spec.get("rigid", []):
            d.polygon([(u * W, v * H) for u, v in poly], fill=255)
        rig = np.asarray(rig) > 0
        allowed = np.zeros((H, W), bool)
        for e in spec.get("effects", []):
            if e["type"] in ("part", "flow", "drift", "carry", "spin", "march", "reveal") or e.get("rigidOk"):
                ch = (e.get("region") or {}).get("mask")
                if ch:
                    m, c = ch.split(".")
                    a = np.asarray(Image.fromarray((masks[m][..., "rgb".index(c)] * 255).astype("uint8")).resize((W, H), Image.BILINEAR)) > 8
                    allowed |= ndimage.binary_dilation(a, iterations=6)
                if e["type"] == "spin":
                    yy, xx = np.mgrid[0:H, 0:W]
                    c, r = e["center"], e["radius"]
                    allowed |= (((xx / W - c[0]) / r[0]) ** 2 + ((yy / H - c[1]) / r[1]) ** 2) < (e.get("outer", 1.22) * 1.15) ** 2
                if e["type"] == "carry":
                    ch2 = (e.get("cover") or {}).get("mask")
                    if ch2:
                        m, c = ch2.split(".")
                        a = np.asarray(Image.fromarray((masks[m][..., "rgb".index(c)] * 255).astype("uint8")).resize((W, H), Image.BILINEAR)) > 8
                        allowed |= ndimage.binary_dilation(a, iterations=4)
                    # 飞的那件东西沿路会经过硬物件前面：把它走过的一条带子扣掉（按东西的大小放宽）
                    sw = Image.new("L", (W, H), 0)
                    dw = ImageDraw.Draw(sw); rr = max(2, int(0.08 * W))
                    dw.line([(u * W, v * H) for u, v in e["path"]], fill=255, width=2 * rr)
                    for u, v in e["path"]:
                        dw.ellipse([u * W - rr, v * H - rr, u * W + rr, v * H + rr], fill=255)
                    allowed |= np.asarray(sw) > 0
        # 叶子挡在硬物件前面的地方也允许变（叶子在晃）
        for e in spec.get("effects", []):
            if e["type"] == "sway":
                m, c = e["region"]["mask"].split(".")
                a = np.asarray(Image.fromarray((masks[m][..., "rgb".index(c)] * 255).astype("uint8")).resize((W, H), Image.BILINEAR)) > 5
                allowed |= ndimage.binary_dilation(a, iterations=3)
        check_area = rig & ~allowed
        worst = {"max": 0, "pixels_over_6": 0}
        pg.evaluate("() => living.setDebug({only: 'motion', noIntro: true})")
        for t in [3.0, 4.1, 5.3, 6.6, 8.2, 9.9, 11.7]:
            pg.evaluate(f"() => living.seek({t})")
            browser.frame_settle(pg)
            dd = np.abs(shot(pg, clip) - orig).max(-1)
            if check_area.any():
                worst["max"] = max(worst["max"], int(dd[check_area].max()))
                bad_n = int((dd[check_area] > 6).sum())
                if bad_n > worst["pixels_over_6"]:
                    worst["pixels_over_6"] = bad_n
                    worst["worst_at"] = t
                    # 把不该变却变了的像素标成红色，存一张图（硬物件范围画成淡蓝），方便找原因
                    vis = (orig.astype(np.float32) * 0.6 + 100).clip(0, 255)
                    vis[check_area] = vis[check_area] * 0.7 + np.array([40, 80, 140]) * 0.3
                    vis[check_area & (dd > 6)] = [255, 0, 0]
                    (common.ART / art / "check").mkdir(exist_ok=True)
                    Image.fromarray(vis.astype("uint8")).save(common.ART / art / "check" / f"{page}-{orient}-rigid.png")
        worst["checked_pixels"] = int(check_area.sum())
        rep["rigid_still"] = worst
        pg.evaluate("() => living.setDebug({only: null, noIntro: false})")
        pg.context.close()
        # ---- 2. 减少动态 ----
        pg = browser.open_preview(br, path, orient, reduced=True)
        time.sleep(1.5)
        diag = pg.evaluate("() => living.diagnostics()")
        clip2 = browser.box_clip(pg, 0.0)
        a = shot(pg, clip2)
        hide_layer(pg, True)
        b = shot(pg, clip2)
        rep["reduced_motion"] = {"phase": diag.get("phase"), "reason": diag.get("reason"), "max_diff_vs_original": int(np.abs(a - b).max()),
                                 "canvas_visible": pg.evaluate("() => { const c = document.querySelector('.living-layer canvas'); return !!c && getComputedStyle(c).visibility === 'visible' && getComputedStyle(c).display !== 'none'; }")}
        pg.context.close()
        br.close()
        rep['resources_static'] = br._living_resource_state()
    out = common.ART / art / "check"
    out.mkdir(exist_ok=True)
    checks = {'load_live':rep['load']['phase']=='live', 'alignment':rep['rest_shipped']['edge_max']<=2,
              'reduced':rep['reduced_motion']['max_diff_vs_original']==0 and not rep['reduced_motion']['canvas_visible'],
              'text':rep.get('masks_over_text',{}).get('mask_pixels_on_overlay',0)==0,
              'geometry':not rep['geometry_outside_box'], 'rigid':rep['rigid_still']['pixels_over_6']==0,
              'rhythm':rep['rules']['ok'], 'size':all(v<=300000 for v in rep['size_bytes'].values())}
    rep['acceptance']={'passed':all(checks.values()),'checks':checks}
    return rep


def _fresh(br, path, orient, cpu_rate=None):
    pg = browser.open_preview(br, path, orient, extra={'cpu_rate': cpu_rate} if cpu_rate else None)
    try:
        pg.add_init_script(STALL_INIT)
        pg.reload()
        diag = browser.wait_ready(pg)
        if diag.get('phase') != 'live':
            raise RuntimeError(f'性能页未进入活画：{diag}')
    except BaseException:
        pg.context.close()
        raise
    return pg


def _observe(pg, seconds=12):
    started = pg.evaluate("() => ({frames:living.diagnostics().frames,now:performance.now()})")
    time.sleep(seconds)
    observed = pg.evaluate("() => {const d=living.diagnostics();return {frames:d.frames,now:performance.now(),diagnostics:d};}")
    dg = observed['diagnostics']
    elapsed = (observed['now'] - started['now']) / 1000
    count = observed['frames'] - started['frames']
    return {'phase': dg['phase'], 'reason': dg.get('reason'), 'trigger': dg['frameGuard']['trigger'],
            'fps': round(count / elapsed, 2), 'frames': dg['frames'], 'observed_frames': count,
            'observed_seconds': round(elapsed, 4), 'last_window_fps': dg['fps']}


def guard_logic_fingerprint():
    """只有全站叶幅那一行可不同；其它任何源码变化都不复用注入证明。"""
    source = (common.SRC / 'living.js').read_text(encoding='utf-8')
    normalized, count = re.subn(r'^const LEAF_AMP\s*=\s*[0-9.eE+-]+;[^\n]*$',
                                'const LEAF_AMP = <global-leaf-amplitude>;', source, flags=re.M)
    if count != 1:
        raise ValueError('无法唯一定位全站叶幅，不得共享保险证明')
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()


def load_guard_proof(path):
    from pathlib import Path
    proof = json.loads(Path(path).read_text(encoding='utf-8'))
    performance = proof.get('performance', proof)
    if performance.get('guard_logic_sha256') != guard_logic_fingerprint():
        raise ValueError('共享保险证明的源码机制指纹不符，须实际重新跑注入')
    if not all(performance.get('checks', {}).get(k) for k in ('single_stall', 'persistent_stall')):
        raise ValueError('共享保险证明未通过 2500ms/180ms 注入')
    return {'path': str(Path(path).resolve()), 'guard': performance['guard'],
            'at_beijing': performance['at_beijing'], 'guard_logic_sha256': performance['guard_logic_sha256']}


def _measure_performance(br, art, page, orient, category, guard_proof=None):
    path = common.ART / art / 'preview' / f'{page}-{orient}.html'
    rep = {'at_beijing': common.beijing_now(), 'scope': 'performance', 'category': category,
           'guard_logic_sha256': guard_logic_fingerprint(),
           'injected_guard_scope': 'shared-passed-proof' if guard_proof else 'actual-this-config'}
    if guard_proof:
        rep['guard_proof_reused'] = {k: v for k, v in guard_proof.items() if k != 'guard'}
    g = {}
    p = _fresh(br, path, orient)
    try:
        g['normal_12s'] = _observe(p)
        if guard_proof:
            g['single_2_5s_stall'] = guard_proof['guard']['single_2_5s_stall']
        else:
            p.evaluate("() => { window.__stallOnce = 2500; }")
            time.sleep(6)
            dg = p.evaluate("() => living.diagnostics()")
            g['single_2_5s_stall'] = {'phase': dg['phase'], 'trigger': dg['frameGuard']['trigger']}
    finally:
        p.context.close()
    # 每个实际手机方向真播 12 秒，CPU 4 倍降速从页面初始化起生效。
    phone_path = common.ART / art / 'preview' / f'{page}-v.html'
    p = _fresh(br, phone_path, 'v', 4)
    try:
        g['phone_cdp_4x_12s'] = _observe(p)
    finally:
        p.context.close()
    if orient == 'h':
        p = _fresh(br, path, orient, 4)
        try:
            g['desktop_cdp_4x_12s'] = _observe(p)
        finally:
            p.context.close()
    if guard_proof:
        g['stall_180ms'] = guard_proof['guard']['stall_180ms']
    else:
        p = _fresh(br, path, orient)
        try:
            time.sleep(1)
            p.evaluate("() => { window.__stall = 180; }")
            t0 = time.monotonic()
            dg = p.evaluate("() => living.diagnostics()")
            while time.monotonic() - t0 < 25 and dg['phase'] == 'live':
                time.sleep(0.5)
                dg = p.evaluate("() => living.diagnostics()")
            vis = p.evaluate("() => { const c = document.querySelector('.living-layer canvas'); return !!c && getComputedStyle(c).visibility === 'visible'; }")
            g['stall_180ms'] = {'phase': dg['phase'], 'reason': dg.get('reason'), 'trigger': dg['frameGuard']['trigger'],
              'seconds': round(time.monotonic() - t0, 1), 'canvas_visible_after': vis, 'storage_writes': p.evaluate("() => window.__storageWrites")}
        finally:
            p.context.close()
    rep['guard'] = g
    rep['fps_normal'] = g['normal_12s']['fps']
    checks = {'normal': g['normal_12s']['phase'] == 'live', 'single_stall': g['single_2_5s_stall']['phase'] == 'live',
      'phone_cpu4x': g['phone_cdp_4x_12s']['phase'] == 'live', 'fps_normal': rep['fps_normal'] >= 55,
      'persistent_stall': g['stall_180ms']['phase'] == 'static' and g['stall_180ms']['reason'] == 'slow-frames'
          and not g['stall_180ms']['canvas_visible_after'] and g['stall_180ms']['storage_writes'] == 0}
    if orient == 'h':
        checks['desktop_cpu4x'] = g['desktop_cdp_4x_12s']['phase'] == 'live'
    if category == 'full':
        p = _fresh(br, path, orient)
        try:
            p.evaluate("() => { living.setDebug({canvas: [3840, 2162]}); living.seek(5); }")
            r = p.evaluate("""(n) => { const sc = living.scene(); const gl = sc && sc.gl(); if(!gl || gl.isContextLost()) return {unavailable:true,diagnostics:living.diagnostics()}; const px = new Uint8Array(4);
              const one = k => { gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); const t0=performance.now(); for(let i=0;i<k;i++) gl.drawArrays(gl.TRIANGLE_STRIP,0,4); gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); return performance.now()-t0; };
              one(5); const values=[]; for(let i=0;i<n;i++) values.push(one(20)/20); const e=gl.getExtension('WEBGL_debug_renderer_info');
              return {canvas:[gl.canvas.width,gl.canvas.height],batch20:values,renderer:e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):''}; }""", 30)
            if r.get('unavailable'):
                rep['gpu_ms_at_3840x2162'] = {'available': False, 'diagnostics': r['diagnostics']}
            else:
                b = sorted(r['batch20'])
                rep['gpu_ms_at_3840x2162'] = {'available': True, 'canvas': r['canvas'], 'per_draw_median': round(statistics.median(b), 3),
                  'per_draw_p95': round(b[int(0.95 * (len(b) - 1))], 3), 'renderer': r['renderer']}
            checks['gpu_budget'] = rep['gpu_ms_at_3840x2162'].get('available', False) and rep['gpu_ms_at_3840x2162']['per_draw_median'] <= 1
        finally:
            p.context.close()
    else:
        rep['gpu_measurement_scope'] = 'omitted-white-single-no-long-gpu-matrix'
    rep['checks'] = checks
    rep['lock'] = dict(br._living_scope)
    return rep


def run(art, page, orient, quick=False, stage='full', category='full', br=None, guard_proof=None):
    if quick and stage != 'full':
        raise ValueError('--quick 不与 --static/--performance 混用')
    before = input_fingerprint(art, page, orient)
    static_path = common.ART / art / 'check' / f'{page}-{orient}-static.json'
    started = time.monotonic()
    proof = load_guard_proof(guard_proof) if guard_proof else None
    if stage == 'performance':
        if not static_path.exists():
            raise ValueError(f'缺少有指纹的静态证据，先运行 --static：{static_path}')
        rep = json.loads(static_path.read_text(encoding='utf-8'))
        if not rep.get('acceptance', {}).get('passed') or rep.get('input_fingerprint', {}).get('sha256') != before['sha256']:
            raise ValueError(f'静态证据未过或输入已变，须重做 --static：{static_path}')
        rep['static_reused'] = True
    else:
        rep = _run_static(art, page, orient)
        rep['input_fingerprint'] = before
        rep['scope'] = 'quick' if quick else 'static'
        rep['acceptance']['scope'] = rep['scope']
        rep['acceptance']['complete'] = False
        if input_fingerprint(art, page, orient)['sha256'] != before['sha256']:
            raise RuntimeError('静态检查期间输入变了，结果不能用于复用')
        rep['wall_seconds_static'] = round(time.monotonic() - started, 3)
        if not quick:
            _write_report(rep, '-static')
        _write_report(rep)
        if stage == 'static' or quick or not rep['acceptance']['passed']:
            return rep
    # 单独构建手机页；构建不采帧，短锁仅保护同幅临时目录。
    with browser.build_lock(art):
        build_preview.build(art, page, ('h', 'v'))
    if br is None:
        with sync_playwright() as pw, browser.managed(pw, scope='performance') as owned:
            perf = _measure_performance(owned, art, page, orient, category, proof)
            owned.close()
            rep['resources_performance'] = owned._living_resource_state()
    else:
        perf = _measure_performance(br, art, page, orient, category, proof)
    if input_fingerprint(art, page, orient)['sha256'] != before['sha256']:
        raise RuntimeError('性能检查期间输入变了，结果不能与静态证据合并')
    rep['performance'] = perf
    rep.update({k: v for k, v in perf.items() if k in ('guard', 'fps_normal', 'gpu_ms_at_3840x2162', 'gpu_measurement_scope')})
    rep['scope'] = 'full' if category == 'full' else 'white-single'
    rep['category'] = category
    checks = {**rep['acceptance']['checks'], **perf['checks']}
    rep['acceptance'] = {'passed': all(checks.values()), 'checks': checks, 'scope': rep['scope'], 'complete': True}
    rep['performance_at_beijing'] = common.beijing_now()
    rep['wall_seconds_this_stage'] = round(time.monotonic() - started, 3)
    _write_report(rep, '-performance')
    _write_report(rep)
    return rep


def summary(rep):
    lines = [f"== {rep['page']} {rep['orient']}（画 {rep['art']}），本次范围 {rep.get('scope', '未知')}"]
    if 'runtime_failure' in rep:
        return '\n'.join(lines+[f"预览未进入活画：{json.dumps(rep['runtime_failure'],ensure_ascii=False)}"])
    lines.append(f"静止对齐（交付状态）：最大差 {rep['rest_shipped']['max']}，四边一圈最大差 {rep['rest_shipped']['edge_max']}")
    lines.append(f"静止对齐（整框强制由画布画）：最大差 {rep['rest_full_canvas']['max']}，99.9% 分位 {rep['rest_full_canvas']['p999']:.1f}，平均 {rep['rest_full_canvas']['mean']}，四边最大差 {rep['rest_full_canvas']['edge_max']}")
    rm = rep["reduced_motion"]
    lines.append(f"减少动态：{rm['phase']}/{rm['reason']}，和原图最大差 {rm['max_diff_vs_original']}，画布可见 {rm['canvas_visible']}")
    if "masks_over_text" in rep:
        lines.append(f"范围图盖字：排版压在插画上的像素 {rep['masks_over_text']['overlay_pixels']}，其中被范围图盖到 {rep['masks_over_text']['mask_pixels_on_overlay']}；几何超框 {rep['geometry_outside_box'] or '无'}")
    lines.append(f"硬物件不动（只开位移）：检查 {rep['rigid_still']['checked_pixels']} 像素，最大变化 {rep['rigid_still']['max']}，变化超过 6 的像素 {rep['rigid_still']['pixels_over_6']}")
    if "guard" in rep:
        g = rep["guard"]
        lines.append(f"保险：正常 12 秒 {g['normal_12s']['phase']}（帧率 {g['normal_12s']['fps']}）；单次卡 2.5 秒 {g['single_2_5s_stall']['phase']}；每帧卡 180 毫秒 → {g['stall_180ms']['phase']}/{g['stall_180ms']['reason']}（{g['stall_180ms']['seconds']} 秒），之后画布可见 {g['stall_180ms']['canvas_visible_after']}，存储写入 {g['stall_180ms']['storage_writes']}")
        phone = g.get('phone_cdp_4x_12s')
        if phone:
            lines.append(f"手机 4 倍 CPU 降速：实测 {phone['observed_seconds']} 秒、{phone['observed_frames']} 格、{phone['fps']} fps，状态 {phone['phase']}")
    if "gpu_ms_at_3840x2162" in rep:
        x = rep["gpu_ms_at_3840x2162"]
        if x.get('available',True):
            lines.append(f"显卡耗时（画布 {x['canvas'][0]}×{x['canvas'][1]}）：每帧中位 {x['per_draw_median']} 毫秒，p95 {x['per_draw_p95']} 毫秒（{x['renderer']}）")
        else:
            lines.append('显卡量测不可用：'+json.dumps(x['diagnostics'],ensure_ascii=False))
    lines.append("节奏：" + "；".join(rep["rules"]["items"]) + ("" if rep["rules"]["ok"] else "  ← 不合规矩"))
    lines.append("大小：" + "，".join(f"{k} {v / 1024:.1f} KB" for k, v in rep["size_bytes"].items()))
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("art")
    ap.add_argument("--page")
    ap.add_argument("--orient", default="both", choices=["h", "v", "both"])
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--quick", action="store_true", help="兼容旧调用，只检查静态，不能当完整验收")
    mode.add_argument("--static", action="store_true", help="并行静态检查，保存输入指纹")
    mode.add_argument("--performance", action="store_true", help="仅补性能，要求当前输入的静态证据已过")
    ap.add_argument("--category", choices=["full", "white-single"], default="full")
    ap.add_argument("--guard-proof", help="共享已过且机制指纹相符的 2500ms/180ms 注入证明；正常/4x 每配置实跑")
    a = ap.parse_args()
    art = a.art if a.art in common.art_table() else common.art_of_page(a.art)
    page = a.page or common.art_table()[art]["pages"][0]
    failed=[]
    for o in (("h", "v") if a.orient == "both" else (a.orient,)):
        rep=run(art, page, o, a.quick, stage="static" if a.static else "performance" if a.performance else "full", category=a.category, guard_proof=a.guard_proof)
        print(summary(rep), flush=True)
        if not rep['acceptance']['passed']:
            print('未通过项：'+', '.join(k for k,v in rep['acceptance']['checks'].items() if not v), flush=True)
            failed.append(o)
    if failed:raise SystemExit(1)


if __name__ == "__main__":
    main()

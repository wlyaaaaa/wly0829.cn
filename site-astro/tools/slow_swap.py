"""慢网慢机下逐帧看插画“静态图 → 动画”的接替，并录成小动图。
条件：慢（下载 1.6 Mbps、往返延迟 150 ms、CPU 降速 4 倍、全新浏览器、不用缓存）和 常速再次打开（先打开一次，再刷新录）。
逐帧量插画区域的非白像素占比：一旦出现过又掉下去（低于此前最高的 60%）记为“出现—消失—再出现”。
同时在页面里记下插画区、动画层、小鸟和落叶上所有从不透明度 0 开始的动画/过渡，以及静态图第一次可见、动画层 is-live 的时刻。
用法：python tools/slow_swap.py <输出目录> [--base http://127.0.0.1:4391] [--pages /a/,/b/]"""
import argparse, base64, io, json, os, time
from playwright.sync_api import sync_playwright
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("out")
ap.add_argument("--base", default="http://127.0.0.1:4391")
ap.add_argument("--only", default="", help="只跑某个宽度/条件，如 1440:normal")
ap.add_argument("--pages", default="/projects/localocr/,/rules/engineering-delivery/,/skills/report-page/")
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)

INIT = r"""
(() => {
  window.__ev = [];
  const t0 = performance.timeOrigin;
  const inArt = (t) => t && t.closest && (t.closest('figure[data-living-config]') || t.closest('.chapter-art') || t.closest('.living-layer') || t.closest('.easter-bird') || t.closest('.ambient-motion') || /bird|leaf|leaves/.test(String(t.className || '')));
  const zeroStart = (t) => { try { return t.getAnimations().some(an => { const k = an.effect && an.effect.getKeyframes ? an.effect.getKeyframes() : []; return k.length && k[0].opacity !== undefined && Number(k[0].opacity) === 0; }); } catch (e) { return false; } };
  document.addEventListener('animationstart', (e) => { if (inArt(e.target) && zeroStart(e.target)) window.__ev.push({ t: performance.now(), kind: 'opacity0-animation', target: String(e.target.className || e.target.tagName), name: e.animationName }); }, true);
  document.addEventListener('transitionrun', (e) => { if (e.propertyName === 'opacity' && inArt(e.target)) window.__ev.push({ t: performance.now(), kind: 'opacity-transition', target: String(e.target.className || e.target.tagName) }); }, true);
  new MutationObserver((recs) => { for (const r of recs) { const t = r.target; if (t.classList && t.classList.contains('living-layer') && t.classList.contains('is-live') && !window.__live) { window.__live = performance.now(); window.__ev.push({ t: window.__live, kind: 'canvas-live' }); } } })
    .observe(document, { subtree: true, attributes: true, attributeFilter: ['class'] });
  const poll = () => {
    const img = [...document.querySelectorAll('figure[data-living-config] img')].find(i => i.getClientRects().length);
    if (img && !window.__imgshown && img.complete && img.naturalWidth) { const cs = getComputedStyle(img); if (cs.visibility !== 'hidden' && +cs.opacity > 0) { window.__imgshown = performance.now(); window.__ev.push({ t: window.__imgshown, kind: 'static-visible' }); } }
    if (img && window.__imgshown) { const cs = getComputedStyle(img); if (cs.visibility === 'hidden' || +cs.opacity < 1 || cs.display === 'none') window.__ev.push({ t: performance.now(), kind: 'static-hidden-again', opacity: cs.opacity, visibility: cs.visibility }); }
    requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);
})();
"""
BOX = "(()=>{const f=[...document.querySelectorAll('figure[data-living-config]')].find(x=>x.getClientRects().length);if(!f)return null;const r=f.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()"


def run(b, path, w, h, cond):
    ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=1, is_mobile=w < 768, has_touch=w < 768)
    ctx.add_init_script(INIT)
    pg = ctx.new_page()
    cdp = ctx.new_cdp_session(pg)
    cdp.send("Network.enable")
    if cond == "slow":
        cdp.send("Network.setCacheDisabled", {"cacheDisabled": True})
        cdp.send("Network.emulateNetworkConditions", {"offline": False, "latency": 150, "downloadThroughput": 200000, "uploadThroughput": 100000})
        cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
    else:  # 常速再次打开：先在另一个标签页完整打开一次填缓存、关掉，再在空白标签页里打开录（录到的帧里没有上一页的残影）
        warm = ctx.new_page(); warm.goto(a.base + path, wait_until="load"); warm.wait_for_timeout(1500); warm.close()
    frames = []

    def on_frame(ev):
        frames.append((ev["metadata"]["timestamp"], ev["data"]))
        try:
            cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})
        except Exception:
            pass
    cdp.on("Page.screencastFrame", on_frame)
    cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 85, "everyNthFrame": 1, "maxWidth": w, "maxHeight": h})
    t_nav = time.time()
    if cond == "slow":
        pg.goto(a.base + path, wait_until="commit", timeout=120000)
    else:
        pg.goto(a.base + path, wait_until="commit")
    box, deadline = None, None
    while True:
        pg.wait_for_timeout(50)
        try:
            bb = pg.evaluate(BOX)
            box = bb or box
            live = pg.evaluate("window.__live || null")
        except Exception:
            live = None
        if live and deadline is None:
            deadline = time.time() + 3.0
        if (deadline and time.time() > deadline) or time.time() - t_nav > (60 if cond == "slow" else 15):
            break
    ev = pg.evaluate("window.__ev")
    diag = pg.evaluate("window.pageLiving ? window.pageLiving.diagnostics() : null")
    nav_start = pg.evaluate("performance.timeOrigin") / 1000
    cdp.send("Page.stopScreencast")
    ctx.close()
    # 逐帧量插画区
    rows, ims = [], []
    for ts, data in frames:
        im = Image.open(io.BytesIO(base64.b64decode(data))).convert("RGB")
        nw = None
        if box:
            x0, y0 = max(0, int(box[0])), max(0, int(box[1]))
            x1, y1 = min(im.width, int(box[0] + box[2])), min(im.height, int(box[1] + box[3]))
            if x1 > x0 + 10 and y1 > y0 + 10:
                g = im.crop((x0, y0, x1, y1)).convert("L").resize((max(1, (x1 - x0) // 4), max(1, (y1 - y0) // 4)))
                px = g.getdata(); nw = sum(1 for v in px if v < 245) / len(px)
        rows.append({"ms": round((ts - nav_start) * 1000), "art_nonwhite": None if nw is None else round(nw, 4)})
        if os.environ.get("SWAP_DUMP"):  # 排查用：逐帧存图，文件名带毫秒
            os.makedirs(os.environ["SWAP_DUMP"], exist_ok=True)
            im.save(os.path.join(os.environ["SWAP_DUMP"], f"{w}-{cond}-{rows[-1]['ms']:06d}.jpg"), quality=80)
        ims.append((ts, im))
    peak, flicker = 0, []
    for r in rows:
        v = r["art_nonwhite"]
        if v is None:
            continue
        if peak > 0.05 and v < peak * 0.6:
            flicker.append(r)
        peak = max(peak, v)
    return {"rows": rows, "ims": ims, "events": ev, "intro": diag and diag.get("intro"), "box": box, "flicker": flicker, "nav_start": nav_start}


def gif(res, f, w):
    ev = {e["kind"]: e["t"] for e in res["events"] if e["kind"] in ("static-visible", "canvas-live")}
    ims = res["ims"]
    if not ims:
        return None
    base = res["nav_start"]
    anchor = ev.get("static-visible", ev.get("canvas-live"))
    # 从静态图出现前 0.4 秒录到动画接上后 ~3 秒
    if anchor is not None:
        lo = base + anchor / 1000 - 0.4
        hi = base + (ev.get("canvas-live", anchor)) / 1000 + 2.6
        sel = [(t, im) for t, im in ims if lo <= t <= hi] or ims[-40:]
    else:
        sel = ims[-60:]
    # 小动图：最多每秒 15 帧（相邻不到 66 毫秒的帧合并，时长照实际累计）；画面缩小只为文件小，原图不动
    kept = []
    for t, im in sel:
        if not kept or t - kept[-1][0] >= 0.066:
            kept.append((t, im))
    sel = kept
    scale = 0.5 if w > 800 else 0.6
    frames, durs = [], []
    for k, (t, im) in enumerate(sel):
        frames.append(im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS).convert("P", palette=Image.ADAPTIVE, colors=96))
        nxt = sel[k + 1][0] if k + 1 < len(sel) else t + 0.1
        durs.append(max(20, int((nxt - t) * 1000)))
    frames[0].save(f, save_all=True, append_images=frames[1:], duration=durs, loop=0, optimize=True)
    return f


summary = []
with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    for path in a.pages.split(","):
        name = path.strip("/").replace("/", "-")
        for w, h in ((1440, 900), (390, 1400)):
            for cond in ("slow", "normal-repeat"):
                if a.only and a.only != f"{w}:{cond.split('-')[0]}":
                    continue
                r = run(b, path, w, h, "slow" if cond == "slow" else "normal")
                g = None
                if cond == "slow":
                    g = gif(r, os.path.join(a.out, f"slow-{name}-{w}.gif"), w)
                evs = r["events"]
                row = {"page": path, "width": w, "condition": cond, "frames": len(r["rows"]), "intro": r["intro"],
                       "static_visible_ms": next((round(e["t"]) for e in evs if e["kind"] == "static-visible"), None),
                       "canvas_live_ms": next((round(e["t"]) for e in evs if e["kind"] == "canvas-live"), None),
                       "static_hidden_again": [e for e in evs if e["kind"] == "static-hidden-again"][:3],
                       "opacity_from_zero": [e for e in evs if e["kind"].startswith("opacity")],
                       "appear_vanish_reappear_frames": r["flicker"][:5], "gif": g,
                       "art_nonwhite_series": [x["art_nonwhite"] for x in r["rows"]]}
                summary.append(row)
                print(json.dumps({k: v for k, v in row.items() if k != "art_nonwhite_series"}, ensure_ascii=False))
    b.close()
json.dump(summary, open(os.path.join(a.out, "slow-swap.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

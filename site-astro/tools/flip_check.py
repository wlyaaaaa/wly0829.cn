"""翻页过渡核对：从 A 页点到 B 页，记录两页的 site-album-state 事件（原翻页脚本自己发的）和 view transition 是否真的开始。
用法：python tools/flip_check.py <起点路径> <目标路径> [reduce]"""
import json, sys
from playwright.sync_api import sync_playwright
src, dst = sys.argv[1], sys.argv[2]
reduce = len(sys.argv) > 3 and sys.argv[3] == "reduce"
INIT = """
window.__album=[];addEventListener('site-album-state',e=>window.__album.push(e.detail.type));
addEventListener('pagereveal',e=>window.__album.push('pagereveal:'+(e.viewTransition?'vt':'none')));
addEventListener('pageswap',e=>{try{sessionStorage.setItem('__swap',(e.viewTransition?'vt':'none'))}catch{}});
"""
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce" if reduce else "no-preference")
    ctx.add_init_script(INIT)
    pg = ctx.new_page()
    pg.goto("http://127.0.0.1:4391" + src, wait_until="networkidle"); pg.wait_for_timeout(1500)
    sel = f'main a[href="{dst}"], a[href="{dst}"]'
    a = pg.locator(sel).first
    a.scroll_into_view_if_needed(); pg.wait_for_timeout(600)
    before = pg.evaluate("window.__album.slice()")
    import base64, io, time
    from PIL import Image, ImageChops, ImageStat
    frames = []
    cdp = ctx.new_cdp_session(pg)
    def on_frame(ev):
        frames.append((ev["metadata"]["timestamp"], ev["data"])); cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})
    cdp.on("Page.screencastFrame", on_frame)
    cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 70, "everyNthFrame": 1, "maxWidth": 720, "maxHeight": 450})
    pg.wait_for_timeout(300)
    a.click()
    pg.wait_for_url("**" + dst, timeout=10000); pg.wait_for_timeout(1800)
    cdp.send("Page.stopScreencast")
    ims = [(t, Image.open(io.BytesIO(base64.b64decode(d))).convert("L").resize((180, 112))) for t, d in frames]
    first, last = ims[0][1], ims[-1][1]
    def diff(a, b): return sum(ImageStat.Stat(ImageChops.difference(a, b)).mean)
    mids = [round((t - ims[0][0]) * 1000) for t, im in ims if diff(im, first) > 4 and diff(im, last) > 4]
    span = (mids[-1] - mids[0]) if len(mids) > 1 else 0
    after = pg.evaluate("({events: window.__album, swap: sessionStorage.getItem('__swap'), running: document.documentElement.hasAttribute('data-album-running')})")
    print(json.dumps({"from": src, "to": dst, "reduce": reduce, "source_events": before, "frames": len(ims), "transition_frames": len(mids), "transition_span_ms": span, "target": after}, ensure_ascii=False))
    b.close()

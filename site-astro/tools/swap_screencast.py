"""用浏览器逐帧录屏（每次重绘一帧）看插画从静态图换成动画的那几帧：插画区域的非白像素占比不能掉（掉=先消失再出现）。
用法：python tools/swap_screencast.py <网址路径> <宽> <输出目录> [录制毫秒]"""
import base64, io, json, os, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image
path, w, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
dur = int(sys.argv[4]) if len(sys.argv) > 4 else 2500
os.makedirs(out, exist_ok=True)
frames = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": w, "height": 900})
    cdp = pg.context.new_cdp_session(pg)
    def on_frame(ev):
        frames.append((ev["metadata"]["timestamp"], ev["data"]))
        cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})
    cdp.on("Page.screencastFrame", on_frame)
    cdp.send("Page.startScreencast", {"format": "png", "everyNthFrame": 1, "maxWidth": w, "maxHeight": 900})
    t0 = time.time()
    pg.goto("http://127.0.0.1:4391" + path, wait_until="commit")
    box = None
    while time.time() - t0 < dur / 1000:
        pg.wait_for_timeout(30)
        if box is None:
            box = pg.evaluate("(()=>{const i=document.querySelector('figure[data-living-config] img');if(!i)return null;const r=i.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
    live_at = pg.evaluate("(()=>{const l=document.querySelector('.living-layer');return l?l.className:null})()")
    cdp.send("Page.stopScreencast")
    b.close()
rows = []
start = frames[0][0] if frames else 0
for k, (ts, data) in enumerate(frames):
    im = Image.open(io.BytesIO(base64.b64decode(data))).convert("L")
    if box:
        crop = im.crop((int(box[0]), int(box[1]), int(box[0] + box[2]), int(box[1] + box[3])))
        px = list(crop.getdata()); nw = sum(1 for v in px if v < 245) / max(1, len(px))
    else:
        nw = None
    f = os.path.join(out, f"s{k:03d}.png"); im.save(f)
    rows.append({"frame": k, "ms": round((ts - start) * 1000), "art_nonwhite": None if nw is None else round(nw, 4)})
json.dump({"box": box, "layer": live_at, "frames": rows}, open(os.path.join(out, "screencast.json"), "w"), indent=0)
vals = [r["art_nonwhite"] for r in rows if r["art_nonwhite"]]
print("frames", len(rows), "box", box, "layer", live_at)
for r in rows: print(r)

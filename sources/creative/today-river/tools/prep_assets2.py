"""第二版“今天的河”的素材：裁好的河、水面范围图、四条船（船头朝左）、水岸线。只读原图，产物放 assets2/。"""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets2"
OUT.mkdir(exist_ok=True)
Y0, Y1 = 58, 950                      # 原画里取这一段高度（上下两岸都留着，纸边的空白裁掉一些）

river = Image.open(ROOT / "assets/river-watercolor.png").convert("RGB").crop((0, Y0, 1536, Y1))
river.save(OUT / "river.webp", quality=90, method=6)
W, H = river.size

# ---- 水面范围：翡翠绿的地方绿比红高很多，树和草不是 ----
a = np.asarray(river).astype(np.float32)
gr = a[..., 1] - a[..., 0]
m = np.clip((gr - 30) / 40, 0, 1)
m = ndimage.grey_closing(m, size=(13, 13))        # 把水里的白色波纹线补上
m = ndimage.grey_opening(m, size=(9, 9))          # 去掉岸上零星的绿点
lab, n = ndimage.label(m > 0.5)
if n:
    sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
    keep = lab == (1 + int(np.argmax(sizes)))
    keep = ndimage.binary_fill_holes(ndimage.binary_dilation(keep, iterations=6))
    m = m * keep
m = ndimage.gaussian_filter(m, 5)
mask = Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8), "L")
mask.resize((768, round(768 * H / W)), Image.LANCZOS).save(OUT / "mask.png", optimize=True)

# ---- 水岸线：每一列最上、最下的水在哪（按舞台高度的百分比），停船和挂灯用 ----
cols = 97
top, bot = [], []
solid = m > 0.62
for i in range(cols):
    x = min(W - 1, round(i * (W - 1) / (cols - 1)))
    band = solid[:, max(0, x - 6):x + 7].mean(1) > 0.6
    ys = np.where(band)[0]
    if len(ys) == 0:
        top.append(None); bot.append(None); continue
    # 取最长的一段连续水面
    runs, s = [], ys[0]
    for k in range(1, len(ys)):
        if ys[k] != ys[k - 1] + 1:
            runs.append((s, ys[k - 1])); s = ys[k]
    runs.append((s, ys[-1]))
    r = max(runs, key=lambda r: r[1] - r[0])
    top.append(round(100 * r[0] / H, 2)); bot.append(round(100 * r[1] / H, 2))

# ---- 四条船：去掉毛边，船头转向左边 ----
sheet = Image.open(ROOT / "assets/boats-watercolor.png").convert("RGBA")
boxes = [(75, 189, 737, 394), (849, 177, 1472, 398), (75, 648, 737, 844), (841, 647, 1472, 838)]
boats = []
for i, (x0, y0, x1, y1) in enumerate(boxes):
    im = sheet.crop((x0 - 8, y0 - 8, x1 + 9, y1 + 9)).transpose(Image.FLIP_LEFT_RIGHT)
    b = np.asarray(im).astype(np.float32)
    al = np.clip((b[..., 3] - 60) / 170, 0, 1)
    b[..., 3] = al * 255
    im = Image.fromarray(b.astype(np.uint8), "RGBA")
    w = 360; h = round(im.height * w / im.width)
    im = im.resize((w, h), Image.LANCZOS)
    im.save(OUT / f"boat{i}.webp", quality=92, method=6)
    boats.append({"w": w, "h": h})

# ---- 小鸟：和首页同一只，缩小存好，记下脚的位置 ----
SPR = ROOT.parent / "sample" / "sprites"
meta = json.loads((SPR / "bird.json").read_text(encoding="utf-8"))["sprites"]
K = 0.2
bird = {}
for pose in ("idle", "look", "tilt", "sing", "sleep"):
    m_ = meta[pose]; im = Image.open(SPR / m_["file"]).convert("RGBA")
    im = im.resize((round(im.width * K), round(im.height * K)), Image.LANCZOS)
    im.save(OUT / f"bird-{pose}.webp", quality=92, method=6)
    bird[pose] = {"w": im.width, "h": im.height, "fx": round(m_["feet"][0] * K, 1), "fy": round(m_["feet"][1] * K, 1)}
(OUT / "bird.json").write_text(json.dumps(bird), encoding="utf-8")

geom = {"aspect": round(W / H, 4), "top": top, "bot": bot, "boats": boats}
(OUT / "geom.json").write_text(json.dumps(geom), encoding="utf-8")

# 预览：范围图叠在河上、船放在绿底上，给人看一眼对不对
prev = river.copy().convert("RGBA")
red = Image.new("RGBA", prev.size, (255, 40, 40, 0)); red.putalpha(mask.point(lambda v: int(v * 0.45)))
prev = Image.alpha_composite(prev, red)
prev.convert("RGB").resize((1152, round(1152 * H / W))).save(OUT / "preview-mask.jpg", quality=85)
strip = Image.new("RGBA", (4 * 380, 200), (40, 150, 110, 255))
for i in range(4):
    im = Image.open(OUT / f"boat{i}.webp").convert("RGBA")
    strip.alpha_composite(im, (i * 380 + 10, (200 - im.height) // 2))
strip.convert("RGB").save(OUT / "preview-boats.jpg", quality=88)
print(json.dumps({"size": [W, H], "top": top[::8], "bot": bot[::8], "boats": boats,
                  "bytes": {p.name: p.stat().st_size for p in sorted(OUT.iterdir())}}, ensure_ascii=False))

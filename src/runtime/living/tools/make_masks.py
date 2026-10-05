"""做范围图：读 art/<画名>/spec.json 里的 "masks"，输出 m0.webp（和需要时的 m1.webp）、一张叠了颜色的预览图。

范围图就是一张很小的灰度图（每个通道一张），白 = 这里动 / 这里亮，黑 = 不动。一张图有红绿蓝三个通道，
最多两张图，所以一幅画最多 6 个范围。通道名写成 "m0.r"、"m0.g"、"m0.b"、"m1.r"……

spec.json 里的写法（坐标都是无字原图内的占比 0..1；长度按原图宽的占比）：
"masks": {
  "size": 360,                      # 范围图长边多少像素（默认 360，够用；越小越省）
  "m0.r": {
    "name": "叶子",
    "layers": [                     # 几块叠在一起（取最大值）
      {"poly": [[u,v], ...], "rule": "green"},      # 多边形里、符合颜色规则的像素
      {"ellipse": {"center": [u,v], "radius": [ru, rv]}, "rule": "any"},
      {"rect": [u0,v0,u1,v1], "rule": "bright"}
    ],
    "roots": {"points": [[u,v], ...], "r0": 0.03, "r1": 0.25},   # 可选：离根部越远越白（叶尖白、根和枝干黑）
    "protect": [[[u,v], ...]],      # 可选：这些多边形里一律清零（硬物件、字）；也可写 {"poly": [...], "keep": 颜色规则, "feather": 0.01}
    "grow": 0.004,                  # 可选：先往外扩多少（原图宽的占比）
    "feather": 0.006,               # 软边宽度（原图宽的占比）
    "hug": 0.004,                   # 可选：最后只留“颜色规则命中处”附近这么宽，防止软边糊到旁边的硬物件上
    "gain": 1.0                     # 可选：整体乘一个数
  }
}
颜色规则 rule：notpaper（不是画外白纸的地方，跟天色用）、any（全要）、green（偏绿：叶子、绿灯）、leaf（偏绿且不是深色边框）、bright（亮：纸、屏幕）、dark（暗）、
              notwhite（不是白纸）、expr:<式子>（r、g、b 为 0..1 的数组，例如 "expr:(g-r)>0.08"）。
写字的顺序（重新写一遍）用 "order": {"path": [[u,v], ...]}：值 = 沿这条线走到哪儿（0.02..1），配合引擎的 reveal/write。

用法：python tools/make_masks.py <画名>
输出：art/<画名>/m0.webp、m1.webp（无损 WebP，RGB 不带透明）、work/masks-preview.jpg、masks.json（通道清单和覆盖面积）
"""
import json
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

import common

COLORS = {"m0.r": (230, 40, 60), "m0.g": (30, 160, 255), "m0.b": (255, 170, 0), "m1.r": (170, 60, 230), "m1.g": (0, 200, 170), "m1.b": (240, 90, 200)}


def rule_mask(rgb, rule):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    mx, mn = rgb.max(-1), rgb.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1e-3)
    if rule in (None, "any"):
        return np.ones_like(r)
    if rule == "green":
        x = g - np.maximum(r, b)
        return np.clip((x - 0.015) / 0.07, 0, 1) * np.clip((0.97 - lum) / 0.05, 0, 1)
    if rule == "bright":
        return np.clip((lum - 0.78) / 0.10, 0, 1) * np.clip((0.35 - sat) / 0.15, 0, 1)
    if rule == "leaf":          # 叶子：偏绿，又不是很暗的边框（亮度 0.28 以下的深绿边框不算）
        x = g - np.maximum(r, b)
        return np.clip((x - 0.015) / 0.07, 0, 1) * np.clip((0.97 - lum) / 0.05, 0, 1) * np.clip((lum - 0.22) / 0.08, 0, 1)
    if rule == "dark":
        return np.clip((0.45 - lum) / 0.15, 0, 1)
    if rule == "notwhite":
        return np.clip((0.95 - mn) / 0.08, 0, 1)
    if rule.startswith("expr:"):
        return np.clip(eval(rule[5:], {"np": np}, {"r": r, "g": g, "b": b, "lum": lum, "sat": sat}).astype("float32"), 0, 1)
    raise ValueError("不认识的颜色规则：" + rule)


def shape_mask(layer, W, H):
    im = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(im)
    if "poly" in layer:
        d.polygon([(u * W, v * H) for u, v in layer["poly"]], fill=255)
    elif "ellipse" in layer:
        (cu, cv), (ru, rv) = layer["ellipse"]["center"], layer["ellipse"]["radius"]
        d.ellipse([(cu - ru) * W, (cv - rv) * H, (cu + ru) * W, (cv + rv) * H], fill=255)
    elif "rect" in layer:
        u0, v0, u1, v1 = layer["rect"]
        d.rectangle([u0 * W, v0 * H, u1 * W, v1 * H], fill=255)
    else:
        d.rectangle([0, 0, W, H], fill=255)
    return np.asarray(im, dtype="float32") / 255.0


def order_values(path, W, H):
    """每个像素投到折线上，值 = 沿线走了多少（0..1）。"""
    P = np.array([[u * W, v * H] for u, v in path], dtype="float32")
    seg = np.hypot(*(P[1:] - P[:-1]).T)
    cum = np.concatenate([[0], np.cumsum(seg)])
    yy, xx = np.mgrid[0:H, 0:W].astype("float32")
    best = np.full((H, W), 1e9, "float32")
    val = np.zeros((H, W), "float32")
    for i in range(len(P) - 1):
        a, b = P[i], P[i + 1]
        ba = b - a
        L2 = float((ba ** 2).sum()) or 1.0
        h = np.clip(((xx - a[0]) * ba[0] + (yy - a[1]) * ba[1]) / L2, 0, 1)
        dist = np.hypot(xx - a[0] - ba[0] * h, yy - a[1] - ba[1] * h)
        s = (cum[i] + h * seg[i]) / cum[-1]
        m = dist < best
        best[m] = dist[m]
        val[m] = s[m]
    return val


def build_channel(spec, rgb, W, H, alpha=None):
    px = W  # 长度单位：原图宽的占比 × 范围图宽
    acc = np.zeros((H, W), "float32")
    hit = np.zeros((H, W), "float32")
    for layer in spec.get("layers", []):
        if layer.get("rule") == "notpaper":
            # 画外面的白纸：从四边连通的近白像素（画里面的白东西不算）。跟天色时只调这张图里“不是白纸”的地方
            lum = rgb @ np.array([0.299, 0.587, 0.114], "float32")
            white = (lum > 0.93) & ((rgb.max(-1) - rgb.min(-1)) < 0.08)
            if alpha is not None:
                white |= alpha < 0.3
            lab, _ = ndimage.label(white)
            edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
            paper = np.isin(lab, list(edge))
            v = 1 - ndimage.gaussian_filter(paper.astype("float32"), 1.5)
            acc = np.maximum(acc, v)
            hit = np.maximum(hit, v)
            continue
        rm = rule_mask(rgb, layer.get("rule", "any"))
        sm = shape_mask(layer, W, H)
        if layer.get("opaque") and alpha is not None:
            sm = sm * np.clip((alpha - 0.2) / 0.5, 0, 1)
        v = sm * rm * float(layer.get("value", 1.0))
        acc = np.maximum(acc, v)
        hit = np.maximum(hit, sm * rm)
    if "grow" in spec:
        acc = ndimage.grey_dilation(acc, size=max(1, int(round(spec["grow"] * px * 2))) | 1)
    if spec.get("roots"):
        R = spec["roots"]
        pts = np.array([[u * W, v * H] for u, v in R["points"]], "float32")
        yy, xx = np.mgrid[0:H, 0:W].astype("float32")
        dmin = np.min(np.stack([np.hypot(xx - p[0], yy - p[1]) for p in pts]), axis=0) / W
        r0, r1 = R.get("r0", 0.03), R.get("r1", 0.25)
        acc = acc * np.clip((dmin - r0) / max(1e-6, r1 - r0), 0, 1) ** R.get("power", 0.8)
    if spec.get("order"):
        acc = np.where(acc > 0.5, 0.02 + 0.98 * order_values(spec["order"]["path"], W, H), 0).astype("float32")
    elif spec.get("feather", 0) > 0:
        acc = ndimage.gaussian_filter(acc, sigma=spec["feather"] * px / 2.0)
    if spec.get("hug"):
        near = ndimage.grey_dilation(hit, size=max(1, int(round(spec["hug"] * px * 2))) | 1)
        acc = acc * np.clip(ndimage.gaussian_filter(near, 0.7) * 1.5, 0, 1)
    for pr in spec.get("protect", []):
        # 写法一：多边形（一串点）；写法二：{"poly": [...], "keep": 颜色规则, "feather": 软边}，keep 命中的像素不清零（例如挡在物件前面的叶子）
        pr = pr if isinstance(pr, dict) else {"poly": pr}
        pm = shape_mask({"poly": pr["poly"]}, W, H)
        if pr.get("keep"):
            pm = pm * (1 - rule_mask(rgb, pr["keep"]))
        if pr.get("feather"):
            pm = np.clip(ndimage.gaussian_filter(pm, sigma=pr["feather"] * px / 2.0) * 1.3, 0, 1)
        acc = acc * (1 - pm)
    acc = np.clip(acc * float(spec.get("gain", 1.0)), 0, 1)
    if spec.get("normalize"):
        acc = acc / max(1e-6, float(acc.max()))
    return acc


def main(art, orient=None):
    spec = common.load_spec(art, orient)
    ms = spec["masks"]
    src = common.illustration(art, orient=orient)
    sw, sh = src.size
    n = int(ms.get("size", 360))
    W, H = (n, max(1, round(n * sh / sw))) if sw >= sh else (max(1, round(n * sw / sh)), n)
    rgb = np.asarray(src.resize((W, H), Image.LANCZOS), dtype="float32") / 255.0
    alpha = common.source_alpha(art, orient)
    if alpha is not None:
        alpha = np.asarray(Image.fromarray((alpha * 255).astype("uint8")).resize((W, H), Image.LANCZOS), dtype="float32") / 255.0
    planes = {f"m{i}": np.zeros((H, W, 3), "float32") for i in (0, 1)}
    info = {"size": [W, H], "channels": {}}
    for key, ch in ms.items():
        if not key.startswith("m") or "." not in key:
            continue
        img, c = key.split(".")
        m = build_channel(ch, rgb, W, H, alpha)
        planes[img][..., "rgb".index(c)] = m
        info["channels"][key] = {"name": ch.get("name", ""), "coverage": round(float((m > 0.05).mean()), 4), "max": round(float(m.max()), 3)}
    out = common.mask_dir(art, orient)
    out.mkdir(parents=True, exist_ok=True)
    used = sorted({k.split(".")[0] for k in info["channels"]})
    for img in used:
        arr = (planes[img] * 255 + 0.5).clip(0, 255).astype("uint8")
        Image.fromarray(arr, "RGB").save(out / f"{img}.webp", lossless=True, quality=100, method=6)
        info[img] = (out / f"{img}.webp").stat().st_size
    # 预览：原图上叠颜色，每个通道一种颜色，再标名字
    big = src.resize((min(1100, sw), round(min(1100, sw) * sh / sw)), Image.LANCZOS).convert("RGB")
    base = np.asarray(big, dtype="float32")
    BW, BH = big.size
    for key in info["channels"]:
        img, c = key.split(".")
        m = np.asarray(Image.fromarray((planes[img][..., "rgb".index(c)] * 255).astype("uint8")).resize((BW, BH), Image.BILINEAR), dtype="float32")[..., None] / 255.0
        col = np.array(COLORS.get(key, (255, 0, 255)), "float32")
        base = base * (1 - 0.55 * m) + col * 0.55 * m
    prev = Image.fromarray(base.clip(0, 255).astype("uint8"))
    d = ImageDraw.Draw(prev)
    font = ImageFont.truetype(common.FONT, 18)
    y = 8
    for key, ch in info["channels"].items():
        d.rectangle([8, y, 30, y + 20], fill=COLORS.get(key, (255, 0, 255)))
        d.text((38, y - 1), f"{key} {ch['name']}  覆盖 {ch['coverage'] * 100:.1f}%", fill=(20, 20, 20), font=font)
        y += 26
    (out / "work").mkdir(exist_ok=True)
    prev.save(out / "work" / "masks-preview.jpg", quality=90)
    (out / "masks.json").write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(info, ensure_ascii=False))


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("art")
    ap.add_argument("--orient", choices=["h", "v"])
    args = ap.parse_args()
    main(args.art, args.orient)

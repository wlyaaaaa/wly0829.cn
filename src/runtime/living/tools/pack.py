"""换算并打包：把一幅画的 spec.json（无字原图内的占比）换成约定格式，给用这幅画的每一页各出一个文件夹。

每页文件夹 = dist/<页名>/config.json + 范围图（文件名带内容指纹）。config.json 里横版 h、竖版 v 各一份，
坐标一律是“整屏图的比例”（以约定清单 first-screens.json 里那张整屏图为准），全部相对路径。
长度、幅度、时长不随横竖改变，原样保留（长度按插画框宽的占比，时长按全站速度 2.5 时的真实秒）。

用法：
  python tools/pack.py <画名>            # 打这幅画的所有页
  python tools/pack.py --all              # 打 art/ 下所有写好了 spec.json 的画
输出：dist/<页名>/…，并打印每页的大小。量不到插画框的方向会跳过并写进 config.json 的 "missing"。
"""
import hashlib
import json
import math
import shutil
import sys

import numpy as np
from PIL import Image

import common

POINT_KEYS = {"center", "pivot", "from", "to", "home"}
POINTS_KEYS = {"path", "quad", "points"}
DROP_KEYS = {"note", "rigid", "masks", "art", "paper", "check"}


def to_screen(obj, box):
    """把插画框内占比的坐标换成整屏比例。box = [X, Y, W, H]（整屏比例）。"""
    X, Y, W, H = box
    P = lambda q: [round(X + q[0] * W, 6), round(Y + q[1] * H, 6)]
    if isinstance(obj, list):
        return [to_screen(v, box) for v in obj]
    if not isinstance(obj, dict):
        return obj
    out = {}
    for k, v in obj.items():
        if k in POINT_KEYS and isinstance(v, list) and len(v) == 2 and all(isinstance(x, (int, float)) for x in v):
            out[k] = P(v)
        elif k in POINTS_KEYS and isinstance(v, list):
            out[k] = [P(q) for q in v]
        elif k == "areas":
            out[k] = [P(a[:2]) + P(a[2:]) for a in v]
        elif k == "perches":
            out[k] = [{**p, "x": round(X + p["x"] * W, 6), "y": round(Y + p["y"] * H, 6)} for p in v]
        elif isinstance(v, (dict, list)):
            out[k] = to_screen(v, box)
        else:
            out[k] = v
    return out


def paper_color(page):
    """插画框四边内侧一圈的中位色，就是这幅画的“纸色”（开场没晕到的地方、盖住东西时用）。"""
    im = np.asarray(common.open_rgb(common.screen_image_path(page, "h")), dtype="float32")
    x, y, w, h = [int(round(v)) for v in common.box_px(page, "h")]
    band = 5
    ring = np.concatenate([im[y + 2:y + 2 + band, x:x + w].reshape(-1, 3), im[y + h - 2 - band:y + h - 2, x:x + w].reshape(-1, 3),
                           im[y:y + h, x + 2:x + 2 + band].reshape(-1, 3), im[y:y + h, x + w - 2 - band:x + w - 2].reshape(-1, 3)])
    return [int(round(float(v))) for v in np.median(ring, axis=0)]


def probes(page, orient, n=12):
    """在插画框里挑 n 个颜色变化明显的点，记下整屏图缩到 200 宽时的颜色。引擎用它确认页面上的图就是做配置的这张。"""
    path = common.site_image(page, orient)
    im = Image.open(path).convert("RGB")
    W, H = im.size
    pw = 200
    ph = max(1, math.floor(H * pw / W + 0.5))
    small = np.asarray(im.resize((pw, ph), Image.BILINEAR), dtype="float32")
    bx, by, bw, bh = common.box_ratio(page, orient)
    lum = small @ np.array([0.299, 0.587, 0.114], "float32")
    gy, gx = np.gradient(lum)
    score = np.hypot(gx, gy)
    pts = []
    x0, x1 = int(np.ceil((bx + 0.06 * bw) * pw)), int(np.floor((bx + 0.94 * bw) * pw))
    y0, y1 = int(np.ceil((by + 0.06 * bh) * ph)), int(np.floor((by + 0.94 * bh) * ph))
    cand = []
    for yy in range(y0, y1):
        for xx in range(x0, x1):
            cand.append((float(lum[yy, xx] < 235) * (60 - abs(score[yy, xx] - 6)) + (255 - lum[yy, xx]) * 0.05, xx, yy))
    cand.sort(reverse=True)
    mind = max(3, (x1 - x0) // 6)
    for s, xx, yy in cand:
        if all(abs(xx - a) + abs(yy - b) > mind for a, b in pts):
            pts.append((xx, yy))
        if len(pts) >= n:
            break
    return [[round((xx + 0.5) / pw, 5), round((yy + 0.5) / ph, 5)] + [int(v) for v in small[yy, xx]] for xx, yy in pts]


def cover_colors(art, spec, orient=None):
    """“盖住再放出来”的动作（carry、reveal）要用周围的底色盖：取范围外面一圈像素的中位色。底色很不均匀时在 notes 里提醒。"""
    from scipy import ndimage
    notes = []
    for e in spec.get("effects", []):
        if e["type"] not in ("carry", "reveal") or isinstance(e.get("coverColor"), list):
            continue
        ch = ((e.get("cover") or e.get("region")) or {}).get("mask")
        if not ch:
            continue
        m, c = ch.split(".")
        mk = np.asarray(Image.open(common.mask_dir(art, orient) / f"{m}.webp").convert("RGB"), np.float32)[..., "rgb".index(c)] / 255
        H, W = mk.shape
        src = np.asarray(common.illustration(art, (W, H), orient), np.float32)

        def ring_color(inside, label):
            ring = ndimage.binary_dilation(inside, iterations=5) & ~ndimage.binary_dilation(inside, iterations=2) & (mk < 0.05)
            px = src[ring]
            if not len(px):
                return None
            med = np.median(px, axis=0)
            spread = float(np.percentile(np.abs(px - med).max(-1), 75))
            if spread > 22:
                notes.append(f"{label}：周围底色不均匀（周围一圈 75% 分位差 {spread:.0f}），盖住时可能看得出一块，换别的动法")
            return [int(round(float(v))) for v in med]
        if e["type"] == "reveal" and e.get("mode") != "write" and e.get("items"):
            yy, xx = np.mgrid[0:H, 0:W]
            A = W / H
            for k, it in enumerate(e["items"]):
                cu, cv = it["center"]
                r = it.get("radius", 0.06) * A
                near = np.hypot((xx / W - cu) * A, yy / H - cv) < r
                col = ring_color((mk > 0.05) & near, f"{e.get('name', 'reveal')} 第 {k + 1} 个")
                if col and not isinstance(it.get("coverColor"), list):
                    it["coverColor"] = col
        else:
            col = ring_color(mk > 0.05, e.get("name", e["type"]))
            if col:
                e["coverColor"] = col
    return notes


def fingerprint(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:10]


def build(art, out_root=None, quiet=False):
    spec = common.load_spec(art)
    if spec.get("status") == "draft" and out_root is None:
        print(f"{art}：spec.json 标着 draft（测试稿），不打进 dist")
        return []
    info = common.art_table()[art]
    out_root = out_root or common.DIST
    variants = {}
    for o in ("h", "v"):
        if not any(common.measured(page, o) for page in info["pages"]):
            continue
        vs = common.load_spec(art, o)
        for effect in vs.get('effects', []):
            if effect.get('type') == 'part' and 'sleepValue' in effect:
                value = effect['sleepValue']
                if type(value) not in (int, float) or not math.isfinite(value):
                    raise ValueError(f'{art}/{o}：part.sleepValue 必须是有限数字')
        md = common.mask_dir(art, o)
        mi = json.loads((md / "masks.json").read_text(encoding="utf-8")) if (md / "masks.json").exists() else {"channels": {}}
        mb = {m: (md / f"{m}.webp").read_bytes() for m in sorted({k.split(".")[0] for k in mi.get("channels", {})})}
        mn = {m: f"{m}.{fingerprint(b)}.webp" for m, b in mb.items()}
        variants[o] = (vs, mb, mn, cover_colors(art, vs, o))
    results = []
    for page in info["pages"]:
        cfg = {"schema": "living-art/1", "page": page, "art": art, "speed_reference": 2.5,
               "paper": spec["paper"] if isinstance(spec.get("paper"), list) else paper_color(page), "missing": []}
        if spec.get("disabled"):
            cfg = {"schema": "living-art/1", "page": page, "art": art, "disabled": True, "reason": spec.get("disabled")}
        else:
            files = {}
            notes = []
            for o in ("h", "v"):
                if not common.measured(page, o):
                    cfg["missing"].append({"orientation": o, "reason": (common.screen(page, o).get("gaps") or ["约定清单里没有这一方向"]) if o else ""})
                    continue
                e = common.screen(page, o)
                vs, mask_bytes, mask_names, cover_notes = variants[o]
                files.update({mask_names[m]: b for m, b in mask_bytes.items()})
                notes.extend(cover_notes)
                box = [round(float(v), 6) for v in e["illustration"]["rect_ratio"]]
                V = {"image": {"file": e["image"]["file"], "size": e["image"]["size_px"]}, "box": box,
                     "masks": [{"src": mask_names[m], "rect": box} for m in mask_names]}
                for k in ("intro", "effects", "bird"):
                    if k in vs:
                        V[k] = to_screen(vs[k], box)
                for effect in V.get("effects", []):
                    if effect.get("sprite"):
                        src = common.ART / art / effect["sprite"]["src"]
                        data = src.read_bytes()
                        name = f"{src.stem}.{fingerprint(data)}{src.suffix}"
                        effect["sprite"]["src"] = name
                        files[name] = data
                V["probe"] = probes(page, o)
                cfg[o] = V
            if not cfg["missing"]:
                del cfg["missing"]
            if notes:
                cfg["notes"] = list(dict.fromkeys(notes))
        d = out_root / page
        if d.exists():
            common.recycle(d)
        d.mkdir(parents=True)
        if not cfg.get("disabled"):
            for name, b in files.items():
                (d / name).write_bytes(b)
        (d / "config.json").write_text(json.dumps(cfg, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
        size = sum(f.stat().st_size for f in d.iterdir())
        if size > 300000:
            raise ValueError(f'{page}：{size:,}字节，超过每页300KB')
        results.append({"page": page, "bytes": size, "files": sorted(f.name for f in d.iterdir())})
        if not quiet:
            print(f"{page}: {size:,} 字节 {sorted(f.name for f in d.iterdir())}")
    return results


def main():
    args = sys.argv[1:]
    arts = [p.name for p in sorted(common.ART.iterdir()) if (p / "spec.json").exists()] if "--all" in args else args
    for a in arts:
        build(a)


if __name__ == "__main__":
    main()

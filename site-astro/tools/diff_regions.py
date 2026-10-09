"""逐段找“看得出的差别”：并排图拆成现在 / 新版两半（同宽），灰度相减、模糊掉一两个像素的抗锯齿差，
超过门限的连成块，列出面积够大的块（位置按现在那半的像素）。没有块 = 肉眼看不出差别；有块的段再人工看那几处。
用法：python tools/diff_regions.py <并排图目录（含 sections.json）> [--min-area 400] [--marked <输出目录>]"""
import argparse, json, os
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("dir"); ap.add_argument("--min-area", type=int, default=400); ap.add_argument("--marked")
a = ap.parse_args()
rows = json.load(open(os.path.join(a.dir, "sections.json"), encoding="utf-8"))
out = []
for x in rows:
    if not x.get("file") or not os.path.exists(x["file"]):
        continue
    c = Image.open(x["file"]).convert("RGB")
    tw = (c.width - 20) // 2
    old = c.crop((0, 40, tw, 40 + x["old_h"])).convert("L"); new = c.crop((tw + 20, 40, 2 * tw + 20, 40 + x["new_h"])).convert("L")
    h = max(old.height, new.height)
    A = np.full((h, tw), 255.0); B = np.full((h, tw), 255.0)
    A[:old.height] = np.asarray(old, dtype=float); B[:new.height] = np.asarray(new, dtype=float)
    d = np.abs(ndimage.gaussian_filter(A, 2) - ndimage.gaussian_filter(B, 2)) > 40
    d = ndimage.binary_closing(d, iterations=3)
    lab, n = ndimage.label(d)
    regs = []
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        area = int((lab[sl] == i).sum())
        if area >= a.min_area:
            regs.append({"x": sl[1].start, "y": sl[0].start, "w": sl[1].stop - sl[1].start, "h": sl[0].stop - sl[0].start, "area": area})
    regs.sort(key=lambda r: -r["area"])
    out.append({"page": x["page"], "width": x["width"], "section": x["section"], "regions": regs[:12], "n": len(regs),
                "score": (x.get("likeness") or {}).get("score")})
    if a.marked and regs:
        os.makedirs(a.marked, exist_ok=True)
        m = c.copy(); dr = ImageDraw.Draw(m)
        for r in regs:
            for off in (0, tw + 20):
                dr.rectangle((r["x"] + off - 3, r["y"] + 40 - 3, r["x"] + off + r["w"] + 3, r["y"] + 40 + r["h"] + 3), outline=(230, 0, 0), width=3)
        m.save(os.path.join(a.marked, os.path.basename(x["file"]).replace(".png", "-diff.png")))
json.dump(out, open(os.path.join(a.dir, "diff-regions.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for r in out:
    print(r["width"], r["section"], "差别块", r["n"], r["regions"][:3])

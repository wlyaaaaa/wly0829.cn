"""量位置的辅助：把插画框裁出来，打上网格和坐标，方便看图写“插画框内占比”的坐标。

用法：python tools/grid.py <画名> [--orient h|v|src] [--step 0.05] [--zoom u0,v0,u1,v1] [--out 文件]
- 默认用无字原图（src，最清楚）；没有原图时用横版整屏图裁出的框。
- 坐标就是配置里要写的数：左上角 (0,0)，右下角 (1,1)。粗线每 0.1，细线每 --step。
- --zoom 只看一块（仍按整框的占比标数），用来量小东西。
"""
import argparse
import pathlib

from PIL import Image, ImageDraw, ImageFont

import common


def make(art, orient="src", step=0.05, zoom=None, width=1400, page=None, source_orient=None):
    page = page or common.art_table()[art]["pages"][0]
    if orient == "src":
        im = common.illustration(art, orient=source_orient)
    else:
        im = common.crop_box(page, orient)
    W, H = im.size
    u0, v0, u1, v1 = zoom or (0, 0, 1, 1)
    part = im.crop((round(u0 * W), round(v0 * H), round(u1 * W), round(v1 * H)))
    k = width / part.width
    part = part.resize((width, round(part.height * k)), Image.LANCZOS)
    pad = 46
    board = Image.new("RGB", (part.width + pad * 2, part.height + pad * 2), "white")
    board.paste(part, (pad, pad))
    d = ImageDraw.Draw(board, "RGBA")
    font = ImageFont.truetype(common.FONT, 15)
    small = ImageFont.truetype(common.FONT, 11)

    def X(u):
        return pad + (u - u0) / (u1 - u0) * part.width

    def Y(v):
        return pad + (v - v0) / (v1 - v0) * part.height

    n = round(1 / step)
    for i in range(n + 1):
        t = round(i * step, 6)
        major = abs(t * 10 - round(t * 10)) < 1e-6
        col = (220, 30, 60, 150) if major else (40, 90, 220, 70)
        if u0 - 1e-9 <= t <= u1 + 1e-9:
            d.line([(X(t), pad), (X(t), pad + part.height)], fill=col, width=2 if major else 1)
            d.text((X(t) - 12, 4 if i % 2 == 0 else 22), f"{t:.2f}", fill=(20, 20, 20), font=font if major else small)
        if v0 - 1e-9 <= t <= v1 + 1e-9:
            d.line([(pad, Y(t)), (pad + part.width, Y(t))], fill=col, width=2 if major else 1)
            d.text((2, Y(t) - 8), f"{t:.2f}", fill=(20, 20, 20), font=font if major else small)
    d.text((pad, board.height - 20), f"{art}  {'无字原图' if orient == 'src' else page + ' ' + orient + ' 版整屏图裁框'}  坐标=插画框内占比", fill=(10, 110, 60), font=small)
    return board


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("art", help="画名（用这幅画的第一个页名），也可以直接写页名")
    ap.add_argument("--orient", default="src", choices=["src", "h", "v"])
    ap.add_argument("--source-orient", choices=["h", "v"], help="--orient src 时选择横版或竖版无字原图")
    ap.add_argument("--step", type=float, default=0.05)
    ap.add_argument("--zoom")
    ap.add_argument("--width", type=int, default=1400)
    ap.add_argument("--out")
    a = ap.parse_args()
    zoom = tuple(float(x) for x in a.zoom.split(",")) if a.zoom else None
    art = a.art if a.art in common.art_table() else common.art_of_page(a.art)
    board = make(art, a.orient, a.step, zoom, a.width, source_orient=a.source_orient)
    out = pathlib.Path(a.out) if a.out else common.ART / art / "work" / (f"grid-{a.orient}" + ("-zoom" if zoom else "") + ".png")
    out.parent.mkdir(parents=True, exist_ok=True)
    board.save(out)
    print(out)


if __name__ == "__main__":
    main()

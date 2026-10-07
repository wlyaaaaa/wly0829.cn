"""开一幅画：建 art/<画名>/，写好 spec.json 的骨架（每页都有的几样已经放进去，坐标留给你量），并出量位置用的网格图。

用法：python tools/new_art.py <画名或页名>
会做的事：
  1. 从《每页动法》第二版找到这幅画那一行，写进 spec.json 的 note（招牌动作照这个做）；
  2. 写 spec.json 骨架：叶子范围（m0.r，先放一个空的多边形）、晃叶子、浮尘、落叶、开场、小鸟（一个占位的落脚点）；
  3. 出 work/grid-src.png（无字原图 + 网格坐标）、work/grid-h.png、work/grid-v.png（横竖整屏图里裁出的框，核对用）；
  4. 打印这幅画用在哪些页、横竖插画框各多大、有没有缺口。
已经有 spec.json 的不覆盖。
"""
import re
import sys

import common
import grid

MOTION_DOC = common.P2 / "每页动法-定稿.md"


def motion_row(no):
    if not MOTION_DOC.exists() or no is None:
        return ""
    for line in MOTION_DOC.read_text(encoding="utf-8").splitlines():
        m = re.match(r"\|\s*(\d+)\s*\|(.*)\|\s*$", line)
        if m and int(m.group(1)) == no:
            cells = [c.strip() for c in m.group(2).split("|")]
            return f"{no} 号画：{cells[1]}。招牌（《每页动法》第二版）：{cells[2]}"
    return ""


def main(name):
    art = name if name in common.art_table() else common.art_of_page(name)
    if not art:
        raise SystemExit(f"{name}：约定文件里没有这一页的无字原图（不出活画）")
    info = common.art_table()[art]
    d = common.ART / art
    (d / "work").mkdir(parents=True, exist_ok=True)
    spec_path = d / "spec.json"
    if spec_path.exists():
        print(f"{spec_path} 已经有了，不覆盖")
    else:
        spec = {
            "art": art,
            "note": motion_row(info["no"]) or "（《每页动法》里没找到这一行，按画的意思定招牌动作，并在交付里写明）",
            "masks": {
                "size": 360,
                "m0.r": {"name": "叶子", "layers": [{"poly": [[0.0, 0.0], [0.3, 0.0], [0.3, 0.4], [0.0, 0.4]], "rule": "leaf"}],
                         "roots": {"points": [[0.15, 0.4]], "r0": 0.02, "r1": 0.2}, "feather": 0.006, "hug": 0.006}
            },
            "paper": "auto",
            "intro": {"center": [0.5, 0.5], "dur": 1.6, "bounce": 0.012},
            "effects": [
                {"type": "sway", "name": "叶子晃", "region": {"mask": "m0.r"}, "amp": 0.005, "period": 6.0, "freq": 5.0, "gust": {"every": 15, "dur": 3.4, "amp": 1.3}, "gustDir": "right"},
                {"type": "dust", "name": "浮尘", "count": 4, "areas": [[0.05, 0.05, 0.3, 0.4]], "size": 0.006, "amount": 0.55, "life": 9},
                {"type": "leaf", "name": "落叶", "every": 21, "dur": 7.5, "start": 7, "areas": [[0.1, 0.05, 0.25, 0.15]], "fall": 0.3, "size": 0.02}
            ],
            "bird": {"perches": [{"x": 0.5, "y": 0.2, "facing": "left", "span": 0.04, "name": "（占位）那件东西的上沿"}], "size": 0.15, "from": "right"},
            "rigid": []
        }
        common.save_spec(art, spec)
        print(f"写好骨架：{spec_path}")
    for o in ("src", "h", "v"):
        try:
            p = d / "work" / f"grid-{o}.png"
            grid.make(art, o, 0.05, None, 1200).save(p)
            print(f"网格图：{p}")
        except Exception as e:
            print(f"网格图 {o} 没出：{e}")
    print(f"画 {art}（编号 {info['no']}），无字原图 {info['source']}")
    for p in info["pages"]:
        for o in ("h", "v"):
            if common.measured(p, o):
                bx = common.box_px(p, o)
                print(f"  {p}/{o}：整屏 {common.image_size(p, o)}，插画框 {bx[2]:.0f}×{bx[3]:.0f} 像素")
            else:
                print(f"  {p}/{o}：量不到插画框，这一方向不出活画（{common.screen(p, o).get('gaps')}）")


if __name__ == "__main__":
    main(sys.argv[1])

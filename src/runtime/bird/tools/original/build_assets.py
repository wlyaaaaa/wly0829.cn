"""把小鸟的十三个姿势整理成一张网页用的图集 + 位置数据。

输入（只读）：sample/sprites/bird-*.png（站姿九张，脚的位置在 bird.json）
            bird2/sprites/bird-fly1..4.png（飞行四张，身体中心在 fly.json）
输出：dist/bird-atlas.webp、dist/bird-atlas.json

十三张原图已经按瞳孔大小统一（瞳孔都约 36～37 像素宽），所以全部用同一个缩放 SCALE。
对齐点：站姿用脚，飞行用身体中心。飞一、二、三的身体中心往“眼睛位置一致”的方向挪一半，
让拍翅膀时头的上下跳动减半（原来约为站高的 9%，挪后约 4～5%），这一步在 FLY_FIX 里写明。
"""
import io
import json
import pathlib

from PIL import Image

BASE = pathlib.Path(r"E:\Cache\Claude\Temp\28482c99")
OUT = BASE / "p2" / "bird" / "dist"
OUT.mkdir(parents=True, exist_ok=True)

SCALE = 0.32          # 原图 → 图集：站姿高 484 → 155 像素（显示 52 像素时是 3 倍，70 像素时约 2.2 倍）
QUALITY, ALPHA_Q = 82, 70
PAD = 6               # 缩小显示时取样会碰到邻居，留宽一点
SHEET_W = 1024

stand = json.loads((BASE / "sample/sprites/bird.json").read_text(encoding="utf-8"))["sprites"]
fly = {s["file"][5:-4]: s for s in json.loads((BASE / "bird2/sprites/fly.json").read_text(encoding="utf-8"))["sprites"]}

# 眼睛（瞳孔中心）位置：用来把飞一到飞三的对齐点往“头稳”的方向挪一半
EYE = {"fly1": (622, 297), "fly2": (579, 193), "fly3": (603, 71)}
mean = [sum(EYE[k][i] - fly[k]["bodyCenter"]["xy"[i]] for k in EYE) / 3 for i in (0, 1)]
FLY_FIX = {k: tuple(0.5 * ((EYE[k][i] - fly[k]["bodyCenter"]["xy"[i]]) - mean[i]) for i in (0, 1)) for k in EYE}
# 站着时身体中心（目测，和 fly.json 同一种取法：躯干中心，不算翅膀尾羽）
IDLE_BODY = (455, 296)

names = ["idle", "look", "tilt", "preen", "sing", "sleep", "crouch", "hop", "hop2", "fly1", "fly2", "fly3", "fly4"]
items = []
for n in names:
    if n.startswith("fly"):
        im = Image.open(BASE / "bird2/sprites" / f"bird-{n}.png").convert("RGBA")
        bc = fly[n]["bodyCenter"]; fx, fy = FLY_FIX.get(n, (0, 0))
        anchor = (bc["x"] + fx, bc["y"] + fy); kind = "body"
    else:
        s = stand[n]; im = Image.open(BASE / "sample/sprites" / s["file"]).convert("RGBA")
        anchor = tuple(s["feet"]); kind = "feet"
    bb = im.getbbox(); im = im.crop(bb); anchor = (anchor[0] - bb[0], anchor[1] - bb[1])
    w, h = round(im.width * SCALE), round(im.height * SCALE)
    items.append({"name": n, "img": im.resize((w, h), Image.LANCZOS), "w": w, "h": h,
                  "ax": round(anchor[0] * SCALE, 1), "ay": round(anchor[1] * SCALE, 1), "kind": kind})

# 按高度排的货架式装箱
order = sorted(items, key=lambda it: -it["h"])
x = y = PAD; row_h = 0
for it in order:
    if x + it["w"] + PAD > SHEET_W:
        x = PAD; y += row_h + PAD; row_h = 0
    it["x"], it["y"] = x, y
    x += it["w"] + PAD; row_h = max(row_h, it["h"])
sheet_h = y + row_h + PAD
sheet = Image.new("RGBA", (SHEET_W, sheet_h), (0, 0, 0, 0))
for it in items:
    sheet.alpha_composite(it["img"], (it["x"], it["y"]))
buf = io.BytesIO(); sheet.save(buf, "WEBP", quality=QUALITY, alpha_quality=ALPHA_Q, method=6)
(OUT / "bird-atlas.webp").write_bytes(buf.getvalue())

idle = stand["idle"]
data = {
    "image": "bird-atlas.webp",
    "size": [SHEET_W, sheet_h],
    "scale_from_source": SCALE,
    "note": "单位都是图集像素。x,y,w,h 是姿势在图集里的位置；ax,ay 是对齐点（kind=feet 是脚，kind=body 是身体中心），从这个姿势左上角量起。素材头朝右。",
    "standH": round(idle["height"] * SCALE, 1),
    "bodyFromFeet": [round((IDLE_BODY[0] - idle["feet"][0]) * SCALE, 1), round((IDLE_BODY[1] - idle["feet"][1]) * SCALE, 1)],
    "poses": {it["name"]: {k: it[k] for k in ("x", "y", "w", "h", "ax", "ay", "kind")} for it in items},
}
(OUT / "bird-atlas.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps({"atlas_kb": round(len(buf.getvalue()) / 1024, 1), "size": [SHEET_W, sheet_h], "fly_fix": FLY_FIX,
                  "bodyFromFeet": data["bodyFromFeet"], "standH": data["standH"]}, ensure_ascii=False))

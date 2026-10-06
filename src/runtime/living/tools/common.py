"""活画工具共用的小函数：找约定清单、读整屏图、插画框换算、画和页的对照。

坐标约定（全部工具一致）：
- 作者写配置用“无字原图内的占比”：u = 原图里的 x / 原图宽，v = y / 原图高，0..1。
  约定里插画都是 object-fit: fill 铺满插画框，所以这也就是“插画框内的占比”。
- 交付给网站的 config.json 用“整屏图的比例”：X = x / 整屏图宽，Y = y / 整屏图高（横竖各一份）。
- 插画框以做网站的对话给的 first-screens.json 为准（img 外框，横竖各一个）。
- 长度、幅度、半径一律写“插画框宽的占比”（引擎自己按框的宽高比换算），不随横竖改变。
"""
from __future__ import annotations

import json
import pathlib
import os
import re
import subprocess
import hashlib
from collections import OrderedDict
from functools import lru_cache

from PIL import Image

ENGINE = pathlib.Path(__file__).resolve().parents[1]
GATE = ENGINE.parents[2]
P2 = GATE / "sources/living"
CONTRACT = P2 / "first-screens.json"
_PATHS = {row["old_path"].replace("\\", "/").split("/claude-gate-1001/", 1)[-1]: row["new_path"]
          for row in json.loads((GATE / "docs/migration-a3-path-map.json").read_text("utf8"))["files"]}
def local_input(value): return GATE / _PATHS[value.replace("\\", "/").split("/claude-gate-1001/", 1)[-1]]
ASSET_CACHE = GATE / ".publish/living/asset-cache"
ART = pathlib.Path(os.environ.get("LIVING_ART_ROOT", P2 / "art"))
DIST = pathlib.Path(os.environ.get("LIVING_DIST_ROOT", GATE / ".publish/living/dist"))
SRC = pathlib.Path(os.environ.get("LIVING_SRC_ROOT", ENGINE / "src"))
FONT = "C:/Windows/Fonts/msyh.ttc"


@lru_cache(maxsize=1)
def contract() -> dict:
    data = json.loads(CONTRACT.read_text(encoding="utf-8"))
    override_path = P2 / 'contract-overrides.json'
    if override_path.exists():
        overrides = json.loads(override_path.read_text(encoding='utf-8'))['first_screens']
        keyed = {(e['page'], e['orientation']): e for e in overrides}
        for i, e in enumerate(data['first_screens']):
            key = (e['page'], e['orientation'])
            if key in keyed:
                data['first_screens'][i] = {**keyed.pop(key), '_living_override': True}
        if keyed:
            raise ValueError(f'合同覆盖包含原清单不存在的页面方向：{list(keyed)}')
    return data


def screen(page: str, orient: str) -> dict:
    """约定清单里这一页这一方向的条目（orient: 'h' 或 'v'）。"""
    for e in contract()["first_screens"]:
        if e["page"] == page and e["orientation"] == orient:
            return e
    raise KeyError(f"约定清单里没有 {page}/{orient}")


def measured(page: str, orient: str) -> bool:
    try:
        e = screen(page, orient)
    except KeyError:
        return False
    return bool(e.get("image") and e["image"].get("path") and e["illustration"].get("status") == "measured")


def screen_image_path(page: str, orient: str) -> pathlib.Path:
    e = screen(page, orient)
    if not e["image"] or not e["image"].get("path"):
        raise FileNotFoundError(f"{page}/{orient} 没有整屏图")
    return local_input(e["image"]["path"])


def box_px(page: str, orient: str) -> list[float]:
    """插画框 [x, y, w, h]，整屏图像素。"""
    e = screen(page, orient)
    if e["illustration"]["status"] != "measured":
        raise ValueError(f"{page}/{orient} 没有实测插画框：{e.get('gaps')}")
    return [float(v) for v in e["illustration"]["rect_px"]]


def box_ratio(page: str, orient: str) -> list[float]:
    return [float(v) for v in screen(page, orient)["illustration"]["rect_ratio"]]


def image_size(page: str, orient: str) -> list[int]:
    return list(screen(page, orient)["image"]["size_px"])


def source_of(page: str) -> str | None:
    for o in ("h", "v"):
        try:
            p = screen(page, o)["illustration"].get("source_asset_path")
        except KeyError:
            continue
        if p:
            return p
    return None


@lru_cache(maxsize=1)
def art_table() -> "OrderedDict[str, dict]":
    """画 → 用它的页。画的名字取用它的页里按字母排第一个的页名；编号按《每页动法》总览图的顺序（p2/contract-sheets/unique-sources.json）。"""
    groups: dict[str, list[str]] = {}
    for e in contract()["first_screens"]:
        src = e["illustration"].get("source_asset_path") or ""
        if not src:
            continue
        groups.setdefault(src, [])
        if e["page"] not in groups[src]:
            groups[src].append(e["page"])
    order_file = P2 / "unique-sources.json"
    order = list(json.loads(order_file.read_text(encoding="utf-8")).keys()) if order_file.exists() else []
    rank = {s: i + 1 for i, s in enumerate(order)}
    # 同一页横竖可能是两幅原图。按共同页合并成一个页组，保留每个方向，不能用字典键覆盖。
    merged = []
    for src in sorted(groups, key=lambda s: (rank.get(s, 999), s)):
        pages = set(groups[src])
        hits = [g for g in merged if g["pages"] & pages]
        sources = {src}
        for g in hits:
            pages |= g["pages"]
            sources |= g["sources"]
            merged.remove(g)
        merged.append({"pages": pages, "sources": sources})
    out: "OrderedDict[str, dict]" = OrderedDict()
    for group in merged:
        pages = sorted(group["pages"])
        sources = {o: screen(pages[0], o)["illustration"].get("source_asset_path") for o in ("h", "v")}
        src = sources["h"] or sources["v"]
        no = rank.get(src)
        if no is None:
            for line in (P2 / "每页动法-定稿.md").read_text(encoding="utf-8").splitlines():
                cells = [x.strip() for x in line.split("|")]
                if len(cells) > 3 and cells[1].isdigit() and any(p in re.split(r"[、，,\s]+", cells[2]) for p in pages):
                    no = int(cells[1]); break
        out[pages[0]] = {"no": no, "source": src, "sources": sources, "pages": pages}
    out = OrderedDict(sorted(out.items(), key=lambda kv: (kv[1]["no"] or 999, kv[0])))
    return out


def art_of_page(page: str) -> str | None:
    for art, info in art_table().items():
        if page in info["pages"]:
            return art
    return None


def source_path(art: str, orient: str | None = None) -> pathlib.Path:
    info = art_table()[art]
    return local_input(info["sources"].get(orient) or info["source"])


def open_rgb(path) -> Image.Image:
    im = Image.open(path)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        bg.alpha_composite(im)
        return bg.convert("RGB")
    return im.convert("RGB")


def source_alpha(art: str, orient: str | None = None):
    """无字原图的透明通道（numpy 0..1）；原图不透明时返回 None。"""
    import numpy as np
    im = Image.open(source_path(art, orient))
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        return np.asarray(im.convert("RGBA"))[..., 3].astype("float32") / 255.0
    return None


def crop_box(page: str, orient: str, scale: float = 1.0) -> Image.Image:
    """从整屏图裁出插画框（亚像素框按框的尺寸重采样）。"""
    im = open_rgb(screen_image_path(page, orient))
    x, y, w, h = box_px(page, orient)
    return im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS, box=(x, y, x + w, y + h))


def illustration(art: str, size: tuple[int, int] | None = None, orient: str | None = None) -> Image.Image:
    """做范围图、量位置用的插画：无字原图（透明处按白纸算）。"""
    im = open_rgb(source_path(art, orient))
    if size:
        im = im.resize(size, Image.LANCZOS)
    return im


def load_spec(art: str, orient: str | None = None) -> dict:
    spec = json.loads((ART / art / "spec.json").read_text(encoding="utf-8"))
    if orient:
        sources = art_table()[art]["sources"]
        if sources.get(orient) != sources.get("h") and orient not in spec.get("orientations", {}):
            raise ValueError(f"{art}/{orient} 是另一幅原图，必须在 spec.orientations.{orient} 独立量坐标、做范围图，不能复用横版")
        if sources.get(orient) != sources.get('h') and not {'masks','effects'}.issubset(spec['orientations'][orient]):
            raise ValueError(f'{art}/{orient} 的独立方向覆盖必须包含 masks 和 effects，不能只放空对象来复用另一幅图的配置')
        spec = {**spec, **spec.get("orientations", {}).get(orient, {})}
        spec.pop("orientations", None)
    return spec


def mask_dir(art: str, orient: str | None = None) -> pathlib.Path:
    spec = load_spec(art)
    return ART / art / orient if orient in spec.get("orientations", {}) else ART / art


@lru_cache(maxsize=None)
def site_image(page: str, orient: str) -> pathlib.Path:
    """网站上实际用的整屏图（OSS 上那张 WebP 的本地缓存）；没有缓存就用约定里的 PNG。两者像素一致（已核对）。"""
    e = screen(page, orient)
    png = screen_image_path(page, orient)
    expected = e['image'].get('sha256')
    if expected and hashlib.sha256(png.read_bytes()).hexdigest() != expected:
        raise ValueError(f'{page}/{orient}：当前整屏PNG指纹与合同不符，先更新本轮合同覆盖，不能拿旧缓存冒充当前图')
    if e.get('_living_override'):
        return png
    name = pathlib.Path(e["image"]["path"]).stem          # 例如 localocr-01-h
    d = ASSET_CACHE / "_typeset" / page
    if d.exists():
        import numpy as np
        reference = np.asarray(open_rgb(png), np.int16)
        for f in sorted(d.glob(f"*-{name}.webp")):
            cached = open_rgb(f)
            if cached.size == (reference.shape[1], reference.shape[0]) and np.abs(np.asarray(cached,np.int16)-reference).max() <= 2:
                return f
        if list(d.glob(f"*-{name}.webp")):
            print(f'{page}/{orient}：同名缓存不符合当前合同PNG，使用合同PNG（接入时需更新图床对象）',flush=True)
    return png


def beijing_now() -> str:
    import datetime as _dt
    return _dt.datetime.now(_dt.timezone(_dt.timedelta(hours=8))).strftime("%Y-%m-%d %H:%M")


def recycle(path):
    """任务生成物用完进入回收站；仅允许当前引擎与指定的测试输出根。"""
    path = pathlib.Path(path).resolve()
    if not path.exists():
        return
    roots = [ENGINE.resolve(), ART.resolve(), DIST.resolve()]
    root = next((r for r in roots if path != r and path.is_relative_to(r)), None)
    if root is None:
        raise ValueError(f"任务清理路径不在引擎输出范围：{path}")
    r = subprocess.run(['pwsh', '-NoProfile', '-File', r'E:\.agents\tools\Move-TaskItemToRecycleBin.ps1',
                        '-LiteralPath', str(path), '-AllowedRoot', str(root), '-Json'], capture_output=True, text=True, encoding='utf-8')
    if r.returncode or path.exists():
        raise RuntimeError(f"未能回收任务生成物 {path}：{r.stdout} {r.stderr}")


def dump_spec(obj) -> str:
    """把 spec.json 写成好读的样子：数字组成的小数组写在一行里。"""
    def enc(o, ind):
        pad = "  " * ind
        if isinstance(o, dict):
            if not o:
                return "{}"
            items = [f'{pad}  {json.dumps(k, ensure_ascii=False)}: {enc(v, ind + 1)}' for k, v in o.items()]
            return "{\n" + ",\n".join(items) + "\n" + pad + "}"
        if isinstance(o, list):
            if all(not isinstance(x, (dict, list)) for x in o) or all(isinstance(x, list) and all(not isinstance(y, (dict, list)) for y in x) for x in o):
                return json.dumps(o, ensure_ascii=False)
            return "[\n" + ",\n".join(f"{pad}  {enc(x, ind + 1)}" for x in o) + "\n" + pad + "]"
        return json.dumps(o, ensure_ascii=False)
    return enc(obj, 0) + "\n"


def save_spec(art: str, spec: dict):
    (ART / art / "spec.json").write_text(dump_spec(spec), encoding="utf-8")

"""素材：优先读共用素材库 typeset-assets\\_library\\asset-map.jsonl（发布标记 ready 且指纹对上才用），
否则读抠图 typeset-assets\\manifest.jsonl。标题图按原分辨率、只把近白底推成纯白（multiply 贴，不变淡）。"""
import hashlib
import json
import os

PIPE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
ASSET_ROOT = os.environ.get("TYPESET_ASSET_ROOT", os.path.join(PIPE, "sources", "assets"))
LIB = os.path.join(ASSET_ROOT, "_library")
CACHE = os.path.join(PIPE, ".publish", "typeset-out", "_cache")
PROTO_ASSETS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets")
TITLE_ALGO = "near-white-243-250-reviewed-region-crop8-v5"
TITLE_REGIONS = os.path.join(ASSET_ROOT, "title-content-regions.json")

_manifest = None
SOURCE = ""   # 这次用的是哪份素材清单（写进报告）


def _sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def _library():
    """共用素材库：REQUESTS-READY.json 为 ready、asset_map_sha256 与实际映射一致、读前读后标记字节相同才接纳。"""
    mk, mp = os.path.join(LIB, "REQUESTS-READY.json"), os.path.join(LIB, "asset-map.jsonl")
    if not (os.path.exists(mk) and os.path.exists(mp)):
        return None, "共用素材库还没发布 asset-map.jsonl / REQUESTS-READY.json，用抠图 manifest"
    try:
        before = open(mk, "rb").read()
        m = json.loads(before.decode("utf-8"))
        if m.get("status") != "ready":
            return None, f"共用素材库状态 {m.get('status')}（不是 ready），用抠图 manifest"
        want = m.get("asset_map_sha256")
        data = open(mp, "rb").read()
        if not want or hashlib.sha256(data).hexdigest() != want:
            return None, "共用素材库映射指纹和发布标记对不上（可能正在发布），用抠图 manifest"
        if open(mk, "rb").read() != before:
            return None, "读映射期间发布标记变了，用抠图 manifest"
    except Exception as e:
        return None, f"共用素材库读取失败 {e!r}，用抠图 manifest"
    out = {}
    for line in data.decode("utf-8").splitlines():
        if not line.strip():
            continue
        try:
            r = json.loads(line)
        except Exception:
            continue
        if r.get("status") != "ready" or not r.get("asset"):
            continue
        r["path"] = os.path.join(ASSET_ROOT, r["asset"])
        if not os.path.exists(r["path"]):
            continue
        r.setdefault("title_exact_match", r.get("text_verified"))
        r["_lib"] = True
        out.setdefault(r["screen_id"], []).append(r)
    for v in out.values():
        v.sort(key=lambda r: (r.get("role", ""), float(r.get("slot_ordinal") or 0)))
    return out, f"共用素材库 asset-map.jsonl（{m.get('published_at', '')}）"


def manifest():
    global _manifest, SOURCE
    if _manifest is None:
        lib, why = _library()
        SOURCE = why
        if lib is not None:
            _manifest = lib
            return _manifest
        _manifest = {}
        p = os.path.join(ASSET_ROOT, "manifest.jsonl")
        if os.path.exists(p):
            for line in open(p, encoding="utf-8"):
                line = line.strip()
                if not line:
                    continue
                try:
                    r = json.loads(line)
                except Exception:
                    continue
                r["path"] = os.path.join(ASSET_ROOT, r["asset"])
                if os.path.exists(r["path"]):
                    _manifest.setdefault(r["screen_id"], []).append(r)
        for v in _manifest.values():
            v.sort(key=lambda r: r["asset"])
            k = {}
            for r in v:  # 抠图清单没有槽位号：同屏同角色按文件名顺序编 1、2、3…
                k[r["role"]] = k.get(r["role"], 0) + 1
                r.setdefault("slot_ordinal", k[r["role"]])
    return _manifest


def _fits(r, orient):
    os_ = r.get("orientations")
    if os_:
        return orient in os_
    return r.get("source_image", "").lower().endswith(f"-{orient}.png")


def for_screen(sid, role, orient=None):
    rows = [r for r in manifest().get(sid, []) if r["role"] == role]
    if orient:  # 优先同方向的
        same = [r for r in rows if _fits(r, orient)]
        rows = same or rows
    return rows


def slots(sid, role, orient=None):
    """按槽位号查：[(slot_ordinal, 行 或 None)]，缺的槽位保留空位，不把后面的图往前挪。"""
    rows = for_screen(sid, role, orient)
    by = {}
    for r in rows:
        by.setdefault(int(float(r.get("slot_ordinal") or 0)), r)
    if not by:
        return []
    return [(k, by.get(k)) for k in range(1, max(by) + 1)]


def local_path(path):
    normalized = str(path).replace("\\", "/")
    if "/typeset-proto/" in normalized:
        return os.path.join(os.path.dirname(PROTO_ASSETS), *normalized.split("/typeset-proto/", 1)[1].split("/"))
    reference = os.path.join(ASSET_ROOT, "_references", hashlib.sha256(normalized.encode()).hexdigest() + os.path.splitext(normalized)[1])
    return reference if os.path.isfile(reference) else path

def url(path):
    return "file:///" + os.path.abspath(local_path(path)).replace("\\", "/")


def title_ready(path):
    """标题图：白底原图，只把最浅通道 ≥ 243 的近白纸底推到纯白（≥250 全白），笔画和笔刷线（最浅通道远低于 243）不动。
    缓存键含素材内容指纹和算法版本，换素材或改算法不会沿用旧缓存。"""
    import numpy as np
    from PIL import Image
    os.makedirs(CACHE, exist_ok=True)
    digest = _sha(path)
    # 按素材内容指纹绑定亲看过的标题安全区；生成图和干净裁片仍用全图。
    # 不能按“所有绿色像素”猜文字：叶子、卡框也绿，必须保留文字/笔刷而排除邻画。
    regions = json.load(open(TITLE_REGIONS, encoding="utf-8")) if os.path.exists(TITLE_REGIONS) else {}
    region = regions.get("regions", {}).get(digest)
    box = region.get("content_box") if region else None
    masks = region.get("clear_boxes", []) if region else []
    h = hashlib.sha1((TITLE_ALGO + digest + json.dumps([box, masks])).encode()).hexdigest()[:16]
    out = os.path.join(CACHE, f"title-{h}.png")
    if not os.path.exists(out):
        im = Image.open(path)
        if box:
            if (len(box) != 4 or any(type(v) is not int for v in box) or
                    not (0 <= box[0] < box[2] <= im.width and 0 <= box[1] < box[3] <= im.height)):
                raise ValueError(f"标题安全区超出原图：{path} {box}")
        if masks:
            from PIL import ImageDraw
            im = im.convert("RGBA")
            draw = ImageDraw.Draw(im)
            for clear in masks:
                if (len(clear) != 4 or any(type(v) is not int for v in clear) or
                        not (0 <= clear[0] < clear[2] <= im.width and 0 <= clear[1] < clear[3] <= im.height)):
                    raise ValueError(f"标题清理区超出原图：{path} {clear}")
                draw.rectangle((clear[0], clear[1], clear[2]-1, clear[3]-1), fill=(255,255,255,255))
        if box:
            im = im.crop(box)
        if im.mode == "RGBA":  # 透明底的：铺白底合成，alpha 不改笔画颜色
            bg = Image.new("RGB", im.size, "white"); bg.paste(im, mask=im.split()[3]); im = bg
        arr = np.asarray(im.convert("RGB")).astype(float)
        mn = arr.min(axis=2, keepdims=True)
        t = np.clip((mn - 243) / (250 - 243), 0, 1)  # 只去近纯白底，笔画和笔刷线不动
        out_arr = (arr * (1 - t) + 255 * t).round().astype("uint8")
        # 裁掉四周纯白边（只裁白纸，不碰笔画）：同档标题按笔画高度排，大白边不再冒充字高
        ink = out_arr.min(axis=2) < 250
        ys, xs = np.where(ink.any(1))[0], np.where(ink.any(0))[0]
        # 已审核安全区的白边也是构图的一部分，保持它的原生像素和字形尺寸；
        # 二次紧裁会改比例，且把合法的安全白边重新当作可丢的纸边。
        if not box and len(ys) and len(xs):
            m = 8
            out_arr = out_arr[max(0, ys[0] - m):ys[-1] + m + 1, max(0, xs[0] - m):xs[-1] + m + 1]
        Image.fromarray(out_arr).save(out)
    return out


def title_size(path):
    """裁白边后的标题图尺寸 (宽, 高)。"""
    from PIL import Image
    with Image.open(title_ready(path)) as im:
        return im.size

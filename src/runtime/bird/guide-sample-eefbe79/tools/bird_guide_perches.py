"""小鸟带路的落脚点：从每页已有的分片原图和页面数据里，离线找出鸟能站、又不压字不挡点击的地方。

只读输入：页面 HTML 里的 page-data（分片、卡片框、链接热区）、该页活画配置（鸟大小）、分片原图、鸟图集。
输出：写进活画配置的 ``guide`` 字段（坐标都是分片原图的占比），运行时只做筛选，不再看像素。

落脚面三种，都由原图像素复核：
- ``title``：小标题大字的上沿（鸟站在字顶上，身子全在字上方的留白里），或小标题笔刷下划线露出字外的那一截；
- ``card``：卡片上边框，离圆角留出半只鸟以上，不站角尖；
鸟的整只轮廓（站、歪头、看、理毛、蹲、唱时上抬）按实际站高放大后，外扩一圈安全距，不能碰到任何文字、
插图、链接或热区；上一屏底部的像素也算进头顶空间。只存“能放下多高的鸟”，运行时按真实鸟高再筛一次。
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit

import numpy as np
from PIL import Image

SCHEMA = 'wly.bird-guide.v1'
STAND_POSES = ('idle', 'look', 'tilt', 'preen', 'crouch', 'sing')
LIFT = 0.12             # 页面上只做原地轻跳和唱歌，最高上抬约 0.12 个站高
PAGE_MIN = {'h': 32, 'v': 28}   # 鸟离开画后在页面上的最小站高（CSS 像素）：电脑 32、手机 28，和带路运行时一致
CORNER_BIRDS = 0.75     # 站在卡片边框上时，鸟身离卡片两端的角至少 0.75 个鸟宽
BIRD_WIDTH = 1.25       # 鸟宽约等于 1.25 个站高（站姿外框）
STRIPS = 28             # 鸟轮廓切成竖条，每条一个上下范围
REFERER = 'https://wly0829.cn/'
PAGE_DATA = re.compile(r'<script id="page-data" type="application/json">(.*?)</script>', re.S)
CLICKABLE = ('links', 'hotspots', 'native_actions', 'interactive_cards', 'live', 'native_live')


# ---------- 读输入 ----------
class Images:
    """分片原图：先在给定缓存目录里按 URL 找（流水线 http-cache 的 traffic.json，或本工具自己的缓存），
    找不到再按真实网站来源取一次并存进自己的缓存。"""

    def __init__(self, cache_dirs=(), own_cache=None, fetch=True):
        self.index = {}
        for d in map(Path, cache_dirs):
            t = d / 'traffic.json'
            if t.exists():
                for sha, v in json.loads(t.read_text('utf-8')).items():
                    self.index.setdefault(v['url'], d / (sha + '.body'))
        self.own = Path(own_cache) if own_cache else None
        if self.own:
            self.own.mkdir(parents=True, exist_ok=True)
        self.fetch = fetch
        self.fetched = 0

    def bytes(self, url):
        p = self.index.get(url)
        if p and p.exists():
            return p.read_bytes()
        key = self.own / (hashlib.sha256(url.encode()).hexdigest() + '.body') if self.own else None
        if key and key.exists():
            return key.read_bytes()
        if not self.fetch:
            raise FileNotFoundError(url)
        req = urllib.request.Request(url, headers={'Referer': REFERER, 'User-Agent': 'Mozilla/5.0 wly-bird-guide'})
        for attempt in range(4):                    # OSS 偶尔断连：稍等再试，最多 4 次
            try:
                body = urllib.request.urlopen(req, timeout=90).read()
                break
            except OSError:
                if attempt == 3:
                    raise
                __import__('time').sleep(1.5 * (attempt + 1))
        self.fetched += 1
        if key:
            key.write_bytes(body)
        return body

    def rgb(self, url):
        return np.asarray(Image.open(io.BytesIO(self.bytes(url))).convert('RGB')).astype(np.float32)


def page_data(html: bytes | str):
    text = html.decode('utf-8') if isinstance(html, bytes) else html
    m = PAGE_DATA.search(text)
    if not m:
        raise ValueError('页面里没有 page-data')
    return json.loads(m.group(1))


class Silhouette:
    """鸟站着时各姿势的并集轮廓（以脚为原点、站高为 1；头朝右）。"""

    def __init__(self, atlas_json: Path, atlas_image: Path):
        j = json.loads(Path(atlas_json).read_text('utf-8'))
        alpha = np.asarray(Image.open(atlas_image).convert('RGBA'))[..., 3] > 40
        H = float(j['standH'])
        pts = []
        for name in STAND_POSES:
            p = j['poses'][name]
            m = alpha[p['y']:p['y'] + p['h'], p['x']:p['x'] + p['w']]
            ys, xs = np.nonzero(m)
            dx = (xs - p['ax']) / H
            dy = (ys - p['ay']) / H
            pts.append((dx, dy))
            pts.append((dx, dy - LIFT))
        dx = np.concatenate([a for a, _ in pts]); dy = np.concatenate([b for _, b in pts])
        self.x0, self.x1 = float(dx.min()), float(dx.max())
        edges = np.linspace(self.x0, self.x1, STRIPS + 1)
        self.strips = []
        for i in range(STRIPS):
            sel = (dx >= edges[i]) & (dx <= edges[i + 1])
            if sel.any():
                self.strips.append((float(edges[i]), float(edges[i + 1]), float(dy[sel].min()), float(min(0.0, dy[sel].max()))))
        idle = j['poses']['idle']
        m = alpha[idle['y']:idle['y'] + idle['h'], idle['x']:idle['x'] + idle['w']]
        foot = m[int(idle['ay']) - int(0.06 * H):int(idle['ay']) + 3]
        cols = np.nonzero(foot.any(0))[0]
        self.toe = ((cols.min() - idle['ax']) / H, (cols.max() - idle['ax']) / H)   # 站稳时脚趾的左右范围


# ---------- 像素 ----------
def content_mask(a):
    """文字、插图、笔刷都算“不能压”的东西；纸色、卡片底色和浅色边框不算。"""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    lum = .299 * r + .587 * g + .114 * b
    sat = (mx - mn) / np.maximum(mx, 1)
    return (lum < 205) | ((sat > 0.22) & (lum < 240))


def title_ink(a):
    """小标题大字的墨色：深绿。"""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = .299 * r + .587 * g + .114 * b
    return (g > r + 25) & (g > b + 5) & (lum < 150)


def integral(mask):
    s = np.zeros((mask.shape[0] + 1, mask.shape[1] + 1), np.int32)
    s[1:, 1:] = np.cumsum(np.cumsum(mask, 0, dtype=np.int32), 1, dtype=np.int32)
    return s


def rect_hits(S, x0, y0, x1, y1):
    """[x0,x1)×[y0,y1) 里有没有东西；越界按“有东西”（宁可不站）。"""
    H, W = S.shape[0] - 1, S.shape[1] - 1
    if x0 < 0 or y0 < 0 or x1 > W or y1 > H:
        return True
    if x1 <= x0 or y1 <= y0:
        return False
    return S[y1, x1] - S[y0, x1] - S[y1, x0] + S[y0, x0] > 0


def fits(S, sil, fx, fy, height, facing, margin):
    """脚在 (fx,fy)、站高 height 的鸟，轮廓外扩 margin 后是否碰到东西。facing=1 头朝右。"""
    for a, b, top, bottom in sil.strips:
        xa, xb = (a, b) if facing > 0 else (-b, -a)
        x0 = int(np.floor(fx + xa * height - margin)); x1 = int(np.ceil(fx + xb * height + margin))
        y0 = int(np.floor(fy + top * height - margin))
        y1 = int(np.ceil(fy + bottom * height - 2))           # 脚下两像素是落脚面本身
        if rect_hits(S, x0, y0, x1, max(y1, y0)):
            return False
    return True


# ---------- 找落脚面 ----------
def title_surface(a, mask, limit):
    """小标题：最上面一块高度够大的深绿大字。返回 (每列的顶面 y，字的左右范围) 或 None。"""
    ink = title_ink(a[:limit])
    rows = ink.sum(1)
    W = a.shape[1]
    on = rows > max(3, W * 0.004)
    y = 0
    while y < len(on):
        if not on[y]:
            y += 1; continue
        y1 = y
        while y1 < len(on) and on[y1]:
            y1 += 1
        if y1 - y >= max(40, 0.035 * W):
            cols = np.nonzero(ink[y:y1].any(0))[0]
            gx0, gx1 = int(cols.min()), int(cols.max())
            # 顶面：字和紧贴其下的笔刷，在每一列取最上面的“内容”像素
            lo, hi = max(0, y - 4), min(mask.shape[0], y1 + int(0.08 * W))
            band = mask[lo:hi]
            any_col = band.any(0)
            top = np.where(any_col, band.argmax(0) + lo, -1)
            return top, (gx0, gx1), (y, y1)
        y = y1
    return None


def candidates_title(top, glyph, sil, height):
    """顶面上平整、托得住脚的位置。"""
    W = len(top)
    t0, t1 = sil.toe
    out = []
    step = max(2, int(height * 0.05))
    for fx in range(0, W, step):
        a, b = int(fx + t0 * height * 0.8), int(fx + t1 * height * 0.8)
        if a < 0 or b >= W:
            continue
        seg = top[a:b + 1]
        if (seg < 0).any():
            continue
        if seg.max() - seg.min() > max(3, 0.045 * height):
            continue
        out.append((fx, int(seg.min()), 'title'))
    return out


def candidates_card(rect, size, rgb, sil, height):
    """卡片上沿：脚下必须真有一条看得见的边框线（只有左边竖条的引用块、没画框的区域都不算），离圆角留出半只鸟以上。"""
    W, H = size
    x, y, w, h = rect[0] * W, rect[1] * H, rect[2] * W, rect[3] * H
    yy = int(round(y))
    radius = max(14.0, 0.012 * W)
    margin = radius + 0.55 * height
    lo, hi = int(x + margin), int(x + w - margin)
    if hi <= lo or yy < 2 or yy + 3 >= H:
        return []
    band = rgb[yy - 1:yy + 3]
    lum = .299 * band[..., 0] + .587 * band[..., 1] + .114 * band[..., 2]
    above = rgb[max(0, yy - 6)]
    lum_above = .299 * above[..., 0] + .587 * above[..., 1] + .114 * above[..., 2]
    line = (lum.min(0) < 240) & (lum.min(0) < lum_above - 8)          # 比上方纸面明显深的一条线
    t0, t1 = sil.toe
    step = max(2, int(height * 0.05))
    out = []
    for fx in range(lo, hi + 1, step):
        a, b = int(fx + t0 * height * 0.8), int(fx + t1 * height * 0.8)
        if a >= 0 and b < W and line[a:b + 1].mean() >= 0.85:
            out.append((fx, yy, 'card'))
    return out


def solve_part(part, rgb, prev_rgb, sil, nominal, levels=(1.08, 1.2, 1.35, 1.5), avoid=None):
    W, H = part['size']
    if rgb.shape[1] != W or rgb.shape[0] != H:
        raise ValueError('原图尺寸和页面数据不符：' + part['image'])
    mask = content_mask(rgb)
    # 可点击的地方按“有东西”算，外扩一圈
    pad = max(8, int(0.008 * W))
    for key in CLICKABLE:
        for item in part.get(key) or []:
            r = item.get('rect') if isinstance(item, dict) else item
            if not r or len(r) != 4:
                continue
            x0, y0 = int(r[0] * W) - pad, int(r[1] * H) - pad
            x1, y1 = int((r[0] + r[2]) * W) + pad, int((r[1] + r[3]) * H) + pad
            mask[max(0, y0):max(0, y1), max(0, x0):max(0, x1)] = True
    # 别的卡片整块也不能压：鸟站在一张卡的上沿时，身子要在空白里，不能伸进上面那张卡（自己那张在脚下，不受影响）
    for r in part.get('cards') or []:
        x0, y0 = int(r[0] * W) + 2, int(r[1] * H) + 2
        x1, y1 = int((r[0] + r[2]) * W) - 2, int((r[1] + r[3]) * H) - 2
        if x1 > x0 and y1 > y0:
            mask[y0:y1, x0:x1] = True
    # 头顶空间可以借上一屏底部（中间的缝按 0 算，更保守）
    above = 0
    if prev_rgb is not None and prev_rgb.shape[1] == W:
        above = min(prev_rgb.shape[0], int(nominal * 2))
        mask = np.vstack([content_mask(prev_rgb[-above:]), mask])
    if avoid:                                   # 首屏的画框和它上方一只鸟高：那是鸟的家，带路不往那儿落
        x0, y0 = int(avoid[0] * W - nominal), int(avoid[1] * H - 1.5 * nominal)
        x1, y1 = int((avoid[0] + avoid[2]) * W + nominal), int((avoid[1] + avoid[3]) * H + 0.5 * nominal)
        mask[max(0, y0 + above):max(0, y1 + above), max(0, x0):max(0, x1)] = True
    S = integral(mask)
    margin = max(3.0, 0.07 * nominal)
    found = []
    cards = sorted(part.get('cards') or [], key=lambda r: (r[1], r[0]))
    limit = int(min([r[1] * H for r in cards] + [0.45 * H]))
    surface = title_surface(rgb, content_mask(rgb), max(limit, int(0.12 * H)))
    lines = []
    if surface:
        top, glyph, rows = surface
        lines.append(('title', None, candidates_title(top, glyph, sil, nominal), glyph))
    for i, rect in enumerate(cards):
        lines.append(('card', i, candidates_card(rect, (W, H), rgb, sil, nominal), rect))
    for kind, index, cand, ref in lines:
        ok = []
        for fx, fy, _ in cand:
            for facing in (1, -1):
                best = 0.0
                for lv in levels:
                    h = nominal * lv
                    if kind == 'card':                          # 不站角尖：鸟身两端离卡片左右角都要留 0.75 个鸟宽
                        a, b = (sil.x0, sil.x1) if facing > 0 else (-sil.x1, -sil.x0)
                        lo, hi = ref[0] * W + CORNER_BIRDS * BIRD_WIDTH * h, (ref[0] + ref[2]) * W - CORNER_BIRDS * BIRD_WIDTH * h
                        if fx + a * h < lo or fx + b * h > hi:
                            break
                    if fits(S, sil, fx, fy + above, h, facing, margin * lv):
                        best = lv
                    else:
                        break
                if best >= levels[0]:
                    ok.append((fx, fy, facing, best))
        if not ok:
            continue
        found.append((kind, index, ref, ok))
    return choose(found, W, H, nominal)


def choose(found, W, H, nominal):
    """每条落脚面最多留两处，离得开；卡片偏向左三成、标题偏向字的右三分之一，头朝内容中间。"""
    perches = []
    for kind, index, ref, ok in found:
        if kind == 'card':
            x, w = ref[0] * W, ref[2] * W
            prefs = [(x + 0.3 * w, 1), (x + 0.72 * w, -1)]
        else:
            g0, g1 = ref
            prefs = [(g0 + 0.72 * (g1 - g0), -1), (g0 + 0.3 * (g1 - g0), 1)]
        taken = []
        for target, face in prefs:
            pool = [p for p in ok if all(abs(p[0] - t[0]) > 2.6 * nominal for t in taken)]
            if not pool:
                break
            # 先看朝向是否朝内容，再看离理想位置多远，最后看能放多大的鸟
            fx, fy, facing, lv = min(pool, key=lambda p: (p[2] != face, abs(p[0] - target) / W, -p[3]))
            if abs(fx - target) > 0.35 * (ref[2] * W if kind == 'card' else max(1, ref[1] - ref[0]) + nominal):
                continue
            taken.append((fx, fy, facing, lv))
        for fx, fy, facing, lv in taken:
            perches.append([kind, round(fx / W, 5), round(fy / H, 5), facing, round(nominal * lv / W, 5)])
    perches.sort(key=lambda p: (p[2], p[1]))
    return perches


# 分片在常见屏幕上显示的缩放（CSS 像素 / 原图像素）：电脑 1440 宽时分片 1392 宽；手机 412 宽时满宽
TYPICAL_SCALE = {'h': 1392 / 1672, 'v': 412 / 941}


def nominal_bird(config, orientation):
    """该方向鸟的站高（分片原图像素）：和活画引擎同一算法——比例高度与最小高度取大；手机按小一号。
    最小高度是 CSS 像素，按常见屏幕的缩放换算；屏幕更窄时鸟相对更大，运行时会按真实鸟高再筛掉放不下的落点。"""
    v = config[orientation]
    b = v['bird']
    small = 0.82 if orientation == 'v' else 1.0
    by_ratio = float(b.get('size') or 0.15) * small * v['box'][3] * v['image']['size'][1]
    by_floor = max(float(b.get('minSize') or 24), PAGE_MIN[orientation]) / TYPICAL_SCALE[orientation]
    return max(by_ratio, by_floor)    # 页面上至少按 PAGE_MIN 显示，落点按页面上的鸟高算


def build(html: bytes, config: dict, images: Images, sil: Silhouette):
    data = page_data(html)
    out = {'schema': SCHEMA, 'page': data['page']}
    stats = {}
    for orientation in ('h', 'v'):
        if orientation not in config or 'bird' not in config[orientation]:
            continue
        nominal = nominal_bird(config, orientation)
        parts, prev = [], None
        for si, screen in enumerate(data['screens']):
            nth = 0
            for part in screen['parts']:
                if part.get('orientation') != orientation:
                    continue
                rgb = images.rgb(part['src'])
                if rgb is not None:
                    perches = solve_part(part, rgb, prev, sil, nominal, avoid=config[orientation]['box'] if si == 0 and nth == 0 else None)
                    if perches:
                        # s：那一屏 section 的 id；i：这一屏同方向的第几片；img：原图文件名（运行时核对，换过图就不用）
                        parts.append({'s': screen['id'], 'i': nth, 'o': orientation,
                                      'img': Path(urlsplit(part['src']).path).name,
                                      'size': part['size'], 'perches': perches})
                prev = rgb
                nth += 1
        out[orientation] = {'bird': round(nominal, 2), 'parts': parts}
        stats[orientation] = {'parts': len(parts), 'perches': sum(len(p['perches']) for p in parts),
                              'title': sum(1 for p in parts for q in p['perches'] if q[0] == 'title'),
                              'card': sum(1 for p in parts for q in p['perches'] if q[0] == 'card')}
    return out, stats


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--html', type=Path, required=True)
    ap.add_argument('--config', type=Path, required=True)
    ap.add_argument('--atlas-json', type=Path, required=True)
    ap.add_argument('--atlas-image', type=Path, required=True)
    ap.add_argument('--cache', type=Path, action='append', default=[])
    ap.add_argument('--own-cache', type=Path)
    ap.add_argument('--output', type=Path, required=True)
    a = ap.parse_args()
    g, s = build(a.html.read_bytes(), json.loads(a.config.read_text('utf-8')), Images(a.cache, a.own_cache),
                 Silhouette(a.atlas_json, a.atlas_image))
    a.output.write_text(json.dumps(g, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(json.dumps(s, ensure_ascii=False))

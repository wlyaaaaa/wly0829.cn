"""同指纹卡头图片上的无字透明点；只读取实际图位的本机文件。

render_header_icon_motion_dots(header_url, payload, ctx) 返回空标记与定位脚本。
调用者先确认这是唯一原卡头，再把结果与原 img 放进同一定位容器；
原 img 必须是容器的直接子元素。此 helper 不选择、替换或放大图片。
"""

import hashlib
from html import escape
import math
from numbers import Real
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit


def _unfinished(ctx, detail):
    message = "comp-text 卡头图内透明点：" + detail + "；原图与原文保留，标记未执行。"
    ctx.warn(message)
    incomplete = getattr(ctx, "incomplete", None)
    if callable(incomplete):
        incomplete(message, "composition")


def _local_asset_path(header_url):
    """解析一个实际本机路径/URI；不查询清单、兄弟图或网络。"""
    if not isinstance(header_url, str) or not header_url:
        return None
    if re.match(r"^[A-Za-z]:[\\/]", header_url):
        candidate = Path(header_url)
    else:
        try:
            parts = urlsplit(header_url)
        except ValueError:
            return None
        if parts.scheme == "file" and parts.netloc in ("", "localhost"):
            path = unquote(parts.path)
            if re.match(r"^/[A-Za-z]:/", path):
                path = path[1:]
            candidate = Path(path)
        elif not parts.scheme and not parts.netloc:
            candidate = Path(header_url)
        else:
            return None
    return candidate if candidate.is_absolute() else None


def _rectangles(payload):
    dots = payload.get("dots")
    if not isinstance(dots, list) or not dots:
        return None
    checked = []
    for rect in dots:
        if not isinstance(rect, (list, tuple)) or len(rect) != 4:
            return None
        if any(isinstance(value, bool) or not isinstance(value, Real) for value in rect):
            return None
        try:
            x, y, width, height = map(float, rect)
        except (TypeError, ValueError, OverflowError):
            return None
        if not all(math.isfinite(value) for value in (x, y, width, height)):
            return None
        if (x < 0 or y < 0 or width <= 0 or height <= 0 or
                x + width > 1 or y + height > 1):
            return None
        checked.append((x, y, width, height))
    return checked


# 点的矩形属于实际图像内容框，不能用带 object-fit 留白的 img 外框代替。
# 不设最小尺寸；<=1px 仍保留实际尺寸，并标成 subpixel 供数字验收回读。
_POSITION_SCRIPT = r"""
(() => {
  const script = document.currentScript, wrap = script.parentElement;
  const dots = [...wrap.children].filter(el => el.matches('.ct-header-icon-motion-dot'));
  const images = [...wrap.children].filter(el => el.matches('img.ct-point-header-icon'));
  const reasons = {
    'missing-image': '实际卡头缺唯一直接子图位',
    'image-not-ready': '实际卡头图尚未载入',
    'changed-source': '实际卡头图URL已变化，旧坐标未执行',
    'empty-image': '实际卡头图内容框没有有效尺寸',
    'unsupported-fit': '实际图像适配方式尚不支持',
    'unsupported-position': '实际图像位置声明尚不支持',
    'clipped': '原点被实际图框裁掉',
    'image-error': '实际卡头图载入失败'
  };
  const hide = reason => dots.forEach(dot => {
    dot.style.display = 'none'; dot.dataset.ctDotPlacement = reason;
    dot.dataset.incomplete = '卡头图内透明点：' + reasons[reason] + '，该点不能量。';
  });
  if (images.length !== 1) { hide('missing-image'); return; }
  const img = images[0];
  const expected = new URL(script.dataset.ctDotSource, document.baseURI).href;
  const number = value => parseFloat(value) || 0;
  const box = el => {
    const style = getComputedStyle(el), rect = el.getBoundingClientRect();
    const bl = number(style.borderLeftWidth), br = number(style.borderRightWidth);
    const bt = number(style.borderTopWidth), bb = number(style.borderBottomWidth);
    const pl = number(style.paddingLeft), pr = number(style.paddingRight);
    const pt = number(style.paddingTop), pb = number(style.paddingBottom);
    const bw = number(style.width) + (style.boxSizing === 'border-box' ? 0 : bl + br + pl + pr);
    const bh = number(style.height) + (style.boxSizing === 'border-box' ? 0 : bt + bb + pt + pb);
    return {style, rect, bl, br, bt, bb, pl, pr, pt, pb,
      sx: bw > 0 ? rect.width / bw : 1, sy: bh > 0 ? rect.height / bh : 1};
  };
  const offset = (token, free, axis) => {
    if (token === 'center') return free / 2;
    if (token === (axis === 'x' ? 'left' : 'top')) return 0;
    if (token === (axis === 'x' ? 'right' : 'bottom')) return free;
    if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)%$/.test(token)) return free * parseFloat(token) / 100;
    if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)px$/.test(token) || token === '0') return parseFloat(token);
    return NaN;
  };
  const update = () => {
    if (!img.complete || !img.naturalWidth || !img.naturalHeight) { hide('image-not-ready'); return; }
    if (new URL(img.currentSrc || img.src, document.baseURI).href !== expected) {
      hide('changed-source'); return;
    }
    const image = box(img), parent = box(wrap);
    if (!(image.sx > 0 && image.sy > 0 && parent.sx > 0 && parent.sy > 0)) {
      hide('empty-image'); return;
    }
    const cw = image.rect.width / image.sx - image.bl - image.br - image.pl - image.pr;
    const ch = image.rect.height / image.sy - image.bt - image.bb - image.pt - image.pb;
    if (!(cw > 0 && ch > 0)) { hide('empty-image'); return; }
    let rw = cw, rh = ch;
    const fit = image.style.objectFit;
    if (fit !== 'fill') {
      let scale;
      if (fit === 'contain') scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      else if (fit === 'cover') scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      else if (fit === 'none') scale = 1;
      else if (fit === 'scale-down') scale = Math.min(1, cw / img.naturalWidth, ch / img.naturalHeight);
      else { hide('unsupported-fit'); return; }
      rw = img.naturalWidth * scale; rh = img.naturalHeight * scale;
    }
    let position = image.style.objectPosition.trim().split(/\s+/);
    if (position.length === 1) position.push('50%');
    if (position.length !== 2) { hide('unsupported-position'); return; }
    if (/^(top|bottom)$/.test(position[0]) || /^(left|right)$/.test(position[1])) position.reverse();
    const ox = offset(position[0], cw - rw, 'x'), oy = offset(position[1], ch - rh, 'y');
    if (!Number.isFinite(ox) || !Number.isFinite(oy)) { hide('unsupported-position'); return; }
    const sx = image.sx / parent.sx, sy = image.sy / parent.sy;
    const left = (image.rect.left - parent.rect.left) / parent.sx - parent.bl + (image.bl + image.pl) * sx;
    const top = (image.rect.top - parent.rect.top) / parent.sy - parent.bt + (image.bt + image.pt) * sy;
    dots.forEach(dot => {
      const [x, y, w, h] = dot.dataset.ctDotXywh.split(' ').map(Number);
      const dx = ox + x * rw, dy = oy + y * rh, dw = w * rw, dh = h * rh;
      // cover/none 可能裁掉原点；不把裁掉的点移到边上，也不放大。
      if (dx < -0.001 || dy < -0.001 || dx + dw > cw + 0.001 || dy + dh > ch + 0.001) {
        dot.style.display = 'none'; dot.dataset.ctDotPlacement = 'clipped';
        dot.dataset.incomplete = '卡头图内透明点：' + reasons.clipped + '，该点不能量。'; return;
      }
      Object.assign(dot.style, {left: `${left + dx * sx}px`, top: `${top + dy * sy}px`,
        width: `${dw * sx}px`, height: `${dh * sy}px`, display: 'block'});
      const measurable = dw * image.sx > 1 && dh * image.sy > 1;
      dot.dataset.ctDotPlacement = measurable ? 'ready' : 'subpixel';
      if (measurable) delete dot.dataset.incomplete;
      else dot.dataset.incomplete = '卡头图内透明点：实际矩形至少一边小于或等于1px，该点不能量；未放大。';
    });
  };
  img.addEventListener('load', update);
  img.addEventListener('error', () => hide('image-error'));
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(update); observer.observe(img); observer.observe(wrap);
  }
  if (window.MutationObserver) {
    new MutationObserver(update).observe(img, {attributes: true, attributeFilter: ['src', 'srcset', 'style', 'class']});
  }
  window.addEventListener('resize', update);
  update(); requestAnimationFrame(update);
})();
"""


def render_header_icon_motion_dots(header_url, payload, ctx):
    """接受 {asset_sha256: 64hex, dots: [[x,y,w,h], ...]}，无效则保留默认。

    None、False、"none" 不启用；显式错误报告 composition。调用者负责
    首卡唯一原标题及图位归属，本函数只检验该图位的实际文件和坐标。
    """
    if payload is None or payload is False or payload == "none":
        return ""
    if not isinstance(payload, dict):
        _unfinished(ctx, "header_icon_motion_dots 须为声明指纹和图内 xywh 的对象")
        return ""
    digest = payload.get("asset_sha256")
    if not isinstance(digest, str) or re.fullmatch(r"[0-9a-fA-F]{64}", digest) is None:
        _unfinished(ctx, "asset_sha256 须为完整64位十六进制SHA-256")
        return ""
    dots = _rectangles(payload)
    if dots is None:
        _unfinished(ctx, "dots 须为非空归一化xywh列表，有限数值、正尺寸且完整位于图内")
        return ""
    path = _local_asset_path(header_url)
    if path is None:
        _unfinished(ctx, "实际卡头缺可读本机图位URL")
        return ""
    try:
        with path.open("rb") as source:
            actual = hashlib.file_digest(source, "sha256").hexdigest()
    except (OSError, ValueError):
        _unfinished(ctx, "实际卡头图文件不可读")
        return ""
    if actual != digest.lower():
        _unfinished(ctx, f"实际图指纹为{actual}，与声明的{digest.lower()}不同，旧坐标不可套用")
        return ""
    markers = []
    for rect in dots:
        xywh = " ".join(format(value, ".15g") for value in rect)
        markers.append('<span class="ct-header-icon-motion-dot" data-role="status-dot" '
                       f'data-ct-dot-xywh="{xywh}" data-ct-dot-asset-sha256="{actual}" '
                       'aria-hidden="true" data-incomplete="卡头图内透明点尚未完成浏览器定位。" '
                       'style="display:none;position:absolute;opacity:0;'
                       'background:transparent;border:0;box-shadow:none;border-radius:50%;'
                       'margin:0;padding:0;min-width:0;min-height:0;pointer-events:none"></span>')
    return "".join(markers) + '<script data-echo data-ct-dot-source="' + escape(header_url, quote=True) + '">' + _POSITION_SCRIPT + '</script>'

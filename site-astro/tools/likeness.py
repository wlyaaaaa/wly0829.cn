"""“像不像”分数：同一段的现在截图和新版截图（同宽）比三样，合成 0—1 的分。
- ssim：缩到 200 宽的灰度图、轻微模糊（σ=1，抹掉缩放和字体抗锯齿带来的一两个像素差）后做结构相似度（高斯窗，常用参数）；
- iou：各块的位置和大小：非白像素模糊成“块”以后，两边块区域的重合度（交并比）；
- height：两边高度比（矮的 / 高的）。
分数 = 0.5×ssim + 0.3×iou + 0.2×height。门槛用主持判为“同等”的段校准（见 calibrate_likeness.py）。"""
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

W = 200
BLUR = 1.0


def _gray(im, w=W):
    im = im.convert("L")
    return np.asarray(im.resize((w, max(1, round(im.height * w / im.width))), Image.LANCZOS), dtype=float)


def _pad(a, h):
    if a.shape[0] >= h:
        return a[:h]
    return np.vstack([a, np.full((h - a.shape[0], a.shape[1]), 255.0)])


def ssim(a, b):
    c1, c2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    mu_a, mu_b = gaussian_filter(a, 1.5), gaussian_filter(b, 1.5)
    va = gaussian_filter(a * a, 1.5) - mu_a ** 2
    vb = gaussian_filter(b * b, 1.5) - mu_b ** 2
    cov = gaussian_filter(a * b, 1.5) - mu_a * mu_b
    m = ((2 * mu_a * mu_b + c1) * (2 * cov + c2)) / ((mu_a ** 2 + mu_b ** 2 + c1) * (va + vb + c2))
    return float(m.mean())


def blocks(a):
    return gaussian_filter((a < 235).astype(float), 3) > 0.08


def likeness(old, new):
    """old、new：PIL 图（同一段，宽度可不同，按宽度等比缩到同宽再比）。"""
    a, b = _gray(old), _gray(new)
    ha, hb = a.shape[0], b.shape[0]
    h = max(ha, hb)
    a, b = _pad(a, h), _pad(b, h)
    s = ssim(gaussian_filter(a, BLUR), gaussian_filter(b, BLUR))
    ma, mb = blocks(a), blocks(b)
    union = (ma | mb).sum()
    iou = float((ma & mb).sum() / union) if union else 1.0
    hr = min(ha, hb) / max(ha, hb)
    return {"score": round(0.5 * s + 0.3 * iou + 0.2 * hr, 4), "ssim": round(s, 4), "iou": round(iou, 4), "height": round(hr, 4)}

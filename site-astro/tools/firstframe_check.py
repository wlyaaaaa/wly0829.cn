"""动画接替静态图的机器验收：首次访问（全新浏览器、无缓存）和再次访问（同一浏览器刷新）× 电脑 1440 / 手机 390。
- 画布变为可见（is-live）那一刻读出第一帧，和同一位置的静态原图逐像素比；
- 记录引擎自己报告的“入场晕开”是否开启及原因；
- 列出插画区、动画层、小鸟和落叶上所有从不透明度 0 开始的动画。
用法：python tools/firstframe_check.py <输出json> <路径> [<路径> ...]"""
import json, sys
from playwright.sync_api import sync_playwright
out, paths = sys.argv[1], sys.argv[2:]
INIT = r"""
(() => {
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') attrs = Object.assign({}, attrs, { preserveDrawingBuffer: true });
    return orig.call(this, type, attrs);
  };
  window.__ff = null;
  const grab = (layer) => {
    if (window.__ff) return;
    const cv = layer.querySelector('canvas'); const fig = layer.parentElement; const img = fig && fig.querySelector('img');
    if (!cv || !img) return;
    const w = cv.width, h = cv.height;
    // 动画层只画会动的部分，其余透明、露出下面的静态图；所以“用户看到的第一帧”=静态图上叠画布
    const lr = layer.getBoundingClientRect(), ir = img.getBoundingClientRect();
    const sx = (lr.left - ir.left) / ir.width * img.naturalWidth, sy = (lr.top - ir.top) / ir.height * img.naturalHeight;
    const paintStatic = (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(img, sx, sy, lr.width / ir.width * img.naturalWidth, lr.height / ir.height * img.naturalHeight, 0, 0, w, h); };
    const a = document.createElement('canvas'); a.width = w; a.height = h; const ga = a.getContext('2d');
    paintStatic(ga); ga.drawImage(cv, 0, 0, w, h);
    const b = document.createElement('canvas'); b.width = w; b.height = h; const gb = b.getContext('2d');
    paintStatic(gb);
    const o = document.createElement('canvas'); o.width = w; o.height = h; const go = o.getContext('2d'); go.drawImage(cv, 0, 0, w, h);
    const O = go.getImageData(0, 0, w, h).data; let cover = 0; for (let i = 3; i < O.length; i += 4) if (O[i] > 8) cover++;
    const A = ga.getImageData(0, 0, w, h).data, B = gb.getImageData(0, 0, w, h).data;
    let sum = 0, n = 0, big = 0; const hist = [];
    for (let i = 0; i < A.length; i += 4) { const d = (Math.abs(A[i]-B[i]) + Math.abs(A[i+1]-B[i+1]) + Math.abs(A[i+2]-B[i+2])) / 3; sum += d; n++; if (d > 24) big++; }
    const blankA = (() => { let s = 0; for (let i = 0; i < A.length; i += 4) s += (A[i] + A[i+1] + A[i+2]) / 3 > 250 ? 1 : 0; return s / n; })();
    const blankB = (() => { let s = 0; for (let i = 0; i < B.length; i += 4) s += (B[i] + B[i+1] + B[i+2]) / 3 > 250 ? 1 : 0; return s / n; })();
    window.__ffimg = [a.toDataURL(), b.toDataURL()];
    window.__ff = { t: performance.now(), size: [w, h], canvas_coverage: +(cover / (w * h)).toFixed(4), mean_abs_diff: +(sum / n).toFixed(2), pixels_over_24: +(big / n).toFixed(4), white_seen: +blankA.toFixed(4), white_static: +blankB.toFixed(4),
      img_complete_at_live: img.complete && img.naturalWidth > 0 };
  };
  new MutationObserver((recs) => { for (const r of recs) { const t = r.target; if (t.classList && t.classList.contains('living-layer') && t.classList.contains('is-live')) grab(t); } })
    .observe(document, { subtree: true, attributes: true, attributeFilter: ['class'] });
})();
"""
FADES = r"""
(() => {
  const rows = [];
  for (const a of document.getAnimations()) {
    const eff = a.effect; if (!eff || !eff.getKeyframes) continue;
    const k = eff.getKeyframes(); const t = eff.target; if (!t) continue;
    const inArt = t.closest && (t.closest('.chapter-art') || t.closest('.living-layer') || t.closest('.easter-bird') || (t.className && String(t.className).includes('bird')));
    if (!inArt) continue;
    if (k.length && k[0].opacity !== undefined && Number(k[0].opacity) === 0) rows.push({ target: t.className || t.tagName, name: a.animationName || a.id || '' });
  }
  for (const el of document.querySelectorAll('.chapter-art img, .living-layer, .living-layer canvas')) {
    const cs = getComputedStyle(el); if (cs.transitionProperty.includes('opacity') && cs.transitionDuration !== '0s') rows.push({ target: el.className || el.tagName, transition: cs.transitionDuration });
  }
  return rows;
})()
"""
res = []
with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    for path in paths:
        for label, vp, mobile in (("电脑1440", {"width": 1440, "height": 900}, False), ("手机390", {"width": 390, "height": 844}, True)):
            ctx = b.new_context(viewport=vp, is_mobile=mobile, has_touch=mobile, device_scale_factor=1)
            ctx.add_init_script(INIT)
            pg = ctx.new_page()
            for visit in ("首次访问", "再次访问"):
                if visit == "首次访问":
                    pg.goto("http://127.0.0.1:4391" + path, wait_until="load")
                else:
                    pg.reload(wait_until="load")
                try:
                    pg.wait_for_function("window.__ff", timeout=15000)
                except Exception:
                    pass
                pg.wait_for_timeout(2500)
                diag = pg.evaluate("window.pageLiving ? window.pageLiving.diagnostics() : null")
                row = {"page": path, "device": label, "visit": visit, "first_frame": pg.evaluate("window.__ff"),
                       "intro": diag and diag.get("intro"), "phase": diag and diag.get("phase"), "bird": diag and diag.get("bird"),
                       "fades_from_zero": pg.evaluate(FADES)}
                res.append(row); print(json.dumps(row, ensure_ascii=False))
                imgs = pg.evaluate("window.__ffimg")
                if imgs and len(sys.argv) and __import__('os').environ.get('FF_DUMP'):
                    import base64
                    for k, u in zip(("canvas", "static"), imgs):
                        open(__import__('os').environ['FF_DUMP'] + f"-{label}-{visit}-{k}.png".replace("电脑", "pc").replace("手机", "m").replace("首次访问", "cold").replace("再次访问", "warm"), "wb").write(base64.b64decode(u.split(",", 1)[1]))
            ctx.close()
    b.close()
json.dump(res, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

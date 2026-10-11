/* 新版页面的环境动画挂载（源文件；tools/render_blocks.py 每次生成时复制到 public/_living/）：引擎 living.js 原样，只把“画在哪张图上”从整屏 PNG 改成插画：宿主在画布外、和画布里那张插画同位置同大小（画布整体缩放，宿主不缩放）。
   减少动态效果：引擎自己读系统设置（living.css 也会隐藏画布），这里不另加判断。 */
(() => {
  'use strict';
  let live = null, pending = false, paused = false, epoch = 0, waiting = null, interacted = false;
  const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  function reveal(el) {
    for (const im of el.matches('[data-ts-src]') ? [el] : el.querySelectorAll('[data-ts-src]')) {
      const src = im.dataset.tsSrc;
      if (!src) continue;
      if (im instanceof HTMLImageElement) { im.loading = 'eager'; im.fetchPriority = 'high'; if (src.startsWith('/')) im.crossOrigin = 'anonymous'; im.src = src; }
      else im.setAttribute('href', src);
      delete im.dataset.tsSrc;
    }
  }
  const near = new IntersectionObserver(rows => {
    for (const row of rows) if (row.isIntersecting) { reveal(row.target); near.unobserve(row.target); }
    mount();
  });
  function start() {
    for (const im of document.querySelectorAll('[data-ts-src]')) {
      const el = im instanceof HTMLImageElement ? im : im.closest('svg');
      if (visible(el)) reveal(el); else near.observe(el);
    }
    // 首屏插画真正可读后再开始纹理和鸟图集；不在视口的插画等滚到它再启动。
    for (const fig of document.querySelectorAll('figure[data-living-config]')) artNear.observe(fig);
    mount();
  }
  const artNear = new IntersectionObserver(() => mount());
  function mount() {
    // 电脑画布、手机画布里各有一张插画（只显示其中一张）：两张都交给引擎，引擎按窗口宽度选
    const h = document.querySelector('.ts-h figure[data-living-config]'), v = document.querySelector('.ts-v figure[data-living-config]');
    const fig = h || v || document.querySelector('figure[data-living-config]');
    const shown = innerWidth < 768 ? (v || h || fig) : (h || fig);
    if (!fig || !window.LivingArt || live || pending || paused || !visible(shown)) return;
    const im = shown.querySelector('img');
    if (!im?.complete || !im.naturalWidth) { im?.addEventListener('load', mount, { once: true }); return; }
    pending = true;
    const token = epoch;
    im.decode().catch(() => {}).then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      const run = () => {
        if (token !== epoch || !pending) return;
        waiting = null;
        pending = false;
        if (paused) return;
        if (!visible(shown)) { mount(); return; }
        live = window.pageLiving = window.LivingArt.mount(fig.closest('.ts-screen') || fig, { config: fig.dataset.livingConfig, parts: { h: h || fig, v: v || h || fig } });
        for (const f of [h, v, fig]) if (f) f.dataset.livingStatus = 'mounted';
      };
      // 静图已显示后，在浏览器空闲时开始；交互可以直接提前，不额外等待。
      waiting = run;
      if (!interacted && 'requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1000 }); else run();
    })));
  }
  const wake = () => { interacted = true; if (waiting && !paused) waiting(); };
  for (const event of ['scroll', 'pointerdown', 'keydown']) addEventListener(event, wake, { passive: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
  addEventListener('load', mount, { once: true });
  addEventListener('pagehide', () => { paused = true; pending = false; epoch++; waiting = null; if (live) { live.destroy(); live = null; delete window.pageLiving; } });
  addEventListener('pageshow', (e) => { if (e.persisted) { paused = false; interacted = true; mount(); } });
})();

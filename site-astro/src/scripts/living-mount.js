/* 新版页面的环境动画挂载（源文件；tools/render_blocks.py 每次生成时复制到 public/_living/）：引擎 living.js 原样，只把“画在哪张图上”从整屏 PNG 改成插画：宿主在画布外、和画布里那张插画同位置同大小（画布整体缩放，宿主不缩放）。
   减少动态效果：引擎自己读系统设置（living.css 也会隐藏画布），这里不另加判断。 */
(() => {
  'use strict';
  let live = null;
  function mount() {
    // 电脑画布、手机画布里各有一张插画（只显示其中一张）：两张都交给引擎，引擎按窗口宽度选
    const h = document.querySelector('.ts-h figure[data-living-config]'), v = document.querySelector('.ts-v figure[data-living-config]');
    const fig = h || v || document.querySelector('figure[data-living-config]');
    if (!fig || !window.LivingArt || live) return;
    live = window.pageLiving = window.LivingArt.mount(fig.closest('.ts-screen') || fig, { config: fig.dataset.livingConfig, parts: { h: h || fig, v: v || h || fig } });
    for (const f of [h, v, fig]) if (f) f.dataset.livingStatus = 'mounted';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
  addEventListener('pagehide', () => { if (live) { live.destroy(); live = null; delete window.pageLiving; } });
  addEventListener('pageshow', (e) => { if (e.persisted) mount(); });
})();

/* 首屏活画：布局和热区仍由网站原有脚本管理。 */
(() => {
  'use strict';
  let current = null;
  let revision = 0;
  let layoutObserver = null;
  let layoutDeadline = 0;
  let layoutCheckFrame = 0;
  let layoutCorrectionAttempts = 0;

  function destroy() {
    revision++;
    layoutObserver?.disconnect();
    layoutObserver = null;
    clearTimeout(layoutDeadline);
    layoutDeadline = 0;
    cancelAnimationFrame(layoutCheckFrame);
    layoutCheckFrame = 0;
    layoutCorrectionAttempts = 0;
    if (current) current.destroy();
    if (window.pageLiving === current) delete window.pageLiving;
    current = null;
  }

  function mount() {
    destroy();
    const ticket = revision;
    const first = document.querySelector('.typeset-screen');
    if (!first?.dataset.livingConfig || !window.LivingArt) return;
    const parts = {};
    let binding;
    try { binding = JSON.parse(first.dataset.livingBinding); } catch { return; }
    for (const orientation of ['h', 'v']) {
      const part = first.querySelector(`.typeset-part[data-living-first="${orientation}"]`);
      const image = part?.querySelector('picture img');
      const expected = binding[orientation];
      const actual = part?._layout;
      if (!part || !image || !expected || !actual ||
          actual.orientation !== orientation ||
          JSON.stringify(actual.size) !== JSON.stringify(expected.size) ||
          new URL(actual.src, document.baseURI).href !== new URL(expected.src, document.baseURI).href ||
          new URL(image.dataset.src || image.getAttribute('src'), document.baseURI).href !== new URL(expected.src, document.baseURI).href) {
        first.dataset.livingStatus = 'page-binding-mismatch';
        return;
      }
      parts[orientation] = part;
    }
    if (ticket !== revision) return;
    // 不强制 intro：引擎判断原图是否已经呈现，晚挂载直接活起来。
    current = window.pageLiving = window.LivingArt.mount(first, {
      config: first.dataset.livingConfig,
      parts,
    });
    first.dataset.livingStatus = 'mounted';
  }

  function afterLayout() {
    const ticket = revision;
    const first = document.querySelector('.typeset-screen');
    if (!first?.dataset.livingConfig) return;
    const attempt = () => {
      if (ticket !== revision) return;
      const parts = ['h', 'v'].map(o => first.querySelector(`.typeset-part[data-living-first="${o}"]`));
      if (!window.LivingArt || parts.some(part => !part?._layout)) return;
      layoutObserver?.disconnect();
      clearTimeout(layoutDeadline);
      layoutObserver = null;
      layoutDeadline = 0;
      mount();
    };
    first.dataset.livingStatus = 'waiting-layout';
    layoutObserver = new MutationObserver(attempt);
    layoutObserver.observe(first, { subtree: true, attributes: true, attributeFilter: ['hidden', 'data-active'] });
    layoutDeadline = setTimeout(() => {
      layoutObserver?.disconnect();
      layoutObserver = null;
      layoutDeadline = 0;
      if (ticket === revision && !current) first.dataset.livingStatus = 'layout-not-ready';
    }, 30000);
    requestAnimationFrame(() => requestAnimationFrame(attempt));
    addEventListener('load', attempt, { once: true });
  }

  function checkSettledLayout() {
    if (!current) return;
    const ticket = revision;
    cancelAnimationFrame(layoutCheckFrame);
    layoutCheckFrame = requestAnimationFrame(() => {
      layoutCheckFrame = requestAnimationFrame(() => {
        layoutCheckFrame = 0;
        if (ticket !== revision || !current) return;
        const first = document.querySelector('.typeset-screen');
        const orientation = innerWidth < 768 ? 'v' : 'h';
        const part = first?.querySelector(`.typeset-part[data-living-first="${orientation}"]`);
        if (!part || !part.hidden) { layoutCorrectionAttempts = 0; return; }
        // 手机转屏可能先派发旧布局宽度的resize，随后才恢复真实宽度。
        // 只转给原网站resize入口，原热区、阅读位置和分片显隐仍由它处理。
        if (++layoutCorrectionAttempts <= 2) dispatchEvent(new Event('resize'));
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afterLayout, { once: true });
  else afterLayout();
  addEventListener('pagehide', destroy);
  addEventListener('pageshow', event => { if (event.persisted) afterLayout(); });
  addEventListener('resize', checkSettledLayout);
  visualViewport?.addEventListener('resize', checkSettledLayout);
  document.addEventListener('site-layout', checkSettledLayout);
  // leave() 留给翻页负责人在其确定的转场位置 await；这里不拦截链接。
})();

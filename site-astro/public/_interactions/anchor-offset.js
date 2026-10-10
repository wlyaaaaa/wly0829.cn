(() => {
  const root = document.documentElement, observed = new WeakSet();
  const restoring = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  const observer = new ResizeObserver(() => measure());
  function measure() {
    let bottom = 0;
    for (const bar of document.querySelectorAll('#site-header, nav.toc, .cp-bar')) {
      if (!observed.has(bar)) { observed.add(bar); observer.observe(bar); }
      const rect = bar.getBoundingClientRect(), position = getComputedStyle(bar).position;
      if (rect.height && ['fixed', 'sticky'].includes(position)) bottom = Math.max(bottom, rect.bottom);
    }
    const offset = Math.ceil(bottom + 16);
    root.style.setProperty('--fixed-anchor-offset', offset + 'px');
    return offset;
  }
  function align(hash = location.hash) {
    if (!hash) return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    // 锚点所在屏直接稳定落位，进场位移不能在跳转后把标题移回固定栏下面。
    const screen = target?.closest('.ts-screen');
    if (screen) { screen.dataset.seen = '1'; screen.classList.remove('ts-entering'); }
    if (target?.getClientRects().length) scrollTo({ top: Math.max(0, scrollY + target.getBoundingClientRect().top - measure()), behavior: 'instant' });
  }
  let jump = 0, initialCancelled = false;
  function afterLayout() {
    const hash = location.hash, revision = ++jump;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (revision === jump && location.hash === hash) align(hash);
    }));
  }
  const initialLayout = () => restoring || initialCancelled ? measure() : afterLayout();
  addEventListener('hashchange', afterLayout);
  addEventListener('pageshow', event => { if (event.persisted) { jump++; measure(); } else initialLayout(); });
  addEventListener('load', initialLayout);
  addEventListener('resize', measure);
  document.addEventListener('site-layout', measure);
  document.addEventListener('site-live-layout', measure);
  for (const event of ['wheel', 'touchmove']) addEventListener(event, () => { initialCancelled = true; jump++; }, { passive: true });
  document.fonts.ready.then(initialLayout);
  measure();
})();

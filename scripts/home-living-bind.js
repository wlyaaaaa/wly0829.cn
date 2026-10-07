/* 首页活画只订阅 SiteStatus 的既有读取；不创建 reader、轮询或存储。 */
(() => {
  'use strict';
  const page = JSON.parse(document.querySelector('#page-data').textContent);
  if (page.home_living !== true || page.page !== 'home') return;
  const container = document.querySelector('#home-01');
  const image = container?.querySelector('picture img');
  if (!container || !image || !window.HeroLive) return;
  image.__heroNativePlates = {landscape: page.screens[0].layouts.h.viewer.avif, portrait: page.screens[0].layouts.v.viewer.avif};
  const initial = {state: 'off', title: '暂时读不到电脑', detail: '还没读到电脑状态'};
  const hero = window.HeroLive.mount(container, {plateImage: image, status: initial, intro: false});
  // 原图已经完整显示，初次接管和转方向都保持文字、按钮完整。
  // 新方向仍等待实际画层就绪再显示，不开启改变正式文案的 preview 模式。
  let visibleLayer = null, pendingLayer = null, orientationSkips = 0, waitFrame = 0, showFrame = 0, showingLayer = null;
  const revealLayer = layer => {
    if (showFrame && showingLayer === layer) return;
    if (showFrame) cancelAnimationFrame(showFrame);
    showingLayer = layer;
    showFrame = requestAnimationFrame(() => {
      showFrame = 0; showingLayer = null;
      if (layer.isConnected && visibleLayer === layer) layer.style.visibility = '';
    });
  };
  const continueScene = () => {
    const layer = container.querySelector('.hero-live-layer');
    if (!layer) return;
    if (layer === visibleLayer) {
      if (layer.style.visibility === 'hidden' && hero.diagnostics().phase !== 'loading') revealLayer(layer);
      return;
    }
    if (!visibleLayer) { visibleLayer = layer; return; }
    if (pendingLayer !== layer) { pendingLayer = layer; layer.style.visibility = 'hidden'; }
    if (!layer.classList.contains('is-ready') || hero.diagnostics().phase === 'loading') {
      if (!waitFrame) waitFrame = requestAnimationFrame(() => { waitFrame = 0; continueScene(); });
      return;
    }
    visibleLayer = layer; pendingLayer = null; orientationSkips++;
    // 引擎接管后的画面已完整；下一帧显示新方向的图层。
    revealLayer(layer);
  };
  const scenes = new MutationObserver(continueScene);
  scenes.observe(container, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
  continueScene();
  addEventListener('pagehide', () => {
    scenes.disconnect();
    if (waitFrame) cancelAnimationFrame(waitFrame);
    if (showFrame) cancelAnimationFrame(showFrame);
    waitFrame = showFrame = 0; showingLayer = null;
  });
  addEventListener('pageshow', () => {
    scenes.observe(container, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
    continueScene();
  });
  const update = snapshot => {
    if (snapshot?.overall) {
      const full = snapshot.overall, lead = full.detail.split(/[，；。]/)[0];
      window.HeroLive.setStatus({...full, detail: lead + '；详情见驾驶舱'});
      container.querySelector('[data-hl="s2"]')?.setAttribute('title', full.detail);
    }
  };
  document.addEventListener('site-status', event => update(event.detail));
  update(window.SiteStatus?.snapshot?.());
  window.HomeLiving = Object.freeze({ready: hero.ready.then(() => true), diagnostics: () => ({...hero.diagnostics(), orientationSkips})});
})();

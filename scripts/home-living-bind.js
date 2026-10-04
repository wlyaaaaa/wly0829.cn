/* 首页活画只订阅 SiteStatus 的既有读取；不创建 reader、轮询或存储。 */
(() => {
  'use strict';
  const page = JSON.parse(document.querySelector('#page-data').textContent);
  if (page.home_living !== true || page.page !== 'home') return;
  const container = document.querySelector('#home-01');
  const image = container?.querySelector('picture img');
  if (!container || !image || !window.HeroLive) return;
  const initial = {state: 'off', title: '暂时读不到电脑', detail: '还没读到电脑状态'};
  const hero = window.HeroLive.mount(container, {plateImage: image, status: initial});
  // 原包转方向会重建 scene。首层按原编排开场，后续层只沿用原包
  // “点画面跳过开场”的入口，不启用会改变正式文案的 preview 模式。
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
    // 事件目标是本件容器，坐标位于画外；不会命中链接或鸟。
    container.dispatchEvent(new MouseEvent('click', {clientX: -10000, clientY: -10000}));
    visibleLayer = layer; pendingLayer = null; orientationSkips++;
    // 引擎已先安排下一帧；等它画出开场后的状态，再显示这个新层。
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
    if (snapshot?.overall) window.HeroLive.setStatus(snapshot.overall);
  };
  document.addEventListener('site-status', event => update(event.detail));
  update(window.SiteStatus?.snapshot?.());
  window.HomeLiving = Object.freeze({ready: hero.ready.then(() => true), diagnostics: () => ({...hero.diagnostics(), orientationSkips})});
})();

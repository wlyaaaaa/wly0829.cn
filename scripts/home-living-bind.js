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
  const update = snapshot => {
    if (snapshot?.overall) window.HeroLive.setStatus(snapshot.overall);
  };
  document.addEventListener('site-status', event => update(event.detail));
  update(window.SiteStatus?.snapshot?.());
  window.HomeLiving = Object.freeze({ready: hero.ready.then(() => true), diagnostics: () => hero.diagnostics()});
})();

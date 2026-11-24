// 当前窗口独立选公开版；设备配对与操作权限保持原样。
// 本人 11-24 禁令：公开版和本人版是同一套页面、同一套按钮，按权限给各自内容。访客也看到这颗切换按钮，
// 点了弹全站现成的“这台设备还不是可信设备”（trust-modal.js），不切换；本人照旧能切。
// 本人 11-24 15:30（M735）：按钮放进页眉，右边第一颗（“几点读到”左边）。只有实况各页和规则页分公开版、本人版，
// 也只有这两处加载本文件，所以别的页面没有这颗按钮。
(() => {
  'use strict';
  const key = 'wly-live-view', site = /(^|\.)wly0829\.cn$/i.test(location.hostname);
  let publicView = sessionStorage.getItem(key) === 'public', owner = false, invalid = false, known = false, button;
  // 实况各页等第一份回包认清是不是本人再画，免得本人先看到一下访客的字；
  // 没有实况数据的页（规则页）在没配对过的设备上直接按访客画，配对过的等规则页读完本人稿再画。
  const paired = () => { try { return /^[A-Za-z0-9_-]{43}$/.test(localStorage.getItem('wly-cockpit-device') || ''); } catch { return false; } };
  function render() {
    if (!publicView && !owner && !invalid && !known) return;
    const group = document.querySelector('#topbar .topbar__group--right');
    if (!group) return;
    if (!button) {
      button = document.createElement('button'); button.id = 'wly-preview-view'; button.type = 'button';
      button.className = 'pill live-view-pill';
      button.onclick = () => {
        // 看本人版只有可信设备能做：不是本人（访客、配对已失效）就弹现成的说明框，不切换
        if (!publicView && !owner) return void window.TrustModal?.show();
        sessionStorage.setItem(key, publicView ? 'owner' : 'public');
        location.reload();
      };
    }
    if (group.firstElementChild !== button) group.prepend(button);   // 实况页后加的“几点读到”“问情况”排在它右边
    button.textContent = publicView ? '公开版 · 回本人版' : invalid ? '公开版 · 配对已失效' : owner ? '本人版 · 看公开版' : '公开版 · 看本人版';
  }
  window.LiveView = {
    isPublic: () => publicView,
    headers: token => ({ ...(!site ? { 'X-Wly-View': publicView ? 'public' : 'owner' } : {}),
      ...(!publicView && token ? { 'X-Cockpit-Device': token } : {}) }),
    owner: viewer => {
      known = true;
      if (viewer?.device === 'invalid') { invalid = true; owner = false; }
      if (viewer?.kind === 'owner') { invalid = false; owner = true; }
      render();
    }
  };
  const start = () => { if (!window.Live && !paired()) known = true; render(); };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();

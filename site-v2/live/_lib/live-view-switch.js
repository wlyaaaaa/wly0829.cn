// 当前窗口独立选公开版；设备配对与操作权限保持原样。
// 本人 11-24 禁令：公开版和本人版是同一套页面、同一套按钮，按权限给各自内容。访客也看到这颗切换按钮，
// 点了弹全站现成的“这台设备还不是可信设备”（trust-modal.js），不切换；本人照旧能切。
(() => {
  'use strict';
  const key = 'wly-live-view', site = /(^|\.)wly0829\.cn$/i.test(location.hostname);
  let publicView = sessionStorage.getItem(key) === 'public', owner = false, invalid = false, known = false, button;
  // 实况各页等第一份回包认清是不是本人再画，免得本人先看到一下访客的字；
  // 没有实况数据的页（规则页）在没配对过的设备上直接按访客画，配对过的等规则页读完本人稿再画。
  const paired = () => { try { return /^[A-Za-z0-9_-]{43}$/.test(localStorage.getItem('wly-cockpit-device') || ''); } catch { return false; } };
  function place() {
    const back = document.querySelector?.('main a.back'), stage = document.querySelector?.('#stage, main.stage');
    const anchor = back || (/^\/live\/?$/.test(location.pathname) && (stage?.querySelector(':scope > .live-conn') || stage?.querySelector('#notices')))
      || (/^\/computer-access\/?$/.test(location.pathname) && stage?.querySelector('.cells'));
    if (!anchor) return;
    const row = document.createElement('div'); row.dataset.liveViewRow = '';
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:30px;margin-bottom:12px';
    anchor.before(row);
    if (back) { back.style.marginBottom = '0'; row.append(back); }
    else row.style.justifyContent = 'flex-end';
    button.style.position = 'static'; button.style.zIndex = 'auto'; row.append(button);
  }
  function render() {
    if (!publicView && !owner && !invalid && !known) return;
    if (!button) {
      button = document.createElement('button'); button.id = 'wly-preview-view'; button.type = 'button';
      button.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:2147483647;padding:6px 12px;border-radius:999px;font:12px/1.5 sans-serif;color:#555;background:rgba(255,255,255,.85);border:1px solid rgba(0,0,0,.08);box-shadow:0 2px 8px rgba(0,0,0,.06);cursor:pointer';
      button.onclick = () => {
        // 看本人版只有可信设备能做：不是本人（访客、配对已失效）就弹现成的说明框，不切换
        if (!publicView && !owner) return void window.TrustModal?.show();
        sessionStorage.setItem(key, publicView ? 'owner' : 'public');
        location.reload();
      };
      document.body.append(button);
      place();
    }
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

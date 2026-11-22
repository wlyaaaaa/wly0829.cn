// 当前窗口独立选公开版；设备配对与操作权限保持原样。
(() => {
  'use strict';
  const key = 'wly-live-view', site = /(^|\.)wly0829\.cn$/i.test(location.hostname);
  let publicView = sessionStorage.getItem(key) === 'public', owner = false, invalid = false, button;
  function place() {
    const back = document.querySelector?.('main a.back'), stage = document.querySelector?.('#stage, main.stage');
    const anchor = back || (/^\/live\/?$/.test(location.pathname) && stage?.querySelector('#notices'))
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
    if (!publicView && !owner && !invalid) return;
    if (!button) {
      button = document.createElement('button'); button.id = 'wly-preview-view'; button.type = 'button';
      button.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:2147483647;padding:6px 12px;border-radius:999px;font:12px/1.5 sans-serif;color:#555;background:rgba(255,255,255,.85);border:1px solid rgba(0,0,0,.08);box-shadow:0 2px 8px rgba(0,0,0,.06);cursor:pointer';
      button.onclick = () => {
        sessionStorage.setItem(key, publicView ? 'owner' : 'public');
        location.reload();
      };
      document.body.append(button);
      place();
    }
    button.textContent = publicView ? '公开版 · 回本人版' : invalid ? '公开版 · 配对已失效' : '本人版 · 看公开版';
  }
  window.LiveView = {
    isPublic: () => publicView,
    headers: token => ({ ...(!site ? { 'X-Wly-View': publicView ? 'public' : 'owner' } : {}),
      ...(!publicView && token ? { 'X-Cockpit-Device': token } : {}) }),
    owner: viewer => {
      if (viewer?.device === 'invalid') { invalid = true; owner = false; }
      if (viewer?.kind === 'owner') { invalid = false; owner = true; }
      render();
    }
  };
  render();
})();

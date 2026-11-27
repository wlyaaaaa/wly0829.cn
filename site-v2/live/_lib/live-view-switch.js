// 当前窗口独立选公开版；设备配对与操作权限保持原样。
// 本人 11-24 禁令：公开版和本人版是同一套页面、同一套按钮，按权限给各自内容。访客也看到这颗切换按钮，
// 点了弹全站现成的“这台设备还不是可信设备”（trust-modal.js），不切换；本人照旧能切。
// 本人 11-24 15:30（M735）：按钮放进页眉，右边第一颗（“几点读到”左边）。只有实况各页和规则页分公开版、本人版，
// 也只有这两处加载本文件，所以别的页面没有这颗按钮。
// 本人 11-28 01:17（M1151）：字只写要去的那一版（本人版上写“公开版”，公开版上写“本人版”），左边一个切换图标；
// 点一下图标像刷新那样转起来，切过去，切完停下。图标是两道首尾相追的箭头（一黑一绿），不跟页眉“几点读到”那颗单箭头刷新图标同一个。
(() => {
  'use strict';
  const key = 'wly-live-view', site = /(^|\.)wly0829\.cn$/i.test(location.hostname);
  let publicView = sessionStorage.getItem(key) === 'public', owner = false, invalid = false, known = false, button, label;
  // 切换是整页重载：点下去先转半圈再重载，点的时刻记在 sessionStorage。实况各页等这一版的第一份结果到了（认清是不是本人）
  // 才把按钮画出来，和“几点读到”同时出现，免得先画在右边、等“几点读到”有了字再往左跳；画出来时接着转（角度从点下去那一刻算，不跳），
  // 至少再转半圈、停在整圈。一直等不到结果的，8 秒后照样画出来停下。规则页没有实况数据，新页面一出来就画。
  const RESUME = 'wly-live-view-switch-at', TURN = 900;
  let spinning = (() => { try { const at = Number(sessionStorage.getItem(RESUME)); sessionStorage.removeItem(RESUME); return at && Date.now() - at < 20000 ? at : 0; } catch { return 0; } })();
  let stopping = 0, waited = false;
  const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="2.25" stroke-linecap="round">'
    + '<g stroke="currentColor" fill="currentColor"><path d="M4.95 14.57A7.5 7.5 0 0 1 16.4 5.9" fill="none"/><path d="M18.5 7.4 14.3 7.7 17.5 3.4Z" stroke-width=".8" stroke-linejoin="round"/></g>'
    + '<g stroke="#00a650" fill="#00a650" transform="rotate(180 12 12)"><path d="M4.95 14.57A7.5 7.5 0 0 1 16.4 5.9" fill="none"/><path d="M18.5 7.4 14.3 7.7 17.5 3.4Z" stroke-width=".8" stroke-linejoin="round"/></g></svg>';
  const style = document.createElement('style');
  style.textContent = '#wly-preview-view{gap:6px}#wly-preview-view svg{display:block;flex:none;width:16px;height:16px}'
    + `#wly-preview-view.is-switching svg{animation:wly-view-turn ${TURN}ms cubic-bezier(.45,.1,.45,.9) var(--wly-view-at,0ms) infinite}`
    + '@keyframes wly-view-turn{to{transform:rotate(1turn)}}';
  document.head.append(style);
  // 第一份结果到了：至少再转半圈，停在整圈（像“几点读到”那颗一样不停在半路）
  function settle() {
    if (!spinning || stopping) return;
    const elapsed = Date.now() - spinning;
    stopping = setTimeout(() => { spinning = 0; button?.classList.remove('is-switching'); button?.removeAttribute('aria-busy'); }, Math.ceil((elapsed + TURN / 2) / TURN) * TURN - elapsed);
  }
  // 实况各页等第一份回包认清是不是本人再画，免得本人先看到一下访客的字；
  // 没有实况数据的页（规则页）在没配对过的设备上直接按访客画，配对过的等规则页读完本人稿再画。
  const paired = () => { try { return /^[A-Za-z0-9_-]{43}$/.test(localStorage.getItem('wly-cockpit-device') || ''); } catch { return false; } };
  function render() {
    if (!publicView && !owner && !invalid && !known) return;
    if (spinning && !known && !waited && window.Live) return;
    const group = document.querySelector('#topbar .topbar__group--right');
    if (!group) return;
    if (!button) {
      button = document.createElement('button'); button.id = 'wly-preview-view'; button.type = 'button';
      button.className = 'pill live-view-pill';
      // 实况页右边按钮多，1440 宽时这颗照普通的左右各 15 会贴上居中的站名；左右各收 3，站名照样居中、字和按钮隔开约 16
      button.style.paddingInline = '12px';
      button.innerHTML = ICON + '<span></span>'; label = button.lastChild;
      if (spinning) {
        button.classList.add('is-switching'); button.setAttribute('aria-busy', 'true');
        button.style.setProperty('--wly-view-at', `${-((Date.now() - spinning) % TURN)}ms`);
      }
      button.onclick = () => {
        if (spinning) return;
        // 看本人版只有可信设备能做：不是本人（访客、配对已失效）就弹现成的说明框，不切换、不转
        if (!publicView && !owner) return void window.TrustModal?.show();
        sessionStorage.setItem(key, publicView ? 'owner' : 'public');
        spinning = Date.now();
        try { sessionStorage.setItem(RESUME, String(spinning)); } catch { /* 记不下：新页面照常显示，只少接着转那一段 */ }
        button.style.setProperty('--wly-view-at', '0ms'); button.classList.add('is-switching'); button.setAttribute('aria-busy', 'true');
        setTimeout(() => location.reload(), TURN / 2);
      };
    }
    if (group.firstElementChild !== button) group.prepend(button);   // 实况页后加的“几点读到”“问情况”排在它右边
    // 字写点了去哪一版；配对失效的设备看不了本人版，直接写“配对已失效”（点了弹可信设备说明框）
    const [text, tip] = publicView ? ['本人版', '切回本人版']
      : invalid ? ['配对已失效', '这台设备的配对已失效，重新配对后才能看本人版']
      : owner ? ['公开版', '切到公开版，看访客看到的样子']
      : ['本人版', '本人版只有可信设备能看'];
    label.textContent = text; button.title = tip; button.setAttribute('aria-label', tip);
  }
  window.LiveView = {
    isPublic: () => publicView,
    headers: token => ({ ...(!site ? { 'X-Wly-View': publicView ? 'public' : 'owner' } : {}),
      ...(!publicView && token ? { 'X-Cockpit-Device': token } : {}) }),
    owner: viewer => {
      known = true;
      if (viewer?.device === 'invalid') { invalid = true; owner = false; }
      if (viewer?.kind === 'owner') { invalid = false; owner = true; }
      render(); settle();
    }
  };
  const start = () => {
    if (!window.Live && !paired()) known = true;
    render();
    // 规则页的公开版不读本人稿、不会再回话：页面出来就算切完
    if (known || !window.Live && publicView) settle(); else if (spinning) setTimeout(() => { waited = true; render(); settle(); }, 8000);
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();

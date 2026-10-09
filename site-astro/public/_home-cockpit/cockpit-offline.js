/* Presentation only: the original reader still owns requests and current state. */
(() => {
  'use strict';
  const page = JSON.parse(document.querySelector('#page-data')?.textContent || '{}');
  if (page.kind !== 'cockpit' || window.CockpitOffline) return;
  const key = 'site-cockpit-view-v1:' + page.page;
  const selectors = [
    '.cp-headline', '.cp-need', '.cp-following > summary', '.cp-following > div',
    '.cp-authority-items', '#cp-computer > .cp-rows', '#cp-remote > .cp-rows',
    '#cp-cloud > .cp-rows', '.cp-conditions', '.cp-events', '.cp-learning',
    '.cp-basis', '.cp-changes'
  ];
  const root = document.documentElement;
  const at = value => Number.isFinite(value) && value > 0 && value <= Date.now() / 1000 + 60;
  const valid = value => at(value?.at) && Array.isArray(value.fragments) &&
    value.fragments.length === selectors.length && value.fragments.every((part, index) =>
      part.selector === selectors[index] && typeof part.html === 'string');
  let saved = null, pending = false, notice = null, previous = '', barHome = null;
  try { const value = JSON.parse(localStorage.getItem(key)); if (valid(value)) saved = value; } catch {}
  const beijing = value => new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).format(new Date(value * 1000));
  function displayHTML(node) {
    const copy = node.cloneNode(true);
    copy.querySelectorAll('button,input,textarea,form,iframe,script,style').forEach(child => child.remove());
    return copy.innerHTML;
  }
  function remember(snapshot) {
    if (!at(snapshot.lastRead) || snapshot.lastRead === saved?.at) return;
    const nodes = selectors.map(selector => document.querySelector(selector));
    if (nodes.some(node => !node)) return;
    saved = {
      at: snapshot.lastRead,
      fragments: nodes.map((node, index) => ({
        selector: selectors[index], html: displayHTML(node), hidden: node.hidden
      })),
      followingHidden: document.querySelector('.cp-following')?.hidden === true,
      river: window.todayRiver?.model?.snap || null
    };
    try { localStorage.setItem(key, JSON.stringify(saved)); } catch {}
  }
  function retain() {
    for (const part of saved.fragments) {
      const node = document.querySelector(part.selector);
      if (!node) continue;
      if (node.innerHTML !== part.html) node.innerHTML = part.html;
      if (node.hidden !== (part.hidden === true)) node.hidden = part.hidden === true;
    }
    const following = document.querySelector('.cp-following');
    if (following && following.hidden !== saved.followingHidden) following.hidden = saved.followingHidden;
    const headline = document.querySelector('.cp-headline');
    if (headline && headline.title !== '上次成功读到：' + headline.textContent)
      headline.title = '上次成功读到：' + headline.textContent;
    const stamp = document.querySelector('.cp-stamp');
    if (stamp) {
      const text = '最后读到 ' + beijing(saved.at) + '（北京时间）';
      if (stamp.textContent !== text) stamp.textContent = text;
      if (stamp.dateTime !== new Date(saved.at * 1000).toISOString()) stamp.dateTime = new Date(saved.at * 1000).toISOString();
      if (stamp.title !== text) stamp.title = text;
    }
    const lamp = document.querySelector('.cp-lamp');
    if (lamp) {
      if (lamp.dataset.state !== 'unknown') lamp.dataset.state = 'unknown';
      if (lamp.getAttribute('aria-label') !== '显示上次成功读到的状态') lamp.setAttribute('aria-label', '显示上次成功读到的状态');
    }
    if (saved.river && window.todayRiver && !window.todayRiver.model)
      void window.todayRiver.setSnapshot({ ...saved.river, reason: saved.river.reason || 'offline' }, false);
  }
  function placeBar(cached) {
    const bar = document.querySelector('.cp-bar'), space = document.querySelector('.cp-bar-space');
    if (!bar || !space) return;
    if (cached) {
      barHome ||= { parent: bar.parentNode, next: bar.nextSibling };
      if (bar.parentNode !== space) space.append(bar);
    } else if (barHome) {
      barHome.parent.insertBefore(bar, barHome.next?.parentNode === barHome.parent ? barHome.next : null);
      barHome = null;
    }
  }
  function update() {
    pending = false;
    if (!document.querySelector('.cp-cockpit')) return;
    const snapshot = window.SiteB2?.getSnapshot?.();
    const phase = snapshot?.phase || document.body.dataset.b2StatusPhase;
    if (!phase) return;
    observer.disconnect();
    if (phase === 'ready') {
      // A real successful read is the only path into the display cache.
      remember(snapshot || {});
      root.dataset.cockpitOffline = 'live';
    } else {
      root.dataset.cockpitOffline = saved ? 'cached' : 'empty';
      if (saved) retain();
    }
    placeBar(root.dataset.cockpitOffline === 'cached');
    if (!notice) {
      notice = document.createElement('aside');
      notice.className = 'cockpit-offline-notice';
      notice.setAttribute('role', 'status');
      notice.setAttribute('aria-live', 'polite');
      document.querySelector('main')?.prepend(notice);
    }
    notice.hidden = phase === 'ready';
    const text = saved
      ? '连接暂时中断，保留最后一次成功读到的状态：' + beijing(saved.at) + '（北京时间）。恢复连接后会自动更新。'
      : phase === 'loading'
        ? '驾驶舱正在连接电脑。读到状态后会显示在这里。'
        : '驾驶舱暂时离线，还没有可展示的成功状态。恢复连接后会自动显示。';
    if (text !== previous) { notice.textContent = text; previous = text; }
    observe();
  }
  const observer = new MutationObserver(() => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  });
  function observe() {
    observer.observe(document.body, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ['data-b2-status-phase']
    });
  }
  window.CockpitOffline = { get state() { return root.dataset.cockpitOffline; } };
  observe();
  document.addEventListener('site-layout', update);
  document.addEventListener('today-river-ready', update);
  update();
})();

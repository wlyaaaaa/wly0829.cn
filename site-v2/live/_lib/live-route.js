// 航线（共用模版）：给“长过程”页用——一个对话是第一张，以后别的长过程页照这一套摆。
// 样子照本人 11-17 20:15 点头的设计图“新模版 · 一个对话 v2”：页头大标题、右上一幅淡出去的插画；
// 下面一条横着的航线（计划各步作站点），再下面三栏：正在执行 ｜ 思考摘要 + 帮手 ｜ 过程记录。
// 这里只管结构、折叠、分批和“一句收起”；字怎么出（访客那份、隐私占位、灯）由页面照 LiveUI.fieldHtml / LiveUI.status 处理好，把 HTML 交进来。
//
// 用法：
//   LiveRoute.line(key, steps, { current })  → 整条航线 <ol> 里的 HTML。steps: [{ key, label, word, state, lamp }]
//        state：'done' 画勾、'now' 当前这一步、'pending' 等其余空心数字（加 is-<state> 好上色）；word 是数据给了的状态字（没给就空着，不写“还在采集”）。
//        current：当前这一步的下标（0 起），没有写 -1。航线属于可视化，所有站点始终摊开。
//   LiveRoute.batch(key, total, { first, step, unit, what })  → { shown, html }：先露 first 条，“看全部”后按批每次 step 条，可收起。
//   LiveRoute.tally(items, stateOf, order)  → { counts, open, rest }：按状态数个数；order 里的状态排前面先露，其余收起。
//   LiveRoute.clip(root)  给 [data-clip] 的字量一下：超过收起的高度才露 [data-clip-for] 的“展开”；展开过的跨刷新保留。
//   LiveRoute.on(key, fn) 折叠、分批变了要重画哪一块。
//   LiveRoute.ico(name)   小图标（线条，跟着字色）：plan now think crew log bolt doc arrow chev check
// 视口固定 1440，不按屏宽换排版；手机上整页缩小。
(() => {
  'use strict';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const ICONS = {
    plan: '<path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
    now: '<path d="M3 12h3l2-5 3 10 3-8 2 3h5"/>',
    think: '<path d="M7.5 18h9a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 5.6 10.6 3.75 3.75 0 0 0 7.5 18Z"/><path d="M9.5 13.2h.01M12 13.2h.01M14.5 13.2h.01"/>',
    crew: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M15.5 5.2a3 3 0 0 1 0 5.6"/><path d="M17.5 14.2A5 5 0 0 1 20.5 19"/>',
    log: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    bolt: '<path d="M13 2.8 5.5 13.2H12l-1 8 7.5-10.4H12l1-8Z"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  };
  const ico = (name, cls = '') => `<svg class="route-ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;

  const redraw = new Map(), opened = new Set(), batches = new Map();
  const on = (key, fn) => redraw.set(key, fn);
  const again = key => { const fn = redraw.get(key); if (fn) fn(); };

  // —— 航线 ——
  function stop(s, i, current) {
    const state = s.state === 'done' ? 'done' : s.state === 'now' || i === current ? 'now' : /^[a-z]+$/.test(s.state || '') ? s.state : '';
    const passed = current >= 0 ? i < current : state === 'done';
    const dot = state === 'done' ? ico('check') : `<b>${i + 1}</b>`;
    return `<li class="route-stop${state ? ` is-${state}` : ''}${passed ? ' is-passed' : ''}" data-step="${i + 1}"${i === current ? ' aria-current="step"' : ''}>`
      + `<span class="route-stop__dot">${dot}</span>`
      + `<span class="route-stop__say">${s.word ? `<span class="route-stop__word">${s.lamp || ''}${s.word}</span>` : s.lamp ? `<span class="route-stop__word">${s.lamp}</span>` : ''}`
      + `${s.label ? `<span class="route-stop__text">${s.label}</span>` : ''}</span></li>`;
  }
  function line(key, steps, { current = -1 } = {}) {
    return { html: steps.map((s, i) => stop(s, i, current)).join(''), count: steps.length, folded: false, all: false };
  }
  const lineLess = () => '';

  // —— 分批看：先露 first 条，看全部后每批 step 条 ——
  function batch(key, total, { first = 5, step = 20, unit = '个', what = '' } = {}) {
    const b = batches.get(key) || { shown: 0 };
    Object.assign(b, { first, step });
    batches.set(key, b);
    const shown = Math.min(total, b.shown || first), left = total - shown, btns = [];
    if (left > 0) btns.push(b.shown
      ? `<button type="button" class="route-more" data-route-act="more" data-route-key="${esc(key)}">再看 ${Math.min(step, left)} ${unit}<span class="route-more__left">还有 ${left} ${unit}</span>${ico('chev')}</button>`
      : `<button type="button" class="route-more" data-route-act="more" data-route-key="${esc(key)}">看全部 ${total} ${unit}${what}${ico('arrow')}</button>`);
    if (b.shown) btns.push(`<button type="button" class="route-more route-more--quiet" data-route-act="less" data-route-key="${esc(key)}">收起</button>`);
    return { shown, html: btns.join(''), open: !!b.shown };
  }
  function grow(key) { const b = batches.get(key) || { shown: 0, first: 5, step: 20 }; b.shown = (b.shown || b.first) + b.step; batches.set(key, b); }

  // —— 按状态数、排：order 里的先露 ——
  function tally(items, stateOf, order) {
    const counts = new Map(), rank = s => { const i = order.indexOf(s); return i < 0 ? order.length : i; };
    for (const it of items) { const s = stateOf(it); if (s) counts.set(s, (counts.get(s) || 0) + 1); }
    const open = [], rest = [];
    items.forEach((it, i) => (order.includes(stateOf(it)) ? open : rest).push([it, i]));
    open.sort((a, b) => rank(stateOf(a[0])) - rank(stateOf(b[0])) || a[1] - b[1]);
    return { counts, open: open.map(x => x[0]), rest: rest.map(x => x[0]) };
  }

  // —— 一句收起：量一下真超出才露“展开” ——
  function clip(root = document) {
    for (const el of root.querySelectorAll('[data-clip]')) {
      const key = el.dataset.clip, open = opened.has(key), btns = document.querySelectorAll(`[data-clip-for="${CSS.escape(key)}"]`);
      el.classList.toggle('is-open', open);
      const over = open || (el.textContent.trim() !== '' && el.scrollHeight > el.clientHeight + 2);
      for (const b of btns) {
        b.hidden = !over;
        b.setAttribute('aria-expanded', String(open));
        if (!b.hasAttribute('data-clip-icon')) b.textContent = open ? '收起' : '展开';
      }
    }
  }
  let measured = 0;
  const reclip = () => { cancelAnimationFrame(measured); measured = requestAnimationFrame(() => clip()); };
  window.addEventListener('resize', reclip, { passive: true });
  document.fonts?.ready?.then(reclip);

  document.addEventListener('click', e => {
    const c = e.target.closest?.('[data-clip-for]');
    if (c) {
      const key = c.dataset.clipFor, open = !opened.has(key);
      if (open) opened.add(key); else opened.delete(key);
      clip();
      if (open && e.isTrusted && c.dataset.liveOpened) window.Live?.markOpened?.(c.dataset.liveOpened);
      return;
    }
    const b = e.target.closest?.('[data-route-act]');
    if (!b) return;
    const key = b.dataset.routeKey, act = b.dataset.routeAct;
    if (act === 'more') grow(key);
    else if (act === 'less') { batches.get(key).shown = 0; const box = b.closest('section'); if (box && box.getBoundingClientRect().top < 0) box.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    again(key);
    reclip();
  });

  window.LiveRoute = { line, lineLess, batch, tally, clip, reclip, on, ico, esc };
})();

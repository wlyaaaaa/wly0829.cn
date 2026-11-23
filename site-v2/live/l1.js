// 实况第一层用 /home 画各卡；从通知进入时再单独读目标事项。
// 灯照后端 level 画；光和灯怎么动在 _lib/live-light.js；字、按钮、列表更新在 _lib/live-ui.js。
(() => {
  'use strict';
  const U = window.LiveUI;
  const Light = window.LiveLight;
  const { esc, sp } = U;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let project = params.get('project'), focusId = params.get('item'), focused = false;
  const PAGES = [
    { id: 'needs', name: '等你的事', href: '/live/items/', scoped: true },
    { id: 'chats', name: 'AI 对话', href: '/live/chats/' },
    { id: 'agents', name: '智能体' }, // 智能体的新页还没做好，先不给去处，卡上也不出链接
    { id: 'ledger', name: 'AI 账本', href: '/live/ledger/', scoped: true },
    { id: 'automation', name: '自动任务', href: '/live/automation/', scoped: true },
    { id: 'computer', name: '电脑', href: '/live/computer/' },
    { id: 'phone', name: '手机', href: '/live/phone/' },
    { id: 'tasks', name: '计划任务', href: '/live/tasks/', scoped: true },
    { id: 'backups', name: '备份', href: '/live/backups/' },
    { id: 'projects', name: '项目', href: '/live/projects/' },
  ];
  // 旧通知是 /cockpit/#<原ID>，兼容页照原样带着 hash 跳到 /live/#<原ID>：不是七块名（也不是配对码）的 hash 当条目，换成 ?item=（设计 §9）
  const oldHash = location.hash.slice(1);
  if (!focusId && oldHash && !oldHash.startsWith('pair=') && !PAGES.some(p => p.id === oldHash)) {
    try { focusId = decodeURIComponent(oldHash); } catch { focusId = oldHash; }
    params.set('item', focusId);
    history.replaceState(history.state, '', `${location.pathname}?${params}`);
  }
  const route = path => { const u = new URL(path, location.origin); if (params.has('fixture')) u.searchParams.set('fixture', params.get('fixture')); return u.pathname + u.search + u.hash; };
  const href = id => { const entry = PAGES.find(p => p.id === id); return route(entry.href + (project && entry.scoped ? `?project=${encodeURIComponent(project)}` : '')); };

  $('backups').classList.remove('board__wide');
  const phoneCard = $('computer').cloneNode(true);
  phoneCard.id = 'phone';
  phoneCard.querySelectorAll('img').forEach(img => { img.src = '/live/img/phone.webp'; });
  $('computer').after(phoneCard);
  for (const entry of PAGES) if (!$(entry.id)) {
    const card = phoneCard.cloneNode(true); card.id = entry.id;
    card.querySelectorAll('img').forEach(img => { img.src = entry.img || '/live/img/projects.webp'; });
    $('backups').after(card);
  }
  const IDS = PAGES.map(p => p.id);
  const TASK_PAGES = PAGES.filter(p => p.id === 'tasks');
  const HOME_IDS = PAGES.filter(p => !TASK_PAGES.includes(p)).map(p => p.id);
  const cards = Object.fromEntries(IDS.map((id) => [id, $(id)]));
  const columns = [...document.querySelectorAll('.board__col')], balancedCards = IDS.filter(id => id !== 'projects').map(id => cards[id]);
  // 首页默认预览：先满足已有下限，只有两栏无法用默认条数贴齐时才考虑加行。
  const previewRange = { needs: [3, 5], active: [3, 5], done: [3, 5], tasks: [3, 5], backups: [3, 5], projectChanges: [3, 5], projectGroup: [5, 5] };
  const cardGroups = { needs: ['needs'], chats: ['active', 'done'], tasks: ['tasks'], backups: ['backups'] };
  const defaultCounts = Object.fromEntries(Object.entries(previewRange).map(([id, [, max]]) => [id, max]));
  const previewCards = [cards.chats, cards.automation], alignTolerance = 8;
  let shown = defaultCounts, chatTotal = 0, chatWorking = false, needsTotal = 0;
  const chatMore = (active, done) => Math.max(chatTotal - (chatWorking ? active : done), 0);
  const directRows = list => [...list.children].filter(row => row.dataset.key && !row.classList.contains('row--preview-note'));
  const cardPart = (card, key) => card.querySelector('[data-part="' + key + '"]');
  function previewGroups(card) {
    const rows = key => directRows(cardPart(card, key));
    if (card.id === 'chats') return [rows('active'), [...rows('done'), ...rows('recent-rest')]];
    if (card.id === 'backups') return [[...rows('main'), ...rows('restore')]];
    return [rows('main')];
  }
  const expandedReplies = new Set();
  function sizeChatReplies(card, expanded) {
    let reading = false;
    for (const button of card.querySelectorAll('.chat-preview__toggle')) {
      const text = button.previousElementSibling;
      if (!text.clientHeight) continue;
      const row = text.closest('.row'), id = row.dataset.key;
      button.setAttribute('aria-expanded', 'false');
      const clipped = text.scrollHeight > text.clientHeight + 1, open = clipped && expanded?.has(id);
      button.hidden = !clipped;
      button.setAttribute('aria-expanded', String(!!open));
      button.textContent = open ? '收起' : '展开全文';
      row.classList.toggle('is-expanded', !!open);
      const bottom = text.getBoundingClientRect().bottom;
      for (const control of text.querySelectorAll('a[href],button')) control.inert =
        !open && clipped && control.getBoundingClientRect().bottom > bottom + 1;
      reading ||= !!open;
    }
    return reading;
  }
  let balanceFrame = 0;
  function balanceHome() {
    if (balanceFrame) return;
    balanceFrame = requestAnimationFrame(() => {
      balanceFrame = 0;
      if (sizeChatReplies(cards.chats, expandedReplies)) return;
      const anchor = settling() ? update => update() : U.anchor;
      const unreadable = document.body.classList.contains('live-unreadable'), narrow = !unreadable && columns[0].offsetLeft === columns[1].offsetLeft;
      if (!unreadable && !narrow && (parts.chats['recent-more'].open && !parts.chats['recent-more'].hidden || parts.needs.main.querySelector('details[open]'))) return;
      previewCards.forEach(card => card.style.removeProperty('min-height'));
      if (unreadable) return;
      if (narrow) {
        applyCounts(defaultCounts);
        sizeChatReplies(cards.chats, expandedReplies);
        return;
      }
      const gap = parseFloat(getComputedStyle(columns[0]).rowGap) || 0;
      // 手机沿用固定宽度的双栏外观，条数上限仍按设备屏幕判断。
      const narrowTouch = navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) <= 700;
      const { layout, counts } = balanceDesktopCards(measureHomeCards(), gap, !narrowTouch);
      placeHomeCards(layout, counts, anchor);
      sizeChatReplies(cards.chats, expandedReplies);
      const [left, right] = layout.map(items => items.at(-1).offsetTop + items.at(-1).offsetHeight);
      const diff = left - right, card = previewCards[Number(diff > 0)];
      if (diff && Math.abs(diff) <= 56) card.style.minHeight = (card.offsetHeight + Math.abs(diff)) + 'px';
    });
  }
  function fitCard(id) {
    const [rows, done] = previewGroups(cards[id]), [key] = cardGroups[id], p = parts[id];
    const count = shown[key];
    rows.forEach((row, i) => { row.hidden = i >= count && !(id === 'needs' && row.querySelector('details[open]')); });
    if (id === 'needs') compactMore('needs', needsTotal - Math.min(count, rows.length), '条');
    if (id !== 'chats') return;
    for (const row of done.slice(0, shown.done)) if (row.parentElement !== p.done) p.done.append(row);
    for (const row of done.slice(shown.done).reverse()) if (row.parentElement === p.done) p['recent-rest'].prepend(row);
    p['recent-more'].hidden = done.length <= shown.done;
    // 在干的多到收不下时，“还有 N 个”紧跟在在干那几行下面，不排到已完成后面让人以为是做完的。
    const moreAfter = chatWorking ? p.active : p['recent-more'];
    if (moreAfter.nextElementSibling !== p.more) moreAfter.after(p.more);
    compactMore('chats', chatMore(Math.min(count, rows.length), Math.min(shown.done, done.length)), '个对话');
  }
  function applyCounts(counts) {
    shown = counts;
    for (const id of Object.keys(cardGroups)) fitCard(id);
  }
  function measureHomeCards() {
    return columns.map(column => {
      const width = column.getBoundingClientRect().width;
      for (const card of balancedCards) card.style.width = width + 'px';
      const measured = Object.fromEntries(balancedCards.map(card => [card.id, cardGroups[card.id] ? measurePreview(card) : { fixed: card.offsetHeight }]));
      for (const card of balancedCards) card.style.removeProperty('width');
      return measured;
    });
  }
  function measurePreview(card) {
    // 同宽副本包含所有候选，量取媒体换行、行距和提示随条数出现/消失的高度。
    const clone = card.cloneNode(true), keys = cardGroups[card.id];
    clone.style.position = 'absolute'; clone.style.visibility = 'hidden';
    card.parentElement.append(clone);
    const body = clone.querySelector('.card__body'), glass = getComputedStyle(clone.querySelector('.card__glass'));
    const chrome = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((n, key) => n + parseFloat(glass[key]), 0);
    const min = parseFloat(glass.minHeight) || 0, groups = previewGroups(clone);
    const more = body.querySelector(':scope > a.more'), recent = cardPart(clone, 'recent-more');
    const fixedMore = Boolean(more && !more.hidden);
    if (recent) {
      recent.open = false;
      cardPart(clone, 'done').append(...groups[1]);
    }
    for (const row of groups.flat()) row.hidden = false;
    if (recent) sizeChatReplies(clone);
    const prefix = groups.map(rows => rows.reduce((sums, row) => { sums.push(sums.at(-1) + row.offsetHeight); return sums; }, [0]));
    const totals = prefix.reduce((sum, heights) => sum + heights.at(-1), 0);
    const bases = {};
    for (const showMore of more && card.id !== 'backups' ? [false, true] : [fixedMore]) {
      if (more) more.hidden = !showMore;
      for (const showRecent of recent ? [false, true] : [false]) {
        if (recent) recent.hidden = !showRecent;
        bases[Boolean(showMore) + ':' + showRecent] = chrome + body.offsetHeight - totals;
      }
    }
    clone.remove();
    const height = counts => {
      const [a, d] = keys.map(key => counts[key]), showMore = card.id === 'needs' ? needsTotal > a : recent ? chatMore(a, d) > 0 : fixedMore;
      const base = bases[showMore + ':' + Boolean(recent && d < groups[1].length)];
      return Math.max(min, base + prefix.reduce((sum, heights, i) => sum + heights[counts[keys[i]]], 0));
    };
    return { height, available: Object.fromEntries(keys.map((key, i) => [key, groups[i].length])) };
  }
  function balanceDesktopCards(measured, gap, allowOverflow = true) {
    // 卡片位置固定（M044）：备份在左栏、计划任务跟自动任务在右栏，只靠条数配平两栏，不按高度换栏。
    const layouts = [[['needs', 'chats', 'backups', 'agents'], ['computer', 'phone', 'automation', 'ledger', 'tasks']]];
    const available = Object.assign({}, ...Object.values(measured[0]).map(m => m.available));
    const keys = Object.keys(available), total = counts => keys.reduce((sum, key) => sum + counts[key], 0);
    const getHeight = (layout, counts) => layout.map((ids, side) => ids.reduce((sum, id) => sum + (measured[side][id].fixed ?? measured[side][id].height(counts)), (ids.length - 1) * gap));
    const candidate = (layout, counts) => {
      const [left, right] = getHeight(layout, counts), diff = left - right;
      return { layout, counts, diff, gap: Math.abs(diff), rows: total(counts) };
    };
    const moves = layout => layout.flatMap((ids, side) => ids.filter(id => cards[id].parentElement !== columns[side])).length;
    const better = (a, b) => !b || Number(a.gap > alignTolerance) < Number(b.gap > alignTolerance) ||
      (a.gap <= alignTolerance && b.gap <= alignTolerance
        ? a.rows > b.rows || a.rows === b.rows && (a.gap < b.gap || a.gap === b.gap && moves(a.layout) < moves(b.layout))
        : a.gap > alignTolerance && b.gap > alignTolerance && (a.gap < b.gap || a.gap === b.gap && a.rows > b.rows));
    const max = key => Math.min(available[key], defaultCounts[key]);
    // 在干的对话不拿来配平高度：最多 5 行一直列全。
    const min = key => key === 'active' ? max(key) : Math.min(available[key], previewRange[key][0]);
    const defaults = [];
    let best;
    function searchDefault(index, counts) {
      if (index === keys.length) {
        for (const layout of layouts) {
          const c = candidate(layout, counts);
          if (better(c, best)) best = c;
          if (allowOverflow && best.gap > alignTolerance) defaults.push(c);
        }
        return;
      }
      const key = keys[index];
      for (let n = max(key); n >= min(key); n--) searchDefault(index + 1, { ...counts, [key]: n });
    }
    searchDefault(0, {});
    if (allowOverflow && best.gap > alignTolerance) {
      // 从每种默认摆法只给短侧的一张卡加行；按超出的条数逐层找，找到就不试更多。
      const queue = [], seen = new Set();
      const grow = (c, id, side, extra) => {
        for (const key of cardGroups[id] || []) if (c.counts[key] >= max(key) && c.counts[key] < available[key]) {
          const counts = { ...c.counts, [key]: c.counts[key] + 1 };
          const token = layouts.indexOf(c.layout) + ':' + keys.map(k => counts[k]).join(',');
          if (!seen.has(token)) { seen.add(token); queue.push({ ...candidate(c.layout, counts), id, side, extra }); }
        }
      };
      for (const c of defaults) {
        const short = Number(c.diff > 0);
        for (const id of c.layout[short]) grow(c, id, short, 1);
      }
      let aligned;
      for (let i = 0; i < queue.length; i++) {
        const c = queue[i];
        if (aligned && c.extra > aligned.extra) break;
        if (c.gap <= alignTolerance) {
          const beyond = Number(c.diff > 0) !== c.side && c.gap > 0;
          if (!aligned || c.gap < aligned.gap || c.gap === aligned.gap && !beyond && aligned.beyond) aligned = { ...c, beyond };
        } else if (!aligned && Number(c.diff > 0) === c.side) {
          grow(c, c.id, c.side, c.extra + 1);
        }
      }
      best = aligned || best;
    }
    return { layout: best.layout.map(ids => ids.map(id => cards[id])), counts: best.counts };
  }
  function placeHomeCards(layout, counts, anchor) {
    const moved = layout.some((items, i) => items.some((card, j) => columns[i].children[j] !== card));
    const resized = Object.keys(counts).some(key => counts[key] !== shown[key]);
    if (!moved && !resized) return;
    const hidesVisible = resized && scrollY > 0 && Object.entries(cardGroups).some(([id, keys]) =>
      previewGroups(cards[id]).some((rows, i) => rows.slice(counts[keys[i]], shown[keys[i]]).some(row => {
        const top = row.getBoundingClientRect().top;
        return top >= 95 && top < innerHeight - 30;
      })));
    const update = hidesVisible ? apply => apply() : anchor, focused = document.activeElement;
    update(() => {
      applyCounts(counts);
      layout.forEach((items, i) => {
        const column = columns[i];
        let next = null;
        for (const card of items.slice().reverse()) {
          if (card.parentElement !== column || card.nextElementSibling !== next) column.insertBefore(card, next);
          next = card;
        }
      });
      if (focused?.isConnected && !focused.closest('[hidden]')) focused.focus({ preventScroll: true });
    });
  }
  window.addEventListener('resize', balanceHome);
  const notices = $('notices');

  // 每块先搭好骨架（只搭一次），以后只换里面变了的地方
  const SHELL = {
    needs: `<p class="card__head" data-part="head"></p>
      <ul class="rows" data-part="main"></ul>
      <p class="row__sub needs-summary" data-part="summary"></p>
      <button class="more" type="button" data-part="more" hidden></button>
      <div class="card__foot" data-part="foot">
        <button class="more" type="button" data-part="closed" hidden></button>
      </div>`,
    chats: `<p class="card__head" data-part="head"></p>
      <div data-part="sources" style="overflow-wrap:anywhere" hidden></div>
      <ul class="rows" data-part="active"></ul>
      <span class="part" data-part="done-label"></span>
      <ul class="rows" data-part="done"></ul>
      <details data-part="recent-more" hidden><summary class="more">再看已完成的 <span class="more__chev">›</span></summary><ul class="rows" data-part="recent-rest"></ul></details>
      <button class="more" type="button" data-part="more" hidden></button>`,
    computer: `<p class="card__head" data-part="head" data-steady></p>
      <dl class="kv" data-part="kv"></dl>
      <p class="row__sub" data-part="why" hidden></p>
      <p class="card__note" data-part="note"></p>`,
    phone: `<p class="card__head" data-part="head"></p><dl class="kv" data-part="kv"></dl><p class="card__note" data-part="note"></p>`,
    backups: `<p class="card__head" data-part="head"></p><ul class="rows" data-part="main"></ul><ul class="rows" data-part="restore"></ul><p class="card__note" data-part="summary"></p>`,
    ...Object.fromEntries(['agents','automation','ledger'].map(id => [id,
      '<p class="card__head" data-part="head"></p><div class="b6-body" data-part="batch"></div>'])),
    projects: `<p class="card__head" data-part="head"></p><ul class="rows project-changes" data-part="changes"></ul>
      <p class="row__sub" data-part="changes-status" hidden></p>
      <button class="more" type="button" data-part="more-changes" hidden>近 7 天全部变化 <span class="more__chev">›</span></button>
      <div class="fold" data-part="changes-box"><div><ul class="rows project-changes"></ul><button class="more" type="button" hidden>再看一些 ›</button></div></div>
      <div class="project-groups" data-part="main"></div>
      <a class="more" data-part="artifacts" hidden></a><nav class="card__foot project-footer" aria-label="项目卡相关入口">
        <a class="more" data-part="unpushed" hidden></a><a class="more" data-part="frozen"></a>
        <span data-part="published" hidden></span>
      </nav>`,
  };
  const parts = {};
  for (const id of IDS) {
    const body = cards[id].querySelector('.card__body');
    if (SHELL[id]) {
      body.innerHTML = SHELL[id];
      body.querySelector('[data-part="head"]').insertAdjacentHTML('afterend', '<p class="row__sub" data-part="gap" hidden></p><p class="row__sub" data-part="status" hidden></p>');
    }
    parts[id] = Object.fromEntries([...body.querySelectorAll('[data-part]')].map((el) => [el.dataset.part, el]));
  }

  for (const id of ['needs', 'chats', 'backups']) {
    let more = parts[id].more;
    if (more) { const a = document.createElement('a'); a.className = more.className; more.replaceWith(a); parts[id].more = more = a; }
    else { more = document.createElement('a'); more.className = 'more'; cards[id].querySelector('.card__body').append(more); parts[id].more = more; }
  }
  parts.chats['recent-more'].addEventListener('toggle', balanceHome);
  cards.chats.addEventListener('click', event => {
    const button = event.target.closest('.chat-preview__toggle');
    if (!button) return;
    const id = button.closest('.row').dataset.key;
    if (expandedReplies.delete(id)) balanceHome(); else expandedReplies.add(id);
    sizeChatReplies(cards.chats, expandedReplies);
  });
  document.fonts.ready.then(balanceHome);
  parts.needs.main.addEventListener('toggle', balanceHome, true);
  function compactMore(id, n, unit, attention = false) {
    const more = parts[id].more; more.hidden = !(n > 0); more.href = href(id) + (attention ? `${href(id).includes('?') ? '&' : '?'}attention=1` : '');
    U.html(more, `还有 ${n} ${unit} ›`);
  }
  function emptyCard(id, d) {
    const card = cards[id], p = parts[id], warming = d?.q === 'warming';
    card.classList.add('card--empty'); card.classList.toggle('card--warming', warming);
    const named = id === 'chats', name = NAME[id];
    const caption = id === 'needs' && d ? addressed('等你的事 · 没有记录') : d?.text || `${name}暂时读不到`;
    const text = warming ? '正在准备' : lastState?.offline ? `${name}：这块没存下来，连上后补上。` : caption;
    U.html(p.head, named ? chatCardHead({ marker: typeof text === 'object' && text }) + `<br><span class="row__sub">${U.fieldHtml(typeof text === 'string' ? text : '', { name })}</span>` : cardHead(text, name));
    for (const [key, el] of Object.entries(p)) if (key !== 'head') { if (!el.querySelector?.('[data-part]')) U.html(el, ''); el.hidden = true; }
    paintStatus(id, d);
  }

  // —— 加载中（雾里显影，_lib/live-ui.js 的 reading）：第一次读、手上还没有数时七张卡各自进雾，数到了由糊变清；
  //    电脑不在线、又没存下来时每张卡收成一句话（名字 + “电脑不在线，这块没存下来，开机后自动补上”） ——
  const NAME = Object.fromEntries(PAGES.map(p => [p.id, p.name || p.id]));
  let projectLooks = null;
  const LINES = { needs: 3, chats: 3, computer: 3 };
  const reads = Object.fromEntries(HOME_IDS.map((id) => {
    const body = cards[id].querySelector('.card__body');
    if (id === 'ledger' || id === 'projects') body.classList.add('fog-bare');   // 没灯的卡：雾里也不摆灯
    return [id, U.reading(body, { ghost: U.ghost.card(LINES[id] || 2), name: NAME[id], slow: id === 'needs' })];
  }));

  // 灯由后端给定；行灯使用该行自己的状态。
  const day = value => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date(value));
  const timed = value => Number.isFinite(Date.parse(value));
  const blockAt = d => Object.hasOwn(d || {}, 'source_at') ? d.source_at : d?.at;
  // 是不是今天按眼下的时刻比，不拿数据包自己的时刻比：首屏先画和数据到了以后再画，写法一样；不是今天的一定带日期。
  const recordStamp = (value, precision) => timed(value) ? join([day(value) !== day(!lastState?.offline && lastState?.now || Date.now()) && U.date(value), U.time(value, precision)]).replace(' · ', ' ') || U.date(value) : '';
  function hasCardData(id, d) {
    if (!d || d.q === 'warming') return false;
    if (id === 'chats') return d.unconnected_source_count === null || Number.isInteger(d.unconnected_source_count) && d.unconnected_source_count > 0 || [d.running, d.waiting, d.done72, d.last_counts?.running, d.last_counts?.done72].some(v => v != null) || [...d.active || [], ...d.recent || [], ...d.fallback || []].length > 0;
    if (id === 'backups') return (d.summary?.sets ?? d.sets) != null || (d.items || []).length > 0 || d.restore?.some(set => set.points?.length || set.failed_points?.length);
    if (id === 'needs') return d.counts != null || (d.items || []).length > 0;
    if (['agents', 'automation', 'ledger'].includes(id)) return true;
    if (id === 'phone') return d.state === 'offline' || !!d.link?.route || !!d.received?.last_at || (d.metrics || []).some(m => m.value != null);
    return !!d.why || typeof d.text === 'object' && !!d.text || /开机|主机开了|\d\s*(?:℃|°C)/.test(d.text) || (d.metrics || []).some(m => m.value != null) || Number.isFinite(home?.screen?.uptime);
  }
  const urgent = it => it.level === 'important' || ['red', 'yellow'].includes(it.light);
  const isLower = (object, key) => [object, object?.[key]].some(o => o?.lower_bound === true || o?.at_least === true || o?.isPartial === true) || (Array.isArray(object?.partial) ? object.partial.includes(key) : object?.q === 'partial');
  const quantity = (object, key, format = String) => { if (object?.q === 'warming') return '正在准备'; if (object?.[key] == null) return U.collectionText(object?.label || '', object, null, key); const text = U.collectionText('', object, format(object[key]), key); return isLower(object, key) && !/^(至少\s*|不到)/.test(text) ? `至少 ${text}` : text; };
  const cardHead = (text, name, options) => {
    if (Array.isArray(text)) return cardHead(text.filter(v => !v || typeof v !== 'object').filter(Boolean).join(' · '), name, options) + text.filter(v => v && typeof v === 'object').map(v => `<span class="head__marker">${U.fieldHtml(v, { name, kind: viewer })}</span>`).join('');
    if (text && typeof text === 'object') return U.head(name, options) + `<span class="head__marker">${U.fieldHtml(text, { name, kind: viewer })}</span>`;
    const pieces = sp(text).split(' · '), cutoff = pieces.filter(U.isCutoffNote);
    const gap = pieces.filter(s => !cutoff.includes(s) && (U.isMissingText(s) || /暂时读不到|没存下来/.test(s))), known = pieces.filter(s => !gap.includes(s) && !cutoff.includes(s));
    const note = [...gap, ...cutoff];
    if (['电脑', 'AI 账本', '项目'].includes(name)) return U.head([name, ...known, ...note].filter(Boolean).join(' · '), options);
    return U.head(known.join(' · ') || name, options) + (note.length ? `<br><span class="row__sub">${esc(note.join(' · '))}</span>` : '');
  };
  const daysText = n => n < 1 ? '不到 1 天' : n < 365 ? `${Math.round(n)} 天` : `${Math.round(n / 365)} 年`;
  const waitDays = (it, end) => {
    if (Number.isInteger(it.age_days) && it.age_days >= 0) return it.age_days;
    const days = (Date.parse(end) - Date.parse(it.born || it.episode_at)) / 86400000;
    return Number.isFinite(days) ? Math.max(0, Math.floor(days)) : null;
  };
  const waitText = n => n === 0 ? '不到 1 天' : `${n} 天`;
  const projectCount = d => d.active == null ? U.collectionText("在用项目数", d) : `${quantity(d, 'active')} 个在用`;
  const statContainers = d => [d, d?.counts, d?.summary, d?.summary?.drive, d?.traffic, d?.storage_growth_top, d?.outcomes7, ...(d?.metrics || [])].filter(Boolean);
  const cardTone = (id, d, status = U.status(d)) => ['ledger', 'projects'].includes(id) ? 'none' : status.tone;
  function projectGroups(items = []) {
    const groups = { daily: [], occasional: [], archived: [], unknown: [] };
    for (const item of items) groups[['daily', 'occasional', 'archived'].includes(item.phase) ? item.phase : 'unknown'].push(item);
    const daily = groups.daily;
    for (const [first, second] of [
      ['ai-cli-profile-manager', 'pcconfig'],
      ['career-development', 'passwordcenter'],
      ['codex-memory', 'localocr'],
    ]) {
      const a = daily.findIndex(item => item.id === first);
      const b = daily.findIndex(item => item.id === second);
      if (a >= 0 && b >= 0) [daily[a], daily[b]] = [daily[b], daily[a]];
    }
    return groups;
  }
  function projectIcon(it) {
    // 复用 live-board / live-route 的线条路径，不带徽章底色。
    const paths = {
      project: '<path d="M12 3.4l7.6 4v9.2L12 20.6l-7.6-4V7.4z"/><path d="M4.4 7.4L12 11.4l7.6-4M12 11.4v9.2"/>',
      ai: '<path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
      computer: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.2"/><rect x="9.6" y="9.6" width="4.8" height="4.8" rx=".8"/><path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3"/>',
      network: '<path d="M3.6 9.4a12 12 0 0 1 16.8 0M6.6 12.6a7.6 7.6 0 0 1 10.8 0M9.6 15.7a3.4 3.4 0 0 1 4.8 0"/><circle cx="12" cy="18.6" r="1.2"/>',
      media: '<path d="M8.4 5.6v12.8L18.6 12z"/>',
      note: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
      rocket: '<path d="M9 15C9 9 14 4 21 3c0 7-5 12-11 12l-4-4 3-2m6 6-2 4-3-4M7 16l-4 5 5-2"/><circle cx="15.5" cy="8.5" r="1.5"/>',
      school: '<path d="m2 9 10-5 10 5-10 5-10-5Zm4 2v6c3 3 9 3 12 0v-6m4-2v7"/>',
      notebook: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8m-8 4h5"/>',
      archive: '<path d="M5 4h14l2 9v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5l2-9Zm-2 9h5l2 2h4l2-2h5"/>',
      book: '<path d="M12 6C9 4 5 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-2-1-6-1-9 1v14"/>',
      frame: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m4 17 6-6 4 4 2-2 4 4"/><circle cx="16" cy="8" r="1"/>',
      key: '<path d="M14.5 3A5.5 5.5 0 0 0 9 8.5c0 1 .3 2 .8 2.8L3 18v3h3l2-2v-2h2l3.8-3.8A5.5 5.5 0 1 0 14.5 3Z"/><circle cx="16" cy="7" r="1"/>',
      lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v2"/>',
      monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v3m-4 0h8"/>',
      wallet: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 8V5l13-2v2m3 6h-5v5h5m-3-2.5h.1"/>',
      pulse: '<path d="M2 12h5l3-7 4 14 3-7h5"/>',
      library: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 8v8m4-8v8m4-8 2 8"/>',
      play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
      heart: '<path d="M12 20 4 12a4.8 4.8 0 0 1 8-5 4.8 4.8 0 0 1 8 5Z"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2"/>',
      pointer: '<path d="M4 19 3 14l4-4h5l4-5a2 2 0 0 1 3 2l-2 4 3 1a2 2 0 0 1 0 4l-6 1-2 4Z"/>',
      controller: '<path d="M8 7h8c3 0 5 4 5 8 0 4-3 4-5 1H8c-2 3-5 3-5-1 0-4 2-8 5-8Zm0 3v4m-2-2h4m5 0h.1m2 2h.1"/>',
      smile: '<circle cx="12" cy="12" r="9"/><path d="M8 13c2 3 6 3 8 0m-7-4h.1m6 0h.1"/>',
      film: '<path d="m3 6 9 7 9-7m-18 5 9 7 9-7"/>',
      shield: '<path d="m12 3 8 4v6c0 4-5 7-8 8-3-1-8-4-8-8V7l8-4Zm-4 9 3 3 5-6"/>',
      house: '<path d="m2 11 10-8 10 8M5 10v10h5v-6h4v6h5V10"/>',
      compass: '<circle cx="12" cy="12" r="9"/><path d="m9 15 2-5 5-2-2 5-5 2Z"/>',
    }, name = U.sp(it.name);
    const icons = {
      agents: 'ai', 'ai-cli-profile-manager': 'rocket', 'career-development': 'school', chineseasr: 'notebook', 'codex-memory': 'archive',
      'daily-preferences': 'book', 'devconfig-backup': 'project', 'emerald-veil': 'frame', key: 'key', localocr: 'lock',
      passwordcenter: 'monitor', 'pc-panel-hub': 'book', pcconfig: 'school', 'personal-finance': 'wallet', 'personal-formal-documents': 'note',
      'personal-health': 'pulse', 'personal-materials': 'library', 'personal-media': 'play', 'phone-collector': 'calendar',
      proxyclean: 'pointer', 'public-project-private-backup': 'ai', 'steam-millennium-config-backup': 'controller', 'sunshine-remote-streaming': 'monitor', timeaudit: 'smile',
      'typora-theme-pack': 'calendar', 'vault-tool': 'archive', 'video-scaffold': 'film', wechatdirect: 'shield', 'wly0829.cn': 'house', wlyaaaaa: 'compass',
    };
    const icon = (typeof projectLooks === 'undefined' ? null : projectLooks?.[window.LiveProjectLook?.key(it.id)]?.icon) || it.icon;
    if (typeof icon === 'string' && /^(?:https?:\/\/|\/)/.test(icon)) return `<img class="project-icon" src="${esc(icon)}" alt="" aria-hidden="true">`;
    const kind = Object.hasOwn(paths, icon) ? icon : icons[it.id?.split('/').at(-1).replace(/^\./, '').toLowerCase()]
      ?? (/AI|智能|助手/i.test(name) ? 'ai' : /电脑|系统|配置|机/.test(name) ? 'computer' : /网络|代理|连接/.test(name) ? 'network' : /音|影|相|媒体/.test(name) ? 'media' : /记录|笔记|日记|记事/.test(name) ? 'note' : 'project');
    return `<svg class="project-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[kind]}</svg>`;
  }
  function newProjectLabel(it) { return viewer === 'owner' && it.new === true ? '<span class="tag tag--new">新项目</span>' : ''; }
  function projectTile(it) {
    const changed = it.changed?.at, h = it.headline, value = headline(it);
    const cutoff = (h?.at || h?.source_at) && recordStamp(blockAt(h), h?.at_precision);
    const recent = changed && !lastState?.offline && fresh('project-changes', changed) ? '<span class="project-recent">刚改</span>' : '';
    const nameNote = viewer === 'public' && it.name && typeof it.name === 'object' ? U.fieldHtml({ ...it.name, text: null, value: null }, { name: '项目名', kind: viewer }) : '';
    const look = typeof projectLooks === 'undefined' || projectLooks === null ? null : window.LiveProjectLook?.of(it.id, projectLooks);
    const style = look && !look.known ? ` style="background:linear-gradient(135deg,${look.glow[0]},${look.glow[1]})"` : '';
    return `<li class="project-cell" data-key="${esc(it.id)}"${style}><a class="home-detail-link" href="${esc(route(it.href || `/live/project/?id=${encodeURIComponent(it.id)}`))}">${projectIcon(it)}${it.new === true && viewer === 'owner' ? newProjectLabel(it) : ''}<span class="project-name">${U.fieldHtml(it.name || it.label || it.title || it.id, { name: '项目', place: 'label', kind: viewer })}</span><span aria-hidden="true">›</span></a><small class="project-reading">${value && typeof value === 'string' ? esc(sp(value)) : U.fieldHtml(value, { name: '项目读数', kind: viewer })}</small>${cutoff ? `<small class="project-cutoff">${U.nowrap(`数据截至 ${cutoff}`)}</small>` : ''}${nameNote ? `<small>${nameNote}</small>` : ''}${changed ? `<small class="project-changed">${U.nowrap(`最近改动：${[U.date(changed), U.time(changed)].filter(Boolean).join(' ')}`)}${recent}</small>` : ''}${it.phase == null && it.phase_gap ? `<small>${U.fieldHtml(it.phase_gap, { name: '项目分档', kind: viewer })}</small>` : ''}</li>`;
  }
  function renderProjectGroups(data) {
    projectExtraLinks(data);
    const limit = defaultCounts.projectGroup;
    const moreOpen = key => parts.projects.main.querySelector?.('.project-group--' + key + ' .project-more')?.open ? ' open' : '';
    const groups = projectGroups(data.items), labels = { daily: ['日用', '🖥️'], occasional: ['偶用', '🌐'], unknown: ['分档还没读到', ''] };
    U.html(parts.projects.main, Object.entries(labels).filter(([key]) => groups[key].length).map(([key, [label, icon]]) => `<section class="project-group project-group--${key}"><h3><span aria-hidden="true">${icon}</span>${label}</h3><ul class="project-grid">${groups[key].slice(0, limit).map(projectTile).join('')}</ul>${groups[key].length > limit ? `<details class="project-more"${moreOpen(key)}><summary>展开（还有 ${groups[key].length - limit} 个）</summary><ul class="project-grid">${groups[key].slice(limit).map(projectTile).join('')}</ul></details>` : ''}</section>`).join(''));
    const count = Number.isFinite(data.frozen) ? quantity(data, 'frozen') : null;
    U.html(parts.projects.frozen, `${count == null ? '看冻结项目' : `冻结 ${count} 个`} ›`);
    parts.projects.frozen.href = route('/live/projects/?state=frozen');
  }
  function projectExtraLinks(data) {
    const { unpushed, artifacts } = parts.projects;
    unpushed.hidden = !data?.unpushed?.items?.some(it => it.commits > 0 || it.files > 0);
    if (!unpushed.hidden) {
      unpushed.href = route('/live/projects/#unpushed');
      U.html(unpushed, '本地还有没推的改动 ›');
    }
    const recent = data?.recent_artifacts;
    artifacts.hidden = !recent?.href;
    if (!artifacts.hidden) {
      artifacts.href = route(recent.href);
      U.html(artifacts, `最近成品${recent.count_7d != null ? ` · 近 7 天 ${esc(recent.count_7d)} 件` : ''} ›`);
    }
  }


  const KIND = { choose: '要你选', do: '要你做', later: '你放着', know: '要你知道' };
  const allNotUrgent = d => {
    const items = d.items.filter(it => !project || it.project === project);
    return !d.phone && !items.some(urgent) && items.length > 0 && items.every(it => it.kind === 'later' || (it.kind === 'know' || ['choose', 'do'].includes(it.kind) && Object.hasOwn(it, 'due')));
  };
  const MOBILE = { phone: '手机能办', computer: '要在电脑上办', in_person: '要本人到场' };
  const NET = { bilibili: '哔哩哔哩', claude: 'Claude', openai: 'OpenAI' };

  const lamp = data => U.status(data, { small: true }).lamp;
  const tags = (list) => list.filter(Boolean).map(([t, cls]) => `<span class="tag${cls ? ' ' + cls : ''}">${t}</span>`).join('');
  const join = (list) => list.filter(Boolean).map(sp).join(' · ');
  const title = (it, text, resource) => { const own = resource === 'chats' ? 'AI 对话' : '事项', field = { visibility: it.visibility, public: it.public, rewrite: it.rewrite, hidden_what: it.hidden_what, ...(text && typeof text === 'object' ? text : { text }) }, hidden = viewer === 'public' && (field.visibility === 'owner' || field.public === 'owner' || field.hidden), words = U.fieldHtml(field, { name: own, place: 'title', kind: viewer }) || (lastState?.offline ? '' : U.collectionText()), note = hidden || (field.rewrite === 'pending' || field.hidden) && !field.text && !field.value ? U.fieldHtml(field, { name: field.hidden_what || (resource === 'chats' ? '这场对话的内容' : '这件事'), kind: viewer }) : ''; return (hidden ? `<span class="row__title">${words}</span>` : `<a class="row__title home-detail-link" href="${esc(route(`/live/${resource === 'chats' ? 'chat' : 'item'}/?id=${encodeURIComponent(it.id)}`))}">${words}</a>`) + (note ? `<span class="row__meta">${note}</span>` : ''); };
  let home = null, at = null, source = null, seen = null, lastState = null, viewer = 'owner';
  let aiMessages = null;   // 首页的 AI 留言（ai-messages 读口），画在页顶那张卡里
  const newMarks = new Map();
  const fresh = (scope, born, readAt = at, readSource = source) => {
    if (!newMarks.has(scope)) newMarks.set(scope, U.seen(scope, readSource));
    return newMarks.get(scope).isNew(born, readAt) ? tags([['新', 'tag--new']]) : '';
  };
  const addressed = text => viewer === 'public' ? sp(text).replaceAll('你', '本人') : text;
  function homeAddressed(value) {
    if (viewer !== 'public') return value;
    if (typeof value === 'string') return value.replace(/(等|要|请|让|由)你|你(?=同意|点头|重启|删)/g, '$1本人');
    if (!value || typeof value !== 'object') return value;
    return { ...value, text: homeAddressed(value.text), value: homeAddressed(value.value) };
  }
  const returning = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  // 后退、前进回来时以离开时存下的位置为准：地址里的“#卡片”是当初点进来时的，不再把页面拉回那张卡（M598）。
  const leftAt = returning ? history.state?.liveUI : null;
  const direct = () => focusId || (!leftAt && cards[location.hash.slice(1)]);
  const saved = returning && !direct() ? history.state?.liveUI : null;
  let restoreY = saved?.y ?? (returning && !direct() ? history.state?.liveY : null);
  let restoreCard = saved?.homeCard, restoreTimer, paintedRev, pinned = false, netPainted = false;
  function restoreHome() {
    clearTimeout(restoreTimer);
    if (restoreY == null) return;
    const card = restoreCard && cards[restoreCard.key];
    const y = card ? scrollY + card.getBoundingClientRect().top - restoreCard.top : restoreY;
    restoreY = null;
    if (Math.abs(scrollY - y) > .5) scrollTo({ top: y, behavior: 'instant' });
    if (card) pinCard(card, restoreCard.top);
  }
  // 返回总览以后，数据分几次到、卡片跟着长高或换栏：网上的数据画上以后停稳 1.5 秒、本人自己动了或过了 8 秒之前，每一帧都把点开的那张卡留在离开时的位置，
  // 和全站动效缩回去的那一块对上；这段时间里换数据不再按可见那一行顶住位置（M229）。
  function settling() { return restoreY != null || pinned; }
  function pinCard(card, top) {
    if (pinned) return;
    pinned = true;
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'], begin = performance.now();
    let still = begin, last = null;
    const stop = () => { pinned = false; inputs.forEach(type => removeEventListener(type, stop, true)); };
    inputs.forEach(type => addEventListener(type, stop, true));
    const hold = () => {
      if (!pinned) return;
      const now = performance.now(), rect = card.getBoundingClientRect(), offset = Math.round(rect.top + scrollY), height = document.documentElement.scrollHeight;
      if (!last || last.offset !== offset || last.height !== height) { still = now; last = { offset, height }; }
      if (Math.abs(rect.top - top) > .5) scrollBy({ top: rect.top - top, behavior: 'instant' });
      if (netPainted && now - still > 1500 || now - begin > 8000) { stop(); return; }
      requestAnimationFrame(hold);
    };
    hold();
  }
  if (restoreY != null && restoreCard && cards[restoreCard.key]) pinCard(cards[restoreCard.key], restoreCard.top);
  for (const event of ['wheel', 'touchmove', 'keydown']) window.addEventListener(event, e => {
    if (e.type !== 'keydown' || ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) restoreY = null;
  }, { passive: true });
  window.addEventListener('pageshow', e => {
    const saved = history.state?.liveUI;
    if (!e.persisted || !saved || focusId) return;
    restoreY = saved.y;
    restoreCard = saved.homeCard;
    restoreTimer = setTimeout(() => requestAnimationFrame(restoreHome), 650);
  });
  // 返回时先把列表放到完整高度，再恢复位置；逐行长高会把目标位置夹住。
  const paintList = (ul, rows, options) => U.list(ul, rows, { animate: entered && restoreY == null && (focused || !(focusId || home?.focus)), ...options });
  const elapsed = value => lastState?.offline ? U.time(value) : U.ago(value, at);

  // —— 等你的事 ——
  function needRow(it, detail = '', end) {
    const loud = it.kind === 'choose' || it.kind === 'do';
    // 卡上不单独放“复制给 AI”，问情况就是复制给 AI（M458，定稿卡-等你的事）
    const actions = (it.actions || []).filter(a => a.intent !== 'done').map(a => a.intent === 'ask' ? { ...a, label: '问情况' } : a);
    const value = (v, label, format = v => v) => v == null ? '' : U.fieldHtml(v && typeof v === 'object' ? { ...v, value: format(v.value) ?? v.value, text: format(v.text) ?? v.text } : format(v), { name: label, kind: viewer });
    let sub = '';
    if (loud) {
      const age = waitDays(it, end);
      sub = [age != null && (age ? `等了 ${waitText(age)}` : '等了不到 1 天'), it.minutes != null && `约 ${it.minutes} 分钟`, it.due && `${U.date(it.due)} 前`, value(U.capText(it.now, 60, true), '为什么', homeAddressed), value(it.mobile, '在哪办', v => MOBILE[v])].filter(Boolean).join(' · ');
      if (!sub && !lastState?.offline) sub = U.collectionText('等待时间、用时和办理说明');
    }
    if (it.kind === 'later') {
      const from = it.act_from || it.due;
      sub = from ? join([`${U.date(from)} 起该办了`, it.minutes && `约 ${it.minutes} 分钟`]) : join(['有空再办', it.minutes && `约 ${it.minutes} 分钟`]);
    }
    if (it.kind === 'know') sub = elapsed(it.episode_at || it.born);
    if (it.rewrite === 'pending' && it.at) sub = [sub, `${U.date(it.at)} ${U.time(it.at)}`].filter(Boolean).join(' · ');
    if (viewer === 'owner' && U.originName(it.origin, it)) sub = join([sub, U.capText(U.originName(it.origin, it), 30, true)]);
    if (viewer === 'public' && it.visibility === 'owner') sub = '';
    const fresh = seen.isNew(it.episode_at || it.born, at) ? tags([['新', 'tag--new']]) : '';
    // 本人版给完整版，不挂“仅你可见”。
    const marks = (viewer === 'owner' && it.visibility !== 'owner' ? `<span class="head__rewrite">${U.visibilityNote(it, viewer)}</span>` : '');
    return {
      key: it.id,
      cls: 'row',
      html: `${lamp({ ...it, level: it.light })}<div class="row__text">
          <p class="row__main"><span class="row__kind">${addressed(KIND[it.kind])}</span>${title(it, homeAddressed(U.capText(it.text, 30, true)), 'items')}${fresh}${marks}</p>
          ${sub ? `<p class="row__sub">${sub}</p>` : ''}${detail}
        </div><div class="row__acts">${U.goActions(it, loud && !actions.some(a => a.label === '问情况') ? [{ kind: 'copy', label: '问情况', intent: 'ask' }, ...actions] : actions)}</div>`,
    };
  }

  function renderNeeds(d, target, end = d.at) {
    const p = parts.needs;
    if (!project && viewer === 'owner') U.pruneReceipts(d.items);
    const scoped = project ? d.items.filter(it => it.project === project) : d.items;
    const focus = target?.section === 'needs' ? target : null;
    const extra = !focus?.closed && ['choose', 'do'].includes(focus?.item?.kind) && !scoped.some(it => it.id === focus.id) ? focus.item : null;
    const by = k => scoped.filter(it => it.kind === k);
    const { count, exact, text } = waitingCount(d.counts, extra ? [...scoped, extra] : scoped);
    U.html(p.head, U.head(addressed(text), { href: href('needs') }) + (allNotUrgent(d) ? '<span class="head__rewrite">都不急</span>' : ''));
    const newest = (a, b) => Date.parse(b.episode_at || b.born) - Date.parse(a.episode_at || a.born);
    // 刚在本页点过、已经办成的，后台读数跟上前先不显示
    const all = [...by('choose').sort(newest), ...by('do').sort(newest)].filter(it => !U.justSaved(it));
    const rows = needsPreview(all).map(it => needRow(it, focus && it.id === focus.id ? noticeDetail(focus.item) : '', end));
    const closed = focus && closedNoticeRow(focus), targetIndex = rows.findIndex(row => row.key === focus?.id);
    const focusedRow = closed || (targetIndex < 0 && focus?.item?.kind && !focus.closed && needRow(focus.item, noticeDetail(focus.item), end));
    if (focusedRow) rows.splice(Math.max(0, targetIndex), targetIndex < 0 ? 0 : 1, focusedRow);
    const hidden = viewer === 'public' ? d.waiting_hidden || 0 : 0;
    if (!rows.length && count != null && !hidden) {
      const note = count === 0 ? '没有在等的事' : `${exact ? `有 ${count} 件 · ` : ''}电脑开机后自动补上是哪几件`;
      rows.push({ key: 'empty', cls: 'row row--flat row--preview-note', html: `<span></span><p class="row__sub">${note}</p>` });
    }
    // 访客：写清藏了几件、各是哪一类（后台 hidden_summary 已按类数好），标题和内容不露。
    const kinds = d.hidden_summary?.counts || {}, hiddenKinds = [['do', '要本人做'], ['choose', '要本人选']].filter(([k]) => kinds[k] > 0);
    const hiddenWhat = hiddenKinds.reduce((n, [k]) => n + kinds[k], 0) === hidden ? hiddenKinds.map(([k, label]) => `${kinds[k]} 件${label}`).join('、') : `${hidden} 件要本人做或选的事`;
    if (hidden) rows.push({ key: 'private-needs', cls: 'row row--flat row--preview-note', html: `<p class="row__sub">另有 ${esc(hiddenWhat)}，标题和内容只有本人看得到</p>` });
    paintList(p.main, rows, { animate: false });
    // 藏掉的几件已合成上面“另有……只有本人看得到”一行，“还有 N 条”只数看得见的。
    needsTotal = (project ? all.length : count - hidden - (extra ? 1 : 0)) + Number(!!focusedRow && targetIndex < 0);
    fitCard('needs');
    U.html(p.summary, [['know', '要你知道'], ['later', '你放着']].map(([k, label]) => `${addressed(label)} ${quantity(d.counts, k)} 件`).join(' · ') + (count === 0 ? '' : oldestWait(d, all, end)));
    p.closed.hidden = p.foot.hidden = !(project && !all.length);
    if (!p.closed.hidden) { U.html(p.closed, `近 7 天下去的 ${quantity(d, 'closed7')} 条`); p.closed.onclick = () => { location.href = href('needs') + '#closed'; }; }
  }
  function waitingCount(counts, items) {
    let count = 0, exact = true;
    for (const kind of ['choose', 'do']) {
      const listed = items.filter(it => it.kind === kind).length;
      const value = counts?.[kind];
      const known = Number.isInteger(value) && value >= 0;
      count += Math.max(listed, known ? value : 0);
      exact = exact && known && value >= listed && !isLower(counts, kind);
    }
    const text = count || exact ? `等你 ${exact ? '' : '至少 '}${count} 件` : '等你的事 · 没有记录';
    return { count: count || exact ? count : null, exact, text };
  }
  function oldestWait(d, rows, end) {
    const age = (d.waiting_scope && d.waiting_scope !== 'choose_do' ? null : d.waiting_oldest_days) ?? Math.max(-1, ...rows.map(it => waitDays(it, end) ?? -1));
    return age >= 0 ? ` · 等着办的最久 ${waitText(age)}` : '';
  }
  const CLOSED = { done: '你办完了', declined: '你说不办了', expired: '展示期已到', ai_closed: 'AI 关的', acknowledged: '本人已知', merged: '并进了别的条', unknown: '当时只记了关闭' };
  function closedNoticeRow({ id, item, closed }) {
    const outcome = closed?.text || CLOSED[closed?.kind];
    if (!outcome || !Number.isFinite(Date.parse(closed.at))) return null;
    const label = U.fieldHtml(typeof outcome === 'string' ? addressed(outcome) : outcome, { name: '了结情况', kind: viewer });
    const link = title({ ...item, id: item?.id || id }, item?.text || '查看原事项', 'items');
    return { key: id, cls: 'row row--flat', html: `<div class="row__text"><p class="row__main">${U.date(closed.at)} ${U.time(closed.at)} · ${label} · ${link}</p></div>` };
  }
  function noticeDetail(item) {
    if (!item?.detail_text || viewer === 'public' && (item.visibility === 'owner' || item.public === 'owner')) return '';
    const detail = U.fieldHtml(U.capText(item.detail_text, 200), { name: '事项详情', kind: viewer });
    const opened = parts.needs.main.querySelector(`[data-key="${CSS.escape(item.id)}"] .notice-detail`)?.open;
    return detail ? `<details class="row__sub notice-detail"${opened ? ' open' : ''}><summary>事项详情</summary><p style="white-space: pre-line">${detail}</p></details>` : '';
  }

  // —— AI 对话 ——
  const who = c => [(U.draw10.bareModel || U.draw10.modelName)(c), c.effort].filter(Boolean).map(v => U.fieldHtml(v, { name: '型号', kind: viewer })).join(' · ');
  function chatActions(c) {
    const label = value => typeof value === 'string' && value ? value : !value?.hidden && value?.visibility !== 'owner' && typeof (value?.text ?? value?.value) === 'string' ? value.text ?? value.value : '打开对话';
    const actions = (c.actions?.length ? c.actions : [{ kind: 'copy', label: '问情况', intent: 'ask' }]).map(a => a.kind === 'open' ? { ...a, label: label(a.label) } : a);
    const open = typeof c.open === 'string' ? { label: '打开对话', target: c.open } : c.open;
    return U.actions(c, !open || actions.some(a => a.kind === 'open') ? actions : [...actions, { ...open, label: label(open.label), kind: 'open' }]);
  }
  const chatField = (value, item = {}) => ({ ...(value && typeof value === 'object' ? value : { text: value }), visibility: value?.visibility ?? item.visibility, rewrite: value?.rewrite ?? item.rewrite, hidden_what: value?.hidden_what ?? item.hidden_what });
  function chatWords(value, item = {}, plain = false) {
    const field = chatField(value, item);
    if (viewer === 'public' && (item.visibility === 'owner' || item.public === 'owner' || field.visibility === 'owner')) return '';
    if (field.text == null && field.value == null && field.rewrite !== 'pending' && !field.hidden && !field.hidden_block && field.public !== 'owner') return '';
    const words = U.chatFields.cell(field, '对话内容', item, viewer, 0, true, plain);
    return field.rewrite === 'pending' ? `<span class="rewrite-pending">${words}</span>` : words;
  }
  const chatStart = chat => U.chatStart?.(chat) || [chat.started_at || chat.born, '记录起于'];
  function chatShortName(c) {
    const projectItem = home?.projects?.items?.find(p => p.id === c.project);
    const extra = projectItem && !projectItem.hidden && !projectItem.hidden_block && !(viewer === 'public' && (projectItem.visibility === 'owner' || projectItem.public === 'owner')) ? [chatField(projectItem.name, projectItem)] : [];
    if (U.chatShortName) return U.chatShortName(c, viewer, extra) || 'AI 对话';
    const short = value => {
      if (value?.hidden || value?.hidden_block || value?.rewrite === 'pending' || value?.visibility === 'pending' || viewer === 'public' && (value?.visibility === 'owner' || value?.public === 'owner')) return '';
      const line = U.fieldText(value, viewer).trim().split(/[\n。！？]/, 1)[0];
      return /^(?:已完成|做完了|正在处理|在干|等回答|没有标题|没有记录)(?:\s|$)|没有.*记录$|(?:仅本人可见|可信设备可见|正在换说法)$|^[-\w]+$/.test(line) ? '' : viewer !== 'owner' && line.length > 32 ? line.slice(0, 31) + '…' : line;
    };
    const [start, scope] = chatStart(c);
    return [c.doing, c.progress, c.latest_reply, c.text, c.project_name, ...extra].map(short).find(Boolean) || join([short(c.model_text ?? c.model) || U.fieldText(c.model_text ?? c.model, viewer), start && `${scope} ${recordStamp(start)}`]);
  }
  function chatHeading(c) {
    const field = chatField(c.title, c);
    const hidden = field.visibility === 'owner' && field.text == null && field.value == null || viewer === 'public' && (c.visibility === 'owner' || c.public === 'owner' || field.visibility === 'owner' || field.public === 'owner' || field.hidden);
    if (hidden) return { field, hidden };
    const label = field.rewrite === 'pending' && !field.text && !field.value || field.hidden ? field : (c.title_missing || field.text === '没有标题' ? '' : U.chatFields.plain(U.fieldText(field, viewer))) || chatShortName(c) || '无标题';
    return { field, label };
  }
  function chatTitle(c, { field, hidden, label } = chatHeading(c)) {
    if (viewer === 'public' && c.content_locked) return c.detail === false ? '<span class="row__title">对话标题仅本人可见</span>' : title({ ...c, visibility: 'same' }, '对话标题仅本人可见', 'chats');
    if (hidden) return `<span class="row__title">${U.fieldHtml(field, { name: 'AI 对话', place: 'title', kind: viewer })}</span><span class="row__meta">${U.fieldHtml(field, { name: '对话名', kind: viewer })}</span>`;
    const note = field.visibility === 'rewritten' || field.public === 'rewrite' ? U.fieldHtml({ visibility: 'rewritten' }, { kind: viewer }) : '';
    if (c.detail === false) return `<span class="row__title">${U.fieldHtml(label, { kind: viewer, place: 'title', name: '对话' })}</span>${note}`;
    return `${title(c, label, 'chats')}${note ? ` <span class="head__rewrite">${note}</span>` : ''}`;
  }
  function chatHelperDetails(helpers, kind) {
    if (kind !== 'owner') return '';
    const rows = helpers.filter(h => U.fieldText(h.owner_detail, kind).trim()).map(h => {
      const label = U.fieldHtml(h.title ?? h.model_text ?? h.model, { name: '帮手名', kind });
      const detail = U.fieldHtml(h.owner_detail, { name: '帮手详情', kind });
      return `<li>${[label, detail].filter(Boolean).join(' · ')}</li>`;
    });
    return rows.length ? `<details class="row__sub" style="overflow-wrap:anywhere"><summary>帮手详情</summary><ul class="helpers" style="white-space:normal">${rows.join('')}</ul></details>` : '';
  }
  function chatRow(c, { heading, finished, hint } = {}) {
    const ago = finished || elapsed(c.at), word = U.chatFields.rowState(c, viewer);
    const quota = U.chatFields.quota(c, viewer);
    const state = quota ? '' : lastState?.offline ? join([`离线前${word}`, ago]) : c.content_locked || ['stopped', 'done', 'running'].includes(c.state) ? join([word, ago]) : word;
    const helperRows = Array.isArray(c.helpers) ? c.helpers : c.helpers?.active || [];
    const helpers = U.chatFields.workingHelpers(c);
    const detail = helperRows.some(h => h.owner_detail != null) ? chatHelperDetails(helperRows, viewer) : '';
    const e = c.estimate, work = [e?.planned_min != null && `报 ${e.planned_min} 分钟`, e?.worked_min != null && `已干 ${e.worked_min} 分钟`, e?.over_min > 0 && `超 ${e.over_min} 分钟`].filter(Boolean).join(' · ');
    const gap = (key, label) => {
      const g = Array.isArray(c.field_gaps) ? c.field_gaps.find(g => g.field === key) : c.field_gaps?.[key];
      return U.fieldText(typeof g === 'string' ? g : g?.reason || g?.gap, viewer).trim() || U.collectionText(label);
    };
    const modern = Object.hasOwn(c, 'worked_seconds');
    const span = sec => [Math.floor(sec / 3600) && `${Math.floor(sec / 3600)} 小时`, Math.floor(sec / 60) % 60 && `${Math.floor(sec / 60) % 60} 分`, (sec % 60 || sec === 0) && `${sec % 60} 秒`].filter(Boolean).join(' ');
    const timing = [Number.isFinite(c.elapsed_seconds) && `历时 ${span(c.elapsed_seconds)}`, Number.isFinite(c.worked_seconds) && `实际工时 ${span(c.worked_seconds)}`].filter(Boolean).join(' · ');
    const { plan, current, label } = U.chatFields.planInfo(c);
    const locked = viewer === 'public' && c.content_locked;
    const progress = locked ? esc(label) : c.detail && plan[current] && label ? `<a class="more" href="${esc(route(`/live/chat/?id=${encodeURIComponent(c.id)}`) + '#plan-box')}">${esc(label)} ›</a>` : '', worked = chatWords(timing || (!modern && (Object.hasOwn(c, 'elapsed_seconds') ? gap('elapsed_seconds', '历时') : work || gap('elapsed_seconds', '历时'))) || '', c);
    const progressText = U.chatProgressText(c.text, c, viewer);
    const rawReply = quota || modern ? progressText ?? c.latest_reply : Object.hasOwn(c, 'latest_reply') ? c.latest_reply : progressText;
    const replyField = U.chatPreviewSummary(rawReply, c, viewer);
    const fieldLock = replyField && typeof replyField === 'object' && viewer === 'public' && c.visibility !== 'owner' && c.public !== 'owner' && (replyField.visibility === 'owner' || replyField.public === 'owner' || replyField.hidden || replyField.hidden_block);
    const reply = c.content_locked ? '' : fieldLock ? U.fieldHtml(replyField, { name: '最新进展', kind: viewer }) : U.chatFields.repeatsState(replyField, c, viewer) ? '' : chatWords(homeAddressed(replyField), c, replyField !== rawReply) || (!modern && chatWords(gap('latest_reply', '最新回复'), c));
    const toggle = viewer === 'owner' ? '' : '<button class="more chat-preview__toggle" type="button" aria-expanded="false" hidden>展开全文</button>';
    const preview = reply ? `<div class="row__sub chat-preview"><p class="chat-preview__text">${reply}</p>${toggle}</div>` : '';
    const helperText = helpers && (c.state === 'done' ? `后台帮手另在处理（${helpers} 个）` : `帮手 ${helpers} 个在干`);
    const lockedMeta = locked ? [c.stage, c.project_name, c.born && ('开始于 ' + U.time(c.born)),
      c.compaction?.count > 0 && ('压缩 ' + c.compaction.count + ' 次'),
      ...new Set(helperRows.map(h => h.model || h.model_text).filter(Boolean))].filter(Boolean).map(esc) : [];
    const meta = [[U.chatFields.appTag(c), who(c)].filter(Boolean).join(' '), esc(state), hint && esc(hint), helperText && esc((lastState?.offline ? '离线前' : '') + helperText), ...lockedMeta]
      .filter(Boolean).map(part => `<span class="chat-meta-part">${part}</span>`).join(' ');
    return { key: c.id, cls: 'row row--chat row--compact', html: `${lamp(c)}<div class="row__text"><p class="row__main">${chatTitle(c, heading)}<span class="row__meta">${meta}</span></p>${locked ? '<p class="row__sub">计划、思考摘要和回复仅本人可见</p>' : preview}${progress || worked ? `<p class="row__sub chat-progress-line">${[progress, worked].filter(Boolean).join(' · ')}</p>` : ''}${detail}</div><div class="row__acts">${chatActions(c)}</div>` };
  }

  function chatSecondStamp(at, precision) {
    if (typeof at !== 'string' || !timed(at)) return '';
    const stamp = recordStamp(at, precision);
    return precision !== 'minute' && precision !== 'date' && /T\d\d:\d\d:\d\d/.test(at) ? `${stamp}:${String(new Date(at).getUTCSeconds()).padStart(2, '0')}` : stamp;
  }
  function chatPreviewRows(chats) {
    const completion = c => c.state === 'done' ? chatSecondStamp(c.at, c.at_precision) : '';
    const start = c => chatSecondStamp(chatStart(c)[0]);
    const source = c => ({ __proto__: null, manual: '本人发起', scheduled: '定时任务', automation: '自动任务' })[c.source];
    const rows = chats.map(chat => {
      const heading = chatHeading(chat);
      const label = typeof heading.label === 'string' && !heading.field.hidden_block && heading.field.visibility !== 'pending' ? heading.label.trim() : '';
      return { chat, heading, label };
    });
    return rows.map(row => {
      const { chat, heading, label } = row;
      const peers = label ? rows.filter(other => other.label === label) : [];
      if (peers.length < 2) return chatRow(chat, { heading });
      const finished = completion(chat), tied = peers.filter(other => completion(other.chat) === finished);
      if (finished && tied.length === 1) return chatRow(chat, { heading, finished });
      const started = start(chat), sameStart = tied.filter(other => start(other.chat) === started);
      const origin = source(chat), indistinguishable = sameStart.filter(other => source(other.chat) === origin);
      const hint = join([started && `${chatStart(chat)[1]} ${started}`, (!started || sameStart.length > 1) && origin,
        indistinguishable.length > 1 && `第 ${tied.indexOf(row) + 1} 场`]);
      return chatRow(chat, { heading, finished, hint });
    });
  }

  function renderChatSources(host, d) {
    const count = d.unconnected_source_count, positive = Number.isInteger(count) && count > 0;
    const label = count === null ? '没有记录' : positive ? '还有 ' + count + ' 个没接上' : '';
    const list = positive && viewer === 'owner' && Array.isArray(d.unconnected_sources) ? d.unconnected_sources : [];
    const rows = list.map(item => '<li>' + [item.tool, item.path, item.reason].filter(Boolean).map(esc).join(' · ') + '</li>').join('');
    host.hidden = !label;
    U.html(host, rows ? '<details class="row__sub"><summary class="more">' + label + '</summary><ul>' + rows + '</ul></details>' : label ? '<p class="row__sub">' + label + '</p>' : '', false);
  }

  const oldReading = d => d?.stale || ['stale', 'old'].includes(d?.q) || ['stale', 'old'].includes(d?.state) || d?.read_error || /最近一次记录于/.test(sp(d?.stale_text || d?.text));
  const chatCountsAt = d => Object.hasOwn(d, 'source_at') && d.source_at == null ? null : d.window?.to || blockAt(d);
  function chatSnapshot(d) {
    const observed = chatCountsAt(d);
    const old = lastState?.offline || oldReading(d) || timed(observed) && new Date(lastState?.now || Date.now()) - Date.parse(observed) >= 120000;
    const counts = d.last_counts && d.running == null && d.waiting == null && d.done72 == null ? d.last_counts : d;
    return { counts, observed: counts === d ? observed : counts.at || counts.window?.to, old: old || counts !== d };
  }
  function chatCardHead({ summary, recorded, marker, url }) {
    const arrow = url ? ' <span class="head__tail chat-head-arrow" aria-hidden="true">›</span>' : '';
    const title = `<span class="chat-head-title"><span class="head__lead">AI 对话</span> <small class="chat-head-scope">不含定时和自动</small>${arrow}</span>`;
    const stamp = recorded ? `<span data-recorded="${esc(recorded)}">${esc(recorded)} 记录：</span> ` : '';
    const stats = summary ? ` <span class="head__tail chat-head-summary">${stamp}${esc(summary)}</span>` : '';
    const link = url ? `<a class="head__link chat-head-link" href="${esc(url)}">${title}${stats}</a>` : title;
    return link + (marker ? `<span class="head__marker">${U.fieldHtml(marker, { name: 'AI 对话', kind: viewer })}</span>` : '');
  }
  function renderChats(d) {
    if (!hasCardData('chats', d)) { emptyCard('chats', d); return; }
    const p = parts.chats, { counts, observed, old } = chatSnapshot(d);
    const recorded = recordStamp(observed) || (old && sp(d.stale_text || d.text).match(/最近一次记录于\s*((?:\d{2}-\d{2}\s+)?\d\d:\d\d)/)?.[1]);
    const concurrent = counts.running != null && `${quantity(counts, 'running')} 个${old && !recorded ? '当时' : ''}在干`;
    const waiting = counts.waiting != null && addressed(`${quantity(counts, 'waiting')} 个等你回答`);
    const pieces = [concurrent, waiting, counts.done72 != null && `近 72 小时做完 ${quantity(counts, 'done72')} 个`];
    const missing = [counts.running == null && '在干数', counts.done72 == null && '近 72 小时做完数'].filter(Boolean);
    const marker = typeof d.text === 'object' && d.text;
    const summary = join(pieces);
    const heading = chatCardHead({ summary, recorded, marker, url: href('chats') });
    U.html(p.head, heading + (missing.length && !marker ? `<br><span class="row__sub">${esc(U.collectionText(missing.join('、')))}</span>` : ''));
    if (p.sources) renderChatSources(p.sources, d);
    const rank = c => c.state === 'waiting' ? 0 : c.state === 'failed' ? 1 : ['running', 'queued', 'reconnecting'].includes(c.state) ? 2 : c.source === 'manual' ? 3 : 4;
    const active = (d.active || []).filter(c => c.state !== 'done'), working = active.length > 0 || d.running > 0 || d.waiting > 0;
    const all = [...new Map((working ? active : [...d.recent || [], ...d.fallback || []]).map(c => [c.id, c])).values()].sort((a, b) => rank(a) - rank(b) || Date.parse(b.at) - Date.parse(a.at));
    const activePreview = working ? all : [];
    const recent = [...new Map([...(d.recent || []), ...(d.fallback || [])].filter(c => c.state === 'done').map(c => [c.id, c])).values()].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
    const preview = chatPreviewRows([...activePreview, ...recent.slice(0, 13)]);
    for (const id of expandedReplies) if (!preview.some(row => row.key === id)) expandedReplies.delete(id);
    const activeEnd = activePreview.length;
    paintList(p.active, preview.slice(0, activeEnd), { animate: false });
    paintList(p.done, preview.slice(activeEnd, activeEnd + shown.done), { animate: false });
    paintList(p['recent-rest'], preview.slice(activeEnd + shown.done), { animate: false });
    chatWorking = working;
    // 列出来的在干行比计数多（比如状态不明的）时按列出来的算，多出来没摆的也写进“还有 N 个”，不悄悄藏掉。
    chatTotal = working ? Math.max(d.total ?? (d.running || 0) + (d.waiting || 0), all.length) : all.length;
    fitCard('chats');
    U.html(p['done-label'], recent.length ? '已完成' : '');
    balanceHome();
  }

  // —— 电脑 ——
  function phoneConnection(d, device) {
    const link = d?.link ?? device?.link, status = d?.connection ?? device?.connection;
    const name = { lan: '局域网', tailscale: 'Tailscale', bluetooth: '蓝牙' }[link?.route];
    const stamp = recordStamp(status?.at || link?.at || blockAt(d) || d?.received?.last_at);
    const old = lastState?.offline || (status ? status.state !== 'online' || oldReading(status) : oldReading(d)) || oldReading(link);
    if (status?.state === 'offline' || d?.state === 'offline' || d?.offline === true) return lastState?.offline || oldReading(status) ? `手机调试连接上次未连通${stamp ? `（${stamp} 记录）` : ''}` : '手机调试连接未连通';
    if (name) return old ? `手机上次经${name}连接${stamp ? `（${stamp} 记录）` : ''}` : `手机经${name}连接`;
    if (!old && (status?.state === 'online' || !status && device?.state === 'online')) return '手机调试已连接，线路未记录';
    return d?.received?.last_at || d?.metrics?.some(v => v.id === 'battery' && v.value != null) ? '手机连接线路未记录' : null;
  }
  function renderComputer(d, screen, phoneData) {
    const trafficBytes = bytes => U.trafficBytes(bytes);  // 按 1024 进位，和海外流量页同一个函数
    const p = parts.computer;
    const offline = lastState?.offline;
    const m = Object.fromEntries((d.metrics || []).map((x) => [x.id, x]));
    const val = (x, f) => (x && x.value != null ? f(x) : null);
    const fmtTemp = n => `${Math.round(n)}℃`;
    const pair = (use, temperature) => join([val(use, x => quantity(x, 'value', n => `${Math.round(n)}%`)), temperature]) || null;
    const sampleTime = (node, fallback) => {
      const stamp = node?.source_at ?? node?.at ?? fallback;
      if (!timed(stamp)) return null;
      const old = !!(offline || oldReading(node) || node?.stale_after > 0 && Date.now() - Date.parse(stamp) > node.stale_after * 1000);
      return { key: JSON.stringify([stamp, node?.timestamp_basis, old]), text: `${old ? '上次' : '记录到'} ${recordStamp(stamp)}` };
    };
    const cpuSample = m.cpu?.value != null ? sampleTime(m.cpu) : null;
    const sharedMemory = cpuSample ? [[m.memory, '内存已用'], [m['memory-total'], '内存总容量']].filter(([node]) =>
      node?.value != null && sampleTime(node)?.key === cpuSample.key) : [];
    const shared = new Set(sharedMemory.length ? [m.cpu, ...sharedMemory.map(([node]) => node)] : []);
    const sharedNote = sharedMemory.length ? `CPU 占用、${sharedMemory.length === 2 ? '内存' : sharedMemory[0][1]} ${cpuSample.text}` : '';
    const withReadings = (text, ...sources) => {
      if (!text) return text;
      const notes = sources.map(([label, node, fallback]) => [label, shared.has(node) ? null : sampleTime(node, fallback)]).filter(([, sample]) => sample);
      if (!notes.length) return text;
      const same = notes.length === sources.length && notes.every(([, sample]) => sample.key === notes[0][1].key);
      const detail = same ? notes[0][1].text : join(notes.map(([label, sample]) => `${label} ${sample.text}`));
      return text + `<small>${esc(detail)}</small>`;
    };
    const uptime = screen?.uptime ?? m.uptime?.value;
    const summary = typeof d.text === 'string' ? d.text : '';
    const boot = Number.isFinite(uptime) ? `开机 ${U.minutes(Math.floor(uptime / 60))}` : summary.match(/(?:开机|主机开了)\s*\d+\s*小时(?:\s*[1-9]\d*\s*分钟)?/)?.[0].replace(/^主机开了/, '台式机开了');
    const cpu = m['cpu-temp'] ?? (Object.hasOwn(d, 'cpu_c') ? { value: d.cpu_c, at: d.cpu_at, q: d.cpu_q } : null), legacyTemp = summary.match(/(?:CPU\s*)?(-?\d+(?:\.\d+)?)\s*(?:℃|°C)/)?.[1];
    const temperature = cpu ? val(cpu, x => quantity(x, 'value', fmtTemp)) : legacyTemp != null ? fmtTemp(Number(legacyTemp)) : null;
    const bootTime = (screen?.uptime != null ? sampleTime({ at: screen.computer_at, stale_after: screen.stale_after }) : sampleTime(m.uptime))?.text;
    U.html(p.head, cardHead([boot && boot + (bootTime ? `（${bootTime}）` : ''), temperature && `CPU ${temperature}`, sharedNote, typeof d.text === 'object' && d.text], '电脑', { href: href('computer') }));
    const devices = [...(d.devices || [])];
    const phone = phoneData || devices.some(x => x.id === 'phone') ? phoneConnection(phoneData, devices.find(x => x.id === 'phone')) : null;
    if (phone && !devices.some(x => x.id === 'phone')) devices.push({ id: 'phone' });
    const diskGrowth = x => x.growth == null ? '' : x.growth === 0 ? '本周已用无变化'
      : `本周已用${x.growth < 0 ? '减少' : '增加'} ${quantity(x, 'growth', n => U.gb(Math.abs(n)))}`;
    const used = m.memory?.value, total = m['memory-total']?.value, traffic = d.traffic, growthTop = d.storage_growth_top;
    const fileGrowth = value => U.fieldHtml(value, { name: '分类占用', kind: viewer });
    let growthReading = `<span class="row__sub">${fileGrowth(d.storage_growth_gap || '这次没读到能对比的分类记录')}</span>`;
    if (growthTop?.visibility === 'owner' && viewer === 'public') growthReading = fileGrowth(growthTop);
    else if (Number.isFinite(growthTop?.bytes)) {
      const until = timed(growthTop.at) && `截至 ${U.date(growthTop.at)} ${U.time(growthTop.at)}`;
      growthReading = (growthTop.bytes > 0 ? `${fileGrowth(growthTop.name)} · 多占 ${U.nowrap(U.gb(growthTop.bytes))}` : '已测类别都没有增加')
        + (until ? `<small>${esc(until)}</small>` : '');
    }
    // 读数不是今天的（离线旧页过了半夜）写日期，不叫“今天”（M062）
    const trafficAt = traffic?.from || traffic?.to, trafficDay = timed(trafficAt) && day(trafficAt) !== day(!lastState?.offline && lastState?.now || Date.now()) ? U.date(trafficAt) : '今天';
    const trafficText = traffic?.upload != null && traffic?.download != null ? `${trafficDay} ${quantity({ value: traffic.upload + traffic.download, q: isLower(traffic, 'upload') || isLower(traffic, 'download') ? 'partial' : 'ok' }, 'value', trafficBytes)}` : traffic?.upload != null || traffic?.download != null ? join([`上传 ${quantity(traffic, 'upload', trafficBytes)}`, `下载 ${quantity(traffic, 'download', trafficBytes)}`]) : '';
    const diskFree = m['disk-free'], diskTime = sampleTime(diskFree)?.text;
    const trafficTime = traffic?.to && `${offline || oldReading(traffic) ? '上次截至' : '截至'} ${recordStamp(traffic.to)}`;
    const rows = [
      ['CPU', withReadings(pair(m.cpu, temperature), ['占用', m.cpu], ['温度', cpu, screen?.cpu_at]), m.cpu],
      ['显卡', withReadings(pair(m.gpu, val(m['gpu-temp'], x => quantity(x, 'value', fmtTemp))), ['占用', m.gpu], ['温度', m['gpu-temp']])],
      ['内存', withReadings(used != null || total != null ? `用了 ${U.nowrap(quantity(m.memory, 'value', U.gb))} · ${U.nowrap(`共 ${quantity(m['memory-total'], 'value', U.gb)}`)}` : null,
        ['已用', m.memory], ['总容量', m['memory-total']])],
      ['最紧的盘', val(m['disk-free'], x => { const label = x.note || (x.drive ? sp(x.drive).replace(/([A-Za-z]):?\s*(?:盘)?/g, '$1 盘') : x.label === '最紧的盘' ? '' : typeof x.label === 'string' ? x.label.replace(/剩余$/, '') : x.label) || ''; const growth = diskGrowth(x); return `<span class="disk-note">${U.fieldHtml(label, { name: '磁盘', kind: viewer })}</span> 还剩 ${U.nowrap(quantity(x, 'value', U.gb))}${diskTime ? `<small>${esc(diskTime)}</small>` : ''}${growth ? `<small>${U.nowrap(growth)}</small>` : ''}`; }), diskFree, '/live/storage/'],
      ['近 7 天占空间涨得最多', growthReading, false, '/live/storage/'],
      ['海外流量', traffic ? U.nowrap(trafficText) + (traffic.hour_bytes != null ? ` <span class="traffic-hour">${U.nowrap(`近一小时 ${quantity(traffic, 'hour_bytes', trafficBytes)}`)}</span>` : '') + (trafficTime ? `<small>${esc(trafficTime)}</small>` : '') + (traffic.q === 'partial' && traffic.gap ? `<small>${U.fieldHtml(traffic.gap, { name: '流量说明', kind: viewer })}</small>` : '') : null, false, '/live/traffic/'],
      ['设备', devices.filter(x => x.id !== 'main').map(x => {
        if (x.id === 'phone') return `<a class="kv__link" href="${esc(route('/live/phone/'))}">${esc(phone || '手机连接线路未记录')}</a>`;
        const name = { secondary: '笔记本', secondary_laptop: '笔记本', remote: '远程' }[x.id] || sp(x.label || x.name || x.title || x.text) || x.id;
        const status = x.state === 'online' ? x.id === 'remote' ? '连得上' : '在线' : x.state === 'offline' ? '连不上' : U.collectionText('状态');
        if (x.id === 'secondary' || x.id === 'secondary_laptop') return `<a class="kv__link" href="${esc(route('/live/laptop/'))}">${esc(name + status)} ›</a>`;
        return `<span>${esc(name + status)}</span>`;
      }).join(' · '), null, '', '/live/computer/'],
    ];
    const kvValue = (label, value) => value == null ? `<span class="row__sub">${esc(U.collectionText(label))}</span>` : /没有记录|还在采集|开始记/.test(value) && !value.includes('<') ? `<span class="row__sub">${value}</span>` : value;
    U.html(p.kv, rows.filter(([, v]) => !offline || v != null).map(([k, v, hot, link, labelLink]) => `<div class="kv__row">${lamp(hot)}<dt>${labelLink ? `<a href="${esc(route(labelLink))}">${k} ›</a>` : link ? `<span class="kv__label${k.length > 9 ? ' kv__label--wide' : ''}">${esc(k)} ›</span>` : esc(k)}</dt><dd>${link ? `<a class="kv__link" href="${esc(route(link))}" aria-label="${k}，查看详情">${kvValue(k, v)}</a>` : kvValue(k, v)}</dd></div>`).join(''));
    computerStability(p.why, d.stability_note);
    const it = d.interrupt;
    const note = offline || !it ? '' : it.text || (it.q === 'ok' && !it.chats && !it.tasks ? '现在重启不打断什么' : '');
    p.note.hidden = !note;
    U.html(p.note, U.fieldHtml(note, { name: '运行情况', kind: viewer }));
  }

  function computerStability(host, note) {
    const text = typeof note === 'string' ? note.replace(/\b\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)?/g, at => `${U.date(at)} ${U.time(at)}`) : note;
    host.hidden = !text; U.html(host, U.fieldHtml(text, { name: '严重异常', kind: viewer }));
  }
  // —— 手机：每样数自己的时刻；连不上时保留上一次，缺数不补零 ——
  function renderPhone(d) {
    const p = parts.phone, unknown = !d || d.state === 'unknown';
    const offline = d?.state === 'offline' || d?.offline === true, metrics = d?.metrics || [];
    const m = Object.fromEntries(metrics.map(x => [x.id, x]));
    const value = id => ['unavailable', 'computing'].includes(m[id]?.state) ? null : m[id]?.value;
    const dayLabel = (row, fallback) => {
      const at = row?.period_date || row?.coverage?.from || row?.at;
      return !Number.isFinite(Date.parse(at)) ? fallback : U.date(at) === U.date(lastState?.now ?? Date.now()) ? '今天' : `${U.date(at)} `;
    };
    const screenLabel = `${dayLabel(m.screen_on, '上次')}亮屏`;
    const duration = value('screen_on') == null ? U.collectionText("亮屏", m.screen_on)
      : quantity(m.screen_on, 'value', n => n > 0 && n < 60 ? `${Math.floor(n)} 秒` : U.minutes(Math.floor(n / 60)));
    const usage = value('screen_on') == null ? duration : `${screenLabel} ${duration}`;
    const unlocks = value('unlocks') == null ? U.collectionText("解锁", m.unlocks) : `解锁 ${quantity(m.unlocks, 'value')} 次`;
    const text = unknown ? U.collectionText("手机", d) : offline ? `手机连不上${d.offline?.since ? ` · ${U.time(d.offline.since)} 起` : ''}` : value('screen_on') != null ? `手机${usage}${value('unlocks') == null ? '' : ` · ${unlocks}`}` : d.text || `手机${usage} · ${unlocks}`;
    const primary = metrics.find(x => typeof value(x.id) === 'number');
    const screenGap = !offline && !unknown && value('screen_on') == null ? m.screen_on?.gap || d?.blocks?.usage?.reason || d?.reason || usage : '';
    const fallbackHead = !offline && (screenGap || /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|没读全|还不准/.test(text)) ? join([value('screen_on') != null && usage, value('unlocks') != null && unlocks, value('battery') != null ? `电量 ${quantity(m.battery, 'value', n => `${n}%`)}` : primary && `${primary.label || ''} ${quantity(primary, 'value')} ${primary.unit || ''}`, !screenGap && text]) : text;
    const phoneHead = fallbackHead;
    const readingTimes = ids => [...new Set(ids.map(id => {
      const metric = m[id], sampled = metric?.source_at ?? metric?.at;
      if (!timed(sampled) || value(id) == null) return '';
      return `${offline || oldReading(metric) ? '上次' : '截至'} ${U.date(sampled)} ${U.time(sampled)}`;
    }))].filter(Boolean).map(text => `<span class="phone-reading-time">${esc(text)}</span>`).join(' · ');
    const usageCutoff = !unknown && readingTimes(['screen_on', 'unlocks']);
    const head = cardHead(phoneHead, '手机', { href: href('phone') }).replace(/(<span class="head__tail">[\s\S]*<span class="head__tail">›<\/span>)/, '<span class="phone-head-tail">$1</span>');
    U.html(p.head, head + (usageCutoff ? `<br><span class="row__sub phone-head-cutoffs">${usageCutoff}</span>` : '') + (screenGap ? `<br><span class="row__sub">${U.fieldHtml(screenGap, { name: '亮屏情况', kind: viewer })}</span>` : ''));
    cards.phone.dataset.phoneState = d?.state || 'unknown';
    const charging = value('charging'), temp = value('battery_temp');
    const battery = join([value('battery') == null ? U.collectionText('电量', m.battery) : quantity(m.battery, 'value', n => `${n}%`), charging == null ? '' : charging ? '在充电' : '没充电', temp == null ? '' : quantity(m.battery_temp, 'value', n => `${n}℃`)]);
    const kind = value('net_kind'), trafficId = m.traffic_today ? 'traffic_today' : 'traffic_today_mobile';
    const wifiField = value('ssid') && typeof value('ssid') === 'object' ? { visibility: m.ssid?.visibility, ...value('ssid') } : m.ssid;
    // 上网那行只在行尾写一次“截至”（同这张卡别的行）；行尾读不到时间才把流量自己的时间写在流量后面（M532）
    const netCutoff = readingTimes(['net_kind', 'carrier', 'ssid']), trafficCutoff = !netCutoff && readingTimes([trafficId]);
    const trafficUse = value(trafficId) == null ? '' : ` · ${esc(`${dayLabel(m[trafficId], '上次')}手机流量 ${quantity(m[trafficId], 'value', U.gb.scaled)}`)}${trafficCutoff ? ' · ' + trafficCutoff : ''}`;
    const wifiName = value('ssid') != null || m.ssid?.visibility ? U.fieldHtml(wifiField, { name: 'WiFi 名称', kind: viewer }) : U.collectionText("WiFi 名称", m.ssid);
    const net = (kind === 'wifi' ? `WiFi${wifiName ? ` · ${wifiName}` : ''}` : kind && typeof kind === 'object' ? U.fieldHtml(kind, { name: '联网方式', kind: viewer }) : kind === 'none' ? '没网' : ['sim1', 'sim2'].includes(kind) ? [kind.toUpperCase(), value('carrier') ? U.fieldHtml(value('carrier') && typeof value('carrier') === 'object' ? { visibility: m.carrier?.visibility, ...value('carrier') } : m.carrier, { name: '运营商', kind: viewer }) : U.collectionText("运营商", m.carrier)].filter(Boolean).join(' · ') : U.collectionText()) + trafficUse;
    const storage = join([value('storage_free') == null ? U.collectionText("剩余空间", m.storage_free) : `还剩 ${quantity(m.storage_free, 'value', U.gb.scaled)}`, value('storage_total') == null ? U.collectionText("总容量", m.storage_total) : `共 ${quantity(m.storage_total, 'value', U.gb.scaled)}`]);
    const days = value('storage_days_to_full');
    const growth = days != null && days <= 60 ? join([value('storage_week_growth') != null && `这周涨 ${quantity(m.storage_week_growth, 'value', U.gb.scaled)}`, `照这样${isLower(m.storage_days_to_full, 'value') || days < 1 ? '' : '约'} ${quantity(m.storage_days_to_full, 'value', daysText)}满`]) : '';
    const pendingStorage = [...new Set(['storage_week_growth', 'storage_days_to_full'].filter(id => m[id]?.value === null && m[id]?.accumulating).map(id => U.accumulatingText(m[id].accumulating)))].join(' · ');
    const batteryStatus = U.status(m.battery), storageStatus = U.status(m.storage_free);
    const batteryHot = ['amber', 'red'].includes(batteryStatus.tone), storageHot = ['amber', 'red'].includes(storageStatus.tone);
    const rows = [
      ['电量', esc(battery), ['battery', 'charging', 'battery_temp'], m.battery],
      ['上网', net, ['net_kind', 'carrier', 'ssid']],
      ['存储', U.nowrap(storage) + (growth ? `<small>${U.nowrap(growth)}</small>` : '') + (pendingStorage ? `<small class="accumulating-note">${U.nowrap(pendingStorage)}</small>` : ''), ['storage_free', 'storage_total'], m.storage_free],
      ...(offline ? [[screenLabel, esc(join([duration, unlocks])), ['screen_on', 'unlocks']]] : []),
    ];
    U.html(p.kv, unknown ? '' : rows.map(([label, html, ids, status]) => {
      const warn = ['amber', 'red'].includes(U.status(status).tone), cutoff = readingTimes(ids);
      const group = { 上网: 'network', 存储: 'storage' }[label];
      const title = group ? `<a href="${esc(href('phone'))}#grp-${group}">${label} ›</a>` : label;
      return `<div class="kv__row">${lamp(status)}<dt>${title}</dt><dd>${html}${cutoff ? ` <small>${cutoff}</small>` : ''}${warn ? U.actions({ id: `phone-${ids[0]}`, text: `${label} ${sp(html.replace(/<[^>]*>/g, ''))}` }, [{ kind: 'copy', label: '问情况', intent: 'ask' }]) : ''}</dd></div>`;
    }).join(''));
    const received = d?.received;
    const reason = offline ? d.offline?.cause : received?.gap?.text || (!(batteryHot || storageHot) && ['yellow', 'red'].includes(d?.level) ? d?.reason : null);
    const connection = phoneConnection(d)?.replace(/^手机((?:上次)?经)/, '电脑$1');
    const note = reason || (!offline && !unknown ? join([connection || U.collectionText('连接线路'), received?.last_at ? `${lastState?.offline ? U.time(received.last_at) : U.ago(received.last_at, lastState?.now || at)}收到` : '还没收到数据', received?.complete30 === true ? '近 30 天收全了' : received?.complete30 === false ? '' : U.collectionText('近 30 天', received)]) : '');
    p.note.hidden = !note;
    U.html(p.note, `${reason && !offline ? lamp(received?.gap) : ''}<span class="card__note-text">${reason && !offline && connection ? esc(connection) + ' · ' : ''}${U.fieldHtml(typeof note === 'string' ? note.replace(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/g, (_, m, d) => `${m.padStart(2, '0')}-${d.padStart(2, '0')}`) : note, { name: '手机情况', kind: viewer })}</span>${reason ? U.actions({ id: 'phone', text: reason }, [{ kind: 'copy', label: '问情况', intent: 'ask' }]) : ''}`);
  }

  function shortRow(it, sub, link, status = it, mark = '', ask = false) {
    const own = /\/backup\//.test(link || '') ? '资料' : /\/issue\//.test(link || '') ? 'AI 事项' : /\/project\//.test(link || '') ? '项目变化' : '自动任务';
    const fields = (Array.isArray(it.name) ? it.name : [it.name || it.text || it]).map(v => ({ visibility: it.visibility, public: it.public, rewrite: it.rewrite, ...(v && typeof v === 'object' ? v : { text: v }) }));
    const names = fields.map((field, i) => U.fieldHtml(field, { name: fields.length > 1 ? i ? '变化' : '项目' : own, place: 'label', kind: viewer })).join(' · '), hidden = viewer === 'public' && fields.some(f => f.visibility === 'owner' || f.public === 'owner' || f.hidden);
    const label = hidden ? `<span class="row__title">${names}</span>` : link ? `<a class="home-detail-link" href="${esc(route(link))}">${names} ›</a>` : names;
    const notes = fields.map(field => U.fieldHtml({ ...field, value: null, text: null, label: null }, { name: own, kind: viewer })).filter(Boolean);
    const note = [...new Set(notes)].join(' '), subHtml = (Array.isArray(sub) ? sub : [sub]).filter(Boolean).map(v => U.fieldHtml(v, { name: '说明', kind: viewer })).join(' · ');
    return { key: it.id, cls: 'row row--flat', html: `${lamp(status)}<div class="row__text"><p class="row__main">${label}${note ? ` <span class="head__rewrite">${note}</span>` : ''}${mark}</p>${subHtml ? `<p class="row__sub">${subHtml}</p>` : ''}</div><div class="row__acts">${U.actions(it, ask && !it.actions?.length ? [{ kind: 'copy', label: '问情况', intent: 'ask' }] : it.actions)}</div>` };
  }
  function scheduledSummary(d, state) {
    if (!d || d.q === 'warming') return [];
    if (!Object.hasOwn(d, 'readable_total') || !Object.hasOwn(d, 'unreadable_total')) return [];
    const running = d.running_reading, failed = d.state_counts?.failed;
    const stamp = at => timed(at) ? `（${U.date(at)} ${U.time(at)}）` : '';
    const current = running && !running.stale && !state.offline && !oldReading(d);
    const readings = [
      [Number.isInteger(d.total) && `登记 ${d.total} 项`, d.roster_at ?? d.at],
      [Number.isInteger(running?.count) && (running.count > 0 || !running.partial) &&
        `${current ? '' : '上次读到 '}${running.partial ? '至少 ' : ''}${running.count} 项在跑`, running?.at],
      [failed > 0 && `${d.unreadable_total ? '已读到 ' : ''}${failed} 项上次运行失败`, d.runtime_at],
      [d.unreadable_total > 0 && `${d.unreadable_total} 项运行状态未读到`],
    ];
    const groups = new Map();
    for (const [label, at] of readings) {
      if (!label) continue;
      const key = stamp(at);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(label);
    }
    return [...groups].map(([at, labels]) => labels.join(' · ') + at);
  }
  function scheduledPreview(d, state) {
    const kind = state.meta?.viewer?.kind || 'public', old = state.offline || oldReading(d);
    const readName = row => kind !== 'owner' && (row.hidden || row.visibility === 'owner' || row.public === 'owner')
      ? '' : sp(U.fieldHtml(row.display_name ?? row.name, { name: '任务名', place: 'label', kind }));
    const failures = (d.items || []).filter(row => row.source_readable !== false && row.enabled !== false &&
      (row.state === 'failed' || row.state == null && row.last?.result === 'failed'));
    // 这一轮没读到运行状态的照样列出来（M516）：名字和下次时间照写，状态写“这轮没读到”；上次出过事的排前面
    // 这轮没读到时后台把下次时间清空、另给上次读到的（last_read_next_at）：照写并说明是上次读到的；两个都没有就不写时间
    const clock = t => `${day(t) === day(state.now || Date.now()) ? '' : U.date(t) + ' '}${U.time(t)}`;
    const next = row => timed(row.next_at) ? ` · 下次 ${clock(row.next_at)}` : timed(row.last_read_next_at) ? ` · 上次读到的下次时间 ${clock(row.last_read_next_at)}` : '';
    const nextOf = row => Date.parse(timed(row.next_at) ? row.next_at : row.last_read_next_at) || Infinity;
    const unread = (d.items || []).filter(row => row.source_readable === false && row.enabled !== false && row.state !== 'disabled')
      .sort((a, b) => Number(['failed', 'warn'].includes(b.state)) - Number(['failed', 'warn'].includes(a.state)) || nextOf(a) - nextOf(b));
    const samples = [
      ...failures.map(row => [row, '上次运行失败', true]),
      ...(d.running || []).map(row => [row, old ? '上次读到在跑' : '正在跑']),
      ...unread.map(row => [row, '这轮没读到' + next(row)]),
    ];
    const seen = new Set(), rows = [];
    for (const [row, status, failed] of samples) {
      const name = readName(row);
      if (!name || seen.has(row.id)) continue;
      seen.add(row.id);
      const label = status;
      const ask = failed && kind === 'owner' && row.id && U.actions(
        { ...row, text: join([U.fieldText(row.display_name ?? row.name, kind), label, U.fieldText(row.problem?.reason, kind)]) },
        [row.actions?.find(action => action.kind === 'copy' && action.intent === 'ask') || { kind: 'copy', label: '问情况', intent: 'ask' }],
      );
      rows.push({ key: row.id, cls: 'row row--flat', html: `<p class="row__text"><span class="row__title">${name}</span> <span class="row__meta">${esc(label)}</span></p>${ask ? `<div class="row__acts">${ask}</div>` : ''}` });
    }
    return rows;
  }
  function paintBatchCards(data) {
    for (const id of ['agents', 'automation', 'ledger']) {
      const card = cards[id], p = parts[id];
      // 智能体的新页还没做好，这张卡先不链：标题、三家的小标都不带链接，整张卡也不当成能点（本人 11-23 07:47 选 A）
      const view = window.LiveBatchHome.render(id, data[id], { viewer, route, href: id === 'agents' ? '' : href(id), offline: !!lastState?.offline });
      U.html(p.head, view.head);
      U.html(p.batch, view.body);
      p.batch.hidden = false;
      Light.tone(card, view.tone === 'repair' ? 'blue' : view.tone === 'owner' ? 'amber' : view.tone === 'ok' ? 'green' : 'off');
    }
  }
  function paintTaskCard(id, state) {
    const d = state.data, counts = scheduledSummary(d, state);
    const rows = counts.length ? scheduledPreview(d, state) : [];
    const note = counts.length || rows.length ? counts
      : [state.offline ? '电脑连不上，这份清单没存下来' : d?.q === 'warming' || ['idle', 'wait', 'slow'].includes(state.phase) ? '正在读' : '清单暂时读不到'];
    const p = parts[id], summary = join(note);
    const update = () => {
      const { lamp, tone } = U.status(!state.offline && d?.level ? d : { level: 'gray' });
      p.head.querySelector(':scope > .lamp')?.remove();
      if (lamp) p.head.insertAdjacentHTML('afterbegin', lamp);
      Light.tone(cards[id], tone);
      p.status.hidden = !summary;
      U.html(p.status, U.nowrap(summary), false);
      U.blockNote(cards[id].querySelector('.card__body'), state); // 保留计划任务旧读数的说明。
      paintList(p.main, rows, { animate: false });
      fitCard(id);
    };
    if (!home || settling()) update(); else U.anchor(update);
    balanceHome();
  }
  function renderRest(d) {
    const { backups } = d, summary = backups.summary, backupCounts = Object.hasOwn(summary || {}, 'sets') ? summary : backups;
    const destinations = [['ready', '类齐了'], ['waiting', '类在等'], ['gaps', '类有备份问题'], ['unknown', '类尚未证实']];
    for (const id of ['backups', 'projects']) {
      if (d[id].q === 'warming') continue;
      const hot = id === 'backups' && backupCounts.gaps;
      let text = d[id].text;
      if (id === 'backups') {
        // 和备份页同一条：云端有文件在等（等稳定的也算）时不写“0 类在等”，免得卡头说 0、点进去云端格说在等 N 个文件
        const filesWaiting = [backupCounts.drive, backupCounts.photos, backups.drive, backups.photos].some(c => (Number(c?.waiting) || 0) + (Number(c?.stable) || 0) > 0);
        const counts = destinations.filter(([k]) => backupCounts[k] != null && !(k === 'waiting' && backupCounts[k] === 0 && filesWaiting)).map(([k, label]) => `${quantity(backupCounts, k)} ${label}`);
        const total = backupCounts.sets == null ? '备份' : `已登记 ${quantity(backupCounts, 'sets')} 类资料`;
        text = [total, counts.join('、'), typeof text === 'object' && text];
      }
      if (id === 'projects') {
        const counts = isLower(d.projects, 'active') || !text ? projectCount(d.projects) : text;
        text = viewer === 'public' && Number.isInteger(d.projects.total) ? [`共 ${d.projects.total} 个项目`, counts] : counts;
      }
      U.html(parts[id].head, cardHead(id === 'projects' && typeof text === 'string' ? text.replace(/\s*·\s*\d+\s*个冻结/, '') : text, { backups: '备份', projects: '项目' }[id], { lamp: id === 'backups', href: href(id) + (hot ? `${href(id).includes('?') ? '&' : '?'}attention=${id === 'backups' ? 'gap' : '1'}` : '') }).replace(/(?:至少 )?\d+\s*类(?:齐了|有缺|未传云端|没上云|只有一份|还没读到)(?: ·)?/g, '<span class="l1-unit">$&</span>'));
    }
    const protection = { gap: '有缺', waiting: '在等', local_copy_no_cloud: '有本地副本但没上云', single: '只有本机一份', unknown: U.collectionText('副本情况') };
    const problem = it => ['gap', 'local_copy_no_cloud', 'single'].includes(it.protection);
    const backupRows = [...backups.items || []].sort((a, b) => Number(problem(b)) - Number(problem(a))).map(it => shortRow(it, [protection[it.protection], it.text], `/live/backup/?id=${encodeURIComponent(it.id)}`, it, '', true));
    paintList(parts.backups.main, backupRows, { animate: false });
    const points = (backups.restore || []).flatMap((set, i) => (set.points || []).map(p => ({ ...p, set: set.set ?? set.id ?? i, setName: set.name, scope: p.scope || (set.kind === 'system' ? '系统镜像' : '文件恢复点') }))).sort((a, b) => (Date.parse(b.at) || 0) - (Date.parse(a.at) || 0));
    // 每类只列最新的一个恢复点，同一类较早的在备份页里看（M261）
    const latest = new Map();
    for (const p of points) if (!latest.has(p.set)) latest.set(p.set, p);
    const restored = points.some(p => p.restored_at), neverRestored = points.length && points.every(p => p.history_from && !p.restored_at);
    const restoreRows = [...latest.values()].map(p => {
      // 后台给了这类资料的名字就用名字（和备份页、详情同一个叫法），范围另写一行
      const named = p.setName && U.fieldText(p.setName, viewer) !== U.fieldText(p.scope, viewer);
      const label = U.fieldHtml(p.setName || p.scope, { name: '恢复点', place: 'label', kind: viewer }), body = named ? `范围：${U.fieldHtml(p.scope, { kind: viewer })}` : U.fieldHtml(p.scope, { kind: viewer });
      const time = timed(p.at) ? `可恢复到 ${U.date(p.at)} ${U.time(p.at)}` : U.collectionText('恢复点时间');
      const history = restored && (p.restored_at || p.history_from) ? `<span class="row__meta">${p.restored_at ? `${U.date(p.restored_at)} 恢复过` : '没恢复过'}</span>` : '';
      return { key: `${p.set || ''}:${p.id ?? p.at}`, cls: 'row row--flat', html: `<div class="row__text"><p class="row__main restore__line"><span class="row__title">${label}</span><span class="l1-unit">${time}</span>${history}</p>${body !== label ? `<p class="row__sub">${body}</p>` : ''}</div>` };
    });
    if (neverRestored && backupRows.length + restoreRows.length < previewRange.backups[0]) restoreRows.push({ key: 'never-restored', cls: 'row row--flat row--preview-note', html: '<p class="row__text row__sub">都没恢复过</p>' });
    const failedRows = (backups.restore || []).flatMap((set, index) => {
      const point = set.failed_points?.[0];
      if (!point) return [];
      const label = U.fieldHtml(set.name || '系统镜像', { name: '备份名称', kind: viewer });
      const status = point.state === 'unknown' ? '未核实' : '备份失败';
      const at = timed(point.at) ? `${U.date(point.at)} ${U.time(point.at)}` : U.collectionText('时间');
      const reason = point.reason ? `<p class="row__sub">${U.fieldHtml(point.reason, { name: '失败原因', kind: viewer })}</p>` : '';
      return [{ key: `restore-failed:${set.set ?? set.id ?? index}`, cls: 'row row--flat row--preview-note',
        html: `<div class="row__text"><p class="row__main restore__line"><span class="row__title">${label} · ${status}</span><span class="l1-unit">${at}</span></p>${reason}</div>` }];
    });
    paintList(parts.backups.restore, [...failedRows, ...restoreRows], { animate: false });
    fitCard('backups');
    parts.backups.summary.hidden = backupRows.length + restoreRows.length >= previewRange.backups[0];
    const more = parts.backups.more;
    more.hidden = false; more.href = href('backups');
    U.html(more, `查看全部${backupCounts.sets == null ? '资料' : isLower(backupCounts, 'sets') ? `资料（已登记至少 ${esc(backupCounts.sets)} 类）` : ` ${esc(backupCounts.sets)} 类`} ›`);
    const drive = summary?.drive ?? backups.drive, stamp = value => timed(value) ? `${U.date(value)} ${U.time(value)}` : U.collectionText('日期');
    // waiting 与 stable 是互不重叠的两批；后端 11-17 05:58 确认“在等”取两者之和，failed 另算。
    const waiting = drive?.waiting != null && drive?.stable != null ? { value: drive.waiting + drive.stable, q: isLower(drive, 'waiting') || isLower(drive, 'stable') ? 'partial' : 'ok' } : null;
    U.html(parts.backups.summary, [['G 盘', stamp((summary ?? backups).g_latest_at)], ['H 盘', stamp((summary ?? backups).h_latest_at)], ['Drive', drive?.sent == null || drive?.total == null ? U.collectionText("已传/总数") : `${quantity(drive, 'sent')} / ${quantity(drive, 'total')} 个文件`], ['在等', waiting ? `${quantity(waiting, 'value')} 个文件` : U.collectionText()], ['失败', drive?.failed == null ? U.collectionText() : `${quantity(drive, 'failed')} 个文件`]].filter(([, value]) => value !== '至少 0' && (!lastState?.offline || !value.includes(U.collectionText()))).map(([label, value]) => `<span class="l1-unit">${esc(`${label} ${value}`)}</span>`).join(' · '));
    const changes = (d.projects.changes || []).slice(0, defaultCounts.projectChanges).map(c => shortRow({ ...c, name: changeName(c) }, [changeTime(c.at)], `/live/project/?id=${encodeURIComponent(c.project)}`, '', fresh('project-changes', c.at)));
    if (!changes.length && ['unknown', 'partial', 'stale'].includes(d.projects.changes_q)) changes.push({ key: 'unread', cls: 'row row--flat', html: '<p class="row__text row__sub">暂时读不到项目变化</p>' });
    paintList(parts.projects.changes, changes);
    const changesStatus = parts.projects['changes-status'], cutoff = d.projects.changes_at;
    const lastRead = d.projects.changes_q === 'stale' && timed(cutoff) ? [U.date(cutoff), U.time(cutoff)].join(' ') : '';
    changesStatus.hidden = !lastRead;
    U.html(changesStatus, lastRead ? `项目变化上次读到 ${esc(lastRead)}` : '');
    checkProjectChanges();
    renderProjectGroups(d.projects);
  }
  function renderCards(d) {
    for (const id of HOME_IDS) if (id !== 'needs' && cards[id].classList.contains('card--empty') && hasCardData(id, d[id])) for (const el of Object.values(parts[id])) el.hidden = false;
    renderHomeNeeds(d);
    for (const [id, render] of [['chats', renderChats], ['computer', renderComputer], ['phone', renderPhone]]) if (d[id]?.q !== 'warming') render(d[id], d.screen, d.phone);
    renderRest(d);
    paintBatchCards(d);
    for (const id of HOME_IDS) { if (id === 'needs') continue; const warming = d[id]?.q === 'warming'; cards[id].classList.toggle('card--warming', warming); if (warming && !parts[id].batch) U.html(parts[id].head, U.head('正在准备', { href: href(id) })); const gaps = [...new Set(statContainers(d[id]).filter(x => x.q === 'partial' && x.gap && !(id === 'computer' && (x === d[id].traffic || x === d[id].storage_growth_top))).map(x => x.gap))]; const shown = parts[id].note?.textContent || ''; const unique = gaps.filter(g => !shown.includes(sp(g))); parts[id].gap.hidden = warming || !unique.length || ['chats','ledger','backups'].includes(id); U.html(parts[id].gap, unique.map(g => U.fieldHtml(g, { name: '读数说明', kind: viewer })).join(' · ')); if (!parts[id].batch && id !== 'projects' && !hasCardData(id, d[id])) emptyCard(id, d[id]); else cards[id].classList.remove('card--empty'); if (!parts[id].batch) paintStatus(id, d[id]); }
  }
  function renderHomeNeeds(d) {
    const needs = d.needs, focus = noticeFocus(d, viewer), card = cards.needs;
    const hasTarget = focus?.section === 'needs' && (focus.item?.kind || focus.closed);
    if (needs.q === 'warming' || !hasTarget && !hasCardData('needs', needs)) {
      emptyCard('needs', needs);
      return;
    }
    if (card.classList.contains('card--empty')) for (const [key, el] of Object.entries(parts.needs)) el.hidden = key === 'gap';
    card.classList.remove('card--empty', 'card--warming');
    renderNeeds(needs, focus, cutoffAt('needs', needs));
    paintStatus('needs', needs);
  }
  function cutoffAt(id, data) {
    if (id === 'chats') {
      const { counts, observed } = chatSnapshot(data || {});
      if (counts !== data || observed || oldReading(data)) return observed;
    }
    if (id === 'phone' && data?.state === 'offline' && !Object.hasOwn(data, 'source_at')) return data.received?.last_at || data.at;
    if (!data || Object.hasOwn(data, 'source_at') || Object.hasOwn(data, 'at') || oldReading(data)) return blockAt(data);
    return home?.at ?? at;
  }
  // AI 对话卡读数不全时只说一句：是正在重读，还是这次没读全；上面那行统计是几点的（M242）。
  function chatGapNote(d, shown) {
    const reasons = [...(d.gray_items || []).map(g => g?.reason), ...Object.values(d.missing || {}).map(r => r?.reason_code ?? r?.reason ?? r)]
      .map(r => sp(U.fieldText(r, viewer)));
    const tried = recordStamp(blockAt(d), d.at_precision);
    const reading = reasons.some(r => /还在读|warming/.test(r)), gap = d.read_error || d.refresh_error || reasons.some(r => !/还在读|warming/.test(r));
    const lead = [(gap || !reading) && `${tried ? tried + ' ' : '这次'}没读全`, reading && '正在重读'].filter(Boolean).join('，');
    return esc([lead, shown && (shown === tried ? '上面是读到的部分' : `先显示 ${shown} 的统计`)].filter(Boolean).join('，'));
  }
  function paintStatus(id, data) {
    const p = parts[id], end = cutoffAt(id, data), stamp = recordStamp(end, data?.at_precision);
    const staleText = U.fieldHtml(data?.stale_text, { name: '数据截止时刻', kind: viewer });
    const endNote = stamp ? `数据截至 ${stamp}` : '';
    const matchesCutoff = text => endNote && U.sameCutoffNote(endNote, text);
    const chatReading = id === 'chats' && p.head.querySelector('.chat-head-summary [data-recorded]')?.dataset.recorded;
    const existing = endNote && (chatReading === stamp || [p.head, p.note].some(el => el && !el.hidden &&
      [...el.querySelectorAll('.head__cutoff'), el].some(node => node.textContent.split(' · ').some(matchesCutoff))));
    const difference = Date.parse(home?.at ?? at) - Date.parse(end);
    const cutoff = endNote && !existing && data?.q !== 'warming' && difference >= 15 * 60 * 1000 ? esc(endNote) : '';
    // 后台给了读不准的具体项（gray_items）就点名写出是哪几项、为什么（同一原因的并成一句），不再只写“N 项读不准”
    const gray = Array.isArray(data?.gray_items) && data.gray_items.length ? data.gray_items : null, grayWhy = new Map();
    for (const g of gray || []) { const why = U.fieldText(g?.reason, viewer) || '原因没记下'; grayWhy.set(why, [...(grayWhy.get(why) || []), g?.name]); }
    const grayNote = gray && '读不准：' + [...grayWhy].map(([why, names]) => `${names.slice(0, 3).map(n => U.fieldHtml(n, { name: '读数名称', kind: viewer })).join('、')}${names.length > 3 ? ` 等 ${names.length} 项` : ''}（${esc(why)}）`).join('；');
    const state = U.status(['ledger', 'projects'].includes(id) ? null : gray ? { ...data, gray_count: 0 } : data, { showZeroFixing: id === 'needs' });
    p.head.querySelector(':scope > .lamp')?.remove();
    if (state.lamp) p.head.insertAdjacentHTML('afterbegin', state.lamp);
    const chatGap = id === 'chats' && (state.tone === 'gray' || gray) && chatGapNote(data, chatReading);
    const note = chatGap ? [chatGap, ...(state.note || '').split(' · ').filter(text => /项要处理$|^AI 在修/.test(sp(text)))].join(' · ')
      : [...(state.note || staleText).split(' · ').filter(text => !(existing || cutoff) || !matchesCutoff(text)), grayNote, cutoff].filter(Boolean).join(' · ');
    p.status.hidden = !note; U.html(p.status, note);
    Light.tone(cards[id], cardTone(id, data, state));
  }
  const headline = (it, withLabel = true) => {
    const h = it.headline;
    if (!h || typeof h !== 'object') return h ?? '';
    const protectedField = v => v && typeof v === 'object' && (v.hidden || v.hidden_block || v.visibility && v.visibility !== 'public' || v.public === 'owner' || v.public === 'rewrite' || v.rewrite);
    if (protectedField(h.value) || protectedField(h.text) || protectedField(h.label)) return [h.value, h.text, h.label].find(protectedField);
    const label = h.id === 'release' || h.label === '现役版本、几时生效' ? '现役版本' : h.id === 'menus' || h.label === '上次核对接好的导出菜单' ? '导出菜单接好' : h.label;
    const value = h.value != null && typeof h.value === 'object' ? h.value.text ?? h.text ?? h.value.value : h.value ?? h.text;
    if (value == null || typeof value === 'object' || !label && !h.unit && h.text == null && value !== 0 || /^[a-z]+_[a-z0-9_]+$/.test(String(value))) return protectedField(h) ? h : '';
    const raw = String(value), isDate = /^\d{4}-\d\d-\d\d(?:$|T)/.test(raw) && Number.isFinite(Date.parse(raw));
    const words = isDate ? [U.date(raw), U.time(raw, h.at_precision)].filter(Boolean).join(' ') : raw.replace(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/g, (_, m, d) => m.padStart(2, '0') + '-' + d.padStart(2, '0'));
    const labelNeeded = withLabel && label && !['现在在干什么', '做什么'].includes(label) && !words.startsWith(sp(label)) && h.id !== 'remote' && (h.value != null || /^\d/.test(words));
    const unit = h.value != null && !isDate && h.unit && !words.includes(sp(h.unit)) && !U.isMissingText(words) ? h.unit : '';
    const through = h.data_through && Number.isFinite(Date.parse(h.data_through)) && h.value != null ? `（图上数据到 ${U.date(h.data_through)}）` : '';
    const text = [labelNeeded && label, words, unit].filter(Boolean).map(sp).join(' ') + through;
    return protectedField(h) ? { ...h, value: text, text } : text;
  };
  function projectName(id) { return (home?.projects?.items || []).find(p => p.id === id)?.name || id; }
  const changeName = c => [projectName(c.project), typeof c.text === 'string' ? c.text.trimEnd().replace(/。$/, '') : c.text];
  const changeTime = at => [U.date(at), U.time(at)].filter(Boolean).join(' ');
  let changesPage;
  function checkProjectChanges() {
    const p = parts.projects, box = p['changes-box'];
    p['more-changes'].hidden = false;
    if (changesPage && changesPage.kind !== viewer) {
      changesPage = null;
      delete box._loaded;
      paintList(box.querySelector('.rows'), [], { animate: false });
      box.querySelector('button').hidden = true;
    }
    if (!changesPage && p['more-changes'].getAttribute('aria-expanded') === 'true') box._liveOpen();
    else if (changesPage?.loaded) paintProjectChanges(box.querySelector('.rows'), changesPage.items, false, changesPage.incomplete);
  }
  function paintProjectChanges(ul, items, pending = false, incomplete = false) {
    const top = new Set((home.projects.changes || []).slice(0, defaultCounts.projectChanges).map(c => c.id));
    const extra = [...items.values()].filter(c => !top.has(c.id));
    const rows = extra.map(c => shortRow({ ...c, name: changeName(c) }, [changeTime(c.at)], `/live/project/?id=${encodeURIComponent(c.project)}`));
    if (!rows.length) rows.push({ key: 'empty', cls: 'row row--flat', html: `<p class="row__text row__sub">${pending ? '正在读近 7 天的变化…' : items.size ? '近 7 天的变化已在上面列出' : incomplete ? '近 7 天的变化暂时读不全' : '近 7 天没有变化'}</p>` });
    paintList(ul, rows, { animate: false });
  }
  U.fold(parts.projects['more-changes'], parts.projects['changes-box'], async box => {
    if (!home) return false;
    const ul = box.querySelector('.rows'), more = box.querySelector('button');
    const page = changesPage ||= { kind: viewer, items: new Map() };
    async function load() {
      if (page !== changesPage || page.loading) return !!page.loaded;
      more.disabled = page.loading = true;
      if (!page.loaded) paintProjectChanges(ul, page.items, true);
      const r = await window.Live.get('projects/changes', page.cursor ? { cursor: page.cursor } : null);
      if (page !== changesPage || !home) return !!changesPage?.loaded;
      more.disabled = page.loading = false;
      if (!r.data || r.viewer?.kind && r.viewer.kind !== page.kind) {
        if (!page.loaded) paintList(ul, [{ key: 'error', cls: 'row row--flat', html: '<p class="row__text row__sub">暂时读不到近 7 天的变化</p>' }]);
        more.textContent = '暂时读不到，点此重试 ›';
        more.hidden = false;
        return false;
      }
      for (const item of r.data.items || []) page.items.set(item.id, item);
      page.cursor = r.data.next;
      page.loaded = true;
      page.incomplete = ['unknown', 'partial', 'stale'].includes(r.data.q);
      paintProjectChanges(ul, page.items, false, page.incomplete);
      more.textContent = '再看一些 ›';
      more.hidden = !page.cursor;
      return true;
    }
    more.onclick = load;
    return load();
  });

  // —— 出事时才有的横条 ——
  function renderNotices(state) {
    const rows = [];
    if (state.offline || (!home && state.text && state.phase === 'none')) {
      const text = state.text;
      rows.push({ key: 'link', cls: home ? 'notice glass' : 'l1-unreadable-note', html: `${home ? '<span class="lamp" aria-hidden="true"></span>' : ''}<span>${U.fieldHtml(text, { name: '连接情况', kind: viewer })}</span>` });
    }
    if (project) {
      const f = home?.filter || { name: home?.projects.items.find(it => it.id === project)?.name || project, count: home?.needs.items.filter(it => it.project === project && ['choose', 'do'].includes(it.kind)).length };
      rows.push({ key: 'filter', cls: 'notice glass notice--filter', enter: false, html: `<span>只看：${U.fieldHtml(f.name, { name: '项目', place: 'label', kind: viewer })}${f.count == null ? '' : ` · ${f.count} 件`}</span><button class="btn btn--sm notice__x" type="button" data-clear-project aria-label="不只看这个项目">×</button>` });
    }
    if (home?.network?.length) {
      const first = home.network.map((n) => n.at).filter(Boolean).sort()[0];
      const text = `AI 出口：${home.network.map((n) => `${NET[n.id] || n.id} 不通`).join('、')}${first ? ` · ${U.time(first)} 起` : ''}`;
      const item = { id: 'network', text, actions: [{ kind: 'copy', label: '问情况', intent: 'ask' }] };
      rows.push({ key: 'net', cls: 'notice glass', html: `${lamp('red')}<a class="head__tail--link" href="${esc(route('/live/computer/#exits'))}">${esc(text)} <span class="more__chev">›</span></a>${U.actions(item, item.actions)}` });
    }
    if (home?.needs?.phone) {
      const item = { id: 'phone', text: viewer === 'public' && typeof home.needs.phone.text === 'string' ? addressed(home.needs.phone.text).replace('这里的事请自己看', '相关事项等本人查看') : home.needs.phone.text, actions: [{ kind: 'copy', label: '问情况', intent: 'ask' }] };
      rows.push({ key: 'phone', cls: 'notice glass', html: `${lamp('red')}<a class="head__tail--link" href="${esc(route('/live/notifications/'))}">${U.fieldHtml(item.text, { name: '提醒', kind: viewer })} <span class="more__chev">›</span></a>${U.actions(item, item.actions)}` });
    }
    // AI 留言（选了“实况”的那几条，后台 ai-messages 读口）：一条一行，标题、时刻，正文点“全文”展开；到期后台自己撤
    for (const m of aiMessages || []) {
      const plainText = v => U.fieldText(v, viewer).trim().replace(/^AI\s*留言\s*[｜|:：]\s*/u, ''), titleText = plainText(m.title), bodyText = plainText(m.body);
      const words = titleText || bodyText;
      if (!words && !m.title?.hidden && m.title?.visibility !== 'owner') continue;
      const opened = notices.querySelector(`[data-key="${CSS.escape(`msg-${m.id}`)}"] details`)?.open;
      const body = bodyText && bodyText !== titleText ? `<details class="notice-message__body"${opened ? ' open' : ''}><summary>全文</summary><p>${U.fieldHtml(m.body, { name: 'AI 留言', kind: viewer })}</p></details>` : '';
      rows.push({ key: `msg-${m.id}`, cls: 'notice glass notice--message', html: `${lamp('blue')}<span><b>AI 留言</b>：${titleText ? esc(titleText) : U.fieldHtml(m.title ?? m.body, { name: 'AI 留言', kind: viewer })}${timed(m.created_at) ? ` <span class="notice-message__at">· ${esc(recordStamp(m.created_at))}</span>` : ''}</span>${body}` });
    }
    paintList(notices, rows);
  }

  // —— 页眉右边的〔问情况〕：把页上几块的第一行拼成一句 ——
  function ask() {
    if (!home) return '';
    const said = ['needs', 'chats', 'computer', 'phone', 'tasks', 'automation'].map(k =>
      k === 'phone' ? parts.phone.head.textContent.replace(/›/g, '').trim()
        : TASK_PAGES.some(page => page.id === k) ? join([NAME[k], parts[k].status.textContent]) : home[k]?.text
    ).filter(Boolean).map(sp);
    return `请看实况${at ? `（${U.time(at)} 的数）` : ''}：${said.join('；')}。请说明现在的情况。`;
  }
  const bar = U.topbar({ ask });

  document.addEventListener('click', e => {
    if (!e.target.closest('[data-clear-project]')) return;
    project = null; params.delete('project');
    history.replaceState(history.state, '', `${location.pathname}${params.size ? '?' + params : ''}`);
    if (lastState) renderNotices(lastState);
    subscribe();
  });
  const cardControl = 'a,button,input,select,textarea,summary,[contenteditable],[role="button"],[role="link"]';
  for (const card of Object.values(cards)) {
    card.addEventListener('pointerdown', e => {
      const control = e.target.closest(cardControl);
      if (e.button !== 0 || (control && control !== card)) return;
      card.classList.add('is-pressed');
      const release = () => { card.classList.remove('is-pressed'); window.removeEventListener('pointerup', release); window.removeEventListener('pointercancel', release); };
      window.addEventListener('pointerup', release); window.addEventListener('pointercancel', release);
    });
    card.addEventListener('click', e => {
      const control = e.target.closest(cardControl);
      if (e.defaultPrevented || (control && control !== card) || e.target.closest('.row[data-key], .project-cell') || window.getSelection()?.toString().trim()) return;
      card.querySelector('.head__link')?.click();
    });
    card.addEventListener('keydown', e => {
      if (e.target === card && e.key === 'Enter') { e.preventDefault(); card.querySelector('.head__link')?.click(); }
    });
  }
  async function focusItem() {
    const focus = home?.focus, id = focus?.id || focusId;
    if (!home || !id || focused) return;
    focused = true;
    const row = [...document.querySelectorAll('[data-key]')].find(el => el.dataset.key === id && !el.hidden);
    if (!row) { const page = { chats: 'chat', tasks: 'task', ledger: 'issue' }[focus?.section] || 'item'; location.assign(route(`/live/${page}/?id=${encodeURIComponent(id)}`)); return; }
    const opened = openFocusedRow(row);
    if (opened.length) await new Promise(resolve => {
      const until = performance.now() + 500;
      const wait = () => {
        const bottom = row.getBoundingClientRect().bottom;
        if (!row.isConnected || opened.some(el => !el.open) || performance.now() >= until ||
            opened.every(el => el.getBoundingClientRect().bottom >= bottom - 1)) resolve();
        else requestAnimationFrame(wait);
      };
      wait();
    });
    if (!row.isConnected || opened.some(el => !el.open)) return;
    row.scrollIntoView({ block: 'center', behavior: 'instant' }); row.classList.add('notice-target');
  }
  function needsPreview(rows) {
    const target = rows.find(it => it.id === (home?.focus?.id || focusId));
    return target ? [target, ...rows.filter(it => it !== target)] : rows;
  }
  function openFocusedRow(row) {
    const opened = [];
    for (let parent = row.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS' && !parent.open) { parent.open = true; opened.push(parent); }
      if (parent.classList.contains('fold')) {
        const toggle = parent.previousElementSibling;
        if (!toggle || toggle.getAttribute('aria-expanded') === 'true') continue;
        toggle.click();
        parent.getAnimations?.().forEach(animation => animation.finish());
      }
    }
    const detail = row.querySelector?.(':scope > .row__text > details:not([open]), button[data-detail][aria-expanded="false"]');
    if (detail?.tagName === 'DETAILS') detail.open = true;
    else detail?.click();
    return opened;
  }
  let hashFocused = !!saved;
  // 从这张卡点开的下一层退回来时，全站动效会把总览滚回点开那一刻的位置、让那一页缩回这张卡：这时只画框，不再挪页面，
  // 不然先挪的这一下会被列表的位置保持带着走，纸面就缩到别的卡上（M229）。
  const shrinkingBack = (() => {
    try {
      const plain = url => { const u = new URL(url, location.href); u.hash = ''; return u.href; };
      const from = window.navigation?.activation?.from?.url;
      const opened = from && JSON.parse(sessionStorage.getItem(`mo-open:${plain(from)}`) || 'null');
      return !!opened && opened.back === plain(location.href);
    } catch { return false; }
  })();
  function focusCard() {
    const card = cards[location.hash.slice(1)];
    if (!card || hashFocused || focusId || home?.focus) return;
    hashFocused = true;
    if (shrinkingBack) { card.classList.remove('notice-target'); void card.offsetWidth; card.classList.add('notice-target'); return; }
    // 先前几批数据画上时锁住的那一行不再把页面拉走（从讲解页点进来落到别处，M267）。
    U.anchor.stop?.();
    const view = window.visualViewport?.height || innerHeight;
    // 回到首屏本来就能看完的卡片时，保留完整的总览和锚点。
    if (card.getBoundingClientRect().bottom + scrollY <= view) {
      scrollTo({ top: 0, behavior: 'instant' });
    } else {
      // 比一屏高的卡标题对齐页眉下面，不居中把标题挤出屏；数据还在一批批到、卡片长高换栏，先把它钉在落下的位置
      const tall = card.getBoundingClientRect().height > view - ($('topbar')?.getBoundingClientRect().bottom || 0) - 40;
      card.scrollIntoView({ block: tall ? 'start' : 'center', behavior: 'instant' });
      pinCard(card, card.getBoundingClientRect().top);
    }
    card.classList.remove('notice-target'); void card.offsetWidth; card.classList.add('notice-target');
  }
  window.addEventListener('hashchange', () => { hashFocused = false; if (home) focusCard(); });

  const mainCards = IDS.map(id => cards[id]);
  const root = document.documentElement;
  // 连不上也照常入场：连接状态由灯的颜色和文字说，不停动效
  const canEnter = () => root.classList.contains('mo-on') && !returning && !direct() && !home?.focus && !document.hidden;
  for (const card of mainCards) Light.add(card, { defer: canEnter() });

  // 等首包和分栏落定再量视口，用全站的 mo-rise。数据更新不会重新入场。
  const inView = el => {
    const r = el.getBoundingClientRect();
    return r.width && r.height && r.bottom > ($('topbar')?.offsetHeight || 0) && r.top < (window.visualViewport?.height || innerHeight);
  };
  let entered = false;
  async function enterHome(restored) {
    if (entered) return;
    entered = true;
    const blocks = project ? mainCards : [notices, ...mainCards];
    const firstScreen = !restored && canEnter() ? blocks.filter(inView).sort((a, b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return Math.round(ra.top / 40) - Math.round(rb.top / 40) || ra.left - rb.left;
    }) : [];
    Light.lightUp([notices, ...mainCards].filter(card => !firstScreen.includes(card)), true);
    firstScreen.forEach((el, i) => {
      el.style.setProperty('--mo-d', `calc(var(--mo-rise-step) * var(--mo-speed) * ${i})`);
      if (!root.hasAttribute('data-mo-home-arrival')) el.classList.add('mo-rise');
    });
    await firstScreen.at(-1)?.getAnimations().find(a => a.animationName === 'mo-rise')?.finished.catch(() => {});
    for (const el of firstScreen) { el.classList.remove('mo-rise'); el.style.removeProperty('--mo-d'); }
    const order = firstScreen.filter(inView);
    Light.lightUp(firstScreen.filter(card => !order.includes(card)), true);
    Light.lightUp(order);
  }
  function showHome(restored) {
    // 把入场的首帧和第一份可读内容一起交给浏览器，空卡从未露出来。
    enterHome(restored);
    document.body.classList.remove('live-first-read');
  }

  // —— 取数 ——
  let watch, notice, scheduledWatch;
  function noticeFocus(data, kind) {
    const focus = data.focus, id = focus?.id || focusId;
    if (!id || (focus?.section && focus.section !== 'needs') || focus?.closed) return focus;
    const item = focus?.item || data.needs.items.find(it => it.id === id);
    const detail = notice?.id === id && notice.kind === kind ? notice.detail : null;
    if (!item && !detail?.closed && !detail?.kind) return focus;
    const merged = detail ? { ...detail, ...item, detail_text: detail.detail_text ?? item?.detail_text } : item;
    return { id, section: 'needs', item: merged, closed: detail?.closed };
  }
  function labelCard(card) {
    const link = card.querySelector('.head__link');
    if (!link) return;
    card.classList.add('card--link'); card.tabIndex = 0; card.setAttribute('role', 'link');
    card.setAttribute('aria-label', `${link.textContent.replace(/›/g, '').trim()}，查看详情`);
  }
  function watchNotice(data) {
    const focus = data.focus, id = focus?.id || focusId;
    if (!id) return;
    const otherSection = focus?.section && focus.section !== 'needs';
    const loaded = notice?.id === id && notice.kind === viewer && (notice.detail?.kind || notice.detail?.closed);
    if (!focused && (otherSection || data.needs.q !== 'warming' && (loaded || focus?.closed || focus?.item?.detail_text))) {
      requestAnimationFrame(focusItem);
    }
    if (otherSection || notice?.id === id) return;
    notice?.watch?.stop();
    const current = notice = { id };
    // 独立订阅：沿用 Live 的在途合并、重读和关机副本。
    current.watch = window.Live.watch(`items/${encodeURIComponent(id)}`, {}, {
      data(detail, meta) {
        current.detail = detail;
        current.kind = meta.viewer?.kind;
        if (!home || current !== notice || current.kind !== viewer) return;
        U.anchor(() => {
          renderHomeNeeds(home);
          labelCard(cards.needs);
          balanceHome();
        });
        if ((detail?.kind || detail?.closed) && !focused && home.needs.q !== 'warming') requestAnimationFrame(focusItem);
      }
    });
  }
  function unreadable() {
    document.body.classList.add('live-unreadable');
    for (const id of HOME_IDS) { reads[id].done(false); emptyCard(id, null); }
    paintBatchCards({});
    Light.offline(!!lastState?.offline);
    showHome();
  }
  function subscribe() {
    watch?.stop();
    scheduledWatch?.stop();
    notice?.watch?.stop();
    notice = null;
    const callbacks = {
    async data(d, meta) {
      if (!d) {
        home = changesPage = null;
        delete parts.projects['changes-box']._loaded;
        for (const id of HOME_IDS) { emptyCard(id, null); cards[id].querySelectorAll('.rows,.row__sub,.card__note,.kv').forEach(el => { el.replaceChildren(); delete el._html; }); }
        return;
      }
      // 真垫底里的计数仍在，没存下来的行列表不一定随包；保留已有行，只补空数组。
      d = { ...d };
      for (const id of HOME_IDS) d[id] = { ...U.withoutSnapshotCutoff(d[id], meta.at), items: Array.isArray(d[id]?.items) ? d[id].items : [] };
      const waiting = d.needs.waiting || [], ages = new Map(waiting.map(it => [it.id, it.age_days]));
      d.needs.items = d.needs.items.length ? d.needs.items.map(it => ages.has(it.id) ? { ...it, age_days: ages.get(it.id) ?? it.age_days } : it) : waiting;
      for (const key of ['active', 'recent', 'fallback']) d.chats[key] = Array.isArray(d.chats[key]) ? d.chats[key] : [];
      if (project && meta.source === 'fixture') {
        const closed = await window.Live.get('items/closed');
        const scoped = rows => (rows || []).filter(it => it.project === project);
        const needs = scoped(d.needs.items), ledger = scoped(d.ledger.items);
        const counts = Object.fromEntries(Object.keys(KIND).map(k => [k, needs.filter(it => it.kind === k).length]));
        d = { ...d, needs: { ...d.needs, items: needs, counts, waiting_oldest_days: null, closed7: scoped(closed.data?.items).length }, ledger: { ...d.ledger, items: ledger, open: ledger.length, text: `AI 手上 ${ledger.length} 件` } };
      }
      if (d.focus) restoreY = null, pinned = false;
      const render = () => {
      document.body.classList.remove('live-unreadable');
      balanceHome();
      home = d;
      at = meta.at;
      source = meta.source;
      viewer = meta.viewer?.kind || 'owner';
      seen ||= U.seen('needs', source);
      renderCards(d);
      const published = timed(d.published) ? `网站上次发布 ${changeTime(d.published)}` : '';
      parts.projects.published.hidden = !published;
      U.html(parts.projects.published, published && d.projects.site_project_id ? `<a class="more" href="${esc(route(`/live/project/?id=${encodeURIComponent(d.projects.site_project_id)}`))}">${published} ›</a>` : published);
      for (const card of Object.values(cards)) labelCard(card);
      document.querySelectorAll('.board .card__head,.board .row__text,.board .row__main,.board .rows>.row>.row__sub,.board .kv__row,.board .card__note,.board .project-cell small').forEach(el => { el.title = (el.matches('#chats .row__text') ? el.querySelector('.row__main')?.textContent || '' : el.textContent).trim(); });
      seen.done(at);
      for (const mark of newMarks.values()) mark.done(at);
      if (lastState) renderNotices(lastState);
      // 出雾：回第一层恢复位置、从通知或 #needs 这类落点进来时不做动画（位置要一次到位，落点自己有先糊后清）
      for (const id of HOME_IDS) reads[id].done(fade);
      };
      const fade = entered && restoreY == null && !direct() && !d.focus;
      if (!settling() && (focused || !(focusId || d.focus))) U.anchor(render); else render();
      showHome(meta.source === 'copy' && window.Live.returningHome);
      paintedRev = meta.rev;
      if (meta.status) netPainted = true;
      // 让共享客户端先完成首页订阅和打开计数的登记，再订阅详情。
      queueMicrotask(() => { if (home === d) watchNotice(d); });
      focusCard();
      if (restoreY != null) {
        if (meta.status) requestAnimationFrame(restoreHome);
        else restoreTimer ||= setTimeout(() => requestAnimationFrame(restoreHome), 650);
      }
    },
    // 第一层还没收到包时也只占一行，避免请求未回时留下几张大空卡。
    phase(state) {
      if (!home && ['none', 'gone'].includes(state.phase)) { unreadable(); return; }
      if (!home) {
        for (const id of HOME_IDS) reads[id].set(state);
        if (['wait', 'slow'].includes(state.phase)) showHome();
      }
    },
    link(state) {
      // 第一次画的时候没有“正在看的那一行”，不锚视口；锚了会跟着页顶横条长出来往下滚，把横条和页眉标题挤走
      const changed = !!lastState?.offline !== !!state.offline, firstLink = !lastState, oldNow = lastState?.now;
      lastState = state;
      bar?.set(state);
      Light.offline(state.offline);
      if (changed && home) {
        const render = () => { balanceHome(); renderCards(home); };
        if (!settling() && !firstLink) U.anchor(render); else render();
      }
      renderNotices(state);
      if (home && !changed && !state.offline && timed(state.now) && Math.floor(Date.parse(oldNow) / 60000) !== Math.floor(Date.parse(state.now) / 60000)) {
        const render = () => {
          if (home.chats.q !== 'warming') { renderChats(home.chats); paintStatus('chats', home.chats); }
        };
        if (firstLink || settling()) render(); else U.anchor(render);
      }
      if (!home && (state.offline || ['none', 'gone'].includes(state.phase))) {
        unreadable();
      }
      const fallbackNote = state.fallbackNote || state.meta?.fallbackNote;
      for (const id of HOME_IDS) U.blockNote(cards[id].querySelector('.card__body'), { fallbackNote: /^数据截止\s/.test(fallbackNote) ? '' : fallbackNote });
      if (restoreY != null && home && state.meta?.status && state.meta.rev === paintedRev) requestAnimationFrame(restoreHome);
    },
    };
    for (const { id } of TASK_PAGES) {
      parts[id].head.querySelector('.head__link').href = href(id);
      labelCard(cards[id]);
      paintTaskCard(id, { phase: 'idle' });
    }
    watch = window.Live.watch('home', { project }, callbacks);
    scheduledWatch = window.Live.watch('tasks', { scope: 'scheduled', project }, { phase: state => paintTaskCard('tasks', state) });
  }
  window.LiveProjectLook?.load().then(looks => { projectLooks = looks; if (home?.projects) renderProjectGroups(home.projects); });
  subscribe();
  // AI 留言不随“只看某个项目”变，单独订一份；有变化就重画页顶那张卡
  window.Live.watch('ai-messages', null, { data(d) { aiMessages = Array.isArray(d?.items) ? d.items : null; if (lastState) renderNotices(lastState); } });
  // 硬件小包：页面看得见时约每 5 秒取一次，只换电脑卡里的 CPU 占用、内存和 CPU 温度，不重取整包（M519）
  // 小包不带 rev，data 只来第一次；每读完一次都会来的是 link。
  window.Live.watch('computer/hardware', null, { link(state) {
    const computer = home?.computer;
    if (!computer || computer.q === 'warming' || lastState?.offline || state.meta?.viewer?.kind !== viewer) return;
    if (!window.Live.mergeHardware(computer.metrics, state.data?.metrics)) return;
    // “读不准：CPU 温度（最近一次记录于 …）”跟着页面上的温度走：读数是新的就不再说读不准，旧了只把时刻换成这次读到的（M602）
    const temp = computer.metrics?.find(m => m.id === 'cpu-temp');
    let grayChanged = false;
    if (temp?.value != null && timed(temp.at) && Array.isArray(computer.gray_items)) {
      const old = temp.stale_after > 0 && Date.now() - Date.parse(temp.at) > temp.stale_after * 1000;
      const next = computer.gray_items.flatMap(g => {
        const reason = typeof g?.reason === 'string' ? g.reason : '';
        if (sp(U.fieldText(g?.name, viewer)) !== 'CPU 温度' || !/最近一次记录于 /.test(reason)) return [g];
        grayChanged = true;
        return old ? [{ ...g, reason: reason.replace(/最近一次记录于 [^，,]+/, `最近一次记录于 ${recordStamp(temp.at)}`) }] : [];
      });
      if (grayChanged) Object.assign(computer, { gray_items: next, gray_count: next.length });
    }
    const render = () => { renderComputer(computer, home.screen, home.phone); if (grayChanged) paintStatus('computer', computer); };
    if (settling()) render(); else U.anchor(render);
  } });

  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

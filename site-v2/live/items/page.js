// 第二层：四种等你的事、退出记录、两小时没答的汇报。详情在点开时取。
(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, $ = id => document.getElementById(id), { esc, sp } = U;
  const params = new URLSearchParams(location.search), project = params.get('project'), states = new Map();
  const matchesQuery = it => { const field = it.text && typeof it.text === 'object' ? { ...it, ...it.text } : it; return !(viewer === 'public' && (field.hidden || field.visibility === 'owner' || field.public === 'owner')) && U.fieldText(field).toLowerCase().includes(query); };
  let at = null, viewer = 'public', pendingItems = new Set(), reportsData = null, reportCount = null, openTrend = null, recentClosed = null;
  const route = href => { const u = new URL(href, location.origin); if (u.origin !== location.origin) return href; if (params.has('fixture') && u.pathname.startsWith('/live/')) u.searchParams.set('fixture', params.get('fixture')); return u.pathname + u.search + u.hash; };
  // M567：同一件事了结后又重新打开时编号不变；关闭清单的链接带上那次了结的时刻，详情页才找得到当时的结局。
  const closedHref = it => route('/live/item/?id=' + encodeURIComponent(it.id) + (it.closed?.at ? '&closed=' + encodeURIComponent(it.closed.at) : ''));
  const actions = it => {
    // M458：卡上不单独放“复制给 AI”，问情况就是复制给 AI（定稿卡-等你的事 开头，本人 11-22 16:04）
    const list = (it.actions || []).filter(a => a.intent !== 'done' && (!it.closed || !['later', 'ack', 'decline', 'close_report'].includes(a.intent))).map(a => ({ ...a, label: a.intent === 'ask' ? '问情况' : !a.label || typeof a.label === 'object' && !a.label.text && !a.label.value ? ({ ack: '我知道了', close_report: '关掉', later: '晚点提醒', decline: '不办了' })[a.intent] || (a.target === 'report' ? '看汇报' : '打开对话') : a.label }));
    if (!list.some(a => a.intent === 'ask')) list.unshift({ kind: 'copy', label: '问情况', intent: 'ask' });
    if (it.open && !list.some(a => a.kind === 'open')) list.push({ ...(typeof it.open === 'string' ? (/^(https?:|\/)/.test(it.open) ? { href: it.open } : { target: it.open }) : it.open), kind: 'open', label: it.open.label || '打开对话' });
    return U.goActions(it, list.map(a => typeof a.href === 'string' && a.href.startsWith('/live/') ? { ...a, href: route(a.href) } : a));
  };
  const optionActions = (d, q) => U.actions({ id: `${d.id}:question:${q.id}`, text: itemText(d) }, (q.options || []).map(o => ({ kind: 'copy', label: o, text: U.choiceText(d, itemText(d), q, o) })));
  function itemOrder(a, b) {
    const stamp = value => Date.parse(value) || 0;
    if (a.kind === 'later' && b.kind === 'later') {
      const soon = (stamp(a.act_from || a.due) || Infinity) - (stamp(b.act_from || b.due) || Infinity);
      if (soon && !Number.isNaN(soon)) return soon;
    }
    return stamp(b.episode_at || b.born) - stamp(a.episode_at || a.born);
  }
  const KIND = { do: '要你做', choose: '要你选', later: '你放着', know: '要你知道' }, CLOSED = { done: '你办完了', declined: '你说不办了', expired: '展示期已到', ai_closed: 'AI 判断不用办了', acknowledged: '本人已知', merged: '并进了别的条', unknown: '当时只记了关闭' };
  const wait = text => [{ key: 'empty', cls: 'row row--flat row--empty', html: `<span></span><p class="row__sub">${U.fieldHtml(U.offline?.() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读|正在准备/.test(text) ? '这块没存下来，连上后补上。' : text)}</p>` }];
  const itemText = it => sp(it.text && typeof it.text === 'object' ? { ...it, ...it.text } : it);
  const closedText = it => it.closed?.kind === 'unknown' || it.closed?.text === '本人关掉了这份汇报' ? it.closed.text || '' : viewer === 'public' && ['done', 'declined'].includes(it.closed?.kind) ? CLOSED[it.closed.kind].replace(/^你/, '本人') : CLOSED[it.closed?.kind] || '';
  // 后端结局原句已含“办完了／说不办了”时只写原句；原句开头是“你”还是“本人”都算同一句（后端 11-17 起写“本人办完了，AI 已核实”）
  const sameStart = (text, label) => !!text && sp(text).replace(/^(?:你|本人)/, '').startsWith(sp(label).replace(/^(?:你|本人)/, ''));
  const expiredText = /^展示期到了?(?=[，,、；;。\s]|$)/;
  const waitingMs = it => Math.max(0, Date.parse(states.get('home')?.now || at) - Date.parse(it.episode_at || it.born));
  const duration = ms => ms >= 86400000 ? `${Math.floor(ms / 86400000)} 天` : ms < 60000 ? '不到 1 分钟' : U.minutes(Math.floor(ms / 60000));
  const waited = it => { const ms = waitingMs(it); return Number.isFinite(ms) ? `已等${ms < 60000 ? '' : ' '}${duration(ms)}` : U.collectionText("等待时长"); };
  function itemAge(it) {
    return it.age_days > 0 ? `挂了 ${sp(it.age_days)} 天` : '';
  }
  const bar = U.topbar({ ask: () => `请看实况等你的事：${$('head').textContent}。请说明各项现在的情况。` });
  // 访客版页头不把访客当“你”：标题和第一句写“本人”，和数字卡“等本人”一个说法；本人版照原样（M681）。
  // 第一次显示前就定好：这台设备存着有效配对标记、又没切到“看公开版”的按本人版写，其余按访客版写（页头随动效在脚本跑完后才露出来）；回包到了再按 viewer 核一次
  const titleParts = [document.querySelector('.lbp-title h1'), document.querySelector('.lbp-title p > span')].filter(Boolean).map(el => [el, el.textContent]);
  const pageTitle = (kind = viewer) => titleParts.forEach(([el, text]) => { el.textContent = kind === 'public' ? text.replaceAll('你', '本人') : text; });
  const pairedHere = (() => { try { return /^[A-Za-z0-9_-]{43}$/.test(localStorage.getItem('wly-cockpit-device') || '') && !window.LiveView?.isPublic?.(); } catch { return false; } })();
  pageTitle(pairedHere ? 'owner' : 'public');
  L.add($('hero'));
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  document.querySelectorAll('a[href^="/live/"]').forEach(a => a.href = route(a.getAttribute('href')));
  // “近 7 天下去的”和别的组在同一块两栏里，接在短的那一栏下面（M504）
  const board = window.LiveBoard.create($('groups'), { columns: [], cols: 2 });
  document.querySelector('.lbp-tools__end').insertAdjacentHTML('afterbegin', '<button id="open-next" class="more" type="button" hidden></button>');
  const openMore = $('open-next'); openMore.addEventListener('click', () => readOpen());
  const cards = new Map(), collections = new Map(), initialReads = new Set(); let query = '', balanceKey = '';
  const hiddenWhileWriting = new Map();
  const hiddenByWrite = item => {
    const entry = hiddenWhileWriting.get(item.id);
    return viewer === 'owner' && entry && (entry.pending || entry.version === item.item_version);
  };
  // 办成后马上跟上（M903）：后台从登记到写成要几秒，办成那一刻重读的退出列表和清单可能还是旧的。
  // 回执已确认写成的，先照办成的结果摆上：“我知道了”“不办了”“关掉汇报”放进“近 7 天下去的”，“晚点提醒”放进“你放着”；
  // 后台读数里出现这件（退出记录里有这一次，或清单里换成了新版本）就换成后台那条，旧读数不把它盖回去。
  // 这期间照办理回查的节奏接着重读（前一分钟每 3 秒，之后每 15 秒），最多两分半，到点照后台读数。
  const landed = new Map(), writeStarted = new Map();
  const LANDED_KIND = { ack: 'acknowledged', decline: 'declined' };
  function landItem(item, intent) {
    const at = new Date().toISOString(), base = { since: writeStarted.get(item.id) ?? Date.now(), saved: Date.now(), version: item.item_version };
    // 先摆上的“你放着”和后台那条一个样子：写上明早 10 点起该办（同后台 tomorrow_10），只留问情况、不办了和网站链接，不再挂“晚点提醒”
    const tomorrow10 = (d => (d.setUTCDate(d.getUTCDate() + 1), d.toISOString().slice(0, 10) + 'T10:00:00+08:00'))(new Date(Date.now() + 8 * 3600e3));
    if (intent === 'later') landed.set(item.id, { ...base, key: 'later', row: { ...item, kind: 'later', act_from: tomorrow10, due: null, now: null, actions: (item.actions || []).filter(a => a.intent === 'ask' || a.intent === 'decline' || a.href), _landed: true } });
    else if (intent === 'close_report') {
      const id = item.owner_item || item.item_id || item.item || item.id;
      landed.set(id, { ...base, key: 'closed', row: { id, kind: 'choose', text: item.text, title: item.title, actions: [], closed: { at, kind: 'declined', text: '本人关掉了这份汇报' }, _landed: true } });
    } else if (LANDED_KIND[intent]) landed.set(item.id, { ...base, key: 'closed', row: { ...item, closed: { at, kind: LANDED_KIND[intent] }, _landed: true } });
  }
  // 后台读数已经有这一次的结果，就不再摆先放上去的那条
  function withLanded(key, rows) {
    if (!Array.isArray(rows) || !landed.size) return rows;
    const extra = [];
    for (const [id, w] of landed) {
      if (w.key !== key) continue;
      const seen = key === 'closed' ? rows.some(it => it.id === id && Date.parse(it.closed?.at) >= w.since - 120000)
        : [...collections].some(([k, c]) => k !== 'closed' && k !== 'reports' && c.items?.some(it => it.id === id && it.item_version !== w.version));
      if (seen) landed.delete(id); else extra.push(w.row);
    }
    return extra.length ? [...extra, ...rows] : rows;
  }
  let landedTimer = 0;
  function followLanded() {
    clearTimeout(landedTimer);
    const now = Date.now(), before = landed.size;
    for (const [id, w] of landed) if (now - w.saved > 150000) landed.delete(id);
    if (landed.size !== before) { redrawItems(); drawClosed(); }
    if (!landed.size) return;
    const first = Math.min(...[...landed.values()].map(w => w.saved));
    landedTimer = setTimeout(() => window.Live.refresh().finally(followLanded), now - first < 60000 ? 3000 : 15000);
  }
  $('item-action-receipts').addEventListener('item-write', ({ detail: { items, saved, intent } }) => {
    for (const item of items) {
      if (saved === null) writeStarted.set(item.id, Date.now());
      if (saved === null || saved.includes(item.id)) hiddenWhileWriting.set(item.id, { pending: saved === null, version: item.item_version });
      else hiddenWhileWriting.delete(item.id);
      if (saved?.includes(item.id) && viewer === 'owner') landItem(item, intent);
    }
    // 旧滚动锚点可能正是要撤下的那行，不能再用它锁位置。
    U.anchor.stop();
    redrawItems();
    if (reportsData) renderReports(reportsData);
    if (saved?.length) { drawClosed(); followLanded(); }
  });
  function redrawItems() { for (const [key, c] of collections) list(key, c.items, c.empty, c.renderer, true, c.partial); balanceBoard(true); }
  $('due-sort').addEventListener('change', redrawItems);
  function dueOrder(items) {
    if ($('due-sort').value !== 'due') return items;
    const when = it => { const t = Date.parse(it.due || it.act_from); return Number.isFinite(t) ? t : Infinity; };
    return [...items].sort((a, b) => when(a) - when(b));
  }
  const labels = { ...KIND, reports: '等你答的汇报', closed: '近 7 天下去的' };
  const hints = { choose: '需要你选择、确认或提供结论的事项。', do: '需要你确认、操作或提供信息的事项。', later: '放着，到了该办的时候再提醒。', know: '只需了解的进展与通知。', closed: '已经从等你的清单下去的事项。', reports: '还有问题等你答的汇报。' };
  // 卡片头第二行同页头一样：访客版不把访客当“你”，写“本人”；本人版一字不改（M687）。第一次显示按配对标记定，回包到了按 viewer 再核一次
  const hintText = (kind, as = viewer) => as === 'public' ? hints[kind].replaceAll('你', '本人') : hints[kind];
  for (const kind of ['do', 'choose', 'later', 'know', 'reports', 'closed']) {
    const c = board.card(kind, { icon: ({ do: 'sparkle', choose: 'chat', closed: 'check', reports: 'chat' })[kind] || 'clock', art: kind, tint: ({do:'peach',choose:'lilac',later:'cyan',know:'blue',reports:'pink',closed:'green'})[kind], ids: { el: kind, main: kind+'-list', rest: kind+'-rest', more: kind+'-more', box: kind+'-box', next: kind === 'closed' ? 'closed-next' : kind+'-next' } });
    c.title.dataset.keep = ''; c.title.textContent = labels[kind]; c.sub.textContent = hintText(kind, pairedHere ? 'owner' : 'public'); cards.set(kind, c);
    $('kind-pick').insertAdjacentHTML('beforeend', `<option value="${kind}">${labels[kind]}</option>`);
  }
  const closedCard = cards.get('closed');
  closedCard.more.setAttribute('aria-controls', 'closed-box');
  closedCard.more.after(closedCard.next);
  function balanceBoard(force = false) {
    const shown = [...cards].filter(([kind,c]) => kind !== 'closed' && !c.el.hidden), picked = $('kind-pick').value, closed = cards.get('closed').el;
    const key = shown.map(([kind]) => kind).join() + picked + query + closed.hidden;
    if (!force && key === balanceKey) return; balanceKey = key;
    const heights = shown.map(([,c]) => c.el.getBoundingClientRect().height + 22); let best = 1, delta = Infinity;
    for (let mask = 1; mask < (1 << shown.length) - 1; mask++) {
      if (!(mask & 1)) continue;
      const diff = Math.abs(heights.reduce((sum,h,i) => sum + (mask & (1 << i) ? h : -h), 0));
      if (diff < delta) { delta = diff; best = mask; }
    }
    shown.forEach(([,c],i) => { c.el.dataset.itemsCol = ''; c.el.style.setProperty('--items-column', picked ? '1 / -1' : best & (1 << i) ? '1' : '2'); });
    // “近 7 天下去的”放进短的那一栏，接在那一栏最后一组下面；只剩它一张时占整宽
    const left = heights.reduce((sum, h, i) => sum + (best & (1 << i) ? h : 0), 0), wide = !!picked || !shown.length;
    closed.dataset.itemsCol = ''; closed.toggleAttribute('data-wide', wide);
    closed.style.setProperty('--items-column', wide ? '1 / -1' : left * 2 <= heights.reduce((sum, h) => sum + h, 0) ? '1' : '2');
    board.layout();
    if (!picked) requestAnimationFrame(() => shown.sort(([,a],[,b]) => a.el.offsetTop - b.el.offsetTop || a.el.offsetLeft - b.el.offsetLeft).forEach(([kind]) => { const stat = $('stats').querySelector(`[data-kind="${kind}"]`); if (stat) $('stats').append(stat); }));
  }
  function filterBoard() {
    const picked = $('kind-pick').value, status = $('state-pick').value;
    $('stats').querySelectorAll('[data-kind]').forEach(button => {
      button.setAttribute('aria-pressed', String(status !== 'closed' && button.dataset.kind === picked));
    });
    for (const [kind, c] of cards) {
      c.el.hidden = kind === 'closed' && status === 'closed' ? picked === 'reports' :
        (kind === 'reports' && reportCount === 0) || !!picked && picked !== kind || !!status && (status === 'closed' ? kind !== 'closed' : kind === 'closed');
    }
    redrawClosed();
    board.only(picked && picked !== 'closed' && status !== 'closed' ? picked : null);
    $('board-empty').hidden = [...cards].some(([, c]) => !c.el.hidden); showOpenMore(); balanceBoard();
  }
  $('kind-pick').addEventListener('change', filterBoard); $('state-pick').addEventListener('change', filterBoard);
  $('stats').addEventListener('click', event => {
    const button = event.target.closest('button[data-kind]');
    if (!button) return;
    $('kind-pick').value = button.getAttribute('aria-pressed') === 'true' ? '' : button.dataset.kind;
    if ($('state-pick').value === 'closed') $('state-pick').value = '';
    filterBoard();
  });
  document.querySelectorAll('a[href="#reports"]').forEach(a => a.addEventListener('click', e => { if (reportCount !== 0) return; e.preventDefault(); $('kind-pick').value = 'reports'; filterBoard(); }));
  $('search').addEventListener('submit', e => e.preventDefault());
  $('q').addEventListener('input', () => { query = $('q').value.trim().toLowerCase(); redrawItems(); if (reportsData) renderReports(reportsData); });
  const readers = { home: [U.reading($('hero').querySelector('.card__body'), { ghost: U.ghost.card(1), name: '等你的事' }), ...Object.keys(KIND).map(key => U.reading($(key), { ghost: U.ghost.rows(2), slow: false }))], 'items/closed': [U.reading($('closed'), { ghost: U.ghost.rows(4) })], reports: [U.reading($('reports'), { ghost: U.ghost.rows(3) })] };
  for (const key of [...Object.keys(KIND), 'closed', 'reports']) U.fold($(key + '-more'), $(key + '-box'));
  function sideHtml(trend, closed) {
    if (!Array.isArray(trend)) return closed == null ? `<p>${U.collectionText()}</p>` : closed.length ? [...closed].sort((a,b) => Date.parse(b.closed?.at || 0) - Date.parse(a.closed?.at || 0)).slice(0, 4).map(it => `<a class="closed-peek" href="${esc(closedHref(it))}"><span>${U.fieldHtml(it.text && typeof it.text === 'object' ? {...it,...it.text} : it, {kind:viewer})}</span><time>${U.date(it.closed?.at)}</time></a>`).join('') : '<p>近 7 天没有下去的事</p>';
    const days = trend.slice(-7), values = days.map(d => d.open).filter(Number.isFinite);
    const min = values.length ? Math.min(...values) : 0, max = Math.max(min, ...values);
    const step = Math.max(max >= 10 ? 2 : 1, Math.ceil((max - min + 2) / 4));
    const bottom = Math.max(0, Math.floor((min - step) / step) * step);
    const top = Math.max(bottom + 3 * step, Math.ceil((max + step) / step) * step);
    const left = Math.max(30, String(top).length * 7 + 14);
    const x = i => left + i * (284 - left) / Math.max(1, days.length - 1), y = n => 86 - (n - bottom) * 64 / (top - bottom);
    const scale = values.length ? Array.from({ length: (top - bottom) / step + 1 }, (_, i) => {
      const n = bottom + i * step;
      return `<line class="needs-trend__grid" x1="${left}" x2="284" y1="${y(n)}" y2="${y(n)}"/><text class="needs-trend__tick" x="${left - 8}" y="${y(n) + 3}" text-anchor="end">${n}</text>`;
    }).join('') : '';
    let path = '', gap = true;
    days.forEach((d,i) => { if (d.open == null) { gap = true; return; } path += `${gap ? 'M' : 'L'}${x(i)},${y(d.open)} `; gap = false; });
    const last = days[days.length-1];
    return `<p class="trend-last">全站 · 最后一天 <b>${last?.open == null ? '—' : esc(last.open)}</b> 件未办</p><svg class="needs-trend" viewBox="0 0 300 118" role="img" aria-label="近 7 天待办件数，缺数的日期留空">${scale}<path class="needs-trend__line" d="${path.trim()}"/>${days.map((d,i) => `${d.open == null ? '' : `<circle cx="${x(i)}" cy="${y(d.open)}" r="3"/>`}<text x="${x(i)}" y="108" text-anchor="middle"><title>${esc(d.open == null ? d.gap || '这天没读到' : `${d.open} 件未办`)}</title>${esc(d.date.slice(5))}</text>`).join('')}</svg>`;
  }
  function renderSide() { U.html($('side-body'), sideHtml(openTrend, recentClosed)); }
  // 展开后的说明和问题整段照原文显示，不按字数截（M690，本人 11-24：字数上限是让写的人在这个字数内说清，不是显示时省略）。
  // 经过只画有内容的：后台“登记事项”“核对事项”这类纯流水（和旧的“事项已加入等你的清单”）对这件事没有信息，不画；时间取 occurred_at（M691）
  const ledgerOnly = h => /^(?:登记事项|核对事项|事项已加入等你的清单)$/u.test(String((h?.text && typeof h.text === 'object' ? h.text.text : h?.text) ?? '').trim());
  function details(ul) {
    for (const btn of ul.querySelectorAll('[data-text-toggle]')) {
      const row = btn.closest('.row'), title = row.querySelector('.row__title'), opened = row.dataset.textOpen === 'true';
      requestAnimationFrame(() => { btn.hidden = !opened && title.scrollHeight <= title.clientHeight + 1; }); btn.textContent = opened ? '收起' : '展开'; btn.setAttribute('aria-expanded', String(opened));
      btn.onclick = () => { const open = row.dataset.textOpen !== 'true'; row.dataset.textOpen = String(open); btn.textContent = open ? '收起' : '展开'; btn.setAttribute('aria-expanded', String(open)); };
    }
    for (const btn of ul.querySelectorAll('[data-detail]')) {
      if (btn._fold) continue;
      btn._fold = true;
      const row = btn.closest('.row'), box = document.createElement('div'); box.className = 'fold row__detail'; box.innerHTML = '<div></div>'; row.querySelector('.row__text').append(box);
      U.fold(btn, box, target => new Promise(resolve => {
        U.html(target, '');
        const reading = U.reading(target, { ghost: U.ghost.rows(2) }); let detailWatch;
        const finish = loaded => { queueMicrotask(() => detailWatch?.stop()); resolve(loaded); };
        detailWatch = window.Live.watch(`items/${encodeURIComponent(btn.dataset.detail)}`, null, {
          phase(s) { if (s.data == null) reading.set(s); },
          link(s) { if (s.data == null && ['none', 'gone'].includes(s.phase)) { reading.set(s); if (s.phase === 'none') U.html(target, `<p class="row__sub">${s.offline || U.offline?.() ? '这块没存下来，连上后补上。' : U.collectionText()}</p>`); finish(false); } U.blockNote(target, s); },
          data(d) { if (!d) return;
            if (viewer === 'public' && (d.visibility === 'owner' || d.public === 'owner')) { U.html(target, `<p class="row__line">${U.visibilityNote({ visibility: 'owner' }, viewer, '这件事的内容')}</p>`); reading.done(); finish(true); return; }
            U.html(target, (d.detail_text ? `<p class="row__line" style="white-space: pre-line">${U.fieldHtml(U.capText(d.detail_text, Infinity), { kind: viewer })}</p>` : '') + (d.questions || []).map(q => `<p class="row__line" style="white-space: pre-line">${U.fieldHtml(U.capText(q.text && typeof q.text === 'object' ? q.text : q, Infinity), { kind: viewer })} </p><div class="item-options">${optionActions(d, q)}</div>`).join('') + (d.history || []).filter(h => !ledgerOnly(h)).map(h => `<p class="row__sub">${U.date(h.occurred_at || h.at)} ${U.time(h.occurred_at || h.at)} · ${U.fieldHtml(h.text, { kind: viewer })}</p>`).join('') + (d.origin?.href ? `<a class="more" href="${esc(route(d.origin.href))}">${U.fieldHtml(U.originName(d.origin, d) || '打开来源', { name: '来源', place: 'label', kind: viewer })} ›</a>` : ''));
            reading.done(); finish(true);
            if (d.rewrite === 'pending' && itemText(d) != null && itemText(d) !== '') target.insertAdjacentHTML('afterbegin', `<p class="row__line">${U.fieldHtml(d.text && typeof d.text === 'object' ? { ...d, ...d.text } : d, { kind: viewer })}${d.at ? ` · ${U.date(d.at)} ${U.time(d.at)}` : ''}</p>`);
            if (d.origin && !d.origin.href && U.originName(d.origin, d)) target.insertAdjacentHTML('beforeend', `<p class="row__sub">来源：${U.fieldHtml({ ...d.origin, text: U.originName(d.origin, d) }, { kind: viewer })}</p>`);
            if (!row.querySelector('.item-source')) target.insertAdjacentHTML('beforeend', runSource(d));
            if (d.closed) target.insertAdjacentHTML('beforeend', `<p class="row__sub">${U.fieldHtml(closedText(d), { kind: viewer })} · ${U.date(d.closed.at)} ${U.time(d.closed.at)}</p>${d.closed.to ? `<a class="more" href="${esc(route('/live/item/?id=' + encodeURIComponent(d.closed.to)))}">看并入的事 ›</a>` : ''}`);
          },
        });
      }));
      btn.addEventListener('click', () => row.classList.toggle('is-expanded', btn.getAttribute('aria-expanded') === 'true'));
    }
  }
  // 这张卡是哪一轮自动任务弄出来的：后台 automation_runs 写明了才写，点了到那一轮；老卡没写的不按标题、时间去猜（本人 11-24 定的来回的路）
  const runSource = it => { const runs = window.LiveRuns?.sources(it, viewer) || []; return runs.length ? `<p class="row__sub item-source">来源：${runs.map(r => r.href ? `<a href="${esc(route(r.href))}">${esc(r.label)} ›</a>` : esc(r.label)).join('、')}</p>` : ''; };
  const sourceAt = data => Object.hasOwn(data, 'source_at') ? data.source_at : data.at;
  const itemRecordedAt = it => it.recorded_at || it.changed || it.born;
  const selected = new Set(), selectable = new Map();
  const selection = $('item-selection'), selectionActions = $('item-selection-actions');
  // M663：访客版按钮照样摆出来（多选框也是），没配对的设备点了弹全站共用的可信设备说明框（M803），什么都不改（定稿卡-等你的事 第一节第 4 条）。
  const CLOSE_INTENTS = ['ack', 'later', 'decline', 'close_report'];
  const pickIntent = (it, action) => viewer === 'owner' ? (action.intent === 'done' ? '' : U.itemIntent(it, action)) : CLOSE_INTENTS.includes(action.intent) ? action.intent : '';
  function checkbox(it) {
    if (!it.actions?.some(action => pickIntent(it, action))) return '';
    selectable.set(it.id, it);
    return '<label class="items-choice" data-slot="pick" title="多选：勾上几件，一起确认"><input type="checkbox" data-select-item="' + esc(it.id) + '" aria-label="选择 ' + esc(itemText(it)) + '"' + (selected.has(it.id) ? ' checked' : '') + '></label>';
  }
  function renderSelection() {
    const available = new Map();
    for (const box of document.querySelectorAll('[data-select-item]')) {
      const id = box.dataset.selectItem, item = selectable.get(id);
      if (item) available.set(id, item);
    }
    for (const id of selected) if (!available.has(id)) selected.delete(id);
    const operations = new Map();
    for (const id of selected) {
      const item = available.get(id);
      for (const action of item.actions) {
        // 有后续的“不办了”和普通“不办了”合成一个按钮，确认框里再分组。
        const intent = pickIntent(item, action), key = intent === 'decline_copy' ? 'decline' : intent;
        if (key) operations.set(key, [...(operations.get(key) || []), item]);
      }
    }
    const open = selected.size > 0;
    selection.classList.toggle('is-open', open); selection.inert = !open; selection.setAttribute('aria-hidden', String(!open));
    U.html($('item-selection-count'), '已选<b>' + selected.size + '</b>件');
    const ORDER = ['done', 'ack', 'later', 'decline', 'decline_copy', 'close_report'];
    const ordered = [...operations].sort(([a], [b]) => ORDER.indexOf(a) - ORDER.indexOf(b));
    operations.clear(); ordered.forEach(([intent, rows]) => operations.set(intent, rows));
    const signature = [...operations].map(([intent, rows]) => intent + ':' + rows.length + ':' + rows.filter(item => item.decline_followup).length).join('|');
    if (selectionActions.dataset.signature !== signature) {
      selectionActions.dataset.signature = signature;
      U.html(selectionActions, [...operations].map(([intent, rows]) => '<button class="btn btn--sm" type="button" data-batch-action="' + esc(intent) + '" aria-haspopup="dialog">' + esc(U.itemLabels[intent === 'decline' && rows.every(item => item.decline_followup) ? 'decline_copy' : intent]) + (rows.length === selected.size ? '' : ' · ' + rows.length + ' 件') + '</button>').join(' '));
    }
    for (const button of selectionActions.querySelectorAll('[data-batch-action]')) {
      button.onclick = () => U.confirmItems(button, operations.get(button.dataset.batchAction), button.dataset.batchAction, ids => {
        ids.forEach(id => selected.delete(id));
        redrawItems(); if (reportsData) renderReports(reportsData);
        renderSelection();
      });
    }
  }
  document.addEventListener('change', event => {
    const id = event.target.dataset.selectItem;
    if (!id) return;
    if (event.target.checked) selected.add(id); else selected.delete(id);
    renderSelection();
  });
  selection.querySelector('[data-clear]').addEventListener('click', () => {
    selected.clear(); document.querySelectorAll('[data-select-item]').forEach(box => { box.checked = false; }); renderSelection();
  });
  const normalizeNote = note => sp(note).replace(/\s+/g, ' ').trim();
  const stalePrefix = /^(?:这次没读到[，,]\s*(?:最近一次记录于|上一次读到是)|数据截止|数据停在)\s*/;
  function staleReading(it) {
    if (!['gray', 'off'].includes(it.light) || (it.gray_reason && it.gray_reason !== 'stale') || it.last_level === 'red') return;
    const source = itemRecordedAt(it), stamp = Date.parse(source), why = normalizeNote(U.fieldText(it.why, viewer));
    if (!Number.isFinite(stamp) || (why && !stalePrefix.test(why)) || /最后读到/.test(why)) return;
    const time = U.time(source, Object.hasOwn(it, 'source_at') ? undefined : it.at_precision);
    const { note } = U.status({ ...it, source_at: source, level: it.light, partial: [], attention_count: 0, gray_count: 0, ai_fixing_count: null });
    if (note) return { stamp, time, note, key: JSON.stringify([stamp, time, normalizeNote(note)]) };
  }
  function row(it, closed = false, shared = '') {
    function brief(html) {
    return html;   // 两版同一套（本人禁令 11-24 14:16）：两版都给全文，访客版不再先收成一句
    }
    const flags = it.text && typeof it.text === 'object' ? it.text : it, hidden = viewer === 'public' && (it.visibility === 'owner' || it.public === 'owner' || flags.visibility === 'owner' || flags.public === 'owner');
    const placeholder = hidden || viewer === 'public' && (flags.hidden || flags.rewrite === 'pending' && !flags.text && !flags.value);
    const mark = placeholder ? U.fieldHtml(hidden ? { visibility: 'owner' } : flags, { name: '这件事的内容', kind: viewer }) : viewer === 'owner' && (it.visibility === 'owner' || it.public === 'owner' || U.visitorFieldKind(it, ['$', 'text', 'title'])) ? U.visitorHiddenMark(it, '这件事', viewer, { keys: ['$', 'text', 'title'], rewrittenWhat: '这件事的说法' }) : U.visibilityNote(it, viewer, '这件事的内容'), deadline = it.act_from ? `${U.date(it.act_from)} 起该办了` : it.due ? `${U.date(it.due)} 前${it.kind === 'choose' ? '要选' : '要办'}` : '';
    let closing = it.closed?.text && (typeof it.closed.text === 'object' ? it.closed.text : viewer === 'public' ? it.closed.text.replace(/^你(?=办完了|说不办了)/, '本人') : it.closed.text);
    if (typeof closing === 'string' && it.closed?.kind === 'expired') closing = closing.replace(expiredText, '展示期已到');
    const mobile = it.mobile && typeof it.mobile === 'object' ? it.mobile : ({ phone: '手机能办', computer: '要在电脑上办', in_person: '要本人到场' })[it.mobile];
    const sub = closed ? [...(sameStart(closing, closedText(it)) || it.closed?.kind === 'expired' && expiredText.test(sp(closing)) ? [closing] : [closedText(it), closing]), U.date(it.closed?.at), it.repeats > 1 && `同一件事关过 ${it.repeats} 次`] : [U.capText(it.now, 60, true), it.kind !== 'know' && mobile, it.kind !== 'know' && it.minutes != null ? `约 ${sp(it.minutes)} 分钟` : '', itemAge(it) || (it.kind === 'know' ? U.ago(it.episode_at || it.born, states.get('home')?.now || at) : waited(it)), deadline, U.originName(it.origin, it) && U.capText(U.originName(it.origin, it), Infinity, true)];
    if (closed && KIND[it.kind]) sub.unshift(viewer === 'public' ? KIND[it.kind].replaceAll('你', '本人') : KIND[it.kind]);
    // 标题和来源整句显示，放不下就换行，不按字数截成“…”（M760，同 M690：字数上限是给写的人的，不是显示时省略）
    const titleText = U.fieldHtml(hidden ? { visibility: 'owner' } : U.capText(flags, Infinity, true), { name: closed ? '已关闭事项' : '待办事项', place: 'title', kind: viewer });
    // 占位行的标题已写清“〈哪一样〉仅本人可见”时，旁边不再重复同一句。
    const markSaid = mark.replace(/<[^>]*>|🔒/g, '').trim(), shownMark = placeholder && markSaid === titleText.replace(/<[^>]*>/g, '').trim() ? '' : mark;
    const archivedTitle = titleText;   // 已关掉的不再加“当时记录：”，直接说是什么事（本人 11-23 11:54）
    const title = placeholder ? `<span class="row__title">${titleText}</span>` : closed ? `<a class="row__title" href="${esc(closedHref(it))}">${archivedTitle}</a>` : it.detail ? `<button class="row__title detail-toggle" type="button" data-detail="${esc(it.id)}">${titleText} <span class="more__chev">›</span></button>` : `<span class="row__title">${titleText}</span>`;
    const subtitle = sub.filter(s => s && !(/正在换说法|仅本人可见/.test(sp(s)) && sp(s) === itemText(it)) && !(hidden && /仅本人可见|可信设备可见/.test(sp(s))) && !(U.offline?.() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读/.test(sp(s)))).map(s => `<span class="item-bit${s === deadline || /^(?:已等|约 |挂了 |\d\d-\d\d)/.test(sp(s)) ? ' item-keep' : ''}">${U.fieldHtml(s, { kind: viewer })}</span>`).join('');
    // M225：卡片只报自己的记录时刻；整组采集时刻（stale_text/gap）已在页头说过，不再逐卡重复。
    const { lamp, note } = U.status({ ...it, source_at: itemRecordedAt(it), stale_text: null, gap: null, level: it.light }, { small: true });
    const detail = shared && (note === shared || note.startsWith(`${shared} · `)) ? note.slice(shared.length + 3) : note;
    return { key: it.id, cls: 'row row--flat lb-item', html: `${['green', 'ok'].includes(it.light) ? '' : lamp}<div class="row__text"><p class="row__main">${title}${shownMark ? `<span class="row__meta">${shownMark}</span>` : ''}<button type="button" class="more item-expand" data-text-toggle hidden aria-expanded="false">展开</button></p>${subtitle ? `<div class="row__sub">${brief(subtitle)}</div>` : ''}${detail ? `<p class="row__sub">${detail}</p>` : ''}${runSource(it)}${it.closed?.to ? `<a class="more" href="${esc(route('/live/item/?id=' + encodeURIComponent(it.closed.to)))}">看并入的事 ›</a>` : ''}</div><div class="row__acts">${actions(it)}${!closed ? checkbox(it) : ''}</div>` };
  }
  function list(key, items, empty, renderer = row, animate = true, partial = false) {
    collections.set(key, { items, empty, renderer, partial });
    const known = Array.isArray(items);
    const closedKind = key === 'closed' ? $('kind-pick').value : '';
    if (key !== 'closed' && key !== 'reports') items = withLanded(key, items);
    items = (items || []).filter(it => (key === 'closed' || it._landed || !hiddenByWrite(it) && !U.justSaved(it)) && (!query || matchesQuery(it)) && (!KIND[closedKind] || it.kind === closedKind));
    if (key !== 'closed' && key !== 'reports') {
      U.blockNote($(key), null);
      items = dueOrder(items);
    }
    // 新私事规则（本人 11-24 02:56）：访客版不再按条藏，组标题只数看得到的行，也不再写“另有 N 件仅本人可见”。
    const count = partial ? key === 'closed' ? '已读 ' + items.length + ' 件' : '已读部分' + (items.length ? ' · ' + items.length + ' 件' : '') : (known ? items.length : '—') + ' 件';
    U.html(cards.get(key).title, (viewer === 'owner' ? labels[key] : labels[key].replaceAll('你', '本人')) + '<span class="lb-count">（' + count + '）</span>');
    // M665：近 7 天下去的按事情本来的类别分组（要你做／要你选／你放着／要你知道），不再按“电脑办／手机办”分、不再有“其他”这一组（本人 11-24 02:21）。
    const order = Object.keys(KIND), rank = it => { const i = order.indexOf(it?.kind); return i < 0 ? order.length : i; };
    const method = it => Object.hasOwn(KIND, it?.kind) ? it.kind : '';
    // M852：四组按“这组最近一次下去的时刻”排，刚办完的那组在最前；组里照旧新的在上；时刻相同的组照原来的先后（主控 11-25 17:08 转本人 17:03 的话后照建议 A 定，两版同一套）
    if (key === 'closed') {
      const when = it => Date.parse(it?.closed?.at) || 0, latest = new Map();
      for (const it of items) latest.set(method(it), Math.max(latest.get(method(it)) ?? 0, when(it)));
      items.sort((a, b) => latest.get(method(b)) - latest.get(method(a)) || rank(a) - rank(b) || when(b) - when(a));
    }
    const grouped = key === 'closed' && items.length > 0 && method(items[0]) !== method(items.at(-1));
    const groupName = kind => KIND[kind] ? viewer === 'public' ? KIND[kind].replaceAll('你', '本人') : KIND[kind] : '没写类别';
    // 本人版列表默认给全；访客照旧先摆 5 条。
    const ul = $(key + '-list'), limit = Infinity, main = items.slice(0, limit), rest = items.slice(limit), pinned = new Set([...ul.children].filter(n => n.matches('.is-expanded,[data-text-open="true"],:hover,:focus-within')).map(n => n.dataset.key));
    if (key !== 'closed') for (let i = rest.length - 1; i >= 0; i--) if (pinned.has(rest[i].id)) main.push(...rest.splice(i, 1));
    const draw = (group, previous) => group.flatMap(it => {
      if (!grouped) return [renderer(it)];
      const current = method(it), heading = previous !== current;
      previous = current;
      return heading ? [{ key: 'method-' + current, cls: 'items-done-group', html: '<span>' + esc(groupName(current)) + '</span>' }, renderer(it)] : [renderer(it)];
    });
    U.list(ul, main.length ? draw(main) : wait(empty), { animate });
    U.list($(key + '-rest'), draw(rest, method(main.at(-1))), { animate });
    const more = $(key + '-more'), label = `还有 ${rest.length} 条`;
    more.hidden = !rest.length;
    U.html(more, (key === 'closed' ? `<span class="lb-more__open">${label}</span><span class="lb-more__shut">收起</span>` : label) + ' <span class="more__chev">›</span>');
    details(ul); details($(key + '-rest')); renderSelection();
  }
  let openRows = null, openReading = null, openStarted = false, readOpen;
  function showOpenMore() {
    const picked = $('kind-pick').value;
    openMore.hidden = openRows?.cursor == null || !collections.get('do')?.partial || $('state-pick').value === 'closed' || !!picked && !Object.hasOwn(KIND, picked);
    if (openMore.hidden) return;
    openMore.disabled = !!openReading.loading;
    openMore.textContent = openReading.loading ? '正在读后续事项' : openReading.failed ? '重试后续事项 ›' : '继续读后续事项 ›';
  }
  function watchOpen(render) {
    function draw(firstOpen) {
      const s = states.get('home');
      if (s?.data && s.viewer?.kind === openRows.kind) U.anchor(() => {
        render(s.data, { ...s.meta, now: s.now, firstOpen });
        requestAnimationFrame(() => requestAnimationFrame(() => balanceBoard(true)));
      });
    }
    readOpen = () => {
      const page = openReading, cursor = page?.cursor;
      if (cursor == null || page.kind !== viewer || page.loading) return;
      page.loading = true;
      showOpenMore();
      const query = { project, cursor };
      if (page.follow) { window.Live.get('items', query); return; }
      // 续页失败时保留订阅，和第一页一起参与页眉重读，即使第一页返回 304。
      page.follow = window.Live.watch('items', query, { link(s) {
        if (page !== openReading || page.cursor !== cursor || !page.follow || s.warming) return;
        const valid = s.viewer?.kind === page.kind && Array.isArray(s.data?.items) && s.meta.status >= 200 && s.meta.status < 400;
        const changed = valid && s.data.source_rev !== page.version;
        const failed = !valid || s.meta.at !== page.at || changed;
        if (valid && failed && (Date.parse(s.meta.at) > Date.parse(page.at) || changed && s.meta.at === page.at) && !page.reloading) {
          page.reloading = true;
          window.Live.get('items', { project }).finally(() => { page.reloading = false; });
        }
        if (failed && page.failed && !page.loading) return;
        page.loading = false;
        page.failed = failed;
        if (!failed) {
          const rows = new Map([...page.items, ...s.data.items].map(it => [it.id, it]));
          page.items = [...rows.values()];
          page.cursor = s.data.next;
          page.follow.stop();
          page.follow = null;
          if (++page.depth < page.target && page.cursor != null) { readOpen(); return; }
          openRows = page;
        }
        draw(false);
      } });
    };
    window.Live.watch('items', { project }, { data(d, meta) {
      const kind = meta.viewer?.kind || 'public', firstOpen = openRows?.kind !== kind || openRows.items == null;
      const target = firstOpen ? 2 : openRows.depth;
      const replace = firstOpen || openRows.at !== meta.at || openRows.version !== d?.source_rev;
      openReading?.follow?.stop();
      const items = Array.isArray(d?.items) ? [...new Map(d.items.map(it => [it.id, it])).values()] : null;
      const incomplete = ['partial', 'unknown', 'warming'].includes(d?.q) || d?.counts?.q === 'partial' || d?.partial?.includes('items');
      openRows = openReading = { kind, items, incomplete, counts: d?.counts, version: d?.source_rev,
        hidden: d?.hidden, hiddenCounts: d?.hidden_summary?.counts, cursor: items == null ? null : d.next, at: meta.at, depth: 1, target };
      draw(replace);
      if (target > 1) readOpen();
    } });
  }
  function watch(resource, render, missing) {
    let first = true;
    const query = project ? { project } : null;
    const subscribe = resource === 'home' ? cb => window.LiveHeader.watch(query, cb) : cb => window.Live.watch(resource, query, cb);
    subscribe({ phase(s) { if (s.data == null) readers[resource].forEach(r => r.set(s)); }, data(d, meta) {
      viewer = meta.viewer?.kind || 'public';
      if (resource === 'home' && d?.needs && !Object.hasOwn(d.needs, 'items') && !openStarted) { openStarted = true; watchOpen(render); }
      const draw = () => d?.q === 'warming' ? missing('正在准备') : d ? render(d, meta) : missing(U.collectionText()); if (first) draw(); else U.anchor(draw); if (d) { readers[resource].forEach(r => r.done()); first = false; if (!initialReads.has(resource)) { initialReads.add(resource); if (initialReads.size === 3) requestAnimationFrame(() => requestAnimationFrame(() => balanceBoard(true))); } } L.lightUp([$('hero'), $('groups'), $('closed'), $('reports'), $('notices')]); }, link(s) {
      states.set(resource, s); if (resource === 'home') bar?.set(s);
      if (resource === 'home' && s.data && s.now && s.now !== at) render(s.data, { ...s.meta, now: s.now });
      const offline = [...states.values()].find(x => x.offline); L.offline(!!offline); U.list($('notices'), offline ? [{ key: 'link', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${U.fieldHtml(offline.text, { kind: viewer })}</span>` }] : []);
      if (s.data == null && s.phase === 'none') { readers[resource].forEach(r => r.set(s)); missing(U.collectionText()); }
      U.blockNote(resource === 'home' ? $('hero').querySelector('.card__body') : $(resource === 'items/closed' ? 'closed' : 'reports'), s);
    } });
  }
  const missingHome = text => { U.html($('stats'), ''); U.html($('note'), U.fieldHtml(text, { kind: viewer })); L.tone($('hero'), 'off'); for (const key of Object.keys(KIND)) list(key, null, text); showOpenMore(); };
  watch('home', (d, meta) => {
    viewer = meta.viewer?.kind || 'public';
    document.body.dataset.viewer = viewer;   // 本人版标题不收行
    pageTitle(); for (const [kind, c] of cards) c.sub.textContent = hintText(kind);
    at = meta.now || meta.at;
    const needs = d.needs; if (d.q === 'warming' || needs?.q === 'warming') { missingHome('正在准备'); return; } if (!needs) { missingHome(U.collectionText()); return; }
    const embedded = Object.hasOwn(needs, 'items'), page = !embedded && openRows?.kind === viewer ? openRows : null;
    const rows = embedded ? needs.items : page?.items;
    const partial = embedded ? needs.q === 'partial' : page?.cursor != null || page?.incomplete;
    openTrend = needs.open_trend7; renderSide();
    pendingItems = new Set((rows || []).map(it => it.id)); if (reportsData) renderReports(reportsData);
    if (!project && meta.viewer?.kind === 'owner' && rows && !partial) U.pruneReceipts(rows);
    let counts = needs.counts;
    if (page?.items) {
      counts = page.counts;
      if (!counts) {
        counts = Object.fromEntries(Object.keys(KIND).map(key => {
          const count = rows.filter(it => it.kind === key).length;
          return [key, partial && !count ? null : count];
        }));
        if (partial) counts.q = 'partial';
      }
    }
    const lower = key => counts?.q === 'partial' && (!Array.isArray(counts.partial) || counts.partial.includes(key));
    const waiting = (counts?.choose ?? 0) + (counts?.do ?? 0), waitingLower = ['choose', 'do'].some(lower);
    const total = waitingLower ? waiting || null : counts?.choose != null && counts?.do != null ? waiting : null;
    const head = `等${viewer === 'public' ? '本人' : '你'} ${total == null ? U.collectionText() : `${waitingLower ? '至少 ' : ''}${total} 件`}`;
    U.html($('head'), U.status({ ...needs, level: needs.header_level ?? needs.level }).lamp + U.head(head?.replace(/(等你|等本人)\s*·\s*(\d+\s*件)/, '$1 $2'), { lamp: false }));
    const waits = (rows || []).filter(it => ['choose', 'do'].includes(it.kind)).map(waitingMs).filter(Number.isFinite);
    const phone = needs.phone;
    const status = U.status({ ...needs, level: needs.header_level ?? needs.level });
    const listCutoff = page?.items && page.at && Date.parse(page.at) !== Date.parse(sourceAt(needs)) && `名单和统计截至 ${U.date(page.at)} ${U.time(page.at)}`;
    const notes = [listCutoff, waits.length ? `最久一件已等 ${duration(Math.max(...waits))}` : '', phone && U.fieldHtml(phone, { kind: viewer }), ...new Set([needs, counts].filter(x => x?.q === 'partial' && x.gap).map(x => U.fieldHtml(x.gap, { kind: viewer }))), status.note];
    const headerNotes = ` · ${normalizeNote(notes.filter(Boolean).join(' · '))} · `;
    const headerAt = sourceAt(needs) ?? sourceAt(d), groups = new Map(), shared = new Map();
    for (const it of rows || []) {
      const read = Object.hasOwn(KIND, it.kind) && staleReading(it);
      if (!read) continue;
      if (!groups.has(read.key)) groups.set(read.key, []);
      groups.get(read.key).push({ it, ...read });
    }
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      const [{ stamp, time, note }] = group;
      const sameNote = headerNotes.includes(` · ${normalizeNote(note)} · `);
      const sameTime = headerAt == null ? embedded || page?.at === meta.at : Date.parse(headerAt) === stamp;
      for (const read of group) shared.set(read.it, read.note);
      if (sameNote && sameTime && !partial && group.length === rows.length) continue;
      const day = U.date(stamp), when = [time && day === U.date(at) ? '' : day, time].filter(Boolean).join(' ');
      const statedTime = normalizeNote(note).replace(stalePrefix, '').replace(/。$/, '');
      const extra = sameNote || statedTime === when || statedTime === time ? '' : `（${note}）`;
      notes.push(`${partial ? '已读的事项中，' : '其中 '}${group.length} 件沿用 ${when} 的记录${extra}`);
    }
    U.html($('note'), notes.filter(Boolean).join(' · ').replace(/ {2,}/g, ' '));
    U.html($('stats'), Object.entries(KIND).map(([key, label]) => {
      const value = counts?.[key], bounded = lower(key);
      const shown = value == null || bounded && value === 0 ? '—' : `${bounded ? '至少 ' : ''}${esc(value)}`;
      const pressed = $('kind-pick').value === key && $('state-pick').value !== 'closed';
      return `<button class="lbp-stat" type="button" data-kind="${key}" aria-controls="groups" aria-pressed="${pressed}">${window.LiveBoard.icon('check')}<b>${shown}</b><small>${viewer === 'owner' ? label : label.replaceAll('你', '本人')}</small></button>`;
    }).join(''));
    L.tone($('hero'), { ...needs, level: needs.header_level ?? needs.level });
    for (const key of Object.keys(KIND)) {
      const empty = rows == null ? U.collectionText() : partial ? '事项名单尚未读全' : `没有${viewer === 'public' ? KIND[key].replaceAll('你', '本人') : KIND[key]}的事`;
      list(key, rows?.filter(it => it.kind === key).sort(itemOrder), empty, it => row(it, false, shared.get(it)), !meta.firstOpen, partial);
    }
    showOpenMore(); renderSelection();
  }, missingHome);
  let closedItems = [], next = null;
  function redrawClosed() {
    const shown = collections.get('closed');
    if (shown) list('closed', shown.items, shown.empty, shown.renderer, true, shown.partial);
  }
  // 已关掉的事：后台标题带“当时记录：”，去掉直接说是什么事；本人版同一句关过几次的并成一条，写关过几次（本人 11-23 11:54）
  const unprefix = v => typeof v === 'string' ? v.replace(/^当时记录[：:]\s*/, '') : v && typeof v === 'object' ? { ...v, ...Object.fromEntries(['value', 'text'].filter(k => typeof v[k] === 'string').map(k => [k, v[k].replace(/^当时记录[：:]\s*/, '')])) } : v;
  function closedRows(items) {
    const seen = new Map();
    for (const raw of items) {
      // 访客版也并：看得到的同一句并成一条；仅本人可见的各算各的，件数照旧
      const it = { ...raw, text: unprefix(raw.text), title: unprefix(raw.title) }, shown = U.fieldText(it.text ?? it.title, viewer) || '';
      const hiddenRow = viewer !== 'owner' && (it.visibility === 'owner' || it.public === 'owner' || it.text?.visibility === 'owner' || /仅本人可见/.test(shown));
      const key = hiddenRow || !shown ? it.id : it.kind + '|' + shown.replace(/\s+/g, '').replace(/[。.]$/, '');
      if (seen.has(key)) seen.get(key).repeats++; else seen.set(key, { ...it, repeats: 1 });
    }
    return [...seen.values()];
  }
  function renderClosed(d, append = false) {
    closedItems = append ? [...new Map([...closedItems, ...d.items].map(it => [it.id, it])).values()] : d.items || [];
    next = d.next;
    const partial = next != null;
    const empty = d.items == null ? U.collectionText() : partial ? '已读范围还没有这类事项' : '近 7 天没有下去的事';
    const shown = d.items == null ? null : closedRows(withLanded('closed', closedItems));
    list('closed', shown, empty, it => row(it, true), true, partial);
    recentClosed = shown;
    if (reportsData) renderReports(reportsData);
    renderSide();
    $('closed-next').hidden = !next;
    U.html($('closed-next'), '再往前读 ›');
  }
  // 先摆上的那几件变了（办成、换成后台那条、到点不摆）时重画退出列表；退出列表还没读到时不先画
  function drawClosed() { if (collections.get('closed')?.items != null) renderClosed({ items: closedItems, next }); }
  watch('items/closed', d => renderClosed(d), text => { list('closed', null, text); recentClosed = null; renderSide(); $('closed-next').hidden = true; });
  $('closed-next').addEventListener('click', async (event) => {
    const button = event.currentTarget, cursor = next, kind = viewer;
    if (cursor == null) return;
    button.disabled = true; U.html(button, '正在读…', false);
    try {
      const r = await window.Live.get('items/closed', { project, cursor });
      if (viewer !== kind || next !== cursor) return;
      // 续页的采集时刻可能晚于首屏，同一受众的事项按编号合并。
      if (r.viewer?.kind === kind && Array.isArray(r.data?.items) && r.meta.status >= 200 && r.meta.status < 400) {
        U.anchor(() => renderClosed(r.data, true));
      } else {
        U.html(button, r.warming ? '正在读' : '这一批没读到，重试 ›');
      }
    } finally {
      button.disabled = false;
      if (button.textContent === '正在读…') U.html(button, '再往前读 ›', false);
    }
  });
  // M662：“近 7 天下去的”里已经记着关掉的汇报，上面“等你答的汇报”不再挂着（两处、两版同一个结果）。
  // 同一份汇报关掉后又重新弹出（编号不变，M567）时，按弹出时刻比：关掉的时刻不早于这次弹出，才算已经关了。
  const closedAt = () => new Map(closedItems.map(it => [it.id, Date.parse(it.closed?.at) || 0]));
  const closedSince = (gone, id, opened) => gone.has(id) && gone.get(id) >= (Date.parse(opened) || 0);
  // M663：访客版也摆“关掉”，点了弹全站共用的可信设备说明框（M803）。
  const reportActions = it => viewer === 'owner' || (it.actions || []).some(a => a.intent === 'close_report') ? it : { ...it, actions: [...(it.actions || []), { kind: 'direct', intent: 'close_report', label: '关掉' }] };
  function renderReports(d) {
    reportsData = d;
    const gone = closedAt();
    const rows = d.items?.filter(it => !hiddenByWrite(it) && !U.justSaved(it) && (!query || matchesQuery(it)) && !closedSince(gone, it.id, it.opened) && !closedSince(gone, it.owner_item || it.item_id || it.item, it.opened) && !pendingItems.has(it.owner_item || it.item_id || it.item || it.id) && !(it.actions || []).some(a => a.href && pendingItems.has(new URL(a.href, location.origin).searchParams.get('id')))).map(reportActions);
    const drawn = rows?.length ? rows.map(it => ({ key: it.id, cls: 'row row--flat lb-item', html: `${['green', 'ok'].includes(it.light) ? '' : U.status({ ...it, level: it.light }, { small: true }).lamp}<div class="row__text"><p class="row__main"><span class="row__title">${U.fieldHtml(it.text && typeof it.text === 'object' ? { ...it, ...it.text } : it, { name: '待答汇报', place: 'title', kind: viewer })}</span></p><p class="row__sub">${[it.unanswered != null ? `${sp(it.unanswered)} 题没答` : !U.offline?.() && U.collectionText(), it.opened && `${U.date(it.opened)} ${U.time(it.opened)} 弹出`].filter(Boolean).join(' · ')}</p></div><div class="row__acts">${actions(it)}${checkbox(it)}</div>` })) : wait(d.items == null ? U.collectionText() : d.items.length ? '汇报里的待答问题已列在前面的事里' : '没有两小时没答的汇报');
    reportCount = rows == null ? null : rows.length; filterBoard();
    U.html(cards.get('reports').title, `${viewer === 'owner' ? '等你答的汇报' : '等本人答的汇报'}<span class="lb-count">（${reportCount ?? '—'} 件）</span>`);
    const shown = drawn.length;   // 两版同一套（本人禁令 11-24 14:16）：两版都列全
    U.list($('reports-rest'), drawn.slice(shown)); $('reports-more').hidden = drawn.length <= shown; U.html($('reports-more'), `展开（还有 ${Math.max(0, drawn.length - shown)} 条） ›`); U.list($('reports-list'), drawn.slice(0, shown)); renderSelection();
  }
  watch('reports', renderReports, text => { reportCount = null; filterBoard(); U.html(cards.get('reports').title, viewer === 'owner' ? '等你答的汇报' : '等本人答的汇报'); U.list($('reports-list'), wait(text)); U.list($('reports-rest'), []); $('reports-more').hidden = true; });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

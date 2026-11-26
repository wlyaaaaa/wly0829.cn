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
    return viewer === 'owner' && entry && entry.version === item.item_version;
  };
  // 办成后马上跟上（M903）：后台从登记到写成要几秒，办成那一刻重读的退出列表和清单可能还是旧的。
  // 回执已确认写成的，先照办成的结果摆上：“我知道了”“不办了”“关掉汇报”放进“近 7 天下去的”，“晚点提醒”放进“你放着”；
  // 后台读数里出现这件（退出记录里有这一次，或清单里换成了新版本）就换成后台那条，旧读数不把它盖回去。
  // 这期间照办理回查的节奏接着重读（前一分钟每 3 秒，之后每 15 秒），最多两分半，到点照后台读数。
  const landed = new Map(), writeStarted = new Map();
  const LANDED_KIND = { ack: 'acknowledged', decline: 'declined' };
  function landItem(item, intent, receipt) {
    // 本人 11-26 00:13：先摆上的那条只写后台回执里有的，不拿浏览器的钟算。下去的时刻用回执的 created_at（后台收下这一笔的时刻）；
    // 晚点提醒几点再提醒用回执的 until，回执没给就写“提醒时间还没确认”，等清单读回来换成后台那条
    const at = receipt?.created_at || null, base = { since: Date.parse(at) || (writeStarted.get(item.id) ?? Date.now()), saved: Date.now(), version: item.item_version };
    // 先摆上的“你放着”和后台那条一个样子：只留问情况、不办了和网站链接，不再挂“晚点提醒”
    if (intent === 'later') landed.set(item.id, { ...base, key: 'later', row: { ...item, kind: 'later', act_from: receipt?.until || null, due: null, now: null, actions: (item.actions || []).filter(a => a.intent === 'ask' || a.intent === 'decline' || a.href), _landed: true } });
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
    if (landed.size !== before) { redrawItems(); drawClosed(); if (lastHome) renderHome(...lastHome); }
    if (!landed.size) return;
    const first = Math.min(...[...landed.values()].map(w => w.saved));
    landedTimer = setTimeout(() => window.Live.refresh().finally(followLanded), now - first < 60000 ? 3000 : 15000);
  }
  $('item-action-receipts').addEventListener('item-write', ({ detail: { items, saved, intent, at, receipts } }) => {
    for (const item of items) {
      if (saved === null) writeStarted.set(item.id, at ?? Date.now());   // 回到页面接着查的（M945）按当初点的时刻算
      // 本人 11-26 00:13：页面上显示的结果必须是后台真回的。后台还没回之前这件照旧摆在原处（按钮写“正在办…”，回执写“正在保存…”），回了“已写成”才撤下；没写上、没回结果的留在原处
      if (saved?.includes(item.id)) hiddenWhileWriting.set(item.id, { version: item.item_version });
      else if (saved) hiddenWhileWriting.delete(item.id);
      if (saved?.includes(item.id) && viewer === 'owner') landItem(item, intent, receipts?.[item.id]);
    }
    // 旧滚动锚点可能正是要撤下的那行，不能再用它锁位置。
    U.anchor.stop();
    redrawItems();
    // 页头总数和四个数跟着撤下、挪走的卡一起变（M981、M903），不等清单统计重读
    if (saved && lastHome) renderHome(...lastHome);
    if (reportsData) renderReports(reportsData);
    if (saved?.length) { drawClosed(); followLanded(); }
  });
  // 还没确认的那几次（M945，主持 11-26 01:24）：读回来的退出记录里有这件、时刻不早于点的时候（留两分钟钟差），或晚点提醒的这件换了新版本到了“你放着”，就是办成了
  const foundWrite = (item, intent, since) => intent === 'later'
    ? collections.get('later')?.items?.find(it => it.id === item.id && !it._landed && it.item_version !== item.item_version)
    : closedItems.find(it => it.id === (intent === 'close_report' ? item.owner_item || item.item_id || item.item || item.id : item.id) && Date.parse(it.closed?.at) >= since - 120000);
  function redrawItems() { for (const [key, c] of collections) list(key, c.items, c.empty, c.renderer, true, c.partial); balanceBoard(true); }
  $('due-sort').addEventListener('change', redrawItems);
  function dueOrder(items) {
    if ($('due-sort').value !== 'due') return items;
    const when = it => { const t = Date.parse(it.due || it.act_from); return Number.isFinite(t) ? t : Infinity; };
    return [...items].sort((a, b) => when(a) - when(b));
  }
  const labels = { ...KIND, reports: '等你答的汇报', closed: '近 7 天下去的' };
  // know 怎么下去、later 什么时候转。按需更新快核（M928）核法：E:/.agents/skills/cockpit/SKILL.md 四种卡的表“要你知道”“你放着”两行，现“点我知道了就关，不按天数自己消失”“有日期的到点转成要你做（要拍板的转成要你选），只写日期按当天上午 10 点；没日期的一直放着”；变了改这句
  const hints = { choose: '需要你选择、确认或提供结论的事项。', do: '需要你确认、操作或提供信息的事项。', later: '到日子转成要你做或选（默认上午 10 点），没日期的一直放着。', know: '只需了解的进展与通知；点“我知道了”就下去，不按天数消失。', closed: '已经从等你的清单下去的事项。', reports: '还有问题等你答的汇报。' };
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
    // 它本身很长（如 900 宽时有几十条）、放进短栏后比两栏原来的差还多出一大截（一栏排到底、另一栏空一大片）时，改放到两栏下面占整宽，行分两列排
    const total = heights.reduce((sum, h) => sum + h, 0), left = heights.reduce((sum, h, i) => sum + (best & (1 << i) ? h : 0), 0);
    const gap = Math.abs(total - 2 * left), column = left * 2 <= total ? '1' : '2';
    closed.dataset.itemsCol = ''; closed.toggleAttribute('data-wide', false); closed.style.setProperty('--items-column', column);
    const own = closed.hidden ? 0 : closed.getBoundingClientRect().height + 22;
    // 只在窄窗（窗口不到 1200 宽）这样挪；1440 这类宽窗照原来接短栏（主控只指了 900，r83 返修第二轮）
    const wide = !!picked || !shown.length || innerWidth < 1200 && Math.abs(own - gap) > gap + 400;
    closed.toggleAttribute('data-wide', wide);
    closed.style.setProperty('--items-column', wide ? '1 / -1' : column);
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
    // M946：后台每天数的是那天结束时清单上还挂着的全部事项，四类都算（你放着、要你知道也在里面），不只是要你做、要你选；不叫“未办／待办”，免得和页头“等你 N 件”对不上
    const also = viewer === 'public' ? '含本人放着、要本人知道' : '含你放着、要你知道';
    return `<p class="trend-last">全站 · 最后一天清单上共 <b>${last?.open == null ? '—' : esc(last.open)}</b> 件<span style="white-space: nowrap">（${also}）</span></p><svg class="needs-trend" viewBox="0 0 300 118" role="img" aria-label="近 7 天每天清单上共几件（${also}），缺数的日期留空">${scale}<path class="needs-trend__line" d="${path.trim()}"/>${days.map((d,i) => `${d.open == null ? '' : `<circle cx="${x(i)}" cy="${y(d.open)}" r="3"/>`}<text x="${x(i)}" y="108" text-anchor="middle"><title>${esc(d.open == null ? d.gap || '这天没读到' : `清单上共 ${d.open} 件`)}</title>${esc(d.date.slice(5))}</text>`).join('')}</svg>`;
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
  // 多选按类选办法：类的顺序照页面上的组；办法的顺序照卡上的按钮
  const PLAN_ORDER = ['ack', 'later', 'decline', 'close_report'], PLAN_KINDS = ['do', 'choose', 'later', 'know', 'reports'], PLAN_LABEL = { ...KIND, reports: '汇报' };
  const planPicks = new Map();   // 勾上的哪一件 → 选中的办法
  let planAvailable = new Map(), planWriting = false;
  // 这一行的这颗按钮是哪种办法（不办了、晚点提醒、我知道了、关掉）；问情况、去办这类不算
  const planIntent = (item, action) => { const key = pickIntent(item, action), intent = key === 'decline_copy' ? 'decline' : key; return PLAN_ORDER.includes(intent) ? intent : ''; };
  const rowIntents = item => PLAN_ORDER.filter(intent => item.actions.some(action => planIntent(item, action) === intent));
  const planKind = item => rowIntents(item).includes('close_report') ? 'reports' : item.kind;
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
    // M972：清单一时没读到（后台正在准备、读不到时整块换成一句话）时，勾上的不丢，栏也不收，读回来照样勾着；读回来了还找不到（办掉了、被筛掉了）才去掉
    const unread = Object.keys(KIND).some(key => collections.has(key) && collections.get(key).items == null) || reportCount === null && !!reportsData;
    for (const id of selected) if (!available.has(id)) { if (unread && selectable.has(id)) available.set(id, selectable.get(id)); else selected.delete(id); }
    // 多选（本人 11-26 03:0x：“每个选项，先勾选，勾选以后可以点按钮，下面的框依然是确认和取消；核对框最终看一下……√了，选这一条，点旁边的按钮，有个选中效果”）：
    // 勾上的那一行，点这一行自己的办法按钮（不办了、晚点提醒、我知道了、关掉）不马上办，只出选中效果（绿字绿边），再点同一行别的办法就换成那个；取消勾选就清掉这行的选择。
    // 没点按钮的行算没选办法。没勾的行按钮照常用。底部栏只有“已选 N 件 · 确认 · 取消”；点“确认”弹核对框，一件一行写这件怎么办，
    // 勾了没选办法的写“没选办法，这次不动”，再确认一次把选了办法的一起办。两版同一套，访客照样能勾、能选，点“确认”照旧弹可信设备说明框。
    // 勾上只是勾上：点了这一行的按钮才算选中（本人原话两步：先勾，再点按钮），只有一种办法的行也一样，不自动选
    for (const id of selected) if (!rowIntents(available.get(id)).includes(planPicks.get(id))) planPicks.delete(id);
    for (const id of [...planPicks.keys()]) if (!selected.has(id)) planPicks.delete(id);
    planAvailable = available;
    const open = selected.size > 0;
    selection.classList.toggle('is-open', open); selection.inert = !open; selection.setAttribute('aria-hidden', String(!open));
    U.html($('item-selection-count'), '已选<b>' + selected.size + '</b>件');
    markPicks();
    const picked = [...selected].filter(id => planPicks.has(id)).length;
    const signature = JSON.stringify([picked, planWriting]);
    if (selectionActions.dataset.signature === signature) return;
    selectionActions.dataset.signature = signature;
    U.html(selectionActions, '<button class="btn btn--sm items-plan__go" type="button" data-plan-go aria-haspopup="dialog"' + (picked ? '' : ' title="勾上的几行还没点办法"')
      + (!picked || planWriting ? ' disabled' : '') + '>' + (planWriting ? '正在办…' : '确认') + '</button>');
  }
  // 勾上的行里，选中的那颗办法按钮标成按下（绿字绿边）；行重画以后跟着 renderSelection 再标一遍
  function markPicks() {
    for (const btn of document.querySelectorAll('button[data-action-set][data-act]')) {
      const id = btn.dataset.item, hit = selected.has(id) && planPicks.has(id) && U.actionAt?.(btn);
      if (hit?.action && planIntent(hit.item, hit.action) === planPicks.get(id)) btn.setAttribute('aria-pressed', 'true'); else btn.removeAttribute('aria-pressed');
    }
  }
  // 勾上的那一行，点办法按钮只是选中，不弹框、不办；问情况、去办这类照常。比全站那个按钮监听先一步接住
  document.addEventListener('click', event => {
    const btn = event.target.closest?.('button[data-action-set][data-act]');
    if (!btn || !selected.has(btn.dataset.item)) return;
    const hit = U.actionAt?.(btn), intent = hit?.action && planIntent(hit.item, hit.action);
    if (!intent) return;
    event.preventDefault(); event.stopPropagation();
    planPicks.set(btn.dataset.item, intent); renderSelection();
  }, true);
  // 多选核对框（本人 11-26 02:12、03:0x：“核对框最终看一下”）。放在本页自己的代码里，不动全站共用的确认框（本人 03:19：共用特别容易改旧出新）。
  // 一件一行“类 · 这件 → 办法”，勾了没选办法的写“没选办法，这次不动”；框底一句去向，“返回改”“确认，办这 N 件”（N 只数选了办法的）。
  // 确认后按办法分批交给全站共用的写回（U.saveItems，每件各发一笔，照常弹回执）：后台真回了才写办成、卡才下去；没回写还没确认；没办成照实说、卡留着能再点（本人 11-26 00:13）。
  const PLAN_TO = { ack: '我知道了', later: '晚点提醒（挪到“你放着”）', decline: '不办了', decline_copy: '不办了（有后续，复制给 AI）', close_report: '关掉' };
  function confirmPlan(trigger, all, { start, done, complete }) {
    const live = window.Live, plan = all.filter(p => p.intent);
    const notice = (state, head, name = '') => window.SiteNotice(head, '', 'item-action-receipts').set(state, head, { name });
    if (!plan.length || plan.some(p => U.itemWriting(p.item.id)) || document.querySelector('.live-item-confirm[open]')) return;
    if (!live?.canOwnerAct?.()) { if (viewer !== 'owner') window.TrustModal?.show(); else notice('fail', '不是可信设备'); return; }
    const intentOf = p => p.intent === 'decline' && p.item.decline_followup ? 'decline_copy' : p.intent;
    if (plan.some(p => { const action = U.itemWriteAction(intentOf(p)); return action && (!p.item.item_version || !p.item.owner_actions?.includes(action)); })) {
      notice('fail', '这件事刚刚有变化，请重读后再试。'); return;
    }
    const used = new Set(plan.map(intentOf)), off = ['ack', 'decline'].filter(intent => used.has(intent)).map(intent => U.itemLabels[intent]);
    const note = [off.length && off.join('、') + '的从“等你的事”撤下', used.has('later') && '晚点提醒的挪到“你放着”', used.has('close_report') && '关掉的汇报从“等你答的汇报”撤下',
      used.has('decline_copy') && '有后续的不办了复制成一段话，贴给 AI 处理后续'].filter(Boolean).join('；') + '。';
    const dialog = document.createElement('dialog');
    dialog.className = 'live-item-confirm live-item-confirm--plan';
    dialog.setAttribute('aria-labelledby', 'live-item-confirm-title');
    dialog.setAttribute('aria-describedby', 'live-item-confirm-name live-item-confirm-note');
    dialog.innerHTML = `<div class="live-item-confirm__card">
      <button type="button" data-cancel class="live-item-confirm__x" aria-label="关闭核对框">×</button>
      <h2 id="live-item-confirm-title">核对一下，办这 ${plan.length} 件？</h2>
      <ul id="live-item-confirm-name" class="item-plan">${all.map(p => `<li><span class="item-plan__kind" data-kind="${esc(p.kind)}">${esc(p.label)}</span><span class="item-plan__name">${esc(U.fieldText(p.item.text || p.item.title, 'owner'))}</span>${p.intent ? `<span class="item-plan__to">→ <b>${esc(PLAN_TO[intentOf(p)])}</b></span>` : '<span class="item-plan__to is-skip">→ 没选办法，这次不动</span>'}</li>`).join('')}</ul>
      <div class="item-plan__foot"><p id="live-item-confirm-note">${esc(note)}</p>
      <div class="live-item-confirm__buttons"><button type="button" data-cancel autofocus>返回改</button><button type="button" data-apply>确认，办这 ${plan.length} 件</button></div></div></div>`;
    const viewport = window.visualViewport;
    const size = () => {
      if (!viewport) return;
      const zoom = Math.max(1, 1 / viewport.scale);
      dialog.style.setProperty('--item-confirm-zoom', zoom);
      dialog.style.setProperty('--item-confirm-width', `${viewport.width / zoom}px`);
    };
    dialog.addEventListener('click', event => { if (event.target === dialog || event.target.closest('[data-cancel]')) dialog.close(); });
    dialog.addEventListener('close', () => { viewport?.removeEventListener('resize', size); dialog.remove(); trigger.focus({ preventScroll: true }); }, { once: true });
    dialog.querySelector('[data-apply]').addEventListener('click', async () => {
      dialog.close();
      start();
      try {
        // 有后续的先复制（要趁这次点按），再按办法分批写回
        const follow = plan.filter(p => intentOf(p) === 'decline_copy').map(p => p.item);
        if (follow.length) {
          const ok = await U.copy(follow.map(item => live.copy(item, 'decline')).join('\n\n'));
          notice(ok ? 'ok' : 'fail', ok ? '已复制，粘贴到 AI 对话发送' : '没复制成，请再点一次', ok ? `有后续的 ${follow.length} 件：AI 办完后续再关卡。` : '');
          if (ok) complete(follow.map(item => item.id));
        }
        const byIntent = new Map();
        for (const p of plan) if (intentOf(p) !== 'decline_copy') byIntent.set(intentOf(p), [...(byIntent.get(intentOf(p)) || []), p.item]);
        await Promise.all([...byIntent].map(([intent, rows]) => U.saveItems(rows, intent, { complete })));
      } finally { done(); }
    }, { once: true });
    size();
    viewport?.addEventListener('resize', size);
    document.body.append(dialog);
    dialog.showModal();
    dialog.querySelector('[autofocus]').focus({ preventScroll: true });
  }
  // 点“确认”弹核对框（confirmPlan）；办成的从勾选里去掉，没办成、没回结果的和没选办法的照旧勾着、选的办法也留着，能再点
  selectionActions.addEventListener('click', event => {
    const go = event.target.closest('[data-plan-go]');
    if (!go || go.disabled) return;
    const order = item => PLAN_KINDS.indexOf(planKind(item));
    const plan = [...selected].map(id => planAvailable.get(id)).filter(Boolean).sort((a, b) => order(a) - order(b))
      .map(item => ({ item, intent: planPicks.get(item.id) || '', kind: planKind(item), label: PLAN_LABEL[planKind(item)] || '其他' }));
    confirmPlan(go, plan, {
      start() { planWriting = true; renderSelection(); },
      done() { planWriting = false; renderSelection(); },
      complete(ids) { ids.forEach(id => selected.delete(id)); redrawItems(); if (reportsData) renderReports(reportsData); renderSelection(); },
    });
  });
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
  // M947：每月循环的提醒（后台给整数 monthly_day），在写日期的那一格写“每月 6 日”；这一期从哪天起照旧按 act_from 排
  const monthlyDay = it => Number.isInteger(it.monthly_day) && it.monthly_day >= 1 && it.monthly_day <= 31 ? `每月 ${it.monthly_day} 日` : '';
  function row(it, closed = false, shared = '') {
    function brief(html) {
    return html;   // 两版同一套（本人禁令 11-24 14:16）：两版都给全文，访客版不再先收成一句
    }
    const flags = it.text && typeof it.text === 'object' ? it.text : it, hidden = viewer === 'public' && (it.visibility === 'owner' || it.public === 'owner' || flags.visibility === 'owner' || flags.public === 'owner');
    const placeholder = hidden || viewer === 'public' && (flags.hidden || flags.rewrite === 'pending' && !flags.text && !flags.value);
    const mark = placeholder ? U.fieldHtml(hidden ? { visibility: 'owner' } : flags, { name: '这件事的内容', kind: viewer }) : viewer === 'owner' && (it.visibility === 'owner' || it.public === 'owner' || U.visitorFieldKind(it, ['$', 'text', 'title'])) || U.visitorFieldKind(it, ['$', 'text', 'title']) === 'rewritten' ? U.visitorHiddenMark(it, '这件事', viewer, { keys: ['$', 'text', 'title'], rewrittenWhat: '这件事的说法' }) : U.visibilityNote(it, viewer, '这件事的内容'), deadline = monthlyDay(it) || (it.act_from ? `${U.date(it.act_from)} 起该办了` : it._landed && it.kind === 'later' ? '提醒时间还没确认' : it.due ? `${U.date(it.due)} 前${it.kind === 'choose' ? '要选' : '要办'}` : '');
    let closing = it.closed?.text && (typeof it.closed.text === 'object' ? it.closed.text : viewer === 'public' ? it.closed.text.replace(/^你(?=办完了|说不办了)/, '本人') : it.closed.text);
    if (typeof closing === 'string' && it.closed?.kind === 'expired') closing = closing.replace(expiredText, '展示期已到');
    const mobile = it.mobile && typeof it.mobile === 'object' ? it.mobile : ({ phone: '手机能办', computer: '要在电脑上办', in_person: '要本人到场' })[it.mobile];
    const sub = closed ? [...(sameStart(closing, closedText(it)) || it.closed?.kind === 'expired' && expiredText.test(sp(closing)) ? [closing] : [closedText(it), closing]), it._landed && !it.closed?.at ? '时刻还没确认' : U.date(it.closed?.at), it.repeats > 1 && `同一件事关过 ${it.repeats} 次`] : [U.capText(it.now, 60, true), it.kind !== 'know' && mobile, it.kind !== 'know' && it.minutes != null ? `约 ${sp(it.minutes)} 分钟` : '', itemAge(it) || (it.kind === 'know' ? U.ago(it.episode_at || it.born, states.get('home')?.now || at) : waited(it)), deadline, U.originName(it.origin, it) && U.capText(U.originName(it.origin, it), Infinity, true)];
    if (closed && KIND[it.kind]) sub.unshift(viewer === 'public' ? KIND[it.kind].replaceAll('你', '本人') : KIND[it.kind]);
    // 标题和来源整句显示，放不下就换行，不按字数截成“…”（M760，同 M690：字数上限是给写的人的，不是显示时省略）
    const titleText = U.fieldHtml(hidden ? { visibility: 'owner' } : U.capText(flags, Infinity, true), { name: closed ? '已关闭事项' : '待办事项', place: 'title', kind: viewer });
    // 占位行的标题已写清“〈哪一样〉仅本人可见”时，旁边不再重复同一句。
    const markSaid = mark.replace(/<[^>]*>|🔒/g, '').trim(), shownMark = placeholder && markSaid === titleText.replace(/<[^>]*>/g, '').trim() ? '' : mark;
    const archivedTitle = titleText;   // 已关掉的不再加“当时记录：”，直接说是什么事（本人 11-23 11:54）
    const title = placeholder ? `<span class="row__title">${titleText}</span>` : closed ? `<a class="row__title" href="${esc(closedHref(it))}">${archivedTitle}</a>` : it.detail ? `<button class="row__title detail-toggle" type="button" data-detail="${esc(it.id)}">${titleText} <span class="more__chev">›</span></button>` : `<span class="row__title">${titleText}</span>`;
    const subtitle = sub.filter(s => s && !(/正在换说法|仅本人可见/.test(sp(s)) && sp(s) === itemText(it)) && !(hidden && /仅本人可见|可信设备可见/.test(sp(s))) && !(U.offline?.() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读/.test(sp(s)))).map((s, i, all) => `<span class="item-bit${s === deadline || /^(?:已等|约 |挂了 |\d\d-\d\d)/.test(sp(s)) ? ' item-keep' : ''}">${i < all.length - 1 ? U.fieldHtml(s, { kind: viewer }).replace(/。((?:<\/[a-z]+>)*)$/, '$1') : U.fieldHtml(s, { kind: viewer })}</span>`).join('');   // 后面还接“ · ”的一段，句尾“。”去掉，不写成“到了。 · 约 2 分钟”（r83 返修第三轮）
    // M225：卡片只报自己的记录时刻；整组采集时刻（stale_text/gap）已在页头说过，不再逐卡重复。
    const { lamp, note } = U.status({ ...it, source_at: itemRecordedAt(it), stale_text: null, gap: null, level: it.light }, { small: true });
    const detail = shared && (note === shared || note.startsWith(`${shared} · `)) ? note.slice(shared.length + 3) : note;
    return { key: it.id, cls: 'row row--flat lb-item', html: `${['green', 'ok'].includes(it.light) ? '' : lamp}<div class="row__text"><p class="row__main">${title}${shownMark ? `<span class="row__meta">${shownMark}</span>` : ''}<button type="button" class="more item-expand" data-text-toggle hidden aria-expanded="false">展开</button></p>${subtitle ? `<div class="row__sub">${brief(subtitle)}</div>` : ''}${detail ? `<p class="row__sub">${detail}</p>` : ''}${runSource(it)}${it.closed?.to ? `<a class="more" href="${esc(route('/live/item/?id=' + encodeURIComponent(it.closed.to)))}">看并入的事 ›</a>` : ''}</div><div class="row__acts">${actions(it)}${!closed ? checkbox(it) : ''}</div>` };
  }
  function list(key, items, empty, renderer = row, animate = true, partial = false) {
    collections.set(key, { items, empty, renderer, partial });
    if (viewer === 'owner' && (key === 'closed' || key === 'later')) U.settleItemWrites?.(foundWrite);
    const known = Array.isArray(items);
    const closedKind = key === 'closed' ? $('kind-pick').value : '';
    if (key !== 'closed' && key !== 'reports') items = withLanded(key, items);
    items = (items || []).filter(it => (key === 'closed' || it._landed || !hiddenByWrite(it) && !U.justSaved(it)) && (!query || matchesQuery(it)) && (!KIND[closedKind] || it.kind === closedKind));
    if (key !== 'closed' && key !== 'reports') {
      U.blockNote($(key), null);
      items = dueOrder(items);
    }
    // 新私事规则（本人 11-24 02:56）：访客版不再按条藏，组标题只数看得到的行，也不再写“另有 N 件仅本人可见”。
    // M973：“近 7 天下去的”数的是读回来多少件，同一句并成一行的（“同一件事关过 N 次”）按原来的件数算，不按摆了几行；两版读回来的一样多，件数就一样
    const pieces = key === 'closed' ? items.reduce((n, it) => n + (it.repeats || 1), 0) : items.length;
    const green = n => n > 0 ? '<b class="lb-count__n">' + n + '</b>' : n;   // 加绿（GREENIMG1126）：大于 0 的件数绿
    const count = partial ? key === 'closed' ? '已读 ' + green(pieces) + ' 件' : '已读部分' + (items.length ? ' · ' + green(items.length) + ' 件' : '') : (known ? green(pieces) : '—') + ' 件';
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
  // M981、M903：回执到了、卡已撤下（或挪进“你放着”）而清单统计还没跟上时，页头“等你 N 件”和四个数照页面上实际摆着的算；
  // 后台读数跟上以后（这件不在清单里了、或换成新版本）就照后台的数，不再另减另加
  function movedCounts(rows) {
    const moved = Object.fromEntries(Object.keys(KIND).map(key => [key, 0]));
    for (const it of rows || []) if (Object.hasOwn(moved, it.kind) && (hiddenByWrite(it) || U.justSaved(it))) moved[it.kind]--;
    for (const [id, w] of landed) if (w.key === 'later' && !(rows || []).some(it => it.id === id && it.item_version !== w.version)) moved.later++;
    return moved;
  }
  let lastHome = null;
  watch('home', renderHome, missingHome);
  function renderHome(d, meta) {
    lastHome = [d, meta];
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
    const moved = movedCounts(rows);
    if (counts && Object.values(moved).some(Boolean)) counts = { ...counts, ...Object.fromEntries(Object.keys(KIND).filter(key => Number.isFinite(counts[key])).map(key => [key, Math.max(0, counts[key] + moved[key])])) };
    const lower = key =>counts?.q === 'partial' && (!Array.isArray(counts.partial) || counts.partial.includes(key));
    const waiting = (counts?.choose ?? 0) + (counts?.do ?? 0), waitingLower = ['choose', 'do'].some(lower);
    const total = waitingLower ? waiting || null : counts?.choose != null && counts?.do != null ? waiting : null;
    const head = `等${viewer === 'public' ? '本人' : '你'} ${total == null ? U.collectionText() : `${waitingLower ? '至少 ' : ''}${total} 件`}`;
    U.html($('head'), U.status({ ...needs, level: needs.header_level ?? needs.level }).lamp + U.head(head?.replace(/(等你|等本人)\s*·\s*(\d+\s*件)/, '$1 $2'), { lamp: false }));
    const waits = (rows || []).filter(it => ['choose', 'do'].includes(it.kind) && !hiddenByWrite(it) && !U.justSaved(it)).map(waitingMs).filter(Number.isFinite);
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
      return `<button class="lbp-stat" type="button" data-kind="${key}" aria-controls="groups" aria-pressed="${pressed}">${window.LiveBoard.icon('check')}<b${typeof value === 'number' && value > 0 ? ' class="is-some"' : ''}>${shown}</b><small>${viewer === 'owner' ? label : label.replaceAll('你', '本人')}</small></button>`;
    }).join(''));
    L.tone($('hero'), { ...needs, level: needs.header_level ?? needs.level });
    for (const key of Object.keys(KIND)) {
      const empty = rows == null ? U.collectionText() : partial ? '事项名单尚未读全' : `没有${viewer === 'public' ? KIND[key].replaceAll('你', '本人') : KIND[key]}的事`;
      list(key, rows?.filter(it => it.kind === key).sort(itemOrder), empty, it => row(it, false, shared.get(it)), !meta.firstOpen, partial);
    }
    showOpenMore(); renderSelection();
  }
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
    requestAnimationFrame(() => balanceBoard(true));   // 条数变了，重新看放短栏还是两栏下面
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
    U.html(cards.get('reports').title, `${viewer === 'owner' ? '等你答的汇报' : '等本人答的汇报'}<span class="lb-count">（${reportCount > 0 ? `<b class="lb-count__n">${reportCount}</b>` : reportCount ?? '—'} 件）</span>`);
    const shown = drawn.length;   // 两版同一套（本人禁令 11-24 14:16）：两版都列全
    U.list($('reports-rest'), drawn.slice(shown)); $('reports-more').hidden = drawn.length <= shown; U.html($('reports-more'), `展开（还有 ${Math.max(0, drawn.length - shown)} 条） ›`); U.list($('reports-list'), drawn.slice(0, shown)); renderSelection();
  }
  watch('reports', renderReports, text => { reportCount = null; filterBoard(); U.html(cards.get('reports').title, viewer === 'owner' ? '等你答的汇报' : '等本人答的汇报'); U.list($('reports-list'), wait(text)); U.list($('reports-rest'), []); $('reports-more').hidden = true; });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

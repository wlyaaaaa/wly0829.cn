// 第二层：上半截总的情况和统计；下半截第一排“在干｜等你”并排（别的状态有对话才出来，补到矮的那栏），下面整行列近 72 小时已结束。
// 在干、等你每栏先 5 张；已结束的每组先露一整排；其余展开；点名字或“看完整对话”进入详情。
(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, $ = id => document.getElementById(id), { esc, sp } = U;
  const params = new URLSearchParams(location.search);
  const route = href => { const u = new URL(href, location.origin); if (u.origin !== location.origin) return href; if (params.has('fixture') && u.pathname.startsWith('/live/')) u.searchParams.set('fixture', params.get('fixture')); return u.pathname + u.search + u.hash; };
  const actions = it => {
    const list = [...(it.actions?.length ? it.actions : [{ kind: 'copy', label: '问情况', intent: 'ask' }])];
    if (it.open && !list.some(a => a.kind === 'open')) { const open = typeof it.open === 'string' ? { target: it.open } : it.open; list.push({ ...open, kind: 'open', label: '打开对话', ...(!open.guard && !open.target && !open.href ? { target: `chat:${it.id}` } : {}) }); }
    return U.actions(it, list.map(a => ({ ...a, ...(a.kind === 'open' ? { label: '打开对话' } : a.intent === 'ask' ? { label: '问情况' } : {}), ...(a.href ? { href: route(a.href) } : {}) })));
  };
  const { rowState, stepState, planInfo, helperTotal, workingHelpers, helperActivity: helperAt, contentLocked, contentLock, stageLabel, plain } = U.chatFields;
  const stateText = c => (U.offline?.() && ['running', 'waiting', 'queued', 'reconnecting'].includes(c.state) ? '断开前' : '') + rowState(c, viewer);
  const attention = c => ['waiting', 'failed', 'reconnecting'].includes(c.state);
  const lamp = payload => U.status(payload, { small: true }).lamp;
  const who = (c, place = 'body', bare = false) => [U.draw10?.modelHtml(c, { name: place === 'title' ? 'AI 帮手' : '型号', place, kind: viewer, bare }) ?? U.fieldHtml(c.model, { name: '型号', place, kind: viewer }), c.effort && U.fieldHtml(c.effort, { name: '型号', place, kind: viewer })].filter(Boolean).join(' · '), wait = text => [{ key: 'empty', cls: 'row row--flat row--empty', html: `<span></span><p class="row__sub">${U.fieldHtml(U.offline?.() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读|正在准备/.test(text) ? '这块没存下来，连上后补上。' : text, { name: 'AI 对话', place: 'body', kind: viewer })}</p>` }];
  // 下半截各栏：照对话数据里本来的状态分；在干、等你一直摆着，别的状态有对话才出来。
  const COLUMN = { running: { name: '在干', about: 'AI 正在往下做的对话', icon: 'play', tint: 'green', art: 'running' }, waiting: { name: '等你', about: '要你回答或选一下才能接着做', icon: 'chat', tint: 'peach', art: 'waiting' }, queued: { name: '等着', about: '排着队，还没开始', icon: 'clock', tint: 'blue', art: 'queued' }, reconnecting: { name: '在重连', about: '连接断了，正在重新接上', icon: 'wifi', tint: 'cyan' }, failed: { name: '坏了', about: '出错停下来的对话', icon: 'alert', tint: 'pink' }, stopped: { name: '叫停', about: '中途叫停的对话', icon: 'moon' }, unknown: { name: '状态不明', about: '读到了对话，状态还没读准', icon: 'gear' } };
  const board = window.LiveBoard.create($('chat-board'), { cols: 2 });
  const runningCard = board.card('running', { ...COLUMN.running, ids: { main: 'active-list' } });
  const waitingCard = board.card('waiting', COLUMN.waiting);
  const recentBoard = window.LiveBoard.create($('chat-recent-board'), { cols: 1 });
  waitingCard.el.hidden = true;
  const doneCard = recentBoard.card('done', { icon: 'check', tint: 'lilac', art: 'done', ids: { el: 'recent', title: 'recent-title', sub: 'recent-sub', main: 'recent-list', rest: 'recent-rest', more: 'recent-more', box: 'recent-box', next: 'recent-next' } });
  doneCard.el.querySelector('.lb-card__head').setAttribute('data-keep', ''); doneCard.el.insertAdjacentHTML('beforeend', '<p class="pj-note lb-card__note" id="recent-note"></p>');
  const recentTitle = '<b>近 72 小时已结束</b>';
  U.html($('recent-title'), recentTitle);
  // 卡里的帮手先露在做和出错的前 5 个，其余每点一次再放 5 个
  function helperButton(left, first) {
    if (first) return `看帮手记录（${left > 5 ? `先看 5 条，共 ${left} 条` : `${left} 条`}） ›`;
    return left > 5 ? `再看 5 条帮手记录（还有 ${left} 条） ›` : `再看 ${left} 条帮手记录 ›`;
  }
  // 一行放得下、也没截字的思考摘要，不摆“展开摘要”（点了也看不到更多）；没露出来的先不量
  const fitThoughts = () => document.querySelectorAll('.chat-think:not([data-cut])').forEach(el => {
    const preview = el.querySelector('.chat-think__preview');
    if (preview.clientWidth && el.querySelector('.chat-think__toggle').getAttribute('aria-expanded') !== 'true')
      el.classList.toggle('chat-think--fits', preview.scrollWidth <= preview.clientWidth);
  });
  document.fonts?.ready.then(fitThoughts);
  document.addEventListener('click', e => {
    const toggle = e.target.closest('.chat-think__toggle');
    if (toggle) toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
    const btn = e.target.closest('[data-helpers-more]');
    if (!btn) return;
    const later = [...btn.closest('.helpers').querySelectorAll(':scope > .helper[hidden]')];
    later.slice(0, 5).forEach(li => li.hidden = false);
    const left = later.length - 5;
    if (left > 0) btn.textContent = helperButton(left, false);
    else btn.closest('li').remove();
  });
  const bar = U.topbar({ ask: () => `请看实况 AI 对话：${$('head').textContent}。请说明各段对话现在的情况。` });
  L.add($('hero')); U.fold($('recent-more'), $('recent-box'));
  document.querySelectorAll('#active > .part, #recent > .part').forEach(el => el.setAttribute('data-keep', ''));
  const heroRead = U.reading($('hero').querySelector('.card__body'), { ghost: U.ghost.card(1), name: 'AI 对话' });
  const activeRead = U.reading($('active'), { ghost: U.ghost.rows(3), slow: false }), recentRead = U.reading($('recent'), { ghost: U.ghost.rows(4) });
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  document.querySelectorAll('a[href^="/live/"]').forEach(a => a.href = route(a.getAttribute('href')));
  const field = (value, item, parent) => U.chatFields.field(value, item, parent);
  const chatCell = (value, label, parent, limit = 0, card = false, plain = false) => {
    return U.chatFields.cell(value, label, parent, viewer, limit, card, plain);
  };
  function shownOrigin(c) {
    const label = U.chatFields.originLabel(c, false);
    return label === '本人' ? '' : label;
  }
  const detailHref = (id, hash = '') => esc(route(`/live/chat/?id=${encodeURIComponent(id)}${hash}`));
  function helperTitle(h, parent) {
    if (contentLocked(h, viewer) || contentLocked(parent, viewer)) return '';
    const task = U.chatHelperPurpose(h, parent, viewer);
    if (task) return chatCell(task.purpose, '帮手名', parent, task.limit, true);
    const name = field(h.title, h, parent);
    return viewer === 'public' && (name.hidden || name.hidden_block || name.visibility === 'owner')
      ? chatCell(name, '帮手名', parent) : '未记录具体任务';
  }
  const clockWithSeconds = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  function duration(seconds) {
    const hours = Math.floor(seconds / 3600), mins = Math.floor(seconds / 60) % 60, secs = seconds % 60;
    return [hours && `${hours} 小时`, mins && `${mins} 分`, (secs || !seconds) && `${secs} 秒`].filter(Boolean).join(' ');
  }
  const knownCount = v => Number.isInteger(v) && v >= 0;
  const helperPeople = helpers => helpers.reduce((sum, h) => sum + (h.private_count || 1), 0);
  function helperLabel(c, helpers) {
    const exact = c.helper_counts?.total ?? c.helpers?.total;
    if (knownCount(exact)) return exact ? `帮手 ${exact} 个` : '';
    const active = helperPeople(helpers);
    if (Array.isArray(c.helpers)) return active ? `帮手 ${active} 个` : '';
    const observed = [Math.max(knownCount(c.helpers?.running) ? c.helpers.running : 0, active),
      c.helpers?.done, c.helpers?.failed].filter(knownCount).reduce((sum, n) => sum + n, 0);
    return observed ? `已读到 ${observed} 个帮手` : '';
  }
  function retryMessage(text) {
    const reason = text.replace(/^API Error:\s*/i, '');
    if (/^Connection refused\b/i.test(reason)) return /firewall|proxy/i.test(reason) ? '连接被拒绝，可能被防火墙或代理拦截' : '连接被拒绝';
    if (/^Stream disconnected before completion\b/i.test(reason)) return '回复还没结束，连接就断开了';
    if (/^(?:Stream (?:disconnected|closed|interrupted)|Connection (?:closed|reset|interrupted)|ECONNRESET)\b/i.test(reason)) return '连接中断';
    return /^(?:API Error:|Error:)/i.test(text) ? '连接出错，正在重连' : '';
  }
  function chat(c, at, completed = false) {
    if (c.private_count) return { key: c.key || c.id, cls: 'row row--flat row--empty', html: `<span></span><p class="row__sub">${U.privateSummary(c.private_count, { unit: '场对话' })}</p>` };
    if (c.q === 'warming') return { key: c.id, cls: 'row row--flat', html: '<div class="row__text"><p class="row__sub">正在准备</p></div>' };
    const locked = contentLocked(c, viewer), [startedAt, startLabel] = locked ? U.chatStart(c) : [];
    const e = c.estimate, actual = Object.hasOwn(c, 'worked_seconds') ? c.worked_seconds : Number.isFinite(e?.worked_min) ? Math.round(e.worked_min * 60) : null;
    const clock = Number.isFinite(Date.parse(c.at)) && (completed ? `${c.state === 'ended_unknown' ? '最后活动 ' : ''}${U.date(c.at)} ${clockWithSeconds.format(new Date(c.at))}` : c.state === 'running' ? U.chatActivity(c, at) : `最后活动 ${stamp(c.at)}`);
    const stillWorking = c.state === 'done' && workingHelpers(c);
    const activity = [stillWorking ? '对话已结束' : completed && !U.chatFields.quota(c, viewer) && stateText(c), stillWorking && `后台帮手另在处理（${stillWorking} 个）`, clock].filter(Boolean).join(' · ');
    const timing = [Number.isFinite(c.elapsed_seconds) && `历时 ${duration(c.elapsed_seconds)}`, Number.isFinite(actual) && `实际工时 ${duration(actual)}`,
      e?.planned_min != null && `报 ${Math.round(e.planned_min)} 分钟`, Math.round(e?.over_min) > 0 && `超 ${Math.round(e.over_min)} 分钟`, startedAt && `${startLabel} ${stamp(startedAt)}`, activity].filter(Boolean).join(' · ');
    const name = field(c.title, c), marked = name.hidden || viewer === 'public' && name.visibility === 'owner' || name.rewrite === 'pending' && !name.text;
    const displayName = typeof name.text === 'string' ? { ...name, value: plain(name.text), text: plain(name.text) } : name;
    const titleHtml = locked ? '仅本人可见' : U.fieldHtml(name.text || marked ? displayName : '无标题', { name: '对话', place: 'title', kind: viewer });
    const href = c.detail ? detailHref(c.id) : '';
    const title = href ? `<a class="row__title" href="${href}">${titleHtml} <span class="more__chev" aria-hidden="true">›</span></a>`
      : titleHtml ? `<span class="row__title">${titleHtml}</span>` : '';
    // “访客看不到”小签只挂在标题那一行（同实况首页的事项、单场对话页），模型那一行不再重复挂一个（M692）
    const titleMark = locked || viewer === 'owner' && U.visitorHiddenMark(c, '这场对话', viewer) ? '' : (marked ? chatCell(name, '对话名', c) : viewer === 'owner' && name.visibility === 'owner' ? '' : U.visibilityNote(name, viewer, '对话名'));
    const waitLabel = c.state === 'waiting' && stateText(c);
    const raw = locked ? null : U.chatProgressText(c.text ?? c.doing, c, viewer) ?? c.latest_reply, preview = U.chatPreviewSummary(raw, c, viewer);
    const repeatsStatus = (waitLabel || completed && !stillWorking) && U.chatFields.repeatsState(preview, c, viewer);
    const retry = c.state === 'reconnecting' && retryMessage(U.fieldText(preview, viewer));
    const snippet = chatCell(preview, '最新进展', c, !retry && viewer === 'public' ? 80 : 0, true, preview !== raw);
    const retryText = retry && chatCell({ ...field(preview, c), text: retry }, '最新进展', c, 0, true);
    const latest = !snippet || repeatsStatus ? '' : retryText && !c.detail
      ? `<details class="row__sub"><summary>${retryText}</summary><p style="overflow-wrap:anywhere">${snippet}</p></details>`
      : `<p class="row__line">${retryText || snippet}</p>`;
    const helpers = Array.isArray(c.helpers) ? c.helpers : c.helpers?.active || [];
    const { label, count, plan, current } = planInfo(c);
    const progress = locked ? (label || count) && `<span class="chat-pill">${esc(label || count)}</span>`
      : c.detail && plan[current] && label ? `<a class="chat-pill chat-pill--link" href="${detailHref(c.id, '#plan-box')}" aria-label="${label}，查看执行计划">${label} ›</a>` : '';
    const steps = !locked && progress ? `<span class="chat-steps" aria-hidden="true">${plan.map(p => `<i data-status="${esc(stepState(p) || '')}"></i>`).join('')}</span>` : '';
    const thoughtFull = locked ? '' : chatCell(c.thinking, '思考摘要', c, 0, true);
    const thoughtShort = viewer === 'public' && thoughtFull ? chatCell(c.thinking, '思考摘要', c, 40, true) : thoughtFull;
    const thought = thoughtFull ? `<div class="chat-think row__sub"${thoughtShort !== thoughtFull ? ' data-cut' : ''}>` +
      `<span class="chat-think__preview">思考摘要<span class="chat-think__excerpt">：${thoughtShort}</span></span>` +
      '<button class="more chat-think__toggle" type="button" aria-expanded="false"><span class="chat-think__open">展开摘要</span><span class="chat-think__shut">收起摘要</span> <span class="more__chev" aria-hidden="true">›</span></button>' +
      `<p class="chat-think__full">${thoughtFull}</p></div>` : '';
    // 帮手：在做和出错的先露前 5 个，其余收着按批看
    const busy = h => h.private_count || ['running', 'failed'].includes(h.state);
    const helperFirst = [...helpers.filter(busy), ...(locked ? helpers.filter(h => !busy(h)) : [])].slice(0, 5);
    const helperRest = helpers.filter(h => !helperFirst.includes(h));
    const helperCount = helperLabel(c, helpers), origin = shownOrigin(c);
    const source = origin ? `<span class="chat-tag">${esc(origin)}</span>` : '';
    const attribution = [U.chatFields.appTag(c), who(c, 'body', true), source].filter(Boolean).join(' ');
    const modelLine = attribution ? `<span class="chat-model">${attribution}</span>` : '';
    const context = [modelLine, titleMark, timing && `<span data-steady>${esc(timing)}</span>`].filter(Boolean).join('');
    const runningPreview = !Array.isArray(c.helpers);
    const groupedPreview = runningPreview && helpers.length === 1 && helpers[0].private_count;
    const busyCount = helperPeople(helpers), allCount = c.helper_counts?.total ?? c.helpers?.total;
    const helperPreview = runningPreview && helpers.length && !groupedPreview ? `<li class="row__sub">正在帮这场对话做事的有 ${busyCount} 个${knownCount(allCount) && allCount > busyCount ? `（一共 ${allCount} 个，${c.detail ? '全部在完整对话里' : '其余已结束'}）` : ''}</li>` : '';
    const waitBadge = waitLabel ? `<span class="chat-pill">${esc(waitLabel)}</span>` : '';
    const detailAction = href ? `<a class="btn btn--sm chat-detail-link" href="${href}" data-mo-press>${locked ? '看对话详情' : '看完整对话'} <span aria-hidden="true">›</span></a>` : '';
    const rowActions = locked ? '' : actions(c);
    const stage = locked && stageLabel(c), projectField = c.project_name || c.project;
    const project = locked && (projectField?.visibility === 'owner' ? '仅本人可见' : U.fieldText(projectField, viewer));
    const lockLine = locked ? `<p class="row__sub">${contentLock()}</p>` : '';
    const lockedMeta = [stage, project && `所属项目 ${project}`].filter(Boolean).join(' · ');
    const meta = lockedMeta ? `<p class="row__sub">${esc(lockedMeta)}</p>` : '';
    return { key: c.id, cls: `row row--chat lb-item${attention(c) ? ' is-attention' : ''}${completed && params.get('source') === c.source ? ` source-${c.source}` : ''}`, html: `${lamp(c)}<p class="row__main">${title}${waitBadge}${progress}${helperCount ? `<span class="chat-pill">${helperCount}</span>` : ''}${U.draw10?.badge(c) || ''}${U.visitorHiddenMark(c, '这场对话', viewer)}</p>${detailAction}<div class="row__acts">${rowActions}</div><div class="row__text">${lockLine}${completed ? [modelLine, titleMark].filter(Boolean).map(value => `<p class="row__sub">${value}</p>`).join('') : context && `<p class="row__sub chat-context">${context}</p>`}${meta}${steps}${latest}${thought}${locked ? '' : U.draw10?.compactionDisclosure?.(c, viewer) || ''}${completed && timing ? `<p class="row__sub" data-steady>${esc(timing)}</p>` : ''}${helpers.length ? `<ul class="helpers">${helperPreview}${[...helperFirst, ...helperRest].map((h, i) => { const later = i >= helperFirst.length ? ' hidden' : ''; return h.private_count ? `<li class="helper helper--sum"${later}>${U.visibilityNote({ visibility: 'owner', hidden_what: `其中 ${h.private_count} 个${groupedPreview ? '在干的' : ''}帮手` }, viewer)}</li>` : h.q === 'warming' ? `<li class="helper"${later}>正在准备</li>` : `<li class="helper"${later}><div><span class="helper__who" style="display:inline-flex;align-items:center;gap:8px">${lamp(h)}<span class="chat-tag">帮手</span>${who(h)}${c.visibility === 'owner' || c.public === 'owner' ? '' : U.visitorHiddenMark(h, '这个帮手', viewer)}</span>${helperTitle(h, c) ? ` · ${helperTitle(h, c)}` : ''}${helperAt(h, at) ? ` · <span class="helper__at">${esc(helperAt(h, at))}</span>` : ''}${U.draw10?.helperDetailHtml?.(h, viewer) || ''}</div><span class="helper__at">${esc(stateText(h))}</span></li>`; }).join('')}${helperRest.length ? `<li class="helper helper--more"><button class="more" type="button" data-helpers-more>${helperButton(helperRest.length, !helperFirst.length)}</button></li>` : ''}</ul>` : ''}</div>` };
  }
  const stamp = at => `${U.date(at)} ${U.time(at)}`.trim();
  function readAt(at) {
    if (!Number.isFinite(new Date(at ?? NaN).getTime())) return '';
    const day = U.date(at), time = U.time(at);
    return `截至 ${[(!time || day !== U.date(Date.now())) && day, time].filter(Boolean).join(' ')}`;
  }
  const chartHost = $('chat-concurrent');
  const concurrent = window.LiveChart.create(chartHost, { small: true, unit: '个', bridge: 0, insetEdgeDots: true, lines: [{ id: 'working', label: '同时在干', hue: 'teal' }],
    onRead([reading], pointedAt) {
      const cell = chartHost.querySelector('.chart__val b');
      if (!cell || !reading) return;
      if (reading.value == null) cell.textContent = '没记录';
      else if (Number.isFinite(reading.at)) cell.textContent = `${pointedAt == null ? readAt(reading.at * 1000) : `所指记录 ${stamp(reading.at * 1000)}`} · ${reading.value} 个`;
    }
  });
  const daily = window.LiveViz.bars($('chat-days'), { stack: true, unit: '个', series: [{ id: 'claude', label: 'Claude', hue: 'apricot' }, { id: 'gpt', label: 'Codex', hue: 'teal' }, { id: 'antigravity', label: 'Antigravity', hue: 'violet' }] });
  // “今天”“近 7 天”两栏并排时底边拉齐：长的那栏从后往前把型号收进“展开”，总数行、说明行都算进高度，至少露 1 个型号；
  // 只多 1 个型号不收（收了也要多一行“展开”）。数据刷新、换窗口宽时重新算（M460）
  function fitModels() {
    const box = $('chat-counts'), parts = [...box.querySelectorAll(':scope > div')].map(col => ({ col,
      rows: [...col.querySelectorAll(':scope > .chat-model-row')], more: col.querySelector(':scope > .chat-models-more') })).filter(part => part.more && part.rows.length);
    parts.forEach(({ rows, more }) => { rows.forEach(row => row.classList.remove('is-extra')); more.hidden = true; });
    if (parts.length !== 2 || getComputedStyle(box).gridTemplateColumns.split(' ').filter(Boolean).length < 2) return;
    const end = col => Math.max(...[...col.children].filter(el => el.offsetHeight).map(el => el.getBoundingClientRect().bottom));
    const [a, b] = parts, long = end(a.col) > end(b.col) ? a : b, target = Math.min(end(a.col), end(b.col)), { rows, more } = long;
    const slack = rows[0].offsetHeight / 2;
    if (end(long.col) - target < slack) return;
    more.hidden = false;
    const tail = more.getBoundingClientRect().bottom - rows.at(-1).getBoundingClientRect().bottom;
    let keep = rows.length;
    while (keep > 1 && rows[keep - 1].getBoundingClientRect().bottom + (keep < rows.length ? tail : 0) > target + slack) keep -= 1;
    if (rows.length - keep < 2) { more.hidden = true; return; }
    rows.slice(keep).forEach(row => row.classList.add('is-extra'));
    more.querySelector('.chat-models-left').textContent = rows.length - keep;
  }
  if (typeof ResizeObserver === 'function') new ResizeObserver(() => fitModels()).observe($('chat-counts'));
  function renderStats(stats, temporary = false) {
    const current = stats?.concurrent, { from, to } = current?.window ?? current ?? {}, peak = current?.peak;
    const plots = $('chat-counts').parentElement.querySelector('.chat-plots'); plots.style.display = stats ? '' : 'none';
    $('chat-end-date').textContent = [Number.isFinite(peak?.count) && `峰值 ${peak.count} 个${peak.at ? ` · ${stamp(peak.at)}` : ''}`,
      to && (current?.window?.from ? `${U.date(from)} 至 ${U.date(to)}` : U.date(to))].filter(Boolean).join(' · ');
    if (!stats || stats.q === 'warming') { plots.style.display = 'none'; U.html($('chat-counts'), `<p class="row__sub">${temporary ? '对话统计暂时读不到' : U.offline?.() ? '这块没存下来，连上后补上。' : stats?.q === 'warming' ? '正在准备' : U.collectionText()}</p>`); return; }
    function n(v, d, key, label) {
      if (d?.q === 'warming') return '<span class="row__sub">正在准备</span>';
      if (!Number.isFinite(v)) return `<span class="row__sub">${v != null ? U.fieldHtml(v, { name: label, place: 'body' }) : U.offline?.() ? '—' : esc(U.collectionText(label, d || stats))}</span>`;
      const text = U.collectionText('', { ...d, lower_bound: [d?.lower_bound, d?.at_least, d?.isPartial].includes(true) }, v, key);
      if (text === '至少 0') return `${label} <span class="row__sub">暂无已确认记录</span>`;
      const prefix = key === 'manual_opened' && text.startsWith('至少 ') ? '至少 ' : '';
      return `${label} ${prefix}<strong>${U.fieldHtml(text.slice(prefix.length), { name: label, place: 'body' })}</strong>${key === 'manual_opened' ? ' 个' : ''}`;
    }
    const reading = $('chat-current-reading'), at = readAt(current?.at);
    const hasCurrent = Number.isFinite(current?.current);
    const gap = current?.gap === '最近的对话记录已超过 120 秒'
      ? `此刻同时在干暂时读不到${at ? ' · 上次记录' + at : ''}` : current?.gap;
    const currentText = hasCurrent ? n(current.current, current, 'current', U.offline?.() ? '断开前在干的主对话' : '此刻在干的主对话') + (at ? ` · ${U.nowrap(at)}` : '') : '';
    U.html(reading, [currentText, gap && U.fieldHtml(gap, { name: '统计说明', place: 'body' })].filter(Boolean).join(' · '));
    reading.hidden = !currentText && !gap;
    const gapHtml = gap => U.fieldHtml(gap, { name: '统计说明', place: 'body' });
    // 型号先全写出来，比另一栏长的那栏由 fitModels 按高度收进“展开”（M460）
    const modelsOf = key => stats[key]?.models && (U.draw10?.modelRows(stats[key].models) || stats[key].models);
    const counts = [['today', '今天'], ['week', '近 7 天']].map(([key, label]) => {
      const d = stats[key];
      if (d?.q === 'warming') return `<div><h2>${label}</h2><p class="row__sub">正在准备</p></div>`;
      // 只因还有几条记录没确认开没开才不全的（下面单写了几条、暂未计入），已确认的对话数照实写，不写“至少”
      const pendingOnly = d?.unconfirmed_openings > 0 && !String(d?.gap ?? '').includes('只有部分主对话有记录');
      const sure = m => { if (!pendingOnly || !Array.isArray(m?.partial)) return m; const partial = m.partial.filter(k => k !== 'opened'); return partial.length ? { ...m, partial } : { ...m, q: 'ok', partial, gap: null }; };
      const models = d?.models && modelsOf(key).map(sure);
      const firstGap = models?.[0]?.gap;
      const modelGap = typeof firstGap === 'string' && models.every(m => m.gap === firstGap) ? firstGap : '';
      const modelRow = m => {
        const model = U.draw10?.modelHtml(m, { name: '型号', place: 'body', kind: viewer }) ?? U.fieldHtml(m.model, { name: '型号', place: 'body' });
        const counts = `${n(m.opened, m, 'opened', '对话')} · ${n(m.helpers, m, 'helpers', '帮手')}`;
        return `<p class="chat-model-row"><small>${model || '型号没记下'} · ${counts}${m.gap && !modelGap ? ' · ' + gapHtml(m.gap) : ''}</small></p>`;
      };
      const open = $('chat-counts').querySelector(`details[data-models="${key}"]`)?.open;
      const modelList = models ? models.map(modelRow).join('')
        + `<details class="chat-models-more" data-models="${key}"${open ? ' open' : ''} hidden><summary class="more live-disclosure"><span class="disclosure-closed">展开（还有 <span class="chat-models-left">0</span> 个型号）</span><span class="disclosure-open">收起</span> <span class="more__chev" aria-hidden="true">›</span></summary></details>`
        : `<p class="row__sub">${esc(U.collectionText('各型号', stats))}</p>`;
      const notes = [...new Set([d?.gap, modelGap].filter(Boolean))].map(gap => `<p><small>${gapHtml(gap)}</small></p>`).join('');
      return `<div><h2>${label}</h2><p>${n(d?.opened, sure(d), 'opened', '对话')} · ${n(d?.helpers, d, 'helpers', '帮手')} <small>${n(d?.manual_opened, d, 'manual_opened', '本人对话')}</small></p>${notes}${modelList}</div>`;
    }).join('');
    U.html($('chat-counts'), counts);
    fitModels();
    const historyQ = current?.history_q ?? (current?.q === 'warming' ? 'warming' : undefined);
    if (Array.isArray(current?.series) && historyQ !== 'warming') concurrent.set({ ...current, from, to, q: historyQ });
    else concurrent.wait(U.offline?.() ? '这块没存下来，连上后补上。' : historyQ === 'warming' ? '正在准备' : stats.accumulating ? U.accumulatingText(stats.accumulating) : U.collectionText('同时在干的对话', stats));
    $('chat-concurrent').style.display = '';
    const daysKnown = stats.days?.some(d => ['claude', 'gpt', 'antigravity'].some(k => Number.isFinite(d[k])));
    $('chat-days').style.display = ''; daily.set(daysKnown ? { labels: stats.days.map(d => ({ text: U.date(d.at) })), values: Object.fromEntries(['claude', 'gpt', 'antigravity'].map(k => [k, stats.days.map(d => d[k] ?? null)])) } : null);
    if (!daysKnown) daily.wait?.(U.offline?.() ? '这块没存下来，连上后补上。' : U.collectionText('每天开的对话', stats));
  }
  let viewer = 'public', activeChats = null, activeAt = null, homeChats = null, homeAt = null, recentAt = null, recentUsable = false, recentWarming = false, recentState = null, firstRecent = true;
  const pages = new Map();
  let homeSources, recentSources;
  function drawSources() {
    const record = [homeSources, recentSources].find(r => r?.viewer === viewer && r.data && Object.hasOwn(r.data, 'unconnected_source_count'));
    U.html($('chat-sources'), U.draw10.sourceHtml(record?.data, viewer), false);
  }
  function readViewer(meta) {
    const next = meta.viewer?.kind || 'public';
    if (next !== viewer) {
      homeChats = activeChats = null; recentUsable = false; pages.clear();
      document.querySelectorAll('.chat-board ul.rows, #chat-done30 ul').forEach(ul => ul.replaceChildren());
    }
    viewer = next;
  }
  const peopleIn = rows => rows?.reduce((total, row) => total + (row.private_count || 1), 0) ?? 0;
  function chatCount(d, key, observed) {
    if (Number.isFinite(d?.[key])) {
      const text = U.collectionText('', d, d[key], key);
      if (text !== '至少 0') return `${text} 个`;
    }
    return observed > 0 ? `至少 ${observed} 个` : '';
  }
  function recentEvidence() {
    const pack = recentUsable ? pages.get('') : Array.isArray(activeChats?.recent) ? activeChats : homeChats;
    const list = recentUsable ? [...pages.values()].flatMap(p => p.items) : pack?.recent;
    const rows = list == null ? null : [...new Map(list.map(c => [c.id ?? c.key, c])).values()];
    const count = peopleIn(rows), key = recentUsable ? 'total' : 'recent_total';
    const at = pack?.window?.to ?? pack?.at ?? (recentUsable ? recentAt : pack === activeChats ? activeAt : homeAt);
    return { rows, count, at, total: pack?.[key], label: chatCount(pack, key, count) };
  }
  function renderHeading(d) {
    const temporary = d?.q === 'unknown' && !U.offline?.() && [404, 503].includes(recentState?.meta?.status);
    if (temporary) missing('对话暂时读不到', true);
    else if (d?.q === 'warming') {
      U.html($('head'), U.head('AI 对话', { lamp: false }));
      U.html($('chat-note'), '<span class="row__sub">正在准备</span>');
      L.tone($('hero'), 'none');
    } else if (d) {
      const status = { ...d, level: d.header_level ?? d.level };
      U.html($('head'), U.status(status).lamp + U.head('AI 对话', { lamp: false }));
      const current = (key, label) => {
        const listed = peopleIn(d.active?.filter(c => c.state === key));
        if (Number.isFinite(d[key]) && d[key] < listed) return `${label}（汇总 ${d[key]} 场，列表列出 ${listed} 场）`;
        const count = chatCount(d, key, listed);
        return count && count + label;
      };
      const running = current('running', U.isStale(d) || U.offline?.() ? '当时在干' : '在干');
      const waiting = current('waiting', viewer === 'public' ? '等本人回答' : '等你回答');
      const done = chatCount(d, 'done72', 0), active = [running, waiting].filter(Boolean).join(' · ');
      const seen = readAt(d.source_at ?? (activeChats ? activeAt : d.at ?? homeAt)), cutoff = readAt(d.window?.to || d.at || (activeChats ? activeAt : homeAt));
      const sameTime = active && done && seen && seen === cutoff;
      const reading = text => `<span class="live-unit">（${esc(text)}）</span>`;
      const notes = [active && U.nowrap(active) + (seen && !sameTime ? reading(seen) : ''),
        done && `近 72 小时已回复 ${U.nowrap(done)}${cutoff && !sameTime ? reading(cutoff) : ''}`].filter(Boolean);
      U.html($('chat-note'), notes.length ? notes.join(' · ') + (sameTime ? reading(seen) : '') : U.fieldHtml(d.text, { name: 'AI 对话', kind: viewer }), false);
      L.tone($('hero'), status);
    }
    if (d) heroRead.done();
    return temporary;
  }
  function render(d, at) {
    const list = activeChats || d, temporary = renderHeading(list);
    if (!list) return;
    if (list.q === 'warming') U.list($('active-list'), wait('正在准备'));
    else if (!temporary || activeChats) {
      const none = list.active?.length || list.hidden ? null : list.active == null || list.q === 'unknown' ? U.collectionText() : U.offline?.() ? '断开前没有在干或等着的对话' : '没有在干或等着的对话';
      drawActive(list, list.source_at ?? (activeChats ? activeAt : d?.at || homeAt || at), none);
      U.land();
    }
    activeRead.done();
  }
  // 在干的、等你的……各进自己那一栏：每栏先 5 张，其余收在“展开”里；一场都没有时在“在干”那栏写一句
  function drawActive(d, at, none) {
    const byState = new Map();
    for (const c of U.order(d.active || [], attention, 'chats:active')) { const key = COLUMN[c.state] ? c.state : 'unknown'; if (!byState.has(key)) byState.set(key, []); byState.get(key).push(c); }
    for (const key of Object.keys(COLUMN)) {
      const list = byState.get(key) || [], fixed = key === 'running' || key === 'waiting';
      if (!fixed && !list.length) { const old = board.get(key); if (old) old.el.hidden = true; continue; }
      const card = key === 'waiting' ? waitingCard : board.card(key, COLUMN[key]); card.el.hidden = false;
      if (!card.bound) { card.bound = true; U.fold(card.more, card.box); }
      const rows = list.map(c => chat(c, at)), count = peopleIn(list);
      const main = rows.slice(0, 5), rest = rows.slice(5), restCount = rest.reduce((n, r, i) => n + (list[i + 5]?.private_count || 1), 0);
      const countText = fixed && Number.isFinite(d[key]) && d[key] < count ? `已列出 ${count} 场` : fixed ? chatCount(d, key, count) : `${count} 个`;
      const emptyWaiting = key === 'waiting' && countText === '0 个', publicWaiting = key === 'waiting' && viewer === 'public';
      const label = publicWaiting ? '等本人' : COLUMN[key].name;
      const titleCount = emptyWaiting ? '0 个' : countText;
      card.el.classList.toggle('lb-card--quiet', emptyWaiting);
      U.html(card.title, `<b>${label}</b><span class="lb-card__count">${esc(titleCount)}</span>`, false);
      U.html(card.sub, esc(publicWaiting ? '要本人回答或选一下才能接着做' : COLUMN[key].about));
      const empty = countText === '0 个' ? `${U.offline?.() ? '断开前' : ''}没有${label}的对话`
        : countText ? '暂时只读到数量' : key === 'running' && none ? none : U.collectionText();
      // “等你”没对话时和“在干”一样高：卡头照常，下面正中放一个勾和一句话，看着是有意空着，不是一大块空白（M534）
      const idle = emptyWaiting && [{ key: 'idle', cls: 'chat-idle', html: `<span class="chat-idle__mark">${window.LiveBoard.icon('check')}</span><b>${U.offline?.() ? '断开前' : '现在'}没有对话在等${publicWaiting ? '本人' : '你'}回复</b>` }];
      U.list(card.main, idle || (main.length ? main : wait(empty)));
      U.list(card.rest, rest); card.more.hidden = !rest.length; U.html(card.more, `<span class="lb-more__open">展开（还有 ${restCount} 个）</span><span class="lb-more__shut">收起</span> <span class="more__chev">›</span>`);
    }
    board.el.querySelectorAll(':scope > .lb-card').forEach(el => { el.style.minHeight = ''; });
    board.layout(true);
    even();
    recentBoard.layout(true);
    fitThoughts();
    fitRecent();
  }
  // 第一排两栏底边拉齐：矮的那栏最后一张卡拉长到和另一栏一样高；卡变高变矮（展开、来了新对话、换窗口宽）时重新拉（M534）
  const evenWatch = typeof ResizeObserver === 'function' ? new ResizeObserver(() => even()) : null, evenSeen = new WeakSet();
  function even() {
    const cards = [...board.el.children].filter(el => el.matches('.lb-card') && !el.hidden && !el.classList.contains('is-away'));
    cards.forEach(el => { el.style.minHeight = ''; if (!evenSeen.has(el)) { evenSeen.add(el); evenWatch?.observe(el); } });
    const height = [0, 0], last = [];
    for (const el of cards) { const k = Math.min(1, Math.max(0, (parseInt(el.style.gridColumn, 10) || 1) - 1)); height[k] += el.getBoundingClientRect().height + 22; last[k] = el; }
    const low = height[0] < height[1] ? 0 : 1, gap = Math.abs(height[0] - height[1]);
    if (last[0] && last[1] && gap >= 1) last[low].style.minHeight = `${last[low].getBoundingClientRect().height + gap}px`;
  }
  // 近 72 小时已结束占整行、排成几列：每组先露一整排（这一排放得下几个就露几个），多的进“展开”；换了窗口宽重新算（M534）
  let recentRows = new Map(), recentCols = 3;
  function fitRecent() {
    const list = $('recent-list'), more = $('recent-more'), open = $('recent-box').classList.contains('is-open');
    const rows = [...list.children].filter(li => recentRows.has(li.dataset.key));
    if (list.offsetWidth) recentCols = Math.max(1, getComputedStyle(list).gridTemplateColumns.split(' ').filter(Boolean).length);
    rows.forEach(li => li.classList.toggle('chat-ended-extra', recentRows.get(li.dataset.key).i >= recentCols));
    const left = rows.filter(li => li.classList.contains('chat-ended-extra')).reduce((sum, li) => sum + recentRows.get(li.dataset.key).count, 0);
    more.hidden = !left && !open;
    U.html(more, `<span class="lb-more__open">展开（还有 ${left} 个）</span><span class="lb-more__shut">收起</span> <span class="more__chev">›</span>`);
  }
  $('recent-more').addEventListener('click', () => requestAnimationFrame(fitRecent));
  if (typeof ResizeObserver === 'function') new ResizeObserver(() => fitRecent()).observe($('recent-list'));
  function renderRecent() {
    $('recent').hidden = !!U.offline?.() && !recentUsable && homeChats?.recent == null;
    if (!recentUsable && !homeChats?.recent?.length && !U.offline?.() && [404, 503].includes(recentState?.meta?.status)) { U.list($('recent-list'), wait('最近结束的对话暂时读不到')); U.list($('recent-rest'), []); $('recent-more').hidden = $('recent-next').hidden = true; recentRead.done(); return; }
    if (recentWarming) { U.list($('recent-list'), wait('正在准备')); U.list($('recent-rest'), []); $('recent-more').hidden = $('recent-next').hidden = true; recentRead.done(); return; }
    const { rows, at, total, count, label } = recentEvidence();
    const sections = [['done', '做完的', ['done']], ['interrupted', '没做完就停了', ['stopped', 'failed']],
      ['ended_unknown', '结局没读到', ['ended_unknown']]].map(([key, name, states]) => ({
      key, name, rows: (rows || []).filter(c => states.includes(c.state))
        .map(c => ({ ...chat(c, at, true), count: c.private_count || 1 })),
    }));
    // 每组先摆一整排，多的留在本组后面、点“展开”才露出来：组名只出一次，展开后仍按组、组里按时间排。
    const main = sections.flatMap(({ key, name, rows }) => rows.length ? [{ key: `ended:${key}`, cls: 'chat-ended-label', html: `<h3>${name}</h3>` },
      ...rows.map((row, i) => ({ ...row, i, cls: i < recentCols ? row.cls : `${row.cls} chat-ended-extra` }))] : []);
    recentRows = new Map(main.filter(row => row.count).map(row => [row.key, { count: row.count, i: row.i }]));
    U.html($('recent-title'), recentTitle + (label ? `<span class="lb-card__count">${esc(label)}</span>` : ''), false);
    U.list($('recent-list'), main.length ? main : wait(label === '0 个' ? '72 小时内没有结束的对话'
      : label ? '暂时只读到数量' : recentState?.warming ? '正在读' : U.collectionText()));
    U.list($('recent-rest'), []);
    U.html($('recent-note'), esc(total != null && total > count ? `已列出 ${count} 个` : '') + (pages.get('')?.hidden ? ` ${U.hiddenMore?.(pages.get('').hidden, '场', pages.get('').hidden_what || '对话') || ''}` : ''));
    $('recent-next').hidden = nextRecentCursor() == null; U.html($('recent-next'), '继续读 ›');
    if (recentUsable) recentRead.done();
    recentBoard.layout(true);
    fitThoughts();
    fitRecent();
    U.land();
  }
  function missing(text, temporary = false) { U.html($('head'), U.head('AI 对话', { lamp: false })); U.html($('chat-note'), U.fieldHtml(text, { name: 'AI 对话', place: 'body', kind: viewer })); if (temporary) { $('head').querySelector('.lamp')?.setAttribute('data-tone', 'off'); L.tone($('hero'), 'off', 'off'); } if (!activeChats) U.list($('active-list'), wait(text)); }
  renderStats(null); missing('正在读'); U.list($('recent-list'), wait('正在读'));
  let first = true, activityMinute = null, homeOffline = false;
  // 这页不列后台的对话（本人定的）；后台自动任务这会儿在跑的，顶上另起一行“后台另有 N 个在跑 ›”，点了到自动任务页
  const drawBackground = auto => { const n = U.offline?.() ? 0 : Number.isInteger(auto?.running_total) ? auto.running_total : Array.isArray(auto?.running) ? auto.running.length : 0; $('chat-background').hidden = !(n > 0); U.html($('chat-background'), n > 0 ? `<a class="chat-background" href="${esc(route('/live/automation/'))}">后台另有 ${n} 个在跑 ›</a>` : ''); };
  window.LiveHeader.watch(null, { phase(s) { if (!homeChats && !activeChats) { heroRead.set(s); activeRead.set(s); } }, data(d, meta) {
    readViewer(meta); const draw = () => {
      homeChats = d?.chats || null; homeSources = { data: homeChats, viewer }; drawSources(); homeAt = meta.at;
      drawBackground(d?.automation);
      if (!homeChats && !activeChats) { missing(U.collectionText()); if (d != null) { heroRead.done(false); if (!activeChats) activeRead.done(false); } }
      render(homeChats, meta.at); renderRecent();
    };
    if (first) draw(); else U.anchor(draw); if (d?.chats) first = false; L.lightUp([$('hero'), $('active'), $('recent'), $('notices')]);
  }, link(s) {
    const minute = Math.floor(Date.parse(s.now) / 60000), offlineChanged = homeOffline !== !!s.offline; homeOffline = !!s.offline;
    if (homeChats && (offlineChanged || !s.offline && minute !== activityMinute)) { activityMinute = minute; U.anchor(() => render(homeChats, s.now)); }
    bar?.set(s); L.offline(s.offline); U.list($('notices'), s.offline ? [{ key: 'offline', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${U.fieldHtml(s.text, { name: '连接情况', place: 'body', kind: viewer })}</span>` }] : []);
    if (!s.data && !activeChats) missing(s.warming ? '正在读' : s.offline ? U.collectionText() : s.text || U.collectionText());
    U.blockNote($('hero').querySelector('.card__body'), s);
  } });
  window.Live.watch('chats', null, { phase(s) { if (!activeChats && !homeChats?.active) activeRead.set(s); }, data(d, meta) {
    readViewer(meta);
    activeChats = Array.isArray(d?.active) ? d : null; activeAt = d?.at ?? meta.at;
    if (homeChats || activeChats) U.anchor(() => { render(homeChats, activeAt); if (!recentUsable) renderRecent(); });
    L.lightUp([$('active')]);
  }, link(s) { U.blockNote($('active'), s); } });
  const redrawRecent = () => {
    const draw = () => { renderRecent(); renderHeading(activeChats || homeChats); };
    if (firstRecent) draw(); else U.anchor(draw);
  };
  window.Live.watch('chats', { window: '72h' }, { phase(s) { if (!recentUsable) recentRead.set(s); }, data(d, meta) {
    readViewer(meta); recentSources = { data: d, viewer }; drawSources(); recentWarming = d?.q === 'warming'; renderStats(recentWarming ? { q: 'warming' } : d?.stats); recentUsable = Array.isArray(d?.items); if (recentUsable) { if (meta.at !== recentAt) pages.clear(); pages.set('', d); recentAt = meta.at; } else pages.clear();
    redrawRecent(); if (recentUsable) firstRecent = false; else if (d != null) recentRead.done(false); L.lightUp([$('recent')]);
  }, link(s) {
    const offlineChanged = !!recentState?.offline !== !!s.offline; recentState = s;
    if (offlineChanged && s.data?.stats) renderStats(s.data.stats);
    if (!s.offline && [404, 503].includes(s.meta?.status) && !s.data) { if (!activeChats && (!homeChats || homeChats.q === 'unknown')) { missing('对话暂时读不到', true); heroRead.done(); activeRead.done(); } renderStats(null, true); redrawRecent(); }
    if (s.offline) { if (!recentUsable) renderStats(null); if (homeChats || activeChats) render(homeChats, homeAt); else missing(U.collectionText()); redrawRecent(); } const usable = Array.isArray(s.data?.items);
    if (usable !== recentUsable) { recentUsable = usable; redrawRecent(); }
    U.blockNote($('recent'), s);
  } });
  function nextRecentCursor() {
    const cursor = [...pages.values()].at(-1)?.next;
    return cursor == null || pages.has(cursor) ? null : cursor;
  }
  $('recent-next').addEventListener('click', async () => {
    const button = $('recent-next'), cursor = nextRecentCursor(), firstPage = pages.get(''); if (cursor == null) return;
    button.disabled = true; U.html(button, '正在读…', false);
    try { const r = await window.Live.get('chats', { window: '72h', cursor });
      if (firstPage !== pages.get('') || r.meta?.viewer?.kind !== viewer) return;
      if (Array.isArray(r.data?.items) && r.meta.at === recentAt) { pages.set(cursor, r.data); redrawRecent(); }
      else U.html(button, U.fieldHtml(r.warming ? '正在读' : r.text || U.collectionText(), { name: '继续读', place: 'button', kind: viewer }));
    } finally { button.disabled = false; if (button.textContent === '正在读…') U.html(button, '继续读 ›', false); }
  });
  U.draw10?.mount({ row: chat, readViewer });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

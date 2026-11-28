// 第二层：上半截总的情况和统计；下半截第一排“在干｜等你”并排（别的状态有对话才出来，补到矮的那栏），旧回包在下面整行回看近 72 小时。
// 在干、等你每栏先 5 张；回看每组先露一整排；其余展开；点名字或“看完整对话”进入详情。
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
  const recentTitle = '<b>近 72 小时回看</b>';
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
    if (toggle) {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      const set = () => toggle.setAttribute('aria-expanded', String(!open));
      if (open) U.anchorFold(toggle, set); else set();
    }
    const btn = e.target.closest('[data-helpers-more]');
    if (!btn) return;
    const later = [...btn.closest('.helpers').querySelectorAll(':scope > .helper[hidden]')];
    later.slice(0, 5).forEach(li => li.hidden = false);
    const left = later.length - 5;
    if (left > 0) btn.textContent = helperButton(left, false);
    else btn.closest('li').remove();
  });
  const bar = U.topbar({ ask: () => `请看实况 AI 对话：${$('head').textContent}。请说明各段对话现在的情况。` });
  L.add($('hero')); U.fold($('recent-more'), $('recent-box'), null, true);
  document.querySelectorAll('#active > .part, #recent > .part').forEach(el => el.setAttribute('data-keep', ''));
  const heroRead = U.reading($('hero').querySelector('.card__body'), { ghost: U.ghost.card(1), name: 'AI 对话' });
  const activeRead0 = U.reading($('active'), { ghost: U.ghost.rows(3), slow: false }), recentRead = U.reading($('recent'), { ghost: U.ghost.rows(4) });
  // 在干的列表不在卡里：电脑连不上又没存下来时，页头卡已经写了“这块没存下来”，这一栏整栏先收起，不在卡外再写一遍、也不留没字的空卡（r83 返修）
  const activeRead = { set(s) { const gone = !!s?.offline && s.data == null; $('active').hidden = gone; if (gone) activeRead0.done(false); else activeRead0.set(s); },
    done(...a) { $('active').hidden = false; return activeRead0.done(...a); }, get phase() { return activeRead0.phase; } };
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
  // 加绿（GREENIMG1126）：历时、帮手数、第几步的数字套一层 chat-green，只在在干、等你两栏里变绿（样式在 index.html）
  // 小药丸是 inline-flex，数字前后的普通空格会被吞掉（“帮手53个”），换成不断行空格
  const greenNum = s => s.replace(/(\s?)(\d+)(\s?)/, (m, a, n, b) => `${a ? '&nbsp;' : ''}<span class="chat-green">${n}</span>${b ? '&nbsp;' : ''}`);
  const helperPeople = helpers => helpers.reduce((sum, h) => sum + (h.private_count || 1), 0);
  function helperLabel(c, helpers) {
    const exact = c.helper_counts?.total ?? c.helpers?.total;
    if (knownCount(exact)) return exact ? `帮手 ${exact} 个` : '';
    const active = helperPeople(helpers);
    if (Array.isArray(c.helpers) || Array.isArray(c.helpers?.items)) return active ? `帮手 ${active} 个` : '';
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
  // —— M915 第一批：后台回包带 board（四栏、三家额度、页头数）时照设计第 3–5 节摆；没有 board 的旧回包照旧 ——
  const { KINDS, peopleIn, totalOf, listedOf, earlierCount, bySortAt, statusKind, dayClock, ownerWords, withdrawal, quotaWindow, quotaRecovery, sortVerb, helperList } = U.chatFields;
  // 在干和状态不明的分界照后台 live_chat_board.py 的 status_fields：这一轮没结束、离最后一条记录不到 2 小时算在干（30 分钟起在原因里写“已经 N 分钟没动静”），
  // 满 2 小时还没有这一轮的结束记录就标状态不明、进“停下了，没归档”（M928 机制写清；数字改了要跟着改）
  // 按需更新快核（M928）核法：E:/PCConfig/tools/remote-computer-mcp/live_chat_board.py 的 status_fields 查 idle 与 timedelta(hours=2) 的比较，现满 2 小时无新记录且没结束记录转为状态不明；变了改这句
  const IDLE_LIMIT = '2 小时';
  const UNKNOWN_RULE = `在干的对话超过 ${IDLE_LIMIT}没新记录、也没有这一轮的结束记录，就标状态不明，挪到“停下了，没归档”；读不到记录的也标这个，原因写在各行`;
  // 行首：排序用的时刻（后台 sort_at）＋这一类的动词（“起在做”“问你”“停下”“归档”）；没有时刻写“时刻没读到”（这一行已排在栏底）
  function whenCell(c) {
    const at = c.sort_at, ok = Number.isFinite(Date.parse(at));
    const day = ok && U.date(at) !== U.date(Date.now()) ? U.date(at) + ' ' : '';
    return ok ? `<span class="chat-when"><b>${esc(U.time(at))}</b><small>${esc(day + ownerWords(sortVerb(c), viewer))}</small></span>`
      : '<span class="chat-when chat-when--none"><small>时刻没读到</small></span>';
  }
  function statusPill(c, label = boardRowState(c)) {
    const kind = statusKind(c), k = KINDS[kind] || KINDS.unknown;
    const mark = kind === 'archived' ? `${window.LiveBoard.icon('check', 'chat-status__ico')}` : '';
    return `<span class="chat-status" data-tone="${k.tone}"${kind === 'running' ? ' data-breathe' : ''}${kind === 'unknown' ? ` title="${esc(UNKNOWN_RULE)}"` : ''}>${mark}${esc(label)}</span>`;
  }
  // 标签下面的小字：后台给的原因（“Codex 不记是谁按的停止”“实况读不到 Antigravity 的归档”这类），状态旧了 2 分钟以上加“状态是 16:40 读的”
  function statusReason(c, extra = '') {
    const words = c.status_reason != null ? U.fieldText(c.status_reason, viewer).trim() : '';
    const seen = Date.parse(c.status_observed_at), asOf = Date.parse(boardOf()?.as_of);
    const old = Number.isFinite(seen) && Number.isFinite(asOf) && asOf - seen > 120000 ? `状态是 ${dayClock(c.status_observed_at)} 读的` : '';
    const reason = words && words !== rowState(c, viewer) ? esc(words) : '';
    const text = [extra, reason, esc(old)].filter(Boolean).join(' · ');
    return text ? `<p class="row__sub chat-reason">${text}</p>` : '';
  }
  function chatTitle(c, keepArrow = false) {
    const name = field(c.title, c), marked = name.hidden || viewer === 'public' && name.visibility === 'owner' || name.rewrite === 'pending' && !name.text;
    const displayName = typeof name.text === 'string' ? { ...name, value: plain(name.text), text: plain(name.text) } : name;
    const titleHtml = contentLocked(c, viewer) ? '仅本人可见' : U.fieldHtml(name.text || marked ? displayName : '无标题', { name: '对话', place: 'title', kind: viewer });
    const href = c.detail ? detailHref(c.id) : '';
    const arrow = '<span class="more__chev" aria-hidden="true">›</span>';
    // 等待栏较窄，末字（也可能是转义后的字符）和箭头一起换行。
    const linkedTitle = keepArrow && titleHtml.trim()
      ? titleHtml.replace(/(?:&[\w#]+;|\S\p{M}*)\s*$/u, tail => `<span class="live-unit">${tail} ${arrow}</span>`)
      : `${titleHtml} ${arrow}`;
    const title = href ? `<a class="row__title" href="${href}">${linkedTitle}</a>`
      : titleHtml ? `<span class="row__title">${titleHtml}</span>` : '';
    return { name, marked, title, href };
  }
  function chat(c, at, completed = false, column = '') {
    if (c.private_count) return { key: c.key || c.id, cls: 'row row--flat row--empty', html: `<span></span><p class="row__sub">${U.privateSummary(c.private_count, { unit: '场对话' })}</p>` };
    if (c.q === 'warming') return { key: c.id, cls: 'row row--flat', html: '<div class="row__text"><p class="row__sub">正在准备</p></div>' };
    const locked = contentLocked(c, viewer), [startedAt, startLabel] = locked ? U.chatStart(c) : [];
    const e = c.estimate, actual = Object.hasOwn(c, 'worked_seconds') ? c.worked_seconds : Number.isFinite(e?.worked_min) ? Math.round(e.worked_min * 60) : null;
    // M915 四栏里（column 有值）：行首已经写了排序用的时刻和状态标签，停下、做完的行不再另写“已停止 · 11-25 14:57:03”
    const clock = Number.isFinite(Date.parse(c.at)) && !(column && (completed || /没动静/.test(rowState(c, viewer)))) && (completed ? `${c.state === 'ended_unknown' ? '最后活动 ' : ''}${U.date(c.at)} ${clockWithSeconds.format(new Date(c.at))}` : c.state === 'running' ? U.chatActivity(c, at) : `最后活动 ${stamp(c.at)}`);
    const stillWorking = !column && c.state === 'done' && workingHelpers(c);
    const activity = [stillWorking ? '对话已结束' : !column && completed && !U.chatFields.quota(c, viewer) && stateText(c), stillWorking && `后台帮手另在处理（${stillWorking} 个）`, clock].filter(Boolean).join(' · ');
    const timing = [Number.isFinite(c.elapsed_seconds) && `历时 ${duration(c.elapsed_seconds)}`, Number.isFinite(actual) && `实际工时 ${duration(actual)}`,
      e?.planned_min != null && `报 ${Math.round(e.planned_min)} 分钟`, Math.round(e?.over_min) > 0 && `超 ${Math.round(e.over_min)} 分钟`, startedAt && `${startLabel} ${stamp(startedAt)}`, activity].filter(Boolean).join(' · ');
    // 这一行不在一段中间折（R14-05 同类：“2 小时前在动”的“2”和“小时”也会拆开）：“·”隔开的每一段包进现有的 .live-unit，放不下时整段挪到下一行，只在“·”处折；
    // 在干、等你那格和停下、做完那行同一份；实况首页同一个办法
    const timingHtml = timing.split(' · ').map(part => `<span class="live-unit">${esc(part)}</span>`).join(' · ');
    const { name, marked, title, href } = chatTitle(c, column === 'waiting');
    // “访客看不到”小签只挂在标题那一行（同实况首页的事项、单场对话页），模型那一行不再重复挂一个（M692）
    const titleMark = locked || U.visitorHiddenMark(c, '这场对话', viewer) ? '' : (marked ? chatCell(name, '对话名', c) : viewer === 'owner' && name.visibility === 'owner' ? '' : U.visibilityNote(name, viewer, '对话名'));
    const waitLabel = !column && c.state === 'waiting' && stateText(c);
    const raw = locked ? null : U.chatProgressText(c.text ?? c.doing, c, viewer) ?? c.latest_reply, preview = U.chatPreviewSummary(raw, c, viewer);
    const repeatsStatus = (waitLabel || completed && !stillWorking) && U.chatFields.repeatsState(preview, c, viewer);
    const retry = c.state === 'reconnecting' && retryMessage(U.fieldText(preview, viewer));
    const snippet = chatCell(preview, '最新进展', c, 0, true, preview !== raw);   // 两版同一套（本人禁令 11-24 14:16）：两版都给全文
    const retryText = retry && chatCell({ ...field(preview, c), text: retry }, '最新进展', c, 0, true);
    // M684：本人版最新进展那句访客那边不一样的，句末挂签；整场对访客藏着的只在标题行挂一个。
    const previewTag = snippet && !U.visitorWholeHidden(c) ? U.visitorLabel(c, ['latest_reply', 'text', 'doing', 'progress'], '这句最新进展', viewer) : '';
    const latest = !snippet || repeatsStatus ? '' : previewTag ? `<p class="row__line">${retryText || snippet}${previewTag}</p>` : retryText && !c.detail
      ? `<details class="row__sub"><summary>${retryText}</summary><p style="overflow-wrap:anywhere">${snippet}</p></details>`
      : `<p class="row__line">${retryText || snippet}</p>`;
    const helpers = helperList(c);
    const { label, count, plan, current } = planInfo(c);
    const progress = locked ? (label || count) && `<span class="chat-pill">${esc(label || count)}</span>`
      : c.detail && plan[current] && label ? `<a class="chat-pill chat-pill--link" href="${detailHref(c.id, '#plan-box')}" aria-label="${label}，查看执行计划">${greenNum(label)} ›</a>` : '';
    const steps = !locked && progress ? `<span class="chat-steps" aria-hidden="true">${plan.map(p => `<i data-status="${esc(stepState(p) || '')}"></i>`).join('')}</span>` : '';
    const thoughtFull = locked ? '' : chatCell(c.thinking, '思考摘要', c, 0, true);
    const thoughtShort = thoughtFull;   // 两版同一套（本人禁令 11-24 14:16）：两版思考摘要都给全文
    const thought = thoughtFull ? `<div class="chat-think row__sub"${thoughtShort !== thoughtFull ? ' data-cut' : ''}>` +
      `<span class="chat-think__preview">思考摘要<span class="chat-think__excerpt">：${thoughtShort}</span></span>` +
      '<button class="more chat-think__toggle" type="button" aria-expanded="false"><span class="chat-think__open">展开摘要</span><span class="chat-think__shut">收起摘要</span> <span class="more__chev" aria-hidden="true">›</span></button>' +
      `<p class="chat-think__full">${thoughtFull}</p></div>` : '';
    // 帮手：在做和出错的先露前 5 个，其余收着按批看
    const busy = h => h.private_count || ['running', 'failed'].includes(h.state) || ['running', 'reconnecting', 'queued', 'quota_exhausted', 'login_failed', 'failed'].includes(h.status_kind);
    const helperFirst = [...helpers.filter(busy), ...(locked ? helpers.filter(h => !busy(h)) : [])].slice(0, 5);
    const helperRest = helpers.filter(h => !helperFirst.includes(h));
    const helperCount = helperLabel(c, helpers), origin = shownOrigin(c);
    const source = origin ? `<span class="chat-tag">${esc(origin)}</span>` : '';
    const attribution = [U.chatFields.appTag(c), who(c, 'body', true), source].filter(Boolean).join(' ');
    const modelLine = attribution ? `<span class="chat-model">${attribution}</span>` : '';
    const context = [modelLine, titleMark, timing && `<span data-steady>${timingHtml.replace(/^(<span class="live-unit">)?历时 (.+?)(?=<\/span>| · |$)/, '$1历时 <span class="chat-green">$2</span>')}</span>`].filter(Boolean).join('');
    const runningPreview = !Array.isArray(c.helpers) && !Array.isArray(c.helpers?.items);
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
    const reason = column ? statusReason(c) : '';
    return { key: c.id, cls: `row row--chat lb-item${column ? ' row--board' : ''}${attention(c) ? ' is-attention' : ''}${completed && params.get('source') === c.source ? ` source-${c.source}` : ''}`, html: `${column ? whenCell(c) : lamp(c)}<p class="row__main">${column ? statusPill(c) : ''}${title}${waitBadge}${progress}${helperCount ? `<span class="chat-pill">${greenNum(helperCount)}</span>` : ''}${U.draw10?.badge(c) || ''}${U.visitorHiddenMark(c, '这场对话', viewer)}</p>${detailAction}<div class="row__acts">${rowActions}</div><div class="row__text">${lockLine}${completed ? [modelLine, titleMark].filter(Boolean).map(value => `<p class="row__sub">${value}</p>`).join('') : context && `<p class="row__sub chat-context">${context}</p>`}${reason}${meta}${steps}${latest}${thought}${locked ? '' : U.draw10?.compactionDisclosure?.(c, viewer) || ''}${completed && timing ? `<p class="row__sub" data-steady>${timingHtml}</p>` : ''}${helpers.length ? `<ul class="helpers">${helperPreview}${[...helperFirst, ...helperRest].map((h, i) => { const later = i >= helperFirst.length ? ' hidden' : ''; return h.private_count ? `<li class="helper helper--sum"${later}>${U.visibilityNote({ visibility: 'owner', hidden_what: `其中 ${h.private_count} 个${groupedPreview ? '在干的' : ''}帮手` }, viewer)}</li>` : h.q === 'warming' ? `<li class="helper"${later}>正在准备</li>` : `<li class="helper"${later}><div><span class="helper__who" style="display:inline-flex;align-items:center;gap:8px">${lamp(h)}<span class="chat-tag">帮手</span>${who(h)}${U.visitorWholeHidden(c) ? '' : U.visitorHiddenMark(h, '这个帮手', viewer)}</span>${helperTitle(h, c) ? ` · ${helperTitle(h, c)}` : ''}${helperAt(h, at) ? ` · <span class="helper__at">${esc(helperAt(h, at))}</span>` : ''}${U.draw10?.helperDetailHtml?.(h, viewer) || ''}</div><span class="helper__at">${esc(stateText(h))}</span></li>`; }).join('')}${helperRest.length ? `<li class="helper helper--more"><button class="more" type="button" data-helpers-more>${helperButton(helperRest.length, !helperFirst.length)}</button></li>` : ''}</ul>` : ''}</div>` };
  }
  const stamp = at => `${U.date(at)} ${U.time(at)}`.trim();
  function readAt(at) {
    if (!Number.isFinite(new Date(at ?? NaN).getTime())) return '';
    const day = U.date(at), time = U.time(at);
    return `截至 ${[(!time || day !== U.date(Date.now())) && day, time].filter(Boolean).join(' ')}`;
  }
  let readingMerged = false;   // “同时在干”图头读数并进了图下那一句（见 drawReading）
  const chartHost = $('chat-concurrent');
  const concurrent = window.LiveChart.create(chartHost, { small: true, unit: '个', bridge: 0, insetEdgeDots: true, lines: [{ id: 'working', label: '同时在干', hue: 'teal' }],
    onRead([reading], pointedAt) {
      const cell = chartHost.querySelector('.chart__val b');
      if (!cell || !reading) return;
      cell.parentElement.style.display = pointedAt == null && readingMerged ? 'none' : '';
      if (reading.value == null) cell.textContent = '这一刻没读到';
      else if (Number.isFinite(reading.at)) cell.textContent = `${pointedAt == null ? (boardOf() ? `最近一次读数 ${dayClock(new Date(reading.at * 1000).toISOString())}` : readAt(reading.at * 1000)) : `所指记录 ${stamp(reading.at * 1000)}`} · ${reading.value} 个`;
    }
  });
  const daily = window.LiveViz.bars($('chat-days'), { stack: true, unit: '个', missingText: '还没读到', series: [{ id: 'claude', label: 'Claude', hue: 'apricot' }, { id: 'gpt', label: 'Codex', hue: 'teal' }, { id: 'antigravity', label: 'Antigravity', hue: 'violet' }] });
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
    if (!U.shouldFold(rows.length - keep, rows.at(-1).getBoundingClientRect().bottom - rows[keep - 1].getBoundingClientRect().bottom, more.offsetHeight)) { more.hidden = true; return; }
    rows.slice(keep).forEach(row => row.classList.add('is-extra'));
    more.querySelector('.chat-models-left').textContent = rows.length - keep;
  }
  if (typeof ResizeObserver === 'function') new ResizeObserver(() => fitModels()).observe($('chat-counts'));
  // LINK1125（本人 11-25 选 A）：“今天”“近 7 天”第一行后面接“· 干了 X 小时 ›”，只算对话和帮手、不含自动任务（和这页“不含定时和自动”一致），
  // 点了去智能体页“三家干了多少”、选同一时段；“今天”再接“· 自动任务另跑了 N 轮 ›”，点了去自动任务页只看今天。
  // 数取首页回包：agents.today.activity.periods.<today|d7>.total.by_activity（智能体页同一份）、automation.results_today.finished_runs（首页自动任务卡同一个数）。
  let homeFull = null;
  const hoursText = m => m <= 0 ? '0' : m < 3 ? '不到 0.1' : Math.round(m / 6) >= 1000 ? Math.round(m / 60).toLocaleString('zh-CN')
    : (Math.round(m / 6) / 10).toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  function statLinks() {
    document.querySelectorAll('#chat-counts [data-links]').forEach(host => {
      const key = host.dataset.links === 'today' ? 'today' : 'd7';
      const by = homeFull?.agents?.today?.activity?.periods?.[key]?.total?.by_activity;
      const parts = ['conversation', 'subagent'].map(k => by?.[k]?.actual_minutes), mins = parts.filter(Number.isFinite);
      // 对话、帮手两项只读到一项时不当成完整的“干了 X 小时”：写“至少”，并说哪一项没读到（缺数指出哪组）
      const short = mins.length === 1 ? `<small>（${Number.isFinite(parts[0]) ? '帮手' : '对话'}的没读到）</small>` : '';
      const runs = homeFull?.automation?.results_today?.finished_runs;
      const links = [mins.length && `<a class="chat-stat-link" href="${esc(route(`/live/agents/?hours=${key}#hours`))}">干了 ${short ? '至少 ' : ''}<strong>${hoursText(mins.reduce((a, b) => a + b, 0))}</strong><small>小时</small>${short} ›</a>`,
        key === 'today' && Number.isInteger(runs) && runs >= 0 && `<a class="chat-stat-link" href="${esc(route('/live/automation/?date=today'))}">自动任务另跑了 <strong>${runs}</strong><small>轮</small> ›</a>`].filter(Boolean);
      U.html(host, links.map(link => ` <span class="chat-stat-piece">· ${link}</span>`).join(''), false);
    });
  }
  // “同时在干”图下那一句。M915 board 模式：整页只有页头一个“截至”。这块读数旧了（比页头旧 2 分钟以上，或最后一个点之后一直没采到），
  // 照设计第 7 节把图头读数和图下合成一句：“最近一次读数 11-24 23:55 · 0 个，之后约 23 小时没采到；这块停在 11-25 23:07，比页面旧 78 分钟；
  // 近 7 个自然日共缺约 156 小时 · 原因”，原因只写一次（后台给了缺段原因用后台的，没给写“原因还没查到”），这时图头不再单写时刻；
  // 有修理入口（coverage_gaps[].repair_href）才带“已交自动修理 ›”。
  let lastCurrent = null;
  const lapse = ms => ms >= 5400000 ? `约 ${Math.round(ms / 3600000)} 小时` : ` ${Math.max(1, Math.round(ms / 60000))} 分钟`;
  function drawReading() {
    if (!lastCurrent) return;
    const { current, n } = lastCurrent, b = boardOf();
    const reading = $('chat-current-reading'), at = readAt(current?.at);
    const hasCurrent = Number.isFinite(current?.current), generic = current?.gap === '最近的对话记录已超过 120 秒';
    const behind = b && Number.isFinite(Date.parse(current?.at)) && Number.isFinite(Date.parse(b.as_of)) ? Math.floor((Date.parse(b.as_of) - Date.parse(current.at)) / 60000) : null;
    const stale = behind != null && behind >= 2;
    const currentText = hasCurrent && !(b && stale) ? n(current.current, current, 'current', U.offline?.() ? '断开前在干的主对话' : '此刻在干的主对话') + (at && !b ? ` · ${U.nowrap(at)}` : '') : '';
    let text = '';
    readingMerged = false;
    if (!b) {
      const gap = generic ? `此刻同时在干暂时读不到${at ? ' · 上次记录' + at : ''}` : current?.gap;
      text = [currentText, gap && U.fieldHtml(gap, { name: '统计说明', place: 'body' })].filter(Boolean).join(' · ');
    } else {
      const holes = Array.isArray(current?.coverage_gaps) ? current.coverage_gaps.filter(g => Number.isFinite(Date.parse(g?.from)) && Number.isFinite(Date.parse(g?.to))) : [];
      const lastHole = holes.reduce((a, g) => !a || Date.parse(g.to) > Date.parse(a.to) ? g : a, null);
      const holeMs = holes.reduce((sum, g) => sum + Math.max(0, Date.parse(g.to) - Date.parse(g.from)), 0);
      const points = current?.series?.[0]?.points, last = Array.isArray(points) ? points.findLast(p => Array.isArray(p) && Number.isFinite(p[0]) && p[1] != null) : null;
      const lastAt = last ? last[0] * 1000 : Date.parse(current?.last_confirmed_at);
      const trailing = lastHole && Number.isFinite(lastAt) && Date.parse(lastHole.from) >= lastAt - 60000 ? Date.parse(lastHole.to) - Date.parse(lastHole.from) : 0;
      readingMerged = stale || trailing >= 120000;
      const why = U.fieldText(lastHole?.reason) || (!generic && current?.gap ? U.fieldText(current.gap) : '') || '原因还没查到';
      const total = holes.length ? `${current.window?.label || '图上这段时间'}共缺${lapse(holeMs)}` : '';
      const sentence = readingMerged ? [[Number.isFinite(lastAt) && `最近一次读数 ${dayClock(new Date(lastAt).toISOString())}${last ? ` · ${last[1]} 个` : ''}`,
        trailing >= 120000 && `之后${lapse(trailing)}没采到`].filter(Boolean).join('，'), stale && `这块停在 ${dayClock(current.at)}，比页面旧${lapse(behind * 60000)}`, total].filter(Boolean).join('；')
        : total || (!generic && current?.gap ? U.fieldText(current.gap) : '');
      const repair = typeof lastHole?.repair_href === 'string' && lastHole.repair_href.startsWith('/live/') ? ` · <a class="more more--link" href="${esc(route(lastHole.repair_href))}">已交自动修理 ›</a>` : '';
      text = [currentText, sentence && esc(sentence + (readingMerged || total ? ` · ${why}` : '')) + (readingMerged || total ? repair : '')].filter(Boolean).join(' · ');
    }
    U.html(reading, text);
    reading.hidden = !text;
    const val = chartHost.querySelector('.chart__val'), cell = val?.querySelector('b');
    if (val) val.style.display = readingMerged ? 'none' : '';
    if (b && cell) cell.textContent = cell.textContent.replace(/^截至 /, '最近一次读数 ');
  }
  function renderStats(stats, unavailable = '') {
    const current = stats?.concurrent, { from, to } = current?.window ?? current ?? {}, peak = current?.peak;
    const plots = $('chat-counts').parentElement.querySelector('.chat-plots'); plots.style.display = stats ? '' : 'none';
    $('chat-end-date').textContent = [Number.isFinite(peak?.count) && `峰值 ${peak.count} 个${peak.at ? ` · ${stamp(peak.at)}` : ''}`,
      to && (current?.window?.from ? `${U.date(from)} 至 ${U.date(to)}` : U.date(to))].filter(Boolean).join(' · ');
    if (!stats || stats.q === 'warming') {
      lastCurrent = null;
      plots.style.display = 'none';
      // 电脑连不上又没存下来：和页上别的空卡一个样子，写卡名“对话统计”加一句（r83 返修第二轮）
      if (!unavailable && stats?.q !== 'warming' && U.offline?.()) { $('chat-counts').dataset.read = 'gone'; U.html($('chat-counts'), '<div class="fog"><p class="card__head fog__head"><span class="lamp" aria-hidden="true"></span><span class="head__lead fog__name">对话统计</span></p><p class="fog__say">这块没存下来，连上后补上。</p></div>'); return; }
      delete $('chat-counts').dataset.read;
      U.html($('chat-counts'), `<p class="row__sub">${unavailable ? esc(unavailable) : stats?.q === 'warming' ? '正在准备' : U.collectionText()}</p>`); return;
    }
    delete $('chat-counts').dataset.read;
    function n(v, d, key, label) {
      if (d?.q === 'warming') return '<span class="row__sub">正在准备</span>';
      if (!Number.isFinite(v)) return `<span class="row__sub">${v != null ? U.fieldHtml(v, { name: label, place: 'body' }) : U.offline?.() ? '—' : esc(U.collectionText(label, d || stats))}</span>`;
      const text = U.collectionText('', { ...d, lower_bound: [d?.lower_bound, d?.at_least, d?.isPartial].includes(true) }, v, key);
      if (text === '至少 0') return `${label} <span class="row__sub">暂无已确认记录</span>`;
      const prefix = key === 'manual_opened' && text.startsWith('至少 ') ? '至少 ' : '';
      return `${label} ${prefix}<strong>${U.fieldHtml(text.slice(prefix.length), { name: label, place: 'body' })}</strong>${key === 'manual_opened' ? ' 个' : ''}`;
    }
    lastCurrent = { current, n };
    drawReading();
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
        // 别家的型号在 Antigravity 里跑的那行（例：Claude Opus 5.5）后面写“（Antigravity 里用）”，和本家那行分得清（主持 11-26 06:4x 定，照交回第 2 题 A）
        const viaAg = m.vendor === 'antigravity' && !/^Gemini/i.test(String(U.draw10?.modelName?.(m) ?? m.model ?? '')) ? '（Antigravity 里用）' : '';
        const model = (U.draw10?.modelHtml(m, { name: '型号', place: 'body', kind: viewer }) ?? U.fieldHtml(m.model, { name: '型号', place: 'body' })) + (viaAg && (m.model || m.model_text) ? viaAg : '');
        const counts = `${n(m.opened, m, 'opened', '对话')} · ${n(m.helpers, m, 'helpers', '帮手')}`;
        return `<p class="chat-model-row"><small>${model || '型号没记下'} · ${counts}${m.gap && !modelGap ? ' · ' + gapHtml(m.gap) : ''}</small></p>`;
      };
      const open = $('chat-counts').querySelector(`details[data-models="${key}"]`)?.open;
      const modelList = models ? models.map(modelRow).join('')
        + `<details class="chat-models-more" data-fold-anchor data-models="${key}"${open ? ' open' : ''} hidden><summary class="more live-disclosure"><span class="disclosure-closed">展开（还有 <span class="chat-models-left">0</span> 个型号）</span><span class="disclosure-open">收起</span> <span class="more__chev" aria-hidden="true">›</span></summary></details>`
        : `<p class="row__sub">${esc(U.collectionText('各型号', stats))}</p>`;
      const notes = [...new Set([d?.gap, modelGap].filter(Boolean))].map(gap => `<p><small>${gapHtml(gap)}</small></p>`).join('');
      return `<div><h2>${label}</h2><p>${n(d?.opened, sure(d), 'opened', '对话')} · ${n(d?.helpers, d, 'helpers', '帮手')} <small>${n(d?.manual_opened, d, 'manual_opened', '本人对话')}</small><span class="chat-stat-links" data-links="${key}"></span></p>${notes}${modelList}</div>`;
    }).join('');
    U.html($('chat-counts'), counts);
    statLinks();
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
  let listWithdrawal = '';
  const pages = new Map();
  function newerReading(primary, other, time) {
    if (!primary) return other;
    return other && (Date.parse(time(other)) || 0) > (Date.parse(time(primary)) || 0) ? other : primary;
  }
  const listTime = reading => reading.source_at ?? reading.at ?? (reading === activeChats ? activeAt : homeAt);
  const currentList = home => listWithdrawal ? null : newerReading(activeChats, Array.isArray(home?.active) || !activeChats ? home : null, listTime);
  let homeSources, recentSources;
  function drawSources() {
    const record = [homeSources, recentSources].find(r => r?.viewer === viewer && r.data && Object.hasOwn(r.data, 'unconnected_source_count'));
    U.html($('chat-sources'), U.draw10.sourceHtml(record?.data, viewer), false);
  }
  function readViewer(meta) {
    const next = meta.viewer?.kind || 'public';
    if (next !== viewer) {
      listWithdrawal = '';
      homeChats = activeChats = baseBoard = fullBoard = fullBoardStatus = null; recentUsable = false; pages.clear(); archivedPages.clear();
      pinRows = []; $('chat-pins').hidden = true; U.html($('chat-pins'), '');
      document.querySelectorAll('.chat-board ul.rows, #chat-done30 ul').forEach(ul => ul.replaceChildren());
    }
    viewer = next;
  }
  function chatCount(d, key, observed) {
    if (Number.isFinite(d?.[key])) {
      const text = U.collectionText('', d, d[key], key);
      if (text !== '至少 0') return `${text} 个`;
    }
    return observed > 0 ? `至少 ${observed} 个` : '';
  }
  function recentEvidence() {
    const pack = recentUsable ? pages.get('') : listWithdrawal ? null : Array.isArray(activeChats?.recent) ? activeChats : homeChats;
    const list = recentUsable ? [...pages.values()].flatMap(p => p.items) : pack?.recent;
    const rows = list == null ? null : [...new Map(list.map(c => [c.id ?? c.key, c])).values()];
    const count = peopleIn(rows), key = recentUsable ? 'total' : 'recent_total';
    const at = pack?.window?.to ?? pack?.at ?? (recentUsable ? recentAt : pack === activeChats ? activeAt : homeAt);
    return { rows, count, at, total: pack?.[key], label: chatCount(pack, key, count) };
  }
  function renderHeading(d) {
    if (listWithdrawal) { missing(listWithdrawal, true); heroRead.done(false); return true; }
    const board = boardOf();
    const temporary = !board && d?.q === 'unknown' && !U.offline?.() && [404, 503].includes(recentState?.meta?.status);
    if (temporary) missing('对话暂时读不到', true);
    else if (board) {
      const reading = (board === fullBoard ? fullBoardStatus : board === baseBoard ? activeChats : homeChats) ?? d;
      const status = { ...reading, level: reading?.header_level ?? reading?.level };
      U.html($('head'), U.status(status).lamp + U.head('AI 对话', { lamp: false }));
      boardHeading(board);
      L.tone($('hero'), status);
    } else if (d?.q === 'warming') {
      U.html($('head'), U.head('AI 对话', { lamp: false }));
      U.html($('chat-note'), '<span class="row__sub">正在准备</span>');
      L.tone($('hero'), 'none');
    } else if (d) {
      const status = { ...d, level: d.header_level ?? d.level };
      U.html($('head'), U.status(status).lamp + U.head('AI 对话', { lamp: false }));
      const current = (key, label) => {
        const listed = peopleIn(d.active?.filter(c => c.state === key));
        // 后台的件数只算最近一次快读又确认过的（离最新一次 2 分钟内；快读每轮只轮到 4 场），列表还留着上次读到、这次没核对到的那几场；
        // 那几场上次读到时状态就是这一栏的状态，现在还是不是说不准：照实说“上次还在干、这次没核对到”，不替它说已停
        const earlier = earlierCount(d.active, key, d[key]);
        if (earlier) return `${d[key]} 个${label}（另 ${earlier} 个上次还${key === 'waiting' ? '在等' : '在干'}，这次没核对到）`;
        const count = chatCount(d, key, listed);
        return count && count + label;
      };
      const running = current('running', U.isStale(d) || U.offline?.() ? '当时在干' : '在干');
      const waiting = current('waiting', viewer === 'public' ? '等本人回答' : '等你回答');
      const done = chatCount(d, 'done72', 0), active = [running, waiting].filter(Boolean).join(' · ');
      const seen = readAt(listTime(d)), cutoff = readAt(d.window?.to ?? d.at ?? (d === activeChats ? activeAt : homeAt));
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
    const list = currentList(d), temporary = renderHeading(list);
    board.el.hidden = !!listWithdrawal;
    if (listWithdrawal) { activeRead.done(false); return; }
    if (boardOf()) { drawBoard(boardOf()); U.land(); activeRead.done(); return; }
    if (!list) return;
    if (list.q === 'warming') U.list($('active-list'), wait('正在准备'));
    else if (!temporary || activeChats) {
      const none = list.active?.length || list.hidden ? null : list.active == null || list.q === 'unknown' ? U.collectionText() : U.offline?.() ? '断开前没有在干或等着的对话' : '没有在干或等着的对话';
      drawActive(list, listTime(list) ?? at, none);
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
      if (!card.bound) { card.bound = true; U.fold(card.more, card.box, null, true); }
      const rows = list.map(c => chat(c, at)), count = peopleIn(list);
      const cut = U.shouldFold(rows.length - 5) ? 5 : rows.length;
      const main = rows.slice(0, cut), rest = rows.slice(cut), restCount = rest.reduce((n, r, i) => n + (list[i + cut]?.private_count || 1), 0);
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
  // —— M915：四栏（在干｜等你，下面整行“停下了，没归档”“做完了 · 已归档”），数据是同一次读到的 board ——
  // 后台：GET chats 的 board = { as_of, columns: { working, waiting, stopped, archived: { items, total, next } }, quota_exhausted, helpers_working, quotas, automation, source_gaps }；
  // 归档往下翻 GET chats?window=72h&state=archived&cursor=<next> 回 { items, total, next, as_of }。首页 chats.board 同口径。
  let baseBoard = null, fullBoard = null, fullBoardStatus = null, quotaPick = null, stoppedCard = null;
  const archivedPages = new Map();
  function readBoard(d) {
    const b = d?.board;
    if (!b?.columns || typeof b.columns !== 'object') return null;
    if (!Array.isArray(b.quotas)) return b;
    const rows = [...b.columns.working?.items || [], ...b.pinned || []];
    // 同一额度窗口的结构化恢复时间打架，两处都不报时刻。
    const quotas = b.quotas.map(q => {
      const at = Date.parse(q?.reset_at);
      const conflict = q?.window && Number.isFinite(at) && rows.some(c => c.software === q.software && c.quota_window === q.window &&
        statusKind(c) === 'quota_exhausted' && Number.isFinite(Date.parse(c.quota_reset_at)) && Date.parse(c.quota_reset_at) !== at);
      return conflict ? { ...q, reset_at: null } : q;
    });
    return { ...b, quotas };
  }
  function boardOf() {
    if (listWithdrawal) return null;
    if (!baseBoard) return fullBoard || readBoard(homeChats);
    // 页眉和完整首页可能先后送数。只有明细覆盖相同的首页包才替换专用清单。
    const hasRows = fullBoard && Object.keys(baseBoard.columns).every(key =>
      !Array.isArray(baseBoard.columns[key]?.items) || Array.isArray(fullBoard.columns[key]?.items));
    return newerReading(baseBoard, hasRows ? fullBoard : null, board => board.as_of);
  }
  function boardRowState(c) {
    const q = statusKind(c) === 'quota_exhausted' && boardOf()?.quotas?.find(row => row?.software === c.software);
    return rowState(q?.state === 'denied' && q.window && q.window === c.quota_window ? { ...c, quota_reset_at: q.reset_at } : c, viewer);
  }
  const BOARD = {
    working: { name: '在干', about: '按进入这一类的时刻，新的在上' },
    waiting: { name: '等你', about: '要你回答或选一下才能接着做' },
    stopped: { name: '停下了，没归档', about: `没归档就不算做完：接着做，或者归档。“状态不明”：${UNKNOWN_RULE}` },
    archived: { name: '做完了 · 已归档', about: '' },
  };
  const colName = key => key === 'waiting' && viewer === 'public' ? '等本人' : BOARD[key].name;
  // 额度条点了哪一家：在干、等你两栏只看被它卡住的（额度用完、过了预计恢复点，或后台标了 quota_affected 的）
  const stuckBy = (c, soft) => String(c.software || /^(claude|codex|antigravity):/i.exec(c.id)?.[1] || '').toLowerCase() === soft &&
    (['quota_exhausted', 'quota_overdue'].includes(statusKind(c)) || !!c.quota_affected);
  function boardHeading(b) {
    const cols = b.columns || {}, num = key => {
      const n = totalOf(cols[key]), listed = listedOf(cols[key]);
      return (n ?? '没读到') + (listed > (n ?? 0) ? `（清单列出 ${listed} 场）` : '');
    };
    const quota = Number.isInteger(b.quota_exhausted) && b.quota_exhausted > 0 ? `（其中额度用完 ${b.quota_exhausted}）` : '';
    const waitingN = totalOf(cols.waiting), waiting = `${colName('waiting')} ${num('waiting')}`;
    const asOf = Number.isFinite(Date.parse(b.as_of)) ? `截至 ${[U.date(b.as_of) !== U.date(Date.now()) && U.date(b.as_of), clockWithSeconds.format(new Date(b.as_of))].filter(Boolean).join(' ')}` : '';
    const pieces = [esc(`在干 ${num('working')}${quota}`), waitingN > 0 ? `<b class="chat-head-wait">${esc(waiting)}</b>` : esc(waiting),
      esc(`停下没归档 ${num('stopped')}`), esc(`近 72 小时做完 ${num('archived')}`), asOf && esc(asOf)].filter(Boolean).map(x => `<span class="chat-head-piece">${x}</span>`);
    U.html($('chat-note'), pieces.join(' · '), false);
    heroRead.done();
  }
  // 三家额度条：每格写“没有额度用完的记录”或“额度用完 · 5 小时额度 · 预计 19:00 恢复 · 卡住 3 场对话、1 个自动任务 ›”，读不到写“没读到”和原因。
  // 不写“正常”，不写剩多少（设计第 4 节第 2 条）。
  const SOFT = [['claude', 'Claude'], ['codex', 'Codex'], ['antigravity', 'Antigravity']];
  let pinRows = [], refreshHistory, pinsOffline;
  const isPinned = c => pinRows.some(p => p.id === c.id);
  function drawPins(b) {
    const host = $('chat-pins'), sources = b?.pin_sources;
    const pins = Array.isArray(b?.pinned) ? b.pinned : [];
    pinRows = bySortAt(pins).filter(c => c.pinned === true && c.id && SOFT.some(([id]) => id === c.software));
    const complete = id => Array.isArray(b?.pinned) && sources?.[id] === true && !U.offline?.();
    const allRead = SOFT.every(([id]) => complete(id));
    const retry = '这次没读到，下一轮自动再读';
    const short = { quota_exhausted: '额度用完', waiting_owner: viewer === 'public' ? '等本人' : '等你', archived: '做完' };
    const rows = (id, name) => {
      const group = pinRows.filter(c => c.software === id);
      const cards = group.map(c => {
        const word = boardRowState(c), label = short[statusKind(c)] || word;
        const note = [who(c, 'body', true), label !== word && esc(word), dayClock(c.sort_at) && esc(`${dayClock(c.sort_at)} ${ownerWords(sortVerb(c), viewer)}`)].filter(Boolean).join(' · ');
        return `<li>${statusPill(c, label)}<div>${chatTitle(c).title}${statusReason(c, note)}</div></li>`;
      });
      return `<div data-pin-source="${id}"><h3>${name}</h3>${cards.length ? `<ul>${cards.join('')}</ul>` : ''}${!complete(id) || !cards.length ? `<p>${complete(id) ? '现在没有置顶的对话' : cards.length ? '这次没读全，下一轮自动再读' : retry}</p>` : ''}</div>`;
    };
    const full = pinRows.length > 0 || !allRead && SOFT.some(([id]) => complete(id));
    const whoPinned = viewer === 'public' ? '本人' : '你';
    const note = pinRows.length ? '下面各栏不再重复列这几场'
      : allRead ? `现在没有置顶的对话。${whoPinned}在 Claude、Codex 或 Antigravity 置顶一场，就会出现在这里。` : retry;
    U.html(host, `<header><h2>置顶</h2>${pinRows.length ? `<small>${pinRows.length} 场</small>` : ''}<p>${note}</p></header>${full ? `<div class="chat-pins__grid">${SOFT.map(([id, name]) => rows(id, name)).join('')}</div>` : ''}`, false);
    host.hidden = false;
    refreshHistory?.(viewer);
  }
  function drawQuota(b) {
    let host = $('chat-quota');
    const quotas = Array.isArray(b.quotas) ? Object.fromEntries(b.quotas.filter(q => q && typeof q.software === 'string').map(q => [q.software, q])) : null;
    if (!quotas) { if (host) host.hidden = true; return; }
    if (!host) { host = Object.assign(document.createElement('section'), { id: 'chat-quota', className: 'chat-quota' }); host.setAttribute('aria-label', '三家额度'); $('chat-pins').after(host); }
    host.hidden = false;
    const quotaText = parts => `<span class="chat-quota__text">${parts.map(part => `<span class="live-unit">· ${part}</span>`).join(' ')}</span>`;
    const cells = SOFT.map(([id, name]) => {
      const q = quotas[id] || {}, state = ['denied', 'no_denial', 'unknown'].includes(q.state) ? q.state : 'unknown';
      if (state === 'no_denial') return `<div class="chat-quota__cell" data-state="ok"><span class="chat-quota__dot"></span><b>${name}</b>${quotaText(['没有额度用完的记录'])}</div>`;
      if (state === 'unknown') {
        const why = U.fieldText(q.reason, viewer).trim();
        return `<div class="chat-quota__cell" data-state="unknown"><span class="chat-quota__dot"></span><b>${name}</b>${quotaText(['没读到', ...(why || '后台没给原因').split(' · ').map(esc)])}</div>`;
      }
      const stuck = [Number.isInteger(q.chat_count) && q.chat_count > 0 && `${q.chat_count} 场对话`, Number.isInteger(q.automation_count) && q.automation_count > 0 && `${q.automation_count} 个自动任务`].filter(Boolean);
      const words = ['额度用完', quotaWindow(q.window), quotaRecovery(q.reset_at), stuck.length && `卡住 ${stuck.join('、')}`].filter(Boolean);
      const body = `<span class="chat-quota__dot"></span><b>${name}</b>${quotaText([`<em>${words[0]}</em>`, ...words.slice(1).map(esc)])}`;
      return stuck.length ? `<button type="button" class="chat-quota__cell" data-state="denied" data-soft="${id}" aria-pressed="${quotaPick === id}">${body} <span class="more__chev" aria-hidden="true">›</span></button>`
        : `<div class="chat-quota__cell" data-state="denied">${body}</div>`;
    });
    U.html(host, cells.join(''), false);
  }
  document.addEventListener('click', e => {
    const cell = e.target.closest('.chat-quota__cell[data-soft]'), clear = e.target.closest('[data-quota-all]');
    if (!cell && !clear) return;
    quotaPick = clear || quotaPick === cell.dataset.soft ? null : cell.dataset.soft;
    const b = boardOf(); if (b) U.anchor(() => drawBoard(b));
    if (quotaPick) $('active').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  function stoppedColumn() {
    if (stoppedCard) return stoppedCard;
    stoppedCard = recentBoard.card('stopped', { icon: 'moon', tint: 'blue', art: 'queued', ids: { el: 'stopped' } });
    recentBoard.el.prepend(stoppedCard.el);
    stoppedCard.bound = true; U.fold(stoppedCard.more, stoppedCard.box, null, true);
    return stoppedCard;
  }
  // 已经往下读过的归档几批，名单更新（as_of 变了）后照旧留着接在后面，不退回第一批；同一场以新读到的为准，
  // 已经挪到别的栏、或已经出了近 72 小时的，从留着的几批里去掉
  function laterArchived(b) {
    const elsewhere = new Set(['working', 'waiting', 'stopped'].flatMap(k => Array.isArray(b.columns?.[k]?.items) ? b.columns[k].items.map(c => c.id ?? c.key) : []));
    const from = Date.parse(b.as_of) - 72 * 3600000;
    return [...archivedPages.values()].flatMap(p => p.items).filter(c => !elsewhere.has(c.id ?? c.key) && !(Date.parse(c.sort_at) < from));
  }
  function fillColumn(card, key, col, b) {
    const all = bySortAt([...(Array.isArray(col?.items) ? col.items : []), ...(key === 'archived' ? laterArchived(b) : [])]
      .filter((c, i, list) => list.findIndex(x => (x.id ?? x.key) === (c.id ?? c.key)) === i));
    const matched = quotaPick && (key === 'working' || key === 'waiting') ? all.filter(c => stuckBy(c, quotaPick)) : all;
    const picked = matched.filter(c => !isPinned(c));
    const total = totalOf(col), listed = peopleIn(all), moved = peopleIn(all.filter(isPinned)), completed = key === 'stopped' || key === 'archived';
    const rows = picked.map(c => chat(c, b.as_of, completed, key));
    const name = colName(key), extra = [];
    if (key === 'working' && Number.isInteger(b.helpers_working) && b.helpers_working > 0) extra.push(`另有帮手 ${b.helpers_working} 个在做`);
    if (total != null && total > listed) extra.push(`共 ${total} 场，已列出 ${listed} 场`);
    if (moved) extra.push(`其中 ${moved} 场见置顶`);
    if (listed > (total ?? 0)) extra.push(`清单列出 ${listed} 场，汇总${total == null ? '没读到' : `只读到 ${total} 场`}`);
    const about = key === 'waiting' && viewer === 'public' ? '要本人回答或选一下才能接着做' : BOARD[key].about;
    U.html(card.title, `<b>${esc(name)}</b><span class="lb-card__count chat-col-count${total == null ? ' is-none' : ''}">${esc(total == null ? '没读到' : String(total))}</span>`, false);
    const keepTogether = key === 'stopped' ? /\d+ 场|没归档|记录/g : /\d+ 场|没归档/g;
    U.html(card.sub, esc([about, ...extra].filter(Boolean).join(' · ')).replace(keepTogether, '<span class="live-unit">$&</span>'));
    const emptyWaiting = key === 'waiting' && total === 0 && !listed && !quotaPick;
    card.el.classList.toggle('lb-card--quiet', emptyWaiting);
    const pickNote = quotaPick && (key === 'working' || key === 'waiting') ? [{ key: 'quota-pick', cls: 'row row--flat row--empty chat-pick', html: `<span></span><p class="row__sub">只看被 ${esc(SOFT.find(([id]) => id === quotaPick)?.[1] || '')} 额度卡住的 · <button type="button" class="more" data-quota-all>看全部 ›</button></p>` }] : [];
    const noRows = !Array.isArray(col?.items) && total > 0;
    const none = matched.length > picked.length && !picked.length ? '这些对话已列在置顶区' : noRows ? '暂时只读到数量' : total === 0 ? (key === 'working' ? '现在没有在干的对话' : key === 'stopped' ? '没有停下没归档的对话' : key === 'archived' ? '近 72 小时没有归档的对话' : '')
      : total == null ? `这一栏没读到${b.source_gaps?.length ? '：' + [...new Set(b.source_gaps.map(g => [g.source, g.reason].filter(Boolean).join(' · ')))].join('；') : ''}` : quotaPick ? '这一栏没有被它卡住的对话' : '暂时只读到数量';
    const idle = emptyWaiting && [{ key: 'idle', cls: 'chat-idle', html: `<span class="chat-idle__mark">${window.LiveBoard.icon('check')}</span><b>${U.offline?.() ? '断开前' : '现在'}没有对话在等${viewer === 'public' ? '本人' : '你'}回复</b>` }];
    const cut = U.shouldFold(rows.length - 5) ? 5 : rows.length;
    const main = rows.slice(0, cut), rest = rows.slice(cut), restCount = picked.slice(cut).reduce((n, c) => n + (c.private_count || 1), 0);
    U.list(card.main, idle || [...pickNote, ...(main.length ? main : none ? wait(none) : [])]);
    U.list(card.rest, rest);
    const next = key === 'archived' ? nextArchived(col) : null;
    card.more.hidden = !rest.length && next == null;
    U.html(card.more, `<span class="lb-more__open">展开${restCount ? `（还有 ${restCount} 个）` : ''}</span><span class="lb-more__shut">收起</span> <span class="more__chev">›</span>`);
    if (card.next) { card.next.hidden = next == null; if (key === 'archived') U.html(card.next, '继续读 ›'); }
  }
  function nextArchived(col) {
    const cursor = [...archivedPages.values()].at(-1)?.next ?? col?.next;
    return cursor == null || archivedPages.has(cursor) ? null : cursor;
  }
  function drawBoard(b) {
    document.body.classList.add('chats-board');
    drawQuota(b);
    const cols = b.columns || {};
    for (const key of Object.keys(COLUMN)) if (key !== 'running' && key !== 'waiting') { const old = board.get(key); if (old) old.el.hidden = true; }   // 按状态临时冒出来的小卡取消（设计第 4 节第 3 条）
    runningCard.el.hidden = waitingCard.el.hidden = false;
    for (const card of [runningCard, waitingCard]) if (!card.bound) { card.bound = true; U.fold(card.more, card.box, null, true); }
    fillColumn(runningCard, 'working', cols.working, b);
    fillColumn(waitingCard, 'waiting', cols.waiting, b);
    const stopped = stoppedColumn(); stopped.el.hidden = false;
    fillColumn(stopped, 'stopped', cols.stopped, b);
    fillColumn(doneCard, 'archived', cols.archived, b);
    $('recent-note').textContent = '';
    drawBackground(lastAutomation);
    drawReading();
    board.el.querySelectorAll(':scope > .lb-card').forEach(el => { el.style.minHeight = ''; });
    board.layout(true); even(); recentBoard.layout(true); fitThoughts();
  }
  async function readArchived() {
    const b = boardOf(), kind = viewer, button = $('recent-next'), cursor = b && nextArchived(b.columns?.archived);
    if (cursor == null) return;
    button.disabled = true; U.html(button, '加载中', false);
    try {
      const r = await window.Live.get('chats', { window: '72h', state: 'archived', cursor });
      if (viewer !== kind || !boardOf() || r.meta?.viewer?.kind && r.meta.viewer.kind !== kind) return;
      // 读的时候名单更新了也照样接上（按编号去重），不让人再点一次（M915：读到第二页不能被更新冲掉）
      if (Array.isArray(r.data?.items)) { archivedPages.set(cursor, r.data); U.anchor(() => drawBoard(boardOf())); }
      else U.html(button, U.fieldHtml(r.warming ? '加载中' : r.text || U.collectionText(), { name: '继续读', place: 'button', kind: viewer }), false);
    } finally { button.disabled = false; if (button.textContent === '加载中') U.html(button, '继续读 ›', false); }
  }
  // 第一排两栏底边拉齐：矮的那栏最后一张卡拉长到和另一栏一样高；卡变高变矮（展开、来了新对话、换窗口宽）时重新拉（M534）
  const evenWatch = typeof ResizeObserver === 'function' ? new ResizeObserver(() => even()) : null, evenSeen = new WeakSet();
  function even() {
    const cards = [...board.el.children].filter(el => el.matches('.lb-card') && !el.hidden && !el.classList.contains('is-away'));
    // 四栏模式下“在干｜等你”并排时，两个栏头拉到一样高，两栏第一行对话从同一高度开始（在干栏头的说明比等你长）
    const heads = boardOf() ? [runningCard, waitingCard].map(card => card.el.querySelector(':scope > .lb-card__head')).filter(Boolean) : [];
    heads.forEach(head => { head.style.minHeight = ''; });
    if (heads.length === 2 && Math.abs(heads[0].getBoundingClientRect().top - heads[1].getBoundingClientRect().top) < 2) {
      const tall = Math.max(...heads.map(head => head.getBoundingClientRect().height));
      heads.forEach(head => { const css = getComputedStyle(head), extra = css.boxSizing === 'border-box' ? 0 : head.getBoundingClientRect().height - parseFloat(css.height); if (head.getBoundingClientRect().height < tall) head.style.minHeight = `${tall - extra}px`; });
    }
    cards.forEach(el => { el.style.minHeight = ''; if (!evenSeen.has(el)) { evenSeen.add(el); evenWatch?.observe(el); } });
    const height = [0, 0], last = [];
    for (const el of cards) { const k = Math.min(1, Math.max(0, (parseInt(el.style.gridColumn, 10) || 1) - 1)); height[k] += el.getBoundingClientRect().height + 22; last[k] = el; }
    const low = height[0] < height[1] ? 0 : 1, gap = Math.abs(height[0] - height[1]);
    if (last[0] && last[1] && gap >= 1) last[low].style.minHeight = `${last[low].getBoundingClientRect().height + gap}px`;
  }
  // 回看包含已结束和没读到结局的对话。每组先露一整排，多的进“展开”；换了窗口宽重新算（M534）
  let recentRows = new Map(), recentCols = 3;
  function fitRecent() {
    if (boardOf()) return;
    const list = $('recent-list'), more = $('recent-more'), open = $('recent-box').classList.contains('is-open');
    const rows = [...list.children].filter(li => recentRows.has(li.dataset.key));
    if (list.offsetWidth) recentCols = Math.max(1, getComputedStyle(list).gridTemplateColumns.split(' ').filter(Boolean).length);
    const hasFold = U.shouldFold(rows.length - recentCols);
    rows.forEach(li => li.classList.toggle('chat-ended-extra', hasFold && recentRows.get(li.dataset.key).i >= recentCols));
    const left = rows.filter(li => li.classList.contains('chat-ended-extra')).reduce((sum, li) => sum + recentRows.get(li.dataset.key).count, 0);
    more.hidden = !left && !open;
    U.html(more, `<span class="lb-more__open">展开（还有 ${left} 个）</span><span class="lb-more__shut">收起</span> <span class="more__chev">›</span>`);
  }
  $('recent-more').addEventListener('click', () => requestAnimationFrame(fitRecent));
  if (typeof ResizeObserver === 'function') new ResizeObserver(() => fitRecent()).observe($('recent-list'));
  function renderRecent() {
    const recentBoardData = boardOf();
    U.html($('recent-link'), recentBoardData ? '近 72 小时做完的 ›' : '近 72 小时回看 ›');
    if (recentBoardData) { $('recent').hidden = false; recentRead.done(); return; }
    const message = !recentUsable && withdrawal(recentState, '72 小时记录');
    if (message) {
      $('recent').hidden = false;
      U.html($('recent-title'), recentTitle); U.html($('recent-note'), '');
      U.list($('recent-list'), wait(message), { animate: false }); U.list($('recent-rest'), [], { animate: false });
      $('recent-more').hidden = $('recent-next').hidden = true; recentRead.done(false);
      return;
    }
    $('recent').hidden = !!U.offline?.() && !recentUsable && homeChats?.recent == null;
    if (!recentUsable && !homeChats?.recent?.length && !U.offline?.() && [404, 503].includes(recentState?.meta?.status)) { U.list($('recent-list'), wait('近 72 小时的回看暂时读不到')); U.list($('recent-rest'), []); $('recent-more').hidden = $('recent-next').hidden = true; recentRead.done(); return; }
    if (recentWarming) { U.list($('recent-list'), wait('正在准备')); U.list($('recent-rest'), []); $('recent-more').hidden = $('recent-next').hidden = true; recentRead.done(); return; }
    const { rows, at, total, count, label } = recentEvidence();
    const sections = [['done', '做完的', ['done']], ['interrupted', '没做完就停了', ['stopped', 'failed']],
      ['ended_unknown', '结局没读到', ['ended_unknown']]].map(([key, name, states]) => ({
      key, name, rows: (rows || []).filter(c => states.includes(c.state))
        .map(c => ({ ...chat(c, at, true), count: c.private_count || 1 })),
    }));
    const [done, stopped, unknown] = sections.map(group => group.rows.reduce((n, row) => n + row.count, 0));
    const ended = done + stopped;
    const full = count === total && ended + unknown === total && !label.startsWith('至少');
    const endedLabel = full || ended ? `已结束 ${full ? '' : '至少 '}${ended} 个` : label;
    // 每组先摆一整排，多的留在本组后面、点“展开”才露出来：组名只出一次，展开后仍按组、组里按时间排。
    const main = sections.flatMap(({ key, name, rows }) => rows.length ? [{ key: `ended:${key}`, cls: 'chat-ended-label',
      html: `<h3>${name}${key === 'ended_unknown' ? ` ${full ? '' : '至少 '}${unknown} 个` : ''}</h3>` },
      ...rows.map((row, i) => ({ ...row, i, cls: i < recentCols ? row.cls : `${row.cls} chat-ended-extra` }))] : []);
    recentRows = new Map(main.filter(row => row.count).map(row => [row.key, { count: row.count, i: row.i }]));
    U.html($('recent-title'), recentTitle + (endedLabel ? `<span class="lb-card__count">${esc(endedLabel)}</span>` : ''), false);
    U.list($('recent-list'), main.length ? main : wait(label === '0 个' ? '72 小时内没有可回看的对话'
      : label ? '暂时只读到数量' : recentState?.warming ? '加载中' : U.collectionText()));
    U.list($('recent-rest'), []);
    U.html($('recent-note'), esc([label && readAt(at), total != null && total > count ? `已列出 ${count} 个` : ''].filter(Boolean).join(' · ')) + (pages.get('')?.hidden ? ` ${U.hiddenMore?.(pages.get('').hidden, '场', pages.get('').hidden_what || '对话') || ''}` : ''));
    $('recent-next').hidden = nextRecentCursor() == null; U.html($('recent-next'), '继续读 ›');
    if (recentUsable) recentRead.done();
    recentBoard.layout(true);
    fitThoughts();
    fitRecent();
    U.land();
  }
  function missing(text, temporary = false) { U.html($('head'), U.head('AI 对话', { lamp: false })); U.html($('chat-note'), U.fieldHtml(text, { name: 'AI 对话', place: 'body', kind: viewer })); if (temporary) { $('head').querySelector('.lamp')?.setAttribute('data-tone', 'off'); L.tone($('hero'), 'off', 'off'); } if (!activeChats) U.list($('active-list'), U.offline?.() ? [] : wait(text)); }
  renderStats(null); missing('加载中'); U.list($('recent-list'), wait('加载中'));
  let first = true, activityMinute = null, homeOffline = false;
  // 这页不列后台的对话（本人定的）；后台自动任务这会儿在跑的，顶上另起一行“后台另有 N 个在跑 ›”，点了到自动任务页。
  // 个数和实况首页 AI 对话卡同一个读口、同一个数法：完整的 home 回包里的 automation；页头用的 home?view=header 不带 automation，读它就永远是 0（M740）
  // M915：board.automation 在时照设计第 6 节写“后台另有 2 个在跑 · 1 个额度用完停等 ›”；读 running、quota_exhausted（后台 00:04 定），null 是没读到，在跑数退回首页 automation
  let lastAutomation = null;
  function drawBackground(auto) {
    lastAutomation = auto;
    const own = boardOf()?.automation && typeof boardOf().automation === 'object' ? boardOf().automation : null;
    const n = U.offline?.() ? 0 : Number.isInteger(own?.running) ? own.running : Number.isInteger(auto?.running_total) ? auto.running_total : Array.isArray(auto?.running) ? auto.running.length : 0;
    const paused = own && !U.offline?.() && Number.isInteger(own.quota_exhausted) ? own.quota_exhausted : 0;
    const words = [n > 0 && `后台另有 ${n} 个在跑`, paused > 0 && `${paused} 个额度用完停等`].filter(Boolean).join(' · ');
    $('chat-background').hidden = !words; U.html($('chat-background'), words ? `<a class="chat-background" href="${esc(route(typeof own?.href === 'string' && own.href.startsWith('/live/') ? own.href : '/live/automation/'))}">${esc(words)} ›</a>` : '');
  }
  // M915 设计第 10 节：整页只有一个时刻。四栏在时，顶栏“HH:MM 读到”和页头“截至”都用四栏那一次读到的时刻（board.as_of）；
  // 断线、暂停公开时照旧由顶栏自己说“最后一份”
  let headerState = null;
  const setBar = (s = headerState) => {
    if (!s) return;
    headerState = s;
    const asOf = boardOf()?.as_of;
    bar?.set(!s.offline && !s.publicPaused && s.shownAt && Number.isFinite(Date.parse(asOf)) ? { ...s, shownAt: asOf } : s);
  };
  window.LiveHeader.watch(null, { phase(s) { if (!listWithdrawal && !homeChats && !activeChats) { heroRead.set(s); activeRead.set(s); } }, data(d, meta) {
    readViewer(meta); const draw = () => {
      homeChats = d?.chats || null; homeSources = { data: homeChats, viewer }; drawSources(); homeAt = meta.at;
      if (!homeChats && !activeChats) { missing(U.collectionText()); if (d != null) { heroRead.done(false); if (!activeChats) activeRead.done(false); } }
      render(homeChats, meta.at); renderRecent();
    };
    if (first) draw(); else U.anchor(draw); if (d?.chats) first = false; L.lightUp([$('hero'), $('active'), $('recent'), $('notices')]);
  }, link(s) {
    const minute = Math.floor(Date.parse(s.now) / 60000), offlineChanged = homeOffline !== !!s.offline; homeOffline = !!s.offline;
    if (homeChats && (offlineChanged || !s.offline && minute !== activityMinute)) { activityMinute = minute; U.anchor(() => render(homeChats, s.now)); }
    setBar(s); L.offline(s.offline);
    if (!listWithdrawal && !s.data && !activeChats && !boardOf()) missing(s.warming ? '加载中' : s.offline ? U.collectionText() : s.text || U.collectionText());
    U.blockNote($('hero').querySelector('.card__body'), s);
  } });
  window.Live.watch('home', null, { data(d, meta) {
    drawBackground(d?.automation); homeFull = d; statLinks(); fitModels();
    if (meta.viewer?.kind !== viewer) return;
    const before = boardOf();
    fullBoardStatus = d?.chats ?? null;
    fullBoard = readBoard(fullBoardStatus);
    if (boardOf() !== before) {
      setBar();
      U.anchor(() => { render(homeChats, meta.at); renderRecent(); });
    }
  } });
  window.Live.watch('chats', null, { phase(s) { if (!listWithdrawal && !activeChats && !homeChats?.active) activeRead.set(s); }, data(d, meta) {
    readViewer(meta);
    if (d) listWithdrawal = '';
    activeChats = Array.isArray(d?.active) ? d : null; activeAt = d?.at ?? meta.at;
    const nextBoard = readBoard(d);
    if (!nextBoard) archivedPages.clear();   // 名单更新（as_of 变了）时已读的后续几批照旧留着，见 laterArchived
    baseBoard = nextBoard;
    if (!meta.warming && d?.q !== 'warming') drawPins(baseBoard);
    setBar();
    if (homeChats || activeChats || baseBoard) U.anchor(() => { render(homeChats, activeAt); if (!recentUsable) renderRecent(); });
    L.lightUp([$('active')]);
  }, link(s) {
    const message = withdrawal(s, '对话列表');
    if (message && !listWithdrawal) {
      listWithdrawal = message;
      activeChats = baseBoard = null; archivedPages.clear();
      pinRows = []; U.html($('chat-pins'), ''); $('chat-pins').hidden = true;
      if ($('chat-quota')) { U.html($('chat-quota'), ''); $('chat-quota').hidden = true; }
      for (const host of [board.el, stoppedCard?.el, doneCard.el].filter(Boolean)) {
        host.querySelectorAll('ul.rows').forEach(ul => U.list(ul, [], { animate: false }));
        // 栏头和件数由同一次 U.html 管；清栏也更新标题的整段内容。
        host.querySelectorAll('.lb-card__sub, .lb-card__title').forEach(el => U.html(el, '', false));
      }
      U.html(doneCard.title, recentTitle, false);
      if (stoppedCard) stoppedCard.el.hidden = true;
      document.body.classList.remove('chats-board');
      U.html($('recent-note'), '');
      render(homeChats, homeAt); renderRecent();
    }
    if (listWithdrawal) return;
    if (!s.data && (s.offline || s.meta?.status >= 400 || ['none', 'gone'].includes(s.phase))) drawPins(null);
    else if (!$('chat-pins').hidden && s.offline !== pinsOffline) drawPins(baseBoard);
    pinsOffline = s.offline;
    U.blockNote($('active'), s);
  } });
  const redrawRecent = () => {
    const draw = () => { renderRecent(); renderHeading(currentList(homeChats)); };
    if (firstRecent) draw(); else U.anchor(draw);
  };
  window.Live.watch('chats', { window: '72h' }, { phase(s) { if (!recentUsable && !withdrawal(s)) recentRead.set(s); }, data(d, meta) {
    readViewer(meta); recentSources = { data: d, viewer }; drawSources(); recentWarming = d?.q === 'warming'; renderStats(recentWarming ? { q: 'warming' } : d?.stats); recentUsable = Array.isArray(d?.items); if (recentUsable) { if (meta.at !== recentAt) pages.clear(); pages.set('', d); recentAt = meta.at; } else pages.clear();
    redrawRecent(); if (recentUsable) firstRecent = false; else if (d != null) recentRead.done(false); L.lightUp([$('recent')]);
  }, link(s) {
    const previous = recentState; recentState = s;
    const message = withdrawal(s, '对话统计');
    if (message) {
      if (!withdrawal(previous)) { concurrent.wait(message); daily.set(null); }
      renderStats(null, message); redrawRecent(); return;
    }
    const offlineChanged = !!previous?.offline !== !!s.offline;
    if (withdrawal(previous) && s.data) redrawRecent();
    if (offlineChanged && s.data?.stats) renderStats(s.data.stats);
    if (!s.offline && [404, 503].includes(s.meta?.status) && !s.data) { if (!listWithdrawal && !activeChats && (!homeChats || homeChats.q === 'unknown')) { missing('对话暂时读不到', true); heroRead.done(); activeRead.done(); } renderStats(null, '对话统计暂时读不到'); redrawRecent(); }
    if (s.offline) { if (!recentUsable) renderStats(null); if (homeChats || activeChats || boardOf()) render(homeChats, homeAt); else missing(U.collectionText()); redrawRecent(); } const usable = Array.isArray(s.data?.items);
    if (usable !== recentUsable) { recentUsable = usable; redrawRecent(); }
    U.blockNote($('recent'), s);
  } });
  function nextRecentCursor() {
    const cursor = [...pages.values()].at(-1)?.next;
    return cursor == null || pages.has(cursor) ? null : cursor;
  }
  $('recent-next').addEventListener('click', async () => {
    if (boardOf()) return readArchived();
    const button = $('recent-next'), cursor = nextRecentCursor(), firstPage = pages.get(''); if (cursor == null) return;
    button.disabled = true; U.html(button, '加载中', false);
    try { const r = await window.Live.get('chats', { window: '72h', cursor });
      if (firstPage !== pages.get('') || r.meta?.viewer?.kind !== viewer) return;
      if (Array.isArray(r.data?.items) && r.meta.at === recentAt) { pages.set(cursor, r.data); redrawRecent(); }
      else U.html(button, U.fieldHtml(r.warming ? '加载中' : r.text || U.collectionText(), { name: '继续读', place: 'button', kind: viewer }));
    } finally { button.disabled = false; if (button.textContent === '加载中') U.html(button, '继续读 ›', false); }
  });
  refreshHistory = U.draw10?.mount({ row: chat, readViewer, isPinned });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

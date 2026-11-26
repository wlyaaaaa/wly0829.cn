// 第三层：一个 AI 对话的全过程，摆成共用模版“航线”（_lib/live-route.*，本人 11-17 20:15 点头的新模版）。
// 页头照旧：对话名、型号档位、走到第几步、干了多久、最新进展、问情况和打开对话；下面一条航线是计划各步，
// 再下面三栏：正在执行（当前这一步、正式摘要、最新回复）｜思考摘要 + 帮手（先列在做和出错的）｜过程记录（按时间，最近 10 条）。
// 字一律走 LiveUI.fieldHtml / fieldText；灯一律 LiveUI.status，没有灯字段不画；计划每步的状态只照数据（completed / in_progress，或旧的 state），没给不写。
(() => {
  'use strict';
  const marker = (v, kind, name = '内容') => v && (v.hidden || v.visibility || v.public || v.rewrite) ? window.LiveUI.fieldHtml({ text: kind === 'owner' ? '' : undefined, hidden: kind !== 'owner' && (v.hidden || v.visibility === 'owner' || v.public === 'owner'), visibility: v.visibility, public: v.public, rewrite: v.rewrite, hidden_what: v.hidden_what }, { name, kind }) : '';
  const U = window.LiveUI, L = window.LiveLight, R = window.LiveRoute, { esc, sp } = U, $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search), id = params.get('id');
  const route = path => path + (params.has('fixture') ? `${path.includes('?') ? '&' : '?'}fixture=${encodeURIComponent(params.get('fixture'))}` : '');
  const hero = $('hero'), part = name => hero.querySelector(`[data-part="${name}"]`), rec = $('rec');
  const { states: STATE, rowState, stepState, stepWord: knownStepWord, planInfo, helperTotal: countHelpers, contentLocked, detailReply, stageLabel, plain } = U.chatFields;
  const lockedFields = '最新进展、任务原文、执行计划、思考摘要、正式摘要、最新回复和帮手标题';
  const ACTIVE = ['running', 'waiting', 'queued', 'reconnecting'];
  const model = d => U.draw10 ? U.draw10.modelName(d) : d.model;
  const who = (d, bare) => [U.fieldText(bare && U.draw10?.bareModel ? U.draw10.bareModel(d) : model(d), viewer), d.effort].filter(Boolean).join(' · ');
  const text = v => typeof v === 'object' && v !== null ? v.text != null && v.text !== '' ? v.text : v.value ?? v.text : v;
  const pending = v => v?.rewrite === 'pending' && (text(v) == null || text(v) === '');
  function field(value, item, parent, key) {
    const explicit = item?.rewritten_fields?.includes(key) || value?.rewritten_fields?.includes('text') || value?.rewritten_fields?.includes('value');
    // A row-wide rewrite flag does not describe the unchanged fields in that row.
    const inherited = item?.visibility === 'rewritten' || item?.public === 'rewrite';
    const source = inherited && !explicit && item !== value ? { ...item, visibility: undefined, public: undefined } : item;
    const v = U.chatFields.field(value, source, parent);
    if (explicit && !v.visibility) v.visibility = 'rewritten';
    return v;
  }
  const replyBody = value => U.chatJoinedReply(value, viewer);
  const chatCell = (value, label, parent, limit = 0, card = false) => {
    return U.chatFields.cell(value, label, parent, viewer, limit, card);
  };
  const said = (value, parent) => {
    const v = field(value, value, parent), raw = text(v);
    if (typeof raw === 'string') v.value = v.text = plain(raw);
    return U.fieldHtml(v, { name: '对话内容', kind: viewer });
  };
  const privateSaid = (value, parent) => viewer === 'owner' && (parent?.visibility === 'owner' || parent?.public === 'owner')
    ? U.fieldHtml(plain(U.fieldText(value, viewer))) : said(value, parent);
  function headerNote(d, latest) {
    if (viewer === 'owner' && (d.visibility === 'owner' || d.public === 'owner')) return '';
    const fields = [['对话标题', field(d.title, d, null, 'title')], ['最新进展', field(d.doing ?? d.text, d, null, d.doing != null ? 'doing' : 'text')], ['思考摘要', field(d.thinking, d, null, 'thinking')], ['正式摘要', field(d.summary, d, null, 'summary')], ['最新回复', field(detailReply(d), d, null, Object.hasOwn(d, 'latest_reply') ? 'latest_reply' : 'reply')], ['任务原文', field(d.task_prompt, d, null, 'task_prompt')], ...planInfo(d).plan.map(p => ['执行计划', field(p.text, p, d, 'text')]), ...(Array.isArray(d.helpers) ? d.helpers : []).map(h => ['帮手标题', field(h.title, h, d, 'title')])];
    return ['rewritten', 'owner'].map(visibility => {
      const names = [...new Set(fields.filter(([name, v]) => v.visibility === visibility && !(viewer === 'public' && (name === '对话标题' && visibility === 'owner' || name === '最新进展' && latest.includes(`live-mark--${visibility}`)))).map(([name]) => name))];
      if (!names.length) return '';
      if (visibility === 'owner') return viewer === 'public' ? marker({ visibility }, viewer, names.join('、')) : '';
      return `${marker({ visibility }, viewer, names.join('、'))}：${names.join('、')}`;
    }).filter(Boolean).join('；');
  }
  const chatTitle = d => contentLocked(d, viewer) ? '仅本人可见' : (viewer === 'public' && (field(d.title, d).visibility === 'owner' || d.title?.hidden) || pending(field(d.title, d)) ? '对话' : plain(U.fieldText(d.title, viewer)) || U.chatShortName({ ...d, started_at: d.session_started_at, born: null }, viewer) || '没有标题');
  const when = at => at ? stamp(at) : U.collectionText("时刻");
  const projectInfo = d => { const p = d.project, n = d.project_name, hidden = [p, n].find(v => v?.visibility === 'owner' || v?.public === 'owner'); if (viewer === 'public' && hidden) return marker({ visibility: 'owner' }, viewer, '项目名称'); const id = text(p), name = text(n); return id && name ? `<a href="${esc(route(`/live/project/?id=${encodeURIComponent(id)}`))}">${U.fieldHtml(name)} ›</a>` : U.offline?.() ? '' : `<span class="rec-none">${U.collectionText()}</span>`; };
  function actions(d) {
    const list = [...(d.actions?.length ? d.actions : [{ kind: 'copy', label: '问情况', intent: 'ask' }])].map(a => a.href?.startsWith('/live/') ? { ...a, href: route(a.href) } : a);
    if (d.open && !list.some(a => a.kind === 'open')) {
      const open = typeof d.open === 'string' ? { target: d.open } : d.open;
      list.push({ ...open, label: '打开对话', kind: 'open', ...(!open.guard && !open.target ? { target: `chat:${d.id}` } : {}) });
    }
    return U.actions(d, list.map(a => a.kind === 'open' ? { ...a, label: '打开对话' } : a.intent === 'ask' ? { ...a, label: '问情况' } : a));
  }
  let viewer = 'public', chat = null, at = null, first = true, changed = false, lit = false, lastOffline = false;
  const bar = U.topbar({ ask: () => chat ? `请看实况对话 ${chat.id}（${sp(chatTitle(chat))}${at ? `，${U.time(at)} 的数` : ''}）：${U.fieldText(U.chatProgressText(chat.text, chat, viewer), viewer) || STATE[chat.state] || U.collectionText()}。请说明现在的情况。` : '' });
  L.add(hero);
  for (const el of document.querySelectorAll('[data-ico]')) el.innerHTML = R.ico(el.dataset.ico);
  for (const el of document.querySelectorAll('.route-h__fold')) el.innerHTML = R.ico('chev');
  for (const el of document.querySelectorAll('.route-say__icon')) el.innerHTML = R.ico('bolt');
  const back = document.querySelector('[data-back]');
  back.href = route('/live/chats/');
  let from = null;
  try { from = document.referrer ? new URL(document.referrer) : null; } catch { from = null; }
  // 从自动任务的一轮详情点“看完整对话”进来的，回到那一轮（后台的对话不进 AI 对话列表）
  if (from?.origin === location.origin && ['/live/', '/live/chats/', '/live/project/', '/live/automation/run/'].includes(from.pathname)) {
    back.href = from.pathname + from.search; back.textContent = from.pathname === '/live/' ? '实况' : from.pathname === '/live/project/' ? '项目' : from.pathname === '/live/automation/run/' ? '这一轮' : 'AI 对话';
    back.addEventListener('click', U.restoreBack);
  }
  part('meta').addEventListener('click', e => {
    const link = e.target.closest?.('a[href="#plan-box"]');
    if (!link || e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    history.replaceState(history.state, '', link.hash);
    $('plan-box').scrollIntoView();
  });
  const privatePlan = d => viewer === 'public' && field(d.text, d, chat).visibility === 'owner';
  const wholeOwner = () => chat?.visibility === 'owner' || chat?.public === 'owner';
  const chatState = d => (U.offline?.() && ACTIVE.includes(d.state) ? '断开前' : '') + rowState(d, viewer);
  const stepWord = s => (U.offline?.() && ACTIVE.includes(s) ? '断开前' : '') + knownStepWord(s);
  // 一行里名字的标记：整页只写一次“帮手名仅本人可见”或“换了说法”，不在每一行重复；先认结构标记（hidden、visibility）。
  const markOf = (value, item) => { const v = field(value, item, chat, value === item?.title ? 'title' : 'text'); return v.hidden || v.visibility === 'owner' ? 'owner' : v.visibility === 'rewritten' ? 'rewritten' : ''; };
  const plainName = (value, item, label) => { const v = field(value, item, chat), mark = markOf(value, item), raw = text(v); if (mark === 'owner' && viewer === 'public') return ''; if (mark) return raw == null || raw === '' ? '' : U.fieldHtml(raw, { name: label, kind: viewer }); return chatCell(v, label, chat, 0, true); };
  const marks = (kinds, label) => [kinds.has('owner') && viewer !== 'owner' && U.fieldHtml(viewer === 'owner' ? { text: label, visibility: 'owner' } : { text: null, visibility: 'owner', hidden_what: label }, { name: label, kind: viewer }), kinds.has('rewritten') && U.fieldHtml({ text: label, visibility: 'rewritten' }, { name: label, kind: viewer })].filter(Boolean).join('<span class="route-note__sep">·</span>');
  function visibleText(v) {
    while (v && typeof v === 'object') {
      const restricted = v.hidden || v.hidden_block || v.visibility === 'owner' || v.public === 'owner';
      if ((viewer === 'public' && restricted) || v.visibility === 'pending' || pending(v)) return '';
      v = text(v) ?? v.label;
    }
    return typeof v === 'string' ? v.trim() : '';
  }
  function helperWords(h) {
    if (contentLocked(chat, viewer) || contentLocked(h, viewer)) return { name: '', detail: '', mark: '' };
    const task = U.chatHelperPurpose(h, chat, viewer, field);
    const mark = markOf(task?.purpose || h.title, h);
    const name = task ? chatCell(task.purpose, '帮手名', chat, task.limit, true)
      : viewer === 'public' && mark === 'owner' ? '' : '未记录具体任务';
    // 派活时的原名（多是内部代号）收在“帮手原名”里，点开能看；两版同一套（本人禁令 11-24 14:16），后台藏了的照后台
    const raw = field(h.title, h, chat, 'title'), words = visibleText(raw);
    const original = words && !U.chatHelperPurpose.placeholder.test(words) && words !== visibleText(task?.purpose) && chatCell(raw, '帮手名', chat, 0, true);
    const detail = original ? `<details class="row__sub"><summary class="more">帮手原名</summary><p style="overflow-wrap:anywhere">${original}</p></details>` : '';
    return { name, detail, mark };
  }
  // 什么时候：同一天只写钟点，前一天写“昨天”，再早写日子；断开时也照这样写。整页（页头、帮手、过程记录）只用这一种写法。
  const activityOf = h => { if (h.state === 'running' || !Number.isFinite(Date.parse(h.at))) return U.chatFields.helperActivity(h, at); const verb = h.state === 'done' ? '完成于' : h.state === 'stopped' ? '停止于' : h.state === 'failed' ? '出错于' : '最后记录于'; return `${verb} ${stamp(h.at)}`; };
  const dayOf = t => U.date(t), stamp = t => { const now = at || chat?.at, day = dayOf(t); if (!now || !Number.isFinite(Date.parse(t))) return day ? `${day} ${U.time(t)}` : ''; return day === dayOf(now) ? U.time(t) : day === dayOf(new Date(Date.parse(now) - 86400000).toISOString()) ? `昨天 ${U.time(t)}` : `${day} ${U.time(t)}`; };

  // 帮手一行：状态、名字、型号、最后记录时间和已有操作。
  function row(d, index) {
    if (d.q === 'warming') return { key: d.id || `helper-${index}`, cls: 'route-row route-row--empty', html: '<p class="route-row__line">正在准备</p>' };
    const { name, detail } = helperWords(d), state = chatState(d);
    const model = who(d), head = name || U.fieldHtml(model || (!state ? '一个帮手' : ''));
    const activity = activityOf(d);
    const canOpen = !contentLocked(chat, viewer) && !contentLocked(d, viewer);
    const meta = ['帮手', name && model, activity].filter(Boolean).join(' · ');
    return { key: d.id || `helper-${index}`, cls: `route-row${d.state === 'running' ? ' is-now' : ''}`, html: `${U.status(d, { small: true }).lamp}${R.ico('doc', 'route-row__ico')}<div class="route-row__main"><p class="route-row__line">${state ? `<b class="route-word">${esc(state)}</b>` : ''}<span class="route-row__name">${head}</span></p><p class="route-row__sub">${U.fieldHtml(meta, { name: '对话内容', kind: viewer })}</p>${detail}${U.draw10?.helperDetailHtml?.(d, viewer, chat) || ''}</div><div class="route-row__acts">${canOpen ? actions(d) : ''}</div>` };
  }

  // —— 航线：计划逐行作站点，不改名、不加项；只照数据画勾和“在做”，当前这一步按 step_index 标出 ——
  function station(p, i, current) {
    const s = stepState(p), word = stepWord(s), v = field(p.text, p, chat);
    const label = privatePlan(p) ? '' : markOf(p.text, p) ? plainName(p.text, p, '计划') : chatCell(v, '计划', chat, 0, true);
    return { key: p.id || `plan-${i}`, label, word: word ? esc(word) : '', state: s === 'done' ? 'done' : i === current ? 'now' : s === 'pending' ? 'pending' : '', lamp: U.status(p, { small: true }).lamp };
  }
  function drawPlan(progress) {
    const { plan, total, current, label, count } = progress, box = $('plan-box'), note = $('plan-note');
    const review = chat.review_plan;
    const sub = [count, plan[current] && label].filter(Boolean).join(' · ');
    const gaps = Array.isArray(chat.field_gaps) ? chat.field_gaps.find(g => g.field === 'plan') : chat.field_gaps?.plan, reason = gaps && (typeof gaps === 'string' ? gaps : gaps.reason || gaps.gap || '');
    box.hidden = !plan.length && !review && !(viewer === 'public' && wholeOwner());
    if (!plan.length) {
      U.html($('plan'), ''); box.classList.add('is-empty');
      U.html($('plan-sub'), count);
      note.hidden = false;
      U.html(note, review ? U.fieldHtml(review, { name: '送审计划', kind: viewer }) : reason ? esc(reason) : viewer === 'public' && wholeOwner() ? marks(new Set(['owner']), '计划') : '没有步骤明细');
      return;
    }
    box.classList.remove('is-empty');
    const steps = plan.map((p, i) => station(p, i, current)), drawn = R.line('plan', steps, { current, limit: Infinity });
    $('plan').style.setProperty('--stops', Math.min(drawn.count, 7));
    U.html($('plan'), drawn.html);
    for (const node of $('plan').querySelectorAll('.route-stop__text')) node.style.webkitLineClamp = 'unset';
    U.html($('plan-sub'), sub);
    const kinds = new Set(plan.map(p => privatePlan(p) ? 'owner' : markOf(p.text, p)).filter(Boolean)), less = '';
    const words = [marks(kinds, '计划'), less].filter(Boolean).join('<span class="route-note__sep">·</span>');
    note.hidden = !words; U.html(note, words);
  }

  // —— 正在执行：当前这一步写大，下面是正式摘要、最新回复，各露一句、点开看全文 ——
  function drawNow(progress, facts) {
    const { plan, current, label, count } = progress, active = chat.state === 'running', p = plan[current];
    const stillWorking = chat.state === 'done' && U.chatFields.workingHelpers(chat);
    U.html($('now-label'), stillWorking ? '对话已结束' : U.offline?.() && active ? '断开前在做' : active ? '正在执行' : '现在');
    const word = p ? stepWord(stepState(p)) : '';
    const step = p ? `${label} · ${esc(word)}` : count;
    U.html($('now-step'), step); $('now-step').hidden = !step;
    const currentText = stillWorking ? `后台帮手另在处理（${stillWorking} 个）` : p ? (privatePlan(p) ? U.fieldHtml({ text: null, visibility: 'owner', hidden_what: '这一步' }, { name: '这一步', kind: viewer }) : chatCell(field(p.text, p, chat), '这一步', chat, 0, true)) : esc(chatState(chat));
    U.html($('now-text'), currentText);
    $('now-text').style.webkitLineClamp = 'unset';   // 两版同一套（本人禁令 11-24 14:16）：两版都不收行、不收条数
    U.html($('facts'), facts.map(([label, content, clip = false], i) => `<p class="route-fact"${clip ? ' data-clip="fact-' + i + '"' : ''}>${label ? `<span class="route-fact__k">${label}：</span>` : ''}${content}</p>${clip ? '<button type="button" class="route-clip__more" data-clip-for="fact-' + i + '" data-live-opened="card/chat/route-detail" hidden>展开</button>' : ''}`).join(''));
  }

  // —— 帮手：顶上总数和各状态几个（只数数据里有的）；先列出错、在做的前 5 个，其余“看全部”后按批看 ——
  const CREW = { done: '做完', running: '在做', failed: '出错', waiting: '等回答', queued: '等着', reconnecting: '在重连', stopped: '已停止', unknown: '状态未知' };
  const CREW_FIRST = ['failed', 'running', 'reconnecting', 'waiting', 'queued'];
  const helperTotal = () => countHelpers(chat);
  function drawHelpers() {
    const helpers = Array.isArray(chat.helpers) ? chat.helpers : contentLocked(chat, viewer) ? chat.helpers?.active : null, total = helperTotal(), note = $('helpers-note');
    const box = $('helpers-box');
    box.hidden = total === 0 && !helpers?.length || total == null && (U.offline?.() || contentLocked(chat, viewer) && !helpers?.length);
    box.parentElement.hidden = box.hidden && $('think-box').hidden;
    if (!total && !helpers?.length) {
      U.html($('helpers-part'), total === 0 ? '0 个' : ''); $('helpers-tally').hidden = true;
      U.list($('helpers'), [], { animate: !first }); U.html($('helpers-more'), '');
      note.hidden = false; U.html(note, total === 0 ? '没有派帮手' : esc(U.collectionText('帮手')));
      return;
    }
    const locked = contentLocked(chat, viewer);
    const { counts, open, rest } = R.tally(helpers || [], h => Object.hasOwn(CREW, h.state) ? h.state : 'unknown', CREW_FIRST), order = [...open, ...rest];
    const byState = chat.helper_counts?.by_state ?? Object.fromEntries(counts);
    const b = R.batch('helpers', order.length, { first: Math.min(order.length, 50), step: 50, unit: '个', what: '帮手' }), shown = order.slice(0, b.shown);
    U.html($('helpers-part'), `共 ${total} 个${order.length < total ? ` · 已列 ${order.length} 个` : ''}`);
    const states = [...new Set([...Object.keys(CREW), ...Object.keys(byState)])];
    const chips = states.filter(k => Number.isInteger(byState[k])).map(k => `<span class="route-chip route-chip--${esc(k)}">${esc(CREW[k] || '状态不明')}<b>${esc(byState[k])}</b></span>`).join('');
    $('helpers-tally').hidden = false; U.html($('helpers-tally'), (U.offline?.() ? '<span class="route-tally__lead">断开前</span>' : '') + chips);
    U.list($('helpers'), shown.map(row), { animate: !first });
    const kinds = new Set(shown.map(h => helperWords(h).mark).filter(Boolean)), words = [!shown.length && order.length && '已列帮手中没有在做、出错的',
      !shown.length && !order.length && !contentLocked(chat, viewer) && '没有帮手明细', marks(kinds, '帮手名')].filter(Boolean).join('<span class="route-note__sep">·</span>');
    note.hidden = !words; U.html(note, words);
    U.html($('helpers-more'), b.html);
  }

  // —— 过程记录：后端没有单独的过程清单，按时间排这场对话里带时刻的真数据——开始、各帮手最后动静、正式摘要和最新回复的时刻 ——
  const validTime = t => typeof t === 'string' && Number.isFinite(Date.parse(t));
  const hasNewTimes = () => ['session_started_at', 'turn_started_at', 'source_at'].some(k => Object.hasOwn(chat, k));
  const startTimes = () => (hasNewTimes()
    ? [['session', chat.session_started_at, '对话开始'], ['turn', chat.turn_started_at, '本轮开始']]
    : [['born', chat.born, '本次记录起于']]).filter(([, t]) => validTime(t));
  function events() {
    const list = startTimes().map(([key, at, word]) => ({ key, at, word, name: esc(U.chatFields.originLabel(chat)) }));
    const reply = [detailReply(chat), chat.latest_reply, chat.reply].filter(v => validTime(v?.at)).sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0];
    for (const [i, h] of (Array.isArray(chat.helpers) ? chat.helpers : []).entries()) if (validTime(h.at)) {
      const { name, detail, mark } = helperWords(h), model = U.fieldText(U.draw10 ? U.draw10.modelName(h) : h.model, viewer);
      list.push({ key: `h-${h.id || i}`, at: h.at, word: chatState(h), name: name || U.fieldHtml(model), sub: name ? ['帮手', model].filter(Boolean).join(' · ') : '', detail, lamp: U.status(h, { small: true }).lamp, mark });
    }
    // 摘要、回复这两行接上已有的原文：本人版整段摆出，访客版先露两行、点“展开”看全；仅本人可见的照常写锁
    for (const [key, v, word, name, label] of [['summary', chat.summary, '摘要', '写好正式摘要', '正式摘要'], ['reply', reply, '回复', '发出最新回复', '最新回复']]) if (v && typeof v === 'object' && v.at) {
      const original = replyBody(key === 'summary' ? U.chatProgressText(v, chat, viewer) : v), body = chatCell(original, label, chat, 0, true) || chatCell(original, label, chat), clip = false;
      const detail = body ? `<p class="route-row__text"${clip ? ` data-clip="${clip}" style="--clip-lines:2"` : ''}>${body}</p>${clip ? `<button type="button" class="route-clip__more" data-clip-for="${clip}" hidden>展开</button>` : ''}` : '';
      list.push({ key, at: v.at, word, name: esc(name), detail });
    }
    if (validTime(chat.at) && !list.some(e => Date.parse(e.at) === Date.parse(chat.at))) list.push({ key: 'update', at: chat.at, word: '主对话更新' });
    return list.filter(e => validTime(e.at)).sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  }
  function recordEnd(list) {
    if (hasNewTimes()) return chat.source_at;
    const compact = chat.compaction, times = compact?.count >= 1 ? compact.times || [] : [];
    const clocks = compact?.count >= 1 ? (compact.events || []).map((e, i) => times[i] ?? e?.at) : [];
    return [chat.at, list[0]?.at, ...times, ...clocks].filter(validTime).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  }
  function drawLog(list = events()) {
    const b = R.batch('log', list.length, { first: 50, step: 50, unit: '条' }), shown = list.slice(0, b.shown), note = $('log-note');
    U.html($('log-part'), list.length > shown.length ? `最近 ${shown.length} 条 · 共 ${list.length} 条` : list.length ? `共 ${list.length} 条` : '');
    U.list($('log'), shown.map(e => ({ key: e.key, cls: 'route-row route-row--log', html: `<time class="route-row__time">${esc(stamp(e.at))}</time><div class="route-row__main"><div style="min-width:0;flex:1"><p class="route-row__line">${e.lamp || ''}<b class="route-word">${esc(e.word)}</b><span class="route-row__name">${e.name || ''}</span></p>${e.detail || ''}</div>${e.sub ? `<p class="route-row__sub">${U.fieldHtml(e.sub, { name: '对话内容', kind: viewer })}</p>` : ''}</div>` })), { animate: !first });
    const words = [!list.length && esc(U.collectionText('过程记录')), marks(new Set(shown.map(e => e.mark).filter(Boolean)), '帮手名')].filter(Boolean).join('<span class="route-note__sep">·</span>');
    note.hidden = !words; U.html(note, words);
    U.html($('log-more'), b.html);
  }
  R.on('helpers', () => { if (chat) drawHelpers(); });
  R.on('log', () => { if (chat) { drawLog(); R.reclip(); } });

  function workLine(d, reply) {
    const progress = [d.doing, d.progress, d.text].find(value => {
      if (value === d.text && U.chatFields.quota(d, viewer)) return false;
      const words = visibleText(field(value, d));
      return words && words !== visibleText(field(d.thinking, d)) && words !== rowState(d, viewer) && !/^(?:第\s*\d+\s*[\/／]\s*\d+\s*步|仅本人可见|没有记录|没有标题|asking|在干|等你回答|等本人回答|做完了|已停止|出错了|结局没读到|状态不明)$/.test(words);
    });
    const say = ['done', 'waiting'].includes(d.state) && d.summary?.text && d.summary.text === d.text ? d.summary : progress ?? reply ?? d.summary;
    const body = replyBody(say === d.summary ? U.chatProgressText(say, d, viewer) : say);
    return { say: body, latest: chatCell(body, say === d.summary ? '正式摘要' : say === reply ? '最新回复' : '最新进展', d) };
  }
  function drawThought() {
    const node = $('thinking'), box = $('think-box');
    if (!node || !box) return;
    const raw = field(chat.thinking, chat), words = visibleText(raw);
    const heading = field(field(chat.thinking_heading?.title, chat.thinking_heading), chat), head = visibleText(heading);
    const title = words && head && head !== words && head !== visibleText(field(chat.title, chat)) && chatCell(heading, '任务', chat, 0, true);
    const thought = chat.thinking ? chatCell(raw, '思考摘要', chat, 0, true) || chatCell(raw, '思考摘要', chat) : '';
    // 只有外文思考时，后台给缺因（field_gaps.thinking）：先说一句为什么是英文，再给原文
    const gap = thought && typeof chat.field_gaps?.thinking === 'string' ? chat.field_gaps.thinking : '';
    box.hidden = !thought; node.hidden = !thought;
    // M684：思考摘要访客那边不一样的，在这块标题后挂签（整场藏着的只在页头挂）
    const thinkHead = box.querySelector('.route-h__text');
    if (thinkHead) U.html(thinkHead, '思考摘要' + (thought && !U.visitorWholeHidden(chat) ? U.visitorLabel(chat, 'thinking', '思考摘要', viewer) : ''));
    U.html(node, thought ? (title ? `<b class="route-think__lead">${title}</b>` : '') + (gap ? `<small class="route-think__lead" style="font-weight:400;color:var(--route-muted, #848b87)">${esc(gap)}</small>` : '') + thought : '');
  }
  // 本人版给全文：页头那句、思考摘要、过程记录和帮手的每一行都不收、不截；访客版照旧一句收起
  function fullText(on) {
    rec.classList.toggle('route-body--full', on); hero.classList.toggle('route-head--full', on);
    for (const [el, key] of [[part('say'), 'say'], [$('thinking'), 'thinking']]) {
      if (on) { el.removeAttribute('data-clip'); el.classList.add('is-open'); } else el.dataset.clip = key;
      for (const b of document.querySelectorAll(`[data-clip-for="${key}"]`)) if (on) b.hidden = true;
    }
  }
  function render(kind) {
    viewer = kind === 'owner' ? 'owner' : 'public';
    if (chat.q === 'warming') { missing('正在准备'); return; }
    const locked = contentLocked(chat, viewer), name = field(chat.title, chat), hiddenName = !locked && viewer === 'public' && (name.visibility === 'owner' || name.hidden), title = chatTitle(chat);
    document.title = `${title} · 实况`;
    const replyGap = Array.isArray(chat.field_gaps) ? chat.field_gaps.find(g => g.field === 'latest_reply') : chat.field_gaps?.latest_reply;
    const gapReason = typeof replyGap === 'string' ? replyGap : replyGap?.reason || replyGap?.gap;
    const missingReply = (typeof gapReason === 'string' ? gapReason.replace(/^最新回复[：: ]*/u, '').replace(/ · 没有最新回复[。.]?$/u, '') : gapReason) || '还没读到';
    const duration = seconds => {
      const hours = Math.floor(seconds / 3600), mins = Math.floor(seconds / 60) % 60, secs = seconds % 60;
      return [hours && `${hours} 小时`, mins && `${mins} 分`, (secs || !seconds) && `${secs} 秒`].filter(Boolean).join(' ');
    };
    const e = chat.estimate, actual = Object.hasOwn(chat, 'worked_seconds') ? chat.worked_seconds : Number.isFinite(e?.worked_min) ? Math.round(e.worked_min * 60) : null;
    const timing = [Number.isFinite(chat.elapsed_seconds) && `历时 ${duration(chat.elapsed_seconds)}`,
      Number.isFinite(actual) && `实际工时 ${duration(actual)}`].filter(Boolean).join(' · ');
    const plan = planInfo(chat), log = locked ? [] : events(), end = recordEnd(log);
    const progress = locked ? plan.label || plan.count : plan.plan[plan.current] && plan.label;
    const rawReply = locked ? null : detailReply(chat);
    const hasReply = String(text(rawReply) ?? '').trim() !== '';
    const helpers = helperTotal(), dates = startTimes()
      .filter(([key, t]) => key !== 'session' || !title.endsWith(`${U.time(t)} 开始的对话`))
      .map(([, t, label]) => `${label} ${when(t)}`);
    if (locked && !dates.length) {
      const [start, label] = U.chatStart(chat);
      if (start) dates.push(`${label} ${when(start)}`);
    }
    if (validTime(chat.at)) dates.push(`主对话更新 ${when(chat.at)}`);
    if (validTime(end)) dates.push(`${hasNewTimes() ? '数据截止' : '最近一条记录'} ${when(end)}`);
    const model = who(chat, true);
    const meta = [model, U.chatFields.originLabel(chat, false), locked && stageLabel(chat), progress, ...dates, e?.planned_min != null && `报 ${Math.round(e.planned_min)} 分钟`, timing, e?.over_min > 0 && `超了 ${U.minutes(e.over_min)}`, helpers === 0 ? '没有派帮手' : helpers && `帮手 ${helpers} 个`].filter(Boolean);
    const project = (chat.project || chat.project_name) && projectInfo(chat);
    const app = U.chatFields.appTag(chat);
    // LINK1125（本人选 A）：“Opus 5.5 · max ›”去智能体页、落在这一家；“开场读的规矩 ›”去开场页这一家。哪一家照 software，旧回包照编号前缀
    const family = [chat.software, /^(claude|codex|antigravity):/i.exec(chat.id || '')?.[1]].map(v => String(v || '').toLowerCase()).find(v => /^(claude|codex|antigravity)$/.test(v));
    const go = (href, words) => `<a class="route-head__go" href="${esc(route(href))}">${words} ›</a>`;
    part('meta').hidden = !meta.length && !project && !app;
    U.html(part('meta'), app + meta.map(v => !locked && v === progress ? `<a class="more" href="#plan-box">${esc(v)} ›</a>` : v === model && family ? `<span>${go(`/live/agents/?family=${family}#work`, U.fieldHtml(v, { name: '对话内容', kind: viewer }))}</span>` : `<span>${U.fieldHtml(v, { name: '对话内容', kind: viewer })}</span>`).join('') + (project ? `<span class="route-head__project">所属项目 ${project}</span>` : ''));
    U.draw10?.detail(part('meta'), chat, viewer);
    // “开场读的规矩 ›”接在“压缩过 N 次 ›”那一行后面（图 L-chat-v3 圈②）；没压缩过就接在上面那排最后。后台没给这场对话开场读的是哪一版，版本号先不写
    hero.querySelectorAll('[data-opening]').forEach(el => el.remove());
    if (family) {
      const compact = part('meta').parentElement.querySelector('[data-compaction]'), opening = go(`/live/agents/opening/?family=${family}`, '开场读的规矩');
      if (compact && !compact.hidden) compact.insertAdjacentHTML('beforeend', `<span data-opening> · ${opening}</span>`);
      else { part('meta').insertAdjacentHTML('beforeend', `<span data-opening>${opening}</span>`); part('meta').hidden = false; }
    }
    const { say, latest } = locked ? { latest: '' } : workLine(chat, rawReply), note = locked ? '' : headerNote(chat, latest);
    const F = U.chatFields, sk = F.statusKind(chat);
    // 后台给了 status_kind 就只认那一套标签（同 AI 对话页）；旧回包才照“额度用完”的进展原文写
    const state = !locked && !sk && F.quota(chat, viewer) ? U.fieldText(U.chatProgressText(chat.text, chat, viewer), viewer) : chatState(chat);
    // 设计第 9 节：标签后面接“从几点起”（排序时刻＋这一类的动词，同 AI 对话页行首）和原因；状态旧了 2 分钟以上加“状态是几点读的”。后台没给的那一项不写
    const reason = chat.status_reason != null ? U.fieldText(chat.status_reason, viewer).trim() : '';
    const seen = Date.parse(chat.status_observed_at), asOf = Date.parse(at);
    const since = sk ? [Number.isFinite(Date.parse(chat.sort_at)) && `${F.dayClock(chat.sort_at)} ${F.ownerWords(F.sortVerb(chat), viewer)}`,
      reason && reason !== state && F.ownerWords(reason, viewer),
      Number.isFinite(seen) && Number.isFinite(asOf) && asOf - seen > 120000 && `状态是 ${F.dayClock(chat.status_observed_at)} 读的`].filter(Boolean).join(' · ') : '';
    U.html(part('head'), U.status({ ...chat, level: chat.header_level ?? chat.level }).lamp + U.head(title, { lamp: false }) + (hiddenName ? chatCell(name, '对话标题', chat) : '') + U.visitorHiddenMark(chat, '这场对话', viewer) + (note ? `<span class="row__meta">${note}</span>` : '') + `<span class="head__tail">${esc(state)}</span>` + (since ? `<span class="head__since">${esc(since)}</span>` : ''));
    part('head').querySelector('.head__lead')?.classList.toggle('rewrite-pending', !locked && pending(name));
    part('privacy').hidden = !locked; U.html(part('privacy'), locked ? `${lockedFields}仅本人可见` : '');
    // 这场对话是哪一轮自动任务开的：后台 automation_run=[类, 轮号]，照等你的事、账本写“来源：…那一轮 ›”，点了到那一轮（验收 11-24 07:28）
    const run = Array.isArray(chat.automation_run) && typeof chat.automation_run[0] === 'string' && typeof chat.automation_run[1] === 'string' && chat.automation_run[1] ? chat.automation_run : null;
    const LR = window.LiveRuns, [runAt] = U.chatStart(chat);
    const runLabel = run && [LR?.categoryName(run[0], viewer) || '自动任务', runAt && LR ? `${LR.when(runAt)} 那一轮` : '那一轮'].join(' · ');
    part('source').hidden = !run;
    U.html(part('source'), run ? `来源：<a href="${esc(route(`/live/automation/run/?type=${encodeURIComponent(run[0])}&run=${encodeURIComponent(run[1])}`))}">${esc(runLabel)} ›</a>` : '');
    part('say').hidden = !latest; U.html(part('say'), latest);
    U.html(part('acts'), locked ? '' : actions(chat)); part('acts').hidden = !part('acts').textContent;
    rec.classList.toggle('route-body--locked', locked);
    $('now-box').hidden = $('log-box').hidden = locked;
    L.tone(hero, { ...chat, level: chat.header_level ?? chat.level });
    if (locked) {
      for (const id of ['plan', 'plan-note', 'facts', 'now-step', 'now-text', 'thinking', 'log']) U.html($(id), '');
      $('think-box').querySelector('[data-thinking-original]')?.replaceChildren();
      $('plan-box').hidden = $('think-box').hidden = true;
      drawHelpers();
      return;
    }
    drawThought();
    fullText(true);   // 两版同一套（本人禁令 11-24 14:16）：两版都直接给全文
    const facts = [];
    const shown = value => { const el = document.createElement('div'); el.innerHTML = said(value); return el.textContent.replace(/\s+/g, ' ').trim().replace(/[。．.]$/, ''); };
    const summary = replyBody(U.chatProgressText(chat.summary, chat, viewer)), reply = replyBody(rawReply);
    if ((text(summary) != null || summary?.hidden || summary?.visibility === 'owner' || summary?.public === 'owner' || pending(summary) || summary?.q === 'warming') && (viewer === 'public' && field(summary, summary, chat).visibility === 'owner' || shown(summary) !== shown(say))) facts.push(['', chatCell(summary, '正式摘要', chat)]);
    const replyContent = hasReply || !!(rawReply && (markOf(rawReply, rawReply) || pending(rawReply) || rawReply.q === 'warming'));
    // M684：最新回复访客那边不一样的（整块 reply / latest_reply，或正文对象里只换了词的 reply.visitor_labels.text），在这一行末挂签
    const blockTag = (key, what) => !U.visitorWholeHidden(chat) ? U.visitorLabel(chat, key, what, viewer) : '';
    const replyTag = blockTag(['reply', 'latest_reply'], '最新回复');
    if (!replyContent) facts.push(['最新回复', privateSaid(missingReply, chat), false]);
    else if (shown(reply) !== shown(say) && shown(reply) !== shown(summary)) {
      facts.push(['最新回复', privateSaid(reply, chat) + replyTag]);
    }
    const prompt = chatCell(chat.task_prompt, '任务原文', chat);
    if (prompt && shown(chat.task_prompt) !== shown(say)) facts.push(['', prompt]);
    $('words').hidden = !facts.length; $('rec').hidden = false;
    U.html($('plan-box').querySelector('.route-h__text'), '执行计划' + (plan.plan.length ? blockTag('plan', '执行计划') : ''));
    drawPlan(plan); drawNow(plan, facts); drawHelpers(); drawLog(log);
    R.reclip();
    if (first && location.hash === '#plan-box' && !$('plan-box').hidden) requestAnimationFrame(() => $('plan-box').scrollIntoView());
  }
  function lightUp() { if (lit) return; lit = true; L.lightUp([hero, $('plan-box'), $('now-box'), $('think-box'), $('helpers-box'), $('log-box'), $('notices')]); }
  function clearRendered() {
    document.title = 'AI 对话 · 实况';
    const fields = ['head', 'meta', 'say', 'acts', 'privacy'].map(part);
    ['plan', 'plan-sub', 'plan-note', 'now-step', 'now-text', 'facts', 'thinking',
      'helpers', 'helpers-part', 'helpers-tally', 'helpers-note', 'helpers-more',
      'log', 'log-part', 'log-note', 'log-more'].forEach(id => fields.push($(id)));
    for (const node of fields) {
      node.replaceChildren();
      delete node._html;
    }
    $('think-box').querySelector('[data-thinking-original]')?.remove();
    rec.hidden = true;
  }
  function missing(message, denied = false) {
    clearRendered();
    U.html(part('head'), denied ? marker({ visibility: 'owner' }, 'public', '对话标题、' + lockedFields) : U.head(message)); for (const name of ['meta', 'say', 'acts', 'privacy', 'source']) part(name).hidden = true;
    L.tone(hero, 'off'); rec.hidden = true; requestAnimationFrame(lightUp);
  }
  if (!id) missing('没有说是哪个对话');
  else {
    const heroRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(2), name: 'AI 对话' });
    const recRead = U.reading(rec, { ghost: U.ghost.rows(5), slow: false });
    window.Live.watch(`chats/${encodeURIComponent(id)}`, null, {
      phase(state) { if (!chat) { heroRead.set(state); recRead.set(state); } },
      data(data, meta) {
        if (!data && chat) clearRendered();
        chat = data; at = meta.at; changed = true;
      },
      link(state) {
        try {
        bar?.set(state); L.offline(state.offline);
        U.list($('notices'), state.offline ? [{ key: 'offline', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${U.fieldHtml(state.text)}</span>` }] : []);
        const offlineChanged = lastOffline !== !!state.offline; lastOffline = !!state.offline;
        if (chat) {
          if (!changed && state.offline && !offlineChanged) return;
          rec.hidden = false; render(state.viewer?.kind);
          if (first) { heroRead.done(); recRead.done(); }
          first = changed = false; requestAnimationFrame(lightUp); return;
        }
        heroRead.set(state); recRead.set(state);
        if (['idle', 'wait', 'slow'].includes(state.phase)) return;
        if (state.phase === 'gone') { rec.hidden = true; L.tone(hero, 'off'); requestAnimationFrame(lightUp); return; }
        if (state.offline) missing('这块没存下来，连上后补上。');
        else if (state.meta?.status === 404) missing('没有这个对话');
        else if (state.meta?.status === 403) missing(state.text || '没有权限读取这个对话', true);
        else if (state.meta?.status || state.offline) missing(state.offline ? '这块没存下来，连上后补上。' : state.text || U.collectionText());
        } finally { [hero.querySelector('.card__body'), rec].forEach(el => U.blockNote(el, state)); }
      },
    });
  }
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

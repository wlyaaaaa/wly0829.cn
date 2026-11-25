// 第三层：一个 AI 对话的全过程，摆成共用模版“航线”（_lib/live-route.*，本人 11-17 20:15 点头的新模版）。
// 页头照旧：对话名、型号档位、走到第几步、干了多久、最新进展、问情况和打开对话；下面一条航线是计划各步，
// 再下面三栏：正在执行（当前这一步、正式摘要、最新回复）｜思考摘要 + 帮手（先列在做和出错的）｜过程记录（按时间，最近 10 条）。
// 字一律走 LiveUI.fieldHtml / fieldText；灯一律 LiveUI.status，没有灯字段不画；计划每步的状态只照数据（completed / in_progress，或旧的 state），没给不写。
(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, R = window.LiveRoute, { esc, sp } = U, $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search), id = params.get('id');
  const route = path => path + (params.has('fixture') ? `${path.includes('?') ? '&' : '?'}fixture=${encodeURIComponent(params.get('fixture'))}` : '');
  const hero = $('hero'), part = name => hero.querySelector(`[data-part="${name}"]`), rec = $('rec');
  const { states: STATE, rowState, stepState, stepWord: knownStepWord, planInfo, helperTotal: countHelpers, contentLocked, detailReply, stageLabel, plain } = U.chatFields;
  // 对话数据 → 要显示的字：和自动任务一轮的页共用 _lib/live-chat-view.js（本人 11-26：机制共通、内容一样全）；这一页只管摆成航线
  const V = window.LiveChatView.create({ viewer: () => viewer, chat: () => chat, at: () => at, route });
  const { lockedFields, ACTIVE, marker, who, text, pending, field, replyBody, chatCell, said, privateSaid, headerNote, chatTitle, when, actions,
    privatePlan, wholeOwner, chatState, stepWord, markOf, marks, visibleText, helperWords, stamp, events, recordEnd, workLine } = V;
  let viewer = 'public', chat = null, at = null, first = true, changed = false, lit = false, lastOffline = false, leaving = false;
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
  // 帮手一行：状态、名字、型号、最后记录时间和已有操作（内容由共用模块出，这里摆成航线的一行）。
  function row(d, index) {
    const h = V.helperRow(d, index);
    if (h.warming) return { key: h.key, cls: 'route-row route-row--empty', html: '<p class="route-row__line">正在准备</p>' };
    return { key: h.key, cls: `route-row${h.running ? ' is-now' : ''}`, html: `${h.lamp}${R.ico('doc', 'route-row__ico')}<div class="route-row__main"><p class="route-row__line">${h.state ? `<b class="route-word">${esc(h.state)}</b>` : ''}<span class="route-row__name">${h.head}</span></p><p class="route-row__sub">${U.fieldHtml(h.meta, { name: '对话内容', kind: viewer })}</p>${h.detail}${h.more}</div><div class="route-row__acts">${h.canOpen ? actions(d) : ''}</div>` };
  }

  // —— 航线：计划逐行作站点，不改名、不加项；只照数据画勾和“在做”，当前这一步按 step_index 标出（每一站的字由共用模块出） ——
  const station = V.station;
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

  // —— 过程记录：开始、各帮手最后动静、正式摘要和最新回复的时刻，按时间排（记录由共用模块出，events()） ——
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

  function drawThought() {
    const node = $('thinking'), box = $('think-box');
    if (!node || !box) return;
    // 思考摘要的字（标题、外文缺因、原文）由共用模块出
    const { thought, html } = V.thought();
    box.hidden = !thought; node.hidden = !thought;
    // M684：思考摘要访客那边不一样的，在这块标题后挂签（整场藏着的只在页头挂）
    const thinkHead = box.querySelector('.route-h__text');
    if (thinkHead) U.html(thinkHead, '思考摘要' + (thought && !U.visitorWholeHidden(chat) ? U.visitorLabel(chat, 'thinking', '思考摘要', viewer) : ''));
    U.html(node, html);
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
    // 页头信息（型号档位、各项时刻、历时、实际工时、帮手几个、所属项目、App 标签）由共用模块出
    const { locked, name, hiddenName, title, missingReply, plan, log, progress, rawReply, hasReply, meta, project, app } = V.pageMeta();
    document.title = `${title} · 实况`;
    part('meta').hidden = !meta.length && !project && !app;
    U.html(part('meta'), app + meta.map(v => !locked && v === progress ? `<a class="more" href="#plan-box">${esc(v)} ›</a>` : `<span>${U.fieldHtml(v, { name: '对话内容', kind: viewer })}</span>`).join('') + (project ? `<span class="route-head__project">所属项目 ${project}</span>` : ''));
    U.draw10?.detail(part('meta'), chat, viewer);
    const { say, latest } = locked ? { latest: '' } : workLine(chat, rawReply), note = locked ? '' : headerNote(chat, latest);
    const state = !locked && U.chatFields.quota(chat, viewer) ? U.fieldText(U.chatProgressText(chat.text, chat, viewer), viewer) : chatState(chat);
    U.html(part('head'), U.status({ ...chat, level: chat.header_level ?? chat.level }).lamp + U.head(title, { lamp: false }) + (hiddenName ? chatCell(name, '对话标题', chat) : '') + U.visitorHiddenMark(chat, '这场对话', viewer) + (note ? `<span class="row__meta">${note}</span>` : '') + `<span class="head__tail">${esc(state)}</span>`);
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
    // 正在执行下面那几行（正式摘要、最新回复、任务原文）由共用模块出
    const facts = V.facts(say, rawReply, hasReply, missingReply), blockTag = V.blockTag;
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
        // 自动任务开的对话（后台 automation_run=[类, 轮号]）不在这里摆：转到那一轮的页，内容一样全（施工稿第三节第 6 条，旧链接解析到新页）
        const run = Array.isArray(data?.automation_run) && typeof data.automation_run[0] === 'string' && typeof data.automation_run[1] === 'string' && data.automation_run[1] ? data.automation_run : null;
        if (run) { leaving = true; location.replace(route(`/live/automation/run/?type=${encodeURIComponent(run[0])}&run=${encodeURIComponent(run[1])}`)); return; }
        if (!data && chat) clearRendered();
        chat = data; at = meta.at; changed = true;
      },
      link(state) {
        if (leaving) return;
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

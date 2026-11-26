// 实况 · 一场 AI 对话（chats/{id}）→ 要显示的内容：页头信息、计划、当前这一步、摘要和回复、任务原文、思考摘要、帮手行、过程记录、访客标签。
// 顶层对话页（chat/page.js，摆成航线）和自动任务一轮的页（automation/run/run.js，摆成聊天记录）共用这一份：
// 本人 11-26：“自动任务定时任务的AI对话要和我开的顶层（或者AI开的顶层对话）一样，该有的内容信息都要有，不能砍；（机制共通）”。
// 这里只出字和数据，不碰页面结构，各页自己摆。逻辑原样搬自 chat/page.js（两版同一套，本人禁令 11-24 14:16）。
// 依赖 live-ui.js、chats/draw10.js（LiveUI.chatFields、LiveUI.draw10）、chats/helper-purpose.js（LiveUI.chatHelperPurpose）。
// 用法：const V = LiveChatView.create({ viewer: () => 'owner'|'public', chat: () => 对话数据, at: () => 读数时刻, route: path => path })；
// 每次调用现读页面当前的 viewer、chat、at。
(() => {
  'use strict';
  function create({ viewer: viewerNow, chat: chatNow, at: atNow, route = path => path }) {
    const U = window.LiveUI, { esc } = U;
    let viewer = 'public', chat = null, at = null;
    const sync = () => { viewer = viewerNow(); chat = chatNow(); at = atNow(); };
    const { states: STATE, rowState, stepState, stepWord: knownStepWord, planInfo, helperTotal: countHelpers, contentLocked, detailReply, stageLabel, plain } = U.chatFields;

    const marker = (v, kind, name = '内容') => v && (v.hidden || v.visibility || v.public || v.rewrite) ? window.LiveUI.fieldHtml({ text: kind === 'owner' ? '' : undefined, hidden: kind !== 'owner' && (v.hidden || v.visibility === 'owner' || v.public === 'owner'), visibility: v.visibility, public: v.public, rewrite: v.rewrite, hidden_what: v.hidden_what }, { name, kind }) : '';
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
    // 后台把改写标记标在这一块（chat.visitor_labels.summary）或正文对象自己身上（summary.visitor_labels.text）的，在显示这段字的地方挂签；整场藏着的只在页头挂
    const fieldTag = (keys, what, own) => !chat || U.visitorWholeHidden(chat) ? '' : U.visitorLabel(chat, keys, what, viewer) || (own && typeof own === 'object' ? U.visitorLabel(own, ['$', 'text'], what, viewer) : '');
    // 签和句末几个字放进同一个不折行的块（现有的 .live-unit），签不单独掉到下一行（不出现末行只剩“到。”加一个签）
    const withTag = (html, tag) => {
      if (!html || !tag || /\blive-mark--(?:reworded|rewritten)\b/.test(html)) return html;
      const tail = /(?:&[a-z0-9#]+;|[^<>&\s]){1,4}$/i.exec(html);
      return tail ? `${html.slice(0, tail.index)}<span class="live-unit">${tail[0]}${tag}</span>` : html + tag;
    };
    // 一段 html 去掉“仅本人可见”“换了说法”这类标记以后的字，拿来比两处是不是一字不差（对话页整页同一段字只摆一次）
    const flatWords = html => { const el = document.createElement('div'); el.innerHTML = html || ''; el.querySelectorAll('.live-mark').forEach(m => m.remove()); return el.textContent.replace(/\s+/g, ' ').trim().replace(/[。．.]$/, ''); };
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
    function helperWords(h, full = false) {
      if (contentLocked(chat, viewer) || contentLocked(h, viewer)) return { name: '', detail: '', mark: '' };
      const task = U.chatHelperPurpose(h, chat, viewer, field);
      const mark = markOf(task?.purpose || h.title, h);
      const name = task ? chatCell(task.purpose, '帮手名', chat, full ? 0 : task.limit, true)
        : viewer === 'public' && mark === 'owner' ? '' : '未记录具体任务';
      // 派活时的原名（多是内部代号）收在“帮手原名”里，点开能看；两版同一套（本人禁令 11-24 14:16），后台藏了的照后台
      const raw = field(h.title, h, chat, 'title'), words = visibleText(raw);
      const original = words && !U.chatHelperPurpose.placeholder.test(words) && words !== visibleText(task?.purpose) && chatCell(raw, '帮手名', chat, 0, true);
      const detail = original ? `<details class="row__sub"><summary class="more">帮手原名</summary><p style="overflow-wrap:anywhere">${original}</p></details>` : '';
      return { name, detail, mark };
    }
    // 什么时候：同一天只写钟点，前一天写“昨天”，再早写日子。
    const validTime = t => typeof t === 'string' && Number.isFinite(Date.parse(t));
    const dayOf = t => U.date(t), stamp = t => { const now = at || chat?.at, day = dayOf(t); if (!now || !Number.isFinite(Date.parse(t))) return day ? `${day} ${U.time(t)}` : ''; return day === dayOf(now) ? U.time(t) : day === dayOf(new Date(Date.parse(now) - 86400000).toISOString()) ? `昨天 ${U.time(t)}` : `${day} ${U.time(t)}`; };
    const outcomeVerbs = { done: '完成于', stopped: '停止于', failed: '出错于' };
    function helperStatus(h) {
      const kind = U.chatFields.statusKind(h);
      // 主对话归档会连带标记帮手，只有帮手自己的结局或交回记录才能证明它怎么停下。
      const parentArchived = kind === 'archived' && h.sort_at_source !== 'delivered_at' && !validTime(h.delivered_at);
      const outcome = (!kind || parentArchived || kind === 'unknown')
        && Object.hasOwn(outcomeVerbs, h.state);
      const label = outcome ? STATE[h.state] : chatState(h);
      const last = validTime(h.at) ? stamp(h.at) : '';
      const lastOnly = ['last_event', 'last_activity'].includes(h.sort_at_source);
      if ((parentArchived && !outcome) || [STATE.unknown, STATE.ended_unknown].includes(label)) {
        return { label: '没读到结局', activity: last ? `最后一次动静是 ${last}` : '', unknown: true };
      }
      if (outcome && last)
        return { label, activity: `${lastOnly ? '最后一次动静是' : outcomeVerbs[h.state]} ${last}` };
      return { label, activity: U.chatFields.helperActivity(h, at) };
    }

    // 帮手一行的内容：状态、名字、型号、最后记录时间、帮手原名、帮手详情和能不能点开。两页摆法不同、内容同一份
    function helperRow(d, index, spoken = () => false) {
      const key = d.id || `helper-${index}`;
      if (d.q === 'warming') return { key, warming: true };
      const { name, detail } = helperWords(d), { label: state, activity } = helperStatus(d);
      const model = who(d), head = name || U.fieldHtml(model || (!state ? '一个帮手' : ''));
      const canOpen = !contentLocked(chat, viewer) && !contentLocked(d, viewer);
      const meta = ['帮手', name && model, activity].filter(Boolean).join(' · ');
      const details = { ...d };
      if (spoken(visibleText(d.localized?.summary?.text ? d.localized.summary : d.summary))) {
        details.summary = null;
        if (d.localized?.summary) details.localized = { ...d.localized, summary: null };
      }
      if (spoken(visibleText(d.reply ?? d.latest_reply))) details.reply = details.latest_reply = null;
      return { key, name, detail, state, model, head, activity, canOpen, meta, running: d.state === 'running', lamp: U.status(d, { small: true }).lamp, more: U.draw10?.helperDetailHtml?.(details, viewer, chat) || '' };
    }

    // 计划的一步：不改名、不加项；只照数据画勾和“在做”，当前这一步按 step_index 标出
    function station(p, i, current) {
      const s = stepState(p), word = stepWord(s), v = field(p.text, p, chat);
      const label = privatePlan(p) ? '' : markOf(p.text, p) ? plainName(p.text, p, '计划') : chatCell(v, '计划', chat, 0, true);
      return { key: p.id || `plan-${i}`, label, word: word ? esc(word) : '', state: s === 'done' ? 'done' : i === current ? 'now' : s === 'pending' ? 'pending' : '', lamp: U.status(p, { small: true }).lamp };
    }

    // —— 过程记录：普通对话按已有时刻排，自动任务有逐步记录时一起列出 ——
    const hasNewTimes = () => ['session_started_at', 'turn_started_at', 'source_at'].some(k => Object.hasOwn(chat, k));
    const startTimes = () => (hasNewTimes()
      ? [['session', chat.session_started_at, '对话开始'], ['turn', chat.turn_started_at, '本轮开始']]
      : [['born', chat.born, '本次记录起于']]).filter(([, t]) => validTime(t));
    const logCell = (value, label) => chatCell(value, label, chat, 0, true) || chatCell(value, label, chat);
    function rounds() {
      // 逐轮回包的字段只在这里读。旧回包只从实际记下的开始时刻中取轮，不拿最后动静当作派工时间。
      const typed = Array.isArray(chat.turns) && chat.turns.length > 0;
      const records = typed ? chat.turns : startTimes().map(([key, started_at, word]) => ({
        id: key, started_at, word, source: key === 'turn' && chat.session_started_at !== started_at ? undefined : chat.source,
        dispatched_by: chat.dispatched_by, question: key === 'session' ? chat.task_prompt : null,
      }));
      const sorted = records.filter(r => validTime(r?.started_at)).sort((a, b) => Date.parse(b.started_at) - Date.parse(a.started_at));
      const fallback = new Set();
      const list = sorted.filter(r => typed || !fallback.has(Date.parse(r.started_at)) && fallback.add(Date.parse(r.started_at))).map((r, i) => ({
        id: r.id, key: `round-${Date.parse(r.started_at)}-${encodeURIComponent(r.id ?? i)}`, at: r.started_at, number: r.number, record: r, helpers: [],
        question: r.question, summary: r.summary, reply: r.reply, pending: ACTIVE.includes(r.state) || !typed && i === 0 && ACTIVE.includes(chat.state),
        knownEmpty: Array.isArray(r.helper_ids) && r.helper_ids.length === 0 || !typed && countHelpers(chat) === 0,
      }));
      const latest = list[0], byTime = t => validTime(t) && list.find(r => Date.parse(t) >= Date.parse(r.at));
      if (!typed && latest) {
        for (const [key, value] of [['summary', chat.summary], ['reply', detailReply(chat)]])
          if (byTime(value?.at) === latest) latest[key] = value;
      }
      for (const h of U.chatFields.helperList(chat)) {
        const explicit = list.find(r => h.turn_id != null && h.turn_id === r.id ||
          h.id && Array.isArray(r.record.helper_ids) && r.record.helper_ids.includes(h.id));
        const round = explicit || (h.turn_id == null && byTime(h.started_at || h.dispatched_at));
        if (round && (explicit || !Array.isArray(round.record.helper_ids))) round.helpers.push(h);
      }
      return list.map(r => {
        const origin = U.chatFields.originLabel({ ...chat, source: r.record.source, dispatched_by: r.record.dispatched_by });
        const provider = { claude: 'Claude', codex: 'Codex', antigravity: 'Antigravity' }[chat.software || chat.id?.split(':')[0]];
        const start = r.record.source === 'manual' && !r.record.dispatched_by && provider ? `本人问 ${provider}` : origin;
        const body = (key, label) => r[key] == null ? '' : logCell(field(r[key], typed ? r.record : chat, chat,
          !typed && key === 'question' ? 'task_prompt' : key), label);
        const replyAt = r.record.replied_at || r.reply?.at;
        return { ...r, question: body('question', '任务原文'), summary: body('summary', '正式摘要'), reply: body('reply', '最新回复'),
          title: [Number.isInteger(r.number) && r.number > 0 ? `第 ${r.number} 轮` : r.record.word || '本轮开始', start === '来源没认出' ? '' : start].filter(Boolean).join(' · '),
          replyAt: validTime(replyAt) ? U.time(replyAt) : '' };
      });
    }
    function roundHelper(h) {
      const { label, activity, unknown } = helperStatus(h), kind = U.chatFields.statusKind(h);
      const failed = kind === 'failed' || label === STATE.failed;
      const stopped = kind === 'interrupted' || kind.endsWith('_stopped') || label === STATE.stopped;
      const state = unknown ? 'unknown' : failed ? 'failed' : stopped ? 'stopped' : kind === 'archived' ? 'done' :
        h.state === 'failed' ? label : h.state;
      const words = who(h);
      const name = U.fieldText(model(h), viewer);
      const modelLabel = name && words ? words.replace(/^型号没记下(?= · |$)/, '型号没读到') : ['型号没读到', h.effort].filter(Boolean).join(' · ');
      const reason = failed && !contentLocked(h, viewer) ? chatCell(field(h.failure_reason, h, chat), '出错原因', chat, 0, true) : '';
      return { state, failed, model: modelLabel, name: helperWords(h).name, reason, result: [label, activity].filter(Boolean).join(unknown ? '，' : ' · ') };
    }
    function events({ includeSteps = false } = {}) {
      const list = startTimes().map(([key, at, word]) => ({ key, at, word, name: esc(U.chatFields.originLabel(chat)) }));
      const reply = [detailReply(chat), chat.latest_reply, chat.reply].filter(v => validTime(v?.at)).sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0];
      for (const [i, h] of (Array.isArray(chat.helpers) ? chat.helpers : []).entries()) if (validTime(h.at)) {
        const { name, detail, mark } = helperWords(h, true), model = U.fieldText(U.draw10 ? U.draw10.modelName(h) : h.model, viewer);
        const { label, unknown } = helperStatus(h);
        const sub = [name && '帮手', name && model, unknown && '最后一次动静'].filter(Boolean).join(' · ');
        list.push({ key: `h-${h.id || i}`, at: h.at, word: label, name: name || U.fieldHtml(model), sub, detail, clipName: !!name, lamp: U.status(h, { small: true }).lamp, mark });
      }
      for (const [key, v, word, name, label] of [['summary', chat.summary, '摘要', '写好正式摘要', '正式摘要'], ['reply', reply, '回复', '发出最新回复', '最新回复']]) if (v && typeof v === 'object' && validTime(v.at)) {
        const original = replyBody(key === 'summary' ? U.chatProgressText(v, chat, viewer) : v), body = logCell(original, label);
        const tag = body ? fieldTag(key === 'summary' ? 'summary' : ['reply', 'latest_reply'], label, v) : '';
        list.push({ key, at: v.at, word, name: esc(name), parts: [withTag(body, tag)] });
      }
      const steps = includeSteps && Array.isArray(chat.automation_steps) ? chat.automation_steps : [];
      for (const [i, step] of steps.entries()) {
        const progress = logCell(field(step?.text, step, chat, 'text'), '进展');
        const thinking = logCell(field(step?.thinking, step, chat, 'thinking'), '思考摘要');
        if (progress || thinking) list.push({ key: `step-${i}`, at: validTime(step?.at) ? step.at : null,
          word: progress ? '进展' : '思考摘要', parts: [progress, thinking] });
      }
      if (validTime(chat.at) && !list.some(e => Date.parse(e.at) === Date.parse(chat.at))) list.push({ key: 'update', at: chat.at, word: '主对话更新' });
      return list.sort((a, b) => (Date.parse(b.at) || 0) - (Date.parse(a.at) || 0));
    }
    function recordEnd(list) {
      if (hasNewTimes()) return chat.source_at;
      const compact = chat.compaction, times = compact?.count >= 1 ? compact.times || [] : [];
      const clocks = compact?.count >= 1 ? (compact.events || []).map((e, i) => times[i] ?? e?.at) : [];
      // 自动任务的逐步记录只影响过程列表，页头继续用原来的时刻口径。
      const latest = list.find(e => !e.key.startsWith('step-'));
      return [chat.at, latest?.at, ...times, ...clocks].filter(validTime).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
    }

    // 页头那句：最新进展、回复或正式摘要里先有的那一样
    function workLine(d, reply) {
      const progress = [d.doing, d.progress, d.text].find(value => {
        if (value === d.text && U.chatFields.quota(d, viewer)) return false;
        const words = visibleText(field(value, d));
        return words && words !== visibleText(field(d.thinking, d)) && words !== rowState(d, viewer) && !/^(?:第\s*\d+\s*[\/／]\s*\d+\s*步|仅本人可见|没有记录|没有标题|asking|在干|等你回答|等本人回答|做完了|已停止|出错了|结局没读到|状态不明)$/.test(words);
      });
      const say = ['done', 'waiting'].includes(d.state) && d.summary?.text && d.summary.text === d.text ? d.summary : progress ?? reply ?? d.summary;
      const body = replyBody(say === d.summary ? U.chatProgressText(say, d, viewer) : say);
      const what = say === d.summary ? '正式摘要' : say === reply ? '最新回复' : '最新进展';
      const key = say === d.summary ? 'summary' : say === reply ? ['reply', 'latest_reply'] : say === d.doing ? 'doing' : say === d.progress ? 'progress' : 'text';
      return { say: body, latest: chatCell(body, what, d), tag: say == null ? '' : fieldTag(key, what, say) };
    }

    // 思考摘要：有标题的先写标题；只有外文思考时，后台给缺因（field_gaps.thinking），先说一句为什么是英文，再给原文。
    // keep：页面要整页去重时传进来（对话页的 once），思考摘要、它头上那行任务名跟上面摆过的一字不差就不出；不传照旧都出
    function thought(keep = () => true) {
      const raw = field(chat.thinking, chat), words = visibleText(raw);
      const heading = field(field(chat.thinking_heading?.title, chat.thinking_heading), chat), head = visibleText(heading);
      const drawn = chat.thinking ? chatCell(raw, '思考摘要', chat, 0, true) || chatCell(raw, '思考摘要', chat) : '', thought = drawn && keep(drawn) ? drawn : '';
      const lead = thought && words && head && head !== words && head !== visibleText(field(chat.title, chat)) && chatCell(heading, '任务', chat, 0, true), title = lead && keep(lead) ? lead : '';
      const gap = thought && typeof chat.field_gaps?.thinking === 'string' ? chat.field_gaps.thinking : '';
      const head2 = (title ? `<b class="route-think__lead">${title}</b>` : '') + (gap ? `<small class="route-think__lead" style="font-weight:400;color:var(--route-muted, #848b87)">${esc(gap)}</small>` : '');
      return { thought, title, gap, head: head2, html: thought ? head2 + thought : '' };
    }

    // 页头信息：型号档位、来源、第几步、各项时刻、报了几分钟、历时、实际工时、帮手几个、所属项目、App 标签
    function pageMeta({ automation = false, showElapsed = true, includeLogSteps = false } = {}) {
      const locked = contentLocked(chat, viewer), name = field(chat.title, chat), hiddenName = !locked && viewer === 'public' && (name.visibility === 'owner' || name.hidden), title = chatTitle(chat);
      const replyGap = Array.isArray(chat.field_gaps) ? chat.field_gaps.find(g => g.field === 'latest_reply') : chat.field_gaps?.latest_reply;
      const gapReason = typeof replyGap === 'string' ? replyGap : replyGap?.reason || replyGap?.gap;
      const missingReply = (typeof gapReason === 'string' ? gapReason.replace(/^最新回复[：: ]*/u, '').replace(/ · 没有最新回复[。.]?$/u, '') : gapReason) || '还没读到';
      const duration = seconds => {
        const hours = Math.floor(seconds / 3600), mins = Math.floor(seconds / 60) % 60, secs = seconds % 60;
        return [hours && `${hours} 小时`, mins && `${mins} 分`, (secs || !seconds) && `${secs} 秒`].filter(Boolean).join(' ');
      };
      const e = chat.estimate, actual = Object.hasOwn(chat, 'worked_seconds') ? chat.worked_seconds : Number.isFinite(e?.worked_min) ? Math.round(e.worked_min * 60) : null;
      const timing = [showElapsed && Number.isFinite(chat.elapsed_seconds) && `${automation ? 'AI 对话历时' : '历时'} ${duration(chat.elapsed_seconds)}`,
        showElapsed && Number.isFinite(actual) && `实际工时 ${duration(actual)}`].filter(Boolean).join(' · ');
      const plan = planInfo(chat), log = locked ? [] : events({ includeSteps: includeLogSteps }), end = recordEnd(log);
      const progress = locked ? plan.label || plan.count : plan.plan[plan.current] && plan.label;
      const rawReply = locked ? null : detailReply(chat);
      const hasReply = String(text(rawReply) ?? '').trim() !== '';
      const helpers = countHelpers(chat), dates = startTimes()
        .filter(([key, t]) => key !== 'session' || !title.endsWith(`${U.time(t)} 开始的对话`))
        .filter(([key, t]) => !automation || key !== 'session' || when(t) !== when(chat.turn_started_at))
        .map(([key, t, label]) => `${automation && key === 'turn' ? 'AI 开始处理' : label} ${when(t)}`);
      if (locked && !dates.length) {
        const [start, label] = U.chatStart(chat);
        if (start) dates.push(`${label} ${when(start)}`);
      }
      if (validTime(chat.at)) dates.push(`主对话更新 ${when(chat.at)}`);
      if (validTime(end)) dates.push(`${hasNewTimes() ? '数据截止' : '最近一条记录'} ${when(end)}`);
      const meta = [who(chat, true), U.chatFields.originLabel(chat, false), locked && stageLabel(chat), progress, ...dates, e?.planned_min != null && `报 ${Math.round(e.planned_min)} 分钟`, timing, e?.over_min > 0 && `超了 ${U.minutes(e.over_min)}`, helpers === 0 ? '没有派帮手' : helpers && `帮手 ${helpers} 个`].filter(Boolean);
      const project = (chat.project || chat.project_name) && projectInfo(chat);
      const app = U.chatFields.appTag(chat);
      return { locked, name, hiddenName, title, missingReply, plan, log, progress, rawReply, hasReply, meta, project, app };
    }

    // 正在执行下面那几行：正式摘要、最新回复（没有时写原因）、任务原文。
    // keep：对话页的整页登记（once），跟上面摆过的（页头、最新进展、这一步）或这几行之间一字不差的不再摆；不传时只在这几行里互相比
    function facts(rawReply, hasReply, missingReply, keep) {
      const seen = new Set(), once = keep || (html => { const w = flatWords(html); if (seen.has(w)) return false; if (w) seen.add(w); return true; });
      const facts = [];
      const summary = replyBody(U.chatProgressText(chat.summary, chat, viewer)), reply = replyBody(rawReply);
      if ((text(summary) != null || summary?.hidden || summary?.visibility === 'owner' || summary?.public === 'owner' || pending(summary) || summary?.q === 'warming') && (viewer === 'public' && field(summary, summary, chat).visibility === 'owner' || once(chatCell(summary, '正式摘要', chat, 0, true)))) facts.push(['', withTag(chatCell(summary, '正式摘要', chat), fieldTag('summary', '正式摘要', chat.summary))]);
      const replyContent = hasReply || !!(rawReply && (markOf(rawReply, rawReply) || pending(rawReply) || rawReply.q === 'warming'));
      // M684：最新回复访客那边不一样的（整块 reply / latest_reply，或正文对象里只换了词的 reply.visitor_labels.text），在这一行末挂签
      const replyTag = blockTag(['reply', 'latest_reply'], '最新回复');
      if (!replyContent) facts.push(['最新回复', privateSaid(missingReply, chat), false]);
      else if (once(privateSaid(reply, chat))) {
        facts.push(['最新回复', privateSaid(reply, chat) + replyTag]);
      }
      const prompt = chatCell(chat.task_prompt, '任务原文', chat);
      if (prompt && once(chatCell(chat.task_prompt, '任务原文', chat, 0, true))) facts.push(['', prompt]);
      return facts;
    }
    // M930：“对外换了说法”访客版同一处也挂（visitorLabel 给访客只出这一种，“访客看不到”照旧只给本人）
    const blockTag = (key, what) => !U.visitorWholeHidden(chat) ? U.visitorLabel(chat, key, what, viewer) : '';

    const api = { marker, model, who, text, pending, field, replyBody, fieldTag, withTag, flatWords, chatCell, said, privateSaid, headerNote, chatTitle, when, projectInfo, actions,
      privatePlan, wholeOwner, chatState, stepWord, markOf, plainName, marks, visibleText, helperWords, dayOf, stamp, helperRow, station,
      validTime, hasNewTimes, startTimes, events, rounds, roundHelper, recordEnd, workLine, thought, pageMeta, facts, blockTag };
    // 对外的每个函数先现读一次页面当前的 viewer、chat、at，函数之间互相调用时不再重读
    const out = { lockedFields, ACTIVE, STATE };
    for (const [key, fn] of Object.entries(api)) out[key] = (...args) => { sync(); return fn(...args); };
    return out;
  }
  window.LiveChatView = { create };
})();

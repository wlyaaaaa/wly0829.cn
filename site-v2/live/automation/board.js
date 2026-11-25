// 实况 · 自动任务：后台 AI 替本人干的八类活。上半部照 AI 对话页的用法（本人 11-24 01:36 FEDQ1 选 A）：
// 页头、一排分类按钮、在干、出毛病的、近 72 小时跑完、没做成、暂时不修的（一轮一张卡，自动修理一件一张卡）、更早的按天看；
// 下半部是这周做成了多少、八类总表（开关、几点跑、用谁、上次结果、近 30 天，点一行原地展开怎么干）。
// 读 /computer-access/live/v1/automation 和每一轮的列表 automation/runs（取数和转换在 runs.js）。
// 网址：?category=<类> 只看一类；?family=claude|codex|antigravity 只看一家（旧链接的 ?host= 也认）；?date=today|YYYY-MM-DD 只看那天；?status=running|completed|incomplete 只看一种结局；
// ?type=<类> 照旧展开八类表里那一行。一轮的详情在 /live/automation/run/?type=<类>&run=<轮号>（后台给的 ?type=…&run=… 转过去）。
// 单件活（?work=）、修理的小类（?type=backup 这类）、按项目看（?project=）仍走原来的页 /live/automation/work/。
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const IDS = ['auto-repair', 'message-review', 'translator', 'weekly-rules', 'weekly-laptop', 'weekly-live', 'excerpt', 'ai-commitments'];
  const typeParam = params.get('type');
  if (params.has('run')) {
    location.replace('/live/automation/run/' + location.search + location.hash);
    return;
  }
  if (params.has('work') || params.has('project') || (typeParam && !IDS.includes(typeParam))) {
    location.replace('/live/automation/work/' + location.search + location.hash);
    return;
  }
  const T = window.LiveTape, U = window.LiveUI, Live = window.Live, G = window.LiveAutomationGuide || {}, R = window.AutomationRuns, { esc } = U;
  const { list, known, int, dec, link, when, big, clock } = T;
  let state, viewer = 'public', open = typeParam, busy = false, feedback = null, landed = false, pausing = null, flipping = null, olderOpen = false;
  const F = (v, name) => T.field(v, viewer, name);
  // 类名是后台给的，“替你看新消息”在公开版改成“替本人”
  const cn = v => viewer === 'owner' || typeof v !== 'string' ? v : v.replace(/^替你/, '替本人');
  const you = () => T.you(viewer);
  const mode = c => c?.setting?.mode;
  const pauseOf = (d, id) => list(d.provider_pauses).find(p => list(p.categories).includes(id));
  const minutes = s => known(s) ? (s < 3600 ? `${Math.max(1, Math.round(s / 60))} 分钟` : `${Math.floor(s / 3600)} 小时 ${Math.round(s % 3600 / 60)} 分`) : '';

  // —— 筛选：网址里带的，和点分类按钮改的 ——
  const DAY = /^\d{4}-\d{2}-\d{2}$/;
  const filter = {
    category: IDS.includes(params.get('category')) ? params.get('category') : null,
    // 只看一家一律写 ?family=；后台旧链接带 ?host= 的也认
    family: [params.get('family'), params.get('host')].map(v => String(v || '').toLowerCase()).find(v => Object.hasOwn(R.FAMILIES, v)) || null,
    date: params.get('date') === 'today' || DAY.test(params.get('date') || '') ? params.get('date') : null,
    status: ['running', 'completed', 'incomplete'].includes(params.get('status')) ? params.get('status') : null,
  };
  // 今天的北京日期（YYYY-MM-DD）
  const today = () => T.dayKey(new Date().toISOString());
  const dayOf = date => date === 'today' ? today() : date;
  function setFilter(next) {
    const dateChanged = Object.hasOwn(next, 'date') && next.date !== filter.date;
    Object.assign(filter, next);
    const url = new URL(location.href);
    url.searchParams.delete('host');
    for (const key of ['category', 'family', 'date', 'status']) if (filter[key]) url.searchParams.set(key, filter[key]); else url.searchParams.delete(key);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    if (dateChanged) watchRuns();
    draw();
  }

  // —— 每一轮：七类各读一份列表（摘一句只读今天的条数）；读口还没装上时退回 automation 里已有的在跑和最近几次 ——
  const pages = new Map();
  let excerptToday, subs = [];
  function watchRuns() {
    for (const s of subs) s.stop();
    subs = []; pages.clear(); backPages.clear(); excerptToday = undefined;
    const date = filter.date ? dayOf(filter.date) : null;
    for (const id of IDS.filter(x => x !== 'excerpt')) {
      subs.push(Live.watch('automation/runs', { category: id, date }, { phase(st) { pages.set(id, st); readBack(id, st); schedule(); } }));
    }
    subs.push(Live.watch('automation/runs', { category: 'excerpt', date: today() }, { phase(st) { excerptToday = st; schedule(); } }));
  }
  let queued = 0;
  const schedule = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; draw(); }); };

  // 近 72 小时：一类跑得多、第一页 50 轮没铺到 72 小时的边时，用读口现成的翻页（cursor）接着往后读，读到 72 小时以前那一轮为止（主控 11-25）。
  // 第一页一换（来了新的一轮、换了本人版／公开版）就从头再翻一遍；某一批没读到就先照已读到的画，等第一页下次刷新再接着读
  const backPages = new Map();
  const lastAtOf = x => T.stamp(x?.last_activity_at || x?.finished_at || x?.started_at || x?.queued_at);
  function readBack(id, st) {
    const d = st?.data;
    if (filter.date || !Array.isArray(d?.items)) { backPages.delete(id); return; }
    const edge = Date.now() - 72 * 3600000, past = items => items.length > 0 && (lastAtOf(items.at(-1)) ?? Infinity) < edge;
    const sign = `${st.viewer?.kind || ''}|${d.items[0]?.run_id}|${d.items.length}|${d.next ?? ''}`;
    if (backPages.get(id)?.sign === sign) return;
    const job = { sign, rows: [], done: d.next == null || past(d.items) };
    backPages.set(id, job);
    if (job.done) return;
    (async () => {
      const seen = new Set();
      for (let next = d.next; next != null && !seen.has(String(next));) {
        seen.add(String(next));
        const s = await Live.get('automation/runs', { category: id, cursor: next }).catch(() => null);
        if (backPages.get(id) !== job || !Array.isArray(s?.data?.items)) break;
        job.rows.push(...s.data.items);
        next = s.data.next;
        if (next == null || past(s.data.items)) { job.done = true; break; }
      }
      if (backPages.get(id) === job) schedule();
    })();
  }

  // 七类的读数拼成一份：rows 是有的行；legacy=true 表示读口没装上、用的是老读数拼的
  function collect(d) {
    const ids = IDS.filter(x => x !== 'excerpt'), states = ids.map(id => pages.get(id));
    const answered = states.filter(s => s && (s.data || s.meta?.status >= 400 || s.phase === 'none' || s.phase === 'gone'));
    const got = ids.map((id, i) => ({ id, p: R.page(states[i]?.data, viewer) })).filter(x => x.p);
    if (got.length) {
      // 第一页的行，接上往后翻到的行（同一轮只留一份）
      const rows = [], keys = new Set();
      for (const { id, p } of got) for (const r of [...p.rows, ...(filter.date ? [] : list(backPages.get(id)?.rows).map(x => R.run(x, viewer)))]) {
        if (r.category && r.id && !keys.has(r.key)) { keys.add(r.key); rows.push(r); }
      }
      return { rows, legacy: false, waiting: answered.length < states.length, capped: got.some(({ id, p }) => p.more && (filter.date || !backPages.get(id)?.done)) };
    }
    if (answered.length < states.length) return { rows: [], legacy: false, waiting: true };
    return { rows: R.fallback(d, viewer), legacy: true, waiting: false };
  }
  const inWindow = r => {
    if (filter.date) { const key = dayOf(filter.date); return [r.queuedAt, r.startedAt, r.lastAt].some(at => T.dayKey(at) === key); }
    return r.status === 'running' || Date.now() - (T.stamp(r.lastAt) || 0) < 72 * 3600000;
  };
  // 自动修理一件一张卡，几轮收在卡里；别的一轮一张卡
  function cards(rows) {
    const out = [], repairs = new Map();
    for (const r of rows) {
      if (r.category === 'auto-repair' && r.subject) {
        const key = `repair:${r.subject.id}`;
        if (!repairs.has(key)) { const card = { kind: 'repair', key, category: r.category, subject: r.subject, rounds: [] }; repairs.set(key, card); out.push(card); }
        repairs.get(key).rounds.push(r);
      } else out.push({ kind: 'run', key: r.key, category: r.category, run: r });
    }
    for (const c of repairs.values()) {
      c.rounds.sort((a, b) => (T.stamp(a.startedAt) || 0) - (T.stamp(b.startedAt) || 0));
      c.run = c.rounds.find(r => r.status === 'running') || c.rounds.at(-1);
    }
    for (const c of out) { c.status = c.run.status; c.at = T.stamp(c.run.lastAt) || T.stamp(c.run.startedAt) || 0; }
    return out.sort((a, b) => b.at - a.at);
  }
  function view(d) {
    const got = collect(d);
    const rows = got.rows.filter(r => r.category !== 'excerpt' && inWindow(r)
      // 暂缓的轮次照暂缓显示，不算“跑完的”也不算“没做成的”（没有单独的“暂时不修”筛选，主控 11-25）
      && (!filter.family || r.family === filter.family) && (!filter.status || r.status === filter.status && !r.deferred));
    const all = cards(rows), mine = c => !filter.category || c.category === filter.category;
    const live = all.filter(c => c.status === 'running');
    const problems = filter.family || filter.date || (filter.status && filter.status !== 'incomplete') ? [] : problemsOf(d, live);
    const count = id => all.filter(c => c.category === id).length + problems.filter(p => p.category === id).length;
    return { ...got, live: live.filter(mine), done: all.filter(c => c.status !== 'running' && mine(c)), problems: problems.filter(p => mine(p)), count, total: all.length + problems.length, byId: new Map(got.rows.map(r => [r.key, r])) };
  }
  // 出毛病的：后台在各类下给 problem；正在修、已经摆在“在干”里的那件不再写一遍
  function problemsOf(d, live) {
    const running = new Set(live.flatMap(c => [c.run.id, c.subject?.href].filter(Boolean)));
    return list(d.categories).filter(c => IDS.includes(c.id) && c.problem && (c.problem.text || c.problem.title))
      .map(c => ({ category: c.id, ...c.problem }))
      .filter(p => !(p.run_id && running.has(p.run_id)) && !(p.href && running.has(T.path(p.href))));
  }

  // —— 卡片 ——
  const catLabel = (d, id) => F(cn(list(d.categories).find(c => c.id === id)?.title || R.catName(id, viewer)), '类别');
  const range = r => {
    const a = r.startedAt || r.queuedAt, b = r.finishedAt;
    if (!T.stamp(a)) return b ? esc(when(b)) : '';
    if (!T.stamp(b) || T.clock(a) === T.clock(b) && T.dayKey(a) === T.dayKey(b)) return esc(when(a));
    return `${esc(when(a))}–${esc(T.dayKey(a) === T.dayKey(b) ? T.clock(b) : when(b))}`;
  };
  const who = r => r.who?.text ? esc(r.who.text) : '';
  const go = (href, text = '看经过') => href ? `<a class="au-card__go" href="${esc(href)}">${text} <span aria-hidden="true">›</span></a>` : '';
  const outLink = o => {
    const label = o.kind === 'owner_item' ? `${F(o.title, '那张卡') || ''}那张卡` : o.kind === 'ledger_item' ? `账本${o.title ? `：${F(o.title, '账本那件')}` : '那件'}`
      : o.kind === 'commit' ? `提交${o.title ? `：${F(o.title, '提交')}` : ''}` : `${F(o.title, '文档') || '文档'}${o.version ? ` 第 ${esc(o.version)} 版` : ''}`;
    return o.href ? `<a class="tp-link" href="${esc(o.href)}">${label} ›</a>` : `<span>${label}</span>`;
  };
  function outputs(r) {
    if (r.outputs.length) return `<p class="au-card__outs">${r.outputs.map(outLink).join('')}</p>`;
    if (r.outputCount > 0 && r.href) return `<p class="au-card__outs"><a class="tp-link" href="${esc(r.href)}">做出 ${int(r.outputCount)} 样，看经过 ›</a></p>`;
    return '';
  }
  // 两轮互相指着：没做成的写“几点接着做了 ›”，接着做的写“接着 几点 那一轮 ›”
  function chain(r, v) {
    const other = id => v.byId.get(`${r.category}:${id}`);
    if (r.resumedBy) { const o = other(r.resumedBy); return link(R.runPath(r.category, r.resumedBy), `${o ? esc(when(o.startedAt)) + ' ' : '后来'}接着做了 ›`); }
    if (r.resumes) { const o = other(r.resumes); return link(R.runPath(r.category, r.resumes), `接着 ${o ? esc(when(o.startedAt)) + ' ' : '上次'}那一轮 ›`); }
    return '';
  }
  // 暂缓（暂时不修）是灰点，和没做成的红点分开（M674）
  const tone = r => r.status === 'running' ? 'run' : r.deferred ? 'off' : r.status === 'incomplete' ? 'bad' : r.status === 'completed' ? 'ok' : 'off';
  // 暂缓的轮次大字只写“暂时不修”，为什么写在卡片最下面那行小字里（主控 11-25）
  const endText = r => r.deferred ? '暂时不修' : `没做成：${F(r.reason, '原因') || '原因没记下'}`;
  function card(d, v, c) {
    const r = c.run, since = T.stamp(r.startedAt);
    let head = `<p class="au-card__cat">${catLabel(d, c.category)}</p>`;
    let title, body = '', meta;
    if (c.kind === 'repair') {
      // 第几轮只用后台给的 subject.round；没给就不写，不按列表里排第几自己编（列表和详情要对得上，验收 11-24 07:15）
      const nth = x => known(x.subject?.round) && x.subject.round > 0 ? x.subject.round : null;
      // 这件活的名字已经写在卡片上面那行，后台 summary 里又带着它的就去掉（前端 QA 11-25）
      const thing = F(c.subject.title, '这件活'), result = x => R.withoutSubject(F(x.summary, '结果'), thing) || '跑完了';
      const what = `${thing || '一件活'}${nth(r) ? ` · 第 ${int(nth(r))} 轮` : ''}`;
      if (r.status === 'running') title = what;
      else {
        head = `<p class="au-card__cat">${catLabel(d, c.category)} · ${what}</p>`;
        title = r.status === 'incomplete' || r.deferred ? endText(r) : result(r);
      }
      const earlier = c.rounds.filter(x => x !== r);
      if (earlier.length) body += `<p class="au-card__rounds">${earlier.map(x => `<a href="${esc(x.href)}" data-tone="${tone(x)}">${nth(x) ? `第 ${int(nth(x))} 轮 · ` : ''}${range(x)} · ${x.deferred ? '暂时不修' : x.status === 'incomplete' ? '没做成' : result(x)} ›</a>`).join('')}</p>`;
    } else if (r.status === 'incomplete' || r.deferred) title = endText(r);
    else title = F(r.summary, '这一轮做了什么') || (r.status === 'running' ? '正在跑' : '跑完了');
    if (r.status === 'running') {
      const doing = F(r.activity, '正在干什么');
      meta = [who(r), since ? `${esc(T.clock(r.startedAt))} 起，<span data-ran="${since}">跑了 ${minutes((Date.now() - since) / 1000)}</span>` : '', doing && `正在${doing.replace(/^正在/, '')}`].filter(Boolean).join(' · ');
    } else {
      body += r.status === 'incomplete' && !r.deferred ? '' : outputs(r);
      meta = [r.deferred && R.deferredWhy(r, F), range(r), who(r), F(r.trigger, '为什么开这一轮'), chain(r, v)].filter(Boolean).join(' · ');
    }
    if (c.kind === 'repair' && c.subject.href) meta += ` · ${link(c.subject.href, '这件的全部经过 ›')}`;
    // M684：本人版这一轮所挂的对话访客那边不一样的（visitor_labels.conversation），在这行末挂签
    meta += U.visitorLabel({ visitor_labels: r.labels }, 'conversation', '这一轮的对话', viewer);
    return `<article class="au-card" data-tone="${tone(r)}" data-key="${esc(c.key)}"><span class="au-card__dot${r.status === 'running' ? ' is-live' : ''}" aria-hidden="true"></span>
      <div class="au-card__body">${head}<h3 class="au-card__title">${r.href ? `<a href="${esc(r.href)}">${title}</a>` : title}</h3>${body}<p class="au-card__meta">${meta}</p></div>${go(r.href)}</article>`;
  }
  function problemCard(d, p) {
    const href = T.path(p.href) || (p.run_id ? R.runPath(p.category, p.run_id) : '');
    const handler = F(p.handler_text, '谁在处理') || (p.handler ? `已交${catLabel(d, p.handler)}` : '还没人接手');
    const round = known(p.round) && p.round > 0 ? link(href, `第 ${int(p.round)} 轮 ›`) : '';
    const meta = [p.repairing === true ? '<b class="au-ok">AI 在修</b>' : '', handler, round].filter(Boolean).join(' · ');
    return `<article class="au-card" data-tone="warn"><span class="au-card__dot" aria-hidden="true"></span><div class="au-card__body"><p class="au-card__cat">${catLabel(d, p.category)}</p>
      <h3 class="au-card__title">${F(p.title || p.text, '哪里坏了')}</h3><p class="au-card__meta">${meta}</p></div>${p.run_id ? go(R.runPath(p.category, p.run_id)) : ''}</article>`;
  }

  // —— 页头右边：派活程序几点转过一圈 ——
  function dispatchText(d) {
    const x = d.dispatch;
    if (!x) return '';
    const every = known(x.interval_seconds) && x.interval_seconds > 0 ? Math.round(x.interval_seconds / 60) : null;
    const tick = x.last_tick_at || x.heartbeat_at;
    if (!T.stamp(tick)) return '<span class="au-warn">派活程序几点转的没读到</span>';
    const late = every && Date.now() - T.stamp(tick) > 2.5 * x.interval_seconds * 1000;
    return late ? `<span class="au-warn">派活程序 ${esc(when(tick))} 以后没再转${every ? `（该每 ${every} 分钟一次）` : ''}</span>`
      : `派活程序 ${esc(when(tick))} 转过一圈${every ? `，每 ${every} 分钟一次` : ''}`;
  }

  // —— 上半部 ——
  function chips(d) {
    const out = [];
    if (filter.family) out.push(['family', `只看 ${R.FAMILIES[filter.family]} 做的`]);
    if (filter.date) out.push(['date', filter.date === 'today' || filter.date === today() ? '只看今天' : `只看 ${esc(filter.date.slice(5))}`]);
    if (filter.status) out.push(['status', { running: '只看在跑的', completed: '只看跑完的', incomplete: '只看没做成的' }[filter.status]]);
    return out.map(([key, text]) => `<span class="au-chip">${text}<button type="button" data-clear="${key}" aria-label="不${text}">×</button></span>`).join('');
  }
  function catButtons(d, v) {
    const excerpt = excerptToday?.data && known(excerptToday.data.total) ? `今天 ${int(excerptToday.data.total)} 句` : '';
    const btn = (id, label, n) => `<button type="button" class="au-cat" data-cat="${id}" aria-pressed="${(filter.category || '') === id}">${label}${n != null ? ` <b>${n}</b>` : ''}</button>`;
    return `<nav class="au-cats" aria-label="按类看">${btn('', '全部', v.waiting && !v.total ? null : v.total)}${IDS.map(id => id === 'excerpt'
      ? `<button type="button" class="au-cat" data-jump="excerpt" title="摘一句不出卡，点了看这一类怎么干">${catLabel(d, id)}${excerpt ? ` <b>${excerpt}</b>` : ''}</button>`
      : btn(id, catLabel(d, id), v.waiting && !v.count(id) ? null : v.count(id))).join('')}${chips(d)}</nav>`;
  }
  const sec = (id, name, n, html, extra = '') => `<section class="au-sec" id="${id}"><h2 class="au-sec__head">${name}<b> · ${int(n)}</b>${extra}</h2>${html}</section>`;
  function upper(d) {
    const v = view(d), waiting = '<p class="au-empty">正在读…</p>';
    const next = list(d.categories).filter(c => c.next_at && (!filter.category || c.id === filter.category)).sort((a, b) => T.stamp(a.next_at) - T.stamp(b.next_at))[0];
    const idle = `<p class="au-empty">这会儿没在跑${next ? ` · 下一个：${esc(when(next.next_at))} ${catLabel(d, next.id)}` : ''}</p>`;
    const showLive = !filter.status || filter.status === 'running', showDone = filter.status !== 'running';
    const day = filter.date ? (dayOf(filter.date) === today() ? '今天' : `${esc(dayOf(filter.date).slice(5))} 那天`) : '';
    // 这一节的名字照列表里实际有的几种写：绿点“跑完”、红点“没做成”、灰点“暂时不修”，和筛选按钮、卡上的说法一样；
    // 筛了“只看跑完的”“只看没做成的”就只剩那一种。列表空着时照筛选写（主控 11-25：原来不管筛什么都写“跑完的”，下面一列红点对不上）
    const kinds = ['跑完', '没做成', '暂时不修'].filter(k => v.done.some(c => (c.run.deferred ? '暂时不修' : c.status === 'incomplete' ? '没做成' : c.status === 'completed' ? '跑完' : '') === k));
    const doneWhat = `${kinds.length ? kinds.join('、') : filter.status === 'incomplete' ? '没做成' : '跑完'}的`;
    const doneName = `${filter.date ? day : '近 72 小时'}${doneWhat}`;
    const legacy = v.legacy ? '<p class="tp-note" data-tone="off">每一轮的记录后台还没接上：下面先用八类各自最近几次拼出来，点不开经过。</p>' : '';
    const capped = v.capped && !filter.date ? '<p class="tp-small au-capped">有的类这 72 小时跑得多，每类只列最近 50 轮；更早的按天看。</p>' : '';
    return `${catButtons(d, v)}${legacy}
      ${showLive ? sec('running', '在干', v.live.length, v.live.length ? v.live.map(c => card(d, v, c)).join('') : v.waiting ? waiting : idle) : ''}
      ${v.problems.length ? sec('trouble', '出毛病的', v.problems.length, v.problems.map(p => problemCard(d, p)).join('')) : ''}
      ${showDone ? sec('done', doneName, v.done.length, v.done.length ? v.done.map(c => card(d, v, c)).join('') : `<p class="au-empty">${v.waiting ? '正在读…' : `${filter.date ? '这天' : '这 72 小时'}没有${doneWhat}`}</p>`,
        filter.date ? `<button type="button" class="au-sec__back" data-clear="date">回到近 72 小时 ›</button>` : '') : ''}${capped}
      ${older(d)}`;
  }
  // 更早的：近 30 天每天跑了几轮（八类表里的 30 天成坏加起来，摘一句不算），点一天只看那天
  function older(d) {
    const days = new Map();
    for (const c of list(d.categories)) if (c.id !== 'excerpt' && (!filter.category || c.id === filter.category)) for (const x of list(c.daily_30d)) {
      if (!DAY.test(x.date || '')) continue;
      const n = (x.success || 0) + (x.failed || 0), had = x.success != null || x.failed != null;
      const prev = days.get(x.date) || { n: 0, bad: 0, had: false };
      days.set(x.date, { n: prev.n + n, bad: prev.bad + (x.failed || 0), had: prev.had || had });
    }
    const rows = [...days.entries()].sort((a, b) => b[0].localeCompare(a[0]));
    // date 是北京日期 YYYY-MM-DD：按 UTC 解析再取 UTC 星期，不随浏览器本机时区变
    const week = ['日', '一', '二', '三', '四', '五', '六'];
    const grid = rows.length ? `<div class="au-days">${rows.map(([date, x]) => `<button type="button" class="au-day" data-day="${date}"${x.had ? '' : ' disabled'} aria-pressed="${dayOf(filter.date || '') === date}">
      <b>${esc(date.slice(5))}</b><small>周${week[new Date(date + 'T12:00:00Z').getUTCDay()]}</small><span>${x.had ? `${int(x.n)} 轮${x.bad ? `<em> · 坏 ${int(x.bad)}</em>` : ''}` : '没记'}</span></button>`).join('')}</div>`
      : '<p class="au-empty">近 30 天每天的轮数后台还没给。</p>';
    return `<div class="au-older"><button type="button" class="au-older__toggle" data-older aria-expanded="${olderOpen}">更早的 · 近 30 天按天看 <span aria-hidden="true">${olderOpen ? '‹' : '›'}</span></button>${olderOpen ? grid : ''}</div>`;
  }

  // —— 下半部：这周替你做成了 ——
  function results(d) {
    const r = d.results_7d || {};
    // 没有数时后台说了为什么空（如翻译官没登记项目），就照写那句，不写“还没采上”
    const cell = (label, value, unit, tail, key, why) => `<div class="au-win"><p class="au-win__label">${label}</p>
      ${known(value) ? `<p class="tp-big">${big(value, 'win-' + key)}<small>${unit}</small></p>${tail ? `<p class="au-win__tail">${tail}</p>` : ''}`
        : why ? `<p class="tp-big tp-fog">空着</p><p class="au-win__tail">${why}</p>` : '<p class="tp-big tp-fog">还没采上</p>'}</div>`;
    const translatorWhy = F(r.translator_versions_missing ?? list(d.categories).find(c => c.id === 'translator')?.result_7d?.missing_reason, '为什么空着');
    return `<section class="tp-panel au-wins" id="results"><div class="tp-panel__head"><h2>这周替${you()}做成了<small>近 7 天</small></h2><span class="tp-asof">截至 ${esc(when(r.at || d.at))}</span></div>
      <div class="tp-grid au-wins__grid tp-divide">${cell('修好', r.repaired, '件', basis(r.repaired_basis), 'repaired')}${cell('记下', r.messages_logged, '件', `消息给${you()}`, 'messages')}
      ${cell('规矩改好', r.rules_fixed, '处', '', 'rules')}${cell('翻译官出了', r.translator_versions, '版', '', 'translator', translatorWhy)}</div>${missingWeek(d)}</section>`;
  }
  // 后台给的口径说明 {text, from}：数下面照写一行小字（自动修理的“修好”、成和坏、账本的修好各数各的）；
  // 页上已经写了起算日（shown）或 text 里自己写了日子的，不再补“几号起”
  const dated = text => /\d{1,2} *[-月.\/] *\d{1,2}/.test(text);
  function basis(b, shown) {
    const text = b ? U.fieldText(b.text, viewer).trim() : '';
    if (!text) return '';
    return F(b.text, '口径说明') + (!shown && T.stamp(b.from) && !dated(text) ? ` ·&nbsp;${esc(T.day(b.from))}&nbsp;起` : '');
  }
  // 这周的合计后台没给时写为什么：派活记录从哪天才有
  function missingWeek(d) {
    const r = d.results_7d || {};
    if (['repaired', 'messages_logged', 'rules_fixed', 'translator_versions'].some(k => known(r[k]))) return '';
    const since = list(d.categories).map(c => T.stamp(c.result_7d?.recorded_since)).filter(Boolean).sort((a, b) => a - b)[0];
    const from = T.stamp(r.from);
    return `<p class="tp-small au-why-missing">${since && (!from || since > from) ? `派活记录从 ${esc(when(new Date(since).toISOString()))} 才有，不满一整周，后台先不给这周的合计。` : '这周的合计后台还没给。'}</p>`;
  }
  // 几秒、几分钟、几小时几分
  const spent = s => s < 60 ? [Math.round(s), '秒'] : s < 3600 ? [Math.round(s / 60), '分钟'] : null;
  function usage(d) {
    const seconds = d.results_7d?.ai_seconds ?? d.ai_usage?.total?.seven_day_seconds;
    const days = list(d.ai_usage?.total?.days_7);
    const u = d.ai_usage || {}, since = T.stamp(u.covered_since), weekStart = T.stamp(d.results_7d?.from) || Date.now() - 7 * 86400000;
    const short = known(seconds) && spent(seconds);
    const label = !known(seconds) ? '<span class="tp-fog">还没采上</span>'
      : short ? `<span class="tp-mid">${big(short[0], 'use-m')}<small>${short[1]}</small></span>`
      : `<span class="tp-mid">${big(Math.floor(seconds / 3600), 'use-h')}<small>小时</small> ${big(Math.round(seconds % 3600 / 60), 'use-m')}<small>分</small></span>`;
    const covered = known(seconds) && since && since > weekStart ? `<small class="au-use__since">从 ${esc(when(u.covered_since))} 起记，更早的没有记录</small>` : '';
    // 星期照上面日期格子的取法，按北京日期本身算，不用浏览器本机时区
    const names = ['日', '一', '二', '三', '四', '五', '六'];
    const chart = days.some(x => known(x.seconds)) ? T.columns({ rows: days.map((x, i) => ({ label: i === days.length - 1 ? '今天' : names[new Date(x.date + 'T12:00:00Z').getUTCDay()],
      parts: [{ value: (x.seconds || 0) / 3600, color: i === days.length - 1 ? '#00a650' : '#9fdcb9' }], text: known(x.seconds) ? `${dec(x.seconds / 3600)}h` : '没记' })),
      width: 380, height: 150, fmt: v => `${dec(v)}h`, grow: !drawn }) : `<p class="tp-small">每天各用多久后台还没分开给${known(seconds) ? '，先只有合计' : ''}。</p>`;
    return `<section class="tp-panel au-use" id="usage"><div class="tp-panel__head"><h2>这周后台 AI 共用了</h2></div><p class="au-use__num">${label}${covered}</p>${chart}</section>`;
  }

  // 跑着的卡：跑了几分钟，每秒往前走
  setInterval(() => {
    for (const el of document.querySelectorAll('[data-ran]')) el.textContent = `跑了 ${minutes((Date.now() - Number(el.dataset.ran)) / 1000)}`;
  }, 1000);

  function pauses(d) {
    return list(d.provider_pauses).filter(p => list(p.categories).length).map(p => {
      const names = list(d.categories).filter(c => list(p.categories).includes(c.id)).map(c => U.fieldText(cn(c.title), viewer)).join('、');
      return `<p class="tp-note">${esc(names)}停着：${pauseText(p)}</p>`;
    }).join('');
  }
  function pauseText(p) {
    const why = p.reason === 'login' ? '登录过期' : '额度用完';
    // 本人版：登录过期一律写这句并链到那张卡；后台还没给卡的地址时先链到等你的事清单
    const card = viewer === 'owner' && p.reason === 'login';
    // 后台的 text 自己带了“停着：”开头、也写了几点起：外面已经写了“停着”，开头去掉；text 里有那个钟点就不再补“· 几点起”。没带的照旧
    const text = card ? '' : U.fieldText(p.text, viewer).replace(/^停着[：:，,]\s*/, '');
    const since = p.started_at && !(text && text.includes(T.clock(p.started_at))) ? ` · ${esc(when(p.started_at))} 起` : '';
    return (card ? link(p.href || '/live/items/', `登录过期，登录命令在等${you()}的事里 ›`, 'tp-link au-warn') : esc(text || why)) + since;
  }

  // —— 八行总表 ——
  // 只有本人能点的按钮：访客版加 data-need-trusted，现成的可信设备弹框（trust-modal.js）在捕获阶段拦下、弹“这一步只有可信设备能做”；本人版不加，照常
  const ownerOnly = action => viewer === 'owner' ? '' : ` data-need-trusted="${esc(action)}"`;
  function switchCell(c, offline) {
    const m = flipping?.id === c.id ? flipping.mode : mode(c), until = c.setting?.until_at;
    const text = m === 'on' ? '开着' : m === 'off' ? '关着' : m === 'paused' ? `暂停到 ${esc(when(until))}` : '没读到';
    if (offline || !m) return `<span class="au-state" data-mode="${esc(m || '')}">${text}</span>`;
    const fb = feedback?.id === c.id ? `<small role="status" data-tone="${feedback.tone || ''}">${esc(feedback.text)}</small>` : `<small role="status"></small>`;
    // 访客版照样摆同一套开关和“暂停到…”（M716，定稿：公开版保留已定按钮）；点了由现成的可信设备弹框拦下，只提示本人才能操作，什么都不改
    return `<button type="button" class="au-switch" role="switch" aria-checked="${m === 'on'}" data-toggle="${esc(c.id)}" data-mode="${esc(m)}"${ownerOnly('开关自动任务')} aria-label="${esc(U.fieldText(cn(c.title), viewer))} · ${text}"><i></i><span>${m === 'on' ? '开' : '关'}</span></button>
      <button type="button" class="au-pausebtn" data-pause="${esc(c.id)}"${ownerOnly('暂停自动任务')}>${m === 'paused' ? `暂停到 ${esc(when(until))}` : '暂停到…'}</button>${fb}`;
  }
  function whenCell(d, c) {
    const g = G[c.id] || {}, p = pauseOf(d, c.id);
    const now = p ? `<span class="au-warn">${pauseText(p)}</span>` : c.running ? '<span class="au-ok">正在跑</span>'
      : c.next_at ? `下次 ${esc(when(c.next_at))}` : c.waiting_for ? F(c.waiting_for) : '';
    return `${esc(g.when || '')}${now ? `<small>${now}</small>` : ''}`;
  }
  function lastCell(c) {
    const r = c.last_result;
    const since = c.recent_stats?.recorded_since;
    if (!r) return mode(c) === 'off' ? `<span class="tp-muted">关着${c.id === 'weekly-live' ? '，网站上线收尾做完再开' : ''}</span>`
      : `<span class="tp-muted">${since ? `${esc(when(since))} 起还没跑过` : '还没有运行记录'}</span>`;
    return `${F(r.text, '上次结果')}<small>${esc(when(r.at))}</small>`;
  }
  function trendCell(c) {
    const days = list(c.daily_30d), s = c.recent_stats || {};
    if (!days.length) return '<span class="tp-fog">还没采上</span>';
    const since = T.stamp(s.recorded_since), late = since && since > (T.stamp(s.from) || 0) + 86400000;
    const nums = known(s.success) ? `成 ${int(s.success)} · 坏 ${int(s.failed)}` : '还没采上';
    const why = basis(s.basis, late);
    return `<div class="au-trend">${T.posneg(days, { width: 150, height: 34 })}<span${s.failed ? ' data-bad' : ''}>${nums}${late ? `<small> · ${esc(when(s.recorded_since))} 起记</small>` : ''}</span></div>${why ? `<small class="au-basis">${why}</small>` : ''}`;
  }
  function table(d) {
    const cats = IDS.map(id => list(d.categories).find(c => c.id === id)).filter(Boolean);
    if (!cats.length) return `<section class="tp-panel" id="types"><div class="tp-panel__head"><h2>八类自动任务</h2></div><p class="tp-empty">${d.types ? '这一版后台还没给八类的读数。' : '八类自动任务没读到。'}</p></section>`;
    const offline = state?.offline;
    return `<section class="tp-panel" id="types"><div class="tp-panel__head"><h2>八类自动任务<small>点一行看这一类怎么干</small></h2><span class="tp-asof">截至 ${esc(when(d.at))}</span></div>
      <table class="tp-table au-table"><thead><tr><th scope="col">任务</th><th scope="col">什么时候跑</th><th scope="col">用谁</th><th scope="col">上次结果</th><th scope="col">近 30 天</th><th scope="col">开关</th></tr></thead>
      <tbody>${cats.map(c => {
        const g = G[c.id] || {}, expanded = open === c.id, p = pauseOf(d, c.id);
        return `<tr id="cat-${c.id}" data-row="${c.id}" class="au-row${expanded ? ' is-open' : ''}${p ? ' is-paused' : ''}" data-mode="${esc(mode(c) || '')}">
          <th scope="row"><button type="button" class="au-name" data-open="${c.id}" aria-expanded="${expanded}" aria-controls="mech-${c.id}"><b>${F(cn(c.title))}</b><span>${esc(g.short || '')}</span><i class="tp-chev" aria-hidden="true">${expanded ? '收起' : '怎么干'}</i></button></th>
          <td>${whenCell(d, c)}</td><td class="au-model">${[c.model, c.model_effort].filter(Boolean).map(esc).join(' · ') || '没读到'}</td>
          <td>${lastCell(c)}</td><td>${trendCell(c)}</td><td class="au-switchcell">${switchCell(c, offline)}</td></tr>
          ${expanded ? `<tr id="mech-${c.id}" class="au-mechrow"><td colspan="6">${mechanism(d, c)}</td></tr>` : ''}`;
      }).join('')}</tbody></table>${scheduled(d)}
      <p class="tp-small au-foot">不叫 AI 的备份、同步、守护在 ${link('/live/tasks/', '计划任务 ›')}；一件件修了什么、约了什么在 ${link('/live/ledger/', 'AI 账本 ›')}。</p></section>`;
  }

  // —— 各家自带的定时（M183）：定稿只许拿来叫醒当前对话接着干，反复跑的活在上面八类里。三家都列，没有就写没有 ——
  function scheduled(d) {
    if (!Array.isArray(d.scheduled_activities)) return '';
    const rows = list(d.scheduled_activities), gaps = list(d.scheduled_gaps).map(g => U.fieldText(g, viewer)).filter(Boolean);
    const hosts = ['Claude', 'Codex', 'Antigravity'];
    for (const r of rows) if (r.producer && !hosts.includes(r.producer)) hosts.push(r.producer);
    const item = r => `<li><b>${esc(when(r.next_at || r.at))}</b>${link(r.href, F(r.label, '这个定时'))}<small>${[F(r.period), F(r.state_text)].filter(Boolean).join(' · ')}${r.next_at ? ` · 下次 ${esc(when(r.next_at))}` : ''}</small></li>`;
    const body = hosts.map(h => {
      const mine = rows.filter(r => r.producer === h).sort((a, b) => T.stamp(b.next_at || b.at) - T.stamp(a.next_at || a.at));
      const notes = gaps.filter(g => g.includes(h)).map(g => `<small>${esc(g)}</small>`).join('');
      return `<tr><th scope="row">${esc(h)}${mine.length ? `<small>${int(mine.length)} 个</small>` : ''}</th><td>${mine.length ? `<ul class="au-recent">${mine.map(item).join('')}</ul>` : '没有'}${notes}</td></tr>`;
    }).join('');
    const rest = gaps.filter(g => !hosts.some(h => g.includes(h))).map(g => `<p class="tp-small">${esc(g)}</p>`).join('');
    return `<div class="au-extra au-sched" id="scheduled"><p class="tp-sub">各家自带的定时<small>只用来叫醒当前对话接着干，反复跑的活都在上面八类里</small></p>
      <table class="tp-table au-mini-table"><tbody>${body}</tbody></table>${rest}</div>`;
  }

  // —— 一类的机制：原地展开 ——
  function mechanism(d, c) {
    const g = G[c.id] || {}, s = c.recent_stats || {};
    const steps = list(g.steps);
    const flow = `<ol class="au-flow">${steps.map(([title], i) => `<li><span>${i + 1}</span>${esc(title)}</li>`).join('')}</ol>`;
    const stepText = `<div class="au-steps">${steps.map(([title, text], i) => `<p><b>${i + 1}. ${esc(title)}</b>${esc(text)}</p>`).join('')}</div>`;
    const stat = (label, value, unit, tone) => `<div class="au-stat" data-tone="${tone}"><p>${label}</p><p class="tp-big">${known(value) ? `${big(value, `st-${c.id}-${label}`)}<small>${unit}</small>` : '<span class="tp-fog">还没采上</span>'}</p></div>`;
    const why = list(g.why).map(([q, a]) => `<p><b>${esc(q)}</b>${esc(a)}</p>`).join('');
    const extra = [];
    if (c.id === 'auto-repair' && list(c.subcategories).length) extra.push(`<div class="au-extra"><p class="tp-sub">各小类 <small>${viewer === 'owner' ? '能单独关' : '本人能单独关'}</small></p><p class="au-subs">${list(c.subcategories).map(sub =>
      `<span class="tp-pill" data-mode="${esc(mode(sub) || '')}">${F(sub.title)} · ${mode(sub) === 'on' ? '开' : mode(sub) === 'off' ? '关' : mode(sub) === 'paused' ? '暂停' : '没读到'}${!state?.offline && mode(sub) ? ` <button type="button" class="au-mini" data-toggle="${esc(sub.id)}" data-mode="${esc(mode(sub))}"${ownerOnly('开关自动修理小类')}>${mode(sub) === 'on' ? '关掉' : '打开'}</button>` : ''}</span>`).join('')}</p></div>`);
    if (c.id === 'translator' && list(c.projects).length) extra.push(`<div class="au-extra"><p class="tp-sub">各工程的《他要什么》</p><table class="tp-table au-mini-table"><tbody>${list(c.projects).map(p =>
      `<tr><th scope="row">${F(p.name)}</th><td>第 ${int(p.version)} 版 · ${esc(when(p.published_at))}</td><td>${p.uncertain_count ? `${int(p.uncertain_count)} 条拿不准` : '没有拿不准的'}</td></tr>`).join('')}</tbody></table></div>`);
    if (list(c.weekly_runs).length) extra.push(`<div class="au-extra"><p class="tp-sub">每周一行</p><table class="tp-table au-mini-table"><tbody>${list(c.weekly_runs).map(w =>
      `<tr><th scope="row">${esc(T.day(w.scheduled_at))}</th><td>${F(w.summary)}</td><td>${known(w.elapsed_seconds) ? esc(minutes(w.elapsed_seconds)) : ''}</td></tr>`).join('')}</tbody></table></div>`);
    if (list(c.recent_runs).length) extra.push(`<div class="au-extra"><p class="tp-sub">最近几次</p><ul class="au-recent">${list(c.recent_runs).map(r =>
      `<li><b>${esc(when(r.at))}</b>${r.ledger_href ? link(r.ledger_href, F(r.summary)) : F(r.summary)}</li>`).join('')}</ul></div>`);
    if (list(c.setting_log).length) extra.push(`<div class="au-extra"><p class="tp-sub">开关改动</p><ul class="au-recent">${list(c.setting_log).map(r => `<li><b>${esc(when(r.at))}</b>${F(r.text)}</li>`).join('')}</ul></div>`);
    return `<div class="au-mech"><p class="tp-sub au-mech__title">${F(cn(c.title))}怎么干</p>${flow}
      <p class="au-trigger"><b>怎么触发</b>${esc(g.trigger || '')}</p>${stepText}
      <div class="tp-grid au-stats">${stat('近 30 天成', s.success, '次', 'ok')}${stat('坏', s.failed, '次', s.failed ? 'bad' : 'off')}${stat('平均', known(s.average_seconds) ? Math.max(1, Math.round(s.average_seconds / 60)) : null, '分钟', 'blue')}</div>
      ${basis(s.basis) ? `<p class="tp-small au-basis">成和坏：${basis(s.basis)}</p>` : ''}
      ${extra.join('')}
      <div class="au-more">
        <details class="tp-details" id="prompt-${c.id}"><summary class="live-disclosure">提示词原文</summary><pre>${c.prompt_template ? F(c.prompt_template, '提示词') : '这一类没有固定的提示词：' + esc(c.id === 'weekly-laptop' ? '按巡检清单跑程序，坏了才叫 AI。' : '后台这版没给原文。')}</pre></details>
        <section class="au-block" id="why-${c.id}"><p class="au-block__title">为什么这样做、为什么这个钟点和型号</p><div class="au-why"><p><b>用谁</b>${esc(g.who || '')}现在是 ${[c.model, c.model_effort].filter(Boolean).map(esc).join(' · ')}，换代跟着模型清单走。</p>${why}</div></section>
        <section class="au-block" id="fail-${c.id}"><p class="au-block__title">坏了怎么办、怎么关、结果去哪</p><div class="au-why"><p><b>坏了怎么办</b>${esc(g.failure || '')}</p><p><b>关了会怎样</b>${esc(g.off || '')}</p><p><b>花多少时间</b>${esc(g.cost || '')}</p><p><b>结果去哪</b>${esc(g.result || '')}</p></div></section>
      </div></div>`;
  }

  // —— 快讯：只放开始、跑完、停了，不放摘一句（runs.js 里拼）——
  const feed = d => { const got = collect(d); return R.ticker(d, got.legacy ? null : got.rows, viewer); };

  let drawn = false;
  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    if (!d) { T.paint(page.root, T.placeholder(state, '自动任务')); page.tick.set([], { off: true }); return; }
    const side = [`截至 ${esc(when(d.at))}`, dispatchText(d)].filter(Boolean).join(' · ');
    T.paint(page.root, `<div class="tp-head"><div><h1>自动任务</h1><p>后台 AI 替${you()}干的八类活：在干什么、刚干完什么、几点跑、用谁、开没开。</p></div><p class="tp-head__side"><span>${side}</span></p></div>
      ${T.stateNote(state)}${upper(d)}
      <div class="au-lower"><div class="tp-grid au-top">${results(d)}${usage(d)}</div>${pauses(d)}${table(d)}</div>`);
    drawn = true;
    page.tick.set(feed(d), { off: state.offline });
    // 只在进页那一次按地址里的 #… 或 ?type= 滚过去；之后点开一行不再跳，“收起”留在原处
    if (!landed) { landed = true; if (location.hash || typeParam) T.reveal(location.hash.slice(1) || `cat-${typeParam}`); }
  }

  async function save(id, value) {
    if (busy) return null;
    busy = true;
    try { return await Live.automationSetting({ operation: 'type-mode', id, value }); } finally { busy = false; }
  }
  // 没存上时写原因：后台给了中文就照写
  function failText(reply) {
    if (reply?.error === 'cockpit_owner_required') return '没存上：这台设备还没配对成本人设备';
    if (typeof reply?.message === 'string' && /[一-鿿]/.test(reply.message)) return `没存上：${reply.message}`;
    if (!reply || reply.status === 'unknown') return '没确认存上：电脑没回话，刷新看看';
    return '没存上：电脑没写进去，再点一次';
  }
  function saved(id, reply) {
    feedback = reply.status === 'saved' ? { id, text: '已保存', tone: 'ok' } : reply.status === 'retired' ? { id, text: reply.message || '已撤' } : { id, text: failText(reply), tone: 'bad' };
    if (reply.status === 'saved' && reply.current) {
      for (const c of list(state?.data?.categories)) for (const row of [c, ...list(c.subcategories)]) if (row.id === id) row.setting = { ...row.setting, ...reply.current };
    }
    draw();
    void Live.refresh();
  }
  const dialog = document.getElementById('au-pause'), form = dialog.querySelector('form');
  dialog.querySelector('[data-cancel]').addEventListener('click', () => dialog.close());
  const WEEK = ['日', '一', '二', '三', '四', '五', '六'], pad = n => String(n).padStart(2, '0');
  const bjNow = () => new Date(Date.now() + 8 * 3600000);
  // 打开时填好下拉：今天起 14 天，00–23 时，每 5 分钟；先选好原来暂停到的那个钟点，没有就选下一个整点
  function fillWhen(untilAt) {
    const now = bjNow(), from = T.stamp(untilAt) > Date.now() ? new Date(T.stamp(untilAt) + 8 * 3600000) : new Date(now.getTime() + 3600000);
    if (!(T.stamp(untilAt) > Date.now())) from.setUTCMinutes(0, 0, 0);
    const days = Array.from({ length: 14 }, (_, i) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i)));
    const key = x => `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())}`;
    form.elements.day.innerHTML = days.map((x, i) => `<option value="${key(x)}">${x.getUTCMonth() + 1}月${x.getUTCDate()}日 周${WEEK[x.getUTCDay()]}${['（今天）', '（明天）', '（后天）'][i] || ''}</option>`).join('');
    form.elements.hour.innerHTML = Array.from({ length: 24 }, (_, h) => `<option value="${pad(h)}">${pad(h)} 点</option>`).join('');
    form.elements.minute.innerHTML = Array.from({ length: 12 }, (_, m) => `<option value="${pad(m * 5)}">${pad(m * 5)} 分</option>`).join('');
    form.elements.day.value = key(from); form.elements.hour.value = pad(from.getUTCHours()); form.elements.minute.value = pad(Math.floor(from.getUTCMinutes() / 5) * 5);
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!pausing) return;
    const until = `${form.elements.day.value}T${form.elements.hour.value}:${form.elements.minute.value}:00+08:00`;
    if (!(Date.parse(until) > Date.now())) { form.querySelector('[data-result]').textContent = '要选比现在晚的时间'; return; }
    form.querySelector('[data-result]').textContent = '正在保存…';
    const reply = await save(pausing, { mode: 'paused', until_at: until });
    if (!reply) return;
    if (reply.status === 'saved' || reply.error === 'cockpit_owner_required') dialog.close();
    else form.querySelector('[data-result]').textContent = failText(reply);
    saved(pausing, reply);
  });

  let page;
  page = T.boot({ resource: 'automation', back: '/live/#automation',
    ask: () => '请看实况自动任务页：后台 AI 现在在干什么、刚跑完什么、哪类坏了或停着、要不要我出面。先用大白话说，别动手。',
    onState(next) { state = next; schedule(); } });
  watchRuns();
  page.root.addEventListener('click', async e => {
    const toggle = e.target.closest('[data-toggle]'), pause = e.target.closest('[data-pause]');
    const cat = e.target.closest('[data-cat]'), clear = e.target.closest('[data-clear]'), day = e.target.closest('[data-day]');
    if (cat) { setFilter({ category: cat.dataset.cat || null }); return; }
    if (clear) { setFilter({ [clear.dataset.clear]: null }); return; }
    if (day) { setFilter({ date: day.dataset.day === today() ? 'today' : day.dataset.day }); T.reveal('done'); return; }
    if (e.target.closest('[data-older]')) { T.keep(page.root, '[data-older]', () => { olderOpen = !olderOpen; draw(); }); return; }
    const jump = e.target.closest('[data-jump]');
    if (jump) { open = jump.dataset.jump; draw(); T.reveal(`cat-${open}`); return; }
    // 整行都能点开：点在开关、暂停、链接以外的地方，等于点了这一行的名字
    const row = !e.target.closest('a, button, input') && e.target.closest('tr[data-row]');
    const opener = e.target.closest('[data-open]') || (row && page.root.querySelector(`[data-open="${row.dataset.row}"]`));
    if (opener) {
      open = open === opener.dataset.open ? null : opener.dataset.open;
      const url = new URL(location.href);
      if (open) url.searchParams.set('type', open); else url.searchParams.delete('type');
      history.replaceState(history.state, '', url.pathname + url.search);
      T.keep(page.root, `[data-open="${opener.dataset.open}"]`, draw);
      return;
    }
    if (toggle) {
      const id = toggle.dataset.toggle, before = toggle.dataset.mode, next = before === 'on' ? 'off' : 'on';
      if (busy) return;
      // 开关先在原地滑过去（圆钮滑、底色跟着变），写“正在保存”；存好写“已保存”，没存上滑回来并写原因
      const slide = value => {
        const el = page.root.querySelector(`.au-switch[data-toggle="${CSS.escape(id)}"]`);
        if (!el) return;
        el.dataset.mode = value; el.setAttribute('aria-checked', String(value === 'on'));
        el.querySelector('span').textContent = value === 'on' ? '开' : '关';
        const note = el.parentElement.querySelector('small[role="status"]');
        if (note) { note.textContent = '正在保存…'; note.dataset.tone = ''; }
      };
      if (toggle.classList.contains('au-switch')) { flipping = { id, mode: next }; feedback = { id, text: '正在保存…' }; slide(next); }
      const [reply] = await Promise.all([save(id, { mode: next }), new Promise(r => setTimeout(r, 320))]);
      if (flipping?.id === id && reply?.status !== 'saved') { slide(before); await new Promise(r => setTimeout(r, 320)); }
      if (flipping?.id === id) flipping = null;
      saved(id, reply || { status: 'unknown' });
      return;
    }
    if (pause) {
      const access = await Live.automationSetting({ operation: 'access' });
      if (access.status !== 'pass') { saved(pause.dataset.pause, access); return; }
      pausing = pause.dataset.pause;
      fillWhen(list(state?.data?.categories).flatMap(c => [c, ...list(c.subcategories)]).find(c => c.id === pausing)?.setting?.until_at);
      form.querySelector('[data-result]').textContent = '';
      dialog.showModal();
    }
  });
})();

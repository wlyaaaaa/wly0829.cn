(() => {
  'use strict';
  const U = window.LiveUI, R = window.LiveRuns, { esc } = U;
  const entries = { claude: 'Claude', codex: 'Codex', antigravity: 'Antigravity' };
  const OPENING = '/live/agents/opening/';
  const items = value => Array.isArray(value) ? value : [];
  const count = value => typeof value === 'number' && value >= 0;
  const num = value => count(value) ? esc(value) : '<span class="fog__text" aria-label="没读到">··</span>';
  const time = value => value && Number.isFinite(Date.parse(value)) ? `${U.date(value)} ${U.time(value)}` : '';
  const dot = tone => `<i class="b6-dot" data-kind="${tone}" aria-hidden="true"></i>`;
  const cardTitle = (name, href, tone, status) => U.status({ level: { ok: 'green', owner: 'yellow', repair: 'blue', off: 'gray' }[tone] }).lamp + U.head(name, { href, lamp: false }) +
    (status ? `<span class="b6-status">${status}</span>` : '');

  // —— 后台给什么，转成三张卡要的样子（数据约定-前端升级 §5；旧包没有新字段就退回原字段） ——
  // 自动任务卡、账本卡共用的时间条（只这两张卡用，不给首页别的卡）：今天北京时间 0 点到 24 点一条线，“现在”一根绿竖线、下面写钟点；
  // 点 = [{at, kind, href, tip}]，kind：ok 做成（绿）、bad 没做成（橙）、late 到点没看（橙实点）、next 还没到（空心圈）。比今天早的点压在 0 点那头。
  const DAY_MS = 86400000;
  const dayStart = now => { const t = Date.parse(now) || Date.now(); return Math.floor((t + 8 * 3600000) / DAY_MS) * DAY_MS - 8 * 3600000; };
  function timebar(points, now, route, label) {
    const start = dayStart(now), t = Date.parse(now) || Date.now();
    const x = at => Math.max(0, Math.min(100, (at - start) / DAY_MS * 100)), here = x(t);
    const dots = points.map(p => {
      const style = `left:${x(Date.parse(p.at)).toFixed(2)}%`, tip = p.tip ? ` title="${esc(p.tip)}" aria-label="${esc(p.tip)}"` : ' aria-hidden="true"';
      return typeof p.href === 'string' && p.href.startsWith('/live/') ? `<a class="b6-tb__dot" data-kind="${p.kind}" style="${style}" href="${esc(route(p.href))}"${tip}></a>`
        : `<i class="b6-tb__dot" data-kind="${p.kind}" style="${style}"${tip}></i>`;
    }).join('');
    // “现在”离两头太近时不写 0 点、24 点，免得字叠在一起
    return `<div class="b6-tb" role="group" aria-label="${esc(label)}">${here > 9 ? '<span class="b6-tb__from">0 点</span>' : ''}${here < 91 ? '<span class="b6-tb__to">24 点</span>' : ''}
      <div class="b6-tb__line">${dots}<span class="b6-tb__now" style="left:${here.toFixed(2)}%"><b>现在</b><small>${esc(U.time(new Date(t).toISOString()))}</small></span></div></div>`;
  }
  const spent = s => { const m = Math.round(s / 60); return m < 60 ? `${m} 分钟` : `${Math.floor(m / 60)} 小时${m % 60 ? ` ${m % 60} 分` : ''}`; };

  // 首页自动任务卡（照“首页自动任务卡-v2”，本人 11-25 定内容、大字是今天跑完几轮，11-26 01:04 批照图施工）：
  // 大字今天跑完几轮、其中几轮没做成，0–24 点时间条每轮一个点；下面写在干或下一个、每处毛病、关着的类和近 7 天的结果。
  // 今天没做成几轮（results_today.failed_runs，和 finished_runs 同一个数法：每轮真实结束记录算一轮，跨夜那轮归结束那天）、
  // 今天每一轮的点（results_today.runs_today=[{finished_at, ok, href}]）：读到了但今天还没跑完一轮给 0 和空列表，照画（空时间条只有“现在”）；
  // 读不到轮次给 null，这一行和时间条都不画。
  function automationView(d, { viewer }) {
    const today = d.results_today && typeof d.results_today === 'object' ? d.results_today : {};
    // 今天跑完了几轮：后台 results_today.finished_runs，和自动任务页“今天跑完的”同一口径
    const finished = count(today.finished_runs) ? today.finished_runs : null;
    const failed = count(today.failed_runs) ? today.failed_runs : null;
    const runs = Array.isArray(today.runs_today)
      ? today.runs_today.filter(r => r && typeof r === 'object' && R.timed(r.finished_at)).map(r => ({ ...r, at: r.finished_at })) : null;
    const week = d.results_7d && typeof d.results_7d === 'object' ? d.results_7d : null;
    const running = items(d.running).map(r => {
      const category = R.categoryName(r.category, viewer), summary = r.title || r.summary;
      return { what: [category, summary !== `${category}正在进行` && summary !== category && summary].filter(Boolean),
        round: Number.isInteger(r.round) && r.round > 0 ? r.round : null, href: R.runHref(r) || r.href };
    });
    const problems = items(d.problems).map(p => {
      const title = U.fieldText(p.title, viewer), text = U.fieldText(p.text, viewer);
      const repairing = typeof p.repairing === 'boolean' ? p.repairing : p.handler !== '本人';   // 旧包没有 repairing：照原来，写明等本人的才不算在修
      return { title, text, raw: p, repairing, handler: p.handler_text || p.handler || '', round: count(p.round) && p.round > 0 ? p.round : null, href: R.runPage(p.href) };
    });
    const aiSeconds = count(today.ai_seconds) ? today.ai_seconds : count(d.today?.ai_minutes) ? d.today.ai_minutes * 60 : null;
    return { finished, failed, runs, week, running, problems, aiSeconds,
      todayHref: R.listHref({ date: 'today' }), failedHref: R.listHref({ date: 'today', status: 'incomplete' }) };
  }

  // 首页智能体卡：今天三家干了多久、本人说了几句；每家一行（家色、小签、今天的数）。被拦几次本人 11-24 03:00 定了不写（别处也不放）。
  // 取数照数据约定-前端升级 §11：data.agents.today = {date, providers:[{id, actual_minutes, starts, messages, last_at, href}], total}
  // 工时按实际干活的时间算（本人 11-24 13:55 选 A，M728）：后台给了 today.activity（和智能体页“三家干了多少”同一份）就用它的 actual_minutes，没给照旧
  const HOST_COLOR = { claude: '#e8913f', codex: '#16a6c4', antigravity: '#7a63e8' };
  const hoursOf = m => count(m) ? m / 60 : null;
  function agentsView(d, { now }) {
    const today = d.today && typeof d.today === 'object' ? d.today : null, total = today?.total || {};
    const act = today?.activity && typeof today.activity === 'object' ? today.activity : null;
    const rows = Object.entries(entries).map(([key, name]) => {
      const p = items(d.providers).find(x => x.id === key) || { id: key, name, status: 'missing' };
      const t = items(today?.providers).find(x => x.id === key) || null, last = t?.last_at || {};
      const issues = items(p.issues);
      // 在修：只有 repairing 为真才算（约定 §10）；旧包没有 repairing 时写了谁在修就算。第几轮、点到哪一轮取在修那几处里第一处写明了的
      const busy = issues.filter(i => i.repairing === true || i.repairing == null && (i.handler || i.handler_text));
      const fix = busy.find(i => typeof i.href === 'string' && i.href.startsWith('/live/')) || {};
      // 点这一家那一行：这一行写的是这一家今天实际干了几小时，所以到智能体页“三家干了多少”那块（#hours），时间选好“今天”，亮这一家那条横条
      // （以前到“三家各干了多少活”，那块现在叫“报了估时的活”，数是登记工时，和这一行对不上；网址只看一家一律 ?family=，F1 定的）
      return { ...p, name: p.name || name, color: HOST_COLOR[key], issues, fixing: issues.length ? busy.length > 0 : p.status === 'repair',
        round: busy.map(i => i.round).find(r => count(r) && r > 0) || null, fixHref: R.runPage(fix.href) || null,
        workHref: `/live/agents/?hours=today&family=${key}#hours`,
        // “上次”：这一家今天的数是证实的 0 时，用 last_at 里对应那一项（工时没有就看开工）
        today: t ? { hours: hoursOf(act ? act.hosts?.[key]?.actual_minutes : t.actual_minutes), starts: t.starts, said: t.messages, last: last.work || last.starts || null } : null };
    });
    // 叠加的小时数一天能过 24：算出“今天到现在几小时里平均同时几个在干”，写在大字旁边，一眼看得出数合不合理（主控 11-26 03:50）
    const sumHours = hoursOf(act ? act.total?.actual_minutes : total.actual_minutes);
    const span = act ? (Date.parse(act.as_of) - Date.parse(act.window_start)) / 3600000 : NaN;
    return { rows, date: R.todayLabel(/^\d{4}-\d\d-\d\d$/.test(today?.date || '') ? `${today.date}T12:00:00+08:00` : now),
      hours: sumHours, together: sumHours > 0 && span >= .25 ? sumHours / span : null, said: total.messages, noToday: !today, at: time(d.at) };
  }
  // 首页 AI 账本卡：新账起（后台清零重算，从正式生效那一刻算），AI 在跟几件、今天到日子、跟得最久、新账起进了结。
  // 取数照数据约定 §11：data.ledger.new_ledger = {started_at, open, opened, closed, due, overdue, next_due, opened_7d?, closed_7d?}，每个数 {count, href}；
  // href 是账本页 ?view=…，点了到账本页筛好的那几件，件数和卡上一样。new_ledger 为 null 是还没生效。
  // 首页账本卡（照“首页账本卡-v1”，本人 11-26 01:04 批照图施工）：大字欠着几件、旁边放着几件 ›；时间条上今天要看的每一件一个点
  // （到点没看橙色实点、还没到空心圈）；今天要看的前 3 件；底行今天要看几件 · 近 7 天了结几件 ›。
  // 欠着、放着：后台 owed/parked 和 groups.{owed,parked}.href（账本页那两块）；今天要看的：due_today 和 items 里 next_at 落在今天的（按 id 并），
  // 件数用 new_ledger.due（点进去账本页 ?view=due 件数一样）；近 7 天了结：closed_7d，点进去优先用件数一样的那份清单。
  function ledgerCard(d, { now }) {
    const nl = d.new_ledger && typeof d.new_ledger === 'object' ? d.new_ledger : null;
    const site = h => typeof h === 'string' && h.startsWith('/live/') ? h : null;
    const rows = new Map();
    for (const r of [...items(d.due_today), ...items(d.items)]) if (r && typeof r === 'object' && r.id && !rows.has(r.id)) rows.set(r.id, { ...r, title: r.title ?? r.plain_title ?? r.text });
    const all = [...rows.values()], t = Date.parse(now) || Date.now(), start = dayStart(now), end = start + DAY_MS;
    const inGroup = g => items(d.items).length ? items(d.items).filter(r => r.group === g).length : null;
    const owed = count(d.owed) ? d.owed : count(d.groups?.owed?.count) ? d.groups.owed.count : inGroup('owed');
    const parked = count(d.parked) ? d.parked : count(d.groups?.parked?.count) ? d.groups.parked.count : inGroup('parked');
    // 今天要看的：约好今天看的，加上已经过了日子还没看的（overdue）；到点没看的排前面，其余照钟点
    const late = r => r.overdue === true || Date.parse(r.next_at) <= t;
    const today = all.filter(r => R.timed(r.next_at) && (Date.parse(r.next_at) < end && (Date.parse(r.next_at) >= start || r.overdue === true)))
      .sort((a, b) => late(b) - late(a) || Date.parse(a.next_at) - Date.parse(b.next_at));
    const after = all.filter(r => R.timed(r.next_at) && Date.parse(r.next_at) >= end).sort((a, b) => Date.parse(a.next_at) - Date.parse(b.next_at))[0];
    const closed = count(d.closed_7d) ? d.closed_7d : count(nl?.closed_7d?.count) ? nl.closed_7d.count : null;
    const closedHref = site(nl?.closed_7d?.href) || (nl?.closed && nl.closed.count === closed ? site(nl.closed.href) : null) || site(d.closed_7d_link?.href) || '/live/ledger/#history';
    return { owed, parked, today, late, after, closed, closedHref,
      opened: count(nl?.opened?.count) ? nl.opened.count : null, openedHref: site(nl?.opened?.href),
      due: count(nl?.due?.count) ? nl.due.count : Array.isArray(d.due_today) ? today.length : null,
      dueHref: site(nl?.due?.href) || '/live/ledger/?view=due',
      owedHref: site(d.groups?.owed?.href) || '/live/ledger/#owed', parkedHref: site(d.groups?.parked?.href) || '/live/ledger/#parked' };
  }
  function ledgerView(d, { viewer }) {
    const nl = d.new_ledger && typeof d.new_ledger === 'object' ? d.new_ledger : null;
    const site = h => typeof h === 'string' && h.startsWith('/live/') ? h : null;
    const num = (x, view) => ({ n: count(x?.count) ? x.count : null, href: site(x?.href) || `/live/ledger/?view=${view}` });
    // 今天没有到日子的：写下一件哪天看，用后台给的 next_due={date（北京日期）, href}；没有下一件时后台给 null
    const nd = nl?.next_due, next = nd && /^\d{4}-\d\d-\d\d/.test(nd.date || '') ? { day: nd.date.slice(5, 10), href: site(nd.href) } : null;
    const oldest = d.oldest ? { ...d.oldest, title: d.oldest.title ?? d.oldest.plain_title ?? d.oldest.text } : null;
    // 一件也没有时卡上整句写“AI 暂无待跟事项”；手上有事但后台没挑出最久那件，就不写这一行（后台照给 oldest_text“现在没有 AI 正在跟的事”也不写，免得自相矛盾，M671）
    const oldestText = U.fieldHtml(d.oldest_text, { name: '跟得最久', kind: viewer });
    // 今天到日子那几件：后台 due_today=[{id, title|text, href, next_at, overdue}]，卡里最多列 3 件，过期的排最前，其余照下次看的时刻先后（本人定，主持 11-24 06:34 转）
    const at = r => Date.parse(r.next_at) || Infinity;
    const dueItems = items(d.due_today).filter(r => r && typeof r === 'object').map((r, i) => ({ ...r, i, title: r.title ?? r.plain_title ?? r.text }))
      .sort((a, b) => (b.overdue === true) - (a.overdue === true) || at(a) - at(b) || a.i - b.i);
    const base = { next, oldest, oldestText, dueItems };
    if (nl) {
      const since = R.timed(nl.started_at) ? nl.started_at : null;
      // 新账满 7 个整天后后台才给 opened_7d/closed_7d（同样 {count, href}，view=opened_7d/closed_7d），给了就改写“近 7 天进 · 了结”，没给照旧写新账起
      const week = !!nl.opened_7d && !!nl.closed_7d;
      return { ...base, since, week, open: num(nl.open, 'open'), due: num(nl.due, 'due'), overdue: num(nl.overdue, 'overdue'),
        opened: week ? num(nl.opened_7d, 'opened_7d') : num(nl.opened, 'opened'), closed: week ? num(nl.closed_7d, 'closed_7d') : num(nl.closed, 'closed') };
    }
    // 后台写了 new_ledger:null：新账还没生效，卡上写“正在重算”。旧包根本没有这个字段：照原来的字段画；账本页筛不出同样件数的数只写字、不带链接
    if (Object.hasOwn(d, 'new_ledger')) return { ...base, pending: true };
    const due = Array.isArray(d.due_today) ? d.due_today : null, plain = n => ({ n: count(n) ? n : null, href: null });
    return { ...base, legacy: true, since: null, open: { ...plain(d.open), href: '/live/ledger/' }, due: plain(due?.length), overdue: plain(due?.filter(r => r.overdue).length),
      opened: plain(d.opened_7d), closed: plain(d.closed_7d) };
  }

  // 首页整包没读到（实况在线、只是 home 这一项读不到，或电脑连不上又没存下来）时，l1.js 给的是空的：
  // 和别的卡一样只写一句“××暂时读不到”（电脑连不上时写“这块没存下来”），不画一张没有数的卡
  // 卡名和有数时的标题一样（账本卡叫“AI 自动任务账本”）；电脑连不上时这句不再带卡名，标题已经写了
  const MISSING = { agents: '智能体', automation: '自动任务', ledger: 'AI 自动任务账本' };
  const publicText = text => text.replace(/“[^”]*”|你(?!们)/g, word => word === '你' ? '本人' : word);
  // 保留双引号内的显示字；标签本身只处理 title，链接地址照原值。
  function publicHtml(html, viewer) {
    if (viewer === 'owner' || !html.includes('你')) return html;
    return html.replace(/<[^>]+>|“(?:[^<”]|<\/?(?:span|a|b|strong|em|i|wbr|time)\b[^>]*>)*”|你(?!(?:<[^>]+>)*们)/g, part =>
      part === '你' ? '本人' : part.replace(/<[^>]+>/g, tag => tag.replace(/(\s[\w:.-]+=)(["'])([\s\S]*?)\2/g,
        (attribute, name, quote, value) => name.trim() === 'title=' ? name + quote + publicText(value) + quote : attribute)));
  }
  function render(id, data, options) {
    const { viewer, route, href, offline, now } = options;
    if (data == null && MISSING[id]) {
      const name = MISSING[id], say = offline ? '这块没存下来，连上后补上。' : `${name}暂时读不到`;
      return { tone: 'off', head: cardTitle(name, href, 'off', '') + `<br><span class="row__sub">${esc(say)}</span>`, body: '' };
    }
    const own = viewer === 'owner' ? '你' : '本人', field = (v, name) => U.fieldHtml(v, { name, kind: viewer });
    const link = (path, text) => typeof path === 'string' && path.startsWith('/live/')
      ? `<a href="${esc(route(path))}">${text}</a>` : text;
    // 能点过去的绿字（“第 2 轮 ›”“已交自动修理 ›”）；地址不在站内就只写字、不带箭头
    const go = (path, text) => typeof path === 'string' && path.startsWith('/live/')
      ? `<a class="b6-go" href="${esc(route(path))}">${text} ›</a>` : text;
    // 字长的绿链接（上一轮的结果、事项标题）：允许换行，免得窄卡里被截掉；“›”用不断行空格跟前面的字连着
    const goWrap = (path, text) => typeof path === 'string' && path.startsWith('/live/')
      ? `<a class="b6-go b6-go--wrap" href="${esc(route(path))}">${text}&nbsp;›</a>` : text;
    const attention = path => typeof path === 'string' && /^\/live\/(?:items?\/|[?#])/.test(path);
    const d = data || {};
    if (id === 'automation') {
      const v = automationView(d, { viewer }), toOwner = !offline && attention(d.attention?.href);
      const problem = !offline && v.problems.length > 0;
      const repairing = v.problems.filter(p => p.repairing).length;
      const tone = offline ? 'off' : toOwner ? 'owner' : problem ? (repairing ? 'repair' : 'owner') : d.health?.state_code === 'lost' ? 'off' : Array.isArray(d.problems) ? 'ok' : 'off';
      // 标题右边不写日期（本人 11-24 13:00 说不要，M720）；要本人动手时照旧在标题后面写“要你做 ›”
      const status = toOwner ? link(d.attention.href, `要${own}做 ›`) : '', next = d.next || {};
      const head = cardTitle('自动任务', href, tone, status);
      const handled = p => p.handler === '本人' ? `等${own}处理`
        : p.handler ? `${p.repairing && !/^已交|在修/.test(p.handler) ? '已交' : ''}${p.handler}` : p.repairing ? 'AI 在修' : '还没人接手';
      const clock = x => U.date(x) === U.date(now) ? U.time(x) : time(x);
      const keepWords = html => html.split(/(<[^>]*>)/).map((part, i) => i % 2 ? part
        : part.replace(/验收|太久|回复/g, '<span class="live-unit">$&</span>')).join('');
      const nextWhen = R.timed(next.at) ? `<span class="live-unit">${esc(clock(next.at))}</span>` : keepWords(esc(next.wait || ''));
      // 大字：今天跑完几轮（点了到自动任务页今天跑完的）；下面“其中几轮没做成 ›”，0 轮照写 0、不带链接
      const big = `<div class="b6-big b6-big--runs"><a href="${esc(route(v.todayHref))}"><em>${num(v.finished)}</em><span>今天跑完的轮</span></a></div>`;
      const fail = v.failed == null ? '' : `<p class="b6-fail">${v.failed > 0 ? go(v.failedHref, `其中 ${esc(v.failed)} 轮没做成`) : '其中 0 轮没做成'}</p>`;
      const bar = v.runs ? timebar(v.runs.map(r => ({ at: r.at, kind: r.ok === false ? 'bad' : 'ok', href: R.runPage(r.href) || R.runHref(r),
        tip: `${clock(r.at)} ${r.ok === false ? '没做成' : '做成了'}${r.title ? ` · ${U.fieldText(r.title, viewer)}` : ''}` })), now, route, '今天每一轮') : '';
      // 第一行：在干哪一轮；没在跑写“这会儿空着 · 下一个 几点 哪一类 ›”
      const doing = v.running.length ? v.running.map(r => `<p>${dot('ok')}在干：${r.what.map(w => field(w)).join('&nbsp;· ')} ${go(r.href, r.round ? `第 ${r.round} 轮` : '看经过')}</p>`).join('')
        : `<p>${dot('off')}${next.title ? `这会儿空着&nbsp;· ${goWrap(next.href, `下一个 ${nextWhen} ${field(next.title, '任务名称')}`)}`
          : Array.isArray(d.running) && d.next === null ? '这会儿空着&nbsp;· 没有排定的运行' : '在跑的和下一个没读到'}</p>`;
      // 每处毛病和接手状态各占一行，关着的类沿用灰点和灰字。
      const problemLine = p => {
        // 摘一句的故障回包有时把沿用的原回复当成原因给出；“这轮沿用原话”是退回原回复的结果。
        const detail = p.title === '摘一句' && /(?:这轮|本轮)沿用原话/.test(p.text)
          ? '摘要没能整理成可用文字，这次用了原来的回复' : p.raw.text;
        const what = p.text && p.title && !p.text.includes(p.title) ? `${field(p.raw.title)}&nbsp;· ${field(detail)}` : field(detail || p.raw.title);
        const who = [handled(p), p.round && !/轮/.test(p.handler) && `第 ${p.round} 轮`].filter(Boolean).map(esc).join('&nbsp;· ');
        return `<p class="b6-problem">${dot(p.repairing ? 'repair' : 'owner')}${goWrap(p.href, `出毛病的：${keepWords(what)}`)}&nbsp;· <span class="b6-muted">${who}</span></p>`;
      };
      const trouble = v.problems.length ? v.problems.map(problemLine).join('') : Array.isArray(d.problems) ? `<p>${dot('ok')}没有出毛病的</p>` : '';
      const disabled = items(d.disabled).map(row => `<p class="b6-muted b6-disabled">${dot('off')}${link(row.href, field(row.title))}&nbsp;· 关着</p>`).join('');
      const w = v.week, week = w ? `<p>${dot('ok')}${goWrap(R.listHref(), `近 7 天替${own}：记下新消息 ${num(w.messages_logged)} 条&nbsp;· 修好 <span class="live-unit">${num(w.repaired)} 件</span>&nbsp;· 规矩改好 ${num(w.rules_fixed)} 处`)}</p>` : '';
      return { tone, head, body: publicHtml(`${big}${fail}${bar}<div class="b6-lines">${doing}${trouble}${disabled}${week}</div>
        <p class="b6-muted b6-foot">${v.aiSeconds != null ? `今天后台 AI 用了 ${esc(spent(v.aiSeconds))}` : '今天后台 AI 用时还没读到'}&nbsp;· ${num(d.category_count)} 类里开着 ${num(d.enabled_count)} 类</p>`, viewer) };
    }
    if (id === 'agents') {
      const v = agentsView(d, { viewer, now });
      const need = row => !offline && row.status === 'owner' && attention(row.href);
      const repair = v.rows.filter(row => ['repair', 'owner'].includes(row.status) && !need(row));
      const ok = v.rows.filter(row => row.status === 'ok').length;
      const tone = offline ? 'off' : v.rows.some(need) ? 'owner' : repair.length ? 'repair' : ok === 3 ? 'ok' : 'off';
      // 标题右边写今天几号（本人 11-24 02:45 选 A，照 v3）；要本人看时照旧在标题后面写“要你看 ›”
      const status = tone === 'owner' ? link(v.rows.find(need).href, `要${own}看 ›`) : '';
      // 每家一个小签：照规矩／差 N 处 · 在修 第 N 轮 ›（点到那一轮）／还没人接手
      const chip = row => {
        if (need(row)) return `<a class="b6-chip" data-kind="owner" href="${esc(route(row.href))}">要${own}看 ›</a>`;
        if (row.status === 'ok') return '<span class="b6-chip" data-kind="ok">照规矩</span>';
        if (['repair', 'owner'].includes(row.status)) {
          const n = row.issues.length, gap = n ? `差 ${n} 处 · ` : '';
          if (!row.fixing) return `<span class="b6-chip" data-kind="off">${gap}还没人接手</span>`;
          const text = `${gap}在修${row.round ? ` 第 ${row.round} 轮` : ''}`;
          return row.fixHref ? `<a class="b6-chip" data-kind="repair" href="${esc(route(row.fixHref))}">${text} ›</a>` : `<span class="b6-chip" data-kind="repair">${text}</span>`;
        }
        return `<span class="b6-chip" data-kind="off">${row.status === 'ignored' ? `${own}定了不管` : '没数据'}</span>`;
      };
      const hours = x => count(x) ? (x >= 10 ? Math.round(x) : Math.round(x * 10) / 10) : null;
      // 回包里的版号是采集时的比较依据。规则页展示网站另行发布的正文。
      const ruleVersion = typeof d.rule_version === 'string' && /^E[1-9]\d*$/.test(d.rule_version) ? esc(d.rule_version) : '';
      const ruleAt = Number.isFinite(Date.parse(d.at)) ? U.time(d.at) : '';
      const ruleSample = ruleVersion
        ? (ruleAt ? `<span class="b6-rule-part">三家开场读的规矩 ${ruleVersion} · </span><wbr><span class="b6-rule-part">${esc(ruleAt)} 读到</span> ` : '')
        : '没读到 ';
      const work = row => {
        const t = row.today;
        if (!t) return `<span class="b6-host__work">${v.noToday ? '' : `今天的数 ${num(null)}`}</span>`;
        // 小时没读到、也没登记开工、你也没跟它说话：今天就是没干活，照别家没开工那样写，不留一个空着的“ 小时”（M839）
        if ((t.hours === 0 || t.hours == null && t.said === 0) && t.starts === 0) return `<a class="b6-host__work" href="${esc(route(row.workHref))}">今天还没开工${t.last ? ` · 上次 ${esc(U.date(t.last))}` : ''} ›</a>`;
        // “开工 N 件”是报了估时登记开工的件数，跟前面实际在干的小时数不是一回事（Codex 26 小时、开工 0 件），本人 11-26 04:27 选 A 去掉
        return `<a class="b6-host__work" href="${esc(route(row.workHref))}">${num(hours(t.hours))} 小时 · ${own}说 ${num(t.said)} 句 ›</a>`;
      };
      // 平均同时几个在干：不到 10 写一位小数
      const together = x => x >= 10 ? Math.round(x) : Math.round(x * 10) / 10;
      return { tone, head: cardTitle('智能体', href, tone, status) + `<span class="b6-date">${esc(v.date)}</span>`, body:
        // 后台这一块没给今天的数（today 为空）：不画“··”免得像还在加载，写明没送到、最近一次是几点读到的（主持 11-24 06:12）
        (v.noToday ? `<div class="b6-big"><strong>今天的数还没送到</strong>${v.at ? `<span class="b6-big__aside">最近一次记录于 ${esc(v.at)}</span>` : ''}</div>`
          // 这句点进智能体页“三家干了多少”那块（#hours），时间直接选“今天”和这里对得上（?hours=today），不预先选哪一家（M738）
          // 小时数是叠加的（同时在干的分别算），写明“叠加”，旁边小字“平均同时 N 个在干”，一天过 24 小时也看得懂（主控 11-26 03:50 点名）
          : `<div class="b6-big"><strong><a href="${esc(route('/live/agents/?hours=today#hours'))}">今天三家叠加干了 <em>${num(hours(v.hours))}</em> 小时 ›</a></strong><span class="b6-big__aside">${v.together ? `平均同时 ${esc(together(v.together))} 个在干 · ` : ''}${own}说了 ${num(v.said)} 句</span></div>`) + `
        <ul class="b6-hosts">${v.rows.map(row => `<li class="b6-host" style="--host:${row.color}"><a class="b6-host__name" href="${esc(route(row.workHref))}"><i aria-hidden="true"></i>${esc(row.name)}</a>${chip(row)}${work(row)}</li>`).join('')}</ul>
        <p class="b6-foot b6-foot--split"><span>${ruleSample}<a class="b6-go b6-rule-part" href="/rules/">规则页 ›</a></span>${go(options.openingHref || OPENING, '开场页 · 三家')}</p>` };
    }

    // AI 自动任务账本卡（照“首页账本卡-v1”，本人 11-26 01:04 批照图施工）：欠着几件（大字）、放着几件 ›；今天要看的时间条；
    // 今天要看的前 3 件；底行写今天要看、近 7 天了结的件数。原卡的“新账起进”“跟得最久”图上没有，照图去掉（页面说明·账本 第一节 6）。
    const v = ledgerView(d, { viewer }), c = ledgerCard(d, { now });
    const tone = d.repair && !offline ? 'repair' : !v.pending && (count(c.owed) || count(c.parked)) && !offline ? 'ok' : 'off';
    const head = cardTitle('AI 自动任务账本', href, tone, '');
    if (v.pending) return { tone, head, body: `<div class="b6-big"><strong>正在重算</strong></div><p class="b6-muted">新账从正式生效那一刻起算，算好了这里写欠着几件、放着几件。</p>` };
    const foot = `<p class="b6-foot b6-lg-foot">${c.due == null ? `今天要看 ${num(null)} 件` : `<a href="${esc(route(c.dueHref))}">今天要看 <b>${esc(c.due)}</b> 件</a>`}&nbsp;· ${go(c.closedHref, `近 7 天了结 <b>${num(c.closed)}</b> 件`)}</p>`;
    if (c.owed === 0 && c.parked === 0) return { tone, head, body: `<p class="b6-empty">AI 暂无待跟事项</p>${foot}` };
    const clock = x => U.date(x) === U.date(now) ? U.time(x) : time(x);
    const top = `<div class="b6-lg"><a class="b6-lg__owed" href="${esc(route(c.owedHref))}">欠着 <em>${num(c.owed)}</em> 件</a><i class="b6-lg__sep" aria-hidden="true"></i>`
      + `<a class="b6-lg__parked" href="${esc(route(c.parkedHref))}">放着 <b>${num(c.parked)}</b> 件<span class="b6-lg__chev">›</span></a></div>`;
    const bar = timebar(c.today.map(r => ({ at: r.next_at, kind: c.late(r) ? 'late' : 'next', href: r.href,
      tip: `${U.fieldText(r.title, viewer)} · ${c.late(r) ? `到点没看，原定 ${clock(r.next_at)}` : `${clock(r.next_at)} 看`}` })), now, route, '今天要看的');
    // 列出来的每一件：标题点了到那件；到点没看的橙点、写“到点没看，原定几点”，还没到的绿点、写“几点看”
    // 这件对外换了说法的，标题后面挂“对外换了说法”（两版都挂，M930；本人版访客看不到的另挂“访客看不到”）
    const titleTag = r => { const t = U.visitorLabel(r, ['$', 'title', 'plain_title'], '这件事的说法', viewer); return t ? ` ${t}` : ''; };
    const keepWords = html => html.replace(/(<[^>]+>)|处理|证据|事务/g, (word, tag) => tag || `<span class="live-unit">${word}</span>`);
    const dueItem = r => `<div class="b6-lg-item">${dot(c.late(r) ? 'late' : 'ok')}<p>${goWrap(r.href, keepWords(field(r.title, '事项标题')))}${titleTag(r)}</p>`
      + `<small class="b6-muted">· ${c.late(r) ? `到点没看，原定 ${esc(clock(r.next_at))}` : `${esc(clock(r.next_at))} 看`}</small></div>`;
    const list = c.today.length ? c.today.slice(0, 3).map(dueItem).join('')
      : `<p class="b6-muted b6-lg-none">今天没有要看的${c.after ? ` · ${go(c.after.href, `下一件 ${esc(time(c.after.next_at))}`)}` : ''}</p>`;
    return { tone, head, body: publicHtml(`${top}${bar}<div class="b6-lg-list">${list}</div>${foot}`, viewer) };
  }
  // AI 对话卡和 AI 对话页顶上那一行“后台另有 N 个在跑 ›”：数自动任务这会儿在跑的轮数（AI 对话不列后台的对话，本人定的）。
  function backgroundRunning(automation) {
    const d = automation && typeof automation === 'object' ? automation : null;
    if (!d) return null;
    const n = Number.isInteger(d.running_total) ? d.running_total : Array.isArray(d.running) ? d.running.length : null;
    return n == null ? null : { n, href: R.listHref() };
  }
  window.LiveBatchHome = { render, backgroundRunning };
})();

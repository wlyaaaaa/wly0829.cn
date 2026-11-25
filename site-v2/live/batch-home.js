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
  // 首页自动任务卡：今天的三个数、上一次、在干、出毛病的。
  const METRICS = [['repaired', '修好', 'auto-repair', n => `修好 ${n} 件`],
    ['messages_logged', '记下新消息', 'message-review', n => `记下 ${n} 件新消息`],
    ['rules_fixed', '规矩改好', 'weekly-rules', n => `规矩改好 ${n} 处`]];
  function automationView(d, { viewer }) {
    const today = d.results_today && typeof d.results_today === 'object' ? d.results_today : d.today || {};
    const metrics = METRICS.map(([key, label, category]) => ({ key, label, n: today[key], href: R.listHref({ category, date: 'today' }) }));
    // 上一次：三个数各自的上一次（后台 results_today.previous，只算今天以前、数不是 0 的那天）里取最近的一项，链到那一类那一天。
    // 不拿 latest_completed 顶：它把自动修理“查实已经好了、不是 AI 动手修的”那轮和别的类也算有产出，
    // 卡上会一边写“修好 0”一边写“上次：今天 06:17 …已修复”（M720）。
    const prev = today.previous && typeof today.previous === 'object' ? today.previous : {};
    const before = METRICS.map(([key, , category, say]) => ({ p: prev[key], category, say }))
      .filter(x => x.p && R.timed(x.p.at) && x.p.count > 0).sort((a, b) => Date.parse(b.p.at) - Date.parse(a.p.at))[0];
    const last = before ? { at: before.p.at, text: before.say(before.p.count), href: R.listHref({ category: before.category, date: before.p.date }) } : null;
    // 今天跑完了几个：后台 results_today.finished_runs，和自动任务页“今天跑完的”同一口径；后台还没给就只给一个看今天跑完的链接
    const finished = count(today.finished_runs) ? today.finished_runs : null;
    const running = items(d.running).map(r => ({
      what: [R.categoryName(r.category, viewer), r.title || r.summary].filter(Boolean),
      round: Number.isInteger(r.round) && r.round > 0 ? r.round : null, href: R.runHref(r) || r.href,
    }));
    const problems = items(d.problems).map(p => {
      const title = U.fieldText(p.title, viewer), text = U.fieldText(p.text, viewer);
      const repairing = typeof p.repairing === 'boolean' ? p.repairing : p.handler !== '本人';   // 旧包没有 repairing：照原来，写明等本人的才不算在修
      return { title, text, raw: p, repairing, handler: p.handler_text || p.handler || '', round: count(p.round) && p.round > 0 ? p.round : null, href: R.runPage(p.href) };
    });
    const aiMinutes = count(today.ai_seconds) ? Math.round(today.ai_seconds / 60) : d.today?.ai_minutes;
    return { metrics, zero: metrics.every(m => m.n === 0), last, finished, todayHref: R.listHref({ date: 'today' }), running, problems, aiMinutes };
  }

  // 首页智能体卡：今天三家干了多久、本人说了几句；每家一行（家色、小签、今天的数）。被拦几次本人 11-24 03:00 定了不写（别处也不放）。
  // 取数照数据约定-前端升级 §11：data.agents.today = {date, providers:[{id, actual_minutes, starts, messages, last_at, href}], total}
  // 工时按实际干活的时间算（本人 11-24 13:55 选 A，M728）：后台给了 today.activity（和智能体页“三家干了多少”同一份）就用它的 actual_minutes，没给照旧
  const HOST_COLOR = { claude: '#e8913f', codex: '#16a6c4', antigravity: '#7a63e8' };
  const hoursOf = m => count(m) ? m / 60 : null;
  function agentsView(d, { now }) {
    const today = d.today && typeof d.today === 'object' ? d.today : null, total = today?.total || {};
    const act = today?.activity && typeof today.activity === 'object' ? today.activity : null;
    const current = d.rule_current === true || d.active_version && d.active_version === d.rule_version ? ' 当前版'
      : d.rule_current === false || d.active_version && d.rule_version && d.active_version !== d.rule_version ? `，不是当前版${d.active_version ? ` ${esc(d.active_version)}` : ''}` : '';
    const rows = Object.entries(entries).map(([key, name]) => {
      const p = items(d.providers).find(x => x.id === key) || { id: key, name, status: 'missing' };
      const t = items(today?.providers).find(x => x.id === key) || null, last = t?.last_at || {};
      const issues = items(p.issues);
      // 在修：只有 repairing 为真才算（约定 §10）；旧包没有 repairing 时写了谁在修就算。第几轮、点到哪一轮取在修那几处里第一处写明了的
      const busy = issues.filter(i => i.repairing === true || i.repairing == null && (i.handler || i.handler_text));
      const fix = busy.find(i => typeof i.href === 'string' && i.href.startsWith('/live/')) || {};
      // 点这一家那一行：到智能体页“三家各干了多少活”那块（#work），高亮这一家；后台给了这一家的地址就用它（网址只看一家一律 ?family=，F1 定的）
      const base = typeof t?.href === 'string' && t.href.startsWith('/live/agents/') ? t.href : `/live/agents/?family=${key}`;
      return { ...p, name: p.name || name, color: HOST_COLOR[key], issues, fixing: issues.length ? busy.length > 0 : p.status === 'repair',
        round: busy.map(i => i.round).find(r => count(r) && r > 0) || null, fixHref: R.runPage(fix.href) || null,
        workHref: base.includes('#') ? base : `${base}#work`,
        // “上次”：这一家今天的数是证实的 0 时，用 last_at 里对应那一项（工时没有就看开工）
        today: t ? { hours: hoursOf(act ? act.hosts?.[key]?.actual_minutes : t.actual_minutes), starts: t.starts, said: t.messages, last: last.work || last.starts || null } : null };
    });
    return { rows, current, date: R.todayLabel(/^\d{4}-\d\d-\d\d$/.test(today?.date || '') ? `${today.date}T12:00:00+08:00` : now),
      hours: hoursOf(act ? act.total?.actual_minutes : total.actual_minutes), said: total.messages, noToday: !today, at: time(d.at) };
  }
  // 首页 AI 账本卡：新账起（后台清零重算，从正式生效那一刻算），AI 在跟几件、今天到日子、跟得最久、新账起进了结。
  // 取数照数据约定 §11：data.ledger.new_ledger = {started_at, open, opened, closed, due, overdue, next_due, opened_7d?, closed_7d?}，每个数 {count, href}；
  // href 是账本页 ?view=…，点了到账本页筛好的那几件，件数和卡上一样。new_ledger 为 null 是还没生效。
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
  const MISSING = { agents: '智能体', automation: '自动任务', ledger: 'AI 账本' };
  function render(id, data, options) {
    const { viewer, route, href, offline, now } = options;
    if (data == null && MISSING[id]) {
      const name = MISSING[id], say = offline ? `${name}：这块没存下来，连上后补上。` : `${name}暂时读不到`;
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
      const metric = m => `<a class="b6-metric" href="${esc(route(m.href))}"><b>${num(m.n)}</b><small>${esc(m.label)}</small></a>`;
      const handled = p => p.handler === '本人' ? `等${own}处理`
        : p.handler ? `${p.repairing && !/^已交|在修/.test(p.handler) ? '已交' : ''}${p.handler}` : p.repairing ? 'AI 在修' : '还没人接手';
      const problemLine = p => {
        const what = p.text && p.title && !p.text.includes(p.title) ? `${field(p.raw.title)} · ${field(p.raw.text)}` : field(p.raw.text || p.raw.title);
        const who = [handled(p), p.round && !/轮/.test(p.handler) && `第 ${p.round} 轮`].filter(Boolean).join(' · ');
        return `<p>${dot(p.repairing ? 'repair' : 'owner')}出毛病的：${what} · ${go(p.href, esc(who))}</p>`;
      };
      // 三个数都是 0：写明是这三样今天还是 0、今天其实跑完了几个（点了到自动任务页今天跑完的），再写这三样上次有数是哪天（M720）
      const zeroLine = () => {
        const ran = v.finished != null ? `${go(v.todayHref, `今天跑完 ${esc(v.finished)} 个`)}，这三样还都是 0`
          : `这三样今天还都是 0 · ${go(v.todayHref, '看今天跑完的')}`;
        // “上次：昨晚 22:44”连在一起不断行（免得“昨晚”被拆在两行）
        const at = v.last && R.when(v.last.at, now, { relative: true });
        const before = v.last ? ` · <span class="live-unit">上次：${at ? esc(at) : ''}</span> ${goWrap(v.last.href, field(v.last.text, '那一轮的结果'))}` : '';
        return `<p class="b6-last">${ran}${before}</p>`;
      };
      return { tone, head, body:
        `<div class="b6-metrics">${v.metrics.map(metric).join('')}</div>
        ${v.zero ? zeroLine() : ''}
        ${v.running.length ? v.running.map(r => `<p>${dot('ok')}在干：${r.what.map(w => field(w)).join(' · ')} ${go(r.href, r.round ? `第 ${r.round} 轮` : '看经过')}</p>`).join('')
          : `<p>${next.title ? `下次 ${esc(time(next.at) || next.wait || '')} · ${link(next.href, field(next.title, '任务名称'))}`
            : Array.isArray(d.running) && d.next === null ? '没有排定的运行' : '运行和下次时间没读到'}</p>`}
        ${v.problems.map(problemLine).join('')}
        ${items(d.disabled).map(row => `<p class="b6-muted">${dot('off')}${link(row.href, field(row.title))} · 关着</p>`).join('')}
        <p class="b6-muted b6-foot">${count(v.aiMinutes) ? `今天 AI 用了 ${esc(v.aiMinutes)} 分钟` : '今天 AI 用时还没读到'} · ${num(d.category_count)} 类里开着 ${num(d.enabled_count)} 类</p>` };
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
      // 规则版本号（E 加数字）点了去规则页，绿字带箭头（本人 11-24 13:00）；没读到版本号就照旧只写字
      const ruleLine = text => typeof d.rule_version === 'string' && /^E\d+$/.test(d.rule_version) ? `<a class="b6-go" href="/rules/">${text} ›</a>` : `<span>${text}</span>`;
      const work = row => {
        const t = row.today;
        if (!t) return `<span class="b6-host__work">${v.noToday ? '' : `今天的数 ${num(null)}`}</span>`;
        if (t.hours === 0 && t.starts === 0) return `<a class="b6-host__work" href="${esc(route(row.workHref))}">今天还没开工${t.last ? ` · 上次 ${esc(U.date(t.last))}` : ''} ›</a>`;
        return `<a class="b6-host__work" href="${esc(route(row.workHref))}">${num(hours(t.hours))} 小时 · 开工 ${num(t.starts)} 件 · ${own}说 ${num(t.said)} 句 ›</a>`;
      };
      return { tone, head: cardTitle('智能体', href, tone, status) + `<span class="b6-date">${esc(v.date)}</span>`, body:
        // 后台这一块没给今天的数（today 为空）：不画“··”免得像还在加载，写明没送到、最近一次是几点读到的（主持 11-24 06:12）
        (v.noToday ? `<div class="b6-big"><strong>今天的数还没送到</strong>${v.at ? `<span class="b6-big__aside">最近一次记录于 ${esc(v.at)}</span>` : ''}</div>`
          // 这句点进智能体页“三家干了多少”那块（#hours），时间直接选“今天”和这里对得上（?hours=today），不预先选哪一家（M738）
          : `<div class="b6-big"><strong><a href="${esc(route('/live/agents/?hours=today#hours'))}">今天三家干了 <em>${num(hours(v.hours))}</em> 小时 ›</a></strong><span class="b6-big__aside">${own}说了 ${num(v.said)} 句</span></div>`) + `
        <ul class="b6-hosts">${v.rows.map(row => `<li class="b6-host" style="--host:${row.color}"><a class="b6-host__name" href="${esc(route(row.workHref))}"><i aria-hidden="true"></i>${esc(row.name)}</a>${chip(row)}${work(row)}</li>`).join('')}</ul>
        <p class="b6-foot b6-foot--split">${ruleLine(`规则 ${field(d.rule_version) || num(null)}${v.current}`)}${go(options.openingHref || OPENING, '开场页 · 三家')}</p>` };
    }

    // AI 账本卡（本人 11-24 02:45 选 A，照 v3）：AI 在跟几件、今天到日子、跟得最久、新账起进了结；每个数点了到账本页筛好的那几件
    const v = ledgerView(d, { viewer });
    const tone = d.repair && !offline ? 'repair' : !v.pending && count(v.open.n) && !offline ? 'ok' : 'off';
    const head = cardTitle('AI 账本', href, tone, '') + (v.since ? `<span class="b6-date">${esc(U.date(v.since))} 新账起</span>` : '');
    if (v.pending) return { tone, head, body: `<div class="b6-big"><strong>正在重算</strong></div><p class="b6-muted">新账从正式生效那一刻起算，算好了这里写 AI 在跟几件。</p>` };
    const flow = v.legacy || v.week
      ? `近 7 天进 ${go(v.opened.href, num(v.opened.n))} · 了结 ${go(v.closed.href, num(v.closed.n))}`
      : `新账起：进 ${go(v.opened.href, `${num(v.opened.n)} 件`)} · 了结 ${go(v.closed.href, `${num(v.closed.n)} 件`)}`;
    if (v.open.n === 0) return { tone, head, body: `<p class="b6-empty">${v.since ? `自 ${esc(R.todayLabel(v.since).replace('今天 ', ''))} ${esc(U.time(v.since))} 起，` : ''}AI 暂无待跟事项</p><p class="b6-foot">${flow}</p>` };
    const oldest = v.oldest, limit = count(oldest?.check_limit) && oldest.check_limit > 0 ? oldest.check_limit : 3;
    // “第 N 次看”跟账本页同一个说法：下次看是第几次（看过 check_count 次）；看满了写看满
    const looked = !oldest || !count(oldest.check_count) ? '' : oldest.check_count >= limit ? ` · ${esc(limit)} 次看满了` : ` · 第 ${esc(oldest.check_count + 1)} 次看`;
    const dueLine = v.due.n == null ? `今天到日子 ${num(null)} 件`
      : v.due.n > 0 ? `${go(v.due.href, `今天到日子 ${esc(v.due.n)} 件`)}${v.overdue.n > 0 ? ` ${v.overdue.href ? `<a class="b6-big__aside" href="${esc(route(v.overdue.href))}">` : '<span class="b6-big__aside">'}过期的 ${esc(v.overdue.n)} 件排最前${v.overdue.href ? '</a>' : '</span>'}` : ''}`
      : `今天没有到日子的${v.next ? ` · ${go(v.next.href, `下一件 ${esc(v.next.day)}`)}` : ''}`;
    // 列出来的每一件：标题点了到那件；过期的写“过期”，到点了写“该看了 · 原定几点”，还没到点写“下次几点”
    const clock = x => U.date(x) === U.date(now) ? U.time(x) : time(x);
    const dueItem = r => {
      const due = R.timed(r.next_at) ? r.next_at : null, passed = due && Date.parse(due) <= Date.parse(now);
      const when = r.overdue === true ? `过期${due ? ` · 原定 ${esc(time(due))}` : ''}` : due ? (passed ? `该看了 · 原定 ${esc(clock(due))}` : `下次 ${esc(clock(due))}`) : '';
      return `<p class="b6-due-item">${dot(r.overdue === true || passed ? 'owner' : 'ok')}${goWrap(r.href, field(r.title, '事项标题'))}${when ? ` <span class="b6-muted">· ${when}</span>` : ''}</p>`;
    };
    return { tone, head, body:
      `<div class="b6-big"><strong>AI 在跟 <em>${v.open.n == null ? num(null) : `<a href="${esc(route(v.open.href))}">${esc(v.open.n)}</a>`}</em> 件</strong></div>
      <p>${dueLine}</p>
      ${v.due.n > 0 ? v.dueItems.slice(0, 3).map(dueItem).join('') : ''}
      ${oldest || v.oldestText && v.open.n == null ? `<p class="b6-last">跟得最久：${oldest ? `${oldest.next_at ? field(oldest.title, '事项标题') : go(oldest.href, field(oldest.title, '事项标题'))}${looked}${oldest.next_at ? ` · ${go(oldest.href, `下次 ${esc(U.date(oldest.next_at))}`)}` : ''}` : v.oldestText}</p>` : ''}
      <p class="b6-foot">${flow}</p>` };
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

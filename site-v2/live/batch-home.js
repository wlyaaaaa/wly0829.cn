(() => {
  'use strict';
  const U = window.LiveUI, R = window.LiveRuns, { esc } = U;
  const entries = { claude: 'Claude', codex: 'Codex', antigravity: 'Antigravity' };
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
  function automationView(d, { viewer, now }) {
    const today = d.results_today && typeof d.results_today === 'object' ? d.results_today : d.today || {};
    const metrics = METRICS.map(([key, label, category]) => ({ key, label, n: today[key], href: R.listHref({ category, date: 'today' }) }));
    // 上一次：后台给的“最近有产出的那一轮”优先；没有就从三项各自的上一次里取最近的一项，链到那一类那一天。
    const lc = d.latest_completed, prev = today.previous && typeof today.previous === 'object' ? today.previous : {};
    const before = METRICS.map(([key, , category, say]) => ({ p: prev[key], category, say }))
      .filter(x => x.p && R.timed(x.p.at) && x.p.count > 0).sort((a, b) => Date.parse(b.p.at) - Date.parse(a.p.at))[0];
    const last = lc && (lc.summary || R.runHref(lc))
      ? { at: [lc.finished_at, lc.last_activity_at, lc.started_at].find(R.timed), text: lc.summary || R.categoryName(lc.category, viewer), href: R.runHref(lc) }
      : before ? { at: before.p.at, text: before.say(before.p.count), href: R.listHref({ category: before.category, date: before.p.date }) } : null;
    const running = items(d.running).map(r => ({
      what: [R.categoryName(r.category, viewer), r.title || r.summary].filter(Boolean),
      round: Number.isInteger(r.round) && r.round > 0 ? r.round : null, href: R.runHref(r) || r.href,
    }));
    const problems = items(d.problems).map(p => {
      const title = U.fieldText(p.title, viewer), text = U.fieldText(p.text, viewer);
      const repairing = typeof p.repairing === 'boolean' ? p.repairing : p.handler !== '本人';   // 旧包没有 repairing：照原来，写明等本人的才不算在修
      return { title, text, raw: p, repairing, handler: p.handler_text || p.handler || '', round: count(p.round) && p.round > 0 ? p.round : null, href: p.href };
    });
    return { date: R.todayLabel(today.from || now), metrics, zero: metrics.every(m => m.n === 0), last, running, problems };
  }

  function render(id, data, options) {
    const { viewer, route, href, offline, now } = options;
    const own = viewer === 'owner' ? '你' : '本人', field = (v, name) => U.fieldHtml(v, { name, kind: viewer });
    const link = (path, text) => typeof path === 'string' && path.startsWith('/live/')
      ? `<a href="${esc(route(path))}">${text}</a>` : text;
    // 能点过去的绿字（“第 2 轮 ›”“已交自动修理 ›”）；地址不在站内就只写字、不带箭头
    const go = (path, text) => typeof path === 'string' && path.startsWith('/live/')
      ? `<a class="b6-go" href="${esc(route(path))}">${text} ›</a>` : text;
    const attention = path => typeof path === 'string' && /^\/live\/(?:items?\/|[?#])/.test(path);
    const d = data || {};
    if (id === 'automation') {
      const v = automationView(d, { viewer, now }), toOwner = !offline && attention(d.attention?.href);
      const problem = !offline && v.problems.length > 0;
      const repairing = v.problems.filter(p => p.repairing).length;
      const tone = offline ? 'off' : toOwner ? 'owner' : problem ? (repairing ? 'repair' : 'owner') : d.health?.state_code === 'lost' ? 'off' : Array.isArray(d.problems) ? 'ok' : 'off';
      // 标题右边写今天几号（本人选 A）；要本人动手时照旧在标题后面写“要你做 ›”
      const status = toOwner ? link(d.attention.href, `要${own}做 ›`) : '';
      const head = cardTitle('自动任务', href, tone, status) + `<span class="b6-date">${esc(v.date)}</span>`;
      const metric = m => `<a class="b6-metric" href="${esc(route(m.href))}"><b>${num(m.n)}</b><small>${esc(m.label)}</small></a>`;
      const handled = p => p.handler === '本人' ? `等${own}处理`
        : p.handler ? `${p.repairing && !/^已交|在修/.test(p.handler) ? '已交' : ''}${p.handler}` : p.repairing ? 'AI 在修' : '还没人接手';
      const problemLine = p => {
        const what = p.text && p.title && !p.text.includes(p.title) ? `${field(p.raw.title)} · ${field(p.raw.text)}` : field(p.raw.text || p.raw.title);
        const who = [handled(p), p.round && !/轮/.test(p.handler) && `第 ${p.round} 轮`].filter(Boolean).join(' · ');
        return `<p>${dot(p.repairing ? 'repair' : 'owner')}出毛病的：${what} · ${go(p.href, esc(who))}</p>`;
      };
      return { tone, head, body:
        `<div class="b6-metrics">${v.metrics.map(metric).join('')}</div>
        ${v.zero && v.last ? `<p class="b6-last">今天还没有${v.last.at ? ` · 上次：${esc(R.when(v.last.at, now, { relative: true }))}` : ' · 上次：'} ${go(v.last.href, field(v.last.text, '那一轮的结果'))}</p>` : ''}
        ${v.running.map(r => `<p>${dot('ok')}在干：${r.what.map(w => field(w)).join(' · ')} ${go(r.href, r.round ? `第 ${r.round} 轮` : '看经过')}</p>`).join('')}
        ${v.problems.map(problemLine).join('')}
        ${items(d.disabled).map(row => `<p class="b6-muted">${dot('off')}${link(row.href, field(row.title))} · 关着</p>`).join('')}` };
    }
    if (id === 'agents') {
      const rows = Object.entries(entries).map(([key, name]) => items(d.providers).find(p => p.id === key) || { name, status: 'missing' });
      const need = row => !offline && row.status === 'owner' && attention(row.href);
      const repair = rows.filter(row => ['repair', 'owner'].includes(row.status) && !need(row));
      const n = repair.reduce((sum, row) => sum + items(row.issues).length, 0);
      const ok = rows.filter(row => row.status === 'ok').length;
      const tone = offline ? 'off' : rows.some(need) ? 'owner' : repair.length ? 'repair' : ok === 3 ? 'ok' : 'off';
      const big = value => `<b class="b6-num">${esc(value)}</b>`;
      const status = tone === 'owner' ? link(rows.find(need).href, `要${own}看 ›`) : tone === 'repair' ? n ? `${big(n)} 处不对，AI 在修` : 'AI 在修' : ok === 3 && !offline ? `${big(3)} 家都照规矩` : offline ? '电脑连不上' : '部分状态没读到';
      const chip = row => {
        const state = need(row) ? 'owner' : ['owner','repair'].includes(row.status) ? 'repair' : row.status;
        const issues = items(row.issues);
        const label = { ok: '照规矩', owner: `要${own}看 ›`, repair: `${issues.length ? issues.length + ' 处不对 · ' : ''}AI 在修`, ignored: `${own}定了不管` }[state] || '没数据';
        const html = `<span class="b6-chip" data-kind="${esc(state)}">${dot(offline ? 'off' : state)}${esc(row.name)} ${label}</span>`;
        return link(need(row) ? row.href : href, html);
      };
      // 版本读当前版：后台说了是不是当前版才写“当前版”；不是当前版写清当前是哪版
      const current = d.rule_current === true || d.active_version && d.active_version === d.rule_version ? ' 当前版'
        : d.rule_current === false || d.active_version && d.rule_version && d.active_version !== d.rule_version ? `，不是当前版${d.active_version ? ` ${esc(d.active_version)}` : ''}` : '';
      // 每一处“差 1 处”写清谁在修、第几轮，点了到那一轮或那件事（版式照旧，本人 11-24 02:05 说三张卡内容另定）
      const fixer = issue => {
        const who = U.fieldText(issue.handler_text || issue.handler, viewer);
        return [who ? `${who}在修` : '在修', count(issue.round) && issue.round > 0 && !/轮/.test(who) && `第 ${issue.round} 轮`].filter(Boolean).join(' · ');
      };
      return { tone, head: cardTitle('智能体', href, tone, status), body:
        `<p class="b6-chips">${rows.map(chip).join('')}</p>
        <p class="b6-muted">规则 ${field(d.rule_version) || num(null)}${current} · 钩子近 7 天跑 ${num(d.hooks_7d?.runs)} 次，出错 ${num(d.hooks_7d?.errors)} 次</p>
        ${rows.flatMap(row => items(row.issues).map(issue => `<p class="b6-muted">${dot('repair')}${esc(row.name)} · ${field(issue.text)} · ${go(issue.href || row.href || href, esc(fixer(issue)))}</p>`)).join('')}
        <p class="b6-foot b6-foot--go">${go(options.openingHref || '/live/agents/opening/', '开场页 · 三家')}</p>` };
    }

    const oldest = d.oldest, due = items(d.due_today), max = Math.max(1, d.opened_7d || 0, d.closed_7d || 0);
    const bar = (n, label, kind) => `<div>${label} ${num(n)} 件${count(n) ? `<span class="b6-meter" data-kind="${kind}"><i style="width:${100*n/max}%"></i></span>` : ''}</div>`;
    const checks = count(oldest?.check_count) && count(oldest?.check_limit) ? `<p class="b6-checks">${Array.from({ length: Math.min(12, oldest.check_limit) }, (_, i) => dot(i < oldest.check_count ? 'ok' : 'off')).join('')}第 ${oldest.check_count} 次看，最多 ${oldest.check_limit} 次</p>` : '';
    // “跟得最久”只从 AI 真在跟的事里挑（后台挑好给 oldest）；一件也没有时照后台的 oldest_text 写，不写“没读到”
    const none = field(d.oldest_text) || (oldest === null || d.open === 0 ? '现在没有 AI 正在跟的事' : '');
    return { tone: d.repair && !offline ? 'repair' : count(d.open) && !offline ? 'ok' : 'off',
      head: cardTitle('AI 账本', href, d.repair && !offline ? 'repair' : count(d.open) && !offline ? 'ok' : 'off', ''),
      body: `<div class="b6-ledger-top"><strong>手上 <em>${num(d.open)}</em> 件</strong><div>${bar(d.opened_7d, '近 7 天新进', 'in')}${bar(d.closed_7d, '了结', 'out')}</div></div>
      ${oldest || none ? `<p><span class="b6-badge">跟得最久</span> ${oldest ? `${link(oldest.href, field(oldest.title, '事项标题'))} · ${num(oldest.days)} 天` : none}</p>${checks}` : ''}
      <p><span class="b6-badge">今天到日子 ${num(Array.isArray(d.due_today) ? due.length : null)} 件</span></p>
      ${[...due].sort((a,b) => Number(Boolean(b.overdue)) - Number(Boolean(a.overdue))).slice(0,3).map(row => `<p class="b6-due">${link(row.href || (row.id ? '/live/issue/?id=' + encodeURIComponent(row.id) : ''), field(row.title || row.text, '事项标题'))}<small>${row.overdue ? '过期 · ' : ''}${esc(time(row.next_at) || U.fieldText(row.wait?.text, viewer))}</small></p>`).join('')}
      ${d.repair ? `<p>${dot('repair')}${link(d.repair.href, '已交自动修理')}${d.repair.text && U.fieldText(d.repair.text, viewer).replace(/[\s。.]+$/, '') !== '已交自动修理' ? ' · ' + field(d.repair.text) : ''}</p>` : ''}` };
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

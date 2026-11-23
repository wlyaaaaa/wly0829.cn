(() => {
  'use strict';
  const U = window.LiveUI, { esc } = U;
  const entries = { claude: 'Claude', codex: 'Codex', antigravity: 'Antigravity' };
  const items = value => Array.isArray(value) ? value : [];
  const count = value => typeof value === 'number' && value >= 0;
  const num = value => count(value) ? esc(value) : '<span class="fog__text" aria-label="没读到">··</span>';
  const time = value => value && Number.isFinite(Date.parse(value)) ? `${U.date(value)} ${U.time(value)}` : '';
  const dot = tone => `<i class="b6-dot" data-kind="${tone}" aria-hidden="true"></i>`;
  const fact = (n, label) => `<div><b>${num(n)}</b><small>${label}</small></div>`;
  const cardTitle = (name, href, tone, status) => U.status({ level: { ok: 'green', owner: 'yellow', repair: 'blue', off: 'gray' }[tone] }).lamp + U.head(name, { href, lamp: false }) +
    (status ? `<span class="b6-status">${status}</span>` : '');

  function render(id, data, options) {
    const { viewer, route, href, offline } = options;
    const own = viewer === 'owner' ? '你' : '本人', field = (v, name) => U.fieldHtml(v, { name, kind: viewer });
    const link = (path, text) => typeof path === 'string' && path.startsWith('/live/')
      ? `<a href="${esc(route(path))}">${text}</a>` : text;
    const attention = path => typeof path === 'string' && /^\/live\/(?:items?\/|[?#])/.test(path);
    const d = data || {};
    if (id === 'automation') {
      const running = items(d.running), problems = items(d.problems), toOwner = !offline && attention(d.attention?.href);
      const problem = !offline && problems.length > 0;
      // 后台写明等本人的（如登录过期等本人登录）不算“AI 在修”；访客看不到去等你的事的链接，也照实写在等本人
      const repairing = problems.filter(row => row.handler !== '本人').length;
      const tone = offline ? 'off' : toOwner ? 'owner' : problem ? (repairing ? 'repair' : 'owner') : d.health?.state_code === 'lost' ? 'off' : Array.isArray(d.problems) ? 'ok' : 'off';
      const status = offline ? '电脑连不上' : toOwner ? link(d.attention.href, `要${own}做 ›`) : problem ? (repairing ? `AI 在修 ${repairing} 类` : `等${own}处理 ${problems.length} 类`) : tone === 'ok' ? '都正常' : '状态没读到';
      const today = d.today || {}, next = d.next || {};
      return { tone, head: cardTitle('自动任务', href, tone, status), body:
        `<p><span class="b6-badge">今天替${own}做成的</span></p>
        <div class="b6-metrics">${fact(today.repaired, '修好')}${fact(today.messages_logged, `新消息记下给${own}`)}${fact(today.rules_fixed, '规矩里改好')}</div>
        ${running.length ? running.map(row => `<p>${dot('ok')}这会儿在跑：${link(row.href, field(row.title, '运行名称'))}${row.model || count(row.minutes) ? `<small class="b6-run-meta">${[field(row.model), count(row.minutes) && esc(U.minutes(row.minutes))].filter(Boolean).join(' · ')}</small>` : ''}</p>`).join('')
          : `<p>${next.title ? `下次 ${esc(time(next.at) || next.wait || '')} · ${link(next.href, field(next.title, '任务名称'))}`
            : Array.isArray(d.running) && d.next === null ? '没有排定的运行' : '运行和下次时间没读到'}</p>`}
        ${problems.map(row => `<p>${dot('repair')}${link(row.href, field(row.title))} · ${[field(row.text), field(row.handler), row.round > 0 && `第 ${row.round} 轮`].filter(Boolean).join(' · ')}</p>`).join('')}
        ${items(d.disabled).map(row => `<p class="b6-muted">${dot('off')}${link(row.href, field(row.title))} · 关着</p>`).join('')}
        <p class="b6-muted b6-foot">${count(today.ai_minutes) ? `今天 AI 用了 ${esc(today.ai_minutes)} 分钟` : '今天 AI 用时还没读到'} · ${num(d.category_count)} 类里开着 ${num(d.enabled_count)} 类</p>` };
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
      return { tone, head: cardTitle('智能体', href, tone, status), body:
        `<p class="b6-chips">${rows.map(chip).join('')}</p>
        <p class="b6-muted">规则 ${field(d.rule_version) || num(null)} · 钩子近 7 天跑 ${num(d.hooks_7d?.runs)} 次，出错 ${num(d.hooks_7d?.errors)} 次</p>
        ${rows.flatMap(row => items(row.issues).map(issue => `<p class="b6-muted">${dot('repair')}${esc(row.name)} · ${[field(issue.text), field(issue.handler), issue.round > 0 && `第 ${issue.round} 轮`].filter(Boolean).join(' · ')}</p>`)).join('')}` };
    }

    const oldest = d.oldest, due = items(d.due_today), max = Math.max(1, d.opened_7d || 0, d.closed_7d || 0);
    const bar = (n, label, kind) => `<div>${label} ${num(n)} 件${count(n) ? `<span class="b6-meter" data-kind="${kind}"><i style="width:${100*n/max}%"></i></span>` : ''}</div>`;
    const checks = count(oldest?.check_count) && count(oldest?.check_limit) ? `<p class="b6-checks">${Array.from({ length: Math.min(12, oldest.check_limit) }, (_, i) => dot(i < oldest.check_count ? 'ok' : 'off')).join('')}第 ${oldest.check_count} 次看，最多 ${oldest.check_limit} 次</p>` : '';
    return { tone: d.repair && !offline ? 'repair' : count(d.open) && !offline ? 'ok' : 'off',
      head: cardTitle('AI 账本', href, d.repair && !offline ? 'repair' : count(d.open) && !offline ? 'ok' : 'off', ''),
      body: `<div class="b6-ledger-top"><strong>手上 <em>${num(d.open)}</em> 件</strong><div>${bar(d.opened_7d, '近 7 天新进', 'in')}${bar(d.closed_7d, '了结', 'out')}</div></div>
      <p><span class="b6-badge">跟得最久</span> ${oldest ? `${link(oldest.href, field(oldest.title, '事项标题'))} · ${num(oldest.days)} 天` : d.open === 0 ? '没有未了结的事' : '最早那件没读到'}</p>${checks}
      <p><span class="b6-badge">今天到日子 ${num(Array.isArray(d.due_today) ? due.length : null)} 件</span></p>
      ${[...due].sort((a,b) => Number(Boolean(b.overdue)) - Number(Boolean(a.overdue))).slice(0,3).map(row => `<p class="b6-due">${link(row.href || (row.id ? '/live/issue/?id=' + encodeURIComponent(row.id) : ''), field(row.title || row.text, '事项标题'))}<small>${row.overdue ? '过期 · ' : ''}${esc(time(row.next_at) || U.fieldText(row.wait?.text, viewer))}</small></p>`).join('')}
      ${d.repair ? `<p>${dot('repair')}${link(d.repair.href, '已交自动修理')}${d.repair.text && U.fieldText(d.repair.text, viewer).replace(/[\s。.]+$/, '') !== '已交自动修理' ? ' · ' + field(d.repair.text) : ''}</p>` : ''}` };
  }
  window.LiveBatchHome = { render };
})();

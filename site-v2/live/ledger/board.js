// 实况 · AI 账本：AI 答应了、还没了结的每一件（实时），下面是最近了结的和反复出现的，更早的翻页看；点一件看它的完整经过。
// 本人 11-23 01:19 LED1123、ISS1123 定：首屏近 7 天新进和了结、平均几天了结、跟得最久那件；每件写第几次看、最多 3 次、怎么算完；
// 一模一样的轮次并成一行。读 /computer-access/live/v1/ledger（?project= 只看一个项目），一件的经过读 ledger/<id>。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, Live = window.Live, { esc } = U;
  const { list, known, int, dec, link, when, big, stamp, day } = T;
  const params = new URLSearchParams(location.search), project = params.get('project');
  const SETTLED = { fixed: '修好', recovered: '已恢复', wont_fix: '定了不修', to_owner: '转给你' };
  const TONE = { fixed: 'ok', recovered: 'blue', wont_fix: 'soft', to_owner: 'owner' };
  const EVENT = { Add: '登记', Reopen: '又出现', Review: '看了一次', attempt: '处理了一轮', Close: '了结', Claim: '接手', ReleaseClaim: '放手，等人接', Handoff: '交接', Defer: '改期', Snooze: '改期', Check: '看了一次' };
  const ROUND = { not_fixed: '这一轮没修好', deferred: '先放一放', superseded: '并进了别的一件' };
  const DAY = 86400000;
  let state, viewer = 'public', filter = params.get('outcome') || '', showAll = false, picked = params.get('id') || null, asked = picked, pickedState = null, landed = false;
  let older = [], olderNext, olderBusy = false;
  const F = (v, name) => T.field(v, viewer, name);
  const you = () => T.you(viewer);
  const titleOf = it => it.plain_title != null && U.fieldText(it.plain_title, viewer).trim() ? it.plain_title : it.text;
  // 还欠着的只算在做、在等、暂时不修这三种（后台 summary.open 也这样算）；本人定了不修的不算欠着，放进“最近了结的”
  const owed = d => list(d.items).filter(it => it.state);
  const decided = d => list(d.items).filter(it => !it.state && it.outcome === 'wont_fix');
  const outcomeOf = row => row.resolution === 'recovered' || row.outcome === 'recovered' ? 'recovered' : row.resolution || row.outcome;
  const settledLabel = key => key === 'to_owner' ? `转给${you()}` : SETTLED[key];
  const waitText = v => { const t = U.fieldText(v, viewer).trim(); return t && !t.startsWith('等') ? `等：${F(v, '等的原因')}` : F(v, '等的原因'); };
  // check_count 是已经看过的次数；看满了 AI 停手
  const full = it => known(it.check_count) && it.check_count >= (it.check_limit || 3);
  const checkText = it => !known(it.check_count) ? '' : full(it) ? `<b class="lg-over">${int(it.check_limit || 3)} 次看满了，AI 停手</b>`
    : `下次是第 ${int(it.check_count + 1)} 次看，最多 ${int(it.check_limit || 3)} 次`;
  const span = (a, b) => a === b || !b ? when(a) : T.dayKey(a) === T.dayKey(b) ? `${when(a)}–${T.clock(b)}` : `${when(a)} – ${when(b)}`;

  // —— 首屏四块 ——
  function top(d) {
    const s = d.summary || {}, items = owed(d);
    const open = known(s.open) ? s.open : items.length;
    const days = list(s.days_7);
    const pair = days.length ? pairBars(days)
      : `<div class="lg-pairs">${[['新进', s.opened_7d ?? s.new7, '#7a63e8'], ['了结', s.closed_7d, '#00a650']].map(([l, n, c]) =>
        `<div class="tp-bar"><span>${l}</span><span class="tp-bar__track"><span class="tp-bar__fill" style="--fill:${c};width:${known(n) ? Math.min(100, n / Math.max(1, (s.opened_7d || 0), (s.closed_7d || 0)) * 100) : 0}%"></span></span><span class="tp-bar__num">${known(n) ? int(n) : '··'}</span></div>`).join('')}</div>`;
    const avg = s.average_days_to_close, trend = list(s.avg_close_days_7);
    const oldest = s.oldest || null;
    const dots = oldest && known(oldest.check_count) && known(oldest.check_limit)
      ? `<span class="lg-dots">${Array.from({ length: oldest.check_limit }, (_, i) => `<i${i < oldest.check_count ? ' class="is-on"' : ''}></i>`).join('')}</span>看过 ${int(oldest.check_count)} 次 · 最多 ${int(oldest.check_limit)} 次` : '';
    return `<div class="tp-grid lg-top">
      <section class="tp-panel lg-cell"><h2>AI 手上</h2><p class="tp-big lg-hand">${big(open, 'open')}<small>件</small></p><p class="tp-small">${known(s.oldest_days) ? `最早一件记下 ${int(s.oldest_days)} 天了` : ''}</p></section>
      <section class="tp-panel lg-cell"><h2>近 7 天 · 新进 ${known(s.opened_7d ?? s.new7) ? int(s.opened_7d ?? s.new7) : '··'} · 了结 ${known(s.closed_7d) ? int(s.closed_7d) : '··'}</h2>${pair}
        <p class="tp-legend"><span><i class="tp-swatch" style="background:#7a63e8"></i>新进</span><span><i class="tp-swatch" style="background:#00a650"></i>了结</span>${known(s.opened_7d) && known(s.closed_7d) ? `<span>${s.opened_7d > s.closed_7d ? '进的比出的多，在堆' : '出的不比进的少'}</span>` : ''}</p></section>
      <section class="tp-panel lg-cell"><h2>平均几天了结</h2><p class="tp-big">${known(avg) ? `${big(avg, 'avg', 'dec')}<small>天</small>` : '<span class="tp-fog">还没采上</span>'}</p>
        ${trend.length > 1 ? T.line({ series: [{ color: '#00a650', values: trend.map(x => x.days) }], labels: trend.map(x => day(x.date + 'T12:00:00+08:00')), width: 300, height: 110, max: T.niceMax(Math.max(...trend.map(x => x.days || 0), 1)), fmt: v => dec(v), draw: !drawn }) : '<p class="tp-small">只算近 7 天了结的，从 AI 接手算到了结。</p>'}</section>
      <section class="tp-panel lg-cell lg-oldest"><h2>跟得最久</h2>${oldest ? `<p class="lg-oldest__t">${link(oldest.href, F(titleOf(items.find(it => it.id === oldest.id) || oldest), '事项标题'))}</p>
        <p class="tp-big">${big(oldest.days ?? oldest.age_days, 'oldest')}<small>天</small></p><p class="tp-small lg-oldest__n">${dots}</p>` : `<p class="tp-empty">${open === 0 ? '没有未了结的事' : '最早那件没读到'}</p>`}</section></div>`;
  }
  function pairBars(days) {
    const max = T.niceMax(Math.max(1, ...days.flatMap(x => [x.opened || 0, x.closed || 0])));
    const W = 330, H = 140, pad = { l: 22, r: 4, t: 16, b: 22 }, w = W - pad.l - pad.r, h = H - pad.t - pad.b, n = days.length, bw = Math.min(14, w / n / 2.6);
    let out = [0, 1].map(f => `<line class="tp-gridline" x1="${pad.l}" x2="${pad.l + w}" y1="${pad.t + h - f * h}" y2="${pad.t + h - f * h}"/><text x="${pad.l - 5}" y="${pad.t + h - f * h + 4}" text-anchor="end">${int(max * f)}</text>`).join('');
    days.forEach((x, i) => {
      const cx = pad.l + (i + .5) * w / n;
      [[x.opened, '#7a63e8', -1], [x.closed, '#00a650', 1]].forEach(([v, c, side]) => {
        const bh = (v || 0) / max * h, bx = cx + (side < 0 ? -bw - 1 : 1);
        out += `<rect class="tp-grow" style="animation-delay:${i * 50}ms" x="${bx}" y="${pad.t + h - bh}" width="${bw}" height="${bh}" fill="${c}" rx="1.5"/>`;
        if (known(v)) out += `<text class="tp-val" x="${bx + bw / 2}" y="${pad.t + h - bh - 3}" text-anchor="middle">${int(v)}</text>`;
      });
      out += `<text x="${cx}" y="${H - 5}" text-anchor="middle">${esc(i === n - 1 ? '今天' : day(x.date + 'T12:00:00+08:00'))}</text>`;
    });
    return `<svg class="tp-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="近 7 天每天新进和了结">${out}</svg>`;
  }

  // —— 还欠着的每一件：时间轨道 ——
  function nextOf(it) { return it.next_at || it.wait?.at || null; }
  function track(d) {
    const items = [...owed(d)].sort((a, b) => Number(Boolean(b.overdue)) - Number(Boolean(a.overdue)) || (stamp(nextOf(a)) ?? 9e15) - (stamp(nextOf(b)) ?? 9e15));
    const now = Date.now(), today = Math.floor((now + 8 * 3600000) / DAY) * DAY - 8 * 3600000;
    const first = Math.min(...items.map(it => stamp(it.accepted)).filter(Boolean), today - 7 * DAY);
    const from = Math.max(first - DAY, today - 21 * DAY), to = today + 5 * DAY;
    const span = to - from, x = t => Math.max(0, Math.min(100, (t - from) / span * 100));
    const ticks = []; for (let t = from + DAY - (from + 8 * 3600000) % DAY; t <= to; t += DAY) ticks.push(t);
    const step = Math.ceil(ticks.length / 14);
    const axis = `<div class="lg-axis">${ticks.map((t, i) => i % step ? '' : `<span style="left:${x(t)}%">${esc(day(new Date(t).toISOString()))}</span>`).join('')}</div>`;
    const shown = showAll ? items : items.slice(0, 10);
    const rows = shown.map(it => {
      const acc = stamp(it.accepted), nx = stamp(nextOf(it)), over = it.overdue || (nx && nx < now);
      const checks = list(it.checks).map(c => stamp(c.at)).filter(Boolean);
      const running = it.running?.href;
      const tag = running ? link(it.running.href, '正在办 ›', 'tp-tag lg-running') : it.state === 'working' ? '<span class="tp-tag lg-running">正在办</span>' : it.state === 'deferred' ? '<span class="tp-tag" data-tone="soft">暂时不修</span>'
        : it.outcome === 'not_fixed' ? '<span class="tp-tag" data-tone="bad">没修好</span>' : it.outcome === 'wont_fix' ? `<span class="tp-tag" data-tone="soft">${you()}定了不修</span>` : '';
      const meta = [it.registered_by && `${esc(it.registered_by)} 记的`, (it.wait?.text || it.when) && waitText(it.wait?.text || it.when),
        nx && !full(it) ? `${over ? '<b class="lg-over">该看了</b> ' : ''}下次看 ${esc(when(nextOf(it)))}` : '', checkText(it),
        it.done_when && `算完：${F(it.done_when, '怎么算完')}`].filter(Boolean).join(' · ');
      const bar = acc ? `<i class="lg-bar" style="left:${x(acc)}%;width:${Math.max(.6, x(now) - x(acc))}%"></i><i class="lg-start${acc < from ? ' is-cut' : ''}" style="left:${x(acc)}%"></i>` : '';
      const dots = checks.map(t => `<i class="lg-check" style="left:${x(t)}%" title="${esc(when(new Date(t).toISOString()))} 看过"></i>`).join('');
      const next = nx && !full(it) ? `${nx > now ? `<i class="lg-link" style="left:${x(now)}%;width:${Math.max(0, x(nx) - x(now))}%"></i>` : ''}<i class="lg-next${over ? ' is-over' : ''}${nx > to ? ' is-far' : ''}" style="left:${x(nx)}%" title="下次看 ${esc(when(nextOf(it)))}"></i>${nx > to ? `<span class="lg-farlabel">${esc(day(nextOf(it)))} ›</span>` : ''}` : '';
      return `<li class="lg-item${picked === it.id ? ' is-picked' : ''}" data-pick="${esc(it.id)}"><div class="lg-item__text"><button type="button" class="lg-title" data-pick="${esc(it.id)}">${F(titleOf(it), '事项标题')}</button>${tag}<p>${meta}</p></div>
        <div class="lg-lane">${bar}${dots}${next}</div></li>`;
    }).join('');
    const more = items.length > 10 ? `<button type="button" class="lg-more" data-more aria-expanded="${showAll}"><span class="tp-chev">${showAll ? '收起' : `再看 ${items.length - 10} 件`}</span></button>` : '';
    return `<section class="tp-panel lg-owed" id="owed"><div class="tp-panel__head"><h2>还欠着的 ${int(items.length)} 件<span class="lg-live">实时</span><small>按下次看的日子排，该看没看的在最前${known(d.summary?.open) && d.summary.open !== items.length ? `；后台合计 ${int(d.summary.open)} 件，这里读到 ${int(items.length)} 件` : ''}${decided(d).length ? `；${you()}定了不修的 ${int(decided(d).length)} 件不算欠着，在下面“定了不修”里` : ''}</small></h2><span class="tp-asof">截至 ${esc(when(d.at))}</span></div>
      ${items.length ? `<div class="lg-board"><div class="lg-head"><span></span>${axis}</div><ul class="lg-list">${rows}</ul><div class="lg-now" style="--x:${x(now)}" data-from="${from}" data-span="${span}"><span>现在</span></div></div>${more}
      <p class="tp-legend lg-key"><span><i class="lg-key__bar"></i>记下到现在</span><span><i class="lg-key__check"></i>看过</span><span><i class="lg-key__next"></i>下次看</span><span><i class="lg-key__over"></i>到了日子还没看</span></p>`
        : `<p class="tp-empty">AI 手上没有欠着的事。</p>`}</section>`;
  }
  // “现在”竖线跟着时间往右走
  setInterval(() => {
    const line = document.querySelector('.lg-now');
    if (line) line.style.setProperty('--x', Math.min(100, (Date.now() - Number(line.dataset.from)) / Number(line.dataset.span) * 100));
  }, 30000);

  // —— 最近了结的 ——
  function settledRows(d) {
    const open = new Set(owed(d).map(it => it.issue || it.id)), seen = new Set(), rows = [];
    const kept = decided(d).map(it => ({ ...it, at: it.at || it.outcome_at || it.accepted }));
    for (const row of [...list(d.history), ...older, ...kept]) {
      const key = row.issue || row.id, out = outcomeOf(row);
      if (!SETTLED[out] || open.has(key) || seen.has(key)) continue;
      seen.add(key); rows.push({ ...row, settled: out });
    }
    return rows.sort((a, b) => (stamp(b.at) || 0) - (stamp(a.at) || 0));
  }
  // 标题一样、结果一样的几件并成一行（标题藏起来的不并）
  function groupRows(rows) {
    const groups = [], byKey = new Map();
    for (const r of rows) {
      const t = titleOf(r), key = typeof t === 'string' ? `${r.settled}|${t.trim()}` : null, g = key && byKey.get(key);
      if (g) g.rows.push(r); else { const n = { rows: [r] }; groups.push(n); if (key) byKey.set(key, n); }
    }
    return groups;
  }
  function settled(d) {
    const rows = settledRows(d), shown = rows.filter(r => !filter || r.settled === filter);
    const counts = Object.fromEntries(Object.keys(SETTLED).map(k => [k, rows.filter(r => r.settled === k).length]));
    const next = older.length ? olderNext : d.next;
    return `<section class="tp-panel lg-done" id="history"><div class="tp-panel__head"><h2>最近了结的</h2></div>
      <div class="tp-seg" role="group" aria-label="按结果看"><button type="button" data-filter="" aria-pressed="${!filter}">全部 ${int(rows.length)}</button>${Object.keys(SETTLED).map(k =>
        `<button type="button" data-filter="${k}" aria-pressed="${filter === k}">${settledLabel(k)} ${int(counts[k])}</button>`).join('')}</div>
      <ul class="lg-settled">${groupRows(shown).slice(0, 40).map(({ rows: [r, ...rest] }) => `<li class="${[r, ...rest].some(x => x.id === picked) ? 'is-picked' : ''}"><span class="tp-tag" data-tone="${TONE[r.settled]}">${settledLabel(r.settled)}</span>
        <span><button type="button" class="lg-title" data-pick="${esc(r.id)}">${F(titleOf(r), '事项标题')}</button>${rest.length ? `<span class="lg-x">同样的 ${int(rest.length + 1)} 件</span>` : ''}</span>${r.settled === 'to_owner' && r.owner_href ? link(r.owner_href, `已放进等${you()}的事 ›`) : ''}<time>${esc(rest.length ? span(rest.at(-1).at, r.at) : when(r.at))}</time></li>`).join('')
        || `<li class="tp-empty">${filter ? '已读到的记录里没有这一类。' : '已读到的记录里还没有了结的。'}</li>`}</ul>
      <div class="lg-done__foot">${next ? `<button type="button" class="lg-more" data-older${olderBusy ? ' disabled' : ''}>${olderBusy ? '正在读…' : '看更早的 ›'}</button>` : ''}<span class="tp-small">已读到 ${int(rows.length)} 件${next ? '，还有更早的' : ''}</span></div></section>`;
  }

  // —— 点开一件 ——
  function merge(events) {
    const groups = [];
    for (const e of events) {
      const text = U.fieldText(e.reason || e.outcome_text || e.repair_summary || '', viewer).trim();
      const key = `${e.event || ''}|${e.outcome || ''}|${text}`, last = groups.at(-1);
      if (last && last.key === key) { last.rows.push(e); continue; }
      groups.push({ key, text, rows: [e] });
    }
    return groups;
  }
  // 一件只剩摘要、没有逐轮经过时，写一句为什么
  function gapText() {
    const got = pickedState?.data;
    if (got === undefined) return '逐轮经过这次没读到，先列摘要；下一轮读数时会自动再读。';
    const why = U.fieldText(got?.gap || got?.coverage?.gap || '', viewer).trim();
    return why ? `没有逐轮经过：${esc(why)}` : '账本只留了这一件的摘要，逐轮经过没有记下来。';
  }
  function detail(d) {
    const repeat = list(d.repeat_fixes?.items).map(r => ({ ...r, repeat: true }));
    const fromList = [...owed(d), ...settledRows(d), ...list(d.items), ...repeat].find(r => r.id === picked) || (picked ? null : owed(d).find(r => r.id === d.summary?.oldest?.id) || owed(d)[0]);
    const it = { ...fromList, ...pickedState?.data?.item };
    if (!it.id) return `<section class="tp-panel lg-detail" id="detail"><div class="tp-panel__head"><h2>点开一件</h2></div><p class="tp-empty">${!picked ? '点左边或上面任一件，这里看它的经过。'
      : pickedState?.data === null ? '正在读这一件…' : '地址里的这一件不在近来的账上，可能已经并进别的一件；点上面任一件看它的经过。'}</p></section>`;
    const events = list(pickedState?.data?.history).length ? list(pickedState.data.history) : list(d.history).filter(r => (r.issue || r.id) === (it.issue || it.id));
    const sorted = [...events].sort((a, b) => (stamp(a.at) || 0) - (stamp(b.at) || 0));
    const groups = merge(sorted);
    const lines = groups.map(g => {
      const a = g.rows[0], z = g.rows.at(-1), n = g.rows.length, out = outcomeOf(a), label = SETTLED[out] ? settledLabel(out) : ROUND[out] || ROUND[a.to] || EVENT[a.event] || '记了一笔';
      const gaps = g.rows.slice(1).map((r, i) => stamp(r.at) - stamp(g.rows[i].at));
      const even = n > 2 && gaps.every(x => Math.abs(x - gaps[0]) < 60000) ? gaps[0] : null;
      const every = even ? (even % 3600000 === 0 ? (even === 3600000 ? '每小时' : `每 ${even / 3600000} 小时`) : `每 ${Math.round(even / 60000)} 分钟`) : '';
      const head = esc(n > 1 ? span(a.at, z.at) : when(a.at));
      const body = n > 1 ? `${every ? every + '一次，' : ''}${a.event === 'attempt' && !SETTLED[out] && !ROUND[out] ? `处理了 ${n} 轮` : `${label}，共 ${n} 次`}${g.text ? `，都是：${esc(g.text)}` : ''}` : `${label}${g.text ? `：${esc(g.text)}` : ''}`;
      return `<li><b>${head}</b>${body}</li>`;
    }).join('');
    const next = nextOf(it);
    const related = [it.task_name && `自动任务「${F(it.task_name)}」`, it.conversation_title && `对话「${F(it.conversation_title)}」`, it.project_name && `项目「${F(it.project_name)}」`].filter(Boolean).join(' · ');
    const chips = [it.state === 'working' && '正在办', it.repeat && known(it.reopen_count) && `又出现过 ${int(it.reopen_count)} 次`, known(it.check_count) && `看过 ${int(it.check_count)} 次`, !it.settled && known(it.check_count) && `最多 ${int(it.check_limit || 3)} 次`, it.done_when && `算完：${F(it.done_when, '怎么算完')}`].filter(Boolean);
    return `<section class="tp-panel lg-detail" id="detail"><div class="tp-panel__head"><h2>点开一件</h2>${link('/live/issue/?id=' + encodeURIComponent(it.id), '完整经过 ›')}</div>
      <p class="lg-detail__t">${F(titleOf(it), '事项标题')}</p><p class="lg-chips">${chips.map(c => `<span class="tp-pill">${c}</span>`).join('')}</p>
      ${it.progress_summary || it.outcome_text ? `<p class="tp-small">${F(it.progress_summary || it.outcome_text, '进展')}</p>` : ''}
      <ol class="lg-steps">${lines || (it.accepted || it.first_at ? `<li><b>${esc(when(it.accepted || it.first_at))}</b>${it.repeat ? '第一次出现' : 'AI 接手'}</li>${it.repeat && it.last_at ? `<li><b>${esc(when(it.last_at))}</b>最近一次又出现</li>` : ''}` : '')}${!lines && it.settled ? `<li><b>${it.at && stamp(it.at) !== stamp(it.accepted) ? esc(when(it.at)) : '哪天定的没记下'}</b>${settledLabel(it.settled)}</li>` : ''}${it.settled ? '' : full(it) ? `<li class="is-next"><b>现在</b>${int(it.check_limit || 3)} 次看满了，AI 停手${it.when ? `，${waitText(it.when)}` : ''}</li>`
        : next ? `<li class="is-next"><b>${esc(when(next))}</b>下次看${known(it.check_count) ? `，第 ${int(it.check_count + 1)} 次` : ''}</li>` : ''}</ol>
      ${pickedState?.data === null ? '<p class="tp-small">经过正在读…</p>' : lines ? '' : `<p class="tp-small lg-gap">${gapText()}</p>`}${related ? `<p class="tp-small lg-rel">关联：${related}</p>` : ''}</section>`;
  }

  // —— 反复出现 ——
  function repeats(d) {
    const r = d.repeat_fixes || {}, rows = list(r.items);
    if (!rows.length) return '';
    const now = Date.now(), from = now - 30 * DAY, x = t => (t - from) / (30 * DAY) * 100;
    return `<section class="tp-panel lg-repeat" id="repeat"><div class="tp-panel__head"><h2>反复出现<small>修好了又出现的同一件，近 30 天</small></h2></div>
      <ul class="lg-replist">${rows.map(it => {
        const times = (list(it.reopen_at).length ? list(it.reopen_at) : [it.first_at, it.last_at]).map(stamp).filter(t => t && t >= from);
        return `<li><button type="button" class="lg-title" data-pick="${esc(it.id)}">${F(titleOf(it), '反复出现的问题')}</button><span class="lg-rep__n">又发生 ${int(it.reopen_count)} 次</span>
          <div class="lg-rep__axis">${[0, 5, 10, 15, 20, 25, 30].map(n => `<span style="left:${n / 30 * 100}%"${n === 0 ? ' data-edge="start"' : n === 30 ? ' data-edge="end"' : ''}>${esc(day(new Date(from + n * DAY).toISOString()))}</span>`).join('')}${times.map(t => `<i style="left:${x(t)}%" title="${esc(when(new Date(t).toISOString()))}"></i>`).join('')}</div></li>`;
      }).join('')}</ul>${list(rows[0]?.reopen_at).length ? '' : '<p class="tp-small">每次又出现的日子还没采上，先画第一次和最近一次。</p>'}</section>`;
  }

  // —— 快讯 ——
  function feed(d) {
    if (Array.isArray(d.feed)) return d.feed.map(r => ({ at: r.at, actor: U.fieldText(r.actor, viewer), text: U.fieldText(r.text, viewer), href: r.href, tone: r.tone }));
    const rows = [], short = v => { const t = U.fieldText(v, viewer); return t.length > 34 ? t.slice(0, 33) + '…' : t; };
    for (const e of list(d.history)) {
      const out = outcomeOf(e);
      if (e.event === 'Add') rows.push({ at: e.at, actor: '新进', text: short(titleOf(e)), tone: 'info' });
      else if (SETTLED[out]) rows.push({ at: e.at, actor: '了结', html: `<em>${settledLabel(out)}</em> ${esc(short(titleOf(e)))}`, tone: out === 'to_owner' ? 'owner' : 'ok' });
      else if (e.event === 'Reopen') rows.push({ at: e.at, actor: '又出现', text: short(titleOf(e)), tone: 'bad' });
    }
    for (const it of owed(d)) if (it.overdue) rows.push({ actor: '该看了', html: `<em>${esc(short(titleOf(it)))}</em> · 下次看是 ${esc(when(nextOf(it)))}`, tone: 'repair' });
    return rows.filter(r => !r.at || Date.now() - stamp(r.at) < 3 * DAY).sort((a, b) => (stamp(b.at) || 9e15) - (stamp(a.at) || 9e15)).slice(0, 30);
  }

  let drawn = false;
  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    if (!d) { T.paint(page.root, T.placeholder(state, 'AI 账本')); page.tick.set([], { off: true }); return; }
    T.paint(page.root, `<div class="tp-head"><div><h1>AI 账本</h1><p>上面是 AI 还欠着的每一件，实时；下面是最近了结的和反复出现的，更早的翻页看。点一件看它的完整经过。</p></div>
        <p class="tp-head__side">${project ? `<span>只看项目 ${esc(project)} · ${link('/live/ledger/', '看全部 ›')}</span>` : ''}<span>截至 ${esc(when(d.at))}</span></p></div>
      ${T.stateNote(state)}${top(d)}${track(d)}<div class="tp-grid lg-split">${settled(d)}${detail(d)}</div>${repeats(d)}`);
    drawn = true;
    page.tick.set(feed(d), { off: state.offline });
    if (!landed && (location.hash || asked)) landed = T.reveal(location.hash.slice(1) || 'detail');
  }
  async function pick(id, quiet = false) {
    picked = id; pickedState = { data: null };
    draw();
    if (!quiet) {
      params.set('id', id); history.replaceState(null, '', `${location.pathname}?${params}${location.hash}`);
      document.getElementById('detail')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    const s = await Live.get(`ledger/${encodeURIComponent(id)}`, null).catch(() => null);
    if (picked !== id) return;
    pickedState = s?.data ? s : { data: undefined };
    draw();
  }
  async function readOlder() {
    const d = state?.data, cursor = older.length ? olderNext : d?.next;
    if (!cursor || olderBusy) return;
    olderBusy = true; draw();
    const s = await Live.get('ledger', { project, cursor }).catch(() => null);
    olderBusy = false;
    // 新一轮读数来了也不清已翻到的更早记录；同一件按最新一条只算一次
    if (Array.isArray(s?.data?.history)) { older = older.concat(s.data.history); olderNext = s.data.next; }
    T.keep(page.root, '[data-older], .lg-done__foot', draw);
  }

  let page;
  page = T.boot({ resource: 'ledger', query: project ? { project } : {}, back: '/live/#ledger',
    ask: () => 'AI 账本里还欠着哪些事、哪件该看了、最近了结了什么？先用大白话说，别动手。',
    onState(next) {
      state = next; draw();
      if (!pickedState && next.data) { const id = picked || next.data.summary?.oldest?.id || owed(next.data)[0]?.id; if (id) pick(id, true); }
      else if (picked && pickedState && pickedState.data === undefined && next.data) pick(picked, true);
    } });
  page.root.addEventListener('click', e => {
    const p = e.target.closest('button[data-pick]'), f = e.target.closest('[data-filter]');
    if (p) { pick(p.dataset.pick); return; }
    if (f) { filter = f.dataset.filter; T.keep(page.root, `[data-filter="${filter}"]`, draw); return; }
    if (e.target.closest('[data-more]')) { showAll = !showAll; T.keep(page.root, '[data-more]', draw); return; }
    if (e.target.closest('[data-older]')) readOlder();
  });
})();

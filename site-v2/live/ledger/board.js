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
  let state, viewer = 'public', filter = params.get('outcome') || '', kind = ['promised', 'repair'].includes(params.get('kind')) ? params.get('kind') : '', showAll = { owed: false, parked: false }, picked = params.get('id') || null, asked = picked, autoPick = !picked, pickedState = null, landed = false;
  let older = [], olderNext, olderBusy = false;
  // 首页 AI 账本卡点进来的那几件：?view=open|opened|closed|due|overdue|opened_7d|closed_7d（数据约定-前端升级 §11）。读 ledger?view=…，
  // 后台返回 {view, started_at, items, total, next}，件数和卡上那个数是同一份；续页把 next 当 cursor，保留 view
  const VIEW = { open: 'AI 在跟的', opened: '新账起进的', closed: '新账起了结的', due: '今天到日子的', overdue: '过期没看的', opened_7d: '近 7 天进的', closed_7d: '近 7 天了结的' };
  const view = Object.hasOwn(VIEW, params.get('view') || '') ? params.get('view') : '';
  let viewMore = [], viewNext, viewBusy = false;
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
    // 后台按天给（三位小数）；不到一天写小时，不到一小时写分钟
    const peak = Math.max(avg || 0, ...trend.map(x => x.days || 0));
    const unit = peak >= 1 ? { per: 1, name: '天' } : peak * 24 >= 1 ? { per: 24, name: '小时' } : { per: 1440, name: '分钟' };
    // 跟得最久：后台只挑 AI 正在跟的事；一件都没有时 oldest 是 null，空着时先照写后台给的 oldest_text，没给再用原来那句。
    // 手上还有事（open 大于 0）时 oldest_text“现在没有 AI 正在跟的事”和“AI 手上 N 件”打架，不照写，写“最早那件没读到”（M675）
    const oldest = s.oldest || null;
    const dots = oldest && known(oldest.check_count) && known(oldest.check_limit)
      ? `<span class="lg-dots">${Array.from({ length: oldest.check_limit }, (_, i) => `<i${i < oldest.check_count ? ' class="is-on"' : ''}></i>`).join('')}</span>看过 ${int(oldest.check_count)} 次 · 最多 ${int(oldest.check_limit)} 次` : '';
    return `<div class="tp-grid lg-top">
      <section class="tp-panel lg-cell"><h2>AI 手上</h2><p class="tp-big lg-hand">${big(open, 'open')}<small>件</small></p><p class="tp-small">${known(s.oldest_days) ? `最早一件记下 ${int(s.oldest_days)} 天了` : ''}</p></section>
      <section class="tp-panel lg-cell"><h2>近 7 天 · 新进 ${known(s.opened_7d ?? s.new7) ? int(s.opened_7d ?? s.new7) : '··'} · 了结 ${known(s.closed_7d) ? int(s.closed_7d) : '··'}</h2>${pair}
        <p class="tp-legend"><span><i class="tp-swatch" style="background:#7a63e8"></i>新进</span><span><i class="tp-swatch" style="background:#00a650"></i>了结</span>${known(s.opened_7d) && known(s.closed_7d) ? `<span>${s.opened_7d > s.closed_7d ? '进的比出的多，在堆' : '出的不比进的少'}</span>` : ''}</p></section>
      <section class="tp-panel lg-cell"><h2>平均多久了结</h2><p class="tp-big">${known(avg) ? `${big(avg * unit.per, 'avg', unit.per === 1440 ? 'int' : 'dec')}<small>${unit.name}</small>` : '<span class="tp-fog">还没采上</span>'}</p>
        ${trend.filter(x => known(x.days)).length > 1 ? T.line({ series: [{ color: '#00a650', values: trend.map(x => known(x.days) ? x.days * unit.per : null) }], labels: trend.map(x => day(x.date + 'T12:00:00+08:00')), width: 300, height: 110, max: T.niceMax(Math.max(...trend.map(x => (x.days || 0) * unit.per), 1)), fmt: v => dec(v), draw: !drawn }) + `<p class="tp-small">每天往前 7 天的平均，单位${unit.name}；没有了结的日子空着。</p>` : '<p class="tp-small">只算近 7 天了结的，从 AI 接手算到了结。</p>'}</section>
      <section class="tp-panel lg-cell lg-oldest"><h2>跟得最久</h2>${oldest ? `<p class="lg-oldest__t">${link(oldest.href, F(titleOf(items.find(it => it.id === oldest.id) || oldest), '事项标题'))}</p>
        <p class="tp-big">${big(oldest.days ?? oldest.age_days, 'oldest')}<small>天</small></p><p class="tp-small lg-oldest__n">${dots}</p>` : `<p class="tp-empty">${s.oldest_text != null && U.fieldText(s.oldest_text, viewer).trim() && !(open > 0) ? F(s.oldest_text, '跟得最久') : open === 0 ? '没有未了结的事' : '最早那件没读到'}</p>`}</section></div>`;
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

  // —— 筛选按钮：全部｜约好再查的｜修理暂缓的。点了下面“欠着”“放着”两块只列这一种，只在页面里筛、不调后台；网址 ?kind=promised|repair 进来先选好 ——
  // 自动修理记下、暂时放着的是“修理暂缓的”，其余是 AI 答应了再查的（和自动任务页“AI 约好的事 N 件在等”同一种分法）
  const KINDS = [['', '全部'], ['promised', '约好再查的'], ['repair', '修理暂缓的']];
  const kindOf = it => [it.registered_by, it.registered_by_text].some(v => U.fieldText(v ?? '', viewer).trim() === '自动修理') ? 'repair' : 'promised';
  function kinds(d) {
    const all = owed(d), n = k => k ? all.filter(it => kindOf(it) === k).length : all.length;
    return `<nav class="lg-kinds" id="kinds" aria-label="只看一种">${KINDS.map(([k, label]) =>
      `<button type="button" class="lg-kind" data-kind="${k}" aria-pressed="${kind === k}">${label} <b>${int(n(k))}</b></button>`).join('')}</nav>`;
  }

  // —— 还欠着的每一件：时间轨道。分“欠着”（在修的、到点还没了结的）和“放着”（等约好的时间或条件的、暂时不修的），按后台给的 group 分 ——
  // “放着”小字里“自动修理同一件修两轮还没好，也先放到这里”照后台 automation/core.py 的 REPAIR_LIMIT=2 写死，改了那边要跟着改
  function nextOf(it) { return it.next_at || it.wait?.at || null; }
  const groupOf = it => it.group === 'owed' || it.group === 'parked' ? it.group : it.running || it.state === 'working' || it.overdue ? 'owed' : 'parked';
  // 谁记的：后台给了记下这件事的那场对话或那一轮的地址（registered_by_href）就做成链接；没有地址照原样写字，打不开的原因放在悬停说明里。
  // 没记下是谁登记的（registered_by 空，后台 registered_by_text 写“登记人未记下”）照现在的样子不写这一段
  const RECORDER_HIDDEN = '访客能看到是谁记的，但那场对话的内容看不到。';
  function recorder(it) {
    const name = it.registered_by_text ?? it.registered_by;
    if (!U.fieldText(name ?? '', viewer).trim() || !U.fieldText(it.registered_by ?? '', viewer).trim() && !T.path(it.registered_by_href)) return '';
    const label = `${typeof name === 'string' ? esc(name) : F(name, '谁记的')} 记的`;
    // 本人能点开原来源、访客点进那场对话看不到内容的（registered_by_visitor_labels.conversation = hidden），本人版紧挨着链接挂全站同一个“访客看不到”；
    // “谁记的”访客照样看得到（访客版同一行也写“Codex 记的”），签只说那场对话的内容看不到，点开的说明照这个意思写，免得读成谁记的被藏了（主控 11-26 10:27）
    const mark = U.visitorFieldKind({ visitor_labels: it.registered_by_visitor_labels }, 'conversation');
    // 签上的字写“对话访客看不到”（全站“访客看不到”那个样子），一眼看出藏的是对话、不是谁记的（主控 11-26 11:02）
    const tag = mark === 'hidden' ? U.visitorHiddenTag('记下这件事的那场对话', '', viewer).replace(/data-trust-explanation="[^"]*"/, `data-trust-explanation="${esc(RECORDER_HIDDEN)}"`)
      .replace('title="访客看不到 ·', 'title="对话访客看不到 ·').replace('<span class="live-mark__label">访客看不到</span>', '<span class="live-mark__label">对话访客看不到</span>')
      : U.visitorLabel({ visitor_labels: it.registered_by_visitor_labels }, 'conversation', '记下这件事的那场对话', viewer);
    if (T.path(it.registered_by_href)) return link(it.registered_by_href, `${label} ›`) + tag;
    const why = U.fieldText(it.registered_by_unavailable_reason ?? '', viewer).trim();
    return (why ? `<span title="${esc(why)}">${label}</span>` : label) + tag;
  }
  // 第二行：谁记的 · 为什么放着／在等什么（后台原句）· 下次几点看（到点没看的写后台那句“约好几点再看，到点还没了结”）· 第几次、最多几次
  function itemMeta(it, group, now) {
    const nx = stamp(nextOf(it)), over = it.overdue || (nx && nx < now), limit = int(it.check_limit || 3);
    const nth = known(it.check_count) ? `第 ${int(it.check_count + 1)} 次，最多 ${limit} 次` : '';
    const late = group === 'owed' && it.overdue && it.fixer?.text, wait = it.wait?.text || it.when;
    const why = group === 'parked' && it.park?.text ? `为什么放着：${F(it.park.text, '为什么放着')}`
      : wait ? waitText(wait) : group === 'owed' && !late && it.fixer?.text ? F(it.fixer.text, '在等什么') : '';
    const time = full(it) ? `<b class="lg-over">${limit} 次看满了，AI 停手</b>` : late ? F(it.fixer.text, '到点还没了结')
      : nx ? (over ? `<b class="lg-over">该看了</b> 原定 ${esc(when(nextOf(it)))}` : `下次 ${esc(when(nextOf(it)))} 看`) : '';
    const count = full(it) ? '' : nx || late ? nth : known(it.check_count) ? `看过 ${int(it.check_count)} 次，最多 ${limit} 次` : '';
    // 这一行放不下时只在“ · ”处折，段内不拆（“最多 3 次”“下次 12:35 看”“12-02 10:00”整段走）：谁记的、几点看、第几次这几段短的不断行，
    // 后台原句（为什么放着、在等什么、到点还没了结）太长照常折。“·”打在每段前头、和这段字连着（&#8288; 不让它们分开），
    // 折到下一行开头的那个“·”被裁掉（board.css 的 .lg-line），行尾不悬一个“·”、行首也不冒一个（主控 11-26 10:27）。
    // 段与段之间用零宽空格（能在这里折、不占宽），“·”左右只靠点那一格居中留白，两边一样宽（主控 11-26 11:02：原来左边多一个空格）
    const segs = [[recorder(it), true], [why, false], [time, !late], [count, true]].map(([s, keep]) => [s.replace(/。$/, ''), keep]).filter(([s]) => s);
    return `<span class="lg-line">${segs.map(([s, keep]) => `<span class="lg-seg${keep ? ' is-keep' : ''}"><i class="lg-dot" aria-hidden="true">·</i>&#8288;${s}</span>`).join('&#8203;')}</span>`;
  }
  function track(d) {
    const all = owed(d), shown = kind ? all.filter(it => kindOf(it) === kind) : all;
    const sort = rows => rows.sort((a, b) => Number(Boolean(b.overdue)) - Number(Boolean(a.overdue)) || (stamp(nextOf(a)) ?? 9e15) - (stamp(nextOf(b)) ?? 9e15));
    const blocks = { owed: sort(shown.filter(it => groupOf(it) === 'owed')), parked: sort(shown.filter(it => groupOf(it) === 'parked')) };
    const now = Date.now(), today = Math.floor((now + 8 * 3600000) / DAY) * DAY - 8 * 3600000;
    const first = Math.min(...all.map(it => stamp(it.accepted)).filter(Boolean), today - 7 * DAY);
    const from = Math.max(first - DAY, today - 21 * DAY), to = today + 5 * DAY;
    const span = to - from, x = t => Math.max(0, Math.min(100, (t - from) / span * 100));
    const ticks = []; for (let t = from + DAY - (from + 8 * 3600000) % DAY; t <= to; t += DAY) ticks.push(t);
    const step = Math.ceil(ticks.length / 14);
    const axis = `<div class="lg-axis">${ticks.map((t, i) => i % step ? '' : `<span style="left:${x(t)}%">${esc(day(new Date(t).toISOString()))}</span>`).join('')}</div>`;
    const row = (it, group) => {
      const acc = stamp(it.accepted), nx = stamp(nextOf(it)), over = it.overdue || (nx && nx < now);
      const checks = list(it.checks).filter(c => stamp(c.at));
      const running = it.running?.href;
      const tag = running ? link(it.running.href, '正在办 ›', 'tp-tag lg-running') : it.state === 'working' ? '<span class="tp-tag lg-running">正在办</span>' : it.state === 'deferred' ? '<span class="tp-tag" data-tone="soft">暂时不修</span>'
        : it.outcome === 'not_fixed' ? '<span class="tp-tag" data-tone="bad">没修好</span>' : it.outcome === 'wont_fix' ? `<span class="tp-tag" data-tone="soft">${you()}定了不修</span>` : '';
      const bar = acc ? `<i class="lg-bar" style="left:${x(acc)}%;width:${Math.max(.6, x(now) - x(acc))}%"></i><i class="lg-start${acc < from ? ' is-cut' : ''}" style="left:${x(acc)}%"></i>` : '';
      const dots = checks.map(c => `<i class="lg-check" style="left:${x(stamp(c.at))}%" title="${esc(when(c.at))} 看过${c.text ? '：' + esc(U.fieldText(c.text, viewer)) : ''}"></i>`).join('');
      const next = nx && !full(it) ? `${nx > now ? `<i class="lg-link" style="left:${x(now)}%;width:${Math.max(0, x(nx) - x(now))}%"></i>` : ''}<i class="lg-next${over ? ' is-over' : ''}${nx > to ? ' is-far' : ''}" style="left:${x(nx)}%" title="下次看 ${esc(when(nextOf(it)))}"></i>${nx > to ? `<span class="lg-farlabel">${esc(day(nextOf(it)))} ›</span>` : ''}` : '';
      return `<li class="lg-item${picked === it.id ? ' is-picked' : ''}" data-pick="${esc(it.id)}"><div class="lg-item__text"><button type="button" class="lg-title" data-pick="${esc(it.id)}">${F(titleOf(it), '事项标题')}</button>${tag}<p>${itemMeta(it, group, now)}</p></div>
        <div class="lg-lane">${bar}${dots}${next}</div></li>`;
    };
    const legend = '<p class="tp-legend lg-key"><span><i class="lg-key__bar"></i>记下到现在</span><span><i class="lg-key__check"></i>看过</span><span><i class="lg-key__next"></i>下次看</span><span><i class="lg-key__over"></i>到了日子还没看</span></p>';
    const keyIn = blocks.parked.length ? 'parked' : 'owed';
    const board = (group, empty) => {
      const items = blocks[group], shown = showAll[group] ? items : items.slice(0, 10);
      const more = items.length > 10 ? `<button type="button" class="lg-more" data-more="${group}" aria-expanded="${showAll[group]}"><span class="tp-chev">${showAll[group] ? '收起' : `再看 ${items.length - 10} 件`}</span></button>` : '';
      return items.length ? `<div class="lg-board"><div class="lg-head"><span></span>${axis}</div><ul class="lg-list">${shown.map(it => row(it, group)).join('')}</ul><div class="lg-now" style="--x:${x(now)}" data-from="${from}" data-span="${span}"><span>现在</span></div></div>${more}${keyIn === group ? legend : ''}`
        : `<p class="tp-empty">${kind ? `“${KINDS.find(([k]) => k === kind)[1]}”里` : 'AI 手上'}${empty}</p>`;
    };
    return `<section class="tp-panel lg-owed" id="owed"><div class="tp-panel__head"><h2>欠着 · AI 在修的 ${int(blocks.owed.length)} 件<span class="lg-live">实时</span><small>按下次看的日子排，到点还没看的在最前${known(d.summary?.open) && d.summary.open !== all.length ? `；后台合计 ${int(d.summary.open)} 件，这里读到 ${int(all.length)} 件` : ''}${decided(d).length ? `；${you()}定了不修的 ${int(decided(d).length)} 件不算欠着，在下面“定了不修”里` : ''}</small></h2><span class="tp-asof">截至 ${esc(when(d.at))}</span></div>
      ${board('owed', '没有在修的事。')}</section>
      <section class="tp-panel lg-owed" id="parked"><div class="tp-panel__head"><h2>放着 · ${int(blocks.parked.length)} 件<small>先不动手的，每件写清为什么放着、等什么；自动修理同一件修两轮还没好，也先放到这里；到那天还没了结就挪进欠着；看满 3 次就了结。</small></h2></div>
      ${board('parked', '没有放着的事。')}</section>`;
  }
  // “现在”竖线跟着时间往右走
  setInterval(() => {
    for (const line of document.querySelectorAll('.lg-now')) line.style.setProperty('--x', Math.min(100, (Date.now() - Number(line.dataset.from)) / Number(line.dataset.span) * 100));
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
  // 后台给的口径说明 {text, from}：近 7 天修好几件和自动任务页的“修好”、自动修理的成坏数的不是一回事，照写后台那句；
  // text 里没写哪天起的才补“几号起”
  function basis(b) {
    const text = b ? U.fieldText(b.text, viewer).trim() : '';
    if (!text) return '';
    const d = day(b.from), said = !d || /\d{1,2} *[-月.\/] *\d{1,2}/.test(text);
    return F(b.text, '口径说明') + (said ? '' : ` ·&nbsp;${esc(d)}&nbsp;起`);
  }
  function settled(d) {
    const rows = settledRows(d), shown = rows.filter(r => !filter || r.settled === filter);
    const fixed7 = d.counts?.outcomes7?.fixed, why7 = basis(d.outcomes7_basis ?? d.counts?.outcomes7_basis);
    const counts = Object.fromEntries(Object.keys(SETTLED).map(k => [k, rows.filter(r => r.settled === k).length]));
    const next = older.length ? olderNext : d.next;
    return `<section class="tp-panel lg-done" id="history"><div class="tp-panel__head"><h2>最近了结的</h2></div>
      <div class="tp-seg" role="group" aria-label="按结果看"><button type="button" data-filter="" aria-pressed="${!filter}">全部 ${int(rows.length)}</button>${Object.keys(SETTLED).map(k =>
        `<button type="button" data-filter="${k}" aria-pressed="${filter === k}">${settledLabel(k)} ${int(counts[k])}</button>`).join('')}</div>
      ${why7 && known(fixed7) ? `<p class="tp-small lg-basis">近 7 天修好 ${int(fixed7)} 件：${why7}</p>` : ''}
      <ul class="lg-settled">${groupRows(shown).map(({ rows: [r, ...rest] }) => `<li class="${[r, ...rest].some(x => x.id === picked) ? 'is-picked' : ''}"><span class="tp-tag" data-tone="${TONE[r.settled]}">${settledLabel(r.settled)}</span>
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

  // —— 反复出现 ——（“30 天内第三次坏就停手转给本人”照后台 automation/core.py 的 FAULT_WINDOW=30 天、LOOK_LIMIT=3 写死，改了那边要跟着改）
  function repeats(d) {
    const r = d.repeat_fixes || {}, rows = list(r.items);
    if (!rows.length) return '';
    const now = Date.now(), from = now - 30 * DAY, x = t => (t - from) / (30 * DAY) * 100;
    return `<section class="tp-panel lg-repeat" id="repeat"><div class="tp-panel__head"><h2>反复出现<small>修好了又出现的同一件，近 30 天；30 天内第三次坏，自动修理停手、转给${you()}</small></h2></div>
      <ul class="lg-replist">${rows.map(it => {
        const times = (list(it.reopen_at).length ? list(it.reopen_at) : [it.first_at, it.last_at]).map(stamp).filter(t => t && t >= from);
        return `<li${picked === it.id ? ' class="is-picked"' : ''}><button type="button" class="lg-title" data-pick="${esc(it.id)}">${F(titleOf(it), '反复出现的问题')}</button><span class="lg-rep__n">又发生 ${int(it.reopen_count)} 次</span>
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

  // —— 首页卡点进来的那几件（?view=） ——
  function viewList(d) {
    const rows = [...list(d.items), ...viewMore], next = viewMore.length ? viewNext : d.next;
    const total = known(d.total) ? d.total : rows.length, since = d.started_at || d.new_ledger?.started_at;
    const row = it => {
      const out = outcomeOf(it), done = Boolean(SETTLED[out]), nx = nextOf(it);
      const over = !done && (it.overdue || (stamp(nx) && stamp(nx) < Date.now()));
      const tag = done ? `<span class="tp-tag" data-tone="${TONE[out]}">${settledLabel(out)}</span>` : over ? '<span class="tp-tag" data-tone="bad">过期</span>'
        : it.state === 'working' ? '<span class="tp-tag lg-running">正在办</span>' : '<span class="tp-tag" data-tone="soft">在跟</span>';
      const meta = done ? (it.at ? `了结 ${esc(when(it.at))}` : '') : nx && !full(it) ? `${over ? '原定' : '下次看'} ${esc(when(nx))}` : full(it) ? '看满了' : '';
      const sub = [it.accepted && `${esc(when(it.accepted))} 记下`, !done && checkText(it)].filter(Boolean).join(' · ');
      return `<li>${tag}<span>${link(it.href || (it.id ? `/live/issue/?id=${encodeURIComponent(it.id)}` : ''), F(titleOf(it), '事项标题'))}${sub ? `<small class="lg-view__sub">${sub}</small>` : ''}</span><time>${meta}</time></li>`;
    };
    return `<section class="tp-panel lg-done lg-view" id="view"><div class="tp-panel__head"><h2>${VIEW[view]} ${int(total)} 件${view === 'due' ? '<small>过期的排最前</small>' : ''}</h2>
        <span class="tp-asof">${since ? `新账从 ${esc(day(since))} ${esc(T.clock(since))} 起算` : '新账正在重算'} · ${link('/live/ledger/', '看全部账本 ›')}</span></div>
      <ul class="lg-settled">${rows.map(row).join('') || `<li class="tp-empty">${!since ? '新账算好了这里列出来。' : d.view === view ? '这一类现在一件都没有。' : '这份清单后台还没给。'}</li>`}</ul>
      <div class="lg-done__foot">${next ? `<button type="button" class="lg-more" data-viewmore${viewBusy ? ' disabled' : ''}>${viewBusy ? '正在读…' : '再读 50 件 ›'}</button>` : ''}<span class="tp-small">已列出 ${int(rows.length)} 件，共 ${int(total)} 件</span></div></section>`;
  }
  async function readViewMore() {
    const d = state?.data, cursor = viewMore.length ? viewNext : d?.next;
    if (!cursor || viewBusy) return;
    viewBusy = true; draw();
    const s = await Live.get('ledger', { ...(project ? { project } : {}), view, cursor }).catch(() => null);
    viewBusy = false;
    if (Array.isArray(s?.data?.items)) { viewMore = viewMore.concat(s.data.items); viewNext = s.data.next; }
    T.keep(page.root, '[data-viewmore], .lg-view .lg-done__foot', draw);
  }

  let drawn = false;
  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    if (!d) { T.paint(page.root, T.placeholder(state, 'AI 自动任务账本')); page.tick.set([], { off: true }); return; }
    if (view) {
      T.paint(page.root, `<div class="tp-head"><div><h1>AI 自动任务账本</h1><p>从首页 AI 自动任务账本卡点进来的那几件；点一件看它的完整经过。</p></div>
        <p class="tp-head__side"><span>截至 ${esc(when(d.at || d.as_of))}</span></p></div>${T.stateNote(state)}${viewList(d)}`);
      page.tick.set([], { off: state.offline });
      return;
    }
    T.paint(page.root, `<div class="tp-head"><div><h1>AI 自动任务账本</h1><p>上面是 AI 还欠着的每一件，实时；下面是最近了结的和反复出现的，更早的翻页看。点一件看它的完整经过。</p></div>
        <p class="tp-head__side">${project ? `<span>只看项目 ${esc(project)} · ${link('/live/ledger/', '看全部 ›')}</span>` : ''}<span>截至 ${esc(when(d.at))}</span></p></div>
      ${T.stateNote(state)}${top(d)}${kinds(d)}${track(d)}<div class="tp-grid lg-split">${settled(d)}${detail(d)}</div>${repeats(d)}`);
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
  page = T.boot({ resource: 'ledger', query: { ...(project ? { project } : {}), ...(view ? { view } : {}) }, back: '/live/#ledger',
    ask: () => 'AI 自动任务账本里还欠着哪些事、哪件该看了、最近了结了什么？先用大白话说，别动手。',
    onState(next) {
      state = next; draw();
      if (!next.data || view) return;
      const want = autoPick ? next.data.summary?.oldest?.id || owed(next.data)[0]?.id : picked;
      if (want && (want !== picked || !pickedState || pickedState.data === undefined)) pick(want, true);
    } });
  page.root.addEventListener('click', e => {
    const p = e.target.closest('button[data-pick]'), f = e.target.closest('[data-filter]');
    if (p) { autoPick = false; pick(p.dataset.pick); return; }
    if (f) { filter = f.dataset.filter; T.keep(page.root, `[data-filter="${filter}"]`, draw); return; }
    const k = e.target.closest('[data-kind]');
    if (k) {
      kind = k.dataset.kind;
      // 网址跟着改（?kind=promised|repair），刷新后还是这一种；自动任务页“AI 约好的事 N 件在等 ›”就是带 ?kind=promised 进来的
      if (kind) params.set('kind', kind); else params.delete('kind');
      const q = params.toString(); history.replaceState(history.state, '', `${location.pathname}${q ? `?${q}` : ''}${location.hash}`);
      T.keep(page.root, `[data-kind="${kind}"]`, draw); return;
    }
    const more = e.target.closest('[data-more]');
    if (more) { showAll[more.dataset.more] = !showAll[more.dataset.more]; T.keep(page.root, `[data-more="${more.dataset.more}"]`, draw); return; }
    if (e.target.closest('[data-older]')) readOlder();
    if (e.target.closest('[data-viewmore]')) readViewMore();
  });
})();

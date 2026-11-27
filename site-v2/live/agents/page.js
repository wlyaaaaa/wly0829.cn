// 实况智能体页。两版共用 /computer-access/live/v1/agents，工期按允许范围算准。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, { esc } = U;
  const { HOSTS, list, known, int, pct, dec, hours, ms, link, fog, field, when, big } = T;
  const STATIONS = [
    ['start', '开场与接续'], ['message', '收到消息'], ['pre-tool', '动工具前'], ['post-tool', '动工具后'], ['compact', '压缩前'],
    ['helper', '派帮手时'], ['stop', '收工'], ['idle', '空等'], ['error', '出错停下'], ['other', '其他'],
  ];
  const STATION_OF = { SessionStart: 'start', Rules: 'start', PostCompactRewake: 'start', UserPromptSubmit: 'message', PreInvocation: 'message',
    PreToolUse: 'pre-tool', PermissionRequest: 'pre-tool', AutoReview: 'pre-tool', PostToolUse: 'post-tool', PreCompact: 'compact',
    SubagentStart: 'helper', SubagentStop: 'helper', Stop: 'stop', Notify: 'stop', Keepalive: 'idle', StopFailure: 'error' };
  const HOOK_GROUPS = [['in_use', '在用'], ['disabled', '停用'], ['unconfirmed', '未确认生效']];
  const kTok = n => `${int(Math.round(n / 1000))}K 词元`;
  const REASONS = [['larger_orders', '单子比想的大'], ['rework', '返工'], ['missed_follow_up', '漏想的后续活'], ['long_tests', '长测试'], ['scope_added', '中途加需求']];
  const SIZES = [['small', '小单'], ['medium', '中单'], ['large', '大单']];

  // 三块各自选时段。旧后台的钩子只给近 7 天时默认该段。
  let state, viewer = 'public', expanded = null, period = 'all', estPeriod = 'all', hookPeriod = null;
  // 家别筛选全页共用，刷新回到全部。
  let only = null;
  const modelsOpen = new Set();  // 哪几家的型号清单展开了全部
  const drawn = new Set();       // 图只在第一次出现时描线、长柱
  const cellsBefore = new Map(); // 钩子格上一轮的次数：变了闪一下
  const F = (v, name) => field(v, viewer, name);
  const keep = html => `<span class="ag-keep">${html}</span>`;
  const shown = () => only ? HOSTS.filter(h => h.id === only) : HOSTS;
  const dim = id => only && id !== only ? ' ag-dim' : '';   // 只看一家时，别家的卡、行、列变淡
  const dimAttr = id => only && id !== only ? ' class="ag-dim"' : '';
  // 公用读数由顶栏或页头报一次，只有同一批的时刻才拿来比；独立读数照写自己的截至。
  const asof = (at, coveredAt) => T.stamp(at) == null || at === coveredAt ? '' : `截至 ${when(at)}`;
  const RULE_CHECK = '开场先读的规矩';
  const ruleHint = '每次采样时，拿三家开场要读的规矩文件跟本机现用的那版比一次，看是不是同一版。';
  const ruleMismatch = `${RULE_CHECK} · 没比对上`;
  const rulePart = text => `<span class="ag-rule-part">${text}</span>`;
  function ruleStatus(entry) {
    const version = typeof entry?.version === 'string' && /^E[1-9]\d*$/.test(entry.version) ? esc(entry.version) : '';
    if (entry?.current === false) {
      const hint = version ? ` title="采样时拿这家开场读的文件跟本机现用的 ${version} 比，对不上。这家实际读的是哪版，这里看不出。"` : '';
      return `<span class="ag-rule-mismatch"${hint}>没比对上</span>`;
    }
    return entry?.current === true && version ? `${rulePart(`${version} · `)}<wbr>${rulePart('跟本机现用的一致')}` : '没读到';
  }
  // 页顶那一排：全部｜Claude｜Codex｜Antigravity，和本页切时段的按钮同一种样子，一眼看得出能点
  const picker = () => `<div class="tp-seg ag-pick" role="group" aria-label="看哪一家"><button type="button" data-only="all" aria-pressed="${!only}">全部</button>${HOSTS.map(h =>
    `<button type="button" data-only="${h.id}" style="--host:${h.color}" aria-pressed="${only === h.id}"><i class="tp-swatch"></i>${h.name}</button>`).join('')}</div>`;
  // 各块的图例：全部 + 三家，点一家整页只看它，再点一次或点“全部”回到三家
  const chips = (hint = true) => `<p class="ag-mlegend"><button type="button" class="ag-chip ag-chip--all${only ? '' : ' is-on'}" data-only="all" aria-pressed="${!only}">全部</button>${HOSTS.map(h =>
    `<button type="button" class="ag-chip${only === h.id ? ' is-on' : only ? ' is-off' : ''}" data-pick="${h.id}" aria-pressed="${only === h.id}" style="--host:${h.color}"><i class="tp-swatch"></i>${h.name}</button>`).join('')}
    ${hint ? `<span class="ag-mhint">${only ? `整页只看 ${HOSTS.find(h => h.id === only).name}，按它自己的数画 · 再点一次或点“全部”回到三家` : '点一家，整页只看它'}</span>` : ''}</p>`;
  const hostData = (d, h) => d.hosts?.[h.name] || {};
  const inventory = d => Array.isArray(d.hook_inventory) ? d.hook_inventory : null;
  const hostHooks = (d, h) => inventory(d)?.filter(hook => hook.host === h.name);
  const stationOf = hook => STATION_OF[hook.key?.split(':')[0]] || 'other';
  const compactLimit = x => Number.isFinite(x?.compact_tokens) && x.compact_tokens > 0
    ? `${x.compact_tokens_basis === 'configured_estimate' ? '约 ' : ''}${kTok(x.compact_tokens)}` : '';
  const firstTime = id => { const fresh = !drawn.has(id); drawn.add(id); return fresh; };

  function checks(d, h) {
    const x = hostData(d, h), rows = [];
    const add = (ok, good, bad, extra = {}) => rows.push({ ok, text: ok === false ? bad : good, ...extra });
    const entry = x.entry || {};
    add(entry.current ?? null, RULE_CHECK, ruleMismatch);
    if (h.id !== 'antigravity') {
      const off = x.memory === false && Object.values(x.memory_options || {}).every(v => v !== true);
      add(x.memory === true ? false : x.memory === false ? off : null, '自带记忆关着', '自带记忆开着，和规矩不一样');
    }
    const eager = typeof x.approval === 'string' && /EAGER/.test(x.approval);
    add(x.waits_for_owner === false || eager ? true : x.waits_for_owner === true ? false : null, '动手前不停下等批准', '动手前会停下等批准，和规矩不一样');
    const pass = rows.filter(r => r.ok === true).length, fail = rows.filter(r => r.ok === false), unknown = rows.filter(r => r.ok == null).length; // 历史错误只在钩子表里计数
    return { rows, pass, fail, unknown, total: rows.length };
  }
  function scoreCard(d, h) {
    const c = checks(d, h), x = hostData(d, h), health = list(d.health?.providers).find(p => p.id === h.id) || {};
    const issues = list(health.issues);
    const owner = health.status === 'owner', ignored = health.status === 'ignored';
    const tone = c.fail.length || issues.length ? (owner ? 'owner' : 'repair') : c.unknown ? 'off' : 'ok';
    const failed = issues.length || c.fail.length;
    const word = owner ? `要${T.you(viewer)}看` : failed ? `差 ${failed} 处` : c.unknown ? `${c.unknown} 项没读到` : '全对上';
    const ringColor = tone === 'ok' ? T.TONE.ok : tone === 'off' ? T.TONE.off : T.TONE.repair;
    const statusText = html => (h.id === 'codex' && !html.includes('<') ? html.replace(/\bPlugin\w+:[\w-]+@[\w-]+|钩子说明|钩子，?|说明|它是干什么的/g,
      word => word.startsWith('Plugin') ? `<span class="ag-truncate" title="${word}">${word}</span>` : `<span class="ag-status-word">${word}</span>`) : html).replace(/(^Codex |」)装着/, '$1' + keep('装着'));
    const fixer = i => F(i.handler_text, '谁在修') || (i.handler ? `${F(i.handler, '谁在修')}${i.repairing === false ? '' : '在修'}` : '');
    const fixText = i => [fixer(i), known(i.round) && `第 ${int(i.round)} 轮`].filter(Boolean).join(' · ') || (owner ? '' : '还没人接手');
    const fixLink = (i, html) => html && T.path(i.href) ? `<a href="${esc(T.path(i.href))}">${html} ›</a>` : html;
    const issueText = i => {
      const text = F(i.text);
      return text === `${h.name} 开场读到的规矩不是当前版` ? ruleMismatch : text;
    };
    const list1 = issues.length ? issues.map(i => `<li><span class="tp-dot" data-tone="${owner ? 'owner' : 'repair'}"></span><span>${statusText(issueText(i))}${issues.length > 1 && fixText(i)
        ? `<small>${fixLink(i, fixText(i))}</small>` : ''}</span></li>`).join('')
      : c.fail.map(r => `<li><span class="tp-dot" data-tone="repair"></span><span>${r.href ? `<a href="${esc(r.href)}">${statusText(esc(r.text))}</a>` : esc(r.text)}</span></li>`).join('');
    const lead = issues.find(i => fixer(i)) || issues.find(i => known(i.round)) || issues.find(i => T.path(i.href)) || issues[0];
    const fix = owner || !(c.fail.length || issues.length) ? ''
      : `<p class="ag-fix">${lead ? fixLink(lead, fixText(lead)) : '还没人接手'}</p>`;
    const hooks = hostHooks(d, h);
    return `<article class="ag-score tp-flashable${dim(h.id)}" data-host="${h.id}">
      <header><span>${h.name}</span><small>${ruleStatus(x.entry)} · <wbr>${link('/rules/', '规则页 ›', 'ag-rulever')}${hooks ? ` · <wbr>${keep(`登记钩子 ${int(hooks.length)} 条`)}` : ''}</small></header>
      <div class="ag-score__main"><div><p class="ag-score__word" data-tone="${tone}">${word}</p>${fix}
        <p class="tp-small">${c.unknown || c.fail.length ? `设置 ${c.total} 项里 ${c.pass} 项照规矩` : `设置 ${c.total} 项都照规矩`}${ignored ? ` · ${T.you(viewer)}定了不管` : ''}${owner && health.href ? ` · ${link(health.href, '在等你的事里 ›')}` : ''}</p></div>
        ${T.ring(c.pass, c.total, { color: ringColor })}</div>
      ${list1 ? `<ul class="ag-diff">${list1}</ul>` : `<p class="ag-ok">${h.id === 'antigravity' ? '这家没有自带记忆。' : ''}${c.unknown ? '有设置还没读到。' : '没有读到需要处理的差异。'}</p>`}</article>`;
  }
  // 首卡不另写“截至”：它就是这一轮的 d.at，顶栏“读到”或大标题区已经写过（页头同一时刻只说一次，本人 11-24 16:13 看图点头，M746）
  function statusSection(d) {
    return `<section class="tp-panel" id="status"><div class="tp-panel__head"><h2>三家现在管得对不对</h2></div>
      <div class="tp-grid ag-scores">${HOSTS.map(h => scoreCard(d, h)).join('')}</div></section>`;
  }

  // —— 二、工期准不准 ——
  const stats = (d, h) => d.work_stats?.hosts?.[h.id] || {};
  const TIMES = [['all', '全部'], ['7d', '近 7 天'], ['30d', '近 30 天']];
  const timeLabel = p => TIMES.find(t => t[0] === p)?.[1] || '';
  const timeSeg = (key, cur) => `<div class="tp-seg ag-tseg" role="group" aria-label="看哪一段">${TIMES.map(([id, label]) =>
    `<button type="button" data-tseg="${key}:${id}" aria-pressed="${cur === id}">${label}</button>`).join('')}</div>`;
  // 某一段的某一家：全部读 hosts.<家>（后台说和 work_stats.periods.all 是同一份），近 7／30 天读 periods.<段>.hosts.<家>；
  // 后台还没给这一段的 work、estimate（旧后台每家只有五个数）时是 null，页面写“后台还没送来”，不拿别的数凑
  const inPeriod = (d, p, h) => {
    if (p === 'all') return stats(d, h);
    const x = d.work_stats?.periods?.[p]?.hosts?.[h.id];
    return x && typeof x.work === 'object' && typeof x.estimate === 'object' ? x : null;
  };
  const est = (d, h) => inPeriod(d, estPeriod, h)?.estimate || {};
  // 有派单却一件开工都没记下，是采集没采上，不是没干活（本人 11-23 08:11：“我最近肯定是和 antigravity 有对话的”）。按全部记录判断，近 7 天没开工不算没采上
  const missing = (d, h) => { const w = stats(d, h).work || {}; return !d.work_stats || w.starts === 0 || w.starts == null; };
  // 最上面一行“全部”：三家合起来准不准，和三家同一种写法、字更大（本人 16:35 照图点头）。件数按各家的件数加起来，比例按件数重算，不是三个百分比取平均
  function accuracyAll(d) {
    const rows = HOSTS.filter(h => !missing(d, h)).map(h => est(d, h)).filter(e => e.samples && known(e.accuracy));
    const n = rows.reduce((s, e) => s + e.samples, 0);
    if (!n) return '';
    const hits = rows.reduce((s, e) => s + Math.round(e.accuracy * e.samples), 0);
    const timed = rows.every(e => known(e.on_time)) ? rows.reduce((s, e) => s + Math.round(e.on_time * e.samples), 0) / n : null;
    return `<div class="ag-acc__row ag-acc__row--all${only ? ' ag-dim' : ''}"><span class="tp-hostname">全部</span><div><p class="tp-big">${big(hits / n * 100, 'acc-all')}<small>%</small></p>
      <p class="tp-small">${known(timed) ? `<span>按时 <b>${pct(timed)}</b></span>` : ''}<span>${int(n)} 件</span></p></div></div>`;
  }
  function accuracyColumn(d) {
    return `<div class="ag-acc">${accuracyAll(d)}${HOSTS.map(h => {
      const e = est(d, h);
      const body = missing(d, h) || !e.samples ? `<p class="tp-mid" data-tone="off">${esc(missing(d, h) ? '还没采上' : estPeriod === 'all' ? '没有完工记录' : '这段时间没有完工')}</p>`
        : `<p class="tp-big">${big(e.accuracy * 100, 'acc-' + h.id)}<small>%</small></p><p class="tp-small"><span>按时 <b>${pct(e.on_time)}</b></span><span>${int(e.samples)} 件</span></p>`;
      return `<div class="ag-acc__row${dim(h.id)}" data-host="${h.id}"><span class="tp-hostname">${h.name}</span><div>${body}</div></div>`;
    }).join('')}</div>`;
  }
  function ratioPlot(d) {
    const W = 470, H = 214, pad = { l: 46, r: 16, t: 26, b: 28 }, w = W - pad.l - pad.r, h = H - pad.t - pad.b;
    const values = HOSTS.flatMap(hh => SIZES.map(([s]) => est(d, hh).size_ratios?.[s]).filter(r => r?.samples))
      .flatMap(r => [r.actual_over_estimate, r.p75]).filter(known);
    const lo = .4, hi = Math.max(2, Math.ceil((Math.max(...values, 1) + .2) * 2) / 2);
    const x = v => pad.l + (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * w;
    const rowY = i => pad.t + (i + .5) * h / 3;
    let out = `<rect class="tp-band" x="${x(.7)}" y="${pad.t - 6}" width="${x(1.1) - x(.7)}" height="${h + 6}" rx="3"/>
      <line class="tp-bandline" x1="${x(1)}" x2="${x(1)}" y1="${pad.t - 6}" y2="${pad.t + h}"/>
      <text x="${(x(.7) + x(1.1)) / 2}" y="${pad.t - 11}" text-anchor="middle" style="fill:#00813f;font-weight:700">估 1 小时以上</text>`;
    for (let v = .5; v <= hi + 1e-9; v += .5) out += `<text x="${x(v)}" y="${H - 8}" text-anchor="middle">${dec(v)}×</text><line class="tp-gridline" x1="${x(v)}" x2="${x(v)}" y1="${pad.t}" y2="${pad.t + h}"/>`;
    SIZES.forEach(([size, label], i) => {
      const y0 = rowY(i);
      out += `<text x="${pad.l - 10}" y="${y0 + 4}" text-anchor="end" style="font-size:12.5px;fill:#3d3d3a;font-weight:700">${label}</text><line class="tp-gridline" x1="${pad.l}" x2="${pad.l + w}" y1="${y0}" y2="${y0}"/>`;
      const hosts = shown();
      hosts.forEach((hh, j) => {
        const r = est(d, hh).size_ratios?.[size];
        if (!r?.samples || !known(r.actual_over_estimate) || missing(d, hh)) return;
        const y = y0 + (hosts.length === 1 ? 0 : (j - 1) * 13), v = r.actual_over_estimate;
        if (known(r.p25) && known(r.p75)) out += `<line x1="${x(r.p25)}" x2="${x(r.p75)}" y1="${y}" y2="${y}" stroke="${hh.color}" stroke-width="3" stroke-linecap="round" opacity=".45"/>`;
        out += `<circle cx="${x(v)}" cy="${y}" r="5.5" fill="${hh.color}" stroke="#fff" stroke-width="1.5"/><text x="${x(v) + 9}" y="${y + 4}" style="font-weight:700;fill:#3d3d3a">${dec(v, 2)}×</text>`;
      });
    });
    return `<svg class="tp-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="实际是估的几倍">${out}</svg>`;
  }
  function weekLabels(d) {
    const weeks = list(stats(d, HOSTS[0]).weeks);
    return weeks.map((w, i) => i === weeks.length - 1 ? '这周' : `${T.day(w.week_start + 'T00:00:00+08:00')} 周`);
  }
  function trend(d) {
    const labels = weekLabels(d);
    const series = shown().filter(h => !missing(d, h)).map(h => ({ color: h.color, values: list(stats(d, h).weeks).map(w => w.estimate?.samples >= 3 ? w.estimate.accuracy : null) }));
    const thin = shown().filter(h => !missing(d, h)).map(h => ({ h, w: list(stats(d, h).weeks).at(-1) })).filter(({ w }) => w && w.estimate?.samples > 0 && w.estimate.samples < 3);
    return labels.length ? T.line({ series, labels, width: 470, height: 214, max: 1, draw: firstTime('trend') })
      + `<p class="tp-small">一周完工不到 3 件的不画点${thin.length ? `：这周 ${thin.map(({ h, w }) => `${h.name} ${w.estimate.samples} 件`).join('、')}` : ''}。</p>` : '<p class="tp-empty">还没有按周的记录。</p>';
  }
  function reasons(d) {
    const hosts = shown().filter(h => !missing(d, h));
    const rows = REASONS.map(([key, label]) => ({ label, parts: hosts.map(h => ({ h, n: est(d, h).overtime_reasons?.[key] || 0 })) }));
    const other = hosts.reduce((s, h) => { const r = est(d, h).overtime_reasons || {}; return s + (r.other || 0) + (r.unknown || 0); }, 0);
    const total = hosts.reduce((s, h) => s + (est(d, h).overtime_reasons?.overdue || 0), 0);
    const max = Math.max(1, ...rows.map(r => r.parts.reduce((s, p) => s + p.n, 0)));
    // 图例挪到标题下面（照 16:35 点头的图），看得出它管这一整块；柱子行距放宽一点，和右边“三种估法”分量匀一些（本人：“右多左少”）
    return `<p class="tp-sub">超时原因 <small>${only ? `${hosts[0]?.name || ''} ` : ''}超时共 ${int(total)} 件；“中途加需求”可能和别的原因同时算${other ? `，另有 ${int(other)} 件没写或写了别的原因` : ''}</small></p>
      ${chips()}
      <div class="tp-bars ag-reasons">${rows.map(r => { const sum = r.parts.reduce((s, p) => s + p.n, 0); return `<div class="tp-bar"><span>${r.label}</span>
        <span class="tp-bar__track"><span class="ag-stack" style="width:${sum / max * 100}%">${r.parts.filter(p => p.n).map(p => `<span class="tp-bar__fill" style="--fill:${p.h.color};flex:${p.n}">${p.n}</span>`).join('')}</span></span>
        <span class="tp-bar__num">${int(sum)}</span></div>`; }).join('')}</div>`;
  }
  // 估时比较区分开工推荐、实际报告和全按中等的对照。缺数时写在核。
  const BASES = [['program_at_start', '开工时程序推荐的'], ['ai_reported', `实际报给${'{you}'}的`], ['all_medium', '全按中等大小算（对照）']];
  function compare(d) {
    const b = estPeriod === 'all' ? d.work_stats?.estimate_baselines : d.work_stats?.periods?.[estPeriod]?.estimate_baselines;
    const name = label => label.replace('{you}', T.you(viewer));
    const find = (list_, id) => list(list_).find(r => r.id === id);
    const ok = rs => BASES.every(([id]) => { const r = find(rs, id); return r && known(r.hits) && known(r.samples) && r.samples > 0; });
    // 只看一家时换成这一家自己的三个数（后台 hosts.<家>.rows）；这一家没出数就照旧写三家合起来的
    const mine = only && ok(b?.hosts?.[only]?.rows) ? b.hosts[only].rows : null, rows = mine || list(b?.rows);
    const ready = ok(rows);
    if (!ready) {
      return `<p class="tp-sub">三种估法各对上几件 <small>对照口径在核</small></p>
        <div class="ag-bases">${BASES.map(([, label]) => `<p><span>${esc(name(label))}</span><b class="tp-fog">在核</b></p>`).join('')}</div>
        <p class="tp-small">后台正在把这三个数分开算，每个带口径和件数；出数以前不比哪种更准。</p>`;
    }
    const share = r => r.hits / r.samples;
    // 三条口径的相同后半句只在底下写一次，找不到就逐条写全。
    const split = (() => {
      const texts = BASES.map(([id]) => find(rows, id)?.basis);
      if (!texts.every(t => typeof t === 'string' && t)) return null;
      let k = 0; const min = Math.min(...texts.map(t => t.length));
      while (k < min && texts.every(t => t[t.length - 1 - k] === texts[0][texts[0].length - 1 - k])) k++;
      const tail = texts[0].slice(texts[0].length - k), cut = tail.indexOf('，');
      if (cut < 0 || tail.length - cut < 8) return null;
      const heads = texts.map(t => t.slice(0, t.length - k + cut));
      return heads.every(Boolean) ? { heads, tail: tail.slice(cut + 1) } : null;
    })();
    const bar = ([id, label], i) => { const r = find(rows, id);
      const note = split ? F(split.heads[i], '口径') : r.basis ? F(r.basis, '口径') : '';
      return `<div class="ag-base${id === 'all_medium' ? ' is-ref' : ''}"><div class="tp-bar"><span>${esc(name(label))}</span><span class="tp-bar__track"><span class="tp-bar__fill" style="--fill:${id === 'all_medium' ? '#cfcdc5' : '#8f8d85'};width:${share(r) * 100}%"></span></span><span class="tp-bar__num">${int(r.hits)}/${int(r.samples)}</span></div>
        ${note ? `<p class="tp-small">${note}</p>` : ''}</div>`; };
    const p = find(rows, 'program_at_start'), a = find(rows, 'ai_reported'), gap = a.hits - p.hits;
    const same = p.samples === a.samples, close = same && Math.abs(gap) <= Math.max(2, Math.round(p.samples * .03));
    const say = !same ? `两个数算的件数不一样（${int(p.samples)} 件对 ${int(a.samples)} 件），先不放在一起比。`
      : close ? `开工时程序推荐的和实际报的差不多：${int(p.hits)} 件对 ${int(a.hits)} 件。`
      : `同一批 ${int(p.samples)} 件里，实际报的比程序推荐的${gap > 0 ? '多' : '少'}对上 ${int(Math.abs(gap))} 件（${int(a.hits)} 对 ${int(p.hits)}）。`;
    const per = HOSTS.map(h => ({ h, r: b.hosts?.[h.id]?.rows })).filter(x => BASES.every(([id]) => known(find(x.r, id)?.hits)));
    const scope = mine ? `${HOSTS.find(h => h.id === only).name} 的 ${int(p.samples)} 件` : only ? `${HOSTS.find(h => h.id === only).name} 单独的数还没出，这里是三家合起来的` : b.scope ? F(b.scope, '口径') : `同一批 ${int(p.samples)} 件`;
    return `<p class="tp-sub">三种估法各对上几件 <small>${scope.replace(/完工记录/g, keep)}，落在允许范围内算对上${asof(b.at, d.work_stats?.as_of) ? ` · ${esc(asof(b.at, d.work_stats?.as_of))}` : ''}</small></p>
      <div class="tp-bars">${BASES.map(bar).join('')}</div>
      <p class="ag-say">${say}</p>
      ${per.length ? `<p class="tp-small">${per.map(({ h, r }) => `<span class="ag-perhost${dim(h.id)}"><span data-host="${h.id}" class="tp-hostname">${h.name}</span> ${BASES.map(([id, label]) => `${esc(name(label).replace('（对照）', ''))} ${int(find(r, id).hits)}/${int(find(r, id).samples)}`).join(' · ')}</span>`).join('<br>')}</p>` : ''}
      <p class="tp-small">${split ? `三种的口径一样：${F(split.tail, '口径')}<br>` : ''}“全按中等大小算”只是对照：假设每件都按中等估，不是程序开工时真给的数。</p>`;
  }
  function estimateSection(d) {
    const ws = d.work_stats;
    if (!ws) return `<section class="tp-panel" id="estimate"><div class="tp-panel__head"><h2>工期准不准</h2></div><p class="tp-empty">工期账这一轮没读到。</p></section>`;
    if (ws.unavailable_reason) return `<section class="tp-panel" id="estimate"><div class="tp-panel__head"><h2>工期准不准</h2></div><p class="tp-empty">${esc(ws.unavailable_reason)}</p></section>`;
    // 时间那排在标题行右边（照 16:35 点头的图），准的比例、实际是估的几倍、超时原因、三种估法跟着换；按周走势本来就按周画，不跟着换
    // 施工账统计与本页同次生成，后端只在这项的时间戳省掉小数秒。
    const recordedAt = ws.as_of === d.at ? '' : asof(ws.as_of, typeof d.at === 'string' && d.at.replace(/\.\d+(?=Z|[+-]\d\d:\d\d$)/, ''));
    const head = `<div class="tp-panel__head"><h2>工期准不准<small>落在估算程序给的允许范围内才算准，估多估少都算偏</small></h2><div class="ag-mhead">${timeSeg('est', estPeriod)}${recordedAt ? `<span class="tp-asof">${esc(recordedAt)}</span>` : ''}</div></div>`;
    if (!HOSTS.every(h => inPeriod(d, estPeriod, h))) return `<section class="tp-panel" id="estimate">${head}<p class="tp-empty">${timeLabel(estPeriod)}的工期数后台还没送来，先看“全部”。</p></section>`;
    const weeks = weekLabels(d).length;
    return `<section class="tp-panel" id="estimate">${head}
      <div class="tp-grid ag-est">
        <div><p class="tp-sub">准的比例</p>${accuracyColumn(d)}</div>
        <div><p class="tp-sub">实际是估的几倍</p>${ratioPlot(d)}<p class="tp-small">绿带只画估 1 小时及以上的单子：实际比估的早 30% 以内、晚 10% 以内都算准，正好在边上也算；不到 1 小时的单子按分钟算，早 15 分钟、晚 5 分钟以内算准。</p></div>
        <div><p class="tp-sub">按周走势${weeks ? ` <small>近 ${weeks} 周，一直按周画</small>` : ''}</p>${trend(d)}</div>
      </div>
      <div class="tp-grid ag-est2"><div>${reasons(d)}</div><div>${compare(d)}</div></div></section>`;
  }

  // —— 三、报了估时的活（原名“三家各干了多少活”，本人 11-26 04:27 选 A 改名；和工期放一起） ——
  const MODEL = id => {
    const m = /^(claude|gpt|gemini)-(.+)$/.exec(String(id || ''));
    if (!m) return String(id || '');
    if (m[1] === 'claude') { const [name, ...v] = m[2].split('-'); return `${name[0].toUpperCase()}${name.slice(1)} ${v.join('.')}`; }
    if (m[1] === 'gpt') { const [ver, ...name] = m[2].split('-'); return `GPT-${ver} ${name.map(s => s[0].toUpperCase() + s.slice(1)).join(' ')}`; }
    return 'Gemini ' + m[2].split('-').map(s => /^\d/.test(s) ? s : s[0].toUpperCase() + s.slice(1)).join(' ');
  };
  const summaryModel = row => /^gpt-6-luna$/.test(row.model) && row.effort === 'low';
  // 各时段读取对应 work。工时沿用登记的完工用时，缺数写未送来。
  const workFor = (d, h) => inPeriod(d, period, h)?.work || null;
  function workCard(d, h) {
    const w = workFor(d, h), lost = missing(d, h);
    const models = list(w?.models).filter(m => !summaryModel(m)).sort((a, b) => b.count - a.count);
    const orders = !w ? null : known(w.work_orders) ? w.work_orders : known(w.orders) ? w.orders - list(w.models).filter(summaryModel).reduce((s, m) => s + m.count, 0) : null;
    // 一件没开工、也没有完工用时，就是 0 小时，不写“没读到”（沿 r79）
    const minutes = !w ? null : known(w.actual_minutes) ? w.actual_minutes : w.starts === 0 ? 0 : null;
    const cell = (label, value, unit, key, fmt) => `<div class="ag-work__row"><span>${label}</span>${!w ? '<b class="tp-fog">后台还没送来</b>' : lost && key !== 'orders' ? `<b class="tp-fog">还没采上</b>`
      : known(value) ? `<b class="tp-mid">${big(value, `work-${h.id}-${key}-${period}`, fmt)}<small>${unit}</small></b>` : `<b class="tp-fog">没读到</b>`}</div>`;
    // 型号是普通清单，不做成像按钮的圆角小签；超过 4 种的“另 N 种”是真按钮，就地展开全部、再点收起（本人 11-23 23:53：“这种怎么都按不了？”）
    const open = modelsOpen.has(h.id), shown = open ? models : models.slice(0, 4);
    const more = models.length > 4 ? `<button type="button" class="ag-more" data-models="${h.id}" aria-expanded="${open}">${open ? '收起' : `另 ${models.length - 4} 种`}<span class="tp-chev" aria-hidden="true"></span></button>` : '';
    return `<article class="ag-work${dim(h.id)}" data-host="${h.id}"><header>${h.name}</header>
      ${cell('开工', w?.starts, '件', 'starts')}${cell('登记工时', known(minutes) ? minutes / 60 : null, '小时', 'hours', 'dec')}${cell('派出去', orders, '单', 'orders')}
      <div class="ag-modelbox"><p class="ag-models__head">派出去的单按型号 · 档位分</p>${!w ? '<p class="tp-muted ag-models__none">后台还没送来</p>' : shown.length ? `<ul class="ag-models">${shown.map(m => `<li><span>${esc(MODEL(m.model))} · ${esc(m.effort)}</span><b>${int(m.count)}</b></li>`).join('')}</ul>` : '<p class="tp-muted ag-models__none">没有派单</p>'}${more}</div>
      ${lost ? '<p class="tp-small">开工和登记工时这一家还没采上，派单数是派活工具记的。</p>' : ''}</article>`;
  }
  function workSection(d) {
    const ws = d.work_stats;
    if (!ws || ws.unavailable_reason) return '';
    const weeks = list(stats(d, HOSTS[0]).weeks), labels = weekLabels(d);
    // “几号起才有记录”只在选的这一段（近 7／30 天）起点早于最早一条记录时写；“全部”和记录全了的不写，后台没给起点判断不了也不写（M911）
    const earliest = ws.periods?.all?.from, start = ws.periods?.[period]?.from;
    const first = period !== 'all' && Date.parse(start) < Date.parse(earliest) ? earliest : null;
    // 只看一家时柱子只画这一家、按它自己的数定高（Antigravity 叠在三家里几乎看不见），图例点哪家整页跟着变（本人 11-24：“三家各干了多少活右下角不能点”）
    const rows = weeks.map((w, i) => ({ label: labels[i], parts: shown().filter(h => !missing(d, h)).map(h => ({ color: h.color, value: (list(stats(d, h).weeks)[i]?.work?.actual_minutes || 0) / 60 })) }));
    return `<section class="tp-panel" id="work"><div class="tp-panel__head"><h2>报了估时的活<small>派活时报过估时的活；登记工时是完工时记下的用时，和上面实际在干的总时间不是一回事</small></h2><div class="ag-mhead">${timeSeg('work', period)}${first ? `<span class="tp-asof">${esc(T.day(first))} 起才有记录</span>` : ''}</div></div>
      <div class="tp-grid ag-workgrid"><div class="tp-grid ag-works">${HOSTS.map(h => workCard(d, h)).join('')}</div>
      <div><p class="tp-sub">按周比 · 登记工时（小时）</p>${columns(rows, -1)}${chips()}</div></div><p class="tp-small ag-foot">这里是实际派过的单数，不代表现在的规定；${link('/rules/topic-execution-coordination.html#本人定的分工和型号规矩原约法-l22l23', '分工和选型号的规矩 ›')}</p></section>`;
  }
  const columns = (rows, highlight) => T.columns({ rows, width: 440, height: 236, fmt: v => v >= 10 ? int(v) : dec(v), grow: firstTime('cols'), highlight });

  // —— 四、开场和接续 · 动手和权限 ——
  function row(label, cells, { diff = [], note = '' } = {}) {
    // 相邻几家一样的合成一格只写一次；合成的格子和别的格子一样靠左，开头小字写是哪几家一样（本人 11-23 23:53：“怎么排版还奇形怪状的？”）
    const out = [];
    cells.forEach((c, i) => { const last = out.at(-1); if (last && last.html === c && !diff[i] && !last.diff) last.span++; else out.push({ html: c, span: 1, diff: diff[i], from: i }); });
    const same = c => c.span === HOSTS.length ? '三家一样' : `${HOSTS.slice(c.from, c.from + c.span).map(h => h.name).join('、')} 一样`;
    const off = c => only && !HOSTS.slice(c.from, c.from + c.span).some(h => h.id === only) ? ' ag-dim' : '';
    return `<tr><th scope="row">${label}${note ? `<small>${note}</small>` : ''}</th>${out.map(c => c.span > 1
      ? `<td colspan="${c.span}" class="ag-same${off(c)}"><span class="ag-same__who">${same(c)}</span>${c.html}</td>`
      : `<td${c.diff || off(c) ? ` class="${[c.diff && 'is-diff', off(c).trim()].filter(Boolean).join(' ')}"` : ''}>${c.html}</td>`).join('')}</tr>`;
  }
  function configSection(d) {
    const x = h => hostData(d, h);
    const entries = HOSTS.map(h => x(h).entry || {});
    const tools = h => Array.isArray(x(h).tools) ? (x(h).tools.length ? x(h).tools.map(t => `<span class="ag-tool-name">${F(t.name)}</span>`).join('、') : '没有') + (x(h).tools_scope ? `<small>${F(x(h).tools_scope).replace(/为准|未计入/g, keep)}</small>` : '') : '没读到';
    const unlock = h => { const t = U.fieldText(d.unlock?.[h.name], viewer); return t ? esc(t.replace(/^已登记的 ?(Claude|Codex|Antigravity) ?桌面版/, '已登记的桌面版').replace(/^(Claude|Codex|Antigravity) ?/, '')).replace(/验证有效期/g, keep) : '没读到'; };
    const memory = h => h.id === 'antigravity' ? `这家没有${known(x(h).knowledge?.count) ? `<small>知识目录 ${int(x(h).knowledge.count)} 条${x(h).knowledge.latest_write_day ? '，最近 ' + esc(x(h).knowledge.latest_write_day) + ' 写' : ''}</small>` : ''}`
      : x(h).memory === false ? '关着' : x(h).memory === true ? '开着，和规矩不一样' : '没读到';
    const compact = h => {
      const limit = compactLimit(x(h));
      return limit ? `${limit}就压缩${known(x(h).context_window) ? `<small>配的窗口是 ${kTok(x(h).context_window)}</small>` : ''}`
        : F(x(h).compact) || '没读到';
    };
    const waits = HOSTS.map(h => x(h).waits_for_owner === false || /EAGER/.test(String(x(h).approval || '')));
    const rulesLink = link('/rules/', `${rulePart('规则页放的是网站上发布的那版，')}<wbr>${rulePart('每天 07:20 查一次、有新版才换，')}<wbr>${rulePart('所以可能比本机现用的旧 ›')}`);
    const rows = [
      row(`<span title="${ruleHint}">${RULE_CHECK}</span>`, entries.map(ruleStatus), { diff: entries.map(e => e.current === false) }),
      // 开场页那一格点进开场页，直接落在这一家（本人 11-24 01:36 定 FEDQ2 选 A）
      row('入口规则多少字', HOSTS.map((h, i) => `${known(entries[i].characters) ? `${int(entries[i].characters)} 字` : '没读到'}${link(`/live/agents/opening/?family=${h.id}`, '看开场页 ›')}`)),
      row('自带记忆', HOSTS.map(memory), { diff: HOSTS.map(h => x(h).memory === true) }),
      row('对话装多满会压缩', HOSTS.map(compact)),
      row('动手前停不停下等批准', HOSTS.map((h, i) => waits[i] ? `不停，直接动手<a class="tp-link" href="#hooks-pre-tool">要拦的几样在钩子“动工具前” ›</a>` : '会停下等批准'),
        { diff: waits.map(w => !w) }),
      row('谁能自己解开资料锁', HOSTS.map(unlock), { note: link('/rules/topic-authorization.html', '规则 ›') }),
      row('多接的工具', HOSTS.map(tools), { note: ['电脑接口、Google 以外', asof(d.tools_at, d.at)].map(esc).filter(Boolean).join('<br>') }),
    ];
    const codexReview = x(HOSTS[1]).reviewer === 'auto_review';
    return `<section class="tp-panel" id="settings"><div class="tp-panel__head"><h2>开场和接续 · 动手和权限<small>三家一样的合成一格，不一样的标黄</small></h2></div>
      <table class="tp-table ag-config"><thead><tr><th scope="col">项目</th>${HOSTS.map(h => `<th scope="col" data-host="${h.id}"${dimAttr(h.id)}><i class="tp-swatch"></i>${h.name}</th>`).join('')}</tr></thead>
      <tbody>${rows.join('')}</tbody></table>
      <p class="tp-small ag-foot">${codexReview ? 'Codex 动工具前要批准的，先由它自带的审核模型审；这只管工具请求，要你点头或验证的大事照规矩还是找你。' : ''}${rulesLink}</p></section>`;
  }

  // —— 五、钩子 ——
  // 拦、错只有新格式的记录里有；旧日志只记了次数和耗时。后台给 blocked_samples（记了拦没拦的有几次），比次数少就照实写只算了其中几次，不当全部
  const outcomeShort = t => known(t?.blocked_samples) && known(t?.runs) && t.blocked_samples < t.runs;
  function hookCell(hooks, station, h, hv, p) {
    const cell = hv?.cells?.[station]?.[h.id] || {};
    const count = hooks.filter(r => r.host === h.name && stationOf(r) === station).length;
    if (!count) return `<td class="ag-heat ag-heat--none${dim(h.id)}">这个当口没有登记</td>`;
    const max = Math.max(1, ...HOSTS.flatMap(hh => STATIONS.map(([s]) => hv?.cells?.[s]?.[hh.id]?.runs).filter(known)));
    const heat = known(cell.runs) && cell.runs > 0 ? Math.log10(cell.runs + 1) / Math.log10(max + 1) : 0;
    const key = `${station}/${h.id}`, flashKey = `${p}/${key}`, before = cellsBefore.get(flashKey);   // 切时间段不闪，同一段次数变了才闪
    const flash = before != null && before !== cell.runs ? ' tp-flash' : '';
    cellsBefore.set(flashKey, cell.runs);
    const stats = known(cell.runs) ? `<span>${int(cell.runs)} 次</span> <span>${ms(cell.median_ms)}</span>` : '<span>次数还没采上</span>';
    const badges = [known(cell.blocked) && cell.blocked > 0 && `<span class="ag-badge" data-tone="repair">拦 ${int(cell.blocked)}</span>`,
      known(cell.errors) && cell.errors > 0 && `<span class="ag-badge" data-tone="bad">错 ${int(cell.errors)}</span>`].filter(Boolean).join('');
    return `<td class="ag-heat${flash}${dim(h.id)}" style="--heat:${(.05 + heat * .38).toFixed(3)}" data-host="${h.id}"><button type="button" data-cell="${key}" aria-expanded="${expanded === key}" aria-controls="hook-detail-${station}">
      <span class="ag-heat-stats"><span>${count} 条</span> ${stats}</span>${badges ? `<span class="ag-heat-badges">${badges}</span>` : ''}<span class="tp-chev" aria-hidden="true">${expanded === key ? '收起' : ''}</span></button></td>`;
  }
  function hookCard(d, hook, withSample = false) {
    const id = HOSTS.find(h => h.name === hook.host)?.id;
    const sample = withSample && list(d.latest_context).find(r => r.host === hook.host && r.hook === hook.key);
    const preCompact = hook.key === 'PreCompact';
    const limit = preCompact && compactLimit(d.hosts?.[hook.host]);
    // 旧说明的开头抄了设置值。触发和动作继续用目录原文，自动压缩线随配置读口。
    const summary = preCompact && typeof hook.summary === 'string'
      ? hook.summary.replace(/^对话装到[^\n]*?(?=你也可以手动压缩)/, '') : hook.summary;
    return `<article class="ag-hook${dim(id)}" data-host="${esc(id || '')}"><h4><span class="ag-truncate" title="${esc(U.fieldText(hook.name, viewer))}">${F(hook.name, '钩子名称')}</span><small class="tp-hostname">${F(hook.host)}</small></h4>
      <p class="tp-small">${F(summary, '钩子说明') || '说明还没读到'}</p>
      ${preCompact ? `<p class="ag-hook__num">${limit ? `自动压缩线 ${keep(limit)}` : '自动压缩线还没读到'}</p>` : ''}
      ${hook.reason ? `<p class="ag-hook__num">${F(hook.reason)}</p>` : ''}
      ${sample?.text != null ? `<details class="tp-details" id="sample-${esc(hook.host + '-' + hook.key)}"><summary class="live-disclosure">最近一次塞给 AI 的原样 · ${esc(when(sample.at))}</summary><pre>${F(sample.text, '这次塞的内容')}</pre></details>` : ''}</article>`;
  }
  function hookGroups(d, hooks) {
    return HOOK_GROUPS.map(([id, label]) => {
      const rows = hooks.filter(hook => hook.group === id);
      const count = d.hook_coverage?.groups?.[id] ?? rows.length;
      return `<section aria-labelledby="hook-group-${id}"><h3 id="hook-group-${id}" class="tp-sub">${label} · ${int(count)} 条</h3>
        <div class="ag-hooks">${rows.map(hook => hookCard(d, hook)).join('')}</div></section>`;
    }).join('');
  }
  function hooksSection(d) {
    const hooks = inventory(d), hs = d.hook_stats || {}, p = hookPeriod || (hs.periods ? 'all' : '7d');
    const hv = hs.periods ? hs.periods[p] : p === '7d' ? hs : null, totals = hv?.totals || {};
    // 按需更新快核：据规则仓 docs/operations/context-hooks.md 和三家现行设置核改后生效时机。
    const rolloutNote = ['改了钩子以后：', 'Claude 开着的对话', '也会自己换上新的；', 'Codex 要新开的线程', '才用新的，', '已经开着的线程', '一般还用旧的；', 'Antigravity 要完整退出', '再打开才用新的。'].map(keep).join('');
    const top = `<div class="tp-panel__head ag-hookhead"><h2>钩子</h2>${timeSeg('hook', p)}<p class="ag-hooklead">钩子是三家在固定当口自动跑的小程序，次数和耗时由程序自动量。${rolloutNote}</p>${asof(hv?.at || hs.at || d.at) ? `<span class="tp-asof">${esc(asof(hv?.at || hs.at || d.at))}</span>` : ''}</div>`;
    if (!hooks) return `<section class="tp-panel" id="hooks">${top}<p class="tp-empty">钩子清单还没读到。</p></section>`;
    const noOutcome = HOSTS.some(h => totals[h.id]?.runs && totals[h.id].blocked == null && totals[h.id].errors == null);
    const short = HOSTS.some(h => outcomeShort(totals[h.id]));
    const head = HOSTS.map(h => {
      const t = totals[h.id] || {};
      const parts = [`登记 ${int(hostHooks(d, h).length)} 条`, known(t.runs) ? `跑 ${big(t.runs, 'hooks-' + h.id)} 次` : '次数还没采上', known(t.median_ms) && `中位 ${ms(t.median_ms)}`,
        known(t.blocked) && `拦 ${int(t.blocked)} 次`, known(t.errors) && `出错 ${int(t.errors)} 次`];
      const note = outcomeShort(t) ? `拦、错只算记了的 ${keep(`${int(t.blocked_samples)} 次`)}` : '';
      return `<p class="ag-hooktotal${dim(h.id)}" data-host="${h.id}"><span class="tp-hostname">${h.name}</span> ${parts.map(part => `<span>${part || ''}</span>`).join(' ')} <small class="tp-small">${note}</small></p>`;
    }).join('');
    const body = STATIONS.map(([id, label]) => {
      const alerts = id === 'error' ? HOSTS.map(h => { const r = hostData(d, h).error_stop || {}; return `<span data-host="${h.id}"${dimAttr(h.id)}><b class="tp-hostname">${h.name}</b> ${F(r.status) || '没读到'}</span>`; }).join('') : '';
      const open = expanded?.startsWith(id + '/') ? expanded.split('/')[1] : '';
      const host = HOSTS.find(h => h.id === open);
      const detail = host ? hostHooks(d, host).filter(r => stationOf(r) === id).map(hook => hookCard(d, hook, true)).join('') : '';
      return `<tr id="hooks-${id}"><th scope="row">${label}</th>${HOSTS.map(h => hookCell(hooks, id, h, hv, p)).join('')}</tr>
        <tr id="hook-detail-${id}" class="ag-detailrow"${host ? '' : ' hidden'}><td colspan="4">${host ? `<p class="tp-sub">${label} · <span class="tp-hostname" data-host="${host.id}">${host.name}</span></p><div class="ag-hooks">${detail}</div>` : ''}</td></tr>
        ${alerts ? `<tr><th scope="row">推手机</th><td colspan="3" class="ag-errorrow">三家由实况程序统一看对话状态，确认是出错停下了就推手机。<span class="ag-errorhosts">${alerts}</span></td></tr>` : ''}`;
    }).join('');
    return `<section class="tp-panel" id="hooks">${top}
      <div class="ag-hooktotals">${head}</div>${noOutcome ? '<p class="tp-small">拦了几次、出错几次这两样还没采上，先只有次数和耗时。</p>' : ''}${short
        ? '<p class="tp-small">旧日志只记了次数和耗时，没记拦没拦、错没错；拦和错只按记了的那部分算，更早的那部分没采上，不算 0。</p>' : ''}
      <table class="tp-table ag-hooktable"><thead><tr><th scope="col">当口</th>${HOSTS.map(h => `<th scope="col" data-host="${h.id}"${dimAttr(h.id)}><i class="tp-swatch"></i>${h.name}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>
      <p class="tp-small ag-foot">格子越深跑得越多；点开可看这个当口的钩子和最近一次塞给 AI 的原样。</p>${hookGroups(d, hooks)}</section>`;
  }

  // 快讯只列开工和完工，缺 feed 时用本周开工数。
  const WORK_KINDS = new Set(['work_start', 'work_finish']);
  const WORK_UNAVAILABLE = new Map([
    ['本次读不到工期账本。', '三家开工、完工的记录这次没读到，下一轮会自动再读'],
    ['工期账本还未生成。', '三家开工、完工的记录还没生成，有了会出现在这里'],
  ]);
  function feed(d) {
    if (Array.isArray(d.feed)) return d.feed.filter(r => WORK_KINDS.has(r.kind))
      .map(r => ({ at: r.at, actor: U.fieldText(r.actor, viewer), text: U.fieldText(r.text, viewer), href: r.href, tone: r.tone }));
    const thisWeek = HOSTS.map(h => ({ h, w: list(stats(d, h).weeks).at(-1)?.work })).filter(r => r.w?.starts);
    return thisWeek.map(({ h, w }) => ({ actor: h.name, text: `这周开工 ${int(w.starts)} 件，干了 ${hours(w.actual_minutes)} 小时`, href: '#work', tone: 'info' }));
  }

  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    if (!d) {
      // 后台准备逾时或回复 503，正文和快讯一起结束读数提示（M909）。
      const stuck = state?.warming && state.phase === 'slow' || !state?.offline && state?.meta?.status === 503;
      const reading = !stuck && !state?.offline && ['idle', 'wait', 'slow'].includes(state?.phase) && !(state?.meta?.status >= 400);
      T.paint(page.root, stuck ? '<p class="tp-placeholder" role="status">智能体暂时没读到：后台还在准备这一页的数，准备好了这里会自己换上。</p>' : T.placeholder(state, '智能体'));
      page.tick.set(reading ? [{ text: '正在读这一页的读数…' }] : [], { off: true });
      return;
    }
    const headerAt = state.conn ? state.conn.shownAt : !state.offline && state.shownAt;
    const headAt = asof(d.at, headerAt);
    const html = `<div class="tp-head"><div><h1>智能体</h1><p>三家 AI 被管得对不对、估工期准不准、干了多少活，再往下是三家怎么被管：设置和钩子。</p></div>
        <div class="tp-head__side ag-headside">${headAt ? `<span>${esc(headAt)}</span>` : ''}${picker()}</div></div>
      ${T.stateNote(state)}${statusSection(d)}${window.AgentsHours?.html(d, viewer, { only, asof }) || ''}${estimateSection(d)}${workSection(d)}${window.AgentsMoved?.html(d, viewer, { only, chips, asof }) || ''}${configSection(d)}${hooksSection(d)}`;
    T.paint(page.root, html);
    const rows = feed(d), reason = d.work_stats?.unavailable_reason;
    if (reason && !rows.some(row => row.text)) rows.push({ text: WORK_UNAVAILABLE.get(reason) ?? reason });
    page.tick.set(rows, { off: state.offline });
    if (!landed && location.hash === '#hours') {
      const section = document.getElementById('hours');
      // 跨页过渡期间下一帧可能晚于锚点定位。工时区画出来就滚到同一个锚点。
      if (section) {
        section.scrollIntoView({ block: 'start' });
        landed = true;
      }
    } else if (!landed && location.hash) landed = T.reveal(location.hash.slice(1));
  }
  const hookId = location.hash.slice(1);
  let landed = hookId === 'hooks' || STATIONS.some(([id]) => hookId === `hooks-${id}`), pinHooks;
  const page = T.boot({ resource: 'agents', ask: () => '请看实况智能体页：三家规则、钩子和设置有没有对上，工期估得准不准。先用大白话说，别动手。',
    onState(next) { state = next; draw(); pinHooks?.(); } });
  if (landed && performance.getEntriesByType('navigation')[0]?.type !== 'back_forward') {
    const input = new AbortController();
    let timer;
    const stop = () => { input.abort(); observer.disconnect(); clearTimeout(timer); pinHooks = undefined; };
    const align = () => {
      const target = !input.signal.aborted && document.getElementById(hookId);
      if (!target) return;
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      timer ??= setTimeout(stop, 10000);
    };
    const observer = new ResizeObserver(align);
    observer.observe(page.root);
    pinHooks = () => requestAnimationFrame(align);
    addEventListener('pagereveal', e => e.viewTransition?.finished.then(align, align), { once: true, signal: input.signal });
    for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown', 'hashchange', 'pagehide'])
      addEventListener(type, stop, { capture: true, passive: true, signal: input.signal });
  }
  page.root.addEventListener('click', e => {
    const set = e.target.closest('[data-only]'), pick = e.target.closest('[data-pick]');
    if (set || pick) {
      const next = set ? (set.dataset.only === 'all' ? null : set.dataset.only) : only === pick.dataset.pick ? null : pick.dataset.pick;
      if (next === only) return;
      const el = set || pick, sec = el.closest('section[id]');
      const anchor = !sec ? `.tp-head [data-only="${next || 'all'}"]` : el.closest('.ag-mlegend') ? `#${sec.id} .ag-mlegend [data-${set ? 'only' : 'pick'}="${set ? set.dataset.only : pick.dataset.pick}"]` : `#${sec.id} .tp-panel__head`;
      only = next;
      if (only && expanded && expanded.split('/')[1] !== only) expanded = null;   // 别家展开着的钩子格收起来
      T.keep(page.root, anchor, draw);
      return;
    }
    const moved = window.AgentsMoved?.click(e.target);
    if (moved) { T.keep(page.root, moved, draw); return; }
    const cell = e.target.closest('[data-cell]'), seg = e.target.closest('[data-tseg]'), more = e.target.closest('[data-models]');
    if (cell) { expanded = expanded === cell.dataset.cell ? null : cell.dataset.cell; T.keep(page.root, `[data-cell="${cell.dataset.cell}"]`, draw); }
    if (more) { const id = more.dataset.models; modelsOpen.has(id) ? modelsOpen.delete(id) : modelsOpen.add(id); T.keep(page.root, `[data-models="${id}"]`, draw); }
    if (seg) {
      const [key, id] = seg.dataset.tseg.split(':');
      if (key === 'est') estPeriod = id; else if (key === 'work') period = id; else hookPeriod = id;
      T.keep(page.root, `[data-tseg="${seg.dataset.tseg}"]`, draw);
    }
  });
})();

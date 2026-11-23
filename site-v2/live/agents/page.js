// 实况 · 智能体：三家 AI（Claude、Codex、Antigravity）被管得对不对、估工期准不准、干了多少活，再是三家怎么被管（设置和钩子）。
// 本人 11-23 01:19 定的内容（工期“准”按估算程序给的允许范围算、按时另列；干活量和工期放一起；钩子每格写几条、跑几次、多慢、拦几次、错几次）。
// 访客看到的和本人一样，只过全站禁词过滤；数据读 /computer-access/live/v1/agents（候选后台 pcconfig.live-agents.v1）。
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
  const NAMES = { Rules: '核对规则版本', SessionStart: '开场给项目指路', PostCompactRewake: '压缩后接着办', PostCompact: '压缩完成后',
    PreInvocation: '叫模型前补状态', PostInvocation: '模型回完后', UserPromptSubmit: '收到消息时补状态', PreToolUse: '动工具前检查',
    PermissionRequest: '要批准时推手机', AutoReview: '宿主自带审批', PostToolUse: '工具用完补提醒', PreCompact: '压缩前留接续线索',
    SubagentStart: '帮手开场', SubagentStop: '帮手收尾', Stop: '收工检查', Notify: '收工推手机', Keepalive: '空等时叫醒',
    StopFailure: '出错停下', Interrupt: '按停后清审批提醒', PluginStop: '插件的收工回调', PluginInterrupt: '插件的中断回调',
    PluginSubagentStop: '插件的帮手回调', SessionCostStart: '花费面板 · 开场', SessionCostAttach: '花费面板 · 挂到对话',
    SessionCostTurn: '花费面板 · 每轮开始', SessionCostChange: '花费面板 · 更新', SessionCostRender: '花费面板 · 画出来' };
  // 某家宿主没有这个当口时写原因和用什么兜（定稿卡-钩子清单 三家差异表）
  const ABSENT = {
    codex: { idle: '宿主没有空等当口，靠派单完工回执叫醒原对话' },
    antigravity: { message: '宿主没有“收到消息”当口，叫模型前补同样几行', compact: '宿主没有压缩当口，叫模型前每次都递一遍状态',
      helper: '宿主没有派帮手当口，由派单的 AI 把状态写进任务说明', idle: '宿主没有空等当口，靠派单完工回执叫醒原对话' },
  };
  const RULES = new Map([
    ['agents.claude-adapter.md', ['Claude 适配', 'claude-adapter']], ['agents.codex-adapter.md', ['Codex 适配', 'codex-adapter']],
    ['agents.antigravity-adapter.md', ['Antigravity 适配', 'antigravity-adapter']], ['agents.capabilities-runtime.md', ['能力与运行方式', 'capabilities-runtime']],
    ['agents.authorization.md', ['用户授权', 'authorization']], ['agents.protected-actions.md', ['重大动作与本人验证', 'protected-actions']],
    ['agents.privacy-data.md', ['个人资料与数据处理', 'privacy-data']], ['agents.context-sources.md', ['事实来源与任务上下文', 'context-sources']],
    ['agents.engineering-delivery.md', ['工程与交付', 'engineering-delivery']], ['agents.execution-coordination.md', ['分工与并行施工', 'execution-coordination']],
  ]);
  const REASONS = [['larger_orders', '单子比想的大'], ['rework', '返工'], ['missed_follow_up', '漏想的后续活'], ['long_tests', '长测试'], ['scope_added', '中途加需求']];
  const SIZES = [['small', '小单'], ['medium', '中单'], ['large', '大单']];

  let state, viewer = 'public', expanded = null, period = 'all';
  const drawn = new Set();       // 图只在第一次出现时描线、长柱
  const cellsBefore = new Map(); // 钩子格上一轮的次数：变了闪一下
  const F = (v, name) => field(v, viewer, name);
  const hostData = (d, h) => d.hosts?.[h.name] || {};
  const keyOf = hook => String(hook.key || '').replace(/:external$/, '');
  const nameOf = hook => F(hook.title, '钩子名称') || esc(NAMES[keyOf(hook)] || keyOf(hook) || '额外配置的回调');
  const stationOf = hook => STATION_OF[keyOf(hook)] || 'other';
  const firstTime = id => { const fresh = !drawn.has(id); drawn.add(id); return fresh; };

  // —— 一、三家现在管得对不对 ——
  function checks(d, h) {
    const x = hostData(d, h), rows = [];
    const add = (ok, good, bad, extra = {}) => rows.push({ ok, text: ok === false ? bad : good, ...extra });
    const entry = x.entry || {};
    add(entry.current ?? null, `开场读到的规矩是当前版 ${entry.version || ''}`, `开场读到的规矩不是当前版 ${entry.version || ''}`);
    if (h.id !== 'antigravity') {
      const off = x.memory === false && Object.values(x.memory_options || {}).every(v => v !== true);
      add(x.memory === true ? false : x.memory === false ? off : null, '自带记忆关着', '自带记忆开着，和规矩不一样');
    }
    const eager = typeof x.approval === 'string' && /EAGER/.test(x.approval);
    add(x.waits_for_owner === false || eager ? true : x.waits_for_owner === true ? false : null, '动手前不停下等批准', '动手前会停下等批准，和规矩不一样');
    for (const hook of list(d.hooks).filter(row => row.host === h.name)) {
      const name = NAMES[keyOf(hook)] || keyOf(hook);
      if (hook.id) add(Boolean(hook.installed), `钩子「${name}」装着`, `钩子「${name}」定稿要装，还没装上`, { href: `#hooks-${stationOf(hook)}` });
      else if (hook.installed) add(false, '', `钩子「${name}」装着，说明表里没写`, { href: `#hooks-${stationOf(hook)}` });
      if (known(hook.metrics?.errors) && hook.metrics.errors > 0) add(false, '', `钩子「${name}」近 7 天出错 ${hook.metrics.errors} 次`, { href: `#hooks-${stationOf(hook)}` });
    }
    const pass = rows.filter(r => r.ok === true).length, fail = rows.filter(r => r.ok === false), unknown = rows.filter(r => r.ok == null).length;
    return { rows, pass, fail, unknown, total: rows.length };
  }
  function scoreCard(d, h) {
    const c = checks(d, h), x = hostData(d, h), health = list(d.health?.providers).find(p => p.id === h.id) || {};
    const issues = list(health.issues);
    const owner = health.status === 'owner', ignored = health.status === 'ignored';
    const tone = c.fail.length || issues.length ? (owner ? 'owner' : 'repair') : c.unknown ? 'off' : 'ok';
    const word = owner ? `要${T.you(viewer)}看` : c.fail.length ? `差 ${c.fail.length} 处` : c.unknown ? `${c.unknown} 项没读到` : '全对上';
    const ringColor = tone === 'ok' ? T.TONE.ok : tone === 'off' ? T.TONE.off : T.TONE.repair;
    const list1 = issues.length ? issues.map(i => `<li><span class="tp-dot" data-tone="${owner ? 'owner' : 'repair'}"></span><span>${F(i.text)}${i.handler || i.round
        ? `<small>${[i.handler && `${F(i.handler)}在修`, i.round && `第 ${int(i.round)} 轮`].filter(Boolean).join(' · ')}</small>` : ''}</span></li>`).join('')
      : c.fail.map(r => `<li><span class="tp-dot" data-tone="repair"></span><span>${r.href ? `<a href="${esc(r.href)}">${esc(r.text)}</a>` : esc(r.text)}</span></li>`).join('');
    const stats = d.hook_stats?.totals?.[h.id] || {};
    return `<article class="ag-score tp-flashable" data-host="${h.id}">
      <header><span>${h.name}</span><small>${[x.entry?.version && `规矩 ${esc(x.entry.version)}`, known(stats.installed) && `钩子装着 ${stats.installed} 条 · 定稿 ${stats.expected} 条`].filter(Boolean).join(' · ')}</small></header>
      <div class="ag-score__main"><div><p class="ag-score__word" data-tone="${tone}">${word}</p>
        <p class="tp-small">${c.fail.length ? `${c.total} 项里 ${c.pass} 项照规矩` : `${c.total} 项都照规矩`}${ignored ? ` · ${T.you(viewer)}定了不管` : ''}${owner && health.href ? ` · ${link(health.href, '在等你的事里 ›')}` : ''}</p></div>
        ${T.ring(c.pass, c.total, { color: ringColor })}</div>
      ${list1 ? `<ul class="ag-diff">${list1}</ul>` : '<p class="ag-ok">规矩、记忆、审批和钩子都和定稿一样。</p>'}</article>`;
  }
  function statusSection(d) {
    return `<section class="tp-panel" id="status"><div class="tp-panel__head"><h2>三家现在管得对不对</h2><span class="tp-asof">截至 ${esc(when(d.at))}</span></div>
      <div class="tp-grid ag-scores">${HOSTS.map(h => scoreCard(d, h)).join('')}</div></section>`;
  }

  // —— 二、工期准不准 ——
  const stats = (d, h) => d.work_stats?.hosts?.[h.id] || {};
  // 有派单却一件开工都没记下，是采集没采上，不是没干活（本人 11-23 08:11：“我最近肯定是和 antigravity 有对话的”）
  const missing = (d, h) => { const w = stats(d, h).work || {}; return !d.work_stats || w.starts === 0 || w.starts == null; };
  function accuracyColumn(d) {
    return `<div class="ag-acc">${HOSTS.map(h => {
      const e = stats(d, h).estimate || {};
      const body = missing(d, h) || !e.samples ? `<p class="tp-mid" data-tone="off">${esc(missing(d, h) ? '还没采上' : '没有完工记录')}</p>`
        : `<p class="tp-big">${big(e.accuracy * 100, 'acc-' + h.id)}<small>%</small></p><p class="tp-small">按时 <b>${pct(e.on_time)}</b> · ${int(e.samples)} 件</p>`;
      return `<div class="ag-acc__row" data-host="${h.id}"><span class="tp-hostname">${h.name}</span><div>${body}</div></div>`;
    }).join('')}</div>`;
  }
  function ratioPlot(d) {
    const W = 470, H = 214, pad = { l: 46, r: 16, t: 26, b: 28 }, w = W - pad.l - pad.r, h = H - pad.t - pad.b;
    const values = HOSTS.flatMap(hh => SIZES.map(([s]) => stats(d, hh).estimate?.size_ratios?.[s]).filter(r => r?.samples))
      .flatMap(r => [r.actual_over_estimate, r.p75]).filter(known);
    const lo = .4, hi = Math.max(2, Math.ceil((Math.max(...values, 1) + .2) * 2) / 2);
    const x = v => pad.l + (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * w;
    const rowY = i => pad.t + (i + .5) * h / 3;
    let out = `<rect class="tp-band" x="${x(.7)}" y="${pad.t - 6}" width="${x(1.1) - x(.7)}" height="${h + 6}" rx="3"/>
      <line class="tp-bandline" x1="${x(1)}" x2="${x(1)}" y1="${pad.t - 6}" y2="${pad.t + h}"/>
      <text x="${(x(.7) + x(1.1)) / 2}" y="${pad.t - 11}" text-anchor="middle" style="fill:#00813f;font-weight:700">允许范围</text>`;
    for (let v = .5; v <= hi + 1e-9; v += .5) out += `<text x="${x(v)}" y="${H - 8}" text-anchor="middle">${dec(v)}×</text><line class="tp-gridline" x1="${x(v)}" x2="${x(v)}" y1="${pad.t}" y2="${pad.t + h}"/>`;
    SIZES.forEach(([size, label], i) => {
      const y0 = rowY(i);
      out += `<text x="${pad.l - 10}" y="${y0 + 4}" text-anchor="end" style="font-size:12.5px;fill:#3d3d3a;font-weight:700">${label}</text><line class="tp-gridline" x1="${pad.l}" x2="${pad.l + w}" y1="${y0}" y2="${y0}"/>`;
      HOSTS.forEach((hh, j) => {
        const r = stats(d, hh).estimate?.size_ratios?.[size];
        if (!r?.samples || !known(r.actual_over_estimate) || missing(d, hh)) return;
        const y = y0 + (j - 1) * 13, v = r.actual_over_estimate;
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
    const series = HOSTS.filter(h => !missing(d, h)).map(h => ({ color: h.color, values: list(stats(d, h).weeks).map(w => w.estimate?.samples >= 3 ? w.estimate.accuracy : null) }));
    const thin = HOSTS.filter(h => !missing(d, h)).map(h => ({ h, w: list(stats(d, h).weeks).at(-1) })).filter(({ w }) => w && w.estimate?.samples > 0 && w.estimate.samples < 3);
    return labels.length ? T.line({ series, labels, width: 470, height: 214, max: 1, draw: firstTime('trend') })
      + `<p class="tp-small">一周完工不到 3 件的不画点${thin.length ? `：这周 ${thin.map(({ h, w }) => `${h.name} ${w.estimate.samples} 件`).join('、')}` : ''}。</p>` : '<p class="tp-empty">还没有按周的记录。</p>';
  }
  function reasons(d) {
    const hosts = HOSTS.filter(h => !missing(d, h));
    const rows = REASONS.map(([key, label]) => ({ label, parts: hosts.map(h => ({ h, n: stats(d, h).estimate?.overtime_reasons?.[key] || 0 })) }));
    const other = hosts.reduce((s, h) => { const r = stats(d, h).estimate?.overtime_reasons || {}; return s + (r.other || 0) + (r.unknown || 0); }, 0);
    const total = hosts.reduce((s, h) => s + (stats(d, h).estimate?.overtime_reasons?.overdue || 0), 0);
    const max = Math.max(1, ...rows.map(r => r.parts.reduce((s, p) => s + p.n, 0)));
    return `<p class="tp-sub">超时原因 <small>超时共 ${int(total)} 件；“中途加需求”可能和别的原因同时算${other ? `，另有 ${int(other)} 件没写或写了别的原因` : ''}</small></p>
      <div class="tp-bars">${rows.map(r => { const sum = r.parts.reduce((s, p) => s + p.n, 0); return `<div class="tp-bar"><span>${r.label}</span>
        <span class="tp-bar__track"><span class="ag-stack" style="width:${sum / max * 100}%">${r.parts.filter(p => p.n).map(p => `<span class="tp-bar__fill" style="--fill:${p.h.color};flex:${p.n}">${p.n}</span>`).join('')}</span></span>
        <span class="tp-bar__num">${int(sum)}</span></div>`; }).join('')}</div>
      <p class="tp-legend ag-legend">${hosts.map(h => `<span data-host="${h.id}"><i class="tp-swatch"></i>${h.name}</span>`).join('')}</p>`;
  }
  // 三种估法各对上几件。本人 11-23：先别写“谁更准”；原来的“程序 29%”其实是“全按中等大小算”的对照，不是开工时程序真推荐的。
  // 读后台 work_stats.estimate_baselines：{ scope, samples, rows:[{id, hits, samples, basis}], hosts:{<家>:{rows}} }，
  // id 是 all_medium（全按中等大小算的对照）、program_at_start（开工时程序推荐的）、ai_reported（实际报给本人的）。没出数时写“在核”，不下结论。
  const BASES = [['program_at_start', '开工时程序推荐的'], ['ai_reported', `实际报给${'{you}'}的`], ['all_medium', '全按中等大小算（对照）']];
  function compare(d) {
    const b = d.work_stats?.estimate_baselines, rows = list(b?.rows);
    const name = label => label.replace('{you}', T.you(viewer));
    const find = (list_, id) => list(list_).find(r => r.id === id);
    const ready = BASES.every(([id]) => { const r = find(rows, id); return r && known(r.hits) && known(r.samples) && r.samples > 0; });
    if (!ready) {
      return `<p class="tp-sub">三种估法各对上几件 <small>对照口径在核</small></p>
        <div class="ag-bases">${BASES.map(([, label]) => `<p><span>${esc(name(label))}</span><b class="tp-fog">在核</b></p>`).join('')}</div>
        <p class="tp-small">后台正在把这三个数分开算，每个带口径和件数；出数以前不比哪种更准。</p>`;
    }
    const share = r => r.hits / r.samples;
    const bar = ([id, label]) => { const r = find(rows, id);
      return `<div class="ag-base${id === 'all_medium' ? ' is-ref' : ''}"><div class="tp-bar"><span>${esc(name(label))}</span><span class="tp-bar__track"><span class="tp-bar__fill" style="--fill:${id === 'all_medium' ? '#cfcdc5' : '#8f8d85'};width:${share(r) * 100}%"></span></span><span class="tp-bar__num">${int(r.hits)}/${int(r.samples)}</span></div>
        ${r.basis ? `<p class="tp-small">${F(r.basis, '口径')}</p>` : ''}</div>`; };
    const p = find(rows, 'program_at_start'), a = find(rows, 'ai_reported'), gap = a.hits - p.hits;
    const same = p.samples === a.samples, close = same && Math.abs(gap) <= Math.max(2, Math.round(p.samples * .03));
    const say = !same ? `两个数算的件数不一样（${int(p.samples)} 件对 ${int(a.samples)} 件），先不放在一起比。`
      : close ? `开工时程序推荐的和实际报的差不多：${int(p.hits)} 件对 ${int(a.hits)} 件。`
      : `同一批 ${int(p.samples)} 件里，实际报的比程序推荐的${gap > 0 ? '多' : '少'}对上 ${int(Math.abs(gap))} 件（${int(a.hits)} 对 ${int(p.hits)}）。`;
    const per = HOSTS.map(h => ({ h, r: b.hosts?.[h.id]?.rows })).filter(x => BASES.every(([id]) => known(find(x.r, id)?.hits)));
    return `<p class="tp-sub">三种估法各对上几件 <small>${b.scope ? F(b.scope, '口径') : `同一批 ${int(p.samples)} 件`}，落在允许范围内算对上${b.at ? ` · 截至 ${esc(when(b.at))}` : ''}</small></p>
      <div class="tp-bars">${BASES.map(bar).join('')}</div>
      <p class="ag-say">${say}</p>
      ${per.length ? `<p class="tp-small">${per.map(({ h, r }) => `<span data-host="${h.id}" class="tp-hostname">${h.name}</span> ${BASES.map(([id, label]) => `${esc(name(label).replace('（对照）', ''))} ${int(find(r, id).hits)}/${int(find(r, id).samples)}`).join(' · ')}`).join('<br>')}</p>` : ''}
      <p class="tp-small">“全按中等大小算”只是对照：假设每件都按中等估，不是程序开工时真给的数。</p>`;
  }
  function estimateSection(d) {
    const ws = d.work_stats;
    if (!ws) return `<section class="tp-panel" id="estimate"><div class="tp-panel__head"><h2>工期准不准</h2></div><p class="tp-empty">工期账这一轮没读到。</p></section>`;
    if (ws.unavailable_reason) return `<section class="tp-panel" id="estimate"><div class="tp-panel__head"><h2>工期准不准</h2></div><p class="tp-empty">${esc(ws.unavailable_reason)}</p></section>`;
    const weeks = weekLabels(d).length;
    return `<section class="tp-panel" id="estimate"><div class="tp-panel__head"><h2>工期准不准<small>近 ${weeks} 周 · 落在估算程序给的允许范围内才算准，估多估少都算偏</small></h2><span class="tp-asof">截至 ${esc(when(ws.as_of))}</span></div>
      <div class="tp-grid ag-est">
        <div><p class="tp-sub">准的比例</p>${accuracyColumn(d)}</div>
        <div><p class="tp-sub">实际是估的几倍 <small>点在绿带里算准</small></p>${ratioPlot(d)}<p class="tp-small">绿带按估 1 小时以上的画：早 30% 到晚 10% 都算准；1 小时以内的单子是早 15 分钟到晚 5 分钟。</p></div>
        <div><p class="tp-sub">按周走势</p>${trend(d)}</div>
      </div>
      <div class="tp-grid ag-est2"><div>${reasons(d)}</div><div>${compare(d)}</div></div></section>`;
  }

  // —— 三、三家各干了多少活（和工期放一起） ——
  const MODEL = id => {
    const m = /^(claude|gpt|gemini)-(.+)$/.exec(String(id || ''));
    if (!m) return String(id || '');
    if (m[1] === 'claude') { const [name, ...v] = m[2].split('-'); return `${name[0].toUpperCase()}${name.slice(1)} ${v.join('.')}`; }
    if (m[1] === 'gpt') { const [ver, ...name] = m[2].split('-'); return `GPT-${ver} ${name.map(s => s[0].toUpperCase() + s.slice(1)).join(' ')}`; }
    return 'Gemini ' + m[2].split('-').map(s => /^\d/.test(s) ? s : s[0].toUpperCase() + s.slice(1)).join(' ');
  };
  const summaryModel = row => /^gpt-6-luna$/.test(row.model) && row.effort === 'low';
  function workFor(d, h) {
    const s = stats(d, h);
    if (period === 'all') return s.work || {};
    return list(s.weeks).find(w => w.week_start === period)?.work || {};
  }
  function workCard(d, h) {
    const w = workFor(d, h), lost = missing(d, h);
    const models = list(w.models).filter(m => !summaryModel(m)).sort((a, b) => b.count - a.count);
    const orders = known(w.work_orders) ? w.work_orders : known(w.orders) ? w.orders - list(w.models).filter(summaryModel).reduce((s, m) => s + m.count, 0) : null;
    const cell = (label, value, unit, key, fmt) => `<div class="ag-work__row"><span>${label}</span>${lost && key !== 'orders' ? `<b class="tp-fog">还没采上</b>`
      : known(value) ? `<b class="tp-mid">${big(value, `work-${h.id}-${key}-${period}`, fmt)}<small>${unit}</small></b>` : `<b class="tp-fog">没读到</b>`}</div>`;
    return `<article class="ag-work" data-host="${h.id}"><header>${h.name}</header>
      ${cell('开工', w.starts, '件', 'starts')}${cell('总工时', known(w.actual_minutes) ? w.actual_minutes / 60 : null, '小时', 'hours', 'dec')}${cell('派出去', orders, '单', 'orders')}
      <p class="ag-models">${models.slice(0, 4).map(m => `<span class="tp-pill">${esc(MODEL(m.model))} · ${esc(m.effort)} <b>${int(m.count)}</b></span>`).join('') || '<span class="tp-muted">没有派单</span>'}${models.length > 4 ? `<span class="tp-pill">另 ${models.length - 4} 种</span>` : ''}</p>
      ${lost ? '<p class="tp-small">开工和工时这一家还没采上，派单数是派活工具记的。</p>' : ''}</article>`;
  }
  function workSection(d) {
    const ws = d.work_stats;
    if (!ws || ws.unavailable_reason) return '';
    const weeks = list(stats(d, HOSTS[0]).weeks), labels = weekLabels(d);
    if (period !== 'all' && !weeks.some(w => w.week_start === period)) period = 'all';
    const first = weeks[0]?.week_start;
    const seg = `<div class="tp-seg" role="group" aria-label="看哪一段">${[['all', first ? `全部 · ${T.day(first + 'T00:00:00+08:00')} 起` : '全部'], ...weeks.map((w, i) => [w.week_start, labels[i]])]
      .map(([id, label]) => `<button type="button" data-period="${esc(id)}" aria-pressed="${period === id}">${esc(label)}</button>`).join('')}</div>`;
    const rows = weeks.map((w, i) => ({ label: labels[i], parts: HOSTS.filter(h => !missing(d, h)).map(h => ({ color: h.color, value: (list(stats(d, h).weeks)[i]?.work?.actual_minutes || 0) / 60 })) }));
    const highlight = period === 'all' ? -1 : weeks.findIndex(w => w.week_start === period);
    return `<section class="tp-panel" id="work"><div class="tp-panel__head"><h2>三家各干了多少活<small>按每次开工算，派出去的单不算摘一句</small></h2>${seg}</div>
      <div class="tp-grid ag-workgrid"><div class="tp-grid ag-works">${HOSTS.map(h => workCard(d, h)).join('')}</div>
      <div><p class="tp-sub">按周比 · 工时（小时）</p>${columns(rows, highlight)}<p class="tp-legend">${HOSTS.filter(h => !missing(d, h)).map(h => `<span data-host="${h.id}"><i class="tp-swatch"></i>${h.name}</span>`).join('')}</p></div></div></section>`;
  }
  const columns = (rows, highlight) => T.columns({ rows, width: 440, height: 236, fmt: v => v >= 10 ? int(v) : dec(v), grow: firstTime('cols'), highlight });

  // —— 四、开场和接续 · 动手和权限 ——
  function row(label, cells, { diff = [], note = '' } = {}) {
    // 相邻三家一样的合成一格只写一次
    const out = [];
    cells.forEach((c, i) => { const last = out.at(-1); if (last && last.html === c && !diff[i] && !last.diff) last.span++; else out.push({ html: c, span: 1, diff: diff[i] }); });
    return `<tr><th scope="row">${label}${note ? `<small>${note}</small>` : ''}</th>${out.map(c => `<td${c.span > 1 ? ` colspan="${c.span}" class="is-same"` : c.diff ? ' class="is-diff"' : ''}>${c.span === 3 ? '三家一样：' : c.span === 2 ? '' : ''}${c.html}</td>`).join('')}</tr>`;
  }
  function configSection(d) {
    const x = h => hostData(d, h);
    const entries = HOSTS.map(h => x(h).entry || {});
    const tools = h => Array.isArray(x(h).tools) ? (x(h).tools.length ? x(h).tools.map(t => F(t.name)).join('、') : '没有') : '没读到';
    const unlock = h => { const t = U.fieldText(d.unlock?.[h.name], viewer); return t ? esc(t.replace(/^已登记的 ?(Claude|Codex|Antigravity) ?桌面版/, '已登记的桌面版').replace(/^(Claude|Codex|Antigravity) ?/, '')) : '没读到'; };
    const memory = h => h.id === 'antigravity' ? `无法设置${known(x(h).knowledge?.count) ? `<small>知识目录 ${int(x(h).knowledge.count)} 条${x(h).knowledge.latest_write_day ? '，最近 ' + esc(x(h).knowledge.latest_write_day) + ' 写' : ''}</small>` : ''}`
      : x(h).memory === false ? '关着' : x(h).memory === true ? '开着，和规矩不一样' : '没读到';
    const compact = h => h.id === 'claude' ? (x(h).compact_percent ? `上下文用到 ${esc(x(h).compact_percent)}% 就压缩` : '没读到')
      : h.id === 'codex' ? (known(x(h).compact_tokens) ? `到 ${dec(x(h).compact_tokens / 10000)} 万 token 压缩${known(x(h).context_window) ? `<small>配的窗口是 ${dec(x(h).context_window / 10000)} 万，压缩线更低</small>` : ''}` : '没读到')
      : '无法设置<small>宿主不公开压缩线，也没有压缩当口</small>';
    const waits = HOSTS.map(h => x(h).waits_for_owner === false || /EAGER/.test(String(x(h).approval || '')));
    const version = entries.map(e => e.current === true ? `${esc(e.version || '')} 当前版` : e.current === false ? `不是当前版 ${esc(e.version || '')}` : '没读到');
    const rows = [
      row('开场先读的规矩', version, { diff: entries.map(e => e.current === false) }),
      row('入口规则多少字', entries.map(e => known(e.characters) ? `${int(e.characters)} 字` : '没读到')),
      row('自带记忆', HOSTS.map(memory), { diff: HOSTS.map(h => x(h).memory === true) }),
      row('对话装多满会压缩', HOSTS.map(compact)),
      row('动手前停不停下等批准', HOSTS.map((h, i) => waits[i] ? `不停，直接动手${link('#hooks-pre-tool', '要拦的几样在钩子“动工具前” ›')}` : '会停下等批准'),
        { diff: waits.map(w => !w) }),
      row('谁能自己解开资料锁', HOSTS.map(unlock), { note: link('/rules/topic-authorization.html', '规则 ›') }),
      row('多接的工具', HOSTS.map(tools), { note: '电脑接口、Google 以外，能点名用的' }),
    ];
    const codexReview = x(HOSTS[1]).reviewer === 'auto_review';
    return `<section class="tp-panel" id="settings"><div class="tp-panel__head"><h2>开场和接续 · 动手和权限<small>三家一样的合成一格，不一样的标黄</small></h2><span class="tp-asof">截至 ${esc(when(d.at))}</span></div>
      <table class="tp-table ag-config"><thead><tr><th scope="col">项目</th>${HOSTS.map(h => `<th scope="col" data-host="${h.id}"><i class="tp-swatch"></i>${h.name}</th>`).join('')}</tr></thead>
      <tbody>${rows.join('')}</tbody></table>
      <p class="tp-small ag-foot">${codexReview ? 'Codex 遇到要批准的，由它自带的审核模型代批，不找人。' : ''}规矩原文在${link('/rules/', '规则页 ›')}</p></section>`;
  }

  // —— 五、钩子 ——
  function hookCell(d, station, h) {
    const cell = d.hook_stats?.cells?.[station]?.[h.id] || {}, hooks = list(d.hooks).filter(r => r.host === h.name && stationOf(r) === station);
    const total = list(Object.values(d.hook_stats?.cells || {})).map(c => c?.[h.id]?.runs).filter(known);
    const max = Math.max(1, ...HOSTS.flatMap(hh => STATIONS.map(([s]) => d.hook_stats?.cells?.[s]?.[hh.id]?.runs).filter(known)));
    if (!hooks.length) {
      const why = ABSENT[h.id]?.[station] || (station === 'compact' && h.id === 'antigravity' && U.fieldText(hostData(d, h).unavailable_hooks?.pre_compact, viewer)) || '这个当口没装钩子';
      return `<td class="ag-heat ag-heat--none">${esc(why)}</td>`;
    }
    const heat = known(cell.runs) && cell.runs > 0 ? Math.log10(cell.runs + 1) / Math.log10(max + 1) : 0;
    const key = `${station}/${h.id}`, before = cellsBefore.get(key);
    const flash = before != null && before !== cell.runs ? ' tp-flash' : '';
    cellsBefore.set(key, cell.runs);
    const runs = known(cell.runs) ? `${int(cell.runs)} 次` : '次数还没采上';
    const badges = [known(cell.blocked) && cell.blocked > 0 && `<span class="ag-badge" data-tone="repair">拦 ${int(cell.blocked)}</span>`,
      known(cell.errors) && cell.errors > 0 && `<span class="ag-badge" data-tone="bad">错 ${int(cell.errors)}</span>`].filter(Boolean).join('');
    void total;
    return `<td class="ag-heat${flash}" style="--heat:${(.05 + heat * .38).toFixed(3)}" data-host="${h.id}"><button type="button" data-cell="${key}" aria-expanded="${expanded === key}" aria-controls="hook-detail-${station}">
      <span>${hooks.length} 条 · ${runs}${known(cell.median_ms) ? ` · ${ms(cell.median_ms)}` : ''}</span>${badges}<span class="tp-chev" aria-hidden="true">${expanded === key ? '收起' : ''}</span></button></td>`;
  }
  function ruleLink(rule) {
    const base = typeof rule === 'string' ? rule.split('/').at(-1) : '';
    const [label, slug] = RULES.get(base) || [];
    return slug ? link(`/rules/topic-${slug}.html`, esc(label) + ' ›') : rule ? F(rule) : '';
  }
  function hookDetail(d, hook) {
    const m = hook.metrics || {}, sample = list(d.latest_context).find(r => r.host === hook.host && r.hook === hook.key);
    const facts = [['什么时候跑', F(hook.when)], ['干什么', F(hook.what)], ['往 AI 眼前塞多少字', F(hook.char_count)], ['会不会拦、让 AI 多跑一轮', F(hook.blocking)],
      ['坏了会怎样', F(hook.failure)], ['归哪条规矩、怎么关', [ruleLink(hook.rule), F(hook.disable)].filter(Boolean).join(' · ')]];
    const numbers = hook.metrics ? [known(m.runs) && `跑 ${int(m.runs)} 次`, known(m.median_ms) && `中位 ${ms(m.median_ms)}`, known(m.max_ms) && `最慢 ${ms(m.max_ms)}`,
      known(m.blocked) ? `拦 ${int(m.blocked)} 次` : !known(m.errors) && '拦和错还没采上', known(m.errors) && `出错 ${int(m.errors)} 次`,
      known(m.continued) && `让 AI 多跑 ${int(m.continued)} 轮`].filter(Boolean).join(' · ') : F(hook.metrics_state) || '近 7 天没有运行记录';
    const tag = hook.id ? (hook.installed ? (hook.enabled === false ? '<span class="tp-tag" data-tone="soft">装着，平时不跑</span>' : '<span class="tp-tag" data-tone="ok">装着</span>')
      : '<span class="tp-tag" data-tone="repair">定稿要装，还没装上</span>') : '<span class="tp-tag" data-tone="repair">装着，说明表里没写</span>';
    return `<article class="ag-hook" data-host="${String(hook.host || '').toLowerCase()}"><h3>${nameOf(hook)} ${tag}</h3>
      <dl>${facts.filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <p class="ag-hook__num">近 7 天 · ${numbers}</p>
      ${sample?.text != null ? `<details class="tp-details" id="sample-${esc(hook.host + '-' + hook.key)}"><summary>最近一次塞给 AI 的原样 · ${esc(when(sample.at))}</summary><pre>${F(sample.text, '这次塞的内容')}</pre></details>` : ''}</article>`;
  }
  function hooksSection(d) {
    const hs = d.hook_stats || {}, totals = hs.totals || {};
    const noOutcome = HOSTS.some(h => totals[h.id]?.runs && totals[h.id].blocked == null && totals[h.id].errors == null);
    const head = HOSTS.map(h => {
      const t = totals[h.id] || {};
      const parts = [`${int(t.hooks)} 条`, known(t.runs) ? `跑 ${big(t.runs, 'hooks-' + h.id)} 次` : '次数还没采上', known(t.median_ms) && `中位 ${ms(t.median_ms)}`,
        known(t.blocked) ? `拦 ${int(t.blocked)} 次` : '', known(t.errors) ? `出错 ${int(t.errors)} 次` : ''].filter(Boolean);
      return `<p class="ag-hooktotal" data-host="${h.id}"><span class="tp-hostname">${h.name}</span>${parts.join(' · ')}</p>`;
    }).join('');
    const body = STATIONS.map(([id, label]) => {
      if (id === 'error') {
        const rows = HOSTS.map(h => { const r = hostData(d, h).error_stop || {}; return `<span data-host="${h.id}"><b class="tp-hostname">${h.name}</b> ${F(r.status) || '没读到'}</span>`; }).join('');
        return `<tr id="hooks-error"><th scope="row">${label}<small>推手机</small></th><td colspan="3" class="ag-errorrow">三家由实况程序统一看对话状态，确认是出错停下了就推手机，不算哪一家的钩子。<span class="ag-errorhosts">${rows}</span></td></tr>`;
      }
      const open = expanded?.startsWith(id + '/') ? expanded.split('/')[1] : '';
      const host = HOSTS.find(h => h.id === open);
      const detail = host ? list(d.hooks).filter(r => r.host === host.name && stationOf(r) === id).map(hook => hookDetail(d, hook)).join('') : '';
      return `<tr id="hooks-${id}"><th scope="row">${label}</th>${HOSTS.map(h => hookCell(d, id, h)).join('')}</tr>
        <tr id="hook-detail-${id}" class="ag-detailrow"${host ? '' : ' hidden'}><td colspan="4">${host ? `<p class="tp-sub">${label} · <span class="tp-hostname" data-host="${host.id}">${host.name}</span> <small>每条答六问；数是近 7 天</small></p><div class="ag-hooks">${detail}</div>` : ''}</td></tr>`;
    }).join('');
    return `<section class="tp-panel" id="hooks"><div class="tp-panel__head"><h2>钩子<small>近 7 天 · 钩子是三家在固定当口自动跑的小程序，次数和耗时由程序自动量</small></h2><span class="tp-asof">截至 ${esc(when(hs.at || d.at))}</span></div>
      <div class="ag-hooktotals">${head}</div>${noOutcome ? '<p class="tp-small">拦了几次、出错几次这两样还没采上，先只有次数和耗时。</p>' : ''}
      <table class="tp-table ag-hooktable"><thead><tr><th scope="col">当口</th>${HOSTS.map(h => `<th scope="col" data-host="${h.id}"><i class="tp-swatch"></i>${h.name}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>
      <p class="tp-small ag-foot">格子越深跑得越多；点开一格看这家在这个当口的每条钩子、六问和最近一次塞给 AI 的原样。</p></section>`;
  }

  // —— 快讯：后台出 feed 就用；没出先拿这页已有的数拼 ——
  function feed(d) {
    if (Array.isArray(d.feed)) return d.feed.map(r => ({ at: r.at, actor: U.fieldText(r.actor, viewer), text: U.fieldText(r.text, viewer), href: r.href, tone: r.tone }));
    const rows = [];
    for (const r of list(d.latest_context)) rows.push({ at: r.at, actor: r.host, text: `${NAMES[r.hook] || r.hook} 往 AI 眼前递了 ${int(String(r.text || '').length)} 字`, href: `#hooks-${STATION_OF[r.hook] || 'other'}`, tone: 'info' });
    for (const p of list(d.health?.providers)) for (const i of list(p.issues)) rows.push({ actor: p.name, text: `${U.fieldText(i.text, viewer)}${i.handler ? ` · ${U.fieldText(i.handler, viewer)}在修` : ''}`, tone: 'repair', html: '' });
    const e = HOSTS.filter(h => !missing(d, h)).map(h => ({ h, e: stats(d, h).estimate || {} }));
    for (const { h, e: x } of e) if (x.samples) rows.push({ actor: h.name, html: `估得准 <em>${pct(x.accuracy)}</em> · 按时 ${pct(x.on_time)} · ${int(x.samples)} 件`, href: '#estimate', tone: x.accuracy >= .5 ? 'ok' : 'repair' });
    for (const h of HOSTS) {
      const c = checks(d, h);
      rows.push({ actor: h.name, html: c.fail.length ? `<em>差 ${c.fail.length} 处</em> · ${esc(c.fail[0].text)}` : `<em>全对上</em> · ${c.total} 项照规矩`, href: '#status', tone: c.fail.length ? 'repair' : 'ok' });
      const t = d.hook_stats?.totals?.[h.id];
      if (known(t?.runs)) rows.push({ actor: h.name, text: `钩子近 7 天跑 ${int(t.runs)} 次，中位 ${ms(t.median_ms)}`, href: '#hooks', tone: 'info' });
    }
    const thisWeek = HOSTS.map(h => ({ h, w: list(stats(d, h).weeks).at(-1)?.work })).filter(r => r.w?.starts);
    for (const { h, w } of thisWeek) rows.push({ actor: h.name, text: `这周开工 ${int(w.starts)} 件，干了 ${hours(w.actual_minutes)} 小时`, href: '#work', tone: 'info' });
    return rows.sort((a, b) => (T.stamp(b.at) || 0) - (T.stamp(a.at) || 0));
  }

  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    if (!d) { T.paint(page.root, T.placeholder(state, '智能体')); page.tick.set([], { off: true }); return; }
    const html = `<div class="tp-head"><div><h1>智能体</h1><p>三家 AI 被管得对不对、估工期准不准、干了多少活，再往下是三家怎么被管：设置和钩子。</p></div>
        <p class="tp-head__side"><span>截至 ${esc(when(d.at))}</span>${HOSTS.map(h => `<span data-host="${h.id}"><i class="tp-swatch"></i>${h.name}</span>`).join('')}</p></div>
      ${T.stateNote(state)}${statusSection(d)}${estimateSection(d)}${workSection(d)}${configSection(d)}${hooksSection(d)}`;
    T.paint(page.root, html);
    page.tick.set(feed(d), { off: state.offline });
    if (!landed && location.hash) landed = T.reveal(location.hash.slice(1));
  }
  let landed = false;
  const page = T.boot({ resource: 'agents', ask: () => '请看实况智能体页：三家规则、钩子和设置有没有对上，工期估得准不准。先用大白话说，别动手。',
    onState(next) { state = next; draw(); } });
  page.root.addEventListener('click', e => {
    const cell = e.target.closest('[data-cell]'), seg = e.target.closest('[data-period]');
    if (cell) { expanded = expanded === cell.dataset.cell ? null : cell.dataset.cell; T.keep(page.root, `[data-cell="${cell.dataset.cell}"]`, draw); }
    if (seg) { period = seg.dataset.period; T.keep(page.root, `[data-period="${seg.dataset.period}"]`, draw); }
  });
})();

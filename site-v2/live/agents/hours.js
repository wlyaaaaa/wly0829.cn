// 三家实际工时来自 /agents 的 work_stats.today.activity，与 /home 同源。家别跟整页，时段独立。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, { esc } = U;
  const { HOSTS, known } = T;
  const DEFAULT_PERIOD = 'all';   // 打开时选哪一段：本人定默认“全部”，要改只改这一处
  const PERIODS = [['today', '今天'], ['d7', '近 7 天'], ['d30', '近 30 天'], ['all', '全部']];
  const KINDS = [['conversation', '普通对话'], ['subagent', '子代理'], ['automatic', '自动任务']];
  const ALL = { id: 'all', name: '全部', color: '#00a650' };
  // 从首页智能体卡“今天三家干了 N 小时”点进来带 ?hours=today：先选“今天”，和首页那个数对得上；直接打开照旧是默认
  const asked = new URLSearchParams(location.search).get('hours');
  let period = PERIODS.some(([id]) => id === asked) ? asked : DEFAULT_PERIOD, last = null, lastOnly, grow = true;

  const sum = values => values.reduce((total, value) => total + (value ?? 0), 0);
  const hrs = (n, raw) => n === 0 && raw === 0 ? '0' : (n / 10).toLocaleString('zh-CN', { minimumFractionDigits: n < 1000 ? 1 : 0, maximumFractionDigits: 1 });
  const fog = '<span class="tp-fog">没读到</span>';
  // 某一家（或全部）这一段：合计、三类、没分出类的。家里合计读到了、某一类后台没给数，就是这一类没有，算 0
  function scope(x, hosts = []) {
    const total = known(x?.actual_minutes) ? x.actual_minutes : null, split = x?.by_activity && typeof x.by_activity === 'object';
    const kinds = Object.fromEntries(KINDS.map(([k]) => {
      const v = x?.by_activity?.[k]?.actual_minutes;
      return [k, total == null || !split ? null : known(v) ? v : 0];
    }));
    const rest = total == null ? 0 : !split ? total : known(x.unclassified_minutes) ? x.unclassified_minutes : 0;
    // 先把分项舍入到十分之一小时，横加再竖加。图长和平均并行数仍用后台分钟数。
    const parts = Object.fromEntries(Object.entries({ ...kinds, rest }).map(([k, v]) =>
      [k, v == null ? null : hosts.length ? sum(hosts.map(host => host.parts[k])) : Math.round(v / 6)]));
    const display = split ? sum(Object.values(parts)) : Math.round(total / 6);
    return { total, kinds, rest, split, parts, display, running: known(x?.in_progress) ? x.in_progress : 0, missing: known(x?.missing_timing) ? x.missing_timing : 0 };
  }
  function model(d) {
    const a = d.work_stats?.today?.activity;
    if (!a || typeof a !== 'object') return null;
    const periods = a.periods && typeof a.periods === 'object' ? a.periods : { today: a };   // 旧回包只有今天
    return { periods, earliest: Object.values(periods).map(p => p?.earliest_record_at).find(Boolean) || null, source: a.chat_source_at || null };
  }

  const segs = (s, color) => [...KINDS.map(([k, label], i) => ({ k, label, v: s.kinds[k] || 0, i })), { k: 'rest', label: '没分出类', v: s.rest, i: 3 }]
    .filter(x => x.v > 0).map(x => ({ ...x, color }));
  // 横轴刻度：每格取好读的数（1、2、2.5、5 乘 10 的几次方），分到刚好盖住最长那条，一般 4 到 5 格，最长的那条不会只占一半
  function axis(max) {
    const step = T.niceMax(Math.max(max / 60, 1) / 5), n = Math.max(4, Math.ceil(max / 60 / step - 1e-9));
    return { max: step * n * 60, ticks: Array.from({ length: n + 1 }, (_, i) => step * i) };
  }
  function bars(rows, title) {
    const { max, ticks } = axis(Math.max(...rows.map(r => r.s.total || 0)));
    const pct = m => `${Math.min(100, m / max * 100)}%`;
    const line = r => {
      const parts = segs(r.s, r.h.color);
      const pick = r.h.id === 'all' ? 'data-only="all"' : `data-pick="${r.h.id}"`;
      const hours = hrs(r.s.display, r.s.total), value = r.s.total == null ? fog : `<b>${esc(hours)}</b>`;
      return `<button type="button" class="ag-hbar${r.h.id === 'all' ? ' is-all' : ''}" ${pick} style="--host:${r.h.color}" aria-label="${esc(`${title(r.h)} ${r.s.total == null ? '没读到' : hours + ' 小时'}`)}">
        <span class="ag-hbar__name">${esc(r.h.name)}</span>
        <span class="ag-hbar__track"><span class="ag-hbar__fill${grow ? ' is-grow' : ''}" style="width:${r.s.total ? pct(r.s.total) : '0%'}">${parts.map(x =>
          `<i class="ag-hseg" data-kind="${x.k}" style="flex:${x.v}" title="${esc(`${r.h.name} · ${x.label} ${hrs(r.s.parts[x.k], x.v)} 小时`)}"></i>`).join('')}</span>
          <span class="ag-hbar__num" style="left:${r.s.total ? pct(r.s.total) : '0%'}">${value}</span></span></button>`;
    };
    const grid = ticks.map(t => `<i class="ag-hgrid" style="left:${t / (max / 60) * 100}%"><span>${esc(T.dec(t))}</span></i>`).join('');
    return `<div class="ag-hchart"><div class="ag-hplot"><div class="ag-hgrids" aria-hidden="true">${grid}</div>${rows.map(line).join('')}</div>
      <p class="ag-hunit" aria-hidden="true">小时</p></div>`;
  }
  // 行名点了去哪（本人 11-25 23:15 选 A，照 L-agents-v3）：普通对话、子代理去 AI 对话页，自动任务去自动任务页；行名黑字后面一个灰“›”
  const ROW_HREF = { conversation: '/live/chats/', subagent: '/live/chats/', automatic: '/live/automation/' };
  function table(cols, rest) {
    const cell = (s, k) => s.total == null || (k !== 'total' && (!s.split || s.parts[k] == null)) ? fog
      : esc(k === 'total' ? hrs(s.display, s.total) : hrs(s.parts[k], k === 'rest' ? s.rest : s.kinds[k]));
    const head = cols.map(c => `<th scope="col" class="${c.h.id === 'all' ? 'is-all' : ''}" style="--host:${c.h.color}"><button type="button" class="ag-hpick" ${c.h.id === 'all' ? 'data-only="all"' : `data-pick="${c.h.id}"`}>${c.h.id === 'all' ? '' : '<i class="tp-swatch"></i>'}${esc(c.h.name)}</button></th>`).join('');
    const name = (k, label) => ROW_HREF[k] ? `<a class="ag-hrowlink" href="${ROW_HREF[k]}">${label}<span aria-hidden="true">›</span></a>` : label;
    const row = ([k, label]) => `<tr${k === 'total' ? ' class="is-sum"' : ''}><th scope="row">${name(k, label)}</th>${cols.map(c => `<td class="${c.h.id === 'all' ? 'is-all' : ''}">${cell(c.s, k)}</td>`).join('')}</tr>`;
    return `<table class="tp-table ag-htable"><thead><tr><th scope="col">类别</th>${head}</tr></thead><tbody>${[...KINDS, ...(rest ? [['rest', '没分出类']] : []), ['total', '合计']].map(row).join('')}</tbody></table>`;
  }

  function render(d, viewer, only) {
    if (only !== lastOnly) { grow = true; lastOnly = only; }
    const m = model(d), p = m?.periods?.[period];
    const host = only ? HOSTS.find(h => h.id === only) : null;
    const who = host ? ` ${host.name} ` : '三家';
    const since = m?.earliest ? `${T.day(m.earliest)} 起` : '一共';
    const lead = period === 'all' ? since : PERIODS.find(x => x[0] === period)[1];
    const title = `${lead}${who}干了多少`.replace(/\s+干/, ' 干');
    const seg = `<div class="tp-seg ag-hseg-pick" role="group" aria-label="看哪一段">${PERIODS.map(([id, label]) =>
      `<button type="button" data-hperiod="${id}" aria-pressed="${period === id}">${label}</button>`).join('')}</div>`;
    // 工时来自独立汇总，跟本页顶栏碰巧同一分钟也要保留自己的“截至”。
    // “几号起才有记录”只在选的这一段起点早于最早一条记录时写；“全部”标题里已写从哪天起，记录全了、判断不了都不写（本人 11-25 16:30，M911）
    const first = p?.earliest_record_at || m?.earliest, gap = period !== 'all' && Date.parse(p?.window_start) < Date.parse(first);
    // 对话、帮手的记录（chat_source_at）比“截至”早 10 分钟以上：这之后对话和帮手干的还没算进来，照实写读到几点，不让旧数冒充新的
    const lag = m?.source && p?.as_of && Date.parse(p.as_of) - Date.parse(m.source) > 6e5 ? `对话和帮手只记到 ${T.when(m.source)}` : '';
    const asof = [p?.as_of && (last?.asof ? last.asof(p.as_of) : `截至 ${T.when(p.as_of)}`), lag, gap && `${T.day(first)} 起才有记录`].filter(Boolean).join(' · ');
    const head = `<div class="tp-panel__head ag-hhead"><h2>${esc(title)}<small>三家实际在干的时间，同时在干的叠加算，没做完的算到此刻</small></h2>
      <div class="ag-hside">${seg}${asof ? `<span class="tp-asof">${esc(asof)}</span>` : ''}</div></div>`;
    grow = grow && !!p;
    let body;
    if (!m) body = '<p class="tp-empty">工时这一轮没读到。</p>';
    else if (!p) body = `<p class="tp-empty">${esc(PERIODS.find(x => x[0] === period)[1])}的工时后台还没送来，先看“今天”。</p>`;
    else {
      const cols = (host ? [host] : HOSTS).map(h => ({ h, s: scope(p.hosts?.[h.id]) }));
      const measured = cols.map(c => c.s).filter(s => s.total != null);
      if (!host) cols.push({ h: ALL, s: scope(p.total, measured.every(s => s.split) ? measured : []) });
      const rows = host ? cols : [cols.at(-1), ...cols.slice(0, -1)];
      const mine = host ? cols[0].s : cols.at(-1).s;
      const anyRest = rows.some(r => r.s.rest > 0);
      const key = ([kind, label]) => `<span><span class="ag-hswatches">${rows.map(({ h }) =>
        `<i class="ag-hseg" data-kind="${kind}" style="--host:${h.color}"></i>`).join('')}</span>${label}</span>`;
      const legend = `<p class="ag-hlegend" aria-hidden="true">${KINDS.map(key).join('')}${anyRest ? key(['rest', '没分出类']) : ''}</p>`;
      const span = (Date.parse(p.as_of) - Date.parse(period === 'all' ? first || p.window_start : p.window_start)) / 3600000;
      const one = v => v < 10 ? T.dec(Math.round(v * 10) / 10) : T.int(Math.round(v));
      const notes = [
        mine.total > 0 && span >= .25 && `这 ${one(span)} 小时里平均同时 ${one(mine.total / 60 / span)} 个在干`,
        mine.kinds.automatic > 0 && '自动任务这一行比自动任务页的数多：这里还算了各家自带的定时和后台程序开的对话，自动任务页只算登记的每次调用',
        mine.total != null && !mine.split && '这一段后台还没分出普通对话、子代理、自动任务，只有合计',
        mine.running > 0 && `现在还在干的 ${T.int(mine.running)} 件算到此刻`,
        mine.missing > 0 && `另有 ${T.int(mine.missing)} 段没记下开始或结束的时刻，没算进来`,
      ].filter(Boolean);
      body = `<div class="tp-grid ag-hgrid-wrap${host ? ' is-one' : ''}"><div>${table(cols, cols.some(({ s }) => s.split && s.rest > 0))}</div><div>${bars(rows, h => `${title} · ${h.name}`)}${legend}</div></div>
        ${notes.length ? `<p class="tp-small ag-hnote">${esc(notes.join('；'))}。</p>` : ''}`;
    }
    grow = false;
    return `<section class="tp-panel ag-hours" id="hours">${head}${body}</section>`;
  }

  window.AgentsHours = {
    html(d, viewer, opts = {}) { last = { d, viewer, only: opts.only || null, asof: opts.asof || null }; return render(d, viewer, last.only); },
  };
  // 切时间段只重画这一块；页面每轮读数整页重画时照记着的时间段画
  document.addEventListener('click', e => {
    const b = e.target.closest?.('[data-hperiod]'), sec = document.getElementById('hours');
    if (!b || !last || !sec || !sec.contains(b) || b.dataset.hperiod === period) return;
    period = b.dataset.hperiod; grow = true;
    sec.outerHTML = render(last.d, last.viewer, last.only);
    const again = document.getElementById('hours');
    T.count(again);
    again.querySelector(`[data-hperiod="${period}"]`)?.focus({ preventScroll: true });
  });
})();

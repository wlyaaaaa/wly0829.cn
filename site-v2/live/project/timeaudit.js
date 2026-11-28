// 电脑心电图（/live/project/?id=timeaudit）自己的几块；page.js 只在四处接进来：adapt 改这一页的数据、board 加卡、columns 定卡放哪一栏、noArtifacts 不画通用“最近产物”卡。
// 本人 11-27 21:59 选的乙稿：页头和那排读数照现有；下面三张（记全了吗／新到哪儿／卡顿留现场）、通栏“攒了多少、能翻回多早”、
// 两张一排（近 24 小时整机测量／占多大地方、留下的看板／剪贴板），最后一排“最近改动”（page.js 画）＋“去哪看细节”。
// 原来六张通用卡（攒了多少／占多大地方／记得全不全／留下的成品／卡顿留现场／更多数据）里的每个数都并进了这几张，一个不少；
// “看板和图表”“打开本机看板”“最近产物”三处是同一批看板，并成一张清单（页头“最近产物 N 份 ›”落到这张）。
// 访客版同一套页面、同一份接口、同一套按钮：“在本机打开”“本机看板”照画，访客点了弹全站统一的可信设备弹窗。
// 每个数、每个“截止”都照接口给的字段写，字段没给的那块不画（本人 11-27 14:41 禁令：不显示没人维护的标识）。
// 数在哪：项目详情 sections[].metrics[] 按 id 取；七天缺口 records?section=days；看板清单 records?section=dashboards（行含 definition_href、local_open）。
(() => {
  'use strict';
  const U = window.LiveUI, esc = U.esc;
  const ID = 'timeaudit';
  const DROP = new Set(['retained', 'storage', 'quality', 'results', 'freeze', 'more-data']);   // 这页不按通用卡画的几节，数都并进下面几张
  const NARROW = '(max-width: 1100px)';   // 窗口窄时排成一栏（和 timeaudit.css 的 @media 同一个宽度）
  const PAGE = 5;   // 看板清单一页几行；多了往后翻
  const COLUMNS = { changes: 0, 'ta-where': 1 };
  const enc = encodeURIComponent;
  const records = section => `/live/records/?project=${ID}&section=${enc(section)}`;

  // —— 数怎么写 ——
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  const int = n => Math.round(n).toLocaleString('zh-CN');
  // 一位小数：和后台那几句（Python 的 .1f）同一种取法，按实际存的数取舍，204.45 写 204.4，不和悬停那句对不上
  const one = n => { const [i, f] = Math.abs(n).toFixed(1).split('.'); return `${n < 0 && +`${i}.${f}` ? '−' : ''}${Number(i).toLocaleString('zh-CN')}.${f}`; };
  const gb = b => { const g = b / 2 ** 30; return g >= 10 ? one(g) : (Math.round(g * 100) / 100).toFixed(2); };   // 全站写 GB（按 Windows 的算法，1 GB = 2³⁰ 字节）
  const size = b => b >= 2 ** 30 ? `${gb(b)} GB` : b >= 2 ** 20 ? `${one(b / 2 ** 20)} MB` : b >= 1024 ? `${one(b / 1024)} KB` : `${int(b)} 字节`;
  const zoned = at => {
    if (typeof at !== 'string' || !/^\d{4}-\d\d-\d\d/.test(at)) return null;
    if (/^\d{4}-\d\d-\d\d$/.test(at)) return { y: +at.slice(0, 4), m: +at.slice(5, 7), d: +at.slice(8, 10), time: '' };
    const t = Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}+08:00`);
    if (!Number.isFinite(t)) return null;
    const f = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(t)).map(p => [p.type, p.value]));
    return { y: +f.year, m: +f.month, d: +f.day, time: `${f.hour}:${f.minute}` };
  };
  const md = at => { const z = zoned(at); return z ? `${z.m}月${z.d}日` : ''; };
  const mdTime = at => { const z = zoned(at); return z ? `${z.m}月${z.d}日${z.time ? ` ${z.time}` : ''}` : ''; };
  const hm = at => zoned(at)?.time || '';
  const dash = at => { const z = zoned(at); return z ? `${String(z.m).padStart(2, '0')}-${String(z.d).padStart(2, '0')}` : ''; };
  const dayNo = at => { const z = zoned(at); return z ? Date.UTC(z.y, z.m - 1, z.d) / 864e5 : NaN; };
  const todayNo = () => dayNo(new Date().toISOString());
  const isToday = at => dayNo(at) === todayNo();
  // 同一天只写时刻，不同天写日子和时刻
  const when = (at, base) => isToday(at) || (base && dayNo(at) === dayNo(base)) ? hm(at) : mdTime(at);
  const cut = at => mdTime(at) ? `截止 ${mdTime(at)}` : '';

  // —— 读数：sections 里按 id 取 ——
  function pick(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const all = sections.flatMap(s => Array.isArray(s?.metrics) ? s.metrics : []);
    const m = id => all.find(x => x?.id === id) || null;
    const sec = id => sections.find(s => s?.id === id) || null;
    return { m, sec };
  }
  // 访客看不到的字段（value 为 null、标了 owner）：原位占位，两版都挂全站同一个紫色“访客看不到”签
  const hidden = m => !!m && m.value == null && (m.visibility === 'owner' || m.public === 'owner' || !!m.hidden);
  const ownerTag = (m, what) => m && (m.visibility === 'owner' || m.public === 'owner' || m.hidden) ? U.visitorHiddenTag(m.hidden_what || what, '', 'owner') : '';
  const DOTS = '<span class="ta-dots">••••</span>';
  const v = m => m && m.value && typeof m.value === 'object' ? m.value : {};
  const n = (m, key) => key ? (finite(v(m)[key]) ? v(m)[key] : null) : finite(m?.value) ? m.value : finite(m?.value?.count) ? m.value.count : null;
  // 卡底“说明”：这张卡用到的那几项的口径，照后台给的句子
  const notes = (...list) => [...new Set(list.flat().filter(x => typeof x === 'string' && x.trim()).map(x => x.trim()))];
  const metricNotes = (m, name) => m ? [m.scope, m.note].filter(x => typeof x === 'string' && x.trim()).map(x => name ? `${name}：${x}` : x) : [];

  // —— 小图标（线条，跟着字色） ——
  const ICON = {
    days: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    pulse: '<path d="M2.5 12h4l2.5-6 4 12 2.5-6h6"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 16.5 9 5 9-5"/>',
    db: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    board: '<rect x="4.5" y="4" width="15" height="17" rx="2.5"/><path d="M9 3h6v3H9zM8.5 11h7M8.5 15h7"/>',
    clip: '<rect x="5" y="4.5" width="14" height="16.5" rx="2.5"/><path d="M9 3h6v3.5H9z"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    bars: '<path d="M4 20V10M9.3 20V5M14.6 20v-7M20 20V8M3 20.5h18"/>',
    bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z"/>',
    screen: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
  };
  const icon = (name, cls = 'ta-ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</svg>`;

  // —— 一张卡：卡名、内容、卡底（“说明 ›”收起来＋右边截止） ——
  function card(key, ico, title, body, { note = [], at = '', id = '', cls = '' } = {}) {
    const foot = note.length || at ? `<div class="ta-foot">${note.length ? `<details class="pj-notes ta-notes"><summary class="live-disclosure"><span class="disclosure-closed">说明</span><span class="disclosure-open">收起说明</span><span class="disclosure-chev">›</span></summary><div class="pj-note">${note.map(esc).join('<br>')}</div></details>` : '<span></span>'}${at ? `<span class="pj-cut">${esc(cut(at))}</span>` : ''}</div>` : '';
    return `<section class="pj-card glass ta-card ta-card--${key}${cls ? ` ${cls}` : ''}" data-ta="${key}"${id ? ` id="${id}"` : ''}><h3 class="ta-title">${icon(ico)}<b>${esc(title)}</b></h3><div class="ta-body">${body}</div>${foot}</section>`;
  }
  const big = (num, unit, tail = '') => `<p class="ta-big"><b>${num}</b>${unit ? `<small>${esc(unit)}</small>` : ''}${tail ? `<em>${esc(tail)}</em>` : ''}</p>`;

  // —— 记全了吗：近 24 小时没记上几分钟＋最近 7 天每天的小柱（今天那根到现在为止） ——
  function missedCard(p, days, viewer) {
    const m = p.m('missed'), dm = p.m('days');
    if (!m && !days.length) return '';
    const sec = n(m, 'seconds'), val = v(m), parts = [];
    if (finite(val.collection_gap_seconds)) parts.push(`采集断了 ${int(val.collection_gap_seconds)} 秒`);
    if (finite(val.uncovered_seconds)) parts.push(`整段没采到 ${int(val.uncovered_seconds)} 秒`);
    const inner = !parts.length && typeof val.text === 'string' ? (/（(.+)）/.exec(val.text)?.[1] || '') : '';
    const head = hidden(m) ? big(DOTS, '') + ownerTag(m, '近 24 小时没记上多久') : finite(sec) ? big(esc(one(sec / 60)), '分钟') : m?.text ? `<p class="ta-line">${esc(m.text)}</p>` : '';
    const line = parts.length || inner ? `<p class="ta-line">近 24 小时没记上：${esc(parts.length ? parts.join(' + ') : inner)}</p>` : '';
    return card('missed', 'days', '记全了吗', head + line + barsHtml(days, viewer) + (days.length ? `<a class="more ta-go" href="${esc(records(dm?.section || 'days'))}">最近 ${days.length} 天的记录 <span class="more__chev">›</span></a>` : ''), {
      note: notes(p.sec('quality')?.about, metricNotes(m), metricNotes(dm, '最近 7 天')), at: m?.at || dm?.at,
    });
  }
  function barsHtml(days) {
    const list = days.filter(d => finite(d?.missed_seconds) && /^\d{4}-\d\d-\d\d$/.test(d?.date || ''));
    if (!list.length) return '';
    const mins = list.map(d => d.missed_seconds / 60), sorted = [...mins].sort((a, b) => b - a);
    // 有一天特别高（比第二高的三倍还多）时那根封顶、画一道折痕，免得其余几天都贴着底
    const clip = sorted.length > 1 && sorted[1] > 0 && sorted[0] > sorted[1] * 3 ? sorted[1] * 2.2 : 0;
    const top = clip || sorted[0] || 1;
    const bars = list.map((d, i) => {
      const x = mins[i], over = clip && x > clip, h = Math.max(4, Math.min(1, x / top) * 100), today = isToday(d.date);
      const label = today ? '今天' : d.date.slice(5);
      const title = typeof d.text === 'string' && d.text ? d.text : `${label}：没记上 ${one(x)} 分钟`;
      return `<li class="ta-bar${over ? ' is-over' : ''}${today ? ' is-today' : ''}" title="${esc(title)}"><span class="ta-bar__v">${esc(one(x))} 分</span><span class="ta-bar__plot"><i style="height:${h.toFixed(1)}%"></i></span><span class="ta-bar__x">${esc(label)}</span></li>`;
    }).join('');
    return `<ol class="ta-bars" aria-label="最近 ${list.length} 天每天没记上几分钟">${bars}</ol>`;
  }

  // —— 新到哪儿：最新一条记到几点＋采集、入库、网页三个时刻 ——
  const STATE = { healthy: '正常' };
  function freshCard(p) {
    const latest = p.m('latest'), mem = p.m('memory'), pipe = p.m('pipeline'), pv = v(pipe);
    if (!latest && !pipe && !mem) return '';
    const at = typeof latest?.value === 'string' ? latest.value : '';
    const head = at ? big(esc(hm(at) || mdTime(at)), '') + `<p class="ta-line">最新一条记到 ${esc(md(at))}</p>` : latest?.text ? `<p class="ta-line">最新一条记到 ${esc(latest.text)}</p>` : '';
    const steps = [['采集', pv.capture_until, pv.capture_state], ['入库', pv.ingest_at, pv.ingest_state], ['网页更新', pv.export_at, null]].filter(s => zoned(s[1]));
    const flow = steps.length ? `<ol class="ta-flow" style="--n:${steps.length}">${steps.map(([k, t, state]) => {
      const bad = state && state !== 'healthy';
      return `<li class="${bad ? 'is-bad' : ''}" title="${esc(`${k}${state ? `：${STATE[state] || state}` : ''}，${mdTime(t)}`)}"><i></i><b>${esc(k)}${bad ? ` · ${esc(STATE[state] || state)}` : ''}</b><span>${esc(when(t, at))}</span></li>`;
    }).join('')}</ol>` : '';
    const small = [finite(pv.pending_events) && `待写 ${int(pv.pending_events)}`, finite(pv.write_failures) && `写入失败 ${int(pv.write_failures)}`,
      finite(pv.pending_files) && `待入库文件 ${int(pv.pending_files)}`, finite(pv.pending_bytes) && (pv.pending_bytes ? `待入库 ${size(pv.pending_bytes)}` : '待入库字节 0'),
      pv.error_kind && `出错：${pv.error_kind}`].filter(Boolean).join(' · ');
    const memLine = finite(mem?.value) ? `采集程序最高占内存 ${one(mem.value)} MB` : '';
    const body = head + flow + (small || memLine ? `<p class="ta-small">${[small, memLine].filter(Boolean).map(esc).join('<br>')}</p>` : '');
    return card('fresh', 'pulse', '新到哪儿', body, { note: notes(metricNotes(latest, '最新一条'), metricNotes(mem, '最高占内存'), metricNotes(pipe, '三个时刻')), at: pipe?.at || latest?.at });
  }

  // —— 卡顿留现场：留了几份现场＋黑匣子录到哪 ——
  function freezeCard(p) {
    const f = p.m('freeze'), bb = p.m('blackbox'), fv = v(f), bv = v(bb);
    if (!f && !bb) return '';
    const head = finite(fv.retained) ? big(esc(int(fv.retained)), '份') : f?.text ? `<p class="ta-line">${esc(f.text)}</p>` : '';
    const line = [finite(fv.week) && `近 7 天 ${int(fv.week)}`, finite(fv.partial) && `不完整 ${int(fv.partial)}`].filter(Boolean).join(' · ');
    const stale = bb ? U.staleText(bb) : '';   // 旧了照全站同一句“数据截止 …”
    const box = bb ? `<p class="ta-bb"><span class="ta-bb__k">黑匣子</span>${[`起点 ${mdTime(bv.start) || '没有记录'}`, `终点 ${mdTime(bv.end) || '没有记录'}`].map(esc).join(' · ')}${stale ? `<span class="ta-flag">${esc(stale)}</span>` : ''}</p>` : '';
    const body = head + (line ? `<p class="ta-line">${esc(line)}</p>` : '') + box + '<a class="more ta-go" href="/live/smooth/">去卡顿与流畅 <span class="more__chev">›</span></a>';
    return card('freeze', 'layers', '卡顿留现场', body, { note: notes(p.sec('freeze')?.about, p.sec('freeze')?.note, metricNotes(f), metricNotes(bb, '黑匣子')), at: f?.at || bb?.at });
  }

  // —— 攒了多少、能翻回多早：左边五样有多少，右边从哪天起能翻回（时间轴） ——
  // 写给本人的人话（两版同一句，不算换说法）；后台原名和口径在“说明”里
  const COUNT_ROWS = [['hardware', '电脑状态测量'], ['lifecycle', '程序启动和退出'], ['registry', '程序开过多少回'], ['activity', '活动记录'], ['context', '前台窗口']];
  function retainedCard(p, clip) {
    const rows = COUNT_ROWS.map(([id, name]) => ({ id, name, m: p.m(id) })).filter(r => r.m && (finite(r.m.value) || hidden(r.m)));
    const lines = rows.map(r => `<li><span>${esc(r.name)}</span><b>${hidden(r.m) ? DOTS + ownerTag(r.m, r.name) : esc(int(r.m.value))}</b><small>${esc(r.m.unit || '')}</small></li>`).join('');
    const table = rows.length ? `<div class="ta-counts"><ul>${lines}</ul>${groupCut(rows.map(r => ({ name: r.name, at: r.m.at })), '项')}</div>` : '';
    const tl = timeline(p, clip);
    if (!table && !tl) return '';
    const mm = rows.map(r => r.m);
    return card('retained', 'db', '攒了多少、能翻回多早', `<div class="ta-retained">${table}${tl}</div>`, {
      note: notes(p.sec('retained')?.about, p.sec('retained')?.note, ...rows.map(r => metricNotes(r.m, r.m.label || r.name)), metricNotes(p.m('earliest'), '最早能翻回'), metricNotes(p.m('raw_since'), '程序细节能翻回')), cls: mm.length ? '' : 'is-tl',
    });
  }
  // 一组数来自不同批次时分开写截止（前三项截止 X · 后两项截止 Y）：读数时刻相差半小时以内的算同一批，写这批里最早的那个；只有一批写一次
  const CN = ['', '一', '两', '三', '四', '五', '六', '七', '八', '九'];
  const BATCH_MS = 30 * 60e3;
  const ms = at => Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}+08:00`);
  function groupCut(list, unit) {
    const keyed = list.filter(x => mdTime(x.at) && Number.isFinite(ms(x.at)));
    if (!keyed.length) return '';
    const starts = [];
    for (const t of keyed.map(x => ms(x.at)).sort((a, b) => a - b)) if (!starts.length || t - starts.at(-1) > BATCH_MS) starts.push(t);
    const batch = x => starts.findLastIndex(t => ms(x.at) >= t);
    const groups = [];
    for (const x of keyed) { const k = batch(x), g = groups.at(-1); if (g && g.k === k) { g.items.push(x); if (ms(x.at) < ms(g.at)) g.at = x.at; } else groups.push({ k, at: x.at, items: [x] }); }
    if (groups.length === 1) return `<p class="ta-cut">${esc(cut(groups[0].at))}</p>`;
    let first = null;
    const parts = groups.map((g, i) => {
      const who = groups.length === 2 ? `${i ? '后' : '前'}${CN[g.items.length] || g.items.length}${unit}` : g.items.map(x => x.name).join('、');
      const t = first && dayNo(g.at) === dayNo(first) ? hm(g.at) : mdTime(g.at);
      first ||= g.at;
      return `${who}截止 ${t}`;
    });
    return `<p class="ta-cut">${esc(parts.join(' · '))}</p>`;
  }
  // 起点日期：新导出给 earliest.value.activity / window；旧导出是一句“活动 2026-06-07；窗口 2026-06-16”，两种都认
  function starts(p, clip) {
    const e = p.m('earliest'), out = [];
    const ev = e?.value;
    if (ev && typeof ev === 'object' && (ev.activity || ev.window)) {
      if (ev.activity) out.push({ key: 'activity', name: '活动', date: ev.activity, at: e.at });
      if (ev.window) out.push({ key: 'window', name: '窗口', date: ev.window, at: e.at });
    } else {
      const text = typeof ev === 'string' ? ev : typeof ev?.text === 'string' ? ev.text : typeof e?.text === 'string' ? e.text : '';
      for (const hit of text.matchAll(/([^\s；;，,、]+)\s*(\d{4}-\d\d-\d\d)/g)) out.push({ key: hit[1] === '活动' ? 'activity' : hit[1] === '窗口' ? 'window' : 'other', name: hit[1], date: hit[2], at: e.at });
    }
    const cd = clip && /^\d{4}-\d\d-\d\d$/.test(v(clip).earliest_date || '') ? v(clip).earliest_date : '';
    if (cd) out.push({ key: 'clipboard', name: '剪贴板', date: cd, at: clip.at });
    const raw = p.m('raw_since'), rd = typeof raw?.value === 'string' && /^\d{4}-\d\d-\d\d/.test(raw.value) ? raw.value.slice(0, 10) : '';
    if (rd) out.push({ key: 'detail', name: '程序细节', date: rd, at: raw.at, before: '更早只剩小时、日统计' });
    return out;
  }
  function timeline(p, clip) {
    const rows = starts(p, clip).filter(r => Number.isFinite(dayNo(r.date)));
    if (!rows.length) return '';
    const z0 = zoned(rows.reduce((a, r) => dayNo(r.date) < dayNo(a) ? r.date : a, rows[0].date));
    const from = Date.UTC(z0.y, z0.m - 1, 1) / 864e5, to = todayNo(), span = Math.max(1, to - from);
    const x = d => ((dayNo(d) - from) / span * 100).toFixed(2);
    const ticks = [];
    for (let y = z0.y, mo = z0.m; ; mo++) {
      if (mo > 12) { mo = 1; y++; }
      const t = Date.UTC(y, mo - 1, 1) / 864e5;
      if (t > to) break;
      const pos = (t - from) / span * 100;
      if (pos <= 92) ticks.push(`<span style="left:${pos.toFixed(2)}%">${ticks.length === 0 || mo === 1 ? `<small>${y}年</small>` : ''}${mo}月</span>`);
    }
    ticks.push('<span class="is-now" style="left:100%">今天</span>');
    const lanes = rows.map(r => `<li class="ta-lane ta-lane--${esc(r.key)}"><span class="ta-chip">${esc(r.name)}</span><span class="ta-track">${r.before ? `<i class="ta-before" style="width:${x(r.date)}%"><em>${esc(r.before)}</em></i>` : ''}<i class="ta-run" style="left:${x(r.date)}%"></i><b style="left:${x(r.date)}%">${esc(md(r.date))}起</b></span></li>`).join('');
    const z = zoned(rows[0].date);
    return `<div class="ta-tl"><p class="ta-tl__head"><b>从哪天起能翻回</b><small>（时间轴：${z0.y} 年 ${z0.m} 月 → 今天）</small></p><div class="ta-axis">${ticks.join('')}</div><ol class="ta-lanes">${lanes}</ol>${z ? groupCut(rows.map(r => ({ name: r.name, at: r.at })), '项') : ''}</div>`;
  }

  // —— 近 24 小时整机测量：四个读数；“展开”里是原“更多数据”里别处没放的几项（照图），接口没给的那项不画 ——
  let foldOpen = false;
  const MORE = [
    ['clipboard_latest', '剪贴板最近一次复制', m => typeof m.value === 'string' && zoned(m.value) ? mdTime(m.value) : ''],
    ['clipboard_temporary', '剪贴板目录里的旧临时文件', m => { const t = v(m); return finite(t.count) ? `${int(t.count)} 个${finite(t.bytes) ? `（${size(t.bytes)}）` : ''}` : typeof t.text === 'string' ? t.text : ''; }],
    ['website_dashboards', '网站看板定义', m => finite(m.value) ? `${int(m.value)} 份（不算进看板总数）` : ''],
  ];
  function samplesCard(p) {
    const tiles = [['samples24', '留下'], ['covered24', '有记录'], ['empty24', '没采到'], ['max_gap', '最长空段']].map(([id, k]) => ({ k, m: p.m(id) })).filter(t => t.m && (finite(t.m.value) || hidden(t.m)));
    const more = MORE.map(([id, k, text]) => { const m = p.m(id); return m && { k, m, text: text(m) }; }).filter(x => x && x.text);
    if (!tiles.length && !more.length) return '';
    // 只多一项就直接摆出来，不出“展开（还有 1 项）”（M1190）
    const single = more.length === 1;
    const fold = more.length ? `${foldOpen || single ? `<ul class="ta-more">${more.map(x => `<li><span>${esc(x.k)}</span><b>${esc(x.text)}</b></li>`).join('')}</ul>` : ''}${single ? '' : `<button type="button" class="more ta-go ta-fold" data-ta-fold aria-expanded="${foldOpen}">${foldOpen ? '收起' : `展开（还有 ${more.length} 项）`} <span class="more__chev">›</span></button>`}` : '';
    const body = (tiles.length ? `<ul class="ta-tiles">${tiles.map(t => `<li><span>${esc(t.k)}</span><b>${hidden(t.m) ? DOTS + ownerTag(t.m, t.k) : esc(t.m.id === 'max_gap' ? one(t.m.value) : int(t.m.value))}</b><small>${esc(t.m.unit || '')}</small></li>`).join('')}</ul>` : '') + fold;
    return card('samples', 'pulse', '近 24 小时整机测量', body, { note: notes(...tiles.map(t => metricNotes(t.m, t.m.label || t.k)), ...more.map(x => metricNotes(x.m, x.k))), at: (tiles[0] || more[0]).m.at });
  }

  // —— 占多大地方：记录库多大，大头在哪 ——
  function storageCard(p) {
    const db = p.m('db_bytes'), dt = p.m('detail_bytes'), sm = p.m('summary_bytes');
    if (!finite(db?.value)) return '';
    const total = db.value, a = finite(dt?.value) ? dt.value : 0, b = finite(sm?.value) ? sm.value : 0, rest = Math.max(0, total - a - b);
    const segs = [a && ['detail', '程序细节', a], b && ['summary', '小时和日统计', b], (a || b) && ['rest', '其余', rest]].filter(Boolean);
    const bar = segs.length ? `<div class="ta-disk" role="img" aria-label="${esc(segs.map(s => `${s[1]} ${size(s[2])}`).join('，'))}">${segs.map(s => `<i class="ta-disk--${s[0]}" style="width:${(s[2] / total * 100).toFixed(2)}%"></i>`).join('')}</div><ul class="ta-legend">${segs.map(s => `<li><i class="ta-disk--${s[0]}"></i>${esc(s[1])} ${esc(size(s[2]))}</li>`).join('')}</ul>` : '';
    return card('storage', 'db', '占多大地方', big(esc(gb(total)), 'GB', '记录库') + bar, { note: notes(p.sec('storage')?.about, p.sec('storage')?.note, metricNotes(db, '记录库'), metricNotes(dt, '程序细节'), metricNotes(sm, '小时和日统计')), at: db.at });
  }

  // —— 留下的看板：并成一张清单（看定义＝GitHub 上公开的定义，访客也能点；在本机打开：只有本人能用，访客点了弹可信设备弹窗） ——
  let pageAt = 0;
  const title = it => String(it.title || it.text || '').replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, '').trim();
  function dashboardsCard(p, list) {
    const m = p.m('dashboards');
    if (!m && !list.length) return '';
    const pages = Math.max(1, Math.ceil(list.length / PAGE));
    pageAt = Math.min(pageAt, pages - 1);
    const rows = list.slice(pageAt * PAGE, pageAt * PAGE + PAGE).map(it => {
      const def = typeof it.definition_href === 'string' && /^https:\/\//.test(it.definition_href) ? it.definition_href : '';
      const local = it.local_open && typeof it.local_open === 'object' ? it.local_open : null, href = typeof local?.value === 'string' && /^https?:\/\//.test(local.value) ? local.value : '';
      const name = title(it), date = dash(it.date || it.changed);
      const open = href ? `<a class="ta-btn" href="${esc(href)}" target="_blank" rel="noopener" data-ta-owner>在本机打开</a>` : local ? '<button class="ta-btn" type="button" data-ta-owner>在本机打开</button>' : '';
      return `<li class="ta-dash"${finite(it.panels) ? ` title="${esc(`${name}：${int(it.panels)} 张图`)}"` : ''}>${icon('doc', 'ta-ico ta-ico--doc')}<span class="ta-dash__t">${esc(name)}</span><span class="ta-dash__d">${esc(date)}</span>${def ? `<a class="ta-btn" href="${esc(def)}" target="_blank" rel="noopener">看定义</a>` : '<span></span>'}${open || '<span></span>'}</li>`;
    }).join('');
    const mv = v(m), count = finite(mv.count) ? mv.count : list.length || null, panels = finite(mv.panels) ? mv.panels : null;
    const total = count != null ? `全部 ${int(count)} 份${panels != null ? ` · ${int(panels)} 张图` : ''}` : m?.text || '';
    const pager = pages > 1 ? `<span class="ta-pager"><button type="button" class="ta-page" data-ta-page="-1" aria-label="上一页"${pageAt ? '' : ' disabled'}>‹</button><span>${pageAt + 1} / ${pages}</span><button type="button" class="ta-page" data-ta-page="1" aria-label="下一页"${pageAt < pages - 1 ? '' : ' disabled'}>›</button></span>` : '';
    const body = `${rows ? `<ul class="ta-dashes">${rows}</ul>` : ''}<div class="ta-dash-foot">${total ? `<a class="more ta-go" href="${esc(records(m?.section || 'dashboards'))}">${esc(total)} <span class="more__chev">›</span></a>` : '<span></span>'}${pager}</div>`;
    return card('dashboards', 'board', '留下的看板', body, { id: 'artifacts', note: notes(p.sec('results')?.note, metricNotes(m, '看板和图表')), at: m?.at });
  }

  // —— 剪贴板：能翻回多少条，事件和库多大 ——
  function clipboardCard(p) {
    const c = p.m('clipboard'), ev = p.m('clipboard_events'), by = p.m('clipboard_bytes'), vw = p.m('viewer');
    if (!c && !ev) return '';
    const cv = v(c), count = n(c);
    const head = count != null ? big(esc(int(count)), '条', '能翻回') : '';
    const kinds = [finite(cv.text_count) && `文字 ${int(cv.text_count)}`, finite(cv.url_count) && `链接 ${int(cv.url_count)}`, finite(cv.file_list_count) && `文件列表 ${int(cv.file_list_count)}`, md(cv.earliest_date) && `最早 ${md(cv.earliest_date)}`].filter(Boolean);
    const line = kinds.length ? kinds.join(' · ') : typeof cv.text === 'string' ? cv.text : '';
    // 后台叫“边界”的那类：开机、锁屏、解锁、睡眠、恢复、暂停或会话结束时记下的分界，没有内容（TimeAudit clipboard_history/PERSONALOS_ADAPTER_CONTRACT.md）
    const MARKS = '开机锁屏等标记';
    const evv = v(ev), evParts = [finite(evv.skipped) && `跳过 ${int(evv.skipped)}`, finite(evv.gaps) && `缺口 ${int(evv.gaps)}`, finite(evv.boundaries) && `${MARKS} ${int(evv.boundaries)}`].filter(Boolean);
    const evText = n(ev) != null ? `全部事件 ${int(n(ev))} 条${evParts.length ? `（含${evParts.join('、')}）` : ''}` : evv.text ? `全部事件 ${String(evv.text).replace('边界', MARKS)}` : '';
    const boxParts = [evText, finite(by?.value) && `独立库 ${size(by.value)}`].filter(Boolean);
    const vv = v(vw), viewerLine = vw ? (vv.web_open === true && typeof vv.href === 'string' ? `<p class="ta-viewer">本机剪贴板查看器：<button class="ta-btn" type="button" data-ta-owner data-href="${esc(vv.href)}">在本机打开</button></p>` : vv.text || vw.text ? `<p class="ta-viewer">本机剪贴板查看器：${esc(vv.text || vw.text)}</p>` : '') : '';
    const body = head + (line ? `<p class="ta-line">${esc(line)}</p>` : '') + (boxParts.length ? `<p class="ta-box">${esc(boxParts.join(' · '))}</p>` : '') + viewerLine;
    return card('clipboard', 'clip', '剪贴板', body, { note: notes(metricNotes(c, '能翻回'), metricNotes(ev, '全部事件'), (finite(evv.boundaries) || /边界/.test(evv.text || '')) && `“${MARKS}”后台原名叫“边界”：开机、锁屏、解锁、睡眠、恢复、暂停或会话结束时记下的分界，没有内容。`, metricNotes(by, '独立库'), metricNotes(vw, '查看器')), at: c?.at || ev?.at });
  }

  // —— 去哪看细节（和“最近改动”同一排，page.js 摆） ——
  function whereHtml(list) {
    const local = list.map(it => it?.local_open).find(x => x && typeof x === 'object'), href = typeof local?.value === 'string' ? (() => { try { return new URL(local.value).origin + '/'; } catch { return ''; } })() : '';
    const go = (ico, name, url) => `<li><a class="ta-where" href="${url}">${icon(ico)}<span>${esc(name)}</span><span class="more__chev">›</span></a></li>`;
    const board = local ? `<li>${href ? `<a class="ta-where" href="${esc(href)}" target="_blank" rel="noopener" data-ta-owner>` : '<button class="ta-where" type="button" data-ta-owner>'}${icon('screen')}<span>本机看板（在本机打开）</span><span class="more__chev">›</span>${href ? '</a>' : '</button>'}</li>` : '';
    return `<ul class="ta-wheres">${go('pulse', '卡顿与流畅', '/live/smooth/')}${go('bars', '谁在占', '/live/apps/')}${go('clock', '使用时间', '/live/usage/')}${go('bolt', '用电', '/live/power/')}${board}</ul>`;
  }

  // —— 只有本人能用的按钮：访客（含本人切到看公开版）点了弹全站统一的可信设备弹窗 ——
  let viewing = 'public';
  document.addEventListener('click', e => {
    const btn = e.target.closest?.('[data-ta-owner]');
    if (btn) {
      const href = btn.getAttribute('href') || btn.dataset.href || '';
      if (viewing === 'owner' && href) { if (!btn.matches('a')) window.open(href, '_blank', 'noopener'); return; }
      e.preventDefault();
      window.TrustModal?.show();
      return;
    }
    const foldBtn = e.target.closest?.('[data-ta-fold]');
    if (foldBtn) { if (foldOpen) U.anchorFold(foldBtn, () => { foldOpen = false; draw(); }, () => document.querySelector('[data-ta-fold]')); else { foldOpen = true; draw(); } return; }
    const step = e.target.closest?.('[data-ta-page]');
    if (step) { pageAt = Math.max(0, pageAt + Number(step.dataset.taPage)); draw(); }
  });

  // —— 取数：七天缺口、看板清单（二级页点进来才读） ——
  const extra = { days: [], dashboards: [] };
  let watching = false, last = null, wide = null, drawn = '';
  function watch(raw, viewer) {
    if (watching || !window.Live?.watch) return;
    watching = true;
    const { m } = pick(raw);
    const on = key => ({
      data(d, meta) {
        if ((meta?.viewer?.kind || 'public') !== viewing) return;
        const items = Array.isArray(d?.items) ? d.items : [];
        extra[key] = key === 'days' ? [...items].sort((a, b) => String(a?.date).localeCompare(String(b?.date))) : items;
        draw();
      },
      link() {},
    });
    window.Live.watch(`projects/${ID}/records`, { section: m('days')?.section || 'days' }, on('days'));
    window.Live.watch(`projects/${ID}/records`, { section: m('dashboards')?.section || 'dashboards' }, on('dashboards'));
    viewing = viewer;
  }

  // 上面四排是一块通栏（放在两栏卡片前面）；最后一排“最近改动＋去哪看细节”留在两栏里
  function draw() {
    if (!last) return;
    const { raw, board } = last, p = pick(raw), clip = p.m('clipboard');
    const sig = JSON.stringify([raw.sections, extra, viewing, pageAt, foldOpen]);
    if (!wide) { wide = document.createElement('div'); wide.className = 'ta-wide'; }
    if (board && (wide.nextElementSibling !== board || wide.parentNode !== board.parentNode)) board.before(wide);
    if (sig === drawn) return;
    drawn = sig;
    const row = (cls, ...cards) => { const c = cards.filter(Boolean); return c.length ? `<div class="ta-row ${cls}${c.length === 1 ? ' is-one' : ''}">${c.join('')}</div>` : ''; };
    wide.innerHTML = row('ta-row--3', missedCard(p, extra.days, viewing), freshCard(p), freezeCard(p))
      + row('ta-row--1', retainedCard(p, clip))
      + row('ta-row--2', samplesCard(p), storageCard(p))
      + row('ta-row--2', dashboardsCard(p, extra.dashboards), clipboardCard(p));
    const where = document.querySelector('#ta-where .pj-viz');
    if (where) U.html(where, whereHtml(extra.dashboards), false);
  }

  function adapt(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const dropped = sections.filter(s => DROP.has(s?.id));
    return {
      ...raw, headline: null, timeaudit: { sections: dropped },   // 代表数“近 24 小时没记上”就是“记全了吗”那张卡的大数，页头那排不再重复
      sections: sections.filter(s => !DROP.has(s?.id)),
      hidden: finite(raw.hidden) ? Math.max(0, raw.hidden - dropped.reduce((k, s) => k + (finite(s.hidden) ? s.hidden : 0), 0)) : raw.hidden,
    };
  }
  function board(d, viewer, graphBlock, boardEl) {
    boardEl?.classList.add('pj-board--timeaudit');
    const raw = { ...d, sections: [...(d.timeaudit?.sections || []), ...(d.sections || [])] };
    viewing = viewer;
    last = { raw, board: boardEl };
    watch(raw, viewer);
    draw();
    const b = graphBlock('ta-where', '去哪看细节');
    b.group = 'ta-where';
    U.html(b.head, `${icon('grid')}<b>去哪看细节</b>`, false);
    U.html(b.viz, whereHtml(extra.dashboards), false);
    return [b];
  }
  // 最后一排：左“最近改动”、右“去哪看细节”；窗口窄时排成一栏（顺序见 timeaudit.css）；出现别的卡时交回 page.js 按高度摆
  const columns = keys => !keys.every(k => k in COLUMNS) ? null : window.matchMedia?.(NARROW).matches ? keys.map(() => 0) : keys.map(k => COLUMNS[k]);

  window.ProjectPages = Object.assign(window.ProjectPages || {}, { [ID]: { adapt, board, columns, noArtifacts: true } });
})();

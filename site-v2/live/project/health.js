// 健康参谋（/live/project/?id=personal-health）自己的几块；page.js 只在几处接进来：adapt 改这一页的数据、board 加卡、columns 定卡放哪一栏、noArtifacts 不画通用的“最近产物”。
// 本人 11-27 定的样子（甲）：读数下面通栏“手环记录齐不齐”（12 个小月历、图例、几天有记录）；
// 下面左边“AI 答健康问题用到哪天”“更多数据”，中间“AI 能分析哪些数据”，右边“最近的简报”＋最近改动（page.js 画）。
// 原来页上的每个数都还在：并进了这几张卡（攒了多少→月历下一排、几种数据的条数→排行、更多数据两组）。
// 会越积越多的东西固定大小：月历一年一屏、能往前翻；种类排行露 8 种，其余收起；简报露 5 份。
// 每个日期、“截止／核对”都照接口给的字段写，字段没给的那块不画（本人 11-27 14:41 禁令：不显示没人维护的标识）。
// 数在哪：项目详情 sections 里按 id 找：wear_calendar、collection_summary、record_inventory、brief_list（11-27 后台交的）；其余照旧读 adopted、newest、captured、readable、kinds 和“更多数据”那几项。
(() => {
  'use strict';
  const U = window.LiveUI, esc = U.esc;
  const DROP = new Set(['freshness', 'history', 'more-data']);   // 这页不按通用卡画的几节（页头那一格要的 adopted 留下）
  const OWN = new Set(['wear_calendar', 'collection_summary', 'record_inventory', 'brief_list']);   // 新字段：放在哪一节都从通用卡里拿掉
  const COLUMNS = { 'health-answer': 0, 'health-kinds': 0, 'health-more': 0, artifacts: 1, changes: 1 };
  const NARROW = '(max-width: 1100px)';   // 窗口窄时排成一栏（和 health.css 的 @media 同一个宽度）
  const TOP = 8, BRIEFS = 5;   // 种类至少露几种（卡比内容高时按空当多露几种，见 fitKinds）、简报露几份
  let shownKinds = TOP;
  const KIND = { weekly: ['每周取回', 'is-weekly'], on_demand: ['按需取回', 'is-demand'] };
  const RECORDS = section => `/live/records/?project=personal-health&section=${encodeURIComponent(section)}`;

  // —— 数怎么写 ——
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  const int = n => Math.round(n).toLocaleString('zh-CN');
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
  const iso = z => `${z.y}-${String(z.m).padStart(2, '0')}-${String(z.d).padStart(2, '0')}`;
  const ymd = at => { const z = zoned(at); return z ? iso(z) : ''; };
  // 条数：十万以上写“约 X 万”（一百万以上取整），十万以下写原数（原来页上的 12,021 这类照旧看得到）
  const wan = n => n >= 1e6 ? `约 ${int(n / 1e4)} 万` : n >= 1e5 ? `约 ${+(n / 1e4).toFixed(1)} 万` : int(n);
  const tip = s => typeof s === 'string' && s.trim() ? ` title="${esc(s.trim())}"` : '';
  const keep = s => `<span class="hl-keep">${esc(s)}</span>`;
  const prose = s => esc(s).replace(/增删|空档|\d{1,2}月\d{1,2}(?:–\d{1,2})?日(?: \d{2}:\d{2})?|\d[\d,]* (?:小时|天|条|份|种)/g, keep);
  // —— 两版同一套（本人 11-24 禁令、11-27 22:23）：访客看不到的（后台给 {value:null, visibility:'owner', hidden_what}）在原位写
  //    “〔这是什么〕仅本人可见”（共用写法），不悄悄消失；本人版同一处按后台 visitor_labels 挂共用的“访客看不到”／“对外换了说法”签 ——
  let viewing = 'public';
  const hid = m => !!m && viewing !== 'owner' && m.value == null && U.privateField(m);
  const lock = (m, name) => U.fieldHtml({ ...m, hidden_what: m.hidden_what || name }, { name, kind: 'public' });
  const tag = (m, name) => m && typeof m === 'object' ? U.visitorLabel(m, ['$', 'value'], name, viewing) : '';

  // —— 数据 ——
  function read(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const metric = id => sections.flatMap(s => Array.isArray(s?.metrics) ? s.metrics : []).find(m => m?.id === id) || null;
    const obj = id => { const v = metric(id)?.value; return v && typeof v === 'object' && !Array.isArray(v) ? v : null; };
    const pick = (...ids) => Object.fromEntries(ids.map(id => [id, metric(id)]));
    return {
      wear: obj('wear_calendar'), summary: obj('collection_summary'), inventory: obj('record_inventory'), briefs: obj('brief_list'),
      ...pick('adopted', 'pending', 'newest', 'captured', 'readable', 'kinds', 'history', 'steps', 'sleep', 'resting', 'recent', 'activity',
        'steps_records', 'sleep_records', 'entered_records', 'entered_date', 'window_records', 'batches', 'history_segments', 'doc_files', 'code_files', 'code_parts'),
      briefsCount: metric('briefs'),
      M: { wear: metric('wear_calendar'), summary: metric('collection_summary'), inventory: metric('record_inventory'), briefs: metric('brief_list') },
    };
  }
  function adapt(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const view = read(raw);
    const kept = sections.flatMap(s => {
      if (!s) return [];
      if (DROP.has(s.id)) {
        // 页头那一格（headline: adopted）要在 sections 里找得到；只剩它的一节 page.js 不出卡
        const head = (s.metrics || []).filter(m => m?.id === raw.headline);
        return head.length ? [{ ...s, metrics: head, note: null, about: null }] : [];
      }
      const metrics = Array.isArray(s.metrics) ? s.metrics.filter(m => !OWN.has(m?.id)) : s.metrics;
      return Array.isArray(s.metrics) && s.metrics.length && !metrics.length && !s.items ? [] : [{ ...s, metrics }];
    });
    return { ...raw, sections: kept, healthView: view };
  }

  // —— 现在是北京时间哪一天（实况读数时校准过的服务器时间）——
  const todayIso = () => ymd(window.Live?.clock?.() || new Date().toISOString());
  const addDays = (s, n) => { const t = new Date(`${s}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
  const daysIn = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();

  // ============ 通栏：手环记录齐不齐 ============
  // 每种状态：格子的类、格子上悬停的短说法、图例（口径照后台 11-27 定的：心率满 23 小时算全天）
  const STATE = {
    full: ['is-full', '全天记了', '全天记了（23 小时以上有心率）'],
    partial: ['is-part', '只记了一部分', '只记了一部分（有心率但不到 23 小时）'],
    none: ['is-none', '手表没记', '手表没记（整天没有心率，关机或没戴）'],
    uncollected: ['is-wait', '还没收集', '还没收集（还在手表里没取回）'],
    blank: ['is-blank', '没开始或还没到', '没开始或还没到'],
  };
  let wide = null, year = null, drawn = '';
  function dayState(w, day, today) {
    if (day < w.start || day > today) return 'blank';
    const s = w.days?.[day];
    if (STATE[s] && s !== 'blank') return s;
    // 导出之后已经过去的日子：还在手表里没取回
    return day > (w.collected_through || w.today || '') ? 'uncollected' : 'blank';
  }
  function monthHtml(w, y, m, today) {
    const ym = `${y}-${String(m).padStart(2, '0')}`, first = `${ym}-01`, last = `${ym}-${String(daysIn(y, m)).padStart(2, '0')}`;
    const pad = (new Date(`${first}T00:00:00Z`).getUTCDay() + 6) % 7;   // 一周从星期一起
    const cells = ['<i class="is-pad"></i>'.repeat(pad)];
    for (let d = 1; d <= daysIn(y, m); d++) {
      const day = `${ym}-${String(d).padStart(2, '0')}`, [cls, word] = STATE[dayState(w, day, today)];
      cells.push(`<i class="${cls}" title="${m}月${d}日 ${esc(word)}"></i>`);
    }
    cells.push('<i class="is-pad"></i>'.repeat(42 - pad - daysIn(y, m)));   // 每个月都占 6 行，月份下面那行字对齐
    const sum = w.months?.[ym];
    const label = last < w.start ? '未开始' : first > today ? '还没到'
      : `记了 ${finite(sum?.recorded_days) ? sum.recorded_days : 0}/${finite(sum?.collected_days) ? sum.collected_days : 0} 天`;
    const quiet = last < w.start || first > today;
    return `<li class="hl-month${quiet ? ' is-quiet' : ''}"><p class="hl-month__name">${m}月</p><div class="hl-cal" role="img" aria-label="${esc(`${m}月：${label}`)}">${cells.join('')}</div><p class="hl-month__sum">${esc(label)}</p></li>`;
  }
  // 图例里“还没收集”后面写这一年哪几天（程序按数据算）
  function waitSpan(w, y, today) {
    const days = [];
    for (let d = `${y}-01-01`; d <= `${y}-12-31` && d <= today; d = addDays(d, 1)) if (dayState(w, d, today) === 'uncollected') days.push(d);
    if (!days.length) return '';
    const a = zoned(days[0]), z = zoned(days.at(-1));
    return days.length === 1 ? md(days[0]) : a.m === z.m ? `${a.m}月${a.d}–${z.d}日` : `${md(days[0])}–${md(days.at(-1))}`;
  }
  function statsHtml(v) {
    const s = v.summary?.history && typeof v.summary.history === 'object' ? v.summary.history : fallbackHistory(v);
    const r = v.summary?.recent && typeof v.summary.recent === 'object' ? v.summary.recent : fallbackRecent(v);
    const cells = [];
    if (s && md(s.start) && finite(s.days)) cells.push([`从 ${md(s.start)}起`, s.days]);
    for (const [k, name] of [['steps', '有步数'], ['activity', '有活动'], ['sleep', '有睡眠'], ['resting', '有静息心率']]) if (finite(s?.[k])) cells.push([name, s[k]]);
    const out = cells.map(([k, n]) => `<div class="hl-stat"><span>${esc(k)}</span><b>${esc(int(n))}<small>天</small></b></div>`);
    if (r && finite(r.days)) {
      const four = [['steps', '步数'], ['activity', '活动'], ['sleep', '睡眠'], ['resting', '静息心率']].filter(([k]) => finite(r[k]));
      const span = md(r.start) && md(r.through) ? `（${md(r.start)}至${md(r.through)}）` : '';
      const same = four.length > 1 && four.every(([k]) => r[k] === r[four[0][0]]);
      const body = !four.length ? '' : same
        ? `${four.map(([, n]) => n).join('、')}都是 <b>${esc(`${r[four[0][0]]}/${r.days}`)}</b> 天`
        : four.map(([k, n]) => `${n} <b>${esc(`${r[k]}/${r.days}`)}</b> 天`).join('、');
      const detail = v.recent?.expandable && v.recent.section
        ? ` <a class="hl-recent__detail" href="${esc(RECORDS(v.recent.section))}">断档明细 <span class="more__chev" aria-hidden="true">›</span></a>` : '';
      if (body) out.push(`<p class="hl-recent">最近两周${prose(span)}${body}${detail}</p>`);
    }
    const cut = md(s?.through) || md(r?.through);
    if (cut) out.push(`<span class="hl-cut">截止 ${esc(cut)}</span>`);
    return out.length ? `<div class="hl-stats">${out.join('')}</div>` : '';
  }
  // 新字段没给时，从原来那几项读（“2026-08-05 起，到完整日 2026-11-24 共 112 天”“107/112 天”）
  function fallbackHistory(v) {
    const h = typeof v.history?.value === 'string' ? v.history.value : '', dates = h.match(/\d{4}-\d\d-\d\d/g) || [], total = /共\s*(\d+)\s*天/.exec(h);
    const n = m => { const x = /(\d+)\s*\/\s*\d+/.exec(typeof m?.value === 'string' ? m.value : ''); return x ? +x[1] : null; };
    const out = { start: dates[0], through: dates[1], days: total ? +total[1] : null, steps: n(v.steps), activity: n(v.activity), sleep: n(v.sleep), resting: n(v.resting) };
    return Object.values(out).some(x => x != null) ? out : null;
  }
  function fallbackRecent(v) {
    const t = typeof v.recent?.value === 'string' ? v.recent.value : '', dates = t.match(/\d{4}-\d\d-\d\d/g) || [];
    const n = word => { const x = new RegExp(`${word}\\s*(\\d+)\\s*/\\s*(\\d+)`).exec(t); return x ? [+x[1], +x[2]] : null; };
    const parts = { steps: n('步数'), activity: n('活动'), sleep: n('睡眠'), resting: n('静息心率') };
    const days = Object.values(parts).find(Boolean)?.[1];
    return days ? { start: dates[0], through: dates[1], days, ...Object.fromEntries(Object.entries(parts).map(([k, x]) => [k, x?.[0] ?? null])) } : null;
  }
  function wear(d, boardEl) {
    const v = d.healthView, w = v?.wear;
    const M = v?.M || {}, wearLock = hid(M.wear), sumLock = hid(M.summary);
    const stats = sumLock ? `<p class="hl-sub hl-locked">${lock(M.summary, '记了多少天')}</p>` : v ? statsHtml(v) : '';
    if (!w?.start && !stats && !wearLock) { wide?.remove(); wide = null; drawn = ''; return; }
    if (!wide) {
      wide = document.createElement('section');
      wide.className = 'pj-card glass hl-wear'; wide.id = 'health-wear';
      wide.addEventListener('click', e => {
        const btn = e.target.closest?.('.hl-year button');
        if (!btn || btn.disabled) return;
        year += +btn.dataset.step; drawn = ''; wear(d, boardEl);
      });
    }
    if (wide.nextElementSibling !== boardEl || wide.parentNode !== boardEl.parentNode) boardEl.before(wide);
    const today = todayIso();
    const first = w?.start ? +w.start.slice(0, 4) : null, last = +today.slice(0, 4);
    if (year == null || first == null || year < first || year > last) year = last;
    const sig = JSON.stringify([w, stats, year, today, viewing, wearLock]);
    if (sig === drawn) return;
    drawn = sig;
    let cal = wearLock ? `<p class="hl-sub hl-locked">${lock(M.wear, '每天记没记')}</p>` : '';
    if (w?.start) {
      const months = Array.from({ length: 12 }, (_, i) => monthHtml(w, year, i + 1, today)).join('');
      const span = waitSpan(w, year, today);
      const legend = ['full', 'partial', 'none', 'uncollected', 'blank'].map(k => {
        const [cls, , word] = STATE[k], text = k === 'uncollected' && span ? word.replace('）', `：${span}）`) : word;
        return `<li><i class="${cls}"></i><span>${prose(text)}</span></li>`;
      }).join('');
      cal = `<ol class="hl-months">${months}</ol><ul class="hl-legend">${legend}</ul>`;
    }
    const pill = w?.start ? `<span class="hl-year"><button type="button" data-step="-1" aria-label="上一年"${year <= first ? ' disabled' : ''}>‹</button><b>${year}</b><button type="button" data-step="1" aria-label="下一年"${year >= last ? ' disabled' : ''}>›</button></span>` : '';
    wide.innerHTML = `<div class="hl-wear__head"><b class="hl-title">手环记录齐不齐</b>${tag(M.wear, '每天记没记')}${pill}</div>${cal}${stats}`;
  }
  U.onBeijingDayChange?.(() => { drawn = ''; if (wide && lastD) wear(lastD, lastBoard); });

  // ============ 卡头 ============
  function head(b, title, right = '') {
    U.html(b.head, `<b>${esc(title)}</b>${right}`, false);
    b.el.classList.add('hl-sec');
  }

  // —— AI 答健康问题用到哪天 ——
  function answerHtml(v) {
    const a = v.adopted, aLock = hid(a), big = aLock ? lock(a, 'AI 已用上的资料日期') : md(a?.value) ? esc(md(a.value)) : '';
    if (!big) return '';
    const when = mdTime(a.at);
    const tiles = [];
    if (hid(v.newest)) tiles.push(`<div class="hl-tile"><span>手环最新记录</span><b>${lock(v.newest, '手环最新记录')}</b></div>`);
    else if (md(v.newest?.value)) tiles.push(`<div class="hl-tile"${tip(v.newest.note)}><span>手环最新记录</span><b>${esc(md(v.newest.value))}${tag(v.newest, '手环最新记录')}</b></div>`);
    if (hid(v.captured) || mdTime(v.captured?.at)) {
      const n = finite(v.kinds?.value) ? v.kinds.value : null;
      const kinds = hid(v.kinds) ? `<small>${lock(v.kinds, '这批的数据种类数')}</small>`
        : n != null ? `<a class="hl-tile__sub" href="${esc(RECORDS(v.kinds.section || 'kinds'))}">这批只带回 ${esc(int(n))} 种数据 <span class="more__chev">›</span></a>${tag(v.kinds, '这批的数据种类数')}` : '';
      const when2 = hid(v.captured) ? lock(v.captured, '上次取回的时间') : esc(mdTime(v.captured.at)) + tag(v.captured, '上次取回的时间');
      tiles.push(`<div class="hl-tile"${tip(v.captured.note)}><span>上次取回</span><b>${when2}</b>${kinds}</div>`);
    }
    if (hid(v.readable)) tiles.push(`<div class="hl-tile"><span>这批能正常读</span><b>${lock(v.readable, '这批能不能正常读')}</b></div>`);
    else if (typeof v.readable?.value === 'string' && v.readable.value) {
      const ok = v.readable.value === '能', at = mdTime(v.readable.at);
      tiles.push(`<div class="hl-tile"${tip(v.readable.note)}><span>这批能正常读</span><b class="${ok ? 'is-ok' : 'is-bad'}"><i aria-hidden="true">${ok ? '✓' : '!'}</i>${esc(v.readable.value)}${tag(v.readable, '这批能不能正常读')}</b>${at ? `<small>${esc(at)} 核对</small>` : ''}</div>`);
    }
    // 已取到但 AI 还没用上（后台只在真有待审时给一句话，没有时是 0）：多一行，字照原来页面的说法，带它自己的时刻
    const p = v.pending, said = hid(p) ? lock(p, p.label || '待审的资料') : typeof p?.value === 'string' && p.value.trim() ? prose(p.value.trim().replace(/\d{4}-\d\d-\d\d/g, md)) + tag(p, p.label || '待审的资料') : '';
    const pending = said ? `<p class="hl-pending"${tip(p.note)}>${p.label ? `<b>${esc(p.label)}</b>` : ''}<span>${said}</span>${mdTime(p.at) ? `<small>${esc(mdTime(p.at))}</small>` : ''}</p>` : '';
    return `<p class="hl-big${aLock ? ' hl-locked' : ''}"${tip(a.note)}>${big}${aLock ? '' : tag(a, 'AI 已用上的资料日期')}</p>${when ? `<p class="hl-sub">AI 已用上的资料截止 · ${keep(when)} 采用</p>` : ''}${pending}${tiles.length ? `<div class="hl-tiles">${tiles.join('')}</div>` : ''}`;
  }

  // —— AI 能分析哪些数据 ——
  function kindsHtml(v, open) {
    const inv = v.inventory, out = [], im = v.M?.inventory;
    const items = (Array.isArray(inv?.items) ? inv.items : []).filter(x => x?.label && finite(x.count)).sort((a, b) => b.count - a.count);
    if (hid(im)) return `<p class="hl-sub hl-locked">${lock(im, '数据种类和条数')}</p>${enteredHtml(v)}`;
    // 种类排行没给时整张卡不画，本人录入那两项放到“更多数据”
    if (!inv || !(finite(inv.kinds) || items.length)) return '';
    const kinds = finite(inv.kinds) ? inv.kinds : items.length;
    const total = finite(inv.total) ? inv.total : null;
    out.push(`<p class="hl-kbig"><b>${esc(int(kinds))}</b><small>种</small>${total != null ? `<i>·</i>${total >= 1e4 ? `<small>约</small><b>${esc(total >= 1e6 ? int(total / 1e4) : String(+(total / 1e4).toFixed(1)))}</b><small>万条</small>` : `<b>${esc(int(total))}</b><small>条</small>`}` : ''}${tag(im, '数据种类和条数')}</p>`);
    const through = md(inv.through);
    out.push(`<p class="hl-sub">${prose(`手环原件${through ? ` · 截止 ${through}` : ''} · 程序自动数，增删种类跟着变`)}</p>`);
    const scaleMax = Math.max(1, items[0]?.count ?? 0);
    const row = x => {
      const share = x.count / scaleMax * 100;
      const fill = share > 0 ? `<i style="--hl-share:${share}%"></i>` : '';
      return `<li><span class="hl-kind__name">${esc(x.label)}</span><span class="hl-kind__bar" aria-hidden="true">${fill}</span><b${x.count >= 1e5 ? tip(`${int(x.count)} 条`) : ''}>${esc(wan(x.count))}</b></li>`;
    };
    const shown = Math.max(TOP, shownKinds), rest = items.length - shown;
    out.push(`<ul class="hl-kinds">${items.slice(0, open || rest <= 0 ? items.length : shown).map(row).join('')}</ul>`);
    if (rest > 0) out.push(`<button type="button" class="hl-pill hl-more-kinds" aria-expanded="${open}">${open ? '收起' : `其余 ${esc(int(rest))} 种`} <span class="more__chev">›</span></button>`);
    out.push(enteredHtml(v));
    return out.join('');
  }
  function enteredHtml(v) {
    const n = v.entered_records, at = v.entered_date;
    const line = [hid(n) ? lock(n, '本人录入的测量条数') : finite(n?.value) && `本人录入的测量 ${keep(`${int(n.value)} 条`)}` + tag(n, '本人录入的测量条数'),
      hid(at) ? lock(at, '最近一条的日期') : md(at?.value) && `最近一条 ${keep(md(at.value))}` + tag(at, '最近一条的日期')].filter(Boolean);
    return line.length ? `<p class="hl-entered"${tip([n?.note, at?.note].filter(Boolean).join('；'))}>${line.join(' · ')}</p>` : '';
  }

  // —— 更多数据：采集底账、项目规模 ——
  // 一组的截止：都在同一分钟写到几点，同一天写到哪天，不同天各行自己写
  function groupCut(list) {
    const ats = list.map(m => m.at).filter(at => zoned(at));
    if (!ats.length) return { cut: '', each: false };
    const minutes = new Set(ats.map(mdTime)), days = new Set(ats.map(md));
    return minutes.size === 1 ? { cut: `截止 ${mdTime(ats[0])}`, each: false } : days.size === 1 ? { cut: `截止 ${md(ats[0])}`, each: false } : { cut: '', each: true };
  }
  const unitText = m => finite(m?.value) ? `${int(m.value)}${m.unit ? ` ${m.unit}` : ''}` : typeof m?.value === 'string' ? m.value : '';
  function groupHtml(name, list, extra = '') {
    const rows = list.filter(m => m.text);
    if (!rows.length) return '';
    const { cut, each } = groupCut(rows);
    const tag = [extra, cut].filter(Boolean).join(' · ');
    return `<div class="hl-grp"><p class="hl-grp__head"><b>${esc(name)}</b>${tag ? `<span>${esc(tag)}</span>` : ''}</p><ul>${rows.map(m => `<li${tip(m.note)}><span>${prose(m.label)}${m.sub ? `<small>${prose(m.sub)}</small>` : ''}${each && md(m.at) ? `<small>截止 ${keep(md(m.at))}</small>` : ''}</span><b>${m.html || esc(m.text)}</b></li>`).join('')}</ul></div>`;
  }
  function briefGap(v) {
    const b = v.briefs, n = v.briefsCount?.value;
    const diff = finite(b?.stored_total) && finite(b?.total) && n === b.stored_total ? b.stored_total - b.total : 0;
    return diff > 0 ? `比“最近的简报”多的 ${int(diff)} 份，是还没取回完的批次` : '';
  }
  function moreHtml(v) {
    const row = (m, label, text = unitText(m), html = '') => !m ? null : hid(m) ? { at: m.at, label: label || m.label, text: '-', html: lock(m, label || m.label) }
      : text ? { at: m.at, note: m.note || m.scope, label: label || m.label, text, html: (html || esc(text)) + tag(m, label || m.label) } : null;
    // 几处原话难懂，换成人话（数照留）
    const win = v.window_records, winDay = md(win?.at);
    const ledger = [
      row(v.batches), row(v.history_segments),
      row(win, winDay ? `${winDay}这一轮新存的记录` : '最近一轮新存的记录'),
      // 现存设备简报照留；比简报卡的“共 N 份”多出的，是还没取回完的批次（brief_list.stored_total − total）
      v.briefsCount && { ...row(v.briefsCount), sub: briefGap(v) },
      // 种类排行没给时，原来更多数据里的两项条数还放在这里
      ...(kindsHtml(v, false) ? [] : [row(v.steps_records), row(v.sleep_records), row(v.entered_records), row(v.entered_date, '', md(v.entered_date?.value))]),
    ].filter(Boolean);
    const parts = typeof v.code_parts?.value === 'string' ? [...v.code_parts.value.matchAll(/([^\s；;、，,]+)\s*(\d+)\s*行/g)] : [];
    const partsHtml = parts.length ? parts.map(p => `${esc(p[1])} ${esc(int(+p[2]))} 行`).join(' /<br>') : '';
    const scale = [row(v.doc_files), row(v.code_files), v.code_parts && row(v.code_parts, '', parts.length ? parts.map(p => `${p[1]} ${p[2]} 行`).join(' / ') : unitText(v.code_parts), partsHtml)].filter(Boolean);
    const nightly = scale.length && [v.doc_files, v.code_files, v.code_parts].filter(Boolean).every(m => m.cadence === 'nightly') ? '每晚更新' : '';
    return [groupHtml('采集底账', ledger), groupHtml('项目规模', scale, nightly)].filter(Boolean).join('');
  }

  // —— 最近的简报 ——
  function briefsHtml(v, viewer, open) {
    if (hid(v.M?.briefs)) return `<p class="hl-sub hl-locked">${lock(v.M.briefs, '最近的简报')}</p>`;
    const b = v.briefs, items = (Array.isArray(b?.items) ? b.items : []).filter(x => zoned(x?.captured_at));
    const rows = items.slice(0, open ? items.length : BRIEFS).map((x, i) => {
      // 取回方式不知道的（旧简报 unknown）不挂签，留空位让后面一列对齐
      const kind = KIND[x.capture_kind], chip = kind ? `<span class="hl-tag ${kind[1]}">${esc(kind[0])}</span>` : '<span></span>';
      const to = md(x.complete_through);
      // 两版同一颗“在电脑上打开”：本人版用现有打开程序；访客回包没有 open，按钮照摆，点了由共用拦截弹“不是可信设备”的弹窗
      const action = U.artifactAction({ open: x.open || { label: '在电脑上打开' } }, viewer, h => h);
      const act = action ? U.actions({ id: `personal-health-brief-${i}-${x.captured_at}`, title: `简报 ${x.captured_at}` }, [action]) : '';
      const privacy = act ? U.visitorHiddenTag('这份简报的正文', '打开本人电脑上的简报需要可信设备', viewer) : '';
      return `<li class="hl-brief"><span class="hl-brief__at">${esc(mdTime(x.captured_at))}</span>${chip}<span class="hl-brief__to">${to ? `资料到 ${keep(to)}` : ''}</span><span class="hl-brief__act">${act}${privacy}</span></li>`;
    }).join('');
    return rows ? `<ul class="hl-briefs">${rows}</ul>` : '';
  }
  function briefsRight(v, open) {
    if (hid(v.M?.briefs)) return '';
    const b = v.briefs, n = (Array.isArray(b?.items) ? b.items : []).length;
    const total = finite(b?.total) ? `共 ${int(b.total)} 份` : '';
    const all = n > BRIEFS ? `<button type="button" class="hl-all" aria-expanded="${open}">${open ? '收起' : '全部'} <span class="more__chev">›</span></button>` : '';
    return total || all ? `<span class="hl-head-r">${tag(v.M?.briefs, '最近的简报')}${esc(total)}${total && all ? '<i>·</i>' : ''}${all}</span>` : '';
  }

  // 原地展开：种类“其余 N 种”、简报“全部”
  const opened = { kinds: false, briefs: false };
  let lastD = null, lastBoard = null;
  document.addEventListener('click', e => {
    const k = e.target.closest?.('.hl-more-kinds'), a = e.target.closest?.('.hl-all');
    if (!(k || a) || !lastD) return;
    if (k) opened.kinds = !opened.kinds; else opened.briefs = !opened.briefs;
    const v = lastD.healthView, card = k ? 'health-kinds' : 'artifacts', b = blockOf(card);
    if (!b) return;
    if (k) { U.html(b.viz, kindsHtml(v, opened.kinds), false); if (!opened.kinds) refit(); }
    else { head(b, '最近的简报', briefsRight(v, opened.briefs)); U.html(b.viz, briefsHtml(v, viewing, opened.briefs), false); }
  });
  const made = new Map();
  const blockOf = key => made.get(key) || null;

  function board(d, viewer, graphBlock, boardEl) {
    lastD = d; lastBoard = boardEl; viewing = viewer;
    boardEl?.classList.add('pj-board--health');
    wear(d, boardEl);
    const v = d.healthView, out = [];
    if (!v) return out;
    const card = (key, title, html, right = '') => {
      if (!html) return;
      const b = graphBlock(key, '');
      b.group = key; made.set(key, b);
      head(b, title, right);
      U.html(b.viz, html, false);
      out.push(b);
    };
    card('health-answer', 'AI 答健康问题用到哪天', answerHtml(v));
    card('health-kinds', 'AI 能分析哪些数据', kindsHtml(v, opened.kinds));
    card('health-more', '更多数据', moreHtml(v));
    // 卡名取“artifacts”：读数那一排“最近产物 ›”（#artifacts）点过来落在这张卡
    card('artifacts', '最近的简报', briefsHtml(v, viewer, opened.briefs), briefsRight(v, opened.briefs));
    refit();
    return out;
  }
  // “AI 能分析哪些数据”比内容高时（右栏最近改动更高、卡被拉齐），按空当多露几种，不在中间留一大块白；
  // 卡的大小仍由两边定，以后种类再多也一样大，露不下的收在“其余 N 种”
  function fitKinds(again = 2) {
    const b = blockOf('health-kinds'), v = lastD?.healthView;
    if (!b || !v || opened.kinds) return;
    const list = b.viz.querySelector('.hl-kinds'), foot = b.viz.querySelector('.hl-entered'), last = b.viz.querySelector('.hl-more-kinds') || list;
    if (!list || !foot || !last) return;
    const row = list.lastElementChild?.offsetHeight || 34;
    const spare = foot.offsetTop - (last.offsetTop + last.offsetHeight) - row;   // 底下留一行的空，不贴死
    const total = (Array.isArray(v.inventory?.items) ? v.inventory.items : []).filter(x => x?.label && finite(x.count)).length;
    const want = Math.min(total, Math.max(TOP, shownKinds + Math.floor(spare / row)));
    if (want === shownKinds) return;
    shownKinds = want;
    U.html(b.viz, kindsHtml(v, false), false);
    if (again) requestAnimationFrame(() => fitKinds(again - 1));
  }
  const refit = () => requestAnimationFrame(() => requestAnimationFrame(() => fitKinds()));
  let fitTimer;
  window.addEventListener('resize', () => {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(() => {
      const b = blockOf('health-kinds');
      if (b && lastD && shownKinds !== TOP && !opened.kinds) { shownKinds = TOP; U.html(b.viz, kindsHtml(lastD.healthView, false), false); }
      refit();
    }, 260);   // page.js 摆完卡（200 毫秒）以后再量
  });
  document.fonts?.ready?.then(refit);
  // 卡放哪一栏：照图固定；出现别的卡时交回 page.js 按高度摆；窗口窄时排成一栏，先后见 health.css
  const columns = keys => !keys.every(k => k in COLUMNS) ? null : window.matchMedia?.(NARROW).matches ? keys.map(() => 0) : keys.map(k => COLUMNS[k]);

  window.ProjectPages = Object.assign(window.ProjectPages || {}, { 'personal-health': { adapt, board, columns, noArtifacts: true } });
})();

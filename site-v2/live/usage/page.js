// 实况第二层：使用时间（/live/usage/）。Live.watch 读首页，展开前台记录再翻页；null 不当 0。
// 样子照数据页“一组一行，点开成章”：使用时间没有好坏，页头不放灯；页头下面一行“跟平常不一样的”；
// 下面一章一张整宽的卡（LiveViz.board，quiet：不放灯、不排序、默认全展开），每章里的图由 build 搭、set 换数：
//   使用状态 → 使用日历 → 每天用了多久 → 用在哪 → 几点在用 → 专注时间。
(() => {
  'use strict';
  const U = window.LiveUI;
  const Light = window.LiveLight;
  const V = window.LiveViz;
  const C = window.LiveChart;
  const S = window.LiveStat;
  const { esc, sp } = U;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const route = (path) => path + (params.has('fixture') ? `${path.includes('?') ? '&' : '?'}fixture=${encodeURIComponent(params.get('fixture'))}` : '');

  const hero = $('hero');
  const part = (name) => hero.querySelector(`[data-part="${name}"]`);
  const notices = $('notices');
  const rangePicker = $('usage-range');
  const rangeStatus = $('usage-range-status');
  Light.add(hero);
  for (const a of document.querySelectorAll('.stage a[href^="/live/"]')) a.href = route(a.getAttribute('href'));

  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);

  const CAT = V.categoryNames;
  const catHue = (c) => V.categoryHues[c] || 'stone';
  const dur = V.dur;
  const missing = () => U.offline?.() ? '这块没存下来，连上后补上。' : U.collectionText();
  const read = (o, key, format = dur) => S.text(o, key, format);
  const lowerRows = (rows, key) => rows?.some((row) => S.partial(row, key));
  const clock = (iso) => U.time(iso);
  const recentClock = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  const usageMark = name => ({ 'Claude 桌面端': '✳️', ChatGPT: '◎', 'Google Chrome': '🌐',
    '文件资源管理器': '📁', 'Windows 终端': '⌨️', 'PowerShell 7（命令行）': '⌨️' })[name];
  const BJ = 8 * 3600;
  const dayStart = (t) => Math.floor((t + BJ) / 86400) * 86400 - BJ;
  const dayKey = (t) => new Date((t + BJ) * 1000).toISOString().slice(0, 10);
  const hm = (t) => new Date((t + BJ) * 1000).toISOString().slice(11, 16);
  const md = (t) => dayKey(t).slice(5);
  const sec = (iso) => Date.parse(iso) / 1000;
  // 数字旁边写明算到几点：页头和“用在哪”各读各的汇总，截止时刻可能差几分钟（M349）。
  const upTo = (iso) => { const t = sec(iso); return Number.isFinite(t) ? `（截至 ${md(t) === md(Date.now() / 1000) ? '' : md(t) + ' '}${hm(t)}）` : ''; };
  const FOCUS_MIN_SECONDS = 15 * 60;
  function rangeText(window) {
    const from = sec(window?.from), to = sec(window?.to);
    if (!(to > from)) return '';
    const first = dayKey(from), last = dayKey(to), offset = first.slice(0, 4) === last.slice(0, 4) ? 5 : 0;
    return `${first.slice(offset)} ${hm(from)} 至 ${last.slice(offset)} ${hm(to)}`;
  }
  function whereRange(d, key) {
    const block = d?.blocks?.[key];
    if (block?.window) return rangeText(block.window);
    // Earlier saved packets kept only the end of this query, separate from the status timeline.
    const days = { '近 24 小时': 1, '近 72 小时': 3, '近 7 天': 7, '近一个月': 30 }[d?.window?.label];
    const end = sec(block?.at);
    return days && Number.isFinite(end)
      ? rangeText({ from: new Date((end - days * 86400) * 1000).toISOString(), to: block.at }) : '';
  }
  // 用在哪、专注时间读的是另一轮汇总的前台记录，截止时刻可能比使用状态时间带早一些：写明早多少，免得当成同一段（M349）。
  function foregroundLag(d, to) {
    const end = sec(d?.window?.to), t = sec(to);
    return end - t >= 60 ? `前台记录汇总到 ${hm(t)}，比使用状态时间带（到 ${hm(end)}）早 ${dur(end - t)}` : '';
  }
  function sourceReading(iso, meta) {
    if (!iso) return '';
    const old = U.offline?.() || meta?.state === 'stale' || Date.now() - Date.parse(iso) > 120000;
    return `${old ? '上次记录' : '记录到'} ${clock(iso)}`;
  }

  let viewer = 'public', usage = null, rawUsage = null, at = null, drawnOffline = false;
  let shownRange = '72h';
  const rangeLabel = (range = shownRange) => rangePicker.querySelector(`[data-range="${range}"]`).textContent;
  const block = (key, host, view) => V.block(host, view, () => usage, key);

  // —— 算几样：某状态每天多久、最长一段、和平常比 ——
  function perDay(row, idx, states = usage?.states) {
    const out = new Map(), covered = new Map(), gaps = new Map();
    if (!row?.spans?.length) return { out, covered, gaps };
    const from = sec(row.from), to = sec(row.to), spans = row.spans;
    spans.forEach(([t, s], i) => {
      let a = Math.max(t, from);
      const b = Math.min(spans[i + 1]?.[0] ?? to, to);
      while (a < b) {
        const ds = dayStart(a), e = Math.min(b, ds + 86400), k = dayKey(ds);
        if (s != null && states?.[s] && states[s].id !== 'unrecorded') covered.set(k, (covered.get(k) || 0) + e - a);
        else { if (!gaps.has(k)) gaps.set(k, []); gaps.get(k).push([a, e]); }
        if (s === idx) out.set(k, (out.get(k) || 0) + e - a);
        a = e;
      }
    });
    return { out, covered, gaps };
  }
  // 横带里没采到状态的时段（缺测）：合计、段数、最长一段；结尾还没到下一轮记录的那一小段不算。
  function gapSpans(row) {
    const out = { total: 0, count: 0, longest: 0 };
    if (!row?.spans?.length) return out;
    const from = sec(row.from), to = Math.min(sec(row.to), sec(row.recorded_to || row.to));
    row.spans.forEach(([t, s], i) => {
      if (s != null) return;
      const a = Math.max(t, from), b = Math.min(row.spans[i + 1]?.[0] ?? to, to);
      if (!(b > a)) return;
      out.total += b - a; out.count++; out.longest = Math.max(out.longest, b - a);
    });
    return out;
  }
  const workIdx = () => usage?.states?.findIndex((s) => s.id === 'work' || s.id === 'active') ?? -1;
  function longestWork(row, idx) {
    if (!row?.spans?.length) return null;
    const to = sec(row.to);
    let best = null;
    row.spans.forEach(([t, s], i) => { if (s !== idx) return; const b = Math.min(row.spans[i + 1]?.[0] ?? to, to); if (!best || b - t > best[1] - best[0]) best = [t, b]; });
    return best;
  }
  // 统计时段从某天中间开始（近 72 小时从三天前的这一刻算），那一天只读到后半天：返回起点，整天的返回 null。
  function cutStart(d, day) {
    const from = sec(d?.window?.from), midnight = sec(`${day}T00:00:00+08:00`);
    return Number.isFinite(from) && midnight < from && from < midnight + 86400 ? from : null;
  }
  const span = () => sp(usage?.window?.label || rangeLabel()).replace(/^近\s*/, '');
  function versus(now, before, what = '') {
    if (now == null || before == null) return '';
    const d = now - before;
    const period = span(), past = `${/^\d/.test(period) ? '前 ' : '前'}${period}`;
    if (Math.abs(d) < 5 * 60) return `和${past}差不多`;
    return `比${past}${d > 0 ? '多' : '少'}${what} ${dur(Math.abs(d))}`;
  }

  // ================= 页头 + 跟平常不一样的 =================
  function headText(d) {
    const s = d?.summary, w = sp(d?.window?.label || rangeLabel());
    const activeLabel = typeof s?.active_label === 'string' && s.active_label.trim();
    const focusLabel = typeof s?.focus_label === 'string' && s.focus_label.trim();
    const active = s?.active != null && `${activeLabel ? `${w} ${activeLabel}` : `${w}用了`} ${read(s, 'active')}${upTo(d?.window?.to)}`;
    const focus = s?.focus != null && (active || focusLabel) && `${active ? '' : `${w} `}${focusLabel || '专注时间'} ${read(s, 'focus')}`;
    return [active, focus].filter(Boolean).join(' · ') || missing();
  }
  function renderHero(d) {
    const display = ['ok', 'green'].includes(d?.level) ? { ...d, level: undefined } : d;
    const heading = headText(d);
    U.html(part('head'), U.status(display).lamp + (U.offline?.() && heading === missing() ? `<span class="vz-none">${heading}</span>` : U.head(heading, { lamp: false })));
    const reasons = d?.why || d?.reason ? [d.why || d.reason] : [...new Set((d?.groups || []).filter((g) => g.level === 'red' || g.level === 'yellow').map((g) => g.reason).filter(Boolean))], why = reasons.map(sp).join('；');
    Light.tone(hero, display);
    const s = d?.summary, top = d?.apps?.[0], attention = d?.attention_groups ?? d?.attention_count;
    // 和下面“电脑或手机在用的时间”那句对比用同一个判断：两段有一段没记全就都不比。
    const comparable = window.UsageUnion?.comparable(d?.comparison) !== false;
    const said = [...reasons, attention > 0 && `${attention} 组要留意`, s && comparable && !S.partial(s, 'active') && !S.partial(s.before, 'active') && versus(s.active, s.before?.active, '用了'), top && `${lowerRows(d.apps, 'seconds') ? '记录里排在前面的是' : '用得最多的是'} ${sp(top.name)}（${read(top, 'seconds')}）`].filter(Boolean);
    const visibility = d?.namesHidden ? U.fieldHtml({ visibility: 'owner' }, { name: '部分使用记录的名称', place: 'body', kind: viewer }) : '';
    part('note').hidden = !(said.length || visibility || U.status(d).note);
    U.html(part('note'), U.status(d).note + said.map((x) => `<span>${U.fieldHtml(x, { name: '使用概况', kind: viewer })}</span>`).join('') + visibility);
    renderLinks(d);
  }
  function renderLinks(d) {
    const g = d?.grafana?.href;
    const back = `<a class="more more--link" href="${esc(route('/live/computer/'))}">电脑 <span class="more__chev">›</span></a>`;
    const graf = !g ? '' : `<a class="more more--link" data-needs-pc href="${esc(g)}" target="_blank" rel="noopener">Grafana <span class="more__chev">↗</span></a>`;
    U.html(part('links'), back + graf);
  }

  function renderOdd(d) {
    const out = [];
    const days = (d?.days || []).filter((x) => x.active != null && !cutStart(d, x.day));
    const done = days.slice(0, -1).slice(-14);
    if (d?.summary?.active != null && !S.partial(d.summary, 'active') && !lowerRows(done, 'active') && done.length >= 5 && d.window) {
      const n = Math.max((sec(d.window.to) - sec(d.window.from)) / 86400, 1);
      const avg = done.reduce((a, x) => a + x.active, 0) / done.length, diff = d.summary.active / n - avg;
      const who = n >= 1.5 ? `这 ${Math.round(n)} 天平均每天` : '这一天';
      if (Math.abs(diff) >= 30 * 60) out.push(['pink', `${who}比近两周${diff > 0 ? '多' : '少'}用 <b>${U.fieldHtml(dur(Math.abs(diff)))}</b>`]);
    }
    // 这一行只放能写出“比平常差多少”的；熬夜到几点、最长一段专注后台没有平常值，不放。
    $('odd').hidden = !out.length;
    U.html($('odd'), out.length ? `<span class="usage-odd__k">跟平常不一样的</span>${out.map(([h, t]) => `<span class="odd-pill"><i style="--c:${V.hues[h]}"></i>${t}</span>`).join('')}` : '');
  }

  // ================= 各章 =================
  function titleRows(d) {
    const appCat = new Map((d?.apps || []).map((a) => [a.name, a.category]));
    return d?.titles ? d.titles.map((t, i) => { const title = visibleTitle(t); return S.row({ key: String(t.key ?? t.id ?? `title:${i}`), visibility: t.visibility, private_value: t.title_field ?? t.title, name: sp(title ?? t.app), name_tag: title != null ? titleTag(t) : appTag(t), visitor_tag: title != null ? appTag(t) : titleTag(t), sub: title != null ? sp(t.app) : Number.isSafeInteger(t.window_title_count) && t.window_title_count > 0 ? `${countWords(t.window_title_count)}窗口标题` : '', value: t.seconds, text: t.seconds == null ? (U.offline?.() ? '' : U.collectionText('使用时长', t)) : dur(t.seconds), hue: catHue(appCat.get(t.app)) }, t, 'seconds'); }) : null;
  }
  // 本人版：后台在窗口标题这一条（排行 titles、最近前台 recent）的 visitor_labels 里标了窗口标题（title、'$'）或程序名（app）的，
  // 在原位挂签：标题的签挂在标题那一行，程序名的签挂在程序名旁，两样都标了就各挂各的；没标的不挂。专注时间（focus）只画色条、不写标题，没有挂签的地方。程序排行（apps）用键 name。
  const titleTag = t => viewer !== 'owner' ? '' : U.visitorLabel(t, ['$', 'title'], '这条窗口标题', viewer);
  const appTag = t => viewer !== 'owner' ? '' : U.visitorLabel(t, 'app', '这个程序名', viewer);
  function visibleTitle(row) {
    if (viewer === 'public' && row.visibility === 'owner') return null;
    const field = row.title;
    if (field == null || typeof field !== 'object') return field;
    if ((field.visibility === 'owner' || field.public === 'owner') && (viewer === 'public' || field.text == null && field.value == null)) return null;
    const text = field.text ?? field.value;
    return typeof text === 'string' || typeof text === 'number' ? String(text) : null;
  }
  // 新私事规则（本人 11-24 02:56）：窗口标题访客版不给，原位按后台给的条数拼一句普通字，说清有多少个、本人版能看到全部；
  // window_title_count 是 0 就是已读且空，null 是没读到或来源本来没有清单：不编数。
  // 本人版不再在整张清单下挂一个“访客看不到”：现在访客回包里给了窗口标题，访客看不到或换了说法的由后台逐条标在 visitor_labels 上，逐条挂签（titleTag、appTag）。
  const countWords = n => n >= 10000 ? `${(Math.round(n / 1000) / 10).toLocaleString('zh-CN')} 万个` : `${n.toLocaleString('zh-CN')} 个`;
  // 排行用 data.window_title_count（按程序合并的不同标题数）；最近的前台记录用 data.recent_window_title_count（带标题的记录次数），两个数不混用（后台 03:53 定稿）。
  function titleVisibility(rows, d = usage, recentList = false) {
    if (!rows?.length) return '';
    if (viewer === 'owner') return '';
    const n = recentList ? d?.recent_window_title_count : d?.window_title_count, label = typeof d?.window?.label === 'string' ? d.window.label.trim() : '';
    const scope = label ? `${label}的` : '这段时间的', valid = Number.isSafeInteger(n) && n >= 0;
    // 访客回包里标题给了就照画，只有标题真被收起的才写那句。
    if (valid && n === 0 || !rows.some(r => {
      const title = r.title_field ?? r.title;
      return r.visibility === 'owner' || title?.visibility === 'owner' || title?.public === 'owner' || title?.hidden;
    })) return '';
    return esc(recentList ? valid ? `这里是${scope} ${n.toLocaleString('zh-CN')} 次前台记录里的窗口标题，本人版能看到全部，所以不予展示` : `这里是${scope}前台记录里的窗口标题，本人版能看到全部，所以不予展示`
      : valid ? `这里是${scope} ${countWords(n)}窗口标题，本人版能看到全部，所以不予展示` : `这里是${scope}窗口标题，本人版能看到全部，所以不予展示`);
  }
  function appRows(d) {
    return d?.apps ? d.apps.map((a, i) => S.row({ key: `app:${i}`, private_value: a.name_field ?? a.name, name: sp(U.programName(a.name)), mark: usageMark(a.name), visitor_tag: viewer === 'owner' ? U.visitorLabel(a, ['$', 'name'], '这个程序名', viewer) : '', sub: a.name_field && typeof a.name_field === 'object' ? a.name_field : CAT[a.category] || '', value: a.seconds, text: a.seconds == null ? (U.offline?.() ? '' : U.collectionText('使用时长', a)) : dur(a.seconds), hue: catHue(a.category) }, a, 'seconds')) : null;
  }
  const statesForView = (states) => states.map((s) => ({ ...s, label: { work: '在用', active: '在用', sleep: '睡着' }[s.id] || s.label, note: '' }));
  // 屏幕关闭、睡着、关机这几样，后台在这段时间一条记录都没有时给来源说明（summary.state_notes）：
  // 图例上不写一排“0 分钟”（像测过是零），写“没有这类记录”和来源说明；有记录的照常写时长，0 就是测过的 0。
  const STATE_NOTE_KEYS = { 'screen-off': 'display_off', sleep: 'sleep', off: 'off' };
  // 关机离线怎么算（本人 11-23 17:20：电脑卡死期间属于关机，不属于缺测）；哪段算关机由后台按这条算好给，页面照画（M593）
  const OFF_NOTE = '开机或重启（◆）前面那段空白，从最后一次采到算起；卡死后重启也算';
  function stateNotes(d) {
    const notes = d?.summary?.state_notes, out = new Map();
    if (!notes || typeof notes !== 'object') return out;
    for (const [id, key] of Object.entries(STATE_NOTE_KEYS)) {
      const note = notes[key], total = d.summary[key];
      if (typeof note === 'string' && note.trim() && !(total > 0)) out.set(id, sp(note).replace(/缺测时段的状态无法判断。?$/, '').trim());
    }
    return out;
  }
  function dayStrips(day) {
    if (!day) return [];
    const from = sec(day.from), to = sec(day.to);
    if (!(to > from)) return [];
    const step = Math.max(1, Math.ceil((to - from) / (3 * 86400))) * 86400;
    return Array.from({ length: 3 }, (_, i) => {
      const a = from + i * step, b = Math.min(a + step, to);
      const spans = (day.spans || []).flatMap(([t, state], j, all) => {
        const end = Math.min(all[j + 1]?.[0] ?? to, b), start = Math.max(t, a);
        return end > start ? [[start, state]] : [];
      });
      return { ...day, from: new Date(a * 1000).toISOString(), to: new Date(b * 1000).toISOString(), spans,
        restart_points: day.restart_points?.filter(t => a <= t && t < b) };
    }).filter(row => sec(row.to) > sec(row.from));
  }
  function rankPercent(rows, partial) {
    if (!rows || partial || rows.some(row => row.private_count || row.value == null)) return rows;
    const total = rows.reduce((sum, row) => sum + row.value, 0);
    return total ? rows.map(row => ({ ...row, percent: row.value / total * 100 })) : rows;
  }
  function rankTrailing({ percent }) {
    return percent == null ? '' : `<span class="use-rank-pct">${percent > 0 && percent < 1 ? '&lt;1' : Math.round(percent)}%</span>`;
  }
  function usageForView(d) {
    if (!d) return d;
    let namesHidden = false;
    const named = (value, fallback) => { if (value && typeof value === 'object' && (value.hidden || (value.visibility === 'owner' || value.public === 'owner' || value.rewrite === 'pending') && value.value == null && value.text == null)) { namesHidden = true; return fallback; } return value; };
    const currentFocus = d.focus_min_seconds === FOCUS_MIN_SECONDS;
    const program = (value, fallback) => U.programName(named(value, fallback));
    const focus = currentFocus ? d.focus?.map(f => ({ ...f, app: program(f.display_label ?? f.app, '专注片段') })) : null;
    const summary = d.summary && { ...d.summary };
    if (summary && !currentFocus) summary.focus_count = summary.focus = null;
    if (summary && focus?.length && lowerRows(focus, 'seconds') && !S.partial(summary, 'focus')) {
      summary.q = 'partial';
      summary.partial = [...new Set([...(Array.isArray(summary.partial) ? summary.partial : []), 'focus'])];
    }
    const result = { ...d, window: d.window && { ...d.window, label: named(d.window.label, '所选时段') },
      states: d.states?.map((s, i) => ({ ...s, label: named(s.label, { work: '在用', active: '在用', away: '人不在', sleep: '睡着', off: '关机离线', 'screen-off': '屏幕关闭' }[s.id] || `状态 ${i + 1}`) })),
      categories: d.categories?.map((c, i) => ({ ...c, label: named(c.label, `分类 ${i + 1}`) })), apps: d.apps?.map((a, i) => ({ ...a, name_field: a.display_label ?? a.name, name: program(a.display_label ?? a.name, `程序 ${i + 1}`) })),
      titles: d.titles?.map((t, i) => ({ ...t, title_field: t.title, app: program(t.display_label ?? t.app, `窗口 ${i + 1}`), title: named(t.title, `窗口 ${i + 1}`), visibility: t.visibility || t.title?.visibility })),
      summary, focus, recent: d.recent?.map((r, i) => ({ ...r, title_field: r.title, app: program(r.display_label ?? r.app, `前台记录 ${i + 1}`), title: named(r.title, '窗口标题'), visibility: r.visibility || r.title?.visibility })) };
    return { ...result, namesHidden };
  }
  async function fetchUsagePart(query, signal) {
    let token = '';
    try { token = localStorage.getItem('wly-cockpit-device') || ''; } catch { /* 存储关闭时按访客读。 */ }
    const { url, headers, credentials } = window.Live.readRequest('computer/usage?' + query,
      /^[A-Za-z0-9_-]{43}$/.test(token) ? token : '');
    const response = await fetch(url, { headers, cache: 'no-store',
      credentials, signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]) });
    return { response, packet: await response.json() };
  }
  const sync = C.sync();
  const chapters = [
    { key: 'day', name: '这三天', pic: '/live/img/s1900-usage-clock-v1.webp', palette: ['apricot', 'pink'],
      line: (d) => { const w = longestWork(d?.day, workIdx()); return w ? `连续在用最长一段 ${S.partial(d.day, 'spans') ? '至少 ' : ''}${dur(w[1] - w[0])}（${md(w[0])} ${hm(w[0])}–${md(w[1]) === md(w[0]) ? '' : md(w[1]) + ' '}${hm(w[1])}）` : ''; },
      build(el) {
        el.innerHTML = '<div data-x="tl"></div><p class="use-note" data-x="tl-note" hidden></p>';
        const rows = ['day', 'day1', 'day2'].map(key => ({ key, label: '' }));
        const tl = block('day', el.firstElementChild, V.timeline(el.firstElementChild, { rows, actualEnd: true }));
        return { set: () => {
          const d = usage, unnoted = stateNotes(d), states = statesForView(d?.states || []).map(s => s.id === 'off' ? { ...s, note: OFF_NOTE } : unnoted.has(s.id) ? { ...s, note: unnoted.get(s.id) } : s), payload = {};
          const gap = states.length;
          states.push({ id: 'unrecorded', label: '缺测', hue: 'stone' });
          const strips = dayStrips(d?.day && { ...d.day, spans: d.day.spans?.map(([t, i]) => [t, i ?? gap]) });
          rows.forEach((r, i) => {
            const strip = strips[i], node = el.querySelector(`[data-row="${r.key}"]`);
            if (node) node.hidden = !!d?.day && !strip;
            if (strip && d?.states?.length) payload[r.key] = { ...strip, label: rangeText(strip),
              short: `${dayKey(sec(strip.from)).slice(5)} 至 ${dayKey(sec(strip.to)).slice(5)}` };
          });
          tl.set(d ? { states, rows: payload } : null);
          const note = el.querySelector('[data-x="tl-note"]');
          const missed = gapSpans(d?.day);
          // 横带上画着这类的段（比如后台算好的关机），图例就照段写时长，不写“没有这类记录”
          const drawn = new Set(strips.flatMap(st => st.spans.map(([, i]) => states[i]?.id)));
          for (const id of unnoted.keys()) {
            if (drawn.has(id)) continue;
            const vals = el.querySelector(`.vz-legend__item[data-state="${CSS.escape(id)}"] .vz-legend__vals`);
            if (vals) vals.innerHTML = '<span>没有这类记录</span>';
          }
          note.textContent = [sourceReading(d?.day?.recorded_to, d?.blocks?.day),
            missed.total >= 60 && `缺测是电脑没关机、却没采到使用状态的时段（开机后还没采到的那一小会儿也算），不算在用也不算离开（共 ${dur(missed.total)}，${missed.longest <= 120 ? '都是一两分钟以内的零碎空档' : `最长一段 ${dur(missed.longest)}`}）`,
            d?.day?.restart_points?.length ? '◆ 是开机或重启的时刻，它前面那段空白算关机（卡死后重启也算），从最后一次采到算起' :
              d?.day && d.day.restart_points === null ? '暂时读不到系统关机记录' : ''].filter(Boolean).join(' · ');
          note.hidden = !note.textContent;
          if (S.partial(d?.day, 'spans')) el.querySelectorAll('.vz-legend__vals > span').forEach(n => { if (!n.textContent.includes('至少') && !unnoted.has(n.closest('[data-state]')?.dataset.state)) n.append(' · 至少'); });
        } };
      } },
    { key: 'year', name: (d) => {
      const { first, days } = yearDays(d);
      if (!first) return '这一年';
      const [year, month] = first.split('-');
      return `${days.at(-1).day.startsWith(year) ? '' : `${year} 年 `}${Number(month)} 月起`;
    }, pic: '/live/img/s1900-usage-notebook-v1.webp', palette: ['apricot', 'violet'],
      line: () => '',
      build(el) {
        el.innerHTML = `<div class="year-row"><div><div data-x="cal"></div><div class="vz-heat__key" data-x="cal-key" hidden><span class="use-key__part"><span>用得少</span>${[35, 51, 67, 84, 100].map((p) => `<i style="background:color-mix(in srgb, #ce557f ${p}%, #fff)"></i>`).join('')}<span>用得多</span></span><span class="use-key__part"><i class="vz-cal__dot is-zero"></i><span>灰点：那天有记录、没用</span></span><span class="use-key__part"><i class="vz-cal__dot is-none"></i><span>空心圈：那天没有记录</span></span></div><p class="use-note" data-x="cal-span"></p></div><div class="year-sum"><div class="year-sum__k">累计在用</div><div class="year-sum__v" data-x="total"></div><div class="year-sum__sub" data-x="best"></div></div></div>`;
        const calHost = el.querySelector('[data-x="cal"]'), cal = block('year', calHost, V.calendar(calHost, {
          unit: '秒', weekdays: ['一', '二', '三', '四', '五', '六', '日'],
          color: value => `color-mix(in srgb, #ce557f ${Math.round(35 + 65 * Math.min(value / 86400, 1))}%, #fff)`,
        }));
        return { set: () => {
          const k = yearDays(usage);
          cal.set(usage?.year ? { days: k.days, unit: '秒' } : null);
          el.querySelector('[data-x="cal-key"]').hidden = !k.days.length;
          const start = k.days[0]?.day, end = k.days.at(-1)?.day, first = k.first;
          U.html(el.querySelector('[data-x="cal-span"]'), !start ? '' : k.history
            ? `${start} 至 ${end}。${first && first !== start ? `最早有记录的是 ${first}，此前没有记录。` : ''}`
            : '旧读数只含部分日期。');
          const yearState = usage?.deferred?.year && usage.blocks?.year?.state;
          const unread = yearState === 'computing' ? '正在读…' : yearState === 'unavailable' ? '暂时读不到' : usage?.year ? '没有使用记录' : missing();
          U.html(el.querySelector('[data-x="total"]'), k.total != null ? `<b>${k.lower ? '至少 ' : ''}${Math.round(k.total / 3600)}</b> <small>小时</small>` : `<span class="vz-none">${unread}</span>`);
          U.html(el.querySelector('[data-x="best"]'), k.best ? `最长的一天 ${k.lower ? '至少 ' : ''}${U.fieldHtml(dur(k.best.value))} · ${U.fieldHtml(k.best.day)}` : '');
        } };
      } },
    { key: 'days', name: '每天用了多久', palette: ['teal', 'apricot'],
      // 日均只算整天：统计时段起点那天只读到后半天，算进去会把日均拉低。
      line: (d) => { const l = daysForView(d); if (!l?.length) return ''; const a = l.slice(-8, -1).filter((x) => x.active != null && !cutStart(d, x.day)); return a.length ? `${a[0].day.slice(5)}–${a.at(-1).day.slice(5)} ${a.length} 个整天日均 ${lowerRows(a, 'active') ? '至少 ' : ''}${dur(a.reduce((s, x) => s + x.active, 0) / a.length)}` : ''; },
      build(el) {
        el.innerHTML = `<div class="use-two use-days"><div><div data-x="days"></div><p class="use-compare-key" data-x="days-key"></p></div><div><div data-x="cmp"></div><p class="use-compare-key" data-x="cmp-key"></p></div></div>`;
        const days = V.bars(el.querySelector('[data-x="days"]'), { title: '每天的在用时长', ceil: 24 * 3600, axisStep: 6 * 3600, labelWidth: 34, series: [{ id: 'active', label: '在用', hue: 'pink' }] });
        // 右图每根柱是一天：浅色是上周同一天，深色是这一天；图例的数随指着的那一天变，不是 7 天合计。
        const cmp = V.bars(el.querySelector('[data-x="cmp"]'), { title: '近 7 天每天和上周同一天比', ceil: 24 * 3600, axisStep: 6 * 3600, series: [{ id: 'last', label: '上周同一天', hue: 'apricot', soft: true }, { id: 'this', label: '当天', hue: 'pink' }] });
        return { set: () => {
          const list = comparisonDays(usage), key = el.querySelector('[data-x="cmp-key"]');
          const cutoff = comparisonCutoff(usage, list);
          renderDays(usage, days, cmp, list, cutoff);
          const first = daysForView(usage)?.[0], cut = first && cutStart(usage, first.day);
          U.html(el.querySelector('[data-x="days-key"]'), `<span><i style="--c:${V.hues.pink}"></i>在用时长</span>`
            + (cut ? `<span>${esc(first.day.slice(5))} 从 ${esc(hm(cut))} 算起（${esc(sp(usage?.window?.label || rangeLabel()))}的起点）</span>` : ''));
          key.hidden = list.length < 14;
          if (!key.hidden) U.html(key, [['上周同一天', list.slice(-14, -7), 'apricot'], ['当天', list.slice(-7), 'pink']]
            .map(([name, rows, hue]) => `<span><i style="--c:${V.hues[hue]}"></i>${name} ${rows[0].day.slice(5)}–${rows.at(-1).day.slice(5)}</span>`).join('')
            + `<span>每根柱是一天，不是 7 天合计</span>`
            + (cutoff ? `<span>今天只算到 ${esc(hm(cutoff))}，上周同一天按全天算</span>` : ''));
        } };
      } },
    { key: 'where', name: '用在哪', pic: '/live/img/s1900-usage-apps-v1.webp', palette: ['blue', 'teal'],
      line(d) {
        const c = d?.categories?.slice().sort((a, b) => b.seconds - a.seconds)[0], label = c && sp(c.label || CAT[c.id] || c.id);
        const total = d?.categories?.reduce((s, x) => s + x.seconds, 0);
        const share = c && total ? lowerRows(d.categories, 'seconds') ? `${label} ${read(c, 'seconds')}` : `${Math.round(c.seconds / total * 100)}% 的时间在${label}` : '';
        const dates = whereRange(d, 'categories');
        return [share, dates && `${dates}（北京时间）`].filter(Boolean).join(' · ');
      },
      build(el) {
        el.innerHTML = `<div class="use-where">
          <p class="use-note" data-x="where-lag" hidden></p>
          <div data-x="share"></div>
          <div><p class="use-two__k">哪个程序在前台最久<small>只算人在用（键鼠在动）的时候</small></p><p class="use-note" data-x="apps-dates" hidden></p><div data-x="apps"></div></div>
          <div class="use-windows"><p class="use-two__k">窗口标题排行</p><p class="use-note" data-x="titles-dates" hidden></p><div data-x="titles"></div><p class="use-note" data-x="tnote" hidden></p></div>
        </div>`;
        const shareHost = el.querySelector('[data-x="share"]'), appHost = el.querySelector('[data-x="apps"]'), titleHost = el.querySelector('[data-x="titles"]');
        const shareOpts = { center: '应用使用时长' }, share = block('categories', shareHost, V.share(shareHost, shareOpts));
        // 避免逐条入场反复测布局。窗口标题可有上千条，沿用分批展开。
        const apps = block('apps', appHost, V.rank(appHost, { mark: true, animate: false, trailing: rankTrailing }));
        const titles = block('titles', titleHost, V.rank(titleHost, { show: 24, batch: 100, animate: false, trailing: rankTrailing,
          more: count => `展开（还有 ${count} 条）` }));
        const markShare = () => {
          shareHost.querySelectorAll('.vz-share__pct').forEach(pct => { if (pct.textContent === '0%') pct.textContent = '<1%'; });
          if (!lowerRows(usage?.categories, 'seconds')) return;
          shareHost.querySelectorAll('.vz-share__row').forEach((el) => { const c = usage.categories.find((c) => c.id === el.dataset.id); U.html(el.querySelector('.vz-share__v'), U.fieldHtml(read(c, 'seconds'))); el.querySelector('.vz-share__pct').hidden = true; });
          const known = usage.categories.filter((c) => c.seconds != null), total = known.length ? known.reduce((n, c) => n + c.seconds, 0) : null;
          U.html(shareHost.querySelector('.vz-share__mid'), `<em>${total == null ? (U.offline?.() ? '' : U.collectionText()) : `至少 ${U.fieldHtml(dur(total))}`}</em><span>已读到的时长</span>`);
        };
        shareHost.addEventListener('pointerover', markShare); shareHost.addEventListener('pointerleave', markShare);
        return { set: () => {
          const d = usage;
          const lag = el.querySelector('[data-x="where-lag"]');
          lag.textContent = foregroundLag(d, d?.blocks?.categories?.window?.to);
          lag.hidden = !lag.textContent;
          for (const key of ['apps', 'titles']) {
            const node = el.querySelector(`[data-x="${key}-dates"]`), dates = whereRange(d, key);
            node.hidden = !dates || dates === whereRange(d, 'categories');
            node.textContent = dates;
          }
          shareOpts.center = `应用使用时长${upTo(d?.blocks?.categories?.window?.to ?? d?.blocks?.categories?.at)}`;
          share.set(d?.categories ? d.categories.map((c) => ({ id: c.id, label: c.label || CAT[c.id] || c.id, value: c.seconds, hue: catHue(c.id) })) : null);
          markShare();
          const programs = U.mergePrivateRows(appRows(d), { value: r => r.private_value, kind: viewer });
          apps.set(rankPercent(programs, lowerRows(d?.apps, 'seconds')));
          const hidden = titleVisibility(d?.titles);
          const windows = U.mergePrivateRows(titleRows(d), { value: r => r.private_value, kind: viewer });
          titles.set(rankPercent(windows, lowerRows(d?.titles, 'seconds')));
          const note = el.querySelector('[data-x="tnote"]');
          note.hidden = !hidden;
          U.html(note, hidden);
        } };
      } },
    { key: 'hours', name: '几点在用', pic: '/live/img/head-usage.webp', palette: ['apricot', 'apricot'],
      line: (d) => { const m = d?.hours?.minutes; if (!m?.some((r) => r.some((v) => v != null))) return ''; if (S.partial(d.hours, 'minutes')) return d.hours.gap || '只读到了部分时段'; const by = Array.from({ length: 24 }, (_, h) => m.reduce((s, r) => s + (r[h] || 0), 0)); const top = by.indexOf(Math.max(...by)); return `最常在用的是 ${top}:00–${top + 1}:00`; },
      build(el) {
        el.innerHTML = '<div data-x="heat"></div>';
        const heat = block('hours', el.firstElementChild, V.heatmap(el.firstElementChild, { max: 60, what: '用了', today: true, ramp: 'hue', hue: 'pink' }));
        el.firstElementChild.addEventListener('pointerover', () => { const t = el.querySelector('.vz-tip span:last-child'); if (t && S.partial(usage?.hours, 'minutes') && t.textContent !== U.collectionText()) t.textContent = t.textContent === '没用' ? '至少 0 分钟' : `至少 ${t.textContent}`; });
        return { set: () => heat.set(usage?.hours ? { days: usage.hours.days, minutes: usage.hours.minutes } : null) };
      } },
    { key: 'focus', name: '专注时间', pic: '/live/img/s1900-usage-headphones-v1.webp', palette: ['pink', 'violet'],
      line: (d) => d?.summary?.focus_count > 0 ? `${read(d.summary, 'focus_count', String)} 段 · 共 ${read(d.summary, 'focus')}` : '',
      build(el) {
        el.innerHTML = `<p class="use-note" data-x="focus-min">同一应用连续在前台至少 ${FOCUS_MIN_SECONDS / 60} 分钟，算作一段。</p>
          <p class="use-note" data-x="focus-dates" hidden></p><div data-x="track-wrap"><div class="focus-track" data-x="track"></div></div><div class="use-focus-key" data-x="focus-key"></div>
          <section class="use-recent" aria-labelledby="recent-foreground-heading"><h3 class="use-two__k" id="recent-foreground-heading">最近的前台记录</h3><p class="use-note">每次切换到前台各记一条，按开始时间从近到远排列。</p><div data-x="recent"></div><p class="use-note" data-x="rcount" role="status" hidden></p><p class="use-note" data-x="rnote"></p></section>`;
        const recentHost = el.querySelector('[data-x="recent"]');
        const trackHost = el.querySelector('[data-x="track"]');
        const track = block('focus', el.querySelector('[data-x="track-wrap"]'), { set: (d) => renderTrack(trackHost, d) });
        new ResizeObserver(() => track.set(usage)).observe(trackHost);
        let snapshot = null, pending = null, notice = '';
        const cursorOf = (page) => page?.has_more === true && page.next_cursor || null;
        const recent = block('recent', recentHost, V.rank(recentHost, {
          show: 5, batch: 200, mark: true, bar: false,
          more: (n) => snapshot?.paged ? '展开' : `展开（还有 ${n} 条）`,
          missing: () => snapshot ? '暂时读不到' : '',
          hasMore: () => snapshot?.paged ? !!snapshot.cursor : null,
          remaining: () => Number.isInteger(snapshot?.total) ? snapshot.total - snapshot.count : null,
          onToggle(open) {
            if (open) loadRecent();
            else { notice = ''; cancelRecent(); showRecent(usage); }
          },
          loadMore: loadRecent,
        }));
        function recentRows(d, offset = 0) {
          if (!d?.recent) return null;
          const hues = new Map();
          for (const a of d.apps || []) if (!hues.has(a.name)) hues.set(a.name, catHue(a.category));
          return d.recent.map((r, i) => ({
            key: `recent:${offset + i}`, name: r.app, mark: usageMark(r.app), hue: hues.get(r.app) || catHue(), name_tag: appTag(r), visitor_tag: titleTag(r),
            get sub() { return [Number.isFinite(Date.parse(r.at)) && recentClock.format(new Date(r.at)), visibleTitle(r), S.partial(r, 'seconds') && r.gap].filter(Boolean).map(sp).join(' · '); },
            get text() { return read(r, 'seconds', n => n >= 60 ? dur(n) : Math.round(n) + ' 秒'); },
          }));
        }
        function cancelRecent() {
          pending?.abort();
          pending = null;
          recent.setBusy?.(false);
        }
        function showRecentNote() {
          const node = el.querySelector('[data-x="rcount"]');
          const total = snapshot?.total;
          const line = [Number.isInteger(total) ? `所选时段共 ${total.toLocaleString('zh-CN')} 条前台记录` : '', notice].filter(Boolean).join(' · ');
          node.hidden = !line;
          U.html(node, line);
        }
        function showRecentPrivacy(rows) {
          const note = el.querySelector('[data-x="rnote"]'), privacy = titleVisibility(rows, usage, true);
          note.hidden = !privacy;
          U.html(note, privacy);
        }
        function showRecent(d) {
          if (snapshot && (!d || snapshot.viewer !== viewer || snapshot.range !== shownRange)) {
            cancelRecent(); recent.close?.(); snapshot = null; notice = '';
          }
          if (snapshot && recent.isOpen?.()) return;
          setRecent(d);
        }
        function setRecent(d) {
          snapshot = d ? { data: d, viewer, range: shownRange, paged: !!d.recent_page, cursor: cursorOf(d.recent_page),
            total: d.recent_page?.total, count: d.recent?.length || 0 } : null;
          showRecentPrivacy(d?.recent);
          recent.set(recentRows(d));
          showRecentNote();
        }
        async function loadRecent() {
          let shown = snapshot;
          if (!shown?.cursor || pending || !recent.isOpen()) return;
          const task = pending = new AbortController();
          recent.setBusy(true);
          try {
            const current = () => !task.signal.aborted && snapshot === shown && recent.isOpen() && viewer === shown.viewer;
            const readPage = (limit, cursor) => fetchUsagePart(new URLSearchParams({
              range: shown.range, limit, ...(cursor ? { cursor } : {}),
            }), task.signal);
            const valid = ({ response, packet }) => response.ok && response.headers.get('X-Live-Source') !== 'oss'
              && packet?.viewer?.kind === shown.viewer && Array.isArray(packet.data?.recent) && packet.data?.recent_page;
            let result = await readPage(200, shown.cursor), renewed = false;
            if (!current()) return;
            if (result.response.status === 400 && ['live_invalid_cursor', 'live_invalid_snapshot'].includes(result.packet?.error)) {
              const first = await readPage(5);
              if (!current()) return;
              if (!valid(first)) { notice = '重新读取列表没有成功，再试一次'; return; }
              notice = '记录已更新，已从最新一条重新显示';
              setRecent(usageForView(first.packet.data));
              shown = snapshot;
              if (!shown.cursor) return;
              renewed = true;
              result = await readPage(200, shown.cursor);
              if (!current()) return;
            }
            if (!valid(result)) {
              notice = '后续记录暂时读不到，再试一次';
              return;
            }
            const data = result.packet.data;
            const addition = usageForView({ recent: data.recent }).recent;
            shown.cursor = cursorOf(data.recent_page);
            if (Number.isInteger(data.recent_page.total)) shown.total = data.recent_page.total;
            const offset = shown.count;
            shown.count += addition.length;
            recent.append(recentRows({ recent: addition, apps: shown.data.apps }, offset));
            if (el.querySelector('[data-x="rnote"]').hidden) showRecentPrivacy(addition);
            if (!renewed) notice = '';
          } catch {
            if (!task.signal.aborted) notice = '后续记录暂时读不到，再试一次';
          } finally {
            if (pending === task) {
              pending = null;
              recent.setBusy(false);
              showRecentNote();
            }
          }
        }
        return { set: () => {
          const d = usage;
          track.set(d);
          const appName = (name) => sp(name).replace(/^[^\p{L}\p{N}]+/u, '').trim();
          const categories = new Set((d?.focus || []).map((f) => (d.apps || []).find((a) => appName(a.name) === appName(f.app))?.category || 'other'));
          U.html(el.querySelector('[data-x="focus-key"]'), categories.size > 1 ? [...categories].map((c) => `<span><i style="--c:${V.hues[catHue(c)] || catHue(c)}"></i>${U.fieldHtml(CAT[c] || c, { name: '应用分类', place: 'label' })}</span>`).join('') : '');
          const note = el.querySelector('[data-x="focus-dates"]');
          note.textContent = d?.focus_min_seconds === FOCUS_MIN_SECONDS ? [rangeText(d.focus_window), foregroundLag(d, d.focus_window?.to)].filter(Boolean).join(' · ') : '';
          note.hidden = !note.textContent;
          showRecent(d);
        } };
      } },
  ];
  chapters.splice(1, 0, window.UsageUnion.create(() => usage, () => renderBoard(new Set(['union']))));
  let changedChapters = null;
  for (const chapter of chapters) {
    const build = chapter.build;
    chapter.build = (...args) => {
      const view = build(...args);
      return { set(...next) { if (!changedChapters || changedChapters.has(chapter.key)) view.set(...next); } };
    };
  }
  const calendarViews = new WeakMap();
  function yearDays(d) {
    const row = d?.year;
    if (!row) return { days: [] };
    const history = Array.isArray(row.days), idx = workIdx(), endpoint = d.window?.to;
    const old = calendarViews.get(row);
    if (old?.idx === idx && old.endpoint === endpoint) return old.result;
    const midnight = day => sec(`${day}T00:00:00+08:00`);
    const dayAfter = t => dayStart(t) + 86400;
    let readings, end;
    if (history) {
      end = dayAfter(row.calendar_to ? midnight(row.calendar_to) : sec(row.to || endpoint));
      if (!Number.isFinite(end)) end = dayAfter(midnight(row.days.at(-1)?.day));
      readings = row.days.filter(r => (!row.calendar_from || r.day >= row.calendar_from) && midnight(r.day) < end)
        .map(r => ({ day: r.day, value: r.active ?? null, partial: S.partial(r, 'active'), gap: r.gap }));
    } else if (row.spans?.length && idx >= 0) {
      // 旧包仅能从实际随包附带的状态时段读数。
      const { out, covered } = perDay(row, idx, d.states), to = sec(row.to);
      end = to;
      readings = [...covered].map(([day, observed]) => ({ day, value: out.get(day) || 0,
        partial: S.partial(row, 'spans') || observed < Math.min(midnight(day) + 86400, to) - midnight(day) }));
    }
    const known = readings?.filter(r => r.value != null) || [], first = known[0]?.day;
    // 年度取数口径由接口保留。画面从首个有读数的月份月初铺到读数当天。
    const days = [], byDay = new Map(readings?.map(r => [r.day, r]));
    if (first) for (let t = midnight(first.slice(0, 7) + '-01'); t < end; t += 86400) {
      const day = dayKey(t);
      days.push(byDay.get(day) || { day, value: null });
    }
    const total = known.length ? known.reduce((s, x) => s + x.value, 0) : null;
    const best = known.reduce((b, x) => (!b || x.value > b.value ? x : b), null);
    const result = { days, history, first, total, best, lower: days.some(r => r.value == null || r.partial) };
    calendarViews.set(row, { idx, endpoint, result });
    return result;
  }
  function daysForView(d) {
    if (d?.days?.length) return d.days;
    const states = d?.states || [], active = states.findIndex((s) => s.id === 'work' || s.id === 'active'), away = states.findIndex((s) => s.id === 'away');
    const rows = [d?.year, d?.day].filter((r) => r?.spans?.length), to = sec(d?.window?.to || rows[0]?.to);
    if (!rows.length || !Number.isFinite(to) || active < 0 || away < 0) return d?.days ?? null;
    const sources = rows.map((row) => ({ row, active: perDay(row, active, states), away: perDay(row, away, states) })), last = dayStart(to);
    return Array.from({ length: 14 }, (_, i) => {
      const start = last - (13 - i) * 86400, day = dayKey(start), expected = Math.min(start + 86400, to) - start;
      const source = sources.reduce((a, b) => (b.active.covered.get(day) || 0) > (a.active.covered.get(day) || 0) ? b : a);
      const covered = Math.min(expected, source.active.covered.get(day) || 0), missing = Math.max(0, expected - covered), lower = missing > 0 || S.partial(source.row, 'spans'), gaps = source.active.gaps.get(day) || [];
      const gap = !covered ? `${day.slice(5)} 使用状态${U.collectionText()}` : missing ? `${day.slice(5)} ${gaps.length === 1 && gaps[0][1] - gaps[0][0] === missing ? `${hm(gaps[0][0])}–${hm(gaps[0][1])} ` : ''}使用状态${U.collectionText()}（${dur(missing)}）` : lower ? source.row.gap || '只读到部分使用状态' : null;
      return { day, active: covered ? source.active.out.get(day) || 0 : null, away: covered ? source.away.out.get(day) || 0 : null, q: !covered ? 'unknown' : lower ? 'partial' : 'ok', partial: covered && lower ? ['active', 'away'] : [], gap };
    });
  }
  function comparisonDays(d) {
    const recent = daysForView(d) || [], year = yearDays(d).days;
    const last = recent.at(-1)?.day || year.at(-1)?.day;
    if (!last || !year.length) return recent;
    const end = sec(last + 'T00:00:00+08:00');
    const calendar = new Map(year.map(row => [row.day, row])), daily = new Map(recent.map(row => [row.day, row]));
    return Array.from({ length: 14 }, (_, i) => dayKey(end - (13 - i) * 86400)).flatMap(day => {
      const older = calendar.get(day), current = daily.get(day);
      if (older?.value != null) return [{ day, active: older.value, lower_bound: older.partial, gap: older.gap }];
      return current ? [current] : older ? [{ day, active: null, gap: older.gap }] : [];
    });
  }
  function comparisonCutoff(d, list) {
    const last = list.at(-1), calendar = yearDays(d).days.at(-1);
    const source = calendar?.day === last?.day && calendar?.value != null ? d.year : d?.day;
    const cutoff = sec(source?.recorded_to || source?.to || d?.window?.to);
    return list.length >= 14 && last?.active != null && list.at(-8)?.active != null &&
      Number.isFinite(cutoff) && dayKey(cutoff) === last.day && last.day === dayKey(Date.now() / 1000) ? cutoff : null;
  }
  function renderDays(d, days, cmp, compared, cutoff) {
    const list = daysForView(d);
    const recent = list || [];
    const last = recent.at(-1);
    const label = (x) => {
      const l = V.dayLabel(x.day), today = x.day === dayKey(Date.now() / 1000), lastRead = d?.day?.recorded_to, cut = cutStart(d, x.day);
      return { text: today ? '今天' : x.day.slice(-2), sub: l.wd, title: (today ? '今天' : l.md) + (cut ? ` · ${hm(cut)} 起` : '') + (x === last && lastRead ? ` · ${sourceReading(lastRead, d?.blocks?.day)}` : '') };
    };
    days.set(list ? { labels: recent.map(label), values: { active: recent.map((x) => x.active ?? null), away: recent.map((x) => x.away ?? null) }, quality: { active: recent.map((x) => S.partial(x, 'active') ? 'partial' : null), away: recent.map((x) => S.partial(x, 'away') ? 'partial' : null) }, notes: { active: recent.map((x) => S.partial(x, 'active') || x.active == null ? x.gap : null), away: recent.map((x) => (S.partial(x, 'away') || x.away == null) && !S.partial(x, 'active') && x.active != null ? x.gap : null) } } : null);
    if (compared.length < 14) {
      const known = compared.filter(day => day.active != null).length;
      cmp.set({ labels: [] }); cmp.wait(known ? `已有 ${known} 天在用时长，凑不齐两组 7 天` : '没有读到每日在用时长');
      return;
    }
    const now = compared.slice(-7), prev = compared.slice(-14, -7);
    cmp.set({
      labels: now.map((x, i) => {
        const l = V.dayLabel(x.day), today = x.day === dayKey(Date.now() / 1000), before = V.dayLabel(prev[i].day).md;
        return { text: today ? '今天' : l.wd, sub: today ? l.wd : l.md.slice(3),
          title: today && cutoff ? `今天截至 ${hm(cutoff)} · 对上${l.wd}（${before}）全天` : today ? `今天 · 对上${l.wd}（${before}）` : `${l.md} ${l.wd} · 对上${l.wd}（${before}）` };
      }),
      values: { this: now.map((x) => x.active ?? null), last: prev.map((x) => x.active ?? null) },
      quality: { this: now.map((x) => S.partial(x, 'active') ? 'partial' : null), last: prev.map((x) => S.partial(x, 'active') ? 'partial' : null) }, notes: { this: now.map((x) => S.partial(x, 'active') || x.active == null ? x.gap : null), last: prev.map((x) => S.partial(x, 'active') || x.active == null ? x.gap : null) },
    });
  }
  function renderTrack(el, d) {
    if (!d?.focus || !d.focus_window) { el.innerHTML = `<p class="vz-wait">${U.offline?.() ? missing() : U.collectionText()}</p>`; return; }
    if (!d.focus.length) { el.innerHTML = `<p class="vz-wait">这段时间没有连续满 ${FOCUS_MIN_SECONDS / 60} 分钟的记录</p>`; return; }
    const to = sec(d.focus_window.to), from = sec(d.focus_window.from), x = (t) => ((t - from) / (to - from)) * 100;
    const appName = (name) => sp(name).replace(/^[^\p{L}\p{N}]+/u, '').trim();
    const appCat = new Map((d.apps || []).map((a) => [appName(a.name), a.category]));
    const ticks = [], width = el.clientWidth;
    const step = to - from > 7 * 86400 ? 86400 : to - from > 36 * 3600 ? 21600 : 10800;
    let right = -14;
    for (let t = Math.ceil((from + BJ) / step) * step - BJ; t < to; t += step) {
      const px = x(t) * width / 100;
      if (px - 18 < right + 14 || px + 18 > width - 44) continue;
      ticks.push(`<span class="focus-track__tick" style="left:${x(t).toFixed(2)}%">${new Date((t + BJ) * 1000).getUTCHours() ? hm(t) : new Date((t + BJ) * 1000).toISOString().slice(5, 10)}</span>`); right = px + 18;
    }
    el.innerHTML = `<i class="focus-track__line"></i>${d.focus.map((f) => `<i class="focus-track__pill" style="left:${x(Math.max(from, sec(f.from))).toFixed(2)}%;width:${Math.max(x(Math.min(to, sec(f.to))) - x(Math.max(from, sec(f.from))), .6).toFixed(2)}%;--c:${V.hues[catHue(appCat.get(appName(f.app)))] || catHue(appCat.get(appName(f.app)))}" title="${esc(`${rangeText(f)} · ${sp(f.app)} · ${read(f, 'seconds')}`)}"></i>`).join('')}${ticks.join('')}<span class="focus-track__tick is-now" style="left:100%">${step === 86400 ? dayKey(to).slice(5) : hm(to)}</span>`;
  }

  const board = V.board($('board'), { key: 'usage', quiet: true, sync });
  function renderBoard(changed = null, updateTime = false) {
    if (updateTime) {
      changedChapters = new Set();
      board.data({ from: usage?.window?.from, to: usage?.window?.to, series: [] });
    }
    changedChapters = changed;
    const display = rawUsage && { ...rawUsage, groups: rawUsage.groups?.map(g => ['ok', 'green'].includes(g.level) ? { ...g, level: undefined } : g) };
    board.blocks(display, { day: ['summary', 'states', 'day'], year: ['states', 'year'], where: ['categories', 'apps', 'titles'], focus: ['summary', 'focus', 'recent', 'apps'] }, !!U.offline?.());
    board.set(chapters.map((c) => {
      const group = usage?.groups?.find(g => g.key === c.key);
      return { ...group, sourceNotes: false, level: ['ok', 'green'].includes(group?.level) ? undefined : group?.level, key: c.key, name: c.key === 'day' ? sp(usage?.window?.label || rangeLabel()) : typeof c.name === 'function' ? c.name(usage) : c.name, pic: c.pic, side: c.side, palette: c.palette, line: usage ? c.line(usage) : '', build: c.build };
    }));
    changedChapters = null;
    document.querySelectorAll('[data-gf]').forEach((a) => a.setAttribute('data-needs-pc', ''));
    if (changed?.size === 1 && changed.has('union')) return;
    const { day, year, hours } = usage || {};
    // 质量和说明在各数据块或数据系列上，时间点数组不含这些字段。
    S.finish({ ...usage, days: daysForView(usage), day: day && { ...day, spans: null }, year: year && { ...year, spans: null, days: null },
      hours: hours && { ...hours, minutes: null },
    }, { day: ['summary', 'day'], where: ['categories', 'apps', 'titles'], focus: ['summary', 'focus', 'recent', 'apps'] });
  }

  function renderNotices(state) {
    U.list(notices, state.offline
      ? [{ key: 'link', cls: 'notice glass', html: `${U.status(state).lamp}<span>${U.fieldHtml(state.text, { name: '连接状态' })}</span>` }] : []);
  }

  function ask() {
    if (!usage) return '';
    const s = usage.summary || {};
    const unnoted = stateNotes(usage), stateText = (id, key) => unnoted.has(id) ? '没有这类记录' : read(s, key);
    const said = [headText(usage), s.on != null && `开机 ${read(s, 'on')}`, s.away != null && `人不在 ${read(s, 'away')}`, s.display_off != null && `屏幕关着 ${stateText('screen-off', 'display_off')}`, s.sleep != null && `睡着 ${stateText('sleep', 'sleep')}`,
      usage.apps?.length && `前台记录：${usage.apps.slice(0, 3).map((a) => `${sp(a.name)} ${read(a, 'seconds')}`).join('、')}`].filter(Boolean);
    return `请看实况使用时间${at ? `（${U.time(at)} 的数）` : ''}：${said.join('；')}。请说明现在的情况。`;
  }
  const bar = U.topbar({ ask });

  // 加载中：页头在雾里，数到了由糊变清；电脑不在线、这块又没存下来时页头收成一句话
  const heroRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: '使用时间' });
  let lit = false, first = true;
  renderBoard();

  const usageCallbacks = {
    // 读前各章在雾里写“正在读…”（board 管），读完没数才写“还没读到”
    phase(state) {
      if (rangeStatus.textContent && ['ready', 'none', 'gone', 'paused'].includes(state.phase)) rangeStatus.textContent = '';
      if (!rawUsage && state.data == null && !['none', 'gone'].includes(state.phase)) { heroRead.set(state); board.phase(state); }
    },
    data(raw, meta) {
      if (raw || [200, 204].includes(meta.status)) shownRange = usageRange;
      viewer = meta.viewer.kind; rawUsage = receiveUsageHead(raw, meta);
      drawnOffline = !!U.offline?.();
      usage = usageForView(V.blockData(rawUsage, drawnOffline));
      at = meta.at;
      const gap = $('usage-window-gap'); gap.hidden = !raw?.window?.gap;
      U.html(gap, U.fieldHtml(raw?.window?.gap || '', { name: '统计时段说明' }));
      renderHero(usage);
      renderOdd(usage);
      renderBoard(null, true);
      if (raw && first) { heroRead.done(); first = false; }
      if (!lit) { lit = true; requestAnimationFrame(() => Light.lightUp([hero, ...board.cards(), notices])); }
    },
    link(state) {
      const empty = state.data == null && ['none', 'gone'].includes(state.phase);
      if (empty && shownRange !== usageRange ||
          rawUsage && state.data == null && (state.publicPaused || state.viewer.kind !== viewer)) {
        usageCallbacks.data(null, state.meta);
      }
      updateDeferredUsage(state);
      if (rawUsage && drawnOffline !== state.offline) {
        drawnOffline = state.offline;
        usage = usageForView(V.blockData(rawUsage, drawnOffline));
        renderHero(usage); renderOdd(usage); renderBoard();
      }
      bar?.set(state);
      Light.offline(state.offline);
      renderNotices(state);
      if (usage) renderLinks(usage);
      if (!usage && empty) {
        const text = state.phase === 'gone' || state.meta.status >= 400 ? `${rangeLabel(usageRange)}的使用时间暂时读不到` : state.text || U.collectionText('使用时间');
        U.html(part('head'), U.head(text, { lamp: false }));
        heroRead.done(); board.phase(state);
      }
      if (!lit && (state.phase === 'none' || state.phase === 'gone')) { lit = true; requestAnimationFrame(() => Light.lightUp([hero, ...board.cards(), notices])); }
      [hero.querySelector('.card__body'), ...board.cards()].forEach(el => U.blockNote(el, state));
    },
  };
  let deferredUsage = null, recoveryUsed = false, recovery = null;
  const deferredBlocks = {
    day: ['tl', 'day', 'union', 'days'], year: ['cal', 'year', 'days'],
    focus: ['track-wrap', 'focus'], titles: ['titles', 'where'],
  };
  const waitingUsageBlock = (meta) => ['computing', 'unavailable'].includes(meta?.state);
  const blockObserver = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    const state = deferredUsage;
    for (const { target, isIntersecting } of entries) {
      const job = state?.jobs.find(job => job.target === target);
      if (!job || !isIntersecting || U.offline?.()) continue;
      blockObserver.unobserve(target);
      loadUsageBlock(state, job);
    }
  }, { rootMargin: '160px 0px' }) : null;
  function clearDeferredUsage() {
    if (deferredUsage) {
      deferredUsage.controller.abort();
      cancelAnimationFrame(deferredUsage.frame);
      blockObserver?.disconnect();
    }
    deferredUsage = null;
  }
  function mergeDeferredUsage(state) {
    const data = { ...state.head, blocks: { ...state.head.blocks } };
    for (const job of state.jobs) {
      if (Object.hasOwn(job, 'value')) {
        data[job.block] = job.value;
        if (waitingUsageBlock(data.blocks[job.block])) delete data.blocks[job.block];
      } else data.blocks[job.block] = { state: job.failed ? 'unavailable' : 'computing' };
    }
    return data;
  }
  function receiveUsageHead(raw, meta) {
    // 新接口用 null 与是否有补取地址区分没有记录和分批读取。
    const blocks = Object.keys(deferredBlocks);
    const empty = blocks.filter(block => raw?.deferred && raw[block] === null &&
      !Object.hasOwn(raw.deferred, block) && waitingUsageBlock(raw.blocks?.[block]));
    if (empty.length) {
      raw = { ...raw, blocks: { ...raw.blocks } };
      for (const block of empty) delete raw.blocks[block];
    }
    const jobs = [];
    const prefix = '/computer-access/live/v1/computer/usage?';
    if (raw?.deferred && meta.source !== 'fallback' && !params.has('fixture')) for (const block of blocks) {
      const path = raw.deferred[block];
      if (raw[block] != null || typeof path !== 'string' || !path.startsWith(prefix)) continue;
      const query = new URLSearchParams(path.slice(prefix.length));
      if (query.get('range') !== usageRange || query.get('block') !== block || !query.get('snapshot') || query.has('limit') || query.has('cursor')) continue;
      query.sort();
      jobs.push({ block, query, target: $('board').querySelector(`[data-x="${deferredBlocks[block][0]}"]`) });
    }
    if (!jobs.length) { clearDeferredUsage(); return raw; }
    const snapshots = [...new Set(jobs.map(job => job.query.get('snapshot')))].sort();
    const key = JSON.stringify([meta.viewer.kind, meta.viewer.device, usageRange, snapshots]);
    if (deferredUsage?.key !== key) {
      clearDeferredUsage();
      deferredUsage = { key, viewer, jobs: [], controller: new AbortController(), changed: new Set(), frame: 0 };
    }
    const state = deferredUsage;
    state.head = raw;
    state.jobs = jobs.map(job => state.jobs.find(old => old.query.toString() === job.query.toString()) || job);
    return mergeDeferredUsage(state);
  }
  function updateDeferredUsage(link) {
    const isRecovery = recovery !== null;
    if (recovery) {
      recovery.answered = true;
      if (recovery.finished) recovery = null;
    }
    const state = deferredUsage;
    if (link.offline) { blockObserver?.disconnect(); return; }
    if (link.meta.source !== 'net' || ![200, 304].includes(link.meta.status)) return;
    if (!isRecovery) recoveryUsed = false;
    for (const job of state?.jobs || []) {
      if (job.pending || Object.hasOwn(job, 'value')) continue;
      if (job.failed && isRecovery) continue;
      if (job.failed || !blockObserver || !job.target) loadUsageBlock(state, job);
      else blockObserver.observe(job.target);
    }
  }
  async function loadUsageBlock(state, job) {
    if (job.pending || Object.hasOwn(job, 'value')) return;
    job.pending = true;
    let invalidSnapshot = false;
    try {
      const { response, packet } = await fetchUsagePart(job.query, state.controller.signal);
      const data = packet?.data;
      if (response.ok && response.headers.get('X-Live-Source') !== 'oss' && packet?.viewer?.kind === state.viewer
          && data?.block === job.block && Object.hasOwn(data, 'value')) job.value = data.value;
      else {
        job.failed = true;
        invalidSnapshot = response.status === 400 && packet?.error === 'live_invalid_snapshot';
      }
    } catch { job.failed = true; }
    job.pending = false;
    if (state !== deferredUsage || !state.jobs.includes(job)) return;
    for (const key of deferredBlocks[job.block].slice(1)) state.changed.add(key);
    state.frame ||= requestAnimationFrame(() => {
      state.frame = 0;
      rawUsage = mergeDeferredUsage(state);
      usage = usageForView(V.blockData(rawUsage, !!U.offline?.()));
      renderHero(usage);
      renderOdd(usage);
      renderBoard(state.changed);
      state.changed.clear();
    });
    if (invalidSnapshot && !recoveryUsed) {
      recoveryUsed = true;
      const attempt = recovery = { answered: false, finished: false };
      // 从历史返回时 get 可能先交缓存，之后才发来这次重读的 link。
      window.Live.get('computer/usage', usageQuery()).then(() => {
        attempt.finished = true;
        if (recovery === attempt && attempt.answered) recovery = null;
      }, () => {
        if (recovery === attempt) recovery = null;
      });
    }
  }
  let usageRange = '72h', usageWatch = null, rangeGeneration = 0;
  const usageQuery = () => ({ range: usageRange, limit: 5 });
  function watchUsage() {
    usageWatch?.stop();
    const generation = ++rangeGeneration;
    usageWatch = window.Live.watch('computer/usage', usageQuery(), Object.fromEntries(Object.entries(usageCallbacks).map(([key, fn]) => [key, (...args) => { if (generation === rangeGeneration) fn(...args); }])));
  }
  rangePicker.addEventListener('click', (e) => {
    const button = e.target.closest('[data-range]');
    if (!button || button.dataset.range === usageRange) return;
    usageRange = button.dataset.range;
    for (const option of rangePicker.querySelectorAll('[data-range]')) option.setAttribute('aria-pressed', String(option === button));
    rangeStatus.textContent = `正在读${button.textContent.trim()}…`;
    clearDeferredUsage();
    recoveryUsed = false;
    recovery = null;
    watchUsage();
  });
  watchUsage();

  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

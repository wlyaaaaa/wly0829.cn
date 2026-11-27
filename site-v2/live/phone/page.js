// 手机二层沿用电脑页 board；示意数和真接口走同一渲染，缺数不当 0。
(() => {
  'use strict';
  const U = window.LiveUI, V = window.LiveViz, C = window.LiveChart, Light = window.LiveLight, { esc, sp } = U;
  const shortDate = U.date;
  U.date = window.LiveChart.date;
  const $ = id => document.getElementById(id), hero = $('hero'), part = k => hero.querySelector(`[data-part="${k}"]`);
  const params = new URLSearchParams(location.search), route = href => href + (params.has('fixture') ? `${href.includes('?') ? '&' : '?'}fixture=${encodeURIComponent(params.get('fixture'))}` : '');
  const names = { usage: '今天怎么用的', network: '上网和流量', collect: '手机的数电脑收全了没有', battery: '电量和温度', storage: '存储和内存', apps: '装了什么、系统' };
  // 图址写全，构建才认得出、换成云端地址（页面里拼出来的地址构建认不出，图收不进产物）
  const groupPics = { usage: '/live/img/s1900-phone-corridor-v1.webp', network: '/live/img/s1900-phone-tower-v1.webp', collect: '/live/img/grp-phone-collect.webp', battery: '/live/img/grp-phone-battery.webp', storage: '/live/img/grp-phone-storage.webp', apps: '/live/img/grp-phone-apps.webp' };
  const palettes = [['violet', 'blue'], ['teal', 'blue'], ['blue', 'violet'], ['pink', 'apricot'], ['apricot', 'violet'], ['violet', 'teal']];
  // 手机和电脑的使用记录（近 24 小时横带、近 7 天叠柱）共用一套状态顺序、名字和颜色（本人 11-24：两张图保持一致、色彩分明）：
  // 手机亮屏用强调绿、电脑在用用青，两台一眼分得开；锁屏浅灰蓝、关机深灰蓝；锁屏是两台共用的一类。
  const USAGE_ORDER = ['on', 'active', 'away', 'off', 'sleep', 'shutdown', 'unrecorded', 'pending'];
  const USAGE_HUES = { on: '#00A650', active: 'teal', away: 'apricot', off: '#8f9bb3', sleep: 'violet', shutdown: '#3a4459', unrecorded: 'stone', pending: 'teal' };
  const USAGE_LABELS = { unrecorded: '没记录', pending: '等下一轮记录' };
  const usageRank = id => { const k = USAGE_ORDER.indexOf(id); return k < 0 ? USAGE_ORDER.length : k; };
  let phone = null, viewer = 'public', done = false, linkOff = '', trafficProject = null, trafficDays = null, trafficDaysWatch = null;
  const ranges = {}, shownRanges = {}, watches = {}, generations = {}, chartStates = {};
  const packs = new Map(), chartDone = new Set(), sync = C.sync(), metric = id => phone?.metrics?.find(m => m.id === id);
  const isPartial = (o, key) => o?.lower_bound === true || o?.at_least === true || o?.q === 'partial' && (o.partial == null || o.partial.includes(key));
  const pcOffline = () => !!linkOff || !!U.offline?.(), unread = () => pcOffline() ? '' : U.collectionText(), missing = '这块没存下来，连上后补上。';
  // 流量柱图图例：电脑断开时图上是断开前的读数，这一格断开前就没有记录；写明原因，不留空白。
  const trafficMissing = () => pcOffline() ? '电脑断开前没有记录' : unread();
  const lowerText = (o, key, text) => o?.[key] != null && isPartial(o, key) && !/^不到/.test(sp(text)) ? `至少 ${sp(text)}` : sp(text);
  const val = id => { const m = metric(id), b = V.blockState(m, pcOffline()); return isPartial(m, 'value') && typeof m.value === 'number' ? m.value : b?.empty || b?.wait || typeof m?.value === 'string' && !m.value.trim() ? null : m?.value ?? null; };
  const fh = (value, name = '手机', place = 'body') => U.fieldHtml(value, { name, place, kind: viewer });
  const readValue = id => typeof val(id) === 'object' && val(id) != null ? val(id) : reading(id);
  const readHtml = (id, name) => fh(readValue(id), name);
  const stampValue = value => value && typeof value === 'object' ? value : stamp(value);
  const stampHtml = value => fh(stampValue(value), '时间');
  const formattedHtml = (raw, text, name) => fh(raw && typeof raw === 'object' ? raw : text, name);
  // 先认结构标记，再认占位字（“〈哪一样〉仅本人可见”，和旧的两种写法）。
  const marked = value => !!(value && typeof value === 'object' && (value.hidden || value.hidden_block || viewer === 'public' && (value.visibility === 'owner' || value.public === 'owner'))) || /(?:仅本人可见|可信设备可见|正在换说法)$/.test(sp(value));
  const nameMark = (label, values) => { const v = values?.find(marked); return v ? U.fieldHtml(v, { name: label, place: 'body', kind: viewer }) : ''; };
  const markNote = (label, values) => { const mark = nameMark(label, values); return mark ? `<p class="use-note">${mark}</p>` : ''; };
  function markBelow(host, mark) { if (!host._privateNote) { host._privateNote = document.createElement('p'); host._privateNote.className = 'use-note'; host.after(host._privateNote); } U.html(host._privateNote, mark); host._privateNote.hidden = !mark; }
  const metricLabel = (m, key) => marked(m?.label) ? figures[key]?.find(([id]) => id === m.id)?.[1] || names[key] : sp(m?.label);
  const bytes = n => n != null && typeof n === 'object' ? sp(n) : C.value(n, 'B') ?? unread();
  const temperature = n => n == null ? unread() : typeof n === 'number' ? `${Number(n.toFixed(1))}℃` : sp(n);
  const stamp = t => t && typeof t === 'object' ? sp(t) : t ? `${U.date(t)} ${U.time(t)}` : unread();
  const humanText = text => sp(sp(text ?? (pcOffline() ? missing : unread())).replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})/g, stamp).replace(/\b\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}(?::\d{2})?)?\b/g, t => t.includes(' ') ? stamp(t.replace(' ', 'T') + '+08:00') : U.date(t)));
  function reading(id) {
    const m = metric(id), n = val(id);
    if (n == null) return pcOffline() ? unread() : U.collectionText(marked(m?.label) ? '' : m?.label || '', m);
    if (typeof n === 'object') return sp(n);
    const text = id === 'screen_on' && typeof n === 'number' ? n > 0 && n < 60 ? `${Math.floor(n)} 秒` : U.minutes(Math.floor(n / 60))
      : m.unit === 'B' ? bytes(n) : m.unit === '℃' ? temperature(n) : m.unit === 's' ? V.dur(n) : typeof n === 'number' ? C.value(n, m.unit) : sp(n);
    return lowerText(m, 'value', sp(text));
  }
  function netText() { const kind = val('net_kind'); return kind == null ? unread() : kind === 'wifi' ? `WiFi${val('ssid') != null ? ` ${sp(val('ssid'))}` : ''}` : kind === 'none' ? '没网' : `${sp(kind).toUpperCase()}${val('carrier') ? ` ${sp(val('carrier'))}` : ''}`; }
  function readingDay(id) {
    const m = metric(id), at = m?.period_date || m?.coverage?.from || m?.at;
    if (!Number.isFinite(Date.parse(at))) return '上次';
    return U.date(at) === U.date(Date.now()) ? '今天' : `${U.date(at)} `;
  }
  function headText(d) {
    // 和实况首页手机卡同一套说法（主持 11-26 定）：调试连接和 Tailscale 都找不到手机才叫离线，只有调试连接断叫“电脑连不上手机”
    const at = value => Number.isFinite(Date.parse(value)) ? `${U.date(value) !== U.date(Date.now()) ? `${U.date(value)} ` : ''}${U.time(value)}` : '';
    if (d?.presence?.state === 'offline') return at(d.offline_since) ? `手机 ${at(d.offline_since)} 起离线` : '手机离线';
    if (d?.state === 'offline') return `电脑连不上手机${at(d.offline?.since) ? ` · ${at(d.offline.since)} 起` : ''}`;
    const primary = val('screen_on') == null && (d?.metrics || []).find(m => typeof val(m.id) === 'number');
    if (primary) return `${marked(primary.label) ? ({unlocks:'解锁',battery:'电量',battery_temp:'电池温度',screen_on:'亮屏',storage_free:'存储剩',storage_used:'存储已用',memory_used:'内存已用'})[primary.id] || '手机' : sp(primary.label || '')} ${reading(primary.id)}`.trim();
    // 一样读数都没有、连接证据也不够时，整句写“手机连接状态暂时读不到”（主持 11-26 定）
    if (!d || d.state === 'unknown') return pcOffline() ? '手机' : d?.presence?.state === 'unknown' ? '手机连接状态暂时读不到' : '手机暂时读不到';
    return `${readingDay('screen_on')}亮屏 ${reading('screen_on')}`;
  }
  // 采到了、今天没用（亮屏和解锁都是 0、不是读不全、带统计到哪一刻）写成一句；还没采到是 null 加 gap，不走这句（统筹 11-17 04:55）
  function idleToday() {
    const on = metric('screen_on'), un = metric('unlocks'), until = on?.coverage?.to || on?.at;
    return readingDay('screen_on') === '今天' && ['online', 'partial'].includes(phone?.state) && on?.value === 0 && un?.value === 0 && !isPartial(on, 'value') && !isPartial(un, 'value') && until
      ? `今天还没用过（统计到 ${U.time(until)}）` : '';
  }
  // 本人版给完整版，不挂“仅你可见”；对外换了说法的照旧提一句。
  const note = (item, what = '应用名') => viewer === 'owner' && item?.visibility === 'owner' ? '' : U.visibilityNote(item, viewer, item?.hidden_what || what) ? fh(item?.visibility === 'rewritten' ? '对外换了说法' : item, what) : '';
  const listName = a => marked(a.name) || viewer !== 'owner' && a.name == null && a.visibility === 'owner' ? '' : a.name == null && a.visibility === 'owner' ? note(a)
    : `${fh(a.name ?? (pcOffline() ? '应用' : U.collectionText("应用 · ")), '应用名', 'label')}${note(a) ? ` <span class="phone-mark">${note(a)}</span>` : ''}`;
  const paragraph = text => `<p class="use-note">${fh(text && typeof text === 'object' ? text : humanText(text))}</p>`;
  const detail = (label, text) => pcOffline() && !text ? '' : `<div><dt>${fh(label, '读数', 'label')}</dt><dd>${fh(text ?? unread(), sp(label))}</dd></div>`;
  const series = (key, id) => packs.get(key)?.series?.find(s => s.id === id);
  function trafficBars(s) {
    const bars = s?.bars;
    return bars && isPartial(s, 'values') ? { ...bars, quality: Object.fromEntries(Object.entries(bars.values).map(([key, values]) => [key, values.map(v => v == null ? null : 'partial')])) } : bars;
  }
  const storageItems = s => s?.items?.filter(item => item.id !== 'free');
  const seconds = t => Date.parse(t) / 1000, iso = t => new Date(t * 1000).toISOString();
  function collectTimeline(s) {
    const rows = s.timeline.rows, link = rows.link, month = 30 * 86400;
    const full = ['usage', 'location', 'packages', 'runs'].map(k => rows[k]).find(r => seconds(r?.to) - seconds(r?.from) >= month);
    const to = [full?.to, s.timeline.to, s.to, link?.to, s.at].map(seconds).find(Number.isFinite);
    if (!Number.isFinite(to)) return s.timeline;
    const from = full ? seconds(full.from) : to - month, display = [from, to];
    if (!link) return { ...s.timeline, display };
    const rowFrom = seconds(link.from), rowTo = seconds(link.to), sameWindow = rowFrom === from && rowTo === to;
    const coverage = sameWindow ? link.coverage : null;
    const start = [seconds(coverage?.from), sameWindow ? seconds(phone?.collect?.since) : NaN, rowFrom].find(Number.isFinite);
    const left = Math.max(from, rowFrom, start), right = Math.min(to, rowTo, seconds(coverage?.to ?? link.to));
    const spans = right > left ? link.spans.filter(([t]) => t >= left && t < right) : [];
    const previous = right > left && link.spans.findLast(([t]) => t < left);
    if (previous && spans[0]?.[0] !== left) spans.unshift([left, previous[1]]);
    const cropped = spans.length ? { ...link, from: iso(left), to: iso(right), spans } : { ...link, spans };
    return { ...s.timeline, display, linkStart: spans.length && start > from && start < to ? start : null, rows: { ...rows, link: cropped } };
  }
  // 采集约每 30 分钟一轮；最后一次记到之后、不到 35 分钟的那一小段是还没到下一轮，不算“没记录”（和后台判断采集停了用同一个时长）。
  const PENDING_SECONDS = 35 * 60;
  // 一条带子最后一次记到的时刻：后台给了 recorded_to 就用它，没给就取最后一段有状态的结尾。
  function recordedTo(row) {
    const given = seconds(row?.recorded_to);
    if (Number.isFinite(given)) return given;
    const spans = row?.spans || [], to = seconds(row?.to), last = spans.findLastIndex(([, v]) => v != null);
    return last < 0 ? NaN : Math.min(spans[last + 1]?.[0] ?? to, to);
  }
  const roundOnTime = () => {
    const round = phone?.collect?.collector, age = seconds(phone?.at) - seconds(round?.at);
    return round?.state === 'online' && !round.read_error && age >= 0 && age <= PENDING_SECONDS;
  };
  function roundText(round) {
    if (pcOffline() || round?.read_error) return round?.text;
    if (roundOnTime()) return `手机约 30 分钟采一次，上次 ${U.time(round.at)} 采的，下一轮还没到`;
    const age = seconds(phone?.at) - seconds(round?.at);
    return round?.state === 'offline' && age > PENDING_SECONDS
      ? `手机已经 ${Math.ceil(age / 60)} 分钟没采了，超过 35 分钟算晚` : round?.text;
  }
  // 只有这次收到的使用记录末尾仍可在等下一轮；历史空档和已经确认的缺口保留原判。
  const waitingGap = g => g?.kind === 'data_gap' && !g.recovered && roundOnTime()
    && seconds(g.from) === seconds(phone?.usage_at) && seconds(phone?.at) - seconds(g.from) <= PENDING_SECONDS;
  function collectionMeta(row) {
    if (!row || pcOffline() || !roundOnTime() || row.q !== 'stale' || row.state === 'stale' || row.read_error || row.error
      || seconds(row.source_at ?? row.at) !== seconds(phone.collect.collector.at)) return row;
    return { ...row, q: row.lamp_q ?? row.state, stale: false, stale_text: null, gap: U.isReadingCutoff(row.gap) ? null : row.gap };
  }
  // round：采集图最近一轮执行的时刻。某条（如定位）自己最后一条记录早，但最近一轮已经跑过，那之后的末尾一样是等下一轮
  function markSpans(row, gap, pending, since, omitted, round = NaN) {
    const own = recordedTo(row), spans = row.spans || [], from = seconds(row.from), to = seconds(row.to), cutoff = Number.isFinite(round) && !(own >= round) ? round : own;
    const waiting = Number.isFinite(cutoff) && to - cutoff > 0 && to - cutoff <= PENDING_SECONDS;
    return spans.map(([t, v], i) => {
      if (v === omitted) return [t, null];
      if (v != null) return [t, omitted >= 0 && v > omitted ? v - 1 : v];
      const end = Math.min(spans[i + 1]?.[0] ?? to, to);
      // 按整天统计的图，起点那天不满一天的那一小截不在统计里，不画、不算“没记录”。
      if (i === 0 && t <= from + 1 && end < from + 86400 && end === Math.floor((end + 8 * 3600) / 86400) * 86400 - 8 * 3600) return [t, null];
      // 手机从某一刻才开始记上网（采集起点），那之前不是缺记录，不画、不算“没记录”，图上标“几点起才有记录”。
      if (i === 0 && t <= from + 1 && Math.abs(end - since) <= 60) return [t, null];
      return [t, waiting && t >= cutoff ? pending : gap];
    });
  }
  function cutoffText(data, lanes = [['phone', '手机'], ['computer', '电脑']], clock = t => U.time(iso(t)), tail = true) {
    const shown = lanes.map(([key, name]) => [name, data?.rows?.[key]]).filter(([, row]) => row?.spans?.length);
    const parts = shown.map(([name, row]) => { const at = recordedTo(row), to = seconds(row.to); return Number.isFinite(at) ? [name, at, to - at] : null; }).filter(Boolean);
    if (!parts.length) return '';
    const waiting = parts.filter(([, , tail]) => tail > 60 && tail <= PENDING_SECONDS);
    const late = parts.filter(([, , tail]) => tail > PENDING_SECONDS), times = new Map();
    for (const [name, at] of parts) times.set(clock(at), [...(times.get(clock(at)) || []), name]);
    return [...times].map(([at, names]) => `${names.join('、')}记到 ${at}`).join('，')
      + (waiting.length ? `；${waiting.map(([name]) => name).join('、')}末尾等下一轮记录（约每 30 分钟一轮）` : '')
      + (tail && late.length ? `；${late.map(([name]) => name).join('、')}超过 35 分钟没有新记录` : '') + '。';
  }
  // 采集图、上网图也写清各条记到几点和缺口怎么算（M380）：后台给的各条说明原样接上；上网图的“没记录”不是没网。
  function timelineNote(id, data) {
    if (id === 'usage-timeline') return cutoffText(data) + (Object.values(data?.rows || {}).some(row => row?.restart_points?.some(t => t >= seconds(row.from) && t <= seconds(row.to))) ? '◆ 是电脑开机或重启的时刻。' : '');
    if (id === 'collect-timeline') {
      const lanes = [['usage', '使用记录'], ['location', '定位'], ['packages', '装机清单'], ['runs', '采集执行情况']];
      const notes = lanes.filter(([key]) => key !== 'runs').map(([key, name]) => { const note = data?.rows?.[key]?.note; return typeof note === 'string' && note.trim() ? `${name}：${sp(note).replace(/[。.]?$/, '。')}` : ''; }).filter(Boolean);
      return [cutoffText(data, lanes, t => stamp(iso(t)), false), ...notes].filter(Boolean).join('');
    }
    if (id === 'network-timeline') {
      const totals = stateTotals(data)?.day, gap = data?.states?.findIndex(s => s.id === 'unrecorded');
      return cutoffText(data, [['day', '上网状态']]) + (gap >= 0 && totals?.[gap] > 60 ? '图上“没记录”是手机没留下上网状态的时段，不是没网。' : '');
    }
    return '';
  }
  function timeline(s) {
    if (s?.timeline) {
      // 锁屏用自己的颜色：和“没记录”同为石灰色时，点图例“锁屏”带子上看不出哪段亮了。
      const hues = { wifi: 'blue', sim1: 'apricot', sim2: 'violet', none: 'stone', off: '#8f9bb3' };
      const usage = s.id === 'usage-timeline';
      const states = s.timeline.states.map((state, i) => ({ ...state, label: s.group === 'collect' && state.id === 'tailscale' ? '远程线路' : state.label, hue: (usage && USAGE_HUES[state.id]) || state.hue || hues[state.id] || V.stateHues[state.id] || ['teal', 'violet', 'pink', 'apricot'][i % 4] }));
      if (!['network-timeline', 'usage-timeline', 'collect-timeline'].includes(s.id)) return { ...s.timeline, states };
      let data = s.id === 'collect-timeline' ? collectTimeline(s) : s.timeline;
      // 使用记录照近 7 天的顺序排（亮屏、在用、离开、锁屏、睡眠、关机），图例两张图一个顺序；横带上的状态号跟着换
      if (usage) {
        const sorted = states.map((state, i) => [state, i]).sort((a, b) => usageRank(a[0].id) - usageRank(b[0].id) || a[1] - b[1]);
        const moved = new Map(sorted.map(([, old], i) => [old, i]));
        states.splice(0, states.length, ...sorted.map(([state]) => state));
        data = { ...data, rows: Object.fromEntries(Object.entries(data.rows || {}).map(([key, row]) => [key, { ...row, spans: (row.spans || []).map(([t, v]) => [t, v == null ? v : moved.get(v) ?? v]) }])) };
      }
      const omitted = s.id === 'collect-timeline' ? states.findIndex(state => state.id === 'not_run') : -1;
      if (omitted >= 0) states.splice(omitted, 1);
      const since = s.id === 'network-timeline' ? seconds(phone?.collect?.since) : NaN, day = data.rows?.day;
      const sinceStart = Number.isFinite(since) && day?.spans?.[0]?.[1] == null && seconds(day.from) < since && since < seconds(day.to)
        && Math.abs((day.spans[1]?.[0] ?? NaN) - since) <= 60 ? since : null;
      return { ...data, sinceStart, states: [...states, { id: 'unrecorded', label: '没记录', hue: 'stone' }, { id: 'pending', label: '等下一轮记录', hue: 'teal', pattern: 'hatch' }],
        rows: Object.fromEntries(Object.entries(data.rows).map(([key, row]) => [key, { ...row, recorded_to: Number.isFinite(recordedTo(row)) ? iso(recordedTo(row)) : null, spans: markSpans(row, states.length, states.length + 1, since, omitted, s.id === 'collect-timeline' ? recordedTo(data.rows?.runs) : NaN) }])) };
    }
    if (!s?.points?.length) return null;
    const states = Object.entries(s.states || {}).map(([id, label]) => ({ id, label, hue: V.stateHues[id] || 'teal' }));
    return { states, rows: { day: { from: s.from || packs.get(s.group)?.from, to: s.to || packs.get(s.group)?.to, spans: s.points.map(([t, v]) => [t, v == null ? null : states.findIndex(x => x.id === v)]) } } };
  }
  function stateTotals(data) {
    return Object.fromEntries(Object.entries(data?.rows || {}).map(([key, row]) => {
      const totals = new Array(data.states.length).fill(0), from = Date.parse(row.from) / 1000, to = Date.parse(row.to) / 1000;
      row.spans.forEach(([t, s], i) => { if (s != null) totals[s] += Math.max(0, Math.min(row.spans[i + 1]?.[0] ?? to, to) - Math.max(t, from)); });
      return [key, totals];
    }));
  }
  function timelineLabels(host, data, key) {
    host.querySelectorAll('.phone-start, .phone-computer-gap, .phone-gap').forEach(node => node.remove());
    if (!data) return;
    const rows = Array.from(host.querySelectorAll('.vz-tl__row'), el => el.dataset.row).filter(k => data.rows[k]?.spans?.length), totals = stateTotals(data);
    for (const li of host.querySelectorAll('.vz-legend__item')) {
      const state = data.states.findIndex(s => s.id === li.dataset.state), values = rows.map(k => data.states.reduce((n, s, i) => n + (s.label === data.states[state]?.label ? totals[k][i] || 0 : 0), 0));
      // 使用记录的关机（两台）、睡眠（只有电脑）这段没有也照样列出，写明没记录到，不让人以为没加（本人 11-24 20:34）
      const always = key === 'usage' && ['shutdown', 'sleep'].includes(li.dataset.state);
      const visible = values.some(v => v > 0) || always;
      li.style.display = visible ? '' : 'none';
      if (marked(data.states[state]?.label)) li.querySelector('.vz-legend__name b').textContent = '';
      li.querySelectorAll('.vz-legend__vals > span').forEach((cell, i) => {
        const value = values[i], label = rows.length > 1 && cell.querySelector('small')?.textContent;
        if (/没记录|没读到|缺口|下一轮/.test(data.states[state]?.label || '')) cell.className = 'row__sub';
        const none = always && label && !value && (li.dataset.state === 'shutdown' || rows[i] === 'computer');
        cell.style.display = value > 0 || none ? '' : 'none';
        if (none) {
          const text = li.dataset.state === 'sleep' ? '未记录到睡眠' : Array.isArray(data.rows[rows[i]].off_spans) ? '未记录到关机' : '关机记录读不到';
          cell.innerHTML = `<small>${esc(label)}</small> ${text}`;
        } else if (value > 0) {
          cell.innerHTML = cell.classList.contains('row__sub') ? `${rows.length > 1 && label ? `<small>${esc(label)}</small> ` : ''}${V.dur(value)}` : rows.length === 1 ? value >= 360000 ? `<b>${Math.round(value / 3600)}</b><small>小时</small>` : V.durHtml(value)
            : `${label ? `<small>${esc(label)}</small> ` : ''}${value >= 360000 ? `${Math.round(value / 3600)} 小时` : V.dur(value)}`; }
      });
    }
    if (key === 'network' && data.sinceStart != null) {
      const row = data.rows.day, from = seconds(row.from), to = seconds(row.to), plot = host.querySelector('[data-row="day"] .vz-tl__plot');
      plot?.insertAdjacentHTML('beforeend', `<span class="phone-start" style="left:${((data.sinceStart - from) / (to - from) * 100).toFixed(2)}%">${esc(stamp(iso(data.sinceStart)))} 起才有记录</span>`);
    }
    if (key === 'collect') {
      const link = host.querySelector('[data-row="link"] .vz-tl__plot');
      if (data.linkStart != null) link?.insertAdjacentHTML('beforeend', `<span class="phone-start">${esc(stamp(iso(data.linkStart)))} 起才有记录</span>`);
      const bottom = [...host.querySelectorAll('.vz-tl__row')].at(-1), axis = bottom?.querySelector('.vz-tl__axis');
      bottom?.classList.add('phone-axis-last');
      if (axis && data.display) { const [from, to] = data.display; axis.innerHTML = Array.from({ length: 7 }, (_, i) =>
        `<span class="vz-tl__tick${i === 0 ? ' is-start' : i === 6 ? ' is-now' : ''}" style="${i === 6 ? 'right:0' : `left:${i / 6 * 100}%`}">${U.date(iso(from + (to - from) * i / 6))}</span>`).join(''); }
    }
    if (key === 'usage') for (const [key, row] of Object.entries(data.rows)) {
      const el = host.querySelector(`[data-row="${CSS.escape(key)}"]`), plot = el?.querySelector('.vz-tl__plot'); if (!plot) continue;
      const from = seconds(row.from), to = seconds(row.to);
      if (key === 'computer' && to > from && !totals[key].some((n, i) => n > 0 && !['unrecorded', 'pending'].includes(data.states[i]?.id))) {
        el.insertAdjacentHTML('afterend', `<p class="phone-computer-gap use-note">${esc(stamp(row.from))} 至 ${esc(stamp(row.to))} ${fh(row.gap || '没有电脑使用记录', '缺失原因')}${pcOffline() ? `。${missing}` : ''}</p>`);
        continue;
      }
      for (const [i, [at, state]] of row.spans.entries()) if (data.states[state]?.id === 'unrecorded') {
        const width = (Math.min(row.spans[i + 1]?.[0] ?? to, to) - Math.max(at, from)) / (to - from) * 100;
        if (width > 8) plot.insertAdjacentHTML('beforeend', `<span class="phone-gap" style="left:${Math.max(0, (at - from) / (to - from) * 100)}%;width:${width}%">这段没记录</span>`);
      }
    }
  }
  function paintRank(host, graph, items, field, unit) {
    const rows = items == null ? null : [...items].sort((a, b) => (b[field] ?? -Infinity) - (a[field] ?? -Infinity));
    const nameField = a => viewer !== 'owner' && a.visibility === 'owner' ? a : a.name;
    graph.set(rows?.map((a, i) => ({ key: String(i), name: nameField(a) ?? '应用', value: a[field], unit,
      text: a[field] == null ? unread() : lowerText(a, field, unit === 'B' ? bytes(a[field]) : V.dur(a[field])), sub: a.opens == null ? '' : `打开 ${sp(a.opens)} 次` })) ?? null);
    const max = Math.max(0, ...(rows || []).map(a => a[field] ?? 0));
    for (const li of host.querySelectorAll('li[data-key]')) {
      const a = rows?.[Number(li.dataset.key)]; if (!a) continue;
      const name = nameField(a), label = name === a || marked(name) ? U.fieldHtml(name, { name: '应用名', kind: viewer, marker: true }) : listName(a);
      U.html(li.querySelector('.vz-rank__name'), label + (a.opens == null ? '' : `<small>打开 ${formattedHtml(a.opens, lowerText(a, 'opens', `${sp(a.opens)} 次`), '打开次数')}</small>`), false);
      const bar = li.querySelector('.vz-rank__bar > i'); if (bar) { bar.style.setProperty('--v', max > 0 ? a[field] / max : 0); bar.hidden = a[field] == null; }
    }
  }
  function usageSlices(items, kind) {
    if (items == null) return items;
    const positive = items.filter(item => Number.isFinite(item.value) && item.value > 0);
    const limit = positive.reduce((sum, item) => sum + item.value, 0) * .03;
    const other = item => item.id === 'other' || ['其他', '其他应用'].includes(item.label);
    const grouped = item => other(item) || item.value < limit;
    const small = positive.filter(grouped);
    if (!small.length) return items;
    const hidden = item => item?.hidden || item?.hidden_block || item?.visibility === 'pending' || item?.rewrite === 'pending'
      || kind !== 'owner' && (item?.visibility === 'owner' || item?.public === 'owner');
    const names = new Set(small.flatMap(item => {
      if (hidden(item) || item.id === 'undisclosed-category') return [];
      const members = other(item) ? (Array.isArray(item.members) ? item.members : []) : [item];
      return members.filter(member => !hidden(member)).map(member => member?.label ?? member?.name ?? member)
        .filter(label => !hidden(label)).map(label => U.fieldText(label, kind).trim()).filter(label => label && !marked(label));
    }));
    const tooltip = [...names].join('、');
    return [...items.filter(item => !other(item) && !small.includes(item)), {
      id: 'other', label: '其他', hue: 'stone', tooltip,
      value: small.reduce((sum, item) => sum + item.value, 0),
      q: small.some(item => isPartial(item, 'value')) ? 'partial' : 'ok',
    }];
  }
  function paintShare(host, graph, items, unit = 's') {
    graph.set(items?.map(item => {
      const known = V.categoryNames?.[item.id] || ({ video: '视频' })[item.id], label = item.label || known || item.name || item.title || item.text || item.id;
      const hue = item.hue || V.categoryHues?.[item.id] || (known || unit === 'B' ? undefined : ['teal', 'violet', 'pink', 'apricot'][Array.from(item.id).reduce((n, c) => (n + c.codePointAt(0)) % 4, 0)]);
      return { ...item, label: marked(label) ? '' : label, hue };
    }) ?? null); host._qualityItems = items || [];
    const tip = unit === 's' && items?.find(item => item.id === 'other')?.tooltip;
    if (tip) {
      host.querySelector('.vz-share__row[data-id="other"]')?.setAttribute('title', tip);
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = tip; host.querySelector('.vz-share__arcs [data-id="other"]')?.append(title);
    }
    markBelow(host, nameMark(unit === 'B' ? '存储分类' : '手机应用分类', items?.map(item => item.label)));
    const qualify = () => {
      const data = host._qualityItems;
      for (const row of host.querySelectorAll('.vz-share__row')) {
        const item = data.find(x => x.id === row.dataset.id), value = row.querySelector('.vz-share__v');
        if (item && value) { const text = lowerText(item, 'value', unit === 'B' ? bytes(item.value) : V.dur(item.value)); if (value.textContent !== text) value.textContent = text; }
      }
      const focused = [...host.querySelectorAll('.vz-share__row')].filter(row => !row.classList.contains('is-dim'));
      const lower = focused.length === 1 ? isPartial(data.find(x => x.id === focused[0].dataset.id), 'value') : data.some(x => isPartial(x, 'value'));
      const em = host.querySelector('.vz-share__mid em'); if (em && lower && !em.querySelector('[data-lower]')) em.insertAdjacentHTML('afterbegin', '<small data-lower>至少 </small>');
      if (em && !lower) em.querySelector('[data-lower]')?.remove();
    };
    if (!host._qualityObserver && items?.some(x => x.q === 'partial')) { host._qualityObserver = new MutationObserver(qualify); host._qualityObserver.observe(host, { childList: true, characterData: true, subtree: true }); }
    qualify();
  }
  // 近 7 天逐日状态：后台 usage-days 的 daily_states（每天每台各状态多少秒，今天只到已过的时间）；名字和颜色换成和近 24 小时同一套
  function usageDays(s) {
    const d = s?.daily_states;
    if (!d || !Array.isArray(d.days)) return null;
    const states = (d.states || []).map((st, i) => ({ ...st, i, label: USAGE_LABELS[st.id] || st.label, hue: USAGE_HUES[st.id] || ['teal', 'violet', 'pink', 'apricot'][i % 4], pattern: st.id === 'pending' ? 'hatch' : undefined }))
      .sort((a, b) => usageRank(a.id) - usageRank(b.id) || a.i - b.i);
    return { states, days: d.days, phoneOff: s.phone_power?.off_spans };
  }
  // 近 7 天每天两根叠起来的柱（本人 11-24 21:54 选 B）：手机一根、电脑一根，按状态从下往上叠；图例写 7 天合计，
  // 点图例只亮那一种、别的淡下去（和横带一样）；指着哪天，旁边写那天两台各状态多久。
  function dayStack(host) {
    const NS = 'http://www.w3.org/2000/svg', LEFT = 58, TOP = 10, DAY = 86400, lanes = [['phone', '手机'], ['computer', '电脑']];
    const id = `pd${Math.random().toString(36).slice(2, 8)}`;
    host.classList.add('phone-days');
    host.innerHTML = '<div class="phone-days__plot"><svg aria-hidden="true"></svg><div class="chart__axis" aria-hidden="true"></div><p class="vz-wait">加载中</p><span class="vz-tip phone-days__tip" hidden></span></div><div class="phone-days__x"></div><ul class="vz-legend"></ul><p class="use-note phone-days__note" hidden></p>';
    const plot = host.querySelector('.phone-days__plot'), svg = plot.querySelector('svg'), axis = plot.querySelector('.chart__axis'), wait = plot.querySelector('.vz-wait'), tip = plot.querySelector('.vz-tip');
    const xs = host.querySelector('.phone-days__x'), legend = host.querySelector('.vz-legend'), note = host.querySelector('.phone-days__note');
    let data = null, W = 0, hover = null, pinned = null, hovered = null, muted = null;
    const focus = () => hovered ?? pinned;
    const hex = h => V.hues[h] || h;
    const mix = (c, k) => { const n = parseInt(hex(c).slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return `rgb(${Math.round(r + (255 - r) * k)} ${Math.round(g + (255 - g) * k)} ${Math.round(b + (255 - b) * k)})`; };
    const chip = st => st.pattern === 'hatch' ? `<i class="vz-chip vz-chip--hatch" style="--c:${hex(st.hue)}"></i>` : `<i class="vz-chip" style="--c:${hex(st.hue)}"></i>`;
    const fill = st => st.pattern === 'hatch' ? `url(#${id}-hatch)` : st.hue === 'stone' ? 'rgb(201 197 187 / .62)' : `url(#${id}-${st.id})`;
    const total = (st, lane) => data.days.reduce((n, day) => n + (Number(day[lane]?.[st.id]) || 0), 0);
    const hasLane = (st, lane) => data.days.some(day => day[lane] && Object.hasOwn(day[lane], st.id));
    const sum = n => n >= 36000 ? `${Math.round(n / 3600)} 小时` : V.dur(n);
    const today = day => day.elapsed_s < DAY - 1;
    const dayStart = day => Date.parse(`${day.date}T00:00:00+08:00`) / 1000;
    const clock = day => U.time(iso(dayStart(day) + day.elapsed_s));
    function zeroText(st, lane) {
      if (st.id === 'shutdown') return lane === 'phone' && !Array.isArray(data.phoneOff) ? '关机记录读不到' : '未记录到关机';
      if (st.id === 'sleep' && hasLane(st, lane)) return '未记录到睡眠';
      return '';
    }
    function legendHtml() {
      return data.states.map(st => {
        const cells = lanes.filter(([lane]) => hasLane(st, lane)).map(([lane, name]) => {
          const n = total(st, lane), zero = n > 0 ? '' : zeroText(st, lane);
          return n > 0 || zero ? `<span${/没记录|下一轮/.test(st.label) ? ' class="row__sub"' : ''}><small>${name}</small> ${n > 0 ? esc(sum(n)) : zero}</span>` : '';
        }).join('');
        if (!cells) return '';
        const f = focus();
        return `<li class="vz-legend__item${pinned === st.id ? ' is-picked' : ''}${f != null && f !== st.id ? ' is-dim' : ''}" data-state="${esc(st.id)}" tabindex="0" role="button" aria-pressed="${pinned === st.id}">
          <span class="vz-legend__name" title="${esc(st.label)}">${chip(st)}<b>${esc(st.label)}</b></span><span class="vz-legend__vals">${cells}</span></li>`;
      }).join('');
    }
    function draw() {
      svg.replaceChildren(); axis.innerHTML = '';
      if (!data?.days.length || !W) return;
      const H = plot.clientHeight, base = H - 1, n = data.days.length, band = (W - LEFT) / n, f = focus();
      const y = v => base - Math.min(v, DAY) / DAY * (base - TOP);
      const bw = Math.max(8, Math.min(band * .27, 30)), gap = Math.max(3, Math.min(band * .06, 6));
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      let defs = `<pattern id="${id}-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#fff"/><rect width="6" height="6" fill="${hex('teal')}" fill-opacity=".14"/><line x1="1" y1="0" x2="1" y2="6" stroke="${hex('teal')}" stroke-opacity=".62" stroke-width="1.6"/></pattern>`;
      for (const st of data.states) if (st.pattern !== 'hatch' && st.hue !== 'stone') defs += `<linearGradient id="${id}-${esc(st.id)}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(st.hue, .2)}"/><stop offset=".55" stop-color="${hex(st.hue)}"/><stop offset="1" stop-color="${hex(st.hue)}"/></linearGradient>`;
      let grid = '', ys = '', body = '';
      for (let h = 0; h <= 24; h += 6) {
        const yy = Math.round(y(h * 3600)) + .5;
        grid += `<line x1="${LEFT}" x2="${W}" y1="${yy}" y2="${yy}"${h ? '' : ' class="is-base"'}/>`;
        ys += `<span class="chart__y" style="top:${yy}px;width:${LEFT - 12}px">${h ? `${h} 小时` : '0'}</span>`;
      }
      data.days.forEach((day, i) => {
        const cx = LEFT + band * i + band / 2;
        lanes.forEach(([lane], j) => {
          const vals = day[lane]; if (!vals) return;
          const x = j ? cx + gap / 2 : cx - gap / 2 - bw;
          let acc = 0, segs = '';
          for (const st of data.states) {
            const v = Number(vals[st.id]) || 0; if (!(v > 0)) continue;
            const y0 = y(acc), y1 = y(acc + v); acc += v;
            const picked = f === st.id, dim = f != null && !picked;
            segs += `<rect x="${x.toFixed(1)}" y="${y1.toFixed(2)}" width="${bw.toFixed(1)}" height="${Math.max(y0 - y1, 0).toFixed(2)}" fill="${fill(st)}"${dim ? ' opacity=".12"' : ''}/>`;
            if (picked) segs += `<rect x="${(x + .75).toFixed(1)}" y="${(y1 + .75).toFixed(2)}" width="${Math.max(bw - 1.5, .5).toFixed(1)}" height="${Math.max(y0 - y1 - 1.5, .5).toFixed(2)}" fill="none" stroke="rgba(28,36,48,.88)" stroke-width="1.5"/>`;
          }
          if (!segs) return;
          const top = y(acc), clip = `${id}-c${i}-${j}`;
          defs += `<clipPath id="${clip}"><rect x="${x.toFixed(1)}" y="${top.toFixed(2)}" width="${bw.toFixed(1)}" height="${(base - top).toFixed(2)}" rx="${Math.min(6, bw / 2)}"/></clipPath>`;
          body += `<g clip-path="url(#${clip})">${segs}</g>`;
        });
      });
      const hl = hover == null ? '' : `<rect class="phone-days__hl" x="${(LEFT + band * hover + 2).toFixed(1)}" y="${TOP - 6}" width="${(band - 4).toFixed(1)}" height="${base - TOP + 6}" rx="8"/>`;
      svg.innerHTML = `<defs>${defs}</defs><g class="chart__grid">${grid}</g>${hl}<g>${body}</g>`;
      axis.innerHTML = ys;
      xs.style.paddingLeft = `${LEFT}px`; xs.style.setProperty('--bw', `${bw}px`); xs.style.setProperty('--gap', `${gap}px`);
      xs.innerHTML = data.days.map((day, i) => `<span class="phone-days__lab${i === hover ? ' is-on' : ''}"><span class="phone-days__lanes"${i ? ' style="visibility:hidden"' : ''}>${lanes.map(([, name]) => `<small>${name}</small>`).join('')}</span>${esc(V.md(dayStart(day)))}${today(day) ? '<small>今天</small>' : ''}</span>`).join('');
    }
    function point(i) {
      if (i === hover) return;
      hover = i; draw();
      if (i == null || !data) { tip.hidden = true; return; }
      const day = data.days[i], t = dayStart(day);
      // 一种状态一行、两台上下分开：提示窄，放在这一天两根柱的旁边，不挡住它们
      const lines = lanes.filter(([lane]) => day[lane]).map(([lane, name]) => {
        const parts = data.states.filter(st => Number(day[lane][st.id]) > 0).map(st => `<span>${chip(st)}${esc(st.label)}<em>${esc(V.dur(Number(day[lane][st.id])))}</em></span>`);
        return `<small>${name}</small>${parts.join('') || '<span>没有记录</span>'}`;
      });
      tip.innerHTML = `<b>${esc(V.md(t))} ${esc(V.weekday(t))}${today(day) ? `（今天，到 ${clock(day)}）` : ''}</b>${lines.join('')}`;
      tip.hidden = false;
      const band = (W - LEFT) / data.days.length, bw = Math.max(8, Math.min(band * .27, 30)), cx = LEFT + band * i + band / 2, w = tip.offsetWidth;
      const right = cx + bw + 14, left = cx - bw - 14 - w;
      tip.style.left = `${right + w <= W ? right : left >= 0 ? left : Math.max(0, W - w)}px`;
      tip.style.top = `${TOP}px`;
    }
    U.pointing(plot, e => {
      if (!data?.days.length) return;
      const r = plot.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, band = (W - LEFT) / data.days.length;
      const i = Math.floor((x - LEFT) / band);
      point(i >= 0 && i < data.days.length ? i : null);
    }, () => point(null));
    const paintLegend = () => { U.html(legend, data ? legendHtml() : '', false); };
    const show = () => { draw(); paintLegend(); };
    const itemOf = e => e.target.closest?.('.vz-legend__item');
    function toggle(li) { const s = li.dataset.state; pinned = pinned === s ? null : s; hovered = null; muted = pinned ? null : s; show(); legend.querySelector(`[data-state="${CSS.escape(s)}"]`)?.focus({ preventScroll: true }); }
    legend.addEventListener('pointerover', e => { const s = itemOf(e)?.dataset.state ?? null; if (s !== muted) { muted = null; if (s !== hovered) { hovered = s; show(); } } });
    legend.addEventListener('pointerleave', () => { muted = null; if (hovered != null) { hovered = null; show(); } });
    legend.addEventListener('click', e => { const li = itemOf(e); if (li) toggle(li); });
    legend.addEventListener('keydown', e => { const li = (e.key === 'Enter' || e.key === ' ') && itemOf(e); if (li) { e.preventDefault(); toggle(li); } });
    new ResizeObserver(() => { const w = Math.round(plot.clientWidth); if (w !== W) { W = w; draw(); } }).observe(plot);
    return {
      set(payload) {
        data = payload && payload.days.length && (!pcOffline() || payload.days.some(day => lanes.some(([lane]) => day[lane]))) ? payload : null;
        const text = data ? '' : payload ? '没有记录' : pcOffline() ? missing : U.collectionText();
        wait.textContent = text; wait.hidden = !text; plot.classList.toggle('is-empty', !!text);
        if (data && !data.states.some(st => st.id === pinned)) pinned = null;
        W = Math.round(plot.clientWidth); hover = null; tip.hidden = true; show();
        if (!data) xs.innerHTML = '';
        const last = data?.days.at(-1);
        note.hidden = !data; U.html(note, data ? esc(`图例是这 ${data.days.length} 天的合计。${last && today(last) ? `今天（${V.md(dayStart(last))}）只画到 ${clock(last)}，后面还没过。` : ''}`) : '');
        if (data) { plot.classList.remove('is-in'); void plot.offsetWidth; plot.classList.add('is-in'); }
      },
    };
  }
  function chartHost(el, title) { const h = document.createElement('div'); h.className = 'phone-chart'; h.innerHTML = `<h3 class="use-two__k">${fh(title, '图表', 'title')}</h3><div></div>`; el.append(h); return h.lastElementChild; }
  const rangeStatus = key => $(`grp-${key}`)?.querySelector('.phone-range [role="status"]');
  function rangeBar(el, key, label) {
    const nav = document.createElement('div'); nav.className = 'phone-range';
    nav.innerHTML = `<span>${label}</span><span class="fog__note" role="status"></span><span class="seg" role="group" aria-label="${label}"><button type="button" data-needs-pc data-range="24h" aria-pressed="true">24 小时</button><button type="button" data-needs-pc data-range="7d" aria-pressed="false">近 7 天</button></span>`;
    for (const button of nav.querySelectorAll('[data-range]')) button.setAttribute('aria-pressed', String(button.dataset.range === (ranges[key] || '24h')));
    el.append(nav); nav.addEventListener('click', e => { const b = e.target.closest('[data-range]'); if (!b || pcOffline() || (ranges[key] || '24h') === b.dataset.range) return;
      ranges[key] = b.dataset.range; for (const x of nav.querySelectorAll('[data-range]')) x.setAttribute('aria-pressed', String(x === b));
      nav.querySelector('[role="status"]').textContent = `正在读${b.textContent.trim()}…`;
      watchCharts([key]); });
  }
  function buildChapter(el, group) {
    const key = group.key, setters = [], text = document.createElement('div');
    const tl = (id, title, rows) => {
      if (key !== 'collect') rangeBar(el, key, key === 'usage' ? '手机和电脑的使用记录' : '上网记录');
      const host = chartHost(el, title), n = document.createElement('p');
      let graph = V.timeline(host, { rows }), rowShape = JSON.stringify(rows), data = null;
      const updateGraph = s => {
        const dataRows = s?.timeline?.rows, keys = [...new Set([...rows.map(r => r.key), ...Object.keys(dataRows || {})])];
        const nextRows = keys.map(key => ({ key, label: (s?.id === 'collect-timeline' && key === 'runs' && dataRows?.runs?.label) || rows.find(r => r.key === key)?.label || dataRows?.[key]?.label || dataRows?.[key]?.name || dataRows?.[key]?.title || dataRows?.[key]?.text || key })), shape = JSON.stringify(nextRows);
        if (shape !== rowShape) { graph?.destroy?.(); host.replaceChildren(); graph = V.timeline(host, { rows: nextRows }); rowShape = shape; }
      };
      n.className = 'use-note'; host.after(n);
      // 两条带子各记到几点：最后一次记到之后的那一小段在图上是“等下一轮记录”，不是缺数据。
      const cut = ['usage-timeline', 'collect-timeline', 'network-timeline'].includes(id) ? document.createElement('p') : null;
      if (cut) { cut.className = 'use-note'; cut.hidden = true; n.after(cut); }
      const dayHost = id === 'usage-timeline' ? chartHost(el, '近 7 天 · 每天手机和电脑各是什么状态') : null;
      const days = dayHost && dayStack(dayHost);
      const decorate = () => timelineLabels(host, data, key);
      new ResizeObserver(() => requestAnimationFrame(decorate)).observe(host);
      setters.push(() => {
        const s = series(key, id), restricted = s?.visibility === 'owner' && viewer !== 'owner', daily = days && shownRanges[key] === '7d';
        host.hidden = !!restricted || !!daily; host.parentElement.hidden = !!daily;
        const dayS = series(key, 'usage-days');
        if (dayHost) { dayHost.parentElement.hidden = !daily || dayS?.visibility === 'owner' && viewer !== 'owner'; if (daily) days.set(usageDays(dayS)); }
        if (!restricted) updateGraph(s);
        data = restricted ? null : timeline(s);
        if (key === 'collect') {
          const link = data?.rows.link, style = host.querySelector('[data-row="link"]')?.style;
          const [from, to] = data?.display || [], width = to - from;
          if (style) for (const [prop, gap] of [['--phone-link-start', seconds(link?.from) - from], ['--phone-link-end-gap', to - seconds(link?.to)]]) {
            if (width > 0 && link?.spans.length) style.setProperty(prop, `${gap / width * 100}%`);
            else style.removeProperty(prop);
          }
        }
        graph.set(data); decorate();
        if (cut) { const text = timelineNote(id, data); cut.hidden = !text || !!daily; U.html(cut, esc(text)); }
        U.html(host.previousElementSibling, fh(title, '图表', 'title'));
        const mark = nameMark(key === 'collect' ? '手机采集记录' : key === 'network' ? '手机上网记录' : '手机和电脑使用记录', [s, ...(s?.timeline?.states?.map(state => state.label) || [])]);
        n.hidden = !mark; U.html(n, mark);
      });
    };
    if (key === 'usage') {
      tl('usage-timeline', '近 24 小时 · 手机和电脑', [{ key: 'phone', label: '手机' }, { key: 'computer', label: '电脑' }]);
      const row = document.createElement('div'); row.className = 'use-two'; el.append(row);
      const idle = document.createElement('p'); idle.className = 'use-note'; idle.hidden = true; el.append(idle);
      const shareOptions = { center: '今天已归类应用用时' }, shareHost = chartHost(row, '今天用在哪类应用'), share = V.share(shareHost, shareOptions), rankHost = chartHost(row, '今天哪个应用用得最久'), rank = V.rank(rankHost, { show: Infinity, keepNameOnlyRows: true, more: n => `展开（还有 ${n} 条）` });
      let usageItems, shareWidth;
      const paintUsageShare = () => {
        const folded = usageSlices(usageItems, viewer), legend = shareHost.querySelector('.vz-share__list');
        shareHost.style.minHeight = ''; legend.style.alignSelf = '';
        if (folded !== usageItems) {
          paintShare(shareHost, share, usageItems);
          const height = shareHost.getBoundingClientRect().height;
          // 只有分类图和排行并排时才按收起前的高度占位；窄窗口两块上下排，占位只会在圆环下面留一大块空白（M502）
          if (height && getComputedStyle(row).gridTemplateColumns.split(' ').length > 1) { shareHost.style.minHeight = `${height}px`; legend.style.alignSelf = 'start'; }
        }
        paintShare(shareHost, share, folded);
      };
      new ResizeObserver(([entry]) => {
        const width = entry.contentRect.width;
        if (!width || width === shareWidth) return;
        shareWidth = width;
        paintUsageShare();
      }).observe(shareHost);
      const heat = V.heatmap(chartHost(el, '几点在用 · 近 14 天'), { max: 60, what: '用了', today: true, ramp: 'hue', hue: 'pink' });
      setters.push(() => { const apps = series(key, 'usage-apps'), categories = series(key, 'usage-categories'), quiet = shownRanges[key] === '7d' ? '' : idleToday();
        const period = ({ today: '今天', last_7_calendar_days: '近 7 天' })[categories?.basis] ?? (shownRanges[key] === '7d' ? '近 7 天' : '今天');
        const values = categories?.basis ? categories.items?.map(item => item.value).filter(Number.isFinite) : null;
        shareOptions.center = `${period}${categories?.center_label || '已归类应用用时'}`;
        shareOptions.centerValue = values?.length ? values.reduce((total, value) => total + value, 0) : undefined;
        U.html(shareHost.previousElementSibling, `${period}用在哪类应用`); U.html(rankHost.previousElementSibling, `${period}哪个应用用得最久`);
        row.hidden = !!quiet; idle.hidden = !quiet; U.html(idle, esc(quiet)); row.classList.toggle('is-compact', categories?.items?.filter(x => x.value > 0).length === 1 && (apps?.items?.length || 0) < 2);
        usageItems = categories?.items; paintUsageShare();
        if (document.fonts?.status === 'loading') document.fonts.ready.then(() => { if (shareHost.isConnected) paintUsageShare(); });
        paintRank(rankHost, rank, apps?.items, 'seconds', 's'); heat.set(series(key, 'usage-hours')?.heatmap ?? null); });
    } else if (key === 'network') {
      tl('network-timeline', '几点在用哪张网', [{ key: 'day', label: '上网' }]);
      const traffic = document.createElement('div'); el.append(text, traffic);
      let charts = null;
      setters.push(() => {
        const state = phone?.network?.traffic?.state, available = ['ok', 'stale', 'partial'].includes(state);
        if (!available) {
          U.html(traffic, paragraph(pcOffline() ? missing : U.collectionText("流量记录")));
          charts = null; return;
        }
        if (!charts) {
          traffic.replaceChildren();
          const dailyHost = chartHost(traffic, '近 30 天每天流量');
          const dailySeries = [
            { id: 'sim1', label: 'SIM1', hue: 'teal' }, { id: 'sim2', label: 'SIM2', hue: 'violet' }, { id: 'wifi', label: 'WiFi', hue: 'blue' },
          ];
          const daily = V.bars(dailyHost, { stack: true, unit: 'B', series: dailySeries, get missingText() { return trafficMissing(); } });
          const meta = document.createElement('div'); traffic.append(meta);
          const appsHost = chartHost(traffic, '本月手机流量排行'), apps = V.rank(appsHost, { unit: 'B', show: Infinity, keepNameOnlyRows: true, more: n => `展开（还有 ${n} 条）` });
          charts = { daily, dailyHost, apps, appsHost, meta };
        }
        const ranking = series(key, 'network-traffic-apps');
        const daily = trafficBars(series(key, 'network-traffic'));
        const plot = daily ? { ...daily, labels: daily.labels.map((l, i) => {
          const d = l.text.match(/^(?:\d{4}-)?(\d{2})-(\d{2})$/);
          return d ? { ...l, title: l.title || l.text, text: d[2], sub: l.sub || (i === 0 || d[2] === '01' ? `${Number(d[1])} 月` : '') } : l;
        }) } : null;
        charts.daily.set(plot);
        for (const cell of charts.dailyHost.querySelectorAll('.chart__vals b')) if (cell.textContent === '没读到') cell.textContent = trafficMissing();
        paintRank(charts.appsHost, charts.apps, ranking?.items, 'bytes', 'B');
        const limits = phone.network.traffic.limits?.map(l => `<p class="use-note">${formattedHtml(l.sim, sp(l.sim).toUpperCase(), 'SIM 卡')} 在手机里设的上限 ${formattedHtml(l.limit, lowerText(l, 'limit', bytes(l.limit)), '流量上限')} · 本月还剩 ${formattedHtml(l.remaining, lowerText(l, 'remaining', bytes(l.remaining)), '剩余流量')}${l.reset_day ? ` · 每月 ${fh(l.reset_day, '流量重置日')} 日重置` : ''}</p>`).join('') || '';
        U.html(charts.meta,
          `<p class="use-note">系统调试（含无线调试）本月 WiFi ${readHtml('traffic_debug_wifi_month', '系统调试流量')} · TailSocks 本月手机流量 ${readHtml('traffic_tailsocks_mobile_month', 'TailSocks 流量')}</p>` + limits);
      });
    }
    else if (key === 'collect') tl('collect-timeline', '近 30 天', ['link', 'usage', 'location', 'packages', 'runs'].map((k, i) => ({ key: k, label: ['电脑连手机', '使用记录', '定位', '装机清单', '采集执行情况'][i] })));
    else if (key === 'battery') {
      rangeBar(el, key, '电量和温度走势');
      const stack = document.createElement('div'); stack.className = 'phone-battery-overlay'; el.append(stack);
      const host = chartHost(stack, '淡色底是在充电 · 左轴电量，右轴温度'), chart = C.create(host, { size: 'hero', lines: [{ id: 'battery', label: '电量', hue: 'violet' }], floor: 0, ceil: 100, showStartDate: true, sync });
      const tempHost = chartHost(stack, '淡色底是在充电 · 左轴电量，右轴温度'); tempHost.parentElement.classList.add('phone-temp');
      const temp = C.create(tempHost, { size: 'hero', lines: [{ id: 'battery_temp', label: '电池温度', hue: 'pink' }], floor: 'auto', unit: '℃', sync,
        onRead(values) { const cell = tempHost.querySelector('.chart__val b'); if (cell) cell.textContent = temperature(values[0]?.value); } });
      const missing = document.createElement('p'); missing.className = 'use-note'; stack.after(missing);
      const bands = document.createElement('div'); bands.className = 'phone-charge'; host.querySelector('.chart__plot').prepend(bands);
      setters.push(() => { const p = packs.get(key); chart.set(p || { series: [] }); temp.set(p || { series: [] });
        const battery = series(key, 'battery'), first = battery?.stats !== undefined ? battery.stats?.firstAt : battery?.points?.find(([, v]) => v != null)?.[0];
        const from = p?.from && Date.parse(p.from) / 1000;
        const late = first - from >= 60;
        missing.hidden = !late; U.html(missing, late ? `${stamp(p.from)}–${stamp(new Date(first * 1000).toISOString())} 没记录` : '');
        const r = timeline(series(key, 'battery-charging')), row = r?.rows?.day, len = row && Date.parse(row.to) / 1000 - Date.parse(row.from) / 1000;
        U.html(bands, len > 0 ? row.spans.map(([t, state], i) => state != null && r.states[state]?.id === 'charging' ? `<i style="left:${Math.max(0, (t - Date.parse(row.from) / 1000) / len * 100)}%;width:${Math.max(0, ((row.spans[i + 1]?.[0] ?? Date.parse(row.to) / 1000) - t) / len * 100)}%"></i>` : '').join('') : ''); });
    } else if (key === 'storage') {
      const host = chartHost(el, '存储用在哪'), graph = V.share(host, { center: '已用', unit: 'B' });
      setters.push(() => { const s = series(key, 'storage-share'); host.parentElement.hidden = !s?.items; paintShare(host, graph, storageItems(s), 'B'); });
    }
    const unsaved = document.createElement('p'); unsaved.className = 'use-note'; unsaved.hidden = true; unsaved.textContent = missing; el.prepend(unsaved); if (key !== 'network') el.append(text);
    return { set() {
      for (const child of el.querySelectorAll(':scope > [data-pc-hidden]')) { child.hidden = false; child.removeAttribute('data-pc-hidden'); }
      setters.forEach(f => f()); U.html(text, details(key));
      const empty = pcOffline() && chartDone.has(key) && setters.length > 0 && !packs.get(key)?.series?.length; unsaved.hidden = !empty;
      if (empty) for (const child of el.children) if (child !== text && child !== unsaved && !child.classList.contains('phone-range') && !child.hidden) { child.setAttribute('data-pc-hidden', ''); child.hidden = true; }
    } };
  }
  const shortList = function (list, row, unit = '条', listItems = false, show = 5) {
    const rows = U.mergePrivateRows(list, { value: item => item.name ?? item.text ?? item, kind: viewer }), top = rows.slice(0, show), rest = rows.slice(show);
    const render = (item, i) => item.private_count ? `${listItems ? '<li class="row">' : '<p class="use-note">'}${U.privateSummary(item.private_count, { unit })}${listItems ? '</li>' : '</p>'}` : row(item, i);
    const remaining = rest.reduce((n, item) => n + (item.private_count || 1), 0);
    return top.map(render).join('') + (rest.length ? `${listItems ? '<li>' : ''}<details><summary class="more">展开（还有 ${remaining} ${unit}）</summary>${listItems ? '<ul class="rows">' : ''}${rest.map((item, i) => render(item, i + show)).join('')}${listItems ? '</ul>' : ''}</details>${listItems ? '</li>' : ''}` : '');
  };
  function collectionChain(d) {
    return [['手机采集器', d?.collector], ['电脑汇总', d?.export], ['理解库导入', d?.preferences_import]].map(([label, step]) => {
      if (step?.hidden || viewer !== 'owner' && (step?.visibility === 'owner' || step?.public === 'owner')) return detail(label, step);
      const state = step?.status ?? step?.state, text = ({ online: '在采集', ok: label === '电脑汇总' ? '汇总成功' : '导入成功', success: '导入成功', succeeded: '导入成功', failed: '失败', error: '失败', offline: '没在采集' })[state];
      const times = [['记录于', step?.at], ['最近尝试', step?.attempted_at], ['采用的收件', step?.received], ['最近成功', step?.last_ok_at], ['下次汇总', step?.next_at]].filter(([, value]) => value);
      const shown = label === '手机采集器' ? roundText(step) : step?.text;
      return `<div><dt>${fh(label, '采集步骤', 'label')}</dt><dd>${U.status(step, { small: true }).lamp}${fh(shown ?? text ?? unread(), label)}${step?.error ? `<small class="phone-reading-note">${fh(step.error, `${label}原因`)}</small>` : ''}${times.map(([name, value]) => `<small class="phone-reading-note">${fh(name, '时间说明')} ${stampHtml(value)}</small>`).join('')}</dd></div>`;
    }).join('');
  }
  function details(key) {
    if (key === 'usage' && idleToday()) return '';
    const notes = groupMetrics(key).filter(m => m.note), all = Object.keys(names).flatMap(groupMetrics);
    return detailBody(key) + (notes.length ? `<dl class="phone-details">${notes.map(m =>
      `<div><dt>${fh(metricLabel(m, key), names[key], 'label')}</dt><dd>${readHtml(m.id, metricLabel(m, key))}${all.find(x => x.note === m.note) === m ? `<small class="phone-reading-note">${fh(m.note && typeof m.note === 'object' ? m.note : humanText(m.note), `${metricLabel(m, key)}说明`)}</small>` : ''}</dd></div>`).join('')}</dl>` : '')
      + (key === 'network' ? (window.PhoneDraw10?.traffic(trafficProject?.viewer === viewer ? trafficProject.data : null, viewer) || '') + (window.PhoneDraw10?.days(trafficDays?.viewer === viewer ? trafficDays.data : null, viewer) || '') : '');
  }
  function detailBody(key) {
    const d = phone?.[key];
    // 今天没用过时拿起、放下没有意义（凌晨重启也会记成一次），不画；解锁后最先打开是空表时连标题一起不画，不留空块
    if (key === 'usage') return idleToday() ? '' : `<dl class="phone-details">
      ${detail('第一次拿起', d?.first_pickup ? stampValue(d.first_pickup) : null)}
      ${detail('最后一次放下', d?.last_putdown ? stampValue(d.last_putdown) : null)}</dl>
      ${Array.isArray(d?.first_after_unlock) && !d.first_after_unlock.length ? '' : `<h3 class="use-two__k">解锁后最先打开</h3>${markNote('解锁后应用', d?.first_after_unlock?.map(a => a.name ?? a))}
      ${d?.first_after_unlock == null ? paragraph(null) : shortList(d.first_after_unlock, a =>
        `<p class="use-note">${listName(a, d.first_after_unlock, d)}${a.count == null ? pcOffline() ? '' : ` · ${U.collectionText('次数', a)}` : ` · ${formattedHtml(a.count, lowerText(a, 'count', `${sp(a.count)} 次`), '打开次数')}`}</p>`)}`}`;
    if (key === 'network') return `<dl class="phone-details">
      ${[['default_data_sim', '默认数据卡'], ['sim1', 'SIM1'], ['sim2', 'SIM2'], ['sim_seconds', '今天走 SIM 卡'], ['network_switches', '今天切网']]
        .filter(([id], i) => !metric(id)?.note && (i < 3 || val(id) != null || ['ok', 'stale', 'partial'].includes(d?.traffic?.state))).map(([id, label]) => detail(label, readValue(id))).join('')}
      ${val('net_kind') === 'wifi' && metric('ssid') ? `<div><dt>WiFi 名</dt><dd>${reading('ssid') ? `${readHtml('ssid', 'WiFi 名')}${note(metric('ssid'), '') ? ' · ' : ''}` : ''}${note(metric('ssid'), '')}</dd></div>` : ''}</dl>`;
    if (key === 'collect') {
      const gaps = d?.gaps == null ? `<li>${paragraph(null)}</li>` : shortList([...d.gaps].sort((a, b) => Date.parse(b.from) - Date.parse(a.from)), (g, i) => `<li class="row">
        <div class="row__text">${g.text === phone?.why ? '' : `<p class="row__main">${fh(g.text, '手机空档')}</p>`}
          <p class="row__sub">${stampHtml(g.from)}${g.to && stamp(g.to) !== stamp(g.from) ? `–${stampHtml(g.to)}` : ''} · ${g.to && stamp(g.to) === stamp(g.from) ? '不到 1 分钟' : '这段'}${g.kind === 'not_run' ? '没采集' : waitingGap(g) ? '等下一轮记录' : '缺记录'}</p></div>
        <span class="row__acts">${U.actions({ id: `phone-gap-${i}`, text: g.text }, [{ kind: 'copy', label: '问情况',
          text: `帮我看看手机：${sp(g.text)}，${stamp(g.from)}，卡在哪。` }])}</span></li>`, '条', true, 5) || `<li>${paragraph('这段时间没有空档')}</li>`;
      const helpers = shortList(d?.helpers?.filter(h => h.name && !['MacroDroid', 'TailSocks'].includes(h.name)) || [], h => `<p class="use-note">${fh(h.name, '辅助应用', 'label')} · ${fh(h.text ?? (h.state === 'online' ? '在跑' : h.state === 'offline' ? '没在跑' : unread()), '辅助应用状态')}</p>`);
      const runs = d?.runs24h, runText = typeof runs === 'number' ? `跑了 ${lowerText(d, 'runs24h', runs)} 次`
        : runs ?? U.collectionText('运行次数', d, null, 'runs24h');
      return `${window.PhoneDraw10?.diagnosis(d?.diagnosis, viewer) || ''}${d?.since ? '' : paragraph(d?.text)}
        <dl class="phone-details">${collectionChain(d)}</dl>
        <h3 class="use-two__k">最近的空档</h3><ul class="rows">${gaps}</ul>
        ${pcOffline() && runs == null ? '' : `<p class="use-note">个人采集 ${fh(d?.app_version ?? unread(), '采集版本')} · 近 24 小时${fh(runText, '采集次数')}</p>`}${helpers}
        <p class="phone-links"><a href="${route('/live/notifications/')}">通知发送回执 ›</a>
          ${d?.project_href ? `<a href="${esc(route(d.project_href))}">手机日记本 ›</a>` : ''}</p>`;
    }
    if (key === 'battery') return `<dl class="phone-details">
      ${d?.last_full ? detail(d.last_full_basis === 'first_sample' ? '本轮首次采到满电' : '最近读到满电', stampValue(d.last_full)) : ''}
      ${['battery_cycles', 'battery_health'].filter(id => val(id) != null).map(id =>
        detail(id === 'battery_cycles' ? '循环次数' : '电池健康', readValue(id))).join('')}</dl>`;
    if (key === 'storage') return `<dl class="phone-details">
      <div><dt>内存</dt><dd>${[!pcOffline() || val('memory_used') != null ? `已用 ${readHtml('memory_used', '内存已用')}` : '', !pcOffline() || val('memory_total') != null ? `共 ${readHtml('memory_total', '内存总量')}` : ''].filter(Boolean).join(' · ')}${memoryMeter()}</dd></div></dl>
      ${d?.growth_text ? paragraph(d.growth_text) : ''}
      <p class="phone-links"><a href="${route('/live/backup/?id=personal_media')}">手机照片备份到哪天 ›</a></p>`;
    const s = d?.system;
    // 更新看近 7 天；新装、卸载很少，看近 90 天（本人 11-24 00:39）。近 90 天的覆盖不全写清从哪天起有，旧后台没有 changes90 按“未读到”（M642）。
    const changeRows = rows => shortList([...rows].sort((a, b) => Date.parse(b.at) - Date.parse(a.at)), a => `<p class="use-note">${stampHtml(a.at)} · ${listName(a)}</p>`, '条');
    const updated = Array.isArray(d?.changes7) ? d.changes7.filter(a => a.kind === 'updated') : null;
    // 只有近 90 天的起点真的早于最早一条记录，才写哪几天没记录；记录全了、或者后台没给起点判断不了，就不写（本人 11-25 16:30，M911）
    const c90 = d?.changes90, items90 = Array.isArray(c90?.items) && c90.q !== 'unknown' ? c90.items : null;
    const start90 = Date.parse(c90?.window?.from), first90 = Date.parse(c90?.coverage?.from);
    const partial90 = !!items90 && Number.isFinite(start90) && Number.isFinite(first90) && first90 - start90 >= 86400000;
    const from90 = partial90 ? U.date(c90.coverage.from) : '';
    const recent = (kind, word) => {
      if (!items90) return paragraph(`近 90 天的${word}记录未读到`);
      const rows = items90.filter(a => a.kind === kind);
      return rows.length ? changeRows(rows) : paragraph(partial90 ? `这段记录里没有${word}` : `近 90 天没有${word}`);
    };
    const section = (title, body) => `<section><h3 class="use-two__k">${title}</h3>${body}</section>`;
    const changes = section('更新 · 近 7 天', updated == null ? paragraph(null) : updated.length ? changeRows(updated) : paragraph('近 7 天没有更新'))
      + `<div class="phone-changes__side">${partial90 ? paragraph(`装卸记录从 ${from90} 起才有，近 90 天里 ${U.date(c90.window.from)} 到 ${from90} 没有记录`) : ''}${section('新装 · 近 90 天', recent('added', '新装'))}${section('卸载 · 近 90 天', recent('removed', '卸载'))}</div>`;
    return `<h3 class="use-two__k">应用装卸和更新</h3>${markNote('应用变化名称', [...(d?.changes7 || []), ...(items90 || [])].map(a => a.name ?? a))}<div class="phone-changes">${changes}</div>
      <dl class="phone-details">${[['model', '型号'], ['android', 'Android'], ['build', '系统版本']]
        .map(([k, label]) => detail(label, s?.[k])).join('')}${detail('开机多久', s?.uptime_s && typeof s.uptime_s === 'object' ? s.uptime_s : V.dur(s?.uptime_s))}
        ${s?.last_boot ? detail('上次重启', stampValue(s.last_boot)) : ''}</dl>
      <p class="phone-links"><a href="${route('/live/phone/apps/')}">全部${val('apps_count') == null ? '' : ` ${readHtml('apps_count', '应用数量')} 个`}应用 ›</a></p>`;
  }
  // 内存那行下面一条用量条，样子照电脑页的比例条（M643）。
  function memoryMeter() {
    const used = val('memory_used'), total = val('memory_total');
    if (typeof used !== 'number' || typeof total !== 'number' || !(total > 0)) return '';
    const share = Math.max(0, Math.min(1, used / total));
    return `<span class="phone-meter" role="img" aria-label="内存已用 ${Math.round(share * 100)}%"><i style="--v:${share.toFixed(3)}"></i></span>`;
  }
  // 首屏底下的型号和规格，样子照电脑页台式机那一块（M643）。规格从机器上低频取（data.device），回包里有哪项才显示哪项，带截至哪天。
  const screenText = v => !v || typeof v !== 'object' ? '' : v.visibility || v.hidden ? fh(v, '屏幕') : [Number.isFinite(v.width_px) && Number.isFinite(v.height_px) ? `${v.width_px}×${v.height_px}` : '', Number.isFinite(v.refresh_hz) ? `${v.refresh_hz} Hz` : ''].filter(Boolean).join(' · ');
  function specHtml(s, dev) {
    const ram = dev?.ram_nominal_gb, rom = dev?.storage_nominal_gb;
    const rows = [
      ['型号', [dev?.market_name && fh(dev.market_name, '手机型号'), s?.model && fh(s.model, '手机型号')].filter(Boolean).join(' · ')],
      ['SoC', dev?.soc ? fh(dev.soc, 'SoC') : ''],
      ['规格', ram != null || rom != null ? `${[ram != null && `${fh(ram, '运行内存')} GB 运行内存`, rom != null && `${fh(rom, '存储')} GB 存储`].filter(Boolean).join(' + ')}<small>标称</small>` : ''],
      ['电池', Number.isFinite(dev?.battery_mah) ? `${Math.round(dev.battery_mah).toLocaleString('en-US')} mAh` : dev?.battery_mah ? fh(dev.battery_mah, '电池容量') : ''],
      ['屏幕', screenText(dev?.screen)],
      ['系统', [dev?.os_version && fh(dev.os_version, '系统'), s?.android != null && !/android/i.test(typeof dev?.os_version === 'string' ? dev.os_version : '') && `Android ${fh(s.android, 'Android 版本')}`, s?.build && fh(s.build, '系统版本')].filter(Boolean).join(' · ')],
      ['补丁', s?.patch ? fh(s.patch, '安全补丁') : ''],
    ].filter(([, html]) => html);
    const at = Number.isFinite(Date.parse(dev?.source_at)) && (dev.market_name || dev.soc || ram != null || rom != null || dev.os_version || dev.battery_mah || dev.screen) ? `<p class="phone-spec__at">规格截至 ${esc(U.date(dev.source_at))}</p>` : '';
    return rows.length ? `<dl class="phone-spec">${rows.map(([label, html]) => `<div><dt>${label}</dt><dd>${html}</dd></div>`).join('')}</dl>${at}` : '';
  }
  function compareText(text) {
    if (typeof text !== 'string' || !/^(?:今天亮屏)?比近\s*7\s*天平均[多少]\s*\d+(?:\.\d+)?\s*分钟[。.]?$/.test(text.trim())) return text;
    const on = metric('screen_on');
    const at = [phone?.usage?.comparison?.current_to, on?.coverage?.to, on?.at_precision === 'date' ? null : on?.at]
      .find(t => typeof t === 'string' && /[T ]\d{2}:\d{2}/.test(t) && Number.isFinite(seconds(t)));
    return at ? `当天的亮屏时间读到 ${stamp(at)}，此前 7 天同一时刻的平均还没读到` : '';
  }
  function line(key) {
    const r = phone?.received;
    if (key === 'usage') return shownRanges.usage === '7d' ? '' : compareText(phone?.usage?.compare_text) || '';
    if (key === 'network') return val('net_kind') == null && pcOffline() ? '' : `${pcOffline() ? '上网走' : '现在走'} ${val('net_kind') === 'wifi' ? 'WiFi' : netText()}`;
    if (key === 'collect') return (r?.gap?.text || phone?.collect?.gaps?.some(g => g.kind === 'data_gap' && !g.recovered && !waitingGap(g))) ? '有数据缺口，见最近的空档' : (r?.complete30 == null ? pcOffline() ? '' : U.collectionText("近 30 天") : r.complete30 ? '近 30 天数据收全了' : phone?.collect?.since ? `线路从 ${U.date(phone.collect.since)} 起才有记录` : '近 30 天数据有缺');
    if (key === 'battery') return val('charging') == null ? pcOffline() ? '' : U.collectionText("充电状态 · ") : val('charging') ? '在充电' : '没充电';
    if (key === 'storage') return [!pcOffline() || val('storage_free') != null ? `还剩 ${reading('storage_free')}` : '', !pcOffline() || val('storage_total') != null ? `共 ${reading('storage_total')}` : ''].filter(Boolean).join(' · ');
    return phone?.apps?.text || '';
  }
  const figures = { usage: [['screen_on', '亮屏'], ['longest_screen_on', '最长连续亮屏'], ['opens', '打开应用'], ['unlocks', '解锁']], network: [['sim_seconds', '今天走 SIM 卡'], ['network_switches', '今天切网'], ['sim1', 'SIM1'], ['sim2', 'SIM2']], collect: [['last_received', '最近收到'], ['night_gap', '昨夜数据缺口'], ['longest_not_run', '最长多久没采集'], ['runs24h', '近 24 小时采集了几次']], battery: [['battery', '现在'], ['battery_temp', '电池温度'], ['charges_today', '今天充电'], ['full_duration', '充满能用'], ['max_temp', '今天最高']], storage: [['storage_used', '存储已用'], ['storage_week_growth', '这周涨'], ['storage_days_to_full', '照这样约几天满'], ['memory_used', '内存已用']], apps: [['apps_count', '已装'], ['changes7_count', '近 7 天变化'], ['uptime', '开机'], ['security_patch', '安全补丁']] };
  function groupMetrics(key) {
    const ids = new Set((figures[key] || []).map(([id]) => id));
    const extras = { battery: ['battery_temp', 'charging'], storage: ['storage_free', 'storage_total', 'memory_total'], network: ['net_kind', 'carrier', 'default_data_sim'] };
    (extras[key] || []).forEach(id => ids.add(id));
    return (phone?.metrics || []).filter(m => ids.has(m.id) || key === 'network' && m.id.startsWith('traffic_'));
  }
  function partialSignals(key) {
    const p = packs.get(key), stats = phone?.[key];
    return [groupMetrics(key), stats, phone?.blocks?.[key], p, p?.series,
      stats?.first_after_unlock, stats?.traffic, stats?.traffic?.limits, ...(p?.series || []).map(s => s.items)].flat(2).filter(o => o?.q === 'partial');
  }
  function phoneReadingTime(at) {
    return typeof at === 'string' && Number.isFinite(Date.parse(at)) ? U.time(at) : '';
  }
  function receivedTimes(received) {
    const when = at => phoneReadingTime(at) && (U.date(at) === U.date(Date.now()) ? U.time(at) : `${U.date(at)} ${U.time(at)}`);
    const status = when(received?.phone_upto), last = when(received?.last_at);
    return [status && `采集器状态 ${status}`, last && `电脑最近收件 ${last}`].filter(Boolean).join(' · ');
  }
  function lastOnlineNote(d, disconnected) {
    if (!disconnected && (['online', 'warming'].includes(d?.state) ||
      d?.state === 'partial' && (d.link?.since || d.lamp_q === 'ok' && d.last_online === d.at))) return '';
    const time = phoneReadingTime(d?.last_online);
    // last_online 是电脑上次用调试连接连上手机的时刻：手机整台离线时照旧叫“上次确认在线”，并写明是两条路都找不到；
    // 只有调试连接断时手机可能还在线，改叫“电脑最后连上手机”，不让人以为手机不在线（主持 11-26 定）
    if (d?.presence?.state === 'offline') return ['电脑的调试连接和 Tailscale 都找不到手机', time && `上次确认在线 ${shortDate(d.last_online)} ${time}`].filter(Boolean).join(' · ');
    if (d?.state === 'offline') return time ? `电脑最后连上手机 ${shortDate(d.last_online)} ${time}` : '';
    return time ? `上次确认在线 ${shortDate(d.last_online)} ${time}` : '';
  }
  function showReceivedTimes(card, text) {
    let note = card.querySelector('[data-phone-received-times]');
    if (!text) { note?.remove(); return; }
    if (!note) {
      note = document.createElement('span');
      note.dataset.phoneReceivedTimes = '';
      note.className = 'row__sub';
      card.querySelector('.grp__title').append(note);
    }
    note.textContent = text;
  }
  function missingReadingNames(metrics, missingReadings) {
    const chinese = /[\u3400-\u9fff]/;
    const names = Object.fromEntries((metrics || []).filter(m => chinese.test(sp(m.label)) && !marked(m.label)).map(m => [m.id, m.label]));
    if (Array.isArray(missingReadings)) names.readings = missingReadings.map(id => names[id] || (chinese.test(id) ? id : '')).filter(Boolean).join('、');
    return names;
  }
  function distinctNotes(...shown) {
    const parts = value => typeof value === 'string' ? value.split(/\s*·\s*/).map(s => s.trim()).filter(Boolean) : [];
    const seen = shown.flatMap(parts);
    return value => parts(value).filter(text => {
      if (seen.some(s => s === text || U.sameCutoffNote(s, text))) return false;
      seen.push(text); return true;
    }).join(' · ');
  }
  // 卡头悬停提示：只写行里看得见的几句，不重复，中间用“ · ”隔开（上面去掉“上网和流量 · ”这类前缀以后再写，免得提示里还是旧字）。
  function lineTip(card) {
    const line = card.querySelector('.grp__line');
    if (!line) return;
    const seen = new Set(), visible = n => n.nodeType !== 1 || getComputedStyle(n).display !== 'none';
    const parts = [...line.childNodes].filter(visible).flatMap(n => n.nodeType === 1 && n.matches('.grp__status') ? [...n.childNodes].filter(visible) : [n])
      .flatMap(n => n.textContent.split(/\s*·\s*/)).map(t => t.trim()).filter(t => t && !seen.has(t) && seen.add(t));
    if (parts.length) line.title = parts.join(' · '); else line.removeAttribute('title');
  }
  function tidyGroupStatus(card, key) {
    const said = card.querySelector('.grp__said'), status = card.querySelector('.grp__status'), cutoff = card.querySelector('.grp__cutoff');
    const unique = distinctNotes(said.textContent, cutoff.textContent);
    const cleaned = status.cloneNode(true);
    const bare = [...cleaned.childNodes].filter(node => node.nodeType === Node.TEXT_NODE);
    for (const node of bare) node.data = unique(node.data);
    status.toggleAttribute('data-leading-note', bare.some(node => node.data));
    for (const block of cleaned.querySelectorAll(':scope > [data-block]')) {
      const text = unique(block.textContent.replace(`${names[key]} · `, ''));
      if (text) U.html(block, fh(text, names[key]));
      else block.remove();
    }
    U.html(status, cleaned.innerHTML, false);
  }
  function refresh() {
    const received = receivedTimes(phone?.received);
    const keys = [...new Set([...Object.keys(names), ...(phone?.groups || []).map(g => g.key || g.id).filter(Boolean)])];
    board.set(keys.map((key, i) => {
      const given = phone?.groups?.find(g => (g.key || g.id) === key);
      const name = key === 'usage' && shownRanges.usage === '7d' ? '近 7 天怎么用的' : names[key] || [given?.label, given?.name, given?.title, given?.text].find(value => value && (typeof value !== 'string' || value.trim())) || key;
      if (!Object.hasOwn(names, key)) {
        const color = Array.from(key).reduce((n, c) => (n + c.codePointAt(0)) % palettes.length, 0);
        return {
          ...given, key, name, pic: groupPics.apps, palette: palettes[color], line: given?.why || given?.reason || '',
          figures: given?.figures || (phone?.metrics || []).filter(m => m.group === key).map(m => ({
            key: m.id, label: m.label || m.name || m.title || m.id, text: reading(m.id),
          })),
        };
      }
      if (done && phone?.state === 'unknown' && !pcOffline()) return { key, name, pic: groupPics[key], palette: palettes[i], ...given, line: `${name}暂时读不到`, empty: true, figures: [] };
      const raw = phone?.blocks?.[key], group = given;
      const g = key === 'collect' ? collectionMeta(group) : group;
      const sourceBlock = key === 'collect' ? collectionMeta(raw) : raw;
      const block = sourceBlock && { ...sourceBlock, reason: sp(sourceBlock.reason), summary: sp(g?.reason) }, b = V.blockState(block, pcOffline());
      const missingNames = g?.partial?.length ? { ...missingReadingNames(phone?.metrics, g.missing_readings), ...g.missingNames } : g?.missingNames;
      const compact = key === 'battery' || key === 'storage', status = compact && g ? U.status(g, { missingNames }).note || '' : '';
      const inStatus = value => { const html = value && status && U.fieldHtml(value, { name: '状态说明' }); return html && status.includes(html); };
      const reason = inStatus(g?.reason) ? '' : g?.reason, summary = line(key);
      if (compact && b?.text && g) {
        const cutoff = U.olderNote?.(block.at, block) || '', at = block.source_at ?? block.at, statusAt = g.source_at ?? g.at;
        const sameCutoff = cutoff && seconds(at) === seconds(statusAt) && [status, sp(g.why)].some(text =>
          text.includes(cutoff) || /最后读到|上一次读到|最近一次记录于|截至|采样/.test(text) && text.includes(cutoff.split(' ').at(-1)));
        if (sameCutoff && b.text.startsWith(cutoff)) b.text = b.text.slice(cutoff.length).replace(/^ · /, '');
        if (block.reason && inStatus(raw.reason) && b.text.endsWith(block.reason)) b.text = b.text.slice(0, -block.reason.length).replace(/ · $/, '');
      }
      const source = key === 'network' && ['ok', 'stale', 'partial'].includes(phone?.network?.traffic?.state)
        ? [['traffic_today_mobile', `${readingDay('traffic_today_mobile')}手机流量`], ...(metric('traffic_month_mobile') ? [['traffic_month_mobile', '本月手机流量']] : [['traffic_month_sim1', '本月 SIM1'], ['traffic_month_sim2', '本月 SIM2']]), ['traffic_month_wifi', '本月 WiFi']] : figures[key];
      const figs = source.filter(([id]) => (id !== 'last_received' || !received) && (!pcOffline() || val(id) != null || metric(id)?.accumulating || id === 'last_received' && phone?.received?.last_at) && (!['charges_today', 'full_duration', 'max_temp', 'storage_week_growth', 'storage_days_to_full'].includes(id) || val(id) != null || metric(id)?.accumulating)).map(([id, label]) => {
        const m = metric(id), n = val(id);
        const value = typeof n === 'number' && m?.unit && m.unit !== '℃' && !isPartial(m, 'value') && !(m.unit === 'B' && Math.abs(n) < 1024 && n !== 0) ? { value: n, unit: m.unit } : { text: reading(id) };
        if (id === 'apps_count' && n != null) value.text = lowerText(m, 'value', `${sp(n)} 个应用`);
        if (id === 'last_received') value.text = phone?.received?.last_at ? U.time(phone.received.last_at) : unread();
        const gap = /没有记录|还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|没读全|没记录|未记录|数据缺口|暂时读不到/.test(value.text || '') ? value.text : '';
        if (gap) { delete value.value; delete value.unit; value.text = ''; }
        return { gap, key: id, label: pcOffline() && label === '现在' ? '电量' : label, ...value };
      });
      const partial = partialSignals(key);
      const display = summary && (key === 'usage' && typeof summary === 'string' ? summary : humanText(summary));
      const statusShowsReason = U.status(g).tone !== 'none';
      const lineText = phone?.state === 'unknown' ? unread() : [display, !statusShowsReason && g?.why && humanText(g.why)].filter(text => text && (key !== 'collect' || text !== names[key])).join(' · ');
      const unique = distinctNotes(lineText, statusShowsReason && sp(g?.why), statusShowsReason && sp(g?.stale_text));
      const blockText = unique(sourceBlock !== raw && b?.reason ? b.reason : b?.text);
      const gaps = partial.map(o => o.gap).filter(text => text && !inStatus(text)).map(text => unique(humanText(text))).filter(Boolean);
      return { ...g, key, name, pic: groupPics[key], palette: palettes[i], missingNames, reason: compact && typeof reason === 'string' && reason && !marked(reason) ? [...new Set([lineText, humanText(reason)].filter(Boolean))].join(' · ') : reason,
        line: lineText, wait: !done || b?.wait || !chartDone.has(key),
        empty: partial.length ? false : b?.empty, blocks: [...(blockText ? [{ key: names[key], ...b, text: blockText }] : []), ...gaps.map(text => ({ key: names[key], state: 'partial', text }))], figures: figs, build: buildChapter };
    }));
    for (const card of board.cards()) {
      card.id = `grp-${card.dataset.key}`;
      if (card.dataset.key === 'collect') showReceivedTimes(card, received);
      U.blockNote(card, chartStates[card.dataset.key]);
      for (const node of card.querySelectorAll('.grp__said')) node.classList.toggle('row__sub', /这块还没算好/.test(node.textContent));
      tidyGroupStatus(card, card.dataset.key);
      if (card.dataset.key === 'usage' && !card.querySelector('.grp__extra:not([hidden])') && !card.querySelector('.grp__line').textContent.trim()) {
        U.html(card.querySelector('.grp__said'), chartDone.has('usage') ? `${shownRanges.usage === '7d' ? '近 7 天' : '今天'}的使用记录暂时读不到` : '加载中');
      }
      lineTip(card);
      for (const fig of card.querySelectorAll('.grp__fig')) { fig.toggleAttribute('data-lower', isPartial(metric(fig.dataset.key), 'value')); fig.toggleAttribute('data-accumulating', metric(fig.dataset.key)?.value === null && !!metric(fig.dataset.key)?.accumulating); }
    }
  }
  const board = V.board($('board'), { key: 'phone', sync, onCount(c) {
    const warns = phone?.why ? [] : (phone?.groups || []).filter(g => ['red', 'yellow'].includes(g.level) && g.reason && phone?.state !== 'offline' && phone?.blocks?.[g.key]?.state !== 'stale' && !phone?.collect?.gaps?.some(gap => gap.text === g.reason));
    U.html(part('warns'), warns.map(g => `<li>${g.key ? `<a href="#grp-${g.key}" data-goto="${g.key}">${fh(g.reason, names[g.key], 'label')}</a>${marked(g.reason) ? ' · ' + fh(g.reason, names[g.key]) : ''}` : fh(g.reason, '手机状态')}</li>`).join(''));
    part('warns').hidden = !warns.length;
  } });
  const tags = [['battery', '电量', 'battery', [61.5, 43], [76, 42]], ['network', '', 'sim2', [62, 15], [76, 16]], ['storage', '存储剩', 'storage_free', [60, 69], [76, 70]], ['battery', '电池温度', 'battery_temp', [59.5, 68], [48, 85]], ['usage', '解锁', 'unlocks', [55, 42], [46, 27]]];
  function phoneStatusNote(d) {
    const missingNames = d?.partial?.length ? missingReadingNames(d.metrics, d.missing_readings) : {};
    const gray = (d?.groups || []).filter(g => ['gray', 'off'].includes(g.level)).map(g => {
      const name = names[g.key] || g.label || g.name;
      const reason = g.why || U.staleText(g);
      return name && (reason && !sp(d?.why).startsWith(sp(reason))
        ? fh(name, '读数') + '：' + fh(reason, '状态说明') : fh(name, '读数') + (reason ? '读数未刷新' : '读不准'));
    }).filter(Boolean);
    const identified = gray.length > 0 && gray.length === d?.gray_count;
    const note = U.status(identified ? { ...d, gray_count: 0 } : d, { missingNames, showZeroFixing: false }).note;
    const why = d?.why ? fh(d.why, '状态说明') : '';
    return [identified && gray.join(' · '), why && !note.includes(why) && why, note].filter(Boolean).join(' · ');
  }
  function render() {
    hero.classList.toggle('phone-unread', done && phone?.state === 'unknown' && !pcOffline());
    const heading = headText(phone), headingGap = /没有记录|还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|没读全|没记录|暂时读不到/.test(heading);
    U.html(part('head'), U.status(phone).lamp + U.head(headingGap || marked(heading) ? '手机' : heading, { lamp: false }));
    const usage = phone?.blocks?.usage, usageHasCutoff = U.isStale(usage) &&
      (U.isReadingCutoff(usage.stale_text || usage.reason) || Number.isFinite(Date.parse(usage.source_at ?? usage.at)));
    let old = pcOffline() ? phone?.state === 'unknown' ? missing : '' : phone?.state === 'offline' ? [U.staleText({ ...phone, stale: true }, phone.received?.last_at), phone.offline?.cause].filter(Boolean).join(' · ')
      : !idleToday() && !usageHasCutoff ? U.staleText({ ...metric('screen_on'), summary: phone?.why || phone?.groups?.find(g => g.key === 'usage')?.reason }) : '';
    if (old && [phone?.why, ...(phone?.groups || []).filter(g => ['red', 'yellow'].includes(g.level)).map(g => g.reason)].some(text => sp(text).includes(sp(old)))) old = '';
    const usageGap = val('screen_on') == null ? metric('screen_on')?.gap || phone?.blocks?.usage?.reason || phone?.reason : '';
    // 后台给了 presence、两条路的证据都不够（unknown），调试连接也不是确实断了：大字照旧放真采到的读数，
    // “手机连接状态暂时读不到”放在小字最前面，不让上次读数的说明把它挤掉（主持 11-26 01:56 定）
    const unclear = phone?.state !== 'offline' && phone?.presence?.state === 'unknown' && !heading.includes('连接状态');
    const noteText = [phoneStatusNote(phone), unclear && '手机连接状态暂时读不到', U.fieldHtml(old || usageGap || (headingGap ? heading : ''), { name: '手机状态', place: 'body', kind: viewer }), nameMark('手机读数', phone?.metrics?.flatMap(m => [m.label, m.value]))].filter(Boolean).join(' · ');
    const lastOnline = lastOnlineNote(phone, pcOffline());
    const notes = [noteText, esc(lastOnline)].filter(Boolean).join('<br>');
    part('note').hidden = !notes; U.html(part('note'), notes);
    const helpers = phone?.collect?.helpers || [], routeName = !linkOff && ['online', 'partial'].includes(phone?.state) && { lan: '家里 WiFi', tailscale: 'Tailscale', bluetooth: '蓝牙' }[phone?.link?.route];
    const connected = phone?.state === 'online' || phone?.state === 'partial' && !lastOnline;
    // 电脑连接状态跟页顶一致，即使手机读数来自上次。
    U.html(part('devs'), [{ ...phone?.link, name: ({ computer: '电脑', phone: '手机' })[phone?.link?.device || phone?.link?.id || 'computer'] || phone?.link?.label || phone?.link?.name || phone?.link?.title || phone?.link?.text || phone?.link?.device || phone?.link?.id, state: phone?.state, text: linkOff || `${connected ? '连着' : phone?.state === 'offline' ? '连不上' : unread()}${routeName ? ` · 经 ${routeName}` : ''}` },{ name: '个人采集', ...phone?.collect?.collector }, ...helpers.filter(h => ['MacroDroid', 'TailSocks'].includes(h.name))].map(h => `<span class="dev-pill">${U.status(h, { small: true }).lamp}<b>${fh(h.name, '辅助应用', 'label')}</b>${fh(h.text || (h.state === 'online' ? '在跑' : h.state === 'offline' ? '没在跑' : unread()), '设备状态')}</span>`).join(''));
    const s = phone?.apps?.system;
    U.html(part('system'), specHtml(s, phone?.device));   // 规格只摆取到过的项，不写“未读到”（本人 11-24 01:40）
    U.html(part('lines'), tags.map(t => `<line x1="${t[3][0]}" y1="${t[3][1]}" x2="${t[4][0]}" y2="${t[4][1]}"/>`).join(''), false);
    U.html(part('tags'), tags.map(([key, label, id, pt, pos]) => {
      const value = id === 'sim2' ? (sp(val('net_kind')).startsWith('sim') ? netText() : reading('default_data_sim')) : reading(id);
      if (marked(value) || !value && pcOffline()) return '';
      const text = /还在采集|开始记/.test(value) || label && value.startsWith(label) ? value : label + value;
      return `<i class="mach__pt" style="left:${pt[0]}%;top:${pt[1]}%"></i><a class="mach__tag" href="#grp-${key}" data-goto="${key}" style="left:${pos[0]}%;top:${pos[1]}%">${fh(text, label || '手机读数', 'button')}</a>`;
    }).join(''));
    if (done && phone?.state === 'unknown' && !pcOffline()) for (const key of ['devs', 'system', 'tags', 'lines']) U.html(part(key), '');
    const odd = phone?.state === 'online' ? (phone?.odd || []).filter(o => !/解锁/.test(o.text)) : [];
    $('odd').hidden = !odd.length; U.html($('odd'), odd.map(o => `<span class="odd-pill">${fh(compareText(o.text), '手机变化')}${note(o) ? ` · ${note(o)}` : ''}</span>`).join(''));
    refresh(); Light.tone(hero, U.status(phone).tone);
  }
  for (const a of document.querySelectorAll('.stage a[href^="/live/"]')) a.href = route(a.getAttribute('href'));
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  hero.addEventListener('click', e => { const a = e.target.closest('[data-goto]'); if (a) { e.preventDefault(); board.open(a.dataset.goto, true); $(`grp-${a.dataset.goto}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
  const bar = U.topbar({ ask: () => phone ? `帮我看看手机：${headText(phone)}；${line('collect')}；${sp(phone.reason || '')}。请说明现在的情况。` : '' });
  Light.add(hero); const read = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(2), name: '手机' });
  let lit = false;
  function lightUp() { if (!lit) { lit = true; Light.lightUp([hero, ...board.cards()]); } }
  refresh();
  // 带 #grp-… 跳来（首页卡上的行）：落到那一组以后，上面几块还会分几拨读完长高（图、列表），把它顶下去；
  // 落地后 30 秒内上面每长高一次就把它拉回顶上，人自己滚、按键或点了就不再拉（M708）
  let landKey = '', landUntil = 0;
  const pinLanding = () => {
    if (landKey && Date.now() < landUntil) $(`grp-${landKey}`)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    else landKey = '';
  };
  const landOn = key => { landKey = key; landUntil = Date.now() + 30000; requestAnimationFrame(pinLanding); };
  new ResizeObserver(pinLanding).observe($('stage'));
  for (const event of ['wheel', 'touchmove', 'pointerdown', 'keydown']) window.addEventListener(event, () => { landKey = ''; }, { passive: true });
  const groupHash = () => {
    const key = location.hash.slice(5);
    if (!location.hash.startsWith('#grp-') || !Object.hasOwn(names, key)) return;
    board.open(key, true);
    landOn(key);
  };
  groupHash();
  window.addEventListener('hashchange', groupHash);
  // 手机读数（phone）先订，当本页主数据：连不上时页顶写的“下面是几点的数据”、确认关机后重开这页留不留着上次那份，都说手机这一份；
  // 项目文档那份（流量近 30 天用）排到下一拍再订（D6，同 M960 自动任务页的改法）
  queueMicrotask(() => window.Live.watch('projects/phone-collector', null, { data(d, meta) {
    trafficProject = { data: d, viewer: meta.viewer?.kind };
    if (!d?.sections?.some(s => s.metrics?.some(m => m.id === 'traffic_days30' && m.expandable))) { trafficDaysWatch?.stop(); trafficDaysWatch = null; trafficDays = null; }
    if (!trafficDaysWatch && d?.sections?.some(s => s.metrics?.some(m => m.id === 'traffic_days30' && m.expandable))) trafficDaysWatch = window.Live.watch('projects/phone-collector/records', { section: 'traffic_days30' }, { data(rows, meta) { trafficDays = { data: rows, viewer: meta.viewer?.kind }; if (phone) refresh(); } });
    if (phone) refresh();
  } }));
  window.Live.watch('phone', null, { phase(s) { if (s.data == null) read.set(s); },
    data(d, meta) { phone = U.withoutSnapshotCutoff(d, meta.at); viewer = meta.viewer?.kind || 'public'; done = true; render(); read.done(); lightUp(); },
    link(s) {
      bar?.set(s); Light.offline(s.offline);

      const next = s.conn?.stage === 'off' ? '关机了' : s.offline ? '连不上' : '';
      if (linkOff !== next) { linkOff = next; if (phone) render(); }
      if (s.data == null && ['none', 'gone'].includes(s.phase)) {
        done = true; phone = { state: 'unknown' }; render(); read.done(); lightUp();
      }
      U.blockNote(hero.querySelector('.card__body'), s);
    },
  });
  function watchCharts(keys = Object.keys(names)) {
    for (const key of keys) {
    const current = generations[key] = (generations[key] || 0) + 1, span = ranges[key] || '24h';
    watches[key]?.stop();
    const width = () => {
      const card = $(`grp-${key}`), chapter = card?.querySelector('.grp__chapter'), plot = V.chartWidth(chapter);
      if (plot || !chapter) return plot;
      // 雾里还未显示图，先按实际内容宽度扣去双轴给右边刻度留的空间。
      const css = getComputedStyle(chapter), battery = chapter.querySelector('.phone-battery-overlay');
      return chapter.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight) - (battery ? parseFloat(getComputedStyle(battery).paddingRight) : 0);
    };
    watches[key] = V.watchChart('phone/charts', key, span, width, {
      data(d, meta) {
        if (current !== generations[key] || !d) return;
        rangeStatus(key)?.replaceChildren();
        const p = meta.source === 'fixture' && d.ranges ? d.ranges[span] : d;
        shownRanges[key] = span;
        chartDone.add(key); packs.set(key, { ...p, series: (p.series || []).filter(s => s.group === key) });
        board.data({ ...p, series: [...packs.values()].flatMap(p => p.series || []) }); refresh();
        if (phone) Light.tone(hero, U.status(phone).tone);
      },
      phase(s) {
        if (current !== generations[key] || s.data != null) return;
        if (!packs.has(key)) board.groupPhase(key, s);
        if (['none', 'gone', 'paused'].includes(s.phase)) {
          rangeStatus(key)?.replaceChildren();
          shownRanges[key] = span; chartDone.add(key); packs.delete(key);
          board.data({ series: [...packs.values()].flatMap(p => p.series || []) }); refresh();
        }
      },
      link(s) { if (current === generations[key]) { chartStates[key] = s; U.blockNote($(`grp-${key}`), s); } },
    }); }
  }
  watchCharts(); requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

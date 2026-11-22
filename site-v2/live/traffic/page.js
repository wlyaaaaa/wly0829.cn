// 海外流量：两档请求独立；原始字节只由 Live 取，缺测不补零。
(() => {
  'use strict';
  const U = window.LiveUI, Light = window.LiveLight, $ = id => document.getElementById(id), { esc, sp } = U;
  U.date = window.LiveChart.date;
  $('month-total').textContent = `${U.collectionText('本月累计')} · 只算走代理的`;
  const params = new URLSearchParams(location.search), hero = $('hero'), states = new Map();
  const route = href => { const url = new URL(href, location.href); if (params.has('fixture')) url.searchParams.set('fixture', params.get('fixture')); return url.pathname + url.search + url.hash; };
  document.querySelectorAll('.stage a[href^="/live/"]').forEach(a => { a.href = route(a.getAttribute('href')); });
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  Light.add(hero);
  document.querySelectorAll('.l2-board .card').forEach(card => Light.add(card));
  let viewer = 'public', traffic = null, today = null, days = params.get('days') === '7' ? '7' : '1', watch = null, lit = false, trafficReads = [];
  let shownDays = days;
  const homeRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: '海外流量' });
  const bytes = (n, lower = false, unit = 'B') => {
    if (!Number.isFinite(n)) return U.offline?.() ? '' : U.collectionText();
    return `${lower ? '至少 ' : ''}${U.trafficBytes(n, unit)}`;
  };
  const formatBytes = (n, unit) => Number.isFinite(n) ? bytes(n, false, unit) : null;
  const trend = window.LiveChart.create($('traffic-curve'), { size: 'mid', title: '上传与下载', lines: [{ id: 'proxy-upload', label: '上传', hue: 'pink' }, { id: 'proxy-download', label: '下载', hue: 'teal' }], unit: 'B/s', formatValue: formatBytes, bridge: 0, showEdgeDot: true });
  const curveRead = U.reading($('traffic-curve'), { ghost: U.ghost.chart(), slow: false, name: '流量走势' });
  const daily = window.LiveViz.bars($('traffic-days'), { title: '每天上传与下载', series: [{ id: 'upload', label: '上传', hue: 'pink' }, { id: 'download', label: '下载', hue: 'teal' }], unit: 'B', formatValue: formatBytes, stack: false });
  function curveGaps(curve, gaps) {
    const start = Date.parse(curve?.from) / 1000, end = Date.parse(curve?.to) / 1000;
    if (!(start < end) || !Array.isArray(gaps)) return [];
    return gaps.flatMap(gap => {
      const [gapStart, gapEnd, text] = Array.isArray(gap) ? gap : [Date.parse(gap?.from) / 1000, Date.parse(gap?.to) / 1000, gap?.text];
      const from = Math.max(start, gapStart), to = Math.min(end, gapEnd);
      if (!Number.isFinite(gapStart) || !Number.isFinite(gapEnd) || from >= to) return [];
      const reason = typeof text === 'string' ? text.trim() : '';
      return [reason && !['没记录', '没有记录', '未采到海外代理流量记录'].includes(reason) ? [from, to, reason] : [from, to]];
    });
  }
  function renderTrend(d) {
    curveRead.done(!!d);
    const explicit = [d?.curve?.missing_intervals, d?.curve?.gaps].find(Array.isArray);
    const missing = d?.curve ? curveGaps(d.curve, explicit ?? d.gaps) : [];
    if (!d?.series?.some(s => s.points?.some(p => p[1] != null))) trend.wait(U.offline?.() ? '这块没存下来，连上后补上。' : '流量走势暂时读不到');
    else {
      const chart = { from: d.curve?.from, to: d.curve?.to, series: d.series, bucket_seconds: 3600 };
      // 旧包的顶层 gaps 只描述累计窗，曲线仍由实测点决定。
      if (explicit && (!explicit.length || missing.length) && Date.parse(chart.from) < Date.parse(chart.to)) chart.missing_intervals = missing;
      trend.set(chart);
    }
    const gapNote = $('traffic-gap-note');
    const inlineNotes = explicit ? $('traffic-curve').querySelectorAll('.chart__gap-note') : [];
    gapNote.textContent = missing.filter(([, , reason]) => reason).map(([from, to, reason], i) => {
      if (inlineNotes[i] && inlineNotes[i].style.position !== 'absolute') return '';
      const start = new Date(from * 1000).toISOString(), end = new Date(to * 1000).toISOString();
      return `${when(start)}–${when(end)} ${reason}`;
    }).filter(Boolean).join('；');
    gapNote.hidden = !gapNote.textContent;
    if (!d) { daily.set(null); $('days-quality').textContent = ''; $('days-note').hidden = true; return; }
    U.html($('curve-window'), [shownDays === '7' ? '近 7 天 · 小时均值' : '曲线画近 24 小时 · 小时均值，上面的总数从今天 0 点算', U.olderNote?.(d.curve?.at || d.at || d.curve?.to || d.to, d.curve || d)].filter(Boolean).map(esc).join(' · '));
    const keys = ['upload', 'download'], rows = d.days || [], quality = Object.fromEntries(keys.map(key => [key, rows.map(day => dayPartial(day, key, d) ? 'partial' : 'ok')]));
    daily.set(d.days == null ? null : { labels: rows.map(day => ({ text: U.date(day.at || day.date), title: U.date(day.at || day.date) })), values: Object.fromEntries(keys.map(key => [key, rows.map(day => day[key] ?? null)])), quality });
    let column = 0; const lower = rows.flatMap((day, i) => keys.flatMap(key => day[key] > 0 ? (++column, quality[key][i] === 'partial' ? [column] : []) : []));
    // 虚线框的柱子直接在图下说清：那天哪段没测到，实际只多不少（不用切到“近 7 天”看折线下的缺测）
    const gapsOf = day => { const start = Date.parse((day.date || day.at?.slice(0, 10)) + 'T00:00:00+08:00'), end = start + 86400000;
      return [...(d.curve?.gaps || []), ...(d.gaps || [])].map(g => [Math.max(start, Date.parse(g.from)), Math.min(end, Date.parse(g.to))]).filter(([a, b]) => a < b)
        .map(([a, b]) => `${U.time(new Date(a).toISOString())}–${b === end ? '24:00' : U.time(new Date(b).toISOString())}`); };
    const dashed = rows.filter((day, i) => keys.some(key => day[key] > 0 && quality[key][i] === 'partial')).map(day => {
      const spans = [...new Set(gapsOf(day))], why = spans.length ? `${spans.join('、')} 没测到` : sp(day.gap || '') || (U.date(day.at || day.date) === U.date(today?.to || '') ? '今天还没过完、有一段还没测到' : '有一段没测到');
      return `${U.date(day.at || day.date)}（${why}）`; });
    $('days-note').textContent = dashed.length ? `虚线框的柱子是那天没测全，实际只会比画出来的多：${dashed.join('；')}` : '';
    $('days-note').hidden = !dashed.length;
    $('days-quality').textContent = lower.length ? `${lower.map(i => `.page--traffic #traffic-days .vz-bars__body path:nth-child(${i})`).join(',')}{fill-opacity:.4;stroke:var(--ink-soft);stroke-width:1;stroke-dasharray:3 3}` : '';
  }
  const bar = U.topbar({ ask: () => traffic ? `请看实况海外流量：上传 ${bytes(traffic.upload, partial(traffic, 'upload'))}，下载 ${bytes(traffic.download, partial(traffic, 'download'))}。请说明现在的情况。` : '' });
  const partial = (o, key) => o?.lower_bound === true || o?.at_least === true || o?.q === 'partial' && (!o.partial || o.partial.includes(key));
  const when = at => at ? `${U.date(at)} ${U.time(at)}` : (U.offline?.() ? '' : U.collectionText());
  const tightText = text => String(text).replace(/(\d) ([KMGT]?B(?:\/s)?)/g, '$1\u00a0$2').replace(/ · /g, '\u00a0· ');
  const dayLabel = at => at && U.date(at) !== U.date(Date.now()) ? U.date(at) : '今天';
  function dayPartial(day, key, data) {
    if (partial(day, key) || day.partial?.includes(key)) return true;
    if (Array.isArray(day.partial) || day.lower_bound === false || day.at_least === false) return false;
    const start = Date.parse((day.date || day.at?.slice(0, 10)) + 'T00:00:00+08:00');
    if ([...(data.curve?.gaps || []), ...(data.gaps || [])].some(g =>
      Date.parse(g.from) < start + 86400000 && Date.parse(g.to) > start)) return true;
    return !!today?.to && U.date(day.at || day.date) === U.date(today.to) && partial(today, key);
  }
  const span = (from, to) => !from || !to ? U.collectionText("时间") : U.date(from) === U.date(to) ? `${U.time(from)}–${U.time(to)}` : `${when(from)}–${when(to)}`;
  const coverage = d => [d.from && d.to ? `读到 ${span(d.from, d.to)}` : '', d.q === 'partial' && ![d.why, d.month?.gap].filter(Boolean).some(note => sp(note) === sp(d.gap)) ? d.gap : ''].filter(Boolean).join(' · ');
  const programs = window.LiveViz.rank($('program-rank'), { unit: 'GB', mark: true, top: false, empty: '没有程序流量记录' });
  const details = $('program-details'), summary = details.querySelector('summary'), detailRows = $('program-detail-rows');
  function clearPrograms() {
    details.open = false;
    details.hidden = true;
    summary.textContent = '';
    U.html(detailRows, '', false);
    $('program-rank').querySelector('.vz-rank__list').replaceChildren();
  }
  function renderPrograms(d) {
    const table = d?.program_table, source = table?.rows ?? d?.programs ?? [];
    // 和电脑页网络卡同一句人话（M042）：后台原话写的是“独立侧车实测……”
    const separate = U.separateTraffic(table?.separate && { ...table.separate, note: U.separateTrafficNote });
    const separateRow = $('program-separate');
    separateRow.hidden = !separate;
    U.html(separateRow, separate ? `<b>${esc(separate.name)}</b> · ${U.nowrap(separate.summary)}` : '', false);
    if (!source.length && !separate) clearPrograms();
    const label = d?.window?.label || '';
    const week = /近\s*[7七]/.test(label) || !/今天|今日/.test(label) && days === '7';
    const cutoff = [table?.cutoff_at, table?.at, d?.window?.to, d?.to, d?.measurement === 'attributed_proxy_counters' && d.at]
      .find(at => typeof at === 'string' && at.length > 10 && Number.isFinite(Date.parse(at)));
    const period = week ? '近 7 个自然日' : dayLabel(d?.to || cutoff);
    const basis = table?.basis?.replace(/^今日|^今天/, period) || `${period}已记录的海外代理流量`;
    $('program-title').textContent = [basis, '按代理计数归到程序'].join(' · ');
    $('program-window').textContent = cutoff ? `数据截至 ${U.date(cutoff).slice(-5)} ${U.time(cutoff)}` : d ? '没有记录采集时间' : '';
    if (!source.length) programs.wait(d ? '按程序暂时读不到' : '正在读');
    if (!source.length && !separate) return;
    const rows = source.map(p => {
      const total = Number.isFinite(p.upload) && Number.isFinite(p.download) ? p.upload + p.download : null;
      const original = U.fieldText(p.detail?.process_name ?? p.name, viewer).trim();
      const display = typeof p.display_label === 'string' ? p.display_label.trim() : '';
      const name = p.id === 'unknown' || original === '未归到程序' ? '未归到程序' : display || original;
      const upload = bytes(p.upload, partial(p, 'upload')) || '没有记录';
      const download = bytes(p.download, partial(p, 'download')) || '没有记录';
      const text = bytes(total, partial(p, 'upload') || partial(p, 'download')) || '没有记录';
      const proxyClaude = separate && [name, original].some(label => /^Claude(?:\.exe)?$/i.test(label));
      const note = [proxyClaude && '按代理计数', sp(p.gap)].filter(Boolean).join(' · ');
      const sub = tightText([`上传 ${upload}`, `下载 ${download}`, note].filter(Boolean).join(' · '));
      return { key: p.id, name, original, total, value: total == null ? null : total / 2 ** 30, text, sub, upload, download, note };
    }).sort((a, b) => (b.total ?? -1) - (a.total ?? -1));
    if (rows.length) programs.set(rows.slice(0, 5));
    summary.textContent = [rows.length && `查看全部 ${rows.length} 个程序明细${rows.length > 5 ? `（含其余 ${rows.length - 5} 个）` : ''}`, separate && (rows.length ? '另含单独记的 Claude 流量' : '查看单独记的 Claude 流量')].filter(Boolean).join(' · ');
    const displayRows = separate ? [...rows, { ...separate, key: 'claude-sidecar', original: '—', text: separate.total }] : rows;
    const body = displayRows.map(r => `<tr data-key="${esc(r.key)}">${[r.name, r.original, r.upload, r.download, r.text, r.note].map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('');
    U.html(detailRows, `<table><thead><tr><th>软件</th><th>原进程</th><th>上传</th><th>下载</th><th>合计</th><th>说明</th></tr></thead><tbody>${body}</tbody></table>`, false);
    details.hidden = false;
  }
  function link(name, s) {
    const was = !!U.offline?.();
    states.set(name, s); bar?.set(s); Light.offline([...states.values()].some(x => x.offline));
    const offline = [...states].find(([, x]) => x.offline); U.list($('notices'), offline ? [{ key: offline[0], cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${esc(sp(offline[1].text))}</span>` }] : []);
    if (was !== !!U.offline?.()) { renderHead(today); render(traffic); }
  }
  function render(d) {
    const absent = !d; $('traffic-empty').hidden = !absent; $('traffic-empty').innerHTML = `<span class="lamp" aria-hidden="true"></span>${U.offline?.() ? '这块没存下来，连上后补上。' : '海外流量暂时读不到'}`; document.querySelector('.l2-board').hidden = absent; hero.hidden = absent && !today;
    renderPrograms(d);
    renderTrend(d);
    if (absent) { trafficReads.forEach(r => r.done(false)); return; }
    for (const key of ['upload', 'download']) { const node = $(key + '-value'); node.parentElement.hidden = !!U.offline?.() && d[key] == null; U.html(node, `<b>${esc(bytes(d[key], partial(d, key)))}</b>`); }
    U.html($('month-total'), `${d.month?.upload != null && d.month?.download != null ? `<span>本月累计 ${esc(bytes(d.month.upload + d.month.download, partial(d.month, 'upload') || partial(d.month, 'download')))}</span>` : U.offline?.() ? '' : `<span>${esc(U.collectionText('本月累计', d.month))}</span>`}<span>只算走代理的</span>${(partial(d.month, 'upload') || partial(d.month, 'download')) && d.month.gap ? `<small>${esc(d.month.gap)}</small>` : ''}${U.olderNote?.(d.month?.at || d.month?.to, d.month) ? `<small>${esc(U.olderNote(d.month.at || d.month.to, d.month))}</small>` : ''}`);
    U.list($('coverage'), [{ key: 'range', cls: 'row row--flat', html: `<div class="row__text"><p class="row__sub">${esc(coverage(d))}</p></div>` }]);
    if (!lit) { lit = true; Light.lightUp([hero, ...document.querySelectorAll('.l2-board .card'), $('notices')]); }
  }
  function renderHead(d) {
    today = d;
    if (d) hero.hidden = false;
    const total = d?.upload != null && d?.download != null ? d.upload + d.download : null, status = U.status(d);
    const day = dayLabel(d?.window?.to || d?.to || d?.at);
    const cutoff = d?.program_table?.cutoff_at || d?.to || d?.at;
    const title = total == null ? '海外流量' : `${day}${day === '今天' ? '' : ' '}海外流量 ${bytes(total, partial(d, 'upload') || partial(d, 'download'))}`;
    const savedAt = total != null && day !== '今天' && cutoff ? ` · 数据截止 ${when(cutoff)}` : '';
    U.html($('head'), status.lamp + U.head(title + savedAt, { lamp: false }));
    U.html($('traffic-why'), status.note); $('traffic-why').hidden = !status.note;
    Light.tone(hero, status.tone);
    if (d) { homeRead.done(); Light.lightUp([hero]); }
    if (traffic) renderTrend(traffic);
  }
  window.Live.watch('computer/traffic', { days: '1' }, {
    phase(s) { if (s.data == null) { if (s.offline || ['none', 'gone'].includes(s.phase)) { homeRead.done(false); renderHead(null); $('month-total').textContent = ''; } else homeRead.set(s); } },
    data: renderHead,
    link(s) { link('today', s); if (s.phase === 'none') renderHead(null); U.blockNote(hero.querySelector('.card__body'), s); },
  });
  function read() {
    watch?.stop();
    if (!traffic) {
      trafficReads.forEach(r => r.done(false));
      trafficReads = [U.reading($('totals'), { ghost: U.ghost.value(), slow: days === '7', name: '上传与下载' })];
      trafficReads.push(curveRead, U.reading($('program-rank'), { ghost: U.ghost.rows(4), slow: false, name: '按程序' }), U.reading($('coverage'), { ghost: U.ghost.rows(1), slow: false, name: '读数范围' }));
      renderPrograms(null);
    }
    document.querySelectorAll('[data-days]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.days === days)));
    const resource = params.has('fixture') && days === '7' ? 'computer/traffic7' : 'computer/traffic';
    watch = window.Live.watch(resource, { days }, {
      phase(s) { if (s.data == null && !traffic) { if (s.offline || ['none', 'gone'].includes(s.phase)) render(null); else trafficReads.forEach(r => r.set(s)); } },
      data(d, meta) {
        if (viewer !== meta.viewer.kind) { clearPrograms(); viewer = meta.viewer.kind; }
        const shown = traffic != null; traffic = d; shownDays = days;
        if (shown) U.anchor(() => render(d)); else render(d);
        if (d) trafficReads.forEach(r => r.done());
      },
      link(s) {
        if (!s.data && ['none', 'gone', 'paused'].includes(s.phase)) { traffic = null; render(null); }
        link('traffic', s);
        document.querySelectorAll('.l2-col').forEach(el => U.blockNote(el, s));
      },
    });
  }
  document.querySelectorAll('[data-days]').forEach(b => b.addEventListener('click', () => { if (U.offline?.() || b.dataset.days === days) return; days = b.dataset.days; const url = new URL(location.href); url.searchParams.set('days', days); history.replaceState(null, '', url); read(); }));
  U.onBeijingDayChange(() => { if (today) renderHead(today); if (traffic) render(traffic); });
  read(); requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

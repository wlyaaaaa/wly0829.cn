// 体检单：异常在前；曲线、时间带、逐次卡顿和程序对比一张不少。
(() => {
  'use strict';
  const V = window.LiveViz, C = window.LiveChart, U = window.LiveUI, S = window.LiveStat;
  const sync = C.sync(), L = (id, label, hue) => ({ id, label, hue });
  let data = null, summary = null;
  const measured = line => line?.points?.some(([, value]) => Number.isFinite(value));
  function desktopFrame(d) {
    const fps = d?.fps, block = d?.blocks?.fps || fps;
    if (!U.offline?.() && fps?.state === 'ok' && block?.state === 'ok'
        && !block.stale && block.q !== 'stale' && !block.error && !block.read_error) return fps.frame_capture?.detail;
  }
  function appLabel(label) {
    if (typeof label !== 'string') return label;
    const ranked = label.replace(/^\s*\d+\s*[·.)]\s*/, '');
    const icon = ranked.match(/^[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D]+\s+/u)?.[0] || '';
    const name = ranked.slice(icon.length);
    return icon + (U.programName?.(name) ?? name);
  }
  const coveredReadings = new Set(['使用状态采样覆盖', '卡顿采样', '卡顿汇总', '卡顿时间带']);
  const uncovered = (names, summary) => (names || []).filter(name => !summary?.coverage_note || !coveredReadings.has(name));
  function displayData(d) {
    if (!d) return d;
    const gap = [d.summary, d.stutters, d.blocks?.summary, d.blocks?.stutters].map(o => o?.gap).find(g => U.sp(g) && !/^数据截止/.test(U.sp(g)));
    const clean = (o) => o && { ...Object.fromEntries(Object.entries(o).map(([k, v]) => [k, ['gap', 'reason', 'why'].includes(k) && gap && U.sp(v) === U.sp(gap) ? '' : v])),
      ...(d.summary?.coverage_note && o.missing_readings ? { missing_readings: uncovered(o.missing_readings, d.summary) } : {}) };
    const names = uncovered(d.missing_readings?.length ? d.missing_readings : grayNames(d), d.summary);
    const jitter = d.jitter?.series ? { ...d.jitter, series: d.jitter.series.map(line => ({ ...line, unit: 'ms',
      points: line.points.map(([t, v]) => [t, v > 0 ? v : null]) })) } : d.jitter;
    return { ...clean(d), missing_readings: names, ...(names.length ? { partial: d.partial?.length ? d.partial : ['readings'] } : {}),
      jitter, stutterGap: gap, note: [].concat(d.note || []).filter(n => !gap || U.sp(n) !== U.sp(gap)),
      summary: clean(d.summary), stutters: clean(d.stutters), usage: clean(d.usage),
      groups: d.groups?.map(g => clean(g.key === 'fps' && ['画面没变', '桌面实际更新率'].includes(g.reason) ? { ...g, reason: '' } : g)),
      blocks: d.blocks && Object.fromEntries(Object.entries(d.blocks).map(([k, v]) => [k, clean(v)])) };
  }
  const cutoff = (at) => at && Number.isFinite(Date.parse(at)) ? [U.date(at), U.time(at)].filter(Boolean).join(' ') : '';
  const bounds = (row) => [Date.parse(row?.from) / 1000, Date.parse(row?.to) / 1000];
  const windowText = (row) => cutoff(row?.from) && cutoff(row?.to) ? `北京时间 ${cutoff(row.from)} 至 ${cutoff(row.to)}` : '';
  const summaryEnd = (d) => d?.summary?.window?.to || d?.blocks?.summary?.window?.to || d?.summary?.at || d?.blocks?.summary?.at;
  const stutterNames = { summary: '卡顿汇总', stutters: '卡顿时间带' };
  const grayNames = (d) => [...new Set((d?.groups || []).filter(g => ['gray', 'off', 'none'].includes(g.level)).map(g => stutterNames[g.key]).filter(Boolean))];
  function timelinePack(pack, key) {
    if (!pack?.states) return pack;
    const fallback = pack.states.some(s => typeof s.hue !== 'string' || !s.hue) || new Set(pack.states.map(s => s.hue)).size <= 1 && (pack.states.length > 1 || key === 'foreground');
    const warm = '#d39835', orange = '#d57c38', slate = '#8795a4', palette = ['teal', 'blue', 'violet', 'pink', orange, warm, slate];
    return { ...pack, states: pack.states.map((s, i) => {
      const sourceLabel = key === 'foreground' ? appLabel(s.display_label ?? s.label) : s.display_label ?? s.label;
      const text = `${s.id} ${U.sp(sourceLabel)}`, micro = s.id === 'micro_stutter', severe = s.id === 'severe_stutter', graded = micro || severe || s.id === 'stutter' && typeof s.label === 'string';
      const min = s.min_ms ?? (micro ? 50 : severe || /严重|100\s*(?:ms|毫秒)/i.test(text) ? 100 : 50), max = Object.hasOwn(s, 'max_ms') ? s.max_ms : micro ? 100 : null;
      const label = graded ? `${micro ? '微卡顿' : severe || min >= 100 ? '严重卡顿' : '卡顿'}（${max == null ? `${min} 毫秒以上` : `${min} 至不足 ${max} 毫秒`}）` : typeof sourceLabel === 'string' ? U.sp(sourceLabel).replace(/^\s*(?:\d+\s*[·.)]\s*)?[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, '') : sourceLabel;
      let hue = ({ amber: warm, orange, slate })[s.hue] || s.hue;
      if (fallback) {
        if (key === 'foreground') {
          const name = U.sp(typeof sourceLabel === 'string' ? sourceLabel : s.id).replace(/^[\d\s·]+|[^\p{L}\p{N}._ -]/gu, '').trim().toLowerCase();
          hue = palette[[...name].reduce((n, c) => (n * 31 + c.codePointAt(0)) >>> 0, 0) % palette.length];
        } else hue = s.id === 'stutter' ? (min >= 100 ? 'pink' : warm) : /severe|严重|gpu|显卡.*(?:受限|瓶颈)/i.test(text) ? 'pink' : /cpu.*(?:受限|瓶颈)|^cpu /i.test(text) ? orange : /micro|微卡顿|away|idle|静止|暂离/i.test(text) ? warm : /sleep|睡眠|睡着/i.test(text) ? 'blue' : /display|screen.off|屏幕关/i.test(text) ? 'violet' : /off|关机|none|缺测/i.test(text) ? slate : /active|clear|normal|light|正常|轻载|流畅|在用/i.test(text) ? 'teal' : palette[i % palette.length];
      }
      return { ...s, label, hue, ...(graded ? { min_ms: min, max_ms: max } : {}) };
    }) };
  }
  const board = V.board(document.getElementById('board'), { key: 'smooth', sync, onCount(c) {
    LiveDetail.count(c);
    const hero = document.getElementById('hero');
    const count = hero.querySelector('[data-part="count"]'), n = data?.attention_count ?? data?.attention_groups;
    count.hidden = n == null;
    if (n != null) U.html(count, `<b>${U.esc(n)} 项要处理</b>`);
    window.LiveLight.tone(hero, data);
    const end = cutoff(summaryEnd(data));
    const observed = S.partial(data?.summary, 'events') || /卡顿次数和时长只算有记录的部分/.test(U.sp(data?.stutterGap));
    const headline = data?.summary?.events == null ? (U.offline?.() ? '卡顿与流畅' : U.collectionText('近 24 小时卡顿次数', data?.summary || data)) : `${observed ? '有记录的时段' : '近 24 小时'}卡了 ${data.summary.events} 次`;
    U.html(hero.querySelector('[data-part="head"]'), U.status(data).lamp + U.head(headline + (end && data?.summary?.events != null ? ` · 数据截止 ${end}` : ''), { lamp: false }));
  } });
  const num = (v, unit) => v == null ? (U.offline?.() ? '—' : U.collectionText()) : V.fmt(v, unit);
  const metric = (r, key, label, unit) => `${label} ${S.text(r, key, (v) => num(v, unit))}`.replaceAll(' ', '\u00a0');
  const metricLine = parts => parts.filter(Boolean).join('\u00a0· ');
  function info(r, showPct) {
    const frames = ['fps', 'low'].every(k => r[k] == null) || r.fps_samples === 0 ? ['无有效帧样本'] :
      [metric(r, 'fps', '平均帧率', 'FPS'), metric(r, 'low', '低谷帧率', 'FPS'),
        r.fps_samples == null && (r.fps === 0 || r.low === 0) ? '采样值 0／有效样本数未给' : ''];
    return metricLine([...frames, showPct && metric(r, 'stutter_pct', '卡顿帧占比', '%'), r.stutter_events != null && metric(r, 'stutter_events', '卡顿', '次')]);
  }
  function events() {
    const st = data?.stutters, day = st?.rows?.day;
    if (!day?.spans) return null;
    const [from, to] = bounds(day);
    return day.spans.flatMap(([t, state], i) => {
      const level = st.states?.[state];
      if (!['stutter', 'micro_stutter', 'severe_stutter'].includes(level?.id)) return [];
      const start = Math.max(t, from);
      const end = Math.min(day.spans[i + 1]?.[0] ?? to, to);
      return end > start ? [{ start, end, micro: level.id === 'micro_stutter', id: level.id }] : [];
    }).sort((a, b) => b.start - a.start);
  }
  function mergedEvents() {
    // 新包的事件边界直接取后端，原分级片段只负责说明一次事件内的等级。
    const st = data?.stutters, row = st?.rows?.day, fragments = events() || [];
    if (!st) return null;
    const byStart = new Map(fragments.map(f => [f.start, f]));
    const list = Array.isArray(st.events) ? st.events.filter(e => Number.isFinite(e.start) && Number.isFinite(e.end) && e.end > e.start)
      .map(e => ({ ...e, ids: new Set((e.fragment_starts || []).map(t => byStart.get(t)?.id).filter(Boolean)) })) : [];
    if (!Object.hasOwn(st, 'events')) {
      for (const { start, end, id } of fragments.reverse()) {
        const last = list.at(-1);
        if (last && start <= last.end) { last.end = Math.max(last.end, end); last.ids.add(id); }
        else list.push({ start, end, ids: new Set([id]) });
      }
      const sameEnd = Date.parse(row?.to) === Date.parse(summaryEnd(data));
      const clear = coveredSeconds(st, s => s.id === 'clear') > 0;
      const zero = sameEnd && data?.summary?.events === 0 && !S.partial(data.summary, 'events');
      if (!list.length && !(clear && !(sameEnd && data?.summary?.events > 0) || zero && row?.spans?.length)) return null;
    } else if (!Array.isArray(st.events)) return null;
    return list.sort((a, b) => b.start - a.start);
  }
  function coveredSeconds(pack, include) {
    const row = pack?.rows?.day, [from, to] = bounds(row);
    return (row?.spans || []).reduce((seconds, [at, state], i) => {
      const s = pack.states?.[state], end = Math.min(row.spans[i + 1]?.[0] ?? to, to);
      return seconds + (s && include(s) ? Math.max(0, end - Math.max(from, at)) : 0);
    }, 0);
  }
  // 带子左边写这条带是什么（卡顿、使用状态……），时段看下面的刻度和说明。
  function timeline(el, label, key, row = '近 24 小时') {
    if (label) { const p = document.createElement('p'); p.className = 'grp-split__k'; p.textContent = label; el.append(p); }
    const host = document.createElement('div'); el.append(host);
    const block = V.block(host, V.timeline(host, { rows: [{ key: 'day', label: row }], interactiveObservedOnly: key === 'stutters' }), () => data, key);
    // 后台给的行名一律是“近 24 小时”，会盖掉上面这个名字，所以这里换成这条带自己的名字。
    const named = p => p?.rows?.day ? { ...p, rows: { ...p.rows, day: { ...p.rows.day, label: row } } } : p;
    return { host, set: (pack) => block.set(named(timelinePack(pack, key))) };
  }
  function caption(el) {
    const p = document.createElement('small'); p.className = 'stat-gap'; el.append(p);
    return (...parts) => { p.textContent = parts.filter(Boolean).join(' · '); p.hidden = !p.textContent; };
  }
  function stutterChapter(el) {
    el.innerHTML = '<div class="stutter-layout"><div data-x="moments"></div><div data-x="timeline"></div><div data-x="daily"></div><small class="stat-gap" data-x="gap"></small></div>';
    const listHost = el.querySelector('[data-x="moments"]');
    let list = null, picked = null;
    const seconds = (e) => `${Number((e.end - e.start).toFixed(3)) || '不到 0.001'} 秒`;
    const moreText = n => listHost.querySelector('button.more').getAttribute('aria-expanded') === 'true' ? '收起明细' : `还有 ${n} 次（共 ${list.length} 次）`;
    const moments = V.moments(listHost, { show: 5, empty: '近 24 小时没有卡顿', more: moreText, onPick(key) {
      picked = list?.find(e => String(e.start) === key) || null;
      sync.mark(picked?.start ?? null, picked ? `卡了 ${seconds(picked)}` : '');
      mark();
    } });
    listHost.querySelector('button.more').addEventListener('click', e => { e.currentTarget.firstChild.nodeValue = moreText(list.length - 5) + ' '; });
    const tl = timeline(el.querySelector('[data-x="timeline"]'), '卡顿发生在哪一段', 'stutters', '卡顿');
    const marker = document.createElement('i'); marker.className = 'vz-tl__cursor'; marker.style.width = '2px'; marker.hidden = true;
    tl.host.querySelector('.vz-tl__plot').append(marker);
    function mark() {
      const [from, to] = bounds(data?.stutters?.rows?.day);
      const start = picked?.start;
      marker.hidden = !(start >= from && start < to);
      if (!marker.hidden) marker.style.left = `${(start - from) / (to - from) * 100}%`;
    }
    const host = el.querySelector('[data-x="daily"]');
    const daily = V.block(host, V.bars(host, { title: '近 7 天每天卡了几次', unit: '次', stack: true, series: [{ id: 'events', label: '卡顿', hue: 'pink' }] }), () => data, 'daily_stutters');
    let days = [];
    new MutationObserver(() => {
      const value = host.querySelector('.chart__vals b');
      if (!value) return;
      const selected = [...host.querySelectorAll('.vz-bars__lab')].findIndex((label) => label.classList.contains('is-on'));
      const row = days[selected < 0 ? days.length - 1 : selected];
      const text = row?.events == null && row?.gap && !U.offline?.()
        ? U.sp(row.gap) : S.text(row, 'events', (count) => `${count} 次`);
      if (value.textContent !== text) value.textContent = text;
      let gap = host.querySelector('[data-stat-gap]');
      const message = S.partial(row, 'events') && row?.events != null ? row.gap || '' : '';
      if (message && !gap) {
        gap = document.createElement('small');
        gap.dataset.statGap = '';
        gap.className = 'stat-gap';
        host.querySelector('.chart__vals').append(gap);
      }
      if (gap) U.html(gap, U.fieldHtml(message, { name: '当天卡顿统计' }), false);
      if (!message) gap?.remove();
    }).observe(host, { childList: true, characterData: true, subtree: true });
    return { set(g) {
      const st = data?.stutters, meta = data?.blocks?.stutters;
      list = mergedEvents();
      const levels = new Map(timelinePack(st, 'stutters')?.states?.map(s => [s.id, U.sp(s.label).split('（')[0]]));
      moments.set(list?.map(e => {
        const at = new Date(e.start * 1000).toISOString(), names = [...e.ids].map(id => levels.get(id)).filter(Boolean);
        const grade = names.includes('严重卡顿') ? '严重卡顿' : e.ids.size === 1 && e.ids.has('micro_stutter') ? '微卡顿' : '卡顿';
        return { key: String(e.start), day: U.date(at), time: U.time(at), title: `${grade} ${seconds(e)}`, text: names.length > 1 ? `含${names.join('、')}` : '', hue: grade === '微卡顿' ? '#d39835' : 'pink' };
      }) ?? null);
      if (!list && (st || meta?.state === 'unavailable')) moments.wait('这次没读到卡顿明细');
      // 没卡顿时左栏写一句正常颜色的“近 24 小时没有卡顿”，卡头那颗孤零零的空心灯不画。
      el.closest('.grp')?.toggleAttribute('data-no-stutter', Array.isArray(list) && !list.length);
      if (picked && !list?.some(e => e.start === picked.start)) { picked = null; sync.mark(null, ''); }
      const end = cutoff(st?.rows?.day?.to || st?.window?.to);
      const missing = g?.missing_readings?.length && !['gray', 'off'].includes(g.level) ? `缺：${g.missing_readings.join('、')}` : '';
      const parts = [missing, !data?.summary?.coverage_note && data?.stutterGap, list && end && `明细截止 ${end}`, list && (st.count_label || '相接的卡顿片段合成一次')];
      U.html(el.querySelector('[data-x="gap"]'), parts.filter(Boolean).map(p => U.fieldHtml(p, { name: '卡顿采集说明' })).join(' · '));
      tl.set(list?.length || coveredSeconds(st, () => true) > 0 ? st : null); mark();
      days = data?.daily_stutters?.slice(-7) || [];
      daily.set(data?.daily_stutters ? { labels: days.map((d) => ({ text: d.day.slice(5), title: d.day })), values: { events: days.map((d) => d.events) } } : null);
    } };
  }
  function foregroundChapter(el) {
    const fpsNote = document.createElement('p');
    fpsNote.className = 'row__sub smooth-fps-empty';
    fpsNote.textContent = '此时段没有帧率读数';
    fpsNote.hidden = true;
    el.append(fpsNote);
    const tl = timeline(el, '前台程序同步带', 'foreground', '前台程序');
    const say = caption(el);
    return { set() {
      const pack = data?.foreground, row = pack?.rows?.day;
      const covered = coveredSeconds(pack, s => !unrecorded(s));
      const noCurves = !!data && ![data.fps, data.frametime, data.jitter].some(p => p?.series?.some(measured));
      fpsNote.hidden = !noCurves || desktopFrame(data) === 'desktop_duplication_still';
      el.closest('.grp').classList.toggle('fps-no-curves', noCurves);
      const names = timelinePack(pack, 'foreground')?.states?.filter(s => !unrecorded(s)).map(s => U.fieldText(s.label)).filter(Boolean);
      const seconds = Math.round(covered), h = Math.floor(seconds / 3600), m = Math.floor(seconds / 60) % 60, s = seconds % 60;
      const total = [h && `${h} 小时`, m && `${m} 分钟`, (s || !seconds) && `${s} 秒`].filter(Boolean).join(' ');
      say(windowText(pack?.window) || windowText(row), covered > 0 && `前台共 ${total}`,
        names?.length && `显示 ${new Set(names).size} 个程序（最多 15 个）`, names?.length && '各项单独四舍五入到分钟，离开电脑的时间不计');
      tl.set(pack ?? null);
    } };
  }
  function appsChapter(el) {
    el.innerHTML = '<div class="grp-split"><div><p class="grp-split__k">各程序的流畅度 · 按前台时长排</p><div data-x="apps"></div></div><div><p class="grp-split__k">全屏和窗口的差别</p><div data-x="modes"></div></div></div>';
    const appHost = el.querySelector('[data-x="apps"]'), modeHost = el.querySelector('[data-x="modes"]'), split = appHost.closest('.grp-split');
    const apps = V.block(appHost, V.rank(appHost, { show: Infinity, mark: true, more: (n) => `展开（还有 ${n} 条）` }), () => data, 'apps');
    const modes = V.block(modeHost, V.rank(modeHost, { show: Infinity, mark: true }), () => data, 'modes');
    const appNote = caption(appHost.parentElement), modeNote = caption(modeHost.parentElement);
    el.querySelectorAll('.vz-rank').forEach((host) => host.classList.add('vz-rank--detail'));
    return { set() {
      const a = data?.apps, m = data?.modes, meta = data?.blocks?.apps, attribution = data?.stutters?.attribution;
      split.classList.toggle('is-unbalanced', (a?.length || 0) > Math.max(6, (m?.length || 0) * 3));
      const appPct = a?.some(r => r.stutter_pct != null), modePct = m?.some(r => r.stutter_pct != null), severePct = m?.some(r => r.severe_pct != null);
      appNote(a?.length && (windowText(meta?.window) || (cutoff(meta?.at) && `排行截止 ${cutoff(meta.at)}`)),
        a?.length && (meta?.basis || '按有硬件帧采样的 30 秒段估算'), a?.length && data?.labels?.fps_table_low && U.sp(data.labels.fps_table_low).replace(/^有效 30 秒平均帧率的第 10 百分位$/, '低谷帧率：每 30 秒算一次平均帧率，取最差的那一成'),
        a?.length && !appPct && '卡顿帧占比没有记录', attribution?.unassigned_events > 0 && `${attribution.unassigned_events} 次无法归到单一程序`,
        attribution?.other_program_events > 0 && `${attribution.other_program_events} 次发生在未上榜程序`);
      modeNote(m?.length && !modePct && '卡顿帧占比没有记录');
      apps.set(a?.map((r, i) => {
        const label = appLabel(r.display_label ?? r.app);
        const icon = typeof label === 'string' && /^([\p{Extended_Pictographic}\p{Regional_Indicator}]\uFE0F?)\s+/u.exec(label);
        const name = icon ? label.slice(icon[0].length) : label;
        return S.row({ key: `app:${i}`, name, mark: icon?.[1], sub: info(r, appPct), value: r.seconds, text: num(r.seconds, '秒'), hue: V.categoryHues[r.category] }, r, 'seconds');
      }) ?? null);
      modes.set(m?.map((r, i) => S.row({ key: `mode:${i}`, name: r.mode, sub: metricLine([info(r, modePct), severePct && metric(r, 'severe_pct', '严重卡顿帧占比', '%')]), value: r.seconds, text: num(r.seconds, '秒'), hue: 'violet' }, r, 'seconds')) ?? null);
    } };
  }
  function resourceChapter(el) {
    const tl = timeline(el, '整机 CPU 和显卡使用情况', 'bottleneck', 'CPU 和显卡'), say = caption(el);
    return { set() {
      const pack = data?.bottleneck;
      const plain = text => U.sp(text).replace(/前台进程/g, '前台程序').replace(/整机逻辑处理器时间/g, '整台电脑 CPU 时间').replace(/，?按分段取均值/g, '（每段取平均）');
      say(data?.resource && `上图是${plain(data.resource.cpu_basis?.label || '前台进程占用')}`,
        pack && `下方“CPU 很忙”指${plain(pack.cpu_basis?.label || '同一采样桶内整机 CPU ≥80% 且 GPU <80%')}`);
      tl.set(pack ? { ...pack, states: pack.states?.map(s => typeof s.label === 'string' ? { ...s, label: s.label.replace(/CPU\s*忙碌瓶颈\s*\(>=\s*80%\)/, 'CPU 很忙（≥80%）') } : s) } : null);
    } };
  }
  const unrecorded = s => /^(?:unrecorded|missing|none|unknown)$/.test(s.id) || /^(?:未记录|未采样|状态未识别|缺测|没有记录|没有前台采样|当前窗口无可用前台样本)/.test(U.sp(s.label));
  function usageChapter(el) {
    const tl = timeline(el, '', 'usage', '使用状态'), say = caption(el);
    return { set() {
      const pack = data?.usage, row = pack?.rows?.day, [from, to] = bounds(row);
      const explicit = coveredSeconds(pack, unrecorded), known = coveredSeconds(pack, s => !unrecorded(s));
      const missing = Math.max(0, to - from - known - explicit);
      const totals = pack?.breakdown?.filter(s => Number.isFinite(s.seconds));
      if (totals?.length) say(windowText(pack.window) || windowText(row), ...totals.map(s => `${U.sp(s.label)} ${s.seconds < 60 ? `${Math.round(s.seconds)} 秒` : V.dur(s.seconds)}`));
      else say(known > 0 && windowText(row), known > 0 && missing > 0 && `${explicit > 0 ? '另有' : ''}未记录 ${missing < 60 ? '不足 1' : Math.round(missing / 60)} 分钟`);
      tl.set(known > 0 ? pack : null);
    } };
  }
  // 卡顿明细的卡头（M616）：“最近一次记录于”写最后一笔合格帧（recorded_at），截止时刻由页头和汇总自己的 window.to 写；
  // 缺帧是部分记录，照各块给的缺项写缺了什么、为什么，只有 read_error 才写读取失败。
  // 旧包这一组没有 recorded_at、缺项只有通用的 read_failed：时刻改用汇总的 recorded_at（也没有就不写时刻），缺项换成各块的真实缺项。
  const lastStamp = t => [U.date(t) === U.date(Date.now()) ? '' : U.date(t), U.time(t)].filter(Boolean).join(' ');
  function stutterGiven(given) {
    if (!given || given.gray_reason !== 'partial') return given;
    const blocks = [data?.blocks?.stutters, data?.blocks?.summary, data?.stutters, data?.summary];
    if (Object.hasOwn(given, 'read_error') ? given.read_error === true : blocks.some(b => b?.read_error === true || b?.error)) return given;
    const named = m => m && typeof m === 'object' ? Object.fromEntries(Object.entries(m).filter(([k]) => /[\u3400-\u9fff]/.test(k))) : {};
    const real = Object.assign({}, ...blocks.map(b => named(b?.missing)), named(given.missing));
    const keys = Object.keys(real), out = { ...given, partial: keys, missing: real };
    if (!Object.hasOwn(given, 'recorded_at') && typeof given.why === 'string') {
      const recorded = blocks.map(b => b?.recorded_at).find(t => t && Number.isFinite(Date.parse(t)));
      out.why = given.why.replace(/[，,]?\s*最近一次记录于 (?:\d{2}-\d{2} )?\d{2}:\d{2}/, recorded ? `，最近一次记录于 ${lastStamp(recorded)}` : '');
    }
    return out;
  }
  function groups() {
    const s = data?.summary, app = data?.apps?.[0], appName = appLabel(app?.display_label ?? app?.app);
    const usage = data?.usage, active = coveredSeconds(usage, s => s.id === 'active' || /^(?:在用|正常使用|正常工作)$/.test(U.sp(s.label)));
    const desktop = desktopFrame(data), desktopRate = desktop === 'desktop_duplication_frame';
    const desktopStill = desktop === 'desktop_duplication_still';
    const fpsCutoff = (desktopRate || desktopStill && data.fps.series?.some(measured)) && cutoff(data.fps.at);
    const fpsLine = desktopRate ? '桌面实测帧率' : desktopStill ? '本次采集正常，画面没变' : '';
    const fpsTime = fpsCutoff && `${desktopStill ? '历史帧率截至' : '截至'} ${fpsCutoff}`;
    const out = [
      { key: 'stutters', name: '卡顿明细', palette: ['pink', 'violet'], pic: '/live/img/head-smooth.webp',
        line: '',
        figures: [{ key: 'active', label: '在用电脑', value: s?.active, unit: '秒' }, { key: 'clear', label: '流畅时段', value: s?.clear, unit: '秒' }, { key: 'stutter', label: '卡顿时长', value: s?.stutter, unit: '秒' }, { key: 'events', label: '近 24 小时卡顿', value: s?.events, unit: '次' }].map((f) => S.figure(f, s, f.key)), build: stutterChapter },
      { key: 'fps', name: '帧率与手感', palette: ['teal', 'blue', 'pink'],
        line: [fpsLine, fpsTime].filter(Boolean).join(' · '), sourceNotes: !(desktopRate || desktopStill),
        figures: [{ key: 'now', label: '帧率', line: 'current', hue: 'teal' }, { key: 'avg', label: '时点平均帧率', line: 'average', hue: 'apricot' }, { key: 'low', label: '最低 1%', line: 'low', hue: 'pink' }],
        say: (c, sums) => c.key === 'fps' && sums[0]?.max != null ? `最高 ${num(sums[0].max, 'FPS')}${sums[0].maxAt == null ? '' : `（北京时间 ${cutoff(new Date(sums[0].maxAt * 1000).toISOString())}）`}，记录中的平均帧率 ${num(sums[0].avg, 'FPS')}` : '',
        chips: [{ key: 'fps', label: '帧率', lines: [L('current', '帧率', 'teal')], unit: 'FPS' }, { key: 'average', label: '时点平均帧率', lines: [L('average', '时点平均帧率', 'apricot')], unit: 'FPS' }, { key: 'low', label: '最低 1%', lines: [L('low', '最低 1%', 'pink')], unit: 'FPS' }, { key: 'frametime', label: '单帧耗时', lines: [L('frametime', '单帧耗时', 'blue')], unit: 'ms' }, { key: 'jitter', label: '帧时抖动', lines: [L('jitter', '帧时抖动', 'violet')], unit: 'ms' }], build: foregroundChapter },
      { key: 'apps', name: '各程序与窗口形态', palette: ['blue', 'violet'], line: typeof appName === 'string' ? `前台最久的是 ${U.sp(appName)}` : appName,
        figures: [{ key: 'apps', label: '程序', value: data?.apps?.length, unit: '个' }, { key: 'modes', label: '窗口形态', value: data?.modes?.length, unit: '种' }, S.figure({ key: 'fps', label: '最久程序平均帧率', value: app?.fps_samples === 0 ? null : app?.fps, unit: 'FPS' }, app, 'fps')], build: appsChapter },
      { key: 'resource', name: '资源与瓶颈', palette: ['violet', 'blue'], line: '对着卡顿时刻看前台资源和受限原因',
        figures: [{ key: 'cpu', label: '前台 CPU', line: 'cpu', hue: 'violet' }, { key: 'gpu', label: '前台显卡', line: 'gpu', hue: 'blue' }, { key: 'ram', label: '前台内存', line: 'ram', hue: 'teal' }, { key: 'vram', label: '前台显存', line: 'vram', hue: 'apricot' }],
        chips: [{ key: 'resource', label: '前台 CPU 和显卡', lines: [L('cpu', '前台 CPU', 'violet'), L('gpu', '前台显卡', 'blue')], unit: '%', ceil: 100 }, { key: 'memory', label: '前台内存和显存', lines: [L('ram', '前台内存', 'teal'), L('vram', '前台显存', 'apricot')], unit: 'GB' }], build: resourceChapter },
      { key: 'usage', name: '使用状态', palette: ['apricot', 'blue'], line: '睡眠、暂离和在用的时段', figures: [{ key: 'active', label: '在用电脑', value: coveredSeconds(usage, s => !unrecorded(s)) > 0 ? active : null, unit: '秒' }], build: usageChapter },
    ];
    const known = { stutters: s ?? data?.stutters, fps: data?.fps, apps: data?.apps, resource: data?.resource, usage: data?.usage };
    const pictures = { stutters: '/live/img/head-smooth.webp', fps: '/live/img/grp-machine.webp', apps: '/live/img/head-apps.webp', resource: '/live/img/grp-cpu.webp', usage: '/live/img/use-day.webp' };   // 图址写全，构建才认得出、换成云端地址
    const curves = [...data?.fps?.series || [], ...data?.frametime?.series || [], ...data?.jitter?.series || []];
    const hasCurve = id => measured(curves.find(line => line.id === id));
    const knownGroups = out.map((g) => {
      const found = data?.groups?.find(x => (x.key ?? x.id) === g.key), given = g.key === 'stutters' ? stutterGiven(found) : found;
      const givenNames = g.key === 'stutters' ? [...new Set([...(s?.missing_readings || []), ...(data?.blocks?.summary?.missing_readings || []), ...(data?.blocks?.stutters?.missing_readings || [])])] : data?.blocks?.[g.key]?.missing_readings;
      const names = uncovered(givenNames?.length || g.key !== 'stutters' ? givenNames : grayNames(data), s);
      const frames = g.key === 'fps' && !!data;
      return { ...given, ...g, ...(names?.length ? { missing_readings: names, partial: names } : {}),
        ...(frames ? { chips: g.chips.filter((c, i) => !i || c.lines.some(l => hasCurve(l.id))) } : {}),
        figures: frames ? g.figures.filter(f => hasCurve(f.line)) : known[g.key] == null ? [] : g.figures,
        line: data ? g.line : '', pic: pictures[g.key], reason: given?.reason, grafana: data?.grafana?.href };
    });
    return window.LiveAdaptive?.groups(data, knownGroups, ['frametime', 'jitter', 'memory', 'foreground', 'bottleneck', 'summary', 'daily_stutters', 'modes']) || knownGroups;
  }
  function tidyStutterHeading() {
    const line = document.querySelector('.grp[data-key="stutters"] .grp__line');
    if (!line) return;
    const status = line.querySelector('.grp__status');
    const recent = /最近一次记录于 (?:\d{2}-\d{2} )?\d{2}:\d{2}/;
    const reported = status.textContent.match(recent)?.[0];
    for (const block of status.querySelectorAll('[data-block="stutters"]')) {
      const note = block.textContent.replace(/^卡顿\s*·\s*/, '');
      if (/^(?:这次没读到，)?最近一次记录于 (?:\d{2}-\d{2} )?\d{2}:\d{2}$/.test(note) && U.sameCutoffNote(reported, note)) {
        const separator = block.previousSibling;
        if (separator?.nodeType === Node.TEXT_NODE) separator.textContent = separator.textContent.replace(/\s*·\s*$/, '');
        block.remove();
      }
    }
    // 卡头已写“数据截止 HH:MM”时，摘要、卡顿两块各自的“截至 MM-DD HH:MM”是同一时刻，不再说第二遍（M677）
    const day = t => t.includes(' ') ? t : `${U.date(Date.now())} ${t}`;
    const said = status.textContent.match(/数据截[止至] ((?:\d{2}-\d{2} )?\d{2}:\d{2})/)?.[1];
    for (const block of status.querySelectorAll('[data-block]')) {
      const at = block.textContent.match(/·\s*截[止至] ((?:\d{2}-\d{2} )?\d{2}:\d{2})$/)?.[1];
      if (!said || !at || day(said) !== day(at)) continue;
      const separator = block.previousSibling;
      if (separator?.nodeType === Node.TEXT_NODE) separator.textContent = separator.textContent.replace(/\s*·\s*$/, '');
      block.remove();
    }
    const time = line.querySelector('.grp__cutoff'), top = document.querySelector('#hero .head__cutoff')?.textContent;
    if (/^数据截止 (?:\d{2}-\d{2} )?\d{2}:\d{2}$/.test(time.textContent) &&
        [reported, top].some(note => U.sameCutoffNote(note, time.textContent))) time.textContent = '';
    V.cardLineTitle(line);
  }
  const detailBoard = { ...board, blocks(d, map, off) {
    summary = d?.summary;
    board.blocks(displayData(d), { ...map, fps: d?.fps?.series?.some(measured) ? ['fps'] : [], usage: ['usage'] }, off);
  } };
  LiveDetail.mount({ resource: 'computer/smooth', board: detailBoard, merge: () => LiveDetail.merge(data, ['fps', 'frametime', 'jitter', 'resource', 'memory']),
    statusData: d => d?.summary?.coverage_note ? { ...d, partial: uncovered(d.missing_readings, d.summary), gray_count: null } : d, render(d) {
    data = d = displayData(d && !d.summary && summary?.events != null ? { ...d, summary } : d); const list = groups(); board.set(list); window.LiveAdaptive?.tail(document.getElementById('board'), list);
    const notes = [...new Set([].concat(d?.note || []).filter(Boolean))].filter(s => !d?.groups?.some(g => ['red', 'yellow'].includes(g.level) && g.reason === s)), note = document.getElementById('hero').querySelector('[data-part="note"]');
    if (d?.summary?.coverage_note) notes.push(d.summary.coverage_note);
    if (d?.missing_readings?.length && U.status(d).tone !== 'gray') notes.push(`缺：${d.missing_readings.join('、')}`);
    note.hidden = !notes.length; U.html(note, LiveDetail.noteHtml(notes));
    if (d?.missing_readings?.length) queueMicrotask(() => {
      const status = note.querySelector('[data-why]');
      if (status) U.html(status, U.status(d, { missingNames: { readings: d.missing_readings.join('、') } }).note);
    });
    S.finish(d, { stutters: ['summary', 'stutters', 'daily_stutters'], apps: ['apps', 'modes'], resource: ['resource', 'memory', 'bottleneck'] });
    queueMicrotask(tidyStutterHeading);
  } });
})();

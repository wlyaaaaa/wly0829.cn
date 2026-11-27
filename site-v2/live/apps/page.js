(() => {
  'use strict';
  const V = window.LiveViz, C = window.LiveChart, D = window.LiveDetail, S = window.LiveStat, sync = C.sync();
  const off = () => !!window.LiveUI.offline?.();
  const phrase = (value, format) => value && typeof value === 'object' ? value : format(value);
  // 程序名用电脑页已在用的叫法（Python、Google Chrome 这类），原始进程名不直接上页。
  const pname = value => window.LiveUI.programName?.(value) ?? value;
  const lineLabel = label => typeof label === 'string' ? label.replace(/^(均值|峰值)\s*·\s*(.+)$/, (_, kind, name) => `${kind} · ${pname(name)}`) : label;
  const hues = ['teal', 'violet', 'pink', 'blue'], fmt = (v, u) => C.value(v, u) ?? (off() ? '' : window.LiveUI.collectionText());
  const read = (r, key, unit) => S.text(r, key, (v) => fmt(v, unit));
  const seriesText = (s, unit) => { const value = s?.points?.at(-1)?.[1]; return value == null ? (off() ? '' : window.LiveUI.collectionText(s?.label || '', s)) : S.text(s, 'points', () => fmt(value, unit)); };
  let data = null;
  const join = (parts, separator = ' · ') => parts.filter(Boolean).map(window.LiveUI.sp).join(separator);
  const stamp = (at) => Number.isFinite(Date.parse(at)) ? join([window.LiveUI.date(at), window.LiveUI.time(at)], ' ') : '';
  const part = (label, r, key, unit) => off() && r?.[key] == null ? '' : `${label} ${read(r, key, unit)}`;
  const rankPart = (label, r, key, unit) => {
    const text = part(label, r, key, unit);
    return r?.[key] == null ? text : text.replaceAll(' ', '\u00a0');
  };
  const rankText = sub => sub.replace(/ · /g, '\u00a0· ').replace(/(\d) ([KMG]?B(?:\/s)?|%)/g, '$1\u00a0$2');
  const backgroundScore = (r) => (r.cpu ?? 0) + (r.gpu ?? 0) + (r.memory ?? 0);
  const metrics = (r, memory, vram) => join([rankPart('CPU 均值', r, 'cpu', '%'), rankPart('GPU 均值', r, 'gpu', '%'), rankPart(memory, r, 'memory', 'GB'), vram && rankPart('显存', r, 'vram', 'GB')]);
  const shared = r => { const unit = Math.max(r.shared_vram || 0, r.shared_vram_peak || 0) < 1 ? 'MB' : 'GB', scale = unit === 'MB' ? 1024 : 1; return ['shared_vram', 'shared_vram_peak'].map((key, i) => off() && r[key] == null ? '' : `${i ? '峰值' : '共享显存'} ${S.text(r, key, v => `${Number((v * scale).toFixed(2))} ${unit}`)}`).filter(Boolean).join(' / '); };
  const memoryRange = (r, key) => { const fields = [key + '_start', key + '_end'], unit = Math.max(...fields.map(k => r[k] || 0)) < 1 ? 'MB' : 'GB', scale = unit === 'MB' ? 1024 : 1; return fields.map(k => S.text(r, k, v => `${Number((v * scale).toFixed(2))} ${unit}`)).join(' → '); };
  const base = (r) => ({ name: r.name, value: r.cpu, text: fmt(r.cpu, '%'), hue: V.categoryHues[r.category] || 'stone' });
  function topRow(r) {
    const single = (r.memory_basis ?? data?.blocks?.top?.memory_basis) === 'single_process_samples';
    const mean = metrics(r, single ? '单进程平均内存' : '各路径单进程平均内存之和', true);
    const peak = rankPart(single ? '单进程内存峰值' : '单路径内的最高采样值', r, 'memory_peak', 'GB');
    return { ...base(r), sub: join([mean, rankPart('CPU 峰值', r, 'cpu_peak', '%'), peak]) };
  }
  const backgroundNote = (list) => {
    const meta = data?.blocks?.background, sort = meta?.sort;
    const order = sort?.direction === 'asc' ? '从低到高' : '从高到低';
    return join([`按 ${sort?.label ?? 'CPU 均值 + GPU 均值 + 平均内存（GB）'} 三项相加${order}排，所以 GPU 或内存占得多的程序可能排在 CPU 更高的前面`,
      !meta?.vram?.note && list?.length && list.every(r => r.vram == null) && '这张榜单没有显存记录'], '。');
  };
  function backgroundRow(r, identity) {
    const sampled = stamp(r.last_sample_at);
    return { ...base(r), text: part('CPU', r, 'cpu', '%'), sub: join([identity, sampled && `最后采样 ${sampled}`,
      metrics(r, '平均内存', data?.blocks?.background?.vram?.state !== 'unavailable' && r.vram != null),
      rankPart('磁盘', r, 'io_rate', 'B/s'), rankPart('网络', r, 'network_rate', 'B/s'), r.signature ?? (off() ? '' : window.LiveUI.collectionText('签名'))]) };
  }
  const rows = {
    top: topRow,
    io: (r, i) => ({ key: r.key ?? r.name, name: r.name, value: r.write, text: off() && r.write == null ? '' : `写 ${fmt(r.write, 'GB')}`, hue: V.categoryHues[r.category] || 'stone', sub: join([part('读', r, 'read', 'GB'), join([part('读速', r, 'read_rate', 'B/s'), part('写速', r, 'write_rate', 'B/s')], ' / '), part('每秒读写', r, 'iops', '次')]) }),
    network: (r, i) => ({ key: r.key ?? r.name, name: r.name, value: r.total, text: fmt(r.total, 'GB'), hue: V.categoryHues[r.category] || 'stone', sub: join([join([part('发送', r, 'send_rate', 'B/s'), part('接收', r, 'receive_rate', 'B/s')], ' / '), part('最大连接', r, 'connections', '个')]) }),
    threads: (r, i) => ({ key: r.key ?? r.name, name: r.name, value: r.threads, text: r.threads == null ? (off() ? '' : window.LiveUI.collectionText('线程数', r)) : `${fmt(r.threads, '个')}线程`, hue: V.categoryHues[r.category] || 'stone', sub: join([part('峰值', r, 'threads_peak', '个'), r.affinity == null ? (off() ? '' : window.LiveUI.collectionText("CPU 亲和性")) : /^全核/.test(window.LiveUI.sp(r.affinity)) ? '' : r.affinity, shared(r), part('专用', r, 'vram', 'GB')]) }),
    leaks: (r, i) => ({ key: r.key ?? r.name, name: r.name, value: r.memory_growth, text: r.memory_growth == null ? (off() ? '' : window.LiveUI.collectionText()) : `内存 +${fmt(r.memory_growth, 'GB')}`, hue: V.categoryHues[r.category] || 'stone', sub: join([off() && (r.memory_start == null || r.memory_end == null) ? '' : memoryRange(r, 'memory'), off() && (r.vram_start == null || r.vram_end == null) ? '' : `显存 ${memoryRange(r, 'vram')}`]) }),
  };
  function rankRows(key, list) {
    const names = new Map(), seen = new Map();
    if (key === 'background') for (const { name } of list ?? []) names.set(name, (names.get(name) ?? 0) + 1);
    return list?.map((r, i) => {
      const ordinal = (seen.get(r.name) ?? 0) + 1;
      seen.set(r.name, ordinal);
      const detail = join([r.pid != null && `进程号 ${r.pid}`, r.rank != null && `第 ${r.rank} 名`,
        names.get(r.name) > 1 && r.pid == null && r.rank == null && `记录 ${ordinal}`]);
      const row = key === 'background' ? backgroundRow(r, detail) : (rows[key] || base)(r);
      const identity = key === 'background' ? r.instance_id ?? r.key ?? r.id ?? r.sample_id ?? (r.pid != null ? `${r.pid}:${r.started_at ?? ''}` : null) : r.key;
      const ready = S.row({ ...row, name: pname(row.name) }, r, { io: 'write', network: 'total', threads: 'threads', leaks: 'memory_growth' }[key] || 'cpu');
      if (key === 'top' || key === 'background') ready.sub = rankText(ready.sub);
      return { ...ready, key: identity ?? `${key}:${r.name}:${i}` };
    }) ?? null;
  }
  function rank(key, note) {
    return (el) => {
      el.innerHTML = '<div class="vz-rank--detail"></div>' + (note ? '<p class="vz-note" hidden></p>' : '');
      const view = V.block(el.firstElementChild, V.rank(el.firstElementChild, { show: Infinity, top: false, mark: true, empty: '这段时间没有记录', more: (n) => `展开（还有 ${n} 条）` }), () => data, key);
      return { set: () => {
        view.set(rankRows(key, data?.[key]));
        if (note) { const list = data?.[key]; el.lastElementChild.textContent = note(list); el.lastElementChild.hidden = !list?.length; }
      } };
    };
  }
  const keys = ['contention', 'cpu', 'memory'];
  // 应用趋势的线（M342）：整段没有一个数的不画、不进图例；同一程序的几个进程（后台还没并成一行时）按时刻相加成一条，
  // 图例里同一程序只出现一次；每个程序一种颜色（均值、峰值同色，峰值总在上面），四色轮换会让好几条线同色。
  const APP_COLORS = ['#16a6c4', '#7a63e8', '#e2639f', '#3f87ee', '#e8913f', '#2e9a62', '#b5562d', '#c49a00', '#5b6b7d', '#a03fb8', '#0f7c8c', '#d04a3a'];
  const programOf = s => typeof s.program === 'string' ? s.program : typeof s.label === 'string' ? (/^(?:均值|峰值)\s*·\s*(.+)$/.exec(s.label.trim())?.[1] ?? /^(.+)\s+(?:均值|峰值)$/.exec(s.label.trim())?.[1] ?? null) : null;
  function appSeries(list) {
    const lines = new Map();
    for (const s of list || []) {
      if (!s.points?.some(p => Number.isFinite(p[1]))) continue;
      const key = typeof s.label === 'string' ? s.label.trim() : `id:${s.id}`, was = lines.get(key);
      if (!was) { lines.set(key, { ...s, points: s.points.map(p => [...p]) }); continue; }
      const at = new Map(was.points.map(p => [p[0], p]));
      for (const [t, v] of s.points) {
        if (!Number.isFinite(v)) continue;
        const p = at.get(t);
        if (p) p[1] = Number.isFinite(p[1]) ? p[1] + v : v; else { const q = [t, v]; was.points.push(q); at.set(t, q); }
      }
      was.points.sort((a, b) => a[0] - b[0]);
    }
    const programs = [...new Set([...lines.values()].map(programOf).filter(Boolean))];
    return [...lines.values()].map(s => { const i = programs.indexOf(programOf(s)); return i < 0 ? s : { ...s, hue: APP_COLORS[i % APP_COLORS.length] }; });
  }
  const appPack = pack => pack && Array.isArray(pack.series) ? { ...pack, series: appSeries(pack.series) } : pack;
  function merge(d) {
    if (d) d = { ...d, cpu: appPack(d.cpu), memory: appPack(d.memory) };
    return { ...D.merge(d, keys), series: keys.flatMap((k) => (d?.[k]?.series || []).map((s) => {
      const window = d[k].window;
      return { ...s, id: `${k}:${s.id}`, from: window?.from ?? s.from ?? d[k].from, to: window?.to ?? s.to ?? d[k].to };
    })) };
  }
  const lastBucket = pack => Math.max(...(pack?.series || []).map(s => s.points?.at(-1)?.[0] ?? -Infinity));
  function trendReading(pack, unit) {
    const readings = (pack?.series || []).map((s) => {
      const label = typeof s.label === 'string' ? s.label.trim() : '';
      const prefix = /^(均值|峰值)\s*·\s*(.+)$/.exec(label), suffix = /^(.+)\s+(均值|峰值)$/.exec(label);
      const legacy = /^(.+)_(mean|peak)$/.exec(s.id), metric = { mean: '均值', peak: '峰值' };
      const kind = metric[s.metric] ?? prefix?.[1] ?? suffix?.[2] ?? (/^(均值|峰值)$/.test(label) ? label : metric[legacy?.[2]]);
      const name = typeof s.program === 'string' ? s.program : prefix?.[2] ?? suffix?.[1] ?? (typeof s.label !== 'object' && kind && (label !== kind && label || legacy?.[1]));
      return { s, kind, name, point: s.points?.at(-1) };
    });
    const t = lastBucket(pack);
    const available = readings.filter(r => r.point?.[0] === t && Number.isFinite(r.point[1]));
    const mean = available.find(r => r.kind === '均值'), lead = mean ?? available.find(r => r.kind === '峰值');
    const same = lead?.name ? readings.filter(r => r.name === lead.name) : [];
    const peaks = same.filter(r => r.kind === '峰值');
    const pairable = mean && same.filter(r => r.kind === '均值').length === 1 && peaks.length <= 1;
    const peak = pairable && available.includes(peaks[0]) ? peaks[0] : null;
    const reading = r => `${r.kind} ${seriesText(r.s, unit)}`;
    const latest = lead && join([pname(lead.name), stamp(new Date(t * 1000).toISOString()), reading(lead), pairable && (peak ? reading(peak) : '峰值未记录')]);
    // 最高值按图上画出来的线算（几个进程并成一条以后可能比后台单条的 peak_pct 高），和纵轴对得上
    const drawn = (pack?.series || []).flatMap(s => (s.points || []).map(p => p[1]).filter(Number.isFinite)), top = drawn.length ? Math.max(...drawn) : pack?.peak_pct;
    const highest = unit === '%' && Number.isFinite(top) && `本时段所展示应用最高 ${Number(top.toFixed(2))}%`;
    const since = pack?.recorded_from ?? pack?.accumulating?.since ?? pack?.since;
    const start = Number.isFinite(Date.parse(since)) ? `${pack.recorded_from ? '首个有数日期' : '累计起点'} ${window.LiveUI.date(since)}` : '';
    return join([latest, highest, start], '。') || (available.length ? '读数口径未标明' : off() ? '' : '该采样时段没有读数');
  }
  // 应用数量会变，图例随这次的线变化；CPU 与内存的同名 id 各加前缀。
  function trends(el) {
    el.innerHTML = '<div class="grp__main"><div class="grp__lead"><button type="button" class="pill-btn apps-trend-back">前台和后台</button><div class="grp__hero"></div></div><div class="grp__chips"></div></div>';
    let chart = null, signature = '', selected = 'contention';
    const cells = V.chips(el.querySelector('.grp__chips'), { sync, palette: hues, onPick: (k) => { selected = k; draw(); } });
    const onRead = (values, t) => {
      if (t != null || selected === 'contention') return;
      const latest = lastBucket(data?.[selected]);
      // 最后一个钟点没数的线：写它最近一次有数的值和钟点，不再一半写“该时刻未记录”（M342）
      const series = merge(data)?.series || [], unit = selected === 'memory' ? 'GB' : '%';
      for (const { id, at } of values) if (at !== latest) {
        const last = series.find(s => s.id === id)?.points?.filter(p => Number.isFinite(p[1])).at(-1), b = el.querySelector(`.grp__hero [data-line="${CSS.escape(id)}"] b`);
        if (b) b.textContent = last ? `${C.value(last[1], unit)}（最近 ${window.LiveUI.time(new Date(last[0] * 1000).toISOString())}）` : '这段时间没有数';
      }
    };
    el.querySelector('.apps-trend-back').addEventListener('click', () => { selected = 'contention'; draw(); });
    function draw() {
      const payload = merge(data), all = payload?.series || [], next = JSON.stringify(all.map((s) => [s.id, s.label]));
      if (!chart || next !== signature) {
        chart?.destroy(); el.querySelector('.grp__hero').replaceChildren(); el.querySelector('.grp__chips').dataset.keys = '';
        chart = C.create(el.querySelector('.grp__hero'), { size: 'hero', lines: all.map((s) => ({ id: s.id, label: lineLabel(s.label), hue: s.hue })), palette: hues, sync, floor: 0, onRead }); signature = next;
      }
      const list = keys.map((k, i) => ({ key: k, label: ['前台和后台怎样分资源', '应用 CPU 趋势', '应用内存趋势'][i], lines: all.filter((s) => s.id.startsWith(`${k}:`)).map((s) => ({ id: s.id, label: lineLabel(s.label), hue: s.hue })), unit: k === 'memory' ? 'GB' : '%', on: k === selected }));
      const picked = list.find((x) => x.key === selected);
      chart.show(picked.lines.map((s) => s.id), { title: picked.label, unit: picked.unit, floor: 0 });
      if (payload) chart.set(payload); else chart.wait(off() ? '这块没存下来，连上后补上。' : window.LiveUI.collectionText());
      cells.set(list.filter((c) => c.key !== 'contention').map((c) => ({ ...c, text: trendReading(appPack(data?.[c.key]), c.unit) })), payload);
      el.querySelector('.apps-trend-back').setAttribute('aria-pressed', String(selected === 'contention'));
    }
    return { set: draw };
  }
  const isHung = (state) => state?.id === 'hung' || /无响应$/.test(state?.id || '');
  const hangWindow = (d, row) => [row, d?.blocks?.hangs?.window, d?.window].find(w => Date.parse(w?.to) > Date.parse(w?.from));
  function hungSpans(d, row) {
    const w = hangWindow(d, row);
    if (!w || !Array.isArray(row?.spans)) return [];
    const from = Date.parse(w.from) / 1000, to = Date.parse(w.to) / 1000;
    return row.spans.flatMap(([t, state], i) => {
      const start = Math.max(t, from), end = Math.min(row.spans[i + 1]?.[0] ?? to, to);
      return isHung(d.hangs?.data?.states?.[state]) && end > start ? [{ start, end }] : [];
    });
  }
  function hangCount(d) {
    const rows = d?.hangs?.data?.rows;
    return rows ? Object.values(rows).filter((row) => hungSpans(d, row).length).length : null;
  }
  function hangPeriod(d, row) {
    const w = hangWindow(d, row);
    return w ? `${stamp(w.from)} 至 ${stamp(w.to)}` : '';
  }
  function hangs(el) {
    let view, axisObserver, signature = '', selected = null;
    const closeAt = key => hangWindow(data, data?.hangs?.data?.rows?.[key])?.to;
    const events = () => { const box = el.querySelector('[data-hang-events]'); box.hidden = !selected; if (selected) window.LiveUI.html(box, hangEvents(data, selected)); };
    const pick = e => { const label = e.target.closest('.vz-tl__label'); if (!label || e.type === 'keydown' && !['Enter', ' '].includes(e.key)) return; e.preventDefault(); selected = label.closest('[data-row]').dataset.row; events(); };
    el.addEventListener('click', pick); el.addEventListener('keydown', pick);
    for (const type of ['pointerdown', 'pointermove', 'pointerup']) el.addEventListener(type, e => {
      const row = e.target.closest('.vz-tl__plot')?.closest('[data-row]'), tip = el.querySelector('.vz-tip > span:nth-child(2)');
      if (row && tip?.textContent.endsWith('现在')) tip.textContent = tip.textContent.replace(/现在$/, stamp(closeAt(row.dataset.row)));
    });
    return { set: () => {
      const list = data?.hangs?.rows?.length ? data.hangs.rows.map(row => ({ ...row, label: pname(row.label) })) : [{ key: 'day', label: '近 24 小时' }], next = JSON.stringify(list);
      if (!view || next !== signature) {
        axisObserver?.disconnect();
        el.innerHTML = '<div data-hang-first></div><div data-hang-events hidden></div>';
        const host = el.querySelector('[data-hang-first]');
        view = V.block(host, V.timeline(host, { rows: list }), () => data, 'hangs'); signature = next;
        axisObserver = new MutationObserver(changes => changes.forEach(({ target }) => {
          const end = target.querySelector('.is-now'), at = closeAt(target.closest('[data-row]').dataset.row);
          if (end?.textContent === '现在' && at) end.textContent = window.LiveUI.time(at);
        }));
        host.querySelectorAll('.vz-tl__axis').forEach(axis => axisObserver.observe(axis, { childList: true }));
        el.querySelectorAll('.vz-tl__label').forEach(label => { label.setAttribute('role','button'); label.tabIndex = 0; });
        if (!list.some(row => String(row.key) === selected)) selected = null;
      }
      const payload = data?.hangs?.data;
      const names = new Map(list.map(row => [String(row.key), row.label]));
      const rows = payload && Object.fromEntries(Object.entries(payload.rows || {}).map(([key, row]) => {
        const w = hangWindow(data, row);
        return [key, { ...row, label: names.get(key) ?? row.label, from: w?.from, to: w?.to }];
      }));
      // 无响应短竖条先摆上、带上它的状态，再交给时间带画：点住图例别的项时它跟着变淡（M344）
      const hung = payload?.states?.find(isHung)?.id;
      el.querySelectorAll('.apps-hang-mark').forEach((mark) => mark.remove());
      for (const [key, row] of Object.entries(rows || {})) {
        const plot = el.querySelector(`[data-row="${CSS.escape(key)}"] .vz-tl__plot`);
        if (!plot) continue;
        for (const span of hungSpans(data, row)) {
          const mark = document.createElement('i'), from = Date.parse(row.from) / 1000, to = Date.parse(row.to) / 1000;
          mark.className = 'apps-hang-mark'; mark.setAttribute('aria-hidden', 'true'); if (hung != null) mark.dataset.state = hung;
          mark.style.left = `clamp(0px, ${(100 * (span.start - from) / (to - from)).toFixed(4)}%, calc(100% - 4px))`;
          plot.append(mark);
        }
      }
      view.set(payload ? { ...payload, rows, states: payload.states?.map((state) => isHung(state) ? { ...state, hue: 'pink' } : state) } : null);
      events();
    } };
  }
  function hangEvents(d, key) {
    const U = window.LiveUI, row = d?.hangs?.data?.rows?.[key], spans = hungSpans(d, row).reverse();
    const title = pname(d?.hangs?.rows?.find(r => String(r.key) === key)?.label || '');
    const period = hangPeriod(d, row), range = period ? `<p class="use-note">记录时段 ${U.esc(period)}</p>` : '';
    const list = rows => rows.map(s => { const at = new Date(s.start * 1000).toISOString(); return `<p class="use-note">${U.esc(U.date(at))} ${U.esc(U.time(at))} · 无响应 ${U.esc(fmt(s.end-s.start,'s'))}</p>`; }).join('');
    return `<h3 class="use-two__k">${U.fieldHtml(title, { name: '程序' })}的无响应记录</h3>${range}${!row?.spans ? U.collectionText('事件') : !spans.length ? '<p class="use-note">这段时间没有无响应记录</p>' : list(spans.slice(0,5)) + (spans.length > 5 ? `<details data-fold-count="${spans.length - 5}"><summary class="more">展开（还有 ${spans.length-5} 条）</summary>${list(spans.slice(5))}</details>` : '')}`;
  }
  const figure = (key, label, value, unit) => ({ key, label, value, unit });
  const leader = (key, fields) => fields.map(([k, label, unit], i) => S.figure(figure(k, !i && ['top', 'io'].includes(key) && data?.[key]?.[0]?.name ? phrase(pname(data[key][0].name), value => `${value} · ${label}`) : label, data?.[key]?.[0]?.[k], unit), data?.[key]?.[0], k));
  const pictures = { top: '/live/img/grp-cpu.webp', background: '/live/img/grp-machine.webp', resources: '/live/img/card-apps-res.webp', hangs: '/live/img/card-apps-hangs.webp', leaks: '/live/img/grp-memory.webp', io: '/live/img/grp-disk.webp', network: '/live/img/grp-network.webp', threads: '/live/img/card-apps-threads.webp' };   // 图址写全，构建才认得出、换成云端地址
  function group(key, name, line, figures, build, present) {
    const given = data?.groups?.find((g) => (g.key || g.id) === key);
    const all = merge(data)?.series || [];
    if (off()) figures = figures.filter((f) => f.value != null || f.line && all.some((s) => s.id === f.line && s.points?.some((p) => p[1] != null)));
    figures = figures.map((f) => { const s = all.find((s) => s.id === f.line); return s && S.partial(s, 'points') ? { ...f, text: seriesText(s, s.unit), label: f.label + (s.gap ? ` · ${window.LiveUI.sp(s.gap)}` : '') } : f; });
    return { ...given, key, name, pic: pictures[key] || pictures.top, line: present ? line : '', figures, build, palette: hues, reason: given?.reason, grafana: data?.grafana?.href };
  }
  function headline(c) {
    const level = data?.level || 'none', attention = data?.attention_groups ?? data?.attention_count;
    D.count({ ...c, red: level === 'red' ? attention ?? 0 : 0, yellow: level === 'yellow' ? attention ?? 0 : 0, none: level === 'none' ? c.total : 0, warn: attention > 0 ? c.warn.filter((g) => g.key !== 'hangs') : [] });
    const hero = document.getElementById('hero');
    window.LiveLight.tone(hero, data);
    hero.querySelector('[data-part="count"]').hidden = true;
    const cpu = data?.contention?.series?.find((s) => s.id === 'fg_cpu');
    const U = window.LiveUI, head = hero.querySelector('[data-part="head"]'), note = hero.querySelector('[data-part="note"]'), n = hangCount(data);
    const cpuText = cpu?.points?.at(-1)?.[1] == null ? (off() ? '' : U.collectionText('前台 CPU 占用')) : `前台 CPU 占用 ${seriesText(cpu, '%')}`;
    const lower = S.partial(data?.hangs, 'rows') || S.partial(data?.hangs?.data, 'rows') || Object.values(data?.hangs?.data?.rows || {}).some((r) => S.partial(r, 'spans'));
    const block = data?.blocks?.hangs ?? data?.hangs;
    const cutoff = n > 0 && window.LiveUI.olderNote(block?.at ?? block?.window?.to, block);
    if (data) {
      const hangs = n > 0 ? `${lower ? '至少 ' : ''}${n} 个程序曾无响应` : '';
      U.html(head, U.status(data).lamp + U.head(hangs || cpuText || '谁在占', { lamp: false, href: hangs ? '#grp-hangs' : '' }));
      const link = head.querySelector('.head__link');
      if (link) link.dataset.goto = 'hangs';
    }
    const lastCpu = cpu?.points?.at(-1);
    const cpuAt = lastCpu?.[1] != null && Number.isFinite(lastCpu[0]) ? new Date(lastCpu[0] * 1000).toISOString() : null;
    const detail = join([n > 0 && cpuText, cpuAt && `前台 CPU ${U.isStale(cpu) ? '上次' : '采样'} ${U.date(cpuAt)} ${U.time(cpuAt)}`,
      cutoff && cutoff.replace('数据截止', '无响应采样截至')]);
    note.hidden = !detail;
    U.html(note, U.esc(detail));
  }
  const boardHost = document.getElementById('board');
  const board = V.board(boardHost, { key: 'apps', sync, onCount: headline });
  D.mount({ resource: 'computer/apps', board, merge, render(d) {
    data = d = d && { ...d, io: d.io?.slice().sort((a, b) => (b.write ?? -1) - (a.write ?? -1)),
      background: d.blocks?.background?.sort ? d.background : d.background?.slice().sort((a, b) => backgroundScore(b) - backgroundScore(a)) };
    const lead = (key) => d?.[key]?.[0]?.name ? phrase(pname(d[key][0].name), value => `排在最前的是 ${value}`) : Array.isArray(d?.[key]) ? '这段时间没有记录' : '';
    const sameName = list => Array.isArray(list) && new Set(list.map(r => typeof r.name === 'string' ? r.name : r)).size < list.length;
    const periods = new Set(Object.values(d?.hangs?.data?.rows ?? {}).map(row => hangPeriod(d, row)).filter(Boolean));
    const period = periods.size > 1 ? '按每个程序的记录时段显示' : [...periods][0] || hangPeriod(d);
    board.set([
      group('hangs', '哪个程序曾经没响应', period || phrase(d?.window?.label || '近 24 小时', value => `${value}的程序响应记录`), [figure('apps', '曾无响应的程序', hangCount(d), '个')], hangs, d?.hangs != null),
      group('resources', '前后台与应用趋势', '前后台资源占用，以及各应用的均值和峰值', [{ key: 'fg', label: '前台 CPU', line: 'contention:fg_cpu' }, { key: 'bg', label: '后台 CPU', line: 'contention:bg_cpu' }, { key: 'gpu', label: '前台 GPU', line: 'contention:fg_gpu' }], trends, keys.some((k) => d?.[k]?.series?.length)),
      group('top', '占得最多的程序', '按平均 CPU 从高到低排列', leader('top', [['cpu', 'CPU', '%'], ['gpu', 'GPU', '%'], ['memory', '内存', 'GB']]), rank('top'), d?.top != null),
      group('background', '没在前台，也在忙', join([lead('background'), sameName(d?.background) && '按进程分别记，同名程序可有多条']), leader('background', [['cpu', 'CPU', '%'], ['io_rate', '磁盘', 'B/s'], ['network_rate', '网络', 'B/s']]), rank('background', backgroundNote), d?.background != null),
      group('leaks', '内存或显存持续增长', join([lead('leaks'), d?.leaks?.length && '按采样记录列出，同名程序可有多条']), leader('leaks', [['memory_growth', '内存增长', 'GB'], ['memory_end', '结束时内存', 'GB'], ['vram_end', '结束时显存', 'GB']]), rank('leaks'), d?.leaks != null),
      group('io', '谁在读写磁盘', lead('io'), leader('io', [['write', '累计写', 'GB'], ['read', '累计读', 'GB'], ['iops', '每秒读写', '次']]), rank('io'), d?.io != null),
      group('network', '谁在用网络', lead('network'), leader('network', [['total', '累计流量', 'GB'], ['send_rate', '发送', 'B/s'], ['receive_rate', '接收', 'B/s']]), rank('network'), d?.network != null),
      group('threads', '线程与共享显存', join([lead('threads'), sameName(d?.threads) && '按进程分别记，同名程序可有多条']), leader('threads', [['threads', '线程', '个'], ['shared_vram', '共享显存', 'GB'], ['vram', '专用显存', 'GB']]), rank('threads'), d?.threads != null),
    ].concat((d?.groups || []).filter(g => (g.key || g.id) && !Object.hasOwn(pictures, g.key || g.id) && !keys.includes(g.key || g.id)).map(g => {
      const key = g.key || g.id, index = Array.from(key).reduce((n, c) => (n + c.codePointAt(0)) % hues.length, 0);
      const name = [g.label, g.name, g.title, g.text].find(value => value && (typeof value !== 'string' || value.trim())) || key;
      return {
        ...group(key, name, g.why || g.reason || '', g.figures || [], Array.isArray(d?.[key]) ? rank(key) : undefined, true),
        palette: [hues[index], hues[(index + 1) % hues.length]],
      };
    })));
    const first = boardHost.querySelector?.('.grp[data-key="hangs"]'), second = boardHost.querySelector?.('.grp[data-key="resources"]');
    if (first && first !== boardHost.firstElementChild) boardHost.prepend(first);
    const next = first ? first.nextElementSibling : boardHost.firstElementChild;
    if (second && second !== next) boardHost.insertBefore(second, next);
    S.finish(data, { resources: ['contention', 'cpu', 'memory'] });
  } });
})();

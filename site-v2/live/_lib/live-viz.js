// 实况的另几种图（第二层共用，和 live-chart.js 的曲线一套样子）：状态时间轴、热力图、柱子、占比环、排行、数字块。
// 颜色用彩虹光那几种（青、蓝紫、粉、蓝）再加一种杏色、一种石灰色（只给“关机离线、没有记录”），线细、字号和曲线一样，
// 指上去有读数；数到了淡入，变了的原地淡换，长短 600 毫秒走过去。不引图表库。null 是没读到，不当 0 画。
//
// 用法（样板页：/live/usage/page.js）：
//   LiveViz.dur(秒)                         “10 小时 28 分钟”“45 分钟”；null 返回 null
//   LiveViz.durHtml(秒)                     大字用：数字 <b>，单位 <small>
//   LiveViz.hues                            颜色表：teal violet pink blue apricot stone
//
//   const tl = LiveViz.timeline(host, { rows: [{ key: 'year', label: '近一年', short: '一年' }, { key: 'day', label: '近 24 小时', short: '24 小时' }] })
//   tl.set({ states: [{ id, label, note, hue? }], rows: { year: { from, to, spans: [[开始秒, 状态序号], ...] }, day: {...} } })
//       每段从自己的开始秒到下一段开始（最后一段到 to）；状态序号指 states 里第几个，也是叠的顺序（下面先画）。一格像素超过 1 小时的横带画成一天一竖条、
//       按各状态占几成从下往上叠，指上去说那一天各状态多久；
//       细的横带说指着的那一段。下面图例写每种状态在每条横带里一共多久；指图例那一项，横带上只亮这一种。
//   const hm = LiveViz.heatmap(host, { hue: 'teal', max: 60, what: '用了' })
//   hm.set({ days: ['2026-11-03', ...], minutes: [[24 个数或 null], ...] })   一天一行、一小时一格；null 的格子不画（还没到）
//   const b = LiveViz.bars(host, { title, series: [{ id, label, hue, soft? }], stack: true|false, unit: '秒' })
//   b.set({ labels: [{ text, sub?, title? }], values: { id: [数或 null, ...] }, at?: '今天' })   stack 叠起来；false 并排。头上的数是指着的那一天，平时是最后一天
//   const s = LiveViz.share(host, { center: '前台' })
//   s.set([{ id, label, value, hue }])     占比环 + 右边一列；指着哪一类，环上只亮它、中间写它
//   const r = LiveViz.rank(host, { empty: '没有记录' })
//   r.set([{ key, name, sub?, time?, value, text?, hue? }])  比例条全露；bar: false 的文字列表先显示 show（默认 5）条
//   const f = LiveViz.figures(host)
//   f.set([{ key, label, value, unit?（不给按秒）, text?, sub?（一句或几句，一句一行）, frac?(0–1，画一条细条), hue? }])
//   以上 set(null) 都写“还没读到”；wait(text) 写别的话。
//
// 单位：bars、share、rank、figures、chips 都认 unit（opts.unit 整张图一种，或每项自己的 unit）；不给就当秒（旧页面照旧）。
//   LiveViz.fmt(v, unit)  / LiveViz.fmtHtml(v, unit)   秒、分钟写成“2 小时 46 分钟”，别的交 LiveChart.value（℃ % GB B B/s W kWh 次 FPS ms ……）
//
// 2026-11-16 起第二层数据页用“一组一行，点开成章”（样板：/live/computer/、/live/usage/）：
//   const board = LiveViz.board(host, { key: 'computer', sync, quiet?, onCount? })
//   board.set([{ key, name, level: 'red'|'yellow'|'ok'|'none', reason, line, pic, palette: ['teal','violet'], grafana,
//                figures: [{ key, label, line?: 'series id', value?, unit?, text? }],      收着时那三四个大数字（每个带一条走势小线）
//                chips: [{ key, label, lines: [{ id, label }], unit?, floor?, ceil?, stack? }], hero: 'chip key',   左边大图、右边数字小格
//                say?: (chip, sums) => '一句人话', build?: (el, group) => ({ set(group) }),
//                wait?: true|false }])   build：章里大图下面放页面自己的东西；wait：这一组只靠页面自己另一份数时，那份还在读给 true、读完给 false
//   board.data({ from, to, series })    曲线的数（走势小线、大图都从这里按 id 取）
//   board.phase(state)                  那一读的 phase：读前整组在雾里写“正在读…”，读完没数（none）才写“还没读到”。页面要把 phase 和 data 都交进来，
//                                       不然组一直在雾里（没有曲线的页，data 交一个 { series: [] } 就行）
//   board.open(key) / board.all(open) / board.allOpen()   章节默认展开；collapsible: true 启用开关和 onToggle(open, key)
//   const c = LiveViz.chips(host, { onPick })   c.set([{ key, label, value, unit?, text?, lines?, on? }], payload)   数字小格
//   const m = LiveViz.moments(host, { onPick }) m.set([{ key, time, day?, title, text?, hue? }])   竖的小时间线（最近卡过、最近在前台的）
//   const a = LiveViz.audit(host)              a.set([{ key, name, count, level?, top: [{ name, count }], rows: [{ time, name, count? }] }])   审计清单
//   const w = LiveViz.weave(host, { sync, order, hues, label })  w.set(payload)、w.marks([{ t, text }])   织锦：所有曲线一条时间轴，一条一行
//   const k = LiveViz.calendar(host, { max })  k.set({ days: [{ day: '2026-06-01', value }], unit? })   一年的小圆珠日历（按月一块）
(() => {
  'use strict';
  const HUE = { teal: '#16a6c4', violet: '#7a63e8', pink: '#e2639f', blue: '#3f87ee', apricot: '#e8913f', stone: '#c9c5bb', ...(window.LiveChart?.hues || {}) };
  const ORDER = ['teal', 'violet', 'pink', 'blue', 'apricot'];
  const STATE_HUE = { work: 'teal', active: 'teal', away: 'apricot', idle: 'apricot', 'screen-off': 'pink', sleep: 'violet', off: '#576681' };
  const CAT_HUE = { ai: '#d4a72c', dev: 'teal', browser: 'blue', game: 'pink', social: 'violet', office: 'apricot', media: '#ac61bb', network: '#398b77', hardware: '#ae7844', system: '#697490', other: 'stone' };
  const CAT_NAME = { ai: 'AI', dev: '开发', browser: '浏览器', game: '游戏', social: '社交与通讯', office: '文档与办公', media: '影音与图片', network: '网络、下载与远程', hardware: '硬件监测与外设', system: '系统与维护', other: '其他应用' };
  const isOffline = () => !!window.LiveUI?.offline?.();
  const missingHtml = text => window.LiveUI.isMissingText(text) ? `<span class="vz-none">${esc(sp(text))}</span>` : esc(sp(text));
  const readingHtml = text => /^\s*(?:至少 |不到 )?-?\d/.test(sp(text)) ? esc(sp(text)).replace(/(-?\d[\d.,]*)|([^\d\s-][^\d]*?)(?=\s*-?\d|\s*$)/g, (m, n, u) => n ? `<b>${n}</b>` : `<small>${u.trim()}</small>`) : missingHtml(text);
  const emptyText = (text) => isOffline() ? '这块没存下来，连上后补上。' : text;
  const BLOCK_NAME = { summary: '摘要', fps: '帧率', frametime: '单帧耗时', jitter: '抖动', foreground: '前台程序', stutters: '卡顿', resource: '资源', memory: '内存', bottleneck: '瓶颈', apps: '程序', modes: '窗口形态', usage: '使用状态', power: '功耗', days: '每日统计', periods: '峰谷', scenes: '场景', ac: '墙上输入', rails: '各轨电流', five_volt: '5V 供电', carbon: '碳排', efficiency: '能效', top: '资源排行', background: '后台程序', io: '磁盘读写', network: '网络', threads: '线程', leaks: '内存增长', hangs: '无响应', contention: '资源争抢', cpu: 'CPU', lifecycle: '进程生灭', year: '近一年', day: '短窗口', states: '使用状态', categories: '程序分类', hours: '几点在用', titles: '窗口标题', recent: '最近前台', focus: '专注', switches: '切窗口', apps_now: '此刻谁在占', temperatures: '温度' };
  Object.assign(BLOCK_NAME, Object.fromEntries(['impersonation:仿冒与路径异常', 'elevated:提权', 'crashes:非零退出', 'short_lived:短命进程', 'lolbins:脚本和系统工具', 'silent:后台外联', 'destinations:外联类别', 'services:服务对应', 'lineage:启动关系', 'sensitive:凭据窗口期间的活动'].map((s) => { const [k, v] = s.split(':'); return [`audits.${k}`, v]; })));
  function blockState(b, offline = false, raw) {
    if (!b?.state && !b?.q && b?.stale !== true) return null;
    offline ||= !!window.LiveUI?.offline?.();
    const known = (v) => typeof v === 'number' && Number.isFinite(v) || v && typeof v === 'object' && (Array.isArray(v.points) ? v.points.some((p) => p[1] != null && Number.isFinite(p[1])) : Object.values(v).some(known));
    const partial = b.cached === true && raw != null || offline && b.state === 'computing' && known(raw);
    const empty = !partial && (b.state === 'unavailable' || offline && (b.cached === false || b.state === 'computing'));
    const stale = b.stale === true || b.q === 'stale' || b.state === 'stale';
    const U = window.LiveUI, at = Object.hasOwn(b, 'source_at') ? b.source_at : (b.window?.to ?? b.to ?? b.at);
    const sampled = typeof at === 'string' && Number.isFinite(Date.parse(at)) ? `${U.date(at)} ${U.time(at)}` : '';
    const last = U.olderNote?.(at, b)?.replace(/^数据截止 /, '上次记录 ') || (U.isCutoffNote(b.stale_text) ? b.stale_text : '');
    const text = offline ? empty ? '这块没存下来，连上后补上。' : last
      : stale ? [last || (sampled && `上次记录 ${sampled}`), U.isCutoffNote(b.reason) && last ? '' : b.reason].map(sp).filter(Boolean).join(' · ')
      : b.state === 'computing' && !partial ? '正在读…' : empty ? U.collectionText('', b)
      : sampled && !['warming', 'unknown', 'computing'].includes(b.state || b.q) ? `截至 ${sampled}` : '';
    return { ...b, state: b.state || b.q || 'stale', empty, wait: !stale && !offline && !empty && !partial && b.state === 'computing', text };
  }
  function blockGroup(g, d, keys = [g.key], offline = false) {
    offline ||= isOffline();
    const blocks = keys.map((key) => { const raw = key.split('.').reduce((v, k) => v?.[k], d); return { key, ...blockState(d?.blocks?.[key] || raw, offline, raw) }; }).filter((b) => b.state);
    if (!blocks.length) return g;
    const levels = keys.map((key) => d?.groups?.find((x) => x.key === key)).filter(Boolean);
    const given = levels.sort((a, b) => (LEVEL_ORDER[a.level] ?? 3) - (LEVEL_ORDER[b.level] ?? 3))[0];
    const empty = blocks.every((b) => b.empty), wait = blocks.every((b) => b.wait);
    return { ...g, ...(given ? { level: given.level, reason: offline ? g.reason : [...new Set(levels.map((x) => sp(x.reason)).filter(Boolean))].join('；') } : {}), blocks, wait, empty, ...(empty ? { level: 'none', line: offline ? '这块没存下来，连上后补上。' : `${sp(g.name) || '这块'}暂时读不到`, reason: '' } : {}) };
  }
  function blockData(d, offline = false) {
    if (!d?.blocks) return d;
    const out = { ...d };
    for (const [key, b] of Object.entries(d.blocks)) {
      if (Object.keys(d.blocks).some((k) => k.startsWith(`${key}.`))) continue;   // 审计子表各自完成，汇总状态不能抹掉已完成的表。
      const s = blockState(b, offline, key.split('.').reduce((v, k) => v?.[k], d));
      if (!s?.empty && !s?.wait) continue;
      const [parent, child] = key.split('.');
      if (child) out[parent] = { ...out[parent], [child]: null }; else out[parent] = null;
    }
    return out;
  }
  function chartQuery(group, range, width) {
    return Number.isFinite(width) ? { group, range, points: Math.max(5, Math.min(4096, Math.round(width))) } : { group, range };
  }
  function chartWidth(host) {
    const plots = host?.querySelectorAll('.chart__plot,.vz-tl__plot,.vz-bars__plot,.vz-share__ring') || [];
    return Math.max(0, ...Array.from(plots, plot => plot.clientWidth));
  }
  function watchChart(resource, group, range, width, callbacks) {
    const measuredQuery = () => chartQuery(group, range, width());
    const needsFull = state => !state.publicPaused && !state.warming && state.data == null &&
      (state.offline || state.meta?.status === 0 || state.meta?.status >= 400);
    let current, points, resizeTimer, probeTimer, legacy = false, stopped = false;
    function subscribe(query, useFull = false) {
      clearTimeout(probeTimer);
      current?.stop();
      legacy = useFull;
      points = query.points;
      let switching = false;
      const next = window.Live.watch(resource, query, points == null ? callbacks : {
        data(data, meta) { if (!switching) callbacks.data?.(data, meta); },
        phase(state) { if (!switching) callbacks.phase?.(state); },
        link(state) {
          if (switching) return;
          if (!needsFull(state)) { callbacks.link?.(state); return; }
          switching = true;
          // 旧接口和公开离线副本使用原查询；等 watch 返回后撤掉采样订阅。
          queueMicrotask(() => {
            if (!stopped && current === next) subscribe(chartQuery(group, range), true);
          });
        },
      });
      if (stopped) { next.stop(); return; }
      current = next;
      if (legacy) probeTimer = setTimeout(() => subscribe(measuredQuery()), 5 * 60 * 1000);
    }
    function resize() {
      clearTimeout(resizeTimer);
      if (!legacy) resizeTimer = setTimeout(() => {
        const query = measuredQuery();
        if (!legacy && query.points !== points) subscribe(query);
      }, 150);
    }
    subscribe(measuredQuery());
    window.addEventListener('resize', resize);
    return { stop() {
      stopped = true;
      window.removeEventListener('resize', resize);
      clearTimeout(resizeTimer);
      clearTimeout(probeTimer);
      current?.stop();
    } };
  }
  function blockNotes(blocks, line, name) {
    const notes = new Map(), said = sp(line);
    for (const b of blocks || []) {
      const text = (b.text || '').replace(/数据截止 (?:\d{2}-\d{2} )?\d{2}:\d{2}/g, s => said.includes(sp(s)) ? '' : s).replace(/^[ ·]+|[ ·]+$/g, '');
      if (!text || said.includes(sp(text)) || isOffline() && b.empty) continue;
      const entry = notes.get(text) || { ...b, text, names: [] }; entry.names.push(BLOCK_NAME[b.key] || name); notes.set(text, entry);
    }
    return [...notes.values()].map(b => `<span data-block="${esc(b.key)}" data-state="${esc(b.state)}"${b.wait ? ' class="fog__text"' : ''}>${esc(sp([...new Set(b.names)].join('、')))} · ${esc(sp(b.text))}</span>`).join('');
  }
  function block(host, view, source, key) {
    let read = null;
    return { ...view, set(value) {
      const d = source(), raw = key.split('.').reduce((v, k) => v?.[k], d), meta = d?.blocks?.[key] || raw;
      const b = blockState(meta, meta?.cached === false && raw == null, raw);
      if (b?.wait || b?.empty) { read ||= window.LiveUI.reading(host, { ghost: window.LiveUI.ghost.chart(), name: BLOCK_NAME[key] || '', slow: false }); read.set({ phase: b.wait ? 'wait' : isOffline() ? 'gone' : 'none', say: b.text }); return; }
      view.set(value); read?.done();
    } };
  }
  const BJ = 8 * 3600;
  const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const esc = (s) => (window.LiveUI?.fieldText?.(s) ?? (typeof s === 'object' ? '' : String(s ?? ''))).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const sp = (s) => window.LiveUI?.sp?.(s) ?? String(s ?? '').replace(/([一-鿿])([0-9A-Za-z])/g, '$1 $2').replace(/([0-9A-Za-z%℃])([一-鿿])/g, '$1 $2');
  const field = (value, name, place = 'body', marker = false) => window.LiveUI?.fieldHtml?.(value, { name, place, marker }) ?? esc(sp(value));
  const color = (h, i = 0) => HUE[h] || (h && /^#|^rgb/.test(h) ? h : HUE[ORDER[i % ORDER.length]]);
  const html = (el, next, fade = true) => (window.LiveUI ? window.LiveUI.html(el, next, fade) : (el.innerHTML = next));

  // —— 时长怎么写 ——
  function parts(s) {
    if (s == null || !Number.isFinite(s)) return null;
    const m = Math.round(s / 60);
    if (m < 1) return s > 0 ? [['不到 1', '分钟']] : [['0', '分钟']];
    const h = Math.floor(m / 60), r = m % 60;
    if (!h) return [[String(r), '分钟']];
    if (h >= 100 || !r) return [[String(h), '小时']];
    return [[String(h), '小时'], [String(r), '分钟']];
  }
  const dur = (s) => parts(s)?.map(([n, u]) => `${n} ${u}`).join(' ') ?? null;
  const durHtml = (s) => parts(s)?.map(([n, u]) => `<b>${n}</b><small>${u}</small>`).join('') ?? '';
  // —— 任意单位：秒、分钟按时长写，别的交 LiveChart.value ——
  const isTime = (u) => u == null || u === '' || u === '秒' || u === 's' || u === '分钟' || u === 'min';
  const toSec = (v, u) => (v == null ? v : u === '分钟' || u === 'min' ? v * 60 : v);
  const fmt = (v, unit) => (v == null || !Number.isFinite(v) ? null : isTime(unit) ? dur(toSec(v, unit)) : window.LiveChart?.value(v, unit) ?? String(v));
  const fmtHtml = (v, unit) => (v == null || !Number.isFinite(v) ? '' : isTime(unit) ? durHtml(toSec(v, unit)) : window.LiveChart?.html(v, unit) ?? esc(String(v)));
  // —— 暖色一路走：象牙白 → 杏 → 粉 → 蓝紫（OKLCH 插色，和第一层那团彩虹光一个调） ——
  const WARM = [[.975, .022, 85], [.87, .085, 62], [.76, .13, -5], [.6, .165, -70]];
  // 热力图用：一种暖色（杏到玫瑰）由浅到深
  // 深的那头拉得更开：用满一小时和用了四十几分钟一眼分得出
  const ROSE = [[0, .97, .02, 75], [.5, .845, .085, 52], [.8, .72, .14, 22], [1, .52, .17, 4]];
  function rose(a) {
    const f = Math.min(Math.max(a, 0), 1), i = Math.max(ROSE.findIndex((s) => s[0] >= f) - 1, 0), A = ROSE[i], B = ROSE[i + 1], k = (f - A[0]) / (B[0] - A[0]);
    const [l, c, h] = [1, 2, 3].map((j) => A[j] + (B[j] - A[j]) * k);
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${((h + 360) % 360).toFixed(1)})`;
  }
  function warm(a) {
    const k = Math.min(Math.max(a, 0), 1) * (WARM.length - 1), i = Math.min(Math.floor(k), WARM.length - 2), f = k - i;
    const [l, c, h] = WARM[i].map((v, j) => v + (WARM[i + 1][j] - v) * f);
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${((h + 360) % 360).toFixed(1)})`;
  }

  // —— 北京时间 ——
  const bj = (t) => new Date((t + BJ) * 1000);
  const pad2 = (n) => String(n).padStart(2, '0');
  const md = (t) => { const d = bj(t); return `${d.getUTCFullYear() === bj(Date.now() / 1000).getUTCFullYear() ? '' : d.getUTCFullYear() + '-'}${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`; };
  const hm = (t) => { const d = bj(t); return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`; };
  const weekday = (t) => WEEK[bj(t).getUTCDay()];
  const dayStart = (t) => Math.floor((t + BJ) / 86400) * 86400 - BJ;
  const sec = (iso) => Date.parse(iso) / 1000;
  const dayLabel = (s) => { const t = sec(`${s}T00:00:00+08:00`); return { md: md(t), wd: weekday(t), t }; };

  // —— 浮在图上的小药丸（和曲线的时刻药丸一个样子） ——
  function tipper(box) {
    const tip = document.createElement('span');
    tip.className = 'vz-tip';
    tip.hidden = true;
    box.append(tip);
    return {
      show(content, x, y) {
        tip.innerHTML = content;
        tip.hidden = false;
        const w = tip.offsetWidth, bw = box.clientWidth;
        tip.style.left = `${Math.min(Math.max(x - w / 2, 0), bw - w)}px`;
        tip.style.top = `${y}px`;
      },
      hide() { tip.hidden = true; },
    };
  }
  const chip = (c) => `<i class="vz-chip" style="--c:${c}"></i>`;

  function waitBox(box, text) {
    if (text) text = emptyText(text);
    let p = box.querySelector(':scope > .vz-wait');
    if (!p) { p = document.createElement('p'); p.className = 'vz-wait'; box.append(p); }
    p.textContent = text;
    p.hidden = !text;
    box.classList.toggle('is-empty', !!text);
  }

  // ================= 状态时间轴 =================
  function mix(hex, k) {   // 往白里调 k（0–1）
    const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return `rgb(${Math.round(r + (255 - r) * k)} ${Math.round(g + (255 - g) * k)} ${Math.round(b + (255 - b) * k)})`;
  }
  // 天色：0–6 点、19–24 点淡紫（夜里），日出日落杏粉，白天浅金；横带背后那条玻璃槽用
  const SKY = [[0, '#d9d2f4'], [5, '#ddd4f2'], [6.5, '#f6d6e3'], [8, '#fbe6cf'], [12, '#fdf1d6'], [16, '#fbe7cc'], [18, '#f6d3df'], [19.5, '#dfd5f3'], [24, '#d9d2f4']];
  function skyAt(h) {
    const i = SKY.findIndex(([x]) => x >= h);
    return i <= 0 ? SKY[0][1] : SKY[i][1];
  }
  function skyCss(from, to) {
    const span = to - from, stops = [];
    for (let t = from; t <= to + 1; t += 1800) {
      const d = bj(Math.min(t, to)), h = d.getUTCHours() + d.getUTCMinutes() / 60;
      stops.push(`${skyAt(h)} ${(((Math.min(t, to) - from) / span) * 100).toFixed(2)}%`);
    }
    // 星星：每个夜里（22 点到 5 点）撒几颗，铺几轮昼夜就有几片星空
    const stars = [];
    for (let t = Math.ceil(from / 3600) * 3600; t < to; t += 3600) {
      const h = bj(t).getUTCHours();
      if (![22, 0, 2, 4].includes(h)) continue;
      const x = (((t - from) / span) * 100).toFixed(2), y = [26, 70, 22, 62][stars.length % 4], r = [1.4, 1.2, 1.6, 1.3][stars.length % 4];
      stars.push(`radial-gradient(${r}px ${r}px at ${x}% ${y}%, #fff 98%, transparent)`);
    }
    return [...stars, `linear-gradient(90deg, ${stops.join(', ')})`].join(', ');
  }

  function timeline(host, opts) {
    const rows = opts.rows.map((r) => ({ ...r }));
    host.classList.add('vz-tl');
    host.innerHTML = `${rows.map((r) => `<div class="vz-tl__row" data-row="${esc(r.key)}">
        <span class="vz-tl__label" title="${esc(sp(r.label))}">${esc(r.label)}<small class="vz-tl__since" hidden></small></span>
        ${opts.sky && r.key === 'day' ? '<i class="vz-tl__sky" aria-hidden="true"></i>' : ''}<div class="vz-tl__plot"><canvas class="vz-tl__halo" aria-hidden="true"></canvas><canvas class="vz-tl__bar" aria-hidden="true"></canvas><i class="vz-tl__cursor" hidden></i></div>
        <div class="vz-tl__axis"></div>
      </div>`).join('')}<ul class="vz-legend"></ul>`;
    const legend = host.querySelector('.vz-legend');
    const tip = tipper(host);
    for (const r of rows) {
      r.el = host.querySelector(`[data-row="${CSS.escape(r.key)}"]`);
      r.plot = r.el.querySelector('.vz-tl__plot');
      r.bar = r.el.querySelector('.vz-tl__bar');
      r.halo = r.el.querySelector('.vz-tl__halo');
      r.cursor = r.el.querySelector('.vz-tl__cursor');
      r.axis = r.el.querySelector('.vz-tl__axis');
      r.sky = r.el.querySelector('.vz-tl__sky');
      r.since = r.el.querySelector('.vz-tl__since');
      waitBox(r.plot, '正在读');
    }
    let states = [], focus = null, W = 0, pinned = null, hovered = null, muted = null;

    function prep(r, d) {
      r.d = null;
      if (!d || !Array.isArray(d.spans) || !d.spans.length) return;
      let from = sec(d.from);
      const to = sec(d.to);
      if (!(to > from)) return;
      r.since && (r.since.hidden = true);
      r.d = { from, to, spans: d.spans.filter((s) => s[0] < to), restart: d.restart_points || [] };
      r.short = d.short || r.short;
      if (d.label) {
        const label = r.el.querySelector('.vz-tl__label');
        if (label.firstChild.nodeType === Node.TEXT_NODE) label.firstChild.textContent = d.label;
        else label.prepend(d.label);
        label.title = d.label;
      }
      if (r.sky) r.sky.style.background = skyCss(from, to);
      // 每种状态一共多久（裁到这条横带的起止）
      r.tot = new Array(states.length).fill(0);
      r.d.spans.forEach(([t, s], i) => {
        const a = Math.max(t, from), b = Math.min(r.d.spans[i + 1]?.[0] ?? to, to);
        if (b > a && states[s]) r.tot[s] += b - a;
      });
    }

    function draw(r) {
      r.marks = [];
      const w = r.plot.clientWidth, h = r.plot.clientHeight, dpr = Math.min(devicePixelRatio || 1, 3);
      for (const c of [r.bar, r.halo]) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); c.style.width = `${w}px`; c.style.height = `${h}px`; }
      const ctx = r.bar.getContext('2d');
      ctx.clearRect(0, 0, r.bar.width, r.bar.height);
      r.halo.getContext('2d').clearRect(0, 0, r.halo.width, r.halo.height);
      // 页面自己叠在横带上的记号（谁在占页的无响应短竖条）写了 data-state 的，跟着图例一起变淡
      const lit = states.find((st) => st.id === focus)?.label;
      r.plot.querySelectorAll('[data-state]').forEach((n) => n.classList.toggle('is-dim', focus != null && states.find((st) => st.id === n.dataset.state)?.label !== lit));
      if (!r.d || !w) return;
      const { from, to, spans } = r.d, n = r.bar.width, H = r.bar.height, S = states.length;
      const per = (to - from) / n, acc = new Float32Array(n * S);
      spans.forEach(([t, s], i) => {
        if (s == null || s >= S) return;
        const a = (Math.max(t, from) - from) / per, b = (Math.min(spans[i + 1]?.[0] ?? to, to) - from) / per;
        for (let c = Math.max(0, Math.floor(a)); c < Math.min(n, Math.ceil(b)); c++) acc[c * S + s] += Math.min(b, c + 1) - Math.max(a, c);
      });
      // 一列像素一个状态（细条才清楚，不糊成混色），照真实时长分：每列只在这一列真有的状态里挑，
      // 零头记着留给下一列，各状态占的像素和真实时长对得上（误差不到 1 像素），位置也不挪出原来那段
      const col = new Int8Array(n).fill(-1);
      const carry = new Float64Array(S + 1);
      for (let c = 0; c < n; c++) {
        let cov = 0, best = S, v = -Infinity;
        for (let s = 0; s < S; s++) {
          const a = acc[c * S + s];
          if (!(a > 0)) { carry[s] = 0; continue; }
          cov += a; carry[s] += a;
          if (carry[s] > v) { v = carry[s]; best = s; }
        }
        const none = Math.max(0, 1 - cov);
        if (none > 0) { carry[S] += none; if (carry[S] > v) best = S; } else carry[S] = 0;
        carry[best] -= 1;
        col[c] = best === S ? -1 : best;
      }
      const radius = Math.min(H / 2, 9 * dpr);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, n, H, radius);
      ctx.clip();
      ctx.fillStyle = 'rgba(20, 20, 19, .04)';
      ctx.fillRect(0, 0, n, H);
      const fills = states.map((st) => {
        if (st.hue === 'stone') return 'rgba(201, 197, 187, .42)';   // 没有记录：很淡的石灰色平涂
        const c = color(st.hue), g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, mix(c, .32));
        g.addColorStop(.55, c);
        g.addColorStop(1, c);
        return g;
      });
      const alpha = (s) => (focus == null || states[s].label === states.find(st => st.id === focus)?.label ? 1 : .16);
      if ((to - from) / w > 3600) {
        // 粗的横带（一格像素超过 1 小时）：一天一竖条，从下往上按 states 的顺序叠这一天各状态占几成——
        // 一年看下来是一道起伏的“地形”：哪天用得多一眼看得出，细到小时的去看下面那条
        for (let d = dayStart(from); d < to; d += 86400) {
          const a = Math.max(d, from), b = Math.min(d + 86400, to);
          const x0 = Math.round(((a - from) / (to - from)) * n), x1 = Math.round(((b - from) / (to - from)) * n);
          if (x1 <= x0) continue;
          const tot = new Array(S).fill(0);
          for (let c = x0; c < x1; c++) for (let s = 0; s < S; s++) tot[s] += acc[c * S + s];
          const all = tot.reduce((p, q) => p + q, 0);
          if (!all) continue;
          let y = H;
          for (let s = 0; s < S; s++) {
            if (!tot[s]) continue;
            const h = (tot[s] / all) * H;
            ctx.globalAlpha = alpha(s);
            ctx.fillStyle = fills[s];
            ctx.fillRect(x0, y - h, x1 - x0, h);
            y -= h;
          }
        }
      } else {
        for (let c = 0; c < n;) {
          const s = col[c];
          let e = c + 1;
          while (e < n && col[e] === s) e++;
          if (s >= 0) {
            ctx.globalAlpha = alpha(s);
            ctx.fillStyle = fills[s];
            ctx.fillRect(c, 0, e - c, H);
          }
          c = e;
        }
        // 太短看不见的段不撑宽着画（撑宽的一多，比例就和图下的数对不上），只在它附近留 3 像素悬停区，提示里查得到
        spans.forEach(([t, s], i) => {
          if (s == null || !states[s]) return;
          const a = Math.max(0, (Math.max(t, from) - from) / per), b = Math.min(n, (Math.min(spans[i + 1]?.[0] ?? to, to) - from) / per), width = Math.min(3 * dpr, n);
          if (!(b > a && b - a < width)) return;
          const left = Math.min(Math.max((a + b - width) / 2, 0), n - width);
          r.marks.push({ left: left / dpr, right: (left + width) / dpr, index: i, off: states[s].id === 'off' });
        });
        // Nearby short gaps must not cover a confirmed shutdown.
        r.marks.sort((a, b) => Number(a.off) - Number(b.off));
      }
      ctx.globalAlpha = 1;
      // 玻璃的高光：上面一层白，下面一点点暗
      const gloss = ctx.createLinearGradient(0, 0, 0, H);
      gloss.addColorStop(0, 'rgba(255,255,255,.42)');
      gloss.addColorStop(.42, 'rgba(255,255,255,0)');
      gloss.addColorStop(1, 'rgba(20,20,19,.06)');
      ctx.fillStyle = gloss;
      ctx.fillRect(0, 0, n, H);
      ctx.restore();
      ctx.fillStyle = '#34415d';
      for (const t of r.d.restart) {
        const x = Math.min(n - 4 * dpr, Math.max(4 * dpr, (t - from) / per)), y = H / 2, d = 4 * dpr;
        ctx.beginPath(); ctx.moveTo(x, y - d); ctx.lineTo(x + d, y); ctx.lineTo(x, y + d); ctx.lineTo(x - d, y); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(255,255,255,.7)';
      ctx.lineWidth = dpr;
      ctx.beginPath();
      ctx.roundRect(dpr / 2, dpr / 2, n - dpr, H - dpr, radius);
      ctx.stroke();
      r.halo.getContext('2d').drawImage(r.bar, 0, 0);
    }

    function axis(r) {
      if (!r.d) { r.axis.innerHTML = ''; return; }
      const { from, to } = r.d, w = r.plot.clientWidth, x = (t) => ((t - from) / (to - from)) * w;
      const ticks = [];
      if ((to - from) / w > 3600) {          // 长的：每月一格，一月和第一格写年
        const d = bj(from);
        let y = d.getUTCFullYear(), m = d.getUTCMonth();
        if (d.getUTCDate() !== 1 || d.getUTCHours()) m++;
        for (;; m++) {
          const t = Date.UTC(y, m, 1) / 1000 - BJ;
          if (t > to) break;
          const dd = bj(t), mm = dd.getUTCMonth() + 1;
          ticks.push([t, mm === 1 ? `${dd.getUTCFullYear()} 年` : `${mm} 月`, mm === 1]);
        }
        if (ticks.length && !ticks.some((k) => k[2])) { const dd = bj(ticks[0][0]); ticks[0][1] = `${dd.getUTCFullYear()} 年 ${ticks[0][1]}`; }
      } else {                               // 短的：24 小时左右每 3 小时一格，超过 36 小时（近 72 小时）每 6 小时一格；零点写日期
        const step = to - from > 36 * 3600 ? 21600 : 10800;
        for (let t = Math.ceil((from + BJ) / step) * step - BJ; t <= to; t += step) ticks.push([t, bj(t).getUTCHours() ? hm(t) : md(t)]);
      }
      // 字宽按汉字 11.5、别的 6.8 估；挨着上一个、或挤到“现在”的就不写
      const width = (s) => [...s].reduce((a, c) => a + (/[一-鿿]/.test(c) ? 11.5 : 6.8), 0);
      let end = -99;
      const out = [];
      for (const [t, text, year] of ticks) {
        const xx = x(t), tw = width(text), start = xx < 20 ? xx : xx - tw / 2;
        if (start + tw > w - 44 || start < end + 14) continue;
        out.push(`<span class="vz-tl__tick${xx < 20 ? ' is-start' : ''}${year ? ' is-year' : ''}" style="left:${xx.toFixed(1)}px">${esc(text)}</span>`);
        end = start + tw;
      }
      out.push(`<span class="vz-tl__tick is-now" style="right:0">${opts.actualEnd || isOffline() ? hm(to) : '现在'}</span>`);
      r.axis.innerHTML = out.join('');
    }

    function legendHtml() {
      const list = states.filter((st, i) => states.findIndex(s => s.label === st.label) === i);
      const shown = rows.filter((r) => r.d);
      const total = (st, r) => states.reduce((n, s, i) => n + (s.label === st.label ? r.tot[i] || 0 : 0), 0);
      const observed = opts.interactiveObservedOnly ? list.filter(st => shown.some(r => total(st, r) > 0)) : list;
      // 只有一种时点了图上什么都不变：不做成能点的样子
      const canPick = id => observed.length > 1 && observed.some(st => st.id === id);
      if (!canPick(pinned)) pinned = null;
      if (!canPick(hovered)) hovered = null;
      focus = hovered ?? pinned;
      return list.map((st) => {
        const pickable = canPick(st.id);
        const vals = shown.length === 1 ? `<span class="vz-legend__big">${durHtml(total(st, shown[0])) || '—'}</span>` : shown.map((r) => `<span><small>${esc(r.short || r.label)}</small> ${esc(dur(total(st, r)) || '—')}</span>`).join('');
        const state = pickable ? `${pinned === st.id ? ' is-picked' : ''}${focus != null && focus !== st.id ? ' is-dim' : ''}` : ' is-static';
        return `<li class="vz-legend__item${state}" data-state="${esc(st.id)}"${pickable ? ` tabindex="0" role="button" aria-pressed="${pinned === st.id}"` : ''}>
          <span class="vz-legend__name" title="${esc(sp(st.label))}">${chip(color(st.hue))}<b>${esc(sp(st.label).replace(/^[🟢🟡🔴🟠🔵🟣⚪⚫]\s*/u, ''))}</b></span>
          ${st.note ? `<span class="vz-legend__note">${esc(sp(st.note))}</span>` : ''}
          <span class="vz-legend__vals">${vals}</span></li>`;
      }).join('');
    }

    function paint() {
      for (const r of rows) { draw(r); axis(r); }
    }
    function measure() {
      const w = host.clientWidth;
      if (w === W) return;
      W = w;
      paint();
    }
    new ResizeObserver(measure).observe(host);

    // 提示最高能放到哪（相对 host 上沿）：最近一层会裁内容的外框，和屏幕上沿
    function clipTop(hostBox) {
      let limit = -hostBox.top;
      for (let el = host.parentElement; el && el !== document.body; el = el.parentElement) {
        if (getComputedStyle(el).overflowY !== 'visible') { limit = Math.max(limit, el.getBoundingClientRect().top - hostBox.top); break; }
      }
      return limit;
    }
    // 指着横带：粗的说那一天，细的说那一段
    function at(r, e) {
      if (!r.d) return;
      const box = r.plot.getBoundingClientRect(), hostBox = host.getBoundingClientRect();
      const width = r.plot.clientWidth, scale = width / box.width;
      const px = Math.min(Math.max((e.clientX - box.left) * scale, 0), width);
      const top = (box.top - hostBox.top) * scale;
      // 上方放不下（外层会裁掉）就放到横带下面，整颗提示都看得见
      const tipY = top - 36 >= clipTop(hostBox) * scale ? top - 36 : top + r.plot.clientHeight + 8;
      const { from, to, spans } = r.d; let t = from + (px / width) * (to - from);
      const restart = r.d.restart.find(p => Math.abs((p - t) * width / (to - from)) <= 7);
      if (restart != null) {
        r.cursor.hidden = true;
        const stamp = bj(restart).toISOString().slice(5, 19).replace('T', ' ');
        tip.show(`<b>开机或重启</b><span>${esc(stamp)} · 关机时刻不明</span>`, (box.left - hostBox.left) * scale + px, tipY);
        return;
      }
      const marked = r.marks.findLast((m) => px >= m.left && px <= m.right);
      if (marked) t = (Math.max(spans[marked.index][0], from) + Math.min(spans[marked.index + 1]?.[0] ?? to, to)) / 2;
      const coarse = (to - from) / width > 3600;
      let a, b, content;
      if (coarse) {
        a = Math.max(dayStart(t), from); b = Math.min(dayStart(t) + 86400, to);
        const tot = new Array(states.length).fill(0);
        spans.forEach(([s0, s], i) => { const x0 = Math.max(s0, a), x1 = Math.min(spans[i + 1]?.[0] ?? to, b); if (x1 > x0 && states[s]) tot[s] += x1 - x0; });
        const top = tot.map((v, i) => [v, i]).filter(([v]) => v >= 60).sort((p, q) => q[0] - p[0]).slice(0, 3);
        content = `<b>${esc(md(a))} ${esc(weekday(a))}</b>${top.map(([v, i]) => `<span>${chip(color(states[i].hue))}${esc(sp(states[i].label))} ${esc(dur(v))}</span>`).join('')}`;
      } else {
        let lo = 0, hi = spans.length - 1;
        while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (spans[mid][0] <= t) lo = mid; else hi = mid - 1; }
        const s = spans[lo][1], st = states[s];
        a = Math.max(spans[lo][0], from); b = Math.min(spans[lo + 1]?.[0] ?? to, to);
        if (!st || t < spans[0][0]) { hide(); return; }
        const sameDay = dayStart(a) === dayStart(b - 1);
        content = `<span>${chip(color(st.hue))}<b>${esc(sp(st.label))}</b></span><span>${esc(sameDay ? `${hm(a)}–${b >= to && !opts.actualEnd && !isOffline() ? '现在' : hm(b)}` : `${md(a)} ${hm(a)} – ${b >= to && !opts.actualEnd && !isOffline() ? '现在' : `${md(b)} ${hm(b)}`}`)}</span><span>${esc(dur(b - a))}</span>`;
      }
      const x0 = ((a - from) / (to - from)) * width, x1 = ((b - from) / (to - from)) * width;
      r.cursor.hidden = false;
      r.cursor.style.left = `${x0}px`;
      r.cursor.style.width = `${Math.max(x1 - x0, 2)}px`;
      tip.show(content, (box.left - hostBox.left) * scale + (x0 + x1) / 2, tipY);
    }
    function hide() { tip.hide(); for (const r of rows) r.cursor.hidden = true; }
    for (const r of rows) {
      window.LiveUI.pointing(r.plot, (e) => at(r, e), hide);
    }
    // 指图例：横带上只亮这一种；点一下固定只亮这一种，再点同一项取消（键盘回车、空格一样）
    const pick = (id) => { if (focus === id) return; focus = id; legend.querySelectorAll('.vz-legend__item').forEach((li) => li.classList.toggle('is-dim', id != null && li.dataset.state !== id)); for (const r of rows) draw(r); };
    const show = () => pick(hovered ?? pinned);
    const itemOf = (e) => { const li = e.target.closest?.('.vz-legend__item'); return li && !li.classList.contains('is-static') ? li : null; };
    function toggle(li) {
      const id = li.dataset.state;
      pinned = pinned === id ? null : id;
      // 刚取消时鼠标还停在这一项上：先不按“指着”再亮它，挪开再回来才算
      hovered = null; muted = pinned ? null : id;
      legend.querySelectorAll('.vz-legend__item[role="button"]').forEach((n) => { const on = n.dataset.state === pinned; n.classList.toggle('is-picked', on); n.setAttribute('aria-pressed', String(on)); });
      show();
    }
    legend.addEventListener('pointerover', (e) => { const id = itemOf(e)?.dataset.state ?? null; if (id !== muted) { muted = null; hovered = id; } show(); });
    legend.addEventListener('pointerleave', () => { hovered = muted = null; show(); });
    legend.addEventListener('focusin', (e) => { if (e.target.matches?.(':focus-visible')) { hovered = itemOf(e)?.dataset.state ?? null; show(); } });
    legend.addEventListener('focusout', () => { hovered = null; show(); });
    legend.addEventListener('click', (e) => { const li = itemOf(e); if (li) toggle(li); });
    legend.addEventListener('keydown', (e) => { const li = (e.key === 'Enter' || e.key === ' ') && itemOf(e); if (li) { e.preventDefault(); toggle(li); } });

    return {
      set(payload) {
        states = (payload?.states || []).map((s, i) => ({ ...s, hue: s.hue || STATE_HUE[s.id] || ORDER[i % ORDER.length] }));
        for (const r of rows) {
          prep(r, payload?.rows?.[r.key]);
          waitBox(r.plot, r.d ? '' : window.LiveUI.collectionText());
        }
        html(legend, rows.some((r) => r.d) ? legendHtml() : '');
        W = 0;
        measure();
        for (const r of rows) if (r.d) { r.plot.classList.remove('is-in'); void r.plot.offsetWidth; r.plot.classList.add('is-in'); }
      },
      wait(text) { for (const r of rows) { r.d = null; draw(r); axis(r); waitBox(r.plot, text); } html(legend, ''); },
    };
  }

  // ================= 热力图：一天一行、一小时一格 =================
  function heatmap(host, opts = {}) {
    // 默认暖色（ramp: 'warm'）；给 ramp: 'hue' 才用单一颜色 hue 由浅到深（旧样子）
    const c = color(opts.hue || 'teal'), max = opts.max || 60, what = opts.what || '用了', isWarm = (opts.ramp || 'warm') === 'warm';
    const fill = (a) => (isWarm ? rose(a) : `color-mix(in srgb, ${c} ${(a * 100).toFixed(1)}%, rgb(20 20 19 / .035))`);
    host.classList.add('vz-heat');
    host.classList.toggle('vz-heat--warm', isWarm);
    host.style.setProperty('--c', c);
    host.innerHTML = `<div class="vz-heat__wrap"><div class="vz-heat__grid"></div></div><div class="vz-heat__key"><span>少</span>${(isWarm ? [.38, .53, .68, .84, 1] : [.2, .4, .6, .8, 1]).map((a) => `<i style="background:${fill(a)}"></i>`).join('')}<span>多</span></div>`;
    const grid = host.querySelector('.vz-heat__grid');
    const tip = tipper(host);
    waitBox(grid, '正在读');
    let days = [];
    grid.addEventListener('pointerover', (e) => {
      const cell = e.target.closest('.vz-heat__cell');
      if (!cell) { tip.hide(); return; }
      const d = days[cell.dataset.d], h = Number(cell.dataset.h), v = d.minutes[h];
      const g = cell.getBoundingClientRect(), b = host.getBoundingClientRect();
      tip.show(`<b>${esc(d.label)}</b><span>${pad2(h)}:00–${pad2(h + 1)}:00</span><span>${v == null ? window.LiveUI.collectionText() : v ? `${what} ${Math.round(v)} 分钟` : '没用'}</span>`, g.left - b.left + g.width / 2, g.top - b.top - 34);
    });
    grid.addEventListener('pointerleave', () => tip.hide());
    return {
      set(payload) {
        const list = payload?.days || [];
        if (!list.length || isOffline() && !payload?.minutes?.some((d) => d.some((v) => v != null))) { grid.innerHTML = ''; waitBox(grid, payload ? '没有记录' : window.LiveUI.collectionText()); return; }
        const today = list.at(-1);
        days = list.map((s, i) => { const l = dayLabel(s); return { label: s === today && opts.today ? `今天 ${l.wd}` : `${l.md} ${l.wd}`, wd: l.wd, md: l.md, minutes: payload.minutes?.[i] || [] }; });
        const head = `<span></span>${Array.from({ length: 24 }, (_, h) => `<span class="vz-heat__h">${h % 3 ? '' : h}</span>`).join('')}`;
        const body = days.map((d, i) => `<span class="vz-heat__day${/周[六日]/.test(d.wd) ? ' is-weekend' : ''}">${esc(i === days.length - 1 && opts.today ? '今天' : d.md)} <small>${esc(d.wd)}</small></span>${Array.from({ length: 24 }, (_, h) => {
          const v = d.minutes[h];
          if (v == null) return '<i class="vz-heat__cell is-none"></i>';
          if (v <= 0) return `<i class="vz-heat__cell is-zero" data-d="${i}" data-h="${h}"></i>`;
          const a = (isWarm ? .38 : .2) + (isWarm ? .62 : .8) * Math.min(v / max, 1) ** .85;
          return `<i class="vz-heat__cell" data-d="${i}" data-h="${h}" style="--a:${a.toFixed(3)};background:${fill(a)}"></i>`;
        }).join('')}`).join('');
        waitBox(grid, '');
        html(grid, head + body);
      },
      wait(text) { grid.innerHTML = ''; waitBox(grid, text); },
    };
  }

  // ================= 柱子：叠起来或并排 =================
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;
  function niceHours(maxSec, n) {
    const hrs = maxSec / 3600, raw = hrs / n, p = 10 ** Math.floor(Math.log10(raw || 1)), f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p * 3600;
  }
  function niceAny(max, n) {
    const raw = max / n, p = 10 ** Math.floor(Math.log10(raw || 1)), f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  function bars(host, opts) {
    const id = `vb${++uid}`, series = opts.series.map((s, i) => ({ ...s, color: color(s.hue, i) }));
    const unit = opts.unit ?? '秒', timeUnit = isTime(unit);
    const formatValue = opts.formatValue ?? fmt;
    const LEFT = unit === 'GB' ? 90 : 46, PAD = { left: LEFT, top: 10, bottom: 4 };
    host.classList.add('chart', 'vz-bars');
    host.innerHTML = `<div class="chart__head"><span class="chart__name">${esc(opts.title || '')}</span><span class="chart__vals"></span></div>
      <div class="vz-bars__plot"><svg class="vz-bars__svg" aria-hidden="true"></svg><div class="chart__axis" aria-hidden="true"></div></div><div class="vz-bars__x"></div>`;
    const vals = host.querySelector('.chart__vals'), plot = host.querySelector('.vz-bars__plot'), svg = plot.firstElementChild, xs = host.querySelector('.vz-bars__x'), axisEl = host.querySelector('.chart__axis');
    waitBox(plot, '正在读');
    let data = null, hover = null, W = 0, H = 0;

    function readout(i) {
      if (!data) { vals.innerHTML = ''; return; }
      const k = i ?? data.labels.length - 1, lab = data.labels[k];
      const raw = i == null ? (data.at || lab?.title || lab?.text) : (lab?.title || lab?.text), t = /^\d{4}-\d{2}-\d{2}(?:T|$)/.test(raw || '') ? sec(raw.length === 10 ? `${raw}T00:00:00+08:00` : raw) : NaN;
      const when = Number.isFinite(t) ? `${md(t)}${raw.length > 10 ? ' ' + hm(t) : ''}` : raw;
      html(vals, `<span class="chart__val vz-bars__when">${esc(when || '')}</span>${series.map((s) => `<span class="chart__val" style="--c:${s.color}"><i class="chart__key${s.soft ? ' is-soft' : ''}"></i>${series.length > 1 ? `<span class="chart__label">${esc(s.label)}</span>` : ''}<b${data.values[s.id]?.[k] == null ? ' style="font-size:13px;font-weight:400;color:var(--muted)"' : ''}>${data.quality?.[s.id]?.[k] === 'partial' && data.values[s.id]?.[k] != null ? '至少 ' : ''}${esc(formatValue(data.values[s.id]?.[k], s.unit ?? unit) ?? opts.missingText ?? window.LiveUI.collectionText(s.label, data))}</b>${data.notes?.[s.id]?.[k] ? `<small style="font-size:12px">${esc(data.notes[s.id][k])}</small>` : ''}</span>`).join('')}`);
      xs.querySelectorAll('.vz-bars__lab').forEach((n, j) => n.classList.toggle('is-on', j === i));
    }
    const el = (tag, attrs) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
    function bar(x, y, w, h, r) {
      if (h <= 0) return '';
      r = Math.min(r, w / 2, h);
      return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
    }
    function draw() {
      svg.replaceChildren();
      if (!data || !W || !H) return;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const n = data.labels.length, base = H - PAD.bottom;
      const totals = data.labels.map((_, i) => (opts.stack ? series.reduce((a, s) => a + (data.values[s.id]?.[i] || 0), 0) : Math.max(...series.map((s) => data.values[s.id]?.[i] || 0))));
      const smallGB = unit === 'GB' && Math.max(...totals, 0) < .01;
      const ceil = opts.ceil ?? opts.max;
      const top = Math.max(Number.isFinite(ceil) ? ceil : 0, timeUnit ? Math.max(...totals, unit === '分钟' ? 60 : 3600) : Math.max(...totals, 0) || 1);
      const binary = unit === 'B' || unit === 'B/s' ? [2 ** 40, 2 ** 30, 2 ** 20, 1024].find((d) => top >= d) || 1 : 1;  // 字节刻度按 1024 取整
      const step = opts.axisStep ?? (smallGB && !ceil ? .01 : timeUnit ? (unit === '分钟' ? niceHours(top * 60, 4) / 60 : niceHours(top, 4)) : Math.max(unit === 'GB' ? .01 : 0, ['次', '人', '个', '项', '份'].includes(unit) ? Math.ceil(niceAny(top, 4)) : niceAny(top / binary, 4) * binary));
      const max = smallGB && !ceil ? .01 : Math.max(Math.ceil(top * (Number.isFinite(ceil) ? 1 : 1.08) / step) * step, step);
      const y = (v) => base - (v / max) * (base - PAD.top);
      // 纵轴字先量宽：写不下（如“30 小时”“37.3 GB”）就把左边留宽，不让字挤出图外
      const yText = (v) => !v ? unit === 'GB' ? '0 GB' : '0' : timeUnit ? `${+(toSec(v, unit) / 3600).toFixed(1)} 小时` : opts.axisUnit === '' ? String(+v.toFixed(2)) : formatValue(v, unit);
      const yTexts = []; for (let v = 0; v <= max; v += step) yTexts.push(yText(v));
      axisEl.innerHTML = yTexts.map(t => `<span class="chart__y" style="visibility:hidden;width:auto">${esc(t)}</span>`).join('');
      PAD.left = Math.max(LEFT, Math.ceil(Math.max(0, ...[...axisEl.children].map(c => c.offsetWidth))) + 12);
      const band = (W - PAD.left) / n;
      const defs = el('defs', {});
      defs.innerHTML = series.map((s) => `<linearGradient id="${id}-${esc(s.id)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity="${s.soft ? .42 : .92}"/><stop offset="1" stop-color="${s.color}" stop-opacity="${s.soft ? .16 : .38}"/></linearGradient>`).join('');
      svg.append(defs);
      const grid = el('g', { class: 'chart__grid' }), ys = [];
      for (let v = 0; v <= max; v += step) {
        const yy = Math.round(y(v)) + .5;
        grid.append(el('line', { x1: PAD.left, x2: W, y1: yy, y2: yy, class: v ? '' : 'is-base' }));
        ys.push(`<span class="chart__y" style="top:${yy}px;width:${PAD.left - 10}px">${esc(yText(v))}</span>`);
      }
      svg.append(grid);
      axisEl.innerHTML = ys.join('');
      const hl = el('rect', { class: 'vz-bars__hl', y: PAD.top - 6, height: base - PAD.top + 6, rx: 8, width: band - 4 });
      svg.append(hl);
      const body = el('g', { class: 'vz-bars__body' });
      const bw = opts.stack ? Math.min(band * .52, 26) : Math.min(band * .3, 13), gap = opts.stack ? 0 : 3;
      data.labels.forEach((_, i) => {
        const cx = PAD.left + band * i + band / 2;
        let acc = 0;
        series.forEach((s, j) => {
          const v = data.values[s.id]?.[i];
          if (v == null || v <= 0) return;
          let x, y0, y1, d;
          if (opts.stack) {
            x = cx - bw / 2; y0 = y(acc); y1 = y(acc + v); acc += v;
            const last = series.slice(j + 1).every((t) => !(data.values[t.id]?.[i] > 0));
            d = last ? bar(x, y1, bw, y0 - y1, 6) : `M${x},${y0}V${y1}H${x + bw}V${y0}Z`;
          } else {
            x = cx - series.length * (bw + gap) / 2 + j * (bw + gap) + gap / 2; y1 = y(v);
            d = bar(x, y1, bw, base - y1, 6);
          }
          body.append(el('path', { d, fill: `url(#${id}-${s.id})` }));
        });
      });
      svg.append(body);
      xs.style.paddingLeft = `${PAD.left}px`;
      const labelStep = opts.labelWidth ? Math.max(1, Math.ceil(opts.labelWidth / band)) : 1;
      html(xs, data.labels.map((l, i) => `<span class="vz-bars__lab">${(n - 1 - i) % labelStep ? '' : `${esc(l.text)}${l.sub ? `<small>${esc(l.sub)}</small>` : ''}`}</span>`).join(''));
      point(hover);
    }
    function point(i) {
      hover = i;
      const hl = svg.querySelector('.vz-bars__hl');
      if (hl && data) {
        const band = (W - PAD.left) / data.labels.length;
        hl.classList.toggle('is-on', i != null);
        if (i != null) hl.setAttribute('x', PAD.left + band * i + 2);
      }
      readout(i);
    }
    window.LiveUI.pointing(plot, (e) => {
      if (!data) return;
      const r = svg.getBoundingClientRect(), band = (W - PAD.left) / data.labels.length;
      const i = Math.floor(((e.clientX - r.left) * W / r.width - PAD.left) / band);
      point(i >= 0 && i < data.labels.length ? i : null);
    }, () => point(null));
    function measure() { const w = Math.round(plot.clientWidth), h = Math.round(plot.clientHeight); if (w === W && h === H) return; W = w; H = h; draw(); }
    new ResizeObserver(measure).observe(plot);
    return {
      set(payload) {
        data = payload?.labels?.length && (!isOffline() || series.some((s) => payload.values?.[s.id]?.some((v) => v != null))) ? payload : null;
        waitBox(plot, data ? '' : payload ? '没有记录' : window.LiveUI.collectionText());
        if (!data) { svg.replaceChildren(); axisEl.innerHTML = ''; xs.innerHTML = ''; vals.innerHTML = ''; return; }
        W = 0; measure();
        plot.classList.remove('is-in'); void plot.offsetWidth; plot.classList.add('is-in');
      },
      wait(text) { data = null; svg.replaceChildren(); axisEl.innerHTML = ''; xs.innerHTML = ''; vals.innerHTML = ''; waitBox(plot, text); },
    };
  }

  // ================= 占比环 =================
  function share(host, opts = {}) {
    const R = 64, SW = 18, SIZE = 2 * R + SW + 18, C = SIZE / 2, unit = opts.unit ?? '秒', sid = `vs${++uid}`;
    host.classList.add('vz-share');
    host.innerHTML = `<div class="vz-share__ring"><svg viewBox="0 0 ${SIZE} ${SIZE}" aria-hidden="true"><defs></defs><g class="vz-share__halo"></g><g class="vz-share__arcs"></g></svg><p class="vz-share__mid"></p></div><ul class="vz-share__list"></ul>`;
    const defs = host.querySelector('defs');
    const ring = host.querySelector('.vz-share__ring'), halo = host.querySelector('.vz-share__halo'), arcs = host.querySelector('.vz-share__arcs'), mid = host.querySelector('.vz-share__mid'), list = host.querySelector('.vz-share__list');
    waitBox(ring, '正在读');
    let items = [], total = 0, focus = null;
    const centerValue = () => Number.isFinite(opts.centerValue) && opts.centerValue >= 0 ? opts.centerValue : null;
    const arc = (a0, a1) => {
      const p = (a) => [C + R * Math.sin(a), C - R * Math.cos(a)];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      return `M${x0.toFixed(2)},${y0.toFixed(2)}A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
    };
    function centre() {
      const it = items.find((x) => x.id === focus);
      html(mid, it ? `<em>${fmtHtml(it.value, unit)}</em><span>${esc(sp(it.label))} · ${Math.round((it.value / total) * 100)}%</span>` : `<em>${fmtHtml(centerValue() ?? total, unit)}</em><span>${esc(opts.center || '一共')}</span>`);
      host.querySelectorAll('[data-id]').forEach((n) => n.classList.toggle('is-dim', focus != null && n.dataset.id !== focus));
    }
    function draw() {
      // 每段之间留一道细缝；太小的段至少画 1.5 度，看得见
      const gap = items.length > 1 ? .045 : 0, least = .026;
      const spans = items.map((it) => Math.max((it.value / total) * Math.PI * 2, least + gap));
      const k = (Math.PI * 2) / spans.reduce((a, b) => a + b, 0);
      let a = 0, out = '', grads = '';
      items.forEach((it, i) => {
        const span = spans[i] * k, a0 = a + gap / 2, a1 = a + span - gap / 2;
        // 弧用同色渐变：起头浅一点、走到尾巴是本色
        const p0 = [C + R * Math.sin(a0), C - R * Math.cos(a0)], p1 = [C + R * Math.sin(a1), C - R * Math.cos(a1)];
        grads += `<linearGradient id="${sid}-${i}" gradientUnits="userSpaceOnUse" x1="${p0[0].toFixed(1)}" y1="${p0[1].toFixed(1)}" x2="${p1[0].toFixed(1)}" y2="${p1[1].toFixed(1)}"><stop offset="0" stop-color="${mix(it.color, .45)}"/><stop offset="1" stop-color="${it.color}"/></linearGradient>`;
        const paint = items.length === 1 ? it.color : `url(#${sid}-${i})`;
        out += items.length === 1 ? `<circle data-id="${esc(it.id)}" cx="${C}" cy="${C}" r="${R}" stroke="${paint}"/>` : `<path data-id="${esc(it.id)}" d="${arc(a0, a1)}" stroke="${paint}"/>`;
        a += span;
      });
      defs.innerHTML = grads;
      arcs.innerHTML = out;
      halo.innerHTML = '';
    }
    host.addEventListener('pointerover', (e) => { const id = e.target.closest('[data-id]')?.dataset.id ?? null; if (id !== focus) { focus = id; centre(); } });
    host.addEventListener('pointerleave', () => { focus = null; centre(); });
    return {
      set(payload) {
        items = (payload || []).filter((x) => x.value > 0).map((x, i) => ({ ...x, color: color(x.hue || CAT_HUE[x.id], i) })).sort((p, q) => q.value - p.value);
        total = items.reduce((a, x) => a + x.value, 0);
        if (!items.length) {
          defs.innerHTML = arcs.innerHTML = halo.innerHTML = mid.innerHTML = list.innerHTML = '';
          const known = centerValue() != null;
          waitBox(ring, known ? '' : payload ? '没有记录' : window.LiveUI.collectionText());
          if (known) centre();
          else if (isOffline() && payload?.some(x => x.value === 0)) ring.querySelector(':scope > .vz-wait').textContent = fmt(0, unit);
          return;
        }
        waitBox(ring, '');
        draw();
        html(list, items.map((x) => `<li class="vz-share__row" data-id="${esc(x.id)}">${chip(x.color)}<span class="vz-share__name">${esc(sp(x.label))}</span><span class="vz-share__v">${esc(fmt(x.value, unit))}</span><span class="vz-share__pct">${Math.round((x.value / total) * 100)}%</span></li>`).join(''));
        centre();
      },
      wait(text) { items = []; arcs.innerHTML = halo.innerHTML = ''; mid.innerHTML = ''; list.innerHTML = ''; waitBox(ring, text); },
    };
  }

  // ================= 排行：一行一个，行里一条细比例条 =================
  // 一行一个：名字前一颗圆形首字小章（opts.mark 或这一行给 mark），比例条是整行背后一条很淡的胶囊（bar: false 不画）；
  // 第一名那行高一点、字大一号（top: false 不放大）；值按 unit 写（行自己的 unit 优先），给了 text 就写 text。
  function rank(host, opts = {}) {
    const show = opts.bar === false || opts.batch ? opts.show ?? 5 : Infinity;
    const merge = source => window.LiveUI?.mergePrivateRows?.(source, {
      value: r => opts.keepNameOnlyRows && Number.isFinite(r.value) ? null : r.name,
    }) ?? source;
    host.classList.add('vz-rank');
    host.classList.toggle('vz-rank--pill', opts.bar !== false);
    // 文字列表和分批排行可以展开，其他排行直接显示。
    host.innerHTML = `<ul class="vz-rank__list"></ul>${show === Infinity ? '' : '<div class="fold"><div><ul class="vz-rank__list"></ul></div></div><button class="more vz-rank__more" type="button" hidden></button>'}`;
    const [top, rest] = host.querySelectorAll('.vz-rank__list'), btn = host.querySelector('.more'), box = host.querySelector('.fold');
    if (btn) window.LiveUI?.fold(btn, box);
    const hasMore = () => opts.hasMore?.() ?? null;
    const next = btn && opts.batch ? document.createElement('button') : null;
    if (next) {
      next.type = 'button'; next.className = 'more vz-rank__more'; next.hidden = true;
      rest.after(next);
      next.addEventListener('click', () => {
        if (hasMore() !== null) opts.loadMore?.();
        else renderBatch(Math.min(rows.length - show, shown + opts.batch), true);
      });
    }
    let first = true, moreText = '', rows = [], max = 0, shown = 0;
    let expanded = btn?.getAttribute('aria-expanded') === 'true', busy = false;
    const label = () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      const changed = expanded !== open;
      expanded = open;
      if (box.classList.contains('is-open') !== open) { box.classList.toggle('is-open', open); box.inert = !open; box.setAttribute('aria-hidden', String(!open)); }
      if (next && !open && shown) renderBatch(0);
      else if (next && hasMore() === null && open && !shown) renderBatch(batchSize(true));
      else updateNext();
      html(btn, `${esc(open ? '收起' : moreText)} <span class="more__chev">›</span>`);
      if (changed) opts.onToggle?.(open);
    };
    if (btn) new MutationObserver(label).observe(btn, { attributes: true, attributeFilter: ['aria-expanded'] });
    let rowsLen = 0;
    const markOf = r => r.private_count || /^\s*[\p{Extended_Pictographic}\p{Regional_Indicator}]/u.test(sp(r.name)) ? null : r.mark ?? (opts.mark ? [...sp(r.name || '?').trim()][0] : null);
    const row = (r, max, i) => {
      if (r.private_count) return { key: r.key, cls: 'vz-rank__row vz-rank__row--private', html: window.LiveUI.privateSummary(r.private_count) };
      const c = color(r.hue, i), m = markOf(r);
      const name = field(r.name, opts.name || opts.title || '程序', 'title');
      const marker = name !== esc(sp(r.name)) ? field(r.name, opts.name || '程序', 'body', true) : '';
      const note = marker.includes('live-mark') ? marker : '';
      const sub = r.sub;
      return {
        key: r.key,
        cls: `vz-rank__row${i === 0 && opts.top !== false && rowsLen > 1 ? ' is-top' : ''}`,
        html: `${opts.bar === false ? '' : `<span class="vz-rank__bar" aria-hidden="true"><i style="--c:${c};--v:${max ? Math.max((r.value || 0) / max, 0).toFixed(4) : 0}"></i></span>`}${m ? `<span class="vz-mark" style="--c:${c}" aria-hidden="true">${esc(String(m).toUpperCase())}</span>` : ''}<span class="vz-rank__name" title="${esc(sp(r.name))}">${r.time ? `<span class="vz-rank__t">${esc(r.time)}</span>` : ''}<span class="vz-rank__label">${name}</span>${sub || note ? `<small>${[sub ? field(sub) : '', note].filter(Boolean).join(' · ')}</small>` : ''}</span><span class="vz-rank__v">${missingHtml(r.text ?? fmt(r.value, r.unit ?? opts.unit) ?? window.LiveUI.collectionText(r.name, r))}</span>${opts.trailing?.(r) || ''}`,
      };
    };
    const markup = (r) => `<li class="${r.cls}" data-key="${esc(r.key)}">${r.html}</li>`;
    const put = (ul, rows, animate = !first && !next) => (window.LiveUI && opts.animate !== false
      ? window.LiveUI.list(ul, rows, { animate }) : html(ul, rows.map(markup).join(''), false));
    const empty = (text) => [{ key: 'none', cls: 'vz-rank__row vz-rank__row--empty', html: `<span class="vz-rank__none">${esc(emptyText(text))}</span>` }];
    const batchSize = (open) => open ? Math.min(Math.max(rows.length - show, 0), shown || opts.batch) : 0;
    function updateNext() {
      if (!next) return;
      const remote = hasMore();
      const left = remote === null ? rows.length - show - shown : opts.remaining?.();
      const count = left == null ? null : Math.min(opts.batch, Math.max(left, 0));
      next.hidden = !expanded || remote === false || count === 0;
      next.disabled = busy;
      btn.disabled = busy && !expanded;
      if (!next.hidden) next.textContent = count == null ? '继续显示' : `再显示 ${count} 条`;
    }
    function renderBatch(count, append = false) {
      const start = show + (append ? shown : 0);
      const entries = rows.slice(start, show + count).map((r, i) => row(r, max, start + i));
      if (append) rest.insertAdjacentHTML('beforeend', entries.map(markup).join(''));
      else put(rest, entries, false);
      shown = count;
      updateNext();
      if (append && next.hidden) btn.focus({ preventScroll: true });
    }
    function clearRest() {
      if (!btn) return;
      rows = []; btn.hidden = true;
      if (next) renderBatch(0);
      else put(rest, []);
    }
    return {
      set(source) {
        rows = merge(source);
        if (isOffline() && rows) rows = rows.filter((r) => r.private_count || r.value != null || r.text && !/还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读|保留上次读数/.test(r.text));
        if (!rows?.length) { put(top, empty(rows ? opts.empty || '没有记录' : opts.missing?.() || window.LiveUI.collectionText())); clearRest(); first = false; return; }
        max = opts.bar === false ? 0 : Math.max(...rows.map((r) => r.value || 0));
        rowsLen = rows.length;
        host.classList.toggle('has-mark', rows.some(markOf));
        put(top, rows.slice(0, show).map((r, i) => row(r, max, i)));
        if (!btn) { first = false; return; }
        if (next) renderBatch(batchSize(expanded && hasMore() === null));
        else put(rest, rows.slice(show).map((r, i) => row(r, max, i + show)));
        btn.hidden = rows.length <= show && !hasMore() && !expanded;
        const remaining = rows.reduce((n, r, i) => n + (i < show ? 0 : r.private_count || 1), 0);
        moreText = opts.more ? opts.more(remaining) : `还有 ${remaining} 个`;
        label();
        first = false;
      },
      wait(text) { put(top, empty(text)); clearRest(); },
      isOpen() { return expanded; },
      close() {
        if (!btn || !expanded) return;
        expanded = false;
        btn.setAttribute('aria-expanded', 'false');
        label();
      },
      setBusy(value) { busy = value; updateNext(); },
      append(source) {
        const list = merge(source);
        const focused = document.activeElement === next;
        rest.insertAdjacentHTML('beforeend', list.map((r, i) => markup(row(r, max, rowsLen + i))).join(''));
        rowsLen += list.length;
        shown += list.length;
        updateNext();
        if (focused && next.hidden) btn.focus({ preventScroll: true });
      },
    };
  }

  function lowerBoundHtml(meta, rendered) {
    const text = rendered.replace(/<[^>]*>/g, '').trim();
    return meta?.lower_bound === true && /\d/.test(text) && !/^(至少\s*|不到)/.test(text) ? `<small>至少 </small>${rendered}` : rendered;
  }

  function latestPoint(payload, id) {
    const s = payload?.series?.find(x => x.id === id);
    const p = s?.points?.findLast(([, value]) => Number.isFinite(value));
    return p ? { id, label: s.label, value: p[1], unit: s.unit, at: p[0] } : null;
  }
  function readingChart(host, config, { reading, sync }) {
    const chart = window.LiveChart.create(host, config);
    if (!reading) return chart;
    const release = () => sync ? sync.at(null) : chart.point(null);
    for (const type of ['pointerup', 'pointercancel']) host.querySelector('.chart__plot').addEventListener(type, release);
    return chart;
  }
  const missingReading = (meta, keepPlot = false) => `<span ${keepPlot ? 'style="color:var(--muted);font-weight:400"' : 'class="vz-none"'}>${esc(emptyText(window.LiveUI.collectionText(meta.label, meta)))}</span>`;
  function displayReading(reading, id, point, t, surface, meta) {
    const r = reading?.(id, point, t, surface);
    if (!r) return null;
    const missing = t != null && point?.value == null;
    const value = missing ? null : r.value, unit = r.unit ?? meta.unit ?? point?.unit;
    const number = Number.isFinite(value);
    const at = !missing && (r.text == null ? number : typeof r.text === 'string') ? typeof r.at === 'number' ? r.at : sec(r.at) : NaN;
    const series = meta.series?.find(s => s.id === id);
    const from = sec(series?.from ?? meta.from), to = sec(series?.to ?? meta.to);
    const short = !(to - from > 36 * 3600) && dayStart(at) === dayStart(Number.isFinite(to) ? to : Date.now() / 1000);
    const time = Number.isFinite(at) ? `<time data-reading-id="${esc(id)}" data-at="${at}">${r.dateOnly ? md(at).slice(-5) : short ? hm(at) : md(at).slice(-5) + ' ' + hm(at)}</time>` : '';
    const note = [time, field(r.caption)].filter(Boolean).join(' · ');
    const main = r.text != null ? field(r.text, '读数', 'body', true) : value == null ? missingReading(meta, true) : number
      ? surface === 'hero' || surface === 'weave' ? esc(fmt(value, unit)) : lowerBoundHtml(meta, fmtHtml(value, unit))
      : field(value, '读数', 'body', true);
    const singleLine = 'display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis';
    const valueStyle = missing ? 'display:block;white-space:normal;overflow-wrap:anywhere' : singleLine;
    return `<span class="vz-reading" style="display:grid;grid-template:${missing ? 'minmax(26px,auto)' : '26px'} 17px / minmax(0,1fr)"><span class="vz-reading__value" style="${valueStyle};line-height:26px">${main}</span><small class="vz-reading__caption" title="${esc(r.caption)}" style="${singleLine};font-size:12px;font-weight:400;line-height:17px;color:var(--muted)">${note}</small></span>`;
  }

  // ================= 数字块：名字在上，数在下（大字），一句小字，一条细条 =================
  function figures(host) {
    host.classList.add('vz-figs');
    html(host, `<p class="vz-wait">${emptyText('正在读')}</p>`);
    return {
      set(list) {
        if (isOffline() && list) list = list.filter((f) => f.value != null || f.text && !/还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读|保留上次读数/.test(f.text));
        if (!list || isOffline() && !list.length) { html(host, `<p class="vz-wait">${emptyText(window.LiveUI.collectionText())}</p>`); return; }
        html(host, list.map((f) => `<div class="vz-fig" data-key="${esc(f.key)}">
          <span class="vz-fig__k" title="${esc(sp(f.label))}">${field(f.label, '读数', 'label')}</span>
          <span class="vz-fig__v">${f.text != null ? lowerBoundHtml(f, readingHtml(f.text)) : f.value == null ? `<span class="vz-none">${window.LiveUI.collectionText(f.label, f)}</span>` : lowerBoundHtml(f, fmtHtml(f.value, f.unit))}</span>
          ${f.frac == null ? '' : `<span class="vz-fig__bar"><i style="--c:${color(f.hue)};--v:${Math.min(Math.max(f.frac, 0), 1).toFixed(4)}"></i></span>`}
          ${[].concat(f.sub || []).filter(Boolean).map((x) => `<span class="vz-fig__sub">${esc(sp(x))}</span>`).join('')}
          ${field(f.label, '读数', 'label') !== esc(sp(f.label)) ? `<span class="vz-fig__sub">${field(f.label, '读数', 'body', true)}</span>` : ''}
        </div>`).join(''));
      },
    };
  }


  // ================= 数字小格：名字 14px、大数字 22px、一条走势小线；点一格回调（换到大图），当前在大图上的那一格淡淡亮着 =================
  // set(list, payload)：list = [{ key, label, value?, unit?, text?, lines?: ['series id'], palette?, on? }]；
  // 没给 value/text 时取 payload 里 lines[0] 那条的最后一分钟；有 lines 就画走势小线（多条叠在一起）。
  function chips(host, opts = {}) {
    host.classList.add('vz-chips');
    const cells = new Map();
    let payload = null;
    host.addEventListener('click', (e) => {
      const b = e.target.closest('.vz-chip-cell');
      if (b && !b.disabled && host.contains(b)) opts.onPick?.(b.dataset.key);
    });
    function customValue(c, values = [], t = null) {
      if (!opts.reading) return null;
      const lines = c.lines?.length ? c.lines : [c.key];
      const meta = { ...payload, ...c };
      const entries = lines.map(line => {
        const id = line.id ?? line;
        const point = t == null ? latestPoint(payload, id) : values.find(v => v.id === id) ?? null;
        return { label: line.label || point?.label, point, override: displayReading(opts.reading, id, point, t, 'chip', meta) };
      });
      if (!entries.some(e => e.override != null)) return null;
      return entries.map(({label, point, override}) => `<span style="display:block">${entries.length > 1 && label ? field(label) + ' ' : ''}${override ?? (point?.value == null ? missingReading(meta) : fmtHtml(point.value, c.unit ?? point.unit))}</span>`).join('');
    }
    function valueHtml(c) {
      const custom = customValue(c);
      if (custom != null) return custom;
      if (c.text != null) return lowerBoundHtml(c, readingHtml(c.text));
      if (c.value != null) return lowerBoundHtml(c, fmtHtml(c.value, c.unit));
      const ids = (c.lines || []).map((l) => l.id ?? l);
      const got = ids.map(id => latestPoint(payload, id)).filter(Boolean);
      if (!got.length) return `<span class="vz-none">${emptyText(window.LiveUI.collectionText(c.label, { ...payload, ...c }))}</span>`;
      return got.slice(0, 2).map((g) => lowerBoundHtml(c, fmtHtml(g.value, c.unit ?? g.unit))).join('<i class="vz-chip-cell__dot">·</i>');
    }
    return {
      set(list, next) {
        if (next !== undefined) payload = next;
        if (isOffline() && list) list = list.filter((c) => c.value != null || c.text && !/还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读|保留上次读数/.test(c.text) || c.lines?.some(l => latestPoint(payload, l.id ?? l)));
        if (!list || isOffline() && !list.length) { host.innerHTML = `<p class="vz-wait">${emptyText(window.LiveUI.collectionText())}</p>`; host.dataset.keys = ''; cells.clear(); return; }
        const keys = opts.reading ? JSON.stringify(list.map(c => [c.key, c.lines])) : list.map(c => c.key).join();
        if (host.dataset.keys !== keys) {
          host.dataset.keys = keys;
          for (const c of cells.values()) c.chart?.destroy?.();
          cells.clear();
          host.innerHTML = list.map((c) => `<button class="vz-chip-cell" type="button" data-key="${esc(c.key)}"><span class="vz-chip-cell__k" title="${esc(sp(c.label))}">${field(c.label, '读数', 'label')}</span><span class="vz-chip-cell__v"></span><span class="vz-chip-cell__spark"></span></button>${field(c.label, '读数', 'label') !== esc(sp(c.label)) ? `<span class="vz-chip-cell__note">${field(c.label, '读数', 'body', true)}</span>` : ''}`).join('');
          for (const c of list) {
            const b = host.querySelector(`[data-key="${CSS.escape(c.key)}"]`);
            const lines = (c.lines || []).map((l, i) => ({ id: l.id ?? l, label: l.label ?? '', hue: l.hue }));
            const cell = { b, v: b.querySelector('.vz-chip-cell__v'), chart: null, item: c };
            if (lines.length && window.LiveChart) cell.chart = readingChart(b.querySelector('.vz-chip-cell__spark'), { size: 'spark', lines, palette: c.palette || opts.palette, sync: opts.sync, ceil: c.ceil, floor: c.floor ?? 'auto',
              onRead: (values, t) => {
                const current = cell.item;
                const one = v => v.value == null ? `<span class="vz-none">${emptyText(window.LiveUI.collectionText(current.label, { ...payload, ...current, ...v }))}</span>` : fmtHtml(v.value, current.unit ?? v.unit);
                html(cell.v, t == null ? valueHtml(current) : customValue(current, values, t) ?? (!values.length ? `<span class="vz-none">${emptyText(window.LiveUI.collectionText(current.label, { ...payload, ...current }))}</span>` : current.text != null
                  ? esc(sp(values.map(v => `${values.length > 1 ? v.label + ' ' : ''}${v.value == null ? emptyText(window.LiveUI.collectionText(current.label, { ...payload, ...current, ...v })) : v.text}`).join('\n')))
                  : values.map(one).join('<i class="vz-chip-cell__dot">·</i>')));
              } }, opts);
            cells.set(c.key, cell);
          }
        }
        for (const c of list) {
          const cell = cells.get(c.key);
          cell.item = c;
          cell.b.disabled = c.liveOnly === true;
          if (opts.reading) {
            const label = cell.b.querySelector('.vz-chip-cell__k');
            label.title = sp(c.label); html(label, field(c.label, '读数', 'label'), false);
          }
          html(cell.v, valueHtml(c));
          cell.b.classList.toggle('is-on', !!c.on);
          cell.b.setAttribute('aria-pressed', String(!!c.on));
          if (cell.chart && payload) { cell.chart.set(payload); if (opts.reading) cell.chart.point(null); }
        }
      },
      wait(text) { host.innerHTML = `<p class="vz-wait">${esc(emptyText(text))}</p>`; host.dataset.keys = ''; cells.clear(); },
    };
  }

  // ================= 竖的小时间线：左边时刻、一颗小点、右边一句话；点一行回调 =================
  function moments(host, opts = {}) {
    host.classList.add('vz-moments');
    const show = opts.show ?? 5;
    host.innerHTML = '<ol class="vz-moments__list"></ol><button class="more" type="button" hidden></button><div class="fold"><div><ol class="vz-moments__list"></ol></div></div>';
    const [top, rest] = host.querySelectorAll('.vz-moments__list'), btn = host.querySelector('.more'), box = host.querySelector('.fold');
    window.LiveUI?.fold(btn, box);
    let picked = null;
    host.addEventListener('click', (e) => {
      const b = e.target.closest('[data-moment]');
      if (!b || !opts.onPick) return;
      picked = picked === b.dataset.moment ? null : b.dataset.moment;
      host.querySelectorAll('[data-moment]').forEach((n) => { n.classList.toggle('is-picked', n.dataset.moment === picked); n.setAttribute('aria-pressed', String(n.dataset.moment === picked)); });
      opts.onPick(picked);
    });
    const item = (m) => `<li class="vz-moment"><${opts.onPick ? 'button type="button"' : 'div'} class="vz-moment__hit${m.key === picked ? ' is-picked' : ''}" data-moment="${esc(m.key)}"${opts.onPick ? ` aria-pressed="${m.key === picked}"` : ''}>
        <span class="vz-moment__t">${m.day ? `<small>${esc(m.day)}</small>` : ''}${esc(m.time || '')}</span><i class="vz-moment__dot" style="--c:${color(m.hue || 'pink')}"></i>
        <span class="vz-moment__text"><b>${esc(sp(m.title || ''))}</b>${m.text ? `<span>${esc(sp(m.text))}</span>` : ''}</span>${m.side ? `<span class="vz-moment__side">${m.side}</span>` : ''}
      </${opts.onPick ? 'button' : 'div'}></li>`;
    return {
      set(list) {
        if (!list?.length) { html(top, `<li class="vz-moment vz-moment--empty">${esc(emptyText(list ? opts.empty || '没有记录' : window.LiveUI.collectionText()))}</li>`); html(rest, ''); btn.hidden = true; return; }
        html(top, list.slice(0, show).map(item).join(''));
        html(rest, list.slice(show).map(item).join(''));
        btn.hidden = list.length <= show;
        html(btn, `${esc(opts.more ? opts.more(list.length - show) : `更早的 ${list.length - show} 个`)} <span class="more__chev">›</span>`);
      },
      wait(text) { html(top, `<li class="vz-moment vz-moment--empty">${esc(emptyText(text))}</li>`); btn.hidden = true; },
    };
  }

  // ================= 审计清单：按类别一行（今天几次、最多的几个程序做成小药丸）；是 0 的并成一行；点一类展开明细 =================
  function audit(host, opts = {}) {
    host.classList.add('vz-audit');
    host.addEventListener('click', (e) => {
      const head = e.target.closest('.vz-audit__head');
      if (!head) return;
      const li = head.parentElement, open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open);
      head.setAttribute('aria-expanded', String(open));
      li.querySelector('.fold')?.classList.toggle('is-open', open);
    });
    return {
      set(list) {
        if (isOffline() && list) list = list.filter((c) => c.count != null);
        if (!list || isOffline() && !list.length) { html(host, `<p class="vz-wait">${emptyText(window.LiveUI.collectionText())}</p>`); return; }
        const busy = list.filter((c) => !c.lower && c.count > 0).sort((a, b) => (b.level ? 1 : 0) - (a.level ? 1 : 0) || b.count - a.count);
        const zero = list.filter((c) => !c.lower && !(c.count > 0));
        const when = c => c.when ?? (opts.when || '今天'), unit = c => c.unit ?? '次';
        const windows = new Set(zero.map(when)), zeroWhen = windows.size === 1 ? [...windows][0] : '';
        const row = (c) => `<li class="vz-audit__row${c.level ? ' is-warn' : ''}" data-key="${esc(c.key)}"${c.lower ? ' data-lower' : ''}>
          <button class="vz-audit__head" type="button" aria-expanded="false">${window.LiveUI.status(c, { small: true }).lamp || '<span></span>'}
            <span class="vz-audit__name">${esc(sp(c.name))}${[c.when, c.gap].filter(Boolean).map(s => `<small class="stat-gap">${esc(s)}</small>`).join('')}</span><span class="vz-audit__n">${esc(c.scope ?? (c.when == null ? when(c) : ''))} <b>${c.lower ? '至少 ' : ''}${esc(String(c.count))}</b> ${esc(unit(c))}</span>
            <span class="vz-audit__pills">${(c.top || []).slice(0, 3).map((t) => `<span class="vz-pill">${esc(sp(t.name))}${t.text || t.count != null ? ` ×${esc(t.text ?? String(t.count))}` : ''}</span>`).join('')}</span><span class="vz-audit__chev">›</span></button>
          <div class="fold"><div>${c.detail ? `<p class="vz-note">${esc(c.detail)}</p>` : ''}<ul class="vz-audit__rows">${(opts.rows ? opts.rows(c) : (c.rows || []).map((r) => `<li><span class="vz-audit__t">${esc(r.time || '')}</span><span>${esc(sp(r.name || ''))}</span><span class="vz-audit__c">${r.count != null ? `${esc(String(r.count))} ${esc(unit(c))}` : ''}</span></li>`).join('')) || '<li class="vz-audit__none">没有明细</li>'}</ul></div></div></li>`;
        const zeroNames = zero.map(c => [sp(c.name), windows.size > 1 && when(c), c.unit != null && `${c.scope ? c.scope + ' ' : ''}0 ${unit(c)}`].filter(Boolean).join(' · '));
        html(host, `<ul class="vz-audit__list">${[...list.filter(c => c.lower), ...busy].map(row).join('')}${zero.length ? `<li class="vz-audit__zero">其余 ${zero.length} 类${zeroWhen ? ` · ${esc(zeroWhen)}` : ''}都是 0<small>${zeroNames.map(esc).join('；')}</small></li>` : ''}</ul>`);
      },
    };
  }

  // ================= 一年的小圆珠日历：按月一块，一天一颗珠子（周一起，一行一周），暖色按这一天用了多久 =================
  function calendar(host, opts = {}) {
    host.classList.add('vz-cal');
    host.innerHTML = '<div class="vz-cal__months"></div>';
    const box = host.firstElementChild, tip = tipper(host);
    let days = new Map(), unit = '秒';
    host.addEventListener('pointerover', (e) => {
      const d = e.target.closest('.vz-cal__dot[data-day]');
      if (!d) { tip.hide(); return; }
      const reading = days.get(d.dataset.day), v = reading?.value, l = dayLabel(d.dataset.day);
      const say = v == null ? '没有记录' : reading.partial ? `至少 ${fmt(v, unit)}` : v > 0 ? `用了 ${fmt(v, unit)}` : '没用';
      const g = d.getBoundingClientRect(), b = host.getBoundingClientRect();
      tip.show(`<b>${esc(l.md)} ${esc(l.wd)}</b><span>${esc(say)}</span>${reading?.gap ? `<span>${esc(reading.gap)}</span>` : ''}`, g.left - b.left + g.width / 2, g.top - b.top - 34);
    });
    host.addEventListener('pointerleave', () => tip.hide());
    return {
      set(payload) {
        const list = payload?.days || [];
        if (!list.length) { html(box, '', false); tip.hide(); waitBox(host, payload ? '没有使用记录' : window.LiveUI.collectionText()); return; }
        waitBox(host, '');
        unit = payload.unit ?? opts.unit ?? '秒';
        days = new Map(list.map((d) => [d.day, d]));
        const [from, to] = [list[0].day, list.at(-1).day];
        const max = opts.max || Math.max(...list.map((d) => d.value || 0), 1);
        const months = new Map();
        for (const d of list) { const k = d.day.slice(0, 7); if (!months.has(k)) months.set(k, []); months.get(k).push(d); }
        const week = opts.weekdays ? `<span class="use-cal__week" aria-hidden="true">${opts.weekdays.map(w => `<span>${esc(w)}</span>`).join('')}</span>` : '';
        if (html(box, [...months].map(([k, ds], index) => {
          const [y, m] = k.split('-').map(Number), first = new Date(Date.UTC(y, m - 1, 1)), lead = (first.getUTCDay() + 6) % 7;
          const n = new Date(Date.UTC(y, m, 0)).getUTCDate(), byDay = new Map(ds.map((d) => [Number(d.day.slice(8)), d]));
          const dots = Array.from({ length: lead }, () => '<i class="vz-cal__dot is-pad"></i>').join('') + Array.from({ length: n }, (_, i) => {
            const d = byDay.get(i + 1), day = `${k}-${pad2(i + 1)}`;
            if (day < from || day > to) return '<i class="vz-cal__dot is-pad"></i>';
            if (d?.value == null) return `<i class="vz-cal__dot is-none" data-day="${day}"></i>`;
            if (!(d.value > 0)) return `<i class="vz-cal__dot is-zero" data-day="${day}"></i>`;
            return `<i class="vz-cal__dot" data-day="${day}" style="--c:${opts.color?.(d.value) || warm(.12 + .88 * Math.min(d.value / max, 1) ** .8)}"></i>`;
          }).join('');
          const grid = `<div class="vz-cal__grid">${dots}</div>`;
          return `<div class="vz-cal__month"><span class="vz-cal__m">${!index || m === 1 ? `${y} 年 ` : ''}${m} 月</span>${week ? `<div class="use-cal__body">${week}${grid}</div>` : grid}</div>`;
        }).join(''), false)) tip.hide();
      },
      wait(text) { html(box, '', false); tip.hide(); waitBox(host, text); },
    };
  }

  // ================= 每组一张卡，图表章节常开 =================
  // 每组是一张整宽的卡，图表章节始终展开：左边大图、右边数字小格，点一格切换大图。
  // 黄、红的组排在前面；quiet 不放灯、不排序，章里可放页面自己的东西（build）。
  const LEVEL_ORDER = { red: 0, yellow: 1, ok: 2, none: 3 };
  function cardLineTitle(line) {
    const part = (el) => [...el.childNodes].map((n) => n.nodeType !== 1 ? n.textContent : getComputedStyle(n).display === 'none' ? ''
      : (n.matches('span[data-block]') && n.previousElementSibling?.matches('span[data-block]') ? ' · ' : '') + n.textContent).join('')
      .replace(/\s+/g, ' ').replace(/(?: ?· ?)+/g, ' · ').replace(/^[\s·]+|[\s·]+$/g, '');
    const tip = [...line.querySelectorAll(':scope > .grp__said, :scope > .grp__status, :scope > .grp__cutoff')].map(part).filter(Boolean).join(' · ');
    if (tip) line.title = tip; else line.removeAttribute('title');
  }
  function board(host, opts = {}) {
    host.classList.add('vz-board');
    const items = new Map();
    let payload = null, list = [], litOnce = false, gone = '', lastPhase = null, blockData = null, blockMap = {}, offline = false;
    // 读前（LiveUI.reading，雾里显影）：还没拿到第一份数、也还没读完时，整组在雾里——那句话写“正在读…”、大数字糊着、走势小线和章里都在雾里；
    // “还没读到”只在读完确实没有（phase none）或这一组自己的数读完了还是空时才写。组给了 wait（true/false）就按组自己的读数走，不跟曲线那一读
    const pend = (g) => !isOffline() && (g.wait ?? (!payload && lastPhase !== 'none' && lastPhase !== 'gone'));
    const PEND_NOTE = '<span class="fog__note grp__pend">正在读…<span class="fog__more">这块要多读一会儿</span></span>';
    const CHAPTER_GHOST = '<div class="grp__ghost"><span class="fog__chart"><i class="fog__band"></i></span></div>';
    const fog = (it, el, ghost, first = false) => {
      if (!pend(it.g) || !window.LiveUI?.reading) return null;
      const r = window.LiveUI.reading(el, { ghost: ghost || window.LiveUI.ghost.chart(), inline: el.tagName === 'SPAN', slow: first });
      if (lastPhase && lastPhase !== 'idle') r.set({ phase: lastPhase });
      it.reads.push(r);
      return r;
    };
    // 这一组读完了：雾散（有数的由糊变清；读完没数、存不下的直接撤，各处自己写“还没读到”或那一句）。
    // 黄、红的组原因已经有了：那句话先出雾，数字和图照旧等曲线
    const settle = (it, warn) => {
      if (!it.reads.length) return;
      const quiet = !payload && (lastPhase === 'none' || lastPhase === 'gone') && it.g.wait == null;
      const out = pend(it.g) ? (warn && it.lineRead ? [it.lineRead] : []) : it.reads;
      for (const r of out) r.done(!quiet);
      it.reads = it.reads.filter((r) => !out.includes(r));
      if (out.includes(it.lineRead)) it.lineRead = null;
    };
    function skeleton(g) {
      const card = document.createElement('article');
      card.className = `card grp${opts.quiet ? ' grp--quiet' : ''}`;
      card.dataset.key = g.key;
      if (g.readHeight) card.style.setProperty('--grp-reading-height', `${g.readHeight}px`);
      card.dataset.tone = 'none';
      if (g.pic) card.dataset.pic = g.side || 'right';
      card.innerHTML = `<div class="card__glow" aria-hidden="true"></div>${g.pic ? `<img class="card__tint" src="${esc(g.pic)}" alt="" aria-hidden="true">` : ''}
        <div class="card__glass glass">${g.pic ? `<span class="card__pic" aria-hidden="true"><img src="${esc(g.pic)}" alt="" loading="lazy"></span>` : ''}
          <div class="card__body grp__body">
            <div class="grp__head">
              <span class="grp__lamp"></span>
              <span class="grp__title"><b class="grp__name"></b><span class="grp__line"><span class="grp__said"></span><span class="grp__status"></span><span class="grp__cutoff"></span></span></span>
              <span class="grp__figs"></span>
              <span class="grp__acts"><span class="grp__gf"></span></span>
            </div>
            <div class="fold grp__fold"><div><div class="grp__chapter">
              <div class="grp__main" hidden><div class="grp__lead"><p class="grp__say"></p><div class="grp__hero"></div></div><div class="grp__chips"></div></div>
              <div class="grp__extra" hidden></div>
            </div></div></div>
          </div>
        </div>`;
      const it = { g, card, figs: new Map(), chart: null, chips: null, pick: null, extra: null, built: false, reads: [],
        head: card.querySelector('.grp__head'), fold: card.querySelector('.grp__fold') };
      if (opts.collapsible === true && !g.private_count) {
        it.fold.id = `vz-card-body-${++uid}`;
        const acts = card.querySelector('.grp__acts');
        acts.insertAdjacentHTML('beforeend', `<button class="grp__chev" type="button" aria-controls="${it.fold.id}" style="border:0;background:none;cursor:pointer">›</button>`);
        it.toggle = acts.lastElementChild;
        it.toggle.addEventListener('click', () => api.open(g.key, !it.open));
        it.head.addEventListener('click', e => { if (!e.target.closest('button,a,input,select,textarea,summary,[role="button"]')) it.toggle.click(); });
      }
      it.lineRead = fog(it, card.querySelector('.grp__line'), PEND_NOTE, !items.size);   // 读得慢时只让第一组说“这块要多读一会儿”
      window.LiveLight?.add(card);
      return it;
    }

    function setOpen(it, desired = it.open) {
      const open = !it.g.private_count && (!it.toggle || desired !== false);
      const changed = it.open !== open;
      it.open = open;
      it.card.classList.toggle('is-open', open);
      it.fold.classList.toggle('is-open', open);
      it.fold.inert = !open;
      if (it.toggle) {
        it.toggle.hidden = !!it.g.private_count;
        it.toggle.setAttribute('aria-expanded', String(open));
        it.toggle.setAttribute('aria-label', `${open ? '收起' : '展开'}${window.LiveUI.fieldText?.(it.g.name) ?? sp(it.g.name)}`);
      }
      if (open) build(it);
      return changed && !!it.toggle;
    }

    // 章：首次拿到这组时搭出大图、小格和页面自己的东西。
    function build(it) {
      const g = it.g;
      if (!it.built && pend(g) && g.readHeight) {
        if (!it.chapterRead) it.chapterRead = fog(it, it.card.querySelector('.grp__chapter'), CHAPTER_GHOST);
        return;
      }
      if (!it.built) {
        it.built = true;
        const cl = g.chips || [];
        if (cl.length) {
          it.card.querySelector('.grp__main').hidden = false;
          const lines = [], seen = new Set();
          for (const c of cl) for (const l of c.lines || []) { const id = l.id ?? l; if (!seen.has(id)) { seen.add(id); lines.push({ id, label: l.label ?? '', hue: l.hue }); } }
          it.pick = (cl.find(c => c.key === g.hero && !c.liveOnly) || cl.find(c => !c.liveOnly) || cl[0]).key;
          const first = cl.find((c) => c.key === it.pick);
          const hero = it.card.querySelector('.grp__hero');
          it.view = view(first);
          it.chart = readingChart(hero, { size: 'hero', lines, palette: g.palette, sync: opts.sync, ...it.view, show: ids(first), edgeDotLines: opts.edgeDotLines,
            onRead: opts.reading && ((vals, t) => {
              const c = it.g.chips?.find(x => x.key === it.pick);
              if (!c) return;
              for (const n of hero.querySelectorAll('.chart__val')) {
                const id = n.dataset.line, p = vals.find(v => v.id === id);
                const custom = displayReading(opts.reading, id, p ?? (t == null ? latestPoint(payload, id) : null), t, 'hero', { ...payload, ...c, ...p });
                if (custom != null || t != null && !p) n.querySelector('b').innerHTML = custom ?? missingReading(c);
              }
            }),
          }, opts);
          if (g.titleFirst) it.card.querySelector('.chart__head').after(it.card.querySelector('.grp__say'));
          if (!payload && lastPhase === 'none') it.chart.wait(window.LiveUI.collectionText());
          if (cl.length > 1) {
            it.chips = chips(it.card.querySelector('.grp__chips'), { palette: g.palette, sync: opts.sync, reading: opts.reading, onPick: (key) => pick(it, key) });
          } else it.card.querySelector('.grp__main').classList.add('is-single');
        }
        if (g.build) {
          const ex = it.card.querySelector('.grp__extra');
          ex.hidden = false;
          it.extra = g.build(ex, g) || null;
        }
        // 读前整章在雾里（大图、小格、页面自己的东西都先藏着，不露“还没读到”），数到了一起由糊变清
        fog(it, it.card.querySelector('.grp__chapter'), CHAPTER_GHOST);
      }
      fill(it);
    }
    const ids = (c) => (c.lines || []).map((l) => l.id ?? l);
    const view = (c) => ({ title: c.title || sp(c.label), unit: c.unit, axisUnit: c.axisUnit, floor: c.floor, ceil: c.ceil, stack: c.stack });
    function say(it) {
      const c = (it.g.chips || []).find((x) => x.key === it.pick);
      if (!c) return '';
      const series = ids(c).map((id) => payload?.series?.find((s) => s.id === id)).filter(Boolean);
      const sums = series.map((s) => ({ id: s.id, label: s.label, unit: c.unit ?? s.unit, ...window.LiveChart.sum(s) }));
      const own = it.g.say?.(c, sums, payload);   // 页面自己的说法；没说就用下面这句通用的
      if (own) return own;
      const s = sums[0];
      if (!s || s.max == null) return '';
      const span = payload ? (Date.parse(payload.to) - Date.parse(payload.from)) / 3600000 : 24;
      const when = s.maxAt != null ? new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', ...(span > 36 ? { month: '2-digit', day: '2-digit' } : {}) }).format(new Date(s.maxAt * 1000)).replace('/', '-') : '';
      // 只有一条线时大图头上已经写着它的名字，这句不再重复
      const who = ids(c).length > 1 ? sp(series[0].label || c.label) : '';
      return `${who ? `${who.replace(/\s*[(（](?:次|次\/秒|次\/s|个|人|项|份|条|秒|分钟|小时|%|℃|W|V|A|kWh|度|ms|FPS|MHz|GHz|[GMKT]?B(?:\/s)?)[)）]\s*$/, '')} · ` : ''}最高 ${fmt(s.max, s.unit)}${when ? `（${when}）` : ''}，平均 ${fmt(s.avg, s.unit)}`;
    }
    function pick(it, key) {
      const c = (it.g.chips || []).find((x) => x.key === key);
      if (!c || c.liveOnly || key === it.pick) return;
      it.pick = key;
      it.chart.show(ids(c), it.view = view(c));
      fill(it);
    }
    function fill(it) {
      if (!it.built || pend(it.g) || it.g.empty) return;   // 读前章在雾里，不先往里写空话
      if (it.chart) {
        const choices = it.g.chips || [];
        const current = choices.find(c => c.key === it.pick && !c.liveOnly)
          || choices.find(c => c.key === it.g.hero && !c.liveOnly) || choices.find(c => !c.liveOnly);
        if (current) {
          const next = view(current);
          if (current.key !== it.pick || Object.keys(next).some(k => next[k] !== it.view[k])) {
            it.pick = current.key;
            it.chart.show(ids(current), it.view = next);
          }
        }
        if (payload) { it.chart.set(payload); if (opts.reading) it.chart.point(null); }
      }
      if (it.chips) {
        const choices = it.g.chips || [];
        const visible = opts.keepChips ? choices.map(c => ({ ...c, on: c.key === it.pick })) : choices.filter(c => c.key !== it.pick);
        it.chips.set(visible, payload);
      }
      const said = it.chart ? say(it) : '';
      html(it.card.querySelector('.grp__say'), esc(sp(said)));
      it.extra?.set?.(it.g, payload);
    }

    // 页头三四个大数字，各带一条走势小线（数从曲线最后一分钟取，给了 value/text 就用给的）
    function figures(it) {
      const g = it.g, box = it.card.querySelector('.grp__figs'), figs = g.figures || [];
      const keys = opts.reading ? JSON.stringify(figs.map(f => [f.key, f.line, f.lines])) : figs.map(f => f.key).join();
      if (box.dataset.keys !== keys) {
        box.dataset.keys = keys;
        if (opts.reading) for (const fig of it.figs.values()) fig.chart?.destroy?.();
        it.figs.clear();
        box.innerHTML = figs.map((f) => `<span class="grp__fig" data-key="${esc(f.key)}"><span class="grp__fk">${esc(sp(f.label))}</span><span class="grp__fv"></span><span class="row__sub" data-figure-gap hidden></span><span class="grp__spark"></span></span>`).join('');
        figs.forEach((f, i) => {
          const el = box.querySelector(`[data-key="${CSS.escape(f.key)}"]`), v = el.querySelector('.grp__fv');
          const lineIds = [].concat(f.line || f.lines || []);
          const chart = lineIds.length && window.LiveChart ? readingChart(el.querySelector('.grp__spark'), {
            size: 'spark', lines: lineIds.map((id, j) => ({ id, hue: f.hue || (g.palette || [])[(i + j) % Math.max((g.palette || []).length, 1)] })), floor: f.floor ?? 'auto', ceil: f.ceil, sync: opts.sync,
            // 指着走势线：大数字换成那一分钟的
            onRead: (vals, t) => {
              const cur = it.figs.get(f.key)?.f || f, point = vals[0];
              const custom = t != null ? displayReading(opts.reading, lineIds[0], point ?? null, t, 'figure', { ...payload, ...cur, ...point }) : null;
              const value = t != null && (point || opts.reading) ? fmtHtml(point?.value, cur.unit ?? point?.unit) || `<span class="vz-none">${window.LiveUI.collectionText()}</span>` : figValue(cur, it.g);
              html(v, custom ?? value, false);
            },
          }, opts) : null;
          if (!chart) el.classList.add('is-bare'); else fog(it, el.querySelector('.grp__spark'));
          it.figs.set(f.key, { f, v, chart });
        });
      }
      for (const fig of it.figs.values()) {
        const f = figs.find((x) => x.key === fig.f.key);
        const label = fig.v.parentElement.querySelector('.grp__fk');
        label.innerHTML = field(f.label, '读数', 'label'); label.title = sp(f.label);
        fig.f = f;
        const gap = fig.v.parentElement.querySelector('[data-figure-gap]'), note = field(f.label, '读数', 'label') !== esc(sp(f.label)) ? field(f.label, '读数', 'body', true) : '';
        gap.hidden = !f.gap && !note; gap.innerHTML = esc(sp(f.gap || '')) + note;
        if (fig.chart && payload) { fig.chart.set(payload); if (opts.reading) fig.chart.point(null); } else html(fig.v, figValue(f, g));
      }
    }
    function figValue(f, g) {
      const id = [].concat(f.line || f.lines || [])[0];
      if (opts.reading && id) {
        const custom = displayReading(opts.reading, id, latestPoint(payload, id), null, 'figure', { ...payload, ...f });
        if (custom != null) return custom;
      }
      if (f.text != null && (!isOffline() || !/还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读|保留上次读数/.test(f.text))) return lowerBoundHtml(f, readingHtml(f.text));
      if (f.value != null) return lowerBoundHtml(f, fmtHtml(f.value, f.unit));
      if (g && pend(g)) return '<span class="fog__text grp__fog" aria-label="正在读">正在读</span>';   // 读前：糊开的示意字，不写“还没读到”
      const p = id && latestPoint(payload, id);
      return p ? lowerBoundHtml(f, fmtHtml(p.value, f.unit ?? p.unit)) : isOffline() ? '' : missingReading({ ...payload, ...payload?.series?.find(s => s.id === id), ...f });
    }

    function paint(it) {
      if (it.g.private_count) { it.card.classList.add('grp--private'); html(it.card.querySelector('.grp__said'), window.LiveUI.privateSummary(it.g.private_count)); return; }
      const g = it.g, warn = !opts.quiet && (g.level === 'red' || g.level === 'yellow');
      const got = g.figures?.some((f) => !!figValue(f, g)) || g.chips?.some((c) => c.value != null || ids(c).some((id) => payload?.series?.find((s) => s.id === id)?.points?.some((p) => p[1] != null))) || g.blocks?.some((b) => !b.empty && !b.wait);
      const missing = isOffline() && (g.empty || !got && (g.wait || !g.build));
      if (pend(g) && !it.reads.length) { it.lineRead = fog(it, it.card.querySelector('.grp__line'), PEND_NOTE); if (it.built) fog(it, it.card.querySelector('.grp__chapter'), CHAPTER_GHOST); }
      if (payload && g.wait) for (const r of it.reads) r.set({ phase: 'wait' });
      it.card.dataset.level = g.level || 'ok';
      it.card.style.setProperty('--grp-a', color((g.palette || [])[0] || 'teal'));
      it.card.style.setProperty('--grp-b', color((g.palette || [])[1] || (g.palette || [])[0] || 'violet'));
      html(it.card.querySelector('.grp__lamp'), window.LiveUI.status(g, { small: true, missingNames: g.missingNames ?? undefined }).lamp, false);
      const name = field(g.name, BLOCK_NAME[g.key] || '这一组', 'title');
      html(it.card.querySelector('.grp__name'), name);
      const line = missing ? emptyText(window.LiveUI.collectionText()) : gone && !payload ? gone : pend(g) ? (warn ? g.reason || '' : '') : (g.level === 'ok' ? '' : g.reason) || g.line || (g.level === 'none' && !opts.quiet && !isOffline() ? window.LiveUI.collectionText() : '');
      it.card.classList.toggle('is-gone', missing || (!!gone && !payload) || !!g.empty);
      figures(it);
      const shown = g.cutoffIds && !g.empty && !pend(g)
        ? [...it.card.querySelectorAll(`${it.open ? '.grp__main' : '.grp__figs'} time[data-reading-id]`)] : [];
      const sourceNotes = g.sourceNotes === false ? [] : g.blocks || [];
      const stamp = /数据截止\s+(?:\d{4}-)?\d{2}(?:-\d{2})?(?:\s+\d{2})?(?::\d{2})?(?::\d{2})?/g, cutoff = new Map();
      const clean = text => sp(text).replace(stamp, '').replace(/^[\s·，]+|[\s·，]+$/g, '');
      for (const b of [{ text: line, key: '' }, ...(!g.empty ? sourceNotes : [])]) for (const text of sp(b.text).match(stamp) || []) {
        if (shown.some(n => {
          if (!g.cutoffIds[b.key]?.includes(n.dataset.readingId)) return false;
          const t = Number(n.dataset.at), cutoff = text.replace(/^数据截止\s+/, '');
          const date = bj(t).toISOString().slice(0, 10), clock = hm(t);
          return n.textContent.includes(':') ? [clock, `${date} ${clock}`, `${date.slice(5)} ${clock}`].includes(cutoff) : [date, date.slice(5)].includes(cutoff);
        })) continue;
        const names = cutoff.get(text) || new Set();
        if (b.key) names.add(BLOCK_NAME[b.key] || g.name);
        cutoff.set(text, names);
      }
      const subtitle = clean(line);
      html(it.card.querySelector('.grp__said'), field(subtitle, '', 'body', true) + (name !== esc(sp(g.name)) ? field(g.name, BLOCK_NAME[g.key] || '这一组', 'body', true) : ''));
      html(it.card.querySelector('.grp__cutoff'), esc([...cutoff].map(([text, names]) => `${cutoff.size > 1 && names.size ? [...names].join('、') + ' · ' : ''}${text}`).join(' · ')));
      const reasonInLine = typeof g.why === 'string' && subtitle.split(' · ').includes(sp(g.why));
      const status = window.LiveUI.status(reasonInLine ? { ...g, text: g.why } : g, { missingNames: g.missingNames ?? undefined,
        cutoffShown: text => [...cutoff.keys()].some(shown => window.LiveUI.sameCutoffNote(shown, text)) });
      const visibleNotes = ['power', 'smooth', 'security'].includes(opts.key) ? sourceNotes.filter(b => b.state !== 'unavailable') : sourceNotes;
      html(it.card.querySelector('.grp__status'), [status.note, !g.empty && blockNotes(visibleNotes.map(b => ({ ...b, text: clean(b.text) })), subtitle, g.name)].filter(Boolean).join(' · '));
      cardLineTitle(it.card.querySelector('.grp__line'));
      html(it.card.querySelector('.grp__gf'), g.grafana ? `<a class="gf" href="${esc(g.grafana)}" target="_blank" rel="noopener" data-gf data-needs-pc>Grafana <span class="more__chev">↗</span></a>` : '');
      window.LiveLight?.tone(it.card, g);
      settle(it, warn);
    }

    function order() {
      if (opts.quiet) return list;
      const priority = (g) => pend(g) && g.readHeight ? LEVEL_ORDER.yellow : LEVEL_ORDER[g.level] ?? 2;
      return [...list].map((g, i) => [g, i]).sort((a, b) => priority(a[0]) - priority(b[0]) || a[1] - b[1]).map(([g]) => g);
    }
    function counts() {
      const c = { total: list.reduce((n, g) => n + (g.private_count || 1), 0), red: 0, yellow: 0, ok: 0, none: 0, warn: [] };
      for (const g of list) { c[g.level in c ? g.level : 'ok'] += g.private_count || 1; if (g.level === 'red' || g.level === 'yellow') c.warn.push(g); }
      return c;
    }

    const api = {
      set(groups) {
        list = (groups || []).map((g) => blockGroup(g, blockData, blockMap[g.key] || [g.key], offline));
        list = window.LiveUI?.mergePrivateRows?.(list, { value: g => g.name }) ?? list;
        host.style?.setProperty('--live-figure-count', Math.max(1, ...list.map(g => g.figures?.length || 0)));
        host.querySelector(':scope > .vz-wait')?.remove();
        if (isOffline() && !list.length) { host.innerHTML = `<p class="vz-wait">${emptyText(window.LiveUI.collectionText())}</p>`; items.clear(); opts.onCount?.(counts()); return; }
        const fresh = [];
        for (const g of list) {
          let it = items.get(g.key);
          if (!it) { it = skeleton(g); items.set(g.key, it); fresh.push(it); }
          it.g = g;
          if (g.cutoffIds) setOpen(it);
          paint(it);
        }
        for (const [k, it] of items) if (!list.some((g) => g.key === k)) { it.card.remove(); items.delete(k); }
        // 重排：只在没有指着哪一组的时候挪
        const want = order().map((g) => items.get(g.key).card);
        if (!host.querySelector('.grp:hover, .grp:focus-within') || fresh.length) {
          want.forEach((card, i) => { if (host.children[i] !== card) host.insertBefore(card, host.children[i] || null); });
        }
        for (const it of items.values()) if (!it.g.cutoffIds) setOpen(it);
        if (litOnce && fresh.length) window.LiveLight?.lightUp(fresh.map((it) => it.card));
        opts.onCount?.(counts());
      },
      data(next) {
        payload = next;
        gone = '';
        for (const it of items.values()) { fill(it); paint(it); }
      },
      blocks(data, map = {}, off = false) { blockData = data; blockMap = map; offline = off; },
      groupPhase(key, state) { const it = items.get(key); if (it && pend(it.g)) for (const r of it.reads) r.set(state); },
      // 曲线那一读的 phase（Live.watch 的 phase 回调原样交进来）：读前整组在雾里写“正在读…”；读完确实没数（none）雾撤掉、各处写“还没读到”；
      // 电脑不在线、这块没存下来（gone）时每组只写一句 state.say，不在每张小图里重复
      phase(state) {
        if (payload) return;
        const next = state?.phase || null, done = (p) => p === 'none' || p === 'gone';
        if (done(lastPhase) && !done(next)) return;   // 读完了（没数、存不下）再重读时不回到雾里：那几句话留着，等数到了一起换
        lastPhase = next;
        const over = done(lastPhase);
        // 还在读：雾跟着 idle → wait → slow 走（自己带 wait 的组照样跟着这个节拍）
        if (!over) { for (const it of items.values()) if (pend(it.g)) for (const r of it.reads) r.set(state); return; }
        if (lastPhase === 'none') for (const it of items.values()) it.chart?.wait(window.LiveUI.collectionText());
        gone = lastPhase === 'gone' ? emptyText(state.say || window.LiveUI.collectionText()) : '';
        for (const it of items.values()) { fill(it); paint(it); }
      },
      // 进页那一次：让各组的灯和光一颗接一颗亮（页面在页头亮完之后调）
      cards() { litOnce = true; return [...host.children].filter((n) => n.classList.contains('grp')); },
      open(key, open = true) {
        const it = items.get(key);
        if (it && setOpen(it, open)) { if (it.g.cutoffIds) paint(it); opts.onToggle?.(it.open, key); }
      },
      all(open = true) {
        let changed = false;
        for (const it of items.values()) if (setOpen(it, open)) { if (it.g.cutoffIds) paint(it); changed = true; }
        if (changed) opts.onToggle?.(api.allOpen());
      },
      allOpen: () => [...items.values()].every((it) => it.g.private_count || it.card.classList.contains('is-open')),
      counts,
    };
    return api;
  }


  // ================= 织锦：所有曲线对齐同一条时间轴，一条一行细丝带 =================
  // 指着哪一分钟，一条竖线贯穿所有行、每行右边的数换成那一分钟的（和页上别的图共用一个 sync）；
  // marks 是“最近卡过”那几次，在事件行按实际位置合并成簇。
  //   const w = LiveViz.weave(host, { sync, order: ['CPU 和显卡', ...], hues: { 'CPU 和显卡': ['teal','violet'] }, label: (s) => '名字', skip: (s) => false })
  //   w.set(payload)              /computer/charts 那种 { from, to, series }；自己带 from/to 的（近 90 天）和状态（kind: states）不进来
  //   w.marks([{ t: 秒, seconds: 2.3, text? }])
  function weave(host, opts = {}) {
    host.classList.add('vz-weave');
    host.style.paddingTop = '0';
    host.innerHTML = '<div class="vz-weave__events" style="position:relative;min-height:34px;z-index:3;margin-inline:calc(var(--wg) + var(--wn) + var(--wgap)) calc(var(--wv) + var(--wgap))"></div><div class="vz-weave__rows"></div><div class="vz-weave__over" aria-hidden="true"><span class="vz-weave__when" hidden></span></div><div class="vz-weave__axis" aria-hidden="true"></div>';
    const rowsEl = host.querySelector('.vz-weave__rows'), over = host.querySelector('.vz-weave__over'), whenEl = host.querySelector('.vz-weave__when'), axisEl = host.querySelector('.vz-weave__axis');
    const events = host.querySelector('.vz-weave__events');
    const rows = new Map();
    let payload = null, span = null, marks = [], shape = '';
    const AUTO = ['℃', 'MHz', 'V'];
    const x = (t) => (span ? ((t - span[0]) / (span[1] - span[0])) * 100 : 0);
    // 整张卡上的时刻小药丸：跟着 sync 一起指
    const me = {
      point(t) {
        const off = t == null || !span || t < span[0] || t > span[1];
        whenEl.hidden = off;
        if (off) return;
        whenEl.textContent = hm(t);
        whenEl.style.left = `${x(t).toFixed(3)}%`;
        // 靠近顶上“卡了几秒”的药丸时让开：挪到底下时间轴上写
        const w = whenEl.getBoundingClientRect();
        const near = [...events.children].some((p) => { const r = p.getBoundingClientRect(); return r.left < w.right + 8 && r.right > w.left - 8; });
        whenEl.classList.toggle('is-low', near);
      },
      mark() {},
    };
    opts.sync?.add(me);

    function drawMarks() {
      events.replaceChildren();
      const width = events.clientWidth;
      if (!span || !width) return;
      const hits = marks.filter(m => m.t >= span[0] && m.t <= span[1]).sort((a, b) => a.t - b.t);
      if (!hits.length) return;
      const detail = m => Number.isFinite(m.seconds) ? `卡了 ${m.seconds} 秒` : m.text || '卡过';
      const fullTime = t => `${md(t)} ${hm(t)}:${pad2(bj(t).getUTCSeconds())}`;
      const label = (first, last) => first === last
        ? `${span[1] - span[0] > 36 * 3600 ? fullTime(hits[first].t) : fullTime(hits[first].t).split(' ')[1]} · ${detail(hits[first])}`
        : `卡顿 ${last - first + 1} 次`;
      const pill = tag => {
        const el = document.createElement(tag);
        el.className = 'vz-weave__pill';
        el.style.cssText = 'top:2px;left:0;border:0;cursor:pointer;max-width:100%;overflow:hidden;white-space:normal;line-height:12px';
        return el;
      };
      const ruler = pill('button'), clusters = [];
      events.append(ruler);
      const place = (first, last) => {
        ruler.textContent = label(first, last);
        const size = ruler.offsetWidth;
        const center = (x(hits[first].t) + x(hits[last].t)) * width / 200;
        return { first, last, size, left: Math.max(0, Math.min(center - size / 2, width - size)) };
      };
      for (let i = 0; i < hits.length; i++) {
        let group = place(i, i);
        while (clusters.length && clusters.at(-1).left + clusters.at(-1).size + 4 > group.left) group = place(clusters.pop().first, i);
        clusters.push(group);
      }
      ruler.remove();
      const pick = m => opts.sync?.mark(m.t, detail(m));
      for (const { first, last, size, left } of clusters) {
        const single = first === last, el = pill(single ? 'button' : 'select');
        Object.assign(el.style, { left: `${left}px`, width: `${size}px`, translate: 'none' });
        if (single) {
          el.type = 'button';
          el.textContent = label(first, last);
          el.title = `${fullTime(hits[first].t)} · ${detail(hits[first])}`;
          el.addEventListener('click', () => pick(hits[first]));
        } else {
          el.style.appearance = 'none';
          el.setAttribute('aria-label', `${label(first, last)} · ${fullTime(hits[first].t)} 至 ${fullTime(hits[last].t)}`);
          el.add(new Option(label(first, last), ''));
          for (let i = first; i <= last; i++) el.add(new Option(`${fullTime(hits[i].t)} · ${detail(hits[i])}`, i));
          el.addEventListener('change', () => { if (el.value !== '') pick(hits[Number(el.value)]); el.value = ''; });
        }
        events.append(el);
      }
    }
    new ResizeObserver(drawMarks).observe(events);
    function drawAxis() {
      if (!span) { axisEl.innerHTML = ''; return; }
      const out = [];
      const step = span[1] - span[0] > 36 * 3600 ? 86400 : 21600;
      for (let t = Math.ceil((span[0] + BJ) / step) * step - BJ; t <= span[1] - 1800; t += step) {
        if (t - span[0] < 1800) continue;
        out.push(`<span style="left:${x(t).toFixed(3)}%">${bj(t).getUTCHours() ? hm(t) : md(t)}</span>`);
      }
      out.push(`<span class="is-now" style="left:100%">${md(span[1])} ${hm(span[1])}</span>`);
      axisEl.innerHTML = out.join('');
    }

    function makeRow(s, hue) {
      const row = document.createElement('div');
      row.className = 'vz-weave__row';
      row.dataset.series = s.id;
      row.innerHTML = `<span class="vz-weave__g"></span>
        <div class="vz-weave__hit"><span class="vz-weave__name">${esc(sp(opts.label?.(s) || s.label || s.id))}</span><span class="vz-weave__rib"></span><span class="vz-weave__v"></span></div>`;
      const v = row.querySelector('.vz-weave__v'), entry = { row, series: s };
      entry.chart = readingChart(row.querySelector('.vz-weave__rib'), {
        size: 'ribbon', lines: [{ id: s.id, label: s.label, hue }], floor: opts.floor?.(s) ?? (AUTO.includes(s.unit) ? 'auto' : 0), ceil: s.unit === '%' ? 100 : undefined, sync: opts.sync,
        onRead: (vals, t) => {
          const series = entry.series, p = vals[0];
          const custom = displayReading(opts.reading, series.id, p ?? (t == null && opts.reading ? latestPoint(payload, series.id) : null), t, 'weave', { ...payload, ...series });
          html(v, custom ?? (p ? esc(p.value == null ? window.LiveUI.collectionText() : p.text) : t != null && opts.reading ? missingReading(series) : ''), false);
        },
      }, opts);
      return entry;
    }

    function build(list) {
      const ids = new Set(list.map(s => s.id));
      for (const [id, r] of rows) if (!ids.has(id)) {
        r.chart.destroy?.();
        r.row.remove();
        rows.delete(id);
      }
      rowsEl.querySelector('.vz-wait')?.remove();
      // 各组独立到达。已有的行保留自己已经播放到的位置，只给新行创建图。
      let anchor = rowsEl.firstElementChild;
      let last = null, k = 0;
      for (const s of list) {
        const g = s.group || '别的', first = g !== last;
        if (first) k = 0;
        last = g;
        const pal = (opts.hues?.[g]) || ORDER;
        const hue = opts.hue?.(s) ?? pal[k % pal.length];
        k++;
        const r = rows.get(s.id) || makeRow(s, hue);
        rows.set(s.id, r);
        r.row.classList.toggle('is-first', first);
        r.row.firstElementChild.textContent = first ? sp(g) : '';
        if (r.row !== anchor) rowsEl.insertBefore(r.row, anchor);
        anchor = r.row.nextElementSibling;
      }
    }

    return {
      set(next) {
        payload = next;
        const list = (next?.series || []).filter((s) => !s.from && s.kind !== 'states' && !(opts.skip?.(s)) && s.points?.some((p) => p[1] != null));
        if (!list.length) { span = null; build([]); rowsEl.innerHTML = `<p class="vz-wait">${emptyText(next ? '这段时间没有读数' : window.LiveUI.collectionText())}</p>`; shape = ''; me.point(null); drawAxis(); drawMarks(); return; }
        const order = opts.order || [];
        const rank = (g) => { const i = order.indexOf(g); return i < 0 ? order.length : i; };
        list.sort((a, b) => rank(a.group) - rank(b.group));
        const key = list.map((s) => s.id).join();
        if (key !== shape) { shape = key; build(list); }
        span = [sec(next.from), sec(next.to)];
        for (const s of list) {
          const r = rows.get(s.id);
          r.series = s;
          if (opts.reading) r.row.querySelector('.vz-weave__name').innerHTML = field(opts.label?.(s) || s.label || s.id, '读数', 'label');
          r.chart.set(next);
          if (opts.reading) r.chart.point(null);
        }
        me.point(null);
        drawAxis();
        drawMarks();
      },
      marks(list) { marks = list || []; drawMarks(); },
    };
  }

  window.LiveViz = { timeline, heatmap, bars, share, rank, figures, chips, moments, audit, calendar, board, cardLineTitle, weave, block, blockState, blockGroup, blockData, chartQuery, chartWidth, watchChart, fmt, fmtHtml, warm, dur, durHtml, hues: HUE, stateHues: STATE_HUE, categoryHues: CAT_HUE, categoryNames: CAT_NAME, md, weekday, dayLabel };
})();

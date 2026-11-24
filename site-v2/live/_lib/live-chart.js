// 实况自己画的曲线（第二、三层共用）。不引图表库：一张 SVG 画线和底，坐标字是叠在图上的 HTML（不跟着缩放变小）。
// 先降噪再画：每 7 个像素一桶取平均画线（单调三次曲线，不冲过头）；大图另画一条很淡的“这一桶最高到最低”的带子，尖峰不丢。
// 线不发光，线下一层很淡的同色渐变铺底；只有线头“最后一分钟”那颗点带一点光。颜色用彩虹光那几种（青、蓝紫、粉、蓝、杏），
// 不用绿、黄、红——那三种是状态灯的颜色。缺测（null）就断开，不插值；指上去：一条细竖线、线上一颗同色小灯，头上的数换成那一分钟的。
//
// 用法：
//   const sync = LiveChart.sync();                    几张图一起指同一分钟（可不给）
//   const c = LiveChart.create(host, {
//     lines: [{ id: 'cpu', label: 'CPU', hue: 'teal' }],   接口 series 的 id；hue = teal|violet|pink|blue|apricot（不给就按 palette 轮）
//     palette: ['teal', 'violet'],                   一组一对颜色，线没写 hue 时按顺序取
//     size: 'hero' | 'spark' | 'ribbon',             ribbon：织锦里的一行丝带（28px，铺底更浓），LiveViz.weave 用                        hero：大图（240px，横轴最多 4 个时刻，纵轴只写底和顶）；
//                                                    spark：走势小线（32px，没有坐标和字，指上去把那一分钟的数交给 onRead）
//                                                    不给就是原来的中等图；small: true 是原来并排的小图（旧页面还在用，保留）
//     show: ['cpu'],                                 先画哪几条（不给就全画）；c.show(ids) 换线
//     unit: '%', floor: 0 | 'auto', ceil: 100,       不给 unit 就用 series 自己的；floor 'auto' 跟着数走（温度）
//     formatValue: (value, unit) => text,          自定义轴和读数文字，字节轴随之用十进制步长
//     stack: true,                                   几条叠起来画（功耗分项这类），头上每条写自己的数
//     band: true,                                    最高到最低的淡带子（hero 默认开）
//     glow: true,                                    线本身发一层光（默认不发）
//     bridge: 7200,                                  多少秒以内的缺测接着画（spark 默认整段的三分之一、至少 2 小时，ribbon 2 小时，别的默认 0：缺测就断开）
//     head: false,                                   不要头上那行名字和数（spark 默认不要）
//     onRead: (vals, t) => {},                       头上的数变了（指着、不指）：vals = [{ id, label, value, unit, text, at }]，at 是实际采样的秒或 null，t 是指着的秒或 null
//     sync,
//   });
//   c.set({ from, to, series, missing_intervals, off_spans, bucket_seconds })   每分钟重读后再调一次。返回这张图有没有线。
//                                     missing_intervals 可省；[from, to, 原因文字?] 使用 Unix 秒，左闭右开；[] 表示没有缺测。
//                                     off_spans 是使用记录确认的关机区间，同样用 Unix 秒，只分类斜纹中相交的部分。
//                                     bucket_seconds 可省；点读只用所在桶的样本，首桶可从图窗起点截断。
//                                     series.chart_window 可单独给 from/to、bucket_seconds、bucket_offset_seconds、missing_intervals。
//   c.show(ids, { title, unit, floor, ceil, stack })   换成另几条线（300 毫秒淡换，纵轴范围和单位跟着换）
//   c.wait('还没读到')               没有数时图里写一句话（建好时自己写“正在读”）
//   sync.mark(t, '卡了 2.3 秒')      几张图在 t（秒）那一刻铺一道半透明粉色竖带，大图顶上一颗小药丸写这句；mark(null) 取消
// 时间跨度跟着数走：series 自己带 from/to（近 90 天那种）就用自己的，否则用整包的。
//   LiveChart.value(v, unit)        数怎么写：%、℃、B、B/s、GB、秒、分钟、W、MHz、ms、µs、V、A、kWh（“度”也写成 kWh）、次、次/s、个、FPS
//   LiveChart.html(v, unit)         同上，数字包 <b>、单位包 <small>，大字用
//   LiveChart.sum(series)           { max, maxAt, min, avg, last, lastAt }：页面写“最忙是 14:20，CPU 到 41%”用
//   LiveChart.buckets(点, toX, px)  分桶：[[平均时刻, 平均, 最低, 最高], ...]（画线前降噪用的那一步）
//   LiveChart.hues                  线的颜色，页面上和曲线对应的东西用同一种
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const HUE = { teal: '#16a6c4', violet: '#7a63e8', pink: '#e2639f', blue: '#3f87ee', apricot: '#e8913f' };
  const ORDER = ['teal', 'violet', 'pink', 'blue', 'apricot'];
  const SIZE = {
    mid: { top: 14, bottom: 26, left: 60, lines: 4, h: null },
    small: { top: 14, bottom: 26, left: 56, lines: 2, h: null },
    hero: { top: 16, bottom: 28, left: 58, lines: 4, h: 240 },
    spark: { top: 4, bottom: 4, left: 0, lines: 0, h: 32 },
    ribbon: { top: 3, bottom: 1, left: 0, lines: 0, h: 28 },   // 织锦里的一行丝带（LiveViz.weave）
  };
  const BUCKET = 7;                     // 每 7 个像素一桶取平均：线是静的
  let uid = 0;

  const clock = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const shutdownText = ([from, to]) => `关机 ${clock.format(new Date(from * 1000))}–${clock.format(new Date(to * 1000))}`;
  const dayKey = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit' });
  const spaced = (s) => (window.LiveUI?.fieldText?.(s) ?? (typeof s === 'object' ? '' : String(s ?? ''))).replace(/([一-鿿])([0-9A-Za-z])/g, '$1 $2').replace(/([0-9A-Za-z%℃])([一-鿿])/g, '$1 $2');
  const esc = (s) => (window.LiveUI?.fieldText?.(s) ?? (typeof s === 'object' ? '' : String(s ?? ''))).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // —— 数怎么写 ——
  const trim = (v, d = 2) => {
    const scale = 10 ** Math.min(d, Math.abs(v) < 10 ? 2 : 1);
    return String(Math.round((v + Number.EPSILON) * scale) / scale);
  };
  function duration(s) {
    const m = Math.round(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24);
    if (d) return h % 24 ? `${d} 天 ${h % 24} 小时` : `${d} 天`;
    if (h) return m % 60 ? `${h} 小时 ${m % 60} 分钟` : `${h} 小时`;
    if (s > 0 && s < 60) return s < 10 ? `${trim(s, 1)} 秒` : `${Math.round(s)} 秒`;
    return `${Math.max(m, 0)} 分钟`;
  }
  function bytes(v) {
    const g = v / 2 ** 30;
    if (Math.abs(g) >= 1) return value(g, 'GB');
    const m = v / 2 ** 20;
    return Math.abs(m) >= 1 ? `${trim(m, 1)} MB` : Math.abs(v) >= 1024 ? `${trim(v / 1024, 1)} KB` : `${trim(v, 0)} B`;
  }
  function rate(v) {
    const m = v / 2 ** 20;
    if (Math.abs(m) >= 1) return `${trim(m, m >= 10 ? 0 : 1)} MB/s`;
    const k = v / 1024;
    return Math.abs(k) >= 1 ? `${trim(k, 1)} KB/s` : `${trim(v, 1)} B/s`;
  }
  const count = (v, u) => (Math.abs(v) >= 1e4 ? `${trim(v / 1e4, 1)} 万${u || ''}` : `${Math.round(v)}${u ? ' ' + u : ''}`);
  function value(v, unit) {
    if (v == null || !Number.isFinite(v)) return null;
    switch (unit) {
      case '%': return v > 0 && v < .01 ? '不到 0.01%' : `${Math.abs(v) < 10 ? trim(v, 2) : Math.round(v)}%`;
      case '℃': return `${Math.round(v)}℃`;
      case 'B': return bytes(v);
      case 'B/s': return rate(v);
      case 'GB': return v !== 0 && Math.abs(v) < 1 ? bytes(v * 2 ** 30) : `${trim(v, 2)} GB`;
      case 'MB': return bytes(v * 2 ** 20);
      case 'KB': return bytes(v * 1024);
      case 'MB/s': return rate(v * 2 ** 20);
      case 'KB/s': return rate(v * 1024);
      case '秒': case 's': return duration(v);
      case '分钟': case 'min': return duration(v * 60);
      case 'MHz': return v >= 1000 ? `${trim(v / 1000, 1)} GHz` : `${Math.round(v)} MHz`;
      case 'kWh': case '度': return `${trim(v, Math.abs(v) >= 10 ? 1 : 2)} kWh`;
      case 'W': return `${trim(v, 1)} W`;
      case 'ms': return Math.abs(v) >= 1000 ? value(v / 1000, '秒') : `${trim(v, 1)} ms`;
      case 'µs': case 'us': return Math.abs(v) >= 1000 ? value(v / 1000, 'ms') : `${trim(v, 1)} µs`;
      case 'V': return `${v.toFixed(2)} V`;
      case 'A': return `${trim(v, 1)} A`;
      case 'FPS': case 'fps': return `${Math.round(v)} FPS`;
      case '次/s': case '次/秒': return count(v, '次/秒');
      case '次': case '个': return count(v, unit);
      default: return `${trim(v, 1)}${unit ? ' ' + unit : ''}`;
    }
  }
  // 大字：数字 <b>，单位 <small>
  const html = (v, unit) => {
    const s = value(v, unit);
    return s == null ? '' : esc(s).replace(/(-?\d[\d.,]*)|([^\d\s-][^\d]*?)(?=\s*-?\d|\s*$)/g, (m, n, u) => (n ? `<b>${n}</b>` : `<small>${u.trim()}</small>`)).replace(/\s+/g, '');
  };

  // —— 一句人话用：最高、最高在几点、平均、最后 ——
  function sum(series) {
    if (series?.stats !== undefined) return series.stats?.count > 0 ? series.stats : null;
    let max = -Infinity, maxAt = null, min = Infinity, total = 0, n = 0, last = null, lastAt = null;
    for (const [t, v] of series?.points || []) {
      if (v == null || !Number.isFinite(v)) continue;
      if (v > max) { max = v; maxAt = t; }
      if (v < min) min = v;
      total += v; n++; last = v; lastAt = t;
    }
    return n ? { max, maxAt, min, avg: total / n, last, lastAt } : null;
  }

  // —— 纵轴：取整到好读的数 ——
  function niceStep(span, n) {
    const raw = span / n, p = 10 ** Math.floor(Math.log10(raw)), f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  function scale(lo, hi, { floor, ceil, unit, labelled, lines = 4 }) {
    const upper = labelled && ceil == null && unit !== '%' && hi > 0 ? hi * 1.1 : Infinity;
    if (unit === 'GB' && lo >= 0 && hi < .01 && upper >= .01) return { min: 0, max: .01, ticks: [0, .01] };
    const integerBatches = unit === '批' && ceil == null;
    let min = floor === 'auto' ? lo - (hi - lo) * .3 : 0;
    if (lo >= 0 && min < 0) min = 0;
    if (floor !== 'auto' && lo < 0) min = lo;
    let max = hi + (hi - min) * .14;
    if (ceil != null) max = Math.min(max, ceil);
    if (unit === '%' && floor === 0 && ceil === 100) { min = 0; max = 100; }
    if (!(max > min)) max = min + 1;
    // 字节、字节每秒的刻度按 1024 取整（自己传了格式的也一样，字都按 1024 写）
    const big = unit === 'B/s' || unit === 'B' ? [2 ** 40, 2 ** 30, 2 ** 20, 1024].find((d) => max >= d) || 1 : 1;
    const nice = niceStep((max - min) / big, Math.max(lines, 2)) * big;
    const step = integerBatches ? Math.ceil(nice) : Math.max(unit === 'GB' ? .01 : 0, nice);
    if (floor === 'auto') min = Math.floor(min / step) * step;
    if (integerBatches) max = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-6; v += step) ticks.push(v);
    if (labelled && hi > (ticks.at(-1) ?? -Infinity) + step * 1e-6) {
      const top = Math.min(ceil ?? Infinity, Math.ceil(hi / step) * step);
      if (top > (ticks.at(-1) ?? -Infinity)) ticks.push(top);
      max = Math.max(max, top);
    }
    if (max > upper) {
      // 只有原刻度偏高才改。顶格贴近峰值，给字留一个完整的格距。
      const precision = 10 ** Math.floor(Math.log10(hi / big / 25)) * big;
      max = Math.min(upper, Math.ceil((hi + precision * 1e-8) / precision) * precision);
      while (ticks.length && ticks.at(-1) > max - (max - min) * .08) ticks.pop();
      ticks.push(max);
    }
    return { min, max, ticks };
  }

  // —— 单调三次曲线（Fritsch–Carlson）：柔，但不会冲过真实的高低点 ——
  function curve(p, move = true) {
    if (p.length === 1) return `${move ? 'M' : 'L'}${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}h.01`;
    const n = p.length, d = [], m = [];
    for (let i = 0; i < n - 1; i++) d.push((p[i + 1][1] - p[i][1]) / ((p[i + 1][0] - p[i][0]) || 1));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (!d[i]) { m[i] = m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    let path = `${move ? 'M' : 'L'}${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    for (let i = 0; i < n - 1; i++) {
      const h = (p[i + 1][0] - p[i][0]) / 3;
      path += `C${(p[i][0] + h).toFixed(1)},${(p[i][1] + m[i] * h).toFixed(1)} ${(p[i + 1][0] - h).toFixed(1)},${(p[i + 1][1] - m[i + 1] * h).toFixed(1)} ${p[i + 1][0].toFixed(1)},${p[i + 1][1].toFixed(1)}`;
    }
    return path;
  }

  // 按 null 切成几段
  // 按 null 切成几段；bridge 秒以内的缺测接着画（走势小线默认接 2 小时以内的，不断成一截一截）
  function segments(points, bridge = 0, gaps = []) {
    const out = [];
    let cur = null, last = null, broken = false;
    for (const [t, v] of points) {
      if (v == null || !Number.isFinite(v) || gaps.some(([a, b]) => a <= t && t < b)) { broken = true; continue; }
      if (!cur || (broken && t - last > bridge) || gaps.some(([a, b]) => last < b && a < t)) out.push(cur = []);
      cur.push([t, v]);
      last = t;
      broken = false;
    }
    return out;
  }
  // 分桶：一段里按像素每 px 宽一桶，取平均、最高、最低；返回 [[t, 平均, 最低, 最高], ...]（t 是桶里点的平均时刻）
  function buckets(seg, toX, px) {
    const out = [];
    let key = null, n = 0, st = 0, sv = 0, lo = Infinity, hi = -Infinity;
    const flush = () => { if (n) out.push([st / n, sv / n, lo, hi]); };
    for (const [t, v] of seg) {
      const k = Math.floor(toX(t) / px);
      if (k !== key) { flush(); key = k; n = 0; st = 0; sv = 0; lo = Infinity; hi = -Infinity; }
      n++; st += t; sv += v; lo = Math.min(lo, v); hi = Math.max(hi, v);
    }
    flush();
    return out;
  }

  // 默认找最近的点，按桶读时找当前桶内的第一个样本。
  function sampleAt(points, t, bucketSeconds, offset = 0) {
    if (bucketSeconds) t = Math.floor((t - offset) / bucketSeconds) * bucketSeconds + offset;
    let lo = 0, hi = points.length - 1;
    if (hi < 0) return null;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (points[mid][0] < t) lo = mid; else hi = mid; }
    if (bucketSeconds) {
      const sample = points[lo][0] >= t ? points[lo] : points[hi];
      return sample[0] >= t && sample[0] < t + bucketSeconds ? sample : null;
    }
    return Math.abs(points[lo][0] - t) <= Math.abs(points[hi][0] - t) ? points[lo] : points[hi];
  }

  const el = (tag, attrs = {}) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const date = at => { const format = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }); return at ? format.format(new Date(at)).replace(format.format(new Date()).slice(0, 5), '') : ''; };
  const md = d => date(d);
  function gapTime(t) {
    const d = new Date(t * 1000);
    const seconds = d.getUTCSeconds();
    return `${md(d)} ${clock.format(d)}${seconds ? ':' + String(seconds).padStart(2, '0') : ''}`;
  }
  function when(t, data) {
    const d = new Date(t * 1000), text = clock.format(d), span = data.t1 - data.t0;
    if (span > 20 * 86400) return md(d);
    if (span > 36 * 3600) return `${md(d)} ${text}`;
    return dayKey.format(d) !== dayKey.format(new Date(data.t1 * 1000)) ? `${md(d)} ${text}` : text;
  }
  // 竖的刻度：24 小时内每 6 小时，几天内每天零点，更长每 15 天
  function timeTicks(t0, t1) {
    const span = t1 - t0, out = [];
    const step = span > 20 * 86400 ? 15 * 86400 : span > 36 * 3600 ? 86400 : 6 * 3600;
    for (let t = Math.ceil(t0 / 3600) * 3600; t <= t1; t += 3600) {
      const d = new Date(t * 1000), hour = Number(clock.format(d).slice(0, 2));
      if (step === 6 * 3600 ? hour % 6 : hour) continue;
      if (step > 86400 && Math.round((t - t0) / 86400) % 15) continue;
      out.push([t, hour ? clock.format(d) : md(d)]);
      if (step >= 86400) t += 23 * 3600;
    }
    return out;
  }

  // —— 几张图一起指同一分钟 ——
  function sync() {
    const charts = new Set();
    let pointed = null, marked = null, said = '';
    return {
      add: (c) => { charts.add(c); if (pointed != null) c.point(pointed); if (marked != null) c.mark(marked, said); },
      remove: (c) => charts.delete(c),
      at: (t) => { pointed = t; for (const c of charts) c.point(t); },
      mark: (t, text = '') => { marked = t; said = text; for (const c of charts) c.mark(t, text); },
    };
  }

  let pointerSource = null, pointerEvents = false;
  function clearPointer() { const source = pointerSource; pointerSource = null; source?.clear(); }
  const reveals = new Map();
  function finishReveals() { for (const finish of reveals.values()) finish(false); }
  let visibility, printing = false;
  const moving = () => !printing && !document.hidden && document.documentElement.classList.contains('mo-on');
  function watchReveal(plot, finish) {
    if (!visibility) {
      const settle = () => {
        for (const [target, finish] of reveals) if (!moving() || !target.isConnected) finish(false);
      };
      visibility = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.intersectionRatio >= 0.3 && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0) reveals.get(entry.target)?.(moving());
      }, { threshold: 0.3 });
      new MutationObserver(settle).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      document.addEventListener('visibilitychange', settle);
      window.addEventListener('beforeprint', () => { printing = true; settle(); });
      window.addEventListener('afterprint', () => { printing = false; });
    }
    reveals.set(plot, finish);
    visibility.observe(plot);
  }

  function create(host, opts) {
    const id = `lc${++uid}`;
    const kind = opts.size || (opts.small ? 'small' : 'mid');
    const pad = SIZE[kind] || SIZE.mid;
    const palette = (opts.palette || []).concat(ORDER);
    const all = opts.lines.map((l, i) => ({ ...l, color: HUE[l.hue] || (l.hue && /^#|^rgb/.test(l.hue) ? l.hue : HUE[palette[i % palette.length]]) }));
    const tiny = kind === 'spark' || kind === 'ribbon';
    const hasHead = opts.head ?? !tiny;
    const formatValue = opts.formatValue ?? value;
    let view = { ids: opts.show || all.map((l) => l.id), title: opts.title, unit: opts.unit, axisUnit: opts.axisUnit, floor: opts.floor, ceil: opts.ceil, stack: !!opts.stack };
    const band = opts.band ?? kind === 'hero';
    host.classList.add('chart', `chart--${kind}`);
    host.innerHTML = `${hasHead ? '<div class="chart__head"><span class="chart__name"></span><span class="chart__vals"></span></div>' : ''}
      <div class="chart__plot"><div class="chart__axis" aria-hidden="true"></div><p class="chart__wait"></p><span class="chart__flag" hidden></span><span class="chart__tip" hidden></span></div>`;
    const nameEl = host.querySelector('.chart__name');
    const valsEl = host.querySelector('.chart__vals');
    const plot = host.querySelector('.chart__plot');
    const axis = host.querySelector('.chart__axis');
    const wait = host.querySelector('.chart__wait');
    const tip = host.querySelector('.chart__tip');
    const flag = host.querySelector('.chart__flag');
    const svg = el('svg', { class: 'chart__svg', 'aria-hidden': 'true', 'pointer-events': 'none' });
    const curves = el('g', { class: 'chart__curves' });
    plot.prepend(svg);

    let payload = null, data = null, on = [], vals = {}, headKey = null;
    let gapNotes;
    let W = 0, H = 0, sc = null, scaleOpts = null, unit = view.unit || '', hover = null, cursor = null, marked = null, markText = '', markEl = null;
    const x = (t) => pad.left + ((t - data.t0) / (data.t1 - data.t0)) * (W - pad.left);
    const y = (v) => {
      const top = pad.top, bottom = H - pad.bottom;
      const c = Math.min(Math.max(v, sc.min), sc.max);
      return bottom - ((c - sc.min) / (sc.max - sc.min)) * (bottom - top);
    };

    // 头：一条线时名字用接口给的 label，几条时用 title、每条前面写自己的名字
    function heading(list) {
      if (!hasHead) return;
      const key = list.map((l) => l.id).join() + '|' + (view.title || '');
      if (key === headKey) return;
      headKey = key;
      const shown = list.length ? list : all.filter((l) => view.ids.includes(l.id)).slice(0, 1);
      nameEl.textContent = spaced(list.length === 1 && !view.title ? list[0].series?.label || list[0].label : view.title || shown[0]?.label || '').replace(/\s*[(（](?:次|次\/秒|次\/s|个|人|项|份|条|秒|分钟|小时|%|℃|W|V|A|kWh|度|ms|FPS|MHz|GHz|[GMKT]?B(?:\/s)?)[)）]\s*$/, '');
      nameEl.title = nameEl.textContent;
      valsEl.innerHTML = shown.map((l) => `<span class="chart__val" data-line="${esc(l.id)}" style="--c:${l.color}"><i class="chart__key"></i>${shown.length > 1 ? `<span class="chart__label">${esc(l.label)}</span>` : ''}<b>—</b></span>`).join('');
      vals = Object.fromEntries([...valsEl.querySelectorAll('.chart__val')].map((n) => [n.dataset.line, n.querySelector('b')]));
    }
    heading([]);

    // 叠起来画时：每条线的点换成“它加上它下面那几条”的和（同一时刻对齐），底是下面那条的和
    function stacked() {
      let below = new Map();
      return on.map((l) => {
        const pts = l.series.points.map(([t, v]) => [t, v == null || !Number.isFinite(v) ? null : v + (below.get(t) ?? 0)]);
        const base = new Map(below);
        below = new Map(pts.filter(([, v]) => v != null));
        return { l, pts, base };
      });
    }

    function draw() {
      svg.replaceChildren();
      curves.replaceChildren();
      gapNotes?.replaceChildren();
      cursor = null;
      if (!data || !W || !H) { axis.innerHTML = ''; return; }
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      const defs = el('defs');
      const clip = el('clipPath', { id: `${id}-plot` });
      clip.append(el('rect', { x: pad.left, y: pad.top, width: W - pad.left, height: H - pad.bottom - pad.top })); defs.append(clip);
      svg.append(defs);
      const layers = view.stack ? stacked() : on.map((l) => ({ l, pts: l.series.points, base: null }));
      // 缺测接着画的门槛：走势小线只看走势，缺口不到整段三分之一（24 小时里 8 小时）的接着画，不在末尾断出“一截线加一个点”；
      // 采样间隔大的（2 小时一点）缺一两个点也连得上。织锦的细丝带接 2 小时以内的，大图照实断开
      const bridge = tiny ? 0 : opts.bridge ?? 0, px = kind === 'spark' ? 12 : BUCKET;
      // 一段的折点：按像素分桶取平均；最后一桶钉到真的最后一个点上（不然线停在那一桶的平均时刻，离“现在”那颗点差半桶，像断了一截）
      const verts = (seg) => {
        const bk = buckets(seg, x, px), [t1, v1] = seg.at(-1), end = bk.at(-1);
        if (end && end[0] !== t1) {
          if (x(t1) - x(end[0]) < 2) bk[bk.length - 1] = [t1, v1, Math.min(end[2], v1), Math.max(end[3], v1)];
          else bk.push([t1, v1, v1, v1]);
        }
        return bk;
      };
      const parts = layers.map(({ l, pts }) => segments(pts, bridge, l.series.chart_window ? l.time.missingIntervals ?? [] : []).map(verts).filter((bk) => bk.length > 0));
      const dotRadius = 3.5;
      const markerX = t => opts.insetEdgeDots ? Math.min(x(t), W - dotRadius - 1) : x(t);
      if (!tiny) {
        const pattern = el('pattern', { id: `${id}-gap`, patternUnits: 'userSpaceOnUse', width: 8, height: 8 });
        pattern.append(el('path', { d: 'M-2 2L2-2M0 8L8 0M6 10L10 6', stroke: 'rgba(100,99,91,.14)', 'stroke-width': 1 })); defs.append(pattern);
        const split = on.some(l => l.series.chart_window && l.time.missingIntervals);
        const tracks = split ? layers.map(layer => ({ layers: [layer], time: layer.l.time, label: on.length > 1 ? layer.l.label : '', id: layer.l.id })) : [{ layers, time: data }];
        const gaps = [], height = H - pad.bottom - pad.top;
        let maskAttr = {};
        if (!split && data.missingIntervals) {
          // 保留后端区间边界，只从斜纹里挖出孤点的留白。
          const dots = parts.flat().filter(run => run.length === 1);
          if (data.missingIntervals.length && dots.length) {
            const bounds = { x: pad.left, y: pad.top, width: W - pad.left, height };
            const mask = el('mask', { ...bounds, id: `${id}-gap-mask`, maskUnits: 'userSpaceOnUse' });
            mask.append(el('rect', { ...bounds, fill: 'white' }));
            for (const [[t]] of dots) mask.append(el('rect', { ...bounds, x: x(t) - dotRadius, width: 2 * dotRadius, fill: 'black' }));
            defs.append(mask);
            maskAttr = { mask: `url(#${id}-gap-mask)` };
          }
        }
        tracks.forEach((track, i) => {
          const { t0, t1, missingIntervals } = track.time;
          const fromX = x(Math.max(t0, data.t0)), toX = x(Math.min(t1, data.t1));
          if (missingIntervals) {
            for (const [start, end, reason] of missingIntervals) {
              const from = Math.max(start, t0, data.t0), to = Math.min(end, t1, data.t1);
              if (to > from) gaps.push([x(from), x(to), typeof reason === 'string' ? reason.trim() : '', from, to, i, true]);
            }
            return;
          }
          // 旧包按原始实测范围合并，孤点只在画面上按半径留白。
          const ranges = track.layers.flatMap(({ pts }) => segments(pts).map((s) => {
            const radius = s.length === 1 ? dotRadius : 0;
            return [Math.max(fromX, x(s[0][0]) - radius), Math.min(toX, x(s.at(-1)[0]) + radius)];
          })).filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
          let end = fromX;
          for (const [a, b] of ranges) { if (a > end) gaps.push([end, a, '', null, null, i]); end = Math.max(end, b); }
          if (end < toX) gaps.push([end, toX, '', null, null, i]);
        });
        const laneHeight = tracks.length > 1 ? Math.min(18, height / tracks.length) : height;
        const together = split ? [] : [...new Set(on.map(l => l.time))].flatMap(t => t.offSpans).sort(([a], [b]) => a - b);
        const classified = gaps.flatMap(([start, end, reason, from, to, i, explicit]) => {
          if (!explicit && end - start < 2) return [];
          const pieces = [];
          let cursor = start;
          for (const [offStart, offEnd] of split ? tracks[i].time.offSpans : together) {
            const a = Math.max(cursor, x(offStart)), b = Math.min(end, x(offEnd));
            if (!(a < b)) continue;
            if (cursor < a) pieces.push([cursor, a, reason, from, offStart, i, explicit]);
            pieces.push([a, b, '', null, null, i, explicit, shutdownText([offStart, offEnd])]);
            cursor = b; from = offEnd;
          }
          if (cursor < end) pieces.push([cursor, end, reason, from, to, i, explicit]);
          return pieces;
        });
        for (const [a, b, reason, from, to, i, explicit, off] of classified) {
          const width = b - a;
          const track = tracks[i], top = pad.top + i * laneHeight;
          const gap = el('g', { class: 'chart__gap', ...(track.id ? { 'data-line': track.id } : {}) });
          gap.append(el('rect', { x: a, y: top, width, height: laneHeight, fill: `url(#${id}-gap)`, ...maskAttr }));
          svg.append(gap);
          if (!reason && !off && width <= 54) continue;
          const label = el('text', { x: (a + b) / 2, y: top + laneHeight / 2 + (tracks.length > 1 ? 4 : 0), fill: '#a8a69e', 'font-size': 12, 'text-anchor': 'middle' });
          const explanation = off || (track.label && reason ? `${track.label}：${reason}` : reason);
          label.textContent = explanation || '没记录';
          gap.append(label);
          if (!reason && !off) continue;
          const fits = label.getComputedTextLength() + 12 <= width;
          if (!fits) {
            if (width > 54) label.textContent = off ? '关机' : '没记录';
            else label.remove();
          }
          // SVG 整体对读屏隐藏，图下的说明始终可读。
          const note = document.createElement('p');
          note.className = 'chart__gap-note';
          note.style.cssText = fits ? 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)'
            : 'margin:4px 0 0;font-size:12px;color:#68665f;overflow-wrap:anywhere';
          note.textContent = off ? `${off}，电脑关着，这段没有读数` : `${gapTime(from)}–${gapTime(to)} 没有读数，${explanation}`;
          gapNotes ??= host.appendChild(document.createElement('div'));
          gapNotes.append(note);
        }
      }
      // 只画平均线（不画高低带）时，纵轴按画出来的线定，不按某一分钟的尖峰定（不然线只占下半截、上面空着）
      // 自动批次轴保留原始峰值，分桶平均后纵轴也要盖住真实批数。
      if (!band && !(unit === '批' && view.ceil == null)) {
        let lo = Infinity, hi = -Infinity;
        for (const list of parts) for (const bk of list) for (const [, v] of bk) { if (v < lo) lo = v; if (v > hi) hi = v; }
        if (view.stack) lo = Math.min(lo, 0);
        if (Number.isFinite(lo)) sc = scale(lo, hi, scaleOpts);
      }
      if (opts.glow) {
        const blur = el('filter', { id: `${id}-blur`, x: '-5%', y: '-40%', width: '110%', height: '180%' });
        blur.append(el('feGaussianBlur', { stdDeviation: '5' }));
        defs.append(blur);
      }

      // 横线（很淡）+ 坐标字（HTML，叠在图上）
      const grid = el('g', { class: 'chart__grid' });
      const labels = [];
      if (!tiny) {
        const ys = kind === 'hero' ? [sc.ticks[0], sc.ticks.at(-1)] : sc.ticks;
        for (const v of sc.ticks) {
          const yy = Math.round(y(v)) + .5;
          grid.append(el('line', { x1: pad.left, x2: W, y1: yy, y2: yy, class: v === sc.ticks[0] ? 'is-base' : '' }));
        }
        if (data.hasValues) for (const v of [...new Set(ys)]) labels.push(`<span class="chart__y" style="top:${y(v).toFixed(1)}px;width:${pad.left - 10}px">${esc(view.axisUnit === '' ? trim(v, 2) : v === 0 && unit !== 'GB' ? '0' : formatValue(v, unit))}</span>`);
        const freshEnd = !window.LiveUI?.offline?.() && Math.abs(Date.now() / 1000 - data.t1) < 90;
        const endText = freshEnd && on.some((l) => !l.series.stale && l.series.state !== 'stale' && l.series.points.at(-1)?.[1] != null && Math.abs(l.series.points.at(-1)[0] - data.t1) < 60) ? '现在' : when(data.t1, data);
        const endWidth = [...endText].reduce((n, c) => n + (/[一-鿿]/.test(c) ? 12 : 7), 0) + 14;
        const startText = opts.showStartDate && data.t1 - data.t0 > 36 * 3600 ? md(new Date(data.t0 * 1000)) : '';
        const startWidth = startText ? startText.length * 7 + 10 : 6;
        let ticks = timeTicks(data.t0, data.t1).filter(([t, text]) => {
          const xx = x(t), half = [...text].reduce((n, c) => n + (/[一-鿿]/.test(c) ? 12 : 7), 0) / 2;
          return xx - half >= pad.left + startWidth && xx + half <= W - (kind === 'hero' ? endWidth : 6);
        });
        if (kind === 'hero' && ticks.length > 4) ticks = ticks.filter((_, i) => i % Math.ceil(ticks.length / 4) === 0);
        for (const [t, text] of ticks) {
          const xx = Math.round(x(t)) + .5;
          grid.append(el('line', { x1: xx, x2: xx, y1: pad.top - 4, y2: H - pad.bottom, class: 'is-time' }));
          labels.push(`<span class="chart__x" style="left:${xx}px">${esc(text)}</span>`);
        }
        if (startText) labels.push(`<span class="chart__x is-now" style="left:${pad.left}px">${esc(startText)}</span>`);
        if (kind === 'hero') labels.push(`<span class="chart__x is-now" style="right:0">${esc(endText)}</span>`);
      }
      axis.innerHTML = labels.join('');
      markEl = el('g', { class: 'chart__mark' });
      svg.append(grid, markEl);
      mark(marked, markText);
      svg.append(curves);

      const bottom = H - pad.bottom;
      layers.forEach(({ l, pts, base }, li) => {
        const grad = el('linearGradient', { id: `${id}-${l.id}`, x1: 0, y1: 0, x2: 0, y2: 1 });
        grad.innerHTML = view.stack
          ? `<stop offset="0" stop-color="${l.color}" stop-opacity=".32"/><stop offset="1" stop-color="${l.color}" stop-opacity=".14"/>`
          : `<stop offset="0" stop-color="${l.color}" stop-opacity="${kind === 'ribbon' ? .42 : kind === 'spark' ? .16 : .22}"/><stop offset="${kind === 'ribbon' ? 1 : .85}" stop-color="${l.color}" stop-opacity="${kind === 'ribbon' ? .06 : 0}"/>`;
        defs.append(grad);
        let line = '', area = '', bandPath = '', gapPath = '';
        // 小线保留铺底连贯；大图缺口留给斜线标记。
        const runs = [];
        for (const bk of parts[li]) {
          const p = bk.map(([t, v]) => [x(t), y(v)]);
          const prev = runs.at(-1);
          if (tiny && prev) gapPath += `M${prev.p.at(-1).join(',')}L${p[0].join(',')}`;
          runs.push({ p, bk });
        }
        if (tiny && runs.length) {
          const first = runs[0].p[0], last = runs.at(-1).p.at(-1);
          if (first[0] > pad.left + 1) gapPath += `M${pad.left},${first[1]}L${first.join(',')}`;
          if (last[0] < W - 1) gapPath += `M${last.join(',')}L${W},${last[1]}`;
        }
        const dots = [];
        for (const { p, bk } of runs) {
          if (!tiny && p.length === 1) {
            const [[, cy]] = p, cx = markerX(bk[0][0]);
            dots.push(el('circle', { class: 'chart__dot', r: dotRadius, cx, cy, fill: l.color }));
            continue;
          }
          const d = curve(p); line += d;
          if (p.length < 2) continue;
          if (base) {
            const under = bk.map(([t]) => [x(t), y(base.get(Math.round(t)) ?? nearestBase(base, t))]).reverse();
            area += `${d}${curve(under, false)}Z`;
          } else area += `${d}L${p.at(-1)[0].toFixed(1)},${bottom}L${p[0][0].toFixed(1)},${bottom}Z`;
          if (band && !view.stack && bk.some(([, , lo, hi]) => hi - lo > 0)) {
            const top = bk.map(([t, , , hi]) => [x(t), y(hi)]), low = bk.map(([t, , lo]) => [x(t), y(lo)]).reverse();
            bandPath += `${curve(top)}${curve(low, false)}Z`;
          }
        }
        let clipId = `${id}-plot`;
        if (l.series.chart_window && (l.time.t0 > data.t0 || l.time.t1 < data.t1)) {
          clipId += `-${li}`;
          const left = Math.max(pad.left, x(l.time.t0)), right = Math.min(W, x(l.time.t1));
          const clip = el('clipPath', { id: clipId });
          clip.append(el('rect', { x: left, y: pad.top, width: Math.max(0, right - left), height: H - pad.bottom - pad.top }));
          defs.append(clip);
        }
        const g = el('g', { class: 'chart__line', 'clip-path': `url(#${clipId})`, style: `--c:${l.color}` });
        g.append(el('path', { d: area, fill: `url(#${id}-${l.id})`, class: 'chart__area' }));
        if (bandPath) g.append(el('path', { d: bandPath, class: 'chart__band' }));
        if (opts.glow) g.append(el('path', { d: line, class: 'chart__halo', filter: `url(#${id}-blur)` }));
        g.append(el('path', { d: line, class: 'chart__stroke' }));
        if (gapPath) g.append(el('path', { d: gapPath, class: 'chart__gap-link', fill: 'none', stroke: '#bcb9b1', 'stroke-width': 1.4, 'stroke-dasharray': '3 3' }));
        for (const dot of dots) g.append(dot);
        const last = pts.at(-1), lastRun = parts[li].at(-1);
        const edgeDot = (opts.showEdgeDot || opts.edgeDotLines?.includes(l.id)) && last && lastRun?.at(-1)?.[0] === last[0] &&
          last[0] >= l.time.t0 && last[0] <= l.time.t1 && Number.isFinite(last[1]);
        const dot = last && Number.isFinite(last[1]) && (tiny || lastRun?.length !== 1 || edgeDot)
          ? el('circle', { class: 'chart__now', r: tiny ? 2.5 : dotRadius, cx: markerX(last[0]).toFixed(1), cy: y(last[1]).toFixed(1) }) : null;
        if (dot && !edgeDot) g.append(dot);
        curves.append(g);
        if (edgeDot) {
          const markers = el('g', { class: 'chart__line', style: `--c:${l.color}` });
          markers.append(dot); curves.append(markers);
        }
      });

      // 指着的那一分钟：细竖线 + 每条线上一颗同色小灯
      cursor = el('g', { class: 'chart__cursor' });
      cursor.append(el('line', { y1: pad.top - 6, y2: H - pad.bottom }));
      for (const l of on) cursor.append(el('circle', { r: tiny ? 3 : 4.5, 'data-line': l.id, style: `--c:${l.color}` }));
      svg.append(cursor);
      point(hover);
    }
    function nearestBase(base, t) {
      let best = null, d = Infinity;
      for (const [k, v] of base) { const dd = Math.abs(k - t); if (dd < d) { d = dd; best = v; } }
      return best ?? 0;
    }

    const gapAt = (l, t) => l.time.missingIntervals?.find(([from, to]) => from <= t && t < to);
    const sample = (l, t) => {
      const { t0, t1, bucketSeconds, offset } = l.time;
      if (l.series.chart_window && (t < t0 || t > t1) || gapAt(l, t)) return null;
      const raw = l.series.read_points;
      if (raw?.values) {
        const bucket = bucketSeconds ? Math.floor((t - offset) / bucketSeconds) * bucketSeconds + offset : t;
        const i = bucketSeconds ? Math.max(0, Math.ceil((bucket - raw.start) / raw.step))
          : Math.max(0, Math.min(raw.values.length - 1, Math.ceil((t - raw.start) / raw.step - .5)));
        const at = raw.start + i * raw.step;
        return i < raw.values.length && (!bucketSeconds || at < bucket + bucketSeconds) ? [at, raw.values[i]] : null;
      }
      return sampleAt(raw?.points || l.series.points, t, bucketSeconds, offset);
    };
    // 头上的数：平时是最后一分钟，指着时是那一分钟
    function readout(t) {
      const out = [];
      for (const l of on) {
        const p = t == null ? [...l.series.points].reverse().find((q) => q[1] != null && Number.isFinite(q[1]))
          : sample(l, t);
        const v = p && p[1] != null && Number.isFinite(p[1]) ? p[1] : null;
        const unavailable = l.series.gap || l.series.reason;
        const off = t != null && v == null && l.time.offSpans.find(([a, b]) => a <= t && t < b);
        const reason = t != null && v == null && (off ? shutdownText(off) : gapAt(l, t)?.[2] ||
          (unavailable && !l.series.points.some(([, value]) => Number.isFinite(value)) && unavailable));
        const missing = l.time.bucketSeconds >= 86400 ? '这一天没采到' : l.time.bucketSeconds >= 3600 ? '这一小时没采到' : '这一分钟没采到';
        const text = formatValue(v, view.unit || l.series.unit) || (window.LiveUI?.offline?.() ? '' : reason || (t != null && l.time.bucketSeconds ? missing : window.LiveUI.collectionText(l.label, l.series)));
        out.push({ id: l.id, label: l.label, value: v, unit: view.unit || l.series.unit, text, at: v == null ? null : p[0], ...(reason ? { reason } : {}) });
        if (vals[l.id]) { vals[l.id].textContent = text; vals[l.id].style.cssText = v == null ? 'font-size:13.5px;font-weight:400;color:var(--muted)' : ''; }
      }
      opts.onRead?.(out, t);
    }

    function point(t) {
      hover = t;
      const off = !cursor || !data || t == null || t < data.t0 || t > data.t1;
      host.classList.toggle('is-pointing', !off);
      tip.hidden = off || tiny;
      if (off) {
        cursor?.classList.remove('is-on');
        if (data && t == null) readout(null); else opts.onRead?.([], t);
        return;
      }
      const xx = Math.round(x(t)) + .5;
      const rule = cursor.querySelector('line');
      rule.setAttribute('x1', xx);
      rule.setAttribute('x2', xx);
      let below = 0;
      for (const dot of cursor.querySelectorAll('circle')) {
        const i = on.findIndex((it) => it.id === dot.dataset.line), l = on[i];
        const p = sample(l, t);
        const ok = p && p[1] != null && Number.isFinite(p[1]);
        dot.style.display = ok ? '' : 'none';
        if (ok) {
          const at = l.time.bucketSeconds ? Math.max(p[0], data.t0, l.time.t0) : p[0];
          dot.setAttribute('cx', x(at).toFixed(1)); dot.setAttribute('cy', y(p[1] + (view.stack ? below : 0)).toFixed(1));
        }
        below = ok ? below + p[1] : 0;
      }
      cursor.classList.add('is-on');
      const first = sample(on[0], t);
      tip.textContent = when(first?.[0] ?? t, data);
      tip.style.left = `${Math.min(Math.max(xx, pad.left + 30), W - 30)}px`;
      readout(t);
    }

    // 一刻：半透明粉色竖带（前后 10 分钟），大图顶上一颗小药丸写一句；跨度超过 8 天的图不画
    function mark(t, text = '') {
      marked = t;
      markText = text;
      flag.hidden = true;
      if (!markEl) return;
      markEl.replaceChildren();
      if (t == null || !data || t < data.t0 || t > data.t1 || data.t1 - data.t0 > 8 * 86400) return;
      const a = x(Math.max(t - 600, data.t0)), b = x(Math.min(t + 600, data.t1)), xx = Math.round(x(t)) + .5;
      markEl.append(el('rect', { x: a.toFixed(1), y: pad.top - 6, width: Math.max(b - a, 3).toFixed(1), height: H - pad.bottom - pad.top + 6, rx: 3 }));
      markEl.append(el('line', { x1: xx, x2: xx, y1: pad.top - 6, y2: H - pad.bottom }));
      if (text && kind === 'hero') {
        flag.textContent = text;
        flag.hidden = false;
        flag.style.left = `${Math.min(Math.max(xx, pad.left + 50), W - 50)}px`;
      }
    }

    const send = (t) => (opts.sync ? opts.sync.at(t) : point(t));
    const source = { plot, clear: () => send(null) };
    if (!pointerEvents) {
      pointerEvents = true;
      window.addEventListener('pointermove', e => { if (pointerSource && e.pointerType === 'mouse' && !pointerSource.plot.contains(e.target)) clearPointer(); }, true);
      window.addEventListener('pointerout', e => { if (e.pointerType === 'mouse' && !e.relatedTarget) clearPointer(); });
      window.addEventListener('scroll', () => {
        if (!pointerSource) return;
        const { plot, clientX, clientY } = pointerSource;
        if (!plot.contains(document.elementFromPoint(clientX, clientY))) clearPointer();
      }, true);
      window.addEventListener('blur', clearPointer);
      document.addEventListener('visibilitychange', () => { if (document.hidden) clearPointer(); });
    }
    const atPointer = (e) => {
      if (!data) return;
      pointerSource = e.pointerType === 'mouse' ? source : null;
      if (pointerSource) { source.clientX = e.clientX; source.clientY = e.clientY; }
      const r = svg.getBoundingClientRect();
      const px = Math.min(Math.max((e.clientX - r.left) * W / r.width - pad.left, 0), W - pad.left);
      send(Math.round(data.t0 + (px / (W - pad.left)) * (data.t1 - data.t0)));
    };
    if (tiny) {
      plot.addEventListener('pointermove', atPointer);
      plot.addEventListener('pointerleave', () => { if (pointerSource === source) clearPointer(); });
    } else window.LiveUI.pointing(plot, atPointer, () => { if (pointerSource === source) clearPointer(); else send(null); });
    plot.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') atPointer(e); });
    const me = { point, mark };
    opts.sync?.add(me);

    function measure() {
      const w = Math.round(plot.clientWidth), h = Math.round(plot.clientHeight);
      if (w === W && h === H) return;
      W = w; H = h;
      draw();
    }
    new ResizeObserver(measure).observe(plot);

    function empty(text) {
      data = null;
      markEl = null;
      on = [];
      svg.replaceChildren();
      axis.innerHTML = '';
      gapNotes?.replaceChildren();
      flag.hidden = true;
      cursor = null;
      wait.textContent = tiny ? '' : window.LiveUI?.offline?.() ? '这块没存下来，连上后补上。' : text;
      wait.hidden = false;
      host.classList.add('is-empty');
      for (const b of Object.values(vals)) b.textContent = '—';
      opts.onRead?.([], null);
    }
    empty('正在读');

    function render(fade) {
      const byId = new Map((payload?.series || []).map((s) => [s.id, s]));
      const next = all.filter((l) => view.ids.includes(l.id) && byId.has(l.id)).map((l) => ({ ...l, series: byId.get(l.id) }));
      heading(next);
      if (!next.length) { empty(window.LiveUI.collectionText(opts.title || '', payload)); return false; }
      let lo = Infinity, hi = -Infinity;
      if (view.stack) {
        const tot = new Map();
        for (const l of next) for (const [t, v] of l.series.points) if (v != null && Number.isFinite(v)) tot.set(t, (tot.get(t) || 0) + v);
        for (const v of tot.values()) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
        if (tot.size) lo = Math.min(lo, 0);
      } else for (const l of next) for (const [, v] of l.series.points) if (v != null && Number.isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
      wait.classList.toggle('fog__text', !window.LiveUI?.offline?.() && next.some((l) => l.series.state === 'computing'));
      const hasValues = Number.isFinite(lo);
      if (!hasValues) {
        if (!tiny && next.some(l => l.series.chart_window?.missing_intervals?.some(g => g[2]))) { lo = 0; hi = 1; }
        else { empty([...new Set(next.map((l) => l.series.reason).filter(Boolean))].join('；') || (next.some((l) => l.series.state === 'computing') ? '正在读…' : '这段时间没有读数')); return true; }
      }
      unit = view.unit || next[0].series.unit;
      const span = next[0].series.from ? next[0].series : payload;
      const readWindow = (frame, timing) => ({ t0: Date.parse(frame.from) / 1000, t1: Date.parse(frame.to) / 1000,
        bucketSeconds: Number.isFinite(timing.bucket_seconds) && timing.bucket_seconds > 0 ? timing.bucket_seconds : 0,
        offset: timing.bucket_offset_seconds ?? 0, missingIntervals: Array.isArray(timing.missing_intervals) ? timing.missing_intervals : null,
        offSpans: (Array.isArray(timing.off_spans) ? timing.off_spans : []).filter(s => Number.isFinite(s?.[0]) && Number.isFinite(s[1]) && s[0] < s[1]).sort(([a], [b]) => a - b) });
      data = { ...readWindow(span, payload), hasValues };
      on = next.map(l => ({ ...l, time: l.series.chart_window ? readWindow({ ...span, ...l.series.chart_window }, { ...payload, ...l.series.chart_window }) : data }));
      const durations = on.filter(l => l.series.from && l.series.chart_window).map(l => l.time);
      if (durations.length) { data.t0 = Math.min(...durations.map(t => t.t0)); data.t1 = Math.max(...durations.map(t => t.t1)); }
      const total = byId.get('total');
      if (total?.points && data.bucketSeconds === 3600 && unit === '批' && view.ceil == null && !view.stack) {
        const totalSpan = total.from ? total : payload;
        if (Date.parse(totalSpan.from) / 1000 === data.t0 && Date.parse(totalSpan.to) / 1000 === data.t1) {
          const firstHour = Math.floor(data.t0 / 3600) * 3600;
          for (const [t, v] of total.points) {
            if (t >= firstHour && t <= data.t1 && Number.isFinite(v)) hi = Math.max(hi, v);
          }
        }
      }
      scaleOpts = { floor: view.floor, ceil: view.ceil, unit, labelled: !tiny, lines: pad.lines || 2 };
      sc = scale(lo, hi, scaleOpts);
      wait.hidden = true;
      host.classList.remove('is-empty');
      W = 0;
      measure();
      readout(hover);
      if (fade) fadeIn();
      return true;
    }

    // 第一次有线：露出三成时从左往右画出来（700 毫秒，--mo-out；坐标字不动）。只这一次；以后每分钟重读不再画。
    // 换时间窗（24 小时 / 7 天这类，整段长短变了）：和换线一样 300 毫秒淡换，不硬切。
    let drawn = false, lastSpan = 0, reveal, fade;
    const rootStyle = () => getComputedStyle(document.documentElement);
    const speed = () => parseFloat(rootStyle().getPropertyValue('--mo-speed')) || 1;
    function finishDraw(play) {
      if (play && reveal) return;
      visibility?.unobserve(plot);
      reveals.delete(plot);
      reveal?.cancel();
      curves.style.clipPath = '';
      if (play) {
        const easing = rootStyle().getPropertyValue('--mo-out').trim() || 'cubic-bezier(.16,1,.3,1)';
        reveal = curves.animate({ clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }, { duration: 700 * speed(), easing });
        reveals.set(plot, finishDraw);
        const animation = reveal;
        animation.finished.then(() => { if (reveal === animation) reveals.delete(plot); }, () => {});
      }
    }
    function drawIn() {
      if (!moving() || typeof IntersectionObserver !== 'function' || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return;
      curves.style.clipPath = 'inset(0 100% 0 0)';
      watchReveal(plot, finishDraw);
    }
    function fadeIn() {
      finishDraw(false);
      fade?.cancel();
      if (moving()) fade = curves.animate({ opacity: [0, 1] }, { duration: 300 * speed(), easing: 'ease' });
    }

    return {
      set(next) {
        payload = next;
        const had = render(false);
        if (data) {
          const span = data.t1 - data.t0;
          if (lastSpan ? Math.abs(span - lastSpan) > lastSpan * 0.1 : next.fadeNewCharts) fadeIn();
          else if (!drawn) drawIn();
          drawn = true;
          lastSpan = span;
        }
        return had;
      },
      show(ids, o = {}) {
        view = { ids: [].concat(ids), title: o.title, unit: o.unit, axisUnit: o.axisUnit, floor: o.floor, ceil: o.ceil, stack: !!o.stack };
        headKey = null;
        return payload ? render(true) : false;
      },
      wait: empty,
      point,
      mark,
      destroy() { finishDraw(false); if (pointerSource === source) clearPointer(); opts.sync?.remove?.(me); },
    };
  }

  window.LiveChart = { date, create, sync, value, html, sum, buckets, finishReveals, hues: HUE };
})();

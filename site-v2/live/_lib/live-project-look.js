// 实况共用小件：每个项目自己的颜色和画（项目页、逐项明细页等都用这一个）。
//   LiveProjectLook.key(id)            → looks.json 的键：项目 id 的 UTF-8 FNV-1a（和 projects/page.js、project/page.js 同一算法）
//   LiveProjectLook.load()             → Promise<looks 对照表>（/live/project/looks.json，整页只取一次，取不到给 {}）
//   LiveProjectLook.of(id, looks, name)→ { key, known, glow: [a, b], img, thumb, banner, band, layout, frozen }
//       banner 是 16:9 的横幅（720×405，项目页变化卡片顶上的细条用）；band 是 4:1 的扁横条（960×240，项目页画册卡片顶上用，主体留在条里）；没有就往下退到大图。
//       looks.json 里有的照它（glow 两色、img、thumb、layout、frozen）；
//       没有的按项目 id（没有 id 用项目名）从下面十六种浅色里固定分两色：同一项目每次一样，不同项目尽量不撞，两色不会都是紫的；画用通用的那张。
//   LiveProjectLook.tones(look)        → 按下面 STRENGTH 算好的几种浓淡（各页同一套，一眼看得出是这个项目的颜色）
//   LiveProjectLook.paint(el, look)    → 在 el 上写变量：
//       --pj-glow-a / --pj-glow-b  原样的两色
//       --pj-tone / --pj-tone-2    主色（两色里更“有颜色”的那个，加深一点）、副色
//       --pj-wash                  整页铺底（主色和底纸调好的淡色）
//       --pj-wash-deep / --pj-wash-2  整页上角的两团（主色、副色，比铺底浓）
//       --pj-hero-a / --pj-hero-b  页头卡的渐变（主色 → 副色，玻璃后面）
// 强调色是网站的绿（#00A650），不在这里，也不按项目换。
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LiveProjectLook = api;
})(typeof window !== 'undefined' ? window : globalThis, () => {
  'use strict';
  const DEFAULT_IMG = '/live/img/projects.webp';   // 图址写全：构建只认写全的地址
  const LOOKS_URL = '/live/project/looks.json';
  // 十六种高级浅色（和 looks.json 里 glow 一样浅），色相跨开；紫色系三种，分两色时不让两色都落在紫色系
  const PALETTE = [
    { name: '晴空蓝', hex: '#cfe2f6' }, { name: '薄荷', hex: '#cdeedf' }, { name: '杏子', hex: '#f9dcc5' }, { name: '丁香', hex: '#e2d6f4', purple: true },
    { name: '柠檬', hex: '#f4ebbf' }, { name: '海雾', hex: '#c8e7ea' }, { name: '樱花', hex: '#f6d5e0' }, { name: '鼠尾草', hex: '#d9e6cb' },
    { name: '长春花', hex: '#d7dbf6', purple: true }, { name: '珊瑚', hex: '#f7d3c8' }, { name: '湖水', hex: '#cce0ec' }, { name: '抹茶', hex: '#e2e9c2' },
    { name: '藕荷', hex: '#ead4e6', purple: true }, { name: '沙丘', hex: '#ede0cb' }, { name: '青瓷', hex: '#cfe8de' }, { name: '雾蓝灰', hex: '#d9dfe9' },
  ];

  function hash(text) {
    let h = 0x811c9dc5;
    for (const byte of new TextEncoder().encode(String(text ?? ''))) h = Math.imul(h ^ byte, 0x01000193);
    return h >>> 0;
  }
  const key = id => hash(id || '').toString(16).padStart(8, '0');

  // 没登记的项目：第一色按散列落一格，第二色隔开至少四格（色相差得开），两色不同时是紫色系
  function fallback(seed) {
    const h = hash(seed), n = PALETTE.length, i = h % n;
    let j = (i + 4 + ((h >>> 8) % (n - 7))) % n;
    if (PALETTE[i].purple && PALETTE[j].purple) j = (j + 1) % n;
    return [PALETTE[i].hex, PALETTE[j].hex];
  }

  const hex = c => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c);

  // —— 浓淡：项目页、逐项明细页等共用这一套，要改浓淡只改这里 ——
  // 数是“这个项目的颜色占几成”，其余是底纸；deepen 是两色先各自压暗几个百分点（色相不变），浅到发白的颜色也认得出。
  const PAPER = '#faf9f5';
  const STRENGTH = { page: 0.5, glow: 0.88, second: 0.72, hero: 1, deepen: 0.05 };
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const toHex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return toHex(x.map((v, i) => v * t + y[i] * (1 - t))); };
  const chroma = h => { const c = rgb(h); return Math.max(...c) - Math.min(...c); };
  function deepen(h, d) {
    const [r, g, b] = rgb(h).map(v => v / 255), max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) return toHex([r, g, b].map(v => (v - d) * 255));
    const s = (max - min) / (1 - Math.abs(2 * l - 1));
    let hue = max === r ? ((g - b) / (max - min)) % 6 : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
    hue *= 60; if (hue < 0) hue += 360;
    const L = Math.max(0, l - d), C = (1 - Math.abs(2 * L - 1)) * s, X = C * (1 - Math.abs((hue / 60) % 2 - 1)), m = L - C / 2;
    const [r1, g1, b1] = hue < 60 ? [C, X, 0] : hue < 120 ? [X, C, 0] : hue < 180 ? [0, C, X] : hue < 240 ? [0, X, C] : hue < 300 ? [X, 0, C] : [C, 0, X];
    return toHex([r1 + m, g1 + m, b1 + m].map(v => v * 255));
  }
  function tones(look, strength = STRENGTH) {
    const [a, b] = look.glow, first = chroma(b) > chroma(a) ? b : a;
    const main = deepen(first, strength.deepen), second = deepen(first === b ? a : b, strength.deepen);
    return { main, second, wash: mix(main, PAPER, strength.page), washDeep: mix(main, PAPER, strength.glow), wash2: mix(second, PAPER, strength.second), heroA: mix(main, '#ffffff', strength.hero), heroB: mix(second, '#ffffff', strength.hero) };
  }
  function of(id, looks, name) {
    const k = key(id), look = looks?.[k];
    if (look && Array.isArray(look.glow) && look.glow.length === 2 && look.glow.every(hex)) {
      return { key: k, known: true, glow: [...look.glow], img: look.img || DEFAULT_IMG, thumb: look.thumb || look.img || DEFAULT_IMG, banner: look.banner || look.img || DEFAULT_IMG, band: look.band || look.banner || look.img || DEFAULT_IMG, layout: ['left', 'right', 'wide'].includes(look.layout) ? look.layout : 'right', frozen: look.frozen === true };
    }
    return { key: k, known: false, glow: fallback(id || name || ''), img: DEFAULT_IMG, thumb: DEFAULT_IMG, banner: DEFAULT_IMG, band: DEFAULT_IMG, layout: 'right', frozen: false };
  }

  let pending = null;
  function load() {
    if (!pending) pending = typeof fetch === 'function' ? fetch(LOOKS_URL).then(r => r.ok ? r.json() : {}).catch(() => ({})) : Promise.resolve({});
    return pending;
  }

  function paint(el, look) {
    if (!el?.style || !look?.glow) return;
    const t = tones(look);
    for (const [k, v] of [['--pj-glow-a', look.glow[0]], ['--pj-glow-b', look.glow[1]], ['--pj-tone', t.main], ['--pj-tone-2', t.second], ['--pj-wash', t.wash], ['--pj-wash-deep', t.washDeep], ['--pj-wash-2', t.wash2], ['--pj-hero-a', t.heroA], ['--pj-hero-b', t.heroB]]) el.style.setProperty(k, v);
  }

  return { key, load, of, tones, paint, fallback, PALETTE, STRENGTH, DEFAULT_IMG };
});

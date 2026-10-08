/*
 * 首页连环画“一句话，把一次旅行变成一部片子”会动（横版 + 手机竖版，一份脚本）。
 * 依赖：先加载 comic-data.js（window.COMIC_LIVE_DATA，两套位置数据），再加载本文件（defer）。
 *
 * 怎么选横竖：看两屏 <img> 当前实际显示的图（img.currentSrc 里是 "-v-" 还是 "-h-"）；
 *   网站是同一个 <img> 外面一个 <picture>，竖版图挂在 media="(orientation:portrait)" 的 <source> 上，
 *   转屏或窗口比例变了，浏览器换图并再触发一次 load，脚本跟着换数据。
 * 触发规则：
 *   横版：一屏（三格）露出 ≥30%（按“屏高和视口高里较小的那个”算）就整屏开演；第二屏最早在第一屏开演后 2.35（1 倍速秒）接着演。
 *   竖版：标题和每一格各自露出 ≥85% 才开演；几格同时在眼前时按 1→6 错开（标题→① 0.25，之后每格 0.7，1 倍速秒）。
 *   每格只演一次；横竖切换时，演过的（包括正演到一半的）都算演完，不再重演；没演过的按新那套的规则等着。
 * 系统设了“减少动态”：什么都不做，不建画布。
 * 速度：SPEED = 2.5，动效里写的秒数是“1 倍速”的，真实时间 = 它 ÷ SPEED。
 */
(() => {
'use strict';
const DATA = window.COMIC_LIVE_DATA;
if (!DATA) return;
const SPEED = 2.5;
const CFG = Object.assign({ targets: { A: '#home-02', B: '#home-03' } }, window.COMIC_LIVE_CONFIG || {});
const BASE = (document.currentScript && document.currentScript.src) ? new URL('.', document.currentScript.src).href : location.href;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ======================= 小工具（两套共用） =======================
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, d) => clamp((t - a) / d);
const eo = x => 1 - Math.pow(1 - x, 3);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const back = x => { const c = 1.9; return x <= 0 ? 0 : 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const bell = x => (x <= 0 || x >= 1) ? 0 : Math.sin(Math.PI * x);
const lerp = (a, b, x) => a + (b - a) * x;
const fade = q => (q > 0 && q < 1) ? 1 - q : 0;
const GREEN = '25,196,110';

// 素材：先带跨域声明取（网站素材在 OSS 另一个域名上，OSS 对 wly0829.cn 回了 Access-Control-Allow-Origin）；
// 取不到（本地双击、缓存里是不带跨域头的旧响应）再不带声明取一次。画布只往上画、不读回像素，所以退回去也照样能演。
function loadImg(src) {
  const url = new URL(src, BASE).href;
  return new Promise(r => {
    const go = cors => {
      const i = new Image();
      if (cors) i.crossOrigin = 'anonymous';
      i.onload = () => r(i);
      i.onerror = () => cors ? go(false) : r(null);
      i.src = url;
    };
    go(location.protocol !== 'file:');
  });
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function halo(c, x, y, r, a = 1, col = GREEN) {
  if (a <= 0) return;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(.4, `rgba(${col},${.55 * a})`); g.addColorStop(1, `rgba(${col},0)`);
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
}
function dot(c, x, y, r, a = 1) {
  if (a <= 0) return;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${GREEN},${.6 * a})`); g.addColorStop(.45, `rgba(${GREEN},${.32 * a})`); g.addColorStop(1, `rgba(${GREEN},0)`);
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  const rc = r * .36;
  c.fillStyle = `rgba(236,255,244,${a})`; c.beginPath(); c.arc(x, y, rc, 0, 7); c.fill();
  c.strokeStyle = `rgba(6,105,55,${a})`; c.lineWidth = Math.max(3, r * .11); c.stroke();
}
function ring(c, x, y, r, a, w = 5, col = GREEN) {
  if (a <= 0) return;
  c.strokeStyle = `rgba(${col},${a})`; c.lineWidth = w; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
}
// 发光描边：横版线宽 GLOW_H，竖版图里的东西相对小一点，用 GLOW_V
const GLOW_H = [[22, .12], [13, .22], [6, .55], [3, 1]], GLOW_V = [[20, .12], [12, .22], [6, .55], [3, 1]];
function glowRect(c, x, y, w, h, r, a, rot = 0, widths = GLOW_H) {
  if (a <= 0) return;
  c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(rot);
  for (const [lw, k] of widths) {
    c.strokeStyle = `rgba(${GREEN},${a * k})`; c.lineWidth = lw; rr(c, -w / 2, -h / 2, w, h, r); c.stroke();
  }
  c.restore();
}
function glowPolyH(c, pts, a, except = []) {   // 照片是斜的；except 里是压在上面的别的照片，那里不画
  if (a <= 0) return;
  c.save();
  if (except.length) {
    c.beginPath(); c.rect(0, 0, 2880, 1600);
    for (const e of except) { c.moveTo(...e[0]); for (const p of e.slice(1)) c.lineTo(...p); c.closePath(); }
    c.clip('evenodd');
  }
  c.lineJoin = 'round';
  for (const [lw, k] of [[24, .14], [14, .25], [7, .6], [3.5, 1]]) {
    c.strokeStyle = `rgba(${GREEN},${a * k})`; c.lineWidth = lw;
    c.beginPath(); c.moveTo(...pts[0]); for (const p of pts.slice(1)) c.lineTo(...p); c.closePath(); c.stroke();
  }
  c.restore();
}
function glowPolyV(c, pts, a) {
  if (a <= 0) return;
  c.save(); c.lineJoin = 'round';
  for (const [lw, k] of [[20, .14], [12, .25], [6, .6], [3, 1]]) {
    c.strokeStyle = `rgba(${GREEN},${a * k})`; c.lineWidth = lw;
    c.beginPath(); c.moveTo(...pts[0]); for (const p of pts.slice(1)) c.lineTo(...p); c.closePath(); c.stroke();
  }
  c.restore();
}
function pathOf(pts) {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1];
  return q => {
    const d = clamp(q) * tot; let i = 1;
    while (i < L.length - 1 && L[i] < d) i++;
    const k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)];
  };
}
function comet(c, P, q, r, tailLen = .3) {
  if (q <= 0 || q >= 1) return;
  const n = 16; c.lineCap = 'round';
  for (let k = n; k >= 1; k--) {
    const q1 = q - tailLen * (k - 1) / n; if (q1 <= 0) continue;
    const q0 = Math.max(0, q - tailLen * k / n), f = 1 - k / (n + 1);
    const [x0, y0] = P(q0), [x1, y1] = P(q1);
    c.strokeStyle = `rgba(${GREEN},${.35 * f})`; c.lineWidth = r * .9 * f + 2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    c.strokeStyle = `rgba(8,120,62,${.85 * f})`; c.lineWidth = r * .32 * f + 2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
  }
  const [x, y] = P(q); dot(c, x, y, r, 1);
}
function popRegion(c, img, x, y, w, h, s, a = 1) {
  if (s <= 1.0005 && a >= 1) return;
  const cx = x + w / 2, cy = y + h / 2;
  c.save(); c.globalAlpha = a;
  c.drawImage(img, x, y, w, h, cx - w * s / 2, cy - h * s / 2, w * s, h * s);
  c.restore();
}
const tmp = document.createElement('canvas'), tctx = tmp.getContext('2d');
function wipeDraw(c, im, x, y, w, h, p, dir) {      // 标题：'diag' 斜着从左上往右下扫，'x' 从左往右
  if (p <= 0) return;
  if (p >= 1) { c.drawImage(im, x, y); return; }
  tmp.width = w; tmp.height = h;
  tctx.globalCompositeOperation = 'source-over'; tctx.clearRect(0, 0, w, h); tctx.drawImage(im, 0, 0);
  tctx.globalCompositeOperation = 'destination-in';
  const soft = .22, e = p * (1 + soft);
  const g = dir === 'x' ? tctx.createLinearGradient(0, 0, w, 0) : tctx.createLinearGradient(0, 0, w * .75, h);
  g.addColorStop(clamp(e - soft), 'rgba(0,0,0,1)'); g.addColorStop(clamp(e), 'rgba(0,0,0,0)');
  tctx.fillStyle = g; tctx.fillRect(0, 0, w, h);
  c.drawImage(tmp, x, y);
}
const ENT = 0.875;      // 每格先入场（水彩晕开），1 倍速秒
const titleDraw = (G, IMG) => (c, u) => {
  const T = G.A.title;
  c.fillStyle = '#fefefe'; c.fillRect(...T.cover);
  T.chars.forEach((ch, i) => wipeDraw(c, IMG.chars[i], ch.x, ch.y, ch.w, ch.h, eo(seg(u, i * 0.105, 0.42)), 'diag'));
  const U = T.under; wipeDraw(c, IMG.under, U.x, U.y, U.w, U.h, eio(seg(u, 1.5, 0.8)), 'x');
};
// 两套都要的素材：标题分字、下划线、第 4 格声纹补丁、三张纸的补丁和逐行图层；竖版多第 5 格三块补丁
async function loadCommon(G, extra = []) {
  const D = G.B.p4docs;
  const [chars, under, p4bars, p4docs, p4lines, ...rest] = await Promise.all([
    Promise.all(G.A.title.chars.map(ch => loadImg(ch.src))), loadImg(G.A.title.under.src),
    loadImg(G.B.p4bars.patch.src), Promise.all(D.map(d => loadImg(d.patch.src))),
    Promise.all(D.map(d => Promise.all(d.lines.map(l => loadImg(l.src))))),
    ...extra.map(s => loadImg(s)),
  ]);
  return { chars, under, p4bars, p4docs, p4lines, rest };
}

// ======================= 横版（2880 宽） =======================
function buildH(G) {
  const IMG = {};
  const W = 2880, SA = { id: 'A', w: W, h: 1504 }, SB = { id: 'B', w: W, h: 1480 };
  const cardRect = (scr, f) => [f[0] * W + 6, f[1] * scr.h + 6, f[2] * W - 12, f[3] * scr.h - 12];
  const cardFull = (scr, f) => [f[0] * W, f[1] * scr.h, f[2] * W, f[3] * scr.h];
  const CARDS_A = [[0.017344, 0.306987, 0.318182, 0.678121], [0.344498, 0.306987, 0.310407, 0.678121], [0.663876, 0.306987, 0.320574, 0.678121]];
  const CARDS_B = [[0.017943, 0.013970, 0.316986, 0.846333], [0.340909, 0.013970, 0.318182, 0.847497], [0.665670, 0.013970, 0.317584, 0.847497]];
  const U = [];
  U.push({ name: 'title', scr: SA, t0: 0, dur: 2.4, clip: null, draw: titleDraw(G, IMG) });

  const P1_ARROW = pathOf([[537, 824], [580, 815], [620, 799], [660, 785], [700, 776], [740, 771], [780, 772], [810, 779], [832, 790], [845, 805], [851, 830]]);
  const P1_LINES = ['把这三天的照片、视频、录音', '整理好，剪个三分钟的片子，', '明早给我。'];
  U.push({
    name: 'p1', scr: SA, t0: 0.25, act: 5.0, card: cardFull(SA, CARDS_A[0]), clip: cardRect(SA, CARDS_A[0]),
    draw(c, u) {
      const wa = bell(seg(u, 0, 1.9));
      if (wa > 0) {
        c.lineCap = 'round'; c.lineWidth = 4;
        for (let i = -4; i <= 4; i++) {
          const h = (6 + 22 * Math.abs(Math.sin(u * 13 + i * 1.7)) * (1 - Math.abs(i) / 6)) * wa;
          c.strokeStyle = `rgba(110,255,170,${.95 * wa})`;
          c.beginPath(); c.moveTo(436 + i * 6.5, 822 - h); c.lineTo(436 + i * 6.5, 822 + h); c.stroke();
        }
        const pg = c.createRadialGradient(492, 842, 0, 492, 842, 70);
        pg.addColorStop(0, `rgba(170,255,210,${.45 * wa})`); pg.addColorStop(1, 'rgba(170,255,210,0)');
        c.fillStyle = pg; c.beginPath(); c.arc(492, 842, 70, 0, 7); c.fill();
      }
      const s = back(seg(u, 0.2, 0.42)), fa = 1 - seg(u, 4.55, 0.45);
      if (s > 0 && fa > 0) {
        const bx = 446, by = 506, bw = 494, bh = 174, tipX = 515, tipY = 774, LH = 47;
        c.save(); c.globalAlpha = fa;
        c.translate(tipX, tipY); c.scale(s, s); c.translate(-tipX, -tipY);
        c.fillStyle = 'rgba(255,255,255,.97)'; c.strokeStyle = '#19b764'; c.lineWidth = 4;
        rr(c, bx, by, bw, bh, 28); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(492, by + bh - 2); c.lineTo(tipX, tipY); c.lineTo(546, by + bh - 2); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(492, by + bh); c.lineTo(tipX, tipY); c.lineTo(546, by + bh); c.stroke();
        c.fillStyle = 'rgba(255,255,255,.97)'; c.fillRect(494, by + bh - 7, 50, 9);
        const total = P1_LINES.join('').length;
        const n = Math.floor(total * seg(u, 0.42, 1.5) + 1e-6);
        c.font = '600 35px "Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif';
        c.fillStyle = '#24456b'; c.textBaseline = 'alphabetic';
        let left = n, cur = null;
        P1_LINES.forEach((L, i) => {
          const part = L.slice(0, Math.max(0, left)); left -= L.length;
          c.fillText(part, bx + 20, by + 50 + i * LH);
          if (cur === null && part.length < L.length) cur = [i, c.measureText(part).width];
        });
        if (cur && u > 0.42) { c.fillStyle = '#19b764'; c.fillRect(bx + 23 + cur[1], by + 18 + cur[0] * LH, 3.5, 40); }
        c.restore();
      }
      comet(c, P1_ARROW, eio(seg(u, 2.0, 0.8)), 46, .3);
      const ha = bell(seg(u, 2.75, 0.85));
      if (ha > 0) {
        c.save(); c.globalCompositeOperation = 'lighter';
        for (const [x, y, r, col] of [[799, 881, 46, '255,205,120'], [865, 882, 46, '255,205,120'], [830, 902, 54, '160,255,200']]) {
          const g = c.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `rgba(${col},${.6 * ha})`); g.addColorStop(1, `rgba(${col},0)`);
          c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
        }
        c.restore();
        ring(c, 851, 830, 10 + 40 * seg(u, 2.75, 0.6), .8 * (1 - seg(u, 2.75, 0.6)), 4);
      }
    }
  });

  const P2_STAR = [1437, 800];
  const P2_CARDS = [
    { r: [1082, 567, 190, 128], m: [1362, 732], e: [1274, 652] },
    { r: [1342, 516, 190, 120], m: [1437, 708], e: [1437, 638] },
    { r: [1602, 567, 192, 128], m: [1505, 732], e: [1602, 655] },
    { r: [1057, 743, 194, 130], m: [1316, 800], e: [1252, 800] },
    { r: [1621, 752, 196, 136], m: [1558, 800], e: [1622, 800] },
  ].map(o => ({ ...o, P: pathOf([P2_STAR, o.m, o.e]) }));
  U.push({
    name: 'p2', scr: SA, t0: 0.95, act: 3.0, card: cardFull(SA, CARDS_A[1]), clip: cardRect(SA, CARDS_A[1]),
    draw(c, u, img) {
      const ang = -(1 - eo(seg(u, 0, 1.1))) * Math.PI * 0.8;
      if (ang < -0.001) {
        c.save(); c.beginPath(); c.arc(P2_STAR[0], P2_STAR[1], 68, 0, 7); c.clip();
        c.translate(P2_STAR[0], P2_STAR[1]); c.rotate(ang);
        c.drawImage(img, P2_STAR[0] - 70, P2_STAR[1] - 70, 140, 140, -70, -70, 140, 140);
        c.restore();
      }
      ring(c, P2_STAR[0], P2_STAR[1], 60 + 70 * eo(seg(u, 0.35, 0.7)), .6 * fade(seg(u, 0.35, 0.7)), 5);
      P2_CARDS.forEach((k, i) => {
        const go = 0.55 + i * 0.27, arrive = go + 0.42;
        const [x, y, w, h] = k.r;
        popRegion(c, img, x, y, w, h, 1 + 0.07 * bell(seg(u, arrive, 0.32)));
        const dim = .74 * (1 - eo(seg(u, arrive, 0.28)));
        if (dim > 0) { c.fillStyle = `rgba(250,252,250,${dim})`; rr(c, x + 6, y + 6, w - 12, h - 12, 12); c.fill(); }
        glowRect(c, x + 2, y + 2, w - 4, h - 4, 14, bell(seg(u, arrive, 0.6)));
        comet(c, k.P, eio(seg(u, go, 0.42)), 40, .35);
      });
    }
  });

  const P3_T = [[2160, 567, 144, 112, 1], [2311, 566, 118, 114, 1], [2436, 567, 107, 112, 0], [2152, 687, 151, 112, 1], [2309, 687, 116, 113, 1], [2435, 690, 106, 112, 0]];
  const P3_CHECK = [[2281, 657], [2405, 659], null, [2280, 779], [2405, 780], null];
  const P3_BG = 'rgb(244,249,249)';
  const P3_FEED = pathOf([[2032, 905], [2060, 840], [2110, 760], [2170, 690], [2225, 640]]);
  U.push({
    name: 'p3', scr: SA, t0: 1.65, act: 3.4, card: cardFull(SA, CARDS_A[2]), clip: cardRect(SA, CARDS_A[2]),
    draw(c, u, img) {
      for (let k = 0; k < 3; k++) comet(c, P3_FEED, eio(seg(u, 0.02 + k * 0.17, 0.55)), 44, .4);
      P3_T.forEach(([x, y, w, h, keep], i) => {
        const f0 = 0.45 + 0.24 * i, p = seg(u, f0, 0.5);
        const cx = x + w / 2;
        if (p < 1) {
          c.fillStyle = P3_BG; c.fillRect(x - 3, y - 3, w + 6, h + 6);
          if (p < .5) {
            const sx = 1 - eio(p * 2);
            c.save(); c.translate(cx, 0); c.scale(Math.max(sx, .001), 1); c.translate(-cx, 0);
            c.fillStyle = '#e4efe8'; c.strokeStyle = '#bcd8c6'; c.lineWidth = 3; rr(c, x + 2, y + 2, w - 4, h - 4, 9); c.fill(); c.stroke();
            c.fillStyle = '#c9e0d1';
            c.beginPath(); c.moveTo(x + w * .2, y + h * .74); c.lineTo(x + w * .42, y + h * .4); c.lineTo(x + w * .58, y + h * .62);
            c.lineTo(x + w * .68, y + h * .5); c.lineTo(x + w * .82, y + h * .74); c.closePath(); c.fill();
            c.beginPath(); c.arc(x + w * .7, y + h * .3, h * .08, 0, 7); c.fill();
            c.restore();
          } else {
            const sx = eo((p - .5) * 2);
            c.drawImage(img, x, y, w, h, cx - w * sx / 2, y, w * sx, h);
          }
        }
        const land = f0 + 0.5;
        if (keep) {
          const q = seg(u, land, 0.45); const [kx, ky] = P3_CHECK[i];
          ring(c, kx, ky, 20 + 30 * eo(q), .9 * fade(q), 5);
          glowRect(c, x, y, w, h, 10, .8 * bell(seg(u, land, 0.5)));
        } else {
          const q = seg(u, land + 0.05, 0.55), e = eio(q);
          if (q > 0 && q < 1) {
            const tx = 2660 - (x + w / 2), ty = (i === 2 ? 610 : 730) - (y + h / 2), s = 1 - .25 * e;
            c.save(); c.globalAlpha = .75 * (1 - q);
            c.drawImage(img, x, y, w, h, x + tx * e + w * (1 - s) / 2, y + ty * e + h * (1 - s) / 2, w * s, h * s);
            c.restore();
          }
        }
      });
      [[2635.5, 900.5, 2.5], [2752.5, 910.5, 2.68]].forEach(([x, y, t]) => {
        const q = seg(u, t, 0.55);
        ring(c, x, y, 18 + 40 * eo(q), .9 * fade(q), 5);
        halo(c, x, y, 50, .5 * bell(q));
      });
    }
  });

  const P4_MIC = [165, 208];
  const P4_DOWN = [pathOf([[300, 312], [326, 380]]), pathOf([[470, 300], [490, 370]])];
  const P4_RIGHT = [
    { P: pathOf([[620, 200], [692, 226]]), poly: [[707, 138], [940, 151], [936, 306], [700, 318]] },
    { P: pathOf([[602, 296], [692, 352]]), poly: [[713, 286], [949, 313], [944, 469], [702, 457]] },
    { P: pathOf([[626, 420], [700, 498]]), poly: [[722, 441], [954, 472], [938, 660], [685, 619]] },
  ];
  U.push({
    name: 'p4', scr: SB, t0: 0, act: 3.2, card: cardFull(SB, CARDS_B[0]), clip: cardRect(SB, CARDS_B[0]),
    draw(c, u) {
      for (const t of [0, 0.38]) { const q = seg(u, t, 0.95); ring(c, P4_MIC[0], P4_MIC[1], 46 + 80 * eo(q), .6 * fade(q), 5); }
      const B4 = G.B.p4bars, x = 1 - seg(u, 1.45, 0.45);
      if (x > 0) {
        c.save(); c.globalAlpha = x; c.drawImage(IMG.p4bars, B4.patch.x, B4.patch.y); c.restore();
        if (u > 0) {
          c.lineCap = 'round';
          B4.bars.forEach(([bx, bw, y0, y1], i) => {
            const cy = (y0 + y1) / 2, hh = (y1 - y0) / 2;
            const k = clamp(0.25 + 0.95 * Math.abs(Math.sin(u * 10 + i * 0.83)) * (0.6 + 0.4 * Math.sin(u * 4 + i * 0.3)), 0.15, 1.25);
            const hm = lerp(hh * k, hh, seg(u, 1.2, 0.3));
            c.strokeStyle = `rgba(30,170,95,${x})`; c.lineWidth = Math.max(5, bw);
            c.beginPath(); c.moveTo(bx, cy - hm); c.lineTo(bx, cy + hm); c.stroke();
          });
        }
      }
      P4_DOWN.forEach((P, i) => comet(c, P, eio(seg(u, 0.6 + i * 0.12, 0.35)), 34, .5));
      let k = 0;
      G.B.p4docs.forEach((d, di) => {
        const lines = d.lines, last = 1.0 + 0.11 * (k + lines.length - 1) + 0.22;
        if (u < last) c.drawImage(IMG.p4docs[di], d.patch.x, d.patch.y);
        lines.forEach((ln, li) => {
          const p = eo(seg(u, 1.0 + 0.11 * k, 0.22)); k++;
          if (u >= last || p <= 0) return;
          c.save(); c.beginPath(); c.rect(ln.x, ln.y, ln.w * p, ln.h); c.clip();
          c.drawImage(IMG.p4lines[di][li], ln.x, ln.y); c.restore();
        });
      });
      P4_RIGHT.forEach((o, i) => {
        const go = 2.0 + i * 0.13;
        comet(c, o.P, eio(seg(u, go, 0.3)), 34, .5);
        glowPolyH(c, o.poly, .95 * bell(seg(u, go + 0.28, 0.55)), P4_RIGHT.slice(i + 1).map(n => n.poly));
      });
    }
  });

  const P5_ROW = { clips: [1127, 284, 618, 145], clipsCol: 'rgb(29,50,63)', wave: [1127, 435, 622, 89], waveCol: 'rgb(19,41,48)', subs: [1127, 532, 630, 62], subsCol: 'rgb(28,48,61)' };
  const P5_CLIPS = [[1129, 1311], [1318, 1540], [1547, 1739]];
  const P5_TILES = [[1525, 70, 148, 148], [1698, 76, 145, 148]];
  const P5_SPARK = [[[1481, 84], [1498, 104]], [[1457, 118], [1489, 126]], [[1462, 168], [1490, 155]]];
  const P5_LENS = [1625, 581, 101], P5_CHECK = [1758, 552, 54];
  const LENS_SHAPES = [
    c => c.arc(P5_LENS[0], P5_LENS[1], P5_LENS[2], 0, 7),
    c => { c.moveTo(1680, 640); c.lineTo(1712, 622); c.lineTo(1835, 728); c.lineTo(1812, 760); c.closePath(); },
    c => c.arc(P5_CHECK[0], P5_CHECK[1], P5_CHECK[2], 0, 7),
  ];
  const restoreLens = (c, img) => { for (const f of LENS_SHAPES) { c.save(); c.beginPath(); f(c); c.clip(); c.drawImage(img, 1515, 470, 360, 300, 1515, 470, 360, 300); c.restore(); } };
  U.push({
    name: 'p5', scr: SB, t0: 0.7, act: 3.4, card: cardFull(SB, CARDS_B[1]), clip: cardRect(SB, CARDS_B[1]),
    draw(c, u, img) {
      P5_TILES.forEach(([x, y, w, h], i) => popRegion(c, img, x, y, w, h, 1 + 0.1 * bell(seg(u, i * 0.15, 0.5))));
      const sa = bell(seg(u, 0.05, 0.7));
      if (sa > 0) { c.lineCap = 'round'; for (const [a, b] of P5_SPARK) { c.strokeStyle = `rgba(${GREEN},${sa})`; c.lineWidth = 9; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); } }
      if (u < 1.45) {
        const [rx, ry, rw, rh] = P5_ROW.clips;
        c.fillStyle = P5_ROW.clipsCol; c.fillRect(rx, ry, rw, rh);
        c.save(); c.beginPath(); c.rect(rx, ry, rw, rh); c.clip();
        P5_CLIPS.forEach(([x0, x1], i) => {
          const p = seg(u, 0.35 + 0.3 * i, 0.45); if (p <= 0) return;
          c.globalAlpha = clamp(p * 2.5); const dx = (1 - eo(p)) * 150, w = x1 - x0;
          c.drawImage(img, x0, ry, w, rh, x0 + dx, ry, w, rh);
        });
        c.restore();
      }
      const ph = eio(seg(u, 1.3, 1.5)), px = lerp(1126, 1752, ph);
      if (u < 2.85) {
        c.save(); c.beginPath(); c.rect(px, 400, 1800 - px, 260); c.clip();
        for (const k of ['wave', 'subs']) { c.fillStyle = P5_ROW[k + 'Col']; c.fillRect(...P5_ROW[k]); }
        c.restore();
        restoreLens(c, img);
        const pa = seg(u, 1.15, 0.2) * (1 - seg(u, 2.8, 0.15));
        if (pa > 0) {
          const g = c.createLinearGradient(px - 18, 0, px + 18, 0);
          g.addColorStop(0, `rgba(${GREEN},0)`); g.addColorStop(.5, `rgba(${GREEN},${.45 * pa})`); g.addColorStop(1, `rgba(${GREEN},0)`);
          c.fillStyle = g; c.fillRect(px - 18, 284, 36, 316);
          c.fillStyle = `rgba(235,255,242,${pa})`; c.fillRect(px - 2, 284, 4, 316);
          c.beginPath(); c.moveTo(px - 13, 272); c.lineTo(px + 13, 272); c.lineTo(px, 290); c.closePath(); c.fill();
        }
      }
      const q = seg(u, 2.85, 0.5);
      ring(c, P5_CHECK[0], P5_CHECK[1], 40 + 40 * eo(q), .9 * fade(q), 6);
    }
  });

  const P6_SRC = [2040, 240, 210, 260];
  const P6_DRV = [{ to: [2425, 468], via: [2330, 250], led: [2447, 549] }, { to: [2655, 506], via: [2520, 230], led: [2772, 584] }];
  U.push({
    name: 'p6', scr: SB, t0: 1.4, act: 3.3, card: cardFull(SB, CARDS_B[2]), clip: cardRect(SB, CARDS_B[2]),
    draw(c, u, img) {
      const sa = bell(seg(u, 0, 3.0));
      if (sa > 0) {
        c.save(); c.globalCompositeOperation = 'lighter';
        const g = c.createRadialGradient(2600, 160, 0, 2600, 160, 190);
        g.addColorStop(0, `rgba(255,236,170,${.45 * sa})`); g.addColorStop(1, 'rgba(255,236,170,0)');
        c.fillStyle = g; c.beginPath(); c.arc(2600, 160, 190, 0, 7); c.fill(); c.restore();
      }
      { const q = seg(u, 0.05, 0.6); ring(c, 2148, 423, 44 + 46 * eo(q), .9 * fade(q), 6); }
      G.B.p6checks.forEach((ck, i) => {
        const D = P6_DRV[i], s0 = 0.45 + 0.35 * i, land = s0 + 0.75;
        const q = seg(u, s0, 0.75);
        if (q > 0 && q < 1) {
          const e = eio(q), x0 = P6_SRC[0] + P6_SRC[2] / 2, y0 = P6_SRC[1] + P6_SRC[3] / 2;
          const x = (1 - e) * (1 - e) * x0 + 2 * (1 - e) * e * D.via[0] + e * e * D.to[0];
          const y = (1 - e) * (1 - e) * y0 + 2 * (1 - e) * e * D.via[1] + e * e * D.to[1];
          const s = lerp(0.56, 0.16, e), w = P6_SRC[2] * s, h = P6_SRC[3] * s;
          c.save(); c.globalAlpha = 1 - seg(q, .82, .18); c.translate(x, y); c.rotate(lerp(0, 0.35 + 0.15 * i, e));
          c.fillStyle = '#fff'; rr(c, -w / 2 - 6, -h / 2 - 6, w + 12, h + 12, 8); c.fill();
          c.drawImage(img, ...P6_SRC, -w / 2, -h / 2, w, h);
          c.restore();
        }
        const la = u >= land ? (1 - seg(u, land + 0.9, 0.35)) * (0.75 + 0.25 * Math.sin((u - land) * 40)) : 0;
        if (la > 0) { halo(c, D.led[0], D.led[1], 24, la); c.fillStyle = `rgba(120,255,170,${la})`; c.beginPath(); c.arc(D.led[0], D.led[1], 4.5, 0, 7); c.fill(); }
        halo(c, D.to[0], D.to[1] + 10, 110, .28 * bell(seg(u, land, 0.6)));
        const s = 1 + 0.38 * bell(seg(u, land + 0.02, 0.42));
        if (s > 1.001) {
          c.save(); c.beginPath(); c.arc(ck.cx, ck.cy, ck.r * s, 0, 7); c.clip();
          c.drawImage(img, ck.cx - ck.r, ck.cy - ck.r, ck.r * 2, ck.r * 2, ck.cx - ck.r * s, ck.cy - ck.r * s, ck.r * 2 * s, ck.r * 2 * s);
          c.restore();
        }
        const rq = seg(u, land + 0.3, 0.5); ring(c, ck.cx, ck.cy, 34 + 36 * eo(rq), .9 * fade(rq), 5);
      });
    }
  });
  // 横版：一屏一组，整屏露出 30% 开演；第二屏最早在第一屏开演后 2.35 接着演
  const groups = [
    { scr: SA, area: [0, 0, W, SA.h], frac: 0.3, gap: 0, units: U.filter(p => p.scr === SA) },
    { scr: SB, area: [0, 0, W, SB.h], frac: 0.3, gap: 2.35, units: U.filter(p => p.scr === SB) },
  ];
  return {
    kind: 'h', W, screens: [SA, SB], units: U, groups, entryClip: false, IMG,
    async load() { const r = await loadCommon(G); Object.assign(IMG, r); },
  };
}

// ======================= 竖版（1280 宽） =======================
function buildV(G) {
  const IMG = {};
  const W = 1280, SA = { id: 'A', w: W, h: 4369 }, SB = { id: 'B', w: W, h: 4347 };
  const cardRect = (scr, f) => [f[0] * W + 6, f[1] * scr.h + 6, f[2] * W - 12, f[3] * scr.h - 12];
  const cardFull = (scr, f) => [f[0] * W, f[1] * scr.h, f[2] * W, f[3] * scr.h];
  const CARDS_A = [[0.02763018, 0.14788294, 0.94580234, 0.34277709], [0.02975558, 0.49813200, 0.94048884, 0.24782067], [0.03188098, 0.75902864, 0.93730074, 0.23723537]];
  const CARDS_B = [[0.02763018, 0.00375469, 0.94580234, 0.26220275], [0.02975558, 0.26689612, 0.94155154, 0.22934919], [0.02550478, 0.50375469, 0.94899044, 0.49249061]];
  const gr = (c, x, y, w, h, r, a) => glowRect(c, x, y, w, h, r, a, 0, GLOW_V);
  const U = [];
  U.push({ name: 'title', scr: SA, dur: 2.4, area: [0, 0, W, 395], clip: null, draw: titleDraw(G, IMG) });

  const P1_ARROW = pathOf([[593, 1125], [656, 1116], [720, 1094], [784, 1066], [847, 1036], [911, 1015], [960, 1008], [1010, 1010], [1045, 1020], [1068, 1033]]);
  const P1_LINES = ['把这三天的照片、视频、录音', '整理好，剪个三分钟的片子，', '明早给我。'];
  U.push({
    name: 'p1', scr: SA, act: 5.0, card: cardFull(SA, CARDS_A[0]), clip: cardRect(SA, CARDS_A[0]),
    draw(c, u) {
      const wa = bell(seg(u, 0, 1.9));
      if (wa > 0) {
        c.lineCap = 'round'; c.lineWidth = 5;
        for (let i = -4; i <= 4; i++) {
          const h = (8 + 29 * Math.abs(Math.sin(u * 13 + i * 1.7)) * (1 - Math.abs(i) / 6)) * wa;
          c.strokeStyle = `rgba(110,255,170,${.95 * wa})`;
          c.beginPath(); c.moveTo(590 + i * 8.6, 1072 - h); c.lineTo(590 + i * 8.6, 1072 + h); c.stroke();
        }
        const pg = c.createRadialGradient(522, 1150, 0, 522, 1150, 92);
        pg.addColorStop(0, `rgba(170,255,210,${.45 * wa})`); pg.addColorStop(1, 'rgba(170,255,210,0)');
        c.fillStyle = pg; c.beginPath(); c.arc(522, 1150, 92, 0, 7); c.fill();
      }
      const s = back(seg(u, 0.2, 0.42)), fa = 1 - seg(u, 4.55, 0.45);
      if (s > 0 && fa > 0) {
        const bx = 460, by = 690, bw = 535, bh = 195, tipX = 566, tipY = 1012, LH = 50, t0 = 505, t1 = 560;
        c.save(); c.globalAlpha = fa;
        c.translate(tipX, tipY); c.scale(s, s); c.translate(-tipX, -tipY);
        c.fillStyle = 'rgba(255,255,255,.97)'; c.strokeStyle = '#19b764'; c.lineWidth = 4;
        rr(c, bx, by, bw, bh, 28); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(t0, by + bh - 2); c.lineTo(tipX, tipY); c.lineTo(t1, by + bh - 2); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(t0, by + bh); c.lineTo(tipX, tipY); c.lineTo(t1, by + bh); c.stroke();
        c.fillStyle = 'rgba(255,255,255,.97)'; c.fillRect(t0 + 2, by + bh - 7, t1 - t0 - 4, 9);
        const total = P1_LINES.join('').length;
        const n = Math.floor(total * seg(u, 0.42, 1.5) + 1e-6);
        c.font = '600 38px "Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif';
        c.fillStyle = '#24456b'; c.textBaseline = 'alphabetic';
        let left = n, cur = null;
        P1_LINES.forEach((L, i) => {
          const part = L.slice(0, Math.max(0, left)); left -= L.length;
          c.fillText(part, bx + 22, by + 58 + i * LH);
          if (cur === null && part.length < L.length) cur = [i, c.measureText(part).width];
        });
        if (cur && u > 0.42) { c.fillStyle = '#19b764'; c.fillRect(bx + 25 + cur[1], by + 24 + cur[0] * LH, 3.5, 43); }
        c.restore();
      }
      comet(c, P1_ARROW, eio(seg(u, 2.0, 0.8)), 52, .3);
      const ha = bell(seg(u, 2.75, 0.85));
      if (ha > 0) {
        c.save(); c.globalCompositeOperation = 'lighter';
        for (const [x, y, r, col] of [[1090, 1072, 55, '255,205,120'], [1128, 1075, 62, '255,205,120'], [1185, 1068, 52, '255,205,120'], [1126, 888, 80, '160,255,200']]) {
          const g = c.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `rgba(${col},${.6 * ha})`); g.addColorStop(1, `rgba(${col},0)`);
          c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
        }
        c.restore();
        ring(c, 1068, 1033, 12 + 48 * seg(u, 2.75, 0.6), .8 * (1 - seg(u, 2.75, 0.6)), 4);
      }
    }
  });

  const P2_STAR = [810, 2487];
  const P2_CARDS = [
    { r: [537, 2278, 164, 104], m: [727, 2426], e: [688, 2378] },
    { r: [475, 2411, 158, 99], m: [723, 2480], e: [638, 2463] },
    { r: [510, 2540, 163, 101], m: [727, 2526], e: [675, 2563] },
    { r: [905, 2247, 178, 115], m: [888, 2426], e: [953, 2360] },
    { r: [995, 2400, 186, 113], m: [894, 2480], e: [992, 2458] },
    { r: [914, 2550, 178, 113], m: [885, 2526], e: [921, 2553] },
  ].map(o => ({ ...o, P: pathOf([P2_STAR, o.m, o.e]) }));
  const P2_STEP = 0.27 * 4 / 5;
  U.push({
    name: 'p2', scr: SA, act: 3.0, card: cardFull(SA, CARDS_A[1]), clip: cardRect(SA, CARDS_A[1]),
    draw(c, u, img) {
      const ang = -(1 - eo(seg(u, 0, 1.1))) * Math.PI * 0.8;
      if (ang < -0.001) {
        c.save(); c.beginPath(); c.arc(P2_STAR[0], P2_STAR[1], 66, 0, 7); c.clip();
        c.translate(P2_STAR[0], P2_STAR[1]); c.rotate(ang);
        c.drawImage(img, P2_STAR[0] - 68, P2_STAR[1] - 68, 136, 136, -68, -68, 136, 136);
        c.restore();
      }
      ring(c, P2_STAR[0], P2_STAR[1], 58 + 64 * eo(seg(u, 0.35, 0.7)), .6 * fade(seg(u, 0.35, 0.7)), 5);
      P2_CARDS.forEach((k, i) => {
        const go = 0.55 + i * P2_STEP, arrive = go + 0.42;
        const [x, y, w, h] = k.r;
        popRegion(c, img, x, y, w, h, 1 + 0.07 * bell(seg(u, arrive, 0.32)));
        const dim = .74 * (1 - eo(seg(u, arrive, 0.28)));
        if (dim > 0) { c.fillStyle = `rgba(250,252,250,${dim})`; rr(c, x + 6, y + 6, w - 12, h - 12, 11); c.fill(); }
        gr(c, x + 2, y + 2, w - 4, h - 4, 12, bell(seg(u, arrive, 0.6)));
        comet(c, k.P, eio(seg(u, go, 0.42)), 42, .35);
      });
    }
  });

  const P3_T = [[562, 3431, 105, 98, 1], [664, 3438, 110, 107, 0], [772, 3447, 111, 106, 1], [544, 3540, 107, 106, 0], [645, 3549, 113, 110, 1]];
  const P3_POLY = [[[576, 3431], [666, 3438], [659, 3528], [562, 3525]], null, [[783, 3448], [882, 3455], [871, 3552], [772, 3545]], null, [[659, 3550], [757, 3560], [750, 3658], [645, 3648]]];
  const P3_STACK = [811, 3618];
  const P3_FEED = pathOf([[452, 3650], [480, 3610], [520, 3565], [565, 3525], [605, 3495]]);
  const P3_STEP = 0.24 * 5 / 4;
  U.push({
    name: 'p3', scr: SA, act: 3.4, card: cardFull(SA, CARDS_A[2]), clip: cardRect(SA, CARDS_A[2]),
    draw(c, u, img) {
      const BG = `rgb(${G.A.p3cols.p3bg.join(',')})`;
      for (let k = 0; k < 3; k++) comet(c, P3_FEED, eio(seg(u, 0.02 + k * 0.17, 0.55)), 40, .4);
      let ci = 0;
      P3_T.forEach(([x, y, w, h, keep], i) => {
        const f0 = 0.45 + P3_STEP * i, p = seg(u, f0, 0.5);
        const cx = x + w / 2;
        if (p < 1) {
          c.fillStyle = BG; c.fillRect(x - 1, y - 1, w + 2, h + 2);
          if (p < .5) {
            const sx = 1 - eio(p * 2);
            c.save(); c.translate(cx, 0); c.scale(Math.max(sx, .001), 1); c.translate(-cx, 0);
            c.fillStyle = '#e4efe8'; c.strokeStyle = '#bcd8c6'; c.lineWidth = 3; rr(c, x + 2, y + 2, w - 4, h - 4, 8); c.fill(); c.stroke();
            c.fillStyle = '#c9e0d1';
            c.beginPath(); c.moveTo(x + w * .2, y + h * .74); c.lineTo(x + w * .42, y + h * .4); c.lineTo(x + w * .58, y + h * .62);
            c.lineTo(x + w * .68, y + h * .5); c.lineTo(x + w * .82, y + h * .74); c.closePath(); c.fill();
            c.beginPath(); c.arc(x + w * .7, y + h * .3, h * .08, 0, 7); c.fill();
            c.restore();
          } else {
            const sx = eo((p - .5) * 2);
            c.drawImage(img, x, y, w, h, cx - w * sx / 2, y, w * sx, h);
          }
        }
        const land = f0 + 0.5;
        if (keep) {
          const q = seg(u, land, 0.45), ck = G.A.p3checks[ci++];
          ring(c, ck.cx, ck.cy, 16 + 24 * eo(q), .9 * fade(q), 4.5);
          glowPolyV(c, P3_POLY[i], .8 * bell(seg(u, land, 0.5)));
        } else {
          const q = seg(u, land + 0.05, 0.55), e = eio(q);
          if (q > 0 && q < 1) {
            const tx = P3_STACK[0] - (x + w / 2), ty = P3_STACK[1] - (y + h / 2), s = 1 - .25 * e;
            c.save(); c.globalAlpha = .75 * (1 - q);
            c.drawImage(img, x, y, w, h, x + tx * e + w * (1 - s) / 2, y + ty * e + h * (1 - s) / 2, w * s, h * s);
            c.restore();
          }
        }
      });
      G.A.p3drives.forEach((d, i) => {
        const q = seg(u, [2.5, 2.68][i], 0.55);
        ring(c, d.cx, d.cy, 20 + 40 * eo(q), .9 * fade(q), 5);
        halo(c, d.cx, d.cy, 52, .5 * bell(q));
      });
    }
  });

  const P4_MIC = [225, 205];
  const P4_DOWN = [pathOf([[380, 292], [362, 380]]), pathOf([[525, 292], [548, 352]])];
  const P4_RIGHT = [
    { P: pathOf([[838, 183], [870, 182], [895, 165], [920, 140], [950, 132], [979, 132]]), r: [982, 61, 220, 150] },
    { P: pathOf([[838, 268], [870, 270], [895, 290], [925, 312], [979, 315]]), r: [982, 230, 220, 152] },
    { P: pathOf([[838, 359], [860, 368], [885, 395], [910, 430], [935, 450], [979, 452]]), r: [982, 400, 220, 150] },
  ];
  const P4_DOCS = { ticket: [1.0, 0.1], menu: [1.15, 0.1], page: [0.95, 0.08] };
  U.push({
    name: 'p4', scr: SB, act: 3.2, card: cardFull(SB, CARDS_B[0]), clip: cardRect(SB, CARDS_B[0]),
    draw(c, u) {
      for (const t of [0, 0.38]) { const q = seg(u, t, 0.95); ring(c, P4_MIC[0], P4_MIC[1], 52 + 88 * eo(q), .6 * fade(q), 5); }
      const B4 = G.B.p4bars, x = 1 - seg(u, 1.45, 0.45);
      if (x > 0) {
        c.save(); c.globalAlpha = x; c.drawImage(IMG.p4bars, B4.patch.x, B4.patch.y); c.restore();
        if (u > 0) {
          c.lineCap = 'round';
          B4.bars.forEach(([bx, bw, y0, y1], i) => {
            const cy = (y0 + y1) / 2, hh = (y1 - y0) / 2;
            const k = clamp(0.25 + 0.95 * Math.abs(Math.sin(u * 10 + i * 0.83)) * (0.6 + 0.4 * Math.sin(u * 4 + i * 0.3)), 0.15, 1.25);
            const hm = lerp(hh * k, hh, seg(u, 1.2, 0.3));
            c.strokeStyle = `rgba(30,170,95,${x})`; c.lineWidth = Math.max(6, bw);
            c.beginPath(); c.moveTo(bx, cy - hm); c.lineTo(bx, cy + hm); c.stroke();
          });
        }
      }
      P4_DOWN.forEach((P, i) => comet(c, P, eio(seg(u, 0.6 + i * 0.12, 0.35)), 38, .5));
      G.B.p4docs.forEach((d, di) => {
        const [s0, st] = P4_DOCS[d.name], lines = d.lines, last = s0 + st * (lines.length - 1) + 0.22;
        if (u < last) c.drawImage(IMG.p4docs[di], d.patch.x, d.patch.y);
        lines.forEach((ln, li) => {
          const p = eo(seg(u, s0 + st * li, 0.22));
          if (u >= last || p <= 0) return;
          c.save(); c.beginPath(); c.rect(ln.x, ln.y, ln.w * p, ln.h); c.clip();
          c.drawImage(IMG.p4lines[di][li], ln.x, ln.y); c.restore();
        });
      });
      P4_RIGHT.forEach((o, i) => {
        const go = 2.0 + i * 0.13;
        comet(c, o.P, eio(seg(u, go, 0.3)), 38, .5);
        gr(c, ...o.r, 16, .95 * bell(seg(u, go + 0.28, 0.55)));
      });
    }
  });

  const P5_ROW = { clips: [277, 1238, 586, 124] };
  const P5_CLIPS = [[285, 466], [479, 670], [685, 857]];
  const P5_TILES = [[906, 1369, 140, 196], [1052, 1400, 166, 182]];
  const P5_SPARK = [[[876, 1392], [896, 1410]], [[868, 1452], [898, 1452]], [[876, 1512], [896, 1494]]];
  const P5_LENS = [719, 1500, 83];
  const P5_PH = [283, 857];
  const restoreLens = (c, img) => {
    c.save(); c.beginPath(); c.arc(P5_LENS[0], P5_LENS[1], P5_LENS[2], 0, 7); c.clip();
    c.drawImage(img, P5_LENS[0] - 90, P5_LENS[1] - 90, 180, 180, P5_LENS[0] - 90, P5_LENS[1] - 90, 180, 180); c.restore();
  };
  U.push({
    name: 'p5', scr: SB, act: 3.4, card: cardFull(SB, CARDS_B[1]), clip: cardRect(SB, CARDS_B[1]),
    draw(c, u, img) {
      P5_TILES.forEach(([x, y, w, h], i) => popRegion(c, img, x, y, w, h, 1 + 0.1 * bell(seg(u, i * 0.15, 0.5))));
      const sa = bell(seg(u, 0.05, 0.7));
      if (sa > 0) { c.lineCap = 'round'; for (const [a, b] of P5_SPARK) { c.strokeStyle = `rgba(${GREEN},${sa})`; c.lineWidth = 8; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); } }
      if (u < 1.45) {
        const [rx, ry, rw, rh] = P5_ROW.clips;
        c.fillStyle = `rgb(${G.B.p5cols.clips.join(',')})`; c.fillRect(rx, ry, rw, rh);
        c.save(); c.beginPath(); c.rect(rx, ry, rw, rh); c.clip();
        P5_CLIPS.forEach(([x0, x1], i) => {
          const p = seg(u, 0.35 + 0.3 * i, 0.45); if (p <= 0) return;
          c.globalAlpha = clamp(p * 2.5); const dx = (1 - eo(p)) * 150, w = x1 - x0;
          c.drawImage(img, x0, ry, w, rh, x0 + dx, ry, w, rh);
        });
        c.restore();
      }
      const ph = eio(seg(u, 1.3, 1.5)), px = lerp(P5_PH[0], P5_PH[1], ph);
      if (u < 2.85) {
        const ra = 1 - seg(u, 2.55, 0.3), R = G.B.p5red;
        if (ra > 0) { c.save(); c.globalAlpha = ra; c.drawImage(IMG.p5red, R.x, R.y); c.restore(); }
        c.save(); c.beginPath(); c.rect(px, 1360, 900 - px, 160); c.clip();
        for (const k of ['p5wave', 'p5subs']) { const P = G.B[k]; c.drawImage(IMG[k], P.x, P.y); }
        c.restore();
        restoreLens(c, img);
        const pa = seg(u, 1.15, 0.2) * (1 - seg(u, 2.8, 0.15));
        if (pa > 0) {
          const g = c.createLinearGradient(px - 16, 0, px + 16, 0);
          g.addColorStop(0, `rgba(${GREEN},0)`); g.addColorStop(.5, `rgba(${GREEN},${.45 * pa})`); g.addColorStop(1, `rgba(${GREEN},0)`);
          c.fillStyle = g; c.fillRect(px - 16, 1240, 32, 268);
          c.fillStyle = `rgba(235,255,242,${pa})`; c.fillRect(px - 2, 1240, 4, 268);
          c.beginPath(); c.moveTo(px - 12, 1229); c.lineTo(px + 12, 1229); c.lineTo(px, 1245); c.closePath(); c.fill();
        }
      }
      const q = seg(u, 2.85, 0.5), CK = G.B.p5check;
      ring(c, CK.cx, CK.cy, 40 + 45 * eo(q), .9 * fade(q), 6);
    }
  });

  const P6_SRC = [215, 2600, 298, 330];
  const P6_DRV = [{ to: [707, 2816], via: [540, 2610] }, { to: [876, 2942], via: [680, 2600] }];
  U.push({
    name: 'p6', scr: SB, act: 3.3, card: cardFull(SB, CARDS_B[2]), clip: cardRect(SB, CARDS_B[2]),
    draw(c, u, img) {
      const sa = bell(seg(u, 0, 3.0));
      if (sa > 0) {
        c.save(); c.globalCompositeOperation = 'lighter';
        const g = c.createRadialGradient(998, 2398, 0, 998, 2398, 190);
        g.addColorStop(0, `rgba(255,236,170,${.45 * sa})`); g.addColorStop(1, 'rgba(255,236,170,0)');
        c.fillStyle = g; c.beginPath(); c.arc(998, 2398, 190, 0, 7); c.fill(); c.restore();
      }
      { const q = seg(u, 0.05, 0.6); ring(c, 376, 2795, 55 + 50 * eo(q), .9 * fade(q), 6); }
      G.B.p6checks.forEach((ck, i) => {
        const D = P6_DRV[i], LED = G.B.p6leds[i], s0 = 0.45 + 0.35 * i, land = s0 + 0.75;
        const q = seg(u, s0, 0.75);
        if (q > 0 && q < 1) {
          const e = eio(q), x0 = P6_SRC[0] + P6_SRC[2] / 2, y0 = P6_SRC[1] + P6_SRC[3] / 2;
          const x = (1 - e) * (1 - e) * x0 + 2 * (1 - e) * e * D.via[0] + e * e * D.to[0];
          const y = (1 - e) * (1 - e) * y0 + 2 * (1 - e) * e * D.via[1] + e * e * D.to[1];
          const s = lerp(0.5, 0.15, e), w = P6_SRC[2] * s, h = P6_SRC[3] * s;
          c.save(); c.globalAlpha = 1 - seg(q, .82, .18); c.translate(x, y); c.rotate(lerp(0, 0.35 + 0.15 * i, e));
          c.fillStyle = '#fff'; rr(c, -w / 2 - 6, -h / 2 - 6, w + 12, h + 12, 8); c.fill();
          c.drawImage(img, ...P6_SRC, -w / 2, -h / 2, w, h);
          c.restore();
        }
        const la = u >= land ? (1 - seg(u, land + 0.9, 0.35)) * (0.75 + 0.25 * Math.sin((u - land) * 40)) : 0;
        if (la > 0) { halo(c, LED.cx, LED.cy, 28, la); c.fillStyle = `rgba(120,255,170,${la})`; c.beginPath(); c.arc(LED.cx, LED.cy, 5.5, 0, 7); c.fill(); }
        halo(c, D.to[0], D.to[1] + 10, 130, .28 * bell(seg(u, land, 0.6)));
        const s = 1 + 0.38 * bell(seg(u, land + 0.02, 0.42));
        if (s > 1.001) {
          c.save(); c.beginPath(); c.arc(ck.cx, ck.cy, ck.r * s, 0, 7); c.clip();
          c.drawImage(img, ck.cx - ck.r, ck.cy - ck.r, ck.r * 2, ck.r * 2, ck.cx - ck.r * s, ck.cy - ck.r * s, ck.r * 2 * s, ck.r * 2 * s);
          c.restore();
        }
        const rq = seg(u, land + 0.3, 0.5); ring(c, ck.cx, ck.cy, 44 + 40 * eo(rq), .9 * fade(rq), 5);
      });
    }
  });
  // 竖版：标题和每格各自一组，露出 85% 开演；和前一组错开（标题→① 0.25，之后 0.7）
  const GAPS = [0, 0.25, 0.7, 0.7, 0.7, 0.7, 0.7];
  U.forEach(p => { p.t0 = 0; if (p.card) p.area = p.card; });
  const groups = U.map((p, i) => ({ scr: p.scr, area: p.area, frac: 0.85, gap: GAPS[i], units: [p] }));
  return {
    kind: 'v', W, screens: [SA, SB], units: U, groups, entryClip: true, IMG,
    async load() {
      const r = await loadCommon(G, [G.B.p5red.src, G.B.p5wave.src, G.B.p5subs.src]);
      Object.assign(IMG, r); [IMG.p5red, IMG.p5wave, IMG.p5subs] = r.rest;
    },
  };
}

const LAYOUTS = { h: buildH(DATA.h.geom), v: buildV(DATA.v.geom) };
// 两套的单元名一样（title、p1…p6），“都在眼前、按顺序连着演”时各单元的开演时刻也一样：
for (const L of Object.values(LAYOUTS)) {
  let t = 0;
  L.groups.forEach((g, gi) => { t = gi === 0 ? 0 : (L.kind === 'h' ? t + g.gap : t + g.gap); g.chain = t; });
  L.units.forEach(p => { if (p.card) p.dur = ENT + p.act; });
  L.groups.forEach(g => g.units.forEach(p => { p.chain = g.chain + p.t0; p.group = g; }));
}

// ======================= 入场（两套共用；竖版多一道裁剪，上下两格挨得近，放大时不压到邻格） =======================
const PAD = 8;
const mk = document.createElement('canvas'), mctx = mk.getContext('2d');
const cp = document.createElement('canvas'), cpx = cp.getContext('2d');
const BLOBS = Array.from({ length: 9 }, (_, j) => ({ a: j * 0.698 + 0.3, d: [0.12, 0.2, 0.28][j % 3], r: 0.55 + 0.1 * ((j * 37) % 5) / 4 }));
function entryCache(sc, p, k) {
  const [x, y, w, h] = p.card, Wc = Math.ceil((w + 2 * PAD) * k), Hc = Math.ceil((h + 2 * PAD) * k);
  if (p._cache && p._cache.width === Wc && p._cache.height === Hc && p._src === sc.src) return p._cache;
  const cv = p._cache || document.createElement('canvas'); cv.width = Wc; cv.height = Hc;
  const cx = cv.getContext('2d');
  cx.setTransform(k, 0, 0, k, -(x - PAD) * k, -(y - PAD) * k);
  cx.drawImage(sc.src, x - PAD, y - PAD, w + 2 * PAD, h + 2 * PAD, x - PAD, y - PAD, w + 2 * PAD, h + 2 * PAD);
  cx.save(); rr(cx, ...p.clip, 26); cx.clip(); p.draw(cx, -1, sc.src); cx.restore();
  p._src = sc.src;
  return (p._cache = cv);
}
function entry(c, sc, p, e, k, clipIt) {
  const [x, y, w, h] = p.card;
  c.fillStyle = '#fefefe'; c.fillRect(x - PAD, y - PAD, w + 2 * PAD, h + 2 * PAD);
  if (e <= 0) return;
  const src = entryCache(sc, p, k), Wc = src.width, Hc = src.height, R = Math.hypot(Wc, Hc) / 2, g = 1 - (1 - e) * (1 - e);
  if (mk.width !== Wc || mk.height !== Hc) { mk.width = Wc; mk.height = Hc; cp.width = Wc; cp.height = Hc; }
  mctx.clearRect(0, 0, Wc, Hc); cpx.globalCompositeOperation = 'source-over'; cpx.clearRect(0, 0, Wc, Hc);
  const blob = (bx, by, r) => {
    const gr = mctx.createRadialGradient(bx, by, 0, bx, by, r);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.72, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    mctx.fillStyle = gr; mctx.beginPath(); mctx.arc(bx, by, r, 0, 7); mctx.fill();
  };
  blob(Wc / 2, Hc / 2, R * 1.45 * g);
  for (const b of BLOBS) blob(Wc / 2 + Math.cos(b.a) * b.d * R * g * 2, Hc / 2 + Math.sin(b.a) * b.d * R * g * 2, R * b.r * g * 1.25);
  cpx.drawImage(src, 0, 0);
  cpx.globalCompositeOperation = 'destination-in'; cpx.drawImage(mk, 0, 0);
  const s = e < 0.6 ? lerp(0.9, 1.035, eo(e / 0.6)) : lerp(1.035, 1, eio((e - 0.6) / 0.4));
  const cxm = x + w / 2, cym = y + h / 2, dw = (w + 2 * PAD) * s, dh = (h + 2 * PAD) * s;
  if (clipIt) { c.save(); c.beginPath(); c.rect(x - 60, y - 14, w + 120, h + 28); c.clip(); }
  c.drawImage(cp, cxm - dw / 2, cym - dh / 2, dw, dh);
  if (clipIt) c.restore();
}

// ======================= 状态、时钟、画布、触发 =======================
// 每个单元的状态按名字记（title、p1…p6），横竖两套共用：idle 没演、play 在演（或已排上）、done 演完
const STATE = {};
for (const n of ['title', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6']) STATE[n] = 'idle';
let L = null;               // 当前用的那套
let ready = false, manual = false, raf = 0, virtualNow = null, gen = 0;
const clock = () => virtualNow ?? performance.now();
const SCR = {};             // A/B：{el, img, cv, ctx, src}

function placeCanvas(s) {    // 画布贴着 <img> 的显示框
  const { el, img, cv } = s;
  const er = el.getBoundingClientRect(), ir = img.getBoundingClientRect();
  Object.assign(cv.style, { left: (ir.left - er.left + el.clientLeft * 0) + 'px', top: (ir.top - er.top) + 'px', width: ir.width + 'px', height: ir.height + 'px' });
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(ir.width * dpr)), h = Math.max(1, Math.round(ir.height * dpr));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
}
function clearAll() { for (const s of Object.values(SCR)) { s.ctx.setTransform(1, 0, 0, 1, 0, 0); s.ctx.clearRect(0, 0, s.cv.width, s.cv.height); } }
function unitTime(p, now) {
  if (p.forceU !== undefined) return p.forceU;
  const g = p.group;
  if (STATE[p.name] === 'done') return Infinity;
  if (STATE[p.name] !== 'play' || g.startAt === undefined) return -1;
  const u = (now - g.startAt) / 1000 * SPEED - p.t0;
  return u < 0 ? -1 : u;
}
function render(scrDef, now) {
  const s = SCR[scrDef.id], c = s.ctx, cv = s.cv;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height);
  if (!L || !s.src) return;
  const k = cv.width / scrDef.w;
  for (const p of L.units) {
    if (p.scr !== scrDef) continue;
    let u = unitTime(p, now);
    if (u >= p.dur) { if (STATE[p.name] === 'play' && p.forceU === undefined) STATE[p.name] = 'done'; continue; }
    c.setTransform(k, 0, 0, k, 0, 0);
    if (p.card) {
      if (u < ENT) { entry(c, s, p, u < 0 ? 0 : u / ENT, k, L.entryClip); continue; }
      u -= ENT;
    }
    c.save();
    if (p.clip) { rr(c, ...p.clip, 26); c.clip(); }
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    p.draw(c, u, s.src);
    c.restore();
  }
}
const renderAll = now => { if (L) for (const d of L.screens) render(d, now); };
const busy = () => Object.values(STATE).includes('play');
function tick() {
  raf = 0; if (manual || virtualNow !== null || !ready) return;
  renderAll(clock());
  if (busy()) raf = requestAnimationFrame(tick);
}
function visibleEnough(g) {
  const s = SCR[g.scr.id], r = s.img.getBoundingClientRect(), k = r.width / g.scr.w;
  const top = r.top + g.area[1] * k, h = g.area[3] * k, vh = innerHeight;
  const seen = Math.min(top + h, vh) - Math.max(top, 0);
  return seen >= Math.min(h, vh) * g.frac;
}
function check() {
  if (!ready || manual || !L || pending) return;
  if (!SCR.A.img.complete || !SCR.B.img.complete) return;     // 正在换图（浏览器有待完成的新图）：先不判断，等 load
  if (kindNow() !== L.kind) return;
  const now = clock(); let started = false;
  L.groups.forEach((g, gi) => {
    const todo = g.units.filter(p => STATE[p.name] === 'idle');
    if (!todo.length || g.startAt !== undefined || !visibleEnough(g)) return;
    let at = now;
    const prev = L.groups[gi - 1];
    if (prev && prev.startAt !== undefined) at = Math.max(now, prev.startAt + g.gap / SPEED * 1000);
    g.startAt = at; for (const p of todo) STATE[p.name] = 'play'; started = true;
  });
  if (started && virtualNow === null && !raf) raf = requestAnimationFrame(tick);
}
let checkRaf = 0;
const scheduleCheck = () => { if (!checkRaf) checkRaf = requestAnimationFrame(() => { checkRaf = 0; check(); }); };

// 当前实际显示的是哪一版
// 先看图本身的宽高比（横版约 1.9:1，竖版约 0.29:1，不怕文件改名或换成 data: 地址），
// 图还没解码出来时再看文件名里的 -v- / -h-；都看不出来就先不演。两屏得是同一版才算。
function kindOf(img) {
  if (img.complete && img.naturalWidth && img.naturalHeight) return img.naturalWidth / img.naturalHeight < 1 ? 'v' : 'h';
  const src = img.currentSrc || '';
  if (/-v-/.test(src)) return 'v';
  if (/-h-/.test(src)) return 'h';
  return null;
}
function kindNow() {
  const a = kindOf(SCR.A.img), b = kindOf(SCR.B.img);
  return a && a === b ? a : null;
}
// 切到另一版：正在演的算演完（不重演），清掉画布（不留残影），换数据、等图解码好再接着按新规则判断
let pending = false, pendingTimer = 0;
function orientationChanged() {     // 转屏：先停下、清掉画布、正在演的算演完，等新图 load（最多等 2.5 秒）再按新那版来
  pending = true; ready = false; cancelAnimationFrame(raf); raf = 0;
  for (const n in STATE) if (STATE[n] === 'play') STATE[n] = 'done';
  clearAll();
  clearTimeout(pendingTimer); pendingTimer = setTimeout(() => { pending = false; activate(); }, 2500);
}
async function activate() {
  if (pending) return;
  const kind = kindNow();
  if (!kind) { ready = false; clearAll(); return; }
  if (L && L.kind === kind && ready) { for (const s of Object.values(SCR)) placeCanvas(s); renderAll(clock()); scheduleCheck(); return; }
  const my = ++gen;
  ready = false; cancelAnimationFrame(raf); raf = 0;
  for (const n in STATE) if (STATE[n] === 'play') STATE[n] = 'done';
  clearAll();
  const next = LAYOUTS[kind];
  if (!next._loaded) next._loaded = next.load();
  await next._loaded;
  for (const s of Object.values(SCR)) { try { await s.img.decode(); } catch (e) { /* 已解码或失败都照样往下 */ } }
  if (my !== gen || kindNow() !== kind) return;      // 等的过程中又换了，交给后来的那次
  // 取样源：<img> 用了 srcset 的宽度描述（1280w/2880w）时，它的 naturalWidth 是按显示密度折算过的，不是真实像素，
  // 直接拿它按原图坐标取样会错位。所以按 currentSrc 另开一个 Image（走浏览器缓存，不会重复下载）拿到真实像素尺寸；
  // 真实尺寸和数据的坐标宽度一样就直接用，不一样（网站给了 1920/640 宽的版本）就先放大到坐标宽度。
  const raws = await Promise.all(next.screens.map(d => new Promise(r => {
    const im = SCR[d.id].img, i = new Image();
    i.onload = () => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(() => r(i));
    i.onerror = () => r(im);
    i.src = im.currentSrc || im.src;
  })));
  if (my !== gen || kindNow() !== kind) return;
  next.screens.forEach((d, j) => {
    const s = SCR[d.id], im = raws[j];
    if (im.naturalWidth && im.naturalWidth !== d.w) {
      const off = document.createElement('canvas'); off.width = d.w; off.height = d.h;
      off.getContext('2d').drawImage(im, 0, 0, d.w, d.h); s.src = off;
    } else s.src = im;
  });
  for (const g of next.groups) g.startAt = undefined;
  for (const p of next.units) { delete p.forceU; p._cache = null; }
  L = next;
  for (const s of Object.values(SCR)) placeCanvas(s);
  for (const d of L.screens) { const k = SCR[d.id].cv.width / d.w; for (const p of L.units) if (p.card && p.scr === d && STATE[p.name] !== 'done') entryCache(SCR[d.id], p, k); }
  ready = true;
  renderAll(clock());
  check();
}

function init() {
  if (reduce) return;
  for (const id of ['A', 'B']) {
    const el = document.querySelector(CFG.targets[id]); if (!el) return;
    const img = el.querySelector('img'); if (!img) return;
    let cv = el.querySelector('canvas.comic-live');
    if (!cv) {
      cv = document.createElement('canvas'); cv.className = 'comic-live'; cv.setAttribute('aria-hidden', 'true');
      Object.assign(cv.style, { position: 'absolute', pointerEvents: 'none', zIndex: '6' });
      const pic = img.closest('picture') || img;
      pic.after(cv);                            // 盖过整卡静图（悬停最高为 5）；透明区保留卡片反馈，链接照常能点
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    }
    SCR[id] = { el, img, cv, ctx: cv.getContext('2d'), src: null };
    img.addEventListener('load', () => { if (pending) { pending = false; clearTimeout(pendingTimer); } activate(); });      // 换图（转屏、跨过断点）时浏览器会再触发 load
  }
  addEventListener('scroll', scheduleCheck, { passive: true });
  addEventListener('resize', () => activate());
  matchMedia('(orientation: portrait)').addEventListener('change', orientationChanged);
  activate();
}

// 验收用的定格入口（网站上不调用）
window.comicLive = {
  SPEED, LAYOUTS, STATE,
  get kind() { return L && L.kind; },
  get T() { return L ? Math.max(...L.units.map(p => p.chain + p.dur)) : 0; },
  ready: () => ready || reduce,
  seek(t) { manual = true; for (const p of L.units) p.forceU = t - p.chain < 0 ? -1 : t - p.chain; for (const s of Object.values(SCR)) placeCanvas(s); renderAll(0); },
  live() { manual = false; for (const n in STATE) STATE[n] = 'idle'; if (L) { for (const g of L.groups) g.startAt = undefined; for (const p of L.units) delete p.forceU; } renderAll(clock()); check(); },
  useVirtualClock() { cancelAnimationFrame(raf); raf = 0; manual = false; virtualNow = 0; this.live(); },
  advance(ms) { virtualNow += ms; check(); renderAll(virtualNow); return this.state(); },
  state: () => ({ ...STATE }),
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

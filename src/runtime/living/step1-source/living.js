/* 活画引擎：把首屏整屏图里插画的那一块“画活”。
   原图（页面上已经显示的那张整屏图）始终在下面：没有脚本、配置读不到、图读不到、没有 WebGL、
   系统设了“减少动态”、防卡死保险触发，看到的都是那张静止的原图。
   画布只盖在插画框上；哪里不动，画布就是透明的，原图原样露出来。 */
(function (global) {
'use strict';
const scriptURL = document.currentScript && document.currentScript.src;
const ENGINE_BASE = scriptURL || document.baseURI;
const SPEED = 2.5;            // 全站唯一的速度数。配置里所有时长写的是“按这个速度时的真实秒数”
const RATE = SPEED / 2.5;     // 以后若改速度数，所有动作一起按比例变快变慢
const LEAF_AMP = 0.0105;     // 全站叶子唯一幅度：插画框宽的百分之一点零五；各页只量范围和根部
const NQ = 24;                // 同时画的光点、火花、浮尘、落叶最多几个
const mounts = new Set();
const BIRD_DIR = 'bird/';     // 打包时换成带指纹的文件夹名（里面是 bird.js 和 bird-atlas.webp）
let birdLoading = null;
function loadBird() {
  if (global.LivingBird) return Promise.resolve();
  if (!birdLoading) birdLoading = new Promise(res => { const sc = document.createElement('script'); sc.src = new URL(BIRD_DIR + 'bird.js', ENGINE_BASE).href; sc.async = true; sc.onload = sc.onerror = () => res(); document.head.append(sc); });
  return birdLoading;
}

// ---------- 小工具 ----------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const eOut = u => 1 - Math.pow(1 - u, 3);
const eInOut = u => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const eBack = u => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const fx6 = v => Number(v).toFixed(6);
const v2 = p => `vec2(${fx6(p[0])},${fx6(p[1])})`;
const v3 = c => `vec3(${fx6(c[0])},${fx6(c[1])},${fx6(c[2])})`;
function hash1(n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
// 招牌动作的几种“演一次”的形状：u 是这一次演到哪儿（0..1）
const SHAPES = {
  bump: u => Math.sin(Math.PI * u),
  pulse: u => u < 0.3 ? eOut(u / 0.3) : 1 - eInOut((u - 0.3) / 0.7),
  press: u => u < 0.22 ? eOut(u / 0.22) : 1 - eInOut((u - 0.22) / 0.78),
  beat2: u => (u < 0.4 ? Math.sin(Math.PI * u / 0.4) : 0) + (u > 0.48 && u < 0.88 ? 0.8 * Math.sin(Math.PI * (u - 0.48) / 0.4) : 0),
  wiggle: u => Math.sin(Math.PI * 4 * u) * Math.sin(Math.PI * u),
  out: u => eInOut(u),
  hold: u => u < 0.2 ? eOut(u / 0.2) : u > 0.8 ? 1 - eInOut((u - 0.8) / 0.2) : 1,
};
// 时间：continuous 的 {period}；“演一次停几秒”的 {period, start, dur}（period 含停顿）
function cycleU(time, t) {
  if (!time || !(time.period > 0)) return -1;
  const x = t - (time.start || 0);
  if (x < 0) return -1;
  const ph = x - Math.floor(x / time.period) * time.period, d = time.dur || time.period;
  return ph < d ? ph / d : -1;
}
function cycleIndex(time, t) { return Math.floor((t - (time.start || 0)) / time.period); }

// ---------- 杭州的日出日落（和首页同一套算法），用来判断夜里 ----------
function hzHour() { const d = new Date(Date.now() + 8 * 3600e3); return d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600; }
function sunTimes() {
  const d = new Date(Date.now() + 8 * 3600e3), rad = Math.PI / 180;
  const N = Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5);
  const g = 2 * Math.PI / 365 * (N - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const lat = 30.2741 * rad, lon = 120.1551;
  const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat) * Math.cos(dec)) - Math.tan(lat) * Math.tan(dec)) / rad;
  return { sr: (720 - 4 * (lon + ha) - eqt) / 60 + 8, ss: (720 - 4 * (lon - ha) - eqt) / 60 + 8 };
}
const SUN = sunTimes();
// 夜里屏幕和灯更亮：0 白天，1 夜里（日落后约 1 小时到日出前，中间平滑）
function nightAt(h) { const { sr, ss } = SUN; if (h >= ss + 1.0 || h < sr - 0.5) return 1; if (h > ss + 0.2) return smooth(ss + 0.2, ss + 1.0, h); if (h < sr + 0.3) return 1 - smooth(sr - 0.5, sr + 0.3, h); return 0; }
const sleepAt = h => h >= 23 || h < SUN.sr - 0.6;     // 小鸟睡觉的时段，和首页一致
// 场景画“跟天色”：和首页同一张天色表（o 是整体乘的颜色，l 是亮处加的一点光）
function todParams(h) {
  const { sr, ss } = SUN;
  const N = { o: [.20, .27, .48], l: [0, 0, 0] }, D = { o: [1, 1, 1], l: [0, 0, 0] };
  const K = [[0, N], [sr - 1.3, N], [sr - 0.45, { o: [.74, .60, .68], l: [.10, .04, .03] }], [sr + 0.35, { o: [1.06, .93, .74], l: [.06, .03, 0] }],
    [sr + 2.2, D], [ss - 2.0, D], [ss - 0.6, { o: [1.08, .90, .70], l: [.05, .02, 0] }], [ss + 0.25, { o: [.92, .58, .50], l: [.10, .03, .02] }],
    [ss + 1.0, { o: [.38, .45, .72], l: [0, 0, 0] }], [ss + 2.0, N], [24, N]];
  for (let i = 0; i < K.length - 1; i++) {
    const [h0, a] = K[i], [h1, b] = K[i + 1];
    if (h >= h0 && h <= h1) { let u = h1 > h0 ? (h - h0) / (h1 - h0) : 0; u = u * u * (3 - 2 * u); const mv = (x, y) => x.map((v, j) => v + (y[j] - v) * u); return { o: mv(a.o, b.o), l: mv(a.l, b.l) }; }
  }
  return N;
}

// ---------- 读图 ----------
function loadImage(src, cors) {
  return new Promise((resolve, reject) => { const im = new Image(); im.decoding = 'async'; if (cors) im.crossOrigin = 'anonymous';
    im.onload = () => { if (im.decode) im.decode().then(() => resolve(im), () => resolve(im)); else resolve(im); };
    im.onerror = () => reject(new Error('素材加载失败：' + src)); im.src = src; });
}
function imageReady(img) {
  if (img.complete && img.naturalWidth) return Promise.resolve(img);
  if (img.complete && img.getAttribute('src') && !img.naturalWidth) return Promise.reject(new Error('首屏图没有加载成功'));
  return new Promise((resolve, reject) => { img.addEventListener('load', () => resolve(img), { once: true }); img.addEventListener('error', () => reject(new Error('首屏图没有加载成功')), { once: true }); });
}
function corsURL(u) {
  try { const x = new URL(u, document.baseURI); if (!/^https?:$/.test(x.protocol) || x.origin === location.origin) return x.href; x.searchParams.set('living-cors', '1'); return x.href; } catch (e) { return u; }
}
function readable(img) {   // 这张图能不能交给显卡（同源，或按跨域方式读到且服务器许可）
  try { const c = document.createElement('canvas'); c.width = c.height = 1; const g = c.getContext('2d'); g.drawImage(img, 0, 0, 1, 1); g.getImageData(0, 0, 1, 1); return true; } catch (e) { return false; }
}

// ---------- 把配置里整屏比例的坐标换回插画框内的占比 ----------
const POINT_KEYS = ['center', 'pivot', 'from', 'to', 'home'];
const POINTS_KEYS = ['path', 'quad', 'points'];
function toBox(e, box) {
  const P = q => [(q[0] - box[0]) / box[2], (q[1] - box[1]) / box[3]];
  const out = {};
  for (const [k, v] of Object.entries(e)) {
    if (POINT_KEYS.includes(k) && Array.isArray(v)) out[k] = P(v);
    else if (POINTS_KEYS.includes(k) && Array.isArray(v)) out[k] = v.map(P);
    else if (k === 'areas' && Array.isArray(v)) out[k] = v.map(a => { const a0 = P([a[0], a[1]]), a1 = P([a[2], a[3]]); return [a0[0], a0[1], a1[0], a1[1]]; });
    else if (k === 'items' && Array.isArray(v)) out[k] = v.map(it => toBox(it, box));
    else if (k === 'perches' && Array.isArray(v)) out[k] = v.map(p => ({ ...p, x: (p.x - box[0]) / box[2], y: (p.y - box[1]) / box[3] }));
    else if ((k === 'region' || k === 'cover') && v && typeof v === 'object' && !Array.isArray(v)) out[k] = toBox(v, box);
    else out[k] = v;
  }
  return out;
}

// ---------- 着色器 ----------
const VS = 'attribute vec2 a; varying vec2 v_uv; void main(){ v_uv = vec2(a.x*0.5+0.5, 0.5-a.y*0.5); gl_Position = vec4(a,0.0,1.0); }';
function buildShader(effects, A, NE, originalTexture = false) {
  // 位置都在插画框内（0..1）；算距离、角度时用 iso：横向乘框的宽高比，竖向不变（单位 = 框高）
  const I = q => [q[0] * A, q[1]];
  const W = w => w * A;                                   // 配置里的长度按“框宽的占比”写，换成框高单位
  const mask = ch => { const m = /^m([01])\.([rgb])$/.exec(ch || ''); if (!m) throw new Error('范围图通道写法不对：' + ch); return `texture2D(u_m${m[1]},p).${m[2]}`; };
  const maskAt = (ch, at) => mask(ch).replace(',p)', `,${at})`);
  function polySign(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += (b[0] - a[0]) * (b[1] + a[1]); } return s > 0 ? 1 : -1; }
  function quadExpr(quad, soft) {
    const q = quad.map(I), sg = -polySign(q);
    return q.map((a, i) => `smoothstep(0.0,${fx6(W(soft))},${sg}.0*lineD(ip,${v2(a)},${v2(q[(i + 1) % 4])}))`).join('*');
  }
  function region(r, def) {
    if (!r) return def || '1.0';
    const parts = [];
    if (r.mask) parts.push(`${mask(r.mask)}`);
    if (r.quad) parts.push(quadExpr(r.quad, r.soft ?? 0.006));
    if (r.center && r.radius) { const c = r.center, rr = r.radius; parts.push(`(1.0-smoothstep(${fx6(1 - (r.soft ?? 0.25))},1.0,length((p-${v2(c)})/${v2(rr)})))`); }
    return parts.length ? parts.join('*') : (def || '1.0');
  }
  const tint = c => v3(c || [1, 1, 1]);
  const coverC = e => Array.isArray(e.coverColor) ? v3(e.coverColor.map(x => x / 255)) : 'u_paper';   // 盖住东西用的底色：换算工具从周围一圈取，没有就用纸色   // 盖住东西用的底色：换算工具从周围一圈取，没有就用纸色
  const lightOver = (amount, col) => `{ float b_=${amount}; if(b_>0.0005){ vec3 k_=${tint(col)}; lt=over(vec4(k_*b_,b_*max(k_.r,max(k_.g,k_.b))),lt);} }`;
  let disp = '', cover = '', light = '', fns = new Set();
  effects.forEach((e, i) => {
    const U = `u_e[${e._slot}]`;
    switch (e.type) {
      case 'sway': {
        const f = e.freq || 5.0, gw = W(e.gustWidth || 0.26), dir = e.gustDir === 'left' ? -1 : 1;
        disp += `{ float w=${region(e.region)}; if(w>0.001){ vec4 e=${U};
  vec2 q=p*vec2(${fx6(f * A)},${fx6(f)}); float n1=noise(q+3.1), n2=noise(q*1.3+11.7);
  vec2 dd=vec2(sin(e.x+n1*6.2832), 0.5*cos(e.x*0.77+n2*6.2832+1.7));
  float gx=(ip.x-e.y)/${fx6(gw)}; dd.x+=e.z*exp(-gx*gx)*${dir}.0*(1.0+0.25*sin(e.x*2.3+n1*9.0));
  vec2 d=dd*e.w*w; d.y*=A; sp-=d; ad=max(ad,min(1.0,w*4.0)); } }\n`;
        break;
      }
      case 'flow': {
        if (e.mode === 'wave') {
          const fr = e.freq || 2.0, tilt = e.tilt || 0;
          disp += `{ float w=${region(e.region)}; if(w>0.001){ vec4 e=${U};
  float ph=6.2832*(p.x*${fx6(fr)}+p.y*${fx6(tilt)})-e.x; vec2 d=vec2(0.25*cos(ph*0.5+1.3)*${fx6(e.sway || 0)}, sin(ph)+0.35*sin(ph*1.7+e.x*0.6))*e.w*w; d.y*=A; sp-=d; ad=max(ad,min(1.0,w*4.0)); } }\n`;
        } else {
          const sc = e.scale || 6.0;
          disp += `{ float w=${region(e.region)}; if(w>0.001){ vec4 e=${U};
  vec2 q=p*vec2(${fx6(sc * A)},${fx6(sc)})+e.xy; vec2 d=(vec2(noise(q),noise(q+vec2(17.3,5.1)))-0.5)*2.0*e.w*w; d.y*=A; sp-=d; ad=max(ad,min(1.0,w*4.0)); } }\n`;
        }
        break;
      }
      case 'part': {
        const pv = v2(e.pivot || [0.5, 0.5]);
        let body;
        if (e.motion === 'rock' || e.motion === 'swing') body = `vec2 r=iso(sp-${pv}); r=rot(r,-val*w); sp=${pv}+uniso(r);`;
        else if (e.motion === 'pulse') body = `sp=${pv}+(sp-${pv})/(1.0+val*w);`;
        else if (e.motion === 'squash') body = `sp.y=${pv}.y+(sp.y-${pv}.y)/max(0.06,1.0-val*w);`;   // 眨眼：竖向压扁（val 到 0.9 就闭上了）
        else { const d = e.dir || [0, -1], L = Math.hypot(d[0], d[1]) || 1; body = `sp-=w*val*vec2(${fx6(d[0] / L)},${fx6(d[1] / L * A)});`; }
        disp += `{ float val=${U}.x; if(abs(val)>0.00001){ float w=${region(e.region)}; if(w>0.001){ ${body} ad=max(ad,min(1.0,w*4.0)); } } }\n`;
        break;
      }
      case 'spin': {
        const c = v2(e.center), r = v2(e.radius), o = e.outer || 1.22, n = e.blades || 0;
        disp += `{ vec2 fq=(p-${c})/${r}; float fl=length(fq); if(fl<${fx6(o)}){ float k=smoothstep(${fx6(o)},${fx6(e.inner || 1.0)},fl); float ang=${U}.x;
  sp=mix(sp,${c}+rot(fq,-ang)*${r},k); ad=max(ad,k);
  ${n ? `float an=atan(fq.y,fq.x); float bl=pow(0.5+0.5*cos(${n}.0*(an-ang)),6.0)*smoothstep(0.85,0.55,fl)*smoothstep(0.12,0.3,fl);
  float rim=pow(0.5+0.5*cos(an-ang*0.5),14.0)*smoothstep(0.62,0.85,fl)*smoothstep(1.12,0.95,fl);
  spinL+= (bl*${fx6(e.sheen ?? 0.10)}+rim*${fx6(e.rim ?? 0.35)})*${U}.y;` : ''} } }\n`;
        if (n) light += lightOver('spinL', e.color || [0.75, 1.0, 0.8]) + ' spinL=0.0;\n';
        break;
      }
      case 'glow': light += lightOver(`${region(e.region)}*${U}.x`, e.color); break;
      case 'glint': {
        const a = I(e.from), b = I(e.to);
        light += `{ float w=${region(e.region)}; if(w>0.001){ vec2 ab=${v2([b[0] - a[0], b[1] - a[1]])}; float s=dot(ip-${v2(a)},ab)/dot(ab,ab); float x=(s-${U}.x)/${fx6(e.width || 0.08)};
  ${lightOver(`exp(-x*x)*${U}.y*w`, e.color)} } }\n`;
        break;
      }
      case 'sweep': {
        const q = e.quad.map(I), sg = -polySign(q);
        light += `{ float ins=${quadExpr(e.quad, e.soft ?? 0.004)}${e.region ? '*' + region(e.region) : ''}; if(ins>0.001 && ${U}.y>0.0005){
  float da=${sg}.0*lineD(ip,${v2(q[3])},${v2(q[0])}), db=${sg}.0*lineD(ip,${v2(q[1])},${v2(q[2])}); float s=da/max(0.00001,da+db); float x=s-${U}.x;
  float core=exp(-x*x/${fx6((e.width || 0.035) ** 2)}), halo=exp(-x*x/${fx6((e.halo || 0.12) ** 2)});
  ${lightOver(`(core*${fx6(e.core ?? 0.7)}+halo*${fx6(e.glow ?? 0.28)})*${U}.y*ins`, e.color || [0.72, 1.0, 0.88])} } }\n`;
        break;
      }
      case 'ripple': {
        const c = I(e.center), R = W(e.radius || 0.3), n = e.rings || 3;
        // 只朝一个方向荡开时：dir 是朝向（弧度，0 朝右、1.57 朝下），spread 是左右各张开多少（弧度）
        const sp_ = e.spread || 0.8, sector = e.dir != null ? `*smoothstep(${fx6(sp_ + 0.25)},${fx6(Math.max(0, sp_ - 0.25))},abs(mod(an-(${fx6(e.dir)})+3.14159265,6.2831853)-3.14159265))` : '';
        light += `{ vec2 q=ip-${v2(c)}; float d=length(q); if(d<${fx6(R * 1.08)} && ${U}.y>0.0005){ float an=atan(q.y,q.x); float acc=0.0;
  for(int k=0;k<${n};k++){ float ph=fract(${U}.x+float(k)/${n}.0); float rr=${fx6(W(e.start || 0.02))}+ph*${fx6(R)}; float x=(d-rr)/${fx6(W(e.width || 0.012))}; acc+=exp(-x*x)*(1.0-ph)*smoothstep(0.0,0.12,ph); }
  ${lightOver(`acc*${U}.y${sector}${e.region ? '*' + region(e.region) : ''}`, e.color || [0.75, 1.0, 0.85])} } }\n`;
        break;
      }
      case 'carry': {
        if (e.sprite) {
          cover += `{ vec4 e=${U}; float fade=u_e[${e._slot + 1}].x;
  if(fade>0.0005){ vec2 r=uniso(rot(ip-iso(e.xy),-e.z))/max(0.05,e.w); vec2 qs=r/${v2(e.sprite.size)}+0.5;
    if(qs.x>=0.0&&qs.y>=0.0&&qs.x<=1.0&&qs.y<=1.0){ vec4 c=texture2D(u_s${e._sprite},qs); c.a*=fade; c.rgb*=c.a; base=over(c,base); } } }\n`;
          break;
        }
        const m = e.region && e.region.mask, H = v2(e.home);
        cover += `{ vec4 e=${U}; vec4 f=u_e[${e._slot + 1}];
  if(f.y>0.0005){ float hm=${region(e.cover || e.region)}*f.y; base=over(vec4(${coverC(e)}*hm,hm),base); }
  if(f.x>0.0005){ vec2 r=rot(ip-iso(e.xy),-e.z)/max(0.05,e.w); vec2 qs=${H}+uniso(r); float im=${m ? maskAt(m, 'qs') : '1.0'}*f.x*step(0.0,qs.x)*step(qs.x,1.0)*step(0.0,qs.y)*step(qs.y,1.0);
    if(im>0.001){ base=over(vec4(tex(qs)*im,im),base); } } }\n`;
        break;
      }
      case 'reveal': {
        if (e.mode === 'write') {
          cover += `{ float v=${mask(e.region.mask)}; if(v>0.02 && ${U}.y>0.0005){ float o=(v-0.02)/0.98; float h=smoothstep(${U}.x-0.015,${U}.x+0.015,o)*${U}.y; base=over(vec4(${coverC(e)}*h,h),base); } }\n`;
        } else {
          (e.items || []).forEach((it, k) => {
            const c = v2(it.center), r = W(it.radius || 0.06), slot = `u_e[${e._slot + (k >> 2)}].${'xyzw'[k & 3]}`;
            cover += `{ float u=${slot}; vec2 q=ip-iso(${c}); if(u<1.0 && dot(q,q)<${fx6((r * 1.5) ** 2)}){ float hide=${mask(e.region.mask)}*step(length(q),${fx6(r)});
  float s=max(0.02,popS(u)); vec2 qs=${c}+uniso(q/s); float inside=${maskAt(e.region.mask, 'qs')}*step(length(q/s),${fx6(r)})*step(0.0005,u);
  float h=max(hide,inside); if(h>0.001){ vec3 cc=mix(${coverC(it.coverColor ? it : e)},tex(qs),inside*min(1.0,u*5.0)); base=over(vec4(cc*h,h),base);} } }\n`;
          });
          fns.add('pop');
        }
        break;
      }
      case 'drift': {
        // 水面、云的流动：沿一个方向（加一点扰动）把画面“流”过去，两份错开半拍的取样交替淡入淡出，看不出接缝（和“今天的河”同一个思路）
        const dvec = e.dir || [0.03, 0], sc = e.scale || 4.0, wob = e.wobble ?? 0.35;
        cover += `{ float w=${region(e.region)}; vec4 e=${U}; if(w>0.001 && (abs(e.x)>0.00001 || abs(e.z)>0.00001 || e.y>0.00001)){
  vec2 fl=vec2(${fx6(dvec[0])},${fx6(dvec[1] * A)}); vec2 nq=p*vec2(${fx6(sc * A)},${fx6(sc)});
  fl+=(vec2(noise(nq+e.z),noise(nq+vec2(5.2,1.3)-e.z))-0.5)*${fx6(wob)}*length(fl)*2.0;
  float a1=fract(e.x), a2=fract(e.x+0.5); float k=abs(1.0-2.0*a1);
  vec2 s1=p-fl*(a1-0.5), s2=p-fl*(a2-0.5);
  vec3 c1=${e.region && e.region.mask ? `mix(tex(p),tex(s1),clamp(${maskAt(e.region.mask, 's1')},0.0,1.0))` : 'tex(s1)'};
  vec3 c2=${e.region && e.region.mask ? `mix(tex(p),tex(s2),clamp(${maskAt(e.region.mask, 's2')},0.0,1.0))` : 'tex(s2)'};
  vec3 dc=mix(c1,c2,k);
  ${e.glints ? `float gn=noise(p*vec2(${fx6(70 * A)},70.0)+fl*e.x*40.0+e.z*3.0); float gl=smoothstep(0.84,0.97,gn)*${fx6(e.glints)}*w*(0.55+0.45*sin(e.z*7.0+gn*30.0)); dc+=vec3(0.9,1.0,1.0)*gl*e.y;` : ''}
  base=over(vec4(dc*w,w),base); } }
`;
        break;
      }
      case 'march': {
        const P = e.path.map(I);
        let seg = '';
        for (let k = 0; k < P.length - 1; k++) seg += `{ vec2 a=${v2(P[k])}, b=${v2(P[k + 1])}; vec2 pa=ip-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); float dd=length(pa-ba*h); if(dd<best){best=dd; tg=normalize(ba);} }\n`;
        disp += `{ float w=${region(e.region)}; if(w>0.001){ float best=1e9; vec2 tg=vec2(1.0,0.0);\n${seg} sp-=uniso(tg*${U}.x)*w; ad=max(ad,min(1.0,w*4.0)); } }\n`;
        break;
      }
      default: break;
    }
  });
  const FS = `precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex, u_m0, u_m1, u_dayEdge, u_dayWash;
${effects.filter(e => e.sprite).map(e => `uniform sampler2D u_s${e._sprite};`).join('\n')}
uniform vec4 u_box;
uniform vec4 u_e[${NE}];
uniform vec4 u_q[${NQ}];
uniform vec4 u_qc[${NQ}];
uniform vec3 u_paper;
uniform float u_intro, u_zoom, u_full, u_hq;
uniform vec2 u_tsz;
uniform vec4 u_map;
uniform vec4 u_day;
uniform vec3 u_dayl, u_dayPaper;
uniform vec2 u_ic;
const float A = ${fx6(A)};
float hash(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y); }
float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*noise(p); p=p*2.03+7.1; a*=0.5; } return s; }
float hk(float x){ x=abs(x); if(x>=1.0) return 0.0; if(x<0.0001) return 1.0; float a=3.14159265*x; return sin(a)/a*(0.54+0.46*cos(a)); }
vec3 tex(vec2 p){ vec2 q=u_box.xy+clamp(p,0.0,1.0)*u_box.zw;
  if(u_hq<0.0001) return texture2D(u_tex,q).rgb;
  vec2 t=q*u_tsz-0.5, f=floor(t), fr=t-f; vec3 acc=vec3(0.0); float ws=0.0;
  for(int j=${originalTexture ? -3 : -1};j<=${originalTexture ? 4 : 2};j++){ float wy=hk((float(j)-fr.y)*u_hq); for(int i=${originalTexture ? -3 : -1};i<=${originalTexture ? 4 : 2};i++){ float w=hk((float(i)-fr.x)*u_hq)*wy; if(w!=0.0){ acc+=texture2D(u_tex,(f+vec2(float(i),float(j))+0.5)/u_tsz).rgb*w; ws+=w; } } }
  return acc/ws; }
vec2 iso(vec2 p){ return vec2(p.x*A,p.y); }
vec2 uniso(vec2 q){ return vec2(q.x/A,q.y); }
vec2 rot(vec2 v, float a){ float c=cos(a), s=sin(a); return vec2(c*v.x-s*v.y, s*v.x+c*v.y); }
float lineD(vec2 p, vec2 a, vec2 b){ vec2 e=b-a; return (e.x*(p.y-a.y)-e.y*(p.x-a.x))/length(e); }
vec4 over(vec4 top, vec4 under){ return top+under*(1.0-top.a); }
${fns.has('pop') ? 'float popS(float u){ if(u>=1.0) return 1.0; float c=1.7, v=u-1.0; return 1.0+(c+1.0)*v*v*v+c*v*v; }' : ''}
void main(){
  vec2 p=v_uv*u_map.xy-u_map.zw; if(p.x<0.0||p.y<0.0||p.x>1.0||p.y>1.0){ gl_FragColor=vec4(0.0); return; }
  if(u_full>1.5){ gl_FragColor=vec4(fract(p.x*8.0),fract(p.y*8.0),0.0,1.0); return; }
  vec2 ip=iso(p), sp=p; float ad=0.0, spinL=0.0;
  if(u_zoom!=1.0){ sp=u_ic+(sp-u_ic)/u_zoom; ad=1.0; }
${disp}
  if(length(sp-p)<0.0000001) ad=0.0; // 没有实际位移时透明，原图原样露出，不重复铺一层不同滤镜的原采样
  vec4 base=vec4(tex(sp)*ad, ad);
${cover}
  vec4 lt=vec4(0.0);
  for(int i=0;i<${NQ};i++){
    vec4 q=u_q[i]; if(q.w<=0.001) continue;
    vec4 c=u_qc[i]; vec2 dv=ip-iso(q.xy); float r=q.z; float d2=dot(dv,dv); if(d2>r*r*16.0) continue;
    if(c.w<0.5){ float b=exp(-d2/(r*r))*q.w; lt=over(vec4(c.rgb*b,b*max(c.r,max(c.g,c.b))),lt); }
    else if(c.w<1.5){ vec2 a=abs(rot(dv,0.3)); float b=(exp(-a.x/(r*0.10))*exp(-a.y/r)+exp(-a.y/(r*0.10))*exp(-a.x/r)+0.8*exp(-d2/(r*r*0.06)))*q.w; b=min(b,1.0); lt=over(vec4(c.rgb*b,b*max(c.r,max(c.g,c.b))),lt); }
    else { vec2 l=rot(dv,-(c.w-2.0)*6.2832)/r; float hw=0.40*(1.0-l.x*l.x); float ins=smoothstep(0.0,0.08,hw-abs(l.y))*step(abs(l.x),1.0);
      float a=ins*q.w*0.92; vec3 lc=mix(c.rgb*0.78,min(vec3(1.0),c.rgb*1.15),smoothstep(-0.4,0.3,l.y))*(1.0-0.25*smoothstep(0.06,0.0,abs(l.y))*step(-0.85,l.x));
      base=over(vec4(lc*a,a),base); }
  }
${light}
  vec4 o=over(lt,base);
${effects.some(e => e.type === 'daylight') ? `  if(u_day.w>0.002){ vec3 full=o.rgb+(1.0-o.a)*tex(p); float pt=${(() => { const d = effects.find(e => e.type === 'daylight'); return d && d.region ? region(d.region) : 'smoothstep(0.03,0.22,1.0-min(full.r,min(full.g,full.b)))'; })()};
    // 夜色只在作者原范围内渐入，软边沿可见颜料/白纸边界，不沿canvas矩形。
    vec2 edge=texture2D(u_dayEdge,p).rg; float fe=edge.r;
    float depth=clamp((1.0-min(u_day.r,min(u_day.g,u_day.b)))/0.8,0.0,1.0);
    vec4 wash=texture2D(u_dayWash,p); full=mix(full,wash.rgb,wash.a*depth);
    float k=max(pt,edge.g*depth)*u_day.w;
    if(k>0.002){ float lum=dot(full,vec3(0.299,0.587,0.114)); vec3 gd=full*u_day.rgb+u_dayl*smoothstep(0.55,0.9,lum);
      gd=mix(gd,u_dayPaper,(1.0-fe)*depth); o=vec4(mix(full,gd,k),1.0); } }` : ''}
  if(u_intro<1.5 || u_full>0.5){
    vec3 col=o.rgb+(1.0-o.a)*tex(p);
    if(u_intro<1.5){
      vec2 q=ip-iso(u_ic); float RM=length(vec2(max(u_ic.x,1.0-u_ic.x)*A,max(u_ic.y,1.0-u_ic.y)))*1.15;
      float R=RM*(1.0-pow(1.0-clamp(u_intro,0.0,1.0),2.2));
      float dd=length(q)+RM*(0.20*(fbm(p*vec2(4.0*A,4.0)+3.0)-0.5)+0.055*(fbm(p*vec2(16.0*A,16.0)+9.0)-0.5)+0.016*(noise(p*vec2(110.0*A,110.0))-0.5));
      float e=0.010*RM; float bl=smoothstep(R,R-e,dd);
      float ring=smoothstep(R-0.002*RM,R-0.016*RM,dd)*(1.0-smoothstep(R-0.02*RM,R-0.09*RM,dd));
      float wet=smoothstep(R-0.03*RM,R-0.26*RM,dd)+step(1.0,u_intro);
      float pig=smoothstep(0.02,0.20,1.0-min(col.r,min(col.g,col.b)));
      col=mix(mix(col,vec3(1.0),0.40),col,clamp(wet,0.0,1.0));
      col*=1.0-0.30*ring*pig*(1.0-step(1.0,u_intro));
      col=mix(u_paper,col,bl);
    }
    gl_FragColor=vec4(col,1.0);
  } else gl_FragColor=o;
}`;
  return FS;
}

// ---------- 每一帧算各个动作的参数（都只看时间，逐格录像时结果每次一样） ----------
function pathLen(path) { const L = [0]; for (let i = 1; i < path.length; i++) L.push(L[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1])); return L; }
function pathAt(path, L, s) {
  const total = L[L.length - 1], d = clamp(s, 0, 1) * total;
  let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1), a = path[i - 1], b = path[i];
  return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) };
}
function smoothPath(path, n = 10) {   // 折线拐角处圆一点（Catmull-Rom），光点走起来不会一顿一顿
  if (path.length < 3) return path;
  const out = [];
  for (let i = 0; i < path.length - 1; i++) {
    const p0 = path[Math.max(0, i - 1)], p1 = path[i], p2 = path[i + 1], p3 = path[Math.min(path.length - 1, i + 2)];
    for (let j = 0; j < n; j++) { const t = j / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(k => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
  }
  out.push(path[path.length - 1]); return out;
}

// ---------- 防卡死的保险（与首页接入包同一口径，原样照搬；宁可不触发，不能误触发） ----------
// 只看页面可见、画在屏幕内、动画在播时真正画出来的帧，记下相邻两帧的间隔。
// 退回静态的条件，满足其一：
//   a) 最近约 6 秒、至少 5 个帧间隔，间隔的中位数超过 100 毫秒（实际帧率中位数低于 10）；
//   b) 连续 3 帧以上、每帧都超过 1 秒，而且这几帧加起来超过 5 秒（一帧接一帧的长帧就是卡死）。
// 不算的：刚开始播的头 2 秒、滚动中和最后一次滚动后 1.5 秒、页面隐藏或画滚出屏幕（浏览器自己暂停）、
// 手动取帧；单次长帧只占窗口里的一个间隔，拉不动中位数，也凑不成“连续 3 帧”。
// 首页和每页的活画共用这一份：o = { label, shouldRun(), exempt()（手动取帧、定格时为真）, shared（含 scrollingUntil）, stop(why) }
function makeGuard(o) {
  const GUARD = { graceMs: 2000, windowMs: 6000, minIntervals: 5, slowMedianMs: 100, longMs: 1000, longRun: 3, longRunMs: 5000 };
  const guardGaps = [];
  let guardSpan = 0, guardLast = 0, guardMedian = 0, guardLong = 0, guardLongMs = 0, guardMedianAt = 0, guardEligibleAt = Infinity, guardTrigger = null;
  function resetGuard(grace = 0) {
    guardGaps.length = 0; guardSpan = 0; guardLast = 0; guardMedian = 0; guardLong = 0; guardLongMs = 0; guardMedianAt = 0;
    guardEligibleAt = performance.now() + grace;
  }
  function checkFrameGuard(now) {
    if (!o.shouldRun() || o.exempt()) { resetGuard(GUARD.graceMs); return false; }
    if (now < o.shared.scrollingUntil) { resetGuard(); guardEligibleAt = o.shared.scrollingUntil; return false; }
    if (now < guardEligibleAt) { guardLast = 0; return false; }
    if (!guardLast) { guardLast = now; return false; }
    const gap = now - guardLast; guardLast = now;
    if (gap > GUARD.longMs) { guardLong++; guardLongMs += gap; } else { guardLong = 0; guardLongMs = 0; }
    guardGaps.push(gap); guardSpan += gap;
    while (guardGaps.length > GUARD.minIntervals && guardSpan - guardGaps[0] >= GUARD.windowMs) guardSpan -= guardGaps.shift();
    const full = guardSpan >= GUARD.windowMs && guardGaps.length >= GUARD.minIntervals;
    if (full && (now >= guardMedianAt || gap > GUARD.slowMedianMs)) {          // 中位数最多每 250 毫秒算一次
      const s = guardGaps.slice().sort((a, b) => a - b), m = s.length >> 1;
      guardMedian = s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; guardMedianAt = now + 250;
    }
    let why = null;
    if (guardLong >= GUARD.longRun && guardLongMs >= GUARD.longRunMs) why = 'long-frames';
    else if (full && guardMedian > GUARD.slowMedianMs) why = 'slow-median';
    if (!why) return false;
    guardTrigger = { rule: why, intervals: guardGaps.length, windowMs: Math.round(guardSpan), medianIntervalMs: +guardMedian.toFixed(1),
      medianFPS: guardMedian ? +(1000 / guardMedian).toFixed(2) : 0, consecutiveLong: guardLong, consecutiveLongMs: Math.round(guardLongMs) };
    console.info(why === 'long-frames'
      ? `[${o.label}] 动效退回静态：可见播放时连续 ${guardLong} 帧每帧都超过 1 秒（共 ${(guardLongMs / 1000).toFixed(1)} 秒）；仅本页本次生效。`
      : `[${o.label}] 动效退回静态：可见播放时最近 ${(guardSpan / 1000).toFixed(1)} 秒实际帧率中位数 ${(1000 / guardMedian).toFixed(1)} FPS（帧间隔中位数 ${guardMedian.toFixed(0)} 毫秒）；仅本页本次生效。`);
    o.stop('slow-frames'); return true;
  }
  return { rules: GUARD, reset: resetGuard, check: checkFrameGuard,
    state: () => ({ intervals: guardGaps.length, windowMs: Math.round(guardSpan), medianIntervalMs: +guardMedian.toFixed(1), medianFPS: guardMedian ? +(1000 / guardMedian).toFixed(2) : 0,
      consecutiveLong: guardLong, rules: GUARD, scrollExcluded: performance.now() < o.shared.scrollingUntil, trigger: guardTrigger }) };
}

// ---------- 看得见吗、减少动态、滚动、尺寸：首页和每页共用 ----------
// h = { pause(), reduced(), resize() }；返回 { shared, observe(元素), dispose() }。shared.paused = 页面隐藏或画滚出屏幕
function watch(target, h) {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const shared = { reduced: media.matches, paused: document.hidden, scrollingUntil: 0, errors: [] };
  let visible = true;
  const pause = () => { shared.paused = document.hidden || !visible; if (h.pause) h.pause(); };
  const pref = () => { shared.reduced = media.matches; if (h.reduced) h.reduced(); };
  const scroll = () => { shared.scrollingUntil = performance.now() + 1500; };
  const resize = () => { if (h.resize) h.resize(); };
  document.addEventListener('visibilitychange', pause);
  global.addEventListener('scroll', scroll, { capture: true, passive: true });
  media.addEventListener('change', pref);
  const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; pause(); }) : null;
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(target); else global.addEventListener('resize', resize);
  return { shared, observe(el) { if (io) { io.disconnect(); io.observe(el); } },
    dispose() { if (io) io.disconnect(); if (ro) ro.disconnect(); else global.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', pause); global.removeEventListener('scroll', scroll, true); media.removeEventListener('change', pref); } };
}

function createScene(part, orient, cfg, shared, opts) {
  const V = cfg[orient];
  const box = V.box, imgSize = V.image.size;
  const boxPx = [box[2] * imgSize[0], box[3] * imgSize[1]];
  const A = boxPx[0] / boxPx[1];
  const effects = (V.effects || []).map(e => { const x = toBox(e, box); if (x.type === 'sway') x.amp = LEAF_AMP; return x; });
  const introCfg = toBox(V.intro || {}, box);
  const INTRO = clamp(introCfg.dur || 1.6, 1.2, 2.0);
  const img = opts.image || part.querySelector('img');
  let originalPresented = !!(img && img.complete && img.naturalWidth && img.getClientRects().length);
  let introEnabled = false, introReason = 'loading';
  const root = document.createElement('div'); root.className = 'living-layer'; root.setAttribute('aria-hidden', 'true');
  Object.assign(root.style, { left: box[0] * 100 + '%', top: box[1] * 100 + '%', width: box[2] * 100 + '%', height: box[3] * 100 + '%' });
  const canvas = document.createElement('canvas'); root.append(canvas);
  const overlays = part.querySelector(':scope > .overlays');
  part.insertBefore(root, overlays || null);
  let reduce = shared.reduced, destroyed = false, failed = false, active = false, raf = 0, phase = 'loading', reason = null;
  let frames = 0, maxFrame = 0, lastPaused = shared.paused;
  const errors = shared.errors;
  const cleanups = [];
  const listen = (el, type, fn, o) => { el.addEventListener(type, fn, o); cleanups.push(() => el.removeEventListener(type, fn, o)); };
  const S = { hour: hzHour(), follow: true, night: 0, sleep: false, debug: {} };
  const Vt = { t: 0, i0: Infinity, manual: false };
  let gl = null, prog = null, buf = null, texMain = null, texM = [], texSprites = [], texDayEdge = null, texDayWash = null, U = {}, texReady = false, dpr = 1, bird = null, birdAt = 0, texSize = [1, 1], boxTex = 1, useMip = false;
  let textureSource = null, canvasLimit = null;
  let daylightEdgeInfo = null;
  let spriteCount = 0;
  for (const e of effects) if (e.sprite) e._sprite = spriteCount++;

  // 每个动作在 u_e 里占几格
  let NE = 0;
  for (const e of effects) { e._slot = NE; NE += e.type === 'carry' ? 2 : e.type === 'reveal' && e.mode !== 'write' ? Math.max(1, Math.ceil((e.items || []).length / 4)) : 1; }
  NE = Math.max(1, NE);
  const E = new Float32Array(NE * 4), Q = new Float32Array(NQ * 4), QC = new Float32Array(NQ * 4);
  for (const e of effects) {
    if (!e.path) continue;
    e._path = e.smooth === false ? e.path : smoothPath(e.path); e._L = pathLen(e._path);
    if (e.home) { let best = 1e9; e._path.forEach((q, i) => { const d = Math.hypot((q[0] - e.home[0]) * A, q[1] - e.home[1]); if (d < best) { best = d; e._hs = e._L[i] / e._L[e._L.length - 1]; } }); }
  }

  // ---------- 参数 ----------
  function sig(e, t) {         // 招牌动作的时间以开场结束为起点
    return t - Vt.i0 - INTRO;
  }
  function update(t) {
    E.fill(0); Q.fill(0); QC.fill(0);
    const night = S.night; let nq = 0;
    const addQ = (x, y, r, a, col, kind) => { if (nq >= NQ || a <= 0.001) return; Q.set([x, y, r, a], nq * 4); QC.set([col[0], col[1], col[2], kind], nq * 4); nq++; };
    for (const e of effects) {
      const o = e._slot * 4, ts = sig(e, t), tc = e.time && e.time.dur ? ts : t;
      const nb = 1 + (e.night || 0) * night;      // 夜里屏幕和灯更亮
      switch (e.type) {
        case 'sway': {
          const per = e.period || 5.5, g = e.gust || {}, ge = g.every || 14, gd = g.dur || 3.2;
          const k = Math.floor((t + 7) / ge), gt = (t + 7) - k * ge - (hash1(k + e._slot) * 2.0);
          const gp = gt > 0 && gt < gd ? gt / gd : -1;
          E.set([t * 2 * Math.PI / per, gp < 0 ? -9 : -0.35 + (A + 0.7) * eInOut(gp), gp < 0 ? 0 : (g.amp ?? 1.3) * Math.sin(Math.PI * gp), e.amp || 0.004], o);
          break;
        }
        case 'flow': {
          const per = e.period || 8;
          if (e.mode === 'wave') E.set([t * 2 * Math.PI / per, 0, 0, e.amp || 0.004], o);
          else E.set([t / per * 0.9, t / per * 0.6, 0, e.amp || 0.003], o);
          break;
        }
        case 'part': {
          let val = 0;
          if (e.time && e.time.dur) { const u = cycleU(e.time, ts); val = u < 0 ? 0 : (e.amp || 0) * (SHAPES[e.shape || 'bump'] || SHAPES.bump)(u); }
          else val = (e.amp || 0) * Math.sin(t * 2 * Math.PI / (e.period || 6) + (e.phase || 0));
          if (S.sleep && Number.isFinite(e.sleepValue)) val = e.sleepValue;   // 可选：原画里的鸟睡觉时定住头、闭上眼；未设时沿用上面的原公式
          E[o] = val; break;
        }
        case 'spin': {
          const ramp = clamp((t - Vt.i0) / Math.max(0.1, INTRO), 0, 1);
          E.set([(t - Vt.i0) * (e.speed || 1.2) * (0.35 + 0.65 * ramp), nb], o); break;
        }
        case 'glow': {
          let a = 0;
          if (e.time && e.time.dur) { const u = cycleU(e.time, ts); a = u < 0 ? 0 : (SHAPES[e.shape || 'pulse'] || SHAPES.pulse)(u); a *= e.amount ?? 0.4; }
          else { const per = e.period || 5; a = (e.base ?? 0) + (e.amount ?? 0.25) * (0.5 - 0.5 * Math.cos(t * 2 * Math.PI / per + (e.phase || 0))); }
          E[o] = a * nb + (e.nightBase || 0) * night; break;
        }
        case 'glint': {
          const u = cycleU(e.time, ts); if (u < 0) break;
          E.set([-0.25 + 1.5 * eInOut(u), (e.amount ?? 0.5) * Math.sin(Math.PI * u) * nb], o); break;
        }
        case 'sweep': {
          const u = cycleU(e.time, ts); if (u < 0) break;
          const back = e.back ? (u < 0.5 ? eInOut(u * 2) : 1 - eInOut((u - 0.5) * 2)) : eInOut(u);
          E.set([-0.08 + 1.16 * back, (e.amount ?? 0.6) * smooth(0, 0.08, u) * (1 - smooth(0.9, 1, u)) * nb], o); break;
        }
        case 'ripple': {
          if (e.time && e.time.dur) { const u = cycleU(e.time, ts); if (u < 0) break; E.set([u * (e.rings || 3) * 0.5, (e.amount ?? 0.4) * Math.sin(Math.PI * u) * nb], o); }
          else E.set([t / (e.period || 4), (e.amount ?? 0.3) * nb], o);
          break;
        }
        case 'carry': {
          if (e.sprite) {
            const u = cycleU(e.time, ts); if (u < 0) break;
            const uu = clamp(u / (e.flyPart ?? 1), 0, 1), pos = pathAt(e._path, e._L, eInOut(uu));
            E.set([pos.x, pos.y, (e.tilt ?? 0.12) * Math.sin(Math.PI * uu), 1 - (e.shrink ?? 0.25) * uu], o);
            E.set([smooth(0, 0.08, uu) * (1 - smooth(0.86, 1, uu)), 0, 0, 0], o + 4);
            break;
          }
          // 一次：起点淡入 → 沿路走，经过原位时和原图完全重合 → 终点缩小淡出；过了原位以后原位用纸色盖住，最后原位慢慢回来
          const u = cycleU(e.time, ts);
          if (u < 0) break;
          const fly = e.flyPart ?? 0.7, uu = Math.min(1, u / fly), s = eInOut(uu), hs = e._hs;
          const pos = pathAt(e._path, e._L, s), rel = (s - hs) / Math.max(hs, 1 - hs, 1e-3);
          const fade = u <= fly ? smooth(0, 0.12, uu) * (1 - smooth(0.86, 1, uu)) : 0;
          const cov = u <= fly ? smooth(hs - 0.1, hs - 0.004, s) : 1 - smooth(0, 1, (u - fly) / (1 - fly));
          E.set([pos.x, pos.y, (e.tilt ?? 0.15) * Math.sin(Math.PI * rel), 1 - (e.shrink ?? 0.25) * Math.abs(rel)], o);
          E.set([fade, cov, 0, 0], o + 4);
          break;
        }
        case 'reveal': {
          if (e.mode === 'write') { const u = cycleU(e.time, ts), before = e.time && ts < (e.time.start || 0) && e.time.hideBefore; const prog = before ? 0 : u < 0 ? 1.05 : eInOut(clamp(u / (e.writePart ?? 0.8), 0, 1)) * 1.05; E.set([prog, before || u >= 0 ? 1 : 0], o); }
          else {
            const u = cycleU(e.time, ts);
            const before = e.time && ts < (e.time.start || 0) && e.time.hideBefore;     // 开场时依次出来：第一次出来之前先藏着
            (e.items || []).forEach((it, k) => { const st = (it.at ?? k / Math.max(1, e.items.length)) * (e.spread ?? 0.75); E[o + k] = before ? 0.0001 : u < 0 ? 1 : clamp((u - st) / (e.popDur ?? 0.2), 0, 1); });
          }
          break;
        }
        case 'march': E[o] = ((t / (e.period || 2)) % 1) * (e.step || 0.02) * A; break;
        case 'drift': E.set([t / (e.period || 4), 1 - 0.6 * night, t * 0.05, 0], o); break;
        case 'dots': {
          const per = e.time && e.time.period, u = per ? cycleU(e.time, ts) : (t / (e.period || 3)) % 1;
          if (u < 0) break;
          const n = e.count || 3, gap = e.gap ?? 0.08, dirBack = e.pingpong && per && (cycleIndex(e.time, ts) % 2 === 1);
          const col = e.color || [0.85, 1.0, 0.9], r = (e.size || 0.012) * A;
          for (let j = 0; j < n; j++) {
            let s = u * (1 + gap * (n - 1)) - j * gap; if (s < 0 || s > 1) continue;
            const env = smooth(0, 0.08, s) * (1 - smooth(0.9, 1, s)) * (e.amount ?? 0.85) * nb;
            if (dirBack) s = 1 - s;
            for (let k = 0; k < (e.trail ?? 3); k++) { const p = pathAt(e._path, e._L, dirBack ? s + k * 0.018 : s - k * 0.018); addQ(p.x, p.y, r * (1 - k * 0.22), env * (1 - k * 0.3), col, 0); }
          }
          break;
        }
        case 'sparkle': {
          const u = cycleU(e.time, ts); if (u < 0) break;
          const k = cycleIndex(e.time, ts), pts = e.points || [], n = e.count || 3;
          for (let j = 0; j < n && pts.length; j++) {
            const st = (j / n) * 0.7, uu = (u - st) / 0.3; if (uu < 0 || uu > 1) continue;
            const pt = pts[Math.floor(hash1(k * 7 + j) * pts.length) % pts.length];
            addQ(pt[0] + (hash1(k * 13 + j) - 0.5) * 0.02, pt[1] + (hash1(k * 17 + j) - 0.5) * 0.02, (e.size || 0.03) * A * (0.6 + 0.4 * Math.sin(Math.PI * uu)), Math.sin(Math.PI * uu) * (e.amount ?? 0.9) * nb, e.color || [1, 0.97, 0.8], 1);
          }
          break;
        }
        case 'dust': {
          const n = e.count || 4, areas = e.areas || [[0, 0, 1, 1]], life = e.life || 9, col = e.color || [1, 0.98, 0.88];
          for (let j = 0; j < n; j++) {
            const off = hash1(j * 3.7 + 1) * life, x = t + off, k = Math.floor(x / life), ph = (x - k * life) / life;
            const ar = areas[Math.floor(hash1(j * 5 + k * 11) * areas.length) % areas.length];
            const bx = ar[0] + (ar[2] - ar[0]) * hash1(j * 19 + k * 23), by = ar[1] + (ar[3] - ar[1]) * hash1(j * 29 + k * 31);
            const dx = (hash1(j + k * 3) - 0.5) * 0.06 + 0.012 * Math.sin(t * 0.7 + j), dy = -0.05 * ph + 0.01 * Math.cos(t * 0.5 + j * 2);
            addQ(bx + dx * ph, by + dy, (e.size || 0.006) * A * (0.8 + 0.4 * hash1(j * 41 + k)), Math.pow(Math.sin(Math.PI * ph), 1.5) * (e.amount ?? 0.55), col, 0);
          }
          break;
        }
        case 'leaf': {
          const every = e.every || 20, dur = e.dur || 7.5, x0 = t - (e.start ?? 6), k = Math.floor(x0 / every);
          if (x0 < 0) break;
          const ph = (x0 - k * every - hash1(k + 5) * (every - dur) * 0.5) / dur; if (ph < 0 || ph > 1) break;
          const ar = (e.areas || [[0.1, 0.1, 0.3, 0.2]])[Math.floor(hash1(k * 3 + 1) * (e.areas || [1]).length) % (e.areas || [1]).length];
          const sx = ar[0] + (ar[2] - ar[0]) * hash1(k * 7 + 2), sy = ar[1] + (ar[3] - ar[1]) * hash1(k * 11 + 3);
          const fall = e.fall ?? 0.32, dir = hash1(k * 13) < 0.5 ? -1 : 1;
          const x = sx + dir * 0.05 * ph + 0.025 * Math.sin(ph * 6.0 + k), y = sy + fall * ph;
          const ang = (0.12 + 0.18 * Math.sin(ph * 5.2 + k)) * dir + (k % 2) * 0.5;
          const cols = e.colors || [[0.52, 0.74, 0.32], [0.42, 0.66, 0.30], [0.66, 0.80, 0.36]];
          const c = cols[k % cols.length];
          addQ(x, y, (e.size || 0.022) * A, smooth(0, 0.1, ph) * (1 - smooth(0.82, 1, ph)), c, 2 + ((ang / (2 * Math.PI)) % 1 + 1) % 1);
          break;
        }
        default: break;
      }
    }
    // 开场：晕开 → 停稳时轻轻回弹
    const it = t - Vt.i0;
    const intro = it < 0 ? 0 : it >= INTRO ? 9 : clamp(it / (INTRO * 0.78), 0, 1);
    let zoom = 1;
    if (it >= INTRO * 0.62 && it < INTRO) { const u = (it - INTRO * 0.62) / (INTRO * 0.38); zoom = 1 + (introCfg.bounce ?? 0.012) * Math.sin(Math.PI * u) * (1 - u * 0.3); }
    return { intro, zoom };
  }

  function makeDaylightEdge(src) {
    const effect=effects.find(e=>e.type==='daylight');if(!effect)return null;
    const channel=/^m([01])\.([rgb])$/.exec(effect.region?.mask||'');
    const image=channel&&src.masks[+channel[1]], canvas=document.createElement('canvas');
    let w,h,values;
    if(image) {
      w=image.naturalWidth||image.width;h=image.naturalHeight||image.height;canvas.width=w;canvas.height=h;
      const g=canvas.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);const rgba=g.getImageData(0,0,w,h).data,component='rgb'.indexOf(channel[2]);
      values=new Float32Array(w*h);for(let p=0;p<values.length;p++)values[p]=rgba[p*4+component]/255;
    } else {
      const raw=src.canvas,r=src.box,nw=raw.naturalWidth||raw.width,nh=raw.naturalHeight||raw.height;
      w=Math.max(1,Math.round(r[2]*nw));h=Math.max(1,Math.round(r[3]*nh));canvas.width=w;canvas.height=h;
      const g=canvas.getContext('2d',{willReadFrequently:true});g.drawImage(raw,r[0]*nw,r[1]*nh,r[2]*nw,r[3]*nh,0,0,w,h);const rgba=g.getImageData(0,0,w,h).data;
      const paper=new Uint8Array(w*h),queue=new Uint32Array(w*h);let head=0,tail=0;
      const candidate=p=>{const i=p*4,a=rgba[i]/255,b=rgba[i+1]/255,c=rgba[i+2]/255;return rgba[i+3]<76||(.299*a+.587*b+.114*c>.93&&Math.max(a,b,c)-Math.min(a,b,c)<.08);};
      const add=p=>{if(!paper[p]&&candidate(p)){paper[p]=1;queue[tail++]=p;}};
      for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
      while(head<tail){const p=queue[head++],x=p%w,y=(p/w)|0;if(x)add(p-1);if(x<w-1)add(p+1);if(y)add(p-w);if(y<h-1)add(p+w);}
      values=new Float32Array(w*h);for(let p=0;p<values.length;p++)values[p]=paper[p]?0:1;
    }
    const raster=(image,r)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true}),iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;g.drawImage(image,r[0]*iw,r[1]*ih,r[2]*iw,r[3]*ih,0,0,w,h);return g.getImageData(0,0,w,h).data;};
    const exact=src.exactPlate||src,flat=raster(exact.canvas,exact.box),raw=raster(src.originalImage||src.canvas,src.box);
    const support=new Uint8Array(w*h),visible=new Uint8Array(w*h),paper=new Uint8Array(w*h),washRegion=new Uint8Array(w*h),queue=new Uint32Array(w*h);
    const pale=p=>{const i=p*4,a=flat[i]/255,b=flat[i+1]/255,c=flat[i+2]/255;return .299*a+.587*b+.114*c>.88&&Math.min(a,b,c)>.83&&Math.max(a,b,c)-Math.min(a,b,c)<.18;};
    let borderFloor=h,alphaCount=0;
    // 只保作者已经排除的底部细长绿卡线；不把整条水彩底边一并当保留区。
    if(channel)for(let y=Math.floor(h*.85);y<h;y++){let green=0,off=0;for(let x=0;x<w;x++){const p=y*w+x,i=p*4;if(values[p]<.02)off++;if(flat[i+1]-flat[i]>18&&flat[i+1]-flat[i+2]>8)green++;}if(off>w*.8&&green>w*.25){borderFloor=y;break;}}
    for(let p=0;p<support.length;p++){if(raw[p*4+3]<76)alphaCount++;support[p]=values[p]>.08&&((p/w)|0)<borderFloor?1:0;}
    const floodOutside=mask=>{paper.fill(0);let head=0,tail=0;const add=p=>{if(!paper[p]&&!mask[p]){paper[p]=1;queue[tail++]=p;}};for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}while(head<tail){const p=queue[head++],x=p%w,y=(p/w)|0;if(x)add(p-1);if(x<w-1)add(p+1);if(y)add(p-w);if(y<h-1)add(p+w);}return tail;};
    floodOutside(support);
    if(channel&&alphaCount>support.length*.005){let head=0,tail=0;for(let p=0;p<support.length;p++)if(support[p])queue[tail++]=p;
      const add=p=>{if(!support[p]&&paper[p]&&((p/w)|0)<borderFloor&&raw[p*4+3]>76&&pale(p)&&Math.min(flat[p*4],flat[p*4+1],flat[p*4+2])<251){support[p]=1;queue[tail++]=p;}};
      while(head<tail){const p=queue[head++],x=p%w,y=(p/w)|0;if(x)add(p-1);if(x<w-1)add(p+1);if(y)add(p-w);if(y<h-1)add(p+w);}}
    for(let p=0;p<visible.length;p++)visible[p]=support[p]&&(raw[p*4+3]>76||Math.min(flat[p*4],flat[p*4+1],flat[p*4+2])<245)?1:0;
    const notches=[];
    const closeProfile=(profile,axis,side,fill)=>{const anchor=axis*.025;for(let i=1;i<profile.length-1;){if(!(profile[i]>anchor&&profile[i]<axis*.3&&profile[i-1]<=anchor)){i++;continue;}const start=i;while(i<profile.length&&profile[i]>anchor&&profile[i]<axis*.3)i++;const end=i;if(end>=profile.length||profile[end]>anchor||end-start>profile.length*.65||end-start<Math.max(8,profile.length*.05))continue;
        let lo=axis,hi=0;const trim=Math.floor((end-start)*.2);for(let q=start+trim;q<end-trim;q++){lo=Math.min(lo,profile[q]);hi=Math.max(hi,profile[q]);}if(hi-anchor<axis*.045||hi-lo>axis*.03)continue;
        let depth=0;for(let q=start;q<end;q++){const t=(q-start+1)/(end-start+1),a=profile[start-1]*(1-t)+profile[end]*t+axis*.012*Math.pow(Math.sin(Math.PI*t),2);depth=Math.max(depth,profile[q]-a);fill(q,a,profile[q]);}notches.push({side,start,end,depthNativePx:Math.round(depth)});}};
    if(channel&&alphaCount>support.length*.005){const left=new Float32Array(h).fill(w),right=new Float32Array(h).fill(w),top=new Float32Array(w).fill(h),bottom=new Float32Array(w).fill(h);
      for(let y=0;y<borderFloor;y++)for(let x=0;x<w;x++)if(visible[y*w+x]){left[y]=Math.min(left[y],x);right[y]=Math.min(right[y],w-1-x);top[x]=Math.min(top[x],y);bottom[x]=Math.min(bottom[x],h-1-y);}
      const set=p=>{if(((p/w)|0)<borderFloor&&pale(p)){support[p]=1;washRegion[p]=1;}};
      closeProfile(left,w,'left',(y,a,b)=>{for(let x=Math.max(0,Math.ceil(a));x<b;x++)set(y*w+x);});
      closeProfile(right,w,'right',(y,a,b)=>{for(let d=Math.max(0,Math.ceil(a));d<b;d++)set(y*w+w-1-d);});
      closeProfile(top,h,'top',(x,a,b)=>{for(let y=Math.max(0,Math.ceil(a));y<b;y++)set(y*w+x);});
      closeProfile(bottom,h,'bottom',(x,a,b)=>{for(let d=Math.max(0,Math.ceil(a));d<b;d++)set((h-1-d)*w+x);});}
    // 透明窄槽也可能深入真实画内。只闭合长而稳定的直槽，不把不规则云层或水彩外边补成矩形。
    const paperSlots=[];
    if(channel&&alphaCount>support.length*.005){
      const empty=p=>pale(p)&&raw[p*4+3]<180&&values[p]<.35&&((p/w)|0)<borderFloor;
      const scan=vertical=>{const span=vertical?w:h,length=vertical?h:w,index=(i,j)=>vertical?i*w+j:j*w+i;let active=[],tracks=[];
        for(let i=0;i<length;i++){const runs=[];for(let j=0;j<span;){if(!empty(index(i,j))){j++;continue;}const a=j;while(j<span&&empty(index(i,j)))j++;if(a>0&&j<span&&j-a<=Math.min(w,h)*.08)runs.push([a,j]);}
          const next=[];for(const [a,b] of runs){const n=active.findIndex(t=>Math.abs(t.a-a)<=2&&Math.abs(t.b-b)<=2&&Math.max(t.hi,b)-Math.min(t.lo,a)<=Math.min(w,h)*.1);
            const t=n<0?{a,b,lo:a,hi:b,runs:[]}:active.splice(n,1)[0];t.lo=Math.min(t.lo,a);t.hi=Math.max(t.hi,b);t.runs.push([i,a,b]);next.push(t);}tracks.push(...active);active=next;}
        tracks.push(...active);
        for(const t of tracks){const count=t.runs.length,width=t.hi-t.lo,starts=t.runs.map(r=>r[1]),ends=t.runs.map(r=>r[2]);if(count<Math.max(12,length*.08)||count<width*3||Math.max(...starts)-Math.min(...starts)>3||Math.max(...ends)-Math.min(...ends)>3)continue;
          for(const [i,a,b] of t.runs)for(let j=a;j<b;j++){const p=index(i,j);support[p]=1;washRegion[p]=1;}
          paperSlots.push({axis:vertical?'vertical':'horizontal',start:t.runs[0][0],end:t.runs[count-1][0]+1,bounds:[t.lo,t.hi]});}
      };scan(true);scan(false);
    }
    // 距离只取外连纸面；画内白云、纸、白机器人不当作外部缺口。
    floodOutside(support);let pr=0,pg_=0,pb=0,pn=0,wash=0,cr=0,cg=0,cb=0,cn=0;
    for(let p=0;p<support.length;p++){if(support[p]&&values[p]<.08)wash++;if(paper[p]&&pale(p)){pr+=flat[p*4];pg_+=flat[p*4+1];pb+=flat[p*4+2];pn++;if(raw[p*4+3]<76){cr+=flat[p*4];cg+=flat[p*4+1];cb+=flat[p*4+2];cn++;}}}
    if(cn){pr=cr;pg_=cg;pb=cb;pn=cn;}
    const paperColor=pn?[pr/pn/255,pg_/pn/255,pb/pn/255]:(cfg.paper||[254,254,254]).map(v=>v/255);
    // 缺口是纸上的暗洗，不补树或物件。只扩散边界的低频色，不让统一蓝块形成新直角。
    const fill=new Uint8Array(w*h),ids=[],colors=new Float32Array(w*h*3);
    for(let p=0;p<fill.length;p++){if(washRegion[p]&&raw[p*4+3]<76){fill[p]=1;ids.push(p);}for(let c=0;c<3;c++)colors[p*3+c]=raw[p*4+3]>76?raw[p*4+c]/255:paperColor[c];}
    let nr=0,ng=0,nb=0,nn=0;
    for(const p of ids){const x=p%w,y=(p/w)|0;for(const q of [x?p-1:p,x<w-1?p+1:p,y?p-w:p,y<h-1?p+w:p])if(!fill[q]&&raw[q*4+3]>76){nr+=raw[q*4];ng+=raw[q*4+1];nb+=raw[q*4+2];nn++;}}
    if(nn)for(const p of ids){colors[p*3]=nr/nn/255;colors[p*3+1]=ng/nn/255;colors[p*3+2]=nb/nn/255;}
    for(let round=0;round<80;round++)for(const p of ids){const x=p%w,y=(p/w)|0,a=x?p-1:p,b=x<w-1?p+1:p,c=y?p-w:p,d=y<h-1?p+w:p;for(let k=0;k<3;k++)colors[p*3+k]=(colors[a*3+k]+colors[b*3+k]+colors[c*3+k]+colors[d*3+k])*.25;}
    const washCanvas=document.createElement('canvas');washCanvas.width=w;washCanvas.height=h;const wg=washCanvas.getContext('2d'),wd=wg.createImageData(w,h);
    for(let p=0;p<fill.length;p++){for(let c=0;c<3;c++)wd.data[p*4+c]=Math.round(colors[p*3+c]*255);wd.data[p*4+3]=fill[p]*255;}wg.putImageData(wd,0,0);
    const distance=new Float32Array(w*h),diagonal=Math.SQRT2,far=w+h;
    for(let p=0;p<distance.length;p++)distance[p]=paper[p]?0:far;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=y*w+x;if(!distance[p])continue;let d=distance[p];if(x)d=Math.min(d,distance[p-1]+1);else d=Math.min(d,1);if(y){d=Math.min(d,distance[p-w]+1);if(x)d=Math.min(d,distance[p-w-1]+diagonal);if(x<w-1)d=Math.min(d,distance[p-w+1]+diagonal);}else d=Math.min(d,1);distance[p]=d;}
    for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){const p=y*w+x;if(!distance[p])continue;let d=distance[p];if(x<w-1)d=Math.min(d,distance[p+1]+1);else d=Math.min(d,1);if(y<h-1){d=Math.min(d,distance[p+w]+1);if(x)d=Math.min(d,distance[p+w-1]+diagonal);if(x<w-1)d=Math.min(d,distance[p+w+1]+diagonal);}else d=Math.min(d,1);distance[p]=d;}
    const radius=Math.max(2,Math.min(w,h)*.05),g=canvas.getContext('2d'),out=g.createImageData(w,h);let soft=0;
    for(let p=0;p<distance.length;p++){const t=clamp(distance[p]/radius,0,1),v=t*t*(3-2*t);if(v>0&&v<1)soft++;out.data[p*4]=Math.round(v*255);out.data[p*4+1]=channel?support[p]*255:0;out.data[p*4+2]=0;out.data[p*4+3]=255;}
    g.putImageData(out,0,0);daylightEdgeInfo={kind:'visible-watercolor-contour-with-exterior-paper-wash',nativeSize:[w,h],featherNativePx:radius,source:channel?effect.region.mask:'edge-connected-paper-in-exact-texture',softPixels:soft,exteriorNotches:notches,exteriorPaperSlots:paperSlots,nightPaperWashPixels:wash,softWashOnlyPixels:ids.length,protectedBorderFloor:borderFloor,paperColor};return {edge:canvas,wash:washCanvas};
  }

  // ---------- 显卡 ----------
  async function initGL(src) {
    const o = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false };
    gl = canvas.getContext('webgl2', o) || canvas.getContext('webgl', o);
    if (!gl) return false;
    const isGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    const sh = (type, s) => { const x = gl.createShader(type); gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const FS = buildShader(effects, A, NE, !!V.texture);
    prog = gl.createProgram();
    const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (parallel) while (!destroyed && !failed && !gl.isContextLost() && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) await new Promise(r => requestAnimationFrame(r));
    if (destroyed || failed || gl.isContextLost()) return false;
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('着色器编译失败：' + (gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog)));
    gl.deleteShader(vs); gl.deleteShader(fs);
    gl.useProgram(prog);
    buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const mk = (unit, image, mip, raw) => {
      const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, raw ? gl.NONE : gl.BROWSER_DEFAULT_WEBGL);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      if (mip && isGL2) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
      else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return t;
    };
    // 显示得比原图小很多（不到 0.6 倍）时才用多级纹理，否则和浏览器缩放原图的算法差得更多
    const tw_ = src.canvas.naturalWidth || src.canvas.width, th_ = src.canvas.naturalHeight || src.canvas.height;
    boxTex = src.box[2] * tw_;
    const shrink = (root.getBoundingClientRect().width * (global.devicePixelRatio || 1)) / boxTex;
    const mipThreshold = V.texture ? 0.25 : 0.6;
    texMain = mk(0, src.canvas, shrink < mipThreshold && !S.debug.noMip, false);
    const blank = document.createElement('canvas'); blank.width = blank.height = 1;
    texM = [mk(1, src.masks[0] || blank, false, true), mk(2, src.masks[1] || blank, false, true)];
    const dayEdge=makeDaylightEdge(src);
    if (spriteCount > gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) - 3 - (dayEdge?2:0)) throw new Error('独立素材数量超过显卡纹理上限');
    texSprites = (src.sprites || []).map((im, i) => mk(3 + i, im, false, false));
    if(dayEdge){texDayEdge=mk(3+spriteCount,dayEdge.edge,false,true);texDayWash=mk(4+spriteCount,dayEdge.wash,false,true);}
    for (const k of ['u_tex', 'u_m0', 'u_m1', 'u_box', 'u_e', 'u_q', 'u_qc', 'u_paper', 'u_intro', 'u_zoom', 'u_full', 'u_ic', 'u_hq', 'u_tsz', 'u_map', 'u_day', 'u_dayl', 'u_dayEdge', 'u_dayPaper', 'u_dayWash']) U[k] = gl.getUniformLocation(prog, k);
    gl.uniform2f(U.u_tsz, tw_, th_); texSize = [tw_, th_]; useMip = shrink < mipThreshold && isGL2 && !S.debug.noMip;
    gl.uniform1i(U.u_tex, 0); gl.uniform1i(U.u_m0, 1); gl.uniform1i(U.u_m1, 2);
    if(dayEdge)gl.uniform1i(U.u_dayEdge,3+spriteCount);
    if(dayEdge)gl.uniform1i(U.u_dayWash,4+spriteCount);
    if(dayEdge)gl.uniform3fv(U.u_dayPaper,daylightEdgeInfo.paperColor);
    for (let i = 0; i < spriteCount; i++) gl.uniform1i(gl.getUniformLocation(prog, `u_s${i}`), 3 + i);
    gl.uniform4f(U.u_box, src.box[0], src.box[1], src.box[2], src.box[3]);
    const pc = cfg.paper || [254, 254, 254]; gl.uniform3f(U.u_paper, pc[0] / 255, pc[1] / 255, pc[2] / 255);
    const ic = introCfg.center || [0.5, 0.5]; gl.uniform2f(U.u_ic, ic[0], ic[1]);
    gl.enable(gl.BLEND); gl.disable(gl.BLEND);
    texReady = true; return true;
  }

  // 首屏图里插画框那一块（取整到外接像素，原样拷贝不重采样），同时核对是不是配置做的那张画
  function cropSource(im) {
    const nw = im.naturalWidth, nh = im.naturalHeight;
    const x = box[0] * nw, y = box[1] * nh, w = box[2] * nw, h = box[3] * nh;
    const x0 = Math.max(0, Math.floor(x) - 1), y0 = Math.max(0, Math.floor(y) - 1), x1 = Math.min(nw, Math.ceil(x + w) + 1), y1 = Math.min(nh, Math.ceil(y + h) + 1);
    const c = document.createElement('canvas'); c.width = x1 - x0; c.height = y1 - y0;
    const g = c.getContext('2d', { willReadFrequently: true }); g.imageSmoothingEnabled = false;
    g.drawImage(im, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
    if (V.probe && V.probe.length) {
      const pw = 200, ph = Math.max(1, Math.round(nh * pw / nw)), pc = document.createElement('canvas'); pc.width = pw; pc.height = ph;
      const pg = pc.getContext('2d', { willReadFrequently: true }); pg.imageSmoothingQuality = 'high'; pg.drawImage(im, 0, 0, pw, ph);
      const data = pg.getImageData(0, 0, pw, ph).data; let sum = 0, worst = 0;
      for (const [px, py, r, gg, b] of V.probe) { const i = (Math.min(ph - 1, Math.round(py * ph - 0.5)) * pw + Math.min(pw - 1, Math.round(px * pw - 0.5))) * 4;
        const d = (Math.abs(data[i] - r) + Math.abs(data[i + 1] - gg) + Math.abs(data[i + 2] - b)) / 3; sum += d; worst = Math.max(worst, d); }
      const mean = sum / V.probe.length;
      if (mean > 22 || worst > 80) throw Object.assign(new Error(`首屏图和配置对不上（取样平均差 ${mean.toFixed(1)}，最大 ${worst.toFixed(1)}）`), { code: 'image-mismatch' });
    }
    return { canvas: c, box: [(x - x0) / c.width, (y - y0) / c.height, w / c.width, h / c.height] };
  }

  async function highestImageSource() {
    // 当前显示图可能是 srcset 的小档或 640 像素兜底。纹理使用同一 picture 里现有的最高档；
    // 不改页面选图和布局，也不把小档先放大成所谓高清图。
    const candidates = new Map(), current = img.currentSrc || img.src;
    const add = (url, width) => {
      if (!url) return;
      try { const href = new URL(url, document.baseURI).href; const old = candidates.get(href); if (!old || old.width < width) candidates.set(href, { url: href, width }); } catch (e) {}
    };
    add(current, img.naturalWidth);
    add(img.getAttribute('src'), imgSize[0]); add(img.dataset.src, imgSize[0]);
    const srcset = value => {
      if (!value || /^data:/i.test(value)) return;
      for (const entry of value.split(',')) {
        const m = entry.trim().match(/^(\S+)(?:\s+(\d+(?:\.\d+)?)(w|x))?$/);
        if (m) add(m[1], m[3] === 'w' ? +m[2] : imgSize[0] * (+m[2] || 1));
      }
    };
    for (const el of [img, ...Array.from(img.closest('picture')?.querySelectorAll('source') || [])]) {
      if (el.media && !global.matchMedia(el.media).matches) continue;
      for (const key of ['srcset', 'data-srcset', 'data-lazy-srcset']) srcset(el.getAttribute(key));
    }
    const sorted = Array.from(candidates.values()).sort((a, b) => b.width - a.width || (a.url === current ? -1 : 1));
    let lastError = null;
    for (const candidate of sorted) {
      try {
        // 单独读 srcset URL 才能取得文件真实像素；img.naturalWidth 可能已按 srcset 密度校正。
        let im = candidate.url === current && !img.closest('picture')?.querySelector('source') && !img.srcset && readable(img) ? img :
          await loadImage(opts._noCorsBust ? candidate.url : corsURL(candidate.url), true);
        if (!readable(im)) continue;
        if (Math.abs(im.naturalWidth / im.naturalHeight - imgSize[0] / imgSize[1]) / (imgSize[0] / imgSize[1]) > 0.015) continue;
        const crop = cropSource(im);
        const sourceURL = u => /^data:/i.test(u) ? u.slice(0, u.indexOf(',')) + ',[embedded-image]' : u;
        textureSource = { url: sourceURL(candidate.url), size: [im.naturalWidth, im.naturalHeight], selectedWidth: candidate.width,
          displayedURL: sourceURL(current), displayedSize: [img.naturalWidth, img.naturalHeight], highestAvailableWidth: sorted[0]?.width || 0 };
        return crop;
      } catch (e) { lastError = e; /* 高档读取失败时继续尝试同一幅图的现有档位。 */ }
    }
    if (lastError && lastError.code === 'image-mismatch') throw lastError;
    throw Object.assign(new Error('首屏图不允许交给显卡（跨域许可没配）'), { code: 'cors' });
  }

  async function originalTextureSource(screenCrop) {
    if (!V.texture || !V.texture.src) return screenCrop;
    const spec = V.texture, r = spec.box || [0, 0, 1, 1];
    if (r.length !== 4 || !r.every(Number.isFinite) || r[0] < 0 || r[1] < 0 || r[2] <= 0 || r[3] <= 0 || r[0] + r[2] > 1 || r[1] + r[3] > 1)
      throw Object.assign(new Error('原插画纹理框无效'), { code: 'texture-source' });
    const url = new URL(spec.src, shared.base).href;
    const im = await loadImage(url, true), w = im.naturalWidth, h = im.naturalHeight;
    if ((spec.size && (spec.size[0] !== w || spec.size[1] !== h)) || Math.abs((r[2] * w) / (r[3] * h) / A - 1) > 0.015)
      throw Object.assign(new Error('原插画纹理尺寸或比例和插画框不一致'), { code: 'texture-source' });
    // 原图按原生像素上传；透明处只合成到现有纸色，绝不先缩小再放大。
    const native = document.createElement('canvas'); native.width = w; native.height = h;
    const g = native.getContext('2d'), pc = cfg.paper || [254, 254, 254];
    g.fillStyle = `rgb(${pc.join(',')})`; g.fillRect(0, 0, w, h); g.drawImage(im, 0, 0);
    const screenSource = textureSource;
    textureSource = { url: /^data:/i.test(url) ? url.slice(0, url.indexOf(',')) + ',[embedded-image]' : url,
      size: [w, h], kind: 'original-illustration', screenSource, sourcePixelsPreserved: true };
    return { canvas: native, box: r.slice(), originalImage:im, exactPlate:screenCrop };
  }

  async function load() {
    if (reduce || destroyed || failed) return;
    try {
      await imageReady(img);
      if (destroyed) return;
      const nw = img.naturalWidth, nh = img.naturalHeight;
      if (Math.abs(nw / nh - imgSize[0] / imgSize[1]) / (imgSize[0] / imgSize[1]) > 0.015) throw Object.assign(new Error('首屏图比例和配置不一致'), { code: 'image-mismatch' });
      // 记录原图已获得一次显示机会。默认不再把已显示的图涂白；很早挂载且本帧准备好时仍可开场。
      requestAnimationFrame(() => { if (!destroyed && img.getClientRects().length) originalPresented = true; });
      if (destroyed || reduce) return;
      // 从同一幅首屏图的现有档位里选最高原生像素；跨域地址沿用固定参数复用可读缓存。
      const screenCrop = await highestImageSource(); // 仍先核对首屏身份与既有 probe，原插画不替代这项检查。
      const crop = await originalTextureSource(screenCrop);
      const masks = await Promise.all((V.masks || []).slice(0, 2).map(m => loadImage(new URL(m.src, shared.base).href, true)));
      const sprites = await Promise.all(effects.filter(e => e.sprite).map(e => loadImage(new URL(e.sprite.src, shared.base).href, true)));
      if (destroyed || reduce) return;
      crop.masks = masks; crop.sprites = sprites;
      const ok = await initGL(crop);
      if (destroyed || reduce) return;
      if (!ok) { stop('webgl-unavailable'); return; }
      layout();
      active = true; phase = 'live'; reason = null;
      introEnabled = opts.intro === true || (opts.intro !== false && !originalPresented);
      introReason = opts.intro === true ? 'explicit-on' : opts.intro === false ? 'explicit-off' : originalPresented ? 'image-already-visible' : 'early-mount';
      if (!Vt.manual) { Vt.i0 = introEnabled ? Vt.t : Vt.t - INTRO - 0.01; }
      root.classList.add('is-live');
      resetBudget(); render(); schedule();
    } catch (e) { stop(e.code || 'asset-or-webgl-error', e); }
  }

  // ---------- 小鸟（独立模块 LivingBird，放在引擎同目录的 bird 文件夹里，用到时才读） ----------
  function birdWanted() { return !!(V.bird && V.bird.perches && V.bird.perches.length && !destroyed && !failed && !S.debug.noBird && opts.bird !== false); }
  function mountBird(auto) {
    // 动态鸟等画第一次进入眼前才开始；减少动态则直接停在第一个原落点。
    if (bird || !birdWanted() || (!reduce && shared.paused && !Vt.manual)) return;
    if (!global.LivingBird) { loadBird().then(() => { if (!destroyed && !bird && global.LivingBird) mountBird(auto); }); return; }
    try {
      const holder = document.createElement('div'); holder.className = 'living-bird'; root.append(holder);
      Object.assign(holder.style, { left: frameBox[2] + 'px', top: frameBox[3] + 'px', width: frameBox[0] + 'px', height: frameBox[1] + 'px', right: 'auto', bottom: 'auto' });
      const B = toBox(V.bird, box);
      // 沿用每幅画的比例与最小高度；手机保留原有的小一号比例。
      const H = frameBox[1] || 1, small = global.innerWidth < 600 || frameBox[0] < 520;
      const minSize = B.minSize > 0 ? B.minSize : 24;
      const px = Math.max(minSize, (B.size || 0.15) * (small ? 0.82 : 1) * H);
      bird = global.LivingBird.mount(holder, {
        sprites: opts.birdSprites || new URL(BIRD_DIR, ENGINE_BASE).href,
        perches: B.perches.map(p => ({ x: p.x, y: p.y, facing: p.facing || 'left', span: p.span || 0 })),
        size: px / H, minSize, night: S.sleep, speed: SPEED, reducedMotion: reduce,
        from: B.from || 'right', auto: auto !== false });
      bird._holder = holder; birdAt = Vt.manual ? (introEnabled ? INTRO * 0.55 : 0) : Vt.t;
      // 模块晚到时也承接公开 seek 的目标，不在定格录像中另开真实时钟。
      if (Vt.manual && bird.seek) bird.seek(Math.max(0, Vt.t - birdAt));
    } catch (e) { errors.push('小鸟：' + (e.message || e)); bird = null; }
  }
  function dropBird() { if (bird) { try { bird.destroy(); } catch (e) {} if (bird._holder) bird._holder.remove(); bird = null; } }
  function showReducedBird() {
    return imageReady(img).then(() => {
      if (destroyed || !reduce || failed) return;
      S.hour = S.follow ? hzHour() : S.hour; S.sleep = sleepAt(S.hour);
      layout(); mountBird(true);
    }).catch(e => { if (!destroyed) errors.push(String(e.message || e)); });
  }

  // ---------- 布局、渲染、循环 ----------
  // Chrome 会按 CSS 与设备像素各取一次整。DPR 3.5 的奇数 CSS 像素会落在半个设备像素上，
  // 使 canvas 再被线性采样一次；外接矩形同时对齐两种网格，shader 仍映射到精确插画框。
  let map = [1, 1, 0, 0];
  let frameBox = [boxPx[0], boxPx[1], 0, 0];
  function layout() {
    const P = part.getBoundingClientRect(); if (!P.width || !P.height) return;
    const dA = global.devicePixelRatio || 1, I = img.getBoundingClientRect();
    const iw = Math.round(I.width), ih = Math.round(I.height);
    const L = Math.round(I.left) + box[0] * iw + (global.scrollX || 0), T = Math.round(I.top) + box[1] * ih + (global.scrollY || 0);
    const rw = box[2] * iw, rh = box[3] * ih;
    const grid = Number.isInteger(dA) ? 1 : Number.isInteger(dA * 2) ? 2 : Number.isInteger(dA * 4) ? 4 : 1;
    const aL = Math.round(L / grid) * grid, aT = Math.round(T / grid) * grid;
    const cssW = Math.ceil((L + rw) / grid) * grid - aL, cssH = Math.ceil((T + rh) / grid) * grid - aT;
    Object.assign(root.style, { left: (aL - P.left - (global.scrollX || 0)) + 'px', top: (aT - P.top - (global.scrollY || 0)) + 'px', width: cssW + 'px', height: cssH + 'px' });
    Object.assign(canvas.style, { left: '0px', top: '0px', transform: '', width: cssW + 'px', height: cssH + 'px' });
    map = [cssW / rw, cssH / rh, (L - aL) / rw, (T - aT) / rh];
    frameBox = [rw, rh, L - aL, T - aT];
    if (bird && bird._holder) Object.assign(bird._holder.style, { left: frameBox[2] + 'px', top: frameBox[3] + 'px', width: rw + 'px', height: rh + 'px' });
    dpr = dA;     // 画布按实际设备像素画；原图的像素数量不再限制画布分辨率。
    let cw = Math.round(cssW * dpr), ch = Math.round(cssH * dpr);
    canvasLimit = null;
    if (gl) {
      const vp = gl.getParameter(gl.MAX_VIEWPORT_DIMS), rb = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
      const cap = Math.min(1, Math.min(vp[0], rb) / cw, Math.min(vp[1], rb) / ch);
      if (cap < 1) { cw = Math.max(1, Math.floor(cw * cap)); ch = Math.max(1, Math.floor(ch * cap)); canvasLimit = 'webgl-hardware-limit'; }
    }
    if (S.debug.canvas) { cw = S.debug.canvas[0]; ch = S.debug.canvas[1]; }
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    if (gl) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (U.u_map) gl.uniform4f(U.u_map, map[0], map[1], map[2], map[3]);
      // 画布比原图那一块小（缩小显示）时，按浏览器缩小原图的办法取样（加了窗的 sinc，范围随缩小倍数放宽）；
      // 放大显示或缩得很小（用多级纹理）时用普通的双线性取样
      if (U.u_hq) { const k = canvas.width / map[0] / boxTex; gl.uniform1f(U.u_hq, !useMip && k < 0.999 && !S.debug.noHQ ? Math.max(V.texture ? 0.25 : 0.5, k) : 0); }
    }
  }
  function render() {
    if (!texReady || failed || reduce) return;
    const T = Vt.t;
    S.hour = S.follow ? hzHour() : S.hour;
    S.night = S.debug.night != null ? S.debug.night : nightAt(S.hour);
    const sl = S.debug.sleep != null ? S.debug.sleep : sleepAt(S.hour);
    if (sl !== S.sleep) { S.sleep = sl; if (bird && bird.setNight) bird.setNight(sl); }
    const it = T - Vt.i0;
    if (!bird && it > INTRO * 0.55 && birdWanted()) mountBird(true);
    const st = update(T);
    if (S.debug.only === 'none') { E.fill(0); Q.fill(0); for (const e of effects) if (e.type === 'reveal' && e.mode !== 'write') E.fill(1, e._slot * 4, e._slot * 4 + (e.items || []).length); }
    if (S.debug.only === 'motion') { for (const e of effects) { if (/^(glow|glint|sweep|ripple)$/.test(e.type)) E.fill(0, e._slot * 4, e._slot * 4 + 4); if (e.type === 'spin' || e.type === 'drift') E[e._slot * 4 + 1] = 0; } Q.fill(0); }
    gl.uniform4fv(U.u_e, E); gl.uniform4fv(U.u_q, Q); gl.uniform4fv(U.u_qc, QC);
    if (U.u_day) { const dl = effects.find(e => e.type === 'daylight'); if (dl && !S.debug.only) { const P = todParams(S.hour), amt = dl.amount ?? 1; gl.uniform4f(U.u_day, P.o[0], P.o[1], P.o[2], Math.abs(P.o[0] - 1) + Math.abs(P.o[1] - 1) + Math.abs(P.o[2] - 1) > 0.01 ? amt : 0); gl.uniform3f(U.u_dayl, P.l[0], P.l[1], P.l[2]); } else gl.uniform4f(U.u_day, 1, 1, 1, 0); }
    gl.uniform1f(U.u_intro, S.debug.noIntro ? 9 : st.intro); gl.uniform1f(U.u_zoom, S.debug.noIntro ? 1 : st.zoom); gl.uniform1f(U.u_full, S.debug.full === 'map' ? 2 : S.debug.full ? 1 : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  let last = 0, fpsN = 0, fpsT = 0, fps = 0;
  function canAnimate() { return !destroyed && active && !failed && !reduce && texReady; }
  function shouldRun() { return canAnimate() && !shared.paused; }
  // 防卡死的保险：和首页同一份代码（makeGuard），口径见那里的注释
  const guard = makeGuard({ label: 'LivingArt', shouldRun: () => shouldRun(), exempt: () => Vt.manual, shared, stop: why => stop(why) });
  const GUARD = guard.rules;
  function resetGuard(grace = 0) { guard.reset(grace); }
  function resetBudget() { last = 0; guard.reset(GUARD.graceMs); }
  function checkFrameGuard(now) { return guard.check(now); }
  function schedule() {
    if (destroyed) return;
    if (shouldRun()) { if (!raf) raf = requestAnimationFrame(frame); }
    else { if (raf) cancelAnimationFrame(raf); raf = 0; resetBudget(); }
  }
  function frame(now) {
    raf = 0;
    if (!shouldRun()) return;
    const rawGap = last ? now - last : 0, dt = Math.min(0.05, rawGap / 1000); last = now;
    frames++; maxFrame = Math.max(maxFrame, rawGap);
    if (checkFrameGuard(now)) return;
    try { if (!Vt.manual) Vt.t += dt * RATE; render(); }
    catch (e) { stop('render-error', e); return; }
    fpsN++; if (now - fpsT >= 1000) { fps = Math.round(fpsN * 1000 / (now - fpsT)); fpsN = 0; fpsT = now; }
    schedule();
  }
  function paintStatic() { root.classList.remove('is-live'); }
  function stop(why, error) {
    if (destroyed) return;
    failed = true; phase = 'static'; reason = why;
    if (why === 'webgl-context-lost') console.info('[LivingArt] 动效退回静态：WebGL 上下文丢失；仅本页本次生效。');
    if (error) errors.push(String(error.message || error));
    dropBird(); schedule(); paintStatic();
  }
  function pauseChanged() {
    if (lastPaused && !shared.paused) resetBudget();
    lastPaused = shared.paused; schedule();
  }
  function preferenceChanged() {
    reduce = shared.reduced;
    dropBird();
    if (reduce) { phase = 'static'; reason = 'reduced-motion'; paintStatic(); schedule(); showReducedBird(); return; }
    if (failed) return;
    if (texReady) { active = true; phase = 'live'; reason = null; Vt.i0 = Vt.t - INTRO - 0.01; root.classList.add('is-live'); resetBudget(); render(); schedule(); }
    else load();
  }
  // 把时间定在第 s 秒（开场从第 0 秒开始）。动作都只看时间，结果每次一样；小鸟用它自己的 seek。
  function seek(s) {
    resetGuard(GUARD.graceMs);
    if (reduce || failed || !texReady) return Vt.t;
    Vt.manual = true; Vt.t = s; Vt.i0 = introEnabled ? 0 : -INTRO - 0.01;
    const birdStart = introEnabled ? INTRO * 0.55 : 0;
    if (!bird && s >= birdStart && birdWanted()) { mountBird(true); birdAt = birdStart; }
    render();
    if (bird && bird.seek) { bird.seek(Math.max(0, s - birdAt)); if (bird.setNight) bird.setNight(S.sleep); }
    return Vt.t;
  }
  listen(canvas, 'webglcontextlost', e => { e.preventDefault(); stop('webgl-context-lost'); });
  const ready = Promise.resolve().then(async () => {
    if (reduce) { phase = 'static'; reason = 'reduced-motion'; await showReducedBird(); return; }
    await load();
  });
  function destroy() {
    if (destroyed) return; destroyed = true; phase = 'destroyed';
    if (raf) cancelAnimationFrame(raf);
    cleanups.forEach(f => f()); dropBird();
    if (gl && !gl.isContextLost()) {
      if (prog) gl.deleteProgram(prog); [texMain, ...texM, ...texSprites, texDayEdge, texDayWash].forEach(t => t && gl.deleteTexture(t)); if (buf) gl.deleteBuffer(buf);
      const lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
    }
    root.remove();
  }
  return { ready, destroy, pauseChanged, preferenceChanged, layout, seek, root, orient,
    leave: () => bird && bird.leave ? Promise.resolve(bird.leave()).catch(() => {}) : Promise.resolve(),
    get bird() { return bird; }, S, Vt, INTRO, effects,
    setHour: h => {
      S.follow = false; S.hour = ((Number(h) % 24) + 24) % 24;
      if (reduce) { S.sleep = sleepAt(S.hour); if (bird && bird.setNight) bird.setNight(S.sleep); }
      else if (!Vt.manual) render();
    },
    setDebug: d => { Object.assign(S.debug, d); if ('canvas' in d || 'noHQ' in d) layout(); if (d.noBird) dropBird(); if (texReady && !failed && !reduce) render(); },
    play: () => { Vt.manual = false; resetGuard(GUARD.graceMs); schedule(); },
    shader: () => buildShader(effects, A, NE, !!V.texture),
    gl: () => gl,
    diagnostics: () => ({ phase, reason, orient, paused: shared.paused, frames, maxFrame, fps, canvas: [canvas.width, canvas.height], dpr, bird: !!bird, intro: { enabled: introEnabled, reason: introReason },
      resolution: { css: [canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height],
        actualDpr: [canvas.width / Math.max(1, canvas.getBoundingClientRect().width), canvas.height / Math.max(1, canvas.getBoundingClientRect().height)],
        limit: canvasLimit, texture: textureSource, textureCrop: texSize.slice(), sourcePixelsPerDevicePixel: boxTex / Math.max(1, canvas.width / map[0]),
        sampling: useMip ? 'linear-mipmap-linear' : 'windowed-sinc-or-linear', daylightEdge:daylightEdgeInfo },
      frameGuard: guard.state(), errors: errors.slice() }) };
}

// ---------- 挂载 ----------
// target：首屏那一节（.typeset-screen，里面有横竖两个 .typeset-part），或者单个 .typeset-part。
// options.config：配置地址（相对页面）或已经读好的配置对象。没有配置的页什么都不做。
function mount(target, options = {}) {
  if (typeof target === 'string') target = document.querySelector(target);
  if (!target || target.nodeType !== 1) throw new TypeError('mount 需要一个容器元素');
  if (target.__living) target.__living.destroy();
  let scene = null, cfg = null, destroyed = false, current = null, pendingSeek = null;
  const W = watch(target, { pause: () => { if (scene) scene.pauseChanged(); }, reduced: () => { if (scene) scene.preferenceChanged(); }, resize: () => refresh() });
  const shared = W.shared; shared.base = document.baseURI;
  const parts = () => {
    if (options.parts) return Object.entries(options.parts).map(([o, el]) => ({ o, el }));
    const list = target.matches('.typeset-part') ? [target] : [...target.querySelectorAll('.typeset-part[data-orientation]')];
    return list.map(el => ({ o: el.dataset.orientation, el }));
  };
  const shown = el => !el.hidden && el.getClientRects().length > 0 && el.offsetWidth > 0;
  function pick() {
    const list = parts().filter(x => cfg[x.o]);
    return list.find(x => shown(x.el)) || null;
  }
  function refresh() {
    if (!cfg || destroyed) return;
    const next = pick();
    if (next && current && next.el === current.el) { scene && scene.layout(); return; }
    if (scene) { scene.destroy(); scene = null; }
    current = next; if (!next) return;
    W.observe(next.el);
    scene = createScene(next.el, next.o, cfg, shared, options);
    if (pendingSeek != null) scene.ready.then(() => scene && scene.seek(pendingSeek));
  }
  const ready = Promise.resolve().then(async () => {
    try {
      if (options.config && typeof options.config === 'object') { cfg = options.config; shared.base = options.assetBase || document.baseURI; }
      else if (typeof options.config === 'string') {
        const url = new URL(options.config, document.baseURI);
        const r = await fetch(url, { mode: 'cors', credentials: 'omit' }); if (!r.ok) throw new Error('配置读取失败');
        cfg = await r.json(); shared.base = url.href;
      } else return api;      // 没有配置：这一页不出活画
      if (destroyed) return api;
      if (cfg.disabled) return api;
      refresh();
      if (scene) await scene.ready;
    } catch (e) { shared.errors.push(String(e.message || e)); }
    return api;
  });
  const api = {
    ready,
    leave() { return scene ? scene.leave() : Promise.resolve(); },
    destroy() {
      if (destroyed) return; destroyed = true;
      if (scene) scene.destroy(); W.dispose();
      if (target.__living === api) delete target.__living; mounts.delete(api);
    },
    diagnostics() { return scene ? scene.diagnostics() : { phase: destroyed ? 'destroyed' : 'none', reason: cfg ? (cfg.disabled ? 'disabled' : 'no-visible-part') : 'no-config', errors: shared.errors.slice() }; },
  };
  if (options.preview) {
    Object.assign(api, {
      seek: s => { pendingSeek = s; return scene ? scene.seek(s) : 0; },
      play: () => { pendingSeek = null; scene && scene.play(); },
      setHour: h => scene && scene.setHour(h),
      setDebug: d => scene && scene.setDebug(d),
      scene: () => scene,
    });
  }
  target.__living = api; mounts.add(api); return api;
}
// 共用部分给首页的场景模块用（首页专用的画、画里屏幕那一层、首页的鸟在 home-scene.js 里）
const core = Object.freeze({ makeGuard, watch, loadImage, readable, corsURL, hzHour, hzDate: () => new Date(Date.now() + 8 * 3600e3), sunTimes, todParams, SPEED });
global.LivingArt = Object.freeze({ mount, speed: SPEED, leafAmplitude: LEAF_AMP, version: 1, core });
})(window);

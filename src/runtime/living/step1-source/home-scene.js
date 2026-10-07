/* 活的那幅画。素材和坐标由配置提供，原图始终留在容器下面。 */
(function (global) {
'use strict';
const scriptURL = document.currentScript && document.currentScript.src;
// 打包时把文件名换成带内容指纹的配置文件名；只挂引擎脚本时，默认读同目录的这份配置。
const defaultConfigURL = new URL('hero-live.config.b07cbbaf8c.json', scriptURL || document.baseURI).href;
const mounts = new Set();
let staticToneId = 0;
let status = { state: 'off', title: '暂时读不到电脑', detail: '状态读取结果不可用' };
function validateStatus(value) {
  if (!value || !['ok','warn','off'].includes(value.state)) throw new TypeError('state 必须为 ok、warn 或 off');
  return { state:value.state, ...(value.title != null ? {title:String(value.title)} : {}), ...(value.detail != null ? {detail:String(value.detail)} : {}) };
}
function createScene(container, variant, config, shared) {
'use strict';
const A = variant;
const PW = variant.width || 2880, PH = variant.height || 1621;
const stage = container;
const root = document.createElement('div'); root.className = 'hero-live-layer'; root.setAttribute('aria-hidden', 'true');   // 纯装饰层：不进读屏、不抢焦点
root.innerHTML = `<img data-hl="base" alt=""><div data-hl="cam"><canvas data-hl="gl"></canvas><canvas data-hl="fx"></canvas><div data-hl="screen"><div class="lock"><div class="time" data-hl="s0"></div><div class="date" data-hl="sd"></div><div class="pill" data-hl="spill"><i class="dot"></i><span data-hl="s1"></span></div><div class="more" data-hl="s2"></div></div><div class="toast" data-hl="toast"><i>✓</i><span data-hl="tmsg"></span></div></div></div>`;
const $ = s => root.querySelector(`[data-hl="${s.slice(1)}"]`);
const cam = $('#cam'), glc = $('#gl'), fxc = $('#fx'), scrEl = $('#screen'), base = $('#base');
// 头像和文字沿用原静图的浏览器绘制；只按本身轮廓保护，不截整块纸面。
const externalPlate = shared.plateImage && shared.plateImage.tagName === 'IMG' ? shared.plateImage : null;
const ink = externalPlate || document.createElement('img');
if (!externalPlate) {
  ink.dataset.hl = 'ink'; ink.alt = '';
  Object.assign(ink.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none', zIndex: '2' });
  root.append(ink);
}
container.append(root);
let reduce = shared.reduced, destroyed = false, failed = false, active = false, raf = 0, staticTimer = 0;
let phase = 'loading', reason = null, frames = 0, maxFrame = 0;
const cleanups = [];
let guardEligibleAt = Infinity, guardTrigger = null, lastPaused = shared.paused;
const listen = (el, type, fn) => { el.addEventListener(type, fn); cleanups.push(() => el.removeEventListener(type, fn)); };
const style = (el, key, value) => { value = String(value); if (el.style[key] !== value) el.style[key] = value; };
// 只在显示的文字真的变了才改，而且只改那一个文字节点，不整块重写。
const setText = (el, value) => { value = String(value); const n = el.firstChild;
  if (n && n.nodeType === 3 && !n.nextSibling) { if (n.nodeValue !== value) n.nodeValue = value; }
  else if (el.textContent !== value) el.textContent = value; };
const setClass = (el, name, on) => { if (el.classList.contains(name) !== on) el.classList.toggle(name, on); };
// 可复现的随机数：平时随机播种，seek() 时固定播种，这样逐格截图每次都一样
let seed = (Math.random() * 4294967296) >>> 0;
function rnd() { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const rand = (a, b) => a + rnd() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ramp = (x, a, d) => clamp((x - a) / d, 0, 1);
const eOut = u => 1 - Math.pow(1 - u, 3);
const eInOut = u => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const eBack = u => { const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const hasBird = !!(A.sprites && A.sprites.idle && A.plateNoBird);

const S = { mode: 'live', follow: true, fast: false, hour: 12, status: shared.status.state, frozen: null, sleep: false, night: 0 };
// V.t：页面自己的时钟（秒）；V.i0：开场从哪一刻开始（开场时间 = V.t - V.i0）；V.manual：被 seek() 接管时不自己走
const SPEED = Number(config.speed) > 0 ? Number(config.speed) : 2.5;      // 整体速度：所有动效（开场和平时）都按这个倍数走，只改这一个数
const INTRO = 6.5;      // 开场有多长（按动效自己的时间算；真实时间是它除以 SPEED，约 2.6 秒）
const V = { t: 0, i0: Infinity, manual: false, par: [0, 0] };
// 原图已经展示后，画面直接接管；小鸟用自己的首次飞入起点。
let originalPresented = false, introEnabled = false, introReason = 'loading', birdIntroAt = 0;

// ---------- 杭州的时间和日出日落 ----------
function hzDate() { return new Date(Date.now() + 8 * 3600e3); }           // 用 getUTC* 读，就是东八区
function hzHour() { const d = hzDate(); return d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600; }
function sunTimes() {
  const d = hzDate(), rad = Math.PI / 180;
  const N = Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5);
  const g = 2 * Math.PI / 365 * (N - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const lat = 30.2741 * rad, lon = 120.1551;
  const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat) * Math.cos(dec)) - Math.tan(lat) * Math.tan(dec)) / rad;
  return { sr: (720 - 4 * (lon + ha) - eqt) / 60 + 8, ss: (720 - 4 * (lon - ha) - eqt) / 60 + 8 };
}
const sun = sunTimes();
const fmt = h => { h = ((h % 24) + 24) % 24; const m = Math.floor(h * 60 + 1e-6); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

function todParams(h) {
  const { sr, ss } = sun;
  const N = { o: [.20, .27, .48], l: [0, 0, 0], i: [.56, .57, .68], n: 1, s: 0, g: [.10, .12, .17], m: 1 };
  const D = { o: [1, 1, 1], l: [0, 0, 0], i: [1, 1, 1], n: 0, s: 1, g: [.10, .10, .09], m: 0 };
  const K = [
    [0, N], [sr - 1.3, N],
    [sr - 0.45, { o: [.74, .60, .68], l: [.10, .04, .03], i: [.84, .80, .86], n: .35, s: .05, g: [.16, .12, .12], m: .3 }],
    [sr + 0.35, { o: [1.06, .93, .74], l: [.06, .03, 0], i: [1.0, .95, .86], n: 0, s: .5, g: [.30, .24, .10], m: 0 }],
    [sr + 2.2, D], [ss - 2.0, D],
    [ss - 0.6, { o: [1.08, .90, .70], l: [.05, .02, 0], i: [1.03, .94, .84], n: 0, s: .7, g: [.32, .22, .08], m: 0 }],
    [ss + 0.25, { o: [.92, .58, .50], l: [.10, .03, .02], i: [.88, .77, .76], n: .25, s: .1, g: [.22, .12, .08], m: .15 }],
    [ss + 1.0, { o: [.38, .45, .72], l: [0, 0, 0], i: [.68, .69, .80], n: .75, s: 0, g: [.10, .12, .17], m: .8 }],
    [ss + 2.0, N], [24, N]
  ];
  for (let i = 0; i < K.length - 1; i++) {
    const [h0, a] = K[i], [h1, b] = K[i + 1];
    if (h >= h0 && h <= h1) {
      let u = h1 > h0 ? (h - h0) / (h1 - h0) : 0; u = u * u * (3 - 2 * u);
      const mx = (x, y) => x + (y - x) * u, mv = (x, y) => x.map((v, j) => mx(v, y[j]));
      return { o: mv(a.o, b.o), l: mv(a.l, b.l), i: mv(a.i, b.i), n: mx(a.n, b.n), s: mx(a.s, b.s), g: mv(a.g, b.g), m: mx(a.m, b.m) };
    }
  }
  return N;
}

// ---------- 画里几样东西的位置（原画 2880×1621 里的像素），换画时只改这里 ----------
const G = Object.assign({
  scr: [[1653, 761], [2321, 769], [2311, 1138], [1641, 1099]],   // 显示器屏幕四个角：左上、右上、右下、左下
  pc: [2396, 713, 2857, 1256],                                   // 机箱的范围
  fan: [2480, 880]                                               // 发光风扇的中心
}, A.geom || {});
const portrait = PH > PW;
let preserveMask = null, preserveInfo = null;
const svgNS = 'http://www.w3.org/2000/svg', toneId = 'hero-static-tone-' + (++staticToneId);
const toneSvg = document.createElementNS(svgNS, 'svg');
toneSvg.setAttribute('width','0'); toneSvg.setAttribute('height','0'); toneSvg.setAttribute('aria-hidden','true');
Object.assign(toneSvg.style,{position:'absolute',pointerEvents:'none'});
const toneFilter = document.createElementNS(svgNS,'filter'); toneFilter.id=toneId;
for (const [k,v] of Object.entries({x:'0',y:'0',width:'100%',height:'100%','color-interpolation-filters':'sRGB'})) toneFilter.setAttribute(k,v);
const toneTransfer=document.createElementNS(svgNS,'feComponentTransfer'), toneFuncs=[];
for(const channel of ['R','G','B']) {const f=document.createElementNS(svgNS,'feFunc'+channel);f.setAttribute('type','gamma');f.setAttribute('amplitude','1');f.setAttribute('exponent','1');f.setAttribute('offset','0');toneTransfer.append(f);toneFuncs.push(f);}
toneFilter.append(toneTransfer);toneSvg.append(toneFilter);root.append(toneSvg);
const originalPlateFilter = ink.style.filter || '';
let lastGamma = '';
function syncStaticTone(params) {
  const gamma=[1,1,1];
  const key=gamma.map(v=>v.toFixed(6)).join(',')+','+params.n.toFixed(6);
  if(key!==lastGamma) {lastGamma=key;toneFuncs.forEach((f,i)=>{f.setAttribute('exponent',(1-0.22*params.n).toFixed(7));f.setAttribute('amplitude',(1+([0.22,0.28,0.40][i]-1)*params.n).toFixed(7));});
    ink.style.filter=gamma.every(v=>Math.abs(v-1)<.00001)?originalPlateFilter:[originalPlateFilter,'url(#'+toneId+')'].filter(Boolean).join(' ');}
  fxc.style.filter=params.n>0?'url(#'+toneId+')':'';
  return gamma;
}
function buildPreserveMask(image) {
  const w=image.naturalWidth||image.width,h=image.naturalHeight||image.height;
  const make=()=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
  const source=make(),sg=source.getContext('2d',{willReadFrequently:true});sg.drawImage(image,0,0);
  const pixels=sg.getImageData(0,0,w,h).data, seed=make(), g=seed.getContext('2d',{willReadFrequently:true});g.fillStyle='#fff';
  const av=G.avatar?.circle_ellipse||{center:[PW*(528/2880),PH*(381/1621)],radius_x:PW*(330/2880),radius_y:PH*(330/1621)};
  g.beginPath();g.ellipse(av.center[0]*w/PW,av.center[1]*h/PH,av.radius_x*w/PW,av.radius_y*h/PH,0,0,Math.PI*2);g.fill();
  const rr=r=>[r[0]*w/PW,r[1]*h/PH,r[2]*w/PW,r[3]*h/PH];
  const legacy=rs=>rs.map(r=>[r[0]/2880*PW,r[1]/1621*PH,r[2]/2880*PW,r[3]/1621*PH]);
  const textRects=portrait&&G.name?[G.name.bbox_xyxy,G.green_brush_stroke.bbox_xyxy,
    ...G.introduction.lines.map(v=>v.bbox_xyxy),...G.small_paragraph.lines.map(v=>v.bbox_xyxy)]:
    legacy([[205,705,830,910],[110,880,920,980],[65,975,1125,1150],[65,1155,1140,1358]]);
  const buttons=G.buttons?.map(b=>b.bbox_xyxy)||legacy([[67,1392,739,1522],[759,1392,1367,1522]]);
  for(const r of buttons) {const [x0,y0,x1,y1]=rr(r),rad=(y1-y0)/2;
    g.beginPath();g.moveTo(x0+rad,y0);g.lineTo(x1-rad,y0);g.arc(x1-rad,y0+rad,rad,-Math.PI/2,Math.PI/2);g.lineTo(x0+rad,y1);g.arc(x0+rad,y0+rad,rad,Math.PI/2,Math.PI*1.5);g.closePath();g.fill();}
  const data=g.getImageData(0,0,w,h);
  for(const rect of textRects) {const r=rr(rect),x0=Math.max(0,Math.floor(r[0]-4)),y0=Math.max(0,Math.floor(r[1]-4)),x1=Math.min(w,Math.ceil(r[2]+4)),y1=Math.min(h,Math.ceil(r[3]+4));
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const p=(y*w+x)*4;if(Math.min(pixels[p],pixels[p+1],pixels[p+2])<198){data.data[p]=data.data[p+1]=data.data[p+2]=data.data[p+3]=255;}}}
  g.putImageData(data,0,0);
  const dilate=(input,radius)=>{const c=make(),q=c.getContext('2d');for(let y=-radius;y<=radius;y+=Math.max(1,radius))for(let x=-radius;x<=radius;x+=Math.max(1,radius))q.drawImage(input,x,y);return c;};
  const feather=(input,radius)=>{const c=make(),q=c.getContext('2d');q.filter='blur('+radius+'px)';q.drawImage(input,0,0);q.filter='none';q.drawImage(input,0,0);return c;};
  const core=dilate(seed,2),protect=feather(core,4);
  const pg=protect.getContext('2d',{willReadFrequently:true}),pd=pg.getImageData(0,0,w,h),live=make(),lg=live.getContext('2d');let protectedPixels=0;
  const guardCore=make(),gc=guardCore.getContext('2d'),guardData=gc.createImageData(w,h);
  for(let p=0;p<pd.data.length;p+=4){guardData.data[p]=guardData.data[p+1]=guardData.data[p+2]=255;guardData.data[p+3]=pd.data[p+3]>0?255:0;}gc.putImageData(guardData,0,0);
  const guard=feather(dilate(guardCore,2),8);
  for(let p=0;p<pd.data.length;p+=4){const a=pd.data[p+3];if(a>254)protectedPixels++;pd.data[p]=pd.data[p+1]=pd.data[p+2]=255;pd.data[p+3]=255-a;}
  lg.putImageData(pd,0,0);
  if(externalPlate) {root.style.maskImage='url('+live.toDataURL()+')';root.style.maskSize='100% 100%';root.style.maskRepeat='no-repeat';root.style.maskMode='alpha';}
  else {ink.style.maskImage='url('+protect.toDataURL()+')';ink.style.maskSize='100% 100%';ink.style.maskRepeat='no-repeat';ink.src=base.src;}
  const gg=guard.getContext('2d',{willReadFrequently:true}),gd=gg.getImageData(0,0,w,h);
  for(let p=0;p<gd.data.length;p+=4){gd.data[p]=gd.data[p+1]=gd.data[p+2]=gd.data[p+3];gd.data[p+3]=255;}gg.putImageData(gd,0,0);
  preserveMask=guard;preserveInfo={kind:'native-avatar-ellipse-and-ink-contours',nativeSize:[w,h],opaqueFraction:protectedPixels/(w*h),featherPx:4,guardFeatherPx:8,avatar:av,textSeedRects:textRects,buttons};
}
const fitAxis = (old, axis) => {
  const xs = old.map(q => q[axis]), ys = G.scr.map(q => q[axis]);
  const mx = xs.reduce((a,b)=>a+b,0)/4, my = ys.reduce((a,b)=>a+b,0)/4;
  const scale = xs.reduce((sum,x,i)=>sum+(x-mx)*(ys[i]-my),0) / xs.reduce((sum,x)=>sum+(x-mx)*(x-mx),0);
  return {scale, offset:my-scale*mx};
};
const referenceScreen = [[1655,756],[2323,765],[2305,1138],[1633,1091]];
const mapping = portrait ? {x:fitAxis(referenceScreen,0),y:fitAxis(referenceScreen,1)} : {x:{scale:1,offset:0},y:{scale:1,offset:0}};
const toWorld = (point) => [(point[0]-mapping.x.offset)/mapping.x.scale,(point[1]-mapping.y.offset)/mapping.y.scale];
const toImage = (point) => [point[0]*mapping.x.scale+mapping.x.offset,point[1]*mapping.y.scale+mapping.y.offset];
const gu = x => (portrait ? (x-mapping.x.offset)/mapping.x.scale/2880 : x/PW).toFixed(5);
const gv = y => (portrait ? (y-mapping.y.offset)/mapping.y.scale/1621 : y/PH).toFixed(5);
const gq = i => `vec2(${gu(G.scr[i][0])},${gv(G.scr[i][1])})`;
const gpool = `vec2(${gu((G.scr[2][0] + G.scr[3][0]) / 2)},${gv((G.scr[2][1] + G.scr[3][1]) / 2 + 85*mapping.y.scale)})`;

// ---------- 画面：WebGL（仍是一遍画完） ----------
const VS =`attribute vec2 a; varying vec2 v_uv; void main(){ v_uv = vec2(a.x*0.5+0.5, 0.5-a.y*0.5); gl_Position = vec4(a,0.0,1.0); }`;
const phoneScreen = portrait
  ? [[310,675],[365,670],[389,796],[332,805]]
  : [[1476,964],[1580,964],[1580,1166],[1476,1166]];
const sceneQuad = points => points.map(p => `vec2(${gu(p[0])},${gv(p[1])})`).join(', ');
const phoneQuad = sceneQuad(phoneScreen);
const imagePoint = p => `vec2(${(p[0]/PW).toFixed(6)},${(p[1]/PH).toFixed(6)})`;
const imageQuad = points => points.map(imagePoint).join(', ');
const scrWide = G.scr[1][0]-G.scr[0][0], scrTop = Math.min(...G.scr.map(p=>p[1])).toFixed(1);
const scrCenter = `vec2(${(G.scr.reduce((a,p)=>a+p[0],0)/4).toFixed(1)},${(G.scr.reduce((a,p)=>a+p[1],0)/4+0.2*scrWide).toFixed(1)})`;
const scrReach = `vec2(${(scrWide*0.95).toFixed(1)},${(scrWide*0.55).toFixed(1)})`;
let FS = `precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex, u_preserve;
uniform vec3 u_ambientGamma;
uniform float u_t, u_motion, u_night, u_sun, u_pcMode, u_pulse, u_scrOn, u_moon, u_keepBird;
uniform vec3 u_outTint, u_outLift, u_inTint, u_glint;
uniform float u_it;      // 开场第几秒（演完后是个大数）
uniform vec2 u_par;      // 窗外的景深错位（uv）
uniform float u_camz;    // 开场镜头放大倍数：整体由 CSS 放大，这里让窗外少放大一点
uniform float u_gust;    // 窗帘上的风
uniform float u_fanA;    // 风扇转角
uniform float u_sweep;   // 机箱灯亮带的位置（原画像素 y）
uniform float u_pcFill;  // 开场时机箱灯亮到哪儿（原画像素 y）
const float ASPECT = 1.77668;
const vec2 PX = vec2(2880.0, 1621.0);
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*0.1031); p3 += dot(p3, p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x), f.y); }
float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*noise(p); p=p*2.03+7.1; a*=0.5; } return s; }
float box(vec2 p, vec2 a, vec2 b, float e){ vec2 s = smoothstep(a-vec2(e),a+vec2(e),p)*(1.0-smoothstep(b-vec2(e),b+vec2(e),p)); return s.x*s.y; }
float edge(vec2 p, vec2 a, vec2 b){ vec2 e=b-a; return (e.x*(p.y-a.y)-e.y*(p.x-a.x))/length(e); }
float quad(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d, float s){
  return smoothstep(0.0,s,edge(p,a,b))*smoothstep(0.0,s,edge(p,b,c))*smoothstep(0.0,s,edge(p,c,d))*smoothstep(0.0,s,edge(p,d,a)); }
float sq(float x){ return x*x; }
float grn(vec3 c){ return smoothstep(0.03,0.14, c.g - max(c.r,c.b)); }
float pg(float a, float d){ return clamp((u_it-a)/d, 0.0, 1.0); }
float eo(float u){ return 1.0-(1.0-u)*(1.0-u)*(1.0-u); }
float eback(float u){ float c=1.9, v=u-1.0; return 1.0+(c+1.0)*v*v*v+c*v*v; }
// 开场：一行字从下面浮上来（P0 是原位置的像素坐标，r 是这一行的范围；只藏“墨”，不藏底下的淡彩）
void rise(vec2 P0, inout vec2 P, inout float ivis, vec4 r, float t0){
  if (P0.x>r.x && P0.x<r.z && P0.y>r.y && P0.y<r.w) {
    float e = eo(pg(t0, 0.6));
    P.y = P0.y - (1.0-e)*34.0;
    if (P.y < r.y) { P = P0; ivis = 0.0; } else ivis *= min(1.0, e*1.4);
  }
}
// 开场：按钮弹出来（只在按钮那个圆角形状里换画面，外面不动）
void pop(vec2 P0, inout vec2 P, inout float ivis, vec2 c, vec2 hf, float t0){
  vec2 q = P0-c;
  vec2 k0 = abs(q)-(hf-vec2(hf.y)); float sd0 = length(max(k0,0.0))-hf.y;
  if (sd0 < 14.0) {
    float u = pg(t0, 0.55);
    if (u >= 1.0) return;
    float s = max(0.02, eback(u));
    vec2 Q = q/s;
    vec2 k = abs(Q)-(hf-vec2(hf.y)); float sd = length(max(k,0.0))-hf.y;
    if (sd < 4.0) { P = c+Q; ivis *= min(1.0, u*5.0); }        // 缩放后的按钮里：画按钮
    else { P = vec2(P0.x, c.y-hf.y-22.0); }                  // 还没弹出来的地方：照着按钮正上方那条空白纸的颜色画，不留白色的按钮形状
  }
}
void main(){
  vec2 uv = v_uv; float t = u_t;
  float vis = 1.0, ivis = 1.0;
  // ---- 开场：左边的头像、名字、介绍、按钮 ----
  if (u_it < 7.0) {
    vec2 P = uv*PX, P0 = P;
    vec2 ac = vec2(528.0, 381.0); float ad = length(P-ac);
    if (ad < 350.0) {                                               // 头像：从圆心晕开
      float r = eo(pg(0.7, 1.0))*430.0;
      float nr = ad + 60.0*(fbm(P*0.006+1.3)-0.5);
      vis *= mix(1.0, smoothstep(r, r-50.0, nr), smoothstep(350.0, 328.0, ad));
    }
    if (P.x>120.0 && P.x<370.0 && P.y>385.0 && P.y<660.0) {          // 头像旁边那枝叶子：跟着淡入
      ivis *= smoothstep(0.0, 1.0, pg(1.25, 0.5) * 1.6 - (P.y-385.0)/275.0*0.6);
    }
    if (P.x>215.0 && P.x<815.0 && P.y>712.0 && P.y<902.0) {          // “吴乐阳”：一笔一笔写出来
      float x0 = 225.0, x1 = 418.0, k = 0.0;
      if (P.x >= 420.0 && P.x < 607.0) { x0 = 428.0; x1 = 603.0; k = 1.0; }
      if (P.x >= 607.0) { x0 = 610.0; x1 = 805.0; k = 2.0; }
      float q = 0.55*(P.x-x0)/(x1-x0) + 0.45*(P.y-718.0)/185.0;
      q += 0.07*(noise(P*0.045)-0.5) + 0.03*(noise(P*0.2)-0.5);
      float u = pg(1.45 + k*0.34, 0.40);
      ivis *= smoothstep(u*1.2, u*1.2-0.07, q) * step(0.001, u);
    }
    if (P.x>115.0 && P.x<910.0 && P.y>885.0 && P.y<978.0) {          // 下面那道绿笔触：一甩
      float q = (P.x-120.0)/785.0 + 0.04*(noise(P*0.03)-0.5) + 0.05*(P.y-930.0)/50.0;
      float u = eo(pg(2.55, 0.38));
      ivis *= smoothstep(u*1.15, u*1.15-0.05, q) * step(0.001, u);
    }
    rise(P0, P, ivis, vec4(78.0, 982.0, 1005.0, 1057.0), 2.85);
    rise(P0, P, ivis, vec4(78.0, 1059.0, 1015.0, 1140.0), 3.0);
    rise(P0, P, ivis, vec4(82.0, 1163.0, 1100.0, 1226.0), 3.2);
    rise(P0, P, ivis, vec4(82.0, 1227.0, 1100.0, 1288.0), 3.3);
    rise(P0, P, ivis, vec4(82.0, 1289.0, 1100.0, 1348.0), 3.4);
    pop(P0, P, ivis, vec2(403.0, 1457.0), vec2(336.0, 65.0), 3.7);
    pop(P0, P, ivis, vec2(1063.0, 1457.0), vec2(304.0, 65.0), 3.85);
    uv = P/PX;
  }

  // ---- 窗外的景深：鼠标位置和开场推近时，窗外比室内动得少 ----
  float ce = 0.727 - 0.103*uv.y;                                   // 窗帘左边那条斜边
  float leftOfCurtain = 1.0 - smoothstep(ce-0.007, ce+0.007, uv.x);
  float pm = smoothstep(0.405, 0.448, uv.x) * (1.0-smoothstep(ce-0.014, ce+0.003, uv.x)) * (1.0-smoothstep(0.412, 0.452, uv.y));
  float depth = mix(0.45, 1.0, 1.0-smoothstep(0.24, 0.40, uv.y));
  vec2 uvP = uv + u_par*pm*depth;
  float pcur = (1.0-leftOfCurtain)*box(uv, vec2(0.60,-0.2), vec2(0.835,0.445), 0.02);
  uvP += u_par*0.35*pcur;
  if (u_camz > 1.0001) {
    vec2 cc = vec2(0.58, 0.30); float k = u_camz/(1.0+0.45*(u_camz-1.0));
    uvP = mix(uvP, cc+(uvP-cc)*k, pm*depth);
  }

  vec3 c0 = texture2D(u_tex, uvP).rgb;
  float lum0 = dot(c0, vec3(0.299,0.587,0.114));
  float green0 = grn(c0);
  float water0 = smoothstep(-0.05,0.03, c0.b-c0.g) * smoothstep(0.05,0.16, c0.b-c0.r);
  float mWin = box(uv, vec2(0.412,-0.2), vec2(0.80,0.495), 0.005) * leftOfCurtain;
  float mCur = box(uv, vec2(0.60,-0.2), vec2(0.835,0.440), 0.010) * (1.0-leftOfCurtain);
  float mFol = max(max(box(uv, vec2(0.32,-0.2), vec2(0.61,0.25), 0.02), box(uv, vec2(0.425,0.25), vec2(0.585,0.41), 0.015)),
                   max(box(uv, vec2(0.835,-0.2), vec2(1.2,0.455), 0.015), box(uv, vec2(0.372,0.455), vec2(0.50,0.645), 0.012)));
  mFol *= 1.0 - u_keepBird * box(uv, vec2(0.445,0.395), vec2(0.535,0.512), 0.005);
  float mWat = box(uv, vec2(0.412,0.325), vec2(0.70,0.437), 0.006);

  // ---- 叶子、绿萝、窗帘、湖面的位移 ----
  vec2 d = vec2(0.0);
  float n = fbm(uv*vec2(9.0,7.0));
  float gsoft = green0;
  if (mFol > 0.01) {                                               // 叶子的范围放宽一圈再晃，边缘不会被切
    gsoft = (green0 + grn(texture2D(u_tex, uvP+vec2(0.006,0.0)).rgb) + grn(texture2D(u_tex, uvP-vec2(0.006,0.0)).rgb)
           + grn(texture2D(u_tex, uvP+vec2(0.0,0.010)).rgb) + grn(texture2D(u_tex, uvP-vec2(0.0,0.010)).rgb)) * 0.2;
    gsoft = smoothstep(0.0, 0.6, gsoft);
  }
  float gust = 0.6 + 0.9*smoothstep(0.3,0.8, noise(vec2(t*0.21, uv.x*1.7))) + 0.5*u_gust;
  d += mFol*gsoft*gust*0.0034*vec2(sin(t*1.25+n*6.283), 0.6*cos(t*1.0+n*6.283+1.7));
  float mPoth = box(uv, vec2(0.835,-0.2), vec2(1.2,0.455), 0.015);  // 右上角垂下来的绿萝：整串轻轻晃
  d.x += mPoth*gsoft*0.0050*sin(t*0.72 + uv.y*2.5)*pow(clamp(uv.y/0.45,0.0,1.0), 1.2);
  float cy = clamp(uv.y/0.44, 0.0, 1.0);
  float cph = uv.x*52.0 - t*1.6 + uv.y*4.0 + 2.2*noise(vec2(uv.x*4.0, t*0.15));
  float bil = cy*(0.30 + u_gust);
  float cwave = 0.62*sin(cph) + 0.38*sin(uv.x*23.0 + t*1.05 - uv.y*3.0);
  d.x += mCur*bil*(0.0042*cwave + 0.0034*sin(uv.y*9.0 - t*1.2));
  d.y -= mCur*0.012*u_gust*cy*cy;
  d.x += mWat*water0*(0.0022*sin(uv.y*900.0 + t*2.6 - uv.x*20.0) + 0.0016*sin(uv.y*410.0 - t*1.9 + uv.x*31.0));
  d *= u_motion;

  vec2 suv = uvP + d;
  // ---- 风扇：在风扇那个椭圆里把画面绕中心转 ----
  vec2 fc = vec2(${gu(G.fan[0])},${gv(G.fan[1])}), fr = vec2(38.0/2880.0, 66.0/1621.0);
  vec2 fq = (uv-fc)/fr; float fl = length(fq);
  float fanIn = 0.0;
  if (fl < 1.3) {
    fanIn = smoothstep(1.3, 1.08, fl);
    float ca = cos(u_fanA), sa = sin(u_fanA);
    suv = mix(suv, fc + vec2(ca*fq.x - sa*fq.y, sa*fq.x + ca*fq.y)*fr, fanIn);
  }
  vec3 raw = texture2D(u_tex, suv).rgb;
  vec3 col = raw;
  float lum = dot(col, vec3(0.299,0.587,0.114));
  float paint = 1.0 - min(col.r, min(col.g, col.b));
  col *= 1.0 + mCur*bil*0.075*cos(cph)*u_motion;                   // 窗帘鼓起来的地方明暗跟着变

  // ---- 天上的云：柔边、慢慢飘 ----
  float sky = mWin * smoothstep(0.66,0.86,lum0) * (1.0-green0) * (1.0-smoothstep(0.26,0.33,uv.y)) * (1.0-u_night);
  float cloud = 0.0;
  if (sky > 0.001) {
    // 成朵的云：边缘清楚，上面亮、底下灰蓝，大约 15 秒飘过一扇窗（原来的云太淡，和画里的白云混在一起看不出）
    vec2 cp = uvP*vec2(2.5, 6.0) + vec2(-t*0.028*u_motion, 0.0);
    float cn = fbm(cp)*0.68 + fbm(cp*2.2 + vec2(t*0.017*u_motion, 4.0))*0.32;
    float cl = smoothstep(0.47, 0.585, cn);
    vec2 cq = cp + vec2(0.02, -0.20);
    float under = smoothstep(0.47, 0.70, fbm(cq)*0.68 + fbm(cq*2.2 + vec2(t*0.017*u_motion, 4.0))*0.32);
    float halo = smoothstep(0.38, 0.47, cn)*(1.0-cl);               // 云外面一圈天色深一点，像水彩的湿边，云在白底上也有形状
    col = mix(col, col*vec3(0.80,0.90,1.02), 0.55*halo*sky);
    vec3 cc = mix(vec3(1.0), vec3(0.70,0.78,0.92), under*0.85);
    cc = mix(cc, vec3(0.50,0.55,0.68), u_night);
    cloud = cl*sky;
    col = mix(col, cc, cloud*0.96);
  }

  // ---- 白天：斜着打进来的光束和里面的浮尘 ----
  float room = smoothstep(0.385,0.455, uv.x);
  col *= 1.0 + 0.05*u_sun*u_motion*(fbm(uv*vec2(7.0,11.0)+t*vec2(0.021,0.013))-0.5)*room*smoothstep(0.50,0.62,uv.y);
  float scr = quad(uv, ${gq(0)}, ${gq(1)}, ${gq(2)}, ${gq(3)}, 0.0015);
  if (u_sun > 0.01) {
    // 树影：一片片暗斑在桌面上跟着风晃。原画桌上的光斑是画死的，这一层是活的，一眼看得出在动
    float desk = room * smoothstep(0.50, 0.60, uv.y) * (1.0-scr);
    vec2 sw = vec2(sin(t*0.9)+0.5*sin(t*1.7+1.0), cos(t*0.7)+0.5*cos(t*1.3+2.0)) * 0.012 * u_motion;
    float shd = smoothstep(0.50, 0.66, fbm((uv+sw)*vec2(10.0,17.0) + vec2(3.0,8.0)));
    col *= 1.0 - 0.17*shd*desk*u_sun;
    // 光束：周围先压暗一点，光束里再提亮、偏暖，这样在本来就很亮的画上也显得出来
    vec2 bp = uv*vec2(ASPECT,1.0);
    float s = dot(bp, vec2(0.894, -0.447));
    float bm = smoothstep(0.30, 0.47, uv.y) * (1.0-smoothstep(0.80, 0.97, uv.y)) * smoothstep(0.38, 0.45, uv.x) * (1.0-smoothstep(0.70, 0.84, uv.x));
    float b = 0.0;
    b += exp(-sq((s - (0.455 + 0.035*sin(t*0.15)))/0.030)) * (0.75+0.25*sin(t*0.55));
    b += exp(-sq((s - (0.560 + 0.030*sin(t*0.12+1.7)))/0.019)) * (0.70+0.30*sin(t*0.47+2.0));
    b += exp(-sq((s - (0.665 + 0.040*sin(t*0.10+3.1)))/0.036)) * (0.65+0.35*sin(t*0.39+4.0));
    b *= bm * u_sun * (1.0 - 0.6*scr);
    col *= 1.0 - 0.12*bm*u_sun*(1.0-scr);
    col = mix(col, col*vec3(1.12,1.06,0.90), min(1.0, b)*0.55);
    col += vec3(1.0,0.90,0.66)*b*0.30;
    vec2 dg = (bp + vec2(-t*0.006, t*0.009) + 0.004*vec2(sin(t*0.7+bp.y*9.0), cos(t*0.6+bp.x*7.0)))*46.0;
    vec2 id = floor(dg), fq2 = fract(dg)-0.5, o = (vec2(hash(id+7.1), hash(id+3.3))-0.5)*0.6;
    float h = hash(id);
    float spk = step(0.74, h) * smoothstep(0.17, 0.03, length(fq2-o)) * (0.55+0.45*sin(t*2.3+h*50.0));
    col += vec3(1.0,0.96,0.85)*spk*min(1.0, 0.18*bm + b*1.6)*u_sun;
  }

  // ---- 一天里的光 ----
  float inMask = max(room, 0.7*smoothstep(0.30,0.36,uv.x)*smoothstep(0.04,0.30,paint));
  float outMask = clamp(mWin + mCur*0.45, 0.0, 1.0);
  vec3 outc = col*u_outTint + u_outLift*smoothstep(0.55,0.9,lum);
  // 同一环境色用于原img与GPU；白纸保持白，墨迹与头像随夜景变暗。
  vec3 inc = pow(max(col,vec3(0.0)),u_ambientGamma);
  col = mix(inc, outc, outMask*max(inMask,outMask)*(1.0-u_night));

  // ---- 夜里：星星、月亮（云会遮住） ----
  float skyN = mWin * smoothstep(0.70,0.88,lum0) * (1.0-green0) * (1.0-smoothstep(0.27,0.32,uv.y));
  vec2 sg = uvP*vec2(300.0, 300.0/ASPECT); float sh = hash(floor(sg));
  float star = step(0.93,sh) * smoothstep(0.45,0.0,length(fract(sg)-0.5)) * (0.55+0.45*sin(t*1.7+sh*60.0));
  col += vec3(1.0,0.96,0.86)*star*u_night*skyN*0.9*(1.0-cloud);
  vec2 mp = (uvP-vec2(0.652,0.085))*vec2(ASPECT,1.0);
  float moon = clamp(smoothstep(0.026,0.024,length(mp)) - smoothstep(0.024,0.022,length(mp-vec2(0.011,-0.006))), 0.0, 1.0);
  float mc = 0.0;
  if (u_moon > 0.001 && mWin > 0.001) {                           // 月亮那一处有没有被云遮住（只在夜里、窗里算）
    vec2 cmp = vec2(0.652,0.085)*vec2(3.4,8.0) + vec2(-t*0.030, 0.0);
    mc = smoothstep(0.44, 0.66, fbm(cmp)*0.7 + fbm(cmp*2.3 + vec2(t*0.02, 4.0))*0.3);
  }
  col += (vec3(1.0,0.95,0.78)*moon*(1.0-0.8*mc) + vec3(0.5,0.6,0.8)*exp(-dot(mp,mp)/0.004)*0.18*(1.0-0.5*mc)) * u_moon * mWin;

  // ---- 湖面：波纹成片地走，粼光更多 ----
  float sp = noise(vec2(uvP.x*520.0 + t*0.8, uvP.y*260.0 - t*0.45));
  float band = smoothstep(0.30, 0.75, noise(vec2(uvP.x*7.0 - t*0.30, uvP.y*34.0 + t*0.15)));
  float gl = mWat*water0*smoothstep(0.74,0.93,sp)*(0.5+0.5*sin(t*3.4+sp*40.0))*(0.35+1.3*band);
  gl *= mix(1.0, 0.35 + 1.9*exp(-sq((uv.x-0.652)*14.0)), u_moon);
  col += u_glint*gl*1.35;

  // ---- 会发光的东西：显示器、手机、机箱 ----
  float phone = quad(uv, ${phoneQuad}, 0.0015);
  col = mix(col, raw*(1.0+0.05*u_night), scr*u_scrOn);
  col = mix(col, raw*vec3(0.17,0.19,0.23)+vec3(0.02), scr*(1.0-u_scrOn));
  col = mix(col, raw, phone*0.85);
  vec2 pp = (uv-${gpool})*vec2(ASPECT*0.9, 2.2);
  col += vec3(0.42,0.62,0.66)*exp(-dot(pp,pp)/0.05)*0.20*u_night*u_scrOn*(1.0-scr);
  vec2 lp = (uv-vec2(0.83,0.88))*vec2(ASPECT*0.8, 1.4);
  col += vec3(1.0,0.74,0.42)*exp(-dot(lp,lp)/0.20)*0.17*u_night*room;

  float py = uv.y*1621.0;
  float mPc = box(uv, vec2(${gu(G.pc[0])},${gv(G.pc[1])}), vec2(${gu(G.pc[2])},${gv(G.pc[3])}), 0.004);
  float cool = max(raw.g, raw.b) - raw.r;                       // 蓝绿色的程度
  float top = max(raw.g, raw.b);
  float neon = mPc*smoothstep(0.10,0.22,cool)*smoothstep(0.50,0.75,top);
  float pcCast = mPc*smoothstep(0.02,0.12,cool);
  float lit = smoothstep(u_pcFill+40.0, u_pcFill-40.0, py);      // 开场时灯从上往下一段段亮起来
  float live = (1.0 - step(1.5, u_pcMode))*lit;
  float warn = step(0.5, u_pcMode)*live;
  float wave = 0.5 + 0.5*sin(t*0.9*u_motion + uv.y*26.0 + uv.x*9.0);
  vec3 rgb = mix(vec3(raw.r, top, top*0.45), vec3(raw.r, top*0.62, top), wave);
  col = mix(col, rgb, neon*live*(1.0-warn));
  col = mix(col, raw, neon*warn);
  vec3 amber = vec3(top*1.08, top*0.74+raw.r*0.10, min(raw.g,raw.b)*0.40) * (dot(col,vec3(0.333))/max(0.001,dot(raw,vec3(0.333))));
  col = mix(col, amber, pcCast*warn);
  col = mix(col, vec3(dot(col,vec3(0.299,0.587,0.114)))*vec3(0.46,0.48,0.52), pcCast*0.92*(1.0-live));
  vec3 neonCol = mix(mix(vec3(0.15,1.0,0.45), vec3(0.15,0.62,1.0), wave), vec3(1.0,0.72,0.20), warn);
  float sweep = exp(-sq((py-u_sweep)/46.0));               // 沿灯条扫过的一道亮带
  col += neonCol*neon*(0.08+0.24*u_pulse + 1.1*sweep)*live;
  vec2 fp = (uv-fc)*vec2(ASPECT,1.0);
  col += neonCol*exp(-dot(fp,fp)/0.0022)*(0.04+0.11*u_pulse + 0.25*sweep)*live*(0.6+0.9*u_night);
  if (fl < 1.3) {                                                 // 风扇叶的明暗和圈上跑的一点高光，看得出在转
    float ang = atan(fq.y, fq.x);
    float blade = 0.5+0.5*cos(7.0*(ang - u_fanA));
    col *= 1.0 - 0.20*blade*smoothstep(0.78,0.55,fl)*smoothstep(0.12,0.28,fl)*live;
    float hl = pow(0.5+0.5*cos(ang - u_fanA), 10.0);
    col += neonCol*hl*smoothstep(0.62,0.85,fl)*smoothstep(1.18,0.96,fl)*0.55*live;
  }

  // ---- 开场：左边还没出场的字先藏起来，再让水彩从白纸上晕开 ----
  if (u_it < 7.0) {
    float ink = smoothstep(0.025, 0.14, 1.0 - min(raw.r, min(raw.g, raw.b)));   // 字和笔画是“墨”，底下的淡彩不算
    if (ivis < 0.999) {                                             // 藏字时填上字后面的纸色，不留字形的残影
      vec3 acc = vec3(0.0); float ws = 0.0;                         // 周围不是字的那些点取平均，就是这块纸本来的颜色
      for (int i=0; i<8; i++) {
        float a = float(i)*0.7854; vec2 dr = vec2(cos(a), sin(a))/PX;
        vec3 c1 = texture2D(u_tex, suv+dr*26.0).rgb, c2 = texture2D(u_tex, suv+dr*60.0).rgb, c3 = texture2D(u_tex, suv+dr*112.0).rgb;
        float w1 = 1.0-smoothstep(0.02,0.10, 1.0-min(c1.r,min(c1.g,c1.b))); w1 = w1*w1+0.001;
        float w2 = 1.0-smoothstep(0.02,0.10, 1.0-min(c2.r,min(c2.g,c2.b))); w2 = w2*w2+0.001;
        float w3 = 1.0-smoothstep(0.02,0.10, 1.0-min(c3.r,min(c3.g,c3.b))); w3 = w3*w3+0.001;
        acc += c1*w1 + c2*w2 + c3*w3; ws += w1+w2+w3;
      }
      vec3 bg = acc/ws;
      float dk = max(0.0, min(bg.r, min(bg.g, bg.b)) - min(raw.r, min(raw.g, raw.b)));   // 这一点比周围的纸暗多少：暗一点点也算字
      col = mix(col, bg, max(ink, smoothstep(0.015, 0.050, dk))*(1.0-ivis));
    }
    col = mix(vec3(1.0), col, vis);
  }
  if (u_it < 4.0) {
    vec2 q = (v_uv - vec2(0.58,0.30))*vec2(ASPECT,1.0);
    float R = 1.5*(1.0-pow(1.0-clamp(u_it/2.2, 0.0, 1.0), 2.2));
    float dd = length(q) + 0.22*(fbm(v_uv*vec2(4.0,2.25)+3.0)-0.5) + 0.06*(fbm(v_uv*vec2(16.0,9.0)+9.0)-0.5)
             + 0.018*(noise(v_uv*vec2(110.0,62.0))-0.5);            // 再加一层细碎的毛边，像水彩干掉的边
    float bl = smoothstep(R, R-0.010, dd);                          // 边要干脆
    float ring = smoothstep(R-0.002, R-0.016, dd)*(1.0-smoothstep(R-0.02, R-0.09, dd));
    float wet = smoothstep(R-0.03, R-0.28, dd);                     // 刚晕到的地方颜色浅，慢慢“干”成原色
    float pig = smoothstep(0.02, 0.20, 1.0 - min(col.r, min(col.g, col.b)));
    col = mix(mix(col, vec3(1.0), 0.45), col, wet);
    col *= 1.0 - 0.34*ring*pig;                                     // 水彩边上颜料积起来的那圈深色
    col = mix(vec3(1.0), col, bl);
  }
  float nightReach = 0.0;
  if (u_night > 0.0) {
    vec2 Q = v_uv*PX;
    float wob = 70.0*(fbm(Q*0.004)-0.5) + 8.0*(noise(Q*0.04)-0.5);
    float inner = ${portrait ? '1100.0-Q.y' : 'Q.x-1000.0-150.0*smoothstep(850.0,1000.0,Q.y)-290.0*smoothstep(1100.0,1300.0,Q.y)'} + 1.6*wob;
    float rim = ${portrait ? 'min(Q.y,min(Q.x,PX.x-Q.x))' : 'min(Q.y,min(PX.x-Q.x,PX.y-Q.y))'} + wob;
    vec3 ink0 = texture2D(u_tex,v_uv).rgb;
    // 屏幕上沿以下的桌面、窗台先压平亮部，画死的阳光光斑不再透出来。
    vec3 shade = col*(1.0-0.5*smoothstep(0.35,0.9,dot(col,vec3(0.299,0.587,0.114)))*smoothstep(${scrTop},${scrTop}+120.0,Q.y));
    vec3 night = pow(max(shade,vec3(0.0)),vec3(0.78))*vec3(0.22,0.28,0.40);
    // 屏幕向桌面、键盘和墙投一点光，照出物件本来的颜色。
    vec2 sd = (Q-${scrCenter})/${scrReach};
    night = mix(night, shade*vec3(0.62,0.86,0.80), 0.5*exp(-dot(sd,sd))*u_scrOn);
    // 主体外只有颜料入夜，白纸仍是白纸；卡片四边收成水彩干边。
    float core = smoothstep(-60.0,60.0,inner), edge = min(inner, rim-34.0);
    night = mix(mix(vec3(0.995), night, smoothstep(0.05,0.5,1.0-min(ink0.r,min(ink0.g,ink0.b)))), night, core);
    night *= 1.0 - 0.15*smoothstep(-10.0,10.0,edge)*(1.0-smoothstep(10.0,70.0,edge));
    night = mix(vec3(0.995), night, smoothstep(18.0,44.0,rim));
    float glow = max(quad(v_uv, ${imageQuad(G.scr)}, 0.0015)*u_scrOn, quad(v_uv, ${imageQuad(phoneScreen)}, 0.0015));
    float lamp = box(v_uv, ${imagePoint([G.pc[0],G.pc[1]])}, ${imagePoint([G.pc[2],G.pc[3]])}, 0.004);
    glow = max(glow, lamp*smoothstep(0.08,0.20,max(ink0.g,ink0.b)-ink0.r)*smoothstep(0.42,0.70,max(ink0.g,ink0.b)));
    nightReach = smoothstep(-300.0,-160.0,inner)*u_night;
    col = mix(col, mix(night, col, glow), nightReach);
  }
  vec3 originalColor=pow(texture2D(u_tex,v_uv).rgb,u_ambientGamma);
  float preserve=texture2D(u_preserve,v_uv).r;
  col=mix(col,originalColor,preserve*(1.0-nightReach));
gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);
}`;

// 竖版画的房间和文字分别排版。房间保留原演出公式，位置由实测屏幕拟合；
// 头像、名字、每行文字和两个按钮直接使用这张画自己的实测边界。
if (portrait) {
  const n = value => Number(value).toFixed(6);
  const v2 = a => `vec2(${a.map(n).join(',')})`;
  const v4 = a => `vec4(${a.map(n).join(',')})`;
  const av = G.avatar.circle_ellipse, branch = G.avatar.decorative_leaf_bbox_xyxy;
  const name = G.name.bbox_xyxy, chars = G.name.characters.map(c => c.bbox_xyxy), brush = G.green_brush_stroke.bbox_xyxy;
  const rows = [...G.introduction.lines,...G.small_paragraph.lines].map(l=>l.bbox_xyxy);
  const intro = `
    vec2 ac = ${v2(av.center)};
    float ad = length((P-ac)*${v2([1,av.radius_x/av.radius_y])});
    if (ad < ${n(av.radius_x*1.4)}) {
      float r = eo(pg(0.7,1.0))*${n(av.radius_x*1.72)};
      float nr = ad + ${n(av.radius_x*.24)}*(fbm(P*0.006+1.3)-0.5);
      vis *= mix(1.0,smoothstep(r,r-50.0,nr),smoothstep(${n(av.radius_x*1.4)},${n(av.radius_x*1.31)},ad));
    }
    if (P.x>${n(branch[0]-12)} && P.x<${n(branch[2]+12)} && P.y>${n(branch[1]-12)} && P.y<${n(branch[3]+12)}) {
      ivis *= smoothstep(0.0,1.0,pg(1.25,0.5)*1.6-(P.y-${n(branch[1])})/${n(branch[3]-branch[1])}*0.6);
    }
    if (P.x>${n(name[0]-10)} && P.x<${n(name[2]+10)} && P.y>${n(name[1]-6)} && P.y<${n(name[3]+6)}) {
      float x0=${n(chars[0][0])},x1=${n(chars[0][2])},k=0.0;
      if (P.x>=${n((chars[0][2]+chars[1][0])/2)} && P.x<${n((chars[1][2]+chars[2][0])/2)}) {x0=${n(chars[1][0])};x1=${n(chars[1][2])};k=1.0;}
      if (P.x>=${n((chars[1][2]+chars[2][0])/2)}) {x0=${n(chars[2][0])};x1=${n(chars[2][2])};k=2.0;}
      float q=0.55*(P.x-x0)/(x1-x0)+0.45*(P.y-${n(name[1])})/${n(name[3]-name[1])};
      q+=0.07*(noise(P*0.045)-0.5)+0.03*(noise(P*0.2)-0.5);
      float u=pg(1.45+k*0.34,0.40);
      ivis*=smoothstep(u*1.2,u*1.2-0.07,q)*step(0.001,u);
    }
    if (P.x>${n(brush[0]-8)} && P.x<${n(brush[2]+8)} && P.y>${n(brush[1]-5)} && P.y<${n(brush[3]+5)}) {
      float q=(P.x-${n(brush[0])})/${n(brush[2]-brush[0])}+0.04*(noise(P*0.03)-0.5)+0.05*(P.y-${n((brush[1]+brush[3])/2)})/${n(brush[3]-brush[1])};
      float u=eo(pg(2.55,0.38));ivis*=smoothstep(u*1.15,u*1.15-0.05,q)*step(0.001,u);
    }
    ${rows.map((r,i)=>`rise(P0,P,ivis,${v4([r[0]-8,r[1]-6,r[2]+8,r[3]+6])},${n([2.85,3.0,3.2,3.3,3.4][i])});`).join('\n    ')}
    ${G.buttons.map((b,i)=>{const r=b.bbox_xyxy;return `pop(P0,P,ivis,${v2([(r[0]+r[2])/2,(r[1]+r[3])/2])},${v2([(r[2]-r[0])/2,(r[3]-r[1])/2])},${n([3.7,3.85][i])});`;}).join('\n    ')}
`;
  FS = FS.slice(0,FS.indexOf('    vec2 ac ='))+intro+FS.slice(FS.indexOf('    uv = P/PX;'));
  // 竖版两按钮上下相邻：第二个按钮正上方会碰到第一个绿色按钮，
  // 两者都用第一按钮上方的实测白纸作背景，避免弹出途中带出绿色矩形。
  FS = FS.replace('P = vec2(P0.x, c.y-hf.y-22.0);', `P = vec2(P0.x, ${n(G.buttons[0].bbox_xyxy[1]-22)});`);
  FS = FS.replace('const float ASPECT = 1.77668;',`const float ASPECT = ${n(PW/PH)};`)
    .replace('const vec2 PX = vec2(2880.0, 1621.0);',`const vec2 PX = ${v2([PW,PH])};`);
  const start = FS.indexOf('  // ---- 窗外'), end = FS.indexOf('  // ---- 开场：左边还没');
  let room = FS.slice(start,end).replace('  vec3 col = raw;','  col = raw;');
  // 每个纹理采样仍落在竖版原画像素上；只把空间计算转换成原演出的房间坐标。
  let cursor = 0, transformed = '';
  while (true) {
    const at = room.indexOf('texture2D(u_tex,',cursor);
    if (at < 0) {transformed += room.slice(cursor); break;}
    transformed += room.slice(cursor,at);
    let p = at+'texture2D(u_tex,'.length, depth = 1, q = p;
    for (;q<room.length;q++) {if(room[q]==='(')depth++;else if(room[q]===')'&&!--depth)break;}
    transformed += `texture2D(u_tex, sceneToImage(${room.slice(p,q)}))`;cursor=q+1;
  }
  room = transformed;
  const edge = G.curtain.left_edge_polyline.map(p=>[Number(gu(p[0])),Number(gv(p[1]))]);
  let curtain = `${n(edge.at(-1)[0])}`;
  for (let i=edge.length-2;i>=0;i--) {
    const a=edge[i],b=edge[i+1], slope=(b[0]-a[0])/(b[1]-a[1]);
    curtain = `(uv.y<${n(b[1])}?${n(a[0])}+(${n(slope)})*(uv.y-(${n(a[1])})):${curtain})`;
  }
  room = room.replace('0.727 - 0.103*uv.y',curtain);
  const opening=G.window_landscape.window_opening_envelope_polygon;
  const xmin=Math.min(...opening.map(p=>p[0])),xmax=Math.max(...opening.map(p=>p[0])),ymax=Math.max(...opening.map(p=>p[1]));
  room = room.replace('box(uv, vec2(0.412,-0.2), vec2(0.80,0.495), 0.005)',`box(uv,vec2(${gu(xmin)},${gv(-60)}),vec2(${gu(xmax)},${gv(ymax)}),0.005)`);
  const cb=G.curtain.bbox_xyxy;
  room = room.replace('box(uv, vec2(0.60,-0.2), vec2(0.835,0.440), 0.010)',`box(uv,vec2(${gu(cb[0])},${gv(-60)}),vec2(${gu(cb[2])},${gv(cb[3])}),0.010)`);
  const fr=G.fans[0];
  room = room.replace('vec2(38.0/2880.0, 66.0/1621.0)',`vec2(${n(fr.rotor_radius_x/mapping.x.scale/2880)},${n(fr.rotor_radius_y/mapping.y.scale/1621)})`);
  const helpers=`
vec2 sceneToImage(vec2 p){return (p*vec2(2880.0,1621.0)*${v2([mapping.x.scale,mapping.y.scale])}+${v2([mapping.x.offset,mapping.y.offset])})/${v2([PW,PH])};}
vec2 imageToScene(vec2 p){return (p*${v2([PW,PH])}-${v2([mapping.x.offset,mapping.y.offset])})/${v2([mapping.x.scale*2880,mapping.y.scale*1621])};}
`;
  FS=FS.slice(0,start)+`  vec2 suv=uv;vec3 raw=texture2D(u_tex,uv).rgb;vec3 col=raw;
  vec3 ambientColor=pow(raw,u_ambientGamma);
  vec2 mapped=imageToScene(uv);
  {
    vec2 uv=mapped;
    const float ASPECT=1.77668;
    const vec2 PX=vec2(2880.0,1621.0);
`+room+`  }
  // 竖版房间按原演出坐标自然淡出，白纸与水彩边缘都连续；不截一条水平线。
  float roomFade=1.0-smoothstep(0.94,1.08,mapped.y);
  float paintedEdge=smoothstep(0.002,0.10,1.0-min(raw.r,min(raw.g,raw.b)));
  float roomWeight=roomFade*mix(1.0,paintedEdge,smoothstep(0.90,0.94,mapped.y));
  col=mix(ambientColor,col,roomWeight);
`+FS.slice(end);
  FS=FS.replace('void main(){',helpers+'\nvoid main(){');
  const origin=toImage([.58*2880,.30*1621]);
  FS=FS.replace('(v_uv - vec2(0.58,0.30))',`(v_uv - ${v2([origin[0]/PW,origin[1]/PH])})`);
  cam.style.transformOrigin=`${origin[0]/PW*100}% ${origin[1]/PH*100}%`;
}

let gl, prog, glBuffer, glTexture, glPreserve, U = {}, texReady = false, glFailed = false, textureSize = [0, 0], canvasLimit = null;
async function initGL(img) {
  gl = glc.getContext('webgl', { antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) return false;
  const parallel = gl.getExtension('KHR_parallel_shader_compile');
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  prog = gl.createProgram();
  const vertex = sh(gl.VERTEX_SHADER, VS), fragment = sh(gl.FRAGMENT_SHADER, FS);
  gl.attachShader(prog, vertex); gl.attachShader(prog, fragment); gl.linkProgram(prog);
  // LINK_STATUS 会同步等待驱动编译，原稿首次开场在这里阻塞约一秒。
  // 先查询无阻塞的完成状态；准备期间只有下面的静态原图可见。
  if (parallel) {
    while (!destroyed && !failed && !gl.isContextLost() && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
  }
  if (destroyed || failed || gl.isContextLost()) return false;
  gl.deleteShader(vertex); gl.deleteShader(fragment);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const buf = glBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = glTexture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  textureSize = [img.naturalWidth || img.width, img.naturalHeight || img.height];
  glPreserve=gl.createTexture();gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,glPreserve);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,preserveMask);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,glTexture);
  for (const k of ['u_tex', 'u_t', 'u_motion', 'u_night', 'u_sun', 'u_pcMode', 'u_pulse', 'u_scrOn', 'u_moon', 'u_keepBird', 'u_outTint', 'u_outLift', 'u_inTint', 'u_glint',
                   'u_it', 'u_par', 'u_camz', 'u_gust', 'u_fanA', 'u_sweep', 'u_pcFill', 'u_preserve', 'u_ambientGamma'])
    U[k] = gl.getUniformLocation(prog, k);
  gl.uniform1i(U.u_tex, 0);
  gl.uniform1i(U.u_preserve,1);
  texReady = true; return true;
}

// ---------- 画里的显示器 ----------
function solve(Am, b) {
  const n = b.length, M = Am.map((r, i) => r.concat([b[i]]));
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
  return x;
}
const SCR_W = 670, SCR_H = 370, SCR_Q = G.scr;
function screenMatrix() {
  const src = [[0, 0], [SCR_W, 0], [SCR_W, SCR_H], [0, SCR_H]], Am = [], b = [];
  for (let i = 0; i < 4; i++) { const [x, y] = src[i], [u, v] = SCR_Q[i];
    Am.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u); Am.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); }
  const h = solve(Am, b);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]}, ${h[1]},${h[4]},0,${h[7]}, 0,0,1,0, ${h[2]},${h[5]},0,1)`;
}
const SCR_M = screenMatrix();
const STATUS = {
  ok:    { cls: '',      a: '一切正常', b: config.preview ? '今天跑了 12 个任务，没有要你处理的事' : '当前读取的状态正常', pc: 0, on: 1 },
  warn:  { cls: 'warn',  a: config.preview ? '有 1 件事要你处理' : '有事要处理', b: config.preview ? 'G 盘备份超期两天，其余 11 个任务正常' : '请查看驾驶舱的状态详情', pc: 1, on: 1 },
  off:   { cls: 'off',   a: '暂时读不到电脑', b: config.preview ? '上次读到是 22:10，当时一切正常' : '状态读取结果不可用', pc: 2, on: 0 },
};
// 小消息沿用原滑入编排；小样演示任务，正式页面显示当前真实状态标题。
const MSGS = { ok: ['照片整理 完成', 'G 盘备份 完成', '日记索引 已更新', '下载目录 已清理', '规则核对 通过', '邮件分拣 3 封'], warn: ['照片整理 完成', '日记索引 已更新', '下载目录 已清理', '规则核对 通过'] };
const s0 = $('#s0'), toast = $('#toast'), tmsg = $('#tmsg'), spill = $('#spill'), s2 = $('#s2');
s0.innerHTML = [0, 1, 2, 3, 4].map(i => i === 2 ? '<span class="cl">:</span>' : '<span class="dg"><span class="rl">' + '0123456789'.split('').concat(['0']).join('<br>') + '</span></span>').join('');
const rolls = [...s0.querySelectorAll('.rl')], colon = s0.querySelector('.cl');
let digits = [0, 0, 0, 0];
function paintStatus() {
  const s = STATUS[S.status], d = hzDate(); if (scrEl.className !== s.cls) scrEl.className = s.cls;
  digits = fmt(S.hour).replace(':', '').split('').map(Number);
  setText($('#sd'), `${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日 周${'日一二三四五六'[d.getUTCDay()]}`);
  setText($('#s1'), shared.status.title ?? s.a); setText(s2, shared.status.detail ?? s.b);
}
let lastScr = '';
function paintScreen(T, it) {
  const st = STATUS[S.status];
  const on = scrOnAt(it);
  const op = reduce ? 1 : clamp((on - 0.35) / 0.65, 0, 1);
  // 时钟的数字滚到现在的时间
  // （从 47 分钟前一路快进到现在：途中每一刻都是一个真的时间，不会滚出“83:97”这种乱码）
  const e0 = reduce ? 1 : eOut(ramp(it, 3.95, 0.95));
  let mf = digits[0] * 600 + digits[1] * 60 + digits[2] * 10 + digits[3] - 47 * (1 - e0); mf = ((mf % 1440) + 1440) % 1440;
  const hh = Math.floor(mf / 60), mm = mf - hh * 60;
  const tr = [Math.floor(hh / 10), hh % 10, Math.floor(mm / 10), mm % 10];      // 只有最后一位带小数，所以它是平滑地滚
  const pe = reduce ? 1 : ramp(it, 4.5, 0.42), ps = pe <= 0 ? 0 : eOut(pe) + 0.12 * Math.sin(pe * Math.PI) ;
  const me = reduce ? 1 : eOut(ramp(it, 4.75, 0.5));
  const blink = reduce || failed || it < INTRO ? 1 : (((T / SPEED) % 1 + 1) % 1 < 0.5 ? 1 : 0.25);   // 冒号按真实的一秒闪一下
  // 小消息：开场演完以后每 6 秒（真实时间）一条，滑进来、停 3 秒、淡出；状态读不到（off）时不出
  let tOp = 0, tY = -60, idx = -1;
  const tau = (it - (INTRO + 1.0)) / SPEED;                    // 这一段按真实的秒算：消息要停够久才看得清
  if (config.preview && !reduce && !failed && tau >= 0 && (S.status === 'ok' || S.status === 'warn')) {
    idx = Math.floor(tau / 6.0); const ph = tau - idx * 6.0;
    if (ph < 0.25) { const e = eOut(ph / 0.25); tOp = e; tY = -60 * (1 - e); }
    else if (ph < 3.0) { tOp = 1; tY = 0; }
    else if (ph < 3.35) { const e = (ph - 3.0) / 0.35; tOp = 1 - e; tY = 0; }
  }
  const key = [op.toFixed(3), tr.map(v => v.toFixed(3)).join(), ps.toFixed(3), me.toFixed(3), blink, tOp.toFixed(3), tY.toFixed(1), idx, S.status].join('|');
  if (key === lastScr) return; lastScr = key;
  style(scrEl, 'opacity', Math.max(0.002, op));            // 不到全透明：让浏览器提前把这一层画好，亮屏那一刻不顿
  rolls.forEach((r, i) => { style(r, 'transform', `translateY(${(-tr[i] * 1.2).toFixed(4)}em)`); });
  style(colon, 'opacity', blink);
  style(spill, 'transform', `scale(${ps.toFixed(4)})`); style(spill, 'opacity', Math.min(1, ps * 3));
  style(s2, 'opacity', me); style(s2, 'transform', `translateY(${((1 - me) * 18).toFixed(2)}px)`);
  if (idx >= 0) { const L = MSGS[S.status] || MSGS.ok; const text = config.preview ? L[idx % L.length] : (shared.status.title ?? st.a); setText(tmsg, text);
    setClass(toast, 'warn', !config.preview && S.status === 'warn'); }   // 正式页面“有事要处理”不带对勾
  style(toast, 'opacity', !config.preview || failed || reduce ? 0 : Math.max(0.002, tOp)); style(toast, 'transform', `translateY(${tY.toFixed(1)}px)`);
}
function scrOnAt(it) {   // 显示器亮起：一闪、暗一下、再亮稳
  if (reduce) return 1;
  if (it < 3.55) return 0;
  if (it < 3.66) return 0.75 * (it - 3.55) / 0.11;
  if (it < 3.78) return 0.75 - 0.45 * (it - 3.66) / 0.12;
  return 0.30 + 0.70 * eOut(ramp(it, 3.78, 0.45));
}

// ---------- 鸟 ----------
const fx = fxc.getContext('2d');
const imgs = {};
const actualPlace = A.place || { x: 1440, y: 808, scale: 1 };
const perchPoint = toWorld([actualPlace.x,actualPlace.y]);
const place = portrait ? {x:perchPoint[0],y:perchPoint[1],scale:actualPlace.scale/mapping.x.scale} : actualPlace;
const PERCH = { sill: { x0: 1432, x1: 1558, y: x => place.y }, mon: { x0: 1705, x1: 2275, y: x => 749 + (x - 1650) * 0.0076 }, pc: { x0: 2480, x1: 2760, y: x => 742 } };
// 窗户的轮廓（鸟飞远了就只在窗里看得见）
const WIN = portrait ? G.window_landscape.window_opening_envelope_polygon.map(toWorld) : [[1187, 0], [2094, 0], [1957, 745], [1650, 745], [1650, 812], [1187, 812]];
if (portrait) {
  const sill=G.window_sill.recommended_standing_segment.map(toWorld), mon=G.monitor.casing_top_edge_endpoints.map(toWorld);
  const line = points => x => points[0][1]+(x-points[0][0])*(points[1][1]-points[0][1])/(points[1][0]-points[0][0]);
  PERCH.sill = {x0:sill[0][0],x1:sill[1][0],y:line(sill)};
  PERCH.mon = {x0:mon[0][0]+40,x1:mon[1][0]-40,y:line(mon)};
  PERCH.pc.y = () => toWorld([0,G.case.bbox_xyxy[1]+2])[1];
}
const bird = { perch: 'sill', x: place.x, y: place.y, pose: 'idle', flip: 1, sx: 1, sy: 1, rot: 0, air: 0, s: 1, alpha: 1, hidden: false, away: 0, outCd: 16,
               introDone: false, act: null, next: 2.5, lookCd: 0, zCd: 0, noteCd: 0 };
const ptr = { x: -9999, y: -9999, on: false, moved: -99 };
const parts = [];
let sc = 1, dpr = 1, audio = null;

function chirp(pitch, count) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
    const t0 = audio.currentTime + 0.02;
    for (let i = 0; i < count; i++) {
      const o = audio.createOscillator(), g = audio.createGain(), st = t0 + i * 0.16, f0 = (3000 + Math.random() * 500) * pitch;
      o.type = 'sine'; o.frequency.setValueAtTime(f0, st);
      o.frequency.exponentialRampToValueAtTime(f0 * 1.45, st + 0.035); o.frequency.exponentialRampToValueAtTime(f0 * 0.80, st + 0.090);
      g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(0.15, st + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, st + 0.100);
      o.connect(g).connect(audio.destination); o.onended = () => { o.disconnect(); g.disconnect(); }; o.start(st); o.stop(st + 0.12);
    }
  } catch (e) { /* 没声音不影响画面 */ }
}
function startHop(to, x1) {
  const p = PERCH[to], x0 = bird.x, y0 = bird.y, y1 = p.y(x1), dist = Math.hypot(x1 - x0, y1 - y0);
  bird.flip = x1 >= x0 ? 1 : -1;
  bird.act = { name: 'hop', t: 0, dur: 0.16 + clamp(0.24 + dist / 900, 0.28, 0.62) + 0.12, x0, y0, x1, y1, h: 26 + dist * 0.17 + Math.max(0, y0 - y1) * 0.4, to };
}
// 沿一条三次贝塞尔飞：s 是远近（1 = 在窗台那么近，越小越远）
function startFly(p0, p1, p2, p3, s0, s1, dur, o) {
  bird.hidden = false; bird.air = 1;
  bird.act = Object.assign({ name: 'fly', t: 0, dur, p0, p1, p2, p3, s0, s1 }, o);
}
function flyTo(to, x1) {
  const y1 = PERCH[to].y(x1), dx = x1 - bird.x, dist = Math.hypot(dx, y1 - bird.y);
  startFly([bird.x, bird.y], [bird.x + dx * 0.25, bird.y - 170 - dist * 0.05], [x1 - dx * 0.25, y1 - 190 - dist * 0.05], [x1, y1], 1, 1, 0.75 + dist / 1500, { land: true, to });
}
function flyOut(T) {
  const fx_ = rand(1560, 1860), fy = rand(230, 320), sx = bird.x < fx_ ? 1 : -1;
  startFly([bird.x, bird.y], [bird.x + sx * 70, bird.y - 230], [fx_ - sx * 40, fy + 150], [fx_, fy], 1, 0.2, 1.55, { land: false });
  bird.perch = null;
}
function flyIn(to, x1, shake) {
  const fx_ = rand(1640, 1880), fy = rand(240, 310), y1 = PERCH[to].y(x1), sx = x1 < fx_ ? -1 : 1;
  bird.x = fx_; bird.y = fy;
  startFly([fx_, fy], [fx_ + sx * 90, fy - 120], [x1 - sx * 60, y1 - 280], [x1, y1], 0.2, 1, 1.5, { land: true, to, shake });
}
function chooseAct(T) {
  const calm = S.night > 0.5, r = rnd(), p = PERCH[bird.perch];
  if (!calm && T > bird.outCd && r < 0.45) {
    if (bird.x < 1950) { flyOut(T); return; }                      // 只从窗户那一侧飞出去
    flyTo('sill', rand(1480, 1550)); return;                       // 在机箱或显示器右边时先飞回窗台，不然会穿过窗帘突然消失
  }
  if (r < 0.18) bird.act = { name: 'tilt', t: 0, dur: rand(0.8, 1.4) };
  else if (r < 0.30) bird.act = { name: 'look', t: 0, dur: rand(0.9, 1.6) };
  else if (r < 0.44) bird.act = { name: 'preen', t: 0, dur: rand(1.4, 2.2) };
  else if (r < (calm ? 0.80 : 0.74)) { let x1 = clamp(bird.x + (rnd() < 0.5 ? -1 : 1) * rand(45, 130), p.x0, p.x1); if (Math.abs(x1 - bird.x) < 30) x1 = bird.x > (p.x0 + p.x1) / 2 ? p.x0 + 10 : p.x1 - 10; startHop(bird.perch, x1); }
  else if (!calm || rnd() < 0.4) {
    const opts = { sill: ['mon', 'mon', 'pc'], mon: ['sill', 'pc'], pc: ['mon', 'sill'] }[bird.perch];
    const to = opts[Math.floor(rnd() * opts.length)], q = PERCH[to], x1 = to === 'sill' ? rand(1480, 1550) : to === 'mon' ? rand(1720, 2200) : rand(2500, 2740);
    if (Math.hypot(x1 - bird.x, q.y(x1) - bird.y) < 650) startHop(to, x1); else flyTo(to, x1);
  }
  else bird.act = { name: 'tilt', t: 0, dur: 1.2 };
}
function birdHead() { return { x: bird.x + 58 * bird.flip, y: bird.y - 118 }; }
function sing(T) {
  if (reduce || failed || destroyed || bird.hidden || (bird.act && (bird.act.name === 'hop' || bird.act.name === 'fly' || bird.act.name === 'land'))) return;
  if (S.sleep) { bird.act = { name: 'wake', t: 0, dur: 1.5 }; chirp(0.72, 1); const h = birdHead(); parts.push({ ch: '?', x: h.x + 20, y: h.y - 30, vx: 8, vy: -34, life: 1.3, t: 0, size: 44, col: '#2f7d55' }); return; }
  const n = 2 + Math.floor(rnd() * 3);
  bird.act = { name: 'sing', t: 0, dur: 0.16 * n + 0.3, n, sung: 0 }; chirp(1, n);
}
function bez(a, b, c, d, u) { const v = 1 - u; return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d; }
function updBird(dt, T) {
  if (!hasBird) return;
  const it = V.t - birdIntroAt;
  if (!bird.introDone) {                       // 开场：鸟先不在，第 2.2 秒从窗外飞进来
    bird.hidden = true;
    if (it >= 2.2) { bird.introDone = true; flyIn('sill', place.x, true); bird.act.dur = 1.45; bird.act.p0 = [1830, 300]; bird.act.p1 = [1760, 170]; bird.act.p2 = [1380, 560]; }
    else return;
  }
  const a = bird.act;
  if (a) {
    a.t += dt; const u = Math.min(1, a.t / a.dur);
    if (a.name === 'tilt') bird.pose = 'tilt';
    else if (a.name === 'look' || a.name === 'wake') bird.pose = 'look';
    else if (a.name === 'preen') { bird.pose = 'preen'; bird.rot = 0.028 * Math.sin(a.t * 19); }
    else if (a.name === 'sing') {
      bird.pose = 'sing'; const k = Math.sin(clamp((a.t % 0.16) / 0.16, 0, 1) * Math.PI); bird.sy = 1 + 0.06 * k; bird.sx = 1 - 0.03 * k;
      const due = Math.min(a.n, Math.floor(a.t / 0.16) + 1);
      while (a.sung < due) { a.sung++; const h = birdHead(); parts.push({ ch: rnd() < 0.5 ? '♪' : '♫', x: h.x + 26 * bird.flip, y: h.y - 16, vx: rand(18, 46) * bird.flip, vy: -rand(46, 74), life: 1.5, t: 0, size: rand(38, 50), col: '#18935a' }); }
    } else if (a.name === 'hop') {
      const c = 0.16 / a.dur, l = 1 - 0.12 / a.dur;
      if (u < c) { const k = u / c; bird.pose = 'crouch'; bird.sy = 1 - 0.14 * k; bird.sx = 1 + 0.08 * k; bird.air = 0; }
      else if (u < l) { const k = (u - c) / (l - c); bird.pose = A.sprites.hop2 && Math.floor(a.t * 13) % 2 ? 'hop2' : 'hop'; bird.x = a.x0 + (a.x1 - a.x0) * k; bird.y = a.y0 + (a.y1 - a.y0) * k - a.h * 4 * k * (1 - k);
        bird.sy = 1.08; bird.sx = 0.95; bird.rot = -(0.5 - k) * 0.42; bird.air = 1; }
      else { const k = (u - l) / (1 - l); bird.pose = 'crouch'; bird.x = a.x1; bird.y = a.y1; bird.sy = 0.84 + 0.16 * k; bird.sx = 1.10 - 0.10 * k; bird.rot = 0; bird.air = 0; }
    } else if (a.name === 'fly') {
      const e = a.land ? 1 - Math.pow(1 - u, 1.8) * (1 - 0.0) : u * u * (3 - 2 * u) * 0.5 + u * 0.5;
      const nx = bez(a.p0[0], a.p1[0], a.p2[0], a.p3[0], e), ny = bez(a.p0[1], a.p1[1], a.p2[1], a.p3[1], e);
      const vx = nx - bird.x, vy = ny - bird.y;
      if (Math.abs(vx) > 0.6) bird.flip = vx > 0 ? 1 : -1;
      bird.x = nx; bird.y = ny;
      bird.s = a.s1 > a.s0 ? a.s0 + (a.s1 - a.s0) * Math.pow(e, 1.6) : a.s0 + (a.s1 - a.s0) * (1 - Math.pow(1 - e, 1.6));
      bird.alpha = clamp((bird.s - 0.2) / 0.1, 0, 1);
      bird.pose = A.sprites.hop2 && Math.floor(a.t * 11) % 2 ? 'hop2' : 'hop';
      if (a.land && u > 0.9) bird.pose = 'hop';
      bird.rot = clamp(Math.atan2(vy, Math.abs(vx) + 1e-3) * 0.3, -0.35, 0.35) * bird.flip; bird.sx = 1; bird.sy = 1; bird.air = 1;
      if (u >= 1) {
        bird.rot = 0; bird.air = 0;
        if (a.land) { bird.perch = a.to; bird.s = 1; bird.alpha = 1; bird.act = { name: 'land', t: 0, dur: a.shake ? 0.95 : 0.4, shake: a.shake }; }
        else { bird.hidden = true; bird.act = null; bird.away = T + SPEED * rand(1.5, 3.0); bird.outCd = T + SPEED * rand(8, 13); }   // 飞出去 1.5–3 秒回来，8–13 秒后才会再飞出去（真实的秒）
        return;
      }
    } else if (a.name === 'land') {               // 落下压扁一下；开场那次再抖抖毛、转过身来
      bird.air = 0; bird.s = 1;
      if (a.t < 0.2) { const k = a.t / 0.2; bird.pose = 'crouch'; bird.sy = 0.80 + 0.20 * k; bird.sx = 1.12 - 0.12 * k; bird.rot = 0; }
      else if (a.shake) { const k = (a.t - 0.2) / (a.dur - 0.2), w = Math.sin(k * Math.PI);
        bird.pose = k < 0.45 ? 'idle' : 'preen'; if (k > 0.45) bird.flip = 1;
        bird.sx = 1 + 0.07 * Math.sin(a.t * 46) * w; bird.sy = 1 - 0.04 * Math.sin(a.t * 46 + 1) * w; bird.rot = 0.05 * Math.sin(a.t * 38) * w; }
      else { bird.pose = 'idle'; bird.sx = bird.sy = 1; }
    }
    if (u >= 1 && bird.act === a) { if (a.name === 'hop') bird.perch = a.to; bird.act = null; bird.sx = bird.sy = 1; bird.rot = 0; bird.air = 0; bird.next = T + SPEED * rand(0.7, 1.9); }   // 两个动作之间歇 0.7–1.9 秒（真实的秒）
    return;
  }
  if (bird.hidden) {                           // 飞出去了：过几秒从远处飞回来，落在窗台、显示器或机箱上
    if (T >= bird.away || S.sleep) {
      const r = rnd(), to = S.sleep || r < 0.55 ? 'sill' : r < 0.8 ? 'mon' : 'pc';
      flyIn(to, to === 'sill' ? rand(1450, 1540) : to === 'mon' ? rand(1740, 2150) : rand(2520, 2720), false);
    }
    return;
  }
  if (S.sleep) {
    if (bird.perch !== 'sill') { if (bird.perch === 'pc') flyTo('sill', 1500); else startHop('sill', 1500); return; }
    bird.pose = 'sleep'; bird.sy = 1 + 0.026 * Math.sin(T * 1.2); bird.sx = 1 - 0.012 * Math.sin(T * 1.2);
    if (T > bird.zCd) { bird.zCd = T + 1.7; const h = birdHead(); parts.push({ ch: 'z', x: h.x - 6, y: h.y - 4, vx: 10, vy: -24, life: 2.4, t: 0, size: rand(30, 40), col: '#8fb9d8' }); }
    return;
  }
  bird.pose = 'idle'; bird.sy = 1 + 0.012 * Math.sin(T * 2.3); bird.sx = 1;
  const h = birdHead();
  if (ptr.on && Math.hypot(ptr.x - h.x, ptr.y - (h.y + 40)) < 300 && T > bird.lookCd) { bird.act = { name: 'look', t: 0, dur: rand(1.1, 1.9) }; bird.lookCd = T + 3.6; return; }
  if (T >= bird.next) chooseAct(T);
}
function updParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.t += dt; if (p.t >= p.life) { parts.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; if (p.leaf) p.rot += p.vr * dt;
  }
}
function winClip(k0, ox, oy) { fx.beginPath(); WIN.forEach(([x, y], i) => i ? fx.lineTo((x + ox) * k0, (y + oy) * k0) : fx.moveTo((x + ox) * k0, (y + oy) * k0)); fx.closePath(); fx.clip(); }
function drawFx() {
  fx.setTransform(1, 0, 0, 1, 0, 0); fx.clearRect(0, 0, fxc.width, fxc.height);
  if (!fx || S.mode !== 'live') return;
  if (portrait) fx.setTransform(mapping.x.scale*2880/PW,0,0,mapping.y.scale*2880/PW,mapping.x.offset*stage.clientWidth/PW*dpr,mapping.y.offset*stage.clientWidth/PW*dpr);
  const k0 = sc * dpr, parX = -V.par[0], parY = -V.par[1];
  if (hasBird && !bird.hidden) {
    const sp = A.sprites[bird.pose] || A.sprites.idle, im = imgs[sp === A.sprites.idle ? 'idle' : bird.pose];
    const far = 1 - bird.s, fl = bird.act && bird.act.name === 'fly';
    if (!fl) {
      const gy = bird.act && bird.act.name === 'hop' ? bird.act.y0 + (bird.act.y1 - bird.act.y0) * clamp((bird.x - bird.act.x0) / ((bird.act.x1 - bird.act.x0) || 1), 0, 1) : bird.y;
      fx.save(); fx.translate(bird.x * k0, (gy + 2) * k0); fx.scale(1, 0.2); fx.beginPath(); fx.arc(0, 0, 46 * k0 * (1 - 0.35 * bird.air), 0, 6.283);
      fx.fillStyle = `rgba(40,50,40,${0.16 * (1 - 0.55 * bird.air) * (1 - 0.5 * S.night)})`; fx.fill(); fx.restore();
    }
    if (im && im.complete && im.naturalWidth) {
      const k = k0 * place.scale * (sp.scale || 1) * bird.s;
      fx.save();
      if (far > 0.22) winClip(k0, 0, 0);                  // 飞远了：只在窗里看得见，不会画到墙上
      fx.globalAlpha = bird.alpha;
      fx.translate((bird.x + parX * far) * k0, (bird.y + parY * far) * k0); fx.scale(k * bird.flip * bird.sx, k * bird.sy * (portrait ? mapping.x.scale/mapping.y.scale : 1)); fx.rotate(bird.rot * bird.flip);
      const b = 1 - 0.42 * S.night - 0.10 * far; fx.filter = S.night > 0.02 || far > 0.05 ? `brightness(${b.toFixed(3)}) saturate(${(1 - 0.25 * S.night - 0.2 * far).toFixed(3)})` : 'none';
      fx.drawImage(im, -sp.feet[0], -sp.feet[1]); fx.restore(); fx.filter = 'none';
    }
  }
  for (const p of parts) {
    const u = p.t / p.life;
    if (p.leaf) {                                             // 窗外偶尔飘下的一片叶子，只在窗户里看得见
      fx.save(); winClip(k0, 0, 0);
      fx.translate((p.x + parX * 0.8 + Math.sin(p.t * 1.7 + p.size) * 26) * k0, (p.y + parY * 0.8) * k0); fx.rotate(p.rot + Math.sin(p.t * 2.1) * 0.5);
      const s = p.size * k0; fx.globalAlpha = Math.min(1, u * 8) * 0.9 * (1 - 0.5 * S.night);
      fx.beginPath(); fx.moveTo(-s, 0); fx.quadraticCurveTo(0, -s * 0.62, s, 0); fx.quadraticCurveTo(0, s * 0.62, -s, 0); fx.fillStyle = p.col; fx.fill();
      fx.beginPath(); fx.moveTo(-s * 0.8, 0); fx.lineTo(s * 0.8, 0); fx.strokeStyle = 'rgba(60,90,40,.45)'; fx.lineWidth = Math.max(1, s * 0.07); fx.stroke();
      fx.restore(); continue;
    }
    fx.save(); fx.globalAlpha = Math.min(1, u * 6) * (1 - u) * 0.95; fx.fillStyle = p.col; fx.font = `700 ${p.size * k0}px "Segoe UI Symbol","Noto Sans SC",sans-serif`;
    fx.translate((p.x + Math.sin(p.t * 3 + p.size) * 8) * k0, p.y * k0); fx.rotate(Math.sin(p.t * 2.2 + p.size) * 0.22); fx.fillText(p.ch, 0, 0); fx.restore();
  }
}

// ---------- 随时间变的几样：窗帘的风、风扇、机箱灯的亮带 ----------
function gustAt(T, it) {
  const a = Math.pow(Math.max(0, Math.sin(T * 0.43 + 0.6)), 2) * 0.55 + Math.pow(Math.max(0, Math.sin(T * 0.19 + 2.1)), 3) * 0.45;
  const g = it < 1.3 ? 0 : it < 2.0 ? 1.15 * eOut((it - 1.3) / 0.7) : 1.15 * Math.exp(-(it - 2.0) * 0.9);
  return a + g;
}
function fanAngle(T, it) {   // 开场第 4.3 秒起转，一秒内加到全速
  const W = 5.0, a = 4.3, d = 1.0; const x = it - a;
  const F = x <= 0 ? 0 : x < d ? x * x / (2 * d) : d / 2 + (x - d);
  return (W * F) % (Math.PI * 2);
}
function sweepAt(it) {       // 开场跑一圈；以后每 6 秒跑一道
  if (it < 4.3) return -1e4;
  if (it < 5.15) return 690 + 600 * eInOut((it - 4.3) / 0.85);
  const tau = it - 7.0; if (tau < 0) return -1e4;
  const ph = tau % 6.0; return ph < 0.9 ? 690 + 600 * eInOut(ph / 0.9) : -1e4;
}

// ---------- 布局、时间、循环 ----------
function layout() {
  const w = stage.clientWidth, h = stage.clientHeight; dpr = window.devicePixelRatio || 1; sc = w / (portrait ? 2880 : PW);
  let cw = Math.round(w * dpr), ch = Math.round(h * dpr); canvasLimit = null;
  if (gl) {
    const vp = gl.getParameter(gl.MAX_VIEWPORT_DIMS), rb = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    const cap = Math.min(1, Math.min(vp[0], rb) / cw, Math.min(vp[1], rb) / ch);
    if (cap < 1) { cw = Math.max(1, Math.floor(cw * cap)); ch = Math.max(1, Math.floor(ch * cap)); canvasLimit = 'webgl-hardware-limit'; }
  }
  for (const c of [glc, fxc]) { if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; } }
  scrEl.style.transform = `scale(${w/PW}) ${SCR_M}`;
  if (gl) gl.viewport(0, 0, glc.width, glc.height);
}
let leafCd = 5;
function step(dt) {                 // 往前走一小步：鸟、粒子、视差
  V.t += dt; const T = V.t;
  const it = T - V.i0;
  // 视差：鼠标在画上时跟着鼠标（反向），不动时镜头自己极慢地轻晃
  let tx, ty;
  if (ptr.on && T - ptr.moved < 2.5) { tx = clamp(ptr.x / PW - 0.5, -0.5, 0.5) * 2 * 20; ty = clamp(ptr.y / PH - 0.5, -0.5, 0.5) * 2 * 10; }
  else { tx = 5.5 * (0.6 * Math.sin(T * 0.23) + 0.4 * Math.sin(T * 0.137 + 1.0)); ty = 3.0 * Math.sin(T * 0.17 + 2.0); }
  const k = Math.min(1, dt * 2.6); V.par[0] += (tx - V.par[0]) * k; V.par[1] += (ty - V.par[1]) * k;
  updBird(dt, T);
  updParts(dt);
  if (S.mode === 'live' && T > leafCd && S.night < 0.6 && it > 3) {
    leafCd = T + rand(9, 18);
    parts.push({ leaf: true, x: rand(1260, 1880), y: rand(-30, 90), vx: rand(-14, 10), vy: rand(40, 62), life: 16, t: 0, size: rand(13, 19), rot: rand(0, 6.28), vr: rand(-1.4, 1.4), col: rnd() < 0.5 ? '#86b84e' : '#cdb743' });
  }
}
function render() {
  const T = reduce ? 0 : (S.frozen != null ? S.frozen : V.t);
  const it = reduce ? 99 : V.t - V.i0;
  const P = todParams(S.hour); S.night = P.n;
  S.sleep = hasBird && (S.hour >= 23 || S.hour < sun.sr - 0.6);

  const st = STATUS[S.status];
  // 开场镜头：从 1.09 倍推回 1 倍
  const z = it >= INTRO ? 1 : 1 + 0.09 * (1 - eOut(ramp(it, 0, 3.4)));
  style(cam, 'transform', z > 1.0001 ? `scale(${z.toFixed(5)})` : '');
  style(base, 'visibility', '');
  style(root, 'visibility', reduce && externalPlate ? 'hidden' : '');
  style(root, 'display', reduce && externalPlate ? 'none' : '');
  if (texReady && !failed && !reduce && S.mode === 'live') {
    gl.uniform3fv(U.u_ambientGamma,syncStaticTone(P));
    const pulse = 0.5 + 0.5 * Math.sin(T * (st.pc === 1 ? 4.2 : 2.1));
    gl.uniform1f(U.u_t, T); gl.uniform1f(U.u_motion, reduce ? 0 : 1); gl.uniform1f(U.u_night, P.n); gl.uniform1f(U.u_sun, P.s);
    gl.uniform1f(U.u_pcMode, st.pc); gl.uniform1f(U.u_pulse, reduce ? 0.5 : pulse); gl.uniform1f(U.u_scrOn, st.on * scrOnAt(it)); gl.uniform1f(U.u_moon, P.m);
    gl.uniform1f(U.u_keepBird, hasBird ? 0 : 1);
    gl.uniform3fv(U.u_outTint, P.o); gl.uniform3fv(U.u_outLift, P.l); gl.uniform3fv(U.u_inTint, P.i); gl.uniform3fv(U.u_glint, P.g);
    gl.uniform1f(U.u_it, it < 8 ? it : 99); gl.uniform1f(U.u_camz, z);
    gl.uniform2f(U.u_par, reduce ? 0 : V.par[0] / (portrait ? 2880 : PW), reduce ? 0 : V.par[1] / (portrait ? 1621 : PH));
    gl.uniform1f(U.u_gust, reduce ? 0 : gustAt(T, it));
    gl.uniform1f(U.u_fanA, reduce ? 0 : fanAngle(T, it));
    gl.uniform1f(U.u_sweep, reduce ? -1e4 : sweepAt(it));
    gl.uniform1f(U.u_pcFill, reduce || it >= 5.2 ? 1e5 : it < 4.3 ? -1e4 : sweepAt(it));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  const ck = fmt(S.hour); if (ck !== lastClock) { lastClock = ck; paintStatus(); lastScr = ''; }
  paintScreen(T, it);
  if (!failed && !reduce) drawFx();
}
let last = 0, lastClock = '', fpsN = 0, fpsT = 0, fps = 0;
function canAnimate() { return !destroyed && active && !failed && !reduce && texReady && S.mode === 'live'; }
function shouldRun() { return canAnimate() && !shared.paused; }
// ---------- 防卡死的保险（宁可不触发，不能误触发） ----------
// 只看页面可见、画在屏幕内、动画在播时真正画出来的帧，记下相邻两帧的间隔。
// 退回静态的条件，满足其一：
//   a) 最近约 6 秒、至少 5 个帧间隔，间隔的中位数超过 100 毫秒（实际帧率中位数低于 10）；
//   b) 连续 3 帧以上、每帧都超过 1 秒，而且这几帧加起来超过 5 秒（一帧接一帧的长帧就是卡死）。
// 不算的：刚开始播的头 2 秒、滚动中和最后一次滚动后 1.5 秒、页面隐藏或画滚出屏幕（浏览器自己暂停）、
// 手动取帧；单次长帧只占窗口里的一个间隔，拉不动中位数，也凑不成“连续 3 帧”。
const GUARD = { graceMs: 2000, windowMs: 6000, minIntervals: 5, slowMedianMs: 100, longMs: 1000, longRun: 3, longRunMs: 5000 };
const guardGaps = [];
let guardSpan = 0, guardLast = 0, guardMedian = 0, guardLong = 0, guardLongMs = 0, guardMedianAt = 0;
function resetGuard(grace = 0) {
  guardGaps.length = 0; guardSpan = 0; guardLast = 0; guardMedian = 0; guardLong = 0; guardLongMs = 0; guardMedianAt = 0;
  guardEligibleAt = performance.now() + grace;
}
function resetBudget() { last = 0; resetGuard(GUARD.graceMs); }
function checkFrameGuard(now) {
  if (!shouldRun() || V.manual || S.frozen != null) { resetGuard(GUARD.graceMs); return false; }
  if (now < shared.scrollingUntil) { resetGuard(); guardEligibleAt = shared.scrollingUntil; return false; }
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
    ? `[HeroLive] 动效退回静态：可见播放时连续 ${guardLong} 帧每帧都超过 1 秒（共 ${(guardLongMs / 1000).toFixed(1)} 秒）；仅本页本次生效。`
    : `[HeroLive] 动效退回静态：可见播放时最近 ${(guardSpan / 1000).toFixed(1)} 秒实际帧率中位数 ${(1000 / guardMedian).toFixed(1)} FPS（帧间隔中位数 ${guardMedian.toFixed(0)} 毫秒）；仅本页本次生效。`);
  stop('slow-frames'); return true;
}
function schedule() {
  if (destroyed) return;
  if (shouldRun()) { if (!raf) raf = requestAnimationFrame(frame); }
  else { if (raf) cancelAnimationFrame(raf); raf = 0; resetBudget(); }
}
function frame(now) {
  raf = 0;
  if (!shouldRun()) return;
  const raw = last ? now - last : 0, dt = Math.min(0.05, raw / 1000); last = now;
  frames++; maxFrame = Math.max(maxFrame, raw);
  if (checkFrameGuard(now)) return;
  if (S.fast) shared.daytimeHour = S.hour = (S.hour + raw / 1000 * 24 / 60) % 24;
  else if (S.follow) S.hour = hzHour();
  try { if (!V.manual) step(dt * SPEED); render(); }
  catch (e) { stop('render-error', e); return; }
  fpsN++; if (now - fpsT >= 1000) { fps = Math.round(fpsN * 1000 / (now - fpsT)); fpsN = 0; fpsT = now; }
  schedule();
}
function paintStatic() {
  if (destroyed) return;
  if (S.follow) S.hour = hzHour();
  V.i0 = V.t - 99; V.par[0] = V.par[1] = 0;
  setClass(root, 'is-static', true);
  style(cam, 'transform', ''); style(base, 'visibility', '');
  style(root, 'visibility', reduce && externalPlate ? 'hidden' : '');
  style(root, 'display', reduce && externalPlate ? 'none' : '');
  ink.style.filter=originalPlateFilter;lastGamma='';
  style(glc, 'visibility', 'hidden'); style(fxc, 'visibility', 'hidden');
  paintStatus(); lastScr = ''; paintScreen(0, 99);
}
function tickStatic() {
  clearTimeout(staticTimer); staticTimer = 0;
  if (destroyed || shared.paused || canAnimate()) return;
  paintStatic();
  staticTimer = setTimeout(tickStatic, 1000 - (Date.now() % 1000));
}
function stop(why, error) {
  if (destroyed) return;
  failed = true; glFailed = true; phase = 'static'; reason = why;
  if (why === 'webgl-context-lost') console.info('[HeroLive] 动效退回静态：WebGL 上下文丢失；仅本页本次生效。');
  if (error) shared.errors.push(String(error.message || error));
  schedule(); paintStatic(); tickStatic();
}
function pauseChanged() {
  if (lastPaused && !shared.paused) resetBudget();
  lastPaused = shared.paused;
  schedule(); if (!shared.paused) { if (!canAnimate()) paintStatic(); tickStatic(); }
  else { clearTimeout(staticTimer); staticTimer = 0; }
}
function preferenceChanged() {
  reduce = shared.reduced; schedule();
  if (reduce) { phase = 'static'; reason = 'reduced-motion'; paintStatic(); }
  else if (!failed && texReady) { active = true; phase = 'live'; reason = null; resetBudget(); resetBird(false); V.i0 = V.t - 99; root.classList.remove('is-static'); style(glc,'visibility',''); style(fxc,'visibility',''); render(); schedule(); }
  else if (!failed) load();
  tickStatic();
}
function resetBird(intro) {
  birdIntroAt = V.t - (introEnabled ? 0 : 2.2);
  Object.assign(bird, { perch: 'sill', x: place.x, y: place.y, pose: 'idle', flip: 1, sx: 1, sy: 1, rot: 0, air: 0, s: 1, alpha: 1, hidden: !!intro, act: null,
                        introDone: !intro, next: V.t + (intro ? 6.5 : 2.5), outCd: V.t + (intro ? 18 : 14), away: 0 });
}
function replay() { if (reduce || failed) return; V.i0 = introEnabled ? V.t : V.t - 99; parts.length = 0; resetBird(true); lastScr = ''; }
function skipIntro() {
  if (V.t - V.i0 >= INTRO) return;
  V.i0 = V.t - 20;
  if (!bird.introDone || (bird.act && bird.act.shake)) resetBird(false);
  lastScr = '';
}
// 把时间定在开场后的第 s 秒（逐格截图用）。往后走就接着算，往回就从头算一遍，结果每次一样。
function seek(s) {
  resetGuard(2000);
  if (reduce || failed) { paintStatic(); return V.t; }
  { const P = todParams(S.hour); S.night = P.n; S.sleep = hasBird && (S.hour >= 23 || S.hour < sun.sr - 0.6); }
  if (!V.manual || s < V.t - 1e-9) { V.manual = true; seed = 20261003; V.t = 0; V.i0 = introEnabled ? 0 : -99; V.par = [0, 0]; parts.length = 0; leafCd = 5; ptr.on = false; resetBird(true); }
  const h = 1 / 120;
  while (V.t < s - 1e-9) step(Math.min(h, s - V.t));
  lastScr = ''; render();
  return V.t;
}

function setMode(m) {
  S.mode = m === 'live' ? 'live' : 'still';
  if (S.mode !== 'live') paintStatic();
  else if (!failed && !reduce && texReady) { root.classList.remove('is-static'); style(glc,'visibility',''); style(fxc,'visibility',''); render(); }
  schedule();
  tickStatic();
}
function setStatus(s) {
  const next = typeof s === 'string' ? { state: s } : s;
  if (!STATUS[next.state]) throw new TypeError('state 必须为 ok、warn 或 off');
  shared.status = { ...next }; S.status = next.state; paintStatus(); lastScr = '';
  if (!canAnimate()) paintStatic();
}
function setHour(h) { S.follow = false; S.fast = false; S.hour = ((Number(h) % 24) + 24) % 24; paintStatus(); lastScr = ''; if (!canAnimate()) paintStatic(); }
function setDaytime(mode) {
  const hour = {morning: sun.sr + .35, day: 12, evening: sun.ss + .25, night: 23.5}[mode];
  if (mode === 'cycle') { S.follow = false; S.fast = true; S.hour = shared.daytimeHour ?? S.hour; }
  else if (Number.isFinite(hour)) setHour(hour); else throw new TypeError('未知的时间选择');
  paintStatus(); lastScr = ''; if (!canAnimate()) paintStatic();
}
// cors=true：这张图要当 WebGL 贴图。素材在别的域名（例如 OSS）时，必须按跨域方式读取，
// 否则浏览器不许上传到显卡。只显示用的底图不加，这样能和首页原图共用同一份缓存。
function loadImage(src, cors = false) {
  return new Promise((resolve, reject) => { const im = new Image(); im.decoding = 'async'; if (cors) im.crossOrigin = 'anonymous';
    im.onload = () => { if (im.decode) im.decode().then(() => resolve(im), reject); else resolve(im); };
    im.onerror = () => reject(new Error('素材加载失败：' + src)); im.src = src;
  });
}
// 静态底图优先直接用首页自己那张图（同一个地址，浏览器不再下载第二次）；
// 那张图的比例和当前横竖版对不上、或还没有地址时，用配置里的底图。
async function basePlateURL() {
  const im = shared.plateImage;
  if (!im || im.tagName !== 'IMG') return A.plate;
  if (!im.complete) await new Promise(res => { im.addEventListener('load', res, { once: true }); im.addEventListener('error', res, { once: true }); setTimeout(res, 4000); });
  const src = im.currentSrc || im.src;
  if (src && im.naturalWidth && Math.abs(im.naturalWidth / im.naturalHeight - PW / PH) / (PW / PH) < 0.015) return src;
  return A.plate;
}
let loading = false, baseLoaded = false;
async function load() {
  if (loading || destroyed || failed || reduce || texReady || !baseLoaded) return;
  loading = true;
  try {
    // 原图先完成绘制，下一帧才请求鸟和去鸟底图。
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    originalPresented = true;
    if (destroyed || failed || reduce) return;
    const spriteEntries = hasBird ? Object.entries(A.sprites) : [];
    const loaded = await Promise.all([loadImage(hasBird ? A.plateNoBird : A.plate, true), ...spriteEntries.map(([, sp]) => loadImage(sp.src))]);
    if (destroyed || failed || reduce) return;
    spriteEntries.forEach(([key], i) => { imgs[key] = loaded[i + 1]; });
    buildPreserveMask(loaded[0]);
    const initialized = fx && await initGL(loaded[0]);
    if (destroyed || failed || reduce) return;
    if (!initialized) { stop('webgl-unavailable'); return; }
    layout();
    for (const k in imgs) fx.drawImage(imgs[k], 0, 0, 2, 2);
    fx.clearRect(0, 0, 4, 4);
    active = true; phase = 'live'; reason = null;
    introEnabled = shared.intro === true || (shared.intro !== false && !originalPresented);
    introReason = shared.intro === true ? 'explicit-on' : shared.intro === false ? 'explicit-off' : originalPresented ? 'image-already-visible' : 'early-mount';
    if (!V.manual) { V.i0 = introEnabled ? V.t : V.t - 99; resetBird(true); }
    root.classList.remove('is-static'); style(glc,'visibility',''); style(fxc,'visibility','');
    resetBudget(); render(); root.classList.add('is-ready'); schedule();
  } catch (e) { stop('asset-or-webgl-error', e); }
  finally {
    loading = false;
    if (!destroyed && !failed && !reduce && !texReady && baseLoaded) queueMicrotask(load);
  }
}
const ready = Promise.resolve().then(async () => {
  S.hour = hzHour(); layout(); paintStatus();
  listen(glc, 'webglcontextlost', e => { e.preventDefault(); stop('webgl-context-lost'); });
  listen(stage, 'pointermove', e => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (reduce || failed || shared.paused) return;
    const r = stage.getBoundingClientRect(), point = toWorld([(e.clientX-r.left)*PW/r.width,(e.clientY-r.top)*PH/r.height]); ptr.x=point[0];ptr.y=point[1]; ptr.on = true; ptr.moved = V.t;
    const h = birdHead(); stage.style.cursor = hasBird && !bird.hidden && S.mode === 'live' && Math.hypot(ptr.x - (h.x - 40 * bird.flip), ptr.y - (h.y + 50)) < 120 ? 'pointer' : '';
  });
  listen(stage, 'pointerleave', () => { ptr.on = false; stage.style.cursor = ''; });
  listen(stage, 'click', e => {
    if (reduce || failed || shared.paused) return;
    if (S.mode === 'live' && V.t - V.i0 < INTRO) { skipIntro(); return; }
    if (!hasBird || S.mode !== 'live') return;
    const r = stage.getBoundingClientRect(), point = toWorld([(e.clientX-r.left)*PW/r.width,(e.clientY-r.top)*PH/r.height]), x=point[0],y=point[1],h=birdHead();
    if (Math.hypot(x - (h.x - 40 * bird.flip), y - (h.y + 50)) < 130) sing(V.t);
  });
  try {
    const image = await loadImage(await basePlateURL()); if (destroyed) return;
    baseLoaded = true; base.src = image.src; paintStatic(); root.classList.add('is-ready');
    if (reduce) { phase = 'static'; reason = 'reduced-motion'; resetBird(false); paintStatic(); tickStatic(); }
    else { await load(); tickStatic(); }
  } catch (e) { stop('base-asset-error', e); root.classList.add('is-ready'); base.style.display = 'none'; }
});
function destroy() {
  if (destroyed) return; destroyed = true; phase = 'destroyed';
  if (raf) cancelAnimationFrame(raf); clearTimeout(staticTimer);
  cleanups.forEach(f => f());
  if (audio) audio.close().catch(() => {});
  if (gl && !gl.isContextLost()) {
    if (prog) gl.deleteProgram(prog); if (glTexture) gl.deleteTexture(glTexture); if(glPreserve)gl.deleteTexture(glPreserve); if (glBuffer) gl.deleteBuffer(glBuffer);
    const lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
  }
  ink.style.filter=originalPlateFilter;root.remove(); stage.style.cursor = '';
}
return { ready, destroy, pauseChanged, preferenceChanged, layout, setStatus,
  SPEED, S, V, bird, setMode, setHour, setDaytime, sing, startHop, seek, skipIntro, replay,
  play: () => { V.manual = false; resetGuard(2000); }, freeze: t => { S.frozen = t; resetGuard(2000); }, act: a => { bird.act = a; }, leaf: () => { leafCd = -1; },
  hasBird, diagnostics: () => ({phase, reason, paused: shared.paused, frames, maxFrame, fps, canvas:[glc.width, glc.height], dpr, daytime:{mode:shared.daytime || 'real',hour:S.hour,follow:S.follow,fast:S.fast},
    resolution: { css: [stage.clientWidth, stage.clientHeight], actualDpr: [glc.width / Math.max(1, stage.clientWidth), glc.height / Math.max(1, stage.clientHeight)],
      texture: textureSize.slice(), base: [base.naturalWidth, base.naturalHeight], baseSrc: base.currentSrc || base.src,
      staticProtection: preserveInfo, staticRegionSource: ink.currentSrc || ink.src, staticRegionNativeSize: [ink.naturalWidth, ink.naturalHeight], ambientGamma: lastGamma, limit: canvasLimit },
    intro:{enabled:introEnabled,reason:introReason},
    frameGuard:{intervals:guardGaps.length,windowMs:Math.round(guardSpan),medianIntervalMs:+guardMedian.toFixed(1),medianFPS:guardMedian?+(1000/guardMedian).toFixed(2):0,
      consecutiveLong:guardLong,rules:GUARD,scrollExcluded:performance.now()<shared.scrollingUntil,trigger:guardTrigger},errors:shared.errors.slice()})
  ,birdPoint: () => {const p=toImage([bird.x,bird.y-80]);return {x:p[0]*stage.clientWidth/PW,y:p[1]*stage.clientHeight/PH,world:[bird.x,bird.y],image:toImage([bird.x,bird.y])};}
};
}
function mount(container, options = {}) {
  if (typeof container === 'string') container = document.querySelector(container);
  if (!container || container.nodeType !== 1) throw new TypeError('mount 需要一个容器元素');
  if (container.__heroLive) container.__heroLive.destroy();
  const plateImage = typeof options.plateImage === 'string' ? container.querySelector(options.plateImage) : options.plateImage || null;
  const shared = {status:options.status ? validateStatus(options.status) : {...status}, reduced:matchMedia('(prefers-reduced-motion: reduce)').matches, paused:document.hidden, scrollingUntil:0, errors:[], plateImage, intro:options.intro};
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let scene = null, config = null, orientation = null, destroyed = false, token = 0;
  let intersection = true;
  const originalPosition = container.style.position;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  const choose = () => container.clientHeight > container.clientWidth && config.portrait ? 'portrait' : 'landscape';
  const resolveAssets = (variant, baseURL) => {
    const url = value => value ? new URL(value, baseURL).href : null;
    const sprites = {}; for (const [k, sp] of Object.entries(config.sprites || {})) sprites[k] = {...sp, src:url(sp.src || sp.file)};
    return {...variant, plate:url(variant.plate), plateNoBird:url(variant.plateNoBird), sprites};
  };
  let assetBase = document.baseURI;
  async function refresh() {
    if (!config || destroyed) return;
    const next = choose(); if (next === orientation && scene) { scene.layout(); return; }
    orientation = next; const current = ++token;
    if (scene) scene.destroy();
    try { scene = createScene(container, resolveAssets(config[next], assetBase), config, shared); await scene.ready; if (shared.daytime) scene.setDaytime(shared.daytime); }
    catch (e) { shared.errors.push(String(e.message || e)); }
    if (current !== token || destroyed) return;
  }
  function pauseChanged() { shared.paused = document.hidden || !intersection; if (scene) scene.pauseChanged(); }
  function preferenceChanged() { shared.reduced = media.matches; if (scene) scene.preferenceChanged(); }
  function scrollChanged() { shared.scrollingUntil = performance.now()+1500; }
  document.addEventListener('visibilitychange', pauseChanged);
  global.addEventListener('scroll',scrollChanged,{capture:true,passive:true});
  media.addEventListener('change', preferenceChanged);
  const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => { intersection = entries[0].isIntersecting; pauseChanged(); }) : null;
  if (observer) observer.observe(container);
  const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { refresh(); }) : null;
  if (resize) resize.observe(container); else global.addEventListener('resize', refresh);
  const ready = Promise.resolve().then(async () => {
    try {
      if (options.landscape) { config = {...options}; assetBase = options.assetBase || document.baseURI; }
      else if (options.config && typeof options.config === 'object') { config = {...options.config, preview:options.preview}; assetBase = options.assetBase || document.baseURI; }
      else { const url = new URL(options.configUrl || (typeof options.config === 'string' ? options.config : defaultConfigURL), document.baseURI); const response = await fetch(url, { mode: 'cors', credentials: 'omit' }); if (!response.ok) throw new Error('配置读取失败'); config = {...await response.json(), preview:options.preview}; assetBase = options.assetBase || url.href; }
      if (!config.landscape || !config.landscape.plate) throw new Error('缺少横版底图配置');
      await refresh();
    } catch (e) { shared.errors.push(String(e.message || e)); }
    return api;
  });
  const api = {ready, destroy() {
    if (destroyed) return; destroyed = true; ++token;
    if (scene) scene.destroy(); if (observer) observer.disconnect(); if (resize) resize.disconnect(); else global.removeEventListener('resize', refresh);
    document.removeEventListener('visibilitychange',pauseChanged); global.removeEventListener('scroll',scrollChanged,true); media.removeEventListener('change',preferenceChanged);
    container.style.position = originalPosition; if (container.__heroLive === api) delete container.__heroLive; mounts.delete(api);
  }, diagnostics() { return {...(scene ? scene.diagnostics() : {phase:destroyed?'destroyed':'static',reason:'config-error',errors:shared.errors.slice()}),orientation}; },
  _status(next) {shared.status = next; if(scene) scene.setStatus(next);},
  setDaytime(mode) { if (scene) { scene.setDaytime(mode); shared.daytimeHour = scene.S.hour; } shared.daytime = mode; }
  };
  if (options.preview) {
    for (const key of ['S','V','bird','SPEED','hasBird']) Object.defineProperty(api,key,{get:()=>scene && scene[key]});
    for (const key of ['setMode','setHour','sing','startHop','seek','skipIntro','replay','play','freeze','act','leaf','birdPoint']) api[key] = (...args) => scene && scene[key](...args);
    api.setStatus = value => api._status(validateStatus(typeof value === 'string' ? {state:value} : value));
    api.isReady = () => !!scene && ['live','static'].includes(scene.diagnostics().phase);
  }
  container.__heroLive = api; mounts.add(api); return api;
}
global.HeroLive = Object.freeze({ mount, setStatus(value) {status=validateStatus(value); mounts.forEach(api=>api._status({...status}));} });
})(window);

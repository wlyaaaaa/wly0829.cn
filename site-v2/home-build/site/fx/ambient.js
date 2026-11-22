/*
 * 阳光、云、雾、浮尘和花瓣（wly0829.cn 首页第一屏）
 *
 * 用法：
 *   var amb = WlyAmbient.mount(container, { image: imgOrUrl, mist: 3, dust: 3, speed: 4.5, petals: 1, bootSeconds: 4 });
 *   amb.set({ mist: 2, dust: 2, petals: 0 });   // 运行中改
 *   amb.pause(); amb.resume(); amb.destroy();
 *
 * mist：雾的浓度（光学厚度，成正比，不封顶），0 关掉，默认 3。
 * dust：浮尘的多少，每 1 是 70 粒，0 关掉，默认 3（210 粒），最大 4。
 * speed：雾、浮尘、花瓣一起变快变慢（就是播放倍速），默认 4.5。阳光和云的节奏不跟它。
 * petals：樱花花瓣的多少，0 关掉，1 是默认（10 片轮着飘，同一时刻四五片），最大 2。
 * clouds：标题后面那片云流动、翻涌的幅度，0 关掉，1 是默认。
 * sun：阳光变化的幅度，0 关掉（光和原画一样不动），1 是默认。
 * bootSeconds：挂上以后用几秒从无到有淡入（开机感），默认 4，0 表示不要。amb.boot() 重放一次。
 * resolution：左上那块画布每个原图像素画几个点，默认 1（和瀑布模块同一个意思）。
 *
 * container：和整幅画一样大的定位容器（position 不是 static），和瀑布模块同一个规矩。
 * 模块在里面放一层透明的东西，位置、大小全用百分比，所以容器被 CSS transform
 * 整体缩放、平移时不用任何同步。画的文件不碰，把这一层拿掉就是原画。
 *
 * 两部分：
 * 一、左上那一块（阳光、云、云脚的雾）是一张画布，用原画自己的像素算，每秒画 30 次：
 *   云   画上的云拆成“大块明暗和斜光”（不动）加“云的细节”（顺着一张缓缓变化的流场走，两份错开半拍交替，
 *        哪一份走远了就悄悄换回来，各处换的时刻错开）。只动像云的地方（亮、不鲜艳、不偏粉），树叶、花、机箱不动。
 *   阳光 画上原有的那几道斜光被单独取出来，一道道各自明暗，整体跟着“太阳”缓缓强弱；另有几道很宽很淡的光慢慢扫；
 *        左上树叶缝里的小亮点一小片一小片各闪各的。
 *   雾   云脚的雾远近两层往右飘，躲在樱花、盆景这些前景后面；光照到的地方发暖发亮。
 * 二、其余全是网页元素，交给浏览器的合成线程，不跑脚本：
 *   水面的雾（两层往左漫）、浮尘（远中近三种大小）、花瓣（边飘边翻，一半落到水面）。
 *   浮尘和花瓣的明暗跟着“太阳”走一点。
 * 页面不可见或滚出屏幕时暂停（动效一直开着，不做“减少动态”适配）。
 *
 * image：原画（<img> 或地址）。画布要读它的像素，所以本地 file:// 下要用能读的来源（和瀑布一样）。
 * 读不了或没有 WebGL2 时，左上那一块退回原画，水面的雾、浮尘、花瓣照常。
 */
(function (global) {
  'use strict';

  var BW = 1672, BH = 941;                  // 位置都按这张定稿图量
  var DEFAULT_PARAMS = { mist: 4, dust: 4, speed: 6, petals: 1, clouds: 2, sun: 2 };   // 本人 2026-11-13 12:49 定稿：云雾 4.00 · 浮尘 4.00 · 快慢 6.00 · 云动 2.00 · 阳光 2.00 · 花瓣 开   // 本人 2026-11-13 12:25：在 2 / 2 / 3 上再强一半
  var DEFAULT_BOOT = 4;
  var DUST_BASE = 70, DUST_MAX = 4, PETAL_BASE = 10, PETAL_MAX = 2;
  var CELL_W = BW / 100, CELL_H = BH / 100; // 浮尘、花瓣外壳的大小（画的 1%），位移用它的百分比表示
  var SUN = [-760, -1310];                  // 斜光的来处（画外左上很远，画上的光几乎平行，略微散开）
  var SKY = [-14, -14, 714, 634];           // 左上那张画布盖的范围 x,y,w,h（左、上各伸出画外一点，羽化的边落在画外）

  // 水面的雾：贴着对岸水线的一带，像瀑布的水汽贴着水面往左漫；小桥两边的树丛前各有淡淡一片。让开小桥和小船。
  var WATER = {
    box: [300, 590, 780, 210],
    zone: [[650, 736, 310, 36, 1], [575, 692, 80, 32, .5], [935, 676, 110, 40, .55]],
    layers: [
      { span: 2, tile: [512, 64], lat: [6, 3], warp: .22, lo: .48, hi: .66, color: [246, 251, 255], alpha: .9, period: 120, bob: [3, 15], breathe: [.7, 12], seed: 2011 },
      { span: 2, tile: [512, 64], lat: [8, 4], warp: .28, lo: .5, hi: .68, color: [250, 253, 255], alpha: .75, period: 78, bob: [2, 10], breathe: [.66, 8], seed: 3301 }
    ]
  };

  // 浮尘出现的几块地方 [x,y,w,h,占比]：光柱下半截和云脚、船屋一带、显卡底下到小桥、水面上、左上树叶间的光里、标题背后
  var DUST_ZONES = [
    [30, 400, 540, 215, .3],
    [110, 560, 540, 210, .22],
    [540, 585, 480, 175, .18],
    [300, 740, 700, 160, .08],
    [10, 20, 420, 150, .1],
    [40, 170, 500, 230, .12]
  ];

  var VERT = '#version 300 es\n' +
    'in vec2 aPos; out vec2 vUv;\n' +
    'void main(){ vUv = vec2(aPos.x*0.5+0.5, 0.5-aPos.y*0.5); gl_Position = vec4(aPos,0.,1.); }\n';

  var COMMON = '#version 300 es\n' +
    'precision highp float;\n' +
    'uniform sampler2D uImg;\n' +
    'uniform vec2 uBasis;\n' +
    'uniform vec4 uRect;\n' +
    'uniform vec2 uSun;\n' +
    'in vec2 vUv; out vec4 o;\n' +
    'vec3 img(vec2 P){ return textureLod(uImg, P/uBasis, 0.).rgb; }\n' +
    'vec2 fq(vec2 P){ vec2 l=(P-uRect.xy)/uRect.zw; return vec2(l.x, 1.-l.y); }\n';

  // 一次性：顺着光的方向抹匀——留下大块明暗和一道道斜光，云的细节抹掉
  var FRAG_ALONG = COMMON +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  vec2 r=normalize(P-uSun);\n' +
    '  vec3 acc=vec3(0.); float ws=0.;\n' +
    '  for(int i=-18;i<=18;i++){ float fi=float(i); float w=exp(-fi*fi/110.); acc+=w*img(P+r*fi*5.); ws+=w; }\n' +
    '  o=vec4(acc/ws,1.);\n' +
    '}\n';

  // 一次性：再横着光的方向抹匀——斜光也抹掉，只剩大块明暗。两张一减就是画上的斜光
  var FRAG_ACROSS = COMMON +
    'uniform sampler2D uL;\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  vec2 r=normalize(P-uSun); vec2 n=vec2(-r.y,r.x);\n' +
    '  vec3 acc=vec3(0.); float ws=0.;\n' +
    '  for(int i=-18;i<=18;i++){ float fi=float(i); float w=exp(-fi*fi/110.); acc+=w*texture(uL,fq(P+n*fi*4.)).rgb; ws+=w; }\n' +
    '  o=vec4(acc/ws,1.);\n' +
    '}\n';

  var FRAG_MAIN = COMMON +
    'uniform sampler2D uL, uB, uNoise;\n' +
    'uniform vec4 uTime;\n' +   // x 阳光用的时间，y 云流动的时间，z 雾飘的时间，w 太阳此刻的强弱 0~1
    'uniform vec4 uAmt;\n' +    // x 雾的浓度，y 云流动的幅度，z 阳光变化的幅度，w 调试
    'float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return texture(uNoise,(i+f+.5)/256.).r; }\n' +
    'float fbm(vec2 p){ return vn(p)*.5+vn(p*2.03+17.3)*.27+vn(p*4.1+41.7)*.15+vn(p*8.3+7.1)*.08; }\n' +
    'float ell(vec2 P,vec2 c,vec2 r){ return length((P-c)/r); }\n' +
    'float lum(vec3 c){ return dot(c,vec3(.299,.587,.114)); }\n' +
    // 像云、像薄雾的地方（亮、不鲜艳、不偏粉）是 1；树叶、花、树枝、深色的字是 0
    'float haze(vec3 c){ return (1.-smoothstep(.13,.30,c.g-c.b))*(1.-smoothstep(.09,.21,c.r-c.g))*smoothstep(.42,.6,lum(c)); }\n' +
    'float hazeAt(vec2 P){ return haze(textureLod(uImg,P/uBasis,1.5).rgb); }\n' +
    // 云堆的范围：右边到机箱立板为止，上边到云顶为止
    'float cloudGeo(vec2 P){ return (1.-smoothstep(.72,1.,ell(P,vec2(255.,300.),vec2(335.,178.))))*(1.-smoothstep(500.,530.,P.x))*smoothstep(140.,186.,P.y); }\n' +
    'float cloudM(vec2 P){ return cloudGeo(P)*hazeAt(P); }\n' +
    // 流场：整体慢慢往右，各处快慢、升降不一样，而且在缓缓变——看上去就是翻涌
    'vec2 flowV(vec2 P,float t){\n' +
    '  vec2 q=P*.0042;\n' +
    '  float a=vn(q+vec2(t*.021,3.7)), b=vn(q*1.7+vec2(11.3,-t*.017));\n' +
    '  return vec2(11.+9.*(a-.5), -2.5+14.*(b-.5));\n' +
    '}\n' +
    // 几道很宽很淡的光，中心角慢慢扫、各自明暗
    'float beams(float th,float t){\n' +
    '  float a=0.;\n' +
    '  for(int i=0;i<4;i++){ float fi=float(i);\n' +
    '    float c=51.5+fi*4.3+2.2*sin(t*(.11+.03*fi)+fi*2.1);\n' +
    '    float w=1.+.45*sin(fi*1.7+.5);\n' +
    '    float k=.5+.5*sin(t*(.23+.05*fi)+fi*1.3);\n' +
    '    float x=(th-c)/w; a+=exp(-x*x)*(.35+.65*k);\n' +
    '  }\n' +
    '  return a;\n' +
    '}\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  float t=uTime.x, sun=uTime.w;\n' +
    '  vec3 c0=img(P);\n' +
    '  vec2 q0=fq(P);\n' +
    '  vec3 Lc=texture(uL,q0).rgb, Bc=texture(uB,q0).rgb;\n' +
    '  float hz=hazeAt(P);\n' +
    // 1) 云：细节顺着流场走，两份错开半拍交替
    '  vec3 det=c0-Lc;\n' +
    '  float cg=cloudGeo(P), mm=0.;\n' +
    '  if(cg>.002 && uAmt.y>.001){\n' +
    '    const float T=6.;\n' +
    '    float ph=uTime.y/T+vn(P*.004)*.6;\n' +   // 各处换的时刻错开一点（错得太碎云会被扯花）
    '    float f1=fract(ph), f2=fract(ph+.5);\n' +
    '    float w1=1.-abs(2.*f1-1.);\n' +
    '    vec2 v=flowV(P,t)*uAmt.y;\n' +
    '    vec2 P1=P-v*(f1-.5)*T, P2=P-v*(f2-.5)*T;\n' +
    '    float wa=w1*cloudM(P1), wb=(1.-w1)*cloudM(P2);\n' +
    '    vec3 dA=img(P1)-texture(uL,fq(P1)).rgb, dB=img(P2)-texture(uL,fq(P2)).rgb;\n' +
    '    vec3 dF=(dA*wa+dB*wb)/max(sqrt(wa*wa+wb*wb),.001);\n' +
    '    mm=cg*hz*smoothstep(0.,.3,wa+wb);\n' +
    '    det=mix(det,dF,mm);\n' +
    '  }\n' +
    '  vec3 col=Lc+det;\n' +
    // 2) 画上原有的斜光：一道道各自明暗，整体跟着太阳
    '  vec2 dv=P-uSun;\n' +
    '  float th=degrees(atan(dv.y,dv.x));\n' +
    '  vec3 Rp=max(Lc-Bc,0.);\n' +
    '  float rn=vn(vec2(th*1.1+t*.05,t*.09));\n' +
    '  float g=1.+((.3+1.5*sun)*(.55+.9*rn)-1.)*uAmt.z;\n' +
    '  float fall=1.-smoothstep(.72,1.,ell(P,vec2(230.,300.),vec2(470.,360.)));\n' +
    '  vec3 dl=Rp*(g-1.)*hz*fall;\n' +
    '  col+=min(dl,0.)+max(dl,0.)*vec3(1.,.94,.8)*1.3;\n' +
    // 3) 慢慢扫动的几道大光：在雾气和云上显，前景上很淡
    '  float bl=beams(th,t)*(.25+.75*sun)*uAmt.z*fall;\n' +
    '  col+=(1.-col)*(1.-exp(-bl*(.22+.5*hz)*vec3(1.,.93,.76)));\n' +
    // 4) 树叶缝里漏下来的光点：一小片一小片各闪各的，像树叶在晃
    '  float leaf=1.-smoothstep(.6,1.,ell(P,vec2(140.,105.),vec2(215.,165.)));\n' +
    '  if(leaf>.002){\n' +
    '    vec3 sp=max(c0-textureLod(uImg,P/uBasis,2.5).rgb,0.);\n' +
    '    vec2 cell=P/13.;\n' +
    '    float k=smoothstep(.42,.82,vn(cell+vec2(t*.9,-t*.6))*.65+vn(cell*.37+vec2(-t*.25,t*.31))*.35);\n' +
    '    float sl=(.35+.9*sun)*uAmt.z;\n' +
    '    col+=sp*leaf*(k*2.6-.9)*sl;\n' +
    '    float gap=smoothstep(.8,.97,lum(textureLod(uImg,P/uBasis,1.).rgb));\n' +
    '    col+=(1.-col)*gap*leaf*k*.4*sl*vec3(1.,.95,.75);\n' +
    '  }\n' +
    // 5) 云脚的雾：远近两层往右飘，躲在前景后面，光照到的地方发暖发亮
    // 标题后面那片云上只留薄薄一层，免得把会动的云糊住
    '  float zone=max(1.-smoothstep(.25,1.,ell(P,vec2(270.,505.),vec2(380.,112.))), .26*(1.-smoothstep(.3,1.,ell(P,vec2(300.,300.),vec2(330.,165.)))));\n' +
    '  if(zone>.002 && uAmt.x>.001){\n' +
    '    float mt=uTime.z;\n' +
    '    vec2 p1=vec2(P.x-mt*13., P.y+6.*sin(mt*.37))*vec2(.0026,.0052);\n' +
    '    vec2 p2=vec2(P.x-mt*21., P.y+4.*sin(mt*.55+1.))*vec2(.0041,.0105);\n' +
    '    float n1=fbm(p1+.9*vec2(vn(p1*1.3+5.),vn(p1*1.3+31.)));\n' +
    '    float n2=fbm(p2+37.1+.8*vec2(vn(p2*1.2+9.),vn(p2*1.2+57.)));\n' +
    '    float d=smoothstep(.44,.7,n1)+.8*smoothstep(.47,.72,n2);\n' +
    '    float am=(1.-exp(-d*zone*uAmt.x*.625))*(.12+.88*hz);\n' +
    '    float lit=clamp(bl*1.1+lum(Rp)*g*4.,0.,1.);\n' +
    '    vec3 mc=mix(vec3(.985,.975,.965),vec3(1.,.965,.86),lit);\n' +
    '    am=min(1.,am*(1.+.45*lit));\n' +
    '    col=mix(col,mc,am);\n' +
    '  }\n' +
    '  if(uAmt.w>.5){ col=mix(col,vec3(1.,0.,0.),mm*.5); }\n' +
    '  vec2 ed=min(vUv,1.-vUv)*uRect.zw;\n' +
    '  float a=smoothstep(0.,12.,min(ed.x,ed.y));\n' +
    '  o=vec4(clamp(col,0.,1.)*a,a);\n' +
    '}\n';

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function f(v) { return (Math.round(v * 1000) / 1000).toString(); }
  function smooth(a, b, x) { x = (x - a) / (b - a); x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function el(tag, css) { var e = document.createElement(tag); e.style.cssText = css; return e; }
  var FULL = 'position:absolute;left:0;top:0;width:100%;height:100%;';
  function boxCss(b) {
    return 'position:absolute;left:' + f(b[0] / BW * 100) + '%;top:' + f(b[1] / BH * 100) + '%;width:' +
      f(b[2] / BW * 100) + '%;height:' + f(b[3] / BH * 100) + '%;';
  }

  // “太阳”此刻的强弱 0~1：两个慢周期叠起来，像有云飘过太阳。不跟 speed
  function sunLevel(t) {
    var x = .5 + .5 * (.62 * Math.sin(t * 2 * Math.PI / 8.5 + 1.3) + .38 * Math.sin(t * 2 * Math.PI / 21 + 4.1));
    return x * x * (3 - 2 * x);
  }

  // 左右、上下都接得上的柔和噪声：u、v 以“一张纹理”为 1
  function makeFbm(gx, gy, oct, rnd) {
    var lats = [];
    for (var o = 0; o < oct; o++) {
      var nx = gx * Math.pow(2, o), ny = gy * Math.pow(2, o), lat = new Float32Array(nx * ny);
      for (var i = 0; i < lat.length; i++) lat[i] = rnd();
      lats.push({ nx: nx, ny: ny, lat: lat });
    }
    return function (u, v) {
      var s = 0, amp = .5, norm = 0;
      for (var o = 0; o < lats.length; o++) {
        var L = lats[o], fx = u * L.nx, fy = v * L.ny;
        var ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
        ix = ((ix % L.nx) + L.nx) % L.nx; iy = ((iy % L.ny) + L.ny) % L.ny;
        var ix1 = (ix + 1) % L.nx, iy1 = (iy + 1) % L.ny;
        tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
        var a = L.lat[iy * L.nx + ix], b = L.lat[iy * L.nx + ix1], c = L.lat[iy1 * L.nx + ix], d = L.lat[iy1 * L.nx + ix1];
        s += amp * (a + (b - a) * tx + (c - a + (a - b - c + d) * tx) * ty);
        norm += amp; amp *= .5;
      }
      return s / norm;
    };
  }

  // 一张雾纹理（横着放两份，横移一份的宽度正好接上）。base 记着浓度为 2 时每个点有多浓，换浓度时照它重填
  function mistTex(L) {
    var tw = L.tile[0], th = L.tile[1], rnd = mulberry32(L.seed);
    var base = makeFbm(L.lat[0], L.lat[1], 5, rnd), bend = makeFbm(2 * L.span, 2, 2, rnd);
    var c = document.createElement('canvas');
    c.width = tw * 2; c.height = th;
    var a = new Float32Array(tw * th), k = 0;
    for (var y = 0; y < th; y++) {
      var v = y / th, ev = Math.min(1, Math.min(v, 1 - v) / .14);
      ev = ev * ev * (3 - 2 * ev);                       // 上下两条边淡到没有
      for (var x = 0; x < tw; x++) {
        var u = x / tw;
        var n = base(u + L.warp / L.span * (bend(u, v) - .5), v + L.warp * 1.6 * (bend(u + .413, v + .271) - .5));
        a[k++] = Math.min(.985, smooth(L.lo, L.hi, n) * ev);
      }
    }
    c.style.cssText = 'position:absolute;left:0;top:-10%;width:' + (200 * L.span) + '%;height:120%;display:block;';
    return { canvas: c, base: a, tw: tw, th: th, color: L.color };
  }
  // 浓度按光学厚度算：浓度 k 时每个点 = 1 − (1 − 浓度 2 时的值)^(k/2)，所以 3 比 2 厚一半，不会被封顶截住
  function paintMist(T, k) {
    var g = T.canvas.getContext('2d'), im = g.createImageData(T.tw, T.th), px = im.data, e = k / 2;
    for (var i = 0, j = 0; i < T.base.length; i++) {
      px[j++] = T.color[0]; px[j++] = T.color[1]; px[j++] = T.color[2];
      px[j++] = Math.round(255 * (1 - Math.pow(1 - T.base[i], e)));
    }
    g.putImageData(im, 0, 0); g.putImageData(im, T.tw, 0);
  }

  // 几个羽化椭圆合成的范围
  function zoneImg(zone, box) {
    return zone.map(function (e) {
      var cx = (e[0] - box[0]) / box[2] * 100, cy = (e[1] - box[1]) / box[3] * 100;
      var rx = e[2] / box[2] * 100, ry = e[3] / box[3] * 100, p = e[4];
      return 'radial-gradient(ellipse ' + f(rx) + '% ' + f(ry) + '% at ' + f(cx) + '% ' + f(cy) + '%,rgba(0,0,0,' + f(p) +
        ') 0%,rgba(0,0,0,' + f(p * .74) + ') 38%,rgba(0,0,0,' + f(p * .3) + ') 70%,rgba(0,0,0,0) 100%)';
    }).join(',');
  }

  // 一片樱花瓣（画一次，所有花瓣共用）；warm 是被阳光照亮时叠上去的那一层
  function petalUrl(warm) {
    try {
      var c = document.createElement('canvas'); c.width = c.height = 64;
      var g = c.getContext('2d');
      // 瘦长的一片，尖头朝下、顶上是圆的（这么小的花瓣带缺口会像爱心，所以不画缺口）
      g.beginPath(); g.moveTo(32, 62);
      g.bezierCurveTo(16, 52, 4, 36, 9, 19); g.bezierCurveTo(13, 7, 24, 3, 32, 3);
      g.bezierCurveTo(40, 3, 51, 7, 55, 19); g.bezierCurveTo(60, 36, 48, 52, 32, 62); g.closePath();
      var gr = g.createRadialGradient(32, 57, 2, 32, 34, 34);
      if (warm) { gr.addColorStop(0, 'rgba(255,214,190,.9)'); gr.addColorStop(1, 'rgba(255,250,232,.95)'); }
      else { gr.addColorStop(0, 'rgba(255,108,158,.98)'); gr.addColorStop(.45, 'rgba(255,168,198,.97)'); gr.addColorStop(1, 'rgba(255,224,235,.96)'); }
      g.fillStyle = gr; g.fill();
      if (!warm) { g.strokeStyle = 'rgba(232,92,142,.5)'; g.lineWidth = 1.6; g.stroke(); }   // 细细一圈深一点的边，在浅色的画上才分得出来
      return c.toDataURL('image/png');
    } catch (e) { return ''; }
  }

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('shader: ' + log);
    }
    return s;
  }
  function program(gl, fragSrc) {
    var p = gl.createProgram();
    var vs = compile(gl, gl.VERTEX_SHADER, VERT), fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
    gl.attachShader(p, vs); gl.attachShader(p, fs);
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    gl.deleteShader(vs); gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p));
    return p;
  }

  function mount(container, opts) {
    opts = opts || {};
    var fixed = (opts.time != null), t0 = fixed ? +opts.time : 0;
    function num(v, d) { return v == null || !isFinite(+v) ? d : +v; }
    var par = {};
    Object.keys(DEFAULT_PARAMS).forEach(function (k) { par[k] = num(opts[k], DEFAULT_PARAMS[k]); });
    var bootSeconds = Math.max(0, num(opts.bootSeconds, DEFAULT_BOOT));
    var res = num(opts.resolution, 1);
    var root = el('div', FULL + 'overflow:hidden;pointer-events:none;contain:layout paint style;');
    root.className = 'wly-ambient';
    root.setAttribute('aria-hidden', 'true');
    var fade = el('div', FULL), mistRoot = el('div', FULL), dustRoot = el('div', FULL), petalRoot = el('div', FULL);
    var sky = document.createElement('canvas');
    sky.width = Math.round(SKY[2] * res); sky.height = Math.round(SKY[3] * res);
    sky.style.cssText = boxCss(SKY) + 'display:block;';
    fade.appendChild(sky); fade.appendChild(mistRoot); fade.appendChild(dustRoot); fade.appendChild(petalRoot); root.appendChild(fade);
    // 首页把重画原画的云层单独放在其他动效下面；独立小样仍用原来的层次。
    var skyFade = opts.skyContainer ? el('div', FULL) : null, skyBoot = null;
    if (skyFade) { skyFade.appendChild(sky); opts.skyContainer.appendChild(skyFade); }

    var mistTexes = [], mistAnims = [], motes = [], petals = [], bootAnim = null, petalImg = '', petalWarm = '';
    var wantRun = !fixed, visible = true, ready = false, destroyed = false, io = null;
    var gl = null, prog = null, uTime = null, uAmt = null, glRes = [], imgEl = null, skyOn = false, raf = 0, looping = false, last = 0;
    var clock = { sun: t0, flow: t0, mist: t0 * par.speed };

    function rate(a) {
      var r = Math.max(.05, par.speed);
      if (a.updatePlaybackRate) a.updatePlaybackRate(r); else a.playbackRate = r;
    }
    function track(list, a) {
      list.push(a);
      if (fixed) { a.pause(); a.currentTime = t0 * 1000; }
      else { if (par.speed !== 1) rate(a); if (!shouldRun()) a.pause(); }
      return a;
    }
    function shouldRun() { return wantRun && visible && !document.hidden && !destroyed && !fixed; }
    function each(fn) {
      mistAnims.forEach(fn);
      motes.forEach(function (m) { m.anims.forEach(fn); });
      petals.forEach(function (m) { m.anims.forEach(fn); });
    }
    function apply() {
      var run = shouldRun();
      each(function (a) { if (run) a.play(); else a.pause(); });
      if (bootAnim && bootAnim.playState !== 'finished') { if (run) bootAnim.play(); else bootAnim.pause(); }
      if (skyBoot && skyBoot.playState !== 'finished') { if (run) skyBoot.play(); else skyBoot.pause(); }
      if (run && skyOn) startLoop(); else stopLoop();
    }
    function loop(node, frames, seconds, phase, extra) {
      var o = { duration: seconds * 1000, iterations: Infinity, delay: -phase * seconds * 1000 };
      if (extra) { o.direction = 'alternate'; o.easing = 'ease-in-out'; o.delay *= 2; }
      return node.animate(frames, o);
    }

    // ---------- 开机感：从无到有 ----------
    function boot() {
      if (bootAnim) { bootAnim.cancel(); bootAnim = null; }
      if (skyBoot) { skyBoot.cancel(); skyBoot = null; }
      if (!(bootSeconds > 0) || !fade.animate) return;
      bootAnim = fade.animate([{ opacity: 0 }, { opacity: .5, offset: .45 }, { opacity: 1 }], { duration: bootSeconds * 1000, easing: 'ease-out', fill: 'both' });
      if (fixed) { bootAnim.pause(); bootAnim.currentTime = t0 * 1000; }
      else if (!shouldRun()) bootAnim.pause();
      if (skyFade) {
        skyBoot = skyFade.animate(bootAnim.effect.getKeyframes(), bootAnim.effect.getTiming());
        skyBoot.startTime = bootAnim.startTime;
        if (fixed || !shouldRun()) { skyBoot.pause(); skyBoot.currentTime = bootAnim.currentTime; }
      }
    }

    // ---------- 左上那张画布：阳光、云、云脚的雾 ----------
    function initGL() {
      gl = sky.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: fixed });
      if (!gl) throw new Error('WebGL2 不可用');
      glRes = [];
      var quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
      function tex(unit, w, h, data, filterMin, wrap) {
        var tx = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tx);
        if (data && data.tagName) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
        else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data || null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMin);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
        glRes.push(tx);
        return tx;
      }
      tex(0, 0, 0, imgEl, gl.LINEAR_MIPMAP_LINEAR, gl.CLAMP_TO_EDGE);
      gl.generateMipmap(gl.TEXTURE_2D);
      var W = sky.width, H = sky.height;
      var tL = tex(1, W, H, null, gl.LINEAR, gl.CLAMP_TO_EDGE), tB = tex(2, W, H, null, gl.LINEAR, gl.CLAMP_TO_EDGE);
      var rnd = mulberry32(8290829), nz = new Uint8Array(256 * 256 * 4);
      for (var i = 0; i < nz.length; i++) nz[i] = (rnd() * 256) | 0;
      tex(3, 256, 256, nz, gl.LINEAR, gl.REPEAT);
      function common(p) {
        gl.useProgram(p);
        gl.uniform1i(gl.getUniformLocation(p, 'uImg'), 0);
        gl.uniform2f(gl.getUniformLocation(p, 'uBasis'), BW, BH);
        gl.uniform4f(gl.getUniformLocation(p, 'uRect'), SKY[0], SKY[1], SKY[2], SKY[3]);
        gl.uniform2f(gl.getUniformLocation(p, 'uSun'), SUN[0], SUN[1]);
      }
      var fb = gl.createFramebuffer();
      gl.viewport(0, 0, W, H);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      var pA = program(gl, FRAG_ALONG);
      common(pA);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tL, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      var pB = program(gl, FRAG_ACROSS);
      common(pB);
      gl.uniform1i(gl.getUniformLocation(pB, 'uL'), 1);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tB, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fb);
      gl.deleteProgram(pA); gl.deleteProgram(pB);
      prog = program(gl, FRAG_MAIN);
      common(prog);
      gl.uniform1i(gl.getUniformLocation(prog, 'uL'), 1);
      gl.uniform1i(gl.getUniformLocation(prog, 'uB'), 2);
      gl.uniform1i(gl.getUniformLocation(prog, 'uNoise'), 3);
      uTime = gl.getUniformLocation(prog, 'uTime');
      uAmt = gl.getUniformLocation(prog, 'uAmt');
      gl.viewport(0, 0, W, H);
    }
    function drawSky() {
      var s = par.sun > 0 ? sunLevel(clock.sun) : .47;
      // 浮尘、花瓣跟着太阳亮一点暗一点
      dustRoot.style.opacity = f(1 - .3 * Math.min(1, par.sun) * (1 - s));
      petalRoot.style.setProperty('--sun', f(.15 + .55 * s));
      if (!gl || !prog) return;
      gl.uniform4f(uTime, clock.sun % 7200, clock.flow % 7200, clock.mist % 14400, s);
      gl.uniform4f(uAmt, Math.max(0, par.mist), Math.max(0, par.clouds), Math.max(0, par.sun), opts.debug ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function frame(now) {
      if (!looping) return;
      raf = requestAnimationFrame(frame);
      var dt = (now - last) / 1000;
      if (dt < 1 / 34) return;                       // 这一块每秒 30 次就够，云和光都慢
      last = now;
      dt = Math.max(0, dt);
      clock.sun += dt; clock.flow += dt; clock.mist += dt * par.speed;
      if (opts.drawFrame) opts.drawFrame(now, drawSky); else drawSky();
    }
    function startLoop() { if (looping) return; looping = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    function stopLoop() { looping = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    function skyFail(err) {
      skyOn = false; stopLoop(); sky.style.display = 'none';
      if (global.console) console.warn('[ambient] 左上那一块退回原画：', err && err.message || err);
    }
    function onLost(e) { e.preventDefault(); stopLoop(); skyOn = false; prog = null; }
    function onRestored() { try { initGL(); skyOn = true; drawSky(); apply(); } catch (err) { skyFail(err); } }
    function beginSky() {
      if (destroyed) return;
      try { initGL(); skyOn = true; drawSky(); } catch (err) { skyFail(err); return; }
      sky.addEventListener('webglcontextlost', onLost, false);
      sky.addEventListener('webglcontextrestored', onRestored, false);
      apply();
    }

    // ---------- 水面的雾 ----------
    function buildWater() {
      var ph = mulberry32(8290829), img = zoneImg(WATER.zone, WATER.box);
      var box = el('div', boxCss(WATER.box) + 'overflow:hidden;-webkit-mask-image:' + img + ';mask-image:' + img + ';');
      WATER.layers.forEach(function (L) {
        var wrap = el('div', FULL), T = mistTex(L);
        mistTexes.push(T);
        wrap.appendChild(T.canvas); box.appendChild(wrap);
        // 横移：整张纹理往左走一张的宽度，首尾相接
        track(mistAnims, loop(T.canvas, [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], L.period, ph()));
        // 上下起伏和浓淡变化，两层周期不同，免得看出循环
        track(mistAnims, loop(wrap, [{ transform: 'translateY(-' + L.bob[0] + '%)' }, { transform: 'translateY(' + L.bob[0] + '%)' }], L.bob[1], ph(), true));
        track(mistAnims, loop(wrap, [{ opacity: L.breathe[0] * L.alpha }, { opacity: L.alpha }], L.breathe[1], ph(), true));
      });
      mistRoot.appendChild(box);
      applyMist();
    }
    function applyMist() {
      var k = Math.max(0, par.mist);
      mistRoot.style.display = k > 0.001 ? '' : 'none';
      if (k > 0.001) mistTexes.forEach(function (T) { paintMist(T, k); });
    }

    // ---------- 浮尘 ----------
    function makeMote(i) {
      var r = mulberry32((i + 1) * 0x9E3779B1);
      var pick = r(), z = DUST_ZONES[0], acc = 0;
      for (var j = 0; j < DUST_ZONES.length; j++) { acc += DUST_ZONES[j][4]; z = DUST_ZONES[j]; if (pick < acc) break; }
      var x = z[0] + r() * z[2], y = z[1] + r() * z[3];
      var kind = r(), d, peak, life, far, grad;
      if (kind < .48) { d = 5.2 + 2.4 * r(); peak = .85 + .15 * r(); life = 14 + 10 * r(); far = .55; }     // 远：细、慢
      else if (kind < .86) { d = 8.5 + 5 * r(); peak = .85 + .15 * r(); life = 11 + 7 * r(); far = 1; }     // 中
      else { d = 22 + 18 * r(); peak = .4 + .16 * r(); life = 9 + 5 * r(); far = 1.7; }                     // 近：大、虚、快
      // 金色的：画面本身很亮，白色的尘在白底上看不见，被太阳照成金色才显得出来
      grad = kind < .86
        ? 'radial-gradient(closest-side,rgba(255,253,238,1) 0%,rgba(255,233,150,.97) 26%,rgba(255,205,96,.5) 58%,rgba(255,190,80,0) 100%)'
        : 'radial-gradient(closest-side,rgba(255,241,192,.82) 0%,rgba(255,227,150,.64) 55%,rgba(255,210,120,.26) 82%,rgba(255,200,100,0) 100%)';
      var dx = (70 + 110 * r()) * far, dy = -(25 + 65 * r()) * far;
      if (r() < .25) dy = (10 + 26 * r()) * far;                               // 少数几粒慢慢往下
      var ax = (9 + 14 * r()) * far, px = 5 + 4 * r(), ay = (7 + 10 * r()) * far, py = 4 + 3.5 * r();
      var twinkle = r() < .6, twDur = 4.5 + 5.5 * r(), twAt = .08 + .7 * r(), twLen = (.35 + .25 * r()) / twDur;

      var m = el('div', 'position:absolute;left:' + f(x / BW * 100) + '%;top:' + f(y / BH * 100) + '%;width:1%;height:1%;opacity:0;');
      var sx = el('div', FULL), sy = el('div', FULL);
      var dot = el('div', 'position:absolute;left:0;top:0;width:' + f(d / CELL_W * 100) + '%;aspect-ratio:1;border-radius:50%;opacity:.8;' +
        'transform:translate(-50%,-50%);background:' + grad + ';');
      sy.appendChild(dot); sx.appendChild(sy); m.appendChild(sx);
      var anims = [], ph = r();
      // 一粒的一生：淡入、飘一段、淡出，回到原处再来（淡出了才回去，看不出跳）
      track(anims, loop(m, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + f(dx / CELL_W * 100) + '%,' + f(dy / CELL_H * 100) + '%)' }], life, ph));
      track(anims, loop(m, [{ opacity: 0 }, { opacity: peak, offset: .14 }, { opacity: peak, offset: .8 }, { opacity: 0 }], life, ph));
      // 左右、上下各自轻轻晃，周期不同，合起来是一条不重复的弯路
      track(anims, loop(sx, [{ transform: 'translateX(-' + f(ax / CELL_W * 100) + '%)' }, { transform: 'translateX(' + f(ax / CELL_W * 100) + '%)' }], px, r(), true));
      track(anims, loop(sy, [{ transform: 'translateY(-' + f(ay / CELL_H * 100) + '%)' }, { transform: 'translateY(' + f(ay / CELL_H * 100) + '%)' }], py, r(), true));
      // 隔几秒闪一下微光
      if (twinkle) {
        var s0 = 'translate(-50%,-50%) scale(1)', s1 = 'translate(-50%,-50%) scale(1.6)';
        track(anims, dot.animate([
          { opacity: .8, transform: s0 }, { opacity: .8, transform: s0, offset: twAt },
          { opacity: 1, transform: s1, offset: twAt + twLen }, { opacity: .8, transform: s0, offset: twAt + twLen * 2.4 },
          { opacity: .8, transform: s0 }
        ], { duration: twDur * 1000, iterations: Infinity, easing: 'ease-in-out', delay: -r() * twDur * 1000 }));
      }
      dustRoot.appendChild(m);
      return { node: m, anims: anims };
    }

    // ---------- 花瓣 ----------
    function makePetal(i) {
      var r = mulberry32((i + 1) * 0x85EBCA6B + 77);
      var x = -20 + 250 * r(), y = 415 + 145 * r();                       // 从左边樱花树的树冠出发
      var kind = r(), size, peak, flight;
      if (kind < .35) { size = 15 + 4 * r(); peak = .92; flight = 12 + 4 * r(); }          // 远
      else if (kind < .82) { size = 22 + 8 * r(); peak = .98; flight = 10 + 3 * r(); }     // 中
      else { size = 36 + 14 * r(); peak = .88; flight = 8 + 2.5 * r(); }                   // 近：大一点、快一点
      var land = r() < .5, tx, ty;
      if (land) {                                                         // 落到水面：小船左边那片水，或者前景的浅水
        if (r() < .5) { tx = 300 + 320 * r(); ty = 772 + 56 * r(); } else { tx = 560 + 490 * r(); ty = 846 + 54 * r(); }
      } else { tx = x + 520 + 420 * r(); ty = y + 110 + 170 * r(); }      // 其余的斜着飘过花园，在半空淡掉
      var idle = 8 + 14 * r(), T = flight + idle, ff = flight / T, fl = land ? ff * .8 : ff;
      var dx = (tx - x) / CELL_W * 100, dy = (ty - y) / CELL_H * 100;
      var a0 = 360 * r(), turn = (r() < .5 ? -1 : 1) * (130 + 190 * r()), flips = 360 * (1 + 1.6 * r());
      var ax = 14 + 20 * r(), px = 2.6 + 1.6 * r(), ay = 6 + 7 * r(), py = 2 + 1.4 * r();

      var p = el('div', 'position:absolute;left:' + f(x / BW * 100) + '%;top:' + f(y / BH * 100) + '%;width:1%;height:1%;opacity:0;');
      var s = el('div', FULL), s2 = el('div', FULL);
      var b = el('div', 'position:absolute;left:0;top:0;width:' + f(size / CELL_W * 100) + '%;aspect-ratio:1;' +
        (petalImg ? 'background:url(' + petalImg + ') center/100% 100% no-repeat;'
          : 'border-radius:60% 60% 55% 55%/75% 75% 40% 40%;background:radial-gradient(ellipse at 50% 85%,#ff9fc0,#ffc4d6 45%,#ffeef4);'));
      if (petalWarm) b.appendChild(el('div', FULL + 'background:url(' + petalWarm + ') center/100% 100% no-repeat;opacity:var(--sun,.4);'));   // 被阳光照亮的那一层
      s2.appendChild(b); s.appendChild(s2); p.appendChild(s);
      var anims = [], ph = r(), end = 'translate(' + f(dx) + '%,' + f(dy) + '%)';
      var rest = 'translate(' + f(dx + (land ? 22 / CELL_W * 100 : 0)) + '%,' + f(dy + (land ? 3 / CELL_H * 100 : 0)) + '%)';
      // 斜着飘过去；落水的那几片到了水面慢下来，顺水漂一小段再淡掉；之后歇一阵再来
      track(anims, loop(p, [{ transform: 'translate(0,0)' }, { transform: end, offset: fl }, { transform: rest, offset: ff }, { transform: rest }], T, ph));
      track(anims, loop(p, [{ opacity: 0 }, { opacity: peak, offset: ff * .08 }, { opacity: peak, offset: land ? fl : ff * .82 },
        { opacity: 0, offset: ff }, { opacity: 0 }], T, ph));
      // 边飘边翻：落到水面的最后平躺着
      var c0 = 'translate(-50%,-50%) rotate(' + f(a0) + 'deg) rotateX(0deg)';
      var c1 = 'translate(-50%,-50%) rotate(' + f(a0 + turn) + 'deg) rotateX(' + f(land ? flips - (flips % 360) + 52 : flips) + 'deg)';
      track(anims, loop(b, [{ transform: c0 }, { transform: c1, offset: fl }, { transform: c1 }], T, ph));
      // 风里左右摇、上下浮
      track(anims, loop(s, [{ transform: 'translateX(-' + f(ax / CELL_W * 100) + '%)' }, { transform: 'translateX(' + f(ax / CELL_W * 100) + '%)' }], px, r(), true));
      track(anims, loop(s2, [{ transform: 'translateY(-' + f(ay / CELL_H * 100) + '%)' }, { transform: 'translateY(' + f(ay / CELL_H * 100) + '%)' }], py, r(), true));
      petalRoot.appendChild(p);
      return { node: p, anims: anims };
    }

    function resize(list, n, make) {
      while (list.length > n) {
        var gone = list.pop();
        gone.anims.forEach(function (a) { a.cancel(); });
        if (gone.node.parentNode) gone.node.parentNode.removeChild(gone.node);
      }
      while (list.length < n) list.push(make(list.length));   // 第几个永远是同一个，拖滑杆时已有的不重来
    }
    function applyDust() { resize(motes, Math.round(DUST_BASE * Math.max(0, Math.min(DUST_MAX, par.dust))), makeMote); }
    function applyPetals() { resize(petals, Math.round(PETAL_BASE * Math.max(0, Math.min(PETAL_MAX, par.petals))), makePetal); }

    var handle = {
      root: root,
      get ready() { return ready; },
      get params() { var o = {}; Object.keys(par).forEach(function (k) { o[k] = par[k]; }); return o; },
      get sky() { return skyOn; },                 // 左上那张画布起没起来
      get counts() { return { dust: motes.length, petals: petals.length }; },
      set: function (p) {
        if (!p) return;
        function take(k) { if (p[k] != null && isFinite(+p[k]) && +p[k] !== par[k]) { par[k] = +p[k]; return true; } return false; }
        if (take('mist') && ready) applyMist();
        if (take('dust') && ready) applyDust();
        if (take('petals') && ready) applyPetals();
        if (take('speed')) { if (fixed) clock.mist = t0 * par.speed; else if (ready) each(rate); }
        take('clouds'); take('sun');
        if (skyOn && !looping) drawSky();
      },
      pause: function () { wantRun = false; apply(); },
      resume: function () { wantRun = true; apply(); },
      boot: function (seconds) { if (seconds != null && isFinite(+seconds)) bootSeconds = Math.max(0, +seconds); boot(); },
      setBootTime: function (v) { [bootAnim, skyBoot].forEach(function (a) { if (a) { a.pause(); a.currentTime = v * 1000; } }); },
      setTime: function (v) {
        t0 = +v; clock.sun = t0; clock.flow = t0; clock.mist = t0 * par.speed;
        each(function (a) { a.pause(); a.currentTime = t0 * 1000; });
        if (skyOn) drawSky();
      },
      setVisible: function (v) { root.style.visibility = v ? 'visible' : 'hidden'; if (skyFade) skyFade.style.visibility = root.style.visibility; },
      destroy: destroy
    };

    function onVis() { apply(); }

    function destroy() {
      destroyed = true;
      stopLoop();
      each(function (a) { a.cancel(); });
      if (bootAnim) bootAnim.cancel();
      if (skyBoot) skyBoot.cancel();
      if (skyFade) skyFade.remove();
      mistAnims = []; motes = []; petals = [];
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      sky.removeEventListener('webglcontextlost', onLost, false);
      sky.removeEventListener('webglcontextrestored', onRestored, false);
      if (gl) {
        glRes.forEach(function (tx) { gl.deleteTexture(tx); });
        if (prog) gl.deleteProgram(prog);
        var ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
      gl = null; prog = null; skyOn = false;
      if (root.parentNode) root.parentNode.removeChild(root);
      ready = false;
    }

    try {
      if (!root.animate) throw new Error('这个浏览器不支持网页动画接口');
      container.appendChild(root);
      petalImg = petalUrl(false); petalWarm = petalUrl(true);
      buildWater();
      applyDust();
      applyPetals();
      drawSky();
      ready = true;
      boot();
      document.addEventListener('visibilitychange', onVis);
      if (global.IntersectionObserver && !fixed) {
        io = new IntersectionObserver(function (es) { visible = es[es.length - 1].isIntersecting; apply(); });
        io.observe(root);
      }
      apply();
      // 左上那张画布要等原画读得到
      var src = opts.image;
      if (src && src.tagName) {
        imgEl = src;
        if (imgEl.complete && imgEl.naturalWidth) beginSky(); else imgEl.addEventListener('load', beginSky, { once: true });
      } else if (src) {
        imgEl = new Image();
      imgEl.crossOrigin = 'anonymous';
        imgEl.onload = beginSky;
        imgEl.onerror = function () { skyFail(new Error('底图读不到')); };
        imgEl.src = src;
      } else skyFail(new Error('没给底图'));
      if (opts.onReady) opts.onReady(handle);
    } catch (err) {
      if (root.parentNode) root.parentNode.removeChild(root);   // 退回原画
      if (opts.onError) opts.onError(err);
      else if (global.console) console.warn('[ambient]', err);
    }
    return handle;
  }

  global.WlyAmbient = { mount: mount, DEFAULT_PARAMS: DEFAULT_PARAMS, DEFAULT_BOOT: DEFAULT_BOOT };
})(window);

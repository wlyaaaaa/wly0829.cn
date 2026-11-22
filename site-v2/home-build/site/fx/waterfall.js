/*
 * 瀑布模块（wly0829.cn 首页第一屏）——第一版的样子，只多两个参数
 *
 * 用法：
 *   var fall = WlyWaterfall.mount(container, { image: imgOrUrl, speed: 3, drops: 5, splash: 5 });
 *   fall.set({ speed: 2.4 });    // 运行中改
 *   fall.pause(); fall.resume(); fall.destroy();
 *
 * speed：水往下的快慢，是第一版的几倍（1～3）。drops：水帘里细亮点的多少，是第一版的几倍（1～5；到 3 就加满了，再大画面不变），大小不变。
 * splash：落水处溅起的小水点和水雾（1～5）；1 是 110 个水点、第一版的水雾，往上水点更多（到 2.5 是上限 275 个）、溅得更高更开、雾更浓，水点大小不变。
 * 三个参数互不牵连。
 * speed=1、drops=1 时，出水那道亮边往下 36 个单位以下画出来和第一版一模一样。
 * 顶上（光环开口里、出水的亮边、亮边下面头一截水丝）也在流：开口里是水帘靠里的那半边往下落，亮边上亮点一闪一闪，
 * 亮边底下两三个单位起水丝就在动。光环那圈管子、白色外壳、两边的零件不在范围里，一个像素都不碰。
 *
 * container：和整幅画一样大的定位容器（position 不是 static）。模块只在瀑布那一块
 * 放一张画布，位置用百分比，所以容器被 CSS transform 整体缩放、平移时不用任何同步。
 *
 * 做法（同第一版）：画上的水本身被拆成两部分——
 *   1) 竖向抹匀的底（只留一根根水线的位置和大块明暗，不留任何"高度上的记号"）；
 *   2) 原画里的亮点和断续（细节）。细节按"自由落体"的时间坐标往下流，
 *      每一小股水有自己的速度和起点，前后两层速度不同，再用亮暗起伏的"水团"调制。
 */
(function (global) {
  'use strict';

  var BASIS_W = 1672; // 着色器里的长度单位：把画宽当作 1672 个单位

  // 瀑布在画上的位置，百分比（x 类按画宽，y 类按画高），按 1672×941 定稿量的
  // speed：水往下的快慢，是第一版的几倍；drops：水帘里细亮点的多少，是第一版的几倍；splash：落水处的水点和水雾（大小都不变）
  var DEFAULT_PARAMS = { speed: 3, drops: 5, splash: 5 };  // 本人 2026-11-13 13:12 在首页上定的最终数，原话：“瀑布：速度 3.00 倍 · 水滴 5.00 倍 · 水花 5.00 倍 …… 最终”
  var BASE_SPEED = 285;   // 第一版：水帘中段每秒往下走多少个单位
  var SPLASH_BASE = 110;  // splash=1 时落水处水点的个数（第一版是 44；本人定稿时看到的是 110）
  var DEFAULT_MB = 0.8;     // 超出的那一截抹开几成
  var MB_FREE = 10;         // 一帧走不超过这么多个单位时亮点原样不动（60 帧的屏上相当于 2.1 倍速以内）

  var DEFAULT_FALL = {
    cx: 74.58,         // 圆筒中轴 x（顶部）
    cxBottom: 74.76,   // 圆筒中轴 x（落水处）
    ringY: 13.60,      // 光环椭圆圆心 y
    ringRx: 9.57,      // 光环椭圆横半径
    ringRy: 4.78,      // 光环椭圆竖半径
    bottom: 78.85,     // 水落到河面的 y
    halfTop: 7.42,     // 水帘顶部半宽
    halfBottom: 6.64,  // 水帘底部半宽
    // 光环开口（从开口里看得见水帘靠里那半边的那一块）的上边界：背面那段管子的下沿再往下让开 4 个单位，是这个椭圆的上半段
    openCx: 75.06, openY: 14.665, openRx: 8.373, openRy: 4.251
  };

  var VERT = '#version 300 es\n' +
    'in vec2 aPos; out vec2 vUv;\n' +
    'void main(){ vUv = vec2(aPos.x*0.5+0.5, 0.5-aPos.y*0.5); gl_Position = vec4(aPos,0.,1.); }\n';

  var COMMON = '#version 300 es\n' +
    'precision highp float;\n' +
    'uniform sampler2D uImg;\n' +
    'uniform vec2 uBasis;\n' +
    'uniform vec4 uRect;\n' +   // x0,y0,w,h
    'uniform vec4 uRing;\n' +   // cx,cy,rx,ry
    'uniform vec4 uFall;\n' +   // top,bot,hwTop,hwBot
    'uniform float uCxBot;\n' +
    'in vec2 vUv; out vec4 o;\n' +
    'vec3 img(vec2 P){ return textureLod(uImg, P/uBasis, 0.).rgb; }\n' +
    'vec2 fboUv(vec2 P){ vec2 l=(P-uRect.xy)/uRect.zw; return vec2(l.x, 1.-l.y); }\n' +
    'float fallU(float y){ return (y-uFall.x)/(uFall.y-uFall.x); }\n' +
    'float arcY(float x){ float k=clamp((x-uRing.x)/uRing.z,-1.,1.); return uRing.y+uRing.w*sqrt(1.-k*k); }\n' +
    'float bodyMask(vec2 P){\n' +
    '  float u=clamp(fallU(P.y),0.,1.);\n' +
    '  float hw=mix(uFall.z,uFall.w,u), ax=mix(uRing.x,uCxBot,u);\n' +
    '  float side=1.-smoothstep(hw-15.,hw+1.,abs(P.x-ax));\n' +
    '  float ay=arcY(P.x);\n' +
    '  float top=smoothstep(ay-4.,ay+36.,P.y);\n' +
    '  float bot=1.-smoothstep(uFall.y-46.,uFall.y-4.,P.y);\n' +
    '  return side*top*bot;\n' +
    '}\n';

  // 一次性：把水帘竖向抹匀（越靠近水帘边缘抹得越少）
  var FRAG_BLUR = COMMON +
    'uniform float uSpread;\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  float sp=uSpread*bodyMask(P);\n' +
    '  vec3 acc=vec3(0.); float ws=0.;\n' +
    '  for(int i=-20;i<=20;i++){ float fi=float(i); float w=exp(-fi*fi/200.); acc+=w*img(P+vec2(0.,fi*sp)); ws+=w; }\n' +
    '  o=vec4(acc/ws,1.);\n' +
    '}\n';

  // 一次性：原画各处"细节有多强"，流动的细节按它配平，静帧的疏密才贴着原画
  var FRAG_EN = COMMON +
    'uniform sampler2D uBlur;\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  float acc=0., ws=0.;\n' +
    '  for(int j=-4;j<=4;j++) for(int i=-3;i<=3;i++){\n' +
    '    vec2 Q=P+vec2(float(i)*5.,float(j)*7.);\n' +
    '    vec3 d=img(Q)-texture(uBlur,fboUv(Q)).rgb;\n' +
    '    float w=exp(-(float(i*i)/6.+float(j*j)/10.));\n' +
    '    acc+=w*dot(abs(d),vec3(.3333)); ws+=w;\n' +
    '  }\n' +
    '  o=vec4(vec3(clamp(acc/ws*4.,0.,1.)),1.);\n' +
    '}\n';

  var FRAG_MAIN = COMMON +
    'uniform sampler2D uBlur, uEn, uNoise;\n' +
    'uniform float uT;\n' +
    'uniform float uPh;\n' +
    'uniform float uMB;\n' +      // 一帧里走得太远时，超出的那一截有多长（只抹开这一截；平时是 0）
    'uniform vec2 uDrops;\n' +
    'uniform float uSplash;\n' +
    'uniform vec4 uFlow;\n' +   // K, rate, srcY0, srcH
    'uniform vec4 uTune;\n' +   // gainFront, gainBack, gainLine, debug
    'uniform float uSway;\n' +
    'uniform float uMBGain;\n' +
    'uniform vec4 uOpen;\n' +   // 开口上边界那个椭圆：cx,cy,rx,ry
    'float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return texture(uNoise,(i+f+.5)/256.).r; }\n' +
    'float fbm(vec2 p){ return vn(p)*.5+vn(p*2.03+17.3)*.3+vn(p*4.1+41.7)*.2; }\n' +
    'vec4 hash4(float n){ return fract(sin(n*vec4(12.9898,78.233,37.719,93.989))*43758.5453); }\n' +
    // 自由落体的"时间坐标"：同一团水沿它匀速走，换回画面就是越往下越快、越拉越长
    'float tau(float y){ return sqrt(.4+max(fallU(y),-.3))-.63246; }\n' +
    // 原画里的亮点和断续 = 原画 − 竖向抹匀的底；按原处和落点的疏密配平
    'vec3 detailAt(vec2 S,float e0,float mb){\n' +
    '  vec2 q=fboUv(S);\n' +
    '  float g=clamp(e0/max(texture(uEn,q).r,.03),.45,2.2);\n' +
    '  vec3 c=img(S);\n' +
    '  if(mb>.25){ vec2 d=vec2(0.,mb*.25); c=(c+img(S+d)+img(S-d)+img(S+2.*d)+img(S-2.*d))*.2; }\n' +
    '  return (c-texture(uBlur,q).rgb)*g;\n' +
    '}\n' +
    // 一层往下流的亮点：一小股一小股各有自己的速度和起点；接头处两份错开半张交替，不闪不跳
    'vec3 flowLayer(vec2 P,float w,float row,float rateMul,float mirror,float e0,float act,out float clump){\n' +
    '  float xs=(P.x+sin(P.x*.71)+sin(P.x*.233+1.3))/w+row*.37;\n' +
    '  float id=floor(xs);\n' +
    '  int ix=int(mod(id,256.));\n' +
    '  vec4 h=texelFetch(uNoise,ivec2(ix,int(row)),0);\n' +
    '  if(h.w>act){ clump=0.; return vec3(0.); }\n' +
    '  float m=.82+.4*h.x;\n' +
    '  float q=tau(P.y)*uFlow.x-uPh*rateMul*m+h.y*7.+h.z;\n' +
    '  float f1=fract(q), f2=fract(q+.5);\n' +
    '  float w1=clamp(min(f1,1.-f1)/.13,0.,1.); w1=w1*w1*(3.-2.*w1);\n' +
    '  float w2=1.-w1;\n' +
    '  float u=clamp(fallU(P.y),0.,1.);\n' +
    '  float rel=(P.x-mix(uRing.x,uCxBot,u))/mix(uFall.z,uFall.w,u)*(mirror>.5?-1.:1.);\n' +
    '  float y1=uFlow.z+uFlow.w*f1, y2=uFlow.z+uFlow.w*f2;\n' +
    '  float u1=fallU(y1), u2=fallU(y2);\n' +
    '  vec2 S1=vec2(mix(uRing.x,uCxBot,u1)+rel*mix(uFall.z,uFall.w,u1),y1);\n' +
    '  vec2 S2=vec2(mix(uRing.x,uCxBot,u2)+rel*mix(uFall.z,uFall.w,u2),y2);\n' +
    '  float mb=uMB*rateMul*m;\n' +
    '  vec3 d=vec3(0.);\n' +
    '  if(w1>.001) d+=detailAt(S1,e0,mb)*w1;\n' +
    '  if(w2>.001) d+=detailAt(S2,e0,mb)*w2;\n' +
    '  d/=sqrt(w1*w1+w2*w2);\n' +
    '  d*=1.+uMBGain*min(mb,6.);\n' +
    '  d=max(d,0.)+min(d,0.)*.6;\n' +
    '  d=mix(vec3(dot(d,vec3(.3333))),d,.45);\n' +   // 搬过来的亮点只留一点颜色，免得出现彩色碎屑
    '  float n=texture(uNoise,vec2((q*5.+h.w*97.+.5)/256.,(float(ix)+.5)/256.)).g;\n' +
    '  clump=smoothstep(.2,.8,n);\n' +
    '  return d;\n' +
    '}\n' +
    // 沿水线往下走的明暗起伏：两层不同速度（快的是朝我们这面，慢的是背面），横向每 6~9 个单位互不相干
    'float lineMod(vec2 P){\n' +
    '  float ty=tau(P.y)*uFlow.x;\n' +
    '  float a=texture(uNoise,vec2((P.x/6.+.5)/256.,((ty-uPh)*5.+.5)/256.)).b;\n' +
    '  float b=texture(uNoise,vec2((P.x/9.+91.5)/256.,((ty-uPh*.6)*4.+37.5)/256.)).a;\n' +
    '  return smoothstep(.22,.78,.6*a+.4*b);\n' +
    '}\n' +
    'float ell(vec2 P,vec2 c,vec2 r){ return length((P-c)/r); }\n' +
    // —— 顶上那一块用的 ——
    'float sideMask(vec2 P){ float u=clamp(fallU(P.y),0.,1.); float hw=mix(uFall.z,uFall.w,u), ax=mix(uRing.x,uCxBot,u); return 1.-smoothstep(hw-15.,hw+1.,abs(P.x-ax)); }\n' +
    'float lipY(float x){ return arcY(x)-.034*(x-uRing.x); }\n' +                 // 出水那道亮边的中线（量出来比椭圆略斜一点）
    'float openTop(float x){ float k=clamp((x-uOpen.x)/uOpen.z,-1.,1.); return uOpen.y-uOpen.w*sqrt(1.-k*k); }\n' +
    // 当场把原画竖向抹匀（取样不越过 y0..y1，所以管子和亮边不会被抹进来）；lod 大于 0 时顺带横向也抹开，当“底色”用
    'vec3 vsmear(vec2 P,float y0,float y1,float lod){\n' +
    '  vec3 acc=vec3(0.); float ws=0.;\n' +
    '  for(int i=-10;i<=10;i++){ float fi=float(i); float w=exp(-fi*fi/32.); acc+=w*textureLod(uImg,vec2(P.x,clamp(P.y+fi*1.6,y0,y1))/uBasis,lod).rgb; ws+=w; }\n' +
    '  return acc/ws;\n' +
    '}\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  float cxb=uCxBot, bot=uFall.y, hwb=uFall.w;\n' +
    '  float sk=uSplash-1.;\n' +
    // 落水处的水雾范围
    '  float e1=1.-smoothstep(.3,1.,ell(P,vec2(cxb,bot-22.),vec2(hwb+78.,58.)));\n' +
    '  float e2=1.-smoothstep(.3,1.,ell(P,vec2(cxb-170.,bot),vec2(125.,28.)));\n' +
    '  float mist=max(e1,.6*e2);\n' +
    '  vec2 disp=vec2(0.);\n' +
    '  if(mist>.001){\n' +
    '    vec2 np=P*vec2(.016,.024);\n' +
    '    vec2 wv=vec2(fbm(np+vec2(uT*.11,uT*.2)),fbm(np+vec2(31.4-uT*.12,uT*.17)))-.5;\n' +
    '    disp+=wv*13.*mist;\n' +
    '  }\n' +
    // 河面涟漪：以落点为心的扁椭圆，一圈圈往外
    '  vec2 rc=vec2(cxb,bot+6.);\n' +
    '  vec2 rd=(P-rc)*vec2(1.,3.7);\n' +
    '  float r=length(rd);\n' +
    '  float renv=smoothstep(95.,150.,r)*(1.-smoothstep(170.,300.,r))*smoothstep(bot-34.,bot+4.,P.y);\n' +
    '  float rip=0.;\n' +
    '  if(renv>.001){\n' +
    '    vec3 k=textureLod(uImg,P/uBasis,2.5).rgb;\n' +
    '    renv*=smoothstep(.04,.16,k.b-k.r)*smoothstep(0.,.1,k.g-k.r);\n' +
    '    float rph=r*.185-uT*5.2+vn(P*vec2(.02,.06)+vec2(0.,uT*.1))*2.4;\n' +
    '    rip=sin(rph)+.45*sin(rph*1.73+1.1);\n' +
    '    disp+=normalize(rd)*vec2(1.,.27)*rip*3.*renv;\n' +
    '  }\n' +
    '  vec2 Pw=P+disp;\n' +
    '  vec3 col=img(Pw);\n' +
    '  float M=bodyMask(Pw);\n' +
    // 顶上：出水那道亮边以下的头一截水丝，从亮边底下两三个单位起就是流动的（原来要往下 40 个单位才慢慢流满，中间那一截看着是死的）。
    // 亮边往下 36 个单位以下 Mn 就是 M，走的是和原来一模一样的算式
    '  float ayw=arcY(Pw.x), lyw=lipY(Pw.x);\n' +
    '  bool topz=Pw.y<ayw+36.;\n' +
    '  float Mn=M;\n' +
    // 亮边本身连同它的光晕原样留着（不替换）：亮边中线往下 6～14 个单位才换成流动的那一层；
    // 中线到那里之间，只把往下流的亮点叠在原画上面（Madd），所以亮点是从亮边底下掉出来的，亮边还是原来那一道
    '  float Madd=0.;\n' +
    '  if(topz){\n' +
    '    float sdw=sideMask(Pw);\n' +
    '    Mn=max(M,sdw*smoothstep(lyw+6.,lyw+14.,Pw.y));\n' +
    '    Madd=sdw*smoothstep(lyw-2.,lyw+3.,Pw.y)*(1.-smoothstep(lyw+6.,lyw+14.,Pw.y));\n' +
    '  }\n' +
    '  if(max(Mn,Madd)>.002){\n' +
    // 水线不是死直的：很小的左右弯（不到一个单位）顺着水往下传。竖线顺着自己走看不出动，弯往下传就看得出
    '    Pw.x+=Mn*uSway*2.*(texture(uNoise,vec2((Pw.x/14.+.5)/256.,((tau(Pw.y)*uFlow.x-uPh)*7.+113.5)/256.)).g-.5);\n' +
    '    vec2 fq=fboUv(Pw);\n' +
    '    vec3 bl=texture(uBlur,fq).rgb;\n' +
    '    float e0=texture(uEn,fq).r;\n' +
    // 水线本身（竖向抹匀后仍在的细线）不搬动，只让它的亮度一段一段往下走
    '    vec2 px=vec2(1./uRect.z,0.);\n' +
    '    vec3 low=bl*.28+(texture(uBlur,fq+px*3.5).rgb+texture(uBlur,fq-px*3.5).rgb)*.22+(texture(uBlur,fq+px*8.).rgb+texture(uBlur,fq-px*8.).rgb)*.14;\n' +
    // 顶上这一截：预先抹好的那张底在这里抹得很少（留着不动的亮点），所以当场另抹一份；亮点的疏密借正下方那一段的，往下 36 个单位内慢慢换回原来的
    '    float gT=1.;\n' +
    '    if(topz){\n' +
    '      float wT=smoothstep(lyw+16.,ayw+36.,Pw.y);\n' +
    '      vec3 blT=vsmear(Pw,lyw+10.,lyw+70.,0.);\n' +
    '      vec3 lowT=vsmear(Pw,lyw+14.,lyw+70.,3.4);\n' +
    '      bl=mix(blT,bl,wT); low=mix(lowT,low,wT);\n' +
    '      e0=mix(texture(uEn,fboUv(vec2(Pw.x,ayw+66.))).r,e0,wT);\n' +
    '      gT=1.+.25*(1.-wT);\n' +     // 刚翻过亮边的那一截，亮点略亮一点
    '    }\n' +
    '    float cF, cB;\n' +
    '    vec3 dF=flowLayer(Pw,7.,3.,1.,0.,e0,1.,cF);\n' +
    '    vec3 dB=flowLayer(Pw,12.,77.,.58,1.,e0,1.,cB);\n' +
    '    if(topz) dF*=gT;\n' +
    '    float lm=lineMod(Pw);\n' +
    // 大团的水：几十个单位宽的一片一片往下落，一眼就看得出整道水在走（幅度小，不是整块忽明忽暗）
    '    float bg=smoothstep(.15,.85,texture(uNoise,vec2((Pw.x/45.+13.5)/256.,((tau(Pw.y)*uFlow.x-uPh*.9)*2.2+71.5)/256.)).r);\n' +
    '    vec3 flowing=low+(bl-low)*(.55+.9*lm)*(.82+.36*bg)*uTune.z+(dF*(.55+.9*cF)*uTune.x+dB*(.6+.6*cB)*uTune.y)*(.72+.56*bg);\n' +
    '    flowing+=((lm-.5)*.05+(bg-.5)*.05)*vec3(.82,.93,1.);\n' +
    // “水滴”调多时：再放几股同样大小的亮点进来（只加亮点，不加暗边）；1 倍时这里什么都不做，和第一版一模一样
    '    if(uDrops.x>1.001){\n' +
    '      float cE;\n' +
    '      vec3 dE=max(flowLayer(Pw,7.,131.,1.08,0.,e0,min(uDrops.x-1.,1.),cE),0.);\n' +
    '      dE*=.55+.9*cE;\n' +
    '      if(uDrops.x>2.001){ float cG; vec3 dG=max(flowLayer(Pw,9.,197.,.92,0.,e0,uDrops.x-2.,cG),0.); dE+=dG*(.55+.9*cG); }\n' +
    '      flowing+=dE*uTune.x*(.72+.56*bg);\n' +
    '    }\n' +
    '    col=mix(col,flowing,Mn);\n' +
    '    if(Madd>.002) col+=Madd*max(flowing-low-(bl-low)*(.55+.9*lm)*(.82+.36*bg)*uTune.z,0.);\n' +
    '  }\n' +
    // 光环开口里：看到的是水帘靠里的那半边，从背面的环沿往下落。和下面的水帘同一个做法（竖向抹匀的底 + 往下流的亮点 + 水线的明暗起伏），
    // 亮点从水帘本体搬过来，走得比朝我们这面慢（它在后面）。管子、外壳在范围外面，不碰
    '  float otop=openTop(P.x), ly=lipY(P.x);\n' +
    '  float O=(1.-smoothstep(uOpen.z-28.,uOpen.z-12.,abs(P.x-uOpen.x)))*smoothstep(otop,otop+7.,P.y)*(1.-smoothstep(ly-10.,ly-4.,P.y));\n' +
    '  if(O>.002){\n' +
    // 开口里自己的亮点和断续（原画 − 竖向抹匀）一小股一小股往下流：水线的位置不动，流的是水线上的亮点和断口，所以每一帧都还是原画那个样子。
    // 每一小股（7 个单位宽）有自己的快慢和起点；上下边界按这一股中间那一列算，同一股里不走样。走到底的和刚出来的两份错开半程交替，不闪不跳
    '    float xsO=(P.x+sin(P.x*.71)+sin(P.x*.233+1.3))/7.+19.61;\n' +
    '    float idO=floor(xsO);\n' +
    '    vec4 hO=texelFetch(uNoise,ivec2(int(mod(idO,256.)),53),0);\n' +
    '    float xcO=(idO+.5-19.61)*7.;\n' +
    '    float yT=openTop(xcO)+3., yB=lipY(xcO)-7.;\n' +
    '    float Hs=max(yB-yT,12.);\n' +
    '    float qO=(P.y-yT-uPh*uFlow.w*.36*(.82+.4*hO.x))/Hs+hO.y*7.+hO.z;\n' +   // 走得比朝我们这面慢（它在后面）
    '    float g1=fract(qO), g2=fract(qO+.5);\n' +
    '    float v1=clamp(min(g1,1.-g1)/.13,0.,1.); v1=v1*v1*(3.-2.*v1);\n' +
    '    float v2=1.-v1;\n' +
    '    vec2 S1=vec2(P.x,yT+Hs*g1), S2=vec2(P.x,yT+Hs*g2);\n' +
    '    vec3 dO=vec3(0.);\n' +
    '    if(v1>.001) dO+=(img(S1)-vsmear(S1,yT,yB,0.))*v1;\n' +
    '    if(v2>.001) dO+=(img(S2)-vsmear(S2,yT,yB,0.))*v2;\n' +
    '    dO/=sqrt(v1*v1+v2*v2);\n' +
    '    vec3 blO=vsmear(P,yT,yB,0.);\n' +
    '    vec3 lowO=vsmear(P,yT+5.,yB-2.,3.4);\n' +
    '    float tyO=tau(P.y)*uFlow.x;\n' +
    '    float lmO=smoothstep(.22,.78,.6*texture(uNoise,vec2((P.x/6.+.5)/256.,((tyO-uPh*.55)*5.+201.5)/256.)).b+.4*texture(uNoise,vec2((P.x/9.+91.5)/256.,((tyO-uPh*.36)*4.+97.5)/256.)).a);\n' +
    '    vec3 flowO=lowO+(blO-lowO)*(.7+.6*lmO)+dO;\n' +
    // 再从水帘本体搬一点同样大小的细亮点过来（淡淡的，跟着这一处的底色染一点：彩光是照在流动的水上）
    '    vec2 Qb=vec2(uRing.x+(P.x-uRing.x)*.86,P.y);\n' +
    '    float eO=.85*texture(uEn,fboUv(vec2(Qb.x,arcY(P.x)+66.))).r;\n' +
    '    float cA;\n' +
    '    vec3 dA=max(flowLayer(Qb,7.,171.,.5,1.,eO,min(uDrops.x*.5,1.),cA),0.);\n' +
    '    vec3 tintO=mix(vec3(1.),blO/max(max(blO.r,max(blO.g,blO.b)),.01),.6);\n' +
    '    flowO+=dA*(.55+.9*cA)*uTune.x*.4*tintO;\n' +
    '    col=mix(col,flowO,O);\n' +
    '  }\n' +
    // 出水的那道亮边：水不断翻过来。亮边不挪位置、不变暗；一小段一小段的光晕沿着边游走、忽明忽暗（按亮边自己的形状晕开）
    '  float sdE=sideMask(vec2(P.x,uFall.x));\n' +
    '  float egd=(P.y-ly)/7.;\n' +
    '  float eg=sdE*exp(-egd*egd);\n' +
    '  if(eg>.003){\n' +
    '    float s=smoothstep(.5,.85,.6*vn(vec2(P.x*.11-uT*1.6,uT*1.7))+.5*vn(vec2(P.x*.23+uT*2.3,uT*2.9+40.)));\n' +
    '    vec3 gE=textureLod(uImg,P/uBasis,2.6).rgb;\n' +
    '    col+=eg*smoothstep(.72,.98,max(gE.r,max(gE.g,gE.b)))*s*.24*vec3(.95,.98,1.);\n' +
    '  }\n' +
    // 涟漪的亮纹：断断续续的细亮线，不是一整条光带
    '  col+=renv*(.085*smoothstep(.45,1.35,rip)*(.35+1.3*vn(P*vec2(.13,.5)+vec2(uT*.3,0.)))-.03*smoothstep(-.35,-1.35,rip))*vec3(.9,1.,1.);\n' +
    // 水雾：白的一团团往上往外翻，团与团之间带一点淡蓝的影子；范围比画上的雾高一截，雾会漫到水帘脚下
    '  float mz=max(mist,1.-smoothstep(.25,1.,ell(P,vec2(cxb,bot-40.),vec2(hwb+92.,92.))));\n' +
    '  if(mz>.001){\n' +
    '    vec2 mp=P*vec2(.011,.021);\n' +
    '    float n1=fbm(mp+vec2(-uT*.07,uT*.15));\n' +
    '    float n2=fbm(mp*1.7+vec2(uT*.09,uT*.2)+n1*1.3);\n' +
    '    float puff=smoothstep(.4,.74,n2);\n' +
    '    float rise=1.-smoothstep(bot-125.,bot-45.,P.y);\n' +
    '    col=mix(col,vec3(.955,.975,1.),puff*(mist*.3+(mz-mist)*(1.-rise)*.34)*(1.+.35*sk));\n' +
    '    col=mix(col,col*vec3(.87,.91,.975),mist*(1.-puff)*.5);\n' +
    '  }\n' +
    // 落点一线的白沫
    '  float kx=(P.x-cxb)/(hwb+6.);\n' +
    '  if(abs(kx)<1.2){\n' +
    '    float yf=bot-8.+15.*sqrt(max(1.-kx*kx,0.));\n' +
    '    float dy=(P.y-yf)/10.;\n' +
    '    float band=exp(-dy*dy)*(1.-smoothstep(.9,1.15,abs(kx)));\n' +
    '    float fn=fbm(vec2(P.x*.11,P.y*.16+uT*1.6));\n' +
    '    col=mix(col,vec3(1.),band*smoothstep(.42,.75,fn)*.38);\n' +
    '  }\n' +
    // 溅起的水点
    '  if(abs(P.x-cxb)<hwb+95.+90.*sk && P.y>bot-140.-70.*sk && P.y<bot+22.){\n' +
    '    float acc=0.;\n' +
    '    for(int i=0;i<275;i++){\n' +
    '      float fi=float(i);\n' +
    '      if(fi>=uDrops.y) break;\n' +
    '      vec4 h=hash4(fi*3.17+1.3);\n' +
    '      float per=mix(.8,1.5,h.x);\n' +
    '      float ph=uT/per+h.y;\n' +
    '      float cyc=floor(ph), f=fract(ph);\n' +
    '      vec4 rr=hash4(fi*7.31+cyc*1.618+h.z*10.);\n' +
    '      float a=rr.x*2.-1.;\n' +
    '      vec2 o0=vec2(cxb+a*(hwb+5.),bot-10.+14.*sqrt(1.-a*a));\n' +
    '      vec2 v=vec2(((rr.y*2.-1.)*55.+a*60.)*(1.+.25*sk),-(135.+185.*rr.z*rr.z)*(1.+.2*sk));\n' +
    '      float tt=f*per;\n' +
    '      vec2 pos=o0+v*tt+vec2(0.,210.*tt*tt);\n' +
    '      float rad=mix(1.2,2.5,rr.w);\n' +
    '      float life=smoothstep(0.,.06,f)*(1.-smoothstep(.55,.95,f))*step(pos.y,o0.y+4.);\n' +
    '      acc+=life*(1.-smoothstep(rad*.35,rad*1.5,length(P-pos)));\n' +
    '    }\n' +
    '    col=mix(col,vec3(1.),clamp(acc,0.,1.)*.85);\n' +
    '  }\n' +
    '  if(uTune.w>.5){ col=mix(col,vec3(1.,0.,0.),M*.45); col=mix(col,vec3(0.,.8,0.),mist*.35); col=mix(col,vec3(0.,0.,1.),renv*.6); }\n' +
    '  vec2 ed=min(vUv,1.-vUv)*uRect.zw;\n' +
    '  float a=smoothstep(0.,12.,min(ed.x,ed.y));\n' +
    '  o=vec4(col*a,a);\n' +
    '}\n';

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
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
    var aspect = opts.aspect || (1672 / 941);
    var BW = BASIS_W, BH = BW / aspect;
    var f = Object.assign({}, DEFAULT_FALL, opts.fall || {});
    var G = {
      cx: f.cx / 100 * BW, cxB: f.cxBottom / 100 * BW,
      ringY: f.ringY / 100 * BH, ringRx: f.ringRx / 100 * BW, ringRy: f.ringRy / 100 * BH,
      bot: f.bottom / 100 * BH, hwT: f.halfTop / 100 * BW, hwB: f.halfBottom / 100 * BW,
      oCx: f.openCx / 100 * BW, oY: f.openY / 100 * BH, oRx: f.openRx / 100 * BW, oRy: f.openRy / 100 * BH
    };
    G.top = G.ringY + G.ringRy;
    // 画布只盖瀑布、水雾和涟漪这一块
    var R = {
      x0: Math.round(G.cx - 2.55 * G.hwT), x1: Math.round(G.cx + 2.3 * G.hwT),
      y0: Math.round(G.top - 100), y1: Math.round(G.bot + 112)
    };
    R.w = R.x1 - R.x0; R.h = R.y1 - R.y0;

    var res = opts.resolution || 1;
    var fixed = (opts.time != null);
    var par = {
      speed: opts.speed == null ? DEFAULT_PARAMS.speed : +opts.speed,
      drops: opts.drops == null ? DEFAULT_PARAMS.drops : +opts.drops,
      splash: opts.splash == null ? DEFAULT_PARAMS.splash : +opts.splash
    };
    var srcH0 = (G.bot - 82) - (G.top + 46);
    function rate() { return BASE_SPEED * par.speed / srcH0; }   // 每秒流过几“张”细节
    var canvas = document.createElement('canvas');
    canvas.width = Math.round(R.w * res);
    canvas.height = Math.round(R.h * res);
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;pointer-events:none;display:block;' +
      'left:' + (R.x0 / BW * 100) + '%;top:' + (R.y0 / BH * 100) + '%;' +
      'width:' + (R.w / BW * 100) + '%;height:' + (R.h / BH * 100) + '%;';

    var gl = null, prog = null, uT = null, uPh = null, uMB = null, uDrops = null, uSplash = null, raf = 0, running = false, destroyed = false;
    var t = fixed ? +opts.time : 0, last = 0, wantRun = !fixed, visible = true, ready = false;
    var ph = fixed ? t * rate() : 0, frameDt = 1 / 60;
    var imgEl = null, io = null, resources = [];

    var handle = {
      canvas: canvas,
      rect: R,
      get ready() { return ready; },
      get time() { return t; },
      get params() { return { speed: par.speed, drops: par.drops, splash: par.splash }; },
      set: function (p) {
        if (p && p.speed != null && isFinite(+p.speed)) par.speed = +p.speed;
        if (p && p.drops != null && isFinite(+p.drops)) par.drops = +p.drops;
        if (p && p.splash != null && isFinite(+p.splash)) par.splash = +p.splash;
        if (fixed) ph = t * rate();
        if (ready && !running) draw();
      },
      pause: function () { wantRun = false; stop(); },
      resume: function () { wantRun = true; start(); },
      setTime: function (v) { t = +v; ph = t * rate(); if (ready && !running) draw(); },
      setVisible: function (v) { canvas.style.visibility = v ? 'visible' : 'hidden'; },
      destroy: destroy
    };

    function fail(err) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas); // 退回静止的原画
      if (opts.onError) opts.onError(err);
      else if (global.console) console.warn('[waterfall]', err);
    }

    function initGL() {
      gl = canvas.getContext('webgl2', {
        alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false,
        preserveDrawingBuffer: fixed
      });
      if (!gl) throw new Error('WebGL2 不可用');
      resources = [];
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
        resources.push(tx);
        return tx;
      }

      tex(0, 0, 0, imgEl, gl.LINEAR_MIPMAP_LINEAR, gl.CLAMP_TO_EDGE);
      gl.generateMipmap(gl.TEXTURE_2D);
      var W = canvas.width, H = canvas.height;
      var tBlur = tex(1, W, H, null, gl.LINEAR, gl.CLAMP_TO_EDGE);
      var tEn = tex(2, W, H, null, gl.LINEAR, gl.CLAMP_TO_EDGE);
      var rnd = mulberry32(8290829), nz = new Uint8Array(256 * 256 * 4);
      for (var i = 0; i < nz.length; i++) nz[i] = (rnd() * 256) | 0;
      tex(3, 256, 256, nz, gl.LINEAR, gl.REPEAT);

      function common(p) {
        gl.useProgram(p);
        gl.uniform1i(gl.getUniformLocation(p, 'uImg'), 0);
        gl.uniform2f(gl.getUniformLocation(p, 'uBasis'), BW, BH);
        gl.uniform4f(gl.getUniformLocation(p, 'uRect'), R.x0, R.y0, R.w, R.h);
        gl.uniform4f(gl.getUniformLocation(p, 'uRing'), G.cx, G.ringY, G.ringRx, G.ringRy);
        gl.uniform4f(gl.getUniformLocation(p, 'uFall'), G.top, G.bot, G.hwT, G.hwB);
        gl.uniform1f(gl.getUniformLocation(p, 'uCxBot'), G.cxB);
      }

      var fb = gl.createFramebuffer();
      gl.viewport(0, 0, W, H);
      // 预处理 1：竖向抹匀
      var pBlur = program(gl, FRAG_BLUR);
      common(pBlur);
      // 每个采样点的间距；高斯半径 = 10 个点，默认抹 8 个单位：亮点抹掉，细水线留着
      gl.uniform1f(gl.getUniformLocation(pBlur, 'uSpread'), (opts.smear == null ? 8 : opts.smear) / 10);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tBlur, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // 预处理 2：细节强弱
      var pEn = program(gl, FRAG_EN);
      common(pEn);
      gl.uniform1i(gl.getUniformLocation(pEn, 'uBlur'), 1);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tEn, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fb);
      gl.deleteProgram(pBlur); gl.deleteProgram(pEn);

      prog = program(gl, FRAG_MAIN);
      common(prog);
      gl.uniform1i(gl.getUniformLocation(prog, 'uBlur'), 1);
      gl.uniform1i(gl.getUniformLocation(prog, 'uEn'), 2);
      gl.uniform1i(gl.getUniformLocation(prog, 'uNoise'), 3);
      gl.uniform4f(gl.getUniformLocation(prog, 'uOpen'), G.oCx, G.oY, G.oRx, G.oRy);
      var srcY0 = G.top + 46, srcH = (G.bot - 82) - srcY0;
      var L = G.bot - G.top;
      var K = 2 * L * Math.sqrt(0.8) / srcH;          // 中段不拉伸不压缩
      gl.uniform4f(gl.getUniformLocation(prog, 'uFlow'), K, 0, srcY0, srcH);
      gl.uniform4f(gl.getUniformLocation(prog, 'uTune'),
        opts.gainFront == null ? 1.3 : opts.gainFront,   // 朝我们这面的亮点
        opts.gainBack == null ? 0.5 : opts.gainBack,      // 背面的亮点
        opts.gainLine == null ? 1.1 : opts.gainLine,      // 水线明暗起伏的深浅
        opts.debug ? 1 : 0);
      gl.uniform1f(gl.getUniformLocation(prog, 'uSway'), opts.sway == null ? 0.8 : opts.sway); // 水线左右弯的幅度，0 关掉
      gl.uniform1f(gl.getUniformLocation(prog, 'uMBGain'), opts.motionBlurGain == null ? 0.06 : opts.motionBlurGain);
      uT = gl.getUniformLocation(prog, 'uT');
      uPh = gl.getUniformLocation(prog, 'uPh');
      uMB = gl.getUniformLocation(prog, 'uMB');
      uDrops = gl.getUniformLocation(prog, 'uDrops');
      uSplash = gl.getUniformLocation(prog, 'uSplash');
      gl.viewport(0, 0, W, H);
    }

    function draw() {
      if (!gl || !prog) return;
      gl.uniform1f(uT, t % 3600);
      gl.uniform1f(uPh, ph % 8192);
      // 亮点的样子默认不动。只有拧到很快、一帧走得超过 MB_FREE 时，才把超出的那一小截沿流向抹开，免得亮点一帧一跳；高刷新率屏幕上基本用不到
      var mbk = opts.motionBlur == null ? DEFAULT_MB : opts.motionBlur;
      gl.uniform1f(uMB, mbk * Math.max(0, BASE_SPEED * par.speed * frameDt - MB_FREE));
      gl.uniform2f(uDrops, par.drops, Math.min(275, Math.max(0, Math.round(SPLASH_BASE * par.splash))));
      gl.uniform1f(uSplash, par.splash);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function frame(now) {
      if (!running) return;
      var dt = Math.max(0, (now - last) / 1000);
      last = now;
      t += dt;
      ph += dt * rate();
      if (dt > 0.003 && dt < 0.05) frameDt += (dt - frameDt) * 0.1;
      if (opts.drawFrame) opts.drawFrame(now, draw); else draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || destroyed || !ready || !wantRun || !visible || fixed) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onLost(e) { e.preventDefault(); stop(); ready = false; prog = null; }
    function onRestored() { try { initGL(); ready = true; draw(); start(); } catch (err) { fail(err); } }

    function begin() {
      if (destroyed) return;
      try {
        container.appendChild(canvas);
        initGL();
        ready = true;
        draw();
      } catch (err) { fail(err); return; }
      canvas.addEventListener('webglcontextlost', onLost, false);
      canvas.addEventListener('webglcontextrestored', onRestored, false);
      if (global.IntersectionObserver && !fixed) {
        io = new IntersectionObserver(function (es) {
          visible = es[es.length - 1].isIntersecting;
          if (visible) start(); else stop();
        });
        io.observe(canvas);
      }
      start();
      if (opts.onReady) opts.onReady(handle);
    }

    function destroy() {
      destroyed = true;
      stop();
      if (io) io.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost, false);
      canvas.removeEventListener('webglcontextrestored', onRestored, false);
      if (gl) {
        resources.forEach(function (tx) { gl.deleteTexture(tx); });
        if (prog) gl.deleteProgram(prog);
        var ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
      gl = null; prog = null; ready = false;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    var src = opts.image;
    if (src && src.tagName) {
      imgEl = src;
      if (imgEl.complete && imgEl.naturalWidth) begin();
      else imgEl.addEventListener('load', begin, { once: true });
    } else {
      imgEl = new Image();
      imgEl.crossOrigin = 'anonymous';
      imgEl.onload = begin;
      imgEl.onerror = function () { fail(new Error('底图读不到')); };
      imgEl.src = src;
    }
    return handle;
  }

  global.WlyWaterfall = { mount: mount, DEFAULT_FALL: DEFAULT_FALL, DEFAULT_PARAMS: DEFAULT_PARAMS };
})(window);

/*
 * 灯效模块（wly0829.cn 首页第一屏）：水冷头小屏、显卡灯条、电源灯、内存条灯、水面波光、机箱右边的副屏
 *
 * 用法：
 *   var lights = WlyLights.mount(container, { image: imgOrUrl, gpu: 4, waterOn: false, bootSeconds: 4 });
 *   lights.set({ screen: 0.8, ramOn: false });   // 运行中改
 *   lights.pause(); lights.resume(); lights.destroy();
 *   lights.boot();                               // 重新开机（从暗到亮再来一遍）
 *
 * bootSeconds：挂上后的头几秒，各样灯先后亮起来、流动从慢到正常（默认 4，和风扇的 4 秒起转对齐；0 = 不要）。
 *
 * 每样两个参数：xxxOn 开关，加一个数。
 *   screen 小屏动的幅度（1 = 默认，云飘多快、光变多深）
 *   gpu    显卡灯条流动的快慢（默认 5；1 是 7.5 秒走一轮颜色，5 就是 1.5 秒一轮）
 *   psu    电源灯明暗的深浅（1 = 默认）
 *   ram    内存条灯流动的快慢（默认 5；1 是 9 秒一轮）
 *   water  波光的强弱（1 = 默认；水流的快慢不跟着变）
 *   panel  副屏里云、光、彩边的幅度（1 = 默认）。只有传了 opts.panel 才有这一处：
 *          opts.panel = { image: 亮屏那张小图（已读好的 <img>）, state: 首页随时改的状态, onBoot(时刻表) }
 *          时刻表 = { at(y): 开机后第几秒光流到画上的 y 这一行, done: 第几秒流满, now(): 开机现在走到第几秒 }
 *          （秒是灯效自己的钟：掉帧时比墙上的钟慢，字照它走才不会比光先到）；画布画上副屏时调 onLive()，
 *          收走、丢了或关掉时调 onGone()
 *          state：hover / press 第几格（没有是 -1）、ptr 指针在画上的位置（没有是 null）、pulse[4] 那一格的数几时到的或变的、
 *          off[4] 那一格熄没熄、offline 连不上、sheen 镜头退了几成。
 *
 * container：和整幅画一样大的定位容器（和瀑布模块同一个规矩）。模块在里面放一层，
 * 各处共用一张画布，位置用百分比；容器整体缩放、平移时不用任何同步。
 * 这一层要排在瀑布画布上面（内存条在瀑布画布的范围里）；默认 z-index 1，可用 opts.zIndex 改。
 *
 * 画不改：每块画布只输出“和原画差多少”（多出来的光直接加上去，要压暗的地方按比例压），
 * 没有差别的地方完全透明；关掉、暂停看原画时，看到的就是原画。
 *
 * 做法：
 *   小屏   下半屏的云海整片往右飘（飘出去的从另一边接回来，接缝用错开半屏的另一份盖住）；大块的明暗留在原地，
 *          所以太阳底下永远是暖的。远处的云顶、山、太阳圆盘不动，太阳的光一明一暗。
 *   灯条   不另画彩条：原画灯条上每个点的颜色沿色环一起往前挪，原画的彩虹就顺着灯条走，深浅和纹理都是原画的。
 *          光还照到旁边：显卡灯条在白壳上投一层跟着变色的柔光、格栅上的反光跟着走；内存条的光照到主板和瀑布水帘边上。
 *   开机   头 4 秒各样灯先后亮起来：电源灯、小屏（从黑里亮起）、显卡灯条、内存条（从灰白变彩色），流动从慢到正常。
 *   电源灯 灯本身在“浓绿、灯芯还亮着”和“发白”之间呼吸，白盒子上一圈绿光跟着明暗。
 *   波光   原画水面上的细亮纹顺着河往左下流（两份错开半拍交替），一小片一小片各闪各的，水面本身有很轻的波纹扭动。
 *   副屏   原画里是一块没通电的白板。开机时一道光从上往下扫过整块屏（边缘柔、轻轻起伏），扫满后屏沿的彩光点着、绕着屏边一圈圈走
 *          （变一轮颜色的快慢和内存条灯一样）；屏里两层云往右飘（和水冷屏的云海一个方向、一个快慢）、几道斜光慢慢移、玻璃上隔一阵扫过一道反光；屏的光照到旁边的白管、
 *          柱子和支脚上。四个图标是活的：机器人点头晃脑，沙漏隔一阵翻个个儿，维护那圈一直转（数变了多转一圈），
 *          温度计的水银柱跟着 CPU 温度升降。屏面有玻璃的厚度：上沿左沿压一道暗、斜着几道固定的高光（和机箱玻璃一个做法）。
 *          指针放上去那一格四边亮起一圈光（离指针近的那段最亮），底色不铺白、字照样清楚，按下暗一点；
 *          数到了或变了，从数字那里荡开一圈涟漪；
 *          没开机的那一格沉成暮紫色，温度计换成开机键；连不上时（电脑没开机也是）天黑了：整块屏是暮紫色的夜、几颗星、一弯月牙，所有动的都停住。
 *          字和数不在这里，是首页叠上去的活字。
 *
 * 下面的位置都是按 1672×941 定稿量的（单位：定稿图上的像素）。
 */
(function (global) {
  'use strict';

  var BASIS_W = 1672;
  var DEFAULT_PARAMS = {
    screen: 2, gpu: 10, psu: 2, ram: 10, water: 2,   // 本人 2026-11-13 12:22 定稿：小屏 2.00 · 显卡灯 10.00 · 电源灯 2.00 · 内存灯 10.00 · 波光 2.00
    screenOn: true, gpuOn: true, psuOn: true, ramOn: true, waterOn: true,
    panel: 1, panelOn: true
  };
  var KEYS = ['screen', 'gpu', 'psu', 'ram', 'water', 'panel'];

  var DEFAULT_GEOM = {
    screen: {
      rect: [786, 240, 1082, 428],   // 比屏幕大一圈：屏幕的光要映到周围的白边框上
      x0: 800.5, x1: 1067,
      // 屏幕上沿、下沿的 y，从 x0 到 x1 均匀 13 个点（上沿是拱的，下沿略往下鼓）
      top: [283.5, 269.5, 263.8, 260.3, 258.6, 257.3, 256.4, 256.3, 256.3, 256.5, 259.8, 264.8, 280],
      bottom: [406.5, 410, 410.5, 411, 410.3, 409.8, 409.2, 409.2, 409.6, 410.6, 412, 412.6, 401.5],
      sun: [913.5, 345.5, 38, 72],   // 圆心 x、y，半径，光晕范围
      sea: [362, 378],               // 云海从这两条线之间开始动；线以上是远处的云顶和山，不动
      speed: 10                      // 幅度 1 时云海每秒往右飘多少像素
    },
    gpu: {
      rect: [730, 499, 1036, 566],
      core: [742, 515.5, 966, 527.5],       // 灯条本身
      core2: [758, 528.5, 1030, 562],       // 灯条照在下面格栅上的那片颜色，跟着一起走
      axis: [1, 0], sat: [0.10, 0.28], sat2: [0.16, 0.36],
      period: 7.5, wave: 150,
      glow: [0.42, 3.0, 10]                 // 照在白壳上的柔光：多强、每步几像素（共 7 步）、铺多开
    },
    ram: {
      rect: [1046, 223, 1182, 421],         // 两边各多出一截：彩光要照到旁边的主板和瀑布水帘上
      core: [1081, 230, 1145.5, 414],
      core2: [0, 0, 0, 0],
      axis: [0, 1], sat: [0.12, 0.32], sat2: [1, 2],
      period: 9, wave: 120,
      glow: [0.32, 4.5, 12]
    },
    psu: {
      rect: [152, 732, 256, 836],
      led: [196.5, 211.5, 773.5, 798.5],    // 灯的左边 x、右边 x，左边那条竖边的上端 y、下端 y
      ledK: [0.333, 0.533],                 // 上沿、下沿每往右一像素抬高多少（透视）
      cap: [204, 776, 204, 790],            // 光晕绕着这一小段
      sigma: 24, period: 2.8                // 光晕范围；几秒一个明暗
    },
    water: {
      rect: [228, 744, 1420, 931],          // 最下面一条是前景的花，不碰
      fall: [1250, 748, 250, 345],          // 瀑布落水处那一带不管（瀑布模块自己有水圈）：圆心、内外半径
      flow: [-0.985, 0.17, 6, 15],          // 流向（往左、略往下）；远处、近处每秒流多少像素
      cycle: 2.6                            // 两份亮纹交替一轮的秒数
    },
    panel: {
      rect: [1424, 250, 1656, 730],         // 比外框大一圈：屏的光要照到旁边的白管、柱子和支脚上
      art: [1448, 272, 1632, 706],          // 亮屏那张小图盖在画上的哪一块
      frame: [1452, 276.5, 1628, 702],      // 白色外框的外沿
      glass: [1461.5, 286.5, 1618.5, 690.5],// 发光的玻璃
      radius: [6, 4],                       // 外框、玻璃的圆角
      edges: [286.5, 383, 478, 574, 690.5], // 四格的上下边（中间三条是屏上的细白线）
      // 快慢跟首页别的灯走（本人 2026-11-16 10:07：动画速度要和首页其他的统一）。那两处的滑杆变了，这里跟着变：
      // flow  屏沿彩光。1 = 同一处变一轮颜色的时间和内存条灯一样（现在 0.75 秒）；两轮彩虹绕屏一圈，所以 1.5 秒绕一圈，
      //       每分钟 40 圈，和风扇光环的彩光同速。要慢一半就写 0.5
      // drift 屏里的云。1 = 和水冷头小屏的云海一样快（现在每秒 30 像素）；远的那层走它的 0.8 倍，近的 1.2 倍
      flow: 1, drift: 1
    }
  };

  var VERT = '#version 300 es\n' +
    'in vec2 aPos; out vec2 vUv;\n' +
    'void main(){ vUv = vec2(aPos.x*0.5+0.5, 0.5-aPos.y*0.5); gl_Position = vec4(aPos,0.,1.); }\n';

  var COMMON = '#version 300 es\n' +
    'precision highp float;\n' +
    'uniform sampler2D uImg;\n' +
    'uniform vec4 uRect;\n' +   // 这块画布在画上的 x0,y0,w,h
    'uniform vec4 uTex;\n' +    // 贴图取的是画上的哪一块 x0,y0,w,h
    'uniform float uT;\n' +
    'uniform float uAmt;\n' +
    'uniform float uBoot;\n' +  // 开机：0 还没亮 → 1 全亮
    'in vec2 vUv; out vec4 o;\n' +
    'vec3 img(vec2 P){ return texture(uImg,(P-uTex.xy)/uTex.zw).rgb; }\n' +
    'vec3 imgLod(vec2 P,float l){ return textureLod(uImg,(P-uTex.xy)/uTex.zw,l).rgb; }\n' +
    'float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }\n' +
    'float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);\n' +
    '  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }\n' +
    'float edgeFade(float px){ vec2 e=min(vUv,1.-vUv)*uRect.zw; return smoothstep(0.,px,min(e.x,e.y)); }\n' +
    'float inBox(vec2 P,vec4 b,float f){ vec2 a=smoothstep(b.xy-f,b.xy+f,P)*(1.-smoothstep(b.zw-f,b.zw+f,P)); return a.x*a.y; }\n' +
    // 只输出“和原画差多少”：C 原画的颜色，T 想要的颜色，m 作用几成
    'vec4 deltaOut(vec3 C,vec3 T,float m){\n' +
    '  T=mix(C,clamp(T,0.,1.),m);\n' +
    '  vec3 r=T/max(C,vec3(.004));\n' +
    '  float a=clamp(1.-min(r.r,min(r.g,r.b)),0.,1.);\n' +
    '  return vec4(max(T-C*(1.-a),0.),a);\n' +
    '}\n';

  var HSV =
    'vec3 rgb2hsv(vec3 c){ vec4 K=vec4(0.,-1./3.,2./3.,-1.); vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));\n' +
    '  vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r)); float d=q.x-min(q.w,q.y);\n' +
    '  return vec3(abs(q.z+(q.w-q.y)/(6.*d+1e-10)),d/(q.x+1e-10),q.x); }\n' +
    'vec3 hsv2rgb(vec3 c){ vec4 K=vec4(1.,2./3.,1./3.,3.); vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);\n' +
    '  return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y); }\n';

  // 水冷头小屏
  var FRAG_SCREEN = COMMON +
    'uniform float uTop[13]; uniform float uBot[13];\n' +
    'uniform vec2 uX, uWrap, uTexSize; uniform vec4 uSun, uSea, uIn, uIn2; uniform float uS;\n' +   // uSea: 两条线, 每秒飘多少
    'float edgeDist(vec2 P){\n' +
    '  float k=clamp((P.x-uX.x)/(uX.y-uX.x),0.,1.)*12.; int i=int(min(floor(k),11.)); float f=k-float(i);\n' +
    '  float top=mix(uTop[i],uTop[i+1],f), bot=mix(uBot[i],uBot[i+1],f);\n' +
    '  return min(min(P.x-uX.x,uX.y-P.x),min(P.y-top,bot-P.y));\n' +
    '}\n' +
    // 横向用三次插值取样：云飘到半个像素的位置时不发虚，也不会忽清忽糊
    'vec3 imgCub(vec2 P){\n' +
    '  vec2 uv=(P-uTex.xy)/uTex.zw;\n' +
    '  float tx=uv.x*uTexSize.x-.5, i=floor(tx), f=tx-i, f2=f*f, f3=f2*f;\n' +
    '  vec4 w=vec4(-.5*f3+f2-.5*f,1.5*f3-2.5*f2+1.,-1.5*f3+2.*f2+.5*f,.5*f3-.5*f2);\n' +
    '  vec3 c=vec3(0.);\n' +
    '  for(int k=0;k<4;k++) c+=w[k]*textureLod(uImg,vec2((i+float(k)-.5)/uTexSize.x,uv.y),0.).rgb;\n' +
    '  return c;\n' +
    '}\n' +
    // 大块的明暗和颜色（太阳照出来的那一片暖、两边的蓝）：留在原地，不跟着云走
    'vec3 low(vec2 P){\n' +
    '  P=clamp(P,uIn.xy,uIn.zw);\n' +
    '  return (imgLod(P,4.)*2.+imgLod(P+vec2(9.,5.),4.)+imgLod(P+vec2(-9.,5.),4.)+imgLod(P+vec2(9.,-5.),4.)+imgLod(P+vec2(-9.,-5.),4.))/6.;\n' +
    '}\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  float d=edgeDist(P);\n' +
    '  float m=smoothstep(1.5,3.2,d);\n' +                 // 离边框一像素多就收住，边框不动
    '  float br=sin(uT*1.25)*.6+sin(uT*.53+1.3)*.4;\n' +
    '  float pu=br*.5+.2;\n' +                             // 太阳的光涨落：多数时候是往亮里走
    '  if(m<=0.){\n' +
    // 屏幕的光映在周围的白边框和水冷头上：很淡的一圈染色，跟着太阳的光一起涨落（只染白的，不染花和零件）
    '    vec3 C0=img(P);\n' +
    '    float mn=min(C0.r,min(C0.g,C0.b)), mx=max(C0.r,max(C0.g,C0.b));\n' +
    '    float k=exp(-d*d/40.)*smoothstep(.55,.78,mn)*(1.-smoothstep(.10,.28,(mx-mn)/max(mx,.01)))*(.16+.18*pu)*min(uAmt,2.)*uBoot*edgeFade(4.);\n' +
    '    if(k<.003){ o=vec4(0.); return; }\n' +
    '    vec3 sc=imgLod(clamp(P,uIn2.xy,uIn2.zw),3.5); sc/=max(sc.r,max(sc.g,sc.b));\n' +
    '    o=deltaOut(C0,C0*(1.-k*(1.-sc)),1.);\n' +
    '    return;\n' +
    '  }\n' +
    '  vec3 C=img(P);\n' +
    '  vec3 T=C;\n' +
    '  float ds=length(P-uSun.xy);\n' +
    '  vec2 bil=(vec2(vn(P*.05+vec2(uT*.07,uT*.04)),vn(P*.05+vec2(31.-uT*.05,uT*.045)))-.5)*2.;\n' +
    // 天上的云丝：只是慢慢翻涌（越靠边越少；太阳圆盘不晃）
    '  float sky=1.-smoothstep(uSea.x-34.,uSea.x-16.,P.y);\n' +
    '  float still=smoothstep(2.5,18.,d)*smoothstep(uSun.z*.95,uSun.z*1.5,ds);\n' +
    '  if(sky*still>.001) T=mix(C,imgCub(P+bil*2.2*min(uAmt,2.)*still),sky);\n' +
    // 云海：整片往右飘
    '  float sea=smoothstep(uSea.x,uSea.y,P.y)*smoothstep(3.,14.,min(P.x-uX.x,uX.y-P.x));\n' +
    '  if(sea>.001){\n' +
    '    float W=uWrap.y-uWrap.x;\n' +
    '    float u=(P.x-uWrap.x)/W-uS*uSea.z/W;\n' +
    '    float fa=fract(u), fb=fract(u+.5);\n' +
    '    vec2 wob=bil*1.1*min(uAmt,1.5);\n' +
    '    vec2 Pa=vec2(uWrap.x+fa*W,P.y)+wob, Pb=vec2(uWrap.x+fb*W,P.y)+wob;\n' +
    '    float wa=smoothstep(0.,.16,min(fa,1.-fa))*smoothstep(1.5,4.5,edgeDist(Pa));\n' +   // 接缝附近、或取到屏幕外面时，换另一份
    '    float wb=(1.-wa)*smoothstep(1.5,4.5,edgeDist(Pb));\n' +
    '    float ws=wa+wb;\n' +
    '    if(ws>.001){\n' +
    '      vec3 mv=low(P)+((imgCub(Pa)-low(Pa))*wa+(imgCub(Pb)-low(Pb))*wb)/max(sqrt(wa*wa+wb*wb),.001);\n' +
    '      T=mix(T,mv,sea*smoothstep(0.,.3,ws));\n' +
    '    }\n' +
    '  }\n' +
    // 太阳的光：一明一暗（多数时候是往亮里走），太阳底下云顶上那一道金光细碎地闪
    '  float glow=exp(-ds*ds/(uSun.w*uSun.w));\n' +
    '  T+=(T*.24+vec3(1.,.78,.45)*.12)*glow*pu*uAmt;\n' +
    '  vec2 gp=(P-vec2(uSun.x,uSun.y+12.))/vec2(46.,14.);\n' +
    '  T+=max(C-imgLod(P,2.),0.)*exp(-dot(gp,gp))*(vn(P*.35+vec2(uT*1.3,uT*.4))*2.2-.6)*uAmt;\n' +
    // 很慢的光芒：从太阳往外的几道，慢慢转（只在天上，不压到云海和太阳圆盘上）
    '  vec2 dv=(P-uSun.xy)/max(ds,1.);\n' +
    '  float ca=cos(uT*.045), sa=sin(uT*.045);\n' +
    '  vec2 rv=vec2(dv.x*ca-dv.y*sa,dv.x*sa+dv.y*ca);\n' +
    '  float ray=smoothstep(.42,.80,vn(rv*3.1+7.)*.55+vn(rv*6.3+21.)*.45);\n' +
    '  float rf=smoothstep(uSun.z*.9,uSun.z*1.3,ds)*exp(-ds/85.)*(1.-smoothstep(uSea.x-14.,uSea.x+4.,P.y));\n' +
    '  T+=vec3(1.,.86,.6)*ray*rf*.22*(.7+.5*pu)*uAmt;\n' +
    '  T=mix(C*vec3(.05,.06,.09),T,uBoot);\n' +            // 开机：屏从黑里亮起来
    '  T=clamp(T,0.,1.);\n' +
    '  o=vec4(T*m,m);\n' +
    '}\n';

  // 显卡灯条、内存条灯：原画的颜色沿色环往前挪
  var FRAG_STRIP = COMMON + HSV +
    'uniform float uPh, uWave;\n' +
    'uniform vec3 uGlow;\n' +   // 柔光：多强, 每步几像素, 铺多开
    'uniform vec2 uAxis, uSat, uSat2;\n' +
    'uniform vec4 uCore, uCore2;\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  float ef=edgeFade(3.);\n' +
    '  vec3 C=img(P);\n' +
    '  vec3 h=rgb2hsv(C);\n' +
    '  float z2=inBox(P,uCore2,2.5)*smoothstep(uSat2.x,uSat2.y,h.y);\n' +   // 照在旁边的那片反光
    '  float m=clamp(inBox(P,uCore,1.2)*smoothstep(uSat.x,uSat.y,h.y)+z2,0.,1.)*uAmt;\n' +
    '  float s=dot(P,uAxis);\n' +
    '  float gl=.5+.5*sin(6.2832*(s/uWave-uPh*2.));\n' +   // 顺着灯条走的一小段更亮一点
    '  vec3 T=C;\n' +
    '  if(m>.001){\n' +
    '    float hn=fract(h.x+uPh);\n' +
    // 这幅画里的灯：青、绿、蓝是浓的，粉、黄、橙是淡的。转过去的颜色守同一个规矩，不出现大红大紫的霓虹色
    '    float cool=smoothstep(.20,.36,hn)*(1.-smoothstep(.66,.80,hn));\n' +
    '    float sn=min(h.y,mix(.48,1.,cool))*(1.-.10*gl)*(1.-.15*z2);\n' +
    '    vec3 R=hsv2rgb(vec3(hn,sn,min(1.,h.z*(1.+.05*gl))));\n' +
    '    float l0=dot(C,vec3(.299,.587,.114)), l1=dot(R,vec3(.299,.587,.114));\n' +
    '    float kk=pow(l0/max(l1,.02),.6);\n' +
    // 转到蓝、紫这些天生偏暗的颜色时提一点亮，不出现发黑的一段；反光那片亮度不跟着变
    '    R=min(R*mix(clamp(kk,1.,1.7),clamp(kk,.6,1.7),z2),vec3(1.));\n' +
    // 开机前：没点亮的灯条是一条发灰的乳白，反光那片没有颜色
    '    vec3 off=mix(vec3(l0),C,.25)*mix(.42,.8,z2);\n' +
    '    T=mix(C,mix(off,R,uBoot),m);\n' +
    '  }\n' +
    // 光照在旁边的东西上：灯条两侧一片柔光，颜色跟着灯条走（亮的地方是染色，暗的地方再加一点光）
    '  if(uGlow.x>0.&&uBoot>0.){\n' +
    '    vec2 pr=vec2(uAxis.y,uAxis.x);\n' +
    '    vec3 g=vec3(0.); float wg=0., ws=0.;\n' +
    '    for(int i=-7;i<=7;i++){\n' +
    '      float fi=float(i), w=exp(-fi*fi/uGlow.z);\n' +
    '      vec2 Q=P+pr*fi*uGlow.y;\n' +
    '      vec3 hq=rgb2hsv(imgLod(Q,2.));\n' +
    '      float k=w*smoothstep(uSat.x,uSat.y,hq.y)*inBox(Q,uCore,2.);\n' +
    '      g+=hsv2rgb(vec3(fract(hq.x+uPh),.75,1.))*k; wg+=k; ws+=w;\n' +
    '    }\n' +
    '    if(wg>.0001){\n' +
    '      vec3 gc=g/wg;\n' +
    '      float s0=dot(uCore.xy,uAxis), s1=dot(uCore.zw,uAxis);\n' +
    '      float taper=smoothstep(s0-2.,s0+18.,s)*(1.-smoothstep(s1-18.,s1+2.,s));\n' +   // 两头收圆，不是一个方框
    '      float k=uGlow.x*min(1.,(wg/ws)*2.2)*taper*(.75+.25*gl)*(1.-m)*uAmt*uBoot;\n' +
    '      T=T*(1.-k*(1.-gc))+gc*k*.14*(1.-dot(T,vec3(.3333)));\n' +
    '    }\n' +
    '  }\n' +
    '  o=deltaOut(C,T,ef);\n' +
    '}\n';

  // 电源盒上的绿灯
  var FRAG_PSU = COMMON +
    'uniform vec4 uLed, uCap; uniform vec2 uSP, uLedK;\n' +   // uSP: 光晕范围, 周期
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  vec3 C=img(P);\n' +
    '  float k=.5-.5*cos(uT*6.2832/uSP.y); k=k*k*(3.-2.*k);\n' +   // 0 暗 → 1 亮，两头停得久一点
    '  float A=min(uAmt,2.);\n' +
    // 灯是个斜着的小方块（画在盒子侧面，有透视）：左右两条竖边，上下两条斜边
    '  float lx=P.x-uLed.x;\n' +
    '  float led=smoothstep(-.8,.8,min(min(lx,uLed.y-P.x),min(P.y-(uLed.z-lx*uLedK.x),(uLed.w-lx*uLedK.y)-P.y)));\n' +
    // 灯本身：暗的时候不是整块发灰——灯芯还亮着，颜色变浓变绿，外圈更深；亮的时候发白
    '  float core=smoothstep(.55,.85,min(C.r,C.b));\n' +
    '  vec3 dim=C*mix(vec3(.50,.60,.54),vec3(.34,.74,.50),core)*(1.-.22*max(A-1.,0.));\n' +
    '  dim=mix(C,dim,min(A,1.));\n' +
    '  vec3 lit=C*1.06+vec3(.12)*min(A,1.5);\n' +
    '  vec3 T=mix(C,mix(C*vec3(.20,.30,.24),mix(dim,lit,k),uBoot),led);\n' +   // 开机前灯是灭的
    '  A*=uBoot;\n' +
    // 光晕：一层绿光染在白盒子的面上（不染旁边的叶子），贴着灯再加一小圈亮光
    '  vec2 pa=P-uCap.xy, ba=uCap.zw-uCap.xy;\n' +
    '  float d=length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.,1.));\n' +
    '  vec3 Bl=imgLod(P,1.5);\n' +
    '  float surf=smoothstep(.50,.72,min(Bl.r,min(Bl.g,Bl.b)));\n' +
    '  vec3 gc=vec3(.34,1.,.58);\n' +
    '  float kk=pow(k,1.3), g2=d*d/(uSP.x*uSP.x);\n' +
    '  T*=1.-min(.8,A*.52*kk)*exp(-g2)*(1.-led)*surf*(1.-gc);\n' +
    '  T+=gc*A*.30*kk*exp(-g2*6.)*(1.-led);\n' +
    '  o=deltaOut(C,T,edgeFade(6.));\n' +
    '}\n';

  // 水面波光和流动
  var FRAG_WATER = COMMON +
    'uniform vec4 uFallZone, uFlow; uniform float uCyc;\n' +
    // 认水面看周围一片是不是水色（阳光照出的那几道暖白的亮斑也算），再把船、花、木头这些暖色的去掉
    'float waterAt(vec2 Q){\n' +
    '  vec3 B=imgLod(Q,2.6), B2=imgLod(Q,4.3);\n' +
    '  return smoothstep(.02,.09,B2.b-B2.r)*smoothstep(-.02,.06,B2.g-B2.r)*(1.-smoothstep(.10,.25,B.r-B.b));\n' +
    '}\n' +
    // 那里的细亮纹（比周围亮出来的部分）；不是水面上的不要
    'vec3 glintAt(vec2 Q){\n' +
    '  vec3 c=img(Q);\n' +
    '  return max(c-imgLod(Q,1.8),0.)*(1.-smoothstep(.14,.30,c.r-c.b))*waterAt(Q);\n' +
    '}\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  float keep=smoothstep(uFallZone.z,uFallZone.w,length((P-uFallZone.xy)*vec2(1.,3.7)));\n' +
    '  float m=keep*edgeFade(10.);\n' +
    '  if(m<=.002){ o=vec4(0.); return; }\n' +
    '  m*=waterAt(P);\n' +
    '  if(m<=.002){ o=vec4(0.); return; }\n' +
    '  vec3 C=img(P);\n' +
    '  m*=1.-smoothstep(.14,.30,C.r-C.b);\n' +             // 花、船、灯笼这些暖色的不碰
    '  float A=min(uAmt,2.5)*uBoot;\n' +
    '  float depth=clamp((P.y-uRect.y)/uRect.w,0.,1.);\n' + // 0 远 → 1 近
    // 一大片一大片的亮，顺着水慢慢走：像阳光洒在流水上
    '  float env=.4+1.2*smoothstep(.28,.72,vn(P*vec2(.011,.028)+vec2(uT*.09,-uT*.02)));\n' +
    // 很轻的波纹扭动：只在离船、岸、花有一段距离的水面上
    '  float calm=smoothstep(.72,1.,m);\n' +
    '  vec2 rp=P*vec2(.06,.14);\n' +
    '  vec2 rip=(vec2(vn(rp+vec2(uT*.55,-uT*.1)),vn(rp*1.3+vec2(uT*.4+17.,-uT*.2)))-.5)*2.;\n' +
    '  vec2 Pw=P+rip*mix(.9,1.9,depth)*min(A,2.)*calm;\n' +
    '  vec3 Cw=img(Pw);\n' +
    // 亮纹顺着河往左下流：两份错开半拍交替，哪一份走远了就悄悄换回来；各处换的时刻错开，不会整条河一起一明一暗
    '  float sp=mix(uFlow.z,uFlow.w,depth);\n' +
    '  float ph=uT/uCyc+vn(P*.006)*.6;\n' +
    '  float f1=fract(ph), f2=fract(ph+.5);\n' +
    '  float w1=1.-abs(f1*2.-1.); w1=w1*w1*(3.-2.*w1); float w2=1.-w1;\n' +
    '  vec2 dir=uFlow.xy*sp*uCyc;\n' +
    '  vec3 hf=(glintAt(Pw-dir*(f1-.5))*w1+glintAt(Pw-dir*(f2-.5))*w2)/sqrt(w1*w1+w2*w2);\n' +
    '  vec3 h0=max(Cw-imgLod(Pw,1.8),0.);\n' +             // 原地的亮纹：拿掉大半，换成流动的
    // 一小片一小片各闪各的
    '  float sc=mix(.36,.17,depth);\n' +
    '  vec2 q=P*vec2(sc,sc*2.);\n' +
    '  float n1=vn(q+vec2(uT*.5,-uT*.06)), n2=vn(q*.45+vec2(-uT*.2,uT*.15)+19.7);\n' +
    '  float tw=smoothstep(.25,.80,n1*.6+n2*.4);\n' +
    '  vec3 T=Cw-h0*.75*min(A,1.)+hf*(.55+2.3*tw)*env*A;\n' +
    // 最亮的地方再跳几颗星点：流动的亮纹上，和阳光照着的那几片水面上
    '  float hl=dot(hf,vec3(.3333));\n' +
    '  float sun=smoothstep(.70,.90,dot(imgLod(P,2.6),vec3(.3333)));\n' +
    '  T+=vec3(1.,.97,.9)*(smoothstep(.05,.2,hl)*pow(tw,4.)*.45+sun*pow(vn(P*.5+vec2(uT*1.7,-uT*.25)),6.)*1.1)*env*A;\n' +
    '  o=deltaOut(C,T,m);\n' +
    '}\n';

  // 机箱右边的副屏：原画里是没通电的白板。亮屏那张小图（uArt，屏、图标、分隔线都是画好的）盖上去，
  // 里面会动的云、光、彩边和开机时流下来的光是这里算的；屏上的字和数是首页叠的活字
  var FRAG_PANEL = COMMON +
    'uniform sampler2D uArt;\n' +
    'uniform vec4 uArtRect, uFrame, uGlass;\n' +   // 小图盖在画上的哪一块；白色外框的外沿；发光的玻璃
    'uniform vec4 uCellE, uPulse, uOff;\n' +       // 每一格：亮暗（放上去 1、按下是负的）、数到了或变了多少秒、熄没熄
    'uniform vec3 uPtr;\n' +                       // 指针在画上的 x、y，在不在屏上
    'uniform vec2 uRad;\n' +                       // 外框、玻璃的圆角
    'uniform float uEdge[5];\n' +                  // 四格的上下边
    'uniform float uLive, uSheen, uTemp;\n' +      // 连得上 1 → 连不上 0；镜头退了几成；CPU 多热（0 凉 → 1 烫，负的是没读到）
    'uniform vec2 uFlow;\n' +                     // 屏沿彩光走到一轮颜色的第几成；云往右飘了多少像素（快慢都跟着首页别的灯）
    'float sdBox(vec2 P,vec4 b,float r){ vec2 q=abs(P-(b.xy+b.zw)*.5)-(b.zw-b.xy)*.5+r; return length(max(q,0.))+min(max(q.x,q.y),0.)-r; }\n' +
    'float fbm(vec2 p){ float a=.5,s=0.; for(int i=0;i<4;i++){ s+=a*vn(p); p=p*2.03+vec2(17.1,9.2); a*=.5; } return s; }\n' +
    'vec3 hue(float h){ return clamp(abs(fract(h+vec3(0.,.6667,.3333))*6.-3.)-1.,0.,1.); }\n' +
    'float pick(vec4 v,float y){ return mix(mix(mix(v.x,v.y,smoothstep(uEdge[1]-1.,uEdge[1]+1.,y)),v.z,smoothstep(uEdge[2]-1.,uEdge[2]+1.,y)),v.w,smoothstep(uEdge[3]-1.,uEdge[3]+1.,y)); }\n' +
    // 沿屏边顺时针走了几成（从左上角起）
    'float along(vec2 P){\n' +
    '  vec2 h=(uGlass.zw-uGlass.xy)*.5, d=P-(uGlass.xy+uGlass.zw)*.5, q=abs(d)-h;\n' +
    '  float W=h.x*2., H=h.y*2.;\n' +
    '  float s=q.y>q.x ? (d.y<0. ? d.x+h.x : W+H+h.x-d.x) : (d.x>0. ? W+d.y+h.y : 2.*W+H+h.y-d.y);\n' +
    '  return s/(2.*(W+H));\n' +
    '}\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  vec3 C=img(P);\n' +
    '  float dF=sdBox(P,uFrame,uRad.x), dG=sdBox(P,uGlass,uRad.y);\n' +   // 负的在里面
    '  float A=min(uAmt,2.);\n' +
    // 开机分三段（uBoot 0→1）：0–.70 光从上往下流满；.62–.86 屏沿的彩光点着；之后多出来的那点亮收回去
    '  float rev=clamp(uBoot/.70,0.,1.);\n' +
    '  float rimK=smoothstep(.62,.86,uBoot)*mix(.28,1.,uLive);\n' +
    '  float s=along(P);\n' +
    '  vec3 rc=mix(vec3(1.),hue(s*2.-uFlow.x),.60);\n' +                  // 彩光的颜色：两轮彩虹绕屏一圈，顺着屏边走
    '  rc=mix(vec3(.80,.84,1.),rc,.3+.7*uLive);\n' +                      // 夜里收成很淡的月白
    '  float comet=.2+.12*cos(6.2832*(s*2.-uFlow.x));\n' +                // 彩光里略亮的一段，跟着颜色一起走（和灯条上略亮的那一小段一个意思；不另跑一颗亮点）
    '  float br=sin(uT*1.25)*.6+sin(uT*.53+1.3)*.4;\n' +                  // 一明一暗，和水冷头小屏同一个节奏（5 秒、12 秒两个起伏叠着）
    '  vec4 outv=vec4(0.);\n' +
    '  if(dF>-3.4){\n' +
    // 框以外：屏的光照到旁边白的东西上（白管、柱子、支脚；不染花和叶子），颜色是那一段屏面和彩边的颜色
    '    vec2 gq=clamp(P,uGlass.xy+7.,uGlass.zw-7.);\n' +
    '    float mn=min(C.r,min(C.g,C.b)), mx=max(C.r,max(C.g,C.b));\n' +
    '    float white=smoothstep(.50,.76,mn)*(1.-smoothstep(.10,.30,(mx-mn)/max(mx,.01)));\n' +
    '    float k=exp(-dF*dF/190.)*white*(.34+.12*br+.25*comet)*A*rimK*(1.-.75*pick(uOff,gq.y))*edgeFade(5.);\n' +
    '    if(k>.003){\n' +
    '      vec3 sc=textureLod(uArt,(gq-uArtRect.xy)/uArtRect.zw,3.).rgb; sc/=max(sc.r,max(sc.g,sc.b));\n' +
    '      vec3 cc=mix(sc,rc,.55);\n' +
    '      outv=deltaOut(C,C*(1.-k*(1.-cc))+cc*k*.10*(1.-dot(C,vec3(.3333))),1.);\n' +
    '    }\n' +
    '    if(dF>-.5){ o=outv; return; }\n' +
    '  }\n' +
    '  int ii=int(step(uEdge[1],P.y)+step(uEdge[2],P.y)+step(uEdge[3],P.y));\n' +   // 这是第几格
    '  float y0=uEdge[ii], y1=uEdge[ii+1];\n' +
    '  float tp=ii==0?uPulse.x:ii==1?uPulse.y:ii==2?uPulse.z:uPulse.w;\n' +
    '  float dc=min(min(P.x-uGlass.x,uGlass.z-P.x),min(P.y-y0,y1-P.y));\n' +          // 离这一格四边最近的那条有多远
    // 数到了或变了：像水面落了一滴，从数字那里荡开一圈涟漪，玻璃后面的云、图标的线跟着晃一下（rip：这一处被推开多少）。
    // 圈从数字外面起、淡着出来，不压在数字上（压着的那一下静下来看像数字糊了一圈）
    '  vec2 rv=P-vec2(uGlass.x+44.,y0+66.); float pr=length(rv);\n' +
    '  float rx=(pr-34.-tp*104.)/(5.+tp*12.), rx2=(pr-34.-(tp-.2)*104.)/(5.+tp*12.);\n' +        // 两圈：第二圈晚一点、弱一点
    '  float rk=smoothstep(0.,.16,tp)*pow(max(0.,1.-tp/1.3),1.5)*smoothstep(0.,9.,dc), rk2=rk*.55*smoothstep(.2,.36,tp);\n' +
    '  vec2 rip=rv/max(pr,1.)*(-rx*exp(-rx*rx)*rk-rx2*exp(-rx2*rx2)*rk2)*6.;\n' +
    '  vec2 uv=(P+rip-uArtRect.xy)/uArtRect.zw;\n' +
    '  vec3 A0=texture(uArt,uv).rgb;\n' +
    '  vec3 ln=max(A0-textureLod(uArt,uv,2.6).rgb,0.);\n' +               // 画里的细白线（图标、分隔线）
    // 图标是活的：把图标的白线从底色上揭下来，转一转、挪一挪再放回去；底色原样不动（图标后面不留圆底）。
    // 底色怎么估：右边干净处同一行的颜色，加上“这一列比那一列亮多少”（在图标下面干净的一行量，屏边那点泛白也就算进去了）
    '  vec2 ic=vec2(uArtRect.x+37.8,uArtRect.y+(ii==0?38.:ii==1?139.:ii==2?233.:331.5));\n' +   // 这一格图标的中心
    '  vec2 ip=P+rip-ic; float im=1.-smoothstep(18.5,20.5,length(ip));\n' +
    '  if(im>0.){\n' +
    '    vec2 sp=ip; float ang=0.;\n' +
    '    if(ii==0){ ang=sin(uT*1.3)*.11; sp.y+=pow(max(sin(uT*2.6),0.),3.)*1.7; }\n' +                            // 机器人：左右晃，隔一下往上一蹦
    '    else if(ii==1){ float fk=clamp(fract(uT/9.)/.12,0.,1.); ang=3.14159*(floor(uT/9.)+fk*fk*(3.-2.*fk)); }\n' +  // 沙漏：每 9 秒翻个个儿
    '    else if(ii==2){ ang=-(uT*.7+6.2832*(1.-exp(-tp*2.2))); }\n' +                                             // 维护：一直顺时针转，数变了多转一圈
    '    float ca=cos(ang), sa=sin(ang); sp=vec2(ca*sp.x-sa*sp.y,sa*sp.x+ca*sp.y);\n' +
    '    float bx=(ic.x+26.-uArtRect.x)/uArtRect.z, by=(ic.y+26.-uArtRect.y)/uArtRect.w;\n' +
    '    vec3 bgc=texture(uArt,vec2(bx,by)).rgb;\n' +
    '    vec2 u1=(ic+sp-uArtRect.xy)/uArtRect.zw;\n' +
    '    vec3 bg0=texture(uArt,vec2(bx,uv.y)).rgb+texture(uArt,vec2(uv.x,by)).rgb-bgc;\n' +
    '    vec3 bg1=texture(uArt,vec2(bx,u1.y)).rgb+texture(uArt,vec2(u1.x,by)).rgb-bgc;\n' +
    '    vec3 was=max(A0-bg0,0.), lines=max(texture(uArt,u1).rgb-bg1,0.);\n' +   // 原来在这儿的白线；挪过来的白线
    '    if(ii==3&&uTemp>=0.){\n' +                                        // 温度计：管子里的水银柱照温度重画，顶上轻轻晃
    '      float lv=mix(1.5,-12.5,uTemp)+sin(uT*2.1)*.35;\n' +
    '      float col=1.-smoothstep(1.,2.,abs(sp.x-.45));\n' +
    '      float tube=(1.-smoothstep(2.3,2.9,abs(sp.x-.45)))*step(-15.,sp.y)*(1.-smoothstep(1.5,3.,sp.y));\n' +
    '      lines=mix(lines,vec3(.93)*col*smoothstep(lv-.7,lv+.7,sp.y),tube);\n' +
    '    }\n' +
    '    A0+=(lines-was)*im; ln=mix(ln,lines,im);\n' +
    // 没开机、连不上：第四格的温度计换成开机键（缺口朝上的一个圈、中间一竖），和“电脑 没开机”对得上。
    // 这一处连底色一起换成估出来的干净底色，温度计的线一点不留
    '    if(ii==3&&uOff.w>.001){\n' +
    '      vec2 bp=sp-vec2(0.,1.5); float bl=length(bp);\n' +
    '      float bd=-bp.y>.814*bl ? length(vec2(abs(bp.x)-6.68,bp.y+9.36)) : abs(bl-11.5);\n' +
    '      bd=min(bd,length(vec2(bp.x,bp.y-clamp(bp.y,-14.5,-3.))));\n' +
    '      vec3 bw=max(vec3(.995)-bg0,0.)*(1.-smoothstep(.75,1.75,bd));\n' +
    '      A0=mix(A0,bg0+bw,im*uOff.w); ln=mix(ln,bw,im*uOff.w);\n' +
    '    }\n' +
    '  }\n' +
    '  vec3 L=A0;\n' +
    '  float glass=1.-smoothstep(-1.4,.8,dG);\n' +                        // 玻璃里面是 1
    '  vec2 q=P-uGlass.xy, gs=uGlass.zw-uGlass.xy;\n' +
    '  float off=pick(uOff,P.y), e=pick(uCellE,P.y), on=1.-off;\n' +
    // 屏边那一条和白边框上画里原有的彩色先去掉，换成下面会走的
    '  float bz=step(0.,dG);\n' +
    '  L=mix(L,vec3(max(L.r,max(L.g,L.b))),max((1.-smoothstep(.8,2.6,abs(dG)))*.85,bz*.9));\n' +
    // 云：两层，往右飘（快慢跟水冷头小屏的云海走：远的慢一点、近的快一点）；指针一动云错开一点，像隔着玻璃看进去
    '  vec2 par=(uPtr.xy-(uGlass.xy+uGlass.zw)*.5)*uPtr.z;\n' +
    '  vec2 qc=q+rip*3.;\n' +
    '  vec2 c1=vec2(qc.x-uFlow.y*.8,qc.y)*vec2(.017,.036)-par*.0010;\n' +
    '  vec2 c2=vec2(qc.x-uFlow.y*1.2,qc.y)*vec2(.031,.060)+vec2(11.,3.)-par*.0020;\n' +
    '  float n1=fbm(c1), n2=fbm(c2+n1*.7);\n' +
    '  float cloud=smoothstep(.42,.72,n1*.62+n2*.46), wisp=smoothstep(.50,.78,n2);\n' +
    '  L=mix(L,mix(L,vec3(1.,.95,.96),.52),(cloud*.36+wisp*.12)*glass*on*min(A,1.6));\n' +
    // 几道斜光（和花园左上角那几道阳光一个斜法），很慢地移
    '  float ru=(q.x+q.y*.62)*.021;\n' +
    '  float ray=smoothstep(.50,.88,vn(vec2(ru+uT*.035,.5))*.6+vn(vec2(ru*2.3-uT*.05,4.))*.4);\n' +
    '  L+=vec3(1.,.90,.80)*ray*.085*(1.-.55*q.y/gs.y)*glass*on*A;\n' +
    '  L*=1.+(.035*br+.015)*glass*on*A;\n' +                              // 整块屏很慢地一明一暗
    // 玻璃反光：一道斜的亮带隔一阵扫过去；镜头往后退时另有一道跟着走
    '  float du=(q.x+q.y*.45)/gs.x, sw=fract(uT/10.);\n' +
    '  float sh1=exp(-pow((du-mix(-.7,3.6,smoothstep(0.,.30,sw)))/.20,2.))*(1.-smoothstep(.26,.30,sw));\n' +
    '  float sh2=exp(-pow((du-mix(-.6,3.5,uSheen))/.30,2.))*smoothstep(0.,.03,uSheen)*(1.-smoothstep(.97,1.,uSheen));\n' +
    '  L+=vec3(1.,.98,.96)*(sh1*.12+sh2*.15)*glass*(1.-.6*off);\n' +
    // 玻璃的厚度（和机箱那块玻璃一个做法）：屏面比白框低一层，上沿、左沿压一道暗，四周一圈很淡的暗角；
    // 斜着三道固定的高光（一道宽的、紧挨一道细的，远处再一道淡的），不动
    '  float inT=P.y-uGlass.y, inL=P.x-uGlass.x, inB=uGlass.w-P.y, inR=uGlass.z-P.x;\n' +
    '  float shade=exp(-inT/6.)*.24+exp(-inL/5.)*.14+(1.-smoothstep(0.,24.,min(min(inT,inB),min(inL,inR))))*.09;\n' +
    '  L*=mix(vec3(1.),vec3(.58,.48,.74),shade*glass);\n' +
    '  float gg=(q.x+q.y*.49)/(gs.x+gs.y*.49);\n' +
    '  float g1=smoothstep(.150,.185,gg)*(1.-smoothstep(.185,.300,gg)), g2=smoothstep(.335,.352,gg)*(1.-smoothstep(.352,.378,gg));\n' +
    '  float g3=smoothstep(.70,.74,gg)*(1.-smoothstep(.74,.80,gg));\n' +
    '  L+=vec3(1.,.99,.98)*(g1*.105+g2*.06+g3*.04)*glass;\n' +
    // 指针：放上去的那一格不往整格铺白（白字会看不清）——底色反而沉一点、艳一点，四边亮起一圈光，
    // 离指针近的那段边最亮；图标的线跟着亮；按下整格暗一点。玻璃上另有很淡的一点柔光跟着指针走
    '  float pd=length(P-uPtr.xy), spot=exp(-pd*pd/5400.)*uPtr.z;\n' +
    '  float eh=max(e,0.), lh=dot(L,vec3(.299,.587,.114));\n' +
    '  L=mix(L,(vec3(lh)+(L-vec3(lh))*1.25)*.95,eh*glass);\n' +
    '  L*=1.+.16*min(e,0.)*glass;\n' +
    '  float nearp=exp(-pd*pd/2600.)*uPtr.z;\n' +
    '  float edge=exp(-max(dc,0.)/1.5)*(.40+.50*nearp)+exp(-max(dc,0.)/8.)*(.06+.15*nearp);\n' +
    '  L+=vec3(1.,.97,.95)*edge*eh*glass;\n' +
    '  L+=vec3(1.,.96,.92)*spot*.03*glass;\n' +
    '  L+=ln*(eh*1.1+1.6*exp(-tp*3.))*glass;\n' +
    // 涟漪的明暗：浪头一线亮（带一点虹彩）、紧跟着一线暗；那一格跟着亮一下再落回去
    '  float crest=exp(-rx*rx*1.7)*rk+exp(-rx2*rx2*1.7)*rk2;\n' +
    '  float trough=exp(-(rx+1.6)*(rx+1.6)*1.2)*rk+exp(-(rx2+1.6)*(rx2+1.6)*1.2)*rk2;\n' +
    '  L*=1.+(crest*.20-trough*.07)*glass;\n' +
    '  L+=mix(vec3(1.),hue(pr*.012-uT*.3),.25)*crest*.06*glass;\n' +
    '  L*=1.+.09*exp(-tp*3.2)*glass;\n' +
    // 没开机的那一格、连不上（电脑没开机时也是）的整块屏：天黑了，但不是黑屏——沉成暮紫色，上深下浅，底下留一点晚霞；
    // 连不上时还有几颗看得清的星、右上角一弯月牙。时间停了，云、光、星都不动
    '  float lum=dot(L,vec3(.299,.587,.114)), gy=q.y/gs.y;\n' +
    '  vec3 dusk=(mix(vec3(.37,.32,.66),vec3(.48,.40,.75),gy)+vec3(.06,.03,.02)*gy*gy*gy)*(.82+.32*lum);\n' +
    '  dusk+=vec3(.95,.93,1.)*max(lum-.90,0.)*1.4;\n' +                    // 图标、分隔线这些白线留着
    '  vec2 sg=floor(q/7.), sf=fract(q/7.)-.5-(vec2(hash(sg+1.7),hash(sg+5.3))-.5)*.24;\n' +
    '  float sb=hash(sg+7.), big=step(.80,sb);\n' +
    '  float star=step(.955,hash(sg))*exp(-dot(sf,sf)*mix(34.,18.,big))*(.50+.50*sb)*(1.-.55*gy);\n' +
    '  vec2 mp=q-vec2(gs.x-17.,19.);\n' +
    '  float moon=(1.-smoothstep(6.3,7.2,length(mp)))*smoothstep(5.6,6.6,length(mp-vec2(3.1,-2.2)));\n' +
    '  vec3 night=dusk+vec3(1.,.97,.90)*(star*.95+moon*.80+exp(-length(mp)/7.)*.10);\n' +
    '  L=mix(L,dusk*.92,off*glass);\n' +
    '  L=mix(L,night,(1.-uLive)*glass);\n' +
    // 屏沿的彩光：屏边那一条、往屏里晕开的一点、白边框上的反光
    '  float line=exp(-dG*dG/2.4), gain=rimK*(1.-.7*off);\n' +
    '  L=mix(L,rc,line*.88*gain);\n' +
    '  L+=rc*exp(min(dG,0.)/4.5)*(1.-bz)*.16*gain*(1.+1.4*comet)*min(A,1.6);\n' +
    '  L*=1.-exp(-max(dG,0.)/5.)*bz*(.42+.3*comet)*gain*(1.-rc);\n' +
    '  L+=vec3(1.)*line*comet*.45*gain;\n' +
    // 开机：一道干净的光从上往下扫过整块屏，扫到哪亮到哪；光的下沿柔一点、左右轻轻起伏（不再有往下滴的细线，那个静下来看像花屏）
    '  float front=uFrame.y-8.+(uFrame.w-uFrame.y+16.)*rev+(sin(P.x*.045+uT*3.1)*2.6+sin(P.x*.11-uT*4.3)*1.1)*sin(3.1416*rev);\n' +
    '  float falling=step(.002,rev)*(1.-step(.998,rev));\n' +
    '  L+=vec3(1.,.97,.90)*(exp(-abs(P.y-front)/4.)*.62+exp(-max(front-P.y,0.)/44.)*.28)*falling;\n' +
    '  L*=1.+.13*smoothstep(.62,.72,uBoot)*(1.-smoothstep(.72,1.,uBoot))*glass;\n' +   // 流满的那一下亮一点，再收回去
    '  float m=(1.-smoothstep(-3.2,-.6,dF))*(1.-smoothstep(front-4.,front+4.,P.y));\n' +
    '  o=mix(outv,vec4(clamp(L,0.,1.),1.),m);\n' +
    '}\n';

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
    var fixed = (opts.time != null);
    var geom = {};
    KEYS.forEach(function (k) { geom[k] = Object.assign({}, DEFAULT_GEOM[k], (opts.geom && opts.geom[k]) || {}); });
    var par = Object.assign({}, DEFAULT_PARAMS);
    function take(p) {
      if (!p) return;
      KEYS.forEach(function (k) {
        if (p[k] != null && typeof p[k] !== 'boolean' && isFinite(+p[k])) par[k] = Math.max(0, +p[k]);
        if (p[k + 'On'] != null) par[k + 'On'] = !!p[k + 'On'];
      });
    }
    take(opts);

    var root = document.createElement('div');
    root.setAttribute('aria-hidden', 'true');
    root.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:' +
      (opts.zIndex == null ? 1 : opts.zIndex) + ';';

    var imgEl = null, patches = [], raf = 0, running = false, destroyed = false, ready = false;
    var wantRun = !fixed, visible = true, shown = true, last = 0, io = null;
    var cpuMs = 0, frames = 0;

    // 开机：挂上后的头几秒各样灯先后亮起来（电源灯最先，小屏其次，显卡灯条、内存条依次），流动从慢到正常。
    // 下面的时刻按 4 秒写；bootSeconds 不是 4 就等比例拉伸，0 表示不要开机这一段
    var bootLen = opts.bootSeconds == null ? (fixed ? 0 : 4) : Math.max(0, +opts.bootSeconds);
    var bootT = fixed ? +opts.time : 0;
    var BOOT = { psu: [0, 0.7], screen: [0.5, 2.4], gpu: [0.9, 2.9], ram: [1.3, 3.3], water: [0, 1.2], panel: [1.3, 3.5] };
    function ease(x) { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); }
    function bootK(key) {
      if (!bootLen) return 1;
      var w = BOOT[key];
      return ease((bootT * 4 / bootLen - w[0]) / (w[1] - w[0]));
    }
    function bootSpeed(key) { return (!bootLen || key === 'water') ? 1 : 0.15 + 0.85 * ease(bootT / bootLen); }

    // 副屏：首页随时改的状态（放上去、按下、指针、熄了的格、连不上）在这里缓一缓再交给着色器
    var panel = (opts.panel && opts.panel.image) ? opts.panel : null;
    var pv = { e: [0, 0, 0, 0], off: [0, 0, 0, 0], ptr: [0, 0, 0], live: 1, temp: -1, rgb: 0, drift: 0 };
    // 快慢跟首页别的灯走：屏沿彩光每秒走几轮颜色（照内存条灯）、云每秒往右飘多少像素（照水冷头小屏的云海）
    function panelFlow() { return geom.panel.flow * par.ram / geom.ram.period; }
    function panelDrift() { return geom.panel.drift * par.screen * geom.screen.speed; }
    function toward(v, want, dt, rate) { return v + (want - v) * (1 - Math.exp(-dt * rate)); }
    function stepPanel(dt) {
      var s = panel.state || {}, dark = bootK('panel') < 0.02, i;
      for (i = 0; i < 4; i++) {
        var pressed = s.press === i, off = s.off && s.off[i] ? 1 : 0;
        pv.e[i] = toward(pv.e[i], pressed ? -0.7 : s.hover === i ? 1 : 0, dt, pressed ? 30 : 10);   // 放上去约 0.2 秒，按下约 0.09 秒
        pv.off[i] = dark ? off : toward(pv.off[i], off, dt, 4);                                     // 还没亮起来时不用过渡
      }
      if (s.ptr) { pv.ptr[0] = s.ptr[0]; pv.ptr[1] = s.ptr[1]; }
      pv.ptr[2] = toward(pv.ptr[2], s.ptr ? 1 : 0, dt, 8);
      pv.live = dark ? (s.offline ? 0 : 1) : toward(pv.live, s.offline ? 0 : 1, dt, 5);              // 连不上：约 0.6 秒褪色，时间跟着停
      // 水银柱：没读到温度就照画里原样；屏亮到第四格以后才从底下升上去
      pv.temp = !(s.temp >= 0) ? -1 : bootK('panel') < 0.62 ? 0 : toward(Math.max(pv.temp, 0), s.temp, dt, 1.6);
      var run = dt * bootSpeed('panel') * pv.live;                                                   // 开机时从慢到正常；连不上时跟着停
      pv.rgb = (pv.rgb + run * panelFlow()) % 1; pv.drift += run * panelDrift();
    }
    // 屏上的字是首页叠的：告诉它光几时流到哪一行（秒，从这次开机算起），它照着一行行显出来
    function easeInv(y) { var a = 0, b = 1, m, i; for (i = 0; i < 24; i++) { m = (a + b) / 2; if (ease(m) < y) a = m; else b = m; } return (a + b) / 2; }
    function panelSchedule() {
      var g = geom.panel, w = BOOT.panel, top = g.frame[1] - 8, span = g.frame[3] - g.frame[1] + 16, len = bootLen;
      function at(y) { return len ? (w[0] + (w[1] - w[0]) * easeInv(0.70 * Math.min(1, Math.max(0, (y - top) / span)))) * len / 4 : 0; }
      return { at: at, done: at(g.frame[3] + 8), now: function () { return bootT; } };
    }
    function panelOk() { return patches.some(function (P) { return P.key === 'panel' && on(P); }); }

    // 各处各用自己的画法，共用画布。speed()：时间走多快；amt()：幅度，并累计云飘多远，拖滑杆不跳。
    var DEFS = [
      { key: 'screen', frag: FRAG_SCREEN, res: 2, speed: function () { return 1; }, amt: function () { return par.screen; },
        init: function (gl, p, g) {
          gl.uniform1fv(gl.getUniformLocation(p, 'uTop'), new Float32Array(g.top));
          gl.uniform1fv(gl.getUniformLocation(p, 'uBot'), new Float32Array(g.bottom));
          gl.uniform2f(gl.getUniformLocation(p, 'uX'), g.x0, g.x1);
          gl.uniform2f(gl.getUniformLocation(p, 'uWrap'), g.x0 + 3, g.x1 - 3);
          gl.uniform4f(gl.getUniformLocation(p, 'uIn'), g.x0 + 18, g.sea[0] - 60, g.x1 - 18, Math.min.apply(null, g.bottom) - 6);
          gl.uniform4f(gl.getUniformLocation(p, 'uIn2'), g.x0 + 12, Math.max.apply(null, g.top) - 8, g.x1 - 12, Math.min.apply(null, g.bottom) - 6);
          gl.uniform4f(gl.getUniformLocation(p, 'uSun'), g.sun[0], g.sun[1], g.sun[2], g.sun[3]);
          gl.uniform4f(gl.getUniformLocation(p, 'uSea'), g.sea[0], g.sea[1], g.speed, 0);
        } },
      { key: 'gpu', frag: FRAG_STRIP, res: 2, strip: true, speed: function () { return par.gpu; }, amt: function () { return 1; } },
      { key: 'ram', frag: FRAG_STRIP, res: 2, strip: true, speed: function () { return par.ram; }, amt: function () { return 1; } },
      { key: 'psu', frag: FRAG_PSU, res: 2, speed: function () { return 1; }, amt: function () { return par.psu; },
        init: function (gl, p, g) {
          gl.uniform4f(gl.getUniformLocation(p, 'uLed'), g.led[0], g.led[1], g.led[2], g.led[3]);
          gl.uniform2f(gl.getUniformLocation(p, 'uLedK'), g.ledK[0], g.ledK[1]);
          gl.uniform4f(gl.getUniformLocation(p, 'uCap'), g.cap[0], g.cap[1], g.cap[2], g.cap[3]);
          gl.uniform2f(gl.getUniformLocation(p, 'uSP'), g.sigma, g.period);
        } },
      { key: 'water', frag: FRAG_WATER, res: 1, speed: function () { return 1; }, amt: function () { return par.water; },
        init: function (gl, p, g) {
          gl.uniform4f(gl.getUniformLocation(p, 'uFallZone'), g.fall[0], g.fall[1], g.fall[2], g.fall[3]);
          gl.uniform4f(gl.getUniformLocation(p, 'uFlow'), g.flow[0], g.flow[1], g.flow[2], g.flow[3]);
          gl.uniform1f(gl.getUniformLocation(p, 'uCyc'), g.cycle);
        } },
      { key: 'panel', frag: FRAG_PANEL, res: 1, speed: function () { return pv.live; }, amt: function () { return par.panel; },
        init: function (gl, p, g, P) {
          // 亮屏那张小图放在第二个贴图位（第一个是原画）
          P.tex2 = gl.createTexture();
          gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, P.tex2);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, panel.image);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.activeTexture(gl.TEXTURE0);
          gl.uniform1i(gl.getUniformLocation(p, 'uArt'), 1);
          gl.uniform4f(gl.getUniformLocation(p, 'uArtRect'), g.art[0], g.art[1], g.art[2] - g.art[0], g.art[3] - g.art[1]);
          gl.uniform4f(gl.getUniformLocation(p, 'uFrame'), g.frame[0], g.frame[1], g.frame[2], g.frame[3]);
          gl.uniform4f(gl.getUniformLocation(p, 'uGlass'), g.glass[0], g.glass[1], g.glass[2], g.glass[3]);
          gl.uniform2f(gl.getUniformLocation(p, 'uRad'), g.radius[0], g.radius[1]);
          gl.uniform1fv(gl.getUniformLocation(p, 'uEdge'), new Float32Array(g.edges));
          P.u = {};
          ['uCellE', 'uPulse', 'uOff', 'uPtr', 'uLive', 'uSheen', 'uTemp', 'uFlow'].forEach(function (n) { P.u[n] = gl.getUniformLocation(p, n); });
        },
        frame: function (gl, P) {
          var s = panel.state || {}, now = performance.now(), t = [9, 9, 9, 9], i;
          if (s.pulse) for (i = 0; i < 4; i++) if (s.pulse[i] && now >= s.pulse[i]) t[i] = Math.min(9, (now - s.pulse[i]) / 1000);   // 时刻可以定在稍后
          gl.uniform4f(P.u.uCellE, pv.e[0], pv.e[1], pv.e[2], pv.e[3]);
          gl.uniform4f(P.u.uPulse, t[0], t[1], t[2], t[3]);
          gl.uniform4f(P.u.uOff, pv.off[0], pv.off[1], pv.off[2], pv.off[3]);
          gl.uniform3f(P.u.uPtr, pv.ptr[0], pv.ptr[1], pv.ptr[2]);
          gl.uniform1f(P.u.uLive, pv.live);
          gl.uniform1f(P.u.uSheen, s.sheen || 0);
          gl.uniform1f(P.u.uTemp, pv.temp);
          gl.uniform2f(P.u.uFlow, pv.rgb, pv.drift % 1048576);
        } }
    ].filter(function (def) { return def.key !== 'panel' || panel; });   // 没给亮屏小图就没有副屏这一处

    // 各处共用一个上下文，取各矩形的并集；各份着色器仍各画自己的区域。
    var bounds = { x0: Infinity, y0: Infinity, x1: 0, y1: 0 };
    DEFS.forEach(function (def) { var r = geom[def.key].rect;
      bounds.x0 = Math.min(bounds.x0, r[0]); bounds.y0 = Math.min(bounds.y0, r[1]);
      bounds.x1 = Math.max(bounds.x1, r[2]); bounds.y1 = Math.max(bounds.y1, r[3]);
    });
    var res = opts.resolution || 1, canvas = document.createElement('canvas'), gl = null, quad = null, copyProgram = null;
    canvas.width = Math.round((bounds.x1 - bounds.x0) * res);
    canvas.height = Math.round((bounds.y1 - bounds.y0) * res);
    canvas.style.cssText = 'position:absolute;pointer-events:none;display:block;' +
      'left:' + (bounds.x0 / BW * 100) + '%;top:' + (bounds.y0 / BH * 100) + '%;' +
      'width:' + ((bounds.x1 - bounds.x0) / BW * 100) + '%;height:' + ((bounds.y1 - bounds.y0) / BH * 100) + '%;';
    function initContext() {
      gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false,
        depth: false, stencil: false, preserveDrawingBuffer: fixed });
      if (!gl) throw new Error('WebGL2 不可用');
      quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.DEPTH_TEST); gl.clearColor(0, 0, 0, 0);
      copyProgram = program(gl, '#version 300 es\nprecision highp float; uniform sampler2D uImg; in vec2 vUv; out vec4 o; void main(){o=texture(uImg,vec2(vUv.x,1.-vUv.y));}');
      gl.useProgram(copyProgram); gl.uniform1i(gl.getUniformLocation(copyProgram, 'uImg'), 0);
    }
    function onLost(e) { e.preventDefault(); stop(); patches.forEach(function (P) { P.ok = false; }); canvas.style.visibility = 'hidden'; sync(); }
    function onRestored() {
      try { initContext(); patches.forEach(function (P) { P.init(); }); drawAll(); sync(); canvas.style.visibility = ''; start(); }
      catch (err) { canvas.style.visibility = 'hidden'; fail(err); }
    }

    function makePatch(def) {
      var g = geom[def.key], r = g.rect;
      var R = { x0: r[0], y0: r[1], w: r[2] - r[0], h: r[3] - r[1] };
      var x0 = Math.round((R.x0 - bounds.x0) * res), x1 = Math.round((R.x0 + R.w - bounds.x0) * res);
      var y0 = Math.round((R.y0 - bounds.y0) * res), y1 = Math.round((R.y0 + R.h - bounds.y0) * res);
      var viewport = [x0, canvas.height - y1, x1 - x0, y1 - y0];
      var P = { def: def, key: def.key, canvas: canvas, R: R, gl: null, prog: null, tex: null, t: 0, s: 0, uT: null, uS: null, uPh: null, uAmt: null, ok: false };

      P.init = function () {
        P.gl = gl;
        // 贴图只取这块画布周围的一小块原画（多留一圈边给取样用）
        var M = 24, sc = imgEl.naturalWidth / BW;
        var cx0 = Math.max(0, Math.floor(R.x0 - M)), cy0 = Math.max(0, Math.floor(R.y0 - M));
        var cx1 = Math.min(BW, Math.ceil(R.x0 + R.w + M)), cy1 = Math.min(Math.floor(BH), Math.ceil(R.y0 + R.h + M));
        var crop = document.createElement('canvas');
        crop.width = Math.max(1, Math.round((cx1 - cx0) * sc));
        crop.height = Math.max(1, Math.round((cy1 - cy0) * sc));
        crop.getContext('2d').drawImage(imgEl, cx0 * sc, cy0 * sc, (cx1 - cx0) * sc, (cy1 - cy0) * sc, 0, 0, crop.width, crop.height);
        P.tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, P.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, crop);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        var p = P.prog = program(gl, def.frag);
        gl.useProgram(p);
        gl.uniform1i(gl.getUniformLocation(p, 'uImg'), 0);
        gl.uniform4f(gl.getUniformLocation(p, 'uRect'), R.x0, R.y0, R.w, R.h);
        gl.uniform4f(gl.getUniformLocation(p, 'uTex'), cx0, cy0, cx1 - cx0, cy1 - cy0);
        var uSize = gl.getUniformLocation(p, 'uTexSize');
        if (uSize) gl.uniform2f(uSize, crop.width, crop.height);
        if (def.strip) {
          gl.uniform4f(gl.getUniformLocation(p, 'uCore'), g.core[0], g.core[1], g.core[2], g.core[3]);
          gl.uniform4f(gl.getUniformLocation(p, 'uCore2'), g.core2[0], g.core2[1], g.core2[2], g.core2[3]);
          gl.uniform2f(gl.getUniformLocation(p, 'uAxis'), g.axis[0], g.axis[1]);
          gl.uniform2f(gl.getUniformLocation(p, 'uSat'), g.sat[0], g.sat[1]);
          gl.uniform2f(gl.getUniformLocation(p, 'uSat2'), g.sat2[0], g.sat2[1]);
          gl.uniform1f(gl.getUniformLocation(p, 'uWave'), g.wave);
          gl.uniform3f(gl.getUniformLocation(p, 'uGlow'), g.glow[0], g.glow[1], g.glow[2]);
          P.uPh = gl.getUniformLocation(p, 'uPh');
        }
        if (def.init) def.init(gl, p, g, P);
        P.uT = gl.getUniformLocation(p, 'uT');
        P.uS = gl.getUniformLocation(p, 'uS');
        P.uAmt = gl.getUniformLocation(p, 'uAmt');
        P.uBoot = gl.getUniformLocation(p, 'uBoot');
        // 保留每处原来的采样密度（四处2倍、波光1倍），全程在同一GPU上下文，不读回2D画布。
        P.width = Math.round(R.w * res * def.res); P.height = Math.round(R.h * res * def.res);
        P.target = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, P.target);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, P.width, P.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        P.framebuffer = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, P.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, P.target, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('灯效纹理画布不可用');
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        P.ok = true;
      };
      P.draw = function () {
        if (!P.ok) return;
        var gl = P.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, P.framebuffer); gl.disable(gl.BLEND);
        gl.useProgram(P.prog);
        if (P.tex2) { gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, P.tex2); }
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, P.tex);
        gl.viewport(0, 0, P.width, P.height); gl.scissor(0, 0, P.width, P.height);
        gl.uniform1f(P.uT, P.t % 7200);
        if (P.uS) gl.uniform1f(P.uS, P.s % 7200);
        if (P.uPh) gl.uniform1f(P.uPh, (P.t / g.period) % 1);
        gl.uniform1f(P.uAmt, def.amt());
        gl.uniform1f(P.uBoot, bootK(P.key));
        if (def.frame) def.frame(gl, P);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.enable(gl.BLEND);
        gl.viewport.apply(gl, viewport); gl.scissor.apply(gl, viewport);
        gl.useProgram(copyProgram); gl.bindTexture(gl.TEXTURE_2D, P.target);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      P.dispose = function () {
        if (P.gl) {
          if (P.tex) P.gl.deleteTexture(P.tex);
          if (P.tex2) P.gl.deleteTexture(P.tex2);
          if (P.prog) P.gl.deleteProgram(P.prog);
          if (P.target) P.gl.deleteTexture(P.target);
          if (P.framebuffer) P.gl.deleteFramebuffer(P.framebuffer);
        }
        P.gl = null; P.tex2 = null; P.ok = false;
      };
      return P;
    }

    function on(P) { return P.ok && par[P.key + 'On'] && par[P.key] > 0; }
    var panelLive = false;   // 副屏这一处现在是不是画布在画
    function sync() {
      root.style.display = shown ? 'block' : 'none';
      canvas.style.display = patches.some(on) ? 'block' : 'none';
      var live = !!panel && ready && !destroyed && shown && panelOk();
      if (live !== panelLive) { panelLive = live; var tell = live ? panel.onLive : panel.onGone; if (tell) tell.call(panel); }
    }
    function drawAll() {
      if (!gl || gl.isContextLost()) return;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.disable(gl.SCISSOR_TEST); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.SCISSOR_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      patches.forEach(function (P) { if (on(P)) P.draw(); });
    }

    function frame(now) {
      if (!running) return;
      var dt = Math.max(0, (now - last) / 1000);
      last = now;
      var c0 = performance.now(), any = false;
      bootT += dt;
      if (panel) stepPanel(dt);
      for (var i = 0; i < patches.length; i++) {
        var P = patches[i];
        if (!on(P)) continue;
        any = true;
        var bs = bootSpeed(P.key);
        P.t += dt * P.def.speed() * bs;
        P.s += dt * P.def.amt() * bs;
      }
      if (opts.drawFrame) opts.drawFrame(now, drawAll); else drawAll();
      cpuMs += (performance.now() - c0 - cpuMs) * 0.05; frames++;
      if (!any) { running = false; raf = 0; return; }
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running || destroyed || !ready || !wantRun || !visible || fixed || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    function onVis() { if (document.hidden) stop(); else start(); }
    function seek(v) {
      patches.forEach(function (P) { P.t = v * P.def.speed(); P.s = v * P.def.amt(); });
      pv.rgb = v * panelFlow() % 1; pv.drift = v * panelDrift();
    }

    var handle = {
      el: root,
      get ready() { return ready; },
      get params() { return Object.assign({}, par); },
      get patches() { return patches.map(function (P) { return { key: P.key, canvas: P.canvas, rect: P.R }; }); },
      get panelReady() { return panelOk(); },   // 副屏这一处在不在画（没给小图、小图读不进贴图、被关掉都是 false）
      stats: function () { return { cpuMs: cpuMs, frames: frames, running: running }; },
      set: function (p) {
        take(p);
        if (!ready) return;
        sync();
        if (!running) { drawAll(); start(); }
      },
      pause: function () { wantRun = false; stop(); },
      resume: function () { wantRun = true; start(); },
      setTime: function (v) { seek(+v); if (ready && !running) drawAll(); },
      // 重新开机：从暗到亮再来一遍；可以顺手改秒数（0 = 以后不要开机这一段）
      boot: function (seconds) {
        if (seconds != null && isFinite(+seconds)) bootLen = Math.max(0, +seconds);
        bootT = 0;
        if (panel && panel.onBoot && panelOk()) panel.onBoot(panelSchedule());
        if (ready && !running) { drawAll(); start(); }
      },
      setBootTime: function (v) { bootT = +v; if (ready && !running) drawAll(); },   // 截图自查用：把开机钉在第几秒
      setVisible: function (v) { shown = !!v; sync(); },
      destroy: destroy
    };

    function fail(err) {
      if (opts.onError) opts.onError(err);
      else if (global.console) console.warn('[lights]', err);
    }

    function begin() {
      if (destroyed) return;
      container.appendChild(root);
      root.appendChild(canvas);
      try { initContext(); } catch (err) { fail(err); return; }
      canvas.addEventListener('webglcontextlost', onLost, false);
      canvas.addEventListener('webglcontextrestored', onRestored, false);
      DEFS.forEach(function (def) {
        var P = makePatch(def);
        try { P.init(); } catch (err) { P.ok = false; fail(new Error(def.key + ': ' + err.message)); }   // 这一样退回原画，别的照常
        patches.push(P);
      });
      ready = true;
      if (fixed) seek(+opts.time);
      sync();
      drawAll();
      if (!fixed) {
        if (global.IntersectionObserver) {
          io = new IntersectionObserver(function (es) {
            visible = es[es.length - 1].isIntersecting;
            if (visible) start(); else stop();
          });
          io.observe(root);
        }
        document.addEventListener('visibilitychange', onVis, false);
      }
      start();
      if (opts.onReady) opts.onReady(handle);
    }

    function destroy() {
      destroyed = true;
      stop();
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVis, false);
      patches.forEach(function (P) { P.dispose(); });
      panelLive = false;
      if (panel && panel.onGone) panel.onGone();
      canvas.removeEventListener('webglcontextlost', onLost, false);
      canvas.removeEventListener('webglcontextrestored', onRestored, false);
      if (gl) { if (quad) gl.deleteBuffer(quad); if (copyProgram) gl.deleteProgram(copyProgram); var ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); }
      gl = null;
      patches = []; ready = false;
      if (root.parentNode) root.parentNode.removeChild(root);
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

  global.WlyLights = { mount: mount, DEFAULT_PARAMS: DEFAULT_PARAMS, DEFAULT_GEOM: DEFAULT_GEOM, KEYS: KEYS };
})(window);

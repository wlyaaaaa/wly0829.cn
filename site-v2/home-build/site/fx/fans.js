/*
 * 风扇模块（wly0829.cn 首页第一屏）——扇叶在斜着的圆面里转，光环上的彩光沿环流动
 *
 * 用法：
 *   var fans = WlyFans.mount(container, { image: imgOrUrl, speed: 3.6, glow: 20,
 *                                         spinUp: { from: 0.3, to: 3.6, seconds: 4 } });
 *   fans.set({ speed: 2.2 });            // 运行中改最终转速
 *   fans.set({ on: [true, true, true] }); // 每个圆环一个开关（关掉的那个就是原画）
 *   fans.spinUp();                       // 再从慢到快起转一次（首页“完全加载好”的那一刻也可以调它）
 *   fans.pause(); fans.resume(); fans.destroy();
 *
 * speed ：扇叶最终每秒转几圈（0.3～3.6）。越快扇叶抹得越开，3.6 在 60 帧的屏上就是转糊了的一片。
 * glow  ：彩光每分钟沿光环走几圈（0 = 不流动），三个圆环一样快。
 * spinUp：起转。开始动的那一刻从 from 圈/秒平滑升到最终转速，用 seconds 秒（先慢后快再稳住）；
 *         to 不写就是 speed；spinUp: false 直接用最终转速。转速怎么变，扇叶位置都不跳。
 *
 * container：和整幅画一样大的定位容器（position 不是 static）。每个圆环只在自己那一小块
 * 放一张画布，位置用百分比，所以容器被 CSS transform 整体缩放、平移时不用任何同步。
 * 画不改：画布叠在画上面，关掉看到的就是原画。
 * 瀑布上面那个圆环只做彩光：它的画布只盖光环那一圈，叠在瀑布画布上面（z-index:1），不碰水。
 *
 * 做法：
 *   1) 把风扇那个斜圆面按椭圆换算成“角度 × 半径”的一张展开图（原画的像素），轴心、内壁、前面的管子
 *      挡住的那几段用隔一片扇叶的同样位置补（风扇是旋转对称的）。
 *   2) 展开图拆成两部分：沿角度抹匀的底（各处的明暗和彩光，不跟着转）和扇叶的明暗起伏（跟着转）。
 *      所以彩光照在哪儿还在哪儿，转的只是扇叶。
 *   3) 转动的拖影：沿转动方向按“这一帧里走过的角度”抹开，抹的长度跟着转速和屏幕刷新率走，
 *      所以不会出现倒着转、一跳一跳。
 *   4) 彩光：先量出光环一圈各处的颜色，再让这圈颜色沿环慢慢走；每个像素只换色相，明暗不动。
 */
(function (global) {
  'use strict';

  var BASIS_W = 1672;                 // 长度单位：把画宽当作 1672 个单位（定稿图 1672×941）
  var DEFAULT_PARAMS = { speed: 3.6, glow: 40 };  // 本人 2026-11-13 12:22 定稿：彩光 40 圈/分（11:58 定的转速 3.6、起转 0.3→3.6）
  var DEFAULT_SPINUP = { from: 0.3, seconds: 4 };
  var SHUTTER = 0.0225;               // 拖影至少抹开这么多秒里转过的角度（高刷新率屏上看着和 60 帧的屏差不多）
  var NA = 1024, NR = 256, NT = 40;   // 展开图：角度 × 半径；拖影取样数

  // 每个圆环在画上的位置（单位见上）。椭圆都是 [中心x, 中心y, 横半径, 竖半径]
  var DEFAULT_FANS = [
    {
      name: '左边那把',
      blades: 8,                              // 扇叶数（量出来是 8 片，间隔 45°）
      dir: 1,                                 // 1 = 画面上顺时针
      disc: [619.5, 134, 122.5, 37],          // 扇叶转动的斜圆面
      open: [625.2, 133.3, 117.4, 35.9],      // 看得见扇叶的开口（左下那圈内壁在它外面，不转）
      hub: [619.2, 137.0, 42.2, 16.4, 0.8],   // 轴心：椭圆 + 上下各延伸几个单位（轴心有厚度）
      ringIn: [619, 133.5, 125, 37.5],        // 光环内沿
      ringOut: [618, 134, 147, 49],           // 光环外沿
      delay: 0, rate: 1
    },
    {
      name: '中间那把',
      blades: 8, dir: 1,
      disc: [918.8, 133, 128, 37.5],
      open: [926, 131.8, 121.5, 35.6],
      hub: [918.5, 135.5, 42.8, 18.3, 0.5],
      ringIn: [925, 131.5, 125, 36.5],
      ringOut: [923.5, 131.75, 145.5, 47.75],
      // 从前面挡过去的白管子：管子上沿的一串点 [x, y]（x 从小到大）；这条线以下都是管子，留在前面不动
      tube: [[896, 230], [898, 215], [903, 200], [910, 190], [918, 180], [926, 172], [932, 166], [940, 160],
             [950, 154.5], [962, 150], [975, 148], [990, 147], [1020, 146], [1050, 147.5], [1100, 150]],
      delay: 0.3,                             // 比左边那把晚零点几秒起转
      rate: 0.965                             // 转得略慢一点点：两把不会一直齐步走
    },
    {
      name: '瀑布那个圆环',
      band: true,                             // 没有扇叶：只做彩光和它的反光
      dir: 1,
      spillGain: 1.5, reachGain: 1.4,         // 水是白的、亮的：瀑布顶上那一圈水的反光给足一点、照得远一点
      ringIn: [1241.8, 128.3, 139.3, 39.3],
      ringOut: [1243, 129, 162, 52]
    },
    {
      name: '显卡下左',
      blades: 9, dir: 1,
      glow: false,                            // 暖白的细光圈不是彩光：不流动，只转扇叶
      leaves: true,                           // 前面有垂下来的藤叶和草丛：按颜色认出来，留在前面不动
      disc: [586.5, 611.5, 108, 17.2],
      open: [586.5, 611.3, 107, 16.6],
      hub: [586.7, 617.3, 33.5, 8.2, 0.5],
      ringIn: [586, 610.5, 111.5, 18.3],
      ringOut: [586, 610.5, 115.3, 20.9],
      delay: 0.15, rate: 1.05
    },
    {
      name: '显卡下右',
      blades: 9, dir: 1,
      glow: false, leaves: true,
      disc: [873, 613.2, 123.5, 19.6],
      open: [873, 613, 122.5, 19],
      hub: [875.7, 617.3, 38, 8.8, 0.5],
      ringIn: [872.5, 612.2, 127.4, 21],
      ringOut: [872.5, 612.2, 131.2, 23.6],
      delay: 0.5, rate: 0.99
    }
  ];

  var VERT = '#version 300 es\n' +
    'in vec2 aPos; out vec2 vUv;\n' +
    'void main(){ vUv = vec2(aPos.x*0.5+0.5, 0.5-aPos.y*0.5); gl_Position = vec4(aPos,0.,1.); }\n';

  var COMMON = '#version 300 es\n' +
    'precision highp float;\n' +
    '#define TAU 6.28318530718\n' +
    'uniform sampler2D uImg;\n' +
    'uniform vec4 uCrop;\n' +    // 贴图盖住的那块：x0,y0,w,h
    'uniform vec4 uDisc, uOpen, uHub, uRin, uRout;\n' +
    'uniform float uHubExt, uN;\n' +
    'uniform vec2 uTube[16];\n' +
    'uniform int uTubeN;\n' +
    'uniform float uLeaf;\n' +
    'in vec2 vUv; out vec4 o;\n' +
    'vec3 img(vec2 P){ return textureLod(uImg, (P-uCrop.xy)/uCrop.zw, 0.).rgb; }\n' +
    'float max3(vec3 c){ return max(c.r,max(c.g,c.b)); }\n' +
    'float min3(vec3 c){ return min(c.r,min(c.g,c.b)); }\n' +
    'float luma(vec3 c){ return dot(c,vec3(.299,.587,.114)); }\n' +
    // 轴心（不转）：1 = 在轴心上
    'float hubMask(vec2 P,float grow){\n' +
    '  vec2 q=P-uHub.xy; q.y-=clamp(q.y,-uHubExt,uHubExt);\n' +
    '  float d=length(q/(uHub.zw+grow));\n' +
    '  return 1.-smoothstep(.965,1.035,d);\n' +
    '}\n' +
    // 前面的绿叶（不转）：偏绿偏黄、颜色重的就是叶子；往四周多认一点，叶子边上不漏
    'float leaf1(vec2 P){ vec3 c=img(P); float V=max3(c), s=(V-min3(c))/max(V,.001); return smoothstep(.84,.94,c.g/max(c.r,.001))*smoothstep(.34,.48,s)*step(c.b,min(c.r,c.g)); }\n' +
    'float leafMask(vec2 P){\n' +
    '  if(uLeaf<.5) return 0.;\n' +
    '  float m=leaf1(P);\n' +
    '  for(int i=0;i<8;i++){ float a=float(i)*.7854; m=max(m,max(leaf1(P+1.3*vec2(cos(a),sin(a))),leaf1(P+2.6*vec2(cos(a),sin(a))))); }\n' +
    '  return m;\n' +
    '}\n' +
    // 取扇叶像素时认得更宽：叶子边上那圈半绿不绿的也不要，免得被转成一道黄绿的影子
    'float leaf2(vec2 P){ vec3 c=img(P); float V=max3(c), s=(V-min3(c))/max(V,.001); return smoothstep(.88,.95,c.g/max(c.r,.001))*smoothstep(.22,.34,s)*step(c.b,min(c.r,c.g)); }\n' +
    'float leafWide(vec2 P){\n' +
    '  if(uLeaf<.5) return 0.;\n' +
    '  float m=leaf2(P);\n' +
    '  for(int i=0;i<8;i++){ float a=float(i)*.7854; vec2 d=vec2(cos(a),sin(a)); m=max(m,max(leaf2(P+2.*d),max(leaf2(P+4.*d),leaf2(P+6.*d)))); }\n' +
    '  return m;\n' +
    '}\n' +
    // 前面的管子（不转）：1 = 在管子上。管子上沿是一条折线，线以下都算
    'float tubeMask(vec2 P){\n' +
    '  if(uTubeN<2 || P.x<=uTube[0].x) return 0.;\n' +
    '  float e=uTube[uTubeN-1].y, k=1.;\n' +
    '  for(int i=0;i<15;i++){\n' +
    '    if(i>=uTubeN-1) break;\n' +
    '    vec2 a=uTube[i], b=uTube[i+1];\n' +
    '    if(P.x<b.x){ float s=(b.y-a.y)/(b.x-a.x); e=a.y+s*(P.x-a.x); k=inversesqrt(1.+s*s); break; }\n' +
    '  }\n' +
    '  return smoothstep(-2.2,-.6,(P.y-e)*k);\n' +
    '}\n';

  // 一次性 1：斜圆面展开成 角度×半径；a = 这一格是不是真看得见扇叶
  var FRAG_POLAR = COMMON +
    'void main(){\n' +
    '  float th=vUv.x*TAU, rho=1.-vUv.y;\n' +      // 画布纵向翻过来，存成 v=rho
    '  vec2 S=uDisc.xy+uDisc.zw*rho*vec2(cos(th),sin(th));\n' +
    '  float a=(1.-hubMask(S,1.6))*(1.-smoothstep(.955,.995,length((S-uOpen.xy)/uOpen.zw)))*(1.-tubeMask(S))*(1.-leafWide(S));\n' +
    '  o=vec4(img(S),a);\n' +
    '}\n';

  // 一次性 2：被轴心、内壁、管子挡住的格子，用隔 1、2、3、4 片扇叶的同样位置补
  var FRAG_FILL = COMMON +
    'uniform sampler2D uSrc;\n' +
    'void main(){\n' +
    '  vec2 uv=vec2(vUv.x,1.-vUv.y);\n' +
    '  vec4 c=texture(uSrc,uv);\n' +
    '  if(c.a<.995){\n' +
    '    vec3 acc=vec3(0.); float ws=0.;\n' +
    '    for(int j=1;j<=4;j++){\n' +
    '      float fj=float(j), w0=1./(fj*fj*fj);\n' +
    '      vec4 p=texture(uSrc,uv+vec2(fj/uN,0.)), m=texture(uSrc,uv-vec2(fj/uN,0.));\n' +
    '      float wp=w0*p.a*p.a, wm=w0*m.a*m.a;\n' +
    '      acc+=p.rgb*wp+m.rgb*wm; ws+=wp+wm;\n' +
    '    }\n' +
    '    if(ws>1e-4) c.rgb=mix(acc/ws,c.rgb,c.a);\n' +
    '  }\n' +
    '  o=vec4(c.rgb,1.);\n' +
    '}\n';

  // 一次性 3：rgb = 沿角度抹匀的底（不跟着转的明暗和彩光）；a = 扇叶明暗 ÷ 底 的一半（跟着转）
  var FRAG_BASE = COMMON +
    'uniform sampler2D uSrc;\n' +
    'void main(){\n' +
    '  vec2 uv=vec2(vUv.x,1.-vUv.y);\n' +
    // 抹的宽度都是整片扇叶的倍数（1、2、3 片），这样底里不留扇叶的影子；越靠轴心抹得越宽，
    // 贴着轴心那一圈干脆抹匀一整圈，画上那几处不对称的扇叶根才不会留成不动的一块
    '  vec3 a1=vec3(0.), a2=vec3(0.), a3=vec3(0.), a8=vec3(0.);\n' +
    '  for(int i=0;i<96;i++){\n' +
    '    float x=((float(i)+.5)/96.-.5)*3.;\n' +
    '    vec3 c=texture(uSrc,uv+vec2(x/uN,0.)).rgb;\n' +
    '    a3+=c; if(abs(x)<1.) a2+=c; if(abs(x)<.5) a1+=c;\n' +
    '  }\n' +
    '  for(int i=0;i<64;i++) a8+=texture(uSrc,vec2((float(i)+.5)/64.,uv.y)).rgb;\n' +
    '  vec3 base=mix(a3/96.,mix(a1/32.,a2/64.,.5),smoothstep(.4,.8,uv.y));\n' +
    '  base=mix(a8/64.,base,smoothstep(.36,.56,uv.y));\n' +
    '  float r=luma(texture(uSrc,uv).rgb)/max(luma(base),.02);\n' +
    '  o=vec4(base,clamp(r*.5,0.,1.));\n' +
    '}\n';

  // 一次性 4：光环一圈各处的颜色（最亮的那一路算 1），沿环抹匀一些；a = 这个角度看得见几成（管子挡住的不算）
  var FRAG_PROF = COMMON +
    'void main(){\n' +
    '  vec3 acc=vec3(0.); float ws=0., cov=0., tot=0.;\n' +
    '  for(int j=-7;j<=7;j++){\n' +
    '    float tri=8.-abs(float(j));\n' +
    '    float th=(vUv.x+float(j)*.01)*TAU; vec2 d=vec2(cos(th),sin(th));\n' +
    '    for(int i=0;i<10;i++){\n' +
    '      float t=(float(i)+.5)/10.*1.3-.15;\n' +
    '      vec2 S=mix(uRin.xy+uRin.zw*d,uRout.xy+uRout.zw*d,t);\n' +
    '      vec3 c=img(S);\n' +
    '      float ok=1.-tubeMask(S);\n' +
    '      float V=max3(c), s=(V-min3(c))/max(V,.001), w=(s*s*V+1e-4)*tri*ok;\n' +
    '      acc+=w*c/max(V,.001); ws+=w; cov+=tri*ok; tot+=tri;\n' +
    '    }\n' +
    '  }\n' +
    '  vec3 s=acc/max(ws,1e-6);\n' +
    '  o=vec4(s/max(max3(s),.001),cov/tot);\n' +
    '}\n';

  // 一次性 5：被管子挡住的那一段光环，颜色用两头看得见的颜色接上
  var FRAG_PFILL = COMMON +
    'uniform sampler2D uSrc;\n' +
    'void main(){\n' +
    '  vec4 c=texture(uSrc,vec2(vUv.x,.5));\n' +
    '  vec3 acc=vec3(0.); float ws=0.;\n' +
    '  for(int j=-48;j<=48;j++){\n' +
    '    float fj=float(j); vec4 p=texture(uSrc,vec2(vUv.x+fj/256.,.5));\n' +
    '    float w=exp(-fj*fj/500.)*p.a*p.a*p.a; acc+=p.rgb*w; ws+=w;\n' +
    '  }\n' +
    '  vec3 f=ws>1e-5?acc/ws:c.rgb;\n' +
    '  o=vec4(mix(f,c.rgb,smoothstep(.6,1.,c.a)),1.);\n' +
    '}\n';

  var FRAG_MAIN = COMMON +
    'uniform sampler2D uPol, uProf;\n' +
    'uniform vec4 uRect;\n' +       // 画布盖住的那块：x0,y0,w,h
    'uniform float uPh;\n' +        // 扇叶转到第几圈（只取小数）
    'uniform float uHalf;\n' +      // 拖影半宽（圈）
    'uniform float uLod, uGain;\n' +
    'uniform float uGph;\n' +       // 彩光走到第几圈
    'uniform float uWake;\n' +      // 彩光醒了几成（起转时从暗到亮）
    'uniform vec2 uSpill;\n' +      // 反光：贴着光环处有多强、往外多少个单位淡到三成多
    'uniform vec2 uOn;\n' +         // 转不转、彩光流不流
    'uniform float uBand;\n' +      // 1 = 没有扇叶，只做光环和它的反光（瀑布上面那个圆环）
    'uniform float uDebug;\n' +
    'vec3 prof(float u){ vec3 c=textureLod(uProf,vec2(u,.5),0.).rgb; return c/max(max3(c),.001); }\n' +
    'void main(){\n' +
    '  vec2 P=uRect.xy+vUv*uRect.zw;\n' +
    '  vec3 orig=img(P), col=orig;\n' +
    '  float tb=tubeMask(P);\n' +
    // —— 扇叶 ——
    '  vec2 q=(P-uDisc.xy)/uDisc.zw;\n' +
    '  float rho=length(q);\n' +
    '  float mB=uOn.x>.5?(1.-smoothstep(.93,.995,rho))*(1.-smoothstep(.95,.995,length((P-uOpen.xy)/uOpen.zw)))*(1.-hubMask(P,1.2))*(1.-tb)*(1.-leafMask(P)):0.;\n' +
    '  if(mB>.001){\n' +
    '    float u=atan(q.y,q.x)/TAU;\n' +
    '    vec3 base=textureLod(uPol,vec2(u,rho),0.).rgb;\n' +
    '    float acc=0., ws=0.;\n' +
    '    for(int i=0;i<' + NT + ';i++){\n' +
    '      float x=(float(i)+.5)/' + NT + '.*2.-1., w=1.-abs(x);\n' +
    '      acc+=w*textureLod(uPol,vec2(u-uPh+x*uHalf,rho),uLod).a; ws+=w;\n' +
    '    }\n' +
    // 抹开以后扇叶的明暗会变淡，按抹掉的比例补回来一些（最多 1.6 倍），所以转得快也还看得出一片片扇叶的影子
    '    col=mix(col,base*max(1.+(2.*acc/ws-1.)*uGain,0.),mB);\n' +
    '  }\n' +
    // —— 彩光 ——
    '  vec2 dc=P-uRout.xy, di=P-uRin.xy;\n' +
    '  float ro=length(dc/uRout.zw), ri=length(di/uRin.zw);\n' +
    '  float dpx=max(ro-1.,0.)/max(ro,.001)*length(dc);\n' +   // 在光环外沿外面大约几个单位
    '  float din=max(1.-ri,0.)/max(ri,.001)*length(di);\n' +   // 在光环内沿里面大约几个单位
    '  float dd=max(dpx,din);\n' +                              // 离光环那一圈有多远（在圈上 = 0）
    '  float band=(1.-smoothstep(1.,5.5,dpx))*(1.-smoothstep(.5,3.5,din));\n' +
    '  float near=exp(-dd/uSpill.y);\n' +                       // 光环照得到的地方
    '  if(uOn.y>.5){\n' +
    '    vec2 qr=(P-(uRin.xy+uRout.xy)*.5)/((uRin.zw+uRout.zw)*.5);\n' +
    '    float ur=atan(qr.y,qr.x)/TAU;\n' +
    '    vec3 s0=prof(ur), s1=prof(ur-uGph);\n' +
    '    float V=max3(col), sp=(V-min3(col))/max(V,.001);\n' +
    // 1) 光环自己和紧贴它的地方：原来是什么颜色的光，换成流过来的颜色（轴心不染，扇叶上淡一些）
    '    float zone=uBand>.5?band:(1.-smoothstep(3.,13.,dpx))*(1.-hubMask(P,1.6))*mix(.6,1.,smoothstep(.72,.98,ri));\n' +
    '    float k=min(sp/max(1.-min3(s0),.22),1.25)*zone*(1.-.5*tb);\n' +   // 管子上的反光也跟着变，淡一半
    // 2) 反光：机箱框、扇叶、瀑布顶上那圈水这些白的东西，离光环越近越跟着彩光变色；本身颜色重的（别的光环、花草）不碰
    '    float g=uSpill.x*near*(1.-smoothstep(.3,.65,sp))*(1.-band);\n' +
    '    col=clamp(col+V*(k+g)*(s1-s0),0.,1.);\n' +
    '  }\n' +
    // 3) 起转时彩光从暗到亮醒过来：光环本身暗、淡，被它照亮的东西也少一层光
    '  float wk=1.-uWake;\n' +
    '  if(wk>.001 && uOn.y>.5){\n' +
    '    float onB=band*(1.-tb);\n' +
    '    float V2=max3(col), s2=(V2-min3(col))/max(V2,.001);\n' +
    '    col=mix(col,mix(vec3(V2),col,.3)*.9,onB*wk);\n' +
    '    col=mix(col,mix(vec3(V2),col,.45)*.96,(1.-onB)*near*wk*(1.-smoothstep(.45,.8,s2)));\n' +
    '  }\n' +
    '  if(uDebug>.5){ col=mix(col,vec3(1.,0.,0.),mB*.5); col=mix(col,vec3(0.,0.,1.),hubMask(P,1.2)*.5*(1.-uBand)); col=mix(col,vec3(0.,.7,0.),tb*.5); col=mix(col,vec3(1.,0.,1.),near*.3*uBand); }\n' +
    // 输出：光环以内整块盖住原画；以外只把“变了多少”叠上去（透明度只在要减色时才有），
    // 所以盖在瀑布画布上面时水照样在动，两个圆环的反光碰到一起也是相加
    '  float inside=uBand>.5?0.:1.-smoothstep(9.,15.,dpx);\n' +
    '  vec2 ed=min(vUv,1.-vUv)*uRect.zw;\n' +
    '  vec3 d=(col-orig)*mix(smoothstep(0.,8.,min(ed.x,ed.y)),1.,inside);\n' +
    '  float a=clamp(max3(-d/max(orig,vec3(.004))),0.,1.);\n' +
    '  o=vec4(mix(max(d+a*orig,0.),col,inside),mix(a,1.,inside));\n' +
    '  if(uOn.y<.5) o=vec4(col*mB,mB);\n' +
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

  // 一个圆环 = 一张小画布
  function Fan(geo, imgEl, BW, BH, env) {
    var self = this;
    var band = !!geo.band;
    var out = geo.ringOut, pad = geo.glow === false ? 6 : Math.round(46 * (geo.reachGain || 1));
    var R = { x0: Math.floor(out[0] - out[2] - pad), y0: Math.floor(out[1] - out[3] - pad),
              x1: Math.ceil(out[0] + out[2] + pad), y1: Math.ceil(out[1] + out[3] + pad) };
    R.w = R.x1 - R.x0; R.h = R.y1 - R.y0;
    var C = { x0: R.x0 - 4, y0: R.y0 - 4, w: R.w + 8, h: R.h + 8 };   // 贴图比画布多留一圈
    var disc = geo.disc || geo.ringIn, hub = geo.hub || [0, -9999, 1, 1, 0];
    var tube = new Float32Array(32), tubeN = 0;
    (geo.tube || []).slice(0, 16).forEach(function (p, i) { tube[i * 2] = p[0]; tube[i * 2 + 1] = p[1]; tubeN = i + 1; });
    var canvas = document.createElement('canvas');
    canvas.width = Math.round(R.w * env.res);
    canvas.height = Math.round(R.h * env.res);
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;pointer-events:none;display:block;' +
      'z-index:1;' +       // 要叠在瀑布画布上面（瀑布那张画布很宽，盖到中间那把风扇的右半边），不管谁先挂
      'left:' + (R.x0 / BW * 100) + '%;top:' + (R.y0 / BH * 100) + '%;' +
      'width:' + (R.w / BW * 100) + '%;height:' + (R.h / BH * 100) + '%;';
    var gl = null, prog = null, U = {}, res = [];
    this.canvas = canvas; this.rect = R; this.geo = geo; this.on = true; this.ready = false;
    this.spins = !band && geo.spin !== false;
    this.blades = geo.blades || 8;
    this.turns = 0;        // 这把扇叶一共转了几圈
    this.v = 0;            // 这把现在每秒转几圈

    function setGeo(p) {
      gl.useProgram(p);
      gl.uniform1i(gl.getUniformLocation(p, 'uImg'), 0);
      gl.uniform4f(gl.getUniformLocation(p, 'uCrop'), C.x0, C.y0, C.w, C.h);
      gl.uniform4fv(gl.getUniformLocation(p, 'uDisc'), disc);
      gl.uniform4fv(gl.getUniformLocation(p, 'uOpen'), geo.open || disc);
      gl.uniform4fv(gl.getUniformLocation(p, 'uHub'), hub.slice(0, 4));
      gl.uniform1f(gl.getUniformLocation(p, 'uHubExt'), hub[4] || 0);
      gl.uniform4fv(gl.getUniformLocation(p, 'uRin'), geo.ringIn);
      gl.uniform4fv(gl.getUniformLocation(p, 'uRout'), geo.ringOut);
      gl.uniform1f(gl.getUniformLocation(p, 'uN'), self.blades);
      gl.uniform2fv(gl.getUniformLocation(p, 'uTube'), tube);
      gl.uniform1i(gl.getUniformLocation(p, 'uTubeN'), tubeN);
      gl.uniform1f(gl.getUniformLocation(p, 'uLeaf'), geo.leaves ? 1 : 0);
    }

    function tex(unit, w, h, data, minF, wrapS) {
      var tx = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tx);
      if (data && data.tagName) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minF);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      res.push(tx);
      return tx;
    }

    this.init = function () {
      gl = canvas.getContext('webgl2', {
        alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false,
        preserveDrawingBuffer: env.fixed
      });
      if (!gl) throw new Error('WebGL2 不可用');
      res = [];
      var quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);

      // 只把这一小块原画送进显卡
      var k = (imgEl.naturalWidth || BW) / BW;
      var crop = document.createElement('canvas');
      crop.width = Math.round(C.w * k); crop.height = Math.round(C.h * k);
      crop.getContext('2d').drawImage(imgEl, C.x0 * k, C.y0 * k, C.w * k, C.h * k, 0, 0, crop.width, crop.height);
      tex(0, 0, 0, crop, gl.LINEAR, gl.CLAMP_TO_EDGE);

      var pw = self.spins ? NA : 4, ph = self.spins ? NR : 4;
      var tA = tex(1, pw, ph, null, gl.LINEAR, gl.REPEAT);
      var tB = tex(2, pw, ph, null, gl.LINEAR, gl.REPEAT);
      var tPol = tex(3, pw, ph, null, gl.LINEAR_MIPMAP_LINEAR, gl.REPEAT);
      var tProf = tex(4, 256, 1, null, gl.LINEAR, gl.REPEAT);
      var tProfA = tex(5, 256, 1, null, gl.LINEAR, gl.REPEAT);
      var fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      function pass(frag, target, w, h, srcUnit) {
        var p = program(gl, frag);
        setGeo(p);
        if (srcUnit != null) gl.uniform1i(gl.getUniformLocation(p, 'uSrc'), srcUnit);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target, 0);
        gl.viewport(0, 0, w, h);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.deleteProgram(p);
      }
      if (self.spins) {
        pass(FRAG_POLAR, tA, NA, NR, null);
        pass(FRAG_FILL, tB, NA, NR, 1);
        pass(FRAG_BASE, tPol, NA, NR, 2);
      }
      pass(FRAG_PROF, tProfA, 256, 1, null);
      pass(FRAG_PFILL, tProf, 256, 1, 5);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fb);
      gl.activeTexture(gl.TEXTURE0 + 3);
      gl.bindTexture(gl.TEXTURE_2D, tPol);
      gl.generateMipmap(gl.TEXTURE_2D);

      prog = program(gl, FRAG_MAIN);
      setGeo(prog);
      gl.uniform1i(gl.getUniformLocation(prog, 'uPol'), 3);
      gl.uniform1i(gl.getUniformLocation(prog, 'uProf'), 4);
      gl.uniform4f(gl.getUniformLocation(prog, 'uRect'), R.x0, R.y0, R.w, R.h);
      gl.uniform1f(gl.getUniformLocation(prog, 'uDebug'), env.debug ? 1 : 0);
      gl.uniform1f(gl.getUniformLocation(prog, 'uBand'), band ? 1 : 0);
      ['uPh', 'uHalf', 'uLod', 'uGain', 'uGph', 'uWake', 'uSpill', 'uOn'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      gl.viewport(0, 0, canvas.width, canvas.height);
      self.ready = true;
    };

    // half：拖影半宽（圈）；gturns：彩光走了几圈；wake：彩光醒了几成
    this.draw = function (half, gturns, wake) {
      if (!gl || !prog) return;
      var d = geo.dir || 1;
      var texels = 2 * half / NT * NA;
      gl.uniform1f(U.uPh, (self.turns * d) % 1);
      gl.uniform1f(U.uHalf, half);
      gl.uniform1f(U.uLod, Math.min(4, Math.max(0, Math.log(Math.max(texels, 1e-6)) / Math.LN2)));
      var x = Math.PI * half * self.blades, keep = x < 1e-3 ? 1 : Math.pow(Math.sin(x) / x, 2);   // 抹开后扇叶明暗还剩几成
      gl.uniform1f(U.uGain, Math.min(1.6, 1 / Math.max(keep, 0.01)));
      gl.uniform1f(U.uGph, (gturns * d) % 1);
      gl.uniform1f(U.uWake, wake);
      gl.uniform2f(U.uSpill, env.spill * (geo.spillGain || 1), env.spillReach * (geo.reachGain || 1));
      gl.uniform2f(U.uOn, self.spins ? 1 : 0, geo.glow === false ? 0 : 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    this.finish = function () { if (gl) { gl.finish(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4)); } };
    this.renderer = function () {
      var e = gl && gl.getExtension('WEBGL_debug_renderer_info');
      return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : '';
    };
    this.lost = function () { self.ready = false; prog = null; };
    this.dispose = function () {
      if (gl) {
        res.forEach(function (tx) { gl.deleteTexture(tx); });
        if (prog) gl.deleteProgram(prog);
        var ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
      gl = null; prog = null; self.ready = false;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }

  function mount(container, opts) {
    opts = opts || {};
    var aspect = opts.aspect || (1672 / 941);
    var BW = BASIS_W, BH = BW / aspect;
    var geos = opts.fans || DEFAULT_FANS;
    var fixed = (opts.time != null);
    var env = { res: opts.resolution || 2, fixed: fixed, debug: !!opts.debug,
                spill: opts.spill == null ? 0.3 : +opts.spill,          // 反光有多强（0 = 不要反光）
                spillReach: opts.spillReach || 20 };                    // 反光往外多少个单位淡到三成多
    var ramp = opts.spinUp === false ? null : Object.assign({}, DEFAULT_SPINUP, opts.spinUp || {});
    var par = {
      speed: opts.speed != null ? +opts.speed : (ramp && ramp.to != null ? +ramp.to : DEFAULT_PARAMS.speed),
      glow: opts.glow == null ? DEFAULT_PARAMS.glow : +opts.glow
    };
    var fans = [], raf = 0, running = false, destroyed = false, ready = false;
    var t = fixed ? +opts.time : 0, last = 0, wantRun = !fixed, visible = true, shown = true;
    var rampT = 0;                    // 起转开始后已经转了多少秒（只在真的在动时走）
    var gturns = 0, wake = 1;
    var GLOW0 = 0.15;                 // 起转那一刻彩光走得有多慢（是最终快慢的几成）
    var frameDt = opts.frameDt || 1 / 60, cost = 0;
    var imgEl = null, io = null;

    // 起转：tau 秒时这把扇叶每秒转几圈（先慢后快再稳住）
    function speedAt(f, tau) {
      var rate = f.geo.rate || 1;
      if (!ramp || !(ramp.seconds > 0)) return par.speed * rate;
      var x = Math.min(1, Math.max(0, (tau - (f.geo.delay || 0)) / ramp.seconds));
      return (ramp.from + (par.speed - ramp.from) * x * x * (3 - 2 * x)) * rate;
    }
    // 从起转开始到 tau 秒一共转了几圈（把时间钉住看某一刻时用）
    function turnsAt(f, tau) {
      var rate = f.geo.rate || 1;
      if (!ramp || !(ramp.seconds > 0)) return par.speed * rate * tau;
      var T = ramp.seconds, u = tau - (f.geo.delay || 0), x = Math.min(1, Math.max(0, u / T));
      return (ramp.from * tau + (par.speed - ramp.from) * (T * (x * x * x - x * x * x * x / 2) + Math.max(0, u - T))) * rate;
    }

    function half(f) {
      // 拖影半宽：至少是“一帧半里转过的角度”，这样扇叶一帧一帧接得上、不会看成倒转或一跳一跳；
      // 转得越快抹得越开（一帧走过小半片扇叶时抹到两帧），最多一片扇叶的间隔（那就是匀匀的一片）
      var n = f.blades, step = f.v * frameDt, k = Math.min(1, Math.max(0, (step * n - 0.25) / 0.15));
      var m = 1.5 + 0.5 * k * k * (3 - 2 * k);
      return Math.min(1 / n, Math.max(f.v * SHUTTER, m * step));
    }

    // 彩光跟着一起醒：tau 秒时醒了几成（和扇叶同一条曲线）；不起转就一直是 1
    function wakeAt(tau) {
      if (!ramp || !(ramp.seconds > 0)) return 1;
      var x = Math.min(1, Math.max(0, tau / ramp.seconds));
      return x * x * (3 - 2 * x);
    }
    function pin() {      // 把时间钉住时：各把扇叶、彩光都摆到 t 那一刻
      fans.forEach(function (f) { f.v = speedAt(f, t); f.turns = turnsAt(f, t); });
      wake = wakeAt(t);
      if (!ramp || !(ramp.seconds > 0)) gturns = t * par.glow / 60;
      else {
        var T = ramp.seconds, x = Math.min(1, Math.max(0, t / T));
        gturns = par.glow / 60 * (GLOW0 * t + (1 - GLOW0) * (T * (x * x * x - x * x * x * x / 2) + Math.max(0, t - T)));
      }
    }

    function draw() {
      var t0 = performance.now();
      fans.forEach(function (f) { if (f.ready && f.on) f.draw(f.spins ? half(f) : 0, gturns, wake); });
      cost += (performance.now() - t0 - cost) * 0.1;
    }

    function applyShown() {
      fans.forEach(function (f) { f.canvas.style.visibility = (shown && f.on) ? 'visible' : 'hidden'; });
    }

    var handle = {
      get ready() { return ready; },
      get time() { return t; },
      get params() { return { speed: par.speed, glow: par.glow, on: fans.map(function (f) { return f.on; }) }; },
      get names() { return geos.map(function (g) { return g.name; }); },
      get speedNow() { return fans.length ? fans[0].v : 0; },   // 左边那把现在每秒转几圈
      get frameMs() { return cost; },
      get canvases() { return fans.map(function (f) { return f.canvas; }); },
      get rects() { return fans.map(function (f) { return f.rect; }); },
      set: function (p) {
        if (!p) return;
        if (p.speed != null && isFinite(+p.speed)) par.speed = Math.max(0, +p.speed);
        if (p.glow != null && isFinite(+p.glow)) par.glow = Math.max(0, +p.glow);
        if (p.on) fans.forEach(function (f, i) { if (p.on[i] != null) f.on = !!p.on[i]; });
        if (fixed) pin();
        applyShown();
        if (ready && !running) draw();
      },
      // 再起转一次：转速回到 from，再平滑升到最终转速；扇叶位置接着当前的走，不跳
      spinUp: function (o) {
        if (o === false) ramp = null;
        else ramp = Object.assign({}, DEFAULT_SPINUP, ramp || {}, o || {});
        if (ramp && ramp.to != null) { par.speed = +ramp.to; ramp.to = null; }
        rampT = 0; wake = wakeAt(0);
        fans.forEach(function (f) { f.v = speedAt(f, 0); });
        if (fixed) pin();
        if (ready && !running) draw();
      },
      pause: function () { wantRun = false; stop(); },
      resume: function () { wantRun = true; start(); },
      setTime: function (v) { t = rampT = +v; pin(); if (ready && !running) draw(); },
      setVisible: function (v) { shown = !!v; applyShown(); },
      // 量一帧耗时：按最终转速连画 n 帧，每帧都等显卡真画完，返回每帧毫秒数（自查用）
      bench: function (n) {
        n = n || 200;
        fans.forEach(function (f) { f.v = par.speed * (f.geo.rate || 1); });
        wake = 1;
        var t0 = performance.now();
        for (var i = 0; i < n; i++) {
          fans.forEach(function (f) { f.turns += f.v / 60; });
          draw();
          fans.forEach(function (f) { f.finish(); });
        }
        return (performance.now() - t0) / n;
      },
      get renderer() { return fans.length ? fans[0].renderer() : ''; },
      destroy: destroy
    };

    function fail(err) {
      fans.forEach(function (f) { f.dispose(); });   // 退回静止的原画
      fans = [];
      if (opts.onError) opts.onError(err);
      else if (global.console) console.warn('[fans]', err);
    }

    function frame(now) {
      if (!running) return;
      var dt = Math.max(0, (now - last) / 1000);
      last = now;
      t += dt;
      rampT += dt;
      fans.forEach(function (f) {
        f.v = speedAt(f, rampT);
        f.turns = (f.turns + dt * f.v) % 4096;     // 转速怎么变，位置都是接着走的
      });
      wake = wakeAt(rampT);
      gturns = (gturns + dt * par.glow / 60 * (GLOW0 + (1 - GLOW0) * wake)) % 4096;   // 彩光也从慢到快
      if (dt > 0.003 && dt < 0.05) frameDt += (dt - frameDt) * 0.1;
      if (opts.drawFrame) opts.drawFrame(now, draw); else draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || destroyed || !ready || !wantRun || !visible || fixed) return;
      if (global.document && document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onHidden() { if (document.hidden) stop(); else start(); }

    function begin() {
      if (destroyed) return;
      try {
        geos.forEach(function (g, i) {
          var f = new Fan(g, imgEl, BW, BH, env);
          if (opts.on && opts.on[i] === false) f.on = false;
          container.appendChild(f.canvas);
          f.init();
          f.canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); f.lost(); }, false);
          f.canvas.addEventListener('webglcontextrestored', function () { try { f.init(); draw(); } catch (err) { fail(err); } }, false);
          fans.push(f);
        });
        ready = true;
        if (fixed) pin(); else { wake = wakeAt(0); fans.forEach(function (f) { f.v = speedAt(f, 0); }); }
        applyShown();
        draw();
      } catch (err) { fail(err); return; }
      if (global.IntersectionObserver && !fixed && fans.length) {
        io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { e.target._wlySeen = e.isIntersecting; });
          visible = fans.some(function (f) { return f.canvas._wlySeen !== false; });
          if (visible) start(); else stop();
        });
        fans.forEach(function (f) { io.observe(f.canvas); });
      }
      document.addEventListener('visibilitychange', onHidden, false);
      start();
      if (opts.onReady) opts.onReady(handle);
    }

    function destroy() {
      destroyed = true;
      stop();
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onHidden, false);
      fans.forEach(function (f) { f.dispose(); });
      fans = []; ready = false;
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

  global.WlyFans = { mount: mount, DEFAULT_FANS: DEFAULT_FANS, DEFAULT_PARAMS: DEFAULT_PARAMS, DEFAULT_SPINUP: DEFAULT_SPINUP };
})(window);

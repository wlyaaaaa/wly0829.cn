"""会话首次从纸色开场；图片到达后超时和连续慢帧才跳完成图。"""
import hashlib
import re
from pathlib import Path

OPENING = r"""(() => {
  const root=document.documentElement, key='site-home-firstpaint-v1';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let first=false;
  try { first=!sessionStorage.getItem(key); sessionStorage.setItem(key,'1'); } catch {}
  const back=performance.getEntriesByType('navigation')[0]?.type==='back_forward';
  const opening=window.HomeOpening={pending:first&&!back&&!reduced.matches,
    reason:reduced.matches?'reduced-motion':back?'back-forward':first?'preparing':'session-return',
    imageAt:null,started:false};
  let timer=0;
  opening.release=reason=>{if(!opening.pending)return;opening.pending=false;
    opening.reason=reason;delete root.dataset.homeOpening;clearTimeout(timer);};
  opening.dataReady=image=>{if(!opening.pending||opening.started||opening.imageAt!==null)return;
    opening.imageAt=performance.getEntriesByName(image.currentSrc||image.src).at(-1)?.responseEnd||performance.now();
    timer=setTimeout(()=>opening.release('startup-timeout'),Math.max(0,3000-(performance.now()-opening.imageAt)));};
  opening.start=()=>{if(!opening.pending||opening.imageAt!==null&&performance.now()-opening.imageAt>=3000){
    opening.release('startup-timeout');return false;}
    opening.started=true;clearTimeout(timer);return true;};
  if(opening.pending)root.dataset.homeOpening='pending';
  document.addEventListener('load',event=>{if(event.target.matches?.('#home-01 picture img'))opening.dataReady(event.target);},true);
  document.addEventListener('DOMContentLoaded',()=>{const image=document.querySelector('#home-01 picture img');
    if(image?.complete&&image.naturalWidth)opening.dataReady(image);},{once:true});
  addEventListener('error',event=>{if(/hero-live|home-app|home-firstpaint/.test(event.target?.src||''))
    opening.release('script-error');},true);
  addEventListener('pagehide',()=>opening.release('pagehide'));
  addEventListener('pagereveal',event=>{if(opening.pending)event.viewTransition?.skipTransition();});
  reduced.addEventListener('change',event=>{if(event.matches)opening.release('reduced-motion');});
})();"""


def adjust_home(html, source, public):
    """复制原依赖之后调用；返回HTML，并写入唯一的首页接替运行件。"""
    source, public = Path(source), Path(public)
    match = re.search(r'/(_shared/home-living/hero-live\.[a-f0-9]+\.js)', html)
    if not match:
        raise ValueError('首页缺少原 HeroLive 引擎')
    engine = (source / match[1]).read_text(encoding='utf-8')

    def patch(old, new):
        nonlocal engine
        if engine.count(old) != 1:
            raise ValueError('首页首帧补丁锚点不唯一：' + old[:70])
        engine = engine.replace(old, new)

    config = re.search(r'new URL\("(hero-live\.config\.[a-f0-9]+\.json)"', engine)
    if not config:
        raise ValueError('首页引擎配置入口不明')
    patch('new URL("' + config[1] + '"', 'new URL("/_shared/home-living/' + config[1] + '"')
    # 记录接手时刻；首次完整绘制前不预推进开场，迟接手的小鸟留在原落点。
    patch('let Ct=!1,le=!1,r0="loading",c0=0;',
          'let Ct=!1,le=!1,r0="loading",c0=0,_homeLiveAt=Infinity,_homeSettled=false,'
          '_homeNative=null,_homeNativeTex=null,_homeBlend=0,_homeSlowFrames=0;')
    patch('p.i0=le?p.t:p.t-99,at(!0)', 'p.i0=le?p.t:p.t-99,at(le)')
    patch('le&&!p.manual&&jt(Ee*.112)', '0')
    patch('Ze(),Tt(),rt=performance.now(),0,T.classList.add("is-ready")',
          'Ze(),le&&d.opening&&!d.opening.start()&&(le=!1,p.i0=p.t-99,at(!1),Ze()),'
          '_homeLiveAt=performance.now(),Tt(),rt=performance.now(),T.classList.add("is-ready")')
    # 只在原开场播放期间计连续慢帧；跳过仍交给原引擎，完成图用既有native缓存。
    patch('const o=rt?e-rt:0,s=le&&p.t-p.i0<7?o/1e3:Math.min(.05,o/1e3);',
          'const o=rt?e-rt:0;'
          'if(le&&p.t-p.i0<7){_homeSlowFrames=o>100?_homeSlowFrames+1:0;'
          'if(_homeSlowFrames>=5){r0="slow-intro-frames";_homeSettled=true;_homeLiveAt=Infinity;'
          'at(!1);N0();_homeLiveAt=performance.now();rt=e;Ne();return;}}'
          'const s=le&&p.t-p.i0<7?o/1e3:Math.min(.05,o/1e3);')
    # 最后半个动画秒收回位移，开场落在静态几何；随后0.8真实秒恢复环境运动。
    patch('function Ze(){const e=',
          'function Ze(){const _homeIt=p.t-p.i0;let _homeFresh=false;'
          'if(le&&_homeIt>=7&&!_homeSettled){_homeSettled=true;at(!1);'
          '_homeLiveAt=performance.now();_homeFresh=true;}'
          'const _homeMotion=_homeFresh?0:le&&_homeIt<7?Te(ve((7-_homeIt)/.5,0,1)):'
          'Te(ve((performance.now()-_homeLiveAt)/800,0,1));_homeBlend=_homeMotion;const e=')
    patch('r.uniform1f(L.u_motion,g?0:1)', 'r.uniform1f(L.u_motion,g?0:_homeMotion)')
    patch('r.uniform2f(L.u_par,g?0:p.par[0]/(Q?2880:m),g?0:p.par[1]/(Q?1621:_))',
          'r.uniform2f(L.u_par,g?0:p.par[0]*_homeMotion/(Q?2880:m),'
          'g?0:p.par[1]*_homeMotion/(Q?1621:_))')
    patch('r.uniform1f(L.u_gust,g?0:_o(e,o))', 'r.uniform1f(L.u_gust,g?0:_o(e,o)*_homeMotion)')
    patch('r.uniform1f(L.u_fanA,g?0:bo(e,o))', 'r.uniform1f(L.u_fanA,g?0:bo(e,o)*_homeMotion)')
    # 颜色从原画接手：像素颜色和环境光渐变，画布alpha始终为1。
    patch('uniform float u_t, u_motion,', 'uniform float u_handoff;\\nuniform float u_t, u_motion,')
    patch('"u_preserve","u_ambientGamma"]', '"u_preserve","u_ambientGamma","u_handoff"]')
    patch('r.uniform1f(L.u_t,e)', 'r.uniform1f(L.u_handoff,_homeMotion),r.uniform1f(L.u_t,e)')
    patch('gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);',
          'if (u_it >= 6.5) col = mix(texture2D(u_native,v_uv).rgb,col,u_handoff);\\n'
          'gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);')
    patch('r.uniform3fv(L.u_ambientGamma,K0(s))',
          'r.uniform3fv(L.u_ambientGamma,K0({...s,n:s.n*_homeMotion}))')
    for field in ['night', 'sun', 'moon']:
        value = {'night': 'n', 'sun': 's', 'moon': 'm'}[field]
        patch(f'r.uniform1f(L.u_{field},s.{value})', f'r.uniform1f(L.u_{field},s.{value}*_homeMotion)')
    for field, value, base in [('outTint', 'o', 1), ('outLift', 'l', 0), ('inTint', 'i', 1), ('glint', 'g', 0)]:
        patch(f'r.uniform3fv(L.u_{field},s.{value})',
              f'r.uniform3fv(L.u_{field},s.{value}.map(v=>{base}+(v-{base})*_homeMotion))')
    # 原加载链已经读到native AVIF；独立纹理保留它完整的构图与原画小鸟。
    patch('$.drawImage(l,0,0,m,_);', '_homeNative=l;$.drawImage(l,0,0,m,_);')
    patch('uniform sampler2D u_tex, u_preserve;', 'uniform sampler2D u_tex, u_preserve, u_native;')
    patch('"u_handoff"]', '"u_handoff","u_native"]')
    patch('r.uniform1i(L.u_tex,0),r.uniform1i(L.u_preserve,1)',
          '_homeNative=(()=>{Ht();const im=d.plateImage&&d.plateImage.complete&&d.plateImage.naturalWidth?d.plateImage:_homeNative||e;'
          'const frame=document.createElement("canvas");frame.width=Z.width;frame.height=Z.height;'
          'frame.getContext("2d").drawImage(im,0,0,frame.width,frame.height);return frame;})(),'
          '_homeNativeTex=r.createTexture(),r.activeTexture(r.TEXTURE2),r.bindTexture(r.TEXTURE_2D,_homeNativeTex),'
          'r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),'
          'r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),'
          'r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),'
          'r.texImage2D(r.TEXTURE_2D,0,r.RGB,r.RGB,r.UNSIGNED_BYTE,_homeNative||e),r.uniform1i(L.u_native,2),'
          'r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,gt),r.uniform1i(L.u_tex,0),r.uniform1i(L.u_preserve,1)')
    patch('yt&&r.deleteTexture(yt)', 'yt&&r.deleteTexture(yt),_homeNativeTex&&r.deleteTexture(_homeNativeTex)')
    patch('h.clearRect(0,0,re.width,re.height),!h||f.mode!=="live"',
          'h.clearRect(0,0,re.width,re.height),!h||f.mode!=="live"||_homeBlend<=0')
    patch('const e=R0*Ue,o=-p.par[0]', 'h.globalAlpha=_homeBlend;const e=R0*Ue,o=-p.par[0]')
    patch('h.globalAlpha=a.alpha', 'h.globalAlpha=a.alpha*_homeBlend')
    patch('$0(e,o),!C&&!g&&yo()', '$0(e,o),I(He,"visibility",_homeBlend<=0?"hidden":""),!C&&!g&&yo()')
    name = 'home-firstpaint-' + hashlib.sha256(engine.encode()).hexdigest()[:20] + '.js'
    target = public / '_home-cockpit' / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(engine, encoding='utf-8', newline='')
    html = html.replace('/' + match[1], '/_home-cockpit/' + name)
    # 只提前下载；执行和挂载仍由 SiteAlbum 按原顺序负责。
    app = re.search(r'data-src="(/_shared/home-app-[a-f0-9]+\.js)"', html)
    hints = [f'<link rel="preload" as="script" fetchpriority="low" href="/_home-cockpit/{name}">']
    if app:
        hints.append(f'<link rel="modulepreload" fetchpriority="low" href="{app[1]}">')
    html = html.replace('</head>', '\n'.join(hints) + '\n</head>', 1)
    scripts = list(re.finditer(r'<script>([\s\S]*?)</script>', html))
    opening = [m for m in scripts if 'window.HomeOpening' in m[1]]
    if len(opening) != 1:
        raise ValueError('首页启动脚本不唯一')
    m = opening[0]
    return html[:m.start(1)] + OPENING + html[m.end(1):]

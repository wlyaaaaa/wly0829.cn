"""首页新加载与刷新都从纸色开场；图片到达后超时和连续慢帧才跳完成图。"""
import hashlib
import json
import re
from pathlib import Path


def install_frozen_engine(html, source, public, manifest):
    """从版本化入口包部署已选首帧脚本，不从本机 public 偶然存在的脚本兜底。"""
    matches = set(re.findall(r'/(_home-cockpit/home-firstpaint-[a-f0-9]+\.js)', html))
    if len(matches) != 1:
        raise ValueError('冻结首页的首帧脚本入口不唯一')
    relative = matches.pop()
    entry = manifest.get('bundled', {}).get(relative)
    if not entry or manifest.get('files', {}).get(relative) != {key: entry[key] for key in ('sha256', 'bytes')}:
        raise ValueError('冻结首页的首帧脚本没有依赖绑定')
    raw = (Path(source) / entry['source']).read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if len(raw) != entry['bytes'] or digest != entry['sha256'] or Path(relative).name != 'home-firstpaint-' + digest[:20] + '.js':
        raise ValueError('冻结首页的首帧脚本字节不同')
    target = Path(public) / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists() or target.read_bytes() != raw:
        target.write_bytes(raw)
    if target.read_bytes() != raw:
        raise ValueError('冻结首页的首帧脚本复制核验失败')
    return relative

OPENING = r"""(() => {
  const root=document.documentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const back=performance.getEntriesByType('navigation')[0]?.type==='back_forward';
  const opening=window.HomeOpening={pending:!back&&!reduced.matches,
    reason:reduced.matches?'reduced-motion':back?'back-forward':'preparing',
    imageAt:null,started:false};
  const startupGraceMs=6000;let timer=0;
  opening.release=reason=>{if(!opening.pending)return;opening.pending=false;
    opening.reason=reason;delete root.dataset.homeOpening;clearTimeout(timer);};
  opening.dataReady=image=>{if(!opening.pending||opening.started||opening.imageAt!==null)return;
    opening.imageAt=performance.getEntriesByName(image.currentSrc||image.src).at(-1)?.responseEnd||performance.now();
    timer=setTimeout(()=>opening.release('startup-timeout'),Math.max(0,startupGraceMs-(performance.now()-opening.imageAt)));};
  opening.start=()=>{if(!opening.pending||opening.imageAt!==null&&performance.now()-opening.imageAt>=startupGraceMs){
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
    patch('Ee=Number(ne.speed)>0?Number(ne.speed):2.5', 'Ee=1')
    patch('col = mix(col, raw, phone*0.85);', '')
    patch('col = mix(col, raw*(1.0+0.05*u_night), scr*u_scrOn);', 'col = mix(col, raw*mix(1.0,0.55,u_night), scr*u_scrOn);')
    patch('float warn = step(0.5, u_pcMode)*live;', 'float warn = 0.0;')
    patch('vec3 rgb = mix(vec3(raw.r, top, top*0.45), vec3(raw.r, top*0.62, top), wave);', 'vec3 rgb = vec3(raw.r, top, top*0.45);')
    patch('vec3 neonCol = mix(mix(vec3(0.15,1.0,0.45), vec3(0.15,0.62,1.0), wave), vec3(1.0,0.72,0.20), warn);', 'vec3 neonCol = vec3(0.15,1.0,0.45);')
    # 复用白色外设的原图边界；保色纹理的 R 仍保护文字，G 单独存外设。
    masks = json.loads((Path(__file__).resolve().parents[2] /
                        'sources/home-white-gear/masks.json').read_text(encoding='utf-8'))
    gear = {orientation: [[parts[key] for key in keys] for keys in
                         [('monitor', 'stand', 'keyboard', 'mouse', 'case'),
                          ('screen', 'glass', 'led', 'pens')]]
            for orientation, parts in masks.items()}
    gear_json = json.dumps(gear, separators=(',', ':'))
    patch('const de=j.getContext("2d",{willReadFrequently:!0}),Ge=de.getImageData(0,0,o,s);',
          'const _gear=t(),_gc=_gear.getContext("2d",{willReadFrequently:!0});'
          '_gc.scale(o/m,s/_);_gc.fillStyle="#fff";'
          'const _shapes=(' + gear_json + ')[Q?"v":"h"];'
          '_shapes.forEach((group,index)=>{_gc.globalCompositeOperation=index?"destination-out":"source-over";'
          'group.forEach(poly=>{_gc.beginPath();poly.forEach(([x,y],i)=>i?_gc.lineTo(x,y):_gc.moveTo(x,y));'
          '_gc.closePath();_gc.fill();});});'
          'const _soft=t(),_sc=_soft.getContext("2d",{willReadFrequently:!0});'
          '_sc.filter="blur(1px)";_sc.drawImage(_gear,0,0);'
          'const _gm=_gc.getImageData(0,0,o,s).data,_gs=_sc.getImageData(0,0,o,s).data;'
          'const de=j.getContext("2d",{willReadFrequently:!0}),Ge=de.getImageData(0,0,o,s);')
    patch('Ge.data[v]=Ge.data[v+1]=Ge.data[v+2]=Ge.data[v+3],Ge.data[v+3]=255;',
          'Ge.data[v]=Ge.data[v+2]=Ge.data[v+3],'
          'Ge.data[v+1]=_gm[v+3]*_gs[v+3]/255,Ge.data[v+3]=255;')
    # 已开始的开场沿原时段自然结束；只有尚未开画的回退才从原图接手。
    patch('let Ct=!1,le=!1,r0="loading",c0=0;',
          'let Ct=!1,le=!1,r0="loading",c0=0,_homeLiveAt=Infinity,'
          '_homeNative=null,_homeNativeTex=null,_homeBlend=0,_homeSlowFrames=0,'
          '_homeAssets=null,_homeNativeJob=null,_homeGlJob=null,_homeTextureReady=null;')
    patch('p.i0=le?p.t:p.t-99,at(!0)', 'p.i0=le?p.t:p.t-99,at(le)')
    patch('le&&!p.manual&&jt(Ee*.112)', '0')
    patch('Ze(),Tt(),rt=performance.now(),0,T.classList.add("is-ready")',
          'Ze(),le&&d.opening&&!d.opening.start()&&(le=!1,p.i0=p.t-99,at(!1),Ze()),'
          '_homeLiveAt=performance.now(),Tt(),rt=performance.now(),T.classList.add("is-ready")')
    # 已经开画的慢帧跳过保留当前时段，位置和运动接续由原N0负责。
    patch('const o=rt?e-rt:0,s=le&&p.t-p.i0<7?o/1e3:Math.min(.05,o/1e3);',
          'const o=rt?e-rt:0;'
          'if(le&&p.t-p.i0<7){_homeSlowFrames=o>100?_homeSlowFrames+1:0;'
          'if(_homeSlowFrames>=5){r0="slow-intro-frames";N0();rt=e;Ne();return;}}'
          'const s=le&&p.t-p.i0<7?o/1e3:Math.min(.05,o/1e3);')
    # 正常开场、自然结束和已开始后的跳过都用原系数1，不归零、不重置鸟。
    patch('function Ze(){const e=',
          'function Ze(){const _homeMotion=le?1:'
          'Te(ve((performance.now()-_homeLiveAt)/800,0,1));_homeBlend=_homeMotion;const e=')
    patch('r.uniform1f(L.u_motion,g?0:1)', 'r.uniform1f(L.u_motion,g?0:_homeMotion)')
    patch('r.uniform2f(L.u_par,g?0:p.par[0]/(Q?2880:m),g?0:p.par[1]/(Q?1621:_))',
          'r.uniform2f(L.u_par,g?0:p.par[0]*_homeMotion/(Q?2880:m),'
          'g?0:p.par[1]*_homeMotion/(Q?1621:_))')
    patch('r.uniform1f(L.u_gust,g?0:_o(e,o))', 'r.uniform1f(L.u_gust,g?0:_o(e,o)*_homeMotion)')
    patch('r.uniform1f(L.u_fanA,g?0:bo(e,o))', 'r.uniform1f(L.u_fanA,g?0:bo(e,o)*_homeMotion)')
    # 未开画的回退只做一次最终RGB接手；时段参数沿原值，画布alpha始终为1。
    patch('uniform float u_t, u_motion,', 'uniform float u_handoff;\\nuniform float u_t, u_motion,')
    patch('"u_preserve","u_ambientGamma"]', '"u_preserve","u_ambientGamma","u_handoff","u_native"]')
    patch('r.uniform1f(L.u_t,e)', 'r.uniform1f(L.u_handoff,_homeMotion),r.uniform1f(L.u_t,e)')
    patch('gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);',
          'float _homeGear=texture2D(u_preserve,v_uv).g*smoothstep(0.75,1.0,u_night)*nightReach;\\n'
          'col=mix(col,texture2D(u_tex,v_uv).rgb*vec3(0.82,0.85,0.90),_homeGear);\\n'
          'if (u_it >= 6.5) col = mix(texture2D(u_native,v_uv).rgb,col,u_handoff);\\n'
          'gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);')
    # 原加载链已经读到native AVIF；独立纹理保留它完整的构图与原画小鸟。
    patch('$.drawImage(l,0,0,m,_);', '_homeNative=l;$.drawImage(l,0,0,m,_);')
    patch('uniform sampler2D u_tex, u_preserve;', 'uniform sampler2D u_tex, u_preserve, u_native;')
    # 保色继续服从原藏字与rise/pop取样；完成后仍与静态保护同色。
    patch('  // ---- 开场：左边还没出场的字先藏起来，再让水彩从白纸上晕开 ----\\n',
          '  // ---- 开场：左边还没出场的字先藏起来，再让水彩从白纸上晕开 ----\\n  float _homeInkHide=0.0; vec3 _homeInkBg=vec3(1.0);\\n')
    patch('col = mix(col, bg, max(ink, smoothstep(0.015, 0.050, dk))*(1.0-ivis));',
          '_homeInkBg=bg; _homeInkHide=max(ink, smoothstep(0.015, 0.050, dk))*(1.0-ivis); col=mix(col,bg,_homeInkHide);')
    patch('if (u_it < 7.0) col = mix(vec3(1.0), col, vis);',
          'vec2 _homeNativeUv=u_it<7.0?uv:v_uv;\\n  col=mix(col,mix(texture2D(u_native,_homeNativeUv).rgb,_homeInkBg,_homeInkHide),texture2D(u_preserve,_homeNativeUv).r);\\n  if (u_it < 7.0) col = mix(vec3(1.0), col, vis);')
    patch('  vec3 originalColor=pow(texture2D(u_tex,v_uv).rgb,u_ambientGamma);\\n  float preserve=texture2D(u_preserve,v_uv).r*step(7.0,u_it);\\n  col=mix(col,originalColor,preserve*(1.0-nightReach));\\n', '')
    patch('r.uniform1i(L.u_tex,0),r.uniform1i(L.u_preserve,1)',
          '_homeNative=(()=>{Ht();const im=_homeNative||e;'
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
    # 仍调用原no/e0：图像解码和着色器编译并行，mask齐备后才上传纹理。
    patch('const Co=Promise.resolve().then(async()=>{f.hour=At(),Ht(),Ye(),',
          'const Co=Promise.resolve().then(async()=>{f.hour=At(),Ht(),Ye(),(()=>{if(!g&&h){'
          '_homeAssets=Promise.all([Et(ce?q.plateNoBird:q.plate,!0),...Object.entries(ce?q.sprites:{}).map(([,sp])=>Et(sp.src))]);'
          '_homeAssets.catch(()=>{});const native=d.plateImage?.__heroNativePlates?.[Q?"portrait":"landscape"];'
          'if(native){_homeNativeJob=Et(new URL(native,document.baseURI).href,!0);_homeNativeJob.catch(()=>{});}'
          '_homeGlJob=no(new Promise(resolve=>_homeTextureReady=resolve));_homeGlJob.catch(()=>{});}})(),')
    patch('t=await Promise.all([Et(ce?q.plateNoBird:q.plate,!0),...s.map(([,c])=>Et(c.src))])',
          't=await(_homeAssets||Promise.all([Et(ce?q.plateNoBird:q.plate,!0),...s.map(([,c])=>Et(c.src))]))')
    patch('l=await Et(new URL(c,document.baseURI).href,!0),u=', 'l=await(_homeNativeJob||Et(new URL(c,document.baseURI).href,!0)),u=')
    patch('const l=gt=r.createTexture();', 'e=await e;if(X||C||g)return!1;const l=gt=r.createTexture();')
    patch('const n=h&&await no(i);', 'const n=h&&await(_homeGlJob?(_homeTextureReady(i),_homeGlJob):no(i));')
    # 仅mask、blur/dilate、原图合成与鸟crop：首次创建即留在CPU，显示FX/GL不变。
    engine, count = re.subn(r'\b(se|G|We|u|K)\.getContext\("2d"\)', r'\1.getContext("2d",{willReadFrequently:!0})', engine)
    if count != 6: raise ValueError('首页准备画布锚点不完整')
    name = 'home-firstpaint-' + hashlib.sha256(engine.encode()).hexdigest()[:20] + '.js'
    target = public / '_home-cockpit' / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(engine.encode('utf-8'))
    if hashlib.sha256(target.read_bytes()).hexdigest()[:20] != name.removeprefix('home-firstpaint-').removesuffix('.js'):
        raise ValueError('首页首帧脚本写入后指纹不同')
    html = html.replace('/' + match[1], '/_home-cockpit/' + name)
    # 只提前下载；执行和挂载仍由 SiteAlbum 按原顺序负责。
    app = re.search(r'data-src="(/_shared/home-app-[a-f0-9]+\.js)"', html)
    hints = [f'<link rel="preload" as="script" fetchpriority="high" href="/_home-cockpit/{name}">']
    if app:
        hints.append(f'<link rel="modulepreload" fetchpriority="high" href="{app[1]}">')
    html = html.replace('</head>', '\n'.join(hints) + '\n</head>', 1)
    scripts = list(re.finditer(r'<script>([\s\S]*?)</script>', html))
    opening = [m for m in scripts if 'window.HomeOpening' in m[1]]
    if len(opening) != 1:
        raise ValueError('首页启动脚本不唯一')
    m = opening[0]
    return html[:m.start(1)] + OPENING + html[m.end(1):]

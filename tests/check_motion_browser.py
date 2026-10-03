"""Headless Chrome motion probes; DOM only, no screenshots or image inspection."""
import argparse
import asyncio
from datetime import datetime, timedelta, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import threading
import uuid
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def insurance_checks(pw,args,address,result):
    """Exclusion and latch fixtures; CDP 4x/20x checks live in their own runner."""
    profile=args.cache/('insurance-'+uuid.uuid4().hex)
    context=await pw.chromium.launch_persistent_context(str(profile),executable_path=str(args.chrome),headless=True,viewport={'width':1440,'height':900})
    console=[]
    try:
        page=context.pages[0];page.on('pageerror',lambda error:result['issues'].append(str(error)))
        page.on('console',lambda message:console.append(message.text) if '[SiteMotionInsurance]' in message.text else None)
        await page.goto(address+'/',wait_until='load');await page.evaluate('document.fonts.ready');await page.wait_for_timeout(2300)
        normal=await page.evaluate("""() => ({insurance:SiteMotionInsurance.snapshot,options:SiteSamples.options,leaves:document.querySelectorAll('.falling-leaf').length,animations:document.getAnimations().filter(a=>a.playState==='running').map(a=>({name:a.animationName||a.transitionProperty||'WA',rate:a.playbackRate,duration:a.effect.getTiming().duration,target:a.effect.target?.className}))})""")
        result['checks'].append({'kind':'full-default-and-real-CSS-speed','sample':normal,'pass':not normal['insurance']['stalled'] and normal['insurance']['checking'] and all(normal['options'].values()) and normal['leaves']==6 and any(a['name']=='falling-leaf' and a['rate']==2.5 and a['duration']==15000 for a in normal['animations']) and all(a['rate']==2.5 for a in normal['animations'] if a['name']!='WA' and not a['target'].startswith('hero-video'))})
        await page.evaluate("""() => {const end=performance.now()+1300;while(performance.now()<end){};}""");await page.wait_for_timeout(150)
        single=await page.evaluate('SiteMotionInsurance.snapshot')
        result['checks'].append({'kind':'single-long-task-does-not-trigger','fixture_only':True,'real_main_thread_block_ms':1300,'sample':single,'pass':not single['stalled'] and single['observed_ms']<5000})
        await page.emulate_media(reduced_motion='reduce');await page.wait_for_timeout(80)
        await page.evaluate("""async() => {for(let i=0;i<9;i++)await new Promise(resolve=>requestAnimationFrame(()=>{const end=performance.now()+700;while(performance.now()<end){};resolve();}));}""")
        reduced=await page.evaluate("""() => ({insurance:SiteMotionInsurance.snapshot,reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,running:document.getAnimations().filter(a=>a.playState==='running').length})""")
        result['checks'].append({'kind':'real-reduced-mode-stall-not-insurance','fixture_only':True,'real_main_thread_block':'9 real rAF callbacks with 700ms CPU work; not CDP evidence','sample':reduced,'pass':reduced['reduced'] and not reduced['insurance']['stalled'] and not reduced['insurance']['checking'] and reduced['running']==0})
        await page.emulate_media(reduced_motion='no-preference');await page.wait_for_timeout(100)
        restored=await page.evaluate("""() => ({insurance:SiteMotionInsurance.snapshot,off:document.body.classList.contains('motion-off'),depth:document.body.dataset.sampleDepth,options:SiteSamples.options})""")
        result['checks'].append({'kind':'full-restore-with-no-insurance-latch','sample':restored,'pass':not restored['off'] and not restored['insurance']['stalled'] and restored['insurance']['checking'] and restored['depth']=='on' and all(restored['options'].values())})
        hidden=await page.evaluate("""async(address) => {
          const frame=document.createElement('iframe');frame.width=1440;frame.height=900;document.body.append(frame);await new Promise(r=>{frame.onload=r;frame.src=address+'/projects/timeaudit/';});await new Promise(r=>setTimeout(r,100));
          const doc=frame.contentDocument;let sample=null;doc.addEventListener('visibilitychange',()=>{sample={native_hidden:doc.hidden,insurance:frame.contentWindow.SiteMotionInsurance?.snapshot};});frame.src='about:blank';await new Promise(r=>setTimeout(r,100));frame.remove();return sample;
        }""",address)
        result['checks'].append({'kind':'native-hidden-event-suspends-insurance','fixture_only':True,'sample':hidden,'pass':hidden and hidden['native_hidden'] and hidden['insurance']['hidden'] and not hidden['insurance']['stalled'] and not hidden['insurance']['checking'] and hidden['insurance']['observed_frames']==0})
        await page.goto(address+'/',wait_until='domcontentloaded')
        startup=await page.evaluate("""async() => {const trace=[];for(let i=0;i<3;i++)await new Promise(resolve=>requestAnimationFrame(()=>{const end=performance.now()+500;while(performance.now()<end){};trace.push(SiteMotionInsurance.snapshot);resolve();}));return trace;}""")
        result['checks'].append({'kind':'startup-short-stall-does-not-trigger','fixture_only':True,'trace':startup,'pass':all(not x['stalled'] for x in startup) and startup[-1]['observed_ms']<5000})
        await page.wait_for_timeout(2300)
        await page.evaluate("""() => {const style=document.createElement('style');style.textContent='*{animation-play-state:paused!important}';style.id='test-pause-animations';document.head.append(style);document.getAnimations().forEach(a=>a.pause());}""")
        await page.wait_for_timeout(300)
        await page.evaluate("""async() => {for(let i=0;i<9;i++)await new Promise(resolve=>requestAnimationFrame(()=>{const end=performance.now()+700;while(performance.now()<end){};resolve();}));}""")
        idle=await page.evaluate('SiteMotionInsurance.snapshot')
        result['checks'].append({'kind':'no-visible-running-animation-does-not-trigger','fixture_only':True,'sample':idle,'pass':not idle['stalled'] and not idle['animation_running'] and idle['observed_frames']==0})
        await page.goto(address+'/',wait_until='load');await page.evaluate('document.fonts.ready');await page.wait_for_timeout(2300)
        frame_trace=await page.evaluate("""async() => {const trace=[];for(let i=0;i<12;i++)await new Promise(resolve=>requestAnimationFrame(()=>{const start=performance.now(),end=start+700;while(performance.now()<end){};trace.push({index:i,start,after:performance.now(),insurance:SiteMotionInsurance.snapshot});resolve();}));return trace;}""");await page.wait_for_timeout(80)
        fallback=await page.evaluate("""() => {const video=document.querySelector('video.hero-video');return {insurance:SiteMotionInsurance.snapshot,off:document.body.classList.contains('motion-off'),stalled:document.body.classList.contains('motion-stalled'),depth:document.body.dataset.sampleDepth,running:document.getAnimations().filter(a=>a.playState==='running').length,video:video?{paused:video.paused,hidden:video.hidden,time:video.currentTime}:null,hero:window.SiteHero,storage:{local:Object.keys(localStorage),session:Object.keys(sessionStorage)}};}""")
        await page.wait_for_timeout(180);fallback['video_after_time']=await page.evaluate("document.querySelector('video.hero-video')?.currentTime")
        notice=[line for line in console if '[SiteMotionInsurance]' in line]
        result['checks'].append({'kind':'actual-severe-stall-falls-back-static','fixture_only':True,'real_main_thread_block':'12 real rAF callbacks with 700ms CPU work; independent extreme fixture, not 4x/20x evidence','frame_trace':frame_trace,'sample':fallback,'console':notice,'pass':fallback['insurance']['stalled'] and fallback['insurance']['reason']=='severe-frame-stall' and fallback['insurance']['observed_ms']>=5000 and fallback['insurance']['observed_frames']>=8 and fallback['insurance']['median_fps']<10 and fallback['insurance']['slow_fraction']>=.9 and fallback['off'] and fallback['stalled'] and fallback['depth']=='off' and fallback['running']==0 and len(notice)==1 and 'FPS' in notice[0] and '秒' in notice[0] and fallback['storage']=={'local':[],'session':[]} and (not fallback['video'] or fallback['video']['paused'] and fallback['video']['hidden'] and abs(fallback['video_after_time']-fallback['video']['time'])<.01)})
        await page.goto(address+'/projects/timeaudit/',wait_until='load');await page.wait_for_timeout(2300)
        next_page=await page.evaluate("""() => ({insurance:SiteMotionInsurance.snapshot,off:document.body.classList.contains('motion-off'),storage:{local:Object.keys(localStorage),session:Object.keys(sessionStorage)}})""")
        result['checks'].append({'kind':'latch-does-not-affect-next-page','sample':next_page,'pass':not next_page['insurance']['stalled'] and not next_page['off'] and next_page['storage']=={'local':[],'session':[]}})
    finally:await context.close()


async def staging_checks(pw,args,address,result):
    """Small real first-release integration checks, without expanding 80 cases."""
    baseline=args.staging_baseline.resolve()
    def data(path):
        text=path.read_text('utf8');match=re.search(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>',text,re.S)
        return json.loads(match[1]) if match else None
    source_manifest=json.loads((baseline/'release-manifest.json').read_text('utf8'))
    output_manifest=json.loads((args.root/'release-manifest.json').read_text('utf8'))
    runtime_source=source_manifest.get('runtime_overlay')
    runtime_output=output_manifest.get('runtime_overlay')
    decisions=runtime_source['video_illustration_binding']['mount_decisions'] if runtime_source else {}
    video_rows=[]
    for hp in sorted(baseline.rglob('*.html')):
        before=data(hp);after=data(args.root/hp.relative_to(baseline))
        if before and before.get('video'):
            video_rows.append({'route':before.get('url') or '/','mount_allowed':before['video'].get('mount_allowed'),'video_spec_equal':before['video']==after['video']})
    if not runtime_source:
        decisions={row['route']:row['mount_allowed'] for row in video_rows}
    result['checks'].append({'kind':'first-staging-video-contract','source_release_id':source_manifest['release_id'],
        'decision_basis':'original runtime binding evidence' if runtime_source else 'exact video contracts in the verified audit baseline HTML',
        'runtime_overlay_identical':runtime_source==runtime_output,'pages':video_rows,
        'pass':runtime_source==runtime_output and len(video_rows)==len(decisions) and all(row['video_spec_equal'] and row['mount_allowed'] is decisions[row['route']] for row in video_rows)})
    profile=args.cache/('staging-desktop-'+uuid.uuid4().hex)
    context=await pw.chromium.launch_persistent_context(str(profile),executable_path=str(args.chrome),headless=True,viewport={'width':1440,'height':900})
    try:
        page=context.pages[0];page.on('pageerror',lambda error:result['issues'].append(str(error)))
        await page.goto(address+'/',wait_until='load');await page.evaluate('document.fonts.ready')
        await page.wait_for_function("window.SiteHero?.phase==='playing'&&document.querySelector('video.hero-video')?.readyState>=3",timeout=20000)
        video=await page.evaluate("""() => {const el=document.querySelector('video.hero-video'),d=JSON.parse(document.querySelector('#page-data').textContent);return {phase:SiteHero.phase,mount_allowed:d.video.mount_allowed,src:el.getAttribute('src'),expected_src:d.video.src,paused:el.paused,hidden:el.hidden,rate:el.playbackRate,current_time:el.currentTime,direct_src:!el.src.startsWith('blob:')};}""")
        await page.wait_for_timeout(150);video['after_time']=await page.evaluate("document.querySelector('video.hero-video').currentTime")
        result['checks'].append({'kind':'first-staging-home-stream-play','scope':'local actual first-release staging; no production OSS domain','sample':video,'pass':video['phase']=='playing' and video['mount_allowed'] is True and video['src']==video['expected_src'] and video['direct_src'] and not video['paused'] and not video['hidden'] and video['rate']==1.75 and abs(video['after_time']-video['current_time'])>.01})
        links=await page.evaluate("""() => {const d=JSON.parse(document.querySelector('#page-data').textContent);return [...document.querySelectorAll('.raster-card-main,.card-main')].filter(el=>el.getClientRects().length).map(el=>({label:el.getAttribute('aria-label')||el.textContent,href:el.getAttribute('href')}));}""")
        source=data(baseline/'index.html');expected={card['href'] for screen in source['screens'] for layout in screen.get('layouts',{}).values() for card in layout.get('interactive_cards',[]) if card.get('has_primary')}
        expected.update(link['href'] for screen in source['screens'] for layout in screen.get('layouts',{}).values() for link in layout.get('links',[]) if link.get('whole'))
        result['checks'].append({'kind':'first-staging-home-hrefs','visible_links':links,'expected_whole_hrefs':sorted(expected),'pass':bool(links and expected and expected.issubset({link['href'] for link in links}))})
        requests=[]
        def requested(request):
            if request.resource_type=='media':requests.append(request.url)
        page.on('request',requested)
        await page.goto(address+'/projects/localocr/',wait_until='load');await page.wait_for_timeout(180)
        gate=await page.evaluate("""() => ({phase:window.SiteHero?.phase,reason:window.SiteHero?.reason,mount_allowed:JSON.parse(document.querySelector('#page-data').textContent).video.mount_allowed,video_nodes:document.querySelectorAll('video.hero-video').length})""")
        result['checks'].append({'kind':'first-staging-MM01-representative-static','route':'/projects/localocr/','sample':gate,'media_requests':requests,'pass':gate['mount_allowed'] is False and gate['phase']=='image' and gate['reason']=='illustration-compatibility' and gate['video_nodes']==0 and not requests})
    finally:await context.close()
    # Reuse the real preference/leaf checker only on these three representative
    # routes. The previous 80-case proof remains a separate earlier artifact.
    await restore_checks(pw,args,address,result,selected_routes=['/','/projects/timeaudit/','/projects/localocr/'])


async def restore_checks(pw,args,address,result,selected_routes=None):
    routes=[]
    for hp in sorted(args.root.rglob('*.html')):
        text=hp.read_text('utf8');match=re.search(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>',text,re.S)
        if match:
            data=json.loads(match[1]);routes.append(data.get('url') or ('/' if hp.name=='index.html' and hp.parent==args.root else '/'+hp.relative_to(args.root).as_posix().removesuffix('index.html')))
    if selected_routes is not None:routes=selected_routes
    for view in ['desktop','phone']:
        phone=view=='phone';width,height=(412,915) if phone else (1440,900)
        profile=args.cache/('restore-'+view+'-'+uuid.uuid4().hex)
        context=await pw.chromium.launch_persistent_context(str(profile),executable_path=str(args.chrome),headless=True,
            viewport={'width':width,'height':height},device_scale_factor=3.5 if phone else 1,is_mobile=phone,has_touch=phone,
            **({'user_agent':'Mozilla/5.0 (Linux; Android 15; Xiaomi 15 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36'} if phone else {}))
        try:
            page=context.pages[0];page.on('pageerror',lambda error:result['issues'].append(str(error)))
            await context.add_init_script("""window.__numberCalls=[];const animate=Element.prototype.animate;Element.prototype.animate=function(frames,options){const animation=animate.call(this,frames,options);if(this.classList.contains('number-track'))window.__numberCalls.push({options,animation});return animation;};""")
            for index,route in enumerate(routes):
                await page.emulate_media(reduced_motion='reduce');await page.goto(address+route,wait_until='load');await page.evaluate('document.fonts.ready');await page.wait_for_timeout(70)
                source=await page.evaluate("""() => {
                  const hosts=[...document.querySelectorAll('.typeset-part:not([hidden]),.screen:not(.typeset-screen)')].filter(el=>el._layout);
                  const host=hosts.find(el=>el._layout.numbers?.length)||hosts[Math.min(1,hosts.length-1)],number=host?._layout.numbers?.[0];
                  if(host){const r=host.getBoundingClientRect();scrollTo({top:Math.max(0,scrollY+r.top+(number?number.rect[1]*(host._mediaHeight||host.clientHeight):100)-innerHeight*.35),behavior:'instant'});}
                  return {number_defined:!!number,host:host?.dataset.part||host?.dataset.screen};
                }""")
                await page.wait_for_timeout(70)
                before=await page.evaluate("({reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,depth:document.body.dataset.sampleDepth,number_calls:window.__numberCalls.length})")
                await page.emulate_media(reduced_motion='no-preference');await page.wait_for_timeout(90);await page.mouse.wheel(0,90);await page.wait_for_timeout(90)
                restored=await page.evaluate("""() => ({reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,depth:document.body.dataset.sampleDepth,numbers_enabled:SiteSamples.options.numbers,number_calls:window.__numberCalls.length,number_running:window.__numberCalls.some(x=>x.animation.playState==='running'&&x.animation.currentTime>0),depth_samples:[...document.querySelectorAll('.typeset-part:not([hidden]),.screen:not(.typeset-screen)')].map(el=>({value:parseFloat(el.style.getPropertyValue('--sample-y')),translate:getComputedStyle(el).translate})).filter(x=>Number.isFinite(x.value))})""")
                await page.emulate_media(reduced_motion='reduce');await page.wait_for_timeout(40)
                stopped=await page.evaluate("({reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,depth:document.body.dataset.sampleDepth})")
                await page.emulate_media(reduced_motion='no-preference');await page.wait_for_timeout(50);await page.mouse.wheel(0,90);await page.wait_for_timeout(70)
                resumed=await page.evaluate("({reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,depth:document.body.dataset.sampleDepth,translated:[...document.querySelectorAll('.typeset-part:not([hidden]),.screen:not(.typeset-screen)')].some(el=>parseFloat(el.style.getPropertyValue('--sample-y'))&&getComputedStyle(el).translate!=='none')})")
                passed=before['reduced'] and before['depth']=='off' and before['number_calls']==0 and not restored['reduced'] and restored['depth']=='on' and restored['numbers_enabled'] and any(item['value']!=0 and item['translate']!='none' for item in restored['depth_samples']) and (not source['number_defined'] or restored['number_running']) and stopped['reduced'] and stopped['depth']=='off' and not resumed['reduced'] and resumed['depth']=='on' and resumed['translated']
                result['checks'].append({'kind':'MM-02-reduced-motion-round-trip','route':route,'view':view,'css_viewport':[width,height],'dpr':3.5 if phone else 1,'phone_is_emulation':phone,'source':source,'before':before,'restored':restored,'stopped':stopped,'resumed':resumed,'pass':passed})
                leaves=await page.evaluate("""async() => {
                  const nodes=[...document.querySelectorAll('.falling-leaf')];await Promise.all(nodes.map(im=>im.decode().catch(()=>{})));
                  return nodes.map((el,index)=>{const animation=el.getAnimations()[0],timing=animation?.effect.getTiming(),before=animation?.currentTime,points=[];
                    if(animation)for(const fraction of [.15,.5,.85]){animation.currentTime=timing.duration*fraction-timing.delay;const r=el.getBoundingClientRect();points.push({fraction,left:r.left,right:r.right,top:r.top,bottom:r.bottom,intersects_horizontal:r.right>0&&r.left<innerWidth});}
                    if(animation)animation.currentTime=before;return {index,left:parseFloat(el.style.left),loaded:el.complete&&el.naturalWidth>0,state:animation?.playState,points};});
                }""")
                result['checks'].append({'kind':'MM-03-existing-leaf-trajectories','route':route,'view':view,'css_viewport':[width,height],'samples':leaves,'method':'seek existing CSS animation timeline and read actual rectangles; full six leaves on both sizes','pass':len(leaves)==6 and all(item['loaded'] and item['state']=='running' and 0<=item['left']<width and len(item['points'])==3 and all(point['intersects_horizontal'] for point in item['points']) for item in leaves)})
                if index%5==4:print(view+': '+str(index+1)+'/'+str(len(routes))+' restore/leaf routes checked',flush=True)
        finally:await context.close()


async def run(args, address):
    profile = args.cache / ('chrome-profile-' + uuid.uuid4().hex)
    result = {'schema': 'wly.motion-browser-check.v1', 'checked_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(),
        'root': str(args.root), 'method': 'installed headless Chrome, DOM/CSS/Web Animations; no screenshot', 'checks': [], 'issues': []}
    cfg = json.loads((ROOT/'config/motion-appearance.json').read_text('utf8'))
    async with async_playwright() as pw:
        context = await pw.chromium.launch_persistent_context(str(profile), executable_path=str(args.chrome), headless=True,
            viewport={'width': 1440, 'height': 900}, args=['--hide-scrollbars'])
        try:
            page = context.pages[0]
            page.on('pageerror', lambda error: result['issues'].append(str(error)))
            await context.add_init_script("""window.__motionCalls=[];const animate=Element.prototype.animate;Element.prototype.animate=function(frames,options){const animation=animate.call(this,frames,options);window.__motionCalls.push({className:this.className,frames,options,animation});return animation;};""")
            for width in [1440, 390]:
                await page.set_viewport_size({'width': width, 'height': 900})
                await page.goto(address+'/projects/localocr/', wait_until='load')
                await page.evaluate('document.fonts.ready')
                await page.wait_for_timeout(100)
                values = await page.evaluate("""() => {
                  const hosts=[...document.querySelectorAll('.typeset-part:not([hidden]),.screen:not(.typeset-screen)')];
                  const host=hosts[Math.min(2,hosts.length-1)];let top=0;for(let node=host;node;node=node.offsetParent)top+=node.offsetTop;
                  scrollTo({top:top+600,behavior:'instant'});return {appearance:window.SiteMotionAppearance,host:host.dataset.part||host.dataset.screen};
                }""")
                await page.wait_for_timeout(120)
                await page.mouse.wheel(0,200)
                await page.wait_for_timeout(120)
                values['depth'] = await page.evaluate("""() => [...document.querySelectorAll('.typeset-part:not([hidden]),.screen:not(.typeset-screen)')].map(el=>({variable:parseFloat(el.style.getPropertyValue('--sample-y')),translate:getComputedStyle(el).translate})).filter(x=>Number.isFinite(x.variable))""")
                limit = (cfg['baseline']['parallax_desktop_px'] if width >= 600 else cfg['baseline']['parallax_phone_px'])*cfg['amplitude']
                values['expected_limit_px'] = limit
                values['runtime'] = await page.evaluate("({y:scrollY,depth:document.body.dataset.sampleDepth,visible:window.SiteSamples?.visible(),hidden:document.hidden,off:document.body.classList.contains('motion-off')})")
                values['pass'] = bool(values['appearance'] == cfg and values['depth'] and all(abs(item['variable']) <= limit+.001 for item in values['depth']) and any(abs(abs(item['variable'])-limit)<.01 for item in values['depth']) and all(item['translate'] != 'none' for item in values['depth']))
                result['checks'].append({'kind': 'actual-parallax', 'width': width, **values})
                calls = await page.evaluate("""() => window.__motionCalls.filter(x=>x.className.includes('sample-card')).map(x=>({frames:x.frames,options:x.options,current_time:x.animation.currentTime}))""")
                result['checks'].append({'kind':'actual-card-animation','width':width,'samples':calls,'pass':bool(calls) and all(x['frames'][0]['transform']=='translateY(80px)' and x['options']['duration']==cfg['duration_ms']['cards']/cfg['speed_multiplier'] for x in calls)})
            # Real old homepage runtime must expose and use the same config.
            await page.goto(address+'/', wait_until='load')
            result['checks'].append({'kind':'homepage-runtime','pass':await page.evaluate('window.SiteMotionAppearance?.amplitude===2.5&&!!window.SiteSamples?.refresh')})
            await page.wait_for_timeout(200)
            circle=await page.evaluate("""async() => {
              const host=[...document.querySelectorAll('.typeset-part:not([hidden]),.screen:not(.typeset-screen)')].find(el=>el._layout);
              const original=host._layout;host._layout={...original,cards:[],numbers:[{text:'①',numeric:'①',value:1,notation:'circled',rect:[.12,.12,.06,.08]}]};
              SiteSamples.refresh();await new Promise(r=>setTimeout(r,120));const track=host.querySelector('.number-track'),animation=track?.getAnimations()[0];
              const proof={first:track?.firstElementChild?.textContent,last:track?.lastElementChild?.textContent,duration:animation?.effect.getTiming().duration,current_time:animation?.currentTime};
              host._layout=original;SiteSamples.refresh();return proof;
            }""")
            result['checks'].append({'kind':'actual-circled-number-track','fixture_only':True,**circle,'pass':circle.get('first')=='⓪' and circle.get('last')=='①' and circle.get('duration')==cfg['duration_ms']['numbers']/cfg['speed_multiplier'] and (circle.get('current_time') or 0)>0})
            # Controlled local state fixtures exercise active/off/pending/unknown
            # selectors without calling or fabricating the real status provider.
            native = await page.evaluate("""async() => {
              const host=document.createElement('div');host.className='typeset-part';
              for(const state of ['ok','off','pending','unknown']){const el=document.createElement('a');el.className='typeset-live slot';el.dataset.state=state;el.innerHTML='<i></i><span>状态夹具</span>';host.append(el);}
              document.body.append(host);await new Promise(r=>setTimeout(r,40));
              const samples=[...host.children].map(el=>({state:el.dataset.state,animation:getComputedStyle(el.querySelector('i')).animationName,animations:el.querySelector('i').getAnimations().map(a=>({state:a.playState,duration:a.effect.getTiming().duration,rate:a.playbackRate,frames:a.effect.getKeyframes()}))}));
              window.__statusFixture=host;return samples;
            }""")
            result['checks'].append({'kind':'active-status-css','fixture_only':True,'samples':native,'pass':native[0]['animation']=='pulse' and bool(native[0]['animations']) and native[0]['animations'][0]['duration']==3000 and native[0]['animations'][0]['rate']==2.5 and any('2.25' in frame.get('transform','') for frame in native[0]['animations'][0]['frames']) and all(x['animation']=='none' for x in native[1:])})
            await page.emulate_media(reduced_motion='reduce'); await page.wait_for_function("matchMedia('(prefers-reduced-motion:reduce)').matches&&document.body.classList.contains('motion-off')",timeout=3000)
            reduced = await page.evaluate("""() => ({native:matchMedia('(prefers-reduced-motion:reduce)').matches,off:document.body.classList.contains('motion-off'),animations:window.__statusFixture.querySelector('i').getAnimations().filter(a=>a.playState==='running').length})""")
            result['checks'].append({'kind':'system-reduced-motion',**reduced,'pass':reduced['native'] and reduced['off'] and reduced['animations']==0})
            await page.emulate_media(reduced_motion='no-preference')
            # Classify current producer markers and retain circle notation in DOM.
            helpers=(ROOT/'scripts/typeset-measure.js').read_text('utf8').split('(async()=>{',1)[0]
            classified=await page.evaluate(helpers+"""(() => {
              const host=document.createElement('div');host.innerHTML='<div><span class="dot dot-on">●</span></div><div><span class="dot dot-x">✕</span></div><div><span class="feature-status-dot" data-state="pending"></span></div><div><span class="feature-status-dot" data-state="on"></span></div><div><span class="legend-dot"></span></div>';
              const result=[...host.querySelectorAll('span')].map(typesetStatusState);return {states:result,number:typesetNumberToken('①')};
            })()""")
            result['checks'].append({'kind':'source-marker-branches','fixture_only':True,**classified,'pass':classified['states']==['active','inactive','inactive','active','non_status'] and classified['number']['value']==1 and classified['number']['notation']=='circled'})
            # A real iframe navigation emits native visibilitychange on its old
            # document. Observe runtime pause after the browser marks it hidden.
            hidden=await page.evaluate("""async(address) => {
              const frame=document.createElement('iframe');frame.width=1440;frame.height=900;document.body.append(frame);
              await new Promise((resolve,reject)=>{frame.onload=resolve;frame.onerror=reject;frame.src=address+'/';});
              const win=frame.contentWindow,doc=win.document;const host=doc.createElement('div');host.className='typeset-part';host.innerHTML='<a class="typeset-live slot" data-state="ok"><i></i></a>';doc.body.append(host);
              await new Promise(r=>setTimeout(r,80));const lamp=host.querySelector('i'),animation=lamp.getAnimations()[0];
              const before=animation?.currentTime;let observation={event:false};doc.addEventListener('visibilitychange',()=>{observation={event:true,hidden:doc.hidden,paused:doc.body.classList.contains('paused'),before,current:animation?.currentTime,state:animation?.playState};});
              frame.src='about:blank';await new Promise(r=>setTimeout(r,160));observation.after=animation?.currentTime;frame.remove();return observation;
            }""", address)
            result['checks'].append({'kind':'native-background-pause','fixture_only':True,**hidden,'pass':hidden.get('event') and hidden.get('hidden') and hidden.get('paused') and (hidden.get('state')=='paused' or abs((hidden.get('after') or 0)-(hidden.get('current') or 0))<2)})
            if args.restore_all:await restore_checks(pw,args,address,result)
            if args.staging_baseline:await staging_checks(pw,args,address,result)
            if args.stall_insurance:await insurance_checks(pw,args,address,result)
        except Exception as error:
            result['issues'].append(type(error).__name__+': '+str(error))
        finally:
            await context.close()
    result['issues'] += [x['kind']+(': '+str(x.get('width')) if 'width' in x else '') for x in result['checks'] if not x['pass']]
    result['status']='pass' if not result['issues'] else 'fail';return result


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    for name in ['root','cache','out']:ap.add_argument('--'+name,type=Path,required=True)
    ap.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'));ap.add_argument('--restore-all',action='store_true');ap.add_argument('--staging-baseline',type=Path);ap.add_argument('--stall-insurance',action='store_true');args=ap.parse_args()
    args.cache.mkdir(parents=True,exist_ok=True)
    for key in ['TEMP','TMP','TMPDIR']:os.environ[key]=str(args.cache.resolve())
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self,*a,**kw):super().__init__(*a,directory=str(args.root.resolve()),**kw)
        def log_message(self,*a):pass
        def copyfile(self,source,output):
            try:super().copyfile(source,output)
            except (BrokenPipeError,ConnectionAbortedError,ConnectionResetError):pass
        def do_GET(self):
            if self.path.split('?')[0]=='/__status':
                body=b'{"state":"unavailable","reason":"local_motion_check"}';self.send_response(200);self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body);return
            return super().do_GET()
    server=ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    try:
        result=asyncio.run(run(args,'http://127.0.0.1:'+str(server.server_port)))
        args.out.parent.mkdir(parents=True,exist_ok=True);args.out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
        print(json.dumps({'status':result['status'],'checks':len(result['checks']),'issues':result['issues']},ensure_ascii=False))
        if result['status']!='pass':raise SystemExit(1)
    finally:server.shutdown();server.server_close();thread.join(timeout=5)


if __name__=='__main__':main()

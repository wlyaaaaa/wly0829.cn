"""Chrome UI gate: local assets by default; online needs --pages, --online-full explicitly enables all routes. Only --ink-assets images use online GET; others use HEAD. Estimates cover both widths."""
import argparse, asyncio, hashlib, json, os, re, subprocess, tempfile, time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import unquote, urlsplit
from playwright.async_api import async_playwright
HERE = Path(__file__).resolve().parent
INTERNAL = ['AI 待验收', '以后再做', '运行结果未确认', '等第一次运行']
PROBE = """(() => {
 window.__uiVideos = new Set(); const create = Document.prototype.createElement;
 Document.prototype.createElement = function(tag,...args) { const e=create.call(this,tag,...args); if(String(tag).toLowerCase()==='video') __uiVideos.add(e); return e; };
 window.__uiDraws = new WeakMap();
 for(const proto of [CanvasRenderingContext2D.prototype,WebGLRenderingContext.prototype,window.WebGL2RenderingContext?.prototype].filter(Boolean)) {
   for(const name of ['drawArrays','drawElements','fill','stroke','fillRect','drawImage']) { const fn=proto[name]; if(fn) proto[name]=function(...args) { __uiDraws.set(this.canvas,(__uiDraws.get(this.canvas)||0)+1); return fn.apply(this,args); }; }
 }
})();"""
MOTION = """selector => new Promise(done=>requestAnimationFrame(()=>done([...document.querySelectorAll(selector)].map(e => {
 const r=e.getBoundingClientRect(),visible=r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true});
 let pixels=null;
 if(e instanceof HTMLCanvasElement && visible) try {
   const c=document.createElement('canvas'),x=c.getContext('2d');c.width=c.height=64;
   const crop=[Math.max(0,-r.left),Math.max(0,-r.top),Math.min(r.right,innerWidth)-Math.max(r.left,0),Math.min(r.bottom,innerHeight)-Math.max(r.top,0)];
   x.drawImage(e,crop[0]*e.width/r.width,crop[1]*e.height/r.height,crop[2]*e.width/r.width,crop[3]*e.height/r.height,0,0,64,64);
   const data=x.getImageData(0,0,64,64).data;pixels=data.some(v=>v>0)?data.reduce((h,v)=>Math.imul(h^v,16777619)>>>0,2166136261):null;
 } catch {}
 return {id:e.closest('.boat')?'boat:'+e.closest('.boat').dataset.i:e.id||e.getAttribute('data-hl')||e.className,visible,x:r.x,y:r.y,width:r.width,height:r.height,draws:__uiDraws.get(e)||0,pixels,transform:getComputedStyle(e).transform};
}))))"""
def motion_changed(before, after):
    return any(a['visible'] and b['visible'] and (a.get('pixels') is not None and b.get('pixels') is not None and a['pixels']!=b['pixels'] or a['transform']!=b['transform']) for a,b in zip(before,after))
VIDEOS = """() => [...new Set([...__uiVideos,...document.querySelectorAll('video')])].map(v=>({src:v.currentSrc||v.src,time:v.currentTime,duration:v.duration,paused:v.paused,ended:v.ended,loop:v.loop,autoplay:v.autoplay,ready:v.readyState,error:v.error?.code}))"""
COLOR = """selector=>new Promise(done=>requestAnimationFrame(()=>done([...document.querySelectorAll(selector)].map(e=>{try{const c=document.createElement('canvas');c.width=c.height=24;const x=c.getContext('2d');x.drawImage(e,0,0,24,24);const p=x.getImageData(0,0,24,24).data;return [0,1,2].map(k=>p.reduce((s,v,i)=>s+(i%4===k?v:0),0)/576)}catch{return null}}))))"""
def inventory(root, pages=None):
    routes, ids = {}, {}
    for file in sorted(root.rglob('index.html')) + ([root/'404.html'] if (root/'404.html').is_file() else []):
        route = '/' + file.relative_to(root).as_posix().removesuffix('index.html'); routes[route] = file
        match = re.search(r'<script[^>]*id=[\"\x27]page-data[\"\x27][^>]*>(.*?)</script>', file.read_text('utf8'), re.S)
        if match: ids.setdefault(json.loads(match[1]).get('page'), []).append(route)
    if not routes: raise ValueError('No static routes; refusing an empty PASS')
    if not pages: return sorted(routes)
    chosen = set()
    for name in pages:
        route = '/' if name in ('home','homepage','index') else name if name in routes else '/'+name.strip('/')+'/'
        matches = ids.get(name) or ([route] if route in routes else [])
        if not matches: raise ValueError('Unknown affected page: '+name)
        chosen.update(matches)
    return sorted(chosen)
async def review(page, base, route, width, dom, blocked=None, native_routes=()):
    issues, checks = [], {'reloads': [], 'phases': []}
    fail = lambda kind, element, evidence: issues.append(dict(kind=kind, element=element, evidence=evidence))
    response = await page.goto(base+route, wait_until='domcontentloaded', timeout=30000)
    if not response or response.status >= 400: fail('route-http', route, {'status': response.status if response else None})
    if route in native_routes:
        await page.wait_for_timeout(2000)
        texts = await page.evaluate("html=>[new DOMParser().parseFromString(html,'text/html'),document].map(d=>{const main=d.querySelector('main')?.cloneNode(true);main?.querySelectorAll('.image-loading-wrap,noscript').forEach(e=>e.remove());return (main?.textContent||'').replace(/\\s+/g,' ').trim()})", await response.text() if response else '')
        checks['native_readability'] = {'consistent': bool(texts[0]) and texts[0]==texts[1], **{name:{'sha256':hashlib.sha256(value.encode('utf8')).hexdigest(),'characters':len(value)} for name,value in zip(('ssr','browser'),texts)}}
        if not checks['native_readability']['consistent']: fail('native-main-rewritten', 'main', checks['native_readability'])
    await page.evaluate('document.fonts.ready'); await page.wait_for_timeout(800)
    await page.evaluate("async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*.8){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,100));}await new Promise(r=>setTimeout(r,500));scrollTo({top:0,behavior:'instant'})}")
    await page.evaluate("()=>Promise.race([Promise.all([...document.images].filter(e=>e.checkVisibility()).map(e=>e.complete?Promise.resolve():new Promise(r=>{e.addEventListener('load',r,{once:true});e.addEventListener('error',r,{once:true})}))),new Promise(r=>setTimeout(r,5000))])")
    if blocked is not None: await page.evaluate('values=>window.__uiBlockedImages=values',blocked.get(page,{}))
    measured = await page.evaluate(dom); issues.extend(measured['issues']); checks.update(measured['counts'], measurements=measured.get('measurements',[]))
    checks['video_before_interaction'] = await page.evaluate(VIDEOS)
    for video in checks['video_before_interaction']:
        if video['ready']>=2 and video['paused']: fail('video-autoplay',video['src'],video)
    links = await page.locator('a[href^="#"]:not(.skip):not(.skip-link),button[data-b2-action^="choose-"]').evaluate_all("es=>es.filter(e=>e.checkVisibility({checkOpacity:true})&&!e.closest('.screen-equivalent-text')).map(e=>({href:e.getAttribute('href')||e.dataset.b2Action,action:e.dataset.b2Action,text:e.innerText})).filter(x=>x.href.length>1)")
    for link in {x['href']: x for x in links}.values():
        await page.goto(base+route, wait_until='domcontentloaded', timeout=30000)
        await page.evaluate('document.fonts.ready'); await page.wait_for_timeout(800)
        target = page.locator(('[data-b2-action='+json.dumps(link['action'])+']' if link.get('action') else 'a[href='+json.dumps(link['href'])+']')+':visible').first
        if not link.get('action') and not await page.evaluate("id=>!!document.getElementById(decodeURIComponent(id.slice(1)))",link['href']): fail('anchor-target-missing',link['href'],{}); continue
        if link.get('action') and await target.count() and not await target.is_enabled(): fail('anchor-unavailable-review',link['href'],{'reason':'control-disabled'}); continue
        try: await target.click(timeout=5000)
        except Exception as error: fail('anchor-click-failed', link['href'], str(error)); continue
        positions = await page.evaluate("async()=>{const p=[];for(let i=0;i<12;i++){await new Promise(r=>setTimeout(r,250));p.push(scrollY)}return p}")
        if max(positions[4:])-min(positions[4:]) > 4: fail('anchor-rebound', link['href'], {'positions_250ms': positions})
    checks['anchors'] = len(links)
    await page.evaluate('scrollTo(0,0)')
    if route in ('/', '/cockpit/'):
        selector = '.hero-live-layer canvas' if route == '/' else '[data-today-river] canvas, [data-today-river] .boat:not(.ashore) .bob'
        for run in range(5):
            await page.reload(wait_until='domcontentloaded'); await page.wait_for_timeout(1800)
            await page.locator('#home-01' if route == '/' else '[data-today-river]').scroll_into_view_if_needed()
            before = await page.evaluate(MOTION, selector); await page.wait_for_timeout(1000); after = await page.evaluate(MOTION, selector)
            record = {'run': run+1, 'before': before, 'after': after}; checks['reloads'].append(record)
            if route == '/cockpit/' and await page.evaluate('Boolean(window.todayRiver?.model && window.todayRiver.model.past.length+window.todayRiver.model.future.length)') and not any(a['id'].startswith('boat:') and a['visible'] and a['transform']!=b['transform'] for a,b in zip(before,after)): fail('boat-missing-or-stopped',selector,record)
            if not before or not any(x['visible'] for x in before): fail('living-missing', selector, record)
            elif not motion_changed(before,after): fail('living-frame-unmeasurable-review', selector, record)
        if route == '/':
            fail('hero-boat-identity-review',selector,{'reason':'canvas pixels prove scene movement; they do not independently identify the boat sprite'})
            night = page.get_by_role('button',name='晚上',exact=True)
            if await night.count(): await night.click(); await page.wait_for_timeout(800)
            for label in ['清晨','白天','傍晚','晚上','一分钟循环一天']:
                control = page.get_by_role('button', name=label, exact=True)
                if not await control.count(): fail('phase-control-missing', label, {'count':0}); continue
                state = lambda: control.evaluate("e=>JSON.stringify([e.getAttribute('aria-pressed'),e.getAttribute('aria-selected'),e.className,document.body.dataset])")
                selected = await state(); color = await page.evaluate(COLOR, selector); await control.click(); await page.wait_for_timeout(800)
                after_color = await page.evaluate(COLOR,selector); record = {'label':label,'colors':[color,after_color],'selection_changed':selected!=await state()}; checks['phases'].append(record)
                if not any(a and b and max(abs(x-y) for x,y in zip(a,b))>2 for a,b in zip(color,after_color)): fail('phase-control-inert' if any(a and b for a,b in zip(color,after_color)) else 'phase-pixels-unmeasurable-review',label,record)
    samples = [await page.evaluate(VIDEOS)]; animation = [await page.evaluate(MOTION, selector)] if route in ('/','/cockpit/') else []
    if samples[0] or animation:
        for _ in range(30):
            await page.wait_for_timeout(1000); samples.append(await page.evaluate(VIDEOS))
            if animation: animation.append(await page.evaluate(MOTION,selector))
        if animation and not any(motion_changed(a,b) for a,b in zip(animation,animation[1:])):
            fail('living-30s-stopped' if any(x.get('pixels') is not None for frame in animation for x in frame) else 'living-frame-unmeasurable-review',selector,{'samples_1s':animation})
        for index, video in enumerate(samples[0]):
            trace = [s[index] for s in samples if len(s)>index]
            if not any(a['time']>b['time'] for a,b in zip(trace,trace[1:])) and video['duration'] and video['duration']>0:
                await page.evaluate("i=>[...new Set([...__uiVideos,...document.querySelectorAll('video')])][i].currentTime=Math.max(0,[...new Set([...__uiVideos,...document.querySelectorAll('video')])][i].duration-.3)",index)
                await page.wait_for_timeout(1200); boundary = (await page.evaluate(VIDEOS))[index]
                if boundary['time']>=video['duration']-.3 or boundary['ended']: fail('video-loop-failed',video['src'],boundary)
            if any(s['paused'] or s['ended'] or s['error'] for s in trace) or any(a['time']==b['time'] for a,b in zip(trace,trace[1:])): fail('video-playback', video['src'], {'samples_1s': trace})
    checks['videos'] = samples; checks['animation_30s'] = animation
    if route == '/cockpit/':
        text = await page.locator('body').inner_text()
        for word in INTERNAL:
            if word in text: fail('internal-wording', word, {'matches': text.count(word)})
        rows = await page.locator('[data-row-key^="read-gap:"]').evaluate_all("es=>es.filter(e=>e.checkVisibility()).map(e=>({source:e.dataset.rowKey.split(':')[1],text:e.innerText}))")
        checks['unavailable'] = {s:[r['text'] for r in rows if r['source']==s] for s in {r['source'] for r in rows}}
        for source, rows in checks['unavailable'].items():
            if len(rows)>1: fail('unavailable-repeat' if source!='unknown' else 'unavailable-source-unknown', source, {'rows': rows})
    if route.startswith('/rules'):
        rule_body = 'main article.rule-original-prose, main pre:not(article.rule-original-prose pre)'
        visible = [await e.inner_text() for e in await page.locator(rule_body).all() if await e.evaluate("e=>!e.closest('[hidden]')&&e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&getComputedStyle(e).clipPath==='none'")]
        checks['rule_visible_characters'] = sum(map(len, visible))
        if checks['rule_visible_characters'] < 200: fail('rule-original-image-only', rule_body, {'visible_characters': checks['rule_visible_characters']})
    return dict(route=route, width=width, final_url=page.url, issues=issues, checks=checks)
async def run(args):
    if args.base_url and (args.full or not args.pages) and not args.online_full: raise ValueError('Online all-route checks require --online-full; use local --root --full by default')
    started = time.monotonic(); routes = inventory(args.root.resolve(), None if args.full or args.online_full else args.pages)
    native_routes = json.loads((args.root/'release-manifest.json').read_text('utf8')).get('native_readability',{}).get('routes',{}) if (args.root/'release-manifest.json').is_file() else {}
    preparation = args.oss_preparation or (args.root.parent if (args.root.parent/'oss-plan.json').is_file() else None)
    objects = json.loads((preparation/'oss-plan.json').read_text('utf8'))['objects'] if preparation else {}
    assets = {urlsplit(obj['url'])._replace(query='',fragment='').geturl():(preparation/'oss'/rel,obj) for rel,obj in objects.items()}
    policy = dict(mode='online-full' if args.online_full else 'online-selected' if args.base_url else 'local-candidate',estimated_MiB=args.estimate_mb or len(routes)*6 if args.base_url else 0,local_asset_responses=0,online_image_gets=0,image_heads={},blocked_resources={})
    print('Resource policy / 预计流量: '+json.dumps(policy,ensure_ascii=False),flush=True)
    args.output.parent.mkdir(parents=True, exist_ok=True); temp = Path(tempfile.mkdtemp(prefix='site-ui-', dir=args.output.parent)).resolve()
    os.environ['TEMP'] = os.environ['TMP'] = os.environ['TMPDIR'] = str(temp)
    base = args.base_url.rstrip('/') if args.base_url else 'https://wly0829.cn'; records = []; blocked = {}; dom = (HERE/'site-ui-dom.js').read_text('utf8')
    async with async_playwright() as pw:
        context = await pw.chromium.launch_persistent_context(str(temp/'profile'), executable_path=str(args.chrome), headless=True, reduced_motion='no-preference',service_workers='block')
        await context.add_init_script(PROBE)
        if args.geometry:
            glyphs = [{'src':r['parts'][0]['image'],'sha256':r['parts'][0]['sha256'],'boxes':r.get('content_occupancy',{}).get('blocks',[])} for r in json.loads(args.geometry.read_text('utf8'))['records'] if len(r.get('parts',[]))==1]
            await context.add_init_script('window.__uiGlyphs='+json.dumps(glyphs))
        async def resources(handler):
            request = handler.request; parsed = urlsplit(request.url); key = parsed._replace(query='',fragment='').geturl()
            image = request.resource_type=='image' or bool(re.search(r'\.(png|webp|jpe?g|gif|svg|avif)$',parsed.path,re.I))
            if not args.base_url and parsed.netloc==urlsplit(base).netloc:
                file = (args.root.resolve()/unquote(parsed.path).lstrip('/')).resolve()
                if file.is_dir(): file = file/'index.html'
                if not file.is_relative_to(args.root.resolve()) or not file.is_file(): return await handler.fulfill(status=404,body='candidate route missing')
                return await handler.fulfill(path=str(file))
            if not args.base_url:
                if key in assets:
                    file,obj = assets[key]
                    if file.is_file() and file.stat().st_size==obj['bytes'] and hashlib.sha256(file.read_bytes()).hexdigest()==obj['sha256']:
                        policy['local_asset_responses']+=1
                        return await handler.fulfill(path=str(file),content_type=obj.get('content_type'),headers={'Access-Control-Allow-Origin':'*'})
                policy['blocked_resources'][key]='local-unavailable'
            elif image and key not in {urlsplit(url)._replace(query='',fragment='').geturl() for url in args.ink_assets}:
                if key not in policy['image_heads']:
                    try: response = await context.request.head(key,timeout=8000); policy['image_heads'][key]=response.status; await response.dispose()
                    except Exception: policy['image_heads'][key]=0
                policy['blocked_resources'][key]=policy['image_heads'][key]
            else:
                if image: policy['online_image_gets']+=1
                return await handler.continue_()
            blocked.setdefault(request.frame.page,{})[key]=policy['blocked_resources'][key]
            return await handler.abort('blockedbyclient')
        await context.route('**/*',resources)
        semaphore = asyncio.Semaphore(4)
        async def check(route, width):
            async with semaphore:
                page = await context.new_page(); await page.set_viewport_size({'width':width,'height':900})
                try:
                    record = await review(page,base,route,width,dom,blocked,native_routes)
                    if not args.base_url:
                        gaps = [key for key in blocked.get(page,{}) if re.search(r'\.(js|css|woff2?|mp4|webm)$',urlsplit(key).path,re.I)]
                        if gaps: record['issues'].append(dict(kind='local-assets-unavailable-review',element=route,evidence={'assets':gaps})); record['dependency_unavailable']=True
                except Exception as error: record = dict(route=route,width=width,issues=[dict(kind='check-error',element=route,evidence=str(error))])
                finally: await page.close()
                records.append(record); print(f'{len(records)}/{len(routes)*2} {width} {route} issues={len(record["issues"])}', flush=True)
        await asyncio.gather(*(check(route,width) for route in routes for width in (390,1440)))
        version = context.browser.version; await context.close()
    receipt = dict(schema='website.ui-gate.v1',observed_at_beijing=datetime.now(timezone(timedelta(hours=8))).isoformat(),base_url=base,candidate_root=str(args.root.resolve()) if not args.base_url else None,chrome=str(args.chrome),chrome_version=version,temp=str(temp),seconds=round(time.monotonic()-started,2),records=sorted(records,key=lambda r:(r['route'],r['width'])))
    receipt['resource_policy']=policy
    baseline = json.loads((HERE/'site-ui-baseline.json').read_text('utf8')); keys = {(i['route'],i['width'],i['kind'],i['element']) for i in baseline['issues']}
    for r,i in ((r,i) for r in records for i in r['issues']): i['known'] = (r['route'],r['width'],i['kind'],i['element']) in keys
    findings = [i for r in records for i in r['issues']]; warnings = [i for r in records for i in r['issues'] if r.get('dependency_unavailable') or 'review' in i['kind'] or 'unmeasurable' in i['kind'] or i['kind']=='check-error']; novel = [i for i in findings if i not in warnings and not i['known']]
    receipt.update(issue_count=len(findings),warning_count=len(warnings),known_count=sum(i['known'] for i in findings),blocker_count=len(novel),baseline=baseline['version'],status='fail' if novel else 'partial' if findings else 'pass')
    if os.name == 'nt':
        cleanup = subprocess.run(['pwsh','-NoProfile','-File','E:/.agents/tools/Move-TaskItemToRecycleBin.ps1','-LiteralPath',str(temp),'-AllowedRoot',str(args.output.parent.resolve()),'-Json'],capture_output=True,text=True,encoding='utf8',creationflags=subprocess.CREATE_NO_WINDOW)
        receipt['temp_cleanup'] = json.loads(cleanup.stdout.lstrip('\ufeff')) if cleanup.returncode==0 else {'status':'failed','error':cleanup.stderr}
    args.output.write_text(json.dumps(receipt,ensure_ascii=False,indent=2),'utf8'); print(json.dumps({k:receipt[k] for k in ('status','issue_count','seconds')},ensure_ascii=False))
    return bool(receipt['blocker_count'])
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,required=True); parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--base-url'); parser.add_argument('--pages',nargs='+'); parser.add_argument('--full',action='store_true'); parser.add_argument('--geometry',type=Path)
    parser.add_argument('--oss-preparation',type=Path); parser.add_argument('--ink-assets',nargs='*',default=[]); parser.add_argument('--online-full',action='store_true'); parser.add_argument('--estimate-mb',type=int)
    parser.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    raise SystemExit(asyncio.run(run(parser.parse_args())))

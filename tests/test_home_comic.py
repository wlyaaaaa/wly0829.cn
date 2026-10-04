"""Comic source checks and installed headless Chrome fixtures; no image inspection."""
from __future__ import annotations
import argparse
import asyncio
from datetime import datetime, timedelta, timezone
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import json
import mimetypes
import os
from pathlib import Path
import re
import secrets
import subprocess
import threading
from urllib.parse import unquote, urlsplit
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('tested_home_comic', ROOT/'scripts/prepare-home-comic.py')
comic = importlib.util.module_from_spec(spec); spec.loader.exec_module(comic)


class SourceTests(unittest.TestCase):
    def test_known_release_identity_schemes(self):
        files = {'index.html': {'sha256': 'a'*64, 'bytes': 3}}
        normal = {'schema': 'wly.hybrid-release.v1'}
        overlay = {**normal, 'runtime_overlay': {'schema': 'wly.oss-video-runtime.v1', 'status': 'prepared'}}
        self.assertEqual(comic.identity(files, normal), hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest())
        self.assertEqual(comic.identity(files, overlay), hashlib.sha256(json.dumps(files, sort_keys=True, separators=(',', ':')).encode()).hexdigest())
        with self.assertRaises(ValueError): comic.identity(files, {'schema': 'unknown'})

    def test_static_guard_is_before_any_engine_canvas(self):
        package = os.environ.get('WLY_COMIC_PACKAGE')
        if not package: self.skipTest('Set WLY_COMIC_PACKAGE to the delivered merged package')
        original = (Path(package)/'comic-live.js').read_bytes().decode('utf8')
        patched = comic.patch_engine(original)
        self.assertLess(patched.index('if (siteStatic()) return;'), patched.index("document.createElement('canvas')"))
        self.assertEqual(patched.count('const SPEED = 2.5;'), 1)
        self.assertNotIn('getImageData', patched)
        self.assertNotIn('localStorage', patched); self.assertNotIn('sessionStorage', patched)
        subprocess.run(['node', '--check', '-'], input=patched, text=True, encoding='utf8', capture_output=True, check=True)
        self.assertEqual(comic.patch_engine(patched), patched)


PROBE = r'''(() => {
window.__comicProbe={draws:0,scales:[],canvasCreates:0,storage:[],starts:[],previous:{}};
const p=window.__comicProbe,create=Document.prototype.createElement;
Document.prototype.createElement=function(tag,...args){if(tag==='canvas'&&String(new Error().stack).includes('comic-live.js'))p.canvasCreates++;return create.call(this,tag,...args);};
const draw=CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage=function(im,...args){
 if(this.canvas.classList.contains('comic-live'))p.draws++;
 if(im instanceof HTMLImageElement&&/home-0[23]-/.test(im.currentSrc||im.src)&&args.length===4&&args[0]===0&&args[1]===0&&[2880,1280].includes(args[2])){
   const row={src:im.currentSrc||im.src,decoded:[im.naturalWidth,im.naturalHeight],destination:[args[2],args[3]]};
   if(!p.scales.some(x=>x.src===row.src&&x.destination[0]===row.destination[0]))p.scales.push(row);
 }
 return draw.call(this,im,...args);
};
const set=Storage.prototype.setItem;
Storage.prototype.setItem=function(k,v){p.storage.push(k);return set.call(this,k,v);};
setInterval(()=>{if(!window.comicLive)return;const s=comicLive.state();for(const [name,state]of Object.entries(s)){if(p.previous[name]==='idle'&&state==='play')p.starts.push({name,at:performance.now(),kind:comicLive.kind});}p.previous=s;},20);
})();'''

SNAP = r'''() => {
const alpha=canvas=>{const a=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let nonzero=0,sum=0;for(let i=3;i<a.length;i+=4){if(a[i])nonzero++;sum+=a[i];}return {nonzero,sum,pixels:a.length/4};};
return {kind:window.comicLive?.kind,ready:window.comicLive?.ready(),state:window.comicLive?.state(),speed:window.comicLive?.SPEED,
  browserUserAgent:navigator.userAgent,viewport:[innerWidth,innerHeight],devicePixelRatio,
  groups:window.comicLive?.kind?comicLive.LAYOUTS[comicLive.kind].groups.map(g=>({name:g.units.map(p=>p.name).join(','),frac:g.frac,gap:g.gap,startAt:g.startAt,area:g.area})):[],
  canvases:[...document.querySelectorAll('canvas.comic-live')].map(c=>({screen:c.closest('.screen').id,size:[c.width,c.height],cssSize:[c.getBoundingClientRect().width,c.getBoundingClientRect().height],pointer:getComputedStyle(c).pointerEvents,aria:c.getAttribute('aria-hidden'),afterPicture:c.previousElementSibling?.tagName==='PICTURE',beforeOverlays:c.nextElementSibling?.classList.contains('overlays'),alpha:alpha(c)})),
  images:[...document.querySelectorAll('#home-02 img,#home-03 img')].map(i=>({src:i.currentSrc,natural:[i.naturalWidth,i.naturalHeight],complete:i.complete,crossOrigin:i.crossOrigin,rect:{x:i.getBoundingClientRect().x,y:i.getBoundingClientRect().y,w:i.getBoundingClientRect().width,h:i.getBoundingClientRect().height}})),
  layerResources:[...new Set(performance.getEntriesByType('resource').map(r=>r.name).filter(n=>n.includes('/home-comic/')&&/\/assets\/[hv]-/.test(n)))],
  insurance:window.SiteMotionInsurance?.snapshot,stalled:document.body.classList.contains('motion-stalled'),overflow:document.documentElement.scrollWidth>innerWidth+1,probe:window.__comicProbe};
}'''


async def go_unit(page, name):
    """Scroll the real original image's group to its visible center."""
    await page.evaluate(r'''name=>{const L=comicLive.LAYOUTS[comicLive.kind],p=L.units.find(u=>u.name===name),g=p.group,im=document.querySelector(g.scr.id==='A'?'#home-02 img':'#home-03 img'),r=im.getBoundingClientRect(),k=r.width/g.scr.w;
      scrollTo(0,scrollY+r.top+(g.area[1]+g.area[3]/2)*k-innerHeight/2);}''', name)
    await page.wait_for_timeout(100)


async def hit_snapshot(page):
    return await page.evaluate(r'''()=>[...document.querySelectorAll('#home-02 .hotspot,#home-03 .hotspot')].map(a=>{const r=a.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2,top=document.elementFromPoint(x,y),style=getComputedStyle(a);return {href:a.getAttribute('href'),label:a.getAttribute('aria-label'),rect:{x:r.x,y:r.y,w:r.width,h:r.height},display:style.display,visibility:style.visibility,pointer:style.pointerEvents,top:{tag:top?.tagName,class:top?.className,href:top?.closest('a')?.getAttribute('href')},inViewport:r.width>0&&r.height>0&&x>=0&&x<innerWidth&&y>=0&&y<innerHeight,hit:top===a||a.contains(top)};})''')


async def hits(page):
    """Center each original link before testing; fixed navigation can cover the top."""
    original=await hit_snapshot(page);rows=[]
    for index,row in enumerate(original):
        if row['rect']['w']<=0 or row['rect']['h']<=0:continue
        await page.locator('#home-02 .hotspot,#home-03 .hotspot').nth(index).evaluate("a=>a.scrollIntoView({block:'center',inline:'center',behavior:'instant'})")
        await page.wait_for_timeout(80)
        centered=(await hit_snapshot(page))[index];centered['before_centering']=row;rows.append(centered)
    return rows


async def threshold_check(page):
    await page.evaluate('()=>{scrollTo(0,0);comicLive.useVirtualClock();}')
    async def position(delta):
        await page.evaluate(r'''delta=>{const L=comicLive.LAYOUTS[comicLive.kind],p=L.units.find(u=>u.name==='p1'),g=p.group,im=document.querySelector('#home-02 img'),r=im.getBoundingClientRect(),k=r.width/g.scr.w,h=g.area[3]*k,seen=Math.min(h,innerHeight)*(g.frac+delta),desiredTop=innerHeight-seen;scrollTo(0,scrollY+r.top+g.area[1]*k-desiredTop);}''',delta)
        await page.wait_for_timeout(150)
        return await page.evaluate('()=>{comicLive.advance(0);return {state:comicLive.state(),kind:comicLive.kind,group:comicLive.LAYOUTS[comicLive.kind].units.find(p=>p.name===\'p1\').group.frac};}')
    below=await position(-.02);above=await position(.02)
    assert below['state']['p1']=='idle' and above['state']['p1']=='play',(below,above)
    return {'fixture_only':True,'virtual_clock_for_boundary_only':True,'below':below,'above':above,'denominator':'minimum of group height and viewport height'}


async def browser_run(args):
    from playwright.async_api import async_playwright
    args.output.mkdir(parents=True, exist_ok=True); args.cache.mkdir(parents=True, exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = str(args.cache)
    release = args.release.resolve(); baseline = args.baseline.resolve(); package = args.package.resolve()
    prep = json.loads(args.preparation.read_text('utf8')); manifest = json.loads((release/'release-manifest.json').read_text('utf8'))
    current = comic.inventory(release); before = comic.inventory(baseline)
    assert current == manifest['files'] and comic.identity(current, manifest) == manifest['release_id']
    assert [rel for rel in before if before[rel] != current.get(rel)] == ['index.html']
    assert (release/'index.html').read_bytes().replace(prep['rollback']['remove_exact_utf8'].encode(),b'',1)==(baseline/'index.html').read_bytes()
    for rel,entry in prep['original_package_files'].items(): assert comic.stamp(package/rel)==entry
    responsive=[]
    from PIL import Image
    for row in prep['responsive_delivery']:
        path=release/urlsplit(row['url']).path.lstrip('/')
        with Image.open(path) as im:
            im.load(); responsive.append({**row,'decoded_size':list(im.size),'decode_ok':True})
    nonce=secrets.token_hex(16); server_state={'missing':[],'requests':[],'writes':[]}; external=[]; errors=[]; console=[]; profiles=[]; checks=[]

    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*_): pass
        def do_GET(self):
            path=unquote(urlsplit(self.path).path)
            if path=='/__comic_nonce': body,mime,status=nonce.encode(),'text/plain',200
            else:
                rel=path.lstrip('/')+('index.html' if path.endswith('/') else '')
                target=(release/rel).resolve()
                if target.is_relative_to(release) and target.is_file():
                    body=target.read_bytes();mime=mimetypes.guess_type(str(target))[0]or'application/octet-stream';status=200
                    server_state['requests'].append({'path':path,'sha256':hashlib.sha256(body).hexdigest(),'bytes':len(body)})
                else: body,mime,status=b'not found','text/plain',404;server_state['missing'].append(path)
            self.send_response(status);self.send_header('Content-Type',mime);self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
        def do_POST(self):
            server_state['writes'].append(self.path);self.send_error(405)

    server=ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    address=f'http://127.0.0.1:{server.server_port}'
    result={'schema':'wly.home-comic-dom-acceptance.v1','observed_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),'source_rid':prep['baseline_release_id'],'candidate_rid':manifest['release_id'],
            'test_source':comic.stamp(Path(__file__)),'preparation_source':comic.stamp(ROOT/'scripts/prepare-home-comic.py'),
            'served_root':str(release),'index_sha256':comic.stamp(release/'index.html')['sha256'],'port':server.server_port,'nonce':nonce,'responsive_decode':responsive,'checks':checks,'page_errors':errors,'console':console,'external_blocked':external,
            'fixture_only':True,'screenshots_or_images_viewed':False,'published':False,'real_mobile_or_safari':'not available; no claimed verification'}
    try:
        async with async_playwright() as pw:
            modes=[('desktop',1440,900,1,1,'avif'),('phone',412,915,3.5,1,'avif'),('desktop-fallback640',1440,900,1,1,'fallback'),('phone-fallback640',412,915,3.5,1,'fallback'),('desktop-4x',1440,900,1,4,'avif'),('phone-4x',412,915,3.5,4,'avif'),('desktop-20x',1440,900,1,20,'avif'),('phone-20x',412,915,3.5,20,'avif'),('desktop-reduce',1440,900,1,1,'reduce'),('phone-reduce',412,915,3.5,1,'reduce'),('desktop-static',1440,900,1,1,'static'),('phone-static',412,915,3.5,1,'static')]
            if args.cases:
                selected=set(args.cases.split(','));modes=[row for row in modes if row[0]in selected]
                if len(modes)!=len(selected):raise ValueError('Unknown requested browser case')
            for label,width,height,dpr,cpu,mode in modes:
                print('Starting '+label,flush=True)
                profile=args.cache/(label+'-'+secrets.token_hex(4));profiles.append(profile)
                context=await pw.chromium.launch_persistent_context(str(profile),executable_path=str(args.chrome),headless=True,viewport={'width':width,'height':height},device_scale_factor=dpr,is_mobile=width<600,has_touch=width<600,
                     args=['--no-first-run','--no-default-browser-check'])
                await context.add_init_script(PROBE)
                if mode=='reduce': await context.pages[0].emulate_media(reduced_motion='reduce')
                if mode=='static': await context.add_init_script("const mark=new MutationObserver(()=>{if(document.body){document.body.classList.add('motion-stalled');mark.disconnect();}});mark.observe(document,{childList:true,subtree:true});")
                async def route(rr):
                    req=rr.request; url=urlsplit(req.url)
                    if req.method not in ('GET','HEAD','OPTIONS'): server_state['writes'].append(req.url);return await rr.abort()
                    if url.scheme!='http' or url.hostname!='127.0.0.1' or url.port!=server.server_port:
                        external.append({'url':req.url,'method':req.method})
                        if 'status' in url.path or 'state' in url.path:
                            return await rr.fulfill(status=503,content_type='application/json',body='{"state":"unavailable","fixture_only":true}')
                        return await rr.abort()
                    if mode=='fallback' and url.path=='/':
                        text=(release/'index.html').read_text('utf8')
                        for sid in ('home-02','home-03'):
                            pattern=r'(<section\b[^>]*id="'+sid+r'"[^>]*>)(.*?)(</section>)'
                            text=re.sub(pattern,lambda m:m[1]+re.sub(r'<source\b[^>]*type="image/avif"[^>]*>','',m[2])+m[3],text,flags=re.S)
                        return await rr.fulfill(status=200,content_type='text/html',body=text)
                    await rr.continue_()
                await context.route('**/*',route)
                page=context.pages[0];page.on('pageerror',lambda e:errors.append({'case':label,'error':str(e)}));page.on('console',lambda m:console.append({'case':label,'type':m.type,'text':m.text})if'[SiteMotionInsurance]'in m.text else None)
                try:
                    session=await context.new_cdp_session(page);await session.send('Emulation.setCPUThrottlingRate',{'rate':1 if cpu==20 else cpu})
                    await page.goto(address+'/',wait_until='load');assert await (await page.request.get(address+'/__comic_nonce')).text()==nonce
                    if mode in ('reduce','static'):
                        await page.wait_for_timeout(400); sample=await page.evaluate(SNAP)
                        assert not sample['canvases'] and sample['probe']['canvasCreates']==0,sample
                        checks.append({'case':label,'pass':True,'sample':sample});print('Passed '+label,flush=True);continue
                    await page.evaluate("()=>{for(const s of document.querySelectorAll('#home-02 source,#home-03 source'))if(s.dataset.srcset)s.srcset=s.dataset.srcset;for(const i of document.querySelectorAll('#home-02 img,#home-03 img')){if(i.dataset.src)i.src=i.dataset.src;if(i.dataset.srcset)i.srcset=i.dataset.srcset;}}")
                    await page.wait_for_function('window.comicLive?.ready()',timeout=45000)
                    if cpu==20:await session.send('Emulation.setCPUThrottlingRate',{'rate':cpu})
                    await page.wait_for_timeout(200)
                    initial=await page.evaluate(SNAP)
                    result['last_sample']=initial
                    assert initial['speed']==2.5 and len(initial['canvases'])==2 and all(c['pointer']=='none' and c['aria']=='true' and c['afterPicture'] for c in initial['canvases']),initial['canvases']
                    assert all(i['crossOrigin'] is None and i['complete'] for i in initial['images'])
                    assert len(initial['layerResources'])==(51 if initial['kind']=='v' else 31) and all('/assets/'+initial['kind']+'-'in path for path in initial['layerResources'])
                    if width<600:
                        for name in ('title','p1','p2','p3','p4','p5','p6'):
                            await go_unit(page,name); await page.wait_for_timeout(3400)
                    else:
                        await go_unit(page,'p1');await page.wait_for_timeout(3500);await go_unit(page,'p4');await page.wait_for_timeout(3500)
                    end=await page.evaluate(SNAP);hit_rows=await hits(page)
                    assert all(v=='done' for v in end['state'].values()),end['state']
                    assert all(c['alpha']['nonzero']==0 for c in end['canvases']),end['canvases']
                    assert all(row['hit'] for row in hit_rows if row['inViewport']),hit_rows
                    assert not end['overflow']
                    if cpu<=4: assert not end['stalled'] and not end['insurance']['stalled'],end['insurance']
                    if mode=='fallback': assert all('-fallback640-' in i['src'] for i in end['images']) and len(end['probe']['scales'])>=2
                    if label=='desktop': assert all('-1920-' in i['src'] for i in end['images']) and len(end['probe']['scales'])>=2
                    checks.append({'case':label,'cpu_throttling':cpu,'cpu_applied_after_ready':cpu==20,'pass':True,'initial':initial,'end':end,'hotspots':hit_rows,'extreme_cpu_note':'Natural visible-animation 20x run applied after page and media readiness; no fallback trigger is not a fluidity claim.'if cpu==20 else None})
                    print('Passed '+label,flush=True)
                    if label in ('desktop','phone'):
                        await page.reload(wait_until='load');await page.evaluate("()=>{for(const s of document.querySelectorAll('#home-02 source,#home-03 source'))if(s.dataset.srcset)s.srcset=s.dataset.srcset;for(const i of document.querySelectorAll('#home-02 img,#home-03 img')){if(i.dataset.src)i.src=i.dataset.src;if(i.dataset.srcset)i.srcset=i.dataset.srcset;}}")
                        await page.wait_for_function('window.comicLive?.ready()',timeout=30000)
                        await go_unit(page,'p1');await page.wait_for_timeout(220);mid=await page.evaluate(SNAP)
                        done_before={n for n,s in mid['state'].items()if s!='idle'}
                        await page.set_viewport_size({'width':height,'height':width});await page.wait_for_timeout(100)
                        immediately=await page.evaluate(SNAP);await page.wait_for_function('window.comicLive?.ready()',timeout=15000)
                        switched=await page.evaluate(SNAP)
                        assert all(switched['state'][n]=='done' for n in done_before)
                        for name in ('title','p1','p2','p3','p4','p5','p6'):
                            await go_unit(page,name);await page.wait_for_timeout(3200)
                        await page.set_viewport_size({'width':width,'height':height});await page.wait_for_function('window.comicLive?.ready()',timeout=15000);await page.wait_for_timeout(200)
                        back=await page.evaluate(SNAP)
                        assert all(v=='done'for v in back['state'].values()) and all(c['alpha']['nonzero']==0 for c in back['canvases'])
                        checks.append({'case':label+'-orientation-midplay-back','pass':True,'mid':mid,'immediate_switch':immediately,'switched':switched,'back':back,'already_played':sorted(done_before)})
                        print('Passed '+label+'-orientation-midplay-back',flush=True)
                        checks.append({'case':label+'-threshold-boundary','pass':True,'sample':await threshold_check(page)})
                        print('Passed '+label+'-threshold-boundary',flush=True)
                        await page.evaluate("()=>{document.body.classList.add('motion-stalled');document.dispatchEvent(new Event('site-motion'));}")
                        latched=await page.evaluate(SNAP)
                        assert not latched['ready'] and all(c['alpha']['nonzero']==0 for c in latched['canvases'])
                        checks.append({'case':label+'-existing-static-latch-clears-inflight','pass':True,'fixture_only':True,'synthetic_static_flag_and_event':True,'not_a_natural_fps_result':True,'sample':latched})
                finally:
                    try:result['case_exit_sample']={'case':label,'sample':await page.evaluate(SNAP)}
                    except Exception as exc:result['case_exit_sample']={'case':label,'unavailable':repr(exc)}
                    await context.close()
        assert not errors,errors;assert not server_state['writes'],server_state['writes'];assert not server_state['missing'],server_state['missing']
        result['status']='pass'
    except Exception as exc:
        result['status']='failed';result['failure']=repr(exc)
        raise
    finally:
        server.shutdown();server.server_close();thread.join(5)
        result['owned_server_stopped']=not thread.is_alive();result['server']=server_state;result['profiles']=list(map(str,profiles))
        result['profile_cleanup']=[]
        for profile in profiles:
            command=['pwsh','-NoProfile','-File',r'E:\.agents\tools\Move-TaskItemToRecycleBin.ps1','-LiteralPath',str(profile),'-AllowedRoot',str(args.cache),'-Json']
            receipt=subprocess.run(command,capture_output=True,text=True,encoding='utf8')
            result['profile_cleanup'].append({'path':str(profile),'exit_code':receipt.returncode,'receipt':receipt.stdout.strip(),'stderr':receipt.stderr.strip()})
        (args.output/'dom-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    return result


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    for name in ('release','baseline','package','preparation','output','cache','chrome'): ap.add_argument('--'+name,type=Path,required=True)
    ap.add_argument('--cases',help='Optional comma-separated selection for focused reruns')
    result=asyncio.run(browser_run(ap.parse_args()))
    print(json.dumps({'status':result['status'],'checks':len(result['checks']),'candidate_rid':result['candidate_rid'],'page_errors':len(result['page_errors']),'owned_server_stopped':result['owned_server_stopped']},ensure_ascii=False))


if __name__=='__main__':
    import sys
    if '--release' in sys.argv: main()
    else: unittest.main()

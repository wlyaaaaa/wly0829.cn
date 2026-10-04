"""Installed Chrome native-navigation evidence; no screenshots or external writes.

One strict task-owned static server serves one complete candidate. Public origin,
status, graph, and OSS resources are local fixtures intercepted before delivery.
"""
from __future__ import annotations
import argparse
import asyncio
from datetime import datetime, timedelta, timezone
import hashlib
import importlib.util
import json
import mimetypes
import os
from pathlib import Path
import re
import subprocess
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
AUDIT = """(() => {
 addEventListener('site-album-state',e=>{try{const a=JSON.parse(sessionStorage.getItem('album-test-events')||'[]');a.push({url:location.pathname,...e.detail});if(a.length>500)a.splice(0,a.length-500);sessionStorage.setItem('album-test-events',JSON.stringify(a));}catch{}});
 addEventListener('pageshow',e=>{try{const a=JSON.parse(sessionStorage.getItem('album-test-history')||'[]');a.push({url:location.pathname,persisted:e.persisted,at:Date.now()});sessionStorage.setItem('album-test-history',JSON.stringify(a));}catch{}});
})();"""
SNAP = """()=>({url:location.href,scroll:{x:scrollX,y:scrollY},history:history.length,
 album:window.SiteAlbum?.snapshot,insurance:window.SiteMotionInsurance?.snapshot,
 layers:document.querySelectorAll('[data-album-temporary]').length,
 names:[...document.querySelectorAll('[style]')].filter(e=>e.style.viewTransitionName&&e.style.viewTransitionName!=='none').map(e=>e.style.viewTransitionName),
 animations:document.getAnimations().filter(a=>a.effect?.pseudoElement?.startsWith('::view-transition')).map(a=>({pseudo:a.effect.pseudoElement,rate:a.playbackRate,timing:a.effect.getTiming(),state:a.playState})),
 audit:JSON.parse(sessionStorage.getItem('album-test-events')||'[]'),historyAudit:JSON.parse(sessionStorage.getItem('album-test-history')||'[]'),
 overflow:document.documentElement.scrollWidth>innerWidth+1,
 runtimeTags:[...document.scripts].filter(s=>s.src&&!s.src.includes('/_album/')).map(s=>({src:s.src,type:s.type})),
 runtimePlaceholders:document.querySelectorAll('script[data-album-runtime]').length,
 videos:[...document.querySelectorAll('video.hero-video,.hero-video video')].map(v=>({src:v.currentSrc,paused:v.paused,readyState:v.readyState,hidden:getComputedStyle(v).visibility==='hidden'})),
 speculation:[...document.querySelectorAll('script[type=speculationrules]')].map(e=>JSON.parse(e.textContent)),
 links:[...document.querySelectorAll('main a[href]')].map(a=>({href:a.getAttribute('href'),class:a.className,visible:!!a.getClientRects().length})),
 imageCount:[...document.querySelectorAll('main picture img')].filter(e=>e.getClientRects().length).length})"""


def fixture():
    spec = importlib.util.spec_from_file_location('album_live_fixture', ROOT/'tests/live-runtime-browser.py')
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module.fixture('normal')


def assert_clean(snapshot):
    assert snapshot['layers'] == 0 and not snapshot['names'] and not snapshot['album']['running'], snapshot
    assert snapshot['runtimePlaceholders'] == 0, snapshot['runtimePlaceholders']
    assert snapshot['album'].get('runtimeStartCount',sum(e['type']=='runtime-start' for e in snapshot['album']['events'])) == 1, snapshot['album']['events']
    assert not (snapshot.get('insurance') or {}).get('stalled'), snapshot.get('insurance')


async def main(args):
    root = args.release_root.resolve(); args.output_dir.mkdir(parents=True,exist_ok=True)
    asset_root = args.asset_root.resolve() if args.asset_root else None
    args.temp_dir.mkdir(parents=True,exist_ok=True); os.environ['TEMP']=os.environ['TMP']=str(args.temp_dir.resolve())
    release = json.loads((root/'release-manifest.json').read_text('utf8'))
    files = {**release['files'], **(release.get('oss',{}).get('objects',{}) if asset_root else {})}
    state = {'missing': [], 'external_blocked': [], 'blocked_non_get': [], 'resources': [], 'documents': [], 'slow': None}
    results, page_errors, console_errors, profiles = [], [], [], []
    completed = False
    payload = json.dumps(fixture(),ensure_ascii=False).encode()
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*_):
            pass
        def do_GET(self):
            path = unquote(urlsplit(self.path).path)
            if state['slow'] == path:
                time.sleep(1.1)
            target = (root / path.lstrip('/')).resolve()
            if asset_root and target.is_relative_to(root) and not target.exists():
                candidate=(asset_root/path.lstrip('/')).resolve()
                if candidate.is_relative_to(asset_root) and candidate.is_file():
                    target=candidate
            if path == '/__status':
                status,body,mime = 200,payload,'application/json'
            elif not (target.is_relative_to(root) or asset_root and target.is_relative_to(asset_root)):
                status,body,mime = 403,b'outside strict root','text/plain'
            else:
                if target.is_dir(): target = target/'index.html'
                if target.is_file():
                    status,body,mime = 200,target.read_bytes(),mimetypes.guess_type(target)[0] or 'application/octet-stream'
                    if target.suffix=='.html':
                        state['documents'].append({'path':path,'at':time.time(),'purpose':self.headers.get('Sec-Purpose') or self.headers.get('Purpose'),'fetch_dest':self.headers.get('Sec-Fetch-Dest')})
                else:
                    status,body,mime = 404,b'missing','text/plain'; state['missing'].append(path)
            self.send_response(status); self.send_header('Content-Type',mime + ('; charset=utf-8' if mime.startswith('text/') else ''))
            self.send_header('Content-Length',str(len(body))); self.send_header('Access-Control-Allow-Origin','https://wly0829.cn')
            self.send_header('Cache-Control','max-age=3600' if status==200 else 'no-store');self.end_headers()
            try: self.wfile.write(body)
            except (BrokenPipeError,ConnectionResetError,ConnectionAbortedError): pass
    class Server(ThreadingHTTPServer):
        request_queue_size = 256
        daemon_threads = True
    server = Server(('127.0.0.1',0),Handler);worker=threading.Thread(target=server.serve_forever,daemon=True);worker.start()
    base='http://127.0.0.1:'+str(server.server_port)
    devices = [('desktop',{'viewport':{'width':1440,'height':1000}}),('phone',{'viewport':{'width':412,'height':915},'device_scale_factor':3.5,'is_mobile':True,'has_touch':True})]
    if args.desktop_only: devices=devices[:1]
    try:
        async with async_playwright() as pw:
            for device,options in devices:
                profile=args.temp_dir/(device+'-'+str(time.time_ns()));profiles.append(profile)
                context=await pw.chromium.launch_persistent_context(str(profile),executable_path=str(args.chrome),headless=True,timezone_id='Asia/Shanghai',ignore_default_args=['--disable-back-forward-cache'],**options)
                context_errors=[]
                async def intercept(route):
                    req=route.request;url=urlsplit(req.url)
                    if req.method!='GET':
                        state['blocked_non_get'].append({'method':req.method,'url':req.url});return await route.abort()
                    if url.hostname=='mcp.wly0829.cn' and '/status' in url.path:
                        return await route.fulfill(status=200,body=payload,headers={'content-type':'application/json','access-control-allow-origin':'https://wly0829.cn'})
                    if url.hostname=='local-graph.invalid':
                        return await route.fulfill(status=200,body='<!doctype html><title>local graph fixture</title>',content_type='text/html')
                    path=unquote(url.path)
                    if url.hostname=='wly0829.cn' or url.hostname=='127.0.0.1' and url.port==server.server_port:
                        localpath=path
                    else:
                        parts=path.lstrip('/').split('/')
                        mapped=next(('/'+'/'.join(parts[i:]) for i in range(len(parts)) if '/'.join(parts[i:]) in files),None)
                        if not mapped:
                            state['external_blocked'].append(req.url);return await route.abort()
                        localpath=mapped
                    state['resources'].append({'url':req.url,'local':localpath,'type':req.resource_type,'mode':req.headers.get('sec-fetch-mode'),'origin':req.headers.get('origin')})
                    response=await context.request.get(base+localpath,timeout=20000)
                    return await route.fulfill(response=response,headers={**response.headers,'access-control-allow-origin':req.headers.get('origin','*')})
                await context.route('**/*',intercept);await context.add_init_script(AUDIT)
                page=context.pages[0];page.on('pageerror',lambda e: context_errors.append(str(e)))
                page.on('console',lambda m: console_errors.append({'device':device,'text':m.text}) if m.type=='error' else None)
                cdp=await context.new_cdp_session(page)
                async def settled():
                    try:
                        await page.wait_for_function('window.SiteAlbum?.snapshot.runtimeLoaded && !window.SiteAlbum.snapshot.running',timeout=20000)
                    except Exception:
                        results.append({'device':device,'case':'settle-failure','snapshot':await page.evaluate(SNAP),'errors':context_errors})
                        raise
                    await page.wait_for_timeout(120)
                    snapshot=await page.evaluate(SNAP);assert_clean(snapshot);return snapshot
                async def load(path):
                    await page.goto(base+path,wait_until='domcontentloaded');return await settled()
                async def history_nav(direction,expected):
                    await page.evaluate('history.'+direction+'()')
                    await page.wait_for_url(base+expected,wait_until='commit',timeout=15000)
                    await page.wait_for_timeout(40)
                    during=await page.evaluate(SNAP)
                    if not all(a['rate']==1 for a in during['animations']):
                        results.append({'device':device,'case':'clock-rate-failure-'+direction,'during':during})
                    assert all(a['rate']==1 for a in during['animations']),during['animations']
                    results.append({'device':device,'case':'cache-reveal-during-'+direction,'during':during})
                    return await settled()
                async def navigate(locator,expected,case,keyboard=False):
                    await locator.first.wait_for(state='visible',timeout=15000)
                    await locator.first.scroll_into_view_if_needed();await page.wait_for_timeout(80)
                    before=await page.evaluate(SNAP)
                    if keyboard:
                        await locator.first.focus();await locator.first.press('Enter')
                    else: await locator.first.click()
                    await page.wait_for_url(base+expected,wait_until='domcontentloaded',timeout=15000)
                    during=await page.evaluate(SNAP)
                    after=await settled()
                    relevant=[e for e in after['audit'] if e['epoch']>before['album']['events'][-1]['epoch'] and e['url']==urlsplit(after['url']).path]
                    selected=[p.get('orientation') for e in relevant if e['type']=='decorate' for p in e.get('participants',[]) if p.get('orientation')]
                    assert all(o==('v' if options['viewport']['width']<768 else 'h') for o in selected), (device,case,selected)
                    finish=next((e for e in relevant if e['type']=='finished'),None)
                    click=next((e for e in after['audit'][::-1] if e['type']=='native-click'),None)
                    results.append({'device':device,'case':case,'before':before,'during':during,'after':after,'transition':relevant,'elapsed_ms':finish['epoch']-click['epoch'] if finish and click else None})
                    return after
                startup_mark=len(state['documents'])
                initial=await load('/')
                startup_docs=state['documents'][startup_mark:]
                next_docs=[row for row in startup_docs if row['path'] not in ['/', '/index.html']]
                assert not next_docs, ('Startup requested a next document without pointer intent',next_docs)
                results.append({'device':device,'case':'first-load','after':initial,'chrome':context.browser.version,'startup_documents':startup_docs,'startup_next_document_count':len(next_docs)})
                assert not initial['speculation'], 'No all-page prerender/prefetch'
                home_intent=page.locator('#home-05 a[href="/projects/"]').first
                await home_intent.scroll_into_view_if_needed()
                await home_intent.dispatch_event('pointerover', {'pointerType':'mouse'})
                await page.wait_for_function('window.SiteAlbum.snapshot.warmedRoutes.includes("/projects/")')
                await page.wait_for_function('window.SiteAlbum.snapshot.images.some(i=>i.decoded)',timeout=15000)
                intent=await page.evaluate(SNAP)
                assert any(i['decoded'] for i in intent['album']['images']), 'Opening artwork is decoded before navigation'
                assert intent['speculation'] and all(not r.get('prerender') for r in intent['speculation'])
                assert all(all(urlsplit(u).path=='/projects/' for u in p['urls']) for r in intent['speculation'] for p in r.get('prefetch',[]))
                results.append({'device':device,'case':'intent-only-document-prefetch','after':intent})
                await navigate(page.locator('#home-05 a[href="/projects/"]'),'/projects/','original-home-card-to-directory')
                await navigate(page.locator('main a[href="/projects/localocr/"]:visible'),'/projects/localocr/','directory-to-project')
                # Project modules are the site's genuine module links.
                await load('/projects/agents/authorization-owner/')
                module=page.locator('a[href="/projects/agents/capability-routing/"]:visible')
                await page.mouse.move(0,0)
                focus_mark=len(state['documents'])
                await module.first.focus();await page.wait_for_timeout(200)
                focused_docs=[r for r in state['documents'][focus_mark:] if r['path']=='/projects/agents/capability-routing/']
                assert not focused_docs, ('Focus alone issued a document prefetch',focused_docs)
                results.append({'device':device,'case':'legacy-focus-alone-does-not-prefetch','target_document_requests':len(focused_docs)})
                await navigate(module,'/projects/agents/capability-routing/','real-project-module-entry',keyboard=True)
                await load('/skills/')
                await navigate(page.locator('a[href="/skills/localocr/"]:visible'),'/skills/localocr/','skills-directory-to-detail',keyboard=True)
                await navigate(page.locator('a[href="/projects/localocr/"]:visible'),'/projects/localocr/','same-subject-skill-to-project')
                await navigate(page.locator('a[href="/rules/"]:visible'),'/rules/','project-to-rules')
                await load('/')
                await navigate(page.locator('main a[href="/cockpit/"]'),'/cockpit/','home-to-cockpit')
                # Native same-document anchor; no cross-document overlay begins.
                await load('/projects/localocr/')
                prior=await page.evaluate(SNAP)
                anchor=page.locator('a[href="#usage"]:visible')
                if await anchor.count()==0:
                    anchor=page.locator('main a[href^="#"]:visible').first
                if await anchor.count():
                    await anchor.first.click();anchor_case='same-page-anchor'
                else:
                    # This baseline's phone viewport hides the desktop TOC.
                    # Exercise a genuine address-bar fragment in the same document.
                    await page.evaluate('location.hash="usage"');anchor_case='same-page-anchor-addressbar'
                await page.wait_for_timeout(180)
                anchored=await page.evaluate(SNAP)
                assert urlsplit(anchored['url']).fragment and anchored['album']['generation']==prior['album']['generation']
                results.append({'device':device,'case':anchor_case,'before':prior,'after':anchored})
                await load('/skills/localocr/')
                await page.locator('main a[href="/projects/localocr/"]:visible').first.evaluate('(a)=>a.setAttribute("href","/projects/localocr/#usage")')
                deep=await navigate(page.locator('main a[href="/projects/localocr/#usage"]'),'/projects/localocr/#usage','cross-document-deep-anchor-native')
                assert not any(e['type']=='ready' for e in deep['album']['events'])
                external=page.locator('main a[href^="https://github.com/"]:visible')
                original=await external.first.evaluate('(a)=>({href:a.href,target:a.target,download:a.download})')
                assert original['href'].startswith('https://github.com/')
                external_before=await page.evaluate(SNAP)
                activation={'tested':'href and native target preservation'}
                if original['target']=='_blank':
                    async with page.expect_popup() as popup_info:
                        await external.first.click()
                    popup=await popup_info.value;await page.wait_for_timeout(100)
                    activation={'tested':'native popup, external GET intercepted','popup_url':popup.url,'blocked':state['external_blocked'][-1:]}
                    await popup.close()
                external_after=await page.evaluate(SNAP)
                assert external_after['album']['generation']==external_before['album']['generation']
                results.append({'device':device,'case':'external-link-semantics','link':original,'activation':activation})
                # History preserves genuine reading position and native forward.
                await load('/')
                home=page.locator('#home-05 a[href="/projects/"]');await home.first.scroll_into_view_if_needed();await page.wait_for_timeout(100)
                y=await page.evaluate('scrollY')
                await navigate(home,'/projects/','history-start')
                back=await history_nav('back','/')
                assert abs(back['scroll']['y']-y)<3, (device,y,back['scroll'])
                forward=await history_nav('forward','/projects/')
                assert urlsplit(forward['url']).path=='/projects/'
                results.append({'device':device,'case':'history-back-forward','saved_y':y,'back':back,'forward':forward})
                for count in range(3):
                    await history_nav('back','/')
                    snap=await history_nav('forward','/projects/')
                results.append({'device':device,'case':'rapid-history-cleanup','after':snap})
                # Orientation changes retain native history and clean temporary
                # layers without replaying a completed page turn.
                before_rotate=await page.evaluate(SNAP)
                rotated={'width':915,'height':412} if device=='phone' else {'width':1000,'height':1440}
                await page.set_viewport_size(rotated)
                await page.wait_for_timeout(350)
                landscape=await page.evaluate(SNAP);assert_clean(landscape)
                assert landscape['album']['generation']==before_rotate['album']['generation']
                await page.set_viewport_size(options['viewport'])
                await page.wait_for_timeout(350)
                portrait=await page.evaluate(SNAP);assert_clean(portrait)
                assert portrait['album']['generation']==before_rotate['album']['generation']
                results.append({'device':device,'case':'orientation-does-not-replay-or-leave-layers','before':before_rotate,'landscape':landscape,'after':portrait})
                # Throttle actual browser CPU; no synthetic busy-loop insurance.
                await cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
                await load('/skills/')
                await navigate(page.locator('a[href="/skills/localocr/"]'),'/skills/localocr/','cpu4-normal')
                await page.wait_for_timeout(8000);cpu=await page.evaluate(SNAP);assert_clean(cpu)
                results.append({'device':device,'case':'cpu4-insurance-zero','after':cpu})
                await cdp.send('Emulation.setCPUThrottlingRate',{'rate':1})
                await page.emulate_media(reduced_motion='reduce')
                await load('/skills/')
                reduced=await navigate(page.locator('a[href="/skills/localocr/"]'),'/skills/localocr/','system-reduced-motion')
                assert not any(e['type']=='ready' for e in reduced['album']['events'])
                await page.emulate_media(reduced_motion='no-preference')
                await load('/skills/');state['slow']='/skills/localocr/'
                await page.locator('a[href="/skills/localocr/"]').first.evaluate('(a)=>a.setAttribute("href","/skills/localocr/?album-slow=1")')
                slow=await navigate(page.locator('a[href="/skills/localocr/?album-slow=1"]'),'/skills/localocr/?album-slow=1','slow-document-budget-skip')
                assert any(e['type']=='skip' and e['reason']=='navigation-budget' for e in slow['album']['events']),slow['album']['events']
                state['slow']=None
                # Capability fallback simulation in this Chrome only, explicitly labelled.
                await context.route('**/_album/*.css',lambda route: route.fulfill(status=200,body=':root{--album-duration:655ms}',content_type='text/css'))
                await load('/skills/')
                fallback=await navigate(page.locator('a[href="/skills/localocr/"]'),'/skills/localocr/','no-view-transition-rule-simulation')
                assert not any(e['type']=='ready' for e in fallback['album']['events'])
                page_errors += [{'device':device,'error':e} for e in context_errors]
                await context.close()
            completed = True
    finally:
        server.shutdown();server.server_close();worker.join(timeout=5)
        for profile in profiles:
            if profile.exists():
                subprocess.run(['pwsh','-NoProfile','-File','E:/.agents/tools/Move-TaskItemToRecycleBin.ps1','-LiteralPath',str(profile.resolve()),'-AllowedRoot',str(args.temp_dir.resolve()),'-Json'],check=True,
                               creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
        report={'schema':'wly.album-browser-evidence.v1','observed_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),
                'release_id':release['release_id'],'complete_candidate':str(root),'strict_served_root':str(root),'assets_served_root':str(asset_root) if asset_root else None,'port':server.server_port,
                'results':results,'page_errors':page_errors,'console_errors':console_errors,'requests':state,'server_closed':not worker.is_alive(),
                'boundaries':['Installed Chrome headless DOM and timing only; no image/screenshot/video inspection','412x915 DPR3.5 phone viewport, no physical phone','No real Safari, Edge, Firefox or unsupported browser','Status and graph are local fixtures; no real status or POST','When asset-root is supplied, mapped OSS URLs are served from exact prepared local objects with browser CORS enforcement; no live OSS GET'],
                'status':'pass' if completed and len(results)>=17*len(devices) and not state['missing'] and not page_errors and not console_errors else 'incomplete'}
        (args.output_dir/'browser-evidence.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n','utf8')
        print(json.dumps({'status':report['status'],'results':len(results),'page_errors':len(page_errors),'missing':len(state['missing']),'output':str(args.output_dir/'browser-evidence.json')},ensure_ascii=False))
    assert not state['missing'] and not page_errors,(state['missing'],page_errors)


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release-root',type=Path,required=True)
    parser.add_argument('--asset-root',type=Path,help='Prepared local OSS objects for the mapped HTML browser rehearsal; never downloads assets')
    parser.add_argument('--output-dir',type=Path,required=True)
    parser.add_argument('--temp-dir',type=Path,required=True)
    parser.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    parser.add_argument('--desktop-only',action='store_true')
    asyncio.run(main(parser.parse_args()))

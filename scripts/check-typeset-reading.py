"""Measure reading position across resizes in installed headless Chrome.

Loopback preview only; no screenshots, pixel inspection or publication. A patched
runtime preview derives each app from the legacy source recorded by the build.
"""
import argparse
import asyncio
from datetime import datetime, timedelta, timezone
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import threading
import uuid
from urllib.parse import urljoin, urlsplit
from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent
POSITION = """() => {
 const offset=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0;
 const screens=[...document.querySelectorAll('.screen')];
 function top(el){let y=0;for(let node=el;node;node=node.offsetParent)y+=node.offsetTop;return y;}
 const el=screens.find(s=>s.offsetHeight&&top(s)+s.offsetHeight>scrollY+offset);
 return {id:el?.dataset.screen,fraction:el?(scrollY+offset-top(el))/el.offsetHeight:null,
         height:el?.offsetHeight,y:scrollY,offset,width:innerWidth,viewportHeight:innerHeight};
}"""
PLACE = """({id,fraction})=>{
 const el=[...document.querySelectorAll('.screen')].find(s=>s.dataset.screen===id);
 let y=0;for(let node=el;node;node=node.offsetParent)y+=node.offsetTop;
 const offset=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0;
 scrollTo({top:y+el.offsetHeight*fraction-offset,behavior:'instant'});
}"""


async def reading_position(browser_page):
    expected=browser_page.viewport_size
    predicate="""expected => {
      if(innerWidth!==expected.width||innerHeight!==expected.height||resizing||typesetReadingState.width!==expected.width||typesetReadingState.height!==expected.height)return false;
      const current=(POSITION_VALUE)(),tracked=readingPosition;
      return current.id===tracked?.id && (!current.id||Math.abs(current.fraction-tracked.fraction)<1e-8);
    }""".replace('POSITION_VALUE',POSITION)
    await browser_page.wait_for_function(predicate,arg=expected,polling='raf',timeout=10000)
    return await browser_page.evaluate(POSITION)


async def run(args, base, build):
    profile=args.cache.resolve()/('chrome-profile-'+uuid.uuid4().hex)
    profile.mkdir(parents=True)
    manifest=args.root/'release-manifest.json'
    manifest_data=json.loads(manifest.read_text('utf8'))
    remote_objects={entry['url']:entry for entry in manifest_data.get('oss',{}).get('objects',{}).values()}
    responses=[]
    response_tasks=[]
    async def capture_response(response):
        if response.request.resource_type not in {'document','script'}:return
        row={'url':response.url,'status':response.status}
        try:row['sha256']=hashlib.sha256(await response.body()).hexdigest()
        except Exception as error:row['body_error']=str(error)
        responses.append(row)
    result={'schema':'wly.typeset-reading-check.v1',
            'evidence_mode':'patched-runtime-preview' if args.patched_runtime else 'artifact',
            'root':str(args.root.resolve()),'release_id':json.loads(manifest.read_text('utf8'))['release_id'],
            'manifest_sha256':hashlib.sha256(manifest.read_bytes()).hexdigest(),
            'build_report_sha256':hashlib.sha256(args.build_report.read_bytes()).hexdigest(),
            'chrome':str(args.chrome),'profile':str(profile),'server_pid':os.getpid(),
            'pages':{},'cases':[], 'navigation':[], 'errors':[], 'failed_requests':[], 'static_transfers':[]}
    async with async_playwright() as pw:
        context=None
        try:
            context=await pw.chromium.launch_persistent_context(str(profile),headless=True,
                        executable_path=str(args.chrome),viewport={'width':390,'height':844},
                        device_scale_factor=1,args=['--hide-scrollbars'])
            if args.static_retry_once:
                async def static_transfer(route):
                    request=route.request;obj=remote_objects.get(request.url)
                    if not obj or request.method!='GET' or 'range' in request.headers:
                        return await route.continue_()
                    transfer={'url':request.url,'attempts':[],'method':'Actual HTTPS route.fetch body; no local static fixtures'}
                    result['static_transfers'].append(transfer)
                    response=None
                    for attempt in range(2):
                        observation={'number':attempt+1}
                        transfer['attempts'].append(observation)
                        try:
                            headers={**request.headers,'Origin':urlsplit(base).scheme+'://'+urlsplit(base).netloc,'Accept-Encoding':'identity'}
                            response=await route.fetch(headers=headers,timeout=30000,max_retries=0)
                            observation['http']=response.status
                            if response.status>=500 and attempt==0:continue
                            body=await response.body()
                            observation.update(bytes=len(body),sha256=hashlib.sha256(body).hexdigest())
                            break
                        except Exception as error:
                            observation['transport_error']=str(error)
                            if attempt:raise
                    if response.status!=200 or len(body)!=obj['bytes'] or hashlib.sha256(body).hexdigest()!=obj['sha256']:
                        raise ValueError('Actual static response differs from sealed object: '+request.url)
                    transfer['status']='pass'
                    headers={key:value for key,value in response.headers.items() if key.lower() not in {'content-encoding','transfer-encoding','content-length'}}
                    headers['content-length']=str(len(body))
                    await route.fulfill(status=response.status,headers=headers,body=body)
                await context.route(manifest_data['oss']['asset_base_url']+'/**',static_transfer)
                result['transport_method']='Bounded actual HTTPS route.fetch for public static objects; maximum one retry; browser CORS and execution use actual returned bytes/headers. Native cold sockets remain recorded separately.'
            browser_page=context.pages[0]
            browser_page.on('response',lambda response:response_tasks.append(asyncio.create_task(capture_response(response))))
            browser_page.on('requestfailed',lambda request:result['failed_requests'].append({'url':request.url,'resource_type':request.resource_type,'error':request.failure}))
            browser_page.on('pageerror',lambda error:result['errors'].append(str(error)))
            names=args.pages or list(build['pages'])
            for name in names:
                url=build['pages'][name]['url']
                html=args.root/(url.lstrip('/')+'index.html' if url.endswith('/') else url.lstrip('/'))
                html_body=html.read_bytes();scripts=[]
                for src in re.findall(r'<script\b[^>]*\bsrc=["\']([^"\'<>]+)["\']',html_body.decode('utf8')):
                    parsed=urlsplit(urljoin(url,src));path=parsed.path
                    artifact=args.root/path.lstrip('/')
                    remote=remote_objects.get(urljoin(url,src))
                    scripts.append({'src':src,'url':path,'sha256':hashlib.sha256(artifact.read_bytes()).hexdigest()
                                    if not parsed.netloc and artifact.is_file() else remote.get('sha256') if remote else None,
                                    'response_url':urljoin(base+url,src)})
                result['pages'][name]={'url':url,'html_sha256':hashlib.sha256(html_body).hexdigest(),'scripts':scripts}
                await browser_page.set_viewport_size({'width':390,'height':844})
                await browser_page.goto(base+url,wait_until='domcontentloaded',timeout=90000)
                await browser_page.emulate_media(reduced_motion='reduce')
                await browser_page.evaluate('document.fonts.ready')
                await browser_page.wait_for_timeout(100)
                ids=await browser_page.locator('.screen').evaluate_all('(nodes)=>nodes.map(s=>s.dataset.screen)')
                chosen=list(dict.fromkeys([ids[0],ids[len(ids)//2],ids[-1]]))
                transitions=[] if args.navigation_only else [((390,844),(844,390)),((844,390),(390,844)),
                                  ((740,args.desktop_height),(1024,args.desktop_height)),((1024,args.desktop_height),(740,args.desktop_height))]
                for start,end in transitions:
                    await browser_page.set_viewport_size({'width':start[0],'height':start[1]})
                    await browser_page.wait_for_timeout(50)
                    await reading_position(browser_page)
                    for screen in chosen:
                        for fraction in [.15,.5,.85]:
                            await browser_page.evaluate(PLACE,{'id':screen,'fraction':fraction})
                            await browser_page.wait_for_timeout(50)
                            before=await reading_position(browser_page)
                            await browser_page.set_viewport_size({'width':end[0],'height':end[1]})
                            await browser_page.wait_for_timeout(80)
                            await reading_position(browser_page)
                            after=await reading_position(browser_page)
                            delta=abs(after['fraction']-before['fraction'])*after['height'] if after['id']==before['id'] else None
                            result['cases'].append({'page':name,'requested_screen':screen,'requested_fraction':fraction,
                                'from':start,'to':end,'before':before,'after':after,'error_px':delta,
                                'pass':delta is not None and delta<=2})
                            if delta is None or delta>2:
                                result['cases'][-1]['runtime_observation']=await browser_page.evaluate("()=>({tracked:readingPosition,saved:typesetReadingState.saved,revision:typesetReadingState.revision,resizing,padding:getComputedStyle(document.body).paddingBottom,images:[...document.querySelectorAll('.typeset-part:not([hidden]) img')].filter(im=>!im.complete||!im.naturalWidth).map(im=>({src:im.currentSrc||im.src,complete:im.complete,width:im.naturalWidth}))})")
                            await browser_page.set_viewport_size({'width':start[0],'height':start[1]})
                            await browser_page.wait_for_timeout(50)
                            await reading_position(browser_page)
                # Repeated resizes must invalidate earlier image/frame callbacks.
                await browser_page.set_viewport_size({'width':390,'height':844})
                await browser_page.wait_for_timeout(50)
                await reading_position(browser_page)
                await browser_page.evaluate(PLACE,{'id':chosen[len(chosen)//2],'fraction':.62})
                await browser_page.wait_for_timeout(50)
                before=await reading_position(browser_page)
                sequence=[(844,390),(740,900),(1024,900),(390,844)]
                for width,height in sequence:await browser_page.set_viewport_size({'width':width,'height':height})
                await browser_page.wait_for_timeout(80)
                await reading_position(browser_page)
                after=await reading_position(browser_page)
                delta=abs(after['fraction']-before['fraction'])*after['height'] if after['id']==before['id'] else None
                result['cases'].append({'page':name,'kind':'rapid-resizes','sequence':sequence,
                    'before':before,'after':after,'error_px':delta,'pass':delta is not None and delta<=2})
                # Real click / hash / history paths, including a click during a pending resize.
                await browser_page.evaluate(PLACE,{'id':chosen[-1],'fraction':.5})
                await browser_page.wait_for_timeout(50)
                await browser_page.evaluate("() => { dispatchEvent(new Event('resize'));document.querySelector('.back-to-top,.sample-back-top')?.click(); }")
                await browser_page.wait_for_timeout(900)
                top=await browser_page.evaluate('scrollY')
                result['navigation'].append({'page':name,'kind':'back-to-top-during-resize','y':top,'pass':top<=2})
                hrefs=await browser_page.locator('.toc a[href^="#"]').evaluate_all('(nodes)=>nodes.map(a=>a.getAttribute("href")).filter(h=>h!=="#menu")')
                if hrefs:
                    target=hrefs[-1]
                    await browser_page.evaluate("hash => {dispatchEvent(new Event('resize'));document.querySelector('.toc a[href=\"'+CSS.escape(hash)+'\"]').click();}",target)
                    await browser_page.wait_for_timeout(250)
                    error=await browser_page.evaluate("hash => {const el=document.getElementById(decodeURIComponent(hash.slice(1)));return Math.abs(el.getBoundingClientRect().top-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0));}",target)
                    result['navigation'].append({'page':name,'kind':'toc-during-resize','hash':target,'error_px':error,'pass':error<=2})
                    await browser_page.reload(wait_until='domcontentloaded',timeout=90000)
                    await browser_page.evaluate('document.fonts.ready')
                    await browser_page.wait_for_function("hash => {const el=document.getElementById(decodeURIComponent(hash.slice(1)));return el && Math.abs(el.getBoundingClientRect().top-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0))<=2;}",arg=target,polling='raf',timeout=60000)
                    await browser_page.wait_for_timeout(250)
                    error=await browser_page.evaluate("hash => {const el=document.getElementById(decodeURIComponent(hash.slice(1)));return Math.abs(el.getBoundingClientRect().top-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0));}",target)
                    result['navigation'].append({'page':name,'kind':'direct-hash-reload','hash':target,'error_px':error,'pass':error<=2})
                    if hrefs[0]!=target:
                        await browser_page.evaluate("hash => {location.hash=hash;}",hrefs[0])
                        await browser_page.wait_for_timeout(100)
                        await browser_page.evaluate('history.back()')
                        await browser_page.wait_for_timeout(250)
                        error=await browser_page.evaluate("hash => {const el=document.getElementById(decodeURIComponent(hash.slice(1)));return Math.abs(el.getBoundingClientRect().top-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0));}",target)
                        result['navigation'].append({'page':name,'kind':'hash-history-back','hash':target,'error_px':error,'pass':error<=2})
                print(name+': '+str(sum(c['page']==name and not c['pass'] for c in result['cases']))+' resize failures',flush=True)
        except Exception as error:
            result['errors'].append(str(error))
            result['aborted']=True
            try:result['failure_observation']=await browser_page.evaluate("()=>({url:location.href,tracked:readingPosition,saved:typesetReadingState.saved,revision:typesetReadingState.revision,resizing,images:[...document.querySelectorAll('.typeset-part:not([hidden]) img')].filter(im=>!im.complete||!im.naturalWidth).map(im=>({src:im.currentSrc||im.src,complete:im.complete,width:im.naturalWidth}))})")
            except Exception as observation_error:result['failure_observation_error']=str(observation_error)
        finally:
            if context and args.static_retry_once:await context.unroute_all(behavior='wait')
            if response_tasks:await asyncio.gather(*response_tasks)
            result['responses']=responses
            if context:await context.close()
            cleanup=subprocess.run(['pwsh','-NoProfile','-File','E:/.agents/tools/Move-TaskItemToRecycleBin.ps1',
                       '-LiteralPath',str(profile),'-AllowedRoot',str(args.cache.resolve()),'-Json'],
                       capture_output=True,text=True,creationflags=subprocess.CREATE_NO_WINDOW)
            result['profile_cleanup']={'exit_code':cleanup.returncode,'receipt':cleanup.stdout.strip(),'error':cleanup.stderr.strip()}
    result['verified_at_beijing']=datetime.now(timezone(timedelta(hours=8))).isoformat()
    result['summary']={'pages':len(result['pages']),'expected_pages':len(names),'resizes':len(result['cases']),
        'failed_resizes':sum(not c['pass'] for c in result['cases']),
        'max_error_px':max((c['error_px'] or 0 for c in result['cases']),default=0),
        'screen_mismatches':sum(c['before']['id']!=c['after']['id'] for c in result['cases']),
        'navigation_checks':len(result['navigation']),
        'failed_navigation':sum(not c['pass'] for c in result['navigation']),
        'page_errors':len(result['errors'])}
    return result


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root',type=Path,required=True)
    ap.add_argument('--build-report',type=Path,required=True)
    ap.add_argument('--cache',type=Path,required=True)
    ap.add_argument('--out',type=Path,required=True)
    ap.add_argument('--pages',nargs='+')
    ap.add_argument('--navigation-only',action='store_true',help='Run rapid resizes and navigation without the full position matrix')
    ap.add_argument('--desktop-height',type=int,default=900,help='Use 640 to cross the width breakpoint without changing CSS orientation')
    ap.add_argument('--patched-runtime',action='store_true')
    ap.add_argument('--port',type=int,default=0,help='Fixed registered loopback origin for OSS CORS verification')
    ap.add_argument('--static-retry-once',action='store_true',help='08:52 acceptance: actual static HTTPS body retrieval with at most one retry, preserving response hashes and first failures')
    ap.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    args=ap.parse_args()
    args.cache.mkdir(parents=True,exist_ok=True)
    for key in ['TEMP','TMP','TMPDIR']:os.environ[key]=str(args.cache.resolve())
    build=json.loads(args.build_report.read_text('utf8'));overrides={}
    if args.patched_runtime:
        spec=importlib.util.spec_from_file_location('typeset_builder',HERE/'build-typeset-site.py')
        module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
        for entry in build['pages'].values():
            source=next(Path(p) for p in entry['inputs'] if Path(p).name.startswith('app-') and Path(p).suffix=='.js')
            html=args.root/(entry['url'].lstrip('/')+'index.html' if entry['url'].endswith('/') else entry['url'].lstrip('/'))
            href=re.search(r'src="(/_typeset/runtime/app-[^"]+\.js)"',html.read_text('utf8'))[1]
            app_text,app_proof=module.text_bound(source)
            if app_proof!=entry['inputs'][str(source)]:raise ValueError('Legacy runtime source changed')
            patched=module.patch_app(app_text).encode('utf8')
            if href in overrides and overrides[href]!=patched:raise ValueError('Ambiguous app source')
            overrides[href]=patched
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self,*a,**kw):super().__init__(*a,directory=str(args.root.resolve()),**kw)
        def log_message(self,*a):pass
        def copyfile(self,source,output):
            try:super().copyfile(source,output)
            except (BrokenPipeError,ConnectionAbortedError,ConnectionResetError):pass
        def do_GET(self):
            path=self.path.split('?')[0]
            body=overrides.get(path)
            if path=='/__status':body=b'{"state":"unavailable","reason":"local_preview"}'
            if body is None:return super().do_GET()
            self.send_response(200);self.send_header('Content-Type','text/javascript' if path.endswith('.js') else 'application/json')
            self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
    server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    try:
        result=asyncio.run(run(args,'http://127.0.0.1:'+str(server.server_port),build))
        result['runtime_sha256']={url:hashlib.sha256(body).hexdigest() for url,body in overrides.items()}
        unchanged=hashlib.sha256((args.root/'release-manifest.json').read_bytes()).hexdigest()==result['manifest_sha256']
        actual_by_url={}
        for response in result['responses']:
            actual_by_url.setdefault(response['url'],[]).append(response)
        response_failures=[]
        for entry in result['pages'].values():
            html=args.root/(entry['url'].lstrip('/')+'index.html' if entry['url'].endswith('/') else entry['url'].lstrip('/'))
            unchanged=unchanged and hashlib.sha256(html.read_bytes()).hexdigest()==entry['html_sha256']
            actual_html=actual_by_url.get('http://127.0.0.1:'+str(server.server_port)+entry['url'],[])
            if not actual_html or any(row['status']!=200 or row.get('sha256')!=entry['html_sha256'] for row in actual_html):
                response_failures.append({'url':entry['url'],'kind':'html','responses':actual_html})
            for script in entry['scripts']:
                script['overridden']=script['url'] in overrides
                expected=result['runtime_sha256'].get(script['url'],script['sha256'])
                actual=actual_by_url.get(script['response_url'],[])
                script['expected_served_sha256']=expected
                script['observed_sha256']=[row.get('sha256') for row in actual]
                script['served_sha256']=actual[0].get('sha256') if actual else None
                script['response_verified']=bool(expected and actual) and all(row['status']==200 and row.get('sha256')==expected for row in actual)
                if not script['response_verified']:response_failures.append({'url':script['response_url'],'kind':'script','expected_sha256':expected,'responses':actual})
                if script['sha256'] and not urlsplit(script['src']).netloc:
                    unchanged=unchanged and hashlib.sha256((args.root/script['url'].lstrip('/')).read_bytes()).hexdigest()==script['sha256']
        result['response_failures']=response_failures
        result['artifact_unchanged']=unchanged
        result['status']='pass' if unchanged and not response_failures and not any(result['summary'][key] for key in ['failed_resizes','failed_navigation','page_errors']) else 'fail'
        args.out.parent.mkdir(parents=True,exist_ok=True);args.out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
        print(json.dumps(result['summary'],ensure_ascii=False),flush=True)
        if result['status']!='pass':raise SystemExit(1)
    finally:server.shutdown();server.server_close();thread.join(timeout=5)


if __name__=='__main__':main()

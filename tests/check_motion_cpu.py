"""Measure natural browsing with real Chrome CDP CPU throttling; DOM only."""
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


def inventory(root):
    pages, historical = [], []
    for path in sorted(root.rglob('*.html')):
        text = path.read_text('utf8')
        relative = path.relative_to(root).as_posix()
        route = '/' + relative.removesuffix('index.html') if relative.endswith('index.html') else '/' + relative
        marker = re.search(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>', text, re.S)
        refs = re.findall(r'<script\b[^>]*\bsrc=["\']([^"\']+)', text)
        record = {'route': route, 'file': relative, 'scripts': refs}
        if marker:
            data = json.loads(marker[1]); record['route'] = data.get('url') or route
            record['page_kind'] = data.get('kind'); pages.append(record)
        else:
            historical.append(record)
    return pages, historical


TRACE = """(() => {
 const trace={opened:performance.now(),previous:null,frames:[]};window.__motionCPUTrace=trace;
 function tick(){const now=performance.now();if(document.hidden){trace.previous=null;}
  else{if(trace.previous!==null&&trace.previous>=trace.opened+2000)trace.frames.push(now-trace.previous);trace.previous=now;}
  requestAnimationFrame(tick);
 }requestAnimationFrame(tick);
})()"""

SNAPSHOT = """() => {
 const values=window.__motionCPUTrace.frames.slice().sort((a,b)=>a-b),n=values.length,mid=Math.floor(n/2);
 const median=n?(n%2?values[mid]:(values[mid-1]+values[mid])/2):null;
 const total=values.reduce((a,b)=>a+b,0);
 return {insurance:window.SiteMotionInsurance?.snapshot||null,options:window.SiteSamples?.options||null,
  leaves:document.querySelectorAll('.falling-leaf').length,body_motion_off:document.body.classList.contains('motion-off'),
  fps:{samples:n,observed_seconds:total/1000,median:median?1000/median:null,mean:total?n*1000/total:null,
   slow_fraction:n?values.filter(gap=>gap>100).length/n:null,maximum_gap_ms:n?values[n-1]:null},
  scroll_y:scrollY,document_height:document.documentElement.scrollHeight,hidden:document.hidden,
  viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,mobile:matchMedia('(pointer:coarse)').matches,
  storage:{local:Object.keys(localStorage),session:Object.keys(sessionStorage)}};
}"""


def save(args, result):
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf8')


async def run(args, address):
    pages, historical = inventory(args.root)
    known_routes={record['route'] for record in pages}
    if args.pages and set(args.pages)-known_routes:
        raise ValueError('Requested CPU sample is not a supported page-data route')
    requested_routes=args.pages or [record['route'] for record in pages]
    result = {'schema':'wly.motion-natural-cpu-check.v1', 'checked_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),
        'root':str(args.root.resolve()), 'method':'installed headless Google Chrome, actual CDP Emulation.setCPUThrottlingRate; no synthetic CPU work, screenshots or image inspection',
        'scope':{'html_count':len(pages)+len(historical), 'motion_pages':pages, 'historical_without_page_data':historical,
            'requested_cpu_routes':requested_routes,
            'reason':'Only these page-data pages reference the content-addressed patched app. CPU results cover requested_cpu_routes; historical references and representative navigation are checked separately.'},
        'checks':[], 'issues':[], 'complete':False}
    async with async_playwright() as pw:
        plans=[(4,requested_routes),(20,args.pages or ['/','/projects/timeaudit/','/projects/localocr/'])]
        for factor, routes in [plan for plan in plans if plan[0] in args.cpu_rates and not args.history_only]:
            for view in ['desktop','phone']:
                phone=view=='phone'; width,height=(412,915) if phone else (1440,900)
                profile=args.cache/('cpu-'+str(factor)+'-'+view+'-'+uuid.uuid4().hex)
                context=await pw.chromium.launch_persistent_context(str(profile), executable_path=str(args.chrome), headless=True,
                    viewport={'width':width,'height':height}, device_scale_factor=3.5 if phone else 1, is_mobile=phone, has_touch=phone,
                    **({'user_agent':'Mozilla/5.0 (Linux; Android 15; Xiaomi 15 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36'} if phone else {}))
                try:
                    page=context.pages[0]; cdp=await context.new_cdp_session(page)
                    acknowledgement=await cdp.send('Emulation.setCPUThrottlingRate',{'rate':factor if factor==4 else 1})
                    await context.add_init_script(TRACE)
                    page_errors=[]; notices=[]
                    page.on('pageerror',lambda error:page_errors.append(str(error)))
                    page.on('console',lambda message:notices.append(message.text) if '[SiteMotionInsurance]' in message.text else None)
                    for index,route in enumerate(routes):
                        page_errors.clear();notices.clear()
                        if factor==20:await cdp.send('Emulation.setCPUThrottlingRate',{'rate':1})
                        response=await page.goto(address+route,wait_until='load',timeout=45000)
                        await page.evaluate('document.fonts.ready')
                        if factor==20:
                            # Exclude initial loading/decoding from this focused
                            # extreme natural-animation measurement. The earlier
                            # cold 20x attempt is preserved as separate evidence.
                            await page.wait_for_timeout(2300)
                            acknowledgement=await cdp.send('Emulation.setCPUThrottlingRate',{'rate':20})
                            await page.evaluate('Object.assign(__motionCPUTrace,{opened:performance.now()-2000,previous:null,frames:[]})')
                        await page.wait_for_timeout(10000 if factor==20 else 8000)
                        idle=await page.evaluate(SNAPSHOT)
                        scrolls=[]
                        for _ in range(3 if factor==4 else 0):
                            delta=await page.evaluate('Math.max(350,(document.documentElement.scrollHeight-innerHeight)/3)')
                            await page.mouse.wheel(0,delta);await page.wait_for_timeout(250)
                            scrolls.append(await page.evaluate('({y:scrollY,insurance:SiteMotionInsurance?.snapshot,off:document.body.classList.contains("motion-off")})'))
                        after=await page.evaluate(SNAPSHOT)
                        # A real in-page link click exercises the shared navigation.
                        links=await page.locator('a[href^="#"]:not(.skip)').evaluate_all("nodes=>nodes.filter(el=>el.getClientRects().length&&el.getAttribute('href').length>1&&document.getElementById(decodeURIComponent(el.getAttribute('href').slice(1)))).map(el=>({href:el.getAttribute('href'),label:el.getAttribute('aria-label')||el.textContent}))")
                        navigation={'available':bool(links),'pass':True}
                        if links and factor==4:
                            href=links[0]['href']; await page.locator('a[href="'+href+'"]:not(.skip):visible').first.click(timeout=10000);await page.wait_for_timeout(200)
                            navigation={'available':True,'href':href,'actual_hash':await page.evaluate('location.hash'),'pass':await page.evaluate('(href)=>location.hash===href&&!!document.getElementById(decodeURIComponent(href.slice(1)))',href)}
                        common=response.status==200 and idle['insurance'] is not None and all(idle['options'].values()) and idle['fps']['samples']>0 and not page_errors
                        if factor==4:
                            response_ok=not idle['insurance']['stalled'] and not after['insurance']['stalled'] and not idle['body_motion_off'] and not after['body_motion_off'] and idle['leaves']==6 and all(not item['off'] and not item['insurance']['stalled'] for item in scrolls) and navigation['pass'] and not notices
                        else:
                            insurance=idle['insurance']
                            response_ok=(not insurance['stalled'] and not notices) or (insurance['observed_ms']>=5000 and insurance['observed_frames']>=8 and insurance['median_fps']<10 and insurance['slow_fraction']>=.9 and idle['body_motion_off'] and len(notices)==1)
                        passed=common and response_ok
                        record={'kind':'natural-browsing-no-fallback' if factor==4 else 'natural-extreme-animation-response','route':route,'view':view,'phone_is_emulation':phone,'css_viewport':[width,height],'dpr':3.5 if phone else 1,'cdp_cpu_throttling_rate':factor,'throttling_applied':'before navigation' if factor==4 else 'after normal page loading/fonts and 2.3-second startup settling; no synthetic CPU work','cdp_acknowledgement':acknowledgement,'status_code':response.status,'idle':idle,'scrolls':scrolls,'after':after,'navigation':navigation,'console':list(notices),'page_errors':list(page_errors),'pass':passed}
                        result['checks'].append(record)
                        if not passed:result['issues'].append(str(factor)+'x '+view+' '+route)
                        save(args,result)
                        print(json.dumps({'cpu_factor':factor,'view':view,'route':route,'progress':str(index+1)+'/'+str(len(routes)),'median_fps':idle['fps']['median'],'stalled':idle['insurance']['stalled'],'pass':passed},ensure_ascii=False),flush=True)
                finally:await context.close()
        # No page-data means no generic detector. Verify script inventories and
        # representative normal navigation without promoting them to 40-page tests.
        historical_refs={ref for item in historical for ref in item['scripts']}
        patched_refs={ref for item in pages for ref in item['scripts'] if ref.startswith('/_typeset/runtime/app-')}
        result['scope']['historical_script_refs']=sorted(historical_refs)
        result['scope']['historical_references_patched_app']=sorted(historical_refs & patched_refs)
        if historical_refs & patched_refs:result['issues'].append('historical pages unexpectedly reference patched app')
        selected=[]
        seen=set()
        for item in historical:
            family=item['route'].split('/')[1]
            if family not in seen or len(selected)<4:
                selected.append(item);seen.add(family)
            if len(selected)>=8:break
        if selected:
            context=await pw.chromium.launch_persistent_context(str(args.cache/('history-'+uuid.uuid4().hex)),executable_path=str(args.chrome),headless=True,viewport={'width':1440,'height':900})
            try:
                page=context.pages[0]
                for item in selected:
                    errors=[];page.on('pageerror',lambda error,errors=errors:errors.append(str(error)))
                    response=await page.goto(address+item['route'],wait_until='load');await page.wait_for_timeout(350);await page.mouse.wheel(0,700);await page.wait_for_timeout(150)
                    sample=await page.evaluate("""() => ({route:location.pathname,detector:!!window.SiteMotionInsurance,title:document.title,links:[...document.querySelectorAll('a[href]')].filter(a=>a.getClientRects().length).map(a=>a.getAttribute('href')).slice(0,8)})""")
                    local=[href for href in sample['links'] if href.startswith('/') and not href.startswith('//') and not href.startswith('/_')]
                    navigation={'available':bool(local),'pass':True}
                    if local:
                        await page.locator('a[href="'+local[0]+'"]').first.click(timeout=10000);await page.wait_for_load_state('load');navigation={'available':True,'href':local[0],'actual_url':page.url,'pass':page.url.startswith(address)}
                    redirected=sample['route']!=item['route']
                    detector_ok=not sample['detector'] or (redirected and sample['route'] in {entry['route'] for entry in pages})
                    record={'kind':'historical-representative-navigation','route':item['route'],'redirected_to_motion_page':redirected and sample['detector'],'sample':sample,'navigation':navigation,'page_errors':errors,'pass':response.status==200 and detector_ok and navigation['pass'] and not errors}
                    result['checks'].append(record)
                    if not record['pass']:result['issues'].append('historical '+item['route'])
            finally:await context.close()
    result['complete']=True;result['status']='pass' if not result['issues'] else 'fail';save(args,result)
    return result


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    for name in ['root','cache','out']:ap.add_argument('--'+name,type=Path,required=True)
    ap.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    ap.add_argument('--cpu-rates',type=int,nargs='+',choices=[4,20],default=[4,20])
    ap.add_argument('--history-only',action='store_true')
    ap.add_argument('--pages',nargs='+',help='Optional exact route subset for post-merge regression; scope is recorded')
    args=ap.parse_args();args.cache.mkdir(parents=True,exist_ok=True)
    for key in ['TEMP','TMP','TMPDIR']:os.environ[key]=str(args.cache.resolve())
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self,*a,**kw):super().__init__(*a,directory=str(args.root.resolve()),**kw)
        def log_message(self,*a):pass
        def copyfile(self,source,output):
            try:super().copyfile(source,output)
            except (BrokenPipeError,ConnectionAbortedError,ConnectionResetError):pass
        def do_GET(self):
            if self.path.split('?')[0]=='/__status':
                body=b'{"state":"unavailable","reason":"local_motion_cpu_check"}';self.send_response(200);self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body);return
            return super().do_GET()
    server=ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    try:
        result=asyncio.run(run(args,'http://127.0.0.1:'+str(server.server_port)))
        print(json.dumps({'status':result['status'],'checks':len(result['checks']),'issues':result['issues']},ensure_ascii=False))
        if result['status']!='pass':raise SystemExit(1)
    finally:server.shutdown();server.server_close();thread.join(timeout=5)


if __name__=='__main__':main()

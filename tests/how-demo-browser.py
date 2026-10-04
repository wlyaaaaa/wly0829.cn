"""Focused headless installed-Chrome how-demo acceptance, with GET-only fixtures."""
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
import subprocess
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit

ROOT=Path(__file__).resolve().parents[1]
SNAP="""()=>{const s=document.getElementById('one-sentence');return {url:location.href,phase:s?.dataset.howDemoPhase,ready:s?.dataset.howDemoReady,story:s?.dataset.howDemoStory,time:Number(s?.dataset.howDemoTime),speed:Number(s?.dataset.howDemoSpeed),sourceSpeed:window.SiteMotionAppearance?.speed_multiplier,visible:s?.dataset.howDemoVisible,overflow:document.documentElement.scrollWidth>innerWidth+1,stageDebug:typeof window.stage,result:s?.querySelector('.m')?.textContent,go:s?.querySelector('.go')?.getAttribute('href'),intro:s?.querySelector('.note')?.textContent,caseAnchors:['case-trip','case-restore','case-away'].map(id=>({id,exists:!!document.getElementById(id)})),clipped:[...s.querySelectorAll('.node .in,.result .in')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>({text:e.textContent,width:e.clientWidth,scroll:e.scrollWidth})),buttonCount:s?.querySelectorAll('.say').length,initialization:s?.dataset.howDemoInitialized,album:window.SiteAlbum?.snapshot,oldScreenCount:document.querySelectorAll('main [data-screen]').length};}"""


async def main(args):
    from playwright.async_api import async_playwright
    root=args.release_root.resolve();args.output.mkdir(parents=True,exist_ok=True);args.temp.mkdir(parents=True,exist_ok=True)
    os.environ['TEMP']=os.environ['TMP']=str(args.temp.resolve())
    manifest=json.loads((root/'release-manifest.json').read_text('utf8'));files=manifest['files']
    spec=importlib.util.spec_from_file_location('how_demo_fixture',ROOT/'tests/live-runtime-browser.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    status_fixture=json.dumps(module.fixture('normal'),ensure_ascii=False)
    state={'missing':[],'non_get':[],'external_blocked':[],'response_sha':{},'errors':[],'console_errors':[]};results=[];profiles=[];complete=False
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*_):pass
        def do_GET(self):
            path=unquote(urlsplit(self.path).path);p=(root/path.lstrip('/')).resolve()
            if p.is_relative_to(root) and p.is_dir():p=p/'index.html'
            valid=p.is_relative_to(root) and p.is_file();body=p.read_bytes() if valid else b'missing';mime=mimetypes.guess_type(p)[0] or 'application/octet-stream'
            if not valid:state['missing'].append(path)
            self.send_response(200 if valid else 404);self.send_header('Content-Type',mime+'; charset=utf-8' if mime.startswith('text/') else mime);self.send_header('Content-Length',str(len(body)));self.end_headers()
            try:self.wfile.write(body)
            except (ConnectionAbortedError,ConnectionResetError,BrokenPipeError):pass
    class Server(ThreadingHTTPServer):daemon_threads=True;request_queue_size=256
    server=Server(('127.0.0.1',0),Handler);worker=threading.Thread(target=server.serve_forever,daemon=True);worker.start();base='http://127.0.0.1:'+str(server.server_port)
    configs=[('desktop',{'viewport':{'width':1440,'height':1000}}),('phone',{'viewport':{'width':412,'height':915},'device_scale_factor':3.5,'is_mobile':True,'has_touch':True})]
    if args.desktop_only:configs=configs[:1]
    try:
        async with async_playwright() as pw:
            for device,options in configs:
                profile=args.temp/(device+'-'+str(time.time_ns()));profiles.append(profile)
                context=await pw.chromium.launch_persistent_context(str(profile),executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',headless=True,timezone_id='Asia/Shanghai',**options)
                async def route(r):
                    req=r.request;u=urlsplit(req.url)
                    if req.method!='GET':state['non_get'].append(req.url);return await r.abort()
                    if u.hostname=='mcp.wly0829.cn' and '/status' in u.path:return await r.fulfill(status=200,body=status_fixture,content_type='application/json')
                    if u.hostname=='local-graph.invalid':return await r.fulfill(status=200,body='<html><title>local fixture</title></html>',content_type='text/html')
                    path=unquote(u.path)
                    if u.hostname=='127.0.0.1' and u.port==server.server_port:local=path
                    elif u.hostname=='wly0829.cn':local=path
                    else:
                        parts=path.lstrip('/').split('/');local=next(('/'+'/'.join(parts[i:]) for i in range(len(parts)) if '/'.join(parts[i:]) in files),None)
                        if not local:state['external_blocked'].append(req.url);return await r.abort()
                    response=await context.request.get(base+local,timeout=25000);body=await response.body()
                    if '/_how-demo/' in req.url:state['response_sha'][local]={'sha256':hashlib.sha256(body).hexdigest(),'bytes':len(body),'status':response.status}
                    await r.fulfill(response=response,headers={**response.headers,'access-control-allow-origin':req.headers.get('origin','*')})
                await context.route('**/*',route);page=context.pages[0]
                page.on('pageerror',lambda e:state['errors'].append(str(e)));page.on('console',lambda m:state['console_errors'].append(m.text) if m.type=='error' else None)
                async def snap():return await page.evaluate(SNAP)
                async def load():
                    await page.goto(base+'/how/',wait_until='domcontentloaded');await page.wait_for_function('document.getElementById("one-sentence")?.dataset.howDemoReady==="true"',timeout=30000)
                await load();await page.wait_for_timeout(250);idle=await snap();assert idle['phase']=='idle' and idle['time']==0 and idle['stageDebug']=='undefined',idle
                assert idle['oldScreenCount']==15 and idle['buttonCount']==3 and all(a['exists'] for a in idle['caseAnchors'])
                assert idle['speed']==idle['sourceSpeed']==manifest['how_demo_preparation']['speed'],idle
                results.append({'device':device,'case':'offscreen-idle','snapshot':idle,'chrome':context.browser.version})
                await page.locator('#how-demo-stage').scroll_into_view_if_needed()
                await page.wait_for_function('document.getElementById("one-sentence").dataset.howDemoPhase==="playing"')
                for i in range(3):
                    started=time.monotonic()
                    if i:
                        await page.locator('#how-demo-pick button').nth(i).click();await page.locator('#how-demo-stage').scroll_into_view_if_needed()
                    overflow=False;frames=[]
                    while time.monotonic()-started<20:
                        sample=await snap();overflow=overflow or sample['overflow'];frames.append({'time':sample['time'],'phase':sample['phase'],'overflow':sample['overflow']})
                        if sample['phase']=='complete':break
                        await page.wait_for_timeout(100)
                    else:raise RuntimeError('Story did not finish in real time: '+str(await snap()))
                    data=await page.evaluate('JSON.parse(document.querySelector("[data-how-demo-data]").textContent)')
                    assert sample['result']==data['stories'][i]['result'] and sample['go']==data['stories'][i]['link'] and not sample['clipped'] and not overflow,sample
                    results.append({'device':device,'case':'story-'+str(i+1),'elapsed_seconds':round(time.monotonic()-started,3),'snapshot':sample,'samples':frames})
                await page.locator('#how-demo-result .go').click();await page.wait_for_timeout(180)
                assert urlsplit(page.url).fragment=='case-away';results.append({'device':device,'case':'real-case-anchor','url':page.url})
                await page.emulate_media(reduced_motion='reduce')
                await load()
                for i in range(3):
                    await page.locator('#how-demo-pick button').nth(i).click();await page.wait_for_timeout(30);sample=await snap();assert sample['phase']=='complete' and not sample['overflow'] and not sample['clipped'],sample
                    results.append({'device':device,'case':'reduce-'+str(i+1),'snapshot':sample})
                await context.close()
            complete=True
    finally:
        server.shutdown();server.server_close();worker.join(timeout=5)
        for profile in profiles:
            if profile.exists():subprocess.run(['pwsh','-NoProfile','-File','E:/.agents/tools/Move-TaskItemToRecycleBin.ps1','-LiteralPath',str(profile.resolve()),'-AllowedRoot',str(args.temp.resolve()),'-Json'],check=True)
        for local,row in state['response_sha'].items():
            key=local.lstrip('/')
            if key in files:assert row['sha256']==files[key]['sha256'] and row['bytes']==files[key]['bytes'] and row['status']==200,local
        report={'status':'pass' if complete and not state['missing'] and not state['errors'] and not state['console_errors'] else 'incomplete','release_id':manifest['release_id'],'strict_served_root':str(root),'results':results,'requests':state,'server_closed':not worker.is_alive(),'observed_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),'boundaries':['headless installed Chrome only','phone viewport 412x915 DPR3.5, no physical phone','no screenshot, image viewing or recording','external status/graph are fixtures, non-GET blocked']}
        (args.output/'browser-evidence.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n','utf8');print(json.dumps({'status':report['status'],'cases':len(results),'missing':len(state['missing']),'errors':state['errors'],'console_errors':state['console_errors']},ensure_ascii=False))


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--release-root',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--temp',type=Path,required=True);p.add_argument('--desktop-only',action='store_true');asyncio.run(main(p.parse_args()))

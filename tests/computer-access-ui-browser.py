"""Installed-Chrome acceptance of the real built authority and summary pages.

All status responses are local fixtures. Every non-GET request is blocked.
"""
import argparse
import asyncio
import datetime
import importlib.util
import json
import mimetypes
import os
from pathlib import Path
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit
from playwright.async_api import async_playwright


async def run(args):
    args.output.mkdir(parents=True, exist_ok=True); args.temp.mkdir(parents=True, exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = os.environ['TMPDIR'] = str(args.temp)
    spec = importlib.util.spec_from_file_location('hardware_fixture', Path(__file__).with_name('live-hardware-ui-browser.py'))
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    state = {'mode': 'normal', 'status_requests': 0, 'writes': [], 'missing': []}
    errors, console_errors, results = [], [], []
    def status():
        now = time.time(); result = module.fixture()
        old = state['mode'] == 'old-hardware'
        hardware_at = now - 600 if old else now
        result.update(observed_at_unix=now, served_at_unix=now, hardware_observed_at_unix=hardware_at,
            state_version='local-fixture-only', default_minutes=1440, factor={'available': False},
            personal_data={'state': 'unlocked', 'expires_at_unix': now+7200}, unrestricted={'state': 'active', 'expires_at_unix': now+3600},
            public_actions={'lock_windows': False, 'lock_data': False, 'end_unrestricted': False},
            display_cache={'collectors': {'authorization': {'state': 'ready', 'observed_at_unix': now}, 'hardware': {'state': 'error' if old else 'ready', 'observed_at_unix': hardware_at}}})
        for group in [result['hardware']['cpu'], *result['hardware']['gpus'], result['hardware']['memory'], *result['hardware']['volumes'], result['hardware']['network'], result['hardware']['display']]:
            for source in group['sources'].values(): source['observed_at_unix'] = hardware_at
        if state['mode'] == 'unknown': result['hardware'] = {'state': 'unavailable'}
        return result
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_): pass
        def do_GET(self):
            path = unquote(urlsplit(self.path).path)
            if path == '/__status':
                state['status_requests'] += 1
                body = json.dumps(status(), ensure_ascii=False).encode('utf8'); mime='application/json'
                code = 503 if state['mode'] == 'failure' else 200
            else:
                target = (args.assets if path.startswith('/assets/live-hardware/') else args.release) / path.lstrip('/')
                if path.endswith('/'): target = target / 'index.html'
                if not target.is_file(): state['missing'].append(path); self.send_error(404); return
                body=target.read_bytes(); mime=mimetypes.guess_type(str(target))[0] or 'application/octet-stream'; code=200
            self.send_response(code); self.send_header('Content-Type', mime); self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body)
        def do_POST(self): state['writes'].append(self.path); self.send_error(405)
    server=ThreadingHTTPServer(('127.0.0.1',0),Handler); threading.Thread(target=server.serve_forever,daemon=True).start()
    origin=f'http://127.0.0.1:{server.server_port}'
    try:
        async with async_playwright() as pw:
            for device, viewport in [('desktop',{'width':1440,'height':1000}),('xiaomi-portrait',{'width':412,'height':915})]:
                context=await pw.chromium.launch_persistent_context(str(args.temp/device),executable_path=str(args.chrome),headless=True,viewport=viewport,device_scale_factor=3.5 if device!='desktop' else 1,is_mobile=device!='desktop',has_touch=device!='desktop',timezone_id='America/Chicago')
                async def route(request_route):
                    request=request_route.request; url=urlsplit(request.url)
                    if request.method not in ['GET','HEAD']:
                        state['writes'].append(request.url); return await request_route.abort()
                    if url.hostname=='mcp.wly0829.cn' and '/status' in url.path: path='/__status'
                    elif url.hostname=='wly0829.cn': path=url.path
                    else: return await request_route.abort()
                    response=await context.request.get(origin+path,timeout=15000); await request_route.fulfill(response=response)
                await context.route('**/*',route)
                page=context.pages[0]; page.on('pageerror',lambda error: errors.append(str(error)))
                page.on('console',lambda message: console_errors.append(message.text) if message.type=='error' and '503' not in message.text else None)
                async def snap():
                    return await page.evaluate("""()=>({overflow:document.documentElement.scrollWidth>innerWidth,text:[...document.querySelectorAll('.ca-grants,.access-summary article,.live-hardware-compact')].map(e=>e.textContent),authority:[...document.querySelectorAll('[data-authority-state]')].map(e=>e.dataset.authorityState),compact:document.querySelector('.live-hardware-compact')?.textContent,href:document.querySelector('.live-hardware-compact')?.getAttribute('href'),brokenImages:[...document.querySelectorAll('.ca-authority-icon,.access-authority-icon')].filter(e=>!e.naturalWidth).map(e=>e.src)})""")
                async def load(path,mode):
                    state['mode']=mode; before=state['status_requests']
                    await page.goto('https://wly0829.cn'+path,wait_until='networkidle')
                    await page.wait_for_selector('.live-hardware-compact'); await page.evaluate('document.fonts.ready')
                    await page.wait_for_timeout(150)
                    snapshot=await snap()
                    assert not snapshot['overflow'] and not snapshot['brokenImages'], snapshot
                    assert snapshot['href']=='/cockpit/#pc' and state['status_requests']-before==1, (snapshot,state)
                    return snapshot
                normal=await load('/computer-access/','normal')
                assert normal['authority']==['unlocked','active','unlocked'], normal
                assert any('截止' in text for text in normal['text'])
                await page.screenshot(path=str(args.output/(device+'-authority-normal.png')),full_page=True)
                before=state['status_requests']; state['mode']='failure'
                await page.get_by_role('button',name='刷新状态',exact=True).click()
                await page.wait_for_selector('.ca-grants [data-authority-state="unknown"]')
                failed=await snap()
                assert failed['authority']==['unknown','unknown','unknown'] and '上次读到' in failed['compact']
                assert state['status_requests']-before==1
                await page.reload(wait_until='networkidle'); await page.wait_for_selector('.live-hardware-compact')
                await page.wait_for_selector('.ca-connection-offline')
                reloaded=await snap()
                assert reloaded['authority']==['unknown','unknown','unknown'] and '48.5%' in reloaded['compact'], reloaded
                await page.screenshot(path=str(args.output/(device+'-authority-cached-offline.png')),full_page=True)
                separated=await load('/computer-access/','old-hardware')
                assert separated['authority']==['unlocked','active','unlocked'] and '上次读到' in separated['compact'] and '电脑在线' in separated['compact']
                unknown=await load('/computer-access/','unknown')
                assert '读不到' in unknown['compact'] and '0%' not in unknown['compact']
                summary=await load('/mcp/','normal')
                assert summary['authority']==['unlocked','active','unlocked'] and '48.5%' in summary['compact'], summary
                await page.screenshot(path=str(args.output/(device+'-mcp-summary.png')),full_page=False)
                results.append({'device':device,'normal':normal,'failed':failed,'reloaded':reloaded,'separated_collectors':separated,'unknown':unknown,'mcp_summary':summary})
                await context.close()
    finally: server.shutdown(); server.server_close()
    receipt={'schema':'website.authority-ui.browser.v1','observed_at_beijing':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(),'chrome':str(args.chrome),'results':results,'server':state,'page_errors':errors,'console_errors':console_errors}
    (args.output/'browser-results.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2),encoding='utf8')
    assert not errors and not console_errors and not state['writes'] and not state['missing'], receipt
    print(json.dumps({'devices':len(results),'cases':len(results)*6,'status_requests':state['status_requests'],'post_requests':len(state['writes']),'page_errors':len(errors),'console_errors':len(console_errors)}))


if __name__=='__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('--release',type=Path,required=True);parser.add_argument('--assets',type=Path,required=True);parser.add_argument('--output',type=Path,required=True);parser.add_argument('--temp',type=Path,required=True)
    parser.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    asyncio.run(run(parser.parse_args()))

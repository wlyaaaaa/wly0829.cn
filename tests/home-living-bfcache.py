"""Real Chrome BFCache restore of the actual homepage, without request routing."""
from __future__ import annotations
import argparse
import asyncio
from datetime import datetime, timezone, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import json
import mimetypes
import os
from pathlib import Path
import subprocess
import threading
from urllib.parse import unquote, urlsplit
from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('home_browser', HERE/'home-living-browser.py')
home = importlib.util.module_from_spec(spec)
spec.loader.exec_module(home)
EVENTS = r'''(() => {
 window.__cacheDocument=crypto.randomUUID();window.__cacheShows=[];window.__cacheHides=[];
 addEventListener('pageshow',e=>__cacheShows.push({persisted:e.persisted,at:performance.now()}));
 addEventListener('pagehide',e=>__cacheHides.push({persisted:e.persisted,at:performance.now()}));
})();'''


async def run(args):
    root, output = args.release.resolve(), args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    profiles = output/'profiles'
    profiles.mkdir(exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = str(output)
    results, errors, console, cleanup = [], [], [], []
    requests, external, posts, missing = [], [], [], []

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_):
            pass

        def do_GET(self):
            path = unquote(urlsplit(self.path).path)
            status, mime = 200, 'application/json; charset=utf-8'
            if path == '/__status':
                body = json.dumps(home.fixture('normal'), ensure_ascii=False).encode()
            else:
                rel = path.lstrip('/')+('index.html' if path.endswith('/') else '')
                target = (root/rel).resolve()
                if target.is_relative_to(root) and target.is_file():
                    body = target.read_bytes()
                    mime = mimetypes.guess_type(str(target))[0] or 'application/octet-stream'
                else:
                    status, body = 404, b'fixture-not-found'
                    missing.append(path)
            self.send_response(status)
            self.send_header('Content-Type', mime)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'public, max-age=600')
            self.send_header('Access-Control-Allow-Origin', self.headers.get('Origin', '*'))
            self.send_header('Vary', 'Origin')
            self.end_headers()
            try:
                self.wfile.write(body)
            except ConnectionError:
                pass

        def do_POST(self):
            posts.append(self.path)
            self.send_error(405)

    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{server.server_port}'
    try:
        async with async_playwright() as pw:
            for device, options in [('desktop', {'viewport': {'width': 1440, 'height': 900}}),
                                    ('xiaomi', {'viewport': {'width': 412, 'height': 915}, 'device_scale_factor': 3.5, 'is_mobile': True, 'has_touch': True})]:
                context = await pw.chromium.launch_persistent_context(str(profiles/device), executable_path=str(args.chrome), headless=True,
                    # Playwright's real installed default disables this browser feature.
                    ignore_default_args=['--disable-back-forward-cache'],
                    args=['--no-first-run', '--no-default-browser-check'], **options)
                await context.add_init_script(home.OBSERVE)
                await context.add_init_script(EVENTS)
                page = context.pages[0]
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('console', lambda m, device=device: console.append({'device':device,'type':m.type,'text':m.text}))
                page.on('request', lambda r: requests.append(r.url))
                page.on('request', lambda r: external.append(r.url) if not r.url.startswith(base+'/') and r.url.startswith(('http://','https://')) else None)
                cdp = await context.new_cdp_session(page)
                await cdp.send('Page.enable')
                not_used = []
                cdp.on('Page.backForwardCacheNotUsed', lambda event: not_used.append(event))
                await page.goto(base+'/', wait_until='domcontentloaded')
                await page.wait_for_function('window.HomeLiving && window.SiteStatus?.snapshot')
                await page.evaluate('HomeLiving.ready')
                await page.wait_for_function("HomeLiving.diagnostics().phase==='live'")
                await page.wait_for_timeout(3400)
                first = await page.evaluate('({id:__cacheDocument,shows:__cacheShows,diagnostics:HomeLiving.diagnostics()})')
                await page.locator('#home-01 .hotspot[href="/projects/agents/"]').click()
                await page.wait_for_url(base+'/projects/agents/')
                await page.wait_for_timeout(300)
                await page.go_back(wait_until='commit')
                await page.wait_for_function('window.__cacheShows?.some(e=>e.persisted)')
                restored = await page.evaluate('({id:__cacheDocument,shows:__cacheShows,hides:__cacheHides,diagnostics:HomeLiving.diagnostics()})')
                assert restored['id'] == first['id'] and any(x['persisted'] for x in restored['shows']), (first, restored, not_used)
                alternate = {'width': 915, 'height': 412} if device == 'xiaomi' else {'width': 412, 'height': 915}
                target = 'landscape' if device == 'xiaomi' else 'portrait'
                original = 'portrait' if device == 'xiaomi' else 'landscape'
                await page.set_viewport_size(alternate)
                await page.wait_for_function("o=>HomeLiving.diagnostics().orientation===o&&HomeLiving.diagnostics().phase==='live'", arg=target)
                await page.wait_for_timeout(250)
                await page.set_viewport_size(options['viewport'])
                await page.wait_for_function("o=>HomeLiving.diagnostics().orientation===o&&HomeLiving.diagnostics().phase==='live'", arg=original)
                await page.wait_for_timeout(250)
                after = await page.evaluate(home.SNAP)
                assert after['diagnostics']['orientationSkips'] >= restored['diagnostics']['orientationSkips']+2
                assert await page.locator('#home-01 .hero-live-layer').count() == 1
                assert await page.locator('#home-01 .hero-live-layer').evaluate("e=>getComputedStyle(e).visibility!=='hidden'")
                assert all(not x['visible'] or x['it'] >= 6.5 for x in after['probe']['intros'] if x['scene'] != '1')
                assert after['probe']['oscillators'] == 0 and not after['diagnostics']['frameGuard']['trigger']
                results.append({'device':device,'case':'real-persisted-native-hotspot-navigation-back-rotate','first':first,'restored':restored,'after':after,'cache_not_used':not_used})
                await context.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
        for profile in profiles.iterdir():
            done = subprocess.run(['pwsh','-NoProfile','-File','E:/.agents/tools/Move-TaskItemToRecycleBin.ps1','-LiteralPath',str(profile),'-AllowedRoot',str(profiles),'-Json'], capture_output=True,text=True,encoding='utf8')
            cleanup.append({'path':str(profile),'exit_code':done.returncode,'receipt':done.stdout,'stderr':done.stderr})
        receipt = {'observed_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),'chrome':str(args.chrome),'release_root':str(root),
                   'real_bfcache':True,'synthetic_business_status':True,'request_routing_used':False,'results':results,'page_errors':errors,'console':console,
                   'requests':requests,'external_requests':external,'posts':posts,'missing':missing,'server_stopped':not thread.is_alive(),'profile_cleanup':cleanup}
        (output/'browser-results.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    assert not errors and not external and not posts and not missing, receipt
    assert all(x['exit_code']==0 for x in cleanup)
    print(json.dumps({'real_persisted_cases':len(results),'page_errors':len(errors),'server_stopped':receipt['server_stopped']},ensure_ascii=False))


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    asyncio.run(run(parser.parse_args()))

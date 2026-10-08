"""Synthetic-only, installed-Chrome acceptance; never screenshots or real APIs."""
from __future__ import annotations

import argparse
import asyncio
import datetime
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
import time
from urllib.parse import unquote, urlsplit

from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('live_fixture', HERE / 'live-runtime-browser.py')
live = importlib.util.module_from_spec(spec)
spec.loader.exec_module(live)

OBSERVE = r'''(() => {
 window.__livingProbe={draws:0,uTimes:[],textures:[],bird:null,oscillators:0,storageWrites:[],fetches:[]};
 const p=window.__livingProbe,draw=WebGLRenderingContext.prototype.drawArrays,uniform=WebGLRenderingContext.prototype.uniform1f,texture=WebGLRenderingContext.prototype.texImage2D;
 WebGLRenderingContext.prototype.drawArrays=function(...args){p.draws++;return draw.apply(this,args);};
 WebGLRenderingContext.prototype.uniform1f=function(...args){if(p.uTimes.length<2000)p.uTimes.push(args[1]);return uniform.apply(this,args);};
 WebGLRenderingContext.prototype.texImage2D=function(...args){const image=args.at(-1);if(image instanceof HTMLImageElement)p.textures.push({src:image.src,crossOrigin:image.crossOrigin,natural:[image.naturalWidth,image.naturalHeight]});return texture.apply(this,args);};
 const fx=CanvasRenderingContext2D.prototype.drawImage;
 CanvasRenderingContext2D.prototype.drawImage=function(image,...args){if(image?.src?.includes('/bird-')&&args.length===2){const m=this.getTransform(),r=this.canvas.getBoundingClientRect(),x=args[0]+image.naturalWidth*.68,y=args[1]+image.naturalHeight*.82;p.bird={x:r.left+(m.a*x+m.c*y+m.e)*r.width/this.canvas.width,y:r.top+(m.b*x+m.d*y+m.f)*r.height/this.canvas.height,src:image.src,at:performance.now()};}return fx.call(this,image,...args);};
 const ac=window.AudioContext?.prototype,osc=ac?.createOscillator;
 if(osc)ac.createOscillator=function(...args){p.oscillators++;return osc.apply(this,args);};
 const set=Storage.prototype.setItem;
 Storage.prototype.setItem=function(...args){p.storageWrites.push(args[0]);return set.apply(this,args);};
 const fetch=window.fetch;
 window.fetch=function(url,options){p.fetches.push({url:String(url),mode:options?.mode,credentials:options?.credentials});return fetch.call(this,url,options);};
})();'''

SNAP = r'''() => {
 const c=document.querySelector('#home-01'),im=c.querySelector('picture img'),r=c.getBoundingClientRect(),layer=c.querySelector('.hero-live-layer');
 return {diagnostics:window.HomeLiving?.diagnostics(),status:window.SiteStatus?.snapshot?.(),phase:document.body.dataset.statusPhase,hidden:document.hidden,overflow:document.documentElement.scrollWidth>innerWidth+1,
  plate:{src:im.currentSrc,width:im.naturalWidth,height:im.naturalHeight,complete:im.complete,crossOrigin:im.crossOrigin,alt:im.alt,describedBy:im.getAttribute('aria-describedby'),objectFit:getComputedStyle(im).objectFit},
  container:{x:r.x,y:r.y,width:r.width,height:r.height,ratio:r.width/r.height},layer:{ariaHidden:layer?.getAttribute('aria-hidden'),pointerEvents:layer&&getComputedStyle(layer).pointerEvents,z:layer&&getComputedStyle(layer).zIndex,focusables:layer?.querySelectorAll('a,button,input,[tabindex]').length},
  links:[...c.querySelectorAll('.hotspot')].map(a=>{const q=a.getBoundingClientRect();return {text:a.getAttribute('aria-label'),href:a.getAttribute('href'),x:q.x,y:q.y,width:q.width,height:q.height,z:getComputedStyle(a.closest('.overlays')).zIndex,hit:document.elementFromPoint(q.x+q.width/2,q.y+q.height/2)===a};}),
  screenText:layer?.querySelector('[data-hl="screen"]')?.textContent,probe:window.__livingProbe,mp4Elements:document.querySelectorAll('video').length,
  sources:[...document.querySelectorAll('#home-02 img,#home-03 img')].map(i=>({src:i.currentSrc,crossOrigin:i.crossOrigin}))};
}'''


def fixture(mode):
    data = live.fixture('normal')
    if mode == 'warn':
        data['automation']['items'][0].update(state='failed', mine=True)
    elif mode == 'unreadable':
        data['automation'] = {'state': 'unavailable'}
    elif mode == 'stale':
        data['automation'].update(state='stale', observed_at=live.iso(time.time() - 3600))
    elif mode == 'partial':
        data['hardware']['cpu']['sources']['temperature_celsius']['status'] = 'unavailable'
    elif mode == 'hardware_old':
        for group in [data['hardware']['cpu'], data['hardware']['memory'], data['hardware']['network'], data['hardware']['display'], *data['hardware']['gpus'], *data['hardware']['volumes']]:
            for source in group['sources'].values():
                source['observed_at_unix'] = time.time() - 3600
    return data


async def verify_real_hidden(page, device):
    await page.evaluate("()=>{const f=document.createElement('iframe');f.id='hidden-probe-frame';Object.assign(f.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',zIndex:'99999'});f.src=location.href;document.body.append(f);}")
    await page.wait_for_function("document.querySelector('#hidden-probe-frame').contentWindow.HomeLiving?.diagnostics().phase==='live'", timeout=40000)
    await page.wait_for_timeout(2700)
    await page.evaluate("()=>{const f=document.querySelector('#hidden-probe-frame');window.__oldHomeDoc=f.contentDocument;window.__oldHomeMount=f.contentWindow.HomeLiving;window.__oldHomeVisibility=[];__oldHomeDoc.addEventListener('visibilitychange',()=>__oldHomeVisibility.push(__oldHomeDoc.hidden));}")
    before = await page.evaluate('window.__oldHomeMount.diagnostics()')
    assert before['frameGuard']['intervals'] > 0, before
    await page.evaluate("document.querySelector('#hidden-probe-frame').src='about:blank'")
    await page.wait_for_timeout(500)
    hidden = await page.evaluate('({hidden:__oldHomeDoc.hidden,events:__oldHomeVisibility,diagnostics:__oldHomeMount.diagnostics()})')
    await page.wait_for_timeout(700)
    after = await page.evaluate('__oldHomeMount.diagnostics()')
    assert hidden['hidden'] and True in hidden['events'] and hidden['diagnostics']['paused']
    assert after['frames'] == hidden['diagnostics']['frames'] and after['frameGuard']['intervals'] == 0
    await page.evaluate("document.querySelector('#hidden-probe-frame').remove()")
    return {'device': device, 'case': 'real-old-document-hidden-pauses-clears-existing-guard-stops-frames',
            'before': before, 'hidden': hidden, 'after': after, 'assigned_hidden': False}


def static_check(args):
    manifest = json.loads((args.release_root / 'release-manifest.json').read_text('utf8'))
    preparation = json.loads(args.preparation.read_text('utf8'))
    original = json.loads((args.baseline / 'release-manifest.json').read_text('utf8'))
    actual = {p.relative_to(args.release_root).as_posix(): {'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'bytes': p.stat().st_size}
              for p in args.release_root.rglob('*') if p.is_file() and p.name != 'release-manifest.json'}
    assert actual == manifest['files']
    changed = [rel for rel, value in original['files'].items() if actual.get(rel) != value]
    assert changed == ['index.html'], changed
    for rel, value in preparation['package_files'].items():
        assert actual['_shared/home-living/' + rel] == value
    html = (args.release_root / 'index.html').read_text('utf8')
    data = json.loads(re.search(r'<script\b[^>]*id="page-data"[^>]*>(.*?)</script>', html, re.S)[1])
    assert data['home_living'] is True and data['video']['mount_allowed'] is False
    assert data['video']['src'] == preparation['rollback']['original_video']['src']
    for key in ['h', 'v']:
        assert data['screens'][0]['layouts'][key]['links'] == preparation['rollback']['original_first_layouts'][key]['links']
    return {'candidate_rid': manifest['release_id'], 'exact_files': len(actual), 'html_count': sum(p.endswith('.html') for p in actual),
            'changed_existing': changed, 'package_original_hashes_match': True, 'link_fields_unchanged': True}


def guard_probes(engine: str):
    """Execute the real package's guard function with explicit timestamp inputs.

    This is a program boundary probe, not CPU/rendering performance evidence.
    """
    guard = engine[engine.index('const GUARD ='):engine.index('function schedule()')]
    harness = '''let time=2000,last=0,active=true,guardEligibleAt=2000,guardTrigger=null;
const performance={now:()=>time},shared={scrollingUntil:0},V={manual:false},S={frozen:null};
const shouldRun=()=>active;let stops=[],logs=[];const stop=why=>stops.push(why),console={info:x=>logs.push(x)};
'''
    code = '''const run=new Function('gaps','excluded', ''' + json.dumps(harness + guard + '''
if(excluded==='hidden')active=false;if(excluded==='scroll')shared.scrollingUntil=20000;if(excluded==='startup')guardEligibleAt=20000;
checkFrameGuard(time);if(excluded==='crossed-scroll')shared.scrollingUntil=time+1500;
for(const gap of gaps){time+=gap;if(checkFrameGuard(time))break;}
return {trigger:guardTrigger,stops,logs};''') + ''');
const cases=[['single-long',[2500,...Array(400).fill(16)],null,false],['two-long',[2500,2500,...Array(400).fill(16)],null,true],['short-slow',Array(22).fill(180),null,false],['sustained-slow',Array(50).fill(180),null,true],['exact-100ms',Array(80).fill(100),null,false],['over-100ms',Array(80).fill(101),null,true],['long-total-4500',[1500,1500,1500],null,false],['long-total-exact-5000',[1500,1500,2000],null,true],['past-fast-then-stall',[...Array(400).fill(16),6000],null,true],['scroll-tail-crossed',[3000,2500],'crossed-scroll',false],['scroll-excluded',Array(70).fill(180),'scroll',false],['hidden-excluded',Array(70).fill(180),'hidden',false],['startup-excluded',Array(70).fill(180),'startup',false]];
const results=cases.map(([name,gaps,excluded,expected])=>{const value=run(gaps,excluded);if(Boolean(value.trigger)!==expected)throw Error(name);
 if(value.trigger&&(value.trigger.rule!=='slow-median'||value.trigger.windowMs<5000||value.trigger.medianFPS>=10))throw Error(name+' violates the visible five-second median rule');
 return {name,expected_trigger:expected,...value};});process.stdout.write(JSON.stringify(results));'''
    result = subprocess.run(['node', '-e', code], text=True, capture_output=True, encoding='utf8', check=True)
    return json.loads(result.stdout)


async def run(args):
    args.output_dir.mkdir(parents=True, exist_ok=True)
    args.temp_dir.mkdir(parents=True, exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = str(args.temp_dir)
    checks = static_check(args)
    engine_file = next((args.release_root / '_shared/home-living').glob('hero-live.*.js'))
    checks['program_guard_probes'] = guard_probes(engine_file.read_text('utf8'))
    nonce = secrets.token_hex(16)
    state = {'mode': 'normal', 'status_requests': 0, 'writes': [], 'external_blocked': [], 'mp4_requests': [], 'missing': [], 'asset_failure': False}
    root = args.release_root.resolve()
    responses, results, page_errors, console = [], [], [], []
    profiles = []

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_):
            pass

        def do_GET(self):
            path = unquote(urlsplit(self.path).path)
            status, mime = 200, 'application/json; charset=utf-8'
            if path == '/__nonce':
                body = nonce.encode()
            elif path == '/__status':
                state['status_requests'] += 1
                status = 503 if state['mode'] == 'offline' else 200
                body = json.dumps(fixture(state['mode']), ensure_ascii=False).encode()
            else:
                rel = path.lstrip('/') + ('index.html' if path.endswith('/') else '')
                target = (root / rel).resolve()
                if target.is_relative_to(root) and target.is_file():
                    body = target.read_bytes()
                    mime = mimetypes.guess_type(str(target))[0] or 'application/octet-stream'
                    if state['asset_failure'] and '/home-living/' in path and ('nobird' in path or '.json' in path):
                        status, body = 503, b'fixture-load-failure'
                else:
                    status, body = 404, b'fixture-not-found'
                    state['missing'].append(path)
            self.send_response(status)
            self.send_header('Content-Type', mime)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Access-Control-Allow-Origin', 'https://wly0829.cn')
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.end_headers()
            self.wfile.write(body)

    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{server.server_port}'
    owned_server = {'port': server.server_port, 'nonce': nonce, 'root': str(root)}
    response_tasks = []
    try:
        async with async_playwright() as pw:
            for device, options in [('desktop', {'viewport': {'width': 1440, 'height': 900}}),
                                    ('xiaomi', {'viewport': {'width': 412, 'height': 915}, 'device_scale_factor': 3.5, 'is_mobile': True, 'has_touch': True,
                                               'user_agent': 'Mozilla/5.0 (Linux; Android 15; Xiaomi 15 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36'})]:
                profile = args.temp_dir / device
                profiles.append(profile)
                context = await pw.chromium.launch_persistent_context(str(profile), executable_path=str(args.chrome), headless=True,
                    timezone_id='America/Chicago', args=['--no-first-run', '--no-default-browser-check'], **options)
                await context.add_init_script(OBSERVE)

                async def route(rr):
                    request = rr.request
                    url = urlsplit(request.url)
                    if request.method not in ['GET', 'HEAD', 'OPTIONS']:
                        state['writes'].append(request.url)
                        return await rr.abort()
                    if url.path.endswith('.mp4'):
                        state['mp4_requests'].append(request.url)
                        return await rr.abort()
                    if url.hostname == 'mcp.wly0829.cn' and '/status' in url.path:
                        path = '/__status'
                    elif url.hostname == 'wly0829.cn':
                        path = url.path
                    else:
                        state['external_blocked'].append(request.url)
                        return await rr.abort()
                    try:
                        response = await request.frame.page.context.request.get(base + path, timeout=20000)
                        return await rr.fulfill(response=response)
                    except Exception:
                        # A context shutdown can cancel already-started requests.
                        try:
                            return await rr.abort('aborted')
                        except Exception:
                            return

                await context.route('**/*', route)
                page = context.pages[0]
                page.on('pageerror', lambda error: page_errors.append(str(error)))
                page.on('console', lambda message: console.append({'device': device, 'type': message.type, 'text': message.text}))

                async def bind_response(response, device=device):
                    url = urlsplit(response.url)
                    if url.hostname == 'wly0829.cn' and (url.path.endswith(('.js', '.css', '.json', '.webp', '.avif'))):
                        try:
                            body = await response.body()
                            rel = url.path.lstrip('/')
                            target = root / rel
                            actual = hashlib.sha256(body).hexdigest()
                            expected = hashlib.sha256(target.read_bytes()).hexdigest() if target.is_file() else None
                            responses.append({'device': device, 'url': response.url, 'status': response.status, 'sha256': actual, 'candidate_sha256': expected, 'candidate_match': actual == expected})
                        except Exception as error:
                            responses.append({'device': device, 'url': response.url, 'error': str(error)})
                page.on('response', lambda response: response_tasks.append(asyncio.create_task(bind_response(response))))

                async def load(mode='normal', reduce=False, failure=False):
                    state.update(mode=mode, asset_failure=failure)
                    await page.emulate_media(reduced_motion='reduce' if reduce else 'no-preference')
                    await page.goto('https://wly0829.cn/', wait_until='domcontentloaded')
                    await page.wait_for_function("window.HomeLiving", timeout=40000)
                    await page.evaluate('HomeLiving.ready')
                    await page.wait_for_function("['ready','error'].includes(document.body.dataset.statusPhase)")
                    await page.evaluate('document.fonts.ready')
                    await page.wait_for_timeout(350)
                    return await page.evaluate(SNAP)

                before_requests = state['status_requests']
                normal = await load()
                assert normal['diagnostics']['phase'] == 'live', normal
                assert normal['status']['overall']['state'] == 'ok', normal['status']
                assert state['status_requests'] - before_requests == 1, state
                assert normal['plate']['crossOrigin'] is None and normal['plate']['objectFit'] == 'fill'
                expected_dim = [2880, 1621] if device == 'desktop' else [1280, 2227]
                assert [normal['plate']['width'], normal['plate']['height']] == expected_dim
                assert abs(normal['container']['ratio'] - expected_dim[0]/expected_dim[1]) < .0001
                assert normal['layer'] == {'ariaHidden': 'true', 'pointerEvents': 'none', 'z': '0', 'focusables': 0}
                assert normal['mp4Elements'] == 0 and not normal['overflow']
                assert all(i['crossOrigin'] is None for i in normal['sources'])
                assert all(t['crossOrigin'] == 'anonymous' and 'nobird' in t['src'] for t in normal['probe']['textures'])
                configs = [f for f in normal['probe']['fetches'] if 'hero-live.config.' in f['url']]
                assert configs and configs[0]['mode'] == 'cors' and configs[0]['credentials'] == 'omit'
                await page.wait_for_timeout(2200)
                advancing = await page.evaluate(SNAP)
                assert advancing['diagnostics']['frames'] > normal['diagnostics']['frames'] + 20
                assert advancing['probe']['draws'] > normal['probe']['draws'] + 20
                assert len(set(advancing['probe']['uTimes'])) > 20
                results.append({'device': device, 'case': 'first-paint-active-gl-actual-draw-progression-single-reader', 'snapshot': advancing})
                if args.hidden_only:
                    results.append(await verify_real_hidden(page, device))
                    await context.close()
                    continue

                for mode, expected in [('warn', 'warn'), ('offline', 'off'), ('unreadable', 'off'), ('stale', 'warn'), ('partial', 'off'), ('hardware_old', 'off')]:
                    snap = await load(mode)
                    assert snap['status']['overall']['state'] == expected, (mode, snap['status'])
                    assert snap['status']['overall']['title'] == ('有事要处理' if expected == 'warn' else '暂时读不到电脑')
                    if mode == 'unreadable':
                        assert '电脑在线' in snap['status']['overall']['detail'] and '自动任务暂时读不到' in snap['status']['overall']['detail']
                    if mode == 'stale':
                        assert '自动任务的记录没有及时更新' in snap['status']['overall']['detail']
                    results.append({'device': device, 'case': mode, 'status': snap['status'], 'diagnostics': snap['diagnostics']})

                reduced = await load(reduce=True)
                assert reduced['diagnostics']['reason'] == 'reduced-motion' and reduced['probe']['draws'] == 0
                frozen = reduced['diagnostics']['frames']
                state['mode'] = 'warn'
                await page.evaluate('SiteStatus.refresh()')
                await page.wait_for_timeout(1200)
                reduced_after = await page.evaluate(SNAP)
                assert reduced_after['diagnostics']['frames'] == frozen and reduced_after['status']['overall']['state'] == 'warn'
                assert '有事要处理' in reduced_after['screenText']
                clock_before = await page.evaluate("[...document.querySelectorAll('#home-01 .rl')].map(e=>e.style.transform)")
                await page.evaluate("window.__originalNow=Date.now;Date.now=()=>window.__originalNow()+60000")
                await page.wait_for_timeout(1200)
                clock_after = await page.evaluate("[...document.querySelectorAll('#home-01 .rl')].map(e=>e.style.transform)")
                assert clock_after != clock_before
                await page.evaluate('Date.now=window.__originalNow')
                results.append({'device': device, 'case': 'reduced-motion-static-status-updates', 'snapshot': reduced_after})
                results.append({'device': device, 'case': 'reduced-motion-minute-only-clock-update-program-clock', 'before': clock_before, 'after': clock_after})

                fallback = await load(failure=True)
                assert fallback['diagnostics']['phase'] == 'static' and fallback['diagnostics']['reason'] == 'config-error'
                assert fallback['plate']['complete'] and fallback['plate']['width'] > 0 and len(fallback['links']) == 3
                results.append({'device': device, 'case': 'configuration-failure-readable-static-fallback', 'snapshot': fallback})

                await load()
                await page.wait_for_timeout(2800)
                links = page.locator('#home-01 .hotspot')
                for index in range(await links.count()):
                    link = links.nth(index)
                    await link.scroll_into_view_if_needed()
                    await link.focus()
                    assert await link.evaluate("a=>a===document.activeElement")
                    await page.keyboard.press('Tab')
                    assert not await page.evaluate("document.activeElement.closest('.hero-live-layer')!==null")
                    await link.focus()
                    await link.evaluate("a=>{window.__clickedHomeLink=null;a.addEventListener('click',e=>{e.preventDefault();window.__clickedHomeLink=e.target.closest('a')===a;},{once:true});}")
                    await link.click()
                    assert await page.evaluate('window.__clickedHomeLink')
                results.append({'device': device, 'case': 'unchanged-hotspot-targets-tab-focus-click', 'links': (await page.evaluate(SNAP))['links']})

                await page.evaluate("scrollTo({top:0,behavior:'instant'})")
                await page.wait_for_timeout(1700)
                native_audio = False
                attempts = []
                await page.evaluate("window.__livingProbe.clicks=[];document.querySelector('#home-01').addEventListener('click',e=>window.__livingProbe.clicks.push({x:e.clientX,y:e.clientY,target:e.target.className}))")
                for _ in range(60):
                    point = await page.evaluate('window.__livingProbe.bird')
                    if point and 0 <= point['y'] <= options['viewport']['height'] and not any(name in point['src'] for name in ['hop', 'crouch']):
                        before = await page.evaluate('window.__livingProbe.oscillators')
                        attempts.append(point)
                        await page.mouse.click(point['x'], point['y'])
                        await page.wait_for_timeout(100)
                        if await page.evaluate('window.__livingProbe.oscillators') > before:
                            native_audio = True
                            break
                    await page.wait_for_timeout(160)
                if not native_audio:
                    results.append({'device':device,'case':'bird-audio-debug','attempts':attempts,'snapshot':await page.evaluate(SNAP),'clicks':await page.evaluate('window.__livingProbe.clicks'),'audio_available':await page.evaluate('Boolean(window.AudioContext)')})
                assert native_audio, 'Bird native AudioContext chirp was not reached'
                results.append({'device': device, 'case': 'bird-click-original-native-audio', 'oscillators': await page.evaluate('window.__livingProbe.oscillators')})

                await page.evaluate("document.querySelector('#home-05').scrollIntoView({behavior:'instant'})")
                await page.wait_for_timeout(500)
                offscreen = await page.evaluate('HomeLiving.diagnostics()')
                assert offscreen['paused']
                await page.wait_for_timeout(650)
                assert (await page.evaluate('HomeLiving.diagnostics()'))['frames'] == offscreen['frames']
                await page.evaluate("scrollTo({top:0,behavior:'instant'})")
                await page.wait_for_timeout(2400)
                resumed = await page.evaluate('HomeLiving.diagnostics()')
                assert not resumed['paused'] and resumed['frames'] > offscreen['frames']
                results.append({'device': device, 'case': 'offscreen-pauses-and-resumes', 'paused': offscreen, 'resumed': resumed})

                # Navigating a same-origin iframe exposes the old real Document's
                # hidden state. Keep the original mount reference for observation.
                cdp = await context.new_cdp_session(page)
                results.append(await verify_real_hidden(page, device))

                if device == 'xiaomi':
                    await page.set_viewport_size({'width': 915, 'height': 412})
                    await page.wait_for_function("HomeLiving.diagnostics().orientation==='landscape'&&HomeLiving.diagnostics().phase==='live'")
                    landscape = await page.evaluate(SNAP)
                    assert landscape['plate']['width'] == 2880 and not landscape['overflow']
                    results.append({'device': device, 'case': 'rotate-landscape-real-plate-and-gl', 'snapshot': landscape})
                    await page.set_viewport_size({'width': 412, 'height': 915})
                    await page.wait_for_function("HomeLiving.diagnostics().orientation==='portrait'&&HomeLiving.diagnostics().phase==='live'")

                for rate, seconds in [(4, 12), (20, 16)]:
                    await cdp.send('Emulation.setCPUThrottlingRate', {'rate': rate})
                    await load()
                    await page.wait_for_timeout(seconds * 1000)
                    slowed = await page.evaluate(SNAP)
                    if rate == 4:
                        assert slowed['diagnostics']['phase'] == 'live' and not slowed['diagnostics']['frameGuard']['trigger']
                    results.append({'device': device, 'case': f'natural-cpu-{rate}x', 'duration_seconds': seconds, 'snapshot': slowed, 'artificial_busy_wait': False})
                await cdp.send('Emulation.setCPUThrottlingRate', {'rate': 1})
                assert not await page.evaluate('window.__livingProbe.storageWrites.length'), 'Homepage wrote browser storage'
                await context.close()
            await asyncio.gather(*response_tasks, return_exceptions=True)
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
        owned_server['stopped'] = not thread.is_alive()
        cleanups = []
        for profile in profiles:
            if profile.exists():
                command = ['pwsh', '-NoProfile', '-File', 'E:\\.agents\\tools\\Move-TaskItemToRecycleBin.ps1', '-LiteralPath', str(profile.resolve()), '-AllowedRoot', str(args.temp_dir.resolve()), '-Json']
                result = subprocess.run(command, text=True, capture_output=True, encoding='utf8')
                cleanups.append({'path': str(profile), 'exit_code': result.returncode, 'receipt': result.stdout, 'error': result.stderr})
        receipt = {'schema': 'wly.home-living-browser.v1', 'observed_at_beijing': datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(),
            'checks': checks, 'chrome': str(args.chrome), 'synthetic_only': True, 'no_screenshots': True, 'no_recordings': True,
            'server': owned_server, 'traffic': state, 'results': results, 'responses': responses, 'console': console, 'page_errors': page_errors, 'profile_cleanup': cleanups}
        (args.output_dir / 'browser-results.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    assert not page_errors, page_errors
    assert not state['writes'] and not state['mp4_requests'], state
    assert all(r.get('candidate_match') for r in responses if r.get('status') == 200), 'Browser response bytes differ from candidate'
    assert owned_server['stopped']
    print(json.dumps({'candidate_rid': checks['candidate_rid'], 'cases': len(results), 'page_errors': len(page_errors), 'mp4_requests': len(state['mp4_requests']), 'status_requests': state['status_requests'], 'synthetic_only': True}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release-root', type=Path, required=True)
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--preparation', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path, required=True)
    parser.add_argument('--temp-dir', type=Path, required=True)
    parser.add_argument('--chrome', type=Path, default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    parser.add_argument('--hidden-only', action='store_true', help='Focused real-hidden/guard-window supplement on the unchanged candidate')
    asyncio.run(run(parser.parse_args()))

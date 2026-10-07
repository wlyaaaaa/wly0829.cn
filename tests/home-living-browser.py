"""Actual approved engine on a complete local release, using isolated Chrome.

All business records are synthetic. The second loopback origin exercises CORS;
it does not establish an OSS upload or production CORS verification.
"""
from __future__ import annotations
import argparse
import asyncio
from datetime import datetime, timezone, timedelta
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
import os
from pathlib import Path
import re
import subprocess
import threading
import time
from urllib.parse import unquote, urlsplit
from playwright.async_api import async_playwright

BJT = timezone(timedelta(hours=8))
OBSERVE = r'''(() => {
 window.__homeProbe={draws:0,times:[],intros:[],textures:[],fetches:[],oscillators:0};
 const p=__homeProbe,draw=WebGLRenderingContext.prototype.drawArrays;
 WebGLRenderingContext.prototype.drawArrays=function(...a){p.draws++;return draw.apply(this,a);};
 const uniform=WebGLRenderingContext.prototype.uniform1f,locations=new WeakMap(),location=WebGLRenderingContext.prototype.getUniformLocation;
 let sceneId=0;
 WebGLRenderingContext.prototype.getUniformLocation=function(program,name){const value=location.call(this,program,name);if(value)locations.set(value,name);return value;};
 WebGLRenderingContext.prototype.uniform1f=function(...a){if(p.times.length<3000)p.times.push(a[1]);if(locations.get(a[0])==='u_it'&&p.intros.length<2000){const layer=this.canvas.closest('.hero-live-layer');if(layer&&!layer.dataset.probeScene)layer.dataset.probeScene=String(++sceneId);p.intros.push({it:a[1],at:performance.now(),scene:layer?.dataset.probeScene,visible:layer&&getComputedStyle(layer).visibility!=='hidden'});}return uniform.apply(this,a);};
 const texture=WebGLRenderingContext.prototype.texImage2D;
 WebGLRenderingContext.prototype.texImage2D=function(...a){const im=a.at(-1);if(im instanceof HTMLImageElement)p.textures.push({src:im.src,crossOrigin:im.crossOrigin});return texture.apply(this,a);};
 const fetch=window.fetch;window.fetch=function(url,opts){p.fetches.push({url:String(url),mode:opts?.mode,credentials:opts?.credentials});return fetch.call(this,url,opts);};
 const audio=window.AudioContext?.prototype,oscillator=audio?.createOscillator;
 if(oscillator)audio.createOscillator=function(...a){p.oscillators++;return oscillator.apply(this,a);};
})();'''
SNAP = r'''() => {
 const c=document.querySelector('#home-01'),im=c.querySelector('picture img'),layer=c.querySelector('.hero-live-layer'),r=c.getBoundingClientRect();
 return {diagnostics:HomeLiving.diagnostics(),status:SiteStatus.snapshot(),phase:document.body.dataset.statusPhase,
  ratio:r.width/r.height,plate:{src:im.currentSrc,width:im.naturalWidth,height:im.naturalHeight,complete:im.complete,crossOrigin:im.crossOrigin,fit:getComputedStyle(im).objectFit},
  layer:{ariaHidden:layer?.getAttribute('aria-hidden'),pointerEvents:layer&&getComputedStyle(layer).pointerEvents,z:layer&&getComputedStyle(layer).zIndex,focusables:layer?.querySelectorAll('a,button,input,[tabindex]').length},
  overflow:document.documentElement.scrollWidth>innerWidth+1,videoNodes:document.querySelectorAll('video').length,
  links:[...c.querySelectorAll('.hotspot')].map(a=>({href:a.getAttribute('href'),label:a.getAttribute('aria-label')})),
  comicImages:[...document.querySelectorAll('#home-02 img,#home-03 img')].map(im=>im.crossOrigin),
  screenText:layer?.querySelector('[data-hl="screen"]')?.textContent,probe:__homeProbe};
}'''


def fixture(mode):
    now = time.time()
    block = lambda: {'state': 'empty', 'observed_at_unix': now, 'observed_at': datetime.now(BJT).isoformat(), 'max_age_seconds': 120, 'items': []}
    row = lambda **kw: {'state': 'ok', 'observed_at_unix': now, **kw}
    raw = {'observed_at_unix': now, 'served_at_unix': now, 'max_age_seconds': 120,
           **{key: block() for key in ['automation', 'backups', 'projects', 'pending', 'today', 'remote_network', 'backup_inventory']},
           'personal_data': {'state': 'locked', 'observed_at_unix': now}, 'unrestricted': {'state': 'inactive', 'observed_at_unix': now},
           'host': {'screen_state': 'unlocked', 'sources': {'screen_state': {'status': 'ok', 'observed_at_unix': now}}},
           'display_cache': {'collectors': {key: {'state': 'ready', 'observed_at_unix': now} for key in ['dashboard', 'hardware', 'authorization']}},
           'hardware': {'state': 'ok', 'cpu': row(model='合成处理器', usage_percent=10, temperature_celsius=40, power_watts=20),
                        'memory': row(used_bytes=16*1024**3, total_bytes=64*1024**3),
                        'network': row(connected=True, download_bytes_per_second=100, upload_bytes_per_second=50),
                        'display': row(width_px=1440, height_px=900, refresh_hz=60), 'gpus': [],
                        'volumes': [row(letter='C:', free_bytes=50*1024**3, total_bytes=100*1024**3, connected=True)]}}
    if mode == 'warn':
        raw['automation']['state'] = 'ok'
        raw['automation']['items'] = [{'enabled': True, 'state': 'failed', 'consecutive_failures': 4, 'mine': True, 'plain': {'name': '合成任务'}}]
    elif mode.startswith('unreadable'):
        age = 300 if mode == 'unreadable-5m' else 900
        raw['automation'] = {'state': 'unavailable', 'unavailable_since_unix': now-age}
    elif mode == 'stale':
        raw['automation'].update(state='stale', observed_at_unix=now-1000, observed_at=datetime.fromtimestamp(now-1000, BJT).isoformat())
    return raw


async def run(args):
    root, output = args.release.resolve(), args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    profiles = output/'profiles'
    profiles.mkdir(exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = str(output)
    state = {'mode': 'normal', 'cross': False, 'delay_h': False, 'requests': [], 'status_reads': 0, 'writes': [], 'blocked': [], 'missing': [], 'mp4': []}
    errors, consoles, results, cleanup = [], [], [], []
    asset_base = ''

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_):
            pass

        def do_GET(self):
            path = unquote(urlsplit(self.path).path)
            status, mime = 200, 'application/json; charset=utf-8'
            if path == '/__status':
                state['status_reads'] += 1
                status = 503 if state['mode'] == 'offline' else 200
                body = json.dumps(fixture(state['mode']), ensure_ascii=False).encode()
            else:
                rel = path.lstrip('/') + ('index.html' if path.endswith('/') else '')
                target = (root/rel).resolve()
                if target.is_relative_to(root) and target.is_file():
                    if state['delay_h'] and 'plate-h-white-nobird' in rel:
                        time.sleep(.3)
                    body = target.read_bytes()
                    mime = mimetypes.guess_type(str(target))[0] or 'application/octet-stream'
                    if state['cross'] and rel == 'index.html':
                        body = body.replace(b'/_shared/home-living/', (asset_base+'/_shared/home-living/').encode())
                else:
                    status, body = 404, b'fixture-not-found'
                    state['missing'].append(path)
            self.send_response(status)
            self.send_header('Content-Type', mime)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Access-Control-Allow-Origin', self.headers.get('Origin', '*'))
            self.send_header('Vary', 'Origin')
            self.send_header('Cache-Control', 'public, max-age=600')
            self.end_headers()
            try:
                self.wfile.write(body)
            except ConnectionError:
                pass  # Browser intentionally cancels obsolete orientation loads.

    servers = [ThreadingHTTPServer(('127.0.0.1', 0), Handler) for _ in range(2)]
    threads = [threading.Thread(target=server.serve_forever, daemon=True) for server in servers]
    for thread in threads:
        thread.start()
    base = f'http://127.0.0.1:{servers[0].server_port}'
    asset_base = f'http://127.0.0.1:{servers[1].server_port}'
    try:
        async with async_playwright() as pw:
            for device, opts in [('desktop', {'viewport': {'width': 1440, 'height': 900}}),
                                 ('xiaomi', {'viewport': {'width': 412, 'height': 915}, 'device_scale_factor': 3.5, 'is_mobile': True, 'has_touch': True})]:
                if args.device and args.device != device:
                    continue
                context = await pw.chromium.launch_persistent_context(str(profiles/device), executable_path=str(args.chrome), headless=True,
                    timezone_id='America/Chicago', args=['--no-first-run', '--no-default-browser-check'], **opts)
                await context.add_init_script(OBSERVE)
                page = context.pages[0]
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('console', lambda m, device=device: consoles.append({'device': device, 'type': m.type, 'text': m.text}))

                async def route(rr):
                    request = rr.request
                    state['requests'].append(request.url)
                    if request.method not in ['GET', 'HEAD', 'OPTIONS']:
                        state['writes'].append(request.url)
                        return await rr.abort()
                    if urlsplit(request.url).path.endswith('.mp4'):
                        state['mp4'].append(request.url)
                        return await rr.abort()
                    if request.url.startswith((base+'/', asset_base+'/')):
                        return await rr.continue_()
                    state['blocked'].append(request.url)
                    return await rr.abort()
                await context.route('**/*', route)
                cdp = await context.new_cdp_session(page)

                async def load(mode='normal', reduced=False, cross=False):
                    state.update(mode=mode, cross=cross)
                    if page.url.startswith(base):
                        await page.evaluate("localStorage.removeItem('site-cockpit-read-gaps-v1')")
                    await page.emulate_media(reduced_motion='reduce' if reduced else 'no-preference')
                    await page.goto(base+'/', wait_until='domcontentloaded')
                    await page.wait_for_function('window.HomeLiving && window.SiteStatus?.snapshot', timeout=40000)
                    await page.evaluate('HomeLiving.ready')
                    await page.evaluate("scrollTo({top:0,behavior:'instant'})")
                    await page.wait_for_function("['ready','error'].includes(document.body.dataset.statusPhase)", timeout=20000)
                    await page.wait_for_timeout(450)
                    return await page.evaluate(SNAP)

                # First load through real, distinct HTTP origins: config fetch and
                # anonymous GL textures must work after a plain static image fetch.
                initial_reads = state['status_reads']
                first = await load(cross=True)
                assert first['status']['overall']['state'] == 'ok', first
                assert state['status_reads'] == initial_reads+1, state
                assert first['diagnostics']['phase'] == 'live', first
                expected = [2880, 1621] if device == 'desktop' else [1280, 2227]
                assert [first['plate']['width'], first['plate']['height']] == expected
                assert abs(first['ratio']-expected[0]/expected[1]) < .0001
                assert first['plate']['fit'] == 'fill' and first['plate']['crossOrigin'] is None
                assert first['layer'] == {'ariaHidden': 'true', 'pointerEvents': 'none', 'z': '0', 'focusables': 0}
                assert not first['overflow'] and first['videoNodes'] == 0
                assert all(value is None for value in first['comicImages'])
                assert first['probe']['textures'] and all(x['crossOrigin'] == 'anonymous' for x in first['probe']['textures'])
                config = next(x for x in first['probe']['fetches'] if 'hero-live.config.' in x['url'])
                assert config['mode'] == 'cors' and config['credentials'] == 'omit'
                await page.wait_for_timeout(3200)
                running = await page.evaluate(SNAP)
                assert running['diagnostics']['frames'] > first['diagnostics']['frames']+20
                assert running['probe']['draws'] > first['probe']['draws']+20
                assert len(set(running['probe']['times'])) > 20
                assert any(x['visible'] and x['it'] < 6.5 for x in running['probe']['intros'])
                assert any(x['it'] >= 6.5 for x in running['probe']['intros'])
                results.append({'device': device, 'case': 'cross-origin-white-plate-real-gl-single-reader', 'snapshot': running})
                if device == 'desktop':
                    # Screen crop only, no full-size image or full-page screenshot.
                    await page.locator('#home-01 .hero-live-layer [data-hl="screen"]').screenshot(path=str(output/'desktop-screen-crop.png'), scale='css')

                # True click dispatch and keyboard focus stay on the original links.
                for link in await page.locator('#home-01 .hotspot').all():
                    await link.focus()
                    assert await link.evaluate('a=>a===document.activeElement')
                    await link.evaluate("a=>a.addEventListener('click',e=>{e.preventDefault();window.__clicked=a.href;},{once:true})")
                    await link.click()
                    assert await page.evaluate('__clicked') == await link.get_attribute('href') or await page.evaluate('__clicked') == base+await link.get_attribute('href')
                results.append({'device': device, 'case': 'all-original-hotspots-focus-click', 'links': running['links']})

                for mode, expected_state in [('warn', 'warn'), ('unreadable-5m', 'ok'), ('unreadable-15m', 'warn'), ('stale', 'warn'), ('offline', 'off')]:
                    snap = await load(mode)
                    assert snap['status']['overall']['state'] == expected_state, (mode, snap)
                    if mode.startswith('unreadable'):
                        assert '自动任务暂时读不到' in snap['status']['overall']['detail']
                    if mode == 'offline':
                        assert snap['status']['overall']['title'] == '暂时读不到电脑'
                    results.append({'device': device, 'case': mode, 'status': snap['status']})

                reduced = await load(reduced=True)
                assert reduced['diagnostics']['reason'] == 'reduced-motion' and reduced['probe']['draws'] == 0
                await page.wait_for_timeout(1200)
                reduced_after = await page.evaluate(SNAP)
                assert reduced_after['diagnostics']['frames'] == reduced['diagnostics']['frames']
                results.append({'device': device, 'case': 'reduced-motion-static', 'snapshot': reduced_after})

                await load()
                await page.wait_for_timeout(6000)
                if device in ['desktop', 'xiaomi']:
                    alternate = {'width': 915, 'height': 412} if device == 'xiaomi' else {'width': 412, 'height': 915}
                    original_viewport = opts['viewport']
                    alternate_orientation = 'landscape' if device == 'xiaomi' else 'portrait'
                    original_orientation = 'portrait' if device == 'xiaomi' else 'landscape'
                    before = await page.evaluate('HomeLiving.diagnostics()')
                    await page.set_viewport_size(alternate)
                    try:
                        await page.wait_for_function("o=>HomeLiving.diagnostics().orientation===o&&HomeLiving.diagnostics().phase==='live'", arg=alternate_orientation)
                    except Exception:
                        results.append({'device': device, 'case': 'rotation-failure', 'snapshot': await page.evaluate(SNAP), 'viewport': await page.evaluate("({width:innerWidth,height:innerHeight,portrait:matchMedia('(orientation:portrait)').matches,scrollY})")})
                        raise
                    await page.set_viewport_size(original_viewport)
                    await page.wait_for_function("o=>HomeLiving.diagnostics().orientation===o&&HomeLiving.diagnostics().phase==='live'", arg=original_orientation)
                    after = await page.evaluate(SNAP)
                    assert not after['overflow'] and len(await page.locator('#home-01 .hero-live-layer').all()) == 1
                    assert before['orientationSkips'] == 0 and after['diagnostics']['orientationSkips'] == 2
                    assert after['probe']['oscillators'] == 0
                    assert all(not x['visible'] or x['it'] >= 6.5 for x in after['probe']['intros'] if x['scene'] != '1')
                    results.append({'device': device, 'case': 'rotate-both-ways-one-layer-no-replay', 'before': before, 'after': after['diagnostics']})
                    state['delay_h'] = True
                    await page.set_viewport_size(alternate)
                    await page.wait_for_timeout(60)
                    await page.set_viewport_size(original_viewport)
                    await page.wait_for_timeout(1000)
                    final_rotate = await page.evaluate(SNAP)
                    assert final_rotate['diagnostics']['orientation'] == original_orientation and final_rotate['diagnostics']['phase'] == 'live'
                    assert len(await page.locator('#home-01 .hero-live-layer').all()) == 1
                    assert final_rotate['probe']['oscillators'] == 0
                    assert all(not x['visible'] or x['it'] >= 6.5 for x in final_rotate['probe']['intros'] if x['scene'] != '1')
                    state['delay_h'] = False
                    results.append({'device': device, 'case': 'rapid-rotation-late-old-assets-do-not-cover-new-scene', 'snapshot': final_rotate['diagnostics']})
                    if device == 'xiaomi':
                        await page.locator('#home-01 .hero-live-layer [data-hl="screen"]').screenshot(path=str(output/'xiaomi-screen-crop.png'), scale='css')

                await cdp.send('Emulation.setCPUThrottlingRate', {'rate': 4})
                await load()
                await page.wait_for_timeout(14000)
                slowed = await page.evaluate(SNAP)
                assert slowed['diagnostics']['phase'] == 'live' and not slowed['diagnostics']['frameGuard']['trigger'], slowed
                results.append({'device': device, 'case': 'real-4x-cpu-no-insurance', 'snapshot': slowed})
                await cdp.send('Emulation.setCPUThrottlingRate', {'rate': 1})
                await page.locator('#home-05').scroll_into_view_if_needed()
                await page.wait_for_timeout(500)
                paused = await page.evaluate('HomeLiving.diagnostics()')
                await page.wait_for_timeout(500)
                assert paused['paused'] and (await page.evaluate('HomeLiving.diagnostics()'))['frames'] == paused['frames']
                results.append({'device': device, 'case': 'offscreen-paused', 'snapshot': paused})
                await context.close()
    finally:
        for server in servers:
            server.shutdown()
            server.server_close()
        for thread in threads:
            thread.join(timeout=5)
        for profile in profiles.iterdir():
            done = subprocess.run(['pwsh', '-NoProfile', '-File', 'E:/.agents/tools/Move-TaskItemToRecycleBin.ps1', '-LiteralPath', str(profile), '-AllowedRoot', str(profiles), '-Json'], capture_output=True, text=True, encoding='utf8')
            cleanup.append({'path': str(profile), 'exit_code': done.returncode, 'receipt': done.stdout, 'stderr': done.stderr})
        receipt = {'observed_at_beijing': datetime.now(BJT).isoformat(), 'chrome': str(args.chrome), 'synthetic_only': True,
                   'release_root': str(root), 'results': results, 'page_errors': errors, 'console': consoles,
                   'traffic': state, 'servers_stopped': all(not t.is_alive() for t in threads), 'profile_cleanup': cleanup,
                   'cross_origin_scope': 'real loopback HTTP origins, not an OSS readback'}
        (output/'browser-results.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    assert not errors, errors
    assert not state['writes'] and not state['mp4'], state
    assert not state['missing'], state['missing']
    assert not any('/assets/home-01-' in url for url in state['requests']), 'Old dark plate was requested'
    assert all(item['exit_code'] == 0 for item in cleanup), cleanup
    print(json.dumps({'cases': len(results), 'page_errors': len(errors), 'mp4_requests': len(state['mp4']), 'servers_stopped': receipt['servers_stopped']}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--chrome', type=Path, default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    parser.add_argument('--device', choices=['desktop', 'xiaomi'])
    asyncio.run(run(parser.parse_args()))

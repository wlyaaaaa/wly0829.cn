"""Headless installed-Chrome regressions against a loopback fixture/static server.

The virtual public origin exercises the unchanged origin gate. Status and graph
responses come only from this local server. No POST or external login is used.
"""
import argparse
import asyncio
import copy
import datetime
import json
import mimetypes
import os
from pathlib import Path
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit

from playwright.async_api import async_playwright


def iso(stamp):
    return datetime.datetime.fromtimestamp(stamp, datetime.timezone.utc).isoformat()


def fixture(mode):
    now = time.time()
    block = lambda rows: {'state': 'ok' if rows else 'empty', 'items': rows, 'observed_at': iso(now), 'max_age_seconds': 120}
    sample = lambda values: {**values, 'state': 'ok', 'sources': {key: {'status': 'ok', 'observed_at_unix': now} for key in values}}
    result = {
        'observed_at_unix': now, 'status': 'pass', 'state_version': 'local-fixture', 'default_minutes': 1440,
        'host': {'screen_state': 'unlocked', 'uptime_seconds': 7200},
        'personal_data': {'state': 'unlocked', 'expires_at_unix': now + 90000}, 'unrestricted': {'state': 'inactive'},
        'factor': {'available': False}, 'public_actions': {},
        'automation': block([{'id': 'task-fixture', 'project': 'AI 命令行配置', 'mine': True, 'enabled': True, 'group': '日常维护', 'state': 'success', 'plain': {'name': 'AI 工具升级观察', 'what': '本地模拟观察', 'stop': '本地测试没有启用任务', 'impact': '不影响真实电脑'}, 'last_run_at': '2026-09-28T10:30:00+08:00', 'next_run_at': '2026-10-06T10:30:00+08:00', 'runs_today': False}]),
        'backups': block([{'id': 'task-fixture-backup', 'name': '中文备份', 'project': '本地模拟项目', 'enabled': True, 'state': 'success', 'cadence': 'daily', 'last_success_at': '2026-09-28T10:30:00+08:00'}]),
        'projects': block([{'project': 'AI 命令行配置', 'state': 'ok', 'run_health': 'ok', 'overview': 'ok', 'failed_count': 0, 'waiting_user_count': 0, 'waiting_ai_count': 0, 'on_hold_count': 0}, {'project': '两台电脑剪贴板同步', 'state': 'ok', 'run_health': 'ok', 'overview': 'ok'}]),
        'pending': block([]), 'today': block([]),
        'grafana': {'state': 'reachable', 'checked_at': iso(now), 'public_dashboard_state': 'reachable', 'public_dashboard_url': 'https://local-graph.invalid/panel', 'url': 'https://local-graph.invalid/panel'},
        'hardware': {'state': 'ok', 'cpu': sample({'model': '模拟处理器', 'usage_percent': 12, 'temperature_celsius': 40, 'power_watts': 30}), 'gpus': [sample({'model': '模拟显卡', 'usage_percent': 10, 'temperature_celsius': 40, 'vram_used_bytes': 1024**3, 'vram_total_bytes': 8*1024**3})], 'memory': sample({'used_bytes': 8*1024**3, 'total_bytes': 32*1024**3}), 'network': sample({'connected': True, 'download_bytes_per_second': 0, 'upload_bytes_per_second': 0}), 'display': sample({'width_px': 1440, 'height_px': 1000, 'refresh_hz': 60}), 'volumes': [sample({'letter': 'E:', 'free_bytes': 100*1024**3, 'total_bytes': 200*1024**3, 'connected': True})]}
    }
    if mode == 'project_failed':
        result['projects']['items'][0].update(failed_count=1, overview='run_failed', health_reason='最近运行失败')
    if mode == 'project_unknown':
        result['projects']['state'] = 'unavailable'
    if mode == 'hardware_unknown':
        result['hardware'] = {'state': 'unavailable'}
    if mode == 'hardware_partial':
        result['hardware']['cpu']['sources']['temperature_celsius']['status'] = 'unavailable'
    if mode == 'backup_failed':
        result['backups']['items'][0]['state'] = 'failed'
    if mode == 'watch_failed':
        result['automation']['items'][0].update(state='failed', last_run_at=iso(now-60))
    if mode == 'changed':
        result['automation']['items'][0]['last_run_at'] = iso(now-120)
        result['hardware']['cpu']['usage_percent'] = 17
    if mode == 'stale':
        for key in ['automation', 'backups', 'projects', 'pending', 'today']:
            result[key]['observed_at'] = iso(now-3600)
    return result


async def main(args):
    args.output_dir.mkdir(parents=True, exist_ok=True)
    args.temp_dir.mkdir(parents=True, exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = str(args.temp_dir)
    state = {'mode': 'normal', 'graph_requests': 0, 'status_requests': 0, 'blocked_writes': [], 'missing': []}
    real = json.loads(args.real_fixture.read_text('utf8')) if args.real_fixture else None

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_):
            pass

        def do_GET(self):
            path = unquote(urlsplit(self.path).path)
            status, mime, body = 200, 'text/html; charset=utf-8', b''
            if path == '/__status':
                state['status_requests'] += 1
                mode = state['mode']
                if mode == 'slow':
                    time.sleep(4)
                status = 503 if mode == 'failure' else 200
                body = json.dumps(real if mode == 'real' else fixture(mode), ensure_ascii=False).encode()
                mime = 'application/json; charset=utf-8'
            elif path == '/__graph':
                state['graph_requests'] += 1
                body = b'<!doctype html><html><body>local graph fixture</body></html>'
            else:
                rel = path.lstrip('/') + ('index.html' if path.endswith('/') else '')
                candidates = [args.release_root / rel, args.fallback_root / rel]
                target = next((p for p in candidates if p.is_file()), None)
                if target:
                    body = target.read_bytes()
                    mime = mimetypes.guess_type(str(target))[0] or 'application/octet-stream'
                else:
                    status = 404
                    state['missing'].append(path)
            self.send_response(status)
            self.send_header('Content-Type', mime)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Access-Control-Allow-Origin', 'https://wly0829.cn')
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.end_headers()
            self.wfile.write(body)

    class Server(ThreadingHTTPServer):
        request_queue_size = 256
    server = Server(('127.0.0.1', 0), Handler)
    worker = threading.Thread(target=server.serve_forever, daemon=True)
    worker.start()
    base = f'http://127.0.0.1:{server.server_port}'
    results, console_errors, page_errors = [], [], []
    try:
        async with async_playwright() as pw:
            for device, options in [('desktop', {'viewport': {'width': 1440, 'height': 1000}}), ('xiaomi-portrait', {'viewport': {'width': 412, 'height': 915}, 'device_scale_factor': 3.5, 'is_mobile': True, 'has_touch': True, 'user_agent': 'Mozilla/5.0 (Linux; Android 15; Xiaomi 15 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36'})]:
                context = await pw.chromium.launch_persistent_context(str(args.temp_dir / device), executable_path=str(args.chrome), headless=True, timezone_id='America/Chicago', **options)

                async def route(request_route):
                    request = request_route.request
                    if request.method not in ['GET', 'HEAD', 'OPTIONS']:
                        state['blocked_writes'].append(request.url)
                        return await request_route.abort()
                    url = urlsplit(request.url)
                    if url.hostname == 'mcp.wly0829.cn' and '/status' in url.path:
                        path = '/__status'
                    elif url.hostname == 'local-graph.invalid':
                        path = '/__graph'
                    elif url.hostname == 'wly0829.cn':
                        path = url.path
                    else:
                        return await request_route.abort()
                    response = await context.request.get(base + path, timeout=20000)
                    await request_route.fulfill(response=response)

                await context.route('**/*', route)
                page = context.pages[0]
                page.on('pageerror', lambda e: page_errors.append(str(e)))
                page.on('console', lambda m: console_errors.append(m.text) if m.type == 'error' else None)

                async def load(path, mode, clear=True):
                    state['mode'] = mode
                    if clear and page.url.startswith('https://wly0829.cn'):
                        await page.evaluate('localStorage.clear()')
                    await page.goto('https://wly0829.cn' + path, wait_until='domcontentloaded')
                    if path == '/cockpit/':
                        await page.wait_for_function("window.SiteB2 && document.body.dataset.b2StatusPhase === 'ready'")
                    else:
                        await page.wait_for_function("window.SiteStatus && document.body.dataset.statusPhase === 'ready'")
                    await page.evaluate('document.fonts.ready')
                    await page.wait_for_timeout(80)
                    return await snap()

                async def snap():
                    return await page.evaluate("""()=>({phase:document.body.dataset.b2StatusPhase||document.body.dataset.statusPhase,overflow:document.documentElement.scrollWidth>innerWidth+1,slots:[...document.querySelectorAll('[data-b2-slot],.typeset-live')].filter(e=>e.getClientRects().length).map(e=>({slot:e.dataset.b2Slot||e.dataset.slot,state:e.dataset.state,text:e.textContent,cached:e.dataset.cached,width:e.clientWidth,height:e.clientHeight,scrollWidth:e.scrollWidth,scrollHeight:e.scrollHeight,font:getComputedStyle(e).fontSize,overflowX:getComputedStyle(e).overflowX,textFits:(()=>{const s=e.querySelector('span');if(!s)return null;const a=e.getBoundingClientRect(),b=s.getBoundingClientRect();return b.left>=a.left+1&&b.right<=a.right-1&&b.top>=a.top+1&&b.bottom<=a.bottom-1;})()}))})""")

                def slot(snapshot, name):
                    return next(x for x in snapshot['slots'] if x['slot'] == name)

                normal = await load('/cockpit/', 'normal')
                assert not normal['overflow'], (device, 'document overflow')
                assert '[object Object]' not in slot(normal, 'cockpit-pc')['text']
                assert 'E:：' in slot(normal, 'cockpit-pc')['text']
                backups = slot(normal, 'cockpit-backups')
                assert '中文备份 · 正常' in backups['text'] and '每天' in backups['text'] and '9月28日 10:30' in backups['text']
                assert slot(normal, 'cockpit-overall')['state'] == 'ok'
                results.append({'device': device, 'case': 'LC-01/02/05', 'snapshot': normal})

                for mode, key, expected in [('project_failed', 'cockpit-overall', 'error'), ('project_unknown', 'cockpit-overall', 'unknown'), ('hardware_unknown', 'cockpit-pc', 'unknown'), ('hardware_partial', 'cockpit-pc', 'unknown'), ('backup_failed', 'cockpit-backups', 'error'), ('stale', 'cockpit-tasks', 'unknown')]:
                    snapshot = await load('/cockpit/', mode)
                    assert slot(snapshot, key)['state'] == expected, (mode, slot(snapshot, key))
                    if mode == 'stale':
                        assert '上次读到' in slot(snapshot, key)['text'] and 'AI 工具升级观察' in slot(snapshot, key)['text']
                    results.append({'device': device, 'case': mode, 'snapshot': snapshot})

                await load('/cockpit/', 'normal')
                details = page.locator('[data-b2-slot="cockpit-tasks"] details').first
                await details.locator('summary').first.click()
                await page.evaluate("window.savedDetail=document.querySelector('[data-b2-slot=cockpit-tasks] details');window.savedFrame=document.querySelector('[data-b2-slot=cockpit-grafana] iframe')")
                before = state['graph_requests']
                if device == 'desktop':
                    await page.wait_for_timeout(16000)
                state['mode'] = 'changed'
                await page.evaluate('window.SiteB2.refresh()')
                await page.wait_for_timeout(400)
                retention = await page.evaluate("({detailSame:window.savedDetail===document.querySelector('[data-b2-slot=cockpit-tasks] details'),open:window.savedDetail.open,frameSame:window.savedFrame===document.querySelector('[data-b2-slot=cockpit-grafana] iframe')})")
                assert retention == {'detailSame': True, 'open': True, 'frameSame': True}, retention
                assert state['graph_requests'] == before, (before, state['graph_requests'])
                results.append({'device': device, 'case': 'LC-06', 'retention': retention, 'graph_requests_added': state['graph_requests']-before})

                state['mode'] = 'failure'
                await page.evaluate('window.SiteB2.refresh()')
                await page.wait_for_function("document.body.dataset.b2StatusPhase === 'error'")
                cached = await snap()
                assert '中文备份' in slot(cached, 'cockpit-backups')['text'] and '上次读到' in slot(cached, 'cockpit-backups')['text']
                assert slot(cached, 'cockpit-backups')['state'] != 'ok'
                results.append({'device': device, 'case': 'cache-error', 'snapshot': cached})
                await page.reload(wait_until='domcontentloaded')
                await page.wait_for_function("window.SiteB2 && document.body.dataset.b2StatusPhase === 'error'")
                cached_reload = await snap()
                assert '中文备份' in slot(cached_reload, 'cockpit-backups')['text'] and '上次读到' in slot(cached_reload, 'cockpit-backups')['text']
                results.append({'device': device, 'case': 'cache-reload', 'snapshot': cached_reload})

                watch = await load('/projects/ai-cli-profile-manager/', 'watch_failed')
                await page.locator('.typeset-live[data-slot="watch"]').scroll_into_view_if_needed()
                await page.wait_for_timeout(100)
                watch = await snap()
                watch_slot = slot(watch, 'watch')
                assert watch_slot['state'] == 'failed' and '失败' in watch_slot['text']
                assert watch_slot['textFits'] and watch_slot['overflowX'] == 'visible', watch_slot
                results.append({'device': device, 'case': 'LC-07/09', 'snapshot': watch})
                if device == 'xiaomi-portrait':
                    await page.set_viewport_size({'width': 915, 'height': 412})
                    await page.wait_for_timeout(500)
                    landscape = await snap()
                    assert not landscape['overflow']
                    results.append({'device': 'xiaomi-landscape', 'case': 'LC-09', 'snapshot': landscape})
                    await page.set_viewport_size({'width': 412, 'height': 915})

                if real:
                    actual = await load('/cockpit/', 'real')
                    text = ' '.join(x['text'] for x in actual['slots'])
                    assert '[object Object]' not in text and 'task-' not in text
                    assert 'Codex 记录备份' in text
                    results.append({'device': device, 'case': 'real-response-replay', 'snapshot': actual})
                await context.close()
    finally:
        server.shutdown()
        server.server_close()
    receipt = {'schema': 'website.live-fix-browser.v1', 'observed_at_beijing': datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(), 'chrome': str(args.chrome), 'local_server': base, 'results': results, 'console_errors': console_errors, 'page_errors': page_errors, 'server': state, 'no_screenshots': True}
    (args.output_dir / 'browser-results.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2), encoding='utf8')
    assert not page_errors, page_errors
    assert not state['blocked_writes'], state['blocked_writes']
    print(json.dumps({'cases': len(results), 'page_errors': len(page_errors), 'console_errors': len(console_errors), 'missing': len(state['missing'])}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--release-root', type=Path, required=True)
    parser.add_argument('--fallback-root', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path, required=True)
    parser.add_argument('--temp-dir', type=Path, required=True)
    parser.add_argument('--chrome', type=Path, required=True)
    parser.add_argument('--real-fixture', type=Path)
    asyncio.run(main(parser.parse_args()))

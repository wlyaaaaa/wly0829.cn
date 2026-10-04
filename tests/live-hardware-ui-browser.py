"""Focused hardware component acceptance in the installed Chrome, with no writes.

Serves only this repo's component/model and prepared local icon assets. Optional
--fixture is a public hardware/host projection captured by an authorized GET.
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
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit
from playwright.async_api import async_playwright

STAMP = 1791076800


def fixture():
    def sample(values):
        return {**values, 'sources': {key: {'status': 'ok', 'observed_at_unix': STAMP, 'source': '本地测试读数'} for key in values}}
    return {'observed_at_unix': STAMP, 'host': {'screen_state': 'unlocked'}, 'hardware': {
        'cpu': sample({'model': '模拟处理器', 'usage_percent': 48.5, 'temperature_celsius': 64, 'power_watts': 128, 'cores': 16, 'threads': 32}),
        'gpus': [sample({'model': '模拟显卡', 'usage_percent': 12, 'temperature_celsius': 40, 'power_watts': 109.8, 'vram_used_bytes': 8 * 1024**3, 'vram_total_bytes': 32 * 1024**3})],
        'memory': sample({'type': 'DDR5', 'used_bytes': 44 * 1024**3, 'total_bytes': 61.6 * 1024**3, 'installed_bytes': 64 * 1024**3, 'data_rate_mt_s': 6200}),
        'volumes': [sample({'letter': 'C:', 'type': 'ssd', 'free_bytes': 80 * 1024**3, 'total_bytes': 600 * 1024**3, 'connected': True}), sample({'letter': 'E:', 'type': 'ssd', 'free_bytes': 8 * 1024**3, 'total_bytes': 100 * 1024**3, 'connected': True}), sample({'letter': 'G:', 'type': 'hdd', 'free_bytes': 4 * 1024**3, 'total_bytes': 100 * 1024**3, 'connected': True})],
        'network': sample({'model': '模拟网卡', 'connection_type': 'ethernet', 'link_speed_bps': 2.5e9, 'download_bytes_per_second': 0, 'upload_bytes_per_second': 256 * 1024}),
        'display': sample({'model': '模拟主屏', 'width_px': 2880, 'height_px': 1800, 'refresh_hz': 60})}}


HTML = '''<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>电脑实时卡片组件验收</title><link rel="stylesheet" href="/scripts/live-hardware-ui.css"><style>
:root{--title:#0a7232;--text:#2e4675;--accent:#0a7a33;--line:#bfe8cc;--cardbg:#fbfefc;--soft:#edfbf3}*{box-sizing:border-box}body{margin:0;background:white;font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;color:var(--text);padding:24px}main{max-width:1120px;margin:auto}h1{font-size:28px;color:var(--title);margin:0 0 20px}.preview-compact{margin-top:28px;max-width:650px}#full,#compact{min-width:0}@media(max-width:600px){body{padding:16px}h1{font-size:24px}}@font-face{font-family:"Local Sans";src:url('/local-font.ttf')}body{font-family:"Local Sans","Microsoft YaHei",sans-serif}
</style><main><h1>电脑现在</h1><div id="full"></div><div class="preview-compact"><h1>授权页 · 电脑摘要</h1><div id="compact"></div></div></main><script src="/scripts/live-hardware-ui.js"></script><script type="module">
import {adaptStatus} from '/app/computer-access-model.js';
window.renderHardware=(snapshot,options={},raw=false)=>{window.testSnapshot=snapshot;for(const mode of ['full','compact'])document.getElementById(mode).replaceChildren(LiveHardwareUI.render(document,raw?snapshot:adaptStatus(snapshot),{...options,mode}));};
window.updateHardware=(snapshot,options={})=>{const sync=(parent,desired)=>{const old=[...parent.childNodes],used=new Set();for(let i=0;i<desired.length;i++){const wanted=desired[i],key=wanted.nodeType===1?wanted.dataset.rowKey:null;let node=key?old.find(x=>!used.has(x)&&x.nodeType===1&&x.dataset.rowKey===key):old[i];if(!node||used.has(node)||node.nodeType!==wanted.nodeType||node.nodeName!==wanted.nodeName)node=wanted;else if(node.nodeType===3){if(node.nodeValue!==wanted.nodeValue)node.nodeValue=wanted.nodeValue;}else{for(const a of [...node.attributes])if(a.name!=='open'&&!wanted.hasAttribute(a.name))node.removeAttribute(a.name);for(const a of [...wanted.attributes])if(a.name!=='open'&&node.getAttribute(a.name)!==a.value)node.setAttribute(a.name,a.value);sync(node,[...wanted.childNodes]);}used.add(node);if(parent.childNodes[i]!==node)parent.insertBefore(node,parent.childNodes[i]||null);}for(const node of [...parent.childNodes])if(!used.has(node))node.remove();};for(const mode of ['full','compact'])sync(document.getElementById(mode),[LiveHardwareUI.render(document,adaptStatus(snapshot),{...options,mode})]);};
window.hardwareReady=true;</script></html>'''


async def run(args):
    args.output.mkdir(parents=True, exist_ok=True)
    args.temp.mkdir(parents=True, exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = os.environ['TMPDIR'] = str(args.temp)
    requests, errors, console_errors = [], [], []
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_): pass
        def do_GET(self):
            path = unquote(urlsplit(self.path).path)
            requests.append({'method': 'GET', 'path': path})
            if path == '/': body, mime = HTML.encode('utf8'), 'text/html; charset=utf-8'
            else:
                if path == '/local-font.ttf': target = Path('C:/Windows/Fonts/NotoSansSC-VF.ttf')
                elif path.startswith('/assets/'): target = args.assets / path.lstrip('/')
                else: target = args.repo / path.lstrip('/')
                if not target.is_file(): self.send_error(404); return
                body, mime = target.read_bytes(), mimetypes.guess_type(str(target))[0] or 'application/octet-stream'
            self.send_response(200); self.send_header('Content-Type', mime); self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body)
        def do_POST(self):
            requests.append({'method': 'POST', 'path': self.path}); self.send_error(405)
    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    origin = f'http://127.0.0.1:{server.server_port}'
    result = []
    try:
        async with async_playwright() as pw:
            for device, dimensions in [('desktop', {'width': 1440, 'height': 1000}), ('xiaomi-portrait', {'width': 412, 'height': 915})]:
                context = await pw.chromium.launch_persistent_context(str(args.temp / device), executable_path=str(args.chrome), headless=True, viewport=dimensions, device_scale_factor=3.5 if device == 'xiaomi-portrait' else 1, is_mobile=device != 'desktop', has_touch=device != 'desktop', timezone_id='America/Chicago')
                await context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(origin) and route.request.method in ['GET', 'HEAD'] else route.abort())
                page = context.pages[0]
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('console', lambda message: console_errors.append(message.text) if message.type == 'error' else None)
                await page.goto(origin, wait_until='networkidle'); await page.wait_for_function('window.hardwareReady'); await page.evaluate('document.fonts.ready')
                async def render(snapshot, options=None, raw=False):
                    await page.evaluate('([s,o,r])=>renderHardware(s,o,r)', [snapshot, {'now': snapshot.get('observed_at_unix', STAMP), **(options or {})}, raw])
                    await page.evaluate('Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))')
                    return await page.evaluate("""()=>({overflow:document.documentElement.scrollWidth>innerWidth,fullText:document.querySelector('#full').textContent,compactText:document.querySelector('#compact').textContent,link:document.querySelector('.live-hardware-compact').getAttribute('href'),brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),rowKeys:[...document.querySelector('#full').querySelectorAll('[data-row-key]')].map(i=>i.dataset.rowKey),risks:[...document.querySelectorAll('.live-hardware-disk')].map(i=>({key:i.dataset.rowKey,risk:i.dataset.risk,fill:getComputedStyle(i.querySelector('.live-hardware-meter-fill')).backgroundColor}))})""")
                source = fixture()
                normal = await render(source)
                assert not normal['overflow'] and not normal['brokenImages'], normal
                assert '48.5%' in normal['fullText'] and '2.5 Gbps' in normal['fullText'] and '2880 × 1800' in normal['fullText']
                assert '0 KiB/s' in normal['fullText'] and 'G: 剩余4%' in normal['compactText'] and normal['link'] == '/cockpit/#pc'
                assert len(normal['rowKeys']) == len(set(normal['rowKeys'])), 'duplicate stable keys'
                assert [d['risk'] for d in normal['risks']] == ['ok', 'warn', 'error']
                await page.locator('.live-hardware-compact').focus()
                assert await page.evaluate("document.activeElement.matches('.live-hardware-compact')"), 'compact link is not keyboard reachable'
                await page.screenshot(path=str(args.output / (device + '-full-and-compact.png')), full_page=True)
                raw = await render(source, raw=True)
                assert raw['fullText'] == normal['fullText'], 'raw/adapted display differs'
                result.append({'device': device, 'case': 'raw-and-adapted-normal', 'snapshot': normal})
                partial = copy.deepcopy(source); partial['hardware']['cpu']['sources']['temperature_celsius']['status'] = 'unavailable'; partial['hardware']['network']['sources']['download_bytes_per_second']['status'] = 'unknown'
                await render(partial)
                assert await page.locator('[data-field=cpu-temperature-value]').inner_text() == '读不到'
                assert await page.locator('[data-field=network-download-value]').inner_text() == '读不到'
                stale = copy.deepcopy(source); stale['hardware']['cpu']['sources']['temperature_celsius'].update(status='stale', observed_at_unix=STAMP-600)
                await render(stale)
                assert '上次' in await page.locator('[data-field=cpu-temperature-value]').inner_text()
                assert await page.locator('[data-field=cpu-usage]').get_attribute('data-state') == 'ok', 'one stale field tainted fresh fields'
                await page.screenshot(path=str(args.output / (device + '-partial-stale.png')), full_page=True)
                cached = await render(source, {'cached': True})
                assert '上次读到' in cached['fullText'] and '电脑当前读不到' in cached['compactText'] and '北京时间' in cached['compactText']
                unknown = await render({'observed_at_unix': STAMP, 'hardware': {'state': 'unavailable'}})
                assert '读不到' in unknown['fullText'] and not unknown['overflow'] and '0%' not in unknown['fullText']
                await page.screenshot(path=str(args.output / (device + '-unknown.png')), full_page=True)
                result.append({'device': device, 'case': 'source-unknown-stale-and-cache', 'cached': cached, 'unknown': unknown})
                separated = copy.deepcopy(source)
                separated.update(observed_at_unix=STAMP, served_at_unix=STAMP, hardware_observed_at_unix=STAMP-600,
                    display_cache={'collectors': {'authorization': {'state': 'ready', 'observed_at_unix': STAMP}, 'hardware': {'state': 'error', 'observed_at_unix': STAMP-600}}})
                for group in [separated['hardware']['cpu'], *separated['hardware']['gpus'], separated['hardware']['memory'], *separated['hardware']['volumes'], separated['hardware']['network'], separated['hardware']['display']]:
                    for source_item in group['sources'].values(): source_item['observed_at_unix'] = STAMP-600
                separate_result = await render(separated, {'now': STAMP})
                assert '电脑在线' in separate_result['compactText'] and '上次读到' in separate_result['compactText']
                assert await page.locator('[data-field=cpu-usage]').get_attribute('data-state') == 'stale'
                assert await page.locator('#compact [data-field=hardware-screen-state]').get_attribute('data-state') == 'ok', 'hardware cache tainted current Windows observation'
                assert '09:10:00' in await page.locator('#full [data-row-key=hardware-read-time]').inner_text()
                assert '09:10:00' in await page.locator('[data-row-key=cpu-read-time]').inner_text()
                warming = {'observed_at_unix': STAMP, 'served_at_unix': STAMP, 'display_cache': {'collectors': {'hardware': {'state': 'reading', 'observed_at_unix': None}}}, 'hardware': {}}
                await render(warming)
                assert await page.locator('#full [data-row-key=hardware-read-time]').inner_text() == '读取时间未知'
                result.append({'device': device, 'case': 'independent-collectors-cannot-refresh-old-hardware', 'snapshot': separate_result})
                await render(source)
                await page.locator('[data-row-key=cpu-details] summary').click()
                await page.evaluate("window.savedDetails=document.querySelector('[data-row-key=cpu-details]');window.savedCpu=document.querySelector('[data-field=cpu-usage]')")
                changed = copy.deepcopy(source); changed['hardware']['cpu']['usage_percent'] = 0
                await page.evaluate('s=>updateHardware(s,{now:s.observed_at_unix})', changed)
                retention = await page.evaluate("({same:window.savedDetails===document.querySelector('[data-row-key=cpu-details]'),open:window.savedDetails.open,numberSame:window.savedCpu===document.querySelector('[data-field=cpu-usage]'),value:window.savedCpu.textContent})")
                assert retention == {'same': True, 'open': True, 'numberSame': True, 'value': '0%'}, retention
                result.append({'device': device, 'case': 'sync-retains-details-and-zero', 'retention': retention})
                if args.fixture:
                    actual = json.loads(args.fixture.read_text('utf8'))
                    replay = await render(actual)
                    assert not replay['overflow'] and '[object Object]' not in replay['fullText'], replay
                    await page.screenshot(path=str(args.output / (device + '-real-hardware-replay.png')), full_page=True)
                    result.append({'device': device, 'case': 'real-hardware-projection-replay', 'snapshot': replay, 'observation_unix': actual['observed_at_unix']})
                await context.close()
    finally:
        server.shutdown(); server.server_close()
    receipt = {'schema': 'website.live-hardware-component.browser.v1', 'observed_at_beijing': datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(), 'chrome': str(args.chrome), 'cases': result, 'requests': requests, 'page_errors': errors, 'console_errors': console_errors, 'integrated_site_acceptance': False}
    (args.output / 'browser-results.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2), encoding='utf8')
    assert not errors and not console_errors, (errors, console_errors)
    assert all(request['method'] == 'GET' for request in requests), requests
    print(json.dumps({'cases': len(result), 'page_errors': len(errors), 'console_errors': len(console_errors), 'post_requests': sum(r['method'] == 'POST' for r in requests)}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--assets', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--temp', type=Path, required=True)
    parser.add_argument('--fixture', type=Path)
    parser.add_argument('--chrome', type=Path, default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    asyncio.run(run(parser.parse_args()))

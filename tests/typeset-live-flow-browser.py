"""Prepare an inspectable local candidate and verify its actual project pages in installed Chrome.

Raster and static assets retain their original public URLs. Only the owned
layout functions and shared status sources are patched into a hashed candidate
app. Computer responses are fictional fixtures; no actual operation is sent.
"""
import argparse
import asyncio
import datetime
import hashlib
import importlib.util
import json
import mimetypes
import os
from pathlib import Path
import re
import time
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw
from playwright.async_api import async_playwright


DATA = re.compile(r'(<script\b[^>]*id="page-data"[^>]*>)(.*?)(</script>)', re.S)


def load_module(name, file):
    spec = importlib.util.spec_from_file_location(name, file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def prepare(args):
    root = Path(__file__).resolve().parents[1]
    candidate = args.output / 'candidate'
    candidate.mkdir(parents=True, exist_ok=True)
    update = load_module('flow_update', root / 'scripts/update-live-release.py')
    source = (root / 'scripts/typeset-layout.js').read_text('utf8')
    helper = source[source.index('/* typeset-live-flow-v1 */'):source.index('/* end-typeset-live-flow-v1 */')]
    start = source.index('function installTypeset(section,screen){')
    install = source[start:source.index('function fitTypesetShot(', start)]
    ui = (root / 'scripts/live-status-ui.js').read_text('utf8')
    css = (root / 'scripts/typeset-layout.css').read_text('utf8') + '\n' + (root / 'scripts/live-status-ui.css').read_text('utf8')
    css_name = 'flow-' + hashlib.sha256(css.encode()).hexdigest()[:20] + '.css'
    (candidate / css_name).write_text(css, 'utf8')
    icons, icon_files = {}, {}
    for key, name in {'status': '笔记本电脑.png', 'backup': '硬盘循环.png', 'cloud': '云对勾.png', 'acceptance': '打勾清单.png', 'watch': '日历时钟.png', 'health': '工具箱.png'}.items():
        source_icon = args.icons_root / name
        digest = hashlib.sha256(source_icon.read_bytes()).hexdigest()
        url = '/__flow-icon/' + key + '-' + digest[:12] + '.png'
        icons[key] = url
        icon_files[url] = source_icon
    pages, apps, manifest = [], {}, {}
    for file in (args.release_root).rglob('*.html'):
        html = file.read_text('utf8')
        match = DATA.search(html)
        if not match:
            continue
        data = json.loads(match[2])
        if data.get('kind') != 'project' or not any(part.get('live') for screen in data.get('screens', []) for part in screen.get('parts', [])):
            continue
        scripts = re.findall(r'<script\b[^>]*src="([^"]+)"', html)
        app = next(url for url in scripts if '/app-' in url)
        if app not in apps:
            existing = args.output / ('baseline-app-' + hashlib.sha256(app.encode()).hexdigest()[:16] + '.js')
            if not existing.exists():
                existing.write_bytes(urlopen(Request(app, headers={'Referer': 'https://wly0829.cn/', 'User-Agent': 'Mozilla/5.0 Chrome/154.0.0.0'}), timeout=60).read())
            baseline = existing.read_text('utf8')
            patched = update.patch_shared_runtime(baseline)
            start = patched.index('function installTypeset(section,screen){')
            end = patched.index('function fitTypesetShot(', start)
            patched = ui + '\n' + patched[:start] + helper + '\n' + install + patched[end:]
            name = 'flow-app-' + hashlib.sha256(patched.encode()).hexdigest()[:20] + '.js'
            (candidate / name).write_text(patched, 'utf8')
            apps[app] = '/' + name
        html = html.replace(app, apps[app]).replace('</head>', '<link rel="stylesheet" href="/' + css_name + '"></head>')
        data.setdefault('shared', {})['live_status_icons'] = icons
        html = DATA.sub(lambda item: item[1] + json.dumps(data, ensure_ascii=False).replace('</', r'<\/') + item[3], html, count=1)
        relative = file.relative_to(args.release_root)
        output = candidate / relative
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(html, 'utf8')
        route = '/' + relative.as_posix().removesuffix('index.html')
        pages.append({'route': route, 'project': data.get('project'), 'page': data.get('page'), 'screens': [screen['id'] for screen in data.get('screens', []) if any(p.get('live') for p in screen.get('parts', []))]})
    # Verify the shared helper against the actual large PC blank-frame raster,
    # without executing B2 operations or changing its production renderer.
    cockpit = json.loads(DATA.search((args.release_root / 'cockpit/index.html').read_text('utf8'))[2])
    hardware_test = load_module('flow_hardware_fixture', root / 'tests/live-hardware-ui-browser.py')
    hardware = (root / 'scripts/live-hardware-ui.js').read_text('utf8')
    hardware_css = (root / 'scripts/live-hardware-ui.css').read_text('utf8')
    large = {}
    for screen in cockpit['screens']:
        for part in screen['parts']:
            cell = next((cell for cell in part.get('native_live', []) if cell['slot'] == 'cockpit-pc'), None)
            if not cell:
                continue
            orientation = part['orientation']
            path = '/__flow-large-' + orientation + '/'
            extra = '''
              *{box-sizing:border-box}body{margin:0;background:white;font-family:"Noto Sans SC",sans-serif}
              .paper{width:calc(100% - 48px);max-width:1392px;margin:auto}
              .typeset-live-flow-cards>div{background:#fbfefc;padding:12px;border:1px solid #bfe8cc;border-radius:12px}
              @media(max-width:767px){.paper{width:100%}}
            '''
            html = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css + hardware_css + extra + '</style></head><body><main class="paper"><section class="screen typeset-screen" data-screen="large-frame-proof"><div class="typeset-part" id="large-host"><picture><img src="' + part['src'] + '" width="' + str(part['size'][0]) + '" height="' + str(part['size'][1]) + '"></picture><div class="overlays"></div></div></section></main><script>' + helper + '\n' + hardware + '''
              const host=document.querySelector('#large-host');host._layout=LAYOUT;
              const rect=RECT,card=document.createElement('div');card.id='large-card';
              card.append(LiveHardwareUI.render(document,FIXTURE,{now:STAMP,assetBase:'/__flow-hardware/'}));
              const overlay=host.querySelector('.overlays');overlay.append(card);
              const lamp=document.createElement('i');lamp.id='large-lamp';lamp.className='typeset-lamp';overlay.append(lamp);
              const link=document.createElement('a');link.id='large-link';link.textContent='本地测试：下方图片按钮';link.href='#large-host';Object.assign(link.style,{left:'50%',top:'97.5%',width:'35%',height:'2%'});overlay.append(link);
              window.largeState=TypesetLiveFlow.apply(host,[{node:card,rect},{node:lamp,rect:[.03,.04,.01,.01],livePart:'lamp'}]);window.largeReady=true;
            '''.replace('LAYOUT', json.dumps(part, ensure_ascii=False)).replace('RECT', json.dumps(cell['rect'])).replace('FIXTURE', json.dumps(hardware_test.fixture(), ensure_ascii=False)).replace('STAMP', str(hardware_test.STAMP)) + '</script></body></html>'
            output = candidate / path.strip('/') / 'index.html'
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(html, 'utf8')
            large[orientation] = {'path': path, 'part': part, 'rect': cell['rect']}
    for key in ['cpu', 'gpu', 'memory', 'storage', 'network', 'display']:
        icon_files['/__flow-hardware/' + key + '.webp'] = args.icons_root / ('硬盘循环.png' if key == 'storage' else '笔记本电脑.png')
    for file in candidate.rglob('*'):
        if file.is_file():
            manifest[file.relative_to(candidate).as_posix()] = {'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'bytes': file.stat().st_size}
    (args.output / 'candidate-manifest.json').write_text(json.dumps({'schema': 'website.live-flow-candidate.v1', 'pages': pages, 'large_frame_routes': [value['path'] for value in large.values()], 'files': manifest, 'raster_assets': 'unchanged public URLs; no image regeneration or asset copy'}, ensure_ascii=False, indent=2), 'utf8')
    return root, candidate, pages, icon_files, large


def fixture(pages):
    now = time.time()
    iso = lambda value: datetime.datetime.fromtimestamp(value, datetime.timezone.utc).isoformat()
    block = lambda items: {'state': 'ok' if items else 'empty', 'items': items, 'observed_at': iso(now), 'max_age_seconds': 120}
    projects = [{'project': page['project'], 'state': 'ok', 'run_health': 'ok', 'waiting_user_count': 2, 'cloud_review': {'state': 'auto', 'free_until': '2026-10-08T00:00:00+08:00', 'last_run_at': iso(now - 60), 'last_result': 'success', 'failure_reason': None}} for page in pages]
    task_names = {'AI 命令行配置': ['AI 工具升级观察'], '缓存盘守护': ['内存盘维护'], '远程桌面串流': ['串流画面切换']}
    automation = [{'id': 'fictional-' + str(index), 'project': project, 'state': 'success', 'enabled': True, 'last_run_at': iso(now - 60), 'plain': {'name': name}, 'related_status': {'capture': 'success'}} for index, (project, names) in enumerate(task_names.items()) for name in names]
    return {'status': 'pass', 'observed_at_unix': now, 'projects': block(projects), 'automation': block(automation), 'backups': block([{'project': '模拟备份项目', 'id': 'fictional-backup', 'name': '模拟备份', 'enabled': True, 'state': 'success', 'last_success_at': iso(now - 60)}]), 'pending': block([]), 'today': block([]), 'grafana': {'state': 'reachable', 'checked_at': iso(now), 'url': 'https://example.invalid/chart'}}


SNAPSHOT = '''()=>({
  overflow:document.documentElement.scrollWidth>innerWidth+1,
  cards:[...document.querySelectorAll('.typeset-live')].filter(e=>e.getClientRects().length).map(e=>({slot:e.dataset.slot,state:e.dataset.state,text:e.textContent,height:e.clientHeight,width:e.clientWidth,font:getComputedStyle(e).fontSize,overflow:e.scrollWidth>e.clientWidth+1,inFlow:!!e.closest('.typeset-live-flow-cards'),box:(()=>{const r=e.getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()})),
  parts:[...document.querySelectorAll('.typeset-live-flow-ready')].filter(e=>!e.hidden).map(e=>({screen:e.closest('.screen').dataset.screen,height:e.clientHeight,tiles:[...e.querySelectorAll('.typeset-live-flow-tile')].map(t=>[Number(t.dataset.sourceStart),Number(t.dataset.sourceEnd)]),imagesSame:[...e.querySelectorAll('.typeset-live-flow-image')].every(i=>i.src===(e.querySelector(':scope>picture img').currentSrc||e.querySelector(':scope>picture img').src)),imagesLoaded:[...e.querySelectorAll('.typeset-live-flow-image')].every(i=>i.complete&&i.naturalWidth>0),hotspots:[...e.querySelectorAll('[data-typeset-kind="link"],[data-typeset-kind="button"]')].map(h=>({id:h.dataset.hotId,href:h.getAttribute('href'),inTile:!!h.closest('.typeset-live-flow-layer')}))}))
})'''


async def run(args):
    args.output.mkdir(parents=True, exist_ok=True)
    args.temp.mkdir(parents=True, exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = os.environ['TMPDIR'] = str(args.temp)
    root, candidate, pages, icon_files, large = prepare(args)
    records, large_records, errors, missing, writes = [], [], [], [], []
    mode = {'value': 'normal'}
    async with async_playwright() as pw:
        for device, options in [('desktop', {'viewport': {'width': 1440, 'height': 1000}}), ('xiaomi-portrait', {'viewport': {'width': 412, 'height': 915}, 'device_scale_factor': 3.5, 'is_mobile': True, 'has_touch': True})]:
            context = await pw.chromium.launch_persistent_context(str(args.temp / device), executable_path=str(args.chrome), headless=True, reduced_motion='reduce', **options)
            async def intercept(handler):
                request = handler.request
                if request.method != 'GET':
                    writes.append({'method': request.method, 'url': request.url})
                    return await handler.abort()
                from urllib.parse import urlsplit
                url = urlsplit(request.url)
                if url.hostname == 'wly0829.cn':
                    path = url.path
                    if path in icon_files:
                        return await handler.fulfill(status=200, body=icon_files[path].read_bytes(), content_type='image/png')
                    target = candidate / (path.lstrip('/') + ('index.html' if path.endswith('/') else ''))
                    if target.is_file():
                        mime = mimetypes.guess_type(str(target))[0] or 'application/octet-stream'
                        return await handler.fulfill(status=200, body=target.read_bytes(), content_type=mime)
                    missing.append(path)
                    return await handler.abort()
                if url.hostname == 'mcp.wly0829.cn':
                    if mode['value'] == 'offline':
                        return await handler.fulfill(status=503, body='fixture offline')
                    return await handler.fulfill(status=200, body=json.dumps(fixture(pages), ensure_ascii=False), content_type='application/json', headers={'Access-Control-Allow-Origin': 'https://wly0829.cn', 'Access-Control-Allow-Credentials': 'true'})
                if url.hostname == 'example.invalid':
                    return await handler.abort()
                await handler.continue_()
            await context.route('**/*', intercept)
            page = context.pages[0]
            page.on('pageerror', lambda error: errors.append(str(error)))
            for entry in ([] if args.only_large else [entry for entry in pages if not args.routes or entry['page'] in args.routes.split(',')]):
                mode['value'] = 'normal'
                await page.goto('https://wly0829.cn' + entry['route'], wait_until='domcontentloaded', timeout=45000)
                await page.wait_for_function("window.SiteStatus && document.body.dataset.statusPhase==='ready'", timeout=20000)
                await page.evaluate('document.fonts.ready')
                first = page.locator('.typeset-live-flow-ready').filter(visible=True).first
                await first.scroll_into_view_if_needed()
                await page.evaluate("Promise.all([...document.querySelectorAll('.typeset-live-flow-ready:not([hidden]) .typeset-live-flow-image')].map(i=>i.decode()))")
                await page.wait_for_timeout(80)
                snapshot = await page.evaluate(SNAPSHOT)
                assert not snapshot['overflow'], (device, entry, snapshot)
                assert snapshot['cards'] and all(c['inFlow'] and not c['overflow'] and c['height'] >= 94 and float(c['font'].removesuffix('px')) >= 14 for c in snapshot['cards']), (device, entry, snapshot)
                for part in snapshot['parts']:
                    assert part['imagesSame'] and part['imagesLoaded'], part
                    intervals = sorted(part['tiles'])
                    assert abs(intervals[0][0]) < 1e-6 and abs(intervals[-1][1] - 1) < 1e-6, part
                    assert all(abs(a[1] - b[0]) < 1e-6 for a, b in zip(intervals, intervals[1:])), part
                    assert all(h['inTile'] for h in part['hotspots']), part
                screenshot = args.output / (device + '-' + entry['page'] + '.png')
                await page.evaluate('scrollTo(0,0)')
                height = await first.evaluate('e=>e.getBoundingClientRect().bottom+scrollY')
                await page.screenshot(path=str(screenshot), full_page=True, clip={'x': 0, 'y': 0, 'width': options['viewport']['width'], 'height': height})
                await page.evaluate("window.flowBefore=[...document.querySelectorAll('.typeset-live')].filter(e=>e.getClientRects().length);window.flowFirst=flowBefore[0];flowFirst.tabIndex=0;flowFirst.focus();window.flowTileCount=document.querySelectorAll('.typeset-live-flow-tile').length")
                mode['value'] = 'offline'
                await page.evaluate('SiteStatus.refresh()')
                await page.wait_for_function("document.body.dataset.statusPhase==='error'")
                await page.wait_for_timeout(60)
                cached = await page.evaluate(SNAPSHOT)
                continuity = await page.evaluate("({nodesSame:flowBefore.every(e=>e.isConnected),focusSame:document.activeElement===flowFirst,tilesSame:flowTileCount===document.querySelectorAll('.typeset-live-flow-tile').length})")
                assert continuity == {'nodesSame': True, 'focusSame': True, 'tilesSame': True}, continuity
                assert not cached['overflow'] and all(c['inFlow'] and not c['overflow'] and c['state'] != 'ok' for c in cached['cards']), cached
                await page.evaluate("const d=document.createElement('details');d.innerHTML='<summary>本地测试展开项</summary><p>用于检查切片助手保持展开和焦点。</p>';flowFirst.append(d);d.open=true;window.flowDetails=d;d.querySelector('summary').focus();for(let n=0;n<4;n++)document.dispatchEvent(new CustomEvent('live-status-layout'))")
                await page.wait_for_timeout(80)
                detail = await page.evaluate("({same:flowDetails.isConnected,open:flowDetails.open,focus:document.activeElement===flowDetails.querySelector('summary'),tilesSame:flowTileCount===document.querySelectorAll('.typeset-live-flow-tile').length})")
                assert detail == {'same': True, 'open': True, 'focus': True, 'tilesSame': True}, detail
                width = options['viewport']['width']
                await page.set_viewport_size({'width': width - 20, 'height': options['viewport']['height']})
                await page.wait_for_timeout(300)
                resized = await page.evaluate(SNAPSHOT)
                assert not resized['overflow'] and all(c['inFlow'] and not c['overflow'] for c in resized['cards']), resized
                feedback = await page.evaluate("[...document.querySelectorAll('.typeset-live-flow-ready:not([hidden]) .typeset-card-feedback')].map(e=>({size:parseFloat(e.querySelector('.raster-card-visual').style.backgroundSize),width:e.closest('.typeset-part').clientWidth}))")
                assert all(abs(item['size']-item['width'])<1 for item in feedback), feedback
                await page.set_viewport_size(options['viewport'])
                records.append({'device': device, 'entry': entry, 'ready': snapshot, 'offline': cached, 'continuity': continuity, 'details': detail, 'same_orientation_resize': True, 'screenshot': str(screenshot), 'chrome_version': context.browser.version})
                print(json.dumps({'device': device, 'page': entry['page'], 'cards': len(snapshot['cards']), 'status': 'pass'}, ensure_ascii=False), flush=True)
            kind = 'h' if device == 'desktop' else 'v'
            await page.goto('https://wly0829.cn' + large[kind]['path'], wait_until='domcontentloaded')
            await page.wait_for_function('window.largeReady')
            await page.evaluate('Promise.all([...document.images].map(i=>i.decode()))')
            large_result = await page.evaluate('''()=>{
              const host=document.querySelector('#large-host'),card=document.querySelector('#large-card'),lamp=document.querySelector('#large-lamp'),link=document.querySelector('#large-link'),h=host.clientWidth*host._layout.size[1]/host._layout.size[0],r=largeState.cells[0].rect,b=host.getBoundingClientRect(),c=card.getBoundingClientRect(),l=lamp.getBoundingClientRect(),next=link.getBoundingClientRect();
              const tiles=[...host.querySelectorAll('.typeset-live-flow-tile')].map(t=>[Number(t.dataset.sourceLeft),Number(t.dataset.sourceStart),Number(t.dataset.sourceRight),Number(t.dataset.sourceEnd)]);
              return {overflow:document.documentElement.scrollWidth>innerWidth+1,cardOverflow:card.scrollWidth>card.clientWidth+1,cardBox:[c.left,c.top,c.width,c.height],expectedBox:[b.left+r[0]*host.clientWidth,b.top+r[1]*h,r[2]*host.clientWidth,r[3]*h],lampBox:[l.left,l.top],lampExpected:[b.left+.03*host.clientWidth,b.top+.04*h],replacement:largeState.bands[0].replace,columnReplacement:!!largeState.column,extraHeight:host.clientHeight-h,nextLinkTop:next.top,nextLinkOriginal:b.top+.975*h,tiles,sourceArea:tiles.reduce((sum,t)=>sum+(t[2]-t[0])*(t[3]-t[1]),0),expectedSourceArea:1-r[2]*r[3],panelCount:host.querySelectorAll('.live-hardware-grid>.live-hardware-card').length};
            }''')
            assert not large_result['overflow'] and not large_result['cardOverflow'] and large_result['replacement'], large_result
            assert all(abs(a-b)<1.1 for a,b in zip(large_result['cardBox'][:3],large_result['expectedBox'][:3])), large_result
            assert all(abs(a-b)<1.1 for a,b in zip(large_result['lampBox'],large_result['lampExpected'])), large_result
            assert large_result['extraHeight']>0 and abs(large_result['nextLinkTop']-large_result['nextLinkOriginal']-large_result['extraHeight'])<2, large_result
            assert large_result['panelCount']==3, large_result
            assert large_result['columnReplacement'] and abs(large_result['sourceArea']-large_result['expectedSourceArea'])<1e-6, large_result
            await page.locator('.live-hardware-details').first.locator('summary').click()
            await page.evaluate("window.largeDetails=document.querySelector('.live-hardware-details');largeDetails.querySelector('summary').focus();TypesetLiveFlow.apply(document.querySelector('#large-host'),largeState.cells);TypesetLiveFlow.request(document.querySelector('#large-host'))")
            await page.wait_for_timeout(60)
            assert await page.evaluate("largeDetails.open&&largeDetails.isConnected&&document.activeElement===largeDetails.querySelector('summary')"), 'Large-frame details/focus lost'
            await page.evaluate('scrollTo(0,0)')
            await page.screenshot(path=str(args.output/(device+'-large-pc-frame.png')),full_page=True)
            large_records.append({'device':device,'snapshot':large_result,'details_and_focus_preserved':True,'source_part':large[kind]['part']['src'],'fixture_only':True})
            await context.close()
    receipt = {'schema': 'website.typeset-live-flow-browser.v1', 'observed_at_beijing': datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(), 'chrome': str(args.chrome), 'candidate': str(candidate), 'fixture_only': True, 'results': records, 'large_frames':large_records, 'page_errors': errors, 'missing_local': sorted(set(missing)), 'blocked_writes': writes}
    (args.output / 'browser-results.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2), 'utf8')
    assert not errors and not writes, receipt
    for device in ([] if args.only_large else ['desktop', 'xiaomi-portrait']):
        rows = [row for row in records if row['device'] == device]
        thumbs = []
        for row in rows:
            im = Image.open(row['screenshot']).convert('RGB')
            im.thumbnail((440, 1000))
            canvas = Image.new('RGB', (460, 1040), 'white')
            canvas.paste(im, ((460 - im.width) // 2, 30))
            ImageDraw.Draw(canvas).text((10, 8), row['entry']['page'], fill='#0a7232')
            thumbs.append(canvas)
        sheet = Image.new('RGB', (460 * 4, 1040 * ((len(thumbs) + 3) // 4)), '#f4f7f4')
        for index, im in enumerate(thumbs):
            sheet.paste(im, ((index % 4) * 460, (index // 4) * 1040))
        sheet.save(args.output / (device + '-contact.png'))
    print(json.dumps({'project_pages': len(pages), 'device_page_cases': len(records), 'page_errors': len(errors), 'candidate': str(candidate)}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--release-root', type=Path, required=True)
    parser.add_argument('--chrome', type=Path, required=True)
    parser.add_argument('--icons-root', type=Path, required=True)
    parser.add_argument('--temp', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--only-large', action='store_true')
    parser.add_argument('--routes')
    asyncio.run(run(parser.parse_args()))

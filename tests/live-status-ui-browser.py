"""Read-only component and adapter acceptance in installed Chrome with an isolated E: profile."""
import argparse
import asyncio
import datetime
import hashlib
import json
import os
from pathlib import Path
import re

from playwright.async_api import async_playwright

CASES = [
    {'slot': 'run', 'result': {'state': 'ok', 'text': '运行正常', 'readAt': '2026-10-04T01:26:00Z'}},
    {'slot': 'watch', 'result': {'state': 'failed', 'text': '失败 · 今天 09:20', 'readAt': '2026-10-04T01:26:00Z'}},
    {'slot': 'acceptance', 'result': {'state': 'waiting', 'text': '2 项待验收', 'readAt': '2026-10-04T01:26:00Z'}},
    {'slot': 'local', 'result': {'state': 'unknown', 'text': '暂时读不到'}},
    {'slot': 'backup', 'result': {'state': 'offline', 'text': '读不到电脑 · 当时：备份 4项正常 · 1项要看 · 上次读到 今天 09:10 · 当前状态未知', 'cached': True, 'readAt': '2026-10-04T01:10:00Z'}},
    {'slot': 'cloud', 'result': {'state': 'ok', 'text': '自动复核中（免费到 10 月 8 日）', 'readAt': '2026-10-04T01:26:00Z'}},
    {'slot': 'watch', 'result': {'state': 'disabled', 'text': '平时停着', 'readAt': '2026-10-04T01:26:00Z'}},
    {'slot': 'grafana', 'result': {'state': 'ok', 'text': '在线', 'href': 'https://example.invalid/chart', 'readAt': '2026-10-04T01:26:00Z'}},
]
ICONS = {'status': '笔记本电脑.png', 'backup': '硬盘循环.png', 'cloud': '云对勾.png', 'acceptance': '打勾清单.png', 'watch': '日历时钟.png', 'health': '工具箱.png'}


async def run(args):
    args.output.mkdir(parents=True, exist_ok=True)
    args.temp.mkdir(parents=True, exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = os.environ['TMPDIR'] = str(args.temp)
    root = Path(__file__).resolve().parents[1]
    ui = (root / 'scripts/live-status-ui.js').read_text('utf8')
    css = (root / 'scripts/live-status-ui.css').read_text('utf8')
    adapter = (root / 'scripts/typeset-live-display.js').read_text('utf8')
    assets, icon_urls, proofs = {}, {}, []
    for key, name in ICONS.items():
        payload = (args.icons_root / name).read_bytes()
        digest = hashlib.sha256(payload).hexdigest()
        url = '/_shared/live-status-' + key + '-' + digest[:12] + '.png'
        icon_urls[key] = url
        assets[url] = payload
        proofs.append({'key': key, 'source': str(args.icons_root / name), 'sha256': digest, 'bytes': len(payload), 'candidate_url': url})
    source = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + '''
      :root{--title:#0a7232;--text:#2e4675;--accent:#0a7a33;--link:rgb(9,145,54);--line:#bfe8cc;--cardbg:#fbfefc;--soft:#edfbf3}
      *{box-sizing:border-box}body{margin:0;background:white;color:var(--text);font-family:"Noto Sans SC",sans-serif}
      main{width:calc(100% - 32px);max-width:1100px;margin:24px auto}h1{color:var(--title);font-size:24px;margin:0 0 18px}
      .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:start}
      .typeset-part{position:relative;max-width:100%;margin-top:22px}.typeset-live{width:100%;height:34px}
      @media(max-width:600px){.grid{grid-template-columns:1fr}main{margin:16px auto}h1{font-size:22px}}
    ''' + css + '</style></head><body><main><h1>项目实时状态</h1><div class="grid" id="cards"></div><div class="typeset-part"><a class="typeset-live" data-slot="run"><i></i><span></span></a></div></main><script>' + ui + '\n' + adapter + '\n' + '''
      const cases=CASES,icons=ICONS;
      cases.forEach((entry,index)=>{const card=LiveStatusUI.render(document,entry.result,{slot:entry.slot,icons});card.dataset.case=String(index);document.querySelector('#cards').append(card)});
      document.querySelector('.typeset-part')._layout={size:[941,1882]};
      displayTypesetStatus(null,'ready',()=>cases[0].result,{project:'模拟项目',status_binding:{labels:{run:'运行状态'}},shared:{live_status_icons:icons}});
    '''.replace('CASES', json.dumps(CASES, ensure_ascii=False)).replace('ICONS', json.dumps(icon_urls, ensure_ascii=False)) + '</script></body></html>'
    records, errors = [], []
    async with async_playwright() as pw:
        for device, options in [('desktop', {'viewport': {'width': 1440, 'height': 1000}}), ('xiaomi-portrait', {'viewport': {'width': 412, 'height': 915}, 'device_scale_factor': 3.5, 'is_mobile': True, 'has_touch': True})]:
            context = await pw.chromium.launch_persistent_context(str(args.temp / device), executable_path=str(args.chrome), headless=True, timezone_id='America/Chicago', **options)
            async def route(handler):
                request = handler.request
                if request.method != 'GET':
                    raise AssertionError('Unexpected non-read request: ' + request.method)
                path = request.url.removeprefix('http://127.0.0.1:49871')
                if path == '/':
                    await handler.fulfill(status=200, body=source, content_type='text/html; charset=utf-8')
                elif path in assets:
                    await handler.fulfill(status=200, body=assets[path], content_type='image/png')
                else:
                    await handler.abort()
            await context.route('**/*', route)
            page = context.pages[0]
            page.on('pageerror', lambda error: errors.append(str(error)))
            await page.goto('http://127.0.0.1:49871/', wait_until='networkidle')
            await page.evaluate('document.fonts.ready')
            snapshot = await page.evaluate('''()=>({
              documentOverflow:document.documentElement.scrollWidth>innerWidth+1,
              cards:[...document.querySelectorAll('.live-status-card')].map(e=>({
                state:e.dataset.state,tone:e.dataset.tone,cached:e.dataset.cached,text:e.textContent,
                height:e.clientHeight,width:e.clientWidth,font:getComputedStyle(e).fontSize,
                dotColor:getComputedStyle(e.querySelector('.live-status-dot')).backgroundColor,
                overflow:e.scrollWidth>e.clientWidth+1,
                childrenFit:[...e.children].every(c=>{const b=e.getBoundingClientRect(),r=c.getBoundingClientRect();return r.left>=b.left&&r.right<=b.right+1&&r.top>=b.top&&r.bottom<=b.bottom+1}),
                iconsLoaded:[...e.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0)
              }))})''')
            assert not snapshot['documentOverflow'], snapshot
            assert all(not c['overflow'] and c['childrenFit'] and c['iconsLoaded'] for c in snapshot['cards']), snapshot
            assert all(float(c['font'].removesuffix('px')) >= 14 for c in snapshot['cards']), snapshot
            cards = snapshot['cards']
            assert len({cards[i]['dotColor'] for i in [0, 1, 2, 3]}) == 4, cards
            assert cards[4]['tone'] == 'unknown' and '历史记录' in cards[4]['text'] and '当前状态读不到' in cards[4]['text']
            assert '北京时间 09:26 读取' in cards[0]['text'] and '读取时间：读不到' in cards[3]['text']
            assert cards[3]['text'].count('0') == 0
            link = page.locator('[data-case="7"]')
            await link.focus()
            assert await link.evaluate("e=>document.activeElement===e && getComputedStyle(e).outlineStyle==='solid'")
            await page.evaluate("LiveStatusUI.decorate(document.querySelector('[data-case=\"7\"]'),{state:'unknown',text:'暂时读不到'},{slot:'grafana'})")
            assert await link.get_attribute('href') is None
            assert await link.get_attribute('role') == 'status'
            await page.screenshot(path=str(args.output / (device + '.png')), full_page=True)
            records.append({'device': device, 'snapshot': snapshot, 'keyboard_focus': True, 'href_removed_on_unavailable': True, 'chrome_version': context.browser.version})
            await context.close()
    receipt = {'schema': 'website.live-status-ui-browser.v1', 'observed_at_beijing': datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(), 'chrome': str(args.chrome), 'profiles': str(args.temp), 'synthetic_cases': CASES, 'results': records, 'page_errors': errors, 'assets': proofs}
    (args.output / 'browser-results.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2), 'utf8')
    assert not errors, errors
    print(json.dumps({'devices': len(records), 'cards_checked': sum(len(r['snapshot']['cards']) for r in records), 'page_errors': len(errors)}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--chrome', type=Path, required=True)
    parser.add_argument('--icons-root', type=Path, required=True)
    parser.add_argument('--temp', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    asyncio.run(run(parser.parse_args()))

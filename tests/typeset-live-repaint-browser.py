"""Verify intersecting raster feedback no longer repaints old controls after live flow."""
import argparse
import asyncio
import datetime
import json
import mimetypes
import os
from pathlib import Path
import re
import time
from urllib.parse import unquote, urlsplit

from playwright.async_api import async_playwright


def patch(source, owned):
    first='/* typeset-live-flow-v1 */';last='/* end-typeset-live-flow-v1 */'
    helper=owned[owned.index(first):owned.index(last)+len(last)]
    # Preserve the root's admitted forceOverlay switch while replacing only
    # this helper, never B2 or another part of the prepared runtime.
    helper=helper.replace('band.cells.length===1&&mask[2]>.55&&mask[3]*height>=80', 'band.cells.length===1&&(band.cells[0].forceOverlay===true||mask[2]>.55&&mask[3]*height>=80)')
    return source[:source.index(first)]+helper+source[source.index(last)+len(last):]


def fixture():
    now = time.time()
    return {'status': 'pass', 'observed_at_unix': now, 'state_version': 'fictional-layout-proof', 'default_minutes': 1440,
            'host': {'screen_state': 'unlocked', 'uptime_seconds': 7200},
            'personal_data': {'state': 'unlocked', 'expires_at_unix': now + 7200},
            'unrestricted': {'state': 'inactive'}, 'factor': {'available': True}, 'public_actions': {},
            'automation': {'state': 'empty', 'items': [], 'observed_at': datetime.datetime.now(datetime.timezone.utc).isoformat()},
            'projects': {'state': 'empty', 'items': [], 'observed_at': datetime.datetime.now(datetime.timezone.utc).isoformat()},
            'pending': {'state': 'empty', 'items': [], 'observed_at': datetime.datetime.now(datetime.timezone.utc).isoformat()}}


SNAP = '''()=>{
 const visible=e=>e.getClientRects().length&&!!e.closest('.typeset-part:not([hidden])');
 const intersects=(a,b)=>a[0]<b[0]+b[2]&&a[0]+a[2]>b[0]&&a[1]<b[1]+b[3]&&a[1]+a[3]>b[1];
 return {
  overflow:document.documentElement.scrollWidth>innerWidth+1,
  feedback:[...document.querySelectorAll('.typeset-card-feedback')].filter(visible).map(e=>{
   const host=e.closest('.typeset-part'),a=e._card.rect,live=(host._layout.native_live||host._layout.live||[]).filter(x=>x.live_part!=='lamp'&&x.slot!=='ca-connection');
   const v=e.querySelector('.raster-card-visual');return {id:e.dataset.cardId,rect:a,overlaps:live.some(x=>intersects(a,x.mask_rect||x.rect)),background:getComputedStyle(v).backgroundImage,suppressed:e.classList.contains('typeset-live-flow-repaint-suppressed'),transition:getComputedStyle(e).transition,source:e._card.href,nodeConnected:e.isConnected};
  }),
  fragments:[...document.querySelectorAll('.typeset-part:not([hidden]) .typeset-live-flow-tile')].map(t=>({left:t.dataset.sourceLeft,top:t.dataset.sourceStart,right:t.dataset.sourceRight,bottom:t.dataset.sourceEnd,src:t.querySelector('img').getAttribute('src')})),
  actions:[...document.querySelectorAll('[data-b2-action]')].filter(visible).map(e=>({action:e.dataset.b2Action,box:(()=>{const r=e.getBoundingClientRect();return [r.left,r.top,r.width,r.height]})(),disabled:e.disabled})),
  cardNodes:[...document.querySelectorAll('.typeset-card-feedback')].filter(visible).map(e=>e.dataset.cardId)
 };
}'''


async def run(args):
    args.output.mkdir(parents=True, exist_ok=True)
    args.temp.mkdir(parents=True, exist_ok=True)
    os.environ['TEMP'] = os.environ['TMP'] = os.environ['TMPDIR'] = str(args.temp)
    owned = (Path(__file__).resolve().parents[1] / 'scripts/typeset-layout.js').read_text('utf8')
    rule = '.typeset-card-feedback.typeset-live-flow-repaint-suppressed .raster-card-visual{background-image:none!important}'
    results, errors, writes = [], [], []
    async with async_playwright() as pw:
        for device, options in [('desktop', {'viewport': {'width': 1440, 'height': 1000}}), ('mobile', {'viewport': {'width': 412, 'height': 915}, 'device_scale_factor': 3.5, 'is_mobile': True, 'has_touch': True})]:
            context = await pw.chromium.launch_persistent_context(str(args.temp/device), executable_path=str(args.chrome), headless=True, **options)
            state = {'patched': False, 'offline': False}
            async def route(handler):
                request = handler.request
                if request.method not in ['GET', 'HEAD', 'OPTIONS']:
                    writes.append(request.method+' '+request.url)
                    return await handler.abort()
                url = urlsplit(request.url)
                if url.hostname == 'mcp.wly0829.cn':
                    if state['offline']:
                        return await handler.fulfill(status=503, body='fictional offline')
                    return await handler.fulfill(status=200, body=json.dumps(fixture()), content_type='application/json', headers={'Access-Control-Allow-Origin': 'https://wly0829.cn', 'Access-Control-Allow-Credentials': 'true'})
                if url.hostname != 'wly0829.cn':
                    return await handler.abort()
                file = args.site / (unquote(url.path).lstrip('/')+('index.html' if url.path.endswith('/') else ''))
                if not file.is_file():
                    return await handler.abort()
                body = file.read_bytes()
                if state['patched'] and file.suffix == '.js' and b'/* typeset-live-flow-v1 */' in body:
                    body = patch(body.decode('utf8'), owned).encode()
                if state['patched'] and file.suffix == '.html':
                    body = body.replace(b'</head>', ('<style>'+rule+'</style></head>').encode())
                await handler.fulfill(status=200, body=body, content_type=mimetypes.guess_type(str(file))[0] or 'application/octet-stream')
            await context.route('**/*', route)
            page = context.pages[0]
            page.on('pageerror', lambda error: errors.append(str(error)))
            for patched in [False, True]:
                state.update(patched=patched, offline=False)
                if page.url.startswith('https://wly0829.cn'):
                    await page.evaluate('localStorage.clear()')
                await page.goto('https://wly0829.cn/computer-access/', wait_until='domcontentloaded')
                await page.wait_for_function("window.SiteB2&&document.body.dataset.b2StatusPhase==='ready'", timeout=20000)
                await page.evaluate("Promise.all([...document.querySelectorAll('[data-screen=\"computer-access-01\"] .typeset-part:not([hidden]) .typeset-live-flow-image')].map(i=>i.decode()))")
                await page.wait_for_timeout(1200)
                for phase in ['ready', 'offline']:
                    if phase == 'offline':
                        state['offline'] = True
                        await page.evaluate('SiteB2.refresh()')
                        await page.wait_for_function("document.body.dataset.b2StatusPhase==='error'", timeout=20000)
                        await page.wait_for_timeout(100)
                    snap = await page.evaluate(SNAP)
                    assert not snap['overflow'], snap
                    affected = [item for item in snap['feedback'] if item['overlaps']]
                    assert affected, snap
                    assert all(item['background'] == 'none' if patched else item['background'] != 'none' for item in affected), snap
                    hits = await page.evaluate('''async()=>{const results=[];for(const button of [...document.querySelectorAll('[data-b2-action]')].filter(e=>e.getClientRects().length&&e.closest('[data-screen="computer-access-01"]'))){button.scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const b=button.getBoundingClientRect(),hit=document.elementFromPoint(b.left+b.width/2,b.top+b.height/2);results.push({action:button.dataset.b2Action,hit:hit===button||button.contains(hit),disabled:button.disabled,pointer:getComputedStyle(button).pointerEvents,top:hit?.outerHTML?.slice(0,500),box:[b.left,b.top,b.width,b.height]});}return results;}''')
                    if patched:assert all(item['hit'] for item in hits), hits
                    await page.evaluate('scrollTo(0,0)')
                    section = page.locator('[data-screen="computer-access-01"]').first
                    height = await section.evaluate('e=>e.getBoundingClientRect().bottom+scrollY')
                    shot = args.output/(device+'-'+('patched' if patched else 'before')+'-'+phase+'.jpg')
                    await page.screenshot(path=str(shot), full_page=True, clip={'x':0,'y':0,'width':options['viewport']['width'],'height':height}, quality=90, type='jpeg')
                    results.append({'device':device,'patched':patched,'phase':phase,'snapshot':snap,'hits':hits,'screenshot':str(shot)})
            # A real project counterexample: ordinary feedback above the live
            # band must keep its source image and hover transition.
            state.update(patched=True, offline=False)
            await page.goto('https://wly0829.cn/projects/ai-cli-profile-manager/',wait_until='domcontentloaded')
            await page.wait_for_function("window.SiteStatus&&['ready','error'].includes(document.body.dataset.statusPhase)",timeout=20000)
            normal = await page.evaluate(SNAP)
            unaffected = [item for item in normal['feedback'] if not item['overlaps']]
            assert unaffected and all(not item['suppressed'] and item['background']!='none' for item in unaffected), normal
            results.append({'device':device,'counterexample':'project feedback outside live mask','snapshot':normal})
            await context.close()
    for device in ['desktop','mobile']:
        for phase in ['ready','offline']:
            before=next(r for r in results if r.get('device')==device and r.get('phase')==phase and not r['patched'])
            after=next(r for r in results if r.get('device')==device and r.get('phase')==phase and r['patched'])
            assert {x['src'] for x in before['snapshot']['fragments']}=={x['src'] for x in after['snapshot']['fragments']}, 'Original source image URLs changed'
            assert before['snapshot']['cardNodes']==after['snapshot']['cardNodes'], 'Feedback card nodes changed'
            assert [x['transition'] for x in before['snapshot']['feedback']]==[x['transition'] for x in after['snapshot']['feedback']], 'Card motion changed'
    receipt={'schema':'website.live-repaint-browser.v1','observed_at_beijing':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(),'site':str(args.site),'fixture_only':True,'results':results,'page_errors':errors,'blocked_writes':writes}
    (args.output/'browser-results.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2),'utf8')
    assert not errors and not writes, receipt
    print(json.dumps({'cases':len(results),'hit_checks':sum(len(r.get('hits',[])) for r in results),'page_errors':len(errors),'writes':len(writes)},ensure_ascii=False))


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--site',type=Path,required=True)
    parser.add_argument('--chrome',type=Path,required=True)
    parser.add_argument('--temp',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    asyncio.run(run(parser.parse_args()))

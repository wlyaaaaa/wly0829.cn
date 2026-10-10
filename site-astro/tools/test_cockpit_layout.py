"""用 Chrome 核对保留驾驶舱当前快照布局与横滑；需有效任务快照，动画另作视觉核验。"""
import argparse, json, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
parser = argparse.ArgumentParser()
parser.add_argument('url')
parser.add_argument('output', type=lambda value: Path(value).resolve())
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
os.environ['TEMP'] = os.environ['TMP'] = str(args.output)
chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
results, errors = [], []
with tempfile.TemporaryDirectory(prefix='cockpit-chrome-', dir=args.output) as profile, sync_playwright() as p:
    context = p.chromium.launch_persistent_context(profile, headless=True, executable_path=chrome)
    page = context.pages[0]
    page.on('pageerror', lambda error: errors.append(str(error)))
    for width in (1920, 1440, 390):
        page.set_viewport_size({'width': width, 'height': 844 if width == 390 else 1000})
        page.goto(args.url, wait_until='domcontentloaded')
        page.wait_for_function("window.SiteB2?.getSnapshot().phase === 'ready'", timeout=60000)
        page.locator('#today-river #scroller').wait_for(state='visible', timeout=30000)
        page.wait_for_timeout(1500)
        metrics = page.evaluate('''() => {
          const rect = s => {const n=document.querySelector(s),r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom}};
          const sc=document.querySelector('#today-river #scroller'),stage=document.querySelector('#today-river #stage');
          return {order:[...document.querySelector('.cp-grid').children].map(n=>n.id||n.className),
            river:rect('#cp-river'),conclusion:rect('#cp-conclusion'),security:rect('#cp-security'),
            computer:rect('#cp-computer'),remote:rect('#cp-remote'),cloud:rect('#cp-cloud'),
            inDetails:!!document.querySelector('#today-river').closest('#cp-details'),
            overflow:document.documentElement.scrollWidth>innerWidth,scroll:sc.scrollLeft,
            expectedScroll:Math.max(0,stage.clientWidth*.47-sc.clientWidth/2+18),
            scrollWidth:sc.scrollWidth,clientWidth:sc.clientWidth,boats:stage.querySelectorAll('.boat').length,
            noWater:stage.classList.contains('nogl'),still:stage.classList.contains('still')};
        }''')
        page.screenshot(path=str(args.output / f'{width}-top.png'))
        assert metrics['order'][:5] == ['cp-conclusion', 'cp-security', 'cp-river', 'cp-services', 'cp-cloud'], metrics
        assert not metrics['inDetails'] and not metrics['overflow'], metrics
        r, c, remote, cloud = [metrics[key] for key in ('river', 'computer', 'remote', 'cloud')]
        gap = 14 if width == 390 else 20
        assert abs(r['y']-max(metrics['conclusion']['bottom'], metrics['security']['bottom'])-gap)<2, metrics
        assert abs(c['y']-r['bottom']-gap)<2 and abs(remote['y']-c['bottom']-gap)<2, metrics
        assert abs(remote['x']-c['x'])<2 and abs(remote['w']-c['w'])<2, metrics
        if width != 390:
            assert cloud['x']>c['x'] and abs(cloud['y']-c['y'])<2 and abs(cloud['w']-c['w'])<2 and abs(cloud['bottom']-remote['bottom'])<=120, metrics
        else:
            assert all(abs(card['x']-c['x'])<2 and abs(card['w']-c['w'])<2 for card in (r,cloud)) and abs(cloud['y']-remote['bottom']-gap)<2, metrics
            assert metrics['scrollWidth']>metrics['clientWidth'] and abs(metrics['scroll']-metrics['expectedScroll'])<2, metrics
        page.locator('#today-river').scroll_into_view_if_needed()
        page.wait_for_timeout(8000)
        page.screenshot(path=str(args.output / f'{width}-river.png'))
        if width == 390:
            page.locator('#today-river #scroller').hover(); page.mouse.wheel(80, 0); page.wait_for_timeout(200)
            assert page.locator('#today-river #scroller').evaluate('(n)=>n.scrollLeft') > metrics['scroll']+5, metrics
        page.evaluate('scrollTo(0,document.documentElement.scrollHeight)'); page.wait_for_timeout(1200); page.evaluate('scrollTo(0,0)'); page.wait_for_timeout(150)
        page.screenshot(path=str(args.output / f'{width}-full.png'), full_page=True)
        results.append({'width': width, 'metrics': metrics})
    context.close()
(args.output / 'metrics.json').write_text(json.dumps({'chrome':chrome,'session_id':profile,'url':args.url,'results':results,'pageErrors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
assert not errors, errors
print('PASS: 1920 / 1440 / 390 布局与手机初始位置；船、水面状态及截图已记录，动画需视觉核验')

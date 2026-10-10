from pathlib import Path
import os
task_tmp = Path(__file__).resolve().parents[3] / 'cockpit-offline-test'
task_tmp.mkdir(exist_ok=True)
os.environ['TEMP'] = os.environ['TMP'] = str(task_tmp)
from playwright.sync_api import sync_playwright

base = Path(__file__).resolve().parents[1] / 'public' / '_home-cockpit'
fixture = '''<html><body data-b2-status-phase="error"><main><div class="cp-cockpit"><strong class="cp-headline">未读取</strong><div class="cp-need"></div><details class="cp-following"><summary></summary><div></div></details><div class="cp-authority-items"></div><section id="cp-computer"><div class="cp-rows"></div></section><section id="cp-remote"><div class="cp-rows"></div></section><section id="cp-cloud"><div class="cp-rows"></div></section><section class="cp-conditions"></section><div class="cp-events"></div><p class="cp-learning"></p><p class="cp-basis"></p><div class="cp-changes"></div></div></main><script id="page-data" type="application/json">{"kind":"cockpit","page":"cockpit"}</script><script>let phase='error',lastRead=0;window.SiteB2={getSnapshot:()=>({phase,lastRead})};window.feed=(p,text)=>{phase=p;if(p==='ready')lastRead=Date.now()/1000;document.querySelector('.cp-headline').textContent=text;document.querySelector('.cp-need').innerHTML=text+'<a href="/mcp/">连接入口</a><button>办理</button>';document.body.dataset.b2StatusPhase=p;};</script></body></html>'''
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe')
    page = browser.new_page(viewport={'width': int(os.environ.get('TEST_WIDTH', '1280')), 'height': 900})
    page.route('http://offline.test/**', lambda route: route.fulfill(body=fixture, content_type='text/html'))
    def boot():
        page.goto('http://offline.test/')
        page.evaluate('''document.querySelector('main').insertAdjacentHTML('beforebegin','<nav class="toc"><a href="#cp-computer" title="原目录说明" tabindex="0">电脑</a><a href="#missing">未读区块</a><a href="#static">连接帮助</a></nav><p id="static">连接说明</p>');document.querySelector('.toc').addEventListener('click',()=>window.tocClicks=(window.tocClicks||0)+1);''')
        page.add_style_tag(path=str(base / 'cockpit-offline.css'))
        page.add_script_tag(path=str(base / 'cockpit-offline.js'))
    boot()
    assert page.evaluate('CockpitOffline.state') == 'empty'
    assert not page.locator('.cp-cockpit').is_visible()
    assert page.evaluate('localStorage.length') == 0
    assert page.locator('.toc a[aria-disabled="true"]').count() == 2
    assert page.locator('.toc a[href="#cp-computer"]').get_attribute('tabindex') == '-1'
    assert '暂时离线' in page.locator('.toc a[href="#cp-computer"]').get_attribute('title')
    page.locator('.toc a[href="#cp-computer"]').click(force=True)
    assert page.evaluate('location.hash === "" && !window.tocClicks')
    assert page.locator('.toc a[href="#static"]').is_enabled()
    page.evaluate("feed('ready','测试成功状态 A')")
    page.wait_for_function("CockpitOffline.state === 'live'")
    assert page.locator('.cp-need button').is_visible()
    assert page.locator('.toc a[aria-disabled="true"]').count() == 0
    assert page.locator('.toc a[href="#cp-computer"]').get_attribute('title') == '原目录说明'
    assert page.locator('.toc a[href="#cp-computer"]').get_attribute('tabindex') == '0'
    page.locator('.toc a[href="#cp-computer"]').click()
    assert page.evaluate('location.hash === "#cp-computer" && tocClicks === 1')
    page.evaluate("feed('error','当前未知')")
    page.wait_for_function("CockpitOffline.state === 'cached'")
    assert page.locator('.toc a[aria-disabled="true"]').count() == 0
    assert page.locator('.cp-headline').inner_text() == '测试成功状态 A'
    assert page.locator('.cp-need a').get_attribute('href') == '/mcp/'
    assert page.locator('.cp-need button').count() == 0
    assert '北京时间' in page.locator('.cockpit-offline-notice').inner_text()
    boot()
    page.wait_for_function("CockpitOffline.state === 'cached'")
    assert page.locator('.cp-headline').inner_text() == '测试成功状态 A'
    page.evaluate("feed('ready','测试成功状态 B')")
    page.wait_for_function("CockpitOffline.state === 'live'")
    assert page.locator('.cp-headline').inner_text() == '测试成功状态 B'
    assert page.locator('.cp-need button').is_visible()
    assert not page.locator('.cockpit-offline-notice').is_visible()
    browser.close()
print('PASS: empty, successful read, interruption, cached reload, recovery')

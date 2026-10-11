import argparse, hashlib, json, os, re, tempfile, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright
ap=argparse.ArgumentParser(); ap.add_argument('base'); ap.add_argument('output',type=Path); args=ap.parse_args()
args.output.mkdir(parents=True,exist_ok=True)
tmp=Path(os.environ.get('TEMP','E:/Cache/Codex/Temp/visitor-eff1ce49')); tmp.mkdir(parents=True,exist_ok=True)
with urllib.request.urlopen('http://127.0.0.1:18793/computer-access/api/status',timeout=20) as r: snapshot=r.read()
data=json.loads(snapshot); results=[]
unwrap=lambda x:x.get('value') if isinstance(x,dict) and 'value' in x else x
disk=next(v for v in data['hardware']['volumes'] if unwrap(v['letter'])=='E:')
expected=f"{unwrap(disk['free_bytes'])/2**30:.2f} GiB 可用（剩余 {unwrap(disk['free_bytes'])/unwrap(disk['total_bytes'])*100:.1f}%）"
with sync_playwright() as p:
 for width in (1920,390):
  with tempfile.TemporaryDirectory(prefix='visitor-chrome-',dir=tmp,ignore_cleanup_errors=True) as profile:
   ctx=p.chromium.launch_persistent_context(profile,headless=True,executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',viewport={'width':width,'height':844 if width==390 else 1000},has_touch=width==390,is_mobile=width==390)
   try:
    ctx.route('**/__status*',lambda route:route.fulfill(body=snapshot,content_type='application/json'))
    page=ctx.pages[0]; errors=[]; page.on('pageerror',lambda e,sink=errors:sink.append(str(e)))
    orient='.ts-v' if width==390 else '.ts-h'
    def go(path):
     assert page.goto(args.base.rstrip('/')+path,wait_until='domcontentloaded').status==200
     page.wait_for_timeout(1200)
    def shot(name): page.screenshot(path=str(args.output/f'{name}-{width}.png'))
    def clear_anchor(id):
     value=page.evaluate('''id=>{const t=document.getElementById(id),bars=[...document.querySelectorAll('#site-header,nav.toc,.cp-bar')].filter(n=>n.getClientRects().length&&['fixed','sticky'].includes(getComputedStyle(n).position));return {top:t.getBoundingClientRect().top,bottom:Math.max(0,...bars.map(n=>n.getBoundingClientRect().bottom))}}''',id)
     assert value['top']>=value['bottom']-1, (id,value)
     return value
    go('/rules/charter/#L8'); clear_anchor('L8'); shot('I08-L8')
    assert page.evaluate('''()=>Array.from({length:30},(_,i)=>'L'+(i+1)).every(id=>{const n=document.querySelectorAll('[id="'+id+'"]');return n.length===1&&n[0].matches('.rule-original-prose p,.rule-original-prose .ct-heading')&&n[0].textContent.trim().startsWith(id+' ')})''')
    for clause in ('L22','L26'):
     page.evaluate('id=>location.hash=id',clause); page.wait_for_timeout(700); clear_anchor(clause); shot('I08-'+clause)
    go('/how/#map'); clear_anchor('map')
    node=page.locator('#how-02 '+orient+' [data-how-node="agents"]')
    if width==390: node.locator('a').tap()
    else: node.locator('a').click()
    page.wait_for_timeout(250)
    # 点一项只选中不跳页：被点的那项实心标出，有往来的标“给它/它给”，底部卡片写明从谁拿、交给谁并带进页面的按钮
    assert '/how/' in page.url and page.locator('#how-02').get_attribute('data-how-map-focus')=='agents'
    assert page.locator('#how-02 '+orient+' .how-map-current').count()==1
    assert page.locator('#how-02 '+orient+' .how-map-dim').count()>0
    assert page.locator('#how-02 '+orient+' .how-map-related').count()>1
    assert page.locator('#how-02 '+orient+' .how-map-related .how-map-tag').first.inner_text() in ('给它','它给','互相给')
    card=page.locator('.how-map-card'); assert card.is_visible() and page.locator('.how-map-relation').count()>0
    assert card.locator('a.how-map-go').get_attribute('href')=='/projects/agents/'; shot('I07-map')
    page.keyboard.press('Escape'); assert card.is_hidden()
    if width==390:
     node.locator('a').tap(); node.locator('a').tap(); page.wait_for_url('**/projects/agents/')
    else:
     node.locator('a').focus(); page.keyboard.press('Tab'); page.keyboard.press('Shift+Tab')
     assert page.locator('#how-02').get_attribute('data-how-map-focus')=='agents'
    go('/skills/report-page/')
    first=page.locator(orient+' .slot-shot-frame[data-href]').first
    href=first.get_attribute('data-href'); assert href.startswith('/assets/')
    first.click(); page.locator('dialog[open] img').wait_for(state='visible')
    page.wait_for_function("[...document.querySelectorAll('dialog[open] img')].some(n=>n.naturalWidth>0)")
    page.locator('dialog[open] img').evaluate('(n)=>n.decode()'); assert '/skills/report-page/0' not in page.url; page.wait_for_timeout(200); shot('I01-image-open'); page.keyboard.press('Escape')
    link=page.locator(orient+' a[href="/rules/charter/#L26"]').first
    link.click(); page.wait_for_url('**/rules/charter/#L26'); page.wait_for_timeout(1000); clear_anchor('L26'); shot('I08-skill-link')
    go('/projects/agents/')
    card=page.locator('#agents-02 '+orient).get_by_text(re.compile('10 月 5、12、19、26 日是四周稳定期')).last
    assert '常驻每周治理继续' in card.inner_text(); card.scroll_into_view_if_needed(); shot('I09-weekly')
    go('/cockpit/'); page.wait_for_function("window.SiteB2?.getSnapshot().phase==='ready'",timeout=45000)
    order=page.locator('.cp-grid').evaluate('(n)=>[...n.children].map(x=>x.id||x.className)')
    assert order[:5]==['cp-conclusion','cp-security','cp-river','cp-services','cp-cloud'],order
    shot('I04-cockpit-top')
    summary=page.locator('.cp-following > summary'); summary.click()
    assert page.locator('.cp-following').get_attribute('open') is not None; shot('todo-mouse-open')
    summary.click()
    disk_line=page.locator('#cp-computer .cp-insight').filter(has_text='E盘：').first
    assert expected in disk_line.inner_text(), (expected,disk_line.inner_text())
    for anchor in ('pc','backups','tasks'):
     page.locator('nav.toc a[href="#'+anchor+'"]').click(); page.wait_for_timeout(900); clear_anchor(anchor); shot('I12-'+anchor)
    disk_line.scroll_into_view_if_needed(); shot('E-disk')
    page.locator('a.cp-stutter-entry').click(); page.wait_for_url('**/cockpit/stutter/')
    page.wait_for_function("document.getElementById('headline').textContent!=='正在连接电脑…'",timeout=30000); shot('extra-stutter')
    bad=[]; capture_bad=lambda r,sink=bad:sink.append([r.status,r.url]) if r.status>=400 and r.request.resource_type in ['image','script','stylesheet','font'] else None
    page.on('response',capture_bad)
    go('/computer-access/')
    for section in page.locator('main .screen').all(): section.scroll_into_view_if_needed(); page.wait_for_timeout(150)
    page.wait_for_timeout(1000)
    assert page.evaluate("typeof window.SiteB2?.getSnapshot==='function'")
    assert not page.locator('img').evaluate_all('ns=>ns.filter(n=>n.getClientRects().length&&(!n.complete||!n.naturalWidth)).map(n=>n.currentSrc||n.src)'), '授权页坏图'
    assert not bad,bad
    page.evaluate('scrollTo(0,0)'); shot('extra-computer-access'); page.remove_listener('response',capture_bad)
    go('/projects/agents/#tech'); clear_anchor('tech'); shot('I12-project-tech')
    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
    assert not errors,errors
    results.append({'width':width,'status':'PASS','expected_disk':expected,'grid_order':order,'page_errors':errors})
   finally: ctx.close()
(args.output/'results.json').write_text(json.dumps({'chrome':r'C:\Program Files\Google\Chrome\Application\chrome.exe','status_source':'本机 127.0.0.1:18793 只读状态，经本地预览路由回放','status_sha256':hashlib.sha256(snapshot).hexdigest(),'results':results},ensure_ascii=False,indent=2),encoding='utf-8')
print('PASS: 1920 / 390，原图、全景联动、30条款、常驻说明、驾驶舱磁盘与鼠标明细、目录避让')

import argparse, json, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser(); ap.add_argument('base'); ap.add_argument('output', type=Path); ap.add_argument('--grid-only', action='store_true'); args = ap.parse_args()
args.output.mkdir(parents=True, exist_ok=True); results = []
routes = ['/how/', '/projects/', '/skills/', '/rules/', '/projects/pcconfig/', '/skills/report-page/', '/how-this-site/', '/projects/agents/', '/projects/localocr/', '/projects/personal-media/', '/rules/charter/', '/rules/privacy-data/']
chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
with sync_playwright() as p:
 for width in ((1920,) if args.grid_only else (390, 1920)):
  with tempfile.TemporaryDirectory(prefix='backtop-chrome-', dir=os.environ['TEMP'], ignore_cleanup_errors=True) as profile:
   ctx = p.chromium.launch_persistent_context(profile, executable_path=chrome, headless=True, viewport={'width': width, 'height': 844 if width == 390 else 1000}, is_mobile=width == 390, has_touch=width == 390)
   try:
    page = ctx.pages[0]
    for route in (['/projects/pcconfig/'] if args.grid_only else routes):
     row = {'route': route, 'width': width}; name = route.strip('/').replace('/', '-')
     try:
      row['status'] = page.goto(args.base.rstrip('/') + route, wait_until='domcontentloaded').status
      page.wait_for_timeout(800)
      if route == '/projects/pcconfig/' and width == 1920:
       page.emulate_media(reduced_motion='reduce'); row['grids'] = page.locator('#pcconfig-20 .ts-h .feature-group-grid,#pcconfig-22 .ts-h .feature-group-grid').evaluate_all("gs=>gs.filter(g=>g.children.length%3===2&&[...g.children].slice(-2).every(n=>!n.style.gridColumn)).map(g=>{const b=g.getBoundingClientRect(),rs=[...g.children].map(n=>n.getBoundingClientRect());return {screen:g.closest('.ts-screen').id,count:rs.length,width:b.width,first_width:rs[0].width,last:rs.slice(-2).map(r=>({width:r.width,y:r.y})),gap:b.right-rs.at(-1).right}})")
       for screen in ('pcconfig-20', 'pcconfig-22'):
        grid = page.locator('#'+screen+' .ts-h .feature-group-grid').last; grid.scroll_into_view_if_needed(); page.wait_for_timeout(1000); grid.screenshot(path=str(args.output / f'{screen}-lastrow-1920.png'))
       row['grid_passed'] = bool(row['grids']) and all(abs(g['gap']) < 1 and abs(g['last'][0]['width']-g['last'][1]['width']) < 1 and abs(g['last'][0]['y']-g['last'][1]['y']) < 1 for g in row['grids']); page.emulate_media(reduced_motion='no-preference')
      page.evaluate("scrollTo({top:Math.min(1800,Math.max(600,(document.documentElement.scrollHeight-innerHeight)/2)),behavior:'instant'})")
      page.wait_for_timeout(350)
      row['before'] = page.locator('.back-to-top').evaluate("b=>{const r=b.getBoundingClientRect(),s=getComputedStyle(b),h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {scroll_y:scrollY,opacity:s.opacity,pointer_events:s.pointerEvents,z_index:s.zIndex,hit:b===h||b.contains(h),interceptor:h?.className,box:{x:r.x,y:r.y,width:r.width,height:r.height}}}")
      page.screenshot(path=str(args.output / f'{name}-{width}-button.png'))
      page.evaluate("window.backtopTrusted=false;document.querySelector('.back-to-top').addEventListener('click',e=>window.backtopTrusted=e.isTrusted,{once:true})")
      if width == 390: page.locator('.back-to-top').tap(timeout=1500)
      else: page.locator('.back-to-top').click(timeout=1500)
      page.wait_for_function('scrollY === 0', timeout=4000)
      row['after_y'] = page.evaluate('scrollY'); row['trusted'] = page.evaluate('window.backtopTrusted')
      row['passed'] = row['status'] == 200 and row['before']['scroll_y'] > 100 and row['before']['hit'] and float(row['before']['opacity']) > .9 and row['trusted'] and row.get('grid_passed', True)
      page.screenshot(path=str(args.output / f'{name}-{width}-top.png'))
     except Exception as e: row.update(passed=False, error=str(e)[:1200])
     results.append(row); print(f"{width} {route} {'PASS' if row['passed'] else 'FAIL'}", flush=True)
   finally: ctx.close()
(args.output / 'results.json').write_text(json.dumps({'chrome': chrome, 'results': results}, ensure_ascii=False, indent=2), encoding='utf-8')
raise SystemExit(0 if all(r['passed'] for r in results) else 1)

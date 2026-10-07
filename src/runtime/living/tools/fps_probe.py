"""只补测正常观测窗口的实际帧率；不重跑已经通过的完整项。"""
import argparse
import json
from playwright.sync_api import sync_playwright
import browser
import build_preview
import common

def run(art,page,orient,seconds=12,update=False):
    build_preview.build(art,page,(orient,))
    path=common.ART/art/'preview'/f'{page}-{orient}.html'
    source_hash=build_preview.evidence(path)
    with sync_playwright() as pw,browser.managed(pw) as br:
        pg=browser.open_preview(br,path,orient)
        browser.wait_ready(pg)
        start=pg.evaluate('() => ({frames:living.diagnostics().frames,now:performance.now()})')
        pg.wait_for_timeout(seconds*1000)
        end=pg.evaluate('() => {const d=living.diagnostics();return {frames:d.frames,now:performance.now(),diagnostics:d};}')
        elapsed=(end['now']-start['now'])/1000
        count=end['frames']-start['frames']
        avg=round(count/elapsed,2)
        result={'fps':avg,'observed_frames':count,'observed_seconds':round(elapsed,4),'last_window_fps':end['diagnostics']['fps'],
          'phase':end['diagnostics']['phase'],'trigger':end['diagnostics']['frameGuard']['trigger'],
          'at_beijing':common.beijing_now(),'engine_source_sha256':source_hash,'passed':avg>=55 and end['diagnostics']['phase']=='live'}
    out=common.ART/art/'check';out.mkdir(exist_ok=True)
    (out/f'{page}-{orient}-fps.json').write_text(json.dumps(result,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
    if update:
        target=out/f'{page}-{orient}.json'
        old=json.loads(target.read_text(encoding='utf-8'))
        if old.get('engine_source_sha256')!=source_hash:
            raise ValueError('完整检查与本次源码不同，不能只更新帧率')
        old['fps_normal']=avg
        old['guard']['normal_12s']=result
        old['acceptance']['checks']['fps_normal']=result['passed']
        old['acceptance']['passed']=all(old['acceptance']['checks'].values())
        old['fps_rechecked_at_beijing']=common.beijing_now()
        target.write_text(json.dumps(old,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False),flush=True)
    return result

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('art');ap.add_argument('--page');ap.add_argument('--orient',choices=['h','v'],default='h')
    ap.add_argument('--seconds',type=float,default=12);ap.add_argument('--update',action='store_true');a=ap.parse_args()
    art=a.art if a.art in common.art_table() else common.art_of_page(a.art)
    if not run(art,a.page or common.art_table()[art]['pages'][0],a.orient,a.seconds,a.update)['passed']:raise SystemExit(1)

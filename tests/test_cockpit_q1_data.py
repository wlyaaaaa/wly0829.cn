"""Q1 坏数据回归：真 Chrome，本地虚构来源，禁止外部请求。"""
import os
from pathlib import Path
import unittest
from playwright.sync_api import sync_playwright
import cockpit_native_harness as h

OUT = Path(os.environ.get('Q1_SHOTS', str(h.ROOT / '.publish' / 'cockpit-q1')))

class CockpitDataTests(unittest.TestCase):
    def test_unread_http_errors_chart_and_git_time(self):
        server = h.StatusServer()
        normal = h.view(must_know={'state': 'empty', 'sources_complete': True, 'items': []},
            today_activity={'state': 'ok', 'observed_at': h.ago(seconds=20), 'timeline': [], 'summary': {}},
            changes={'today': {'commits': 6}, 'daily': [{'date': f'2026-11-{i+1:02}', 'commits': n} for i, n in enumerate([262, 217, 215, 232, 187, 119, 6, 0])]})
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=h.CHROME, headless=True)
                context = browser.new_context(viewport={'width': 1440, 'height': 1000}); h.isolate(context)
                page = context.new_page(); OUT.mkdir(parents=True, exist_ok=True)
                for name, code, body in [('unread', 200, {}), ('backend-5xx', 503, {'message': '状态投影暂时不可用'}), ('normal', 200, normal)]:
                    server.pages['/cockpit/'] = h.document({} if name == 'unread' else normal)
                    server.default = (code, body, 0)
                    page.goto(server.origin + '/cockpit/', wait_until='domcontentloaded')
                    page.wait_for_selector('html[data-cp-ready]', state='attached')
                    if name == 'backend-5xx':
                        for selector in ('[data-cp-reload]', '[data-cockpit-refresh]'):
                            page.locator(selector).first.click()
                            page.wait_for_function('(s)=>document.querySelector(s).getAttribute("aria-busy")!=="true"', arg=selector)
                        self.assertIn('后台出错（HTTP 503）：状态投影暂时不可用', page.locator('[data-cockpit-refresh-note]').inner_text())
                        self.assertNotIn('电脑没回应', page.locator('[data-cockpit-refresh-note]').inner_text())
                    if name == 'unread':
                        self.assertNotIn('今天还没有备份', page.locator('[data-cp=today]').inner_text())
                        self.assertIn('没读到', page.locator('[data-cp=today]').inner_text())
                    if name == 'normal':
                        heights = page.locator('.cp-bar').evaluate_all('(xs)=>xs.map(x=>x.getBoundingClientRect().height)')
                        for n, height in zip([262, 217, 215, 232, 187, 119, 6, 0], heights):
                            self.assertAlmostEqual(height, 110 * n / 262, delta=.1)
                    page.screenshot(path=str(OUT / f'q1-{name}.png'), full_page=True)
                    if name != 'backend-5xx': page.locator('[data-cp=today]').screenshot(path=str(OUT / f'q1-{name}-detail.png'))
                result = page.evaluate('''async () => { const {normalize}=await import('/src/cockpit/model.js'), {REGIONS}=await import('/src/cockpit/render.js'); const ctx={now:new Date('2026-11-12T03:00:00+08:00'), phase:'live', offline:false}; const raw={schema:'pcconfig.cockpit-view.v1', served_at:'2026-11-12T02:00:00+08:00', source_gaps:[{source_id:'pending'},{source_id:'today_activity'}]}; const v=normalize(raw); const old=normalize({...raw, source_gaps:[], projects:{items:[{name:'示例',run_health:'ok',overview:'ok'}]}, ai_work:{observed_at:raw.served_at,items:[{project:'示例',unmerged_branches:2,git_observed_at:'2026-11-12T01:00:00+08:00'}]}}); return {empty:REGIONS.ledger(v,ctx)+REGIONS.today(v,ctx), git:REGIONS.ledger(old,ctx), project:REGIONS.projects(old,ctx)}; }''')
                for wrong in ('没有自己的活', '没有自己定过什么', '今天还没有备份', '早些时候'):
                    self.assertNotIn(wrong, result['empty'])
                self.assertIn('2 条未合入主版本（01:00 读到）', result['git'])
                self.assertIn('后台任务 02:00 读到', result['git'])
                self.assertIn('is-green', result['project'])
                context.close(); browser.close()
        finally:
            server.close()

if __name__ == '__main__':
    unittest.main()

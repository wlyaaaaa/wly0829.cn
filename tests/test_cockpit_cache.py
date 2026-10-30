"""驾驶舱“上次读到的值”怎么保留：现行 site-astro 原生页（src/cockpit/client.js 等），真 Chrome，虚构 127.0.0.1 状态。

2026-10-11（北京时间）ff4e8595 把驾驶舱整页改成 Astro 原生页、972e0c10 删掉 site-release/ 之后，
驾驶舱不再用 B2 运行件和浏览器本地存储（localStorage）的逐格缓存：首帧是构建时那份快照，浏览器里读到新数据就原地换，
读不到就保留这次打开页面以来最后一次读到的那份（标明读到的时间），不再写任何本地存储。
这里的用例按现行做法验证同样的意思；只属于旧本地存储缓存的用例（重新加载后还在、整 24 小时过期、整页发布差量）已随产品删除，
去向写在对应位置的注释里。
"""
import importlib.util
from pathlib import Path
import tempfile
import time
import unittest
import uuid

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location('cockpit_native_harness', ROOT / 'tests' / 'cockpit_native_harness.py')
h = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(h)
_cache_spec = importlib.util.spec_from_file_location('cockpit_cache', ROOT / 'scripts' / 'prepare-cockpit-cache.py')
c = importlib.util.module_from_spec(_cache_spec)
_cache_spec.loader.exec_module(c)


class PreparationTests(unittest.TestCase):
    # 原 test_exact_html_bundle_manifest_delta 已移除：它给 site-release/cockpit/index.html 引用的 B2 运行件打缓存补丁并核对发布差量。
    # 现行驾驶舱成品里没有 B2 运行件（10-11、10-12 两次完整构建的 dist/cockpit/index.html 都不含 b2-typeset），
    # prepare() 要求恰好一个这样的引用，对现行成品已无可做；缓存补丁本身仍被 update-live-release.py 用于授权页的 B2 运行件，下面继续守住它的拒绝条件。
    def test_refuse_unknown_runtime_and_overlapping_output(self):
        with self.assertRaisesRegex(ValueError, 'anchor'):
            c.patch_cockpit_cache('void 0;')
        with tempfile.TemporaryDirectory() as tmp:
            release = Path(tmp) / 'release'
            release.mkdir()
            with self.assertRaisesRegex(ValueError, 'overlap'):
                c.prepare(release, release / 'candidate')
            busy = Path(tmp) / 'busy'
            busy.mkdir()
            (busy / 'left-over').write_text('x', encoding='utf8')
            with self.assertRaisesRegex(ValueError, 'empty'):
                c.prepare(release, busy)


class CockpitRetentionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from playwright.sync_api import sync_playwright
        cls.server = h.StatusServer()
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(executable_path=h.CHROME, headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.close()

    def setUp(self):
        self.server.respond()
        self.server.default = (503, {'status': 'error', 'reason': 'fictional_fixture_unavailable'}, 0)
        self.server.requests.clear()
        self.new_context(viewport={'width': 1440, 'height': 1000})

    def new_context(self, **kw):
        if getattr(self, 'context', None):
            self.context.close()
        self.context = self.browser.new_context(timezone_id='Asia/Shanghai', **kw)
        h.isolate(self.context)
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.context = None
        self.assertEqual(self.errors, [])
        # 驾驶舱只读不写：整个过程没有任何非 GET 请求
        self.assertEqual(self.server.writes(), [])

    # ---- 小工具 ----
    def load(self, snapshot, project_urls=None):
        path = '/cockpit-' + uuid.uuid4().hex[:8] + '/'
        self.server.pages[path] = h.document(snapshot, project_urls)
        reads = self.server.status_reads
        self.page.goto(self.server.origin + path, wait_until='domcontentloaded')
        self.page.wait_for_function('window.CockpitData')
        # 等页面自己的第一次读取到达接口（之后排队的回应才轮到测试自己的刷新）
        deadline = time.monotonic() + 5
        while self.server.status_reads == reads and time.monotonic() < deadline:
            self.page.wait_for_timeout(20)
        self.assertGreater(self.server.status_reads, reads)
        self.page.wait_for_timeout(150)

    def refresh(self, code, body=None, delay=0):
        self.server.respond((code, body if body is not None else {'status': 'error'}, delay))
        return self.page.evaluate('CockpitData.refresh()')

    def text(self, region):
        return self.page.locator(f'[data-cp="{region}"]').first.inner_text()

    def link(self):
        """“安全和授权”那一格的状态词：读到时“都正常”，读不到电脑时“连不上电脑”。"""
        return self.page.locator('.cp-tri-cell[data-signal="security"] .cp-tri-status').inner_text().strip()

    def wait_link(self, word):
        self.page.wait_for_function("(w)=>document.querySelector('.cp-tri-cell[data-signal=security] .cp-tri-status')?.textContent.trim()===w", arg=word, timeout=10000)

    def when(self, value):
        return self.page.evaluate("(v)=>import('/src/cockpit/model.js').then(m=>m.when(v))", value)

    def storage(self):
        return self.page.evaluate('()=>{try{return Object.fromEntries(Object.entries(localStorage))}catch{return null}}')

    def regions(self):
        return self.page.evaluate(h.REGIONS_JS)

    # ---- 用例 ----
    def test_success_failure_new_success_and_partial_fields(self):
        build = h.view('构建时虚构处理器', observed=h.ago(hours=2))
        self.load(build)
        # 一次都没读到：首帧就是构建时那份，写明是几点读到的；连不上电脑说清楚，不装成实时
        self.wait_link('连不上电脑')
        self.assertIn('构建时虚构处理器', self.text('computer'))
        self.assertIn(self.when(build['served_at']) + ' 读到', self.text('computer'))
        before = self.storage()

        t_a = h.ago(minutes=2)  # 在总览 180 秒时限内，安全和授权那格才算读到
        self.assertTrue(self.refresh(200, h.view('测试处理器 A', observed=t_a))['fresh'])
        self.wait_link('都正常')
        self.assertIn('测试处理器 A', self.text('computer'))

        self.assertFalse(self.refresh(503)['fresh'])
        self.wait_link('连不上电脑')
        old = self.regions()
        self.assertIn('测试处理器 A', self.text('computer'))
        self.assertIn(self.when(t_a) + ' 读到', self.text('computer'))
        self.assertIn('上次 ' + self.when(t_a), self.text('security'))
        # 读到的状态不落进浏览器本地存储（更不会存原始状态里的 state_version、授权截止这类字段）
        self.assertEqual(self.storage(), before)

        # 手机竖屏：内容和读到的时间都不变
        self.page.set_viewport_size({'width': 412, 'height': 915})
        self.page.wait_for_timeout(300)
        self.assertEqual(self.regions(), old)
        self.page.set_viewport_size({'width': 1440, 'height': 1000})

        # 新的成功：值和时间一起换掉
        t_b = h.ago(seconds=5)
        self.refresh(200, h.view('测试处理器 B', observed=t_b))
        self.wait_link('都正常')
        self.assertIn('测试处理器 B', self.text('computer'))
        self.assertNotIn('测试处理器 A', self.text('computer'))
        self.assertIn(self.when(t_b) + ' 读到', self.text('meta'))  # 10-30 批准第 5 项：几点读到只在顶上写一次
        self.assertNotEqual(self.when(t_a), self.when(t_b))

        # 只读到一部分：后端给的单项带自己的读到时间（unavailable + observed_at），整块没给的写“还没读到”
        partial = h.view('测试处理器 C')
        partial['sections']['backup_cloud'] = [{'id': 'fixture_backup', 'title': '虚构测试备份', 'text': '虚构备份都在期限内', 'state': 'unavailable', 'observed_at': t_a}]
        del partial['automation'], partial['projects']
        self.refresh(200, partial)
        self.wait_link('都正常')
        backup = self.text('backup')
        self.assertIn('这是 ' + self.when(t_a) + ' 读到的', backup)
        self.assertIn('没读到新的', backup)
        self.assertIn('还没读到', self.text('projects'))
        self.refresh(503)
        self.wait_link('连不上电脑')
        self.assertIn('测试处理器 C', self.text('computer'))
        self.assertIn('这是 ' + self.when(t_a) + ' 读到的', self.text('backup'))
        # 原用例的“重新加载后还在”“整 24 小时后过期”两段已移除：现行页面不再写本地存储，重新加载回到构建时那份快照（见 test_storage_unavailable_uses_memory_only）。

    def test_alert_headlines_name_the_problem_instead_of_the_first_normal_row(self):
        self.load(h.view(observed=h.ago(hours=1)))
        body = h.view()
        body['sections']['backup_cloud'] = [
            {'id': 'ok_backup', 'title': '正常备份', 'text': '正常备份按时完成', 'state': 'ok', 'observed_at': body['served_at']},
            {'id': 'bad_backup', 'title': '问题备份', 'text': '问题备份：备份目标没接上', 'state': 'attention', 'observed_at': body['served_at'], 'copy_ai_id': 'bad_backup'}]
        body['projects']['items'] = [
            {'id': 'a', 'name': '正常项目', 'run_health': 'ok', 'overview': 'ok'},
            {'id': 'b', 'name': '待验收项目', 'overview': 'ok', 'waiting_ai': 1, 'health_reason': 'AI 待验收'},
            {'id': 'c', 'name': '问题项目', 'run_health': 'failed', 'overview': 'run_failed', 'health_reason': '上次运行失败'}]
        body['overview']['signals'][2] = {'id': 'backup', 'level': 'act', 'value': 1}
        body['overview']['reasons'] = [{'section': 'backup_cloud', 'text': '问题备份：备份目标没接上', 'delta': -10}]
        for width in (1440, 390):
            self.page.set_viewport_size({'width': width, 'height': 1000})
            self.refresh(200, body)
            self.wait_link('都正常')
            cell = self.page.locator('.cp-tri-cell[data-signal="backup"]')
            # 手机上这一格只显示一个词（状态句收起），所以按文字内容比
            self.assertEqual(cell.locator('.cp-tri-status').text_content().strip(), '问题备份：备份目标没接上')
            # 颜色只看要不要你出手：后端没说要你做、这一格写着交给 AI 时是中性色“AI 在管”，不是红色
            self.assertIn('is-neutral', cell.get_attribute('class'))
            # 第二行小字回答要不要你管（10-30 批准第 2 项）
            self.assertEqual(cell.locator('.cp-tri-who').inner_text().strip(), 'AI 在修，不用你管')
            bad = self.page.locator('[data-cp="backup"] .cp-card.is-yellow')
            self.assertEqual(bad.count(), 1)
            self.assertIn('备份目标没接上', bad.inner_text())
            # 第三步：卡上不再有“交给 AI 处理”的复制按钮
            self.assertEqual(bad.locator('button, [data-copy-ai]').count(), 0)
            self.assertIn('正常备份', self.text('backup'))
            problem = self.page.locator('[data-cp="projects"] .cp-proj')
            self.assertEqual(problem.count(), 1)
            # 第三步：AI 在查的项目收进一行“N 个项目有小毛病，AI 在查”，点开才看是哪个
            self.assertIn('1 个项目有小毛病，AI 在查', self.page.locator('#proj-ai > summary').inner_text())
            self.assertIn('问题项目', problem.text_content())
            self.assertIn('上次运行失败', problem.text_content())
            chips = self.page.locator('[data-cp="projects"] .cp-chips').text_content()
            self.assertIn('正常项目', chips)
            self.assertIn('待验收项目', chips)
        # 后端明说要你出手（owner_action: do）时，这一格才是红色，写“要你看一眼”
        mine = h.view()
        mine['overview']['signals'][2] = {'id': 'backup', 'level': 'act', 'value': 1, 'owner_action': 'do'}
        self.refresh(200, mine)
        self.wait_link('都正常')
        cell = self.page.locator('.cp-tri-cell[data-signal="backup"]')
        self.assertIn('is-red', cell.get_attribute('class'))
        self.assertIn('要你看', cell.text_content())

    def test_storage_unavailable_uses_memory_only(self):
        self.context.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw Error('fictional storage unavailable')}})")
        build = h.view('构建时虚构处理器', observed=h.ago(hours=2))
        self.load(build)
        self.wait_link('连不上电脑')
        self.refresh(200, h.view('内存里的虚构处理器'))
        self.wait_link('都正常')
        self.refresh(503)
        self.wait_link('连不上电脑')
        self.assertIn('内存里的虚构处理器', self.text('computer'))
        # 重新加载：这次打开页面以来读到的只在内存里，回到构建时那份（写明读到时间），不凭空多出历史
        self.page.reload(wait_until='domcontentloaded')
        self.page.wait_for_function('window.CockpitData')
        self.wait_link('连不上电脑')
        self.assertIn('构建时虚构处理器', self.text('computer'))
        self.assertNotIn('内存里的虚构处理器', self.text('computer'))

    def test_initial_success_replaces_build_snapshot_and_survives_failure(self):
        self.server.default = (200, h.view('初次成功的虚构处理器'), 0)
        self.load(h.view('构建时虚构处理器', observed=h.ago(hours=2)))
        self.wait_link('都正常')
        self.page.wait_for_function("document.querySelector('[data-cp=computer]').textContent.includes('初次成功的虚构处理器')")
        self.server.default = (503, {'status': 'error'}, 0)
        self.refresh(503)
        self.wait_link('连不上电脑')
        self.assertIn('初次成功的虚构处理器', self.text('computer'))
        self.assertNotIn('构建时虚构处理器', self.text('computer'))

    def test_old_delayed_failure_cannot_replace_new_success(self):
        # 页面打开时的第一次读取很慢、最后失败；这期间点了刷新并且成功。晚到的旧失败不能把新结果说成“连不上”
        self.server.respond((503, {'status': 'error'}, 1.5), (200, h.view('最新并发测试处理器'), 0))
        self.load(h.view('构建时虚构处理器', observed=h.ago(hours=2)))
        reads = self.server.status_reads
        # 电脑版顶栏的 ↻ 看得见时右下角那个藏着（滚出去才出现）；这里只测两次读取的先后，直接按它
        self.page.evaluate("document.querySelector('[data-cockpit-refresh]').click()")
        self.page.wait_for_function("document.querySelector('[data-cockpit-refresh-note]').textContent.startsWith('已更新')", timeout=10000)
        self.page.wait_for_timeout(2000)
        self.assertGreater(self.server.status_reads, reads)
        self.assertIn('最新并发测试处理器', self.text('computer'))
        self.assertEqual(self.link(), '都正常')
        self.assertNotIn('读不到', self.page.locator('[data-cp=overview-tri] .cp-tri').inner_text())
        self.refresh(503)
        self.wait_link('连不上电脑')
        self.assertIn('最新并发测试处理器', self.text('computer'))

    def test_wrong_project_future_unknown_and_malformed_storage_are_not_history(self):
        # 旧版缓存格式的各种坏数据（别的项目、未来时间、状态未知、格式不对）留在浏览器里，也不能被当成上次读到的值
        self.context.add_init_script("""for(const [slot,project,state,at] of [
          ['cockpit-pc','another-project','ok',Date.now()],
          ['cockpit-quick-2',null,'ok',Date.now()+60001],
          ['cockpit-quick-3',null,'unknown',Date.now()]])
          localStorage.setItem('site-live:v1:cockpit:'+slot,JSON.stringify({project,result:{text:'unusable fixture',state},at}));
          localStorage.setItem('site-live:v1:cockpit:cockpit-tasks',JSON.stringify({project:null,result:{text:'bad fixture',rows:'invalid rows',state:'ok'},at:Date.now()}));""")
        self.load(h.view('构建时虚构处理器', observed=h.ago(hours=2)))
        self.wait_link('连不上电脑')
        planted = self.storage()
        self.assertEqual(len(planted), 4)
        body = self.page.locator('.cp-page').inner_text()
        self.assertNotIn('unusable fixture', body)
        self.assertNotIn('bad fixture', body)
        self.refresh(200, h.view())
        self.wait_link('都正常')
        self.refresh(503)
        self.wait_link('连不上电脑')
        self.assertNotIn('unusable fixture', self.page.locator('.cp-page').inner_text())
        self.assertEqual(self.storage(), planted)

    def test_anchor_navigation_and_repaint_do_not_change_success_time(self):
        urls = {'虚构正常项目': '/projects/fixture-project/'}
        self.load(h.view(observed=h.ago(hours=2)), project_urls=urls)
        t1 = h.ago(minutes=2)  # 在总览 180 秒时限内，安全和授权那格才算读到
        self.refresh(200, h.view(observed=t1))
        self.wait_link('都正常')
        self.assertIn(self.when(t1) + ' 读到', self.text('meta'))  # 10-30 批准第 5 项：几点读到只在顶上写一次
        # 其他页“看驾驶舱”的落点 /cockpit/#<项目>：锚点在，跳过去不改内容
        self.assertEqual(self.page.locator('#fixture-project').count(), 1)
        # 正常的项目收在“正常运行的 N 个”里：跳过来时把它打开（只多一个 open），别的不变
        shut = lambda r: {k: v.replace(' open=""', '') for k, v in r.items()}
        before = self.regions()
        self.page.evaluate("location.hash='#fixture-project';window.dispatchEvent(new Event('hashchange'))")
        self.page.wait_for_timeout(200)
        self.assertEqual(shut(self.regions()), shut(before))
        self.assertTrue(self.page.locator('#fixture-project').is_visible())
        # 之后读不到、重画：读到的时间还是当时那次，不被改成重画的时间
        self.page.wait_for_timeout(1100)
        self.refresh(503)
        self.wait_link('连不上电脑')
        self.assertIn(self.when(t1) + ' 读到', self.text('computer'))
        self.assertEqual(self.storage(), {})

    def test_android_412x915_profile_never_shows_unreachable_graph(self):
        self.new_context(viewport={'width': 412, 'height': 915}, device_scale_factor=3.5, is_mobile=True, has_touch=True,
                         user_agent='Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36')
        self.load(h.view(observed=h.ago(hours=2)))
        good = h.view()
        good['grafana'] = {'state': 'ok', 'checked_at': good['served_at'], 'links': [
            {'id': 'cpu-gpu', 'label': 'CPU 和显卡', 'url': 'https://fixture-graph.invalid/public-dashboards/a'},
            {'id': 'memory-network', 'label': '内存和网络', 'url': 'https://fixture-graph.invalid/public-dashboards/b'}]}
        self.refresh(200, good)
        self.wait_link('都正常')
        charts = self.page.locator('#grafana a.cp-chart:not(.cp-login)')
        self.assertEqual(charts.count(), 2)
        # 曲线只给新标签页链接，不内嵌实时图，也不存进浏览器
        self.assertEqual(self.page.locator('iframe').count(), 0)
        self.assertEqual(self.storage(), {})
        checked = h.ago(hours=1)
        stale = h.view()
        stale['grafana'] = {'state': 'unavailable', 'checked_at': checked, 'links': []}
        self.refresh(200, stale)
        self.wait_link('都正常')
        self.assertEqual(charts.count(), 0)
        self.assertIn('图表网页现在打不开（上次检查 ' + self.when(checked) + '）', self.text('computer'))
        self.refresh(503)
        self.wait_link('连不上电脑')
        rows = self.regions()
        self.assertEqual(charts.count(), 0)
        self.assertEqual(self.page.locator('iframe').count(), 0)
        self.assertIn('测试处理器 A', self.text('computer'))
        self.page.set_viewport_size({'width': 915, 'height': 412})
        self.page.wait_for_timeout(300)
        self.assertEqual(self.regions(), rows)


if __name__ == '__main__':
    unittest.main()

"""Exact artifact checks and real cockpit DOM paths with fictional loopback status."""
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import json
import os
from pathlib import Path
import threading
import time
import unittest
from urllib.parse import unquote, urlsplit
import uuid

ROOT = Path(__file__).resolve().parents[1]
RELEASE = Path(os.environ.get('WLY_TEST_RELEASE_ROOT', ROOT/'site-release')).resolve()
spec = importlib.util.spec_from_file_location('cockpit_cache', ROOT/'scripts/prepare-cockpit-cache.py')
c = importlib.util.module_from_spec(spec)
spec.loader.exec_module(c)
live_spec = importlib.util.spec_from_file_location('live_update', ROOT/'scripts/update-live-release.py')
live_update = importlib.util.module_from_spec(live_spec)
live_spec.loader.exec_module(live_update)
NOW = 1791043260000  # 2026-10-04 00:01 Beijing; entirely fictional test time.


def fixture(model='测试处理器 A'):
    observed = '2026-10-03T16:01:00+00:00'
    items = lambda xs: {'state': 'ok', 'items': xs, 'observed_at': observed, 'max_age_seconds': 120}
    sample = lambda row: {**row, 'state': 'ok', 'sources': {key: {'status': 'ok', 'observed_at_unix': NOW/1000} for key in row}}
    return {'status': 'ok', 'observed_at_unix': NOW/1000-3600, 'state_version': 'fixture-only',
        'host': {'uptime_seconds': 7200, 'screen_state': 'locked'},
        'personal_data': {'state': 'unlocked', 'expires_at_unix': NOW/1000+3600},
        'unrestricted': {'state': 'inactive'},
        'hardware': {'state': 'ok', 'cpu': sample({'model': model, 'usage_percent': 12, 'temperature_celsius': 40, 'power_watts': 20}),
            'memory': sample({'used_bytes': 1073741824, 'total_bytes': 2147483648}),
            'network': sample({'connected': True, 'download_bytes_per_second': 0, 'upload_bytes_per_second': 0}), 'display': sample({'width_px': 1440, 'height_px': 1000, 'refresh_hz': 60}), 'gpus': [], 'volumes': []},
        'automation': items([{'id': 'fixture-task', 'enabled': True, 'mine': True,
            'state': 'success', 'runs_today': True, 'plain': {'name': '虚构测试任务'}, 'last_run_at': observed, 'next_run_at': observed}]),
        'backups': items([{'id': 'fixture-backup', 'enabled': True, 'state': 'success',
            'plain': {'name': '虚构测试备份'}, 'last_success_at': '2026-10-03T15:00:00Z'}]),
        'pending': items([]), 'projects': items([]), 'today': items([])}


def latest_release(output):
    """Keep the real page and manifest; apply the owned canonical B2 source."""
    output.mkdir(parents=True, exist_ok=True)
    html = (RELEASE/'cockpit/index.html').read_bytes()
    old_ref = __import__('re').search(rb'<script[^>]*src="([^"]*b2-typeset-[a-f0-9]+\.js)"', html).group(1)
    old_rel = old_ref.decode().lstrip('/') if old_ref.startswith(b'/') else 'cockpit/' + old_ref.decode()
    compiled = live_update.patch_b2_runtime((RELEASE/old_rel).read_text('utf8')).encode('utf8')
    new_rel = 'cockpit/assets/b2-typeset-'+hashlib.sha256(compiled).hexdigest()[:16]+'.js'
    new_ref = 'assets/' + Path(new_rel).name
    for rel, body in [('cockpit/index.html', html.replace(old_ref,new_ref.encode(),1)),(new_rel,compiled)]:
        path=output/rel;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(body)
    manifest=json.loads((RELEASE/'release-manifest.json').read_text('utf8'))
    manifest['files']['cockpit/index.html']=c.proof((output/'cockpit/index.html').read_bytes())
    manifest['files'][new_rel]=c.proof(compiled)
    (output/'release-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
    return output


class PreparationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.artifacts = ROOT/'.publish'/'cockpit-cache-tests'/uuid.uuid4().hex
        cls.latest = latest_release(cls.artifacts/'latest-input')
        cls.receipt = c.prepare(cls.latest, cls.artifacts/'candidate')

    def test_exact_html_bundle_manifest_delta(self):
        receipt = self.receipt
        self.assertEqual(len(receipt['files']), 2)
        new = next(p for p in receipt['files'] if p.endswith('.js'))
        body = Path(receipt['files'][new]['source_path']).read_bytes()
        self.assertTrue(Path(new).stem.endswith(hashlib.sha256(body).hexdigest()[:20]))
        self.assertEqual(c.patch_cockpit_cache(body.decode()), body.decode())
        before = (self.latest/'cockpit/index.html').read_bytes()
        after = Path(receipt['files']['cockpit/index.html']['source_path']).read_bytes()
        old_ref, new_ref = next(iter(receipt['html_replacements'].items()))
        self.assertEqual(after, before.replace(old_ref.encode(), new_ref.encode(), 1))
        original = json.loads((self.latest/'release-manifest.json').read_text('utf8'))
        updated = json.loads((self.artifacts/'candidate/release-manifest.json').read_text('utf8'))
        for key in original.keys()-{'files', 'prepared_at_beijing', 'release_id'}:
            self.assertEqual(updated[key], original[key], key)
        delta = {p for p in set(original['files'])|set(updated['files'])
            if original['files'].get(p) != updated['files'].get(p)}
        self.assertEqual(delta, set(receipt['files']))
        self.assertEqual(updated['release_id'], hashlib.sha256(json.dumps(updated['files'], sort_keys=True).encode()).hexdigest())

    def test_refuse_unknown_runtime_and_overlapping_output(self):
        with self.assertRaisesRegex(ValueError, 'anchor'):
            c.patch_cockpit_cache('void 0;')
        with self.assertRaisesRegex(ValueError, 'overlap'):
            c.prepare(RELEASE, RELEASE/'candidate')
        with self.assertRaisesRegex(ValueError, 'empty'):
            c.prepare(RELEASE, self.artifacts/'candidate')


class CockpitDOMTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from playwright.sync_api import sync_playwright
        cls.artifacts = ROOT/'.publish'/'cockpit-cache-dom'/uuid.uuid4().hex
        cls.latest = latest_release(cls.artifacts/'latest-input')
        cls.receipt = c.prepare(cls.latest, cls.artifacts/'candidate')
        cls.records = []
        cls.status_queue = []
        cls.status_count = 0
        cls.status_default = (503, {'status': 'error', 'reason': 'fictional_fixture_unavailable'}, 0)
        cls.lock = threading.Lock()

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *_): pass
            def do_GET(self):
                path = unquote(urlsplit(self.path).path)
                if path in ('/__status', '/computer-access/api/status'):
                    with cls.lock:
                        cls.status_count += 1
                        code, body, delay = cls.status_queue.pop(0) if cls.status_queue else cls.status_default
                    time.sleep(delay)
                    payload = json.dumps(body).encode()
                    self.send_response(code)
                    self.send_header('Content-Type', 'application/json')
                else:
                    rel = (path.lstrip('/')+'index.html') if path.endswith('/') else path.lstrip('/')
                    file = cls.artifacts/'candidate/files'/rel
                    if not file.is_file(): file = RELEASE/rel
                    if not file.is_file(): self.send_error(404); return
                    payload = file.read_bytes()
                    if file.name.startswith('b2-access-model-'):
                        # Only the test HTTP response recognizes the explicit fixture origin.
                        payload = payload.replace(b'https://mcp.wly0829.cn', cls.origin.encode()).replace(b'https://wly0829.cn', cls.origin.encode())
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/javascript' if file.suffix=='.js' else 'text/css' if file.suffix=='.css' else 'text/html')
                self.send_header('Cache-Control', 'no-store')
                self.send_header('Content-Length', str(len(payload)))
                self.end_headers()
                try: self.wfile.write(payload)
                except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError): pass

        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        cls.server.daemon_threads = True
        cls.origin = 'http://127.0.0.1:'+str(cls.server.server_port)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.playwright = sync_playwright().start()
        runtime_temp = cls.artifacts/'runtime-temp'
        runtime_temp.mkdir(parents=True,exist_ok=True)
        os.environ['TEMP']=os.environ['TMP']=str(runtime_temp)
        cls.browser = cls.playwright.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(2)
        (cls.artifacts/'dom-evidence.json').write_text(json.dumps(cls.records, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
        print('DOM evidence: '+str(cls.artifacts/'dom-evidence.json'))

    def setUp(self):
        self.__class__.status_queue = []
        self.__class__.status_default = (503, {'status': 'error', 'reason': 'fictional_fixture_unavailable'}, 0)
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000})
        self.context.add_init_script('window.fixtureNow='+str(NOW)+';Date.now=()=>window.fixtureNow;')
        self.context.route('**/*', lambda route: route.abort() if urlsplit(route.request.url).hostname!='127.0.0.1' or route.request.resource_type in ('image','media','font') else route.continue_())
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def load(self, phase='error'):
        self.page.goto(self.origin+'/cockpit/', wait_until='domcontentloaded')
        self.page.wait_for_function('window.SiteB2 && SiteB2.getSnapshot().phase==='+json.dumps(phase))
        self.page.wait_for_function("new Set([...document.querySelectorAll('[data-b2-slot]')].map(x=>x.dataset.b2Slot)).size===17")

    def refresh(self, code, body, advance=0):
        self.page.evaluate('window.fixtureNow += '+str(advance))
        if code==200:
            now=self.page.evaluate('Date.now()')
            body['observed_at_unix'] = now/1000
            observed=__import__('datetime').datetime.fromtimestamp(now/1000,__import__('datetime').timezone.utc).isoformat()
            for key in ['automation','backups','projects','pending','today']:
                if key in body: body[key]['observed_at']=observed
            for row in [body.get('hardware',{}).get('cpu',{}),body.get('hardware',{}).get('memory',{}),body.get('hardware',{}).get('network',{}),body.get('hardware',{}).get('display',{})]:
                for source in row.get('sources',{}).values(): source['observed_at_unix']=now/1000
        self.__class__.status_queue = [(code, body, 0)]
        self.page.evaluate('SiteB2.refresh()')

    def snapshot(self, name):
        result = self.page.evaluate("""()=>({phase:SiteB2.getSnapshot().phase,lastRead:SiteB2.getSnapshot().lastRead,
          slots:[...document.querySelectorAll('[data-b2-slot]')].map(el=>({slot:el.dataset.b2Slot,state:el.dataset.state,
            cached:el.dataset.cached,lastReadAt:el.dataset.lastReadAt,text:el.textContent||el.getAttribute('aria-label'),
            childStates:[...el.querySelectorAll('[data-state]')].map(x=>x.dataset.state)}))})""")
        self.assertEqual(len({row['slot'] for row in result['slots']}), 17)
        # The actual layout also has a lamp sub-part for one of those 17 values.
        for row in result['slots']:
            if row['cached']=='true':
                self.assertEqual(row['state'], 'unknown')
                self.assertEqual(row['childStates'], [])
        self.records.append({'case': name, **result})
        return {x['slot']: x for x in result['slots']}

    def test_success_failure_reload_expiry_new_success_and_partial_fields(self):
        self.load()
        blank = self.snapshot('no-history-failure')
        self.assertTrue(all(x['state']=='unknown' and x['text']=='暂时读不到电脑' for x in blank.values()))
        self.refresh(200, fixture())
        current = self.snapshot('first-success')
        self.assertIn('测试处理器 A', current['cockpit-pc']['text'])
        self.refresh(503, {'status': 'error'})
        old = self.snapshot('first-success-then-failure')
        self.assertTrue(self.page.evaluate("[...document.querySelectorAll('[data-b2-action]')].filter(x=>!['refresh','results','query','host-query','copy-note','copy-address'].includes(x.dataset.b2Action)).every(x=>x.disabled)"))
        self.assertFalse(self.page.evaluate("Object.entries(localStorage).filter(([key])=>key.startsWith('site-live:v1:cockpit:')).some(([,value])=>value.includes('state_version')||value.includes('csrf_token')||value.includes('expires_at_unix'))"))
        for slot, row in old.items():
            self.assertEqual(row['state'], 'unknown')
            self.assertEqual(row['childStates'], [])
            if slot in ('cockpit-remote','cockpit-grafana'):
                self.assertEqual(row['cached'], 'false')
            else:
                self.assertEqual(row['cached'], 'true', slot)
                self.assertIn('上次读到 今天 00:01', row['text'])
                self.assertIn('当前状态未知', row['text'])
        self.page.set_viewport_size({'width':412,'height':915})
        self.page.wait_for_function("new Set([...document.querySelectorAll('[data-b2-slot]')].map(x=>x.dataset.b2Slot)).size===17")
        mobile = self.snapshot('mobile-orientation-keeps-cache-time-and-unknown-state')
        self.assertEqual(old, mobile)
        self.page.set_viewport_size({'width':1440,'height':1000})
        self.page.reload(wait_until='domcontentloaded')
        self.page.wait_for_function('window.SiteB2 && SiteB2.getSnapshot().phase==="error"')
        reloaded = self.snapshot('reload-persistent-cache')
        self.assertEqual(old, reloaded)
        self.refresh(503, {'status': 'error'}, 86400000)
        expired = self.snapshot('exactly-24-hours-expired')
        self.assertTrue(all(x['cached']=='false' and x['state']=='unknown' and x['text']=='暂时读不到电脑' for x in expired.values()))
        self.refresh(200, fixture('测试处理器 B'), 60000)
        self.refresh(503, {'status': 'error'})
        new = self.snapshot('new-success-replaces-value-and-date')
        self.assertIn('测试处理器 B', new['cockpit-pc']['text'])
        self.assertNotIn('测试处理器 A', new['cockpit-pc']['text'])
        self.assertIn('上次读到 今天 00:02', new['cockpit-pc']['text'])
        self.assertNotEqual(new['cockpit-pc']['lastReadAt'], old['cockpit-pc']['lastReadAt'])
        partial = fixture('测试处理器 C')
        partial['hardware'] = {'cpu': {'model': '测试处理器 C'}}
        del partial['automation']
        self.refresh(200, partial, 60000)
        partial_current = self.snapshot('partial-current-response')
        self.assertEqual(partial_current['cockpit-tasks']['state'], 'unknown')
        self.refresh(503, {'status': 'error'})
        partial_old = self.snapshot('partial-fields-have-their-own-last-success-time')
        self.assertIn('测试处理器 C', partial_old['cockpit-pc']['text'])
        self.assertIn('内存：暂无数据', partial_old['cockpit-pc']['text'])
        self.assertIn('上次读到 今天 00:03', partial_old['cockpit-pc']['text'])
        self.assertIn('上次读到 今天 00:02', partial_old['cockpit-tasks']['text'])
        self.assertEqual(self.page.evaluate('SiteB2.getSnapshot().lastRead'), (NOW+86400000+120000)/1000)

    def test_alert_headlines_name_the_problem_instead_of_the_first_normal_row(self):
        self.load()
        body = fixture()
        body['backups']['items'] = [
            {'name': '正常备份', 'state': 'success', 'last_success_at': '2026-10-03T16:01:00+00:00'},
            {'name': '问题备份', 'state': 'warn', 'status_note': '备份目标没接上'}]
        body['projects']['items'] = [
            {'project': '正常项目', 'overview': 'ok'},
            {'project': '待验收项目', 'waiting_ai_count': 1, 'health_reason': 'AI 待验收'},
            {'project': '问题项目', 'run_health': 'failed', 'overview': 'run_failed', 'health_reason': '上次运行失败'}]
        for width in (1440, 390):
            self.page.set_viewport_size({'width': width, 'height': 1000})
            self.refresh(200, body)
            for slot, expected, state in [('cockpit-backups', '问题备份：需要留意；备份目标没接上', 'warn'),
                                          ('cockpit-projects', '问题项目：上次运行失败', 'error')]:
                card = self.page.locator('[data-b2-slot="'+slot+'"] .live-status-card').first
                self.page.wait_for_function('(x)=>document.querySelector(\'[data-b2-slot="\'+x.slot+\'"] .live-status-state\')?.textContent===x.expected', arg={'slot': slot, 'expected': expected}, timeout=5000)
                self.assertEqual(card.locator('.live-status-state').text_content(), expected)
                self.assertEqual(card.get_attribute('data-state'), state)
            self.assertIn('正常备份', self.page.locator('[data-b2-slot="cockpit-backups"]').first.text_content())
            self.assertIn('待验收项目', self.page.locator('[data-b2-slot="cockpit-projects"]').first.text_content())
            self.snapshot('alert-headlines-'+str(width))

    def test_storage_unavailable_uses_memory_only(self):
        self.context.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw Error('fictional storage unavailable')}})")
        self.load()
        self.refresh(200, fixture())
        self.refresh(503, {'status': 'error'})
        self.assertEqual(self.snapshot('storage-unavailable-in-page-memory')['cockpit-pc']['cached'], 'true')
        self.page.reload(wait_until='domcontentloaded')
        self.page.wait_for_function('window.SiteB2 && SiteB2.getSnapshot().phase==="error"')
        rows = self.snapshot('storage-unavailable-reload-no-history')
        self.assertTrue(all(x['cached']=='false' for x in rows.values()))

    def test_initial_success_is_cached_before_layout_finishes(self):
        self.__class__.status_default = (200, fixture('初次成功的虚构处理器'), 0)
        self.load('ready')
        self.refresh(503, {'status':'error'})
        rows=self.snapshot('initial-success-can-arrive-before-layout')
        self.assertEqual(rows['cockpit-pc']['cached'], 'true')
        self.assertIn('初次成功的虚构处理器', rows['cockpit-pc']['text'])

    def test_bad_cache_and_old_concurrent_failure_cannot_replace_new_success(self):
        self.context.add_init_script("""localStorage.setItem('site-live:v1:cockpit:cockpit-pc',JSON.stringify({project:null,
          result:{text:'bad fixture',rows:'invalid rows',state:'ok'},at:Date.now()}));""")
        self.load()
        self.assertEqual(self.snapshot('malformed-cache-stays-unknown')['cockpit-pc']['cached'], 'false')
        with self.lock:
            count = self.status_count
            self.__class__.status_queue = [(503, {'status':'error'}, .4), (200, fixture('最新并发测试处理器'), 0)]
        self.page.evaluate('void SiteB2.refresh()')
        deadline = time.monotonic()+2
        while self.status_count==count and time.monotonic()<deadline: self.page.wait_for_timeout(10)
        self.assertGreater(self.status_count, count)
        self.page.evaluate('SiteB2.refresh()')
        self.page.wait_for_timeout(600)
        rows = self.snapshot('new-success-survives-old-delayed-failure')
        self.assertEqual(self.page.evaluate('SiteB2.getSnapshot().phase'), 'ready')
        self.assertIn('最新并发测试处理器', rows['cockpit-pc']['text'])
        self.refresh(503, {'status':'error'})
        self.assertIn('最新并发测试处理器', self.snapshot('concurrent-new-success-is-the-cached-value')['cockpit-pc']['text'])

    def test_wrong_project_future_and_unknown_cache_are_not_history(self):
        self.context.add_init_script("""for(const [slot,project,state,at] of [
          ['cockpit-quick-1','another-project','ok',Date.now()],
          ['cockpit-quick-2',null,'ok',Date.now()+60001],
          ['cockpit-quick-3',null,'unknown',Date.now()]])
          localStorage.setItem('site-live:v1:cockpit:'+slot,JSON.stringify({project,result:{text:'unusable fixture',state},at}));""")
        self.load()
        rows=self.snapshot('wrong-project-future-and-unknown-cache')
        self.assertTrue(all(x['cached']=='false' and x['text']=='暂时读不到电脑' for x in rows.values()))

    def test_anchor_filter_is_not_saved_and_render_does_not_change_success_time(self):
        self.load()
        target=self.page.evaluate("JSON.parse(document.querySelector('#page-data').textContent).b2_live_anchors.find(x=>x.lands_on==='cockpit-tasks'&&x.api_project)")
        self.assertIsNotNone(target)
        self.page.evaluate('location.hash='+json.dumps(target['id']))
        self.refresh(200, fixture())
        saved=self.page.evaluate("JSON.parse(localStorage.getItem('site-live:v1:cockpit:cockpit-tasks'))")
        self.assertIn('虚构测试任务',saved['result']['text'])
        self.page.evaluate('window.fixtureNow += 60000;window.dispatchEvent(new Event("hashchange"))')
        unchanged=self.page.evaluate("JSON.parse(localStorage.getItem('site-live:v1:cockpit:cockpit-tasks'))")
        self.assertEqual(saved['at'],unchanged['at'])
        self.refresh(503, {'status':'error'})
        rows=self.snapshot('filter-is-removed-while-saving-and-render-does-not-retimestamp')
        self.assertIn('虚构测试任务',rows['cockpit-tasks']['text'])
        self.assertIn('上次读到 今天 00:01',rows['cockpit-tasks']['text'])

    def test_xiaomi_real_device_profile_never_saves_graph_as_history(self):
        self.context.close()
        self.context=self.browser.new_context(viewport={'width':412,'height':915},device_scale_factor=3.5,is_mobile=True,has_touch=True,
            user_agent='Mozilla/5.0 (Linux; Android 15; Xiaomi 15 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36')
        self.context.add_init_script('window.fixtureNow='+str(NOW)+';Date.now=()=>window.fixtureNow;')
        self.context.route('**/*',lambda route:route.abort() if urlsplit(route.request.url).hostname!='127.0.0.1' or route.request.resource_type in ('image','media','font') else route.continue_())
        self.page=self.context.new_page();self.page.on('pageerror',lambda error:self.errors.append(str(error)))
        self.load()
        good=fixture()
        good['grafana']={'state':'reachable','checked_at':'2026-10-03T16:01:00Z','public_dashboard_state':'reachable','public_dashboard_url':'https://fixture-graph.invalid/panel'}
        self.refresh(200,good)
        self.assertGreater(self.page.locator('[data-b2-slot=cockpit-grafana] iframe').count(),0)
        self.assertIsNone(self.page.evaluate("localStorage.getItem('site-live:v1:cockpit:cockpit-grafana')"))
        stale=fixture();stale['grafana']={**good['grafana'],'checked_at':'2026-10-03T15:01:00Z'}
        self.refresh(200,stale)
        stale_rows=self.snapshot('xiaomi-stale-grafana-is-not-a-historical-chart')
        self.assertEqual(stale_rows['cockpit-grafana']['cached'],'false')
        self.assertEqual(self.page.locator('[data-b2-slot=cockpit-grafana] iframe').count(),0)
        self.refresh(503,{'status':'error'})
        rows=self.snapshot('xiaomi-android-dpr35-failure-excludes-live-graph')
        self.assertEqual(rows['cockpit-grafana']['cached'],'false')
        self.assertEqual(self.page.locator('[data-b2-slot=cockpit-grafana] iframe').count(),0)
        self.assertEqual(rows['cockpit-pc']['cached'],'true')
        self.page.set_viewport_size({'width':915,'height':412})
        self.page.wait_for_function("new Set([...document.querySelectorAll('[data-b2-slot]')].map(x=>x.dataset.b2Slot)).size===17")
        landscape=self.snapshot('xiaomi-landscape-keeps-success-time')
        self.assertEqual(rows,landscape)


if __name__ == '__main__':
    unittest.main()

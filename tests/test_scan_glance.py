import html, importlib.util, json, subprocess, sys, tempfile, unittest
import contextlib, hashlib, http.server, io, socket, struct, threading, time, urllib.error, urllib.request
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from types import SimpleNamespace
from unittest import mock
ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("scan_glance", ROOT / "site-astro/tools/scan_glance.py")
scan = importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(scan)
class ScanGlanceTests(unittest.TestCase):
    def test_declared_local_meta_refresh_waits_for_destination_and_keeps_home_lock(self):
        from playwright.sync_api import sync_playwright
        with tempfile.TemporaryDirectory(prefix='meta-refresh-', dir=r'E:\Cache') as temp, sync_playwright() as pw:
            root = Path(temp); (root/'alias').mkdir(); (root/'target').mkdir()
            (root/'alias/index.html').write_text('<meta http-equiv="refresh" content="2; url=/target/">alias')
            (root/'target/index.html').write_text('<main id="done">destination</main>')
            server = scan.make_server(root, root/'out')
            threading.Thread(target=server.serve_forever, daemon=True).start()
            browser = pw.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
            try:
                page = browser.new_page(); page.goto(server.base+'/alias/', wait_until='load')
                evidence = scan.wait_meta_refresh(page, server.base)
                self.assertEqual(page.locator('#done').inner_text(), 'destination')
                self.assertEqual(evidence, [{'from': server.base+'/alias/', 'declared_target': server.base+'/target/',
                    'declared_seconds': 2.0, 'to': server.base+'/target/'}])
                for target, reason in [('/', '已排除的首页'), ('https://outside.invalid/', '非本机页面')]:
                    fake = mock.Mock(url=server.base+'/alias/')
                    fake.eval_on_selector_all.return_value = ['2; url='+target]
                    with self.assertRaisesRegex(RuntimeError, reason): scan.wait_meta_refresh(fake, server.base)
                    fake.wait_for_url.assert_not_called(); self.assertTrue(fake.route.called)
                fake = mock.Mock(url=server.base+'/alias/'); fake.eval_on_selector_all.return_value = ['2; url=/target/']
                fake.wait_for_url.side_effect = TimeoutError('destination timed out')
                with self.assertRaisesRegex(TimeoutError, 'destination timed out'): scan.wait_meta_refresh(fake, server.base)
                leave = dict(scan.finding('transport', 'aborted'), request_method='GET', request_failure='net::ERR_ABORTED',
                    request_url=server.base+'/__proxy/oss/_v.gif?x-event=leave&x-p=%2Falias%2F')
                other = dict(leave, request_url=leave['request_url'].replace('%2Falias%2F', '%2Ftarget%2F'))
                row = {'navigation': evidence, 'failures': [leave, other, scan.finding('404', 'target failed')]}
                scan.classify_alias_leaves(row)
                self.assertEqual(row['navigation_diagnostics'], [leave]); self.assertEqual(row['failures'], [other, scan.finding('404', 'target failed')])
            finally:
                browser.close(); server.shutdown(); server.server_close(); server.upstream_pool.clear()

    def test_preview_status_forwards_query_and_headers(self):
        spec = importlib.util.spec_from_file_location("preview_site", ROOT / "tools/preview_site.py")
        preview = importlib.util.module_from_spec(spec); spec.loader.exec_module(preview)
        body = b'{"schema":"pcconfig.cockpit-view.v1"}'
        for query in ("", "?view=cockpit", "?view=cockpit&refresh=1"):
            with self.subTest(query=query):
                handler = object.__new__(preview.Preview)
                handler.path = "/__status" + query; handler.wfile = io.BytesIO()
                handler.send_response = mock.Mock(); handler.send_header = mock.Mock(); handler.end_headers = mock.Mock()
                upstream = mock.MagicMock(); upstream.__enter__.return_value.read.return_value = body
                with mock.patch.object(preview, "urlopen", return_value=upstream) as opened:
                    handler.do_GET()
                request = opened.call_args.args[0]
                self.assertEqual(request.full_url, "https://live.wly0829.cn/computer-access/state" + query)
                self.assertEqual(request.get_header("User-agent"), "wly-local-preview")
                self.assertEqual(request.get_header("Origin"), "https://wly0829.cn")
                self.assertEqual(request.get_header("Referer"), "https://wly0829.cn/")
                self.assertEqual(opened.call_args.kwargs, {"timeout": 15})
                handler.send_response.assert_called_once_with(200)
                self.assertEqual(handler.wfile.getvalue(), body)
    def test_horizontal_content_imbalance_uses_pcconfig_12_text(self):
        from playwright.sync_api import sync_playwright
        # 固定本轮修改前 pcconfig-12 五个真实节点；生成 Markdown 随构建变化，不充当测试夹具。
        steps = [
            ("登记", "机器的事实只记一处：49 个登记文件，记着盘、端口、任务、软件、环境变量、恢复材料"),
            ("工具和自动任务", "读登记干活，用 PowerShell、Python、Node.js、C# 写成"),
            ("回执", "每次运行写一份结果：成功、失败、跳过都写清"),
            ("看板接口", "10 月 4 日起，电脑上原有的状态服务里，采集线程每 30 秒更新一次显示缓存（慢的来源按各自时效），读的是登记和回执；网站来取时直接给最近一份，不让页面干等，也没为它另起常驻程序。10 月 11 日起，同一份缓存还能给驾驶舱一个只带显示所需字段的精简包（约 105 KB，全量约 711 KB，授权页和 AI 照旧读全量）；“稳 / 留意 / 要你处理”的总分和六个信号（要你做、AI 在跟、电脑、备份、今天任务、安全授权）也只在这里算一次，首页和驾驶舱只显示不另算；资料锁着只挡新读取，已显示的上次结果按原时间照常变旧，不改成“等待解锁”"),
            ("驾驶舱", "把这些翻成人话显示在网站上"),
        ]
        cards = ''.join(f'<div class="card step" id="step-{i}"><div class="stepic">'
            f'<svg width="160" height="160"><rect width="160" height="160"/></svg></div>'
            f'<div class="stephead">{html.escape(name)}</div><div class="body">{html.escape(text)}</div></div>'
            for i, (name, text) in enumerate(steps, 1))
        fixture = '<style>body{margin:0}.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:22px;width:1500px}' \
            '.step{padding:8px 14px 12px;min-width:0}.stepic{height:160px}.stephead{font:30px/1.25 sans-serif}' \
            '.body{font:23px/1.45 sans-serif;overflow-wrap:break-word}</style><main><div class="grid steps">' + cards + '</div></main>'
        config = scan.read_json(ROOT / "site-astro/tools/scan_glance.json")
        with tempfile.TemporaryDirectory(dir=ROOT) as temp, sync_playwright() as pw:
            browser = pw.chromium.launch_persistent_context(temp,
                executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                headless=True, viewport={"width": 1920, "height": 1080})
            try:
                page = browser.new_page(); page.set_content(fixture)
                page.evaluate((ROOT / "site-astro/tools/scan_glance_dom.js").read_text("utf8"))
                def measure():
                    return [f for f in page.evaluate("config => scanGlance(config)", config)["failures"] if f["category"] == "imbalance"]
                broken = measure()
                self.assertEqual([f["selector"] for f in broken], ["#step-4"])
                self.assertGreater(broken[0]["ratio"], 1.8); self.assertGreater(broken[0]["difference"], 200)
                heights = page.eval_on_selector_all('.step', 'es => es.map(e => e.getBoundingClientRect().height)')
                self.assertEqual(len(set(heights)), 1)  # grid 拉齐的框不能遮住内容高度差。
                self.assertEqual(scan.successful_routes(['/fixture/'],
                    [{"page": "/fixture/", "viewport": f"{w}x{h}", "failures": broken} for w, h in scan.VIEWPORTS]), set())
                page.add_style_tag(content='.steps{grid-template-columns:1fr}')
                self.assertEqual(measure(), [])
                page.add_style_tag(content='.steps{display:flex;flex-direction:column}.step{width:250px}')
                self.assertEqual(measure(), [])
                page.set_content(fixture.replace(steps[3][1], steps[0][1]))
                self.assertEqual(measure(), [])
                page.set_content('<style>.sides{display:flex;gap:20px}.card{width:250px}p{margin:0;height:100px}</style>'
                    '<main><div class="sides"><div class="card"><p>A</p></div><div class="card"><p>B</p></div></div></main>')
                self.assertEqual(measure(), [])
                # 当前 comp-diagram 的真实外壳：sequence-row > sequence-item > sequence-card。
                sequence = ''.join(f'<div class="sequence-item" id="sequence-{i}"><div class="sequence-card card">'
                    f'<svg width="160" height="160"><rect width="160" height="160"/></svg><div class="sequence-copy">'
                    f'<div class="dg-name">{html.escape(name)}</div><div class="dg-body">{html.escape(text)}</div></div></div></div>'
                    for i, (name, text) in enumerate(steps, 1))
                sequence_fixture = '<style>.sequence-row{display:grid;grid-template-columns:repeat(5,1fr);gap:22px;width:1500px}.sequence-item{display:flex;min-width:0}.sequence-card{padding:8px 14px 12px;flex:1;min-width:0}.dg-name{font:30px/1.25 sans-serif}.dg-body{font:23px/1.45 sans-serif;overflow-wrap:break-word}</style><main><div class="c-diagram c-sequence c-flow"><div class="sequence-row">' + sequence + '</div></div></main>'
                page.set_content(sequence_fixture); self.assertEqual([f["selector"] for f in measure()], ["#sequence-4"])
                self.assertEqual(len(set(page.eval_on_selector_all('.sequence-card', 'es => es.map(e => e.getBoundingClientRect().height)'))), 1)
                page.add_style_tag(content='.sequence-row{grid-template-columns:1fr}')
                self.assertEqual(measure(), [])
                page.add_style_tag(content='.sequence-row{display:flex;flex-direction:column}.sequence-item{width:250px}')
                self.assertEqual(measure(), [])
                quotes = ''.join(f'<blockquote class="ct-card card ct-quote-card" id="quote-{i}"><p class="tb">{html.escape(text)}</p></blockquote>' for i, (_, text) in enumerate(steps, 1))
                quote_fixture = '<style>.ct-quote{display:grid;grid-template-columns:repeat(5,1fr);gap:22px;width:1500px}.ct-quote-card{margin:0;padding:12px;min-width:0;font:23px/1.45 sans-serif}</style><main><div class="c-text ct-quote ct-cols-5">' + quotes + '</div></main>'
                page.set_content(quote_fixture); self.assertEqual([f["selector"] for f in measure()], ["#quote-4"])
                page.add_style_tag(content='.ct-quote{grid-template-columns:1fr}')
                self.assertEqual(measure(), [])
                page.set_content('<style>.feature-group-grid{display:block;position:relative;width:550px;height:900px}.feature-item{position:absolute;width:260px;font:16px/30px sans-serif}</style><main><div class="feature-group-grid feature-masonry-grid"><article id="masonry-long" class="feature-item" style="left:0;top:0;height:900px">' + 'A<br>' * 30 + '</article>' + ''.join(f'<article class="feature-item" style="left:280px;top:{i*210}px;height:180px">' + 'B<br>' * 6 + '</article>' for i in range(4)) + '</div></main>')
                self.assertEqual(measure(), [])
                page.eval_on_selector('.feature-masonry-grid', "e => {e.className='feature-group-grid ct-source_text_card';e.dataset.flow='independent_columns'}")
                self.assertEqual([f["selector"] for f in measure()], ["#masonry-long"])
            finally:
                browser.close()
    def test_closed_details_rows_skipped_but_visible_overlap_and_clip_reported(self):
        from playwright.sync_api import sync_playwright
        # 驾驶舱任务清单的形状：收起的分组里嵌套 details 的 summary 行，排版位置落在下一组标题上，但画面上没画出来。
        fixture = '<style>body{margin:0;font:16px/20px sans-serif}details{display:block}.group{height:24px}'             '.box{width:60px;height:20px;overflow:hidden;white-space:nowrap;margin-top:80px}</style><main>'             '<details class="group" id="g-guard"><summary>守护</summary><div><details><summary><span>卡死自动留现场</span></summary>'             '<p>说明</p></details></div></details><details class="group" id="g-idle"><summary>今天没有安排的</summary></details>'             '<div class="box" id="cut">这一行文字很长一定会被容器裁掉</div></main>'
        config = scan.read_json(ROOT / "site-astro/tools/scan_glance.json")
        with tempfile.TemporaryDirectory() as temp, sync_playwright() as pw:
            browser = pw.chromium.launch_persistent_context(temp,
                executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                headless=True, viewport={"width": 800, "height": 600})
            try:
                page = browser.new_page()
                def found(prepare=""):
                    page.set_content(fixture); page.evaluate(prepare or "0")
                    page.evaluate((ROOT / "site-astro/tools/scan_glance_dom.js").read_text("utf8"))
                    return sorted((f["category"], f["selector"]) for f in page.evaluate("c => scanGlance(c)", config)["failures"]
                        if f["category"] in ("overlap", "clipped"))
                cut = ("clipped", "#cut")
                self.assertEqual(found(), [cut])
                self.assertEqual(found("delete Element.prototype.checkVisibility"), [cut])  # 没有 checkVisibility 时按 details 结构判断。
                opened = found("document.querySelectorAll('details').forEach(d => d.open = true)")
                self.assertIn(cut, opened)
                self.assertTrue(any(c == "overlap" and s.startswith("#g-guard") for c, s in opened), opened)
            finally:
                browser.close()
    def test_settle_ignores_hidden_lazy_images_and_reports_visible_broken_image(self):
        from playwright.sync_api import sync_playwright
        with tempfile.TemporaryDirectory() as temp, sync_playwright() as pw:
            browser = pw.chromium.launch_persistent_context(temp,
                executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                headless=True, viewport={"width": 800, "height": 600})
            try:
                page = browser.new_page()
                from PIL import Image
                png = io.BytesIO(); Image.new("RGB", (1, 1)).save(png, format="PNG")
                page.route("https://example.invalid/deferred.png", lambda route: route.fulfill(body=png.getvalue(), content_type="image/png"))
                page.set_content("""<main>
                    <div hidden><img id="hidden" loading="lazy" src="https://example.invalid/hidden.png"></div>
                    <details><summary>Closed</summary><img id="closed" loading="lazy" src="https://example.invalid/closed.png"></details>
                    <img id="zero" loading="lazy" style="width:0;height:0" src="https://example.invalid/zero.png">
                    <img id="offscreen" loading="lazy" style="position:absolute;left:2000px" src="https://example.invalid/offscreen.png">
                    <img id="deferred" loading="lazy" width="20" height="20" style="position:absolute;top:10000px" src="https://example.invalid/deferred.png">
                    <img id="broken" width="120" height="100" src="data:image/png;base64,broken">
                    </main>""")
                self.assertFalse(page.eval_on_selector("#hidden", "i => i.complete"))
                scan.settle(page, [0], set())
                self.assertFalse(page.eval_on_selector("#deferred", "i => i.complete"))
                scan.settle(page, [0], set(), all_images=True)
                self.assertEqual(page.eval_on_selector("#deferred", "i => [i.loading, i.complete, i.naturalWidth]"), ["eager", True, 1])
                self.assertEqual(page.eval_on_selector("#hidden", "i => i.loading"), "lazy")
                page.evaluate((ROOT / "site-astro/tools/scan_glance_dom.js").read_text("utf8"))
                result = page.evaluate("config => window.scanGlance(config)",
                    scan.read_json(ROOT / "site-astro/tools/scan_glance.json"))
                images = [f for f in result["failures"] if f["category"] == "image"]
                self.assertEqual([f["selector"] for f in images], ["#broken"])
            finally:
                browser.close()
    def test_select_modes_and_home_lock(self):
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp); hashes = {"/": "a", "/x/": "b"}
            self.assertEqual(scan.select_pages(dist, "changed", hashes, {}, False), ["/", "/x/"])
            self.assertEqual(scan.select_pages(dist, "changed", hashes, {"/": "a"}), ["/x/"])
            self.assertEqual(scan.select_pages(dist, "all", hashes, {}, True), ["/x/"])
            self.assertEqual(scan.select_pages(dist, "/,x/index.html", hashes, {}, True), ["/x/"])
            with self.assertRaisesRegex(ValueError, "成品缺少页面"):
                scan.select_pages(dist, "/missing/", hashes, {})
            published = {"files": {"index.html": {"sha256": "z"}, "x/index.html": {"sha256": "b"}}}
            with mock.patch.object(scan, "published_manifest", return_value=published):
                self.assertEqual(scan.select_pages(dist, "published-diff", hashes, {}, True), [])
                self.assertEqual(scan.select_pages(dist, "published-diff", hashes | {"/new/": "c"}, {}, True), ["/new/"])
            with mock.patch.object(scan, "published_manifest", return_value=None), mock.patch("builtins.print") as output:
                self.assertEqual(scan.select_pages(dist, "published-diff", hashes, {"/": "a"}), ["/x/"])
                self.assertIn("回退 changed", output.call_args.args[0])
    def test_published_uses_git_shared_record(self):
        with tempfile.TemporaryDirectory() as temp, mock.patch.object(scan.subprocess, "check_output", return_value=temp):
            shared = Path(temp) / "wly-oss"; shared.mkdir()
            self.assertIsNone(scan.published_manifest())
            (shared / "published.json").write_text(json.dumps({"manifest": {"files": {"x.html": {"sha256": "a"}}}}))
            self.assertEqual(scan.published_manifest()["files"], {"x.html": {"sha256": "a"}})
    def test_changed_accumulates_consecutive_builds(self):
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp); initial = {"/x/": "x1", "/y/": "y1"}
            snapshot = {"html_sha256": initial, "input_html_sha256": initial}
            receipt = dist / ".build-receipt.json"
            receipt.write_text(json.dumps({"rebuilt_pages": ["/x/"]}))
            receipt.write_text(json.dumps({"rebuilt_pages": ["/y/"]}))
            self.assertEqual(scan.select_pages(dist, "changed", {"/x/": "x2", "/y/": "y2"}, scan.scan_baseline(snapshot)), ["/x/", "/y/"])
    def test_failed_and_incomplete_pages_are_rescanned(self):
        hashes = {r: r for r in ("/ok/", "/bad/", "/incomplete/", "/missing/", "/unscanned/")}
        rows = [{"page": r, "viewport": f"{w}x{h}", "failures": []} for r in ("/ok/", "/bad/") for w, h in scan.VIEWPORTS]
        rows[2]["failures"] = [scan.finding("404", "broken link")]
        rows.append({"page": "/incomplete/", "viewport": "1920x1080", "failures": []})
        selected = list(hashes)[:-1]
        result = {"html_sha256": {r: hashes[r] for r in selected}, "input_html_sha256": hashes, "selected_routes": selected, "pages": rows}
        self.assertEqual(scan.scan_baseline(result), {"/ok/": "/ok/"})
        self.assertEqual(scan.select_pages(Path("."), "changed", hashes, scan.scan_baseline(result)), sorted(set(hashes) - {"/ok/"}))
        self.assertEqual(scan.scan_baseline(result | {"failures": [{"page": "/ok/", "category": "404"}]}), {})
        self.assertEqual(scan.successful_routes(selected, rows, False), set())
    def test_retry_codes_require_transport_category(self):
        for code in ("ERR_NO_BUFFER_SPACE", "ERR_ABORTED", "ERR_CONNECTION_RESET"):
            self.assertTrue(scan.retryable_transport({"failures": [scan.finding("transport", code)]}))
            self.assertFalse(scan.retryable_transport({"failures": [scan.finding("scan_error", code)]}))
            for category in ("404", "geometry", "scan_error"):
                self.assertFalse(scan.retryable_transport({"failures": [scan.finding("transport", code), scan.finding(category, "real failure")]}))
    def test_worker_retry_keeps_attempts_and_uses_second_result(self):
        cases = [("transport", "ERR_ABORTED", [], 2), ("transport", "ERR_CONNECTION_RESET", [scan.finding("transport", "ERR_ABORTED")], 2),
                 ("404", "ERR_ABORTED", [], 1), ("scan_error", "ERR_ABORTED", [], 1), ("transport", "ERR_TIMED_OUT", [], 1),
                 ("mixed", "ERR_ABORTED", [], 1), ("goto", "net::ERR_CONNECTION_RESET", [], 2), ("goto", "ordinary navigation error", [], 1)]
        for category, message, second, count in cases:
            with self.subTest(category=category, message=message), tempfile.TemporaryDirectory() as temp:
                context = mock.MagicMock(); browser = context.__enter__.return_value.chromium.launch_persistent_context.return_value
                pages = [mock.MagicMock(), mock.MagicMock()]; browser.new_page.side_effect = pages
                first = [scan.finding("transport" if category == "mixed" else category, message)]
                if category == "mixed": first.append(scan.finding("404", "real failure"))
                if category == "goto": pages[0].goto.side_effect = RuntimeError(message)
                for page, failures in zip(pages, (first, second)):
                    page.url = "http://127.0.0.1/x/"
                    page.eval_on_selector_all.return_value = []
                    page.evaluate.side_effect = lambda expr, *args, failures=failures: (0 if "scrollHeight" in expr else {"failures": failures, "hints": []})
                with mock.patch("playwright.sync_api.sync_playwright", return_value=context), mock.patch.object(scan, "settle"), mock.patch("PIL.Image.open") as opened:
                    opened.return_value.__enter__.return_value.width = 1920; opened.return_value.__enter__.return_value.height = 1080
                    rows = scan.scan_worker(0, [("/x/", 1920, 1080)], SimpleNamespace(chrome="chrome", out=Path(temp)), "http://127.0.0.1", Path(temp), {}, [])
                self.assertEqual(browser.new_page.call_count, count)
                self.assertTrue(pages[0].close.called)
                if count == 2:
                    self.assertEqual(rows[0]["failures"], second)
                    self.assertEqual(len(rows[0]["attempts"]), 2)
                    self.assertEqual(rows[0]["attempts"][0]["failures"][0]["message"], message)
                    self.assertEqual(rows[0]["attempts"][0]["failures"][0]["category"], "transport")
                    self.assertNotEqual(rows[0]["attempts"][0]["screenshot"], rows[0]["attempts"][1]["screenshot"])
                    json.dumps(rows)
                else: self.assertNotIn("attempts", rows[0])
    def test_links_include_absolute_local_single_quote_and_self_anchor(self):
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp); result = dist / "result.json"
            (dist / "x.html").write_text("<p id='yes'>yes</p><a href='#yes'>self</a>"
                "<a href='https://www.wly0829.cn/x.html#yes'>local</a><a href='#missing'>bad</a><div data-href='run'></div>")
            subprocess.run([sys.executable, "-B", str(ROOT / "site-astro/tools/link_check.py"),
                str(result), "--dist", str(dist), "--skip", ""], check=True, capture_output=True)
            self.assertEqual([item["href"] for item in json.loads(result.read_text("utf8"))["items"]], ["#missing"])

class ScanProxyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="scan-proxy-test-", dir=r"E:\Cache\Claude\Temp")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name); self.counts = Counter(); self.ports = set(); self.active = self.peak = 0
        self.dist = self.root / "dist"; self.dist.mkdir()
        self.lock = threading.Lock(); self.body = b"complete-object-bytes"; owner = self
        class Upstream(http.server.BaseHTTPRequestHandler):
            protocol_version = "HTTP/1.1"
            def log_message(self, *args): pass
            def do_GET(self):
                with owner.lock:
                    owner.counts[self.path] += 1; attempt = owner.counts[self.path]; owner.ports.add(self.client_address[1])
                    owner.active += 1; owner.peak = max(owner.peak, owner.active)
                try:
                    if "always-disconnect" in self.path or ("disconnect" in self.path and attempt == 1):
                        self.close_connection = True; self.connection.shutdown(socket.SHUT_RDWR); self.connection.close(); return
                    if "slow" in self.path and ("once" not in self.path or attempt == 1): time.sleep(.08)
                    status = 404 if "missing" in self.path else 200
                    body = b"not-found" if status == 404 else owner.body
                    if "large" in self.path: body = b"x" * (4 * 1024 * 1024)
                    self.send_response(status); self.send_header("Content-Type", "image/png")
                    self.send_header("Content-Length", str(len(body))); self.end_headers()
                    if "truncate" in self.path and attempt == 1:
                        self.wfile.write(body[:3]); self.wfile.flush()
                        self.close_connection = True; self.connection.shutdown(socket.SHUT_RDWR); self.connection.close(); return
                    self.wfile.write(body)
                except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError): self.close_connection = True
                finally:
                    with owner.lock: owner.active -= 1
        self.upstream = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Upstream)
        threading.Thread(target=self.upstream.serve_forever, kwargs={"poll_interval": .01}, daemon=True).start()
        self.addCleanup(self.stop, self.upstream)
        self.host = f"http://127.0.0.1:{self.upstream.server_port}"
        patcher = mock.patch.dict(scan.UPSTREAMS, oss=self.host); patcher.start(); self.addCleanup(patcher.stop)
    @staticmethod
    def stop(server):
        server.shutdown(); server.server_close()
        if hasattr(server, "upstream_pool"): server.upstream_pool.clear()
    def proxy(self, manifest=None):
        server = scan.make_server(self.dist, self.root / "scan", manifest=manifest)
        threading.Thread(target=server.serve_forever, kwargs={"poll_interval": .01}, daemon=True).start()
        self.addCleanup(self.stop, server)
        return server
    @staticmethod
    def path(name): return "/releases/test/assets/_fingerprinted/" + name + ".png"
    def fetch(self, server, name):
        try: response = urllib.request.urlopen(server.base + "/__proxy/oss" + self.path(name), timeout=5)
        except urllib.error.HTTPError as error: response = error
        with response: return response.status, response.read()
    def test_upstream_disconnect_and_truncated_body_retry_transparently(self):
        server = self.proxy()
        for name in ("disconnect", "truncate"):
            with self.subTest(name=name):
                self.assertEqual(self.fetch(server, name), (200, self.body))
                self.assertEqual(self.counts[self.path(name)], 2)
                self.assertEqual(server.proxy_results[self.host + self.path(name)]["status"], 200)
    def test_real_404_is_not_retried_or_cached_as_success(self):
        server = self.proxy()
        self.assertEqual(self.fetch(server, "missing"), (404, b"not-found"))
        self.assertEqual(self.counts[self.path("missing")], 1)
        record = server.proxy_results[self.host + self.path("missing")]
        self.assertEqual((record["kind"], record["status"]), ("http", 404))
    def test_slow_upstream_retries_and_exhausted_timeout_stays_transport(self):
        timeout = scan.urllib3.Timeout
        with mock.patch.object(scan.urllib3, "Timeout", side_effect=lambda **kw: timeout(connect=.1, read=.02, total=.2)):
            server = self.proxy()
            self.assertEqual(self.fetch(server, "slow-once"), (200, self.body))
            self.assertEqual(self.counts[self.path("slow-once")], 2)
            self.assertEqual(self.fetch(server, "slow-always")[0], 502)
        self.assertEqual(self.counts[self.path("slow-always")], 3)
        self.assertEqual(server.proxy_results[self.host + self.path("slow-always")]["kind"], "transport")
    def test_manifest_hash_and_cross_server_cache_reuse(self):
        url = self.host + self.path("object")
        manifest = {"oss": {"objects": {"missing-local.png": {"url": url, "sha256": hashlib.sha256(self.body).hexdigest()}}}}
        first = self.proxy(manifest); self.assertEqual(self.fetch(first, "object"), (200, self.body))
        second = self.proxy(manifest); self.assertEqual(self.fetch(second, "object"), (200, self.body))
        self.assertEqual(self.counts[self.path("object")], 1)
        next(p for p in first.oss_cache.iterdir() if not p.suffix).write_bytes(b"corrupt-cache")
        self.assertEqual(self.fetch(second, "object"), (200, self.body))
        self.assertEqual(self.counts[self.path("object")], 2)
        missing = {"oss": {"objects": {"missing-local.png": {"url": self.host + self.path("missing"), "sha256": hashlib.sha256(self.body).hexdigest()}}}}
        missing_server = self.proxy(missing)
        self.assertEqual(self.fetch(missing_server, "missing"), (404, b"not-found"))
        self.assertEqual(self.counts[self.path("missing")], 1)
        manifest["oss"]["objects"]["missing-local.png"]["sha256"] = "0" * 64
        bad = self.proxy(manifest); status, _ = self.fetch(bad, "object")
        self.assertEqual(status, 502); self.assertEqual(bad.proxy_results[url]["kind"], "object_error")
    def test_exhausted_disconnect_is_transport_and_only_it_changes_image_category(self):
        server = self.proxy(); self.assertEqual(self.fetch(server, "always-disconnect")[0], 502)
        url = self.host + self.path("always-disconnect")
        self.assertEqual(server.proxy_results[url]["kind"], "transport")
        items = [scan.finding("image", "image not loaded") | {"currentSrc": u, "src": u}
                 for u in (server.base + "/__proxy/oss" + self.path("always-disconnect"), "http://wrong/image.png", "")]
        result = scan.classify_images(items, server.proxy_results)
        self.assertEqual([item["category"] for item in result], ["transport", "image", "image"])
        self.assertTrue(scan.retryable_transport({"failures": result[:1]}))
        self.assertFalse(scan.retryable_transport({"failures": result}))
        fallback = scan.finding("image", "src only") | {"currentSrc": "", "src": items[0]["src"]}
        self.assertEqual(scan.classify_images([fallback], server.proxy_results)[0]["category"], "transport")
        other = self.host + self.path("other")
        for kind, status, address in (("transport", 502, other), ("http", 200, other), ("http", 404, other), ("transport", 502, "")):
            frame = scan.finding("image", "image frame") | {"imageSources": [items[0]["src"], address]}
            records = server.proxy_results | {other: {"kind": kind, "status": status}}
            failures = scan.classify_images([frame], records)
            retry = kind == "transport" and bool(address)
            self.assertEqual(failures[0]["category"], "transport" if retry else "image")
            self.assertEqual(scan.retryable_transport({"failures": failures}), retry)
        for kind, status in (("http", 404), ("object_error", 502), ("http", 200)):
            image = scan.finding("image", "bad image") | {"currentSrc": url, "src": url}
            self.assertEqual(scan.classify_images([image], {url: {"kind": kind, "status": status}})[0]["category"], "image")
    def test_upstream_concurrency_is_bounded_and_connections_reused(self):
        server = self.proxy()
        with ThreadPoolExecutor(max_workers=12) as pool:
            results = list(pool.map(lambda n: self.fetch(server, "slow-" + str(n)), range(12)))
        self.assertEqual(results, [(200, self.body)] * 12)
        self.assertLessEqual(self.peak, 4); self.assertGreater(self.peak, 1)
        self.assertLessEqual(len(self.ports), 4)
    def test_client_disconnect_does_not_emit_server_traceback(self):
        server = self.proxy(); output = io.StringIO()
        with contextlib.redirect_stderr(output):
            client = socket.create_connection(("127.0.0.1", server.server_port))
            client.sendall(("GET /__proxy/oss" + self.path("large") + " HTTP/1.1\r\nHost: local\r\n\r\n").encode())
            deadline = time.monotonic() + 5
            while not self.counts[self.path("large")] and time.monotonic() < deadline: time.sleep(.01)
            client.setsockopt(socket.SOL_SOCKET, socket.SO_LINGER, struct.pack("HH", 1, 0)); client.close()
            deadline = time.monotonic() + 5
            while self.host + self.path("large") not in server.proxy_results and time.monotonic() < deadline: time.sleep(.01)
            while not server.proxy_stats["client_disconnects"] and time.monotonic() < deadline: time.sleep(.01)
        self.assertIn(self.host + self.path("large"), server.proxy_results)
        self.assertEqual(server.proxy_stats["client_disconnects"], 1)
        self.assertNotIn("Traceback", output.getvalue())

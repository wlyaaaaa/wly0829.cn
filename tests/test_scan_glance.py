import html, importlib.util, json, subprocess, sys, tempfile, unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock
ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("scan_glance", ROOT / "site-astro/tools/scan_glance.py")
scan = importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(scan)
class ScanGlanceTests(unittest.TestCase):
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
    def test_settle_ignores_hidden_lazy_images_and_reports_visible_broken_image(self):
        from playwright.sync_api import sync_playwright
        with tempfile.TemporaryDirectory() as temp, sync_playwright() as pw:
            browser = pw.chromium.launch_persistent_context(temp,
                executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                headless=True, viewport={"width": 800, "height": 600})
            try:
                page = browser.new_page()
                page.set_content("""<main>
                    <div hidden><img id="hidden" loading="lazy" src="https://example.invalid/hidden.png"></div>
                    <details><summary>Closed</summary><img id="closed" loading="lazy" src="https://example.invalid/closed.png"></details>
                    <img id="zero" loading="lazy" style="width:0;height:0" src="https://example.invalid/zero.png">
                    <img id="offscreen" loading="lazy" style="position:absolute;left:2000px" src="https://example.invalid/offscreen.png">
                    <img id="broken" width="120" height="100" src="data:image/png;base64,broken">
                    </main>""")
                self.assertFalse(page.eval_on_selector("#hidden", "i => i.complete"))
                scan.settle(page, [0], set())
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

import importlib.util, json, subprocess, sys, tempfile, unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock
ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("scan_glance", ROOT / "site-astro/tools/scan_glance.py")
scan = importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(scan)
class ScanGlanceTests(unittest.TestCase):
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

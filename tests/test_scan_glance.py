import importlib.util, json, subprocess, sys, tempfile, unittest
from pathlib import Path
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
    def test_changed_receipt_hash_fallback_and_home_lock(self):
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp); hashes = {"/": "a", "/x/": "b"}
            self.assertEqual(scan.select_pages(dist, "changed", hashes, {}, False), ["/", "/x/"])
            self.assertEqual(scan.select_pages(dist, "changed", hashes, {"/": "a"}), ["/x/"])
            self.assertEqual(scan.select_pages(dist, "all", hashes, {}, True), ["/x/"])
            (dist / ".build-receipt.json").write_text(json.dumps({"rebuilt_pages": ["x/index.html"]}))
            self.assertEqual(scan.select_pages(dist, "changed", hashes, {}), ["/x/"])
    def test_links_include_absolute_local_single_quote_and_self_anchor(self):
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp); result = dist / "result.json"
            (dist / "x.html").write_text("<p id='yes'>yes</p><a href='#yes'>self</a>"
                "<a href='https://www.wly0829.cn/x.html#yes'>local</a><a href='#missing'>bad</a><div data-href='run'></div>")
            subprocess.run([sys.executable, "-B", str(ROOT / "site-astro/tools/link_check.py"),
                str(result), "--dist", str(dist), "--skip", ""], check=True, capture_output=True)
            self.assertEqual([item["href"] for item in json.loads(result.read_text("utf8"))["items"]], ["#missing"])

import importlib.util, json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("scan_glance", ROOT / "site-astro/tools/scan_glance.py")
scan = importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(scan)
class ScanGlanceTests(unittest.TestCase):
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

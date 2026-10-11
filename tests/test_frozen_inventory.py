"""冻结清单字段、正文提取和实际构建路由认领。"""
import csv
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "site-astro/tools/frozen_inventory.py"
SPEC = importlib.util.spec_from_file_location("frozen_inventory", SCRIPT)
INVENTORY = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(INVENTORY)


class FrozenInventoryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.content = self.root / "content"
        self.content.mkdir()
        pages = {"projects/demo/module/index.html": "<title>A &amp; B &#x4E2D;</title><style>88888</style><script>2099-01-01;99999</script><main>2026-10-11 18:20，10.5%，42项；2026年10月11日</main>",
                 "projects/demo/old/index.html": "<h1>旧<strong>地址</strong></h1><p>10月9日 2,048 件</p>",
                 "skills/documents/index.html": "<title>做文档</title>"}
        for relative, html in pages.items():
            target = self.root / "pages" / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(html, encoding="utf-8")
        self.manifest = self.root / "manifest.json"
        self.manifest.write_text(json.dumps({"pages": {path: {} for path in pages}}), encoding="utf-8")
        self.write_content("demo", {"url": "/projects/demo/module", "old_urls": ["/projects/demo/old"]})
        self.write_content("reserved", {"url": "/computer-access/"})

    def write_content(self, name, fields):
        (self.content / (name + ".md")).write_text("---\n" + json.dumps(fields) + "\n---\n正文", encoding="utf-8")

    def test_fields_titles_dates_numbers_and_route_claims(self):
        rows = INVENTORY.inventory(self.manifest, self.content)
        module, old, skill = rows
        self.assertEqual(set(module), {"route", "slug", "route_kind", "title", "taken_over", "content_page", "claim", "dates", "numbers"})
        self.assertEqual((module["slug"], module["route_kind"], module["title"]), ("demo", "project_module", "A & B 中"))
        self.assertEqual((module["taken_over"], module["content_page"], module["claim"]), (True, "demo", "url"))
        self.assertEqual((old["title"], old["taken_over"], old["claim"]), ("旧地址", True, "old_url"))
        self.assertEqual((skill["slug"], skill["route_kind"], skill["taken_over"]), ("skills", "site_page", False))
        self.assertEqual(module["dates"], ["2026-10-11 18:20", "2026年10月11日"])
        self.assertTrue({"10.5%", "42"} <= set(module["numbers"]))
        self.assertFalse({"88888", "99999", "2099"} & set(module["numbers"]))
        self.assertEqual((old["dates"], old["numbers"][-1]), (["10月9日"], "2,048"))

    def test_selection_and_csv_preserve_array_columns(self):
        self.assertEqual(len(INVENTORY.inventory(self.manifest, self.content, projects=["demo"])), 2)
        self.assertEqual(len(INVENTORY.inventory(self.manifest, self.content, routes=["/skills/documents/"])), 1)
        with self.assertRaisesRegex(ValueError, "Unknown frozen routes"):
            INVENTORY.inventory(self.manifest, self.content, routes=["/missing/"])
        routes = self.root / "routes.txt"
        routes.write_text("# 与冻结转换器共用的路由清单\n\n/projects/demo/module/\n", encoding="utf-8-sig")
        output = subprocess.check_output([sys.executable, "-B", "-X", "utf8", str(SCRIPT), "--manifest", str(self.manifest), "--content-root", str(self.content), "--routes", str(routes), "--format", "csv"], text=True, encoding="utf-8")
        rows = list(csv.DictReader(io.StringIO(output)))
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["route"], "/projects/demo/module/")
        self.assertIn("10.5%", json.loads(rows[0]["numbers"]))
        self.write_content("duplicate", {"url": "/projects/demo/old/"})
        with self.assertRaisesRegex(ValueError, "同一路由"): INVENTORY.content_claims(self.content)


if __name__ == "__main__": unittest.main()

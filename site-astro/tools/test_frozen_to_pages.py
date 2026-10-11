"""冻结模块迁移回归：真实正文、失败原子性和已有作者/素材边界。"""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parent))
import frozen_to_pages as convert

REPO = Path(__file__).resolve().parents[2]
ROUTE = "/projects/localocr/input-routing/"
PID = "localocr-input-routing"
PARENT = {"page": "localocr", "title": "本地文字识别", "url": "/projects/localocr/", "status": "在用", "status_line": {"state": "在用", "as_of": "2026-10-11"}}
REQUIRED = ("project-hero project-lead snapshot-card module-product plain-language-grid "
    "outcome-state-grid usage-start usage-inputs module-product-flow module-technical "
    "status-pill skill-decision-list definition-list problem-callout failure-list "
    "source-list document-pagination").split()
DISCARD = ".breadcrumbs,.project-reading-nav,.continuation-brief,.project-navigation,.visually-hidden,script,style,svg"


def fixture(route=ROUTE):
    return (REPO / "site-astro/sources/frozen-site/pages" / route.strip("/") / "index.html").read_text("utf-8-sig")


def plain(text):
    return re.sub(r"[\s*`|〔〕#]", "", text)


def page_text(page):
    return "\n".join(s["text"] for s in page["screens"])


class FrozenMigrationTests(unittest.TestCase):
    def setUp(self):
        base = Path(os.environ.get("FROZEN_TEST_TMP", r"E:\Cache\Codex\Temp\frozen-K-tests")) if os.name == "nt" else Path(tempfile.gettempdir())
        base.mkdir(parents=True, exist_ok=True)
        self.tmp = tempfile.TemporaryDirectory(prefix="suite-", dir=base)
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        self.report = self.root / "conversion-output"
        self.target = self.root / "sources/pages" / PID
        self.map = self.root / "sources/assets/_library/asset-map.jsonl"
        self.json_file("sources/pages/localocr/page.json", PARENT)
        self.frozen = self.root / "site-astro/sources/frozen-site/pages" / ROUTE.strip("/") / "index.html"
        self.frozen.parent.mkdir(parents=True, exist_ok=True)
        self.frozen.write_text(fixture(), encoding="utf-8")
        self.json_file("site-astro/sources/frozen-site/manifest.json", {"sentinel": "immutable snapshot"})
        icons = json.loads((REPO / "site-astro/tools/frozen_module_icons.json").read_text("utf-8"))
        for category, icon in icons["icons"].items():
            icon["sha256"] = self.asset(icon["asset"], category.encode())
        self.json_file("site-astro/tools/frozen_module_icons.json", icons)
        self.json_file("site-astro/tools/frozen_module_layout.json", json.loads((REPO / "site-astro/tools/frozen_module_layout.json").read_text("utf-8")))
        row = self.illustration("localocr", "localocr-01", "parent.png")
        self.original_map = b"\r\n" + json.dumps(row, ensure_ascii=False, indent=None).encode() + b"\r\n\r\n"
        self.map.write_bytes(self.original_map)

    def json_file(self, relative, data):
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
        return path

    def asset(self, relative, raw=b"test-only-image"):
        path = self.root / "sources/assets" / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(raw)
        return hashlib.sha256(raw).hexdigest()

    def illustration(self, page, screen, name):
        asset = "_library/" + name
        return {"page": page, "screen_id": screen, "role": "illustration", "slot_ordinal": 1,
                "key": name, "asset": asset, "sha256": self.asset(asset), "status": "ready"}

    def run_routes(self, **kwargs):
        return convert.convert_routes([ROUTE], self.report, root=self.root, **kwargs)

    def assert_clean_failure(self, result):
        self.assertTrue(result["errors"])
        self.assertFalse(self.target.exists())
        self.assertEqual(self.original_map, self.map.read_bytes())

    def test_real_short_long_and_agents_preserve_visible_content(self):
        for route in (ROUTE, "/projects/pcconfig/secrets-providers/", "/projects/agents/capability-routing/"):
            with self.subTest(route=route):
                html = fixture(route)
                page, report = convert.convert_html(html, route, PARENT)
                self.assertEqual(page["url"], route)
                self.assertEqual(page["kind"], "project")
                self.assertEqual(page["parent"], PARENT["page"])
                self.assertEqual(page["status_line"]["state"], PARENT["status"])
                self.assertEqual(page["status_line"]["as_of"], PARENT["status_line"]["as_of"])
                pill = BeautifulSoup(html, "html.parser").select_one(".status-pill").get_text(" ", strip=True)
                self.assertIn(plain(pill), plain("".join(s["text"] for s in page["screens"] if s["section"] == "tech")))
                self.assertGreaterEqual(report["retention_ratio"], .97)
                actual = plain(page_text(page) + json.dumps(page["status_line"], ensure_ascii=False) +
                               "".join(l["text"] for s in page["screens"] for l in s["links"]))
                main = BeautifulSoup(html, "html.parser").find("main")
                for node in list(main.select(DISCARD + ",.reader-observation")):
                    node.decompose()
                for node in main.select("p,dt,dd,h1,h2,h3,h4,code"):
                    expected = plain(node.get_text(" ", strip=True))
                    if expected:
                        self.assertIn(expected, actual, node.get_text()[:80])
                for number, screen in enumerate(page["screens"], 1):
                    self.assertEqual(screen["id"], convert.route_id(route) + f"-{number:02d}")
                    self.assertTrue({"id", "section", "title", "text", "links", "anchors", "live", "screenshots", "chain", "reuse"} <= screen.keys())
                self.assertEqual(sum(bool(b.get("card")) for s in report["screens"] for b in s["blocks"]), 6)
                if "pcconfig" in route:
                    self.assertGreater(len(page["screens"]), 8)

    def test_each_required_class_missing_or_duplicate_is_rejected(self):
        for cls in REQUIRED:
            with self.subTest(cls=cls):
                soup = BeautifulSoup(fixture(), "html.parser")
                node = soup.select_one("." + cls)
                node["class"] = [c for c in node["class"] if c != cls]
                with self.assertRaises(ValueError):
                    convert.convert_html(str(soup), ROUTE, PARENT)
        soup = BeautifulSoup(fixture(), "html.parser")
        soup.find("main").append(soup.new_tag("div", attrs={"class": "source-list"}))
        with self.assertRaises(ValueError):
            convert.convert_html(str(soup), ROUTE, PARENT)

    def test_unknown_section_and_inner_link_are_preserved_and_reported(self):
        soup = BeautifulSoup(fixture(), "html.parser")
        extra = BeautifulSoup('<section class="future-section"><h3>新增段落甲</h3><p>独有内容乙 <a href="/projects/old/#proof">原始链接丙</a>，pass|warn|block。</p></section>', "html.parser")
        soup.select_one(".module-technical").append(extra)
        source = soup.new_tag("a", attrs={"class": "source-reference-link", "href": "https://example.com/independent-source"})
        source.string = "独立源码依据"
        soup.find("main").append(source)
        page, report = convert.convert_html(str(soup), ROUTE, PARENT, {"/projects/old/": "/projects/current/"})
        self.assertIn("独有内容乙", page_text(page))
        self.assertIn("pass|warn|block", page_text(page))
        self.assertTrue(any(w.get("preserved") and "future-section" in w.get("html", "") for w in report["warnings"]))
        self.assertIn({"text": "原始链接丙", "href": "/projects/current/#proof"}, [l for s in page["screens"] for l in s["links"]])
        self.assertIn({"text": "独立源码依据", "href": "https://example.com/independent-source"}, [l for s in page["screens"] for l in s["links"]])

    def test_hidden_and_continuation_content_is_discarded(self):
        soup = BeautifulSoup(fixture(), "html.parser")
        for cls in ("visually-hidden", "continuation-brief", "project-navigation"):
            soup.select_one("." + cls).append("不得进入新正文哨兵" + cls)
        page, report = convert.convert_html(str(soup), ROUTE, PARENT)
        self.assertNotIn("不得进入新正文哨兵", page_text(page))
        self.assertTrue(report["discarded"])
        self.assertRegex(page["status_line"]["as_of"], r"^2026-\d{2}-\d{2}")
        different = {**PARENT, "status_line": {"state": "未知", "as_of": "1900-01-01"}}
        self.assertEqual(convert.convert_html(fixture(), ROUTE, different)[0]["status_line"]["as_of"], "Unknown")

    def test_retention_gate_and_new_repeated_text_cannot_mask_loss(self):
        self.assertAlmostEqual(convert.retention_ratio("甲" * 97 + "乙" * 3, "甲" * 97), .97)
        self.assertLess(convert.retention_ratio("甲" * 97 + "乙" * 3, "甲" * 200), 1)
        with patch.object(convert, "retention_ratio", return_value=.969):
            with self.assertRaises(ValueError):
                convert.convert_html(fixture(), ROUTE, PARENT)
        with patch.object(convert, "retention_ratio", return_value=.97):
            self.assertEqual(convert.convert_html(fixture(), ROUTE, PARENT)[1]["retention_ratio"], .97)

    def test_split_keeps_order_item_limit_and_avoids_tiny_tail(self):
        blocks = [{"kind": "list_item", "text": f"{n}. " + "正文" * 70} for n in range(18)]
        chunks = convert.split_blocks(blocks)
        self.assertEqual([b for c in chunks for b in c], blocks)
        self.assertGreater(len(chunks), 2)
        self.assertTrue(all(sum(b["kind"] == "list_item" for b in c) <= 8 for c in chunks))
        tail = [{"kind": "prose", "text": "甲" * 900}, {"kind": "prose", "text": "乙" * 900}, {"kind": "prose", "text": "丙" * 10}]
        parts = convert.split_blocks(tail)
        self.assertEqual([b for c in parts for b in c], tail)
        self.assertGreaterEqual(sum(len(b["text"]) for b in parts[-1]), 120)

    def test_definition_table_splits_and_keeps_links_and_rows(self):
        soup = BeautifulSoup(fixture(), "html.parser")
        dl = soup.select_one(".definition-list")
        dl.clear()
        for n in range(18):
            dl.append(BeautifulSoup(f'<div><dt>术语{n}</dt><dd>含义{n}：' + "说明" * 70 + f' <a href="https://example.com/{n}">依据{n}</a></dd></div>', "html.parser"))
        page, _ = convert.convert_html(str(soup), ROUTE, PARENT)
        tables = [s for s in page["screens"] if "| 名词 | 意思 |" in s["text"]]
        self.assertGreater(len(tables), 1)
        for n in range(18):
            self.assertEqual(page_text(page).count(f"| 术语{n} |"), 1)
            self.assertIn({"text": f"依据{n}", "href": f"https://example.com/{n}"}, [l for s in tables for l in s["links"]])

    def test_ordered_product_steps_keep_heading_boundary(self):
        page, _ = convert.convert_html(fixture(), ROUTE, PARENT)
        self.assertRegex(page_text(page), r"1\.\s+\*\*检查原件与可读内容\*\*\s+系统核对")

    def test_convert_skip_force_and_append_only_mapping(self):
        frozen_before = self.frozen.read_bytes()
        result = self.run_routes()
        self.assertFalse(result["errors"])
        self.assertEqual(result["converted"], 1)
        self.assertTrue(self.map.read_bytes().startswith(self.original_map))
        before = {p: p.read_bytes() for p in self.target.iterdir()}
        mapped = self.map.read_bytes()
        skipped = self.run_routes()
        self.assertEqual(skipped["skipped"], 1)
        self.assertEqual({p: p.read_bytes() for p in self.target.iterdir()}, before)
        self.assertEqual(self.map.read_bytes(), mapped)
        self.json_file("sources/pages/" + PID + "/page.json", {"page": PID, "url": ROUTE, "marker": "owner edit"})
        forced = self.run_routes(force=True)
        self.assertFalse(forced["errors"])
        self.assertNotIn("marker", json.loads((self.target / "page.json").read_text("utf-8")))
        self.assertEqual(self.map.read_bytes(), mapped)
        self.assertEqual(self.frozen.read_bytes(), frozen_before)
        self.assertEqual(json.loads((self.root / "site-astro/sources/frozen-site/manifest.json").read_text()), {"sentinel": "immutable snapshot"})
        layouts = json.loads((self.target / "layout.json").read_text("utf-8"))
        self.assertEqual({(l["screen"], l["orientation"]) for l in layouts}, {(s["id"], o) for s in json.loads((self.target / "page.json").read_text("utf-8"))["screens"] for o in ("h", "v")})

    def test_dry_run_writes_only_report(self):
        result = self.run_routes(dry_run=True)
        self.assertFalse(result["errors"])
        self.assertFalse(self.target.exists())
        self.assertEqual(self.original_map, self.map.read_bytes())
        self.assertTrue((self.report / "convert-report.json").is_file())

    def test_nonstandard_outcome_titles_still_get_three_fixed_icons(self):
        soup = BeautifulSoup(fixture(), "html.parser")
        titles = ("有清晰登记候选时", "零命中或版本仍歧义时", "登记索引不可读取时")
        for h3, title in zip(soup.select(".outcome-state-grid h3"), titles):
            h3.string = title
        self.frozen.write_text(str(soup), encoding="utf-8")
        result = self.run_routes()
        self.assertFalse(result["errors"])
        page = result["pages"][0]
        cards = [b for s in page["screens"] if s["family"] == "outcome_cards" for b in s["blocks"] if b.get("card")]
        self.assertEqual([b.get("icon_category") for b in cards], ["normal", "problem", "unavailable"])
        for screen in (s for s in page["screens"] if s["family"] == "outcome_cards"):
            self.assertEqual(sum(r["role"] == "icon" and r["screen_id"] == screen["id"] for r in page["asset_rows"]), sum(bool(b.get("card")) for b in screen["blocks"]))

    def test_parent_is_found_by_url_with_alias_and_unrelated_pages(self):
        self.json_file("sources/pages/404/page.json", {"page": "404"})
        self.json_file("sources/pages/profile/page.json", {"page": "profile"})
        self.json_file("sources/pages/home-a/page.json", {"page": "home-a", "url": "/"})
        self.json_file("sources/pages/home-b/page.json", {"page": "home-b", "url": "/"})
        parent = {"page": "codex-local-remote", "title": "Codex Remote", "url": "/projects/codex-remote/"}
        self.json_file("sources/pages/codex-local-remote/page.json", parent)
        row = self.illustration(parent["page"], parent["page"] + "-01", "alias-parent.png")
        self.map.write_bytes(self.original_map + json.dumps(row).encode())
        route = "/projects/codex-remote/input-routing/"
        target = self.root / "site-astro/sources/frozen-site/pages" / route.strip("/") / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(fixture(), encoding="utf-8")
        result = convert.convert_routes([route], self.report, root=self.root)
        self.assertFalse(result["errors"])
        page = json.loads((self.root / "sources/pages/codex-remote-input-routing/page.json").read_text("utf-8"))
        self.assertEqual(page["parent"], parent["page"])
        self.assertIn(parent["url"], [l["href"] for s in page["screens"] for l in s["links"]])

    def test_conflicts_rejected_even_with_force(self):
        for relative, page in ((PID, {"page": PID, "url": "/projects/other/item/"}), ("different-id", {"page": "different-id", "url": ROUTE})):
            with self.subTest(relative=relative):
                path = self.json_file("sources/pages/" + relative + "/page.json", page)
                raw = path.read_bytes()
                result = self.run_routes(force=True)
                self.assertTrue(result["errors"])
                self.assertEqual(path.read_bytes(), raw)
                self.assertEqual(self.map.read_bytes(), self.original_map)
                path.unlink()
                path.parent.rmdir()

    def test_invalid_html_or_asset_hash_leaves_no_partial_output(self):
        for damage in ("html", "asset"):
            with self.subTest(damage=damage):
                if damage == "html":
                    self.frozen.write_text("<main>not a module</main>", encoding="utf-8")
                else:
                    self.frozen.write_text(fixture(), encoding="utf-8")
                    (self.root / "sources/assets/_library/parent.png").write_bytes(b"changed")
                self.assert_clean_failure(self.run_routes())

    def test_dedicated_illustration_wins_without_copying_asset(self):
        dedicated = self.illustration(PID, PID + "-01", "dedicated.png")
        self.map.write_bytes(self.original_map + json.dumps(dedicated).encode())
        initial_assets = {p.relative_to(self.root): p.read_bytes() for p in (self.root / "sources/assets").rglob("*") if p.is_file() and p != self.map}
        result = self.run_routes()
        self.assertFalse(result["errors"])
        mapped = [r for r in result["pages"][0]["asset_rows"] if r["role"] == "illustration"]
        self.assertEqual([r["asset"] for r in mapped], [dedicated["asset"]])
        self.assertEqual(initial_assets, {p.relative_to(self.root): p.read_bytes() for p in (self.root / "sources/assets").rglob("*") if p.is_file() and p != self.map})

    def test_cli_duplicate_or_bad_route_fails(self):
        routes = self.root / "selected-routes.txt"
        env = {**os.environ, **{k: str(self.root) for k in ("TEMP", "TMP", "TMPDIR")}}
        for text in (ROUTE + "\n" + ROUTE, "/projects/UPPER/item/"):
            routes.write_text(text, encoding="utf-8")
            proc = subprocess.run([sys.executable, str(Path(convert.__file__)), "--root", str(self.root), "--routes", str(routes), "--report", str(self.report)], capture_output=True, env=env)
            self.assertNotEqual(proc.returncode, 0, proc.stdout.decode(errors="replace"))
            self.assertFalse(self.target.exists())
            self.assertEqual(self.map.read_bytes(), self.original_map)


if __name__ == "__main__":
    unittest.main()

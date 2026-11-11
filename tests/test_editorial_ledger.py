"""私有编辑底稿往返、逐页发布和能力清单闭合。"""
import copy
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
from editorial_ledger import Ledger, empty_book, reconcile_capabilities


class EditorialLedgerTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory(); self.addCleanup(temp.cleanup)
        self.root = Path(temp.name) / "site"; self.private = Path(temp.name) / "private"
        self.put("config/panel-projects.json", {"projects": [{"id": "demo", "source": {"repo": "example/source"},
                 "ai_refresh": {"content_path": "sources/pages/demo/page.json"}}]})
        for slug, parent in (("demo", None), ("sibling", "demo"), ("skill-demo", None), ("rule-authorization", None)):
            self.put(f"sources/pages/{slug}/page.json", {"page": slug, "parent": parent, "url": f"/{slug}/"})
        self.store = Ledger(self.root, companion=self.private)
        self.review = {"checked_at": "2026-11-12T03:00:00+08:00", "run_id": "fixture", "evidence": "合成核对"}

    def put(self, relative, value):
        path = self.root / relative; path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(value), encoding="utf-8")

    def test_empty_book_round_trip_and_manifest(self):
        book = empty_book("project-demo"); self.store.write(book)
        self.assertEqual(self.store.read("project-demo"), book)
        path = self.private / "files/editorial-ledgers/project-demo.json"
        manifest = json.loads((self.private / "manifest.json").read_text("utf-8"))
        row = next(r for r in manifest["files"] if r["target_relative_path"] == "files/editorial-ledgers/project-demo.json")
        self.assertEqual(row["bytes"], len(path.read_bytes()))
        self.assertEqual(row["sha256"], hashlib.sha256(path.read_bytes()).hexdigest())
        self.assertFalse((self.root / "sources/refresh/semantic-reviews.json").exists())
        self.assertEqual([self.store.book_for(p) for p in ("demo", "sibling", "skill-demo", "rule-authorization", "home")],
                         ["project-demo", "project-demo", "skill-demo", "rules", "website"])

    def test_only_successfully_published_page_advances(self):
        self.store.stage_reviews({"demo": self.review, "sibling": self.review})
        self.assertEqual(self.store.reviews(), {})
        before = self.store.read("project-demo")
        checkpoints = {"example/source": {"commit": "b" * 40, "time": self.review["checked_at"], "materials_path": "facts/demo.md"}}
        readback = {"status": "pass", "http": 200, "sha256": "c" * 64, "expected_sha256": "c" * 64}
        publication = {"schema": "wly.site-publication.v1", "deployment": 1,
                       "source_commit": "a" * 40, "verified_at_beijing": self.review["checked_at"],
                       "readback": {"demo/index.html": readback, "sibling/index.html": dict(readback, status="fail")}}
        self.assertFalse(self.store.advance_page("sibling", checkpoints, publication))
        self.assertEqual(self.store.read("project-demo"), before)
        stale = dict(publication, verified_at_beijing="2026-11-11T03:00:00+08:00")
        self.assertFalse(self.store.advance_page("demo", checkpoints, stale))
        self.assertEqual(self.store.read("project-demo"), before)
        for bad in (dict(readback, http=500), dict(readback, sha256="d" * 64)):
            altered = dict(publication, readback={"demo/index.html": bad})
            self.assertFalse(self.store.advance_page("demo", checkpoints, altered))
            self.assertEqual(self.store.read("project-demo"), before)
        self.assertTrue(self.store.advance_page("demo", checkpoints, publication))
        after = self.store.read("project-demo")
        self.assertEqual(after["pages"]["demo"]["checked_sources"], checkpoints)
        self.assertEqual(self.store.reviews(), {"demo": self.review})
        self.assertNotIn("pending_review", after["pages"]["demo"])
        self.assertEqual(after["pages"]["sibling"], before["pages"]["sibling"])
        checkpoints["example/source"]["commit"] = "d" * 40
        self.assertTrue(self.store.advance_page("demo", checkpoints, publication))
        self.assertEqual(self.store.read("project-demo")["pages"]["demo"]["checked_sources"], checkpoints)
        self.assertEqual(self.store.reviews(), {"demo": self.review})

    def test_missing_whole_row_and_unresolved_destination_are_reported(self):
        book = empty_book("project-demo")
        row = {"id": "cap", "title": "入口", "visibility": "能公开", "destinations": [], "omission_reason": ""}
        book["capabilities"] = [row]
        result = reconcile_capabilities(["cap", "lost"], book)
        self.assertEqual(result["missing"], ["lost"]); self.assertEqual(result["empty"], ["cap"])
        row["omission_reason"] = None
        self.assertEqual(reconcile_capabilities(["cap"], book)["empty"], ["cap"])
        row["destinations"] = [{"page": "demo"}]
        self.assertEqual(reconcile_capabilities(["cap"], book)["empty"], ["cap"])
        row["destinations"] = [{"page": "demo", "screen": "demo-01"}]
        book["capabilities"].append(copy.deepcopy(row))
        self.assertEqual(reconcile_capabilities(["cap"], book)["duplicate"], ["cap"])

    def test_image_must_reference_existing_capability(self):
        book = empty_book("project-demo")
        book["images"] = [{"id": "image", "image": "example.webp", "meaning": "合成用法", "capability_ids": ["missing"]}]
        with self.assertRaises(ValueError): self.store.write(book)
        self.assertFalse((self.private / "files/editorial-ledgers/project-demo.json").exists())

    def test_migration_preserves_legacy_values_without_new_checkpoints(self):
        basis = {"commit": "a" * 40, "commit_time": "2026-11-01T09:00:00+08:00"}
        self.store.pages["demo"]["based_on"] = basis
        legacy = {"pages": {"demo": self.review, "sibling": dict(self.review, evidence="旧证据")}}
        self.assertEqual(self.store.migrate(legacy), ["project-demo"])
        self.assertEqual(self.store.reviews(), legacy["pages"])
        book = self.store.read("project-demo")
        self.assertEqual(book["pages"]["demo"]["legacy_basis"], basis)
        self.assertEqual(book["source_repositories"], ["example/source"])
        self.assertTrue(all("checked_sources" not in p and "pending_review" not in p for p in book["pages"].values()))
        self.store.migrate(legacy)
        self.assertEqual(self.store.read("project-demo"), book)


if __name__ == "__main__":
    unittest.main()

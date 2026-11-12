"""整包预演、漂移拒绝、旧式基线与逐页核后记账。"""
from copy import deepcopy
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch
import test_update
import update
from update_gates import Run, git, now, read, write


class UpdatePublishTests(unittest.TestCase):
    def setUp(self):
        self.fixture = test_update.UpdateTests(); self.fixture.setUp(); self.addCleanup(self.fixture.doCleanups)
        self.root = self.fixture.root; self.run = self.fixture.create(pages=["demo", "child", "learning"])
        (self.root / ".git/info/exclude").write_text("/dist/\n/sources/refresh/\n", encoding="utf8")
        self.pub = update.site_publisher(update.ROOT); self.dist = self.root / "dist"; self.dist.mkdir()
        self.head = git(self.root, "rev-parse", "HEAD"); self.state = self.run.load()
        for p in self.state["pages"]: self.state["pages"][p].update(status="ready", passed=list(update.GATES))
        for p in ("demo", "child"): self.state["pages"][p]["merged_commit"] = self.head
        routes = ["/", "/cockpit/", "/computer-access/", *[f"/projects/{p}/" for p in self.state["pages"]]]
        inputs = dict(routes={}, site_files={}, source_files_sha256={}, source_identity=self.pub.runtime.source_identity(self.root))
        for url in routes:
            target = self.dist / self.pub.runtime.nav.route_file(url); target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text("<p>" + url + "</p>", encoding="utf8")
            inputs["routes"][url] = dict(self.pub.runtime.input_record({"fixture": url}), output_sha256=self.pub.oss.digest(target))
        (self.dist / "a.js").write_text("window.fixture=1;", encoding="utf8")
        self.pub.oss.write(self.dist / "release-manifest.json", dict(schema="wly.hybrid-release.v1", release_id="fixture", files=self.pub.oss.inventory(self.dist)))
        self.pub.oss.finalize_dist(self.dist, source_commit=self.head)
        for name in ("release-manifest.json", "release-identity.json"): inputs["site_files"][name] = self.pub.runtime.input_record({"fixture": name})
        self.pub.runtime.seal_inputs(self.dist, inputs); self.source = read(self.dist / "release-manifest.json")
        write(self.dist / ".build-receipt.json", dict(status="built", source_commit=self.head, input_fingerprints=inputs,
            files=[dict(path=p.relative_to(self.dist).as_posix(), sha256=self.pub.oss.digest(p)) for p in self.dist.rglob("*") if p.is_file()]))
        self.previous = deepcopy(self.source)
        for p in ("demo", "child"):
            url = f"/projects/{p}/"; self.previous["files"][self.pub.runtime.nav.route_file(url)]["sha256"] = "0" * 64
            self.previous["input_fingerprints"]["routes"][url] = self.pub.runtime.input_record({"fixture": "old"})
        self.previous["_build_files"] = {name: dict(sha256=self.pub.oss.digest(self.dist / name)) for name in ("release-manifest.json", "release-identity.json")}
        self.previous["oss"]["verification"] = dict(complete=True, objects={rel: dict(status="pass", http=200, **row) for rel, row in self.source["oss"]["objects"].items()})
        self.folder = self.run.directory / "publish-test"; self.folder.mkdir()
        scope = read(self.run.directory / "scope.json"); stamp = scope["sources"]["example/source"]
        self.batch = dict(run_id=self.state["run_id"], batch_id=self.folder.name, source_commit=self.head, release_id=self.source["release_id"],
            manifest_sha256=self.pub.oss.digest(self.dist / "release-manifest.json"), pages={p: dict(route=f"/projects/{p}/", merged_commit=self.head,
            checked_sources={"example/source": dict(commit=stamp["commit"], time=stamp["observed_at"], materials_path="scope.json")}) for p in ("demo", "child")},
            allowed_routes=["/projects/demo/", "/projects/child/"], legacy_baseline_reason=None)
        write(self.folder / "batch.json", self.batch); self.state["publication_batch"] = "publish-test/batch.json"
        write(self.run.directory / "state.json", self.state)

    def test_actual_dry_run_and_readback_only_advance_merged_pages(self):
        verify = self.pub.runtime.verify_inputs; real_run = update.subprocess.run
        builder = SimpleNamespace(build=lambda **kw: None, refresh_home_highlights=lambda: False, input_paths=lambda: [])
        def command(args, **kwargs):
            script = Path(args[4]).name if len(args) > 4 and args[0] == update.sys.executable else ""
            if script == "build-site.py": return SimpleNamespace(returncode=0)
            if script == "scan_glance.py":
                write(Path(args[-1]) / "scan-result.json", dict(failures=[], dist_files_sha256={p.relative_to(self.dist).as_posix(): self.pub.oss.digest(p) for p in self.dist.rglob("*") if p.is_file()})); return
            if script == "publish_site.py":
                self.pub.publish(SimpleNamespace(dist=self.dist, output=Path(args[-1]), dry_run=True, scan_result=Path(args[args.index("--scan-result") + 1]),
                    previous_manifest=None, source_commit=None, update_batch=Path(args[args.index("--update-batch") + 1]))); return
            return real_run(args, **kwargs)
        with patch.object(self.pub, "scan_public_words", return_value=[]), patch.object(self.pub.retention, "predecessor", return_value=self.previous), \
             patch.object(self.pub.retention, "shared", return_value=self.folder / "shared"), patch.object(self.pub, "net", return_value=""), \
             patch.object(self.pub.runtime, "verify_inputs", side_effect=lambda data: verify(data, self.root)), patch.object(self.pub, "load", return_value=builder), \
             patch.object(update, "site_publisher", return_value=self.pub), patch.object(update, "require_numbers"), patch.object(update.subprocess, "run", side_effect=command), \
             patch.object(update, "git", side_effect=lambda root, *args: "" if args[0] == "add" else git(root, *args)):
            prepared = update.publish(self.run.directory, dry_run=True)
            self.folder = Path(prepared["batch"]).parent; self.batch = read(prepared["batch"])
            result = read(self.folder / "dry-run/publish-receipt.json")
            self.assertEqual([r["path"] for r in result["published_reconciliation"]["pages"]], ["projects/child/index.html", "projects/demo/index.html"])
            self.assertNotIn(".build-receipt.json", git(Path(result["site_dist"]["root"]), "ls-files").splitlines())
            self.assertNotIn("/projects/learning/", self.batch["allowed_routes"])
            with patch.object(update, "site_publisher", return_value=self.pub):
                with self.assertRaises(ValueError): update.confirm_publication(self.run.directory, self.folder / "dry-run/publish-receipt.json")
                receipt = self.folder / "live/publish-receipt.json"
                proof = dict(result, status="published", dry_run=False, deployment=1, completed_at_beijing=now().isoformat(), get={
                    self.pub.runtime.nav.route_file(r["route"]): dict(status="pass", http=200, sha256=self.pub.oss.digest(self.dist / self.pub.runtime.nav.route_file(r["route"])),
                    expected_sha256=self.pub.oss.digest(self.dist / self.pub.runtime.nav.route_file(r["route"]))) for r in self.batch["pages"].values()})
                write(receipt, dict(proof, update_batch=dict(self.batch, run_id="other")))
                with self.assertRaises(ValueError): update.confirm_publication(self.run.directory, receipt)
                self.assertEqual(self.run.load()["pages"]["demo"]["status"], "ready")
                write(self.root / "sources/refresh/registry.json", dict(records=[dict(id=p, page=p, current_value=0) for p in ("demo", "child", "learning")]))
                write(self.folder / "freshness.json", dict(registry_pending=[dict(id=p, page=p, new_value=1) for p in ("demo", "child", "learning")]))
                write(receipt, proof); update.confirm_publication(self.run.directory, receipt)
        self.assertEqual([r["current_value"] for r in read(self.root / "sources/refresh/registry.json")["records"]], [1, 1, 0])
        book = update.Ledger(self.root).read("project-demo")
        self.assertEqual(set(p for p, r in book["pages"].items() if r["checked_sources"]["example/source"]["commit"] == self.head), {"demo", "child"})
        self.assertEqual(self.run.load()["pages"]["learning"]["status"], "ready")

    def test_drift_and_legacy_requirements(self):
        prior = deepcopy(self.previous); prior["input_fingerprints"] = self.source["input_fingerprints"]
        with self.assertRaisesRegex(ValueError, "Unchanged inputs"):
            with patch.object(self.pub.runtime, "verify_inputs"): self.pub.check_input_proofs(self.dist, self.source, prior, read(self.dist / ".build-receipt.json"), self.head)
        args = (self.batch, self.source, self.head, self.batch["manifest_sha256"])
        with self.assertRaisesRegex(ValueError, "explicit reason"): self.pub.check_update_batch(*args, dict(baseline="legacy"))
        self.batch["legacy_baseline_reason"] = "首趟整站换版"
        self.assertIn("首发用旧式基准", self.pub.check_update_batch(*args, dict(baseline="legacy")))
        with self.assertRaisesRegex(ValueError, "outside"):
            self.pub.check_update_batch(*args, dict(baseline="published", pages=[dict(path="projects/learning/index.html")]))

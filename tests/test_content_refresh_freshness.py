"""受控来源验证频率、真实时间和 collect→apply→原位回读闭环。"""
from datetime import date
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts/content-refresh"
sys.path.insert(0, str(SCRIPTS))
import refresh
from freshness import cadence, metadata, now, close_run, review_tasks
from inventory import build_inventory, strict_findings
from apply_edits import build_number_edits, apply_edits


class FreshnessTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.path = self.root / "sources/pages/demo/page.json"
        self.path.parent.mkdir(parents=True)
        self.page = dict(page="demo", kind="project", semantic_checked_at=now(), screens=[dict(id="top", text="调用 3 次；截至 2026-10-01")])
        self.write(self.path, self.page)
        self.write(self.root / "snapshot.json", dict(count=4, stamp="2026-10-18T09:00:00+08:00"))
        self.number = dict(id="n", page="demo", screen="top", label="调用数", source_location="合成快照",
                           as_of="2026-10-01", current_value=3, field="screens[0].text", page_pattern=r"调用 (\d+) 次",
                           automatic=True, scope_status="verified", retrieve=dict(kind="json", path="snapshot.json", pointer=["count"]),
                           source_observed_at_pointer=["stamp"])
        self.cutoff = dict(self.number, id="d", label="截至", current_value="2026-10-01", page_pattern=r"截至 (\d{4}-\d{2}-\d{2})", qualifies=["n"])
        self.registry = dict(schema="content-refresh.sources.v1", records=[self.number, self.cutoff], writing_points=[], retired_names=[])
        self.registry_path = self.root / "sources/refresh/registry.json"
        self.write(self.registry_path, self.registry)

    def write(self, path, data):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")

    def collect(self):
        result = refresh.collect(self.root, self.registry, entries={})
        result["registry_path"] = str(self.registry_path)
        return result

    def test_time_basis_does_not_promote_a_snapshot_or_unknown_to_today(self):
        checked = "2026-10-23T10:00:00+08:00"
        old = metadata({"meta": {"at": "2026-10-01T09:00:00+08:00"}}, dict(source_observed_at_pointer=["meta", "at"]), checked_at=checked)
        self.assertEqual((old["checked_at"], old["source_observed_at"], old["observation_basis"]), (checked, "2026-10-01T09:00:00+08:00", "snapshot_timestamp"))
        self.assertIsNone(metadata({"count": 1}, {}, checked_at=checked)["source_observed_at"])
        self.assertEqual(metadata({}, {"observation_basis": "live_read"}, checked_at=checked)["source_observed_at"], checked)
        self.assertEqual(metadata({}, {"observation_basis": "unknown"}, {"observation_basis": "live_read"}, checked)["observation_basis"], "unknown")

    def test_cadence_every_request_semantic_28_days_target_change_and_history(self):
        today = date(2026, 10, 23)
        self.assertTrue(cadence(dict(as_of="2026-10-23"), today=today)["refresh_due"])
        semantic = dict(freshness_class="semantic", semantic_checked_at="2026-09-26")
        self.assertFalse(cadence(semantic, today=today)["refresh_due"])
        self.assertTrue(cadence(dict(semantic, semantic_checked_at="2026-09-25"), today=today)["refresh_due"])
        self.assertTrue(cadence(semantic, today=today, targeted=True)["refresh_due"])
        self.assertTrue(cadence(dict(semantic, source_changed=True), today=today)["refresh_due"])
        self.assertEqual(cadence(dict(freshness_class="semantic"), today=today)["freshness_status"], "due_unknown")
        self.assertFalse(cadence(dict(historical=True), today=today)["refresh_due"])

    def test_collect_uses_source_date_and_unknown_keeps_old_date_and_candidate(self):
        result = self.collect()
        self.assertEqual(result["rows"][1]["new_value"], "2026-10-18")
        self.assertEqual(result["rows"][0]["source_observed_at"], "2026-10-18T09:00:00+08:00")
        self.assertTrue(result["run_id"])
        self.registry["records"][0].pop("source_observed_at_pointer")
        result = self.collect()
        self.assertEqual((result["rows"][0]["status"], result["rows"][0]["new_value"]), ("unavailable", 4))
        self.assertIsNone(result["rows"][1]["new_value"])
        self.assertEqual(result["rows"][1]["old_value"], "2026-10-01")
        self.assertEqual(build_number_edits(self.root, result)["edits"], [])

    def test_strict_uses_collect_locator_and_classifies_retired_history(self):
        bad = dict(self.number, id="bad", page_pattern=r"不存在 (\d+)")
        historical = dict(bad, id="old", historical=True)
        inventory = build_inventory(self.root / "sources/pages", [bad, historical], {})
        findings = strict_findings(inventory, [bad, historical], {})
        self.assertTrue(any("bad" in f["record_ids"] for f in findings))
        self.assertFalse(any("old" in f["record_ids"] for f in findings))
        self.assertEqual(next(b for b in inventory["record_bindings"] if b["record_id"] == "old")["classification"], "historical")

    def test_cli_inventory_collect_apply_and_close_with_registry_readback(self):
        output = self.root / "run"
        def run(script, *args, expected=0):
            proc = subprocess.run([sys.executable, "-B", "-X", "utf8", str(SCRIPTS / script), *map(str, args)], capture_output=True, text=True, encoding="utf-8")
            self.assertEqual(proc.returncode, expected, proc.stdout + proc.stderr)
        run("refresh.py", "--root", self.root, "--inventory", "--strict", "--output", output)
        self.assertFalse((output / "result.json").exists())
        run("refresh.py", "--root", self.root, "--strict", "--no-report", "--output", output)
        result = json.loads((output / "result.json").read_text("utf-8"))
        run("refresh.py", "--root", self.root, "--close-run", output / "result.json", expected=2)
        report_path = output / "apply-report.json"
        run("apply_edits.py", output / "number-edits.json", "--root", self.root, "--report", report_path)
        run("refresh.py", "--root", self.root, "--close-run", output / "result.json", "--apply-report", report_path)
        report = json.loads(report_path.read_text("utf-8"))
        self.assertEqual(report["run_id"], result["run_id"])
        self.assertTrue(all(f["status"] == "verified" for f in report["field_readback"]))
        registry = json.loads(self.registry_path.read_text("utf-8"))
        self.assertEqual(registry["records"][0]["current_value"], 4)
        self.assertEqual(registry["records"][0]["source_observed_at"], "2026-10-18T09:00:00+08:00")
        self.assertIn("调用 4 次；截至 2026-10-18", self.path.read_text("utf-8"))

    def test_close_rejects_tamper_wrong_run_and_unapplied_changes(self):
        result = self.collect()
        self.assertEqual(close_run(self.root, result)["status"], "incomplete")
        report = apply_edits(self.root, build_number_edits(self.root, result))
        self.assertEqual(close_run(self.root, result, report)["status"], "closed")
        with self.assertRaises(ValueError):
            close_run(self.root, result, dict(report, run_id="another"))
        self.path.write_text(self.path.read_text("utf-8").replace("调用 4", "调用 9"), encoding="utf-8")
        self.assertEqual(close_run(self.root, result, report)["status"], "incomplete")

    def test_manual_state_review_and_semantic_due_require_actual_closure(self):
        result = self.collect()
        report = apply_edits(self.root, build_number_edits(self.root, result))
        inventory = dict(items=[dict(id="state", page="demo", field="status_line.state", kind="status_line.state")])
        result["manual_tasks"] = review_tasks(inventory, [])
        self.assertEqual(close_run(self.root, result, report)["pending"], 1)
        report["manual_closures"] = [dict(id="review:state", run_id=result["run_id"], checked_at=now(), evidence="受控样例状态已核对", status="completed")]
        self.assertEqual(close_run(self.root, result, report)["status"], "closed")

    def test_unknown_and_unchanged_close_only_after_real_current_check(self):
        self.write(self.root / "snapshot.json", dict(count=3, stamp="2026-10-01T09:00:00+08:00"))
        result = self.collect()
        self.assertEqual(close_run(self.root, result)["status"], "closed")
        self.write(self.root / "snapshot.json", dict(count=3))
        result = self.collect()
        self.assertEqual(close_run(self.root, result)["rows"][0]["status"], "unknown_preserved")
        result["rows"][0]["checked_at"] = None
        self.assertEqual(close_run(self.root, result)["status"], "incomplete")


if __name__ == "__main__":
    unittest.main()

import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class OwnerRouteTests(unittest.TestCase):
    def test_pcconfig_uses_complete_readonly_task_observation(self):
        projects = json.loads((ROOT / "config/panel-projects.json").read_text("utf-8-sig"))["projects"]
        project = next(p for p in projects if p["id"] == "pcconfig")
        route = next(c for c in project["ai_refresh"]["collectors"] if "scan_tasks.ps1" in c)
        for expected in ("-NoWrite -Json", "observer_elevated=true", "task_visibility_complete=true"):
            self.assertIn(expected, route)
        self.assertNotIn("Test-PCConfigDrift.ps1", json.dumps(project))
        requirement = project["ai_refresh"]["collector_requirements"][0]
        self.assertIn("-NoWrite -Json", requirement["invocation_contract"])
        self.assertNotIn("pointer_path", requirement)
        records = json.loads((ROOT / "sources/refresh/registry.json").read_text("utf-8-sig"))["records"]
        scans = [r for r in records if r["page"] == "pcconfig" and r.get("manual_reason") == "needs_admin_rescan"]
        required = {"pcconfig-n-tasks-0", "pcconfig-n-tasks-enabled-0", "pcconfig-n-tasks-enabled-1",
                    "pcconfig-n-tasks-split-0", "pcconfig-n-tasks-split-1", "pcconfig-n-tasks-split-2"}
        self.assertTrue(required.issubset({record["id"] for record in scans}))
        for record in scans:
            self.assertEqual(record["retrieve"]["kind"], "manual")
            if record["id"] in required:
                self.assertEqual(record["retrieve"]["instructions"], record["manual_route"])
            for expected in ("scan_tasks.ps1 -NoWrite -Json", "task_visibility_complete=true", "Unknown", "PCConfig"):
                self.assertIn(expected, record["manual_route"])

    def test_github_uses_existing_zero_write_owner_status(self):
        projects = json.loads((ROOT / "config/panel-projects.json").read_text("utf-8-sig"))["projects"]
        project = next(p for p in projects if p["id"] == "github-index")
        self.assertNotIn("Get-ProjectCognitionSource.ps1", json.dumps(project))
        self.assertEqual(sum("Get-GitOwnerStatus.ps1 -Json" in c for c in project["ai_refresh"]["collectors"]), 1)
        entries = json.loads((ROOT / "sources/refresh/entries.json").read_text("utf-8-sig"))
        self.assertTrue(entries["b9-github-owner-summary"]["read_only"])
        self.assertIn("Get-GitOwnerStatus.ps1", " ".join(entries["b9-github-owner-summary"]["argv"]))

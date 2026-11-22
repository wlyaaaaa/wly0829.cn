import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "live_weekly_check", Path(__file__).with_name("live-weekly-check.py")
)
check = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check)


class LiveWeeklyCheck(unittest.TestCase):
    def setUp(self):
        self.root = Path(self.enterContext(tempfile.TemporaryDirectory(dir=Path.cwd())))
        self.fields = self.root / "fixture-fields.json"
        self.roster = self.root / check.ROSTER_NAME
        self.output = self.root / "output.json"
        now = check.datetime.fromisoformat("2026-11-18T09:00:00+08:00")
        self.today = now.date()
        self.enterContext(patch.object(check, "datetime")).now.return_value = now
        check.write_json(self.roster, {"date": str(self.today), "ids": ["hello"]})

    def run_check(self, **snapshot):
        if snapshot:
            check.write_json(self.fields, {"schema": check.FIELD_SCHEMA, "date": str(self.today),
                                          "resources": {"home": {"data": ["present"]}}} | snapshot)
        with patch.object(sys, "argv", ["check", "--owner-fields", str(self.fields), "--output", str(self.output)]):
            code = check.main()
        return code, json.loads(self.output.read_text(encoding="utf-8"))

    def test_reports_paths_for_all_three_states_and_filters_known_fields(self):
        paths = {"data.items[].weekly_demo_null": ["null"], "data.items[].weekly_demo_empty": ["empty"],
                 "data.items[].*.weekly_demo_present": ["present"], "data.items[].cpu_c": ["present"],
                 "data.items[].at": ["present"], "data.items[].*": ["present"], "data.items[]": ["present"]}
        code, result = self.run_check(date=str(self.today - check.timedelta(days=2)),
                                      resources={"projects/*/records?section=demo": paths})
        self.assertEqual(code, 3)
        self.assertEqual(result["fields"], {path: ["projects/*/records?section=demo"] for path in list(paths)[:3]})
        self.assertEqual(result["projects_checked"], 1)
        self.assertIn("hello", result["projects"])

    def test_filters_source_tokens_and_exact_baseline_paths(self):
        paths = {path: ["present"] for path in ("data.items[].drawn", "data.items[].known", "data.known")}
        self.assertEqual(check.unused_fields({"home": paths}, "card.drawn", {"data.items[].known": "known"}),
                         {"data.known": ["home"]})

    def test_missing_wrong_schema_and_stale_fields_are_incomplete(self):
        for snapshot in ({}, {"schema": "wrong"}, {"date": str(self.today - check.timedelta(days=3))}):
            with self.subTest(snapshot=snapshot):
                code, result = self.run_check(**snapshot)
                self.assertEqual(code, 2)
                self.assertEqual(result["failed_resources"], [self.fields.name])
                self.assertEqual(result["projects_checked"], 1)

    def test_missing_roster_is_incomplete_but_keeps_field_findings(self):
        self.roster.unlink()
        code, result = self.run_check(resources={"home": {"data.weekly_demo_field": ["null"]}})
        self.assertEqual(code, 2)
        self.assertEqual(result["fields"], {"data.weekly_demo_field": ["home"]})
        self.assertEqual(result["failed_resources"], [self.roster.name])
        self.assertIsNone(result["projects"])

    def test_clean_snapshots_exit_zero(self):
        check.write_json(self.roster, {"date": str(self.today), "ids": []})
        code, result = self.run_check(schema=check.FIELD_SCHEMA)
        self.assertEqual((code, result["fields"], result["projects"]), (0, {}, {}))

    def test_reports_missing_project_thumbnail(self):
        self.assertEqual(check.project_key("hello"), "4f9f2cab")
        looks = {"4f9f2cab": {"img": "/live/img/main.webp", "thumb": "/live/img/small.webp"}}
        (self.root / "main.webp").touch()
        self.assertEqual(
            check.missing_illustrations([{"id": "hello"}], looks, self.root),
            {"hello": {"key": "4f9f2cab", "missing": ["thumb"]}},
        )


if __name__ == "__main__":
    unittest.main()

"""真实错例：同页测试定义不一、总数和分项不合；不可读不能拿旧值冒充。"""
import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
from inventory import build_inventory, number_relations, strict_findings
from validation import registry_errors


class RelationTests(unittest.TestCase):
    def records(self):
        return [dict(id=rid, page="demo", screen="demo-01", label=rid, field=f"status_line.facts[{i}]",
                     current_value=0, source_location="合成测试", measurement_scope="同轮任务计数",
                     as_of="2026-11-04", historical=True, retrieve={"kind": "manual"},
                     number_class="historical_example") for i, rid in enumerate(("total", "a", "b", "copy"))]

    def test_actual_page_conflicts_and_strict_interface(self):
        records = self.records()
        records[0]["relations"] = [{"kind": "sum", "record_ids": ["a", "b"]},
                                    {"kind": "equal", "record_ids": ["copy"]}]
        page = {"page": "demo", "screens": [{"id": "demo-01", "text": "示例"}],
                "status_line": {"facts": ["920", "534", "222", "957"]}}
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / "sources/pages"
            (root / "demo").mkdir(parents=True)
            (root / "demo/page.json").write_text(json.dumps(page), encoding="utf8")
            inventory = build_inventory(root, records)
        results = inventory["number_relation_findings"]
        self.assertEqual([r["status"] for r in results], ["conflict", "conflict"])
        self.assertEqual(results[0]["computed_value"], "756")
        self.assertEqual([v["value"] for v in results[1]["values"]], ["920", "957"])
        self.assertEqual(results[1]["values"][1]["record_id"], "copy")
        self.assertEqual(len(strict_findings(inventory, records)), 2)

    def test_references_scope_cutoff_and_class_are_validated(self):
        records = self.records()
        records[0]["relations"] = [{"kind": "sum", "record_ids": ["a", "b"]}]
        self.assertEqual(registry_errors(records, {}), [])
        cases = [("record_ids", ["missing"]), ("record_ids", ["a", "a"]),
                 ("record_ids", ["total", "a"]), ("record_ids", ["a"]), ("kind", "guess")]
        for key, value in cases:
            changed = copy.deepcopy(records)
            changed[0]["relations"][0][key] = value
            self.assertTrue(registry_errors(changed, {}))
        changed = copy.deepcopy(records)
        changed[0]["relations"] = changed[0]["relations"][0]
        self.assertTrue(registry_errors(changed, {}))
        self.assertEqual(number_relations(changed, [])[0]["status"], "invalid")
        for key, value in (("as_of", "2026-11-05"), ("measurement_scope", "另一集合"),
                           ("number_class", "unknown")):
            changed = copy.deepcopy(records)
            changed[1][key] = value
            self.assertTrue(registry_errors(changed, {}))

    def test_exact_decimal_sum_and_unreadable_are_distinct(self):
        records = self.records()[:3]
        records[0]["relations"] = [{"kind": "sum", "record_ids": ["a", "b"]}]
        bindings = [dict(record_id=r["id"], status="readable", value=v)
                    for r, v in zip(records, ("1,000.3", "1,000.1", "0.2"))]
        self.assertEqual(number_relations(records, bindings)[0]["status"], "passed")
        records[0]["relations"] = [{"kind": "equal", "record_ids": ["a"]}]
        bindings[0]["value"] = bindings[1]["value"] = "未知"
        self.assertEqual(number_relations(records, bindings)[0]["status"], "unavailable")
        bindings[1].update(status="binding_error", value=None)
        self.assertEqual(number_relations(records, bindings)[0]["status"], "unavailable")
        records[1]["as_of"] = "2026-11-05"
        self.assertEqual(number_relations(records, bindings)[0]["status"], "invalid")

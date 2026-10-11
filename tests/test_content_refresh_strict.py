"""严格盘点只确认明确登记，自动建议不能替代人工绑定。"""
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
from inventory import build_inventory, strict_findings, fact_tasks


class StrictTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.text = "# 示例\n\n- **3 件**｜材料\n\n数字截至 2026 年 10 月 1 日"
        self.page = {"page": "demo", "screens": [{"id": "demo-01", "text": self.text}],
                     "status_line": {"state": "在用"}}
        self.write_page()
        self.number = {"id": "count", "page": "demo", "screen": "demo-01", "label": "材料数",
                       "field": "screens[0].text", "page_pattern": r"\*\*(3) 件",
                       "source_location": "合成测试", "automatic": True, "scope_status": "verified",
                       "retrieve": {"kind": "json", "path": "fixture.json", "pointer": ["count"]}}
        self.cutoff = dict(self.number, id="date", page_pattern=r"截至 (2026 年 10 月 1 日)",
                           qualifies=["count"])

    def write_page(self):
        path = self.root / "demo/page.json"
        path.parent.mkdir(exist_ok=True)
        path.write_text(json.dumps(self.page, ensure_ascii=False), encoding="utf-8")

    def check(self, records, entries=None):
        inventory = build_inventory(self.root, records, entries)
        return inventory, strict_findings(inventory, records, entries)

    def test_suggestion_does_not_register_cutoff_and_reports_original(self):
        inventory, findings = self.check([self.number])
        self.assertEqual(len(findings), 1)
        self.assertEqual((findings[0]["page"], findings[0]["screen"]), ("demo", "demo-01"))
        self.assertIn("数字截至 2026 年", findings[0]["excerpt"])
        date = next(i for i in inventory["items"] if i["kind"] == "as_of")
        self.assertEqual(date["qualifies_suggestion"], ["count"])
        self.assertEqual(date["record_ids"], [])
        inventory, findings = self.check([self.number, self.cutoff])
        self.assertEqual(findings, [])
        self.assertEqual((inventory["coverage"]["required_items"], inventory["coverage"]["automatic_ratio"]), (2, 1.0))

    def test_historical_record_cannot_exempt_current_display(self):
        _, findings = self.check([dict(self.number, historical=True), self.cutoff])
        self.assertEqual(len(findings), 2)
        self.page["screens"][0]["section"] = "history"
        self.write_page()
        self.assertEqual(self.check([])[1], [])
        self.assertEqual(self.check([dict(self.number, retrieve={"kind": "invalid"}), self.cutoff])[1], [])

    def test_manual_requires_allowed_reason_and_route(self):
        manual = dict(self.number, automatic=False, retrieve={"kind": "manual"})
        self.assertEqual(len(self.check([manual, self.cutoff])[1]), 2)
        for reason in ("needs_admin_rescan", "ui_only", "external_account", "judgment", "source_broken"):
            with self.subTest(reason=reason):
                fixed = dict(manual, manual_reason=reason, manual_route="测试来源：只读取状态；修复交来源项目")
                self.assertEqual(self.check([fixed, self.cutoff])[1], [])
        bad = dict(manual, manual_reason="unclear", manual_route="有取法")
        self.assertEqual(len(self.check([bad, self.cutoff])[1]), 2)
        orphan = dict(manual, id="orphan", page_pattern=r"不存在的 (9) 件")
        _, findings = self.check([self.number, self.cutoff, orphan])
        self.assertEqual((len(findings), findings[0]["field"]), (1, "source_registry.orphan"))
        self.assertIn("manual_reason", findings[0]["reason"])

    def test_qualifies_cannot_point_to_missing_current_location(self):
        orphan = dict(self.number, id="orphan", page_pattern=r"不存在的 (9) 件")
        self.assertEqual(len(self.check([self.number, orphan, dict(self.cutoff, qualifies=["orphan"])])[1]), 1)
        self.assertEqual(len(self.check([self.number, dict(self.cutoff, qualifies=["unknown"])])[1]), 1)
        self.page["screens"][0]["text"] = "# 示例\n\n普通段落数量是 3 件，截至 2026 年 10 月 1 日。"
        self.write_page()
        number = dict(self.number, page_pattern=r"数量是 (3) 件")
        self.assertEqual(self.check([number, self.cutoff])[1], [])

    def test_whole_text_field_does_not_cover_multiple_facts(self):
        _, findings = self.check([dict(self.number, page_pattern=None), self.cutoff])
        self.assertEqual(len(findings), 2)
        start = self.text.index("3 件")
        explicit = dict(self.number, page_pattern=None, start=start, end=start + 1)
        self.assertEqual(self.check([explicit, self.cutoff])[1], [])
        self.page["status_line"]["facts"] = ["近7天用了2次"]
        self.write_page()
        ambiguous = dict(self.number, id="facts", field="status_line.facts[0]", page_pattern=r"(\d+)")
        self.assertEqual(len(self.check([explicit, self.cutoff, ambiguous])[1]), 1)

    def test_private_whitelisted_entry_and_status_leaf(self):
        entries = {"counts": {"argv": ["python", "status.py"], "cwd": ".", "read_only": True,
                              "owner_project": "demo", "output": "json"}}
        number = dict(self.number, private=True, retrieve={"kind": "entry", "entry": "counts"})
        self.page["status_line"]["last"] = {"label": "上次使用", "at": "2026-10-01"}
        self.write_page()
        last = dict(self.number, id="last", field="status_line.last.at", page_pattern=None)
        inventory, findings = self.check([number, self.cutoff, last], entries)
        self.assertEqual(findings, [])
        self.assertIn("可自动重取（只读计数/状态，本次清点未执行）", fact_tasks(inventory))
        entries["counts"]["read_only"] = False
        self.assertEqual(len(self.check([number, self.cutoff, last], entries)[1]), 2)
        self.assertEqual(len(self.check([number, self.cutoff, last], {})[1]), 2)


if __name__ == "__main__":
    unittest.main()

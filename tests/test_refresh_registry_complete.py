"""每个当前展示项必须登记；批量绑定结束前此验收测试应如实失败。"""
import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts/content-refresh"))
from inventory import build_inventory, strict_findings
from binding_checks import binding_findings


class RegistryCompletenessTests(unittest.TestCase):
    def test_every_current_display_is_registered(self):
        records = json.loads((ROOT / "sources/refresh/registry.json").read_text("utf-8-sig"))["records"]
        path = ROOT / "sources/refresh/entries.json"
        entries = json.loads(path.read_text("utf-8-sig")) if path.exists() else {}
        inventory = build_inventory(ROOT / "sources/pages", records, entries)
        findings = strict_findings(inventory, records, entries)
        lines = [f"{i['page']} / {i['screen']} / {i['excerpt']}：{i['reason']}" for i in findings]
        self.assertEqual(len(findings), 0, f"{len(findings)} 项漏登记：\n" + "\n".join(lines))
        self.assertGreaterEqual(inventory["coverage"]["automatic_ratio"], .85, "自动取数覆盖低于85%")

    def test_every_binding_will_apply_next_round(self):
        records = json.loads((ROOT / "sources/refresh/registry.json").read_text("utf-8-sig"))["records"]
        checks = binding_findings(ROOT, records)
        for kind in ("pattern", "digits", "mirror"):
            self.assertEqual(checks[kind], [], kind + "：\n" + "\n".join(f"{c['record_id']}：{c['reason']}" for c in checks[kind]))
        # 截至日期连着人工项（永远推不动）：10 月 23 日清点为 23 条，只许减少
        self.assertLessEqual(len(checks["manual_qualified"]), 0, "\n".join(f"{c['record_id']}：{c['reason']}" for c in checks["manual_qualified"]))
        # 自动数字同句里没登记的观察时间：10 月 23 日清点为 25 处，只许减少；改到哪页就把那页的补上
        self.assertLessEqual(len(checks["observed"]), 0, "\n".join(f"{c['page']}：{c['excerpt']}" for c in checks["observed"]))


if __name__ == "__main__":
    unittest.main()

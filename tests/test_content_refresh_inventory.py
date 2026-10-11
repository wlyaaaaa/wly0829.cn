"""清点全覆盖、同屏逐项绑定和私人来源的任务路由。"""
import copy
import json
from pathlib import Path
import re
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
import refresh
from inventory import build_inventory, fact_tasks


class InventoryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.page = {
            "page": "demo", "kind": "project", "title": "示例", "screens": [
                {"id": "demo-01", "section": "top", "text":
                 "# 示例\n\n- **3 件** 公开材料\n- **3 件** 未登记的任务\n- **7 件** 未登记\n"
                 "- **5 次** 私人源统计\n\n数字截至 2026 年 10 月 1 日\n\n"
                 "这是来源注，截至 10 月 2 日；合成数据。",
                 "scene": "画一行截至 10 月 1 日的小字"},
                {"id": "demo-02", "section": "usage", "text": "说明", "screenshots": [
                    {"caption": "截图截至 10 月 3 日"}]}],
            "status_line": {"state": "在用", "as_of": "2026-10-04",
                            "last": {"label": "上次使用", "at": "2026-10-03 10:00"}, "facts": ["近7天用了2次"]},
            "registry": {"numbers": [
                {"id": "n-three", "text": "3 件", "screens": ["demo-01"]},
                {"id": "n-copy", "text": "参考截至 10 月 4 日", "screens": ["demo-01"]}]},
            "notes": {"unsure": ["内部截至 10 月 5 日"]}}
        self.write_page("demo", self.page)
        self.write_page("frozen", {"page": "frozen", "kind": "frozen", "screens": [
            {"id": "frozen-01", "text": "- **9 次** 历史记录\n\n截至 9 月 1 日"}]})
        layout = [{"screen": "demo-01", "orientation": orientation, "blocks": [
            {"type": "notice", "variant": "source_note", "text_ref": "这是来源注"}]} for orientation in ("h", "v")]
        (self.root / "sources/pages/demo/layout.json").write_text(json.dumps(layout, ensure_ascii=False), encoding="utf-8")
        self.records = [
            {"id": "public", "page": "demo", "screen": "demo-01", "label": "公开材料",
             "page_pattern": r"\*\*(3) 件\*\* 公开材料", "automatic": True, "scope_status": "verified",
             "source_location": "本仓库公开口径", "retrieve": {"kind": "file_count", "path": "."}},
            {"id": "ambiguous", "page": "demo", "screen": "demo-01", "label": "重复同值",
             "page_number": "n-three", "automatic": True, "scope_status": "verified",
             "source_location": "另一口径", "retrieve": {"kind": "manual"}},
            {"id": "private", "page": "demo", "screen": "demo-01", "label": "私人源统计",
             "page_pattern": r"\*\*(5) 次\*\* 私人源统计", "automatic": True, "private": True,
             "scope_status": "pending", "source_location": "V:/Personal/Projects/personal-media/只读入口",
             "retrieve": {"kind": "json", "path": "必须不读.json"}},
            {"id": "frozen-private", "page": "frozen", "screen": "frozen-01", "label": "旧统计",
             "private": True, "source_location": "旧项目", "retrieve": {"kind": "manual"}}]

    def write_page(self, name, page):
        path = self.root / "sources/pages" / name / "page.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(page, ensure_ascii=False), encoding="utf-8")

    def test_two_pages_all_surfaces_status_cards_and_source_note(self):
        result = build_inventory(self.root / "sources/pages", self.records)
        items = result["items"]
        cutoffs = [i for i in items if i["kind"] == "as_of"]
        self.assertEqual(result["coverage"]["pages_checked"], 2)
        self.assertEqual({i["field"] for i in cutoffs}, {
            "screens[0].text", "screens[0].scene", "screens[1].screenshots[0].caption",
            "registry.numbers[1].text", "notes.unsure[0]"})
        self.assertEqual(len(cutoffs), 7)
        self.assertEqual({i["surface"] for i in cutoffs}, {"visible", "author", "reference"})
        self.assertEqual({i["kind"] for i in items if i["field"].startswith("status_line")}, {
            "status_line.as_of", "status_line.last", "status_line.state", "status_line.facts"})
        self.assertEqual(len([i for i in items if i["kind"] == "source_note"]), 1)
        self.assertEqual(len([i for i in items if i["kind"] == "first_screen_card"]), 5)
        for item in items:
            if item["surface"] == "author" or item["historical"]:
                self.assertFalse(item["requires_refresh"])
        self.assertNotIn("frozen-private", fact_tasks(result))

    def test_binding_uses_actual_location_and_rejects_duplicate_number(self):
        cards = [i for i in build_inventory(self.root / "sources/pages", self.records)["items"]
                 if i["kind"] == "first_screen_card" and i["page"] == "demo"]
        self.assertEqual(cards[0]["record_ids"], ["public"])
        self.assertTrue(cards[0]["automatic"])
        for item in cards[1:3]:
            self.assertFalse(item["registered"])
            self.assertFalse(item["automatic"])
            self.assertEqual(item["registration_status"], "待登记·人工取数")
        self.assertEqual(cards[3]["record_ids"], ["private"])
        self.assertFalse(cards[3]["automatic"])
        text = self.page["screens"][0]["text"]
        for item in cards:
            self.assertEqual(text[item["start"]:item["end"]], item["excerpt"])

    def test_multi_match_pattern_cannot_register_another_card(self):
        record = dict(self.records[0], id="ambiguous-pattern", page_pattern=r"\*\*([\d,]+) 件\*\*")
        result = build_inventory(self.root / "sources/pages", [record])
        for item in result["items"]:
            if item["kind"] == "first_screen_card" and item["page"] == "demo":
                self.assertFalse(item["registered"])
                self.assertFalse(item["automatic"])

    def test_source_note_numeric_drift_keeps_current_visible_paragraph(self):
        self.page["screens"][0]["text"] += "\n\n0.49 秒和 2 / 9 条是合成样例。"
        self.write_page("demo", self.page)
        layout_path = self.root / "sources/pages/demo/layout.json"
        layout_path.write_text(json.dumps([{"screen": "demo-01", "blocks": [
            {"type": "notice", "variant": "source_note", "text_ref": "0.48 秒和 2 / 9 条是"}]}]), encoding="utf-8")
        note = next(i for i in build_inventory(self.root / "sources/pages", self.records)["items"] if i["kind"] == "source_note")
        self.assertEqual((note["surface"], note["excerpt"], note["requires_refresh"]),
                         ("visible", "0.49 秒和 2 / 9 条是合成样例。", True))
        layout_path.write_text(json.dumps([{"screen": "demo-01", "blocks": [
            {"type": "notice", "variant": "source_note", "text_ref": "旧说明已改写"}]}]), encoding="utf-8")
        note = next(i for i in build_inventory(self.root / "sources/pages", self.records)["items"] if i["kind"] == "source_note")
        self.assertTrue(note["requires_refresh"])
        self.assertFalse(note["automatic"])
        self.assertNotEqual(note["excerpt"], "旧说明已改写")

    def test_first_screen_table_plain_numbers_and_numbered_metrics(self):
        self.page["screens"][0]["text"] = (
            "# 示例\n\n| **8 份** | **三块硬盘** |\n|---|---|\n| 材料 | 副本 |\n\n"
            "10%｜使用率\n\n数字卡片：\n1. **2 个**｜任务\n2. **3 组**｜测试")
        self.write_page("demo", self.page)
        (self.root / "sources/pages/demo/layout.json").write_text(json.dumps([
            {"screen": "demo-01", "blocks": [{"type": "stat_card", "text_ref": "8份三块硬盘材料副本"}]}]), encoding="utf-8")
        cards = [i for i in build_inventory(self.root / "sources/pages", self.records)["items"]
                 if i["page"] == "demo" and i["kind"] == "first_screen_card"]
        self.assertEqual([i["excerpt"].strip() for i in cards], [
            "**8 份**", "**三块硬盘**", "10%｜使用率", "1. **2 个**｜任务", "2. **3 组**｜测试"])

    def test_inventory_cli_never_retrieves_or_generates_html(self):
        registry = self.root / "sources/refresh/registry.json"
        registry.parent.mkdir()
        registry.write_text(json.dumps({"schema": "content-refresh.sources.v1", "records": self.records}), encoding="utf-8")
        output = self.root / "inventory"
        original = (self.root / "sources/pages/demo/page.json").read_bytes()
        with patch.object(sys, "argv", ["refresh.py", "--root", str(self.root), "--inventory", "--output", str(output)]), \
                patch.object(refresh, "collect") as collect, patch.object(refresh, "retrieve") as retrieve, \
                patch.object(refresh, "bounded") as command:
            self.assertEqual(refresh.main(), 0)
            collect.assert_not_called()
            retrieve.assert_not_called()
            command.assert_not_called()
        self.assertEqual({p.name for p in output.iterdir()}, {"dated-inventory.json", "fact-tasks.md"})
        tasks = (output / "fact-tasks.md").read_text(encoding="utf-8")
        self.assertIn("来源项目：personal-media", tasks)
        self.assertIn("V:/Personal/Projects/personal-media/只读入口", tasks)
        self.assertIn("领域入口事实任务", tasks)
        self.assertNotIn("需本人资料", tasks)
        self.assertEqual((self.root / "sources/pages/demo/page.json").read_bytes(), original)

    def test_groups_split_within_source_project_at_25_items(self):
        result = build_inventory(self.root / "sources/pages", self.records)
        template = next(i for i in result["items"] if i.get("private"))
        items = [dict(copy.deepcopy(template), id=f"private-{i}") for i in range(28)]
        tasks = fact_tasks(dict(result, items=items))
        groups = re.split(r"^## 来源项目：", tasks, flags=re.M)[1:]
        self.assertEqual(len(groups), 2)
        self.assertEqual([len(re.findall(r"^- ", group, re.M)) for group in groups], [25, 3])


if __name__ == "__main__":
    unittest.main()

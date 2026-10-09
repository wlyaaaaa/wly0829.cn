"""只读刷新最容易误报或越界的路径。"""
from datetime import date
import json
from pathlib import Path
import sys
import subprocess
import tempfile
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
import refresh
class RefreshTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        page = self.root / "sources/pages/demo/page.json"
        page.parent.mkdir(parents=True)
        page.write_text(json.dumps({"page": "demo", "kind": "project", "screens": [
            {"id": "demo-01", "text": "2,020 次｜调用\n截至 2026 年 9 月 28 日"}]}), encoding="utf-8")
        self.record = {"id": "r", "page": "demo", "screen": "demo-01", "label": "调用数",
            "as_of": "2026-09-28", "current_value": 99, "category": "人工", "source_location": "只读来源",
            "page_pattern": r"([\d,]+) 次", "automatic": True, "private": False,
            "retrieve": {"kind": "json", "path": "count.json", "pointer": ["count"]}}

    def run_collect(self, **kwargs):
        return refresh.collect(self.root, {"records": [self.record]}, today=date(2026, 10, 10), **kwargs)["rows"][0]
    def test_actual_page_number_and_overdue_not_registration_fallback(self):
        with patch.object(refresh, "bounded", return_value="2021"):
            row = self.run_collect()
        self.assertEqual((row["old_value"], row["new_value"], row["status"], row["overdue"]),
                         ("2,020", 2021, "changed", True))
        self.record["page_pattern"] = "不会匹配(1)"
        with patch.object(refresh, "bounded") as read:
            self.assertEqual(self.run_collect()["status"], "unavailable")
            read.assert_not_called()
    def test_private_and_historical_never_read_sources(self):
        for flag, expected in (("private", "needs_personal_data"), ("historical", "historical"), ("frozen", "historical")):
            self.record[flag] = True
            with patch.object(refresh, "bounded") as read:
                self.assertEqual(self.run_collect()["status"], expected)
                read.assert_not_called()
            self.record[flag] = False
    def test_timeout_is_unavailable_and_old_date_survives(self):
        with patch.object(refresh, "bounded", side_effect=TimeoutError("单条超时")):
            row = self.run_collect()
        self.assertEqual((row["status"], row["new_value"], row["page_date"]), ("unavailable", None, "2026-09-28"))
        with patch.object(refresh, "bounded") as read:
            self.assertIn("总重取时限", self.run_collect(total_seconds=0)["reason"])
            read.assert_not_called()
    def test_file_count_line_count_and_scalar_json(self):
        (self.root / "tools").mkdir()
        (self.root / "tools/a.py").write_text("一行\n\n二行", encoding="utf-8")
        method = {"kind": "line_count", "path": ".", "include": ["tools/**/*.py"], "nonempty": True}
        self.assertEqual(refresh.retrieve(method, self.root), 2)
        (self.root / "tools/a.py").write_text("一行\n\n二行", encoding="utf-16")
        self.assertEqual(refresh.retrieve(dict(method, newline_only=True, nonempty=False), self.root), 2)
        method.update(kind="file_count")
        self.assertEqual(refresh.retrieve(method, self.root), 1)
        (self.root / "count.json").write_text('{"count": 25}', encoding="utf-8")
        self.assertEqual(refresh.retrieve(self.record["retrieve"], self.root), 25)

    @unittest.skipUnless(refresh.os.name == "nt", "Windows 子进程清理")
    def test_failed_tree_stop_is_bounded_and_not_reported_as_verified(self):
        process = Mock(); process.poll.return_value = None
        process.communicate.side_effect = subprocess.TimeoutExpired("read", 1)
        with patch.object(refresh.subprocess, "Popen", return_value=process), patch.object(
                refresh.subprocess, "run", side_effect=subprocess.CalledProcessError(1, "taskkill")):
            with self.assertRaisesRegex(TimeoutError, "清理未核实"):
                refresh.bounded(["read"], 1)
        process.kill.assert_called_once()
        process.wait.assert_called_once_with(timeout=5)

if __name__ == "__main__":
    unittest.main()

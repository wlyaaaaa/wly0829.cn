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
            "as_of": "2026-09-28", "current_value": 99, "category": "人工", "source_location": "只读来源", "scope_status": "verified",
            "page_pattern": r"([\d,]+) 次", "automatic": True, "private": False, "observation_basis": "live_read",
            "retrieve": {"kind": "json", "path": "count.json", "pointer": ["count"]}}

    def run_collect(self, **kwargs):
        return refresh.collect(self.root, {"records": [self.record]}, today=date(2026, 10, 10), **kwargs)["rows"][0]
    def test_baseline_uses_successful_source_commit_and_never_site_dist_or_unknown(self):
        path = self.root / "wly-oss/published.json"; path.parent.mkdir()
        source, site_dist = "a" * 40, "b" * 40
        accepted = {"schema": "wly.site-publication.v1", "commit": site_dist, "source_commit": source,
            "deployment": 123, "verified_at_beijing": "2026-10-11T16:03:00+08:00", "readback": {"index.html": {"status": "pass"}}}
        with patch.object(refresh, "bounded", return_value=str(self.root)):
            for value in (accepted, {**accepted, "source_commit": None, "manifest": {"source_commit": source}}):
                path.write_text(json.dumps(value), encoding="utf-8")
                self.assertEqual(refresh.publication_baseline(self.root, "old")["baseline"], source)
            for value in ({**accepted, "status": "failed"}, {**accepted, "source_commit": "Unknown"},
                    {**accepted, "source_commit": None}, {**accepted, "readback": {"index.html": {"status": "failed"}}}, None, "bad-json"):
                if value is None: path.unlink()
                else: path.write_text(value if isinstance(value, str) else json.dumps(value), encoding="utf-8")
                result = refresh.publication_baseline(self.root, "old")
                self.assertEqual(result["baseline"], "old"); self.assertIn("Unknown", result["baseline_evidence"])
    def test_actual_page_number_and_overdue_not_registration_fallback(self):
        with patch.object(refresh, "bounded", return_value="[2021]"):
            row = self.run_collect()
            self.record["scope_status"] = "pending"
            self.assertEqual(self.run_collect()["status"], "scope_pending")
        self.assertEqual((row["old_value"], row["new_value"], row["status"], row["overdue"]),
                         ("2,020", 2021, "changed", True))
        self.record.update(scope_status="verified", page_pattern="不会匹配(1)")
        with patch.object(refresh, "bounded") as read:
            self.assertEqual(self.run_collect()["status"], "unavailable")
            read.assert_not_called()
    def test_private_and_historical_never_read_sources(self):
        self.record["scope_status"] = "pending"
        for flag, expected in (("private", "domain_fact_task"), ("historical", "historical"), ("frozen", "historical")):
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
        (self.root / "tools/a.py").write_text("一行\n  \n二行", encoding="utf-8")
        method = {"kind": "line_count", "path": ".", "include": ["tools/**/*.py"], "nonempty": True}
        self.assertEqual((refresh.retrieve(method, self.root), refresh.retrieve(dict(method, empty_only=True), self.root)), (2, 3))
        (self.root / "tools/a.py").write_text("一行\n\n二行", encoding="utf-16")
        self.assertEqual(refresh.retrieve(dict(method, newline_only=True, nonempty=False), self.root), 2)
        method.update(kind="file_count")
        self.assertEqual(refresh.retrieve(method, self.root), 1)
        (self.root / "count.json").write_text('{"count": 25}', encoding="utf-8")
        self.assertEqual(refresh.retrieve(self.record["retrieve"], self.root), 25)
    def test_report_large_utf8_details_use_complete_task_file_and_keep_failures(self):
        registry = self.root / "sources/refresh/registry.json"
        registry.parent.mkdir(parents=True)
        registry.write_text(json.dumps({"schema": "content-refresh.sources.v1", "records": []}), encoding="utf-8")
        result = {"rows": [], "findings": [], "baseline": "test", "observed_at": "2026-10-12T06:00:00+08:00",
                  "pages_checked": 1, "numbers_checked": 0, "retrieval_seconds": 0, "automatic_success_ratio": None}
        for task in ("证" * (256 * 1024 // 3), "证" * (256 * 1024 // 3 + 1)):
            for passed in (True, False):
                with self.subTest(bytes=len(task.encode("utf-8")), passed=passed):
                    output = self.root / "output"
                    def render(argv, seconds):
                        self.assertIn("-NoOpen", argv)
                        content = json.loads((output / "report-content.json").read_text(encoding="utf-8"))
                        self.assertEqual(len(content["blocks"]) == 2, len(task.encode("utf-8")) > 256 * 1024)
                        detail = content["blocks"][-1]["blocks"][0]
                        self.assertEqual((output / "opus-task.md").read_text(encoding="utf-8"), task)
                        if len(task.encode("utf-8")) > 256 * 1024:
                            self.assertEqual(detail["type"], "file")
                            self.assertEqual(Path(detail["src"]), (output / "opus-task.md").resolve())
                        else:
                            self.assertEqual(detail, {"type": "markdown", "text": task})
                        html = output / "result.html"
                        html.write_text("verified fixture", encoding="utf-8")
                        return json.dumps({"status": "created", "path": str(html), "opened": False, "checks": {"passed": passed}})
                    with patch.object(sys, "argv", ["refresh", "--root", str(self.root), "--output", str(output)]), \
                            patch.object(refresh, "collect", return_value=result), \
                            patch.object(refresh, "publication_baseline", return_value={"baseline": "test"}), \
                            patch.object(refresh, "task_text", return_value=task), patch.object(refresh, "bounded", side_effect=render), \
                            patch.dict(refresh.os.environ), patch("builtins.print"):
                        self.assertEqual(refresh.main(), 0 if passed else 1)
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

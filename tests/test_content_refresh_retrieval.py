"""白名单、只读 SQL、时间窗和并发共用的实质边界。"""
from datetime import datetime, timedelta
import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
import refresh
from validation import validate_entries, validate_method, record_errors, LEDGER


class RetrievalTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.entry = {"argv": [sys.executable, "status.py"], "cwd": ".", "read_only": True,
                      "owner_project": "demo", "output": "json"}

    def test_entry_whitelist_and_once_for_two_pointers(self):
        methods = [{"kind": "entry", "entry": "counts", "pointer": [key]} for key in ("a", "b")]
        with patch.object(refresh, "bounded", return_value='{"a":165,"b":58}') as run:
            self.assertEqual(refresh.retrieve_batch(methods, self.root, {"counts": self.entry}, 10), [165, 58])
            self.assertEqual(run.call_count, 1)
            self.assertEqual(run.call_args.kwargs["cwd"], str(self.root))
        for method in (dict(methods[0], entry="unknown"), dict(methods[0], argv=["delete"])):
            with self.assertRaises(ValueError):
                refresh.retrieve(method, self.root, {"counts": self.entry})
        with self.assertRaises(ValueError):
            validate_entries({"counts": dict(self.entry, read_only=False)})
        with patch.object(refresh, "bounded", return_value='{"a":165}') as run:
            self.assertEqual(refresh.retrieve_batch([dict(methods[0], entry="deadline")], self.root, {"deadline": self.entry}, 10), [165])
            run.assert_called_once()
        with patch.object(refresh, "bounded", side_effect=TimeoutError("失败")) as run:
            replies = refresh.retrieve_batch(methods, self.root, {"counts": self.entry}, 10)
            self.assertTrue(all("error" in value for value in replies))
            run.assert_called_once()

    def test_sql_single_select_read_only_and_scalar(self):
        path = self.root / "库.sqlite3"
        with sqlite3.connect(path) as connection:
            connection.execute("create table samples (n integer)")
            connection.executemany("insert into samples values (?)", [(1,), (2,)])
        connection.close()
        before = path.read_bytes()
        method = {"kind": "sqlite_ro", "path": str(path), "sql": "select count(*) from samples;"}
        self.assertEqual(refresh.retrieve(method, self.root, {}), 2)
        self.assertEqual(refresh.retrieve(dict(method, sql="select ';'"), self.root, {}), ";")
        for sql in ("delete from samples", "select 1; select 2", "pragma user_version", "select n from samples"):
            with self.subTest(sql=sql), self.assertRaises(ValueError):
                refresh.retrieve(dict(method, sql=sql), self.root, {})
        with self.assertRaises(sqlite3.DatabaseError):
            refresh.retrieve(dict(method, sql="select load_extension('missing')"), self.root, {})
        self.assertEqual(path.read_bytes(), before)
        with self.assertRaises(sqlite3.OperationalError):
            refresh.retrieve(dict(method, path=str(self.root / "absent.db")), self.root, {})
        self.assertFalse((self.root / "absent.db").exists())

    def test_log_window_uses_line_time_and_counts_lines(self):
        now = datetime.now(refresh.BEIJING)
        logs = self.root / "logs"
        logs.mkdir()
        old, recent = now - timedelta(days=8), now - timedelta(hours=2)
        (logs / "x.log").write_text(f"{old.isoformat()} complete\n{recent.isoformat()} complete complete\n", encoding="utf-8")
        method = {"kind": "log_window", "path": str(logs), "include": ["*.log"], "pattern": "complete", "days": None}
        self.assertEqual(refresh.retrieve(method, self.root, {}), 2)
        self.assertEqual(refresh.retrieve(dict(method, days=7), self.root, {}), 1)
        self.assertEqual(refresh.retrieve(dict(method, operation="last_time"), self.root, {}), recent.isoformat(timespec="seconds"))
        (logs / "x.log").write_text("complete\n", encoding="utf-8")
        with self.assertRaises(ValueError):
            refresh.retrieve(dict(method, days=7), self.root, {})

    def test_ledger_streams_once_filters_kind_and_preserves_last_time(self):
        now = datetime.now(refresh.BEIJING)
        events = [{"name": "materials", "kind": k, "ts": t.isoformat()} for k, t in (
            ("skill", now - timedelta(days=8)), ("skill", now - timedelta(hours=2)),
            ("tool", now - timedelta(hours=1)), ("skill", now + timedelta(days=1)))]
        path = self.root / "events.jsonl"
        path.write_text("\n".join(json.dumps(e) for e in events), encoding="utf-8")
        entry = {"path": str(path), "format": "jsonl", "key_field": "name", "time_field": "ts",
                 "filter": {"kind": "skill"}, "read_only": True, "owner_project": "agents"}
        methods = [{"kind": "usage_ledger", "key": "materials", "operation": op} for op in ("count_7d", "last_time")]
        with patch.object(Path, "open", autospec=True, side_effect=Path.open) as read:
            self.assertEqual(refresh.retrieve_batch(methods, self.root, {LEDGER: entry}, 10),
                             [1, (now - timedelta(hours=2)).isoformat(timespec="seconds")])
            self.assertEqual(read.call_count, 1)

    def test_parallel_sources_and_qualifies_unknown_preserves_date(self):
        page_path = self.root / "sources/pages/demo/page.json"
        page_path.parent.mkdir(parents=True)
        page_path.write_text(json.dumps({"page": "demo", "screens": [{"id": "demo-01", "text": "3 件；截至 2026-10-01"}]}), encoding="utf-8")
        base = {"page": "demo", "screen": "demo-01", "label": "计数", "automatic": True,
                "scope_status": "verified", "as_of": "2026-10-01", "source_location": "合成测试", "page_pattern": r"(3) 件"}
        records = [dict(base, id=str(i), retrieve={"kind": "json", "path": str(i)}) for i in range(8)]
        date = dict(base, id="date", field="screens[0].text", page_pattern=r"截至 (2026-10-01)", qualifies=["0", "1"])
        lock, active, peak = threading.Lock(), 0, 0
        barrier = threading.Barrier(8)
        def read(argv, seconds):
            nonlocal active, peak
            with lock:
                active += 1
                peak = max(peak, active)
            barrier.wait(timeout=10)
            with lock:
                active -= 1
            return "[3]"
        with patch.object(refresh, "bounded", side_effect=read):
            result = refresh.collect(self.root, {"records": records + [date]}, workers=1)
        self.assertEqual(peak, 8)
        self.assertEqual(result["automatic_success_ratio"], 1)
        self.assertEqual(result["rows"][-1]["new_value"], datetime.now(refresh.BEIJING).date().isoformat())
        with patch.object(refresh, "bounded") as command:
            refresh.collect(self.root, {"records": records}, total_seconds=.2)
            command.assert_not_called()  # 不能先耗尽总预算，再另加进程终止时间。
        private = dict(records[0], private=True)
        with patch.object(refresh, "bounded", return_value="[3]"):
            self.assertEqual(refresh.collect(self.root, {"records": [private]})["rows"][0]["new_value"], 3)
        with patch.object(refresh, "bounded", side_effect=TimeoutError("Unknown")):
            result = refresh.collect(self.root, {"records": records + [date]})
        self.assertIsNone(result["rows"][-1]["new_value"])
        self.assertEqual(result["rows"][-1]["page_date"], "2026-10-01")


if __name__ == "__main__":
    unittest.main()

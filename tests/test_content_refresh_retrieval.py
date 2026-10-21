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
        now = datetime(2026, 10, 22, 6, tzinfo=refresh.BEIJING)
        end = now.replace(hour=0)
        events = [{"name": "materials", "kind": k, "ts": t.isoformat()} for k, t in (
            ("skill", end - timedelta(days=7)), ("skill", end - timedelta(seconds=1)),
            ("skill", end - timedelta(days=7, seconds=1)), ("skill", end),
            ("tool", now - timedelta(hours=1)), ("skill", now + timedelta(days=1)))]
        path = self.root / "events.jsonl"
        path.write_text("\n".join(json.dumps(e) for e in events), encoding="utf-8")
        for ai in ("codex", "claude"):
            path.with_name(f"state-{ai}.json").write_text(json.dumps({"bootstrap_complete": True,
                "last_completed": end.isoformat()}), encoding="utf-8")
        entry = {"path": str(path), "format": "jsonl", "key_field": "name", "time_field": "ts",
                 "filter": {"kind": "skill"}, "read_only": True, "owner_project": "agents"}
        methods = [{"kind": "usage_ledger", "key": "materials", "operation": op} for op in ("count_7d", "last_time")]
        with patch.object(refresh, "datetime") as clock, patch.object(Path, "open", autospec=True, side_effect=Path.open) as read:
            clock.now.return_value = now
            clock.fromisoformat.side_effect = datetime.fromisoformat
            self.assertEqual(refresh.retrieve_batch(methods, self.root, {LEDGER: entry}, 10),
                             [2, (end - timedelta(seconds=1)).isoformat(timespec="seconds")])
            self.assertEqual(read.call_count, 3)  # 两路水位各一次，账本仍只扫描一次。
            values = refresh.retrieve_batch(methods, self.root, {LEDGER: entry}, 10, include_metadata=True)
            self.assertEqual(values[0], {"value": 2, "source_coverage_end": "2026-10-21"})

    def test_incomplete_ledger_cannot_refresh_numbers_dates_or_display_entry(self):
        now = datetime.now(refresh.BEIJING)
        path = self.root / "events.jsonl"
        path.write_text(json.dumps({"name": "demo", "ts": now.isoformat()}), encoding="utf-8")
        method = {"kind": "usage_ledger", "key": "demo", "operation": "count_7d"}
        entries = {LEDGER: {"path": str(path), "read_only": True, "owner_project": "demo"},
                   "display": dict(self.entry, requires_usage_ledger=True)}
        page = self.root / "sources/pages/demo/page.json"
        page.parent.mkdir(parents=True)
        page.write_text(json.dumps({"page": "demo", "screens": [{"id": "top",
            "text": "3 次；截至 2026-10-01"}]}), encoding="utf-8")
        number = dict(id="n", page="demo", screen="top", label="用量", automatic=True,
                      scope_status="verified", as_of="2026-10-01", source_location="合成账本",
                      page_pattern=r"(3) 次", retrieve=method)
        cutoff = dict(number, id="d", page_pattern=r"截至 (2026-10-01)", qualifies=["n"])
        for bad in (None, {"bootstrap_complete": False, "last_completed": now.isoformat()},
                    {"bootstrap_complete": True, "last_completed": "bad"},
                    {"bootstrap_complete": True, "last_completed": now.replace(tzinfo=None).isoformat()}):
            for ai in ("codex", "claude"):
                state = bad if ai == "claude" else {"bootstrap_complete": True,
                    "last_completed": (now + timedelta(minutes=1)).isoformat()}
                state_path = path.with_name(f"state-{ai}.json")
                if state is None:
                    state_path.unlink(missing_ok=True)
                else:
                    state_path.write_text(json.dumps(state), encoding="utf-8")
            values = refresh.retrieve_batch([method], self.root, entries, 10)
            self.assertIn("Unknown", values[0]["error"])
            with patch.object(refresh, "bounded", return_value=json.dumps(values)):
                result = refresh.collect(self.root, {"records": [number, cutoff]}, entries=entries)
            self.assertTrue(all(r["status"] == "unavailable" and r["new_value"] is None for r in result["rows"]))
            from apply_edits import build_number_edits
            self.assertEqual(build_number_edits(self.root, result)["edits"], [])
            self.assertEqual(result["rows"][1]["old_value"], "2026-10-01")
            with patch.object(refresh, "bounded") as command:
                display = refresh.retrieve_batch([{"kind": "entry", "entry": "display"}], self.root, entries, 10)
            command.assert_not_called()
            self.assertIn("Unknown", display[0]["error"])
        for ai in ("codex", "claude"):
            path.with_name(f"state-{ai}.json").write_text(json.dumps({"bootstrap_complete": True,
                "last_completed": now.isoformat()}), encoding="utf-8")
        self.assertEqual(refresh.require_ledger_coverage(entries[LEDGER], self.root, now),
                         now.replace(hour=0, minute=0, second=0, microsecond=0))
        payload = [{"value": 4, "source_coverage_end": "2026-10-18"}]
        with patch.object(refresh, "bounded", return_value=json.dumps(payload)):
            result = refresh.collect(self.root, {"records": [number, cutoff]}, entries=entries)
        self.assertEqual(result["rows"][1]["new_value"], "2026-10-18")

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

    def test_qualified_event_date_marks_manual_number_edit_instead_of_today(self):
        path = self.root / "sources/pages/demo/page.json"
        path.parent.mkdir(parents=True)
        path.write_text(json.dumps({"page": "demo", "screens": [{"id": "demo-01", "text": "3 件；截至 2026-10-01（库最近一次写入）"}]}), encoding="utf-8")
        number = {"id": "count", "page": "demo", "screen": "demo-01", "label": "计数", "automatic": True,
                  "scope_status": "verified", "as_of": "2026-10-01", "source_location": "合成测试",
                  "page_pattern": r"(3) 件", "retrieve": {"kind": "json", "path": "count.json"}}
        date = dict(number, id="date", field="screens[0].text", page_pattern=r"截至 (2026-10-01)", qualifies=["count"])
        with patch.object(refresh, "bounded", return_value="[4]"):
            result = refresh.collect(self.root, {"records": [number, date]})
        self.assertEqual(result["rows"][1]["status"], "manual_review")
        self.assertIsNone(result["rows"][1]["new_value"])
        from apply_edits import build_number_edits
        edits = build_number_edits(self.root, result)
        self.assertEqual(len(edits["manual_reviews"]), 1)
        self.assertEqual(edits["manual_reviews"][0]["old_value"], "2026-10-01")
        self.assertEqual(edits["edits"], [])
        with patch.object(refresh, "bounded", return_value="[4]"):
            result = refresh.collect(self.root, {"records": [number, dict(date, field=None)]})
            self.assertEqual(result["rows"][1]["status"], "manual_review")
            invalid = dict(date, start=path.read_text("utf-8").find("2026-10-01"), end=999)
            result = refresh.collect(self.root, {"records": [number, invalid]})
            self.assertIsNone(result["rows"][1]["new_value"])
            self.assertEqual(result["rows"][0]["new_value"], 4)

    def test_coverage_end_uses_source_day_and_unknown_preserves_old_day(self):
        path = self.root / "sources/pages/demo/page.json"
        path.parent.mkdir(parents=True)
        path.write_text(json.dumps({"page": "demo", "screens": [{"id": "demo-01",
            "text": "24 天；截至 2026-10-01（记录覆盖到此日）"}]}), encoding="utf-8")
        number = {"id": "count", "page": "demo", "screen": "demo-01", "label": "日检天数",
                  "automatic": True, "scope_status": "verified", "source_location": "合成日检日志",
                  "page_pattern": r"(24) 天", "retrieve": {"kind": "entry", "entry": "daily", "pointer": ["days"]}}
        cutoff = dict(number, id="date", field="screens[0].text", page_pattern=r"截至 (2026-10-01)",
                      qualifies=["count"], date_semantics="coverage_end",
                      retrieve={"kind": "entry", "entry": "daily", "pointer": ["last_day"]})
        with patch.object(refresh, "bounded", return_value='[24,"2026-10-08"]') as run:
            result = refresh.collect(self.root, {"records": [number, cutoff]}, entries={"daily": self.entry})
        run.assert_called_once()
        self.assertEqual(result["rows"][1]["new_value"], "2026-10-08")
        from apply_edits import apply_edits, build_number_edits
        edits = build_number_edits(self.root, result)
        self.assertEqual(edits["manual_reviews"], [])
        self.assertEqual(edits["edits"][0]["new_value"], "2026-10-08")
        self.assertEqual(len(edits["edits"]), 1)
        self.assertFalse(apply_edits(self.root, edits)["skipped"])
        self.assertIn("24 天；截至 2026-10-08", path.read_text("utf-8"))
        path.write_text(path.read_text("utf-8").replace("2026-10-08", "2026-10-01"), encoding="utf-8")
        result["rows"][0]["new_value"] = 25
        self.assertEqual(build_number_edits(self.root, result)["edits"], [])
        for values in ('[24,{"error":"日志无覆盖"}]', '[{"error":"Unknown"},"2026-10-08"]', '[24,"bad-date"]'):
            with patch.object(refresh, "bounded", return_value=values):
                unavailable = refresh.collect(self.root, {"records": [number, cutoff]}, entries={"daily": self.entry})
                row = unavailable["rows"][1]
            self.assertEqual(build_number_edits(self.root, unavailable)["edits"], [])
            self.assertIsNone(row["new_value"])
            self.assertEqual(row["status"], "unavailable")
            self.assertEqual(row["old_value"], "2026-10-01")


if __name__ == "__main__":
    unittest.main()

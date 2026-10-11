"""固定五项材料库计数；所有应用测试都在独立临时页面进行。"""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
from apply_edits import apply_edits, build_number_edits


class NumberEditsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.path = self.root / "sources/pages/personal-materials/page.json"
        self.path.parent.mkdir(parents=True)
        # dated-refresh.md 的 165 / 58 / 15105 / 4 / 44 固定样本。
        self.values = [165, 58, 15105, 4, 44]
        self.labels = ["165 份", "58 个来源", "15,105 条文件名", "4 条关系", "44 份可搜文字"]
        self.page = {"page": "personal-materials", "screens": [{"id": "top", "text":
            "\n".join(self.labels) + "\n截至 10 月 9 日"}], "registry": {"numbers": [
                {"id": f"n-{i}", "text": text, "as_of": "2026-10-09", "screens": ["top"]}
                for i, text in enumerate(self.labels)]}}
        self.save()
        self.rows = [dict(id=f"r-{i}", page="personal-materials", screen="top", page_number=f"n-{i}",
            old_value=value, new_value=value, status="unchanged", scope_status="verified",
            source_observed_at="2026-10-11T16:03:00+08:00") for i, value in enumerate(self.values)]
        self.rows.append(dict(id="date", page="personal-materials", screen="top", field="screens[0].text",
            page_pattern=r"截至 (\d+ 月 \d+ 日)", old_value="2026-10-09", new_value="2026-10-11",
            qualifies=[r["id"] for r in self.rows], status="changed", scope_status="verified",
            source_observed_at="2026-10-11T16:03:00+08:00"))

    def save(self):
        self.path.write_text(json.dumps(self.page, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def build(self):
        return build_number_edits(self.root, {"rows": self.rows})

    def test_unchanged_five_counts_still_refresh_dates_and_second_run_is_identical(self):
        payload = self.build()
        self.assertEqual(payload["schema"], "content-refresh.number-edits.v1")
        self.assertEqual(len(payload["edits"]), 6)
        self.assertFalse(payload["skipped"])
        self.assertEqual(apply_edits(self.root, payload)["applied"], 6)
        first = self.path.read_bytes()
        page = json.loads(first)
        self.assertTrue(all(n["as_of"] == "2026-10-11" for n in page["registry"]["numbers"]))
        self.assertTrue(page["screens"][0]["text"].endswith("截至 10 月 11 日"))
        self.assertEqual(apply_edits(self.root, payload)["already_applied"], 6)
        self.assertEqual(self.path.read_bytes(), first)

    def test_changed_counts_keep_commas_sync_registry_and_handle_length_changes(self):
        for row, value in zip(self.rows, [166, 59, 15106, 104, 4]):
            row.update(new_value=value, status="changed")
        payload = self.build()
        self.assertEqual(apply_edits(self.root, payload)["applied"], 16)
        page = json.loads(self.path.read_text(encoding="utf-8"))
        self.assertEqual([n["text"] for n in page["registry"]["numbers"]],
                         ["166 份", "59 个来源", "15,106 条文件名", "104 条关系", "4 份可搜文字"])
        self.assertIn("15,106 条文件名", page["screens"][0]["text"])
        first = self.path.read_bytes()
        self.assertEqual(apply_edits(self.root, payload)["applied"], 0)
        self.assertEqual(self.path.read_bytes(), first)

    def test_unavailable_pending_and_ambiguous_locations_never_generate_guessed_edits(self):
        dynamic = build_number_edits(self.root, {"rows": [dict(self.rows[0], dynamic=True)]})
        self.assertEqual((dynamic["edits"], dynamic["skipped"]), ([], []))
        self.rows = self.rows[:3]
        self.rows[0]["status"] = "unavailable"
        self.rows[1]["scope_status"] = "pending"
        self.rows[2].update(field="screens[0].text", page_pattern=r"(\d+)")
        payload = self.build()
        self.assertEqual(payload["edits"], [])
        self.assertIn("唯一", payload["skipped"][0]["reason"])

    def test_event_cutoffs_require_manual_review_but_numbers_still_update(self):
        for meaning in ("库最近一次写入", "上次使用", "最后一次运行", "账本覆盖到此日"):
            self.page["screens"][0]["text"] = "\n".join(self.labels) + f"\n截至 10 月 9 日（{meaning}）"
            self.save()
            payload = self.build()
            self.assertEqual(len(payload["manual_reviews"]), 1)
            self.assertEqual(payload["manual_reviews"][0]["status"], "需人工核对")
            self.assertFalse(any(e["field"] == "screens[0].text" for e in payload["edits"]))
            apply_edits(self.root, payload)
            self.assertIn("截至 10 月 9 日", json.loads(self.path.read_text("utf-8"))["screens"][0]["text"])
        self.page["screens"][0]["text"] = "\n".join(self.labels) + "\n本轮观察截至 10 月 9 日；上次使用 10 月 7 日"
        self.save()
        self.assertFalse(self.build()["manual_reviews"])

    def test_changed_field_is_reported_and_exact_ranges_do_not_search_another_number(self):
        payload = self.build()
        self.page["screens"][0]["text"] = self.page["screens"][0]["text"].replace("10 月 9", "10 月 8")
        self.save()
        report = apply_edits(self.root, payload)
        self.assertEqual(len(report["skipped"]), 1)
        row = dict(self.rows[0], field="screens[0].text", start=0, end=3, old_value=165, new_value=166)
        row.pop("page_number")
        payload = build_number_edits(self.root, {"rows": [row]})
        self.page["screens"][0]["text"] = "999 份\n165 份"
        self.save()
        before = self.path.read_bytes()
        self.assertEqual(len(apply_edits(self.root, payload)["skipped"]), 1)
        self.assertEqual(self.path.read_bytes(), before)

    def test_cli_only_filter_and_repeated_execution(self):
        payload = self.root / "number-edits.json"
        payload.write_text(json.dumps(self.build(), ensure_ascii=False), encoding="utf-8")
        script = Path(__file__).resolve().parents[1] / "scripts/content-refresh/apply_edits.py"
        argv = [sys.executable, "-B", "-X", "utf8", str(script), str(payload), "--root", str(self.root), "--only"]
        before = self.path.read_bytes()
        subprocess.run(argv + ["other"], check=True, capture_output=True)
        self.assertEqual(self.path.read_bytes(), before)
        subprocess.run(argv + ["personal-materials"], check=True, capture_output=True)
        reply = subprocess.run(argv + ["personal-materials"], check=True, capture_output=True, encoding="utf-8")
        self.assertEqual(json.loads(reply.stdout)["already_applied"], 6)

    def test_datetime_keeps_minutes_seconds_separator_and_timezone_style(self):
        for old, expected in [("2026-10-09 10:00", "2026-10-11 10:34"),
                ("2026-10-09 10:00:01", "2026-10-11 10:34:56"),
                ("2026-10-09T10:00:01Z", "2026-10-11T02:34:56Z")]:
            self.page["status_line"] = {"last": {"at": old}}
            self.save()
            self.rows = [dict(self.rows[0], field="status_line.last.at", page_number=None,
                old_value=old, new_value="2026-10-11T02:34:56+00:00", status="changed")]
            payload = self.build()
            self.assertEqual(payload["edits"][0]["new_value"], expected)
            self.assertEqual(apply_edits(self.root, payload)["applied"], 1)
            self.assertEqual(apply_edits(self.root, payload)["already_applied"], 1)

    def test_manual_narrative_payload_and_conflicting_field_hashes_are_rejected(self):
        forged = {"schema": "content-refresh.number-edits.v1", "edits": [dict(page="personal-materials",
            file="sources/pages/personal-materials/page.json", field="screens[0].text", start=0, end=3,
            old_value="165", new_value="任意叙述")]}
        self.assertEqual(len(apply_edits(self.root, forged)["skipped"]), 1)
        for row in self.rows[:5]:
            row.update(new_value=row["old_value"] + 1, status="changed")
        for mode in ("hash", "overlap"):
            self.save()
            payload = self.build()
            body = [e for e in payload["edits"] if e["field"] == "screens[0].text"]
            if mode == "hash":
                body[0]["field_after_sha256"] = "0" * 64
            else:
                payload["edits"].append(dict(body[0], new_value="999"))
            self.assertTrue(apply_edits(self.root, payload)["skipped"])
            self.assertEqual(json.loads(self.path.read_text(encoding="utf-8"))["screens"], self.page["screens"])


if __name__ == "__main__":
    unittest.main()

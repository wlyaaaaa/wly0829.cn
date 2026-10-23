"""固定五项材料库计数；所有应用测试都在独立临时页面进行。"""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
from apply_edits import apply_edits as _apply_edits, build_number_edits, display_fragment
from authors import affected_pages, resolve_author

FAKE_CONVERTER = '''import json, os, re, sys
from pathlib import Path
def render(root, pages, output_dir=None):
    root = Path(root)
    output = Path(output_dir) if output_dir else root / "site-astro/src/content/pages"
    output.mkdir(parents=True, exist_ok=True)
    def expand(value):
        if isinstance(value, dict): return {k: expand(v) for k, v in value.items()}
        if isinstance(value, list): return [expand(v) for v in value]
        if isinstance(value, str) and re.fullmatch(r"\\{\\{[^{}]+\\}\\}", value):
            ref, *parts = value[2:-2].split(".")
            path = "scripts/how-demo-data.json" if ref == "stories" else f"sources/pages/{ref}/page.json"
            value = json.loads((root / path).read_text("utf-8-sig"))
            for part in parts:
                value = value[int(part)] if isinstance(value, list) else value[part]
        return value
    for name in pages:
        data = json.loads((root / f"sources/pages/{name}/page.json").read_text("utf-8-sig"))
        head = json.dumps({"url": data.get("url", f"/{name}/"), "source": {"converted_at_beijing": "fixture"}})
        (output / (name + ".md")).write_text("---\\n" + head + "\\n---\\n" + json.dumps(expand(data), ensure_ascii=False), encoding="utf-8")
'''
exec(FAKE_CONVERTER, _fake := {})
fake_converter = _fake["render"]


def install_fake_converter(root):
    script = Path(root) / "site-astro/tools/convert_page.py"
    script.parent.mkdir(parents=True, exist_ok=True)
    script.write_text(FAKE_CONVERTER + '\nrender(Path(__file__).resolve().parents[2], sys.argv[1:], os.environ.get("CONVERT_OUT_MD"))\n', encoding="utf-8")


def apply_edits(root, payload, only=None, **kwargs):
    return _apply_edits(root, payload, only, converter=kwargs.get("converter", fake_converter))


class NumberEditsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        install_fake_converter(self.root)
        self.path = self.root / "sources/pages/personal-materials/page.json"
        self.path.parent.mkdir(parents=True)
        # dated-refresh.md 的 165 / 58 / 15105 / 4 / 44 固定样本。
        self.values = [165, 58, 15105, 4, 44]
        self.labels = ["165 份材料", "58 个来源", "15,105 条文件名", "4 条关系", "44 份可搜文字"]
        self.page = {"page": "personal-materials", "screens": [{"id": "top", "text":
            "，".join(self.labels) + "，截至 10 月 9 日"}], "registry": {"numbers": [
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
        fake_converter(self.root, {"personal-materials"})

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
                         ["166 份材料", "59 个来源", "15,106 条文件名", "104 条关系", "4 份可搜文字"])
        self.assertIn("15,106 条文件名", page["screens"][0]["text"])
        first = self.path.read_bytes()
        self.assertEqual(apply_edits(self.root, payload)["applied"], 0)
        self.assertEqual(self.path.read_bytes(), first)

    def test_successful_number_updates_source_and_skipped_number_does_not(self):
        self.rows = [dict(self.rows[0], new_value=166, status="changed")]
        self.page["registry"]["numbers"][0]["source"] = "旧测量：10 月 9 日 165 份"
        self.save(); payload = self.build()
        apply_edits(self.root, payload)
        number = json.loads(self.path.read_text("utf-8"))["registry"]["numbers"][0]
        self.assertEqual((number["text"], number["source"]), ("166 份材料", "见来源记录 r-0，观察于 2026-10-11T16:03:00+08:00"))
        first = self.path.read_bytes(); apply_edits(self.root, payload)
        self.assertEqual(self.path.read_bytes(), first)
        self.page["registry"]["numbers"][0]["text"] = "999 份"; self.save()
        self.assertTrue(apply_edits(self.root, payload)["skipped"])
        self.assertEqual(json.loads(self.path.read_text("utf-8"))["registry"]["numbers"][0]["source"], "旧测量：10 月 9 日 165 份")

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

    def test_event_cutoffs_require_manual_review_and_numbers_keep_their_date(self):
        for meaning in ("库最近一次写入", "上次使用", "最后一次运行", "账本覆盖到此日"):
            self.page["screens"][0]["text"] = "，".join(self.labels) + f"，截至 10 月 9 日（{meaning}）"
            self.save()
            payload = self.build()
            self.assertEqual(len(payload["manual_reviews"]), 1)
            self.assertEqual(payload["manual_reviews"][0]["status"], "需人工核对")
            self.assertFalse(payload["edits"])
            apply_edits(self.root, payload)
            self.assertIn("截至 10 月 9 日", json.loads(self.path.read_text("utf-8"))["screens"][0]["text"])
        for text in ("本轮观察截至 10 月 9 日；上次使用 10 月 7 日",
                     "上次使用 10 月 7 日！本轮观察截至 10 月 9 日。",
                     "- 上次使用 10 月 7 日\n- 本轮观察截至 10 月 9 日"):
            self.page["screens"][0]["text"] = "，".join(self.labels) + "\n" + text
            self.save()
            self.assertFalse(self.build()["manual_reviews"])

    def test_changed_field_is_reported_and_exact_ranges_do_not_search_another_number(self):
        payload = self.build()
        self.page["screens"][0]["text"] = self.page["screens"][0]["text"].replace("10 月 9", "10 月 8")
        self.save()
        report = apply_edits(self.root, payload)
        self.assertEqual(len(report["skipped"]), len(payload["edits"]))
        row = dict(self.rows[0], field="screens[0].text", start=0, end=3, current_value=165, old_value=165, new_value=166)
        row.pop("page_number")
        row["text"] = "165 份材料"
        payload = build_number_edits(self.root, {"rows": [row]})
        self.page["screens"][0]["text"] = "999 份\n165 份"
        self.save()
        before = self.path.read_bytes()
        self.assertEqual(len(apply_edits(self.root, payload)["skipped"]), len(payload["edits"]))
        self.assertEqual(self.path.read_bytes(), before)

    def one(self, text, anchor, old, new, **extra):
        self.page["screens"][0]["text"] = text
        self.page["registry"]["numbers"] = [dict(id="n-0", text=anchor, as_of="2026-10-09", screens=["top"])]
        self.save()
        start = text.index(str(old))
        row = dict(self.rows[0], field="screens[0].text", start=start, end=start + len(str(old)), current_value=old, old_value=old, new_value=new, status="changed")
        row.update(extra)
        return build_number_edits(self.root, {"rows": [row]})

    def test_whole_number_boundaries_reject_fragments_and_bad_grouping(self):
        for text, old in [("1040 行", "04"), ("286.0 GiB", "286"), ("6,2 条", "6,2"),
                          ("942,360,5 条", "942,360,5"), ("执 6,2 条", "执 6,2"), ("始 942,360,5 条", "始 942,360,5")]:
            with self.subTest(text=text):
                payload = self.one(text + "（10月9日）", text, old, 104)
                self.assertFalse(payload["edits"])
                self.assertEqual(payload["skipped"][0]["reason"], "old_value_not_whole_number")
        payload = self.one("文件:04 行（2026年10月9日）", "文件:04 行", "04", 5)
        self.assertFalse(payload["skipped"])
        self.assertTrue(payload["edits"])

    def test_complete_scope_anchor_is_required_even_when_numbers_equal(self):
        for text, anchor, old, new, extra in [
                ("这27个个人技能", "27 个", 27, 29, {}),
                ("35个项目", "35 个", 35, 205, {}),
                ("1.78亿条精确逐程序明细", "1.78亿条精确逐程序明细", "1.78", "1.72", {"measurement_scope": "统计估算，非精确count"}),
                ("27个个人技能", "27", 27, 27, {}),
                ("备份286 GiB", "286 GiB", 286, 287, {}),
                ("165份材料", "165份材料", 165, 166, {"requires_semantic_refresh": True})]:
            payload = self.one(text + "（10月9日）", anchor, old, new, **extra)
            self.assertFalse(payload["edits"])
            self.assertEqual(payload["skipped"][0]["reason"], "scope_mismatch_or_unverified")

    def test_observation_dates_keep_style_and_beijing_time(self):
        for stamp, expected in [("截至10月9日 14:00", "截至10月11日 16:03"),
                ("（10月9日）", "（10月11日）"), ("截至 2026-10-09", "截至 2026-10-11")]:
            payload = self.one("167 次调用，" + stamp, "167 次调用", 167, 168)
            self.assertFalse(payload["skipped"])
            self.assertFalse(apply_edits(self.root, payload)["skipped"])
            self.assertIn("168 次调用，" + expected, json.loads(self.path.read_text("utf-8"))["screens"][0]["text"])
        payload = self.one("167 次调用（10月9日）", "167 次调用", 167, 168, source_observed_at="2026-10-11T23:03:00+00:00")
        apply_edits(self.root, payload)
        self.assertIn("10月12日", json.loads(self.path.read_text("utf-8"))["screens"][0]["text"])

    def test_missing_ambiguous_and_event_dates_keep_numbers(self):
        for suffix in ("", "（10月9日）和（10月10日）", "，截至10月9日（最后一次运行）", "（成功3次），首次上线10月9日"):
            payload = self.one("167 次调用" + suffix, "167 次调用", 167, 168)
            self.assertFalse(payload["edits"])
            self.assertEqual(payload["skipped"][0]["reason"], "as_of_link_required")
        payload = self.one("167 次调用。\n截至10月9日", "167 次调用", 167, 168)
        self.assertFalse(payload["skipped"])

    def test_timed_cutoff_reads_back_the_written_time(self):
        self.page["screens"][0]["text"] = "，".join(self.labels) + "，截至 10 月 9 日 08:06"
        self.save()
        self.rows[-1].update(page_pattern=r"截至 (\d+ 月 \d+ 日 \d+:\d+)", old_value="10 月 9 日 08:06")
        result = dict(schema="content-refresh.result.v1", run_id="timed", rows=self.rows)
        report = apply_edits(self.root, build_number_edits(self.root, result))
        self.assertFalse(report["skipped"])
        self.assertIn("截至 10 月 11 日 16:03", json.loads(self.path.read_text("utf-8"))["screens"][0]["text"])
        self.assertIn("date", {r["record_id"] for r in report["record_readback"]})
        from freshness import close_run
        closure = close_run(self.root, result, report)
        self.assertEqual({r["record_id"]: r["status"] for r in closure["rows"]}["date"], "applied_readback_verified")

    def test_field_pattern_and_cross_field_qualified_coverage_date(self):
        self.page['screens'][0]['text'] = '当前材料有 165 份'
        self.page['status_line'] = {'as_of': '2026-10-09'}
        self.page['registry']['numbers'] = []
        self.save()
        number = dict(self.rows[0], page_number=None, field='screens[0].text',
                      page_pattern=r'当前材料有 (\d+) 份', old_value=165, new_value=166)
        cutoff = dict(self.rows[-1], field='status_line.as_of', page_pattern=r'(2026-10-09)',
                      qualifies=[number['id']], new_value='2026-10-10')
        payload = build_number_edits(self.root, {'rows': [number, cutoff]})
        self.assertFalse(payload['skipped'])
        self.assertEqual(len(payload['edits']), 2)
        self.assertFalse(apply_edits(self.root, payload)['skipped'])
        self.assertEqual(json.loads(self.path.read_text('utf-8'))['status_line']['as_of'], '2026-10-10')
        self.save()
        unrelated = dict(number, id='other', screen='other', field='screens[1].text', requires_semantic_refresh=True)
        payload = build_number_edits(self.root, {'rows': [number, cutoff, unrelated]})
        self.assertEqual({e['record_id'] for e in payload['edits']}, {number['id'], cutoff['id']})
        self.assertFalse(apply_edits(self.root, payload)['skipped'])
        self.save()
        cutoff['qualifies'].append(unrelated['id'])
        self.assertFalse(build_number_edits(self.root, {'rows': [number, cutoff, unrelated]})['edits'])
        cutoff['qualifies'].pop()
        self.page['status_line']['as_of'] = '10月9日 14:00'
        self.save()
        timed = dict(cutoff, page_pattern=r'(10月9日 14:00)', old_value='10月9日 14:00', date_semantics='coverage_end')
        payload = build_number_edits(self.root, {'rows': [number, timed]})
        self.assertFalse(payload['edits'])
        self.assertIn('覆盖末日不提供时分', str(payload['skipped']))
        for field in ('screens[0].text', 'status_line.as_of'):
            blocked = dict(number, field=field, source_precision='estimated', display_precision='exact')
            payload = build_number_edits(self.root, {'rows': [blocked, cutoff]})
            self.assertFalse(payload['edits'])
            self.assertEqual(payload['skipped'][0]['reason'], 'estimated_source_cannot_replace_exact')

    def test_stale_offsets_do_not_prove_a_mismatched_pattern(self):
        payload = self.one('165 份材料（10月9日）', '165 份', 165, 166,
                           page_pattern=r'别的材料(\d+)', page_number=None)
        self.assertFalse(payload['edits'])
        self.assertEqual(payload['skipped'][0]['reason'], 'scope_mismatch_or_unverified')
        payload = self.one("材料3份，仓库4份，截至10月9日", "仓库4份", 4, 5, current_value=3)
        self.assertFalse(payload["edits"])
        self.assertEqual(payload["skipped"][0]["reason"], "字符偏移已漂移或无法证明，需改用唯一上下文重绑")

    def test_number_date_batch_is_atomic_for_drift_and_illegal_payload(self):
        for mode in ("body", "registry", "illegal"):
            payload = self.one("167 次调用，截至10月9日 14:00", "167 次调用", 167, 168)
            if mode == "illegal":
                payload["edits"][-1]["new_value"] = "非法内容"
            else:
                self.page["registry"]["numbers"][0]["as_of"] = "2026-10-08" if mode == "registry" else "2026-10-09"
                if mode == "body":
                    self.page["screens"][0]["text"] += "！"
                self.save()
            before = self.path.read_bytes()
            report = apply_edits(self.root, payload)
            self.assertTrue(report["skipped"])
            self.assertEqual(report["applied"], 0)
            self.assertEqual(self.path.read_bytes(), before)

    def test_failed_number_does_not_advance_shared_cutoff_and_crlf_survives(self):
        self.rows[0]["requires_semantic_refresh"] = True
        blocked = self.build()
        self.assertFalse(blocked["edits"])
        self.assertEqual({r["record_id"] for r in blocked["skipped"]}, {r["id"] for r in self.rows})
        self.rows[0].pop("requires_semantic_refresh")
        self.path.write_bytes(self.path.read_bytes().replace(b"\n", b"\r\n"))
        payload = self.build()
        self.assertFalse(apply_edits(self.root, payload)["skipped"])
        self.assertNotIn(b"\n", self.path.read_bytes().replace(b"\r\n", b""))

    def test_unknown_registered_cutoff_cannot_be_bypassed_by_visible_date(self):
        self.rows[0].update(new_value=166, status="changed")
        self.rows[-1].update(new_value=None, status="unavailable")
        payload = self.build()
        self.assertFalse(payload["edits"])
        self.assertEqual(payload["skipped"][0]["reason"], "as_of_link_required")

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

    def test_how_author_edits_keep_five_placeholders_and_render_new_values(self):
        path = self.root / "sources/pages/how/page.json"
        path.parent.mkdir(parents=True)
        source = self.root / "scripts/how-demo-data.json"
        source.parent.mkdir(parents=True)
        source.write_text(json.dumps({"stories": [{"detail_screens": [{"text": f"材料有 {i} 份，截至10月9日"} for i in range(5)]}]}), encoding="utf-8")
        page = {"page": "how", "screens": [{"id": str(i), "text": "{{stories.stories.0.detail_screens." + str(i) + ".text}}"} for i in range(5)]}
        path.write_text(json.dumps(page), encoding="utf-8")
        rows = [dict(self.rows[0], id=f"how-{i}", page="how", screen=str(i), page_number=None,
            field=f"screens[{i}].text", page_pattern=r"材料有 (\d+) 份", old_value=i, new_value=i+10, status="changed") for i in range(5)]
        result = dict(schema="content-refresh.result.v1", run_id="how", rows=rows)
        payload = build_number_edits(self.root, result)
        self.assertFalse(payload["skipped"])
        self.assertEqual({e["file"] for e in payload["edits"]}, {"scripts/how-demo-data.json"})
        report = apply_edits(self.root, payload)
        self.assertFalse(report["skipped"])
        self.assertEqual(json.loads(path.read_text("utf-8")), page)
        self.assertEqual([r["text"] for r in json.loads(source.read_text("utf-8"))["stories"][0]["detail_screens"]],
                         [f"材料有 {i+10} 份，截至10月11日" for i in range(5)])
        self.assertIn("材料有 14 份", (self.root / "site-astro/src/content/pages/how.md").read_text("utf-8"))
        self.assertEqual(len(report["record_readback"]), 5)
        from freshness import close_run
        self.assertEqual(close_run(self.root, result, report)["status"], "closed")
        page["screens"][0]["text"] = page["screens"][1]["text"]
        path.write_text(json.dumps(page), encoding="utf-8")
        self.assertEqual(close_run(self.root, result, report)["status"], "incomplete")

    def test_diverged_markdown_blocks_author_and_failed_conversion_blocks_readback(self):
        payload = self.one("167 次调用，截至10月9日", "167 次调用", 167, 168)
        fake_converter(self.root, {"personal-materials"})
        md = self.root / "site-astro/src/content/pages/personal-materials.md"
        md.write_text(md.read_text("utf-8") + "直接改过", encoding="utf-8")
        before = self.path.read_bytes()
        report = apply_edits(self.root, payload)
        self.assertEqual({e["reason"] for e in report["skipped"]}, {"author_markdown_diverged"})
        self.assertEqual(self.path.read_bytes(), before)
        fake_converter(self.root, {"personal-materials"})
        def stale(root, pages, output_dir=None):
            if output_dir is not None: fake_converter(root, pages, output_dir)
        report = apply_edits(self.root, payload, converter=stale)
        self.assertEqual(report["applied"], 0)
        self.assertEqual(report["markdown_readback"][0]["status"], "failed")
        self.assertFalse(report["record_readback"])

    def test_inline_placeholder_is_protected_and_dependencies_follow_layout_refs(self):
        raw = "共有 {{scale.projects}} 页，调用 4 次；截至10月11日"
        start = raw.index("4")
        self.assertEqual(display_fragment(raw, start, start+1, "共有 40 页，调用 4 次；截至10月11日"), "共有 40 页，调用 4 次")
        self.page["screens"][0]["text"] = "材料{{scale.n1}}份，截至10月9日"
        self.save()
        start = self.page["screens"][0]["text"].index("1")
        row = dict(self.rows[0], page_number=None, field="screens[0].text", start=start, end=start+1,
                   old_value=1, new_value=2, status="changed")
        payload = build_number_edits(self.root, {"rows": [row]})
        self.assertEqual(payload["skipped"][0]["reason"], "placeholder_computed_value")
        forged = dict(schema="content-refresh.number-edits.v1", edits=[dict(page=row["page"],
            file="sources/pages/personal-materials/page.json", field=row["field"], start=start, end=start+1, old_value="1", new_value="2")])
        self.assertEqual(apply_edits(self.root, forged)["skipped"][0]["reason"], "placeholder_computed_value")
        other = self.root / "sources/pages/dependent/page.json"
        other.parent.mkdir(parents=True)
        other.write_text('{"screens":[]}', encoding="utf-8")
        (other.parent / "layout.json").write_text('{"x":"{{personal-materials.screens.top.text}}"}', encoding="utf-8")
        self.assertEqual(affected_pages(self.root, ["sources/pages/personal-materials/page.json"]), {"personal-materials", "dependent"})


if __name__ == "__main__":
    unittest.main()

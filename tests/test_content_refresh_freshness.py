"""受控来源验证频率、真实时间和 collect→apply→原位回读闭环。"""
from datetime import date
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts/content-refresh"
sys.path.insert(0, str(SCRIPTS))
import refresh
from freshness import cadence, metadata, now, close_run, review_tasks, LIVE_METHODS
from inventory import build_inventory, strict_findings
from apply_edits import build_number_edits, apply_edits
from test_content_refresh_edits import fake_converter, install_fake_converter


class FreshnessTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.path = self.root / "sources/pages/demo/page.json"; self.path.parent.mkdir(parents=True)
        self.page = dict(page="demo", kind="project", semantic_checked_at=now(), screens=[dict(id="top", text="调用 3 次；截至 2026-10-01")])
        self.write(self.path, self.page)
        self.write(self.root / "snapshot.json", dict(count=4, stamp="2026-10-18T09:00:00+08:00"))
        self.number = dict(id="n", page="demo", screen="top", label="调用数", source_location="合成快照",
                           as_of="2026-10-01", current_value=3, field="screens[0].text", page_pattern=r"调用 (\d+) 次",
                           automatic=True, scope_status="verified", retrieve=dict(kind="json", path="snapshot.json", pointer=["count"]),
                           observation_basis="snapshot_timestamp", source_observed_at_pointer=["stamp"])
        self.cutoff = dict(self.number, id="d", label="截至", current_value="2026-10-01", page_pattern=r"截至 (\d{4}-\d{2}-\d{2})", qualifies=["n"])
        self.registry = dict(schema="content-refresh.sources.v1", records=[self.number, self.cutoff], writing_points=[], retired_names=[])
        self.registry_path = self.root / "sources/refresh/registry.json"
        self.write(self.registry_path, self.registry)

    def write(self, path, data):
        path.parent.mkdir(parents=True, exist_ok=True); path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")

    def collect(self):
        result = refresh.collect(self.root, self.registry, entries={}); result["registry_path"] = str(self.registry_path)
        return result

    def apply(self, result):
        return apply_edits(self.root, build_number_edits(self.root, result), converter=fake_converter)

    def test_selection_inherits_real_owner_and_leaves_parentless_skills_independent(self):
        from selection import Selection
        self.page.update(url="/projects/different-id/"); self.write(self.path, self.page)
        self.write(self.root / "sources/pages/child/page.json", dict(page="child", parent="demo"))
        self.write(self.root / "sources/pages/skill-demo/page.json", dict(page="skill-demo", parent=None, kind="skill"))
        config = self.root / "config/panel-projects.json"
        for path in ("sources/pages/demo/page.json", "site-astro/sources/frozen-site/pages/projects/different-id/index.html"):
            self.write(config, dict(projects=[dict(id="different-id", route="/projects/different-id",
                ai_refresh=dict(mode="manual_owner_only", content_path=path))]))
            for frozen in (False, True):
                self.page["kind"] = "frozen" if frozen else "project"; self.write(self.path, self.page)
                selected = Selection(self.root)
                self.assertEqual((bool(selected.reason("demo")), bool(selected.reason("child")),
                    selected.reason("skill-demo"), Selection(self.root, ["different-id"]).reason("child")), (True, True, None, None))
        with patch.object(refresh, "bounded") as read:
            result = self.collect()
            read.assert_not_called()
        self.assertEqual((all(r["status"] == "excluded" and not r["overdue"] for r in result["rows"]),
            result["automatic_total"], result["manual_tasks"], close_run(self.root, result)["pending"]), (True, 0, [], 0))
        result = refresh.collect(self.root, self.registry, entries={}, manual_owner_request=["different-id"])
        self.assertTrue(build_number_edits(self.root, result)["edits"])
        result["registry_path"] = str(self.registry_path)
        self.assertEqual(close_run(self.root, result, self.apply(result))["status"], "closed")
        # CACB 的旧登记仍指向冻结 HTML；实际原生页使用另一条路由。
        self.page["url"] = "/projects/legacy-name/"
        self.write(self.path, self.page)
        aliases = self.root / "scripts/audit-content-refresh.py"
        aliases.parent.mkdir(parents=True)
        aliases.write_text("PROJECT_ALIASES = {'demo': 'different-id'}", encoding="utf-8")
        self.assertIsNone(Selection(self.root, ["different-id"]).reason("child"))
        self.page["kind"] = "project"
        self.write(self.path, self.page)
        self.assertIn("different-id", Selection(self.root).reason("child"))

    def test_old_changed_and_unchanged_candidates_cannot_bypass_current_selection(self):
        for unchanged in (False, True):
            self.write(self.root / "snapshot.json", dict(count=3 if unchanged else 4, stamp="2026-10-18T09:00:00+08:00"))
            result = self.collect(); candidate = build_number_edits(self.root, result)
            self.write(self.root / "config/panel-projects.json", dict(projects=[dict(id="alias", route="/demo",
                ai_refresh=dict(mode="manual_owner_only", content_path="sources/pages/demo/page.json"))]))
            before, registry_before = self.path.read_bytes(), self.registry_path.read_bytes()
            rebuilt = build_number_edits(self.root, result)
            self.assertEqual((rebuilt["edits"], rebuilt["record_updates"]), ([], []))
            report = apply_edits(self.root, candidate, converter=fake_converter)
            self.assertEqual((report["applied"], report["record_readback"], bool(report["excluded"])), (0, [], True))
            closure = close_run(self.root, result, report)
            self.assertEqual((closure["status"], closure["pending"], all(r["status"] == "excluded" for r in closure["rows"]),
                self.path.read_bytes(), self.registry_path.read_bytes()), ("closed", 0, True, before, registry_before))
            (self.root / "config/panel-projects.json").unlink()

    def test_apply_card_prompts_home_preparation_before_commit(self):
        from contextlib import redirect_stdout
        from io import StringIO
        import apply_edits as edits_module
        install_fake_converter(self.root)
        home = self.root / "site-astro/sources/retained-home-cockpit/home.html"
        home.parent.mkdir(parents=True); home.write_text("old highlight numbers", encoding="utf-8")
        script = self.root / "scripts/prepare-home-highlights.py"
        script.parent.mkdir(parents=True)
        script.write_text("def transcript_current(text): return text == 'current'", encoding="utf-8")
        candidate = self.root / "edits.json"
        self.write(candidate, build_number_edits(self.root, self.collect()))
        output = StringIO()
        with redirect_stdout(output):
            self.assertEqual(edits_module.main([str(candidate), "--root", str(self.root)]), 0)
        self.assertIn("prepare-home-highlights.py", json.loads(output.getvalue())["next_step"])

    def test_time_basis_does_not_promote_a_snapshot_or_unknown_to_today(self):
        checked = "2026-10-23T10:00:00+08:00"
        old = metadata({"meta": {"at": "2026-10-01T09:00:00+08:00"}}, dict(observation_basis="snapshot_timestamp", source_observed_at_pointer=["meta", "at"]), checked_at=checked)
        self.assertEqual((old["checked_at"], old["source_observed_at"], old["observation_basis"]), (checked, "2026-10-01T09:00:00+08:00", "snapshot_timestamp"))
        self.assertIsNone(metadata({"count": 1}, {}, checked_at=checked)["source_observed_at"])
        self.assertEqual(metadata({}, {"observation_basis": "live_read"}, checked_at=checked)["source_observed_at"], checked)
        self.assertEqual(metadata({}, {"observation_basis": "unknown"}, {"observation_basis": "live_read"}, checked)["observation_basis"], "unknown")
        for kind in LIVE_METHODS:
            self.assertEqual(metadata(None, dict(kind=kind), checked_at=checked)["source_observed_at"], checked)
        self.assertEqual(metadata({"source_observed_at": checked}, dict(kind="json"))["observation_basis"], "unknown")
        # 来源自己的业务字段也可能叫 metadata（例如健康导入计划的字段清单）。
        self.assertEqual(metadata({"metadata": ["field"]}, {"observation_basis": "live_read"}, checked_at=checked)["source_observed_at"], checked)

    def test_cadence_every_request_semantic_28_days_target_change_and_history(self):
        today = date(2026, 10, 23)
        semantic = dict(freshness_class="semantic", semantic_checked_at="2026-09-26")
        cases = [(dict(as_of="2026-10-23"), False, True), (semantic, False, False),
            (dict(semantic, semantic_checked_at="2026-09-25"), False, True), (semantic, True, True),
            (dict(semantic, source_changed=True), False, True), (dict(historical=True), False, False)]
        for record, targeted, due in cases: self.assertEqual(cadence(record, today=today, targeted=targeted)["refresh_due"], due)
        self.assertEqual(cadence(dict(freshness_class="semantic"), today=today)["freshness_status"], "due_unknown")

    def test_collect_uses_source_date_and_unknown_keeps_old_date_and_candidate(self):
        result = self.collect()
        self.assertEqual((result["rows"][1]["new_value"], result["rows"][0]["source_observed_at"],
            bool(result["run_id"])), ("2026-10-18", "2026-10-18T09:00:00+08:00", True))
        self.registry["records"][0].pop("source_observed_at_pointer")
        result = self.collect()
        self.assertEqual((result["rows"][0]["status"], result["rows"][0]["new_value"], result["rows"][1]["new_value"],
            result["rows"][1]["old_value"], build_number_edits(self.root, result)["edits"]), ("unavailable", 4, None, "2026-10-01", []))
        self.page["screens"][0]["text"] = "调用 3 次；仓库 4 次"; self.write(self.path, self.page)
        self.number.update(start=10, end=11)
        with patch.object(refresh, "bounded") as source:
            result = self.collect()
            source.assert_not_called()
        self.assertEqual((result["rows"][0]["status"], build_number_edits(self.root, result)["edits"]), ("unavailable", []))

    def test_strict_uses_collect_locator_and_classifies_retired_history(self):
        bad = dict(self.number, id="bad", page_pattern=r"不存在 (\d+)")
        historical = dict(bad, id="old", historical=True)
        inventory = build_inventory(self.root / "sources/pages", [bad, historical], {})
        inventory["record_bindings"].append(dict(record_id="outside", status="binding_error", classification="current"))
        findings = strict_findings(inventory, [bad, historical], {})
        self.assertEqual((any("bad" in f["record_ids"] for f in findings), any("old" in f["record_ids"] for f in findings),
            next(b for b in inventory["record_bindings"] if b["record_id"] == "old")["classification"]), (True, False, "historical"))

    def test_page_number_shown_through_a_placeholder_counts_as_displayed(self):
        self.page["registry"] = dict(numbers=[dict(id="n-x", text="3 次", as_of="2026-10-01")])
        self.write(self.path, self.page)
        record = dict(self.number, id="home", field="registry.numbers[0].text", page_pattern=r"^(\d+) 次$", private=True)
        located = lambda: build_inventory(self.root / "sources/pages", [record], {})["located_record_ids"]
        self.assertNotIn("home", located())
        self.write(self.root / "sources/creative/home.json", dict(text="**{{demo.registry.numbers.n-x.text}}**"))
        self.assertIn("home", located())

    def test_cli_inventory_collect_apply_and_close_with_registry_readback(self):
        output = self.root / "run"; install_fake_converter(self.root)
        def run(script, *args, expected=0):
            proc = subprocess.run([sys.executable, "-B", "-X", "utf8", str(SCRIPTS / script), *map(str, args)], capture_output=True, text=True, encoding="utf-8")
            self.assertEqual(proc.returncode, expected, proc.stdout + proc.stderr)
        run("refresh.py", "--root", self.root, "--inventory", "--strict", "--output", output)
        self.assertFalse((output / "result.json").exists())
        run("refresh.py", "--root", self.root, "--strict", "--no-report", "--output", output)
        result = json.loads((output / "result.json").read_text("utf-8"))
        run("refresh.py", "--root", self.root, "--close-run", output / "result.json", expected=2)
        report_path = output / "apply-report.json"
        run("apply_edits.py", output / "number-edits.json", "--root", self.root, "--report", report_path)
        run("refresh.py", "--root", self.root, "--close-run", output / "result.json", "--apply-report", report_path)
        report = json.loads(report_path.read_text("utf-8"))
        self.assertEqual((report["run_id"], all(f["status"] == "verified" for f in report["field_readback"])), (result["run_id"], True))
        registry = json.loads(self.registry_path.read_text("utf-8"))
        self.assertEqual((registry["records"][0]["current_value"], registry["records"][0]["source_observed_at"],
            "调用 4 次；截至 2026-10-18" in self.path.read_text("utf-8")), (4, "2026-10-18T09:00:00+08:00", True))
        dist = self.root / "dist/demo"; dist.mkdir(parents=True)
        (dist / "index.html").write_text("<p>调用 <b>4</b> 次；截至 2026-10-18</p>", encoding="utf-8")
        run("refresh.py", "--root", self.root, "--close-run", output / "result.json", "--apply-report", report_path, "--dist", dist.parent)
        self.assertTrue(all(r["display_readback"] == "verified" for r in json.loads((output / "closure.json").read_text("utf-8"))["rows"]))
        (dist / "index.html").write_text("<p>调用 3 次；截至 2026-10-01</p><script>4</script>", encoding="utf-8")
        run("refresh.py", "--root", self.root, "--close-run", output / "result.json", "--apply-report", report_path, "--dist", dist.parent, expected=2)

    def test_close_rejects_tamper_wrong_run_and_unapplied_changes(self):
        result = self.collect()
        self.assertEqual(close_run(self.root, result)["status"], "incomplete")
        report = self.apply(result)
        self.assertEqual(close_run(self.root, result, report)["status"], "closed")
        for key in ("field_readback", "record_readback", "markdown_readback"):
            self.assertEqual(close_run(self.root, result, dict(report, **{key: []}))["status"], "incomplete")
        self.assertTrue(all(r["display_readback"] == "not_checked" for r in close_run(self.root, result, report)["rows"]))
        with self.assertRaises(ValueError):
            close_run(self.root, result, dict(report, run_id="another"))
        self.path.write_text(self.path.read_text("utf-8").replace("调用 4", "调用 9"), encoding="utf-8")
        self.assertEqual(close_run(self.root, result, report)["status"], "incomplete")

    def test_display_projection_preserves_codes_and_rejects_old_dates_and_values(self):
        from freshness import display_readback
        from apply_edits import display_fragment
        text = "1. `producer_verified_manifest_bound` 调用 4 次"
        self.page.update(status_line=dict(state="常用", as_of="2026-11-02", last=dict(label="上次使用", at="2025-10-30 05:29"), source="来源说明" * 8), registry=dict(numbers=[dict(as_of="2026-11-02")]))
        self.page["screens"][0]["text"] = text; self.write(self.path, self.page)
        md = self.root / "site-astro/src/content/pages/demo.md"; md.parent.mkdir(parents=True)
        md.write_text('---\n{"url":"/demo/"}\n---\n', encoding="utf-8")
        target = self.root / "dist/demo/index.html"; target.parent.mkdir(parents=True)
        def read(field, value):
            proof = dict(locator=dict(file="sources/pages/demo/page.json", field=field, start=0, end=len(value)))
            return display_readback(self.root, target.parent.parent, "demo", value, proof)
        target.write_text("<p>1 producer_verified_manifest_bound 调用 4 次</p>", encoding="utf-8")
        self.assertIn("producer_verified_manifest_bound", display_fragment(text, 0, len(text)))
        self.assertEqual(read("screens[0].text", text), "verified")
        target.write_text("<p>1 producer_verified_manifest_bound 调用 3 次</p>", encoding="utf-8")
        self.assertEqual(read("screens[0].text", text), "failed")
        target.write_text("<p>常用 · 上次使用 2025 年 10 月 30 日 05:29</p><p>截至 11 月 2 日</p>", encoding="utf-8")
        self.assertEqual(read("status_line.last.at", "2025-10-30 05:29"), "verified")
        self.assertEqual(read("status_line.as_of", "2026-11-02"), "verified")
        target.write_text("<p>常用 · 上次使用 2024 年 10 月 30 日 05:29</p><p>截至 11 月 1 日</p>", encoding="utf-8")
        self.assertEqual(read("status_line.last.at", "2025-10-30 05:29"), "failed")
        self.assertEqual(read("status_line.as_of", "2026-11-02"), "failed")
        self.assertEqual(read("status_line.source", self.page["status_line"]["source"]), "not_displayed_by_contract")
        target.write_text("<p>数字截至 2026 年 11 月 2 日</p>", encoding="utf-8")
        self.assertEqual(read("registry.numbers[0].as_of", "2026-11-02"), "verified")
        target.write_text("<p>数字截至 2025 年 11 月 2 日</p>", encoding="utf-8")
        self.assertEqual(read("registry.numbers[0].as_of", "2026-11-02"), "failed")

    def test_manual_state_review_and_semantic_due_require_actual_closure(self):
        result = self.collect(); report = self.apply(result)
        inventory = dict(items=[dict(id="state", page="demo", field="status_line.state", kind="status_line.state")])
        result["manual_tasks"] = review_tasks(inventory, [])
        self.assertEqual(close_run(self.root, result, report)["pending"], 1)
        report["manual_closures"] = [dict(id="review:state", run_id=result["run_id"], checked_at=now(), evidence="受控样例状态已核对", status="completed")]
        self.assertEqual(close_run(self.root, result, report)["status"], "closed")
        result["semantic_due"] = dict(count=1, pages=["demo"]); report["manual_closures"].append(dict(id="semantic:demo", run_id="other", checked_at=now(), evidence="旧轮", status="completed"))
        path = self.root / "sources/refresh/semantic-reviews.json"
        close_run(self.root, result, report)
        self.assertFalse(path.exists())
        report["manual_closures"][-1]["run_id"] = result["run_id"]; close_run(self.root, result, report)
        self.assertEqual(json.loads(path.read_text("utf-8"))["pages"]["demo"]["evidence"], "旧轮")
        inventory["items"].append(dict(id="other", page="other", field="status_line.state", kind="status_line.state"))
        self.assertEqual([t["page"] for t in review_tasks(inventory, [], {"demo"})], ["demo"])

    def test_feature_status_projection_requires_same_real_card_and_matching_state(self):
        from freshness import display_readback
        md = self.root / "site-astro/src/content/pages/demo.md"; md.parent.mkdir(parents=True)
        md.write_text('---\n{"url":"/demo/"}\n---\n', encoding="utf-8")
        target = self.root / "dist/demo/index.html"; target.parent.mkdir(parents=True)
        expected = "还在等的 62 项、暂缓 10 项〈在用〉"
        dot = '<span class="feature-status-dot" data-state="on" data-text="〈在用〉"></span>'
        good = '<article class="feature-item card" data-state="on"><div>还在等的 62 项、暂缓 10 项</div>' + dot + '</article>'
        cases = [(good, True), (good.replace('62 项', '61 项'), False),
                 (good.replace('class="feature-status-dot"', 'class="fake-feature-status-dot"'), False),
                 (good.replace('data-state="on" data-text', 'data-state="off" data-text'), False),
                 (good.replace('data-text="〈在用〉"', 'data-text="〈已停用〉"'), False),
                 (good.replace('class="feature-item card"', 'class="fake-feature-item"'), False),
                 ('<article class="feature-item" data-state="on">还在等的 62 项、暂缓 10 项</article><article class="feature-item" data-state="on">' + dot + '</article>', False)]
        for html, accepted in cases:
            target.write_text(html, encoding="utf-8")
            self.assertEqual(display_readback(self.root, target.parent.parent, "demo", expected) == "verified", accepted, html)

    def test_dynamic_status_omission_needs_official_top_screen_and_actual_live_binding(self):
        import copy, hashlib
        from freshness import display_readback
        self.page["status_line"] = dict(state="常用", facts=["调用 3 次"])
        self.number["field"] = "status_line.facts[0]"; self.registry["records"] = [self.number]
        self.write(self.path, self.page)
        result = self.collect(); report = self.apply(result)
        md = self.root / "site-astro/src/content/pages/demo.md"
        target = self.root / "dist/demo/index.html"; target.parent.mkdir(parents=True)
        proof = report["record_readback"][0]
        for comp in ("live_strip", "live_box"):
            meta = dict(screen=dict(id="demo-01", section="top", live=["run"]),
                layout={o: dict(blocks=[dict(type="chapter_title"), dict(type=comp)]) for o in ("h", "v")})
            text = '---\n{"url":"/demo/"}\n---\n::screen{#demo-01 section="top"}\n\n```typeset\n' + json.dumps(meta) + '\n```\n'
            html = '<section class="ts-screen" id="demo-01"><div data-comp="' + comp + '"><div data-hot="live" data-href="run"></div></div></section>'
            cases = [("pass", text, html, True), ("missing_md", text.split('::screen')[0], html, True),
                ("wrong_screen", text, html.replace('id="demo-01"', 'id="demo-02"'), True),
                ("wrong_key", text, html.replace('data-href="run"', 'data-href="other"'), True),
                ("static", text, html.replace('data-comp=', 'data-status-line="static" data-comp='), True),
                ("no_binding", text, html.replace('data-hot="live"', 'data-hot="link"'), True),
                ("stale_official_md", text, html, False)]
            for case, author_md, built, official in cases:
                md.write_text(author_md, encoding="utf-8"); target.write_text(built, encoding="utf-8")
                receipt = copy.deepcopy(report); receipt["markdown_readback"][0]["sha256"] = hashlib.sha256(md.read_bytes()).hexdigest()
                with patch("authors.markdown_checks", return_value={"demo": official}):
                    closed = close_run(self.root, result, receipt, target.parent.parent)
                row = closed["rows"][0]
                self.assertEqual(row["status"], "source_only_verified" if case == "pass" else "pending", (comp, case, row))
                if case == "pass":
                    self.assertEqual(row["display_readback"], "not_displayed_by_contract")
                    self.assertIn("不计成品显示通过", row["reason"])
                    for missing in ("field_readback", "markdown_readback", "record_readback"):
                        with patch("authors.markdown_checks", return_value={"demo": True}):
                            incomplete = close_run(self.root, result, dict(receipt, **{missing: []}), target.parent.parent)
                        self.assertEqual(incomplete["rows"][0]["status"], "pending", missing)

    def test_manual_record_review_proves_source_markdown_and_actual_display(self):
        import copy, hashlib
        install_fake_converter(self.root); result = self.collect(); report = self.apply(result)
        result["rows"][1].update(status="manual_review", new_value=None, date_candidate="2026-10-18")
        report["record_readback"] = [r for r in report["record_readback"] if r["record_id"] != "d"]
        report["manual_closures"] = [dict(id="record:d", run_id=result["run_id"], actual_value="2026-10-18",
            checked_at=now(), evidence="合成来源与日期口径已人工核对", status="completed")]
        target = self.root / "dist/demo/index.html"; target.parent.mkdir(parents=True)
        md = self.root / "site-astro/src/content/pages/demo.md"; original = md.read_bytes()
        cases = [(False, c) for c in ("pass", "wrong_run", "missing_evidence", "stale_md", "date_elsewhere", "changed", "no_dist")]
        cases += [(True, c) for c in ("pass", "false", "domain", "none", "unknown", "scope", "unconfirmed_scope", "time", "naive_time", "location", "automatic", "changed", "scope_pending")]
        for source, case in cases:
            candidate, receipt, value = copy.deepcopy(result), copy.deepcopy(report), None if case == "none" else "Unknown" if case == "unknown" else False if case == "false" else 0
            md.write_bytes(original.replace("调用 4".encode(), "调用 3".encode()) if case == "stale_md" else original)
            if source:
                candidate["rows"] = [dict(candidate["rows"][1], status="scope_pending" if case == "scope_pending" else "domain_fact_task" if case == "domain" else "unavailable",
                    automatic=case == "automatic", retrieve=dict(kind="manual"), scope_status="pending" if case == "scope" else "verified", qualifies=None, page_pattern=r"确认值 ([^；]+)")]
                self.page["screens"][0]["text"] = f"确认值 {value}；截至 2026-10-18"; self.write(self.path, self.page); fake_converter(self.root, ["demo"])
                receipt["manual_closures"][0].update(actual_value=value, source_location="" if case == "location" else "合成snapshot.json",
                    source_observed_at="2040-01-01T09:00:00+08:00" if case == "time" else "2026-10-18T09:00:00" + ("" if case == "naive_time" else "+08:00"), manual_scope_verified=case != "unconfirmed_scope")
            receipt["markdown_readback"][0]["sha256"] = hashlib.sha256(md.read_bytes()).hexdigest()
            receipt["manual_closures"][0].update(run_id="another" if case == "wrong_run" else result["run_id"], evidence="" if case == "missing_evidence" else "合成来源已核对")
            target.write_text(f"<p>确认值 {value}；截至 2026-10-18</p>" if source else "<p>别处日期 2026-10-18</p>" if case == "date_elsewhere" else "<p>调用 4 次；截至 2026-10-18</p>", encoding="utf-8")
            if case == "changed": candidate["rows"][-1]["status"] = "changed"
            closed = close_run(self.root, candidate, receipt, None if case == "no_dist" else target.parent.parent)
            self.assertEqual(next(r for r in closed["rows"] if r["record_id"] == "d")["status"] == ("manual_source_verified" if source else "manual_review_verified"), case in {"pass", "false", "domain"}, (source, case))
            self.assertEqual(json.loads(self.registry_path.read_text("utf-8"))["records"][1]["current_value"], "2026-10-18")

    def test_unknown_and_unchanged_close_only_after_real_current_check(self):
        self.write(self.root / "snapshot.json", dict(count=3, stamp="2026-10-01T09:00:00+08:00"))
        result = self.collect()
        self.assertEqual(close_run(self.root, result)["status"], "closed")
        self.write(self.root / "snapshot.json", dict(count=3))
        result = self.collect()
        self.assertEqual(close_run(self.root, result)["rows"][0]["status"], "unknown_preserved")
        row = dict(result["rows"][0], automatic=False, retrieve=dict(kind="manual"), scope_status="verified")
        manual = dict(result, rows=[row])
        self.assertEqual(close_run(self.root, manual)["rows"][0]["status"], "unknown_preserved")
        invalid = dict(run_id=result["run_id"], manual_closures=[dict(id="record:" + row["id"], run_id="wrong")])
        self.assertEqual(close_run(self.root, manual, invalid)["rows"][0]["status"], "pending")
        self.assertEqual(close_run(self.root, dict(manual, rows=[dict(row, raw_status="changed", raw_new_value=4)]))["rows"][0]["status"], "pending")
        self.assertEqual(close_run(self.root, dict(manual, rows=[dict(row, manual_closure_required=True)]))["rows"][0]["status"], "pending")
        self.assertEqual(close_run(self.root, dict(manual, rows=[dict(row, status="manual_review", qualifies=["n"])]))["rows"][0]["status"], "pending")
        result["rows"][0]["checked_at"] = None
        self.assertEqual(close_run(self.root, result)["status"], "incomplete")


if __name__ == "__main__":
    unittest.main()

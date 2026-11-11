"""批开后断点续收、限流与按真实字段分流。"""
from pathlib import Path
import unittest
from unittest.mock import patch
import test_update as fixtures
from update_batch import FIELDS, collect, execute, prepare
from update_gates import read, write

class BatchTests(unittest.TestCase):
    setUp = fixtures.UpdateTests.setUp
    put = fixtures.UpdateTests.put
    create = fixtures.UpdateTests.create

    def plan(self):
        self.run = self.create(); templates = self.private / "files/docs/update-templates"; templates.mkdir(parents=True)
        ledger = self.private / "files/editorial-ledgers/project-demo.json"; book = read(ledger)
        for page in book["pages"].values(): page.pop("checked_sources")
        write(ledger, book)
        for kind in "abcef":
            (templates / f"{kind}-template.md").write_text("{{项目}} {{来源仓库和截至提交}} {{模式}}", encoding="utf-8")
        (templates / "批阅.md").write_text("{{本批单句改法文件}}", encoding="utf-8")
        return prepare(self.run.directory, "fixture-task", repositories=self.repos, supply=self.supply)

    def receipt(self, job, **counts):
        fields = dict(单=job["kind"], 项目=job["project"], 页=job["url"], **{k: counts.get(k, 0) for k in FIELDS[job["kind"]]})
        Path(job["receipt"]).write_text("---\n" + "\n".join(f"{k}: {v}" for k, v in fields.items()) + "\n---\n" +
                                       ("a-1-1｜不对·单句；意思跟着数变｜旧句｜file:1｜新句\n" if counts.get("不对") else ""), encoding="utf-8")
        job["status"] = "completed"

    def test_plan_and_receipt_routes_and_identity(self):
        batch = self.plan(); self.assertEqual([j["kind"] for j in batch["jobs"]].count("a"), 2)
        self.assertEqual(len(batch["jobs"]), 3)
        for job in batch["jobs"]: self.receipt(job)
        result = collect(self.run.directory, batch); self.assertEqual(result["projects"][0]["routes"], ["到此为止"])
        a = next(j for j in batch["jobs"] if j["kind"] == "a")
        self.receipt(a, 句数=1, 不对=1); result = collect(self.run.directory, batch)
        self.assertEqual(result["opus_to_open"][0]["effort"], "medium")
        b = next(j for j in batch["jobs"] if j["kind"] == "b"); self.receipt(b, 候选=1)
        result = collect(self.run.directory, batch); self.assertEqual(result["projects"][0]["routes"], ["c"])
        self.assertEqual([o["role"] for o in result["opus_to_open"]], ["c"])
        b["defer_c"] = True; self.assertIn("主持", collect(self.run.directory, batch)["projects"][0]["routes"])
        b["defer_c"] = False
        self.receipt(a, 登记数不对=1); self.receipt(b)
        self.assertEqual(collect(self.run.directory, batch)["projects"][0]["routes"], ["数字"])
        Path(a["receipt"]).write_text("---\n单: a\n项目: wrong\n---\n", encoding="utf-8")
        self.assertIn("主持", collect(self.run.directory, batch)["projects"][0]["routes"])
        self.put(self.root / "sources/pages/demo/page.json", dict(url="/projects/demo/", text="new draft"))
        materials = self.base / "materials.json"; write(materials, dict(demo={"本页改动清单": "diff.md"}))
        batch = prepare(self.run.directory, "fixture-task", "ef", materials, self.repos, self.supply)
        self.assertIn("new draft", (self.run.directory / "pages/ef/demo/page.json").read_text("utf-8"))
        for job in batch["jobs"]:
            if job["kind"] in "ef": self.receipt(job)
        self.assertEqual(collect(self.run.directory, batch)["projects"][0]["routes"], ["到此为止"])

    def test_one_waiter_refills_capacity_and_does_not_reopen(self):
        batch = self.plan(); batch["jobs"][0]["key"] = "a-" + "x" * 80; write(self.run.directory / "batch.json", batch)
        with patch("update_batch.subprocess.check_output", return_value="6"):
            self.assertIn("capacity_wait", execute(self.run.directory, model="fixture-sol"))
        calls = []; launched = []
        def dispatch(*args):
            calls.append(args)
            if args[1] == "Watch":
                for path in args[3].split(","):
                    state = read(Path(path) / "task-state.json"); state["execution_status"] = "completed"
                    write(Path(path) / "task-state.json", state)
                return dict(reason="all_finished")
            job = next(j for j in batch["jobs"] if j["card"] == str(args[args.index("-PromptFile") + 1]))
            path = self.base / f"child-{len(launched)}"; launched.append(path); self.receipt(job)
            write(path / "task-state.json", dict(execution_status="running", time=dict(work_seconds=None if len(launched) == 1 else 10), report=str(path / "report.md"), started_at="2026-01-01T00:00:00+08:00", ended_at=None))
            self.assertRegex(args[args.index("-TaskName") + 1], r"^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$")
            self.assertIn("-RepeatReason", args); self.assertNotIn("-NewWorktree", args)
            return dict(run_dir=str(path))
        with patch("update_batch.ps", side_effect=dispatch), patch("update_batch.subprocess.check_output", return_value="100"):
            result = execute(self.run.directory, max_running=2, parent_harness="Codex", session_id="fixture", model="fixture-sol")
            self.assertEqual(result["sol_count"], 3); self.assertEqual(result["peak"], 2); self.assertEqual(result["sol_time_unknown"], 1)
            self.assertEqual(sum(c[1] == "Watch" for c in calls), 2)
            execute(self.run.directory, model="fixture-sol")
            self.assertEqual(len(launched), 3)

if __name__ == "__main__": unittest.main()

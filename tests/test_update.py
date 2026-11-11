"""更新骨架：真实进程中断、硬截止、跨关修复次数和范围。"""
from datetime import timedelta
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from update import start
from update_gates import GATES, Run, now, read, timestamp, write


class UpdateTests(unittest.TestCase):
    def setUp(self):
        base = Path(os.environ.get("WLY_UPDATE_TEST_TMP", tempfile.gettempdir())) / "wly-update-tests"
        base.mkdir(parents=True, exist_ok=True)
        temp = tempfile.TemporaryDirectory(dir=base); self.addCleanup(temp.cleanup)
        self.base = Path(temp.name); self.root = self.base / "site"; self.root.mkdir()
        self.private = self.base / "private"
        environment = patch.dict(os.environ, WLY_EDITORIAL_ROOT=str(self.private))
        environment.start(); self.addCleanup(environment.stop)
        projects = [dict(id=p, route=f"/projects/{p}/", enabled=True,
                         ai_refresh=dict(content_path=f"sources/pages/{p}/page.json"),
                         source=dict(repo="example/source")) for p in ("demo", "learning", "cold")]
        self.put(self.root / "config/panel-projects.json", dict(projects=projects))
        self.put(self.root / "config/skill-site-exclusions.json", dict(excluded={}))
        for page, parent in (("demo", None), ("child", "demo"), ("learning", None), ("cold", None)):
            self.put(self.root / f"sources/pages/{page}/page.json", dict(page=page, parent=parent,
                     url=f"/projects/{page}/", kind="frozen" if page == "cold" else "project"))
        for book, pages in (("project-demo", ("demo", "child")), ("project-learning", ("learning",)), ("project-cold", ("cold",))):
            self.put(self.private / f"files/editorial-ledgers/{book}.json", dict(schema="wly.editorial-ledger.v1",
                     book=book, source_repositories=["example/source"], capabilities=[], stages=[], images=[],
                     pages={p: dict(checked_sources={"example/source": dict(commit="0" * 40)}) for p in pages}))
        subprocess.run(["git", "init", "-q", str(self.root)], check=True, capture_output=True)
        subprocess.run(["git", "-C", str(self.root), "add", "config", "sources"], check=True, capture_output=True)
        subprocess.run(["git", "-C", str(self.root), "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid",
                        "commit", "-qm", "fixture"], check=True, capture_output=True)
        self.repos = self.base / "repos.json"; self.supply = self.base / "skills.json"; self.exclusions = self.base / "excluded.json"
        self.put(self.repos, dict(entries=[dict(repo=r, path=str(self.root)) for r in ("example/source", "wlyaaaaa/wly0829.cn")]))
        self.put(self.supply, dict(skills=[dict(name="new-skill", install=True)]))
        self.put(self.exclusions, dict(excluded={}))

    def put(self, path, value):
        write(path, value)

    def create(self, **kwargs):
        directory = self.base / ("run-" + str(len(list(self.base.glob("run-*")))))
        start(self.root, directory, kwargs.pop("requested_at", now().isoformat()), repositories=self.repos,
              supply=self.supply, exclusions=self.exclusions, **kwargs)
        state = read(directory / "state.json")
        state["numbers"] = dict(status="committed", commit=subprocess.check_output(["git", "-C", str(self.root), "rev-parse", "HEAD"], text=True).strip())
        write(directory / "state.json", state)
        self.put(directory / "output.json", dict(synthetic=True))
        return Run(directory)

    def cli(self, run, *args):
        result = subprocess.run([sys.executable, "-B", "-X", "utf8", str(ROOT / "tools/update.py"), *args,
                                 "--run-dir", str(run.directory)], capture_output=True, text=True, encoding="utf-8", timeout=20)
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)

    def test_killed_process_resumes_without_redoing_ready_page(self):
        run = self.create(); self.assertEqual(set(run.load()["pages"]), {"demo", "child"})
        script = ("import sys,time;sys.path.insert(0,sys.argv[1]);from update_gates import Run,locked,GATES;"
                  "r=Run(sys.argv[2]);r.apply('begin','demo');\n"
                  "for s in GATES:r.apply('step-start','demo',s);r.apply('pass','demo',s,artifact='output.json')\n"
                  "r.apply('begin','child');r.apply('step-start','child','content');\n"
                  "with locked(r.directory):print('checkpoint',flush=True);time.sleep(60)\n")
        child = subprocess.Popen([sys.executable, "-B", "-X", "utf8", "-c", script, str(ROOT / "tools"), str(run.directory)],
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8")
        try:
            self.assertEqual(child.stdout.readline().strip(), "checkpoint")
            saved = run.load(); self.assertEqual(saved["pages"]["demo"]["status"], "ready")
            self.assertIsNone(saved["timings"][-1].get("ended_at"))
        finally:
            child.kill(); child.communicate(timeout=10)
        self.assertEqual(self.cli(run, "status")["pages"]["demo"], saved["pages"]["demo"])
        self.assertEqual(self.cli(run, "begin", "--page", "demo")["events"], saved["events"])
        self.cli(run, "pass", "--page", "child", "--step", "content", "--artifact", "output.json")
        for step in GATES[1:]:
            Run(run.directory).apply("step-start", "child", step)
            Run(run.directory).apply("pass", "child", step, artifact="output.json")
        self.assertTrue(all(p["status"] == "ready" for p in run.load()["pages"].values()))
        timing = run.summary(); self.assertEqual(len([t for t in timing["steps"] if t.get("page") == "demo"]), 3)

    def test_deadline_rejects_work_but_allows_drop_publish_and_report(self):
        run = self.create(pages=["demo", "child"])
        self.assertEqual((timestamp(run.load()['deadline']) - timestamp(run.load()['requested_at'])).total_seconds(), 3 * 3600)
        run.apply("begin", "demo"); run.apply("step-start", "demo", "content"); run.apply("reject", "demo", "content", reason="bad")
        state = run.load(); state["deadline"] = (now() - timedelta(seconds=1)).isoformat()
        state["requested_at"] = (now() - timedelta(hours=4)).isoformat(); self.put(run.directory / "state.json", state)
        for action, page, step in (("begin", "child", None), ("repair", "demo", None), ("step-start", "demo", "content")):
            with self.assertRaisesRegex(ValueError, "总上限"): run.apply(action, page, step)
        run.apply("drop", "demo", reason="deadline")
        for step in ("publish", "report"):
            run.apply("step-start", step=step); run.apply("step-end", step=step, artifact="output.json")
        self.assertGreaterEqual(run.summary()["total_seconds"], 4 * 3600)
        self.assertEqual(run.load()["pages"]["demo"]["status"], "dropped")
        run.apply('finish', artifact='output.json'); total = run.summary()['total_seconds']
        with patch('update_gates.now', return_value=now() + timedelta(hours=2)):
            self.assertEqual(run.summary()['total_seconds'], total)

    def test_first_pass_scope_and_three_repairs_across_gates(self):
        run = self.create(first_pass=True, requested_at=(now() - timedelta(hours=13)).isoformat())
        self.assertIsNone(run.load()["deadline"])
        scope = read(run.directory / "scope.json"); self.assertEqual(set(run.load()["pages"]), {"demo", "child", "learning", "cold"})
        self.assertEqual(next(p for p in scope["pages"] if p["page"] == "cold")["review_scope"], "frozen-notice")
        self.assertEqual(scope["questions"]["new_skills"], ["new-skill"])
        run.apply("begin", "demo")
        for index, step in enumerate((*GATES, "content")):
            run.apply("step-start", "demo", step); run.apply("reject", "demo", step, reason="bad")
            if index < 3:
                run.apply("repair", "demo", event_id=f"repair-{index}")
                run.apply("repair", "demo", event_id=f"repair-{index}")
        self.assertEqual(run.load()["pages"]["demo"]["repairs"], 3)
        self.assertEqual(run.load()["pages"]["demo"]["status"], "dropped")
        with self.assertRaises(ValueError): run.apply("repair", "demo")
        stale = Run(run.directory); stale.load(); run.apply("drop", "child", reason="owner dropped")
        self.assertEqual(stale.apply("begin", "child")["pages"]["child"]["status"], "dropped")

    def test_any_source_changes_selects_whole_project_and_missing_sources_stay_visible(self):
        head = subprocess.run(["git", "-C", str(self.root), "rev-parse", "HEAD"], check=True,
                              capture_output=True, text=True).stdout.strip()
        path = self.private / "files/editorial-ledgers/project-demo.json"
        book = read(path)
        for page in book['pages'].values(): page['checked_sources']['example/source']['commit'] = head
        write(path, book)
        self.assertEqual(self.create().load()['status'], 'no-changes')
        book['source_repositories'].append('example/second')
        write(path, book)
        run = self.create()
        self.assertEqual(set(run.load()['pages']), {'demo', 'child'})
        self.assertTrue(all(p['blocked'] for p in run.load()['pages'].values()))
        with self.assertRaisesRegex(ValueError, '来源未齐'): run.apply('begin', 'demo')
        repos = read(self.repos); repos['entries'].append(dict(repo='example/second', path=str(self.root)))
        write(self.repos, repos)
        self.assertFalse(any(p['blocked'] for p in self.create().load()['pages'].values()))
        self.assertEqual(set(self.create(projects=['learning']).load()['pages']), {'learning'})


if __name__ == "__main__":
    unittest.main()

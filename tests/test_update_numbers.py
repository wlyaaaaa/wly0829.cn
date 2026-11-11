"""数字真实 Git 提交、应用后中断续交、同轮拒绝二次改数。"""
import subprocess
import shutil
import sys
from pathlib import Path
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import update_numbers as numeric
import test_content_refresh_edits as edits


class UpdateNumbersTests(unittest.TestCase):
    def test_commit_resumes_without_reapplying_and_locks_the_run(self):
        fixture = edits.NumberEditsTests(); fixture.setUp(); self.addCleanup(fixture.doCleanups)
        root = fixture.root; directory = root.parent / (root.name + "-run")
        directory.mkdir(); self.addCleanup(shutil.rmtree, directory)
        registry = root / "sources/refresh/registry.json"
        numeric.write(registry, dict(records=fixture.rows))
        for args in (("init", "-q"), ("add", "."), ("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "fixture")):
            numeric.git(root, *args)
        numeric.git(root, "config", "user.name", "Fixture")
        numeric.git(root, "config", "user.email", "fixture@example.invalid")
        state = dict(root=str(root), run_id="numbers-test", status="open", deadline=None,
                     requested_at=numeric.now().isoformat(), pages={}, timings=[], events=[])
        numeric.write(directory / "state.json", state)
        numeric.write(directory / "scope.json", dict(pages=[]))
        with self.assertRaisesRegex(ValueError, "先运行 numbers"): numeric.require_numbers(directory)
        fixture.rows[0].update(new_value=166, status="changed")
        result = dict(run_id="collected", rows=fixture.rows, registry_path=str(registry))
        real_git = numeric.git
        def interrupted(root, *args):
            if args[0] == "commit": raise subprocess.CalledProcessError(1, "git commit")
            return real_git(root, *args)
        with patch.object(numeric, "collect", return_value=result), patch.object(numeric, "git", side_effect=interrupted):
            with self.assertRaises(subprocess.CalledProcessError): numeric.numbers(directory)
        original = fixture.path.read_bytes()
        fixture.path.write_bytes(original.replace(b"166", b"999"))
        with self.assertRaisesRegex(ValueError, "回读之后文件又变了"): numeric.numbers(directory)
        fixture.path.write_bytes(original)
        with patch.object(numeric, "collect") as collect, patch.object(numeric, "apply_edits") as apply:
            state = numeric.numbers(directory); collect.assert_not_called(); apply.assert_not_called()
        commit = state["author_base_commit"]
        self.assertEqual(commit, numeric.read(directory / "scope.json")["author_base_commit"])
        self.assertEqual(len(commit), 40); numeric.require_numbers(directory)
        for name in ("sources/pages/personal-materials/page.json", "sources/refresh/registry.json", "site-astro/src/content/pages/personal-materials.md"):
            self.assertIn("166", numeric.git(root, "show", f"{commit}:{name}"))
        self.assertEqual(numeric.read(registry)["records"][0]["observed_at"], "2026-10-11T16:03:00+08:00")
        self.assertIn("10 月 11 日", fixture.path.read_text("utf-8"))
        before = fixture.path.read_bytes()
        with self.assertRaisesRegex(ValueError, "已经改数"): numeric.numbers(directory)
        with self.assertRaisesRegex(ValueError, "不能再次改数"):
            numeric.apply_edits(root, numeric.read(directory / "numbers/number-edits.json"))
        self.assertEqual(fixture.path.read_bytes(), before)
        self.assertFalse(numeric.git(root, "status", "--porcelain"))

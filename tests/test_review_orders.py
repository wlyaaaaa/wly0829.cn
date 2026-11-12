"""字节接口回归；模拟回执不充当视觉验收。"""
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from review_capture import VIEWPORTS, capture, digest
from review_orders import collect, prepare, split_reused
from update_gates import Run, now, read, write


class ReviewTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix="f6-", dir="E:/Cache/wly-site-build")
        self.addCleanup(temporary.cleanup); self.base = Path(temporary.name)
        self.root = self.base / "root"; self.root.mkdir()
        subprocess.run(["git", "init", "-q", str(self.root)], check=True, capture_output=True)
        self.cache = self.base / "cache"; self.template = self.base / "template.md"
        self.template.write_text("{{图片清单}} {{结果文件}}", encoding="utf-8")

    def make_run(self, name):
        directory = self.base / name; directory.mkdir(); output = directory / "trial"
        html = directory / "a.html"; html.write_text("<p>example</p>", encoding="utf-8")
        pages = {p: dict(status="active" if p == "a" else "rejected", repairs=0,
                        passed=["content", "program"] if p == "a" else ["content"]) for p in ("a", "b")}
        write(directory / "state.json", dict(root=str(self.root), status="active", pages=pages,
            requested_at=now().isoformat(), deadline=None, events=[], timings=[], protected_inputs={}))
        write(directory / "trial.json", dict(output=str(output), dist=str(directory),
            pages=[dict(page=p, route="/" + p + "/", html=str(html), passed=p == "a") for p in pages]))
        write(output / "screens.json", dict(changes=[dict(page=p, screen=p + "1", content_changed=True,
                                                         layout_changed=False) for p in pages]))
        rows = []
        for page in pages:
            for viewport in VIEWPORTS:
                screens = []
                for number in (1, 2):
                    image = directory / (page + viewport + str(number) + ".png")
                    image.write_bytes(b"\x89PNG\r\n\x1a\n" + (page + viewport + str(number)).encode())
                    screens.append(dict(screen=page + str(number), viewport=viewport, screenshot=str(image)))
                rows.append(dict(page="/" + page + "/", viewport=viewport, screens=screens))
        write(output / "scan/scan-result.json", dict(pages=rows, dist_files_unchanged=True,
                                                     input_html_sha256={"/a/": digest(html)}))
        return directory

    def complete(self, directory, plan, bad):
        job = plan["jobs"][0]; job["run_dir"] = str(directory / "fake-sol")
        write(Path(job["run_dir"]) / "task-state.json", dict(execution_status="completed"))
        write(job["result"], dict(images=[dict(sha256=i["sha256"], bad=["字被切：右侧缺字"] if bad else [],
            notes=[]) for i in read(job["manifest"])["images"]]))
        write(directory / "visual.json", plan)

    def test_changed_only_missing_image_cannot_pass(self):
        directory = self.make_run("missing"); selected = capture(directory)
        self.assertEqual((selected["total_screens"], selected["selected_screens"]), (8, 2))
        self.assertEqual(set(selected["pages"]), {"a"})
        Path(selected["pages"]["a"]["images"][0]["path"]).unlink()
        plan = prepare(directory, self.template, self.cache)
        self.assertTrue(plan["pages"]["a"]["errors"])
        self.assertEqual(collect(directory)["results"]["a"], "reject")
        self.assertNotIn("visual", Run(directory).load()["pages"]["a"]["passed"])

    def test_raw_bad_result_reused_summary_does_not_override(self):
        directory = self.make_run("first"); plan = prepare(directory, self.template, self.cache)
        self.complete(directory, plan, True); plan["results"] = {"a": "pass"}; write(directory / "visual.json", plan)
        self.assertEqual(collect(directory)["results"]["a"], "reject")
        tampered = read(directory / "visual.json"); tampered["results"] = {"a": "pass"}; write(directory / "visual.json", tampered)
        self.assertEqual(collect(directory)["results"]["a"], "reject")
        (directory / "fake-sol/task-state.json").unlink()
        second = self.make_run("second"); reused = prepare(second, self.template, self.cache)
        self.assertEqual((reused["new_reviews"], reused["jobs"]), (0, []))
        self.assertEqual(collect(second)["results"]["a"], "reject")
        prior = read(self.cache / "index.json"); job = next(iter(prior.values()))
        unsigned = {key: {k: v for k, v in entry.items() if k != "result_sha256"} for key, entry in prior.items()}
        self.assertEqual(len(split_reused(capture(self.make_run("unsigned"))["pages"]["a"]["images"], unsigned)[0]), 2)
        write(job["result"], dict(images=[]))
        fresh, reused = split_reused(capture(self.make_run("third"))["pages"]["a"]["images"], prior)
        self.assertEqual((len(fresh), reused), (2, {}))

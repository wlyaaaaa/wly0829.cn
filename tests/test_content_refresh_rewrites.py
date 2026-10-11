"""按本次 Opus 稿格式验证整屏、状态、旧路由及整批拒写。"""
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts/content-refresh"))
from apply_rewrites import apply_rewrites


class RewriteTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        self.drafts = self.root / "drafts"
        self.drafts.mkdir()
        self.pages = {}
        for slug in ("timeaudit-collection-pipeline", "skill-personal-formal-documents"):
            path = self.root / "sources/pages" / slug / "page.json"
            path.parent.mkdir(parents=True)
            page = dict(page=slug, screens=[dict(id=slug + "-01", text="旧屏", scene="保留构图")],
                        status_line=dict(source="旧依据", state="常用", last=dict(at="旧事件日期")))
            path.write_bytes((json.dumps(page, ensure_ascii=False, indent=2) + "\n").replace("\n", "\r\n").encode("utf-8"))
            self.pages[slug] = path

    def draft(self, slug, body):
        (self.drafts / (slug + ".md")).write_text("# " + slug + "\n" + body, encoding="utf-8")

    def test_real_format_screen_status_and_old_url_merge_are_idempotent(self):
        slug = "timeaudit-collection-pipeline"
        # 本次真实稿的屏标题与空对象“不改”说明格式。
        text = "# 双节拍采集、两条前台管线与分区写入\n\n完整讲解。"
        self.draft(slug, "## 屏：" + slug + "-01\n" + text + "\n## status_line\n{}（不改：源码没有新提交）")
        other = "skill-personal-formal-documents"
        self.draft(other, '## status_line\n```json\n{"source": "本次依据"}\n```\n## old_urls\n["/skills/document-materials/"]\n<!-- 修订完 -->')
        self.assertEqual(len(apply_rewrites(self.root, self.drafts)["changed_files"]), 2)
        snapshots = {slug: path.read_bytes() for slug, path in self.pages.items()}
        first, second = (json.loads(snapshots[slug]) for slug in (slug, other))
        self.assertEqual(first["screens"][0], dict(id=slug + "-01", text=text, scene="保留构图"))
        self.assertEqual(first["status_line"]["source"], "旧依据")
        self.assertEqual(second["status_line"], dict(source="本次依据", state="常用", last=dict(at="旧事件日期")))
        self.assertEqual(second["old_urls"], ["/skills/document-materials/"])
        self.assertTrue(all(b"\r\n" in raw and b"\n" not in raw.replace(b"\r\n", b"") for raw in snapshots.values()))
        self.assertEqual(apply_rewrites(self.root, self.drafts)["changed_files"], [])
        self.assertEqual({slug: path.read_bytes() for slug, path in self.pages.items()}, snapshots)
        self.draft(other, '## old_urls\n["/skills/document-materials/", "/skills/new/"]')
        apply_rewrites(self.root, self.drafts)
        self.assertEqual(json.loads(self.pages[other].read_bytes())["old_urls"], ["/skills/document-materials/", "/skills/new/"])

    def test_any_bad_draft_rejects_the_entire_batch(self):
        good = "skill-personal-formal-documents"
        bad = "timeaudit-collection-pipeline"
        self.draft(good, '## status_line\n{"source": "应当全批不写"}')
        snapshots = {slug: path.read_bytes() for slug, path in self.pages.items()}
        for body in ('## 屏：missing\n新屏', '## status_line\n{"source":', '## status_line\n[]',
                     '## old_urls\n[123]', '## status_line\n{"source": NaN}',
                     '## status_line\n{} 多余内容', '## status_line\n{}\n## status_line\n{}'):
            with self.subTest(body=body):
                self.draft(bad, body)
                with self.assertRaises(ValueError):
                    apply_rewrites(self.root, self.drafts)
                self.assertEqual({slug: path.read_bytes() for slug, path in self.pages.items()}, snapshots)

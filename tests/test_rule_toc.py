"""Rule-source headings can change independently of the curated site directory."""
from contextlib import redirect_stderr
import importlib.util
from io import StringIO
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "build_rule_pages", ROOT / "site-v2/first-layer/rules-page/demo/build.py",
)
RULES = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(RULES)


class RuleTocTests(unittest.TestCase):
    def test_stale_title_uses_current_headings_with_live_anchors(self):
        with TemporaryDirectory() as folder:
            source = Path(folder) / "rules.md"
            source.write_text("# 规则\n\n## 入口\n\n**用法**\n\n### 新标题\n\n## 收尾\n", encoding="utf-8")
            doc = RULES.load_document(source, "index.html", ())

        def make_toc(heading):
            config = {"rules.md": {"toc": [
                {"label": "从这里开始", "heading": "入口"},
                {"label": "原目录文案", "heading": heading, "level": 2},
            ]}}
            output = StringIO()
            with redirect_stderr(output):
                toc = RULES.make_toc(doc, config)
            return BeautifulSoup(toc, "html.parser"), output.getvalue()

        current, warning = make_toc("新标题")
        self.assertEqual(warning, "")
        self.assertEqual([tag.get_text() for tag in current.select(".toc-label")],
                         ["从这里开始", "原目录文案"])

        fallback, warning = make_toc("旧标题")
        self.assertIn("rules.md: 目录标题未唯一匹配（旧标题）", warning)
        self.assertEqual([(tag["href"], tag.select_one(".toc-label").get_text()) for tag in fallback.select("a")],
                         [("#入口", "入口"), ("#用法", "用法"), ("#新标题", "新标题"), ("#收尾", "收尾")])
        self.assertEqual([tag["href"] for tag in fallback.select(".toc-level-2 a")], ["#用法", "#新标题"])

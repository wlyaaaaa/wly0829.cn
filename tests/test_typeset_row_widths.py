"""混合缺省/百分比栏宽和长输入使用真实分块，保留正文与横竖版边界。"""
import copy
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / "src/typeset"), str(ROOT / "site-astro/tools")]
from engine.layout import build_html, row_widths
from engine.parse import node_text
import convert_page


class RowWidthTests(unittest.TestCase):
    def fixture(self, body="资料", steps="处理并交回", width=None):
        screen = {"id": "row-fixture", "text": f"## 输入\n\n{body}\n\n## 步骤\n\n1. {steps}"}
        blocks = [{"type": "source_text_card", "text_ref": "输入", "row": "start", "width": width},
                  {"type": "section_heading", "text_ref": "步骤", "row": "start", "width": "60%"},
                  {"type": "numbered_steps", "text_ref": "1. " + steps, "row": "start"}]
        return screen, blocks

    def render(self, screen, blocks, orient="h"):
        registry = {kind: lambda b, c: "<section>" + " ".join(node_text(n) for n in b["nodes"]) + "</section>"
                    for kind in ("source_text_card", "prose", "section_heading", "numbered_steps")}
        with patch("engine.assets.manifest", return_value={}):
            return BeautifulSoup(build_html({}, screen, orient, registry, [], {"blocks": blocks})[0], "html.parser")

    def test_actual_missing_left_sixty_right_keeps_two_columns_and_step_group(self):
        screen, blocks = self.fixture("资料" * 500, "步骤" * 500)
        soup = self.render(screen, blocks)
        row = soup.select_one(".row")
        self.assertIn("minmax(0,40.0fr) minmax(0,60.0fr)", row["style"])
        cols = row.select(":scope > .col")
        self.assertEqual(len(cols), 2)
        self.assertIn("资料" * 500, cols[0].get_text())
        self.assertIn("步骤" * 500, cols[1].get_text())
        self.assertEqual(len(cols[1].select("section")), 2)

    def test_explicit_ratios_css_tracks_and_overallocated_rows(self):
        self.assertEqual(row_widths(["58%", "42%"]), ["58%", "42%"])
        self.assertEqual(row_widths([None, "60%", None]), ["20%", "60%", "20%"])
        self.assertEqual(row_widths([None, "100%"]), ["50%", "100%"])
        self.assertEqual(row_widths([None, "minmax(0,1fr)"]), [None, "minmax(0,1fr)"])
        self.assertEqual(row_widths([None, None]), [None, None])

    def test_vertical_stays_single_column_without_row_v(self):
        screen, blocks = self.fixture()
        self.assertIsNone(self.render(screen, blocks, "v").select_one(".row"))
        for b in blocks:
            b["row_v"] = True
        self.assertEqual(len(self.render(screen, blocks, "v").select(".row > .col")), 2)

    def test_explicit_vertical_alignment_survives_in_html_without_default(self):
        for value in ("start", "center", "end", None):
            screen, blocks = self.fixture()
            blocks[0]["row_valign"] = value
            row = self.render(screen, blocks).select_one(".row")
            self.assertEqual(row.get("data-row-valign"), value)
            self.assertEqual("mid" in row.get("class", []), value == "center")

    def test_conversion_preserves_short_layout_and_stacks_long_or_narrow_text(self):
        for body, steps, width, stacked in (("资料" * 30, "步骤" * 50, None, False),
                                            ("资料" * 400, "步骤" * 500, None, True),
                                            ("资料" * 100, "步骤" * 100, "20%", True),
                                            ("资料" * 10, "步骤" * 150, None, True)):
            screen, blocks = self.fixture(body, steps, width)
            text = screen["text"]
            vertical = copy.deepcopy(blocks)
            convert_page.fit_text_rows(blocks, convert_page.block_text_len(screen, blocks)[0])
            self.assertEqual([bool(b.get("row")) for b in blocks], [not stacked] * 3)
            if not stacked:
                self.assertEqual(blocks[0]["width"], "40%")
                self.assertNotIn("width", blocks[2])
            self.assertEqual(screen["text"], text)
            self.assertEqual(vertical[0]["width"], width)


if __name__ == "__main__":
    unittest.main()

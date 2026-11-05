"""Text preflight catches the three 10-20 row regressions and stale headings."""
import copy, json, sys, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'src/typeset'), str(ROOT / 'site-astro/tools')]
import convert_page as convert
from engine.content import bound_json
from engine.layout import assign_by_spec
from engine.parse import parse, original_markdown

class TextLayoutPreflightTests(unittest.TestCase):
    def test_three_previous_row_failures_and_repaired_rows(self):
        # 保留真实事故的字数比例；页面改稿不能把原反例悄悄变成均衡短卡。
        for kind, sizes in [('feature_card', [240, 30, 30]), ('flow', [200, 30, 30]), ('flow', [430, 60])]:
            with self.subTest(kind=kind, sizes=sizes):
                page, screen = {'page': 'row-fixture'}, {'id': 'row-fixture-01', 'text': '', 'anchors': []}
                block = {'type': kind, 'spec': {'columns': len(sizes), 'direction': 'horizontal', 'icons': 'none'},
                         'nodes': [{'type': 'steps', 'items': [{'n': i + 1, 'lead': f'卡{i}', 'text': '甲' * size} for i, size in enumerate(sizes)]}]}
                self.assertTrue(any('横排卡片正文失衡' in issue for issue in convert.check_text_layout(page, screen, [block])))
                repaired = copy.deepcopy(block)
                repaired['spec']['row_counts' if kind == 'feature_card' else 'item_rows'] = [1, len(sizes) - 1]
                if kind == 'feature_card': repaired['spec']['fill_first_row'] = True
                self.assertEqual(convert.check_text_layout(page, screen, [repaired]), [])

    def test_anchor_checks_ignore_markdown_but_catch_changed_title(self):
        screen = {'id': 'fixture', 'text': '## 经验按时写进文件\n\n正文还会提到旧说法：经验当场写进文件。', 'anchors': [{'id': 'p-experience', 'text': '经验按时写进文件'}]}
        self.assertEqual(convert.check_text_layout({}, screen, []), [])
        screen['anchors'][0]['text'] = '经验当场写进文件'
        self.assertIn('目录标题与正文不一致', convert.check_text_layout({}, screen, [])[0])
        screen.update(text='### 改了 MCP、Hook 或技能之后怎么验收', anchors=[{'id': 'p-check', 'text': '改了 MCP 之后怎么验收'}])
        self.assertEqual(convert.check_text_layout({}, screen, []), [])

if __name__ == '__main__': unittest.main()

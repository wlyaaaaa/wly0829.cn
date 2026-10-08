import html
import importlib.util
from pathlib import Path
import re
import sys
from types import SimpleNamespace
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src/typeset'))
spec = importlib.util.spec_from_file_location('feature_status_sort', ROOT / 'src/typeset/components/comp-hub/feature_status.py')
feature = importlib.util.module_from_spec(spec)
spec.loader.exec_module(feature)


class FeatureStatusSortTests(unittest.TestCase):
    def test_render_sorts_whole_cards_stably_and_preserves_groups_and_unknowns(self):
        ctx = SimpleNamespace(orient='h', min_font=24, screen={}, inline=lambda value: html.escape(str(value)),
                              warn=lambda *args: None, incomplete=lambda *args: None)
        states = ['已停用', '在用', '待验收', '在用', '待实施', '没用过', '说不准']
        nodes = [{'type': 'steps', 'items': [{'n': i + 1, 'lead': f'卡{i}', 'text': state}
                                            for i, state in enumerate(states)]},
                 {'type': 'group', 'name': '第二组'}, {'type': 'card', 'name': '未知卡', 'text': '状态未提供'},
                 {'type': 'card', 'name': '已停用卡', 'text': '已停用'},
                 {'type': 'card', 'name': '待验收卡', 'text': '待验收'}]
        rendered = feature.render_feature_card({'nodes': nodes, 'spec': {'icons': [f'file:///icon-{i}.png' for i in range(10)],
             'item_spans': {'3': 2}, 'status_display': 'text'}}, ctx)
        cards = re.findall(r'<article\b.*?</article>', rendered)
        self.assertEqual([re.search(r'卡\d+', card)[0] for card in cards[:7]], ['卡2', '卡1', '卡3', '卡4', '卡6', '卡5', '卡0'])
        self.assertEqual([re.search(r'data-feature-source-index="(\d+)"', card)[1] for card in cards[:7]], ['2', '1', '3', '4', '6', '5', '0'])
        self.assertTrue(all(re.search(rf'feature-number[^>]*>{index + 1}<', card) for index, card in zip([2, 1, 3, 4, 6, 5, 0], cards)))
        self.assertTrue(all(f'icon-{index}.png' in card for index, card in zip([2, 1, 3, 4, 6, 5, 0], cards)))
        self.assertIn('grid-column:span 2', cards[0])
        self.assertEqual([re.search(r'feature-name[^>]*>([^<]+)', card)[1] for card in cards[7:]], ['未知卡', '待验收卡', '已停用卡'])
        self.assertLess(rendered.index('卡0'), rendered.index('第二组'))


if __name__ == '__main__':
    unittest.main()

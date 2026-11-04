import copy
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'site-astro/tools'))
from convert_page import status_items


class StatusLineTests(unittest.TestCase):
    def test_note_keeps_only_date_and_short_source_without_mutating_input(self):
        for source in ('AI 使用记录', '来' * 16, '来' * 17, '',
                       '按 2026-10-12 的活动规则核对；本轮没有运行测试'):
            with self.subTest(source=source):
                value = {'state': '在用', 'last': {'at': '2026-11-03 08:31'},
                         'facts': ['近 7 天 AI 用了 14 次'],
                         'as_of': '2026-11-04 09:08', 'source': f' {source} '}
                before = copy.deepcopy(value)
                items, note = status_items(value)
                suffix = f' · {source}' if 0 < len(source) <= 16 else ''
                self.assertEqual(note, '截至 11 月 4 日' + suffix)
                self.assertIn('上次运行 11 月 3 日 08:31', items[0]['text'])
                self.assertEqual(items[1]['text'], value['facts'][0])
                self.assertEqual(value, before)

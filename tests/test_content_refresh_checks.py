import importlib.util
import json
from datetime import date
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('refresh_checks', Path(__file__).resolve().parents[1] / 'scripts/content-refresh/checks.py')
checks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checks)

class WritingChecksTest(unittest.TestCase):
    def audit(self, screens, kind='test', page='skill-old-tool'):
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, 'page.json').write_text(json.dumps({'screens': screens, 'kind': kind, 'page': page}), encoding='utf8')
            return checks.audit_pages(Path(directory), date(2026, 10, 10), ('old-tool',))

    def test_review_leads_and_visible_fields(self):
        result = self.audit([{'id': 'top', 'text': '当前 E251\n截至2026-10-02，3项\nE:\\demo\\file\n提交 5417b8b\nhttps://live.example.com/computer-access/state\n菜单\n[1] 读 [2] 写\n- **33次 ·22次**｜使用记录\nold-tool 现在能用', 'scene': 'E:\\ignored', 'screenshots': [{'caption': 'https://localhost:8000/api/state'}], 'card': {'tagline': 'E:\\visible', 'href': 'https://localhost:8000/'}}])
        codes = {row['code'] for row in result['findings']}
        self.assertEqual(codes, {'fixed-rule-version', 'stale-as-of', 'local-path', 'commit-id', 'interface-url', 'terminal-menu', 'multiple-card-numbers', 'retired-current-mention'})
        self.assertEqual(result['pages_checked'], 1)
        self.assertEqual(sum(row['code'] == 'local-path' for row in result['findings']), 2)
        self.assertTrue(all(row['line'] >= 1 and row['field'] != 'scene' for row in result['findings']))

    def test_history_dates_versions_and_ordinary_links_are_not_errors(self):
        result = self.audit([{'id': 'now', 'text': 'https://github.com/org/repo/commit/5417b8b\nhttps://www.example.com/product\n截至10月3日，3项\n- **Python 3.11 ·24项**｜截至2026-10-03\n- **E251 ·24项**｜第①组\n- **第1组 ·24项**｜统计\nold-tool 已退役，改名为 new-tool'}, {'id': 'past', 'section': 'evolution', 'text': '当前 E230\n截至9月28日，3项\nold-tool 当时能用'}])
        self.assertEqual(result['findings'], [])

    def test_date_range_uses_last_day(self):
        result = self.audit([{'id': 'top', 'text': '截至9月28日到10月3日，3项\n截至9月15–27日，3项\n截至10月4日：30项（6月30日起）'}])
        self.assertEqual([(row['code'], row['line']) for row in result['findings']], [('stale-as-of', 2)])

    def test_real_cards_without_bold_or_separator_and_powershell_versions(self):
        result = self.audit([{'id': 'top', 'text': '- **0.6 秒**　AI开工读取14个文件（11份规则、2份模板、1份记录）\n277 项｜210项安装\n- **24项**　PowerShell 5.1/7 与 PS 5.1\n1. 检查｜读2份，写3份'}])
        self.assertEqual([(row['code'], row['line']) for row in result['findings']], [('multiple-card-numbers', 1), ('multiple-card-numbers', 2)])

    def test_retired_skill_destination_is_not_an_active_claim(self):
        self.assertEqual(self.audit([{'id': 'top', 'text': 'old-tool 的能力现在由其他入口承接'}], 'skill-redirect')['findings'], [])
        self.assertEqual([row['code'] for kind, page in [('skill', 'skill-old-tool'), ('project', 'old-tool')] for row in self.audit([{'id': 'top', 'text': '一堆文件一起看'}], kind, page)['findings']], ['retired-current-entry', 'retired-current-entry'])
        self.assertTrue(all(not self.audit([{'id': 'top', 'text': '一堆文件一起看'}], kind, 'old-tool')['findings'] for kind in ('skill-redirect', 'frozen', 'history')))

if __name__ == '__main__':
    unittest.main()

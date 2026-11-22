from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import unittest

spec = spec_from_file_location('visible_text', Path(__file__).parents[1] / 'scripts/check-visible-text.py')
scan = module_from_spec(spec)
spec.loader.exec_module(scan)


class VisibleTextSemanticsTests(unittest.TestCase):
    def test_known_frozen_does_not_disqualify_missing_active(self):
        facts = scan.sample_facts({'data': {'total': 0, 'items': []}}, 'projects', {'state': ['frozen']})
        issues = scan.semantic_findings('/live/projects/', {'active': '在用的项目暂时读不到', 'frozen': '冻结的项目暂时读不到'}, facts, [])
        self.assertEqual([(item['kind'], item['text']) for item in issues], [('有数据却说读不到', '冻结的项目暂时读不到')])
        self.assertEqual(scan.semantic_findings('/live/projects/', {'head': '共 15 个冻结项目'}, facts, []), [])

    def test_known_decision_copy_and_internal_visible_words(self):
        for title in ('本版列出 47 个项目', '共 47 个项目'):
            issues = scan.semantic_findings('/projects/', {'catalog_total': title}, set(), [])
            self.assertEqual([item['kind'] for item in issues], ['已定意见回退'])
        live = scan.semantic_findings('/live/projects/', {'head': '共 47 个项目'}, set(), ['已回写读数', '“回写”'])
        self.assertEqual([item['kind'] for item in live], ['可见内部词'])
        self.assertEqual(scan.semantic_findings('/principles/', {}, set(), ['已回写读数']), [])

    def test_traffic_checks_overseas_scope_only_on_traffic_page(self):
        lines = ['今天海外流量 至少 13.2 GB', '近 24 小时全部网络流量估算']
        issues = scan.semantic_findings('/live/traffic/', {}, set(), lines)
        self.assertEqual([item['text'] for item in issues], [lines[1]])
        self.assertEqual(scan.semantic_findings('/live/traffic/', {}, set(), lines[:1]), [])
        self.assertEqual(scan.semantic_findings('/live/apps/', {}, set(), lines), [])

    def test_hosts_are_checked_in_display_and_source_with_nullable_counts(self):
        source = {'data': {'stats': {'days': [{'claude': 1, 'gpt': 2, 'other': 1}]}}}
        snapshot = {'chat_hosts': 'Claude Codex'}
        facts = scan.sample_facts(source, 'chats', {})
        self.assertEqual([item['kind'] for item in scan.semantic_findings('/live/chats/', snapshot, facts, [])], ['按宿主分家少一家'] * 2)
        source['data']['stats']['days'][0]['antigravity'] = None
        facts = scan.sample_facts(source, 'chats', {})
        self.assertEqual(scan.semantic_findings('/live/chats/', {'chat_hosts': 'Claude Codex Antigravity'}, facts, []), [])

    def test_rewrite_marker_requires_real_difference_for_same_field(self):
        def field(text, marked=False): return {'text': text, 'marked': marked}
        pages = [dict(path='/live/', role='本人版', issues=[], _fields={'same': field('相同'), 'changed': field('原句')}),
                 dict(path='/live/', role='公开版', issues=[], _fields={'same': field('相同', True), 'changed': field('新句', True)})]
        scan.compare_rewrites(pages)
        self.assertEqual([(item['kind'], item['text']) for item in pages[1]['issues']], [('原文一致却说改写', '相同')])
        self.assertNotIn('_fields', pages[0])


if __name__ == '__main__':
    unittest.main()

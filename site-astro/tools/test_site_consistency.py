import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import site_consistency as checks
from render_blocks import mark_frozen_links


class ConsistencyTests(unittest.TestCase):
    def test_frozen_group_follows_page_status_and_card_source(self):
        frozen_page = {'kind': 'frozen', 'status': '冻结', 'url': '/projects/old/', 'title': '旧项目',
                       'registry': {'frozen_card': {'reason': '依赖已经停用', 'now': '由新项目承担'}}}
        active = {'kind': 'project', 'status': '常用', 'url': '/projects/new/', 'title': '新项目'}
        home = {'registry': {'groups': [
            {'id': 'g-work', 'screen': 'heading-work', 'members': ['/projects/new/'],
             'cards': ['card-new']},
            {'id': 'g-frozen', 'screen': 'heading-frozen'}]},
            'screens': [{'id': 'intro'}, {'id': 'heading-work'}, {'id': 'card-new', 'shape': 'card',
              'text': '**〔新项目〕**　常用\n直达：〔进入〕',
              'links': [{'href': '/projects/new/'}]},
              {'id': 'heading-frozen'}, {'id': 'card-old', 'shape': 'card',
              'text': '**〔旧项目〕**　冻结\n直达：〔进入〕',
              'links': [{'href': '/projects/old/'}]}]}
        result = checks.project_directory(home, {'old': frozen_page, 'new': active})
        self.assertEqual(result['registry']['groups'][-1]['members'], ['/projects/old/'])
        self.assertEqual(result['registry']['groups'][-1]['cards'], ['card-old'])
        self.assertIn('停下原因：依赖已经停用', result['screens'][-1]['text'])
        self.assertNotIn('停下原因', home['screens'][-1]['text'])
        active['status'] = '冻结'
        active['registry'] = {'frozen_card': {'reason': '已合并', 'now': '由旧项目承担'}}
        moved = checks.project_directory(home, {'old': frozen_page, 'new': active})
        self.assertEqual(moved['registry']['groups'][0]['cards'], [])
        self.assertEqual(set(moved['registry']['groups'][-1]['members']),
                         {'/projects/new/', '/projects/old/'})
        self.assertIn('**〔新项目〕**　冻结', next(s['text'] for s in moved['screens'] if s['id'] == 'card-new'))

    def test_frozen_link_label_only_on_matching_anchor(self):
        html = ('<a href="/projects/old/#why">旧项目</a> '
                '<a href="https://wly0829.cn/projects/old/">同站绝对地址</a> '
                '<a href="https://elsewhere.invalid/projects/old/">外站</a> '
                '<a href="">空地址</a> '
                '<a href="/projects/new/">新项目</a>')
        output = mark_frozen_links(html, {'/projects/old/'})
        self.assertEqual(output.count('frozen-link-tag'), 2)
        self.assertIn('旧项目</a><span', output)
        self.assertIn('外站</a> ', output)
        self.assertIn('新项目</a>', output)

    def test_source_comparisons_keep_bundled_skills_separate(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp); page_dir = root / 'sources/pages'
            for name, obj in {'old': {'page': 'old', 'kind': 'frozen', 'status': '冻结',
                 'url': '/projects/old/', 'title': '旧项目', 'screens': [{'id': 'old-1', 'text': '旧项目'}]},
                 'new': {'page': 'new', 'kind': 'project', 'status': '常用',
                 'url': '/projects/new/', 'title': '新项目', 'screens': [{'id': 'new-1', 'text': '旧项目仍在用'}]},
                 'skill-old': {'kind': 'skill', 'url': '/skills/old/', 'screens': []},
                 'skill-pdf': {'kind': 'skill', 'url': '/skills/pdf/', 'screens': []}}.items():
                (page_dir/name).mkdir(parents=True)
                (page_dir/name/'page.json').write_text(json.dumps(obj), encoding='utf8')
            (root/'config').mkdir()
            (root/'config/panel-projects.json').write_text(json.dumps({'projects': [
                {'route': '/projects/old', 'source': {'repo': 'wlyaaaaa/old'}}]}), encoding='utf8')
            (root/'config/skill-site-exclusions.json').write_text(json.dumps({'excluded': {}}), encoding='utf8')
            (root/'scripts').mkdir()
            (root/'scripts/how-demo-data.json').write_text(json.dumps({'stories': [
                {'rows': [{'task': '核对文件', 'model': 'GPT-6 Luna · max'}]}]}), encoding='utf8')
            supply = root/'supply.json'; supply.write_text(json.dumps({'skills': [
                {'name': 'new', 'install': True}]}), encoding='utf8')
            roster = root/'roster.json'; roster.write_text(json.dumps({'updated_beijing_date': '2026-10-31',
              'hosts': {'codex': {'root_openai': {'dispatchable': [
                  {'model': 'gpt-6-luna'}]}}, 'claude': {'dispatchable': []}}}), encoding='utf8')
            rules = root/'rules.md'; rules.write_text('冻结名单只维护在这里。\n| 旧项目 | ' + chr(96) + 'old' + chr(96) + ' |\n## 三档维护', encoding='utf8')
            result = checks.audit(root, supply, roster, rules)
            self.assertEqual(result['skills']['missing'], ['new'])
            self.assertEqual(result['skills']['orphan'], ['old'])
            self.assertEqual(result['skills']['bundled'], ['pdf'])
            self.assertEqual(len(result['frozen_mentions']), 1)
            self.assertEqual(len(result['models']['mismatches']), 1)

    def test_publish_prune_keeps_pointer_and_three_recent(self):
        spec = importlib.util.spec_from_file_location('publish_site', HERE/'publish_site.py')
        module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp); pointer = base/'pointer.json'
            pointer.write_text(json.dumps({'commit': 'keep-old'}), encoding='utf8')
            for i in range(5):
                folder = base/f'publish-{i}'; folder.mkdir()
                (folder/'publish-receipt.json').write_text(json.dumps({
                    'commit': 'keep-old' if i == 0 else str(i)}), encoding='utf8')
            result = module.prune_publish_runs(base, pointer)
            self.assertEqual(len(result['kept']), 4)
            self.assertEqual(len(result['removed']), 1)
            self.assertTrue((base/'publish-0').exists())


if __name__ == '__main__':
    unittest.main()

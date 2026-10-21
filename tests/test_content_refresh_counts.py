"""项目身份与技能来源子集不能混入详情页总数。"""
from datetime import date
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts/content-refresh'))
import refresh
from checks import audit_pages


class CountScopeTests(unittest.TestCase):
    def test_projects_follow_enabled_identity_and_exclude_child_pages(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'config').mkdir()
            config = root / 'config/panel-projects.json'
            config.write_text(json.dumps({'projects': [
                {'id': 'github-index', 'enabled': True}, {'id': 'old', 'enabled': True},
                {'id': 'disabled', 'enabled': False}]}), encoding='utf-8')
            pages = [dict(page='github-local-index', kind='project', status='常用', public=True),
                     dict(page='module', kind='project', parent='github-local-index', status='常用'),
                     dict(page='old-child', kind='frozen', parent='old'),
                     dict(page='old', kind='frozen', public=False),
                     dict(page='disabled', kind='project')]
            method = dict(kind='page_count', kinds=['project', 'frozen'])
            with patch.object(refresh, 'pages', return_value=pages):
                self.assertEqual(refresh.retrieve(method, root, {}), 2)
                for filter_, expected in [({'status': '常用'}, 1), ({'public': True}, 1),
                                          ({'kinds': ['frozen']}, 1)]:
                    self.assertEqual(refresh.retrieve(dict(method, **filter_), root, {}), expected)
                self.assertEqual(refresh.retrieve({'kind': 'page_count'}, root, {}), 5)
                with self.assertRaises(ValueError):
                    refresh.retrieve(dict(method, project_scope='active_projects'), root, {})
                with self.assertRaises(ValueError):
                    refresh.retrieve(dict(kind='page_count', project_scope='active_projects'), root, {})
                self.assertEqual(refresh.retrieve(dict(method, kinds=['project'], project_scope='active_projects'), root, {}), 1)
                config.unlink()
                with self.assertRaises(FileNotFoundError):
                    refresh.retrieve(method, root, {})

    def test_scoped_skill_counts_leave_total_claims_checked(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for n in range(29):
                path = root / str(n)
                path.mkdir()
                (path / 'page.json').write_text(json.dumps({'kind': 'skill'}), encoding='utf-8')
            path = root / 'page.json'
            number = dict(id='n-skills', text='27 个', meaning='网站上展示的个人技能数')
            page = dict(page='agents', kind='project', registry={'numbers': [number]},
                        screens=[dict(id='top', text='个人技能有27个；这27个个人技能，加上一个插件包带的2个技能，技能合计29个。')])
            def mismatches():
                path.write_text(json.dumps(page, ensure_ascii=False), encoding='utf-8')
                return [f for f in audit_pages(root, date(2026, 10, 20))['findings'] if f['code'] == 'count-mismatch']
            self.assertEqual(mismatches(), [])
            page['screens'][0]['text'] = page['screens'][0]['text'].replace('合计29', '合计28')
            self.assertEqual(len(mismatches()), 1)
            page['screens'][0]['text'] = '29 个技能'
            page['registry']['numbers'] = [dict(id='n-skills', text='28 个', meaning='技能详情页总数')]
            self.assertEqual(len(mismatches()), 1)

    def test_personal_skill_binding_uses_registered_supply_scope(self):
        source = Path(__file__).resolve().parents[1] / 'sources/refresh/registry.json'
        rows = {r['id']: r for r in json.loads(source.read_text('utf-8-sig'))['records']}
        self.assertEqual(rows['agents-n-skills-0']['retrieve'],
                         rows['b7-agents-skills-plugins-personal-installed-count']['retrieve'])

"""Project totals exclude authored modules while module bindings remain usable."""
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src/typeset'))
from engine.content import bound_json


class ProjectSummaryModules(unittest.TestCase):
    def test_modules_without_project_metadata_do_not_enter_any_scale_total(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            pages = {
                'one': {'kind': 'project', 'status': '常用', 'public': True,
                        'registry': {'features': [{}]}},
                'two': {'kind': 'frozen', 'status': '冻结', 'public': False,
                        'registry': {'features': [{}, {}]}},
                'module': {'kind': 'project', 'parent': 'one', 'status': '偶尔用',
                           'title': 'Working module'},
                'frozen-module': {'kind': 'frozen', 'parent': 'two', 'status': '冻结'},
                'index': {'scale': '{{scale}}', 'module': '{{module.title}}'},
            }
            for name, page in pages.items():
                path = root / 'sources/pages' / name / 'page.json'
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(json.dumps(page), encoding='utf8')
            result = bound_json(root / 'sources/pages/index/page.json', root=root)
            self.assertEqual(result['scale'], {
                'common': 1, 'occasional': 0, 'frozen': 1, 'total': 2, 'in_use': 1,
                'public': 1, 'private': 1, 'features': 3, 'retired_features': 2,
            })
            self.assertEqual(result['module'], 'Working module')

    def test_missing_top_level_project_metadata_still_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            page = root / 'sources/pages/one/page.json'
            page.parent.mkdir(parents=True)
            page.write_text(json.dumps({'kind': 'project'}), encoding='utf8')
            index = root / 'index.json'
            index.write_text(json.dumps({'total': '{{scale.total}}'}), encoding='utf8')
            with self.assertRaisesRegex(KeyError, 'public'):
                bound_json(index, root=root)

if __name__ == '__main__':
    unittest.main()

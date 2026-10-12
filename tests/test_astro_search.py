"""Refreshing search content preserves existing positions and record identities."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('astro_search_tests', ROOT/'site-astro/tools/build_runtime.py')
runtime = importlib.util.module_from_spec(spec); spec.loader.exec_module(runtime)

class AstroSearchTests(unittest.TestCase):
    def test_refresh_replaces_in_place_removes_stale_and_appends_new(self):
        with tempfile.TemporaryDirectory() as workspace:
            root = Path(workspace); route = '/projects/localocr/'
            source = root/'sources/pages/localocr/page.json'; source.parent.mkdir(parents=True)
            source.write_text(json.dumps({'url': route, 'page': 'localocr', 'title': 'Current', 'screens': [
                {'id': 'a', 'title': 'Renamed', 'text': 'New <text>'},
                {'id': 'new', 'title': 'Added', 'text': 'Added text'}]}), encoding='utf8')
            page = root/'projects/localocr/index.html'; page.parent.mkdir(parents=True)
            page.write_text('<div id="top"></div><div id="a"></div><div id="new"></div>', encoding='utf8')
            search = root/'search/index.html'; search.parent.mkdir(parents=True); search.write_text('<script src="/search-projects.js"></script>', encoding='utf8')
            manifest = root/'site-astro/sources/frozen-site/manifest.json'; manifest.parent.mkdir(parents=True); manifest.write_text('{}', encoding='utf8')
            skill_route = '/skills/example/'
            skill_source = root/'sources/pages/example/page.json'; skill_source.parent.mkdir(parents=True)
            skill_source.write_text(json.dumps({'url': skill_route}), encoding='utf8')
            record = lambda kind, href: {'type': kind, 'href': href, 'detail': 'Old'}
            kept = record('页面', '/kept/'); tail = record('页面', '/tail/')
            a = record('项目内容', route+'#a'); gone = record('项目内容', route+'#gone')
            other = record('项目内容', '/projects/other/#a')
            before = {'search-index.js': [kept, record('项目', route+'#top'), tail, record('Skill', skill_route), record('系统组成', route+'#top')],
                'search-projects.js': [a, other, gone], 'search-project-localocr.js': [a, gone]}
            for rel, rows in before.items():
                (root/rel).write_text('window.index='+json.dumps(rows)+';', encoding='utf8')
            previous = {'oss': {'objects': {rel: {'url': '/old/'+rel} for rel in before}}}
            with patch.object(runtime, 'ROOT', root), patch.object(runtime, 'SITE', root/'site-astro'), patch.object(runtime.subprocess, 'check_output', return_value=json.dumps({skill_route: ['ordinary request', 'ordinary request']})):
                runtime.sync_search(root, previous, {route: {}, skill_route: {}}, {}, {route})
            after = {rel: runtime.nav.search_records((root/rel).read_text('utf8')) for rel in before}
            expected = {'search-index.js': ['/kept/', route+'#top', '/tail/', skill_route],
                'search-projects.js': [route+'#a', other['href'], route+'#new'],
                'search-project-localocr.js': [route+'#a', route+'#new']}
            for rel, hrefs in expected.items():
                self.assertEqual([row['href'] for row in after[rel]], hrefs, rel)
            self.assertEqual([after['search-index.js'][0], after['search-index.js'][2]], [kept, tail])
            self.assertEqual(after['search-index.js'][3]['aliases'], ['ordinary request'])
            self.assertEqual(after['search-projects.js'][1], other)
            for rel in ('search-projects.js', 'search-project-localocr.js'):
                self.assertEqual(after[rel][0]['title'], 'Current · Renamed')
                self.assertEqual(after[rel][0]['detail'], 'New <text>')
                self.assertEqual(after[rel][0]['search'], '')

if __name__ == '__main__': unittest.main()

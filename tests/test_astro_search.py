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
    def test_search_budget_overrun_warns_without_rewriting_or_failing(self):
        with tempfile.TemporaryDirectory() as workspace:
            root = Path(workspace)
            payload = b'window.index="complete searchable text";'
            for name in ('search-index.js', 'search-projects.js', 'search-project-demo.js'):
                (root/name).write_bytes(payload)
            policy = {key + '_gzip_budget_kib': 0.001 for key in
                      ('search_index', 'project_search_index', 'project_search_shard')}
            with patch.object(runtime, 'read', return_value={'refresh_policy': policy}), patch('builtins.print') as output:
                result = runtime.search_budget_review(root)
            self.assertEqual(len(result), 3)
            self.assertEqual(output.call_count, 3)
            for name, row in result.items():
                self.assertEqual(row['status'], 'warning')
                self.assertGreater(row['gzip_bytes'], row['review_bytes'])
                self.assertEqual((root/name).read_bytes(), payload)

    def test_wire_roundtrip_preserves_unicode_and_literal_markers(self):
        rows = [{'detail': '😀ABCΣ', 'search': value} for value in ('😀abcΣtail', '\x01dliteral😀', '\x01sliteral', '')]
        wire = runtime.search_wire(rows, encode=True)
        self.assertEqual(runtime.search_wire(wire), rows)
        self.assertEqual(runtime.search_wire(runtime.search_wire(wire), encode=True), wire)
        code = 'globalThis.window={__WLY_PROJECT_SEARCH_INDEX__:' + json.dumps(wire) + '};' + runtime.search_wire_loader()
        code += runtime.search_wire_loader() + 'console.log(JSON.stringify(window.__WLY_PROJECT_SEARCH_INDEX__));'
        self.assertEqual(json.loads(runtime.subprocess.check_output(['node', '-e', code], encoding='utf8')), rows)

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
            skill_source.write_text(json.dumps({'url': skill_route, 'search_aliases': ['ordinary request', 'ordinary request']}), encoding='utf8')
            record = lambda kind, href: {'type': kind, 'href': href, 'detail': 'Old'}
            kept = record('页面', '/kept/'); tail = record('页面', '/tail/')
            a = record('项目内容', route+'#a'); gone = record('项目内容', route+'#gone')
            other = record('项目内容', '/projects/other/#a')
            before = {'search-index.js': [kept, record('项目', route+'#top'), tail, record('Skill', skill_route), record('系统组成', route+'#top')],
                'search-projects.js': [a, other, gone], 'search-project-localocr.js': [a, gone]}
            for rel, rows in before.items():
                (root/rel).write_text('window.index='+json.dumps(rows)+';', encoding='utf8')
            previous = {'oss': {'objects': {rel: {'url': '/old/'+rel} for rel in before}}}
            with patch.object(runtime, 'ROOT', root), patch.object(runtime, 'SITE', root/'site-astro'):
                inputs = runtime.sync_search(root, previous, {route: {}}, {}, {route})
                data = json.loads(source.read_text('utf8')); data['layout'] = {'columns': 2}
                source.write_text(json.dumps(data), encoding='utf8')
                self.assertEqual(runtime.sync_search(root, previous, {route: {}}, {}, {route}), inputs)
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

    def test_refresh_rebuilds_only_existing_affected_project_shards(self):
        with tempfile.TemporaryDirectory() as workspace:
            root = Path(workspace); route = '/projects/demo/phone-recovery/'
            source = root/'sources/pages/demo/page.json'; source.parent.mkdir(parents=True)
            source.write_text(json.dumps({'url': route, 'page': 'demo', 'title': 'Current', 'screens': [
                {'id': 'a', 'title': 'Use', 'text': 'Current package and folder behavior'}]}), encoding='utf8')
            hidden = root/'sources/pages/hidden/page.json'; hidden.parent.mkdir(parents=True)
            hidden.write_text(json.dumps({'url': '/hidden/', 'kind': 'github-profile'}), encoding='utf8')
            page = root/'projects/demo/phone-recovery/index.html'; page.parent.mkdir(parents=True)
            page.write_text('<div id="top"></div><div id="a"></div>', encoding='utf8')
            search = root/'search/index.html'; search.parent.mkdir(parents=True)
            search.write_text('<script src="/search-projects.js"></script>', encoding='utf8')
            manifest = root/'site-astro/sources/frozen-site/manifest.json'; manifest.parent.mkdir(parents=True)
            manifest.write_text('{}', encoding='utf8')
            stale = {'type': '项目内容', 'projectSlug': 'demo', 'href': route+'#gone', 'detail': 'Retired'}
            kept = {'type': '项目内容', 'projectSlug': 'other', 'href': '/projects/other/', 'detail': 'Keep'}
            before = {'search-index.js': [{'type': '页面', 'href': '/hidden/', 'detail': 'Noindex'}], 'search-projects.js': [stale, kept],
                      'search-project-localocr.js': [], 'search-project-demo.js': [stale],
                      'search-project-other.js': [kept]}
            for rel, rows in before.items():
                (root/rel).write_text('window.__WLY_PROJECT_SEARCH_INDEX__='+json.dumps(rows)+';', encoding='utf8')
            unrelated = (root/'search-project-other.js').read_bytes()
            html_before = page.read_bytes()
            previous = {'oss': {'objects': {rel: {'url': '/old/'+rel} for rel in before}}}
            with patch.object(runtime, 'ROOT', root), patch.object(runtime, 'SITE', root/'site-astro'):
                runtime.sync_search(root, previous, {route: {}, '/hidden/': {}, '/old/': {'destination': route}}, {}, set())
            main = runtime.search_wire(runtime.nav.search_records((root/'search-projects.js').read_text('utf8')))
            shard = runtime.nav.search_records((root/'search-project-demo.js').read_text('utf8'))
            self.assertEqual(shard, [row for row in main if row.get('projectSlug') == 'demo'])
            self.assertEqual([row['href'] for row in shard], [route+'#a'])
            self.assertEqual(shard[0]['detail'], 'Current package and folder behavior')
            self.assertIn(kept, main)
            self.assertFalse(any(row['href'] == '/hidden/' for row in runtime.nav.search_records((root/'search-index.js').read_text('utf8'))))
            self.assertEqual(page.read_bytes(), html_before)
            self.assertEqual((root/'search-project-other.js').read_bytes(), unrelated)
            self.assertFalse((root/'search-project-phone-recovery.js').exists())

if __name__ == '__main__': unittest.main()

"""Generated Markdown updates remain automatic; genuine body edits survive."""
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('markdown_sync_build', ROOT / 'scripts/build-site.py')
build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)

class MarkdownSyncTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='markdown-sync-', dir=os.environ.get('TEMP'))
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name); self.site = self.root / 'site-astro'
        self.source = self.root / 'sources/pages/fixture/page.json'
        self.source.parent.mkdir(parents=True)
        self.md = self.site / 'src/content/pages/fixture.md'
        self.page = {'title': 'Fixture', 'kind': 'fixture', 'url': '/fixture/',
                     'screens': [{'id': 'fixture-01', 'text': 'Initial body.\n\n"converted_at_beijing": "body-example"'}]}
        self.write_page()
        converter = build.load('markdown_sync_converter', 'site-astro/tools/convert_page.py')
        for key, value in {'REPO': str(self.root), 'OUT_MD': str(self.md.parent),
                           'OUT_PUBLIC': str(self.site / 'public'), '_lib': {}}.items():
            setattr(converter, key, value)
        self.converter = converter
        # Use the real converter and fingerprint logic, without an Astro build.
        for key, value in {'ROOT': self.root, 'SITE': self.site, 'HASH_CACHE': {}}.items():
            self.enterContext(patch.object(build, key, value))
        self.enterContext(patch.object(build, 'load', return_value=converter))
        def run(*args, **kwargs):
            for name in args[2:]: converter.convert(name)
        self.runner = self.enterContext(patch.object(build, 'run', side_effect=run))
        self.enterContext(patch.dict(os.environ, {'CONVERT_NO_STATUS_FIRST': '1'}))
        self.enterContext(patch.object(build.sys, 'path', [str(ROOT / 'src/typeset'), str(ROOT / 'site-astro/tools'), *build.sys.path]))
        converter.convert('fixture')
        self.previous = self.sync({})
    def write_page(self):
        self.source.write_text(json.dumps(self.page), encoding='utf8')
    def change_page(self, text):
        self.page['screens'][0]['text'] = text; self.write_page()
    def sync(self, previous):
        with contextlib.redirect_stdout(io.StringIO()) as output:
            records = build.sync_markdown(previous)
        self.messages = output.getvalue()
        return records

    def test_external_conversion_does_not_disable_next_json_only_update(self):
        self.change_page('Converted update.'); self.converter.convert('fixture')
        records = self.sync(self.previous)
        self.assertFalse(records['fixture']['direct'])
        self.assertIn('Converted update.', self.md.read_text('utf8'))
        self.assertNotIn('保留直接编辑', self.messages)
        self.runner.assert_not_called()
        self.change_page('Next JSON-only update.')
        records = self.sync(records)
        self.assertFalse(records['fixture']['direct'])
        self.assertIn('Next JSON-only update.', self.md.read_text('utf8'))
        self.runner.assert_called_once()

    def test_manual_body_edit_with_valid_source_sha_is_preserved(self):
        self.md.write_text(self.md.read_text('utf8').replace('"converted_at_beijing": "body-example"',
                                                          '"converted_at_beijing": "manual-example"'), encoding='utf8')
        manual = self.md.read_bytes()
        with patch.object(self.converter, 'convert', side_effect=ValueError('fixture failure')):
            failed = self.sync(self.previous)
        self.assertTrue(failed['fixture']['direct'])
        self.assertIn('无法核对转换来源', self.messages)
        self.assertEqual(self.md.read_bytes(), manual)
        records = self.sync(self.previous)
        self.assertTrue(records['fixture']['direct'])
        self.assertIn('保留直接编辑', self.messages)
        self.change_page('JSON must not overwrite manual work, nor vanish silently.')
        with self.assertRaisesRegex(ValueError, '到不了网页：fixture'):
            self.sync(records)
        self.assertEqual(self.md.read_bytes(), manual)
        self.runner.assert_not_called()

    def test_layout_only_conversion_and_stale_direct_flag_are_recognized(self):
        layout = [{'screen': 'fixture-01', 'orientation': 'h',
                   'blocks': [{'type': 'text', 'text_ref': 'Initial body.'}]}]
        (self.source.parent / 'layout.json').write_text(json.dumps(layout), encoding='utf8')
        self.converter.convert('fixture')
        self.previous['fixture']['direct'] = True
        self.md.write_text(self.md.read_text('utf8').replace(
            build.markdown_frontmatter(self.md)['source']['converted_at_beijing'], '2000-01-01T00:00:00+08:00'), encoding='utf8')
        records = self.sync(self.previous)
        self.assertFalse(records['fixture']['direct'])
        self.assertNotIn('保留直接编辑', self.messages)
        self.assertFalse((self.site / 'public').exists())
        self.assertEqual(self.converter.OUT_MD, str(self.md.parent))
        self.assertEqual(self.converter.OUT_PUBLIC, str(self.site / 'public'))
        self.runner.assert_not_called()

    def test_unchanged_manual_body_skips_conversion_but_inputs_invalidate(self):
        self.md.write_text(self.md.read_text('utf8') + '\nManual body.', encoding='utf8')
        records = self.sync(self.previous)
        with patch.object(build, 'converted_markdown_matches', wraps=build.converted_markdown_matches) as check:
            records = self.sync(records); check.assert_not_called()
            script = self.site / 'tools/convert_page.py'; script.parent.mkdir(parents=True)
            script.write_text('# converter changed', encoding='utf8')
            records = self.sync(records); self.assertEqual(check.call_count, 1)
            self.assertTrue(records['fixture']['direct']); self.assertIn('保留直接编辑', self.messages)
            (self.source.parent / 'layout.json').write_text('[]', encoding='utf8')
            with self.assertRaisesRegex(ValueError, '到不了网页：fixture'): self.sync(records)
            self.assertEqual(check.call_count, 2)
        self.assertIn('Manual body.', self.md.read_text('utf8'))

if __name__ == '__main__': unittest.main()

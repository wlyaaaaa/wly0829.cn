"""A conversion audit stamp must not trigger browser layout work."""
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'site-astro/tools'))
import render_blocks as renderer
from render_cache import legacy_renderer_compatible, markdown_render_sha, promote_legacy_cache


class TypesetCacheTests(unittest.TestCase):
    def test_verified_legacy_cache_is_promoted_once(self):
        self.assertTrue(legacy_renderer_compatible(renderer.__file__))
        cache = {'old': {'html': 'measured'}, 'newer': {'html': 'current'}}
        jobs = [{'key': 'new', 'legacy_key': 'old'},
                {'key': 'newer', 'legacy_key': 'old'},
                {'key': 'missing', 'legacy_key': 'gone'}]
        self.assertEqual(promote_legacy_cache(cache, jobs), 1)
        self.assertEqual(cache['new']['html'], 'measured')
        self.assertEqual(cache['newer']['html'], 'current')

    def test_timestamp_body_and_engine_across_269_pages(self):
        with tempfile.TemporaryDirectory(prefix='typeset-cache-') as folder:
            root = Path(folder)
            pages = sorted((ROOT / 'site-astro/src/content/pages').glob('*.md'))
            self.assertEqual(len(pages), 269)
            md_before = [markdown_render_sha(page) for page in pages]
            # Use the actual converted Markdown fingerprints. The browser-key
            # checks below use one fixture screen per page without launching Chrome.
            lib = renderer.library_fingerprint()
            docs = [f'<main>{page.stem}</main>' for page in pages]
            before = [renderer.screen_cache_key(doc, 'h', lib) for doc in docs]
            original = pages[0].read_text('utf8')
            head, body = original.split('\n---\n', 1)
            metadata = json.loads(head[4:])
            self.assertIn('converted_at_beijing', metadata['source'])
            candidate = root / 'one.md'
            candidate.write_text(original, encoding='utf8')
            old_md = markdown_render_sha(candidate)
            metadata['source']['converted_at_beijing'] = '2099-01-01T00:00:00+08:00'
            candidate.write_text('---\n' + json.dumps(metadata, ensure_ascii=False) + '\n---\n' + body, encoding='utf8')
            self.assertEqual(markdown_render_sha(candidate), old_md)
            md_after = md_before.copy(); md_after[0] = markdown_render_sha(candidate)
            self.assertEqual(sum(a != b for a, b in zip(md_before, md_after)), 0)

            candidate.write_text(candidate.read_text('utf8') + '\n正文变化', encoding='utf8')
            self.assertNotEqual(markdown_render_sha(candidate), old_md)
            md_after[0] = markdown_render_sha(candidate)
            self.assertEqual(sum(a != b for a, b in zip(md_before, md_after)), 1)
            changed_docs = docs.copy(); changed_docs[0] += '<p>正文变化</p>'
            body_keys = [renderer.screen_cache_key(doc, 'h', lib) for doc in changed_docs]
            self.assertEqual(sum(a != b for a, b in zip(before, body_keys)), 1)

            engine = root / 'engine.py'; engine.write_text('layout = 1', encoding='utf8')
            with patch.object(renderer, 'PROTO', str(root)):
                old_engine = renderer.library_fingerprint()
                engine.write_text('layout = 2', encoding='utf8')
                new_engine = renderer.library_fingerprint()
            self.assertNotEqual(old_engine, new_engine)
            engine_before = [renderer.screen_cache_key(doc, 'h', old_engine) for doc in docs]
            engine_after = [renderer.screen_cache_key(doc, 'h', new_engine) for doc in docs]
            self.assertEqual(sum(a != b for a, b in zip(engine_before, engine_after)), 269)

            hydration_before = renderer.hydration_fingerprint()
            with patch.object(renderer, 'HYDRATE_JS', renderer.HYDRATE_JS + '\n// layout change'):
                self.assertNotEqual(renderer.hydration_fingerprint(), hydration_before)


if __name__ == '__main__':
    unittest.main()

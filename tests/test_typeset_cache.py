"""A conversion audit stamp must not trigger browser layout work."""
import json
from pathlib import Path
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import MagicMock, patch


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'site-astro/tools'))
import render_blocks as renderer
import render_cache
from render_cache import markdown_render_sha, screen_input, screen_cache_key, bundle_assets, restore_assets


class TypesetCacheTests(unittest.TestCase):
    def test_success_survives_later_failure_and_interruption(self):
        with tempfile.TemporaryDirectory(prefix='typeset-resume-') as folder:
            browser = MagicMock()
            browser.new_page.return_value.evaluate.side_effect = [
                {'html': 'measured'}, RuntimeError('failed screen'), KeyboardInterrupt]
            playwright = MagicMock()
            playwright.__enter__.return_value.chromium.launch.return_value = browser
            module = SimpleNamespace(sync_playwright=lambda: playwright)
            jobs = [{'key': str(i), 'screen': str(i), 'o': 'h', 'html': 'local.html'} for i in range(3)]
            with patch.dict(sys.modules, {'playwright.sync_api': module}):
                with self.assertRaises(KeyboardInterrupt):
                    renderer.hydrate(jobs, {}, folder)
                cache = {}
                renderer.recover_cache(cache, folder)
                self.assertEqual(list(cache), ['0'])
                self.assertEqual(cache['0']['html'], 'measured')
                remaining = [job for job in jobs if job['key'] not in cache]
                browser.new_page.return_value.evaluate.side_effect = [{'html': 'ok'}] * 2
                self.assertEqual(len(renderer.hydrate(remaining, {}, folder)), 2)
                renderer.recover_cache(cache, folder)
                self.assertEqual(set(cache), {'0', '1', '2'})
                path = Path(folder, '0.json')
                with patch.object(renderer.os, 'replace', side_effect=OSError('interrupted write')):
                    with self.assertRaises(OSError):
                        renderer.write_cache(path, {'html': 'partial'})
                self.assertEqual(json.loads(path.read_text('utf8'))['html'], 'measured')
                self.assertFalse(list(Path(folder).glob('*.tmp')))

    def test_portable_resource_capture_and_restore(self):
        with tempfile.TemporaryDirectory(prefix='portable-cache-') as folder:
            root = Path(folder); work = root / 'measure'; public = root / 'public'
            image = root / 'title image.png'; image.write_bytes(b'image pixels')
            font = root / 'font.ttf'; font.write_bytes(b'font bytes')
            css = root / 'base.css'; css.write_text('a{background:url("title image.png")}@font-face{src:url("font.ttf")}', encoding='utf8')
            document = f'<link href="{css.as_uri()}"><img src="{image.as_uri()}" data-title-src="{image}">'
            with patch.multiple(renderer, WORK=str(work), PUB=str(public), IMPORT_ROOT=str(root)):
                portable = renderer.portable_document(document)
                self.assertNotIn('file:///', portable); self.assertNotIn(str(root), portable)
                self.assertEqual(len(list((work / '_inputs').iterdir())), 3)
                result = renderer.cache_payload({'html': portable.split('>')[1] + '>', 'titles': []})
                self.assertNotIn(str(root), json.dumps(result))
                self.assertIn('data-title-src="/assets/', result['html'])
                font_url = '/assets/_fonts/page.woff2'
                (public / font_url.lstrip('/')).parent.mkdir(parents=True, exist_ok=True)
                (public / font_url.lstrip('/')).write_bytes(b'subset font')
                bundle_assets(result, [font_url], work, public, renderer.sha)
                restored = root / 'new checkout' / 'public'
                restore_assets(result, work, restored, renderer.sha)
                for url, checksum in result['assets'].items():
                    self.assertEqual(renderer.sha(restored / url.lstrip('/')), checksum)
                (work / '_assets' / font_url.lstrip('/')).write_bytes(b'corrupt')
                with self.assertRaises(ValueError): restore_assets(result, work, root / 'empty', renderer.sha)

    def test_migration_rejects_changed_input_and_repeats_without_measuring(self):
        with tempfile.TemporaryDirectory(prefix='migrate-cache-') as folder:
            root = Path(folder); source = root / 'source'; site = source / 'site-astro'
            work = site / '.cache/blocks'; work.mkdir(parents=True)
            renderer.write_cache(work / '_cache.json', {'old': {'html': 'measured'}})
            renderer.write_cache(work / '_index.json', {'page/one-h': {'key': 'old', 'input_key': 'new'},
                                                       'page/two-h': {'key': 'old', 'input_key': 'changed'}})
            urls = {'font': '/assets/font.woff2', 'css': '/assets/style.css', 'loader': '/assets/load.js'}
            for url in urls.values():
                path = site / 'public' / url.lstrip('/'); path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(b'fixture')
            renderer.write_cache(site / 'src/content/rendered/page.json',
                                 {**urls, 'screens': [{'id': 'one', 'h': {'html': 'measured'}}]})
            jobs = [{'page': 'page', 'screen': sid, 'o': 'h', 'key': key}
                    for sid, key in [('one', 'new'), ('two', 'reject')]]
            cache = {}
            with patch.multiple(renderer, WORK=str(root / 'work'), PUB=str(root / 'public')):
                with patch.object(renderer, 'hydrate', side_effect=AssertionError('must not measure')):
                    self.assertEqual(render_cache.migrate_cache(source, jobs, cache, renderer), 1)
                    self.assertEqual(render_cache.migrate_cache(source, jobs, cache, renderer), 0)
            self.assertEqual(set(cache), {'new'})
            self.assertEqual(set(cache['new']['assets']), set(urls.values()))

    def test_timestamp_body_and_engine_across_current_pages(self):
        with tempfile.TemporaryDirectory(prefix='typeset-cache-') as folder:
            root = Path(folder)
            pages = sorted((ROOT / 'site-astro/src/content/pages').glob('*.md'))
            md_before = [markdown_render_sha(page) for page in pages]
            def key(text, page=None, assets=('pixels',), fonts=('font bytes',), root=ROOT):
                content = screen_input({'screen': {'id': 'one'}}, text, page or {}, assets, fonts, root)
                return screen_cache_key(content, 'h')
            before = [key(page.stem) for page in pages]
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
            body_keys = before.copy(); body_keys[0] = key(pages[0].stem + '正文变化')
            self.assertEqual(sum(a != b for a, b in zip(before, body_keys)), 1)
            self.assertEqual(key('x', {'based_on': 'old'}), key('x', {'based_on': 'new'}))
            self.assertEqual(key('x', {'image': str(ROOT / 'art.png')}), key('x', {'image': str(root / 'art.png')}, root=root))
            self.assertNotEqual(key('x'), key('x', assets=('changed pixels',)))
            self.assertNotEqual(key('x'), key('x', fonts=('changed font bytes',)))
            self.assertNotEqual(key('x'), key('x', {'title': 'changed setting'}))
            with patch.object(renderer, 'HYDRATE_JS', renderer.HYDRATE_JS + '\n// layout change'):
                self.assertEqual(key(pages[0].stem), before[0])
            with patch.dict(render_cache.VERSIONS, typeset=2):
                self.assertNotEqual(key(pages[0].stem), before[0])


if __name__ == '__main__':
    unittest.main()

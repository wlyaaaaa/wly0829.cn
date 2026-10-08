import importlib.util
import os
from pathlib import Path
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch
spec = importlib.util.spec_from_file_location('cache_builder', Path(__file__).resolve().parents[1]/'scripts/build-assembled-site.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
class ReleaseAssetCacheTests(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp(prefix='release-cache-', dir=os.environ.get('TEMP')))
        self.cache = self.root/'cache'
        environment = patch.dict(os.environ, WLY_RELEASE_ASSET_CACHE=str(self.cache))
        environment.start()
        self.addCleanup(environment.stop)
    def test_reuse_and_candidate_replacement_preserve_baseline_and_source(self):
        source, first, second = [self.root/name for name in ('source.webp', 'baseline.webp', 'candidate.webp')]
        source.write_bytes(b'original binary')
        builder.copy_release_asset(source, first)
        builder.copy_release_asset(source, second)
        original_blob = self.cache/builder.sha(first)
        self.assertTrue(os.path.samefile(first, second))
        builder.copy_release_asset(source, first)
        self.assertFalse(list(self.root.glob('*.writing')))
        source.write_bytes(b'changed binary')
        builder.copy_release_asset(source, second)
        self.assertEqual(len(list(self.cache.iterdir())), 2)
        self.assertEqual(first.read_bytes(), b'original binary')
        self.assertTrue(os.path.samefile(first, original_blob))
        self.assertEqual(second.read_bytes(), b'changed binary')

    def test_text_and_live_hardware_remain_independent(self):
        for rel in ('a.svg', 'a.html', 'a.js', 'a.json', 'a.css', 'release-manifest.json', 'live-hardware/assets/a.webp'):
            source = self.root/rel
            source.parent.mkdir(parents=True, exist_ok=True)
            source.write_bytes(b'independent')
            target = self.root/('output-'+source.name)
            builder.copy_release_asset(source, target)
            self.assertFalse(os.path.samefile(source, target))
            target.write_bytes(b'local change')
            self.assertEqual(source.read_bytes(), b'independent')
        self.assertFalse(self.cache.exists())

    def test_gallery_original_png_bypasses_encoding_and_keeps_exact_bytes(self):
        spec = importlib.util.spec_from_file_location('gallery_asset_builder', Path(__file__).resolve().parents[1]/'scripts/build-typeset-site.py')
        gallery = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(gallery)
        source = self.root/'original.png'
        original = Path(__file__).resolve().parents[1]/'public/media/ai-cli-profile-manager/01-desktop-qwen38-codex-harness.png'
        source.write_bytes(original.read_bytes())
        candidate = self.root/'candidate'
        with patch.object(gallery, 'encode_png', side_effect=AssertionError('Original gallery images must not be encoded')):
            url = gallery.asset(source, candidate, 'screenshots', preserve_original=True)
        self.assertTrue(url.endswith('.png'))
        self.assertEqual((candidate/url.lstrip('/')).read_bytes(), original.read_bytes())

    def test_concurrent_cache_creation_is_complete_and_corruption_is_rejected(self):
        source = self.root/'source.png'
        source.write_bytes(b'complete binary'*1000)
        targets = [self.root/(str(i)+'.png') for i in range(6)]
        with ThreadPoolExecutor(max_workers=6) as pool:
            list(pool.map(lambda target: builder.copy_release_asset(source, target), targets))
        self.assertTrue(all(os.path.samefile(targets[0], target) for target in targets))
        blob = self.cache/builder.sha(source)
        blob.write_bytes(b'corrupt')
        with self.assertRaisesRegex(ValueError, 'cache is corrupt'):
            builder.copy_release_asset(source, self.root/'rejected.png')
        self.assertEqual(blob.read_bytes(), b'corrupt')

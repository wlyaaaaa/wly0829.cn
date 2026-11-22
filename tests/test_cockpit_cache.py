"""Boundary checks for the retained B2 cache patch."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
_cache_spec = importlib.util.spec_from_file_location('cockpit_cache', ROOT / 'scripts' / 'prepare-cockpit-cache.py')
c = importlib.util.module_from_spec(_cache_spec)
_cache_spec.loader.exec_module(c)


class PreparationTests(unittest.TestCase):
    # 原 test_exact_html_bundle_manifest_delta 已移除：它给 site-release/cockpit/index.html 引用的 B2 运行件打缓存补丁并核对发布差量。
    # 现行驾驶舱成品里没有 B2 运行件（10-11、10-12 两次完整构建的 dist/cockpit/index.html 都不含 b2-typeset），
    # prepare() 要求恰好一个这样的引用，对现行成品已无可做；缓存补丁本身仍被 update-live-release.py 用于授权页的 B2 运行件，下面继续守住它的拒绝条件。
    def test_refuse_unknown_runtime_and_overlapping_output(self):
        with self.assertRaisesRegex(ValueError, 'anchor'):
            c.patch_cockpit_cache('void 0;')
        with tempfile.TemporaryDirectory() as tmp:
            release = Path(tmp) / 'release'
            release.mkdir()
            with self.assertRaisesRegex(ValueError, 'overlap'):
                c.prepare(release, release / 'candidate')
            busy = Path(tmp) / 'busy'
            busy.mkdir()
            (busy / 'left-over').write_text('x', encoding='utf8')
            with self.assertRaisesRegex(ValueError, 'empty'):
                c.prepare(release, busy)

"""Focused pure-transform regressions for live fixes and parallel patch composition."""
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
RELEASE = Path(__import__('os').environ.get('WLY_TEST_RELEASE_ROOT', ROOT/'site-release'))
spec = importlib.util.spec_from_file_location('live_update', ROOT / 'scripts' / 'update-live-release.py')
live_update = importlib.util.module_from_spec(spec)
spec.loader.exec_module(live_update)


class LiveRelease(unittest.TestCase):
    def test_shared_fix_is_idempotent_and_preserves_other_owners(self):
        source = (RELEASE / __import__('re').search(r'(?:src|data-src)="([^\"]*/app-[a-f0-9]+\.js)"', (RELEASE/'cockpit/index.html').read_text('utf8'))[1].lstrip('/')).read_text('utf8')
        source = '/* navigation-owner-before */\n' + source + '\n/* navigation-owner-after */'
        once = live_update.patch_shared_runtime(source)
        self.assertEqual(once, live_update.patch_shared_runtime(once))
        self.assertTrue(once.startswith('/* navigation-owner-before */'))
        self.assertTrue(once.endswith('/* navigation-owner-after */'))
        # One independent live parser and one fitting function remain; the
        # surrounding app still contains its real navigation/viewer routines.
        self.assertEqual(once.count("window.SiteLiveRuntime=helpers"), 1)
        self.assertEqual(once.count('function displayTypesetStatus('), 1)
        self.assertIn('window.SiteImageViewer', once)
        self.assertIn('function layout()', once)

    def test_b2_model_import_survives_rehashing(self):
        source = (RELEASE / __import__('re').search(r'(?:src|data-src)="([^\"]*b2-typeset-[a-f0-9]+\.js)"', (RELEASE/'cockpit/index.html').read_text('utf8'))[1].lstrip('/')).read_text('utf8')
        fixed = live_update.patch_b2_runtime(source)
        self.assertLess(fixed.index('const restoreReading=', fixed.index('function render(){')), fixed.index('relayTodayRiver();', fixed.index('function render(){')))
        self.assertEqual(*[__import__('re').search(r"from ['\"]([^'\"]*b2-access-model[^'\"]*\.js)['\"]", text)[1] for text in (source, fixed)])
        self.assertIn('function syncChildren(', fixed)
        self.assertEqual(fixed, live_update.patch_b2_runtime(fixed))


if __name__ == '__main__':
    unittest.main()

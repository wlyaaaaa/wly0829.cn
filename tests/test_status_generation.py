import hashlib
from pathlib import Path
from runpy import run_path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
PATCH = run_path(str(ROOT / 'scripts/update-live-release.py'))


class StatusGeneration(unittest.TestCase):
    def test_reader_replacement_preserves_other_script_owners(self):
        seeds = [ROOT / 'site-astro/sources/frozen-site/assets/_typeset/runtime/app-0463d07a1622127bbfd6.js',
                 ROOT / 'site-astro/sources/retained-home-cockpit/assets/67a6ffcb373105b3b0682497d81378dfc54d1edc6fb460fdd4db880e3a9059b7.js',
                 ROOT / 'site-astro/sources/retained-home-cockpit/assets/81536f6407de92bd959f9bfefebe0a0fd8f8066e7fd9f39bc8182fe70cef8fd9.js']
        current = (ROOT / 'scripts/site-live-runtime.js').read_text('utf8').rstrip()
        transport = current[current.index('const readTimeoutMs='):current.index('async function retryStatus(')]
        for path in seeds:
            source = path.read_text('utf8')
            start = source.index('const readTimeoutMs=', source.index(PATCH['LIVE_START'])); end = source.index('async function retryStatus(', start)
            updated = PATCH['patch_status_reader'](source)
            self.assertEqual(updated, source[:start] + transport + source[end:])
            self.assertEqual(updated, PATCH['patch_status_reader'](updated))
        self.assertEqual(PATCH['patch_status_reader']('/* unrelated runtime */'), '/* unrelated runtime */')

    def test_legacy_upgrade_preserves_the_next_script_closure(self):
        source = (ROOT / 'site-astro/sources/frozen-site/assets/_typeset/runtime/app-17fb264ac190451a427e.js').read_text('utf8')
        start = source.index(PATCH['LIVE_START'])
        end = source.index('})()', source.index('window.SiteStatus=', start)) + len('})()')
        current = (ROOT / 'scripts/site-live-runtime.js').read_text('utf8').rstrip().removesuffix(';')
        updated = PATCH['patch_status_reader'](source)
        self.assertEqual(updated, source[:start] + current + source[end:])
        self.assertEqual(updated, PATCH['patch_status_reader'](updated))

    def test_stutter_uses_current_reader_and_content_hash(self):
        import sys
        sys.path.insert(0, str(ROOT / 'scripts'))
        with tempfile.TemporaryDirectory() as folder:
            result = run_path(str(ROOT / 'scripts/prepare-stutter-page.py'))['prepare'](ROOT / 'dist', Path(folder) / 'out')
            reader = (ROOT / 'scripts/site-live-runtime.js').read_bytes()
            relative = 'cockpit/stutter/assets/site-live-runtime-' + hashlib.sha256(reader).hexdigest()[:20] + '.js'
            self.assertEqual((Path(result['output']) / relative).read_bytes(), reader)


if __name__ == '__main__': unittest.main()

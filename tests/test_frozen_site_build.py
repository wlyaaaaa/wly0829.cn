"""The one-command artifact contains every retained and native route."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class CompleteBuildTests(unittest.TestCase):
    def test_complete_site_has_312_html_files_and_all_registered_routes(self):
        snapshot = json.loads((ROOT / 'site-astro/sources/frozen-site/manifest.json').read_text('utf8'))
        dist = ROOT / 'dist'
        self.assertEqual(len(list(dist.rglob('*.html'))), 312)
        for route in snapshot['routes']:
            rel = 'index.html' if route == '/' else route.lstrip('/') if route.endswith('.html') else route.strip('/') + '/index.html'
            self.assertTrue((dist / rel).is_file(), route)

if __name__ == '__main__': unittest.main()

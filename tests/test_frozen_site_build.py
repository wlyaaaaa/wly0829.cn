"""The one-command artifact contains every retained and native route."""
import json
import re
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

    def test_complete_artifact_has_no_old_aliyun_release_addresses(self):
        snapshot = (ROOT / 'site-astro/sources/frozen-site/manifest.json').read_text('utf8')
        prefixes = {url.encode() for url in re.findall(r'https://[^/]*\.aliyuncs\.com/releases/[^/"\s]+/', snapshot)}
        prefixes |= {b'releases/' + url.split(b'/releases/', 1)[1] for url in prefixes}
        for path in (ROOT / 'dist').rglob('*'):
            if path.is_file():
                raw = path.read_bytes()
                self.assertFalse(any(prefix in raw for prefix in prefixes), str(path))

if __name__ == '__main__': unittest.main()

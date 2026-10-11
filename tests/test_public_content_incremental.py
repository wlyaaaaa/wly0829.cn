"""Incremental public scans reuse only passed unchanged bytes and policy."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]

class PublicContentIncrementalTests(unittest.TestCase):
    def test_cache_change_policy_deletion_and_full(self):
        with tempfile.TemporaryDirectory(prefix='public-incremental-') as folder:
            root = Path(folder); script = root / 'scripts/verify-public-content.mjs'
            script.parent.mkdir(); shutil.copyfile(ROOT / 'scripts/verify-public-content.mjs', script)
            (root / '.gitignore').write_text('site-astro/.cache/\ndist/\n')
            (root / 'dist').mkdir(); (root / 'dist/index.html').write_text('<title>fixture</title>')
            (root / 'dist/app.js').write_text('const fixture = true;')
            subprocess.run(['git', 'init', '--quiet'], cwd=root, check=True, capture_output=True)
            def scan(*args):
                result = subprocess.run(['node', str(script), '--incremental', *args], cwd=root,
                    capture_output=True, text=True, encoding='utf8')
                self.assertTrue(result.stdout, result.stderr)
                return result.returncode, json.loads(result.stdout)
            self.assertEqual(scan()[1]['scan_mode'], 'full')
            self.assertEqual(scan()[1]['scanned_file_count'], 0)
            cache = root / 'site-astro/.cache/public-content.json'
            for source in [root / 'safe.txt', root / 'dist/safe.bin']:
                source.write_text('A' * 28); self.assertEqual(scan()[1]['scanned_file_count'], 1)
                passed = cache.read_bytes(); before = source.stat(); source.write_text('gh' + 'p_' + 'A' * 24)
                os.utime(source, ns=(before.st_atime_ns, before.st_mtime_ns))
                self.assertNotEqual(scan()[0], 0); self.assertEqual(cache.read_bytes(), passed)
                source.unlink(); self.assertEqual(scan()[0], 0)
            rule = root / 'sources/rules/AGENTS.md'; rule.parent.mkdir(parents=True); rule.write_text('Rule v2')
            self.assertEqual(scan()[1]['scan_mode'], 'full')
            self.assertEqual(scan()[1]['scan_mode'], 'incremental')
            script.write_text(script.read_text() + '\n'); self.assertEqual(scan()[1]['scan_mode'], 'full')
            self.assertEqual(scan('--full')[1]['scan_mode'], 'full')
            cache.write_text('{invalid'); self.assertEqual(scan()[1]['scan_mode'], 'full')

if __name__ == '__main__': unittest.main()

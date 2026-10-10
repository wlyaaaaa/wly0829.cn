"""Selected home/cockpit inputs rebuild without ignored local artifacts."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'site-astro'


class FrozenHomeTests(unittest.TestCase):
    def setUp(self):
        self.workspace = tempfile.TemporaryDirectory(prefix='home-frozen-', dir=os.environ['TEMP'])
        self.addCleanup(self.workspace.cleanup)
        self.site = Path(self.workspace.name) / 'site-astro'
        self.snapshot = self.site / 'sources/retained-home-cockpit'
        shutil.copytree(SOURCE / 'sources/retained-home-cockpit', self.snapshot)
        (self.site / 'tools').mkdir()
        for name in ('home_firstpaint.py', 'retain_home_cockpit.py'):
            shutil.copyfile(SOURCE / 'tools' / name, self.site / 'tools' / name)
        self.pin = json.loads((self.snapshot / 'manifest.json').read_text('utf8'))
        for relative, row in self.pin['bundled'].items():
            if row['source'].startswith('../../public/'):
                target = self.site / 'public' / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(SOURCE / 'public' / relative, target)
        self.engine_relative = next(relative for relative in self.pin['bundled'] if 'home-firstpaint-' in relative)
        self.engine = self.site / 'public' / self.engine_relative

    def run_restore(self):
        return subprocess.run([sys.executable, str(self.site / 'tools/retain_home_cockpit.py')],
            cwd=self.site, text=True, encoding='utf8', capture_output=True)

    def test_clean_versioned_inputs_restore_exact_selected_pages_and_engine(self):
        self.assertFalse((self.site / 'src/chrome/retained').exists())
        self.assertFalse(self.engine.exists())
        result = self.run_restore()
        self.assertEqual(result.returncode, 0, result.stderr)
        for page in self.pin['pages']:
            actual = (self.site / 'src/chrome/retained' / (page + '.html')).read_bytes()
            self.assertEqual(actual, (self.snapshot / (page + '.html')).read_bytes())
            self.assertEqual(hashlib.sha256(actual).hexdigest(), self.pin['pages'][page]['sha256'])
        row = self.pin['bundled'][self.engine_relative]
        self.assertEqual(self.engine.read_bytes(), (self.snapshot / row['source']).read_bytes())
        self.assertEqual(hashlib.sha256(self.engine.read_bytes()).hexdigest(), row['sha256'])
        self.assertEqual((self.site / 'src/chrome/retained/manifest.json').read_bytes(), (self.snapshot / 'manifest.json').read_bytes())
        # 没有复制全部素材；入口恢复只生成有版本来源的运行件。
        self.assertFalse((self.site / 'public/_shared').exists())

    def test_ignored_published_engine_cannot_replace_missing_versioned_source(self):
        row = self.pin['bundled'][self.engine_relative]
        self.engine.parent.mkdir(parents=True, exist_ok=True)
        self.engine.write_bytes((self.snapshot / row['source']).read_bytes())
        (self.snapshot / row['source']).unlink()
        result = self.run_restore()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('home-firstpaint-', result.stderr)
        self.assertFalse((self.site / 'src/chrome/retained').exists())

    def test_same_size_changed_versioned_engine_is_rejected(self):
        source = self.snapshot / self.pin['bundled'][self.engine_relative]['source']
        raw = source.read_bytes(); source.write_bytes(raw[:-1] + (b' ' if raw[-1:] != b' ' else b'\n'))
        result = self.run_restore()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('首帧脚本字节不同', result.stderr)

    def test_postpatch_pages_and_old_inputs_are_distinct_and_bound(self):
        for page in ('home', 'cockpit'):
            self.assertNotEqual(self.pin['pages'][page], self.pin['inputs'][page])
        source = self.snapshot / 'home.html'; raw = source.read_bytes()
        source.write_bytes(raw[:-1] + (b' ' if raw[-1:] != b' ' else b'\n'))
        result = self.run_restore()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('冻结页面的字节不同', result.stderr)

    def test_authorization_remains_exact_and_rejects_same_size_source_change(self):
        original = (ROOT / 'site-release/computer-access/index.html').read_bytes()
        self.assertEqual((self.snapshot / 'computer-access.html').read_bytes(), original)
        source = self.snapshot / 'computer-access.html'
        source.write_bytes(original[:-1] + (b' ' if original[-1:] != b' ' else b'\n'))
        result = self.run_restore()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('冻结页面的字节不同：computer-access', result.stderr)

    def test_routes_finalizer_preserves_authorization_and_updates_owned_page(self):
        original = (self.snapshot / 'computer-access.html').read_bytes()
        dist = self.site / 'dist'; access = dist / 'computer-access/index.html'
        access.parent.mkdir(parents=True); access.write_bytes(original)
        owned = dist / 'index.html'
        owned.write_text('<script id="album-page">{"images":[]}</script><link href="/_album/routes-0123456789abcdef0123.json"><link href="https://old.example/releases/old/_album/routes-0123456789abcdef0123.json">', encoding='utf8')
        result = subprocess.run([sys.executable, str(self.site / 'tools/retain_home_cockpit.py'), '--finalize'], cwd=self.site, text=True, encoding='utf8', capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(access.read_bytes(), original)
        self.assertNotIn('routes-0123456789abcdef0123.json', owned.read_text('utf8'))
        self.assertNotIn('https://old.example/releases/old/', owned.read_text('utf8'))
        self.assertEqual(owned.read_text('utf8').count(json.loads(result.stdout)['resource']), 2)


if __name__ == '__main__':
    unittest.main()

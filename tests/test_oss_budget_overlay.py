"""Deployment budget and exact overlay fixtures; no network or publication."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import unittest
import uuid

ROOT = Path(__file__).resolve().parents[1]


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


h = load('budget_hybrid', ROOT/'scripts/hybrid-release.py')
oss = load('budget_oss', ROOT/'scripts/prepare-oss-release.py')


class OssBudgetOverlayTests(unittest.TestCase):
    def setUp(self):
        # Fixtures stay in the task TEMP for recycle-bin cleanup after the run.
        self.root = Path(os.environ.get('TEMP', ROOT/'.test-tmp'))/('budget-test-'+uuid.uuid4().hex)
        self.root.mkdir(parents=True)
        self.source = self.make_source('source')

    def put(self, root, relative, body):
        path = root/relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
        return path

    def refresh(self, source):
        files = h.inventory(source)
        manifest = {'schema': 'wly.hybrid-release.v1',
            'release_id': hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest(),
            'files': files, 'baseline_files': {}, 'routes': ['/', '/404.html'],
            'accepted_pages': {'/': {}, '/404.html': {}}}
        h.write(source/h.MANIFEST, manifest)
        return manifest

    def make_source(self, name, payload=b'x'*200_000, extra=None):
        source = self.root/name
        source.mkdir()
        for rel, body in {'index.html': b'<h1>Ordinary fixture</h1><script src="/assets/app.js"></script>',
                '404.html': b'<h1>Missing page</h1>', 'CNAME': b'wly0829.cn\n',
                'assets/app.js': b'window.fixture = true;', 'assets/payload.bin': payload,
                **(extra or {})}.items():
            self.put(source, rel, body)
        self.refresh(source)
        return source













    def overlay(self):
        original = self.source/'index.html'
        after = self.put(self.root/'overlay-assets', 'index.html', b'<h1>Prepared homepage</h1>')
        entry = {'kind': 'integrated_preparation', 'source_path': str(after),
                 'before': {'sha256': h.digest(original), 'bytes': original.stat().st_size},
                 'after': {'sha256': h.digest(after), 'bytes': after.stat().st_size}}
        path = self.root/'overlay.json'
        h.write(path, {'schema': 'wly.typeset-release-overlay.v1', 'files': {'index.html': entry}})
        return path, entry

    def test_integrated_preparation_uses_exact_source_and_baseline(self):
        path, entry = self.overlay()
        self.assertEqual(h.load_overlay(path, self.source)['files']['index.html'], entry)
        for field in ('before', 'after'):
            with self.subTest(field=field):
                bad = json.loads(path.read_text('utf8'))
                bad['files']['index.html'][field]['sha256'] = '0'*64
                h.write(path, bad)
                with self.assertRaisesRegex(ValueError, 'Overlay (source changed|baseline differs)'):
                    h.load_overlay(path, self.source)
                path, entry = self.overlay()
        Path(entry['source_path']).write_bytes(b'changed source body')
        with self.assertRaisesRegex(ValueError, 'Overlay source changed'):
            h.load_overlay(path, self.source)

    def test_integrated_overlay_cannot_cover_accepted_page(self):
        path, _ = self.overlay()
        overlay = h.load_overlay(path, self.source)
        with self.assertRaisesRegex(ValueError, 'overlaps a rebuilt page'):
            h.assemble(self.source, self.source, self.root/'overlap-output',
                       h.read(self.source/h.MANIFEST), {'/': {}}, overlay=overlay)


if __name__ == '__main__':
    unittest.main()

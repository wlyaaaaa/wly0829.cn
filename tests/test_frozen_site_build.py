"""A warm public directory cannot hide changed frozen sources or damaged copies."""
import importlib.util
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('frozen_build_tests', ROOT / 'scripts/build-site.py')
build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)


class FrozenBuildTests(unittest.TestCase):
    def test_fresh_and_warm_restoration_reject_source_drift_and_repair_copy_damage(self):
        with tempfile.TemporaryDirectory(dir=os.environ['TEMP']) as temporary:
            repo = Path(temporary); site = repo / 'site'; package = site / 'sources/frozen-site'
            source = repo / 'runtime.js'; source.write_bytes(b'old')
            page = package / 'pages/module/index.html'; page.parent.mkdir(parents=True)
            page.write_bytes(b'<p>Complete frozen module.</p>')
            snapshot = {'assets': {'runtime.js': {**build.proof(source), 'source_path': 'runtime.js'}},
                        'pages': {'module/index.html': build.proof(page)}}
            with patch.object(build, 'ROOT', repo), patch.object(build, 'SITE', site), patch.object(build, 'SNAPSHOT', package):
                build.restore(snapshot)
                self.assertEqual((site / 'public/module/index.html').read_bytes(), page.read_bytes())
                copy = site / 'public/runtime.js'; copy.write_bytes(b'bad')
                build.restore(snapshot); self.assertEqual(copy.read_bytes(), b'old')
                source.write_bytes(b'new')
                with self.assertRaisesRegex(ValueError, 'Asset source differs'):
                    build.restore(snapshot)
                source.write_bytes(b'old'); page.write_bytes(b'<p>Changed frozen module!</p>')
                with self.assertRaisesRegex(ValueError, 'Frozen page changed'):
                    build.restore(snapshot)


if __name__ == '__main__':
    unittest.main()

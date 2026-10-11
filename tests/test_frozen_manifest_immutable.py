"""Frozen dependencies survive changes to their authoring source."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('vendor_frozen_assets', ROOT / 'site-astro/tools/vendor_frozen_assets.py')
vendor = importlib.util.module_from_spec(spec); spec.loader.exec_module(vendor)


class ImmutableManifestTests(unittest.TestCase):
    def test_current_manifest_only_reuses_originals_or_author_exceptions(self):
        vendor.migrate(ROOT, check=True)

    def fixture(self, root, raw=b'frozen'):
        import hashlib
        source = root / 'sources/rules/AGENTS.md'
        source.parent.mkdir(parents=True); source.write_bytes(raw)
        row = {'source_path': 'sources/rules/AGENTS.md', 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}
        manifest = root / 'site-astro/sources/frozen-site/manifest.json'
        manifest.parent.mkdir(parents=True)
        manifest.write_text(json.dumps({'assets': {'_typeset/rule-sources/test.md': row}, 'pages': {}}), encoding='utf-8')
        return source, manifest, row

    def test_source_change_does_not_affect_restore_and_migration_is_idempotent(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary); source, manifest, _ = self.fixture(root)
            self.assertEqual(vendor.migrate(root)['migrated'], 1)
            before = manifest.read_bytes(); source.write_bytes(b'changed')
            spec = importlib.util.spec_from_file_location('frozen_restore_test', ROOT / 'scripts/build-site.py')
            build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)
            with patch.object(build, 'ROOT', root), patch.object(build, 'SITE', root / 'site-astro'), \
                 patch.object(build, 'SNAPSHOT', manifest.parent), patch.object(build, 'HASH_CACHE', {}):
                build.restore(json.loads(manifest.read_text('utf-8')))
            self.assertEqual((root / 'site-astro/public/_typeset/rule-sources/test.md').read_bytes(), b'frozen')
            self.assertEqual(vendor.migrate(root)['migrated'], 0)
            self.assertEqual(manifest.read_bytes(), before)

    def test_drift_fails_without_writing_and_published_recovery_checks_hash(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary); source, manifest, row = self.fixture(root)
            source.write_bytes(b'drift'); before = manifest.read_bytes()
            with self.assertRaisesRegex(ValueError, 'No published object'):
                vendor.migrate(root, published_manifest={})
            self.assertEqual(manifest.read_bytes(), before)
            self.assertFalse((root / 'site-astro/sources/vendor-deps').exists())
            from io import BytesIO
            published = {'oss': {'objects': {'_typeset/rule-sources/test.md': {'url': 'https://example.test/frozen'}}}}
            with patch.object(vendor, 'urlopen', return_value=BytesIO(b'wrong')):
                with self.assertRaisesRegex(ValueError, 'Published bytes differ'):
                    vendor.migrate(root, published_manifest=published)
            with patch.object(vendor, 'urlopen', return_value=BytesIO(b'frozen')):
                self.assertEqual(vendor.migrate(root, published_manifest=published)['recovered'], ['_typeset/rule-sources/test.md'])


if __name__ == '__main__':
    unittest.main()

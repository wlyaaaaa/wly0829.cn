"""Published resource identities survive an empty worktree output directory."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('published_runtime', ROOT / 'site-astro/tools/build_runtime.py')
runtime = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runtime)


class PublishedManifestTests(unittest.TestCase):
    def test_published_wins_and_unpublished_new_resources_survive(self):
        prior = {'oss': {'objects': {'shared.js': {'key': 'local'}, 'new.js': {'key': 'new'}}}}
        published = {'release_id': 'accepted', 'oss': {'asset_base_url': 'https://example.test',
                     'objects': {'shared.js': {'key': 'published'}}}}
        oss, source, release = runtime.previous_resources(prior, published)
        self.assertEqual(oss['objects'], {'shared.js': {'key': 'published'}, 'new.js': {'key': 'new'}})
        self.assertEqual((source, release), ('published', 'accepted'))
        self.assertEqual(prior['oss']['objects']['shared.js']['key'], 'local')

    def test_shared_record_and_missing_record(self):
        with tempfile.TemporaryDirectory() as temp, patch.object(runtime.retention, 'shared', return_value=Path(temp)):
            self.assertEqual(runtime.published_manifest(), {})
            (Path(temp) / 'published.json').write_text(json.dumps({'manifest': {'release_id': 'accepted'}}), encoding='utf8')
            self.assertEqual(runtime.published_manifest(), {'release_id': 'accepted'})

    def test_no_published_record_falls_back_to_dist_or_none(self):
        with patch('builtins.print') as output:
            self.assertEqual(runtime.previous_resources({'release_id': 'local', 'oss': {'objects': {}}}, {}),
                             ({'objects': {}}, 'dist', 'local'))
            self.assertEqual(runtime.previous_resources({}, {}), ({}, 'none', None))
        self.assertEqual(output.call_count, 2)


if __name__ == '__main__':
    unittest.main()

"""Focused same-bucket origin migration; no network, upload or browser."""
import copy
import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'scripts'))
import oss_origins as origins
def load(name, path):
    spec = importlib.util.spec_from_file_location(name, ROOT/path)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module); return module
oss = load('ipv6_oss', 'scripts/prepare-oss-release.py')
publisher = load('ipv6_publish', 'site-astro/tools/publish_site.py')
transport = load('ipv6_transport', 'scripts/same-origin-runtime.py')
network = load('ipv6_network', 'scripts/verify-oss-browser-network.py')
OLD, NEW = origins.aliases('https://'+origins.MAIN_BUCKET+'.cn-shanghai.oss.aliyuncs.com')

class OriginMigrationTests(unittest.TestCase):
    def test_new_target_csp_and_old_replay(self):
        for base in (OLD, NEW): self.assertEqual(oss.validate_target(base, 'releases/v'), (base, 'releases/v'))
        text = f'<meta http-equiv="Content-Security-Policy" content="img-src \'self\'"><img src="{OLD}/releases/v/photo.png">'.encode()
        current = oss.Rewriter({'photo.png': {}}, NEW, 'releases/v', 'https://wly0829.cn', version=8)
        actual = current.rewrite(text, 'index.html').decode()
        self.assertIn(NEW+'/releases/v/photo.png', actual); self.assertIn("img-src 'self' "+NEW, actual)
        legacy = oss.Rewriter({'photo.png': {}}, NEW, 'releases/v', 'https://wly0829.cn', version=7)
        self.assertIn(OLD, legacy.rewrite(text, 'index.html').decode())
        foreign = ('<img src="'+NEW+'/external.png">').encode()
        self.assertEqual(legacy.rewrite(foreign, 'index.html'), foreign)
        self.assertEqual(current.rewrite(('const p={origins:["'+OLD+'"]};').encode(), 'retry.js').decode(), 'const p={origins:["'+NEW+'"]};')
        self.assertIn('releases/v/photo.png', current.absolute_references)
        self.assertTrue(network.declared_oss_static(foreign, 'index.html', {'oss': {'asset_base_url':NEW, 'prefix':'releases/v', 'rewriter_version':8}}))

    def test_frozen_copy_bare_origin_downloads_and_rollback(self):
        text = json.dumps({'origins': [OLD], 'download': OLD+'/notes.md', 'other': OLD+'.example/a.png'})
        migrated = origins.rewrite_origins(text, NEW)
        self.assertIn(NEW+'/notes.md', migrated); self.assertIn(OLD+'.example', migrated)
        unrelated = OLD.replace('https://', 'https://evil-'); self.assertEqual(origins.rewrite_origins(unrelated, NEW), unrelated)
        self.assertEqual(origins.rewrite_origins(migrated, OLD), text)
        for base in (OLD, NEW):
            self.assertEqual(transport.localize(base+'/releases/v/photo.png', {'runtime_urls': {}}), '/photo.png')
        self.assertFalse(origins.same_bucket('https://other.cn-shanghai.oss.aliyuncs.com', NEW))

    def test_address_change_requires_new_readback_without_upload(self):
        row = {'key': 'releases/v/photo.png', 'url': OLD+'/releases/v/photo.png', 'sha256': 'a'*64}
        previous = {'asset_base_url': OLD, 'objects': {'photo.png': row}}
        original = copy.deepcopy(previous); current = origins.rebase_previous(previous, NEW)
        self.assertEqual(previous, original); self.assertEqual(current['objects']['photo.png']['key'], row['key'])
        self.assertEqual(set(publisher.delta(current['objects'], previous['objects'])), {'photo.png'})
        self.assertEqual(publisher.delta(current['objects'], previous['objects'], include_url=False), {})

    def test_small_offline_build_keeps_binary_keys_and_is_repeatable(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary); source = root/'source'; source.mkdir()
            (source/'index.html').write_text('<img src="/photo.png"><script src="/app.js"></script>', encoding='utf8')
            (source/'app.js').write_bytes(b'window.fixture=true;'); (source/'photo.png').write_bytes(b'opaque test image')
            files = oss.inventory(source); manifest = {'schema': 'wly.hybrid-release.v1', 'release_id': 'fixture', 'files': files}
            oss.write(source/oss.MANIFEST, manifest)
            old = oss.prepare(source, OLD, 'releases/old', root/'old', offline=True)
            manifest['previous_oss'] = oss.read(root/'old/github'/oss.MANIFEST)['oss']; oss.write(source/oss.MANIFEST, manifest)
            one = oss.prepare(source, NEW, 'releases/new', root/'one', offline=True)
            two = oss.prepare(source, NEW, 'releases/new', root/'two', offline=True)
            self.assertEqual(one['objects'], two['objects']); self.assertEqual(one['release_id'], two['release_id'])
            self.assertEqual(one['objects']['photo.png']['key'], old['objects']['photo.png']['key'])
            self.assertTrue(all(row['url'].startswith(NEW+'/') for row in one['objects'].values()))
            self.assertEqual(one['retained_objects'], {}); oss.verify_local(root/'one')

"""Hash reuse keeps real changed-content failures; transport is fixture-only."""
import importlib.util
import json
import os
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module


h = load('speed_hybrid', ROOT/'scripts/hybrid-release.py')
p = load('speed_readback', ROOT/'scripts/prepare-typeset-release.py')
fixture = load('speed_oss_fixture', ROOT/'tests/test_oss_release.py')


class PublicationSpeedTests(unittest.TestCase):
    def setUp(self):
        fixture.OssReleaseTests.setUp(self)
        self.put('index.html', '<script src="/assets/main.js"></script><a href="/projects/demo/#anchor">demo</a>')
        self.put('projects/demo/index.html', '<h1 id="anchor">Original page</h1>')
        self.put('404.html', '<h1>Missing page</h1>'); self.put('assets/main.js', 'void 1;')
        self.refresh(); self.counter = 0
        self.previous = self.root/'previous-content.json'; h.validate_content(self.source, self.previous)

    def put(self, relative, body):
        target = self.source/relative; target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(body, encoding='utf8')

    def refresh(self):
        files = h.inventory(self.source)
        self.manifest = {'schema':'wly.hybrid-release.v1', 'release_id':h.fingerprint(files), 'files':files,
            'routes':[h.file_route(rel) for rel in files if rel.endswith('.html')],
            'accepted_pages':{'/':{}, '/projects/demo/':{}, '/404.html':{}}, 'baseline_files':{}, 'release_overlay':{}}
        h.write(self.source/h.MANIFEST, self.manifest)

    def check(self, previous=None):
        self.counter += 1
        with patch.object(h.builder, 'validate', wraps=h.builder.validate) as scan:
            result = h.validate_content(self.source, self.root/('content-'+str(self.counter)+'.json'), previous_report=previous)
        return result, scan.call_args.kwargs.get('verified_files') or {}

    def test_matching_content_reuses_files_but_keeps_complete_inventory(self):
        result, retained = self.check(self.previous)
        self.assertIn('index.html', retained); self.assertEqual(result['output_files'], h.inventory(self.source) | {
            h.MANIFEST:{'sha256':h.digest(self.source/h.MANIFEST), 'bytes':(self.source/h.MANIFEST).stat().st_size}})

    def test_new_credential_is_blocked_after_a_pass(self):
        self.put('assets/main.js', 'const value="'+('sk-'+'X'*24)+'";'); self.refresh()
        with self.assertRaisesRegex(ValueError, 'content gate failed'): self.check(self.previous)

    def test_manifest_changes_scan_and_invalid_previous_checksum_runs_full(self):
        self.manifest['rollback_ref'] = 'metadata'; h.write(self.source/h.MANIFEST, self.manifest)
        result, retained = self.check(self.previous)
        self.assertNotIn(h.MANIFEST, retained)
        data = h.read(self.previous); data['output_files_sha256'] = '0'*64; h.write(self.previous, data)
        self.assertFalse(self.check(self.previous)[1])

    def test_checker_change_and_full_switch_scan_every_file(self):
        with patch.object(h, 'checker_version', return_value='0'*64):
            self.assertFalse(self.check(self.previous)[1])
        with patch.dict(os.environ, {'WLY_RELEASE_FULL':'1'}):
            self.assertFalse(self.check(self.previous)[1])

    def test_missing_target_and_removed_anchor_still_block(self):
        target = self.source/'projects/demo/index.html'
        self.put('projects/demo/index.html', '<h1>Anchor removed</h1>'); self.refresh()
        with self.assertRaisesRegex(ValueError, 'content gate failed'): self.check(self.previous)
        target.rename(self.root/'removed-target.html'); self.refresh()
        with self.assertRaisesRegex(ValueError, 'content gate failed'): self.check(self.previous)

    def online(self, previous=None, retry=None, bad_identity=False):
        self.counter += 1; output = self.root/('online-'+str(self.counter)+'.json')
        args = SimpleNamespace(release=self.source, output=output, previous_report=previous, retry_report=retry)
        def fetch(relative, *unused):
            if relative == 'release-identity.json':
                return json.dumps({'release_id':'wrong' if bad_identity else self.manifest['release_id'], 'manifest_sha256':p.digest(self.source/h.MANIFEST)}).encode()
            target = self.source/relative
            return (target/'index.html' if target.is_dir() else target).read_bytes()
        with patch.object(p, 'fetch_bytes', side_effect=fetch) as transport:
            result = p.readback(args)
        return result, [call.args[0] for call in transport.call_args_list], output

    def test_readback_reuses_only_valid_fingerprints_and_full_bypasses_reuse(self):
        first, unused, old = self.online(); current, calls, unused = self.online(old)
        self.assertEqual(current['checks'], first['checks']); self.assertEqual(calls, ['release-identity.json'])
        self.put('assets/main.js', 'void 2;'); self.refresh()
        current, calls, unused = self.online(old)
        self.assertEqual(current['retried_files'], 1); self.assertIn('assets/main.js', calls)
        with patch.dict(os.environ, {'WLY_RELEASE_FULL':'1'}):
            current, calls, unused = self.online(old)
            self.assertEqual(current['retried_files'], current['checked_files'])
        data = h.read(old); data['files_sha256'] = '0'*64; h.write(old, data)
        current, calls, unused = self.online(old)
        self.assertEqual(current['retried_files'], current['checked_files'])

    def test_same_release_id_changed_manifest_rejects_old_retry(self):
        first, unused, old = self.online()
        self.manifest['rollback_ref'] = 'new-metadata'; h.write(self.source/h.MANIFEST, self.manifest)
        with self.assertRaisesRegex(ValueError, 'different release'): self.online(retry=old)

    def test_small_identity_mismatch_reads_and_checks_full_manifest(self):
        first, calls, unused = self.online(bad_identity=True)
        self.assertEqual(first['status'], 'pass'); self.assertIn('release-manifest.json', calls)

    def test_full_remote_retry_also_rechecks_retained_objects(self):
        output, plan = fixture.OssReleaseTests.prepare(self)
        plan['retained_objects'] = {rel:{'status':'pass'} for rel in plan['objects']}
        fixture.oss.write(output/fixture.oss.PLAN, plan)
        with patch.dict(os.environ, {'WLY_RELEASE_FULL':'1'}), patch.object(fixture.oss, 'verify_object_with_retries', return_value={'status':'pass'}) as get:
            self.assertTrue(fixture.oss.verify_remote(output, retry_failed=True)['complete'])
        self.assertEqual(get.call_count, len(plan['objects']))

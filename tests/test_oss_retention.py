"""Exact object collection, live pins and uncertain provider responses."""
import argparse
import importlib.util
import json, io
import ssl
from http.client import IncompleteRead, RemoteDisconnected
from urllib.error import HTTPError, URLError
import os
from pathlib import Path
import tempfile
import unittest
import sys
from datetime import datetime, timedelta, timezone
from types import SimpleNamespace
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('retention', Path(__file__).resolve().parents[1] / 'scripts/oss-retention.py')
retention = importlib.util.module_from_spec(spec); spec.loader.exec_module(retention)


class RetentionTests(unittest.TestCase):
    def setUp(self):
        # The task owner recycles its dedicated TEMP after running the suite.
        self.root = Path(tempfile.mkdtemp(prefix='oss-retention-', dir=os.environ['TEMP']))
        self.shared = self.root / 'shared'
        self.preparation = self.root / 'preparation'; self.preparation.mkdir()
        self.keep, self.pending, self.obsolete = ('releases/' + name + '/x.js' for name in ('live', 'pending', 'old'))
        self.fingerprint = {'bytes': 4, 'sha256': 'a' * 64, 'etag': 'A' * 32}
        retention.write(self.shared / 'managed.json', {'schema': 'wly.oss-managed.v1', 'bucket': retention.BUCKET,
            'objects': {key: self.fingerprint for key in (self.keep, self.pending, self.obsolete)}})
        self.args = argparse.Namespace(commit='live', rollback='old', preparation=str(self.preparation), cli='fake-cli',
            profile='fixture', lock_holder='fixture', report=self.root / 'report.json')
        public = patch.object(retention, 'predecessor', return_value={'release_id': None})
        public.start(); self.addCleanup(public.stop); self.public_patch = public

    def version(self, key):
        return {'key': key, 'size': 4, 'etag': 'A' * 32, 'kind': 'version', 'version_id': 'null', 'is_latest': True}

    def test_permanent_visitor_pixel_is_excluded_from_generated_pins(self):
        plan = {'schema': 'wly.oss-release-plan.v1', 'test_only': False, 'asset_base_url': retention.BASE,
                'objects': {'x.js': {'key': self.keep, 'bytes': 4, 'sha256': 'a' * 64}},
                'reference_keys': ['_v.gif'], 'github_files': {}, 'release_id': 'fixture'}
        retention.write(self.preparation/'oss-plan.json', plan)
        with patch.object(retention, 'shared', return_value=self.shared):
            self.assertEqual(set(retention.plan_pin(self.preparation)[1]['objects']), {self.keep})
            plan['reference_keys'].append('_other.gif')
            retention.write(self.preparation/'oss-plan.json', plan)
            with self.assertRaisesRegex(ValueError, 'Invalid website object keys'):
                retention.plan_pin(self.preparation)

    def test_only_actual_boolean_latest_is_accepted(self):
        for latest in ('false', 'unknown', 'true', False, 1):
            before = {self.obsolete: [self.version(self.obsolete)]}; before[self.obsolete][0]['is_latest'] = latest
            current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
            with self.subTest(latest=latest), patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
                 patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {'plan_sha256': 'own'}, {})), \
                 patch.object(retention, 'versions', return_value=before), patch.object(retention, 'command', return_value='live refs/heads/main') as commands:
                self.assertEqual(retention.collect(self.args), 1)
            self.assertEqual(len(commands.call_args_list), 1)

    def test_unknown_completion_or_inconsistent_count_is_rejected(self):
        for complete, returned in [('unknown', 0), ('false', 0), (True, 1)]:
            page = {'schema_version': '1', 'complete': complete, 'returned': returned, 'items': []}
            with self.subTest(page=page), patch.object(retention, 'command', return_value=json.dumps(page)):
                with self.assertRaises(ValueError): retention.versions('fake', 'fixture')

    def test_current_and_inflight_are_kept_but_unpinned_obsolete_objects_are_collected(self):
        plan_path = self.preparation/'oss-plan.json'
        retention.write(plan_path, {'schema': 'wly.oss-release-plan.v1', 'asset_base_url': retention.BASE,
            'objects': {'x.js': {'key': self.pending, **self.fingerprint}}, 'github_files': {}, 'release_id': 'pending'})
        plan_path.write_bytes(b'\xef\xbb\xbf'+plan_path.read_bytes())
        with patch.object(retention, 'shared', return_value=self.shared): pin_path = retention.pin(self.preparation)
        saved = retention.read(pin_path)
        self.assertEqual(saved['plan_snapshot'].encode('utf-8'), plan_path.read_bytes())
        plan_path.unlink()
        before = {key: [self.version(key)] for key in (self.keep, self.pending, self.obsolete)}
        after = {key: [self.version(key)] for key in (self.keep, self.pending)}
        partial = 'releases/partial/x.js'; managed = retention.read(self.shared/'managed.json')
        managed['objects']['_v.gif'] = self.fingerprint
        managed['objects'][partial] = {**self.fingerprint, 'etag': ''}; retention.write(self.shared/'managed.json', managed)
        before[partial] = [self.version(partial)]; after[partial] = [self.version(partial)]
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {'plan_sha256': 'own'}, {})), \
             patch.object(retention, 'exact_versions', side_effect=[{key: before[key] for key in (self.obsolete, partial)},
                                                                   {self.obsolete: before[self.obsolete]}, {}]) as listings, patch.object(retention, 'require_lock'), \
             patch.object(retention, 'command', side_effect=['live refs/heads/main', 'live refs/heads/main', 'deleted']) as commands:
            self.assertEqual(retention.collect(self.args), 1)
        batch = (self.root/'oss-delete-0.xml').read_text()
        self.assertIn(self.obsolete, batch); self.assertNotIn(self.keep, batch); self.assertNotIn(self.pending, batch)
        self.assertNotIn('_v.gif', batch); self.assertEqual(listings.call_args_list[0].args[2], [self.obsolete, partial])
        self.assertIn('_v.gif', retention.read(self.shared/'managed.json')['objects'])
        self.assertEqual(retention.read(self.args.report)['deleted_objects'], 1)
        self.assertEqual(retention.read(self.args.report)['status'], 'incomplete')
        self.assertIn(partial, retention.read(self.args.report)['deferred'])
        self.assertTrue(pin_path.exists()); self.assertEqual(len(commands.call_args_list), 3)

    def test_missing_legacy_plan_retains_its_objects_while_other_candidates_are_deleted(self):
        pin_path = self.shared/'pins/legacy.json'
        retention.write(pin_path, {'schema': 'wly.oss-pin.v1', 'bucket': retention.BUCKET,
            'plan': str(self.root/'gone/oss-plan.json'), 'plan_sha256': 'a'*64, 'objects': {self.pending: self.fingerprint}})
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        before = {self.obsolete: [self.version(self.obsolete)]}
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {'plan_sha256': 'own'}, {})), \
             patch.object(retention, 'exact_versions', side_effect=[before, before, {}]) as listings, \
             patch.object(retention, 'require_lock'), \
             patch.object(retention, 'command', side_effect=['live refs/heads/main', 'live refs/heads/main', 'deleted']):
            self.assertEqual(retention.collect(self.args), 1)
        report = retention.read(self.args.report)
        self.assertEqual(report['status'], 'incomplete'); self.assertEqual(report['deleted_objects'], 1)
        self.assertEqual(report['pending_pins'][0]['reason'], 'In-flight plan missing; registered objects retained')
        self.assertEqual(listings.call_args_list[0].args[2], [self.obsolete])
        self.assertIn(self.pending, retention.read(self.shared/'managed.json')['objects']); self.assertTrue(pin_path.exists())
        self.assertNotIn(self.pending, (self.root/'oss-delete-0.xml').read_text())

    def test_exact_prefix_query_filters_neighbours_and_pages_to_completion(self):
        first = {'schema_version': '1', 'complete': False, 'returned': 1, 'items': [self.version(self.obsolete)], 'next_cursor': 'next'}
        neighbour = self.obsolete+'-neighbour'
        second = {'schema_version': '1', 'complete': True, 'returned': 1, 'items': [self.version(neighbour)]}
        with patch.object(retention, 'command', side_effect=[json.dumps(first), json.dumps(second)]) as calls:
            found = retention.exact_versions('fake', 'fixture', [self.obsolete])
        self.assertEqual(set(found), {self.obsolete})
        self.assertIn('oss://'+retention.BUCKET+'/'+self.obsolete, calls.call_args_list[0].args)
        self.assertEqual(calls.call_args_list[1].args[-2:], ('--cli-cursor', 'next'))

    def test_fresh_version_change_and_delete_failure_are_incomplete(self):
        before = {self.obsolete: [self.version(self.obsolete)]}
        changed = {self.obsolete: [{**self.version(self.obsolete), 'etag': 'B'*32}]}
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        for fresh, error in ((changed, None), (before, OSError('delete failed'))):
            with self.subTest(fresh=fresh), patch.object(retention, 'shared', return_value=self.shared), \
                 patch.object(retention, 'manifest', return_value=current), patch.object(retention, 'require_lock'), \
                 patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {'plan_sha256': 'own'}, {})), \
                 patch.object(retention, 'exact_versions', side_effect=[before, fresh]), \
                 patch.object(retention, 'command', side_effect=['live refs/heads/main', 'live refs/heads/main', error] if error else ['live refs/heads/main', 'live refs/heads/main']) as calls:
                with self.assertRaises((ValueError, OSError)): retention.collect(self.args)
            report = retention.read(self.args.report)
            self.assertEqual(report['status'], 'incomplete')
            self.assertIn('changed' if not error else 'delete failed', report['reason'])
            if error: self.assertIsNone(report['deleted_objects'])
            else: self.assertFalse(any('delete-multiple-objects' in call.args for call in calls.call_args_list))

    def test_dry_run_keeps_rollback_references_and_does_not_retire_own_pin(self):
        own = self.shared/'pins/own.json'; plan = self.root/'own-plan.json'; retention.write(plan, {})
        retention.write(own, {'schema': 'wly.oss-pin.v1', 'bucket': retention.BUCKET, 'plan': str(plan),
                             'plan_sha256': retention.digest(plan), 'release_id': 'published', 'objects': {self.keep: self.fingerprint}})
        current = {'release_id': 'published', 'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}, 'reference_keys': [self.pending]}}
        self.args.dry_run = True
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'rollback_keep', return_value={self.obsolete}) as rollback, \
             patch.object(retention, 'predecessor', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(own, {'plan_sha256': retention.digest(plan)}, {'release_id': 'published'})), \
             patch.object(retention, 'exact_versions', return_value={}) as listings, patch.object(retention, 'command', return_value='live refs/heads/main') as calls:
            self.assertEqual(retention.collect(self.args), 0)
        self.assertTrue(own.exists()); self.assertEqual(listings.call_args.args[2], [])
        self.assertFalse(rollback.call_args.kwargs['persist']); self.assertEqual(calls.call_count, 1)

    def test_another_preparation_that_reuses_current_assets_is_not_a_completed_pin(self):
        own = self.shared/'pins/own.json'; plan = self.root/'future-plan.json'; retention.write(plan, {})
        retention.write(own, {'schema': 'wly.oss-pin.v1', 'bucket': retention.BUCKET, 'plan': str(plan),
                             'plan_sha256': retention.digest(plan), 'release_id': 'future', 'objects': {self.keep: self.fingerprint}})
        current = {'release_id': 'published', 'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'predecessor', return_value=current), patch.object(retention, 'require_lock'), \
             patch.object(retention, 'plan_pin', return_value=(own, {'plan_sha256': retention.digest(plan)}, {'release_id': 'future'})), \
             patch.object(retention, 'exact_versions', return_value={}), patch.object(retention, 'command', return_value='live refs/heads/main'):
            self.assertEqual(retention.collect(self.args), 0)
        self.assertTrue(own.exists()); self.assertIsNone(retention.read(self.args.report)['retired_pin'])

    def test_absent_objects_with_no_old_etag_are_pruned_without_delete(self):
        managed = retention.read(self.shared/'managed.json'); managed['objects'][self.obsolete]['etag'] = ''
        retention.write(self.shared/'managed.json', managed)
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        self.args.max_keys = 1
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {}, {})), \
             patch.object(retention, 'exact_versions', return_value={}) as listings, patch.object(retention, 'command', return_value='live refs/heads/main') as calls:
            self.assertEqual(retention.collect(self.args), 1)
        self.assertEqual(listings.call_args.args[2], [self.obsolete]); self.assertEqual(calls.call_count, 1)
        self.assertNotIn(self.obsolete, retention.read(self.shared/'managed.json')['objects'])
        self.assertIn(self.pending, retention.read(self.args.report)['deferred'])

    def test_unknown_pin_blocks_before_any_cloud_delete(self):
        retention.write(self.shared/'pins/unknown.json', {'schema': 'unknown'})
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {'plan_sha256': 'own'}, {})), \
             patch.object(retention, 'command', return_value='live refs/heads/main'), patch.object(retention, 'versions') as listings:
            with self.assertRaises(ValueError): retention.collect(self.args)
        listings.assert_not_called()

    def test_changed_snapshot_or_existing_legacy_plan_blocks_before_cloud_queries(self):
        plan_path = self.root/'changed-plan.json'; retention.write(plan_path, {'fixture': True})
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        for snapshot, change_original in ((None, False), ('changed', False), (plan_path.read_bytes().decode('utf-8'), True)):
            value = {'schema': 'wly.oss-pin.v1', 'bucket': retention.BUCKET, 'plan': str(plan_path),
                     'plan_sha256': 'b'*64, 'objects': {self.pending: self.fingerprint}}
            if snapshot is not None: value['plan_snapshot'] = snapshot
            if change_original:
                value['plan_sha256'] = retention.digest(plan_path)
                self.assertEqual(retention.hashlib.sha256(snapshot.encode('utf-8')).hexdigest(), value['plan_sha256'])
                retention.write(plan_path, {'changed': True})
            retention.write(self.shared/'pins/changed.json', value)
            with self.subTest(snapshot=snapshot), patch.object(retention, 'shared', return_value=self.shared), \
                 patch.object(retention, 'manifest', return_value=current), \
                 patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {}, {})), \
                 patch.object(retention, 'command', return_value='live refs/heads/main'), patch.object(retention, 'exact_versions') as listings:
                with self.assertRaisesRegex(ValueError, 'changed in-flight pin'): retention.collect(self.args)
            listings.assert_not_called()

    def test_object_changed_since_real_receipt_blocks_delete(self):
        before = {self.obsolete: [self.version(self.obsolete)]}; before[self.obsolete][0]['etag'] = 'B' * 32
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {'plan_sha256': 'own'}, {})), \
             patch.object(retention, 'versions', return_value=before), patch.object(retention, 'command', return_value='live refs/heads/main') as commands:
            self.assertEqual(retention.collect(self.args), 1)
        self.assertEqual(len(commands.call_args_list), 1)

    def test_stale_local_publication_record_does_not_replace_authoritative_success(self):
        self.public_patch.stop()
        retention.write(self.shared/'published.json', {'commit': 'old'})
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'command', return_value='[]'):
            with self.assertRaises(ValueError): retention.predecessor()
        payload = b'{"release_id":"actual-old-ref"}'
        identity = json.dumps({'release_id': 'actual-old-ref', 'manifest_sha256': retention.hashlib.sha256(payload).hexdigest()}).encode()
        responses = [io.BytesIO(payload), io.BytesIO(identity)]
        for response in responses: response.status = 200
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'command', side_effect=[json.dumps([{'id': 7, 'sha': 'new'}]), json.dumps([{'state': 'success'}])]), \
             patch.object(retention, 'urlopen', side_effect=responses), \
             patch.object(retention, 'oss_contract', return_value=SimpleNamespace(verify_manifest=lambda value: value)):
            self.assertEqual(retention.predecessor(), {'release_id': 'actual-old-ref'})

    def test_predecessor_retries_each_public_read_but_not_status_or_identity_validation(self):
        self.public_patch.stop()
        payload = b'{"release_id":"previous"}'
        identity = json.dumps({'release_id': 'previous', 'manifest_sha256': retention.hashlib.sha256(payload).hexdigest()}).encode()
        def response(body):
            value = io.BytesIO(body); value.status = 200
            return value
        for failure in (ssl.SSLEOFError('SSL EOF'), RemoteDisconnected('EOF'), IncompleteRead(b'{', 10), OSError(2, 'missing')):
            failures = [failure, failure]
            if isinstance(failure, IncompleteRead):
                broken = unittest.mock.MagicMock(status=200); broken.__enter__.return_value = broken
                broken.read.side_effect = failure; failures = [broken, broken]
            with self.subTest(failure=repr(failure)), patch.object(retention, 'command', side_effect=['[{"id":7}]', '[{"state":"success"}]']), \
                 patch.object(retention, 'urlopen', side_effect=failures+[response(payload)]+failures+[response(identity)]) as calls, \
                 patch.object(retention, 'oss_contract', return_value=SimpleNamespace(verify_manifest=lambda value: value)), patch('time.sleep'):
                self.assertEqual(retention.predecessor(), {'release_id': 'previous'})
            self.assertEqual([call.args[0].full_url for call in calls.call_args_list], ['https://wly0829.cn/release-manifest.json']*3+['https://wly0829.cn/release-identity.json']*3)
        for bad_at in (0, 1, 2, 3, 4):
            error = URLError(FileNotFoundError(2, 'missing', 'missing.pem')) if bad_at >= 3 else None if bad_at == 2 else HTTPError('u', 404, 'nf', {}, None)
            effects = [error] if bad_at in (0, 3) else [response(payload), response(b'{}') if bad_at == 2 else error]
            with self.subTest(bad_at=bad_at), patch.object(retention, 'command', side_effect=['[{"id":7}]', '[{"state":"success"}]']), \
                 patch.object(retention, 'urlopen', side_effect=effects) as calls, patch('time.sleep') as sleeps:
                with self.assertRaises(HTTPError if bad_at < 2 else ValueError if bad_at == 2 else URLError): retention.predecessor()
            self.assertEqual(calls.call_count, 1 if bad_at in (0, 3) else 2); sleeps.assert_not_called()
            for effect in effects:
                if hasattr(effect, 'close'): effect.close()
    def test_finalized_hybrid_without_named_ref_uses_exact_frozen_predecessor_and_known_rollback(self):
        current = {'schema': 'wly.hybrid-release.v1', 'finalized_dist': True, 'release_id': 'current',
                   'files': {}, 'routes': {}, 'baseline_production_commit': 'a'*40,
                   'previous_oss_source': 'published', 'previous_release_id': 'previous',
                   'oss': {'schema': 'wly.oss-assets.v1', 'asset_base_url': retention.BASE,
                           'objects': {'x': {'key': self.keep}}, 'reference_keys': [self.pending]}}
        snapshot = self.preparation/'previous-publication.json'
        retention.write(snapshot, {'schema': 'wly.hybrid-release.v1', 'release_id': 'previous',
            'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.obsolete, **self.fingerprint}}}})
        plan = {'previous_publication_sha256': retention.digest(snapshot)}
        inventory = self.shared/'rollback-retention.json'
        retention.write(inventory, {'schema': 'wly.oss-rollback-retention.v1', 'bucket': retention.BUCKET, 'records': {}})
        self.args.rollback = None; self.args.dry_run = True
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'predecessor', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {}, plan)), \
             patch.object(retention, 'oss_contract', return_value=SimpleNamespace(verify_manifest=lambda value: value)), \
             patch.object(retention, 'exact_versions', return_value={}) as listings, \
             patch.object(retention, 'command', return_value='live refs/heads/site-dist') as commands:
            baseline = retention.digest(inventory)
            self.assertEqual(retention.collect(self.args), 0)
            self.assertEqual(listings.call_args.args[2], []); self.assertEqual(commands.call_count, 1)
            self.assertEqual(retention.digest(inventory), baseline)
            retention.write(inventory, {'schema': 'unknown', 'bucket': retention.BUCKET, 'records': {}})
            with self.assertRaisesRegex(ValueError, 'Unknown rollback'): retention.collect(self.args)
            retention.write(inventory, {'schema': 'wly.oss-rollback-retention.v1', 'bucket': retention.BUCKET, 'records': {}})
            snapshot.write_text('{}')
            with self.assertRaisesRegex(ValueError, 'snapshot changed'): retention.collect(self.args)
            current['schema'] = 'unknown'
            with self.assertRaisesRegex(ValueError, 'Only the finalized hybrid'): retention.collect(self.args)

    def test_retire_exact_pin_after_preparation_disappeared(self):
        pin_id = 'a'*64; pin_path = self.shared/'pins'/(pin_id+'.json')
        retention.write(pin_path, {'plan_sha256': 'original', 'plan': str(self.root/'missing/oss-plan.json')})
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'require_lock'), \
             patch.object(sys, 'argv', ['retention', 'retire', '--pin-id', pin_id, '--plan-sha256', 'original', '--lock-holder', 'fixture']):
            self.assertEqual(retention.main(), 0)
        self.assertFalse(pin_path.exists())

    def test_previous_snapshot_survives_more_releases_without_sliding_expiry(self):
        snapshot = self.preparation/'previous-publication.json'
        old = {'release_id': 'old', 'oss': {'asset_base_url': retention.BASE,
               'objects': {'x.js': {'key': self.obsolete, **self.fingerprint}}, 'reference_keys': [self.pending]}}
        retention.write(snapshot, old); plan = {'previous_publication_sha256': retention.digest(snapshot)}
        now = datetime(2026, 10, 10, tzinfo=timezone.utc)
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'datetime') as clock, \
             patch.object(retention, 'oss_contract', return_value=SimpleNamespace(verify_manifest=lambda value: value)):
            clock.now.return_value = now; clock.fromisoformat.side_effect = datetime.fromisoformat
            self.assertIn(self.obsolete, retention.rollback_keep(self.preparation, plan, 'first'))
            self.assertIn(self.pending, retention.rollback_keep(self.preparation, plan, 'first'))
            expiry = retention.read(self.shared/'rollback-retention.json')['records'][plan['previous_publication_sha256']]['expires_at']
            clock.now.return_value = now + timedelta(days=6)
            self.assertIn(self.obsolete, retention.rollback_keep(self.preparation, {}, 'second'))
            retention.rollback_keep(self.preparation, plan, 'first')
            self.assertEqual(retention.read(self.shared/'rollback-retention.json')['records'][plan['previous_publication_sha256']]['expires_at'], expiry)
            clock.now.return_value = now + timedelta(days=7)
            self.assertNotIn(self.obsolete, retention.rollback_keep(self.preparation, {}, 'third'))
            self.assertNotIn(self.obsolete, retention.rollback_keep(self.preparation, plan, 'first'))
            snapshot.write_text('{}')
            with self.assertRaisesRegex(ValueError, 'snapshot changed'): retention.rollback_keep(self.preparation, plan)


if __name__ == '__main__': unittest.main()

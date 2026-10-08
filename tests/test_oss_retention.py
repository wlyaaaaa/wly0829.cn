"""Exact object collection, live pins and uncertain provider responses."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
import sys
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

    def version(self, key):
        return {'key': key, 'size': 4, 'etag': 'A' * 32, 'kind': 'version', 'version_id': 'null', 'is_latest': True}

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

    def test_current_and_inflight_are_kept_but_rollback_only_objects_are_collected(self):
        pin_path = self.shared / 'pins' / 'pending.json'
        plan_path = self.root / 'pending-plan.json'; retention.write(plan_path, {'fixture': True})
        retention.write(pin_path, {'schema': 'wly.oss-pin.v1', 'bucket': retention.BUCKET, 'plan': str(plan_path),
            'plan_sha256': retention.digest(plan_path), 'objects': {self.pending: self.fingerprint}})
        before = {key: [self.version(key)] for key in (self.keep, self.pending, self.obsolete)}
        after = {key: [self.version(key)] for key in (self.keep, self.pending)}
        partial = 'releases/partial/x.js'; managed = retention.read(self.shared/'managed.json')
        managed['objects'][partial] = {**self.fingerprint, 'etag': ''}; retention.write(self.shared/'managed.json', managed)
        before[partial] = [self.version(partial)]; after[partial] = [self.version(partial)]
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {'plan_sha256': 'own'}, {})), \
             patch.object(retention, 'versions', side_effect=[before, after]), patch.object(retention, 'require_lock'), \
             patch.object(retention, 'command', side_effect=['live refs/heads/main', 'deleted']) as commands:
            self.assertEqual(retention.collect(self.args), 1)
        batch = (self.root/'oss-delete-0.xml').read_text()
        self.assertIn(self.obsolete, batch); self.assertNotIn(self.keep, batch); self.assertNotIn(self.pending, batch)
        self.assertEqual(retention.read(self.args.report)['deleted_objects'], 1)
        self.assertEqual(retention.read(self.args.report)['status'], 'incomplete')
        self.assertIn(partial, retention.read(self.args.report)['deferred'])
        self.assertTrue(pin_path.exists()); self.assertEqual(len(commands.call_args_list), 2)

    def test_unknown_pin_blocks_before_any_cloud_delete(self):
        retention.write(self.shared/'pins/unknown.json', {'schema': 'unknown'})
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {'plan_sha256': 'own'}, {})), \
             patch.object(retention, 'command', return_value='live refs/heads/main'), patch.object(retention, 'versions') as listings:
            with self.assertRaises(ValueError): retention.collect(self.args)
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
        retention.write(self.shared/'published.json', {'commit': 'old'})
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'command', return_value='[]'):
            with self.assertRaises(ValueError): retention.predecessor()
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'command', side_effect=[json.dumps([{'id': 7, 'sha': 'new'}]), json.dumps([{'state': 'success'}])]), \
             patch.object(retention, 'manifest', return_value={'release_id': 'new'}) as manifests:
            self.assertEqual(retention.predecessor(), {'release_id': 'new'})
        manifests.assert_called_once_with('new')

    def test_retire_exact_pin_after_preparation_disappeared(self):
        pin_id = 'a'*64; pin_path = self.shared/'pins'/(pin_id+'.json')
        retention.write(pin_path, {'plan_sha256': 'original', 'plan': str(self.root/'missing/oss-plan.json')})
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'require_lock'), \
             patch.object(sys, 'argv', ['retention', 'retire', '--pin-id', pin_id, '--plan-sha256', 'original', '--lock-holder', 'fixture']):
            self.assertEqual(retention.main(), 0)
        self.assertFalse(pin_path.exists())


if __name__ == '__main__': unittest.main()

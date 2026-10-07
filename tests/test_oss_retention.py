"""Exact object collection, live pins and uncertain provider responses."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
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
                with self.assertRaises(ValueError): retention.collect(self.args)
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
        current = {'rollback_ref': 'old', 'oss': {'asset_base_url': retention.BASE, 'objects': {'x': {'key': self.keep}}}}
        with patch.object(retention, 'shared', return_value=self.shared), patch.object(retention, 'manifest', return_value=current), \
             patch.object(retention, 'plan_pin', return_value=(self.shared/'pins/own.json', {'plan_sha256': 'own'}, {})), \
             patch.object(retention, 'versions', side_effect=[before, after]), patch.object(retention, 'require_lock'), \
             patch.object(retention, 'command', side_effect=['live refs/heads/main', 'deleted']) as commands:
            retention.collect(self.args)
        batch = (self.root/'oss-delete-0.xml').read_text()
        self.assertIn(self.obsolete, batch); self.assertNotIn(self.keep, batch); self.assertNotIn(self.pending, batch)
        self.assertEqual(retention.read(self.args.report)['deleted_objects'], 1)
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
            with self.assertRaises(ValueError): retention.collect(self.args)
        self.assertEqual(len(commands.call_args_list), 1)


if __name__ == '__main__': unittest.main()

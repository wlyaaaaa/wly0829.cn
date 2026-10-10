import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
spec = importlib.util.spec_from_file_location('publication_changes', Path(__file__).resolve().parents[1]/'scripts/publication-changes.py')
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)
OLD = {'version': 'E1', 'ruleset_sha256': 'old'}
NEW = {'status': 'pass', 'reason': 'e_rules_active_verified', 'verified_current': {'release_id': 'E2', 'ruleset_sha256': 'new'}}
class ChangesTests(unittest.TestCase):
    def test_unknown_paths_and_rules_are_preserved(self):
        previous = {'publication_snapshot': {'lost.bin': 'a', 'changed.bin': 'a'}, 'rules_pin': OLD}
        report = c.changes(previous, NEW, {'new.bin': 'b', 'changed.bin': 'b'})
        self.assertEqual({row['path']: row['action'] for row in report['files']}, {'lost.bin': 'deleted', 'new.bin': 'added', 'changed.bin': 'modified'})
        self.assertEqual(set(report['affected']['other']), {'lost.bin', 'new.bin', 'changed.bin'})
        self.assertEqual(report['rules'], {'before': OLD, 'after': {'version': 'E2', 'ruleset_sha256': 'new'}, 'changed': True})
    def test_missing_snapshot_uses_explicit_git_source(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); subprocess.run(['git', 'init', '-q', str(root)], check=True)
            (root/'config').mkdir(); (root/'config/assembled-rules-pin.json').write_text(json.dumps(OLD), encoding='utf8')
            (root/'original.bin').write_bytes(b'old')
            subprocess.run(['git', '-C', str(root), 'add', '.'], check=True)
            subprocess.run(['git', '-C', str(root), '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'baseline'], check=True)
            ref = c.git(root, 'rev-parse', 'HEAD').decode().strip(); (root/'original.bin').write_bytes(b'new')
            report = c.changes({'baseline_production_commit': ref}, NEW, root=root)
            self.assertEqual(report['baseline'], {'source': 'git_source_tree', 'commit': ref})
            self.assertEqual(report['files'][0]['before'], hashlib.sha256(b'old').hexdigest())
            with self.assertRaises(ValueError): c.changes({}, NEW, {}, root=root)

"""Scope depends on published inputs, never native cache availability."""
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('seed_command', Path(__file__).resolve().parents[1]/'scripts/check-typeset-site.py')
command = importlib.util.module_from_spec(spec); spec.loader.exec_module(command)
is_file = Path.is_file


class BaselineScopeTests(unittest.TestCase):
    def inputs(self):
        return {name: dict(render='r', assembly='a', shell='s') for name in ('one', 'two')}

    def test_cold_unchanged_page_is_not_selected(self):
        parts = self.inputs()
        selected, reasons = command.page_scope(parts, self.inputs())
        self.assertEqual((selected, reasons), ([], {}))

    def test_actual_changed_dependency_is_selected_with_reason(self):
        parts = self.inputs(); parts['two']['assembly'] = 'new-js'
        self.assertEqual(command.page_scope(parts, self.inputs()), (['two'], {'two':['assembly_changed']}))

    def test_explicit_scope_never_expands(self):
        requested = ['one']; parts = self.inputs(); parts['two']['shell'] = 'new-shell'
        cases = [(parts, {}, ()), (self.inputs(), {'rules':['one','two']}, ()),
                 (self.inputs(), {}, ('one','two'))]
        for current, options, resumed in cases:
            with self.subTest(options=options, resumed=resumed), self.assertRaisesRegex(ValueError, 'required_outside_scope.*two'):
                command.page_scope(current, self.inputs(), requested, resumed=resumed, **options)
            self.assertEqual(requested, ['one'])

    def test_actual_unpublished_seed_is_rejected(self):
        import json
        root = Path('E:/Cache/Codex/Temp/r3-seed-scope-002c33e9'); root.mkdir(parents=True, exist_ok=True)
        path = root/'candidate-seed.json'
        path.write_text(json.dumps({'schema':'wly.typeset-baseline-seed.v1', 'status':'candidate'}), encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'Formal baseline seed'):
            command.baseline_seed(path)

    def test_no_formal_candidate_cannot_authorize_inheritance(self):
        import json
        root = Path('E:/Cache/Codex/Temp/r3-seed-scope-002c33e9/no-formal')
        durable = root/'state'
        durable.mkdir(parents=True, exist_ok=True)
        (durable/'page-fingerprints.json').write_text(json.dumps(self.inputs()), encoding='utf8')
        argv = ['check-typeset-site', '--changed', '--run-root', str(root/'run'), '--state-root', str(durable)]
        with patch.object(Path, 'is_file', lambda p: p == command.HERE/'check-site-ui.py' or is_file(p)), patch.object(command.renderer, 'verify_lock'), patch.object(command, 'fingerprints', return_value={'one':'r'}), patch('sys.argv', argv):
            with self.assertRaisesRegex(ValueError, 'verified formal baseline'):
                command.main()

    def test_pushed_batch_rejects_new_run_and_preserves_raw(self):
        import json
        root = Path('E:/Cache/Codex/Temp/r3-seed-scope-002c33e9/pushed')
        (root/'publisher').mkdir(parents=True, exist_ok=True)
        raw = root/'generation/dist/index.html'
        raw.parent.mkdir(parents=True, exist_ok=True)
        raw.write_text('<main>Published raw remains here</main>', encoding='utf8')
        before = command.file_proofs([raw.parent])
        argv = ['check-typeset-site', '--changed', '--run-root', str(root), '--state-root', str(root/'state')]
        for status in ('published', 'push_requested', 'push_result_unknown'):
            (root/'publisher/publication-state.json').write_text(json.dumps({'status':status, 'requested_commit':'a'*40}), encoding='utf8')
            with self.subTest(status=status), patch.object(Path, 'is_file', lambda p: p == command.HERE/'check-site-ui.py' or is_file(p)), patch.object(command.renderer, 'verify_lock'), patch('sys.argv', argv):
                with self.assertRaisesRegex(ValueError, 'fresh --run-root'):
                    command.main()
            self.assertEqual(command.file_proofs([raw.parent]), before)

if __name__ == '__main__': unittest.main()

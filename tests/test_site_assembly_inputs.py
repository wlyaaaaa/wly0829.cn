import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('assembly', ROOT / 'site-v2/site-assembly/组装.py')
assembly = importlib.util.module_from_spec(spec)
spec.loader.exec_module(assembly)


class AssemblyInputs(unittest.TestCase):
    def test_editor_notes_are_not_fingerprinted_but_build_inputs_are(self):
        editor = assembly.PIPE / 'agents'
        with tempfile.TemporaryDirectory(prefix='draft-fixture-', dir=editor) as scratch:
            draft = Path(scratch) / 'draft.md'
            draft.write_text('Synthetic private draft.', encoding='utf-8')
            inputs = set(assembly.source_files())
            self.assertNotIn(draft, inputs)
            self.assertIn(assembly.TABLE, inputs)
            self.assertIn(assembly.PIPE / '公开页禁用词.txt', inputs)
            self.assertIn(assembly.S / '配置/规则公开改写.json', inputs)
            self.assertIn(assembly.WEB / 'agents/content.js', inputs)


if __name__ == '__main__':
    unittest.main()

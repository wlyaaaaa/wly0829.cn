import sys
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'scripts'))
import prepare_native_readability as native


class NativeReadability(unittest.TestCase):
    def test_main_replacement_requires_one_complete_main(self):
        for text in ('<p>missing</p>', '<main>one</main><main>two</main>', '<main><main>nested</main></main>'):
            with self.assertRaisesRegex(ValueError, 'one main'): native.main_body(text)
        self.assertEqual(native.main_body('<header>old</header><main>new</main><footer>old</footer>'), '<main>new</main>')

    def test_changed_source_stops_before_rendering(self):
        with patch.object(native, 'source_inputs', return_value={'changed':True}), patch.object(native.subprocess, 'run') as render:
            with self.assertRaisesRegex(ValueError, 'changed before SSR'): native.prepare(SimpleNamespace(), None, {}, {}, None, None)
            render.assert_not_called()

"""A changed shared input must fail before homepage generation or rendering."""
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import typeset_lock as lock
spec = importlib.util.spec_from_file_location('locked_build', ROOT / 'scripts/build-site.py')
build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)


class TypesetLockTests(unittest.TestCase):
    def test_changed_added_and_removed_files_name_the_input(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for relative in lock.INPUTS:
                path = root / relative
                path.mkdir(parents=True) if relative == 'src/typeset' else path.parent.mkdir(parents=True, exist_ok=True)
                if relative != 'src/typeset': path.write_text('fixture', encoding='utf8')
            source = root / 'src/typeset/shared.py'; source.write_bytes(b'x')
            (root / lock.LOCK).write_text(json.dumps(lock.snapshot(root)), encoding='utf8')
            lock.verify_typeset_lock(root)
            for content in (b'y', None):
                source.write_bytes(content) if content else source.unlink()
                with self.assertRaisesRegex(ValueError, 'src/typeset/shared.py'):
                    lock.verify_typeset_lock(root)
                source.write_bytes(b'x')
            added = root / 'src/typeset/new.css'; added.write_bytes(b'x')
            with self.assertRaisesRegex(ValueError, 'src/typeset/new.css'):
                lock.verify_typeset_lock(root)
            added.unlink()
            with patch.object(lock.platform, 'python_version', return_value='changed'):
                with self.assertRaisesRegex(ValueError, '运行依赖 python'):
                    lock.verify_typeset_lock(root)

    def test_build_checks_before_importing_renderer_or_redrawing_home(self):
        with patch.object(build, 'verify_typeset_lock', side_effect=ValueError('changed input')), \
                patch.object(build, 'load') as load, patch.object(build, 'refresh_home_highlights') as home:
            with self.assertRaisesRegex(ValueError, 'changed input'): build.build()
            load.assert_not_called(); home.assert_not_called()
        with patch.object(build, 'verify_typeset_lock'), patch.object(build, 'load') as load, \
                patch.object(build, 'refresh_home_highlights') as home:
            build.build(check_lock_only=True)
            load.return_value.verify_render_lock.assert_called_once_with()
            home.assert_not_called()

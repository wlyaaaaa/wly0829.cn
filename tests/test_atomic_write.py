import sys, tempfile, unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts/content-refresh'))
import editorial_ledger as ledger


class AtomicWriteTests(unittest.TestCase):
    def test_text_and_bytes_preserve_contents_and_leave_no_temporary(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); target = root / 'target'; expected = root / 'expected'
            for encoding in ('utf-8', 'utf-8-sig'):
                for newline in (None, '', '\n', '\r\n'):
                    expected.write_text('中文\r\n第二行\n', encoding=encoding, newline=newline)
                    ledger.atomic_write_text(target, '中文\r\n第二行\n', encoding=encoding, newline=newline)
                    self.assertEqual(target.read_bytes(), expected.read_bytes())
            ledger.atomic_write_bytes(target, b'\x00\xff\r\n')
            self.assertEqual(target.read_bytes(), b'\x00\xff\r\n')
            self.assertEqual(set(root.iterdir()), {target, expected})

    def test_failed_flush_or_replace_keeps_previous_contents_and_cleans_temporary(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'target'; target.write_bytes(b'previous')
            for operation in ('fsync', 'replace'):
                with patch.object(ledger.os, operation, side_effect=OSError(operation)):
                    with self.assertRaises(OSError): ledger.atomic_write_text(target, '新内容')
                self.assertEqual(target.read_bytes(), b'previous')
                self.assertEqual(list(Path(folder).iterdir()), [target])

"""Visible script literals must not include comments, regular expressions or code."""
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('site_assembly', ROOT / 'site-v2/site-assembly/组装.py')
ASSEMBLY = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(ASSEMBLY)


class FontTextTests(unittest.TestCase):
    def test_templates_include_fixed_labels_without_regex_or_comments(self):
        text = """// 不可收的注释
        const width = s => /[一-鿿]/.test(s) ? 11 : 6;
        const label = `${name} 年 ${n ? `月${n}` : '天'}`;
        const status = '开机\\u65F6长';
        """
        self.assertEqual(set('年月天开机时长'), set(ASSEMBLY.fixed_script_text(text)))


if __name__ == '__main__':
    unittest.main()

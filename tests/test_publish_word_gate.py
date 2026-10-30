"""The publish gate checks the final public bytes before upload."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'site-astro/tools/publish_site.py'
SPEC = importlib.util.spec_from_file_location('publish_site_word_test', SCRIPT)
publish = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(publish)


class WordGateTests(unittest.TestCase):
    def test_html_search_and_rule_sources_and_precise_exception(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            with self.assertRaises(ValueError):
                publish.scan_public_words(root/'missing')
            (root/'index.html').write_text('<p>请勿起诉</p>', 'utf-8')
            (root/'search-index.js').write_text('const item="调解";', 'utf-8')
            (root/'_typeset/rule-sources').mkdir(parents=True)
            (root/'_typeset/rule-sources/source.md').write_text('这里有维权一词', 'utf-8')
            (root/'unrelated.js').write_text('调解', 'utf-8')
            config = root/'words.json'
            config.write_text(json.dumps({'words': ['起诉', '调解', '维权'], 'exceptions': []}), 'utf-8')
            with patch.object(publish, 'WORD_CONFIG', config):
                hits = publish.scan_public_words(root)
                self.assertEqual({row['word'] for row in hits}, {'起诉', '调解', '维权'})
                self.assertTrue(all(row['line'] == 1 and row['column'] > 0 and '【' in row['context'] for row in hits))
                config.write_text(json.dumps({'words': ['起诉', '调解', '维权'],
                    'exceptions': [{'file': 'index.html', 'line': 1, 'text': '<p>请勿起诉</p>', 'word': '起诉',
                                    'reason': 'fixture'}]}), 'utf-8')
                self.assertEqual({row['word'] for row in publish.scan_public_words(root)}, {'调解', '维权'})


if __name__ == '__main__':
    unittest.main()

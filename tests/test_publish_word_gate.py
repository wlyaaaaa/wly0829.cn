"""The final artifact and tracked-source gates use isolated neutral policy fixtures."""
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'site-astro/tools/publish_site.py'
SPEC = importlib.util.spec_from_file_location('publish_site_word_test', SCRIPT)
publish = importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(publish)

class WordGateTests(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory(); self.addCleanup(folder.cleanup)
        self.root = Path(folder.name); self.dist = self.root/'dist'; self.dist.mkdir()
        self.source = self.root/'source'; self.source.mkdir(); self.config = self.root/'policy.json'
        self.policy = {'schema': 'wly.site-public-words.v1', 'words': ['青词', '54321'],
                       'exceptions': [], 'omissions': {}, 'topic_omissions': {}}
        self.save()
        subprocess.run(['git', 'init', '-q', str(self.source)], check=True, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
        self.config_patch = patch.object(publish, 'WORD_CONFIG', self.config); self.config_patch.start()
        self.addCleanup(self.config_patch.stop)

    def save(self): self.config.write_text(json.dumps(self.policy, ensure_ascii=False), 'utf-8')
    def scan(self): return publish.scan_public_words(self.dist, self.source)

    def test_all_text_suffixes_tracked_source_and_exact_sentence_exception(self):
        suffixes = ['html', 'js', 'mjs', 'json', 'txt', 'xml', 'md', 'svg', 'css', 'ps1', 'webmanifest']
        for suffix in suffixes: (self.dist/('sample.'+suffix)).write_text('青词', 'utf-8')
        (self.dist/'index.html').write_text('<p>中性青词句</p><p>另一青词句</p>', 'utf-8')
        (self.source/'tracked.py').write_text('青词', 'utf-8')
        (self.source/'untracked.py').write_text('青词', 'utf-8')
        subprocess.run(['git', '-C', str(self.source), 'add', 'tracked.py'], check=True, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
        hits = self.scan()
        self.assertEqual(len(hits), len(suffixes)+3)
        self.assertEqual([h['file'] for h in hits if h['scope']=='source'], ['source/tracked.py'])
        self.assertTrue(all(h['line']==1 and h['column']>0 and '【' in h['context'] for h in hits))
        self.policy['exceptions'] = [{'file':'dist/index.html', 'word':'青词', 'text':'中性青词句', 'reason':'neutral fixture'}]
        self.save(); remaining = self.scan()
        self.assertEqual(len(remaining), len(hits)-1)
        self.assertEqual(sum(h['file']=='dist/index.html' for h in remaining), 1)

    def test_numeric_identifiers_decimals_and_chinese_neighbours(self):
        (self.dist/'sample.txt').write_text('54321 a54321 54321b .54321 54321. 0.54321 54321.2 abc54321def 中文54321号码', 'utf-8')
        hits = self.scan()
        self.assertEqual([h['word'] for h in hits], ['54321', '54321'])

    def test_missing_and_invalid_policy_fail_before_any_publication_command(self):
        self.config.unlink()
        with self.assertRaisesRegex(ValueError, 'missing or invalid'): self.scan()
        options = SimpleNamespace(output=self.root/'run', dist=self.dist, dry_run=True)
        with patch.object(publish, 'command') as command:
            with self.assertRaisesRegex(ValueError, 'missing or invalid'): publish.publish(options)
            command.assert_not_called()
        for invalid in ('{', '{}', json.dumps({**self.policy, 'exceptions':[{'file':'dist/x','word':'青词','text':'青词','reason':''}]})):
            self.config.write_text(invalid, 'utf-8')
            with self.assertRaisesRegex(ValueError, 'missing or invalid'): self.scan()

    def test_source_cleanup_deferral_keeps_artifact_hits_blocking(self):
        (self.source/'tracked.py').write_text('青词', 'utf-8')
        subprocess.run(['git', '-C', str(self.source), 'add', 'tracked.py'], check=True, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
        options = SimpleNamespace(output=self.root/'deferred', dist=self.dist, dry_run=True, defer_source_word_cleanup=True)
        with patch.object(publish, 'ROOT', self.source):
            with self.assertRaises(FileNotFoundError): publish.publish(options)
            report = json.loads((options.output/'word-check.json').read_text('utf-8'))
            self.assertEqual((len(report['hits']), report['blocking_hits']), (1, []))
            (self.dist/'sample.txt').write_text('青词', 'utf-8'); options.output = self.root/'blocked'
            with self.assertRaisesRegex(ValueError, 'Public word gate blocked 1'): publish.publish(options)

if __name__ == '__main__': unittest.main()

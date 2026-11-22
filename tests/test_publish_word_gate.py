"""The final artifact and tracked-source gates use isolated neutral policy fixtures."""
import hashlib
import contextlib
import io
import importlib.util
import json
from pathlib import Path
import re
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

    def scanners(self):
        spec = importlib.util.spec_from_file_location('assembly_words', SCRIPT.parents[2]/'site-v2/site-assembly/组装.py')
        assembly = importlib.util.module_from_spec(spec); spec.loader.exec_module(assembly)
        return (lambda approved: publish.scan_public_words(self.dist, self.source, approved),
                lambda approved: assembly.check_public_words(self.dist, self.policy, approved=approved))

    def test_json_judgments_require_exact_complete_string_hash_and_valid_format(self):
        sentence = '中性青词句。\n"原样"😀'
        digest = hashlib.sha256(sentence.encode('utf-8')).hexdigest()
        valid = {'rules': 'fixture-v1', 'same': [digest]}
        path = self.dist/'live/_fallback.json'; path.parent.mkdir()
        cases = [(valid, 1), (None, 2), ({'rules': 'v1', 'same': digest}, 2),
                 ({'same': [digest]}, 2), ({'rules': 'v1', 'same': [digest, None]}, 2),
                 ({'rules': 'v1', 'same': [digest.upper()]}, 2)]
        for scan in self.scanners():
            for judgments, expected in cases:
                for escaped in (False, True):
                    payload = {'rows': [sentence, '另一青词句']}
                    if judgments is not None: payload['public_judgments'] = judgments
                    path.write_text(json.dumps(payload, ensure_ascii=escaped), 'utf-8')
                    approved = []; hits = scan(approved)
                    self.assertEqual(len(hits), expected)
                    self.assertEqual(approved, [{'file': 'dist/live/_fallback.json', 'word': '青词',
                                                  'sha256': digest}] if expected == 1 else [])
            path.write_text('{"label":"青词",', 'utf-8')
            self.assertEqual(len(scan([])), 1)

    def test_static_exception_is_exact_in_both_gates(self):
        (self.dist/'index.html').write_text('<p>中性青词句</p><p>另一青词句</p>', 'utf-8')
        self.policy['exceptions'] = [{'file': 'dist/index.html', 'word': '青词', 'text': '中性青词句', 'reason': 'fixture'}]
        self.save()
        for scan in self.scanners():
            approved = []
            self.assertEqual(len(scan(approved)), 1)
            self.assertEqual([(row['file'], row['word']) for row in approved], [('dist/index.html', '青词')])

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

    def test_ascii_words_count_only_as_whole_words_and_encoded_data_is_skipped(self):
        self.policy['words'] = ['青词', 'Acme', 'R2']; self.save()
        (self.dist/'sample.txt').write_text('Acme R2 AcmeCorp _Acme R2D2 FOO_R2 FooR2 云Acme上', 'utf-8')
        (self.dist/'inline.html').write_text('<img src="data:image/png;base64,QWNt+R2/Acme==">', 'utf-8')
        (self.dist/'font.b64.js').write_text('Acme R2', 'utf-8')
        self.assertEqual([(h['file'], h['word']) for h in self.scan()],
                         [('dist/sample.txt', 'Acme'), ('dist/sample.txt', 'R2'), ('dist/sample.txt', 'Acme')])

    def test_non_display_build_records_are_skipped_but_page_and_content_json_block(self):
        for name in ('.build-receipt.json', 'release-manifest.json', 'release-identity.json'):
            (self.dist/name).write_text('{"bytes":54321,"note":"青词"}', 'utf-8')
        self.assertEqual(self.scan(), [])
        (self.dist/'index.html').write_text('<button>青词</button>', 'utf-8')
        (self.dist/'content.json').write_text('{"label":"青词"}', 'utf-8')
        self.assertEqual({h['file'] for h in self.scan()}, {'dist/index.html', 'dist/content.json'})

    def test_owner_row_words_block_artifacts_without_blocking_tracked_source(self):
        term = '\u5bb6\u4eba'
        self.policy['words'].append(term)
        self.policy['owner_row_words'] = [term]
        self.save()
        (self.source/'tracked.py').write_text(term + '来电', 'utf-8')
        subprocess.run(['git', '-C', str(self.source), 'add', 'tracked.py'], check=True)
        page = self.dist/'index.html'
        page.write_text('<p>家里网络和家庭网</p><p>青词</p>', 'utf-8')
        (self.dist/'release-manifest.json').write_text(json.dumps({'metadata': term}), 'utf-8')
        with patch.object(publish, 'ROOT', self.source), contextlib.redirect_stdout(io.StringIO()):
            result = publish.check_publication_text(self.dist)
            self.assertFalse(result['blocking_hits'])
            self.assertEqual({hit['word'] for hit in result['hits']}, {term, '青词'})
            page.write_text('<p>' + term + '来电</p>', 'utf-8')
            result = publish.check_publication_text(self.dist)
            self.assertEqual(result['blocking_hits'], [dict(file='dist/index.html', category='仅本人可见词', line=1, column=4)])
            artifact = self.dist/'data.json'
            text = term + '来电'
            artifact.write_text(json.dumps({'label': text, 'public_judgments': {'rules': 'fixture-v1',
                'same': [hashlib.sha256(text.encode()).hexdigest()]}}), 'utf-8')
            self.assertEqual({hit['file'] for hit in publish.check_publication_text(self.dist)['blocking_hits']},
                             {'dist/index.html', 'dist/data.json'})

    def test_owner_row_exception_covers_one_word_position_across_public_carriers(self):
        term, parent = '\u5bb6\u4eba', '\u7238\u7238'
        title = f'一套图像一{term}，重画最多三版'
        self.policy['words'].extend([term, parent])
        self.policy['owner_row_words'] = [term, parent]
        self.policy['exceptions'] = [dict(file='dist/*', word=term, text=title, reason='风格比喻', live=True)]
        self.save()
        page = self.dist/'index.html'
        payload = self.dist/'content.json'
        page.write_text(f'<h1>{title}</h1>', 'utf-8')
        payload.write_text(json.dumps({'title': title}), 'utf-8')
        with patch.object(publish, 'ROOT', self.source), contextlib.redirect_stdout(io.StringIO()):
            self.assertFalse(publish.check_publication_text(self.dist)['blocking_hits'])
            page.write_text(f'<h1>{title}，{parent}说一{term}去公园</h1>', 'utf-8')
            blocked = publish.check_publication_text(self.dist)['blocking_hits']
            self.assertEqual([(hit['file'], hit['column']) for hit in blocked],
                             [('dist/index.html', 6 + len(title)), ('dist/index.html', 10 + len(title))])

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

    def test_words_only_warn_for_source_and_artifact_with_or_without_deferral(self):
        (self.source/'tracked.py').write_text('青词', 'utf-8')
        subprocess.run(['git', '-C', str(self.source), 'add', 'tracked.py'], check=True, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
        options = SimpleNamespace(output=self.root/'deferred', dist=self.dist, dry_run=True, defer_source_word_cleanup=True)
        with patch.object(publish, 'ROOT', self.source):
            with self.assertRaises(FileNotFoundError): publish.publish(options)
            report = json.loads((options.output/'word-check.json').read_text('utf-8'))
            self.assertEqual((len(report['hits']), report['blocking_hits']), (1, []))
            (self.dist/'sample.txt').write_text('青词', 'utf-8'); options.output = self.root/'blocked'; options.defer_source_word_cleanup = False
            with self.assertRaises(FileNotFoundError): publish.publish(options)
            report = json.loads((options.output/'word-check.json').read_text('utf-8'))
            self.assertEqual((len(report['hits']), report['blocking_hits']), (2, []))
            self.assertIn('只是提示，不拦', report['notice'])

    def test_baseline_categories_block_without_echoing_values_or_honoring_judgments(self):
        samples = {'密码': 'password' + '=synthetic-demo', '密钥': 'sk-' + 'a'*24,
                   '令牌': 'token' + '=synthetic-demo', '验证码': '验证码：' + '123456',
                   '手机号': '13900000000', '证件号': '110101199001010015',
                   '银行卡号': '4111111111111111', '结构化住址': '虚构省示例市测试区演示街道1号'}
        target = self.dist/'live/_fallback.json'; target.parent.mkdir()
        for category, value in samples.items():
            with self.subTest(category=category):
                digest = hashlib.sha256(value.encode()).hexdigest()
                target.write_text(json.dumps({'value': value, 'public_judgments': {'rules': 'v1', 'same': [digest]}}), 'utf-8')
                self.policy['words'] = [value]
                self.policy['exceptions'] = [{'file': 'dist/live/_fallback.json', 'word': value, 'text': value, 'reason': 'fixture'}]
                self.save()
                with patch.object(publish, 'ROOT', self.source):
                    options = SimpleNamespace(output=self.root/category, dist=self.dist, dry_run=True)
                    with self.assertRaisesRegex(ValueError, 'Public baseline gate blocked'): publish.publish(options)
                report = json.loads((options.output/'word-check.json').read_text('utf-8'))
                self.assertIn(category, [hit['category'] for hit in report['blocking_hits']])
                self.assertTrue(all(set(hit) == {'file', 'category', 'line', 'column'} for hit in report['blocking_hits']))
                self.assertNotIn(value, json.dumps(report, ensure_ascii=False))

    def test_numeric_technical_values_and_invalid_checksums_are_not_baseline(self):
        text = '大小 13900000000 bytes；4111111111111111 字节；{"logical_bytes":13900000000,"bytes":4111111111111111}；版本 v13900000000.2；0.4111111111111111；20261117090322；1794877400000；09:03；12345；110101199001010016；4111111111111112'
        (self.dist/'sample.txt').write_text(text, 'utf-8')
        self.assertEqual(publish.word_policy.scan_baseline(self.dist), [])

    def test_json_numeric_rules_only_inspect_string_values(self):
        scan = publish.word_policy.baseline_hits
        capacities = '{"free":15032385536,"total":4222222222222,"nested":[13800138000,4111111111111111],"13800138000":0}'
        self.assertEqual(scan(capacities, 'dist/live/_fallback.json'), [])
        for value, category in [('13800138000', '手机号'), ('4222222222222', '银行卡号')]:
            for payload in ({'free': value}, {'bytes': value}, [value]):
                self.assertIn(category, [h['category'] for h in scan(json.dumps(payload), 'dist/data.json')])
        escaped = '{"label":"&quot;容量&quot;","free":15032385536,"phone":"' + r'\u0031' + '3800138000"}'
        self.assertEqual([h['category'] for h in scan(escaped, 'dist/data.json')], ['手机号'])
        self.assertIn('手机号', [h['category'] for h in scan(capacities[:-1], 'dist/data.json')])
        self.assertIn('手机号', [h['category'] for h in scan(capacities, 'dist/data.txt')])

    def test_only_registered_notification_test_numbers_in_exact_fallback_fields_are_technical(self):
        scan = publish.word_policy.baseline_hits
        fallback = 'dist/live/_fallback.json'
        label = '通知延迟测试，马上关闭，编号'
        registered, other = '378282246310005', '371449635398431'
        exact = label + registered
        pattern = re.compile(label + r'(?P<id>[0-9]{15})')
        cases = [
            (exact, fallback, []),
            (exact, 'dist/data.json', ['银行卡号']),
            (label + other, fallback, ['银行卡号']),
            ('银行卡号：' + registered, fallback, ['银行卡号']),
            (exact + ' 请联系', fallback, ['银行卡号']),
            ('&#36890;' + exact[1:], fallback, ['银行卡号']),
            ([exact, other, '110101199001010015'], fallback, ['银行卡号', '证件号']),
        ]
        with patch.object(publish.word_policy, 'load_notification_tests', return_value=(pattern, {registered})):
            for value, file, expected in cases:
                for ensure_ascii in (False, True):
                    payload = json.dumps({'value': value}, ensure_ascii=ensure_ascii)
                    self.assertEqual([hit['category'] for hit in scan(payload, file)], expected)
        with patch.object(publish.word_policy, 'load_notification_tests', return_value=None):
            self.assertEqual([hit['category'] for hit in scan(json.dumps(exact), fallback)], ['银行卡号'])

    def test_baseline_all_artifact_text_extensions(self):
        for suffix in ('html', 'js', 'json', 'txt', 'xml', 'svg'):
            (self.dist/f'sample.{suffix}').write_text('验证码：' + '123456', 'utf-8')
        self.assertEqual(len(publish.word_policy.scan_baseline(self.dist)), 6)

    def test_source_literals_and_technical_labels(self):
        text = 'const token = device(); if (token === expected) {}; const headers = {"X-Token": csrf}; const paths = {"双层密码": "/vault/page"}; const id = "sk-browser-control-continuity-glow";'
        self.assertEqual(publish.word_policy.baseline_hits(text, 'dist/app.js'), [])
        for text in ('const password = "' + 'made-up-value";', '{"验证码": "' + '123456"}'):
            self.assertTrue(publish.word_policy.baseline_hits(text, 'dist/app.js'))

    def test_assembly_main_word_warning_passes_and_baseline_fails(self):
        spec = importlib.util.spec_from_file_location('assembly_main', SCRIPT.parents[2]/'site-v2/site-assembly/组装.py')
        assembly = importlib.util.module_from_spec(spec); spec.loader.exec_module(assembly)
        with patch('sys.argv', ['assembly', '--只检查', '--output', str(self.dist)]), \
             patch.object(assembly, 'load_public_policy', return_value=self.policy), \
             patch.object(assembly, 'load_formal_public_policy', return_value=self.policy), \
             patch.object(assembly, 'check_links', return_value=[]), contextlib.redirect_stdout(io.StringIO()):
            (self.dist/'index.html').write_text('青词', 'utf-8'); assembly.main()
            term = '\u5bb6\u4eba'
            self.policy['words'].append(term)
            self.policy['owner_row_words'] = [term]
            (self.dist/'index.html').write_text('家里网络、家庭网', 'utf-8'); assembly.main()
            (self.dist/'index.html').write_text(term + '来电', 'utf-8')
            with self.assertRaises(SystemExit) as stopped: assembly.main()
            self.assertEqual(stopped.exception.code, 1)
            (self.dist/'index.html').write_text('验证码：' + '123456', 'utf-8')
            with self.assertRaises(SystemExit) as stopped: assembly.main()
            self.assertEqual(stopped.exception.code, 1)

if __name__ == '__main__': unittest.main()

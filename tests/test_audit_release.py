"""The repair generation keeps rollback bytes and never hides inventory drift."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

scripts = Path(__file__).resolve().parents[1] / 'scripts'
spec = importlib.util.spec_from_file_location('audit_release', scripts / 'prepare-audit-release.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class AuditRelease(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='audit-release-test-')
        self.root = Path(self.temp.name)
        self.baseline = self.root / 'baseline'
        self.candidate = self.root / 'candidate'
        for folder in (self.baseline, self.candidate):
            folder.mkdir()
            (folder / 'index.html').write_text('<h1>原稿</h1>', encoding='utf8')
            (folder / '404.html').write_text('<h1>没找到</h1>', encoding='utf8')
            (folder / 'app.js').write_text('void 0;', encoding='utf8')
        h = audit.module('hybrid-release')
        files = h.inventory(self.baseline)
        manifest = {
            'schema': 'wly.hybrid-release.v1', 'files': files,
            'release_id': audit.hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest(),
            'routes': ['/', '/404.html'], 'baseline_files': files,
            'accepted_pages': {}, 'temporary_href_mappings': [],
        }
        h.write(self.baseline / h.MANIFEST, manifest)

    def tearDown(self):
        self.temp.cleanup()

    def test_changed_pages_and_assets_are_bound_to_rollback_identity(self):
        (self.candidate / 'index.html').write_text('<h1>原稿</h1><meta name="description" content="原稿">', encoding='utf8')
        (self.candidate / 'app-new.js').write_text('void 1;', encoding='utf8')
        manifest = audit.finalize_release(self.baseline, self.candidate, {}, 'fixture-commit')
        self.assertEqual(manifest['rollback_ref'], 'fixture-commit')
        self.assertEqual(manifest['baseline_files'], json.loads((self.baseline / 'release-manifest.json').read_text('utf8'))['files'])
        self.assertEqual(set(manifest['accepted_pages']), {'/'})
        self.assertIn('app-new.js', manifest['release_overlay'])
        self.assertFalse(manifest['audit_repair']['publication_performed'])
        self.assertFalse(manifest['audit_repair']['image_design_changed'])

    def test_disappearing_existing_asset_is_rejected(self):
        (self.candidate / 'app.js').rename(self.root / 'retained-old-app.js')
        with self.assertRaisesRegex(ValueError, 'cannot remove'):
            audit.finalize_release(self.baseline, self.candidate, {})

    def test_manifest_still_rejects_tampering_after_repair(self):
        audit.finalize_release(self.baseline, self.candidate, {})
        (self.candidate / 'app.js').write_text('changed after repair', encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'bytes differ'):
            audit.module('hybrid-release').verify_release(self.candidate)

    def test_future_typeset_build_keeps_live_cache_and_in_place_updates(self):
        typeset = audit.module('build-typeset-site')
        source = "import{deriveB2Model} from './b2-access-model-fixture.js';"
        fixed = typeset.patch_b2(source)
        self.assertIn('function syncChildren(', fixed)
        self.assertIn('function cockpitReadCache(', fixed)
        self.assertIn('function cockpitReadLast(', fixed)
        self.assertIn('Cockpit consumes the shared site-live v1 last-read cache.', fixed)
        self.assertIn("from './b2-access-model-fixture.js'", fixed)
        self.assertEqual(fixed, typeset.patch_b2(fixed))

    def test_retained_topic_requires_same_original_sentence_and_occurrence_count(self):
        h=audit.module('hybrid-release')
        before='<p>退役PersonalOS运行时不恢复；其已取得日志按现有来源链处理。</p>'
        after='<meta name="description" content="公开原稿">'+before
        finding={'type':'excluded_topic','matched':'PersonalOS','offset':after.index('PersonalOS')}
        self.assertTrue(h.unchanged_topic_text(before,after,finding))
        changed=after.replace('运行时不恢复','正在恢复运行时')
        self.assertFalse(h.unchanged_topic_text(before,changed,{**finding,'offset':changed.index('PersonalOS')}))
        repeated=after+before
        self.assertFalse(h.unchanged_topic_text(before,repeated,finding))
        self.assertFalse(h.unchanged_topic_text(before,after,{**finding,'type':'credential'}))
        crlf_after=('<head>\r\n<meta name="description" content="公开原稿">\r\n</head>'+before)
        self.assertTrue(h.unchanged_topic_text(before,crlf_after,{**finding,'offset':crlf_after.index('PersonalOS')}))

    def test_general_cognition_review_is_not_a_legal_retrial(self):
        builder=audit.module('build-assembled-site')
        for separator in ('\n','\\n','\\\\n'):
            text='跨项目认知审计'+separator+'给我看的分析按日期存档；再审时先对照上次哪些问题解决了'
            match=next(builder.EXCLUDED_TOPICS.finditer(text))
            self.assertTrue(builder.is_topic_word_exception(text,match))
        text='私人诉讼的再审申请'
        match=next(m for m in builder.EXCLUDED_TOPICS.finditer(text) if m[0]=='再审')
        self.assertFalse(builder.is_topic_word_exception(text,match))
        mixed='跨项目认知审计\n给我看的分析按日期存档；再审时先对照上次哪些问题解决了。法院再审'
        matches=[m for m in builder.EXCLUDED_TOPICS.finditer(mixed) if m[0]=='再审']
        self.assertTrue(builder.is_topic_word_exception(mixed,matches[0]))
        self.assertFalse(builder.is_topic_word_exception(mixed,matches[1]))

    def test_topic_reuse_cannot_hide_changed_quoted_or_long_sentences(self):
        h=audit.module('hybrid-release')
        for before,after in [
            ('<p>配置关键词："再审"。</p>','<p>我的法院程序明天提交"再审"。</p>'),
            ('<p>配置关键词：<span id="term">再审</span>。</p>','<p>我的法院程序明天提交<span id="term">再审</span>。</p>'),
            ('<p>'+'甲'*64+'再审'+'甲'*64+'</p>','<p>'+'甲'*64+'再审'+'甲'*65+'再审'+'甲'*64+'</p>'),
            ('window.INDEX=[{"href":"/old/","title":"旧句","detail":"配置关键词：再审"}];','window.INDEX=[{"href":"/new/","title":"新句","detail":"配置关键词：再审"}];'),
        ]:
            for match in h.re.finditer('再审',after):
                self.assertFalse(h.unchanged_topic_text(before,after,{'type':'excluded_topic','matched':'再审','offset':match.start()}))

    def test_public_html_path_removal_preserves_escaped_placeholders_and_prose(self):
        pub=audit.module('audit-page-publication')
        original='<p>新目录 V:\\Personal\\Projects\\&lt;name&gt;，再继续。</p>'
        self.assertEqual(pub.scrub_html_literals(original,[],'/fixture/'),'<p>新目录 &lt;name&gt;，再继续。</p>')
        original='<p title="先读 E:\\Fixture\\A&amp;B.txt。">先读 E:\\Fixture\\A&amp;B.txt。继续。</p>'
        self.assertEqual(pub.scrub_html_literals(original,[],'/fixture/'),'<p title="先读 。">先读 。继续。</p>')


if __name__ == '__main__':
    unittest.main()

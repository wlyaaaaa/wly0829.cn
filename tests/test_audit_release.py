"""The repair generation keeps rollback bytes and never hides inventory drift."""
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest

scripts = Path(__file__).resolve().parents[1] / 'scripts'
spec = importlib.util.spec_from_file_location('audit_release', scripts / 'prepare-audit-release.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
POLICY_UNAVAILABLE = bool(os.environ.get('CI')) and not (Path(__file__).resolve().parents[1] / '.publish/private/rule-public-policy.json').is_file()


def private_fixture(identity): return audit.module('build-assembled-site').load_policy()['fixture_values'][identity]
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

    @unittest.skipIf(POLICY_UNAVAILABLE, 'private publication policy is unavailable in CI')
    def test_retained_topic_requires_same_original_sentence_and_occurrence_count(self):
        h=audit.module('hybrid-release')
        before=private_fixture('sha256:88382f359ac1b3fd62e1418115f62b5629c2d220a41897a682d3dc40289620d5')
        after='<meta name="description" content="公开原稿">'+before
        finding={'type':'excluded_topic','matched':private_fixture('sha256:29de2b3769424e81047f6cb4ca162aeab9427445c943e10b534eecc608b708ff'),'offset':after.index(private_fixture('sha256:29de2b3769424e81047f6cb4ca162aeab9427445c943e10b534eecc608b708ff'))}
        self.assertTrue(h.unchanged_topic_text(before,after,finding))
        changed=after.replace('运行时不恢复','正在恢复运行时')
        self.assertFalse(h.unchanged_topic_text(before,changed,{**finding,'offset':changed.index(private_fixture('sha256:29de2b3769424e81047f6cb4ca162aeab9427445c943e10b534eecc608b708ff'))}))
        repeated=after+before
        self.assertFalse(h.unchanged_topic_text(before,repeated,finding))
        self.assertFalse(h.unchanged_topic_text(before,after,{**finding,'type':'credential'}))
        crlf_after=('<head>\r\n<meta name="description" content="公开原稿">\r\n</head>'+before)
        self.assertTrue(h.unchanged_topic_text(before,crlf_after,{**finding,'offset':crlf_after.index(private_fixture('sha256:29de2b3769424e81047f6cb4ca162aeab9427445c943e10b534eecc608b708ff'))}))

    @unittest.skipIf(POLICY_UNAVAILABLE, 'private publication policy is unavailable in CI')
    def test_general_review_exception_keeps_topic_boundary(self):
        builder=audit.module('build-assembled-site')
        for separator in ('\n','\\n','\\\\n'):
            text='跨项目认知审计'+separator+private_fixture('sha256:6f344cebb85b0c1235c9a23ab3e40e1932206aa78b7be479cf2432e0362fd731')
            match=next(builder.EXCLUDED_TOPICS.finditer(text))
            self.assertTrue(builder.is_topic_word_exception(text,match))
        text=private_fixture('sha256:6a5cc44f5f256403387d7c926fcf0cfda31b1943e3cd2ad6dca4e64137070a44')
        match=next(m for m in builder.EXCLUDED_TOPICS.finditer(text) if m[0]==private_fixture('sha256:537f5369619d5c483c44f2ecbb547ef2db7e99d0fa1f9268259020efe81b24cd'))
        self.assertFalse(builder.is_topic_word_exception(text,match))
        mixed=private_fixture('sha256:6215a7b363d1f0ea4324237c5917cb74e272e504e040ac0bd29023c85d1e65b7')
        matches=[m for m in builder.EXCLUDED_TOPICS.finditer(mixed) if m[0]==private_fixture('sha256:537f5369619d5c483c44f2ecbb547ef2db7e99d0fa1f9268259020efe81b24cd')]
        self.assertTrue(builder.is_topic_word_exception(mixed,matches[0]))
        self.assertFalse(builder.is_topic_word_exception(mixed,matches[1]))

    @unittest.skipIf(POLICY_UNAVAILABLE, 'private publication policy is unavailable in CI')
    def test_topic_reuse_cannot_hide_changed_quoted_or_long_sentences(self):
        h=audit.module('hybrid-release')
        fixtures=audit.module('build-assembled-site').load_policy()['fixture_values']
        for before,after in [
            (fixtures['sha256:1262d728431454bc06c2c9a5bbb4d0743f9620e824921a210e5ea582bfe17503'],fixtures['sha256:51c68047468e2c8fde4c7a4807a4c2d2afbb183b6cd55fbb91a3a0c29ea28ef7']),
            (private_fixture('sha256:31e36877095da4fc120fdddfb6f3e640346db271d7ef6554d3919cd6c7935be6'),private_fixture('sha256:9c39da752f633d743e6b7ad471df8158409f59b573345a8ed675eb10793cf59b')),
            ('<p>'+'甲'*64+private_fixture('sha256:537f5369619d5c483c44f2ecbb547ef2db7e99d0fa1f9268259020efe81b24cd')+'甲'*64+'</p>','<p>'+'甲'*64+private_fixture('sha256:537f5369619d5c483c44f2ecbb547ef2db7e99d0fa1f9268259020efe81b24cd')+'甲'*65+private_fixture('sha256:537f5369619d5c483c44f2ecbb547ef2db7e99d0fa1f9268259020efe81b24cd')+'甲'*64+'</p>'),
            (fixtures['sha256:9f21cec0e02ff06d155c9cd7ac71a35b8e3384a797c37ffda098d0a88265d060'],fixtures['sha256:c066cf21525791018c8f4ef4f33e1cd37d4af8fcc9a6d991e880f8fc3f44cda7']),
        ]:
            for match in h.re.finditer(private_fixture('sha256:537f5369619d5c483c44f2ecbb547ef2db7e99d0fa1f9268259020efe81b24cd'),after):
                self.assertFalse(h.unchanged_topic_text(before,after,{'type':'excluded_topic','matched':private_fixture('sha256:537f5369619d5c483c44f2ecbb547ef2db7e99d0fa1f9268259020efe81b24cd'),'offset':match.start()}))

    def test_public_html_preserves_authored_paths_and_escaped_placeholders(self):
        pub=audit.module('audit-page-publication')
        original='<p>新目录 V:\\Personal\\Projects\\&lt;name&gt;，再继续。</p>'
        self.assertEqual(pub.scrub_html_literals(original,[],'/fixture/'),original)
        original='<p title="先读 E:\\Fixture\\A&amp;B.txt。">先读 E:\\Fixture\\A&amp;B.txt。继续。</p>'
        self.assertEqual(pub.scrub_html_literals(original,[],'/fixture/'),original)


if __name__ == '__main__':
    unittest.main()

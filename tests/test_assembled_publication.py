"""Publication gates: missing resources, public exclusions and domain preservation."""
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('publish_builder',Path(__file__).resolve().parents[1]/'scripts/build-assembled-site.py')
builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)
POLICY_UNAVAILABLE = bool(os.environ.get('CI')) and not (Path(__file__).resolve().parents[1] / '.publish/private/rule-public-policy.json').is_file()

def private_fixture(identity): return builder.load_policy()['fixture_values'][identity]
class PublicationGate(unittest.TestCase):
    def setUp(self):
        self.root=Path(tempfile.mkdtemp(prefix='publication-test-'))
        self.site=self.root/'site';self.site.mkdir();self.report=self.root/'report.json'
        (self.site/'index.html').write_text('<html><script src="/app.js"></script><a href="/404.html">404</a></html>',encoding='utf8')
        (self.site/'404.html').write_text('<html>Missing page</html>',encoding='utf8')
        (self.site/'app.js').write_text('void 0;',encoding='utf8')
        (self.site/'CNAME').write_text('wly0829.cn\n',encoding='utf8')
        self.previous_root=builder.ROOT;builder.ROOT=self.root
        config=self.root/'config';config.mkdir()
        body='<div class="source-prose"><p>合成原文</p></div>'
        pin={'version':'E207','documents':{'AGENTS.md':{'source_sha256':'fixture-source','approved_omitted_count':0,'rendered_text_sha256':builder.prose_digest(body)}}}
        (config/'assembled-rules-pin.json').write_text(json.dumps(pin),encoding='utf8')
        data={'screens':[{'render_mode':'source_text','source_version':'原文 E207 版','source_meta':{'relative_file':'AGENTS.md','source_sha256':'fixture-source','version':'E207','omitted_count':0}}]}
        page=self.site/'rules/charter/index.html';page.parent.mkdir(parents=True)
        page.write_text('<p class="source-version">原文 E207 版</p>'+body+'<script id="page-data">'+json.dumps(data)+'</script>',encoding='utf8')
    def tearDown(self):builder.ROOT=self.previous_root
    def run_gate(self,block=False):
        with contextlib.redirect_stdout(io.StringIO()):
            if block:
                with self.assertRaises(SystemExit): builder.validate(self.site,self.report)
            else: self.assertTrue(builder.validate(self.site,self.report)['ready_to_publish'])
        return json.loads(self.report.read_text('utf8'))
    def test_complete_site(self): self.run_gate()
    def test_gallery_full_image_is_a_required_resource(self):
        page=self.site/'index.html'
        page.write_text('<script id="page-data">{"screens":[{"shots":[{"src":"/thumbnail.webp","full":"/absent-original.webp"}]}]}</script>',encoding='utf8')
        (self.site/'thumbnail.webp').write_bytes(b'fixture thumbnail')
        result=self.run_gate(True)
        self.assertIn('/absent-original.webp',{row['reference'] for row in result['missing_references']})
    def test_missing_lazy_import_and_anchor(self):
        (self.site/'index.html').write_text('<html><script src="/app.js"></script><img data-lazy-src="missing.avif"><a href="/404.html#absent">404</a></html>',encoding='utf8')
        (self.site/'app.js').write_text('import "./missing-runtime.js";',encoding='utf8')
        result=self.run_gate(True)
        self.assertEqual({x['reference'] for x in result['missing_references']},{'missing.avif','/404.html#absent','./missing-runtime.js'})
    def test_technical_path_allowed(self):
        (self.site/'404.html').write_text('<html><code>E:\\Tools\\helper.ps1</code></html>',encoding='utf8');self.run_gate()
    @unittest.skipIf(POLICY_UNAVAILABLE, 'private publication policy is unavailable in CI')
    def test_excluded_topic_is_blocked(self):
        (self.site/'404.html').write_text('<html>personal-'+private_fixture('sha256:7d169dba7fa090ebca96e3fac8a97954da07be1b11fe9c9842434c281e886189'),encoding='utf8')
        result=self.run_gate(True);self.assertEqual(result['findings'][0]['type'],'excluded_topic')
        self.assertIn('column',result['findings'][0])
    def test_relative_private_filename(self):
        (self.site/'聊天记录-示例.txt').write_text('Synthetic fixture',encoding='utf8')
        result=self.run_gate(True);self.assertTrue(any(x['type']=='private_filename' for x in result['findings']))
    @unittest.skipIf(POLICY_UNAVAILABLE, 'private publication policy is unavailable in CI')
    def test_writing_role_keeps_topic_boundary(self):
        (self.site/'404.html').write_text(private_fixture('sha256:bcf7fe8e8182d78f19b210eaa8251422bfe3668862f6c2a979bf439c02858fc7'),encoding='utf8')
        self.run_gate()
        (self.site/'404.html').write_text(private_fixture('sha256:a09f75ce4296d20cc67149eb376c5f0a569cb7643dee21044fde2c2e1be1d330'),encoding='utf8')
        result=self.run_gate(True)
        self.assertTrue(any(x['type']=='excluded_topic' and x['matched']==private_fixture('sha256:4dc1478b13feba0dc68b323ca22be6b65fef09cd6354cad3f706710b724e7c51') for x in result['findings']))
    def test_binary_credentials_and_domain(self):
        (self.site/'image.png').write_bytes(b'\x00sk-'+b'X'*24+b'\x00')
        (self.site/'CNAME').write_text('wrong.example\n',encoding='utf8')
        result=self.run_gate(True);self.assertEqual({x['type'] for x in result['findings']},{'credential','domain_mismatch'})
    def test_source_output_disjoint(self):
        with self.assertRaises(ValueError): builder.build(self.site,self.site/'child',self.report,False)
        self.assertFalse((self.site/'child').exists())
    def test_input_domain_is_never_overwritten(self):
        (self.site/'CNAME').write_text('different.example\n',encoding='utf8')
        with self.assertRaises(ValueError): builder.build(self.site,self.root/'output',self.report,False)
        self.assertFalse((self.root/'output').exists())
    @unittest.skipIf(POLICY_UNAVAILABLE, 'private publication policy is unavailable in CI')
    def test_exact_exception_phrase(self):
        (self.site/'404.html').write_text(private_fixture('sha256:6eb6a5db01e74d1efcb005ff29593acd2a9333a6f4eb93365f26610e81bad5b2'),encoding='utf8');self.run_gate()
        (self.site/'404.html').write_text(private_fixture('sha256:6e3575bc7b0fdd7e34e3abd1f88a999179c7d6dca1c0971d6e7bba98a3050b9e'),encoding='utf8')
        result=self.run_gate(True);self.assertEqual(len(result['findings']),1)
    def test_repository_boundaries(self):
        builder.PRIVATE_REPOS.add('owner/demo')
        try:
            self.assertEqual(builder.clean_repo_bindings('owner/demo-public'),'owner/demo-public')
            self.assertTrue(builder.clean_repo_bindings('owner/demo').startswith('private-project-'))
            with self.assertRaises(ValueError): builder.clean_repo_bindings('https://github.com/owner/demo','page-data.repo_url')
        finally: builder.PRIVATE_REPOS.discard('owner/demo')
    def test_frozen_rule_checks_label_source_and_actual_prose(self):
        config=self.root/'config';config.mkdir(exist_ok=True)
        body='<div class="source-prose"><p>原文字甲 <a href="agents.privacy-data.md">隐私规则</a> <code>tool -a -b</code></p></div>'
        expected={'version':'E207','documents':{'AGENTS.md':{'source_sha256':'source-proof','approved_omitted_count':0,'rendered_text_sha256':builder.prose_digest(body)}}}
        (config/'assembled-rules-pin.json').write_text(json.dumps(expected),encoding='utf8')
        page=self.site/'rules/charter/index.html';page.parent.mkdir(parents=True,exist_ok=True)
        data={'screens':[{'render_mode':'source_text','source_version':'原文 E207 版','source_meta':{'relative_file':'AGENTS.md','source_sha256':'source-proof','version':'E207','omitted_count':0}}]}
        def document(label='E207',content=body):
            return '<p class="source-version">原文 '+label+' 版</p>'+content+'<script id="page-data">'+json.dumps(data)+'</script>'
        previous=builder.ROOT;builder.ROOT=self.root
        try:
            page.write_text(document(),encoding='utf8')
            self.assertEqual(builder.rule_pin_findings(self.site,[page]),[])
            page.write_text(document('E206'),encoding='utf8')
            self.assertIn('rule_version_not_pinned',{x['type']for x in builder.rule_pin_findings(self.site,[page])})
            page.write_text(document(content=body.replace('原文字甲','原文字乙')),encoding='utf8')
            self.assertIn('rule_original_content_mismatch',{x['type']for x in builder.rule_pin_findings(self.site,[page])})
            page.write_text(document(content=body.replace('tool -a -b','tool-a-b')),encoding='utf8')
            self.assertIn('rule_original_content_mismatch',{x['type']for x in builder.rule_pin_findings(self.site,[page])})
            page.write_text(document(content=body.replace('agents.privacy-data.md','agents.authorization.md')),encoding='utf8')
            self.assertIn('rule_original_content_mismatch',{x['type']for x in builder.rule_pin_findings(self.site,[page])})
        finally:builder.ROOT=previous
    def test_missing_rule_group_and_table_cell_boundaries(self):
        (self.site/'rules').rename(self.root/'removed-rules')
        result=self.run_gate(True)
        self.assertTrue(any(x['type']=='pinned_rule_page_missing' for x in result['findings']))
        self.assertNotEqual(builder.prose_digest('<table><tr><td>A</td><td>BC</td></tr></table>',True),builder.prose_digest('<table><tr><td>AB</td><td>C</td></tr></table>',True))

if __name__=='__main__': unittest.main()

"""Publication gates: missing resources, public exclusions and domain preservation."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('publish_builder',Path(__file__).resolve().parents[1]/'scripts/build-assembled-site.py')
builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)

class PublicationGate(unittest.TestCase):
    def setUp(self):
        self.root=Path(tempfile.mkdtemp(prefix='publication-test-'))
        self.site=self.root/'site';self.site.mkdir();self.report=self.root/'report.json'
        (self.site/'index.html').write_text('<html><script src="/app.js"></script><a href="/404.html">404</a></html>',encoding='utf8')
        (self.site/'404.html').write_text('<html>Missing page</html>',encoding='utf8')
        (self.site/'app.js').write_text('void 0;',encoding='utf8')
        (self.site/'CNAME').write_text('wly0829.cn\n',encoding='utf8')
    # The Windows task owner recycles the dedicated test parent after the run.
    def run_gate(self,block=False):
        with contextlib.redirect_stdout(io.StringIO()):
            if block:
                with self.assertRaises(SystemExit): builder.validate(self.site,self.report)
            else: self.assertTrue(builder.validate(self.site,self.report)['ready_to_publish'])
        return json.loads(self.report.read_text('utf8'))
    def test_complete_site(self): self.run_gate()
    def test_missing_lazy_import_and_anchor(self):
        (self.site/'index.html').write_text('<html><script src="/app.js"></script><img data-lazy-src="missing.avif"><a href="/404.html#absent">404</a></html>',encoding='utf8')
        (self.site/'app.js').write_text('import "./missing-runtime.js";',encoding='utf8')
        result=self.run_gate(True)
        self.assertEqual({x['reference'] for x in result['missing_references']},{'missing.avif','/404.html#absent','./missing-runtime.js'})
    def test_technical_path_allowed_and_topic_blocked(self):
        (self.site/'404.html').write_text('<html><code>E:\\Tools\\helper.ps1</code></html>',encoding='utf8');self.run_gate()
        (self.site/'404.html').write_text('<html>personal-'+'romance</html>',encoding='utf8')
        result=self.run_gate(True);self.assertEqual(result['findings'][0]['type'],'excluded_topic')
        self.assertIn('column',result['findings'][0])
    def test_relative_private_filename(self):
        (self.site/'聊天记录-示例.txt').write_text('Synthetic fixture',encoding='utf8')
        result=self.run_gate(True);self.assertTrue(any(x['type']=='private_filename' for x in result['findings']))
    def test_binary_credentials_and_domain(self):
        (self.site/'image.png').write_bytes(b'\x00sk-'+b'X'*24+b'\x00')
        (self.site/'CNAME').write_text('wrong.example\n',encoding='utf8')
        result=self.run_gate(True);self.assertEqual({x['type'] for x in result['findings']},{'credential','domain_mismatch'})
    def test_source_output_disjoint(self):
        with self.assertRaises(ValueError): builder.build(self.site,self.site/'child',self.report,False)
        self.assertFalse((self.site/'child').exists())
    def test_exact_legal_phrase_and_repo_boundaries(self):
        (self.site/'404.html').write_text('<html>正式法律文书仍交 Claude</html>',encoding='utf8');self.run_gate()
        (self.site/'404.html').write_text('<html>正式法律文书仍交 Claude；法律</html>',encoding='utf8')
        result=self.run_gate(True);self.assertEqual(len(result['findings']),1)
        builder.PRIVATE_REPOS.add('owner/demo')
        try:
            self.assertEqual(builder.clean_repo_bindings('owner/demo-public'),'owner/demo-public')
            self.assertTrue(builder.clean_repo_bindings('owner/demo').startswith('private-project-'))
            with self.assertRaises(ValueError): builder.clean_repo_bindings('https://github.com/owner/demo','page-data.repo_url')
        finally: builder.PRIVATE_REPOS.discard('owner/demo')

if __name__=='__main__': unittest.main()

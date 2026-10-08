"""Typeset originals preserve the existing rule source and prose admission gates."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('rule_builder',ROOT/'scripts/build-assembled-site.py')
builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)
spec=importlib.util.spec_from_file_location('typeset_builder',ROOT/'scripts/build-typeset-site.py')
typeset=importlib.util.module_from_spec(spec);spec.loader.exec_module(typeset)


class TypesetRulePublication(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='typeset-rule-test-')
        self.root=Path(self.temp.name);self.site=self.root/'site';self.site.mkdir()
        self.document='docs/contracts/agents.authorization.md'
        self.asset=self.site/'_typeset/rule-sources/original.md';self.asset.parent.mkdir(parents=True)
        self.asset.write_text('# 用户授权\n\n合成原文 `tool -a -b`。\n',encoding='utf8')
        self.expected='<div class="source-prose"><h2>用户授权</h2><p>合成原文 <code>tool -a -b</code>。</p><p><a href="agents.privacy-data.md">资料</a></p></div>'
        self.rendered='<div class="ct-source-body"><div class="ct-heading tb">用户授权</div><p>合成原文 <code>tool -a -b</code>。</p><p><a data-href="/rules/privacy-data/">资料</a></p></div>'
        config=self.root/'config';config.mkdir()
        pin={'version':'E207','documents':{self.document:{'source_sha256':builder.sha(self.asset),
             'rendered_text_sha256':builder.prose_digest(self.expected),'approved_omitted_count':0}}}
        (config/'assembled-rules-pin.json').write_text(json.dumps(pin),encoding='utf8')
        self.previous_root=builder.ROOT;builder.ROOT=self.root
        self.page=self.site/'rules/authorization/index.html';self.page.parent.mkdir(parents=True)
        self.row={'render_mode':'typeset','shape':'source_text','source_version':'原文 · E207 版，一字不改',
            'source_meta':{'relative_file':self.document,'version':'E207','source_sha256':builder.sha(self.asset),
                           'omitted_count':0,'src':'/_typeset/rule-sources/original.md','original_html':self.rendered}}

    def tearDown(self):
        builder.ROOT=self.previous_root;self.temp.cleanup()

    def findings(self):
        self.page.write_text('<script id="page-data">'+json.dumps({'screens':[self.row]},ensure_ascii=False)+'</script>',encoding='utf8')
        return builder.rule_pin_findings(self.site,[self.page])

    def test_real_typeset_original_passes_and_source_asset_enters_closure(self):
        self.assertEqual(self.findings(),[])
        self.assertIn(('/_typeset/rule-sources/original.md',False),list(builder.nested_refs({'screens':[self.row]})))
        self.assertEqual(typeset.original_rule_html('<p>原文 · E207 版</p>'+self.rendered),self.rendered)

    def test_page_label_source_and_inspected_release_must_match(self):
        version = 'E207'; pin = {'version': version}; release = {'release_id': version}
        page = {'based_on': {'release': version}, 'registry': {'numbers': [{'id': 'n-release', 'text': version + '（已核验）'}]}}
        builder.rule_contract.assert_rule_page_version(page, pin, release)
        for field in ('label', 'source', 'inspect'):
            with self.subTest(field=field):
                changed = json.loads(json.dumps(page)); inspected = dict(release)
                if field == 'label': changed['registry']['numbers'][0]['text'] = 'E208（旧标注）'
                elif field == 'source': changed['based_on']['release'] = 'E208'
                else: inspected['release_id'] = 'E208'
                with self.assertRaisesRegex(ValueError, 'versions differ'):
                    builder.rule_contract.assert_rule_page_version(changed, pin, inspected)

    def test_e187_and_e190_are_still_stale(self):
        for version in ('E187','E190'):
            with self.subTest(version=version):
                self.row['source_version']='原文 · '+version+' 版，一字不改';self.row['source_meta']['version']=version
                self.assertIn('rule_version_not_pinned',{f['type'] for f in self.findings()})

    def test_claimed_hash_does_not_admit_a_false_source_asset(self):
        self.asset.write_text('伪造的来源',encoding='utf8')
        self.assertIn('rule_original_source_evidence_mismatch',{f['type'] for f in self.findings()})

    def test_changed_original_code_and_link_are_rejected(self):
        for rendered in (self.rendered.replace('tool -a -b','tool-a-b'),self.rendered.replace('/rules/privacy-data/','/rules/protected-actions/')):
            with self.subTest(rendered=rendered):
                self.row['source_meta']['original_html']=rendered
                self.assertIn('rule_original_content_mismatch',{f['type'] for f in self.findings()})

    def test_missing_metadata_and_stale_source_hash_are_rejected(self):
        self.row['source_meta']['source_sha256']='unverified'
        self.assertIn('rule_source_not_pinned',{f['type'] for f in self.findings()})
        self.row.pop('source_meta')
        self.assertIn('rule_original_source_evidence_mismatch',{f['type'] for f in self.findings()})


if __name__=='__main__':unittest.main()

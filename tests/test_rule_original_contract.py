"""Strict fixed-source excerpts, public projection and exact canonical topic units."""
import copy
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
import rule_original_contract as contract
spec=importlib.util.spec_from_file_location('current_rule_builder',ROOT/'scripts/build-assembled-site.py')
builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)
spec=importlib.util.spec_from_file_location('current_rule_navigation',ROOT/'scripts/repair-release-navigation.py')
nav=importlib.util.module_from_spec(spec);spec.loader.exec_module(nav)


class FixedRuleOriginal(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='fixed-rule-original-');self.root=Path(self.temp.name)
        self.previous_root=builder.ROOT;builder.ROOT=self.root
        self.site=self.root/'site';self.page=self.site/'rules/authorization/index.html';self.page.parent.mkdir(parents=True)
        self.document='docs/contracts/agents.authorization.md';self.identity='rule-authorization/rule-authorization-05'
        self.raw='# 用户授权\n\nowner: `E:\\Fixture\\rules`\n\n法律原文只允许已验证的规则原文。\n\n[资料](agents.privacy-data.md#公开个人数据分级表)\n'
        self.public=contract.public_markdown(self.raw,self.document)
        self.body='<div class="source-prose">'+contract.render_markdown(self.public)+'</div>'
        self.asset=self.site/'_typeset/rule-sources/original.md';self.asset.parent.mkdir(parents=True);self.asset.write_text(self.public,encoding='utf8')
        original=contract.sha_bytes(self.raw.encode());public=builder.sha(self.asset)
        self.pin={'schema':'wly.assembled-rules-pin.v2','version':'E214','documents':{self.document:{'source_sha256':original,'public_source_sha256':public}},
                  'excerpt_contract':{'id':contract.CONTRACT,'excerpts':{self.identity:{'page':'rule-authorization','screen':'rule-authorization-05',
                    'relative_file':self.document,'source_sha256':original,'approved_omitted_count':0,
                    'rendered_text_sha256':builder.prose_digest(contract.render_markdown(self.public),True)}}}}
        config=self.root/'config';config.mkdir();(config/'assembled-rules-pin.json').write_text(json.dumps(self.pin),encoding='utf8')
        self.row={'id':'rule-authorization-05','shape':'source_text','render_mode':'typeset','source_version':'原文 · E214 版',
                  'source_meta':{'relative_file':self.document,'source_sha256':original,'public_source_sha256':public,'version':'E214',
                                 'excerpt_contract':contract.CONTRACT,'excerpt_id':self.identity,'omitted_count':0,
                                 'src':'/_typeset/rule-sources/original.md','original_html':self.body}}

    def tearDown(self):builder.ROOT=self.previous_root;self.temp.cleanup()
    def text(self):
        text='<script id="page-data">'+json.dumps({'screens':[self.row]},ensure_ascii=False).replace('</',r'<\/')+'</script>'
        self.page.write_text(text,encoding='utf8');return text
    def findings(self):self.text();return builder.rule_pin_findings(self.site,[self.page])
    def admitted(self,text,word='诉讼'):
        spans=builder.canonical_rule_topic_spans(self.site,self.page,text,self.pin)
        return [any(start<=match.start() and match.end()<=end for start,end in spans) for match in builder.EXCLUDED_TOPICS.finditer(text) if match[0]==word]

    def test_current_excerpt_and_separate_public_source_hash_pass(self):
        self.assertNotEqual(self.row['source_meta']['source_sha256'],self.row['source_meta']['public_source_sha256'])
        self.assertEqual(self.findings(),[])
        self.assertEqual(self.admitted(self.text(),'法律'),[True])

    def test_changed_text_link_version_source_and_projection_fail(self):
        original=copy.deepcopy(self.row)
        mutations=[lambda m:m.update(version='E208'),lambda m:m.update(source_sha256='unverified'),
                   lambda m:m.update(public_source_sha256=m['source_sha256']),lambda m:m.update(excerpt_id='other/screen'),
                   lambda m:m.update(original_html=m['original_html'].replace('只允许已验证','允许任何')),
                   lambda m:m.update(original_html=m['original_html'].replace('privacy-data','protected-actions'))]
        for mutation in mutations:
            with self.subTest(mutation=mutation):
                self.row=copy.deepcopy(original);mutation(self.row['source_meta']);self.assertTrue(self.findings())
                self.assertEqual(self.admitted(self.text(),'法律'),[False])
        self.row=original;self.asset.write_text('假的公开来源',encoding='utf8')
        self.assertIn('rule_original_source_evidence_mismatch',{finding['type'] for finding in self.findings()})

    def test_source_extra_and_unhashed_attribute_keep_the_original_topic_gate(self):
        original=self.row['source_meta']['original_html']
        for changed in [original.replace('</div>','<span class="source-extra">诉讼附加正文</span></div>'),
                        original.replace('<p>法律','<p data-note="诉讼">法律')]:
            with self.subTest(changed=changed):
                self.row['source_meta']['original_html']=changed
                self.assertEqual(self.findings(),[])
                self.assertEqual(self.admitted(self.text()),[False])

    def test_projection_keeps_code_placeholders_and_only_drops_metadata_resources(self):
        markup='<div class="source-prose"><code>E:\\<wbr>Fixture\\&lt;task-id&gt;\\child</code><img src="file:///E:/Fixture/title.png"></div>'
        projected=contract.project_original_html(markup)
        self.assertIn('（本机路径）&lt;task-id&gt;\\child',projected)
        self.assertNotIn('file:',projected)
        rendered=contract.project_original_html(markup,keep_render_dependencies=True)
        self.assertIn('file:///E:/Fixture/title.png',rendered)
        self.assertNotIn('E:\\Fixture',rendered)

    def test_cell_structure_and_only_declared_step_numbers_are_normalized(self):
        expected=contract.render_markdown('| A | B |\n|---|---|\n|甲|乙|')
        actual='<div class="ct-source-body">'+expected.replace('\n','')+'</div>'
        self.assertEqual(builder.prose_digest(expected,True),builder.typeset_prose_digest(actual))
        self.assertNotEqual(builder.typeset_prose_digest(actual.replace('甲','丙')),builder.prose_digest(expected,True))
        mobile='<div class="ct-source-body"><span data-table-header="true" data-table-col="0">A</span><span data-table-header="true" data-table-col="1">B</span><div data-table-row="0" data-table-col="0"><span class="table-label" data-echo="A">A：</span>甲</div><div data-table-row="0" data-table-col="1"><span class="table-label" data-echo="B">B：</span>乙</div></div>'
        self.assertEqual(builder.prose_digest(expected,True),builder.typeset_prose_digest(mobile))
        self.assertNotEqual(builder.prose_digest(expected,True),builder.typeset_prose_digest(mobile.replace('data-table-row="0" data-table-col="1"','data-table-row="0"')))
        expected=contract.render_markdown('1. **先读**原文\n2. 再做')
        actual='<div class="source-prose"><li><span class="ct-step-number">1</span><strong>先读</strong>原文</li><li><span class="ct-step-number">2</span>再做</li></div>'
        self.assertEqual(builder.prose_digest(expected,True),builder.typeset_prose_digest(actual))
        self.assertNotEqual(builder.prose_digest(expected,True),builder.typeset_prose_digest(actual.replace('再做','2再做')))

    def test_unicode_and_encoded_fragments_keep_the_same_actual_target(self):
        self.assertEqual(contract.source_link_target('agents.privacy-data.md#公开个人数据分级表'),
                         contract.source_link_target('/rules/privacy-data/#%E5%85%AC%E5%BC%80%E4%B8%AA%E4%BA%BA%E6%95%B0%E6%8D%AE%E5%88%86%E7%BA%A7%E8%A1%A8'))
        self.assertEqual(contract.source_link_target('../../templates/codex-home/AGENTS.md'),'/rule-sources/templates/codex-home/AGENTS.md')


class ExactLegacyNavigation(unittest.TestCase):
    def test_migration_targets_a_real_original_screen_and_keeps_the_old_reference(self):
        with tempfile.TemporaryDirectory(prefix='rule-navigation-') as temporary:
            root=Path(temporary);(root/'rules/privacy-data').mkdir(parents=True);(root/'kept').mkdir()
            (root/'index.html').write_text('首页',encoding='utf8');(root/'rules/index.html').write_text('新规则首页',encoding='utf8')
            target='/rules/privacy-data/#rule-privacy-data-07';old='/rules/?rule=privacy_data_contract#rule-panel-privacy_data_contract'
            (root/'rules/privacy-data/index.html').write_text('<section id="rule-privacy-data-07">原文</section>',encoding='utf8')
            data={'screens':[{'parts':[{'links':[{'href':old}]}]}]}
            page=root/'kept/index.html';page.write_text('<a href="'+old+'">规则</a><script id="page-data">'+json.dumps(data)+'</script>',encoding='utf8')
            self.assertEqual(nav.resolve_navigation(old,nav.page_inventory(root)),target)
            self.assertEqual(nav.restore_pending_links(root,nav.page_inventory(root)),['kept/index.html'])
            actual=json.loads(nav.PAGE_DATA.search(page.read_text('utf8'))[2])['screens'][0]['parts'][0]['links'][0]
            self.assertEqual(actual['href'],target);self.assertEqual(actual['original_href'],old)
            self.assertIn('href="'+target+'"',page.read_text('utf8'))
            self.assertIn('data-original-href="'+old+'"',page.read_text('utf8'))
            (root/'rules/privacy-data/index.html').write_text('锚点缺失',encoding='utf8')
            with self.assertRaises(ValueError):nav.resolve_navigation(old,nav.page_inventory(root))

    def test_old_current_href_cannot_be_hidden_by_unavailable_or_generic_original(self):
        with tempfile.TemporaryDirectory(prefix='rule-original-href-') as temporary:
            root=Path(temporary);(root/'rules/privacy-data').mkdir(parents=True);(root/'kept').mkdir()
            (root/'index.html').write_text('首页',encoding='utf8');(root/'rules/index.html').write_text('新首页',encoding='utf8')
            (root/'rules/privacy-data/index.html').write_text('<section id="rule-privacy-data-07">原文</section>',encoding='utf8')
            old='/rules/?rule=privacy_data_contract#rule-panel-privacy_data_contract';target='/rules/privacy-data/#rule-privacy-data-07'
            source_markup="<div class='source-prose'><a href='"+old+"'>冻结原文链接</a></div>"
            for original in ['/rules/privacy-data/#p-classification','/rules/privacy-data/']:
                data={'screens':[{'parts':[{'links':[{'href':old,'original_href':original}]}],
                                   'source_meta':{'original_html':source_markup}}]}
                page=root/'kept/index.html';page.write_text('<a href="'+old+'" data-original-href="'+original+'">规则</a><script id="page-data">'+json.dumps(data,ensure_ascii=False)+'</script>',encoding='utf8')
                self.assertEqual(nav.restore_pending_links(root,nav.page_inventory(root)),['kept/index.html'])
                actual=json.loads(nav.PAGE_DATA.search(page.read_text('utf8'))[2])
                self.assertEqual(actual['screens'][0]['parts'][0]['links'][0]['href'],target)
                self.assertEqual(actual['screens'][0]['parts'][0]['links'][0]['original_href'],original)
                self.assertEqual(actual['screens'][0]['source_meta']['original_html'],source_markup)
                self.assertIn('<a href="'+target+'" data-original-href="'+original+'">',page.read_text('utf8'))


if __name__=='__main__':unittest.main()

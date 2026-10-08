"""Strict fixed-source excerpts, public projection and exact canonical topic units."""
import copy
import contextlib, io
import html
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
import os
from unittest import mock

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
import rule_original_contract as contract
spec=importlib.util.spec_from_file_location('current_rule_builder',ROOT/'scripts/build-assembled-site.py')
builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)
spec=importlib.util.spec_from_file_location('standalone_rule_typeset',ROOT/'scripts/build-typeset-site.py')
typeset=importlib.util.module_from_spec(spec);spec.loader.exec_module(typeset)
spec=importlib.util.spec_from_file_location('standalone_rule_projection',ROOT/'scripts/prepare-rule-public-projection.py')
projection=importlib.util.module_from_spec(spec);spec.loader.exec_module(projection)
spec=importlib.util.spec_from_file_location('current_rule_navigation',ROOT/'scripts/repair-release-navigation.py')
nav=importlib.util.module_from_spec(spec);spec.loader.exec_module(nav)
spec=importlib.util.spec_from_file_location('fixed_rule_pin',ROOT/'scripts/prepare-rules-pin.py')
pin_generator=importlib.util.module_from_spec(spec);spec.loader.exec_module(pin_generator)


def private_fixture(identity): return contract.load_policy()['fixture_values'][identity]
POLICY_SKIP_REASON = ''
if os.environ.get('CI'):
    try: contract.load_policy()
    except contract.PolicyUnavailable as error: POLICY_SKIP_REASON = str(error)


class CurrentRuleException(unittest.TestCase):
    @unittest.skipIf(POLICY_SKIP_REASON, POLICY_SKIP_REASON)
    def test_unclosed_literal_cannot_hide_added_workbench_or_table_prose(self):
        for body in ('<div class="source-prose"><p>规则原文</p></div>', '<div class="source-prose"><table><tr><td>规则原文</td></tr></table></div>'):
            self.assertTrue(builder.typeset_prose_digest(body))
            for tag in ('code', 'pre'):
                modified = body.rsplit('</div>', 1)[0] + '<' + tag + private_fixture('sha256:431c1522f9c1030d0309ac8faab451fbbe3b23acd915c3592ab67b1aac0692dd')
                with self.assertRaisesRegex(ValueError, 'Unclosed literal'):
                    builder.typeset_prose_digest(modified)

    @unittest.skipIf(POLICY_SKIP_REASON, POLICY_SKIP_REASON)
    def test_original_resource_mutation_append_and_secret(self):
        pin=contract.load_pin(ROOT);self.assertTrue(builder.verified_current_rule_pin(pin))
        altered=copy.deepcopy(pin);altered['release_record_sha256']='0'*64
        self.assertFalse(builder.verified_current_rule_pin(altered))
        relative='docs/contracts/agents.privacy-data.md'
        raw=contract.public_markdown((contract.private_source_root(ROOT)/relative).read_text('utf8'),relative).encode()
        resource=next(path for path,row in pin['public_source_resources'].items() if row['relative_file']==relative)
        with tempfile.TemporaryDirectory(prefix='e221-rule-gate-') as folder:
            site=Path(folder)/'site';page=site/resource.lstrip('/');page.parent.mkdir(parents=True)
            report=Path(folder)/'report.json'
            original_repos=builder.PUBLIC_REPOS.copy();builder.PUBLIC_REPOS.add('wlyaaaaa/wly0829.cn')
            try:
                for name,payload in [('original',raw),('append',raw+private_fixture('sha256:5df24d07a2b978d216056fe9d8f9221d79155733ce7b2fef4ba613f7135a486a').encode()),('secret',raw+b'\nsk-'+b'X'*24)]:
                    page.write_bytes(payload)
                    with contextlib.redirect_stdout(io.StringIO()):
                        try:builder.validate(site,report)
                        except SystemExit:pass
                    types={row['type'] for row in json.loads(report.read_text('utf8'))['findings']}
                    if name=='original':self.assertFalse(types & {'private_path','excluded_topic','repository_not_public','credential'})
                    else:self.assertIn('credential' if name=='secret' else 'excluded_topic',types)
            finally:builder.PUBLIC_REPOS=original_repos

    @unittest.skipIf(POLICY_SKIP_REASON, POLICY_SKIP_REASON)
    def test_pinned_source_and_reader_prose_keep_the_topic_gate(self):
        fixture=FixedRuleOriginal('test_current_excerpt_and_separate_public_source_hash_pass');fixture.setUp()
        try:
            resource='/'+fixture.asset.relative_to(fixture.site).as_posix()
            fixture.pin['public_source_resources']={resource:{'public_source_sha256':builder.sha(fixture.asset)}}
            (fixture.root/'config/assembled-rules-pin.json').write_text(json.dumps(fixture.pin),encoding='utf8')
            fixture.page.write_text(fixture.text()+private_fixture('sha256:e93c74e5c345f31acd489b2bdea73f8ad67b494b48b90cf6417d1fa0820ddf06'),encoding='utf8')
            report=fixture.root/'report.json'
            with mock.patch.object(builder,'verified_current_rule_pin',return_value=True),contextlib.redirect_stdout(io.StringIO()):
                try:builder.validate(fixture.site,report)
                except SystemExit:pass
            findings=json.loads(report.read_text('utf8'))['findings']
            for page,expected in [(resource.lstrip('/'),{private_fixture('sha256:32bc0a3372fcf9cb2699e5d46eb51d73081d65bb18d82af3929001ee2240af6a')}),('rules/authorization/index.html',{private_fixture('sha256:32bc0a3372fcf9cb2699e5d46eb51d73081d65bb18d82af3929001ee2240af6a'),private_fixture('sha256:5bec26dc1e557d2319160bfafc61d21e48e569f3ded0ca7fb749a29b362f90c0'),private_fixture('sha256:c6f16d22ec1a62a390ffd9cfce2702dd6d3ed734c5533b136a5e2081031f614c'),private_fixture('sha256:205f3859abe469be388577ef8118a33bebb96430b7c792b7eb6afed36007ea80')})]:
                actual={f['matched'] for f in findings if f['type']=='excluded_topic' and f['file']==page}
                self.assertEqual(actual,expected)
        finally:fixture.tearDown()


@unittest.skipIf(POLICY_SKIP_REASON, POLICY_SKIP_REASON)
class SourceExcerptBoundaries(unittest.TestCase):
    previous='本人让 Claude 与 GPT 协作时'
    current='Claude 主持、和 GPT 协作时'
    page='rule-execution-coordination'

    def source(self, marker):
        first='# 分工与并行施工\n\n## 派子代理的原则\n\n主持的先定目标，再把完整材料交给施工者。'
        second=marker+'，按约法和模型清单分工。\n\n## 做错了怎么办\n\n保留已经有效的结果，修复真实失败。'
        return first,second,first+'\n\n'+second+'\n'

    def test_real_old_and_current_openings_preserve_both_complete_ranges(self):
        for marker in (self.previous,self.current):
            with self.subTest(marker=marker):
                first,second,raw=self.source(marker)
                rows=contract.excerpts(raw,self.page)
                self.assertEqual([(identity,text) for identity,text,_ in rows],
                    [(self.page+'/'+self.page+'-06',first),(self.page+'/'+self.page+'-07',second)])
                self.assertEqual(rows[0][2],{'from':None,'to':marker,'approved_omissions':[]})
                self.assertEqual(rows[1][2],{'from':marker,'to':None,'approved_omissions':[]})
                self.assertEqual(rows,contract.excerpts(raw.replace('\n','\r\n'),self.page))

    def test_missing_repeated_or_mixed_openings_remain_rejected(self):
        for marker in (self.previous,self.current):
            _,second,raw=self.source(marker)
            for invalid in (raw.replace(marker,'未知协作段首'),raw+'\n'+second,
                            raw+'\n'+(self.current if marker==self.previous else self.previous)+'，另一段。\n'):
                with self.subTest(marker=marker,invalid=invalid):
                    with self.assertRaisesRegex(ValueError,'boundary is not unique'):
                        contract.excerpts(invalid,self.page)

    def test_inline_quotations_are_not_a_second_source_boundary(self):
        for marker in (self.previous,self.current):
            first,second,raw=self.source(marker)
            quotation='旧新段首引用：'+self.previous+'；'+self.current+'。'
            rows=contract.excerpts(raw.replace(first,first+'\n\n'+quotation),self.page)
            self.assertEqual([text for _,text,_ in rows],[first+'\n\n'+quotation,second])

    def test_other_topic_reversed_boundaries_remain_rejected(self):
        with self.assertRaisesRegex(ValueError,'reversed boundaries'):
            contract.excerpts('## 受信任的 AI\n\n## 子代理和项目规则不扩大授权\n','rule-authorization')


@unittest.skipIf(POLICY_SKIP_REASON, POLICY_SKIP_REASON)
class PinSourceIntegrity(unittest.TestCase):
    def test_record_identity_and_same_length_source_tampering_remain_rejected(self):
        with tempfile.TemporaryDirectory(prefix='rule-pin-integrity-') as temporary:
            root=Path(temporary);source=b'fixed source bytes\n';(root/'AGENTS.md').write_bytes(source)
            record={'release_id':'E-fixture','remote_main_contains_commit':True,
                    'files':[{'relative_path':'AGENTS.md','bytes':len(source),'sha256':contract.sha_bytes(source)}]}
            record_path=root/'release.json'
            def write_record(value):
                payload=json.dumps(value).encode('utf8');record_path.write_bytes(payload)
                return contract.sha_bytes(payload)
            digest=write_record(record)
            with self.assertRaisesRegex(ValueError,'Inspect evidence'):
                pin_generator.generate(root,'wrong-record-sha','E-fixture')
            with self.assertRaisesRegex(ValueError,'formally released'):
                pin_generator.generate(root,digest,'E-other')
            not_released=copy.deepcopy(record);not_released['remote_main_contains_commit']=False
            with self.assertRaisesRegex(ValueError,'formally released'):
                pin_generator.generate(root,write_record(not_released),'E-fixture')
            digest=write_record(record);(root/'AGENTS.md').write_bytes(source.replace(b'fixed',b'alter'))
            with self.assertRaisesRegex(ValueError,'release inventory'):
                pin_generator.generate(root,digest,'E-fixture')


@unittest.skipIf(POLICY_SKIP_REASON, POLICY_SKIP_REASON)
class CharterArticleBodies(unittest.TestCase):
    def articles(self):
        return {number:f'**L{number} 条款标题。** 第{number}条正文。' for number in range(1,31)}

    def source(self, articles, between=None):
        body=''.join('- '+articles[number]+'\n'+(between or {}).get(number,'') for number in range(1,31))
        return '# 根规则\n\n## 我的 AI 约法\n\n### 第一章\n\n'+body+'\n## 每次都要做的几件事\n\n  - 后续导航。\n'

    def assert_articles(self, raw, articles):
        rows=contract.excerpts(raw,'charter')
        for identity,text,selection in rows:
            first,last=selection['articles']
            self.assertEqual(text,'\n\n'.join(articles[number] for number in range(first,last+1)),identity)
            self.assertEqual(selection,{'articles':[first,last],'approved_omissions':[]})

    def test_single_line_articles_keep_the_existing_exact_output(self):
        articles=self.articles();self.assert_articles(self.source(articles),articles)

    def test_indented_paragraphs_children_blank_lines_and_links_are_preserved(self):
        articles=self.articles()
        articles[4]+='  \n  这是缩进续行，保留 Markdown 硬换行。\n\n  - 第一子项 [资料](agents.privacy-data.md#公开个人数据分级表)。  \n  \n  - 第二子项。\n    更深的续行仍属于第二子项。'
        articles[22]+='\n  - 一个子项。\n  - 另一个子项，条数由原文决定。'
        raw=self.source(articles)
        self.assert_articles(raw,articles)
        self.assertEqual(contract.excerpts(raw,'charter'),contract.excerpts(raw.replace('\n','\r\n'),'charter'))

    def test_next_articles_chapter_explanations_and_navigation_are_not_appended(self):
        articles=self.articles();articles[10]+='\n  - 本条子项。'
        between={10:'\n### 下一章\n\n章节说明，不是上一条正文。\n  - 章节导航。\n\n',
                 17:'\n顶层说明，不属于上一条。\n  - 说明的缩进内容。\n\n'}
        self.assert_articles(self.source(articles,between),articles)

    def test_final_multiline_article_stops_before_the_following_section(self):
        articles=self.articles();articles[30]+='\n  - 最后条款的子项。\n    保留其完整续行。'
        self.assert_articles(self.source(articles),articles)

    def test_missing_and_duplicate_article_numbers_still_fail(self):
        raw=self.source(self.articles())
        for invalid in (raw.replace('- **L12 ','- **条款12 '),raw.replace('- **L12 ','- **L11 ')):
            with self.subTest(invalid=invalid):
                with self.assertRaisesRegex(ValueError,'30 unique articles'):
                    contract.excerpts(invalid,'charter')


@unittest.skipIf(POLICY_SKIP_REASON, POLICY_SKIP_REASON)
class SourceExcerptLinks(unittest.TestCase):
    def test_support_reference_preserves_source_meaning_without_a_broken_web_link(self):
        raw='<div class="source-prose"><a href="../claude-gpt-child-dispatch.md">派发说明</a></div>'
        public=contract.project_original_html(raw)
        self.assertIn('data-source-reference="../claude-gpt-child-dispatch.md"',public)
        self.assertNotIn(' href=',public)
        self.assertEqual(builder.typeset_prose_digest(raw),builder.typeset_prose_digest(public))

    def setUp(self):
        self.raw=('# 用户授权\n\n[做错了怎么办](agents.execution-coordination.md#做错了怎么办)\n\n'
                  '## 子代理和项目规则不扩大授权\n\n[范围外](https://outside.example/)\n\n## 受信任的 AI\n').encode('utf8')
        self.identity='rule-authorization/rule-authorization-05'
        text,selection=next((text,selection)for identity,text,selection in contract.excerpts(self.raw.decode(),'rule-authorization')if identity==self.identity)
        self.pin={'version':'E221','excerpt_contract':{'id':contract.CONTRACT,'excerpts':{self.identity:{
            'page':'rule-authorization','relative_file':'docs/contracts/agents.authorization.md',
            'source_sha256':contract.sha_bytes(self.raw),'selection':selection,
            'markdown_sha256':contract.sha_bytes(contract.public_markdown(text,'docs/contracts/agents.authorization.md',apply_omissions=False).encode('utf8'))}}}}

    def test_only_links_from_the_fixed_selected_source_are_admitted(self):
        targets=contract.excerpt_link_targets(self.pin,self.identity,self.raw)
        self.assertEqual(targets,{'/rules/execution-coordination/#做错了怎么办'})
        self.assertNotIn('https://outside.example/',targets)
        self.assertNotIn('/rules/execution-coordination/#invented',targets)

    def test_raw_source_selection_display_or_release_mismatch_is_rejected(self):
        with self.assertRaisesRegex(ValueError,'fixed excerpt source'):
            contract.excerpt_link_targets(self.pin,self.identity,self.raw.replace('用户'.encode(),'用户假'.encode()))
        for mutation in ('selection','markdown_sha256'):
            pin=copy.deepcopy(self.pin);pin['excerpt_contract']['excerpts'][self.identity][mutation]='wrong'
            with self.subTest(mutation=mutation),self.assertRaisesRegex(ValueError,'selection/display digest'):
                contract.excerpt_link_targets(pin,self.identity,self.raw)
        pin=copy.deepcopy(self.pin);pin['excerpt_contract']['id']='e215-original-ranges-v1'
        with self.assertRaisesRegex(ValueError,'fixed excerpt source'):
            contract.excerpt_link_targets(pin,self.identity,self.raw)


@unittest.skipIf(POLICY_SKIP_REASON, POLICY_SKIP_REASON)
class FixedRuleOriginal(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='fixed-rule-original-');self.root=Path(self.temp.name)
        self.previous_root=builder.ROOT;builder.ROOT=self.root
        self.site=self.root/'site';self.page=self.site/'rules/authorization/index.html';self.page.parent.mkdir(parents=True)
        self.document='docs/contracts/agents.authorization.md';self.identity='rule-authorization/rule-authorization-05'
        self.raw=private_fixture('sha256:5a7989d82c90c71a3ecadf57417e91342234303fbef7aa8ca97b7ce818bb51bd')
        self.public=contract.public_markdown(self.raw,self.document)
        self.body='<div class="source-prose">'+contract.render_markdown(self.public)+'</div>'
        self.asset=self.site/'_typeset/rule-sources/original.md';self.asset.parent.mkdir(parents=True);self.asset.write_text(self.public,encoding='utf8')
        original=contract.sha_bytes(self.raw.encode());public=builder.sha(self.asset)
        self.pin={'schema':'wly.assembled-rules-pin.v2','version':'E221','documents':{self.document:{'source_sha256':original,'public_source_sha256':public}},
                  'excerpt_contract':{'id':contract.CONTRACT,'excerpts':{self.identity:{'page':'rule-authorization','screen':'rule-authorization-05',
                    'relative_file':self.document,'source_sha256':original,'approved_omitted_count':0,
                    'rendered_text_sha256':builder.prose_digest(contract.render_markdown(self.public),True)}}}}
        config=self.root/'config';config.mkdir();(config/'assembled-rules-pin.json').write_text(json.dumps(self.pin),encoding='utf8')
        self.row={'id':'rule-authorization-05','shape':'source_text','render_mode':'typeset','source_version':'原文 · E221 版',
                  'source_meta':{'relative_file':self.document,'source_sha256':original,'public_source_sha256':public,'version':'E221',
                                 'excerpt_contract':contract.CONTRACT,'excerpt_id':self.identity,'omitted_count':0,
                                 'src':'/_typeset/rule-sources/original.md','original_html':self.body}}

    def tearDown(self):builder.ROOT=self.previous_root;self.temp.cleanup()
    def text(self):
        text='<script id="page-data">'+json.dumps({'screens':[self.row]},ensure_ascii=False).replace('</',r'<\/')+'</script>'
        self.page.write_text(text,encoding='utf8');return text
    def findings(self):self.text();return builder.rule_pin_findings(self.site,[self.page])
    def admitted(self,text,word=None):
        if word is None: word=private_fixture('sha256:ab146fee147e438a5911b0d9511dae113128e27fa9c673bd0fb8fc3c2ff0f3df')
        spans=builder.canonical_rule_topic_spans(self.site,self.page,text,self.pin)
        return [any(start<=match.start() and match.end()<=end for start,end in spans) for match in builder.EXCLUDED_TOPICS.finditer(text) if match[0]==word]

    def test_current_excerpt_and_separate_public_source_hash_pass(self):
        self.assertNotEqual(self.row['source_meta']['source_sha256'],self.row['source_meta']['public_source_sha256'])
        self.assertEqual(self.findings(),[])
        self.assertEqual(self.admitted(self.text(),private_fixture('sha256:32bc0a3372fcf9cb2699e5d46eb51d73081d65bb18d82af3929001ee2240af6a')),[True])

    def test_changed_text_link_version_source_and_projection_fail(self):
        original=copy.deepcopy(self.row)
        mutations=[lambda m:m.update(version='E208'),lambda m:m.update(source_sha256='unverified'),
                   lambda m:m.update(public_source_sha256=m['source_sha256']),lambda m:m.update(excerpt_id='other/screen'),
                   lambda m:m.update(original_html=m['original_html'].replace('只允许已验证','允许任何')),
                   lambda m:m.update(original_html=m['original_html'].replace('privacy-data','protected-actions'))]
        for mutation in mutations:
            with self.subTest(mutation=mutation):
                self.row=copy.deepcopy(original);mutation(self.row['source_meta']);self.assertTrue(self.findings())
                self.assertEqual(self.admitted(self.text(),private_fixture('sha256:32bc0a3372fcf9cb2699e5d46eb51d73081d65bb18d82af3929001ee2240af6a')),[False])
        self.row=original;self.asset.write_text('假的公开来源',encoding='utf8')
        self.assertIn('rule_original_source_evidence_mismatch',{finding['type'] for finding in self.findings()})

    def test_source_extra_and_unhashed_attribute_keep_the_original_topic_gate(self):
        fixtures=contract.load_policy()['fixture_values']
        original=self.row['source_meta']['original_html']
        for changed in [original.replace('</div>',private_fixture('sha256:fffc4c124d8fc7a60aa77251803ba078228a25fec19c0498d99f065090b3554a')),
                        original.replace(fixtures['sha256:0fe84b41a3bce1d85599833f3e020873120429d2395f4cb11837cd8f675fe202'],fixtures['sha256:bfd91c7142059730dd88bcde8fd1c5a764ce81f2ac34b42599880998842f5872'])]:
            with self.subTest(changed=changed):
                self.row['source_meta']['original_html']=changed
                self.assertEqual(self.findings(),[])
                self.assertEqual(self.admitted(self.text()),[False])

    def test_projection_keeps_code_placeholders_and_only_drops_metadata_resources(self):
        markup='<div class="source-prose"><code>E:\\<wbr>Fixture\\&lt;task-id&gt;\\child</code><img src="file:///E:/Fixture/title.png"></div>'
        projected=contract.project_original_html(markup)
        self.assertIn('E:\\Fixture\\&lt;task-id&gt;\\child',projected)
        self.assertNotIn('file:',projected)
        rendered=contract.project_original_html(markup,keep_render_dependencies=True)
        self.assertIn('file:///E:/Fixture/title.png',rendered)
        self.assertIn('E:\\Fixture',rendered)

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

    def standalone_table(self):
        return (private_fixture('sha256:130aef420bf7e9525bc578c544ed04d0dc8a59162d3171f12d1c5eea71e63bb4'))

    def source_page(self, table):
        return ('<!doctype html><html><body class="o-h shape-source_text"><main id="page">'
                '<p>版本标题</p>'+self.body+table+'</main><aside>正文外尾部</aside>'
                '<script>outside()</script></body></html>')

    def pin_standalone_table(self):
        markdown=self.public+private_fixture('sha256:99c694f99eb142281e68499d6a34e4f22fe9e2295cc010bfa7cb47b7823fe849')
        expected=builder.prose_digest(contract.render_markdown(markdown),True)
        self.pin['excerpt_contract']['excerpts'][self.identity]['rendered_text_sha256']=expected
        (self.root/'config/assembled-rules-pin.json').write_text(json.dumps(self.pin),encoding='utf8')
        return expected

    def test_standalone_table_enters_actual_capture_digest_and_text_spans(self):
        expected=self.pin_standalone_table();document=self.source_page(self.standalone_table())
        original=typeset.original_rule_html(document)
        self.assertIn('class="c-table source-prose"',original)
        self.assertNotIn('版本标题',original)
        self.assertFalse(any(value in original for value in ('正文外尾部','outside()','</main>','</body>','</html>')))
        self.assertEqual(builder.typeset_prose_digest(document),expected)
        self.assertEqual(builder.typeset_prose_digest(original),expected)
        spans,substantive=contract.source_text_spans(document)
        self.assertIn(private_fixture('sha256:40c8d6f9a10648c54479dbbabd60ea152fec4df95fe88ef125ff8c7a7db84d68'),''.join(document[start:end] for start,end in spans))
        self.assertEqual(builder.typeset_prose_digest(substantive),expected)
        self.row['source_meta']['original_html']=original
        self.assertEqual(self.findings(),[])
        self.assertEqual(self.admitted(self.text(),private_fixture('sha256:32bc0a3372fcf9cb2699e5d46eb51d73081d65bb18d82af3929001ee2240af6a')),[True,True])

    def test_standalone_table_text_cell_code_and_target_changes_fail_fixed_pin(self):
        expected=self.pin_standalone_table();original=typeset.original_rule_html(self.source_page(self.standalone_table()))
        for changed in (original.replace(private_fixture('sha256:40c8d6f9a10648c54479dbbabd60ea152fec4df95fe88ef125ff8c7a7db84d68'),private_fixture('sha256:134c4769abd198fb44b0517dd16ec06b263ae61644e2064fd1cf891479d11433')),
                        original.replace(private_fixture('sha256:7ff5e0f43a322b437ac171965dc96a47d78144b9c8b2c5f3d7b39185b6324156'),''),
                        original.replace('tool -a -b','tool-a-b'),
                        original.replace('/rules/privacy-data/','/rules/protected-actions/')):
            with self.subTest(changed=changed):
                self.row['source_meta']['original_html']=changed
                self.assertNotEqual(builder.typeset_prose_digest(changed),expected)
                self.assertIn('rule_original_content_mismatch',{finding['type'] for finding in self.findings()})
                self.assertTrue(all(not admitted for admitted in self.admitted(self.text(),private_fixture('sha256:32bc0a3372fcf9cb2699e5d46eb51d73081d65bb18d82af3929001ee2240af6a'))))

    def test_standalone_table_scope_and_added_labels_receive_no_topic_waiver(self):
        fixtures=contract.load_policy()['fixture_values']
        table=self.standalone_table();document=self.source_page(table)
        outside=document.replace(table,'').replace('</main>','</main>'+table)
        cases=(document.replace('shape-source_text','shape-summary'),document.replace('id="page"','id="other"'),
               document.replace('data-comp="table"','data-comp="other"'),document.replace('class="c-table"','class="other"'),
               document.replace(table,'<div class="source-extra">'+table+'</div>'),outside)
        for changed in cases:
            with self.subTest(changed=changed):
                self.assertEqual(typeset.original_rule_html(changed),self.body)
                self.assertEqual(builder.typeset_prose_digest(changed),builder.typeset_prose_digest(self.body))
                spans,_=contract.source_text_spans(changed)
                self.assertNotIn(private_fixture('sha256:40c8d6f9a10648c54479dbbabd60ea152fec4df95fe88ef125ff8c7a7db84d68'),''.join(changed[start:end] for start,end in spans))
        # An unqualified table stored beside an original does not gain its waiver.
        self.row['source_meta']['original_html']=self.body+table
        self.assertEqual(self.findings(),[])
        self.assertEqual(self.admitted(self.text(),private_fixture('sha256:32bc0a3372fcf9cb2699e5d46eb51d73081d65bb18d82af3929001ee2240af6a')),[True,False])
        self.pin_standalone_table()
        addition=fixtures['sha256:58b0374096589621eefcc404d3075fa8b71643aa2701dad721d5c43b9957b9d2']
        added=table.replace(addition.split('<',1)[0],addition)
        added=added.replace(fixtures['sha256:8fb4d073c7c26022a7403a952e72b751e359e9eddb08062cf377354dee2a7a29'],fixtures['sha256:987cbede654e25525165d94a2707f018328a7189eae445ab5b72ef43e2ffab51'])
        self.row['source_meta']['original_html']=typeset.original_rule_html(self.source_page(added))
        self.assertEqual(self.findings(),[])
        self.assertEqual(self.admitted(self.text()),[False,False,False,False])

    def test_standalone_table_public_projection_matches_semantics_and_keeps_outer_values(self):
        table=self.standalone_table().replace('tool -a -b',r'E:\<wbr>Fixture\&lt;task-id&gt;\child')
        outside='<div class="c-table" data-comp="table"><table><tr><td>E:\\Outside\\kept</td></tr></table></div>'
        document=self.source_page(table).replace('</main>','</main>'+outside)
        projected=projection.project_html(document)
        self.assertIn(outside,projected)
        self.assertIn('E:\\Fixture\\&lt;task-id&gt;\\child',projected)
        self.assertIn('E:\\Fixture',projected)
        self.assertNotIn('<wbr>',projected)
        expected=contract.project_original_html(typeset.original_rule_html(document))
        actual=contract.project_original_html(typeset.original_rule_html(projected))
        self.assertEqual(actual,expected)
        self.assertEqual(builder.typeset_prose_digest(projected),builder.typeset_prose_digest(expected))
        self.assertEqual(projection.unbound_visible_literals(projected,typeset,typeset.publication),[])
        bound=document.replace(outside,'')
        self.assertEqual(projection.unbound_visible_literals(bound,typeset,typeset.publication),[])


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


@unittest.skipIf(POLICY_SKIP_REASON, POLICY_SKIP_REASON)
class WorkbenchTopicOriginal(unittest.TestCase):
    def setUp(self):
        self.fixture=FixedRuleOriginal('test_current_excerpt_and_separate_public_source_hash_pass')
        self.fixture.setUp()
        f=self.fixture
        self.previous_contract_file=contract.__file__
        scripts=f.root/'scripts';scripts.mkdir()
        for name in ('build-assembled-site.py','audit-page-publication.py'):
            (scripts/name).write_bytes((ROOT/'scripts'/name).read_bytes())
        contract.__file__=str(scripts/'rule_original_contract.py')
        self.page=f.site/'rules/index.html'
        f.raw=(private_fixture('sha256:2d2b60acce3563b31122804d4cb01f3bb94a31e2b1feb90656502b10a3eede60'))
        f.public=contract.public_markdown(f.raw,f.document)
        f.asset.write_text(f.public,encoding='utf8')
        f.body='<div class="source-prose">'+contract.render_markdown(f.public)+'</div>'
        original=contract.sha_bytes(f.raw.encode());public=builder.sha(f.asset)
        f.pin['documents'][f.document]={'source_sha256':original,'public_source_sha256':public}
        f.pin['public_source_resources']={'/_typeset/rule-sources/original.md':{'relative_file':f.document,'public_source_sha256':public}}
        f.pin['excerpt_contract']['excerpts'][f.identity].update(source_sha256=original,
            rendered_text_sha256=builder.typeset_prose_digest(f.body))
        pin_path=f.root/'config/assembled-rules-pin.json';pin_path.write_text(json.dumps(f.pin),encoding='utf8')
        row=copy.deepcopy(f.row);row['source_meta'].update(source_sha256=original,public_source_sha256=public,
            original_html=f.body,public_projection_sha256='fixture-public-projection')
        row['parts']=[]
        for orientation in ('h','v'):
            path=f.site/('_typeset/rule-sources/original-'+orientation+'.png');path.write_bytes(('fixture '+orientation).encode())
            row['parts'].append({'src':'/'+path.relative_to(f.site).as_posix(),'sha256':builder.sha(path),'orientation':orientation})
        spec=importlib.util.spec_from_file_location('workbench_fixture_transcript',ROOT/'scripts/audit-page-publication.py')
        publication=importlib.util.module_from_spec(spec);spec.loader.exec_module(publication)
        self.transcript=publication.rendered_text('<body>'+f.body+'</body>')
        row['transcript_sha256']=contract.sha_bytes(' '.join(self.transcript.split()).encode())
        self.data={'schema':contract.WORKBENCH_SCHEMA,'version':'E221','pin_sha256':builder.sha(pin_path),
            'projection_sha256':'fixture-public-projection','topics':[{'relative_file':f.document,'src':row['source_meta']['src'],
                'public_source_sha256':public,'logical_id':'authorization_contract','page':'rule-authorization'}],'screens':[row]}

    def tearDown(self):
        contract.__file__=self.previous_contract_file
        self.fixture.tearDown()

    def text(self,side=''):
        f=self.fixture
        value=('<html><body><a href="/_typeset/rule-sources/original.md">完整原文</a>'
            '<div id="rule-panel-authorization_contract"></div><div id="rule-tab-authorization_contract"></div>'
            '<article id="rule-authorization-05" data-rule-excerpt="'+f.identity+'">'
            +''.join('<img src="'+part['src']+'">' for part in self.data['screens'][0]['parts'])
            +'<pre data-rule-original-text="'+f.identity+'">'+html.escape(self.transcript)+'</pre></article>'
            +'<script id="rule-workbench-data" type="application/json">'+json.dumps(self.data,ensure_ascii=False)+'</script>'
            +side+'</body></html>')
        self.page.write_text(value,encoding='utf8');return value

    def admitted(self,text):
        spans=builder.canonical_rule_topic_spans(self.fixture.site,self.page,text,self.fixture.pin)
        return [any(a<=match.start() and match.end()<=b for a,b in spans)
                for match in builder.EXCLUDED_TOPICS.finditer(text) if match[0]==private_fixture('sha256:32bc0a3372fcf9cb2699e5d46eb51d73081d65bb18d82af3929001ee2240af6a')]

    def test_complete_workbench_admits_only_its_original_transcript_and_metadata(self):
        text=self.text()
        self.assertEqual(contract.validate_rule_workbench(self.fixture.site,self.fixture.pin)['findings'],[])
        self.assertEqual(self.admitted(text),[True,True])

    def test_wrong_source_or_altered_original_body_receive_no_waiver(self):
        original=copy.deepcopy(self.data)
        for change in ('source','body'):
            with self.subTest(change=change):
                self.data=copy.deepcopy(original);meta=self.data['screens'][0]['source_meta']
                if change=='source':meta['source_sha256']='0'*64
                else:meta['original_html']=meta['original_html'].replace(private_fixture('sha256:37a891c155f593ab0be6ebfb3c28e03bdf52942d4badf58329f2f8ed4c0b877a'),private_fixture('sha256:f414608e224eeb4f6678742bad9802500081a1dd5d22c1d1b9bd591233e4850c'))
                text=self.text()
                self.assertTrue(contract.validate_rule_workbench(self.fixture.site,self.fixture.pin)['findings'])
                self.assertEqual(self.admitted(text),[False,False])

    def test_added_side_prose_still_receives_the_original_topic_gate(self):
        text=self.text(private_fixture('sha256:d18cde6379fce83e8cc6a6427df5cea171e20b54a05315966d5c6b01a1cf12a5'))
        self.assertEqual(contract.validate_rule_workbench(self.fixture.site,self.fixture.pin)['findings'],[])
        self.assertEqual(self.admitted(text),[True,True,False])

    def test_manifest_oss_originals_require_registered_paths_and_actual_sha(self):
        root=self.fixture.site; text=self.text(); objects={}
        paths=[self.data['topics'][0]['src']]+[p['src'] for p in self.data['screens'][0]['parts']]
        for path in paths:
            url='https://oss.example/releases/current'+path
            objects[path.lstrip('/')]={'url':url,'sha256':builder.sha(root/path.lstrip('/'))}
            text=text.replace(path,url)
        (root/'release-manifest.json').write_text(json.dumps({'oss':{'objects':objects}}),encoding='utf8')
        self.page.write_text(text,encoding='utf8')
        self.assertEqual(contract.original_site_path(objects[paths[0].lstrip('/')]['url'],root),paths[0])
        self.assertEqual(contract.validate_rule_workbench(root,self.fixture.pin)['findings'],[])
        self.assertEqual(self.admitted(text),[True,True])
        for path in paths:
            asset=root/path.lstrip('/'); payload=asset.read_bytes(); asset.write_bytes(payload+b'changed')
            self.assertTrue(contract.validate_rule_workbench(root,self.fixture.pin)['findings']); asset.write_bytes(payload)
        self.page.write_text(text.replace('https://oss.example/','https://unregistered.example/'),encoding='utf8')
        self.assertTrue(contract.validate_rule_workbench(root,self.fixture.pin)['findings'])


if __name__=='__main__':unittest.main()

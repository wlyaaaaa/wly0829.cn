"""Current frozen rule sources and the retained source-boundary behavior."""
import shutil
from pathlib import Path
import sys
import tempfile
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import astro_rules
import rule_original_contract as contract


class NativeRuleSources(unittest.TestCase):
    def test_public_originals_build_without_private_rule_copies(self):
        with tempfile.TemporaryDirectory(prefix='native-rule-sources-') as folder:
            root = Path(folder)
            source = root / 'sources/rules'
            shutil.copytree(ROOT / 'sources/rules', source)
            public = root / 'public'
            self.assertFalse((root / '.publish').exists())
            with mock.patch.object(astro_rules, 'ROOT', root):
                pin = astro_rules.generate(public)
            self.assertTrue(pin['documents'])
            for row in pin['documents'].values():
                expected = (source / row['relative_path']).read_bytes()
                self.assertEqual((public / row['src'].lstrip('/')).read_bytes(), expected)
                if row['relative_path'].startswith('templates/'):
                    self.assertEqual((public / 'rule-sources' / row['relative_path']).read_bytes(), expected)


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


if __name__ == '__main__':
    unittest.main()

import copy
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts/content-refresh'))
import block_tool as tool
from checks import check_update
from inventory import number_relations
from refresh import page_value


class PageChecksTests(unittest.TestCase):
    def setUp(self):
        folder = Path('E:/Cache/wly-site-build/bw/c3-content-checks')
        folder.mkdir(parents=True, exist_ok=True)
        temp = tempfile.TemporaryDirectory(dir=folder)
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        self.page = dict(page='sample', screens=[dict(id='s1', text='# 标题\n\n正文10项。' + '甲' * 100 + '\n\n同值10项。')])
        self.records = [dict(id=name, page='sample', screen='s1', page_pattern=prefix + r'(\d+)项',
                             measurement_scope='同一库存', as_of='2026-11-12') for name, prefix in [('a', '正文'), ('b', '同值')]]
        self.records[0]['relations'] = [dict(kind='equal', record_ids=['b'])]
        self.path = self.root / 'sources/pages/sample/page.json'
        tool.save(self.path, self.page)
        tool.save(self.root / 'sources/refresh/registry.json', dict(records=self.records))
        tool.save(self.path.with_name('layout.json'), [dict(screen='s1', orientation=o, blocks=[
            dict(type='chapter_title', text_ref='标题'), dict(type='prose', text_ref='正文'),
            dict(type='prose', text_ref='同值')]) for o in ('h', 'v')])
        self.baseline = tool.export_page(self.root, 'sample')

    def bundle(self):
        page = tool.bound_json(self.path, root=self.root)
        page['html'] = ''.join(f'<section data-screen="{s["id"]}">{s["text"]}</section>' for s in page['screens'])
        bindings = [dict(record_id=r['id'], status='readable', value=page_value(r, page, self.root)[0]) for r in self.records]
        return dict(changed_pages=['sample', 'good'], pages=dict(sample=page, good=dict(page='good', screens=[], html='<script>{{脚本模板}}</script><i hidden>{{隐藏模板}}</i>'),
            untouched=dict(page='untouched', screens=[dict(id='old', text='{{旧模板}}')])),
            blocks=dict(sample=tool.export_page(self.root, 'sample'), good=dict(schema='wly.content-blocks.v1', page='good', blocks=[])),
            published_blocks=dict(sample=self.baseline, good=dict(schema='wly.content-blocks.v1', page='good', blocks=[])),
            number_relations=number_relations(self.records, bindings))

    def test_real_c1_c2_good_and_three_seeded_defects(self):
        clean = check_update(self.bundle())
        self.assertTrue(clean['passed'])
        self.assertFalse(any(p['errors'] or p['warnings'] for p in clean['pages']))
        tool.save(self.root / 'sources/pages/copy/page.json', dict(registry=dict(slot='{{未填}}')))
        self.page['screens'][0]['text'] += '\n\n{{copy.registry.slot}}' + '乙' * 40
        self.page['screens'][0]['text'] = self.page['screens'][0]['text'].replace('同值10', '同值11')
        tool.save(self.path, self.page)
        bad, good = check_update(self.bundle())['pages']
        self.assertFalse(bad['passed']); self.assertTrue(good['passed'])
        self.assertEqual({f['code'] for f in bad['errors']}, {'unfilled-template', 'number-equal-mismatch'})
        self.assertEqual([f['code'] for f in bad['warnings']], ['screen-text-growth'])
        self.assertTrue(all(f['screen'] == 's1' for f in bad['errors'] + bad['warnings']))

    def test_sum_cross_page_and_unavailable_are_not_guessed_conflicts(self):
        bundle = self.bundle()
        self.records[0]['relations'] = [dict(kind='sum', record_ids=['b', 'c'])]
        self.records.append(dict(self.records[1], id='c', page='untouched', screen='old'))
        bindings = [dict(record_id=r['id'], status='readable', value=v) for r, v in zip(self.records, ['10', '4', '5'])]
        bundle['number_relations'] = number_relations(self.records, bindings)
        self.assertEqual(check_update(bundle)['pages'][0]['errors'][0]['code'], 'number-sum-mismatch')
        bindings[-1]['status'] = 'missing'
        bundle['number_relations'] = number_relations(self.records, bindings)
        result = check_update(bundle)['pages'][0]
        self.assertTrue(result['passed']); self.assertEqual(result['warnings'][0]['code'], 'number-relation-unavailable')

    def test_growth_boundary_and_page_input_failure_continue(self):
        bundle = self.bundle(); blocks = bundle['blocks']['sample']['blocks']
        for b in blocks: b['chars'] = 0
        blocks[0]['chars'] = 130
        bundle['published_blocks']['sample'] = copy.deepcopy(bundle['blocks']['sample'])
        bundle['published_blocks']['sample']['blocks'][0]['chars'] = 100
        self.assertEqual(check_update(bundle)['pages'][0]['warnings'], [])
        blocks[0]['chars'] = 140
        self.assertTrue(check_update(bundle)['passed'])
        del bundle['pages']['sample']
        bad, good = check_update(bundle)['pages']
        self.assertFalse(bad['passed']); self.assertTrue(good['passed'])

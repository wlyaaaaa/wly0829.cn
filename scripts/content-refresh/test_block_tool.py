"""编号块写回验收：核对真实分字，覆盖两种摆法和登记定位。"""
from pathlib import Path
import json
import tempfile
import unittest

import block_tool as tool
from engine.layout import assign_by_spec
from engine.parse import parse, node_text


class BlockToolTests(unittest.TestCase):
    def setUp(self):
        base = Path('E:/Cache/wly-site-build/bw/c1-block-tool/test-work')
        base.mkdir(parents=True, exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=base)
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.page = {'page': 'sample', 'screens': [{'id': 'sample-01', 'text':
            '# 示例标题\n\n甲段落，旧首句。\n\n乙段落，项目有 12 项。\n\n丙段落，末尾说明。'}]}
        self.layout = [dict(screen='sample-01', orientation='h', blocks=[
            dict(type='chapter_title', text_ref='示例标题'),
            dict(type='prose', text_ref='甲段落', paragraph_roles=[
                dict(text_ref='甲段落', tone='normal'), dict(text_ref='乙段落', tone='muted')]),
            dict(type='prose', text_ref='丙段落')]),
            dict(screen='sample-01', orientation='v', blocks=[
                dict(type='title_strip', text_ref='示例标题', description_text_ref='甲段落'),
                dict(type='prose', text_ref='乙段落'), dict(type='prose', text_ref='丙段落')])]
        self.registry = {'records': [dict(id='quantity', page='sample', screen='sample-01',
            page_pattern=r'项目有 (\d+) 项')]}
        self.files = ['sources/pages/sample/page.json', 'sources/pages/sample/layout.json',
                      'sources/refresh/registry.json']
        for file, data in zip(self.files, [self.page, self.layout, self.registry]):
            path = self.root / file
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(('\ufeff' + json.dumps(data, ensure_ascii=False, indent=2).replace('\n', '\r\n')).encode('utf8'))

    def export(self): return tool.export_page(self.root, 'sample')
    def block(self, doc, prefix): return next(b['id'] for b in doc['blocks'] if b['text'].startswith(prefix))
    def write(self, doc, edits): return tool.write_draft(self.root, doc, edits, self.root/'runs')
    def assigned(self, draft):
        page = tool.read(draft/self.files[0]); layouts = tool.read(draft/self.files[1])
        return [[ ''.join(node_text(n) for n in b['nodes']) for b in assign_by_spec(
            parse(page['screens'][0]['text']), layout['blocks'], [], [])] for layout in layouts]

    def test_roundtrip_and_merge_preserve_original_bytes(self):
        before = {f: (self.root/f).read_bytes() for f in self.files}
        doc = self.export(); draft = self.write(doc, [{'block': b['id'], 'action': '不动'} for b in doc['blocks']])
        payloads, _, _ = tool.draft_updates(self.root, draft)
        for file, payload in before.items():
            self.assertEqual((draft/file).read_bytes(), payload)
            self.assertEqual((self.root/file).read_bytes(), payload)
            if file in payloads: self.assertEqual(payloads[file], payload)
        asset = self.root/'sources/assets/_library/asset-map.jsonl'
        asset.parent.mkdir(parents=True, exist_ok=True)
        asset.write_text(json.dumps(dict(page='sample', asset='old.png'))+'\n', encoding='utf8')
        draft = self.write(self.export(), [])
        self.assertEqual(tool.read(draft/'draft.json')['asset_base'], [dict(page='sample', asset='old.png')])
        self.assertEqual((draft/'sources/assets/_library/asset-map.jsonl').read_bytes(), asset.read_bytes())
        with self.assertRaisesRegex(ValueError, 'tools/update.py merge'): tool.merge_draft(self.root, draft)

    def test_rewrite_rebinds_each_layout_nested_refs_and_registered_number(self):
        doc = self.export(); original = (self.root/self.files[0]).read_bytes()
        edits = [dict(block=self.block(doc, '甲'), action='改成', text='新甲段落，旧首句。'),
                 dict(block=self.block(doc, '乙'), action='改成', text='更新乙段落，这里有 12 项。')]
        draft = self.write(doc, edits)
        self.assertEqual((self.root/self.files[0]).read_bytes(), original)
        self.assertEqual(self.assigned(draft), [
            ['示例标题', '新甲段落，旧首句。更新乙段落，这里有12项。', '丙段落，末尾说明。'],
            ['示例标题新甲段落，旧首句。', '更新乙段落，这里有12项。', '丙段落，末尾说明。']])
        layouts = tool.read(draft/self.files[1])
        self.assertTrue(layouts[0]['blocks'][1]['paragraph_roles'][0]['text_ref'].startswith('新甲'))
        self.assertTrue(layouts[1]['blocks'][0]['description_text_ref'].startswith('新甲'))
        text = tool.read(draft/self.files[0])['screens'][0]['text']
        row = tool.read(draft/self.files[2])['records'][0]; a, b = tool.locate(text, row)
        self.assertEqual(text[a:b], '12')
        payloads, _, _ = tool.draft_updates(self.root, draft)
        for file, raw in payloads.items(): (self.root/file).write_bytes(raw)
        self.assertEqual((self.root/self.files[0]).read_bytes(), (draft/self.files[0]).read_bytes())
        with self.assertRaisesRegex(ValueError, '作者源已变'): tool.draft_updates(self.root, draft)

    def test_same_new_opening_and_missing_layout_block_are_rejected(self):
        doc = self.export(); text = '同一个新的段落开头足够长用来验证前缀冲突以及顺序串块'
        with self.assertRaisesRegex(ValueError, '新开头相同'):
            self.write(doc, [dict(block=self.block(doc, p), action='改成', text=text+p) for p in ('甲', '丙')])
        self.layout[0]['blocks'][1]['text_ref'] = '根本不存在'
        tool.save(self.root/self.files[1], self.layout)
        with self.assertRaises(ValueError): self.export()

    def test_add_uses_both_neighbor_layouts_and_delete_removes_original_block(self):
        doc = self.export(); draft = self.write(doc, [dict(block=self.block(doc, '乙'), action='其后加', text='新增短句。'),
                                                       dict(block=self.block(doc, '丙'), action='删')])
        self.assertEqual(self.assigned(draft), [
            ['示例标题', '甲段落，旧首句。乙段落，项目有12项。', '新增短句。'],
            ['示例标题甲段落，旧首句。', '乙段落，项目有12项。', '新增短句。']])
        with self.assertRaisesRegex(ValueError, '装不下'):
            self.write(doc, [dict(block=self.block(doc, '乙'), action='其后加', text='很长的新内容。'*30)])

    def test_changed_or_ambiguous_registered_number_is_rejected(self):
        doc = self.export()
        for text in ('乙段落，项目有 34 项。', '乙段落，项目有 12 项。乙段落，项目有 12 项。', '重写后是 12。也可以是 12。'):
            with self.assertRaisesRegex(ValueError, '登记数'):
                self.write(doc, [dict(block=self.block(doc, '乙'), action='改成', text=text)])
        self.registry['records'][0]['page_pattern'] = r'(段落)'
        tool.save(self.root/self.files[2], self.registry)
        with self.assertRaisesRegex(ValueError, '登记数'): self.export()

    def test_deleted_sentence_retires_number_and_keeps_other_pages(self):
        doc = self.export()
        for edit in (dict(block=self.block(doc, '乙'), action='删'),
                     dict(block=self.block(doc, '乙'), action='改成', text='乙段落，没有数量。')):
            draft = self.write(doc, [edit])
            row = tool.read(draft/self.files[2])['records'][0]
            self.assertTrue(row['historical'])
            self.assertEqual(row['retired_reason'], '随句删除')
            self.assertEqual(list(tool.number_rows({'records': [row]}, 'sample', self.page)), [])
            self.assertEqual(tool.read(self.root/self.files[2]), self.registry)
        self.registry['records'].append(dict(id='foreign', page='other', relations=[dict(kind='equal', record_ids=['quantity'])]))
        tool.save(self.root/self.files[2], self.registry)
        draft = self.write(self.export(), [dict(block=self.block(doc, '乙'), action='删')])
        rows = tool.read(draft/self.files[2])['records']
        self.assertEqual(rows[1], self.registry['records'][1])
        self.assertEqual(tool.read(draft/'draft.json')['retired_numbers'][0]['dependencies'],
                         [dict(page='other', record_id='foreign')])

    def test_status_and_link_actions_share_the_draft(self):
        self.page['status_line'] = dict(state='偶尔用', last=dict(at='2026-11-01'), facts=['3 次'])
        self.page['screens'][0]['links'] = [dict(text='旧', href='/old/')]
        self.registry['records'].append(dict(id='last', page='sample', field='status_line.last.at'))
        for file, value in zip(self.files, [self.page, self.layout, self.registry]): tool.save(self.root/file, value)
        doc = self.export()
        self.assertEqual(doc['fields']['status_line'], self.page['status_line'])
        edits = [dict(field='status_line', action='改成', value=dict(state='偶尔用')),
                 dict(field='screens[0].links', action='改成', value=[dict(text='新', href='/new/')]),
                 dict(field='screens[0].links', action='其后加', value=[dict(text='再加', href='/added/')])]
        draft = self.write(doc, edits); page = tool.read(draft/self.files[0])
        self.assertEqual(page['status_line'], dict(state='偶尔用'))
        self.assertEqual([r['href'] for r in page['screens'][0]['links']], ['/new/', '/added/'])
        self.assertEqual(tool.read(draft/self.files[2])['records'][1]['retired_reason'], '随句删除')
        draft = self.write(doc, [dict(field='status_line', action='删'), dict(field='screens[0].links', action='删')])
        page = tool.read(draft/self.files[0])
        self.assertNotIn('status_line', page)
        self.assertNotIn('links', page['screens'][0])

    def test_partial_summary_deletion_and_shorter_date_keep_their_meaning(self):
        self.assertTrue(tool.number_removed('共 12 项，另有 3 项。', '共 12 项。', 0, 15))
        self.assertFalse(tool.number_removed('项目有 12 项。', '项目共 34 项。', 4, 6))
        self.page['screens'][0]['text'] = self.page['screens'][0]['text'].replace('项目有 12 项', '11 月 06 日 14:26 核对')
        self.registry['records'][0]['page_pattern'] = r'(11 月 06 日 14:26) 核对'
        for file, value in zip(self.files, [self.page, self.layout, self.registry]): tool.save(self.root/file, value)
        doc = self.export()
        draft = self.write(doc, [dict(block=self.block(doc, '乙'), action='改成', text='乙段落，11 月 6 日核对。')])
        row = tool.read(draft/self.files[2])['records'][0]
        text = tool.read(draft/self.files[0])['screens'][0]['text']; a, b = tool.locate(text, row)
        self.assertEqual(text[a:b], '11 月 6 日')
        self.assertEqual(row['date_precision'], 'date')
        self.assertNotIn('retired_reason', row)

    def test_measured_capacity_can_exceed_existing_copy_length(self):
        capacities = {f'sample-01/{o}/{i}': 300 for o in ('h', 'v') for i in range(3)}
        doc = tool.export_page(self.root, 'sample', capacities)
        added = '这段新增内容长于原文。'*10
        draft = self.write(doc, [dict(block=self.block(doc, '乙'), action='其后加', text=added)])
        for assigned in self.assigned(draft): self.assertIn(added, assigned)

    def test_insertion_inside_shared_horizontal_block_keeps_following_text(self):
        doc = self.export(); draft = self.write(doc, [dict(block=self.block(doc, '甲'), action='其后加', text='插入句。')])
        h, v = self.assigned(draft)
        self.assertEqual(h, ['示例标题', '甲段落，旧首句。', '插入句。', '乙段落，项目有12项。', '丙段落，末尾说明。'])
        self.assertEqual(v, ['示例标题甲段落，旧首句。', '插入句。', '乙段落，项目有12项。', '丙段落，末尾说明。'])
        self.page['screens'][0]['text'] = '# 标题\n\n- 甲条目原文。\n- 乙条目原文。\n- 丙条目原文。\n\n末段落。'; self.registry['records'] = []
        for layout in self.layout: layout['blocks'] = [dict(type='prose', text_ref=r) for r in ('标题', '甲条目', '乙条目', '末段落')]
        for file, data in zip(self.files, [self.page, self.layout, self.registry]): tool.save(self.root/file, data)
        doc = self.export(); draft = self.write(doc, [dict(block=self.block(doc, '- 乙'), action='改成', text='- 新乙条目内容。\n- 丙条目原文。')])
        self.assertEqual(self.assigned(draft), [['标题', '甲条目原文。', '新乙条目内容。丙条目原文。', '末段落。']]*2)


if __name__ == '__main__': unittest.main()

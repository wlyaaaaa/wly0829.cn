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
        tool.merge_draft(self.root, draft)
        for file, payload in before.items():
            self.assertEqual((draft/file).read_bytes(), payload)
            self.assertEqual((self.root/file).read_bytes(), payload)

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
        tool.merge_draft(self.root, draft)
        self.assertEqual((self.root/self.files[0]).read_bytes(), (draft/self.files[0]).read_bytes())
        with self.assertRaisesRegex(ValueError, '作者源已变'): tool.merge_draft(self.root, draft)

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

    def test_missing_or_ambiguous_registered_number_is_rejected(self):
        doc = self.export()
        with self.assertRaisesRegex(ValueError, '登记数'):
            self.write(doc, [dict(block=self.block(doc, '乙'), action='改成', text='乙段落，没有数量。')])
        for text in ('乙段落，项目有 12 项。乙段落，项目有 12 项。', '重写后是 12。也可以是 12。'):
            with self.assertRaisesRegex(ValueError, '登记数'):
                self.write(doc, [dict(block=self.block(doc, '乙'), action='改成', text=text)])
        self.registry['records'][0]['page_pattern'] = r'(段落)'
        tool.save(self.root/self.files[2], self.registry)
        with self.assertRaisesRegex(ValueError, '登记数'): self.export()

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

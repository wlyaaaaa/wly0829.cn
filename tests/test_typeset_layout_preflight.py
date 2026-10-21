"""Text preflight catches the three 10-20 row regressions and stale headings."""
import copy, json, sys, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'src/typeset'), str(ROOT / 'site-astro/tools')]
import convert_page as convert
from engine.content import bound_json
from engine.layout import assign_by_spec
from engine.parse import parse, original_markdown

class TextLayoutPreflightTests(unittest.TestCase):
    def test_three_previous_row_failures_and_repaired_rows(self):
        for page, sid, ref in [('agents', 'agents-12', '钩子'), ('personal-media', 'personal-media-08', '连上手机'), ('skill-browser-control-continuity', 'skill-browser-control-continuity-04', '1先判断要不要开浏览器')]:
            folder = ROOT / 'sources/pages' / page
            data = bound_json(folder / 'page.json', read=lambda p: Path(p).read_text('utf-8-sig'))
            screen = dict(next(s for s in data['screens'] if s['id'] == sid), anchors=[])
            layout = json.loads((folder / 'layout.json').read_text('utf-8-sig'))
            specs = next(s['blocks'] for s in layout if s['screen'] == sid and s.get('orientation', 'h') == 'h')
            block = next(b for b in assign_by_spec(parse(screen['text'], markdown_links=original_markdown(screen)), specs, []) if b['spec'].get('text_ref') == ref)
            self.assertEqual(convert.check_text_layout(data, screen, [block]), [])
            old = copy.deepcopy(block)
            if page == 'agents': old['spec'].pop('row_counts'); old['spec'].pop('fill_first_row')
            else: old['spec']['item_rows'] = [3, 1, 4] if page == 'personal-media' else [2, 2, 2, 2, 2, 1]
            self.assertTrue(any('横排卡片正文失衡' in issue for issue in convert.check_text_layout(data, screen, [old])), page)

    def test_anchor_checks_ignore_markdown_but_catch_changed_title(self):
        screen = {'id': 'fixture', 'text': '## 经验按时写进文件\n\n正文还会提到旧说法：经验当场写进文件。', 'anchors': [{'id': 'p-experience', 'text': '经验按时写进文件'}]}
        self.assertEqual(convert.check_text_layout({}, screen, []), [])
        screen['anchors'][0]['text'] = '经验当场写进文件'
        self.assertIn('目录标题与正文不一致', convert.check_text_layout({}, screen, [])[0])
        screen.update(text='### 改了 MCP、Hook 或技能之后怎么验收', anchors=[{'id': 'p-check', 'text': '改了 MCP 之后怎么验收'}])
        self.assertEqual(convert.check_text_layout({}, screen, []), [])

if __name__ == '__main__': unittest.main()

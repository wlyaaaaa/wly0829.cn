import html, importlib.util, json, re, sys, unittest
from pathlib import Path
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src/typeset'))
from engine.inline import make_inline
from engine.parse import parse, canon, expected_text
S = importlib.util.spec_from_file_location('stat_bullet_fields', ROOT / 'src/typeset/components/comp-hub/link_stats.py')
H = importlib.util.module_from_spec(S)
S.loader.exec_module(H)

class StatBulletFieldsTests(unittest.TestCase):
    def context(self, orient):
        return SimpleNamespace(orient=orient, min_font=24, inline=make_inline({}),
            resolve=lambda p: str(ROOT / 'sources/assets' / p), asset_url=lambda p: Path(p).as_posix(),
            warn=lambda *a: None, incomplete=lambda *a: self.fail(str(a)), take_icons=lambda *a: [])

    def test_actual_three_fields_keep_complete_text_and_three_icons(self):
        page = json.loads((ROOT / 'sources/pages/meshclip-kit/page.json').read_text(encoding='utf-8'))
        screen = next(s for s in page['screens'] if s['id'] == 'meshclip-kit-05')
        node = parse(screen['text'])[-1]
        layouts = json.loads((ROOT / 'sources/pages/meshclip-kit/layout.json').read_text(encoding='utf-8'))
        for orient in ('h', 'v'):
            layout = next(x for x in layouts if x['screen'] == screen['id'] and x['orientation'] == orient)
            spec = next(b for b in layout['blocks'] if b['type'] == 'stat_card')
            out = H.stat_card({'nodes': [node], 'spec': spec}, self.context(orient))
            self.assertEqual(canon(html.unescape(re.sub(r'<[^>]+>', '', out))), expected_text('\n'.join(node['src'])))
            self.assertEqual(out.count('<article'), 3)
            self.assertEqual(out.count('<img '), 3)
            self.assertEqual(H._field(node, spec, False)[1][:2], ('测试定义 85 个（只计数）', '自动测试'))

    def test_mixed_nodes_keep_order_and_nonfield_bullets_fallback(self):
        text = '前段\n\n- **测试定义 85 个（只计数）**｜自动测试\n\n中段\n\n- **有名**｜说明\n- 普通条目\n\n1. **10 次**｜提交\n\n后段'
        nodes = parse(text)
        out = H.stat_card({'nodes': nodes, 'spec': {'icons': 'none'}}, self.context('h'))
        self.assertEqual(canon(html.unescape(re.sub(r'<[^>]+>', '', out))), expected_text(text))
        self.assertEqual(out.count('<article'), 2)
        self.assertEqual(out.count('<li '), 2)
        self.assertEqual(out.count('data-role="stat-ordinal"'), 1)
        self.assertIsNone(H._field(nodes[3], {}, False))

if __name__ == '__main__':
    unittest.main()

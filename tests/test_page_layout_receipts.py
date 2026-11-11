"""Page failures stay local; layout receipts read actual rendered structure."""
import copy, json, os, sys, tempfile, unittest
from pathlib import Path
from unittest.mock import Mock, patch
ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'site-astro/tools'), str(ROOT / 'src/typeset')]
import convert_page as convert
import render_blocks
from layout_diff import compare_pages
def page(html, height=824, sid='fixture-01'):
    return {'page': 'fixture', 'screens': [{'id': sid, 'h': {'html': html, 'height': height}}]}
TITLE = '<div data-comp="chapter_title">标题</div>'
BODY = '<div data-comp="prose">正文</div>'
ART = '<div data-comp="illustration"><img src="same.png"></div>'
TWO = '<div class="row" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)"><div class="col">' + TITLE + BODY + '</div><div class="col">' + ART + '</div></div>'
class PageLayoutReceiptsTests(unittest.TestCase):
    def test_changed_text_ref_fails_only_its_page(self):
        with tempfile.TemporaryDirectory(dir=ROOT.parent) as temp:
            root = Path(temp)
            for name in ('bad', 'good'):
                folder = root / 'sources/pages' / name
                folder.mkdir(parents=True)
                data = {'title': '标题', 'kind': 'fixture', 'url': '/' + name + '/',
                        'screens': [{'id': name + '-01', 'text': '# 标题\n\n原来的块开头，后面正文保留。'}]}
                layout = [{'screen': name + '-01', 'orientation': 'h', 'blocks': [
                    {'type': 'chapter_title', 'text_ref': '标题'}, {'type': 'prose', 'text_ref': '原来的块开头'}]}]
                (folder / 'page.json').write_text(json.dumps(data, ensure_ascii=False), 'utf8')
                (folder / 'layout.json').write_text(json.dumps(layout, ensure_ascii=False), 'utf8')
            target = root / 'sources/pages/bad/page.json'
            target.write_text(target.read_text('utf8').replace('原来的块开头', '已经改掉的开头'), 'utf8')
            receipt = root / 'checks.json'
            with patch.multiple(convert, REPO=str(root), OUT_MD=str(root / 'md'), TOC_LABELS=str(root / 'toc.json')), \
                    patch.object(convert, 'screen_images', return_value=[]), \
                    patch.object(render_blocks, 'check_screen_images'), \
                    patch.dict(os.environ, CONVERT_PAGE_CHECKS=str(receipt), CONVERT_NO_FILL_ROWS='1'):
                result = convert.convert_pages(['bad', 'good'])
            rows = {row['page']: row for row in result['pages']}
            self.assertEqual([rows[n]['passed'] for n in ('bad', 'good')], [False, True])
            self.assertEqual(rows['bad']['errors'][0]['screen'], 'bad-01')
            self.assertIn('text_ref', rows['bad']['errors'][0]['code'])
            self.assertTrue((root / 'md/good.md').is_file())
            self.assertFalse((root / 'md/bad.md').exists())
            with patch.object(convert, 'convert', side_effect=[SystemExit('bad format'), 1]), patch.dict(os.environ, CONVERT_PAGE_CHECKS=str(receipt)):
                result = convert.convert_pages(['bad', 'good'])
            self.assertEqual([r['passed'] for r in result['pages']], [False, True])
    def test_render_prepare_failure_does_not_block_next_page(self):
        with tempfile.TemporaryDirectory(dir=ROOT.parent) as temp:
            finish = Mock()
            stubs = dict(verify_render_lock=lambda: None, load_registry=lambda: ({}, {}, [], []),
                         build_css=lambda _: '', hydration_fingerprint=lambda: '', library_fingerprint=lambda: '',
                         legacy_renderer_compatible=lambda _: False, sha=lambda _: 'hash', finish_page=finish,
                         prepare_page=Mock(side_effect=[SystemExit('bad screen'), ({}, {'screens': []}, [])]),
                         fix_dead_fragments=Mock(), write_layout_diff=Mock(), hydrate=Mock())
            with patch.multiple(render_blocks, **stubs, REPO=temp, SITE=temp, MD_DIR=temp, OUT_DIR=temp,
                                PUB=str(Path(temp, 'pub')), WORK=str(Path(temp, 'cache'))), \
                    patch.object(render_blocks.shutil, 'copyfile'), patch.object(render_blocks.os, 'chdir'), \
                    patch.dict(os.environ, BLOCK_PAGE_CHECKS=str(Path(temp, 'render-checks.json'))):
                result = render_blocks.run(['bad', 'good'])
            self.assertEqual([r['passed'] for r in result['pages']], [False, True])
            self.assertEqual([call.args[0] for call in finish.call_args_list], ['good'])
            stubs['hydrate'].assert_not_called()
    def test_title_row_flip_is_named(self):
        title_row = '<div class="row" style="grid-template-columns:minmax(0,1fr)" data-typeset-fit="title"><div class="col"><div style="display:flex;align-items:center">' + TITLE + ART + '</div>' + BODY + '</div></div>'
        changes = compare_pages(page(TWO), page(title_row))
        self.assertEqual([(c['page'], c['screen'], c['orientation']) for c in changes], [('fixture', 'fixture-01', 'h')])
        self.assertIn('标题', changes[0]['message'])
    def test_stacked_style_overrides_retained_two_track_template(self):
        stacked = TWO.replace('class="row" style="', 'class="row" data-typeset-fit="stacked-text" style="display:flex;flex-direction:column;')
        changes = compare_pages(page(TWO), page(stacked, 1000))
        self.assertTrue(changes)
        self.assertIn('height', changes[0]['changed_fields'])
        self.assertEqual(changes[0]['before']['rows'][0]['columns'], 2)
        self.assertEqual(changes[0]['after']['rows'][0]['columns'], 1)
    def test_wording_and_inserted_screen_do_not_shift_existing_screens(self):
        before = page(TWO)
        self.assertEqual(compare_pages(before, page(TWO.replace('正文', '正文已经修改'))), [])
        after = copy.deepcopy(before)
        after['screens'].insert(0, page(TWO, sid='new-01')['screens'][0])
        self.assertEqual([c['screen'] for c in compare_pages(before, after)], ['new-01'])
if __name__ == '__main__': unittest.main()

"""Mixed media/text rows opt in automatically without changing vertical layout."""
from pathlib import Path
import sys, subprocess
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src' / 'typeset'))
from engine.layout import build_html
class FitRowsTests(unittest.TestCase):
    def render(self, media='illustration', orient='h', text='介绍', third=False, extra=False, markup=None, closed=False, **flags):
        blocks = [{'type': 'chapter_title', 'text_ref': '标题', 'row': 'r', 'row_v': True, 'width': '40%', **flags},
                  {'type': media, 'row': 'r', 'row_v': True, 'width': '60%', 'row_fit_illustration': False if closed else None}]
        if text: blocks.insert(1, {'type': 'prose', 'text_ref': text, 'row': 'r', 'row_v': True, 'width': '20%' if third else None})
        if extra: blocks.extend([{'type': 'screenshot', 'row': 'r'}, {'type': 'prose', 'text_ref': '图注', 'row': 'r'}])
        registry = {kind: (lambda b, c, k=kind: markup if markup is not None and k == media else '<img src="image.png">' if k == 'illustration' else '<div data-hot="screenshot"></div><p>图注</p>' if k == 'screenshot' else '<p>文字</p>') for kind in ('chapter_title', 'prose', 'illustration', 'screenshot')}
        with patch('engine.assets.manifest', return_value={}):
            return build_html({}, {'id': 'fixture', 'text': '# 标题\n\n' + text + ('\n\n图注' if extra else '')}, orient, registry, [], {'blocks': blocks})[0]

    def test_automatic_title_text_and_single_screenshot(self):
        for media in ('illustration', 'screenshot'):
            self.assertIn('row fit-ill', self.render(media))
            self.assertIn('row fit-ill', self.render(media, text=''))
            self.assertIn('row fit-ill', self.render(media, third=True))
        self.assertIn('row fit-ill', self.render(extra=True))

    def test_explicit_false_and_vertical_stay_unfitted(self):
        for args in ({'row_fit_illustration': False}, {'row_fit_illustration': True, 'closed': True}, {'orient': 'v'}, {'markup': ''}, {'markup': '<img><img>'}):
            self.assertNotIn('row fit-ill', self.render(**args))
        for args in ({}, {'orient': 'v', 'closed': True}):
            self.assertIn('row fit-ill', self.render(row_fit_illustration=True, **args))
    def test_horizontal_tall_text_keeps_original_width(self):
        source = (Path(__file__).resolve().parents[1] / 'src/typeset/typeset_apply.js').read_text('utf8'); start = source.index('      const twMax='); choice = source[start:source.index('      set(mw);', start)]; script = "const tw0=800,mw0=600,total=1400,mh0=350,th0=700,fixedW=0,SLACK=60,diff=()=>-350,document={body:{classList:{contains:c=>c==='o-h'}}};let mw=mw0;" + choice + ';process.stdout.write(JSON.stringify([mw,total-mw]));'
        self.assertEqual(subprocess.check_output(['node', '-e', script], text=True).strip(), '[600,800]')

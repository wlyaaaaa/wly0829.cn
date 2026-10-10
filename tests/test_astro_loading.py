"""原图与徽标不降质；同大小内容变化不再复用旧资源地址。"""
import importlib.util, tempfile, unittest
from pathlib import Path
from unittest.mock import patch
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('astro_blocks', ROOT/'site-astro/tools/render_blocks.py')
r = importlib.util.module_from_spec(spec); spec.loader.exec_module(r)

class AstroLoadingTests(unittest.TestCase):
    def test_content_identity_and_same_size_change(self):
        with tempfile.TemporaryDirectory() as tmp, patch.object(r, 'PUB', tmp):
            a, b = Path(tmp)/'a.png', Path(tmp)/'b.png'
            a.write_bytes(b'old'); b.write_bytes(b'old')
            old = r.publish_path(str(a))
            self.assertEqual(old, r.publish_path(str(b)))
            a.write_bytes(b'new')
            self.assertNotEqual(old, r.publish_path(str(a)))
            self.assertEqual((Path(tmp)/old.lstrip('/')).read_bytes(), b'old')

    def test_svg_and_img_keep_noscript_original(self):
        source = '<svg viewBox="1 2 60 58"><image href="/a.png" width="1586"/></svg><img src="/b.png" data-ts-w="40" data-ts-h="30">'
        body = r.defer_images(source)
        self.assertIn('data-ts-src="/a.png"', body)
        self.assertIn('data-ts-src="/b.png"', body)
        self.assertIn('crossorigin="anonymous"', body)
        self.assertTrue('src="/b.png"' in (eager := r.defer_images('<div data-comp="illustration"><img src="/b.png"></div><img src="/c.png" data-title-key="title">', True)) and 'data-ts-src' not in eager)
        self.assertIn('<noscript>'+source.split('<img')[0]+'</noscript>', body)
        self.assertIn('width="40"', body); self.assertIn('height="30"', body)

    def test_badge_preserves_canvas_and_original_pixels(self):
        assets = ROOT/'src/typeset/components/comp-hub/assets'
        with Image.open(assets/'projects-home-22.png') as original, Image.open(assets/'github-badge-original-pixels.png') as badge:
            self.assertEqual(original.size, badge.size)
            box = (1284, 62, 1404, 182)
            self.assertEqual(original.convert('RGBA').crop(box).tobytes(), badge.crop(box).tobytes())
            self.assertEqual(badge.getpixel((0, 0))[3], 0)

if __name__ == '__main__': unittest.main()

from pathlib import Path
import tempfile
import unittest

from PIL import Image, ImageCms

HERE = Path(__file__).resolve().parents[1] / 'site-v2/site-assembly'


def load_optimize():
    scope = {}
    exec(compile((HERE / '压图.py').read_text(encoding='utf-8'), str(HERE / '压图.py'), 'exec'), scope)
    return scope['optimize']


class PruneJsonReferenceTests(unittest.TestCase):
    def test_images_listed_in_a_referenced_json_survive(self):
        # 实况项目画只写在 looks.json 里；清理时把它们当没用删掉，上线就是破图。
        optimize = load_optimize()
        with tempfile.TemporaryDirectory() as tmp:
            site = Path(tmp)
            (site / 'live/project').mkdir(parents=True)
            (site / 'live/img/pj').mkdir(parents=True)
            (site / 'live/project/page.js').write_text("fetch('/live/project/looks.json')", encoding='utf-8')
            (site / 'live/project/looks.json').write_text('{"a": {"img": "/live/img/pj/a.webp", "more": "/live/more.json"}}', encoding='utf-8')
            (site / 'live/more.json').write_text('{"x": "/live/img/pj/c.webp"}', encoding='utf-8')
            (site / 'live/stray.json').write_text('{"x": "/live/img/pj/d.webp"}', encoding='utf-8')
            for name in ('a', 'b', 'c', 'd'):
                (site / f'live/img/pj/{name}.webp').write_bytes(b'RIFF')
            optimize(site)
            kept = sorted(p.name for p in (site / 'live/img/pj').iterdir())
            self.assertEqual(kept, ['a.webp', 'c.webp'])   # 顺着 JSON 引用找到的留下；没人引用的 b、只被没人用的 JSON 提到的 d 删掉
            self.assertTrue((site / 'live/more.json').exists())
            self.assertFalse((site / 'live/stray.json').exists())

    def test_only_adopted_lossless_illustrations_get_smaller(self):
        optimize = load_optimize()
        with tempfile.TemporaryDirectory() as tmp:
            site = Path(tmp)
            assets = site / 'project/assets'
            assets.mkdir(parents=True)
            fresh, old, renamed, alternate = (assets / name for name in
                ('fresh.webp', 'old.webp', 'renamed.webp', 'alternate.webp'))
            image = Image.effect_noise((256, 160), 48).convert('RGBA')
            alpha = Image.linear_gradient('L').resize(image.size)
            image.putalpha(alpha)
            profile = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
            image.save(fresh, 'WEBP', lossless=True, exact=True, icc_profile=profile)
            original = fresh.read_bytes()
            old.write_bytes(original)
            alternate.write_bytes(original)
            image.save(renamed, 'WEBP', quality=90, icc_profile=profile)
            already_lossy = renamed.read_bytes()
            page = assets.parent / 'index.html'
            page.write_text(''.join(f'<img src="assets/{p.name}">' for p in (fresh, old, renamed)), encoding='utf-8')
            report = optimize(site, (fresh, renamed, alternate))
            compressed = fresh.read_bytes()
            self.assertLess(len(compressed), len(original))
            self.assertEqual(report, (1, len(original) - len(compressed)))
            self.assertEqual(old.read_bytes(), original)
            self.assertEqual(renamed.read_bytes(), already_lossy)
            self.assertFalse(alternate.exists())
            with Image.open(fresh) as result:
                self.assertEqual(result.size, image.size)
                self.assertEqual(result.getchannel('A').tobytes(), alpha.tobytes())
                self.assertEqual(result.info['icc_profile'], profile)
            self.assertEqual(optimize(site, (fresh, renamed)), (0, 0))
            self.assertEqual(fresh.read_bytes(), compressed)


if __name__ == '__main__':
    unittest.main()

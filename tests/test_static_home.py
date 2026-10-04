"""A living release must restore the original plate without losing newer work."""
import copy
import importlib.util
import json
import re
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parents[1] / 'scripts'
spec = importlib.util.spec_from_file_location('static_home', HERE / 'prepare-static-home.py')
static = importlib.util.module_from_spec(spec)
spec.loader.exec_module(static)


class StaticHomeTests(unittest.TestCase):
    def fixture(self, root):
        reference, baseline = root / 'reference', root / 'baseline'
        reference.mkdir(); baseline.mkdir()
        image = b'original static transport'
        for directory in (reference, baseline):
            (directory / 'assets').mkdir()
            (directory / 'assets/plate.webp').write_bytes(image)
            (directory / 'assets/plate.avif').write_bytes(b'original high resolution transport')
        layout = {'size': [1672, 941], 'source_size': [1672, 941], 'crop': [0, 0, 1672, 941],
                  'viewer': {'src': 'assets/plate.webp', 'sha256': static.proof(image)['sha256']},
                  'links': [{'href': '/original/', 'rect': [.1, .1, .2, .1]}]}
        data = {'page': 'home', 'screens': [{'id': 'home-01', 'layouts': {'h': layout, 'v': copy.deepcopy(layout)}},
                                            {'id': 'home-02', 'newer_comic': 'retained'}],
                'shared': {'script_bundle': '/_shared/app-1234.js'}, 'video': {'src': 'original.mp4', 'mount_allowed': True}}
        picture = '<source type="image/avif" srcset="assets/plate.avif 1920w"><img src="assets/plate.webp">'
        def html(d, p, additions=''):
            return '<html><head>'+additions+'<script src="'+d['shared']['script_bundle']+'" defer></script></head><body>'\
                +'<section id="home-01" style="aspect-ratio:2/1;--grid-index:0"><picture>'+p+'</picture><a href="/new/">new source link</a></section>'\
                +'<script id="page-data" type="application/json">'+json.dumps(d)+'</script><p>new source content</p></body></html>'
        (reference / 'index.html').write_text(html(data, picture), encoding='utf8')
        data = copy.deepcopy(data)
        for layout in data['screens'][0]['layouts'].values():
            layout.update(size=[2880, 1621], source_size=[2880, 1621], crop=[0, 0, 2880, 1621],
                          viewer={'src': '/_shared/home-living/white.webp'}, links=[{'href': '/new/', 'rect': [.1, .1, .2, .1]}])
        data.update(home_living=True)
        data['shared']['script_bundle'] = '/_shared/home-app-5678.js'
        (baseline / '_shared').mkdir()
        original_app = "if(busy||document.hidden||!document.querySelector('[data-slot]'))return;\nfunction display(){\n document.body.dataset.statusPhase=phase;\n}\nwindow.SiteStatus={parse,refresh,history,resetLayout:resetOfflineLayout};\n// newer runtime fix retained\n"
        model = static.living.MODEL_START + '\nwindow.HomeLivingStatusModel = ()=>({});\n' + static.living.MODEL_END
        bridge = static.living.BRIDGE_START + '\n(()=>{window.HeroLive.mount();\n})();'
        mounted = static.living.patch_runtime(original_app, model, bridge)
        (baseline / '_shared/home-app-5678.js').write_text(mounted, encoding='utf8')
        (baseline / 'index.html').write_text(html(data, '<img src="/_shared/home-living/white.webp">',
            '<script src="/_shared/home-living/hero-live.js" defer></script><link rel="stylesheet" href="/_shared/home-living-bind-12.css">'), encoding='utf8')
        (baseline / 'other.html').write_bytes(b'other source page and creative unchanged')
        manifest = {'schema': 'wly.hybrid-release.v1', 'runtime_overlay': {'retained': True},
                    'home_living_preparation': {'package_bytes_unchanged': True}, 'home_comic_preparation': {'retained': True}}
        manifest['files'] = static.inventory(baseline)
        manifest['release_id'] = static.identity(manifest['files'], manifest)
        (baseline / 'release-manifest.json').write_text(json.dumps(manifest), encoding='utf8')
        return reference, baseline, data, original_app

    def test_restoration_preserves_current_content_and_original_asset_inodes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            reference, baseline, before_data, original_app = self.fixture(root)
            before = static.inventory(baseline)
            result = static.prepare(baseline, reference / 'index.html', root / 'out', root / 'report.json')
            output = root / 'out'
            self.assertEqual(static.inventory(baseline), before)
            self.assertEqual(list(result['changed_existing']), ['index.html'])
            self.assertEqual((output / 'other.html').read_bytes(), (baseline / 'other.html').read_bytes())
            data = json.loads(static.PAGE_DATA.search((output / 'index.html').read_text())[2])
            self.assertEqual(data['screens'][1:], before_data['screens'][1:])
            for orientation in ('h', 'v'):
                self.assertEqual(data['screens'][0]['layouts'][orientation]['links'], before_data['screens'][0]['layouts'][orientation]['links'])
            self.assertEqual((output / result['home_bundle']['path']).read_text(), original_app)
            self.assertFalse(data['video']['mount_allowed'])
            manifest = json.loads((output / 'release-manifest.json').read_text())
            self.assertNotIn('home_living_preparation', manifest)
            self.assertTrue(manifest['home_comic_preparation']['retained'])
            self.assertTrue(static.verify_static_home(output, result)['no_active_living_resources_or_runtime_calls'])

    def test_changed_original_asset_is_rejected_before_output(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); reference, baseline, _, _ = self.fixture(root)
            (reference / 'assets/plate.avif').write_bytes(b'different original')
            with self.assertRaisesRegex(ValueError, 'bound original static asset'):
                static.prepare(baseline, reference / 'index.html', root / 'out', root / 'report.json')
            self.assertFalse((root / 'out').exists())

    def test_unknown_living_dependency_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'unknown living dependency'):
            static.remove_living_runtime('window.HeroLive.customMount();')

    def test_final_gate_rejects_reactivated_living_script(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); reference, baseline, _, _ = self.fixture(root)
            result = static.prepare(baseline, reference / 'index.html', root / 'out', root / 'report.json')
            path = root / 'out/index.html'
            path.write_text(path.read_text().replace('</head>', '<script data-album-runtime data-src="/_shared/home-living/hero-live.js"></script></head>'))
            with self.assertRaisesRegex(ValueError, 'actively loads living art'):
                static.verify_static_home(root / 'out', result)

    def test_static_reference_cannot_be_a_mounted_homepage(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); _, baseline, _, _ = self.fixture(root)
            with self.assertRaisesRegex(ValueError, 'actual pre-living homepage'):
                static.reference_data(baseline / 'index.html')


if __name__ == '__main__':
    unittest.main()

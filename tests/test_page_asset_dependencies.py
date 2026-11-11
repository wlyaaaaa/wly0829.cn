"""Page assets invalidate their own fingerprints and keep immutable URLs."""
import hashlib
import html
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'site-astro/tools'))
import render_blocks as render
import convert_page as convert
spec = importlib.util.spec_from_file_location('asset_build', ROOT / 'scripts/build-site.py')
build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)

class PageAssetTests(unittest.TestCase):
    def test_global_indexes_and_runtime_bundles_stop_at_the_file(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); site = root/'site-astro'; public = site/'public'; assets = root/'sources/assets'
            runtime = site/'src/chrome/runtime/fixture.json'
            for path in (assets, public/'_album', public/'_shared', runtime.parent): path.mkdir(parents=True)
            (assets/'own.png').write_bytes(b'own'); other = assets/'other.png'; other.write_bytes(b'other')
            index = public/'_album/routes-global.json'
            index.write_text(json.dumps({'schema': 'wly.album-routes.v1', 'routes': {'other': {'src': '/assets/other.png'}}}), encoding='utf8')
            bundle = public/'_shared/retry.js'; bundle.write_text('import "/assets/other.png"; const note="package.json";', encoding='utf8')
            config = public/'local.json'; config.write_text('{"src":"/assets/own.png","description":"package.json"}', encoding='utf8')
            (root/'package.json').write_text('{"src":"/assets/other.png"}', encoding='utf8')
            data = {'screens': [{'src': '/assets/other.png'}], 'shared': {'script_bundle': '/_shared/retry.js', 'art': {'back_to_top': '/assets/own.png', 'catalog': '/assets/other.png'}}}
            runtime.write_text(json.dumps({'head': ['<link href="/_album/routes-global.json">'], 'living_config': '/local.json', 'tail': '<script id="page-data" type="application/json">'+json.dumps(data)+'</script>'}), encoding='utf8')
            with patch.multiple(render, REPO=str(root), SITE=str(site), PUB=str(public)), patch.object(render.A, 'ASSET_ROOT', str(assets)):
                self.assertEqual(render.asset_dependencies(runtime.as_uri()), {runtime, index, bundle, config, assets/'own.png'})
                before = render.asset_fingerprint(runtime.as_uri()); other.write_bytes(b'changed')
                self.assertEqual(before, render.asset_fingerprint(runtime.as_uri()))
                index.write_text(index.read_text('utf8')+' ', encoding='utf8')
                self.assertNotEqual(before, render.asset_fingerprint(runtime.as_uri()))

    def test_reference_closure_isolated_fingerprints_and_immutable_names(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); assets = root / 'sources/assets'; assets.mkdir(parents=True)
            public = root / 'site-astro/public'; public.mkdir(parents=True)
            files = {'one.png': b'old', 'two.png': b'other', '完整 图.webp': b'full', 'top.png': b'top',
                     'more.svg': b'<svg/>', 'bundle.js': b'const image="/assets/top.png";',
                     'style.css': b'body{background:url(top.png)}'}
            for name, raw in files.items(): (assets / name).write_bytes(raw)
            with patch.multiple(render, REPO=str(root), PUB=str(public)), patch.object(render.A, 'ASSET_ROOT', str(assets)), patch.multiple(build, ROOT=root, SITE=root/'site-astro', HASH_CACHE={}):
                value = '<i data-config="' + html.escape(json.dumps({'script_bundle': '/assets/bundle.js', 'gallery_assets': ['完整 图.webp'], 'art': {'back_to_top': '/assets/top.png'}}), quote=True) + '"></i><img srcset="/assets/one.png 1x, /assets/two.png 2x"><link href="/assets/style.css"><script type="application/json">{"leaves":["/assets/more.svg"]}</script>'
                self.assertEqual({p.name for p in render.asset_dependencies(value)}, set(files))
                first, second = {'asset': 'one.png'}, {'asset': 'two.png'}
                before = [render.asset_fingerprint(v) for v in (first, second)]
                build_before = [build.fingerprint(render.asset_dependencies(v)) for v in (first, second)]
                keys = [render.screen_cache_key((assets / n).as_uri(), 'h', 'same') for n in ('one.png', 'two.png')]
                old = render.publish_path(str(assets / 'one.png'))
                (assets / 'one.png').write_bytes(b'new')
                self.assertEqual([a != render.asset_fingerprint(v) for a, v in zip(before, (first, second))], [True, False])
                self.assertEqual([a != build.fingerprint(render.asset_dependencies(v)) for a, v in zip(build_before, (first, second))], [True, False])
                self.assertEqual([a != render.screen_cache_key((assets / n).as_uri(), 'h', 'same') for a, n in zip(keys, ('one.png', 'two.png'))], [True, False])
                new = render.publish_path(str(assets / 'one.png'))
                self.assertNotEqual(old, new)
                self.assertEqual([(public / u.lstrip('/')).read_bytes() for u in (old, new)], [b'old', b'new'])
                regions = assets / 'title-content-regions.json'; one = hashlib.sha256(b'new').hexdigest()
                fingerprint = render.asset_fingerprint(first)
                regions.write_text(json.dumps({'regions': {'unrelated': {'content_box': [1]}}}), encoding='utf8')
                self.assertEqual(fingerprint, render.asset_fingerprint(first))
                regions.write_text(json.dumps({'regions': {one: {'content_box': [1]}}}), encoding='utf8')
                self.assertNotEqual(fingerprint, render.asset_fingerprint(first))
                for page in ('a', 'b'):
                    target = root / 'sources/pages' / page; target.mkdir(parents=True)
                    (target / 'page.json').write_text(json.dumps({'screens': [{'id': page, 'text': ''}]}), encoding='utf8')
                rows = {'a': [{'asset': 'one.png'}], 'b': [{'asset': 'two.png'}]}
                rows['shared'] = [{'asset': 'top.png', 'key': 'Test标志', 'role': 'icon', 'semantic_status': convert.BRAND_OK[0]}, {'asset': 'more.svg', 'role': 'title', 'title_text': '画廊'}]
                (root/'sources/pages/a/layout.json').write_text(json.dumps([{'screen': 'a', 'blocks': [{'type': 'section_heading', 'text_ref': '画廊', 'brand': 'Test'}]}]), encoding='utf8')
                with patch.multiple(convert, REPO=str(root), _lib=rows):
                    before = [convert.page_asset_fingerprint(p, render.sha) for p in ('a', 'b')]
                    rows['shared'][0]['asset'] = 'two.png'
                    self.assertEqual([a != convert.page_asset_fingerprint(p, render.sha) for a, p in zip(before, ('a', 'b'))], [True, False])
                    rows['shared'][0]['asset'] = 'top.png'; rows['shared'][1]['asset'] = 'two.png'
                    self.assertEqual([a != convert.page_asset_fingerprint(p, render.sha) for a, p in zip(before, ('a', 'b'))], [True, False])
if __name__ == '__main__': unittest.main()

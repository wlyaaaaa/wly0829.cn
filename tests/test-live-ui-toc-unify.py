"""Approved TOC input and complete-site admission checks."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('live_ui', Path(__file__).resolve().parents[1] / 'scripts/prepare-live-ui.py')
ui = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ui)


class ApprovedTocInputs(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(dir=os.environ.get('TEMP'))
        self.root = Path(self.tmp.name)
        self.package = self.root / 'package'
        (self.package / 'images').mkdir(parents=True)
        (self.package / 'runtime').mkdir()
        self.pages = ['index.html', '404.html', *[f'pages/{i}/index.html' for i in range(83)]]
        self.labels = {}
        items = []
        for i in range(75):
            name, filename, payload = f'label {i}', f'label-{i}.webp', f'bitmap {i}'.encode()
            (self.package / 'images' / filename).write_bytes(payload)
            self.labels[name] = {'src': '/_shared/nav-unify-standard/' + filename, 'size': [100, 50],
                                 'ink_left': .1, 'ink_right': .9, 'ink_top': .2, 'ink_bottom': .8}
            items.append({'text': name, 'webp': 'images/' + filename, 'size': [100, 50],
                          'webp_sha256': hashlib.sha256(payload).hexdigest(), 'ink_box_alpha16': [10, 10, 90, 40]})
        self.write('label-map-webp-visible-ink.json', self.labels)
        self.write('pages-to-unify.json', self.pages)
        self.write('manifest.json', {'expected_labels': 75, 'available_labels': 75, 'missing': [], 'items': items})
        for name in ('prepare-toc-unify.py', 'runtime/toc-consistency.css', 'runtime/toc-consistency.js'):
            (self.package / name).write_text('', encoding='utf8')
        self.recipe = self.root / 'recipe.json'
        self.recipe.write_text(json.dumps({'schema': 'wly.live-ui-recipe.v1', 'toc_unify_package': str(self.package)}), encoding='utf8')

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, name, value):
        (self.package / name).write_text(json.dumps(value), encoding='utf8')

    def test_consumed_inputs_include_actual_helper_runtime_maps_and_all_bitmaps(self):
        _, labels, pages, images, consumed = ui.toc_unify_package(self.package)
        self.assertEqual(set(labels), set(self.labels))
        self.assertEqual(pages, self.pages)
        self.assertEqual(len(images), 75)
        self.assertEqual(set(consumed), {self.package / name for name in (
            'prepare-toc-unify.py', 'label-map-webp-visible-ink.json', 'pages-to-unify.json',
            'manifest.json', 'runtime/toc-consistency.css', 'runtime/toc-consistency.js')} | set(images))

    def test_changed_bitmap_and_incomplete_declared_scope_are_rejected(self):
        image = self.package / 'images/label-0.webp'
        original = image.read_bytes()
        image.write_bytes(b'changed bitmap')
        with self.assertRaisesRegex(ValueError, 'bitmap changed'):
            ui.toc_unify_package(self.package)
        image.write_bytes(original)
        self.write('pages-to-unify.json', self.pages[:-1])
        with self.assertRaisesRegex(ValueError, '85 pages and 75 labels'):
            ui.toc_unify_package(self.package)

    def test_missing_complete_site_page_fails_without_changing_site(self):
        site = self.root / 'site'
        site.mkdir()
        home = site / 'index.html'
        original = b'<head></head><nav class="toc"><a data-section="top">original</a></nav>'
        home.write_bytes(original)
        with self.assertRaisesRegex(ValueError, 'Complete TOC page is missing: 404.html'):
            ui.prepare_toc_recipe(site, self.recipe)
        self.assertEqual(home.read_bytes(), original)
        self.assertEqual([p.relative_to(site).as_posix() for p in site.rglob('*')], ['index.html'])


if __name__ == '__main__':
    unittest.main()

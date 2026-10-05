"""Final TOC refresh keeps the creative chain and complete file ledger coherent."""
import ast
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest

SOURCE = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('toc_final_hybrid', SOURCE / 'scripts/hybrid-release.py')
hybrid = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hybrid)
tree = ast.parse((SOURCE / 'scripts/build-typeset-site.py').read_text('utf8'))
main = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'main')
start = next(index for index, node in enumerate(main.body) if isinstance(node, ast.If)
             and 'toc_unify_package' in ast.unparse(node.test))
end = next(index for index in range(start, len(main.body)) if isinstance(main.body[index], ast.Assign)
           and any(isinstance(target, ast.Name) and target.id == 'report' for target in main.body[index].targets))
FINALIZE = compile(ast.Module(body=main.body[start:end], type_ignores=[]), str(SOURCE / 'scripts/build-typeset-site.py'), 'exec')


class FinalTocRefresh(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='typeset-toc-final-')
        self.root = Path(self.tmp.name)
        self.site = self.root / 'site'
        self.site.mkdir()
        self.pages = ['index.html', '404.html', *[f'pages/{i}/index.html' for i in range(82)]]
        for relative in [*self.pages, 'retained/index.html']:
            self.put(relative, b'<head></head><nav class="toc">original</nav><p>body</p>')
        baseline = hybrid.inventory(self.site)
        self.put('index.html', (self.site / 'index.html').read_bytes() + b'<p>approved creative picture</p>')
        self.put('_shared/creative.js', b'approved creative runtime')
        files = hybrid.inventory(self.site)
        ledger = {relative: {'kind': 'integrated_preparation', 'before': baseline.get(relative), 'after': files[relative]}
                  for relative in ('index.html', '_shared/creative.js')}
        steps = [{'name': name, 'before_release_id': f'step-{index}', 'after_release_id': f'step-{index+1}'}
                 for index, name in enumerate(('static-home', 'river', 'comic', 'album', 'demo', 'retry'))]
        self.creative = {'schema': 'wly.creative-replay-result.v1', 'steps': steps, 'raw_release_id': 'step-0',
                         'prepared_release_id': 'step-6', 'files': ledger,
                         'assembled_release_id': self.identity(files)}
        self.manifest = {'schema': 'wly.hybrid-release.v1', 'files': files, 'release_id': self.identity(files),
                         'baseline_files': baseline, 'routes': [hybrid.file_route(relative) for relative in [*self.pages, 'retained/index.html']],
                         'accepted_pages': {hybrid.file_route(relative): {} for relative in self.pages if relative != 'index.html'},
                         'release_overlay': ledger, 'creative_preparation': self.creative}
        self.recipe = self.root / 'recipe.json'
        self.inputs = {str(self.recipe): {'sha256': 'stable recipe', 'bytes': 12}}
        self.live_ui = {'schema': 'wly.live-ui-preparation.v1', 'status': 'prepared_pending_toc',
                        'toc': {'status': 'pending_complete_site', 'missing_labels': []}}
        self.states = {relative: {'url': hybrid.file_route(relative)} for relative in self.pages if relative != 'index.html'}
        self.called = []

    def tearDown(self):
        self.tmp.cleanup()

    def put(self, relative, payload):
        path = self.site / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)

    def identity(self, files):
        return hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest()

    def prepare_toc(self, site, recipe):
        self.assertEqual((site, recipe), (self.site, self.recipe))
        self.called.append((site, recipe))
        for relative in self.pages:
            self.put(relative, (self.site / relative).read_bytes().replace(b'original</nav>', b'approved drawn labels</nav>'))
        for index in range(75):
            self.put(f'_shared/nav-unify-standard/label-{index}.webp', f'approved bitmap {index}'.encode())
        return {'status': 'prepared', 'page_count': 84, 'changed_page_count': 84, 'missing_labels': []}, dict(self.inputs)

    def execute(self, config):
        self.recipe.write_text(json.dumps(config), encoding='utf8')
        context = {'live_ui': self.live_ui, 'live_ui_inputs': dict(self.inputs), 'manifest': self.manifest,
                   'creative': self.creative, 'workbench': None, 'states': self.states,
                   'args': SimpleNamespace(output=self.site, live_ui_preparation=self.recipe),
                   'read': lambda path: json.loads(path.read_text('utf8')),
                   'ui_module': SimpleNamespace(prepare_toc_recipe=self.prepare_toc),
                   'hybrid': hybrid, 'hashlib': hashlib, 'json': json}
        exec(FINALIZE, context)
        return context

    def test_84_actual_file_changes_update_final_manifest_without_rewriting_six_steps(self):
        previous = copy.deepcopy(self.creative)
        original = (self.site / 'retained/index.html').read_bytes()
        context = self.execute({'toc_unify_package': 'approved package'})
        final = hybrid.verify_release(self.site)
        self.assertEqual(len(self.called), 1)
        self.assertEqual(final['release_id'], self.identity(hybrid.inventory(self.site)))
        self.assertNotEqual(final['release_id'], previous['assembled_release_id'])
        self.assertEqual(final['creative_preparation']['steps'], previous['steps'])
        self.assertEqual(final['creative_preparation']['prepared_release_id'], previous['prepared_release_id'])
        self.assertEqual(final['creative_preparation']['raw_release_id'], previous['raw_release_id'])
        self.assertEqual(final['creative_preparation']['assembled_release_id'], final['release_id'])
        self.assertEqual(final['creative_preparation']['files'], final['release_overlay'])
        self.assertEqual(len(final['release_overlay']), 77)
        for relative, entry in final['release_overlay'].items():
            self.assertEqual(entry['kind'], 'integrated_preparation')
            self.assertEqual(entry['before'], final['baseline_files'].get(relative))
            self.assertEqual(entry['after'], final['files'][relative])
        for relative, state in self.states.items():
            self.assertEqual(state['html_sha256'], final['files'][relative]['sha256'])
        self.assertEqual((self.site / 'retained/index.html').read_bytes(), original)
        self.assertEqual(final['live_ui_preparation']['status'], 'prepared')
        self.assertEqual(final['live_ui_preparation']['toc']['page_count'], 84)
        self.assertEqual(context['live_ui_inputs'], self.inputs)

    def test_old_recipe_skips_the_new_api_and_preserves_all_html_assets_and_manifest(self):
        self.live_ui.update(status='prepared', toc={'status': 'prepared', 'missing_labels': []})
        self.manifest['live_ui_preparation'] = self.live_ui
        hybrid.write(self.site / hybrid.MANIFEST, self.manifest)
        before = {path.relative_to(self.site).as_posix(): path.read_bytes() for path in self.site.rglob('*') if path.is_file()}
        self.execute({'schema': 'wly.live-ui-recipe.v1', 'sprite': 'old sprite', 'label_map': 'old map'})
        self.assertEqual(self.called, [])
        after = {path.relative_to(self.site).as_posix(): path.read_bytes() for path in self.site.rglob('*') if path.is_file()}
        self.assertEqual(after, before)


if __name__ == '__main__':
    unittest.main()

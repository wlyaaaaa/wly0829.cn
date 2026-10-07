"""Real renderer and builder bytes, with an isolated non-publication baseline."""
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
WORK = Path(os.environ.get('WLY_INCREMENTAL_TEST_ROOT', 'E:/Cache/Codex/Temp/r3-1-test-002c33e9'))
def module(name, relative):
    spec = importlib.util.spec_from_file_location(name, ROOT/relative)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod); return mod
c = module('incremental_command', 'scripts/check-typeset-site.py')
b = module('incremental_builder', 'scripts/build-typeset-site.py')
LOCK = json.loads((ROOT/'config/render.lock.json').read_text('utf8'))

class IncrementalTests(unittest.TestCase):
    def test_missing_brotli_fails_before_render(self):
        with patch.dict(sys.modules, {'brotli': None}), self.assertRaisesRegex(ValueError, 'brotli'):
            c.renderer.verify_lock(LOCK)

    def test_page_keys_follow_dependencies_and_ignore_unrelated_runtime_js(self):
        c.renderer.verify_lock(LOCK)
        original_sources = c.renderer.page_sources
        c.renderer.page_sources = lambda: {name:path for name,path in original_sources().items()
            if name in {'404', 'projects-home', 'rule-claude-adapter', 'typora-theme-pack', 'rule-engineering-delivery'}}
        self.addCleanup(setattr, c.renderer, 'page_sources', original_sources)
        before = c.fingerprints(LOCK)
        real = c.digest
        for file, expected in [('scripts/how-demo-runtime.js', []),
            ('src/typeset/components/comp-hub/tiles.css', ['projects-home']),
            ('src/typeset/components/table/table.py', ['rule-claude-adapter', 'typora-theme-pack']),
            ('src/typeset/components/comp-diagram/step-ports.js', ['rule-engineering-delivery'])]:
            with patch.object(c, 'digest', lambda p: 'f'*64 if Path(p) == ROOT/file else real(p)):
                after = c.fingerprints(LOCK)
            changed = [name for name in before if before[name] != after[name]]
            if expected: self.assertTrue(set(expected) <= set(changed), (file, changed))
            else: self.assertEqual(changed, [])

    def test_real_page_reuse_and_full_assembly_are_byte_equal(self):
        if not os.environ.get('WLY_INCREMENTAL_LEGACY'): self.skipTest('Set WLY_INCREMENTAL_LEGACY to replay an independently retained actual legacy release')
        case = WORK/('case-'+str(time.time_ns())); case.mkdir(parents=True)
        legacy = Path(os.environ['WLY_INCREMENTAL_LEGACY'])
        baseline = case/'baseline'; baseline.mkdir()
        for rel in ('index.html', '404.html', 'projects/index.html', 'skills/index.html', 'rules/index.html'):
            p = baseline/rel; p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes((legacy/rel).read_bytes() if rel == '404.html' else b'<html><head></head><body>isolated fixture</body></html>')
        b.local_deps(baseline, legacy, legacy)
        manifest = {'schema':'wly.hybrid-release.v1', 'files':b.hybrid.inventory(baseline),
                    'routes':['/', '/404.html', '/projects/', '/skills/', '/rules/']}
        b.write(baseline/'release-manifest.json', manifest)
        c.assets.CACHE = str(case/'derived-assets')
        key = c.fingerprints(LOCK)['404']; rendered = case/'rendered'; cache = case/'state'
        times = {}; from playwright.sync_api import sync_playwright
        with sync_playwright() as runtime:
            browser = runtime.chromium.launch(executable_path=LOCK['chrome']['path'], headless=True, args=LOCK['args'])
            begin = time.perf_counter()
            c.renderer.render_page('404', do_compare=False, out_root=str(rendered), browser=browser)
            times['full_render_seconds'] = time.perf_counter()-begin
            c.store_page('404', key, rendered, cache)
            # A genuine script byte change in an isolated shell changes assembly, never the raster key.
            script = next(p for p in baseline.rglob('*.js') if 'function layout(){' in p.read_text('utf8'))
            shell_before = c.shell_key('404', baseline, baseline, b.hybrid)
            script.write_bytes(script.read_bytes()+b'\n/* isolated incremental JS edit */\n')
            self.assertNotEqual(shell_before, c.shell_key('404', baseline, baseline, b.hybrid))
            manifest['files'] = b.hybrid.inventory(baseline); b.write(baseline/'release-manifest.json', manifest)
            begin = time.perf_counter(); incremental = case/'incremental'
            with patch.object(c.renderer, 'render_page', side_effect=AssertionError('Incremental reuse must not render')):
                self.assertTrue(c.reuse_page('404', key, incremental, cache))
            times['reuse_seconds'] = time.perf_counter()-begin
            full = case/'full'; c.renderer.render_page('404', do_compare=False, out_root=str(full), browser=browser)
            browser.close()
        self.assertEqual((incremental/'404/404-01-h.png').read_bytes(), (full/'404/404-01-h.png').read_bytes())
        source = ROOT/'sources/pages/404/page.json'; inventory = case/'screens.jsonl'
        inventory.write_text(json.dumps({'page':'404', 'source_path':str(source)})+'\n', encoding='utf8')
        typed_inventory = case/'typeset-inventory/screens.jsonl'; typed_inventory.parent.mkdir()
        typed_inventory.write_bytes(inventory.read_bytes()); geometry = case/'geometry.json'
        fit_source = case/'typeset-proto/engine/render.py'; fit_source.parent.mkdir(parents=True)
        fit_source.write_bytes((ROOT/'src/typeset/engine/render.py').read_bytes())
        server = subprocess.Popen([sys.executable, str(ROOT/'scripts/serve-typeset-preview.py'), '--root', str(baseline),
            '--build-report', str(case/'unused.json'), '--verification-out', str(case/'unused-qa.json'),
            '--typeset-root', str(incremental), '--geometry-out', str(geometry), '--legacy-site', str(baseline), '--port', '0'],
            stdout=subprocess.PIPE, text=True, encoding='utf8', creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
        try:
            address = server.stdout.readline().split()[1]
            subprocess.run([sys.executable, str(ROOT/'scripts/run-typeset-checks.py'), '--mode', 'geometry', '--url', address,
                '--task-cache', str(case/'browser-cache'), '--chrome', LOCK['chrome']['path'], '--pages', '404'], check=True)
        finally:
            server.terminate(); server.wait(timeout=15); server.stdout.close()
        outputs = []
        for label, typeset in [('incremental', incremental), ('full', full)]:
            output = case/(label+'-site'); report = case/(label+'-build.json')
            command = ['build', '--typeset-root', str(typeset), '--baseline', str(baseline), '--legacy-site', str(baseline),
                '--inventory', str(inventory), '--output', str(output), '--report', str(report),
                '--asset-cache', str(case/'asset-cache'), '--reuse-asset-cache', '--pages', '404', '--geometry', str(geometry)]
            with patch.object(sys, 'argv', command), contextlib.redirect_stdout(io.StringIO()): b.main()
            outputs.append(output)
        self.assertEqual({p.relative_to(outputs[0]).as_posix():p.read_bytes() for p in outputs[0].rglob('*') if p.is_file()},
                         {p.relative_to(outputs[1]).as_posix():p.read_bytes() for p in outputs[1].rglob('*') if p.is_file()})
        proof = json.loads((case/'incremental-build.json').read_text('utf8'))
        self.assertEqual(proof['pages']['404']['status'], 'built', proof['pages']['404']['issues'])
        (case/'timings.json').write_text(json.dumps(times), encoding='utf8')
        cached = cache/'pages'/key/'404/404-01-h.png'; cached.write_bytes(b'corrupt')
        self.assertFalse(c.reuse_page('404', key, case/'bad', cache))
        print('Real renderer/builder differential evidence: '+str(case), flush=True)

    def test_relative_content_identity_survives_worktree_move(self):
        value = {'path':str(ROOT/'sources/pages/404/page.json'), 'input':'same'}
        before = c.content_key(value)
        relocated = WORK/'different-worktree'
        with patch.object(c, 'ROOT', relocated):
            self.assertEqual(before, c.content_key({'path':str(relocated/'sources/pages/404/page.json'), 'input':'same'}))

if __name__ == '__main__': unittest.main()

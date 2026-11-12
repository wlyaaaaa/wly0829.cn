"""A body/index update must not change unrelated resource or HTML bytes."""
import importlib.util
import html
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
def load(name, relative):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative)
    value = importlib.util.module_from_spec(spec); spec.loader.exec_module(value); return value
oss = load('cascade_oss', 'scripts/prepare-oss-release.py')
build = load('cascade_build', 'scripts/build-site.py')
retry = load('cascade_retry', 'scripts/prepare-resource-retry.py')
build_runtime = load('cascade_runtime', 'site-astro/tools/build_runtime.py')

class NoCascadeTests(unittest.TestCase):
    def test_home_transcript_comparison_is_plain_text(self):
        highlights = load('cascade_highlights', 'scripts/prepare-home-highlights.py')
        text = '数字截至 2026-10-22\n\n16,146 次识别 & 更多'
        home = lambda body: '<div data-screen-transcript="home-04">' + body + '</div>'
        expected = '\n'.join(highlights.expected_text(text))
        self.assertTrue(highlights.transcript_matches(home(html.escape(expected).replace('\n', '\r\n')), text))
        self.assertFalse(highlights.transcript_matches(home(html.escape('\n'.join(highlights.expected_text(text.replace('146', '074'))))), text))
        self.assertFalse(highlights.transcript_matches('<div></div>', text))

    def test_search_loads_both_tables_before_the_existing_client(self):
        body = '<head><script>window.note="search-index.js"</script></head>\r\n<script src="/search-projects.js"></script><script type="module" data-src="/client.js"></script>'
        result = build_runtime.search_index_entry(body, {})
        self.assertIn('\r\n<script src="/search-index.js"></script><script src="/search-projects.js">', result)
        self.assertEqual(build_runtime.search_index_entry(result, {}), result)
        url = 'https://example.oss.invalid/releases/one/search-index.js'
        absolute = result.replace('src="/search-index.js"', 'src="'+url+'?v=1#same"')
        self.assertEqual(build_runtime.search_index_entry(absolute, {}, {'oss': {'objects': {'search-index.js': {'url': url}}}}), absolute)
        alias = result.replace('/search-index.js', '/_runtime/old/search-index.js')
        registered = {'runtime_urls': {'https://example.invalid/old': '_runtime/old/search-index.js'}}
        self.assertEqual(build_runtime.search_index_entry(alias, registered), result)
        unrelated = '<script src="/examples/search-index.js" data-example="keep"></script>'
        self.assertIn(unrelated, build_runtime.search_index_entry(unrelated + body, {}))
        with self.assertRaisesRegex(ValueError, '项目索引入口'):
            build_runtime.search_index_entry('<script>window.note="search-projects.js"</script>', {})

    def test_cold_frozen_search_only_changes_declared_search_entries(self):
        snapshot = build_runtime.read(ROOT/'site-astro/sources/frozen-site/manifest.json')
        body = (ROOT/'site-astro/sources/frozen-site/pages/search/index.html').read_bytes().decode('utf8')
        before = build_runtime.transport.localize(body, snapshot)
        after = build_runtime.search_index_entry(before, snapshot)
        addition = '<script src="/search-index.js"></script>'
        self.assertEqual(after.count(addition), 1)
        shared = 'data-src="/assets/index-audit-nav-dc91cac753f20e2e4100.js"'
        bootstrap = '<script data-search-wire>' + build_runtime.search_wire_loader() + '</script>'
        self.assertEqual(before.count(shared), 1)
        self.assertEqual(after.count(bootstrap), 1)
        self.assertLess(after.index(bootstrap), after.index(shared))
        self.assertEqual(after.replace(addition, '', 1).replace(bootstrap, '', 1), before)
        self.assertEqual(build_runtime.search_index_entry(after, snapshot), after)

    def test_body_and_search_change_leave_home_and_other_page_identical(self):
        with tempfile.TemporaryDirectory() as temp:
            manifests, outputs = [], []
            for number, body in enumerate(('before', 'after', 'after', 'final')):
                source = Path(temp) / str(number); source.mkdir()
                policy = {'origins': [], 'scripts': ['/shell.js', '/search-index.js', '/search-project-example.js'],
                          'stylesheets': [], 'data': ['/_album/routes-abcd.json']}
                runtime = 'const policy=' + json.dumps(policy) + ';window.retry=policy;'
                files = {'index.html': '<head></head><script src="/resource-retry-fixed.js"></script>',
                         'other/index.html': '<head></head><script src="/resource-retry-fixed.js"></script>',
                         'page/index.html': '<head></head><p>' + body + '</p>',
                         'search/index.html': '<head></head><script src="/assets/main.js"></script>',
                         'assets/main.js': 'import "./client.js";',
                         'assets/client.js': 'fetch("/search-index.js")', 'search-index.js': json.dumps(body),
                         'search-project-example.js': json.dumps(body), '_album/routes-abcd.json': '{}',
                         'shell.js': 'window.shell=true;', 'resource-retry-fixed.js': retry.prune_content_retry_policy(runtime)}
                for rel, text in files.items():
                    path = source / rel; path.parent.mkdir(parents=True, exist_ok=True); path.write_text(text, encoding='utf8')
                if number == 3:
                    # Real incremental dist starts with already finalized JS.
                    (source/'assets/client.js').write_bytes((outputs[-1]/'oss/assets/client.js').read_bytes())
                    (source/'assets/main.js').write_bytes((outputs[-1]/'oss/assets/main.js').read_bytes())
                manifest = {'schema': 'wly.hybrid-release.v1', 'release_id': str(number), 'files': oss.inventory(source)}
                if manifests: manifest['previous_oss'] = build_runtime.previous_resources({'oss': manifests[-1]['oss']}, manifests[0])[0]
                oss.write(source / 'release-manifest.json', manifest)
                output = Path(temp) / ('output-' + str(number))
                oss.prepare(source, 'https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com',
                            'releases/fixture', output, offline=True)
                outputs.append(output); manifests.append(oss.read(output / 'github/release-manifest.json'))
            changed = {rel for rel in manifests[0]['files'] if rel.endswith('.html')
                       and manifests[0]['files'][rel] != manifests[1]['files'][rel]}
            self.assertEqual(changed, {'page/index.html', 'search/index.html'})
            for rel in ('index.html', 'other/index.html'):
                self.assertEqual((outputs[0]/'github'/rel).read_bytes(), (outputs[1]/'github'/rel).read_bytes())
            self.assertEqual(manifests[1]['oss']['objects']['assets/client.js']['key'], manifests[2]['oss']['objects']['assets/client.js']['key'])
            self.assertEqual(manifests[1]['oss']['objects']['assets/main.js']['key'], manifests[2]['oss']['objects']['assets/main.js']['key'])
            for number in (2, 3):
                client = manifests[number]['oss']['objects']['assets/client.js']['url']
                index = manifests[number]['oss']['objects']['search-index.js']['url']
                self.assertIn(manifests[number]['oss']['objects']['assets/main.js']['url'], (outputs[number]/'github/search/index.html').read_text('utf8'))
                self.assertIn(client, (outputs[number]/'oss/assets/main.js').read_text('utf8'))
                self.assertIn(index, (outputs[number]/'oss/assets/client.js').read_text('utf8'))
                self.assertEqual((outputs[0]/'github/index.html').read_bytes(), (outputs[number]/'github/index.html').read_bytes())

    def test_published_reconciliation_noop_text_reference_image_and_drift(self):
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp); routes = ['/', '/reference/', '/photo/', '/other/']
            dependencies = ['sources/pages/a/page.json', 'sources/pages/a/page.json', 'sources/assets/photo.png', 'sources/pages/b/page.json']
            def inputs(changed=None):
                return {'routes': {route: build_runtime.input_record({dep: 'new' if dep == changed else 'old'})
                    for route, dep in zip(routes, dependencies)}, 'site_files': {'sitemap.xml': build_runtime.input_record({'@routes': 'same'})}}
            def put(route, body):
                path = dist/build.route_file(route); path.parent.mkdir(parents=True, exist_ok=True); path.write_text(body, encoding='utf8')
            for route in routes: put(route, 'old')
            (dist/'sitemap.xml').write_text('routes', encoding='utf8')
            accepted = {'files': oss.inventory(dist), 'input_fingerprints': inputs()}
            self.assertEqual(build_runtime.reconcile(dist, inputs(), accepted)['pages'], [])
            for dep, changed in [(dependencies[0], routes[:2]), (dependencies[2], [routes[2]])]:
                for route in routes: put(route, 'new' if route in changed else 'old')
                result = build_runtime.reconcile(dist, inputs(dep), accepted)
                self.assertEqual({r['path'] for r in result['pages']}, {build.route_file(r) for r in changed})
                self.assertTrue(all(r['inputs_changed'] == [dep] for r in result['pages']))
                self.assertEqual((result['drift'], result['site_files']), ([], []))
            result = build_runtime.reconcile(dist, inputs(), accepted)
            self.assertEqual(result['drift'], ['photo/index.html'])
            (dist/'sitemap.xml').write_text('unexpected', encoding='utf8')
            self.assertIn('sitemap.xml', build_runtime.reconcile(dist, inputs(), accepted)['drift'])

    def test_sealed_build_proofs_and_publisher_reject_changed_bytes_and_claims(self):
        publisher = load('proof_publisher', 'site-astro/tools/publish_site.py')
        with tempfile.TemporaryDirectory() as temp, patch.object(publisher.runtime, 'verify_inputs'):
            dist = Path(temp); (dist/'index.html').write_text('fixture', encoding='utf8')
            oss.write(dist/'release-manifest.json', {'schema': 'wly.hybrid-release.v1', 'release_id': 'fixture', 'files': oss.inventory(dist)})
            oss.finalize_dist(dist, source_commit='Unknown')
            value = {'source_identity': {'source_commit': 'Unknown'}, 'source_files_sha256': {}, 'site_files': {},
                     'routes': {'/': {**build_runtime.input_record({'page.json': 'old'}), 'output_sha256': oss.digest(dist/'index.html')}}}
            build_runtime.seal_inputs(dist, value); source = oss.read(dist/'release-manifest.json')
            receipt = {'status': 'built', 'source_commit': 'Unknown', 'input_fingerprints': value,
                       'files': [{'path': p.relative_to(dist).as_posix(), 'sha256': oss.digest(p)} for p in dist.rglob('*') if p.is_file()]}
            self.assertEqual(publisher.check_input_proofs(dist, source, source, receipt, 'Unknown')['pages'], [])
            with self.assertRaisesRegex(ValueError, 'Source commit'):
                publisher.check_input_proofs(dist, source, source, receipt, 'a'*40)
            (dist/'index.html').write_text('unexplained drift', encoding='utf8')
            with self.assertRaisesRegex(ValueError, 'inventory'):
                publisher.check_input_proofs(dist, source, source, receipt, 'Unknown')
            value['routes']['/']['output_sha256'] = oss.digest(dist/'index.html')
            build_runtime.seal_inputs(dist, value)
            receipt['files'] = [{'path': p.relative_to(dist).as_posix(), 'sha256': oss.digest(p)} for p in dist.rglob('*') if p.is_file()]
            with self.assertRaisesRegex(ValueError, 'Unchanged inputs'):
                publisher.check_input_proofs(dist, oss.read(dist/'release-manifest.json'), source, receipt, 'Unknown')

    def test_frozen_source_bytes_and_identity_are_checked_after_generation(self):
        with tempfile.TemporaryDirectory() as temp, patch.object(build_runtime, 'source_identity', return_value={'head': 'after-redraw'}):
            root = Path(temp); path = root/'input.json'; path.write_text('redrawn', encoding='utf8')
            value = {'source_identity': {'head': 'after-redraw'}, 'source_files_sha256': {'input.json': oss.digest(path)}}
            build_runtime.verify_inputs(value, root)
            path.write_text('later edit', encoding='utf8')
            with self.assertRaisesRegex(ValueError, 'input.json'): build_runtime.verify_inputs(value, root)
            path.write_text('redrawn', encoding='utf8'); value['source_identity'] = {'head': 'before-redraw'}
            with self.assertRaisesRegex(ValueError, '源码身份'): build_runtime.verify_inputs(value, root)

    def test_sealing_repeated_build_keeps_global_bytes_and_404_alias_proofs(self):
        with tempfile.TemporaryDirectory() as temp, patch.object(build, 'VERIFICATION_FILES', ()):
            dist = Path(temp); entries = {route: {'fingerprint': 'same', 'inputs': {'404/page.json': 'same'}} for route in ['/', '/404/', '/404.html']}
            for route in entries:
                path = dist/build.route_file(route); path.parent.mkdir(parents=True, exist_ok=True); path.write_text('404', encoding='utf8')
            (dist/'sitemap.xml').write_text('routes', encoding='utf8')
            oss.write(dist/'release-manifest.json', {'schema': 'wly.hybrid-release.v1', 'release_id': 'fixture', 'files': oss.inventory(dist),
                'site_inputs': {'sitemap.xml': {'@indexable-routes': 'same'}}})
            oss.finalize_dist(dist, source_commit='Unknown')
            first = build.input_fingerprints(dist, entries, {}, set(entries), {}, {'source_commit': 'Unknown'}, build_runtime)
            build_runtime.seal_inputs(dist, first); accepted = oss.read(dist/'release-manifest.json')
            accepted['_build_files'] = {rel: {'sha256': oss.digest(dist/rel)} for rel in ['release-manifest.json', 'release-identity.json']}
            second = build.input_fingerprints(dist, entries, {}, set(entries), {}, {'source_commit': 'Unknown'}, build_runtime)
            self.assertEqual(first, second); self.assertEqual(first['routes']['/404/'], first['routes']['/404.html'])
            build_runtime.seal_inputs(dist, second)
            result = build_runtime.reconcile(dist, second, accepted)
            self.assertEqual((result['pages'], result['site_files'], result['drift']), ([], [], []))

if __name__ == '__main__': unittest.main()

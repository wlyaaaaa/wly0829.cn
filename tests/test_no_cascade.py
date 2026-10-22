"""A body/index update must not change unrelated resource or HTML bytes."""
import importlib.util
import hashlib
import json
import os
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
    def test_preserved_home_changes_only_unique_visitor_body_and_guard_requires_exact_bytes(self):
        prefix = b'\xef\xbb\xbf<head>accepted</head>\r\n<body>unchanged<script data-site-visitors>'
        suffix = b'</script>\r\n<footer>accepted</footer></body>\r\n'
        approved = prefix + b'oldVisitor();' + suffix
        script = (ROOT/'scripts/visitor-beacon.js').read_bytes().strip()
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp); home = dist/'index.html'; home.write_bytes(approved)
            published = {'files': {'index.html': {'bytes': len(approved), 'sha256': hashlib.sha256(approved).hexdigest()}}}
            preserved = build_runtime.home_visitor_bytes(build_runtime.accepted_home(dist, published))
            self.assertEqual(preserved, prefix + script + suffix)
            self.assertEqual(home.read_bytes(), approved)
            for invalid in (b'<body>missing marker</body>', approved + b'<script data-site-visitors>second</script>'):
                with self.subTest(invalid=invalid), self.assertRaisesRegex(ValueError, '唯一且完整'):
                    build_runtime.home_visitor_bytes(invalid)
            home.write_bytes(preserved); entries = {'/': {'fingerprint': 'same'}}
            with patch.dict(os.environ, {'SITE_ALLOW_HOME_BYTES': '0'}), patch('builtins.print'):
                self.assertEqual(build.guard_unchanged_html(dist, entries, {'/': 'same'}, published, {}, preserved_home=preserved), [])
                home.write_bytes(preserved.replace(b'<footer>accepted', b'<footer>tampered'))
                with self.assertRaisesRegex(ValueError, '首页字节连带变化'):
                    build.guard_unchanged_html(dist, entries, {'/': 'same'}, published, {}, preserved_home=preserved)

    def test_accepted_home_recovers_only_a_proven_album_reference(self):
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp); album = dist/'_album/routes-abcd.json'
            album.parent.mkdir(); album.write_bytes(b'{}')
            approved = b'<link href="https://assets.invalid/releases/old/_album/routes-abcd.json">'
            published = {'files': {'index.html': {'bytes': len(approved), 'sha256': hashlib.sha256(approved).hexdigest()}},
                'oss': {'objects': {'_album/routes-abcd.json': {'url': 'https://assets.invalid/releases/old/_album/routes-abcd.json',
                    'sha256': hashlib.sha256(b'{}').hexdigest()}}}}
            with self.assertRaisesRegex(ValueError, '冷构建'):
                build_runtime.accepted_home(dist, published)
            home = dist/'index.html'; home.write_bytes(approved.replace(b'/old/', b'/new/'))
            self.assertEqual(build_runtime.accepted_home(dist, published), approved)
            self.assertIn(b'/new/', home.read_bytes())  # Reading never patches dist.
            album.write_bytes(b'broken')
            with self.assertRaisesRegex(ValueError, '依赖缺失或字节不符'):
                build_runtime.accepted_home(dist, published)
            home.write_bytes(approved + b'body changed')
            with self.assertRaisesRegex(ValueError, '无法仅修复相册索引'):
                build_runtime.accepted_home(dist, published)

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

    def test_guard_blocks_home_and_only_exact_override_allows_it(self):
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp); (dist/'index.html').write_text('<script src="/new.js"></script>', encoding='utf8')
            entries = {'/': {'fingerprint': 'same'}}; accepted = {'files': {'index.html': {'sha256': 'old'}}}
            with patch.dict(os.environ, {'SITE_ALLOW_HOME_BYTES': '0'}), patch('builtins.print'):
                with self.assertRaisesRegex(ValueError, 'SITE_ALLOW_HOME_BYTES=1'):
                    build.guard_unchanged_html(dist, entries, {'/': 'same'}, accepted, {'/': {'/old.js'}})
            with patch.dict(os.environ, {'SITE_ALLOW_HOME_BYTES': '1'}), patch('builtins.print'):
                self.assertEqual(build.guard_unchanged_html(dist, entries, {'/': 'same'}, accepted, {'/': {'/old.js'}}), ['/'])
                self.assertEqual(build.guard_unchanged_html(dist, entries, {'/': 'changed'}, accepted, {}), [])

if __name__ == '__main__': unittest.main()

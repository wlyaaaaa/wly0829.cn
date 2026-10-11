"""A body/index update must not change unrelated resource or HTML bytes."""
import importlib.util
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

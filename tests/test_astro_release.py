"""Native Astro publication keeps original bytes and rejects stale rule prose."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'scripts'))
import astro_rules
spec = importlib.util.spec_from_file_location('astro_renderer_tests', ROOT/'site-astro/tools/render_blocks.py')
renderer = importlib.util.module_from_spec(spec); spec.loader.exec_module(renderer)
spec = importlib.util.spec_from_file_location('astro_converter_tests', ROOT/'site-astro/tools/convert_page.py')
converter = importlib.util.module_from_spec(spec); spec.loader.exec_module(converter)
spec = importlib.util.spec_from_file_location('astro_preparation_tests', ROOT/'scripts/prepare-astro-release.py')
preparation = importlib.util.module_from_spec(spec); spec.loader.exec_module(preparation)

class AstroReleaseTests(unittest.TestCase):
    def setUp(self):
        self.workspace = tempfile.TemporaryDirectory(prefix='astro-release-', dir=os.environ['TEMP'])
        self.addCleanup(self.workspace.cleanup); self.root = Path(self.workspace.name)
        self.body = 'Keep originals.'; sha = hashlib.sha256(self.body.encode()).hexdigest()
        self.label = '原文 · E-fixture 版'
        self.html = ('<p class="rule-original-version">' + self.label + '</p>'
            '<article data-rule-source="agents_root_rules" data-rule-part="charter/charter-02" '
            'data-rule-public-sha256="' + sha + '"><p>' + self.body + '</p></article>')
        for relative in ('rules/index.html', 'rules/charter/index.html', '_typeset/rule-sources/rule.md'):
            path = self.root/relative; path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(self.body if relative.endswith('.md') else '<nav>Rules</nav>' if relative == 'rules/index.html' else self.html, encoding='utf8')
        self.pin = {'schema': 'wly.astro-rules-pin.v1', 'version': 'E-fixture', 'ruleset_sha256': 'a'*64,
                    'release_record_sha256': 'b'*64, 'documents': {'agents_root_rules': {
                        'src': '/_typeset/rule-sources/rule.md', 'public_source_sha256': sha,
                        'relative_path': 'rule.md', 'sha256': 'c'*64,
                        'prose_sha256': sha, 'primary': True, 'slug': 'charter',
                        'parts': [{'id': 'charter/charter-02', 'label': self.label, 'markdown_sha256': sha, 'prose_sha256': sha}]}}}
        self.current = {'release_id': self.pin['version'], 'ruleset_sha256': 'a'*64, 'release_record_sha256': 'b'*64}

    def test_same_size_changed_asset_publishes_current_bytes_at_a_new_address(self):
        assets = self.root/'sources/assets'; assets.mkdir(parents=True); source = assets/'image.svg'
        old = b'<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="red"/></svg>'
        new = old.replace(b'red', b'tan'); source.write_bytes(old)
        with patch.object(renderer, 'REPO', str(self.root)), patch.object(renderer, 'PUB', str(self.root/'public')):
            old_url = renderer.publish_path(str(source))
            self.assertIn(hashlib.sha256(old).hexdigest(), old_url)
            destination = self.root/'public'/old_url.lstrip('/')
            self.assertEqual(destination.read_bytes(), old)
            source.write_bytes(new)
            self.assertEqual(source.stat().st_size, destination.stat().st_size)
            self.assertNotEqual(hashlib.sha256(new).digest(), hashlib.sha256(old).digest())
            new_url = renderer.publish_path(str(source))
            self.assertNotEqual(new_url, old_url)
            self.assertEqual((self.root/'public'/new_url.lstrip('/')).read_bytes(), new)
            self.assertEqual(destination.read_bytes(), old)

    def test_current_rule_version_ruleset_or_record_drift_is_rejected(self):
        self.assertEqual(astro_rules.verify(self.root, self.pin, self.current)['status'], 'pass')
        for field in ('release_id', 'ruleset_sha256', 'release_record_sha256'):
            with self.subTest(field=field), self.assertRaisesRegex(ValueError, 'verified active release'):
                astro_rules.verify(self.root, self.pin, {**self.current, field: 'changed'})

    def test_tampered_native_rule_body_and_source_are_rejected(self):
        index = self.root/'rules/charter/index.html'; index.write_text(self.html.replace('originals', 'rewritten'), encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'Native rule prose changed'): astro_rules.verify(self.root, self.pin)
        index.write_text(self.html, encoding='utf8')
        (self.root/'_typeset/rule-sources/rule.md').write_text('Changed source.', encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'Rule source bytes changed'): astro_rules.verify(self.root, self.pin)

    def test_same_release_pin_cannot_relabel_changed_source(self):
        path = self.root/'active.md'; path.write_text('Real source.', encoding='utf8')
        entry = {'logical_id': 'agents_root_rules', 'relative_path': 'AGENTS.md', 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'bytes': path.stat().st_size}
        self.pin.update(files=[entry], catalog={}, release_commit='fixture')
        current = {**self.current, 'files': [entry], 'catalog': {}, 'git_commit': 'fixture', 'artifact_paths': {'agents_root_rules': str(path)}}
        with self.assertRaisesRegex(ValueError, 'verified active source'): astro_rules.verify(self.root, self.pin, current)

    def test_workbench_navigation_and_owning_original_do_not_duplicate(self):
        self.assertEqual(astro_rules.verify(self.root, self.pin)['primary_originals'], 1)
        (self.root/'rules/index.html').write_text(self.html, encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'duplicated an owning'): astro_rules.verify(self.root, self.pin)

    def test_repeated_parts_missing_sources_and_old_labels_are_rejected(self):
        detail = self.root/'rules/charter/index.html'
        detail.write_text(self.html * 2, encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'Duplicate rule source'): astro_rules.verify(self.root, self.pin)
        detail.write_text(self.html.replace('E-fixture', 'E-old'), encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'displayed version'): astro_rules.verify(self.root, self.pin)
        detail.write_text(self.html, encoding='utf8')
        (self.root/'_typeset/rule-sources/rule.md').unlink()
        with self.assertRaisesRegex(ValueError, 'Rule source object lost'): astro_rules.verify(self.root, self.pin)

    def test_segmented_original_keeps_full_prose_and_order(self):
        row = self.pin['documents']['agents_root_rules']; body = 'Keep originals.\n\nPreserve bytes.'
        row['public_source_sha256'] = hashlib.sha256(body.encode()).hexdigest()
        row['prose_sha256'] = astro_rules.prose_digest(body)
        row['parts'] = []; articles = []
        for index, part in enumerate(body.split('\n\n')):
            identity = 'charter/part-' + str(index)
            row['parts'].append({'id': identity, 'prose_sha256': hashlib.sha256(part.encode()).hexdigest()})
            articles.append('<p class="rule-original-version">' + self.label + '</p>'
                '<article data-rule-source="agents_root_rules" data-rule-part="' + identity + '" '
                'data-rule-public-sha256="' + row['public_source_sha256'] + '"><p>' + part + '</p></article>')
        (self.root/'_typeset/rule-sources/rule.md').write_text(body, encoding='utf8', newline='\n')
        detail = self.root/'rules/charter/index.html'; detail.write_text(''.join(articles), encoding='utf8')
        self.assertEqual(astro_rules.verify(self.root, self.pin)['parts'], 2)
        row['parts'].reverse()
        with self.assertRaisesRegex(ValueError, 'lost or reordered'): astro_rules.verify(self.root, self.pin)

    def test_original_copy_failure_is_rejected(self):
        source = self.root/'sources/assets/original.bin'; source.parent.mkdir(parents=True)
        source.write_bytes(b'old')
        with patch.object(renderer, 'REPO', str(self.root)), patch.object(renderer, 'PUB', str(self.root/'public')):
            renderer.publish_path(str(source)); source.write_bytes(b'new')
            with patch.object(renderer.shutil, 'copyfile'), self.assertRaisesRegex(ValueError, '复制后的 SHA256'):
                renderer.publish_path(str(source))

    def test_converter_binds_current_public_bytes_and_part_body(self):
        root = self.root/'sources/rules'; root.mkdir(parents=True)
        source = root/'rule.md'; source.write_text(self.body, encoding='utf8')
        (root/'release.json').write_text(json.dumps(self.pin), encoding='utf8')
        screen = {'id': 'charter-02', 'source_excerpt_id': 'charter/charter-02',
            'source': {'file': 'rule.md', 'release': 'E-fixture', 'sha256': 'c'*64},
            'text': self.label + '\n\n' + self.body}
        with patch.object(converter, 'REPO', str(self.root)), patch.object(converter, 'RULES_RELEASE', None):
            converter.rule_gate(screen, 'charter')
            self.assertEqual(screen['source_logical_id'], 'agents_root_rules')
            self.assertEqual(screen['source_rule_part'], 'charter/charter-02')
            changed = {**screen, 'text': self.label + '\n\nChanged body.'}
            with self.assertRaisesRegex(ValueError, '当前正文'): converter.rule_gate(changed, 'charter')
            source.write_text('Changed bytes.', encoding='utf8')
            with self.assertRaisesRegex(ValueError, '公共源字节'): converter.rule_gate(screen, 'charter')

    def test_converter_copy_detects_same_size_change_and_failed_copy(self):
        source, target = self.root/'template.md', self.root/'published/template.md'
        source.write_bytes(b'old'); converter.copy_public_source(source, target, hashlib.sha256(b'old').hexdigest())
        source.write_bytes(b'new'); converter.copy_public_source(source, target, hashlib.sha256(b'new').hexdigest())
        self.assertEqual(target.read_bytes(), b'new')
        source.write_bytes(b'bad')
        with patch.object(converter.shutil, 'copyfile'), self.assertRaisesRegex(ValueError, '复制后的 SHA256'):
            converter.copy_public_source(source, target, hashlib.sha256(b'bad').hexdigest())

    def test_renderer_uses_current_markdown_keeps_points_and_records_source_hash(self):
        md = self.root/'md'; md.mkdir(); out = self.root/'rendered'
        current = '约法 · L18–L23 · E251\n\nowner: `E:\\.agents`\n\n**L18 Current text.**'
        screen = {'id': 'charter-04', 'shape': 'source_text', 'section': 'original', 'anchors': ['L18'],
            'source_logical_id': 'agents_root_rules', 'source_rule_part': 'charter/charter-04', 'source_public_sha256': 'a'*64}
        fm = {'url': '/rules/charter/', 'title': '约法', 'page': {}}
        path = md/'charter.md'
        path.write_text('---\n' + json.dumps(fm) + '\n---\n\n::screen{#charter-04}\n\n```typeset\n'
            + json.dumps({'screen': screen}) + '\n```\n\n' + current + '\n', encoding='utf8')
        result = {'screen': 'charter-04', 'o': 'h', 'shape': 'source_text', 'html': '<p>Old canvas text</p>', 'style': '', 'height': 100}
        with patch.object(renderer, 'SITE', str(self.root)), patch.object(renderer, 'MD_DIR', str(md)), patch.object(renderer, 'OUT_DIR', str(out)), patch.object(renderer, '_ALIASES', {}), patch.object(renderer, 'font_subset', return_value='/font.woff2'), patch.object(renderer, 'publish_path', return_value='/fixture-resource'):
            rendered = renderer.finish_page('charter', fm, [result], 'fixture')
        article = rendered['screens'][0]
        self.assertIn('Current text', article['article']); self.assertIn('E:\\.agents', article['article'])
        self.assertNotIn('Old canvas text', article['article']); self.assertNotIn('E251', article['article'])
        self.assertEqual(article['article_label'], '约法 · L18–L23 · E251')
        self.assertEqual(article['points'], ['L18']); self.assertNotIn('id="L18"', article['article'])
        self.assertEqual(rendered['source_md_sha256'], renderer.sha(path))
        self.assertEqual(rendered['render_version'], renderer.RENDER_VERSION)

    def test_missing_render_job_exits_nonzero_without_overwriting_old_result(self):
        md, work, public = self.root/'md', self.root/'work', self.root/'public'
        md.mkdir(); work.mkdir(); (md/'fixture.md').write_text('fixture', encoding='utf8')
        old = self.root/'old-render.json'; old.write_text('previous result', encoding='utf8')
        job = {'page': 'fixture', 'screen': 'fixture-01', 'o': 'h', 'key': 'new-job'}
        original_cwd = os.getcwd(); self.addCleanup(os.chdir, original_cwd)
        with patch.object(renderer, 'REPO', str(self.root)), patch.object(renderer, 'MD_DIR', str(md)), patch.object(renderer, 'WORK', str(work)), patch.object(renderer, 'PUB', str(public)), patch.object(renderer, 'publish_path'), patch.object(renderer.shutil, 'copyfile'), patch.object(renderer, 'load_registry', return_value=({}, None, [], [])), patch.object(renderer, 'build_css', return_value='css'), patch.object(renderer, 'library_fingerprint', return_value='lib'), patch.object(renderer, 'prepare_page', return_value=({}, {'screens': []}, [job])), patch.object(renderer.cf, 'ProcessPoolExecutor') as executor, patch.object(renderer, 'finish_page') as finish, patch.object(renderer, 'fix_dead_fragments'):
            executor.return_value.__enter__.return_value.map.return_value = [[]]
            with self.assertRaisesRegex(SystemExit, 'missing_jobs'): renderer.run(['fixture'], workers=1)
            finish.assert_not_called()
        self.assertEqual(old.read_text('utf8'), 'previous result')

    def test_sitemap_excludes_actual_noindex_and_rejects_reintroduced_page(self):
        routes = ['/', '/skills/retired/', '/github-profile/', '/normal/']
        for route, meta in zip(routes, ['', '<meta name="robots" content="noindex">',
                "<meta content='follow, NOINDEX' name='ROBOTS'>", '<meta name="robots" content="index, follow">']):
            path = self.root/preparation.hybrid.route_file(route); path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('<html><head>'+meta+'</head><body>Page</body></html>', encoding='utf8')
        self.assertEqual(preparation.write_sitemap(self.root, routes), ['/', '/normal/'])
        sitemap = self.root/'sitemap.xml'
        sitemap.write_text(sitemap.read_text('utf8').replace('</urlset>',
            '<url><loc>https://wly0829.cn/skills/retired/</loc></url></urlset>'), encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'Sitemap contains noindex pages'):
            preparation.verify_sitemap(self.root)


if __name__ == '__main__': unittest.main()

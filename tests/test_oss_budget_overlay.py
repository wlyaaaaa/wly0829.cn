"""Deployment budget and exact overlay fixtures; no network or publication."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import shutil
import unittest
from unittest.mock import patch
import uuid

ROOT = Path(__file__).resolve().parents[1]


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


h = load('budget_hybrid', ROOT/'scripts/hybrid-release.py')
oss = load('budget_oss', ROOT/'scripts/prepare-oss-release.py')


class OssBudgetOverlayTests(unittest.TestCase):
    def setUp(self):
        # Fixtures stay in the task TEMP for recycle-bin cleanup after the run.
        self.root = Path(os.environ.get('TEMP', ROOT/'.test-tmp'))/('budget-test-'+uuid.uuid4().hex)
        self.root.mkdir(parents=True)
        self.source = self.make_source('source')
        self.budget = patch.object(h.builder, 'BUDGET', 50_000)
        self.budget.start()
        self.addCleanup(self.budget.stop)

    def put(self, root, relative, body):
        path = root/relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
        return path

    def refresh(self, source):
        files = h.inventory(source)
        manifest = {'schema': 'wly.hybrid-release.v1',
            'release_id': hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest(),
            'files': files, 'baseline_files': {}, 'routes': ['/', '/404.html'],
            'accepted_pages': {'/': {}, '/404.html': {}}}
        h.write(source/h.MANIFEST, manifest)
        return manifest

    def make_source(self, name, payload=b'x'*200_000, extra=None):
        source = self.root/name
        source.mkdir()
        for rel, body in {'index.html': b'<h1>Ordinary fixture</h1><script src="/assets/app.js"></script>',
                '404.html': b'<h1>Missing page</h1>', 'CNAME': b'wly0829.cn\n',
                'assets/app.js': b'window.fixture = true;', 'assets/payload.bin': payload,
                **(extra or {})}.items():
            self.put(source, rel, body)
        self.refresh(source)
        return source

    def preparation(self, source=None, sealed=True):
        source = source or self.source
        preparation = self.root/('split-'+uuid.uuid4().hex)
        plan = oss.prepare(source, 'https://fixture-bucket.oss-cn-shanghai.aliyuncs.com',
                           'releases/budget-fixture', preparation, full_upload=True)
        if sealed:
            # Local protocol records isolate seal binding; no real GET is claimed.
            rows = {rel: {'status': 'pass', 'http': 200, 'bytes': obj['bytes'],
                         'sha256': obj['sha256'], 'content_type': obj['content_type'],
                         'headers': {'access-control-allow-origin': 'https://wly0829.cn',
                                     'content-encoding': 'identity'}}
                    for rel, obj in plan['objects'].items()}
            oss.write(preparation/'remote-verification.json', {
                'schema': 'wly.oss-remote-verification.v1', 'release_id': plan['release_id'],
                'plan_sha256': oss.digest(preparation/oss.PLAN), 'complete': True,
                'html_ready': True, 'failed': [], 'objects': rows,
                'method': 'anonymous full GET body SHA256 plus MP4 byte range',
                'verified_at_beijing': '2026-10-04T11:30:00+08:00'})
            with patch.object(oss, 'importlib') as loader, patch.object(h.builder, 'load_public_repos'), \
                    patch.object(h, 'validate_content', return_value={'status':'pass'}):
                loader.util.module_from_spec.return_value = h
                oss.seal_remote(preparation)
        return preparation

    def materialized_check(self, preparation, report):
        isolated = self.root/'isolated-repo'
        (isolated/'scripts').mkdir(parents=True)
        shutil.copyfile(ROOT/'scripts/prepare-oss-release.py', isolated/'scripts/prepare-oss-release.py')

        with patch.object(h, 'ROOT', isolated):
            return h.validate_content(preparation/'github', report, local_assets=preparation/'oss')

    def test_large_source_uses_small_verified_github_budget(self):
        preparation = self.preparation()
        report = h.validate_content(self.source, self.root/'source-report.json', preparation)
        self.assertEqual(report['status'], 'pass')
        self.assertGreater(report['full_artifact_bytes'], h.builder.BUDGET)
        self.assertLess(report['github_deployment_tar_estimated_bytes'], h.builder.BUDGET)
        self.assertIn('assets/payload.bin', report['output_files'])

    def test_no_budget_parameter_preserves_old_limit(self):
        report_path = self.root/'legacy-report.json'
        with self.assertRaisesRegex(ValueError, 'content gate failed'):
            h.validate_content(self.source, report_path)
        report = h.read(report_path)
        self.assertIn('15_percent_headroom', {x['type'] for x in report['findings']})
        self.assertNotIn('github_deployment_bytes', report)
        self.assertEqual(report['headroom_bytes'], report['limit_bytes']-report['tar_estimated_bytes'])

    def test_rebuilt_manifest_timestamp_does_not_change_source_binding(self):
        preparation = self.preparation()
        rebuilt = self.root/'rebuilt'
        shutil.copytree(self.source, rebuilt)
        manifest = h.read(rebuilt/h.MANIFEST)
        manifest['prepared_at_beijing'] = '2026-10-04T11:40:00+08:00'
        h.write(rebuilt/h.MANIFEST, manifest)
        self.assertNotEqual(h.digest(rebuilt/h.MANIFEST), h.digest(self.source/h.MANIFEST))
        report = h.validate_content(rebuilt, self.root/'rebuilt-report.json', preparation)
        self.assertEqual(report['status'], 'pass')

    def test_other_source_split_is_rejected(self):
        other = self.make_source('other', payload=b'y'*200_000)
        with self.assertRaisesRegex(ValueError, 'another source or inventory'):
            h.validate_content(self.source, self.root/'wrong-source.json', self.preparation(other))

    def test_changed_source_inventory_is_rejected(self):
        preparation = self.preparation()
        (self.source/'assets/payload.bin').write_bytes(b'changed')
        self.refresh(self.source)
        with self.assertRaisesRegex(ValueError, 'Source changed'):
            h.validate_content(self.source, self.root/'changed-source.json', preparation)

    def test_changed_actual_split_bytes_are_rejected(self):
        preparation = self.preparation()
        with (preparation/'github/index.html').open('ab') as stream:
            stream.write(b'<!--changed-->')
        with self.assertRaisesRegex(ValueError, 'GitHub inventory/bytes changed'):
            h.validate_content(self.source, self.root/'changed-split.json', preparation)

    def test_unsealed_split_is_rejected(self):
        preparation=self.preparation(sealed=False)
        with self.assertRaisesRegex(ValueError, 'full GET evidence'):
            h.validate_content(preparation/'github', self.root/'unsealed.json')

    def test_small_budget_does_not_waive_other_source_findings(self):
        self.put(self.source, 'raw.log', b'ordinary local test log')
        self.refresh(self.source)
        preparation = self.preparation()
        report_path = self.root/'source-finding.json'
        with self.assertRaisesRegex(ValueError, 'content gate failed'):
            h.validate_content(self.source, report_path, preparation)
        report = h.read(report_path)
        self.assertIn('private_build_metadata', {x['type'] for x in report['findings']})
        self.assertNotIn('15_percent_headroom', {x['type'] for x in report['findings']})

    def test_oss_materialization_budgets_original_html_host(self):
        preparation = self.preparation()
        report = self.materialized_check(preparation, self.root/'materialized.json')
        self.assertEqual(report['status'], 'pass')
        self.assertEqual(Path(report['budget_root']), preparation/'github')
        self.assertGreater(report['full_artifact_bytes'], h.builder.BUDGET)
        self.assertLess(report['github_deployment_tar_estimated_bytes'], h.builder.BUDGET)
        self.assertIn('assets/payload.bin', report['output_files'])
        manifest = preparation/'github'/h.MANIFEST
        before = manifest.read_bytes()
        arguments = ['hybrid-release.py','verify','--output',str(preparation/'github'),'--local-assets',str(preparation/'oss'),'--check-sealed-content','--content-report',str(self.root/'cli-content.json')]
        with patch('sys.argv', arguments), patch.object(h.builder, 'load_public_repos'):
            h.main()
            self.assertEqual(manifest.read_bytes(), before)
            self.put(preparation/'oss', 'assets/app.js', b'bad object bytes')
            with self.assertRaisesRegex(ValueError, 'Local content body differs'):
                h.main()

    def test_materialization_still_scans_oss_content_findings(self):
        self.put(self.source, 'raw.log', b'ordinary local test log')
        self.refresh(self.source)
        preparation = self.preparation()
        report_path = self.root/'materialized-finding.json'
        with self.assertRaisesRegex(ValueError, 'content gate failed'):
            self.materialized_check(preparation, report_path)
        report = h.read(report_path)
        self.assertIn('private_build_metadata', {x['type'] for x in report['findings']})
        self.assertNotIn('15_percent_headroom', {x['type'] for x in report['findings']})

    def overlay(self):
        original = self.source/'index.html'
        after = self.put(self.root/'overlay-assets', 'index.html', b'<h1>Prepared homepage</h1>')
        entry = {'kind': 'integrated_preparation', 'source_path': str(after),
                 'before': {'sha256': h.digest(original), 'bytes': original.stat().st_size},
                 'after': {'sha256': h.digest(after), 'bytes': after.stat().st_size}}
        path = self.root/'overlay.json'
        h.write(path, {'schema': 'wly.typeset-release-overlay.v1', 'files': {'index.html': entry}})
        return path, entry

    def test_integrated_preparation_uses_exact_source_and_baseline(self):
        path, entry = self.overlay()
        self.assertEqual(h.load_overlay(path, self.source)['files']['index.html'], entry)
        for field in ('before', 'after'):
            with self.subTest(field=field):
                bad = json.loads(path.read_text('utf8'))
                bad['files']['index.html'][field]['sha256'] = '0'*64
                h.write(path, bad)
                with self.assertRaisesRegex(ValueError, 'Overlay (source changed|baseline differs)'):
                    h.load_overlay(path, self.source)
                path, entry = self.overlay()
        Path(entry['source_path']).write_bytes(b'changed source body')
        with self.assertRaisesRegex(ValueError, 'Overlay source changed'):
            h.load_overlay(path, self.source)

    def test_integrated_overlay_cannot_cover_accepted_page(self):
        path, _ = self.overlay()
        overlay = h.load_overlay(path, self.source)
        with self.assertRaisesRegex(ValueError, 'overlaps a rebuilt page'):
            h.assemble(self.source, self.source, self.root/'overlap-output',
                       h.read(self.source/h.MANIFEST), {'/': {}}, overlay=overlay)


if __name__ == '__main__':
    unittest.main()

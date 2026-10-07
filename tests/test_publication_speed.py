"""Hash reuse keeps real changed-content failures; transport is fixture-only."""
import importlib.util
import json
import os
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module


h = load('speed_hybrid', ROOT/'scripts/hybrid-release.py')
p = load('speed_readback', ROOT/'scripts/prepare-typeset-release.py')
fixture = load('speed_oss_fixture', ROOT/'tests/test_oss_release.py')


class PublicationSpeedTests(unittest.TestCase):
    def setUp(self):
        fixture.OssReleaseTests.setUp(self)
        self.put('index.html', '<script src="/assets/main.js"></script><a href="/projects/demo/#anchor">demo</a>')
        self.put('projects/demo/index.html', '<h1 id="anchor">Original page</h1>')
        self.put('404.html', '<h1>Missing page</h1>'); self.put('assets/main.js', 'void 1;')
        self.refresh(); self.counter = 0
        self.previous = self.root/'previous-content.json'; h.validate_content(self.source, self.previous)

    def put(self, relative, body):
        target = self.source/relative; target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(body, encoding='utf8')

    def refresh(self):
        files = h.inventory(self.source)
        self.manifest = {'schema':'wly.hybrid-release.v1', 'release_id':h.fingerprint(files), 'files':files,
            'routes':[h.file_route(rel) for rel in files if rel.endswith('.html')],
            'accepted_pages':{'/':{}, '/projects/demo/':{}, '/404.html':{}}, 'baseline_files':{}, 'release_overlay':{}}
        h.write(self.source/h.MANIFEST, self.manifest)

    def check(self, previous=None):
        self.counter += 1
        with patch.object(h.builder, 'validate', wraps=h.builder.validate) as scan:
            result = h.validate_content(self.source, self.root/('content-'+str(self.counter)+'.json'), previous_report=previous)
        return result, scan.call_args.kwargs.get('verified_files') or {}

    def test_matching_content_reuses_files_but_keeps_complete_inventory(self):
        result, retained = self.check(self.previous)
        self.assertIn('index.html', retained); self.assertEqual(result['output_files'], h.inventory(self.source) | {
            h.MANIFEST:{'sha256':h.digest(self.source/h.MANIFEST), 'bytes':(self.source/h.MANIFEST).stat().st_size}})

    def test_new_credential_is_blocked_after_a_pass(self):
        self.put('assets/main.js', 'const value="'+('sk-'+'X'*24)+'";'); self.refresh()
        with self.assertRaisesRegex(ValueError, 'content gate failed'): self.check(self.previous)

    def test_manifest_changes_scan_and_invalid_previous_checksum_runs_full(self):
        self.manifest['rollback_ref'] = 'metadata'; h.write(self.source/h.MANIFEST, self.manifest)
        result, retained = self.check(self.previous)
        self.assertNotIn(h.MANIFEST, retained)
        data = h.read(self.previous); data['output_files_sha256'] = '0'*64; h.write(self.previous, data)
        self.assertFalse(self.check(self.previous)[1])

    def test_checker_change_and_full_switch_scan_every_file(self):
        with patch.object(h, 'checker_version', return_value='0'*64):
            self.assertFalse(self.check(self.previous)[1])
        with patch.dict(os.environ, {'WLY_RELEASE_FULL':'1'}):
            self.assertFalse(self.check(self.previous)[1])

    def test_missing_target_and_removed_anchor_still_block(self):
        target = self.source/'projects/demo/index.html'
        self.put('projects/demo/index.html', '<h1>Anchor removed</h1>'); self.refresh()
        with self.assertRaisesRegex(ValueError, 'content gate failed'): self.check(self.previous)
        target.rename(self.root/'removed-target.html'); self.refresh()
        with self.assertRaisesRegex(ValueError, 'content gate failed'): self.check(self.previous)

    def online(self, previous=None, retry=None, bad_identity=False):
        self.counter += 1; output = self.root/('online-'+str(self.counter)+'.json')
        args = SimpleNamespace(release=self.source, output=output, previous_report=previous, retry_report=retry)
        def fetch(relative, *unused):
            if relative == 'release-identity.json':
                return json.dumps({'release_id':'wrong' if bad_identity else self.manifest['release_id'], 'manifest_sha256':p.digest(self.source/h.MANIFEST)}).encode()
            target = self.source/relative
            return (target/'index.html' if target.is_dir() else target).read_bytes()
        with patch.object(p, 'fetch_bytes', side_effect=fetch) as transport:
            result = p.readback(args)
        return result, [call.args[0] for call in transport.call_args_list], output

    def test_readback_reuses_only_valid_fingerprints_and_full_bypasses_reuse(self):
        first, unused, old = self.online(); current, calls, unused = self.online(old)
        self.assertEqual(current['checks'], first['checks']); self.assertEqual(calls, ['release-identity.json'])
        self.put('assets/main.js', 'void 2;'); self.refresh()
        current, calls, unused = self.online(old)
        self.assertEqual(current['retried_files'], 1); self.assertIn('assets/main.js', calls)
        with patch.dict(os.environ, {'WLY_RELEASE_FULL':'1'}):
            current, calls, unused = self.online(old)
            self.assertEqual(current['retried_files'], current['checked_files'])
        data = h.read(old); data['files_sha256'] = '0'*64; h.write(old, data)
        current, calls, unused = self.online(old)
        self.assertEqual(current['retried_files'], current['checked_files'])
        self.assertTrue(current['previous_report_fallback_reason'])

    def test_automatic_readback_baseline_requires_current_passing_identity(self):
        import subprocess
        source = (ROOT/'scripts/publish-typeset.ps1').read_text('utf-8-sig')
        helper = source[source.index('function ResolveReadbackBaseline'):source.index('function ConfirmReadback')]
        script = self.root/'readback-baseline.ps1'
        script.write_text('param([string]$CachePath,[string]$Identity)\n$ErrorActionPreference="Stop"; $online=$Identity|ConvertFrom-Json\nfunction ReadJson([string]$Path){Get-Content -Raw -LiteralPath $Path|ConvertFrom-Json}\nfunction Invoke-RestMethod{return $online}\n'+helper+'\nResolveReadbackBaseline $CachePath|ConvertTo-Json -Compress\n', encoding='utf8')
        first, unused, cache = self.online()
        identity = json.dumps({'release_id':first['release_id'], 'manifest_sha256':first['manifest_sha256']})
        for cache_path, fingerprint, mode in ((cache, first['manifest_sha256'], 'candidate_previous'), (cache, '0'*64, 'full'), (self.root/'absent.json', None, 'full')):
            first['manifest_sha256'] = fingerprint
            h.write(cache, first)
            result = json.loads(subprocess.check_output(['pwsh', '-NoProfile', '-File', str(script), str(cache_path), identity], text=True))
            self.assertEqual(result['mode'], mode)
            if mode == 'full': self.assertTrue(result['reason'])

    def test_same_release_id_changed_manifest_rejects_old_retry(self):
        first, unused, old = self.online()
        self.manifest['rollback_ref'] = 'new-metadata'; h.write(self.source/h.MANIFEST, self.manifest)
        with self.assertRaisesRegex(ValueError, 'different release'): self.online(retry=old)

    def test_small_identity_mismatch_reads_and_checks_full_manifest(self):
        first, calls, unused = self.online(bad_identity=True)
        self.assertEqual(first['status'], 'pass'); self.assertIn('release-manifest.json', calls)

    def test_full_remote_retry_also_rechecks_retained_objects(self):
        output, plan = fixture.OssReleaseTests.prepare(self)
        plan['retained_objects'] = {rel:{'status':'pass'} for rel in plan['objects']}
        fixture.oss.write(output/fixture.oss.PLAN, plan)
        with patch.dict(os.environ, {'WLY_RELEASE_FULL':'1'}), patch.object(fixture.oss, 'verify_object_with_retries', return_value={'status':'pass'}) as get:
            self.assertTrue(fixture.oss.verify_remote(output, retry_failed=True)['complete'])
        self.assertEqual(get.call_count, len(plan['objects']))

    def test_candidate_gate_rejects_navigation_only_and_wrong_generation(self):
        routes = ['/', '/cockpit/', '/rules/charter/', '/projects/agents/', '/rescue/', '/rules/', '/projects/demo/']
        for index, url in enumerate(routes):
            data = {'page':'page-'+str(index), 'typeset':url != '/', 'screens':[{'id':'screen-one'}]}
            self.put(h.route_file(url), '<script id="page-data" type="application/json">'+json.dumps(data)+'</script>')
        self.put('untouched/index.html', '<script id="page-data" type="application/json">'+json.dumps(data)+'</script>')
        self.refresh()
        baseline = dict(self.manifest['files'])
        self.put('assets/main.js', 'void 2;')
        self.refresh()
        self.manifest['baseline_files'] = baseline
        h.write(self.source/h.MANIFEST, self.manifest)
        build_path = self.root/'build.json'
        p.write(build_path, {'pages':{'page-6':{'url':'/projects/demo/'}}})
        plan = p.acceptance_plan(p.read(build_path), self.manifest, self.source)
        self.assertIn('/untouched/', plan['ui_pages'])
        self.assertEqual(plan['pages']['page-6']['url'], '/projects/demo/')
        ui_path = self.root/'ui.json'; plan_path = self.root/'plan.json'; reading_path = self.root/'reading.json'
        p.write(ui_path, {'schema':'website.ui-gate.v1', 'status':'pass', 'blocker_count':0, 'candidate_root':str(self.source),
            'candidate_manifest_sha256':plan['manifest_sha256'],
            'records':[{'route':url, 'width':width} for url in plan['ui_pages'] for width in (390, 1440)]})
        plan.update(source_build_report_sha256=p.digest(build_path), ui_verification={'path':str(ui_path), 'sha256':p.digest(ui_path)})
        p.write(plan_path, plan)
        cases = [{'page':page, 'requested_screen':'screen-one', 'requested_fraction':fraction, 'from':[start, 900],
                  'to':[end, 900], 'pass':True} for page in plan['pages'] for fraction in (.15, .5, .85)
                 for start, end in ((390, 844), (844, 390), (740, 1024), (1024, 740))]
        cases += [{'page':page, 'kind':'rapid-resizes', 'pass':True} for page in plan['pages']]
        reading = {'schema':'wly.typeset-reading-check.v1', 'status':'pass', 'evidence_mode':'artifact', 'artifact_unchanged':True,
            'root':str(self.source), 'release_id':plan['release_id'], 'manifest_sha256':plan['manifest_sha256'],
            'build_report_sha256':p.digest(plan_path), 'cases':cases, 'response_failures':[],
            'summary':dict(navigation_checks=1, failed_resizes=0, screen_mismatches=0, failed_navigation=0, page_errors=0),
            'pages':{page:{'url':entry['url'], 'html_sha256':self.manifest['files'][h.route_file(entry['url'])]['sha256'],
                           'screen_ids':['screen-one']} for page, entry in plan['pages'].items()}}
        p.write(reading_path, reading); p.browser_acceptance(plan_path, reading_path, build_path, self.source, self.manifest)
        reading['cases'] = [case for case in cases if case.get('kind') == 'rapid-resizes']
        p.write(reading_path, reading)
        with self.assertRaisesRegex(ValueError, 'Full reading matrix'):
            p.browser_acceptance(plan_path, reading_path, build_path, self.source, self.manifest)
        reading['cases'] = cases; reading['release_id'] = 'wrong-generation'; p.write(reading_path, reading)
        with self.assertRaisesRegex(ValueError, 'complete unchanged candidate'):
            p.browser_acceptance(plan_path, reading_path, build_path, self.source, self.manifest)
        self.put('index.html', (self.source/'index.html').read_text('utf8')+'<p>Candidate B homepage</p>'); self.refresh()
        plan.update(p.acceptance_plan(p.read(build_path), self.manifest, self.source)); p.write(plan_path, plan)
        reading.update(release_id=plan['release_id'], manifest_sha256=plan['manifest_sha256'], build_report_sha256=p.digest(plan_path)); p.write(reading_path, reading)
        with self.assertRaisesRegex(ValueError, 'current candidate manifest binding'):
            p.browser_acceptance(plan_path, reading_path, build_path, self.source, self.manifest)

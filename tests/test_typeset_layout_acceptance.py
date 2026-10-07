"""Exact layout deferral, raw-evidence preservation and publication-gate regressions.

Fixtures contain JSON/text only; no browser, image or network is involved.
"""
import copy
import importlib.util
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]


def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / filename)
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


p = load('layout_source_test', 'prepare-typeset-release.py')
o = load('layout_oss_test', 'verify-typeset-oss.py')


class LayoutAcceptanceTests(unittest.TestCase):
    def test_cross_root_rebuild_keeps_external_inputs_and_staged_body_exact(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp); config = root / 'recipe.json'
            p.write(config, {'scope': 'full-pages-creative-2f-static-home'})
            def proof(path):
                return {'path': str(path), 'sha256': p.digest(path), 'bytes': path.stat().st_size}
            def fixture(name):
                base = root / name; raw = base / 'dist-raw'; raw.mkdir(parents=True)
                files = {'app.js': {'sha256': 'a' * 64, 'bytes': 1}}
                rid = p.hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest()
                raw_manifest = {'release_id': rid, 'files': files}
                p.write(raw / p.hybrid.MANIFEST, raw_manifest)
                staged = base / 'dist-staged-build-report.json'
                p.write(staged, {'stage': 'native-before-creative', **raw_manifest})
                names = ['static-home', 'river', 'comic', 'album', 'demo', 'retry']
                roots = [base / (n + '-site') for n in names]
                creative = {'config': proof(config), 'raw_release_id': rid, 'steps': [],
                            'staged_build_report': proof(staged)}
                for i, stage in enumerate(roots):
                    manifest = {'release_id': rid, 'files': files,
                        'prepared_at_beijing': '2026-10-05T20:00:00+08:00',
                        'home_static_preparation': {'baseline': str(raw), 'output': str(roots[0]),
                            'baseline_manifest': proof(raw / p.hybrid.MANIFEST),
                            'observed_at_beijing': '2026-10-05T20:00:00+08:00'}}
                    p.write(stage / p.hybrid.MANIFEST, manifest)
                    creative['steps'].append({'name': names[i], 'before_release_id': rid,
                        'after_release_id': rid, 'manifest': proof(stage / p.hybrid.MANIFEST)})
                build = {'release_id': rid, 'files': files, 'inputs': {str(config): {k: proof(config)[k] for k in ('sha256', 'bytes')},
                    str(staged): {k: proof(staged)[k] for k in ('sha256', 'bytes')}}, 'creative_preparation': creative}
                final = {**manifest, 'creative_preparation': creative}
                p.write(base / 'dist' / p.hybrid.MANIFEST, final)
                return build, final
            old, _ = fixture('reviewed'); new, final = fixture('rebuilt')
            with patch.object(p.hybrid, 'verify_release', lambda path: p.read(path / p.hybrid.MANIFEST)), patch.object(p.hybrid, 'inventory', lambda path: p.read(path / p.hybrid.MANIFEST)['files']):
                self.assertEqual(*p.rebuilt_generation(old, new, final))
                changed = copy.deepcopy(new); changed['inputs'][str(config)]['sha256'] = 'b' * 64
                with self.assertRaises(ValueError):
                    p.rebuilt_generation(old, changed, final)
                changed = copy.deepcopy(new); changed['creative_preparation']['steps'].reverse()
                with self.assertRaises(ValueError):
                    p.rebuilt_generation(old, changed, final)

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.instruction = self.root / 'instruction.md'
        self.instruction.write_text('Synthetic layout decision, never publication authority.\n', encoding='utf8')
        self.instruction_hash = p.digest(self.instruction)
        for module in (p, o.source_gate):
            guard = patch.object(module, 'LAYOUT_INSTRUCTION_SHA256', self.instruction_hash)
            guard.start(); self.addCleanup(guard.stop)
        self.build_path = self.root / 'build.json'
        self.qa_path = self.root / 'qa-plan.json'
        self.verification_path = self.root / 'source-verification.json'
        self.oss_verification_path = self.root / 'verification.json'
        self.acceptance_path = self.root / 'acceptance.json'
        self.selected = ['kept', 'plain']
        self.geometry_hash = 'c' * 64
        self.build = {'schema': 'wly.typeset-build.v1', 'release_id': 'a' * 64, 'files': {},
                      'pages': {page: self.entry(page) for page in self.selected}}
        self.write(self.build_path, self.build)
        self.verification = self.raw_qa(self.build, self.build_path)
        self.write(self.verification_path, self.verification)
        self.plan = copy.deepcopy(self.build)
        self.plan.update(schema='wly.typeset-oss-qa-plan.v1', release_id='b' * 64,
                         source_release_id=self.build['release_id'], source_build_report_sha256=p.digest(self.build_path),
                         split_manifest_sha256='d' * 64, oss_objects={})
        self.write(self.qa_path, self.plan)
        self.oss_verification = self.raw_qa(self.plan, self.qa_path)
        self.write(self.oss_verification_path, self.oss_verification)
        self.acceptance = {'schema': 'wly.typeset-layout-acceptance.v1',
            'instruction': {'id': p.LAYOUT_INSTRUCTION_ID, 'path': str(self.instruction), 'sha256': self.instruction_hash},
            'source_release_id': self.build['release_id'], 'source_build_report_sha256': p.digest(self.build_path),
            'selected_pages': self.selected,
            'source': {'verification_sha256': p.digest(self.verification_path), 'accepted_issues': self.findings(self.verification)},
            'oss': {'release_id': self.plan['release_id'], 'qa_plan_sha256': p.digest(self.qa_path),
                    'verification_sha256': p.digest(self.oss_verification_path), 'accepted_issues': self.findings(self.oss_verification)}}
        self.write(self.acceptance_path, self.acceptance)

    def tearDown(self):
        self.temp.cleanup()

    def write(self, path, value):
        path.write_text(json.dumps(value, ensure_ascii=False), encoding='utf8')

    def entry(self, page):
        binding = {'policy': 'semantic-content-rects-v1', 'method': 'synthetic measured content',
                   **{key: 'e' * 64 for key in ('source_html_sha256', 'source_png_sha256', 'fit_sha256', 'measurement_sha256')}}
        return {'url': '/' + page + '/', 'status': 'built', 'issues': [], 'geometry_sha256': self.geometry_hash,
                'effects_expected': [], 'video_expected': None,
                'content_occupancy': {'policy': 'semantic-content-rects-v1',
                                      'parts': {page + '-01-' + side + '.png': copy.deepcopy(binding) for side in ('h', 'v')}}}

    def raw_qa(self, build, build_path):
        pages = {}
        for page, entry in build['pages'].items():
            checks, effects_checks = [], []
            for width, orientation in ((1440, 'h'), (390, 'v')):
                part = page + '-01-' + orientation + '.png'
                failing = page == 'kept' and width == 1440
                issues = [part + p.BLANK_ISSUE] if failing else []
                status = 'fail' if failing else 'pass'
                screen = {'screen': page + '-01', 'part': part, 'source_binding': copy.deepcopy(entry['content_occupancy']['parts'][part]),
                          'content_blocks': 1, 'threshold_fraction': .15, 'definite_fail': failing,
                          'largest_empty_rectangle': {'viewport_fraction': .2 if failing else .1}, 'issues': []}
                if failing:
                    screen['largest_empty_rectangle'].update(area_px2=width * 200,
                        bounds={'left': 0, 'top': 0, 'width': width, 'height': 200})
                content = {'policy': 'visible-content-and-continuous-blank-v1', 'viewport': {'width': width, 'height': 1000},
                           'screenshots': [], 'live_slots': [], 'screens': [screen], 'issues': issues, 'status': status}
                checks.append({'width': width, 'height': 1000, 'route': entry['url'], 'images': 1, 'active_parts': 1,
                               'hotspots': 0, 'live_slots': 0, 'screenshot_slots': 0, 'content_acceptance': content,
                               'hit_checks': 0, 'hit_diagnostics': [], 'geometry_diagnostics': [], 'scroll_width': width,
                               'ids': [], 'internal_targets': [], 'grids': [], 'issues': issues, 'status': status})
                effects_checks.append({'width': width, 'issues': [], 'reduced_motion': False, 'hidden': False,
                    'normal_branch': True, 'new_geometry_bound': True, 'hotspot_css_feedback': True, 'native_buttons_bound': True,
                    'geometry_counts': dict.fromkeys(('cards', 'numbers', 'dots', 'arrows'), 0), 'running_animation_count': 0,
                    'preserved': [], 'hero_video_attached': False, 'video_spec': None})
            evidence = {key: effects_checks[0][key] for key in
                        ('normal_branch', 'new_geometry_bound', 'hotspot_css_feedback', 'native_buttons_bound', 'geometry_counts', 'running_animation_count')}
            evidence.update(geometry_sha256=self.geometry_hash, checks=effects_checks)
            pages[page] = {'url': entry['url'], 'status': 'fail' if page == 'kept' else 'pass', 'checks': checks,
                          'effects': {'status': 'pass', 'issues': [], 'expected': [], 'preserved': [], 'evidence': evidence},
                          'video_checks': {'status': 'pass', 'issues': [], 'files': [], 'gates': [], 'mounted': False}, 'build_issues': []}
        return {'schema': 'wly.typeset-verification.v1', 'release_id': build['release_id'], 'build_report_sha256': p.digest(build_path),
                'verified_at_beijing': '2026-10-05T03:01:00+08:00', 'summary': {'passed': 1, 'failed': 1, 'checked': 2, 'unverified': []}, 'pages': pages}

    def findings(self, raw):
        return [{'page': page, 'url': dom['url'], 'width': check['width'], 'issues': check['issues']}
                for page, dom in raw['pages'].items() for check in dom['checks'] if check['issues']]

    def validate(self, oss=False):
        return p.layout_acceptance(self.acceptance_path, self.build, self.build_path,
            self.oss_verification if oss else self.verification,
            self.oss_verification_path if oss else self.verification_path, self.selected, self.qa_path if oss else None)

    def rebind_raw(self):
        self.write(self.verification_path, self.verification)
        self.acceptance['source']['verification_sha256'] = p.digest(self.verification_path)
        self.write(self.acceptance_path, self.acceptance)

    def test_exact_source_and_oss_acceptance_retains_raw_failure(self):
        before = self.verification_path.read_bytes(), self.oss_verification_path.read_bytes(), copy.deepcopy(self.verification)
        source, split = self.validate(), self.validate(oss=True)
        self.assertEqual(source['raw_status'], 'fail')
        self.assertEqual(source['raw_summary']['failed'], 1)
        self.assertEqual(source['raw_pages']['kept']['checks'][0]['status'], 'fail')
        self.assertEqual(source['accepted_issues'], self.acceptance['source']['accepted_issues'])
        self.assertEqual(source['sha256'], split['sha256'])
        self.assertEqual(before, (self.verification_path.read_bytes(), self.oss_verification_path.read_bytes(), self.verification))

    def test_already_passing_domain_keeps_pass_and_accepts_no_findings(self):
        dom = self.verification['pages']['kept']; check = dom['checks'][0]
        dom['status'] = check['status'] = check['content_acceptance']['status'] = 'pass'
        check['issues'] = []; check['content_acceptance']['issues'] = []
        screen = check['content_acceptance']['screens'][0]
        screen['definite_fail'] = False; screen['largest_empty_rectangle']['viewport_fraction'] = .1
        screen['largest_empty_rectangle']['area_px2'] = check['width'] * 100
        screen['largest_empty_rectangle']['bounds']['height'] = 100
        self.verification['summary'].update(passed=2, failed=0)
        self.acceptance['source']['accepted_issues'] = []; self.rebind_raw()
        proof = self.validate()
        self.assertEqual(proof['raw_status'], 'pass')
        self.assertEqual(proof['accepted_issues'], [])
        self.acceptance['oss']['accepted_issues'] = []; self.write(self.acceptance_path, self.acceptance)
        with self.assertRaisesRegex(ValueError, 'no layout findings'): self.validate()

    def test_unknown_acceptance_fields_and_wrong_bindings_block(self):
        cases = [('unknown', lambda: self.acceptance.update(allow_all=True)),
                 ('nested unknown', lambda: self.acceptance['source'].update(waive_effects=True)),
                 ('instruction id', lambda: self.acceptance['instruction'].update(id='wrong')),
                 ('instruction hash', lambda: self.acceptance['instruction'].update(sha256='0' * 64)),
                 ('RID prefix', lambda: self.acceptance.update(source_release_id='a' * 12)),
                 ('build hash', lambda: self.acceptance.update(source_build_report_sha256='0' * 64)),
                 ('raw hash', lambda: self.acceptance['source'].update(verification_sha256='0' * 64)),
                 ('page coverage', lambda: self.acceptance.update(selected_pages=['kept'])),
                 ('wrong URL', lambda: self.acceptance['source']['accepted_issues'][0].update(url='/wrong/')),
                 ('unknown issue', lambda: self.acceptance['source']['accepted_issues'][0].update(issues=['screenshot missing'])),
                 ('duplicate', lambda: self.acceptance['source']['accepted_issues'].append(copy.deepcopy(self.acceptance['source']['accepted_issues'][0])))]
        original = copy.deepcopy(self.acceptance)
        for label, change in cases:
            with self.subTest(label=label):
                self.acceptance = copy.deepcopy(original); change(); self.write(self.acceptance_path, self.acceptance)
                with self.assertRaises(ValueError): self.validate()

    def test_missing_functional_or_source_evidence_cannot_be_waived(self):
        cases = [('second width', lambda d: d['checks'].pop()),
                 ('unknown raw gate', lambda d: d.update(charts={'status': 'fail'})),
                 ('screenshot', lambda d: d['checks'][0]['issues'].append('screenshot covered')),
                 ('live', lambda d: d['checks'][0]['content_acceptance']['live_slots'].append({'status': 'fail', 'probes': []})),
                 ('missing slot', lambda d: d['checks'][0].update(screenshot_slots=1)),
                 ('hotspot', lambda d: d['checks'][0].update(hit_diagnostics=[{'blocked': True}])),
                 ('effects', lambda d: d['effects'].update(status='fail')),
                 ('video', lambda d: d['video_checks'].update(status='fail')),
                 ('effect observations', lambda d: d['effects']['evidence']['checks'].pop()),
                 ('build', lambda d: d['build_issues'].append('wrong source')),
                 ('URL', lambda d: d.update(url='/wrong/')),
                 ('part coverage', lambda d: d['checks'][0]['content_acceptance']['screens'].clear()),
                 ('source hash', lambda d: d['checks'][0]['content_acceptance']['screens'][0]['source_binding'].update(source_html_sha256='0' * 64)),
                 ('empty source', lambda d: d['checks'][0]['content_acceptance']['screens'][0].update(content_blocks=0)),
                 ('blank threshold', lambda d: d['checks'][0]['content_acceptance']['screens'][0].update(threshold_fraction=.2)),
                 ('missing rectangle', lambda d: d['checks'][0]['content_acceptance']['screens'][0]['largest_empty_rectangle'].pop('bounds')),
                 ('hidden functional failure', lambda d: d['checks'][1].update(status='fail'))]
        original = copy.deepcopy(self.verification)
        for label, change in cases:
            with self.subTest(label=label):
                self.verification = copy.deepcopy(original); change(self.verification['pages']['kept']); self.rebind_raw()
                with self.assertRaises(ValueError): self.validate()

    def test_oss_domain_cannot_reuse_source_or_stale_plan(self):
        original = copy.deepcopy(self.acceptance)
        for change in (lambda: self.acceptance.pop('oss'),
                       lambda: self.acceptance['oss'].update(release_id=self.build['release_id']),
                       lambda: self.acceptance['oss'].update(qa_plan_sha256='0' * 64),
                       lambda: self.acceptance['oss'].update(verification_sha256=p.digest(self.verification_path))):
            self.acceptance = copy.deepcopy(original); change(); self.write(self.acceptance_path, self.acceptance)
            with self.assertRaises(ValueError): self.validate(oss=True)

    def test_oss_plan_cannot_substitute_source_measurements_even_with_new_hashes(self):
        self.plan['pages']['kept']['content_occupancy']['parts']['kept-01-h.png']['source_html_sha256'] = '0' * 64
        self.oss_verification['pages']['kept']['checks'][0]['content_acceptance']['screens'][0]['source_binding']['source_html_sha256'] = '0' * 64
        self.write(self.qa_path, self.plan)
        self.oss_verification['build_report_sha256'] = p.digest(self.qa_path)
        self.write(self.oss_verification_path, self.oss_verification)
        self.acceptance['oss'].update(qa_plan_sha256=p.digest(self.qa_path), verification_sha256=p.digest(self.oss_verification_path))
        self.write(self.acceptance_path, self.acceptance)
        with self.assertRaisesRegex(ValueError, 'measured source'): self.validate(oss=True)

    def test_changed_instruction_or_raw_bytes_block(self):
        self.instruction.write_text('Changed source', encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'original instruction'): self.validate()
        self.instruction.write_text('Synthetic layout decision, never publication authority.\n', encoding='utf8')
        self.verification_path.write_text(self.verification_path.read_text('utf8') + '\n', encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'raw QA changed'): self.validate()

    def test_duplicate_json_fields_do_not_hide_a_failure(self):
        text = self.acceptance_path.read_text('utf8')
        self.acceptance_path.write_text(text[:-1] + ',"schema":"wly.typeset-layout-acceptance.v1"}', encoding='utf8')
        with self.assertRaisesRegex(ValueError, 'duplicate JSON fields'): self.validate()
        self.write(self.acceptance_path, self.acceptance)
        text = self.verification_path.read_text('utf8')
        self.verification_path.write_text(text[:-1] + ',"release_id":"' + self.build['release_id'] + '"}', encoding='utf8')
        self.acceptance['source']['verification_sha256'] = p.digest(self.verification_path)
        self.write(self.acceptance_path, self.acceptance)
        with self.assertRaisesRegex(ValueError, 'duplicate JSON fields'): self.validate()

    def test_prepare_accepts_layout_but_still_requires_publication_directive(self):
        baseline, release, typeset = (self.root / name for name in ('baseline', 'release', 'typeset'))
        baseline.mkdir(); release.mkdir(); typeset.mkdir()
        (baseline / 'index.html').write_text('same homepage', encoding='utf8')
        (release / 'index.html').write_bytes((baseline / 'index.html').read_bytes())
        old = {'index.html': {'sha256': p.digest(baseline / 'index.html'), 'bytes': (baseline / 'index.html').stat().st_size}}
        inventory = self.root / 'inventory.jsonl'
        geometry = self.root / 'geometry.json'; self.write(geometry, {})
        rows = []
        for page in self.selected:
            source = self.root / (page + '.txt'); source.write_text('synthetic source', encoding='utf8')
            rows.append({'page': page, 'screen_id': page + '-01', 'source_path': str(source), 'source_sha256': p.digest(source)})
            folder = typeset / page; folder.mkdir()
            manifest_path = folder / 'page-manifest.json'
            self.write(manifest_path, {'page': page, 'screens': [{'screen': page + '-01', 'images': [
                {'image': page + '-01-h.png', 'links': 'links.json'}]}]})
            html = release / page / 'index.html'; html.parent.mkdir(); html.write_text('fixture HTML', encoding='utf8')
            entry = self.build['pages'][page]
            entry.update(geometry_sha256=p.digest(geometry), html_sha256=p.digest(html), quality={'status': 'pass'}, inputs={str(path.resolve()): {'sha256': 'f' * 64, 'bytes': 1}
                for path in (source, manifest_path, inventory, folder / (page + '-01-h.png'), folder / 'links.json')})
            entry['inputs'][str(source.resolve())] = {'sha256': p.digest(source), 'bytes': source.stat().st_size}
            self.verification['pages'][page]['effects']['evidence']['geometry_sha256'] = p.digest(geometry)
        inventory.write_text('\n'.join(json.dumps(row) for row in rows), encoding='utf8')
        files = {**old, **{page + '/index.html': {'sha256': p.digest(release / page / 'index.html'), 'bytes': 12} for page in self.selected}}
        self.build.update(files=files, geometry_path=str(geometry), geometry_sha256=p.digest(geometry), baseline_root=str(baseline),
            baseline_index_sha256=old['index.html']['sha256'], built_at_beijing='2026-10-05T03:01:00+08:00')
        self.write(self.build_path, self.build)
        self.verification['build_report_sha256'] = p.digest(self.build_path); self.rebind_raw()
        self.acceptance['source_build_report_sha256'] = p.digest(self.build_path)
        self.write(self.acceptance_path, self.acceptance)
        release_manifest = {'release_id': self.build['release_id'], 'files': files, 'baseline_files': old,
                            'accepted_pages': {self.build['pages'][page]['url']: {} for page in self.selected}}
        self.write(release / 'release-manifest.json', release_manifest)
        baseline_manifest = baseline / 'release-manifest.json'; self.write(baseline_manifest, {})
        args = SimpleNamespace(typeset_root=typeset, inventory=inventory, geometry=geometry, baseline=baseline,
            baseline_manifest=baseline_manifest, release=release, build_report=self.build_path, verification=self.verification_path,
            directive=None, rebuilt_report=None, pages=self.selected, layout_acceptance=self.acceptance_path, output=self.root / 'prepared.json')
        with patch.object(p.hybrid, 'verify_release', return_value=release_manifest), patch.object(p.hybrid, 'verify_baseline', return_value=(old, None)), \
             patch.object(p, 'geometry_evidence', return_value={}), patch.object(p, 'quality_evidence', return_value={'source_status': 'pass', 'program_failures': []}), \
             patch.object(p, 'bound_file'):
            result = p.prepare(args)
            self.assertEqual(result['status'], 'blocked')
            self.assertEqual({row['kind'] for row in result['blockers']}, {'publication_instruction'})
            self.assertEqual(result['layout_acceptance']['raw_status'], 'fail')
            args.layout_acceptance = None
            default = p.prepare(args)
            self.assertIn('page_evidence', {row['kind'] for row in default['blockers']})
            self.assertNotIn('layout_acceptance', default)

    def test_bounded_oss_reuses_same_layout_proof_without_lowering_transfer_gate(self):
        instruction = self.root / 'transfer-instruction.md'
        instruction.write_text(o.EXTENDED_INSTRUCTION + ' 2e、2f 和以后各版 最多重试一次', encoding='utf8')
        paths = {role: self.root / (role + '.json') for role in ('cold', 'network', 'reading')}
        for path in paths.values(): self.write(path, {'release_id': self.plan['release_id'], 'manifest_sha256': 'd' * 64})
        manifest = {'release_id': self.plan['release_id'], 'files': self.plan['files']}
        # Transfer evidence is an independent existing gate, deliberately mocked
        # only for this JSON layout integration test.
        with patch.object(o, 'bounded_report', return_value={'status': 'pass'}) as transfer:
            with self.assertRaisesRegex(ValueError, 'full QA source did not pass'):
                o.bounded_acceptance(manifest, 'd' * 64, instruction, paths)
            receipt = o.bounded_acceptance(manifest, 'd' * 64, instruction, paths, self.acceptance_path, self.build_path, self.qa_path)
            self.assertEqual(receipt['layout_acceptance']['raw_status'], 'fail')
            o.verify_bounded_acceptance(receipt, manifest, 'd' * 64, paths['cold'], paths['reading'], self.oss_verification_path,
                                        self.acceptance_path, self.build_path, self.qa_path)
            self.assertGreaterEqual(transfer.call_count, 9)
        with patch.object(o, 'bounded_report', side_effect=ValueError('actual network body failure')):
            with self.assertRaisesRegex(ValueError, 'actual network body failure'):
                o.bounded_acceptance(manifest, 'd' * 64, instruction, paths, self.acceptance_path, self.build_path, self.qa_path)

    def test_oss_gate_still_blocks_reading_failure_after_accepting_layout(self):
        preparation = self.root / 'oss'; (preparation / 'github').mkdir(parents=True)
        manifest = {'release_id': self.plan['release_id'], 'files': {}, 'oss': {'objects': {}}}
        manifest_path = preparation / 'github' / 'release-manifest.json'; self.write(manifest_path, manifest)
        self.plan['split_manifest_sha256'] = p.digest(manifest_path); self.write(self.qa_path, self.plan)
        self.oss_verification['build_report_sha256'] = p.digest(self.qa_path); self.write(self.oss_verification_path, self.oss_verification)
        self.acceptance['oss'].update(qa_plan_sha256=p.digest(self.qa_path), verification_sha256=p.digest(self.oss_verification_path))
        self.write(self.acceptance_path, self.acceptance)
        plan = {'test_only': False, 'source_release_id': self.build['release_id'], 'source_files': {}}
        reading = self.root / 'bad-reading.json'; self.write(reading, {'status': 'fail'})
        args = SimpleNamespace(preparation=preparation, build_report=self.build_path, rebuilt_source=None, qa_plan=self.qa_path,
                               verification=self.oss_verification_path, reading=reading, layout_acceptance=self.acceptance_path)
        with patch.object(o.oss, 'verify_local', return_value=plan), patch.object(o.oss, 'verify_manifest'):
            with self.assertRaisesRegex(ValueError, 'Reading check is not'): o.verify(args)
            args.layout_acceptance = None
            with self.assertRaisesRegex(ValueError, 'Split DOM verification did not pass'): o.verify(args)

    def test_static_home_exception_requires_exact_original_bytes(self):
        source, baseline = self.root / 'source', self.root / 'baseline'
        source.mkdir(); baseline.mkdir()
        (source / 'index.html').write_bytes(b'updated home')
        (baseline / 'index.html').write_bytes(b'original home')
        self.assertFalse(o.unchanged_static_home({'home_static_preparation': {}},
            {'source_root': str(source)}, {'baseline_root': str(baseline)}))

    def test_stage_requires_same_explicit_acceptance_and_unchanged_raw_qa(self):
        reviewed, staged = self.root / 'reviewed', self.root / 'staged'
        reviewed.mkdir(); staged.mkdir()
        self.build['output_root'] = str(reviewed); self.write(self.build_path, self.build)
        self.verification['build_report_sha256'] = p.digest(self.build_path); self.rebind_raw()
        self.acceptance['source_build_report_sha256'] = p.digest(self.build_path); self.write(self.acceptance_path, self.acceptance)
        layout = self.validate()
        evidence = {page: {'url': self.build['pages'][page]['url'], 'evidence': {'page': page, 'layout_acceptance_sha256': layout['sha256']}}
                    for page in self.selected}
        receipt = {'schema': 'wly.typeset-preparation.v1', 'status': 'ready', 'blockers': [], 'release_id': self.build['release_id'],
                   'build_report_sha256': p.digest(self.build_path), 'selected_pages': self.selected, 'pages': evidence, 'layout_acceptance': layout}
        receipt_path = self.root / 'prepared.json'; self.write(receipt_path, receipt)
        manifest = {'release_id': self.build['release_id'], 'files': {}, 'rollback_ref': 'fixture-rollback',
                    'accepted_pages': {row['url']: row['evidence'] for row in evidence.values()}}
        expected = self.root / 'expected.json'; self.write(expected, manifest)
        self.write(staged / 'release-manifest.json', manifest)
        args = SimpleNamespace(release=staged, build_report=self.build_path, preparation=receipt_path, expected_manifest=expected,
                               rollback_ref='fixture-rollback', output=self.root / 'staged-check.json', layout_acceptance=None)
        with patch.object(p.hybrid, 'verify_release', return_value=manifest):
            with self.assertRaisesRegex(ValueError, 'explicitly supply'): p.stage_check(args)
            args.layout_acceptance = self.acceptance_path
            self.assertEqual(p.stage_check(args)['raw_dom_status'], 'fail')
            self.verification_path.write_text(self.verification_path.read_text('utf8') + '\n', encoding='utf8')
            with self.assertRaisesRegex(ValueError, 'raw QA changed'): p.stage_check(args)


if __name__ == '__main__':
    unittest.main()

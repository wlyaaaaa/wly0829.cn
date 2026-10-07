"""Motion capability, immutable preparation and legacy-runtime compatibility."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
RELEASE_ROOT = Path(os.environ.get('WLY_TEST_RELEASE_ROOT',ROOT/'site-release')).resolve()


def module(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/filename)
    value = importlib.util.module_from_spec(spec); spec.loader.exec_module(value)
    return value


motion = module('tested_motion', 'prepare-motion-release.py')
builder = module('tested_motion_builder', 'build-typeset-site.py')


class MotionTests(unittest.TestCase):
    def record(self, active=False):
        dots = [{'rect': [2, 3, 5, 5], 'state': 'active', 'policy': motion.DOT_POLICY}] if active else []
        return {'measurement_recipe': 'producer-components-v8', 'dots': dots,
            'dot_capability': {'policy': motion.DOT_POLICY, 'status': 'present' if active else 'no_corresponding_element',
                'active_markers': len(dots), 'measured_markers': len(dots),
                'observations': [{'state': 'active', 'measurable': True, 'rect': dots[0]['rect']}] if active else []}}

    def test_absence_is_accepted_only_with_actual_classified_measurement(self):
        self.assertEqual(motion.dot_evidence(self.record(), '<p>普通文字，没有状态点</p>')['status'], 'no_corresponding_element')
        with self.assertRaisesRegex(ValueError, 'recipe'):
            motion.dot_evidence({'dots': []}, '<p>没有元素</p>')
        with self.assertRaisesRegex(ValueError, 'missing from DOM'):
            motion.dot_evidence(self.record(), '<span class="dot dot-on">●</span>')
        with self.assertRaisesRegex(ValueError, 'missing from DOM'):
            motion.dot_evidence(self.record(), '<span class="feature-status-dot" data-state="on"></span>')
        # Explicit off/pending source markers are not an active breathing requirement.
        motion.dot_evidence(self.record(), '<span class="feature-status-dot" data-state="pending"></span><span class="dot dot-x">✕</span>')

    def test_every_active_marker_and_original_asset_marker_must_be_measured(self):
        record = self.record(True)
        motion.dot_evidence(record, '<span class="dot dot-on">●</span>')
        motion.dot_evidence(record, '<span class="hub-status" data-state="on"><i class="status-dot"></i>正常</span>')
        mismatch = self.record(True); mismatch['dots'][0]['rect'] = [30, 20, 5, 5]
        with self.assertRaisesRegex(ValueError, 'differs from observed'):
            motion.dot_evidence(mismatch, '<span class="dot dot-on">●</span>')
        record['dot_capability']['observations'][0]['measurable'] = False
        with self.assertRaisesRegex(ValueError, 'not all measured'):
            motion.dot_evidence(record, '<span class="dot dot-on">●</span>')
        with self.assertRaisesRegex(ValueError, 'missing from DOM'):
            motion.dot_evidence(self.record(), '<span data-role="status-dot" data-ct-dot-xywh="0 0 1 1"></span>')

    def test_old_decorative_coordinates_do_not_add_current_dot_expectation(self):
        old = {'screens': [{'id': 'one', 'layouts': {'h': {'dots': [[0, 0, .1, .1]]}}}]}
        self.assertNotIn('dots', builder.old_effects(old))
        old['screens'][0]['layouts']['h']['arrows'] = [{'rect': [0, 0, .1, .1]}]
        self.assertIn('arrows', builder.old_effects(old))

    def test_oss_identity_requires_the_known_schema_and_exact_algorithm(self):
        files={'index.html':{'sha256':'a'*64,'bytes':10}}
        legacy={'schema':'wly.hybrid-release.v1'}
        runtime={'schema':'wly.hybrid-release.v1','runtime_overlay':{'schema':'wly.oss-video-runtime.v1','status':'prepared'}}
        old,_=motion.release_identity(files,legacy);new,scheme=motion.release_identity(files,runtime)
        self.assertEqual(old,hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest())
        self.assertEqual(new,hashlib.sha256(json.dumps(files,sort_keys=True,separators=(',',':')).encode()).hexdigest())
        self.assertNotEqual(old,new);self.assertIn('compact',scheme)
        with self.assertRaisesRegex(ValueError,'Unsupported baseline'):
            motion.release_identity(files,{'schema':'arbitrary.v1'})
        with self.assertRaisesRegex(ValueError,'Unsupported runtime overlay'):
            motion.release_identity(files,{'schema':'wly.hybrid-release.v1','runtime_overlay':{'schema':'unrecognized','status':'prepared'}})

    def test_circled_number_track_preserves_original_notation(self):
        helpers = (ROOT/'scripts/typeset-layout.js').read_text('utf8').split('/* Manifest geometry', 1)[0]
        script = helpers + "\nconst n={text:'①',...motionNumberToken('①')};process.stdout.write(JSON.stringify([n,motionNumberText(n,0,false),motionNumberText(n,1,true),motionNumberToken('20,001'),motionDotEnabled({shape:'cross'}),motionDotEnabled({policy:'current-active-status-v1',state:'pending'})]));"
        result = json.loads(subprocess.check_output(['node', '-e', script], text=True, encoding='utf8'))
        self.assertEqual(result[0]['value'], 1); self.assertEqual(result[0]['notation'], 'circled')
        self.assertEqual(result[1:3], ['⓪', '①']); self.assertEqual(result[3]['value'], 20001)
        self.assertEqual(result[4:], [False, False])

    def test_speed_is_separate_from_amplitude_and_geometry_keeps_full_count(self):
        helpers=(ROOT/'scripts/typeset-layout.js').read_text('utf8').split('/* Manifest geometry',1)[0]
        script='const SiteMotionAppearance='+json.dumps(motion.appearance(),ensure_ascii=False)+';\n'+helpers+"\nprocess.stdout.write(JSON.stringify({card:motionDuration('cards'),number:motionDuration('numbers'),cleanup:motionDuration('number_cleanup'),stagger:motionDuration('card_stagger'),bird:motionDelay(2300),phone:[0,1,2,3,4,5].map(i=>motionLeafPosition(412,0,i,6)),desktop:[0,1,2,3,4,5].map(i=>motionLeafPosition(1440,24,i,6))}));"
        result=json.loads(subprocess.check_output(['node','-e',script],text=True,encoding='utf8'))
        self.assertEqual([result[k]for k in ['card','number','cleanup','stagger','bird']],[360,480,600,48,920])
        self.assertEqual(len(result['phone']),6);self.assertTrue(all(0<=x<412 for x in result['phone']))
        self.assertEqual(len(result['desktop']),6);self.assertTrue(all(0<=x<1440 for x in result['desktop']))
        patched=motion.patch_runtime((RELEASE_ROOT/'_shared/app-a86fd4dfcf0c.js').read_text('utf8'))
        generic=patched.replace(motion.hero_module(patched),'')
        self.assertNotIn('n=innerWidth<600?3:6',generic)
        self.assertNotIn('hardwareConcurrency',generic);self.assertNotIn('deviceMemory',generic);self.assertNotIn('navigator.connection',generic)

    def test_existing_legacy_and_typeset_app_shapes_are_supported(self):
        legacy = (RELEASE_ROOT/'_shared/app-a86fd4dfcf0c.js').read_text('utf8')
        installed = next(p.read_text('utf8') for p in (RELEASE_ROOT/'_typeset/runtime').glob('app-*.js')
                         if '/* motion-appearance-v1 */' not in p.read_text('utf8'))
        for source in (legacy, installed):
            patched = motion.patch_runtime(source)
            subprocess.run(['node', '--check', '-'], input=patched, text=True, encoding='utf8', check=True, capture_output=True)
            # The video module is byte-for-byte untouched.
            video_marker = '/* 只播放人工标注的插画面片'
            self.assertEqual(patched.split(video_marker, 1)[1].split('\nfor(const [key,value]', 1)[0], source.split(video_marker, 1)[1])
        current = builder.patch_app(legacy)
        self.assertEqual(current.count('function motionNumberToken('), 1)
        subprocess.run(['node', '--check', '-'], input=current, text=True, encoding='utf8', check=True, capture_output=True)

    def test_page_appearance_clock_preserves_home_aliases_and_independent_config(self):
        helpers=(ROOT/'scripts/typeset-layout.js').read_text('utf8').split('/* Manifest geometry',1)[0]
        for identity, expected in [('home',2.5),('how',1.75),('cockpit',1.75),('skills',1.75)]:
            script=('const document={getElementById:()=>({textContent:'+json.dumps(json.dumps({'page':identity}))+'})};'
                    'const SiteMotionAppearance='+json.dumps(motion.appearance())+';'+helpers+
                    "process.stdout.write(JSON.stringify({label:SiteMotionAppearance.speed_multiplier,effective:motionAppearanceSpeed(SiteMotionAppearance),cards:motionDuration('cards'),numbers:motionDuration('numbers'),bird:motionDelay(2300)}));")
            actual=json.loads(subprocess.check_output(['node','-e',script],text=True,encoding='utf8'))
            self.assertEqual(actual['label'],2.5);self.assertEqual(actual['effective'],expected)
            self.assertAlmostEqual(actual['cards'],900/expected);self.assertAlmostEqual(actual['numbers'],1200/expected)
            self.assertEqual(actual['bird'],920)

    def test_preparation_changes_only_urls_and_never_old_hash_assets_or_oss_media(self):
        with tempfile.TemporaryDirectory() as folder:
            base, out = Path(folder)/'base', Path(folder)/'out'; base.mkdir()
            runtime = '_shared/app-a86fd4dfcf0c.js'; css = '_shared/site-0ba0c812dca7.css'
            for rel in (runtime, css):
                p = base/rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes((RELEASE_ROOT/rel).read_bytes())
            html = ('<h1>完整正文不变</h1><video src="https://assets.example.org/old-video.mp4"></video><img src="https://assets.example.org/current-image.webp">'
                f'<link rel="stylesheet" href="/{css}"><script defer src="/{runtime}"></script>').encode()
            (base/'index.html').write_bytes(html)
            (base/'detail').mkdir(); (base/'detail/index.html').write_bytes(html)
            files = {p.relative_to(base).as_posix(): motion.file_stamp(p) for p in base.rglob('*') if p.is_file()}
            baseline_id=hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest()
            (base/'release-manifest.json').write_text(json.dumps({'schema':'wly.hybrid-release.v1','release_id': baseline_id, 'files': files, 'accepted_pages': {'/detail/': {'old_verification': 'kept'}}}), encoding='utf8')
            result = motion.prepare(base, out, Path(folder)/'report.json')
            self.assertEqual(len(result['changed_html']), 2); self.assertTrue(result['immutable_baseline_assets_preserved']); self.assertFalse(result['published'])
            for rel in (runtime, css): self.assertEqual((base/rel).read_bytes(), (out/rel).read_bytes())
            for rel, entry in result['changed_html'].items():
                recovered = (out/rel).read_bytes()
                for old, new in entry['replacements'].items(): recovered = recovered.replace(new.encode(), old.encode())
                self.assertEqual(recovered, html)
            for rel in result['new_assets']:
                self.assertIn(hashlib.sha256((out/rel).read_bytes()).hexdigest()[:20], rel)
            self.assertEqual(json.loads((out/'release-manifest.json').read_text('utf8'))['accepted_pages'], {'/detail/': {'old_verification': 'kept'}})
            with self.assertRaisesRegex(ValueError, 'fresh output'):
                motion.prepare(base, out, Path(folder)/'again.json')
            # A valid identifier never waives an unrecorded real file.
            (base/'unrecorded.png').write_bytes(b'extra')
            with self.assertRaisesRegex(ValueError,'inventory differs'):
                motion.prepare(base,Path(folder)/'extra-out',Path(folder)/'extra-report.json')


if __name__ == '__main__':
    unittest.main()

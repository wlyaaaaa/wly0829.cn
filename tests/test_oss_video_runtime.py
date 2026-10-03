"""Focused contracts for the actual released hero runtimes."""
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
loader = importlib.util.spec_from_file_location('oss_video', ROOT/'scripts/prepare-oss-runtime.py')
runtime = importlib.util.module_from_spec(loader); loader.loader.exec_module(runtime)
ACTUAL = [ROOT/'site-release'/name for name in (
    '_shared/app-a86fd4dfcf0c.js',
    '_typeset/runtime/app-90947cee074fae291b72.js',
    '_typeset/runtime/app-4fdb48d7d6fb118dc0c8.js')]


class RuntimeTests(unittest.TestCase):
    def test_only_video_module_changes_for_all_actual_bundles(self):
        for asset in ACTUAL:
            with self.subTest(asset=asset.name):
                before = asset.read_text('utf8'); after = runtime.patch_video_runtime(before)
                self.assertEqual(before[:before.index(runtime.MARKER)], after[:after.index(runtime.MARKER)])
                self.assertEqual(after, runtime.patch_video_runtime(after))
                self.assertIn('video.src=spec.src', after)
                self.assertIn('if(spec.mount_allowed!==true)', after)
                self.assertIn("video.addEventListener('canplay',reveal)", after)
                module = after[after.index(runtime.MARKER):]
                for old in ('response.blob()', 'createObjectURL', '2_000_000', '6000', 'attempts>=2', 'AbortController'):
                    self.assertNotIn(old, module)
                for condition in ("query.get('audit')!=='1'", '!rm.matches', '!document.hidden',
                                  '!portrait.matches', 'innerWidth>=1024&&visible', 'navigator.connection?.saveData'):
                    self.assertIn(condition, module)
                self.assertIn('video.playbackRate=spec.playback_rate||1', module)
                self.assertIn('maskImage:`url("${spec.mask}")`', module)

    def test_unknown_module_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Unsupported'):
            runtime.patch_video_runtime(ACTUAL[0].read_text('utf8').replace('blob.size>2_000_000', 'blob.size>3_000_000'))

    def test_exact_media_mount_gate_keeps_restoration_metadata(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);source=root/'source';(source/'assets').mkdir(parents=True);(source/'_shared').mkdir()
            (source/'_shared'/ACTUAL[0].name).write_bytes(ACTUAL[0].read_bytes())
            spec={'src':'assets/existing.mp4','mask':'assets/existing-mask.png','rect':[.1,.2,.3,.4]}
            # Opaque fixture bytes test identity retention, not media playback.
            (source/spec['src']).write_bytes(b'fixture media identity');(source/spec['mask']).write_bytes(b'fixture mask identity')
            data={'video':spec,'screens':[{'parts':[]}],'shared':{'script_bundle':'/_shared/'+ACTUAL[0].name}}
            original='<script src="/_shared/'+ACTUAL[0].name+'"></script><script id="page-data">'+json.dumps(data)+'</script>'
            (source/'index.html').write_text(original,encoding='utf8')
            files=runtime.inventory(source);manifest={'release_id':'fixture','files':files}
            (source/'release-manifest.json').write_text(json.dumps(manifest),encoding='utf8')
            row={'mount_allowed':False,'status':'insufficient_evidence','reason':'未取得同素材证据','video_sha256':files[spec['src']]['sha256'],
                 'mask_sha256':files[spec['mask']]['sha256'],'hero_static_files':{}}
            evidence={'schema':'wly.video-illustration-binding.v1','status':'pass','source_release_id':'fixture',
                      'source_manifest_sha256':runtime.stamp(source/'release-manifest.json')['sha256'],'pages':{'/':row},'counts':{'insufficient_evidence':1}}
            binding=root/'binding.json';binding.write_text(json.dumps(evidence),encoding='utf8')
            with self.assertRaisesRegex(ValueError,'bindings are required'):
                runtime.prepare(source,root/'missing',root/'missing.json')
            output=root/'release';runtime.prepare(source,output,root/'proof.json',video_bindings=binding)
            after=json.loads(runtime.PAGE_DATA.search((output/'index.html').read_text('utf8'))[1])['video']
            self.assertFalse(after['mount_allowed'])
            for key,value in spec.items():self.assertEqual(after[key],value)
            self.assertEqual((output/spec['src']).read_bytes(),(source/spec['src']).read_bytes())
            row['mount_allowed']=True;row['status']='matched_provenance';binding.write_text(json.dumps(evidence),encoding='utf8')
            runtime.prepare(source,root/'allowed',root/'allowed.json',video_bindings=binding)
            self.assertTrue(json.loads(runtime.PAGE_DATA.search((root/'allowed/index.html').read_text('utf8'))[1])['video']['mount_allowed'])
            row['video_sha256']='0'*64;binding.write_text(json.dumps(evidence),encoding='utf8')
            with self.assertRaisesRegex(ValueError,'identity changed'):
                runtime.prepare(source,root/'stale',root/'stale.json',video_bindings=binding)

    def test_manifest_and_new_paths_preserve_old_asset_bytes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); source = root/'source'; source.mkdir()
            before_scripts = {}
            for index, asset in enumerate(ACTUAL):
                target = source/'_shared'/asset.name; target.parent.mkdir(exist_ok=True)
                target.write_bytes(asset.read_bytes()); before_scripts[target.relative_to(source).as_posix()] = target.read_bytes()
                text = '<script src="/_shared/'+asset.name+'"></script><script id="page-data">'+json.dumps({'shared':{'script_bundle':'/_shared/'+asset.name}})+'</script>'
                (source/('index.html' if index == 0 else str(index)+'.html')).write_text(text, encoding='utf8')
            marker = source/'preserved.css'; marker.write_text('body{color:green}', encoding='utf8')
            manifest = {'release_id':'fixture', 'files':runtime.inventory(source)}
            (source/'release-manifest.json').write_text(json.dumps(manifest), encoding='utf8')
            output = root/'release'; proof = runtime.prepare(source, output, root/'evidence.json')
            self.assertEqual(len(proof['bundles']), 3); self.assertEqual(len(proof['changed_html']), 3)
            new = json.loads((output/'release-manifest.json').read_text('utf8'))
            self.assertEqual(new['files'], runtime.inventory(output))
            self.assertEqual((output/'preserved.css').read_bytes(), marker.read_bytes())
            for rel, original in before_scripts.items():
                self.assertEqual((output/rel).read_bytes(), original)
            for bundle in proof['bundles']:
                self.assertIn(bundle['after']['sha256'][:20], bundle['after_path'])
                self.assertEqual(hashlib.sha256((output/bundle['after_path']).read_bytes()).hexdigest(), bundle['after']['sha256'])
            self.assertNotIn('/_shared/'+ACTUAL[0].name, (output/'index.html').read_text('utf8'))
            replacement = root/'home.html'; replacement.write_text((source/'index.html').read_text('utf8')+'<a href="/projects/agents/">已审定入口</a>', encoding='utf8')
            overridden = runtime.prepare(source, root/'home-release', root/'home-evidence.json', replacement, manifest['files']['index.html']['sha256'])
            self.assertEqual(overridden['home_overlay']['before'], manifest['files']['index.html'])
            self.assertIn('已审定入口', (root/'home-release/index.html').read_text('utf8'))
            with self.assertRaisesRegex(ValueError, 'does not match'):
                runtime.prepare(source, root/'wrong-home', root/'wrong-home-evidence.json', replacement, '0'*64)
            with self.assertRaisesRegex(ValueError, 'requires'):
                runtime.prepare(source, root/'unbound-home', root/'unbound-home-evidence.json', replacement)
            marker.write_text('changed', encoding='utf8')
            with self.assertRaisesRegex(ValueError, 'differs from its manifest'):
                runtime.prepare(source, root/'tampered', root/'tampered-evidence.json')


if __name__ == '__main__':
    unittest.main()

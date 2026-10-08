"""Behavior checks for bounded search and exact runtime-reference updates."""
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest

spec=importlib.util.spec_from_file_location('overlay_hybrid',Path(__file__).resolve().parents[1]/'scripts/hybrid-release.py')
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
spec=importlib.util.spec_from_file_location('overlay_preparation',Path(__file__).resolve().parents[1]/'scripts/prepare-typeset-release.py')
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
def private_fixture(identity): return h.builder.load_policy()['fixture_values'][identity]
POLICY_UNAVAILABLE = bool(h.os.environ.get('CI')) and not (Path(__file__).resolve().parents[1] / '.publish/private/rule-public-policy.json').is_file()
class OverlayTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
        self.base=self.root/'base';self.assets=self.root/'assets';self.base.mkdir();self.assets.mkdir()
    def tearDown(self):self.temp.cleanup()
    def put(self,root,path,payload):
        p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(payload);return p
    def entry(self,rel,body,kind,**extra):
        p=self.put(self.assets,rel,body);old=self.base/rel
        return {'kind':kind,'source_path':str(p),'before':{'sha256':h.digest(old),'bytes':old.stat().st_size} if old.is_file() else None,'after':{'sha256':h.digest(p),'bytes':p.stat().st_size},**extra}
    def load(self,entries):
        p=self.root/'overlay.json';p.write_text(json.dumps({'schema':'wly.typeset-release-overlay.v1','files':entries}),encoding='utf8');return h.load_overlay(p,self.base)
    def test_runtime_update_accepts_only_script_url_change(self):
        old='/_typeset/runtime/app-'+('a'*20)+'.js';new='/_typeset/runtime/app-'+('b'*20)+'.js'
        before=('<h1>同一份正文</h1><script src="'+old+'"></script>').encode()
        self.put(self.base,'kept/index.html',before)
        entry=self.entry('kept/index.html',before.replace(old.encode(),new.encode()),'runtime_reference',replacements={old:new})
        self.load({'kept/index.html':entry})
        changed=('<h1>改了正文</h1><script src="'+new+'"></script>').encode()
        entry=self.entry('kept/index.html',changed,'runtime_reference',replacements={old:new})
        with self.assertRaisesRegex(ValueError,'beyond the app URL'):self.load({'kept/index.html':entry})
    def test_new_runtime_bundle_must_use_actual_bytes_hash(self):
        body=b'void 1;\n';rel='_typeset/runtime/app-'+hashlib.sha256(body).hexdigest()[:20]+'.js'
        entry=self.entry(rel,body,'runtime_bundle');self.load({rel:entry})
        wrong='_typeset/runtime/app-'+('0'*20)+'.js'
        with self.assertRaisesRegex(ValueError,'content hash'):self.load({wrong:self.entry(wrong,body,'runtime_bundle')})
    def test_existing_runtime_filename_cannot_be_overwritten(self):
        body=b'void 1;\n';rel='_typeset/runtime/app-'+hashlib.sha256(body).hexdigest()[:20]+'.js'
        self.put(self.base,rel,b'old')
        with self.assertRaisesRegex(ValueError,'content hash'):self.load({rel:self.entry(rel,body,'runtime_bundle')})
    @unittest.skipIf(POLICY_UNAVAILABLE, 'private publication policy is unavailable in CI')
    def test_unchanged_search_record_does_not_waive_a_new_record(self):
        old='window.__WLY_SEARCH_INDEX__='+json.dumps([{'text':private_fixture('sha256:9cc3d3376bb1dcb75034cd6893754bfff7a8dd49dfdde99804701bf1c32570cd')}],ensure_ascii=False)+';'
        new='window.__WLY_SEARCH_INDEX__='+json.dumps([{'text':private_fixture('sha256:9cc3d3376bb1dcb75034cd6893754bfff7a8dd49dfdde99804701bf1c32570cd')},{'text':private_fixture('sha256:3f1e20bd7e1e745da34743040f76a97c1904c87c3d830bfe56f5ff8bb7d04e95')}],ensure_ascii=False)+';'
        baseline=self.put(self.base,'search-index.js',old.encode());source=self.put(self.assets,'search-index.js',new.encode())
        kept=sorted(set(h.search_record_hashes(old))&set(h.search_record_hashes(new)))
        entry=self.entry('search-index.js',new.encode(),'search_index',preserved_record_sha256s=kept)
        self.load({'search-index.js':entry})
        self.assertTrue(h.unchanged_search_finding(source,{'type':'excluded_topic','offset':new.index(private_fixture('sha256:29de2b3769424e81047f6cb4ca162aeab9427445c943e10b534eecc608b708ff'))},entry))
        self.assertFalse(h.unchanged_search_finding(source,{'type':'excluded_topic','offset':new.rindex(private_fixture('sha256:29de2b3769424e81047f6cb4ca162aeab9427445c943e10b534eecc608b708ff'))},entry))
        self.assertFalse(h.unchanged_search_finding(source,{'type':'credential','offset':new.index(private_fixture('sha256:29de2b3769424e81047f6cb4ca162aeab9427445c943e10b534eecc608b708ff'))},entry))
    def test_private_path_pattern_stops_at_a_prose_sentence(self):
        self.assertIsNone(h.builder.PRIVATE.search('E:\\Documents\\xwechat_files。确认账号和聊天记录完整。'))
        self.assertIsNotNone(h.builder.PRIVATE.search('E:\\Documents\\聊天记录\\私密.json'))
    def test_final_stage_uses_checked_bytes_after_baseline_replacement(self):
        import shutil
        for rel in ('index.html','404.html','kept/index.html'):self.put(self.base,rel,b'<h1>fixture</h1>')
        baseline={'files':h.inventory(self.base),'routes':['/','/404.html','/kept/']}
        reviewed=self.root/'reviewed';manifest=h.assemble(self.base,self.base,reviewed,baseline,{'/kept/':{}})
        build=self.root/'build.json';build.write_text(json.dumps({'files':manifest['files'],'output_root':str(reviewed)}),encoding='utf8')
        evidence={'page':'kept','candidate_html_sha256':manifest['files']['kept/index.html']['sha256']}
        prepared=self.root/'prepared.json';prepared.write_text(json.dumps({'schema':'wly.typeset-preparation.v1','status':'ready','blockers':[],
            'build_report_sha256':h.digest(build),'release_id':manifest['release_id'],'selected_pages':['kept'],'pages':{'kept':{'url':'/kept/','evidence':evidence}}}),encoding='utf8')
        manifest['rollback_ref']='fixture-rollback';manifest['accepted_pages']={'/kept/':evidence}
        expected=self.root/'expected.json';expected.write_text(json.dumps(manifest),encoding='utf8')
        staged=self.root/'staged';shutil.copytree(reviewed,staged);(staged/'release-manifest.json').write_text(json.dumps(manifest),encoding='utf8')
        # The former baseline now contains the release; its prior input identity
        # can no longer be rechecked as old, while staged bytes remain exact.
        (self.base/'index.html').write_bytes(b'<h1>now replaced</h1>')
        args=SimpleNamespace(release=staged,build_report=build,preparation=prepared,expected_manifest=expected,rollback_ref='fixture-rollback',output=self.root/'stage.json')
        self.assertEqual(p.stage_check(args)['status'],'pass')
        manifest['accepted_pages']={'/kept/':{'page':'different'}}
        (staged/'release-manifest.json').write_text(json.dumps(manifest),encoding='utf8')
        with self.assertRaisesRegex(ValueError,'exact metadata'):p.stage_check(args)
if __name__=='__main__':unittest.main()

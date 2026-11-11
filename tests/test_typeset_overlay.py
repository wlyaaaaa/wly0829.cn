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
if __name__=='__main__':unittest.main()

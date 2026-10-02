"""Independent fixtures for preservation, admission, links and exact Git restore."""
import importlib.util
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

spec=importlib.util.spec_from_file_location('hybrid',Path(__file__).resolve().parents[1]/'scripts/hybrid-release.py')
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)

class HybridRelease(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='hybrid-test-');self.root=Path(self.temp.name)
        self.old=self.root/'old';self.new=self.root/'new';self.old.mkdir();self.new.mkdir()
        self.put(self.old,'index.html','<script src="/assets/legacy.js"></script><a href="/kept/">old</a>')
        self.put(self.old,'kept/index.html','<h1>Original legacy bytes</h1>')
        self.put(self.old,'404.html','<h1>Original 404 bytes</h1>')
        self.put(self.old,'assets/legacy.js','void 0;')
        self.put(self.old,'CNAME','wly0829.cn\n')
        self.baseline={'files':h.inventory(self.old),'routes':['/','/kept/','/404.html'],'required_failed':{}}
        self.put(self.new,'index.html','<a href="/future/page/#missing">future</a><a href="/kept/">kept</a><script src="/assets/new.js"></script>')
        self.put(self.new,'assets/new.js','import "./nested.js";')
        self.put(self.new,'assets/nested.js','void 1;')
    def tearDown(self):self.temp.cleanup()
    def put(self,root,rel,text):
        p=root/rel;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text,encoding='utf8');return p
    def assemble(self,accepted=None,name='release',**kw):
        out=self.root/name;manifest=h.assemble(self.old,self.new,out,self.baseline,accepted or {'/':{}},**kw);return out,manifest
    def test_old_pages_assets_and_routes_are_exact(self):
        out,manifest=self.assemble()
        for rel in ['kept/index.html','404.html','assets/legacy.js','CNAME']:
            self.assertEqual((out/rel).read_bytes(),(self.old/rel).read_bytes())
        self.assertEqual((out/'assets/nested.js').read_bytes(),(self.new/'assets/nested.js').read_bytes())
        self.assertTrue(set(self.baseline['routes']).issubset(manifest['routes']))
        self.assertEqual(manifest['temporary_href_mappings'][0]['temporary_href'],'/')
    def test_asset_conflict_is_rejected(self):
        self.put(self.new,'index.html','<script src="/assets/legacy.js"></script>')
        self.put(self.new,'assets/legacy.js','different bytes')
        with self.assertRaisesRegex(ValueError,'collision'):self.assemble()
    def test_video_mask_is_in_the_published_asset_closure(self):
        self.put(self.new,'index.html','<script id="page-data" type="application/json">{"video":{"src":"assets/hero.mp4","mask":"assets/hero-mask.png"}}</script>')
        self.put(self.new,'assets/hero.mp4','original video bytes');self.put(self.new,'assets/hero-mask.png','original mask bytes')
        out,manifest=self.assemble()
        self.assertEqual((out/'assets/hero-mask.png').read_bytes(),(self.new/'assets/hero-mask.png').read_bytes())
        self.assertIn('assets/hero-mask.png',manifest['files'])
    def test_candidate_tamper_is_rejected(self):
        proof=h.inventory(self.new);self.put(self.new,'assets/nested.js','replaced')
        with self.assertRaisesRegex(ValueError,'changed after preparation'):self.assemble(candidate_files=proof)
    def test_later_approved_target_restores_original_link(self):
        self.assemble(name='first')
        self.put(self.new,'future/page/index.html','<h1 id="missing">Approved</h1>')
        out,manifest=self.assemble({'/':{},'/future/page/':{}},name='second')
        self.assertIn('/future/page/#missing',(out/'index.html').read_text('utf8'))
        self.assertEqual(manifest['temporary_href_mappings'],[])
    def test_modified_baseline_and_missing_route_are_rejected(self):
        self.put(self.old,'kept/index.html','modified')
        with self.assertRaisesRegex(ValueError,'Baseline bytes'):self.assemble()
    def test_old_topic_scope_preserved_but_new_topic_blocks(self):
        self.put(self.old,'kept/index.html','<h1>PersonalOS</h1>')
        self.baseline['files']=h.inventory(self.old)
        out,manifest=self.assemble(name='topic-old')
        result=h.validate_content(out,self.root/'old-topic-report.json')
        self.assertEqual(result['status'],'pass')
        self.assertTrue(result['preserved_baseline_topic_findings'])
        self.put(self.new,'index.html','<h1>PersonalOS</h1><script src="/assets/new.js"></script>')
        out,manifest=self.assemble(name='topic-new')
        with self.assertRaisesRegex(ValueError,'content gate failed'):h.validate_content(out,self.root/'new-topic-report.json')
    def test_credentials_in_retained_baseline_still_block(self):
        self.put(self.old,'kept/index.html','<p>'+('sk-'+'X'*24)+'</p>')
        self.baseline['files']=h.inventory(self.old)
        out,manifest=self.assemble(name='secret-old')
        with self.assertRaisesRegex(ValueError,'content gate failed'):h.validate_content(out,self.root/'secret-topic-report.json')
    def test_location_exclusion_scope_preserved_but_new_blocks(self):
        self.put(self.old,'kept/index.html','<p>V:\\Personal\\Fixture</p>')
        self.baseline['files']=h.inventory(self.old)
        out,_=self.assemble(name='old-location')
        self.assertEqual(h.validate_content(out,self.root/'old-location-report.json')['status'],'pass')
        self.put(self.new,'index.html','<p>V:\\Personal\\Fixture</p><script src="/assets/new.js"></script>')
        out,_=self.assemble(name='new-location')
        with self.assertRaisesRegex(ValueError,'content gate failed'):h.validate_content(out,self.root/'new-location-report.json')
    def evidence(self):
        raw=self.root/'raw';raw.mkdir();source=self.put(self.root,'page.json',json.dumps({'source_url':'/'}))
        image=self.put(self.root,'original.png','synthetic image bytes')
        html=self.put(raw,'index.html','raw verified page')
        build=self.put(raw,'build.json',json.dumps({'source_hash':h.digest(source),'assembly':{'strict':True},'inputs':[{'path':str(image),'sha256':h.digest(image)}]}))
        verify=self.root/'verification'/'latest';verify.mkdir(parents=True)
        h.write(verify/'run.json',{'started_at_beijing':'2026-10-02T19:00:00+08:00','initial_urls':['/'],'pages':1,'completed_pages':1,'workers':6,'external_http':True,'changed_pages':0,'tool_changed_during_run':[]})
        h.write(verify/'home.json',{'completed':True,'counts':{},'findings':[]})
        h.write(verify/'inputs-before.json',{'/':{str(x):[x.stat().st_size,x.stat().st_mtime_ns] for x in [html,build,source,image]}})
        approval={'page':'home','page_review_clear':True,'sha256':{image.name:h.digest(image)}}
        status={'build':{'status':'built','source':str(source),'receipt':str(build)},'verification':{'out':str(verify),'completed':True,'command':{'command':['Run-SiteVerify.ps1','-ExternalHttp','-Workers','6','-Only','/']}}}
        return approval,status,raw,{'source_snapshot_files':{'index.html':h.digest(html),'build.json':h.digest(build)}},verify.parent,image
    def test_false_approval_and_stale_verification_rejected(self):
        a,s,r,p,v,image=self.evidence()
        self.assertEqual(h.accept_page(a,s,r,self.new,p,v)[0],'/')
        a['page_review_clear']={'by':'Claude','at_beijing':'2026-10-02T21:28:52+08:00','basis':'整页检查通过'}
        self.assertEqual(h.accept_page(a,s,r,self.new,p,v)[0],'/')
        a['page_review_clear']='true'
        with self.assertRaisesRegex(ValueError,'boolean true'):h.accept_page(a,s,r,self.new,p,v)
        a['page_review_clear']=True;self.put(self.root,'original.png','new image')
        with self.assertRaisesRegex(ValueError,'Approval image differs'):h.accept_page(a,s,r,self.new,p,v)
    def test_newer_failed_formal_run_supersedes_old_zero(self):
        a,s,r,p,v,image=self.evidence();new=v/'newer';new.mkdir()
        h.write(new/'run.json',{'started_at_beijing':'2026-10-02T20:00:00+08:00','initial_urls':['/'],'pages':1,'completed_pages':0})
        with self.assertRaisesRegex(ValueError,'latest formal'):h.accept_page(a,s,r,self.new,p,v)
    def test_two_generation_git_restore_is_exact(self):
        repo=self.root/'git';repo.mkdir()
        def git(*args):return subprocess.check_output(['git',*args],cwd=repo,text=True).strip()
        git('init','-q');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid')
        git('config','core.autocrlf','true')
        self.put(repo,'.gitattributes','site-release/** -text\n')
        first,m=self.assemble(name='generation-one');import shutil;shutil.copytree(first,repo/'site-release')
        git('add','.gitattributes','site-release');git('commit','-qm','first');first_ref=git('rev-parse','HEAD')
        self.put(self.new,'index.html','<script src="/assets/new.js"></script><h1>Second generation</h1>')
        second,m=self.assemble(name='generation-two');shutil.copytree(second,repo/'site-release',dirs_exist_ok=True)
        git('add','site-release');git('commit','-qm','second');second_ref=git('rev-parse','HEAD')
        previous=h.ROOT;h.ROOT=repo
        try:
            for ref,original,label in [(first_ref,first,'one'),(second_ref,second,'two')]:
                restored=self.root/('restored-'+label);h.restore_git(ref,restored)
                self.assertEqual(h.inventory(restored),h.inventory(original))
                self.assertEqual((restored/h.MANIFEST).read_bytes(),(original/h.MANIFEST).read_bytes())
        finally:h.ROOT=previous

if __name__=='__main__':unittest.main()

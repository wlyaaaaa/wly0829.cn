import importlib.util
import json
import os
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

if __name__=='__main__':unittest.main()

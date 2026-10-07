"""Native network evidence: declared navigation discards never hide real errors."""
import argparse,asyncio,copy,hashlib,http.server,importlib.util,json,os,subprocess,tempfile,threading,unittest
from pathlib import Path
from unittest import mock

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('test_native_network',ROOT/'scripts/verify-oss-browser-network.py')
network=importlib.util.module_from_spec(spec)
spec.loader.exec_module(network)

class OssBrowserNetworkTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.allowed=Path(os.environ['TEMP']).resolve()
        cls.folder=Path(tempfile.mkdtemp(prefix='oss-network-controls-',dir=cls.allowed))

    @classmethod
    def tearDownClass(cls):
        result=subprocess.run(['pwsh','-NoProfile','-File','E:/.agents/tools/Move-TaskItemToRecycleBin.ps1',
            '-LiteralPath',str(cls.folder),'-AllowedRoot',str(cls.allowed),'-Json'],capture_output=True,text=True,
            encoding='utf8',creationflags=subprocess.CREATE_NO_WINDOW)
        receipt=json.loads(result.stdout.lstrip('\ufeff'))
        if result.returncode or receipt.get('status')!='recycled' or not receipt.get('original_path_verified') or not receipt.get('recovery_item_exists'):
            raise AssertionError('Task fixture recycle was not verified')

    def setUp(self):
        (self.folder/'alias.html').write_text('<head><title>Alias</title><meta http-equiv="refresh" content="0; url=/home.html"></head>',encoding='utf8')
        (self.folder/'home.html').write_text('<head><title>Target</title></head>',encoding='utf8')
        self.docs={'/alias.html':'alias.html','/home.html':'home.html'}
        self.manifest={'files':{rel:{'sha256':hashlib.sha256((self.folder/rel).read_bytes()).hexdigest()}for rel in self.docs.values()},
                       'oss':{'objects':{'old.js':{'url':'https://fixture.invalid/old.js'}}}}
        self.contract=network.compat_contract(self.folder,self.manifest,self.docs,'/alias.html')
        c=self.contract
        self.row={'route':'/alias.html','final_document':{'url':c['target_url'],'title':c['target_title']},
            'documents':[{'url':c['initial_url'],'http':200,'sha256':c['initial_sha256'],'verified':True},
                         {'url':c['target_http_url'],'http':200,'sha256':c['target_sha256'],'verified':True}],
            'requests':[{'request_id':'initial','url':c['initial_url'],'method':'GET','type':'Document','loader_id':'old','frame_id':'top','timestamp':90},
                        {'request_id':'target','url':c['target_http_url'],'method':'GET','type':'Document','loader_id':'new','frame_id':'top','timestamp':100,'finished_timestamp':100.1},
                        {'request_id':'resource','url':'https://fixture.invalid/old.js','method':'GET','type':'Script','loader_id':'old','frame_id':'top','timestamp':100.2}],
            'frame_navigations':[{'frame_id':'top','loader_id':'old','url':c['initial_url'],'parent_id':None},
                                 {'frame_id':'top','loader_id':'new','url':c['target_url'],'parent_id':None}],
            'navigation_requests':[{'frame_id':'top','url':c['target_url'],'reason':'metaTagRefresh'}],
            'lifecycle_events':[{'frame_id':'top','loader_id':'new','name':'DOMContentLoaded','timestamp':101}],
            'responses':[],'http_response_extra':[],'loading_failed':[{'requestId':'resource','url':'https://fixture.invalid/old.js',
                'errorText':'net::ERR_ABORTED','canceled':True,'timestamp':100.5}],
            'issues':[],'http_failures':[],'page_errors':[]}

    def test_exact_transition_uses_real_dcl_after_network_finish_and_preserves_raw(self):
        before=copy.deepcopy(self.row)
        result=network.blocking_events(self.row,self.contract,self.manifest)
        self.assertEqual(result['blocking_loading_failed'],[])
        self.assertEqual(len(result['expected_navigation_cancellations']),1)
        self.assertEqual(self.row,before)

    def test_missing_or_wrong_identity_sha_target_and_document_clock_never_exempt(self):
        variants=[
            ('loader absent',lambda r:r['requests'][0].pop('loader_id')),
            ('target URL',lambda r:r['final_document'].update(url='https://wly0829.cn/wrong/')),
            ('title',lambda r:r['final_document'].update(title='Wrong')),
            ('initial SHA',lambda r:r['documents'][0].update(sha256='wrong')),
            ('terminal SHA',lambda r:r['documents'][1].update(sha256='wrong')),
            ('document 403',lambda r:r['documents'][1].update(http=403)),
            ('frame commit',lambda r:r.update(frame_navigations=[])),
            ('not meta refresh',lambda r:r['navigation_requests'][0].update(reason='scriptInitiated')),
            ('missing DCL',lambda r:r.update(lifecycle_events=[])),
            ('duplicate DCL',lambda r:r['lifecycle_events'].append(dict(r['lifecycle_events'][0]))),
            ('old DCL loader',lambda r:r['lifecycle_events'][0].update(loader_id='old')),
            ('subframe DCL',lambda r:r['lifecycle_events'][0].update(frame_id='child'))]
        for label,change in variants:
            with self.subTest(label=label):
                row=copy.deepcopy(self.row);change(row)
                result=network.blocking_events(row,self.contract,self.manifest)
                self.assertEqual(result['blocking_loading_failed'],row['loading_failed'])

    def test_true_failures_other_loader_subframe_and_window_edges_never_exempt(self):
        variants=[
            ('target loader',lambda r:r['requests'][2].update(loader_id='new')),
            ('subframe',lambda r:r['requests'][2].update(frame_id='child')),
            ('empty response',lambda r:r['loading_failed'][0].update(errorText='net::ERR_EMPTY_RESPONSE',canceled=False)),
            ('CSP',lambda r:r['loading_failed'][0].update(blockedReason='csp')),
            ('before target request',lambda r:r['loading_failed'][0].update(timestamp=99)),
            ('after DCL',lambda r:r['loading_failed'][0].update(timestamp=102)),
            ('HTTP 403',lambda r:r['responses'].append({'request_id':'resource','http':403})),
            ('HTTP 404 extra',lambda r:r['http_response_extra'].append({'request_id':'resource','http':404}))]
        for label,change in variants:
            with self.subTest(label=label):
                row=copy.deepcopy(self.row);change(row)
                self.assertEqual(network.blocking_events(row,self.contract,self.manifest)['blocking_loading_failed'],row['loading_failed'])

    def test_body_loss_http_pageerror_and_other_issues_remain_raw_and_blocking(self):
        self.row['issues']=['Actual browser body unavailable: sealed.js Protocol error (Network.getResponseBody): No resource with given identifier found',
                            'Static browser resource did not use sealed OSS: homepage.avif']
        self.row['http_failures']=[{'url':'homepage.avif','http':404}]
        self.row['page_errors']=['real page failure']
        before=copy.deepcopy(self.row)
        result=network.blocking_events(self.row,self.contract,self.manifest)
        self.assertEqual(result['blocking_issues'],self.row['issues'])
        self.assertEqual(self.row,before)

    def test_unregistered_delayed_external_cycle_ambiguous_missing_title_and_multihop_declarations(self):
        for content in ['5; url=/home.html','0; url=https://example.invalid/','0; url=/missing/','0; url=/alias.html']:
            with self.subTest(content=content):
                (self.folder/'alias.html').write_text('<meta http-equiv="refresh" content="'+content+'">',encoding='utf8')
                self.assertIsNone(network.compat_contract(self.folder,self.manifest,self.docs,'/alias.html'))
        (self.folder/'alias.html').write_text('<meta http-equiv="refresh" content="0; url=/home.html"><meta http-equiv="refresh" content="0; url=/home.html">',encoding='utf8')
        self.assertIsNone(network.compat_contract(self.folder,self.manifest,self.docs,'/alias.html'))
        (self.folder/'alias.html').write_text('<meta http-equiv="refresh" content="0; url=/home.html">',encoding='utf8')
        (self.folder/'home.html').write_text('<head><title></title></head>',encoding='utf8')
        self.assertIsNone(network.compat_contract(self.folder,self.manifest,self.docs,'/alias.html'))
        (self.folder/'home.html').write_text('<head><title>Target</title><meta http-equiv="refresh" content="0; url=/alias.html"></head>',encoding='utf8')
        self.assertIsNone(network.compat_contract(self.folder,self.manifest,self.docs,'/alias.html'))

    def test_query_fragment_target_is_exact_and_wrong_query_gets_no_exception(self):
        (self.folder/'alias.html').write_text('<meta http-equiv="refresh" content="0; url=/home.html?q=correct#anchor">',encoding='utf8')
        contract=network.compat_contract(self.folder,self.manifest,self.docs,'/alias.html')
        self.assertEqual(contract['target_http_url'],'https://wly0829.cn/home.html?q=correct')
        row=copy.deepcopy(self.row)
        row['final_document']['url']='https://wly0829.cn/home.html?q=wrong#anchor'
        self.assertEqual(network.blocking_events(row,contract,self.manifest)['blocking_loading_failed'],row['loading_failed'])

    def test_summary_distinguishes_raw_and_blocking_and_status_requires_exact_get_200(self):
        self.row.update(network.blocking_events(self.row,self.contract,self.manifest));self.row['status']='pass'
        result=network.summarize([self.row],'https://fixture.invalid')
        self.assertEqual(result['loading_failed'],1)
        self.assertEqual(result['blocking_loading_failed'],0)
        self.assertEqual(result['expected_navigation_cancellations'],1)
        self.assertFalse(network.status_get_succeeded({'method':'GET','url':network.STATUS_URL,'response_url':network.STATUS_URL,'response_http':403}))
        self.assertTrue(network.status_get_succeeded({'method':'GET','url':network.STATUS_URL,'response_url':network.STATUS_URL,'response_http':200}))
        self.assertTrue(network.status_get_succeeded({'method':'GET','url':'https://live.wly0829.cn/computer-access/state','response_url':'https://live.wly0829.cn/computer-access/state','response_http':200}))
        self.assertFalse(network.status_get_succeeded({'method':'GET','url':'https://live.wly0829.cn/computer-access/state','response_url':network.STATUS_URL,'response_http':200}))

    def test_validator_recomputes_scope_and_rejects_forged_classification_counts_and_body_errors(self):
        base='https://fixture.invalid'
        self.manifest.update(release_id='control-release')
        self.manifest['oss'].update(asset_base_url=base,prefix='controls')
        plan={'asset_base_url':base,'source_release_id':'control-source'}
        network.oss.write(self.folder/network.oss.PLAN,plan)
        network.oss.write(self.folder/network.oss.MANIFEST,self.manifest)
        alias=copy.deepcopy(self.row);alias.update(status='pass',oss_http_403=0,declared_oss_static=False,static_bodies=[])
        alias.update(network.blocking_events(alias,self.contract,self.manifest))
        home={'route':'/home.html','status':'pass','issues':[],'loading_failed':[],'http_failures':[],'page_errors':[],
              'requests':[],'responses':[],'http_response_extra':[],'oss_http_403':0,'declared_oss_static':False,'static_bodies':[],
              'documents':[{'url':self.contract['target_http_url'],'http':200,'sha256':self.contract['target_sha256'],'verified':True}]}
        home.update(network.blocking_events(home,None,self.manifest))
        report={'schema':network.SCHEMA,'status':'pass','mode':'candidate','method':network.METHOD,'origin':network.ORIGIN,
                'oss_asset_base_url':base,'release_id':'control-release','source_release_id':'control-source',
                'plan_sha256':network.oss.digest(self.folder/network.oss.PLAN),
                'manifest_sha256':network.oss.digest(self.folder/network.oss.MANIFEST),'routes':list(self.docs),
                'profile_cleanup':{'verified':True},'pages':[alias,home],'summary':network.summarize([alias,home],base)}
        path=self.folder/'receipt.json'
        with mock.patch.object(network,'artifact',return_value=(plan,self.manifest,self.folder,self.docs)):
            network.oss.write(path,report)
            self.assertEqual(network.validate_receipt(self.folder,path,'candidate',self.folder)['status'],'pass')
            mutations=[
                ('missing loader',lambda r:r['pages'][0]['requests'][0].pop('loader_id')),
                ('raw count forged zero',lambda r:r['summary'].update(loading_failed=0)),
                ('body missing falsely cleared',lambda r:r['pages'][0]['issues'].append('Actual browser body unavailable: old.js No resource')),
                ('CSP falsely classified',lambda r:r['pages'][0]['loading_failed'][0].update(blockedReason='csp')),
                ('HTTP404 target',lambda r:r['pages'][0]['http_failures'].append({'url':'target-image','http':404})),
                ('omit route',lambda r:r['pages'].pop())]
            for label,change in mutations:
                with self.subTest(label=label):
                    corrupted=copy.deepcopy(report);change(corrupted);network.oss.write(path,corrupted)
                    with self.assertRaises(ValueError):network.validate_receipt(self.folder,path,'candidate',self.folder)

    def test_candidate_native_shared_cache_body_once_and_retry_only_failed_route(self):
        payload=b'window.nativeCacheProbe=true;'; hits=[]
        class Handler(http.server.BaseHTTPRequestHandler):
            def do_GET(handler):
                hits.append(handler.path); handler.send_response(200)
                handler.send_header('Content-Type','application/javascript')
                handler.send_header('Cache-Control','public,max-age=31536000,immutable')
                handler.send_header('Content-Length',str(len(payload))); handler.end_headers(); handler.wfile.write(payload)
            def log_message(handler,*args): pass
        server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
        thread=threading.Thread(target=server.serve_forever,daemon=True); thread.start()
        origin='http://127.0.0.1:'+str(server.server_port); url=origin+'/controls/asset.js'
        docs={'/one.html':'one.html','/two.html':'two.html'}
        for rel in docs.values():
            (self.folder/rel).write_text('<head><title>Probe</title></head><script src="'+url+'"></script>',encoding='utf8')
        manifest={'release_id':'cache-release','files':{rel:{'sha256':network.oss.digest(self.folder/rel)} for rel in docs.values()},
                  'oss':{'asset_base_url':origin,'prefix':'controls','objects':{'asset.js':
                         {'url':url,'bytes':len(payload),'sha256':hashlib.sha256(payload).hexdigest()}}}}
        plan={'asset_base_url':origin,'source_release_id':'cache-source'}
        network.oss.write(self.folder/network.oss.PLAN,plan); network.oss.write(self.folder/network.oss.MANIFEST,manifest)
        args=argparse.Namespace(preparation=self.folder,release=self.folder,mode='candidate',output=self.folder/'cache-first.json',
            task_cache=self.folder/'cache',chrome=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'),route_timeout=10,
            retry_failed=None,cold_cache=False,confirm_download_over_5gb=False)
        try:
            with mock.patch.object(network,'ORIGIN',origin), mock.patch.object(network,'artifact',return_value=(plan,manifest,self.folder,docs)), \
                 mock.patch.object(network.oss,'urlopen',side_effect=AssertionError('No second native GET')):
                self.assertEqual(asyncio.run(network.run(args)),0)
                first=network.oss.read(args.output)
                self.assertEqual(hits.count('/controls/asset.js'),1)
                self.assertEqual(sum(body.get('reused',False) for row in first['pages'] for body in row['static_bodies']),1)
                self.assertGreater(first['oss_download_bytes'],0)
                first['status']='fail'; first['pages'][1]['status']='fail'; first['pages'][1]['issues'].append('Fixture route failure')
                first['pages'][1].update(network.blocking_events(first['pages'][1],None,manifest))
                first['summary']=network.summarize(first['pages'],origin); network.oss.write(args.output,first)
                args.retry_failed=args.output; args.output=self.folder/'cache-retry.json'
                self.assertEqual(asyncio.run(network.run(args)),0)
                retry=network.oss.read(args.output)
                self.assertEqual(hits.count('/controls/asset.js'),2)
                self.assertEqual([row['route'] for row in retry['pages']],list(docs))
                self.assertEqual(retry['pages'][0],first['pages'][0])
                self.assertEqual(retry['retry_receipt']['sha256'],network.oss.digest(args.retry_failed))
                broken=copy.deepcopy(first); broken['manifest_sha256']='wrong'; network.oss.write(args.retry_failed,broken)
                with self.assertRaises(ValueError):network.validate_receipt(self.folder,args.retry_failed,'candidate',self.folder,allow_failed=True)
        finally: server.shutdown(); server.server_close(); thread.join(timeout=5)

if __name__=='__main__':unittest.main()

"""OSS policy rewriting, precise fallback semantics and manifest route coverage."""
import importlib.util
import asyncio
import hashlib
import contextlib
import json
import os
from pathlib import Path
import unittest
from unittest import mock
import uuid

ROOT = Path(__file__).resolve().parents[1]


def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/filename)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module


oss = load('csp_oss', 'prepare-oss-release.py')
network = load('csp_network', 'verify-oss-browser-network.py')
audit = load('csp_audit', 'prepare-audit-release.py')
BASE = 'https://fixture-bucket.oss-cn-shanghai.aliyuncs.com'


class OssCspTests(unittest.TestCase):
    def test_v5_image_preload_uses_existing_csp_and_referrer_rules(self):
        text=(b'<html><head><meta http-equiv="Content-Security-Policy" '
              b'content="default-src \'self\'; img-src \'self\'; script-src \'self\' \'nonce-existing\'; '
              b'style-src \'self\'; connect-src https://service.example; worker-src \'self\' blob:; '
              b'base-uri \'self\'; form-action \'self\'">'
              b'<link rel="preload" as="image" imagesrcset="/shot.avif 1920w" referrerpolicy="no-referrer"></head></html>')
        files={'shot.avif':{}}
        legacy=oss.Rewriter(files,BASE,'releases/current','https://wly0829.cn',version=4)
        current=oss.Rewriter(files,BASE,'releases/current','https://wly0829.cn',version=5)
        self.assertEqual(legacy.rewrite(text,'index.html'),text)
        rewritten=current.rewrite(text,'index.html').decode('utf8')
        policy=self.policies(rewritten)[0]
        self.assertIn("img-src 'self' "+BASE,policy)
        for directive in ("script-src 'self' 'nonce-existing'","style-src 'self'",
                          "connect-src https://service.example","worker-src 'self' blob:",
                          "base-uri 'self'","form-action 'self'"):
            self.assertIn(directive,policy)
        self.assertIn('referrerpolicy="'+oss.OSS_REFERRER_POLICY+'"',rewritten)
        self.assertIn('<meta name="referrer" content="'+oss.OSS_REFERRER_POLICY+'">',rewritten)

    def rewriter(self, files, **kwargs):
        return oss.Rewriter(dict.fromkeys(files, {}), BASE, 'releases/current', 'https://wly0829.cn', version=4, **kwargs)

    def policies(self, text):
        return [attrs['content'] for tag, attrs, raw, offset in oss.HtmlTags(text).tags
                if tag == 'meta' and attrs.get('http-equiv','').lower() == 'content-security-policy']

    def test_every_real_meta_preserves_nonce_and_unrelated_directives(self):
        text = ('<!-- <meta http-equiv="Content-Security-Policy" content="default-src none"> -->'
                '<meta content="default-src \'self\'; script-src \'self\' \'nonce-abc\'; object-src \'none\'; base-uri \'none\'" http-equiv="Content-Security-Policy">'
                '<meta HTTP-EQUIV="content-security-policy" content="default-src \'self\'; script-src-elem \'self\'; connect-src https://service.example">'
                '<script src="/main.js" nonce="abc"></script><img src="/shot.png">')
        rewritten = self.rewriter(['main.js','shot.png']).rewrite(text.encode(), 'index.html').decode()
        policies = self.policies(rewritten)
        self.assertEqual(len(policies), 2)
        self.assertIn("script-src 'self' 'nonce-abc' " + BASE, policies[0])
        self.assertIn("object-src 'none'; base-uri 'none'", policies[0])
        self.assertIn("script-src-elem 'self' " + BASE, policies[1])
        self.assertIn('connect-src https://service.example', policies[1])
        self.assertTrue(all("img-src 'self' " + BASE in policy for policy in policies))
        self.assertTrue(all("default-src 'self'" in policy for policy in policies))
        self.assertNotIn('style-src', rewritten)
        self.assertNotIn('font-src', rewritten)
        self.assertIn('content="default-src none"', rewritten)  # The comment remains untouched.

    def test_css_and_js_closure_adds_only_needed_resource_categories(self):
        root = Path(os.environ.get('TEMP',ROOT/'.test-tmp'))/('csp-test-'+uuid.uuid4().hex)
        root.parent.mkdir(parents=True,exist_ok=True)
        root.mkdir()
        (root/'main.js').write_text('import "./helper.js";fetch("./routes.json");',encoding='utf8')
        (root/'helper.js').write_text('const image="./shot.png";',encoding='utf8')
        (root/'main.css').write_text('@import "./extra.css";',encoding='utf8')
        (root/'extra.css').write_text('@font-face{src:url(./body.woff2)}',encoding='utf8')
        files=['main.js','helper.js','routes.json','shot.png','main.css','extra.css','body.woff2']
        for name in ('routes.json','shot.png','body.woff2'):
            (root/name).write_bytes(b'{}' if name.endswith('.json') else b'opaque test binary')
        text = ('<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; style-src \'self\' \'unsafe-inline\'; media-src \'none\'">'
                '<link rel="stylesheet" href="/main.css"><script src="/main.js"></script>')
        rewritten = self.rewriter(files, source_root=root).rewrite(text.encode(), 'index.html').decode()
        policy = self.policies(rewritten)[0]
        for directive in ('script-src','img-src','font-src','connect-src'):
            self.assertIn(directive + " 'self' " + BASE, policy)
        self.assertIn("style-src 'self' 'unsafe-inline' " + BASE, policy)
        self.assertIn("media-src 'none'", policy)

    def test_page_without_loadable_assets_does_not_add_domains(self):
        text = ('<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">'
                '<a href="/shot.png">download</a><meta property="og:image" content="/shot.png">')
        rewritten = self.rewriter(['shot.png']).rewrite(text.encode(), 'index.html').decode()
        self.assertEqual(self.policies(text), self.policies(rewritten))
        self.assertEqual(oss.csp_with_sources("object-src 'none'", {'script':{BASE}}), "object-src 'none'")
        self.assertEqual(oss.csp_with_sources('default-src https:', {'script':{BASE}}), 'default-src https:')

    def test_unquoted_policy_and_greater_than_inside_attribute_use_actual_html_spans(self):
        text = ('<meta title="A > B" http-equiv=Content-Security-Policy content=default-src>'
                '<script src="/main.js"></script>')
        rewritten = self.rewriter(['main.js']).rewrite(text.encode(),'index.html').decode()
        self.assertIn('title="A > B"',rewritten)
        self.assertIn('script-src '+BASE,self.policies(rewritten)[0])

    def test_legacy_versions_replay_the_original_policy_and_new_none_becomes_exact(self):
        text = b'<meta http-equiv="Content-Security-Policy" content="img-src \'none\'; default-src \'self\'"><img src="/shot.png">'
        for version in (1,2,3):
            rewrite = oss.Rewriter({'shot.png':{}}, BASE, 'releases/current', 'https://wly0829.cn', version=version)
            self.assertIn(b"img-src 'none'", rewrite.rewrite(text,'index.html'))
        current = self.rewriter(['shot.png']).rewrite(text,'index.html').decode()
        self.assertIn('img-src ' + BASE, self.policies(current)[0])
        self.assertNotIn("img-src 'none'", current)

    def test_native_gate_keeps_all_failed_events_and_resolves_alias_documents(self):
        rows = [{'status':'fail','loading_failed':[{'blockedReason':'csp'},{'errorText':'net::ERR_ABORTED','canceled':True}],
                 'http_failures':[{'http':404}],'page_errors':['execution failed']}]
        self.assertEqual(network.summarize(rows,BASE), {'routes':1,'passed':0,'csp_blocked':1,'loading_failed':2,
            'blocking_loading_failed':2,'expected_navigation_cancellations':0,'http_failures':1,'oss_http_403':0,'page_errors':1})
        self.assertTrue(network.is_csp_failure({'type':'Document','errorText':'net::ERR_BLOCKED_BY_CSP'}))
        self.assertEqual(network.route_file('/how-this-site/'), 'how-this-site/index.html')
        self.assertEqual(network.route_file('/404.html'), '404.html')
        for route in ('https://other.example/', '/../escape/', '/how/?fixture=1'):
            with self.assertRaises(ValueError): network.route_file(route)

    def test_oss_consumers_have_consistent_meta_and_resource_override_policies(self):
        text = ('<html><head><meta name="referrer" content="no-referrer"><meta NAME=referrer>'
                '<meta http-equiv="Content-Security-Policy" content="script-src \'self\' \'nonce-abc\'; object-src \'none\'"></head>'
                '<link rel="stylesheet" href="/site.css" referrerpolicy=no-referrer>'
                '<script src="/main.js" referrerpolicy="same-origin" nonce="abc"></script>'
                '<img src="/shot.png" referrerpolicy="no-referrer">'
                '<iframe src="https://grafana.wly0829.cn/" referrerpolicy="no-referrer"></iframe></html>')
        rewrite = self.rewriter(['site.css','main.js','shot.png'])
        value = rewrite.rewrite(text.encode(),'index.html').decode()
        tags = oss.HtmlTags(value).tags
        self.assertEqual([attrs['content'] for tag,attrs,raw,offset in tags if tag=='meta' and attrs.get('name','').lower()=='referrer'],[oss.OSS_REFERRER_POLICY]*2)
        self.assertEqual([attrs['referrerpolicy'] for tag,attrs,raw,offset in tags if tag in ('link','script','img')],[oss.OSS_REFERRER_POLICY]*3)
        self.assertEqual(next(attrs['referrerpolicy'] for tag,attrs,raw,offset in tags if tag=='iframe'),'no-referrer')
        self.assertIn("'nonce-abc'",value);self.assertIn('nonce="abc"',value)
        self.assertIn("object-src 'none'",value)
        self.assertEqual(sum(row['kind']=='html_oss_referrer_policy' for row in rewrite.changes['index.html']),5)

    def test_explicit_referrer_is_added_for_inline_and_already_oss_consumers_only(self):
        for fragment in ('<style>div{background:url(/shot.png)}</style>', '<script>const shot="/shot.png";</script>',
                         '<img src="'+BASE+'/releases/old/shot.png">'):
            value=self.rewriter(['shot.png']).rewrite(('<head></head>'+fragment).encode(),'index.html').decode()
            self.assertTrue(value.startswith('<head><meta name="referrer" content="'+oss.OSS_REFERRER_POLICY+'">'))
        text='<head><meta name="referrer" content="no-referrer"></head><a href="https://other.example/">ordinary navigation</a><meta property="og:image" content="'+BASE+'/shot.png">'
        self.assertEqual(self.rewriter([]).rewrite(text.encode(),'index.html'),text.encode())
        for version in (1,2,3):
            rewrite=oss.Rewriter({'shot.png':{}},BASE,'releases/current',network.ORIGIN,version=version)
            value=rewrite.rewrite(b'<meta name="referrer" content="no-referrer"><img src="/shot.png" referrerpolicy="no-referrer">','index.html')
            self.assertEqual(value.count(b'no-referrer'),2)

    def test_referrer_body_and_release_identity_follow_existing_manifest_binding(self):
        root=Path(os.environ.get('TEMP',ROOT/'.test-tmp'))/('referrer-manifest-test-'+uuid.uuid4().hex)
        source=root/'source';source.mkdir(parents=True)
        text='<head><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="script-src \'self\' '+BASE+'"></head><script src="/main.js"></script>'
        (source/'index.html').write_text(text,encoding='utf8');(source/'main.js').write_bytes(b'export const value=1;')
        oss.write(source/oss.MANIFEST,{'schema':'wly.hybrid-release.v1','release_id':'source-referrer-test','files':oss.inventory(source),'routes':['/']})
        old=oss.prepare(source,BASE,'releases/current',root/'v3',rewriter_version=3)
        new=oss.prepare(source,BASE,'releases/current',root/'v4',rewriter_version=4)
        self.assertNotEqual(old['release_id'],new['release_id'])
        self.assertEqual(old['objects'],new['objects'])
        manifest=oss.read(root/'v4/github'/oss.MANIFEST)
        body=root/'v4/github/index.html'
        self.assertEqual(manifest['files']['index.html'],{'bytes':body.stat().st_size,'sha256':oss.digest(body)})
        self.assertEqual(new['github_files']['index.html'],manifest['files']['index.html'])
        self.assertTrue(any(row['kind']=='html_oss_referrer_policy' for row in new['url_changes']['index.html']))
        self.assertEqual((source/'index.html').read_text('utf8'),text)
        oss.verify_local(root/'v3');oss.verify_local(root/'v4')
        body.write_text(body.read_text('utf8').replace(oss.OSS_REFERRER_POLICY,'no-referrer'),encoding='utf8')
        with self.assertRaisesRegex(ValueError,'inventory/bytes changed'):oss.verify_local(root/'v4')

    def test_oss_403_counter_cannot_hide_a_real_forbidden_response(self):
        row={'route':'/computer-access/','responses':[{'url':BASE+'/asset.js','http':403},{'url':'https://service.example/api/status','http':403}],
             'http_failures':[],'loading_failed':[],'page_errors':[],'status':'pass','oss_http_403':0}
        with self.assertRaisesRegex(ValueError,'counter differs'):network.verify_oss_403(row,BASE)
        row['oss_http_403']=1
        with self.assertRaisesRegex(ValueError,'Actual OSS HTTP 403'):network.verify_oss_403(row,BASE)
        self.assertEqual(network.summarize([row],BASE)['oss_http_403'],1)
        row['responses']=row['responses'][1:];row['oss_http_403']=0
        network.verify_oss_403(row,BASE)
        row['http_response_extra']=[{'request_id':'actual','url':BASE+'/asset.js','http':403}]
        with self.assertRaisesRegex(ValueError,'counter differs'):network.verify_oss_403(row,BASE)
        row['responses'].append({'request_id':'actual','url':BASE+'/asset.js','http':403})
        self.assertEqual(network.oss_403_count(row,BASE),1)

    def test_plain_documents_do_not_need_a_synthetic_static_get_and_status_needs_200(self):
        manifest={'oss':{'asset_base_url':BASE,'prefix':'releases/current'}}
        plain=b'<!doctype html><head><link rel="icon" href="data:,"></head><p>Standalone inline frame</p>'
        self.assertFalse(network.declared_oss_static(plain,'frame.html',manifest))
        self.assertTrue(network.declared_oss_static(('<script src="'+BASE+'/releases/current/main.js"></script>').encode(),'index.html',manifest))
        request={'method':'GET','url':network.STATUS_URL,'response_url':network.STATUS_URL,'response_received':True,'response_http':302}
        self.assertFalse(network.status_get_succeeded(request))
        request['response_http']=200;self.assertTrue(network.status_get_succeeded(request))

    @unittest.skipUnless(os.environ.get('OSS_CSP_PROBE_PREPARATION'), 'Explicit real sealed Shanghai preparation is required')
    def test_no_referrer_is_real_403_and_strict_origin_is_real_200_in_chrome(self):
        from playwright.async_api import async_playwright
        preparation=Path(os.environ['OSS_CSP_PROBE_PREPARATION']);manifest=oss.read(preparation/'github'/oss.MANIFEST)
        oss.verify_manifest(manifest);objects=manifest['oss']['objects'];base=manifest['oss']['asset_base_url']
        script=next(rel for rel in objects if rel.startswith('_typeset/runtime/b2-access-model-') and rel.endswith('.js'))
        style=next(rel for rel in objects if rel.startswith('_typeset/runtime/toc-consistency-') and rel.endswith('.css'))
        image='assets/site-icon-32e6a619839d.svg';selected={rel:objects[rel]for rel in (script,style,image)}
        text=('<!doctype html><head><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' '+base+'; style-src \'self\' '+base+'; img-src \'self\' '+base+'; object-src \'none\'">'
              '<link rel="icon" href="/'+image+'"><link rel="stylesheet" href="/'+style+'"><script type="module" src="/'+script+'"></script></head><img src="/'+image+'">')
        legacy=oss.Rewriter(selected,base,manifest['oss']['prefix'],network.ORIGIN,version=3)
        current=oss.Rewriter(selected,base,manifest['oss']['prefix'],network.ORIGIN,version=4)
        docs=(('old_no_referrer',legacy.rewrite(text.encode(),'index.html')),('strict_origin',current.rewrite(text.encode(),'index.html')))
        root=Path(os.environ['TEMP'])/('referrer-chrome-'+uuid.uuid4().hex);root.mkdir();profile=root/'profile'
        evidence={'schema':'wly.oss-referrer-native-control.v1','scope':'Focused native no-referrer/strict-origin control; not a final complete publication gate',
                  'origin':network.ORIGIN,'release_id':manifest['release_id'],'manifest_sha256':oss.digest(preparation/'github'/oss.MANIFEST),'checked_at_beijing':oss.stamp(),'cases':[]}
        async def probe():
            async with async_playwright() as runtime:
                context=await runtime.chromium.launch_persistent_context(str(profile),headless=True,
                    executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',service_workers='block')
                try:
                    for name,document in docs:
                        page=await context.new_page();session=await context.new_cdp_session(page)
                        await session.send('Network.enable');await session.send('Network.setCacheDisabled',{'cacheDisabled':True})
                        case={'name':name,'document_sha256':hashlib.sha256(document).hexdigest(),'requests':{},'responses':[],'http_response_extra':[],'failed':[],'bodies':[]};evidence['cases'].append(case)
                        refs={}
                        def requested(event):
                            identity=event['requestId'];case['requests'][identity]={'request_id':identity,'url':event['request']['url'],'method':event['request']['method'],'referer':refs.get(identity,'')}
                        def headers(event):
                            identity=event['requestId'];refs[identity]=next((value for key,value in event.get('headers',{}).items()if key.lower()=='referer'),'')
                            if identity in case['requests']:case['requests'][identity]['referer']=refs[identity]
                        def response_extra(event):
                            case['http_response_extra'].append({'request_id':event['requestId'],'url':case['requests'].get(event['requestId'],{}).get('url',''),'http':event['statusCode']})
                        session.on('Network.requestWillBeSent',requested);session.on('Network.requestWillBeSentExtraInfo',headers)
                        session.on('Network.responseReceivedExtraInfo',response_extra)
                        session.on('Network.responseReceived',lambda event:case['responses'].append({'request_id':event['requestId'],'url':event['response']['url'],'http':event['response']['status']}))
                        session.on('Network.loadingFailed',lambda event:case['failed'].append(event))
                        tasks=[]
                        async def body(response):
                            expected=next((obj for obj in selected.values()if obj['url']==response.url),None)
                            if expected and response.status==200:
                                payload=await asyncio.wait_for(response.body(),timeout=10)
                                case['bodies'].append({'url':response.url,'http':response.status,'bytes':len(payload),'sha256':hashlib.sha256(payload).hexdigest(),
                                    'verified':len(payload)==expected['bytes'] and hashlib.sha256(payload).hexdigest()==expected['sha256']})
                        page.on('response',lambda response:tasks.append(asyncio.create_task(body(response))))
                        address=network.ORIGIN+'/__referrer-control-'+uuid.uuid4().hex+'/'
                        await page.route(address,lambda route:route.fulfill(status=200,content_type='text/html',body=document))
                        await page.goto(address,wait_until='networkidle',timeout=60000)
                        if tasks:await asyncio.wait_for(asyncio.gather(*tasks),timeout=15)
                        case['actual_origin']=await page.evaluate('location.origin');case['oss_http_403']=network.oss_403_count(case,base)
                        actual=[row for row in case['requests'].values()if row['url'].startswith(base+'/')]
                        self.assertEqual(case['actual_origin'],network.ORIGIN);self.assertTrue(actual)
                        self.assertFalse(any(network.is_csp_failure(event)for event in case['failed']))
                        if name=='old_no_referrer':
                            self.assertGreaterEqual(case['oss_http_403'],3);self.assertTrue(all(row['referer']==''for row in actual));self.assertEqual(case['bodies'],[])
                        else:
                            self.assertEqual(case['oss_http_403'],0);self.assertEqual(case['failed'],[])
                            self.assertTrue(all(row['referer']==network.ORIGIN+'/'for row in actual))
                            self.assertEqual({row['url']for row in case['bodies']},{obj['url']for obj in selected.values()});self.assertTrue(all(row['verified']for row in case['bodies']))
                        await page.close()
                finally:await context.close();evidence['profile_cleanup']=network.recycle_profile(profile,root)
        try:asyncio.run(probe())
        finally:
            destination=Path(os.environ.get('OSS_REFERRER_PROBE_OUTPUT',str(root/'native-referrer-control.json')))
            destination.parent.mkdir(parents=True,exist_ok=True);oss.write(destination,evidence)
        self.assertTrue(evidence['profile_cleanup']['verified'])

    @unittest.skipUnless(os.environ.get('OSS_CSP_PROBE_PREPARATION'), 'Explicit real sealed Shanghai preparation is required')
    def test_old_self_policy_is_rejected_and_exact_policy_loads_real_oss_in_chrome(self):
        """A focused real-HTTPS control, not the final all-route release gate."""
        from playwright.async_api import async_playwright
        preparation = Path(os.environ['OSS_CSP_PROBE_PREPARATION'])
        manifest = oss.read(preparation/'github'/oss.MANIFEST)
        oss.verify_manifest(manifest)
        objects = manifest['oss']['objects']
        script = next(rel for rel in objects if rel.startswith('_typeset/runtime/b2-access-model-') and rel.endswith('.js'))
        style = next(rel for rel in objects if rel.startswith('_typeset/runtime/toc-consistency-') and rel.endswith('.css'))
        image = 'assets/site-icon-32e6a619839d.svg'
        selected = {rel:objects[rel] for rel in (script,style,image)}
        text = ('<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\'; img-src \'self\'; object-src \'none\'">'
                '<link rel="icon" href="/'+image+'"><link rel="stylesheet" href="/'+style+'"><script type="module" src="/'+script+'"></script><img src="/'+image+'">')
        rewrite = oss.Rewriter(selected, manifest['oss']['asset_base_url'], manifest['oss']['prefix'], network.ORIGIN, version=4)
        positive = rewrite.rewrite(text.encode(),'index.html')
        legacy = oss.Rewriter(selected, manifest['oss']['asset_base_url'], manifest['oss']['prefix'], network.ORIGIN, version=3)
        negative = legacy.rewrite(text.encode(),'index.html')
        root = Path(os.environ['TEMP'])/('csp-chrome-'+uuid.uuid4().hex)
        root.mkdir()
        profile = root/'profile'
        evidence = {'schema':'wly.oss-csp-native-control.v1', 'method':network.METHOD,
                    'scope':'Focused script/style/image negative and positive control; not a final all-route pre/post publication gate',
                    'release_id':manifest['release_id'],'manifest_sha256':oss.digest(preparation/'github'/oss.MANIFEST),
                    'origin':network.ORIGIN,'checked_at_beijing':oss.stamp(),'cases':[]}
        async def probe():
            async with async_playwright() as runtime:
                context = await runtime.chromium.launch_persistent_context(str(profile),headless=True,
                    executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',service_workers='block')
                try:
                    for name,document in (('old_self',negative),('exact_oss',positive)):
                        page = await context.new_page()
                        session = await context.new_cdp_session(page)
                        await session.send('Network.enable')
                        await session.send('Network.setCacheDisabled',{'cacheDisabled':True})
                        case = {'name':name,'document_sha256':hashlib.sha256(document).hexdigest(),'failed':[],'requests':[],'bodies':[],'page_errors':[]}
                        evidence['cases'].append(case)
                        session.on('Network.loadingFailed',lambda event:case['failed'].append(event))
                        session.on('Network.requestWillBeSent',lambda event:case['requests'].append({'url':event['request']['url'],'method':event['request']['method']}))
                        page.on('pageerror',lambda error:case['page_errors'].append(str(error)))
                        tasks=[]
                        async def body(response):
                            expected=next((obj for obj in selected.values() if obj['url']==response.url),None)
                            if expected:
                                payload=await response.body()
                                case['bodies'].append({'url':response.url,'http':response.status,'bytes':len(payload),'sha256':hashlib.sha256(payload).hexdigest(),
                                    'verified':response.status==200 and len(payload)==expected['bytes'] and hashlib.sha256(payload).hexdigest()==expected['sha256']})
                        page.on('response',lambda response:tasks.append(asyncio.create_task(body(response))))
                        address=network.ORIGIN+'/__oss-csp-control-'+uuid.uuid4().hex+'/'
                        async def document_only(route):
                            self.assertEqual(route.request.resource_type,'document')
                            await route.fulfill(status=200,content_type='text/html',body=document)
                        await page.route(address,document_only)
                        await page.goto(address,wait_until='networkidle',timeout=60000)
                        if tasks: await asyncio.gather(*tasks)
                        case['actual_origin']=await page.evaluate('location.origin')
                        self.assertEqual(case['actual_origin'],network.ORIGIN)
                        self.assertEqual(case['page_errors'],[])
                        if name=='old_self':
                            self.assertGreaterEqual(len([event for event in case['failed'] if event.get('blockedReason')=='csp']),3)
                            self.assertEqual(case['bodies'],[])
                        else:
                            self.assertEqual(case['failed'],[])
                            self.assertEqual({row['url'] for row in case['bodies']},{obj['url'] for obj in selected.values()})
                            self.assertTrue(all(row['verified'] for row in case['bodies']))
                        await page.close()
                finally:
                    await context.close()
                    evidence['profile_cleanup']=network.recycle_profile(profile,root)
        try: asyncio.run(probe())
        finally:
            destination = Path(os.environ.get('OSS_CSP_PROBE_OUTPUT',str(root/'native-control.json')))
            destination.parent.mkdir(parents=True,exist_ok=True); oss.write(destination,evidence)
        self.assertTrue(evidence['profile_cleanup']['verified'])


class MetadataHotfixBaselineTests(unittest.TestCase):
    """The approved production metadata delta cannot excuse other source drift."""
    def setUp(self):
        self.root=Path(os.environ.get('TEMP',ROOT/'.test-tmp'))/('hotfix-baseline-test-'+uuid.uuid4().hex)
        self.source=self.root/'source';(self.source/'computer-access').mkdir(parents=True)
        self.document=audit.HOTFIX_DOCUMENT;self.before_ref='a'*40;self.after_ref='b'*40
        text=('<head><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" '
              'content="default-src \'self\'; script-src \'self\' \'nonce-existing\'; style-src \'self\'; img-src \'self\'; object-src \'none\'">'
              '<link rel="stylesheet" href="/main.css"><script src="/main.js" nonce="existing"></script></head><img src="/shot.png"><p>Approved body</p>')
        (self.source/self.document).write_text(text,encoding='utf8');(self.source/'index.html').write_text('<p>Home</p>',encoding='utf8')
        for name,body in {'main.js':b'const ready=true;','main.css':b'body{color:green}','shot.png':b'original opaque image'}.items():
            (self.source/name).write_bytes(body)
        files=oss.inventory(self.source)
        oss.write(self.source/oss.MANIFEST,{'schema':'wly.hybrid-release.v1','release_id':self.identifier(files),'files':files,'routes':['/','/computer-access/']})
        plan=oss.prepare(self.source,BASE,'releases/current',self.root/'split',rewriter_version=3)
        self.before=oss.read(self.root/'split/github'/oss.MANIFEST)
        self.before['oss']['verification']={'schema':'wly.oss-remote-verification.v1','release_id':plan['release_id'],
            'complete':True,'html_ready':True,'method':'anonymous full GET body SHA256 plus MP4 byte range',
            'verified_at_beijing':'Mocked unit fixture; no remote transport claimed','failed':[],
            'objects':{rel:{'status':'pass','http':200,'bytes':obj['bytes'],'sha256':obj['sha256'],
                'content_type':obj['content_type'],'headers':{'Access-Control-Allow-Origin':network.ORIGIN}}
                for rel,obj in self.before['oss']['objects'].items()}}
        self.old_body=(self.root/'split/github'/self.document).read_bytes()
        _,spans=audit.meta_policy_spans(self.old_body)
        policy=spans['csp']['raw']
        for directive,relative in (('script-src','main.js'),('style-src','main.css'),('img-src','shot.png')):
            segment=next(part for part in policy.split(';')if part.strip().startswith(directive+' '))
            policy=policy.replace(segment,segment+' '+self.before['oss']['objects'][relative]['url'])
        self.new_body=audit.replace_meta_policies(self.old_body,{'csp':policy,'referrer':oss.OSS_REFERRER_POLICY})
        self.current=json.loads(json.dumps(self.before));self.rebind_production()
        self.changes=['site-release/'+self.document,'site-release/'+oss.MANIFEST]

    @staticmethod
    def identifier(files):return hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest()

    def rebind_production(self):
        self.current['files'][self.document]={'bytes':len(self.new_body),'sha256':hashlib.sha256(self.new_body).hexdigest()}
        cloud=self.current['oss']
        self.current['release_id']=oss.release_identifier(cloud['source_release_id'],cloud['asset_base_url'],cloud['prefix'],self.current['files'],cloud['objects'])
        cloud['verification']['release_id']=self.current['release_id']

    def git_bytes(self,ref,relative):
        if relative==oss.MANIFEST:return json.dumps(self.before if ref==self.before_ref else self.current).encode()
        if relative==self.document:return self.old_body if ref==self.before_ref else self.new_body
        raise AssertionError('Unexpected Git object read: '+relative)

    def git_output(self,args,**kwargs):
        if args[:2]==['git','diff']:return '\n'.join(self.changes)+'\n'
        if args[:2]==['git','show']:
            ref,relative=args[2].split(':site-release/',1);return self.git_bytes(ref,relative)
        raise AssertionError('Unexpected Git query: '+repr(args))

    def patched(self):
        stack=contextlib.ExitStack()
        stack.enter_context(mock.patch.object(audit,'git_bytes',side_effect=self.git_bytes))
        stack.enter_context(mock.patch.object(audit.subprocess,'check_output',side_effect=self.git_output))
        stack.enter_context(mock.patch.object(audit.subprocess,'check_call',return_value=0))
        return stack

    def test_exact_delta_rebuild_has_new_real_source_identity_and_reproduces_production(self):
        with self.patched():
            result=audit.rebuild_metadata_hotfix_baseline(self.source,self.before_ref,self.after_ref,self.root/'runtime')
            self.assertNotEqual(result['release_id'],self.before['oss']['source_release_id'])
            self.assertEqual(result['release_id'],self.identifier(audit.module('hybrid-release').inventory(self.root/'runtime')))
            audit.verify_input_baseline(self.root/'runtime',self.after_ref,True)
        self.assertEqual((self.root/'runtime/shot.png').read_bytes(),(self.source/'shot.png').read_bytes())
        self.assertIn(b'no-referrer',(self.source/self.document).read_bytes())

    def test_html_nonce_body_unrelated_manifest_and_other_git_files_are_rejected(self):
        good_body=self.new_body;good_manifest=json.loads(json.dumps(self.current))
        for mutation in ('nonce','body','manifest','other_file'):
            with self.subTest(mutation=mutation):
                self.new_body=good_body;self.current=json.loads(json.dumps(good_manifest));self.changes=['site-release/'+self.document,'site-release/'+oss.MANIFEST]
                if mutation=='nonce':self.new_body=self.new_body.replace(b" 'nonce-existing'",b'');self.rebind_production()
                if mutation=='body':self.new_body=self.new_body.replace(b'Approved body',b'Other body');self.rebind_production()
                if mutation=='manifest':self.current['routes'].append('/unapproved/')
                if mutation=='other_file':self.changes.append('site-release/index.html')
                with self.patched(),self.assertRaises(ValueError):audit.metadata_hotfix_delta(self.before_ref,self.after_ref)

    def test_source_drift_and_forged_old_identifier_cannot_use_hotfix_binding(self):
        with self.patched():audit.rebuild_metadata_hotfix_baseline(self.source,self.before_ref,self.after_ref,self.root/'runtime')
        runtime=self.root/'runtime';original_manifest=oss.read(runtime/oss.MANIFEST)
        forged=json.loads(json.dumps(original_manifest));forged['release_id']=self.before['oss']['source_release_id'];oss.write(runtime/oss.MANIFEST,forged)
        with self.patched(),self.assertRaisesRegex(ValueError,'actual file inventory'):audit.verify_input_baseline(runtime,self.after_ref,True)
        (runtime/'shot.png').write_bytes(b'changed opaque image')
        forged=json.loads(json.dumps(original_manifest));forged['files']=audit.module('hybrid-release').inventory(runtime);forged['release_id']=self.identifier(forged['files'])
        forged['production_metadata_hotfix']['runtime_release_id']=forged['release_id'];oss.write(runtime/oss.MANIFEST,forged)
        with self.patched(),self.assertRaisesRegex(ValueError,'metadata-only hotfix derivation'):audit.verify_input_baseline(runtime,self.after_ref,True)


if __name__ == '__main__': unittest.main()

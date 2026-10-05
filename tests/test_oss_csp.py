"""OSS policy rewriting, precise fallback semantics and manifest route coverage."""
import importlib.util
import asyncio
import hashlib
import json
import os
from pathlib import Path
import unittest
import uuid

ROOT = Path(__file__).resolve().parents[1]


def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/filename)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module


oss = load('csp_oss', 'prepare-oss-release.py')
network = load('csp_network', 'verify-oss-browser-network.py')
BASE = 'https://fixture-bucket.oss-cn-shanghai.aliyuncs.com'


class OssCspTests(unittest.TestCase):
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
        self.assertEqual(network.summarize(rows), {'routes':1,'passed':0,'csp_blocked':1,'loading_failed':2,'http_failures':1,'page_errors':1})
        self.assertTrue(network.is_csp_failure({'type':'Document','errorText':'net::ERR_BLOCKED_BY_CSP'}))
        self.assertEqual(network.route_file('/how-this-site/'), 'how-this-site/index.html')
        self.assertEqual(network.route_file('/404.html'), '404.html')
        for route in ('https://other.example/', '/../escape/', '/how/?fixture=1'):
            with self.assertRaises(ValueError): network.route_file(route)

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


if __name__ == '__main__': unittest.main()

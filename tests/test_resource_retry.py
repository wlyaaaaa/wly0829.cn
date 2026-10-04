"""Installed headless Chrome failure fixtures; no screenshots or image viewing."""
from __future__ import annotations
import argparse,asyncio,hashlib,importlib.util,json,mimetypes,os,re,secrets,subprocess,threading,time,tempfile
from datetime import datetime,timedelta,timezone
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote,urlsplit
import unittest

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('resource_prep',ROOT/'scripts/prepare-resource-retry.py');prep=importlib.util.module_from_spec(spec);spec.loader.exec_module(prep)
SVG=b'<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="white"/></svg>'
CLASSIC=b'window.fixtureClassic=(window.fixtureClassic||0)+1;'
MODULE=b'import {value} from "./dep.js";window.fixtureModule=(window.fixtureModule||0)+1;window.fixtureModuleValue=value;'
DATA=b'{"fixture":true,"answer":42}'
HTML='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script src="/fixture/static.js" defer></script></head><body>
<a id="original-link" href="#unchanged" style="display:block;width:120px;height:80px"><picture><source srcset="/fixture/picture.svg 1x"><img id="picture" src="/fixture/fallback.svg" width="120" height="80" loading="eager"></picture></a>
<button id="original-button" style="position:fixed;bottom:8px;left:8px">原按钮</button>
<img id="terminal" src="/fixture/terminal.svg" width="120" height="80"><div style="height:18000px"></div><img id="lazy" src="/fixture/lazy.svg" width="120" height="80" loading="lazy"></body></html>'''.encode()

class SourceTests(unittest.TestCase):
    def test_initial_capture_is_exactly_bounded_and_preparation_rollback_preserves_source_bytes(self):
        with tempfile.TemporaryDirectory() as temporary:
            root=Path(temporary)/'raw';fixture_source(root)
            raw=(root/'index.html').read_bytes().replace(b'<script src="/fixture/static.js" defer>',b'<script onerror="window.originalError=true" src="/fixture/static.js" defer>')
            raw=raw.replace(b'</head>',b'<script defer src="https://outside.example/unlisted.js"></script></head>')
            (root/'index.html').write_bytes(raw);files=prep.inventory(root);manifest={'schema':'wly.hybrid-release.v1','files':files};manifest['release_id']=prep.identity(files,manifest)
            (root/'release-manifest.json').write_text(json.dumps(manifest),encoding='utf8')
            output=Path(temporary)/'prepared';prepared=prep.prepare(root,output,Path(temporary)/'prepared.json')
            body=(output/'index.html').read_bytes()
            self.assertLess(body.index(b'data-resource-retry-capture'),body.index(b'src="/fixture/static.js"'))
            self.assertEqual(body.count(prep.INITIAL_ATTRIBUTE),1)
            self.assertIn(b'onerror="window.originalError=true"',body)
            self.assertNotIn(b'src="https://outside.example/unlisted.js"'+prep.INITIAL_ATTRIBUTE,body)
            restored=Path(temporary)/'restored';prep.rollback(output,restored,Path(temporary)/'rollback.json')
            self.assertEqual((restored/'index.html').read_bytes(),raw)

    def test_explicit_asset_base_adds_only_its_canonical_https_origin(self):
        base='https://wly0829-assets-shanghai-20261003.oss-cn-shanghai.aliyuncs.com/releases/current/'
        with tempfile.TemporaryDirectory() as temporary:
            root=Path(temporary)/'raw';fixture_source(root)
            default,_=prep.policy_and_observation(root,prep.inventory(root))
            explicit,_=prep.policy_and_observation(root,prep.inventory(root),base)
            self.assertEqual(default['origins'],[])
            self.assertEqual(explicit['origins'],[base.split('/releases/')[0]])
            self.assertEqual(default['scripts'],explicit['scripts']);self.assertEqual(default['data'],explicit['data'])
            actual='https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com'
            configured,_=prep.policy_and_observation(root,prep.inventory(root),actual)
            self.assertEqual(configured['origins'],[actual])
            self.assertEqual(prep.asset_origin('https://ASSETS.EXAMPLE:443/releases/test/'),'https://assets.example')

    def test_invalid_asset_base_is_rejected_without_preparing_output(self):
        invalid=['','/releases/test/','//assets.example/releases/','http://assets.example/releases/','file:///E:/fixture',
                 'https://user:secret@assets.example/releases/','https://assets.example/releases/?x=1','https://assets.example/releases/#test',
                 'https://assets.example:99999/releases/','https://assets.example:0/releases/','https://assets.example\\other/releases/',
                 'https://*.example/releases/','https://assets.example /releases/','https:///releases/']
        with tempfile.TemporaryDirectory() as temporary:
            root=Path(temporary)/'raw';fixture_source(root)
            for index,url in enumerate(invalid):
                output=Path(temporary)/str(index)
                with self.subTest(url=url),self.assertRaises(ValueError):prep.prepare(root,output,Path(temporary)/'report.json',asset_base_url=url)
                self.assertFalse(output.exists())

    def test_identity_rejects_unknown_schema(self):
        with self.assertRaises(ValueError):prep.identity({}, {'schema':'unknown'})
    def test_runtime_has_no_storage_or_business_endpoint(self):
        text=(ROOT/'scripts/resource-retry-runtime.js').read_text('utf8')
        self.assertNotIn('localStorage',text);self.assertNotIn('sessionStorage',text)
        self.assertNotIn('setInterval',text);self.assertNotIn('computer-access/api/status',text)
        subprocess.run(['node','--check','-'],input=text,text=True,capture_output=True,check=True,encoding='utf8')

def fixture_source(root):
    root.mkdir(parents=True)
    bodies={'index.html':HTML,'fixture/picture.svg':SVG,'fixture/fallback.svg':SVG,'fixture/terminal.svg':SVG,'fixture/lazy.svg':SVG,
            'fixture/classic.js':CLASSIC,'fixture/module.js':MODULE,'fixture/dep.js':b'export const value=42;',
            'fixture/classic-terminal.js':b'window.fixtureTerminalScript=(window.fixtureTerminalScript||0)+1;',
            'fixture/execution-error.js':b'window.fixtureExecution=(window.fixtureExecution||0)+1;throw Error("expected-fixture-execution");',
            'fixture/module-execution-error.js':b'window.fixtureModuleExecution=(window.fixtureModuleExecution||0)+1;throw Error("expected-module-execution");',
            'fixture/static.js':b'window.fixtureStatic=(window.fixtureStatic||0)+1;','fixture/data.json':DATA,'fixture/network.json':DATA,'fixture/data-terminal.json':DATA}
    for rel,body in bodies.items():p=root/rel;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(body)
    files=prep.inventory(root);m={'schema':'wly.hybrid-release.v1','files':files};m['release_id']=prep.identity(files,m)
    (root/'release-manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf8')

SNAP=r'''() => {const r=element=>{const b=element.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height};};return {picture:{rect:r(document.querySelector('#picture')),src:document.querySelector('#picture').currentSrc,crossOrigin:document.querySelector('#picture').getAttribute('crossorigin'),complete:document.querySelector('#picture').complete,width:document.querySelector('#picture').naturalWidth},original:{href:document.querySelector('#original-link').getAttribute('href'),rect:r(document.querySelector('#original-link'))},buttons:[...document.querySelectorAll('.resource-retry-button')].map(b=>({text:b.textContent,rect:r(b),image:b._image.id,hidden:b.hidden})),events:window.retryEvents,classic:window.fixtureClassic,module:window.fixtureModule,moduleValue:window.fixtureModuleValue,execution:window.fixtureExecution,moduleExecution:window.fixtureModuleExecution};}'''

async def run(args):
    args.output.mkdir(parents=True,exist_ok=True);args.cache.mkdir(parents=True,exist_ok=True)
    for k in ('TEMP','TMP','TMPDIR'):os.environ[k]=str(args.cache)
    input_root=args.output/'fixture-input';candidate=args.output/'fixture-candidate';fixture_source(input_root)
    preparation=prep.prepare(input_root,candidate,args.output/'fixture-preparation.json')
    state={'requests':[],'counts':{},'phase':'fixture','source_target':None,'terminal_fail':True}
    nonce=secrets.token_hex(16)
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*a):pass
        def do_POST(self):self.handle_request('POST')
        def do_GET(self):self.handle_request('GET')
        def handle_request(self,method):
            path=unquote(urlsplit(self.path).path);key=method+' '+path;count=state['counts'].get(key,0)+1;state['counts'][key]=count
            root=candidate if state['phase']=='fixture'else args.pilot
            rel=path.lstrip('/')+('index.html'if path.endswith('/')else'');target=(root/rel).resolve()
            status=200;body=b'';mime=mimetypes.guess_type(str(target))[0]or'application/octet-stream'
            network_abort=False
            fail=method=='POST'or path=='/__status'
            if state['phase']=='fixture':
                fail=fail or(path in('/fixture/picture.svg','/fixture/classic.js','/fixture/module.js','/fixture/data.json')and count==1)or(path in('/fixture/terminal.svg','/fixture/classic-terminal.js','/fixture/data-terminal.json')and state['terminal_fail'])
            else:fail=fail or(path==state['source_target']and count==1)
            if target.is_relative_to(root.resolve())and target.is_file():body=target.read_bytes()
            elif path=='/__status':body=b'{"state":"unavailable","fixture_only":true}';mime='application/json'
            else:status=404;body=b'fixture-not-found'
            if fail:status=503;body=b'fixture-503'
            row={'method':method,'path':path,'raw_url':self.path,'count':count,'at':time.monotonic(),'status':'network-abort'if network_abort else status,'sha256':hashlib.sha256(body).hexdigest(),'bytes':len(body)};state['requests'].append(row)
            if network_abort:self.connection.close();return
            self.send_response(status);self.send_header('Content-Type',mime);self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control','public,max-age=3600'if fail else'no-store');self.end_headers()
            try:self.wfile.write(body)
            except(BrokenPipeError,ConnectionResetError):pass
    server=ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();base=f'http://127.0.0.1:{server.server_port}'
    profiles=[];errors=[];checks=[];responses=[];response_tasks=[]
    result={'schema':'wly.resource-retry-browser.v1','fixture_only':True,'observed_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),'port':server.server_port,'nonce':nonce,'checks':checks,'page_errors':errors,'requests':state['requests'],'responses':responses,'pilot':str(args.pilot),'no_media_viewed':True}
    from playwright.async_api import async_playwright
    try:
        async with async_playwright()as pw:
            profile=args.cache/('chrome-'+secrets.token_hex(4));profiles.append(profile)
            context=await pw.chromium.launch_persistent_context(str(profile),headless=True,executable_path=str(args.chrome),viewport={'width':412,'height':915},device_scale_factor=3.5,args=['--no-first-run','--no-default-browser-check'])
            async def route(rr):
                u=urlsplit(rr.request.url)
                if(u.scheme,u.hostname,u.port)!=('http','127.0.0.1',server.server_port):return await rr.fulfill(status=503,content_type='application/json',body='{"state":"unavailable","fixture_only":true}')
                if rr.request.method not in('GET','HEAD','POST','OPTIONS'):return await rr.abort()
                if state['phase']=='fixture'and u.path=='/fixture/network.json'and not state['counts'].get('GET '+u.path):
                    state['counts']['GET '+u.path]=1;state['requests'].append({'method':'GET','path':u.path,'raw_url':u.path,'count':1,'at':time.monotonic(),'status':'network-abort','bytes':0,'sha256':None});return await rr.abort('failed')
                await rr.continue_()
            await context.route('**/*',route);await context.add_init_script("window.retryEvents=[];document.addEventListener('resource-retry',e=>retryEvents.push(e.detail));")
            page=context.pages[0];page.on('pageerror',lambda e:errors.append(str(e)))
            async def response(r):
                if r.request.resource_type not in('script','fetch'):return
                try:responses.append({'url':r.url,'status':r.status,'sha256':hashlib.sha256(await r.body()).hexdigest()})
                except Exception:pass
            page.on('response',lambda r:response_tasks.append(asyncio.create_task(response(r))))
            await page.goto(base+'/',wait_until='load');initial=await page.evaluate(SNAP)
            await page.wait_for_timeout(1500);image=await page.evaluate(SNAP)
            result['image_sample']=image
            assert state['counts'].get('GET /fixture/picture.svg')==2 and image['picture']['complete']and image['picture']['width']==120
            assert image['picture']['rect']==initial['picture']['rect']and image['original']==initial['original']and image['picture']['crossOrigin']==initial['picture']['crossOrigin']
            rows=[r for r in state['requests']if r['path']=='/fixture/picture.svg'];gap=rows[1]['at']-rows[0]['at'];assert .9<=gap<3,rows
            assert state['counts'].get('GET /fixture/lazy.svg',0)==0
            assert any(b['text']=='重新加载'and b['image']=='terminal'for b in image['buttons'])
            original_hit=await page.locator('#original-button').evaluate('e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e;}');assert original_hit
            checks.append({'case':'picture-503-one-second-retry-success-and-terminal-button','pass':True,'gap_seconds':gap,'initial':initial,'after':image,'original_button_hit':original_hit,'lazy_requests_before_scroll':0})
            state['terminal_fail']=False
            await page.locator('.resource-retry-button').click();await page.wait_for_timeout(250)
            assert state['counts']['GET /fixture/terminal.svg']==3 and await page.locator('.resource-retry-button').count()==0
            checks.append({'case':'manual-reload-actual-click','pass':True,'requests':state['counts']['GET /fixture/terminal.svg']})
            await page.locator('#lazy').scroll_into_view_if_needed();await page.wait_for_timeout(200);assert state['counts']['GET /fixture/lazy.svg']==1
            await page.evaluate('scrollTo(0,0)')
            async def script(path,module=False):return await page.evaluate("({path,module})=>new Promise(resolve=>{const s=document.createElement('script');if(module)s.type='module';s.src=path;s.onload=()=>resolve('load');s.onerror=()=>resolve('error');document.head.append(s);})",{'path':path,'module':module})
            assert await script('/fixture/classic.js')=='load';assert await page.evaluate('fixtureClassic')==1
            assert await script('/fixture/module.js',True)=='load';assert await page.evaluate('fixtureModule')==1 and await page.evaluate('fixtureModuleValue')==42
            cached=await page.evaluate('import("/fixture/module.js").then(()=>"loaded",()=>"cached-failure")');assert cached=='cached-failure'
            assert state['counts']['GET /fixture/classic.js']==2 and state['counts']['GET /fixture/module.js']==2 and state['counts']['GET /fixture/dep.js']==1
            for path in('/fixture/classic.js','/fixture/module.js'):
                timing=[r for r in state['requests']if r['path']==path];assert .9<=timing[1]['at']-timing[0]['at']<3
            assert state['counts']['GET /fixture/static.js']==1 and await page.evaluate('fixtureStatic')==1
            checks.append({'case':'dynamic-classic-and-module-real-body-relative-import','pass':True,'classic_executions':1,'module_executions':1,'module_dependency_requests':1,'module_body_sha256':hashlib.sha256(MODULE).hexdigest(),'original_url_module_map_result':cached})
            state['terminal_fail']=True
            assert await script('/fixture/classic-terminal.js')=='error';assert state['counts']['GET /fixture/classic-terminal.js']==2
            await script('/fixture/execution-error.js');await script('/fixture/module-execution-error.js',True);await page.wait_for_timeout(1300)
            assert state['counts']['GET /fixture/execution-error.js']==1 and state['counts']['GET /fixture/module-execution-error.js']==1
            assert await page.evaluate('fixtureExecution')==1 and await page.evaluate('fixtureModuleExecution')==1
            checks.append({'case':'load-failure-terminal-and-execution-error-not-replayed','pass':True,'expected_fixture_errors':list(errors)})
            errors.clear()
            for path in('/fixture/data.json','/fixture/network.json'):
                body=await page.evaluate('async path=>(await fetch(path,{cache:"force-cache"})).text()',path);assert body.encode()==DATA and state['counts']['GET '+path]==2
                rows=[r for r in state['requests']if r['path']==path];gap=rows[1]['at']-rows[0]['at'];assert .9<=gap<3
                checks.append({'case':'data-'+path.rsplit('/',1)[1],'pass':True,'body_sha256':hashlib.sha256(body.encode()).hexdigest(),'gap_seconds':gap})
            code=await page.evaluate('async()=>(await fetch("/fixture/data-terminal.json")).status');assert code==503 and state['counts']['GET /fixture/data-terminal.json']==2
            await page.evaluate('async()=>{await fetch("/fixture/data.json",{method:"POST",body:"synthetic-only"});await fetch("/__status");}');await page.wait_for_timeout(1300)
            assert state['counts']['POST /fixture/data.json']==1 and state['counts']['GET /__status']==1
            checks.append({'case':'data-terminal-post-and-status-not-retried','pass':True})
            await page.emulate_media(reduced_motion='reduce');await context.set_offline(True)
            try:outcome=await page.evaluate('fetch("/fixture/network.json").then(()=>"ok",()=>"failed")');assert outcome=='failed'
            finally:await context.set_offline(False)
            checks.append({'case':'reduced-motion-offline-natural-failure','pass':True,'outcome':outcome,'events':await page.evaluate('retryEvents.filter(e=>e.kind==="data").slice(-3)')})
            await page.evaluate("base=>{const f=document.createElement('iframe');f.id='native-hidden-fixture';f.src=base+'/?hidden-fixture';document.body.append(f);}",base)
            await page.wait_for_function("(()=>{const im=document.querySelector('#native-hidden-fixture').contentDocument?.querySelector('#terminal');return im?.complete&&!im.naturalWidth;})()",timeout=10000)
            await page.evaluate("()=>{const f=document.querySelector('#native-hidden-fixture');window.oldResourceDoc=f.contentDocument;window.oldResourceEvents=[];oldResourceDoc.addEventListener('resource-retry',e=>oldResourceEvents.push(e.detail));f.src='about:blank';}")
            await page.wait_for_timeout(1200)
            hidden=await page.evaluate('({native_hidden:oldResourceDoc.hidden,events:oldResourceEvents,storage:Object.keys(sessionStorage)})');assert hidden['native_hidden']
            checks.append({'case':'native-old-document-hidden-during-resource-failure','pass':True,'sample':hidden,'assigned_document_hidden':False})
            await page.locator('#native-hidden-fixture').evaluate('e=>e.remove()')
            await asyncio.gather(*response_tasks)
            module_responses=[r for r in responses if urlsplit(r['url']).path=='/fixture/module.js'and r['status']==200];assert module_responses and all(r['sha256']==hashlib.sha256(MODULE).hexdigest()for r in module_responses)
            result['fixture_requests']=list(state['requests'])
            # The source pilot remains available; targeted runtime regressions
            # use the same existing fixture without importing an older package.
            if not getattr(args,'fixture_only',False):
                state['phase']='pilot';state['counts']={};state['requests'].clear();await page.emulate_media(reduced_motion='reduce')
                await page.goto(base+'/projects/agents/',wait_until='load');await page.evaluate('document.fonts.ready')
                target=await page.locator('.screen').last.locator('.typeset-part:not([hidden]) img').first.evaluate('im=>({src:im.dataset.src||im.src,sets:[...im.closest("picture").querySelectorAll("source")].map(s=>s.dataset.srcset||s.srcset).filter(Boolean)})')
                urls=[item.strip().split()[0]for srcset in target['sets']for item in srcset.split(',')if item.strip()]
                state['source_target']=urlsplit(urls[0]).path if urls else urlsplit(target['src']).path
                assert state['counts'].get('GET '+state['source_target'],0)==0
                await page.locator('.screen').last.scroll_into_view_if_needed();await page.wait_for_timeout(1700)
                rows=[r for r in state['requests']if r['path']==state['source_target']]
                assert len(rows)==2 and rows[0]['status']==503 and rows[1]['status']==200,rows
                assert rows[1]['sha256']==hashlib.sha256((args.pilot/state['source_target'].lstrip('/')).read_bytes()).hexdigest()
                checks.append({'case':'real-source-one-page-lazy-503-recovery','pass':True,'target':state['source_target'],'requests':rows,'actual_media_body_unchanged':True})
            assert not errors,errors
            await asyncio.gather(*response_tasks)
            await context.close()
        result['status']='pass'
    except Exception as exc:result['status']='failed';result['failure']=repr(exc);raise
    finally:
        server.shutdown();server.server_close();thread.join(5);result['owned_server_stopped']=not thread.is_alive();result['profile_cleanup']=[]
        for p in profiles:
            receipt=subprocess.run(['pwsh','-NoProfile','-File','E:/.agents/tools/Move-TaskItemToRecycleBin.ps1','-LiteralPath',str(p),'-AllowedRoot',str(args.cache),'-Json'],capture_output=True,text=True,encoding='utf8')
            result['profile_cleanup'].append({'path':str(p),'exit_code':receipt.returncode,'receipt':receipt.stdout,'stderr':receipt.stderr})
        (args.output/'browser-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps({'status':result['status'],'checks':len(checks),'owned_server_stopped':result['owned_server_stopped']},ensure_ascii=False))

async def run_origin_fixture(args):
    """Actual local HTTP page plus two distinct asset origins, one using HTTPS."""
    import ipaddress,ssl
    from cryptography import x509
    from cryptography.hazmat.primitives import hashes,serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.x509.oid import NameOID
    from playwright.async_api import async_playwright
    args.output.mkdir(parents=True,exist_ok=True);args.cache.mkdir(parents=True,exist_ok=True)
    for name in ('TEMP','TMP','TMPDIR'):os.environ[name]=str(args.cache)
    key=rsa.generate_private_key(public_exponent=65537,key_size=2048)
    subject=x509.Name([x509.NameAttribute(NameOID.COMMON_NAME,'resource-retry-local-fixture')]);now=datetime.now(timezone.utc)
    cert=(x509.CertificateBuilder().subject_name(subject).issuer_name(subject).public_key(key.public_key()).serial_number(x509.random_serial_number())
          .not_valid_before(now-timedelta(minutes=1)).not_valid_after(now+timedelta(hours=1))
          .add_extension(x509.SubjectAlternativeName([x509.IPAddress(ipaddress.ip_address('127.0.0.1'))]),critical=False).sign(key,hashes.SHA256()))
    certfile=args.cache/'fixture-cert.pem';keyfile=args.cache/'fixture-key.pem'
    certfile.write_bytes(cert.public_bytes(serialization.Encoding.PEM))
    keyfile.write_bytes(key.private_bytes(serialization.Encoding.PEM,serialization.PrivateFormat.PKCS8,serialization.NoEncryption()))
    tls=ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER);tls.load_cert_chain(str(certfile),str(keyfile))
    requests=[];counts={};htmls={};runtimes={};servers=[];threads=[];contexts=[]
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*a):pass
        def do_POST(self):self.serve('POST')
        def do_GET(self):self.serve('GET')
        def serve(self,method):
            path=urlsplit(self.path).path;identity=(self.server.server_port,method,path);count=counts.get(identity,0)+1;counts[identity]=count
            status=200;mime='image/svg+xml';body=SVG
            if path in htmls:body=htmls[path];mime='text/html; charset=utf-8'
            elif path in runtimes:body=runtimes[path];mime='text/javascript; charset=utf-8'
            elif path=='/fixture/static.js':body=b'window.fixtureStatic=(window.fixtureStatic||0)+1;';mime='text/javascript'
            elif path=='/fixture/execution-error.js':body=b'window.fixtureExecution=(window.fixtureExecution||0)+1;throw Error("expected-origin-fixture");';mime='text/javascript'
            elif method=='POST' or path=='/__status' or path.startswith('/api/') or path=='/fixture/not-listed.json':status=503;body=b'fixture-503';mime='application/json'
            elif path.endswith('.svg') and (self.server.server_port==other.server_port or count==1):status=503;body=b'fixture-503'
            requests.append({'port':self.server.server_port,'method':method,'path':path,'raw_url':self.path,'count':count,'status':status,'at':time.monotonic()})
            self.send_response(status);self.send_header('Content-Type',mime);self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control','public,max-age=3600' if status==503 and not path.endswith('/recovered.svg') else 'no-store');self.end_headers()
            try:self.wfile.write(body)
            except(BrokenPipeError,ConnectionResetError):pass
    main=ThreadingHTTPServer(('127.0.0.1',0),Handler);allowed=ThreadingHTTPServer(('127.0.0.1',0),Handler);other=ThreadingHTTPServer(('127.0.0.1',0),Handler)
    allowed.socket=tls.wrap_socket(allowed.socket,server_side=True)
    page_origin=f'http://127.0.0.1:{main.server_port}';asset_origin=f'https://127.0.0.1:{allowed.server_port}';other_origin=f'http://127.0.0.1:{other.server_port}'
    raw=args.cache/'raw';fixture_source(raw);preparations={}
    for case in ('explicit','default'):
        output=args.cache/case;prepared=prep.prepare(raw,output,args.output/(case+'-preparation.json'),asset_base_url=asset_origin+'/releases/local-fixture/' if case=='explicit' else None)
        preparations[case]=prepared;runtime='/'+prepared['runtime'];runtimes[runtime]=(output/prepared['runtime']).read_bytes()
        htmls['/'+case+'/']=(f'<!doctype html><meta charset="utf-8"><script src="{runtime}"></script><script src="/fixture/static.js" defer></script>'
            f'<img id="allowed" src="{asset_origin}/releases/{case}/picture.svg" width="120" height="80">'
            f'<img id="other" src="{other_origin}/releases/{case}/picture.svg" width="120" height="80">'
            f'<img id="same" src="/releases/{case}/same.svg" width="120" height="80">').encode()
    result={'schema':'wly.resource-retry-origin-fixture.v1','observed_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),'status':'failed','checks':[],
            'origins':{'page':page_origin,'allowed':asset_origin,'other':other_origin},'runtime_source_sha256':prep.stamp(ROOT/'scripts/resource-retry-runtime.js')['sha256'],'requests':requests,'no_media_viewed':True}
    try:
        for server in (main,allowed,other):
            servers.append(server);thread=threading.Thread(target=server.serve_forever,daemon=True);threads.append(thread);thread.start()
        async with async_playwright() as pw:
            context=await pw.chromium.launch_persistent_context(str(args.cache/('chrome-'+secrets.token_hex(4))),headless=True,executable_path=str(args.chrome),ignore_https_errors=True,viewport={'width':412,'height':915});contexts.append(context)
            origins={page_origin,asset_origin,other_origin}
            async def local_only(route):
                u=urlsplit(route.request.url)
                if u.scheme+'://'+u.netloc not in origins:return await route.abort()
                await route.continue_()
            await context.route('**/*',local_only)
            for case in ('explicit','default'):
                page=await context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
                await page.add_init_script("window.retryEvents=[];document.addEventListener('resource-retry',e=>retryEvents.push(e.detail));")
                await page.goto(page_origin+'/'+case+'/',wait_until='load');await page.wait_for_timeout(1400)
                sample=await page.evaluate("({allowed:document.querySelector('#allowed').naturalWidth,other:document.querySelector('#other').naturalWidth,same:document.querySelector('#same').naturalWidth,events:retryEvents})")
                a=[r for r in requests if r['port']==allowed.server_port and r['path']==f'/releases/{case}/picture.svg']
                b=[r for r in requests if r['port']==other.server_port and r['path']==f'/releases/{case}/picture.svg']
                same=[r for r in requests if r['port']==main.server_port and r['path']==f'/releases/{case}/same.svg']
                assert len(a)==(2 if case=='explicit' else 1) and len(b)==1 and len(same)==2
                assert sample['allowed']==(120 if case=='explicit' else 0) and sample['other']==0 and sample['same']==120
                for rows in (same,a if case=='explicit' else same):assert rows[0]['status']==503 and rows[1]['status']==200 and .9<=rows[1]['at']-rows[0]['at']<3
                result['checks'].append({'case':case,'pass':True,'allowed_requests':len(a),'other_requests':len(b),'same_origin_requests':len(same),'allowed_retry_gap_seconds':a[1]['at']-a[0]['at'] if case=='explicit' else None,'sample':sample})
                if case=='explicit':
                    await page.evaluate("()=>{window.sameURLRecovery=[];const im=document.createElement('img');im.id='same-url-recovery';im.width=120;im.height=80;const url='/releases/explicit/recovered.svg';let scheduled=false;im.addEventListener('error',()=>{sameURLRecovery.push({state:'error',at:performance.now(),url:im.currentSrc||im.src});if(!scheduled){scheduled=true;setTimeout(()=>{im.src=url},60)}});im.addEventListener('load',()=>sameURLRecovery.push({state:'load',at:performance.now(),url:im.currentSrc||im.src}));im.src=url;document.body.append(im);}")
                    await page.wait_for_function('document.querySelector("#same-url-recovery").naturalWidth===120')
                    await page.wait_for_timeout(1200)
                    recovery=await page.evaluate("({events:sameURLRecovery,retry:retryEvents.filter(e=>e.url.endsWith('/recovered.svg')),buttons:[...document.querySelectorAll('.resource-retry-button')].filter(b=>b._image.id==='same-url-recovery').length})")
                    rows=[r for r in requests if r['port']==main.server_port and r['path']=='/releases/explicit/recovered.svg']
                    assert len(rows)==2 and rows[0]['status']==503 and rows[1]['status']==200 and rows[0]['raw_url']==rows[1]['raw_url'],rows
                    assert [e['state'] for e in recovery['events']]==['error','load'] and not any(e['state']=='retry' for e in recovery['retry']) and recovery['buttons']==0,recovery
                    result['checks'].append({'case':'real-same-url-load-recovery-cancels-pending-auto-timer','pass':True,'requests':rows,'sample':recovery,'waited_beyond_original_delay':True})
                    await page.evaluate("async()=>{await fetch('/api/static.json');await fetch('/__status');await fetch('/fixture/not-listed.json');await fetch('/fixture/data.json',{method:'POST',body:'synthetic'});const s=document.createElement('script');s.src='/fixture/execution-error.js';document.head.append(s);}")
                    await page.wait_for_timeout(1200)
                    for method,path in [('GET','/api/static.json'),('GET','/__status'),('GET','/fixture/not-listed.json'),('POST','/fixture/data.json'),('GET','/fixture/execution-error.js')]:assert counts[(main.server_port,method,path)]==1
                    assert await page.evaluate('fixtureExecution')==1 and len(errors)==1 and 'expected-origin-fixture' in errors[0]
                    result['checks'].append({'case':'api-status-post-unlisted-json-and-execution-error-not-replayed','pass':True})
                else:assert not errors,errors
                await page.close()
            await context.close();contexts.clear()
        result['status']='pass'
    finally:
        for context in contexts:await context.close()
        for server in servers:server.shutdown();server.server_close()
        for thread in threads:thread.join(5)
        result['owned_servers_stopped']=all(not thread.is_alive() for thread in threads)
        (args.output/'origin-browser-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps({'status':result['status'],'checks':len(result['checks']),'owned_servers_stopped':result['owned_servers_stopped']},ensure_ascii=False))

async def run_initial_script_fixture(args):
    """Real element load errors before/after listener installation, not timing guesses."""
    from playwright.async_api import async_playwright
    args.output.mkdir(parents=True,exist_ok=True);args.cache.mkdir(parents=True,exist_ok=True)
    for name in ('TEMP','TMP','TMPDIR'):os.environ[name]=str(args.cache.resolve())
    rows=[];counts={};cases=[];roots={};runtime_paths=set();state={'case':'early-defer'}
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*a):pass
        def do_GET(self):
            u=urlsplit(self.path);case=u.path.strip('/').split('/')[0];root=roots.get(case);path='/'+'/'.join(u.path.strip('/').split('/')[1:])
            key=(self.server.server_port,case,path);n=counts.get(key,0)+1;counts[key]=n;status=200;body=b'';mime='text/javascript; charset=utf-8'
            if self.server is foreign:status=503;body=b'outside-origin-failure'
            elif path=='/initial.js' and n==1:
                if case=='late-defer':time.sleep(.8)
                status=503;body=b'initial-script-load-failure'
            elif root and path=='/':body=(root/'index.html').read_bytes();mime='text/html; charset=utf-8'
            elif root:
                target=root/path.lstrip('/')
                if target.is_file():
                    body=target.read_bytes()
                    if path in runtime_paths and case=='early-defer':time.sleep(.6)
                else:status=404;body=b'fixture-not-found'
            else:status=404
            rows.append({'case':case,'port':self.server.server_port,'path':path,'raw_url':self.path,'status':status,'count':n,'at':time.monotonic(),'body_sha256':hashlib.sha256(body).hexdigest()})
            self.send_response(status);self.send_header('Content-Type',mime);self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control','no-store');self.end_headers()
            try:self.wfile.write(body)
            except(BrokenPipeError,ConnectionResetError):pass
    main=ThreadingHTTPServer(('127.0.0.1',0),Handler);foreign=ThreadingHTTPServer(('127.0.0.1',0),Handler)
    main_origin=f'http://127.0.0.1:{main.server_port}';foreign_origin=f'http://127.0.0.1:{foreign.server_port}'
    for case in args.initial_cases.split(','):
        raw=args.cache/(case+'-raw');raw.mkdir(parents=True)
        initial=b'window.initialExecutions=(window.initialExecutions||0)+1;'
        throwing=b'window.executionErrorExecutions=(window.executionErrorExecutions||0)+1;throw Error("expected-initial-execution-error");'
        defer='' if case in ('blocking','album-late') else ' defer'
        album_data='<script id="album-page" type="application/json">{"outbound":{},"nodes":[],"images":[]}</script>' if case=='album-late' else ''
        if case=='album-late':initial=(ROOT/'scripts/album-runtime.js').read_bytes()
        html=(f'<!doctype html><html><head><meta charset="utf-8">{album_data}<script id="critical"{defer} onerror="window.originalLoadErrors=(window.originalLoadErrors||0)+1" onload="window.originalLoads=(window.originalLoads||0)+1" src="/{case}/initial.js"></script>'
              f'<script defer id="business-error" src="/{case}/execution.js"></script><script defer src="{foreign_origin}/{case}/outside.js"></script></head><body>fixture only</body></html>').encode()
        if case=='album-late':html=html.replace(b'</head>',f'<script data-album-runtime data-src="/{case}/app.js"></script></head>'.encode())
        for name,body in {'index.html':html,'initial.js':initial,'execution.js':throwing}.items():(raw/name).write_bytes(body)
        # The URL includes the case's server route, so the exact manifest list
        # models a real route-prefixed source rather than granting arbitrary URLs.
        for name in ('initial.js','execution.js'):
            (raw/case).mkdir(exist_ok=True);(raw/case/name).write_bytes((raw/name).read_bytes())
        if case=='album-late':
            app=b'window.initialExecutions=(window.initialExecutions||0)+1;';(raw/case/'app.js').write_bytes(app);(raw/'app.js').write_bytes(app)
        files=prep.inventory(raw);manifest={'schema':'wly.hybrid-release.v1','files':files};manifest['release_id']=prep.identity(files,manifest)
        (raw/'release-manifest.json').write_text(json.dumps(manifest),encoding='utf8')
        candidate=args.cache/(case+'-candidate');prepared=prep.prepare(raw,candidate,args.output/(case+'-preparation.json'));roots[case]=candidate
        runtime='/'+prepared['runtime'];runtime_paths.add(runtime)
        # Only serve URL layout differs; the prepared HTML's runtime asset is
        # routed inside its case directory without changing its actual bytes.
    threads=[];result={'schema':'wly.initial-script-retry-browser.v1','status':'failed','expected':args.expect_initial,'source_runtime_sha256':prep.stamp(ROOT/'scripts/resource-retry-runtime.js')['sha256'],
             'source_preparer_sha256':prep.stamp(ROOT/'scripts/prepare-resource-retry.py')['sha256'],'requests':rows,'cases':cases,'observed_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat()}
    try:
        for server in (main,foreign):t=threading.Thread(target=server.serve_forever,daemon=True);threads.append(t);t.start()
        async with async_playwright() as pw:
            context=await pw.chromium.launch_persistent_context(str(args.cache/'chrome'),executable_path=str(args.chrome),headless=True,viewport={'width':412,'height':915},device_scale_factor=3.5)
            try:
                for case in roots:
                    state['case']=case;page=await context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
                    await page.add_init_script("window.initialEvents=[];document.addEventListener('error',e=>initialEvents.push({kind:'error',trusted:e.isTrusted,tag:e.target.tagName,id:e.target.id,src:e.target.src,at:performance.now()}),true);document.addEventListener('load',e=>{if(e.target.tagName==='SCRIPT')initialEvents.push({kind:'load',trusted:e.isTrusted,id:e.target.id,src:e.target.src,at:performance.now()})},true);document.addEventListener('resource-retry',e=>initialEvents.push({kind:'retry-event',...e.detail}));")
                    async def route(r):
                        u=urlsplit(r.request.url)
                        if u.hostname!='127.0.0.1' or u.port not in (main.server_port,foreign.server_port):return await r.abort()
                        if u.port==main.server_port and u.path.startswith('/_shared/'):
                            return await r.fulfill(response=await context.request.get(main_origin+'/'+case+u.path,timeout=10000))
                        await r.continue_()
                    await page.route('**/*',route)
                    await page.goto(main_origin+'/'+case+'/',wait_until='load');await page.wait_for_timeout(1400)
                    sample=await page.evaluate('({initial:window.initialExecutions||0,business:window.executionErrorExecutions||0,originalErrors:window.originalLoadErrors||0,originalLoads:window.originalLoads||0,events:initialEvents,album:window.SiteAlbum?.snapshot,readyState:document.readyState})')
                    initial_rows=[r for r in rows if r['case']==case and r['port']==main.server_port and r['path']=='/initial.js']
                    runtime_load=next(e['at'] for e in sample['events'] if e['kind']=='load' and 'resource-retry-' in (e.get('src')or''))
                    element_error=next(e['at'] for e in sample['events'] if e['kind']=='error' and e.get('id')=='critical' and e['trusted'])
                    assert (element_error<runtime_load)==(case in ('blocking','album-late')),sample
                    assert sample['business']==1 and len(errors)==1 and 'expected-initial-execution-error' in errors[0],(errors,sample)
                    assert counts[(foreign.server_port,case,'/outside.js')]==1
                    if args.expect_initial=='absent':assert sample['initial']==0 and len(initial_rows)==1,sample
                    else:
                        assert sample['initial']==1 and sample['originalErrors']==1 and sample['originalLoads']==1 and len(initial_rows)==2,sample
                        retry=[e for e in sample['events'] if e.get('state')=='retry' and '/initial.js' in e.get('url','')]
                        assert len(retry)==1 and .9<=(initial_rows[1]['at']-initial_rows[0]['at'])<3,initial_rows
                        if case=='album-late':assert sample['readyState']=='complete' and sample['album']['runtimeStartCount']==1 and counts[(main.server_port,case,'/app.js')]==1,sample
                    cases.append({'case':case,'status':'pass','element_error_before_runtime':element_error<runtime_load,'runtime_loaded_at':runtime_load,'element_error_at':element_error,'sample':sample,'initial_requests':initial_rows,'business_errors':errors})
                    await page.close()
            finally:await context.close()
        result['status']='pass'
    finally:
        for server in (main,foreign):server.shutdown();server.server_close()
        for t in threads:t.join(5)
        result['servers_stopped']=all(not t.is_alive() for t in threads);(args.output/'initial-browser-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n','utf8')
    print(json.dumps({'status':result['status'],'expected':args.expect_initial,'cases':len(cases),'servers_stopped':result['servers_stopped']},ensure_ascii=False))

if __name__=='__main__':
    import sys
    if '--initial-script-fixture' in sys.argv:
        ap=argparse.ArgumentParser();ap.add_argument('--initial-script-fixture',action='store_true')
        for name in ('output','cache'):ap.add_argument('--'+name,type=Path,required=True)
        ap.add_argument('--expect-initial',choices=('absent','success'),default='success');ap.add_argument('--initial-cases',default='early-defer,blocking,late-defer')
        ap.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'));asyncio.run(run_initial_script_fixture(ap.parse_args()))
    elif '--origin-fixture' in sys.argv:
        ap=argparse.ArgumentParser();ap.add_argument('--origin-fixture',action='store_true')
        for name in ('output','cache'):ap.add_argument('--'+name,type=Path,required=True)
        ap.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'));asyncio.run(run_origin_fixture(ap.parse_args()))
    elif '--pilot'in sys.argv or '--fixture-only' in sys.argv:
        ap=argparse.ArgumentParser()
        ap.add_argument('--fixture-only',action='store_true');ap.add_argument('--pilot',type=Path,required='--fixture-only' not in sys.argv)
        for name in('output','cache'):ap.add_argument('--'+name,type=Path,required=True)
        ap.add_argument('--chrome',type=Path,default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'));asyncio.run(run(ap.parse_args()))
    else:unittest.main()

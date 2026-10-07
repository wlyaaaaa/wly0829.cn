"""Address-only migration, binary preservation, and remote-body verification."""
import importlib.util
import copy
import json
import os
from pathlib import Path
import threading
import shutil
import unittest
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('oss_release', ROOT/'scripts/prepare-oss-release.py')
oss = importlib.util.module_from_spec(spec)
spec.loader.exec_module(oss)


class OssReleaseTests(unittest.TestCase):
    def test_image_preload_candidates_are_versioned_and_keep_browser_selection(self):
        files={'index.html':{},'assets/portrait.avif':{},'assets/wide.avif':{}}
        text=(b'<head><link rel="preload" as="image" type="image/avif" media="(orientation:landscape)" '
              b'imagesrcset="assets/portrait.avif 1280w, /assets/wide.avif?quality=full#hero 2880w" '
              b'imagesizes="(min-width:1648px) 1600px, calc(100vw - 48px)" fetchpriority="high"></head>')
        old=oss.Rewriter(files,'https://example.oss.invalid','releases/one','https://wly0829.cn',version=4)
        current=oss.Rewriter(files,'https://example.oss.invalid','releases/one','https://wly0829.cn',version=5)
        self.assertEqual(old.rewrite(text,'index.html'),text)
        rewritten=current.rewrite(text,'index.html')
        self.assertIn(b'imagesrcset="https://example.oss.invalid/releases/one/assets/portrait.avif 1280w, '
                      b'https://example.oss.invalid/releases/one/assets/wide.avif?quality=full#hero 2880w"',rewritten)
        self.assertIn(b'media="(orientation:landscape)"',rewritten)
        self.assertIn(b'imagesizes="(min-width:1648px) 1600px, calc(100vw - 48px)" fetchpriority="high"',rewritten)
        self.assertEqual(current.references,{'index.html':{'assets/portrait.avif','assets/wide.avif'}})
        self.assertFalse(current.missing)

    def test_preload_with_an_unknown_candidate_is_rejected_by_normal_preparation(self):
        page=self.source/'index.html'
        page.write_bytes(page.read_bytes()+b'<link rel="preload" as="image" imagesrcset="assets/not-present.avif 1920w">')
        manifest=oss.read(self.source/oss.MANIFEST)
        manifest['files']={key:value for key,value in oss.inventory(self.source).items() if key!=oss.MANIFEST}
        oss.write(self.source/oss.MANIFEST,manifest)
        with self.assertRaisesRegex(ValueError,'Missing local resources'):
            self.prepare()
        missing=oss.read(self.root/'output/unresolved-resources.json')
        self.assertTrue(any(row['url']=='assets/not-present.avif' and row['context']=='resource' for row in missing))

    def test_new_javascript_parser_preserves_comments_and_regex_and_maps_actual_assets(self):
        files={'_shared/comic.js':{},'_shared/scene.png':{}}
        text=("// painter's note \"/scene.png\" ---- 开场：左边还没\n"
              "/* quoted `scene.png` stays a comment */\n"
              "const pattern=/['\"\\/]/g; if(true) /[\\/]/.test('/');\n"
              "const image='scene.png'; const label='// 版权所有：原样保留';\n").encode('utf8')
        rewriter=oss.Rewriter(files,'https://example.oss.invalid','releases/one','https://wly0829.cn',version=3)
        expected=text.replace(b"const image='scene.png'",b"const image='https://example.oss.invalid/releases/one/_shared/scene.png'")
        self.assertEqual(rewriter.rewrite(text,'_shared/comic.js'),expected)
        self.assertEqual(rewriter.references,{'_shared/comic.js':{'_shared/scene.png'}})
        self.assertFalse(rewriter.missing)

    def test_new_javascript_parser_keeps_else_do_regex_and_helper_comments(self):
        files={'_shared/comic.js':{},'_shared/scene.png':{}}
        text=("if(flag) void 0; else /\"scene.png\"/.test(text);\n"
              "do /\"scene.png\"/.test(text); while(flag);\n"
              "outer: while(false){break outer\n/\"scene.png\"/.test(\"\");}\n"
              "outer2: while(false){continue outer2 // comment\n/\"scene.png\"/.test(\"\");}\n"
              "// new URL('assets/'+shot.src,location.href)\n"
              "// __vite__mapDeps= x=function(e){return`/`+e}\n"
              "const image=\"scene.png\";\n").encode()
        rewriter=oss.Rewriter(files,'https://example.oss.invalid','releases/one','https://wly0829.cn',version=3)
        expected=text.replace(b'const image="scene.png"',b'const image="https://example.oss.invalid/releases/one/_shared/scene.png"')
        self.assertEqual(rewriter.rewrite(text,'_shared/comic.js'),expected)

    def test_lazy_picture_and_lazy_css_addresses_are_versioned(self):
        files={'index.html':{},'_shared/a.avif':{},'_shared/b.webp':{}}
        text=b'<source data-lazy-srcset="/_shared/a.avif 640w"><div data-lazy-style="background:url(\'/ _shared/b.webp\')"></div>'.replace(b'/ _shared',b'/_shared')
        old=oss.Rewriter(files,'https://example.oss.invalid','releases/one','https://wly0829.cn')
        current=oss.Rewriter(files,'https://example.oss.invalid','releases/one','https://wly0829.cn',version=2)
        self.assertEqual(old.rewrite(text,'index.html'),text)
        rewritten=current.rewrite(text,'index.html')
        self.assertIn(b'data-lazy-srcset="https://example.oss.invalid/releases/one/_shared/a.avif 640w"',rewritten)
        self.assertIn(b'background:url(\'https://example.oss.invalid/releases/one/_shared/b.webp\')',rewritten)
        self.assertFalse(current.missing)

    def setUp(self):
        # Kept under the task TEMP for the existing recycle-bin closeout tool.
        self.root = Path(os.environ.get('TEMP', ROOT/'.test-tmp')) / ('oss-test-' + uuid.uuid4().hex)
        self.source = self.root/'source'
        self.source.mkdir(parents=True)
        files = {
            'index.html': b'<link rel="stylesheet" href="/assets/site.css"><script type="module" src="/assets/main.js"></script><a href="/projects/demo/">demo</a><a href="https://mcp.wly0829.cn/status">status</a>',
            'projects/demo/index.html': b'<img src="assets/image.webp"><source srcset="assets/image.avif 1x, assets/image.webp 2x"><script type="application/json" id="page-data">{"video":{"src":"assets/hero.mp4","mask":"assets/mask.png"},"avif_assets":{"assets/image.webp":"assets/image.avif"},"shots":[{"src":"image.webp"}],"href":"/projects/demo/"}</script>',
            'assets/site.css': b'body{background:url(/projects/demo/assets/image.webp)} @import "./extra.css";',
            'assets/extra.css': b'body{color:green}',
            'assets/main.js': b'const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/mod.js"])))=>i.map(i=>d[i]);var y=function(e){return`/`+e};import "./mod.js";fetch("/__status");',
            'assets/mod.js': b'const r=new URL(\'assets/\'+shot.src,location.href);',
            'projects/demo/assets/image.webp': b'unchanged WebP bytes\x00\xff',
            'projects/demo/assets/image.avif': b'unchanged AVIF bytes',
            'projects/demo/assets/mask.png': b'unchanged mask bytes',
            'projects/demo/assets/hero.mp4': b'unchanged MP4 bytes' * 5,
            'search-index.js': b'window.records=[{"href":"/projects/demo/","detail":"assets/mod.js"}];',
            'CNAME': b'wly0829.cn\n', 'robots.txt': b'Sitemap: https://wly0829.cn/sitemap.xml\n',
            'sitemap.xml': b'<loc>https://wly0829.cn/projects/demo/</loc>',
        }
        for rel, body in files.items():
            p = self.source/rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(body)
        oss.write(self.source/oss.MANIFEST, {'schema': 'wly.hybrid-release.v1', 'release_id': 'fixture',
                                          'files': oss.inventory(self.source), 'routes': ['/', '/projects/demo/']})

    def prepare(self, origin='https://fixture-bucket.oss-cn-beijing.aliyuncs.com', test=False):
        output = self.root/'output'
        plan = oss.prepare(self.source, origin, 'releases/fixture-001', output, allow_test=test)
        return output, plan

    def test_full_route_and_resource_closure_preserves_binaries(self):
        output, plan = self.prepare()
        self.assertEqual(plan['summary']['html_files'], 2)
        self.assertEqual(plan['summary']['mp4_files'], 1)
        html = (output/'github/projects/demo/index.html').read_text()
        url = 'https://fixture-bucket.oss-cn-beijing.aliyuncs.com/releases/fixture-001/'
        self.assertIn('"src":"' + url + 'projects/demo/assets/hero.mp4"', html)
        self.assertIn('"' + url + 'projects/demo/assets/image.webp":"' + url + 'projects/demo/assets/image.avif"', html)
        self.assertIn('"href":"/projects/demo/"', html)
        self.assertIn('href="/projects/demo/"', (output/'github/index.html').read_text())
        self.assertEqual((output/'github/robots.txt').read_bytes(), (self.source/'robots.txt').read_bytes())
        for rel, obj in plan['objects'].items():
            if Path(rel).suffix in ('.webp', '.avif', '.png', '.mp4'):
                self.assertTrue(obj['byte_preserved'])
                self.assertEqual((output/'oss'/rel).read_bytes(), (self.source/rel).read_bytes())
        self.assertIn(url + 'projects/demo/assets/image.webp', (output/'oss/assets/site.css').read_text())
        self.assertIn('return``+e', (output/'oss/assets/main.js').read_text())
        self.assertIn('new URL(shot.src,location.href)', (output/'oss/assets/mod.js').read_text())
        self.assertIn('fetch("/__status")', (output/'oss/assets/main.js').read_text())
        self.assertEqual((output/'oss/search-index.js').read_bytes(), (self.source/'search-index.js').read_bytes())
        oss.verify_local(output)

    def test_unrecorded_source_or_target_change_is_rejected(self):
        output, _ = self.prepare()
        p = output/'oss/projects/demo/assets/hero.mp4'
        p.write_bytes(p.read_bytes() + b'changed')
        with self.assertRaisesRegex(ValueError, 'OSS inventory/bytes changed'):
            oss.verify_local(output)
        p.write_bytes(p.read_bytes()[:-7])
        source_image = self.source/'projects/demo/assets/image.webp'
        source_image.write_bytes(source_image.read_bytes() + b'changed')
        with self.assertRaisesRegex(ValueError, 'Source changed since preparation'):
            oss.verify_local(output)

    def test_share_images_move_with_assets_and_page_identity_stays_on_site(self):
        page=self.source/'index.html'
        page.write_text('<meta property="og:image" content="https://wly0829.cn/projects/demo/assets/image.webp">'
                        '<meta content="/projects/demo/assets/image.avif" name="twitter:image">'
                        '<meta property="og:url" content="https://wly0829.cn/">'
                        '<meta name="description" content="原简介完整保留">'
                        '<link rel="canonical" href="https://wly0829.cn/">',encoding='utf8')
        manifest=oss.read(self.source/oss.MANIFEST)
        manifest['files']={key:value for key,value in oss.inventory(self.source).items() if key!=oss.MANIFEST}
        oss.write(self.source/oss.MANIFEST,manifest)
        output,plan=self.prepare('https://fixture-bucket.oss-cn-shanghai.aliyuncs.com')
        html=(output/'github/index.html').read_text('utf8')
        prefix='https://fixture-bucket.oss-cn-shanghai.aliyuncs.com/releases/fixture-001/'
        self.assertIn('content="'+prefix+'projects/demo/assets/image.webp"',html)
        self.assertIn('content="'+prefix+'projects/demo/assets/image.avif"',html)
        self.assertIn('property="og:url" content="https://wly0829.cn/"',html)
        self.assertIn('name="description" content="原简介完整保留"',html)
        self.assertIn('rel="canonical" href="https://wly0829.cn/"',html)
        self.assertTrue(all((output/'oss'/rel).read_bytes()==(self.source/rel).read_bytes()
                            for rel in plan['objects'] if rel.endswith(('.webp','.avif'))))
        oss.verify_local(output)

    def test_missing_resources_and_new_output_requirement(self):
        p = self.source/'assets/site.css'
        p.write_bytes(b'body{background:url(/missing.webp)}')
        manifest = oss.read(self.source/oss.MANIFEST)
        manifest['files'] = {k:v for k,v in oss.inventory(self.source).items() if k != oss.MANIFEST}
        oss.write(self.source/oss.MANIFEST, manifest)
        with self.assertRaisesRegex(ValueError, 'Missing local resources'):
            self.prepare()
        with self.assertRaisesRegex(ValueError, 'new directory'):
            self.prepare()

    def test_remote_get_hash_cors_mime_and_video_range(self):
        served = {}
        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                obj, body = served[self.path]
                byte_range = self.headers.get('Range')
                if byte_range:
                    end = int(byte_range.split('-')[1])
                    self.send_response(206)
                    self.send_header('Content-Range', f'bytes 0-{end}/{len(body)}')
                    body = body[:end+1]
                else:
                    self.send_response(200)
                self.send_header('Content-Type', obj['content_type'])
                self.send_header('Access-Control-Allow-Origin', self.headers['Origin'])
                self.send_header('x-oss-meta-sha256', obj['sha256'])
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            def log_message(self, *_):
                pass
        server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            output, plan = self.prepare(f'http://127.0.0.1:{server.server_port}', True)
            for rel, obj in plan['objects'].items():
                served['/' + obj['key']] = obj, (output/'oss'/rel).read_bytes()
            report = oss.verify_remote(output, workers=2)
            self.assertTrue(report['html_ready'])
            with self.assertRaisesRegex(ValueError, 'loopback rehearsal'):
                oss.seal_remote(output)
            rel = 'projects/demo/assets/hero.mp4'
            self.assertEqual(report['objects'][rel]['range']['http'], 206)
            obj = plan['objects'][rel]
            served['/' + obj['key']] = obj, b'wrong remote content'
            with self.assertRaisesRegex(ValueError, 'remote objects failed'):
                oss.verify_remote(output, workers=2)
            self.assertFalse(oss.read(output/'remote-verification.json')['html_ready'])
        finally:
            server.shutdown()
            server.server_close()

    def test_release_requires_bound_get_evidence_and_rejects_changed_contract(self):
        output, plan = self.prepare()
        manifest = oss.read(output/'github'/oss.MANIFEST)
        with self.assertRaisesRegex(ValueError, 'GET evidence'):
            oss.verify_manifest(manifest)
        # The network/body verifier has separate real HTTP positive/negative
        # coverage. These cases verify that CI cannot accept stale or partial
        # receipts, metadata-only checks, a wrong target or a missing range.
        rows = {}
        for rel, obj in plan['objects'].items():
            row = {'status':'pass', 'http':200, 'bytes':obj['bytes'], 'sha256':obj['sha256'],
                   'content_type':obj['content_type'], 'headers':{'Access-Control-Allow-Origin':'https://wly0829.cn'}}
            if rel.endswith('.mp4'):
                body = (output/'oss'/rel).read_bytes()[:32]
                row['range'] = {'http':206, 'bytes':len(body), 'sha256':oss.hashlib.sha256(body).hexdigest(),
                                'content_range':f'bytes 0-{len(body)-1}/{obj["bytes"]}'}
            rows[rel] = row
        manifest['oss']['verification'] = {'schema':'wly.oss-remote-verification.v1',
            'release_id':plan['release_id'], 'verified_at_beijing':oss.stamp(), 'complete':True,
            'html_ready':True, 'failed':[], 'objects':rows,
            'method':'anonymous full GET body SHA256 plus MP4 byte range'}
        oss.verify_manifest(manifest)
        for change in ('stale', 'missing', 'body', 'cors', 'range', 'loopback', 'url'):
            altered = copy.deepcopy(manifest)
            proof = altered['oss']['verification']
            if change == 'stale': proof['release_id'] = 'another-release'
            elif change == 'missing': proof['objects'].pop('assets/main.js')
            elif change == 'body': proof['objects']['assets/main.js']['sha256'] = '0'*64
            elif change == 'cors': proof['objects']['assets/main.js']['headers'] = {}
            elif change == 'range': proof['objects']['projects/demo/assets/hero.mp4'].pop('range')
            elif change == 'loopback': altered['oss']['asset_base_url'] = 'http://127.0.0.1:8080'
            elif change == 'url': altered['oss']['objects']['assets/main.js']['url'] += '?wrong'
            with self.subTest(change=change), self.assertRaises(ValueError):
                oss.verify_manifest(altered)

    def test_seal_binds_actual_report_and_current_html_inventory(self):
        from unittest.mock import patch
        output, plan = self.prepare()
        # Use actual prepared bytes through urllib's response contract. This
        # validates sealing/replay without claiming a cloud transfer occurred.
        class Response:
            def __init__(self, rel, ranged):
                from email.message import Message
                obj = plan['objects'][rel]
                self.headers = Message()
                self.headers['Content-Type'] = obj['content_type']
                self.headers['Access-Control-Allow-Origin'] = 'https://wly0829.cn'
                self.body = (output/'oss'/rel).read_bytes()
                self.status = 206 if ranged else 200
                if ranged:
                    length = min(len(self.body),32)
                    self.headers['Content-Range'] = f'bytes 0-{length-1}/{len(self.body)}'
                    self.body = self.body[:length]
                self.offset = 0
            def read(self, n):
                result = self.body[self.offset:self.offset+n]; self.offset += len(result); return result
            def __enter__(self): return self
            def __exit__(self, *_): pass
        addresses = {obj['url']:rel for rel,obj in plan['objects'].items()}
        with patch.object(oss, 'urlopen', side_effect=lambda req, timeout:Response(addresses[req.full_url], req.has_header('Range'))):
            oss.verify_remote(output, workers=2)
        manifest = oss.seal_remote(output)
        oss.verify_manifest(manifest)
        oss.verify_local(output)
        spec = importlib.util.spec_from_file_location('test_hybrid_oss', ROOT/'scripts/hybrid-release.py')
        hybrid = importlib.util.module_from_spec(spec); spec.loader.exec_module(hybrid)
        hybrid.verify_release(output/'github')
        (output/'github/index.html').write_bytes(b'changed after sealing')
        with self.assertRaisesRegex(ValueError, 'Release bytes differ'):
            hybrid.verify_release(output/'github')

    def test_original_repository_and_resource_gates_still_check_remote_bodies(self):
        from email.message import Message
        from unittest.mock import patch
        (self.source/'404.html').write_bytes(b'<!doctype html><title>missing</title>')
        source_manifest = oss.read(self.source/oss.MANIFEST)
        source_manifest.update({'accepted_pages':['/', '/projects/demo/'], 'baseline_files':{}, 'release_overlay':{}})
        spec = importlib.util.spec_from_file_location('test_remote_content', ROOT/'scripts/hybrid-release.py')
        hybrid = importlib.util.module_from_spec(spec); spec.loader.exec_module(hybrid)
        # Keep downloaded test bodies in this test's own temporary directory.
        hybrid.ROOT = self.root/'mock-repo'
        (hybrid.ROOT/'scripts').mkdir(parents=True)
        shutil.copyfile(ROOT/'scripts/prepare-oss-release.py', hybrid.ROOT/'scripts/prepare-oss-release.py')
        for case in ('repository', 'missing_import', 'valid_import'):
            base = 'https://fixture-bucket.oss-cn-beijing.aliyuncs.com/releases/fixture-001/'
            body = (b'const r="https://github.com/wlyaaaaa/oss-test-unregistered";' if case=='repository' else
                    ('import "'+base+('assets/missing.js' if case=='missing_import' else 'assets/mod.js')+'";').encode())
            (self.source/'assets/main.js').write_bytes(body)
            source_manifest['files'] = {k:v for k,v in oss.inventory(self.source).items() if k!=oss.MANIFEST}
            oss.write(self.source/oss.MANIFEST, source_manifest)
            output = self.root/case
            plan = oss.prepare(self.source, 'https://fixture-bucket.oss-cn-beijing.aliyuncs.com', 'releases/fixture-001', output)
            addresses = {obj['url']:rel for rel,obj in plan['objects'].items()}
            class Response:
                def __init__(self, request):
                    rel = addresses[request.full_url]; obj = plan['objects'][rel]
                    self.headers = Message(); self.headers['Content-Type']=obj['content_type']
                    self.headers['Access-Control-Allow-Origin']='https://wly0829.cn'
                    self.body=(output/'oss'/rel).read_bytes();self.offset=0
                    self.status=206 if request.has_header('Range') else 200
                    if self.status==206:
                        size=len(self.body);self.body=self.body[:32]
                        self.headers['Content-Range']=f'bytes 0-{len(self.body)-1}/{size}'
                def read(self,n):
                    value=self.body[self.offset:self.offset+n];self.offset+=len(value);return value
                def __enter__(self):return self
                def __exit__(self,*_):pass
            serve=lambda request,timeout:Response(request)
            report=self.root/(case+'-gate.json')
            with self.subTest(case=case), patch.object(oss,'urlopen',side_effect=serve), patch('urllib.request.urlopen',side_effect=serve), patch.object(hybrid.builder,'PUBLIC_REPOS',{'wlyaaaaa/known-public'}):
                oss.verify_remote(output,workers=2);oss.seal_remote(output)
                if case=='valid_import':
                    self.assertEqual(hybrid.validate_content(output/'github',report)['status'],'pass')
                else:
                    with self.assertRaisesRegex(ValueError,'Hybrid content gate failed'):
                        hybrid.validate_content(output/'github',report)
                    result=oss.read(report)
                    if case=='repository':self.assertTrue(any(row['type']=='repository_not_public' for row in result['findings']))
                    else:self.assertTrue(any('assets/missing.js' in row['reference'] for row in result['missing_references']))

    def test_historical_asset_preparation_restores_only_named_home_entries(self):
        records=[{'id':identity,'href':'/'} for _ in range(2)
                 for identity in ('home-01-link-1-0','home-01-link-2-0')]
        home=('<header><a class="nav-link" href="/"><span data-label-text="怎么协作"></span></a>'
              '<a class="nav-link" href="/"><span data-label-text="驾驶舱"></span></a></header>'
              '<script id="page-data" type="application/json">'+json.dumps({'records':records},ensure_ascii=False)+'</script>'
              '<script src="/assets/main.js"></script>').encode()
        (self.source/'index.html').write_bytes(home)
        for route in ('projects/agents','cockpit'):
            path=self.source/route/'index.html';path.parent.mkdir(parents=True);path.write_bytes(b'<title>real target</title>')
        for case,target in (('fallback','/projects/agents/'),('restored','/how/')):
            if case=='restored':
                path=self.source/'how/index.html';path.parent.mkdir();path.write_bytes(b'<title>published how</title>')
            manifest=oss.read(self.source/oss.MANIFEST)
            manifest['files']={k:v for k,v in oss.inventory(self.source).items() if k!=oss.MANIFEST}
            oss.write(self.source/oss.MANIFEST,manifest)
            output=self.root/case
            plan=oss.prepare(self.source,'https://fixture-bucket.oss-cn-beijing.aliyuncs.com','releases/fixture-001',output,rewriter_version=3)
            proof=plan['home_entry_overlay']
            self.assertEqual(len(proof['changes']),6)
            self.assertEqual(proof['changes'][0]['target_href'],target)
            self.assertNotIn('native_navigation_changes',proof)
            self.assertEqual((self.source/'index.html').read_bytes(),home)
            oss.verify_local(output)

    def test_home_preparation_version_selects_exact_legacy_or_complete_current_navigation(self):
        records=[{'id':identity,'href':'/'} for _ in range(2)
                 for identity in ('home-01-link-1-0','home-01-link-2-0')]
        anchor=lambda label:'<a class="nav-link" href="/"><span data-label-text="'+label+'"></span></a>'
        home=('<header id="site-header">'+anchor('怎么协作')+anchor('驾驶舱')+'</header>'
              '<dialog id="menu">'+anchor('怎么协作')+anchor('驾驶舱')+'</dialog>'
              '<footer class="site-footer">'+anchor('怎么协作')+anchor('驾驶舱')+anchor('这个网页是怎么做的')+'</footer>'
              '<script id="page-data">'+json.dumps({'page':'home','url':'/','records':records},ensure_ascii=False)+'</script>'
              '<script src="/assets/main.js"></script>').encode()
        (self.source/'index.html').write_bytes(home)
        for route in ('how','cockpit','how-this-site','projects/agents'):
            path=self.source/route/'index.html';path.parent.mkdir(parents=True);path.write_bytes(('<title>'+route+'</title>').encode())
        manifest=oss.read(self.source/oss.MANIFEST)
        manifest['files']={k:v for k,v in oss.inventory(self.source).items()if k!=oss.MANIFEST};oss.write(self.source/oss.MANIFEST,manifest)
        previous=None
        for version in (1,2,3,4,5):
            with self.subTest(version=version):
                prepared,proof=oss.current_home_links(self.source,version)
                if version<4:
                    self.assertEqual(prepared.count(b'href="/"'),5)
                    self.assertNotIn('native_navigation_changes',proof)
                    if previous:self.assertEqual((prepared,proof),previous)
                    previous=(prepared,proof)
                else:
                    self.assertEqual(prepared.count(b'href="/"'),0)
                    self.assertEqual(len(proof['native_navigation_changes']),5)
                    self.assertIn(b'href="/how-this-site/"',prepared)
                output=self.root/('version-'+str(version))
                plan=oss.prepare(self.source,'https://fixture-bucket.oss-cn-beijing.aliyuncs.com','releases/fixture-001',output,rewriter_version=version)
                self.assertEqual(plan['home_entry_overlay'],proof)
                self.assertEqual(oss.verify_local(output)['rewriter_version'],version)
        self.assertEqual((self.source/'index.html').read_bytes(),home)


if __name__ == '__main__':
    unittest.main()

"""Loopback-only static preview and DOM acceptance receiver. No publishing actions."""
import argparse
import ast
from datetime import datetime, timezone, timedelta
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
from pathlib import Path
import re
import threading
from urllib.parse import urlsplit, parse_qs, unquote

HERE=Path(__file__).resolve().parent

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root',type=Path,required=True)
    ap.add_argument('--build-report',type=Path,required=True)
    ap.add_argument('--verification-out',type=Path,required=True)
    ap.add_argument('--port',type=int,default=63415)
    ap.add_argument('--typeset-root',type=Path)
    ap.add_argument('--geometry-out',type=Path)
    ap.add_argument('--legacy-site',type=Path)
    args=ap.parse_args()
    root=args.root.resolve(); report=args.build_report.resolve(); result=args.verification_out.resolve()
    resource_paths={};resource_hashes={}
    result_lock=threading.Lock()
    def resource_url(path):
        path=Path(path).resolve();stat=path.stat()if path.is_file()else None;key=hashlib.sha256((str(path)+(':'+str(stat.st_size)+':'+str(stat.st_mtime_ns)if stat else ':missing')).encode()).hexdigest();resource_paths[key]=path
        return '/__typeset/resource/'+key+path.suffix
    def rewrite_resources(text,owner):
        def file_url(match):
            uri=match if isinstance(match,str)else match[0];parts=urlsplit(uri);path=unquote(parts.path)
            if re.match(r'^/[A-Za-z]:',path):path=path[1:]
            return resource_url(Path(path))
        if Path(owner).suffix=='.html':
            text=re.sub(r'((?:src|href|poster)=["\'])(file:///[^"\'<>]+)',lambda match:match[1]+file_url(match[2]),text)
        else:text=re.sub(r'file:///[^\s"\'<>\)]+',file_url,text)
        if Path(owner).suffix=='.css':
            def relative_url(match):
                value=match[1]
                if value.startswith(('data:','http:','https:','/','#')):return match[0]
                return 'url("'+resource_url(Path(owner).parent/unquote(value))+'")'
            text=re.sub(r'url\(["\']?([^\s\)"\']+)["\']?\)',relative_url,text)
        return text
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self,*a,**kw):super().__init__(*a,directory=str(root),**kw)
        def log_message(self,*a):pass
        def send(self,body,kind='application/json',code=200,cache='no-store'):
            if not isinstance(body,bytes):body=body.encode('utf8')
            self.send_response(code);self.send_header('Content-Type',kind+'; charset=utf-8');self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control',cache);self.end_headers();self.wfile.write(body)
        def do_GET(self):
            path=urlsplit(self.path).path
            if path=='/__typeset/qa':
                return self.send((HERE/'typeset-qa.html').read_text('utf8'),'text/html')
            if path=='/__typeset/qa.js':
                return self.send((HERE/'typeset-qa.js').read_text('utf8'),'text/javascript')
            if path=='/__typeset/measure':
                return self.send((HERE/'typeset-measure.html').read_text('utf8'),'text/html')
            if path=='/__typeset/measure.js':
                return self.send((HERE/'typeset-measure.js').read_text('utf8'),'text/javascript')
            if path=='/__typeset/geometry-plan':
                if not args.typeset_root:return self.send('typeset-root required',code=400)
                legacy=args.legacy_site
                if not legacy:
                    build=json.loads(report.read_text('utf8'))
                    bases=[Path(p)for entry in build['pages'].values()for p in entry.get('inputs',{})if Path(p).suffix=='.html']
                    legacy=next((ancestor for base in bases for ancestor in base.parents if ancestor.name=='site'),None)
                inventory=args.typeset_root.parent/'typeset-inventory'/'screens.jsonl'
                sources={row['page']:row['source_path']for row in (json.loads(line)for line in inventory.read_text('utf8').splitlines()if line.strip())}
                plan=[]
                for mp in sorted(args.typeset_root.glob('*/page-manifest.json')):
                    manifest=json.loads(mp.read_text('utf8'))
                    source=json.loads(Path(sources[manifest['page']]).read_text('utf8'));url=source.get('url')or source.get('source_url')or('/404.html'if manifest['page']=='404'else'/'+manifest['page']+'/')
                    legacy_file=legacy/(url.lstrip('/')+'index.html'if url.endswith('/')else url.lstrip('/'))if legacy else None
                    legacy_data={};motion_source=None
                    if legacy_file and legacy_file.is_file():
                        payload=legacy_file.read_bytes();match=re.search(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>',payload.decode('utf8'),re.S)
                        if match:legacy_data={screen['id']:screen for screen in json.loads(match[1])['screens']};motion_source={'path':str(legacy_file.resolve()),'sha256':hashlib.sha256(payload).hexdigest(),'bytes':len(payload)}
                    for sc in manifest['screens']:
                        for orient in ['h','v']:
                            images=[x for x in sc['images']if x['orientation']==orient]
                            hp=mp.parent/'html'/f'{sc["screen"]}-{orient}.html'
                            if not images or not hp.is_file():continue
                            parts=[]
                            for im in images:
                                ip=mp.parent/im['image'];payload=ip.read_bytes();import struct
                                w,h=struct.unpack('>II',payload[16:24]);parts.append({'image':im['image'],'size':[w,h],'sha256':hashlib.sha256(payload).hexdigest()})
                            plan.append({'page':manifest['page'],'screen':sc['screen'],'orientation':orient,
                                         'html':str(hp.resolve()),'html_sha256':hashlib.sha256(hp.read_bytes()).hexdigest(),
                                         'url':'/__typeset/reference/'+manifest['page']+'/'+hp.name,
                                         'viewport_width':1672 if orient=='h' else 941,'parts':parts,
                                         'motion_numbers':legacy_data.get(sc['screen'],{}).get('layouts',{}).get(orient,{}).get('numbers',[]),'motion_source':motion_source,
                                         'source_height':sum(x['size'][1]for x in parts)-30*(len(parts)-1)})
                return self.send(json.dumps(plan,ensure_ascii=False))
            if path=='/__typeset/geometry-existing':
                return self.send(args.geometry_out.read_bytes() if args.geometry_out and args.geometry_out.exists() else '{"records":[]}')
            if path=='/__typeset/geometry-fit':
                source=args.typeset_root.parent/'typeset-proto'/'engine'/'render.py'
                payload=source.read_bytes();tree=ast.parse(payload.decode('utf8'))
                script=next(ast.literal_eval(node.value)for node in tree.body if isinstance(node,ast.Assign)and any(isinstance(target,ast.Name)and target.id=='FIT_JS'for target in node.targets))
                return self.send(json.dumps({'javascript':script,'input':{'path':str(source.resolve()),'sha256':hashlib.sha256(payload).hexdigest(),'bytes':len(payload)}}))
            if path.startswith('/__typeset/reference/'):
                if not args.typeset_root:return self.send('typeset-root required',code=400)
                fields=path.split('/')
                hp=args.typeset_root/fields[-2]/'html'/fields[-1]
                reference=rewrite_resources(hp.read_text('utf8'),hp)
                reference=reference.replace('</head>','<style>html,body{scrollbar-width:none}::-webkit-scrollbar{display:none}</style></head>')
                return self.send(reference,'text/html')
            if path.startswith('/__typeset/resource/'):
                key=Path(path).stem;rp=resource_paths.get(key)
                if not rp or not rp.is_file():return self.send('resource missing',code=404)
                if rp.suffix=='.css':return self.send(rewrite_resources(rp.read_text('utf8'),rp),'text/css')
                payload=rp.read_bytes();resource_hashes[key]=hashlib.sha256(payload).hexdigest()
                return self.send(payload,mimetypes.guess_type(rp.name)[0]or'application/octet-stream',cache='max-age=3600, immutable')
            if path=='/__typeset/build-report':
                d=json.loads(report.read_text('utf8'));d['build_report_sha256']=hashlib.sha256(report.read_bytes()).hexdigest()
                return self.send(json.dumps(d,ensure_ascii=False))
            if path=='/__typeset/result':
                return self.send(result.read_bytes() if result.exists() else '{"status":"running"}')
            if path=='/__status':
                # No fabricated live snapshot and no repeated external calls during local acceptance.
                return self.send('{"state":"unavailable","reason":"local_preview_has_no_live_provider"}')
            return super().do_GET()
        def do_POST(self):
            if urlsplit(self.path).path=='/__typeset/geometry':
                if not args.geometry_out:return self.send('geometry-out required',code=400)
                body=json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))))
                if body.get('schema')!='wly.typeset-geometry.v1':return self.send('schema mismatch',code=400)
                for record in body['records']:
                    for item in record.get('illustrations',[]):
                        key=Path(urlsplit(item['src']).path).stem
                        if key in resource_paths:
                            item['reference_src']=str(resource_paths[key]);item['reference_sha256']=resource_hashes.get(key)or hashlib.sha256(resource_paths[key].read_bytes()).hexdigest()
                args.geometry_out.parent.mkdir(parents=True,exist_ok=True);args.geometry_out.write_text(json.dumps(body,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
                return self.send('{"saved":true}')
            if urlsplit(self.path).path!='/__typeset/result':return self.send('unknown',code=404)
            length=int(self.headers.get('Content-Length','0'))
            if not 0<length<20_000_000:return self.send('invalid body',code=400)
            d=json.loads(self.rfile.read(length));build=json.loads(report.read_text('utf8'))
            if d.get('schema')!='wly.typeset-verification.v1' or d.get('build_report_sha256')!=hashlib.sha256(report.read_bytes()).hexdigest() or d.get('release_id')!=build['release_id']:
                return self.send('evidence generation mismatch',code=409)
            d['verified_at_beijing']=datetime.now(timezone(timedelta(hours=8))).isoformat()
            with result_lock:
                if result.exists():
                    previous=json.loads(result.read_text('utf8'))
                    if previous.get('build_report_sha256')==d['build_report_sha256']and previous.get('release_id')==d['release_id']:
                        d['pages']={**previous.get('pages',{}),**d['pages']}
                d['summary']={'passed':sum(p.get('status')=='pass'for p in d['pages'].values()),'failed':sum(p.get('status')=='fail'for p in d['pages'].values()),'checked':len(d['pages']),'unverified':[p for p in build['pages']if p not in d['pages']]}
                result.parent.mkdir(parents=True,exist_ok=True);result.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
            return self.send('{"saved":true}')
    server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    print('Preview http://127.0.0.1:'+str(server.server_port)+' ; DOM acceptance /__typeset/qa',flush=True)
    server.serve_forever()

if __name__=='__main__':main()

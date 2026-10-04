"""Prepare resource recovery for the next release, preserving all original bytes."""
from __future__ import annotations
import argparse
from datetime import datetime,timedelta,timezone
import hashlib,json,re,shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

HERE=Path(__file__).resolve().parent
MARKER='data-resource-retry="next-2e"'
def stamp(path):
    body=Path(path).read_bytes();return {'sha256':hashlib.sha256(body).hexdigest(),'bytes':len(body)}
def inventory(root):
    return {p.relative_to(root).as_posix():stamp(p)for p in sorted(root.rglob('*'))if p.is_file()and p.relative_to(root).as_posix()!='release-manifest.json'}
def identity(files,manifest):
    if manifest.get('schema')!='wly.hybrid-release.v1':raise ValueError('Unsupported release schema')
    overlay=manifest.get('runtime_overlay')
    if overlay is not None and (overlay.get('schema')!='wly.oss-video-runtime.v1'or overlay.get('status')!='prepared'):raise ValueError('Unsupported runtime overlay')
    return hashlib.sha256(json.dumps(files,sort_keys=True,**({'separators':(',',':')}if overlay else{})).encode()).hexdigest()
class Resources(HTMLParser):
    def __init__(self):super().__init__();self.rows=[]
    def handle_starttag(self,tag,attrs):
        if tag in ('img','source','script'):
            data=dict(attrs);self.rows.append({'tag':tag,**{k:v for k,v in data.items()if k in ('src','srcset','data-src','data-srcset','loading','type','media','crossorigin')}})
def asset_origin(asset_base_url):
    if asset_base_url is None:return None
    if not isinstance(asset_base_url,str) or not asset_base_url or re.search(r'[\s\\?#]',asset_base_url):
        raise ValueError('Asset base URL must be an absolute HTTPS URL without credentials, query or fragment')
    try:
        parsed=urlsplit(asset_base_url);host=parsed.hostname;port=parsed.port
    except ValueError as error:raise ValueError('Invalid asset base URL') from error
    if parsed.scheme!='https' or not host or parsed.username is not None or parsed.password is not None or (port is not None and not 1<=port<=65535):
        raise ValueError('Asset base URL must be an absolute HTTPS URL without credentials')
    if len(host)>253 or any(len(label)>63 for label in host.split('.')) or not re.fullmatch(r'[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*',host):
        raise ValueError('Invalid asset base URL host')
    return 'https://'+host+(':'+str(port) if port is not None and port!=443 else '')

def policy_and_observation(baseline,files,asset_base_url=None):
    policy={'origins':[],'scripts':['/'+p for p in files if p.endswith('.js')],'data':['/'+p for p in files if p.endswith('.json')and not re.search(r'(^|/)(api|status|authorization|authorize)(/|\.)',p)]}
    explicit_origin=asset_origin(asset_base_url)
    origins={explicit_origin} if explicit_origin else set();pages={};dynamic=[]
    for rel in files:
        path=baseline/rel
        if rel.endswith('.html'):
            parser=Resources();parser.feed(path.read_text('utf8'));pages[rel]=parser.rows
            for row in parser.rows:
                for key in ('src','srcset','data-src','data-srcset'):
                    for item in row.get(key,'').split(','):
                        fields=item.strip().split()
                        if not fields:continue
                        u=urlsplit(fields[0])
                        if u.scheme in ('http','https')and re.search(r'\.(avif|webp|png|jpe?g|gif|svg|ico|js|json)$',u.path,re.I):origins.add(u.scheme+'://'+u.netloc)
        elif rel.endswith('.js'):
            text=path.read_text('utf8')
            findings={'dynamic_imports':len(re.findall(r'\bimport\s*\(',text)),'dynamic_script_creates':len(re.findall(r'createElement\(["\x27]script["\x27]',text)),'fetches':len(re.findall(r'\bfetch\s*\(',text))}
            if any(findings.values()):dynamic.append({'path':rel,**findings})
    for entry in baseline_manifest_objects(baseline):
        url=entry.get('url','');u=urlsplit(url)
        if u.scheme not in ('http','https'):continue
        origins.add(u.scheme+'://'+u.netloc)
        if u.path.endswith('.js'):policy['scripts'].append(url)
        elif u.path.endswith('.json')and'/api/'not in u.path:policy['data'].append(url)
    policy['origins']=sorted(origins)
    return policy,{'html_resources':pages,'js_loading_sites':dynamic,'public_static_json_files':policy['data'],'public_static_scripts':len(policy['scripts'])}
def baseline_manifest_objects(root):return json.loads((root/'release-manifest.json').read_text('utf8')).get('oss',{}).get('objects',{}).values()
def prepare(baseline,output,report,pages=None,asset_base_url=None):
    baseline,output=Path(baseline).resolve(),Path(output).resolve()
    if output.exists()or output==baseline or output.is_relative_to(baseline):raise ValueError('Choose a fresh output outside baseline')
    manifest=json.loads((baseline/'release-manifest.json').read_text('utf8'));before=inventory(baseline)
    if before!=manifest['files']or identity(before,manifest)!=manifest['release_id']:raise ValueError('Baseline files/RID not exactly bound')
    if manifest.get('resource_retry_preparation'):raise ValueError('Already prepared; replay from current complete source')
    policy,observed=policy_and_observation(baseline,before,asset_base_url)
    raw_runtime=(HERE/'resource-retry-runtime.js').read_text('utf8')
    if raw_runtime.count('__RESOURCE_RETRY_POLICY__')!=1:raise ValueError('Runtime policy marker differs')
    runtime=raw_runtime.replace('__RESOURCE_RETRY_POLICY__',json.dumps(policy,ensure_ascii=False,separators=(',',':'))).encode()
    runtime_rel='_shared/resource-retry-'+hashlib.sha256(runtime).hexdigest()[:20]+'.js'
    addition='\n<script '+MARKER+' src="/'+runtime_rel+'"></script>\n'
    selected=set(pages or observed['html_resources']);changes={}
    if not selected<=set(observed['html_resources']):raise ValueError('Selected page missing from complete source')
    for rel in selected:
        raw=(baseline/rel).read_bytes()
        if MARKER.encode()in raw:raise ValueError('Page already has resource recovery')
        if raw.count(b'</head>')!=1:raise ValueError('Expected one head close: '+rel)
        # A small blocking resource listener installs before deferred readers.
        # Existing static/inline scripts and their order stay byte-exact.
        changes[rel]=raw.replace(b'</head>',addition.encode()+b'</head>',1)
    shutil.copytree(baseline,output)
    (output/runtime_rel).parent.mkdir(parents=True,exist_ok=True);(output/runtime_rel).write_bytes(runtime)
    for rel,raw in changes.items():(output/rel).write_bytes(raw)
    after=inventory(output)
    assert all(after[rel]==entry for rel,entry in before.items()if rel not in changes)
    assert all((output/rel).read_bytes().replace(addition.encode(),b'',1)==(baseline/rel).read_bytes()for rel in changes)
    rid=identity(after,manifest);old_rid=manifest['release_id']
    manifest.update({'files':after,'release_id':rid,'resource_retry_preparation':{'status':'next_2e_prepared_pending_acceptance','baseline_release_id':old_rid,'runtime':runtime_rel,'addition':addition,'changed_html':sorted(changes),'old_page_evidence_is_not_new_acceptance':True}})
    (output/'release-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    result={'schema':'wly.resource-retry-preparation.v1','status':'prepared_next_2e_only','prepared_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),'baseline':str(baseline),'output':str(output),'baseline_release_id':old_rid,'release_id':rid,'files':len(after),'html_count':sum(r.endswith('.html')for r in after),'changed_html':sorted(changes),'runtime':runtime_rel,'runtime_stamp':stamp(output/runtime_rel),'original_files_preserved':True,'rollback_byte_exact':True,'observation':observed,'policy':policy,'published':False}
    report=Path(report);report.parent.mkdir(parents=True,exist_ok=True);report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8');return result
def rollback(baseline,output,report):
    baseline,output=Path(baseline).resolve(),Path(output).resolve()
    if output.exists()or output.is_relative_to(baseline):raise ValueError('Choose fresh rollback output')
    manifest=json.loads((baseline/'release-manifest.json').read_text('utf8'));files=inventory(baseline)
    if files!=manifest['files']or identity(files,manifest)!=manifest['release_id']:raise ValueError('Candidate inventory/RID differs')
    info=manifest.pop('resource_retry_preparation');addition=info['addition'].encode()
    bodies={}
    for rel in info['changed_html']:
        body=(baseline/rel).read_bytes()
        if body.count(addition)!=1:raise ValueError('Review newer HTML before rollback')
        bodies[rel]=body.replace(addition,b'',1)
    shutil.copytree(baseline,output)
    for rel,body in bodies.items():(output/rel).write_bytes(body)
    after=inventory(output);rid=identity(after,manifest);manifest.update(files=after,release_id=rid)
    (output/'release-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    result={'status':'prepared_static_rollback','release_id':rid,'output':str(output),'unused_runtime_retained':True,'published':False};Path(report).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8');return result
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    for name in ('baseline','output','report'):ap.add_argument('--'+name,type=Path,required=True)
    ap.add_argument('--pages',nargs='+');ap.add_argument('--rollback',action='store_true')
    ap.add_argument('--asset-base-url',help='Explicit HTTPS asset base used by the subsequent OSS split; only its exact origin is allowed')
    args=ap.parse_args()
    if args.rollback and args.asset_base_url is not None:ap.error('--asset-base-url applies only to preparation')
    result=rollback(args.baseline,args.output,args.report)if args.rollback else prepare(args.baseline,args.output,args.report,args.pages,asset_base_url=args.asset_base_url)
    print(json.dumps({k:result[k]for k in ('status','release_id','files','html_count','published')if k in result},ensure_ascii=False))
if __name__=='__main__':main()

"""Prepare resource recovery for the next release, preserving all original bytes."""
from __future__ import annotations
import importlib.util
import argparse
from datetime import datetime,timedelta,timezone
import hashlib,html,json,re,shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin,urlsplit
spec = importlib.util.spec_from_file_location('release_asset_builder', Path(__file__).with_name('build-assembled-site.py'))
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
try:
    from release_delta import inventory, source_path, write_changes
except ModuleNotFoundError:
    from scripts.release_delta import inventory, source_path, write_changes

HERE=Path(__file__).resolve().parent
MARKER='data-resource-retry="next-2e"'
INITIAL_ATTRIBUTE=b' data-resource-retry-initial="1"'
STYLESHEET_ATTRIBUTE=b' data-resource-retry-stylesheet="1"'
INITIAL_CAPTURE='\n<script data-resource-retry-capture="next-2e">(()=>{const marked=e=>e.isTrusted&&(e.target instanceof HTMLImageElement||(e.target instanceof HTMLScriptElement&&e.target.hasAttribute("data-resource-retry-initial"))||(e.target instanceof HTMLLinkElement&&e.target.rel.toLowerCase().split(/\\s+/).includes("stylesheet")&&e.target.hasAttribute("data-resource-retry-stylesheet")));document.addEventListener("error",e=>{if(marked(e))e.target.setAttribute("data-resource-retry-failed","1")},true);document.addEventListener("load",e=>{if(marked(e))e.target.removeAttribute("data-resource-retry-failed")},true)})();</script>\n'
INITIAL_CAPTURE=INITIAL_CAPTURE.replace('</script>',(HERE/'image-loading-runtime.js').read_text('utf8').replace('</script','<\\/script')+'</script>')

def mark_initial_stylesheets(raw,rel,policy):
    allowed={urljoin('https://wly0829.cn/',value) for value in policy['stylesheets']};marked=[]
    def mark(match):
        opening=match[0]
        attrs={key.decode().lower():html.unescape(value.decode('utf8')) for key,_,value in re.findall(br'([\w-]+)\s*=\s*(["\x27])(.*?)\2',opening,re.S)}
        value=attrs.get('href')
        if 'stylesheet' not in attrs.get('rel','').lower().split() or not value or urljoin('https://wly0829.cn/'+rel,value) not in allowed:return opening
        if STYLESHEET_ATTRIBUTE.strip() in opening:raise ValueError('Initial stylesheet already marked')
        marked.append(value);return opening[:-1]+STYLESHEET_ATTRIBUTE+opening[-1:]
    # Existing inline handlers can contain `>` (for example an arrow function).
    # Keep quoted attribute values whole while only adding the recovery marker.
    return re.sub(br'''<link\b(?:[^"'<>]|"[^"]*"|'[^']*')*>''',mark,raw,flags=re.I),marked

def mark_initial_scripts(raw,rel,policy):
    allowed={urljoin('https://wly0829.cn/',value) for value in policy['scripts']};marked=[]
    def mark(match):
        opening=match[0];src=re.search(br'(?<![\w-])src\s*=\s*(["\x27])(.*?)\1',opening,re.I|re.S)
        if not src:return opening
        value=html.unescape(src[2].decode('utf8'));resolved=urljoin('https://wly0829.cn/'+rel,value)
        if resolved not in allowed:return opening
        if INITIAL_ATTRIBUTE.strip() in opening:raise ValueError('Initial script already marked')
        marked.append(value);return opening[:-1]+INITIAL_ATTRIBUTE+opening[-1:]
    return re.sub(br'<script\b[^>]*>',mark,raw,flags=re.I),marked
def stamp(path):
    body=Path(path).read_bytes();return {'sha256':hashlib.sha256(body).hexdigest(),'bytes':len(body)}
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
    policy={'origins':[],'scripts':['/'+p for p in files if p.endswith('.js')],'stylesheets':['/'+p for p in files if p.endswith('.css')],
            'data':['/'+p for p in files if p.endswith('.json')and not re.search(r'(^|/)(api|status|authorization|authorize)(/|\.)',p)]}
    explicit_origin=asset_origin(asset_base_url)
    origins={explicit_origin} if explicit_origin else set();pages={};dynamic=[]
    for rel in files:
        path=source_path(baseline, rel)
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
        elif u.path.endswith('.css'):policy['stylesheets'].append(url)
        elif u.path.endswith('.json')and'/api/'not in u.path:policy['data'].append(url)
    policy['origins']=sorted(origins)
    return policy,{'html_resources':pages,'js_loading_sites':dynamic,'public_static_json_files':policy['data'],'public_static_scripts':len(policy['scripts']),'public_static_stylesheets':policy['stylesheets']}
def baseline_manifest_objects(root):return json.loads((root/'release-manifest.json').read_text('utf8')).get('oss',{}).get('objects',{}).values()
def remove_previous_recovery(raw,info):
    """Remove only exact, bound predecessor additions, retaining byte restoration."""
    if MARKER.encode() not in raw:return raw,[]
    spans=[]
    for key in ('addition','initial_capture_addition'):
        addition=info[key].encode('utf8')
        serializations={addition,addition.replace(b'\n',b'\r\n')}
        if key=='addition':
            album=addition.replace(b'<script defer ',b'<script  ',1).replace(b' src="',b'  data-album-runtime data-src="',1)
            serializations.update((album,album.replace(b'\n',b'\r\n')))
        script=re.search(rb' src="([^"]+)"',addition)
        if key=='addition' and script:
            delayed=addition.replace(script[0][1:],b'',1).replace(b'defer',b'',1)
            delayed=delayed.replace(b'></script>',b' data-album-runtime data-src="'+script[1]+b'"></script>',1)
            serializations.update({delayed,delayed.replace(b'\n',b'\r\n')})
        matches=[value for value in serializations if raw.count(value)==1]
        if not matches and key=='addition':
            pattern=rb'\r?\n?<script\b(?=[^>]*data-resource-retry="next-2e")(?=[^>]*(?:data-)?src="/'+re.escape(info['runtime'].encode())+rb'")[^>]*>\s*</script>\r?\n?'
            matches=[match[0] for match in re.finditer(pattern,raw)]
        if len(matches)!=1:raise ValueError('Existing recovery does not match the bound predecessor: '+key)
        matched=matches[0];start=raw.index(matched);spans.append((start,start+len(matched)))
    for key in ('initial_script_attribute','initial_stylesheet_attribute'):
        addition=info.get(key,'').encode('utf8')
        if addition:
            spans.extend((m.start(),m.end())for m in re.finditer(re.escape(addition),raw))
    spans.sort();clean=b'';ledger=[];cursor=0
    for start,end in spans:
        if start<cursor:raise ValueError('Overlapping predecessor additions')
        clean+=raw[cursor:start];ledger.append({'offset':len(clean),'text':raw[start:end].decode('utf8')});cursor=end
    clean+=raw[cursor:]
    if MARKER.encode()in clean:raise ValueError('Unrecognized existing resource recovery')
    if restore_previous_recovery(clean,ledger)!=raw:raise AssertionError('Predecessor byte restoration differs')
    return clean,ledger

def restore_previous_recovery(raw,ledger):
    for entry in reversed(ledger):
        offset=entry['offset'];raw=raw[:offset]+entry['text'].encode('utf8')+raw[offset:]
    return raw

def prepare(baseline,output,report,pages=None,asset_base_url=None,previous_manifest=None):
    baseline,output=Path(baseline).resolve(),Path(output).resolve()
    if output.exists()or output==baseline or output.is_relative_to(baseline):raise ValueError('Choose a fresh output outside baseline')
    manifest=json.loads((baseline/'release-manifest.json').read_text('utf8'));before=inventory(baseline)
    if before!=manifest['files']or identity(before,manifest)!=manifest['release_id']:raise ValueError('Baseline files/RID not exactly bound')
    if manifest.get('resource_retry_preparation'):raise ValueError('Already prepared; replay from current complete source')
    previous=None;previous_proof=None;previous_restore={}
    if previous_manifest:
        previous_manifest=Path(previous_manifest).resolve();previous_proof={'path':str(previous_manifest),**stamp(previous_manifest)}
        predecessor=json.loads(previous_manifest.read_text('utf8'));previous=predecessor.get('resource_retry_preparation')
        if not previous:raise ValueError('Previous manifest lacks exact resource-recovery preparation')
        bound_runtime=predecessor['files'].get(previous['runtime'])
        if not bound_runtime or before.get(previous['runtime'])!=bound_runtime:
            raise ValueError('Existing recovery runtime differs from the bound predecessor')
    policy,observed=policy_and_observation(baseline,before,asset_base_url)
    raw_runtime=(HERE/'resource-retry-runtime.js').read_text('utf8')
    if raw_runtime.count('__RESOURCE_RETRY_POLICY__')!=1:raise ValueError('Runtime policy marker differs')
    from build_bird_guide import minify
    runtime=minify(raw_runtime.replace('__RESOURCE_RETRY_POLICY__',json.dumps(policy,ensure_ascii=False,separators=(',',':'))),'js','es2019')
    runtime_rel='_shared/resource-retry-'+hashlib.sha256(runtime).hexdigest()[:20]+'.js'
    addition='\n<script defer '+MARKER+' src="/'+runtime_rel+'"></script>\n'
    selected=set(pages or observed['html_resources']);changes={};initial_scripts={};initial_stylesheets={}
    if not selected<=set(observed['html_resources']):raise ValueError('Selected page missing from complete source')
    for rel in selected:
        raw=source_path(baseline, rel).read_bytes()
        if MARKER.encode()in raw:
            if not previous:raise ValueError('Page already has resource recovery')
            raw,previous_restore[rel]=remove_previous_recovery(raw,previous)
        if raw.count(b'</head>')!=1:raise ValueError('Expected one head close: '+rel)
        marked,initial_scripts[rel]=mark_initial_scripts(raw,rel,policy)
        marked,initial_stylesheets[rel]=mark_initial_stylesheets(marked,rel,policy)
        if len(re.findall(br'<head\b[^>]*>',marked,re.I))!=1:raise ValueError('Expected one head opening: '+rel)
        marked=re.sub(br'<head\b[^>]*>',lambda m:m[0]+INITIAL_CAPTURE.encode(),marked,count=1,flags=re.I)
        # The early inline observer only marks genuine element load errors.
        # Original script order and existing handlers remain in place.
        changes[rel]=marked.replace(b'</head>',addition.encode()+b'</head>',1)
    after=write_changes(baseline, output, {**changes, runtime_rel: runtime}, copy_asset=builder.copy_release_asset)
    assert all(after[rel]==entry for rel,entry in before.items()if rel not in changes)
    assert all(restore_previous_recovery(raw.replace(addition.encode(),b'',1).replace(INITIAL_CAPTURE.encode(),b'',1).replace(INITIAL_ATTRIBUTE,b'').replace(STYLESHEET_ATTRIBUTE,b''),previous_restore.get(rel,[]))==source_path(baseline,rel).read_bytes()for rel,raw in changes.items())
    rid=identity(after,manifest);old_rid=manifest['release_id']
    manifest.update({'files':after,'release_id':rid,'resource_retry_preparation':{'status':'next_2e_prepared_pending_acceptance','baseline_release_id':old_rid,'runtime':runtime_rel,'addition':addition,'initial_capture_addition':INITIAL_CAPTURE,'initial_script_attribute':INITIAL_ATTRIBUTE.decode(),'initial_stylesheet_attribute':STYLESHEET_ATTRIBUTE.decode(),'initial_scripts':initial_scripts,'initial_stylesheets':initial_stylesheets,'changed_html':sorted(changes),'old_page_evidence_is_not_new_acceptance':True}})
    if previous_proof:
        manifest['resource_retry_preparation'].update(previous_manifest=previous_proof,previous_html_restore=previous_restore)
        if stamp(previous_manifest)!={key:previous_proof[key]for key in ('sha256','bytes')}:raise ValueError('Previous manifest changed during replay')
    (output/'release-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    result={'schema':'wly.resource-retry-preparation.v1','status':'prepared_next_2e_only','prepared_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),'baseline':str(baseline),'output':str(output),'baseline_release_id':old_rid,'release_id':rid,'files':len(after),'html_count':sum(r.endswith('.html')for r in after),'changed_html':sorted(changes),'runtime':runtime_rel,'runtime_stamp':stamp(source_path(output,runtime_rel)),'inputs':{str(HERE/name):stamp(HERE/name) for name in ('image-loading-runtime.js','resource-retry-runtime.js','prepare-resource-retry.py')},'original_files_preserved':True,'rollback_byte_exact':True,'observation':observed,'policy':policy,'published':False}
    report=Path(report);report.parent.mkdir(parents=True,exist_ok=True);report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8');return result
def rollback(baseline,output,report):
    baseline,output=Path(baseline).resolve(),Path(output).resolve()
    if output.exists()or output.is_relative_to(baseline):raise ValueError('Choose fresh rollback output')
    manifest=json.loads((baseline/'release-manifest.json').read_text('utf8'));files=inventory(baseline)
    if files!=manifest['files']or identity(files,manifest)!=manifest['release_id']:raise ValueError('Candidate inventory/RID differs')
    info=manifest.pop('resource_retry_preparation');addition=info['addition'].encode()
    bodies={}
    for rel in info['changed_html']:
        body=source_path(baseline, rel).read_bytes()
        if body.count(addition)!=1:raise ValueError('Review newer HTML before rollback')
        restored=body.replace(addition,b'',1)
        if info.get('initial_capture_addition'):
            capture=info['initial_capture_addition'].encode()
            if restored.count(capture)!=1:raise ValueError('Review newer initial capture before rollback')
            restored=restored.replace(capture,b'',1).replace(info['initial_script_attribute'].encode(),b'')
            if info.get('initial_stylesheet_attribute'):restored=restored.replace(info['initial_stylesheet_attribute'].encode(),b'')
        bodies[rel]=restore_previous_recovery(restored,info.get('previous_html_restore',{}).get(rel,[]))
    after=write_changes(baseline, output, bodies, copy_asset=builder.copy_release_asset);rid=identity(after,manifest);manifest.update(files=after,release_id=rid)
    (output/'release-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    result={'status':'prepared_static_rollback','release_id':rid,'output':str(output),'unused_runtime_retained':True,'published':False};Path(report).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8');return result
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    for name in ('baseline','output','report'):ap.add_argument('--'+name,type=Path,required=True)
    ap.add_argument('--pages',nargs='+');ap.add_argument('--rollback',action='store_true')
    ap.add_argument('--asset-base-url',help='Explicit HTTPS asset base used by the subsequent OSS split; only its exact origin is allowed')
    ap.add_argument('--previous-manifest',type=Path,help='Bound exact predecessor additions to replay recovery on retained pages')
    args=ap.parse_args()
    if args.rollback and args.asset_base_url is not None:ap.error('--asset-base-url applies only to preparation')
    result=rollback(args.baseline,args.output,args.report)if args.rollback else prepare(args.baseline,args.output,args.report,args.pages,asset_base_url=args.asset_base_url,previous_manifest=args.previous_manifest)
    print(json.dumps({k:result[k]for k in ('status','release_id','files','html_count','published')if k in result},ensure_ascii=False))
if __name__=='__main__':main()

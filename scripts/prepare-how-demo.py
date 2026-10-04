"""Replay approved how-demo v3 into a complete immutable website source.

Only one new screen and its generated search projection are introduced. Existing
how PNGs, typography, hotspots and page-data stay unchanged. No publishing.
"""
from __future__ import annotations
import argparse
from copy import deepcopy
from datetime import datetime, timedelta, timezone
import hashlib
import html
import json
from pathlib import Path
import re
import shutil
from urllib.parse import unquote, urljoin, urlsplit

HERE=Path(__file__).resolve().parent
SCREEN='one-sentence'
MARKER_START='<!-- how-demo-v3:start -->'
MARKER_END='<!-- how-demo-v3:end -->'


def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))


def digest(path):
    with Path(path).open('rb') as f: return hashlib.file_digest(f,'sha256').hexdigest()


def inventory(root):
    return {p.relative_to(root).as_posix():{'sha256':digest(p),'bytes':p.stat().st_size}
            for p in sorted(root.rglob('*')) if p.is_file() and p.name!='release-manifest.json'}


def local_file(root,url,owner):
    parts=urlsplit(url)
    path=unquote(parts.path)
    if not parts.netloc:
        candidate=(root/urljoin('/'+owner,path).lstrip('/')).resolve()
        return candidate if candidate.is_relative_to(root) and candidate.is_file() else None
    chunks=path.lstrip('/').split('/')
    return next((root.joinpath(*chunks[i:]) for i in range(len(chunks)) if root.joinpath(*chunks[i:]).is_file()),None)


def canonical_data():
    return read(HERE/'how-demo-data.json')


def resolve(data,value):
    if value.startswith('@model:'): return data['models'][value[7:]]
    if value.startswith('@shared:'): return data['shared'][value[8:]]
    return value


def story_text(data,story):
    words=[story['say'],story['who']]
    for i,r in enumerate(story['rows']):
        words += [f"{data['ui']['taskPrefix']} {i+1} {data['ui']['taskSuffix']}",r['task'],r['rule'],r['ruleTip'],r['take']['name'],r['take']['sub'],resolve(data,r['take']['tip']),r['model'],resolve(data,r['tip']),r['why']]
        if r.get('act'): words.append(r['act']['t'])
        words += [r['stamp']]
        if r.get('stamp2'): words.append(r['stamp2'])
    return '\n'.join(words+[story['result'],story['by']]+story['chips'])


def shared_text(data):
    ui=data['ui']
    return '\n'.join([ui[k] for k in ['title','intro','asideTitle','note','slotTip','resultLabel','resultTip','chipsLabel','goLabel']]+[h['t']+'：'+h['tip'] for h in data['heads']]+[l['text']+'：'+l['tip'] for l in ui['legend']]+ui['legendNotes'])


def transcript(data):
    return '\n'.join([shared_text(data)]+[story_text(data,s) for s in data['stories']])


def source_speed(root,text):
    data_match=re.search(r'<script[^>]*id="page-data"[^>]*>(.*?)</script>',text,re.S)
    page=json.loads(data_match[1]) if data_match else {}
    script=page.get('shared',{}).get('script_bundle')
    if not script:
        script=next(iter(re.findall(r'<script[^>]*src="([^\"]+)"[^>]*defer',text)),None)
    path=local_file(root,script,'how/index.html') if script else None
    if not path: raise ValueError('Cannot bind the actual site-wide motion speed script')
    js=path.read_text('utf8');marker='window.SiteMotionAppearance='
    if marker not in js: raise ValueError('Actual source lacks SiteMotionAppearance speed constant')
    config,_=json.JSONDecoder().raw_decode(js[js.index(marker)+len(marker):]);speed=config.get('speed_multiplier')
    if not isinstance(speed,(int,float)) or speed<=0: raise ValueError('Invalid bound site motion speed')
    return speed,{'path':str(path),'sha256':digest(path),'field':'SiteMotionAppearance.speed_multiplier'}


def render(data,speed):
    ui=data['ui'];esc=lambda value:html.escape(value,quote=True)
    encoded=json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
    return MARKER_START+f'''<section class="how-demo-screen" id="{SCREEN}" aria-labelledby="how-demo-title" data-how-demo-site-speed="{speed}">
<h2 class="how-demo-title" id="how-demo-title">{esc(ui['title'])}</h2><p class="how-demo-sub">{esc(ui['intro'])}</p>
<div class="app" id="how-demo-app"><svg id="how-demo-wires" aria-hidden="true"></svg><div id="how-demo-fly" aria-hidden="true"></div><img class="leaf" src="{esc(data['assets']['leaf-r']['src'])}" alt="">
<aside class="side"><h2>{esc(ui['asideTitle'])}</h2><div class="pick" id="how-demo-pick"></div><div class="ill" id="how-demo-ill"></div><p class="note">{esc(ui['note'])}</p><div class="legend" id="how-demo-legend"></div></aside>
<section class="stage" id="how-demo-stage" aria-live="polite"><div class="slotrow"><div class="slot" id="how-demo-slot" data-tip="{esc(ui['slotTip'])}" tabindex="0"><span class="who" id="how-demo-who"></span><span class="txt" id="how-demo-slottxt">&#160;</span></div></div><div class="grid" id="how-demo-grid"></div><div class="result" id="how-demo-result"></div></section></div>
<div id="how-demo-tip" role="tooltip"></div><div class="how-demo-transcript" data-screen-transcript="how-demo-v3">{esc(transcript(data))}</div>
<script type="application/json" data-how-demo-data>{encoded}</script></section>'''+MARKER_END


def prepare(args):
    source=args.source.resolve();out=args.out.resolve();evidence=args.evidence.resolve()
    if out.exists() or out.is_relative_to(source) or evidence.is_relative_to(source) or evidence.is_relative_to(out):
        raise ValueError('Output is a new directory outside Source; evidence is separate')
    manifest=read(source/'release-manifest.json');original=inventory(source)
    if original!=manifest['files']: raise ValueError('Complete source bytes do not match release inventory')
    if any(k not in original for k in manifest.get('oss',{}).get('objects',{})): raise ValueError('HTML-only OSS source cannot replay how-demo')
    before=(source/'how/index.html').read_bytes().decode('utf8')
    if not all('id="'+a+'"' in before for a in ['how-04','case-trip','case-restore','case-away']): raise ValueError('The real how division and three case anchors are required')
    source_data_match=re.search(r'<script[^>]*id="page-data"[^>]*>(.*?)</script>',before,re.S)
    source_page_data=source_data_match[0] if source_data_match else None
    speed,speed_proof=source_speed(source,before)
    data=deepcopy(canonical_data());specs=data.pop('assetSpecifications');assets={};proofs=[]
    by_hash={}
    for rel,meta in original.items():
        if Path(rel).suffix.lower()=='.png': by_hash.setdefault(meta['sha256'],rel)
    shutil.copytree(source,out)
    (out/'_how-demo/assets').mkdir(parents=True,exist_ok=True)
    for name,spec in specs.items():
        rel=by_hash.get(spec['sha256'])
        if not rel:
            src=args.assets_dir/spec['file'] if args.assets_dir else None
            if not src or not src.is_file() or digest(src)!=spec['sha256'] or src.stat().st_size!=spec['bytes']:
                raise ValueError('Missing unchanged approved source asset: '+spec['file']+'; pass --assets-dir assets/src')
            rel='_how-demo/assets/'+spec['sha256'][:20]+'-'+spec['file'];shutil.copyfile(src,out/rel)
        assets[name]={'src':'/'+rel,'size':spec['size'],**({'crop':spec['crop']} if spec.get('crop') else {})}
        proofs.append({'asset':name,'file':rel,'sha256':spec['sha256'],'bytes':spec['bytes'],'unchanged_original_byte':True})
    data['assets']=assets
    def bundle(name,payload,suffix):
        rel='_how-demo/'+name+'-'+hashlib.sha256(payload).hexdigest()[:20]+suffix;(out/rel).write_bytes(payload);return '/'+rel
    css=bundle('how-demo',(HERE/'how-demo-runtime.css').read_bytes(),'.css');js=bundle('how-demo',(HERE/'how-demo-runtime.js').read_bytes(),'.js')
    text=re.sub(re.escape(MARKER_START)+r'[\s\S]*?'+re.escape(MARKER_END),'',before)
    text=re.sub(r'<link\b[^>]*data-how-demo-bundle[^>]*>|<script\b[^>]*data-how-demo-bundle[^>]*>[\s\S]*?</script>','',text)
    insertion=text.index('</section>',text.index('id="how-04"'))+len('</section>')
    text=text[:insertion]+render(data,speed)+text[insertion:]
    album='data-album-runtime' in text
    starter=(f'<script data-album-runtime data-src="{js}" data-how-demo-bundle></script>' if album else f'<script src="{js}" defer data-how-demo-bundle></script>')
    text=text.replace('</head>',f'<link rel="stylesheet" href="{css}" data-how-demo-bundle>'+starter+'</head>')
    if source_page_data and source_page_data not in text: raise AssertionError('Existing 15-screen page-data changed')
    (out/'how/index.html').write_bytes(text.encode('utf8'))
    search_original=(source/'search-index.js').read_bytes().decode('utf8');prefix='window.__WLY_SEARCH_INDEX__='
    if not search_original.startswith(prefix): raise ValueError('Unknown existing search-index contract')
    arr,end=json.JSONDecoder().raw_decode(search_original[len(prefix):]);arr=[e for e in arr if e.get('origin')!='how-demo-v3']
    projected=[{'type':'协作示例','group':'系统','projectSlug':None,'title':data['ui']['title']+' · '+s['say'],'href':'/how/#one-sentence','detail':s['result'],'search':shared_text(data)+'\n'+story_text(data,s),'aliases':data['chipNames'],'scopes':['system'],'origin':'how-demo-v3'} for s in data['stories']]
    combined=prefix+json.dumps(arr+projected,ensure_ascii=False,separators=(',',':'))+search_original[len(prefix)+end:]
    search=bundle('how-demo-search',combined.encode('utf8'),'.js');updated=[]
    for rel in original:
        if not rel.endswith('.html'): continue
        target=out/rel;h=target.read_bytes().decode('utf8')
        newer=re.sub(r'(<script\b[^>]*\bsrc=["\'])([^"\']*(?:/search-index\.js|/_how-demo/how-demo-search-[a-f0-9]+\.js))(["\'])',lambda m:m[1]+search+m[3],h)
        if newer!=h: target.write_bytes(newer.encode('utf8'));updated.append(rel)
    files=inventory(out)
    if any(files.get(k)!=v for k,v in original.items() if not k.endswith('.html')): raise AssertionError('Original assets changed')
    rid=hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest()
    manifest['release_id']=rid;manifest['files']=files;manifest['how_demo_preparation']={'schema':'wly.how-demo-preparation.v1','status':'prepared_pending_root_acceptance','baseline_release_id':read(source/'release-manifest.json')['release_id'],'screen':SCREEN,'source_data_sha256':digest(HERE/'how-demo-data.json'),'speed':speed,'speed_source':speed_proof,'bundle':[js,css,search],'source_assets':proofs,'original_page_data_preserved':True,'anchors':['case-trip','case-restore','case-away']}
    (out/'release-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n','utf8')
    report={'status':'prepared','release_id':rid,'source_release_id':manifest['how_demo_preparation']['baseline_release_id'],'source':str(source),'candidate':str(out),'files':len(files),'original_how_screen_count':len(json.loads(source_data_match[1])['screens']),'original_page_data_preserved':True,'all_original_asset_bytes_preserved':True,'raw_asset_proofs':proofs,'search_html_references_updated':updated,'projected_search_entries':projected,'source_data_sha256':digest(HERE/'how-demo-data.json'),'speed':speed,'speed_source':speed_proof,'album_runtime_queue':album,'prepared_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat()}
    evidence.parent.mkdir(parents=True,exist_ok=True);evidence.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n','utf8')
    print(json.dumps({k:report[k] for k in ['status','release_id','files','original_how_screen_count','original_page_data_preserved','all_original_asset_bytes_preserved']},ensure_ascii=False))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',type=Path,required=True);parser.add_argument('--out',type=Path,required=True)
    parser.add_argument('--assets-dir',type=Path);parser.add_argument('--evidence',type=Path,required=True)
    prepare(parser.parse_args())

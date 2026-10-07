"""Apply source-bound image transcripts, public projection and existing-copy metadata.

This updates a local release directory only. It neither deploys nor edits its manifest.
"""
from __future__ import annotations
import argparse
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import urljoin, urlsplit

HERE=Path(__file__).resolve().parent
if str(HERE) not in sys.path: sys.path.insert(0,str(HERE))
from public_page_contract import public_page_data, public_search_records, local_values, omit_local_literals

PAGE_DATA=re.compile(r'(<script\b[^>]*\bid=["\']page-data["\'][^>]*>)(.*?)(</script>)',re.S|re.I)
SCREEN=re.compile(r'(<section\b[^>]*\bdata-screen=["\']([^"\']+)["\'][^>]*>)(.*?)(</section>)',re.S|re.I)
TRANSCRIPT=re.compile(r'<div\b[^>]*class="screen-equivalent-text"[^>]*>.*?</div><!-- /screen-equivalent-text -->',re.S)
STYLE='<style data-screen-transcript-style="true">.screen-equivalent-text{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;clip-path:inset(50%)!important;white-space:pre-wrap!important;border:0!important}.screen-equivalent-text [data-transcript-orientation="v"]{display:none}@media(max-width:767.98px){.screen-equivalent-text [data-transcript-orientation="h"]:has(+[data-transcript-orientation="v"]){display:none}.screen-equivalent-text [data-transcript-orientation="v"]{display:block}}</style>'
ORIGIN='https://wly0829.cn'

def digest(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def read_json(path): return json.loads(Path(path).read_text('utf-8-sig'))
def verified_bytes(path, proof):
    raw=Path(path).read_bytes()
    if hashlib.sha256(raw).hexdigest()!=proof['sha256'] or ('bytes' in proof and len(raw)!=proof['bytes']):
        raise ValueError('Source fingerprint changed: '+str(path))
    return raw

class RenderedBody(HTMLParser):
    """Read the actual rendered body's words, without CSS/scripts or source URLs."""
    def __init__(self):
        super().__init__(convert_charrefs=True);self.body=False;self.skip=0;self.parts=[]
    def handle_starttag(self,tag,attrs):
        if tag=='body':self.body=True
        if tag in {'script','style'}:self.skip+=1
        if self.body and not self.skip:
            if tag in {'p','div','section','article','tr','li','h1','h2','h3','h4','br'}:self.parts.append('\n')
            if tag=='img' and dict(attrs).get('alt'):self.parts.append(dict(attrs)['alt'])
    def handle_endtag(self,tag):
        if tag in {'script','style'}:self.skip=max(0,self.skip-1)
        if self.body and not self.skip and tag in {'p','div','section','article','tr','li','h1','h2','h3','h4'}:self.parts.append('\n')
        if tag=='body':self.body=False
    def handle_data(self,value):
        if self.body and not self.skip:self.parts.append(value)
    def text(self):
        return '\n'.join(line.strip() for line in ''.join(self.parts).splitlines() if line.strip())

def rendered_text(text):
    parser=RenderedBody();parser.feed(text);return parser.text()

def plain_authored_text(text):
    # Source typography markers have no spoken meaning. Words/numbers stay exact.
    text=re.sub(r'(?m)^#{1,6}\s*','',text)
    text=text.replace('**','').replace('〔','').replace('〕','').replace('`','')
    text=re.sub(r'(?m)^\|?\s*(?:[-:]+\s*\|\s*)+[-:]*\|?\s*$','',text)
    return text.strip()

def load_transcripts(coverage=None, home_source=None, home_receipt=None):
    """Return private local evidence; no source path is copied into public HTML."""
    records={};sources={};proofs=[]
    if coverage:
        c=read_json(coverage)
        if c.get('unverified_inputs'):raise ValueError('Coverage contains unverified source inputs')
        for page in c['pages']:
            source_entries=page.get('source_json',[])
            if not source_entries:raise ValueError('Missing finalized source for '+page['route'])
            source=json.loads(verified_bytes(source_entries[0]['path'],source_entries[0]))
            sources[page['route']]=source;by_screen={}
            for entry in page['verified_html_inputs']:
                raw=verified_bytes(entry['input'],entry)
                sid=entry['screen_id'];orientation='v' if Path(entry['input']).stem.endswith('-v') else 'h'
                text=rendered_text(raw.decode('utf-8-sig'))
                if not text:raise ValueError('Rendered image body is empty: '+sid)
                by_screen.setdefault(sid,{})[orientation]=text
                proofs.append({'route':page['route'],'screen':sid,'orientation':orientation,'sha256':entry['sha256']})
            if len(by_screen)!=page['current_screens'] or page.get('missing_screens'):
                raise ValueError('Transcript coverage incomplete: '+page['route'])
            records[page['route']]=by_screen
    if home_source or home_receipt:
        if not home_source or not home_receipt:raise ValueError('Homepage source and exact build receipt must be supplied together')
        receipt=read_json(home_receipt)
        raw=verified_bytes(home_source,{'sha256':receipt['source_hash']})
        source=json.loads(raw)
        if source.get('page')!='home' or receipt.get('page')!='home':raise ValueError('Homepage source identity mismatch')
        if {s['id'] for s in source['screens'] if not s.get('hidden')}!={s['id'] for s in receipt['screens']}:
            raise ValueError('Homepage source/receipt screens differ')
        sources['/']=source
        records['/']={s['id']:{'h':plain_authored_text(s['text'])} for s in source['screens'] if not s.get('hidden')}
        proofs.append({'route':'/','source_sha256':receipt['source_hash']})
    return records,sources,proofs

def install_transcripts(document, records, route, omissions=None, omit_local_paths=False):
    """Keep the visible image and attach the complete same-version explanation."""
    count=0;seen=set()
    def section(match):
        nonlocal count
        sid=match[2]
        if sid not in records:return match[0]
        seen.add(sid);count+=1;opening,body,closing=match[1],match[3],match[4]
        body=TRANSCRIPT.sub('',body)
        text_id=sid+'-equivalent-text';variants=records[sid];parts=[]
        for orient in ('h','v'):
            content=variants.get(orient)
            if content is None or orient=='v' and content==variants.get('h'):continue
            if omit_local_paths:
                content=omit_local_literals(content,omissions,{'route':route,'screen':sid,'orientation':orient,'surface':'transcript'},replacement='（本机路径）')
            parts.append('<div data-transcript-orientation="'+orient+'">'+html.escape(content)+'</div>')
        # Replace only the raster paragraph's picture img, preserving screenshot
        # alternatives and all hotspots added by the existing runtime.
        def picture(match_img):
            def image(tag_match):
                tag=tag_match[0]
                tag=re.sub(r'\s+(?:alt|aria-describedby)=["\'][^"\']*["\']','',tag)
                return tag[:-1]+' alt="" aria-describedby="'+html.escape(text_id,quote=True)+'">'
            return re.sub(r'<img\b[^>]*>',image,match_img[0])
        body=re.sub(r'<picture\b[^>]*>.*?</picture>',picture,body,flags=re.S)
        return opening+body+'<div class="screen-equivalent-text" id="'+html.escape(text_id,quote=True)+'" data-screen-transcript="'+html.escape(sid,quote=True)+'">'+''.join(parts)+'</div><!-- /screen-equivalent-text -->'+closing
    result=SCREEN.sub(section,document)
    if set(records)!=seen:raise ValueError('Published screen/source mismatch at '+route+': '+','.join(sorted(set(records)-seen)))
    if count and 'data-screen-transcript-style=' not in result:result=result.replace('</head>',STYLE+'</head>',1)
    return result,count

class Images(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.main=0;self.images=[]
    def handle_starttag(self,tag,attrs):
        if tag=='main':self.main+=1
        if tag=='img' and self.main:
            attrs=dict(attrs);ref=attrs.get('data-src') or attrs.get('data-lazy-src') or attrs.get('src')
            if ref and not ref.startswith('data:'):self.images.append(ref)
    def handle_endtag(self,tag):
        if tag=='main':self.main=max(0,self.main-1)

def first_screen_image(data, document, route, root):
    screens=data.get('screens',[]) if data else []
    candidates=[]
    if screens:
        first=screens[0]
        candidates.extend(part['src'] for part in first.get('parts',[]) if part.get('orientation')=='h' and part.get('src'))
        viewer=first.get('layouts',{}).get('h',{}).get('viewer',{})
        if viewer.get('src'):candidates.append(viewer['src'])
    parser=Images();parser.feed(document);candidates.extend(parser.images)
    home=Path(root)/'index.html'
    if home.exists():
        match=PAGE_DATA.search(home.read_text('utf8'))
        if match:
            value=json.loads(match[2]);viewer=value.get('screens',[{}])[0].get('layouts',{}).get('h',{}).get('viewer',{})
            if viewer.get('src'):candidates.append(urljoin('/',viewer['src']))
    for ref in candidates:
        absolute=urljoin(ORIGIN+route,html.unescape(ref));parsed=urlsplit(absolute)
        if parsed.netloc!='wly0829.cn':return absolute
        if (Path(root)/parsed.path.lstrip('/')).is_file():return absolute
    raise ValueError('Existing share image unavailable for '+route)

def description_from_source(source):
    screens=source.get('screens',[])
    if not screens:return ''
    paragraphs=plain_authored_text(screens[0].get('text','')).split('\n\n')
    for paragraph in paragraphs[1:]:
        value=' '.join(paragraph.split())
        if len(value)>=20 and not value.startswith('|'):return value
    return ' '.join(paragraphs[0].split())

def apply_metadata(document, route, root, data=None, source=None):
    head=re.search(r'<head\b[^>]*>(.*?)</head>',document,re.S|re.I)
    if not head:raise ValueError('Missing head: '+route)
    text=head[1];title=re.search(r'<title\b[^>]*>(.*?)</title>',text,re.S|re.I)
    base=html.unescape(re.sub(r'<[^>]+>','',title[1])).strip() if title else ''
    if source:base=source['title']
    if route=='/' and source:
        base=plain_authored_text(source['screens'][0]['text']).splitlines()[0]
        base+=' · 首页 · wly0829.cn'
    elif route.startswith(('/projects/','/skills/')) and data:
        base=data.get('title') or base
        base+=' · '+('项目' if route.startswith('/projects/') else '技能')+' · 吴乐阳'
    desc=re.search(r'<meta\b[^>]*\bname=["\']description["\'][^>]*\bcontent=["\']([^"\']*)["\']',text,re.I)
    description=description_from_source(source) if source else html.unescape(desc[1]) if desc else ''
    if not description:
        body=RenderedBody();body.feed(document);words=body.text()
        description=next((line for line in words.splitlines() if len(line)>=20),base)
    description=omit_local_literals(description,replacement='（本机路径）')
    canonical=ORIGIN+route
    image=first_screen_image(data,document,route,root)
    text=re.sub(r'<title\b[^>]*>.*?</title>','',text,flags=re.S|re.I)
    text=re.sub(r'<meta\b(?=[^>]*\b(?:name|property)=["\'](?:description|og:[^"\']+|twitter:[^"\']+)["\'])[^>]*>','',text,flags=re.I)
    text=re.sub(r'<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*>','',text,flags=re.I)
    tags=['<title>'+html.escape(base)+'</title>','<link rel="canonical" href="'+canonical+'">']
    meta={'description':description,'og:type':'website','og:title':base,'og:description':description,'og:url':canonical,'og:image':image,'twitter:card':'summary_large_image','twitter:title':base,'twitter:description':description,'twitter:image':image}
    for key,value in meta.items():tags.append('<meta '+('property' if key.startswith('og:') else 'name')+'="'+key+'" content="'+html.escape(value,quote=True)+'">')
    if not re.search(r'<link\b[^>]*\brel=["\'](?:shortcut )?icon["\']',text,re.I):
        if not (Path(root)/'favicon.svg').is_file():raise ValueError('Existing favicon.svg unavailable')
        tags.append('<link rel="icon" type="image/svg+xml" href="/favicon.svg">')
    document=document[:head.start(1)]+text+''.join(tags)+document[head.end(1):]
    return document,{'route':route,'title':base,'description':description,'canonical':canonical,'image':image}

def route_of(path, root, data=None):
    if data and data.get('url'):
        value=data['url'];return value if value.endswith(('/', '.html')) else value+'/'
    rel=path.relative_to(root).as_posix()
    if rel=='index.html':return '/'
    if rel.endswith('/index.html'):return '/'+rel[:-len('index.html')]
    return '/'+rel

def scrub_json_values(value, findings, context, pointer=''):
    if isinstance(value,dict):return {key:scrub_json_values(item,findings,context,pointer+'.'+key) for key,item in value.items()}
    if isinstance(value,list):return [scrub_json_values(item,findings,context,pointer+'['+str(i)+']') for i,item in enumerate(value)]
    return omit_local_literals(value,findings,{**context,'field':pointer}) if isinstance(value,str) else value

def scrub_html_literals(document, findings, route):
    # Decode continuation JSON so escaped newlines remain prose, not path bytes.
    def json_script(match):
        attrs,body=match[1],match[2]
        if not re.search(r'\btype=["\']application/(?:ld\+)?json["\']',attrs,re.I):return match[0]
        data=json.loads(body)
        data=scrub_json_values(data,findings,{'route':route,'surface':'existing-html-json'})
        return '<script'+attrs+'>'+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</',r'<\/')+'</script>'
    document=re.sub(r'<script(\b[^>]*)>(.*?)</script>',json_script,document,flags=re.S|re.I)
    # Work on decoded prose/attributes. A raw scan could consume '&lt' in a
    # path followed by an escaped <name> placeholder and damage the sentence.
    class PublicHTML(HTMLParser):
        def __init__(self):super().__init__(convert_charrefs=False);self.parts=[];self.prose=[];self.script=False
        def flush(self):
            original=''.join(self.prose);self.prose=[]
            decoded=html.unescape(original)
            public=omit_local_literals(decoded,findings,{'route':route,'surface':'existing-html-text'})
            self.parts.append(original if public==decoded else html.escape(public,quote=False))
        def tag(self):
            tag=self.get_starttag_text()
            def attribute(match):
                original=match[3];decoded=html.unescape(original)
                public=omit_local_literals(decoded,findings,{'route':route,'surface':'existing-html-attribute','field':match[1]})
                return match[0] if public==decoded else match[1]+'='+match[2]+html.escape(public,quote=True)+match[2]
            return re.sub(r'([\w:-]+)=("|\')(.*?)\2',attribute,tag,flags=re.S)
        def handle_starttag(self,tag,attrs):
            self.flush();self.parts.append(self.tag())
            if tag=='script':self.script=True
        def handle_startendtag(self,tag,attrs):self.flush();self.parts.append(self.tag())
        def handle_endtag(self,tag):
            self.flush();self.parts.append('</'+tag+'>')
            if tag=='script':self.script=False
        def handle_data(self,text):
            if self.script:self.parts.append(text)
            else:self.prose.append(text)
        def handle_entityref(self,name):self.prose.append('&'+name+';')
        def handle_charref(self,name):self.prose.append('&#'+name+';')
        def handle_comment(self,text):
            self.flush();self.parts.append('<!--'+omit_local_literals(text,findings,{'route':route,'surface':'existing-html-comment'})+'-->')
        def handle_decl(self,text):self.flush();self.parts.append('<!'+text+'>')
        def handle_pi(self,text):self.flush();self.parts.append('<?'+text+'>')
    parser=PublicHTML();parser.feed(document);parser.flush()
    return ''.join(parser.parts)

def unique_source_conflicts(conflicts):
    grouped={}
    for item in conflicts:
        key=(item['route'],item['screen'],item['value'])
        if key not in grouped:
            grouped[key]={key:value for key,value in item.items() if key!='orientation'}
            grouped[key]['orientations']=[]
        if item.get('orientation') not in grouped[key]['orientations']:
            grouped[key]['orientations'].append(item.get('orientation'))
    return list(grouped.values())

def finalize_public_fields(root, report=None):
    """Final lightweight projection after navigation/runtime changes; idempotent."""
    root=Path(root).resolve();changed=[];omitted=[];literals=[];remaining=[];search_count=0
    for path in sorted(root.rglob('*.html')):
        original=path.read_text('utf8');document=original;match=PAGE_DATA.search(document)
        data=json.loads(match[2]) if match else None;route=route_of(path,root,data)
        if data:
            dropped=[];public=public_page_data(data,dropped)
            omitted.extend({'route':route,'field':field} for field in dropped)
            document=PAGE_DATA.sub(lambda m:m[1]+json.dumps(public,ensure_ascii=False,separators=(',',':')).replace('</',r'<\/')+m[3],document,1)
        document=scrub_html_literals(document,literals,route)
        remaining.extend({'route':route,**hit} for hit in local_values(html.unescape(document),'html'))
        if document!=original:path.write_text(document,encoding='utf8',newline='');changed.append(path.relative_to(root).as_posix())
    for path in sorted(root.rglob('search*.js')):
        original=path.read_text('utf8');match=re.search(r'(window\.[A-Za-z0-9_]+\s*=\s*)(\[.*\])(;?\s*)$',original,re.S)
        if not match:continue
        dropped=[];data=public_search_records(json.loads(match[2]),dropped)
        context={'file':path.relative_to(root).as_posix(),'surface':'existing-search'}
        omitted.extend({**context,'field':field} for field in dropped)
        data=scrub_json_values(data,literals,context)
        remaining.extend({**context,**hit} for hit in local_values(data,'search'));search_count+=1
        result=original[:match.start(2)]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+original[match.end(2):]
        if result!=original:path.write_text(result,encoding='utf8',newline='');changed.append(path.relative_to(root).as_posix())
    result={'schema':'wly.audit-public-fields-finalize.v1','status':'blocked' if remaining else 'pass',
            'changed_files':changed,'omitted_runtime_fields':omitted,'omitted_local_literals':literals,
            'remaining_local_literals':remaining,'search_scripts_checked':search_count}
    if report:
        Path(report).parent.mkdir(parents=True,exist_ok=True)
        Path(report).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    return result

def apply_release(root, coverage=None, home_source=None, home_receipt=None, omit_local_paths=False, report=None):
    """Called after copying the release and before navigation/search regeneration."""
    root=Path(root).resolve();transcripts,sources,proofs=load_transcripts(coverage,home_source,home_receipt)
    changes=[];omitted_fields=[];omitted_literals=[];metadata=[];covered=[];remaining=[];original_conflicts=[]
    for path in sorted(root.rglob('*.html')):
        original=path.read_text('utf8');document=original;match=PAGE_DATA.search(document);data=json.loads(match[2]) if match else None
        route=route_of(path,root,data)
        if data:
            omitted=[]
            data=public_page_data(data,omitted)
            omitted_fields.extend({'route':route,'field':field} for field in omitted)
            document=PAGE_DATA.sub(lambda m:m[1]+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</',r'<\/')+m[3],document,1)
        if route in transcripts:
            for sid,variants in transcripts[route].items():
                for orient,content in variants.items():
                    for hit in local_values(content,'text'):
                        original_conflicts.append({'route':route,'screen':sid,'orientation':orient,**hit})
            document,count=install_transcripts(document,transcripts[route],route,omitted_literals,omit_local_paths)
            covered.append({'route':route,'screens':count})
        if route not in {'/404.html','/404/'}:
            document,entry=apply_metadata(document,route,root,data,sources.get(route));metadata.append(entry)
        if omit_local_paths:
            document=scrub_html_literals(document,omitted_literals,route)
        for hit in local_values(html.unescape(document),'html'):remaining.append({'route':route,**hit})
        if document!=original:
            path.write_text(document,encoding='utf8',newline='');changes.append(path.relative_to(root).as_posix())
    # Search is serialized data, so decode before removing a span. This prevents
    # escaped \n text from being mistaken for part of a Windows pathname.
    for path in sorted(root.rglob('search*.js')):
        original=path.read_text('utf8');m=re.search(r'(window\.[A-Za-z0-9_]+\s*=\s*)(\[.*\])(;?\s*)$',original,re.S)
        if not m:continue
        dropped=[];records=public_search_records(json.loads(m[2]),dropped)
        omitted_fields.extend({'file':path.relative_to(root).as_posix(),'field':field} for field in dropped)
        if omit_local_paths:records=scrub_json_values(records,omitted_literals,{'file':path.relative_to(root).as_posix(),'surface':'existing-search'})
        result=original[:m.start(2)]+json.dumps(records,ensure_ascii=False,separators=(',',':'))+original[m.end(2):]
        if result!=original:path.write_text(result,encoding='utf8',newline='');changes.append(path.relative_to(root).as_posix())
        remaining.extend({'file':path.relative_to(root).as_posix(),**hit} for hit in local_values(records,'search'))
    original_conflicts=unique_source_conflicts(original_conflicts)
    result={'schema':'wly.audit-page-publication.v1','status':'blocked' if remaining else 'pass',
            'changed_files':changes,'metadata_pages':metadata,'transcript_pages':covered,'source_proofs':proofs,
            'omitted_runtime_fields':omitted_fields,'omitted_local_literals':omitted_literals,
            'original_transcript_path_conflicts':original_conflicts,'remaining_local_literals':remaining,
            'omit_local_paths':omit_local_paths}
    if report:
        Path(report).parent.mkdir(parents=True,exist_ok=True)
        Path(report).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    return result

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--release-root',type=Path,required=True)
    ap.add_argument('--coverage',type=Path)
    ap.add_argument('--home-source',type=Path)
    ap.add_argument('--home-receipt',type=Path)
    ap.add_argument('--omit-local-paths',action='store_true')
    ap.add_argument('--finalize-only',action='store_true',help='Project public HTML/search fields without loading artwork sources')
    ap.add_argument('--report',type=Path)
    args=ap.parse_args()
    if args.finalize_only:
        result=finalize_public_fields(args.release_root,args.report)
        print(json.dumps({'status':result['status'],'changed_files':len(result['changed_files']),'remaining_local_literals':len(result['remaining_local_literals'])}))
        if result['remaining_local_literals']:raise SystemExit(1)
        return
    result=apply_release(args.release_root,args.coverage,args.home_source,args.home_receipt,args.omit_local_paths,args.report)
    print(json.dumps({'status':result['status'],'changed_files':len(result['changed_files']),
                      'metadata_pages':len(result['metadata_pages']),'transcript_screens':sum(p['screens'] for p in result['transcript_pages']),
                      'original_transcript_path_conflicts':len(result['original_transcript_path_conflicts']),
                      'remaining_local_literals':len(result['remaining_local_literals'])},ensure_ascii=False))
    if result['remaining_local_literals']:raise SystemExit(1)

if __name__=='__main__':main()

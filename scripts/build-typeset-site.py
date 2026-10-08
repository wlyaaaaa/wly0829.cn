"""Build manifest-driven image pages over an exact production baseline; never deploy."""
from __future__ import annotations
import argparse
from collections import defaultdict, deque
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
import hashlib
import html
from html.parser import HTMLParser
import importlib.util
import io
import json
import math
import os
from pathlib import Path
import re
import shutil
import struct
import sys
import time
import uuid
from urllib.parse import urlsplit, unquote

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path: sys.path.insert(0,str(HERE))
from public_page_contract import public_page_data
import prepare_native_readability as native_readability
import rule_original_contract as rule_contract
publication_spec=importlib.util.spec_from_file_location('typeset_publication', HERE/'audit-page-publication.py')
publication=importlib.util.module_from_spec(publication_spec)
publication_spec.loader.exec_module(publication)
live_spec=importlib.util.spec_from_file_location('typeset_live_update', HERE/'update-live-release.py')
live_update=importlib.util.module_from_spec(live_spec)
live_spec.loader.exec_module(live_update)
spec = importlib.util.spec_from_file_location('hybrid', HERE/'hybrid-release.py')
hybrid = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hybrid)
motion_spec = importlib.util.spec_from_file_location('motion_preparation', HERE/'prepare-motion-release.py')
motion_prep = importlib.util.module_from_spec(motion_spec)
motion_spec.loader.exec_module(motion_prep)
DATA = re.compile(r'(<script\b[^>]*\bid="page-data"[^>]*>)(.*?)(</script>)', re.S)
BJT = timezone(timedelta(hours=8))
ASSET_CACHE = None
REUSE_ASSET_CACHE = False
ASSET_CACHE_REUSE = {}

def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))

def write(path, value):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf8')

def stamp(path):
    path = Path(path)
    return {'sha256':hybrid.digest(path), 'bytes':path.stat().st_size}

def text_bound(path):
    payload=Path(path).read_bytes()
    return payload.decode('utf-8-sig'),{'sha256':hashlib.sha256(payload).hexdigest(),'bytes':len(payload)}

def json_bound(path):
    text,proof=text_bound(path)
    return json.loads(text),proof

def original_rule_html(text):
    """Keep actual rendered source roots, excluding the version/title wrapper."""
    class Cards(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=False)
            self.stack=[];self.parts=[]
        def handle_starttag(self,tag,attrs):
            data=dict(attrs)
            inherited=self.stack[-1][2] if self.stack else False
            selected=rule_contract.source_root(tag,data,((t,a) for t,a,_ in self.stack))
            active=inherited or selected
            if active:
                opening=self.get_starttag_text()
                if selected and not inherited:
                    # The extracted subtree loses its body/main context. Retain
                    # its explicit source meaning for the existing digest gate.
                    opening=rule_contract.source_root_opening(tag,attrs,opening)
                self.parts.append(opening)
            if tag not in rule_contract.HTML_VOID_TAGS:self.stack.append((tag,data,active))
        def handle_startendtag(self,tag,attrs):
            self.handle_starttag(tag,attrs)
            if tag not in rule_contract.HTML_VOID_TAGS:self.handle_endtag(tag)
        def handle_endtag(self,tag):
            for index in range(len(self.stack)-1,-1,-1):
                if self.stack[index][0]==tag:
                    if self.stack[index][2]:self.parts.append('</'+tag+'>')
                    del self.stack[index:];break
        def handle_data(self,value):
            if self.stack and self.stack[-1][2]:self.parts.append(value)
        def handle_entityref(self,name):
            if self.stack and self.stack[-1][2]:self.parts.append('&'+name+';')
        def handle_charref(self,name):
            if self.stack and self.stack[-1][2]:self.parts.append('&#'+name+';')
    cards=Cards();cards.feed(text)
    return ''.join(cards.parts)

def png_size(path):
    with Path(path).open('rb') as stream:
        header = stream.read(24)
    if header[:8] != b'\x89PNG\r\n\x1a\n' or header[12:16] != b'IHDR':
        raise ValueError('Invalid PNG header: '+str(path))
    return list(struct.unpack('>II', header[16:24]))

class HotMetadata(HTMLParser):
    """Restore slot sub-parts that the producer omitted from links.json."""
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.groups = defaultdict(list)
        self.compact_live = False
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if d.get('data-comp') == 'live_strip' and d.get('data-live-frame') == 'plain':
            self.compact_live = True
        if d.get('data-hot'):
            self.groups[(d['data-hot'], d.get('data-href',''))].append(d)

def quality(path, report, proof):
    records = report.get('screens', [])
    fail = [x for x in records if x.get('status') == 'fail' or x.get('pass') is False and x.get('issues')]
    pending = [x for x in records if x.get('status') == 'incomplete' or x.get('incomplete')]
    legacy = any('status' not in x for x in records if not x.get('skipped'))
    state = 'fail' if fail else 'incomplete' if pending or legacy else 'pass'
    return {'status':state, 'report_path':str(path.resolve()), 'report_sha256':proof['sha256'],
            'failed_screens':[x.get('screen','')+'-'+x.get('orientation','') for x in fail],
            'incomplete_screens':[x.get('screen','')+'-'+x.get('orientation','') for x in pending],
            'legacy_evidence':legacy, 'note':'旧质量记录未按新闸门验证' if legacy else ''}

def native_actions_for(old, orientation):
    actions=old.get('layouts',{}).get(orientation,{}).get('native_actions',[])
    if actions:return actions
    prefix=old.get('id','')+'-'+orientation+'-'
    return [a for part in old.get('parts',[])for a in part.get('native_actions',[])if a.get('hot_id','').startswith(prefix)]

def action_for(hot, metadata, source, old):
    # Producer fitting can split a visible button label across lines. The
    # declared action name uses ordinary word spacing, never layout newlines.
    key = ' '.join((hot.get('text') or hot['href'].split('::')[-1]).split())
    matches = [x for x in native_actions_for(old,'h') if x.get('text') == key]
    if not matches:
        matches = [x for x in native_actions_for(old,'v') if x.get('text') == key]
    if len(matches) > 1:
        definitions = source.get('buttons',[])
        where = metadata.get('data-button-where') or hot['href'].split('::')[0]
        candidates = [i for i,x in enumerate(definitions) if x.get('text') == key and x.get('where') == where]
        if len(candidates) == 1:
            same = [i for i,x in enumerate(definitions) if x.get('text') == key]
            return matches[same.index(candidates[0])]
        definitions=[x for x in source.get('buttons',[]) if x.get('text')==key]
        index=hot.get('occurrence',0)
        if len(definitions)==len(matches) and index<len(matches):return matches[index]
        return None
    return matches[0] if matches else None

def live_key(slot, part):
    if slot == 'ca-form':
        return {'duration':'ca-form-hours', 'totp':'ca-form-code', 'preview':'ca-form'}.get(part,slot)
    if slot == 'cockpit-overall':
        return 'cockpit-'+part if part.startswith('quick-') else slot
    if slot == 'cockpit-security':
        return {'personal-data':'cockpit-security','personal_data':'cockpit-security','unrestricted':'cockpit-security-unrestricted',
                'windows':'cockpit-security-windows'}.get(part,slot)
    return slot

def floating_cards(screen, layout):
    if screen.get('shape')=='card':return []
    excluded=[c['rect']for key in ['interactive_cards','card_text_only']for c in layout.get(key,[])]
    return [r for r in layout.get('cards',[]) if not any(
        max(0,min(r[0]+r[2],q[0]+q[2])-max(r[0],q[0]))*max(0,min(r[1]+r[3],q[1]+q[3])-max(r[1],q[1]))>min(r[2]*r[3],q[2]*q[3])*.7 for q in excluded)]


def old_effects(data):
    screens=data.get('screens',[])
    sampled=[s for s in screens if s.get('render_mode')not in {'source_text','text','card'}]
    layouts=[lay for s in sampled for lay in s.get('layouts',{}).values()]
    expected=['ambient','back_top','footer_signature','navigation','viewer','depth']
    if any(s.get('shape')!='card'for s in screens[1:]):expected.append('screen_enter')
    if any(s.get('shape')!='card'for s in sampled):expected.append('seam')
    if any(floating_cards(s,l)for s in sampled for l in s.get('layouts',{}).values()):expected.append('cards')
    # Dots are decided from current active-status observations after measuring;
    # old decorative coordinates are not a capability requirement.
    for key in ['numbers','arrows']:
        if any(l.get(key)for l in layouts):expected.append(key)
    if any(l.get('live')or l.get('native_live')for l in layouts):expected.extend(['live','update'])
    if any(l.get('screenshots')for l in layouts):expected.append('screenshots')
    if any(l.get('interactive_cards')for l in layouts)or any(s.get('shape')=='card'and any(link.get('whole')for l in s.get('layouts',{}).values()for link in l.get('links',[]))for s in screens):expected.append('card_feedback')
    if data.get('kind')in{'project','frozen'}:expected.append('brief')
    return expected

def bind_current_toc(text, data, source):
    """Retain valid legacy navigation; rebuild stale navigation from authored sections."""
    match=re.search(r'<nav\b[^>]*\bclass="toc"[^>]*>.*?</nav>',text,re.S)
    if not match:return text,{'status':'absent','previous_invalid_targets':[]}
    reader=hybrid.builder.Refs();reader.feed(text)
    nav=hybrid.builder.Refs();nav.feed(match[0])
    invalid=[href for href,is_link in nav.refs if is_link and href.startswith('#') and unquote(href[1:]) not in reader.ids]
    if not invalid:return text,{'status':'legacy_targets_preserved','previous_invalid_targets':[]}
    authored={s['id']:s for s in source['screens'] if not s.get('hidden')};sections={}
    for screen in data['screens']:
        src=authored[screen['id']];section=src.get('nav_section') or src.get('section') or screen['section']
        screen['section']=section
        sid=html.escape(screen['id'],quote=True);safe=html.escape(section,quote=True)
        pattern=r'(<section\b[^>]*\bdata-screen="'+re.escape(sid)+r'"[^>]*\bdata-section=")[^"]*(")'
        text=re.sub(pattern,lambda m:m[1]+safe+m[2],text,count=1)
        if section not in reader.ids:
            marker='<div class="section-anchor" id="'+safe+'"></div>'
            text=re.sub(r'<section\b[^>]*\bdata-screen="'+re.escape(sid)+r'"[^>]*>',lambda m:marker+m[0],text,count=1)
            reader.ids.add(section)
        sections.setdefault(section,src.get('nav_title') or screen['title'])
    links=''.join('<a class="nav-link" href="#'+html.escape(key,quote=True)+'" data-section="'+html.escape(key,quote=True)+'" data-label-h="'+html.escape(title,quote=True)+'" data-label-v="'+html.escape(title,quote=True)+'">'+html.escape(title)+'</a>' for key,title in sections.items())
    toc='<nav class="toc" aria-label="本页目录"><div class="bar-inner"><div class="toc-inner toc-text">'+links+'</div></div></nav>'
    text=re.sub(r'<nav\b[^>]*\bclass="toc"[^>]*>.*?</nav>',lambda _:toc,text,count=1,flags=re.S)
    return text,{'status':'current_sections_rebuilt','previous_invalid_targets':invalid,
                 'entries':[{'href':'#'+key,'title':title} for key,title in sections.items()]}


def current_effects(data, source, previous):
    """Replace layout-dependent expectations only after current input binding."""
    keys=('cards','numbers','arrows','screenshots','card_feedback')
    screens=data['screens'];parts=[p for s in screens for p in s['parts']]
    complete=bool(parts) and all(p.get('motion_measured') for p in parts)
    source_shots=all(isinstance(s.get('screenshots'),list) for s in source['screens'] if not s.get('hidden'))
    if source_shots:
        source_shots=all(not s['screenshots'] or any(h['kind']=='screenshot' for screen in screens if screen['id']==s['id'] for p in screen['parts'] for h in p['hotspots'])
                         for s in source['screens'] if not s.get('hidden'))
    counts={key:{o:0 for o in ('h','v')} for key in keys}
    for screen in screens:
        for part in screen['parts']:
            values={'cards':len(floating_cards(screen,part)),'numbers':len(part['numbers']),'arrows':len(part['arrows']),
                    'screenshots':sum(h['kind']=='screenshot' for h in part['hotspots']),
                    'card_feedback':len(part.get('interactive_cards',[]))+int(screen.get('shape')=='card' and bool(screen.get('primary_href')))}
            for orient in ('h','v'):
                if part.get('both') or part['orientation']==orient:
                    for key in keys:counts[key][orient]+=values[key]
    capabilities={};expected=list(previous);changes=[]
    for key in keys:
        count=sum(counts[key].values());measured=complete and (source_shots if key=='screenshots' else True)
        status=('present' if count else 'no_corresponding_element') if measured else 'measurement_missing'
        capabilities[key]={'policy':'current-bound-layout-v1','status':status,'count_h':counts[key]['h'],'count_v':counts[key]['v'],
                           'label':'新版面无对应元素' if status=='no_corresponding_element' else '当前布局元素' if status=='present' else '缺少完整量测'}
        old=key in previous
        if measured:
            expected=[item for item in expected if item!=key]
            if count:expected.append(key)
        if old!=(key in expected):changes.append({'effect':key,'previous_expected':old,'current_expected':key in expected,
            'basis':'Current source, PNG/HTML-bound producer-components-v8 measurements and mounted part model','capability':capabilities[key]})
    return expected,capabilities,changes


def motion_part(geometry, image, size, start, padding):
    result={'cards':[],'numbers':[],'dots':[],'arrows':[]}
    def convert(r):
        top=max(r[1],start);bottom=min(r[1]+r[3],start+size[1]-padding)
        if bottom<=top:return None
        return [max(0,r[0])/size[0],(top-start+padding)/size[1],min(r[2],size[0]-r[0])/size[0],(bottom-top)/size[1]]
    for key in ['cards']:
        for r in geometry.get(key,[]):
            rect=convert(r)
            if rect:result[key].append(rect)
    for key in ['numbers','dots','arrows']:
        for item in geometry.get(key,[]):
            rect=convert(item if isinstance(item,list)else item['rect'])
            if rect:result[key].append(rect if isinstance(item,list)else {**item,'rect':rect})
    if 'map_nodes' in geometry:
        result['panorama_nodes']=[]
        for item in geometry['map_nodes']:
            r=item.get('rect')
            if not isinstance(item.get('text'),str) or not isinstance(r,list) or len(r)!=4 or any(not isinstance(v,(int,float)) or not math.isfinite(v) for v in r) or r[2]<=0 or r[3]<=0:
                raise ValueError('全景节点没有真实有效的生产DOM坐标')
            rect=convert(r)
            if rect:result['panorama_nodes'].append({'text':item['text'],'href':item.get('href'),'original_href':item.get('href'),'rect':rect})
    content=geometry.get('content_occupancy',{})
    if content.get('policy')=='semantic-content-rects-v1' and not content.get('issues'):
        blocks=[]
        for item in content.get('blocks',[]):
            rect=convert(item['rect'])
            if rect:blocks.append({'kind':item['kind'],'rect':rect})
        result['content_occupancy']={'policy':content['policy'],'blocks':blocks,
            'method':content['method'],'source_html_sha256':geometry['html_sha256'],
            'source_png_sha256':next(entry['sha256'] for entry in geometry['parts'] if entry['image']==image),
            'measurement_sha256':content['measurement_sha256'],'fit_sha256':geometry['fit_sha256']}
    return result

def bind_card_feedback(part, old, orientation):
    legacy=old.get('layouts',{}).get(orientation,{}).get('interactive_cards',[])
    result=[]
    for box in part.get('cards',[]):
        def inside(hot):
            r=hot['rect'];return box[0]-.001<=r[0]+r[2]/2<=box[0]+box[2]+.001 and box[1]-.001<=r[1]+r[3]/2<=box[1]+box[3]+.001
        hrefs={h['href']for h in part['links']if not h.get('invalid')and inside(h)}
        matches=[card for card in legacy if card.get('href')in hrefs]
        primary=[card for card in matches if card.get('has_primary')]
        chosen=matches[0]if len(hrefs)==1 and matches else primary[0]if len({c['href']for c in primary})==1 else None
        if chosen:result.append({'id':part['image']+'-card-'+str(len(result)),'rect':box,'href':chosen['href'],'text':chosen.get('text',''),'background':chosen.get('background','#fff')})
    # Producer `.card` rectangles include grouping frames and their closed child
    # cards. One legacy destination must not create two overlapping whole-card
    # anchors from those nested rectangles; retain the specific closed card.
    def contains(outer,inner):
        return outer[0]-.001<=inner[0] and outer[1]-.001<=inner[1] and inner[0]+inner[2]<=outer[0]+outer[2]+.001 and inner[1]+inner[3]<=outer[1]+outer[3]+.001
    return [card for card in result if not any(
        child['href']==card['href'] and child['rect'][2]*child['rect'][3]<card['rect'][2]*card['rect'][3]-.000001
        and contains(card['rect'],child['rect']) for child in result)]

def video_position(spec, old_screen, illustrations, page, args):
    if not illustrations:raise ValueError('Existing video has no measured illustration slot: '+page)
    old=old_screen['layouts']['h'];r=spec['rect'];ow,oh=old['size'];crop=old.get('crop',[0,0,ow,oh])
    video_box=[r[0]*ow+crop[0],r[1]*oh+crop[1],r[2]*ow,r[3]*oh]
    manifest_path=args.typeset_root.parent/'typeset-assets'/page/'manifest.jsonl'
    assets=[json.loads(line)for line in manifest_path.read_text('utf8').splitlines()if line.strip()] if manifest_path.exists()else[]
    chosen=None;matched_asset=None;source_box=None
    for item in illustrations:
        match=next((a for a in assets if a.get('screen_id')==old_screen['id']and a.get('role')=='illustration'and a.get('sha256')==item.get('reference_sha256')),None)
        if match:chosen=item;matched_asset=match;break
    if chosen is None:
        if len(illustrations)!=1:raise ValueError('Existing video has no unique measured illustration slot: '+page)
        chosen=illustrations[0]
    ir=chosen['rect'];nw,nh=chosen['natural_size'];scale=min(ir[2]/nw,ir[3]/nh)
    content=[ir[0]+(ir[2]-nw*scale)/2,ir[1]+(ir[3]-nh*scale)/2,nw*scale,nh*scale]
    if matched_asset:
        candidate_box=matched_asset.get('source_box')or matched_asset.get('box')
        source_name=Path(matched_asset.get('source_image','')).stem
        # A reused PNG may have been cut from the portrait design. Its SHA identifies
        # the artwork, but does not make portrait crop coordinates landscape coordinates.
        same_orientation=re.search(re.escape(old_screen['id'])+r'-h(?:\d+|-|$)',source_name) is not None
        if candidate_box and same_orientation:
            x0,y0,x1,y1=candidate_box
            if x0<=video_box[0]+1 and y0<=video_box[1]+1 and x1>=video_box[0]+video_box[2]-1 and y1>=video_box[1]+video_box[3]-1:
                source_box=candidate_box
    if source_box:
        x0,y0,x1,y1=source_box;sx=content[2]/(x1-x0);sy=content[3]/(y1-y0)
        box=[content[0]+(video_box[0]-x0)*sx,content[1]+(video_box[1]-y0)*sy,video_box[2]*sx,video_box[3]*sy]
        vw,vh=spec.get('size',[video_box[2],video_box[3]])
        if abs(box[2]/box[3]/(vw/vh)-1)>.01:source_box=None
        method='Same illustration PNG SHA and landscape crop containing the original video'
    if not source_box:
        vw,vh=spec.get('size',[video_box[2],video_box[3]]);fit=min(content[2]/vw,content[3]/vh)
        box=[content[0]+(content[2]-vw*fit)/2,content[1]+(content[3]-vh*fit)/2,vw*fit,vh*fit]
        method='Existing video retained in measured new illustration slot, aspect ratio preserved'
    # Normalized legacy rectangles have pixel rounding; never stretch the movie to it.
    fit=min(box[2]/vw,box[3]/vh)
    box=[box[0]+(box[2]-vw*fit)/2,box[1]+(box[3]-vh*fit)/2,vw*fit,vh*fit]
    return box,{'method':method,'illustration_sha256':chosen.get('reference_sha256'),'illustration_rect_px':ir,
                'illustration_content_rect_px':content,'video_rect_px':box,'source_crop_used':source_box,
                'source_image':matched_asset.get('source_image')if matched_asset else None}

def screenshot(hot, source):
    entries = source.get('screenshots',[])
    if hot['href'].isdigit():
        i = int(hot['href'])
        return entries[i:i+1]
    return [x for x in entries if x.get('compare') == hot['href']]

def encode_png(path, effort=80):
    """Lossless transport encoding; verify decoded RGBA bytes without viewing an image."""
    from PIL import Image
    payload=Path(path).read_bytes()
    source_hash=hashlib.sha256(payload).hexdigest()
    encoded=ASSET_CACHE/(source_hash+'.webp')
    receipt=ASSET_CACHE/(source_hash+'.json')
    if encoded.is_file() and receipt.is_file():
        evidence=read(receipt)
        if REUSE_ASSET_CACHE:
            if evidence.get('source_sha256')!=source_hash or evidence.get('encoded_sha256')!=hybrid.digest(encoded) or evidence.get('pixel_equal') is not True:
                raise ValueError('Existing lossless cache binding differs: '+str(path))
            with Image.open(io.BytesIO(payload)) as original, Image.open(encoded) as cached:
                source_pixels=original.convert('RGBA');cached_pixels=cached.convert('RGBA')
                pixel_hash=hashlib.sha256(source_pixels.tobytes()).hexdigest()
                if source_pixels.size!=cached_pixels.size or pixel_hash!=evidence.get('decoded_rgba_sha256') or pixel_hash!=hashlib.sha256(cached_pixels.tobytes()).hexdigest():
                    raise ValueError('Existing lossless cache pixels differ: '+str(path))
                ASSET_CACHE_REUSE[source_hash]={'delivery':'verified_lossless_cache','size':list(source_pixels.size),'mode':'RGBA'}
            return encoded
        if evidence.get('source_sha256')==source_hash and evidence.get('encoded_sha256')==hybrid.digest(encoded) and evidence.get('pixel_equal') is True and evidence.get('compression_effort',80)>=effort:return encoded
    if REUSE_ASSET_CACHE:
        ASSET_CACHE_REUSE[source_hash]={'delivery':'unchanged_original_png'}
        return Path(path)
    with Image.open(io.BytesIO(payload)) as image:
        pixels=image.convert('RGBA')
        if max(pixels.size)>16383:return Path(path)
        pixel_hash=hashlib.sha256(pixels.tobytes()).hexdigest()
        temp=ASSET_CACHE/(source_hash+'-'+uuid.uuid4().hex+'.webp')
        pixels.save(temp,format='WEBP',lossless=True,quality=effort,exact=True,method=6)
    with Image.open(temp) as decoded:
        if hashlib.sha256(decoded.convert('RGBA').tobytes()).hexdigest()!=pixel_hash:
            raise ValueError('Lossless encoding changed pixels: '+str(path))
    if not encoded.exists() or temp.stat().st_size<encoded.stat().st_size:
        os.replace(temp,encoded)
    else:
        # Keep the smaller verified encoding. This temp is recorded for ordinary task cleanup.
        (ASSET_CACHE/'discarded').mkdir(exist_ok=True)
        temp.rename(ASSET_CACHE/'discarded'/temp.name)
    write(receipt,{'source_sha256':source_hash,'encoded_sha256':hybrid.digest(encoded),
                   'decoded_rgba_sha256':pixel_hash,'pixel_equal':True,'compression_effort':effort})
    return encoded

def asset(path, candidate, category='images', baseline=None, baseline_files=None):
    path = Path(path)
    actual=encode_png(path) if path.suffix.lower()=='.png' else path
    if actual.stat().st_size>=path.stat().st_size:actual=path
    if baseline is not None:
        proof=stamp(actual)
        matches=[rel for rel,entry in baseline_files.items() if entry==proof and Path(rel).suffix.lower()==actual.suffix.lower()]
        if len(matches)==1:
            original=baseline/matches[0]
            if not original.is_file() or stamp(original)!=proof:
                raise ValueError('Screenshot baseline asset differs from its manifest: '+matches[0])
            return '/'+matches[0]
    name = hybrid.digest(actual)[:20]+'-'+path.stem+actual.suffix
    rel = Path('_typeset')/category/name
    dest = candidate/rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        hybrid.builder.copy_release_asset(actual,dest)
    return '/'+rel.as_posix()

def bundle(text, candidate, label, suffix):
    name = label+'-'+hashlib.sha256(text.encode('utf8')).hexdigest()[:20]+suffix
    dest = candidate/'_typeset'/'runtime'/name
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(text.encode('utf8'))
    return '/_typeset/runtime/'+name

def patch_app(text):
    # text_bound preserves raw CRLF; read_text used by overlays normalizes it.
    # Match the same legacy code and produce the same runtime in both paths.
    text=text.replace('\r\n','\n')
    runtime = (HERE/'typeset-layout.js').read_text('utf8')
    marker = 'function layout(){'
    if text.count(marker) != 1:
        raise ValueError('Unsupported legacy layout entry')
    text = text.replace(marker,runtime+'\n'+marker,1)
    needle = 'const section=document.querySelector(\'[data-screen="\'+s.id+\'"]\');'
    if text.count(needle) != 1:
        raise ValueError('Unsupported legacy screen selector')
    text = text.replace(needle,needle+"if(s.render_mode==='typeset'){installTypeset(section,s);continue;}",1)
    text = text.replace("function orientation(){return mq.matches?'v':'h';}","function orientation(){return page.typeset?(innerWidth<768?'v':'h'):(mq.matches?'v':'h');}")
    text = text.replace("function offlineNotice(section,texts){", "function offlineNotice(section,texts){if(section.classList.contains('typeset-screen'))return;")
    text = text.replace("if(!first.has(node.dataset.section))", "if(node.getClientRects().length&&!first.has(node.dataset.section))")
    text = text.replace(" document.body.dataset.statusPhase=phase;", " displayTypesetStatus(last,phase,parse,page);\n document.body.dataset.statusPhase=phase;")
    text = text.replace("s.render_mode==='source_text'||s.render_mode==='text'||s.shape==='card'||!!s.layouts.v", "s.render_mode==='typeset'||s.render_mode==='source_text'||s.render_mode==='text'||s.shape==='card'||!!s.layouts.v")
    # Replace the legacy one-frame reading restore with the manifest-aware runtime.
    reading_start=text.index('function rememberReadingPosition(){')
    # The first occurrence belongs to the inserted runtime; the second is legacy.
    reading_start=text.index('function rememberReadingPosition(){',reading_start+1)
    reading_end=text.index('document.fonts.ready.then(()=>window.SiteToc?.update());',reading_start)
    text=text[:reading_start]+text[reading_end:]
    text=text.replace('layout();motion();\nfunction scrollToCurrentHash(){',
                      'layout();motion();rememberReadingPosition();\nfunction scrollToCurrentHash(){const readingRevision=cancelReadingResize();',1)
    text=text.replace('if(location.hash!==hash||!target.isConnected)return;',
                      'if(readingRevision!==typesetReadingState.revision||location.hash!==hash||!target.isConnected)return;',1)
    initial_hash="Promise.all([document.fonts.ready,...[...document.querySelectorAll('#site-header img,.toc img')].map(im=>im.decode().catch(()=>{}))]).then(()=>requestAnimationFrame(scrollToCurrentHash));addEventListener('hashchange',scrollToCurrentHash);\naddEventListener('load',scrollToCurrentHash,{once:true});"
    if text.count(initial_hash)!=1:raise ValueError('Unsupported legacy initial hash restore')
    text=text.replace(initial_hash,
        "const initialReadingRevision=typesetReadingState.revision;const restoreInitialHash=()=>{if(!resizing&&typesetReadingState.revision===initialReadingRevision)scrollToCurrentHash();};\n"
        "Promise.all([document.fonts.ready,...[...document.querySelectorAll('#site-header img,.toc img')].map(im=>im.decode().catch(()=>{}))]).then(()=>requestAnimationFrame(restoreInitialHash));addEventListener('hashchange',scrollToCurrentHash);\n"
        "addEventListener('load',restoreInitialHash,{once:true});",1)
    sample_start=text.index('/* 已选七项通用动效')
    sample_end=text.index('/* 短续作说明',sample_start)
    samples=text[sample_start:sample_end]
    # Each orientation and repeated live sub-part owns its actual DOM value.
    # A shared slot name must not let hidden copies overwrite the visible value.
    samples=samples.replace('const values=new Map();','const values=new WeakMap();')
    samples=samples.replace("const key=(s.closest('.screen')?.dataset.screen||'')+':'+s.dataset.slot,","const key=s,")
    samples=samples.replace("document.querySelectorAll('.screen')","document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part:not([hidden])')")
    samples=samples.replace("document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part:not([hidden])').forEach(s=>observer.observe(s))","document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part').forEach(s=>observer.observe(s))")
    samples=samples.replace("s.classList.contains('shape-card')","(s.classList.contains('shape-card')||s.dataset.shape==='card')")
    samples=samples.replace("s.closest('.screen')","(s.closest('.typeset-part')||s.closest('.screen'))")
    samples=samples.replace("document.querySelectorAll('.slot[data-slot]')","document.querySelectorAll('.slot[data-slot],.b2-slot[data-b2-slot]')")
    samples=samples.replace('s.dataset.slot','(s.dataset.slot||s.dataset.b2Slot)')
    samples=samples.replace('(s.title||s.textContent).trim()',"(s.title||s.textContent||s.getAttribute('aria-label')||'').trim()")
    samples=samples.replace("{subtree:true,childList:true,characterData:true});","{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','data-state']});")
    samples=samples.replace("if(on.dots)(l.dots||[]).forEach((r,i)=>{if(inView(s,r))candidates.push({key:'dot:'+i,rect:r});});","if(on.dots)(l.dots||[]).forEach((item,i)=>{const r=Array.isArray(item)?item:item.rect;if(inView(s,r))candidates.push({...(Array.isArray(item)?{}:item),key:'dot:'+i,rect:r});});")
    dot_anchor="e.dataset.effectKey=a.key;if(arrow){"
    dot_style="e.dataset.effectKey=a.key;if(!arrow&&a.shape){e.dataset.markerShape=a.shape;e.style.setProperty('--marker-colour',a.colour||'#198452');}if(arrow){"
    if dot_anchor not in samples:raise ValueError('Unsupported legacy marker decoration')
    samples=samples.replace(dot_anchor,dot_style)
    text=text[:sample_start]+samples+text[sample_end:]
    hero_start=text.index('/* 只播放人工标注的插画面片')
    hero=text[hero_start:]
    hero=hero.replace("section=document.querySelector('.screen'),hero=section?.querySelector('picture img')", "section=document.querySelector('.typeset-screen .typeset-part[data-orientation=h]')||document.querySelector('.screen'),hero=section?.querySelector('picture img')")
    text=text[:hero_start]+hero
    streaming_spec=importlib.util.spec_from_file_location('oss_video_runtime', HERE/'prepare-oss-runtime.py')
    streaming=importlib.util.module_from_spec(streaming_spec);streaming_spec.loader.exec_module(streaming)
    text=streaming.patch_video_runtime(text)
    # selectstart can target a DOM Text node; resolve its owning element first.
    text=text.replace('e.target.closest(', '(e.target instanceof Element?e.target:e.target?.parentElement)?.closest(')
    text=live_update.patch_shared_runtime(text)
    return motion_prep.patch_runtime(text)

def patch_b2(text):
    text = text.replace("document.querySelectorAll('.screen')", "document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part:not([hidden])')")
    text = text.replace("el.closest('.screen')", "el.closest('.typeset-part')||el.closest('.screen')")
    text = text.replace("const section=el.closest('.typeset-part')||el.closest('.screen'),", "const section=(el.closest('.typeset-part')||el.closest('.screen')),")
    text = text.replace("node.dataset.b2Slot=cell.slot;", "node.dataset.b2Slot=cell.slot;node.dataset.livePart=cell.live_part||'';node.dataset.hotId=cell.hot_id||'';node.dataset.typesetKind='live';")
    text = text.replace("button.dataset.b2Action=entry.action;", "button.dataset.b2Action=entry.action;button.dataset.baseLabel=entry.text;button.dataset.hotId=entry.hot_id||'';button.dataset.typesetKind='button';")
    # Native lamp sub-parts use the same state provider as the summary, without repeating its copy.
    text = text.replace("else el.textContent=valueRow.text;", "else if(el.dataset.livePart==='lamp'){el.setAttribute('aria-label',valueRow.text||'状态未知');el.classList.add('typeset-lamp');}else el.textContent=valueRow.text;")
    text = text.replace("b.disabled=disabled;", "b.disabled=disabled;b.dataset.labelChanging=String(!!b.textContent&&b.textContent!==b.dataset.baseLabel);")
    return live_update.patch_b2_runtime(text)

def local_deps(candidate, legacy, baseline):
    """Copy only referenced shared assets, preserving the old release's immutable names."""
    pending = list(candidate.rglob('*.html'))
    seen = set()
    while pending:
        owner = pending.pop()
        rel = owner.relative_to(candidate).as_posix()
        if rel in seen:
            continue
        seen.add(rel)
        for ref, navigation in hybrid.references(owner):
            target = hybrid.local_reference(candidate,owner,ref)
            if target is None or navigation and target.suffix == '.html':
                continue
            if not target.is_file():
                original = legacy/target.relative_to(candidate)
                if not original.is_file():
                    original = baseline/target.relative_to(candidate)
                if not original.is_file():
                    raise ValueError('Referenced asset unavailable: '+str(target.relative_to(candidate)))
                target.parent.mkdir(parents=True, exist_ok=True)
                hybrid.builder.copy_release_asset(original,target)
            if target.suffix in {'.js','.css','.html','.mjs'}:
                pending.append(target)

def build_page(name, records, args, candidate):
    source_path = Path(records[0]['source_path'])
    source,source_proof = json_bound(source_path)
    for screen in source["screens"]: screen["screenshots"] = [] if screen["id"] in source.get("withdrawn_screenshot_screens", []) else screen.get("screenshots", [])
    url = source.get('url') or source.get('source_url') or ('/404.html' if name == '404' else '/'+name+'/')
    if url == '/' or name == 'home':
        raise ValueError('Homepage is excluded')
    authored_url=url
    authored_rel=hybrid.route_file(authored_url)
    alias=hybrid.nav_repair.ALIASES.get(url)
    if alias and (args.baseline/hybrid.route_file(alias)).is_file():
        url=alias
    rel = hybrid.route_file(url)
    base_html = args.legacy_site/authored_rel
    if not base_html.exists() and alias:
        base_html = args.legacy_site/rel
    preview_only = name == 'github-profile'
    if not base_html.exists() and preview_only:
        base_html = args.legacy_site/'how-this-site/index.html'
    templated=False
    new_project=not base_html.exists() and source.get('kind')=='project'
    if new_project:
        base_html=args.legacy_site/'projects/agents/index.html';templated=True
    if base_html.exists():
        initial_text,initial_proof=text_bound(base_html)
        if DATA.search(initial_text) is None and source.get('kind')=='skill':
            base_html=args.legacy_site/'skills/localocr/index.html';templated=True
    if not base_html.exists():
        raise FileNotFoundError('Page skeleton unavailable: '+str(base_html))
    text,html_proof = text_bound(base_html)
    if preview_only or templated or url!=authored_url:
        original_assets='/'+base_html.parent.relative_to(args.legacy_site).as_posix()+'/assets/'
        text=re.sub(r'(?<![\w/])assets/',original_assets,text)
    text=re.sub(r'<link\b[^>]*\brel="preload"[^>]*\bas="image"[^>]*>','',text)
    data = json.loads(DATA.search(text)[2])
    expected_effects=old_effects(data);old_video=data.get('video');video_binding=None
    if preview_only or templated:
        expected_effects=['ambient','back_top','footer_signature','navigation','viewer','depth','screen_enter','seam'];old_video=None
    legacy_effects=list(expected_effects)
    original = {s['id']:s for s in data['screens']}
    data.update({'page':name,'kind':source.get('kind',data['kind']),'title':source['title'],
                 'url':url,'typeset':True,'video':None,'screens':[]})
    if old_video and old_video.get('mount_allowed') is False:
        data['video']=old_video
        video_binding={'status':'insufficient_evidence','original_geometry_retained':True}
    # The current shared renderer uses native header/menu/footer and generic page navigation.
    # Retired raster component payloads are not inputs to a manifest-driven page.
    data['shared']['components']={}
    data['shared'].get('art',{}).pop('source_frames',None)
    if preview_only or templated:
        data['neighbors'] = {}; data['project'] = None; data['family'] = 'projects'
        if templated and not new_project:data['family']='skills'
    if new_project:
        data['project']=name
        data['video_prompt']=bool(source.get('video_prompt'))
        text=re.sub(r'<script\b[^>]*\bid="album-page"[^>]*>.*?</script>','',text,flags=re.S)
        data['repo_url']=source.get('repo_url')
        data['repository_visibility']='PUBLIC' if source.get('public') else 'PRIVATE'
        data['status_binding']={'project':name,'repo':(source.get('repo_url') or '').removeprefix('https://github.com/'),
                               'visibility':data['repository_visibility'],'matched':bool(source.get('repo_url'))}
    manifest_path = args.typeset_root/name/'page-manifest.json'
    manifest,manifest_proof = json_bound(manifest_path)
    inputs = {str(args.inventory.resolve()):args.inventory_proof,str(source_path.resolve()):source_proof,
              str(manifest_path.resolve()):manifest_proof,str(base_html.resolve()):html_proof}
    registry_path=HERE.parent/'config/panel-projects.json'
    registry,registry_proof=json_bound(registry_path)
    inputs[str(registry_path.resolve())]=registry_proof
    if url!=authored_url:
        # The registered canonical route owns this legacy alias's repository.
        # Keep the authored source and card hrefs intact; only generated routing
        # and its stale legacy binding move to that established target.
        data['status_binding']={**data.get('status_binding',{}),'repo':None}
    registered=hybrid.builder.bind_registered_repository(data,registry)
    if not registered and data.get('status_binding',{}).get('matched') is False:
        # An unmatched historical page key is not a verified repository identity.
        data['status_binding']={**data['status_binding'],'repo':name}
    if args.snapshot_proof:inputs[str(args.snapshot_path)]=args.snapshot_proof
    geometry_path=args.geometry
    geometries={}
    geometry_sha256=None
    geometry_problem=None
    if geometry_path and geometry_path.exists():
        geo,geo_proof=json_bound(geometry_path);inputs[str(geometry_path)]=geo_proof
        geometry_sha256=geo_proof['sha256']
        if geo.get('geometry_version')==2:
            geometries={(x['screen'],x['orientation']):x for x in geo['records']if x['page']==name}
        else:geometry_problem='缺少生产视口一致的 version 2 动效位置量测'
        if geo.get('fit_input'):
            fit_proof=geo['fit_input'];inputs[fit_proof['path']]={'sha256':fit_proof['sha256'],'bytes':fit_proof['bytes']}
    else:geometry_problem='缺少新排版动效位置量测'
    issues = []
    if geometry_problem:issues.append(geometry_problem)
    video_asset_manifest=args.typeset_root.parent/'typeset-assets'/name/'manifest.jsonl'
    if old_video and video_asset_manifest.exists():inputs[str(video_asset_manifest.resolve())]=stamp(video_asset_manifest)
    expected = [s for s in source['screens'] if not s.get('hidden')]
    order = source.get('reading_order', [])
    expected.sort(key=lambda s: order.index(s['id']) if s['id'] in order else len(order))
    manifest['screens'].sort(key=lambda s: order.index(s['screen']) if s['screen'] in order else len(order))
    if [s['id'] for s in expected] != [s['screen'] for s in manifest['screens']]:
        issues.append('清单屏顺序/完整性与当前定稿不一致')
    qpath = args.typeset_root/name/'report.json'
    if qpath.exists():
        qr,qp=json_bound(qpath);q=quality(qpath,qr,qp);inputs[str(qpath.resolve())]=qp
    else:q={'status':'incomplete','note':'缺排版质量记录'}
    main = []; seen_sections = set(); screen_count = image_count = 0; grid_open=False; transcripts={}
    source_map = {s['id']:s for s in expected}
    source_anchor_ids={a['id']for s in expected for a in s.get('anchors',[])}
    extra_anchors=defaultdict(list)
    normalize=lambda value:re.sub(r'[\s#*〔〕【】`]+','',value)
    for old_screen in original.values():
        for alias in old_screen.get('html_anchors',[]):
            aid=alias['id']
            if aid in source_anchor_ids:continue
            heading=re.search(r'<h[1-6]\b[^>]*\bid="'+re.escape(aid)+r'"[^>]*>(.*?)</h[1-6]>',text,re.S)
            label=html.unescape(re.sub('<[^>]+>','',heading[1])) if heading else ''
            matches=[s['id']for s in expected if label and normalize(label) in normalize(s.get('text',''))]
            if old_screen['id']in {s['id']for s in expected}:extra_anchors[old_screen['id']].append(aid)
            elif matches:extra_anchors[matches[0]].append(aid)
    if source.get('registry',{}).get('live_anchors'):
        data['b2_live_anchors']=source['registry']['live_anchors']
        for a in data['b2_live_anchors']:
            if a['id'] in source_anchor_ids:continue
            owner=next((s['id']for s in expected if a.get('lands_on') in s.get('live',[])),None)
            if owner:extra_anchors[owner].append(a['id'])
    for entry in manifest['screens']:
        sid = entry['screen']; src = source_map.get(sid)
        if src is None:
            issues.append('未知屏：'+sid); continue
        old = original.get(sid,{})
        section = old.get('nav_section') or src.get('nav_section') or src.get('section','top')
        shape=src.get('shape','screen')
        fixed_source_link_targets=set()
        if grid_open and shape!='card':main.append('</div>');grid_open=False
        model = {'id':sid,'title':src.get('title',''),'section':section,'shape':shape,
                 'render_mode':'typeset','parts':[],'layouts':{'h':{},'v':{}},
                 'screen_anchors':list(dict.fromkeys([x['id'] for x in src.get('anchors',[])]+extra_anchors[sid]))}
        if shape=='card' and src.get('card',{}).get('href'):
            model['primary_href']=src['card']['href']
        if shape=='source_text' and Path(rel).parts[0]=='rules':
            based_on=source.get('based_on') or {}
            model['source_version']=src.get('text','').split('\n',1)[0]
            document=re.search(r'(AGENTS\.md|docs[/\\]contracts[/\\]agents\.[a-z-]+\.md)$',str(based_on.get('file','')))
            meta={'relative_file':document[1].replace('\\','/') if document else None,
                  'version':based_on.get('release'),'omitted_count':based_on.get('omitted_count',0)}
            model['source_meta']=meta
            try:
                original_render=args.typeset_root/name/'html'/f'{sid}-h.html'
                rendered,render_proof=text_bound(original_render);inputs[str(original_render.resolve())]=render_proof
                meta['original_html']=original_rule_html(rendered)
                meta['rendered_input_sha256']=render_proof['sha256']
                if not meta['original_html']:issues.append(sid+':冻结横版HTML缺原文卡正文')
                original_path=Path(based_on['file']).resolve()
                original_proof=stamp(original_path);inputs[str(original_path)]=original_proof
                meta['source_sha256']=original_proof['sha256']
                if based_on.get('sha256')!=original_proof['sha256']:
                    issues.append(sid+':原文声明SHA与实际来源不符')
                pin=rule_contract.load_pin(HERE.parent)
                if pin.get('schema')=='wly.assembled-rules-pin.v2':
                    projection=getattr(args,'rule_projection_records',{}).get((name,sid,'h'))
                    if not projection or projection['public_html_sha256']!=render_proof['sha256']:
                        raise ValueError('原文图片没有绑定完成的独立公开投影代次')
                    projection_path=args.rule_projection_path
                    inputs[str(projection_path)]=args.rule_projection_proof
                    inputs.update(args.rule_projection_inputs)
                    meta['raw_rendered_input_sha256']=projection['raw_html_sha256']
                    meta['public_projection_sha256']=args.rule_projection_id
                    identity=src.get('source_excerpt_id');excerpt=rule_contract.excerpt_entry(pin,identity)
                    expected_source=pin['documents'].get(meta['relative_file'])
                    meta.update(excerpt_contract=based_on.get('excerpt_contract'),excerpt_id=identity)
                    declared=[entry if isinstance(entry,str) else entry.get('text') for entry in src.get('source',{}).get('omit',[])]
                    meta['omitted_count']=len(declared)
                    if based_on.get('excerpt_contract')!=rule_contract.excerpt_contract_id(pin['version']) or not excerpt or excerpt['screen']!=sid or excerpt['page']!=name:
                        raise ValueError('原文未绑定固定摘录合同')
                    if declared!=excerpt['selection']['approved_omissions']:
                        raise ValueError('本屏批准省略声明与固定来源范围不一致')
                    if not expected_source or expected_source['source_sha256']!=original_proof['sha256']:
                        raise ValueError('本屏来源不在固定 E214 全文清单')
                    meta['original_html']=rule_contract.project_original_html(meta['original_html'])
                    if hybrid.builder.typeset_prose_digest(meta['original_html'])!=excerpt['rendered_text_sha256']:
                        raise ValueError('本屏原文与独立固定 '+pin['version']+' 摘录全文摘要不符')
                    fixed_source_link_targets=rule_contract.excerpt_link_targets(pin,identity,original_path.read_bytes())
                    public_source=rule_contract.public_markdown(original_path.read_text('utf-8-sig'),meta['relative_file']).encode('utf8')
                    public_sha=rule_contract.sha_bytes(public_source)
                    if public_sha!=expected_source['public_source_sha256']:
                        raise ValueError('公开来源投影与固定来源合同不一致')
                    meta['public_source_sha256']=public_sha
                    meta['src']='/_typeset/rule-sources/'+public_sha+'.md'
                    public_path=candidate/meta['src'].lstrip('/');public_path.parent.mkdir(parents=True,exist_ok=True);public_path.write_bytes(public_source)
                    model['screen_anchors']=list(dict.fromkeys(model['screen_anchors']+excerpt['heading_aliases']))
                    if name=='charter':
                        first,last=excerpt['selection']['articles']
                        model['screen_anchors']=list(dict.fromkeys(model['screen_anchors']+['L'+str(number) for number in range(first,last+1)]))
                    release_root=original_path.parents[len(Path(meta['relative_file']).parts)-1]
                    record=release_root/'release.json';inputs[str(record.resolve())]=stamp(record)
                    if inputs[str(record.resolve())]['sha256']!=pin['release_record_sha256']:
                        raise ValueError('原文来源发布记录不在固定 E214 合同')
                    for resource,proof in pin.get('public_source_resources',{}).items():
                        if not resource.startswith('/rule-sources/'):continue
                        resource_source=release_root/proof['relative_file'];resource_proof=stamp(resource_source)
                        inputs[str(resource_source.resolve())]=resource_proof
                        if resource_proof['sha256']!=proof['source_sha256']:raise ValueError('公开入口模板原始SHA不符')
                        resource_bytes=rule_contract.public_markdown(resource_source.read_text('utf-8-sig'),proof['relative_file']).encode('utf8')
                        if rule_contract.sha_bytes(resource_bytes)!=proof['public_source_sha256']:raise ValueError('公开入口模板投影SHA不符')
                        target=candidate/resource.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(resource_bytes)
                else:
                    meta['src']=asset(original_path,candidate,'rule-sources')
            except (KeyError,OSError,ValueError) as error:
                meta.pop('original_html', None)
                issues.append(sid+':缺少真实原文来源证据：'+str(error))
        whole=next((l for l in old.get('layouts',{}).get('h',{}).get('links',[])if l.get('whole')),None)
        if whole:model['primary_href']=whole['href']
        if section not in seen_sections:
            main.append('<div class="section-anchor" id="'+html.escape(section,quote=True)+'"></div>')
            seen_sections.add(section)
        anchor_ids = model['screen_anchors']
        # Producer does not currently emit anchor coordinates. Keep all named targets on their owning screen.
        anchors = ''.join('<span class="point-anchor typeset-screen-anchor" id="'+html.escape(a,quote=True)+'" data-anchor-binding="screen"></span>' for a in anchor_ids if a not in seen_sections and a!=sid)
        seen_sections.update(anchor_ids)
        queues = {}; compact_live = {}; occurrences=defaultdict(int)
        # Metadata order is per complete direction, before portrait continuation splitting.
        for orient in ['h','v']:
            hp = args.typeset_root/name/'html'/f'{sid}-{orient}.html'
            if hp.exists():
                html_meta,html_meta_proof=text_bound(hp);inputs[str(hp.resolve())] = html_meta_proof
                metadata = HotMetadata(html_meta)
                queues[orient] = {k:deque(v) for k,v in metadata.groups.items()}
                compact_live[orient] = metadata.compact_live
                transcripts.setdefault(sid,{})[orient]=publication.rendered_text(html_meta)
        part_html = []
        has_v = any(i.get('orientation','v' if '-v' in i['image'] else 'h') == 'v' for i in entry['images'])
        if not has_v and src.get('shape') != 'card' and not preview_only:
            issues.append(sid+':缺竖图')
        source_offsets={'h':0,'v':0};part_indices={'h':0,'v':0}
        for image in entry['images']:
            ip = args.typeset_root/name/image['image']; lp = args.typeset_root/name/image['links']
            hot,links_proof=json_bound(lp)
            inputs[str(ip.resolve())] = stamp(ip); inputs[str(lp.resolve())] = links_proof
            size = png_size(ip)
            orient = image.get('orientation','v' if '-v' in ip.name else 'h')
            if image.get('hotspots',len(hot)) != len(hot): issues.append(ip.name+':热区数量不符')
            part = {'image':ip.name,'src':asset(ip,candidate,name),'size':size,'orientation':orient,
                    'both':not has_v,'hotspots':[],'live':[],'native_live':[],'native_actions':[],
                    'links':[],'anchors':[],'screenshots':[],'cards':[],'numbers':[],'dots':[],'arrows':[]}
            # Only the producer's plain strip separates its heading and footer
            # from the replaceable slots. Legacy framed strips keep their source.
            if compact_live.get(orient):
                part['compact_live'] = True
            geometry=geometries.get((sid,orient));padding=30 if part_indices[orient]else 0
            if geometry:
                recorded=next((x for x in geometry.get('parts',[])if x['image']==ip.name),None)
                if geometry.get('issues'):issues.append(sid+'/'+orient+':动效量测失败：'+str(geometry['issues']))
                elif geometry.get('broken_images'):issues.append(sid+'/'+orient+':参考插画未加载')
                elif geometry.get('html_sha256')!=inputs.get(str((args.typeset_root/name/'html'/f'{sid}-{orient}.html').resolve()),{}).get('sha256'):
                    issues.append(sid+'/'+orient+':动效位置不是这一代HTML')
                elif geometry.get('measured_width')!=size[0] or abs(geometry.get('measured_height',0)-geometry.get('source_height',0))>2:
                    issues.append(sid+'/'+orient+':动效位置的视口尺寸不符')
                elif not recorded or recorded['sha256']!=inputs[str(ip.resolve())]['sha256'] or recorded.get('size')!=size:
                    issues.append(sid+'/'+orient+':动效位置不是这一代PNG')
                else:
                    try:
                        current_html=(args.typeset_root/name/'html'/f'{sid}-{orient}.html').read_text('utf8')
                        if geometry.get('measurement_recipe')!='producer-components-v8' or any(not isinstance(geometry.get(key),list) for key in ['cards','numbers','dots','arrows']):
                            raise ValueError('缺少当前生产DOM的完整 cards/numbers/dots/arrows 数组')
                        content=geometry.get('content_occupancy',{})
                        measurement_sha=hashlib.sha256((HERE/'typeset-measure.js').read_text('utf8').encode('utf8')).hexdigest()
                        if content.get('policy')!='semantic-content-rects-v1' or content.get('issues') or content.get('measurement_sha256')!=measurement_sha or not isinstance(content.get('blocks'),list):
                            raise ValueError('缺少当前生产DOM的真实内容占用量测')
                        for block in content['blocks']:
                            r=block.get('rect')
                            if block.get('kind') not in {'text','drawing'} or not isinstance(r,list) or len(r)!=4 or any(not isinstance(value,(int,float)) or not math.isfinite(value) for value in r) or r[2]<=0 or r[3]<=0:
                                raise ValueError('真实内容占用量测包含无效文字/绘画坐标')
                        part['dot_capability']=motion_prep.dot_evidence(geometry,current_html)
                        part.update(motion_part(geometry,ip.name,size,source_offsets[orient],padding))
                        part['motion_measured']=True
                    except ValueError as error:issues.append(sid+'/'+orient+':状态点量测证据不完整：'+str(error))
                if old_video and data['video'] is None and len(data['screens'])==0 and orient=='h' and part_indices[orient]==0 and not issues:
                    try:
                        box,video_binding=video_position(old_video,old,geometry.get('illustrations',[]),name,args)
                        if box[0]<0 or box[1]<0 or box[0]+box[2]>size[0]+1 or box[1]+box[3]>size[1]+1:raise ValueError('视频定位越出首屏图片：'+name)
                        data['video']={**old_video,'rect':[box[0]/size[0],box[1]/size[1],box[2]/size[0],box[3]/size[1]],
                                       'mount_allowed':False,'compatibility':{'status':'insufficient_evidence','reason':'排版定位只说明槽位；同素材或严格帧匹配证据到齐并核验后再挂载'}}
                    except ValueError as error:
                        # A missing new illustration slot cannot prove matching.
                        # Keep every old media field and geometry as evidence;
                        # the streaming runtime never mounts this unverified spec.
                        data['video']={**old_video,'mount_allowed':False,
                                       'compatibility':{'status':'insufficient_evidence',
                                                        'reason':str(error)+'；原媒体与原坐标保留作退路，未定位到新版画面，不挂载'}}
                        video_binding={'status':'insufficient_evidence','reason':str(error),
                                       'original_geometry_retained':True}
            else:issues.append(sid+'/'+orient+':缺少绑定当前PNG与HTML的动效位置')
            source_offsets[orient]+=size[1]-padding;part_indices[orient]+=1
            live_allowed = set(src.get('live',[])) | {x.get('slot') for x in source.get('registry',{}).get('live',[])}
            for index,h in enumerate(hot):
                h = dict(h)
                if h.get('kind') not in {'link','button','live','screenshot'}:
                    issues.append(ip.name+':未知热区类型'); continue
                rect = [h[k] for k in ['x','y','w','h']]
                if any(not isinstance(x,(int,float)) for x in rect) or rect[0]<0 or rect[1]<0 or rect[2]<=0 or rect[3]<=0 or rect[0]+rect[2]>size[0]+1 or rect[1]+rect[3]>size[1]+1:
                    issues.append(ip.name+':热区越界'); continue
                h.update({'id':sid+'-'+orient+'-'+str(index)+'-'+str(image_count),
                          'rect':[rect[0]/size[0],rect[1]/size[1],rect[2]/size[0],rect[3]/size[1]],'rect_px':rect})
                key=(h['kind'],h.get('href','')); queue=queues.get(orient,{}).get(key,deque())
                # Live frames and buttons have one DOM rect each; links may have multiple text fragments.
                meta = queue[0] if queue else {}
                if queue and h['kind'] in {'live','button','screenshot'}: meta = queue.popleft()
                h['live_part']=meta.get('data-live-part','')
                if h['kind']=='button':
                    occurrence_key=(orient,h.get('text') or h.get('href'))
                    h['occurrence']=occurrences[occurrence_key];occurrences[occurrence_key]+=1
                if h['kind']=='live':
                    if h['href'] not in live_allowed:
                        issues.append(sid+':实时键不属于定稿：'+h['href']); h['invalid']=True
                    h['slot']=live_key(h['href'],h['live_part'])
                    if src.get('live') and name in {'cockpit','computer-access','mcp'}:
                        part['native_live'].append({'slot':h['slot'],'rect':h['rect'],'live_part':h['live_part'],'hot_id':h['id']})
                    else: part['live'].append({'slot':h['slot'],'rect':h['rect']})
                elif h['kind']=='button' and not re.match(r'^(?:/|#|https?://)',h['href']):
                    action = action_for(h,meta,src,old)
                    if action is None:
                        issues.append(sid+':按钮动作未唯一绑定：'+h['href']); h['invalid']=True
                    else:
                        h['action']=action['action']
                        part['native_actions'].append({k:v for k,v in action.items() if k in {'action','text','copy_text'}}|{'rect':h['rect'],'hot_id':h['id']})
                elif h['kind'] in {'link','button'}:
                    if shape=='source_text':h['href']=rule_contract.source_link_target(h['href'])
                    h['original_href']=h['href']
                    known = {rule_contract.source_link_target(x['href']) if shape=='source_text' else x['href'] for x in src.get('links',[])}
                    if shape=='source_text':known.update(fixed_source_link_targets)
                    if h['href'] not in known:
                        issues.append(sid+':链接目标不属于定稿：'+h['href'])
                    part['links'].append(h)
                elif h['kind']=='screenshot':
                    shots = screenshot(h,src)
                    if not shots:
                        issues.append(sid+':截图槽未绑定：'+h['href']); h['invalid']=True
                    h['shots']=[]
                    for sh in shots:
                        sp=Path(args.resource_map.get(os.path.normcase(str(Path(sh['file']).resolve())),sh['file'])); inputs[str(sp.resolve())]=stamp(sp)
                        from PIL import Image
                        with Image.open(sp) as original_shot: shot_size=list(original_shot.size)
                        # The owner's screenshot requirement is complete, readable
                        # originals. Earlier source crop hints are not display bounds.
                        crop=None
                        bound={'src':asset(sp,candidate,'screenshots'),'caption':sh.get('caption',''),'role':sh.get('role',''),'size':shot_size,'crop':crop}
                        if sh.get('full'):
                            fp=Path(args.resource_map.get(os.path.normcase(str(Path(sh['full']).resolve())),sh['full']));inputs[str(fp.resolve())]=stamp(fp);bound['full']=asset(fp,candidate,'screenshots',args.baseline,args.baseline_files)
                        h['shots'].append(bound)
                if h['kind'] in {'live','screenshot'} or h.get('action') or h.get('invalid'):
                    h['target']=h.pop('href')
                part['hotspots'].append(h)
            part['interactive_cards']=bind_card_feedback(part,old,orient)if shape!='card'else[]
            model['parts'].append(part); image_count += 1
            safe=html.escape(sid+'-'+str(len(model['parts'])),quote=True)
            part_html.append(f'<div class="typeset-part" data-part="{safe}" data-orientation="{orient}" data-both="{str(not has_v).lower()}" style="aspect-ratio:{size[0]}/{size[1]}"><picture><img data-src="{part["src"]}" width="{size[0]}" height="{size[1]}" alt="{html.escape(src.get("title",sid),quote=True)}" decoding="async" loading="lazy" draggable="false"></picture><div class="overlays"></div></div>')
        for orient in ['h','v']:
            ps=[x for x in model['parts'] if x['orientation']==orient or x['both']]
            provided={x['href'] for p in ps for x in p['links']}
            for link in src.get('links',[]):
                if '〔'+link.get('text','')+'〕' in src.get('text','') and link['href'] not in provided:
                    issues.append(sid+'/'+orient+':缺链接热区：'+link.get('text',''))
        if shape=='card' and not grid_open:main.append('<div class="card-grid typeset-card-grid">');grid_open=True
        main.append('<section class="screen typeset-screen shape-'+html.escape(shape,quote=True)+'" data-shape="'+html.escape(shape,quote=True)+'" id="'+html.escape(sid,quote=True)+'" data-screen="'+html.escape(sid,quote=True)+'" data-section="'+html.escape(section,quote=True)+'">'+anchors+''.join(part_html)+'</section>')
        data['screens'].append(model);screen_count+=1
    if grid_open:main.append('</div>')
    if preview_only or templated:
        text=re.sub(r'<title>.*?</title>','<title>'+html.escape(source['title'])+'</title>',text,flags=re.S)
        text=re.sub(r'(<link[^>]*rel="canonical"[^>]*href=")[^"]*',r'\g<1>https://wly0829.cn'+url,text)
        sections={}
        for s in data['screens']:sections.setdefault(s['section'],source_map[s['id']].get('nav_title') or s['title'])
        toc='<nav class="toc" aria-label="本页目录"><div class="toc-inner toc-text">'+''.join('<a class="nav-link" href="#'+html.escape(k,quote=True)+'" data-section="'+html.escape(k,quote=True)+'" data-label-h="'+html.escape(v,quote=True)+'" data-label-v="'+html.escape(v,quote=True)+'">'+html.escape(v)+'</a>'for k,v in sections.items())+'</div></nav>'
        text=re.sub(r'<nav class="toc".*?</nav>',lambda _:toc,text,flags=re.S)
    text = re.sub(r'(<main\b[^>]*>).*?(</main>)',lambda m:m[1]+''.join(main)+m[2],text,count=1,flags=re.S)
    text,toc_binding=bind_current_toc(text,data,source)
    scripts=re.findall(r'<script\b[^>]*src="([^"]+)"',text)
    for sr in scripts:
        if sr.startswith('/_shared/app-'):
            ap=args.legacy_site/sr.lstrip('/');app_text,app_proof=text_bound(ap);inputs[str(ap.resolve())]=app_proof
            patched=patch_app(app_text);new=bundle(patched,candidate,'app','.js')
            text=text.replace(sr,new);data['shared']['script_bundle']=new
        elif 'b2-live-' in sr and sr.endswith('.js'):
            bp=(base_html.parent/sr).resolve();b2_text,b2_proof=text_bound(bp);inputs[str(bp)]=b2_proof
            # Place it beside the original imports; imports remain relative to this route's assets.
            patched=patch_b2(b2_text);bn='b2-typeset-'+hashlib.sha256(patched.encode()).hexdigest()[:16]+'.js'
            dest=candidate/Path(rel).parent/'assets'/bn;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(patched,encoding='utf8')
            text=text.replace(sr,'assets/'+bn)
    for sr in re.findall(r'<link\b[^>]*href="([^\"]*b2-live-[^\"]+\.css)"',text):
        new=bundle((HERE/'b2-live.css').read_text('utf8'),candidate,'b2-live','.css')
        text=text.replace(sr,new)
    # Earlier Windows bundles used a LF-derived name but stored CRLF bytes.
    # A fresh label keeps those immutable published files intact.
    css=bundle((HERE/'typeset-layout.css').read_text('utf8'),candidate,'typeset-layout','.css')
    data['motion_counts']={key:sum(len(p.get(key,[]))for s in data['screens']for p in s['parts'])for key in ['cards','numbers','dots','arrows']}
    expected_effects,capabilities,effect_changes=current_effects(data,source,expected_effects)
    if any(item['status']=='measurement_missing' for item in capabilities.values()):issues.append('缺少当前布局效果能力的完整量测')
    if data['motion_counts']['dots']:expected_effects.append('dots')
    dot_capabilities=[p.get('dot_capability')for s in data['screens']for p in s['parts']]
    dot_status='present'if data['motion_counts']['dots']else'no_corresponding_element'if dot_capabilities and all(dot_capabilities)else'measurement_missing'
    data['motion_capabilities']={**capabilities,'dots':{'policy':motion_prep.DOT_POLICY,'status':dot_status,'label':'新版面无对应元素'if dot_status=='no_corresponding_element'else'当前有效状态标记'}}
    text=text.replace('</head>',f'<link rel="stylesheet" href="{css}"></head>')
    label_names=set(re.findall(r'data-label-(?:text|h|v)="([^"]+)"',text))
    data['shared']['nav_labels']={k:v for k,v in data['shared'].get('nav_labels',{}).items()if k in {html.unescape(x)for x in label_names}}
    avif_map=data['shared'].pop('avif_assets',{})
    probe=DATA.sub(lambda m:m[1]+json.dumps(data,ensure_ascii=False).replace('</',r'<\/')+m[3],text,count=1)
    refs_parser=hybrid.builder.Refs();refs_parser.feed(probe)
    actual_refs={r for r,_ in refs_parser.refs}|{r for r,_ in hybrid.builder.nested_refs(data)}
    data['shared']['avif_assets']={k:v for k,v in avif_map.items()if k in actual_refs}
    # Acceptance metadata stays in the bound build report. It is not a new
    # website runtime payload and does not enlarge every public route.
    content_occupancy={'policy':'semantic-content-rects-v1','parts':{
        part['image']:part['content_occupancy'] for screen in data['screens']
        for part in screen['parts'] if part.get('content_occupancy')}}
    inputs[str((HERE/'typeset-measure.js').resolve())]=stamp(HERE/'typeset-measure.js')
    data=public_page_data(data)
    text=DATA.sub(lambda m:m[1]+json.dumps(data,ensure_ascii=False).replace('</',r'<\/')+m[3],text,count=1)
    # The exact HTML used for the raster also owns its spoken/text equivalent.
    text,_=publication.install_transcripts(text,transcripts,url,omit_local_paths=True)
    if not (candidate/'favicon.svg').exists():
        favicon=next((root/'favicon.svg' for root in (args.legacy_site,args.baseline) if (root/'favicon.svg').is_file()),None)
        if favicon:shutil.copyfile(favicon,candidate/'favicon.svg')
    if url not in {'/404.html','/404/'}:
        text,_=publication.apply_metadata(text,url,candidate,data,source)
    if new_project and name=='wly0829-cn':
        bird_spec=importlib.util.spec_from_file_location('typeset_new_bird',HERE/'prepare-new-project-bird.py')
        bird=importlib.util.module_from_spec(bird_spec);bird_spec.loader.exec_module(bird)
        text=bird.attach(text,data,candidate,geometries)
        for path in (HERE/'prepare-new-project-bird.py',bird.HERO,Path(bird.living.__file__)):
            inputs[str(path.resolve())]=stamp(path)
    dest=candidate/rel;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text,encoding='utf8')
    for p,proof in inputs.items():
        if stamp(p)!=proof: issues.append('构建期间输入变化：'+p)
    video_expected=None
    if data.get('video'):
        vp=hybrid.builder.resolve_ref(args.legacy_site,base_html,data['video']['src'])
        maskp=hybrid.builder.resolve_ref(args.legacy_site,base_html,data['video']['mask'])
        inputs[str(vp)]=stamp(vp);inputs[str(maskp)]=stamp(maskp)
        video_expected={**data['video'],'src_sha256':inputs[str(vp)]['sha256'],'src_bytes':inputs[str(vp)]['bytes'],
                        'mask_sha256':inputs[str(maskp)]['sha256'],'mask_bytes':inputs[str(maskp)]['bytes'],'binding':video_binding}
    elif old_video:issues.append('原视频还未重新定位；禁止发布本候选')
    return {'url':url,'status':'built' if not issues else 'blocked','issues':sorted(set(issues)),
            'authored_url':authored_url,'route_alias_contract':{'original':authored_url,'canonical':url} if url!=authored_url else None,
            'inputs':inputs,'html_sha256':hybrid.digest(dest),'quality':q,'preview_only':preview_only,
            'effects_expected':expected_effects,'effects_expected_legacy':legacy_effects,'effects_expectation_changes':effect_changes,
            'effects_capabilities':data['motion_capabilities'],'motion_appearance':motion_prep.appearance(),'video_expected':video_expected,
            'geometry_sha256':geometry_sha256,'original_video':old_video,
            'content_occupancy':content_occupancy,
            'toc_binding':toc_binding,
            'screens':screen_count,'images':image_count,'template_shell':templated,'anchor_binding':'owning-screen',
            'anchors':sum(len(x['screen_anchors'])for x in data['screens'])}

def main():
    global ASSET_CACHE,REUSE_ASSET_CACHE
    started=time.perf_counter()
    ap=argparse.ArgumentParser(description=__doc__)
    for arg in ['typeset-root','baseline','legacy-site','output','report']:
        ap.add_argument('--'+arg,type=Path,required=True)
    ap.add_argument('--inventory',type=Path,default=HERE.parent/'.publish/inventory/screens.jsonl')
    ap.add_argument('--pages',nargs='+')
    ap.add_argument('--native-routes',nargs='+',help='Existing native project routes whose fresh SSR main replaces the baseline body')
    ap.add_argument('--preview-support',action='store_true',help='Add unselected legacy shells for a local pilot; never use for publication')
    ap.add_argument('--geometry',type=Path)
    ap.add_argument('--asset-cache',type=Path)
    ap.add_argument('--reuse-asset-cache',action='store_true',help='Verify and reuse existing lossless encodings; retain exact PNG bytes when no cache exists')
    ap.add_argument('--release-overlay',type=Path,help='Exact approved search and runtime-reference updates bound by old/new hashes')
    ap.add_argument('--creative-preparation',type=Path,help='Fixed six-step 2e preparation recipe; replay before final evidence')
    ap.add_argument('--baseline-ref',help='Exact published commit whose OSS source is the complete runtime baseline')
    ap.add_argument('--runtime-baseline',action='store_true',help='Verify the complete local source against that commit without changing its manifest')
    ap.add_argument('--rule-public-projection',type=Path,help='Sealed public rule image generation; defaults to typeset-root/rule-public-projection.json')
    ap.add_argument('--live-ui-preparation',type=Path,help='Replay the delivered live UI, font and directory assets before assembly')
    args=ap.parse_args()
    native_inputs=native_readability.source_inputs(stamp) if args.native_routes else None
    REUSE_ASSET_CACHE=args.reuse_asset_cache
    for k in ['typeset_root','inventory','baseline','legacy_site','output','report']:setattr(args,k,getattr(args,k).resolve())
    baseline_manifest=read(args.baseline/'release-manifest.json')
    if args.runtime_baseline:
        baseline_spec=importlib.util.spec_from_file_location('typeset_runtime_baseline',HERE/'prepare-audit-release.py')
        baseline_module=importlib.util.module_from_spec(baseline_spec)
        baseline_spec.loader.exec_module(baseline_module)
        baseline_manifest=baseline_module.verify_input_baseline(args.baseline,args.baseline_ref,True)
    elif args.baseline_ref:
        raise ValueError('--baseline-ref requires --runtime-baseline')
    args.baseline_files=baseline_manifest['files']
    if args.geometry:args.geometry=args.geometry.resolve()
    args.snapshot_path=args.typeset_root.parent/'snapshot.json';args.snapshot_proof=None;args.resource_map={};args.external_inputs={}
    args.rule_projection_records={};args.rule_projection_inputs={}
    args.rule_projection_path=(args.rule_public_projection or args.typeset_root/'rule-public-projection.json').resolve()
    if args.rule_projection_path.is_file():
        projection_spec=importlib.util.spec_from_file_location('typeset_rule_projection',HERE/'prepare-rule-public-projection.py')
        projection_module=importlib.util.module_from_spec(projection_spec);projection_spec.loader.exec_module(projection_module)
        projection=projection_module.verify_projection(args.rule_projection_path.parent)
        args.rule_projection_proof=stamp(args.rule_projection_path)
        args.rule_projection_id=projection_module.projection_digest(projection)
        args.rule_projection_records={(row['page'],row['screen'],row['orientation']):row for row in projection['records']}
        for entry in projection['projected_pages']:
            for path_key,sha_key in [('source_file','source_sha256'),('raw_source_file','raw_source_sha256'),('spec_file','spec_sha256'),('raw_spec_file','raw_spec_sha256')]:
                path=Path(entry[path_key]).resolve();args.rule_projection_inputs[str(path)]={'sha256':entry[sha_key],'bytes':path.stat().st_size}
        for row in projection['records']:
            raw=Path(projection['raw_root'])/row['page']/'html'/(row['screen']+'-'+row['orientation']+'.html')
            args.rule_projection_inputs[str(raw.resolve())]={'sha256':row['raw_html_sha256'],'bytes':raw.stat().st_size}
    if args.snapshot_path.is_file():
        snapshot,args.snapshot_proof=json_bound(args.snapshot_path)
        if snapshot.get('status')!='pass':raise ValueError('Input snapshot is not stable')
        args.resource_map={os.path.normcase(str(Path(source).resolve())):str(Path(target).resolve())for source,target in snapshot.get('resource_map',{}).items()}
        args.external_inputs={dependency['original_path']:{'sha256':dependency['sha256'],'bytes':dependency['bytes']}for dependency in snapshot.get('external_dependencies',[])}
        for path,proof in args.external_inputs.items():
            if stamp(path)!=proof:raise ValueError('System font changed after the input snapshot: '+path)
    if args.output.exists():raise ValueError('Choose a fresh output directory')
    inventory_text,args.inventory_proof=text_bound(args.inventory)
    rows=[json.loads(x)for x in inventory_text.splitlines()if x.strip()]
    if args.inventory == (HERE.parent/'sources/screens.jsonl').resolve():
        for row in rows: row['source_path'] = str(HERE.parent/'sources/pages'/row['page']/'page.json')
    grouped=defaultdict(list)
    for row in rows:grouped[row['page']].append(row)
    names=args.pages or list(grouped)
    ASSET_CACHE=args.asset_cache.resolve()if args.asset_cache else args.typeset_root.parent/'integration'/'asset-cache'
    ASSET_CACHE.mkdir(parents=True,exist_ok=True)
    to_encode=[]
    for name in names:
        mp=args.typeset_root/name/'page-manifest.json'
        if mp.exists():
            for screen in read(mp).get('screens',[]):
                to_encode.extend(args.typeset_root/name/im['image']for im in screen.get('images',[])if (args.typeset_root/name/im['image']).is_file())
    with ThreadPoolExecutor(max_workers=4) as pool:
        for i,_ in enumerate(pool.map(encode_png,to_encode),1):
            if i%50==0 or i==len(to_encode):print(f'lossless pixel verification {i}/{len(to_encode)}',flush=True)
    candidate=args.output.parent/(args.output.name+'-candidate')
    if candidate.exists():raise ValueError('Choose a fresh candidate directory')
    candidate.mkdir(parents=True)
    overlay = hybrid.load_overlay(args.release_overlay.resolve(), args.baseline) if args.release_overlay else None
    if overlay:
        for rel,entry in overlay['files'].items():
            dest = candidate/rel;dest.parent.mkdir(parents=True,exist_ok=True);hybrid.builder.copy_release_asset(entry['source_path'],dest)
    states={}
    for n in names:
        try:
            states[n]=build_page(n,grouped[n],args,candidate)
            for attempt in range(2):
                if not any(x.startswith('构建期间输入变化：')for x in states[n].get('issues',[])):break
                states[n]=build_page(n,grouped[n],args,candidate)
        except Exception as e:states[n]={'status':'missing' if isinstance(e,FileNotFoundError)else'blocked','issues':[str(e)]}
        print(n+':'+states[n]['status'],flush=True)
    blocked_states={name:state for name,state in states.items()if state.get('status')!='built'}
    write(args.output.with_name(args.output.name+'-page-blockers.json'),
          {'schema':'wly.typeset-page-blockers.v1','stage':'before-workbench','pages':blocked_states})
    # Blocked pages remain available as labelled local previews; publication uses the independent evidence gate.
    accepted={s['url']:{'page':n,'preview':True,'build_status':s['status']}for n,s in states.items()if s.get('url')}
    support=[]
    if args.pages and args.preview_support:
        # A two-page pilot retains the declared destinations using existing page skeletons.
        # This is local preview support, explicitly excluded from publication evidence.
        for n,records in grouped.items():
            if n in names:continue
            src=read(records[0]['source_path']);url=src.get('url') or src.get('source_url')
            if not url or url=='/' or (args.baseline/hybrid.route_file(url)).exists():continue
            source_html=args.legacy_site/hybrid.route_file(url)
            if source_html.is_file():
                dest=candidate/hybrid.route_file(url);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source_html,dest)
                accepted[url]={'preview_support':True,'page':n};support.append(n)
    local_deps(candidate,args.legacy_site,args.baseline)
    workbench=None;workbench_inputs={}
    if args.rule_public_projection:
        workbench_spec=importlib.util.spec_from_file_location('typeset_rule_workbench',HERE/'prepare-rule-workbench-originals.py')
        workbench_module=importlib.util.module_from_spec(workbench_spec);workbench_spec.loader.exec_module(workbench_module)
        workbench=workbench_module.prepare(candidate,args.rule_projection_path)
        workbench_inputs=workbench.pop('inputs')
    live_ui=None;live_ui_inputs={}
    if args.live_ui_preparation:
        ui_spec=importlib.util.spec_from_file_location('typeset_live_ui',HERE/'prepare-live-ui.py')
        ui_module=importlib.util.module_from_spec(ui_spec);ui_spec.loader.exec_module(ui_module)
        live_ui,live_ui_inputs=ui_module.prepare_recipe(candidate,args.live_ui_preparation,pages=[hybrid.route_file(url)for url in accepted])
        for missing in live_ui['toc']['missing_labels']:
            matches=[s for s in states.values()if s.get('url') and hybrid.route_file(s['url'])==missing['page']]
            if len(matches)!=1:raise ValueError('Live UI missing-label page is outside the exact selected scope: '+missing['page'])
            state=matches[0];state['status']='blocked'
            state.setdefault('issues',[]).append('实时界面目录缺字图：'+', '.join(missing['labels']))
            accepted[state['url']]['build_status']='blocked'
    if args.creative_preparation and (args.release_overlay or args.preview_support):
        raise ValueError('Creative replay uses the complete native five-page source without preview support or another overlay')
    native=native_readability.prepare(args,candidate,accepted,native_inputs,stamp,hybrid.route_file) if args.native_routes else None
    if native:args.external_inputs.update(native['inputs'])
    raw_output=args.output.parent/(args.output.name+'-raw') if args.creative_preparation else args.output
    creative_scope=read(args.creative_preparation).get('scope')if args.creative_preparation else None
    manifest=hybrid.assemble(args.baseline,candidate,raw_output,baseline_manifest,accepted,overlay=overlay,
                             baseline_production_commit=args.baseline_ref,
                             baseline_input_kind='complete_runtime_staging' if args.runtime_baseline else None)
    inherited_retry=baseline_manifest.get('resource_retry_preparation',{})
    if not args.creative_preparation and inherited_retry.get('runtime') in manifest['files'] and manifest['files'][inherited_retry['runtime']]==baseline_manifest['files'].get(inherited_retry['runtime']):
        manifest['resource_retry_preparation']=inherited_retry
        hybrid.write(raw_output/hybrid.MANIFEST,manifest)
    if native:manifest['native_readability']=native;hybrid.write(raw_output/hybrid.MANIFEST,manifest)
    if manifest['files'].get('index.html')==baseline_manifest['files'].get('index.html'):
        manifest.update({key:baseline_manifest[key] for key in ('home_static_preparation','home_comic_preparation') if key in baseline_manifest});hybrid.write(raw_output/hybrid.MANIFEST,manifest)
    static_home=baseline_manifest.get('home_static_preparation',{})
    original_app=static_home.get('home_bundle',{})
    if original_app and manifest['files'].get(original_app['path'])=={key:original_app[key] for key in ('sha256','bytes')}:
        manifest['home_static_preparation']=static_home
        hybrid.write(raw_output/hybrid.MANIFEST,manifest)
    comic_home=baseline_manifest.get('home_comic_preparation',{})
    comic_files=[rel for rel in baseline_manifest['files'] if rel.startswith('_shared/home-comic/'+comic_home.get('package_id','')[:20]+'/')]
    if comic_home and comic_files and all(manifest['files'].get(rel)==baseline_manifest['files'][rel] for rel in comic_files):
        manifest['home_comic_preparation']=comic_home
        hybrid.write(raw_output/hybrid.MANIFEST,manifest)
    creative=None;creative_inputs={}
    if args.creative_preparation:
        creative_spec=importlib.util.spec_from_file_location('typeset_creative',HERE/'prepare-creative-release.py')
        creative_module=importlib.util.module_from_spec(creative_spec);creative_spec.loader.exec_module(creative_module)
        staged_report=None
        if creative_scope in ('full-pages-creative-2f','full-pages-creative-2f-static-home'):
            staged_report=args.output.parent/(args.output.name+'-staged-build-report.json')
            for state in states.values():
                if state.get('url'):state['html_sha256']=hybrid.digest(raw_output/hybrid.route_file(state['url']))
            how_source=next((Path(row['source_path']) for row in rows if row['page']=='how'),None)
            if how_source: args.external_inputs[str(how_source)]=stamp(how_source)
            write(staged_report,{'schema':'wly.typeset-build.v1','stage':'native-before-creative','release_id':manifest['release_id'],
                **({'native_readability':native} if native else {}),
                'pages':states,'files':manifest['files'],'baseline_root':str(args.baseline),
                'inputs':{str(args.inventory):args.inventory_proof,**args.external_inputs,**live_ui_inputs,**workbench_inputs},
                'geometry_path':str(args.geometry),'geometry_sha256':hybrid.digest(args.geometry)})
        manifest,creative,creative_inputs=creative_module.prepare(raw_output,args.baseline,args.creative_preparation,args.output,
            args.output.parent/(args.output.name+'-creative-evidence'),staged_build_report=staged_report,
            retry_predecessor_manifest=args.legacy_site/hybrid.MANIFEST)
    if live_ui and read(args.live_ui_preparation).get('toc_unify_package'):
        # Refresh only the approved directory on the complete, creatively
        # prepared site; the original six-step release chain stays intact.
        before_toc_files=manifest['files']
        toc,toc_inputs=ui_module.prepare_toc_recipe(args.output,args.live_ui_preparation)
        for path,expected in toc_inputs.items():
            if path in live_ui_inputs and live_ui_inputs[path]!=expected:
                raise ValueError('TOC input changed after early UI preparation: '+path)
        live_ui_inputs.update(toc_inputs)
        live_ui.update(toc=toc,status='prepared')
        files=hybrid.inventory(args.output)
        accepted_files={hybrid.route_file(url)for url in manifest['accepted_pages']}
        ledger=manifest.setdefault('release_overlay',{})
        for relative,entry in ledger.items():
            if entry.get('before')!=manifest['baseline_files'].get(relative):
                raise ValueError('TOC predecessor ledger differs from the baseline: '+relative)
            entry['after']=files[relative]
        for relative,proof in files.items():
            if relative not in accepted_files and proof!=before_toc_files.get(relative) and relative not in ledger:
                ledger[relative]={'kind':'integrated_preparation',
                                  'before':manifest['baseline_files'].get(relative),'after':proof}
        manifest['files']=files
        manifest['release_id']=hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest()
        if creative:
            creative['files']=ledger
            creative['assembled_release_id']=manifest['release_id']
            manifest['creative_preparation']=creative
    if live_ui:
        manifest['live_ui_preparation']=live_ui
        hybrid.write(args.output/hybrid.MANIFEST,manifest)
    if workbench:
        manifest['rule_original_workbench']=workbench
        hybrid.write(args.output/hybrid.MANIFEST,manifest)
    if native:
        if native_readability.source_inputs(stamp)!=native_inputs:raise ValueError('Native source inputs changed after SSR')
        manifest['native_readability']=native
        hybrid.write(args.output/hybrid.MANIFEST,manifest)
    for s in states.values():
        if s.get('url'):s['html_sha256']=hybrid.digest(args.output/hybrid.route_file(s['url']))
    report={'schema':'wly.typeset-build.v1','built_at_beijing':datetime.now(BJT).isoformat(),
            'pages':states,'expected_pages':list(grouped),'preview_support_pages':support,'release_id':manifest['release_id'],
            'baseline_root':str(args.baseline),'baseline_index_sha256':hybrid.digest(args.baseline/'index.html'),
            'baseline_manifest_sha256':hybrid.digest(args.baseline/'release-manifest.json'),
            'inputs':{str(args.inventory):args.inventory_proof,**args.external_inputs},'files':manifest['files'],
            'home_unchanged':hybrid.digest(args.output/'index.html')==hybrid.digest(args.baseline/'index.html'),
            'geometry_path':str(args.geometry)if args.geometry else None,
            'geometry_sha256':hybrid.digest(args.geometry)if args.geometry and args.geometry.exists()else None,
            'asset_cache':str(ASSET_CACHE),'input_snapshot':{'path':str(args.snapshot_path),**args.snapshot_proof}if args.snapshot_proof else None,
            'seconds':round(time.perf_counter()-started,3),
            'output_root':str(args.output),'candidate_root':str(candidate)}
    if overlay:
        report['release_overlay']={'path':str(args.release_overlay.resolve()),**stamp(args.release_overlay.resolve()),'files':overlay['files']}
        report['inputs'].update({str(args.release_overlay.resolve()):stamp(args.release_overlay.resolve()),**overlay.get('inputs',{}),**{entry['source_path']:entry['after'] for entry in overlay['files'].values()}})
    if args.runtime_baseline:
        report.update(baseline_production_commit=args.baseline_ref,baseline_input_kind='complete_runtime_staging',
                      baseline_source_release_id=baseline_manifest['release_id'])
    if creative:
        report['creative_preparation']=creative
        report['inputs'].update(creative_inputs)
    if live_ui:
        report['live_ui_preparation']=live_ui
        report['inputs'].update(live_ui_inputs)
    if workbench:
        report['rule_original_workbench']=workbench
        report['inputs'].update(workbench_inputs)
    if native:report['native_readability']=native
    if args.reuse_asset_cache:
        report['asset_cache_reuse']={'mode':'verified-existing-or-original-png','sources':ASSET_CACHE_REUSE,'new_encodings':0}
    write(args.report,report)
    print(json.dumps({'built':sum(x['status']=='built'for x in states.values()),'blocked':sum(x['status']=='blocked'for x in states.values()),'missing':sum(x['status']=='missing'for x in states.values()),'home_unchanged':report['home_unchanged'],'release_id':report['release_id']}))

if __name__=='__main__':main()

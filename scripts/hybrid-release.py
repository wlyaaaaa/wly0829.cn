"""Prepare byte-preserving partial releases and exact, non-deploying restores."""
from __future__ import annotations
import argparse
import contextlib
import hashlib
import html
import importlib.util
import io
import json
import re
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = 'release-manifest.json'
spec = importlib.util.spec_from_file_location('assembled_builder', ROOT/'scripts/build-assembled-site.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
nav_spec = importlib.util.spec_from_file_location('release_navigation', ROOT/'scripts/repair-release-navigation.py')
nav_repair = importlib.util.module_from_spec(nav_spec)
nav_spec.loader.exec_module(nav_repair)

def digest(path):
    with Path(path).open('rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest()

def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))

def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf8')

def inventory(root):
    result = {}
    for p in sorted(root.rglob('*')):
        if p.is_symlink():
            raise ValueError('Symlink is not a release asset: '+str(p))
        if p.is_file() and p.relative_to(root).as_posix() != MANIFEST:
            result[p.relative_to(root).as_posix()] = {'sha256': digest(p), 'bytes': p.stat().st_size}
    return result

def route_file(url):
    path = unquote(urlsplit(url).path)
    rel = path.lstrip('/')
    if not rel or path.endswith('/'):
        rel += 'index.html'
    elif not Path(rel).suffix:
        rel += '/index.html'
    if '..' in Path(rel).parts:
        raise ValueError('Route escapes root: '+url)
    return rel

def file_route(rel):
    if rel == 'index.html': return '/'
    if rel.endswith('/index.html'): return '/'+rel[:-10]
    return '/'+rel

def baseline_entries(manifest):
    # HTTP snapshot manifests use URLs as keys; release manifests use relative paths.
    entries = {}
    for key, value in manifest['files'].items():
        rel = value.get('path', key)
        if rel.startswith(('http:', 'https:')): rel = route_file(rel)
        rel = rel.replace('\\','/').lstrip('/')
        if not rel or '..' in Path(rel).parts: raise ValueError('Invalid baseline path')
        entries[rel] = {'sha256': value['sha256'], 'bytes': value['bytes']}
    return entries

def verify_baseline(root, manifest):
    if manifest.get('required_failed'):
        raise ValueError('Online snapshot has failed required downloads')
    entries = baseline_entries(manifest)
    actual = inventory(root)
    if actual != entries:
        raise ValueError('Baseline bytes or inventory differ from the recorded snapshot')
    routes = manifest.get('routes') or [file_route(x) for x in entries if x.endswith('.html')]
    for route in routes:
        if route_file(route) not in entries: raise ValueError('Baseline route missing: '+route)
    if 'index.html' not in entries or '404.html' not in entries:
        raise ValueError('Baseline needs exact index.html and 404.html')
    return entries, sorted(set(urlsplit(x).path for x in routes))

def page_name(url):
    return url.strip('/').replace('/', '__') or 'home'

def latest_run(verification_root, url):
    matches = []
    for path in verification_root.rglob('run.json'):
        run = read(path)
        if url in run.get('initial_urls', []):
            matches.append((run.get('started_at_beijing', ''), path, run))
    if not matches: raise ValueError('No formal verification for '+url)
    return max(matches, key=lambda x: x[0])

def is_review_clear(approval):
    clear=approval.get('page_review_clear')
    return clear is True or isinstance(clear,dict) and clear.get('by')=='Claude' and bool(clear.get('at_beijing')) and bool(clear.get('basis'))

def accept_page(approval, status, raw_root, candidate, candidate_proof, verification_root):
    if not is_review_clear(approval):
        raise ValueError('page_review_clear must be boolean true')
    state = status['build']
    if state.get('status') != 'built': raise ValueError('Latest build is not built')
    source = Path(state['source'])
    source_data = read(source)
    url = source_data.get('source_url') or source_data.get('url') or ('/' if approval['page']=='home' else '/'+approval['page'].strip('/')+'/')
    url = urlsplit(url).path
    rel = route_file(url)
    raw_html = raw_root/rel
    built_path = Path(state.get('receipt') or raw_html.with_name('build.json'))
    built = read(built_path)
    assembly = built.get('assembly', {})
    if assembly.get('strict') is not True:
        raise ValueError('Build is not strict')
    if built.get('source_hash') != digest(source): raise ValueError('Source changed after build')
    approved = approval.get('sha256', {})
    if not approved: raise ValueError('Approval has no image hashes')
    inputs = {Path(x['path']).name: x for x in built.get('inputs', [])}
    for filename, expected in approved.items():
        item = inputs.get(filename)
        if not item or item.get('sha256') != expected or digest(item['path']) != expected:
            raise ValueError('Approval image differs from build: '+filename)
        selected = approval.get('replace_images', {}).get(filename)
        if selected and digest(selected) != expected:
            raise ValueError('Approval replacement changed: '+filename)
    _, run_path, run = latest_run(verification_root, url)
    verification = status.get('verification', {})
    if Path(verification.get('out', '')).resolve() != run_path.parent.resolve():
        raise ValueError('Status does not reference the latest formal verification')
    command = verification.get('command', {}).get('command', [])
    if not any(str(x).endswith('Run-SiteVerify.ps1') for x in command):
        raise ValueError('Verification did not use the formal entrypoint')
    if '-ExternalHttp' not in command or '-Only' not in command or '-Workers' not in command or str(command[command.index('-Workers')+1]) != '6':
        raise ValueError('Formal verification scope differs')
    if verification.get('completed') is not True or run.get('external_http') is not True or run.get('workers') != 6:
        raise ValueError('Formal verification incomplete')
    if run.get('pages') != run.get('completed_pages') or not run.get('pages') or run.get('changed_pages') or run.get('tool_changed_during_run'):
        raise ValueError('Formal verification incomplete or inputs/tools changed')
    page_report = read(run_path.parent/(page_name(url)+'.json'))
    if page_report.get('completed') is not True or page_report.get('counts', {}).get('must_fix', 0) or any(x.get('level')=='must_fix' for x in page_report.get('findings', [])):
        raise ValueError('Latest page verification has must-fix findings')
    before = read(run_path.parent/'inputs-before.json').get(url, {})
    for filename, old_stat in before.items():
        path = Path(filename)
        if not path.is_file() or [path.stat().st_size, path.stat().st_mtime_ns] != old_stat:
            # This aggregate also records other pages. Preserve the current
            # page's actual approved video identity when only those rows change.
            if url=='/' and path.name=='videos-verdict.json' and path.is_file():
                rows=read(path);current=next((x for x in reversed(rows)if x.get('id')=='b2-home'),{})if isinstance(rows,list)else{}
                video=built.get('video_report',{})
                if current.get('verdict')=='pass' and current.get('video_sha256')==video.get('video_sha256') and current.get('video_path') and digest(current['video_path'])==video['video_sha256']:
                    continue
            raise ValueError('Verification inputs are stale: '+filename)
    for path in (raw_html, built_path, source):
        if str(path) not in before: raise ValueError('Verification did not bind required input: '+str(path))
    proof = candidate_proof.get('source_snapshot_files', {})
    for path in (raw_html, built_path):
        relative = path.resolve().relative_to(raw_root.resolve()).as_posix()
        entry = proof.get(relative)
        expected = entry.get('sha256') if isinstance(entry, dict) else entry
        if expected != digest(path): raise ValueError('Candidate is not bound to the verified raw build: '+relative)
    if not (candidate/rel).is_file(): raise ValueError('Candidate page missing: '+url)
    return url, {'approval_sha256': hashlib.sha256(json.dumps(approval, sort_keys=True).encode()).hexdigest(),
                 'source_sha256': digest(source), 'build_sha256': digest(built_path),
                 'verification_run_sha256': digest(run_path), 'verified_at_beijing': run.get('finished_at_beijing'),
                 'candidate_html_sha256': digest(candidate/rel)}

def references(path, content=None):
    if path.suffix not in {'.html', '.css', '.js', '.json'}: return []
    text = content if content is not None else path.read_text('utf-8-sig')
    refs = []
    if path.suffix == '.html':
        parser = builder.Refs(); parser.feed(text); refs += parser.refs
        for m in builder.PAGE_DATA.finditer(text): refs += list(builder.nested_refs(json.loads(m.group(2))))
    if path.suffix == '.json':
        refs += list(builder.nested_refs(json.loads(text)))
    if path.suffix in {'.html', '.css'}:
        refs += [(m[1], False) for m in re.finditer(r'url\(["\']?([^\s)"\']+)', text)]
        refs += [(m[1], False) for m in re.finditer(r'@import\s+["\']([^"\']+)', text)]
    if path.suffix in {'.html', '.js'}:
        refs += [(m[1], False) for m in re.finditer(r'(?:\b(?:from|import)\s*|\bimport\s*\()["\']([^"\']+)["\']', text) if m[1].startswith(('.', '/'))]
        refs += [(m[1], False) for m in re.finditer(r'\bfetch\s*\(\s*["\']([^"\']+)["\']', text) if not m[1].startswith('/__')]
    return refs

def local_reference(root, owner, reference):
    parts = urlsplit(html.unescape(reference))
    if parts.hostname in {'wly0829.cn','www.wly0829.cn'}:
        reference = parts.path + ('?'+parts.query if parts.query else '') + ('#'+parts.fragment if parts.fragment else '')
    return builder.resolve_ref(root, owner, reference)

def rewrite_links(text, root, owner, available, mappings, preserved_root=None, accepted_files=None, navigation_pages=None):
    # Preserve candidate HTML except href values, including href fields in page-data.
    pattern = re.compile(r'(\bhref\s*=\s*["\'])([^"\']+)(["\'])|("href"\s*:\s*")([^"\n]+)(")')
    def replace(match):
        start, ref, end = match.group(1,2,3) if match[1] else match.group(4,5,6)
        decoded = json.loads('"'+ref+'"') if match[4] else html.unescape(ref)
        target = local_reference(root, owner, decoded)
        if target is None or target.suffix != '.html': return match[0]
        rel = target.relative_to(root).as_posix()
        if navigation_pages is not None and decoded.startswith('/'):
            replacement = nav_repair.resolve_navigation(decoded, navigation_pages)
            if replacement == decoded: return match[0]
            mappings.append({'page': file_route(owner.relative_to(root).as_posix()), 'original_href': decoded, 'temporary_href': replacement})
            return start+replacement+end + (' data-original-href="'+html.escape(decoded,quote=True)+'"' if match[1] else '')
        if rel in available:
            fragment = unquote(urlsplit(decoded).fragment)
            preserved = preserved_root/rel if preserved_root else None
            new_target = rel in accepted_files if accepted_files is not None else (root/rel).is_file()
            # New section anchors may not exist in an unchanged production page.
            # Keep that page exact and make the new link land on its existing body.
            if not fragment or not preserved or not preserved.is_file() or new_target: return match[0]
            target_text = preserved.read_text('utf-8-sig')
            ids = {html.unescape(value) for value in re.findall(r'\bid\s*=\s*["\']([^"\']+)["\']', target_text)}
            if fragment in ids: return match[0]
            replacement = file_route(rel)
        else:
            current = Path(rel).parent
            while True:
                parent = (current/'index.html').as_posix()
                if parent in available:
                    replacement = file_route(parent)
                    break
                if current == Path('.'): raise ValueError('No available parent page')
                current = current.parent
        mappings.append({'page': file_route(owner.relative_to(root).as_posix()), 'original_href': decoded, 'temporary_href': replacement})
        return start+replacement+end + (' data-original-href="'+html.escape(decoded,quote=True)+'"' if match[1] else '')
    return pattern.sub(replace, text)

def load_overlay(path, baseline):
    overlay = read(path)
    if overlay.get('schema') != 'wly.typeset-release-overlay.v1':
        raise ValueError('Invalid release overlay schema')
    entries = overlay.get('files', {})
    if not entries or any(not rel or rel.startswith('/') or '..' in Path(rel).parts or '\\' in rel for rel in entries):
        raise ValueError('Invalid release overlay paths')
    for rel, entry in entries.items():
        source = Path(entry['source_path'])
        after = {'sha256': digest(source), 'bytes': source.stat().st_size}
        if after != entry['after']: raise ValueError('Overlay source changed: '+rel)
        old = baseline/rel
        before = {'sha256':digest(old), 'bytes':old.stat().st_size} if old.is_file() else None
        if before != entry.get('before'): raise ValueError('Overlay baseline differs: '+rel)
        kind = entry.get('kind')
        if kind == 'runtime_reference':
            if rel == 'index.html' or old.suffix != '.html' or not entry.get('replacements'):
                raise ValueError('Invalid runtime HTML reference overlay')
            expected = old.read_bytes()
            for original, replacement in entry['replacements'].items():
                if not original.startswith('/_typeset/runtime/app-') or not replacement.startswith('/_typeset/runtime/app-') or original.encode() not in expected:
                    raise ValueError('Runtime overlay must replace an existing app URL')
                expected = expected.replace(original.encode(), replacement.encode())
            if source.read_bytes() != expected: raise ValueError('Runtime overlay changed content beyond the app URL: '+rel)
        elif kind == 'search_index':
            if not re.fullmatch(r'search-(?:index|projects|project-[a-z0-9-]+)\.js',rel): raise ValueError('Invalid search overlay path')
            retained = sorted(set(search_record_hashes(old.read_text('utf8'))) & set(search_record_hashes(source.read_text('utf8'))))
            if retained != entry.get('preserved_record_sha256s'): raise ValueError('Search overlay changed its preserved-record evidence')
        elif kind == 'runtime_bundle':
            if before is not None or not re.fullmatch(r'_typeset/runtime/app-[0-9a-f]{20}\.js',rel) or Path(rel).stem != 'app-'+after['sha256'][:20]:
                raise ValueError('Runtime bundle must use its new content hash')
        else: raise ValueError('Unknown overlay kind: '+str(kind))
    for source, proof in overlay.get('inputs', {}).items():
        source = Path(source)
        if {'sha256':digest(source),'bytes':source.stat().st_size} != proof: raise ValueError('Overlay input changed: '+str(source))
    return overlay


def search_record_hashes(text):
    records = json.loads(text[text.index('=')+1:].strip().removesuffix(';'))
    return [hashlib.sha256(json.dumps(record,ensure_ascii=False,sort_keys=True).encode('utf8')).hexdigest() for record in records]


def unchanged_search_finding(output, finding, overlay):
    if not overlay or overlay.get('kind')!='search_index' or finding.get('type') in {'credential','symlink','git_object_limit'}: return False
    text=output.read_text('utf8');offset=finding.get('offset')
    if not isinstance(offset,int): return False
    decoder=json.JSONDecoder();cursor=text.index('[')+1
    while cursor<len(text):
        while text[cursor].isspace() or text[cursor]==',': cursor+=1
        if text[cursor]==']': break
        record,end=decoder.raw_decode(text,cursor)
        if cursor<=offset<end:
            sha=hashlib.sha256(json.dumps(record,ensure_ascii=False,sort_keys=True).encode('utf8')).hexdigest()
            return sha in overlay.get('preserved_record_sha256s',[])
        cursor=end
    return False


def assemble(baseline, candidate, output, baseline_manifest, accepted, rejected=None, rollback_ref=None, candidate_files=None, overlay=None):
    baseline = baseline.resolve(); candidate = candidate.resolve(); output = output.resolve()
    if output.exists() or any(output.is_relative_to(x) or x.is_relative_to(output) for x in (baseline,candidate)):
        raise ValueError('Choose a fresh, disjoint output directory')
    old, routes = verify_baseline(baseline, baseline_manifest)
    overlays = overlay.get('files', {}) if overlay else {}
    if set(overlays) & {route_file(x) for x in accepted}: raise ValueError('Overlay overlaps a rebuilt page')
    accepted_files = {route_file(x) for x in accepted}
    available = {x for x in old if x.endswith('.html')} | accepted_files
    shutil.copytree(baseline, output)
    # HTTP snapshots do not expose Pages' domain configuration file.
    # Adding that deployment metadata preserves every captured HTTP byte.
    if not (output/'CNAME').exists(): (output/'CNAME').write_text('wly0829.cn\n',encoding='utf8')
    # Old release-manifest is replaced by this generation; old content remains exact.
    mappings = []; pending = list(sorted(accepted_files | set(overlays))); copied = set()
    navigation_pages = nav_repair.page_inventory(output)
    for rel in accepted_files:
        navigation_pages[rel] = nav_repair.PageFacts((candidate/rel).read_text('utf-8-sig'))
    while pending:
        rel = pending.pop()
        if rel in copied: continue
        path = candidate/rel
        if not path.is_file(): raise ValueError('Candidate dependency missing: '+rel)
        if candidate_files is not None:
            proof = candidate_files.get(rel)
            expected = proof.get('sha256') if isinstance(proof,dict) else proof
            if expected != digest(path): raise ValueError('Candidate output changed after preparation: '+rel)
        if path.suffix == '.html' and rel not in accepted_files and rel not in overlays:
            if rel in old: continue
            raise ValueError('Unapproved HTML dependency: '+rel)
        target = output/rel
        text = None
        if rel in accepted_files:
            text = rewrite_links(path.read_text('utf-8-sig'), candidate, path, available, mappings, output, accepted_files, navigation_pages)
        elif rel in old and rel not in overlays:
            if digest(path) != old[rel]['sha256']: raise ValueError('Old asset collision: '+rel)
        target.parent.mkdir(parents=True, exist_ok=True)
        if text is None: shutil.copyfile(path, target)
        else: target.write_text(text, encoding='utf8')
        copied.add(rel)
        for ref, navigation in references(path, text):
            dependency = local_reference(candidate, path, ref)
            if dependency is None: continue
            dep = dependency.relative_to(candidate).as_posix()
            if navigation and dependency.suffix == '.html':
                if dep not in available and not (output/dep).is_file(): raise ValueError('Unresolved navigation: '+ref)
                continue
            if dep in old and not dependency.is_file(): continue
            pending.append(dep)
    for rel in nav_repair.restore_pending_links(output, navigation_pages):
        if rel not in accepted_files:
            overlays[rel] = {'kind':'navigation_restoration', 'before':old.get(rel),
                             'after':{'sha256':digest(output/rel),'bytes':(output/rel).stat().st_size}}
    for rel, entry in old.items():
        if rel not in accepted_files and rel not in overlays and digest(output/rel) != entry['sha256']:
            raise ValueError('Old file changed: '+rel)
    for route in routes:
        if not (output/route_file(route)).is_file(): raise ValueError('Old route disappeared: '+route)
    files = inventory(output)
    release_id = hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest()
    manifest = {'schema':'wly.hybrid-release.v1', 'release_id':release_id,
                'prepared_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat(),
                'rollback_ref':rollback_ref, 'baseline_production_commit':baseline_manifest.get('production_commit'),
                'baseline_files':old, 'routes':sorted(set(routes)|set(accepted)),
                'accepted_pages':accepted, 'rejected_pages':rejected or {}, 'temporary_href_mappings':mappings, 'files':files}
    if overlays: manifest['release_overlay'] = {rel:{key:value for key,value in entry.items() if key!='source_path'} for rel,entry in overlays.items()}
    write(output/MANIFEST, manifest)
    verify_release(output)
    return manifest

def verify_release(output):
    manifest = read(output/MANIFEST)
    if manifest.get('schema') != 'wly.hybrid-release.v1' or inventory(output) != manifest['files']:
        raise ValueError('Release bytes differ from manifest')
    if 'oss' in manifest:
        oss_spec = importlib.util.spec_from_file_location('oss_publication', ROOT/'scripts/prepare-oss-release.py')
        oss = importlib.util.module_from_spec(oss_spec)
        oss_spec.loader.exec_module(oss)
        oss.verify_manifest(manifest)
        for route in manifest['routes']:
            if route_file(route) not in manifest['files']:
                raise ValueError('Missing protected route: '+route)
        return manifest
    expected_id = hashlib.sha256(json.dumps(manifest['files'], sort_keys=True).encode()).hexdigest()
    if manifest['release_id'] != expected_id: raise ValueError('Release identifier mismatch')
    accepted = {route_file(x) for x in manifest['accepted_pages']}
    overlays = manifest.get('release_overlay', {})
    if set(overlays) & accepted: raise ValueError('Overlay overlaps rebuilt pages')
    for rel, entry in overlays.items():
        if manifest['files'].get(rel) != entry.get('after') or manifest['baseline_files'].get(rel) != entry.get('before'):
            raise ValueError('Overlay file identity differs: '+rel)
        if entry.get('kind') == 'runtime_reference':
            recovered = (output/rel).read_bytes()
            for original, replacement in entry['replacements'].items(): recovered = recovered.replace(replacement.encode(),original.encode())
            if hashlib.sha256(recovered).hexdigest() != entry['before']['sha256']:
                raise ValueError('Runtime overlay did not preserve original content: '+rel)
    for rel, entry in manifest['baseline_files'].items():
        if rel not in accepted and rel not in overlays and manifest['files'].get(rel) != entry: raise ValueError('Preserved baseline differs: '+rel)
    for route in manifest['routes']:
        if route_file(route) not in manifest['files']: raise ValueError('Missing protected route: '+route)
    return manifest

def topic_units(text):
    """Keep full authored HTML blocks and JSON strings with their field identity."""
    units=[]
    def json_units(body, origin, owner):
        try: value=json.loads(body)
        except ValueError: return
        decoded=[]
        def walk(item, pointer):
            if isinstance(item,dict):
                for key,value in item.items():
                    decoded.append((pointer+('#key',key),key));walk(value,pointer+(key,))
            elif isinstance(item,list):
                for i,value in enumerate(item):
                    identity=('record',value['href'],value.get('title',''),value.get('type','')) if isinstance(value,dict) and 'href' in value and 'title' in value else ('item',i)
                    walk(value,pointer+(identity,))
            elif isinstance(item,str): decoded.append((pointer,item))
        walk(value,())
        tokens=list(re.finditer(r'"(?:\\.|[^"\\])*"',body,re.S))
        if len(tokens)!=len(decoded): return
        for token,(pointer,plain) in zip(tokens,decoded):
            if json.loads(token[0])!=plain: return
            units.append((('json',owner,pointer),plain,origin+token.start(),origin+token.end()))
    if text.lstrip().startswith('window.'):
        assignment=text.find('=');body=text[assignment+1:].strip().removesuffix(';')
        origin=text.find(body,assignment+1)
        json_units(body,origin,text[:assignment].strip())
        return units
    offsets=[0]+[m.end() for m in re.finditer('\n',text)]
    class Blocks(HTMLParser):
        def __init__(self):super().__init__(convert_charrefs=False);self.stack=[];self.script=None
        def index(self):line,column=self.getpos();return offsets[line-1]+column
        def handle_starttag(self,tag,attrs):
            start=self.index();attributes=dict(attrs);opening=self.get_starttag_text()
            if tag=='script':self.script=(start+len(opening),attributes)
            if tag in {'p','li','dd','dt','blockquote','h1','h2','h3','h4','h5','h6'}:self.stack.append((tag,start))
            # Attribute-only compatibility ids keep their entire tag, not a word.
            if tag=='span' and attributes.get('id') and set(attributes)<={'id','class','aria-hidden'}:
                units.append((('html-tag',tag),opening,start,start+len(opening)))
        def handle_endtag(self,tag):
            end=self.index()+len('</'+tag+'>')
            if tag=='script' and self.script:
                start,attrs=self.script
                if attrs.get('type','').lower() in {'application/json','application/ld+json'}:json_units(text[start:self.index()],start,attrs.get('id','json-script'))
                self.script=None
            for i in range(len(self.stack)-1,-1,-1):
                if self.stack[i][0]==tag:
                    _,start=self.stack.pop(i);units.append((('html-block',tag),text[start:end],start,end));break
    parser=Blocks();parser.feed(text)
    return units

def unchanged_topic_text(before, after, finding):
    """Only the same complete unit in the same field can inherit a topic match."""
    if finding.get('type') != 'excluded_topic': return False
    offset=finding.get('offset');matched=finding.get('matched')
    if not isinstance(offset,int) or not isinstance(matched,str) or after[offset:offset+len(matched)]!=matched:return False
    old=topic_units(before);new=topic_units(after)
    matches=[unit for unit in new if unit[2]<=offset and offset+len(matched)<=unit[3]]
    if not matches:return False
    authored=[unit for unit in matches if unit[0][0]!='html-tag']
    if authored:matches=authored
    owner,plain,_,_=min(matches,key=lambda unit:unit[3]-unit[2])
    def normalized(value):return value.replace('\r\n','\n').replace('\r','\n')
    plain=normalized(plain)
    from public_page_contract import omit_local_literals
    count_before=sum(1 for key,value,_,_ in old if key==owner and plain in {normalized(value),normalized(omit_local_literals(value)),normalized(omit_local_literals(value,replacement='（本机路径）'))})
    count_after=sum(1 for key,value,_,_ in new if key==owner and normalized(value)==plain)
    return count_before>0 and count_after<=count_before

def retained_audit_topic(output, finding, manifest, baseline_cache):
    if not manifest.get('audit_repair') or finding.get('type')!='excluded_topic': return False
    ref=manifest.get('baseline_production_commit')
    rel=finding.get('file','')
    expected=manifest.get('baseline_files',{}).get(rel,{}).get('sha256')
    if not isinstance(ref,str) or not re.fullmatch(r'[0-9a-f]{40,64}',ref) or not expected: return False
    public_snapshot=manifest['audit_repair'].get('baseline_input_kind')=='complete_runtime_staging'
    published=None
    if public_snapshot:
        key=(ref,MANIFEST)
        if key not in baseline_cache:
            read_git=subprocess.check_output(['git','show',ref+':site-release/'+MANIFEST],cwd=ROOT,stderr=subprocess.DEVNULL)
            published=json.loads(read_git)
            oss_spec=importlib.util.spec_from_file_location('oss_audit_baseline',ROOT/'scripts/prepare-oss-release.py')
            oss=importlib.util.module_from_spec(oss_spec);oss_spec.loader.exec_module(oss)
            oss.verify_manifest(published)
            baseline_cache[key]=published
        published=baseline_cache[key]
        entry=published['files'].get(rel) or published['oss']['objects'].get(rel)
        if not entry:return False
        expected=entry['sha256']
    if rel not in baseline_cache:
        try:
            if public_snapshot and rel in published['oss']['objects']:
                obj=published['oss']['objects'][rel]
                path=ROOT/'.publish/audit-public-baseline'/ref/rel
                if not path.is_file() or digest(path)!=obj['sha256']:
                    oss_spec=importlib.util.spec_from_file_location('oss_audit_body',ROOT/'scripts/prepare-oss-release.py')
                    oss=importlib.util.module_from_spec(oss_spec);oss_spec.loader.exec_module(oss)
                    oss.verify_object_with_retries(None,rel,obj,'https://wly0829.cn',60,download_to=path)
                payload=path.read_bytes()
            else:
                payload=subprocess.check_output(['git','show',ref+':site-release/'+rel],cwd=ROOT,stderr=subprocess.DEVNULL)
            baseline_cache[rel]=payload.decode('utf-8-sig') if hashlib.sha256(payload).hexdigest()==expected else None
        except (subprocess.CalledProcessError,UnicodeError): baseline_cache[rel]=None
    before=baseline_cache[rel]
    return before is not None and unchanged_topic_text(before,(output/rel).read_bytes().decode('utf-8-sig'),finding)

def validate_content(output, report):
    output=output.resolve()
    manifest = verify_release(output)
    asset_prefix = None
    if manifest.get('oss'):
        # The existing artifact gate needs actual files, including remote JS
        # repository references. Materialize verified bodies in the ignored
        # task/CI cache and run that same gate over the complete release.
        oss_spec = importlib.util.spec_from_file_location('oss_content', ROOT/'scripts/prepare-oss-release.py')
        oss = importlib.util.module_from_spec(oss_spec); oss_spec.loader.exec_module(oss)
        cache = ROOT/'.publish/oss-gate'/manifest['release_id']/'dist'
        cache.mkdir(parents=True, exist_ok=True)
        for rel in list(manifest['files'])+[MANIFEST]:
            target=cache/rel;target.parent.mkdir(parents=True,exist_ok=True)
            shutil.copyfile(output/rel,target)
        def materialize(item):
            rel,obj=item
            return rel,oss.verify_object_with_retries(None,rel,obj,'https://wly0829.cn',60,download_to=cache/rel)
        with ThreadPoolExecutor(max_workers=4) as pool:
            rows=dict(pool.map(materialize,manifest['oss']['objects'].items()))
        write(cache.parent/'actual-get.json',{'release_id':manifest['release_id'],'objects':rows,
                                             'checked_at_beijing':datetime.now(timezone(timedelta(hours=8))).isoformat()})
        output=cache
        asset_prefix=manifest['oss']['asset_base_url']+'/'+manifest['oss']['prefix']+'/'
    original = builder.rule_pin_findings
    # The owner keeps old rule pages. Only newly accepted rule pages use current pin.
    def selected_pin(root, files):
        selected = {route_file(x) for x in manifest['accepted_pages']}
        findings = original(root,[p for p in files if p.relative_to(root).as_posix() in selected])
        def verified_source(finding):
            if finding['type'] != 'rule_original_source_evidence_mismatch' or not manifest.get('oss'):
                return False
            text = (root/finding['file']).read_text('utf8')
            match = builder.PAGE_DATA.search(text)
            objects = {obj['url']: obj for obj in manifest['oss']['objects'].values()}
            rows = json.loads(match[2]).get('screens', []) if match else []
            bound = [row.get('source_meta', {}) for row in rows if row.get('source_meta', {}).get('relative_file') == finding.get('document')]
            return bool(bound) and all(objects.get(meta.get('src'), {}).get('sha256') == meta.get('public_source_sha256',meta.get('source_sha256'))
                                       and objects.get(meta.get('src'), {}).get('byte_preserved') is True for meta in bound)
        return [x for x in findings if x['type'] != 'pinned_rule_page_missing' and not verified_source(x)]
    builder.rule_pin_findings = selected_pin
    try:
        # Topic and engineering-location exclusions govern newly adopted content.
        # The owner explicitly preserves the captured production bytes.
        # The complete artifact
        # still receives every credential, private-repository and resource check.
        with contextlib.redirect_stdout(io.StringIO()):
            try: builder.validate(output, report, asset_prefix=asset_prefix)
            except SystemExit: pass
        result = read(report)
        selected = {route_file(x) for x in manifest['accepted_pages']}
        changed_content = {rel for rel,entry in manifest.get('release_overlay',{}).items() if entry['kind'] != 'runtime_reference'}
        retained = {rel for rel in manifest['baseline_files'] if rel not in selected and rel not in changed_content}
        # OSS relocation changes resource URLs in historical HTML. Only the
        # existing topic exceptions carry forward; routes and all credentials
        # still receive the same content checks.
        kept = []; retained_topics = []; retained_findings=[];audit_topics=[];baseline_cache={}
        for finding in result['findings']:
            if finding['type'] == 'javascript_missing' and manifest.get('oss'):
                # verify_release has already required sealed full-body GET
                # evidence for the actual external JavaScript inventory.
                continue
            unchanged_record=unchanged_search_finding(output/finding['file'],finding,manifest.get('release_overlay',{}).get(finding['file']))
            audit_retained=retained_audit_topic(output,finding,manifest,baseline_cache)
            if audit_retained: audit_topics.append(finding)
            if unchanged_record or audit_retained or finding['file'] in retained and finding['type']not in {'credential','symlink','git_object_limit'}:
                retained_findings.append(finding)
                if finding['type']in {'excluded_topic','excluded_topic_filename','private_path'}:retained_topics.append(finding)
            else: kept.append(finding)
        result['findings'] = kept
        result['preserved_baseline_topic_findings'] = retained_topics
        result['preserved_baseline_findings_outside_current_release']=retained_findings
        result['preserved_audit_baseline_topic_findings']=audit_topics
        result['preserved_baseline_reference_findings_outside_current_release']=[x for x in result['missing_references']if x['file']in retained]
        result['missing_references']=[x for x in result['missing_references']if x['file']not in retained]
        result['missing_reference_count']=len(result['missing_references'])
        result['content_gate_scope']='Current accepted pages and their assets; direct navigation resolves against all preserved production routes. Exact baseline bytes remain verified separately.'
        result['ready_to_publish'] = not kept and not result['missing_references'] and not result['required_missing']
        result['status'] = 'pass' if result['ready_to_publish'] else 'block'
        write(report, result)
        print(json.dumps({'status':result['status'],'findings':len(kept),'preserved_baseline_topic_findings':len(retained_topics),'missing_references':len(result['missing_references'])}))
        if not result['ready_to_publish']: raise ValueError('Hybrid content gate failed; inspect '+str(report))
        return result
    finally: builder.rule_pin_findings = original

def restore_git(ref, output):
    if output.exists(): raise ValueError('Restore output must be fresh')
    commit = subprocess.check_output(['git','rev-parse','--verify',ref+'^{commit}'],cwd=ROOT,text=True).strip()
    tree = subprocess.check_output(['git','-c','core.quotepath=false','ls-tree','-rz','--name-only',commit,'--','site-release'],cwd=ROOT).decode('utf8').split('\0')
    tree = [x for x in tree if x]
    if 'site-release/index.html' not in tree: raise ValueError('Ref has no exact static release; source rebuild is not rollback')
    output.mkdir(parents=True)
    for filename in tree:
        relative = Path(filename).relative_to('site-release')
        target = output/relative; target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(subprocess.check_output(['git','show',commit+':'+filename],cwd=ROOT))
    verify_release(output)
    return commit

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    prepare = commands.add_parser('prepare')
    for argument in ('baseline','baseline-manifest','candidate','candidate-report','approvals','status','raw-site','verification-root','output'):
        prepare.add_argument('--'+argument, type=Path, required=True)
    prepare.add_argument('--pages', nargs='+', required=True)
    prepare.add_argument('--rollback-ref')
    verify = commands.add_parser('verify'); verify.add_argument('--output',type=Path,required=True)
    verify.add_argument('--content-report',type=Path)
    verify.add_argument('--public-repos-from-github',action='store_true')
    restore = commands.add_parser('restore'); restore.add_argument('--ref', required=True); restore.add_argument('--output',type=Path,required=True)
    args = parser.parse_args()
    if args.command == 'restore': print(restore_git(args.ref,args.output)); return
    if args.command == 'verify':
        manifest = verify_release(args.output)
        if args.public_repos_from_github: builder.load_public_repos()
        if args.content_report: validate_content(args.output,args.content_report)
        print(json.dumps({'status':'pass','release_id':manifest['release_id'],'routes':len(manifest['routes'])})); return
    approvals = read(args.approvals); states = read(args.status)['pages']; report = read(args.candidate_report); proof = report.get('input',{})
    candidate_files = report.get('output_files')
    if not candidate_files: raise ValueError('Candidate report lacks output file hashes')
    accepted = {}; rejected = {}
    for token in args.pages:
        matching = [a for a in approvals if a.get('page') == token]
        try:
            if len(matching)!=1: raise ValueError('One exact approval is required')
            approval = matching[0]
            state = next((s for key,s in states.items() if key.split(':',1)[-1]==token),None)
            if state is None: raise ValueError('No page build status')
            url,evidence = accept_page(approval,state,args.raw_site,args.candidate,proof,args.verification_root)
            accepted[url] = evidence
        except (ValueError, KeyError, OSError) as error: rejected[token] = str(error)
    if rejected: raise ValueError('Requested page gates failed: '+json.dumps(rejected,ensure_ascii=False))
    manifest = assemble(args.baseline,args.candidate,args.output,read(args.baseline_manifest),accepted,rollback_ref=args.rollback_ref,candidate_files=candidate_files)
    print(json.dumps({'status':'prepared','release_id':manifest['release_id'],'accepted_pages':list(accepted),'temporary_links':len(manifest['temporary_href_mappings'])}))

if __name__ == '__main__':
    try: main()
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error))

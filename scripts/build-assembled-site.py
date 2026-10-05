"""Prepare the assembled static site without touching its input directory."""
import argparse
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import sys
import os
import uuid
import subprocess
from urllib.request import Request, urlopen
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT/'scripts') not in sys.path: sys.path.insert(0,str(ROOT/'scripts'))
from public_page_contract import public_page_data
import rule_original_contract as rule_contract
LIMIT = 1_000_000_000
BUDGET = 850_000_000
VARIANT = re.compile(r'^(.*)-(828|1280|1920|2880)-([a-f0-9]{12})\.(avif|webp)$')
LOCAL = re.compile(r'(?i)(?<![a-z0-9])[a-z]:[\\/]|file:/|\\\\(?:[^\\\s]+)\\')
# Publication exclusions are policy checks, never automatic editorial changes.
PRIVATE = re.compile(r'(?i)(?:[a-z]:[\\/]+Personal[\\/]+(?!Projects(?:[\\/]|$))[^\s<>"\'，。；！？（）【】,;!?()]*|(?:[a-z]:[\\/]+|file:/+)[^\s<>"\'，。；！？（）【】,;!?()]*(?:私人|私密|聊天记录|录音原件|个人文档)[^\s<>"\'，。；！？（）【】,;!?()]*)')
PRIVATE_FILENAME = re.compile(r'聊天记录|(?:私人|私密|个人)[-_ ]*(?:文件|文档|照片|视频|录音)|录音原件|IMG[_-]\d{6,}|(?:WeChat|微信)[_-](?:Image|Video|Audio|\d{8})',re.I)
EXCLUDED_TOPICS = re.compile(r'打官司|诉讼|起诉|判决|再审|律师|法律|案件|恋爱|求职|薪资|简历包装|课程包装|争执|个人纠纷|(?:personal[-_/](?:litigation|romance))|(?:career[-_]development)|\bOffer\b|PersonalOS(?:-Retired)?|PersonalKnowledgeBase|ai-llm-job-prep|ai-coach',re.I)
PRIVATE_REPOS = set()
PUBLIC_REPOS = set()
PRIVATE_REPO_REWRITES = []
PAGE_DATA = re.compile(r'(<script\b[^>]*\bid="page-data"[^>]*>)(.*?)(</script>)', re.S)
ATTR = re.compile(r'\b((?:data-(?:lazy-)?)?(?:srcset|imagesrcset))="([^"]*)"')
TEXT_EXT = {'.html', '.css', '.js', '.json', '.md', '.ps1', '.txt', '.xml'}
ASSET_EXT = {'.css', '.js', '.avif', '.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.mp4', '.webm', '.mp3', '.wav', '.woff', '.woff2', '.ico', '.ps1', '.md', '.txt', '.xml'}
SECRETS = [
    ('OpenAI-style key', rb'\bsk-[A-Za-z0-9_-]{20,}'),
    ('GitHub token', rb'gh[pousr]_[A-Za-z0-9]{20,}'),
    ('GitHub fine-grained token', rb'github_pat_[A-Za-z0-9_]{20,}'),
    ('Google API key', rb'AIza[0-9A-Za-z_-]{30,}'),
    ('private key', rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    ('assigned credential', rb'(?:password|passwd|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["\']?[A-Za-z0-9_./+=-]{8,}'),
]

def sha(p):
    with p.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()

def write_json(p, data):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf8')

def is_topic_word_exception(text, match):
    if match[0]=='法律' and any(a.start()<=match.start() and match.end()<=a.end() for a in re.finditer('正式法律文书仍交 Claude',text)):
        return True
    if match[0]=='法律' and any(a.start()<=match.start() and match.end()<=a.end() for a in re.finditer('网站文案、汇报、方案、法律文书',text)):
        # This describes the model's writing duties, without case content.
        return True
    if match[0]=='再审':
        if text[match.start():match.start()+4]=='再审一轮':
            return True
        pattern=re.escape('跨项目认知审计')+r'(?:\\+n|\s)+'+re.escape('给我看的分析按日期存档；再审时先对照上次哪些问题解决了')
        return any(match.start()==approved.start()+approved[0].index('再审') for approved in re.finditer(pattern,text))
    return False

def clean_provenance(value):
    return public_page_data(value)

def clean_repo_bindings(value, pointer='page-data', registered_repos=None):
    if registered_repos is None:
        registry_path=ROOT/'config/panel-projects.json'
        registry=json.loads(registry_path.read_text('utf8')) if registry_path.is_file() else {'projects':[]}
        registered_repos={entry['source']['repo'].lower() for entry in registry.get('projects',[])
                          if '/' in entry.get('source',{}).get('repo','')
                          and entry.get('source',{}).get('visibility') in {'PUBLIC','PRIVATE'}}
    if isinstance(value,dict):
        return {k:clean_repo_bindings(v,pointer+'.'+k,registered_repos) for k,v in value.items()}
    if isinstance(value,list): return [clean_repo_bindings(v,pointer+'[]',registered_repos) for v in value]
    if isinstance(value,str):
        for repo in sorted(PRIVATE_REPOS):
            pattern=repo_pattern(repo)
            if pattern.search(value):
                if pointer.endswith(('.repo_url','.href')):
                    raise ValueError('Private repository used as an external link: '+pointer)
                if repo.lower() in registered_repos:continue
                public_key='private-project-'+hashlib.sha256(repo.lower().encode()).hexdigest()[:12]
                PRIVATE_REPO_REWRITES.append({'field':pointer,'repository':repo,'public_key':public_key})
                value=pattern.sub(public_key,value)
    return value

def repo_pattern(repo):
    return re.compile(r'(?<![A-Za-z0-9_.-])'+re.escape(repo)+r'(?:\.git)?(?![A-Za-z0-9_.-])',re.I)

def repository_registration(data, registry):
    """Resolve only an existing concrete Registry identity, never infer visibility."""
    projects=[entry for entry in registry.get('projects',[])
              if entry.get('source',{}).get('visibility') in {'PUBLIC','PRIVATE'}
              and (('/' in entry.get('source',{}).get('repo','')) or
                   entry.get('source',{}).get('public_identity'))]
    repo=(data.get('status_binding') or {}).get('repo')
    route=(data.get('url') or '').rstrip('/')
    by_route=[entry for entry in projects if route and entry.get('route','').rstrip('/')==route]
    if len(by_route)==1:return by_route[0]
    by_repo=[entry for entry in projects if isinstance(repo,str)
             and entry['source']['repo'].lower()==repo.lower()]
    return by_repo[0] if len(by_repo)==1 else None

def bind_registered_repository(data, registry):
    registration=repository_registration(data,registry)
    if registration is None:return False
    source=registration['source'];binding=data.get('status_binding') or {}
    if '/' not in source['repo'] and source.get('public_identity'):
        data['repository_visibility']=source['visibility']
        data['repo_url']=None
        data['status_binding']={**binding,'repo':source['public_identity'],'visibility':source['visibility'],'matched':False}
        return True
    previous=binding.get('repo')
    if previous and previous.lower()!=source['repo'].lower():return False
    data['repository_visibility']=source['visibility']
    data['repo_url']='https://github.com/'+source['repo'] if source['visibility']=='PUBLIC' else None
    data['status_binding']={**binding,'repo':source['repo'],'visibility':source['visibility']}
    return True

def repository_binding_findings(data, registry):
    binding=data.get('status_binding') or {};repo=binding.get('repo')
    registration=repository_registration(data,registry)
    if registration is None:
        return [{'type':'unpublished_repository_binding','field':'status_binding.repo'}] if isinstance(repo,str) and '/' in repo and data.get('repo_url')!='https://github.com/'+repo else []
    source=registration['source'];findings=[]
    expected_repo=source['repo'] if '/' in source['repo'] else source.get('public_identity',source['repo'])
    if not isinstance(repo,str) or repo.lower()!=expected_repo.lower():
        findings.append({'type':'repository_binding_mismatch','field':'status_binding.repo','project':registration['id']})
    for field,value in [('repository_visibility',data.get('repository_visibility')),('status_binding.visibility',binding.get('visibility'))]:
        if value is not None and value!=source['visibility']:
            findings.append({'type':'repository_visibility_mismatch','field':field,'expected':source['visibility']})
    if source['visibility']=='PUBLIC' and data.get('repo_url')!='https://github.com/'+source['repo']:
        findings.append({'type':'unpublished_repository_binding','field':'repo_url'})
    if source['visibility']=='PRIVATE' and data.get('repo_url'):
        findings.append({'type':'private_repository_link','field':'repo_url'})
    return findings

def load_public_repos():
    if shutil.which('gh'):
        reply=subprocess.run(['gh','api','users/wlyaaaaa/repos?per_page=100','--paginate','--jq','.[].full_name'],capture_output=True,text=True,encoding='utf8',timeout=60,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
        if reply.returncode==0:
            names={line.strip().lower()for line in reply.stdout.splitlines()if line.strip()}
            if not names:raise ValueError('Public repository inventory is empty; refusing to skip its gate')
            PUBLIC_REPOS.update(names);return
    for page in range(1,30):
        request=Request('https://api.github.com/users/wlyaaaaa/repos?per_page=100&page='+str(page),headers={'Accept':'application/vnd.github+json','User-Agent':'wly-publication-check'})
        if os.environ.get('GITHUB_TOKEN'): request.add_header('Authorization','Bearer '+os.environ['GITHUB_TOKEN'])
        with urlopen(request,timeout=30) as response: repos=json.load(response)
        PUBLIC_REPOS.update(repo['full_name'].lower() for repo in repos if not repo.get('private'))
        if len(repos)<100:
            if not PUBLIC_REPOS: raise ValueError('Public repository inventory is empty; refusing to skip its gate')
            return
    raise ValueError('Public repository pagination did not complete')

class Refs(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if d.get('id'): self.ids.add(d['id'])
        for key, value in attrs:
            if not value: continue
            if key in {'href', 'src', 'data-src', 'data-lazy-src', 'poster', 'data-poster', 'action'}:
                self.refs.append((value, tag == 'a' and key == 'href'))
            elif key.endswith('srcset'):
                self.refs.extend((v.strip().split()[0], False) for v in value.split(',') if v.strip())

class OriginalProse(HTMLParser):
    """Fingerprint the original prose, excluding version labels and added navigation."""
    def __init__(self, whole_document=False):
        super().__init__(convert_charrefs=True)
        self.whole=whole_document;self.stack=[];self.parts=[];self.literal=[];self.literal_depth=0
    def handle_starttag(self,tag,attrs):
        d=dict(attrs);classes=set(d.get('class','').split())
        active=self.whole or (self.stack[-1][2] if self.stack else False) or 'source-prose' in classes or (tag=='h2' and any('source-heading' in x[1] for x in self.stack))
        skip=(self.stack[-1][3] if self.stack else False) or 'source-extra' in classes
        if tag in rule_contract.HTML_VOID_TAGS:
            if active and not skip and tag in {'br','hr'}:self.parts.append('\n')
            return
        self.stack.append((tag,classes,active,skip))
        if active and not skip and tag=='a':
            self.parts.append('[href:'+hashlib.sha256(source_link_target(d.get('href','')).encode()).hexdigest()+']')
        if active and not skip and tag in {'td','th'}:self.parts.append('\n[cell]')
        if active and not skip and tag in {'pre','code'}:
            self.literal_depth+=1
        elif active and not skip and tag in {'p','li','tr','h1','h2','h3','h4','h5','h6'}:self.parts.append('\n')
    def handle_data(self,data):
        if self.stack and self.stack[-1][2] and not self.stack[-1][3]:
            if self.literal_depth:self.literal.append(data)
            else:self.parts.append(data)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag:
                entry=self.stack[i]
                if entry[2] and not entry[3]:
                    if tag in {'pre','code'} and self.literal_depth:
                        self.literal_depth-=1
                        if not self.literal_depth:
                            self.parts.append('[literal:'+hashlib.sha256(''.join(self.literal).encode()).hexdigest()+']');self.literal=[]
                    elif tag in {'p','li','td','th','tr','h1','h2','h3','h4','h5','h6'}:self.parts.append('\n')
                del self.stack[i:];break
    def digest(self):
        return hashlib.sha256(' '.join(''.join(self.parts).split()).encode()).hexdigest()

def prose_digest(text,whole_document=False):
    parser=OriginalProse(whole_document);parser.feed(text);return parser.digest()

def source_link_target(value):
    return rule_contract.source_link_target(value)

class TypesetOriginal(OriginalProse):
    def __init__(self):
        super().__init__();self.original_tags=[]
    def handle_starttag(self,tag,attrs):
        data=dict(attrs);classes=set(data.get('class','').split());original_tag=tag
        if rule_contract.source_root(tag,data,((t,a) for t,_,a in self.original_tags)):
            attrs=[(k,v) for k,v in attrs if k!='class']+[('class',data.get('class','')+' source-prose')]
        if tag=='a' and 'href' not in data and 'data-href' in data:attrs=attrs+[('href',data['data-href'])]
        if 'table-label' in classes and 'data-echo' in data:
            attrs=[(key,value) for key,value in attrs if key!='class']+[('class',data.get('class','')+' source-extra')]
        if data.get('data-table-header')=='true' and 'data-table-col' in data:tag='th'
        elif 'data-table-row' in data and 'data-table-col' in data:tag='td'
        elif tag=='div' and 'ct-heading' in classes:tag='h2'
        if original_tag not in rule_contract.HTML_VOID_TAGS:self.original_tags.append((original_tag,tag,data))
        super().handle_starttag(tag,attrs)
    def handle_endtag(self,tag):
        for index in range(len(self.original_tags)-1,-1,-1):
            if self.original_tags[index][0]==tag:
                tag=self.original_tags[index][1];del self.original_tags[index:];break
        super().handle_endtag(tag)
    def feed(self,text):
        # Only the producer's explicit ordered-list marker is presentation.
        # A number anywhere else remains part of the source fingerprint.
        text=re.sub(r'<span\b(?=[^>]*\bclass=["\'][^"\']*\bct-step-number\b)[^>]*>\s*\d+[.)]?\s*</span>', '', text)
        super().feed(text)

def typeset_prose_digest(text):
    prose=TypesetOriginal();prose.feed(text);return prose.digest()

def rule_excerpt_pin_findings(output,files,pin):
    findings=[];seen_documents=set();seen_excerpts=set()
    expected_excerpts=pin.get('excerpt_contract',{}).get('excerpts',{})
    for page in files:
        if page.suffix!='.html' or page.parent==output/'rules' or not page.is_relative_to(output/'rules'):continue
        text=page.read_text('utf8');rel=page.relative_to(output).as_posix();match=PAGE_DATA.search(text)
        data=json.loads(match[2]) if match else {}
        rows=[row for row in data.get('screens',[]) if row.get('render_mode')=='typeset' and row.get('shape')=='source_text']
        if not rows:findings.append({'file':rel,'type':'pinned_original_missing'});continue
        page_name='charter' if page.parent.name=='charter' else 'rule-'+page.parent.name
        for row in rows:
            meta=row.get('source_meta') or {};document=meta.get('relative_file');expected=pin['documents'].get(document)
            identity=meta.get('excerpt_id');excerpt=expected_excerpts.get(identity)
            correct_document=rule_contract.document_for_page(page_name)
            labels=set(re.findall(r'(?<![A-Za-z0-9])E\d+(?!\d)',html.unescape(row.get('source_version',''))))
            context={'file':rel,'document':document,'screen':row.get('id')}
            seen_documents.add(document);seen_excerpts.add(identity)
            if document!=correct_document:findings.append({**context,'type':'rule_page_source_mismatch','expected_document':correct_document})
            if meta.get('version')!=pin['version'] or labels!={pin['version']}:
                findings.append({**context,'type':'rule_version_not_pinned','expected':pin['version']})
            if not expected or meta.get('source_sha256')!=expected['source_sha256']:
                findings.append({**context,'type':'rule_source_not_pinned'})
            if meta.get('excerpt_contract')!=rule_contract.excerpt_contract_id(pin['version']) or not excerpt or excerpt.get('page')!=page_name or excerpt.get('screen')!=row.get('id') or excerpt.get('relative_file')!=document:
                findings.append({**context,'type':'rule_excerpt_contract_mismatch'})
            try:
                original=resolve_ref(output,page,meta.get('src',''))
                asset_sha=sha(original) if original and original.is_file() else None
            except (OSError,ValueError,TypeError):asset_sha=None
            public_sha=expected.get('public_source_sha256') if expected else None
            if not public_sha or meta.get('public_source_sha256')!=public_sha or asset_sha!=public_sha:
                findings.append({**context,'type':'rule_original_source_evidence_mismatch'})
            if excerpt and (meta.get('omitted_count')!=excerpt.get('approved_omitted_count') or
                            typeset_prose_digest(meta.get('original_html',''))!=excerpt['rendered_text_sha256']):
                findings.append({**context,'type':'rule_original_content_mismatch','expected':pin['version']})
        required={identity for identity,entry in expected_excerpts.items() if entry['page']==page_name}
        if len(rows)!=len(required) or required!={row.get('source_meta',{}).get('excerpt_id') for row in rows}:
            findings.append({'file':rel,'type':'rule_excerpt_coverage_mismatch'})
    workbench=rule_contract.validate_rule_workbench(output,pin)
    findings.extend(workbench['findings'])
    seen_documents.update(workbench['seen_documents']);seen_excerpts.update(workbench['seen_excerpts'])
    for document in set(pin['documents'])-seen_documents:
        findings.append({'file':'rules/','type':'pinned_rule_page_missing','document':document})
    return findings

def canonical_rule_topic_spans(output,page,text,pin):
    """Only fixed-source verified excerpt fields and their exact transcript lines."""
    relative=page.relative_to(output).as_posix()
    if not page.is_relative_to(output/'rules') or page.parent==output/'rules':return []
    if any(finding['file']==relative for finding in rule_excerpt_pin_findings(output,[page],pin)):return []
    match=PAGE_DATA.search(text)
    if not match:return []
    data=json.loads(match[2]);screens=data.get('screens',[]);spans=[]
    valid={index:row for index,row in enumerate(screens) if row.get('render_mode')=='typeset' and row.get('shape')=='source_text'}
    for pointer,value,start,end in rule_contract.json_string_spans(match[2],match.start(2)):
        if len(pointer)==4 and pointer[0]=='screens' and pointer[1] in valid and pointer[2:]==('source_meta','original_html'):
            text_nodes,_=rule_contract.source_text_spans(value)
            spans.extend(rule_contract.encoded_json_spans(text[start:end],value,text_nodes,start))
    # Transcripts remain attached to the owning verified source screen. Each
    # original sentence/line is exact; prose added beside it receives no waiver.
    import importlib.util
    spec=importlib.util.spec_from_file_location('canonical_rule_transcript',Path(__file__).with_name('audit-page-publication.py'))
    publication=importlib.util.module_from_spec(spec);spec.loader.exec_module(publication)
    for row in valid.values():
        _,original=rule_contract.source_text_spans(row['source_meta']['original_html'])
        canonical_lines={' '.join(value.split()) for value in publication.rendered_text('<body>'+original+'</body>').splitlines() if value.strip()}
        pattern=r'<div\b[^>]*\bdata-screen-transcript=["\']'+re.escape(row['id'])+r'["\'][^>]*>(.*?)</div><!-- /screen-equivalent-text -->'
        for transcript in re.finditer(pattern,text,re.S):
            for variant in re.finditer(r'<div\b[^>]*\bdata-transcript-orientation=["\'][hv]["\'][^>]*>(.*?)</div>',transcript[1],re.S):
                origin=transcript.start(1)+variant.start(1)
                for line in re.finditer(r'[^\n]+',variant[1]):
                    if ' '.join(html.unescape(line[0]).split()) in canonical_lines:
                        spans.append((origin+line.start(),origin+line.end()))
    return spans

def rule_pin_findings(output,files):
    pin=json.loads((ROOT/'config/assembled-rules-pin.json').read_text('utf8'))
    if pin.get('schema')=='wly.assembled-rules-pin.v2':return rule_excerpt_pin_findings(output,files,pin)
    findings=[];seen=set()
    class TypesetOriginal(OriginalProse):
        def handle_starttag(self,tag,attrs):
            data=dict(attrs);classes=set(data.get('class','').split())
            if 'ct-source-body' in classes:attrs=[(k,v) for k,v in attrs if k!='class']+[('class',data['class']+' source-prose')]
            if tag=='a' and 'href' not in data and 'data-href' in data:attrs=attrs+[('href',data['data-href'])]
            if tag=='div' and 'ct-heading' in classes:tag='h2'
            super().handle_starttag(tag,attrs)
        def handle_endtag(self,tag):
            if tag=='div' and self.stack and 'ct-heading' in self.stack[-1][1]:tag='h2'
            super().handle_endtag(tag)
    for page in files:
        if page.suffix!='.html' or page.parent==output/'rules' or not page.is_relative_to(output/'rules'):continue
        text=page.read_text('utf8');rel=page.relative_to(output).as_posix()
        match=PAGE_DATA.search(text)
        rows=[s for s in json.loads(match[2]).get('screens',[]) if s.get('render_mode')=='source_text' or
              s.get('render_mode')=='typeset' and s.get('shape')=='source_text'] if match else []
        if not rows:
            findings.append({'file':rel,'type':'pinned_original_missing'});continue
        labels=[row.get('source_version','') for row in rows]+re.findall(r'<p[^>]*class="source-version"[^>]*>(.*?)</p>',text,re.S)
        versions={v for label in labels for v in re.findall(r'(?<![A-Za-z0-9])E\d+(?!\d)',html.unescape(label))}
        typeset=[row for row in rows if row.get('render_mode')=='typeset']
        if typeset:
            prose=TypesetOriginal()
            for row in typeset:prose.feed((row.get('source_meta') or {}).get('original_html',''))
            rendered_digest=prose.digest()
        else:rendered_digest=prose_digest(text)
        for row in rows:
            meta=row.get('source_meta') or {};document=meta.get('relative_file');expected=pin['documents'].get(document)
            correct_document='AGENTS.md' if page.parent.name=='charter' else 'docs/contracts/agents.'+page.parent.name+'.md'
            if document!=correct_document:findings.append({'file':rel,'type':'rule_page_source_mismatch','document':document,'expected_document':correct_document})
            seen.add(document)
            if meta.get('version')!=pin['version'] or versions!={pin['version']}:
                findings.append({'file':rel,'type':'rule_version_not_pinned','expected':pin['version'],'observed':sorted(versions|{str(meta.get('version'))})})
            if not expected or meta.get('source_sha256')!=expected['source_sha256']:
                findings.append({'file':rel,'type':'rule_source_not_pinned','document':document})
            if row.get('render_mode')=='typeset':
                try:
                    original=resolve_ref(output,page,meta.get('src',''))
                    source_matches=bool(original and original.is_file() and sha(original)==meta.get('source_sha256'))
                except (OSError,ValueError,TypeError):source_matches=False
                if not source_matches:
                    findings.append({'file':rel,'type':'rule_original_source_evidence_mismatch','document':document})
            if expected and (meta.get('omitted_count')!=expected['approved_omitted_count'] or rendered_digest!=expected['rendered_text_sha256']):
                findings.append({'file':rel,'type':'rule_original_content_mismatch','document':document,'expected':pin['version']})
    for document in set(pin['documents'])-seen:
        findings.append({'file':'rules/','type':'pinned_rule_page_missing','document':document})
    return findings

def nested_refs(value, navigation_enabled=True):
    if isinstance(value, dict):
        for k, v in value.items():
            if isinstance(v, str) and k in {'src', 'avif', 'href', 'poster', 'mask', 'script_bundle', 'style_bundle', 'repo_url'}:
                if k == 'href' and not navigation_enabled: continue
                # Screenshot metadata stores basenames; the runtime prepends assets/.
                yield ('assets/'+v if k == 'src' and v.startswith('screenshot-') else v), k == 'href'
            elif k == 'avif_assets':
                for a, b in v.items(): yield a, False; yield b, False
            elif k == 'leaves':
                for a in v: yield a, False
            # Shared component definitions include navigation for many other pages.
            # Their assets are all checked; rendered links are checked from HTML.
            else: yield from nested_refs(v,navigation_enabled and k != 'shared')
    elif isinstance(value, list):
        for v in value: yield from nested_refs(v,navigation_enabled)

def resolve_ref(root, owner, ref, asset_prefix=None):
    ref = html.unescape(ref).strip()
    parts = urlsplit(ref)
    if asset_prefix and ref.startswith(asset_prefix):
        path = '/'+unquote(urlsplit(ref[len(asset_prefix):]).path)
    else:
        if parts.scheme or parts.netloc or ref.startswith(('data:', 'blob:', 'javascript:')): return None
        path = unquote(parts.path)
    if not path: return owner if parts.fragment else None
    target = (root / path.lstrip('/') if path.startswith('/') else owner.parent / path).resolve()
    if not target.is_relative_to(root): raise ValueError('Reference escapes output: ' + ref)
    if path.endswith('/') or target.is_dir(): target /= 'index.html'
    return target

def tar_estimated_bytes(root, entries):
    return 10240 + sum(1024 + max(512, ((len(p.relative_to(root).as_posix().encode('utf8'))+511)//512)*512)
                       + (((p.stat().st_size if p.is_file() else 0)+511)//512)*512 for p in entries)


def validate(output, report_path, incomplete=False, input_stats=None, asset_prefix=None, budget_root=None):
    files = sorted(p for p in output.rglob('*') if p.is_file())
    registry_path=ROOT/'config/panel-projects.json'
    registry=json.loads(registry_path.read_text('utf8')) if registry_path.is_file() else {'projects':[]}
    registered_repos={entry['source']['repo'].lower() for entry in registry.get('projects',[])
                      if '/' in entry.get('source',{}).get('repo','')
                      and entry.get('source',{}).get('visibility') in {'PUBLIC','PRIVATE'}}
    registered_private={entry['source']['repo'].lower() for entry in registry.get('projects',[])
                        if '/' in entry.get('source',{}).get('repo','')
                        and entry.get('source',{}).get('visibility')=='PRIVATE'}
    findings = rule_pin_findings(output,files); missing = []; refs_count = 0
    pin=rule_contract.load_pin(ROOT)
    current_contract=pin.get('schema')=='wly.assembled-rules-pin.v2'
    total = sum(p.stat().st_size for p in files)
    # Tar headers/alignment are also budgeted, rather than only payload bytes.
    # Conservative bound includes directories and long-path/PAX name records.
    entries = [p for p in output.rglob('*') if p.is_file() or p.is_dir()]
    tar_bytes = tar_estimated_bytes(output, entries)
    deployment_bytes, deployment_tar_bytes = total, tar_bytes
    if budget_root is not None:
        budget_root = Path(budget_root).resolve()
        if not budget_root.is_dir(): raise ValueError('Deployment budget root is not a directory')
        budget_entries = [p for p in budget_root.rglob('*') if p.is_file() or p.is_dir()]
        deployment_bytes = sum(p.stat().st_size for p in budget_entries if p.is_file())
        deployment_tar_bytes = tar_estimated_bytes(budget_root, budget_entries)
    groups = {}; html_anchors = {}
    for page in files:
        if page.suffix != '.html': continue
        content=page.read_text('utf-8-sig'); parser=Refs();parser.feed(content)
        ids=set(parser.ids)
        for match in PAGE_DATA.finditer(content):
            data=json.loads(match[2])
            if data.get('kind') in {'project','frozen'}: ids.add('ai-brief')
            for screen in data.get('screens',[]):
                ids.update(screen[k] for k in ('id','section','nav_section') if isinstance(screen.get(k),str))
                for layout in screen.get('layouts',{}).values():
                    ids.update(a['id'] for a in layout.get('anchors',[]) if isinstance(a,dict) and isinstance(a.get('id'),str))
        html_anchors[page.resolve()]=ids
    for p in files:
        key = p.suffix or '(none)'; g = groups.setdefault(key, {'files': 0, 'bytes': 0})
        g['files'] += 1; g['bytes'] += p.stat().st_size
        rel = p.relative_to(output).as_posix()
        if p.is_symlink(): findings.append({'file': rel, 'type': 'symlink'})
        if p.stat().st_size > 100_000_000: findings.append({'file': rel, 'type': 'git_object_limit'})
        if p.name in {'build.json','build-progress.json','build-summary.json'} or '.build' in p.parts or p.suffix in {'.env','.sqlite','.db','.log'}:
            findings.append({'file': rel, 'type': 'private_build_metadata'})
        for name, pattern in [('private_filename',PRIVATE_FILENAME),('excluded_topic_filename',EXCLUDED_TOPICS)]:
            for m in pattern.finditer(rel): findings.append({'file':rel,'type':name,'offset':m.start(),'matched':m[0]})
        raw = p.read_bytes()
        for name, pattern in SECRETS:
            for m in re.finditer(pattern, raw, re.I): findings.append({'file': rel, 'type': 'credential', 'pattern': name,'offset':m.start(),'line':raw.count(b'\n',0,m.start())+1})
        if p.suffix not in TEXT_EXT: continue
        text = raw.decode('utf-8-sig')
        canonical_spans=canonical_rule_topic_spans(output,p,text,pin) if current_contract and p.suffix=='.html' else []
        resource=pin.get('public_source_resources',{}).get('/'+rel) if current_contract else None
        canonical_resource=bool(resource and resource.get('public_source_sha256')==hashlib.sha256(raw).hexdigest())
        for name, pattern in [('private_path',PRIVATE),('excluded_topic',EXCLUDED_TOPICS)]:
            for m in pattern.finditer(text):
                if name=='excluded_topic' and is_topic_word_exception(text,m): continue
                if name=='excluded_topic' and (canonical_resource or any(start<=m.start() and m.end()<=end for start,end in canonical_spans)):continue
                line=text.count('\n',0,m.start())+1;column=m.start()-text.rfind('\n',0,m.start())
                findings.append({'file':rel,'type':name,'line':line,'column':column,'offset':m.start(),'matched':m[0]})
        for repo in PRIVATE_REPOS:
            if repo.lower() in registered_repos:continue
            for m in repo_pattern(repo).finditer(text):
                findings.append({'file':rel,'type':'private_repository_reference','offset':m.start(),'line':text.count('\n',0,m.start())+1,'matched':repo})
        if PUBLIC_REPOS:
            for m in re.finditer(r'(?<![A-Za-z0-9_.-])wlyaaaaa/[A-Za-z0-9_.-]+',text,re.I):
                repo=m[0].removesuffix('.git').lower()
                if repo not in PUBLIC_REPOS and repo not in registered_repos:
                    # This source-authored instruction names an encrypted-file
                    # repository; it is ordinary prose, not a public link or
                    # runtime repository binding.
                    if repo=='wlyaaaaa/key' and text[max(0,m.start()-7):m.start()]=='放加密文件的 ' and text[m.end():m.end()+3]==' 仓库':
                        continue
                    findings.append({'file':rel,'type':'repository_not_public','line':text.count('\n',0,m.start())+1,'offset':m.start(),'matched':m[0]})
        if p.suffix=='.html':
            for match in PAGE_DATA.finditer(text):
                data=json.loads(match[2])
                findings.extend({'file':rel,**finding} for finding in repository_binding_findings(data,registry))
        references = []
        if p.suffix == '.html':
            parser = Refs(); parser.feed(text); references += parser.refs
            for m in PAGE_DATA.finditer(text): references += list(nested_refs(json.loads(m.group(2))))
        if p.suffix in {'.html', '.css'}:
            references += [(m.group(1), False) for m in re.finditer(r'url\(["\']?([^\s)"\']+)', text)]
            references += [(m.group(1), False) for m in re.finditer(r'@import\s+["\']([^"\']+)', text)]
        if p.suffix in {'.html','.js'}:
            references += [(m.group(1),False) for m in re.finditer(r'(?:\b(?:from|import)\s*|\bimport\s*\()["\']([^"\']+)["\']',text) if m[1].startswith(('.', '/')) or asset_prefix and m[1].startswith(asset_prefix)]
            references += [(m.group(1),False) for m in re.finditer(r'\bfetch\s*\(\s*["\']([^"\']+)["\']',text) if not m[1].startswith('/__')]
        for ref, navigation in references:
            external=urlsplit(ref)
            repo='/'.join(external.path.strip('/').split('/')[:2]).removesuffix('.git').lower()
            if external.netloc.lower() in {'github.com','www.github.com'} and repo in registered_private:
                findings.append({'file':rel,'type':'private_repository_link','reference':ref})
            try: target = resolve_ref(output, p, ref, asset_prefix)
            except ValueError as e: findings.append({'file': rel, 'type': str(e)}); continue
            if target is None: continue
            refs_count += 1
            if not target.is_file(): missing.append({'file': rel, 'reference': ref, 'navigation': navigation})
            elif navigation and urlsplit(ref).fragment and target.suffix=='.html':
                fragment=unquote(urlsplit(ref).fragment)
                if fragment not in html_anchors.get(target.resolve(),set()):
                    missing.append({'file':rel,'reference':ref,'navigation':True,'type':'missing_anchor'})
    domain = (output/'CNAME').read_text('utf8').strip() if (output/'CNAME').exists() else None
    if domain != 'wly0829.cn': findings.append({'file': 'CNAME', 'type': 'domain_mismatch'})
    if not any(p.suffix == '.js' for p in files): findings.append({'file': '', 'type': 'javascript_missing'})
    if deployment_bytes > BUDGET or deployment_tar_bytes > BUDGET: findings.append({'file': '', 'type': '15_percent_headroom', 'budget': BUDGET})
    required = [x for x in ('index.html','404.html') if not (output/x).is_file()]
    # B1 diagnostics can be inspected, but never accepted as publishable.
    ready = not findings and not missing and not required
    assets_missing = [x for x in missing if not x['navigation']]
    result = dict(schema='wly.assembled-build.v1',ready_to_publish=ready,status='pass' if ready else 'incomplete' if not findings and not assets_missing else 'block',
                  bytes=total,MB=round(total/1e6,3),MiB=round(total/2**20,3),tar_estimated_bytes=tar_bytes,
                  limit_bytes=LIMIT,budget_bytes=BUDGET,headroom_bytes=LIMIT-deployment_tar_bytes,files=len(files),
                  groups=groups,local_references_checked=refs_count,missing_reference_count=len(missing),missing_references=missing,
                  required_missing=required,findings=findings,input=input_stats,
                  output_files={p.relative_to(output).as_posix():{'sha256':sha(p),'bytes':p.stat().st_size} for p in files})
    if budget_root is not None:
        result.update(full_artifact_bytes=total, full_artifact_tar_estimated_bytes=tar_bytes,
                      github_deployment_bytes=deployment_bytes, github_deployment_tar_estimated_bytes=deployment_tar_bytes,
                      budget_root=str(budget_root), budget_scope='Actual GitHub Pages deployment directory')
    write_json(report_path,result)
    summary={k:result[k] for k in ('status','ready_to_publish','MB','files','missing_reference_count','required_missing')}
    summary.update(finding_count=len(findings),findings=findings[:8])
    print(json.dumps(summary,ensure_ascii=False,indent=2))
    if findings or assets_missing or (not ready and not incomplete): raise SystemExit(1)
    return result

def build(source, output, report_path, incomplete):
    source = source.resolve(); output = output.resolve()
    if source == output or output.is_relative_to(source) or source.is_relative_to(output): raise ValueError('Input and output must be disjoint')
    if output.exists(): raise ValueError('Output already exists; choose a fresh output or recycle the old task output first')
    if (source/'CNAME').exists() and (source/'CNAME').read_text('utf-8-sig').strip()!='wly0829.cn':
        raise ValueError('Input CNAME disagrees with the existing site domain; refusing to replace it')
    # A compiler may still update the preview while this preparation runs.
    # Freeze a verified private task copy before the slower fallback encoding.
    original_files=sorted(p for p in source.rglob('*') if p.is_file())
    original_stats={'bytes':sum(p.stat().st_size for p in original_files),'files':len(original_files)}
    public_inputs=[p for p in original_files if not any(x.startswith('.') for x in p.relative_to(source).parts)]
    signature={p.relative_to(source).as_posix():(p.stat().st_size,p.stat().st_mtime_ns) for p in public_inputs}
    snapshot=ROOT/'.publish/snapshots'/uuid.uuid4().hex
    snapshot.mkdir(parents=True)
    for p in public_inputs:
        target=snapshot/p.relative_to(source);target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(p,target)
        if sha(p)!=sha(target): raise ValueError('Source changed during snapshot: '+str(p.relative_to(source)))
    after={p.relative_to(source).as_posix():(p.stat().st_size,p.stat().st_mtime_ns) for p in source.rglob('*') if p.is_file() and not any(x.startswith('.') for x in p.relative_to(source).parts)}
    if signature!=after: raise ValueError('Source changed during snapshot; retry after assembly finishes')
    source_snapshot_files={p.relative_to(source).as_posix():{'sha256':sha(snapshot/p.relative_to(source)),'bytes':p.stat().st_size} for p in public_inputs}
    original_source_root=str(source)
    source=snapshot.resolve()
    output.mkdir(parents=True)
    files = sorted(p for p in source.rglob('*') if p.is_file())
    groups = {}; cards = set(); referenced_variants = set()
    for p in files:
        if any(x.startswith('.') for x in p.relative_to(source).parts): continue
        m = VARIANT.match(p.name)
        if m: groups.setdefault((p.parent,m[1]),[]).append(p)
    for p in files:
        if p.suffix != '.html': continue
        if any(x.startswith('.') for x in p.relative_to(source).parts): continue
        t = p.read_text('utf8')
        referenced_variants.update(re.findall(r'[^/"\s,]+-(?:828|1280|1920|2880)-[a-f0-9]{12}\.(?:avif|webp)',t))
        for section in re.findall(r'<section\b[^>]*class="[^"]*shape-card[^>]*>.*?</section>', t, re.S):
            for name in re.findall(r'([^/"\s,]+-(?:828|1280|1920|2880)-[a-f0-9]{12}\.avif)', section):
                m = VARIANT.match(name)
                if m: cards.add((p.parent/'assets',m[1]))
    keep = set(); replacement = {}; dropped = set(); fallbacks = []
    for (parent, stem), paths in groups.items():
        webp = [p for p in paths if p.suffix == '.webp']
        fallback = min(webp, key=lambda p: int(VARIANT.match(p.name)[2])) if webp else None
        fallback_name = None
        if fallback and any(p.name in referenced_variants for p in paths):
            # Only the non-AVIF fallback is resized. Every retained AVIF is copied.
            from PIL import Image
            target_dir=output/parent.relative_to(source);target_dir.mkdir(parents=True,exist_ok=True)
            target=target_dir/(stem+'-fallback.webp')
            cache_root=ROOT/'.publish/fallback-cache';cache_root.mkdir(parents=True,exist_ok=True)
            source_sha=sha(fallback);cache_key=hashlib.sha256((source_sha+':640:LANCZOS:webp:q85:method2').encode()).hexdigest()
            cache_blob=cache_root/(cache_key+'.webp');cache_receipt=cache_root/(cache_key+'.json');cache_hit=False
            if cache_blob.is_file() and cache_receipt.is_file():
                try:
                    cached=json.loads(cache_receipt.read_text('utf8'))
                    cache_hit=cached.get('source_sha256')==source_sha and cached.get('sha256')==sha(cache_blob)
                except (OSError,ValueError):pass
            if cache_hit:shutil.copy2(cache_blob,target)
            else:
                with Image.open(fallback) as image:
                    if image.width > 640: image=image.resize((640,round(image.height*640/image.width)),Image.Resampling.LANCZOS)
                    image.save(target,'WEBP',quality=85,method=2)
                temp_cache=cache_root/(cache_key+'.'+uuid.uuid4().hex+'.writing');shutil.copy2(target,temp_cache);temp_cache.replace(cache_blob)
                cache_receipt.write_text(json.dumps({'source_sha256':source_sha,'sha256':sha(cache_blob),'algorithm':'640:LANCZOS:webp:q85:method2'}),encoding='utf8')
            digest=sha(target);fallback_name=stem+'-fallback640-'+digest[:12]+'.webp'
            target.rename(target.with_name(fallback_name))
            fallbacks.append({'file':(target.with_name(fallback_name)).relative_to(output).as_posix(),'sha256':digest,'bytes':target.with_name(fallback_name).stat().st_size,'cache_hit':cache_hit})
        for p in paths:
            m = VARIANT.match(p.name); width=int(m[2]); fmt=m[4]
            portrait_variant = bool(re.search(r'-v(?:$|-)', stem))
            avif_max_width = max((int(VARIANT.match(q.name)[2]) for q in paths if q.suffix == '.avif'), default=0)
            retain = False if fmt == 'webp' else ((parent,stem) in cards or width >= (1280 if portrait_variant else 1920) or width == avif_max_width)
            if retain: keep.add(p)
            else:
                dropped.add(p)
                if fmt == 'webp' and fallback_name: replacement[p.name]=fallback_name
    # Retained AVIF and non-responsive assets are copied with byte equality.
    copied = {}; rewritten=[]; script_renames={}; changed_scripts=[]
    for p in files:
        rel=p.relative_to(source)
        if any(x.startswith('.') for x in rel.parts) or p.name in {'build.json','build-progress.json','build-summary.json'}: continue
        if p.suffix == '.json': continue  # compiler receipts are not a runtime input
        if p.suffix != '.html' and p.suffix not in ASSET_EXT: continue
        if p in dropped: continue
        if VARIANT.match(p.name) and p.name not in referenced_variants: continue
        target=output/rel; target.parent.mkdir(parents=True,exist_ok=True)
        if p.suffix == '.html':
            text=p.read_text('utf8')
            for old,new in script_renames.items(): text=text.replace(old,new)
            def attr(m):
                entries=[]
                for entry in m[2].split(','):
                    parts=entry.strip().split()
                    if not parts: continue
                    q=resolve_ref(source,p,parts[0])
                    if q not in dropped: entries.append(entry.strip())
                if not entries:
                    # Some source elements list only the large WebP viewer tier.
                    # Repoint that element at its existing small fallback.
                    parts=m[2].split(',')[0].strip().split()
                    if not parts:
                        return m[0]
                    q=resolve_ref(source,p,parts[0]); new=replacement.get(q.name) if q else None
                    if not new: raise ValueError('Empty responsive source in '+str(rel)+': '+m[2][:200])
                    url=parts[0].rsplit('/',1)[0]+'/'+new if '/' in parts[0] else new
                    entries=[url+' 640w' if len(parts)>1 else url]
                return m[1]+'="'+', '.join(entries)+'"'
            text=ATTR.sub(attr,text)
            # Replace references to removed WebP files in viewer metadata and fallback src.
            for old,new in replacement.items():
                if old in text: text=text.replace(old,new)
            def page_data(m):
                data=clean_repo_bindings(clean_provenance(json.loads(m[2])))
                for screen in data.get('screens',[]):
                    for layout in screen.get('layouts',{}).values():
                        viewer=layout.get('viewer',{})
                        if viewer.get('src') and viewer.get('avif'):
                            f=resolve_ref(output,target,viewer['src'])
                            if f and f.is_file(): viewer['sha256']=sha(f)
                return m[1]+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</',r'<\/')+m[3]
            text=PAGE_DATA.sub(page_data,text)
            target.write_text(text,encoding='utf8',newline='');rewritten.append(rel.as_posix())
        elif p.suffix == '.js' and 'const lead=`项目：${data.title}；仓库：${repo}；' in p.read_text('utf8'):
            original=p.read_text('utf8')
            text=original.replace('const lead=`项目：${data.title}；仓库：${repo}；','const lead=`项目：${data.title}；${repo.startsWith("private-project-")?"项目键":"仓库"}：${repo}；')
            digest=hashlib.sha256(text.encode()).hexdigest()
            stem=re.sub(r'-[a-f0-9]{12}$','',p.stem)
            target=target.with_name(stem+'-'+digest[:12]+'.js')
            target.write_text(text,encoding='utf8',newline='')
            script_renames['/'+rel.as_posix()]='/'+target.relative_to(output).as_posix()
            changed_scripts.append({'old':rel.as_posix(),'new':target.relative_to(output).as_posix(),'reason':'neutral project key label'})
        else:
            shutil.copy2(p,target);copied[rel.as_posix()]=sha(p)
            if sha(target)!=copied[rel.as_posix()]: raise ValueError('Copy changed bytes: '+str(rel))
    # 404 排在 _shared 之前，不能依赖文件遍历顺序才拿到共享JS的新名字。
    for rel in rewritten:
        html_path=output/rel
        text=html_path.read_text('utf8')
        for old,new in script_renames.items(): text=text.replace(old,new)
        html_path.write_text(text,encoding='utf8',newline='')
    (output/'CNAME').write_text('wly0829.cn\n',encoding='utf8',newline='')
    (output/'.nojekyll').write_text('',encoding='utf8')
    # The custom 404 is provided as a directory page by the B2 compiler.
    if (output/'404/index.html').is_file() and not (output/'404.html').is_file():
        document=(output/'404/index.html').read_text('utf8')
        document=re.sub(r'(?<![A-Za-z0-9_/-])assets/', '/404/assets/', document)
        (output/'404.html').write_text(document,encoding='utf8',newline='')
    stats={**original_stats,'source_snapshot':str(snapshot),'source_root':original_source_root,'source_snapshot_files':source_snapshot_files,'dropped_variant_bytes':sum(p.stat().st_size for p in dropped),
           'dropped_variants':len(dropped),'unchanged_asset_files':len(copied),'unchanged_asset_hashes':copied,'rewritten_html':rewritten,
           'generated_old_browser_fallbacks':fallbacks,'responsive_source_images':len(groups)}
    stats['private_repository_rewrites']=PRIVATE_REPO_REWRITES
    stats['changed_scripts']=changed_scripts
    import importlib.util
    public_spec=importlib.util.spec_from_file_location('assembled_publication_fields',ROOT/'scripts/audit-page-publication.py')
    public_module=importlib.util.module_from_spec(public_spec);public_spec.loader.exec_module(public_module)
    public_fields=public_module.finalize_public_fields(output)
    if public_fields['remaining_local_literals']:raise ValueError('Local/internal literals remain in assembled public fields')
    stats['public_field_projection']={key:len(public_fields[key]) for key in ('changed_files','omitted_runtime_fields','omitted_local_literals','remaining_local_literals')}
    return validate(output,report_path,incomplete,stats)

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--source',type=Path)
    ap.add_argument('--output',type=Path,default=ROOT/'dist')
    ap.add_argument('--report',type=Path,default=ROOT/'.publish/size-report.json')
    ap.add_argument('--allow-incomplete',action='store_true',help='B1 inspection only; never stage or deploy this result')
    ap.add_argument('--verify-only',action='store_true')
    ap.add_argument('--private-index',type=Path,help='Local registered repository inventory; never copied into the site')
    ap.add_argument('--public-repos-from-github',action='store_true',help='Independently verify repository references against GitHub public inventory')
    args=ap.parse_args()
    if args.private_index:
        inventory=json.loads(args.private_index.read_text('utf-8-sig'))
        PRIVATE_REPOS.update(e['repo'] for e in inventory.get('entries',[]) if e.get('visibility')=='PRIVATE')
    if args.public_repos_from_github: load_public_repos()
    if args.verify_only: validate(args.output.resolve(),args.report,args.allow_incomplete)
    elif args.source: build(args.source,args.output,args.report,args.allow_incomplete)
    else: ap.error('--source is required unless --verify-only')

if __name__=='__main__': main()

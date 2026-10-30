"""Bind native rule prose to one verified active E release; never read personal stores."""
import hashlib
import json
import re
import subprocess
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path

import rule_original_contract as contract

ROOT = Path(__file__).resolve().parents[1]
ENTRY = r'E:\.agents\tools\Invoke-EAgentRulesRelease.ps1'
# Each boundary belongs to the current author's existing original-text screens.
# Unlike the historical excerpt contract, these cuts cover every source byte;
# new paragraphs between two boundaries stay with their owning screen.
PART_BOUNDARIES = {
    'charter': ['### 三、怎样做事', '### 五、我的个人资料', '### 八、项目与维护'],
    'rule-authorization': ['## 子代理和项目规则不扩大授权', '## 受信任的 AI'],
    'rule-capabilities-runtime': ['## 常用入口', '## 浏览器', '## 汇报、网站和自动运行的东西', '## 安装位置、配置和本机约定'],
    'rule-claude-adapter': ['## 派子代理：Claude 的不同处', '- **从包装器进入。**', '命令参数按需查',
                            '- **要在新会话里验收的**', '## Hook 和个人资料状态', '## 受信任 AI 的其他能力'],
    'rule-codex-adapter': ['## 派子代理：Codex 的不同处'],
    'rule-context-sources': ['## 三档维护', '### 一样东西只存一处'],
    'rule-engineering-delivery': ['## 验证', '## 下载、临时文件和清理', '## Git 收尾'],
    'rule-execution-coordination': ['## 改动与花费成比例'],
    'rule-privacy-data': ['- **入口。**', '## 公开个人数据分级表', '## 私人仓库收口'],
    'rule-protected-actions': ['## GitHub 重大动作'],
    'rule-rule-release': ['## 发布和回退'],
}


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def prose_digest(body):
    return digest(contract.canonical_plain(contract.render_markdown(body)).encode())


def public_parts(body, page, screens):
    """Slice one complete frozen document into the existing owning screens."""
    originals = [screen for screen in screens if screen.get('shape') == 'source_text']
    boundaries = PART_BOUNDARIES[page]
    if len(originals) != len(boundaries) + 1:
        raise ValueError('Rule original screen boundaries changed: ' + page)
    offsets = [0, *(contract.marker_offset(body, marker) for marker in boundaries), len(body)]
    if offsets != sorted(set(offsets)):
        raise ValueError('Rule original boundaries are reversed or repeated: ' + page)
    result = {}; pieces = []
    for index, screen in enumerate(originals):
        start, end = offsets[index:index+2]; selected = body[start:end]
        identity = screen.get('source_excerpt_id', page + '/' + screen['id'])
        if identity in result:
            raise ValueError('Repeated rule original part: ' + identity)
        pieces.append(selected)
        result[identity] = (selected.strip(), {'from': boundaries[index-1] if index else None,
            'to': boundaries[index] if index < len(boundaries) else None,
            'start': start, 'end': end, 'approved_omissions': []})
    if ''.join(pieces) != body:
        raise ValueError('Rule original parts lost source bytes: ' + page)
    combined = ' '.join(contract.canonical_plain(contract.render_markdown(part)) for part, _ in result.values())
    if combined != contract.canonical_plain(contract.render_markdown(body)):
        raise ValueError('Rule original parts changed source prose: ' + page)
    return result


def public_body(raw, relative):
    body = contract.public_markdown(raw.decode('utf-8-sig'), relative, apply_omissions=False, preserve_literals=True)
    body = contract.omit_public_topics(body, relative)
    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)', lambda m: m[0] if m[2].startswith(('https://', 'http://', '/rules/', '/rule-sources/', '/source-tools/')) else m[1] + '（`' + m[2] + '`）', body)

def render(body):
    rendered = contract.render_markdown(body)
    legacy_headings = {'云端素材通道': 'p-cloud', '公开个人数据分级表': 'p-classification'}
    def heading(match):
        title = contract.canonical_plain(match[2])
        aliases = contract.source_heading_aliases('# ' + title)
        if title in legacy_headings: aliases.append(legacy_headings[title])
        return ''.join('<span id="' + contract.html.escape(alias, quote=True) + '"></span>' for alias in aliases) + match[0]
    rendered = re.sub(r'(<h[1-6]>)(.*?)(</h[1-6]>)', heading, rendered)
    if re.search(r'\*\*L(?:[1-9]|[12]\d|30)\b', body):
        rendered = re.sub(r'<strong>L([1-9]|[12]\d|30)\b', lambda m: '<span id="L' + m[1] + '"></span>' + m[0], rendered)
    return re.sub(r'(<strong>可派范围看模型清单[。.]</strong>)', r'<span id="p-model-table"></span>\1', rendered, count=1)


def inspect():
    result = json.loads(subprocess.check_output(['pwsh', '-NoProfile', '-File', ENTRY, '-Mode', 'Inspect', '-Json'], encoding='utf8'))
    if (result.get('status'), result.get('reason')) != ('pass', 'e_rules_active_verified'):
        raise ValueError('Active E rules were not verified')
    return {**result['verified_current'], 'pointer': result['pointer'], 'pointer_path': result['pointer_path'],
        'pointer_sha256': result['pointer_sha256']}


def refresh():
    """Refresh the versioned author source during an explicitly requested update."""
    active = inspect(); documents = {}; public = ROOT/'sources/rules'
    activated = datetime.fromisoformat(active['pointer']['activated_at_utc']).astimezone(timezone(timedelta(hours=8)))
    activation_label = f'{activated.month} 月 {activated.day} 日 {activated:%H:%M}'
    catalog = active['catalog']; paths = active['artifact_paths']
    primary = {row['logical_id']: row for row in catalog['documents']}
    for entry in active['files']:
        path = Path(paths[entry['logical_id']]); raw = path.read_bytes()
        if len(raw) != entry['bytes'] or hashlib.sha256(raw).hexdigest() != entry['sha256']:
            raise ValueError('Verified rule input changed: ' + entry['logical_id'])
        if path.suffix != '.md':
            target = public/entry['relative_path']; target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(raw)
            continue
        # Active L20 permits ordinary identities and technical paths. Historical
        # topic-name/path exclusions are not positive L3 evidence. Credentials
        # still fail the existing whole-artifact public-content gate.
        body = public_body(raw, entry['relative_path'])
        sha = hashlib.sha256(body.encode()).hexdigest(); resource = '_typeset/rule-sources/' + sha + '.md'
        destination = public / entry['relative_path']; destination.parent.mkdir(parents=True, exist_ok=True); destination.write_bytes(body.encode('utf8'))
        topic = primary.get(entry['logical_id'], {})
        documents[entry['logical_id']] = {**entry, 'title': topic.get('title', path.name), 'purpose': topic.get('purpose', 'AI 的规则入口'),
            'primary': bool(topic), 'slug': 'charter' if entry['logical_id'] == 'agents_root_rules' else path.stem.removeprefix('agents.'),
            'public_source_sha256': sha, 'public_source_bytes': len(body.encode()), 'src': '/' + resource,
            'prose_sha256': prose_digest(body),
            'search_text_sha256': hashlib.sha256(contract.canonical_plain(contract.render_markdown(body)).lower().encode()).hexdigest()}
    pin = {'schema': 'wly.astro-rules-pin.v1', 'version': active['release_id'], 'release_commit': active['git_commit'],
        'ruleset_sha256': active['ruleset_sha256'], 'release_record_sha256': active['release_record_sha256'],
        'files': active['files'], 'catalog': catalog, 'pointer': active['pointer'], 'pointer_sha256': active['pointer_sha256'], 'documents': documents}
    pointer_bytes = Path(active['pointer_path']).read_bytes()
    if digest(pointer_bytes) != active['pointer_sha256'] or json.loads(pointer_bytes) != active['pointer']:
        raise ValueError('Verified rule pointer changed during refresh')
    (public/'current-rules.json').write_bytes(pointer_bytes)
    for path in (ROOT/'sources/pages').glob('*/page.json'):
        page = json.loads(path.read_text('utf8'))
        if page.get('kind') not in ('charter', 'rule-topic', 'rules-home'): continue
        key = next((key for key, row in documents.items() if row['slug'] == page['page'].removeprefix('rule-')), None)
        row = documents.get(key, {}); source = (public/row['relative_path']).read_text('utf8') if row else ''
        pieces = public_parts(source, page['page'], page['screens']) if row else {}
        page['based_on'] = {'release': pin['version'], 'commit': pin['release_commit'], 'ruleset_sha256': pin['ruleset_sha256'],
            'activated_at': activated.isoformat(),
            **({'file': 'sources/rules/'+row['relative_path'], 'sha256': row['sha256'], 'public_sha256': row['public_source_sha256']}
               if row else {'file': 'sources/rules/release.json'})}
        if row:
            row['page'] = page['page']; row['route'] = page['url']; row['parts'] = []
        for screen in page['screens']:
            if screen.get('shape') == 'source_text' and row:
                identity = screen.get('source_excerpt_id', page['page']+'/'+screen['id']); body, selection = pieces[identity]
                label = screen.get('text', '').split('\n', 1)[0]
                label = re.sub(r'\bE\d+\b', pin['version'], label) if label.startswith(('原文', '约法')) else '原文 · '+pin['version']+' 版'
                screen['text'] = label+'\n\n'+body; screen['source_excerpt_id'] = identity
                screen['source'] = {'file': row['relative_path'], 'release': pin['version'], 'sha256': row['sha256'],
                    'public_sha256': row['public_source_sha256'], **selection}
                row['parts'].append({'id': identity, 'label': label, 'markdown_sha256': digest(body.encode()),
                    'prose_sha256': prose_digest(body), 'selection': selection})
            elif '当前生效版本' in screen.get('text', ''):
                # Dated examples and history keep their own version and date.
                screen['text'] = re.sub(r'(当前生效版本\s+)E\d+(（北京时间\s+).*?(\s+起）)',
                    lambda match: match[1]+pin['version']+match[2]+activation_label+match[3], screen['text'])
        path.write_bytes((json.dumps(page, ensure_ascii=False, indent=2)+'\n').encode())
    closure = sorted({entry['relative_path'] for entry in active['files']} | {'current-rules.json'})
    pin['public_files'] = {relative: {'bytes': (public/relative).stat().st_size, 'sha256': digest((public/relative).read_bytes())}
        for relative in closure}
    (public/'release.json').write_bytes((json.dumps(pin, ensure_ascii=False, indent=2)+'\n').encode())
    return pin


def generate(public):
    """Build only from the frozen author source; never inject machine state."""
    source = ROOT/'sources/rules'; pin = json.loads((source/'release.json').read_text('utf8'))
    if pin.get('schema') != 'wly.astro-rules-pin.v1': raise ValueError('Run prepare-astro-release.py refresh before building')
    if set(pin.get('public_files', {})) != {entry['relative_path'] for entry in pin['files']} | {'current-rules.json'}:
        raise ValueError('Frozen rule closure inventory changed')
    for relative, descriptor in pin.get('public_files', {}).items():
        raw = (source/relative).read_bytes()
        if len(raw) != descriptor['bytes'] or digest(raw) != descriptor['sha256']: raise ValueError('Frozen rule closure changed: '+relative)
    for row in pin['documents'].values():
        body = (source/row['relative_path']).read_bytes()
        if hashlib.sha256(body).hexdigest() != row['public_source_sha256']: raise ValueError('Frozen rule source changed')
        target = Path(public)/row['src'].lstrip('/'); target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(body)
        if row['relative_path'].startswith('templates/'):
            alias = Path(public)/'rule-sources'/row['relative_path']; alias.parent.mkdir(parents=True, exist_ok=True); alias.write_bytes(body)
    return {**pin, 'documents': {key: {k: v for k, v in row.items() if k != 'html'} for key, row in pin['documents'].items()}}


class Prose(HTMLParser):
    def __init__(self):
        super().__init__(); self.depth = 0; self.key = None; self.texts = {}; self.words = []
        self.records = []; self.identities = set(); self.pending_label = None
        self.label_depth = 0; self.label_words = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs); key = attrs.get('data-rule-source')
        if self.label_depth:
            if tag not in contract.HTML_VOID_TAGS: self.label_depth += 1
        elif 'rule-original-version' in attrs.get('class', '').split():
            self.label_depth = 1; self.label_words = []
        if key:
            identity = (key, attrs.get('data-rule-part'))
            if self.depth or identity in self.identities: raise ValueError('Duplicate rule source body')
            self.identities.add(identity)
            self.key = key; self.depth = 1; self.words = []
            self.record = {'key': key, 'part': attrs.get('data-rule-part'), 'sha256': attrs.get('data-rule-public-sha256'),
                'label': self.pending_label}; self.pending_label = None
        elif self.depth and tag not in contract.HTML_VOID_TAGS: self.depth += 1
    def handle_endtag(self, tag):
        if tag in contract.HTML_VOID_TAGS: return
        if self.label_depth:
            self.label_depth -= 1
            if not self.label_depth: self.pending_label = ' '.join(''.join(self.label_words).split())
        if self.depth:
            self.depth -= 1
            if not self.depth:
                text = ' '.join(''.join(self.words).split())
                self.texts[self.key] = (self.texts.get(self.key, '') + ' ' + text).strip()
                self.record['text'] = text; self.records.append(self.record)
    def handle_data(self, text):
        if self.depth: self.words.append(text)
        if self.label_depth: self.label_words.append(text)


def verify(root, pin, current=None):
    if pin.get('schema') != 'wly.astro-rules-pin.v1': raise ValueError('Missing native rules pin')
    if pin.get('pointer') and any(pin['pointer']['current'][field] != pin[key] for key, field in
            (('version', 'release_id'), ('release_commit', 'git_commit'), ('ruleset_sha256', 'ruleset_sha256'),
             ('release_record_sha256', 'release_record_sha256'))):
        raise ValueError('Frozen current rule pointer differs from its release identity')
    if current and any(pin[key] != current[field] for key, field in (('version', 'release_id'), ('ruleset_sha256', 'ruleset_sha256'), ('release_record_sha256', 'release_record_sha256'))):
        raise ValueError('Published rule version differs from the verified active release')
    if current and 'files' in current:
        if (pin['files'] != current['files'] or pin['catalog'] != current['catalog'] or pin['release_commit'] != current['git_commit']
                or current.get('pointer') and pin.get('pointer') != current['pointer']
                or current.get('pointer_sha256') and pin.get('pointer_sha256') != current['pointer_sha256']):
            raise ValueError('Frozen rule inventory differs from the active release')
        expected = {row['logical_id']: row for row in current['files'] if row['relative_path'].endswith('.md')}
        if set(expected) != set(pin['documents']): raise ValueError('Rule source inventory changed')
        for key, entry in expected.items():
            raw = Path(current['artifact_paths'][key]).read_bytes(); body = public_body(raw, entry['relative_path'])
            if len(raw) != entry['bytes'] or hashlib.sha256(raw).hexdigest() != entry['sha256']: raise ValueError('Active rule bytes changed')
            row = pin['documents'][key]
            if row['public_source_sha256'] != hashlib.sha256(body.encode()).hexdigest() or row['prose_sha256'] != hashlib.sha256(contract.canonical_plain(contract.render_markdown(body)).encode()).hexdigest():
                raise ValueError('Frozen public rule content differs from verified active source: '+key)
    if pin.get('files'):
        expected = {row['logical_id']: row for row in pin['files'] if row['relative_path'].endswith('.md')}
        primary = {row['logical_id'] for row in pin['catalog'].get('documents', [])}
        if set(expected) != set(pin['documents']) or {key for key, row in pin['documents'].items() if row['primary']} != primary:
            raise ValueError('Rule source inventory changed')
        for key, row in pin['documents'].items():
            if any(row[field] != expected[key][field] for field in ('relative_path', 'bytes', 'sha256')):
                raise ValueError('Rule source descriptor changed: '+key)
    root = Path(root); workbench = Prose(); workbench.feed((root / 'rules/index.html').read_text('utf8'))
    manifest = json.loads((root/'release-manifest.json').read_text('utf8')) if (root/'release-manifest.json').exists() else {}
    if workbench.records: raise ValueError('Rules workbench duplicated an owning rule original')
    originals = 0; parts = 0
    for key, row in pin['documents'].items():
        resources = [row['src'].lstrip('/')]
        if row.get('relative_path', '').startswith('templates/'):
            resources.append('rule-sources/'+row['relative_path'])
        for relative in resources:
            path = root / relative
            if path.exists() and digest(path.read_bytes()) != row['public_source_sha256']: raise ValueError('Rule source bytes changed: ' + key)
            if not path.exists():
                obj = manifest.get('oss', {}).get('objects', {}).get(relative, {})
                if obj.get('sha256') != row['public_source_sha256'] or obj.get('byte_preserved') is not True: raise ValueError('Rule source object lost: ' + key)
        if row['primary']:
            detail = Prose(); detail.feed((root / 'rules' / row['slug'] / 'index.html').read_text('utf8'))
            if set(detail.texts) != {key}: raise ValueError('Owning rule page source identity changed: '+key)
            if digest(detail.texts[key].encode()) != row['prose_sha256']: raise ValueError('Native rule prose changed: ' + key)
            expected_parts = row.get('parts')
            if expected_parts and [record['part'] for record in detail.records] != [part['id'] for part in expected_parts]:
                raise ValueError('Owning rule page lost or reordered original parts: '+key)
            for index, record in enumerate(detail.records):
                if record['sha256'] != row['public_source_sha256']: raise ValueError('Native rule source binding changed: '+key)
                if not record['label'] or re.findall(r'\bE[\w-]+\b', record['label']) != [pin['version']]:
                    raise ValueError('Native rule displayed version differs from verified active release: '+key)
                if expected_parts and digest(record['text'].encode()) != expected_parts[index]['prose_sha256']:
                    raise ValueError('Native rule original part changed: '+record['part'])
            originals += 1; parts += len(detail.records)
    return {'status': 'pass', 'version': pin['version'], 'documents': len(pin['documents']), 'primary_originals': originals, 'parts': parts}

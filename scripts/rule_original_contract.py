"""Fixed-source rule excerpts and the explicit public literal projection."""
from __future__ import annotations

import hashlib
import html
import json
from pathlib import Path
import re
from html.parser import HTMLParser
from urllib.parse import unquote

from public_page_contract import omit_local_literals, local_values

CONTRACT = 'e216-original-ranges-v1'


def excerpt_contract_id(version):
    """Use the release's actual contract while retaining exact E215 replay."""
    if version == 'E215':
        return 'e215-original-ranges-v1'
    if version == 'E216':
        return CONTRACT
    raise ValueError('Unsupported fixed source excerpt release: ' + str(version))
HTML_VOID_TAGS = frozenset({'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
                            'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'})


def source_node_excluded(attrs):
    classes = set(attrs.get('class', '').split())
    return 'source-extra' in classes or ('table-label' in classes and 'data-echo' in attrs)


def source_root(tag, attrs, ancestors):
    """Declared prose, or an explicit table inside a producer source-text page."""
    classes = set(attrs.get('class', '').split())
    if classes & {'ct-source-body', 'source-prose'}:
        return True
    if tag != 'div' or 'c-table' not in classes or attrs.get('data-comp') != 'table':
        return False
    ancestors = list(ancestors)
    if source_node_excluded(attrs) or any(source_node_excluded(a) for _, a in ancestors):
        return False
    # A table elsewhere in the document is presentation, not a source root.
    body = next((i for i in range(len(ancestors) - 1, -1, -1) if ancestors[i][0] == 'body'), None)
    return (body is not None and 'shape-source_text' in ancestors[body][1].get('class', '').split()
            and any(t == 'main' and a.get('id') == 'page' for t, a in ancestors[body + 1:]))


def source_root_opening(tag, attrs, opening):
    """Keep the source meaning of a root after removing its page ancestors."""
    if set(dict(attrs).get('class', '').split()) & {'ct-source-body', 'source-prose'}:
        return opening
    return '<' + tag + ''.join(' ' + k + ('="' + html.escape(v + ' source-prose' if k == 'class' else v, quote=True) + '"'
                                         if v is not None else '') for k, v in attrs) + '>'


OMISSIONS = {
    'docs/contracts/agents.capabilities-runtime.md': ['、本人诉讼', '、`personal-litigation`'],
    'docs/contracts/agents.context-sources.md': [
        '| PersonalOS（含退役留档） | `PersonalOS-Retired` |',
        '| 个人知识库 | `PersonalKnowledgeBase` |',
        '| 游戏求解 | `md-triple-tactics-talent-solver` |',
        '| 对齐数据集 | `human-alignment-dataset-001` |'],
    'docs/contracts/agents.privacy-data.md': ['`wlyaaaaa/Key` 仓库和 '],
}

# These boundaries come from the pre-refresh approved page ranges. A new
# independent source chapter does not enter a range merely to satisfy a digest.
RANGES = {
    'rule-authorization': [(5, None, '## 子代理和项目规则不扩大授权'),
                           (6, '## 子代理和项目规则不扩大授权', '## 受信任的 AI'),
                           (7, '## 受信任的 AI', None)],
    'rule-capabilities-runtime': [(11, None, '## 常用入口'),
                                  (12, '## 常用入口', '## 云端素材通道'),
                                  (13, '## 浏览器', '## 汇报、网站和自动运行的东西'),
                                  (14, '## 汇报、网站和自动运行的东西', '## 安装位置、配置和本机约定'),
                                  (15, '## 安装位置、配置和本机约定', None)],
    'rule-claude-adapter': [(11, None, '## 派子代理：Claude 的不同处'),
                           (12, '## 派子代理：Claude 的不同处', '- **从包装器进入。**'),
                           (13, '- **从包装器进入。**', 'Steer 的长消息可用'),
                           (14, 'Steer 的长消息可用', '- **改了 MCP 之后的验收**'),
                           (15, '- **改了 MCP 之后的验收**', '## Hook 和个人资料状态'),
                           (16, '## Hook 和个人资料状态', '## 受信任 AI 的其他能力'),
                           (17, '## 受信任 AI 的其他能力', None)],
    'rule-codex-adapter': [(5, None, '## 派子代理：Codex 的不同处'),
                          (6, '## 派子代理：Codex 的不同处', None)],
    'rule-context-sources': [(8, None, '## 三档维护'),
                            (9, '## 三档维护', '### 一样东西只存一处'),
                            (10, '### 一样东西只存一处', None)],
    'rule-engineering-delivery': [(6, None, '## 验证'),
                                 (7, '## 验证', '## 下载、临时文件和清理'),
                                 (8, '## 下载、临时文件和清理', '## Git 收尾'),
                                 (9, '## Git 收尾', None)],
    'rule-execution-coordination': [(6, None, '本人让 Claude 与 GPT 协作时'),
                                    (7, '本人让 Claude 与 GPT 协作时', None)],
    'rule-privacy-data': [(7, None, '- **入口。**'),
                         (8, '- **入口。**', '## 公开个人数据分级表'),
                         (9, '## 公开个人数据分级表', '## 私人仓库收口'),
                         (10, '## 私人仓库收口', None)],
    'rule-protected-actions': [(7, None, '## GitHub 重大动作'),
                              (8, '## GitHub 重大动作', None)],
    'rule-rule-release': [(5, None, '## 发布和回退'), (6, '## 发布和回退', None)],
}


def sha_bytes(value):
    return hashlib.sha256(value).hexdigest()


def source_link_target(value):
    path, separator, fragment = value.partition('#')
    fragment = unquote(fragment)
    name = Path(path.replace('\\', '/')).name
    if path.replace('\\', '/').endswith('templates/claude-home/CLAUDE.md'):
        return '/rule-sources/templates/claude-home/CLAUDE.md' + ('#' + fragment if separator else '')
    if path.replace('\\', '/').endswith('templates/codex-home/AGENTS.md'):
        return '/rule-sources/templates/codex-home/AGENTS.md' + ('#' + fragment if separator else '')
    if name == 'AGENTS.md':
        return '/rules/charter/' + ('#' + fragment if separator else '')
    if re.fullmatch(r'agents\.[a-z-]+\.md', name):
        return '/rules/' + name[7:-3] + '/' + ('#' + fragment if separator else '')
    if value.replace('\\', '/').lower() == 'e:/.agents/tools/find-duplicatecontent.ps1':
        return '/source-tools/Find-DuplicateContent.ps1'
    return path + ('#' + fragment if separator else '')


def public_markdown(raw, relative, *, apply_omissions=True):
    """Keep every source paragraph; omit only approved values and local literals."""
    text = raw.replace('\r\n', '\n').replace('\r', '\n')
    if apply_omissions:
        for phrase in OMISSIONS.get(relative, []):
            if text.count(phrase) != 1:
                raise ValueError('Approved omission no longer occurs once: ' + relative)
            if phrase.startswith('|'):
                text = re.sub('^' + re.escape(phrase) + r'\n?', '', text, count=1, flags=re.M)
            else:
                text = text.replace(phrase, '', 1)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
                  lambda m: '[' + m[1] + '](' + source_link_target(m[2]) + ')', text)
    return omit_local_literals(text, replacement='（本机路径）')


def marker_offset(raw, marker):
    if marker is None:
        return None
    hits = list(re.finditer(r'^' + re.escape(marker), raw, re.M))
    if len(hits) != 1:
        raise ValueError('Source excerpt boundary is not unique: ' + marker)
    return hits[0].start()


def document_for_page(page):
    return 'AGENTS.md' if page == 'charter' else 'docs/contracts/agents.' + page.removeprefix('rule-') + '.md'


def excerpts(raw, page):
    raw = raw.replace('\r\n', '\n').replace('\r', '\n')
    if page == 'charter':
        matches = list(re.finditer(r'^- (\*\*L(\d+)\b[^\n]*)(?:\n|$)', raw, re.M))
        # L numbers are selectors, not a fixed wording or word-count assertion.
        if len(matches) != 30 or {int(m[2]) for m in matches} != set(range(1, 31)):
            raise ValueError('Charter source does not contain all 30 unique articles')
        articles = {}
        for match in matches:
            # An article includes its indented body and intervening blank lines,
            # but stops at the next top-level item, heading or explanation.
            end = match.end(1); cursor = match.end()
            for line in raw[cursor:].split('\n'):
                if line.strip():
                    if not line.startswith((' ', '\t')):
                        break
                    end = cursor + len(line)
                cursor += len(line) + 1
            articles[int(match[2])] = raw[match.start(1):end]
        return [(f'charter/charter-{screen:02}', '\n\n'.join(articles[i] for i in range(first, last + 1)),
                 {'articles': [first, last], 'approved_omissions': []})
                for screen, first, last in [(2, 1, 10), (3, 11, 17), (4, 18, 23), (5, 24, 30)]]
    result = []
    relative = document_for_page(page)
    ranges = RANGES[page]
    if page == 'rule-execution-coordination':
        # E216 renamed this paragraph's opening; retain E215's exact boundary
        # for historical replay. Both openings in one source are ambiguous.
        previous = ranges[0][2]
        current = 'Claude 主持、和 GPT 协作时'
        present = [marker for marker in (previous, current)
                   if re.search(r'^' + re.escape(marker), raw, re.M)]
        if len(present) != 1:
            raise ValueError('Source excerpt boundary is not unique: ' + previous)
        ranges = [(screen, present[0] if start == previous else start,
                   present[0] if end == previous else end)
                  for screen, start, end in ranges]
    for screen, start, end in ranges:
        a = marker_offset(raw, start) if start else 0
        b = marker_offset(raw, end) if end else len(raw)
        if b <= a:
            raise ValueError('Source excerpt has reversed boundaries: ' + page)
        selected = raw[a:b].strip()
        # An omission outside this selected range cannot be applied twice.
        applied = []
        for phrase in OMISSIONS.get(relative, []):
            if phrase not in selected:
                continue
            if selected.count(phrase) != 1:
                raise ValueError('Excerpt omission is ambiguous: ' + page)
            selected = (re.sub('^' + re.escape(phrase) + r'\n?', '', selected, count=1, flags=re.M)
                        if phrase.startswith('|') else selected.replace(phrase, '', 1))
            applied.append(phrase)
        result.append((f'{page}/{page}-{screen:02}', selected,
                       {'from': start, 'to': end, 'approved_omissions': applied}))
    return result


def render_markdown(text):
    from markdown_it import MarkdownIt
    # CommonMark preserves the source's interrupting lists; tables retain their
    # explicit cell structure in the existing prose fingerprint.
    return MarkdownIt('commonmark').enable('table').render(text)


def project_original_html(text, *, keep_render_dependencies=False):
    """Project only approved source values; keep its HTML/semantic structure."""
    # The renderer inserts zero-width word-break tags into Windows literals.
    # Removing only those tags reconnects the value before its declared projection.
    text = re.sub(r'<wbr\s*/?>', '', text, flags=re.I)
    class Projection(HTMLParser):
        def __init__(self): super().__init__(convert_charrefs=True); self.parts = []
        def handle_starttag(self, tag, attrs):
            if tag=='img' and not keep_render_dependencies:return
            opening = self.get_starttag_text()
            opening = re.sub(r'((?:data-)?href=["\'])([^"\']*)(["\'])',
                lambda m: m[1] + html.escape(source_link_target(html.unescape(m[2])), quote=True) + m[3], opening)
            if not keep_render_dependencies:
                dropped={key for key,value in attrs if key in {'src','srcset','data-src','data-lazy-src','style'} and value and local_values(value)}
                if dropped:
                    opening='<'+tag+''.join(' '+key+('="'+html.escape(value,quote=True)+'"' if value is not None else '') for key,value in attrs if key not in dropped)+(' />' if opening.endswith('/>') else '>')
            self.parts.append(opening)
        def handle_startendtag(self, tag, attrs): self.handle_starttag(tag, attrs)
        def handle_endtag(self, tag): self.parts.append('</' + tag + '>')
        def handle_data(self, value):
            # Decode entities in this node only: <task-id> remains visible code,
            # never a synthetic HTML element or an extension of the path value.
            self.parts.append(html.escape(omit_local_literals(value, replacement='（本机路径）'), quote=False))
        def handle_comment(self, value): self.parts.append('<!--' + value + '-->')
    parser = Projection(); parser.feed(text); text = ''.join(parser.parts)
    if not keep_render_dependencies and local_values(text):
        raise ValueError('Local literal survived rule public projection')
    return text


def source_heading_aliases(raw):
    """Native fragments keep the source title, without replacing it by p-ids."""
    result = []
    for match in re.finditer(r'^#{1,6}\s+(.+)$', raw, re.M):
        title = re.sub(r'[*`]', '', match[1]).strip()
        slug = re.sub(r'[^\w\u4e00-\u9fff -]', '', title.lower()).replace(' ', '-')
        result.extend([title, slug])
    return list(dict.fromkeys(result))


def charter_heading_aliases(raw, first, last):
    start=raw.index('## 我的 AI 约法');end=raw.index('## 每次都要做的几件事')
    charter=raw[start:end];selected=[]
    for heading in re.finditer(r'^#{2,3}\s+.+$',charter,re.M):
        next_article=re.search(r'^- \*\*L(\d+)\b',charter[heading.end():],re.M)
        if next_article and first<=int(next_article[1])<=last:selected.append(heading[0])
    return source_heading_aliases('\n'.join(selected))


def load_pin(root):
    return json.loads((Path(root) / 'config/assembled-rules-pin.json').read_text('utf8'))


def excerpt_entry(pin, identity):
    contract = pin.get('excerpt_contract', {})
    if contract.get('id') != excerpt_contract_id(pin.get('version')):
        return None
    return contract.get('excerpts', {}).get(identity)


def excerpt_link_targets(pin, identity, raw_source):
    """Read real links only from the independently pinned source selection."""
    entry = excerpt_entry(pin, identity)
    if not entry or sha_bytes(raw_source) != entry['source_sha256']:
        raise ValueError('Source links do not bind the fixed excerpt source')
    selected = next((text, selection) for key, text, selection in
                    excerpts(raw_source.decode('utf-8-sig'), entry['page']) if key == identity)
    text, selection = selected
    projected = public_markdown(text, entry['relative_file'], apply_omissions=False)
    if selection != entry['selection'] or sha_bytes(projected.encode('utf8')) != entry['markdown_sha256']:
        raise ValueError('Source links differ from the fixed excerpt selection/display digest')
    class Links(HTMLParser):
        def __init__(self): super().__init__(convert_charrefs=True); self.targets = set()
        def handle_starttag(self, tag, attrs):
            href = dict(attrs).get('href')
            if tag == 'a' and href: self.targets.add(source_link_target(href))
    links = Links(); links.feed(render_markdown(projected))
    return links.targets


def canonical_plain(text):
    class Plain(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=True)
            self.words = []
        def handle_data(self, value):
            self.words.append(value)
    parser = Plain(); parser.feed(text)
    return ' '.join(''.join(parser.words).split())


def json_string_spans(body, origin=0):
    """Bind raw serialized string spans to their exact JSON field identities."""
    decoded = json.loads(body); expected = []
    def walk(value, pointer):
        if isinstance(value, dict):
            for key, item in value.items():
                expected.append((pointer + ('<key>', key), key))
                walk(item, pointer + (key,))
        elif isinstance(value, list):
            for index, item in enumerate(value):
                walk(item, pointer + (index,))
        elif isinstance(value, str):
            expected.append((pointer, value))
    walk(decoded, ())
    tokens = list(re.finditer(r'"(?:\\.|[^"\\])*"', body, re.S))
    if len(tokens) != len(expected):
        return []
    result = []
    for token, (pointer, value) in zip(tokens, expected):
        if json.loads(token[0]) != value:
            return []
        result.append((pointer, value, origin + token.start(), origin + token.end()))
    return result


def source_text_spans(text):
    """Return only text nodes actually included in the source prose fingerprint."""
    offsets = [0] + [match.end() for match in re.finditer('\n', text)]
    class Text(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=False); self.stack = []; self.spans = []; self.markup = []
        def at(self):
            line, column = self.getpos(); return offsets[line - 1] + column
        def handle_starttag(self, tag, attrs):
            attributes = dict(attrs)
            parent = self.stack[-1] if self.stack else ('', {}, False, False)
            active = parent[2] or source_root(tag, attributes, ((t, a) for t, a, _, _ in self.stack))
            skip = parent[3] or source_node_excluded(attributes)
            if active and not skip:
                opening = self.get_starttag_text()
                self.markup.append(source_root_opening(tag, attrs, opening) if not parent[2] else opening)
            if tag not in HTML_VOID_TAGS:
                self.stack.append((tag, attributes, active, skip))
        def handle_startendtag(self, tag, attrs):
            self.handle_starttag(tag, attrs)
            if tag not in HTML_VOID_TAGS: self.handle_endtag(tag)
        def handle_endtag(self, tag):
            for index in range(len(self.stack) - 1, -1, -1):
                if self.stack[index][0] == tag:
                    _, _, active, skip = self.stack[index]
                    if active and not skip: self.markup.append('</' + tag + '>')
                    del self.stack[index:]; break
        def node(self, raw):
            if self.stack and self.stack[-1][2] and not self.stack[-1][3]:
                self.spans.append((self.at(), self.at() + len(raw))); self.markup.append(raw)
        def handle_data(self, value): self.node(value)
        def handle_entityref(self, name): self.node('&' + name + ';')
        def handle_charref(self, name): self.node('&#' + name + ';')
    parser = Text(); parser.feed(text)
    return parser.spans, ''.join(parser.markup)


def encoded_json_spans(token, decoded, spans, origin):
    """Map decoded source text nodes back into this exact serialized JSON token."""
    index = 1; cursor = 0; boundaries = [1]
    while index < len(token) - 1:
        length = 1
        if token[index] == '\\':
            length = 6 if token[index + 1] == 'u' else 2
            if length == 6 and 0xD800 <= int(token[index + 2:index + 6], 16) <= 0xDBFF and token[index + 6:index + 8] == '\\u':
                length = 12
        fragment = token[index:index + length]
        value = json.loads('"' + fragment + '"')
        if decoded[cursor:cursor + len(value)] != value: return []
        index += length; cursor += len(value)
        boundaries.extend([index] * len(value))
    if cursor != len(decoded): return []
    return [(origin + boundaries[start], origin + boundaries[end]) for start, end in spans]


WORKBENCH_SCHEMA = 'wly.rule-original-workbench.v1'


def _workbench_module(name, filename):
    """Use the existing semantic/transcript consumer rather than a new digest."""
    import importlib.util
    import sys
    key = 'rule_original_' + name
    if key not in sys.modules:
        spec = importlib.util.spec_from_file_location(key, Path(__file__).with_name(filename))
        value = importlib.util.module_from_spec(spec); spec.loader.exec_module(value)
        sys.modules[key] = value
    return sys.modules[key]


def _workbench_dom(text):
    """Read actual image/transcript nodes, never JSON strings containing HTML."""
    class Facts(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=True)
            self.stack = []; self.ids = set(); self.screens = {}; self.hrefs = set()
        def handle_starttag(self, tag, attrs):
            a = dict(attrs)
            if a.get('id'): self.ids.add(a['id'])
            if tag == 'a' and a.get('href'): self.hrefs.add(a['href'])
            owner = next((x[1].get('data-rule-excerpt') for x in reversed(self.stack)
                          if x[1].get('data-rule-excerpt')), None)
            if a.get('data-rule-excerpt'):
                owner = a['data-rule-excerpt']
                self.screens[owner] = {'id': a.get('id'), 'images': set(), 'transcript': []}
            if owner and tag == 'img':
                self.screens[owner]['images'].add(a.get('src') or a.get('data-src'))
            if tag not in {'br', 'hr', 'img', 'input', 'link', 'meta', 'source', 'wbr'}:
                self.stack.append((tag, a))
        def handle_endtag(self, tag):
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]; break
        def handle_data(self, value):
            owner = next((a.get('data-rule-excerpt') for _, a in reversed(self.stack)
                          if a.get('data-rule-excerpt')), None)
            if owner and any(a.get('data-rule-original-text') == owner for _, a in self.stack):
                self.screens[owner]['transcript'].append(value)
    parser = Facts(); parser.feed(text)
    return parser


def parse_workbench_metadata(text, pin=None):
    """Return only complete, substantive source bindings present in the real DOM."""
    match = re.search(r'<script\b[^>]*\bid=["\']rule-workbench-data["\'][^>]*>(.*?)</script>', text, re.S)
    if not match: return None
    pin = pin or load_pin(Path(__file__).resolve().parents[1])
    data = json.loads(match[1]); dom = _workbench_dom(text)
    if data.get('schema') != WORKBENCH_SCHEMA or data.get('version') != pin['version']:
        raise ValueError('Rule original workbench version/schema differs from fixed pin')
    rows = data.get('screens', [])
    expected = pin['excerpt_contract']['excerpts']
    if len(rows) != len(expected) or {r.get('source_meta', {}).get('excerpt_id') for r in rows} != set(expected):
        raise ValueError('Rule original workbench must contain every fixed source excerpt once')
    topics = data.get('topics', [])
    if len(topics) != len(pin['documents']) or {t.get('relative_file') for t in topics} != set(pin['documents']):
        raise ValueError('Rule original workbench must contain all complete fixed source topics')
    builder = _workbench_module('prose_gate', 'build-assembled-site.py')
    publication = _workbench_module('transcript_gate', 'audit-page-publication.py')
    for topic in topics:
        document = pin['documents'][topic['relative_file']]
        source = topic.get('src')
        if (source not in dom.hrefs or topic.get('public_source_sha256') != document['public_source_sha256']
                or pin['public_source_resources'].get(source, {}).get('relative_file') != topic['relative_file']
                or 'rule-panel-' + topic['logical_id'] not in dom.ids
                or 'rule-tab-' + topic['logical_id'] not in dom.ids):
            raise ValueError('Rule topic lacks its actual full-source reading link: ' + topic['page'])
    for row in rows:
        meta = row.get('source_meta', {}); identity = meta['excerpt_id']; excerpt = expected[identity]
        actual = dom.screens.get(identity); original = meta.get('original_html', '')
        spans, substantive = source_text_spans(original)
        topic = next(t for t in topics if t['relative_file'] == excerpt['relative_file'])
        if (row.get('id') != excerpt['screen'] or row.get('shape') != 'source_text'
                or row.get('render_mode') != 'typeset' or meta.get('version') != pin['version']
                or meta.get('relative_file') != excerpt['relative_file']
                or meta.get('source_sha256') != excerpt['source_sha256']
                or meta.get('src') != topic['src'] or meta.get('public_source_sha256') != topic['public_source_sha256']
                or meta.get('public_projection_sha256') != data.get('projection_sha256')
                or meta.get('excerpt_contract') != excerpt_contract_id(pin['version']) or not spans or len(canonical_plain(substantive)) < 100
                or meta.get('omitted_count') != excerpt['approved_omitted_count']
                or builder.typeset_prose_digest(original) != excerpt['rendered_text_sha256']
                or not actual or actual['id'] != row['id'] or not actual['transcript']
                or {p.get('src') for p in row.get('parts', [])} != actual['images']
                or {p.get('orientation') for p in row.get('parts', [])} != {'h', 'v'}):
            raise ValueError('Rule excerpt lacks substantive same-screen original DOM: ' + identity)
        if sha_bytes(' '.join(''.join(actual['transcript']).split()).encode('utf8')) != row.get('transcript_sha256'):
            raise ValueError('Rule excerpt actual transcript differs from its binding: ' + identity)
        if ' '.join(''.join(actual['transcript']).split()) != ' '.join(publication.rendered_text('<body>' + original + '</body>').split()):
            raise ValueError('Rule excerpt DOM text is not its fixed original: ' + identity)
    return data


def rule_original_fallback(ref, mapping, pages):
    """Exact same-excerpt fallback; missing/placeholder workbenches never resolve."""
    facts = pages.get('rules/index.html')
    data = getattr(facts, 'rule_workbench_metadata', None) if facts else None
    if not data: return None
    identity = mapping.get('excerpt_id')
    row = next((r for r in data['screens'] if r['source_meta']['excerpt_id'] == identity), None)
    if not row or row['id'] not in facts.ids: return None
    topic = next(t for t in data['topics'] if t['relative_file'] == row['source_meta']['relative_file'])
    return '/rules/?rule=' + topic['logical_id'] + '#' + row['id']


def rule_topic_original_fallback(ref, pages):
    """Preserve a missing topic route's owning original and native heading."""
    from urllib.parse import urlsplit
    facts = pages.get('rules/index.html')
    data = getattr(facts, 'rule_workbench_metadata', None) if facts else None
    if not data: return None
    parsed = urlsplit(ref)
    if not parsed.path.startswith('/rules/'): return None
    slug = parsed.path.strip('/').removeprefix('rules/')
    topic = next((t for t in data['topics'] if ('charter' if t['page'] == 'charter'
                 else t['page'].removeprefix('rule-')) == slug), None)
    if not topic: return None
    pin = load_pin(Path(__file__).resolve().parents[1])
    fragment = unquote(parsed.fragment)
    rows = [r for r in data['screens'] if r['source_meta']['relative_file'] == topic['relative_file']]
    row = next((r for r in rows if fragment == r['id'] or fragment in
                pin['excerpt_contract']['excerpts'][r['source_meta']['excerpt_id']].get('heading_aliases', [])), rows[0])
    return '/rules/?rule=' + topic['logical_id'] + '#' + row['id'] if row['id'] in facts.ids else None


def validate_rule_workbench(site_root, pin=None):
    """Consumer gate: all 11 full sources and all 38 DOM/image/body bindings."""
    from importlib.util import spec_from_file_location, module_from_spec
    root = Path(site_root); pin = pin or load_pin(Path(__file__).resolve().parents[1])
    result = {'seen_documents': [], 'seen_excerpts': [], 'findings': []}
    if not (root/'rules/index.html').is_file():return result
    try:
        text = (root / 'rules/index.html').read_text('utf8')
        data = parse_workbench_metadata(text, pin)
        if not data: return result
        if data.get('pin_sha256') != sha_bytes((Path(__file__).resolve().parents[1] / 'config/assembled-rules-pin.json').read_bytes()):
            raise ValueError('Workbench fixed source pin SHA differs')
        dom = _workbench_dom(text)
        spec = spec_from_file_location('workbench_prose_gate', Path(__file__).with_name('build-assembled-site.py'))
        builder = module_from_spec(spec); spec.loader.exec_module(builder)
        spec = spec_from_file_location('workbench_transcript_gate', Path(__file__).with_name('audit-page-publication.py'))
        publication = module_from_spec(spec); spec.loader.exec_module(publication)
        for topic in data['topics']:
            source = root / topic['src'].lstrip('/')
            if not source.is_file() or sha_bytes(source.read_bytes()) != topic['public_source_sha256']:
                raise ValueError('Workbench complete public source SHA differs: ' + topic['page'])
        for row in data['screens']:
            meta = row['source_meta']; expected = pin['excerpt_contract']['excerpts'][meta['excerpt_id']]
            if (builder.typeset_prose_digest(meta['original_html']) != expected['rendered_text_sha256']
                    or meta.get('omitted_count') != expected['approved_omitted_count']):
                raise ValueError('Workbench source excerpt text/range differs: ' + meta['excerpt_id'])
            actual = ' '.join(''.join(dom.screens[meta['excerpt_id']]['transcript']).split())
            expected_text = ' '.join(publication.rendered_text('<body>' + meta['original_html'] + '</body>').split())
            if actual != expected_text:
                raise ValueError('Workbench DOM text is not its pinned substantive original: ' + meta['excerpt_id'])
            for part in row['parts']:
                resource = root / part['src'].lstrip('/')
                if not resource.is_file() or sha_bytes(resource.read_bytes()) != part['sha256']:
                    raise ValueError('Workbench original image SHA differs: ' + part['src'])
        result.update(seen_documents=[t['relative_file'] for t in data['topics']],
                      seen_excerpts=[r['source_meta']['excerpt_id'] for r in data['screens']])
    except (OSError, ValueError, KeyError, TypeError) as error:
        result['findings'].append({'file': 'rules/index.html', 'type': 'rule_original_workbench_invalid', 'reason': str(error)})
    return result

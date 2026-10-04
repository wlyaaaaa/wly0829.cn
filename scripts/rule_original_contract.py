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

CONTRACT = 'e214-original-ranges-v1'
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
        articles = {int(m[2]): m[1] for m in matches}
        # L numbers are selectors, not a fixed wording or word-count assertion.
        if len(matches) != 30 or set(articles) != set(range(1, 31)):
            raise ValueError('Charter source does not contain all 30 unique articles')
        return [(f'charter/charter-{screen:02}', '\n\n'.join(articles[i] for i in range(first, last + 1)),
                 {'articles': [first, last], 'approved_omissions': []})
                for screen, first, last in [(2, 1, 10), (3, 11, 17), (4, 18, 23), (5, 24, 30)]]
    result = []
    relative = document_for_page(page)
    for screen, start, end in RANGES[page]:
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
    if contract.get('id') != CONTRACT:
        return None
    return contract.get('excerpts', {}).get(identity)


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
            attributes = dict(attrs); classes = set(attributes.get('class', '').split())
            parent = self.stack[-1] if self.stack else ('', False, False)
            active = parent[1] or bool(classes & {'ct-source-body', 'source-prose'})
            skip = parent[2] or 'source-extra' in classes or ('table-label' in classes and 'data-echo' in attributes)
            if active and not skip: self.markup.append(self.get_starttag_text())
            if tag not in {'br', 'hr', 'img', 'input', 'link', 'meta', 'source', 'wbr'}:
                self.stack.append((tag, active, skip))
        def handle_endtag(self, tag):
            for index in range(len(self.stack) - 1, -1, -1):
                if self.stack[index][0] == tag:
                    _, active, skip = self.stack[index]
                    if active and not skip: self.markup.append('</' + tag + '>')
                    del self.stack[index:]; break
        def node(self, raw):
            if self.stack and self.stack[-1][1] and not self.stack[-1][2]:
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

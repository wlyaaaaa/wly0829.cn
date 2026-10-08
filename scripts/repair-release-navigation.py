"""Repair navigation against the actual mixed release; never deploy or alter its manifest."""
from __future__ import annotations
import argparse
import hashlib
import html
import importlib.util
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote, urlencode

PAGE_DATA = re.compile(r'(<script\b[^>]*\bid="page-data"[^>]*>)(.*?)(</script>)', re.S)
ALIASES = {
    '/projects/codex-local-remote/': '/projects/codex-remote/',
    '/projects/github-local-index/': '/projects/github-index/',
}
RULE_TOPICS = {
    'charter': 'agents_root_rules', 'authorization': 'authorization_contract',
    'capabilities-runtime': 'capabilities_runtime_contract',
    'claude-adapter': 'claude_adapter_contract',
    'codex-adapter': 'codex_adapter_contract', 'context-sources': 'context_sources_contract',
    'engineering-delivery': 'engineering_delivery_contract',
    'execution-coordination': 'execution_coordination_contract',
    'privacy-data': 'privacy_data_contract', 'protected-actions': 'protected_actions_contract',
    'rule-release': 'rule_release_contract',
}
PRIVATE_REPOS = {'github.com/wlyaaaaa/github-local-index', 'github.com/wlyaaaaa/llm-backend-toolkit'}
HOST_CAPABILITIES = {'/#system-node-documents-skill': '/skills/#skill-documents',
                     '/#system-node-pdf-skill': '/skills/#skill-pdf',
                     '/#grafana-status': '/cockpit/#grafana'}
PUBLIC_SEARCH_FIELDS = ('type', 'group', 'scopes', 'projectSlug', 'title', 'detail', 'href', 'aliases', 'search')
SITE_NAVIGATION = {'首页':'/', '怎么协作':'/how/', '驾驶舱':'/cockpit/',
                   '项目':'/projects/', '技能':'/skills/', '规则':'/rules/',
                   '连接电脑':'/mcp/', '授权与状态':'/computer-access/',
                   '这个网页是怎么做的':'/how-this-site/', '救急先看':'/rescue/'}
_public_spec = importlib.util.spec_from_file_location('public_page_contract', Path(__file__).with_name('public_page_contract.py'))
public_contract = importlib.util.module_from_spec(_public_spec)
_public_spec.loader.exec_module(public_contract)
if str(Path(__file__).resolve().parent)not in sys.path:sys.path.insert(0,str(Path(__file__).resolve().parent))
_rule_spec=importlib.util.spec_from_file_location('navigation_rule_original_contract',Path(__file__).with_name('rule_original_contract.py'))
rule_contract=importlib.util.module_from_spec(_rule_spec);_rule_spec.loader.exec_module(rule_contract)
RULE_MAPPING_PATH=Path(__file__).resolve().parents[1]/'config/rule-navigation-mappings.json'
RULE_REFERENCE_MAPPINGS=json.loads(RULE_MAPPING_PATH.read_text('utf8')).get('entries',{}) if RULE_MAPPING_PATH.is_file() else {}


def public_search_text(value):
    if isinstance(value, dict): return {key: public_search_text(item) for key, item in value.items()}
    if isinstance(value, list): return [public_search_text(item) for item in value]
    if isinstance(value, str): return public_contract.omit_local_literals(value, replacement='（本机路径）')
    return value


def route_file(url):
    rel = unquote(urlsplit(url).path).lstrip('/')
    if '..' in Path(rel).parts or '\\' in rel:
        raise ValueError('Invalid local route')
    return rel + ('index.html' if not rel or rel.endswith('/') else '/index.html' if not Path(rel).suffix else '')


def file_route(rel):
    return '/' if rel == 'index.html' else '/' + rel[:-10] if rel.endswith('/index.html') else '/' + rel


def normalize_path(path):
    return path if path == '/' or Path(path).suffix else path.rstrip('/') + '/'


class PageFacts(HTMLParser):
    def __init__(self, text, site_root=None, rule_pin=None):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.title = ''
        self._document_title_seen = False
        self._document_title_active = False
        self.description = ''
        self.transcripts = {}
        self.headings = []
        self.stack = []
        self.rule_workbench_metadata=rule_contract.parse_workbench_metadata(text,pin=rule_pin,site_root=site_root)
        self.feed(text)
        self.title = re.sub(r'[\t\n\f\r ]+', ' ', self.title).strip(' \t\n\f\r')
        match = PAGE_DATA.search(text)
        self.page_data = json.loads(match[2]) if match else {}
        # The existing app creates this dialog and handles its hash on project
        # pages. Its runtime target is as real as a statically rendered anchor.
        if self.page_data.get('kind') in {'project', 'frozen'}:
            self.ids.add('ai-brief')

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title' and self.stack and self.stack[-1][0] == 'head' and not self._document_title_seen:
            self._document_title_seen = self._document_title_active = True
        if a.get('id'): self.ids.add(a['id'])
        if tag == 'meta' and a.get('name') == 'description': self.description = a.get('content', '')
        if tag in {'meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'wbr'}: return
        self.stack.append((tag, a))

    def handle_endtag(self, tag):
        if tag == 'title' and self._document_title_active:
            self._document_title_active = False
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        if self._document_title_active: self.title += data
        if not data.strip(): return
        for _, a in self.stack:
            if a.get('data-screen-transcript'):
                self.transcripts.setdefault(a['data-screen-transcript'], []).append(data)
                break


def page_inventory(root, rule_pin=None, exclude=()):
    return {p.relative_to(root).as_posix(): PageFacts(p.read_text('utf-8-sig'),root,rule_pin) for p in root.rglob('*.html') if p.relative_to(root).as_posix() not in exclude}


def local_url(ref):
    parts = urlsplit(html.unescape(ref))
    if parts.netloc and parts.hostname not in {'wly0829.cn', 'www.wly0829.cn'}: return None
    if parts.scheme and parts.scheme not in {'http', 'https'}: return None
    if not parts.path.startswith('/'): return None
    return parts


def target_exists(ref, pages):
    parts = local_url(ref)
    if parts is None: return False
    facts = pages.get(route_file(ref))
    return bool(facts and (not parts.fragment or unquote(parts.fragment) in facts.ids))


def resolve_navigation(ref, pages):
    """Prefer the original page/anchor, then a verified alias/topic, then its nearest live parent."""
    parts = local_url(ref)
    if parts is None: return ref
    canonical = normalize_path(parts.path) + ('?' + parts.query if parts.query else '') + ('#' + parts.fragment if parts.fragment else '')
    mapping=RULE_REFERENCE_MAPPINGS.get(canonical)
    if mapping:
        if target_exists(mapping['target'],pages):return mapping['target']
        fallback=rule_contract.rule_original_fallback(canonical,mapping,pages)
        if fallback and target_exists(fallback,pages):return fallback
        raise ValueError('Mapped rule original screen is unavailable: '+mapping['target'])
    if target_exists(canonical, pages): return canonical
    if canonical in HOST_CAPABILITIES and target_exists(HOST_CAPABILITIES[canonical], pages):
        return HOST_CAPABILITIES[canonical]
    alias = ALIASES.get(normalize_path(parts.path))
    if alias:
        full = alias + ('?' + parts.query if parts.query else '') + ('#' + parts.fragment if parts.fragment else '')
        if target_exists(full, pages): return full
        if target_exists(alias, pages): return alias
    original_topic=rule_contract.rule_topic_original_fallback(canonical,pages)
    if original_topic and target_exists(original_topic,pages):return original_topic
    topic = RULE_TOPICS.get(parts.path.strip('/').removeprefix('rules/')) if parts.path.startswith('/rules/') else None
    if topic:
        existing = '/rules/?' + urlencode({'rule': topic}) + '#rule-panel-' + topic
        if target_exists(existing, pages): return existing
    current = Path(route_file(canonical)).parent
    while True:
        route = file_route((current / 'index.html').as_posix())
        if target_exists(route, pages): return route
        if current == Path('.'): raise ValueError('No published navigation parent for ' + ref)
        current = current.parent


def visit(value):
    if isinstance(value, dict):
        yield value
        for key,child in value.items():
            if key!='source_meta':yield from visit(child)
    elif isinstance(value, list):
        for child in value: yield from visit(child)


def patch_history_runtime(text):
    if 'wlyHistoryHash' in text or 'historyRestoration' in text: return text
    pattern = re.compile(r'function (\w+)\(\)\{let\{id:(\w+),target:(\w+)\}=(\w+)\(\),(\w+)=(\w+)\(\2\);window\.location\.hash&&window\.requestAnimationFrame\(\(\)=>(\w+)\(\3\|\|\5\)\)\}window\.addEventListener\(`popstate`,\1\),window\.addEventListener\(`hashchange`,\1\),window\.addEventListener\(`pageshow`,(\w+)=>\{\8\.persisted&&\1\(\)\}\),\1\(\)')
    match = pattern.search(text)
    if not match:
        if 'projectReadingTab' in text and 'pageshow' in text:
            raise ValueError('Unsupported old reading runtime; rebuild static-site/main.jsx instead')
        return text
    fn, layer, target, locate, panel, show, reveal, event = match.groups()
    new = (f'function {fn}(scroll=true){{let{{id:{layer},target:{target}}}={locate}(),{panel}={show}({layer});'
           f'scroll&&window.location.hash&&window.requestAnimationFrame(()=>{reveal}({target}||{panel}))}}'
           f'let wlyHistoryHash=null;window.addEventListener(`popstate`,()=>{{wlyHistoryHash=window.location.hash;{fn}(false)}}),'
           f'window.addEventListener(`hashchange`,()=>{{let fromHistory=wlyHistoryHash===window.location.hash;wlyHistoryHash=null;{fn}(!fromHistory)}}),'
           f'window.addEventListener(`pageshow`,{event}=>{{{event}.persisted&&{fn}(false)}}),'
           f'{fn}(performance.getEntriesByType(`navigation`)[0]?.type!==`back_forward`)')
    return text[:match.start()] + new + text[match.end():]


def patch_viewer_runtime(text):
    for selector in ('.screen picture,.screen .overlays', '.screen picture,.screen .hotspot,.raster-card'):
        original = "e.target.closest('" + selector + "')"
        replacement = "(e.target instanceof Element?e.target:e.target?.parentElement)?.closest('" + selector + "')"
        text = text.replace(original, replacement)
    return text


def add_skill_card_ids(text):
    def replace(match):
        tag = match[0]
        href = re.search(r'\bhref=["\']([^"\']+)["\']', tag)
        if not href or re.search(r'\bid=', tag): return tag
        slug = href[1].strip('/').removeprefix('skills/')
        return tag[:-1] + ' id="skill-' + html.escape(slug, quote=True) + '">'
    return re.sub(r'<a\b[^>]*\bclass="skill-directory-item"[^>]*>', replace, text)


def remove_private_links(text):
    def replace(match):
        a = match[1]
        href = re.search(r'\bhref=["\']([^"\']+)["\']', a)
        if not href or urlsplit(html.unescape(href[1])).netloc + urlsplit(html.unescape(href[1])).path.rstrip('/') not in PRIVATE_REPOS:
            return match[0]
        # Keep the exact displayed introduction, icon and label as ordinary text.
        attrs = re.sub(r'\s+(?:href|target|rel)=["\'][^"\']*["\']', '', a)
        body = match[2].replace('公开仓库', '私有仓库') if 'project-visibility' in attrs else match[2]
        return '<span' + attrs + '>' + body + '</span>'
    text = re.sub(r'<a(\s[^>]*?)>(.*?)</a>', replace, text, flags=re.S)
    for repo in PRIVATE_REPOS:
        text = re.sub(r'("(?:repositoryUrl|repo_url)"\s*:\s*")https://' + re.escape(repo) + r'/?(")', r'\1\2', text)
    return text


def replace_data(text, data):
    match = PAGE_DATA.search(text)
    value = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    return text[:match.start(2)] + value + text[match.end(2):]


def rule_neighbors(route, pages):
    """Use one topic order for both directions, with actual page-owned titles."""
    ordered = ['/rules/' + topic + '/' for topic in RULE_TOPICS
               if route_file('/rules/' + topic + '/') in pages]
    if route not in ordered: return None
    index = ordered.index(route); result = {}
    for side, offset in (('previous', -1), ('next', 1)):
        neighbor = index + offset
        if 0 <= neighbor < len(ordered):
            href = ordered[neighbor]; facts = pages[route_file(href)]
            result[side] = {'href': href, 'title': facts.page_data.get('title') or facts.title}
    return result


def compact_home_highlights(text, data):
    """手机复用原图：保留竖版数字区，六张短卡各用横版原图全宽显示。"""
    if 'data-home-compact' in text: return text
    screen = next((s for s in data.get('screens', []) if s.get('id') == 'home-04'), None)
    if not screen or len(screen['layouts']['h'].get('cards', [])) != 7: return text
    h, v = screen['layouts']['h'], screen['layouts']['v']
    def image(layout):
        w, height = layout['size']; src = html.escape(layout['viewer'].get('avif') or layout['viewer']['src'], quote=True)
        return f'<image href="{src}" width="{w}" height="{height}"/>'
    header_height = round(v['cards'][1][1] * v['size'][1])
    cards = [f'<svg viewBox="0 0 {v["size"][0]} {header_height}" aria-hidden="true">{image(v)}</svg>']
    for rect, link in zip(h['cards'][1:], h['links']):
        x, y, w, height = [round(n * h['size'][i % 2], 2) for i, n in enumerate(rect)]
        label, href = html.escape(link['text'], quote=True), html.escape(link['href'], quote=True)
        cards.append(f'<a href="{href}" aria-label="{label}"><svg viewBox="{x} {y} {w} {height}" aria-hidden="true">{image(h)}</svg></a>')
    markup = '<div class="home-compact" data-home-compact="1">' + ''.join(cards) + '</div>'
    text = re.sub(r'(<section\b[^>]*id="home-04"[^>]*>)', lambda m: m[0] + markup, text, count=1)
    css = '.home-compact{display:none}@media(orientation:portrait){#home-04{aspect-ratio:auto!important;height:auto!important}#home-04>picture,#home-04>.overlays{display:none}.home-compact{display:grid;gap:12px;padding:0 10px 12px}.home-compact svg{display:block;width:100%;height:auto}.home-compact a{display:block;border-radius:14px;overflow:hidden}.home-compact a:focus-visible{outline:2px solid #0a7232;outline-offset:3px}}'
    return text.replace('</head>', '<style data-home-compact>' + css + '</style></head>')


def repair_owned_navigation(text, pages, owner_route=None):
    """Bind existing navigation roles; keep artwork, copy and unrelated links exact."""
    changes = []
    match = PAGE_DATA.search(text)
    if match:
        data = json.loads(match[2]); route = owner_route or data.get('url')
        if data.get('page') == 'home':
            if len(data.get('screens',[]))>1 and re.search(r'<section\b[^>]*id="home-04"',text):
                if data['screens'][1]['id'] != 'home-02': changes.append({'role':'home-reading-order'})
                data['screens'].sort(key=lambda s: ['home-01', 'home-02', 'home-03', 'home-04', 'home-05'].index(s['id']))
                outcomes = re.search(r'(?:<div\b[^>]*class="section-anchor"[^>]*></div>)?<section\b[^>]*id="home-04"[^>]*>[\s\S]*?</section>', text)[0]
                text = text.replace(outcomes, '', 1)
                text = re.sub(r'(<section\b[^>]*id="home-03"[^>]*>[\s\S]*?</section>)', lambda m: m[0] + outcomes, text, count=1)
                text = compact_home_highlights(text, data)
                seen = set()
                for screen in data['screens']:
                    section = screen.get('section')
                    if not section or section in seen: continue
                    seen.add(section)
                    marker = re.search(r'<div\b[^>]*class="section-anchor"[^>]*id="' + re.escape(section) + r'"[^>]*></div>', text)
                    if marker:
                        text = text.replace(marker[0], '', 1)
                        text = re.sub(r'(?=<section\b[^>]*id="' + re.escape(screen['id']) + r'")', lambda m: marker[0], text, count=1)
            targets = {'home-01-link-1-0':'/how/', 'home-01-link-2-0':'/cockpit/', 'home-03-link-5-0':'/how/#case-trip', 'home-05-link-3-0':'/how/', 'home-02-link-0-0':'/projects/remote-control/'}
            targets.update({'home-05-link-4-0':'/cockpit/', 'home-05-link-5-0':'/how-this-site/', 'home-05-link-6-0':'/rescue/'})
            for node in visit(data):
                target = targets.get(node.get('main_id') or node.get('id'))
                if target and 'href' in node and target_exists(target, pages):
                    if node['href'] != target:
                        changes.append({'role':node['id'], 'before':node['href'], 'after':target})
                        node['href'] = target
                    if 'original_href' in node and node['original_href'] != target:
                        changes.append({'role':node['id']+':original', 'before':node['original_href'], 'after':target})
                        node['original_href'] = target
        neighbors = rule_neighbors(route, pages) if route else None
        if neighbors is not None and data.get('neighbors') != neighbors:
            changes.append({'role':'rule-neighbors', 'before':data.get('neighbors'), 'after':neighbors})
            data['neighbors'] = neighbors
        if changes: text = replace_data(text, data)
    else:
        route = owner_route
    offsets = [0] + [m.end() for m in re.finditer('\n', text)]
    class NativeNavigation(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=True); self.stack = []; self.anchor = None; self.edits = []
        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            classes = attrs.get('class', '').split()
            role = ('header' if tag == 'header' and (attrs.get('id') == 'site-header' or 'site-header' in classes) else
                    'footer' if tag == 'footer' and 'site-footer' in classes else
                    'menu' if tag == 'dialog' and attrs.get('id') == 'menu' else
                    self.stack[-1][1] if self.stack else None)
            if tag == 'a' and role:
                line, column = self.getpos()
                self.anchor = {'start':offsets[line-1]+column, 'tag':self.get_starttag_text(),
                               'role':role, 'label':attrs.get('aria-label', ''), 'text':[]}
            if self.anchor:
                label = attrs.get('data-label-text') or (attrs.get('alt') if tag == 'img' else None)
                if label: self.anchor['label'] = label
            if tag not in rule_contract.HTML_VOID_TAGS: self.stack.append((tag, role))
        def handle_data(self, value):
            if self.anchor: self.anchor['text'].append(value)
        def handle_endtag(self, tag):
            if tag == 'a' and self.anchor:
                anchor = self.anchor; self.anchor = None
                label = anchor['label'] or ''.join(anchor['text']).strip()
                target = SITE_NAVIGATION.get(label)
                href = re.search(r'(?<![-\w])href=["\']([^"\']*)["\']', anchor['tag'])
                if target and href and target_exists(target, pages):
                    opening = anchor['tag']; before = html.unescape(href[1])
                    opening = opening[:href.start(1)] + html.escape(target, quote=True) + opening[href.end(1):]
                    current = re.search(r'\s+aria-current=["\']([^"\']*)["\']', opening)
                    if current and (route != target or current[1] != 'page'):
                        opening = opening[:current.start()] + opening[current.end():]
                    if route == target and not (current and current[1] == 'page'):
                        opening = opening[:-1] + ' aria-current="page">'
                    if opening != anchor['tag']:
                        self.edits.append((anchor['start'], anchor['start']+len(anchor['tag']), opening))
                        changes.append({'role':anchor['role'], 'label':label, 'before':before, 'after':target})
            for index in range(len(self.stack)-1, -1, -1):
                if self.stack[index][0] == tag: del self.stack[index:]; break
    parser = NativeNavigation(); parser.feed(text)
    for start, end, opening in reversed(parser.edits): text = text[:start] + opening + text[end:]
    return text, changes


def repair_html(root, pages, manifest):
    changed, resolved, pending = [], [], []
    mappings = manifest.get('temporary_href_mappings', [])
    for rel in sorted(pages):
        if rel == 'index.html': continue  # The homepage belongs to the release integrator.
        path = root / rel
        original_text = path.read_text('utf-8-sig')
        text = add_skill_card_ids(original_text) if rel == 'skills/index.html' else original_text
        text = remove_private_links(text)
        for original, replacement in HOST_CAPABILITIES.items():
            if target_exists(replacement, pages): text = text.replace('href="' + original + '"', 'href="' + replacement + '"')
        match = PAGE_DATA.search(text)
        if match:
            data = json.loads(match[2])
            for node in visit(data):
                source = node.get('original_href')
                if source and 'href' in node:
                    if node['href'] == source and not source.startswith('/rules/') and source not in ALIASES and source not in HOST_CAPABILITIES:
                        continue  # Application hashes may trigger a copy action rather than native navigation.
                    destination = resolve_navigation(source, pages)
                    if node['href'] != destination:
                        resolved.append({'page': file_route(rel), 'original_href': source, 'href': destination})
                        node['href'] = destination
                    if source != destination:
                        pending.append({'page': file_route(rel), 'original_href': source, 'temporary_href': destination})
            for node in data.get('neighbors', {}).values():
                if not isinstance(node, dict) or not node.get('href'): continue
                candidates = {x['original_href'] for x in mappings if x['page'] == file_route(rel)
                              and x['temporary_href'] == node['href'] and x['original_href'].startswith(('/projects/', '/skills/'))}
                # A published title disambiguates multiple temporary links on the same page.
                candidates = {x for x in candidates if pages.get(route_file(resolve_navigation(x, pages)))
                              and node.get('title') in {pages[route_file(resolve_navigation(x, pages))].title,
                                                     'GitHub 项目总索引' if '/github-' in x else '',
                                                     'Codex 远程' if 'codex-' in x else ''}}
                if not candidates and node['href'] in {'/projects/', '/skills/'}:
                    candidates = {file_route(rel2) for rel2, facts in pages.items()
                                  if facts.title == node.get('title') and file_route(rel2).startswith(node['href'])}
                if len(candidates) == 1:
                    source = candidates.pop()
                    node['original_href'] = source
                    destination = resolve_navigation(source, pages)
                    if node['href'] != destination:
                        resolved.append({'page': file_route(rel), 'original_href': source, 'href': destination})
                        node['href'] = destination
            text = replace_data(text, data)
        if text != original_text:
            path.write_text(text, encoding='utf8')
            changed.append(rel)
    return changed, resolved, pending


def restore_pending_html(text, pages):
    """Restore exact targets when available; retain pending mappings for later generations."""
    match = PAGE_DATA.search(text)
    restored = False
    data = json.loads(match[2]) if match else None
    for node in visit(data):
        source = node.get('original_href')
        current=node.get('href')
        precise_source=bool(source and urlsplit(source).fragment and target_exists(source,pages))
        mapped_current=RULE_REFERENCE_MAPPINGS.get(current)
        mapped_source=RULE_REFERENCE_MAPPINGS.get(source)
        destination=(source if precise_source else resolve_navigation(current,pages) if mapped_current and (target_exists(mapped_current['target'],pages)or rule_contract.rule_original_fallback(current,mapped_current,pages)) else
                     resolve_navigation(source,pages) if mapped_source and (target_exists(mapped_source['target'],pages)or rule_contract.rule_original_fallback(source,mapped_source,pages)) else
                     resolve_navigation(source,pages) if source and normalize_path(urlsplit(source).path) in ALIASES else source)
        if destination and current != destination and target_exists(destination, pages):
            node['original_href']=source or current;node['href'] = destination; restored = True
    if restored: text = replace_data(text, data)
    def restore_anchor(tag):
        nonlocal restored
        original = re.search(r'\bdata-original-href=["\']([^"\']+)["\']', tag)
        href = re.search(r'(?<![-\w])href=["\']([^"\']+)["\']', tag)
        if not href:return tag
        current=html.unescape(href[1]);source=html.unescape(original[1]) if original else None
        precise_source=bool(source and urlsplit(source).fragment and target_exists(source,pages))
        mapped_current=RULE_REFERENCE_MAPPINGS.get(current);mapped_source=RULE_REFERENCE_MAPPINGS.get(source)
        if not original and not mapped_current:return tag
        destination=(source if precise_source else resolve_navigation(current,pages) if mapped_current and (target_exists(mapped_current['target'],pages)or rule_contract.rule_original_fallback(current,mapped_current,pages)) else
                     resolve_navigation(source,pages) if mapped_source and (target_exists(mapped_source['target'],pages)or rule_contract.rule_original_fallback(source,mapped_source,pages)) else
                     resolve_navigation(source,pages) if source and normalize_path(urlsplit(source).path) in ALIASES else source)
        if destination is None:return tag
        if destination == html.unescape(href[1]) or not target_exists(destination, pages): return tag
        restored = True
        replacement=tag[:href.start(1)] + html.escape(destination, quote=True) + tag[href.end(1):]
        if not original:replacement=replacement[:-1]+' data-original-href="'+html.escape(current,quote=True)+'">'
        return replacement
    # HTMLParser treats script bodies as data. A source_meta.original_html
    # string, JSON value or script literal can never become a DOM anchor.
    offsets=[0]+[match.end() for match in re.finditer('\n',text)]
    class NativeAnchors(HTMLParser):
        def __init__(self):super().__init__(convert_charrefs=False);self.edits=[]
        def handle_starttag(self,tag,attrs):
            if tag!='a':return
            opening=self.get_starttag_text();replacement=restore_anchor(opening)
            if replacement!=opening:
                line,column=self.getpos();start=offsets[line-1]+column;self.edits.append((start,start+len(opening),replacement))
    parser=NativeAnchors();parser.feed(text)
    for start,end,replacement in reversed(parser.edits):text=text[:start]+replacement+text[end:]
    return text, restored


def restore_pending_links(root, pages):
    """Restore only known original hrefs when their actual target becomes available."""
    changed = []
    for rel in sorted(pages):
        path = root / rel
        text, restored = restore_pending_html(path.read_text('utf-8-sig'), pages)
        text, owned = repair_owned_navigation(text, pages, file_route(rel))
        if restored or owned:
            path.write_text(text, encoding='utf8'); changed.append(rel)
    return changed


def search_records(text):
    return json.loads(text[text.index('=') + 1:].strip().removesuffix(';'))


def serialize_search(records, project=False):
    records = public_search_text(public_contract.public_search_records(records))
    payload = json.dumps(records, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
    return 'window.' + ('__WLY_PROJECT_SEARCH_INDEX__' if project else '__WLY_SEARCH_INDEX__') + '=' + payload + ';\n'


def published_records(root, pages):
    result = []
    for rel, facts in sorted(pages.items()):
        if rel == '404.html' or file_route(rel) == '/system/': continue
        text = (root / rel).read_text('utf-8-sig')
        match = PAGE_DATA.search(text)
        if not match: continue
        data = json.loads(match[2])
        route = file_route(rel)
        slug = route.strip('/').split('/')[-1] if route.startswith('/projects/') else None
        scope = ['project', 'project:' + slug] if slug else ['skill'] if route.startswith('/skills/') else ['system']
        group = '项目' if slug else '能力' if route.startswith('/skills/') else '系统'
        title = data.get('title') or facts.title
        description = public_search_text(facts.description or title)
        result.append({'type': '项目' if slug else '页面', 'group': group, 'scopes': scope,
                       'projectSlug': slug, 'title': title + ' · 总览', 'detail': description[:240],
                       'href': route, 'aliases': [title], 'search': description})
        for screen in data.get('screens', []):
            if screen.get('id') not in facts.ids: continue
            transcript = '\n'.join(dict.fromkeys(facts.transcripts.get(screen['id'], [])))
            # Only the final displayed text/description and real heading enter search.
            detail = public_search_text(transcript or screen.get('title', ''))
            result.append({'type': '项目内容' if slug else '页面内容', 'group': group,
                           'scopes': ['project:' + slug] if slug else scope, 'projectSlug': slug,
                           'title': title + ' · ' + screen.get('title', screen['id']),
                           'detail': detail[:180], 'href': route + '#' + screen['id'],
                           'aliases': [screen.get('title', '')], 'search': detail})
    return result


def repair_search(root, pages):
    files = sorted(root.glob('search-*.js'))
    source = {p.name: search_records(p.read_text('utf8')) for p in files}
    before_invalid = [{'asset': name, 'title': e.get('title'), 'href': e.get('href')}
                      for name, rows in source.items() for e in rows if not target_exists(e.get('href', ''), pages)]
    generated = published_records(root, pages)
    generated_urls = {e['href'].split('#')[0] for e in generated}
    def keep(e):
        if not target_exists(e.get('href', ''), pages): return False
        # Existing module references remain; replaced image pages use their current copy.
        return e['href'].split('#')[0] not in generated_urls
    global_rows = [e for e in source.get('search-index.js', []) if keep(e)] + [e for e in generated if e['type'] != '项目内容']
    project_rows = [e for e in source.get('search-projects.js', []) if keep(e)] + [e for e in generated if e['type'] == '项目内容']
    output = {'search-index.js': global_rows, 'search-projects.js': project_rows}
    for name in source:
        if name.startswith('search-project-'):
            slug = name.removeprefix('search-project-').removesuffix('.js')
            output[name] = [e for e in project_rows if e.get('projectSlug') == slug]
    for slug in {e['projectSlug'] for e in project_rows if e.get('projectSlug')}:
        output['search-project-' + slug + '.js'] = [e for e in project_rows if e.get('projectSlug') == slug]
    changed = []
    for name, rows in output.items():
        rows = [{key: e[key] for key in PUBLIC_SEARCH_FIELDS if key in e} for e in rows]
        # One physical record per destination/title keeps overlays from accumulating copies.
        rows = list({(e['href'], e.get('title', ''), e.get('type', '')): e for e in rows}.values())
        text = serialize_search(rows, name != 'search-index.js')
        path = root / name
        if not path.is_file() or path.read_text('utf8') != text:
            path.write_text(text, encoding='utf8'); changed.append(name)
    invalid = [{'asset': p.name, 'href': e.get('href')} for p in root.glob('search-*.js')
               for e in search_records(p.read_text('utf8')) if not target_exists(e.get('href', ''), pages)]
    if invalid: raise ValueError('Search still contains unpublished targets: ' + str(invalid))
    return changed, before_invalid, len(generated)


def repair_runtime(root):
    replacements, changed = {}, []
    for path in sorted((root / 'assets').glob('*.js')) if (root / 'assets').exists() else []:
        original = path.read_text('utf8')
        patched = patch_history_runtime(original)
        if patched == original: continue
        name = 'index-audit-nav-' + hashlib.sha256(patched.encode()).hexdigest()[:20] + '.js'
        destination = path.with_name(name)
        if not destination.exists(): destination.write_bytes(patched.encode('utf8')); changed.append(destination.relative_to(root).as_posix())
        replacements['/' + path.relative_to(root).as_posix()] = '/' + destination.relative_to(root).as_posix()
    for path in sorted((root / '_typeset/runtime').glob('app-*.js')) if (root / '_typeset/runtime').exists() else []:
        original = path.read_text('utf8')
        patched = patch_viewer_runtime(original)
        if patched == original: continue
        destination = path.with_name('app-' + hashlib.sha256(patched.encode()).hexdigest()[:20] + '.js')
        if not destination.exists(): destination.write_bytes(patched.encode('utf8')); changed.append(destination.relative_to(root).as_posix())
        replacements['/' + path.relative_to(root).as_posix()] = '/' + destination.relative_to(root).as_posix()
    for path in root.rglob('*.html'):
        old = path.read_text('utf-8-sig'); new = old
        for original, replacement in replacements.items(): new = new.replace('src="' + original + '"', 'src="' + replacement + '"')
        if old != new: path.write_text(new, encoding='utf8'); changed.append(path.relative_to(root).as_posix())
    return changed, replacements


def apply(root, manifest=None):
    root = Path(root).resolve()
    manifest = manifest or json.loads((root / 'release-manifest.json').read_text('utf-8-sig'))
    # Install these ids before resolving the two host-capability links.
    index = root / 'skills/index.html'
    old = index.read_text('utf-8-sig') if index.is_file() else ''
    new = add_skill_card_ids(old)
    changed = []
    if new != old: index.write_text(new, encoding='utf8'); changed.append('skills/index.html')
    pages = page_inventory(root)
    html_changes, resolved, pending = repair_html(root, pages, manifest)
    runtime_changes, runtime = repair_runtime(root)
    pages = page_inventory(root)
    search_changes, invalid_before, generated = repair_search(root, pages)
    routes = sorted(file_route(rel) for rel in pages if rel != '404.html' and file_route(rel) != '/system/')
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join('  <url><loc>https://wly0829.cn' + html.escape(route) + '</loc></url>\n' for route in routes) + '</urlset>\n'
    sitemap_path = root / 'sitemap.xml'
    if not sitemap_path.exists() or sitemap_path.read_text('utf8') != sitemap:
        sitemap_path.write_text(sitemap, encoding='utf8'); changed.append('sitemap.xml')
    return {'status': 'pass', 'changed_files': sorted(set(changed + html_changes + runtime_changes + search_changes)),
            'resolved_links': resolved, 'temporary_href_mappings': pending, 'runtime_replacements': runtime,
            'search_invalid_before': invalid_before, 'search_invalid_after': [], 'generated_published_records': generated,
            'sitemap_routes': routes}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', required=True, type=Path)
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    report = apply(args.root)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print(json.dumps({key: report[key] for key in ('status', 'generated_published_records')} | {'changed_files': len(report['changed_files']), 'invalid_targets_removed': len(report['search_invalid_before'])}, ensure_ascii=False))

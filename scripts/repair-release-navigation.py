"""Repair navigation against the actual mixed release; never deploy or alter its manifest."""
from __future__ import annotations
import argparse
import hashlib
import html
import importlib.util
import json
import re
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
_public_spec = importlib.util.spec_from_file_location('public_page_contract', Path(__file__).with_name('public_page_contract.py'))
public_contract = importlib.util.module_from_spec(_public_spec)
_public_spec.loader.exec_module(public_contract)


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
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.title = ''
        self.description = ''
        self.transcripts = {}
        self.headings = []
        self.stack = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        if tag == 'meta' and a.get('name') == 'description': self.description = a.get('content', '')
        if tag in {'meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'wbr'}: return
        self.stack.append((tag, a))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        if not data.strip(): return
        if any(t == 'title' for t, _ in self.stack): self.title += data
        for _, a in self.stack:
            if a.get('data-screen-transcript'):
                self.transcripts.setdefault(a['data-screen-transcript'], []).append(data)
                break


def page_inventory(root):
    return {p.relative_to(root).as_posix(): PageFacts(p.read_text('utf-8-sig')) for p in root.rglob('*.html')}


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
    if target_exists(canonical, pages): return canonical
    if canonical in HOST_CAPABILITIES and target_exists(HOST_CAPABILITIES[canonical], pages):
        return HOST_CAPABILITIES[canonical]
    alias = ALIASES.get(normalize_path(parts.path))
    if alias:
        full = alias + ('?' + parts.query if parts.query else '') + ('#' + parts.fragment if parts.fragment else '')
        if target_exists(full, pages): return full
        if target_exists(alias, pages): return alias
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
        for child in value.values(): yield from visit(child)
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
    """Replay only recorded original hrefs against the actual available targets."""
    match = PAGE_DATA.search(text)
    restored = False
    data = json.loads(match[2]) if match else None
    for node in visit(data):
        source = node.get('original_href')
        if source and node.get('href') != source and target_exists(source, pages):
            node['href'] = source; restored = True
    if restored: text = replace_data(text, data)
    def restore_anchor(m):
        nonlocal restored
        tag = m[0]
        original = re.search(r'\bdata-original-href=["\']([^"\']+)["\']', tag)
        href = re.search(r'(?<![-\w])href=["\']([^"\']+)["\']', tag)
        if not original or not href: return tag
        source = html.unescape(original[1])
        if source == html.unescape(href[1]) or not target_exists(source, pages): return tag
        restored = True
        return tag[:href.start(1)] + html.escape(source, quote=True) + tag[href.end(1):]
    text = re.sub(r'<a\b[^>]*>', restore_anchor, text)
    return text, restored


def restore_pending_links(root, pages):
    """Restore only known original hrefs when their actual target becomes available."""
    changed = []
    for rel in sorted(pages):
        path = root / rel
        text, restored = restore_pending_html(path.read_text('utf-8-sig'), pages)
        if restored:
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

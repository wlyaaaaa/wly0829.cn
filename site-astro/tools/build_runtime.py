"""Local source dependencies and artifact finishing; no legacy site assembly."""
import hashlib
import html
import importlib.util
import json
import re
import shutil
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import unquote, urljoin, urlsplit, urlunsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / 'site-astro'
sys.path.insert(0, str(ROOT / 'scripts'))
import astro_rules

def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT / filename)
    value = importlib.util.module_from_spec(spec); spec.loader.exec_module(value); return value
nav = load('build_navigation', 'scripts/repair-release-navigation.py')
transport = load('build_transport', 'scripts/same-origin-runtime.py')
retention = load('build_retention', 'scripts/oss-retention.py')
retry = load('build_retry', 'scripts/prepare-resource-retry.py')
oss = load('build_oss', 'scripts/prepare-oss-release.py')
def read(path): return json.loads(Path(path).read_text('utf8'))

def published_manifest():
    path = retention.shared() / 'published.json'
    return retention.read(path)['manifest'] if path.is_file() else {}

def previous_resources(prior, published):
    local = prior.get('oss', prior.get('previous_oss', {}))
    if not published:
        print('上一版清单：无已发布记录，资源地址可能全部换新', flush=True)
        return local, 'dist' if local else 'none', prior.get('release_id')
    accepted = published['oss']
    return {**accepted, 'objects': {**local.get('objects', {}), **accepted['objects']},
            'local_objects': local.get('objects', {}) if local.get('asset_base_url') == accepted.get('asset_base_url') else {}}, 'published', published['release_id']
def file_route(rel): return '/' if rel == 'index.html' else '/' + rel[:-10] if rel.endswith('/index.html') else '/' + rel
def copy(source, target):
    raw = Path(source).read_bytes(); target = Path(target); target.parent.mkdir(parents=True, exist_ok=True)
    if not target.is_file() or target.read_bytes() != raw: target.write_bytes(raw)
    return raw

def prepare(snapshot):
    public = SITE / 'public'; source = SITE / 'sources/retained-home-cockpit'
    dependencies = read(source / 'dependencies.json')
    for rel, row in dependencies.items():
        if rel.startswith('_home-cockpit/cockpit-offline.') and not (source / 'cockpit.html').is_file(): continue
        origin = ROOT / row['source_path'] if 'source_path' in row else SITE / 'sources/vendor-deps' / rel
        raw = origin.read_bytes()
        authored = row.get('source_path', '').startswith(('site-astro/public/_home-cockpit/', 'site-astro/sources/retained-home-cockpit/'))
        if not authored and (len(raw) != row['bytes'] or hashlib.sha256(raw).hexdigest() != row['sha256']):
            raise ValueError('Retained source dependency changed: ' + rel)
        copy(origin, public / rel)
    for rel, row in read(source / 'manifest.json')['bundled'].items():
        if rel.startswith('_home-cockpit/cockpit-offline.') and not (source / 'cockpit.html').is_file(): continue
        copy(source / row['source'], public / rel)
    copy(ROOT / 'scripts/site-live-runtime.js', public / '_live/site-live-runtime.js')
    for path in (SITE / 'sources/hero-motion').rglob('*'):
        if path.is_file():
            copy(path, public / '_living/hero-motion' / path.relative_to(SITE / 'sources/hero-motion'))
    return {'retained_dependencies': len(dependencies)}

def seed_file(rel, target):
    row = read(SITE / 'sources/frozen-site/manifest.json')['assets'][rel]
    copy(ROOT / row['source_path'], target)

def retired_project_routes(dist, previous):
    order = read(ROOT/'config/final-project-order.json')
    for item in order.get('retired_routes', []):
        route, destination = item['route'], item['destination']
        routes = [value for value in previous['routes'] if value == route or value.startswith(route)]
        for old in routes:
            target = dist/nav.route_file(old); target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>'+html.escape(item['title'])+'</title></head><body><main><p>'+html.escape(item['title'])+'旧页面已撤下。<a href="'+html.escape(destination, quote=True)+'">查看现有项目</a></p></main></body></html>', encoding='utf8')

def search_index_entry(body, snapshot, prior=None):
    """The existing client reads both tables once; load globals before it."""
    urls = dict(snapshot.get('runtime_urls', {}))
    for rel, row in (prior or {}).get('oss', {}).get('objects', {}).items(): urls[row['url']] = rel
    urls = {unquote(url.split('?', 1)[0].split('#', 1)[0]): rel for url, rel in urls.items()}
    aliases = {rel.lstrip('/') for rel in urls.values() if re.fullmatch(r'/?_runtime/[^/]+/search-(?:index|projects)\.js', rel)}
    def is_index(rel, name): return rel == name or rel in aliases and rel.rsplit('/', 1)[-1] == name
    def resource(value):
        absolute = urlsplit(urljoin('https://wly0829.cn/search/', value))
        normalized = unquote(urlunsplit((absolute.scheme, absolute.netloc, absolute.path, '', '')))
        return absolute.path.lstrip('/') if absolute.netloc in {'wly0829.cn', 'www.wly0829.cn'} else urls.get(normalized, '')
    # Both synchronization and the fresh frozen-HTML check own this bootstrap.
    body = re.sub(r'<script data-search-wire>[\s\S]*?</script>', '', body)
    for tag, attrs, raw, offset in reversed(oss.HtmlTags(body).tags):
        source = attrs.get('src') or attrs.get('data-src')
        if tag != 'script' or not source: continue
        rel = resource(source).lstrip('/').replace('assets/search-wire-', 'assets/', 1)
        row = snapshot.get('assets', {}).get(rel, {})
        if not rel.startswith('assets/') or not rel.endswith('.js') or not row.get('source_path'): continue
        client = (ROOT/row['source_path']).read_text('utf8')
        if '__WLY_SEARCH_INDEX__' not in client or '__WLY_PROJECT_SEARCH_INDEX__' not in client: continue
        bootstrap = '<script data-search-wire>' + search_wire_loader() + '</script>'
        body = body[:offset] + bootstrap + raw.replace(source, '/' + rel, 1) + body[offset + len(raw):]
    scripts = [(attrs, raw, offset, resource(attrs.get('src', ''))) for tag, attrs, raw, offset in oss.HtmlTags(body).tags
               if tag == 'script' and attrs.get('src')]
    existing = [(raw, offset, rel) for _, raw, offset, rel in scripts if is_index(rel, 'search-index.js')]
    if existing:
        if len(existing) != 1: raise ValueError('搜索页有重复的全站索引入口')
        raw, offset, rel = existing[0]
        if rel == 'search-index.js': return body
        return body[:offset] + '<script src="/search-index.js">' + body[offset + len(raw):]
    anchor = next((offset for _, _, offset, rel in scripts if is_index(rel, 'search-projects.js')), None)
    if anchor is None: raise ValueError('搜索页没有可定位的项目索引入口')
    return body[:anchor] + '<script src="/search-index.js"></script>' + body[anchor:]

def search_wire(rows, encode=False):
    """Reference a repeated detail prefix without changing the search text."""
    result = []
    lowercase = str.maketrans('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')
    for source in rows:
        row = dict(source); search = row.get('search', '')
        prefix = row.get('detail', '').translate(lowercase)
        if encode:
            if prefix and search.startswith(prefix): row['search'] = '\x01d' + search[len(prefix):]
            elif search.startswith('\x01'): row['search'] = '\x01s' + search
        elif search.startswith('\x01d'): row['search'] = prefix + search[2:]
        elif search.startswith('\x01s'): row['search'] = search[2:]
        result.append(row)
    return result


def search_wire_loader():
    # Use the exact same decoder in the retained production client and new code.
    source = (ROOT/'app/compact-search.js').read_text('utf8')
    decoder = source.split('// search-wire:start\n', 1)[1].split('// search-wire:end', 1)[0].replace('export function ', 'function ')
    return '(function(){\n' + decoder + '\nconst key="__WLY_PROJECT_SEARCH_INDEX__";if(Array.isArray(window[key]))window[key]=window[key].map(decodeCompactSearchEntry);\n})();\n'


def sync_search(root, previous, converted, pin, changed_routes):
    replacements = {}; generated = []
    targets = {nav.route_file(route): nav.PageFacts((root / nav.route_file(route)).read_text('utf8'), root) for route in changed_routes}
    author = {data['url']: data for data in (read(path) for path in (ROOT/'sources/pages').glob('*/page.json')) if data.get('url')}
    # Keep the diagnostic Skill's established requests after chapter rebuilding.
    # Reuse its aliases without restoring older copy or rerouting other Skills.
    skill_aliases = {}
    if any(route.startswith('/skills/') and route in author for route in converted):
        code = "import {globalSearchEntries} from './app/search.js'; console.log(JSON.stringify(Object.fromEntries(globalSearchEntries.filter(e=>e.type==='Skill'&&e.href==='/skills/timeaudit-diagnostics').map(e=>[new URL(e.href,'https://wly0829.cn').pathname.replace(/\\/?$/, '/'),e.aliases]))));"
        skill_aliases = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, encoding='utf8'))
    for route in converted:
        if route not in changed_routes or converted[route].get('destination') or route not in author: continue
        if route.startswith('/rules/'):
            rows = [row for row in pin['documents'].values() if row['primary'] and (route == '/rules/' or route == '/rules/' + row['slug'] + '/')]
            title = '我的 AI 约法与工作约定' if route == '/rules/' else rows[0]['title']
            texts = [(('rule-engineering-delivery-06' if row['slug'] == 'engineering-delivery' and route != '/rules/' else key), row['title'], astro_rules.contract.canonical_plain(astro_rules.contract.render_markdown((root/row['src'].lstrip('/')).read_text('utf8')))) for key, row in pin['documents'].items() if row in rows]
        else:
            data = author[route]
            title = data['title']; texts = [(row['id'], row['title'], row.get('text', '')) for row in data['screens'] if not row.get('hidden')]
            md = SITE / 'src/content/pages' / (data['page'] + '.md')
            if md.is_file():
                screens = re.findall(r'::screen\{[^\n]*\}\n\n```typeset\n(.*?)\n```\n\n?(.*?)(?=\n::screen\{|\Z)', md.read_text('utf8'), re.S)
                current = {json.loads(meta)['screen']['id']: body.rstrip('\n') for meta, body in screens}
                texts = [(sid, label, current.get(sid, body)) for sid, label, body in texts]
        slug = route.split('/')[2] if route.startswith('/projects/') else None
        for anchor, label, text in [('top', '总览', texts[0][2]), *texts]:
            href = route + '#' + anchor if nav.target_exists(route + '#' + anchor, targets) else route
            generated.append({'type': '项目内容' if slug and anchor != 'top' else '项目' if slug else '页面', 'group': '项目' if slug else '系统', 'projectSlug': slug,
                'scopes': ['project:' + slug] if slug else ['system'], 'title': title + ' · ' + label, 'detail': text[:240], 'href': href, 'aliases': [label], 'search': text.lower()})
    for rel in ('search-index.js', 'search-projects.js', 'search-project-localocr.js'):
        obj = previous['oss']['objects'][rel]; old = root/rel
        if not old.is_file(): seed_file(rel, old)
        rows = nav.search_records(old.read_text('utf8'))
        if rel == 'search-projects.js': rows = search_wire(rows)
        kept = []
        added = [row for row in generated if (row['type'] == '项目内容') == (rel != 'search-index.js') and (rel != 'search-project-localocr.js' or row['projectSlug'] == 'localocr')]
        for row in rows:
            if row['href'].split('#')[0] not in changed_routes:
                kept.append(row)
            else:
                match = next((i for i, value in enumerate(added) if (value['type'], value['href']) == (row['type'], row['href'])), None)
                if match is not None: kept.append(added.pop(match))
        # Incremental builds also repair overview records inherited from old assets.
        for row in kept + added:
            # Every matcher keeps at least 120 UTF-16 units of the visible detail.
            if 'search' in row and len(row['detail'].encode('utf-16-le', 'surrogatepass')) <= 240 and row['search'] == row['detail'].lower():
                row['search'] = ''
            target = urlsplit(row['href'])
            if target.path in skill_aliases and row['type'] in {'Skill', '页面'} and target.fragment in {'', 'top'}:
                row['aliases'] = list(dict.fromkeys([*row.get('aliases', []), *skill_aliases.get(target.path, [])]))
            for field in ('title', 'search', 'detail'):
                if field in row: row[field] = row.pop(field)
        prefix = 'window.' + ('__WLY_SEARCH_INDEX__' if rel == 'search-index.js' else '__WLY_PROJECT_SEARCH_INDEX__') + '='
        payload = search_wire(kept + added, encode=True) if rel == 'search-projects.js' else kept + added
        old.write_bytes((prefix + json.dumps(payload, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c') + ';\n').encode())
        replacements[obj['url']] = '/' + rel
    # The global search client has literal index URLs; keep its code intact and
    # change only those existing resource literals, then retain its new hash.
    search_path = root/'search/index.html'
    search_html = search_index_entry(search_path.read_bytes().decode('utf8'), read(SITE / 'sources/frozen-site/manifest.json'),
                                     read(root/'release-manifest.json') if (root/'release-manifest.json').is_file() else {})
    search_path.write_bytes(search_html.encode('utf8'))
    for rel, obj in previous['oss']['objects'].items():
        if not rel.startswith('assets/') or not rel.endswith('.js') or obj['url'] not in search_html: continue
        target = root/rel; target.parent.mkdir(parents=True, exist_ok=True)
        seed_file(rel, target)
        raw = target.read_text('utf8'); patched = raw
        for old, new in replacements.items(): patched = patched.replace(old, new)
        target.write_bytes(patched.encode()); replacements[obj['url']] = '/' + rel
    # search_objects contains only indexes, so locate the retained client from
    # the scripts actually loaded by /search/, rather than that smaller table.
    loaded = [(attrs, raw, offset) for tag, attrs, raw, offset in oss.HtmlTags(search_html).tags
              if tag == 'script' and (attrs.get('src') or attrs.get('data-src'))]
    for rel in read(SITE/'sources/frozen-site/manifest.json').get('assets', {}):
        if not rel.startswith('assets/') or not rel.endswith('.js'): continue
        isolated = 'assets/search-wire-' + Path(rel).name
        consumers = [(attrs, raw, offset) for attrs, raw, offset in loaded
                     if any(urlsplit(attrs.get('src') or attrs['data-src']).path.endswith('/' + path) for path in (rel, isolated))]
        if not consumers: continue
        target = root/rel
        # Restore the owning frozen bytes even after an interrupted prior build;
        # the materialization cache only checks the public source, not dist.
        seed_file(rel, target)
        raw = target.read_text('utf8')
        if '__WLY_SEARCH_INDEX__' in raw and '__WLY_PROJECT_SEARCH_INDEX__' in raw:
            (root/isolated).unlink(missing_ok=True)
    search_path.write_bytes(search_html.encode('utf8'))
    for path in (root / nav.route_file(route) for route in changed_routes):
        rel = path.relative_to(root).as_posix(); raw = path.read_bytes(); patched = raw
        applied = {old: new for old, new in replacements.items() if old.encode() in raw}
        for old, new in applied.items(): patched = patched.replace(old.encode(), new.encode())
        if patched != raw:
            path.write_bytes(patched)

def has_noindex(path):
    class Robots(HTMLParser):
        noindex = False
        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            if (tag == 'meta' and (attrs.get('name') or '').lower() in {'robots', 'googlebot'}
                    and 'noindex' in re.split(r'[\s,]+', (attrs.get('content') or '').lower())):
                self.noindex = True
    parser = Robots(); parser.feed(re.split(r'</head\s*>', Path(path).read_text('utf8'), maxsplit=1, flags=re.I)[0])
    return parser.noindex

def write_sitemap(root, routes):
    root = Path(root)
    urls = sorted(route for route in routes if route.endswith('/') and route != '/system/'
                  and not has_noindex(root/nav.route_file(route)))
    sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>https://wly0829.cn'+route+'</loc></url>' for route in urls) + '</urlset>\n'
    (root/'sitemap.xml').write_text(sitemap, encoding='utf8')


def album_index(dist, snapshot, changed_routes):
    routes, pages = {}, {}
    for path in dist.rglob('*.html'):
        route = file_route(path.relative_to(dist).as_posix()); body = path.read_text('utf8')
        match = re.search(r'<script\b[^>]*id="album-page"[^>]*>(.*?)</script>', body, re.S)
        routes[route] = {'images': json.loads(match[1]).get('images', []) if match else []}
        if route in changed_routes and route != '/computer-access/': pages[path] = body
    old = {url for body in pages.values() for url in re.findall(r'(?:https?://[^\s"<>]+)?/_album/routes-[a-f0-9]+\.json', body)}
    if not old: return {}
    raw = transport.localize(json.dumps({'schema': 'wly.album-routes.v1', 'routes': routes}, ensure_ascii=False, sort_keys=True, separators=(',', ':')) + '\n', snapshot).encode('utf8')
    address = '/_album/routes-' + hashlib.sha256(raw).hexdigest()[:20] + '.json'
    target = dist / address.lstrip('/'); target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(raw)
    for path, body in pages.items():
        for previous in sorted(old, key=len, reverse=True): body = body.replace(previous, address)
        path.write_bytes(body.encode('utf8'))
    return {'resource': address, 'routes': len(routes)}

def visitor_html(body):
    script = (ROOT / 'scripts/visitor-beacon.js').read_text('utf8').strip()
    body = re.sub(r'<script data-site-visitors>[\s\S]*?</script>\s*', '', body)
    email = (ROOT / 'scripts/footer-email-copy.js').read_text('utf8').strip()
    body = re.sub(r'<script data-footer-email-copy>[\s\S]*?</script>\s*', '', body)
    return body.replace('</body>', '<script data-site-visitors>' + script + '</script>\n<script data-footer-email-copy>' + email + '</script>\n</body>')


def finish(dist, snapshot, pin, converted, changed_routes=None):
    dist = Path(dist); changed_routes = set(converted) if changed_routes is None else set(changed_routes)
    prior = read(dist / 'release-manifest.json') if (dist / 'release-manifest.json').is_file() else {}
    finalized = prior.get('finalized_dist', False)
    legacy = tuple({match[0] for url in snapshot['runtime_urls'] if (match := transport.PREFIX.match(url))})
    retired_project_routes(dist, {'routes': snapshot['routes']})
    navigation = {nav.route_file(route): SimpleNamespace(ids=set()) for route in snapshot['routes']}
    for route in changed_routes & set(nav.SITE_NAVIGATION.values()) - {'/', '/cockpit/', '/computer-access/'}:
        path = dist / nav.route_file(route)
        body, _ = nav.repair_owned_navigation(path.read_text('utf8'), navigation, owner_route=route)
        path.write_bytes(body.encode('utf8'))
    if (dist / '404/index.html').exists(): copy(dist / '404/index.html', dist / '404.html')
    previous = {'oss': {'objects': snapshot['search_objects']}, 'files': snapshot['pages']}
    sync_search(dist, previous, converted, pin, changed_routes)
    # Current O6 requires every deployed resource address to be same-origin.
    for route in changed_routes | {'/', '/cockpit/', '/computer-access/'} | {file_route(rel) for rel in snapshot['pages']}:
        path = dist / nav.route_file(route)
        if path.is_file():
            body = path.read_bytes().decode('utf8')
            if not finalized or any(prefix in body for prefix in legacy): body = transport.localize(body, snapshot)
            if path.read_bytes() != body.encode('utf8'): path.write_bytes(body.encode('utf8'))
    for path in dist.rglob('*'):
        if path.is_file() and path.suffix in transport.TEXT - {'.html'} and path.name != 'release-manifest.json':
            before = path.read_text('utf8'); after = transport.localize(before, snapshot)
            if finalized and not any(prefix in before for prefix in legacy): continue
            if after != before: path.write_bytes(after.encode('utf8'))
    scripts = {transport.PREFIX.sub('/', match) for page in dist.rglob('*.html') for match in re.findall(r'<script\b[^>]*\b(?:data-)?src="([^"]+)"', page.read_text('utf8'))}
    unused = ['/' + path.relative_to(dist).as_posix() for path in (dist / '_typeset/runtime').glob('b2-typeset-*.js') if '/' + path.relative_to(dist).as_posix() not in scripts]
    for path in dist.rglob('resource-retry-*.js'):
        copy_bytes = retry.prune_content_retry_policy(path.read_text('utf8'), unused).encode('utf8')
        if path.read_bytes() != copy_bytes: path.write_bytes(copy_bytes)
    for url in unused: (dist / url.lstrip('/')).unlink()
    album = album_index(dist, snapshot, changed_routes)
    if (dist / '404/index.html').exists(): copy(dist / '404/index.html', dist / '404.html')
    for path in (dist / '_album').glob('routes-*.json'):
        if finalized and not any(prefix in path.read_text('utf8') for prefix in legacy): continue
        path.write_bytes(transport.localize(path.read_text('utf8'), snapshot).encode('utf8'))
    routes = sorted(file_route(p.relative_to(dist).as_posix()) for p in dist.rglob('*.html'))
    write_sitemap(dist, routes)
    for path in dist.rglob('*.html'):
        body = path.read_bytes().decode('utf8'); updated = visitor_html(body)
        if updated != body: path.write_bytes(updated.encode('utf8'))
    files = {p.relative_to(dist).as_posix(): {'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}
             for p in dist.rglob('*') if p.is_file() and p.name not in {'.build-receipt.json', 'release-manifest.json', 'release-identity.json'}}
    manifest = {'schema': 'wly.hybrid-release.v1', 'files': files, 'routes': routes,
        'release_id': hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest(),
        'baseline_production_commit': snapshot['baseline_production_commit'], 'rules_pin': pin,
        'accepted_pages': {**{file_route(rel): {'producer': 'frozen'} for rel in snapshot['pages']}, **converted},
        'astro': {'converted_routes': sorted(converted), 'retained_sample': {'source': 'site-astro/sources/retained-home-cockpit'},
                  'selected_pages': sorted(p.stem for p in (SITE / 'src/content/pages').glob('*.md')), 'html_files': len(routes)}}
    manifest['previous_oss'], manifest['previous_oss_source'], manifest['previous_release_id'] = previous_resources(prior, published_manifest())
    manifest.pop('finalized_dist', None)
    (dist / 'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    return {'routes': routes, 'release_id': manifest['release_id'], 'album': album}

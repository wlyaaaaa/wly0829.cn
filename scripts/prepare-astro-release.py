"""Compose native Astro routes with exact deployed HTML, then use the existing OSS split."""
import argparse
import concurrent.futures
import hashlib
import html
import importlib.util
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

import astro_rules

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site-astro'
def module(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT / filename)
    value = importlib.util.module_from_spec(spec); spec.loader.exec_module(value); return value
hybrid = module('astro_hybrid', 'scripts/hybrid-release.py')
oss = module('astro_oss', 'scripts/prepare-oss-release.py')
delta = module('astro_changes', 'scripts/publication-changes.py')
content = module('astro_content', 'scripts/audit-content-refresh.py')
def run(*args, cwd=ROOT):
    subprocess.run(args, cwd=cwd, check=True)
def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf8')


def author_inputs():
    return {key: value for key, value in delta.snapshot(ROOT).items()
        if not key.startswith(('site-astro/src/content/pages/', 'site-astro/src/content/rendered/'))
        and key != 'site-astro/src/chrome/living-engine.json'}


def published_file(previous, rel, obj, destination):
    cached = ROOT/'.publish/astro-shell-cache'/previous['release_id']/rel
    if not cached.is_file() or hybrid.digest(cached) != obj['sha256']:
        cached.parent.mkdir(parents=True, exist_ok=True)
        oss.verify_object_with_retries(None, rel, obj, 'https://wly0829.cn', 60, download_to=cached)
    destination.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(cached, destination)


def hydrate(previous, shell_assets=None):
    """Fetch only the sample shell's exact published dependencies, preserving bytes."""
    public = SITE / 'public'; objects = previous.get('oss', {}).get('objects', {})
    frozen = hybrid.read(SITE/'sources/retained-home-cockpit/dependencies.json')
    seeds = [SITE/'src/chrome/header.html', SITE/'src/chrome/footer.html']
    texts = [path.read_text('utf8') for path in seeds]
    for path in (SITE/'src/chrome/runtime').glob('*.json'):
        row = json.loads(path.read_text('utf8')); texts += row['head'] + [row['tail'], row.get('toc_html') or '', row.get('living_config') or '']
    pending = list(json.loads((SITE/'src/chrome/chrome.json').read_text('utf8'))['css'])
    pending += ['/source-tools/Find-DuplicateContent.ps1']
    pending += [row for text in texts for row in re.findall(r'(/_(?:shared|album|living|typeset/runtime)/[^"\'\s<>),]+)', text)]
    pending += ['/' + rel for rel in objects if rel.startswith('_living/_engine/')]
    visited = set(); addresses = {row['url']: rel for rel, row in objects.items()}
    while pending:
        rel = unquote(urlsplit(pending.pop()).path).lstrip('/')
        if rel in visited: continue
        visited.add(rel); target = public / rel
        if not target.is_relative_to(public): raise ValueError('Shell resource escapes public directory')
        if rel in frozen and target.is_file() and hybrid.digest(target) == frozen[rel]['sha256']:
            pass
        elif shell_assets and (shell_assets/rel).is_file():
            original = shell_assets/rel; target.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(original, target)
            if hybrid.digest(original) != hybrid.digest(target): raise ValueError('Sample asset copy changed: '+rel)
        elif rel in objects: published_file(previous, rel, objects[rel], target)
        if not target.exists():
            if rel.startswith('assets/'):
                source = ROOT/'sources/assets'/rel.removeprefix('assets/')
                target.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(source, target)
            else:
                found = objects.get(rel)
                if not found and rel.startswith('_chrome/'):
                    matches = [row for key, row in objects.items() if Path(key).name == Path(rel).name]
                    if len(matches) == 1: found = matches[0]
                target.parent.mkdir(parents=True, exist_ok=True)
                if found:
                    proof = oss.verify_object_with_retries(None, rel, found, 'https://wly0829.cn', 60, download_to=target)
                    if proof['status'] != 'pass': raise ValueError('Shell bytes unavailable: ' + rel)
                elif shell_assets and (shell_assets/rel).is_file(): shutil.copyfile(shell_assets/rel, target)
                else: raise ValueError('Unbound shell resource; supply the selected sample shell-assets: ' + rel)
        if target.suffix in {'.json', '.js', '.css'}:
            text = target.read_text('utf8')
            for url, original in addresses.items():
                if url in text and original.startswith(('_shared/', '_living/', '_album/', '_typeset/runtime/')): text = text.replace(url, '/' + original); pending.append('/' + original)
            if rel.endswith('/bird.js'): text = text.replace('/' + str(Path(rel).parent).replace('\\', '/') + '/bird-atlas.webp', 'bird-atlas.webp')
            target.write_bytes(text.encode('utf8'))
            pending += [ref for ref, navigation in hybrid.references(target) if not navigation and ref.startswith(('/_shared/', '/_living/', '/_album/', '/_typeset/runtime/', '/_how-demo/'))]
    mount = public/'_living/living-mount.js'; mount.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SITE/'src/scripts/living-mount.js', mount)


def seed_retained(assets):
    loader = module('astro_retained', 'site-astro/tools/retain_home_cockpit.py')
    manifest = loader.materialize_frozen(); restored = loader.materialize_dependencies()
    return {'source': 'site-astro/sources/retained-home-cockpit', 'pages': manifest['pages'], 'dependencies': restored}


def retired_project_routes(dist, previous):
    order = hybrid.read(ROOT/'config/final-project-order.json')
    result = {}
    for item in order.get('retired_routes', []):
        route, destination = item['route'], item['destination']
        routes = [value for value in previous['routes'] if value == route or value.startswith(route)]
        for old in routes:
            target = dist/hybrid.route_file(old); target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>'+html.escape(item['title'])+'</title></head><body><main><p>'+html.escape(item['title'])+'旧页面已撤下。<a href="'+html.escape(destination, quote=True)+'">查看现有项目</a></p></main></body></html>', encoding='utf8')
            result[old] = {'producer': 'astro', 'destination': destination}
    return result


def sync_search(root, previous, converted, pin):
    nav = hybrid.nav_repair; replacements = {}; generated = []
    targets = nav.page_inventory(root)
    author = {data['url']: data for data in (hybrid.read(path) for path in (ROOT/'sources/pages').glob('*/page.json')) if data.get('url')}
    for route in converted:
        if converted[route].get('destination') or route not in author: continue
        if route.startswith('/rules/'):
            rows = [row for row in pin['documents'].values() if row['primary'] and (route == '/rules/' or route == '/rules/' + row['slug'] + '/')]
            title = '我的 AI 约法与工作约定' if route == '/rules/' else rows[0]['title']
            texts = [(('rule-engineering-delivery-06' if row['slug'] == 'engineering-delivery' and route != '/rules/' else key), row['title'], astro_rules.contract.canonical_plain(astro_rules.contract.render_markdown((root/row['src'].lstrip('/')).read_text('utf8')))) for key, row in pin['documents'].items() if row in rows]
        else:
            data = author[route]
            title = data['title']; texts = [(row['id'], row['title'], row.get('text', '')) for row in data['screens'] if not row.get('hidden')]
        slug = route.split('/')[2] if route.startswith('/projects/') else None
        for anchor, label, text in [('top', '总览', texts[0][2]), *texts]:
            href = route + '#' + anchor if nav.target_exists(route + '#' + anchor, targets) else route
            generated.append({'type': '项目内容' if slug and anchor != 'top' else '项目' if slug else '页面', 'group': '项目' if slug else '系统', 'projectSlug': slug,
                'scopes': ['project:' + slug] if slug else ['system'], 'title': title + ' · ' + label, 'detail': text[:240], 'href': href, 'aliases': [label], 'search': text.lower()})
    preserved = {}
    for rel in ('search-index.js', 'search-projects.js', 'search-project-localocr.js'):
        obj = previous['oss']['objects'][rel]; old = root/rel
        published_file(previous, rel, obj, old)
        rows = nav.search_records(old.read_text('utf8')); kept = [row for row in rows if row['href'].split('#')[0] not in converted]
        preserved[rel] = {'kind': 'search_index', 'previous_object': obj,
            'preserved_record_sha256s': [hashlib.sha256(json.dumps(row, ensure_ascii=False, sort_keys=True).encode()).hexdigest() for row in kept]}
        added = [row for row in generated if (row['type'] == '项目内容') == (rel != 'search-index.js') and (rel != 'search-project-localocr.js' or row['projectSlug'] == 'localocr')]
        prefix = 'window.' + ('__WLY_SEARCH_INDEX__' if rel == 'search-index.js' else '__WLY_PROJECT_SEARCH_INDEX__') + '='
        old.write_bytes((prefix + json.dumps(kept + added, ensure_ascii=False).replace('<', '\\u003c') + ';\n').encode())
        replacements[obj['url']] = '/' + rel
    # The global search client has literal index URLs; keep its code intact and
    # change only those existing resource literals, then retain its new hash.
    search_html = (root/'search/index.html').read_text('utf8')
    for rel, obj in previous['oss']['objects'].items():
        if not rel.startswith('assets/') or not rel.endswith('.js') or obj['url'] not in search_html: continue
        target = root/rel; target.parent.mkdir(parents=True, exist_ok=True)
        published_file(previous, rel, obj, target)
        raw = target.read_text('utf8'); patched = raw
        for old, new in replacements.items(): patched = patched.replace(old, new)
        target.write_bytes(patched.encode()); replacements[obj['url']] = '/' + rel
    overlays = {}
    for path in root.rglob('*.html'):
        rel = path.relative_to(root).as_posix(); raw = path.read_bytes(); patched = raw
        applied = {old: new for old, new in replacements.items() if old.encode() in raw}
        for old, new in applied.items(): patched = patched.replace(old.encode(), new.encode())
        if patched != raw:
            path.write_bytes(patched)
            if hybrid.file_route(rel) not in converted: overlays[rel] = {'kind': 'runtime_reference', 'replacements': applied, 'before': previous['files'][rel], 'after': {'bytes': len(patched), 'sha256': hashlib.sha256(patched).hexdigest()}}
    return overlays, preserved


def prepare(args):
    output = args.output.resolve()
    if output.exists() or output.is_relative_to(SITE): raise ValueError('Use a fresh preparation outside site-astro')
    output.mkdir(parents=True); previous = hybrid.read(args.baseline/'release-manifest.json')
    ref = subprocess.check_output(['git', 'rev-parse', args.baseline_ref+'^{commit}'], cwd=ROOT, text=True).strip()
    if json.loads(subprocess.check_output(['git', 'show', ref+':site-release/release-manifest.json'], cwd=ROOT)) != previous:
        raise ValueError('Baseline does not belong to the exact supplied production commit')
    inputs = author_inputs()
    hybrid.verify_release(args.baseline); pin = astro_rules.generate(SITE/'public')
    retained = seed_retained(args.shell_assets)
    hydrate(previous, args.shell_assets)
    run(sys.executable, 'tools/adapt_motion.py', cwd=SITE)
    run(sys.executable, 'tools/pack_living.py', cwd=SITE)
    run(sys.executable, 'tools/convert_page.py', '--all', cwd=SITE)
    pages = sorted(path.stem for path in (SITE/'src/content/pages').glob('*.md'))
    run('npm.cmd' if sys.platform == 'win32' else 'npm', 'run', 'build', cwd=SITE)
    for page in pages:
        rendered = hybrid.read(SITE/'src/content/rendered'/(page+'.json'))
        if rendered.get('source_md_sha256') != hybrid.digest(SITE/'src/content/pages'/(page+'.md')):
            raise ValueError('Shared block renderer has no current result for '+page)
    rendered_inputs = delta.snapshot(ROOT)
    for page in pages:
        if rendered_inputs.get('site-astro/src/content/pages/'+page+'.md') != hybrid.read(SITE/'src/content/rendered'/(page+'.json'))['source_md_sha256']:
            raise ValueError('Rendered Markdown changed before source binding: '+page)
    dist = SITE/'dist'; astro_rules.verify(dist, pin, astro_rules.inspect())
    remaining_assets = {}
    for path in list(dist.rglob('*.html')):
        for reference, navigation in hybrid.references(path):
            dependency = hybrid.local_reference(dist, path, reference)
            if navigation or dependency is None or dependency.is_file(): continue
            rel = dependency.relative_to(dist).as_posix(); obj = previous.get('oss', {}).get('objects', {}).get(rel)
            if not obj: continue
            remaining_assets[rel] = obj
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(lambda item: published_file(previous, item[0], item[1], dist/item[0]), remaining_assets.items()))
    # Source drafts without a URL retain their selected sample preview route.
    if (dist/'404/index.html').is_file(): shutil.copyfile(dist/'404/index.html', dist/'404.html')
    project_redirects = retired_project_routes(dist, previous)
    converted = {hybrid.file_route(path.relative_to(dist).as_posix()): {'producer': 'astro'} for path in dist.rglob('*.html')}
    converted.update(project_redirects)
    expected_routes = {hybrid.read(ROOT/'sources/pages'/page/'page.json')['url'] or '/'+page+'/' for page in pages}
    expected_routes.update({'/', '/cockpit/'})
    expected_routes.update('/rules/'+row['slug']+'/' for row in pin['documents'].values() if row['primary'])
    expected_routes.add('/rules/')
    if expected_routes-set(converted): raise ValueError('Native build lost required current routes: '+str(expected_routes-set(converted)))
    # Preserve every deployment route, including modules and compatibility URLs.
    merged = output/'source'
    manifest = hybrid.assemble(args.baseline, dist, merged, previous, converted, rollback_ref=ref,
        candidate_files=hybrid.inventory(dist), baseline_production_commit=ref)
    # The existing runtime selects portrait labels and artwork from JSON at
    # runtime; their exact prepared files are not all static HTML references.
    rule_resources = {row['src'].lstrip('/') for row in pin['documents'].values()}
    rule_resources.update('rule-sources/'+row['relative_path'] for row in pin['documents'].values() if row['relative_path'].startswith('templates/'))
    for rel in hybrid.inventory(dist):
        if (rel not in rule_resources and not rel.startswith(('_shared/', '_home-cockpit/', '_living/', '_typeset/runtime/', '_how-demo/', '_album/'))) or (merged/rel).is_file(): continue
        target = merged/rel; target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(dist/rel, target)
    overlays, preserved = sync_search(merged, previous, converted, pin)
    for rel, overlay in overlays.items():
        existing = manifest.setdefault('release_overlay', {}).get(rel)
        if existing and existing['kind'] != 'runtime_reference':
            existing.update(after=overlay['after'], runtime_replacements=overlay['replacements'], runtime_before=existing['after'])
        else: manifest['release_overlay'][rel] = overlay
    manifest['search_preserved_records'] = preserved
    manifest['files'] = hybrid.inventory(merged)
    inherited = {row['key'].removeprefix('releases/'): rel for rel, row in previous.get('oss', {}).get('objects', {}).items()}
    manifest['inherited_assets'] = inherited
    manifest['files'].update({alias: previous['oss']['objects'][rel]['source'] for alias, rel in inherited.items()})
    author = [hybrid.read(path) for path in (ROOT/'sources/pages').glob('*/page.json')]
    report = delta.changes(previous, pin, root=ROOT, baseline_ref=ref)
    report['content_refresh'] = content.audit(ROOT)
    active_skills = set(report['content_refresh']['skills']['selected_current'] + report['content_refresh']['skills']['host_capabilities_outside_personal_supply'])
    redirects = {row['url']: row for row in author if row.get('kind') == 'skill-redirect'}
    report['pending_retired_routes'] = []
    for route in manifest['routes']:
        name = route.strip('/').split('/')
        if len(name) != 2 or name[0] != 'skills' or content.SKILL_ALIASES.get(name[1], name[1]) in active_skills: continue
        destination = redirects.get(route, {}).get('destination')
        links = {ref.split('#')[0] for ref, navigation in hybrid.references(merged/hybrid.route_file(route)) if navigation}
        if route not in converted or destination not in manifest['routes'] or destination not in links:
            report['pending_retired_routes'].append(route)
    report['pending_content_routes'] = sorted({hybrid.read(ROOT/row['path'])['url'] for row in report['files']
        if row['path'].startswith('sources/pages/') and row['path'].endswith('/page.json') and row['action'] != 'deleted'
        and hybrid.read(ROOT/row['path'])['url'] not in converted})
    report['pages'] = [{'route': hybrid.file_route(rel), 'before': previous['files'].get(rel), 'after': row} for rel, row in manifest['files'].items() if rel.endswith('.html') and previous['files'].get(rel) != row]
    report['affected']['pages'] = sorted(set(report['affected']['pages']) | {row['route'] for row in report['pages']})
    manifest.update(rules_pin=pin, publication_changes=report, publication_snapshot=report.pop('publication_snapshot'),
        astro={'schema': 'wly.astro-publication.v1', 'sample_commit': 'bbcf1c802ba4c9d36aa939bdbd7475e2772b0048', 'retained_sample': retained, 'converted_routes': sorted(converted), 'selected_pages': pages,
               'author_sources': len(author), 'unique_author_urls': len({row['url'] for row in author}),
               'html_files': sum(rel.endswith('.html') for rel in manifest['files']),
               'baseline_html_files': sum(rel.endswith('.html') for rel in previous['files'])})
    if manifest['astro']['html_files'] < manifest['astro']['baseline_html_files']: raise ValueError('A deployed HTML entry disappeared')
    manifest['release_id'] = hashlib.sha256(json.dumps(manifest['files'], sort_keys=True).encode()).hexdigest()
    write(merged/'release-manifest.json', manifest); hybrid.verify_release(merged)
    urls = sorted(route for route in manifest['routes'] if route.endswith('/') and route != '/system/')
    sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>https://wly0829.cn'+route+'</loc></url>' for route in urls) + '</urlset>\n'
    (merged/'sitemap.xml').write_text(sitemap, encoding='utf8')
    manifest.setdefault('release_overlay', {})['sitemap.xml'] = {'kind': 'astro_sitemap', 'before': previous['files'].get('sitemap.xml'), 'after': {'sha256': hybrid.digest(merged/'sitemap.xml'), 'bytes': (merged/'sitemap.xml').stat().st_size}}
    manifest['files']['sitemap.xml'] = manifest['release_overlay']['sitemap.xml']['after']
    manifest['release_id'] = hashlib.sha256(json.dumps(manifest['files'], sort_keys=True).encode()).hexdigest()
    write(merged/'release-manifest.json', manifest)
    preparation = output/'oss'
    oss.prepare(merged, args.asset_base_url, args.prefix, preparation, previous_manifest=args.baseline/'release-manifest.json')
    if author_inputs() != inputs or delta.snapshot(ROOT) != rendered_inputs:
        raise ValueError('Author sources changed during native conversion; rebuild this preparation')
    receipt = {'schema': 'wly.astro-preparation.v1', 'source': str(merged), 'oss_preparation': str(preparation),
        'baseline': str(args.baseline.resolve()), 'baseline_ref': ref, 'source_release_id': manifest['release_id'],
        'inputs': rendered_inputs, 'rules_pin': pin, 'selected_pages': sorted(converted), 'pages': {route: {'url': route, 'evidence': {'producer': 'astro'}} for route in converted},
        'batch': 'astro', 'release_id': manifest['release_id'], 'deferred_pages': [], 'publication_changes': report}
    write(output/'preparation.json', receipt); verify_preparation(output/'preparation.json')
    (output/'pages.txt').write_text('\n'.join(receipt['selected_pages']) + '\n', encoding='utf8')
    write(output/'batch.json', {'schema': 'wly.astro-batch.v1', 'page_list': 'pages.txt', 'paths':
        {'AstroPreparation': 'preparation.json', 'Baseline': receipt['baseline'], 'Release': 'source', 'BuildReport': 'preparation.json'}})
    print(json.dumps({'status': 'prepared', 'preparation': str(output/'preparation.json'), 'routes': len(manifest['routes']), **manifest['astro']}))


def verify_preparation(path, require_remote=False, directive=None, copy_to=None):
    receipt = hybrid.read(path); source = Path(receipt['source']); manifest = hybrid.verify_release(source)
    if receipt['schema'] != 'wly.astro-preparation.v1' or receipt['inputs'] != delta.snapshot(ROOT): raise ValueError('Astro source changed after preparation')
    if manifest['release_id'] != receipt['source_release_id']: raise ValueError('Prepared native release changed')
    astro_rules.verify(source, receipt['rules_pin'], astro_rules.inspect())
    plan = oss.verify_local(receipt['oss_preparation'])
    if plan['source_release_id'] != manifest['release_id']: raise ValueError('OSS split belongs to another Astro source')
    if require_remote:
        if manifest['publication_changes'].get('pending_retired_routes'):
            raise ValueError('Retired skill routes still expose the previous usable page: '+str(manifest['publication_changes']['pending_retired_routes']))
        if manifest['publication_changes'].get('pending_content_routes'):
            raise ValueError('Changed author pages still have previous published HTML: '+str(manifest['publication_changes']['pending_content_routes']))
        alignment = content.audit(ROOT)
        if not alignment['aligned']: raise ValueError('Author sources are not aligned; run refresh, send the content delta to Opus, and rebuild')
        if not plan.get('remote_verified'): raise ValueError('Astro assets have not passed full remote read-back')
        oss.verify_manifest(hybrid.read(Path(receipt['oss_preparation'])/'github/release-manifest.json'))
    if directive:
        approval = hybrid.read(directive)
        if (approval.get('release_id') not in (manifest['release_id'], plan['release_id']) or approval.get('instruction') != '发布'
                or approval.get('recorded_by') not in ('Claude', 'Codex') or approval.get('reviewed') is not True or not approval.get('source')
                or set(approval.get('pages', [])) != set(receipt['selected_pages']) or approval.get('build_report_sha256') != hybrid.digest(path)):
            raise ValueError('Actual publication instruction does not bind this exact native release')
    if copy_to: shutil.copytree(source, copy_to)
    return receipt


def main():
    parser = argparse.ArgumentParser(description=__doc__); commands = parser.add_subparsers(dest='command', required=True)
    refresh = commands.add_parser('refresh'); refresh.add_argument('--output', type=Path, required=True)
    build = commands.add_parser('prepare'); build.add_argument('--baseline', type=Path, default=ROOT/'site-release'); build.add_argument('--baseline-ref', default='main')
    build.add_argument('--asset-base-url', default='https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com'); build.add_argument('--prefix', required=True); build.add_argument('--output', type=Path, required=True)
    build.add_argument('--shell-assets', type=Path, help='The selected sample public assets, needed only before its first publication')
    check = commands.add_parser('verify'); check.add_argument('--preparation', type=Path); check.add_argument('--release', type=Path); check.add_argument('--offline', action='store_true')
    check.add_argument('--require-remote', action='store_true'); check.add_argument('--directive', type=Path); check.add_argument('--copy-to', type=Path); check.add_argument('--output', type=Path)
    args = parser.parse_args()
    if args.command == 'refresh':
        astro_rules.refresh(); report = content.audit(ROOT); write(args.output, report)
        print(json.dumps({'status': report['status'], 'version': report['rules']['version'], 'aligned': report['aligned'], 'output': str(args.output)}, ensure_ascii=False)); return
    if args.command == 'prepare': prepare(args); return
    if args.preparation: receipt = verify_preparation(args.preparation, args.require_remote, args.directive, args.copy_to)
    else:
        receipt = hybrid.verify_release(args.release); astro_rules.verify(args.release, receipt['rules_pin'], None if args.offline else astro_rules.inspect())
    if args.output: write(args.output, receipt)
    print(json.dumps({'status': 'pass', 'release_id': receipt['release_id']}))
if __name__ == '__main__': main()

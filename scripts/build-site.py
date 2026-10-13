"""Build the complete site from versioned sources and exact asset dependencies."""
import argparse
import concurrent.futures
import hashlib
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site-astro'
SNAPSHOT = SITE / 'sources/frozen-site'
HASH_CACHE_PATH = SITE / '.cache/file-fingerprints.json'
HASH_CACHE = None
VERIFICATION_HTML = ('baidu_verify_codeva-DRgaQnAmTK.html',)
sys.path.insert(0, str(ROOT / 'scripts'))
import astro_rules

def load(name, relative):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative)
    value = importlib.util.module_from_spec(spec); spec.loader.exec_module(value)
    return value

def read(path):
    return json.loads(Path(path).read_text('utf8'))

def write(path, value):
    path = Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf8')

def proof(path):
    global HASH_CACHE
    if HASH_CACHE is None: HASH_CACHE = read(HASH_CACHE_PATH) if HASH_CACHE_PATH.is_file() else {}
    path = Path(path); st = path.stat(); stamp = [st.st_size, st.st_mtime_ns, st.st_ctime_ns]; key = str(path)
    cached = HASH_CACHE.get(key)
    if not cached or cached['stamp'] != stamp:
        with path.open('rb') as stream:
            cached = {'stamp': stamp, 'proof': {'bytes': st.st_size, 'sha256': hashlib.file_digest(stream, 'sha256').hexdigest()}}
        HASH_CACHE[key] = cached
    return dict(cached['proof'])

def restore(snapshot):
    public = SITE / 'public'; cache_path = SITE / '.cache/materialized.json'
    cache = read(cache_path) if cache_path.is_file() else {}
    def checked(path, row):
        if not path.is_file(): return False
        st = path.stat(); stamp = [st.st_size, st.st_mtime_ns, st.st_ctime_ns]
        key = str(path)
        if cache.get(key, {}).get('stamp') != stamp:
            cache[key] = {'stamp': stamp, 'proof': proof(path)}
        return cache[key]['proof'] == {key: row[key] for key in ('bytes', 'sha256')}
    def asset(item):
        relative, row = item; target = public / relative
        if relative.startswith('_home-cockpit/cockpit-offline.') and not (SITE / 'sources/retained-home-cockpit/cockpit.html').is_file(): return
        if Path(relative).is_absolute() or '..' in Path(relative).parts: raise ValueError('Asset escapes public: ' + relative)
        if 'source_path' in row:
            source = ROOT / row['source_path']
        elif 'generated_title' in row:
            sys.path.insert(0, str(ROOT / 'src/typeset'))
            from engine.assets import title_ready
            source = Path(title_ready(str(ROOT / row['generated_title'])))
        else:
            source = SITE / 'sources/vendor-deps' / relative
        author_source = row.get('source_path', '').startswith(('site-astro/public/_home-cockpit/', 'site-astro/sources/retained-home-cockpit/'))
        expected = proof(source) if author_source else row
        if not checked(source, expected): raise ValueError('Asset source differs: ' + relative)
        if not checked(target, expected):
            target.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(source, target)
            if not checked(target, expected): raise ValueError('Asset copy differs: ' + relative)
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(asset, snapshot['assets'].items()))
    for relative, row in snapshot['pages'].items():
        source = SNAPSHOT / 'pages' / relative; target = public / relative
        if not checked(source, row): raise ValueError('Frozen page changed: ' + relative)
        if not checked(target, row):
            target.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(source, target)
    write(cache_path, cache)

def run(*args, cwd=SITE, env=None):
    subprocess.run(args, cwd=cwd, check=True, env=env)

def fingerprint(paths):
    files = set()
    for path in paths:
        path = Path(path)
        files.update(p for p in path.rglob('*') if p.is_file()) if path.is_dir() else files.add(path)
    digest = hashlib.sha256()
    for path in sorted(files):
        if '__pycache__' in path.parts or path.suffix in {'.pyc', '.pyo'}: continue
        digest.update(path.relative_to(ROOT).as_posix().encode() + b'\0')
        digest.update(proof(path)['sha256'].encode() if path.is_file() else b'missing')
    return digest.hexdigest()

def route_file(route):
    return 'index.html' if route == '/' else route.lstrip('/') if route.endswith('.html') else route.strip('/') + '/index.html'

def file_route(relative):
    return '/' if relative == 'index.html' else '/' + relative[:-10] if relative.endswith('/index.html') else '/' + relative

def normalize_route(route):
    route = route.strip()
    if not route.startswith('/') or any(x in route for x in ('..', '?', '#', '\\')):
        raise ValueError('Expected a site route such as /how/: ' + route)
    return route if route == '/' or route.endswith(('/', '.html')) else route + '/'

def copy_changed(source, target):
    if target.is_file() and proof(source) == proof(target): return False
    target.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(source, target)
    return True

def html_references(path):
    return {value for value in re.findall(r'''\b(?:src|href|data-src)=["']([^"']+)["']''', Path(path).read_text('utf8'))
            if re.search(r'\.(?:js|mjs|css|json|png|jpe?g|webp|avif|svg|gif|woff2?|ttf|mp4)(?:[?#]|$)', value)}

def guard_unchanged_html(dist, entries, previous_pages, published, previous_refs):
    changed = []
    for route, row in entries.items():
        rel = route_file(route); accepted = published.get('files', {}).get(rel)
        if previous_pages.get(route) != row['fingerprint'] or not accepted: continue
        path = dist / rel
        if proof(path)['sha256'] == accepted['sha256']: continue
        refs = html_references(path)
        differences = refs ^ previous_refs[route] if route in previous_refs else set()
        # A saved SHA cannot reconstruct old HTML. Only name an observed
        # reference difference; never invent the cause of a body-only change.
        details = (', '.join(sorted(differences)) if differences else
                   '本地引用未变；需核对已发布正文或内联内容' if route in previous_refs else '没有旧 HTML；已发布 SHA 无法还原差异引用')
        print('连带变化：' + route + '，原因资源：' + details, flush=True)
        changed.append(route)
    if '/' in changed and os.environ.get('SITE_ALLOW_HOME_BYTES') != '1':
        raise ValueError('首页字节连带变化；一次性重试脚本迁移须设置 SITE_ALLOW_HOME_BYTES=1')
    return changed

def markdown_frontmatter(path):
    match = re.match(r'^---\n(.*?)\n---\n', path.read_text('utf8'), re.S)
    if not match: raise ValueError('Missing JSON frontmatter: ' + str(path))
    return json.loads(match[1])

def retained_inputs(name, snapshot):
    base = SITE / 'sources/retained-home-cockpit'; html = base / (name + '.html')
    if name == 'cockpit' and not html.is_file(): return [SITE / 'src/pages/cockpit', SITE / 'src/cockpit', SITE / 'public/_overview']
    dependencies = read(base / 'dependencies.json'); bundled = read(base / 'manifest.json')['bundled']
    refs = set(re.findall(r'''["']((?:https?://|/|assets/)[^"'\s<>]+)["']''', html.read_text('utf8')))
    refs.update('/' + path for path in ({'home': ['_home-cockpit/time-labels.css', '_home-cockpit/home-cta.css'],
        'cockpit': ['_home-cockpit/cockpit-offline.css', '_home-cockpit/cockpit-offline.js'],
        'computer-access': []}[name] + ['_live/site-live-runtime.js']))
    if name != 'home': refs.update({'/_interactions/anchor-offset.css', '/_interactions/anchor-offset.js'})
    paths = [html, SITE / 'src/retained-page.ts',
        SITE / 'src/pages' / ('index.astro' if name == 'home' else name + '/index.astro')]
    if name == 'computer-access': paths += [SITE / 'src/styles/access-fixes.css', SITE / 'src/scripts/access-bird.js']  # retained-page.ts 内联它们
    if name != 'computer-access':
        paths += [SITE / 'src/styles/typeset-page.css', SITE / 'public/_album/astro-runtime.json',
            SITE / 'public/_living/quality-runtime/manifest.json']
    for ref in refs:
        relative = snapshot['runtime_urls'].get(ref, ref).split('?', 1)[0].split('#', 1)[0].lstrip('/')
        if relative.startswith('_home-cockpit/'):
            paths.append(SITE / 'public' / relative)
        if relative in bundled:
            paths.append((base / bundled[relative]['source']).resolve())
        elif relative in dependencies:
            row = dependencies[relative]
            paths.append(ROOT / row['source_path'] if 'source_path' in row else SITE / 'sources/vendor-deps' / relative)
        elif (SITE / 'public' / relative).is_file(): paths.append(SITE / 'public' / relative)
    return paths

def converted_markdown_matches(converter, name, md):
    try:
        source = markdown_frontmatter(md).get('source', {})
    except (ValueError, TypeError, AttributeError):
        return False
    author = ROOT / 'sources/pages' / name / 'page.json'
    if not isinstance(source, dict) or source.get('page') != f'sources/pages/{name}/page.json' or source.get('sha256') != proof(author)['sha256']:
        return False
    # The source SHA alone also survives manual body edits. Compare the actual
    # converter output, including layout, while keeping all writes isolated.
    with tempfile.TemporaryDirectory(prefix='wly-md-check-') as output:
        original = converter.OUT_MD, converter.OUT_PUBLIC
        try:
            converter.OUT_MD, converter.OUT_PUBLIC = output, str(Path(output) / 'public')
            converter.convert(name)
            expected = (Path(output) / (name + '.md')).read_text('utf8')
        except Exception as error:
            print(name + ': 无法核对转换来源，保留 Markdown：' + str(error)[:200], flush=True)
            return False
        finally:
            converter.OUT_MD, converter.OUT_PUBLIC = original
    actual_head, actual_body = md.read_text('utf8').split('\n---\n', 1)
    expected_head, expected_body = expected.split('\n---\n', 1)
    actual_meta, expected_meta = json.loads(actual_head[4:]), json.loads(expected_head[4:])
    for meta in (actual_meta, expected_meta): meta['source'].pop('converted_at_beijing', None)
    return actual_meta == expected_meta and actual_body == expected_body


def sync_markdown(previous):
    sys.path.insert(0, str(SITE / 'tools'))
    converter = load('build_converter', 'site-astro/tools/convert_page.py')
    converter_fp = fingerprint([SITE / 'tools/convert_page.py', SITE / 'tools/render_blocks.py',
        ROOT / 'src/typeset', ROOT / 'sources/assets', ROOT / 'sources/rules',
        SITE / 'src/chrome/toc-labels.json', ROOT / 'scripts/astro_rules.py',
        ROOT / 'config/model-roster.json', ROOT / 'scripts/how-demo-data.json'])
    converter_fp += json.dumps({k: v for k, v in os.environ.items() if k.startswith('CONVERT_')}, sort_keys=True)
    demo = Path(os.environ['CONVERT_STATUS_LINE_DEMO']) if os.environ.get('CONVERT_STATUS_LINE_DEMO') else None
    converter_fp += proof(demo)['sha256'] if demo and demo.is_file() else 'missing-demo'
    records, pending = {}, []
    for name in converter.all_pages():
        md = SITE / 'src/content/pages' / (name + '.md')
        author = ROOT / 'sources/pages' / name
        refs = {ref.split('.')[0] for p in author.glob('*.json') for ref in re.findall(r'\{\{([^{}]+)\}\}', p.read_text('utf8'))}
        dependencies = [ROOT / 'sources/pages' / ref for ref in refs if ref not in {'scale', 'roster', 'stories', 'rules'}]
        if 'scale' in refs: dependencies.append(ROOT / 'sources/pages')
        if 'group_counts' in refs: dependencies.append(ROOT / 'sources/pages/projects-home')
        source_fp = fingerprint([author, *dependencies]) + converter_fp
        old = previous.get(name, {}); current = proof(md)['sha256'] if md.is_file() else None
        direct = bool(current and (old.get('direct') or (old.get('md_sha256') and current != old['md_sha256'])))
        unchanged = old.get('fingerprint') == source_fp and old.get('md_sha256') == current
        generated = direct and not unchanged and converted_markdown_matches(converter, name, md)
        if generated: direct = False
        if not md.is_file() or (old and old.get('fingerprint') != source_fp and not direct and not generated): pending.append(name)
        elif direct:
            print(name + ': 保留直接编辑的 Markdown，不覆盖为 JSON 转换结果', flush=True)
        records[name] = {'fingerprint': source_fp, 'direct': direct}
    if pending: run(sys.executable, 'tools/convert_page.py', *pending)
    for name, row in records.items(): row['md_sha256'] = proof(SITE / 'src/content/pages' / (name + '.md'))['sha256']
    return records

def build(pages=None):
    started = time.monotonic(); previous_stage = started; steps = []
    source_clean = not subprocess.check_output(['git', 'status', '--porcelain', '--untracked-files=all'], cwd=ROOT)
    source_commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip() if source_clean else 'Unknown'
    def stage(name):
        nonlocal previous_stage
        now = time.monotonic(); seconds = round(now - previous_stage, 3); previous_stage = now
        steps.append({'name': name, 'seconds': seconds}); print(f'{name}: {seconds}s', flush=True)
    snapshot = read(SNAPSHOT / 'manifest.json'); dist = ROOT / 'dist'; public = SITE / 'public'
    retired = set(snapshot.get('retired_runtime_assets', []))
    finalized_before = (dist / 'release-manifest.json').is_file() and read(dist / 'release-manifest.json').get('finalized_dist', False)
    state_path = SITE / '.cache/build-state.json'; old = read(state_path) if state_path.is_file() else {}
    (dist / '.build-receipt.json').unlink(missing_ok=True)
    if snapshot['schema'] != 'wly.frozen-site.v1': raise ValueError('Unsupported frozen site')
    complete = all((dist / route_file(route)).is_file() for route in snapshot['routes'])
    if pages and not complete: raise ValueError('--pages requires a complete dist; first run npm run build')
    requested = {normalize_route(value) for value in pages.split(',')} if pages else None
    before = {file_route(p.relative_to(dist).as_posix()): proof(p) for p in dist.rglob('*.html')}
    before_refs = {file_route(p.relative_to(dist).as_posix()): html_references(p) for p in dist.rglob('*.html')}
    sources = sync_markdown(old.get('json_sources', {})); stage('source')
    preparation = [SNAPSHOT / 'manifest.json', SITE / 'sources/retained-home-cockpit',
        SITE / 'sources/vendor-deps', SITE / 'public/_home-cockpit', SITE / 'src/chrome/runtime',
        ROOT / 'sources/rules', ROOT / 'sources/assets', ROOT / 'src/typeset',
        SITE / 'tools/build_runtime.py', SITE / 'tools/pack_living.py', SITE / 'tools/adapt_motion.py',
        SITE / 'tools/cockpit_stutter.py', ROOT / 'scripts/astro_rules.py', ROOT / 'scripts/album-runtime.js',
        ROOT / 'scripts/album-runtime.css', ROOT / 'scripts/same-origin-runtime.py', ROOT / 'scripts/site-live-runtime.js']
    preparation += [ROOT / row['source_path'] for row in snapshot['assets'].values() if 'source_path' in row]
    stutter_inputs = [ROOT / 'scripts' / name for name in ['prepare-stutter-page.py', 'stutter-page-copy.json', 'stutter-page.html', 'stutter-page.js', 'stutter-page.css', 'site-live-runtime.js']]
    preparation += stutter_inputs
    prepared_fp = fingerprint(preparation)
    stage('fingerprint')
    prepare_changed = not complete or old.get('prepared') != prepared_fp or not (public / '_album/astro-runtime.json').is_file()
    prepare_changed = prepare_changed or any(not (dist / relative).is_file() for relative in snapshot['assets'] if relative not in retired and not (relative.startswith('_home-cockpit/cockpit-offline.') and not (SITE / 'sources/retained-home-cockpit/cockpit.html').is_file()))
    runtime = load('build_runtime', 'site-astro/tools/build_runtime.py')
    if prepare_changed:
        restore(snapshot); pin = astro_rules.generate(public); runtime.prepare(snapshot)
    else: pin = old['pin']
    stage('prepare')
    if prepare_changed:
        run(sys.executable, 'tools/pack_living.py'); run(sys.executable, 'tools/adapt_motion.py')
        load('build_stutter', 'site-astro/tools/cockpit_stutter.py').build(public)
        prepared_fp = fingerprint(preparation)
    stage('native_inputs')
    engine_fp = fingerprint([ROOT / 'src/typeset', ROOT / 'sources/assets', SITE / 'tools/render_blocks.py'])
    wrapper_paths = [p for p in (SITE / 'src').rglob('*') if p.is_file()
        and 'content' not in p.relative_to(SITE / 'src').parts and p.parent.name not in {'runtime', 'retained'}
        and p.name != 'retained-page.ts' and 'cockpit' not in p.relative_to(SITE / 'src').parts]
    wrapper_fp = fingerprint(wrapper_paths + [SITE / 'astro.config.mjs', SITE / 'package-lock.json'])
    entries = {}; render_fps = {}; fixed = {}
    for path in (SITE / 'src/pages').rglob('*.astro'):
        rel = path.relative_to(SITE / 'src/pages').as_posix()
        if '[' in rel: continue
        route = normalize_route('/' + rel.removesuffix('.astro').removesuffix('/index')) if rel != 'index.astro' else '/'
        if route in fixed: raise ValueError('同一路由由两处产出：' + route)
        fixed[route] = path
    for md in sorted((SITE / 'src/content/pages').glob('*.md')):
        fm = markdown_frontmatter(md); name = md.stem
        render_fps[name] = fingerprint([md, SITE / 'src/chrome/runtime' / (name + '.json')]) + engine_fp
        for route in [fm.get('url') or '/' + name + '/', *(fm.get('old_urls') or [])]:
            route = normalize_route(route)
            if route in {'/', '/cockpit/', '/computer-access/'}: continue
            if route in entries or route in fixed: raise ValueError('同一路由由两处产出：' + route)
            entries[route] = {'name': name, 'fingerprint': render_fps[name] + wrapper_fp, 'kind': 'native'}
    for name, route in [('home', '/'), ('cockpit', '/cockpit/'), ('computer-access', '/computer-access/')]:
        native_cockpit = name == 'cockpit' and "retainedPage('cockpit')" not in fixed[route].read_text('utf8')
        retained_fp = fingerprint([fixed[route], SITE / 'src/cockpit', SITE / 'public/_overview', SITE / 'src/chrome/living-engine.json'] if native_cockpit else retained_inputs(name, snapshot))
        entries[route] = {'fingerprint': retained_fp, 'kind': 'retained'}
    for relative in snapshot['pages']:
        entries.setdefault(file_route(relative), {'fingerprint': fingerprint([SNAPSHOT / 'pages' / relative]), 'kind': 'frozen'})
    generated_fp = fingerprint([ROOT / 'config/final-project-order.json', SITE / 'tools/cockpit_stutter.py'])
    for route in set(snapshot['routes']) - entries.keys():
        entries[route] = {'fingerprint': generated_fp, 'kind': 'generated'}
    entries['/cockpit/stutter/']['fingerprint'] = fingerprint(stutter_inputs + [SITE / 'tools/cockpit_stutter.py'])
    entries['/cv/'] = {'fingerprint': fingerprint([ROOT / 'scripts/build-site.py']), 'kind': 'generated'}
    visitor_fp = fingerprint([ROOT / 'scripts/visitor-beacon.js', ROOT / 'scripts/footer-email-copy.js'])
    for row in entries.values(): row['fingerprint'] += visitor_fp
    if requested and requested - entries.keys(): raise ValueError('Unknown routes: ' + ', '.join(sorted(requested - entries.keys())))
    selected = requested if requested is not None else set(entries)
    changed = {route for route in selected if not (dist / route_file(route)).is_file()
        or old.get('pages', {}).get(route) != entries[route]['fingerprint']}
    if '/404.html' in changed: changed.add('/404/')
    names = {entries[route]['name'] for route in changed if entries[route]['kind'] == 'native'}
    render_names = [name for name in sorted(names) if old.get('rendered', {}).get(name) != render_fps[name]
        or not (SITE / 'src/content/rendered' / (name + '.json')).is_file()]
    if render_names: run(sys.executable, 'tools/render_blocks.py', *render_names)
    for name in names:
        if read(SITE / 'src/content/rendered' / (name + '.json')).get('source_md_sha256') != proof(SITE / 'src/content/pages' / (name + '.md'))['sha256']:
            raise ValueError('Rendered Markdown changed: ' + name)
    stage('blocks')
    astro_routes = {route for route in changed if entries[route]['kind'] in {'native', 'retained'}}
    stage_dir = SITE / '.cache/astro-build'
    if astro_routes:
        env = {**os.environ, 'SITE_BUILD_PAGES': ','.join(sorted(astro_routes)), 'SITE_BUILD_OUT_DIR': str(stage_dir)}
        run('node', 'node_modules/astro/bin/astro.mjs', 'build', '--force', env=env)
        for route in astro_routes:
            source = stage_dir / route_file(route)
            if not source.is_file(): raise ValueError('Astro did not generate selected route: ' + route)
            copy_changed(source, dist / route_file(route))
    stage('astro')
    for path in dist.rglob('*.html'):
        if any('/' + rel in re.findall(r'<script\b[^>]*\b(?:data-)?src="([^"]+)"', path.read_text('utf8')) for rel in retired):
            raise ValueError('Retired runtime referenced: ' + str(path))
    assets_changed = False; asset_sources = dict(old.get('asset_sources', {}))
    for source_root in ([public] if prepare_changed or astro_routes else []) + ([stage_dir] if astro_routes else []):
        for source in source_root.rglob('*'):
            if not source.is_file(): continue
            relative = source.relative_to(source_root).as_posix()
            if relative in retired: continue
            if source.suffix == '.html':
                if source_root != public or file_route(relative) not in changed or file_route(relative) in astro_routes: continue
            else:
                key = ('public/' if source_root == public else 'astro/') + relative
                source_sha = proof(source)['sha256']
                if asset_sources.get(key) == source_sha and (dist / relative).is_file(): continue
                asset_sources[key] = source_sha
            assets_changed = copy_changed(source, dist / relative) or assets_changed
    for name in VERIFICATION_HTML:
        source = ROOT / 'public' / name
        if not source.is_file(): raise ValueError('Missing registered verification file: ' + name)
        assets_changed = copy_changed(source, dist / name) or assets_changed
    stage('assets')
    if '/cv/' in changed:
        target = dist / 'cv/index.html'; target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><noscript><meta http-equiv="refresh" content="0;url=/"></noscript></head><body></body></html>\n', encoding='utf8')
    converted = {route: {'producer': 'astro'} for route, row in entries.items() if row['kind'] != 'frozen'}
    if changed or prepare_changed or assets_changed:
        runtime.finish(dist, snapshot, pin, converted, changed_routes={r for r in changed if entries[r]['kind'] != 'frozen'})
    for relative, expected in snapshot['pages'].items():
        if entries[file_route(relative)]['kind'] != 'frozen' or (finalized_before and file_route(relative) not in changed): continue
        expected_body = runtime.transport.localize((SNAPSHOT / 'pages' / relative).read_bytes().decode('utf8'), snapshot)
        if relative == 'search/index.html': expected_body = runtime.search_index_entry(expected_body, snapshot)
        expected_body = runtime.visitor_html(expected_body)
        if (dist / relative).read_bytes() != expected_body.encode('utf8'):
            raise ValueError('Frozen HTML changed beyond resource addresses: ' + relative)
    if not all((dist / route_file(route)).is_file() for route in snapshot['routes']): raise ValueError('Complete build lost a required route')
    stage('finish')
    run(sys.executable, str(ROOT / 'scripts/prepare-oss-release.py'), 'finalize-dist', '--dist', str(dist), cwd=ROOT)
    guard_unchanged_html(dist, entries, old.get('pages', {}), runtime.published_manifest(), before_refs)
    stage('finalize')
    run('node', str(ROOT / 'scripts/verify-public-content.mjs'), '--dist', str(dist), '--incremental', cwd=ROOT)
    stage('public')
    files = [{'path': p.relative_to(dist).as_posix(), **proof(p)} for p in sorted(dist.rglob('*'))
        if p.is_file() and p.name != '.build-receipt.json']
    after = {file_route(row['path']): {key: row[key] for key in ('bytes', 'sha256')} for row in files if row['path'].endswith('.html')}
    rebuilt = changed | {route for route in after if before.get(route) != after[route]}
    stage('inventory')
    receipt = {'schema': 'wly.site-build-receipt.v1', 'status': 'built', 'source_commit': source_commit,
        'prepared_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(),
        'seconds': round(time.monotonic() - started, 3), 'steps': steps, 'rebuilt_pages': sorted(rebuilt),
        'html_files': len(after), 'files': files, 'output': str(dist)}
    manifest = read(dist / 'release-manifest.json')
    receipt.update({key: manifest.get(key) for key in ('previous_oss_source', 'previous_release_id')})
    write(dist / '.build-receipt.json', receipt)
    write(state_path, {'prepared': prepared_fp, 'pin': pin, 'json_sources': sources, 'asset_sources': asset_sources,
        'pages': {**old.get('pages', {}), **{route: entries[route]['fingerprint'] for route in changed}},
        'rendered': {**old.get('rendered', {}), **{name: render_fps[name] for name in render_names}}})
    write(SITE / '.cache/build-report.json', {key: value for key, value in receipt.items() if key != 'files'})
    print(json.dumps({key: value for key, value in receipt.items() if key != 'files'}, ensure_ascii=False))
    return receipt

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pages', help='Comma-separated site routes; requires an existing complete dist')
    try: build(parser.parse_args().pages)
    except Exception as error:
        write(ROOT / 'dist/.build-receipt.json', {'schema': 'wly.site-build-receipt.v1', 'status': 'failed', 'error': str(error)})
        raise
    finally:
        if HASH_CACHE is not None: write(HASH_CACHE_PATH, HASH_CACHE)

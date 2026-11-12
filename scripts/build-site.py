"""Build the complete site from versioned sources and exact asset dependencies."""
import argparse
import concurrent.futures
import contextlib
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
BUILD_LOG = None
VERIFICATION_FILES = ('baidu_verify_codeva-DRgaQnAmTK.html', 'sogousiteverification.txt')
sys.path.insert(0, str(ROOT / 'scripts'))
sys.path.insert(0, str(SITE / 'tools'))
import astro_rules
import oss_origins
from render_cache import ArtifactStore, markdown_render_sha
from render_blocks import asset_dependencies, asset_fingerprint, parse_md, RULE_FRAMES
from typeset_lock import verify_typeset_lock

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

def living_outputs():
    return {f'_living/{path.stem}/astro/shared-config.json': path.stem
        for path in (SITE / 'src/chrome/runtime').glob('*.json')
        if read(path).get('living_config') and (md := SITE / 'src/content/pages' / (path.stem + '.md')).is_file()
        and markdown_frontmatter(md).get('url') not in {'/', '/cockpit/', '/computer-access/'}}

def broken_living_outputs(outputs):
    broken = set(); public = SITE / 'public'
    for relative, name in outputs.items():
        rendered = SITE / 'src/content/rendered' / (name + '.json')
        if not rendered.is_file():
            broken.add(name); continue
        urls = {url for screen in read(rendered)['screens'] for side in ('h', 'v')
            for url in re.findall(r'data-living-config="([^"]+)"', screen.get(side, {}).get('overlay', ''))}
        if not urls: continue
        hashes = {match[1] for url in urls if (match := re.fullmatch(r'/assets/_fingerprinted/([a-f0-9]{64})\.json', url))}
        target = public / relative
        if len(urls) != 1 or len(hashes) != 1 or not target.is_file() or proof(target)['sha256'] not in hashes:
            broken.add(name)
        elif any(not (public / url.lstrip('/')).is_file() or proof(public / url.lstrip('/'))['sha256'] not in hashes for url in urls):
            broken.add(name)
    return broken

def restore(snapshot):
    public = SITE / 'public'; cache_path = SITE / '.cache/materialized.json'
    cache = read(cache_path) if cache_path.is_file() else {}; generated = living_outputs()
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
        # The current renderer owns these outputs; adapt_motion only rebuilds config.json.
        if relative in generated: return
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
    subprocess.run(args, cwd=cwd, check=True, env=env, stdout=BUILD_LOG, stderr=subprocess.STDOUT if BUILD_LOG else None)

def input_files(paths):
    files = set()
    for path in paths:
        path = Path(path)
        files.update(p for p in path.rglob('*') if p.is_file()) if path.is_dir() else files.add(path)
    return {path.relative_to(ROOT).as_posix(): proof(path)['sha256'] if path.is_file() else 'missing'
            for path in sorted(files) if '__pycache__' not in path.parts and path.suffix not in {'.pyc', '.pyo'}}

def fingerprint(paths):
    digest = hashlib.sha256()
    for name, value in input_files(paths).items():
        digest.update(name.encode() + b'\0'); digest.update(value.encode())
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

def input_fingerprints(dist, entries, old, completed, frozen, identity, runtime):
    routes = {}
    for route, entry in entries.items():
        row = runtime.input_record(entry['inputs']); output = proof(dist / route_file(route))['sha256']
        if route not in completed and old.get('pages', {}).get(route) != entry['fingerprint']:
            prior = old.get('input_fingerprints', {}).get('routes', {}).get(route, {})
            if prior.get('output_sha256') != output: raise ValueError('没有此页成品的构建输入：' + route)
            row = {**prior, 'current_fingerprint': row['fingerprint']}
        routes[route] = {**row, 'output_sha256': output}
    for name in VERIFICATION_FILES:
        if name.endswith('.html'):
            routes['/' + name] = {**runtime.input_record(input_files([ROOT / 'public' / name])), 'output_sha256': proof(dist / name)['sha256']}
    manifest = read(dist / 'release-manifest.json')
    site = {rel: {**runtime.input_record(values), 'output_sha256': proof(dist / rel)['sha256']}
            for rel, values in manifest.get('site_inputs', {}).items()}
    metadata = {'@content-files': runtime.value_sha({**manifest['files'], **manifest['oss']['objects']}),
                '@pages': runtime.value_sha(routes), '@site-files': runtime.value_sha(site),
                '@source-files': runtime.value_sha(frozen), '@source-identity': runtime.value_sha(identity),
                '@rules-pin': runtime.value_sha(manifest.get('rules_pin')), '@previous-release': manifest.get('previous_release_id')}
    site['release-manifest.json'] = runtime.input_record(metadata)
    site['release-identity.json'] = runtime.input_record({**metadata, '@release-id': manifest['release_id']})
    return {'schema': 'wly.site-input-fingerprints.v1', 'routes': routes, 'site_files': site,
            'source_files_sha256': frozen, 'source_identity': identity}

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
    if name == 'computer-access':
        paths += [SITE / 'src/styles/access-fixes.css', SITE / 'src/scripts/access-bird.js', SITE / 'src/chrome/living-engine.json',
            ROOT / 'app/computer-access-model.js', ROOT / 'scripts/b2-live-runtime.js',
            ROOT / 'scripts/update-live-release.py', ROOT / 'scripts/prepare-cockpit-cache.py',
            SITE / 'tools/computer_access_native.py']
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


def refresh_home_highlights():
    """Redraw home-04 when its embedded transcript no longer matches the owning project numbers."""
    highlights = load('build_home_highlights', 'scripts/prepare-home-highlights.py')
    home = SITE / 'sources/retained-home-cockpit/home.html'
    if highlights.transcript_current(home.read_text('utf8')): return False
    print('首页亮点：嵌入的数字与所属项目登记不一致，自动重画 home-04', flush=True)
    try:
        highlights.regenerate(SITE / '.cache/home-highlights')
    except Exception as error:
        raise ValueError('首页亮点重画失败，构建停止，不沿用旧首页：' + str(error)[:300]) from error
    if not highlights.transcript_current(home.read_text('utf8')):
        raise ValueError('首页亮点重画后转写仍与当前数字不一致，构建停止')
    return True

def sync_markdown(previous):
    sys.path.insert(0, str(SITE / 'tools'))
    converter = load('build_converter', 'site-astro/tools/convert_page.py')
    converter_fp = fingerprint([SITE / 'tools/convert_page.py', SITE / 'tools/site_consistency.py', SITE / 'tools/render_blocks.py',
        ROOT / 'src/typeset', ROOT / 'sources/rules',
        SITE / 'src/chrome/toc-labels.json', ROOT / 'scripts/astro_rules.py',
        ROOT / 'config/model-roster.json', ROOT / 'scripts/how-demo-data.json'])
    converter_fp += json.dumps({k: v for k, v in os.environ.items() if k.startswith('CONVERT_')}, sort_keys=True)
    demo = Path(os.environ['CONVERT_STATUS_LINE_DEMO']) if os.environ.get('CONVERT_STATUS_LINE_DEMO') else None
    converter_fp += proof(demo)['sha256'] if demo and demo.is_file() else 'missing-demo'
    records, pending, blocked = {}, [], []
    for name in converter.all_pages():
        md = SITE / 'src/content/pages' / (name + '.md')
        author = ROOT / 'sources/pages' / name
        refs = {ref.split('.')[0] for p in author.glob('*.json') for ref in re.findall(r'\{\{([^{}]+)\}\}', p.read_text('utf8'))}
        dependencies = [ROOT / 'sources/pages' / ref for ref in refs if ref not in {'scale', 'roster', 'stories', 'rules'}]
        if 'scale' in refs: dependencies.append(ROOT / 'sources/pages')
        if 'group_counts' in refs: dependencies.append(ROOT / 'sources/pages/projects-home')
        author_fp = fingerprint([author, *dependencies])
        source_fp = author_fp + converter_fp + converter.page_asset_fingerprint(name, lambda p: proof(p)['sha256'])
        old = previous.get(name, {}); current = proof(md)['sha256'] if md.is_file() else None
        if not current:
            pending.append(name)
        elif markdown_frontmatter(md).get('source', {}).get('sha256') != proof(author / 'page.json')['sha256']:
            if old.get('md_sha256') and old['md_sha256'] != current:
                blocked.append(name)
            else:
                pending.append(name)
        elif not converted_markdown_matches(converter, name, md):
            if old.get('md_sha256') == current and old.get('fingerprint') != source_fp:
                pending.append(name)
            else:
                blocked.append(name)
        records[name] = {'fingerprint': source_fp, 'author_fp': author_fp, 'direct': False,
                         'inputs': input_files([author, *dependencies])}
    if blocked:
        raise ValueError('Markdown 与当前 page.json 转换结果不一致：' + '、'.join(blocked))
    if pending: run(sys.executable, 'tools/convert_page.py', *pending)
    for name, row in records.items(): row['md_sha256'] = proof(SITE / 'src/content/pages' / (name + '.md'))['sha256']
    return records

@contextlib.contextmanager
def trial_routes():
    fixed = [p for p in (SITE / 'src/pages').rglob('*.astro') if '[' not in p.name]
    try:
        for path in fixed: path.rename(path.with_suffix('.astro.trial'))
        yield
    finally:
        for path in fixed:
            if path.with_suffix('.astro.trial').exists(): path.with_suffix('.astro.trial').rename(path)


def trial_build(names, dist, report, baseline_rendered=None):
    """Build draft author pages without requiring or finalizing a complete release."""
    from page_checks import page_result, issue, write_checks
    names = list(dict.fromkeys(names.split(',')))
    if not names or any(not re.fullmatch(r'[A-Za-z0-9_-]+', n) for n in names):
        raise ValueError('Expected author page names')
    verify_typeset_lock(ROOT)
    load('trial_render_environment', 'site-astro/tools/render_blocks.py').verify_render_lock()
    dist, report = Path(dist).resolve(), Path(report).resolve()
    dist.mkdir(parents=True, exist_ok=True); report.parent.mkdir(parents=True, exist_ok=True)
    rows = {n: page_result(n) for n in names}
    for n, row in rows.items():
        try:
            fm = markdown_frontmatter(SITE / 'src/content/pages' / (n + '.md')) if (SITE / 'src/content/pages' / (n + '.md')).is_file() else read(ROOT / 'sources/pages' / n / 'page.json')
            row['route'] = normalize_route(fm.get('url') or '/' + n + '/')
            if row['route'] in {'/', '/cockpit/', '/computer-access/'}: raise ValueError('Trial requires an author-rendered page: ' + n)
            (dist / route_file(row['route'])).unlink(missing_ok=True)
        except (OSError, ValueError, KeyError) as error:
            row.update(passed=False, errors=[issue('route_invalid', None, str(error))])
    work = Path(os.environ.get('BLOCK_WORK_DIR') or SITE / '.cache/blocks')
    print('成品取回：' + json.dumps(ArtifactStore().restore(SITE, work)), flush=True)
    snapshot = read(SNAPSHOT / 'manifest.json')
    restore(snapshot); load('trial_runtime', 'site-astro/tools/build_runtime.py').prepare(snapshot)
    run(sys.executable, 'tools/pack_living.py'); run(sys.executable, 'tools/adapt_motion.py', *names)
    for stage, script, key in [('conversion', 'convert_page.py', 'CONVERT_PAGE_CHECKS'), ('render', 'render_blocks.py', 'BLOCK_PAGE_CHECKS')]:
        selected = [n for n, row in rows.items() if row['passed']]
        if not selected: break
        receipt = report.with_name(stage + '-page-checks.json')
        receipt.unlink(missing_ok=True)
        env = {**os.environ, key: str(receipt)}
        if baseline_rendered:
            env.update(BLOCK_LAYOUT_BASELINE=str(Path(baseline_rendered).resolve()),
                       BLOCK_LAYOUT_RECEIPT=str(report.with_name('layout-diff.json')))
        subprocess.run([sys.executable, '-B', '-X', 'utf8', str(SITE / 'tools' / script), *selected], cwd=SITE, env=env, check=False)
        checked = {p['page']: p for p in read(receipt)['pages']}
        for n in selected:
            result = checked.get(n, page_result(n, ValueError('Missing stage receipt'), 'missing_stage_receipt')); rows[n]['passed'] = result['passed']
            rows[n]['errors'] += [dict(e, stage=stage) for e in result['errors']]
            rows[n]['warnings'] += result.get('warnings', [])
    with trial_routes():
        for n, row in rows.items():
            if not row['passed']: continue
            try:
                fm = markdown_frontmatter(SITE / 'src/content/pages' / (n + '.md'))
                row['route'] = normalize_route(fm.get('url') or '/' + n + '/')
                rendered = SITE / 'src/content/rendered' / (n + '.json')
                if read(rendered).get('render_md_sha256') != markdown_render_sha(SITE / 'src/content/pages' / (n + '.md')):
                    raise ValueError('Rendered Markdown changed: ' + n)
                with tempfile.TemporaryDirectory(prefix='astro-', dir=dist.parent) as temporary:
                    stage = Path(temporary)
                    env = {**os.environ, 'SITE_BUILD_PAGES': row['route'], 'SITE_BUILD_OUT_DIR': str(stage)}
                    run('node', 'node_modules/astro/bin/astro.mjs', 'build', '--force', env=env)
                    source = stage / route_file(row['route'])
                    if not source.is_file(): raise ValueError('Astro did not generate selected route: ' + row['route'])
                    copy_changed(source, dist / route_file(row['route']))
                    for path in stage.rglob('*'):
                        if path.is_file() and path.suffix != '.html': copy_changed(path, dist / path.relative_to(stage))
                row.update(html=str(dist / route_file(row['route'])), rendered=str(rendered))
            except (OSError, ValueError, subprocess.SubprocessError) as error:
                row['passed'] = False; row['errors'].append(issue('astro_failed', None, str(error)))
                (dist / route_file(row['route'])).unlink(missing_ok=True)
    for source in (SITE / 'public').rglob('*'):
        if source.is_file() and source.suffix != '.html': copy_changed(source, dist / source.relative_to(SITE / 'public'))
    result = write_checks(report, 'trial-build', list(rows.values()))
    result.update(output=str(dist), passed=all(row['passed'] for row in rows.values()))
    write(report, result)
    return result


def build(pages=None, check_lock_only=False):
    started = time.monotonic(); previous_stage = started; steps = []
    verify_typeset_lock(ROOT)
    load('render_environment', 'site-astro/tools/render_blocks.py').verify_render_lock()
    if check_lock_only: return
    # Redraw before reading source cleanliness: a redraw rewrites tracked author inputs,
    # so an uncommitted redraw must leave the build source Unknown instead of HEAD.
    home_redrawn = refresh_home_highlights()
    def stage(name):
        nonlocal previous_stage
        now = time.monotonic(); seconds = round(now - previous_stage, 3); previous_stage = now
        steps.append({'name': name, 'seconds': seconds}); print(f'{name}: {seconds}s', flush=True)
    stage('home_highlights')
    snapshot = read(SNAPSHOT / 'manifest.json'); dist = ROOT / 'dist'; public = SITE / 'public'
    retired = set(snapshot.get('retired_runtime_assets', []))
    finalized_before = (dist / 'release-manifest.json').is_file() and read(dist / 'release-manifest.json').get('finalized_dist', False)
    state_path = SITE / '.cache/build-state.json'; old = read(state_path) if state_path.is_file() else {}
    (dist / '.build-receipt.json').unlink(missing_ok=True)
    if snapshot['schema'] != 'wly.frozen-site.v1': raise ValueError('Unsupported frozen site')
    complete = all((dist / route_file(route)).is_file() for route in snapshot['routes'])
    if pages and not complete: raise ValueError('--pages requires a complete dist; first run npm run build')
    requested = {normalize_route(value) for value in pages.split(',')} if pages else None
    if requested and home_redrawn: requested.add('/')
    before = {file_route(p.relative_to(dist).as_posix()): proof(p) for p in dist.rglob('*.html')}
    checks = load('site_consistency', 'site-astro/tools/site_consistency.py').audit()
    checks_path = SITE / '.cache/site-consistency.json'; write(checks_path, checks)
    sources = sync_markdown(old.get('json_sources', {})); stage('source')
    artifacts = ArtifactStore(); block_work = Path(os.environ.get('BLOCK_WORK_DIR') or SITE / '.cache/blocks')
    print('成品取回：' + json.dumps(artifacts.restore(SITE, block_work)), flush=True)
    preparation = [ROOT / 'config/build.json', ROOT / 'scripts/oss_origins.py', SNAPSHOT / 'manifest.json', SITE / 'sources/retained-home-cockpit',
        SITE / 'sources/vendor-deps', SITE / 'sources/hero-motion', SITE / 'public/_home-cockpit', SITE / 'src/chrome/runtime',
        ROOT / 'sources/rules', ROOT / 'src/typeset',
        SITE / 'tools/build_runtime.py', SITE / 'tools/pack_living.py', SITE / 'tools/adapt_motion.py',
        SITE / 'tools/cockpit_stutter.py', ROOT / 'scripts/astro_rules.py', ROOT / 'scripts/album-runtime.js',
        ROOT / 'scripts/album-runtime.css', ROOT / 'scripts/same-origin-runtime.py', ROOT / 'scripts/site-live-runtime.js',
        ROOT / 'scripts/update-live-release.py']
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
    frozen_urls = sorted(p['url'] for p in checks['frozen_projects'])
    engine_paths = [ROOT / 'src/typeset', ROOT / 'config/render.lock.json', SITE / 'tools/render_blocks.py',
        SITE / 'tools/render_cache.py', SITE / 'tools/site_consistency.py']
    engine_fp = fingerprint(engine_paths) + hashlib.sha256(json.dumps(frozen_urls).encode()).hexdigest()
    wrapper_paths = [p for p in (SITE / 'src').rglob('*') if p.is_file()
        and 'content' not in p.relative_to(SITE / 'src').parts and p.parent.name not in {'runtime', 'retained'}
        and p.name != 'retained-page.ts' and 'cockpit' not in p.relative_to(SITE / 'src').parts]
    wrapper_paths += [SITE / 'astro.config.mjs', SITE / 'package-lock.json', public / '_living/quality-runtime/manifest.json']
    wrapper_fp = fingerprint(wrapper_paths)
    common_inputs = input_files(engine_paths + wrapper_paths)
    common_inputs['@frozen-project-routes'] = runtime.value_sha(frozen_urls)
    def entry(paths, kind):
        return {'fingerprint': fingerprint(paths), 'inputs': input_files(paths), 'kind': kind}
    entries = {}; render_fps = {}; fixed = {}
    for path in (SITE / 'src/pages').rglob('*.astro'):
        rel = path.relative_to(SITE / 'src/pages').as_posix()
        if '[' in rel: continue
        route = normalize_route('/' + rel.removesuffix('.astro').removesuffix('/index')) if rel != 'index.astro' else '/'
        if route in fixed: raise ValueError('同一路由由两处产出：' + route)
        fixed[route] = path
    for md in sorted((SITE / 'src/content/pages').glob('*.md')):
        fm = markdown_frontmatter(md); name = md.stem
        runtime_path = SITE / 'src/chrome/runtime' / (name + '.json')
        render_inputs = [md, runtime_path]
        living_config = read(runtime_path).get('living_config') if runtime_path.is_file() else None
        if living_config: render_inputs.append(public / living_config.lstrip('/'))
        screens = parse_md(md)[1]
        if fm.get('url', '').startswith('/rules/') and any(meta['screen'].get('shape') == 'source_text' for meta, _ in screens):
            render_inputs += [ROOT / 'sources/assets' / path for path in RULE_FRAMES]
        assets = [screens, *[p.as_uri() for p in render_inputs[1:] if p.is_file()]]
        render_fps[name] = markdown_render_sha(md) + fingerprint(render_inputs[1:]) + engine_fp + asset_fingerprint(assets, lambda p: proof(p)['sha256'])
        page_inputs = {**common_inputs, **sources.get(name, {}).get('inputs', {}),
                       **input_files(render_inputs + list(asset_dependencies(assets)))}
        for route in [fm.get('url') or '/' + name + '/', *(fm.get('old_urls') or [])]:
            route = normalize_route(route)
            if route in {'/', '/cockpit/', '/computer-access/'}: continue
            if route in entries or route in fixed: raise ValueError('同一路由由两处产出：' + route)
            entries[route] = {'name': name, 'fingerprint': render_fps[name] + wrapper_fp, 'kind': 'native', 'inputs': page_inputs}
    for name, route in [('home', '/'), ('cockpit', '/cockpit/'), ('computer-access', '/computer-access/')]:
        native_cockpit = name == 'cockpit' and "retainedPage('cockpit')" not in fixed[route].read_text('utf8')
        entries[route] = entry([fixed[route], SITE / 'src/cockpit', SITE / 'public/_overview', SITE / 'src/chrome/living-engine.json',
            ROOT / 'scripts/today-river.js', ROOT / 'scripts/today-river.css', ROOT / 'sources/creative/today-river/assets2'] if native_cockpit else retained_inputs(name, snapshot), 'retained')
    for slug, scripts in {'storage': ['storage.js', 'storage.css'], 'ai': [], 'projects': ['projects.js', 'projects.css']}.items():
        route = '/cockpit/' + slug + '/'
        entries[route] = entry([fixed[route], *([SITE / 'src/cockpit'] if slug == 'ai' else
            [SITE / 'src/cockpit' / name for name in ['cockpit.css', *scripts]])], 'retained')
        entries[route]['fingerprint'] += wrapper_fp
        entries[route]['inputs'].update(input_files(wrapper_paths))
    for relative in snapshot['pages']:
        path = SNAPSHOT / 'pages' / relative
        assets = asset_dependencies(runtime.transport.localize(path.read_text('utf8'), snapshot))
        entries.setdefault(file_route(relative), entry([path, *assets], 'frozen'))
    generated_paths = [ROOT / 'config/final-project-order.json', SITE / 'tools/cockpit_stutter.py']
    for route in sorted(set(snapshot['routes']) - entries.keys()):
        entries[route] = entry(generated_paths, 'generated')
    entries['/cockpit/stutter/'] = entry(stutter_inputs + [SITE / 'tools/cockpit_stutter.py'], 'generated')
    entries['/cv/'] = entry([ROOT / 'scripts/build-site.py'], 'generated')
    visitor_paths = [ROOT / 'config/build.json', ROOT / 'scripts/oss_origins.py', ROOT / 'scripts/visitor-beacon.js', ROOT / 'scripts/footer-email-copy.js', ROOT / 'scripts/header-menu.js',
                     ROOT / 'scripts/prepare-oss-release.py', SITE / 'tools/build_runtime.py']
    visitor_fp = fingerprint(visitor_paths)
    for row in entries.values():
        row['fingerprint'] += visitor_fp; row['inputs'] = {**row['inputs'], **input_files(visitor_paths)}
    entries['/404.html'] = {**entries['/404/'], 'kind': 'copy'}
    if requested and requested - entries.keys(): raise ValueError('Unknown routes: ' + ', '.join(sorted(requested - entries.keys())))
    selected = requested if requested is not None else set(entries)
    generated_living = living_outputs(); broken_living = broken_living_outputs(generated_living)
    changed = {route for route in selected if not (dist / route_file(route)).is_file()
        or old.get('pages', {}).get(route) != entries[route]['fingerprint'] or entries[route].get('name') in broken_living}
    if '/404.html' in changed: changed.add('/404/')
    if '/404/' in changed: changed.add('/404.html')
    frozen = {key: value for row in entries.values() for key, value in row['inputs'].items() if not key.startswith('@')}
    frozen.update(input_files([ROOT / 'scripts/build-site.py', ROOT / 'scripts/prepare-oss-release.py',
                               SITE / 'tools/build_runtime.py', SITE / 'tools/convert_page.py', *[ROOT / 'public' / name for name in VERIFICATION_FILES]]))
    identity = runtime.source_identity(ROOT); source_commit = identity['source_commit']
    names = {entries[route]['name'] for route in changed if entries[route]['kind'] == 'native'}
    render_names = [name for name in sorted(names) if old.get('rendered', {}).get(name) != render_fps[name]
        or not (SITE / 'src/content/rendered' / (name + '.json')).is_file() or name in broken_living]
    if render_names: run(sys.executable, 'tools/render_blocks.py', *render_names)
    invalid_living = broken_living_outputs({relative: name for relative, name in generated_living.items() if name in names})
    if invalid_living: raise ValueError('Generated living config differs: ' + '、'.join(sorted(invalid_living)))
    for name in names:
        if read(SITE / 'src/content/rendered' / (name + '.json')).get('render_md_sha256') != markdown_render_sha(SITE / 'src/content/pages' / (name + '.md')):
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
    if '/computer-access/' in astro_routes:
        load('build_computer_access', 'site-astro/tools/computer_access_native.py').build(public, dist / 'computer-access/index.html')
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
    for name in VERIFICATION_FILES:
        source = ROOT / 'public' / name
        if not source.is_file(): raise ValueError('Missing registered verification file: ' + name)
        assets_changed = copy_changed(source, dist / name) or assets_changed
    assets_changed = astro_rules.prune_rule_sources(dist, pin) or assets_changed
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
        expected_body = oss_origins.rewrite_origins(runtime.visitor_html(expected_body))
        if (dist / relative).read_bytes() != expected_body.encode('utf8'):
            raise ValueError('Frozen HTML changed beyond resource addresses: ' + relative)
    if not all((dist / route_file(route)).is_file() for route in snapshot['routes']): raise ValueError('Complete build lost a required route')
    stage('finish')
    run(sys.executable, str(ROOT / 'scripts/prepare-oss-release.py'), 'finalize-dist', '--dist', str(dist),
        '--source-commit', source_commit, cwd=ROOT)
    inputs = input_fingerprints(dist, entries, old, changed, frozen, identity, runtime)
    runtime.verify_inputs(inputs, ROOT); runtime.seal_inputs(dist, inputs)
    reconciliation = runtime.reconcile(dist, inputs, runtime.published_manifest())
    write(SITE / '.cache/published-reconciliation.json', reconciliation)
    if reconciliation['drift']: raise ValueError('输入未变但成品改变：' + '、'.join(reconciliation['drift']))
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
        'html_files': len(after), 'files': files, 'output': str(dist), 'checks': checks, 'checks_file': str(checks_path),
        'input_fingerprints': inputs, 'published_reconciliation': reconciliation}
    manifest = read(dist / 'release-manifest.json')
    receipt.update({key: manifest.get(key) for key in ('previous_oss_source', 'previous_release_id')})
    write(dist / '.build-receipt.json', receipt)
    write(state_path, {'prepared': prepared_fp, 'pin': pin, 'json_sources': sources, 'asset_sources': asset_sources, 'input_fingerprints': inputs,
        'pages': {**old.get('pages', {}), **{route: entries[route]['fingerprint'] for route in changed}},
        'rendered': {**old.get('rendered', {}), **{name: render_fps[name] for name in render_names}}})
    write(SITE / '.cache/build-report.json', {key: value for key, value in receipt.items() if key != 'files'})
    print('成品存入：' + json.dumps(artifacts.save(SITE, block_work)), flush=True)
    return receipt

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pages', help='Comma-separated site routes; requires an existing complete dist')
    parser.add_argument('--trial-pages', help='Comma-separated author page names; never finalize or publish')
    parser.add_argument('--dist', type=Path, help='Trial output; selected old HTML is removed before building')
    parser.add_argument('--report', type=Path, help='Trial page checks JSON')
    parser.add_argument('--baseline-rendered', type=Path, help='Previous rendered JSON for layout comparison')
    parser.add_argument('--check-render-lock', action='store_true', help='Check shared inputs and fixed browser/fonts only')
    args = parser.parse_args()
    if args.trial_pages:
        if not args.dist or not args.report: parser.error('--trial-pages requires --dist and --report')
        result = trial_build(args.trial_pages, args.dist, args.report, args.baseline_rendered)
        print(json.dumps(result, ensure_ascii=False))
        raise SystemExit(0 if result['passed'] else 1)
    if args.check_render_lock:
        build(check_lock_only=True)
        print('共用排版层与固定浏览器、字体检查通过')
        raise SystemExit(0)
    log_path = SITE / '.cache/build-commands.log'; log_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with log_path.open('w', encoding='utf8') as log, contextlib.redirect_stdout(log):
            BUILD_LOG = log
            result = build(args.pages)
        print(json.dumps({'status': 'built', 'html_files': result['html_files'], 'rebuilt_pages': len(result['rebuilt_pages']),
            'comparison_baseline': result['published_reconciliation']['baseline'],
            'changed_pages': result['published_reconciliation']['pages'], 'changed_site_files': result['published_reconciliation']['site_files'],
            'frozen_mentions': len(result['checks']['frozen_mentions']), 'skill_missing': len(result['checks']['skills'].get('missing', [])),
            'rule_frozen_diff': len(result['checks']['rule_frozen'].get('site_not_rules', [])) + len(result['checks']['rule_frozen'].get('rules_not_site', [])),
            'model_mismatches': len(result['checks']['models'].get('mismatches', [])),
            'receipt': str(ROOT / 'dist/.build-receipt.json'), 'checks': result['checks_file'], 'log': str(log_path)}, ensure_ascii=False))
    except Exception as error:
        write(ROOT / 'dist/.build-receipt.json', {'schema': 'wly.site-build-receipt.v1', 'status': 'failed', 'error': str(error)})
        print(json.dumps({'status': 'failed', 'error': str(error)[:500], 'receipt': str(ROOT / 'dist/.build-receipt.json'),
            'log': str(log_path)}, ensure_ascii=False))
        raise SystemExit(1)
    finally:
        if HASH_CACHE is not None: write(HASH_CACHE_PATH, HASH_CACHE)

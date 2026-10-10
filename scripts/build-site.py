"""Build the complete site from versioned sources and exact asset dependencies."""
import argparse
import concurrent.futures
import hashlib
import importlib.util
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site-astro'
SNAPSHOT = SITE / 'sources/frozen-site'
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
    with Path(path).open('rb') as stream:
        return {'bytes': Path(path).stat().st_size, 'sha256': hashlib.file_digest(stream, 'sha256').hexdigest()}


def seed_asset(relative):
    """Return the exact versioned search/runtime seed, without reading a deployment."""
    row = read(SNAPSHOT / 'manifest.json')['assets'][relative]
    path = ROOT / row['source_path']
    if proof(path) != {key: row[key] for key in ('bytes', 'sha256')}:
        raise ValueError('Versioned asset changed: ' + relative)
    return path


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
        if Path(relative).is_absolute() or '..' in Path(relative).parts: raise ValueError('Asset escapes public: ' + relative)
        if 'source_path' in row:
            source = ROOT / row['source_path']
        elif 'generated_title' in row:
            sys.path.insert(0, str(ROOT / 'src/typeset'))
            from engine.assets import title_ready
            source = Path(title_ready(str(ROOT / row['generated_title'])))
        else:
            source = SITE / '.cache/remote-assets' / row['sha256']
            if not checked(source, row):
                oss = load('build_asset_oss', 'scripts/prepare-oss-release.py')
                oss.verify_object_with_retries(None, relative, {**row, 'url': row['verified_url'],
                    'content_type': oss.content_type(relative)}, 'https://wly0829.cn', 60, download_to=source)
        if not checked(source, row): raise ValueError('Asset source differs: ' + relative)
        if not checked(target, row):
            target.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(source, target)
            if not checked(target, row): raise ValueError('Asset copy differs: ' + relative)
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(asset, snapshot['assets'].items()))
    for relative, row in snapshot['pages'].items():
        source = SNAPSHOT / 'pages' / relative; target = public / relative
        if not checked(source, row): raise ValueError('Frozen page changed: ' + relative)
        if not checked(target, row):
            target.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(source, target)
    write(cache_path, cache)


def run(*args, cwd=SITE):
    subprocess.run(args, cwd=cwd, check=True)


def build():
    started = time.monotonic(); snapshot = read(SNAPSHOT / 'manifest.json')
    stages = {}; previous_stage = started
    def stage(name):
        nonlocal previous_stage
        now = time.monotonic(); stages[name] = round(now - previous_stage, 2); previous_stage = now
        print(name + ': ' + str(stages[name]) + 's', flush=True)
    if snapshot['schema'] != 'wly.frozen-site.v1': raise ValueError('Unsupported frozen site')
    restore(snapshot); pin = astro_rules.generate(SITE / 'public')
    transport = load('build_same_origin', 'scripts/same-origin-runtime.py')
    transport.localize(SITE / 'public', snapshot, patch_readers=True)
    live_target = SITE / 'public/_live/site-live-runtime.js'; live_target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / 'scripts/site-live-runtime.js', live_target)
    stage('restore')
    # These native inputs live in the repository; no previous build is extracted.
    run(sys.executable, 'tools/convert_page.py', '--all')
    run(sys.executable, 'tools/pack_living.py')
    run(sys.executable, 'tools/adapt_motion.py')
    stutter = load('build_stutter', 'site-astro/tools/cockpit_stutter.py').build(SITE / 'public')
    stage('native_inputs')
    run(sys.executable, 'tools/render_blocks.py', '--all')
    stage('blocks')
    rendered = {path.stem: read(path) for path in (SITE / 'src/content/rendered').glob('*.json')}
    for page in (SITE / 'src/content/pages').glob('*.md'):
        if rendered.get(page.stem, {}).get('source_md_sha256') != proof(page)['sha256']:
            raise ValueError('Rendered Markdown changed: ' + page.stem)
    run('node', 'node_modules/astro/bin/astro.mjs', 'build', '--force')
    stage('astro')
    dist = SITE / 'dist'
    prepare = load('build_preparation', 'scripts/prepare-astro-release.py')
    hybrid = prepare.hybrid
    prepare.retired_project_routes(dist, {'routes': snapshot['routes']})
    shutil.copyfile(dist / '404/index.html', dist / '404.html')
    frozen = set(snapshot['pages'])
    converted = {hybrid.file_route(path.relative_to(dist).as_posix()): {'producer': 'astro'}
                 for path in dist.rglob('*.html') if path.relative_to(dist).as_posix() not in frozen}
    nav = hybrid.nav_repair
    navigation = {nav.route_file(route): SimpleNamespace(ids=set()) for route in snapshot['routes']}
    for route in set(converted) & set(nav.SITE_NAVIGATION.values()) - {'/', '/cockpit/', '/computer-access/'}:
        path = dist / nav.route_file(route)
        body, _ = nav.repair_owned_navigation(path.read_text('utf8'), navigation, owner_route=route)
        path.write_text(body, encoding='utf8', newline='')
    # Search follows current native content while preserving the frozen modules.
    previous = {'oss': {'objects': snapshot['search_objects']}, 'files': snapshot['pages']}
    prepare.sync_search(dist, previous, converted, pin)
    transport.localize(dist, snapshot)
    transport.verify(dist)
    stage('search')
    finalize = load('build_album_routes', 'site-astro/tools/retain_home_cockpit.py').finalize_runtime(SITE)
    routes = sorted(hybrid.file_route(path.relative_to(dist).as_posix()) for path in dist.rglob('*.html'))
    if not set(snapshot['routes']) <= set(routes): raise ValueError('Complete build lost a required route')
    for relative in snapshot['pages']:
        expected = (SNAPSHOT / 'pages' / relative).read_text('utf8')
        expected = transport.URL.sub(lambda m: snapshot['runtime_urls'].get(m[0], m[0]), expected)
        if (dist / relative).read_text('utf8') != expected: raise ValueError('Frozen page changed beyond runtime transport: ' + relative)
    prepare.write_sitemap(dist, routes)
    stage('routes')
    inherited = {rel: value for rel, value in snapshot['inherited_assets'].items() if Path(rel).suffix not in transport.HOSTED}
    files = hybrid.inventory(dist); files.update({rel: snapshot['inherited_files'][rel] for rel in inherited})
    manifest = {'schema': 'wly.hybrid-release.v1', 'files': files, 'routes': routes,
        'release_id': hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest(),
        'prepared_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(),
        'baseline_production_commit': snapshot['baseline_production_commit'], 'rollback_ref': snapshot['baseline_production_commit'],
        'baseline_files': {}, 'accepted_pages': {**converted, **{hybrid.file_route(rel): {'producer': 'frozen-runtime-transport'} for rel in frozen}}, 'rejected_pages': {}, 'temporary_href_mappings': [],
        'inherited_assets': inherited, 'rules_pin': pin,
        'same_origin_assets': sorted(rel for rel in files if Path(rel).suffix in transport.HOSTED),
        'astro': {'schema': 'wly.astro-publication.v1', 'sample_commit': snapshot['source_commit'],
            'converted_routes': list(converted), 'selected_pages': sorted(path.stem for path in (SITE / 'src/content/pages').glob('*.md')),
            'html_files': len(routes), 'baseline_html_files': len(snapshot['routes']),
            'retained_sample': {'source': 'site-astro/sources/retained-home-cockpit'},
            'frozen_pages': len(frozen)}}
    write(dist / 'release-manifest.json', manifest)
    stage('manifest')
    report = {'status': 'built', 'seconds': round(time.monotonic() - started, 2), 'html_files': len(routes),
        'frozen_pages': len(frozen), 'native_pages': len(converted), 'output': str(dist),
        'release_id': manifest['release_id'], 'stages': stages, 'album': finalize, 'stutter': stutter}
    write(SITE / '.cache/build-report.json', report); print(json.dumps(report, ensure_ascii=False))
    return manifest


if __name__ == '__main__':
    argparse.ArgumentParser(description=__doc__).parse_args()
    build()

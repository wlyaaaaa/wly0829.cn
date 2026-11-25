"""Build the new website and seal an offline release.

The old frontend is retired. Legacy addresses are built as redirects.
"""
import argparse
import hashlib
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from concurrent.futures import ThreadPoolExecutor
from importlib.metadata import version
from pathlib import Path
from urllib.parse import quote
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site-astro'
CV_ENTRIES = {'cv/index.html': ('/', '首页'), 'cv/live/index.html': ('/live/', '实况首页')}
LEGACY_REDIRECTS = {
    '/cockpit/': '/live/', '/cockpit/storage/': '/live/storage/',
    '/cockpit/stutter/': '/live/computer/#stutters', '/cockpit/ai/': '/live/ledger/',
    '/system/': '/', '/how/': '/principles/', '/learning/': '/learning/project.html',
    '/agents/原话为凭.html': '/agents/原话存档.html',
}
sys.path.insert(0, str(ROOT / 'scripts'))
sys.path.insert(0, str(ROOT / 'scripts/content-refresh'))


def load(name, relative):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def run(*args, cwd=ROOT, env=None):
    subprocess.run(args, cwd=cwd, env=env, check=True)


def fingerprints(paths, runtime):
    def record(row):
        name, path = row
        return name, runtime.oss.digest(path) if path.is_file() else 'missing'
    with ThreadPoolExecutor(max_workers=8) as pool:
        return dict(pool.map(record, sorted(paths.items())))


def inventory(folder, runtime):
    paths = sorted(folder.rglob('*'))
    if any(path.is_symlink() for path in paths):
        raise ValueError('Release must not contain symlinks')
    files = {p.relative_to(folder).as_posix(): p for p in paths
             if p.is_file() and p.name not in ('.build-receipt.json', 'release-identity.json')}
    return {name: {'bytes': files[name].stat().st_size, 'sha256': digest}
            for name, digest in fingerprints(files, runtime).items()}


def sync_output(source, target):
    """Publish final bytes locally; unchanged pages keep their modification time."""
    updated, removed = [], []
    target.mkdir(parents=True, exist_ok=True)
    files = {p.relative_to(source): p for p in source.rglob('*') if p.is_file()}
    def copy(row):
        relative, path = row
        destination = target / relative
        if destination.is_file() and path.read_bytes() == destination.read_bytes():
            return None
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, destination)
        return relative.as_posix()
    with ThreadPoolExecutor(max_workers=8) as pool:
        updated = sorted(name for name in pool.map(copy, sorted(files.items())) if name)
    for path in sorted(target.rglob('*'), reverse=True):
        if path.is_file() and path.relative_to(target) not in files and path.name != '.build-receipt.json':
            removed.append(path.relative_to(target).as_posix())
            path.unlink()
        elif path.is_dir() and not any(path.iterdir()):
            path.rmdir()
    return {'updated': updated, 'removed': removed}


def environment(runtime):
    return {'python': sys.version, 'asset_base_url': runtime.oss.oss_origins.configured_base(),
            'packages': {name: version(name) for name in ('Pillow', 'fonttools', 'brotli',
                        'beautifulsoup4', 'markdown', 'markdown-it-py', 'mistune')}}



def controls(dist):
    verification_files = ('baidu_verify_codeva-DRgaQnAmTK.html', 'sogousiteverification.txt')
    for name in verification_files:
        shutil.copy2(ROOT / 'public' / name, dist / name)
    (dist / 'CNAME').write_text('wly0829.cn\n', encoding='utf-8')
    (dist / '.nojekyll').write_text('', encoding='utf-8')
    source = (ROOT / 'scripts/visitor-beacon.js').read_text('utf-8')
    boundary = source.index('  // Page listeners (omitted from the inline redirect script).')
    beacon = (source[:boundary] + '})();').replace('</script', r'<\/script')
    for name, (target, label) in CV_ENTRIES.items():
        path = dist / name
        path.parent.mkdir(parents=True, exist_ok=True)
        fallback = '"/" + location.search' if target == '/' else json.dumps(target)
        path.write_text(
            '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
            '<title>吴乐阳 · 个人网站</title><meta name="robots" content="noindex">'
            f'<noscript><meta http-equiv="refresh" content="0;url={target}"></noscript>'
            f'<script data-site-visitors>{beacon}</script>'
            f'<script>setTimeout(() => location.replace({fallback}), 250)</script>'
            f'</head><body><p>正在打开{label}… <a href="{target}">打开{label}</a></p></body></html>\n',
            encoding='utf-8',
        )
    urls = []
    for path in sorted(dist.rglob('*.html')):
        if path.relative_to(dist).as_posix() in verification_files:
            continue
        if re.search(r'<meta\b[^>]*name=["\']robots["\'][^>]*content=["\'][^"\']*noindex', path.read_text(encoding='utf-8'), re.I):
            continue
        rel = path.relative_to(dist).as_posix()
        urls.append('https://wly0829.cn/' + (rel[:-10] if rel.endswith('index.html') else rel))
    sitemap = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>' + escape(url) + '</loc></url>' for url in urls) + '</urlset>\n'
    (dist / 'sitemap.xml').write_text(sitemap, encoding='utf-8')
    (dist / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://wly0829.cn/sitemap.xml\n', encoding='utf-8')




def legacy_routes(dist, runtime):
    catalog = load('v2_catalog', 'site-v2/site-assembly/组装.py')
    _, skills = catalog.load_catalog()
    hidden = catalog.hidden_ids()
    owners = {row['技能ID']: row['归属项目ID'] for row in skills}
    projects = {p.name for p in dist.iterdir() if (p / 'project.html').is_file()}
    preferred = {'/rules/charter/': '/rules/'}
    preferred.update({f'/rules/{p.stem.removeprefix("topic-")}/': '/rules/' + p.name
                      for p in (dist / 'rules').glob('topic-*.html')})
    preferred.update({f'/skills/{page["技能ID"]}/': page['地址'] for pid in set(owners.values()) & projects
                      for page in catalog.project_pages(pid) if page['种类'] == '技能页'})
    routes = set(read(SITE / 'sources/frozen-site/manifest.json')['routes'])
    routes.update(LEGACY_REDIRECTS)
    for path in (ROOT / 'sources/pages').glob('*/page.json'):
        page = read(path)
        addresses = [page['url'], *page.get('old_urls', [])]
        routes.update(addresses)
        if page['url'].startswith('/skills/') and (target := preferred.get(page['url'])):
            for alias in addresses[1:]:
                if alias.startswith('/skills/'):
                    preferred.setdefault(alias, target)
        for address in addresses:
            match = re.fullmatch(r'/projects/([^/]+)/', address)
            if match and match[1] in projects:
                preferred.update({alias: f'/{match[1]}/project.html' for alias in addresses
                                  if re.fullmatch(r'/projects/[^/]+/', alias)})
                break
    redirects = {}
    for route in sorted(routes - {'/rescue/'}):
        path = dist / runtime.nav.route_file(route)
        if path.exists() or catalog.hidden_route(route, hidden):   # 不给访客看的项目连旧地址跳转也不留
            continue
        parts = route.strip('/').split('/')
        project = (parts[1] if len(parts) > 1 and parts[0] == 'projects' else
                   owners.get(parts[1]) if len(parts) > 1 and parts[0] == 'skills' else parts[0])
        target = (LEGACY_REDIRECTS.get(route) or preferred.get(route)
                  or ('/' + project + '/project.html' if project in projects else '/projects/'))
        if parts[0] == '404':
            target = '/404.html'
        title = re.search(r'<title>(.*?)</title>', (dist / runtime.nav.route_file(target.split('#', 1)[0])).read_text('utf-8'), re.S)[1]
        path.parent.mkdir(parents=True, exist_ok=True)
        renamed_anchor = ''
        if route == '/agents/原话为凭.html':
            renamed_anchor = f'u.hash=u.hash.replace(/^#{quote("原话为凭")}-(?=\\d)/i,"#{quote("原话存档")}-");'
        path.write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=1440"><title>' + title +
            '</title><meta property="og:title" content="' + title + '"><meta name="robots" content="noindex">' +
            '<link rel="canonical" href="https://wly0829.cn' + target + '"><meta http-equiv="refresh" content="0;url=' +
            target + '"><script>const u=new URL(' + json.dumps(target, ensure_ascii=False) + ',location.href);u.search=location.search;u.hash=location.hash||u.hash;' +
            renamed_anchor + 'location.replace(u.href);</script></head><body><a href="' + target + '">打开页面</a></body></html>\n', encoding='utf-8', newline='')
        redirects[path.relative_to(dist).as_posix()] = target
    return redirects


def connect_cockpit(dist):
    project_ids = {'chinese-asr': 'chineseasr'}
    cover_links = read(ROOT / 'site-v2/live/project/cover-links.json')
    decode = json.JSONDecoder().raw_decode
    cover_label = '看本项目实况'
    count = 0
    for path in dist.glob('*/content.js'):
        target = '/live/project/?id=' + project_ids.get(path.parent.name, path.parent.name)
        raw = path.read_text('utf-8')
        start = raw.index('window.PAGE_DATA = ') + len('window.PAGE_DATA = ')
        data, end = decode(raw[start:])
        buttons = [button for cards in data.values() for card in cards for button in card.get('buttons', [])
                   if button['label'] == '看实况' and not button.get('href')]
        for button in buttons:
            button['href'] = target
        cover_id = cover_links.get(path.parent.name)
        if cover_id and path.with_name('project.html').is_file():
            config, _ = decode(raw.split('window.PROJECT_CONFIG = ', 1)[1])
            cover_buttons = data['project'][0].setdefault('buttons', [])
            # 专用按钮图由讲解页在核过实况内容后登记。
            if (cover_label in config.get('buttonArt', {})
                    and not any(button['label'] in {'看实况', cover_label} for button in cover_buttons)):
                button = {'label': cover_label, 'href': '/live/project/?id=' + cover_id}
                cover_buttons.append(button)
                buttons.append(button)
        if buttons:
            path.write_text(raw[:start] + json.dumps(data, ensure_ascii=False, indent=2) + raw[start + end:], encoding='utf-8', newline='')
            count += len(buttons)
    return count


def visitors(dist, runtime, redirects):
    """Keep the existing visitor and email behavior in byte-identical OSS assets."""
    scripts = {'data-site-visitors': 'visitor-beacon.js', 'data-footer-email-copy': 'footer-email-copy.js'}
    for name in scripts.values():
        runtime.copy(ROOT / 'scripts' / name, dist / '_site' / name)
    for path in dist.rglob('*.html'):
        relative = path.relative_to(dist).as_posix()
        if relative in CV_ENTRIES or relative in redirects:
            continue
        body = runtime.visitor_html(path.read_text(encoding='utf-8'))
        for marker, name in scripts.items():
            body = re.sub(r'<script ' + marker + r'>[\s\S]*?</script>',
                          f'<script {marker} src="/_site/{name}"></script>', body)
        path.write_text(body, encoding='utf-8', newline='')


def source_inputs(runtime):
    names = subprocess.check_output(['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], cwd=ROOT).decode('utf-8').split('\0')
    paths = {name: ROOT / name for name in names if name}
    catalog = load('sealed_catalog', 'site-v2/site-assembly/组装.py')
    paths.update({p.relative_to(ROOT).as_posix(): p for p in catalog.source_files()})
    paths.update({p.as_posix(): p for p in catalog.rule_inputs()})
    paths.update({p.as_posix(): p for p in catalog.external_inputs()})
    policy = Path('E:/PCConfig/registries/site_public_words.json')
    paths[policy.as_posix()] = policy
    sources = fingerprints(paths, runtime)
    identity = runtime.source_identity(ROOT)
    return paths, sources, identity


def seal(dist, runtime, timings, full=False):
    """Finalize offline and bind output bytes to actual public and companion inputs."""
    started = time.monotonic()
    paths, sources, identity = source_inputs(runtime)
    timings['source_fingerprints'] = round(time.monotonic() - started, 3)
    started = time.monotonic()
    files = {name: row for name, row in inventory(dist, runtime).items() if name != runtime.oss.MANIFEST}
    routes = sorted(runtime.file_route(name) for name in files if name.endswith('.html'))
    runtime.oss.write(dist / runtime.oss.MANIFEST, {'schema': 'wly.hybrid-release.v1', 'files': files, 'routes': routes,
        'release_id': runtime.value_sha(files)})
    timings['inventory'] = round(time.monotonic() - started, 3)
    final_timings = {}
    final = runtime.oss.finalize_dist(dist, source_commit=identity['source_commit'], timings=final_timings, full=full)
    timings['finalize'] = final_timings
    started = time.monotonic()
    common = {'@source-set': runtime.value_sha(sources), '@source-identity': runtime.value_sha(identity),
              '@build-environment': runtime.value_sha(environment(runtime))}
    route_inputs, site_inputs = {}, {}
    for name in files:
        if name.endswith('.html') or name in runtime.oss.HOST_CONTROLS:
            row = {**runtime.input_record(common), 'output_sha256': runtime.oss.digest(dist / name)}
            if name.endswith('.html'):
                route_inputs[runtime.file_route(name)] = row
            else:
                site_inputs[name] = row
    metadata = {**common, '@content-files': runtime.value_sha({**final['files'], **final['oss']['objects']})}
    site_inputs[runtime.oss.MANIFEST] = runtime.input_record(metadata)
    site_inputs['release-identity.json'] = runtime.input_record({**metadata, '@release-id': final['release_id']})
    inputs = {'schema': 'wly.site-input-fingerprints.v1', 'routes': route_inputs, 'site_files': site_inputs,
              'source_files_sha256': sources, 'source_identity': identity, 'build_environment': environment(runtime)}
    changed = [name for name, digest in fingerprints(paths, runtime).items() if sources[name] != digest]
    if changed:
        raise ValueError('构建输入在冻结后改变：' + ', '.join(changed))
    if runtime.source_identity(ROOT) != identity:
        raise ValueError('源码身份在构建输入冻结后改变；请重新构建')
    runtime.seal_inputs(dist, inputs)
    timings['input_proofs'] = round(time.monotonic() - started, 3)
    return identity, inputs


def check_site_links(dist, cached_warnings=None):
    assembly = load('whole_site_links', 'site-v2/site-assembly/组装.py')
    if cached_warnings is not None:
        assembly.report_page_links(cached_warnings)
        return cached_warnings
    assembly.OUT = dist
    bad, page_warnings = assembly.check_links()
    assembly.report_page_links(page_warnings)
    if bad: raise ValueError('站内检查失败：' + json.dumps(bad, ensure_ascii=False))
    return page_warnings


def build(dist, full=False, cache_dir=None):
    started = time.monotonic()
    destination = dist
    dist = ROOT / '.cache/site-build' / hashlib.sha256(str(destination).encode()).hexdigest()[:16]
    dist.mkdir(parents=True, exist_ok=True)
    timings = {}
    def step(name, operation):
        before = time.monotonic()
        result = operation()
        timings[name] = round(time.monotonic() - before, 3)
        return result
    runtime = load('site_build_runtime', 'site-astro/tools/build_runtime.py')
    previous = destination / '.build-receipt.json'
    fallback = os.environ.get('WLY_LIVE_FALLBACK_CMD', '').strip() or (destination / 'live/_fallback.json').exists()
    if not full and not fallback and previous.is_file():
        cached = read(previous)
        _, sources, identity = step('source_fingerprints', lambda: source_inputs(runtime))
        proof = cached.get('input_fingerprints', {})
        if (proof.get('source_files_sha256') == sources and proof.get('source_identity') == identity
                and proof.get('build_environment') == environment(runtime)):
            actual = step('verify_output', lambda: inventory(destination, runtime))
            identity_file = destination / 'release-identity.json'
            if identity_file.is_file():
                actual[identity_file.name] = {'bytes': identity_file.stat().st_size, 'sha256': runtime.oss.digest(identity_file)}
            _, verified_sources, verified_identity = step('verify_inputs', lambda: source_inputs(runtime))
            if (actual == {row['path']: {k: row[k] for k in ('bytes', 'sha256')} for row in cached['files']}
                    and verified_sources == sources and verified_identity == identity):
                check_site_links(destination, cached.get('page_link_warnings'))
                cached.update(prepared_at_beijing=datetime.now(timezone(timedelta(hours=8))).isoformat(),
                              seconds=round(time.monotonic() - started, 3), timings=timings,
                              output_changes={'updated': [], 'removed': []})
                runtime.oss.write(previous, cached)
                print(json.dumps({'status': 'built', 'cache': 'sealed-output', 'seconds': cached['seconds'],
                                  'timings': timings, 'output': str(destination)}, ensure_ascii=False))
                return cached
    options = (['--full'] if full else []) + (['--cache-dir', str(cache_dir)] if cache_dir else [])
    step('assembly', lambda: run(sys.executable, '-B', '-X', 'utf8', str(ROOT / 'site-v2/site-assembly/组装.py'), '--output', str(dist), '--不检查', *options))
    redirects = step('redirects', lambda: legacy_routes(dist, runtime))
    connected = step('buttons', lambda: connect_cockpit(dist))
    step('controls', lambda: controls(dist))
    step('visitors', lambda: visitors(dist, runtime, redirects))
    page_link_warnings = step('links', lambda: check_site_links(dist))
    word_policy = load('site_public_words', 'scripts/site_public_words.py')
    hits = word_policy.scan_baseline(dist, policy=word_policy.load_policy())
    if hits: raise ValueError('公开底线命中：' + json.dumps(hits, ensure_ascii=False))
    identity, inputs = step('seal', lambda: seal(dist, runtime, timings, full))
    files = [{'path': name, **row} for name, row in inventory(dist, runtime).items()]
    identity_path = dist / 'release-identity.json'
    files.append({'path': identity_path.name, 'bytes': identity_path.stat().st_size, 'sha256': runtime.oss.digest(identity_path)})
    files.sort(key=lambda row: row['path'])
    changes = step('sync_output', lambda: sync_output(dist, destination))
    receipt = {'schema': 'wly.site-build-receipt.v1', 'status': 'built', 'source_commit': identity['source_commit'],
               'prepared_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(),
               'seconds': round(time.monotonic() - started, 3), 'output': str(destination), 'output_changes': changes,
               'html_files': sum(row['path'].endswith('.html') for row in files), 'files': files,
               'input_fingerprints': inputs, 'preserved_cockpit_files': {}, 'timings': timings,
               'legacy_redirects': redirects, 'connected_cockpit_buttons': connected,
               'page_link_warnings': page_link_warnings}
    runtime.oss.write(destination / '.build-receipt.json', receipt)
    try:
        import live_project
        live_project.record('build', ROOT, destination, receipt)
    except Exception as error:
        print('构建已成功，实况登记失败：' + str(error), file=sys.stderr)
    print(json.dumps({'status': 'built', 'html_files': receipt['html_files'], 'preserved_cockpit_files': 0,
                      'seconds': receipt['seconds'], 'timings': timings, 'output': str(destination)}, ensure_ascii=False))
    return receipt


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', type=Path, default=ROOT / 'dist')
    parser.add_argument('--full', action='store_true', help='Bypass assembly and finalization caches')
    parser.add_argument('--cache-dir', type=Path, help='Isolated assembly cache for a cold build')
    args = parser.parse_args()
    build(args.dist.resolve(), args.full, args.cache_dir)

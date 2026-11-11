"""Stable identity of Markdown that can affect native rendering.

The converter's audit timestamp is not displayed and must not invalidate a
page. Keep every other frontmatter field and the complete body in the key.
"""
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


VERSIONS = {'key': 1, 'typeset': 1, 'font': 1, 'svg_start': 5}
FILE_URL = re.compile(r'file:///[^"\'\)\r\n<>]+')
TITLE_SOURCE = re.compile(r'data-title-src="[^"]*"')


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode('utf8')).hexdigest()[:20]


def screen_input(meta, text, page, assets, fonts, root):
    # These three page fields are author/audit records, never read by typeset.
    settings = {k: v for k, v in page.items() if k not in
                ('screens', 'based_on', 'notes', 'video_prompt')}
    if isinstance(settings.get('registry'), dict):
        settings['registry'] = dict(settings['registry'])
        if isinstance(settings['registry'].get('features'), list):
            settings['registry']['features'] = [r for r in settings['registry']['features']
                if isinstance(r, dict) and r.get('screen') == meta['screen']['id']]
    def portable(value):
        if isinstance(value, dict): return {k: portable(v) for k, v in value.items()}
        if isinstance(value, list): return [portable(v) for v in value]
        if isinstance(value, str):
            for prefix in (str(root).replace('\\', '/'), str(root).replace('/', '\\')):
                value = value.replace(prefix, '@repo')
        return value
    return {'versions': VERSIONS, 'content': portable(meta), 'text': text,
            'settings': portable(settings), 'assets': sorted(assets), 'fonts': sorted(fonts)}


def screen_cache_key(content, orientation, binding=None):
    return digest([content, orientation, binding])


def asset_urls(text):
    return set(re.findall(r'["\'(](/assets/[^"\'\s<>\\)]+)', text))


def bundle_assets(result, urls, work, public, sha):
    assets = result.setdefault('assets', {})
    pending, seen = list(urls), set()
    while pending:
        url = pending.pop()
        if url in seen: continue
        seen.add(url)
        source = Path(public, url.lstrip('/'))
        assets[url] = sha(source)
        target = Path(work, '_assets', url.lstrip('/'))
        if not target.exists() or sha(target) != assets[url]:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
        if source.suffix in ('.css', '.json'):
            pending.extend(asset_urls(source.read_text('utf8')) - seen)


def restore_assets(result, source_work, public, sha):
    for url, checksum in result.get('assets', {}).items():
        relative = Path(url.lstrip('/'))
        if not url.startswith('/assets/') or '..' in relative.parts:
            raise ValueError('Invalid cached asset URL: ' + url)
        source, target = Path(source_work, '_assets', relative), Path(public, relative)
        if target.exists() and sha(target) == checksum: continue
        if sha(source) != checksum: raise ValueError('Cached asset checksum mismatch: ' + url)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)


def migrate_cache(source, jobs, cache, renderer):
    """Promote only identical screen inputs; never launch a measuring browser."""
    source = Path(source).resolve()
    old_work = source / 'site-astro/.cache/blocks'
    old_cache = json.loads((old_work / '_cache.json').read_text('utf8'))
    renderer.recover_cache(old_cache, old_work / '_completed')
    index_path = old_work / '_index.json'
    if index_path.exists():
        index = json.loads(index_path.read_text('utf8'))
    else:
        # Import the preserved renderer in a separate interpreter: importing it
        # here would bind engine modules and global paths to the wrong checkout.
        script = ('import render_blocks as r,hashlib,json;from pathlib import Path;'
                  'print(json.dumps(r.library_fingerprint()+hashlib.sha256('
                  'Path(r.CSS_OUT).read_text("utf8").encode()).hexdigest()[:12]+'
                  'r.RENDER_VERSION+r.hydration_fingerprint()))')
        code = 'import sys;sys.path.insert(0,sys.argv[1]);' + script
        libfp = json.loads(subprocess.check_output([sys.executable, '-B', '-X', 'utf8', '-c',
                           code, str(source / 'site-astro/tools')], cwd=source, text=True))
        lock = json.loads((source / 'config/render.lock.json').read_text('utf8'))
        fonts = [renderer.sha(f['path']) for f in lock['fonts']]
        index = {}
        for name in dict.fromkeys(j['page'] for j in jobs):
            md = source / 'site-astro/src/content/pages' / (name + '.md')
            if not md.exists(): continue
            fm, screens = renderer.parse_md(md)
            binds = renderer.bindings(name, screens[0][0]['screen']['id'], source / 'site-astro')
            for meta, text in screens:
                sid = meta['screen']['id']
                for orientation in ('h', 'v'):
                    path = old_work / name / (sid + '-' + orientation + '.html')
                    if not path.exists(): continue
                    document = path.read_text('utf8')
                    old_key = digest([digest([libfp, document, orientation]), binds.get((sid, orientation))])
                    content = screen_input(meta, text, fm['page'], renderer.input_assets(document), fonts, source)
                    key = screen_cache_key(content, orientation, binds.get((sid, orientation)))
                    index[name + '/' + sid + '-' + orientation] = {'key': old_key, 'input_key': key}
    migrated = 0
    rendered = {}
    for job in jobs:
        old = index.get(job['page'] + '/' + job['screen'] + '-' + job['o'], {})
        if old.get('input_key') != job['key'] or old.get('key') not in old_cache: continue
        if job['key'] in cache: continue
        result = old_cache[old['key']]
        restore_assets(result, old_work, renderer.PUB, renderer.input_sha)
        result = renderer.cache_payload(result)
        if job['page'] not in rendered:
            path = source / 'site-astro/src/content/rendered' / (job['page'] + '.json')
            rendered[job['page']] = json.loads(path.read_text('utf8'))
        page = rendered[job['page']]
        screen = next(s for s in page['screens'] if s['id'] == job['screen'])
        urls = asset_urls(json.dumps(screen[job['o']], ensure_ascii=False)) | {page['font'], page['css'], page['loader']}
        bundle_assets(result, urls, renderer.WORK, source / 'site-astro/public', renderer.input_sha)
        restore_assets(result, renderer.WORK, renderer.PUB, renderer.input_sha)
        cache[job['key']] = result
        migrated += 1
    print('换钥匙：' + json.dumps({'migrated': migrated, 'missing': sum(j['key'] not in cache for j in jobs),
                                'measurements': 0}, ensure_ascii=False), flush=True)
    return migrated


def markdown_render_sha(path):
    source = Path(path).read_text('utf8')
    match = re.match(r'^---\n(.*?)\n---\n', source, re.S)
    if not match:
        raise ValueError('Missing JSON frontmatter: ' + str(path))
    metadata = json.loads(match.group(1))
    metadata.get('source', {}).pop('converted_at_beijing', None)
    normalized = json.dumps(metadata, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256((normalized + source[match.end():]).encode('utf8')).hexdigest()

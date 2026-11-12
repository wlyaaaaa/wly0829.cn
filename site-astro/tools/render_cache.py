"""Portable screen identity, complete resources and zero-measurement migration."""
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
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
    return set(re.findall(r'["\'(](/(?:assets|_living)/[^"\'\s<>\\)]+)', text))


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


def restore_assets(result, source_work, public, sha, target_work=None):
    for url, checksum in result.get('assets', {}).items():
        relative = Path(url.lstrip('/'))
        if not url.startswith(('/assets/', '/_living/')) or '..' in relative.parts:
            raise ValueError('Invalid cached asset URL: ' + url)
        source = Path(source_work, '_assets', relative)
        target = Path(target_work or source_work, '_assets', relative) if url.startswith('/assets/_source/') else Path(public, relative)
        if target.exists() and sha(target) == checksum: continue
        if not source.is_file() or sha(source) != checksum:
            source = ArtifactStore().objects / checksum
        if not source.is_file() or sha(source) != checksum:
            raise ValueError('Cached asset checksum mismatch: ' + url)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)


class ArtifactStore:
    """Immutable content objects and retained manifests; CURRENT commits a snapshot."""
    def __init__(self, root=None, snapshot=None):
        self.root = Path(root or os.environ.get('SITE_ARTIFACT_STORE') or
                         'E:/Cache/wly-site-build/artifact-store')
        self.objects = self.root / 'objects'
        self.verified = set()
        self.snapshot = snapshot

    @staticmethod
    def sha(path):
        with Path(path).open('rb') as stream:
            return hashlib.file_digest(stream, 'sha256').hexdigest()

    def object(self, checksum):
        if not re.fullmatch('[a-f0-9]{64}', checksum): raise ValueError('Invalid artifact hash')
        path = self.objects / checksum
        if checksum not in self.verified:
            if self.sha(path) != checksum: raise ValueError('Artifact checksum mismatch: ' + checksum)
            self.verified.add(checksum)
        return path

    def atomic(self, target, value):
        target.parent.mkdir(parents=True, exist_ok=True)
        fd, name = tempfile.mkstemp(dir=target.parent, suffix='.tmp')
        try:
            with os.fdopen(fd, 'wb') as stream:
                if isinstance(value, Path):
                    with value.open('rb') as source: shutil.copyfileobj(source, stream)
                else: stream.write(value)
            os.replace(name, target)
        finally:
            Path(name).unlink(missing_ok=True)

    def put(self, value, checksum=None):
        actual = self.sha(value) if isinstance(value, Path) else hashlib.sha256(value).hexdigest()
        if checksum and actual != checksum: raise ValueError('Artifact source checksum mismatch: ' + str(value))
        checksum = checksum or actual
        target = self.objects / checksum
        if not target.is_file() or (checksum not in self.verified and self.sha(target) != checksum):
            self.atomic(target, value)
        self.object(checksum)
        return checksum

    def manifest(self):
        pointer = self.root / 'CURRENT'
        if not self.snapshot and not pointer.is_file():
            return {'schema': 'wly.render-artifacts.v1', 'screens': {}, 'index': {}, 'rendered': {}}
        checksum = self.snapshot or pointer.read_text('ascii').strip()
        value = json.loads(self.object(checksum).read_text('utf8'))
        if value['schema'] != 'wly.render-artifacts.v1': raise ValueError('Unsupported render artifacts')
        return value

    def save(self, site, work):
        site, work = Path(site), Path(work)
        if not (work / '_cache.json').is_file(): return {'screens': 0, 'rendered': 0}
        manifest = self.manifest()
        cache = json.loads((work / '_cache.json').read_text('utf8'))
        index = json.loads((work / '_index.json').read_text('utf8'))
        active = {row['key'] for row in index.values()} & cache.keys()
        for key in sorted(active):
            result = cache[key]
            for url, checksum in result.get('assets', {}).items():
                # Each version keeps its own bytes even when a public URL is reused.
                if (self.objects / checksum).is_file():
                    try: self.object(checksum); continue
                    except ValueError: pass
                source = work / '_assets' / url.lstrip('/')
                if not source.is_file(): source = site / 'public' / url.lstrip('/')
                self.put(source, checksum)
            manifest['screens'][key] = self.put(json.dumps(result, ensure_ascii=False).encode('utf8'))
        manifest['index'] = {name: row for name, row in index.items() if row['key'] in active}
        manifest['rendered'] = {path.name: self.put(path) for path in sorted((site / 'src/content/rendered').glob('*.json'))}
        identity = site.parent / 'dist/release-identity.json'
        manifest['build_identity'] = json.loads(identity.read_text('utf8')) if identity.is_file() else None
        body = json.dumps(manifest, ensure_ascii=False, sort_keys=True).encode('utf8')
        checksum = self.put(body)
        self.atomic(self.root / 'manifests' / (checksum + '.json'), body)
        self.atomic(self.root / 'CURRENT', (checksum + '\n').encode('ascii'))
        return {'snapshot': checksum, 'screens': len(active), 'rendered': len(manifest['rendered'])}

    def restore(self, site, work):
        site, work = Path(site), Path(work)
        manifest = self.manifest(); fetched = {}; missing = 0
        for key, checksum in manifest['screens'].items():
            try:
                result = json.loads(self.object(checksum).read_text('utf8'))
                for asset_sha in result.get('assets', {}).values(): self.object(asset_sha)
            except (OSError, ValueError):
                missing += 1; continue  # A missing screen is left for the normal renderer.
            fetched[key] = result
        cache_path = work / '_cache.json'
        local = json.loads(cache_path.read_text('utf8')) if cache_path.is_file() else {}
        checked = {}
        def available(url, checksum):
            candidates = [work / '_assets' / url.lstrip('/'), self.objects / checksum]
            if not url.startswith('/assets/_source/'): candidates.append(site / 'public' / url.lstrip('/'))
            for path in candidates:
                if path not in checked: checked[path] = self.sha(path) if path.is_file() else None
                if checked[path] == checksum: return True
            return False
        local = {key: result for key, result in local.items()
                 if all(available(url, sha) for url, sha in result.get('assets', {}).items())}
        library = dict(fetched); fetched.update(local)
        if fetched or cache_path.is_file():
            self.atomic(cache_path, json.dumps(fetched, ensure_ascii=False).encode('utf8'))
            index_path = work / '_index.json'
            index = {name: row for name, row in manifest['index'].items() if row['key'] in fetched}
            if index_path.is_file(): index.update(json.loads(index_path.read_text('utf8')))
            self.atomic(index_path, json.dumps(index, ensure_ascii=False).encode('utf8'))
            assets = {}
            for row in manifest['index'].values():
                if row['key'] in library: assets.update(library[row['key']].get('assets', {}))
            for url, checksum in assets.items():
                relative = Path(url.lstrip('/'))
                if not url.startswith(('/assets/', '/_living/')) or '..' in relative.parts:
                    raise ValueError('Invalid cached asset URL: ' + url)
                target = work / '_assets' / relative
                if not target.is_file(): self.atomic(target, self.object(checksum))
                if not url.startswith('/assets/_source/'):
                    target = site / 'public' / relative
                    if not target.is_file(): self.atomic(target, self.object(checksum))
        restored = 0
        for name, checksum in manifest['rendered'].items():
            if Path(name).name != name: raise ValueError('Invalid rendered artifact name')
            target = site / 'src/content/rendered' / name
            md = site / 'src/content/pages' / Path(name).with_suffix('.md')
            if target.is_file() or not md.is_file(): continue
            try: source = self.object(checksum)
            except (OSError, ValueError): continue
            if json.loads(source.read_text('utf8')).get('render_md_sha256') != markdown_render_sha(md): continue
            self.atomic(target, source); restored += 1
        return {'screens': len(fetched) - len(local), 'missing': missing, 'rendered': restored}


def migrate_cache(source, jobs, cache, renderer):
    """Promote only identical screen inputs; never launch a measuring browser."""
    source = Path(source).resolve()
    old_work = source if (source / '_cache.json').is_file() else source / 'site-astro/.cache/blocks'
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
        fonts = [f['sha256'] for f in lock['fonts']]
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
                    content = renderer.cache_input(meta, text, fm['page'], document, fonts, source)
                    key = screen_cache_key(content, orientation, binds.get((sid, orientation)))
                    index[name + '/' + sid + '-' + orientation] = {'key': old_key, 'input_key': key}
    migrated = 0
    rendered = {}
    for job in jobs:
        old = index.get(job['page'] + '/' + job['screen'] + '-' + job['o'], {})
        if old.get('input_key') != job['key'] or old.get('key') not in old_cache: continue
        existing = job['key'] in cache
        result = cache[job['key']] if existing else old_cache[old['key']]
        restore_assets(result, renderer.WORK if existing else old_work, renderer.PUB, renderer.input_sha, renderer.WORK)
        result = renderer.cache_payload(result)
        if index_path.exists():
            bundle_assets(result, [u for u in result['assets'] if not u.startswith('/assets/_source/')],
                          renderer.WORK, renderer.PUB, renderer.input_sha)
            cache[job['key']] = result; migrated += not existing
            continue
        if job['page'] not in rendered:
            path = source / 'site-astro/src/content/rendered' / (job['page'] + '.json')
            rendered[job['page']] = json.loads(path.read_text('utf8'))
        page = rendered[job['page']]
        screen = next(s for s in page['screens'] if s['id'] == job['screen'])
        urls = asset_urls(json.dumps(screen[job['o']], ensure_ascii=False)) | {page['font'], page['css'], page['loader']}
        living = '/_living/' + job['page'] + '/astro/config.json'
        if (source / 'site-astro/public' / living.lstrip('/')).is_file(): urls.add(living)
        bundle_assets(result, urls, renderer.WORK, source / 'site-astro/public', renderer.input_sha)
        restore_assets(result, renderer.WORK, renderer.PUB, renderer.input_sha)
        cache[job['key']] = result
        migrated += not existing
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

"""Split a verified static release into GitHub HTML and versioned OSS resources.

This script never changes the source, uploads objects, or publishes HTML. Only
recorded URL spans may change in HTML/JS/CSS; other resource bytes are copied.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import html
import importlib.util
import json
import mimetypes
import posixpath
import re
import shutil
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit, urlunsplit
from urllib.request import Request, urlopen

MANIFEST = 'release-manifest.json'
PLAN = 'oss-plan.json'
# These files describe the HTML host rather than page content. Moving robots or
# the sitemap to OSS would change crawler behavior; CNAME/.nojekyll are Pages
# controls. The release manifest remains the existing online recovery entry.
HOST_CONTROLS = {MANIFEST, 'CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml'}
TEXT_ASSETS = {'.js', '.mjs', '.css', '.svg', '.json', '.webmanifest'}
STRINGS = re.compile(r'(?P<quote>["\'`])(?P<value>(?:\\.|(?!(?P=quote)).)*)(?P=quote)', re.S)
TAG = re.compile(r'<[^>]+>', re.S)
ATTR = re.compile(r'(?P<name>[^\s=<>/]+)\s*=\s*(?P<q>["\'])(?P<value>.*?)(?P=q)', re.S)
BLOCK = re.compile(r'<(?P<tag>script|style)\b[^>]*>(?P<body>.*?)</(?P=tag)\s*>', re.I | re.S)
CSS_URL = re.compile(r'url\(\s*(?P<q>["\']?)(?P<value>[^)"\']+)(?P=q)\s*\)', re.I)


def stamp():
    return datetime.now(timezone(timedelta(hours=8))).isoformat()


def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))


def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf8')


def digest(path):
    with Path(path).open('rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest()


def inventory(root):
    values = {}
    for p in sorted(Path(root).rglob('*')):
        if p.is_symlink():
            raise ValueError('Release symlink: ' + str(p))
        if p.is_file():
            values[p.relative_to(root).as_posix()] = {'bytes': p.stat().st_size, 'sha256': digest(p)}
    return values


def validate_target(base, prefix, allow_test=False):
    parts = urlsplit(base)
    if parts.query or parts.fragment or parts.username or parts.password or parts.path not in ('', '/'):
        raise ValueError('Asset base must be a bare origin, without credentials/path/query')
    if allow_test:
        if parts.scheme not in ('http', 'https') or parts.hostname not in ('localhost', '127.0.0.1'):
            raise ValueError('Test origin must be loopback')
    elif parts.scheme != 'https' or not re.fullmatch(r'[a-z0-9][a-z0-9-]+\.oss-cn-(?:beijing|shanghai)\.aliyuncs\.com', parts.hostname or '') or parts.port:
        raise ValueError('Production asset base must be the selected Beijing or Shanghai default HTTPS origin')
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._/-]*', prefix) or any(x in ('', '.', '..') for x in prefix.split('/')):
        raise ValueError('Prefix must be a nonempty version path, without empty/dot segments')
    return base.rstrip('/'), prefix


def release_identifier(source, base, prefix, github, objects):
    return hashlib.sha256(json.dumps({'source': source, 'base': base, 'prefix': prefix,
                                     'github': github, 'objects': objects},
                                    sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def current_home_links(source):
    raw=(Path(source)/'index.html').read_bytes()
    if not all(value in raw for value in (b'home-01-link-1-0', b'home-01-link-2-0')):
        return raw,None
    spec=importlib.util.spec_from_file_location('home_entry_links',Path(__file__).with_name('prepare-home-entry-links.py'))
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module.prepare_links(source,return_bytes=True)


def verify_manifest(manifest, require_remote=True):
    """Validate the published split, including the bound full-body GET receipt.

    Rehearsal plans may use loopback; a release manifest never may. Historical
    baseline inventory is provenance, not the current GitHub object inventory.
    """
    oss = manifest.get('oss', {})
    if oss.get('schema') != 'wly.oss-assets.v1':
        raise ValueError('Unsupported OSS manifest')
    base, prefix = validate_target(oss['asset_base_url'], oss['prefix'])
    files, objects = manifest['files'], oss['objects']
    if not objects or not any(x.endswith(('.js', '.mjs')) for x in objects):
        raise ValueError('OSS release lacks runtime objects')
    if any(not (rel.endswith('.html') or rel in HOST_CONTROLS) for rel in files):
        raise ValueError('Unexpected asset retained in HTML-host inventory')
    for rel, obj in objects.items():
        if rel.startswith('/') or '\\' in rel or any(x in ('', '.', '..') for x in rel.split('/')):
            raise ValueError('Invalid OSS object path: ' + rel)
        if rel in files or rel.endswith('.html') or rel in HOST_CONTROLS:
            raise ValueError('OSS object overlaps HTML-host inventory: ' + rel)
        url = base + '/' + prefix + '/' + quote(rel, safe='/~!$&()*+,;=:@-._')
        if obj.get('key') != prefix + '/' + rel or obj.get('url') != url or obj.get('content_type') != content_type(rel):
            raise ValueError('OSS object address or MIME mismatch: ' + rel)
        if type(obj.get('bytes')) is not int or obj['bytes'] < 0 or not re.fullmatch(r'[a-f0-9]{64}', obj.get('sha256', '')):
            raise ValueError('Invalid OSS object fingerprint: ' + rel)
    expected = release_identifier(oss['source_release_id'], base, prefix, files, objects)
    if manifest.get('release_id') != expected:
        raise ValueError('OSS release identifier mismatch')
    if not require_remote:
        return manifest
    proof = oss.get('verification', {})
    if (proof.get('schema') != 'wly.oss-remote-verification.v1' or proof.get('release_id') != expected
            or proof.get('complete') is not True or proof.get('html_ready') is not True
            or proof.get('method') != 'anonymous full GET body SHA256 plus MP4 byte range'
            or not proof.get('verified_at_beijing') or proof.get('failed') != []
            or set(proof.get('objects', {})) != set(objects)):
        raise ValueError('OSS full GET evidence is missing, incomplete or belongs to another release')
    for rel, obj in objects.items():
        row = proof['objects'][rel]
        headers = {key.lower(): value for key, value in row.get('headers', {}).items()}
        types = {obj['content_type']}
        if obj['content_type'] == 'application/javascript':
            types.add('text/javascript')
        if (row.get('status') != 'pass' or row.get('http') != 200 or row.get('bytes') != obj['bytes']
                or row.get('sha256') != obj['sha256'] or row.get('content_type') not in types
                or headers.get('access-control-allow-origin') not in ('*', 'https://wly0829.cn')
                or headers.get('content-encoding', 'identity') != 'identity'):
            raise ValueError('OSS full GET evidence differs from object: ' + rel)
        if rel.endswith('.mp4'):
            length = min(obj['bytes'], 32)
            part = row.get('range', {})
            if (part.get('http') != 206 or part.get('bytes') != length
                    or part.get('content_range') != f'bytes 0-{length-1}/{obj["bytes"]}'
                    or not re.fullmatch(r'[a-f0-9]{64}', part.get('sha256', ''))):
                raise ValueError('OSS video range evidence is missing: ' + rel)
    return manifest


class Rewriter:
    def __init__(self, files, base, prefix, origin):
        self.files = files
        self.assets = set(files) - {x for x in files if x.endswith('.html')} - HOST_CONTROLS
        self.base, self.prefix, self.origin = base, prefix, origin.rstrip('/')
        self.changes = {}
        self.references = {}
        self.missing = []

    def target(self, rel):
        return self.base + '/' + self.prefix + '/' + quote(rel, safe='/~!$&()*+,;=:@-._')

    def resolve(self, raw, owner, context):
        value = html.unescape(raw)
        if not value or value.startswith(('#', 'data:', 'blob:', 'mailto:', 'tel:')) or '${' in value or '\\' in value:
            return None
        parts = urlsplit(value)
        if parts.scheme or parts.netloc:
            if (parts.scheme + '://' + parts.netloc).rstrip('/') != self.origin:
                return None
            candidate = unquote(parts.path).lstrip('/')
        elif parts.path.startswith('/'):
            candidate = unquote(parts.path).lstrip('/')
        else:
            candidate = posixpath.normpath(posixpath.join(posixpath.dirname(owner), unquote(parts.path)))
        if candidate in self.assets:
            return candidate, parts
        # Vite dependency arrays use release-root paths; they are consumed by
        # the preload helper, not by import's relative-module resolution.
        if context == 'js' and parts.path.startswith('assets/') and parts.path in self.assets:
            return parts.path, parts
        # Old page-data screenshot names can be basenames under page/assets.
        if context == 'json' and '/' not in parts.path:
            asset = posixpath.join(posixpath.dirname(owner), 'assets', parts.path)
            if asset in self.assets:
                return asset, parts
        # Resource-bearing HTML attributes and CSS URLs must resolve; ordinary
        # JSON/JS text is not assumed to be an executable asset reference.
        if context in ('resource', 'css') and Path(parts.path).suffix and candidate not in self.files:
            self.missing.append({'owner': owner, 'url': raw, 'resolved': candidate, 'context': context})
        return None

    def url(self, raw, owner, context):
        found = self.resolve(raw, owner, context)
        if found is None:
            return raw
        rel, parts = found
        self.references.setdefault(owner, set()).add(rel)
        new = self.target(rel)
        if parts.query:
            new += '?' + parts.query
        if parts.fragment:
            new += '#' + parts.fragment
        return new

    def css(self, text, owner, offset=0):
        edits = []
        for m in CSS_URL.finditer(text):
            value = m['value'].strip()
            if '${' in value:
                continue
            new = self.url(value, owner, 'css')
            if new != value:
                start = m.start('value') + len(m['value']) - len(m['value'].lstrip())
                edits.append((offset + start, offset + start + len(value), new, 'css_url'))
        # Handles quoted @import and all exact local strings; url() duplicates
        # are discarded when the spans are merged.
        edits += self.strings(text, owner, 'css', offset)
        return edits

    def strings(self, text, owner, context, offset=0):
        edits = []
        for m in STRINGS.finditer(text):
            new = self.url(m['value'], owner, context)
            if new != m['value']:
                edits.append((offset + m.start('value'), offset + m.end('value'), new, context + '_url'))
        return edits

    def javascript(self, text, owner, offset=0):
        edits = self.strings(text, owner, 'js', offset)
        if '__vite__mapDeps=' in text:
            # Vite's sole preload URL prefix becomes empty because dependency
            # literals are now absolute URLs. No control flow is modified.
            pattern = re.compile(r'([A-Za-z_$][\w$]*)=function\(([A-Za-z_$][\w$]*)\)\{return`(?P<slash>/)`\+\2\}')
            matches = list(pattern.finditer(text))
            # Client chunks import the shared helper from index and contain
            # dependency arrays only; index itself owns the one URL prefix.
            if len(matches) > 1:
                raise ValueError('Unrecognized Vite preload URL helper: ' + owner)
            if matches:
                m = matches[0]
                edits.append((offset + m.start('slash'), offset + m.end('slash'), '', 'vite_preload_url_prefix'))
        # All page-data shot.src literals have become absolute resource URLs.
        # This old concatenation must stop adding assets/ in front of them.
        for m in re.finditer(r"new URL\('(?P<prefix>assets/)'\+shot\.src,location\.href\)", text):
            start = m.start('prefix') - 1
            end = m.end('prefix') + 2
            edits.append((offset + start, offset + end, '', 'screenshot_url_prefix'))
        return edits

    def html(self, text, owner):
        edits = []
        for m in TAG.finditer(text):
            tag = m.group(0)
            if tag.startswith(('<!--', '<!')):
                continue
            for a in ATTR.finditer(tag):
                name = a['name'].lower()
                raw = a['value']
                position = m.start() + a.start('value')
                if name == 'style':
                    edits += self.css(raw, owner, position)
                    continue
                if name in ('srcset', 'data-srcset'):
                    if raw.lstrip().startswith('data:'):
                        continue
                    for s in re.finditer(r'(?:^|,)\s*(?P<url>[^\s,]+)', raw):
                        new = self.url(s['url'], owner, 'resource')
                        if new != s['url']:
                            edits.append((position + s.start('url'), position + s.end('url'), new, 'html_srcset'))
                    continue
                if name in ('src', 'poster', 'href', 'data-src', 'data-lazy-src', 'data-gallery-src'):
                    context = 'resource' if name != 'href' or tag.lower().startswith('<link') else 'navigation'
                    new = self.url(raw, owner, context)
                    if new != raw:
                        edits.append((position, position + len(raw), new, 'html_' + name))
                # data-video and similar attributes can contain escaped JSON.
                elif name.startswith('data-'):
                    decoded = html.unescape(raw)
                    if decoded.startswith(('{', '[')):
                        new = self.rewrite_strings_value(decoded, owner)
                        if new != decoded:
                            encoded = html.escape(new, quote=True).replace('&#x27;', "'" if a['q'] == '"' else '&#x27;')
                            edits.append((position, position + len(raw), encoded, 'html_data_json_urls'))
        for m in BLOCK.finditer(text):
            body, start = m['body'], m.start('body')
            if m['tag'].lower() == 'style':
                edits += self.css(body, owner, start)
            elif re.search(r'type=["\']application/(?:ld\+)?json', m.group(0).split('>', 1)[0], re.I):
                edits += self.strings(body, owner, 'json', start)
            else:
                edits += self.javascript(body, owner, start)
        return edits

    def rewrite_strings_value(self, text, owner):
        for start, end, new, kind in reversed(self.strings(text, owner, 'json')):
            text = text[:start] + new + text[end:]
        return text

    def rewrite(self, data, owner):
        text = data.decode('utf-8')
        suffix = Path(owner).suffix
        if suffix == '.html':
            edits = self.html(text, owner)
        elif suffix == '.css':
            edits = self.css(text, owner)
        elif suffix in ('.js', '.mjs'):
            # Search records describe destinations and commands; replacing
            # arbitrary text there would change content. Their hrefs are HTML.
            edits = [] if owner.startswith('search-') else self.javascript(text, owner)
        else:
            edits = self.strings(text, owner, 'json')
        unique = {}
        for start, end, new, kind in edits:
            old = text[start:end]
            key = (start, end)
            if key in unique and unique[key]['after'] != new:
                raise ValueError('Conflicting URL edits: ' + owner)
            unique[key] = {'start': start, 'end': end, 'before': old, 'after': new, 'kind': kind}
        changes = [unique[x] for x in sorted(unique)]
        previous = -1
        for change in changes:
            if change['start'] < previous:
                raise ValueError('Overlapping URL edits: ' + owner)
            previous = change['end']
        for change in reversed(changes):
            text = text[:change['start']] + change['after'] + text[change['end']:]
        if changes:
            self.changes[owner] = changes
        return text.encode('utf8')


def prepare(source, base, prefix, output, origin='https://wly0829.cn', allow_test=False):
    source, output = Path(source).resolve(), Path(output).resolve()
    if output == source or output.is_relative_to(source) or source.is_relative_to(output):
        raise ValueError('Source and new output must be disjoint')
    if output.exists():
        raise ValueError('Output must be a new directory')
    base, prefix = validate_target(base, prefix, allow_test)
    source_manifest = read(source / MANIFEST)
    actual = inventory(source)
    expected = source_manifest['files']
    if {k: v for k, v in actual.items() if k != MANIFEST} != expected:
        raise ValueError('Source release inventory/bytes differ from release-manifest.json')
    rewriter = Rewriter(actual, base, prefix, origin)
    output.mkdir(parents=True)
    home_bytes,home_proof=current_home_links(source)
    objects, github = {}, {}
    for rel in actual:
        host = rel.endswith('.html') or rel in HOST_CONTROLS
        destination = output / ('github' if host else 'oss') / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        if rel == MANIFEST:
            continue
        if rel.endswith('.html') or Path(rel).suffix in TEXT_ASSETS:
            payload=home_bytes if rel=='index.html' else (source/rel).read_bytes()
            destination.write_bytes(rewriter.rewrite(payload, rel))
        else:
            shutil.copyfile(source / rel, destination)
        value = {'bytes': destination.stat().st_size, 'sha256': digest(destination)}
        if host:
            github[rel] = value
        else:
            objects[rel] = {**value, 'key': prefix + '/' + rel, 'url': rewriter.target(rel),
                            'content_type': content_type(rel), 'source': actual[rel],
                            'byte_preserved': value == actual[rel]}
    if rewriter.missing:
        write(output / 'unresolved-resources.json', rewriter.missing)
        raise ValueError('Missing local resources; inspect unresolved-resources.json')
    release_id = release_identifier(source_manifest['release_id'], base, prefix, github, objects)
    new_manifest = {**source_manifest, 'release_id': release_id, 'files': github,
                    'oss': {'schema': 'wly.oss-assets.v1', 'asset_base_url': base, 'prefix': prefix,
                            'source_release_id': source_manifest['release_id'], 'objects': objects},
                    'prepared_at_beijing': stamp()}
    write(output / 'github' / MANIFEST, new_manifest)
    github[MANIFEST] = {'bytes': (output/'github'/MANIFEST).stat().st_size, 'sha256': digest(output/'github'/MANIFEST)}
    plan = {'schema': 'wly.oss-release-plan.v1', 'prepared_at_beijing': stamp(), 'release_id': release_id,
            'source_release_id': source_manifest['release_id'], 'source_root': str(source), 'source_files': actual,
            'asset_base_url': base, 'prefix': prefix, 'html_origin': origin.rstrip('/'), 'test_only': allow_test,
            'github_files': github, 'objects': objects, 'url_changes': rewriter.changes,
            'closure': {k: sorted(v) for k, v in sorted(rewriter.references.items())},
            'host_control_exceptions': sorted(set(actual) & HOST_CONTROLS),
            'summary': {'html_files': sum(x.endswith('.html') for x in github), 'objects': len(objects),
                        'object_bytes': sum(x['bytes'] for x in objects.values()),
                        'mp4_files': sum(x.endswith('.mp4') for x in objects),
                        'rewritten_files': len(rewriter.changes)},
            'remote_verified': False}
    if home_proof:plan['home_entry_overlay']=home_proof
    write(output / PLAN, plan)
    verify_local(output)
    return plan


def content_type(rel):
    return {'.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css',
            '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
            '.mp4': 'video/mp4', '.woff': 'font/woff', '.woff2': 'font/woff2', '.webp': 'image/webp',
            '.avif': 'image/avif'}.get(Path(rel).suffix, mimetypes.guess_type(rel)[0] or 'application/octet-stream')


def verify_local(output):
    output = Path(output).resolve()
    plan = read(output / PLAN)
    if plan['schema'] != 'wly.oss-release-plan.v1':
        raise ValueError('Unsupported OSS plan')
    validate_target(plan['asset_base_url'], plan['prefix'], plan['test_only'])
    source = Path(plan['source_root'])
    if inventory(source) != plan['source_files']:
        raise ValueError('Source changed since preparation')
    if inventory(output/'github') != plan['github_files']:
        raise ValueError('Prepared GitHub inventory/bytes changed')
    expected = {k: {'bytes': v['bytes'], 'sha256': v['sha256']} for k, v in plan['objects'].items()}
    if inventory(output/'oss') != expected:
        raise ValueError('Prepared OSS inventory/bytes changed')
    rewriter = Rewriter(plan['source_files'], plan['asset_base_url'], plan['prefix'], plan['html_origin'])
    home_bytes,home_proof=current_home_links(source)
    if (home_proof!=plan.get('home_entry_overlay')
            and (plan.get('home_entry_overlay') is not None or home_bytes!=(source/'index.html').read_bytes())):
        raise ValueError('Home entry restoration evidence is not reproducible')
    for rel in plan['source_files']:
        if rel == MANIFEST:
            continue
        target = output / ('github' if rel in plan['github_files'] else 'oss') / rel
        if rel.endswith('.html') or Path(rel).suffix in TEXT_ASSETS:
            payload=home_bytes if rel=='index.html' else (source/rel).read_bytes()
            expected_bytes = rewriter.rewrite(payload, rel)
            if target.read_bytes() != expected_bytes:
                raise ValueError('Changes outside deterministic URL rewrite: ' + rel)
        elif digest(source/rel) != digest(target):
            raise ValueError('Binary bytes changed: ' + rel)
    if rewriter.changes != plan['url_changes'] or rewriter.missing:
        raise ValueError('URL change log/closure is not reproducible')
    return plan


def verify_object(output, rel, obj, origin, timeout, download_to=None):
    request = Request(obj['url'], headers={'Origin': origin, 'Referer': origin + '/', 'Accept-Encoding': 'identity'})
    h, count = hashlib.sha256(), 0
    with urlopen(request, timeout=timeout) as response:
        if response.status != 200:
            raise ValueError('Expected full GET 200: ' + rel)
        headers = dict(response.headers.items())
        if response.headers.get('Content-Encoding', 'identity') != 'identity':
            raise ValueError('Expected identity bytes: ' + rel)
        actual_type = response.headers.get_content_type()
        if actual_type not in {obj['content_type'], 'text/javascript' if obj['content_type'] == 'application/javascript' else obj['content_type']}:
            raise ValueError('Wrong Content-Type: ' + rel + ' ' + actual_type)
        if response.headers.get('Access-Control-Allow-Origin') not in ('*', origin):
            raise ValueError('Origin GET CORS missing: ' + rel)
        destination = Path(download_to) if download_to else None
        if destination: destination.parent.mkdir(parents=True, exist_ok=True)
        downloaded = destination.open('wb') if destination else None
        try:
            while chunk := response.read(1024 * 1024):
                h.update(chunk)
                count += len(chunk)
                if downloaded: downloaded.write(chunk)
        finally:
            if downloaded: downloaded.close()
    if count != obj['bytes'] or h.hexdigest() != obj['sha256']:
        raise ValueError('Remote body differs from prepared bytes: ' + rel)
    result = {'status': 'pass', 'http': 200, 'bytes': count, 'sha256': h.hexdigest(),
              'content_type': actual_type, 'headers': headers}
    if rel.endswith('.mp4'):
        end = min(count, 32) - 1
        range_request = Request(obj['url'], headers={'Origin': origin, 'Referer': origin + '/',
                               'Accept-Encoding': 'identity', 'Range': f'bytes=0-{end}'})
        with urlopen(range_request, timeout=timeout) as response:
            body = response.read(end + 2)
            if response.status != 206 or response.headers.get('Content-Range') != f'bytes 0-{end}/{count}':
                raise ValueError('Video byte range unsupported: ' + rel)
            local = destination if destination else Path(output)/'oss'/rel
            with local.open('rb') as f:
                if body != f.read(end + 1):
                    raise ValueError('Video range bytes differ: ' + rel)
            result['range'] = {'http': 206, 'bytes': len(body), 'content_range': response.headers['Content-Range'],
                               'sha256': hashlib.sha256(body).hexdigest()}
    return result


def verify_object_with_retries(output, rel, obj, origin, timeout, download_to=None):
    for attempt in range(3):
        try:
            result=verify_object(output,rel,obj,origin,timeout,download_to)
            result['attempts']=attempt+1
            return result
        except OSError:
            if attempt==2:raise
            time.sleep(.3*(attempt+1))


def verify_remote(output, workers=4, timeout=60, retry_failed=False):
    output = Path(output).resolve()
    plan = verify_local(output)
    results = {}; previous = None; previous_hash = None
    pending = dict(plan['objects'])
    if retry_failed:
        previous_path=output/'remote-verification.json'
        previous=read(previous_path);previous_hash=digest(previous_path)
        if (previous.get('schema')!='wly.oss-remote-verification.v1' or previous.get('release_id')!=plan['release_id']
                or previous.get('plan_sha256')!=digest(output/PLAN) or set(previous.get('objects',{}))!=set(pending)):
            raise ValueError('Retry receipt differs from the complete current preparation plan')
        write(output/('remote-verification-'+previous_hash[:12]+'.json'),previous)
        for rel,row in previous['objects'].items():
            obj=pending[rel]
            if row.get('status')=='pass' and row.get('http')==200 and row.get('bytes')==obj['bytes'] and row.get('sha256')==obj['sha256']:
                results[rel]=row
        pending={rel:obj for rel,obj in pending.items() if rel not in results}
    def get_object(rel,obj):
        return verify_object_with_retries(output,rel,obj,plan['html_origin'],timeout)
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(get_object,rel,obj): rel for rel,obj in pending.items()}
        for future in concurrent.futures.as_completed(futures):
            rel = futures[future]
            try:
                results[rel] = future.result()
            except Exception as error:
                results[rel] = {'status': 'fail', 'error': str(error)}
            if len(results) % 50 == 0:
                print(f'GET verified {len(results)}/{len(plan["objects"])}', flush=True)
    failed = [rel for rel, value in results.items() if value['status'] != 'pass']
    report = {'schema': 'wly.oss-remote-verification.v1', 'verified_at_beijing': stamp(),
              'plan_sha256': digest(output/PLAN), 'release_id': plan['release_id'],
              'complete': not failed, 'objects': dict(sorted(results.items())), 'failed': sorted(failed),
              'html_ready': not failed, 'method': 'anonymous full GET body SHA256 plus MP4 byte range'}
    if previous:
        report.update({'retried_objects':len(pending),'retained_pass_objects':len(plan['objects'])-len(pending),
                       'previous_receipt_sha256':previous_hash,'retained_verified_at_beijing':previous['verified_at_beijing']})
    write(output/'remote-verification.json', report)
    if failed:
        raise ValueError(f'{len(failed)} remote objects failed; HTML is not ready')
    return report


def seal_remote(output):
    """Attach actual verified GET results before the HTML enters publication."""
    output = Path(output).resolve()
    plan = verify_local(output)
    if plan['test_only']:
        raise ValueError('A loopback rehearsal cannot seal a production release')
    proof = read(output/'remote-verification.json')
    if proof.get('plan_sha256') != digest(output/PLAN):
        raise ValueError('Remote verification belongs to a different preparation plan')
    path = output/'github'/MANIFEST
    manifest = read(path)
    manifest['oss']['verification'] = proof
    verify_manifest(manifest)
    write(path, manifest)
    plan['github_files'][MANIFEST] = {'bytes': path.stat().st_size, 'sha256': digest(path)}
    plan['remote_verified'] = True
    write(output/PLAN, plan)
    verify_local(output)
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    p = commands.add_parser('prepare')
    p.add_argument('--source', required=True)
    p.add_argument('--asset-base-url', required=True)
    p.add_argument('--prefix', required=True)
    p.add_argument('--output', required=True)
    p.add_argument('--html-origin', default='https://wly0829.cn')
    p.add_argument('--test-loopback', action='store_true', help='Local rehearsal only; publisher rejects this plan')
    for command in ('verify-local', 'verify-remote', 'seal-remote'):
        p = commands.add_parser(command)
        p.add_argument('--output', required=True)
        if command == 'verify-remote':
            p.add_argument('--workers', type=int, default=4)
            p.add_argument('--timeout', type=int, default=60)
            p.add_argument('--retry-failed',action='store_true',help='Recheck unresolved same-plan objects; preserve prior full-body proofs')
    args = parser.parse_args()
    if args.command == 'prepare':
        plan = prepare(args.source, args.asset_base_url, args.prefix, args.output, args.html_origin, args.test_loopback)
        print(json.dumps({'status': 'prepared', 'summary': plan['summary'], 'release_id': plan['release_id']}, ensure_ascii=False))
    elif args.command == 'verify-local':
        plan = verify_local(args.output)
        print(json.dumps({'status': 'pass', 'summary': plan['summary']}, ensure_ascii=False))
    elif args.command == 'verify-remote':
        report = verify_remote(args.output, args.workers, args.timeout, args.retry_failed)
        print(json.dumps({'status': 'pass', 'html_ready': report['html_ready'], 'objects': len(report['objects'])}))
    else:
        manifest = seal_remote(args.output)
        print(json.dumps({'status': 'sealed', 'release_id': manifest['release_id']}))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)

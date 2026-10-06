"""Replay the frozen album effect on a complete immutable local release.

No publishing, downloads, image generation, source mutation, or screenshots.
Producer coordinates are accepted only after their HTML, PNG, and transported
release image pixels agree. Missing subjects retain the native body/title effect.
"""
from __future__ import annotations
import argparse
import ast
import asyncio
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import subprocess
from datetime import datetime, timedelta, timezone
from urllib.parse import unquote, urljoin, urlsplit

HERE = Path(__file__).resolve().parent
DATA = re.compile(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>', re.S)
SCRIPT = re.compile(r'<script\b(?P<attrs>[^>]*)>(?P<body>.*?)</script>', re.S | re.I)
ATTR = re.compile(r'([\w-]+)\s*=\s*(["\'])(.*?)\2', re.S)


def digest(path):
    with Path(path).open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))


def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', 'utf8')


def inventory(root):
    return {p.relative_to(root).as_posix(): {'sha256': digest(p), 'bytes': p.stat().st_size}
            for p in sorted(root.rglob('*')) if p.is_file() and p.name != 'release-manifest.json'}


def route(rel):
    return '/' + (rel[:-10] if rel.endswith('index.html') else rel)


def canonical(url):
    return urlsplit(url).path.replace('index.html', '')


def metadata_links(value):
    if isinstance(value, dict):
        result = set()
        for k,v in value.items():
            if k in {'href','primary_href'} and isinstance(v,str) and v.startswith('/'):
                result.add(canonical(v))
            result.update(metadata_links(v))
        return result
    if isinstance(value, list):
        return set().union(*(metadata_links(v) for v in value)) if value else set()
    return set()


class Links(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.links = set(); self.feed(text)

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == 'a' and data.get('href'):
            href = data['href']; u = urlsplit(href)
            if not u.netloc and u.path.startswith('/') or u.hostname == 'wly0829.cn':
                self.links.add(canonical(href))


class PictureParts(HTMLParser):
    """Read the real produced part IDs; their ordinal is page-wide, not screen-wide."""
    def __init__(self, text):
        super().__init__(); self.active=None; self.parts=[]; self.feed(text)

    def handle_starttag(self, tag, attrs):
        data=dict(attrs)
        if tag=='div' and 'typeset-part' in data.get('class','').split() and data.get('data-part'):
            self.active={'id':data['data-part'],'orientation':data.get('data-orientation')}
        elif tag=='img' and self.active and (data.get('data-src') or data.get('src')):
            self.parts.append({**self.active,'src':data.get('data-src') or data['src']}); self.active=None


def remove_document_hints(text):
    """Remove actual startup document hints, never examples inside script data."""
    offsets, position = [], 0
    for line in text.splitlines(keepends=True):
        offsets.append(position); position += len(line)
    spans = []
    class Hints(HTMLParser):
        def handle_starttag(self, tag, attrs):
            values = dict(attrs); rel = (values.get('rel') or '').lower().split()
            if tag != 'link' or not ('prerender' in rel or 'prefetch' in rel and values.get('as','document').lower() == 'document'):
                return
            line, column = self.getpos(); start = offsets[line-1]+column
            spans.append((start,start+len(self.get_starttag_text())))
    Hints().feed(text)
    for start,end in reversed(spans):
        text = text[:start]+text[end:]
    return text,len(spans)


def patch_legacy_pointer_intent(out, original):
    """Keep existing module URLs and RR allowlists; only change its focus hook."""
    before = b'document.addEventListener(`focusin`,e=>n(e.target.closest?.(`a[href]`)))'
    after = b'document.addEventListener(`pointerdown`,e=>n(e.target.closest?.(`a[href]`)))'
    changes = []
    for rel in original:
        if not rel.endswith('.js'):
            continue
        path = out/rel; payload = path.read_bytes()
        if b"link[rel='prefetch'][as='document']" not in payload or before not in payload:
            continue
        if payload.count(before) != 1:
            raise ValueError('Ambiguous legacy document-prefetch hook: '+rel)
        path.write_bytes(payload.replace(before,after,1))
        changes.append({'path':rel,'before':original[rel], 'after':{'bytes':path.stat().st_size,'sha256':digest(path)},
                        'change':'Original document prefetch focusin -> pointerdown; original pointerover remains'})
    return changes


def local_asset(source, src, owner):
    u = urlsplit(src)
    if u.netloc:
        # Content-addressed OSS URLs may be mapped to a supplied complete source,
        # but no image is downloaded and no old fixed prefix is assumed.
        candidates = [source / unquote(u.path.lstrip('/'))]
        suffix = unquote(u.path).split('/')
        candidates += [source.joinpath(*suffix[i:]) for i in range(1, len(suffix))]
        return next((p for p in candidates if p.is_file()), None)
    relative = urljoin('/' + owner, src)
    target = (source / unquote(relative.lstrip('/'))).resolve()
    return target if target.is_relative_to(source) and target.is_file() else None


def pixels(path):
    from PIL import Image
    with Image.open(path) as image:
        return image.size, hashlib.sha256(image.convert('RGBA').tobytes()).hexdigest()


def fit_script(proof):
    path = Path(proof['path'])
    if not path.is_file() or digest(path) != proof.get('sha256'):
        raise ValueError('Producer fit script hash changed: ' + str(path))
    tree = ast.parse(path.read_text('utf8'))
    return next(ast.literal_eval(n.value) for n in tree.body if isinstance(n, ast.Assign)
                and any(isinstance(t, ast.Name) and t.id == 'FIT_JS' for t in n.targets))


def bound_geometries(paths):
    """Read geometry identities from the producer's actual per-page inputs.

    Follow only the build's named baseline, never the newest directory or a
    loose geometry glob. Pixel matching below still binds each current image.
    """
    pending, seen, result, proofs = list(paths), set(), {}, []
    while pending:
        report_path = pending.pop(0).resolve()
        if report_path in seen:
            continue
        seen.add(report_path)
        report = read(report_path)
        inputs = dict(report.get('inputs') or {})
        for page in (report.get('pages') or {}).values():
            inputs.update(page.get('inputs') or {})
        selected = {}
        for name, receipt in inputs.items():
            candidate = Path(name)
            if candidate.suffix == '.json' and 'geometry' in candidate.name:
                selected[candidate.resolve()] = receipt.get('sha256')
        if report.get('geometry_path'):
            selected[Path(report['geometry_path']).resolve()] = report.get('geometry_sha256')
        accepted = []
        for candidate, expected in selected.items():
            if not expected or not candidate.is_file() or digest(candidate) != expected:
                raise ValueError('Build-bound geometry changed: ' + str(candidate))
            data = read(candidate)
            if not data.get('records') or not data.get('fit_input'):
                continue
            if candidate in result and result[candidate] != expected:
                raise ValueError('Conflicting geometry generations: ' + str(candidate))
            result[candidate] = expected
            accepted.append({'path': str(candidate), 'sha256': expected})
        proofs.append({'path': str(report_path), 'sha256': digest(report_path), 'geometry': accepted})
        baseline = report.get('baseline_root')
        if baseline:
            baseline_report = Path(baseline).parent / 'build-report.json'
            if baseline_report.is_file():
                pending.append(baseline_report)
    return list(result), proofs


async def titles(records, chrome, profiles, evidence, ownership):
    """Observe existing visible title-image DOM; no invented title_rect field."""
    if not records:
        return {}
    from playwright.async_api import async_playwright
    result = {}
    profiles.mkdir(parents=True, exist_ok=False)
    ownership['profile_created'] = True
    async with async_playwright() as pw:
        context = await pw.chromium.launch_persistent_context(str(profiles), executable_path=str(chrome), headless=True,
                    viewport={'width': 1672, 'height': 200}, args=['--hide-scrollbars'], timezone_id='Asia/Shanghai')
        try:
            async def only_local(request):
                if request.request.method != 'GET' or not request.request.url.startswith(('file:', 'data:')):
                    await request.abort()
                else:
                    await request.continue_()
            await context.route('**/*', only_local)
            page = context.pages[0]
            for ident, record in records.items():
                hp = Path(record['html']); width = record['measured_width']
                await page.set_viewport_size({'width': width, 'height': 200})
                await page.goto(hp.as_uri(), wait_until='load', timeout=20000)
                await page.evaluate('document.fonts.ready')
                await page.evaluate('Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))')
                await page.evaluate('(' + record['_fit'] + ')()')
                measured = await page.evaluate("""()=>({width:document.documentElement.clientWidth,height:document.documentElement.scrollHeight,
                    titles:[...document.querySelectorAll('[data-comp=chapter_title] img,.title-wrap.title-img img')].filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return {rect:[r.x,r.y+scrollY,r.width,r.height],src:e.getAttribute('src')};}),
                    illustrations:[...document.querySelectorAll('[data-comp=illustration] img,.ill img,img.mock-base-art,svg.illustration-panel')].map(e=>{const r=e.getBoundingClientRect();return [r.x,r.y+scrollY,r.width,r.height];}),
                    broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)})""")
                valid = measured['width'] == width and abs(measured['height'] - record['measured_height']) <= 2 and not measured['broken']
                expected = [a['rect'] for a in record.get('illustrations', [])]
                valid = valid and len(expected) == len(measured['illustrations']) and all(abs(a-b) <= 1 for pair in zip(expected, measured['illustrations']) for a,b in zip(*pair))
                evidence.append({'screen': record['screen'], 'orientation': record['orientation'], 'html_sha256': record['html_sha256'],
                                 'basis': 'installed Chrome current producer title image DOM plus bound FIT_JS', 'valid': valid, **measured})
                if valid:
                    result[ident] = measured['titles']
        finally:
            await context.close()
    return result


def inject_runtime(text, js, css, index, model):
    text, removed_hints = remove_document_hints(text)
    delayed = []
    def delay(match):
        attrs = dict((k.lower(), html.unescape(v)) for k, _, v in ATTR.findall(match['attrs']))
        src = attrs.get('src')
        if not src or 'data-album-runtime' in match['attrs']:
            return match[0]
        # Delay the existing enhancement entries, not data or configuration JS.
        if 'defer' not in match['attrs'] and attrs.get('type') != 'module':
            return match[0]
        delayed.append(src)
        opening = re.sub(r'\bsrc\s*=\s*(["\']).*?\1', '', match['attrs'], count=1, flags=re.S)
        opening = re.sub(r'\bdefer\b', '', opening)
        # data-src participates in the site's existing OSS URL mapper.
        return '<script' + opening + ' data-album-runtime data-src="' + html.escape(src, quote=True) + '"></script>'
    text = SCRIPT.sub(delay, text)
    serialized = json.dumps(model, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    head = '<script id="album-page" type="application/json">' + serialized + '</script>'
    head += '<link rel="preload" as="fetch" href="' + index + '" crossorigin="anonymous" id="album-route-index">'
    head += '<link rel="stylesheet" href="' + css + '"><script src="' + js + '"></script>'
    # Before deferred enhancement entries, and before first reveal registration.
    charset = re.search(r'<meta\b[^>]*charset=[^>]*>', text, re.I)
    if charset:
        text = text[:charset.end()] + head + text[charset.end():]
    else:
        text = text.replace('<head>', '<head>' + head, 1)
    # First-screen original pixels must exist while their enhancement entry waits.
    if model.get('entry'):
        start = text.find('id="' + model['entry'] + '"')
        end = text.find('</section>', start)
        if start >= 0 and end >= 0:
            part = text[start:end].replace('loading="lazy"', 'loading="eager"')
            def eager(tag):
                attrs = dict((k.lower(),v) for k,_,v in ATTR.findall(tag[0]))
                addition = ''.join(' ' + name + '="' + html.escape(attrs['data-'+name],quote=True) + '"' for name in ['src','srcset'] if attrs.get('data-'+name) and not attrs.get(name))
                return tag[0][:-2] + addition + ' />' if tag[0].endswith('/>') and addition else tag[0][:-1] + addition + '>'
            part = re.sub(r'<(?:img|source)\b[^>]*>', eager, part)
            text = text[:start] + part + text[end:]
    return text, delayed, removed_hints


async def prepare(args, ownership):
    source, out = args.source.resolve(), args.out.resolve()
    if source == out or out.exists() or out.is_relative_to(source):
        raise ValueError('Output must be a new directory outside the immutable source')
    manifest = read(source / 'release-manifest.json')
    original = inventory(source)
    declared = manifest.get('files', {})
    if not declared or original != {k:v for k,v in declared.items() if k != 'release-manifest.json'}:
        raise ValueError('Complete source inventory differs from its release manifest')
    if any(k not in original for k in declared if k != 'release-manifest.json'):
        raise ValueError('HTML-only package is not a complete replay source')
    oss_objects=manifest.get('oss',{}).get('objects',{})
    if any(k not in original for k in oss_objects):
        raise ValueError('HTML-only OSS package: restore all manifest OSS objects into a complete inventory-bound local source before replay')
    pages = {k: (source/k).read_bytes().decode('utf8') for k in original if k.endswith('.html')}
    records, geometry_proofs = {}, []
    report_geometries, report_proofs = bound_geometries(args.build_report)
    geometry_paths = list(dict.fromkeys(args.geometry + report_geometries))
    for p in geometry_paths:
        d = read(p); fit = fit_script(d['fit_input']); geometry_proofs.append({'path': str(p.resolve()), 'sha256': digest(p)})
        for r in d.get('records', []):
            if r.get('issues') or r.get('broken_images') or not r.get('parts'):
                continue
            hp = Path(r['html'])
            if hp.is_file() and digest(hp) == r.get('html_sha256'):
                r = dict(r); r['_fit'] = fit; records.setdefault((r['screen'], r['orientation']), []).append(r)
    models, checks, needed = {}, [], {}
    pixel_cache = {}
    for rel, text in pages.items():
        match = DATA.search(text); data = json.loads(match[1]) if match else {}
        picture_parts=PictureParts(text).parts
        nodes, image_rows = [], []
        screens = data.get('screens', []); entry = next((s['id'] for s in screens if s.get('shape') != 'card'), None)
        for screen in screens:
            if screen['id'] != entry and screen.get('shape') != 'card' and not screen.get('primary_href'):
                continue
            for part in screen.get('parts', []):
                sid, orient = screen['id'], part['orientation']
                asset = local_asset(source, part['src'], rel)
                first_cards = screens.index(screen) < (2 if orient == 'v' else 4) and not entry
                if sid == entry or first_cards:
                    image_rows.append({'src': urljoin('/' + rel, part['src']), 'orientation': orient, 'both': part.get('both', False), 'widthBased': bool(data.get('typeset'))})
                if not asset:
                    continue
                for r in records.get((sid, orient), []):
                    source_part = next((p for p in r['parts'] if p['image'] == part['image'] and p['size'] == part['size']), None)
                    png = Path(r['html']).parents[1] / part['image']
                    if not source_part or not png.is_file() or digest(png) != source_part['sha256']:
                        continue
                    for image in [asset, png]:
                        if image not in pixel_cache:
                            pixel_cache[image] = pixels(image)
                    if pixel_cache[asset] != pixel_cache[png]:
                        continue
                    ident = r['html_sha256'] + ':' + orient; needed[ident] = r
                    index_part = r['parts'].index(source_part)
                    offset = sum(p['size'][1]-30 for p in r['parts'][:index_part]); padding = 30 if index_part else 0
                    size = part['size']
                    def normalized(rect):
                        x,y,w,h = rect; y = y-offset+padding
                        if x < 0 or y < 0 or x+w > size[0]+1 or y+h > size[1]+1:
                            return None
                        return [x/size[0], y/size[1], w/size[0], h/size[1]]
                    arts = [{'key': a['reference_sha256'], 'rect': normalized(a['rect'])} for a in r.get('illustrations', []) if a.get('reference_sha256') and normalized(a['rect'])]
                    actual=next((p for p in picture_parts if p['orientation']==orient and local_asset(source,p['src'],rel)==asset),None)
                    if not actual: raise ValueError('Bound image has no actual produced picture-part DOM: '+rel+' '+part['src'])
                    node = {'screen': sid, 'selector': '[data-part="' + actual['id'] + '"]',
                            'src': urljoin('/' + rel, actual['src']), 'size': size, 'orientation': orient, 'arts': arts,
                            'primary': canonical(screen['primary_href']) if screen.get('primary_href') else None,
                            'links': sorted(set(canonical(l['href']) for l in part.get('links', []) if l.get('href', '').startswith('/'))),
                            '_record': ident, '_offset': offset, '_padding': padding}
                    nodes.append(node)
                    checks.append({'route': route(rel), 'screen': sid, 'orientation': orient, 'image': part['image'],
                                   'producer_html_sha256': r['html_sha256'], 'producer_png_sha256': source_part['sha256'],
                                   'transport_sha256': digest(asset), 'decoded_pixel_equal': True, 'art_count': len(arts)})
                    break
        # Legacy raster first screen has exact responsive resource metadata, but
        # no reliable crop coordinates. Warm it without inventing a subject.
        if entry and not image_rows:
            start=text.find('id="'+entry+'"'); stop=text.find('</section>',start)
            section=text[start:stop] if start>=0 and stop>=0 else ''
            for tag in re.findall(r'<source\b[^>]*>',section,re.I):
                attrs=dict((k.lower(),html.unescape(v)) for k,_,v in ATTR.findall(tag))
                srcset=attrs.get('srcset') or attrs.get('data-srcset')
                if attrs.get('type')!='image/avif' or not srcset: continue
                candidates=[]
                for item in srcset.split(','):
                    fields=item.strip().split()
                    if fields: candidates.append({'src':urljoin('/'+rel,fields[0]),'descriptor':' '.join(fields[1:])})
                if candidates:
                    image_rows.append({'src':candidates[0]['src'],'candidates':candidates,'media':attrs.get('media',''),'sizes':attrs.get('sizes','')})
            if not image_rows:
                first = next(s for s in screens if s['id'] == entry)
                for orient, lay in first.get('layouts', {}).items():
                    viewer = lay.get('viewer') or {}; src = viewer.get('avif') or viewer.get('src')
                    if src:
                        image_rows.append({'src': urljoin('/' + rel, src), 'orientation': orient})
        models[route(rel)] = {'route': route(rel), 'entry': entry, 'nodes': nodes, 'images': image_rows, 'outbound': {}, '_links': Links(text).links | metadata_links(data)}
    evidence = []
    observed = {}
    if args.title_cache:
        previous = read(args.title_cache)
        for row in previous['title_dom_measurements']:
            ident = row['html_sha256'] + ':' + row['orientation']
            if ident in needed and row['valid'] and digest(Path(needed[ident]['html'])) == row['html_sha256']:
                observed[ident] = row['titles']; evidence.append(row)
    pending = {k:v for k,v in needed.items() if k not in observed}
    observed.update(await titles(pending, args.chrome, args.profile, evidence, ownership))
    for model in models.values():
        for node in model['nodes']:
            rs = observed.get(node.pop('_record'), [])
            yoff, padding = node.pop('_offset'), node.pop('_padding'); width, height = node['size']
            title_row = next((r for r in rs if r['rect'][1] >= yoff and r['rect'][1]+r['rect'][3] <= yoff+height-padding+1), None)
            title = title_row['rect'] if title_row else None
            if title:
                x,y,w,h = title; node['title'] = [x/width, (y-yoff+padding)/height, w/width, h/height]
                title_path = urlsplit(title_row['src'])
                if title_path.scheme == 'file':
                    local_title = Path(unquote(title_path.path).lstrip('/'))
                    if local_title.is_file(): node['titleKey'] = digest(local_title)
        for target in sorted(model.pop('_links')):
            if target in models:
                destination = models[target]
                model['outbound'][target] = {'keys': sorted(set(a['key'] for n in destination['nodes'] if n['screen'] == destination['entry'] for a in n['arts'])),
                                             'allKeys': sorted(set(a['key'] for n in destination['nodes'] for a in n['arts'])),
                                             'titleKeys': sorted(set(n['titleKey'] for n in destination['nodes'] if n.get('titleKey') and not n['primary'])),
                                             'hasTitle': any(n.get('title') and not n['primary'] for n in destination['nodes']) or bool(re.search(r'<h1\b(?![^>]*class="[^"]*visually-hidden)[^>]*>', pages[next(r for r in pages if route(r)==target)], re.I))}
    base = args.asset_baseurl.rstrip('/') + '/' if args.asset_baseurl else ''
    def resource(rel):
        return base + rel if base else '/' + rel
    route_index = {'schema': 'wly.album-routes.v1', 'routes': {k: {'images': v['images']} for k,v in models.items()}}
    index_bytes = (json.dumps(route_index, ensure_ascii=False, separators=(',', ':'))+'\n').encode()
    index_rel = '_album/routes-' + hashlib.sha256(index_bytes).hexdigest()[:20] + '.json'
    js_bytes, css_bytes = (HERE/'album-runtime.js').read_bytes(), (HERE/'album-runtime.css').read_bytes()
    js_rel = '_album/album-' + hashlib.sha256(js_bytes).hexdigest()[:20] + '.js'
    css_rel = '_album/album-' + hashlib.sha256(css_bytes).hexdigest()[:20] + '.css'
    shutil.copytree(source, out)
    legacy_changes = patch_legacy_pointer_intent(out, original)
    (out/'_album').mkdir(exist_ok=True)
    for rel, payload in [(index_rel,index_bytes),(js_rel,js_bytes),(css_rel,css_bytes)]:
        (out/rel).write_bytes(payload)
    changed, delayed, removed_hints = [], {}, {}
    for rel, text in pages.items():
        model = models[route(rel)]
        text, scripts, hint_count = inject_runtime(text, resource(js_rel), resource(css_rel), resource(index_rel), model)
        (out/rel).write_bytes(text.encode('utf8')); changed.append(rel); delayed[route(rel)] = scripts
        if hint_count: removed_hints[route(rel)] = hint_count
    files = inventory(out)
    image_suffix = {'.png','.webp','.avif','.jpg','.jpeg','.gif','.svg','.ico','.bmp','.tiff','.tif','.mp4','.webm'}
    immutable = [k for k in original if Path(k).suffix.lower() in image_suffix]
    modified_scripts = {row['path'] for row in legacy_changes}
    if any(files.get(k) != original[k] for k in original if not k.endswith('.html') and k not in modified_scripts):
        raise AssertionError('An original source asset byte changed')
    release_id = hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest()
    manifest['files'] = files; manifest['release_id'] = release_id
    manifest['page_flip_preparation'] = {'schema': 'wly.album-preparation.v1', 'status': 'prepared_pending_parent_acceptance',
        'baseline_release_id': read(source/'release-manifest.json')['release_id'], 'source_root': str(source),
        'motion_ms': 655, 'total_budget_ms': 785, 'runtime': [js_rel,css_rel,index_rel], 'geometry': geometry_proofs, 'build_reports': report_proofs,
        'modified_legacy_scripts': legacy_changes, 'removed_startup_document_hints': removed_hints,
        'unchanged_source_media_count': len(immutable), 'native_routes': len(models), 'no_corresponding_subject_routes': [k for k,v in models.items() if not any(n['arts'] for n in v['nodes'] if n['screen'] == v['entry'])]}
    write(out/'release-manifest.json', manifest)
    summary = {'status': 'prepared', 'release_id': release_id, 'source_release_id': manifest['page_flip_preparation']['baseline_release_id'],
               'source': str(source), 'candidate': str(out), 'files': len(files), 'html': len(pages), 'changed_html': changed,
               'delayed_scripts': delayed, 'pixel_bindings': checks, 'title_dom_measurements': evidence, 'geometry_build_reports': report_proofs,
               'modified_legacy_scripts':legacy_changes,'removed_startup_document_hints':removed_hints,
               'route_effects': {k: {'entry':v['entry'], 'art_count':sum(len(n['arts']) for n in v['nodes']), 'title_count':sum('title' in n for n in v['nodes'])} for k,v in models.items()},
               'original_media_bytes_preserved': True, 'prepared_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat()}
    write(args.evidence, summary)
    print(json.dumps({k:summary[k] for k in ['status','release_id','files','html','original_media_bytes_preserved']}, ensure_ascii=False))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--source', type=Path, required=True)
    ap.add_argument('--out', type=Path, required=True)
    ap.add_argument('--geometry', type=Path, action='append', default=[])
    ap.add_argument('--build-report', type=Path, action='append', default=[], help='Read hash-bound geometry from actual page inputs, including named baseline build reports')
    ap.add_argument('--asset-baseurl', default='', help='Configured new asset base; omitted for the later OSS mapping stage')
    ap.add_argument('--chrome', type=Path, default=Path('C:/Program Files/Google/Chrome/Application/chrome.exe'))
    ap.add_argument('--profile', type=Path, required=True)
    ap.add_argument('--evidence', type=Path, required=True)
    ap.add_argument('--title-cache', type=Path, help='Reuse same-generation, hash-bound producer DOM observations')
    args = ap.parse_args()
    source=args.source.resolve(); out=args.out.resolve(); profile=args.profile.resolve(); evidence=args.evidence.resolve()
    if profile.exists() or any(p.is_relative_to(source) for p in [out,profile,evidence]) or profile.is_relative_to(out) or evidence.is_relative_to(out):
        raise ValueError('Candidate, evidence and new owned profile must be outside the immutable source and separate from one another')
    ownership={}; args.evidence.parent.mkdir(parents=True, exist_ok=True)
    try:
        asyncio.run(prepare(args, ownership))
    finally:
        if ownership.get('profile_created') and args.profile.exists():
            subprocess.run(['pwsh','-NoProfile','-File','E:/.agents/tools/Move-TaskItemToRecycleBin.ps1',
                            '-LiteralPath',str(args.profile.resolve()),'-AllowedRoot',str(args.profile.parent.resolve()),'-Json'], check=True,
                           creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))


if __name__ == '__main__':
    main()

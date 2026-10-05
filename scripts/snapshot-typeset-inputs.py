"""Freeze one local typeset input batch; copy bytes, never render or publish."""
from __future__ import annotations

import argparse
from collections import defaultdict
from datetime import datetime, timedelta, timezone
import hashlib
import html
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import struct
import sys
import time
from urllib.parse import unquote, urlsplit

BJT = timezone(timedelta(hours=8))
TEXT_SUFFIXES = {'.html', '.css', '.json', '.jsonl', '.py'}
ATTRIBUTE = re.compile(r'''([^\s=<>/]+)(\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s>]+))''')
CSS_REFERENCE = re.compile(
    r'''\burl\s*\(\s*(?:"(?P<double>(?:\\.|[^"\\])*)"|'(?P<single>(?:\\.|[^'\\])*)'|(?P<bare>[^)\s]+))\s*\)'''
    r'''|@import\s+(?:"(?P<import_double>(?:\\.|[^"\\])*)"|'(?P<import_single>(?:\\.|[^'\\])*)')''',
    re.I)
# Runtime modules loaded by the current registry (including comp-hub's dynamic
# modules and comp-text's deferred motion helper); exclude demos and audits.
PRODUCER_COMPONENTS = {
    'core': ('__init__',),
    'table': ('__init__', 'table'),
    'comp-diagram': ('__init__', '_shared', 'sequence', 'structure', 'detail'),
    'comp-text': ('__init__', 'primitives', 'cards', 'buttons', 'motion_dots'),
    'comp-slots': ('__init__', 'common', 'shots', 'live', 'controls', 'mocks'),
    'comp-hub': ('__init__', 'headings', 'feature_status', 'tiles', 'link_stats',
                 'entry_cards', 'layout_constraints'),
}


def digest(payload):
    return hashlib.sha256(payload).hexdigest()


def stamp_file(path):
    size = 0
    sha = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            sha.update(chunk)
            size += len(chunk)
    return {'sha256': sha.hexdigest(), 'bytes': size}


def decode(payload):
    return payload.decode('utf-8-sig')


def safe_part(value, label):
    if not value or value in {'.', '..'} or any(x in value for x in '/\\:'):
        raise ValueError('Invalid ' + label + ': ' + str(value))
    return value


def validate_page_inputs(page, source, rows, manifest):
    visible = [screen for screen in source['screens'] if not screen.get('hidden')]
    expected = [safe_part(screen['id'], 'source screen') for screen in visible]
    if len(expected) != len(set(expected)):
        raise ValueError('Duplicate visible source screen: ' + page)
    inventoried = [row['screen_id'] for row in rows if not row.get('hidden')]
    if inventoried != expected:
        raise ValueError('Inventory screen order/completeness differs from source: ' + page)
    manifested = [screen['screen'] for screen in manifest['screens']]
    if manifested != expected:
        raise ValueError('Manifest screen order/completeness differs from source: ' + page)
    exceptions = []
    visible_rows = [row for row in rows if not row.get('hidden')]
    for source_screen, row, manifest_screen in zip(visible, visible_rows, manifest['screens']):
        orientations = {image.get('orientation', 'v' if '-v' in image['image'] else 'h')
                        for image in manifest_screen.get('images', [])}
        portrait = row.get('portrait') or {}
        shared_horizontal = portrait.get('required') is False
        wanted = {'h'} if source_screen.get('shape') == 'card' or shared_horizontal else {'h', 'v'}
        if not wanted <= orientations or not orientations <= {'h', 'v'}:
            raise ValueError('Manifest screen orientations incomplete/invalid: ' + page + '/'
                             + source_screen['id'] + '; expected ' + ','.join(sorted(wanted))
                             + '; received ' + ','.join(sorted(orientations)))
        if shared_horizontal:
            exceptions.append({'page': page, 'screen_id': source_screen['id'],
                               'source_kind': source.get('kind'),
                               'basis': 'inventory.portrait.required=false', 'wanted': ['h'],
                               'constraints': portrait.get('constraints', ''),
                               'source_portrait': source_screen.get('portrait', '')})
    return exceptions


class ResourceHTML(HTMLParser):
    """Edit real attribute/style spans; text and script examples are untouched."""
    def __init__(self, text, owner, rewrite):
        super().__init__(convert_charrefs=False)
        self.text = text
        self.owner = owner
        self.rewrite = rewrite
        self.edits = []
        self.in_style = False
        self.lines = [0]
        self.lines.extend(m.end() for m in re.finditer('\n', text))
        self.feed(text)
        self.close()

    def absolute_position(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        raw = self.get_starttag_text()
        start = self.absolute_position()
        # The parser has already established that this is a tag, not body text.
        for match in ATTRIBUTE.finditer(raw):
            name = match[1].lower()
            group = next((i for i in (3, 4, 5) if match[i] is not None), None)
            value = html.unescape(match[group])
            if name in {'src', 'href', 'poster'}:
                new = self.rewrite(value, self.owner)
            elif name == 'style':
                new = rewrite_css(value, self.owner, self.rewrite)
            else:
                continue
            if new != value:
                self.edits.append((start + match.start(group), start + match.end(group),
                                   html.escape(new, quote=True)))
        if tag.lower() == 'style':
            self.in_style = True

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag.lower() == 'style':
            self.in_style = False

    def handle_endtag(self, tag):
        if tag.lower() == 'style':
            self.in_style = False

    def handle_data(self, data):
        if self.in_style:
            new = rewrite_css(data, self.owner, self.rewrite)
            if new != data:
                start = self.absolute_position()
                self.edits.append((start, start + len(data), new))

    def result(self):
        text = self.text
        for start, end, value in sorted(self.edits, reverse=True):
            text = text[:start] + value + text[end:]
        return text


def rewrite_css(text, owner, rewrite):
    # Keep comment positions intact and exclude quoted strings outside CSS references.
    pattern = re.compile(r'/\*.*?\*/|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|'
                         + CSS_REFERENCE.pattern, re.I | re.S)
    edits = []
    for match in pattern.finditer(text):
        group = next((key for key, value in match.groupdict().items() if value is not None), None)
        if group is None:
            continue
        old = match[group]
        new = rewrite(old, owner)
        if new != old:
            edits.append((match.start(group), match.end(group), new))
    for start, end, value in reversed(edits):
        text = text[:start] + value + text[end:]
    return text


class Snapshot:
    def __init__(self, typeset_root, inventory, output, pages=None, page_inputs=None, producer_root=None):
        self.typeset_root = typeset_root
        self.pipeline = typeset_root.parent
        self.inventory = inventory
        self.output = output
        self.requested_pages = pages
        self.sources = {}
        self.emissions = {}
        self.active = set()
        self.processing = set()
        self.issues = []
        self.history = []
        self.fonts = set()
        self.font_uris = defaultdict(set)
        self.retired_root = output.parent / (output.name + '-retired')
        self.retired = []
        self.round = 0
        self.pages = []
        self.orientation_exceptions = []
        self.pngs = 0
        self.started = time.perf_counter()
        self.page_inputs = page_inputs or {}
        self.resource_aliases = {}
        self.dependency_namespace = None
        self.current_page = None
        self.producer_root = producer_root
        repository = Path(__file__).resolve().parents[1]
        self.asset_root = Path(os.environ.get('TYPESET_ASSET_ROOT', repository/'sources/assets' if producer_root == repository/'src/typeset' else self.pipeline/'typeset-assets'))

    def load(self, source):
        source = source.resolve()
        if source not in self.sources:
            # The copied payload and its original hash come from the same read.
            payload = source.read_bytes()
            proof = {'sha256': digest(payload), 'bytes': len(payload)}
            self.sources[source] = {'proof': proof,
                                    'payload': payload if source.suffix.lower() in TEXT_SUFFIXES else None}
            return payload, proof
        state = self.sources[source]
        return state['payload'], state['proof']

    def retire(self, path):
        rel = path.relative_to(self.output)
        target = self.retired_root / ('round-' + str(self.round)) / rel
        if target.exists():
            raise ValueError('Retirement destination already exists: ' + str(target))
        target.parent.mkdir(parents=True, exist_ok=True)
        path.rename(target)
        self.retired.append(str(target))

    def write_payload(self, dest, payload):
        new_proof = {'sha256': digest(payload), 'bytes': len(payload)}
        if dest.exists():
            if stamp_file(dest) == new_proof:
                return new_proof
            self.retire(dest)
        dest.parent.mkdir(parents=True, exist_ok=True)
        with dest.open('xb') as stream:
            stream.write(payload)
        # Read the result, rather than assuming that writing succeeded correctly.
        if stamp_file(dest) != new_proof:
            raise ValueError('Snapshot write verification failed: ' + str(dest))
        return new_proof

    def destination(self, source):
        if self.producer_root and source.is_relative_to(self.producer_root):
            return Path('typeset-proto') / source.relative_to(self.producer_root)
        try:
            relative = source.relative_to(self.pipeline)
            if self.dependency_namespace and not (len(relative.parts)>1 and relative.parts[0] in {'typeset-out','typeset-assets'} and relative.parts[1]==self.current_page):
                return Path('resources/frozen-input')/self.dependency_namespace/relative
            return relative
        except ValueError:
            # Preserve just the actual external resource, never its entire parent tree.
            bucket = digest(str(source).encode('utf8'))[:16]
            return Path('resources') / 'external' / bucket / source.name

    def copy(self, source, rel=None, transform=True):
        source = source.resolve()
        rel = Path(rel) if rel is not None else self.destination(source)
        if rel.is_absolute() or '..' in rel.parts:
            raise ValueError('Invalid snapshot destination: ' + str(rel))
        dest = self.output / rel
        key = (source, rel)
        self.active.add(key)
        if key in self.processing:
            return dest
        # An emission is recomputed only when its source was invalidated, or for
        # HTML/CSS so that changed dependencies remain in the active dependency graph.
        previous = self.emissions.get(key)
        payload, proof = self.load(source)
        text_resource = transform and source.suffix.lower() in {'.html', '.css'}
        if previous and previous['original_sha256'] == proof['sha256'] and not text_resource:
            return dest
        self.processing.add(key)
        try:
            if text_resource:
                text = decode(payload)
                if source.suffix.lower() == '.html':
                    text = ResourceHTML(text, source, self.rewrite_reference).result()
                else:
                    text = rewrite_css(text, source, self.rewrite_reference)
                frozen_payload = text.encode('utf8')
            else:
                # Binary payloads are not retained across the batch in memory.
                if payload is None:
                    raise ValueError('Missing captured payload for changed file: ' + str(source))
                frozen_payload = payload
            if source.suffix.lower() == '.png':
                if frozen_payload[:8] != b'\x89PNG\r\n\x1a\n' or frozen_payload[12:16] != b'IHDR':
                    raise ValueError('Invalid PNG header: ' + str(source))
                png_size = list(struct.unpack('>II', frozen_payload[16:24]))
            else:
                png_size = None
            frozen = self.write_payload(dest, frozen_payload)
            self.emissions[key] = {
                'original_path': str(source), 'original_sha256': proof['sha256'],
                'original_bytes': proof['bytes'], 'snapshot_path': str(dest),
                'snapshot_relative_path': rel.as_posix(), 'snapshot_sha256': frozen['sha256'],
                'snapshot_bytes': frozen['bytes'], 'transformed': frozen_payload != payload,
                **({'png_size': png_size} if png_size else {})}
        finally:
            self.processing.remove(key)
        return dest

    def rewrite_reference(self, ref, owner):
        if not ref or ref.startswith('#'):
            return ref
        parsed = urlsplit(ref)
        if parsed.scheme and parsed.scheme.lower() != 'file':
            return ref
        if parsed.scheme.lower() == 'file':
            if parsed.netloc and parsed.netloc.lower() != 'localhost':
                source = Path('//' + parsed.netloc + unquote(parsed.path))
            else:
                value = unquote(parsed.path)
                if re.match(r'^/[A-Za-z]:/', value):
                    value = value[1:]
                source = Path(value)
        else:
            # Website routes are navigation, not a producer-local asset path.
            if ref.startswith('/'):
                return ref
            source = owner.parent / unquote(parsed.path)
        source = source.resolve()
        if source.as_posix().lower().startswith('c:/windows/fonts/'):
            # This font remains a host dependency. Observe its bytes without
            # copying it or claiming that its path alone freezes the dependency.
            self.load(source)
            self.fonts.add(str(source))
            self.font_uris[str(source)].add(ref)
            return ref
        # A relative navigation target can refer to a website route. Local file
        # URIs, by contrast, promise a file and must not silently stay mutable.
        if not parsed.scheme and not source.is_file() and source.suffix.lower() not in {
                '.css', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.woff', '.woff2',
                '.ttf', '.otf', '.js', '.mjs', '.mp4', '.webm', '.html'}:
            return ref
        frozen = self.copy(source)
        suffix = ('?' + parsed.query if parsed.query else '') + ('#' + parsed.fragment if parsed.fragment else '')
        return frozen.as_uri() + suffix

    def derived(self, source, rel, payload):
        """Record a selected manifest through the same input/emission stamps."""
        source = source.resolve(); rel = Path(rel)
        _, proof = self.load(source)
        frozen = self.write_payload(self.output / rel, payload)
        key = (source, rel); self.active.add(key)
        self.emissions[key] = {
            'original_path': str(source), 'original_sha256': proof['sha256'],
            'original_bytes': proof['bytes'], 'snapshot_path': str(self.output / rel),
            'snapshot_relative_path': rel.as_posix(), 'snapshot_sha256': frozen['sha256'],
            'snapshot_bytes': frozen['bytes'], 'transformed': True}

    def producer_resource(self, value):
        if not isinstance(value, str) or not value:
            return
        if value.startswith('proto:'):
            name = value[6:]; source = self.producer_root / 'assets' / (name if name.endswith('.png') else name + '.png')
        elif value.startswith('file:'):
            self.rewrite_reference(value, self.producer_root / 'specs' / 'input.json')
            return
        else:
            normalized = value.replace('\\', '/')
            source = self.producer_root.joinpath(*normalized.split('/typeset-proto/', 1)[1].split('/')) if '/typeset-proto/' in normalized else Path(value)
            if not source.is_absolute(): source = self.asset_root / source
        try:
            if source.is_file(): self.copy(source, transform=False)
        except OSError:
            pass  # Authored prose is not a resource path.

    def freeze_producer(self, screen_ids):
        root = self.producer_root
        if root != Path(__file__).resolve().parents[1]/'src/typeset' and (root.parent != self.typeset_root.parent or any(self.page_inputs.get(page) for page in self.pages)):
            raise ValueError('Complete producer freeze requires one producer/typeset generation with a shared parent')
        families = {path.name for path in (root / 'components').iterdir()
                    if (path / '__init__.py').is_file()}
        if families != set(PRODUCER_COMPONENTS):
            raise ValueError('Producer registry families differ from the supported runtime modules')
        for path in sorted((root / 'engine').glob('*.py')):
            self.copy(path, Path('typeset-proto/engine') / path.name, transform=False)
        self.copy(root / 'engine/checks.js', Path('typeset-proto/engine/checks.js'), transform=False)
        for family, modules in PRODUCER_COMPONENTS.items():
            for module in modules:
                self.copy(root / 'components' / family / (module + '.py'),
                          Path('typeset-proto/components') / family / (module + '.py'), transform=False)
            style = root / 'components' / family / 'style.css'
            if style.is_file():
                self.copy(style, Path('typeset-proto/components') / family / 'style.css')
        self.copy(root / 'components/comp-diagram/step-ports.js',
                  Path('typeset-proto/components/comp-diagram/step-ports.js'), transform=False)
        self.copy(root / 'style/base.css', Path('typeset-proto/style/base.css'))
        for name in ('typeset_check.js', 'typeset_labels.js', 'typeset_apply.js'):
            self.copy(root / name, Path('typeset-proto') / name, transform=False)
        def resources(value):
            if isinstance(value, dict):
                for item in value.values(): resources(item)
            elif isinstance(value, list):
                for item in value: resources(item)
            else: self.producer_resource(value)
        for page in self.pages:
            path = Path(__file__).resolve().parents[1]/'sources/pages'/page/'layout.json' if root == Path(__file__).resolve().parents[1]/'src/typeset' else root/'specs'/(page+'.json')
            self.copy(path, Path('typeset-proto/specs') / (page + '.json'), transform=False)
            payload, _ = self.load(path); resources(json.loads(decode(payload)))
        # assets.manifest() prefers a verified shared-library map. Keep that
        # branch and row metadata, but only bind selected screens and resources
        # already referenced by their HTML/specs, never the whole asset tree.
        asset_root = self.asset_root
        marker = asset_root / '_library/REQUESTS-READY.json'
        mapping = asset_root / '_library/asset-map.jsonl'
        library = False
        if marker.is_file() and mapping.is_file():
            marker_payload, _ = self.load(marker); map_payload, _ = self.load(mapping)
            ready = json.loads(decode(marker_payload))
            library = ready.get('status') == 'ready' and ready.get('asset_map_sha256') == digest(map_payload)
        if not library:
            mapping = asset_root / 'manifest.jsonl'
            map_payload, _ = self.load(mapping)
        bound = {entry['original_path'] for key, entry in self.emissions.items() if key in self.active}
        rows = []
        for line in decode(map_payload).splitlines():
            if not line.strip(): continue
            row = json.loads(line)
            if library and (row.get('status') != 'ready' or not row.get('asset')): continue
            original = Path(row.get('path') or asset_root / row['asset']).resolve() if library else (asset_root / row['asset']).resolve()
            if row.get('screen_id') not in screen_ids and str(original) not in bound: continue
            if not original.is_file(): continue  # Same availability rule as assets.manifest().
            frozen = self.copy(original, transform=False)
            if library: row['path'] = str(frozen)
            else: row['asset'] = Path(os.path.relpath(frozen, self.output / 'typeset-assets')).as_posix()
            rows.append(row)
        payload = ''.join(json.dumps(row, ensure_ascii=False) + '\n' for row in rows).encode('utf8')
        rel = Path('typeset-assets/_library/asset-map.jsonl' if library else 'typeset-assets/manifest.jsonl')
        self.derived(mapping, rel, payload)
        if library:
            ready['asset_map_sha256'] = digest(payload)
            self.derived(marker, 'typeset-assets/_library/REQUESTS-READY.json',
                         (json.dumps(ready, ensure_ascii=False, indent=2) + '\n').encode('utf8'))

    def plan(self):
        self.active = set()
        self.fonts = set()
        self.font_uris = defaultdict(set)
        self.orientation_exceptions = []
        inventory_payload, _ = self.load(self.inventory)
        rows = [json.loads(line) for line in decode(inventory_payload).splitlines() if line.strip()]
        repository = Path(__file__).resolve().parents[1]
        if self.inventory == repository/'sources/screens.jsonl':
            for row in rows:
                source = repository/'sources/pages'/row['page']/'page.json'
                row.update(source_path=str(source), source_sha256=digest(self.load(source)[0]))
        grouped = defaultdict(list)
        for row in rows:
            grouped[safe_part(row['page'], 'page')].append(row)
        self.pages = self.requested_pages or list(grouped)
        missing = set(self.pages) - set(grouped)
        if missing:
            raise ValueError('Pages absent from inventory: ' + ', '.join(sorted(missing)))
        frozen_rows = []
        screen_ids = set()
        for page in self.pages:
            safe_part(page, 'page')
            page_input = self.page_inputs.get(page, {})
            selected_root = Path(page_input.get('typeset_root', self.typeset_root)).resolve()
            self.pipeline = selected_root.parent
            self.current_page = page
            self.dependency_namespace = digest(str(self.pipeline).encode('utf8'))[:16] if page_input else None
            prior_map = {}
            if page_input.get('snapshot'):
                prior_path = Path(page_input['snapshot']).resolve()
                prior_payload, _ = self.load(prior_path)
                prior = json.loads(decode(prior_payload))
                if prior.get('status') != 'pass' or page not in prior.get('pages', []):
                    raise ValueError('Page input is not a verified frozen snapshot: ' + page)
                for entry in prior['files']:
                    if stamp_file(Path(entry['snapshot_path'])) != {'sha256': entry['snapshot_sha256'], 'bytes': entry['snapshot_bytes']}:
                        raise ValueError('Prior frozen snapshot changed: ' + entry['snapshot_path'])
                prior_map = prior.get('resource_map', {})
                self.copy(prior_path, Path('input-evidence') / (page + '-snapshot.json'), transform=False)
            originals = {Path(row['source_path']).resolve() for row in grouped[page]}
            if len(originals) != 1:
                raise ValueError('Page has multiple source files: ' + page)
            original = originals.pop()
            frozen_source = self.copy(original, Path('sources') / (page + '.json'), transform=False)
            source_payload, source_proof = self.load(original)
            source = json.loads(decode(source_payload))
            screen_ids.update(screen['id'] for screen in source['screens'])
            if any(row.get('source_sha256') != source_proof['sha256'] for row in grouped[page]):
                raise ValueError('Inventory source SHA differs from captured source: ' + page)
            base = selected_root / page
            manifest_path = base / 'page-manifest.json'
            self.copy(manifest_path, transform=False)
            manifest_payload, _ = self.load(manifest_path)
            manifest = json.loads(decode(manifest_payload))
            self.orientation_exceptions.extend(validate_page_inputs(page, source, grouped[page], manifest))
            # Source JSON must stay byte-identical. Freeze its real screenshot
            # resources too; consumers use snapshot.json's original-to-copy map.
            for screen in source.get('screens', []):
                for screenshot in screen.get('screenshots', []):
                    for field in ('file', 'full'):
                        if screenshot.get(field):
                            original_resource = screenshot[field]
                            frozen_resource = self.copy(Path(prior_map.get(original_resource, original_resource)), transform=False)
                            self.resource_aliases[original_resource] = str(frozen_resource)
            for row in grouped[page]:
                frozen_rows.append({**row, 'source_path': str(frozen_source)})
            self.copy(base / 'report.json', transform=False)
            self.copy(self.asset_root / page / 'manifest.jsonl', transform=False)
            for screen in manifest['screens']:
                sid = safe_part(screen['screen'], 'screen')
                orientations = set()
                for image in screen.get('images', []):
                    for field in ('image', 'links'):
                        relative = Path(image[field])
                        target = (base / relative).resolve()
                        if not target.is_relative_to(base.resolve()):
                            raise ValueError('Manifest path escapes its page: ' + str(relative))
                        self.copy(target, transform=False)
                    orientations.add(image.get('orientation', 'v' if '-v' in image['image'] else 'h'))
                for orientation in sorted(orientations):
                    if orientation not in {'h', 'v'}:
                        raise ValueError('Invalid orientation: ' + str(orientation))
                    self.copy(base / 'html' / (sid + '-' + orientation + '.html'))
            print(page + ': captured', flush=True)
        self.pipeline = self.typeset_root.parent
        self.dependency_namespace = None
        if self.producer_root:
            self.freeze_producer(screen_ids)
        else:
            self.copy(repository/'src/typeset/engine/render.py', Path('typeset-proto/engine/render.py'), transform=False)
        frozen_payload = (''.join(json.dumps(row, ensure_ascii=False, separators=(',', ':')) + '\n'
                                  for row in frozen_rows)).encode('utf8')
        dest = self.output / 'typeset-inventory' / 'screens.jsonl'
        frozen_proof = self.write_payload(dest, frozen_payload)
        _, original_proof = self.load(self.inventory)
        inventory_key = (self.inventory, Path('typeset-inventory/screens.jsonl'))
        self.active.add(inventory_key)
        self.emissions[inventory_key] = {
            'original_path': str(self.inventory), 'original_sha256': original_proof['sha256'],
            'original_bytes': original_proof['bytes'], 'snapshot_path': str(dest),
            'snapshot_relative_path': 'typeset-inventory/screens.jsonl',
            'snapshot_sha256': frozen_proof['sha256'], 'snapshot_bytes': frozen_proof['bytes'],
            'transformed': True}
        # Retire files made irrelevant by a changed manifest or resource dependency.
        for key in set(self.emissions) - self.active:
            path = self.output / key[1]
            if path.exists():
                self.retire(path)
            del self.emissions[key]

    def changed_sources(self):
        changed = []
        for source in sorted({key[0] for key in self.active} | {Path(path) for path in self.fonts}):
            try:
                now = stamp_file(source)
            except OSError as exc:
                now = {'error': str(exc)}
            if now != self.sources[source]['proof']:
                changed.append({'path': str(source), 'captured': self.sources[source]['proof'], 'observed': now})
        return changed

    def save_report(self, status):
        records = [self.emissions[key] for key in self.active if key in self.emissions]
        records.sort(key=lambda x: x['snapshot_relative_path'])
        external = [{'kind': 'system_font', 'original_path': path,
                     **self.sources[Path(path)]['proof'], 'copied': False,
                     'uris': sorted(self.font_uris[path])} for path in sorted(self.fonts)]
        report = {
            'schema': 'wly.typeset-input-snapshot.v1', 'status': status,
            'frozen_at_beijing': datetime.now(BJT).isoformat(), 'issues': self.issues,
            'original_typeset_root': str(self.typeset_root), 'original_inventory': str(self.inventory),
            'snapshot_root': str(self.output), 'pages': self.pages, 'retries_used': self.round,
            'orientation_exceptions': self.orientation_exceptions,
            'file_count': len(records), 'png_count': sum('png_size' in x for x in records),
            'snapshot_bytes': sum(x['snapshot_bytes'] for x in records),
            'resource_map': {**{x['original_path']: x['snapshot_path'] for x in records}, **self.resource_aliases},
            'page_inputs': self.page_inputs,
            **({'producer_root': str(self.output / 'typeset-proto'),
                'original_producer_root': str(self.producer_root)} if self.producer_root else {}),
            'source_checks': self.history, 'system_fonts_preserved': sorted(self.fonts),
            'external_dependencies': external,
            'retired_root': str(self.retired_root) if self.retired else None,
            'retired_files': self.retired, 'files': records,
            'seconds': round(time.perf_counter() - self.started, 3)}
        path = self.output / 'snapshot.json'
        payload = (json.dumps(report, ensure_ascii=False, indent=2) + '\n').encode('utf8')
        self.write_payload(path, payload)
        return report

    def run(self):
        if self.output.exists():
            raise ValueError('Choose a fresh output directory: ' + str(self.output))
        if self.retired_root.exists():
            raise ValueError('Retirement directory already exists: ' + str(self.retired_root))
        self.output.mkdir(parents=True)
        status = 'blocked'
        try:
            for attempt in range(3):
                self.round = attempt
                self.plan()
                changes = self.changed_sources()
                self.history.append({'round': attempt, 'checked_at_beijing': datetime.now(BJT).isoformat(),
                                     'checked_files': len({key[0] for key in self.active}
                                                          | {Path(path) for path in self.fonts}),
                                     'changes': changes})
                if not changes:
                    # The snapshot itself is the next stage's input, not the producer.
                    for key in self.active:
                        entry = self.emissions[key]
                        actual = stamp_file(Path(entry['snapshot_path']))
                        if actual != {'sha256': entry['snapshot_sha256'], 'bytes': entry['snapshot_bytes']}:
                            raise ValueError('Frozen file changed during snapshot: ' + entry['snapshot_path'])
                    status = 'pass'
                    break
                if attempt == 2:
                    self.issues.append({'code': 'source_not_stable', 'files': [x['path'] for x in changes]})
                    break
                # Stable payloads stay bound to their existing copies. Only the
                # changed source files are invalidated and captured again.
                for change in changes:
                    self.sources.pop(Path(change['path']), None)
                print('source changed; retry affected files: ' + str(len(changes)), flush=True)
        except Exception as exc:
            self.issues.append({'code': 'capture_failed', 'message': str(exc)})
        report = self.save_report(status)
        print(json.dumps({key: report[key] for key in ('status', 'pages', 'file_count', 'png_count',
                                                       'snapshot_bytes', 'retries_used', 'seconds')}, ensure_ascii=False),
              flush=True)
        return 0 if status == 'pass' else 2


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('typeset-root', 'output'):
        parser.add_argument('--' + name, type=Path, required=True)
    parser.add_argument('--inventory', type=Path, default=Path(__file__).resolve().parents[1]/'.publish/inventory/screens.jsonl')
    parser.add_argument('--pages', nargs='+', help='Optional pilot subset; default is the complete inventory.')
    parser.add_argument('--page-inputs', type=Path, help='Exact per-page frozen input roots; preserve previously reviewed page bytes.')
    parser.add_argument('--producer-root', type=Path,
                        help='Opt in to freeze the complete current producer runtime, selected specs and referenced assets; must share the typeset root parent.')
    args = parser.parse_args()
    page_inputs = json.loads(args.page_inputs.read_text('utf-8-sig')) if args.page_inputs else None
    snapshot = Snapshot(args.typeset_root.resolve(), args.inventory.resolve(), args.output.resolve(), args.pages, page_inputs,
                        args.producer_root.resolve() if args.producer_root else None)
    return snapshot.run()


if __name__ == '__main__':
    sys.exit(main())

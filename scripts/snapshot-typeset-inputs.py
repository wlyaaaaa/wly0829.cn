"""Freeze one local typeset input batch; copy bytes, never render or publish."""
from __future__ import annotations

import argparse
from collections import defaultdict
from datetime import datetime, timedelta, timezone
import hashlib
import html
from html.parser import HTMLParser
import json
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
    def __init__(self, typeset_root, inventory, output, pages=None):
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
        try:
            return source.relative_to(self.pipeline)
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

    def plan(self):
        self.active = set()
        self.fonts = set()
        self.font_uris = defaultdict(set)
        self.orientation_exceptions = []
        inventory_payload, _ = self.load(self.inventory)
        rows = [json.loads(line) for line in decode(inventory_payload).splitlines() if line.strip()]
        grouped = defaultdict(list)
        for row in rows:
            grouped[safe_part(row['page'], 'page')].append(row)
        self.pages = self.requested_pages or list(grouped)
        missing = set(self.pages) - set(grouped)
        if missing:
            raise ValueError('Pages absent from inventory: ' + ', '.join(sorted(missing)))
        frozen_rows = []
        for page in self.pages:
            safe_part(page, 'page')
            originals = {Path(row['source_path']).resolve() for row in grouped[page]}
            if len(originals) != 1:
                raise ValueError('Page has multiple source files: ' + page)
            original = originals.pop()
            frozen_source = self.copy(original, Path('sources') / (page + '.json'), transform=False)
            source_payload, source_proof = self.load(original)
            source = json.loads(decode(source_payload))
            if any(row.get('source_sha256') != source_proof['sha256'] for row in grouped[page]):
                raise ValueError('Inventory source SHA differs from captured source: ' + page)
            base = self.typeset_root / page
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
                            self.copy(Path(screenshot[field]), transform=False)
            for row in grouped[page]:
                frozen_rows.append({**row, 'source_path': str(frozen_source)})
            self.copy(base / 'report.json', transform=False)
            self.copy(self.pipeline / 'typeset-assets' / page / 'manifest.jsonl', transform=False)
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
        self.copy(self.pipeline / 'typeset-proto' / 'engine' / 'render.py', transform=False)
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
            'resource_map': {x['original_path']: x['snapshot_path'] for x in records},
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
    for name in ('typeset-root', 'inventory', 'output'):
        parser.add_argument('--' + name, type=Path, required=True)
    parser.add_argument('--pages', nargs='+', help='Optional pilot subset; default is the complete inventory.')
    args = parser.parse_args()
    snapshot = Snapshot(args.typeset_root.resolve(), args.inventory.resolve(), args.output.resolve(), args.pages)
    return snapshot.run()


if __name__ == '__main__':
    sys.exit(main())

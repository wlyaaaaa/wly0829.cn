"""Replay the delivered horizontal/vertical comic onto an exact complete release.

Only index.html gains two deferred references. Original illustrations, labels,
hotspots, all other existing files and the delivered package remain unchanged.
This command prepares local bytes; it does not publish or call status APIs.
"""
from __future__ import annotations
import importlib.util
import argparse
from datetime import datetime, timedelta, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
try:
    from release_delta import inventory, source_path, write_changes
except ModuleNotFoundError:
    from scripts.release_delta import inventory, source_path, write_changes
from urllib.parse import urlsplit
spec = importlib.util.spec_from_file_location('release_asset_builder', Path(__file__).with_name('build-assembled-site.py'))
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


BINDINGS = {
    ('home-02', 'h'): ('home-02-h-2880-9b996bf070d6.avif', 2880, 1504),
    ('home-03', 'h'): ('home-03-h-2880-501ab33ed9e2.avif', 2880, 1480),
    ('home-02', 'v'): ('home-02-v-1280-2468865eea25.avif', 1280, 4369),
    ('home-03', 'v'): ('home-03-v-1280-f29fd32e70ba.avif', 1280, 4347),
}


def stamp(path):
    data = Path(path).read_bytes()
    return {'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}


def identity(files, manifest):
    if manifest.get('schema') != 'wly.hybrid-release.v1':
        raise ValueError('Unsupported baseline release schema')
    overlay = manifest.get('runtime_overlay')
    if overlay is not None and (not isinstance(overlay, dict) or overlay.get('schema') != 'wly.oss-video-runtime.v1' or overlay.get('status') != 'prepared'):
        raise ValueError('Unsupported runtime overlay identity contract')
    text = json.dumps(files, sort_keys=True, **({'separators': (',', ':')} if overlay else {}))
    return hashlib.sha256(text.encode()).hexdigest()


def patch_engine(text):
    """Honor the existing page latch; finite comic units need no second FPS guard."""
    crlf = '\r\n' in text
    text = text.replace('\r\n', '\n')
    marker = "const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;"
    if text.count(marker) != 1:
        raise ValueError('Unsupported comic engine')
    if 'home-comic-site-static-v1' in text:
        if not all(token in text for token in ('function stopForStatic()', "document.addEventListener('site-motion', stopForStatic)",
                                               'if (stopForStatic() || my !== gen || kindNow() !== kind) return;')):
            raise ValueError('Incomplete existing comic static integration')
        return text.replace('\n', '\r\n') if crlf else text
    text = text.replace(marker, marker + "\n// home-comic-site-static-v1: no canvas at all when the page is already static.\nconst siteStatic = () => matchMedia('(prefers-reduced-motion: reduce)').matches || !!window.SiteMotionInsurance?.snapshot.stalled || document.body.classList.contains('motion-stalled');\nif (siteStatic()) return;", 1)
    clear = 'function unitTime(p, now) {'
    if text.count(clear) != 1:
        raise ValueError('Unsupported comic state boundary')
    text = text.replace(clear, "function stopForStatic() {\n  if (!siteStatic()) return false;\n  ready = false; cancelAnimationFrame(raf); raf = 0;\n  for (const n in STATE) if (STATE[n] === 'play') STATE[n] = 'done';\n  clearAll(); return true;\n}\ndocument.addEventListener('site-motion', stopForStatic);\nmatchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', stopForStatic);\n" + clear, 1)
    for old, new in [
        ('function tick() {\n', 'function tick() {\n  if (stopForStatic()) return;\n'),
        ('function check() {\n', 'function check() {\n  if (stopForStatic()) return;\n'),
        ('async function activate() {\n', 'async function activate() {\n  if (stopForStatic()) return;\n'),
        ('  if (my !== gen || kindNow() !== kind) return;', '  if (stopForStatic() || my !== gen || kindNow() !== kind) return;'),
    ]:
        expected = 2 if old.startswith('  if (my') else 1
        if text.count(old) != expected:
            raise ValueError('Unsupported comic lifecycle token: ' + old)
        text = text.replace(old, new)
    return text.replace('\n', '\r\n') if crlf else text


class PictureSources(HTMLParser):
    def __init__(self):
        super().__init__(); self.rows = []
    def handle_starttag(self, tag, attrs):
        if tag in ('img', 'source'):
            data = dict(attrs)
            self.rows.append({'tag': tag, **data})


def validate_home(baseline, package, html):
    match = re.search(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>', html, re.S)
    if not match:
        raise ValueError('Homepage page-data is missing')
    data = json.loads(match[1]); screens = {s['id']: s for s in data['screens']}
    records = []
    for (sid, kind), (name, width, height) in BINDINGS.items():
        viewer = screens[sid]['layouts'][kind]['viewer']
        if Path(urlsplit(viewer['avif']).path).name != name or [viewer['width'], viewer['height']] != [width, height]:
            raise ValueError('Comic original binding changed; regenerate from the new illustration: ' + sid + '/' + kind)
        local = source_path(baseline, urlsplit(viewer['avif']).path.lstrip('/'))
        original = package / 'img' / name
        if not local.is_file():
            raise ValueError('Prepare against the complete source release with local media bytes: ' + name)
        if original.is_file() and stamp(local) != stamp(original):
            raise ValueError('Bound original media bytes differ from delivered package: ' + name)
        if not stamp(local)['sha256'].startswith(name.rsplit('-', 1)[1].split('.')[0]):
            raise ValueError('Bound illustration filename hash differs from its actual bytes')
        records.append({'screen': sid, 'kind': kind, 'original': name, 'coordinate_size': [width, height],
                        'package_original_compared': original.is_file(), 'bound_filename_sha256_verified': True, **stamp(local)})
    responsive = []
    for sid in ('home-02', 'home-03'):
        section = re.search(r'<section\b[^>]*\bid="' + sid + r'"[^>]*>.*?</section>', html, re.S)
        if not section:
            raise ValueError('Homepage target missing: ' + sid)
        parser = PictureSources(); parser.feed(section[0])
        if any('crossorigin' in row for row in parser.rows if row['tag'] == 'img'):
            raise ValueError('Comic originals must retain ordinary img loading')
        for row in parser.rows:
            values = row.get('data-srcset', row.get('srcset', row.get('data-src', row.get('src', ''))))
            for entry in values.split(','):
                fields = entry.strip().split()
                if not fields:
                    continue
                rel = urlsplit(fields[0]).path.lstrip('/')
                target = source_path(baseline, rel)
                if not target.is_file():
                    raise ValueError('Responsive media bytes missing: ' + rel)
                kind = 'v' if '-v-' in Path(rel).name else 'h'
                responsive.append({'screen': sid, 'kind': kind, 'tag': row['tag'], 'type': row.get('type'), 'media': row.get('media'), 'url': fields[0], 'width_descriptor': fields[1] if len(fields) > 1 else None,
                                   'class': 'bound_original' if Path(rel).name == BINDINGS[(sid, kind)][0] else 'responsive_delivery', **stamp(target)})
    return records, responsive


def references(prefix):
    return ''.join('\n<script src="/' + prefix + '/' + rel + '" defer></script>' for rel in ('comic-data.js', 'comic-live.js')) + '\n'


def prepare(baseline, package, output, report):
    baseline, package, output = [Path(p).resolve() for p in (baseline, package, output)]
    if output.exists() or output == baseline or output.is_relative_to(baseline):
        raise ValueError('Choose a fresh output outside the baseline')
    manifest = json.loads((baseline / 'release-manifest.json').read_text('utf8'))
    before = inventory(baseline)
    if before != manifest['files']:
        raise ValueError('Baseline inventory differs from its manifest')
    baseline_id = identity(before, manifest)
    if baseline_id != manifest['release_id']:
        raise ValueError('Baseline release identity differs from its actual files')
    raw = source_path(baseline, 'index.html').read_bytes(); html = raw.decode('utf8')
    originals, responsive = validate_home(baseline, package, html)
    assets = {p.relative_to(package).as_posix(): p.read_bytes() for p in sorted((package / 'assets').glob('*.png'))}
    if len(assets) != 82 or len(list((package / 'assets').iterdir())) != 82:
        raise ValueError('Delivered package must contain exactly the 82 PNG layers')
    for rel in ('comic-data.js', 'comic-live.js'):
        assets[rel] = (package / rel).read_bytes()
    original_files = {rel: stamp(package / rel) for rel in assets}
    assets['comic-live.js'] = patch_engine(assets['comic-live.js'].decode('utf8')).encode('utf8')
    package_files = {rel: {'sha256': hashlib.sha256(body).hexdigest(), 'bytes': len(body)} for rel, body in assets.items()}
    package_id = hashlib.sha256(json.dumps(package_files, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    prefix = '_shared/home-comic/' + package_id[:20]
    refs = references(prefix)
    existing = manifest.get('home_comic_preparation')
    mount_pattern = r'\s(?:data-)?src=[\"\x27]([^\"\x27]*comic-(?:data|live)\.js)[\"\x27]'
    mounts = [value for tag in re.findall(r'<script\b[^>]*>(?:\s*</script>)?', html, re.I)
              for value in re.findall(mount_pattern, tag, re.I)]
    complete_mounts = [value for tag in re.findall(r'<script\b[^>]*>\s*</script>', html, re.I)
                       for value in re.findall(mount_pattern, tag, re.I)]
    already_integrated = bool(existing or mounts)
    previous_mounts=[]
    if already_integrated:
        expected_mounts = ['/' + prefix + '/comic-data.js', '/' + prefix + '/comic-live.js']
        if mounts != complete_mounts or (existing is None and mounts != expected_mounts) or (existing is not None and (not isinstance(existing, dict) or existing.get('package_id') != package_id)):
            raise ValueError('Existing comic mount differs from this package; retain the current source and review the two script references instead of duplicating them')
        for rel, value in package_files.items():
            if before.get(prefix + '/' + rel) != value:
                raise ValueError('Existing comic package bytes differ: ' + rel)
        updated = raw
        if mounts != expected_mounts:
            removed=0
            pattern=r'<script\b[^>]*(?:data-)?src=["\x27][^"\x27]*comic-(?:data|live)\.js["\x27][^>]*>\s*</script>'
            for match in re.finditer(pattern,html,re.I):
                previous_mounts.append({'offset':match.start()-removed,'text':match[0]});removed+=len(match[0])
            updated=re.sub(pattern,'',html,flags=re.I).replace('</body>',refs+'</body>',1).encode('utf8')
    else:
        if raw.count(b'</body>') != 1:
            raise ValueError('Expected one homepage body closing tag')
        updated = raw.replace(b'</body>', refs.encode() + b'</body>', 1)
    after = write_changes(baseline, output, {**{prefix+'/'+rel: body for rel, body in assets.items()}, 'index.html': updated}, copy_asset=builder.copy_release_asset)
    changed = [rel for rel, value in before.items() if after.get(rel) != value]
    if changed != ([] if updated==raw else ['index.html']) or (not already_integrated and updated.replace(refs.encode(), b'', 1) != raw):
        raise AssertionError('Comic preparation changed an existing file beyond the two homepage references')
    release_id = identity(after, manifest)
    manifest.update({'files': after, 'release_id': release_id})
    if updated!=raw or existing is None:
        manifest['home_comic_preparation'] = {'status': 'prepared_pending_acceptance', 'baseline_release_id': baseline_id, 'package_id': package_id,
                     'old_page_evidence_is_not_new_acceptance': True, 'previous_mounts':previous_mounts}
    (output / 'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    result = {'schema': 'wly.home-comic-preparation.v1', 'status': 'prepared', 'prepared_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(),
              'baseline': str(baseline), 'baseline_release_id': baseline_id, 'output': str(output), 'release_id': release_id, 'files': len(after), 'html_count': sum(rel.endswith('.html') for rel in after),
              'changed_existing_files': changed, 'already_integrated': already_integrated, 'original_files_preserved': True, 'homepage_rollback_byte_exact': True,
              'package_source': str(package), 'package_id': package_id, 'package_prefix': prefix, 'package_files': package_files, 'original_package_files': original_files,
              'bound_originals': originals, 'responsive_delivery': responsive, 'page_data_preserved': True, 'runtime_overlay_preserved': manifest.get('runtime_overlay'),
              'integration_change': 'Honor existing SiteMotionInsurance page latch and reduced-motion before canvas creation; clear in-flight overlays on site-motion static transition. No FPS sampler added.',
              'rollback': {'remove_exact_utf8': '' if already_integrated else refs, 'baseline_index': stamp(source_path(baseline, 'index.html')),
                           'existing_package_retained': already_integrated}, 'published': False}
    report = Path(report); report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    return result


def rollback(candidate, output, report):
    """Prepare the two-line static rollback; keep unreferenced package files."""
    candidate, output = [Path(p).resolve() for p in (candidate, output)]
    if output.exists() or output == candidate or output.is_relative_to(candidate):
        raise ValueError('Choose a fresh output outside the candidate')
    manifest = json.loads((candidate / 'release-manifest.json').read_text('utf8'))
    files = inventory(candidate)
    if files != manifest['files'] or identity(files, manifest) != manifest['release_id']:
        raise ValueError('Candidate inventory or release identity differs')
    info = manifest.get('home_comic_preparation')
    if not info or info.get('status') != 'prepared_pending_acceptance':
        raise ValueError('Candidate has no prepared home comic to roll back')
    refs = references('_shared/home-comic/' + info['package_id'][:20]).encode()
    raw = (candidate / 'index.html').read_bytes()
    if raw.count(refs) != 1:
        raise ValueError('Homepage comic references differ; review the newer homepage first')
    restored=raw.replace(refs,b'',1).decode('utf8')
    for item in reversed(info.get('previous_mounts',[])):
        restored=restored[:item['offset']]+item['text']+restored[item['offset']:]
    after = write_changes(candidate, output, {'index.html': restored.encode('utf8')}, copy_asset=builder.copy_release_asset); new_id = identity(after, manifest)
    manifest.pop('home_comic_preparation')
    manifest.update({'files': after, 'release_id': new_id, 'home_comic_rollback': {'status': 'prepared_pending_acceptance', 'candidate_release_id': identity(files, manifest),
                     'original_baseline_release_id': info['baseline_release_id'], 'unreferenced_package_files_retained': True}})
    (output / 'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    result = {'schema': 'wly.home-comic-rollback.v1', 'status': 'prepared', 'candidate': str(candidate), 'output': str(output), 'release_id': new_id,
              'changed_existing_files': ['index.html'], 'unreferenced_package_files_retained': True, 'published': False}
    report = Path(report); report.parent.mkdir(parents=True, exist_ok=True); report.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    return result


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    for name in ('baseline', 'package', 'output', 'report', 'rollback'):
        ap.add_argument('--' + name, type=Path, required=name in ('output', 'report'))
    args = ap.parse_args()
    if args.rollback:
        if args.baseline or args.package: ap.error('--rollback cannot accompany --baseline/--package')
        result = rollback(args.rollback, args.output, args.report)
    else:
        if not args.baseline or not args.package: ap.error('--baseline and --package are required when preparing')
        result = prepare(args.baseline, args.package, args.output, args.report)
    print(json.dumps({k: result[k] for k in ('status', 'release_id', 'files', 'html_count', 'changed_existing_files', 'published') if k in result}, ensure_ascii=False))


if __name__ == '__main__':
    main()

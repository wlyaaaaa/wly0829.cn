"""Restore the bound original homepage plate and unmount inherited living art.

Only the first picture, its image geometry, home video policy and home-only
runtime references and stale named navigation targets change. All other current home metadata and release bytes
are retained. The reference is an actual pre-living homepage HTML artifact.
"""
from __future__ import annotations

import argparse
from datetime import datetime
import importlib.util
import json
import os
from pathlib import Path
import re
import shutil
from urllib.parse import urljoin, urlsplit

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('static_home_living', HERE / 'prepare-home-living.py')
living = importlib.util.module_from_spec(spec)
spec.loader.exec_module(living)
proof, inventory, identity = living.proof, living.inventory, living.identity
PAGE_DATA = re.compile(r'(<script\b[^>]*id="page-data"[^>]*>)(.*?)(</script>)', re.S)
PICTURE = re.compile(r'(<section\b[^>]*id="home-01"[^>]*>)(.*?<picture>)(.*?)(</picture>)', re.S)
GEOMETRY_KEYS = ('size', 'source_size', 'crop', 'viewer')


def album_images(picture: str) -> list:
    rows = []
    for tag in re.findall(r'<source\b[^>]*>', picture):
        attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', tag))
        if attrs.get('type') != 'image/avif' or not attrs.get('srcset'):
            continue
        candidates = []
        for item in attrs['srcset'].split(','):
            fields = item.strip().split()
            candidates.append({'src': urljoin('/index.html', fields[0]), 'descriptor': ' '.join(fields[1:])})
        rows.append({'src': candidates[0]['src'], 'candidates': candidates,
                     'media': attrs.get('media', ''), 'sizes': attrs.get('sizes', '')})
    if not rows:
        raise ValueError('Original static first picture lacks its AVIF resources')
    return rows


def remove_living_runtime(text: str) -> str:
    """Invert the source-owned living injection without rolling back the app."""
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    if living.MODEL_START in text:
        if text.count(living.MODEL_START) != 1 or text.count(living.MODEL_END) != 1:
            raise ValueError('Homepage living model markers changed')
        start = text.index(living.MODEL_START)
        end = text.index(living.MODEL_END, start) + len(living.MODEL_END)
        text = (text[:start] + text[end:]).lstrip('\n')
    elif 'window.HomeLivingStatusModel = (raw, phase) => {' in text:
        start = text.index('/* 首页总览规则来自本次完整输入中实际使用的驾驶舱 B2，原函数保持原样。 */')
        end = text.index('\n};', start) + len('\n};')
        text = (text[:start] + text[end:]).lstrip('\n')
    if living.BRIDGE_START in text:
        if text.count(living.BRIDGE_START) != 1:
            raise ValueError('Homepage living bridge markers changed')
        start = text.index(living.BRIDGE_START)
        end = text.index('\n})();', start) + len('\n})();')
        text = text[:start] + text[end:]
    inverses = {
        "if(busy||document.hidden||(!document.querySelector('[data-slot]')&&page.home_living!==true))return;":
            "if(busy||document.hidden||!document.querySelector('[data-slot]'))return;",
        "\n document.dispatchEvent(new CustomEvent('site-status',{detail:livingSnapshot()}));": '',
        ',snapshot:livingSnapshot': '',
        'function livingSnapshot(){return Object.freeze({phase,overall:window.HomeLivingStatusModel(last,phase)});}\n': '',
        "(document.querySelector('[data-slot]')||page.home_living===true)": "document.querySelector('[data-slot]')",
    }
    for old, new in inverses.items():
        if text.count(old) > 1:
            raise ValueError('Homepage living inverse anchor is ambiguous: ' + old[:80])
        text = text.replace(old, new)
    if any(token in text for token in ('HomeLiving', 'HeroLive', 'livingSnapshot', 'page.home_living')):
        raise ValueError('Homepage runtime contains an unknown living dependency')
    return text.rstrip('\n') + '\n'


def reference_data(path: Path) -> tuple[str, dict, dict]:
    html = path.read_text('utf8')
    match, picture = PAGE_DATA.search(html), PICTURE.search(html)
    if not match or not picture:
        raise ValueError('Static reference lacks home page-data or the first picture')
    data = json.loads(match[2])
    if data.get('page') != 'home' or data.get('home_living'):
        raise ValueError('Static reference must be an actual pre-living homepage')
    layouts = data['screens'][0]['layouts']
    if data['screens'][0]['id'] != 'home-01':
        raise ValueError('Static reference first screen changed')
    # Each current source file is checked below against these exact bytes. The
    # reference is read in place, never used to replace any other home content.
    assets = {}
    for ref in re.findall(r'(?:src|srcset)="([^"]+)"', picture[3]):
        for item in ref.split(','):
            rel = urlsplit(urljoin('/index.html', item.strip().split()[0])).path.lstrip('/')
            target = (path.parent / rel).resolve()
            if not target.is_relative_to(path.parent.resolve()) or not target.is_file():
                raise ValueError('Missing original static plate asset: ' + rel)
            assets[rel] = proof(target.read_bytes())
    for layout in layouts.values():
        viewer = layout['viewer']
        rel = urlsplit(urljoin('/index.html', viewer['src'])).path.lstrip('/')
        if assets.get(rel, {}).get('sha256') != viewer['sha256']:
            raise ValueError('Original static viewer SHA does not match its asset')
    return picture[3], layouts, assets


def verify_static_home(release: Path, preparation: dict) -> dict:
    """Check the final real artifact after the remaining creative preparations."""
    release = Path(release).resolve()
    html = (release / 'index.html').read_text('utf8')
    data = json.loads(PAGE_DATA.search(html)[2])
    current_picture = PICTURE.search(html)[3]
    reference = Path(preparation['reference']['path']).resolve()
    if proof(reference.read_bytes()) != {key: preparation['reference'][key] for key in ('sha256', 'bytes')}:
        raise ValueError('Original static home reference changed')
    picture, layouts, assets = reference_data(reference)
    if (current_picture != picture or proof(picture.encode('utf8'))['sha256'] != preparation['first_picture_sha256']
            or assets != preparation['static_assets']):
        raise ValueError('Final first-screen picture differs from its bound original')
    if data.get('home_living') or data.get('home_static') is not True or data.get('video', {}).get('mount_allowed'):
        raise ValueError('Final home can still mount motion instead of its static plate')
    for orientation in ('h', 'v'):
        for key in GEOMETRY_KEYS:
            if data['screens'][0]['layouts'][orientation][key] != layouts[orientation][key]:
                raise ValueError('Final home original geometry changed')
    for rel, expected in assets.items():
        if proof((release / rel).read_bytes()) != expected:
            raise ValueError('Final original static plate bytes changed: ' + rel)
    active = re.findall(r'<(?:link|script)\b[^>]*(?:href|src)="([^"]+)"', html)
    if any('/home-living/' in ref or 'home-living-bind-' in ref for ref in active):
        raise ValueError('Final homepage actively loads living art')
    album_match = re.search(r'<script\b[^>]*id="album-page"[^>]*>(.*?)</script>', html, re.S)
    if album_match and json.loads(album_match[1]).get('images') != album_images(picture):
        raise ValueError('Final homepage album warms a different first-screen image')
    app = data['shared']['script_bundle'].lstrip('/')
    body = (release / app).read_bytes()
    if {'path': app, **proof(body)} != preparation['home_bundle']:
        raise ValueError('Final homepage runtime differs from the static preparation')
    if any(token in body for token in (b'HomeLiving', b'HeroLive', b'livingSnapshot', b'page.home_living')):
        raise ValueError('Final homepage runtime can still call living art')
    return {'first_picture_original': True, 'static_assets_unchanged': True,
            'no_active_living_resources_or_runtime_calls': True}


def prepare(baseline: Path, reference: Path, output: Path, report: Path) -> dict:
    baseline, reference, output, report = [Path(p).resolve() for p in (baseline, reference, output, report)]
    if output.exists() or output == baseline or output.is_relative_to(baseline) or baseline.is_relative_to(output):
        raise ValueError('Use a fresh output directory outside the complete input')
    manifest_path = baseline / 'release-manifest.json'
    manifest_bytes = manifest_path.read_bytes()
    manifest = json.loads(manifest_bytes)
    old_files = inventory(baseline)
    before = identity(old_files, manifest)
    if old_files != manifest.get('files') or before != manifest.get('release_id'):
        raise ValueError('Complete baseline bytes do not match its inventory and RID')
    reference_proof = proof(reference.read_bytes())
    picture, reference_layouts, assets = reference_data(reference)
    for rel, expected in assets.items():
        if old_files.get(rel) != expected:
            raise ValueError('Current baseline no longer contains the bound original static asset: ' + rel)
    original = (baseline / 'index.html').read_bytes()
    html = original.decode('utf8')
    nav_spec = importlib.util.spec_from_file_location('static_home_navigation', HERE / 'repair-release-navigation.py')
    nav = importlib.util.module_from_spec(nav_spec); nav_spec.loader.exec_module(nav)
    html, navigation_changes = nav.repair_owned_navigation(html, nav.page_inventory(baseline), '/')
    match, old_picture = PAGE_DATA.search(html), PICTURE.search(html)
    if not match or not old_picture:
        raise ValueError('Current homepage first picture or page-data is missing')
    data = json.loads(match[2])
    if data.get('page') != 'home' or data['screens'][0]['id'] != 'home-01':
        raise ValueError('Expected the actual homepage')
    inherited_living = data.get('home_living') is True
    refs = re.findall(r'<script\b[^>]*src="([^\"]*(?:home-)?app-[a-f0-9]+\.js)"', html)
    if len(refs) != 1:
        raise ValueError('Expected exactly one current homepage app runtime')
    old_ref = refs[0]
    old_app_rel = urlsplit(urljoin('/index.html', old_ref)).path.lstrip('/')
    old_app = (baseline / old_app_rel).read_bytes()
    static_source = manifest.get('home_static_preparation', {}).get('home_bundle') if data.get('home_living') else None
    static_bytes = (baseline / static_source['path']).read_bytes() if static_source else old_app
    if static_source and proof(static_bytes) != {key: static_source[key] for key in ('sha256', 'bytes')}: raise ValueError('Bound original static runtime changed')
    static_app = remove_living_runtime(static_bytes.decode('utf8')).encode('utf8')
    app_rel = '_shared/static-home-app-' + proof(static_app)['sha256'][:20] + '.js'
    data.pop('home_living', None)
    data['home_static'] = True
    data['shared']['script_bundle'] = '/' + app_rel
    if isinstance(data.get('video'), dict):
        data['video']['mount_allowed'] = False
        data['video']['mount_reason'] = '2f-static-home-first-screen'
    # Preserve current overlays, descriptions and other screens; the named
    # navigation roles above now use their real complete-package destinations.
    for orientation in ('h', 'v'):
        for key in GEOMETRY_KEYS:
            data['screens'][0]['layouts'][orientation][key] = reference_layouts[orientation][key]
    html = html[:old_picture.start(3)] + picture + html[old_picture.end(3):]
    match = PAGE_DATA.search(html)
    html = html[:match.start(2)] + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + html[match.end(2):]
    runtime_tag = re.compile(r'(<script\b[^>]*\bsrc=")' + re.escape(old_ref) + r'(")')
    if len(runtime_tag.findall(html)) != 1:
        raise ValueError('Current homepage script reference is ambiguous')
    html = runtime_tag.sub(lambda m: m[1] + '/' + app_rel + m[2], html)
    album_match = re.search(r'(<script\b[^>]*id="album-page"[^>]*>)(.*?)(</script>)', html, re.S)
    if album_match:
        album = json.loads(album_match[2])
        if album.get('route') != '/' or album.get('entry') != 'home-01':
            raise ValueError('Inherited homepage album metadata has an unknown entry')
        album['images'] = album_images(picture)
        html = html[:album_match.start(2)] + json.dumps(album, ensure_ascii=False, separators=(',', ':')) + html[album_match.end(2):]
    removed_tags = []
    def strip_living(match):
        tag = match[0]
        if re.search(r'(?:href|src)="[^"]*/_shared/(?:home-living/|home-living-bind-)', tag):
            removed_tags.append(tag)
            return ''
        return tag
    html = re.sub(r'<(?:link|script)\b[^>]*>(?:</script>)?', strip_living, html)
    # Replace the living white-plate preload with the original picture's real
    # hints (if present), leaving every other image/font hint unchanged.
    html = re.sub(r'<link\b[^>]*rel="preload"[^>]*as="image"[^>]*(?:home-01-|home-living/)[^>]*>', '', html)
    reference_html = reference.read_text('utf8')
    preloads = [m[0] for m in re.finditer(r'<link\b[^>]*>', reference_html)
                if 'rel="preload"' in m[0] and 'as="image"' in m[0] and 'home-01-' in m[0]]
    if preloads:
        html = living.replace_once(html, '</head>', '\n'.join(preloads) + '\n</head>')
    h = reference_layouts['h']['size']
    html = re.sub(r'(<section\b[^>]*id="home-01"[^>]*style=")[^"]*',
                  lambda m: m[1] + f'aspect-ratio:{h[0]}/{h[1]};--grid-index:0', html, count=1)
    if any(token in html.split('</head>')[0] for token in ('home-living/', 'home-living-bind-')):
        raise ValueError('Living resource remains active in the homepage head')
    new_files = {'index.html': html.encode('utf8'), app_rel: static_app}
    shutil.copytree(baseline, output, copy_function=living.builder.copy_release_asset)
    for rel, body in new_files.items():
        target = output / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(body)
    files = inventory(output)
    manifest.pop('home_living_preparation', None)
    result = {'schema': 'wly.static-home-preparation.v1', 'status': 'prepared_pending_browser_acceptance',
        'observed_at_beijing': datetime.now(living.BJT).isoformat(), 'published': False,
        'baseline': str(baseline), 'baseline_release_id': before, 'baseline_manifest': proof(manifest_bytes),
        'output': str(output), 'reference': {'path': str(reference), **reference_proof},
        'release_id': identity(files, manifest), 'inherited_living_removed': inherited_living,
        'first_picture_sha256': proof(picture.encode('utf8'))['sha256'], 'static_assets': assets,
        'original_static_bytes_unchanged': True, 'current_home_links_and_other_screens_preserved': not navigation_changes,
        'navigation_changes': navigation_changes,
        'navigation_source': {'path':str(HERE / 'repair-release-navigation.py'), **proof((HERE / 'repair-release-navigation.py').read_bytes())},
        'removed_active_living_tags': removed_tags,
        'old_home_bundle': {'path': old_app_rel, **proof(old_app)},
        'home_bundle': {'path': app_rel, **proof(static_app)},
        'changed_existing': {rel: {'before': old_files[rel], 'after': value} for rel, value in files.items()
                             if rel in old_files and value != old_files[rel]},
        'new_files': {rel: value for rel, value in files.items() if rel not in old_files}}
    manifest.update(files=files, release_id=result['release_id'], prepared_at_beijing=result['observed_at_beijing'])
    manifest['home_static_preparation'] = result
    (output / 'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    if proof(reference.read_bytes()) != reference_proof or inventory(baseline) != old_files:
        raise ValueError('Static preparation input changed during replay')
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('baseline', 'reference', 'output', 'report'):
        parser.add_argument('--' + name, type=Path, required=True)
    result = prepare(**vars(parser.parse_args()))
    print(json.dumps({key: result[key] for key in ('status', 'release_id', 'inherited_living_removed', 'published')}))

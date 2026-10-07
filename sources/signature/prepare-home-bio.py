"""Apply the owner's exact new signature to a complete local-URL release.

Run after the homepage living/comic preparation, before OSS mapping. Never
replace another release with this branch's historical site-release directory.
Original assets, animation geometry and every non-home HTML stay unchanged.
"""
from __future__ import annotations
import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import re
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
from release_delta import inventory, source_path, write_changes
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / 'assets-manifest.json'
OLD = 'Java 出身，现在的乐趣是让 AI 替我把电脑和日常打理好。'
NEW = 'Java 出身，正在把自己的电脑和日常，一点点交给 AI 打理。'
BJT = timezone(timedelta(hours=8))

def proof(body):
    return {'sha256': hashlib.sha256(body).hexdigest(), 'bytes': len(body)}

def identity(files, manifest):
    options = {'separators': (',', ':')} if manifest.get('runtime_overlay') else {}
    return hashlib.sha256(json.dumps(files, sort_keys=True, **options).encode()).hexdigest()

def patch_text(html):
    meta = re.findall(r'<meta\b[^>]*(?:name="description"|property="og:description"|name="twitter:description")[^>]*>', html)
    if len(meta) != 3 or not all('在杭州。' + OLD in m or '在杭州。' + NEW in m for m in meta):
        raise ValueError('Homepage description fields have changed; review the current text')
    html = html.replace(OLD, NEW)
    match = re.search(r'(<div\b[^>]*id="home-01-equivalent-text"[^>]*>)(.*?)(</div><!-- /screen-equivalent-text -->)', html, re.S)
    if not match or '在杭州。' + NEW not in match[2]:
        raise ValueError('The exact home-01 equivalent signature is missing')
    body = match[2]
    horizontal = re.search(r'<div data-transcript-orientation="h">(.*?)</div>', body, re.S)
    vertical = re.search(r'<div data-transcript-orientation="v">(.*?)</div>', body, re.S)
    if not horizontal:
        raise ValueError('Horizontal home-01 transcript is missing')
    if not vertical:
        body += '<div data-transcript-orientation="v">' + horizontal[1] + '</div>'
        html = html[:match.start(2)] + body + html[match.end(2):]
    if OLD in html or html.count(NEW) != 5:
        raise ValueError('Expected three metadata descriptions and two exact equivalent texts')
    return html

def prepare(baseline, output, report, assets_manifest=ASSETS):
    baseline, output = baseline.resolve(), output.resolve()
    if output.exists() or output.is_relative_to(baseline) or baseline.is_relative_to(output):
        raise ValueError('Choose a fresh output outside the baseline')
    manifest = json.loads((baseline / 'release-manifest.json').read_text('utf8'))
    old_files = inventory(baseline)
    if manifest.get('schema') != 'wly.hybrid-release.v1' or old_files != manifest['files']:
        raise ValueError('Baseline bytes do not match its complete manifest')
    if manifest.get('oss'):
        raise ValueError('Use the complete local-URL Source before OSS preparation')
    if manifest.get('home_bio_preparation'):
        raise ValueError('This release already contains the signature update')
    assets = json.loads(assets_manifest.read_text('utf8'))
    if assets.get('schema') != 'wly.home-bio-assets.v1' or assets.get('new_text') != NEW:
        raise ValueError('Unexpected signature asset inventory')
    # Asset source is derived from the repository, never an untrusted manifest path.
    payloads = {}
    for item in assets['items']:
        source = (ROOT / 'delivery' / item['new_name']).resolve()
        if not source.is_relative_to(ROOT / 'delivery'):
            raise ValueError('Asset path is outside this package')
        payload = source.read_bytes()
        if proof(payload) != {'sha256': item['sha256'], 'bytes': item['bytes']}:
            raise ValueError('Signature asset bytes have changed: ' + item['new_name'])
        payloads[item['old_name']] = (item, payload)
    html = patch_text(source_path(baseline, 'index.html').read_text('utf8'))
    new_files, replacements = {}, {}
    # Retain every path directory. New config stays beside the existing sprites.
    for old_name, (item, body) in payloads.items():
        matches = [rel for rel in old_files if Path(rel).name == old_name]
        if not matches:
            if item['kind'] == 'living' and not manifest.get('home_living_preparation'):
                continue
            raise ValueError('Required original image is absent: ' + old_name)
        for rel in matches:
            if old_files[rel]['sha256'] != item['old_sha256']:
                raise ValueError('Image source differs from the reviewed version: ' + rel)
            new_rel = (Path(rel).parent / item['new_name']).as_posix()
            new_files[new_rel] = body
        replacements[old_name] = item['new_name']
    for old, new in replacements.items():
        # An external-prefix input would point at objects that have not been uploaded.
        destination = next(rel for rel in new_files if Path(rel).name == new)
        # The local Source can retain production social-card URLs in metadata.
        # Point those at the newly prepared local resource; the OSS mapper will
        # supply the final absolute media URL and verified object prefix later.
        for href in re.findall(r'https?://[^"\s<>]*' + re.escape(old), html):
            html = html.replace(href, '/' + destination)
        html = html.replace(old, new)
    config_changes = []
    configs = [rel for rel in old_files if re.search(r'hero-live\.config\.[a-f0-9]+\.json$', rel)]
    for rel in configs:
        old_config = source_path(baseline, rel).read_bytes()
        config = json.loads(old_config)
        changed = old_config.decode('utf8')
        for old, new in replacements.items():
            changed = changed.replace(old, new)
        if changed == old_config.decode('utf8'):
            continue
        updated = json.loads(changed)
        for orientation in ('landscape', 'portrait'):
            before = {k:v for k,v in config[orientation].items() if k not in ('plate', 'plateNoBird')}
            after = {k:v for k,v in updated[orientation].items() if k not in ('plate', 'plateNoBird')}
            if before != after:
                raise ValueError('Living animation coordinates changed')
        if config['sprites'] != updated['sprites']:
            raise ValueError('Bird sprite bindings changed')
        body = changed.encode('utf8')
        name = 'hero-live.config.' + proof(body)['sha256'][:10] + '.json'
        new_rel = (Path(rel).parent / name).as_posix()
        new_files[new_rel] = body
        replacements[Path(rel).name] = name
        config_changes.append({'before':rel,'after':new_rel,'geometry_unchanged':True})
    engines = [rel for rel in old_files if re.search(r'hero-live\.[a-f0-9]+\.js$',rel)]
    for rel in engines:
        original = source_path(baseline, rel).read_text('utf8')
        updated = original
        for old, new in replacements.items():
            updated = updated.replace(old, new)
        if updated == original:
            continue
        body = updated.encode('utf8')
        name = 'hero-live.' + proof(body)['sha256'][:10] + '.js'
        new_files[(Path(rel).parent/name).as_posix()] = body
        replacements[Path(rel).name] = name
    for old, new in replacements.items():
        html = html.replace(old, new)
    image_types = {item['new_name']: 'image/' + Path(item['new_name']).suffix[1:]
                   for item, _ in payloads.values()}
    def image_type(match):
        tag = match[0]
        types = {mime for name, mime in image_types.items() if name in tag}
        if len(types) > 1:
            raise ValueError('An image source mixes AVIF and WebP variants')
        if types:
            tag = re.sub(r'type="image/(?:avif|webp)"', 'type="' + types.pop() + '"', tag)
        return tag
    html = re.sub(r'<(?:link|source)\b[^>]*>', image_type, html)
    # Viewer hashes accompany its replaced paths; hotspots/layouts are untouched.
    for item, _ in payloads.values():
        if item['old_name'] in replacements:
            html = html.replace(item['old_sha256'], item['sha256'])
    new_files['index.html'] = html.encode('utf8')
    for rel, body in new_files.items():
        if rel != 'index.html' and rel in old_files and old_files[rel] != proof(body):
            raise ValueError('Refusing to overwrite an original resource: ' + rel)
    files = write_changes(baseline, output, new_files)
    if 'index.html' not in {x.lstrip('/') + ('index.html' if x.endswith('/') else '') for x in manifest.get('accepted_pages', {})}:
        existing = manifest.setdefault('release_overlay', {}).get('index.html', {})
        manifest['release_overlay']['index.html'] = {
            'kind':existing.get('kind', 'integrated_preparation' if manifest.get('creative_preparation') else 'home_bio'), 'before':manifest['baseline_files']['index.html'],
            'after':files['index.html'], 'previous_overlay_kind':existing.get('kind'),
            'reason':'Owner-selected exact signature; metadata, equivalent text and raster references only'}
    manifest.update(files=files, release_id=identity(files,manifest))
    manifest['home_bio_preparation'] = {'schema':'wly.home-bio-preparation.v1', 'status':'prepared_pending_acceptance',
        'new_text':NEW, 'text_locations':5, 'baseline_release_id':identity(old_files,manifest),
        'assets_manifest':proof(assets_manifest.read_bytes()), 'published':False}
    # A standalone tail prepared from an already assembled creative Source is
    # a review candidate. Its publisher must rebuild with home_bio:true to bind
    # the real recipe, complete step chain and final build/QA evidence.
    if manifest.get('creative_preparation'):
        manifest['home_bio_preparation']['requires_creative_recipe_replay'] = True
    (output/'release-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n','utf8')
    changed = {rel:{'before':old_files[rel],'after':files[rel]} for rel in old_files if files[rel] != old_files[rel]}
    if set(changed) != {'index.html'}:
        raise ValueError('Unexpected mutation outside the homepage')
    result = {'schema':'wly.home-bio-preparation.v1','status':'prepared','published':False,
        'prepared_at_beijing':datetime.now(BJT).isoformat(),'baseline':str(baseline),'output':str(output),
        'release_id':manifest['release_id'],'changed_existing':changed,
        'new_files':{rel:files[rel] for rel in files if rel not in old_files},
        'text_locations':5,'images':len([x for x in new_files if x.endswith(('.webp', '.avif'))]),
        'config_changes':config_changes,'replacements':replacements,'other_existing_files_unchanged':True}
    report.parent.mkdir(parents=True,exist_ok=True)
    report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n','utf8')
    return result

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    for name in ('baseline','output','report'):
        parser.add_argument('--'+name,type=Path,required=True)
    args=parser.parse_args()
    result=prepare(args.baseline,args.output,args.report)
    print(json.dumps({k:result[k] for k in ('status','release_id','text_locations','images','published')},ensure_ascii=False))

"""Add the approved river to an actual complete release; never fetch or publish.

The input release is immutable. All its files remain byte-identical except the
cockpit HTML. The cockpit B2 asset is patched from its actual current bytes, so
cache and motion preparations are preserved. Old addressed assets stay intact.
"""
from __future__ import annotations
import importlib.util

import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import re
import shutil
spec = importlib.util.spec_from_file_location('release_asset_builder', Path(__file__).with_name('build-assembled-site.py'))
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)

ROOT = Path(__file__).resolve().parents[1]
BJT = timezone(timedelta(hours=8))
RELAY_MARKER = '/* Relay only the existing cockpit automation read to todayRiver. */'
MOUNT = '<section class="today-river" data-today-river aria-label="今天的河"></section>'

RELAY = r"""
/* Relay only the existing cockpit automation read to todayRiver. */
let todayRiverSignature='';
function relayTodayRiver(){
 if(data.kind!=='cockpit'||!window.todayRiver)return;
 const automation=status?.automation,health=blockHealth('automation');
 const reason=!online()?'offline':health==='stale'?'stale':health!=='ok'?'unreadable':undefined;
 const at=blockTime(automation),captured_at=Number.isFinite(at)?new Date(at*1000).toISOString():null;
 const snapshot={captured_at,sample_kind:'live',automation,reason};
 const signature=JSON.stringify(snapshot);if(signature===todayRiverSignature)return;
 todayRiverSignature=signature;window.todayRiver.setSnapshot(snapshot,!window.todayRiver.model&&!reason);
}
document.addEventListener('today-river-ready',()=>{todayRiverSignature='';relayTodayRiver();});
"""


def proof(payload: bytes) -> dict:
    return {'sha256': hashlib.sha256(payload).hexdigest(), 'bytes': len(payload)}


def once(text: str, before: str, after: str) -> str:
    if text.count(before) != 1:
        raise ValueError('Unsupported current runtime/HTML anchor: ' + before[:100])
    return text.replace(before, after, 1)


def patch_runtime(text: str) -> str:
    # The cockpit-light renderer owns task counts, group names and lamp policy.
    # Only relay its existing automation read; do not revise those decisions.
    if RELAY_MARKER not in text:
        text = once(text, 'function render(){', RELAY + '\nfunction render(){\n relayTodayRiver();')
    return text


def prepare(release: Path, output: Path, handoff: Path) -> dict:
    release, output, handoff = release.resolve(), output.resolve(), handoff.resolve()
    if output == release or output.is_relative_to(release) or release.is_relative_to(output):
        raise ValueError('Output must not overlap the immutable input')
    if output.exists() and any(output.iterdir()):
        raise ValueError('Use a new empty preparation directory')
    manifest_path = release / 'release-manifest.json'
    manifest = json.loads(manifest_path.read_text('utf8'))
    original_files = {p.relative_to(release).as_posix(): proof(p.read_bytes()) for p in release.rglob('*') if p.is_file()}
    for rel, expected in manifest['files'].items():
        if original_files.get(rel) != expected:
            raise ValueError('Incomplete or changed source release: ' + rel)
    # The actual complete runtime must include every asset in its manifest.
    if not (release / '_typeset/runtime').is_dir() or not (release / '_shared').is_dir():
        raise ValueError('HTML-only publication is not a complete runtime source')
    html_rel = 'cockpit/index.html'
    original_html = (release / html_rel).read_bytes()
    html = original_html.decode('utf8')
    installed = 'data-today-river' in html
    refs = re.findall(r'<script\b[^>]*\bsrc="([^"]*b2-typeset-[a-f0-9]+\.js)"[^>]*>', html)
    if len(refs) != 1:
        raise ValueError('Expected one actual cockpit B2 asset')
    old_ref = refs[0]
    old_rel = old_ref.lstrip('/') if old_ref.startswith('/') else (Path('cockpit') / old_ref).as_posix()
    runtime = patch_runtime((release / old_rel).read_text('utf8')).encode('utf8')
    new_rel = 'cockpit/assets/b2-typeset-' + proof(runtime)['sha256'][:20] + '.js'
    new_ref = '/' + new_rel if old_ref.startswith('/') else 'assets/' + Path(new_rel).name
    additions = {new_rel: runtime}
    for name, extension in [('today-river', 'js'), ('today-river', 'css')]:
        payload = (ROOT / f'scripts/{name}.{extension}').read_bytes()
        rel = f'cockpit/assets/{name}-{proof(payload)["sha256"][:20]}.{extension}'
        additions[rel] = payload
        if extension == 'js':
            js_ref = 'assets/' + Path(rel).name
        else:
            css_ref = 'assets/' + Path(rel).name
    assets = ROOT / 'scripts/today-river-assets2'
    for name in ['river.webp', 'mask.png', *[f'boat{i}.webp' for i in range(4)], *[f'bird-{pose}.webp' for pose in ['idle','look','tilt','sing','sleep']]]:
        additions['cockpit/assets/today-river-assets2/' + name] = (assets / name).read_bytes()
    html = once(html, old_ref, new_ref)
    for pattern in [r'<script\b[^>]*(?:data-)?src="[^"]*today-river-[a-f0-9]+\.js"[^>]*>\s*</script>', r'<link\b[^>]*href="[^"]*today-river-[a-f0-9]+\.css"[^>]*>']:
        html, count = re.subn(pattern, '', html)
        if installed and not count:
            raise ValueError('Installed river is missing its script or stylesheet')
    html = once(html, '</head>', f'<link rel="stylesheet" href="{css_ref}"><script type="module" src="{js_ref}"></script></head>')
    if not installed:
        anchor = '<div class="screen-equivalent-text" id="cockpit-01-equivalent-text"'
        html = once(html, anchor, MOUNT + anchor)
    page_data = re.search(r'(<script\b[^>]*id="page-data"[^>]*>)(.*?)(</script>)', html, re.S)
    if not page_data:
        raise ValueError('River asset URLs require the actual page-data block')
    data = json.loads(page_data[2])
    data['today_river_assets'] = {Path(rel).name: '/' + rel for rel in additions if '/today-river-assets2/' in rel}
    html = html[:page_data.start(2)] + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c') + html[page_data.end(2):]
    additions[html_rel] = html.encode('utf8')
    site = output / 'site'
    output.mkdir(parents=True, exist_ok=True)
    shutil.copytree(release, site, copy_function=builder.copy_release_asset)
    changes = {}
    for rel, payload in additions.items():
        path = site / rel
        if path.is_file() and rel != html_rel and path.read_bytes() != payload:
            raise ValueError('Content-addressed asset collision: ' + rel)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)
        changes[rel] = {'before': original_files.get(rel), 'after': proof(payload)}
        manifest['files'][rel] = proof(payload)
    manifest['prepared_at_beijing'] = datetime.now(BJT).isoformat()
    manifest['release_id'] = hashlib.sha256(json.dumps(manifest['files'],sort_keys=True).encode()).hexdigest()
    manifest['today_river_preparation'] = {'baseline_release_id': json.loads(manifest_path.read_text('utf8'))['release_id'], 'publication_performed':False, 'original_task_list_retained':True}
    (site / 'release-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n','utf8')
    mismatches = [rel for rel, digest in original_files.items() if rel not in [html_rel,'release-manifest.json'] and proof((site / rel).read_bytes()) != digest]
    if mismatches:
        raise ValueError('Unrelated original bytes changed: ' + ', '.join(mismatches))
    receipt = {'schema':'wly.today-river-preparation.v1','status':'prepared','observed_at_beijing':datetime.now(BJT).isoformat(),'input_release':str(release),'input_release_id':manifest['today_river_preparation']['baseline_release_id'],'baseline_manifest':proof(manifest_path.read_bytes()),'input_file_count':len(original_files),'input_html_count':sum(x.endswith('.html') for x in original_files),'preserved_original_files':len(original_files)-2,'changes':changes,'candidate':str(site),'release_id':manifest['release_id'],'handoff_template':proof((handoff/'river2.template.html').read_bytes()),'external_write':False,'rollback':'Discard this candidate or restore cockpit/index.html and release-manifest.json from input; all original addressed assets are retained.'}
    (output / 'preparation.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n','utf8')
    return receipt


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--handoff', type=Path, required=True)
    args = parser.parse_args()
    result = prepare(args.release, args.output, args.handoff)
    print(json.dumps({k:result[k] for k in ['status','candidate','release_id','input_file_count','input_html_count','preserved_original_files']},ensure_ascii=False))

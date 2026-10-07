"""Replay the approved homepage living-painting package onto a complete release.

Only index.html, a new home-only app/CSS and new original package files change.
No producer, original runtime/media, account, CORS or publication is mutated.
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
from urllib.parse import urljoin, urlsplit
spec = importlib.util.spec_from_file_location('release_asset_builder', Path(__file__).with_name('build-assembled-site.py'))
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)

HERE = Path(__file__).resolve().parent
BJT = timezone(timedelta(hours=8))
MODEL_START = '/* Home living actual B2 status model. */'
MODEL_END = '/* End home living actual B2 status model. */'
BRIDGE_START = '/* 首页活画只订阅 SiteStatus 的既有读取；不创建 reader、轮询或存储。 */'
HOME_CSS = '''/* 原图和活画用同一比例，热区和 Tab 焦点位于活画上层。 */
#home-01 { position:relative; overflow:hidden; }
#home-01 > picture, #home-01 > picture > img { display:block; width:100%; height:100%; object-fit:fill; }
#home-01 > .overlays { z-index:1; }
#home-01 .hotspot, #home-01 button { z-index:1; }
#home-01 .hero-live-layer [data-hl="screen"] .more { max-width:620px; font-size:48px; white-space:normal; overflow-wrap:anywhere; line-height:1.2; }
'''


def proof(body: bytes) -> dict:
    return {'sha256': hashlib.sha256(body).hexdigest(), 'bytes': len(body)}


def inventory(root: Path) -> dict:
    return {p.relative_to(root).as_posix(): proof(p.read_bytes()) for p in sorted(root.rglob('*'))
            if p.is_file() and p.relative_to(root).as_posix() != 'release-manifest.json'}


def identity(files: dict, manifest: dict) -> str:
    if manifest.get('schema') != 'wly.hybrid-release.v1':
        raise ValueError('Expected a complete hybrid release manifest')
    if manifest.get('runtime_overlay'):
        text = json.dumps(files, sort_keys=True, separators=(',', ':'))
    else:
        text = json.dumps(files, sort_keys=True)
    return hashlib.sha256(text.encode()).hexdigest()


def replace_once(text: str, old: str, new: str) -> str:
    if text.count(old) != 1:
        raise ValueError('Input runtime anchor changed: ' + old[:100])
    return text.replace(old, new, 1)


def between(text: str, start: str, end: str) -> str:
    if text.count(start) != 1 or text.count(end) != 1:
        raise ValueError('Actual cockpit summary dependencies changed: ' + start)
    return text[text.index(start):text.index(end, text.index(start))]


def home_preloads(text: str, horizontal: str, vertical: str) -> str:
    """Replace only the first-screen AVIF hints with the exact white images."""
    def replace(match):
        tag = match[0]
        if 'rel="preload"' not in tag or 'as="image"' not in tag or 'home-01-' not in tag:
            return tag
        portrait = '(orientation:portrait)' in re.sub(r'\s+', '', tag)
        image = vertical if portrait else horizontal
        media = '(orientation:portrait)' if portrait else '(orientation:landscape)'
        return '<link rel="preload" as="image" type="image/webp" media="' + media + '" href="' + image + '" fetchpriority="high">'
    return re.sub(r'<link\b[^>]*>', replace, text)


def cockpit_model(root: Path) -> tuple[str, dict]:
    """Extract the current input's actual B2 rules, never a fixed old fixture."""
    html = (root / 'cockpit/index.html').read_text('utf8')
    refs = re.findall(r'<script\b[^>]*src="([^"]*b2-typeset-[a-f0-9]+\.js)"', html)
    if len(refs) != 1:
        raise ValueError('Expected the actual cockpit B2 runtime')
    rel = urlsplit(urljoin('/cockpit/index.html', refs[0])).path.lstrip('/')
    original = (root / rel).read_bytes()
    text = original.decode('utf8').replace('\r\n', '\n').replace('\r', '\n')
    dependencies = between(text, 'const blockTime=', 'const online=')
    summary = between(text, 'function summary(){', 'function rowText(')
    import_ref = re.search(r"from ['\"]([^'\"]*b2-access-model[^'\"]*)['\"]", text)
    if not import_ref:
        raise ValueError('Actual B2 numeric dependency is missing')
    numeric_rel = urlsplit(urljoin('/' + rel, import_ref[1])).path.lstrip('/')
    numeric_bytes = (root / numeric_rel).read_bytes()
    access_text = numeric_bytes.decode('utf8').replace('\r\n', '\n').replace('\r', '\n')
    numeric = between(access_text, 'export function reading(', 'export function rate(').replace('export function', 'function')
    adaptation = between(access_text, 'export function adaptStatus(', 'export const errorMessages').replace('export function', 'function')
    clock = between(text, 'const clock=', 'const known=')
    current = 'function readGaps(){' in text
    if current:
        # Explicit current-B2 closure: scheduler/group rendering and access
        # operations are not dependencies of the homepage lamp.
        freshness = between(access_text, 'export function freshStatus(', 'export function screenReadTime(').replace('export function', 'function')
        policy = between(text, 'const lampPolicy=', 'const data=')
        connection = between(text, 'const online=', 'const offline=')
        offline = between(text, 'const offline=', 'const lastContact=')
        lamp = between(text, 'const lampReadKey=', 'function summary(){')
        pending = between(text, 'function pendingRows(){', 'function liveValue(')
        extra = freshness + policy + connection + offline + lamp + pending
    else:
        extra = (between(text, 'const online=', 'const offline=')
                 + between(text, 'const offline=', 'const stateLabel='))
    rules = numeric + adaptation + clock + dependencies + extra + summary
    body = MODEL_START + "\nimport {hardwareSnapshot} from '/" + numeric_rel + "';\n" + r'''
/* 首页总览规则来自本次完整输入中实际使用的驾驶舱 B2，原函数保持原样。 */
window.HomeLivingStatusModel = (() => {
 let status=null,phase='loading',lastRead=0;
''' + rules + r'''
 return (raw, readPhase) => {
 status=raw?adaptStatus(raw):null;phase=readPhase;
 if(raw&&!raw.hardware)delete status.hardware;
 if(raw&&phase==='ready')lastRead=Number.isFinite(raw.observed_at_unix)?raw.observed_at_unix:clock();
 const value=summary();
 if (!online()) return Object.freeze({state:'off',title:'暂时读不到电脑',detail:value.text});
''' + (r'''
 const unread=readGaps().map(gap=>gap.label+'暂时读不到；从 '+time(gap.since)+' 起'+(gap.overGrace?'，已经超过 10 分钟':'，10 分钟内先保持灯况'));
''' if current else r'''
 const labels={automation:'自动任务',backups:'备份',projects:'项目',pending:'待验收事项',today:'今天的记录'};
 const unread=[];
 for(const [key,label] of Object.entries(labels)) {
  const health=blockHealth(key);
  if(health==='stale')unread.push(label+'的记录没有及时更新');
  else if(health==='unknown')unread.push(label+'暂时读不到');
 }
 const hardware=hardwareHealth();
 if(hardware==='stale')unread.push('电脑硬件的记录没有及时更新');
 else if(hardware==='unknown')unread.push('电脑硬件有状态暂时读不到');
''') + r'''
 const detail=[value.text,...unread].filter((text,index,all)=>all.indexOf(text)===index).join('；');
 return Object.freeze(value.state==='ok'?{state:'ok',title:value.text,detail}:
  ['warn','error'].includes(value.state)?{state:'warn',title:'有事要处理',detail}:
  {state:'off',title:'暂时读不到电脑',detail:'电脑在线；'+detail});
 };
})();
''' + MODEL_END
    evidence = {'runtime': {'path': rel, **proof(original)}, 'numeric': {'path': numeric_rel, **proof(numeric_bytes)},
                'rules_sha256': proof(rules.encode())['sha256'],
                'extraction': 'actual-input-cockpit-b2-verbatim-summary-and-dependencies',
                'model_contract': 'read-gap-policy' if current else 'legacy-summary',
                'persistent_lamp_closure': current}
    return body, evidence


def patch_runtime(text: str, model: str, bridge: str) -> str:
    # Rebinding the model after the live reader is refreshed must be repeatable.
    if MODEL_START in text:
        if text.count(MODEL_START) != 1 or text.count(MODEL_END) != 1:
            raise ValueError('Homepage model markers changed')
        start = text.index(MODEL_START)
        end = text.index(MODEL_END, start) + len(MODEL_END)
        text = text[:start] + text[end:]
        text = text.lstrip('\n')
    elif text.startswith('window.HomeLivingStatusModel=(()=>'):
        text = text[text.index(',window.SiteMotionAppearance=') + 1:]
    elif 'window.HomeLivingStatusModel = (raw, phase) => {' in text:
        # The previously shipped extractor placed this known legacy wrapper
        # before the shared app. Its source-owned reader and bridge stay intact.
        start = text.index('/* 首页总览规则来自本次完整输入中实际使用的驾驶舱 B2，原函数保持原样。 */')
        end = text.index('\n};', start) + len('\n};')
        text = (text[:start] + text[end:]).lstrip('\n')
    if BRIDGE_START in text:
        if text.count(BRIDGE_START) != 1:
            raise ValueError('Homepage bridge markers changed')
        start = text.index(BRIDGE_START)
        end = text.index('\n})();', start) + len('\n})();')
        text = text[:start] + text[end:]
    text = text.rstrip('\n')
    minified_reader = re.search(r'\(function\(\)\{"use strict";(?:var [^;]+;)?const \w+=\{text:"暂时读不到",state:"unknown"\};', text)
    if minified_reader:
        reader_end = text.index('window.SiteStatus={', minified_reader.start())
        reader_end = text.index('})()', reader_end) + len('})()')
        text = text[:minified_reader.start()] + (HERE/'site-live-runtime.js').read_text('utf8').rstrip().removesuffix(';') + text[reader_end:]
    if 'snapshot:livingSnapshot' not in text and re.search(r'window\.SiteStatus=\{[^}]*snapshot:', text):
        bridge_start = text.rfind('(()=>{"use strict"', 0, text.find('__heroNativePlates')) if '__heroNativePlates' in text else len(text)
        return model + '\n' + text[:bridge_start] + '\n' + bridge
    if "snapshot:livingSnapshot" in text:
        return model + '\n' + text + '\n' + bridge
    text = replace_once(text, "if(busy||document.hidden||!document.querySelector('[data-slot]'))return;",
                        "if(busy||document.hidden||(!document.querySelector('[data-slot]')&&page.home_living!==true))return;")
    # One observer hook within the existing reader's closure; no second fetch.
    text = replace_once(text, " document.body.dataset.statusPhase=phase;",
                        " document.body.dataset.statusPhase=phase;\n document.dispatchEvent(new CustomEvent('site-status',{detail:livingSnapshot()}));")
    text = replace_once(text, 'window.SiteStatus={parse,refresh,history,resetLayout:resetOfflineLayout};',
                        "window.SiteStatus={parse,refresh,history,resetLayout:resetOfflineLayout,snapshot:livingSnapshot};")
    text = replace_once(text, 'function display(){',
                        "function livingSnapshot(){return Object.freeze({phase,overall:window.HomeLivingStatusModel(last,phase)});}\nfunction display(){")
    return model + '\n' + text + '\n' + bridge


def prepare(baseline: Path, package: Path, output: Path, report: Path) -> dict:
    baseline, package, output, report = map(lambda p: Path(p).resolve(), (baseline, package, output, report))
    if output.exists() or output == baseline or output.is_relative_to(baseline) or baseline.is_relative_to(output):
        raise ValueError('Use a fresh output directory outside the complete input')
    manifest_path = baseline / 'release-manifest.json'
    manifest = json.loads(manifest_path.read_text('utf8'))
    old_files = inventory(baseline)
    if old_files != manifest.get('files') or identity(old_files, manifest) != manifest.get('release_id'):
        raise ValueError('Complete baseline bytes do not match the inventory and RID')
    package_manifest = json.loads((package / 'hero-live.files.json').read_text('utf8'))
    package_files = {}
    for rel, size in package_manifest['files'].items():
        body = (package / rel).read_bytes()
        if len(body) != size or proof(body)['sha256'][:10] not in Path(rel).name:
            raise ValueError('Original package fingerprint/bytes mismatch: ' + rel)
        package_files[rel] = body
    for key in ['engine', 'style', 'config']:
        if package_manifest[key] not in package_files:
            raise ValueError('Package entry is outside its bound inventory')
    from PIL import Image
    image_proofs = {}
    for orientation, dimensions in [('landscape', (2880, 1621)), ('portrait', (1280, 2227))]:
        rel = package_manifest['homeImage'][orientation]
        body = package_files[rel]
        # The approved source is VP8 WebP; exact copying introduces no further
        # loss, and must not be mislabeled as a VP8L/lossless source encoding.
        if body[:4] != b'RIFF' or body[8:12] != b'WEBP':
            raise ValueError('Home static image is not the supplied WebP')
        with Image.open(package / rel) as image:
            if image.size != dimensions:
                raise ValueError('Home static image dimensions changed')
            rgba = image.convert('RGBA')
            image_proofs[orientation] = {'path': rel, 'dimensions': list(dimensions),
                'pixel_sha256_rgba': hashlib.sha256(rgba.tobytes()).hexdigest(), **proof(body),
                'original_encoding_lossless': b'VP8L' in body[:64], 'transcoded': False,
                'transfer_bytes_and_decoded_pixels_unchanged': True}
    original_html = (baseline / 'index.html').read_bytes()
    html = original_html.decode('utf8')
    data_match = re.search(r'(<script\b[^>]*id="page-data"[^>]*>)(.*?)(</script>)', html, re.S)
    if not data_match:
        raise ValueError('Homepage page-data is missing')
    data = json.loads(data_match[2])
    if data.get('page') != 'home' or data.get('home_living'):
        raise ValueError('Expected a homepage before this preparation')
    app_refs = re.findall(r'<script\b[^>]*src="([^\"]*app-[a-f0-9]+\.js)"', html)
    if len(app_refs) != 1:
        raise ValueError('Expected one homepage app runtime')
    old_app_ref = app_refs[0]
    old_app_rel = urlsplit(urljoin('/index.html', old_app_ref)).path.lstrip('/')
    app_bytes = (baseline / old_app_rel).read_bytes()
    model, model_proof = cockpit_model(baseline)
    bridge = (HERE / 'home-living-bind.js').read_bytes()
    new_app = patch_runtime(app_bytes.decode('utf8'), model, bridge.decode('utf8')).encode('utf8')
    app_rel = '_shared/home-app-' + proof(new_app)['sha256'][:20] + '.js'
    prefix = '/_shared/home-living/'
    static_picture = re.search(r'(<section\b[^>]*id="home-01"[^>]*>)(.*?)(<picture>)(.*?)(</picture>)', html, re.S)
    if not static_picture:
        raise ValueError('Actual home-01 picture is missing')
    old_picture = static_picture[4]
    old_img = re.search(r'<img\b[^>]*>', old_picture)[0]
    new_img = re.sub(r'\s(?:src|srcset|sizes|width|height)="[^"]*"', '', old_img)
    horizontal, vertical = (prefix + package_manifest['homeImage'][key] for key in ['landscape', 'portrait'])
    new_img = new_img.replace('<img ', '<img src="' + horizontal + '" width="2880" height="1621" ', 1)
    new_picture = '<source type="image/webp" media="(orientation:portrait)" srcset="' + vertical + '" width="1280" height="2227">' + new_img
    html = html[:static_picture.start(4)] + new_picture + html[static_picture.end(4):]
    # The prior AVIF preload is a real download even after its picture is replaced.
    # Bind the first-paint hints to the same exact white files as the picture.
    html = home_preloads(html, horizontal, vertical)
    # Layout metadata uses the exact high-resolution white plate dimensions. Links
    # stay normalized and all their fields/alt/equivalent text remain unchanged.
    original_layouts = json.loads(json.dumps(data['screens'][0]['layouts']))
    for key, name, dimensions in [('h', 'landscape', [2880, 1621]), ('v', 'portrait', [1280, 2227])]:
        lay = data['screens'][0]['layouts'][key]
        lay['size'] = dimensions
        lay['source_size'] = dimensions
        lay['crop'] = [0, 0, *dimensions]
        im = image_proofs[name]
        lay['viewer'] = {'src': prefix + im['path'], 'width': dimensions[0], 'height': dimensions[1], 'sha256': im['sha256']}
    old_video = json.loads(json.dumps(data.get('video')))
    if isinstance(data.get('video'), dict):
        data['video']['mount_allowed'] = False
        data['video']['mount_reason'] = 'approved-home-living-replaces-opening-mp4'
    data['home_living'] = True
    data['shared']['script_bundle'] = '/' + app_rel
    data_match = re.search(r'(<script\b[^>]*id="page-data"[^>]*>)(.*?)(</script>)', html, re.S)
    html = html[:data_match.start(2)] + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + html[data_match.end(2):]
    html = replace_once(html, '<script src="' + old_app_ref + '"', '<script src="/' + app_rel + '"')
    css = HOME_CSS.encode('utf8')
    css_rel = '_shared/home-living-bind-' + proof(css)['sha256'][:20] + '.css'
    html = replace_once(html, '</head>', '<link rel="stylesheet" href="' + prefix + package_manifest['style'] + '">\n<link rel="stylesheet" href="/' + css_rel + '">\n</head>')
    html = replace_once(html, '<script src="/' + app_rel + '"', '<script src="' + prefix + package_manifest['engine'] + '" defer></script>\n<script type="module" src="/' + app_rel + '"')
    # The first paint uses the same exact dimensions before deferred layout runs.
    html = re.sub(r'(<section\b[^>]*id="home-01"[^>]*style=")[^"]*', r'\g<1>aspect-ratio:2880/1621;--grid-index:0', html, count=1)
    css += b'@media (orientation:portrait) { #home-01 { aspect-ratio:1280/2227 !important; } }\n'
    css_rel = '_shared/home-living-bind-' + proof(css)['sha256'][:20] + '.css'
    html = re.sub(r'/_shared/home-living-bind-[a-f0-9]+\.css', '/' + css_rel, html)
    new_files = {'index.html': html.encode('utf8'), app_rel: new_app, css_rel: css}
    new_files.update({'_shared/home-living/' + rel: body for rel, body in package_files.items()})
    for rel, body in new_files.items():
        if rel != 'index.html' and rel in old_files and old_files[rel] != proof(body):
            raise ValueError('Refusing to replace any old asset: ' + rel)
    shutil.copytree(baseline, output, copy_function=builder.copy_release_asset)
    for rel, body in new_files.items():
        target = output / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.suffix.lower() in builder.RELEASE_BINARY_EXT:
            builder.copy_release_asset(package/rel.removeprefix('_shared/home-living/'), target)
        else:
            target.write_bytes(body)
    files = inventory(output)
    manifest.update({'files': files, 'release_id': identity(files, manifest), 'prepared_at_beijing': datetime.now(BJT).isoformat()})
    manifest['home_living_preparation'] = {'schema': 'wly.home-living.v1', 'status': 'prepared_pending_browser_acceptance',
        'baseline_release_id': identity(old_files, manifest), 'package_engine': package_manifest['engine'],
        'package_bytes_unchanged': True, 'only_changed_html': 'index.html', 'actual_b2_rules_sha256': model_proof['rules_sha256'], 'published': False}
    (output / 'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    result = {'schema': 'wly.home-living-preparation.v1', 'status': 'prepared', 'published': False,
        'prepared_at_beijing': datetime.now(BJT).isoformat(), 'baseline': str(baseline), 'output': str(output),
        'baseline_release_id': identity(old_files, manifest), 'baseline_manifest': proof(manifest_path.read_bytes()),
        'release_id': manifest['release_id'], 'file_count': len(files), 'html_count': sum(x.endswith('.html') for x in files),
        'changed_existing': {rel: {'before': old_files[rel], 'after': files[rel]} for rel in old_files if files[rel] != old_files[rel]},
        'new_files': {rel: files[rel] for rel in files if rel not in old_files},
        'old_home_bundle': {'path': old_app_rel, **proof(app_bytes)}, 'home_bundle': {'path': app_rel, **proof(new_app)},
        'bridge_source': proof(bridge), 'b2_model': model_proof, 'static_images': image_proofs,
        'package_source': str(package), 'package_manifest': proof((package / 'hero-live.files.json').read_bytes()),
        'package_files': {rel: proof(body) for rel, body in package_files.items()},
        'rollback': {'original_first_picture': old_picture, 'original_first_layouts': original_layouts, 'original_video': old_video,
            'command': 'Reprepare/redeploy the exact baseline release; never delete original media or bundles.'},
        'pending': ['synthetic installed Chrome DOM/runtime acceptance', 'final Shanghai CORS/cache and merged full-source QA by Root']}
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    return result


def rebind(baseline: Path, output: Path, report: Path, cockpit: Path | None = None) -> dict:
    """Refresh only an already-mounted homepage using the actual cockpit input."""
    baseline, output, report = map(lambda p: Path(p).resolve(), (baseline, output, report))
    if output.exists() or output == baseline or output.is_relative_to(baseline) or baseline.is_relative_to(output):
        raise ValueError('Use a fresh output directory outside the complete input')
    manifest = json.loads((baseline / 'release-manifest.json').read_text('utf8'))
    old_files = inventory(baseline)
    if old_files != manifest.get('files') or identity(old_files, manifest) != manifest.get('release_id'):
        raise ValueError('Complete baseline bytes do not match the inventory and RID')
    html = (baseline / 'index.html').read_text('utf8')
    data_match = re.search(r'(<script\b[^>]*id="page-data"[^>]*>)(.*?)(</script>)', html, re.S)
    if not data_match:
        raise ValueError('Homepage page-data is missing')
    data = json.loads(data_match[2])
    if data.get('page') != 'home' or data.get('home_living') is not True:
        raise ValueError('Rebinding requires an already-mounted homepage')
    refs = re.findall(r'<script\b[^>]*src="([^\"]*home-app-[a-f0-9]+\.js)"', html)
    if len(refs) != 1:
        raise ValueError('Expected exactly one existing homepage living runtime')
    old_ref = refs[0]
    old_rel = urlsplit(urljoin('/index.html', old_ref)).path.lstrip('/')
    bridge = (HERE / 'home-living-bind.js').read_text('utf8')
    model, model_proof = cockpit_model((cockpit or baseline).resolve())
    body = patch_runtime((baseline / old_rel).read_text('utf8'), model, bridge).encode('utf8')
    app_rel = '_shared/home-app-' + proof(body)['sha256'][:20] + '.js'
    data['shared']['script_bundle'] = '/' + app_rel
    html = html[:data_match.start(2)] + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + html[data_match.end(2):]
    html = html.replace(old_ref, '/' + app_rel)
    html = re.sub(r'<script\b(?![^>]*\btype=)(?=[^>]*(?:src|data-src)="/' + app_rel + '")', '<script type="module"', html)
    layouts = data['screens'][0]['layouts']
    html = home_preloads(html, layouts['h']['viewer']['src'], layouts['v']['viewer']['src'])
    shutil.copytree(baseline, output, copy_function=builder.copy_release_asset)
    (output / app_rel).write_bytes(body)
    (output / 'index.html').write_text(html, encoding='utf8', newline='\n')
    files = inventory(output)
    manifest.update(files=files, release_id=identity(files, manifest), prepared_at_beijing=datetime.now(BJT).isoformat())
    manifest['home_living_preparation'].update(actual_b2_rules_sha256=model_proof['rules_sha256'], published=False)
    (output / 'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    result = {'schema': 'wly.home-living-rebind.v1', 'status': 'prepared', 'published': False,
              'observed_at_beijing': datetime.now(BJT).isoformat(), 'baseline': str(baseline),
              'output': str(output), 'release_id': manifest['release_id'], 'b2_model': model_proof,
              'old_home_bundle': old_rel, 'home_bundle': {'path': app_rel, **proof(body)},
              'changed_existing': [rel for rel, value in old_files.items() if files[rel] != value],
              'new_files': {rel: value for rel, value in files.items() if rel not in old_files},
              'cockpit_input': str((cockpit or baseline).resolve()),
              'external_cockpit_input': cockpit is not None}
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    return result


def prepare_native_home(baseline, fixed_packet, support, output, source_script):
    import importlib.util
    spec = importlib.util.spec_from_file_location('native_home_delivery', source_script)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    module.HERE, module.HOME_CSS = HERE, HOME_CSS
    module.cockpit_model, module.patch_runtime = cockpit_model, patch_runtime
    return module.prepare_native_home(baseline, fixed_packet, support, output)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--package', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--report', type=Path, required=True)
    parser.add_argument('--native-home-support', type=Path)
    parser.add_argument('--native-home-script', type=Path)
    parser.add_argument('--rebind-only', action='store_true', help='Refresh an existing homepage mount after current B2 is applied')
    parser.add_argument('--cockpit', type=Path, help='Explicit current B2 input for isolated acceptance; omit for the final complete release')
    args = parser.parse_args()
    if args.native_home_support:
        result = prepare_native_home(args.baseline, args.package, args.native_home_support, args.output, args.native_home_script)
        args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
        return
    if args.rebind_only:
        result = rebind(args.baseline, args.output, args.report, args.cockpit)
    else:
        if not args.package or args.cockpit:
            parser.error('Initial preparation requires --package; --cockpit is only for an isolated rebind')
        result = prepare(args.baseline, args.package, args.output, args.report)
    print(json.dumps({key: result[key] for key in ['status', 'release_id', 'file_count', 'html_count', 'published'] if key in result}, ensure_ascii=False))


if __name__ == '__main__':
    main()

"""Prepare content-addressed motion JS/CSS for an existing package, locally only.

This is the release after the first OSS switch. It changes runtime references,
never producer PNGs, video bindings, reading code or old immutable asset bytes.
The output is a preparation artifact; existing page publication evidence is not
promoted to acceptance of these new bytes.
"""
from __future__ import annotations
import argparse
from datetime import datetime, timedelta, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
from urllib.parse import urljoin, urlsplit

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
CONFIG = ROOT / 'config/motion-appearance.json'
DOT_POLICY = 'current-active-status-v1'
HERO_MARKER = '/* 只播放人工标注的插画面片'


def release_identity(files, manifest):
    """Admit only the two known, inventory-bound release contracts."""
    if manifest.get('schema') != 'wly.hybrid-release.v1':
        raise ValueError('Unsupported baseline release schema')
    overlay = manifest.get('runtime_overlay')
    if overlay is not None:
        if not isinstance(overlay, dict) or overlay.get('schema') != 'wly.oss-video-runtime.v1' or overlay.get('status') != 'prepared':
            raise ValueError('Unsupported runtime overlay identity contract')
        serialized = json.dumps(files, sort_keys=True, separators=(',', ':'))
        scheme = 'wly.oss-video-runtime.v1:compact-sorted-files'
    else:
        serialized = json.dumps(files, sort_keys=True)
        scheme = 'wly.hybrid-release.v1:sorted-files'
    return hashlib.sha256(serialized.encode()).hexdigest(), scheme


def hero_module(text):
    if text.count(HERO_MARKER) != 1:
        raise ValueError('Expected exactly one preserved hero module')
    start = text.index(HERO_MARKER)
    end = text.index('\n})();', start) + len('\n})();')
    return text[start:end]


def dot_evidence(record, producer_html):
    """Require positive, same-generation observations before absence is accepted."""
    capability = record.get('dot_capability')
    if record.get('measurement_recipe') != 'producer-components-v8' or not isinstance(capability, dict) or capability.get('policy') != DOT_POLICY:
        raise ValueError('Current active-status measurement recipe is missing')
    observations, dots = capability.get('observations'), record.get('dots')
    if not isinstance(observations, list) or not isinstance(dots, list):
        raise ValueError('Actual status-marker observations are missing')
    active = [item for item in observations if item.get('state') == 'active']
    if any(item.get('state') not in {'active', 'inactive', 'non_status'} for item in observations):
        raise ValueError('Status marker has no classified source meaning')
    if capability.get('active_markers') != len(active) or capability.get('measured_markers') != len(dots) or len(active) != len(dots) or any(item.get('measurable') is not True for item in active):
        raise ValueError('Active status markers were not all measured')
    if any(not isinstance(item, dict) or item.get('state') != 'active' or item.get('policy') != DOT_POLICY for item in dots):
        raise ValueError('Breathing dots include inactive or decorative markers')
    if sorted(json.dumps(item.get('rect')) for item in active) != sorted(json.dumps(item.get('rect')) for item in dots):
        raise ValueError('Breathing geometry differs from observed active markers')
    expected_status = 'present' if dots else 'no_corresponding_element'
    if capability.get('status') != expected_status:
        raise ValueError('No-corresponding-element conclusion differs from actual observations')
    # Hash binding is checked by the caller. This extra static minimum prevents
    # a fabricated empty snapshot from erasing explicit active producer markers.
    class ExplicitActive(HTMLParser):
        def __init__(self):
            super().__init__(); self.markers = []; self.stack = []
        def handle_starttag(self, tag, attrs):
            data = dict(attrs); classes = set(data.get('class', '').split())
            state = data.get('data-state') or data.get('data-status') or (self.stack[-1][1] if self.stack else '')
            candidate = bool(classes & {'dot', 'status-dot', 'ds-status-dot', 'legend-dot', 'hub-status-dot', 'feature-status-dot', 'mock-status-dot', 'legend-color-dot', 'hub-status', 'ct-point-status'}) or data.get('data-role') == 'status-dot'
            inactive = state in {'off','unknown','pending','uncertain','unused','ring','failed','error','offline','disabled','loading','paused'} or bool(classes & {'dot-x','dot-off','hub-status-frozen'})
            explicit = {'dot','dot-on'}.issubset(classes) or state in {'on','ok','active','running','enabled','valid','normal'} or data.get('data-role') == 'status-dot' and 'data-ct-dot-xywh' in data
            marker_index = None
            if candidate:
                for _, _, ancestor_index in self.stack:
                    if ancestor_index is not None and self.markers[ancestor_index]['container']: self.markers[ancestor_index]['skip'] = True
                marker_index = len(self.markers); self.markers.append({'active': explicit and not inactive, 'container': bool(classes & {'hub-status','ct-point-status'}), 'skip': False})
            if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}: self.stack.append((tag, state, marker_index))
        def handle_endtag(self, tag):
            for index in range(len(self.stack)-1, -1, -1):
                if self.stack[index][0] == tag: self.stack = self.stack[:index]; break
    source = ExplicitActive(); source.feed(producer_html)
    minimum = sum(marker['active'] and not marker['skip'] for marker in source.markers)
    if len(active) < minimum:
        raise ValueError('Current producer HTML has active markers missing from DOM measurements')
    return capability


def appearance():
    value = json.loads(CONFIG.read_text('utf8'))
    if value.get('schema') != 'wly.motion-appearance.v1' or not 1 <= value.get('amplitude', 0) <= 3 or value.get('speed_multiplier') != 2.5:
        raise ValueError('Invalid motion appearance configuration')
    return value


def patch_runtime(text):
    """Handle both homepage legacy and already-installed typeset app shapes."""
    if '/* motion-appearance-v1 */' in text:
        raise ValueError('Runtime is already prepared; use its unchanged original baseline')
    protected_hero = hero_module(text)
    cfg = appearance()
    prefix = '/* motion-appearance-v1 */\nwindow.SiteMotionAppearance=' + json.dumps(cfg, ensure_ascii=False, separators=(',', ':')) + ';\n'
    helpers = (HERE / 'typeset-layout.js').read_text('utf8').split('/* Manifest geometry', 1)[0]
    text = prefix + ('' if 'function motionNumberToken(' in text else helpers) + text
    def replace(old, new):
        nonlocal text
        if text.count(old) != 1:
            raise ValueError('Unsupported motion runtime token: ' + old)
        text = text.replace(old, new, 1)
    replace("transform:'translateY(32px)'", "transform:'translateY('+SiteMotionAppearance.baseline.card_enter_px*SiteMotionAppearance.amplitude+'px)'")
    replace('duration:900,delay:cardOrder++*120', "duration:motionDuration('cards'),delay:cardOrder++*motionDuration('card_stagger')")
    replace('const steps=20,decimal=', 'const steps=20,decimal=')  # Guard the accepted number implementation.
    replace("item.textContent=n.text.replace(n.numeric,i===steps?n.numeric:String(value));", "item.textContent=motionNumberText(n,value,i===steps);")
    replace('setTimeout(()=>e.remove(),1500)', "setTimeout(()=>e.remove(),motionDuration('number_cleanup'))")
    replace('duration:1200,easing:', "duration:motionDuration('numbers'),easing:")
    replace("setTimeout(()=>s.classList.remove('sample-seam'),1400)", "setTimeout(()=>s.classList.remove('sample-seam'),motionDuration('seam'))")
    replace('limit=mobile?2:5', 'limit=(mobile?SiteMotionAppearance.baseline.parallax_phone_px:SiteMotionAppearance.baseline.parallax_desktop_px)*SiteMotionAppearance.amplitude')
    replace('(r.top-innerHeight*.45)*.014', '(r.top-innerHeight*.45)*SiteMotionAppearance.baseline.parallax_slope*SiteMotionAppearance.amplitude')
    # System preference is a live common guard, not a one-time capability flag.
    # Keeping numbers enabled internally leaves unplayed numbers available when
    # motion is restored; moving() still suppresses them while reduced.
    replace("on.numbers=!matchMedia('(prefers-reduced-motion:reduce)').matches;", '// Numbers follow the live shared reduced-motion guard.')
    replace('const enabled=!rm.matches&&!audit;', "const enabled=!rm.matches&&!audit&&!document.body.classList.contains('motion-stalled');")
    replace("if(section.dataset.seen)return;section.dataset.seen='1';if(document.body.classList.contains('motion-off'))return;", "if(section.dataset.seen||document.body.classList.contains('motion-off'))return;section.dataset.seen='1';")
    replace("document.addEventListener('site-motion',()=>{if(!enabled())refresh();else if(document.hidden){", "document.addEventListener('site-motion',()=>{document.body.dataset.sampleDepth=on.depth&&enabled()?'on':'off';if(!enabled())refresh();else if(document.hidden){")
    # All devices get the same effects/count. Only position and size adapt.
    replace('n=innerWidth<600?3:6', 'n=6')
    replace("const side=i%2,position=gap>45?(side?innerWidth-gap*(.25+(i%3)*.24):gap*(.18+(i%3)*.24)):innerWidth*(.12+i*.29)", "const position=motionLeafPosition(innerWidth,gap,i,n)")
    replace('setTimeout(hideBird,2300)', 'setTimeout(hideBird,motionDelay(2300))')
    replace("setTimeout(()=>landscape.classList.remove('is-celebrating'),1800)", "setTimeout(()=>landscape.classList.remove('is-celebrating'),motionDelay(1800))")
    replace('setTimeout(()=>bubble.hidden=true,1800)', 'setTimeout(()=>bubble.hidden=true,motionDelay(1800))')
    replace("setTimeout(()=>s.classList.remove('sample-updated'),1800)", "setTimeout(()=>s.classList.remove('sample-updated'),motionDuration('update'))")
    # Both app shapes are admitted explicitly. Historic homepage arrays remain
    # valid; new typed geometry admits only measured active-state markers.
    old_dot = "if(on.dots)(l.dots||[]).forEach((r,i)=>{if(inView(s,r))candidates.push({key:'dot:'+i,rect:r});});"
    typed_dot = "if(on.dots)(l.dots||[]).forEach((item,i)=>{const r=Array.isArray(item)?item:item.rect;if(inView(s,r))candidates.push({...(Array.isArray(item)?{}:item),key:'dot:'+i,rect:r});});"
    replace(old_dot if old_dot in text else typed_dot, "if(on.dots)(l.dots||[]).forEach((item,i)=>{const r=Array.isArray(item)?item:item.rect;if(motionDotEnabled(item)&&inView(s,r))candidates.push({...(Array.isArray(item)?{}:item),key:'dot:'+i,rect:r});});")
    # CSS receives the same single config; no visible motion switch is added.
    text += '\n' + "for(const [key,value]of Object.entries(motionCSSProperties(SiteMotionAppearance)))document.documentElement.style.setProperty(key,value);\n"
    text += 'installMotionExperience(SiteMotionAppearance);\n'
    if hero_module(text) != protected_hero:
        raise ValueError('Motion preparation changed the protected hero module')
    return text


def patch_css(text):
    """Append the shared appearance overrides to a fresh immutable CSS bundle."""
    if '/* motion-appearance-v1 */' in text:
        raise ValueError('CSS is already prepared')
    override = (HERE / 'typeset-layout.css').read_text('utf8').split('/* motion-appearance-v1 */', 1)
    if len(override) != 2:
        raise ValueError('Shared motion CSS overrides are missing')
    return text + '\n/* motion-appearance-v1 */' + override[1]


def file_stamp(path):
    body = Path(path).read_bytes()
    return {'sha256': hashlib.sha256(body).hexdigest(), 'bytes': len(body)}


def prepare(baseline, output, report):
    baseline, output = Path(baseline).resolve(), Path(output).resolve()
    if output.exists() or output == baseline or output.is_relative_to(baseline):
        raise ValueError('Choose a fresh output outside the baseline')
    manifest_path = baseline / 'release-manifest.json'
    manifest = json.loads(manifest_path.read_text('utf8'))
    baseline_id, identity_scheme = release_identity(manifest['files'], manifest)
    if manifest.get('release_id') != baseline_id:
        raise ValueError('Baseline release identity differs from its file inventory')
    actual_files = {p.relative_to(baseline).as_posix(): file_stamp(p) for p in sorted(baseline.rglob('*')) if p.is_file() and p.relative_to(baseline).as_posix() != 'release-manifest.json'}
    if actual_files != manifest['files']:
        raise ValueError('Baseline inventory differs from its manifest')
    changes, assets, mapping, protected_modules = {}, {}, {}, {}
    # Prepare before copying so unsupported runtime shapes leave no partial package.
    for hp in sorted(baseline.rglob('*.html')):
        raw = hp.read_bytes(); text = raw.decode('utf8')
        route = '/' + hp.relative_to(baseline).as_posix()
        replacements = {}
        for m in re.finditer(r'<(?:script|link)\b[^>]*\b(?:src|href)=["\']([^"\']+)["\']', text):
            original = m[1]; resolved = urlsplit(urljoin(route, original))
            rel = resolved.path.lstrip('/')
            # OSS URLs for media do not participate. Only package-local app and
            # stylesheets are updated, with query strings preserved if present.
            if resolved.netloc or not (baseline / rel).is_file():
                continue
            is_app = re.fullmatch(r'(?:_shared|_typeset/runtime)/app(?:-[a-z0-9]+)*-[a-f0-9]+\.js', rel)
            is_css = re.fullmatch(r'(?:_shared/site|_typeset/runtime/(?:typeset-)?layout)-[a-f0-9]+\.css', rel)
            if not is_app and not is_css:
                continue
            if rel not in mapping:
                source = (baseline / rel).read_bytes().decode('utf8')
                if is_app:
                    body = patch_runtime(source).encode('utf8'); suffix = '.js'; label = 'app'
                    protected_modules[rel] = {'sha256': hashlib.sha256(hero_module(source).encode('utf8')).hexdigest(), 'bytes': len(hero_module(source).encode('utf8')), 'preserved': hero_module(body.decode('utf8')) == hero_module(source)}
                else:
                    body = patch_css(source).encode('utf8'); suffix = '.css'; label = 'motion'
                new = '_typeset/runtime/' + label + '-' + hashlib.sha256(body).hexdigest()[:20] + suffix
                if (baseline / new).exists() and (baseline / new).read_bytes() != body:
                    raise ValueError('Content-addressed asset collision: ' + new)
                assets[new] = body; mapping[rel] = '/' + new
            new_url = mapping[rel] + ('?' + resolved.query if resolved.query else '')
            replacements[original] = new_url
        updated = raw
        for old, new in replacements.items():
            updated = updated.replace(old.encode(), new.encode())
        if updated != raw:
            changes[hp.relative_to(baseline).as_posix()] = {'before': file_stamp(hp), 'replacements': replacements, 'body': updated}
    if not any(Path(rel).name.startswith('app-') for rel in assets) or not changes:
        raise ValueError('No supported installed runtime was found')
    shutil.copytree(baseline, output)
    for rel, body in assets.items():
        destination = output / rel; destination.parent.mkdir(parents=True, exist_ok=True); destination.write_bytes(body)
    for rel, change in changes.items():
        (output / rel).write_bytes(change.pop('body')); change['after'] = file_stamp(output / rel)
    old_files = dict(manifest['files'])
    files = {p.relative_to(output).as_posix(): file_stamp(p) for p in sorted(output.rglob('*')) if p.is_file() and p.relative_to(output).as_posix() != 'release-manifest.json'}
    release_id, _ = release_identity(files, manifest)
    manifest.update({'files': files, 'release_id': release_id, 'motion_preparation': {
        'status': 'prepared_pending_acceptance', 'baseline_release_id': baseline_id,
        'appearance_sha256': file_stamp(CONFIG)['sha256'], 'old_page_evidence_is_not_new_acceptance': True}})
    (output / 'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    result = {'schema': 'wly.motion-release-preparation.v1', 'status': 'prepared',
        'prepared_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(),
        'baseline': str(baseline), 'output': str(output), 'baseline_manifest': file_stamp(manifest_path),
        'release_id': release_id, 'identity_scheme': identity_scheme, 'inventory_exactly_bound': True,
        'preserved_hero_modules': protected_modules, 'runtime_overlay_preserved': manifest.get('runtime_overlay'),
        'appearance': appearance(), 'appearance_input': file_stamp(CONFIG),
        'changed_html': changes, 'new_assets': {rel: file_stamp(output / rel) for rel in assets},
        'immutable_baseline_assets_preserved': all((output / rel).read_bytes() == (baseline / rel).read_bytes() for rel in old_files if rel not in changes),
        'pending': ['normal motion and reduced-motion/background checks', 'reading/navigation on all changed pages', 'source/repo/video/version gates for any newly selected page', 'owner subjective appearance acceptance'],
        'published': False}
    report = Path(report); report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    return result


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--baseline', type=Path, required=True); ap.add_argument('--output', type=Path, required=True); ap.add_argument('--report', type=Path, required=True)
    args = ap.parse_args(); result = prepare(args.baseline, args.output, args.report)
    print(json.dumps({'status': result['status'], 'changed_pages': len(result['changed_html']), 'new_assets': len(result['new_assets']), 'published': False}, ensure_ascii=False))


if __name__ == '__main__':
    main()

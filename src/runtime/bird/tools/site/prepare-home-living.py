"""Replay the approved homepage living-painting package onto a complete release.

Only index.html, a new home-only app/CSS and new original package files change.
No producer, original runtime/media, account, CORS or publication is mutated.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import re
import importlib.util
import sys
from urllib.parse import urljoin, urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parents[5] / 'scripts'))
from release_delta import source_path
_spec = importlib.util.spec_from_file_location('home_living_owner', Path(__file__).resolve().parents[5] / 'scripts/prepare-home-living.py')
owner = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(owner)
proof, inventory, identity = owner.proof, owner.inventory, owner.identity
replace_once, between = owner.replace_once, owner.between
cockpit_model, patch_runtime, prepare = owner.cockpit_model, owner.patch_runtime, owner.prepare

HERE = Path(__file__).resolve().parent
BJT = timezone(timedelta(hours=8))
HOME_CSS = '''/* 原图和活画用同一比例，热区和 Tab 焦点位于活画上层。 */
#home-01 { position:relative; overflow:hidden; }
#home-01 > picture, #home-01 > picture > img { display:block; width:100%; height:100%; object-fit:fill; }
#home-01 > .overlays { z-index:1; }
#home-01 .hotspot, #home-01 button { z-index:1; }
'''
HOME_OPENING = r'''<style>
html[data-home-opening="pending"] #home-01 > * { visibility:hidden !important; }
</style><script>
(() => {
  const root = document.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const path = value => new URL(value, location.href).pathname.replace(/index\.html$/, '');
  let restore = false;
  try {
    const previous = JSON.parse(sessionStorage.getItem('site-album-navigation-v1'));
    restore = previous?.restore && Date.now() - previous.at < 10000 && path(previous.to) === path(location.href);
  } catch {}
  if (restore || reduce.matches || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return;
  // 在原图第一次绘制之前保留白纸；未执行脚本时，原图照常显示。
  const opening = window.HomeOpening = {pending:true, reason:'preparing'};
  root.dataset.homeOpening = 'pending';
  opening.release = reason => {
    if (!opening.pending) return;
    opening.pending = false; opening.reason = reason;
    delete root.dataset.homeOpening; clearTimeout(timer);
  };
  const timer = setTimeout(() => opening.release('startup-timeout'), 6000);
  addEventListener('error', event => {
    if (/\/(?:hero-live\.|home-app-)/.test(event.target?.src || '')) opening.release('script-error');
  }, true);
  addEventListener('pagereveal', event => { if (opening.pending) event.viewTransition?.skipTransition(); });
  addEventListener('pagehide', () => opening.release('pagehide'));
  reduce.addEventListener('change', event => { if (event.matches) opening.release('reduced-motion'); });
})();
</script>'''


def prepare_native_home(baseline: Path, fixed_packet: Path, support: Path, output: Path) -> dict:
    """在新版静态首页上窄接 6c；保留当前正文、图片、布局和热区。"""
    import subprocess
    from build_bird_guide import minify, esbuild_path
    home = json.loads((fixed_packet / 'references.json').read_text('utf8'))['home']
    engine_source = (Path(__file__).resolve().parents[3] / 'living/step1-source/home-scene.js').read_text('utf8')
    engine_source = replace_once(engine_source, 'hero-live.config.b07cbbaf8c.json', Path(home['config_url']).name)
    texture_patch = r'''    let nativeTexture = loaded[0];
    if (hasBird && shared.plateImage) {
      const src = shared.plateImage.__heroNativePlates?.[portrait ? 'portrait' : 'landscape'] || await basePlateURL();
      const current = await loadImage(new URL(src, document.baseURI).href, true);
      const c = document.createElement('canvas'); c.width = PW; c.height = PH;
      const g = c.getContext('2d'); g.drawImage(current, 0, 0, PW, PH);
      const sp = A.sprites.idle, s = sp.scale * A.place.scale, pad = 24;
      const x = Math.floor(A.place.x - sp.feet[0] * s - pad), y = Math.floor(A.place.y - sp.feet[1] * s - pad);
      const w = Math.ceil(sp.w * s + 2 * pad), h = Math.ceil(sp.h * s + 2 * pad);
      const patch = document.createElement('canvas'); patch.width = w; patch.height = h;
      const p = patch.getContext('2d'); p.drawImage(loaded[0], x, y, w, h, 0, 0, w, h);
      const pixels = p.getImageData(0, 0, w, h);
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
        const a = Math.min(1, Math.min(xx, yy, w - 1 - xx, h - 1 - yy) / 12);
        pixels.data[(yy * w + xx) * 4 + 3] *= a * a * (3 - 2 * a);
      }
      p.putImageData(pixels, 0, 0); g.drawImage(patch, x, y); nativeTexture = c;
    }
    buildPreserveMask(nativeTexture);'''
    engine_source = replace_once(engine_source, '    buildPreserveMask(loaded[0]);', texture_patch)
    engine_source = replace_once(engine_source, 'await initGL(loaded[0])', 'await initGL(nativeTexture)')
    minifier = "const e=require(%s);let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>process.stdout.write(e.transformSync(s,{minify:true,target:'es2019',charset:'utf8',legalComments:'none',supported:{'template-literal':false}}).code));" % json.dumps(esbuild_path())
    engine_bytes = subprocess.run(['node', '-e', minifier], input=engine_source.encode('utf8'), capture_output=True, check=True).stdout
    engine_rel = '_shared/home-living/hero-live.' + proof(engine_bytes)['sha256'][:10] + '.js'
    home = {**home, 'derived_from_6c': home['engine_url'], 'base_source': home['source'], 'source': proof(engine_source.encode('utf8')),
            'engine_url': '/' + engine_rel, 'engine_object': proof(engine_bytes), 'source_input': '6c with native current-plate composition from this prepare_native_home function; source hash uses normalized UTF-8.'}
    original = source_path(baseline, 'index.html').read_text('utf8')
    match = re.search(r'(<script\b[^>]*id="page-data"[^>]*>)(.*?)(</script>)', original, re.S)
    data = json.loads(match[2])
    if data.get('page') != 'home' or data.get('home_static') is not True or data.get('home_living'):
        raise ValueError('Expected the current Native08 static homepage')
    app_match = re.search(r'<script\b[^>]*data-album-runtime[^>]*data-src="([^\"]*home-app-[a-f0-9]+\.js)"[^>]*>', original)
    if not app_match:
        raise ValueError('Native08 home app lazy entry is missing')
    model, model_proof = cockpit_model(baseline)
    bridge = (HERE / 'home-living-bind.js').read_text('utf8')
    app = patch_runtime(source_path(baseline, app_match[1].lstrip('/')).read_text('utf8'), model, bridge)
    app_bytes = minify(app, 'js', 'es2019')
    app_rel = '_shared/home-app-' + proof(app_bytes)['sha256'][:20] + '.js'
    css = minify(HOME_CSS + (support / 'hero-live.346b811704.css').read_text('utf8'), 'css', 'es2019')
    css_rel = '_shared/home-living-bind-' + proof(css)['sha256'][:20] + '.css'
    data['home_living'] = True
    data['home_static'] = False
    data['shared']['script_bundle'] = '/' + app_rel
    html = original[:match.start(2)] + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + original[match.end(2):]
    old_tag = app_match[0]
    new_tag = old_tag.replace(app_match[1], '/' + app_rel).replace('<script ', '<script type="module" ')
    engine_tag = '<script data-album-runtime data-src="' + home['engine_url'] + '"></script>'
    html = replace_once(html, old_tag, engine_tag + new_tag)
    html = replace_once(html, '<meta charset="utf-8">', '<meta charset="utf-8">' + HOME_OPENING)
    html = replace_once(html, '</head>', '<link rel="stylesheet" href="/' + css_rel + '"></head>')
    files = {app_rel: app_bytes, css_rel: css, engine_rel: engine_bytes}
    config_rel = home['config_url'].lstrip('/')
    config_bytes = (support / Path(config_rel).name).read_bytes()
    config = json.loads(config_bytes)
    files[config_rel] = config_bytes
    assets = {config[o][key] for o in ('landscape', 'portrait') for key in ('plate', 'plateNoBird')}
    assets.update(sprite['src'] for sprite in config['sprites'].values())
    files.update({'_shared/home-living/' + rel: (support / rel).read_bytes() for rel in sorted(assets)})
    for rel, body in files.items():
        target = output / 'assets' / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() and target.read_bytes() != body:
            raise ValueError('Home overlay target already has different bytes: ' + rel)
        target.write_bytes(body)
    (output / 'pages').mkdir(parents=True, exist_ok=True)
    (output / 'pages/index.html').write_bytes(html.encode('utf8'))
    return {**home, 'app_url': '/' + app_rel, 'style_url': '/' + css_rel,
            'bridge_source': proof(bridge.encode('utf8')), 'bridge_source_kind': 'normalized UTF-8 as compiled',
            'objects': {rel: proof(body) for rel, body in files.items()}, 'b2_model': model_proof,
            'html': proof(html.encode('utf8')), 'source_html': proof(original.encode('utf8')),
            'integration': 'Keep Native08 pictures/layout/hotspots; load 6c before the latest rebuilt app through the existing album lazy sequence.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--package', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--report', type=Path, required=True)
    parser.add_argument('--native-home-support', type=Path)
    args = parser.parse_args()
    if args.native_home_support:
        result = prepare_native_home(args.baseline, args.package, args.native_home_support, args.output)
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
        print(json.dumps({'status': 'native-home-overlay-prepared', 'html': result['html']}, ensure_ascii=False))
        return
    result = prepare(args.baseline, args.package, args.output, args.report)
    print(json.dumps({key: result[key] for key in ['status', 'release_id', 'file_count', 'html_count', 'published']}, ensure_ascii=False))


if __name__ == '__main__':
    main()

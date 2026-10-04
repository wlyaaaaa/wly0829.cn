"""Replay the six approved 2e preparations, then use the existing hybrid assembly."""
import argparse
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
STEPS = ('comic', 'living', 'album', 'river', 'demo', 'retry')
spec = importlib.util.spec_from_file_location('creative_hybrid', HERE / 'hybrid-release.py')
hybrid = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hybrid)


def stamp(path):
    return {'sha256': hybrid.digest(path), 'bytes': path.stat().st_size}


def recipe(path):
    path = path.resolve()
    data = hybrid.read(path)
    if data.get('schema') != 'wly.creative-replay.v1':
        raise ValueError('Unsupported creative preparation recipe')
    required = {'comic_package', 'living_package', 'river_handoff', 'demo_assets', 'geometry', 'asset_base_url'}
    if not required <= data.keys() or not data['geometry']:
        raise ValueError('All six approved preparations need their actual inputs')
    paths = {key: Path(data[key]).resolve() for key in required - {'geometry', 'asset_base_url'}}
    paths['geometry'] = [Path(p).resolve() for p in data['geometry']]
    inputs = {str(path): stamp(path)}
    # Bind the actual approved packages and implementation used by this fixed replay.
    for root in (paths['comic_package'], paths['living_package'], paths['river_handoff'], paths['demo_assets']):
        if not root.is_dir():
            raise ValueError('Missing preparation package: ' + str(root))
        inputs.update({str(p.resolve()): stamp(p) for p in root.rglob('*') if p.is_file()})
    for p in paths['geometry']:
        inputs[str(p)] = stamp(p)
    for pattern in ('prepare-home-*.*', 'home-living-*.*', 'prepare-page-flip.py', 'album-runtime.*',
                    'prepare-today-river.py', 'today-river-runtime.*', 'prepare-how-demo.py',
                    'how-demo-*.*', 'prepare-resource-retry.py', 'resource-retry-runtime.js', 'prepare-creative-release.py'):
        inputs.update({str(p.resolve()): stamp(p) for p in HERE.glob(pattern) if p.is_file()})
    if data.get('title_cache'):
        paths['title_cache'] = Path(data['title_cache']).resolve()
        inputs[str(paths['title_cache'])] = stamp(paths['title_cache'])
    return data, paths, inputs


def prepare(source, baseline, config, output, evidence_root):
    source, baseline, config, output, evidence_root = [Path(p).resolve() for p in
                                                     (source, baseline, config, output, evidence_root)]
    if output.exists() or evidence_root.exists():
        raise ValueError('Creative output and evidence directories must be fresh')
    data, paths, inputs = recipe(config)
    raw = hybrid.verify_release(source)
    old = hybrid.verify_release(baseline)
    if raw.get('baseline_files') != old['files']:
        raise ValueError('Raw five-page build has a different complete production baseline')
    evidence_root.mkdir(parents=True)
    current = source
    steps = []
    for name in STEPS:
        dest = evidence_root / (name + '-site')
        proof = evidence_root / (name + '.json')
        if name == 'comic':
            args = ['prepare-home-comic.py', '--baseline', current, '--package', paths['comic_package'], '--output', dest, '--report', proof]
        elif name == 'living':
            args = ['prepare-home-living.py', '--baseline', current, '--package', paths['living_package'], '--output', dest, '--report', proof]
        elif name == 'album':
            args = ['prepare-page-flip.py', '--source', current, '--out', dest, '--profile', evidence_root / 'album-profile', '--evidence', proof]
            for geometry in paths['geometry']:
                args += ['--geometry', geometry]
            if paths.get('title_cache'):
                args += ['--title-cache', paths['title_cache']]
        elif name == 'river':
            args = ['prepare-today-river.py', '--release', current, '--output', dest, '--handoff', paths['river_handoff']]
        elif name == 'demo':
            args = ['prepare-how-demo.py', '--source', current, '--out', dest, '--assets-dir', paths['demo_assets'], '--evidence', proof]
        else:
            args = ['prepare-resource-retry.py', '--baseline', current, '--output', dest, '--report', proof,
                    '--asset-base-url', data['asset_base_url']]
        before = hybrid.read(current / hybrid.MANIFEST)['release_id']
        subprocess.run([sys.executable, str(HERE / args[0]), *map(str, args[1:])], check=True)
        if name == 'river':
            dest = dest / 'site'
        after = hybrid.read(dest / hybrid.MANIFEST)['release_id']
        steps.append({'name': name, 'before_release_id': before, 'after_release_id': after})
        current = dest
    prepared = hybrid.read(current / hybrid.MANIFEST)
    files = hybrid.inventory(current)
    if files != prepared['files']:
        raise ValueError('Prepared inventory changed during replay')
    accepted = raw['accepted_pages']
    accepted_files = {hybrid.route_file(url) for url in accepted}
    # These published legacy links lost their old anchors in the reviewed 27-page
    # update. Reuse the existing navigation contract and retain each original href.
    navigation_pages=hybrid.nav_repair.page_inventory(current)
    navigation_repairs=[]
    for rel in ('skills/documents/index.html','skills/pdf/index.html','system/index.html'):
        path=current/rel
        if not path.is_file():continue
        original=path.read_bytes()
        revised=hybrid.rewrite_links(original.decode('utf8'),current,path,set(navigation_pages),navigation_repairs,
                                     current,accepted_files,navigation_pages).encode('utf8')
        if revised!=original:path.write_bytes(revised)
    files=hybrid.inventory(current)
    changes = {rel: {'kind': 'integrated_preparation', 'source_path': str(current / rel),
                     'before': old['files'].get(rel), 'after': proof}
               for rel, proof in files.items()
               if rel not in accepted_files and proof != old['files'].get(rel)}
    manifest = hybrid.assemble(baseline, current, output, old, accepted, candidate_files=files,
                               overlay={'files': changes},
                               baseline_production_commit=raw.get('baseline_production_commit'),
                               baseline_input_kind=raw.get('baseline_input_kind'))
    normalization=[]
    for rel in files.keys()|manifest['files'].keys():
        if files.get(rel)==manifest['files'].get(rel):continue
        if rel not in accepted_files or (current/rel).read_bytes().replace(b'\r\n',b'\n')!=(output/rel).read_bytes().replace(b'\r\n',b'\n'):
            raise ValueError('Hybrid assembly changed approved prepared content: '+rel)
        normalization.append(rel)
    for key in ('home_living_preparation', 'home_comic_preparation', 'page_flip_preparation',
                'today_river_preparation', 'how_demo_preparation', 'resource_retry_preparation'):
        if key in prepared:
            manifest[key] = prepared[key]
    public_changes = {rel: {k: v for k, v in entry.items() if k != 'source_path'}
                      for rel, entry in changes.items()}
    result = {'schema': 'wly.creative-replay-result.v1', 'config': {'path': str(config), **stamp(config)},
              'raw_release_id': raw['release_id'], 'steps': steps, 'files': public_changes,
              'assembled_release_id':manifest['release_id'],'accepted_html_newline_normalization':sorted(normalization),
              'navigation_repairs':navigation_repairs}
    manifest['creative_preparation'] = result
    hybrid.write(output / hybrid.MANIFEST, manifest)
    for p, expected in inputs.items():
        if stamp(Path(p)) != expected:
            raise ValueError('Preparation input changed during replay: ' + p)
    hybrid.write(evidence_root / 'replay.json', {'status': 'prepared_pending_final_acceptance',
                 'source': str(source), 'output': str(output), 'release_id': manifest['release_id'],
                 'preparation': result, 'inputs': inputs, 'publication_performed': False})
    return manifest, result, inputs


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('source', 'baseline', 'config', 'output', 'evidence-root'):
        parser.add_argument('--' + name, type=Path, required=True)
    args = parser.parse_args()
    manifest, _, _ = prepare(args.source, args.baseline, args.config, args.output, args.evidence_root)
    print(json.dumps({'status': 'prepared_pending_final_acceptance', 'release_id': manifest['release_id'],
                      'files': len(manifest['files']), 'html': sum(k.endswith('.html') for k in manifest['files'])}))

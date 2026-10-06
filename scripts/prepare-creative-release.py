"""Replay the six approved 2e preparations, then use the existing hybrid assembly."""
import argparse
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
def input_path(value): return (ROOT / value).resolve()
def packet_path(packet, value): return ROOT / value if value.startswith('sources/') else packet.parent.parent / value
STEPS = ('comic', 'living', 'album', 'river', 'demo', 'retry')
FULL_2F_SCOPE='full-pages-creative-2f'
FULL_2F_STEPS=('river','living','comic','album','demo','retry')
STATIC_2F_SCOPE='full-pages-creative-2f-static-home'
STATIC_2F_STEPS=('static-home','river','comic','album','demo','retry')
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
    page_only=data.get('scope')=='page-demo-and-retry'
    static_2f=data.get('scope')==STATIC_2F_SCOPE
    full_2f=data.get('scope') in (FULL_2F_SCOPE,STATIC_2F_SCOPE)
    if data.get('scope') not in (None,'page-demo-and-retry',FULL_2F_SCOPE,STATIC_2F_SCOPE):
        raise ValueError('Unknown approved preparation scope')
    required = {'demo_assets','asset_base_url'} if page_only else {'comic_package', 'living_package', 'river_handoff', 'demo_assets', 'asset_base_url'}
    if static_2f:
        required.remove('living_package')
        required.add('static_home_reference')
    if not full_2f and not page_only:required.add('geometry')
    if not required <= data.keys() or (not page_only and not full_2f and not data['geometry']):
        raise ValueError('All six approved preparations need their actual inputs')
    if data.get('home_bio'): required.add('home_bio_script')
    if data.get('bird_first_packet'): required |= {'bird_first_packet','native_home_support','native_home_script'}
    if data.get('living_pages_packet'): required.add('living_pages_packet')
    paths = {key: input_path(data[key]) for key in required - {'geometry', 'asset_base_url'}}
    paths['geometry'] = [input_path(p) for p in data.get('geometry',[])]
    inputs = {str(path): stamp(path)}
    # Bind the actual approved packages and implementation used by this fixed replay.
    for root in [value for key,value in paths.items() if key not in ('geometry','static_home_reference','home_bio_script','native_home_script')]:
        if not root.is_dir():
            raise ValueError('Missing preparation package: ' + str(root))
        files = [root/'river2.template.html'] if root == paths.get('river_handoff') else root.rglob('*')
        inputs.update({str(p.resolve()): stamp(p) for p in files if p.is_file()})
    for p in paths['geometry']:
        inputs[str(p)] = stamp(p)
    if data.get('home_bio'): inputs[str(paths['home_bio_script'])] = stamp(paths['home_bio_script'])
    if data.get('bird_first_packet'):
        inputs[str(paths['native_home_script'])] = stamp(paths['native_home_script'])
        inputs[str(paths['native_home_script'].parent/'build_bird_guide.py')] = stamp(paths['native_home_script'].parent/'build_bird_guide.py')
    if data.get('living_pages_packet'):
        packet=paths['living_pages_packet']; refs=hybrid.read(packet/'references.json'); inputs.update({str(packet_path(packet,rel)):stamp(packet_path(packet,rel)) for rel in refs['object_sources'].values()})
        inputs[str(paths['native_home_script'].parent/'apply_bird_fixed_upgrade.py')]=stamp(paths['native_home_script'].parent/'apply_bird_fixed_upgrade.py')
    if static_2f:
        reference=paths['static_home_reference']
        inputs[str(reference)]=stamp(reference)
        static_spec=importlib.util.spec_from_file_location('creative_static_home',HERE/'prepare-static-home.py')
        static_module=importlib.util.module_from_spec(static_spec);static_spec.loader.exec_module(static_module)
        for rel,expected in static_module.reference_data(reference)[2].items():
            inputs[str((reference.parent/rel).resolve())]=expected
        inputs[str(HERE/'prepare-static-home.py')]=stamp(HERE/'prepare-static-home.py')
    for pattern in ('prepare-home-*.*', 'home-living-*.*', 'prepare-page-flip.py', 'album-runtime.*',
                    'prepare-today-river.py', 'today-river-runtime.*', 'prepare-how-demo.py',
                    'how-demo-*.*', 'prepare-resource-retry.py', 'resource-retry-runtime.js', 'prepare-creative-release.py'):
        inputs.update({str(p.resolve()): stamp(p) for p in HERE.glob(pattern) if p.is_file()})
    if full_2f:
        for name in ('today-river.js','today-river.css'):
            inputs[str(HERE/name)]=stamp(HERE/name)
        inputs.update({str(p.resolve()):stamp(p)for p in (HERE/'today-river-assets2').rglob('*')if p.is_file()})
    if data.get('title_cache'):
        paths['title_cache'] = input_path(data['title_cache'])
        inputs[str(paths['title_cache'])] = stamp(paths['title_cache'])
    return data, paths, inputs


def prepare(source, baseline, config, output, evidence_root, staged_build_report=None):
    source, baseline, config, output, evidence_root = [Path(p).resolve() for p in
                                                     (source, baseline, config, output, evidence_root)]
    if output.exists() or evidence_root.exists():
        raise ValueError('Creative output and evidence directories must be fresh')
    data, paths, inputs = recipe(config)
    raw = hybrid.verify_release(source)
    old = hybrid.verify_release(baseline)
    if raw.get('baseline_files') != old['files']:
        raise ValueError('Raw five-page build has a different complete production baseline')
    static_2f=data.get('scope')==STATIC_2F_SCOPE
    full_2f=data.get('scope') in (FULL_2F_SCOPE,STATIC_2F_SCOPE)
    staged_proof=None
    panorama_source=None
    if full_2f:
        if staged_build_report is None:raise ValueError('2f creative replay requires its real native staged build report')
        staged_build_report=Path(staged_build_report).resolve();staged=hybrid.read(staged_build_report)
        if (staged.get('schema')!='wly.typeset-build.v1' or staged.get('stage')!='native-before-creative'
                or staged.get('release_id')!=raw['release_id'] or staged.get('files')!=raw['files']
                or Path(staged.get('baseline_root','')).resolve()!=baseline or not staged.get('geometry_path')):
            raise ValueError('Staged build report does not bind this exact native 2f source')
        if stamp(Path(staged['geometry_path']))['sha256']!=staged.get('geometry_sha256'):
            raise ValueError('Staged native geometry changed before creative replay')
        staged_proof={'path':str(staged_build_report),**stamp(staged_build_report)}
        inputs[str(staged_build_report)]=stamp(staged_build_report)
        if static_2f:
            matches=[(Path(p).resolve(),expected) for p,expected in staged.get('inputs',{}).items()
                     if p.replace('\\','/').endswith(('/input-snapshot/sources/how.json','/sources/pages/how/page.json'))]
            if len(matches)!=1 or stamp(matches[0][0])!=matches[0][1]:
                raise ValueError('Static 2f replay requires the exact staged frozen how Source JSON')
            panorama_source=matches[0][0]
            inputs[str(panorama_source)]=matches[0][1]
    evidence_root.mkdir(parents=True)
    current = source
    steps = []
    import os
    environment=os.environ.copy()
    if data.get('native_home_script'): environment['PYTHONPATH']=str(paths['native_home_script'].parent)+os.pathsep+environment.get('PYTHONPATH','')
    selected_steps=list(('demo','retry') if data.get('scope')=='page-demo-and-retry' else STATIC_2F_STEPS if static_2f else FULL_2F_STEPS if full_2f else STEPS)
    if data.get('home_bio'): selected_steps.append('bio')
    if data.get('bird_first_packet'): selected_steps.append('native-living')
    if data.get('living_pages_packet'): selected_steps.append('bird-first')
    for name in selected_steps:
        dest = evidence_root / (name + '-site')
        proof = evidence_root / (name + '.json')
        if name == 'static-home':
            args=['prepare-static-home.py','--baseline',current,'--reference',paths['static_home_reference'],'--output',dest,'--report',proof]
        elif name == 'native-living':
            args=['prepare-home-living.py','--baseline',current,'--package',paths['bird_first_packet'],'--native-home-support',paths['native_home_support'],'--native-home-script',paths['native_home_script'],'--output',dest,'--report',proof]
        elif name == 'bio':
            args=[str(paths['home_bio_script']),'--baseline',current,'--output',dest,'--report',proof]
        elif name == 'bird-first':
            import shutil
            packet=paths['living_pages_packet']; refs=hybrid.read(packet/'references.json'); shutil.copytree(current,dest)
            for rel,src in refs['object_sources'].items():
                target=dest/rel; target.parent.mkdir(parents=True,exist_ok=True); shutil.copyfile(packet_path(packet,src),target)
            args=[str(paths['native_home_script'].parent/'apply_bird_fixed_upgrade.py'),'--site',dest,'--packet',packet,'--output',proof,'--apply']
        elif name == 'comic':
            args = ['prepare-home-comic.py', '--baseline', current, '--package', paths['comic_package'], '--output', dest, '--report', proof]
        elif name == 'living':
            args = ['prepare-home-living.py', '--baseline', current, '--package', paths['living_package'], '--output', dest, '--report', proof]
            home_data=hybrid.builder.PAGE_DATA.search((current/'index.html').read_text('utf8'))if full_2f else None
            if full_2f and home_data and json.loads(home_data[2]).get('home_living'):
                args=['prepare-home-living.py','--baseline',current,'--output',dest,'--report',proof,'--rebind-only']
        elif name == 'album':
            args = ['prepare-page-flip.py', '--source', current, '--out', dest, '--profile', evidence_root / 'album-profile', '--evidence', proof]
            for geometry in paths['geometry']:
                args += ['--geometry', geometry]
            if paths.get('title_cache'):
                args += ['--title-cache', paths['title_cache']]
            if full_2f:args+=['--build-report',staged_build_report]
        elif name == 'river':
            args = ['prepare-today-river.py', '--release', current, '--output', dest, '--handoff', paths['river_handoff']]
        elif name == 'demo':
            args = ['prepare-how-demo.py', '--source', current, '--out', dest, '--assets-dir', paths['demo_assets'], '--evidence', proof]
            if panorama_source:
                frozen=inputs[str(panorama_source)]
                args+=['--panorama-source',panorama_source,'--panorama-source-sha256',frozen['sha256'],
                       '--panorama-source-bytes',frozen['bytes']]
        else:
            args = ['prepare-resource-retry.py', '--baseline', current, '--output', dest, '--report', proof,
                    '--asset-base-url', data['asset_base_url']]
            if (data.get('scope')=='page-demo-and-retry' or full_2f) and old.get('resource_retry_preparation'):
                previous_manifest=baseline/hybrid.MANIFEST
                inputs[str(previous_manifest)]=stamp(previous_manifest)
                args += ['--previous-manifest', previous_manifest]
        before = hybrid.read(current / hybrid.MANIFEST)['release_id']
        subprocess.run([sys.executable, str(HERE / args[0]), *map(str, args[1:])], check=True, env=environment)
        if name == 'bird-first':
            engine=(dest/refs['engine_url'].lstrip('/')).read_text('utf8'); needle='M=A.getBoundingClientRect(),k=Math.round(M.width)'
            assert engine.count(needle)==1
            engine=engine.replace(needle,'M=(()=>{const f=window.TypesetLiveFlow?.sourceBox(e,x);return f?{left:f.left-x[0]*f.image_width,top:f.top-x[1]*f.image_height,width:f.image_width,height:f.image_height}:A.getBoundingClientRect()})(),k=Math.round(M.width)').replace('ge.className="living-layer",','ge.className="living-layer",ge.style.zIndex="1",')
            rel='_living/_engine/living.'+hybrid.hashlib.sha256(engine.encode()).hexdigest()[:10]+'.js'; (dest/rel).write_text(engine,encoding='utf8')
            for row in refs['mounted']:
                p=dest/row['route']; p.write_text(p.read_text('utf8').replace(refs['engine_url'],'/'+rel),encoding='utf8')
            updated=hybrid.read(dest/hybrid.MANIFEST); updated['files']=hybrid.inventory(dest); updated['release_id']=hybrid.hashlib.sha256(json.dumps(updated['files'],sort_keys=True).encode()).hexdigest(); hybrid.write(dest/hybrid.MANIFEST,updated)
        if name == 'native-living':
            import shutil
            site=dest/'site'; shutil.copytree(current,site)
            for group in ('assets','pages'):
                for p in (dest/group).rglob('*'):
                    if p.is_file(): target=site/p.relative_to(dest/group); target.parent.mkdir(parents=True,exist_ok=True); shutil.copyfile(p,target)
            dest=site; updated=hybrid.read(site/hybrid.MANIFEST); updated['files']=hybrid.inventory(site); updated['release_id']=hybrid.hashlib.sha256(json.dumps(updated['files'],sort_keys=True).encode()).hexdigest(); hybrid.write(site/hybrid.MANIFEST,updated)
        if name == 'river':
            dest = dest / 'site'
        if name=='album' and full_2f:
            for report in hybrid.read(dest/hybrid.MANIFEST).get('page_flip_preparation',{}).get('build_reports',[]):
                report_path=Path(report['path']).resolve();inputs[str(report_path)]=stamp(report_path)
                for geometry in report.get('geometry',[]):
                    geometry_path=Path(geometry['path']).resolve();inputs[str(geometry_path)]=stamp(geometry_path)
        after = hybrid.read(dest / hybrid.MANIFEST)['release_id']
        step={'name': name, 'before_release_id': before, 'after_release_id': after}
        if static_2f:step['manifest']={'path':str(dest/hybrid.MANIFEST),**stamp(dest/hybrid.MANIFEST)}
        steps.append(step)
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
    # Final assembly performs this same restoration. Bind its actual byte changes
    # before the reviewed file ledger, so the second assembly is idempotent.
    pending_link_restorations=hybrid.nav_repair.restore_pending_links(current,navigation_pages)
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
    for key in ('home_living_preparation', 'home_static_preparation', 'home_comic_preparation', 'page_flip_preparation',
                'today_river_preparation', 'how_demo_preparation', 'resource_retry_preparation', 'home_bio_preparation'):
        if key in prepared:
            manifest[key] = prepared[key]
    public_changes = {rel: {k: v for k, v in entry.items() if k != 'source_path'}
                      for rel, entry in changes.items()}
    result = {'schema': 'wly.creative-replay-result.v1', 'config': {'path': str(config), **stamp(config)},
              'raw_release_id': raw['release_id'], 'steps': steps, 'files': public_changes,
              'assembled_release_id':manifest['release_id'],'accepted_html_newline_normalization':sorted(normalization),
              'navigation_repairs':navigation_repairs,'pending_link_restorations':pending_link_restorations}
    if data.get('scope'):result['scope']=data['scope']
    if staged_proof:result['staged_build_report']=staged_proof
    if panorama_source:result['panorama_source_input']={'path':str(panorama_source),**stamp(panorama_source)}
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

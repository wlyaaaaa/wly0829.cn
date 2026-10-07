"""Freeze, measure, build and check a local typeset batch with one command.

Uses locked headless Chrome; publication is explicit and failed evidence retained.
"""
import argparse
import hashlib
import importlib.util
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import time
from urllib.request import urlopen
from urllib.parse import unquote, urlsplit

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
spec = importlib.util.spec_from_file_location('release_asset_builder', HERE/'build-assembled-site.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
sys.path.insert(0, str(ROOT / 'src/typeset'))
from engine import render as renderer, assets

def digest(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def load_state(path): return json.loads(path.read_text('utf8')) if path.is_file() else {}
def beijing_now(): return datetime.now(timezone(timedelta(hours=8))).isoformat()

def fingerprints(lock):
    assets._manifest = None
    library = assets.manifest(); result = {}; hashed = {}
    registry = renderer.load_registry()
    environment = {key: lock[key] for key in ('args', 'python_packages')}
    environment['binaries'] = [row['sha256'] for row in [lock['chrome'], *lock['fonts']]]
    for name, source in renderer.page_sources().items():
        page = json.loads(Path(source).read_text('utf8'))
        for screen in page['screens']: screen['screenshots'] = [] if screen['id'] in page.get('withdrawn_screenshot_screens', []) else screen.get('screenshots', [])
        if not page.get('url') and name != '404': continue
        layout = ROOT / 'sources/pages' / name / 'layout.json'
        spec = json.loads(layout.read_text('utf8'))
        spec = [{k: v for k, v in row.items() if k not in ('source_image', 'source_images')} for row in spec]
        rows = [r for s in page['screens'] for r in library.get(s['id'], [])]
        content = json.loads(json.dumps([page, spec, rows]))
        files = renderer.render_dependencies(name, page, {(r['screen'], r.get('orientation', 'h')): r for r in spec}, registry)
        resources = [spec, rows, [s.get('screenshots', []) for s in page['screens']]]
        for literal in re.findall(r'"(?:\\.|[^"\\])*"', json.dumps(resources, ensure_ascii=False)):
            value = json.loads(literal)
            if not re.search(r'[/\\]|^proto:|\.[a-zA-Z0-9]{1,6}$', value): continue
            p = ROOT/'src/typeset/assets'/(value[6:] if value[6:].endswith('.png') else value[6:]+'.png') if value.startswith('proto:') else Path(assets.local_path(value))
            if not p.is_absolute(): p = Path(assets.ASSET_ROOT) / p
            if p.is_file(): files.add(p.resolve())
        for p in files:
            if p.is_file() and p not in hashed: hashed[p] = digest(p)
        proofs = {relative_id(p): hashed[p] for p in files if p.is_file()}
        regions = load_state(Path(assets.TITLE_REGIONS)).get('regions', {})
        result[name] = content_key([content, environment, proofs,
                                   {sha: regions[sha] for sha in proofs.values() if sha in regions}])
    result['home'] = content_key('home')
    return result


def relative_id(path):
    path = Path(path).resolve()
    for label, root in (('repo', ROOT), ('assets', Path(assets.ASSET_ROOT))):
        if path.is_relative_to(root.resolve()): return label + '/' + path.relative_to(root.resolve()).as_posix()
    return 'external/' + path.name + '/' + digest(path)


def content_key(value):
    text = json.dumps(value, sort_keys=True, ensure_ascii=False)
    for root, label in ((ROOT, '@repo'), (Path(assets.ASSET_ROOT), '@assets')):
        for spelling in (str(root), root.as_posix()): text = text.replace(json.dumps(spelling)[1:-1], label)
    return hashlib.sha256(text.encode()).hexdigest()


def page_proofs(root):
    return {p.relative_to(root).as_posix(): digest(p) for p in root.rglob('*') if p.is_file() and p.name != '.render.lock'}


def recycle_owned(path):
    subprocess.run(['pwsh', '-NoProfile', '-File', 'E:/.agents/tools/Move-TaskItemToRecycleBin.ps1',
        '-LiteralPath', str(path), '-AllowedRoot', str(path.parent), '-Json'], check=True, capture_output=True)


def reuse_page(name, key, root, state_root):
    cached = state_root/'pages'/key/name
    proof = load_state(cached.parent/'proof.json')
    if not proof or proof.get('files') != page_proofs(cached): return False
    if any(not (Path(assets.CACHE)/rel).is_file() or digest(Path(assets.CACHE)/rel) != sha
           for rel, sha in proof.get('derived', {}).items()): return False
    if proof['repo'] == str(ROOT) and proof['assets'] == str(assets.ASSET_ROOT) and page_proofs(root/name) == proof['files']: return True
    if (root/name).exists(): recycle_owned(root/name)
    shutil.copytree(cached, root/name, dirs_exist_ok=True)
    if page_proofs(root/name) != proof['files']: return False
    for path in (root/name).rglob('*'):
        if path.suffix not in ('.html', '.json'): continue
        original = text = path.read_bytes().decode('utf8')
        for old, new in ((proof['repo'], ROOT), (proof['assets'], Path(assets.ASSET_ROOT))):
            for before, after in ((str(Path(old)), str(new)), (Path(old).as_posix(), new.as_posix())):
                text = text.replace(before, after).replace(json.dumps(before)[1:-1], json.dumps(after)[1:-1])
        if text != original: path.write_bytes(text.encode('utf8'))
    return True


def store_page(name, key, root, state_root):
    dest = state_root/'pages'/key/name
    if dest.parent.exists(): recycle_owned(dest.parent)
    shutil.copytree(root/name, dest, dirs_exist_ok=True)
    derived = {}
    for page in dest.rglob('*.html'):
        for ref in re.findall(r'(?:src|href)="(file://[^\"]+)"', page.read_text('utf8')):
            path = Path(unquote(urlsplit(ref).path.lstrip('/')))
            if path.is_relative_to(Path(assets.CACHE)):
                derived[path.relative_to(assets.CACHE).as_posix()] = digest(path)
    (dest.parent/'proof.json').write_text(json.dumps({'files': page_proofs(dest), 'repo': str(ROOT),
        'assets': str(assets.ASSET_ROOT), 'derived': derived}, sort_keys=True), encoding='utf8')


def shell_key(name, legacy, baseline, hybrid):
    source = json.loads(Path(renderer.page_sources()[name]).read_text('utf8')) if name != 'home' else {'url': '/'}
    rel = hybrid.route_file(source.get('url') or ('/404.html' if name == '404' else '/'+name+'/'))
    root = legacy if (legacy/rel).is_file() else baseline
    page = root/rel; files = {page}; text = page.read_text('utf8')
    parser = hybrid.builder.Refs(); parser.feed(re.sub(r'<main\b.*?</main>', '', text, flags=re.S))
    pending = [hybrid.local_reference(root, page, ref) for ref, nav in parser.refs if not nav]
    while pending:
        path = pending.pop()
        if path is None or path in files: continue
        if not path.is_file(): raise ValueError('Assembly dependency unavailable: '+str(path))
        files.add(path)
        if path.suffix in ('.js', '.css', '.mjs'):
            pending += [hybrid.local_reference(root, path, ref) for ref, nav in hybrid.references(path) if not nav]
    return content_key({p.relative_to(root).as_posix(): digest(p) for p in files})


def assembly_key(name, files, recipe):
    owners = {key: 'home' for key in ('static_home_reference', 'comic_package', 'home_bio_script',
        'bird_first_packet', 'native_home_support', 'native_home_script')}
    owners.update(river_handoff='cockpit', demo_assets='how')
    def selected(path):
        for key, owner in owners.items():
            if key in recipe:
                root = (ROOT/recipe[key]).resolve()
                if path == root or root in path.parents: return name == owner
        if path.parent == HERE or path == HERE/'today-river-assets2' or HERE/'today-river-assets2' in path.parents:
            if re.match(r'(?:prepare-home-|home-|prepare-static-home|prepare-today-river|today-river)', path.name):
                return name == ('cockpit' if 'river' in path.name else 'home')
            if path.suffix in ('.js', '.css') and path.name.startswith('how-demo-'): return name == 'how'
        return True
    config = {key: value for key, value in recipe.items() if key not in owners or owners[key] == name}
    inputs = {relative_id(p): digest(p) for p in files if p != ROOT/'config/build.json' and selected(p)}
    return content_key([config, inputs])

def file_proofs(paths):
    return {str(p): digest(p) for root in paths for p in (root.rglob('*') if root.is_dir() else [root]) if p.is_file()}


def resume_readback_only(published, expected, invalid, online_release, remote_main):
    attempted = bool(published.get('pushed_commit')) or published.get('status') in ('push_requested', 'push_result_unknown')
    bound = not invalid and published.get('release_id') and published['release_id'] == expected.get('release_id')
    if attempted and (not bound or published.get('automatic_rollback') or published.get('status', '').startswith('rollback')
                      or online_release != published['release_id'] and remote_main not in {published.get('requested_commit') or published.get('pushed_commit'), published.get('production_commit')}):
        raise ValueError('Previous publication needs recovery or main advanced; do not rebuild or publish')
    return bool(bound and (attempted or published['release_id'] == online_release))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name, default in zip(('typeset-root', 'baseline', 'legacy-site', 'run-root', 'asset-cache'),
                            ('typeset-out', 'baseline', 'legacy', 'update', 'asset-cache')):
        parser.add_argument('--' + name, type=Path, default=ROOT / '.publish' / default)
    parser.add_argument('--inventory', type=Path, default=HERE.parent/'.publish/inventory/screens.jsonl')
    parser.add_argument('--state-root', type=Path, help='Persistent ledger and complete page artifacts; defaults to the shared Git directory')
    parser.add_argument('--jobs', type=int, default=3)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--pages', nargs='+', help='Only replace and verify the selected page routes')
    for flag in ('changed', 'all'): mode.add_argument('--'+flag, action='store_true')
    for flag in ('resume', 'publish'): parser.add_argument('--'+flag, action='store_true')
    parser.add_argument('--full-upload', action='store_true', help='Explicitly prepare all OSS objects without a previous sealed manifest')
    args = parser.parse_args()
    if not (HERE/'check-site-ui.py').is_file():
        raise ValueError('The required UI checker is unavailable: '+str(HERE/'check-site-ui.py'))
    sys.path.insert(0, str(ROOT/'.publish/python-tools'))
    lock = json.loads((ROOT/'config/render.lock.json').read_text('utf8'))
    renderer.verify_lock(lock)
    run = args.run_root.resolve()
    run.mkdir(parents=True, exist_ok=True)
    common = subprocess.check_output(['git', '-C', str(ROOT), 'rev-parse', '--git-common-dir'], text=True).strip()
    durable = args.state_root.resolve() if args.state_root else (ROOT/common).resolve()/'typeset-state'
    durable.mkdir(parents=True, exist_ok=True)
    assets.CACHE = str(durable/'derived-assets')
    current = fingerprints(lock); state_path = run/'publication-state.json'
    ledger_path = durable/('published-page-fingerprints.json' if args.publish else 'page-fingerprints.json')
    previous = load_state(ledger_path)
    # Existing preparation recipes own the static inputs consumed by assembly.
    import importlib.util
    spec = importlib.util.spec_from_file_location('assembly_inputs', HERE/'prepare-creative-release.py')
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    spec = importlib.util.spec_from_file_location('acceptance_gate', HERE/'prepare-typeset-release.py')
    gate = importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)
    assembly_files = [Path(p) for p in module.recipe(ROOT/'config/build.json')[2]]
    assembly_files += [HERE/name for name in ('build-typeset-site.py', 'build-assembled-site.py', 'hybrid-release.py',
        'repair-release-navigation.py', 'prepare-live-ui.py', 'prepare-motion-release.py', 'public_page_contract.py', 'rule_original_contract.py',
        'audit-page-publication.py', 'update-live-release.py', 'prepare-rule-workbench-originals.py')]
    assembly_files += [p for folder in ('sources/navigation', 'sources/rules') for p in (ROOT/folder).rglob('*') if p.is_file()]
    assembly_files += [ROOT/'config/live-ui.json', ROOT/'config/panel-projects.json', ROOT/'config/assembled-rules-pin.json']
    assembly_files += [p for pattern in ('typeset-layout.*', 'b2-live*', 'typeset-measure.js', 'site-live-runtime.js',
        'typeset-live-display.js', 'live-*-ui.*', 'prepare-toc-consistency.py', 'toc-consistency.*', 'release_delta.py') for p in HERE.glob(pattern)]
    assembly_files += [ROOT/'app/computer-access-model.js']
    recipe = json.loads((ROOT/'config/build.json').read_text('utf8'))
    page_keys = {name: content_key([key, assembly_key(name, assembly_files, recipe), shell_key(name, args.legacy_site.resolve(), args.baseline.resolve(), module.hybrid)])
                 for name, key in current.items()}
    state = load_state(state_path) if args.resume else {}
    selected = args.pages or (sorted(current) if args.all or set(previous)-current.keys() else [p for p in current if previous.get(p) != page_keys[p]])
    rule_pages = {r['page'] for r in json.loads((ROOT/'config/assembled-rules-pin.json').read_text('utf8'))['excerpt_contract']['excerpts'].values()} | {'rules-home'}
    if set(selected) & rule_pages: selected = sorted(set(selected) | rule_pages)
    if state: selected = sorted(set(state['selected_pages']) | set(selected))
    if set(selected) - current.keys(): parser.error('Unknown site pages: ' + ', '.join(set(selected)-current.keys()))
    if not selected and state_path.is_file():
        last = json.loads(state_path.read_text('utf8'))
        outputs = [run/'generation'/name for name in ('dist','build-report.json','motion-geometry.json','typeset-out')] + [args.typeset_root, Path(last['baseline']), args.legacy_site]
        if last['stages']['generation'].get('outputs') != file_proofs(outputs): selected = sorted(current)
    if not selected: print('No page inputs changed; no generation or publication.', flush=True); return 0
    for name in set(current)-set(selected)-{'home'}:
        if not reuse_page(name, current[name], args.typeset_root, durable): selected.append(name)
    if set(selected) & rule_pages: selected = sorted(set(selected) | rule_pages)
    invalid = state.get('fingerprints') != page_keys or state.get('selected_pages') != selected
    state.update(schema='wly.typeset-publication.v1', selected_pages=selected, status='running', fingerprints=page_keys)
    state.setdefault('stages', {name: {'status': 'pending'} for name in ('inputs', 'generation', 'checks', 'publication', 'readback')})
    def save():
        temp = state_path.with_suffix('.tmp'); temp.write_text(json.dumps(state, ensure_ascii=False, indent=2)+'\n', encoding='utf8'); temp.replace(state_path)
    @contextmanager
    def phase(name, outputs):
        nonlocal invalid
        record = state['stages'][name]
        active = name == 'checks' or invalid or record['status'] != 'pass' or record.get('outputs') != file_proofs(outputs)
        if not active: yield False; return
        invalid = True; begin = time.monotonic(); record.update(status='running', failure=None, started_at_beijing=beijing_now()); save()
        try:
            yield True
            record.update(status='pass', outputs=file_proofs(outputs))
        except Exception as error:
            record.update(status='failed', failure=str(error)); raise
        finally:
            record.update(seconds=round(time.monotonic()-begin, 3), ended_at_beijing=beijing_now()); save()
    if args.resume:
        with urlopen('https://wly0829.cn/release-manifest.json', timeout=30) as response:
            state['remote_read_before_resume'] = re.search(r'"release_id"\s*:\s*"([a-f0-9]{64})"', response.read(2048).decode('utf8', 'replace'))[1]
        published = load_state(run/'publisher/publication-state.json')
        expected = load_state(ROOT/'site-release/release-manifest.json')
        remote_main = subprocess.check_output(['git', 'ls-remote', '--heads', 'origin', 'main'], text=True,
            env={**os.environ, 'GIT_TERMINAL_PROMPT': '0', 'GCM_INTERACTIVE': 'Never'}, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0)).split()[0]
        if resume_readback_only(published, expected, invalid, state['remote_read_before_resume'], remote_main):
            subprocess.run([sys.executable, str(HERE/'prepare-typeset-release.py'), 'readback', '--release',
                            str(ROOT/'site-release'), '--output', str(run/'resume-readback.json'), '--previous-report', str((ROOT/common).resolve()/'latest-typeset-readback.json')], check=True)
            if json.loads((run/'resume-readback.json').read_text('utf8'))['release_id'] != published['release_id']: raise ValueError('Interrupted publication was restored; prepare a new approved generation')
            subprocess.run([sys.executable, str(HERE/'check-site-ui.py'), '--root', str(run/'generation/dist'),
                '--output', str(run/'resume-ui.json'), '--pages', 'cockpit', '--chrome', lock['chrome']['path']], check=True, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
            state['stages']['checks']['resume_ui'] = {'path': str(run/'resume-ui.json'), 'sha256': digest(run/'resume-ui.json')}
            state['status'] = 'pass'; state['stages']['readback'].update(status='pass', outputs=file_proofs([run/'resume-readback.json'])); state['stages']['publication'].update(status='pass'); save()
            print('Existing publication read back; no repeat publication.'); return 0
    work = run/'generation'
    cache = run / 'browser-cache'
    cache.mkdir(exist_ok=True)
    environment = {**os.environ, 'TEMP': str(cache), 'TMP': str(cache), 'TMPDIR': str(cache), 'WLY_RENDER_CHROME': lock['chrome']['path'], 'TYPESET_INVENTORY_OUT': str(args.inventory.parent), 'WLY_RENDER_PAGES': json.dumps(selected),
                   'PYTHONPATH': os.pathsep.join([lock['python_tools'], os.environ.get('PYTHONPATH', '')])}
    stages = []
    state['operations'] = stages
    started = time.monotonic()
    native = [p for p in selected if p != 'home'] or ['how']; selection = ['--pages', *native]
    snapshot = work / 'input-snapshot'
    project = bool(set(native) & rule_pages)
    inventory = work/'projection/projected-inventory.jsonl' if project else snapshot/'typeset-inventory/screens.jsonl'
    report = work / 'build-report.json'
    verification = work / 'verification.json'
    plan_path = run/'reading-plan.json'
    reading_path = run/'reading.json'
    ui_path = run/'ui-verification.json'
    geometry = work / 'motion-geometry.json'
    baseline = Path(state['baseline']) if state.get('baseline') else args.baseline.resolve() if args.all or not (run/'current-site').is_dir() else run/'current-site'

    def execute(script, parameters, allow_failure=False):
        phase = Path(script).stem
        if script == 'run-typeset-checks.py':
            phase += '-' + parameters[parameters.index('--mode') + 1]
        begin = time.monotonic()
        began_at = beijing_now()
        command = [sys.executable, '-u', str(HERE / script), *map(str, parameters)]
        if script == 'run-typeset-checks.py': command += ['--chrome', lock['chrome']['path']]
        print('Stage: ' + phase, flush=True)
        with (run / (phase + '.log')).open('w', encoding='utf8') as log:
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                       text=True, encoding='utf8', errors='replace', env=environment,
                                       creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
            try:
                for line in process.stdout:
                    print(line.rstrip(), flush=True)
                    log.write(line)
                    log.flush()
                code = process.wait()
            finally:
                if process.poll() is None:
                    process.terminate()
                    process.wait(timeout=15)
        stages.append({'stage': phase, 'exit_code': code, 'seconds': round(time.monotonic() - begin, 3),
                       'started_at_beijing': began_at, 'ended_at_beijing': beijing_now()}); save()
        if code and not allow_failure:
            raise RuntimeError(phase + ' failed; see the retained log')
        return code

    @contextmanager
    def preview(root, phase):
        log_path = run / (phase + '-server.log')
        with log_path.open('w', encoding='utf8') as log:
            process = subprocess.Popen([sys.executable, '-u', str(HERE / 'serve-typeset-preview.py'),
                '--root', str(root), '--build-report', str(report), '--verification-out', str(verification),
                '--port', '0', '--typeset-root', str(work / 'typeset-out'),
                '--geometry-out', str(geometry), '--legacy-site', str(args.legacy_site.resolve())],
                stdout=log, stderr=subprocess.STDOUT, env=environment,
                creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
            try:
                deadline = time.monotonic() + 30
                while time.monotonic() < deadline:
                    if process.poll() is not None:
                        raise RuntimeError('Preview server stopped: ' + str(log_path))
                    match = re.search(r'http://127\.0\.0\.1:\d+', log_path.read_text('utf8'))
                    if match:
                        address = match[0]
                        try:
                            with urlopen(address + '/__typeset/measure', timeout=2) as response:
                                if response.status == 200:
                                    break
                        except OSError:
                            pass
                    time.sleep(.1)
                else:
                    raise TimeoutError('Preview server readiness timeout')
                print('Task preview: ' + address + ' PID ' + str(process.pid), flush=True)
                yield address
            finally:
                if process.poll() is None:
                    process.terminate()
                    try:
                        process.wait(timeout=15)
                    except subprocess.TimeoutExpired:
                        process.kill()
                        process.wait()

    result = {'schema': 'wly.typeset-local-run.v1', 'status': 'running', 'stages': stages,
              'snapshot': str(snapshot), 'run_root': str(run), 'publication_executed': False}
    try:
        with phase('inputs', [run/'input-plan.json']) as active:
            if active:
                if baseline == run/'current-site': baseline = Path(shutil.move(baseline, run/('retained-site-'+str(time.time_ns()))))
                state['baseline'] = str(baseline); (run/'input-plan.json').write_text(json.dumps(current, sort_keys=True), encoding='utf8')
        with phase('generation', [work/'dist', report, geometry, work/'typeset-out', args.typeset_root, baseline, args.legacy_site]) as active:
            if active:
                if work.exists(): shutil.move(work, run/('retained-'+str(time.time_ns())))
                work.mkdir()
                from playwright.sync_api import sync_playwright
                with sync_playwright() as runtime:
                    browser = runtime.chromium.launch(executable_path=lock['chrome']['path'], headless=True, args=lock['args'])
                    rendered_pages = []
                    for name in native:
                        if not args.all and reuse_page(name, current[name], args.typeset_root, durable):
                            print('Reused complete page: '+name, flush=True); continue
                        if (args.typeset_root/name).exists(): recycle_owned(args.typeset_root/name)
                        rendered = renderer.render_page(name, do_compare=False, out_root=str(args.typeset_root), browser=browser); print('Rendered: '+name, flush=True)
                        if rendered['failed'] or rendered['incomplete']: raise ValueError('Renderer failed: ' + name)
                        rendered_pages.append(name)
                    browser.close()
                execute('inventory.py', [])
                execute('snapshot-typeset-inputs.py', ['--typeset-root', args.typeset_root.resolve(), '--producer-root', ROOT/'src/typeset',
                    '--inventory', args.inventory.resolve(), '--output', snapshot, '--pages', *sorted(set(current)-{'home'})])
                if project:
                    execute('prepare-rule-public-projection.py', ['--typeset-root', snapshot/'typeset-out', '--page-root', snapshot/'sources',
                        '--engine-root', snapshot/'typeset-proto', '--inventory', snapshot/'typeset-inventory/screens.jsonl', '--output', work/'projection'])
                shutil.copytree(snapshot/'typeset-out', work/'typeset-out')
                if project:
                    for name in rule_pages: shutil.copytree(work/'projection'/name, work/'typeset-out'/name, dirs_exist_ok=True)
                    shutil.copyfile(work/'projection/rule-public-projection.json', work/'typeset-out/rule-public-projection.json')
                shutil.copyfile(snapshot/'snapshot.json', work/'snapshot.json')
                shutil.copytree(snapshot/'typeset-proto', work/'typeset-proto')
                shutil.copytree(snapshot/'typeset-inventory', work/'typeset-inventory'); shutil.copyfile(inventory, work/'typeset-inventory/screens.jsonl')
                if (run/'current-geometry.json').is_file(): shutil.copyfile(run/'current-geometry.json', geometry)
                with preview(baseline, 'geometry') as address:
                    execute('run-typeset-checks.py', ['--mode', 'geometry', '--url', address,
                        '--task-cache', cache, '--timeout', '1200', *selection])
                execute('build-typeset-site.py', ['--typeset-root', work/'typeset-out', '--inventory', inventory,
                    '--geometry', geometry, '--baseline', baseline, '--legacy-site', args.legacy_site.resolve(), '--asset-cache', args.asset_cache.resolve(),
                    '--reuse-asset-cache', '--output', work/'dist', '--report', report, '--creative-preparation', ROOT/'config/build.json',
                    '--live-ui-preparation', ROOT/'config/live-ui.json', *selection] + (['--rule-public-projection', work/'typeset-out/rule-public-projection.json'] if project else []))
                if fingerprints(lock) != current: raise ValueError('Inputs changed during generation; rerun to invalidate dependent stages')
                current_recipe = json.loads((ROOT/'config/build.json').read_text('utf8'))
                if any(page_keys[name] != content_key([key, assembly_key(name, assembly_files, current_recipe),
                        shell_key(name, args.legacy_site.resolve(), args.baseline.resolve(), module.hybrid)]) for name, key in current.items()):
                    raise ValueError('Assembly inputs changed during generation')
                for name in rendered_pages: store_page(name, current[name], args.typeset_root, durable)
        with phase('checks', [verification, run/'content-report.json', plan_path, reading_path, ui_path]) as active:
            if active:
                with preview(work/'dist', 'qa') as address:
                    execute('run-typeset-checks.py', ['--mode', 'qa', '--url', address, '--task-cache', cache,
                        '--timeout', '1800', '--jobs', str(args.jobs), *selection])
                proof = json.loads(verification.read_text('utf8'))
                if proof['summary']['failed'] or proof['summary']['unverified']: raise ValueError('Browser verification failed')
                manifest = load_state(work/'dist/release-manifest.json')
                plan = gate.acceptance_plan(load_state(report), manifest, work/'dist')
                if digest(work/'dist/release-manifest.json') != plan['manifest_sha256']: raise ValueError('Candidate manifest changed before UI checking')
                execute('check-site-ui.py', ['--root', work/'dist', '--output', ui_path, '--geometry', geometry,
                    '--chrome', lock['chrome']['path'], '--pages', *plan['ui_pages']])
                if digest(work/'dist/release-manifest.json') != plan['manifest_sha256']: raise ValueError('Candidate manifest changed during UI checking')
                ui = load_state(ui_path)
                ui['candidate_manifest_sha256'] = plan['manifest_sha256']
                ui_path.write_text(json.dumps(ui, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
                plan.update(source_build_report_sha256=digest(report), ui_verification={'path': str(ui_path), 'sha256': digest(ui_path)})
                plan_path.write_text(json.dumps(plan, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
                execute('check-typeset-reading.py', ['--root', work/'dist', '--build-report', plan_path,
                    '--cache', cache, '--out', reading_path, '--chrome', lock['chrome']['path']])
                gate.browser_acceptance(plan_path, reading_path, report, work/'dist', manifest)
                budget=work/'oss-budget'
                if budget.exists(): recycle_owned(budget)
                oss_options = ['--full-upload'] if args.full_upload else ['--previous-manifest', ROOT/'site-release/release-manifest.json']
                execute('prepare-oss-release.py', ['prepare', '--source', work/'dist', '--asset-base-url', json.loads((ROOT/'config/build.json').read_text('utf8'))['asset_base_url'], '--prefix', 'releases/'+proof['release_id'], '--output', budget, *oss_options])
                execute('hybrid-release.py', ['verify', '--output', work/'dist', '--content-report', run/'content-report.json', '--oss-preparation', budget])
        with phase('publication', [run/'publisher/publication-state.json'] if args.publish else []) as active:
            if active and args.publish:
                options = json.loads((ROOT/'.publish/publication-options.json').read_text('utf8'))
                if (run/'publisher').exists(): shutil.move(run/'publisher', run/('retained-publisher-'+str(time.time_ns())))
                paths = dict(zip(('TypesetRoot','Inventory','Geometry','Baseline','Release','BuildReport','Verification','LegacySite',
                    'CreativePreparation','LiveUiPreparation','RulePublicProjection'), map(str, (work/'typeset-out', inventory,
                    geometry, baseline, work/'dist', report, verification, args.legacy_site, ROOT/'config/build.json', ROOT/'config/live-ui.json', work/'typeset-out/rule-public-projection.json'))))
                if not project: paths.pop('RulePublicProjection')
                paths.update(options.pop('paths', {}))
                paths.update(RuntimeVerification=str(reading_path), ReadingPlan=str(plan_path))
                (run/'pages.txt').write_text('\n'.join(native), encoding='utf8')
                (run/'batch.json').write_text(json.dumps({'schema':'wly.typeset-batch.v1', 'page_list':'pages.txt', 'paths':paths}), encoding='utf8')
                command = ['pwsh', '-NoProfile', '-File', str(HERE/'Publish-Pages.ps1'), '-Batch', str(run/'batch.json'), '-RunRoot', str(run/'publisher'), '-Publish']
                for key, value in options.items(): command += ['-'+key, str(value)]
                subprocess.run(command, check=True, env=environment); result['publication_executed'] = True
        with phase('readback', [run/'online-readback.json'] if args.publish else []) as active:
            if active and args.publish:
                previous_report = load_state(run/'publisher/publication-state.json')['readback']['report']
                execute('prepare-typeset-release.py', ['readback', '--release', ROOT/'site-release', '--output', run/'online-readback.json', '--previous-report', previous_report])
        if not args.publish:
            for name in ('publication','readback'): state['stages'][name].update(status='skipped', reason='Publication not requested')
        if (run/'current-site').exists(): shutil.move(run/'current-site', run/('retained-site-'+str(time.time_ns())))
        shutil.copytree(work/'dist', run/'current-site', copy_function=builder.copy_release_asset); shutil.copyfile(geometry, run/'current-geometry.json')
        previous.update({p: page_keys[p] for p in selected})
        temp = ledger_path.with_suffix('.tmp'); temp.write_text(json.dumps(previous, sort_keys=True), encoding='utf8'); temp.replace(ledger_path)
        if args.publish: (durable/'page-fingerprints.json').write_bytes(ledger_path.read_bytes())
        state['status'] = result['status'] = 'pass'; save()
    except Exception as error:
        state['status'] = result['status'] = 'error'; save()
        result['error'] = str(error)
    finally:
        result['seconds'] = round(time.monotonic() - started, 3)
        result['completed_at_beijing'] = datetime.now(timezone(timedelta(hours=8))).isoformat()
        (run / 'local-run.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print(json.dumps(result, ensure_ascii=False), flush=True)
    return 0 if result['status'] == 'pass' else 2


if __name__ == '__main__':
    raise SystemExit(main())

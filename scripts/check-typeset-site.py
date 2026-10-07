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

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
spec = importlib.util.spec_from_file_location('release_asset_builder', HERE/'build-assembled-site.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
sys.path.insert(0, str(ROOT / 'src/typeset'))
from engine import render as renderer, assets

def digest(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def load_state(path): return json.loads(path.read_text('utf8')) if path.is_file() else {}

def fingerprints(lock):
    shared = [p for folder in ('src', 'scripts', 'config', 'sources/creative', 'sources/bird',
              'sources/living', 'sources/navigation', 'sources/rules', 'sources/signature', 'sources/assets/_library/icons')
              for p in (ROOT / folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.name != 'quality-baseline.json']
    shared += list((ROOT/'sources/assets').glob('*.json'))
    assets._manifest = None
    for row in [lock['chrome'], *lock['fonts']]:
        if digest(row['path']) != row['sha256']:
            raise ValueError('Locked rendering dependency changed: ' + row['path'])
    shared_hash = hashlib.sha256(''.join(str(p)+digest(p) for p in sorted(shared)).encode()).hexdigest()
    library = assets.manifest(); hashed = {}; result = {'home': shared_hash}
    for name, source in renderer.page_sources().items():
        page = json.loads(Path(source).read_text('utf8'))
        if not page.get('url') and name != '404': continue
        layout = ROOT / 'sources/pages' / name / 'layout.json'
        files = {Path(source), layout}; rows = [r for s in page['screens'] for r in library.get(s['id'], [])]
        for literal in re.findall(r'"(?:\\.|[^"\\])*"', json.dumps([page, json.loads(layout.read_text('utf8')), rows], ensure_ascii=False)):
            value = json.loads(literal)
            if not re.search(r'[/\\]|^proto:|\.[a-zA-Z0-9]{1,6}$', value): continue
            p = ROOT/'src/typeset/assets'/(value[6:] if value[6:].endswith('.png') else value[6:]+'.png') if value.startswith('proto:') else Path(assets.local_path(value))
            if not p.is_absolute(): p = Path(assets.ASSET_ROOT) / p
            if p.resolve().is_relative_to(ROOT) and p.is_file(): files.add(p.resolve())
        for p in sorted(files):
            if p not in hashed: hashed[p] = digest(p)
        result[name] = hashlib.sha256((shared_hash + json.dumps(rows, sort_keys=True, ensure_ascii=False)
                       + ''.join(str(p)+hashed[p] for p in sorted(files))).encode()).hexdigest()
    return result

def file_proofs(paths):
    return {str(p): digest(p) for root in paths for p in (root.rglob('*') if root.is_dir() else [root]) if p.is_file()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name, default in zip(('typeset-root', 'baseline', 'legacy-site', 'run-root', 'asset-cache'),
                            ('typeset-out', 'baseline', 'legacy', 'update', 'asset-cache')):
        parser.add_argument('--' + name, type=Path, default=ROOT / '.publish' / default)
    parser.add_argument('--inventory', type=Path, default=HERE.parent/'.publish/inventory/screens.jsonl')
    parser.add_argument('--jobs', type=int, default=3)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--pages', nargs='+', help='Only replace and verify the selected page routes')
    for flag in ('changed', 'all'): mode.add_argument('--'+flag, action='store_true')
    for flag in ('resume', 'publish'): parser.add_argument('--'+flag, action='store_true')
    args = parser.parse_args()
    run = args.run_root.resolve()
    run.mkdir(parents=True, exist_ok=True)
    lock = json.loads((ROOT/'config/render.lock.json').read_text('utf8'))
    current = fingerprints(lock); state_path = run/'publication-state.json'; ledger_path = run/'page-fingerprints.json'
    previous = load_state(ledger_path)
    state = load_state(state_path) if args.resume else {}
    selected = args.pages or (sorted(current) if args.all or set(previous)-current.keys() else [p for p in current if previous.get(p) != current[p]])
    rule_pages = {r['page'] for r in json.loads((ROOT/'config/assembled-rules-pin.json').read_text('utf8'))['excerpt_contract']['excerpts'].values()} | {'rules-home'}
    if set(selected) & rule_pages: selected = sorted(set(selected) | rule_pages)
    if state: selected = sorted(set(state['selected_pages']) | set(selected))
    if set(selected) - current.keys(): parser.error('Unknown site pages: ' + ', '.join(set(selected)-current.keys()))
    if not selected and state_path.is_file():
        last = json.loads(state_path.read_text('utf8'))
        outputs = [run/'generation'/name for name in ('dist','build-report.json','motion-geometry.json','typeset-out')] + [args.typeset_root, Path(last['baseline']), args.legacy_site]
        if last['stages']['generation'].get('outputs') != file_proofs(outputs): selected = sorted(current)
    if not selected: print('No page inputs changed; no generation or publication.', flush=True); return 0
    invalid = state.get('fingerprints') != current
    state.update(schema='wly.typeset-publication.v1', selected_pages=selected, status='running', fingerprints=current)
    state.setdefault('stages', {name: {'status': 'pending'} for name in ('inputs', 'generation', 'checks', 'publication', 'readback')})
    def save():
        temp = state_path.with_suffix('.tmp'); temp.write_text(json.dumps(state, ensure_ascii=False, indent=2)+'\n', encoding='utf8'); temp.replace(state_path)
    @contextmanager
    def phase(name, outputs):
        nonlocal invalid
        record = state['stages'][name]
        active = invalid or record['status'] != 'pass' or record.get('outputs') != file_proofs(outputs)
        if not active: yield False; return
        invalid = True; begin = time.monotonic(); record.update(status='running', failure=None); save()
        try:
            yield True
            record.update(status='pass', outputs=file_proofs(outputs))
        except Exception as error:
            record.update(status='failed', failure=str(error)); raise
        finally:
            record['seconds'] = round(time.monotonic()-begin, 3); save()
    if args.resume:
        with urlopen('https://wly0829.cn/release-manifest.json', timeout=30) as response:
            state['remote_read_before_resume'] = re.search(r'"release_id"\s*:\s*"([a-f0-9]{64})"', response.read(2048).decode('utf8', 'replace'))[1]
        published = load_state(run/'publisher/publication-state.json')
        expected = load_state(run/'generation/dist/release-manifest.json')
        if not invalid and published.get('release_id') == expected.get('release_id') and published.get('release_id') and (published.get('pushed_commit') or published.get('status') == 'push_requested' or published['release_id'] == state['remote_read_before_resume']):
            subprocess.run([sys.executable, str(HERE/'prepare-typeset-release.py'), 'readback', '--release',
                            str(ROOT/'site-release'), '--output', str(run/'resume-readback.json')], check=True)
            if json.loads((run/'resume-readback.json').read_text('utf8'))['release_id'] != published['release_id']: raise ValueError('Interrupted publication was restored; prepare a new approved generation')
            state['status'] = 'pass'; state['stages']['readback'].update(status='pass', outputs=file_proofs([run/'resume-readback.json'])); state['stages']['publication'].update(status='pass'); save()
            print('Existing publication read back; no repeat publication.'); return 0
    work = run/'generation'
    cache = run / 'browser-cache'
    cache.mkdir(exist_ok=True)
    environment = {**os.environ, 'TEMP': str(cache), 'TMP': str(cache), 'TMPDIR': str(cache), 'WLY_RENDER_CHROME': lock['chrome']['path'], 'TYPESET_INVENTORY_OUT': str(args.inventory.parent), 'WLY_RENDER_PAGES': json.dumps(selected),
                   'PYTHONPATH': os.pathsep.join([str(ROOT/'.publish/python-tools'), os.environ.get('PYTHONPATH', '')])}
    stages = []
    started = time.monotonic()
    native = [p for p in selected if p != 'home'] or ['how']; selection = ['--pages', *native]
    snapshot = work / 'input-snapshot'
    project = bool(set(native) & rule_pages)
    inventory = work/'projection/projected-inventory.jsonl' if project else snapshot/'typeset-inventory/screens.jsonl'
    report = work / 'build-report.json'
    verification = work / 'verification.json'
    geometry = work / 'motion-geometry.json'
    baseline = Path(state['baseline']) if state.get('baseline') else args.baseline.resolve() if args.all or not (run/'current-site').is_dir() else run/'current-site'

    def execute(script, parameters, allow_failure=False):
        phase = Path(script).stem
        if script == 'run-typeset-checks.py':
            phase += '-' + parameters[parameters.index('--mode') + 1]
        begin = time.monotonic()
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
        stages.append({'stage': phase, 'exit_code': code, 'seconds': round(time.monotonic() - begin, 3)})
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
                    for name in native:
                        rendered = renderer.render_page(name, do_compare=False, out_root=str(args.typeset_root), browser=browser); print('Rendered: '+name, flush=True)
                        if rendered['failed'] or rendered['incomplete']: raise ValueError('Renderer failed: ' + name)
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
        with phase('checks', [verification, run/'content-report.json']) as active:
            if active:
                with preview(work/'dist', 'qa') as address:
                    execute('run-typeset-checks.py', ['--mode', 'qa', '--url', address, '--task-cache', cache,
                        '--timeout', '1800', '--jobs', str(args.jobs), *selection])
                proof = json.loads(verification.read_text('utf8'))
                if proof['summary']['failed'] or proof['summary']['unverified']: raise ValueError('Browser verification failed')
                budget=work/'oss-budget';execute('prepare-oss-release.py', ['prepare', '--source', work/'dist', '--asset-base-url', json.loads((ROOT/'config/build.json').read_text('utf8'))['asset_base_url'], '--prefix', 'releases/'+proof['release_id'], '--output', budget])
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
                (run/'pages.txt').write_text('\n'.join(native), encoding='utf8')
                (run/'batch.json').write_text(json.dumps({'schema':'wly.typeset-batch.v1', 'page_list':'pages.txt', 'paths':paths}), encoding='utf8')
                command = ['pwsh', '-NoProfile', '-File', str(HERE/'Publish-Pages.ps1'), '-Batch', str(run/'batch.json'), '-RunRoot', str(run/'publisher'), '-Publish']
                for key, value in options.items(): command += ['-'+key, str(value)]
                subprocess.run(command, check=True, env=environment); result['publication_executed'] = True
        with phase('readback', [run/'online-readback.json'] if args.publish else []) as active:
            if active and args.publish:
                execute('prepare-typeset-release.py', ['readback', '--release', ROOT/'site-release', '--output', run/'online-readback.json'])
        if not args.publish:
            for name in ('publication','readback'): state['stages'][name].update(status='skipped', reason='Publication not requested')
        if (run/'current-site').exists(): shutil.move(run/'current-site', run/('retained-site-'+str(time.time_ns())))
        shutil.copytree(work/'dist', run/'current-site', copy_function=builder.copy_release_asset); shutil.copyfile(geometry, run/'current-geometry.json')
        previous.update({p: current[p] for p in selected})
        temp = ledger_path.with_suffix('.tmp'); temp.write_text(json.dumps(previous, sort_keys=True), encoding='utf8'); temp.replace(ledger_path)
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

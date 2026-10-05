"""Freeze, measure, build and check a local typeset batch with one command.

Uses the installed Chrome with an isolated headless profile. Never publishes.
Outputs and failed evidence are retained for review and later recycling.
"""
import argparse
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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('typeset-root', 'baseline', 'legacy-site', 'run-root', 'asset-cache'):
        parser.add_argument('--' + name, type=Path, required=True)
    parser.add_argument('--inventory', type=Path, default=HERE.parent/'.publish/inventory/screens.jsonl')
    parser.add_argument('--snapshot', type=Path, help='Reuse an already frozen input snapshot; otherwise capture a fresh one')
    parser.add_argument('--jobs', type=int, default=3)
    parser.add_argument('--pages', nargs='+', help='Only replace and verify the selected page routes')
    args = parser.parse_args()
    run = args.run_root.resolve()
    if run.exists():
        raise ValueError('Choose a fresh run-root so previous evidence remains intact')
    run.mkdir(parents=True)
    cache = run / 'browser-cache'
    cache.mkdir()
    environment = {**os.environ, 'TEMP': str(cache), 'TMP': str(cache), 'TMPDIR': str(cache)}
    stages = []
    started = time.monotonic()
    selection = ['--pages', *args.pages] if args.pages else []
    report = run / 'build-report.json'
    verification = run / 'verification.json'
    snapshot = args.snapshot.resolve() if args.snapshot else run / 'input-snapshot'
    geometry = run / 'motion-geometry.json'

    def execute(script, parameters, allow_failure=False):
        phase = Path(script).stem
        if script == 'run-typeset-checks.py':
            phase += '-' + parameters[parameters.index('--mode') + 1]
        begin = time.monotonic()
        command = [sys.executable, '-u', str(HERE / script), *map(str, parameters)]
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
                '--port', '0', '--typeset-root', str(snapshot / 'typeset-out'),
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
        if not args.snapshot:
            execute('snapshot-typeset-inputs.py', ['--typeset-root', args.typeset_root.resolve(),
                '--inventory', args.inventory.resolve(), '--output', snapshot, *selection])
        if json.loads((snapshot / 'snapshot.json').read_text('utf8'))['status'] != 'pass':
            raise ValueError('Snapshot is not stable')
        if (snapshot / 'motion-geometry.json').is_file():
            shutil.copyfile(snapshot / 'motion-geometry.json', geometry)
        with preview(args.baseline.resolve(), 'geometry') as address:
            # Unresolved source mismatches remain in geometry and become build blockers.
            execute('run-typeset-checks.py', ['--mode', 'geometry', '--url', address,
                '--task-cache', cache, '--timeout', '1200', *selection], allow_failure=True)
        execute('build-typeset-site.py', ['--typeset-root', snapshot / 'typeset-out',
            '--inventory', snapshot / 'typeset-inventory/screens.jsonl', '--geometry', geometry,
            '--baseline', args.baseline.resolve(), '--legacy-site', args.legacy_site.resolve(),
            '--asset-cache', args.asset_cache.resolve(), '--output', run / 'dist', '--report', report, *selection])
        with preview(run / 'dist', 'qa') as address:
            execute('run-typeset-checks.py', ['--mode', 'qa', '--url', address, '--task-cache', cache,
                '--timeout', '1800', '--jobs', str(args.jobs), *selection], allow_failure=True)
        if not verification.is_file():
            raise RuntimeError('No browser verification was saved')
        proof = json.loads(verification.read_text('utf8'))
        result['summary'] = proof['summary']
        content_code = execute('hybrid-release.py', ['verify', '--output', run / 'dist',
            '--content-report', run / 'content-report.json'], allow_failure=True)
        execute('prepare-typeset-release.py', ['prepare', '--typeset-root', snapshot / 'typeset-out',
            '--inventory', snapshot / 'typeset-inventory/screens.jsonl', '--geometry', geometry,
            '--baseline', args.baseline.resolve(), '--baseline-manifest', args.baseline.resolve() / 'release-manifest.json',
            '--release', run / 'dist', '--build-report', report, '--verification', verification,
            '--output', run / 'publication-preparation.json', *selection], allow_failure=True)
        preparation = json.loads((run / 'publication-preparation.json').read_text('utf8'))
        result['publication_readiness'] = {'status': preparation['status'],
            'blockers': len(preparation.get('blockers', [])), 'report': str(run / 'publication-preparation.json')}
        result['status'] = 'pass' if not proof['summary']['failed'] and not proof['summary']['unverified'] and not content_code else 'fail'
    except Exception as error:
        result['status'] = 'error'
        result['error'] = str(error)
    finally:
        result['seconds'] = round(time.monotonic() - started, 3)
        result['completed_at_beijing'] = datetime.now(timezone(timedelta(hours=8))).isoformat()
        (run / 'local-run.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print(json.dumps(result, ensure_ascii=False), flush=True)
    return 0 if result['status'] == 'pass' else 2


if __name__ == '__main__':
    raise SystemExit(main())

"""有界小回归：两份隔离静态、两段24格定格录像、一份真实独占性能。

只校准工具并发与回收；不代替任何一幅画的480格艺术验收。
"""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time

import common


def worker(args):
    import browser
    original = browser.launch
    def marked(*a, **kw):
        br = original(*a, **kw)
        marker = Path(args.marker)
        marker.write_text(json.dumps(dict(br._living_scope)), encoding='utf-8')
        if args.peer:
            deadline = time.monotonic() + 60
            while not Path(args.peer).exists():
                if time.monotonic() >= deadline:
                    br.close()
                    raise RuntimeError('并发校准另一份定格未入场')
                time.sleep(0.05)
        return br
    browser.launch = marked
    if args.worker == 'record':
        import record
        record.record(args.art, args.art, 'h', seconds=0.4)
    elif args.worker == 'static':
        import check
        rep = check.run(args.art, args.art, 'h', stage='static')
        print(check.summary(rep), flush=True)
        if not rep['acceptance']['passed']:
            raise SystemExit(1)
    else:
        import check
        rep = check.run(args.art, args.art, 'h', stage='performance', category='white-single')
        print(check.summary(rep), flush=True)
        if not rep['acceptance']['passed']:
            raise SystemExit(1)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--worker', choices=['static', 'record', 'performance'])
    ap.add_argument('--art')
    ap.add_argument('--marker')
    ap.add_argument('--peer')
    args = ap.parse_args()
    if args.worker:
        worker(args)
        return
    root = common.ENGINE / 'work' / 'throughput'
    root.mkdir(parents=True, exist_ok=True)
    runroot = root / ('calibration-' + time.strftime('%Y%m%d-%H%M%S'))
    runroot.mkdir()
    artroot = runroot / 'art'
    shutil.copytree(common.SRC, runroot / 'src')
    arts = ('localocr', 'computer-access')
    for art in arts:
        shutil.copytree(common.ART / art, artroot / art,
                        ignore=shutil.ignore_patterns('preview', 'check', 'shots', 'video', 'work', '__pycache__'))
    env = os.environ.copy()
    env.update(LIVING_ART_ROOT=str(artroot), LIVING_SRC_ROOT=str(runroot / 'src'),
               LIVING_DIST_ROOT=str(runroot / 'dist'), PYTHONUNBUFFERED='1')
    script = str(Path(__file__).resolve())
    children = []
    def start(kind, art, peer=None):
        marker = runroot / f'{kind}-{art}-acquired.json'
        log = runroot / f'{kind}-{art}.log'
        stream = log.open('w', encoding='utf-8')
        cmd = [sys.executable, script, '--worker', kind, '--art', art, '--marker', str(marker)]
        if peer:
            cmd.extend(('--peer', str(peer)))
        process = subprocess.Popen(cmd, env=env, stdout=stream, stderr=subprocess.STDOUT,
                                   creationflags=subprocess.CREATE_NO_WINDOW)
        job = {'kind': kind, 'art': art, 'process': process, 'stream': stream, 'marker': marker, 'log': log}
        children.append(job)
        return job
    def wait(job):
        code = job['process'].wait(timeout=300)
        job['stream'].close()
        return {'kind': job['kind'], 'art': job['art'], 'exit_code': code, 'log': str(job['log'])}
    result = {'at_beijing': common.beijing_now(), 'scope': 'tool-calibration-only-24-seek-frames',
              'category': 'white-background-representatives-not-art-final-acceptance', 'jobs': [], 'artifact_root': str(runroot)}
    begun = time.monotonic()
    try:
        static_jobs = [start('static', art) for art in arts]
        result['jobs'].extend(wait(j) for j in static_jobs)
        records = [start('record', art, runroot / f'record-{arts[1-i]}-acquired.json') for i, art in enumerate(arts)]
        deadline = time.monotonic() + 120
        while not all(j['marker'].exists() for j in records):
            if time.monotonic() >= deadline or any(j['process'].poll() is not None for j in records):
                raise RuntimeError('两份定格未同时入场，见真实日志')
            time.sleep(0.1)
        performance = start('performance', arts[1])
        result['jobs'].extend(wait(j) for j in records)
        result['jobs'].append(wait(performance))
        proofs = [json.loads((artroot / art / 'video' / f'{art}-h-record.json').read_text(encoding='utf-8')) for art in arts]
        scopes = [r['resources']['gpu_scope'] for r in proofs]
        overlap = min(s['released_monotonic'] for s in scopes) - max(s['acquired_monotonic'] for s in scopes)
        result.update(records=proofs, record_overlap_seconds=round(overlap, 4))
        perf = json.loads((artroot / arts[1] / 'check' / f'{arts[1]}-h-performance.json').read_text(encoding='utf-8'))
        exclusive_start = perf['performance']['lock']['acquired_monotonic']
        result.update(records=proofs, record_overlap_seconds=round(overlap, 4),
                      performance_started_after_all_records_closed=exclusive_start >= max(s['released_monotonic'] for s in scopes),
                      performance=perf['performance'], performance_resources=perf.get('resources_performance'),
                      guard_proof_path=str(artroot / arts[1] / 'check' / f'{arts[1]}-h-performance.json'))
        result['tool_checks'] = {'record_concurrency': overlap > 0,
            'performance_exclusive': result['performance_started_after_all_records_closed'],
            'performance_actual_passed': all(perf['performance']['checks'].values()),
            'cleanup': all(r['resources']['http_closed'] and r['resources']['mutex_release_succeeded'] for r in proofs)
                and perf['resources_performance']['http_closed'] and perf['resources_performance']['mutex_release_succeeded']}
        result['passed'] = (overlap > 0 and result['performance_started_after_all_records_closed']
                            and all(j['exit_code'] == 0 for j in result['jobs'])
                            and all(r['resources']['http_closed'] and r['resources']['mutex_release_succeeded'] for r in proofs)
                            and perf['resources_performance']['http_closed'] and perf['resources_performance']['mutex_release_succeeded'])
    except Exception as error:
        result['passed'] = False
        result['error'] = str(error)
    finally:
        for job in children:
            if job['process'].poll() is None:
                job['process'].terminate()
                try:
                    job['process'].wait(timeout=15)
                except subprocess.TimeoutExpired:
                    job['process'].kill()
                    job['process'].wait()
            if not job['stream'].closed:
                job['stream'].close()
        result['wall_seconds'] = round(time.monotonic() - begun, 3)
        report = root / 'report.json'
        if report.exists():
            (root / ('prior-' + runroot.name + '.json')).write_bytes(report.read_bytes())
        report.write_text(json.dumps(result, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(root / 'report.json', '通过' if result['passed'] else '未过', flush=True)
    if not result['passed']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()

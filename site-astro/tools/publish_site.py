"""Publish only changed OSS assets and Pages documents; dry-run never writes online."""
import argparse
import base64
import hashlib
import importlib.util
import json
import shutil
import ssl
import subprocess
import time
from http.client import IncompleteRead, RemoteDisconnected
from types import SimpleNamespace
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
ORIGIN = 'https://wly0829.cn'
REPO = 'repos/wlyaaaaa/wly0829.cn'
CLI = r'E:\Tools\aliyun-cli\aliyun.exe'
LOCK = r'E:\.agents\tools\Invoke-ShortLock.ps1'

def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/(name+'.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

oss, retention = load('prepare-oss-release'), load('oss-retention')

def command(*args, timeout=None):
    done = subprocess.run([str(x) for x in args], cwd=ROOT, text=True, encoding='utf8', timeout=timeout,
                          capture_output=True, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    if done.returncode:
        raise subprocess.CalledProcessError(done.returncode, done.args, done.stdout, done.stderr)
    return done.stdout.strip()

RETRY_DELAYS = (0.5, 1, 2, 2, 2, 2, 2, 2)  # 连接层错误最多重试 8 次；内容核对不一致、HTTP 状态和其他错误一律不重试
HEAD_TIMEOUT, PAGE_TIMEOUT, GH_TIMEOUT, GIT_TIMEOUT, PUSH_TIMEOUT = 8, 15, 60, 120, 600
GIT_NET = ('-c', 'http.lowSpeedLimit=1000', '-c', 'http.lowSpeedTime=30')
CONNECTION_MARKERS = ('schannel', 'ssl', 'tls', 'handshake', 'eof', 'connection reset', 'connection was reset',
                      'connection was aborted', 'connection refused', 'timed out', 'timeout', 'could not resolve',
                      'failed to connect', 'remote end hung up', 'unexpected disconnect', 'error connecting to')

def retrying(function, connection_error):
    for delay in (*RETRY_DELAYS, None):
        try:
            return function()
        except Exception as error:
            if delay is None or not connection_error(error):
                raise
            time.sleep(delay)

def connection_level(error, url_read=False):
    if isinstance(error, HTTPError):
        return False
    if isinstance(error, URLError) and isinstance(error.reason, OSError) and error.reason.errno == 2:
        error = error.reason
    if isinstance(error, (URLError, ConnectionError, TimeoutError, ssl.SSLError,
                          RemoteDisconnected, IncompleteRead, subprocess.TimeoutExpired)):
        return True
    if url_read and isinstance(error, OSError) and error.errno == 2 and error.filename is None:
        return True
    if isinstance(error, subprocess.CalledProcessError):
        text = ((error.stderr or '')+(error.output or '')).lower()
        return any(marker in text for marker in CONNECTION_MARKERS)
    return False

def net(*args, timeout=None):
    run = (lambda: command(*args)) if timeout is None else (lambda: command(*args, timeout=timeout))
    return retrying(run, connection_level)

retention.command = lambda *args: (net(*args, timeout=GH_TIMEOUT) if args[0] in ('git', 'gh')
                                  else command(*args, timeout=120))  # 删除失败须先回读，不能按网络错误重放写操作

def delta(current, previous):
    previous = {**{row.get('key', rel): row for rel, row in previous.items()}, **previous}
    return {rel: row for rel, row in current.items()
            if rel != oss.MANIFEST and (row['sha256'] != (old := previous.get(rel, previous.get(row.get('key'), {}))).get('sha256')
                                       or row.get('key') != old.get('key'))}

def head(item, root):
    rel, row = item
    with (root/rel).open('rb') as stream:
        md5 = hashlib.file_digest(stream, 'md5').hexdigest()
    request = Request(row['url'], method='HEAD', headers={
        'Origin': ORIGIN, 'Referer': ORIGIN+'/', 'Accept-Encoding': 'identity'})
    def fetch():
        with urlopen(request, timeout=HEAD_TIMEOUT) as response:
            return response.status, dict(response.headers.items())
    status, headers = retrying(fetch, lambda error: connection_level(error, url_read=True))
    passed = status == 200 and int(headers.get('Content-Length', -1)) == row['bytes']
    passed &= (headers.get('ETag', '').strip('"').lower() == md5 or
               headers.get('Content-MD5') == base64.b64encode(bytes.fromhex(md5)).decode())
    if not passed:
        raise ValueError('Uploaded object HEAD differs: '+rel)
    return rel, {'status': 'pass', 'http': 200, 'bytes': row['bytes'],
                 'sha256': row['sha256'], 'local_md5': md5, 'headers': headers}

def get_page(item):
    rel, row = item
    route = '/'+rel[:-10] if rel.endswith('index.html') else '/'+rel
    request = Request(ORIGIN+oss.quote(route, safe='/')+'?publish='+row['sha256'][:16],
                      headers={'Accept-Encoding': 'identity', 'Cache-Control': 'no-cache'})
    def fetch():
        with urlopen(request, timeout=PAGE_TIMEOUT) as response:
            if response.status != 200:
                raise ValueError('Public HTML GET is not 200: '+rel)
            return response.status, hashlib.file_digest(response, 'sha256').hexdigest()
    status, digest = retrying(fetch, lambda error: connection_level(error, url_read=True))
    if status != 200 or digest != row['sha256']:
        raise ValueError('Public HTML GET differs: '+rel)
    return rel, {'status': 'pass', 'http': 200, 'sha256': digest}

def pages(commit, timeout):
    deadline = time.monotonic()+timeout
    repository = REPO.removeprefix('repos/')
    dispatched = net('gh', 'workflow', 'run', 'pages.yml', '--repo', repository,
                         '--ref', 'main', '-f', 'sha='+commit, timeout=min(GH_TIMEOUT, timeout))
    match = oss.re.fullmatch(r'https://github.com/'+oss.re.escape(repository)+r'/actions/runs/([0-9]+)', dispatched)
    if not match:
        raise ValueError('Pages dispatch returned no run id; deployment is unconfirmed for '+commit)
    run_id = int(match[1])
    last_error = ''
    while time.monotonic() < deadline:
        try:
            run = json.loads(command('gh', 'run', 'view', str(run_id), '--repo', repository,
                                     '--json', 'status,conclusion', timeout=min(GH_TIMEOUT, deadline-time.monotonic())))
        except Exception as error:
            if not connection_level(error):
                raise
            last_error = (error.stderr or error.output or str(error)) if isinstance(error, subprocess.CalledProcessError) else str(error)
            time.sleep(min(2, max(0, deadline-time.monotonic())))
            continue
        if run['status'] == 'completed':
            if run['conclusion'] != 'success':
                raise ValueError('Pages run '+str(run_id)+' failed: '+str(run['conclusion']))
            return run_id
        time.sleep(min(2, max(0, deadline-time.monotonic())))
    raise TimeoutError('Pages run '+str(run_id)+' success is unconfirmed for '+commit+
                       ('; last connection error: '+last_error if last_error else ''))

def artifact_commit(dist, plan, output, source_commit):
    destination = output/'site-dist'
    destination.mkdir()
    def git(*args):
        return command('git', '-C', destination, *args)
    git('init', '-b', 'site-dist')
    git('config', 'core.autocrlf', 'false')
    git('config', 'core.quotepath', 'false')
    git('config', 'user.name', 'Site publisher')
    git('config', 'user.email', 'site-publisher@users.noreply.github.com')
    git('remote', 'add', 'origin', 'https://github.com/wlyaaaaa/wly0829.cn.git')
    remote = net('git', *GIT_NET, '-C', destination, 'ls-remote', 'origin', 'refs/heads/site-dist', timeout=GIT_TIMEOUT)
    if remote:
        net('git', *GIT_NET, '-C', destination, 'fetch', '--depth=1', 'origin', 'site-dist', timeout=GIT_TIMEOUT)
        git('checkout', '-B', 'site-dist', 'FETCH_HEAD')
    for rel in git('ls-files').splitlines():
        if rel not in {*plan['github_files'], 'release-identity.json'}:
            (destination/rel).unlink()
    for rel, row in plan['github_files'].items():
        target = destination/rel
        if not target.exists() or oss.digest(target) != row['sha256']:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(dist/rel, target)
    git('add', '--all')
    changed = git('diff', '--cached', '--name-only').splitlines()
    for line in git('ls-files', '-s').splitlines():
        metadata, rel = line.split('\t', 1)
        payload = (destination/rel).read_bytes()
        if metadata.split()[1] != hashlib.sha1(b'blob '+str(len(payload)).encode()+b'\0'+payload).hexdigest():
            raise ValueError('Git changed artifact bytes: '+rel)
    git('commit', '--allow-empty', '-m', 'Publish '+plan['release_id']+' from source '+source_commit)
    return {'root': str(destination), 'commit': git('rev-parse', 'HEAD'),
            'parent': git('rev-list', '--parents', '-n', '1', 'HEAD').split()[1:], 'changed_files': changed}

def publish(args):
    started = time.monotonic()
    output = (args.output or args.dist.parent/('publish-'+str(time.time_ns()))).resolve()
    output.mkdir(parents=True, exist_ok=False)
    receipt = {'schema': 'wly.publish-receipt.v1', 'status': 'running', 'dry_run': args.dry_run,
               'started_at_beijing': oss.stamp(), 'steps_seconds': {}, 'uploaded_files': 0,
               'uploaded_bytes': 0, 'head': {}, 'get': {}}
    owned = False

    def step(name, function):
        before = time.monotonic()
        try:
            return function()
        finally:
            receipt['steps_seconds'][name] = round(time.monotonic()-before, 3)

    try:
        source = oss.read(args.dist/oss.MANIFEST)
        if not source.get('finalized_dist'):
            raise ValueError('Run prepare-oss-release.py finalize-dist --dist '+str(args.dist)+' then scan that final dist')
        oss.verify_manifest(source, require_remote=False)
        fingerprints = step('hash_dist', lambda: {path.relative_to(args.dist).as_posix(): oss.digest(path)
                            for path in sorted(args.dist.rglob('*')) if path.is_file()})
        scan = oss.read(getattr(args, 'scan_result', None) or args.dist.parent/'scan-glance'/'scan-result.json')
        scanned = scan.get('dist_files_sha256', {})
        changed = sorted(rel for rel in fingerprints.keys() | scanned.keys() if fingerprints.get(rel) != scanned.get(rel))
        if changed or (not args.dry_run and scan.get('failures') != []):
            raise ValueError('Dist differs from successful scan: '+(', '.join(changed) if changed else 'scan has failures'))
        previous = step('previous_manifest', lambda: oss.verify_manifest(oss.read(args.previous_manifest))
                        if args.previous_manifest else retention.predecessor())
        build = oss.read(args.dist/'.build-receipt.json') if (args.dist/'.build-receipt.json').is_file() else {}
        source_commit = args.source_commit or build.get('source_commit') or source.get('source_commit') or 'Unknown'
        if source_commit != 'Unknown' and not oss.re.fullmatch('[a-f0-9]{40}', source_commit):
            raise ValueError('source-commit must be an exact source SHA, or Unknown')
        receipt['source_commit'] = source_commit
        receipt['source_commit_evidence'] = ('explicit task baseline' if args.source_commit else
                'build receipt' if build.get('source_commit') else 'source manifest' if source.get('source_commit') else 'Unknown')
        preparation = output
        plan = {'schema': 'wly.oss-release-plan.v1', 'release_id': source['release_id'], 'asset_base_url': retention.BASE,
                'test_only': False, 'remote_verified': False, 'objects': source['oss']['objects'],
                'github_files': {rel: {'bytes': (args.dist/rel).stat().st_size, 'sha256': fingerprints[rel]}
                                 for rel in fingerprints if rel not in source['oss']['objects']},
                'retained_objects': dict(source['oss'].get('retained_objects', {})), 'reference_keys': source['oss']['reference_keys']}
        assets = delta(plan['objects'], (previous or {}).get('oss', {}).get('objects', {}))
        if previous:
            proofs = {row['key']: previous['oss']['verification']['objects'][rel] for rel, row in previous['oss']['objects'].items()}
            plan['retained_objects'].update({rel: proofs[row['key']] for rel, row in plan['objects'].items() if rel not in assets and row['key'] in proofs})
            oss.write(output/'previous-publication.json', previous)
            plan['previous_publication_sha256'] = oss.digest(output/'previous-publication.json')
        oss.write(output/oss.PLAN, plan)
        documents = delta(plan['github_files'], (previous or {}).get('files', {}))
        receipt['planned_assets'] = list(assets)
        receipt['planned_documents'] = list(documents)
        receipt['planned_files'] = len(assets)+len(documents)+1
        receipt['planned_bytes'] = sum(row['bytes'] for row in [*assets.values(), *documents.values()])+plan['github_files'][oss.MANIFEST]['bytes']
        receipt['estimated_transfer_seconds'] = round(receipt['planned_bytes']/10_000_000, 3)
        receipt['estimate_bytes_per_second'] = 10_000_000
        if args.dry_run:
            receipt['site_dist'] = step('local_site_dist_commit', lambda:
                    artifact_commit(args.dist, plan, output, source_commit))
            receipt['status'] = 'dry_run'
            return receipt
        claim = json.loads(command('pwsh', '-NoProfile', '-File', LOCK, '-Mode', 'Acquire',
                        '-Name', 'wly0829-publication', '-Holder', args.lock_holder,
                        '-Minutes', '30', '-Reason', 'Incremental website publication', '-Json'))
        if claim.get('status') not in ('acquired', 'renewed'):
            raise ValueError('Cannot acquire publication lock')
        owned = claim['status'] == 'acquired'
        step('pin', lambda: retention.pin(preparation))

        def renew_lock():
            claim = json.loads(command('pwsh', '-NoProfile', '-File', LOCK, '-Mode', 'Acquire',
                            '-Name', 'wly0829-publication', '-Holder', args.lock_holder,
                            '-Minutes', '30', '-Reason', 'Incremental website publication', '-Json'))
            if claim.get('status') not in ('acquired', 'renewed'):
                raise ValueError('Cannot renew publication lock')

        def upload_one(item):
            rel, row = item
            try:  # 续传：对象已在且大小、MD5 一致就不重传，这次检查即为它的回读证明；不在或不一致都重新上传
                return rel, row, False, head(item, args.dist)[1]
            except Exception:
                pass
            net(CLI, 'ossutil', 'cp', args.dist/rel,
                    'oss://'+retention.BUCKET+'/'+row['key'], '--profile', 'website-images',
                    '--region', 'cn-shanghai', '--endpoint', 'oss-cn-shanghai.aliyuncs.com',
                    '--force', '--no-progress', '--loglevel', 'off', '--acl', 'default',
                    '--content-type', row['content_type'], '--bigfile-threshold', '5G',
                    '--cache-control', 'public,max-age=31536000,immutable', timeout=300)
            return rel, row, True, head(item, args.dist)[1]  # 新传的对象传完立即单独回读

        def upload():
            receipt['upload_workers'] = args.upload_workers
            receipt['reused_existing_files'] = 0
            with ThreadPoolExecutor(max_workers=args.upload_workers) as pool:
                for done, (rel, row, sent, proof) in enumerate(pool.map(upload_one, assets.items()), 1):
                    receipt['head'][rel] = proof
                    if sent:
                        receipt['uploaded_files'] += 1
                        receipt['uploaded_bytes'] += row['bytes']
                    else:
                        receipt['reused_existing_files'] += 1
                    if done % 500 == 0:
                        renew_lock()

        step('upload_assets', upload)
        renew_lock()
        def verify_heads():  # 两遍合一：只补查还没有回读证明的对象；推 site-dist 前每个对象都必须有通过的证明
            missing = {rel: row for rel, row in assets.items() if receipt['head'].get(rel, {}).get('status') != 'pass'}
            with ThreadPoolExecutor(max_workers=args.upload_workers) as pool:
                for rel, proof in pool.map(lambda item: head(item, args.dist), missing.items()):
                    receipt['head'][rel] = proof
            unproven = [rel for rel in assets if receipt['head'].get(rel, {}).get('status') != 'pass']
            if unproven:
                raise ValueError('Objects lack a passing readback: '+', '.join(unproven[:20]))
        step('head_uploaded', verify_heads)
        if args.upload_only:  # 先传先回读、不切公网；本人点头后再完整运行，已传对象按续传检查复用
            receipt['status'] = 'uploaded_only'
            return receipt
        renew_lock()
        manifest = dict(source)
        manifest['oss']['verification'] = {'schema': 'wly.oss-incremental-verification.v1',
            'release_id': plan['release_id'], 'complete': True, 'verified_at_beijing': oss.stamp(),
            'method': 'uploaded HEAD size and MD5; unchanged retained receipts',
            'objects': {**plan['retained_objects'], **receipt['head']}}

        receipt['site_dist'] = step('local_site_dist_commit', lambda:
                artifact_commit(args.dist, plan, output, source_commit))
        receipt['commit'] = receipt['site_dist']['commit']
        step('push_site_dist', lambda: net('git', *GIT_NET, '-C', receipt['site_dist']['root'],
                                              'push', 'origin', 'HEAD:refs/heads/site-dist', timeout=PUSH_TIMEOUT))
        receipt['uploaded_files'] += len(receipt['site_dist']['changed_files'])
        receipt['uploaded_bytes'] += sum((Path(receipt['site_dist']['root'])/rel).stat().st_size
                                         for rel in receipt['site_dist']['changed_files']
                                         if (Path(receipt['site_dist']['root'])/rel).is_file())
        receipt['deployment'] = step('pages', lambda: pages(receipt['commit'], args.pages_timeout))
        selected = {rel: plan['github_files'][rel] for rel in
                    {'index.html', 'cockpit/index.html', 'computer-access/index.html'} |
                    {rel for rel in documents if rel.endswith('.html')}}
        def verify_pages():
            with ThreadPoolExecutor(max_workers=8) as pool:
                for rel, proof in pool.map(get_page, selected.items()):
                    receipt['get'][rel] = proof
        step('get_key_and_changed_pages', verify_pages)
        step('successful_manifest_last', lambda: retention.write(retention.shared()/'published.json', {
            'schema': 'wly.site-publication.v1', 'commit': receipt['commit'], 'deployment': receipt['deployment'],
            'source_commit': source_commit,
            'manifest': manifest, 'readback': receipt['get'], 'verified_at_beijing': oss.stamp()}))
        receipt['status'] = 'published'
        receipt['publication_status'] = 'published'
        if getattr(args, 'skip_retention', False):
            receipt['oss_retention'] = {'status': 'skipped_by_request', 'deleted_objects': 0, 'deleted_bytes': 0}
            return receipt
        report = output/'oss-retention.json'
        try:
            renew_lock()
            # Bind the actual HEAD proofs to this immutable plan before its pin is retired.
            verification = {**manifest['oss']['verification'], 'plan_sha256': retention.digest(output/oss.PLAN)}
            step('retention_proofs', lambda: retention.write(output/'remote-verification.json', verification))
            step('retention_inventory', lambda: retention.pin(preparation))
            code = step('oss_retirement', lambda: retention.collect(SimpleNamespace(
                preparation=preparation, commit=receipt['commit'], rollback=manifest.get('rollback_ref'),
                cli=CLI, profile='website-images', lock_holder=args.lock_holder, report=report,
                dry_run=False, max_keys=getattr(args, 'retention_max_keys', 1000))))
            receipt['oss_retention'] = retention.read(report)
            if code:
                receipt['status'] = 'published_with_retention_incomplete'
        except Exception as error:
            receipt['oss_retention'] = retention.read(report) if report.exists() else {
                'status': 'incomplete', 'deleted_objects': None, 'deleted_bytes': None}
            receipt['oss_retention'].update(status='incomplete', reason=str(error))
            retention.write(report, receipt['oss_retention'])
            receipt['status'] = 'published_with_retention_incomplete'
        return receipt
    except Exception as error:
        receipt.update(status='failed', error=str(error))
        raise
    finally:
        receipt['total_seconds'] = round(time.monotonic()-started, 3)
        receipt['completed_at_beijing'] = oss.stamp()
        oss.write(output/'publish-receipt.json', receipt)
        if owned:
            command('pwsh', '-NoProfile', '-File', LOCK, '-Mode', 'Release',
                    '-Name', 'wly0829-publication', '-Holder', args.lock_holder, '-Json')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', type=Path, required=True)
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--upload-only', action='store_true', help='upload and read back OSS assets, then stop before site-dist and Pages')
    parser.add_argument('--scan-result', type=Path)
    parser.add_argument('--previous-manifest', type=Path)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--source-commit')
    parser.add_argument('--pages-timeout', type=int, default=600)
    parser.add_argument('--upload-workers', type=int, default=12, help='parallel OSS uploads; existing identical objects are skipped')
    parser.add_argument('--retention-max-keys', type=int, default=1000, help='maximum exact obsolete managed keys checked after successful publication')
    parser.add_argument('--skip-retention', action='store_true', help='publish without deleting existing OSS objects when the task excludes cloud cleanup')
    parser.add_argument('--lock-holder', default='codex:publish:'+ROOT.parent.name)
    options = parser.parse_args()
    result = publish(options)
    print(json.dumps({key: value for key, value in result.items() if key not in ('planned_assets', 'planned_documents', 'head', 'get')}, ensure_ascii=False))
    if result['status'] == 'published_with_retention_incomplete':
        raise SystemExit(1)

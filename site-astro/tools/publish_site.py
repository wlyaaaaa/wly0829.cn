"""Publish only changed OSS assets and Pages documents; dry-run never writes online."""
import argparse
import base64
import hashlib
import importlib.util
import json
import shutil
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
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
    return subprocess.check_output([str(x) for x in args], cwd=ROOT, text=True, encoding='utf8', timeout=timeout, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0)).strip()

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
    with urlopen(request, timeout=30) as response:
        passed = response.status == 200 and int(response.headers.get('Content-Length', -1)) == row['bytes']
        passed &= (response.headers.get('ETag', '').strip('"').lower() == md5 or
                   response.headers.get('Content-MD5') == base64.b64encode(bytes.fromhex(md5)).decode())
        if not passed:
            raise ValueError('Uploaded object HEAD differs: '+rel)
    return rel, {'status': 'pass', 'http': 200, 'bytes': row['bytes'],
                 'sha256': row['sha256'], 'local_md5': md5, 'headers': dict(response.headers.items())}

def get_page(item):
    rel, row = item
    route = '/'+rel[:-10] if rel.endswith('index.html') else '/'+rel
    request = Request(ORIGIN+oss.quote(route, safe='/')+'?publish='+row['sha256'][:16],
                      headers={'Accept-Encoding': 'identity', 'Cache-Control': 'no-cache'})
    with urlopen(request, timeout=30) as response:
        digest = hashlib.file_digest(response, 'sha256').hexdigest()
        if response.status != 200 or digest != row['sha256']:
            raise ValueError('Public HTML GET differs: '+rel)
    return rel, {'status': 'pass', 'http': 200, 'sha256': digest}

def pages(commit, timeout):
    deadline = time.monotonic()+timeout
    repository = REPO.removeprefix('repos/')
    dispatched = command('gh', 'workflow', 'run', 'pages.yml', '--repo', repository,
                         '--ref', 'main', '-f', 'sha='+commit, timeout=timeout)
    match = oss.re.fullmatch(r'https://github.com/'+oss.re.escape(repository)+r'/actions/runs/([0-9]+)', dispatched)
    if not match:
        raise ValueError('Pages dispatch returned no run id; deployment is unconfirmed for '+commit)
    run_id = int(match[1])
    while time.monotonic() < deadline:
        run = json.loads(command('gh', 'run', 'view', str(run_id), '--repo', repository,
                                 '--json', 'status,conclusion', timeout=deadline-time.monotonic()))
        if run['status'] == 'completed':
            if run['conclusion'] != 'success':
                raise ValueError('Pages run '+str(run_id)+' failed: '+str(run['conclusion']))
            return run_id
        time.sleep(min(2, max(0, deadline-time.monotonic())))
    raise TimeoutError('Pages run '+str(run_id)+' success is unconfirmed for '+commit)

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
    remote = git('ls-remote', 'origin', 'refs/heads/site-dist')
    if remote:
        git('fetch', '--depth=1', 'origin', 'site-dist')
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

        def upload():
            for rel, row in assets.items():
                command(CLI, 'ossutil', 'cp', args.dist/rel,
                        'oss://'+retention.BUCKET+'/'+row['key'], '--profile', 'website-images',
                        '--region', 'cn-shanghai', '--endpoint', 'oss-cn-shanghai.aliyuncs.com',
                        '--force', '--no-progress', '--loglevel', 'off', '--acl', 'default',
                        '--content-type', row['content_type'], '--bigfile-threshold', '5G',
                        '--cache-control', 'public,max-age=31536000,immutable')
                receipt['uploaded_files'] += 1
                receipt['uploaded_bytes'] += row['bytes']

        step('upload_assets', upload)
        def verify_heads():
            with ThreadPoolExecutor(max_workers=8) as pool:
                for rel, proof in pool.map(lambda item: head(item, args.dist), assets.items()):
                    receipt['head'][rel] = proof
        step('head_uploaded', verify_heads)
        manifest = dict(source)
        manifest['oss']['verification'] = {'schema': 'wly.oss-incremental-verification.v1',
            'release_id': plan['release_id'], 'complete': True, 'verified_at_beijing': oss.stamp(),
            'method': 'uploaded HEAD size and MD5; unchanged retained receipts',
            'objects': {**plan['retained_objects'], **receipt['head']}}

        receipt['site_dist'] = step('local_site_dist_commit', lambda:
                artifact_commit(args.dist, plan, output, source_commit))
        receipt['commit'] = receipt['site_dist']['commit']
        step('push_site_dist', lambda: command('git', '-C', receipt['site_dist']['root'],
                                              'push', 'origin', 'HEAD:refs/heads/site-dist'))
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
            'manifest': manifest, 'readback': receipt['get'], 'verified_at_beijing': oss.stamp()}))
        receipt['status'] = 'published'
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
    parser.add_argument('--scan-result', type=Path)
    parser.add_argument('--previous-manifest', type=Path)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--source-commit')
    parser.add_argument('--pages-timeout', type=int, default=600)
    parser.add_argument('--lock-holder', default='codex:publish:'+ROOT.parent.name)
    options = parser.parse_args()
    result = publish(options)
    print(json.dumps({key: value for key, value in result.items() if key not in ('planned_assets', 'planned_documents', 'head', 'get')}, ensure_ascii=False))

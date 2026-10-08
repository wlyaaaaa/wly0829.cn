"""Keep current website and in-flight keys; collect verified generated objects."""
import argparse
import hashlib
import importlib.util
import json
import subprocess
import sys
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
BUCKET = 'wly0829-img-media-shanghai'
BASE = 'https://' + BUCKET + '.oss-cn-shanghai.aliyuncs.com'
LOCK = r'E:\.agents\tools\Invoke-ShortLock.ps1'


def command(*args):
    return subprocess.check_output(args, cwd=ROOT, text=True, encoding='utf-8').strip()


def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.writing')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
    temporary.replace(path)


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def shared():
    return Path(command('git', 'rev-parse', '--path-format=absolute', '--git-common-dir')) / 'wly-oss'


def manifest(ref):
    return json.loads(command('git', 'show', ref + ':site-release/release-manifest.json'))


def predecessor():
    deployments = json.loads(command('gh', 'api', 'repos/wlyaaaaa/wly0829.cn/deployments?environment=github-pages&per_page=10'))
    for deployment in deployments:
        statuses = json.loads(command('gh', 'api', 'repos/wlyaaaaa/wly0829.cn/deployments/' + str(deployment['id']) + '/statuses?per_page=1'))
        if statuses and statuses[0]['state'] == 'success':
            return manifest(deployment['sha'])
    if deployments:
        raise ValueError('No confirmed successful publication; supply its exact previous-manifest')
    return None


def require_lock(holder):
    locks = json.loads(command('pwsh', '-NoProfile', '-File', LOCK, '-Mode', 'Inspect', '-Name', 'wly0829-publication', '-Json'))
    active = [row for row in locks.get('locks', []) if row.get('active')]
    if len(active) != 1 or active[0]['holder'] != holder:
        raise ValueError('The exact wly0829-publication holder must own the active lock')


def plan_pin(preparation):
    preparation = Path(preparation).resolve()
    plan_path = preparation / 'oss-plan.json'
    plan = read(plan_path)
    if plan.get('schema') != 'wly.oss-release-plan.v1' or plan.get('test_only') or plan['asset_base_url'] != BASE:
        raise ValueError('Only the existing Shanghai website generation is authorized')
    objects = {row['key']: {'bytes': row['bytes'], 'sha256': row['sha256']} for row in plan['objects'].values()}
    if not objects or any(not key.startswith('releases/') for key in objects):
        raise ValueError('Invalid website object keys')
    pin_id = hashlib.sha256(str(preparation).encode('utf-8')).hexdigest()
    immutable = {key: value for key, value in plan.items() if key != 'remote_verified'}
    immutable['github_files'] = {key: value for key, value in plan['github_files'].items() if key != 'release-manifest.json'}
    identity = hashlib.sha256(json.dumps(immutable, sort_keys=True, separators=(',', ':')).encode('utf-8')).hexdigest()
    return shared() / 'pins' / (pin_id + '.json'), {'schema': 'wly.oss-pin.v1', 'bucket': BUCKET, 'plan': str(plan_path),
        'plan_sha256': digest(plan_path), 'identity_sha256': identity, 'release_id': plan['release_id'], 'objects': objects}, plan


def pin(preparation):
    path, value, plan = plan_pin(preparation)
    if path.exists() and read(path).get('identity_sha256') != value['identity_sha256']:
        raise ValueError('An existing in-flight plan changed; explicitly retire its previous pin')
    managed_path = shared() / 'managed.json'
    managed = read(managed_path) if managed_path.exists() else {'schema': 'wly.oss-managed.v1', 'bucket': BUCKET, 'objects': {}}
    if managed.get('schema') != 'wly.oss-managed.v1' or managed.get('bucket') != BUCKET:
        raise ValueError('Unknown managed inventory; no collection is permitted')
    receipt_path = Path(preparation) / 'remote-verification.json'
    receipt = read(receipt_path) if receipt_path.exists() else {}
    sealed = False
    if plan.get('remote_verified') is True:
        manifest_path = Path(preparation) / 'github' / 'release-manifest.json'
        published = read(manifest_path)
        spec = importlib.util.spec_from_file_location('oss_pin_contract', ROOT/'scripts/prepare-oss-release.py')
        contract = importlib.util.module_from_spec(spec); spec.loader.exec_module(contract)
        contract.verify_manifest(published)
        sealed = (published['oss']['verification'] == receipt and published['oss']['objects'] == plan['objects']
                  and digest(manifest_path) == plan['github_files']['release-manifest.json']['sha256'])
        if not sealed: raise ValueError('Sealed manifest does not bind this exact plan and receipt')
    verified = receipt.get('objects', {}) if sealed or receipt.get('plan_sha256') == value['plan_sha256'] else {}
    for rel, row in plan['objects'].items():
        item = value['objects'][row['key']]
        old = managed['objects'].get(row['key'])
        if old and any(old[field] != item[field] for field in ('bytes', 'sha256')):
            raise ValueError('An immutable managed key changed: ' + row['key'])
        proof = verified.get(rel, plan.get('retained_objects', {}).get(rel, {}))
        matches = proof.get('bytes') == item['bytes'] and proof.get('local_sha256', proof.get('sha256')) == item['sha256']
        etag = proof.get('headers', {}).get('ETag', '').strip('"') if proof.get('status') == 'pass' and matches else ''
        managed['objects'][row['key']] = {**item, 'etag': etag or (old or {}).get('etag', '')}
    write(managed_path, managed)
    write(path, value)
    return path


def versions(cli, profile):
    rows = {}; cursor = ''; seen = set()
    while True:
        args = [cli, 'oss', 'ls', 'oss://' + BUCKET + '/', '--profile', profile, '--endpoint', 'oss-cn-shanghai.aliyuncs.com',
                '--all-versions', '--cli-output', 'json', '--limited-num', '1000']
        page = json.loads(command(*(args + (['--cli-cursor', cursor] if cursor else []))))
        if page.get('schema_version') != '1' or type(page.get('complete')) is not bool or not isinstance(page.get('items'), list):
            raise ValueError('Unknown OSS schema or completion state')
        if type(page.get('returned')) is not int or page['returned'] != len(page['items']):
            raise ValueError('OSS returned count does not match its exact item list')
        for item in page['items']:
            rows.setdefault(item['key'], []).append(item)
        if page['complete']:
            return rows
        cursor = page.get('next_cursor')
        if not cursor or cursor in seen:
            raise ValueError('Incomplete or repeating OSS pagination')
        seen.add(cursor)


def collect(args):
    current = manifest(args.commit)
    if command('git', 'ls-remote', 'origin', 'refs/heads/main').split()[0] != args.commit:
        raise ValueError('Production main changed; collection is incomplete')
    if current['rollback_ref'] != args.rollback or current['oss']['asset_base_url'] != BASE:
        raise ValueError('Publication or rollback identity does not match the existing target')
    keep = {row['key'] for row in current['oss']['objects'].values()}
    write(shared() / 'published.json', {'commit': args.commit, 'rollback': args.rollback})
    own, own_value, _ = plan_pin(args.preparation)
    for path in (shared() / 'pins').glob('*.json'):
        value = read(path)
        if value.get('schema') != 'wly.oss-pin.v1' or value.get('bucket') != BUCKET or digest(value['plan']) != value['plan_sha256']:
            raise ValueError('Unknown or changed in-flight pin; collection is incomplete')
        if path == own and value['plan_sha256'] == own_value['plan_sha256'] and set(value['objects']) <= keep:
            path.unlink()
        else:
            keep.update(value['objects'])
    managed = read(shared() / 'managed.json')
    if managed.get('schema') != 'wly.oss-managed.v1' or managed.get('bucket') != BUCKET:
        raise ValueError('Unknown managed inventory; collection is incomplete')
    before = versions(args.cli, args.profile)
    candidates = sorted(set(managed['objects']) & set(before) - keep)
    targets, deferred = [], {}
    for key in candidates:
        rows = before[key]; item = rows[0]; proof = managed['objects'][key]
        if len(rows) != 1 or item['kind'] != 'version' or item['version_id'] != 'null' or item['is_latest'] is not True:
            deferred[key] = 'Unexpected object version; retained'
        elif item['size'] != proof['bytes'] or not proof['etag'] or item['etag'] != proof['etag']:
            deferred[key] = 'Missing or differing verification receipt; retained'
        else: targets.append(key)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    for start in range(0, len(targets), 1000):
        keys = targets[start:start + 1000]
        body = '<Delete><Quiet>false</Quiet>' + ''.join('<Object><Key>' + escape(key) + '</Key><VersionId>null</VersionId></Object>' for key in keys) + '</Delete>'
        batch = args.report.parent / ('oss-delete-' + str(start) + '.xml')
        batch.write_text(body, encoding='utf-8')
        require_lock(args.lock_holder)
        result = command(args.cli, 'ossutil', 'api', 'delete-multiple-objects', '--bucket', BUCKET, '--delete', 'file://' + str(batch).replace('\\', '/'),
                         '--profile', args.profile, '--region', 'cn-shanghai', '--endpoint', 'oss-cn-shanghai.aliyuncs.com')
        batch.with_suffix('.result.txt').write_text(result, encoding='utf-8')
    after = versions(args.cli, args.profile) if targets else before
    if set(targets) & set(after):
        raise ValueError('Some exact target keys remain; collection is incomplete')
    write(args.report, {'status': 'incomplete' if deferred else 'complete', 'deferred': deferred,
                        'deleted_objects': len(targets), 'deleted_bytes': sum(managed['objects'][key]['bytes'] for key in targets),
                        'retained_objects': len(keep & set(after)), 'bucket_objects': sum(len(rows) for rows in after.values()), 'bucket_bytes': sum(row.get('size', 0) for rows in after.values() for row in rows)})
    return 1 if deferred else 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('operation', choices=('pin', 'collect', 'retire'))
    for name in ('preparation', 'lock-holder', 'commit', 'rollback', 'cli', 'profile', 'pin-id', 'plan-sha256'):
        parser.add_argument('--' + name)
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    try:
        require_lock(args.lock_holder)
        if args.operation == 'pin':
            print(pin(args.preparation))
        elif args.operation == 'retire':
            if not args.pin_id or len(args.pin_id) != 64 or any(char not in '0123456789abcdef' for char in args.pin_id):
                raise ValueError('Select one exact registered pin ID')
            path = shared() / 'pins' / (args.pin_id + '.json')
            if read(path)['plan_sha256'] != args.plan_sha256:
                raise ValueError('The exact retired pin changed')
            path.unlink()
        else:
            return collect(args)
    except Exception as error:
        if args.report:
            write(args.report, {'status': 'incomplete', 'reason': str(error), 'deleted_objects': None, 'deleted_bytes': None})
        print(str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

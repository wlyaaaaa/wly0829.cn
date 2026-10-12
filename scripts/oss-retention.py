"""Keep current website and in-flight keys; collect verified generated objects."""
import argparse
import hashlib
import importlib.util
import json
import ssl
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from http.client import IncompleteRead, RemoteDisconnected
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
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
    return json.loads(command('gh', 'api', 'repos/wlyaaaaa/wly0829.cn/contents/release-manifest.json?ref='+ref,
                              '-H', 'Accept: application/vnd.github.raw+json'))


def public_read(name):
    request = Request('https://wly0829.cn/'+name, headers={'Cache-Control': 'no-cache'})
    for delay in (0.5, 1, 2, 2, 2, 2, 2, 2, None):
        try:
            with urlopen(request, timeout=30) as response:
                if response.status != 200:
                    raise ValueError('Current public '+name+' GET is not 200')
                return response.read()
        except HTTPError:
            raise
        except (URLError, ConnectionError, TimeoutError, ssl.SSLError, RemoteDisconnected, IncompleteRead) as error:
            reason = error.reason if isinstance(error, URLError) else error
            if delay is None or (isinstance(reason, OSError) and reason.errno == 2 and reason.filename is not None):
                raise
        except OSError as error:
            if delay is None or error.errno != 2 or error.filename is not None:
                raise
        time.sleep(delay)


def predecessor():
    deployments = json.loads(command('gh', 'api', 'repos/wlyaaaaa/wly0829.cn/deployments?environment=github-pages&per_page=10'))
    for deployment in deployments:
        statuses = json.loads(command('gh', 'api', 'repos/wlyaaaaa/wly0829.cn/deployments/' + str(deployment['id']) + '/statuses?per_page=1'))
        if statuses and statuses[0]['state'] == 'success':
            payload = public_read('release-manifest.json')
            identity = json.loads(public_read('release-identity.json'))
            current = json.loads(payload)
            if identity.get('release_id') != current.get('release_id') or identity.get('manifest_sha256') != hashlib.sha256(payload).hexdigest():
                raise ValueError('Current public deployment identity is inconsistent')
            if current.get('finalized_dist'):
                saved_path = shared()/'published.json'
                saved = read(saved_path).get('manifest', {}) if saved_path.is_file() else {}
                if saved.get('release_id') != current['release_id']:
                    raise ValueError('Public finalized release lacks its same-release local HEAD verification')
                current['oss']['verification'] = oss_contract().verify_manifest(saved)['oss']['verification']
            return oss_contract().verify_manifest(current)
    local_manifest = ROOT / 'site-release' / 'release-manifest.json'
    if deployments or (shared() / 'published.json').exists() or (local_manifest.exists() and read(local_manifest).get('oss')):
        raise ValueError('No confirmed successful publication; supply its exact previous-manifest')
    return None


def oss_contract():
    spec = importlib.util.spec_from_file_location('oss_retention_contract', ROOT/'scripts/prepare-oss-release.py')
    contract = importlib.util.module_from_spec(spec); spec.loader.exec_module(contract)
    return contract


def rollback_keep(preparation, plan, commit=None, persist=True):
    """Freeze the confirmed predecessor; moving rollback refs never replace it."""
    path = shared() / 'rollback-retention.json'
    state = read(path) if path.exists() else {'schema': 'wly.oss-rollback-retention.v1', 'bucket': BUCKET, 'records': {}}
    if state.get('schema') != 'wly.oss-rollback-retention.v1' or state.get('bucket') != BUCKET:
        raise ValueError('Unknown rollback retention inventory; collection is incomplete')
    now = datetime.now(timezone.utc)
    snapshot_sha = plan.get('previous_publication_sha256')
    if snapshot_sha:
        snapshot = Path(preparation) / 'previous-publication.json'
        if digest(snapshot) != snapshot_sha:
            raise ValueError('Previous publication snapshot changed')
        previous = oss_contract().verify_manifest(read(snapshot))
        if previous['oss']['asset_base_url'] != BASE:
            raise ValueError('Previous publication belongs to another object target')
        objects = {row['key']: {'bytes': row['bytes'], 'sha256': row['sha256']} for row in previous['oss']['objects'].values()}
        for key in previous['oss'].get('reference_keys', []):
            objects.setdefault(key, {})
        record = state['records'].get(snapshot_sha)
        if record and record.get('objects', objects) != objects:
            raise ValueError('Frozen previous publication objects changed')
        if not record:
            record = {'release_id': previous['release_id'], 'objects': objects, 'expires_at': (now + timedelta(days=7)).isoformat()}
            state['records'][snapshot_sha] = record
        if commit and record.get('published_commit') != commit:
            record.update(published_commit=commit, objects=objects, expires_at=(now + timedelta(days=7)).isoformat())
    live = {key: row for key, row in state['records'].items() if datetime.fromisoformat(row['expires_at']) > now}
    for key, row in state['records'].items():
        if key not in live: row.pop('objects', None)
    if persist:
        write(path, state)
    return {key for row in live.values() for key in row['objects']}


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
    for key in plan.get('reference_keys', []):
        objects.setdefault(key, {})
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
        oss_contract().verify_manifest(published)
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
        etag = {name.lower(): value for name, value in proof.get('headers', {}).items()}.get('etag', '').strip('"') if proof.get('status') == 'pass' and matches else ''
        managed['objects'][row['key']] = {**item, 'etag': etag or (old or {}).get('etag', '')}
    rollback_keep(preparation, plan)
    write(managed_path, managed)
    write(path, value)
    return path


def versions(cli, profile, prefix=''):
    rows = {}; cursor = ''; seen = set()
    while True:
        args = [cli, 'oss', 'ls', 'oss://' + BUCKET + '/' + prefix, '--profile', profile, '--endpoint', 'oss-cn-shanghai.aliyuncs.com',
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


def exact_versions(cli, profile, keys):
    """A key is a provider prefix; filter adjacent names after complete pagination."""
    with ThreadPoolExecutor(max_workers=8) as pool:
        pages = pool.map(lambda key: (key, versions(cli, profile, key)), keys)
        return {key: page[key] for key, page in pages if key in page}


def collect(args):
    try:
        return collect_verified(args)
    except Exception as error:
        result = read(args.report) if args.report and args.report.exists() else {}
        if args.report:
            write(args.report, {**result, 'status': 'incomplete', 'reason': str(error),
                                'deleted_objects': result.get('deleted_objects'), 'deleted_bytes': result.get('deleted_bytes')})
        raise


def collect_verified(args):
    dry_run = getattr(args, 'dry_run', False)
    current = manifest(args.commit)
    if command('git', 'ls-remote', 'origin', 'refs/heads/site-dist').split()[0] != args.commit:
        raise ValueError('Production site-dist changed; collection is incomplete')
    if current['oss']['asset_base_url'] != BASE:
        raise ValueError('Publication or rollback identity does not match the existing target')
    if 'rollback_ref' in current:
        if current['rollback_ref'] != args.rollback:
            raise ValueError('The explicit rollback identity does not match the publication')
    elif (current.get('schema') != 'wly.hybrid-release.v1' or current.get('finalized_dist') is not True
          or args.rollback is not None):
        raise ValueError('Only the finalized hybrid contract may omit a named rollback reference')
    public = predecessor()
    if not public or public.get('release_id') != current.get('release_id'):
        raise ValueError('Current public production does not match the selected site-dist release')
    keep = {row['key'] for row in current['oss']['objects'].values()}
    keep.update(current['oss'].get('reference_keys', []))
    own, own_value, plan = plan_pin(args.preparation)
    if 'rollback_ref' not in current:
        snapshot_sha = plan.get('previous_publication_sha256', '')
        if (len(snapshot_sha) != 64 or any(char not in '0123456789abcdef' for char in snapshot_sha)
                or not (shared()/'rollback-retention.json').is_file()):
            raise ValueError('Finalized publication requires its frozen predecessor fingerprint and rollback inventory')
    rollback = rollback_keep(args.preparation, plan, args.commit, persist=not dry_run)
    keep.update(rollback)
    retired, pending = None, []
    for path in (shared() / 'pins').glob('*.json'):
        value = read(path)
        if value.get('schema') != 'wly.oss-pin.v1' or value.get('bucket') != BUCKET or digest(value['plan']) != value['plan_sha256']:
            raise ValueError('Unknown or changed in-flight pin; collection is incomplete')
        if (path == own and value['plan_sha256'] == own_value['plan_sha256'] and current.get('release_id')
                and value.get('release_id') == plan.get('release_id') == current['release_id']
                and set(value['objects']) <= keep):
            retired = path
        else:
            keep.update(value['objects'])
            pending.append({'pin_id': path.stem, 'plan_sha256': value['plan_sha256'], 'objects': len(value['objects'])})
    managed = read(shared() / 'managed.json')
    if managed.get('schema') != 'wly.oss-managed.v1' or managed.get('bucket') != BUCKET:
        raise ValueError('Unknown managed inventory; collection is incomplete')
    candidates = sorted(set(managed['objects']) - keep)
    targets, deferred = [], {}
    eligible = []
    for key in candidates:
        proof = managed['objects'][key]
        if not key.startswith('releases/'):
            deferred[key] = 'Outside the registered generated release scope; retained'
        else:
            eligible.append(key)
    budget = getattr(args, 'max_keys', 1000)
    if budget < 1:
        raise ValueError('Exact-key read budget must be positive')
    for key in eligible[budget:]:
        deferred[key] = 'Exact-key read budget reached; retained for the next on-demand update'
    inspected = eligible[:budget]
    before = exact_versions(args.cli, args.profile, inspected)
    absent = set(inspected) - set(before)
    for key in sorted(before):
        rows = before[key]; item = rows[0]; proof = managed['objects'][key]
        if len(rows) != 1 or item['kind'] != 'version' or item['version_id'] != 'null' or item['is_latest'] is not True:
            deferred[key] = 'Unexpected object version; retained'
        elif item['size'] != proof['bytes'] or not proof['etag'] or item['etag'] != proof['etag']:
            deferred[key] = 'Missing or differing verification receipt; retained'
        else: targets.append(key)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    result = {'schema': 'wly.oss-collection.v1', 'status': 'incomplete' if deferred else 'complete',
              'dry_run': dry_run, 'deferred': deferred, 'pending_pins': pending,
              'retired_pin': retired.stem if retired else None, 'candidate_objects': len(candidates),
              'inspected_objects': len(inspected), 'max_keys': budget, 'already_absent_objects': len(absent),
              'planned_keys': targets, 'deleted_objects': 0, 'deleted_bytes': 0,
              'rollback_retained_objects': len(rollback), 'retained_objects': len(keep)}
    write(args.report.with_name(args.report.stem+'-plan.json'), {**result, 'status': 'dry_run'})
    if dry_run:
        write(args.report, {**result, 'status': 'dry_run'})
        return 1 if deferred else 0
    if retired:
        require_lock(args.lock_holder)
        retired.unlink()
    baseline = {str(path): digest(path) for path in shared().rglob('*.json')}
    deleted = []
    for start in range(0, len(targets), 1000):
        keys = targets[start:start + 1000]
        require_lock(args.lock_holder)
        if baseline != {str(path): digest(path) for path in shared().rglob('*.json')}:
            raise ValueError('Retention inventory changed after the fresh collection plan')
        if command('git', 'ls-remote', 'origin', 'refs/heads/site-dist').split()[0] != args.commit:
            raise ValueError('Production site-dist changed after the fresh collection plan')
        fresh = exact_versions(args.cli, args.profile, keys)
        if fresh != {key: before[key] for key in keys}:
            raise ValueError('Exact object versions changed after the fresh collection plan')
        body = '<Delete><Quiet>false</Quiet>' + ''.join('<Object><Key>' + escape(key) + '</Key><VersionId>null</VersionId></Object>' for key in keys) + '</Delete>'
        batch = args.report.parent / ('oss-delete-' + str(start) + '.xml')
        batch.write_text(body, encoding='utf-8')
        require_lock(args.lock_holder)
        write(args.report, {**result, 'status': 'deleting', 'deleted_objects': None, 'deleted_bytes': None})
        response = command(args.cli, 'ossutil', 'api', 'delete-multiple-objects', '--bucket', BUCKET, '--delete', 'file://' + str(batch).replace('\\', '/'),
                         '--profile', args.profile, '--region', 'cn-shanghai', '--endpoint', 'oss-cn-shanghai.aliyuncs.com')
        batch.with_suffix('.result.txt').write_text(response, encoding='utf-8')
        after = exact_versions(args.cli, args.profile, keys)
        deleted.extend(key for key in keys if key not in after)
        for key in after:
            deferred[key] = 'Exact target remains after deletion; retained'
    result.update(status='incomplete' if deferred else 'complete', deferred=deferred,
                  deleted_objects=len(deleted), deleted_bytes=sum(managed['objects'][key]['bytes'] for key in deleted))
    for key in set(deleted) | absent:
        managed['objects'].pop(key)
    write(shared()/'managed.json', managed)
    write(args.report, result)
    return 1 if deferred else 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('operation', choices=('pin', 'collect', 'retire'))
    for name in ('preparation', 'lock-holder', 'commit', 'rollback', 'cli', 'profile', 'pin-id', 'plan-sha256'):
        parser.add_argument('--' + name)
    parser.add_argument('--report', type=Path)
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--max-keys', type=int, default=1000, help='maximum exact managed keys inspected per on-demand collection')
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
        if args.report and args.operation != 'collect':
            write(args.report, {'status': 'incomplete', 'reason': str(error), 'deleted_objects': None, 'deleted_bytes': None})
        print(str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

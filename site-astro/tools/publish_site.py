"""Publish only changed OSS assets and Pages documents; dry-run never writes online."""
import argparse
import base64
import hashlib
import html
import importlib.util
import json
import re
import shutil
import ssl
import stat
import subprocess
import sys
import time
from http.client import IncompleteRead, RemoteDisconnected
from types import SimpleNamespace
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
ORIGIN = 'https://wly0829.cn'
REPO = 'repos/wlyaaaaa/wly0829.cn'
CLI = r'E:\Tools\aliyun-cli\aliyun.exe'
LOCK = r'E:\.agents\tools\Invoke-ShortLock.ps1'
WORD_CONFIG = Path('E:/PCConfig/registries/site_public_words.json')
PUBLISH_RUNS = Path(r'E:\Cache\wly-site-build\publish-runs')
UNPUBLISHED_PREFIXES = ('live/_fixtures/',)

def prune_publish_runs(base=PUBLISH_RUNS, pointer=None):
    """Keep three newest receipts plus the currently published commit, after retention succeeds."""
    base = Path(base).resolve()
    if not base.is_dir():
        return {'kept': [], 'removed': []}
    pointer = pointer or retention.shared()/'published.json'
    current = retention.read(pointer).get('commit') if Path(pointer).is_file() else None
    runs = sorted((p for p in base.glob('publish-*') if p.is_dir() and not p.is_symlink()
                   and p.name.removeprefix('publish-').isdigit()),
                  key=lambda p: int(p.name.removeprefix('publish-')), reverse=True)
    keep = set(runs[:3])
    for path in runs:
        receipt = path/'publish-receipt.json'
        if current and receipt.is_file() and retention.read(receipt).get('commit') == current:
            keep.add(path)
    removed = []
    def remove_readonly(function, target, error):
        target = Path(target)
        if (not isinstance(error, PermissionError) or target.is_symlink()
                or not target.is_file() or target.stat().st_mode & stat.S_IWRITE):
            raise error
        target.chmod(target.stat().st_mode | stat.S_IWRITE)
        function(target)
    for path in runs:
        if path in keep:
            continue
        if path.resolve().parent != base:
            raise ValueError('Publication run escapes its registered directory: ' + str(path))
        shutil.rmtree(path, onexc=remove_readonly)
        removed.append(str(path))
    return {'kept': [str(p) for p in runs if p in keep], 'removed': removed}

def scan_public_words(dist, source_root=None, approved=None):
    """Check final text and tracked source, excluding non-display build records."""
    dist, source_root = Path(dist), Path(source_root or ROOT)
    if not dist.is_dir():
        raise ValueError('Dist directory does not exist: ' + str(dist))
    config = word_policy.load_policy(WORD_CONFIG)
    expression = word_policy.word_pattern(config)
    matcher = re.compile(expression)
    approved = approved if approved is not None else []
    hits = []
    # 编码数据不是访客能读的文字：data: 地址里的 base64 段当空白（保留列号），*.b64.js 整份不查
    encoded = re.compile(r'data:[A-Za-z0-9.+/-]*;base64,[A-Za-z0-9+/=]+')
    def check_line(rel, line_no, line, scope):
        if rel.endswith('.b64.js'):
            return
        line = encoded.sub(lambda m: ' ' * len(m.group()), line)
        for match in matcher.finditer(line):
            word, pos = match.group(), match.start()
            if word_policy.allow_word_exception(config, rel, line, match, approved):
                continue
            hits.append({'scope': scope, 'file': rel, 'line': line_no, 'column': pos+1, 'word': word,
                         'context': line[max(0, pos-40):pos] + '【' + word + '】' + line[match.end():match.end()+40]})
    for path in sorted(dist.rglob('*')):
        relative = path.relative_to(dist).as_posix()
        if relative.startswith(UNPUBLISHED_PREFIXES) or relative in word_policy.CHECK_RECORDS or not path.is_file() or path.suffix.lower() not in word_policy.TEXT_EXTENSIONS:
            continue
        rel = 'dist/' + relative
        body = path.read_text('utf-8-sig')
        if path.suffix.lower() == '.json':
            body = word_policy.apply_public_judgments(body, matcher, rel, approved)
        if path.suffix.lower() == '.html': body = html.unescape(body)
        for line_no, line in enumerate(body.splitlines(), 1):
            check_line(rel, line_no, line, 'dist')
    result = subprocess.run(['git', '-C', str(source_root), 'grep', '-n', '-I', '-z', '-P', '-e', expression, '--', '.'],
                            capture_output=True, encoding='utf-8', creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    if result.returncode not in (0, 1):
        raise ValueError('Tracked source word check failed: ' + result.stderr.strip())
    for row in result.stdout.splitlines():
        rel, line_no, line = row.split('\0', 2)
        check_line('source/' + rel, int(line_no), line, 'source')
    return hits

def load(name, directory=ROOT/'scripts'):
    spec = importlib.util.spec_from_file_location(name, directory/(name+'.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

oss, retention, word_policy = load('prepare-oss-release'), load('oss-retention'), load('site_public_words')
live_fallback = load('live_fallback')
runtime = load('build_runtime', ROOT/'site-astro/tools')
import selected_publish

def check_publication_text(dist, output=None):
    approved = []
    blocking = word_policy.scan_baseline(dist, exclude=UNPUBLISHED_PREFIXES, policy=word_policy.load_policy(WORD_CONFIG))
    hits = scan_public_words(dist, approved=approved)
    sensitive_files = {hit['file'] for hit in blocking}
    hits = [{k: v for k, v in hit.items() if k not in {'context', 'word'}} if hit['file'] in sensitive_files else hit for hit in hits]
    approved = [hit for hit in approved if hit['file'] not in sensitive_files]
    report = {'hits': hits, 'blocking_hits': blocking, 'ai_same': approved,
              'notice': '仅本人可见词或底线命中时停止发布。其他词表命中只是提示，不拦。'}
    if output:
        output.mkdir(parents=True, exist_ok=True)
        runtime.atomic_write_text(output/'word-check.json', json.dumps(report, ensure_ascii=False, indent=2), 'utf-8')
    print(json.dumps({**report, 'status': 'blocked' if blocking else 'pass'}, ensure_ascii=False))
    return report

def check_live_fallback(dist):
    """发布（含干跑）前确认实况垫底文件覆盖所有固定公开入口。"""
    data = live_fallback.read_checked_fallback(Path(dist)/'live/_fallback.json')
    return len(data['resources'])

def check_input_proofs(dist, source, previous, build, source_commit, verify_source=True, enforce_drift=True):
    value = source.get('input_fingerprints')
    if not value or value != build.get('input_fingerprints') or build.get('status') != 'built':
        raise ValueError('Manifest input fingerprints differ from the successful build receipt')
    identity = oss.read(dist/'release-identity.json')
    if any(commit != source_commit for commit in (build.get('source_commit'), source.get('source_commit'),
            identity.get('source_commit'), value['source_identity']['source_commit'])):
        raise ValueError('Source commit differs from the frozen build identity')
    if identity != oss.release_identity(source, oss.digest(dist/oss.MANIFEST)):
        raise ValueError('Release identity differs from the frozen manifest')
    rows = {runtime.nav.route_file(route): row for route, row in value['routes'].items()}
    rows.update(value['site_files'])
    actual = {p.relative_to(dist).as_posix(): oss.digest(p) for p in dist.rglob('*') if p.is_file() and p.name != '.build-receipt.json'}
    if actual != {row['path']: row['sha256'] for row in build['files']} or any(rel not in rows for rel in actual if rel.endswith('.html')):
        raise ValueError('Dist inventory differs from the successful build input proofs')
    for rel, row in rows.items():
        if row['fingerprint'] != runtime.value_sha(row['inputs']) or row.get('current_fingerprint', row['fingerprint']) != row['fingerprint']:
            raise ValueError('Unbuilt or invalid input fingerprint: '+rel)
        if rel not in {oss.MANIFEST, 'release-identity.json'} and row.get('output_sha256') != oss.digest(dist/rel):
            raise ValueError('Built output differs from its input proof: '+rel)
    if verify_source: runtime.verify_inputs(value)
    result = runtime.reconcile(dist, value, previous or {})
    if enforce_drift and result['drift']:
        raise ValueError('Unchanged inputs produced changed output: '+', '.join(result['drift']))
    return result

def check_update_batch(batch, source, source_commit, manifest_sha256, reconciliation):
    empty_legacy = batch.get('pages') == {} and reconciliation['baseline'] == 'legacy' and str(batch.get('legacy_baseline_reason') or '').strip()
    if (not batch.get('run_id') or not batch.get('batch_id') or (not batch.get('pages') and not empty_legacy)
            or source_commit == 'Unknown' or batch.get('source_commit') != source_commit
            or batch.get('release_id') != source['release_id'] or batch.get('manifest_sha256') != manifest_sha256):
        raise ValueError('Update batch differs from the frozen publication artifact')
    allowed = {runtime.nav.route_file(route) for route in batch['allowed_routes']}
    if any(runtime.nav.route_file(row['route']) not in allowed or not re.fullmatch('[a-f0-9]{40}', row.get('merged_commit', ''))
           for row in batch['pages'].values()):
        raise ValueError('Update batch contains an unmerged or unregistered page')
    baseline = reconciliation['baseline']
    if baseline == 'legacy':
        if not str(batch.get('legacy_baseline_reason') or '').strip():
            raise ValueError('Legacy publication baseline requires an explicit reason')
        return '首发用旧式基准：' + batch['legacy_baseline_reason']
    if baseline != 'published':
        raise ValueError('Update publication requires a successful publication baseline')
    page_changes = [*reconciliation['pages'], *reconciliation.get('site_files', [])]
    unexpected = sorted(row['path'] for row in page_changes if row['path'].endswith('.html')
                        and not row['path'].startswith(UNPUBLISHED_PREFIXES) and row['path'] not in allowed)
    if unexpected:
        raise ValueError('Publication changed pages outside this update batch: ' + ', '.join(unexpected))
    return '本趟过关页及登记引用页'


def command(*args, timeout=None):
    done = subprocess.run([str(x) for x in args], cwd=ROOT, text=True, encoding='utf8', timeout=timeout,
                          capture_output=True, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    if done.returncode:
        raise subprocess.CalledProcessError(done.returncode, done.args, done.stdout, done.stderr)
    return done.stdout.strip()

LAST_ATTEMPT_KEYS = ('schema', 'status', 'publication_status', 'dry_run', 'started_at_beijing', 'completed_at_beijing',
                     'total_seconds', 'source_commit', 'source_commit_evidence', 'commit', 'deployment', 'error', 'oss_retention')
RETRY_DELAYS = (0.5, 1, 2, 2, 2, 2, 2, 2)  # 连接层错误最多重试 8 次；内容核对不一致、HTTP 状态和其他错误一律不重试
PAGE_RETRY_DELAYS = (0.5, 1, 2, 4)  # 每个页面最多请求五次，仅重试传输错误和 HTTP 5xx
PAGE_ROUND_DELAYS = (120, 150, 180)  # 整轮结束后仅为传输失败网址补查，最多三轮
HEAD_TIMEOUT, PAGE_TIMEOUT, GH_TIMEOUT, GIT_TIMEOUT, PUSH_TIMEOUT = 8, 15, 60, 120, 600
PAGES_CONFIRM_TIMEOUT = 1200  # Include preparation/queue time before the 15-minute job completes.
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

def delta(current, previous, include_url=True):
    previous = {**{row.get('key', rel): row for rel, row in previous.items()}, **previous}
    return {rel: row for rel, row in current.items()
            if rel != oss.MANIFEST and (row['sha256'] != (old := previous.get(rel, previous.get(row.get('key'), {}))).get('sha256')
                                       or row.get('key') != old.get('key') or include_url and row.get('url') != old.get('url'))}

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
    proof = {'status': 'failed', 'url': request.full_url, 'expected_sha256': row['sha256'], 'attempts': []}
    for attempt, delay in enumerate((*PAGE_RETRY_DELAYS, None), 1):
        status, digest = None, None
        try:
            with urlopen(request, timeout=PAGE_TIMEOUT) as response:
                status = response.status
                if status != 200:
                    raise HTTPError(request.full_url, status, 'Public HTML GET is not 200', response.headers, None)
                # read() raises IncompleteRead for a truncated Content-Length body; readinto() can silently stop.
                digest = hashlib.sha256(response.read()).hexdigest()
            if digest != row['sha256']:
                raise ValueError('Public HTML GET differs: '+rel)
            proof.update(status='pass', http=status, sha256=digest, retryable=False)
            proof['attempts'].append({'attempt': attempt, 'status': 'pass', 'http': status, 'sha256': digest})
            break
        except Exception as error:
            if isinstance(error, HTTPError):
                status = error.code
                error.close()
            transport = ((isinstance(error, HTTPError) and 500 <= error.code < 600)
                         or connection_level(error, url_read=True))
            proof.update(http=status, error=str(error), error_type=type(error).__name__, retryable=transport)
            if digest is not None:
                proof['sha256'] = digest
            proof['attempts'].append({'attempt': attempt, 'status': 'failed', 'http': status,
                'error': str(error), 'error_type': type(error).__name__, 'retryable': transport,
                'retry_delay_seconds': delay if transport else None})
            if not transport or delay is None:
                break
            time.sleep(delay)
    proof.update(attempt_count=len(proof['attempts']), retry_count=len(proof['attempts'])-1)
    if proof['status'] == 'pass':
        proof.pop('error', None); proof.pop('error_type', None)
    return rel, proof

def verify_pages(selected, receipt, checkpoint=None):
    pending = dict(sorted(selected.items()))
    receipt['get_rounds'] = []
    for number, wait in enumerate((0, *PAGE_ROUND_DELAYS), 1):
        if wait:
            time.sleep(wait)
        results = {}
        with ThreadPoolExecutor(max_workers=8) as pool:
            for rel, proof in pool.map(get_page, pending.items()):
                proof['attempts'] = [{**attempt, 'round': number} for attempt in proof.get('attempts', [])]
                results[rel] = proof
                previous = receipt['get'].get(rel, {})
                count = previous.get('attempt_count', 0) + proof.get('attempt_count', 1)
                receipt['get'][rel] = {**proof, 'attempt_count': count, 'retry_count': count-1,
                    'round_count': previous.get('round_count', 0)+1,
                    'attempts': previous.get('attempts', [])+proof['attempts']}
        receipt['get_rounds'].append({'round': number, 'wait_seconds': wait, 'results': results,
            'attempt_count': sum(proof.get('attempt_count', 1) for proof in results.values()),
            'retry_count': sum(proof.get('retry_count', 0) for proof in results.values()),
            'failed_urls': [proof['url'] for proof in results.values() if proof['status'] != 'pass']})
        pending = {rel: selected[rel] for rel, proof in results.items()
                   if proof['status'] != 'pass' and proof.get('retryable')}
        failures = [proof['url'] for proof in receipt['get'].values() if proof['status'] != 'pass']
        receipt['get_summary'] = {'workers': 8, 'total': len(selected), 'passed': len(selected)-len(failures),
            'failed': len(failures), 'retried_urls': sum(proof.get('retry_count', 0) > 0 for proof in receipt['get'].values()),
            'attempts': sum(proof.get('attempt_count', 1) for proof in receipt['get'].values()),
            'retries': sum(proof.get('retry_count', 0) for proof in receipt['get'].values()),
            'rounds': len(receipt['get_rounds']), 'failed_urls': failures}
        if checkpoint:
            checkpoint()
        if not pending:
            break
    if failures:
        raise ValueError('Public HTML GET failed: '+', '.join(failures))

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

def publication_manifest(source, retained=None, previous=None, retained_keys=()):
    """Keep preview-only data in dist while publishing a consistent subset."""
    keep = lambda rows: {rel: row for rel, row in rows.items() if not rel.startswith(UNPUBLISHED_PREFIXES)}
    objects, files = keep(source['oss']['objects']), keep(source['files'])
    retained = retained or {}
    if objects == source['oss']['objects'] and files == source['files'] and not retained: return source
    for rel in retained:
        files[rel] = previous['files'][rel]
    cloud = {**source['oss'], 'objects': objects, 'retained_objects': keep(source['oss'].get('retained_objects', {}))}
    removed_keys = {row['key'] for rel, row in source['oss']['objects'].items() if rel not in objects}
    references = set(cloud['reference_keys']) - removed_keys
    references.update(retained_keys)
    cloud['reference_keys'] = sorted(references)
    result = {**source, 'files': files, 'oss': cloud}
    result['release_id'] = oss.release_identifier(cloud['source_release_id'], cloud['asset_base_url'], cloud['prefix'], files, objects)
    return oss.verify_manifest(result, require_remote=False)


def preserve_unselected(args, source, previous, saved, batch, reconciliation):
    prior = getattr(args, 'previous_site_dist', None) or saved.get('site_dist', {}).get('root')
    local = Path(prior) if prior else None

    def read_previous(rel):
        path = local / rel if local else None
        if path and path.is_file():
            return path.read_bytes()
        if args.dry_run:
            # An offline rehearsal without prior HTML still reports the genuine
            # scope difference through the normal publisher gate.
            raise FileNotFoundError(rel)
        return retention.public_read(oss.quote(rel, safe='/'))

    changed = reconciliation['pages'] + reconciliation['site_files']
    allowed = selected_publish.routes(batch, runtime.nav.route_file)
    try:
        return selected_publish.preserve_html(args.dist, source, previous, changed, allowed, read_previous, ROOT)
    except FileNotFoundError:
        if not args.dry_run:
            raise
        return {}


def previous_objects(cloud):
    path = retention.shared()/'managed.json'
    managed = retention.read(path)['objects'] if path.is_file() else {}
    return {**managed, **{row['key']: row for row in cloud['objects'].values()}}


def verified_old_asset(args, saved, rel, url, sha):
    if not sha:
        raise ValueError('缺少旧对象指纹')
    for root in (getattr(args, 'previous_site_dist', None), saved.get('dist_root')):
        path = Path(root)/rel if root else None
        if path and path.is_file():
            raw = path.read_bytes()
            if hashlib.sha256(raw).hexdigest() == sha:
                return raw
    if not args.dry_run:
        with urlopen(Request(url, headers={'Accept-Encoding': 'identity'}), timeout=PAGE_TIMEOUT) as response:
            raw = response.read()
        if hashlib.sha256(raw).hexdigest() == sha:
            return raw
    raise ValueError('旧对象内容无法按 SHA-256 核验')


def retained_resources(args, source, previous, saved, retained):
    cloud = previous['oss']
    base = cloud['asset_base_url']
    old = previous_objects(cloud)
    current = {row['key'] for row in source['oss']['objects'].values()}
    known = current | old.keys()
    pending = [(page, key) for page, raw in retained.items()
               for key in oss.absolute_resource_keys(raw.decode('utf-8-sig'), base, known=known)]
    keys, gaps = set(), {}
    while pending:
        page, key = pending.pop()
        if key in current or key in keys:
            continue
        keys.add(key)
        if key not in old:
            gaps[key] = {'page': page, 'reason': '缺少旧对象登记'}
            continue
        parts = key.split('/', 2)
        if len(parts) != 3 or Path(parts[2]).suffix not in oss.TEXT_ASSETS:
            continue
        rel = parts[2]
        url = base + '/' + oss.quote(key, safe='/~!$&()*+,;=:@-._')
        try:
            raw = verified_old_asset(args, saved, rel, url, old.get(key, {}).get('sha256'))
            pending.extend((page, child) for child in oss.absolute_resource_keys(raw.decode('utf-8-sig'), base, known=known))
        except (OSError, IncompleteRead, ValueError) as error:
            gaps[key] = {'page': page, 'reason': str(error)}
    if gaps:
        # Without a dependency body any object from its predecessor may still be live.
        keys.update(cloud.get('reference_keys', ()))
        keys.update(row['key'] for row in cloud['objects'].values())
    return keys, gaps


def review_preserved_scripts(args, source, previous, saved, retained):
    cloud = previous['oss']
    known = selected_publish.known_addresses(cloud)
    old = previous_objects(cloud)
    current = {row['url'] for row in source['oss']['objects'].values()}
    policy = word_policy.load_policy(WORD_CONFIG)
    words = policy.get('owner_row_words', [])
    owner_rows = re.compile(word_policy.word_pattern({'words': words})) if words else None
    owners = {}
    for page, raw in retained.items():
        for match in selected_publish.ASSET.finditer(raw):
            url, rel = match[0].decode(), known.get(match[0], '')
            if selected_publish.PROJECT_DATA.fullmatch(rel) and url not in current:
                owners.setdefault((url, rel), page)
    for (url, rel), page in owners.items():
        key = unquote(urlsplit(url).path.lstrip('/'))
        sha = old.get(key, {}).get('sha256')
        try:
            raw = verified_old_asset(args, saved, rel, url, sha)
        except (OSError, IncompleteRead, ValueError) as error:
            raise ValueError(f'无法核验保留页的旧内容脚本：{page} 引用 {rel}') from error
        if word_policy.baseline_hits(raw.decode('utf-8-sig'), 'dist/'+rel, owner_rows, policy):
            raise ValueError(f'保留页的旧内容脚本不符合现行公开要求：{page} 引用 {rel}')
    return len(owners)


def artifact_commit(dist, plan, output, source_commit, local_parent=None):
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
    if local_parent is None:
        remote = net('git', *GIT_NET, '-C', destination, 'ls-remote', 'origin', 'refs/heads/site-dist', timeout=GIT_TIMEOUT)
        if remote:
            net('git', *GIT_NET, '-C', destination, 'fetch', '--depth=1', 'origin', 'site-dist', timeout=GIT_TIMEOUT)
            git('checkout', '-B', 'site-dist', 'FETCH_HEAD')
    elif (local_parent / '.git').exists():
        git('fetch', '--depth=1', str(local_parent.resolve()), 'HEAD')
        git('checkout', '-B', 'site-dist', 'FETCH_HEAD')
    for rel in git('ls-files').splitlines():
        if rel not in {*plan['github_files'], 'release-identity.json'}:
            (destination/rel).unlink()
    for rel, row in plan['github_files'].items():
        target = destination/rel
        if not target.exists() or oss.digest(target) != row['sha256']:
            target.parent.mkdir(parents=True, exist_ok=True)
            prepared = output/'publication'/rel
            shutil.copyfile(prepared if prepared.is_file() else dist/rel, target)
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
    if args.output is None:
        PUBLISH_RUNS.mkdir(parents=True, exist_ok=True)
    output = (args.output or PUBLISH_RUNS/('publish-'+str(time.time_ns()))).resolve()
    output.mkdir(parents=True, exist_ok=False)
    receipt = {'schema': 'wly.publish-receipt.v1', 'status': 'running', 'dry_run': args.dry_run, 'output': str(output),
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
        blocking = step('public_word_gate', lambda: check_publication_text(args.dist, output))['blocking_hits']
        if blocking:
            raise ValueError(f'Public baseline gate blocked {len(blocking)} occurrence(s); see {output / "word-check.json"}')
        source = oss.read(args.dist/oss.MANIFEST)
        if not source.get('finalized_dist'):
            raise ValueError('Run prepare-oss-release.py finalize-dist --dist '+str(args.dist)+' then scan that final dist')
        receipt['live_fallback_resources'] = check_live_fallback(args.dist)
        oss.verify_manifest(source, require_remote=False)
        fingerprints = step('hash_dist', lambda: {path.relative_to(args.dist).as_posix(): oss.digest(path)
                            for path in sorted(args.dist.rglob('*')) if path.is_file()})
        scan_path = getattr(args, 'scan_result', None) or args.dist.parent/'scan-glance'/'scan-result.json'
        scan = oss.read(scan_path)
        scanned = scan.get('dist_files_sha256', {})
        changed = sorted(rel for rel in fingerprints.keys() | scanned.keys() if fingerprints.get(rel) != scanned.get(rel))
        failures = scan.get('failures')
        if not isinstance(failures, list):
            raise ValueError('Scan result is missing its failures list')
        if review_path := getattr(args, 'scan_review', None):
            review = oss.read(review_path)
            if review['scan_sha256'] != oss.digest(scan_path):
                raise ValueError('Scan review belongs to a different scan result')
            accepted = {row['index'] for row in review['findings'] if row['reason'].strip()}
            if not accepted <= set(range(1, len(failures) + 1)):
                raise ValueError('Scan review references a finding outside this scan result')
            receipt['scan_review'] = {'path': str(review_path), **review}
            failures = [row for index, row in enumerate(failures, 1) if index not in accepted]
        if changed or (not args.dry_run and failures):
            raise ValueError('Dist differs from successful scan: '+(', '.join(changed) if changed else 'scan has failures'))
        if not args.dry_run:
            claim = json.loads(command('pwsh', '-NoProfile', '-File', LOCK, '-Mode', 'Acquire',
                            '-Name', 'wly0829-publication', '-Holder', args.lock_holder,
                            '-Minutes', '30', '-Reason', 'Incremental website publication', '-Json'))
            if claim.get('status') not in ('acquired', 'renewed'):
                raise ValueError('Cannot acquire publication lock')
            owned = claim['status'] == 'acquired'
        previous = step('previous_manifest', lambda: oss.verify_manifest(oss.read(args.previous_manifest))
                        if args.previous_manifest else retention.predecessor())
        previous_for_retention = previous
        saved = {}
        if previous:
            saved_path = retention.shared()/'published.json'
            saved = retention.read(saved_path) if saved_path.is_file() else {}
            if saved.get('manifest', {}).get('release_id') == previous['release_id']:
                previous = {**previous, '_build_files': saved.get('build_files', {})}
            else:
                if previous.get('publication_readback_required') and saved.get('manifest'):
                    previous_for_retention = oss.verify_manifest(saved['manifest'])
                saved = {}
        build = oss.read(args.dist/'.build-receipt.json') if (args.dist/'.build-receipt.json').is_file() else {}
        source_commit = args.source_commit or build.get('source_commit') or source.get('source_commit') or 'Unknown'
        if source_commit != 'Unknown' and not oss.re.fullmatch('[a-f0-9]{40}', source_commit):
            raise ValueError('source-commit must be an exact source SHA, or Unknown')
        receipt['source_commit'] = source_commit
        receipt['source_commit_evidence'] = ('explicit task baseline' if args.source_commit else
                'build receipt' if build.get('source_commit') else 'source manifest' if source.get('source_commit') else 'Unknown')
        batch = oss.read(args.update_batch) if getattr(args, 'update_batch', None) else None
        reconciliation = check_input_proofs(args.dist, source, previous, build, source_commit,
                                            enforce_drift=batch is None)
        receipt.update(release_id=source['release_id'], manifest_sha256=oss.digest(args.dist/oss.MANIFEST))
        retained, retained_keys = {}, set()
        if batch is not None:
            receipt['update_batch'] = batch
            receipt['update_baseline'] = check_update_batch(batch, source, source_commit, receipt['manifest_sha256'],
                                                           {**reconciliation, 'pages': [], 'site_files': []})
            retained = preserve_unselected(args, source, previous, saved, batch, reconciliation)
            for group in ('pages', 'site_files'):
                reconciliation[group] = [change for change in reconciliation[group] if change['path'] not in retained]
            reconciliation['drift'] = [rel for rel in reconciliation['drift'] if rel not in retained]
            check_update_batch(batch, source, source_commit, receipt['manifest_sha256'], reconciliation)
            if reconciliation['drift']:
                raise ValueError('Unchanged inputs produced changed output: '+', '.join(reconciliation['drift']))
            receipt['preserved_unselected_html'] = sorted(retained)
            if retained:
                receipt['reviewed_preserved_scripts'] = step('retained_publication_review',
                    lambda: review_preserved_scripts(args, source, previous, saved, retained))
                retained_keys, gaps = step('retained_resource_dependencies',
                    lambda: retained_resources(args, source, previous, saved, retained))
                receipt['retained_reference_gaps'] = gaps
        receipt['published_reconciliation'] = reconciliation
        preparation = output
        published = publication_manifest(source, retained, previous, retained_keys)
        generated = {}
        if published is not source:
            folder = output/'publication'
            folder.mkdir()
            for rel, raw in retained.items():
                target = folder / rel
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(raw)
            oss.write(folder/oss.MANIFEST, published)
            oss.write(folder/'release-identity.json', oss.release_identity(published, oss.digest(folder/oss.MANIFEST)))
            generated = {rel: {'bytes': (folder/rel).stat().st_size, 'sha256': oss.digest(folder/rel)}
                         for rel in (oss.MANIFEST, 'release-identity.json', *retained)}
        receipt['excluded_files'] = [rel for rel in fingerprints if rel.startswith(UNPUBLISHED_PREFIXES)]
        receipt['publication_release_id'] = published['release_id']
        plan = {'schema': 'wly.oss-release-plan.v1', 'release_id': published['release_id'], 'asset_base_url': published['oss']['asset_base_url'],
                'test_only': False, 'remote_verified': False, 'objects': published['oss']['objects'],
                'github_files': {rel: {'bytes': (args.dist/rel).stat().st_size, 'sha256': fingerprints[rel]}
                                 for rel in fingerprints if not rel.startswith(UNPUBLISHED_PREFIXES) and rel not in source['oss']['objects'] and rel != '.build-receipt.json'},
                'retained_objects': dict(published['oss'].get('retained_objects', {})), 'reference_keys': published['oss']['reference_keys']}
        plan['github_files'].update(generated)
        receipt['publication_manifest_sha256'] = plan['github_files'][oss.MANIFEST]['sha256']
        assets = delta(plan['objects'], (previous or {}).get('oss', {}).get('objects', {}))
        uploads = delta(plan['objects'], (previous or {}).get('oss', {}).get('objects', {}), include_url=False)
        retired = retention.retired_predecessor_keys(previous)
        for rel, row in plan['objects'].items():
            if row['key'] in retired:
                assets[rel] = uploads[rel] = row
                plan['retained_objects'].pop(rel, None)
        origin_readbacks = assets.keys() - uploads.keys()
        if previous:
            proofs = {row['key']: previous['oss']['verification']['objects'][rel] for rel, row in previous['oss']['objects'].items()}
            plan['retained_objects'].update({rel: proofs[row['key']] for rel, row in plan['objects'].items() if rel not in assets and row['key'] in proofs})
            if previous['release_id'] == published['release_id'] and (snapshot := saved.get('oss_predecessor')):
                if oss.digest(snapshot['path']) != snapshot['sha256']:
                    raise ValueError('Previous publication snapshot changed')
                previous_for_retention = oss.read(snapshot['path'])
            oss.write(output/'previous-publication.json', previous_for_retention)
            plan['previous_publication_sha256'] = oss.digest(output/'previous-publication.json')
        oss.write(output/oss.PLAN, plan)
        documents = delta(plan['github_files'], (previous or {}).get('files', {}))
        receipt['planned_assets'] = list(uploads)
        receipt['planned_origin_readbacks'] = sorted(origin_readbacks)
        receipt['planned_documents'] = list(documents)
        receipt['planned_files'] = len(uploads)+len(documents)+1
        receipt['planned_bytes'] = sum(row['bytes'] for row in [*uploads.values(), *documents.values()])+plan['github_files'][oss.MANIFEST]['bytes']
        receipt['estimated_transfer_seconds'] = round(receipt['planned_bytes']/10_000_000, 3)
        receipt['estimate_bytes_per_second'] = 10_000_000
        receipt['oss_retention'] = {'status': 'skipped_by_request' if getattr(args, 'skip_retention', False) else 'pending_publication',
            'deleted_objects': 0, 'deleted_bytes': 0, 'rollback_ref': source.get('rollback_ref'),
            'command': ['python', '-B', '-X', 'utf8', 'site-astro/tools/publish_site.py', '--retention-only', str(output)]}
        if args.dry_run:
            check_input_proofs(args.dist, source, previous, build, source_commit, enforce_drift=batch is None)
            local_parent = getattr(args, 'previous_site_dist', None)
            if local_parent and not (local_parent / '.git').exists() and (saved_root := saved.get('site_dist', {}).get('root')):
                local_parent = Path(saved_root)
            receipt['site_dist'] = step('local_site_dist_commit', lambda:
                    artifact_commit(args.dist, plan, output, source_commit, local_parent))
            receipt['status'] = 'dry_run'
            return receipt
        step('pin', lambda: retention.pin(preparation))

        def renew_lock():
            claim = json.loads(command('pwsh', '-NoProfile', '-File', LOCK, '-Mode', 'Acquire',
                            '-Name', 'wly0829-publication', '-Holder', args.lock_holder,
                            '-Minutes', '30', '-Reason', 'Incremental website publication', '-Json'))
            if claim.get('status') not in ('acquired', 'renewed'):
                raise ValueError('Cannot renew publication lock')

        def upload_one(item):
            rel, row = item
            if rel in origin_readbacks: return rel, row, False, head(item, args.dist)[1]
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
        manifest = {**published, 'oss': dict(published['oss'])}
        manifest['oss']['verification'] = {'schema': 'wly.oss-incremental-verification.v1',
            'release_id': plan['release_id'], 'complete': True, 'verified_at_beijing': oss.stamp(),
            'method': 'uploaded HEAD size and MD5; unchanged retained receipts',
            'objects': {**plan['retained_objects'], **receipt['head']}}
        # Preserve actual HEAD proofs before deployment.
        verification = {**manifest['oss']['verification'], 'plan_sha256': retention.digest(output/oss.PLAN)}
        step('retention_proofs', lambda: retention.write(output/'remote-verification.json', verification))
        pin_path = step('retention_inventory', lambda: retention.pin(preparation))
        receipt['oss_retention_pin'] = {'path': str(pin_path), 'plan_sha256': verification['plan_sha256'],
                                       'storage': 'plan_snapshot in shared Git pin'}

        check_input_proofs(args.dist, source, previous, build, source_commit, enforce_drift=batch is None)
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
        readback_documents = plan['github_files'] if (previous or {}).get('publication_readback_required') else documents
        selected = {rel: plan['github_files'][rel] for rel in
                    {'index.html', 'cockpit/index.html', 'computer-access/index.html'} |
                    ({runtime.nav.route_file(row['route']) for row in batch['pages'].values()} if batch else set()) |
                    {rel for rel in readback_documents if rel.endswith('.html')}}
        step('get_key_and_changed_pages', lambda: verify_pages(selected, receipt,
            lambda: oss.write(output/'publish-receipt.json', receipt)))
        check_input_proofs(args.dist, source, previous, build, source_commit)
        step('successful_manifest_last', lambda: retention.write(retention.shared()/'published.json', {
            'schema': 'wly.site-publication.v1', 'commit': receipt['commit'], 'deployment': receipt['deployment'],
            'source_commit': source_commit, 'site_dist': receipt['site_dist'], 'dist_root': str(args.dist.resolve()),
            'oss_plan_sha256': verification['plan_sha256'],
            'oss_predecessor': {'path': str(output/'previous-publication.json'), 'sha256': plan['previous_publication_sha256']}
                if 'previous_publication_sha256' in plan else None,
            **({'update_batch': batch} if batch is not None else {}),
            'manifest': manifest, 'build_files': {rel: {'bytes': (args.dist/rel).stat().st_size, 'sha256': oss.digest(args.dist/rel)}
                for rel in (oss.MANIFEST, 'release-identity.json')}, 'readback': receipt['get'], 'verified_at_beijing': oss.stamp()}))
        receipt['status'] = 'published'
        receipt['publication_status'] = 'published'
        oss.write(output/'publish-receipt.json', receipt)
        if receipt['oss_retention']['status'] != 'skipped_by_request':
            report = output/'oss-retention.json'
            try:
                renew_lock()
                step('oss_retention', lambda: collect_output(args, output, receipt))
                collected = retention.read(report)
            except Exception as error:
                collected = {'status': 'incomplete', 'reason': str(error)}
                if not report.is_file():
                    retention.write(report, collected)
                else:
                    collected = retention.read(report)
            summary_fields = ('status', 'reason', 'deleted_objects', 'deleted_bytes', 'bucket_before', 'bucket_after', 'plan')
            receipt['oss_retention'].update({key: collected[key] for key in summary_fields if key in collected}, receipt=str(report))
            if collected.get('bucket_stat_failed') or collected.get('bucket_after_error'):
                receipt['oss_retention']['bucket_stat_failed'] = True
            if receipt['oss_retention']['status'] != 'complete':
                print('发布已成功，OSS 回收未完成：' + str(report), file=sys.stderr)
        sys.path.insert(0, str(ROOT / 'scripts'))
        try:
            import live_project
            live_project.record('publication', ROOT, retention.read(retention.shared()/'published.json'))
        except Exception as error:
            print('发布已成功，实况登记失败：' + str(error), file=sys.stderr)
        return receipt
    except Exception as error:
        receipt.update(status='failed', error=str(error))
        raise
    finally:
        receipt['total_seconds'] = round(time.monotonic()-started, 3)
        receipt['completed_at_beijing'] = oss.stamp()
        if not args.dry_run:  # 驾驶舱读的固定“最近一次正式尝试”，与 published.json 同目录；尽力写，写不成不改变结果和退出码
            try:
                save_last_attempt(retention.shared()/'last-attempt.json', receipt)
            except Exception:
                pass
        oss.write(output/'publish-receipt.json', receipt)
        if owned:
            command('pwsh', '-NoProfile', '-File', LOCK, '-Mode', 'Release',
                    '-Name', 'wly0829-publication', '-Holder', args.lock_holder, '-Json')

def save_last_attempt(path, receipt):
    latest = {key: receipt[key] for key in LAST_ATTEMPT_KEYS if key in receipt}
    try:
        previous = retention.read(path)
    except (OSError, ValueError):
        previous = {}
    readings = [previous.get('last_bucket_stat')] if isinstance(previous, dict) else []
    for attempt in (previous, latest):
        if (isinstance(attempt, dict) and attempt.get('schema') == 'wly.publish-receipt.v1'
                and attempt.get('dry_run') is False and (attempt.get('publication_status') == 'published' or attempt.get('status') == 'published')):
            stats = attempt.get('oss_retention')
            if isinstance(stats, dict):
                readings.extend(stats.get(key) for key in ('bucket_before', 'bucket_after'))
    if latest_stat := max((row for row in reversed(readings) if isinstance(row, dict)
            and type(row.get('bytes')) is int and row['bytes'] >= 0
            and type(row.get('provider_updated_at')) is int and row['provider_updated_at'] > 0),
            key=lambda row: row['provider_updated_at'], default=None):
        latest['last_bucket_stat'] = {key: latest_stat[key] for key in ('bytes', 'provider_updated_at')}
    retention.write(path, latest)


def collect_output(args, preparation, publication, report=None):
    return retention.collect(SimpleNamespace(preparation=preparation, commit=publication['commit'],
        rollback=publication.get('oss_retention', {}).get('rollback_ref'), cli=CLI, profile='website-images',
        lock_holder=args.lock_holder, report=report or preparation/'oss-retention.json', dry_run=args.dry_run,
        max_keys=getattr(args, 'retention_max_keys', None)))


def collect_after_publication(args):
    preparation = args.retention_only.resolve()
    publication = retention.read(preparation/'publish-receipt.json')
    if publication.get('publication_status') != 'published' or publication.get('dry_run') is not False:
        raise ValueError('Standalone retention requires a successful real publication receipt')
    claim = json.loads(command('pwsh', '-NoProfile', '-File', LOCK, '-Mode', 'Acquire',
        '-Name', 'wly0829-publication', '-Holder', args.lock_holder, '-Minutes', '30',
        '-Reason', 'Standalone website object retention', '-Json'))
    if claim.get('status') != 'acquired':
        raise ValueError('Standalone retention must acquire a fresh lock after publication releases it')
    try:
        label = 'dry-run' if args.dry_run else 'retry'
        report = preparation/f'oss-retention-{label}-{time.time_ns()}'/'oss-retention.json'
        code = collect_output(args, preparation, publication, report)
        result = {'status': 'retention_dry_run' if args.dry_run else 'retention_complete' if not code else 'retention_incomplete',
                  'publication_status': 'published', 'oss_retention': retention.read(report), 'exit_code': code,
                  'receipt': str(report)}
        if not args.dry_run and not code:
            result['local_runs'] = prune_publish_runs()
        return result
    finally:
        if claim['status'] == 'acquired':
            command('pwsh', '-NoProfile', '-File', LOCK, '-Mode', 'Release',
                '-Name', 'wly0829-publication', '-Holder', args.lock_holder, '-Json')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    operation = parser.add_mutually_exclusive_group(required=True)
    operation.add_argument('--dist', type=Path)
    operation.add_argument('--retention-only', type=Path, metavar='PUBLICATION_OUTPUT',
                           help='collect old objects separately using a successful publication output directory')
    operation.add_argument('--word-check-only', type=Path, metavar='DIST',
                           help='read-only baseline check and non-blocking word hints for a completed dist')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--upload-only', action='store_true', help='upload and read back OSS assets, then stop before site-dist and Pages')
    parser.add_argument('--scan-result', type=Path)
    parser.add_argument('--scan-review', type=Path,
                        help='same-scan SHA-256 and numbered findings accepted after comparison with the running site')
    parser.add_argument('--previous-manifest', type=Path)
    parser.add_argument('--previous-site-dist', type=Path, help='local prior Pages artifact for selected-page rehearsal')
    parser.add_argument('--output', type=Path)
    parser.add_argument('--source-commit')
    parser.add_argument('--update-batch', type=Path, help='frozen accepted-page batch from tools/update.py')
    parser.add_argument('--pages-timeout', type=int, default=PAGES_CONFIRM_TIMEOUT,
                        help='total confirmation budget, including dispatch, queue and the 15-minute Pages job')
    parser.add_argument('--upload-workers', type=int, default=12, help='parallel OSS uploads; existing identical objects are skipped')
    parser.add_argument('--retention-max-keys', type=int, help='limit exact obsolete managed keys checked by collection')
    parser.add_argument('--skip-retention', action='store_true', help='explicitly skip collection for this publication')
    parser.add_argument('--defer-source-word-cleanup', action='store_true', help='compatibility flag; word hints never block')
    parser.add_argument('--lock-holder', default='codex:publish:'+ROOT.parent.name)
    options = parser.parse_args()
    if options.word_check_only:
        raise SystemExit(bool(check_publication_text(options.word_check_only, options.output)['blocking_hits']))
    if options.dist and options.output is None:
        PUBLISH_RUNS.mkdir(parents=True, exist_ok=True)
        options.output = PUBLISH_RUNS/('publish-'+str(time.time_ns()))
    try:
        result = collect_after_publication(options) if options.retention_only else publish(options)
    except Exception as error:
        print(json.dumps({'status': 'failed', 'error': str(error)[:500],
            'receipt': str(options.output/'publish-receipt.json') if options.output else None}, ensure_ascii=False))
        raise SystemExit(1)
    print(json.dumps({'status': result['status'], 'planned_files': result.get('planned_files'),
        'uploaded_files': result.get('uploaded_files'), 'commit': result.get('commit'),
        'error': result.get('error'), 'receipt': result.get('receipt') or str(Path(result['output']) / 'publish-receipt.json'),
        'local_runs': result.get('local_runs')}, ensure_ascii=False))
    raise SystemExit(result.get('exit_code', 0))

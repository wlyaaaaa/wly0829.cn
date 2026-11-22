"""Bounded cockpit HTTP checks; never fetch image or media dependencies."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen

URLS = {
    'page': 'https://wly0829.cn/live/',
    'api': 'https://live.wly0829.cn/computer-access/live/v1/home',
    'control': 'https://wly0829.cn/robots.txt',
}
# 上限只防异常大响应，不当正常体量的判定。
MAX_BYTES = 4 * 1024 * 1024


def monitor_urls(registry):
    home = json.loads(Path(registry).read_text(encoding='utf-8-sig'))['website']['home']
    if home not in ('https://wly0829.cn/live/', 'https://wly0829.cn/cockpit/'):
        raise ValueError('invalid_monitor_home')
    legacy = home.endswith('/cockpit/')
    api = 'https://live.wly0829.cn/computer-access/' + ('state?view=cockpit' if legacy else 'live/v1/home')
    return dict(URLS, page=home, api=api), legacy


def api_valid(data, legacy=False):
    if legacy:
        stamp = data.get('served_at_unix', data.get('observed_at_unix'))
        return (isinstance(data.get('host'), dict) or isinstance(data.get('overview'), dict)) and isinstance(stamp, (int, float)), stamp
    try:
        at = datetime.fromisoformat(data['at'])
        shaped = (at.utcoffset() is not None and datetime.fromisoformat(data['now']).utcoffset() is not None
                  and type(data['v']) is int and data['v'] == 1 and type(data['seq']) is int and data['seq'] >= 0
                  and isinstance(data['rev'], str) and bool(data['rev'].strip())
                  and data['viewer']['kind'] in ('public', 'owner') and data['viewer']['device'] in ('ok', 'none', 'invalid', 'unavailable')
                  and data['link']['state'] in ('online', 'offline', 'unknown') and data['link']['basis'] in ('response', 'heartbeat', 'browser')
                  and isinstance(data['data']['screen'], dict))
        return shaped, at.timestamp()
    except (KeyError, TypeError, ValueError): return False, None


def api_warming(data):
    try:
        viewer, link = data['viewer'], data['link']
        stamps = [data['now'], link['seen']] + ([link['since']] if link['since'] is not None else [])
        return (all(datetime.fromisoformat(s).utcoffset() is not None for s in stamps)
                and type(data['v']) is int and data['v'] == 1
                and type(data['seq']) is int and data['seq'] >= 0
                and isinstance(data['rev'], str) and bool(data['rev'].strip())
                and data['at'] is None and data['data'] is None and data['q'] == 'warming'
                and viewer['kind'] in ('public', 'owner') and viewer['device'] in ('ok', 'none', 'invalid', 'unavailable')
                and link['state'] in ('online', 'offline', 'unknown') and link['basis'] in ('response', 'heartbeat', 'browser'))
    except (KeyError, TypeError, ValueError): return False


def page_valid(body, legacy=False):
    return (b'id="page-data"' in body and b'cockpit-01' in body) if legacy else b'page--live' in body and b'live-client' in body


def api_paused(data):
    try: return data.get('error') == 'live_public_paused' and datetime.fromisoformat(data['now']).utcoffset() is not None
    except (KeyError, TypeError, ValueError): return False


def _probe_once(item, timeout, legacy=False):
    name, url = item
    started = time.monotonic()
    row = {'name': name, 'url': url, 'http': None, 'bytes': 0}
    try:
        request = Request(url, headers={'Cache-Control': 'no-cache', 'User-Agent': 'CockpitMonitor/1'})
        try:
            response = urlopen(request, timeout=timeout)
        except HTTPError as error:
            response = error
        with response:
            row['http'] = response.status
            body = response.read(MAX_BYTES + 1)
        row['bytes'] = len(body)
        if len(body) > MAX_BYTES:
            row['invalid'] = 'response_too_large'
        elif name == 'page':
            row['valid'] = page_valid(body, legacy)
        elif name == 'api':
            try:
                data = json.loads(body)
            except ValueError:
                data = None
            if not isinstance(data, dict):
                data = {}
            row['valid'], stamp = api_valid(data, legacy)
            row['warming'] = not legacy and row['http'] == 202 and api_warming(data)
            row['paused'] = not legacy and row['http'] == 503 and api_paused(data)
            row['valid'] = row['paused'] or row['warming'] or row['http'] == 200 and row['valid']
            age = (data.get('max_age_seconds') or 120) if legacy else 120
            row['fresh'] = None if row['warming'] or row['paused'] else row['valid'] and -60 <= time.time() - stamp <= age
            if not legacy: row['link_state'] = data['link'].get('state') if isinstance(data.get('link'), dict) else None
        else:
            row['valid'] = b'User-agent:' in body
    except Exception as error:
        row['error'] = type(error).__name__
    row['seconds'] = round(time.monotonic() - started, 3)
    return row


def probe(item, timeout=8, *, legacy=False):
    started = time.monotonic()
    attempts = []
    for _ in range(3):
        row = _probe_once(item, timeout, legacy)
        attempts.append({key: row[key] for key in ('http', 'bytes', 'seconds', 'error') if key in row})
        if row.get('error') not in {'RemoteDisconnected', 'TimeoutError', 'URLError', 'ConnectionResetError',
                                    'ConnectionAbortedError', 'SSLEOFError', 'IncompleteRead'}:
            break
    row['request_seconds'] = row['seconds']
    row['seconds'] = round(time.monotonic() - started, 3)
    row['attempts'] = attempts
    row['bytes'] = sum(attempt['bytes'] for attempt in attempts)
    return row


def verdict(rows):
    control = next(row for row in rows if row['name'] == 'control')
    if control['http'] != 200 or not control.get('valid') or control.get('request_seconds', control['seconds']) >= 8 or any(row.get('error') for row in rows):
        return 'unknown', '本机网络或目标链路未确认，未判为网站故障', 2
    if any(row['http'] != 200 and not (row.get('warming') or row.get('paused')) or not row.get('valid') or row.get('invalid') for row in rows):
        return 'failed', '驾驶舱页面或主接口返回异常，请查看巡检回执', 1
    if any(row.get('paused') for row in rows):
        return 'unknown', '访客读取暂停开放', 2
    if any(row.get('warming') for row in rows):
        return 'unknown', '主接口正在准备首份数据', 2
    if any(row.get('fresh') is False for row in rows):
        return 'unknown', '接口有响应，但当前读数已过期', 2
    if any(row.get('link_state', 'online') != 'online' for row in rows):
        return 'unknown', '云端副本可读，但电脑回源连接不可用', 2
    if any(row.get('request_seconds', row['seconds']) >= 8 for row in rows):
        return 'unknown', '页面和接口可读但本机访问慢，未判为网站故障', 2
    return 'success', '驾驶舱页面和主接口可读，图片不在巡检范围', 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=Path('E:/Data/PCConfig/CockpitMonitor/latest.json'))
    parser.add_argument('--registry', type=Path, default=Path('E:/PCConfig/registries/cockpit_notify.json'))
    args = parser.parse_args()
    urls, legacy = monitor_urls(args.registry)
    with ThreadPoolExecutor(max_workers=3) as pool:
        rows = list(pool.map(lambda item: probe(item, legacy=legacy), urls.items()))
    state, note, code = verdict(rows)
    receipt = {'schema': 'wly.cockpit-monitor.v1', 'state': state, 'note': note, 'observed_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(), 'probes': rows, 'download_bytes': sum(row['bytes'] for row in rows)}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix('.tmp')
    temporary.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    temporary.replace(args.output)
    raise SystemExit(code)

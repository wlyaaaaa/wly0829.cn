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
    'page': 'https://wly0829.cn/cockpit/',
    'api': 'https://live.wly0829.cn/computer-access/state',
    'control': 'https://wly0829.cn/robots.txt',
}


def probe(item, timeout=20):
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
            body = response.read(1024 * 1024 + 1)
        row['bytes'] = len(body)
        if len(body) > 1024 * 1024:
            row['invalid'] = 'response_too_large'
        elif name == 'page':
            row['valid'] = b'id="page-data"' in body and b'cockpit-01' in body
        elif name == 'api':
            try:
                data = json.loads(body)
            except ValueError:
                data = None
            if not isinstance(data, dict):
                data = {}
            stamp = data.get('served_at_unix', data.get('observed_at_unix'))
            row['valid'] = isinstance(data.get('host'), dict) and isinstance(stamp, (int, float))
            age = data.get('max_age_seconds') or 120
            row['fresh'] = row['valid'] and isinstance(age, (int, float)) and -60 <= time.time() - stamp <= age
        else:
            row['valid'] = b'User-agent:' in body
    except Exception as error:
        row['error'] = type(error).__name__
    row['seconds'] = round(time.monotonic() - started, 3)
    return row


def verdict(rows):
    control = next(row for row in rows if row['name'] == 'control')
    if control['http'] != 200 or not control.get('valid') or control['seconds'] >= 8 or any(row.get('error') for row in rows):
        return 'unknown', '本机网络或目标链路未确认，未判为网站故障', 2
    if any(row['http'] != 200 or not row.get('valid') or row.get('invalid') for row in rows):
        return 'failed', '驾驶舱页面或主接口返回异常，请查看巡检回执', 1
    if any(row.get('fresh') is False for row in rows):
        return 'unknown', '接口有响应，但当前读数已过期', 2
    if any(row['seconds'] >= 8 for row in rows):
        return 'unknown', '页面和接口可读但本机访问慢，未判为网站故障', 2
    return 'success', '驾驶舱页面和主接口可读，图片不在巡检范围', 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=Path('E:/Data/PCConfig/CockpitMonitor/latest.json'))
    args = parser.parse_args()
    with ThreadPoolExecutor(max_workers=3) as pool:
        rows = list(pool.map(probe, URLS.items()))
    state, note, code = verdict(rows)
    receipt = {'schema': 'wly.cockpit-monitor.v1', 'state': state, 'note': note, 'observed_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(), 'probes': rows, 'download_bytes': sum(row['bytes'] for row in rows)}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix('.tmp')
    temporary.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    temporary.replace(args.output)
    raise SystemExit(code)

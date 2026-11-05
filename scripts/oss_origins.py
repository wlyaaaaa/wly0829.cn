"""Public read origins; OSS management endpoints and historical proofs stay intact."""
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
MAIN_BUCKET = 'wly0829-img-media-shanghai'
BUCKETS = (MAIN_BUCKET, 'wly0829-assets-shanghai-20261003')
HOST = r'[a-z0-9][a-z0-9-]+\.(?:oss-cn-(?:beijing|shanghai)|cn-(?:beijing|shanghai)\.oss)\.aliyuncs\.com'

def configured_base():
    base = json.loads((ROOT/'config/build.json').read_text('utf8'))['asset_base_url'].rstrip('/')
    if base not in aliases('https://'+MAIN_BUCKET+'.cn-shanghai.oss.aliyuncs.com'):
        raise ValueError('Asset base must name the existing Shanghai website bucket')
    return base

def aliases(base):
    if not isinstance(base, str): return ()
    match = re.fullmatch(r'https://([a-z0-9][a-z0-9-]+)\.(?:oss-cn-(beijing|shanghai)|cn-(beijing|shanghai)\.oss)\.aliyuncs\.com', base)
    if not match: return (base,)
    bucket, old, new = match.groups(); region = old or new
    return (f'https://{bucket}.oss-cn-{region}.aliyuncs.com', f'https://{bucket}.cn-{region}.oss.aliyuncs.com')

def same_bucket(left, right):
    return isinstance(left, str) and left in aliases(right)

def rebase_url(url, base):
    if not url.startswith('https://'): return url
    try: parts = urlsplit(url)
    except ValueError: return url
    origin = parts.scheme+'://'+parts.netloc
    return base+url[len(origin):] if same_bucket(origin, base) else url

def rebase_previous(previous, base):
    if not same_bucket(previous.get('asset_base_url'), base): return previous
    return {**previous, 'asset_base_url': base, **{field: {rel: {**row, 'url': rebase_url(row['url'], base)}
            for rel, row in previous.get(field, {}).items()} for field in ('objects', 'local_objects')}}

def rewrite_origins(text, base=None):
    base = base or configured_base()
    suffix = '.cn-shanghai.oss.aliyuncs.com' if '.cn-shanghai.oss.' in base else '.oss-cn-shanghai.aliyuncs.com'
    for bucket in BUCKETS:
        for old in ('.oss-cn-shanghai.aliyuncs.com', '.cn-shanghai.oss.aliyuncs.com'):
            text = re.sub(r'(?<![A-Za-z0-9.-])'+re.escape(bucket+old)+r'(?![A-Za-z0-9.-])', bucket+suffix, text)
    return text

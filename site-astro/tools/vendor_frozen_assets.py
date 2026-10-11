"""Freeze mutable dependencies once; ordinary builds remain entirely offline."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
IMMUTABLE_ROOTS = (
    'site-astro/sources/frozen-site/', 'site-astro/sources/vendor-deps/',
    'sources/assets/', 'sources/bird/', 'sources/creative/',
    'public/media/', 'public/images/',
)
# These are the existing restore() author-source exceptions, not frozen inputs.
AUTHOR_ROOTS = ('site-astro/sources/retained-home-cockpit/', 'site-astro/public/_home-cockpit/')


def relative(value):
    path = Path(value)
    if not value or '\\' in value or path.is_absolute() or '..' in path.parts or ':' in value:
        raise ValueError('Invalid repository-relative path: ' + value)
    return path.as_posix()


def matches(raw, row):
    return len(raw) == row['bytes'] and hashlib.sha256(raw).hexdigest() == row['sha256']


def mutable(row):
    source = row.get('source_path')
    return bool(source and not relative(source).startswith(IMMUTABLE_ROOTS + AUTHOR_ROOTS))


def published(root):
    spec = importlib.util.spec_from_file_location('frozen_oss_retention', root / 'scripts/oss-retention.py')
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    path = module.shared() / 'published.json'
    return json.loads(path.read_text('utf-8'))['manifest'] if path.is_file() else {}


def recover(rel, row, manifest):
    obj = manifest.get('oss', {}).get('objects', {}).get(rel, {})
    url = obj.get('url')
    if not url and obj.get('key'):
        url = manifest['oss']['asset_base_url'].rstrip('/') + '/' + obj['key']
    if not url:
        raise ValueError('No published object for drifted asset: ' + rel)
    with urlopen(Request(url, headers={'Cache-Control': 'no-cache'}), timeout=30) as response:
        raw = response.read(row['bytes'] + 1)
    if not matches(raw, row):
        raise ValueError('Published bytes differ from frozen manifest: ' + rel)
    return raw


def migrate(root=ROOT, check=False, published_manifest=None):
    root = Path(root)
    path = root / 'site-astro/sources/frozen-site/manifest.json'
    manifest = json.loads(path.read_text('utf-8'))
    pending, recovered = [], []
    for rel, row in manifest['assets'].items():
        if not mutable(row):
            continue
        if check:
            raise ValueError('Mutable frozen asset source: ' + rel + ' <- ' + row['source_path'])
        source = root / relative(row['source_path'])
        raw = source.read_bytes() if source.is_file() else b''
        if not matches(raw, row):
            if published_manifest is None:
                published_manifest = published(root)
            raw = recover(rel, row, published_manifest)
            recovered.append(rel)
        target = root / 'site-astro/sources/vendor-deps' / relative(rel)
        if target.is_file() and not matches(target.read_bytes(), row):
            raise ValueError('Existing vendor bytes differ: ' + rel)
        pending.append((target, row, raw))
    # Validate every input before any write, so drift cannot leave a half-migrated manifest.
    for target, row, raw in pending:
        if not target.is_file():
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
        del row['source_path']
    if pending:
        path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    return {'migrated': len(pending), 'bytes': sum(len(raw) for _, _, raw in pending), 'recovered': recovered}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    parser.add_argument('--check', action='store_true', help='校验清单，不写文件、不联网')
    args = parser.parse_args()
    print(json.dumps(migrate(args.root, args.check), ensure_ascii=False))

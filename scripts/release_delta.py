"""Sparse preparation files; the complete release is materialized by hybrid once."""
import hashlib
import json
import os
from pathlib import Path
import shutil
from functools import lru_cache

MANIFEST = 'release-manifest.json'
LEDGER = '.release-delta.json'

def proof(body):
    return {'sha256': hashlib.sha256(body).hexdigest(), 'bytes': len(body)}

@lru_cache(maxsize=32)
def sources(root):
    ledger = Path(root) / LEDGER
    return json.loads(ledger.read_text('utf8')) if ledger.is_file() else None

def source_path(root, rel):
    root = Path(root).resolve()
    if rel == MANIFEST:
        return root / rel
    delta = sources(root)
    return Path(delta['sources'].get(rel, str(Path(delta['baseline']) / rel))) if delta else root / rel

def inventory(root):
    root = Path(root).resolve()
    if sources(root):
        return dict(sorted(json.loads((root / MANIFEST).read_text('utf8'))['files'].items()))
    return dict(sorted({p.relative_to(root).as_posix(): proof(p.read_bytes()) for p in root.rglob('*')
                       if p.is_file() and p.name not in (MANIFEST, LEDGER)}.items()))

def write_changes(source, output, updates, copy_asset=shutil.copy2, delta=False):
    source, output = Path(source).resolve(), Path(output).resolve()
    before = inventory(source)
    changes = {rel: body for rel, body in updates.items() if proof(body) != before.get(rel)}
    if delta or os.environ.get('WLY_RELEASE_DELTA') == '1':
        output.mkdir(parents=True, exist_ok=True)
        previous = sources(source) or {'baseline': str(source), 'sources': {}}
        paths = dict(previous['sources'])
        for rel in changes:
            paths[rel] = str(output / rel)
        (output / LEDGER).write_text(json.dumps({'baseline': previous['baseline'], 'sources': paths}), 'utf8')
        sources.cache_clear()
    else:
        shutil.copytree(source, output, copy_function=copy_asset)
    for rel, body in changes.items():
        target = output / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(body)
    return dict(sorted({**before, **{rel: proof(body) for rel, body in changes.items()}}.items()))

def stable_evidence(value, repository):
    if isinstance(value, list):
        return [stable_evidence(item, repository) for item in value]
    if not isinstance(value, dict):
        return value
    if value.get('schema')=='wly.creative-replay-result.v1':
        steps=[{key:item for key,item in step.items() if key not in ('seconds','manifest')} for step in value['steps']]
        value={**value,'steps':steps}
    result = {}
    for key, item in value.items():
        if isinstance(key,str) and Path(key).is_absolute() and isinstance(item,dict) and 'sha256' in item:
            try:
                key = Path(key).relative_to(repository).as_posix()
            except ValueError:
                key = 'release-input/' + item['sha256'] + '/' + Path(key).name
        if key in {'path', 'source_path', 'source_root', 'baseline', 'output', 'candidate', 'recipe_path', 'package_path', 'site'} and isinstance(item, str) and Path(item).is_absolute():
            path = Path(item)
            try:
                item = path.relative_to(repository).as_posix()
            except ValueError:
                identity=value.get('sha256') or value.get('baseline_release_id') or value.get('raw_release_id')
                item = 'release-input/' + (identity or path.name) + ('/'+path.name if identity and key!='source_root' else '')
        result[key] = stable_evidence(item, repository)
    return result

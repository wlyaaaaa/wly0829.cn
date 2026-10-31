"""Stable identity of Markdown that can affect native rendering.

The converter's audit timestamp is not displayed and must not invalidate a
page. Keep every other frontmatter field and the complete body in the key.
"""
import hashlib
import json
import re
from pathlib import Path


# One-time bridge from the cache written by 4b575598. The renderer-file guard
# disables it after any subsequent render_blocks.py edit; changes in
# src/typeset still change libfp and therefore cannot reuse old geometry.
LEGACY_RENDERER_CODE_FP = '3c3d79f44efc6362'
MIGRATION_RENDERER_SHA256 = '628347c6ae35c06db43243b9460aeeaef02aad23c57faf32c6b2e9a45dfe34ac'


def legacy_renderer_compatible(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest() == MIGRATION_RENDERER_SHA256


def promote_legacy_cache(cache, jobs):
    count = 0
    for job in jobs:
        if job['key'] not in cache and job.get('legacy_key') in cache:
            cache[job['key']] = cache[job['legacy_key']]
            count += 1
    return count


def markdown_render_sha(path):
    source = Path(path).read_text('utf8')
    match = re.match(r'^---\n(.*?)\n---\n', source, re.S)
    if not match:
        raise ValueError('Missing JSON frontmatter: ' + str(path))
    metadata = json.loads(match.group(1))
    metadata.get('source', {}).pop('converted_at_beijing', None)
    normalized = json.dumps(metadata, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256((normalized + source[match.end():]).encode('utf8')).hexdigest()

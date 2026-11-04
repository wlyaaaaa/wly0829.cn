"""Stable identity of Markdown that can affect native rendering.

The converter's audit timestamp is not displayed and must not invalidate a
page. Keep every other frontmatter field and the complete body in the key.
"""
import hashlib
import json
import re
from pathlib import Path


# Reuse both earlier key formats while checkpoint persistence changes no
# geometry. The exact renderer-file guard disables this bridge after later
# renderer edits; src/typeset changes still change libfp and invalidate it.
LEGACY_RENDERER_CODE_FP = '3c3d79f44efc6362'
PRE_CHECKPOINT_CODE_FP = '5bea67d3c8ff931a'
MIGRATION_RENDERER_SHA256 = '3d55e1de753a961e8558b7952ec62a07a7f2ef80f686417b291f27e6b92eefbe'


def legacy_renderer_compatible(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest() == MIGRATION_RENDERER_SHA256


def promote_legacy_cache(cache, jobs):
    count = 0
    for job in jobs:
        for field in ('prior_key', 'legacy_key'):
            if job['key'] not in cache and job.get(field) in cache:
                cache[job['key']] = cache[job[field]]
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

"""Cached WOFF2 subsets and mutually exclusive Unicode shards for site assembly."""
import hashlib
import shutil
import sys
from functools import lru_cache
from importlib.metadata import version
from pathlib import Path
from uuid import uuid4

from fontTools import subset, __version__ as FONTTOOLS_VERSION
from fontTools.ttLib import TTFont


def fixed_source(record, directory):
    """Use the pinned local copy, or recover only identical bytes from this computer."""
    target = Path(directory) / record['file']
    expected, registered = record['sha256'], Path(record['source'])
    def matches(path):
        return path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() == expected
    if target.exists():
        if not matches(target):
            raise ValueError(f'原字体已变化：{target}；登记 SHA-256 {expected}；原路径 {registered}，未覆盖本机副本')
        return target
    candidates = [registered]
    if registered.parent.name.startswith('Microsoft.WindowsTerminal_'):
        candidates.extend(sorted(registered.parent.parent.glob('Microsoft.WindowsTerminal_*/' + registered.name)))
    source = next((path for path in candidates if matches(path)), None)
    if source is None:
        raise ValueError(f'找不到登记原字体 {record["file"]}；SHA-256 {expected}；查找 {registered}'
                         + (' 及同级 Microsoft.WindowsTerminal_* 版本目录' if len(candidates) > 1 or registered.parent.name.startswith('Microsoft.WindowsTerminal_') else ''))
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    print(f'原字体取回：{target.name} ← {source}', flush=True)
    return target


@lru_cache(maxsize=None)
def _source(source, cache, font_number):
    raw = source.read_bytes()
    key = hashlib.sha256(raw + f'{font_number}|{FONTTOOLS_VERSION}'.encode()).hexdigest()
    decoded = cache / 'sources' / (key + '.ttf')
    if not decoded.is_file():
        decoded.parent.mkdir(parents=True, exist_ok=True)
        with TTFont(source, fontNumber=font_number, recalcBBoxes=False,
                    recalcTimestamp=False) as font:
            font.flavor = None
            font.flavorData = None
            temporary = decoded.with_name(key + '.' + uuid4().hex + '.tmp.ttf')
            font.save(temporary)
        temporary.replace(decoded)
    with TTFont(decoded, recalcBBoxes=False, recalcTimestamp=False) as font:
        cmap = frozenset(font.getBestCmap())
    return key, decoded, cmap


def decoded_source(source, cache, font_number=-1):
    return _source(Path(source).resolve(), Path(cache).resolve().parent, font_number)[1]


def source_cmap(source, cache, font_number=-1):
    """The source's supported codepoints, before intersecting page characters."""
    return _source(Path(source).resolve(), Path(cache).resolve(), font_number)[2]


def partition(cmap, core):
    """Stable 128-codepoint buckets: changing core does not renumber other shards."""
    core = set(cmap) & set(core)
    parts = {'core': core}
    for codepoint in sorted(set(cmap) - core):
        parts.setdefault(f'u{codepoint // 128:04x}', set()).add(codepoint)
    return parts


def unicode_range(cmap):
    ranges = []
    for codepoint in sorted(cmap):
        if ranges and codepoint == ranges[-1][1] + 1:
            ranges[-1][1] = codepoint
        else:
            ranges.append([codepoint, codepoint])
    return ','.join(f'U+{start:X}' + (f'-{end:X}' if start != end else '')
                    for start, end in ranges)


@lru_cache(maxsize=1)
def _tool_key():
    return (FONTTOOLS_VERSION + '|' + version('brotli')).encode() + Path(__file__).read_bytes()


def build_font(source, chars, cache, font_number=-1):
    """Return (cached WOFF2, cmap). Caller can report source-external characters."""
    cache = Path(cache).resolve()
    source_key, decoded, available = _source(Path(source).resolve(), cache, font_number)
    requested = available if chars is None else {ord(c) if isinstance(c, str) else c for c in chars}
    expected = set(requested) & available
    glyphs = ','.join(f'{n:x}' for n in sorted(expected)).encode()
    key = hashlib.sha256(source_key.encode() + glyphs + _tool_key()).hexdigest()
    target = cache / (key + '.woff2')
    if not target.is_file():
        with TTFont(decoded, recalcBBoxes=False, recalcTimestamp=False) as font:
            font.flavor = 'woff2'
            options = subset.Options(layout_features=['*'], retain_gids=False, glyph_names=True,
                                     legacy_kern=True, notdef_outline=True, recommended_glyphs=True)
            tool = subset.Subsetter(options=options)
            tool.populate(unicodes=expected)
            tool.subset(font)
            # Bidi closure retains mirrored glyphs; they must not overlap another shard's cmap.
            for table in font['cmap'].tables:
                if table.isUnicode() and table.format != 14:
                    table.cmap = {u: g for u, g in table.cmap.items() if u in expected}
            temporary = target.with_name(key + '.' + uuid4().hex + '.tmp.woff2')
            font.save(temporary)
        with TTFont(temporary) as font:
            actual = set(font.getBestCmap())
        if actual != expected:
            temporary.unlink()
            raise ValueError(f'{Path(source).name} 字体子集 cmap 不符：'
                             f'缺 {sorted(expected - actual)}，多 {sorted(actual - expected)}')
        temporary.replace(target)
    return target, expected


def main():
    source, target, characters = map(Path, sys.argv[1:])
    cached, _ = build_font(source, characters.read_text(encoding='utf-8'), target.parent)
    if cached.resolve() != target.resolve():
        shutil.copy2(cached, target)


if __name__ == '__main__':
    main()

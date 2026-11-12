"""Check the shared typesetting v1 inputs; --write seals an accepted generation."""
import argparse
import hashlib
from importlib.metadata import version
import json
from pathlib import Path
import platform
import sys

ROOT = Path(__file__).resolve().parents[1]
LOCK = 'config/typeset.lock.json'
INPUTS = (
    'src/typeset', 'config/render.lock.json',
    'site-astro/tools/render_blocks.py', 'site-astro/tools/convert_page.py',
    'site-astro/tools/render_cache.py', 'site-astro/tools/site_consistency.py',
    'site-astro/src/styles/typeset-page.css',
)
PACKAGES = ('playwright', 'Pillow', 'fonttools', 'brotli', 'numpy', 'beautifulsoup4')


def snapshot(root=ROOT):
    files = {}
    for relative in INPUTS:
        source = root / relative
        if not source.exists():
            raise ValueError('共用排版文件缺失：' + relative)
        for path in sorted(source.rglob('*')) if source.is_dir() else [source]:
            if not path.is_file() or '__pycache__' in path.parts or path.suffix in {'.pyc', '.pyo'}:
                continue
            files[path.relative_to(root).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return {'schema': 'wly.typeset-lock.v1', 'version': 1, 'files': files,
            'runtime': {'python': platform.python_version(), **{name: version(name) for name in PACKAGES}}}


def verify_typeset_lock(root=ROOT):
    path = root / LOCK
    if not path.is_file():
        raise ValueError('缺少共用排版锁：' + LOCK)
    locked = json.loads(path.read_text('utf8'))
    if locked.get('schema') != 'wly.typeset-lock.v1' or locked.get('version') != 1:
        raise ValueError('共用排版锁版本不符：' + LOCK)
    current = snapshot(root)
    changed = [name for name in sorted(locked['files'].keys() | current['files'].keys())
               if locked['files'].get(name) != current['files'].get(name)]
    changed += ['运行依赖 ' + name + ': ' + str(locked['runtime'].get(name)) + ' -> ' + str(value)
                for name, value in current['runtime'].items() if locked['runtime'].get(name) != value]
    if changed:
        raise ValueError('共用排版层第 1 版不符：\n' + '\n'.join(changed)
                         + '\n先验收全站重排的说明页成品逐字节不变，再更新 ' + LOCK)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true',
                        help='Only after accepting a byte-identical full explanation-page generation')
    args = parser.parse_args()
    if args.write:
        sys.path.insert(0, str(ROOT / 'site-astro/tools'))
        from render_blocks import verify_render_lock
        verify_render_lock()
        (ROOT / LOCK).write_text(json.dumps(snapshot(), ensure_ascii=False, sort_keys=True, separators=(',', ':')) + '\n',
                                 encoding='utf8', newline='\n')
        print('已记录共用排版层第 1 版：' + LOCK)
    else:
        verify_typeset_lock()
        print('共用排版层第 1 版指纹通过')


if __name__ == '__main__':
    main()

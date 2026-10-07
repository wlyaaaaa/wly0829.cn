"""小鸟带路样板包：从源码构建引擎和鸟，给选定的页生成带落点的活画配置，写成可用现有移植脚本挂载的本地包。

  python scripts/build_bird_guide.py --pages localocr how-this-site --cache <流水线 http-cache> --own-cache <任务缓存>

输入（只读）：
  living-prepared/bird-guide/sources/   bird.src.js（含带路的飞行能力）、bird-guide.src.js（带路规则）、living.js（挂载钩子）、living.css、bird-atlas.json
  living-prepared/bird-fixed/           第一步的包：图集原字节、各页现有配置与遮罩、页面模板（只用来取 page-data 和做挂载样板）
输出：
  living-prepared/bird-guide/assets/_living/_engine/{living.<指纹>.js, living.<指纹>.css, bird.<指纹>/bird.js, bird.<指纹>/bird-atlas.webp}
  living-prepared/bird-guide/assets/_living/<页>/bird-guide.<指纹>/config.json（原配置 + guide 字段）及原遮罩
  living-prepared/bird-guide/references.json（和 bird-fixed 同一结构，scripts/apply_bird_fixed_upgrade.py 直接可用）
不发布、不上传；样板页 HTML 由 apply_bird_fixed_upgrade.py 另行写出。
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
sys.path.insert(0, str(HERE))
import bird_guide_perches as perches  # noqa: E402

SRC = REPO / 'living-prepared/bird-guide/sources'
BASE = REPO / 'living-prepared/bird-fixed'
OUT = REPO / 'living-prepared/bird-guide'


def esbuild_path():
    """压缩用 esbuild：先看环境变量 ESBUILD_PATH，再找全局 npm 里的 esbuild 或 tsx 自带的那份。"""
    import os
    if os.environ.get('ESBUILD_PATH'):
        return os.environ['ESBUILD_PATH']
    root = Path(subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True, shell=os.name == 'nt').stdout.strip())
    for p in (root / 'esbuild', root / 'tsx/node_modules/esbuild'):
        if (p / 'package.json').exists():
            return p.as_posix()
    raise SystemExit('找不到 esbuild：设置 ESBUILD_PATH，或全局安装 esbuild')


def sha(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def facts(p: Path):
    b = p.read_bytes()
    return {'bytes': len(b), 'sha256': sha(b)}


def beijing_now():
    return datetime.now(timezone(timedelta(hours=8))).strftime('%Y-%m-%d %H:%M')


def minify(code: str, loader: str, target: str) -> bytes:
    js = ("const e=require(%s);let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{process.stdout.write("
          "e.transformSync(s,{minify:true,loader:%s,target:%s,charset:'utf8',legalComments:'none'}).code);});"
          % (json.dumps(esbuild_path()), json.dumps(loader), json.dumps(target)))
    r = subprocess.run(['node', '-e', js], input=code.encode('utf-8'), capture_output=True, check=True)
    return r.stdout


def build_engine(dist: Path, base_refs: dict):
    """鸟：图集坐标填进源码、去掉只给逐格录像用的测试段，再接上带路规则；引擎：填上鸟的指纹目录名。"""
    j = json.loads((SRC / 'bird-atlas.json').read_text('utf-8'))
    atlas = dict(image=j['image'], size=j['size'], standH=j['standH'], body=[round(x) for x in j['bodyFromFeet']],
                 poses={k: [p['x'], p['y'], p['w'], p['h'], round(p['ax']), round(p['ay']), int(p['kind'] == 'body')]
                        for k, p in j['poses'].items()})
    bird_src = (SRC / 'bird.src.js').read_text('utf-8').replace('__ATLAS__', json.dumps(atlas, separators=(',', ':')))
    bird_src = re.sub(r'/\*TEST\*/[\s\S]*?/\*END\*/', '', bird_src)
    bird_src += '\n' + (SRC / 'bird-guide.src.js').read_text('utf-8')
    bird_js = minify(bird_src, 'js', 'es2017')
    old_bird = base_refs['current_engine']['bird'].rstrip('/')
    atlas_bytes = (BASE / 'assets/_living/_engine' / old_bird / 'bird-atlas.webp').read_bytes()
    bird_dir = 'bird.' + sha(bird_js + atlas_bytes)[:10]
    engine = dist / '_living/_engine'
    (engine / bird_dir).mkdir(parents=True, exist_ok=True)
    (engine / bird_dir / 'bird.js').write_bytes(bird_js)
    (engine / bird_dir / 'bird-atlas.webp').write_bytes(atlas_bytes)
    raw = (SRC / 'living.js').read_bytes()
    token = "const BIRD_DIR = 'bird/';"
    text = raw.decode('utf-8')
    if text.count(token) != 1:
        raise SystemExit('引擎源码里找不到鸟目录名的位置')
    js = minify(text.replace(token, "const BIRD_DIR = '%s/';" % bird_dir), 'js', 'es2019')
    css = minify((SRC / 'living.css').read_text('utf-8'), 'css', 'es2019')
    if len(js) + len(css) > 150000:
        raise ValueError('引擎脚本+样式超过 150KB')
    js_name = 'living.' + sha(js)[:10] + '.js'
    css_name = 'living.' + sha(css)[:10] + '.css'
    (engine / js_name).write_bytes(js)
    (engine / css_name).write_bytes(css)
    return {'engine': js_name, 'style': css_name, 'bird': bird_dir + '/',
            'engine_source_sha256': sha(raw), 'bird_source_sha256': sha((SRC / 'bird.src.js').read_bytes()),
            'guide_source_sha256': sha((SRC / 'bird-guide.src.js').read_bytes()),
            'files': {p.relative_to(engine).as_posix(): p.stat().st_size for p in sorted(engine.rglob('*')) if p.is_file()},
            'sizes': {'engine_total': len(js) + len(css), 'bird_js': len(bird_js), 'bird_atlas': len(atlas_bytes)},
            'atlas_identical_to': old_bird + '/bird-atlas.webp',
            'built_at_beijing': beijing_now()}


def build_page(row: dict, dist: Path, images, sil):
    """原配置 + guide → 新的内容寻址配置目录；遮罩等其它文件原样带上。"""
    cfg_url = row['config']
    src_dir = BASE / 'assets' / cfg_url.lstrip('/').rsplit('/', 1)[0]
    cfg = json.loads((src_dir / 'config.json').read_text('utf-8'))
    html = (BASE / 'pages' / row['route']).read_bytes()
    guide, stats = perches.build(html, cfg, images, sil)
    cfg['guide'] = guide
    data = (json.dumps(cfg, ensure_ascii=False, separators=(',', ':')) + '\n').encode('utf-8')
    rel = '_living/%s/bird-guide.%s' % (row['page'], sha(data)[:12])
    target = dist / rel
    target.mkdir(parents=True, exist_ok=True)
    (target / 'config.json').write_bytes(data)
    for p in src_dir.iterdir():
        if p.is_file() and p.name != 'config.json':
            shutil.copyfile(p, target / p.name)
    return {'page': row['page'], 'route': row['route'], 'config': '/' + rel + '/config.json',
            'previous_config': cfg_url, 'template': row['template'], 'guide': stats,
            'config_facts': facts(target / 'config.json'),
            'transplant': 'dependency attributes only (engine src, bird dir, config URL); keep latest body, images, binding and hotspots'}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--pages', nargs='+', required=True)
    ap.add_argument('--cache', type=Path, action='append', default=[])
    ap.add_argument('--own-cache', type=Path)
    a = ap.parse_args()
    base_refs = json.loads((BASE / 'references.json').read_text('utf-8'))
    rows = {r['page']: r for r in base_refs['mounted']}
    missing = [p for p in a.pages if p not in rows]
    if missing:
        raise SystemExit('这些页不在第一步已挂载的范围：' + ', '.join(missing))
    dist = OUT / 'assets'
    dist.mkdir(parents=True, exist_ok=True)   # 不删旧成品（任务文件只进回收站）；本次没写到的旧文件会列出来，由人放回收站
    before = {p for p in dist.rglob('*') if p.is_file()}
    started = __import__('time').time()
    engine = build_engine(dist, base_refs)
    images = perches.Images(a.cache, a.own_cache)
    sil = perches.Silhouette(SRC / 'bird-atlas.json', dist / '_living/_engine' / engine['bird'] / 'bird-atlas.webp')
    mounted = [build_page(rows[p], dist, images, sil) for p in a.pages]
    written = sorted(p for p in dist.rglob('*') if p.is_file() and p.stat().st_mtime >= started - 1)
    stale = sorted(p.relative_to(dist).as_posix() for p in before if p not in set(written))
    objects = {p.relative_to(dist).as_posix(): facts(p) for p in written}
    refs = {
        'schema': 'wly.bird-guide-local-sample.v1',
        'status': 'prepared-local-sample',
        'base_packet': 'living-prepared/bird-fixed',
        'base_commit': '70082645dcf8a2301d1f55732d5783ccab76fdbd',
        'publication_owner': 'integration-2',
        'previous_engine': base_refs['current_engine'],
        'current_engine': engine,
        'engine_url': '/_living/_engine/' + engine['engine'],
        'bird_sprites_url': '/_living/_engine/' + engine['bird'],
        'mounted': mounted,
        'staged': [],
        'objects': objects,
        'sources': {p.relative_to(OUT).as_posix(): facts(p) for p in sorted((OUT / 'sources').iterdir())},
        'external_actions_performed': [],
        'built_at_beijing': beijing_now(),
    }
    (OUT / 'references.json').write_text(json.dumps(refs, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'engine': engine['engine'], 'bird': engine['bird'], 'sizes': engine['sizes'],
                      'pages': {m['page']: m['guide'] for m in mounted}, 'fetched_images': images.fetched,
                      'stale_not_rewritten': stale}, ensure_ascii=False))


if __name__ == '__main__':
    main()

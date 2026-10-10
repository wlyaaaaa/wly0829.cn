"""恢复仓库中已选的首页、驾驶舱入口，或显式从新候选站生成下一份输入。

无参数：从 sources/retained-home-cockpit 恢复两份 HTML、清单与首帧脚本。
带候选站构建目录：复制实际依赖并执行既有首帧补丁；只读候选站。
图片始终逐字节复制并核验 SHA256，不转码、不改尺寸。
"""
import argparse
import concurrent.futures
import hashlib
import html
import json
import re
import importlib.util
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parent))
from home_firstpaint import adjust_home, install_frozen_engine

ROOT = Path(__file__).resolve().parents[1]
TEXT = {'.html', '.css', '.js', '.json', '.svg'}
RESOURCE = {'.css', '.js', '.json', '.svg', '.png', '.webp', '.avif', '.jpg', '.jpeg', '.woff', '.woff2'}


def descriptor(raw):
    return {'sha256': hashlib.sha256(raw).hexdigest(), 'bytes': len(raw)}


def materialize_frozen(site=ROOT, snapshot=None):
    """只恢复版本化入口本体；清单列出的素材由发布流程按原 SHA 复用。"""
    source = Path(snapshot) if snapshot is not None else Path(site) / 'sources/retained-home-cockpit'
    manifest_bytes = (source / 'manifest.json').read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get('schema') != 'wly.retained-home-cockpit.v1' or set(manifest.get('pages', {})) != {'home', 'cockpit'}:
        raise ValueError('首页和驾驶舱缺少版本化入口清单')
    if manifest['count'] != len(manifest['files']) or manifest['bytes'] != sum(row['bytes'] for row in manifest['files'].values()):
        raise ValueError('首页和驾驶舱依赖清单计数不同')
    pages = {}
    for page in ('home', 'cockpit'):
        raw = (source / (page + '.html')).read_bytes()
        if descriptor(raw) != manifest['pages'][page]:
            raise ValueError('冻结页面的字节不同：' + page)
        pages[page] = raw
    # 首帧脚本只能来自版本化包；已有 ignored public 文件不能令缺源的重建通过。
    firstpaint = install_frozen_engine(pages['home'].decode('utf-8'), source, Path(site) / 'public', manifest)
    for relative, entry in manifest['bundled'].items():
        if relative == firstpaint:
            continue
        raw = (source / entry['source']).read_bytes()
        if descriptor(raw) != {key: entry[key] for key in ('sha256', 'bytes')} or descriptor(raw) != manifest['files'][relative]:
            raise ValueError('冻结页面辅助文件的字节不同：' + relative)
        target = Path(site) / 'public' / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if not target.exists() or target.read_bytes() != raw:
            target.write_bytes(raw)
        if target.read_bytes() != raw:
            raise ValueError('冻结页面辅助文件复制核验失败：' + relative)
    output = Path(site) / 'src/chrome/retained'
    output.mkdir(parents=True, exist_ok=True)
    for page, raw in pages.items():
        target = output / (page + '.html'); target.write_bytes(raw)
        if target.read_bytes() != raw:
            raise ValueError('冻结页面复制核验失败：' + page)
    (output / 'manifest.json').write_bytes(manifest_bytes)
    if (output / 'manifest.json').read_bytes() != manifest_bytes:
        raise ValueError('冻结入口清单复制核验失败')
    return manifest


def materialize_dependencies(site=ROOT):
    """Restore only the versioned asset closure, reusing exact existing bytes."""
    site = Path(site); repo = site.parent
    path = site/'sources/retained-home-cockpit/dependencies.json'
    rows = json.loads(path.read_text('utf8'))
    sys.path.insert(0, str(repo/'scripts'))
    spec = importlib.util.spec_from_file_location('retained_oss', repo/'scripts/prepare-oss-release.py')
    oss = importlib.util.module_from_spec(spec); spec.loader.exec_module(oss)
    def restore(item):
        rel, row = item; target = site/'public'/rel
        if not target.is_relative_to(site/'public'): raise ValueError('Invalid retained asset path: '+rel)
        if target.is_file() and descriptor(target.read_bytes()) == {key: row[key] for key in ('sha256','bytes')}: return 0
        if 'source_path' in row:
            raw = (repo/row['source_path']).read_bytes()
            if descriptor(raw) != {key: row[key] for key in ('sha256','bytes')}: raise ValueError('Versioned retained asset changed: '+rel)
            target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(raw)
        else:
            obj = {**row, 'url': row['verified_url'], 'content_type': oss.content_type(rel)}
            oss.verify_object_with_retries(None, rel, obj, 'https://wly0829.cn', 60, download_to=target)
        if descriptor(target.read_bytes()) != {key: row[key] for key in ('sha256','bytes')}: raise ValueError('Retained asset copy changed: '+rel)
        return row['bytes']
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        pending = {pool.submit(restore, item): item[0] for item in rows.items()}
        restored, failed = [], []
        for future in concurrent.futures.as_completed(pending):
            try: restored.append(future.result())
            except (OSError, ValueError) as error: failed.append(pending[future] + ': ' + str(error))
    if failed: raise ValueError('Retained assets unavailable: ' + '; '.join(failed))
    return {'files': len(rows), 'restored_bytes': sum(restored), 'source_sha256': hashlib.sha256(path.read_bytes()).hexdigest()}


def retain_candidate(source):
    """显式选定新候选站时重建；不把旧首页或不同 HeroLive 当成已选样板。"""
    source = Path(source).resolve(); public = ROOT / 'public'
    copied, pending = {}, []

    def copy_file(path):
        path = path.resolve()
        if not path.is_file() or not path.is_relative_to(source):
            return
        rel = path.relative_to(source).as_posix()
        if rel in copied:
            return
        raw = path.read_bytes(); dst = public / rel
        dst.parent.mkdir(parents=True, exist_ok=True); dst.write_bytes(raw)
        if dst.read_bytes() != raw:
            raise RuntimeError(f'复制校验失败：{rel}')
        copied[rel] = descriptor(raw)
        # 路由目录和搜索资料描述其他页面，并不是这两页的素材依赖。
        if path.suffix in TEXT and not (rel.startswith('_album/routes-') or path.name.startswith(('search-', 'resource-retry-'))):
            pending.append(path)

    def references(text, bases):
        text = html.unescape(text).replace('\\/', '/')
        names = re.findall(r'''(?:["'`(\s=])((?:/|\./|\.\./|[\w-]+/)[^\s"'`<>),;]+)''', text)
        for name in names:
            parsed = urlsplit(name)
            if parsed.scheme or parsed.netloc:
                continue
            name = unquote(parsed.path)
            for base in ([source] if name.startswith('/') else bases):
                target = (base / name.lstrip('/')).resolve()
                if target.suffix in RESOURCE and target.is_file() and target.is_relative_to(source):
                    copy_file(target); break

    output = ROOT / 'src/chrome/retained'; output.mkdir(parents=True, exist_ok=True)
    inputs = {}
    for page, rel in [('home', 'index.html'), ('cockpit', 'cockpit/index.html')]:
        path = source / rel; raw = path.read_bytes()
        (output / f'{page}.html').write_bytes(raw); inputs[page] = descriptor(raw)
        references(raw.decode('utf-8'), [path.parent])
    # 独立动效包运行时拼接路径取图，保留其完整原生包边界。
    for rel in ['_shared/home-living', '_shared/home-comic', '_living/cockpit',
                '_typeset/cockpit', '_typeset/home-highlights', '_living/_engine']:
        for path in (source / rel).rglob('*'):
            copy_file(path)
    while pending:
        path = pending.pop()
        references(path.read_text(encoding='utf-8'), [path.parent, source, source / 'cockpit'])
    home = output / 'home.html'
    home.write_text(adjust_home(home.read_text(encoding='utf-8'), source, public), encoding='utf-8', newline='')
    subprocess.run([sys.executable, str(ROOT / 'tools/pack_living.py')], check=True)
    engine = json.loads((ROOT / 'src/chrome/living-engine.json').read_text(encoding='utf-8'))
    cockpit = output / 'cockpit.html'
    cockpit.write_text(cockpit.read_text(encoding='utf-8').replace(engine['deployed'], engine['fixed']), encoding='utf-8', newline='')
    firstpaint = re.search(r'/(_home-cockpit/home-firstpaint-[a-f0-9]+\.js)', home.read_text('utf-8'))[1]
    for rel in (firstpaint, '_living/_engine/' + engine['fixed']):
        copied[rel] = descriptor((public / rel).read_bytes())
    manifest = {'schema': 'wly.retained-home-cockpit.v1', 'inputs': inputs,
        'pages': {page: descriptor((output / (page + '.html')).read_bytes()) for page in inputs},
        'files': copied, 'count': len(copied), 'bytes': sum(row['bytes'] for row in copied.values())}
    (output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    return manifest


def finalize_runtime(site=ROOT):
    """从实际生成页和保留正式页更新翻页预热表，不保留旧整屏图引用。"""
    site = Path(site); dist = site / 'dist'; routes = {}; pages = {}
    for base in (site.parent / 'site-release', dist):
        for path in base.rglob('*.html'):
            rel = path.relative_to(base).as_posix()
            route = '/' if rel == 'index.html' else '/' + rel[:-10] if rel.endswith('/index.html') else '/' + rel
            body = path.read_text('utf-8')
            match = re.search(r'<script\b[^>]*id="album-page"[^>]*>(.*?)</script>', body, re.S)
            routes[route] = {'images': json.loads(match[1]).get('images', []) if match else []}
            if base == dist: pages[path] = body
    old = {value for body in pages.values() for value in re.findall(r'/_album/routes-[a-f0-9]+\.json', body)}
    if not old: return {'routes': len(routes), 'updated_pages': 0}
    raw = (json.dumps({'schema': 'wly.album-routes.v1', 'routes': routes}, ensure_ascii=False, sort_keys=True, separators=(',', ':')) + '\n').encode('utf8')
    address = '/_album/routes-' + hashlib.sha256(raw).hexdigest()[:20] + '.json'
    target = dist / address.lstrip('/'); target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(raw)
    changed = 0
    for path, body in pages.items():
        updated = body
        for previous in old: updated = updated.replace(previous, address)
        if updated != body: path.write_bytes(updated.encode('utf8')); changed += 1
    for previous in old - {address}:
        obsolete = dist / previous.lstrip('/')
        if obsolete.is_file(): obsolete.unlink()
    return {'routes': len(routes), 'updated_pages': changed, 'resource': address, **descriptor(raw)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('candidate', nargs='?', type=Path)
    parser.add_argument('--site-root', type=Path, default=ROOT, help='仅冻结入口恢复使用的站点目录')
    parser.add_argument('--snapshot', type=Path, help='版本化入口包；默认取站点 sources/retained-home-cockpit')
    parser.add_argument('--assets', action='store_true', help='恢复全站固定运行件与首页素材闭包')
    parser.add_argument('--finalize', action='store_true', help='按构建后的实际页面更新翻页预热表')
    args = parser.parse_args()
    if args.finalize:
        print(json.dumps(finalize_runtime(args.site_root), ensure_ascii=False)); return
    if args.candidate and (args.site_root != ROOT or args.snapshot):
        parser.error('新候选站重出使用当前站点，不接受冻结入口参数')
    manifest = retain_candidate(args.candidate) if args.candidate else materialize_frozen(args.site_root, args.snapshot)
    if args.assets:
        print(json.dumps(materialize_dependencies(args.site_root), ensure_ascii=False))
        import astro_rules
        astro_rules.generate(args.site_root / 'public')
    print(json.dumps({key: manifest[key] for key in ('pages', 'count', 'bytes')}, ensure_ascii=False))


if __name__ == '__main__':
    main()

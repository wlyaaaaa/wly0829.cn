"""恢复仓库中已选的首页、驾驶舱入口，或显式从新候选站生成下一份输入。

无参数：从 sources/retained-home-cockpit 恢复三份 HTML、清单与首帧脚本。
带候选站构建目录：复制实际依赖并执行既有首帧补丁；只读候选站。
原依赖逐字节复制；首页白色外设由当前审定母图按既有配方生成。
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
from runpy import run_path
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
    if manifest.get('schema') != 'wly.retained-home-cockpit.v1' or set(manifest.get('pages', {})) != {'home', 'cockpit', 'computer-access'}:
        raise ValueError('首页、驾驶舱和授权页缺少版本化入口清单')
    if manifest['count'] != len(manifest['files']) or manifest['bytes'] != sum(row['bytes'] for row in manifest['files'].values()):
        raise ValueError('首页和驾驶舱依赖清单计数不同')
    pages = {}
    for page in ('home', 'cockpit', 'computer-access'):
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
    for page, rel in [('home', 'index.html'), ('cockpit', 'cockpit/index.html'), ('computer-access', 'computer-access/index.html')]:
        path = source / rel; raw = path.read_bytes()
        (output / f'{page}.html').write_bytes(raw); inputs[page] = descriptor(raw)
        references(raw.decode('utf-8'), [path.parent])
    # 独立动效包运行时拼接路径取图，保留其完整原生包边界。
    for rel in ['_shared/home-living', '_shared/home-comic', '_living/cockpit', '_living/computer-access',
                '_typeset/cockpit', '_typeset/home-highlights', '_living/_engine']:
        for path in (source / rel).rglob('*'):
            copy_file(path)
    while pending:
        path = pending.pop()
        references(path.read_text(encoding='utf-8'), [path.parent, source, source / 'cockpit'])
    home = output / 'home.html'
    white_gear = run_path(str(ROOT.parent / 'sources/home-white-gear/build.py'))['build'](public, home)
    for row in white_gear['images'] + white_gear['bindings']:
        copied[row['path']] = descriptor((public / row['path']).read_bytes())
    home.write_text(adjust_home(home.read_text(encoding='utf-8'), public, public), encoding='utf-8', newline='')
    subprocess.run([sys.executable, str(ROOT / 'tools/pack_living.py')], check=True)
    engine = json.loads((ROOT / 'src/chrome/living-engine.json').read_text(encoding='utf-8'))
    cockpit = output / 'cockpit.html'
    cockpit.write_text(cockpit.read_text(encoding='utf-8').replace(engine['deployed'], engine['fixed']), encoding='utf-8', newline='')
    mobile_todo = run_path(str(ROOT / 'tools/cockpit_mobile_todo.py'))['build'](public, cockpit)
    copied[mobile_todo['runtime']] = descriptor((public / mobile_todo['runtime']).read_bytes())
    firstpaint = re.search(r'/(_home-cockpit/home-firstpaint-[a-f0-9]+\.js)', home.read_text('utf-8'))[1]
    for rel in (firstpaint, '_living/_engine/' + engine['fixed']):
        copied[rel] = descriptor((public / rel).read_bytes())
    manifest = {'schema': 'wly.retained-home-cockpit.v1', 'inputs': inputs,
        'pages': {page: descriptor((output / (page + '.html')).read_bytes()) for page in inputs},
        'files': copied, 'count': len(copied), 'bytes': sum(row['bytes'] for row in copied.values())}
    manifest['home_white_gear'] = white_gear
    manifest['cockpit_mobile_todo'] = mobile_todo
    (output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    return manifest


def regenerate_runtimes(work):
    """按当前归属源码重生运行件；不可变发布壳只承担未改动的原始功能。"""
    repo, public = ROOT.parent, ROOT / 'public'
    source = ROOT / 'sources/retained-home-cockpit'
    record = source / 'runtime-inputs.json'
    previous = json.loads(record.read_text('utf8')) if record.is_file() else {}
    manifest = json.loads((source / 'manifest.json').read_text('utf8'))
    dependencies = json.loads((source / 'dependencies.json').read_text('utf8'))
    owned = []
    for rel, row in manifest['bundled'].items():
        if not row['source'].startswith('../../public/'): continue
        path = (source / row['source']).resolve(); proof = descriptor(path.read_bytes())
        row.update(proof); manifest['files'][rel] = proof
        dependencies[rel] = {**proof, 'source_path': path.relative_to(repo).as_posix()}
        owned.append(path.relative_to(repo).as_posix())
    manifest['bytes'] = sum(row['bytes'] for row in manifest['files'].values())
    for path, value in [(source / 'manifest.json', manifest), (source / 'dependencies.json', dependencies)]:
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf8', newline='\r\n' if path.name == 'dependencies.json' else '\n')
    materialize_frozen(); restored = materialize_dependencies()
    names = ['scripts/build-typeset-site.py', 'scripts/typeset-layout.js',
             'scripts/update-live-release.py', 'scripts/site-live-runtime.js',
             'scripts/typeset-live-display.js', 'scripts/b2-live-runtime.js',
             'scripts/prepare-cockpit-cache.py', 'scripts/prepare-home-living.py',
             'scripts/home-living-bind.js', 'site-astro/tools/home_firstpaint.py',
             'site-astro/tools/retain_home_cockpit.py', 'scripts/release_delta.py',
             'scripts/public_page_contract.py', 'scripts/prepare_native_readability.py',
             'scripts/rule_original_contract.py', 'scripts/audit-page-publication.py',
             'scripts/hybrid-release.py', 'scripts/prepare-motion-release.py',
             'scripts/build-assembled-site.py', 'scripts/repair-release-navigation.py',
             'config/rule-navigation-mappings.json', 'app/computer-access-model.js']
    white_root = repo / 'sources/home-white-gear'
    names += ['sources/home-white-gear/build.py', 'sources/signature/assets-manifest.json']
    names += ['site-astro/tools/cockpit_white_gear.py', 'site-astro/tools/cockpit_mobile_todo.py',
              'sources/assets/_library/illustrations/ill-53b8c5c622e8b9.png']
    names += ['sources/home-white-gear/' + name + '.png' for name in
              ('master-h', 'master-v', 'plate-h', 'plate-h-nobird', 'plate-v', 'plate-v-nobird', 'native-h', 'native-v-fallback')]
    runtime_paths = sorted((ROOT / 'src/chrome/runtime').glob('*.json'))
    names += [path.relative_to(repo).as_posix() for path in runtime_paths]
    names += [(source / (page + '.html')).relative_to(repo).as_posix() for page in ('home', 'cockpit')]
    names += [(source / 'computer-access.html').relative_to(repo).as_posix()]
    def current_inputs(): return {name: descriptor((repo / name).read_bytes()) for name in names + owned}
    inputs = current_inputs()
    if previous.get('inputs') == inputs:
        for rel, proof in previous['outputs'].items():
            if descriptor((public / rel).read_bytes()) != proof:
                raise ValueError('当前源绑定的运行件字节不同：' + rel)
        return {'status': 'reused', 'inputs': inputs, 'outputs': previous['outputs'], 'dependencies': restored}
    def load(name, relative):
        spec = importlib.util.spec_from_file_location(name, repo / relative)
        module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
        return module
    typeset = load('retained_typeset', 'scripts/build-typeset-site.py')
    live = load('retained_live', 'scripts/update-live-release.py')
    home = load('retained_home', 'scripts/prepare-home-living.py')
    pages = {page: (source / (page + '.html')).read_text('utf8') for page in ('home', 'cockpit')}
    texts = {path: path.read_text('utf8') for path in runtime_paths}
    dependencies = json.loads((source / 'dependencies.json').read_text('utf8'))
    pattern = r'/((?:_typeset/runtime|_shared|cockpit/assets)/(?:home-app-|app-|b2-typeset-)[a-f0-9]+\.js)'
    base = previous.get('base') or {rel: dependencies[rel] for text in [*texts.values(), *pages.values()]
                                  for rel in re.findall(pattern, text)}
    replacements, outputs, generated = {}, {}, {}
    def emit(rel, text, stem):
        raw = text.encode('utf8'); proof = descriptor(raw)
        new = (Path(rel).parent / (stem + proof['sha256'][:20] + '.js')).as_posix()
        asset = source / 'assets' / (proof['sha256'] + '.js')
        asset.write_bytes(raw); (public / new).parent.mkdir(parents=True, exist_ok=True)
        (public / new).write_bytes(raw)
        dependencies[new] = {**proof, 'source_path': asset.relative_to(repo).as_posix()}
        replacements['/' + rel] = '/' + new
        old = previous.get('replacements', {}).get('/' + rel)
        if old: replacements[old] = '/' + new
        generated[rel] = new; outputs[new] = proof
        return new
    home_base = []
    for rel, proof in sorted(base.items()):
        raw = (public / rel).read_bytes()
        if descriptor(raw) != {key: proof[key] for key in ('sha256', 'bytes')}:
            raise ValueError('运行件不可变发布壳不同：' + rel)
        text = raw.decode('utf8')
        if Path(rel).name.startswith('home-app-'):
            home_base.append((rel, text)); continue
        if Path(rel).name.startswith('app-'):
            text = home.patch_event_targets(live.patch_shared_runtime(typeset.patch_inherited_app(text)))
            emit(rel, text, 'app-')
        else:
            emit(rel, live.patch_b2_runtime(text), 'b2-typeset-')
    def replace(text):
        for old, new in replacements.items(): text = text.replace(old, new)
        return text
    previous_mobile = previous.get('cockpit_mobile_todo')
    if previous_mobile:
        original = '/' + previous_mobile['base_runtime']
        replacements['/' + previous_mobile['runtime']] = replacements.get(original, original)
    work = Path(work); work.mkdir(parents=True, exist_ok=True)
    cockpit = work / 'cockpit/index.html'; cockpit.parent.mkdir(parents=True, exist_ok=True)
    cockpit.write_text(replace(pages['cockpit']), encoding='utf8', newline='')
    if previous_mobile: replacements.pop('/' + previous_mobile['runtime'], None)
    cockpit_white = run_path(str(ROOT / 'tools/cockpit_white_gear.py'))['build'](public, cockpit)
    cockpit.write_text(re.sub(r'<style data-cockpit-mobile-todo>.*?</style>', '', cockpit.read_text('utf8'), flags=re.S), encoding='utf8', newline='')
    base_runtime = re.search(r'data-src="([^"]*/b2-typeset-[\w]+\.js)"', cockpit.read_text('utf8'))[1].lstrip('/')
    mobile_todo = run_path(str(ROOT / 'tools/cockpit_mobile_todo.py'))['build'](public, cockpit)
    mobile_todo['base_runtime'] = base_runtime
    pages['cockpit'] = cockpit.read_text('utf8')
    head = re.search(r'<section\b[^>]*\bid="cockpit-01"[^>]*>', pages['cockpit'])[0]
    binding = json.loads(html.unescape(re.search(r'data-living-binding="([^"]+)"', head)[1]))
    config_url = re.search(r'data-living-config="([^"]+)"', head)[1]
    config = json.loads((public / config_url.lstrip('/')).read_text('utf8'))
    cockpit_resources = {config_url, '/' + mobile_todo['runtime'], *(item['src'] for item in binding.values()),
                         *(config[side]['texture']['src'] for side in binding)}
    for url in cockpit_resources:
        rel = url.lstrip('/'); raw = (public / rel).read_bytes(); proof = descriptor(raw)
        asset = source / 'assets' / (proof['sha256'] + Path(rel).suffix)
        asset.write_bytes(raw); outputs[rel] = proof
        dependencies[rel] = {**proof, 'source_path': asset.relative_to(repo).as_posix()}
    (work / '.release-delta.json').write_text(json.dumps({'baseline': str(public),
        'sources': {'cockpit/index.html': str(cockpit)}}), encoding='utf8')
    model, _ = home.cockpit_model(work)
    for rel, text in home_base:
        # 原压缩壳的 model 前有 import，bridge 通过逗号接到末尾；逐段替换，避免旧新各运行一次。
        old_model = 'window.HomeLivingStatusModel=(()=>'
        if text.count(old_model) != 1 or text.count('HeroLive.mount') != 1 or text.count('__heroNativePlates') != 1:
            raise ValueError('首页原 model/bridge 没有唯一归属段：' + rel)
        start = text.index(old_model); end = text.index(',window.SiteMotionAppearance=', start)
        text = text[:start] + text[end + 1:]
        start = text.rfind('(()=>{"use strict"', 0, text.index('__heroNativePlates'))
        if start < 0 or not text[:start].endswith(',') or not text[start:].rstrip().endswith('})();'):
            raise ValueError('首页原 bridge 的完整边界不同：' + rel)
        text = text[:start - 1] + ';\n'
        text = home.patch_runtime(text, model, (repo / 'scripts/home-living-bind.js').read_text('utf8'))
        if text.count('HeroLive.mount') != 1 or len(re.findall(r'window\.HomeLivingStatusModel\s*=', text)) != 1:
            raise ValueError('首页重生后 model/bridge 重复：' + rel)
        emit(rel, text, 'home-app-')
    pages = {page: replace(text) for page, text in pages.items()}
    # 从原引擎重新执行首帧补丁；先移除上轮的预热标签，避免重复插入。
    original_engine = previous.get('firstpaint_source', '_shared/home-living/hero-live.576f7d6f10.js')
    old_firstpaint = re.search(r'/(_home-cockpit/home-firstpaint-[a-f0-9]+\.js)', pages['home'])[1]
    pages['home'] = re.sub(r'<link\b[^>]*(?:_home-cockpit/home-firstpaint-|modulepreload)[^>]*>', '', pages['home'])
    pages['home'] = pages['home'].replace('/' + old_firstpaint, '/' + original_engine)
    # 上一轮派生只用于当前展示；重生始终回到真实原始取样链，再读当前母图。
    inventory = json.loads((repo / 'sources/signature/assets-manifest.json').read_text('utf8'))['items']
    baseline_images = {item['new_name']: item for item in inventory}
    for row in previous.get('home_white_gear', {}).get('images', []):
        before = Path(row['before']).name
        pages['home'] = pages['home'].replace(Path(row['path']).name, before)
        pages['home'] = pages['home'].replace(row['sha256'], baseline_images[before]['sha256'])
    home_work = work / 'index.html'; home_work.write_text(pages['home'], encoding='utf8', newline='')
    white_gear = run_path(str(white_root / 'build.py'))['build'](public, home_work)
    pages['home'] = home_work.read_text('utf8')
    for row in white_gear['images'] + white_gear['bindings']:
        rel = row['path']; raw = (public / rel).read_bytes(); proof = descriptor(raw)
        if proof != {key: row[key] for key in ('sha256', 'bytes')}:
            raise ValueError('当前白图派生写入后不同：' + rel)
        asset = source / 'assets' / (proof['sha256'] + Path(rel).suffix)
        asset.write_bytes(raw); outputs[rel] = proof
        dependencies[rel] = {**proof, 'source_path': asset.relative_to(repo).as_posix()}
    pages['home'] = adjust_home(pages['home'], public, public)
    firstpaint = re.search(r'/(_home-cockpit/home-firstpaint-[a-f0-9]+\.js)', pages['home'])[1]
    raw = (public / firstpaint).read_bytes(); outputs[firstpaint] = descriptor(raw)
    (source / Path(firstpaint).name).write_bytes(raw)
    dependencies[firstpaint] = {**outputs[firstpaint], 'source_path': (source / Path(firstpaint).name).relative_to(repo).as_posix()}
    manifest = json.loads((source / 'manifest.json').read_text('utf8'))
    manifest['bundled'].pop(old_firstpaint, None)
    manifest['bundled'][firstpaint] = {'source': Path(firstpaint).name, **outputs[firstpaint]}
    for rel, new in generated.items():
        if rel in manifest['files']: manifest['files'][new] = outputs[new]
    manifest['files'].pop(old_firstpaint, None); manifest['files'][firstpaint] = outputs[firstpaint]
    if old_firstpaint != firstpaint: dependencies.pop(old_firstpaint, None)
    for rel in set(previous.get('outputs', {})) - set(outputs):
        if rel not in base:
            manifest['files'].pop(rel, None); dependencies.pop(rel, None)
    for row in white_gear['images'] + white_gear['bindings']: manifest['files'][row['path']] = outputs[row['path']]
    for row in previous.get('home_white_gear', {}).get('images', []) + previous.get('home_white_gear', {}).get('bindings', []):
        if row['path'] not in outputs:
            manifest['files'].pop(row['path'], None); dependencies.pop(row['path'], None)
    manifest['home_white_gear'] = white_gear
    manifest['cockpit_white_gear'] = cockpit_white
    manifest['cockpit_mobile_todo'] = mobile_todo
    for url in cockpit_resources: manifest['files'][url.lstrip('/')] = outputs[url.lstrip('/')]
    for page, text in pages.items():
        raw = text.encode('utf8'); (source / (page + '.html')).write_bytes(raw)
        manifest['pages'][page] = descriptor(raw)
    for path, text in texts.items(): path.write_bytes(replace(text).encode('utf8'))
    manifest.update(count=len(manifest['files']), bytes=sum(row['bytes'] for row in manifest['files'].values()))
    manifest['runtime_recipe'] = {'schema': 'wly.retained-runtime-recipe.v1',
        'inputs_sha256': hashlib.sha256(json.dumps(current_inputs(), sort_keys=True).encode()).hexdigest(),
        'original_engine': original_engine, 'base_images': 'sources/signature/assets-manifest.json',
        'image_recipe': 'sources/home-white-gear/build.py', 'image_evidence': 'home_white_gear',
        'base_use': 'Exact pre-white encoding references; current display uses only the recorded derived images.'}
    for path, value in [(source / 'manifest.json', manifest), (source / 'dependencies.json', dependencies),
                        (record, {'schema': 'wly.retained-runtime-inputs.v1', 'inputs': current_inputs(), 'base': base,
                                  'outputs': outputs, 'replacements': {('/' + rel): ('/' + new) for rel, new in generated.items()},
                                  'firstpaint_source': original_engine, 'home_white_gear': white_gear, 'cockpit_mobile_todo': mobile_todo})]:
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf8', newline='\r\n' if path.name == 'dependencies.json' else '\n')
    materialize_frozen()
    return {'status': 'regenerated', 'inputs': current_inputs(), 'outputs': outputs, 'dependencies': restored}


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
            if base == dist and rel != 'computer-access/index.html': pages[path] = body
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

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
import copy
import hashlib
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path, PurePosixPath

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
sys.path.insert(0, str(HERE))
import bird_guide_perches as perches  # noqa: E402

SRC = REPO / 'living-prepared/bird-guide/sources'
BASE = REPO / 'living-prepared/bird-fixed'
OUT = REPO / 'living-prepared/bird-guide'
PIPE = REPO.parent
WORK = PIPE / 'review/bird-fix-work'
DEFAULT_PAGE_DATA_SITE = PIPE.parent / 'integration3/generation/native-07/dist'
DEFAULT_GEOMETRY_REPORT = WORK / 'guide-build-tools/native07-input-comparison.json'


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
    active_paths = [engine / bird_dir / 'bird.js', engine / bird_dir / 'bird-atlas.webp',
                    engine / css_name, engine / js_name]
    return {'engine': js_name, 'style': css_name, 'bird': bird_dir + '/',
            'engine_source_sha256': sha(raw), 'bird_source_sha256': sha((SRC / 'bird.src.js').read_bytes()),
            'guide_source_sha256': sha((SRC / 'bird-guide.src.js').read_bytes()),
            'files': {p.relative_to(engine).as_posix(): p.stat().st_size for p in active_paths},
            'sizes': {'engine_total': len(js) + len(css), 'bird_js': len(bird_js), 'bird_atlas': len(atlas_bytes)},
            'atlas_identical_to': old_bird + '/bird-atlas.webp',
            'built_at_beijing': beijing_now()}


def build_engine_bundle(output: Path, base_refs: dict):
    """Compile the frozen guide sources once and save a reusable, hashed engine contract."""
    if output.exists():
        raise ValueError('engine bundle output must be a new task-owned directory')
    asset_root = output / 'assets'
    engine = build_engine(asset_root, base_refs)
    adapter_path = REPO / 'scripts/typeset-living.js'
    adapter_bytes = adapter_path.read_bytes()
    adapter_name = 'typeset-living.' + sha(adapter_bytes)[:10] + '.js'
    engine_root = asset_root / '_living/_engine'
    (engine_root / adapter_name).write_bytes(adapter_bytes)

    metadata = {key: engine[key] for key in (
        'engine', 'style', 'bird', 'engine_source_sha256', 'files', 'sizes',
        'built_at_beijing', 'atlas_identical_to',
    )}
    metadata['bird_resolution_reason'] = base_refs['current_engine'].get('bird_resolution_reason')
    metadata_bytes = (json.dumps(metadata, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    metadata_name = 'metadata.' + sha(metadata_bytes)[:12]
    metadata_rel = f'_living/_engine/{metadata_name}/files.json'
    metadata_path = asset_root / metadata_rel
    metadata_path.parent.mkdir(parents=True, exist_ok=True)
    metadata_path.write_bytes(metadata_bytes)

    objects = {}
    for rel in engine['files']:
        path = engine_root / rel
        objects['_living/_engine/' + rel] = facts(path)
    adapter_rel = '_living/_engine/' + adapter_name
    objects[adapter_rel] = facts(asset_root / adapter_rel)
    objects[metadata_rel] = facts(metadata_path)
    base_refs_path = BASE / 'references.json'
    contract = {
        'schema': 'wly.bird-guide-engine-bundle.v1',
        'status': 'static_candidate_built_runtime_unverified',
        'base_packet': 'living-prepared/bird-fixed',
        'base_commit': 'bd368bb10dcfc8cfe59eb7fea779b92bcceee29b',
        'merged_sample_commit': '336a8d57d29ac7a4e563e24d4ca76ce019a5f067',
        'base_references_sha256': sha(base_refs_path.read_bytes()),
        'current_engine': engine,
        'engine_url': '/_living/_engine/' + engine['engine'],
        'bird_sprites_url': '/_living/_engine/' + engine['bird'],
        'metadata_url': '/' + metadata_rel,
        'metadata_sha256': sha(metadata_bytes),
        'adapter': {'source': 'scripts/typeset-living.js', 'url': '/' + adapter_rel,
                    'bytes': len(adapter_bytes), 'sha256': sha(adapter_bytes)},
        'home': base_refs.get('home'),
        'source_inputs': {
            str(path.relative_to(REPO).as_posix()): facts(path)
            for path in sorted(SRC.iterdir()) if path.is_file()
        },
        'objects': objects,
        'external_actions': {'public_network_gets': 0, 'public_uploads': 0, 'published': False},
        'runtime_acceptance': 'not run; this build proves only the frozen source/minifier contract',
        'built_at_beijing': beijing_now(),
    }
    output.mkdir(parents=True, exist_ok=True)
    contract_path = output / 'engine-contract.json'
    contract_path.write_text(json.dumps(contract, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    contract['engine_contract_sha256'] = sha(contract_path.read_bytes())
    return contract, contract_path


def inspect_engine_bundle(bundle_root: Path, base_refs: dict):
    """Read and verify a frozen static engine bundle without writing or compiling it."""
    bundle_root = Path(bundle_root)
    contract_path = bundle_root / 'engine-contract.json'
    contract = json.loads(contract_path.read_text('utf-8'))
    if contract.get('schema') != 'wly.bird-guide-engine-bundle.v1':
        raise ValueError('engine bundle contract schema is not supported')
    if contract.get('base_references_sha256') != sha((BASE / 'references.json').read_bytes()):
        raise ValueError('engine bundle was built from another bird-fixed packet')
    atlas_source = SRC / 'bird-atlas.json'
    atlas_identity = contract.get('source_inputs', {}).get('living-prepared/bird-guide/sources/bird-atlas.json')
    if not atlas_identity or facts(atlas_source) != atlas_identity:
        raise ValueError('bird silhouette metadata differs from the one-time engine bundle inputs')
    source_assets = bundle_root / 'assets'
    for rel, expected in contract['objects'].items():
        source = source_assets / Path(*PurePosixPath(rel).parts)
        if not source.is_file() or facts(source) != expected:
            raise ValueError('engine bundle asset missing or changed: ' + rel)
    contract['engine_contract_path'] = contract_path.as_posix()
    contract['engine_contract_sha256'] = sha(contract_path.read_bytes())
    return contract


def reuse_engine_bundle(bundle_root: Path, dist: Path, base_refs: dict):
    """Copy the one approved local build; never minify a second time during package assembly."""
    bundle_root = Path(bundle_root)
    contract = inspect_engine_bundle(bundle_root, base_refs)
    expected_sources = {
        'engine_source_sha256': sha((SRC / 'living.js').read_bytes()),
        'bird_source_sha256': sha((SRC / 'bird.src.js').read_bytes()),
        'guide_source_sha256': sha((SRC / 'bird-guide.src.js').read_bytes()),
    }
    current = contract['current_engine']
    for key, value in expected_sources.items():
        if current.get(key) != value:
            raise ValueError(f'engine bundle input has changed since its build: {key}')
    source_assets = bundle_root / 'assets'
    for rel, expected in contract['objects'].items():
        source = source_assets / Path(*PurePosixPath(rel).parts)
        target = dist / Path(*PurePosixPath(rel).parts)
        if target.exists():
            if facts(target) != expected:
                raise ValueError('refusing to overwrite a different existing guide asset: ' + rel)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
    return contract


def base_config(row: dict):
    cfg_url = row['config']
    src_dir = BASE / 'assets' / cfg_url.lstrip('/').rsplit('/', 1)[0]
    cfg = json.loads((src_dir / 'config.json').read_text('utf-8'))
    return cfg, src_dir, src_dir / 'config.json'


def page_mask_paths(config: dict):
    required = set()
    for orientation in ('h', 'v'):
        variant = config.get(orientation, {})
        texture = variant.get('texture')
        if isinstance(texture, dict) and texture.get('src'):
            required.add(texture['src'])
        for mask in variant.get('masks', []):
            if mask.get('src'):
                required.add(mask['src'])
        for effect in variant.get('effects', []):
            sprite = effect.get('sprite')
            if isinstance(sprite, dict) and sprite.get('src'):
                required.add(sprite['src'])
    return required


def copy_page_assets(page: str, src_dir: Path, target_dir: Path, config: dict, asset_files: dict):
    copied = []
    for source_ref in sorted(page_mask_paths(config)):
        parts = PurePosixPath(source_ref)
        if parts.is_absolute() or any(part in ('', '.', '..') for part in parts.parts):
            continue
        src_rel = Path(*parts.parts)
        basename = parts.name
        source = src_dir / src_rel
        if not source.is_file() and src_rel.parent == Path('.'):
            source = src_dir / basename
        target = target_dir / src_rel
        if source.is_file():
            body_facts = facts(source)
        else:
            override = asset_files.get(source_ref) or asset_files.get(basename)
            override_path = override.get('source_path') or override.get('path') if isinstance(override, dict) else None
            if not isinstance(override, dict) or not override_path:
                raise FileNotFoundError(f'{page} config references missing page asset without a matching asset_file: {source_ref}')
            source = Path(override_path)
            if not source.is_file():
                raise FileNotFoundError(f'override page asset source missing: {source}')
            body_facts = facts(source)
            if body_facts['bytes'] != override.get('bytes') or body_facts['sha256'] != override.get('sha256'):
                raise ValueError(f'override page asset bytes/hash differ from the owner map: {page}/{source_ref}')
        if target.exists() and facts(target) != body_facts:
            raise ValueError(f'refusing to overwrite another page asset under a content-addressed config: {page}/{source_ref}')
        target.parent.mkdir(parents=True, exist_ok=True)
        if not target.exists():
            shutil.copyfile(source, target)
        copied.append(target)
    return copied


def build_page(row: dict, dist: Path, images, sil, site_root: Path, orientations=None,
               orientation_overrides=None, asset_files=None):
    """按指定 Native07 page-data 构造落点；pixel finder 的检测阈值不在此调整。"""
    cfg, src_dir, _config_file = base_config(row)
    for orientation, override in (orientation_overrides or {}).items():
        if orientation not in ('h', 'v') or not isinstance(override, dict):
            raise ValueError(f'配置覆盖必须是页面的h/v配置对象：{row["page"]}/{orientation}')
        cfg[orientation] = copy.deepcopy(override)
    html_file = site_root / row['route']
    html = html_file.read_bytes()
    data = perches.page_data(html)
    if data.get('page') != row['page']:
        raise ValueError(f'候选 page-data 身份不符：route={row["route"]} page={data.get("page")} expected={row["page"]}')
    guide, stats = perches.build(html, cfg, images, sil, orientations=orientations)
    cfg['guide'] = guide
    data = (json.dumps(cfg, ensure_ascii=False, separators=(',', ':')) + '\n').encode('utf-8')
    rel = '_living/%s/bird-guide.%s' % (row['page'], sha(data)[:12])
    target = dist / rel
    target.mkdir(parents=True, exist_ok=True)
    (target / 'config.json').write_bytes(data)
    copied_assets = copy_page_assets(row['page'], src_dir, target, cfg, asset_files or {})
    actual = {p.relative_to(target).as_posix() for p in target.rglob('*') if p.is_file()}
    expected = {'config.json'} | {p.relative_to(target).as_posix() for p in copied_assets}
    if actual != expected:
        raise ValueError(f'{row["page"]} guide config directory contains stale/unreferenced assets: {sorted(actual ^ expected)}')
    return {'page': row['page'], 'route': row['route'], 'config': '/' + rel + '/config.json',
            'previous_config': row['config'], 'template': facts(html_file), 'guide': stats,
            'config_assets': {p.relative_to(dist).as_posix(): facts(p) for p in copied_assets},
            'pending_geometry_directions': [o for o in ('h', 'v') if orientations is not None and o not in orientations],
            'config_facts': facts(target / 'config.json'),
            'transplant': 'dependency attributes only (engine src, bird dir, config URL); keep latest body, images, binding and hotspots'}


def load_input_contract(site_root: Path, geometry_report_path: Path, base_refs_path: Path, override_path: Path | None):
    """Bind the perches input to the inspected Native07 page-data and frozen base packet."""
    geometry = json.loads(geometry_report_path.read_text('utf-8'))
    base_refs_sha = sha(base_refs_path.read_bytes())
    if geometry.get('base_references_sha256') != base_refs_sha:
        raise ValueError('geometry comparison was made against another bird-fixed references.json')
    expected_site = Path(geometry.get('native07_root', '')).as_posix().casefold()
    if expected_site and expected_site not in site_root.as_posix().casefold():
        raise ValueError('page-data site differs from the Native07 root in the comparison report')
    manifest_info = geometry.get('native07_asset_map', {})
    manifest_path = site_root / 'release-manifest.json'
    if manifest_info.get('missing_or_unmapped'):
        raise ValueError('Native07 input report contains image paths absent from dist/release-manifest')
    if not manifest_path.is_file() or sha(manifest_path.read_bytes()) != manifest_info.get('manifest_sha256'):
        raise ValueError('Native07 release-manifest changed after the 64-page input comparison')
    asset_count = manifest_info.get('unique_part_urls')
    if (not isinstance(asset_count, int) or manifest_info.get('physical_files_present') != asset_count
            or manifest_info.get('manifest_entries_present') != asset_count
            or manifest_info.get('physical_bytes_match_manifest') != asset_count):
        raise ValueError('Native07 image path/manifest coverage no longer matches the frozen 64-page input report')
    page_rows = {row['page']: row for row in geometry.get('pages', [])}
    overrides = {}
    asset_files = {}
    override_hash = None
    if override_path:
        override_bytes = override_path.read_bytes()
        override_hash = sha(override_bytes)
        payload = json.loads(override_bytes)
        if payload.get('schema') != 'wly.bird-guide-config-overrides.v1':
            raise ValueError('config overrides must use wly.bird-guide-config-overrides.v1')
        if payload.get('base_references_sha256') != base_refs_sha:
            raise ValueError('config override was made for another frozen base packet')
        if payload.get('page_data_comparison_sha256') != sha(geometry_report_path.read_bytes()):
            raise ValueError('config override was made for a different Native07 page-data comparison')
        overrides = payload.get('pages', {})
        asset_files = payload.get('asset_files', {})
        if not isinstance(overrides, dict) or not isinstance(asset_files, dict):
            raise ValueError('config override pages and asset_files must be JSON objects')
    return page_rows, overrides, asset_files, {
        'geometry_report': geometry_report_path.as_posix(),
        'geometry_report_sha256': sha(geometry_report_path.read_bytes()),
        'base_references_sha256': base_refs_sha,
        'native07_root': site_root.as_posix(),
        'native07_manifest_path': manifest_path.as_posix(),
        'native07_manifest_sha256': manifest_info.get('manifest_sha256'),
        'config_overrides_path': override_path.as_posix() if override_path else None,
        'config_overrides_sha256': override_hash,
    }


def eligible_directions(page: str, config: dict, page_contract: dict, overrides: dict):
    """Use only actual first-art mapping overrides; size equality alone is not a visual mapping proof."""
    page_override = overrides.get(page, {})
    allowed, pending, applied = [], [], {}
    for orientation in ('h', 'v'):
        if orientation not in config or 'bird' not in config[orientation]:
            continue
        row = page_override.get(orientation)
        if row is not None:
            if not isinstance(row, dict) or not isinstance(row.get('config'), dict):
                raise ValueError(f'override must provide a full config section for {page}/{orientation}')
            override_cfg = copy.deepcopy(row['config'])
            source_size = page_contract['first_geometry'][orientation]['native07_part']['size']
            if list(override_cfg.get('image', {}).get('size', [])) != list(source_size):
                raise ValueError(f'override image size does not match Native07 page-data for {page}/{orientation}')
            allowed.append(orientation)
            applied[orientation] = override_cfg
            continue
        pending.append(orientation)
    extra_overrides = set(page_override) - {'h', 'v'}
    if extra_overrides:
        raise ValueError(f'unknown orientation override(s) for {page}: {sorted(extra_overrides)}')
    return allowed, pending, applied


def read_scope(base_refs: dict):
    rows = []
    dynamic, static = [], []
    for row in base_refs.get('mounted', []):
        cfg, _source_dir, _config_file = base_config(row)
        has_bird = any(orientation in cfg and 'bird' in cfg[orientation] for orientation in ('h', 'v'))
        (dynamic if has_bird else static).append(row)
    if len(dynamic) != 64:
        raise ValueError(f'第一步包里的动态挂载页不是64页：{len(dynamic)}')
    if [(row['page'], row['route']) for row in static] != [('404', '404.html')]:
        raise ValueError('除404原画静鸟外，mounted静态例外出现变化')
    if len(base_refs.get('staged', [])) != 17:
        raise ValueError(f'第一步包里的no_mount stage页不是17页：{len(base_refs.get("staged", []))}')
    return dynamic, static, base_refs['staged']


def candidate_page_config(row: dict, dist: Path, images, sil, site_root: Path,
                          comparison: dict, overrides: dict, asset_files: dict):
    cfg, src_dir, _config_file = base_config(row)
    page_contract = comparison.get(row['page'])
    if page_contract is None:
        raise ValueError(f'Native07 page-data compare report 缺少 {row["page"]}')
    allowed, pending, applied = eligible_directions(row['page'], cfg, page_contract, overrides)
    for orientation, override_cfg in applied.items():
        cfg[orientation] = override_cfg
    built = build_page(row, dist, images, sil, site_root, orientations=allowed,
                       orientation_overrides=applied, asset_files=asset_files)
    input_html = site_root / row['route']
    input_html_bytes = input_html.read_bytes()
    if sha(input_html_bytes) != comparison[row['page']]['native07_html_sha256']:
        raise ValueError(f'Native07 candidate HTML changed after input comparison: {row["page"]}')
    data = perches.page_data(input_html_bytes)
    if data.get('page') != row['page']:
        raise ValueError(f'page-data 页名不符：expected={row["page"]}, actual={data.get("page")}')
    semantic_page_data_sha = sha(json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8'))
    if semantic_page_data_sha != comparison[row['page']]['native07_page_data_sha256']:
        raise ValueError(f'Native07 page-data changed after input comparison: {row["page"]}')
    guide_path = dist / built['config'].lstrip('/').replace('/', '\\')
    guide_cfg = json.loads(guide_path.read_text('utf-8'))
    zero_perch = [
        orientation for orientation in allowed
        if built['guide'].get(orientation, {}).get('parts', 0) == 0
        or built['guide'].get(orientation, {}).get('perches', 0) == 0
    ]
    return {
        **built,
        'input_page_data_sha256': sha(json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')),
        'input_page_data_html': facts(input_html),
        'directions_generated': allowed,
        'pending_geometry_directions': pending,
        'explicit_config_override_directions': sorted(applied),
        'zero_perch_directions': zero_perch,
        'guide_config': guide_cfg,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--pages', nargs='+')
    ap.add_argument('--site', type=Path, default=DEFAULT_PAGE_DATA_SITE,
                    help='读取最新 candidate page-data 与 Native07 manifest 的只读site目录')
    ap.add_argument('--geometry-report', type=Path, default=DEFAULT_GEOMETRY_REPORT)
    ap.add_argument('--config-overrides', type=Path,
                    help='根确认的page/orientation配置覆盖；缺失的first-geometry方向保持pending，不强套旧配置')
    ap.add_argument('--cache', type=Path, action='append', default=[])
    ap.add_argument('--local-images', type=Path, action='append', default=[])
    ap.add_argument('--own-cache', type=Path)
    ap.add_argument('--network-log', type=Path)
    ap.add_argument('--engine-bundle', type=Path,
                    help='复用engine-only一次性build结果；完整packet装配不再重新minify')
    ap.add_argument('--output', type=Path, help='perches-only临时输出目录；完整overlay默认写回样板包')
    ap.add_argument('--report', type=Path, help='perches-only构建报告路径')
    ap.add_argument('--engine-only', action='store_true',
                    help='只从当前freeze的3份source编译一次engine/metadata/adapter contract，不算页面perches')
    ap.add_argument('--perches-only', action='store_true', help='只计算配置guide字段，不编译引擎、不写最终packet refs')
    ap.add_argument('--no-fetch', action='store_true', help='Native07、流水线缓存与本地文件名缓存均未命中时立即失败')
    a = ap.parse_args()
    base_refs_path = BASE / 'references.json'
    base_refs = json.loads(base_refs_path.read_text('utf-8'))
    if a.engine_only:
        output = a.output or (WORK / 'guide-build-tools/engine-current')
        contract, contract_path = build_engine_bundle(output.resolve(), base_refs)
        print(json.dumps({
            'status': contract['status'], 'engine': contract['current_engine']['engine'],
            'engine_source_sha256': contract['current_engine']['engine_source_sha256'],
            'bird': contract['current_engine']['bird'], 'metadata_url': contract['metadata_url'],
            'adapter_url': contract['adapter']['url'], 'objects': len(contract['objects']),
            'contract': contract_path.as_posix(), 'contract_sha256': contract['engine_contract_sha256'],
        }, ensure_ascii=False))
        return
    if not a.pages:
        ap.error('--pages is required unless --engine-only is used')
    if not a.perches_only and not a.engine_bundle:
        ap.error('完整packet装配必须用 --engine-bundle 复用已冻结的一次性engine build')
    dynamic_rows, static_rows, staged_rows = read_scope(base_refs)
    rows = {r['page']: r for r in dynamic_rows}
    missing = [p for p in a.pages if p not in rows]
    if missing:
        raise SystemExit('只允许选择第一步64个动态已挂载页；404静态与17 stage no_mount不可加入pages：' + ', '.join(missing))
    if len(set(a.pages)) != len(a.pages):
        raise SystemExit('--pages里有重复页')
    if not a.perches_only and set(a.pages) != set(rows):
        raise SystemExit('写完整packet时必须包含全部64个动态页；pilot请用--perches-only')

    input_site = a.site.resolve()
    if not input_site.is_dir():
        raise SystemExit('page-data site目录不存在：' + str(input_site))
    base_refs_sha = sha(base_refs_path.read_bytes())
    comparison_rows, overrides, asset_files, comparison_meta = load_input_contract(
        input_site, a.geometry_report, base_refs_path, a.config_overrides)
    selected_rows = [rows[p] for p in a.pages]
    dist_root = (a.output.resolve() if a.perches_only and a.output else (WORK / 'guide-build-tools/perches-native07-pilot').resolve() if a.perches_only else OUT)
    dist = dist_root / 'assets'
    dist.mkdir(parents=True, exist_ok=True)
    report_path = a.report.resolve() if a.report else dist_root / 'guide-placements-report.json'
    run_id = datetime.now(timezone(timedelta(hours=8))).strftime('%Y%m%d-%H%M%S')
    network_log = a.network_log.resolve() if a.network_log else WORK / 'guide-build-tools' / f'image-traffic-{run_id}.jsonl'
    images = perches.Images(a.cache, a.own_cache, fetch=not a.no_fetch, local_image_dirs=a.local_images,
                            site_root=input_site, network_log_path=network_log)
    engine = None
    engine_contract = None
    if a.perches_only:
        if a.engine_bundle:
            engine_contract = inspect_engine_bundle(a.engine_bundle, base_refs)
            engine = engine_contract['current_engine']
            atlas_dir = a.engine_bundle.resolve() / 'assets/_living/_engine' / engine['bird']
        else:
            atlas_dir = BASE / 'assets/_living/_engine' / base_refs['current_engine']['bird']
        atlas_image = atlas_dir / 'bird-atlas.webp'
    else:
        engine_contract = reuse_engine_bundle(a.engine_bundle, dist, base_refs)
        engine = engine_contract['current_engine']
        atlas_image = dist / '_living/_engine' / engine['bird'] / 'bird-atlas.webp'
    sil = perches.Silhouette(SRC / 'bird-atlas.json', atlas_image)
    page_contracts = []
    for index, row in enumerate(selected_rows, 1):
        cfg, _src_dir, _config_file = base_config(row)
        allowed, pending, explicit = eligible_directions(row['page'], cfg, comparison_rows[row['page']], overrides)
        result = candidate_page_config(row, dist, images, sil, input_site, comparison_rows, overrides, asset_files)
        result['directions_generated'] = allowed
        result['pending_geometry_directions'] = pending
        result['explicit_config_override_directions'] = sorted(explicit)
        page_contracts.append(result)
        print(json.dumps({
            'event': 'page-placements-complete', 'page': row['page'], 'pages_done': index,
            'pages_total': len(selected_rows), 'directions_generated': allowed,
            'pending_geometry_directions': pending,
            'guide': result['guide'], 'zero_perch_directions': result['zero_perch_directions'],
            'native_site_manifest_hits': len(images.site_file_hits), 'public_network_gets': images.fetched,
        }, ensure_ascii=False), flush=True)

    zero_rows = [
        {'page': row['page'], 'orientation': orientation}
        for row in page_contracts for orientation in row['zero_perch_directions']
    ]
    pending_directions = [
        {'page': row['page'], 'orientation': orientation,
         'size_match_only': comparison_rows[row['page']]['first_geometry'][orientation].get('native07_matches_config', False),
         'reason': 'awaiting source-backed actual first-art image/projection/pixel mapping; first part size equality alone is not sufficient'}
        for row in page_contracts for orientation in row['pending_geometry_directions']
    ]
    report = {
        'schema': 'wly.bird-guide-placements-build.v1',
        'status': (
            'pilot-perches-generated-runtime-unverified'
            if a.perches_only and set(a.pages) == {'localocr', 'how-this-site', 'cockpit'}
            else 'perches-generated-runtime-unverified'
            if a.perches_only and comparison_meta.get('config_overrides_sha256')
            else 'partial-placements-only-pending-actual-first-art-map'
        ) if a.perches_only else 'candidate-engine-built-pending-application',
        'base_commit': 'bd368bb10dcfc8cfe59eb7fea779b92bcceee29b',
        'sample_merge_head': '336a8d57d29ac7a4e563e24d4ca76ce019a5f067',
        'base_packet': 'living-prepared/bird-fixed',
        'base_references_sha256': base_refs_sha,
        'guide_sources': {p.name: facts(p) for p in sorted(SRC.iterdir()) if p.is_file()},
        'page_data_input': comparison_meta,
        'scope': {
            'selected_dynamic_pages': len(selected_rows), 'candidate_dynamic_pages': 64,
            'candidate_static_404_pages': 1, 'stage_no_mount_pages': 17,
            'generated_directions': sum(len(row['directions_generated']) for row in page_contracts),
            'pending_geometry_directions': len(pending_directions),
        },
        'staged_status': {
            'status': 'no_mount', 'available_native07_full_page_data': 16,
            'missing_native07_page_data': ['github-profile'],
            'first_geometry_matches_previous_config': 6,
            'full_page_quality_assurance': 'pending',
            'cutoff_policy': '2g includes the 17 only if the final 2f candidate and its page-data are ready before packaging; otherwise 2g keeps 64 and the 17 remain registered for the next train.',
        },
        'image_sources': images.report(),
        'network_log': {
            'path': network_log.as_posix(),
            'exists': network_log.is_file(),
            'sha256': sha(network_log.read_bytes()) if network_log.is_file() else None,
        },
        'engine': engine,
        'engine_bundle_contract': engine_contract.get('engine_contract_path') if engine_contract else None,
        'engine_bundle_contract_sha256': engine_contract.get('engine_contract_sha256') if engine_contract else None,
        'pages': page_contracts,
        'zero_perch_directions': zero_rows,
        'pending_geometry_directions': pending_directions,
        'external_actions': {
            'public_network_gets': images.fetched,
            'public_uploads': 0,
            'publication_or_release': False,
        },
        'built_at_beijing': beijing_now(),
    }
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({
        'status': report['status'], 'selected_pages': len(selected_rows),
        'directions_generated': report['scope']['generated_directions'],
        'pending_geometry_directions': len(pending_directions), 'zero_perch_directions': zero_rows,
        'native_site_manifest_hits': len(images.site_file_hits), 'public_network_gets': images.fetched,
        'report': report_path.as_posix(), 'report_sha256': sha(report_path.read_bytes()),
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()

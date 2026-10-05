"""只准备精确选中页；不运行 Git、构建、上传或发布。输出尚未封印。"""
from __future__ import annotations

import argparse
import copy
import hashlib
import html
import io
import json
import math
import re
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import unquote, urlsplit

from PIL import Image

HERE = Path(__file__).resolve().parent
DATA = re.compile(r'<script\b(?=[^>]*\bid=["\']page-data["\'])[^>]*>(.*?)</script\s*>', re.S | re.I)
TAG = re.compile(r'<section\b[^>]*>', re.I)
PART = re.compile(r'<div\b(?=[^>]*\bclass=["\'][^"\']*\btypeset-part\b)[^>]*>\s*<picture>.*?</picture>\s*<div\b[^>]*\bclass=["\']overlays["\'][^>]*>\s*</div>\s*</div>', re.S | re.I)
ATTR = re.compile(r'(?<![\w-])([\w:-]+)\s*=\s*(["\'])(.*?)\2', re.S)


def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))


def sha(value):
    return hashlib.sha256(value).hexdigest()


def stamp():
    return datetime.now(timezone(timedelta(hours=8))).isoformat()


def facts(path):
    data = Path(path).read_bytes()
    return {'bytes': len(data), 'sha256': sha(data)}


def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def read_source_manifest(preparation, report):
    snapshot = Path(preparation) / relative(report['source']['manifest_snapshot'])
    payload = snapshot.read_bytes()
    if sha(payload) != report['source']['manifest_sha256']:
        raise ValueError('候选自身的生产基线 manifest 快照已变化')
    return json.loads(payload)


def attributes(tag):
    return {m[1].lower(): html.unescape(m[3]) for m in ATTR.finditer(tag)}


def attr(tag, name, value):
    pattern = re.compile(r'(?<![\w-])' + re.escape(name) + r'\s*=\s*(["\']).*?\1', re.S)
    text = f'{name}="{html.escape(str(value), quote=True)}"'
    if pattern.search(tag):
        return pattern.sub(lambda _: text, tag, count=1)
    return tag[:-1] + ' ' + text + '>'


def relative(name):
    p = Path(name)
    if p.is_absolute() or '\\' in name or any(s in ('', '.', '..') for s in name.split('/')):
        raise ValueError('不是包内相对路径：' + name)
    return p


def first_parts(data):
    if data.get('typeset') is not True or not data.get('screens') or data['screens'][0].get('render_mode') != 'typeset':
        return None
    parts = data['screens'][0]['parts']
    return {o: next((i for i, p in enumerate(parts) if p.get('orientation') == o), None) for o in ('h', 'v')}


def engine_pack(dist):
    root = dist / '_engine'
    files = read(root / 'files.json')
    for name, size in files['files'].items():
        path = root / relative(name)
        if path.stat().st_size != size:
            raise ValueError('共用引擎文件大小漂移：' + name)
    for field in ('engine', 'style'):
        name = files[field]
        match = re.fullmatch(r'living\.([0-9a-f]{10})\.(js|css)', name)
        if not match or match[1] != facts(root / name)['sha256'][:10]:
            raise ValueError('共用引擎内容指纹不符：' + name)
    bird = files['bird'].rstrip('/')
    payload = (root / bird / 'bird.js').read_bytes() + (root / bird / 'bird-atlas.webp').read_bytes()
    if bird != 'bird.' + sha(payload)[:10]:
        raise ValueError('小鸟目录内容指纹不符')
    return files


def page_pack(dist, page, orientations=('h', 'v')):
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]*', page):
        raise ValueError('页名不合法：' + page)
    root = dist / page
    cfg = read(root / 'config.json')
    if cfg.get('schema') != 'living-art/1' or cfg.get('page') != page or cfg.get('disabled'):
        raise ValueError('配置未准备成可挂载的本页包：' + page)
    names = {'config.json'}
    if not orientations or any(o not in ('h', 'v') for o in orientations) or len(set(orientations)) != len(orientations):
        raise ValueError('页包方向必须是非空且不重复的 h/v')
    for o in orientations:
        variant = cfg.get(o)
        if not variant or not variant.get('probe'):
            raise ValueError(f'{page}/{o} 缺方向或图像取样')
        names.update(m['src'] for m in variant.get('masks', []))
        names.update(e['sprite']['src'] for e in variant.get('effects', []) if e.get('sprite'))
    for name in names - {'config.json'}:
        path = root / relative(name)
        match = re.search(r'\.([a-f0-9]{10})\.[^.]+$', name)
        if not match or match[1] != facts(path)['sha256'][:10]:
            raise ValueError('范围图或独立素材内容指纹不符：' + name)
    actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
    if actual != names:
        raise ValueError('页包存在未引用文件或缺失文件：' + page)
    if sum((root / name).stat().st_size for name in names) > 300000:
        raise ValueError('页包超过 300KB：' + page)
    return cfg, sorted(names)


def staged_orientations(contract, page):
    """只暂存合同确实测得的方向；缺图不生成假配置，已测方向仍必须齐全。"""
    return tuple(o for o in ('h', 'v')
                 if contract.get((page, o), {}).get('illustration', {}).get('status') == 'measured')


def contracts(path, overrides):
    result = {(e['page'], e['orientation']): e for e in read(path)['first_screens']}
    if overrides:
        for e in read(overrides)['first_screens']:
            key = e['page'], e['orientation']
            if key not in result:
                raise ValueError('覆盖指向未知页方向：' + str(key))
            result[key] = e
    return result


def pixels(path):
    with Image.open(path) as im:
        rgba = im.convert('RGBA')
        return list(im.size), sha(rgba.tobytes())


def probes(path, points):
    with Image.open(path) as im:
        im = im.convert('RGB')
        small = im.resize((200, max(1, math.floor(im.height * 200 / im.width + .5))), Image.Resampling.BILINEAR)
    errors = []
    for x, y, *expected in points:
        if len(expected) != 3 or not (0 <= x <= 1 and 0 <= y <= 1):
            raise ValueError('图像取样格式不合法')
        xx = max(0, min(small.width - 1, round(x * small.width - .5)))
        yy = max(0, min(small.height - 1, round(y * small.height - .5)))
        errors.append(sum(abs(a - b) for a, b in zip(small.getpixel((xx, yy)), expected)) / 3)
    mean, worst = sum(errors) / len(errors), max(errors)
    if mean > 22 or worst > 80:
        raise ValueError(f'首屏错代：取样平均差 {mean:.2f}，最大 {worst:.2f}')
    return {'mean': round(mean, 3), 'worst': round(worst, 3)}


def resolve_image(part, baseline, manifest, cache):
    src = part['src']
    obj = next((v for v in manifest.get('oss', {}).get('objects', {}).values() if v['url'] == src), None)
    if obj:
        prefix = manifest['oss']['prefix'] + '/'
        local = cache / relative(obj['key'].removeprefix(prefix))
        if not local.is_file():
            # 本轮浏览器只读通道已取的同指纹对象可复用；准备器本身不联网。
            local = HERE / 'work' / 'http-cache' / (obj['sha256'] + '.body')
        if facts(local) != {k: obj[k] for k in ('bytes', 'sha256')}:
            raise ValueError('缓存素材与正式对象指纹不符：' + src)
        return local, obj
    if urlsplit(src).scheme or urlsplit(src).netloc:
        raise ValueError('首屏 URL 不在本代正式对象清单：' + src)
    local = baseline / relative(unquote(urlsplit(src).path).lstrip('/'))
    return local, {'url': src, **facts(local)}


def replacement_part(old, replacement, source_root):
    """新的完整 first-part 由排版 owner 提供；本函数不推断动作或改链接。"""
    if replacement.get('expected_previous_sha256') != sha(json.dumps(old, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode()):
        raise ValueError('首屏替换绑定的旧 part 已变化；请重新生成精确替换资料')
    part = copy.deepcopy(replacement['part'])
    for field in ('orientation', 'both'):
        if part.get(field) != old.get(field):
            raise ValueError('替换不能改变方向/共用方式：' + field)
    image = source_root / relative(replacement['image_path'])
    if facts(image)['sha256'] != replacement['image_sha256'] or pixels(image)[0] != part['size']:
        raise ValueError('替换整屏图指纹或尺寸不符')
    if not part.get('hotspots') and old.get('hotspots'):
        raise ValueError('替换丢失原热区')
    def meaning(value, root=False):
        if isinstance(value, list):
            return [meaning(item) for item in value]
        if isinstance(value, dict):
            geometry = {'rect', 'rect_px', 'x', 'y', 'w', 'h', 'part'}
            if root:
                geometry |= {'src', 'image', 'size'}
            return {k: meaning(v) for k, v in value.items() if k not in geometry}
        return value
    if meaning(old, True) != meaning(part, True):
        raise ValueError('首屏替换改变原热区或动作语义；只能替换图片及其几何绑定')
    return part, image


def patch_html(text, data, indices, config_url, runtime, binding, cors, changed_data=False):
    sid = data['screens'][0]['id']
    found = [m for m in TAG.finditer(text) if attributes(m[0]).get('id') == sid and 'typeset-screen' in attributes(m[0]).get('class', '').split()]
    if len(found) != 1:
        raise ValueError('首屏 section 不唯一：' + sid)
    start = found[0].start()
    end = text.index('</section>', found[0].end()) + len('</section>')
    section = text[start:end]
    part_matches = list(PART.finditer(section))
    part_data = data['screens'][0]['parts']
    if len(part_matches) != len(part_data):
        raise ValueError('首屏 HTML 分片与 page-data 数量不符')
    selected = {i: o for o, i in indices.items()}
    for i in range(len(part_matches) - 1, -1, -1):
        m = part_matches[i]
        if i not in selected:
            continue
        o = selected[i]
        block = m[0]
        tag_end = block.index('>') + 1
        tag = block[:tag_end]
        if attributes(tag).get('data-orientation') != o:
            raise ValueError('首屏 HTML 分片方向不符')
        tag = attr(tag, 'data-living-first', o)
        p = part_data[i]
        if changed_data:
            tag = attr(tag, 'style', f'aspect-ratio:{p["size"][0]}/{p["size"][1]}')
        block = tag + block[tag_end:]
        im = re.search(r'<img\b[^>]*>', block)
        attrs = attributes(im[0])
        image_tag = im[0]
        if changed_data:
            for key in ('src', 'data-src'):
                if key in attrs:
                    image_tag = attr(image_tag, key, p['src'])
            for key, value in zip(('width', 'height'), p['size']):
                image_tag = attr(image_tag, key, value)
        elif attrs.get('data-src', attrs.get('src')) != p['src']:
            raise ValueError('首屏 HTML 图地址与 page-data 不一致')
        if o in cors:
            image_tag = attr(image_tag, 'crossorigin', 'anonymous')
        block = block[:im.start()] + image_tag + block[im.end():]
        section = section[:m.start()] + block + section[m.end():]
    section_tag_end = section.index('>') + 1
    tag = attr(section[:section_tag_end], 'data-living-config', config_url)
    tag = attr(tag, 'data-living-binding', json.dumps(binding, separators=(',', ':')))
    text = text[:start] + tag + section[section_tag_end:] + text[end:]
    if changed_data:
        matches = list(DATA.finditer(text))
        if len(matches) != 1:
            raise ValueError('page-data 不唯一')
        m = matches[0]
        text = text[:m.start(1)] + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + text[m.end(1):]
    if 'data-living-runtime' in text:
        raise ValueError('页面已有活画接线，不能重复准备')
    text = text.replace('</head>', f'<link data-living-runtime rel="stylesheet" href="{runtime["style"]}"></head>', 1)
    scripts = ''.join(f'<script data-living-runtime src="{runtime[key]}" defer></script>' for key in ('engine', 'adapter'))
    if '</body>' not in text:
        raise ValueError('页面没有 body 结束标签')
    return text.replace('</body>', scripts + '</body>', 1)


def prepare(baseline, dist, contract_path, output, pages, cache, contract_root,
            overrides=None, replacements=None, cors_proof=None, stage_pages=None):
    baseline, dist, output, cache, contract_root = map(Path, (baseline, dist, output, cache, contract_root))
    if output.exists():
        raise ValueError('输出目录必须不存在，以保留可恢复的旧候选')
    if not pages or len(set(pages)) != len(pages):
        raise ValueError('必须提供不重复的精确页名清单')
    stage_pages = stage_pages or {}
    if not set(stage_pages) <= set(pages) or any(not reason for reason in stage_pages.values()):
        raise ValueError('暂存必须属于精确选页且注明实际原因')
    manifest_bytes = (baseline / 'release-manifest.json').read_bytes()
    manifest = json.loads(manifest_bytes)
    inventory = {p.relative_to(baseline).as_posix(): facts(p) for p in baseline.rglob('*') if p.is_file()}
    expected = manifest['files']
    if {k: v for k, v in inventory.items() if k != 'release-manifest.json'} != expected:
        raise ValueError('生产基线文件与 release-manifest 不一致')
    files = engine_pack(dist)
    contract = contracts(contract_path, overrides)
    proofs = read(cors_proof).get('objects', {}) if cors_proof else {}
    adapter = (HERE / 'typeset-living.js').read_bytes()
    adapter_name = 'typeset-living.' + sha(adapter)[:10] + '.js'
    runtime = {'engine': '/_living/_engine/' + files['engine'], 'style': '/_living/_engine/' + files['style'], 'adapter': '/_living/_engine/' + adapter_name}
    routes = {}
    for rel in sorted(expected):
        if not rel.endswith('.html'):
            continue
        text = (baseline / rel).read_bytes().decode('utf-8')
        match = DATA.search(text)
        if match:
            data = json.loads(match[1])
            if data.get('page') in pages:
                if data['page'] in routes:
                    raise ValueError('真实 page-data 页名指向多条 HTML：' + data['page'])
                routes[data['page']] = rel, text, data
    planned, staged, images = [], [], {}
    for page in pages:
        orientations = staged_orientations(contract, page) if page in stage_pages else ('h', 'v')
        cfg, names = page_pack(dist, page, orientations)
        if page in stage_pages:
            staged.append({'page': page, 'reason': stage_pages[page], 'files': names, 'orientations': list(orientations)})
            continue
        route = routes.get(page)
        indices = first_parts(route[2]) if route else None
        if not indices or None in indices.values():
            staged.append({'page': page, 'reason': 'main 尚无完整横竖新版首屏', 'files': names})
            continue
        rel, text, original = route
        data = copy.deepcopy(original)
        replacements_file = Path(replacements) / (page + '.json') if replacements else None
        replace = read(replacements_file) if replacements_file and replacements_file.is_file() else None
        if replace and (replace.get('schema') != 'wly.living-first-replacements.v1' or replace.get('page') != page or set(replace['parts']) != {'h', 'v'}):
            raise ValueError('替换资料必须精确包含本页 h/v 第一分片')
        binding, accepted, cors = {}, {}, set()
        for o, i in indices.items():
            part = data['screens'][0]['parts'][i]
            if replace:
                part, actual = replacement_part(part, replace['parts'][o], replacements_file.parent)
                name = facts(actual)['sha256'][:20] + '-' + actual.name
                asset_rel = f'_typeset/{page}/{name}'
                part['src'] = '/' + asset_rel
                data['screens'][0]['parts'][i] = part
                images[asset_rel] = actual
                obj = {'url': part['src'], **facts(actual)}
            else:
                actual, obj = resolve_image(part, baseline, manifest, cache)
            e = contract[page, o]
            reference = contract_root / relative(e['image']['path'])
            if facts(reference)['sha256'] != e['image']['sha256']:
                raise ValueError('合同整屏图原件已变化：' + str(reference))
            actual_size, actual_pixels = pixels(actual)
            ref_size, ref_pixels = pixels(reference)
            if actual_size != part['size'] or actual_size != cfg[o]['image']['size'] or actual_size != e['image']['size_px'] or ref_size != actual_size or actual_pixels != ref_pixels:
                raise ValueError(f'{page}/{o} 首屏尺寸或像素指纹错代；只拒绝本批，不套旧坐标')
            if cfg[o]['image']['file'] != e['image']['file'] or part['image'] != e['image']['file']:
                raise ValueError(f'{page}/{o} 包/合同/实际第一分片身份不符')
            expected_box = e['illustration']['rect_ratio']
            if e['illustration'].get('status') != 'measured' or len(cfg[o]['box']) != 4 or any(abs(a - b) > 1.1e-6 for a, b in zip(cfg[o]['box'], expected_box)):
                raise ValueError(f'{page}/{o} 活画插画框与当前实测合同不符')
            probe = probes(actual, cfg[o]['probe'])
            binding[o] = {'src': part['src'], 'size': part['size']}
            accepted[o] = {'part_index': i, 'src': part['src'], 'image_sha256': obj['sha256'], 'pixels_rgba_sha256': actual_pixels, 'contract_image_sha256': e['image']['sha256'], 'size': actual_size, 'probe': probe}
            if e.get('production_binding'):
                accepted[o]['production_binding'] = e['production_binding']
            proof = proofs.get(part['src'])
            if proof and proof.get('sha256') == obj['sha256'] and proof.get('allow_origin') in ('*', 'https://wly0829.cn') and proof.get('observed_at_beijing'):
                cors.add(o)
        config_hash = facts(dist / page / 'config.json')['sha256']
        patched = patch_html(text, data, indices, f'/_living/{page}/config.json?v={config_hash[:12]}', runtime, binding, cors, bool(replace))
        if data['screens'][1:] != original['screens'][1:]:
            raise ValueError('首屏替换改变后续屏数据')
        planned.append({'page': page, 'route': rel, 'html': patched.encode('utf-8'), 'before': inventory[rel], 'after': {'bytes': len(patched.encode('utf-8')), 'sha256': sha(patched.encode('utf-8'))}, 'bindings': accepted, 'cors_anonymous': sorted(cors), 'replacement': bool(replace), 'files': names})
    site = output / 'site'
    site.mkdir(parents=True)
    snapshot_rel = 'source-baseline/release-manifest.json'
    snapshot = output / snapshot_rel
    snapshot.parent.mkdir()
    snapshot.write_bytes(manifest_bytes)
    for rel in expected:
        dest = site / relative(rel)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(baseline / rel, dest)
    for page in planned:
        (site / page['route']).write_bytes(page['html'])
        for name in page['files']:
            target = site / '_living' / page['page'] / relative(name)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(dist / page['page'] / name, target)
    for page in staged:
        for name in page['files']:
            target = output / 'stage' / '_living' / page['page'] / relative(name)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(dist / page['page'] / name, target)
    if planned:
        for name in [*files['files'], 'files.json']:
            target = site / '_living' / '_engine' / relative(name)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(dist / '_engine' / name, target)
        (site / '_living' / '_engine' / adapter_name).write_bytes(adapter)
        for rel, source in images.items():
            dest = site / relative(rel)
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, dest)
    changed = {p['route'] for p in planned}
    unchanged = [rel for rel in expected if rel not in changed]
    if any(facts(site / rel) != inventory[rel] for rel in unchanged):
        raise ValueError('无关联页/文件字节发生变化')
    append = {p.relative_to(site).as_posix(): {**facts(p), 'status': 'local-pending-upload'} for p in site.rglob('*') if p.is_file() and p.relative_to(site).as_posix() not in expected}
    report = {'schema': 'wly.living-batch-preparation.v1', 'status': 'prepared-local-unsealed', 'prepared_at_beijing': stamp(), 'source': {'path': str(baseline.resolve()), 'release_id': manifest['release_id'], 'manifest_snapshot': snapshot_rel, 'manifest_sha256': sha(manifest_bytes), 'oss_prefix': manifest.get('oss', {}).get('prefix'), 'old_objects': len(manifest.get('oss', {}).get('objects', {})), 'old_verification_observed_at_beijing': manifest.get('oss', {}).get('verification', {}).get('verified_at_beijing')}, 'selected': pages, 'mounted': [{k: v for k, v in p.items() if k not in ('html', 'files')} for p in planned], 'staged': staged, 'unchanged_files': len(unchanged), 'append_objects': append, 'remote_verification': 'not-performed', 'release_manifest': 'intentionally-absent-until-integration-seals-new-objects'}
    write(output / 'living-preparation.json', report)
    return report


def main():
    p = argparse.ArgumentParser(description=__doc__)
    for option in ('baseline', 'dist', 'contract', 'contract-root', 'cache', 'output'):
        p.add_argument('--' + option, required=True, type=Path)
    p.add_argument('--pages', nargs='+', required=True)
    p.add_argument('--overrides', type=Path)
    p.add_argument('--replacements', type=Path)
    p.add_argument('--cors-proof', type=Path)
    p.add_argument('--stage-pages', type=Path, help='精确页名→缺失新版首屏的实际原因 JSON；只暂存不挂载')
    a = p.parse_args()
    report = prepare(a.baseline, a.dist, a.contract, a.output, a.pages, a.cache, a.contract_root, a.overrides, a.replacements, a.cors_proof, read(a.stage_pages) if a.stage_pages else None)
    print(json.dumps({k: report[k] for k in ('status', 'selected', 'unchanged_files', 'remote_verification')}, ensure_ascii=False))


if __name__ == '__main__':
    main()

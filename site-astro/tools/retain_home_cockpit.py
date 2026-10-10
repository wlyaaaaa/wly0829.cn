"""把指定候选站的首页、驾驶舱、授权页及实际依赖原样带进 Astro；不修改候选站。
用法：python tools/retain_home_cockpit.py <候选站构建目录>
生成物不入库；先逐字节复制原依赖，再从审定 master 生成首页换色图片。
"""
import hashlib
import html
import json
import re
import shutil
import sys
from pathlib import Path
from runpy import run_path
from urllib.parse import unquote, urlsplit
from home_firstpaint import adjust_home
from cockpit_white_gear import build as white_cockpit
from cockpit_mobile_todo import build as mobile_todo
from cockpit_layout import build as cockpit_layout

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]).resolve()
PUBLIC = ROOT / 'public'
TEXT = {'.html', '.css', '.js', '.json', '.svg'}
RESOURCE = {'.css', '.js', '.json', '.svg', '.png', '.webp', '.avif', '.jpg', '.jpeg', '.woff', '.woff2'}
copied = {}
pending = []


def copy_file(path):
    path = path.resolve()
    if not path.is_file() or not path.is_relative_to(SOURCE):
        return
    rel = path.relative_to(SOURCE).as_posix()
    if rel in copied:
        return
    dst = PUBLIC / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(path, dst)
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if hashlib.sha256(dst.read_bytes()).hexdigest() != digest:
        raise RuntimeError(f'复制校验失败：{rel}')
    copied[rel] = {'sha256': digest, 'bytes': path.stat().st_size}
    # 路由目录和搜索资料描述其他页面，并不是这两页的素材依赖。
    if path.suffix in TEXT and not (rel.startswith('_album/routes-') or
                                   path.name.startswith(('search-', 'resource-retry-'))):
        pending.append(path)


def references(text, bases):
    # 覆盖 HTML 属性/srcset、JSON、CSS url() 和 JS import；仅复制存在的本地文件。
    text = html.unescape(text).replace('\\/', '/')
    names = re.findall(r'''(?:["'`(\s=])((?:/|\./|\.\./|[\w-]+/)[^\s"'`<>),;]+)''', text)
    for name in names:
        parsed = urlsplit(name)
        if parsed.scheme or parsed.netloc:
            continue
        name = unquote(parsed.path)
        for base in ([SOURCE] if name.startswith('/') else bases):
            target = (base / name.lstrip('/')).resolve()
            if target.suffix in RESOURCE and target.is_file() and target.is_relative_to(SOURCE):
                copy_file(target)
                break


output = ROOT / 'src/chrome/retained'
output.mkdir(parents=True, exist_ok=True)
pages = {}
for page, rel in [('home', 'index.html'), ('cockpit', 'cockpit/index.html'),
                  ('computer-access', 'computer-access/index.html')]:
    source = SOURCE / rel
    data = source.read_bytes()
    (output / f'{page}.html').write_bytes(data)
    pages[page] = {'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}
    references(data.decode('utf-8'), [source.parent])

# 这些独立动效包还通过运行时拼接路径取图；保留它们完整的原生包边界。
for rel in ['_shared/home-living', '_shared/home-comic', '_living/cockpit',
            '_living/computer-access',
            '_typeset/cockpit', '_typeset/home-highlights', '_living/_engine']:
    for path in (SOURCE / rel).rglob('*'):
        copy_file(path)
while pending:
    path = pending.pop()
    references(path.read_text(encoding='utf-8'), [path.parent, SOURCE, SOURCE / 'cockpit'])

home = output / 'home.html'
white_gear = run_path(str(ROOT.parent / 'sources/home-white-gear/build.py'))['build'](PUBLIC, home)
home.write_text(adjust_home(home.read_text(encoding='utf-8'), PUBLIC, PUBLIC), encoding='utf-8', newline='')

# 驾驶舱保留原挂载和完整屏幕数据，仅沿用样板已验证的通用引擎首帧修正。
import subprocess
subprocess.run([sys.executable, str(ROOT / 'tools/pack_living.py')], check=True)
engine = json.loads((ROOT / 'src/chrome/living-engine.json').read_text(encoding='utf-8'))
cockpit = output / 'cockpit.html'
cockpit.write_text(cockpit.read_text(encoding='utf-8').replace(engine['deployed'], engine['fixed']),
                   encoding='utf-8', newline='')
cockpit_white_gear = white_cockpit(PUBLIC, cockpit)
cockpit_mobile_todo = mobile_todo(PUBLIC, cockpit)
cockpit_layout_result = cockpit_layout(PUBLIC, cockpit)

manifest = {'pages': pages, 'files': copied, 'count': len(copied),
            'bytes': sum(item['bytes'] for item in copied.values())}
manifest['home_white_gear'] = white_gear
manifest['cockpit_white_gear'] = cockpit_white_gear
manifest['cockpit_mobile_todo'] = cockpit_mobile_todo
manifest['cockpit_layout'] = cockpit_layout_result
(output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({key: manifest[key] for key in ['pages', 'count', 'bytes']}, ensure_ascii=False))

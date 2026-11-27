"""把已经定下来的几块拼成一个整站，输出到同目录的 site/（每次整个重建）。

拼的是：
- 首页        ← home-build/site/（只填首页按钮的地址，别的不动）
- 页眉        ← first-layer/header/demo/topbar.css、topbar.js（原样复制）
- 规则        ← first-layer/rules-page/demo/（约法及专题，换成整站的页眉链接）
- 项目、技能   ← 按 first-layer/list-pages/demo/ 的排法生成；卡片来自各项目的 外层.json 和封面图
- 每个项目的页 ← trial/first-projects/网站示意/<项目ID>/（复制一份，只在副本里换上真页眉）

原件一个都不改。设置在 站点设置.json。

只动变了的页：每次先在 .拼装中/ 里把整站拼一遍（封面图有缓存，没变的不重算），
再和 site/ 逐个文件比，只写内容真变了的文件、删掉不再有的文件，没变的一个字节不碰（修改时间也不变）。
所以上线时照修改时间或内容同步，只会传这次变了的那几页。最后打出这次变了哪些页。

用法：python 组装.py          拼一遍，只更新变了的页，检查站内链接
      python 组装.py --只检查   不拼，只检查 site/ 里的站内链接
"""
import argparse
import hashlib
import html
import json
import os
import posixpath
from urllib.parse import unquote, urlsplit
import re
import runpy
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from importlib import import_module
from importlib.metadata import version
from fontTools import __version__ as FONTTOOLS_VERSION
from fontTools.ttLib import TTFont
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from bs4 import BeautifulSoup
from pygments import lex
from pygments.lexers import JavascriptLexer
from pygments.token import String

HERE = Path(__file__).resolve().parent
S = HERE.parent                                   # site-plan-20261111
OUT = HERE.parents[1] / 'dist'                     # 仓库完整成品
SITE = HERE / '.拼装中'                           # 每次先拼在这里，再只把变了的同步到 site/
CACHE = HERE.parents[1] / '.cache' / 'site-assembly'
ART_CACHE = CACHE / 'art'
FULL = False
SETTINGS = json.loads((HERE / '站点设置.json').read_text(encoding='utf-8'))

HOME_SRC = S / 'home-build' / 'site'
HEADER_SRC = S / 'first-layer' / 'header' / 'demo'
RULES_SRC = S / 'first-layer' / 'rules-page' / 'demo'
ACCESS_SRC = S / 'first-layer' / 'connect-auth' / 'demo'
TRUST_SRC = S / 'first-layer' / 'trust-modal'
# 连接电脑页的固定接法和电脑服务用同一段代码、同一份现役登记算（见 connect_fixed）。
# 规则页本人正文写到电脑服务的运行目录（见 generate_rule_pages）；可用 WLY_OWNER_RULES_OUT 改去处。
OWNER_RULES = Path(os.environ.get('WLY_OWNER_RULES_OUT') or 'E:/Data/RemoteComputerMCP/state/owner-rule-pages')
CONNECT_VIEWS = Path('E:/PCConfig/tools/remote-computer-mcp/public_access_views.py')
CONNECT_REGISTRIES = [CONNECT_VIEWS.parents[2] / 'registries' / name
                      for name in ('remote_computer_mcp.json', 'remote_computer_mcp.secondary_laptop.json')]
PRINCIPLES_GENERATOR = S / 'first-layer' / 'principles-page' / 'source' / 'generator' / 'generate.py'
WALL_SRC = S / 'first-layer' / 'list-pages' / 'demo'
PIPE = S / 'trial' / 'first-projects'
WEB = PIPE / '网站示意'
sys.path.insert(0, str(HERE.parents[1] / 'scripts'))
import live_fallback
sys.path.insert(0, str(PIPE / '工具'))
from consistency_scan import load_public_policy, public_word_pattern, load_formal_public_policy, formal_public_word_pattern
from consistency_scan import _policy as word_policy
TABLE = PIPE / '表' / '归属表.md'
# 项目名册里 website.visibility 标 hidden 的项目不给访客看：静态站整项不发布（列表、讲解页、技能、链接名、旧地址跳转）。
# 网站项目 ID 和名册不同名的，照实况的封面对照表（网站项目 ID → 名册项目 ID）认。可用 WLY_WEBSITE_PROJECTS 指向别的名册副本。
WEBSITE_PROJECTS = Path(os.environ.get('WLY_WEBSITE_PROJECTS') or 'E:/PCConfig/registries/website-projects.json')
COVER_LINKS = S / 'live' / 'project' / 'cover-links.json'
MATERIAL = HERE / '素材'
PRIOR_ART = json.loads((MATERIAL / '派生/清单.json').read_text(encoding='utf-8'))
PRIOR_SOURCES = json.loads((MATERIAL / '派生/来源.json').read_text(encoding='utf-8'))


def input_key(paths):
    """只认内容，不认修改时间；目录清单也参与，新增和删掉输入都会失效。"""
    digest = hashlib.sha256()
    ordered = sorted(set(paths))
    def content(path):
        return hashlib.sha256(path.read_bytes() if path.is_file() else b'<missing>').digest()
    with ThreadPoolExecutor(max_workers=8) as pool:
        hashes = list(pool.map(content, ordered))
    for path, hashed in zip(ordered, hashes):
        digest.update(str(path).encode('utf-8') + b'\0')
        digest.update(hashed)
        digest.update(b'\0')
    return digest.hexdigest()


def source_files():
    names = subprocess.check_output(
        ['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', S.name], cwd=S.parent
    ).decode('utf-8').split('\0')
    inputs = {S.parent / name for name in names if name}
    # 编辑工作副本可挂回私有底稿，只有实际读取的本机输入进入构建指纹。
    inputs.update((TABLE, PIPE / '公开页禁用词.txt', S / '配置/规则公开改写.json'))
    fonts = MATERIAL / '字体'
    records = json.loads((fonts / '登记.json').read_text(encoding='utf-8'))['fonts']
    inputs.update(fonts / record['file'] for record in records)
    for path in sorted(inputs):
        name = path.name
        if path.parent == RULES_SRC and (name == 'index.html' or name.startswith('topic-') or name == 'self-check.json' or name.endswith('.diff.txt')):
            continue
        if not path.is_relative_to(S / 'first-layer/principles-page/demo'):
            yield path


def rule_release():
    pointer = Path('E:/.agents/releases/current-rules.json')
    pinned = os.environ.get('WLY_RULES_RELEASE', '').strip()
    if pinned and not re.fullmatch(r'E[1-9]\d*', pinned):
        raise ValueError('WLY_RULES_RELEASE 要写成 E455 这样的版本号')
    release_id = pinned or json.loads(pointer.read_text(encoding='utf-8-sig'))['current']['release_id']
    release = pointer.parent / release_id
    if not (release / 'release.json').is_file():
        raise ValueError(f'规则版本不存在：{release_id}')
    return release, [] if pinned else [pointer]


def rule_inputs(selected=None):
    if selected is None and (signed := signed_rule_pages()):
        proof, pages = signed
        return [proof, *pages]
    release, pointer = selected or rule_release()
    return [*pointer, *sorted(p for p in release.rglob('*') if p.is_file())]


def signed_rule_pages():
    witness = os.environ.get('WLY_RULES_SIGNED_PAGES', '').strip()
    if not witness:
        return None
    proof_path = Path(witness).resolve()
    proof = json.loads(proof_path.read_text(encoding='utf-8'))
    release = os.environ.get('WLY_RULES_RELEASE', '').strip()
    if not release or proof['release'] != release:
        raise ValueError('已签规则页与指定发布版不一致')
    hashes = proof['pages_sha256']
    pages = sorted([RULES_SRC / 'index.html', *RULES_SRC.glob('topic-*.html')])
    if {path.name for path in pages} != hashes.keys():
        raise ValueError('已签规则页清单不完整')
    for path in pages:
        if hashlib.sha256(path.read_bytes()).hexdigest() != hashes[path.name]:
            raise ValueError(f'已签规则页内容不一致：{path.name}')
    return proof_path, pages


def cached_tree(name, key, destination, build):
    cached = CACHE / name / key
    marker = cached / '.complete'
    if not FULL and marker.is_file():
        shutil.copytree(cached / 'files', destination)
        print(f'缓存命中：{name}', flush=True)
        return
    build()
    if not marker.is_file():
        cached.mkdir(parents=True, exist_ok=True)
        shutil.copytree(destination, cached / 'files', dirs_exist_ok=True)
        marker.write_text(key, encoding='ascii')


def step(function, *args):
    started = time.perf_counter()
    result = function(*args)
    print(f'步骤 {function.__name__}：{time.perf_counter() - started:.3f} 秒', flush=True)
    return result


def prior_art(kind, source, options=''):
    key = hashlib.sha256(source.read_bytes() + (kind + ':' + str(options)).encode()).hexdigest()
    record = PRIOR_ART.get(key)
    if record is None: return None
    for name in record['files']:
        target = SITE / name; target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(S / PRIOR_SOURCES[name], target)
    return record['value']

LIVE = {'要做', '做完'}                            # 归属表里这两种状态的项目、技能才上列表
PLACEHOLDER_MODES = ['不摆', '占位卡', '示意图']


# ---------- 读归属表 ----------

def read_table(text, title):
    block = re.search(r'^## ' + re.escape(title) + r'[^\n]*\n(.*?)(?=^## |\Z)', text, re.M | re.S)
    rows = [[c.strip() for c in line.strip().strip('|').split('|')]
            for line in block[1].splitlines() if line.startswith('|')]
    return [dict(zip(rows[0], r)) for r in rows[2:]]


def hidden_ids():
    """名册里不给访客看的项目：返回（项目 ID，技能 ID）两组小写 ID。项目 ID 含名册和网站两种叫法，技能是这些项目名下的。"""
    entries = json.loads(WEBSITE_PROJECTS.read_text(encoding='utf-8-sig'))['entries']
    hidden = [e for e in entries if e.get('website', {}).get('visibility') == 'hidden']
    keys = {e['repo'].rsplit('/', 1)[-1].lower() for e in hidden}
    names = {e['website'].get('display_name') for e in hidden} - {None, ''}
    links = json.loads(COVER_LINKS.read_text(encoding='utf-8'))
    text = TABLE.read_text(encoding='utf-8-sig')
    projects = keys | {r['项目ID'].lower() for r in read_table(text, '项目表')
                       if r['项目ID'].lower() in keys or links.get(r['项目ID'], '').lower() in keys or r['中文名'] in names}
    skills = {r['技能ID'].lower() for r in read_table(text, '技能表')
              if r['归属项目ID'].lower() in projects or r['技能ID'].lower() in projects}
    return projects, skills


def hidden_route(route, hidden):
    """站内地址是不是不给访客看的项目的：/<项目>/…、/projects/<项目>/…、/skills/<技能或项目>/。"""
    projects, skills = hidden
    parts = (route or '').strip('/').lower().split('/')
    return bool(route) and (parts[0] in projects or len(parts) > 1 and (
        parts[0] == 'projects' and parts[1] in projects or parts[0] == 'skills' and parts[1] in projects | skills))


def load_catalog():
    text = TABLE.read_text(encoding='utf-8-sig')
    hidden_projects, hidden_skills = hidden_ids()
    projects = [r for r in read_table(text, '项目表') if r['状态'] in LIVE and r['项目ID'].lower() not in hidden_projects]
    skills = [r for r in read_table(text, '技能表') if r['状态'] in LIVE and r['技能ID'].lower() not in hidden_skills]
    core = SETTINGS['核心项目']
    order = {pid: i for i, pid in enumerate(core)}
    projects.sort(key=lambda r: order.get(r['项目ID'], len(core)))   # 核心六个在前，其余照归属表的先后；两张列表页另照“项目先后”“技能先后”排，这里只是兜底
    return projects, skills


# ---------- 一个项目做出来了哪些页 ----------

def newest(paths):
    def ver(p):
        m = re.search(r'-v(\d+)\.[a-z0-9]+$', p.name)
        return int(m[1]) if m else 0
    paths = list(paths)
    return max(paths, key=ver) if paths else None


def find_cover(pid, key):
    """封面那张图：先找网页里实际用的那一版，再找网页目录里最新的一版，最后找输出目录里的原图。"""
    web = WEB / pid
    content = web / 'content.js'
    if content.exists():
        m = re.search(r'"image":\s*"(assets/' + re.escape(key) + r'-v\d+\.\w+)"', content.read_text(encoding='utf-8'))
        if m and (web / m[1]).exists():
            return web / m[1]
    found = newest((web / 'assets').glob(f'{key}-v*.*')) if (web / 'assets').exists() else None
    if found:
        return found
    return None


def project_pages(pid):
    """返回这个项目已经做出网页的几页：[{种类, 技能ID, 名字, 它是什么, 封面文件, 地址}]。
    有 外层.json 照它；没有、但网页目录里有旧格式的 project.json（代理清道夫这种），从 project.json 推。"""
    web = WEB / pid
    pages = []
    outer = PIPE / pid / '外层.json'
    if outer.exists():
        for item in json.loads(outer.read_text(encoding='utf-8-sig')):
            pages.append({'种类': item.get('哪一种页', ''), '技能ID': item.get('技能ID', ''), '名字': item.get('名字', ''),
                          '它是什么': item.get('它是什么', ''), '封面键': item.get('封面', ''), '地址': item.get('地址', '')})
    elif (web / 'project.json').exists():
        config = json.loads((web / 'project.json').read_text(encoding='utf-8-sig'))
        for key, sec in config.get('sections', {}).items():
            kind = '主页' if sec.get('slug') == 'project' else '技能页' if key.startswith('技能-') else '子页'
            pages.append({'种类': kind, '技能ID': key[3:] if kind == '技能页' else '', '名字': sec.get('title', ''),
                          '它是什么': '', '封面键': sec.get('imagePrefix', '') + '-01',
                          '地址': f"/{pid}/" + sec.get('file', sec['slug'] + '.html')})
    done = []
    for p in pages:
        if not p['地址'].startswith(f'/{pid}/') or not (web / p['地址'][len(pid) + 2:]).exists():
            continue                                   # 网页还没做出来的页不算
        p['封面文件'] = find_cover(pid, p['封面键'])
        if p['封面文件']:
            done.append(p)
    return done


# ---------- 页眉 ----------

HEADER_BLOCK = re.compile(r'<header class="topbar".*?</header>', re.S)
MOTION_HEAD = '''<link rel="stylesheet" href="/motion/motion.css">
<script src="/motion/motion.js"></script>
'''


def with_motion(text):
    head, rest = text.split('</head>', 1)
    for line in MOTION_HEAD.splitlines():
        head = head.replace(line + '\n', '').replace(line, '')
    return head.rstrip() + '\n' + MOTION_HEAD + '</head>' + rest


def make_header(current):
    """从定稿的页眉试看页里取出页眉那一段，只换链接和“现在在哪一页”。"""
    block = HEADER_BLOCK.search((HEADER_SRC / 'index.html').read_text(encoding='utf-8'))[0]
    links = SETTINGS['页眉按钮']
    block = block.replace(' aria-current="page"', '')

    def pill(m):
        text = m[1]
        cur = ' aria-current="page"' if text == current else ''
        return f'<a class="pill" href="{links.get(text, "#")}"{cur}>{text}</a>'
    block = re.sub(r'<a class="pill" href="[^"]*">([^<]+)</a>', pill, block)
    block = block.replace('<a class="brand" href="#"', '<a class="brand" href="/"')
    return block


# ---------- 图：封面和光晕（做法照列表页试看页的 build_assets.py） ----------

GW = 450


def edge_color(im, box):
    return im.crop(box).resize((1, 1), Image.BOX).getpixel((0, 0))


def to_ratio(im, ratio):
    """凑成要的宽高比：比它扁的上下补和画边同色的边（不裁字），比它高的居中裁掉上下一点。"""
    w, h = im.size
    nh = round(w / ratio)
    if nh > h + 2:
        strip = max(2, h // 50)
        canvas = Image.new('RGB', (w, nh), edge_color(im, (0, 0, w, strip)))
        pad = (nh - h) // 2
        canvas.paste(Image.new('RGB', (w, nh - pad - h), edge_color(im, (0, h - strip, w, h))), (0, pad + h))
        canvas.paste(im, (0, pad))
        return canvas
    nh = min(nh, h)
    y = (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def glow(im, ratio):
    gh = round(GW / (1.5 * ratio) * 1.9)
    cw, ch = GW / 1.5, gh / 1.9
    tiny = im.resize((48, max(8, round(48 / ratio))), Image.LANCZOS)
    tiny = ImageEnhance.Color(tiny).enhance(1.45)
    tiny = ImageEnhance.Brightness(tiny).enhance(1.05)
    base = tiny.resize((GW, gh), Image.BICUBIC).filter(ImageFilter.GaussianBlur(22))
    mask = Image.new('L', (GW, gh), 0)
    x0, y0 = (GW - cw) / 2, (gh - ch) / 2
    ImageDraw.Draw(mask).rounded_rectangle((x0 - 6, y0 - 6, x0 + cw + 6, y0 + ch + 6), radius=22, fill=255)
    base.putalpha(mask.filter(ImageFilter.GaussianBlur(20)))
    return base


def make_art(src, name, maxw, ratio, pid):
    """列表页上这张卡片用的图。
    封面比例对（流水线第八节：项目 5:2、技能 3:1）就直接挂项目页里的同一个图文件，不另存一份——
    项目页换了图，列表页跟着就是新的；只有背后那圈光晕是从封面算出来的（按原图缓存，没变不重算）。
    比例不对的旧封面（代理清道夫是 3:1）才另存一份上下补边的，免得裁掉字。"""
    previous = prior_art('cover', src, f'{name}:{maxw}:{ratio}')
    if previous is not None: return previous
    out = SITE / 'wall' / 'img'
    out.mkdir(parents=True, exist_ok=True)
    sig = hashlib.sha256(src.read_bytes() + f'{maxw}|{ratio}|{GW}|{version("Pillow")}|cover-v1'.encode()).hexdigest()
    cache = ART_CACHE / sig
    if not (cache / 'g.webp').exists():
        cache.mkdir(parents=True, exist_ok=True)
        with Image.open(src) as raw:
            direct = abs(raw.width / raw.height - ratio) / ratio < 0.03 and (WEB / pid) in src.parents
            im = to_ratio(raw.convert('RGB'), ratio)
        if im.width > maxw:
            im = im.resize((maxw, round(maxw / ratio)), Image.LANCZOS)
        if not direct:
            im.save(cache / 'a.jpg', quality=88)
        (cache / 'size.json').write_text(json.dumps([im.width, im.height]), encoding='utf-8')
        glow(im, ratio).save(cache / 'g.webp', 'WEBP', lossless=True, exact=True, method=6)
    shutil.copy2(cache / 'g.webp', out / f'{name}-glow.compressed.webp')
    size = json.loads((cache / 'size.json').read_text(encoding='utf-8'))
    if (cache / 'a.jpg').exists():
        shutil.copy2(cache / 'a.jpg', out / f'{name}.jpg')
        return f'/wall/img/{name}.jpg', f'/wall/img/{name}-glow.compressed.webp', size
    return f'/{pid}/' + src.relative_to(WEB / pid).as_posix(), f'/wall/img/{name}-glow.compressed.webp', size


# ---------- 列表页 ----------

def subset_fonts():
    texts = [p.read_text(encoding='utf-8-sig') for p in SITE.rglob('*')
             if p.suffix in ('.html', '.js', '.css', '.json') and not p.name.endswith('.b64.js')]
    text = html.unescape(''.join(texts))
    text += ''.join(chr(int(n, 16)) for n in re.findall(r'\\u([0-9a-fA-F]{4})', text) if not 0xD800 <= int(n, 16) <= 0xDFFF)
    chars = ''.join(sorted(set(text)))
    cache = CACHE / 'fonts'
    cache.mkdir(parents=True, exist_ok=True)
    characters = cache / (hashlib.sha256(chars.encode('utf-8')).hexdigest() + '.txt')
    characters.write_text(chars, encoding='utf-8')
    def prepare(name):
        target = SITE / '公用/assets/fonts' / name
        source = WEB / '公用/assets/fonts' / name
        with TTFont(source, recalcBBoxes=False, recalcTimestamp=False) as font:
            expected = set(map(ord, chars)) & font.getBestCmap().keys()
        glyphs = ''.join(map(chr, sorted(expected)))
        tool_hash = hashlib.sha256((HERE / 'font-subset.py').read_bytes()).hexdigest()
        key = hashlib.sha256(source.read_bytes() + glyphs.encode('utf-8') + (FONTTOOLS_VERSION + version('brotli') + tool_hash).encode()).hexdigest()
        cached = cache / (key + '.woff2')
        hit = cached.exists()
        if not hit:
            subprocess.run([sys.executable, '-B', '-X', 'utf8', str(HERE / 'font-subset.py'),
                            str(source), str(cached), str(characters)], check=True)
        return name, target, source, cached, key, hit, len(expected)
    with ThreadPoolExecutor(max_workers=3) as pool:
        prepared = list(pool.map(prepare, ('body.woff2', 'body-bold.woff2', 'title.woff2')))
    result = []
    for name, target, source, cached, key, hit, count in prepared:
        hashed = target.with_name(target.stem + '-' + hashlib.sha256(cached.read_bytes()).hexdigest()[:16] + '.woff2')
        shutil.copy2(cached, hashed)
        css = SITE / '公用/page.css'
        css.write_text(re.sub(re.escape(target.stem) + r'(?:-[0-9a-f]{16})?\.woff2', hashed.name, css.read_text(encoding='utf-8')), encoding='utf-8')
        target.unlink(missing_ok=True)
        result.append(dict(font=name, file=hashed.name, before=source.stat().st_size, after=hashed.stat().st_size, characters=count, cached=hit, key=key))
    print('字体子集：' + '；'.join(f'{r["font"]} {r["before"]}→{r["after"]} 字节，{r["characters"]} 字' for r in result))

def fixed_script_text(text):
    """只取脚本字面量中的显示字符；不把注释、正则或整段程序当字集。"""
    strings = []
    for token, value in lex(text, JavascriptLexer()):
        if token not in String or token in String.Regex or token in String.Interpol:
            continue
        value = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m[1], 16)), value)
        value = re.sub(r'<[^>]*>', '', value)
        strings.append(''.join(c for c in value if ord(c) > 127 and not 0xD800 <= ord(c) <= 0xDFFF))
    return ''.join(strings)


def font_sources():
    sys.path.insert(0, str(HERE))
    fonts = import_module('font-subset')
    original = MATERIAL / '字体'
    records = json.loads((original / '登记.json').read_text(encoding='utf-8'))['fonts']
    for record in records:
        fonts.fixed_source(record, original)
    return fonts, original, records


def web_fonts():
    """共享静态字集、完整实况补片及页面接线，全部在 OSS 定稿之前完成。"""
    fonts, original, records = font_sources()
    by_alias = {}
    for record in records:
        by_alias.setdefault(record['alias'], []).append(record)
    cache = CACHE / 'fonts'
    baseline = ''.join(map(chr, range(32, 127))) + '℃，。！？：；、（）【】「」《》·—–…“”‘’→×−'
    def codepoints(text):
        return {ord(c) for c in text if ord(c) >= 32}
    core_text, article_text = baseline, baseline
    pages = {}
    for page in sorted(SITE.rglob('*.html')):
        raw = page.read_text(encoding='utf-8')
        soup = BeautifulSoup(raw, 'html.parser')
        for hidden in soup.select('script, style'):
            hidden.decompose()
        visible = soup.get_text(' ', strip=True)
        visible += ''.join(str(el.get(attr, '')) for el in soup.find_all(True)
                           for attr in ('title', 'aria-label', 'placeholder'))
        relative = page.relative_to(SITE).as_posix()
        article = relative.startswith(('rules/', 'principles/'))
        second_layer = '/公用/page.css' in raw
        if not second_layer:
            core_text += visible
        if article:
            article_text += visible
        pages[page] = (raw, article, second_layer)
    # 原理页的示意图是单独的 SVG 文件，滑到附近才内联进页面；图里的字照原来内嵌时一样算进这页要的字。
    for figure in sorted((SITE / 'principles').rglob('*.svg')):
        soup = BeautifulSoup(figure.read_text(encoding='utf-8'), 'html.parser')
        for hidden in soup.select('script, style'):
            hidden.decompose()
        visible = soup.get_text(' ', strip=True) + ''.join(str(el.get(attr, '')) for el in soup.find_all(True)
                                                          for attr in ('title', 'aria-label', 'placeholder'))
        core_text += visible
        article_text += visible
    # 字符串中的中英文由原家族分别负责；ASCII 及计数器数字始终完整。
    home_text = baseline + fixed_script_text((HOME_SRC / 'home.js').read_text(encoding='utf-8'))
    for folder in ('header', 'rules', 'principles', 'connect-auth', 'live', 'wall', 'trust-modal', 'app'):
        for source in (SITE / folder).rglob('*'):
            if source.suffix == '.js':
                core_text += fixed_script_text(source.read_text(encoding='utf-8'))
            elif source.suffix == '.css':
                text = source.read_text(encoding='utf-8')
                core_text += ''.join(re.findall(r'''content\s*:\s*["']([^"']*)["']''', re.sub(r'/\*.*?\*/', '', text, flags=re.S)))
    core = codepoints(core_text)
    latin = by_alias['SiteHomeLatin'][0]
    latin_points = fonts.source_cmap(original / latin['file'], cache, latin.get('font_number', -1))
    assets, jobs, declarations = [], [], {name: [] for name in ('ui', 'article', 'live', 'home', 'mono')}
    missing = {}
    for record in records:
        source = original / record['file']
        index = record.get('font_number', -1)
        supported = fonts.source_cmap(source, cache, index)
        alias = record['alias']
        if alias == 'SiteSans':
            requested = core
            parts = fonts.partition(supported, core)
        elif alias == 'SiteBrand':
            requested = codepoints(BeautifulSoup(make_header(''), 'html.parser').select_one('.brand').get_text())
            parts = {'ui': requested & supported}
        elif alias == 'SiteSerif':
            requested = codepoints(article_text)
            parts = {'article': requested & supported}
        elif alias == 'Site404Button':
            requested = codepoints(BeautifulSoup(pages[SITE / '404.html'][0], 'html.parser').select_one('.not-found-copy .pill').get_text())
            parts = {'ui': requested & supported}
        elif alias in ('SiteHomeLatin', 'SiteHomeHan'):
            requested = codepoints(home_text)
            # 沿用原首选 Segoe；它没有的中文、℃及标点由 YaHei UI 接续。
            requested = requested & latin_points if alias == 'SiteHomeLatin' else requested - latin_points
            parts = {'home': requested & supported}
        else:
            requested = supported
            parts = {'mono': supported}
        missing[f'{alias}:{record["file"]}:{index}'] = [f'U+{cp:04X}' for cp in sorted(requested - supported)]
        for name, points in parts.items():
            if points:
                jobs.append((record, name, points))
    # 每个字体的解码源与 cmap 在进程内复用；缓存命中时无需启动裁字进程。
    def prepare(job):
        record, name, points = job
        source = original / record['file']
        return (source, points, cache, record.get('font_number', -1))
    with ProcessPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(fonts.build_font, *(zip(*(prepare(job) for job in jobs)))))
    folder = SITE / '公用/assets/fonts'
    css_folder = SITE / '公用/fonts'
    folder.mkdir(parents=True, exist_ok=True)
    css_folder.mkdir(parents=True, exist_ok=True)
    home_preloads = []
    for (record, name, points), (cached, actual) in zip(jobs, results):
        alias = record['alias']
        filename = f'{Path(record["file"]).stem}-{name}-' + hashlib.sha256(cached.read_bytes()).hexdigest()[:16] + '.woff2'
        target = folder / filename
        shutil.copy2(cached, target)
        ref = '/' + target.relative_to(SITE).as_posix()
        group = ('ui' if name == 'core' else 'live') if alias == 'SiteSans' else name
        families = [alias] + (['SiteSansBlack'] if alias == 'SiteSans' and record['css_weight'] == '800 900' else [])
        for family in families:
            declarations[group].append(f'@font-face{{font-family:"{family}";src:url("{ref}") format("woff2");'
                                       f'font-weight:{record["css_weight"]};font-style:{record["css_style"]};'
                                       f'font-display:swap;unicode-range:{fonts.unicode_range(actual)}}}')
        if group == 'home':
            home_preloads.append(f'<link rel="preload" href="{ref}" as="font" type="font/woff2" crossorigin="anonymous">')
        assets.append(dict(file=ref, bytes=target.stat().st_size, characters=len(actual), group=group,
                           source=record['file'], part=name))
    links = {}
    for group, faces in declarations.items():
        payload = ('\n'.join(faces) + '\n').encode('utf-8')
        target = css_folder / (group + '-' + hashlib.sha256(payload).hexdigest()[:16] + '.css')
        target.write_bytes(payload)
        links[group] = '<link rel="stylesheet" href="/' + target.relative_to(SITE).as_posix() + '">'
        assets.append(dict(file='/' + target.relative_to(SITE).as_posix(), bytes=len(payload), group=group))
    for page, (raw, article, second_layer) in pages.items():
        relative = page.relative_to(SITE).as_posix()
        groups = ['ui'] if '/header/topbar.css' in raw else []
        if article:
            groups += ['article', 'mono']
        if relative.startswith(('live/', 'mcp/', 'computer-access/')):
            groups += ['live', 'mono']
        if second_layer:
            groups += ['mono']
        if relative == 'index.html':
            groups += ['home']
        head = '\n'.join(links[group] for group in groups)
        if relative == 'index.html':
            head += '\n' + '\n'.join(home_preloads)
        page.write_text(raw.replace('</head>', head + '\n</head>', 1), encoding='utf-8')
    (cache / 'web-fonts-report.json').write_text(json.dumps(dict(assets=assets, source_missing=missing,
        core_characters=len(core), article_characters=len(codepoints(article_text))), ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'网页字体：{len(jobs)} 份 WOFF2，{len(links)} 份 CSS，源外字符见 {cache / "web-fonts-report.json"}', flush=True)


def list_thumbnails(card):
    src = SITE / card['图'].lstrip('/')
    if not src.exists():
        src = WEB / card['图'].lstrip('/')
    previous = prior_art('list', src)
    if previous is not None: return previous
    result, raw = [], src.read_bytes()
    with Image.open(src) as image:
        for width in (704, 960, 1024, 1408, 1920, 2080):
            if image.width <= width:
                continue
            key = hashlib.sha256(raw + f'list-{width}-q90-lanczos-v1'.encode()).hexdigest()
            cached = ART_CACHE / f'thumb-{key}.webp'
            if not cached.exists():
                image.convert('RGB').resize((width, round(image.height * width / image.width)), Image.LANCZOS).save(cached, 'WEBP', quality=90, method=6)
            if cached.stat().st_size >= len(raw): continue
            name = f'/wall/img/thumb-{key}.webp'
            shutil.copy2(cached, SITE / name.lstrip('/'))
            result.append([width, name])
    return result


def piece(card, ident, group=''):
    e = html.escape
    kin = f' data-group="{e(group)}"' if group else ''
    if card['状态'] == '占位':
        return (f'    <div class="piece piece--todo" id="{ident}"{kin}>\n'
                f'      <span class="piece__frame"><span class="todo__name">{e(card["名字"])}</span>'
                f'<span class="todo__note">还在做</span></span>\n    </div>')
    w, h = card['尺寸']
    variants = json.dumps(list_thumbnails(card), separators=(',', ':'))
    if card['状态'] == '示意':                      # 示意图：那一页还没有，点不了
        open_tag, close_tag, tag = f'<div class="piece piece--sample" id="{ident}"{kin}>', '</div>', '<span class="piece__tag">示意</span>'
    else:
        open_tag, close_tag = f'<a class="piece" id="{ident}"{kin} href="{e(card["地址"])}">', '</a>'
        tag = f'<span aria-hidden="true" class="piece__find-label">{e(card["名字"])}</span>'
    return (f'    {open_tag}\n'
            f'      <img loading="lazy" class="piece__glow" data-src="{card["光晕"]}" alt="" aria-hidden="true">\n'
            f'      <span class="piece__frame"><img loading="lazy" class="piece__art" crossorigin="anonymous" data-variants=\'{variants}\' data-src="{card["图"]}" width="{w}" height="{h}" alt="{e(card["名字"])}">{tag}</span>\n'
            f'    {close_tag}')


# 返回图墙时，先等卡片排出来，旧页才能缩回实际卡片位置。
WALL_EXPECT = '<link rel="expect" href="#wall" blocking="render">\n'


PAGE = '''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1440">
<title>{title}</title>
<link rel="stylesheet" href="/header/topbar.css">
{wall_expect}<link rel="stylesheet" href="/wall/wall.css">
<link rel="stylesheet" href="/wall/wall-extra.css">
<link rel="stylesheet" href="/motion/motion.css">
<script src="/motion/motion.js"></script>
</head>
<body>

{header}

<main class="{main_class}" id="wall"{main_attr}>
{sections}
</main>

<script src="/header/topbar.js"></script>
<script src="/wall/wall.js"></script>
</body>
</html>
'''


def pick(cards, mode):
    """按“没做好的怎么摆”挑出这一版要挂的卡片。"""
    out = []
    for c in cards:
        if c['真']:
            out.append(dict(c, 状态='真'))
        elif mode == '示意图' and c.get('示意图'):
            out.append(dict(c, 状态='示意', **c['示意图']))
        elif mode in ('占位卡', '示意图'):
            out.append(dict(c, 状态='占位'))
    return out


def write_projects_page(path, cards, mode):
    order = {pid: i for i, pid in enumerate(SETTINGS.get('项目先后', []))}
    chosen = sorted(pick(cards, mode), key=lambda c: order.get(c['ID'], len(order)))   # 照“项目先后”，没列到的排最后
    big = [c for c in chosen if c['核心']]
    small = [c for c in chosen if not c['核心']]
    sections = []
    if big:
        sections.append('  <section class="hang hang--big" aria-label="最要紧的几个项目">\n'
                        + '\n'.join(piece(c, 'p-' + c['ID']) for c in big) + '\n  </section>')
    if small:
        sections.append('  <section class="hang hang--small" aria-label="其余的项目">\n'
                        + '\n'.join(piece(c, 'p-' + c['ID']) for c in small) + '\n  </section>')
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(PAGE.format(title='项目', header=make_header('项目'), main_class='wall', main_attr='', wall_expect=WALL_EXPECT,
                                sections='\n\n'.join(sections)), encoding='utf-8')
    return len(chosen)


def write_skills_page(path, cards, mode):
    order = {sid: i for i, sid in enumerate(SETTINGS.get('技能先后', []))}
    chosen = sorted(pick(cards, mode), key=lambda c: order.get(c['ID'], len(order)))   # 照“技能先后”，没列到的排最后
    sections = ('  <section class="hang hang--small" aria-label="技能">\n'
                + '\n'.join(piece(c, 's-' + c['ID'], c['项目ID']) for c in chosen) + '\n  </section>') if chosen else ''
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(PAGE.format(title='技能', header=make_header('技能'), main_class='wall wall--skills', wall_expect=WALL_EXPECT,
                                main_attr=' data-kin="on"', sections=sections), encoding='utf-8')
    return len(chosen)


def build_lists(projects, skills):
    sample = SETTINGS.get('示意图', {})
    project_cards, skill_cards, real_pages = [], [], {}
    core = set(SETTINGS['大卡片'])                     # 列表页上用大卡片的那几个
    for row in projects:
        pid = row['项目ID']
        pages = project_pages(pid)
        real_pages[pid] = pages
        main = next((p for p in pages if p['种类'] == '主页'), None)
        is_core = pid in core
        card = {'ID': pid, '名字': row['中文名'], '核心': is_core, '真': bool(main)}
        if main:
            src, glow_src, size = make_art(main['封面文件'], pid, 2000 if is_core else 1300, 2.5, pid)
            card.update(名字=main['名字'] or row['中文名'], 地址=main['地址'], 图=src, 光晕=glow_src, 尺寸=size)
        key = sample.get(pid)
        if key and (WALL_SRC / 'img' / f'{key}.jpg').exists():
            card['示意图'] = sample_art(key, f'/{pid}/project.html')
        project_cards.append(card)

    by_project = {}
    for row in skills:
        by_project.setdefault(row['归属项目ID'], []).append(row)
    for prow in projects:                                    # 技能照项目的先后排，同一个项目的挨着
        pid = prow['项目ID']
        for row in by_project.get(pid, []):
            sid = row['技能ID']
            page = next((p for p in real_pages.get(pid, []) if p['种类'] == '技能页' and p['技能ID'] == sid), None)
            card = {'ID': sid, '项目ID': pid, '名字': row['中文名'], '真': bool(page)}
            if page:
                src, glow_src, size = make_art(page['封面文件'], 'sk-' + sid, 1400, 3.0, pid)
                card.update(名字=page['名字'] or row['中文名'], 地址=page['地址'], 图=src, 光晕=glow_src, 尺寸=size)
            key = sample.get('技能:' + sid)
            if key and (WALL_SRC / 'img' / f'{key}.jpg').exists():
                card['示意图'] = sample_art(key, f'/{pid}/{sid}.html')
            skill_cards.append(card)

    n_p = write_projects_page(SITE / 'projects' / 'index.html', project_cards, '不摆')
    n_s = write_skills_page(SITE / 'skills' / 'index.html', skill_cards, '不摆')
    if SETTINGS.get('出三种摆法的比较页'):                     # 要再比一次时在设置里打开，出在 site/_样子/
        for m in PLACEHOLDER_MODES:
            write_projects_page(SITE / '_样子' / f'项目-{m}.html', project_cards, m)
            write_skills_page(SITE / '_样子' / f'技能-{m}.html', skill_cards, m)
    return project_cards, skill_cards, real_pages, n_p, n_s


def sample_art(key, address):
    """列表页试看时用过的示意图（编的封面、画风例图），只在“示意图”这种摆法里用。"""
    out = SITE / 'wall' / 'sample'
    out.mkdir(parents=True, exist_ok=True)
    for suffix in ('.jpg', '-glow.png'):
        shutil.copy2(WALL_SRC / 'img' / f'{key}{suffix}', out / f'{key}{suffix}')
    with Image.open(WALL_SRC / 'img' / f'{key}.jpg') as im:
        size = im.size
    return {'图': f'/wall/sample/{key}.jpg', '光晕': f'/wall/sample/{key}-glow.png', '尺寸': size, '地址': address}


# ---------- 各块 ----------

def build_home():
    for name in ('index.html', 'style.css', 'home.js'):
        shutil.copy2(HOME_SRC / name, SITE / name)
    shutil.copytree(HOME_SRC / 'fx', SITE / 'fx')
    (SITE / 'images').mkdir()
    for f in (HOME_SRC / 'images').iterdir():                # 交接说明里写的上线那几张：*-v2.webp、screen1.b64.js
        if f.name.endswith('-v2.webp') or f.name == 'screen1.b64.js':
            shutil.copy2(f, SITE / 'images' / f.name)
    config = (HOME_SRC / 'config.js').read_text(encoding='utf-8')
    links = ', '.join(f"{k}: '{v}'" for k, v in SETTINGS['首页按钮'].items())
    config, n = re.subn(r'links:\s*\{[^}]*\}', 'links: { ' + links + ' }', config, count=1)
    if n != 1:
        sys.exit('首页 config.js 里没找到 links 那一行，首页的交接可能改了，先看 home-build/交接说明.md')
    (SITE / 'config.js').write_text(config, encoding='utf-8')


def build_header():
    (SITE / 'header').mkdir()
    for name in ('topbar.css', 'topbar.js'):
        shutil.copy2(HEADER_SRC / name, SITE / 'header' / name)


def generate_rule_pages():
    selected = rule_release()
    release, _ = selected
    topics = ['authorization', 'protected-actions', 'privacy-data', 'context-sources', 'execution-coordination',
              'engineering-delivery', 'capabilities-runtime', 'rule-release', 'claude-adapter', 'codex-adapter']
    if (release / 'docs/contracts/agents.antigravity-adapter.md').is_file():
        topics.append('antigravity-adapter')
    generated = [RULES_SRC / name for name in ['index.html', *(f'topic-{topic}.html' for topic in topics)]]
    sources = input_key([*rule_inputs(selected), RULES_SRC / 'build.py', RULES_SRC / 'template.html',
                        RULES_SRC.parent / '目录.json', S / '配置/规则公开改写.json', HEADER_SRC / 'index.html', WALL_SRC / 'index.html'])
    key = hashlib.sha256((sources + '|'.join(version(name) for name in ('beautifulsoup4', 'markdown-it-py', 'mistune'))).encode()).hexdigest()
    cached = CACHE / 'rules-source' / key
    # 本人正文（M099）：和公开稿同一个规则版本、同一次生成，写到电脑服务的运行目录，家里网站和配对设备从那里读；
    # 不再另外手动补、也不固定旧版本。这台电脑上没有电脑服务的运行目录时不写（只出公开稿）。
    owner_out = OWNER_RULES if OWNER_RULES.parent.is_dir() else None
    owner_file = owner_out / f'{release.name}.json' if owner_out else None
    owner_mark = cached / 'owner.sha256'
    owner_fresh = not owner_file or (owner_file.is_file() and owner_mark.is_file()
                                     and hashlib.sha256(owner_file.read_bytes()).hexdigest() == owner_mark.read_text(encoding='ascii'))
    if not FULL and (cached / '.complete').is_file() and owner_fresh:
        for path in generated:
            shutil.copy2(cached / path.name, path)
    else:
        subprocess.run([sys.executable, '-X', 'utf8', '-I', str(RULES_SRC / 'build.py'), '--release', str(release),
                        *(['--owner-out', str(owner_out)] if owner_out else [])], check=True)
        cached.mkdir(parents=True, exist_ok=True)
        for path in generated:
            shutil.copy2(path, cached / path.name)
        if owner_file:
            owner_mark.write_text(hashlib.sha256(owner_file.read_bytes()).hexdigest(), encoding='ascii')
            print(f'规则本人正文：{owner_file}')
        (cached / '.complete').write_text(key, encoding='ascii')
    return generated


def build_rules():
    signed = signed_rule_pages()
    generated = signed[1] if signed else generate_rule_pages()
    out = SITE / 'rules'
    out.mkdir()
    for name in ('rules.css', 'rules.js'):
        shutil.copy2(RULES_SRC / name, out / name)
    header = make_header('规则')
    extra = ''
    for row in SETTINGS.get('规则页右栏多加', []):         # 本人：规则右边的“钩子”跳到实况智能体页的钩子那块（11-27 定，M1115）
        target = row['去哪']
        path = target.lstrip('/').split('#')[0]       # 讲解页在 WEB 下，实况页在 site-v2/live 下
        if (WEB / path).exists() or (S / path).exists():
            dd = f'<a href="{html.escape(target)}">{html.escape(row["字"])}</a>'
        else:
            dd = f'{html.escape(row["字"])}（那一页还在做）'
        extra += f'\n        <div class="meta-extra"><dt>{html.escape(row["名字"])}</dt><dd>{dd}</dd></div>'
    for f in generated:
        text = f.read_text(encoding='utf-8')
        text = HEADER_BLOCK.sub(lambda m: header, text, count=1)
        if extra:
            text, n = re.subn(r'(<aside class="rules-meta".*?)(\n\s*</dl>)', lambda m: m[1] + extra + m[2], text, count=1, flags=re.S)
            if n != 1:
                print(f'  注意：规则页 {f.name} 右栏没找到，没加“{SETTINGS["规则页右栏多加"][0]["名字"]}”那一行')
        text = text.replace('../../header/demo/topbar.css', '/header/topbar.css')
        text = text.replace('../../header/demo/topbar.js', '/header/topbar.js')
        (out / f.name).write_text(with_motion(text), encoding='utf-8')


def build_principles():
    out = SITE / 'principles'
    subprocess.run([sys.executable, '-B', '-X', 'utf8', str(PRINCIPLES_GENERATOR),
                    '--site', str(SITE), '--output', str(out)], check=True)
    page = out / 'index.html'
    text = page.read_text(encoding='utf-8')
    text = HEADER_BLOCK.sub(lambda m: make_header('原理'), text, count=1)
    page.write_text(text, encoding='utf-8')


def build_trust_modal():
    out = SITE / 'trust-modal'
    out.mkdir()
    for name in ('trust-modal.css', 'trust-modal.js'):
        shutil.copy2(TRUST_SRC / name, out / name)
    shutil.copytree(TRUST_SRC / 'img', out / 'img')


def external_inputs():
    """仓库外、这台电脑上实际读到的构建输入（连接电脑页的固定接法、项目名册），进构建指纹。"""
    return [path for path in (CONNECT_VIEWS, *CONNECT_REGISTRIES, WEBSITE_PROJECTS) if path.is_file()]


def connect_fixed():
    """连接电脑页的固定接法（地址、认证、客户端 ID、命令）：和电脑服务给“连接”读数的同一段代码，从现役登记算出。
    写进页面，进页先照它画，不等实时读数（M239）；读到以后照读到的。这台电脑上没有电脑服务的代码或登记时不写，页面照旧等读数。"""
    if not CONNECT_VIEWS.is_file():
        return None
    try:
        connect = runpy.run_path(str(CONNECT_VIEWS))['connect']
        registered = lambda name: json.loads((CONNECT_VIEWS.parents[2] / 'registries' / name).read_text(encoding='utf-8-sig'))
        endpoints = connect({}, registered, {}, None)['data']['endpoints']
        return {'endpoints': {key: endpoints[key] for key in ('main', 'sub')}}
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f'  注意：连接电脑页的固定接法没算出来（{error}），页面照旧等实时读数')
        return None


def build_access_pages():
    (SITE / 'app').mkdir(exist_ok=True)
    shutil.copy2(HERE.parents[1] / 'app' / 'computer-access-model.js', SITE / 'app' / 'computer-access-model.js')
    assets = SITE / 'connect-auth'
    assets.mkdir()
    for name in ('glass.css', 'auth.js', 'connect.js'):
        shutil.copy2(ACCESS_SRC / name, assets / name)
    shutil.copytree(ACCESS_SRC / 'img', assets / 'img')
    for source, route, title in (('auth', 'computer-access', '授权与状态'), ('connect', 'mcp', '连接电脑')):
        out = SITE / route
        out.mkdir()
        text = (ACCESS_SRC / f'{source}.html').read_text(encoding='utf-8')
        text = HEADER_BLOCK.sub(lambda m: make_header(title), text, count=1)
        text = text.replace('../../header/demo/', '/header/')
        text = text.replace('../../trust-modal/', '/trust-modal/')     # 通用“不可信设备”弹框
        for name in ('glass.css', f'{source}.js'):
            text = text.replace(f'"{name}"', f'"/connect-auth/{name}"')
        text = text.replace('src="img/', 'src="/connect-auth/img/')
        if source == 'connect' and (fixed := connect_fixed()):
            script = '<script src="/connect-auth/connect.js"></script>'
            if text.count(script) != 1:
                sys.exit('连接电脑页引 connect.js 的那一行变了，先看一眼再改组装.py')
            payload = json.dumps(fixed, ensure_ascii=False, separators=(',', ':')).replace('</', r'<\/')
            text = text.replace(script, f'<script type="application/json" id="connect-fixed">{payload}</script>\n{script}')
        (out / 'index.html').write_text(text, encoding='utf-8')


def build_wall_assets():
    out = SITE / 'wall'
    out.mkdir(exist_ok=True)
    shutil.copy2(WALL_SRC / 'wall.css', out / 'wall.css')
    shutil.copy2(MATERIAL / 'wall-extra.css', out / 'wall-extra.css')
    js = (WALL_SRC / 'wall.js').read_text(encoding='utf-8')
    stop = "pieces.forEach((p) => p.addEventListener('click', (e) => e.preventDefault()));"
    if stop not in js:
        sys.exit('列表页 wall.js 里“点了先不跳”那一行变了，先看一眼再改组装.py')
    (out / 'wall.js').write_text(js.replace(stop, '// 整站里点卡片直接进那一页（试看页里这里是“点了先不跳”）'), encoding='utf-8')



def button_thumbnail(folder, value):
    source = folder / value[0]
    previous = prior_art('button', source, value[1])
    if previous is not None:
        value[:] = previous
        return
    raw = source.read_bytes()
    with Image.open(source) as image:
        value[2:] = image.size  # 留原图比例，缩图高度取整也不改变按钮几何。
        width = round(float(value[1][:-3]) * 32)  # project.json 的 rem × 16px × 2。
        if image.width <= width:
            return
        key = hashlib.sha256(raw + f'button-{width}-rgba-q90-lanczos-exact-v1'.encode()).hexdigest()
        cached = ART_CACHE / f'button-{key}.webp'
        if not cached.exists():
            image.convert('RGBA').resize((width, round(image.height * width / image.width)), Image.LANCZOS).save(cached, 'WEBP', quality=90, method=6, exact=True)
        if cached.stat().st_size < len(raw):
            shutil.copy2(cached, folder / cached.name)
            value[0] = cached.name


def unmention(line, names, where):
    """不给访客看的项目在别的项目正文里被点名：只出现在列表项里的，整条列表项拿掉；别处还点名就停下，改那句正文。"""
    for name in names:
        changed = re.sub(r'(?m)^[ \t]*[-*] [^\n]*〔' + re.escape(name) + r'〕[^\n]*\n?', '', line)
        if changed != line:
            line = changed.rstrip('\n')
        if f'〔{name}〕' in line:
            raise ValueError(f'{where} 的正文还点名不给访客看的〔{name}〕，改这句正文')
    return line


def build_project_pages(real_pages):
    hidden = hidden_ids()
    withdrawn = [r for r in read_table(TABLE.read_text(encoding='utf-8-sig'), '技能表') if r['状态'] == '下线']
    withdrawn_names = {r['中文名'] for r in withdrawn}
    withdrawn_routes = {route for r in withdrawn for route in (
        f"/{r['归属项目ID']}/{r['技能ID']}.html", f"/skills/{r['技能ID']}")}
    ignore = shutil.ignore_patterns('*.py', '*.md', '__pycache__', '*旧*', '*方针前*', '验证-*.json', '验收', 'tmp', 'motion', 'page-loader.js')  # 验收、tmp 是流水线自查的截图和浏览器临时目录，不上站；主持正在截图时整站拼也不会撞上
    shutil.copytree(WEB / '公用', SITE / '公用', ignore=ignore)
    route_names = SITE / '公用' / '页名到地址.json'
    if route_names.is_file():
        names = json.loads(route_names.read_text(encoding='utf-8'))
        shown = {name: href for name, href in names.items() if not hidden_route(href, hidden)}
        if shown != names:
            route_names.write_text(json.dumps(shown, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    shutil.copy2(MATERIAL / '项目页配页眉.css', SITE / '公用' / '配页眉.css')
    loader = (WEB / '公用' / 'page-loader.js').read_text(encoding='utf-8')
    scripts = re.compile(r'<script src="(content\.js|\.\./公用/(?:page|button-art)\.js)" defer></script>')
    count = 0
    for pid, pages in real_pages.items():
        if not pages:
            continue
        shutil.copytree(WEB / pid, SITE / pid, ignore=ignore)
        nav = {p['地址'].rsplit('/', 1)[1]: ('技能' if p['种类'] == '技能页' else '项目') for p in pages}
        descriptions = {p['地址'].rsplit('/', 1)[1]: p['它是什么'] for p in pages}
        html_files = list((SITE / pid).glob('*.html'))
        active = [page for page in html_files if page.name in nav]
        retired = [page for page in html_files if page.name not in nav]
        for page in retired:
            page.unlink()
        slugs = {re.search(r'data-page="([^"]+)"', page.read_text(encoding='utf-8'))[1] for page in active}
        content = SITE / pid / 'content.js'
        raw = content.read_text(encoding='utf-8')
        start = raw.index('window.PROJECT_CONFIG = ') + len('window.PROJECT_CONFIG = ')
        config, end = json.JSONDecoder().raw_decode(raw[start:])
        tail = raw[start+end:]
        data_start = tail.index('window.PAGE_DATA = ') + len('window.PAGE_DATA = ')
        data, data_end = json.JSONDecoder().raw_decode(tail[data_start:])
        def project_route(address):
            route = urlsplit(address or '')
            return posixpath.normpath(posixpath.join(f'/{pid}', unquote(route.path))) if route.path and not (route.scheme or route.netloc) else None

        old_routes = {f'/{pid}/{page.name}' for page in retired}
        data_changed = bool(set(data) - slugs)
        if retired or set(data) - slugs:
            old_routes.update(project_route(page.get('href')) for slug, page in config['pages'].items() if slug not in slugs)
            config['pages'] = {slug: value for slug, value in config['pages'].items() if slug in slugs}
            data = {slug: cards for slug, cards in data.items() if slug in slugs}
        old_routes.discard(None)
        references = config.get('references', {})
        gone_routes = old_routes | withdrawn_routes
        gone = withdrawn_names | {name for name, href in references.items() if project_route(href) in gone_routes}
        removed_refs = set(references) & gone
        unlisted = {name for name, href in references.items() if hidden_route(project_route(href), hidden)}
        if gone_routes or unlisted:
            for cards in data.values():
                for card in cards:
                    buttons = [button for button in card['buttons'] if project_route(button.get('href')) not in gone_routes
                               and not hidden_route(project_route(button.get('href')), hidden)]
                    detail = card['detail']
                    for name in gone:
                        detail = [line.replace(f'〔{name}〕', f'{name}（说明页已撤下）') for line in detail]
                    detail = [line for line in (unmention(line, unlisted, f'{pid}/{card.get("id", "")}') for line in detail) if line]
                    data_changed |= buttons != card['buttons'] or detail != card['detail']
                    card.update(buttons=buttons, detail=detail)
            for name in removed_refs | unlisted: references.pop(name)
        if data_changed:
            tail = tail[:data_start] + json.dumps(data, ensure_ascii=False, indent=2) + tail[data_start+data_end:]
        buttons = list(config.get('buttonArt', {}).values())
        if config.get('detailArt'):
            buttons.append(config['detailArt'])
        for value in buttons:
            button_thumbnail(content.parent / 'assets/buttons', value)
        project_file = content.parent / 'project.json'
        project = json.loads(project_file.read_text(encoding='utf-8-sig'))
        project['sections'] = {name: section for name, section in project['sections'].items() if section['slug'] in slugs}
        for key in ('buttonArt', 'detailArt'):
            if key in config:
                project[key] = config[key]
        project_file.write_text(json.dumps(project, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        for value in buttons:
            value[0] = 'assets/buttons/' + value[0]
        content.write_text(raw[:start] + json.dumps(config, ensure_ascii=False, indent=2) + tail, encoding='utf-8')
        for f in active:
            text = f.read_text(encoding='utf-8')
            text = text.replace('width=device-width, initial-scale=1', 'width=1440')
            header = make_header(nav.get(f.name, '项目'))
            # 换掉流水线的临时页眉；留一个看不见的空壳，page.js 量它的高度（量出来是 0）
            text, n = re.subn(r'<header class="site-header">.*?</header>',
                              lambda m: header + '<div class="site-header" aria-hidden="true"></div>', text, count=1, flags=re.S)
            if n != 1:
                print(f'  注意：{pid}/{f.name} 里没找到临时页眉，没换')
            text = text.replace('<link rel="stylesheet" href="../公用/page.css">',
                                '<link rel="stylesheet" href="/header/topbar.css"><link rel="stylesheet" href="../公用/page.css">', 1)
            text = text.replace('</head>', '<link rel="stylesheet" href="../公用/配页眉.css"><script src="/header/topbar.js" defer></script></head>', 1)
            slug = re.search(r'data-page="([^"]+)"', text)[1]
            first = data[slug][0]
            title = first['title'] if first['title'] != '封面' else config['pages'][slug].get('title') or config['title']
            e = html.escape
            entry = (f'<section class="picture" id="{e(first["id"])}" data-initial-cover>'
                     f'<img crossorigin="anonymous" src="{e(first["image"])}" data-cover-pending width="{first["width"]}" height="{first["height"]}" '
                     f'alt="{e(first["title"])}" fetchpriority="high"><h2 class="picture-title-fallback">{e(title)}</h2>'
                     '<p class="picture-cover-error" role="status">封面图暂时没加载出来。'
                     f'<br>{e(descriptions[f.name])}</p></section>')
            text = re.sub(r'(<main id="pictures"[^>]*>)', lambda m: m[0] + entry, text, count=1)
            text = text.replace('</head>', '<link rel="expect" href="#pictures" blocking="render"></head>', 1)
            text = scripts.sub(r'<script type="application/x-project-script" data-src="\1"></script>', text)
            text = text.replace('</body>', f'<script>{loader}</script>\n</body>', 1)
            f.write_text(with_motion(text), encoding='utf-8')
            count += 1
    return count


# ---------- 检查站内链接 ----------

CHECK_RECORDS = {'.build-receipt.json', 'release-manifest.json', 'release-identity.json'}
LIVE_CONSTRUCTION_ROUTES = {'live/backup', 'live/issue', 'live/item', 'live/records'}
# 这些字符串是运行时 API 或开发样本前缀，不是静态页面；其余链接仍逐个查文件。
RUNTIME_REFS = {
    'app/computer-access-model.js': {'/computer-access/api', '/requests', '/status'},
    'connect-auth/auth.js': {'/cancel', '/locks/', '/requests/', '/requests/cooldown', '/unlocks/windows'},
    'live/_lib/live-client.js': {'/__computer/cockpit-device/pair', '/__computer/cockpit/open', '/__computer/cockpit/automation-settings', '/__live/', '/live/_fixtures/', '/release-identity.json', '.json'},
    # 使用时间页自己取明细续页和拆出去的块：本机预览走 /__live/，后端给的补取地址以接口路径开头
    'live/usage/page.js': {'/__live/', '/computer-access/live/v1/computer/usage?'},
    'rules/rules.js': {'/__live/'},
    # 首页拿链接里有没有这一段来定“这项任务／这类资料”的说法，不是链接
    'live/l1.js': {'/backup/', '/task/'},
    # 只在本地双击打开（file:）时读；网上用页面里的图。Windows 安全中心把这份 base64 图误报隔离，构建里可能没有它
    'fx/mount.js': {'images/screen1.b64.js'},
}
RUNTIME_REFS['live/_lib/live-client.js'].update(('/__computer/cockpit/actions', '/__computer/cockpit/actions/receipt'))


def check_public_words(root, policy, files=None, expression=public_word_pattern, approved=None):
    pattern = re.compile(expression(policy))
    approved = approved if approved is not None else []
    hits = []
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root).as_posix()
        if relative in CHECK_RECORDS or (files is not None and relative not in files):
            continue
        if not path.is_file() or path.suffix.lower() not in {'.html', '.js', '.json', '.txt', '.xml', '.svg'}:
            continue
        try:
            text = path.read_text(encoding='utf-8-sig')
        except UnicodeDecodeError:
            text = path.read_text(encoding='gb18030')
        if path.suffix.lower() == '.json':
            text = word_policy.apply_public_judgments(text, pattern, 'dist/' + relative, approved)
        if path.suffix.lower() in {'.html', '.svg', '.xml'}:
            soup = BeautifulSoup(text, 'html.parser')
            text = '\n'.join([soup.get_text(), *[str(v) for tag in soup.find_all(True) for v in tag.attrs.values()],
                              *[tag.get_text() for tag in soup.find_all(['script', 'style'])]])
        text = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m[1], 16)), html.unescape(text)).replace(r'\n', '\n')
        for match in pattern.finditer(text):
            if word_policy.allow_word_exception(policy, 'dist/' + relative, text, match, approved):
                continue
            left = max(text.rfind(mark, 0, match.start()) for mark in '\n。！？"\'') + 1
            ends = [end + 1 for mark in '\n。！？"\'' if (end := text.find(mark, match.end())) >= 0]
            sentence = re.sub(r'\s+', ' ', text[left:min(ends, default=len(text))]).strip(' \n"\'')
            hits.append((path.relative_to(root).as_posix(), match[0], sentence))
    return hits

def sync():
    """把 .拼装中/ 同步到 site/：只写内容变了的、删掉多出来的。返回 (新增, 改了, 删了) 三个清单。"""
    added, changed, removed = [], [], []
    OUT.mkdir(parents=True, exist_ok=True)
    def copy_file(f):
        rel = f.relative_to(SITE)
        dst = OUT / rel
        is_new = not dst.exists()
        if not is_new and f.read_bytes() == dst.read_bytes():
            return None
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, dst)
        return is_new, rel.as_posix()
    files = sorted(f for f in SITE.rglob('*') if f.is_file())
    with ThreadPoolExecutor(max_workers=8) as pool:
        for result in pool.map(copy_file, files):
            if result:
                (added if result[0] else changed).append(result[1])
    for f in sorted(OUT.rglob('*'), reverse=True):
        rel = f.relative_to(OUT)
        if f.is_dir():
            if not any(f.iterdir()):
                f.rmdir()
        elif not (SITE / rel).exists():
            removed.append(rel.as_posix())
            f.unlink()
    return added, changed, removed


def report(label, files):
    if not files:
        return
    pages = [f for f in files if f.endswith('.html')]
    others = len(files) - len(pages)
    print(f'{label} {len(files)} 个文件' + (f'，其中网页：' + '、'.join(pages) if pages else '') + (f'（另有图、样式、脚本 {others} 个）' if pages and others else ''))


def check_links():
    bad = []
    page_warnings = []
    unfinished = set()
    files = {p.relative_to(OUT).as_posix() for p in OUT.rglob('*') if p.is_file()}
    folded = {p.casefold(): p for p in files}
    if any(name not in files for name in SITE_ICONS): print('网站图标还没放')
    manifest = OUT / 'release-manifest.json'
    objects = json.loads(manifest.read_text(encoding='utf-8')).get('oss', {}).get('objects', {}) if manifest.is_file() else {}
    source_keys = {unquote(urlsplit(row['url']).path, encoding='utf-8', errors='strict'): relative for relative, row in objects.items()}
    jsbases = {}
    for page in OUT.rglob('*.html'):
        for src in re.findall(r'''<script[^>]+src=["']([^"']+)["']''', page.read_text(encoding='utf-8-sig')):
            src = unquote(urlsplit(html.unescape(src)).path, encoding='utf-8', errors='strict')
            key = source_keys.get(src, posixpath.normpath(src if src.startswith('/') else page.parent.relative_to(OUT).as_posix() + '/' + src).lstrip('/'))
            jsbases.setdefault(key, set()).add(page.parent.relative_to(OUT).as_posix())
    for f in OUT.rglob('*'):
        if f.suffix not in ('.html', '.js', '.css') or f.name.endswith('.b64.js'):
            continue
        text = f.read_text(encoding='utf-8-sig')
        if f.suffix == '.html':
            # 原理页的示意图是单独的 SVG 文件、滑到附近才取，HTML 只剩正文；数据另有下一条查。
            if f.stat().st_size > 200_000: bad.append((f.relative_to(OUT).as_posix(), 'HTML 超过 200KB'))
            embedded = re.search(r'''data:[^"'\s]{0,120};base64,[A-Za-z0-9+/=]{4096}''', text) or any(len(b.encode('utf-8')) > 8192 and re.search(r'(?:^|=)\s*[\[{]', b) for b in re.findall(r'<script[^>]*>(.*?)</script>', text, re.S | re.I))
            if embedded: bad.append((f.relative_to(OUT).as_posix(), 'HTML 内嵌大段 base64/JSON 数据'))
        refs = re.findall(r'''(?:href|src)\s*=\s*["']([^"']+)["']''', text)
        refs += re.findall(r'''"(?:href|image|background)":\s*"([^"]+)"''', text)
        refs += re.findall(r'''url\(["']?([^"')]+)''', text)
        if f.name != 'content.js':
            refs += re.findall(r'''["'`](/[^"'`\r\n<>]*)["'`]''', text)
            refs += re.findall(r'''["'`]([^"'`\r\n<>]*?\.(?:png|jpe?g|webp|svg|gif|avif|css|js|json|html|woff2?|ttf|mp4|webm)(?:[?#][^"'`\r\n<>]*)?)["'`]''', text, re.I)
        elif 'window.PROJECT_CONFIG = ' in text:
            config = json.JSONDecoder().raw_decode(text.split('window.PROJECT_CONFIG = ', 1)[1])[0]
            refs += [r for r in config.get('references', {}).values() if r]
            art = list(config.get('buttonArt', {}).values())
            if config.get('detailArt'):
                art.append(config['detailArt'])
            refs += [a[0] if '/' in a[0] else 'assets/buttons/' + a[0] for a in art]
        bases = {f.parent.relative_to(OUT).as_posix()} if "new URL('.', document.currentScript.src)" in text else jsbases.get(f.relative_to(OUT).as_posix(), {f.parent.relative_to(OUT).as_posix()})
        for ref in set(refs):
            ref = re.sub(r'^\s*\d+(?:\.\d+)?\s*;\s*url\s*=\s*', '', ref, flags=re.I)
            relative = f.relative_to(OUT).as_posix()
            if ref in RUNTIME_REFS.get(relative, set()):
                continue
            if ref.startswith(('#', '%23')) or ' + ' in ref:
                continue
            absolute = re.match(r'(?:[a-z][a-z\d+.-]*:|//)', ref, re.I)
            if absolute and not re.match(r'(?:https?:)?//wly0829\.cn(?::\d+)?(?=[/?#]|$)', ref, re.I):
                continue
            try:
                path = unquote(urlsplit(html.unescape(ref)).path or ('/' if absolute else ''),
                               encoding='utf-8', errors='strict')
            except (UnicodeDecodeError, ValueError):
                (page_warnings if absolute else bad).append((relative, ref + '（URL 编码有误）'))
                continue
            if not path or '${' in path:
                continue
            extension = posixpath.splitext(path.rstrip('/'))[1].lower()
            is_page = path.endswith('/') or extension in ('', '.html', '.htm')
            if absolute and not is_page:
                continue
            for base in bases:
                key = posixpath.normpath(path if path.startswith('/') else base + '/' + path).lstrip('/')
                if (OUT / key).is_dir():
                    key = (key.rstrip('/') + '/index.html').lstrip('/')
                if key in SITE_ICONS and key not in files: continue
                if key not in files:
                    if relative.startswith('live/') and key.rstrip('/') in LIVE_CONSTRUCTION_ROUTES:
                        unfinished.add((relative, '/' + key.rstrip('/') + '/'))
                        continue
                    actual = folded.get(key.casefold())
                    findings = page_warnings if is_page else bad
                    findings.append((relative, ref + (f'（大小写不符，实际 /{actual}）' if actual else '（文件不存在）')))
    # 构建把写全的站内图址换成云端地址、图只放云端；脚本、样式、JSON 里漏换的站内图址上线后在网站上取不到（预览直接读产物看不出）。
    github = set(json.loads(manifest.read_text(encoding='utf-8')).get('files', {})) if manifest.is_file() else set()
    image_ref = re.compile(r'''["'`(](/[^"'`()\s<>?#]+\.(?:webp|png|jpe?g|gif|svg|avif))["'`)?#]''', re.I)
    for f in OUT.rglob('*'):
        if f.suffix not in ('.js', '.css', '.json') or f.name == 'release-manifest.json' or '_fixtures' in f.parts:
            continue
        for m in image_ref.finditer(f.read_text(encoding='utf-8-sig', errors='replace')):
            rel = unquote(m[1]).lstrip('/')
            if rel in objects and rel not in github:
                bad.append((f.relative_to(OUT).as_posix(), m[1] + '（图只在云端，这里还是站内地址，上线后取不到）'))
    routes = json.loads((OUT / '公用/页名到地址.json').read_text(encoding='utf-8-sig'))
    for f in OUT.glob('*/content.js'):
        data = json.JSONDecoder().raw_decode(f.read_text(encoding='utf-8').split('window.PAGE_DATA = ', 1)[1])[0]
        for cards in data.values():
            for card in cards:
                for button in card.get('buttons', []):
                    if button.get('href'):
                        continue
                    label = button['label']
                    name = re.search(r'〔([^〕]+)〕|`(/[^`]+)`', label)
                    href = routes.get((name[1] or name[2]) if name else '驾驶舱入口', '')
                    target = OUT / href.lstrip('/')
                    if href.endswith('/'):
                        target /= 'index.html'
                    if href and target.is_file():
                        bad.append((f.relative_to(OUT).as_posix()+'#'+card['id'], f'灰按钮「{label}」已有目标 {href}'))
    for page, route in sorted(unfinished):
        print(f'实况施工中：{page} → {route}')
    return sorted(set(bad)), sorted(set(page_warnings))


def report_page_links(warnings):
    print(f'站内页面链接异常 {len(warnings)} 处（仅提示）')
    for page, ref in warnings:
        print(f'  {page} → {ref}')


SITE_ICONS = ('favicon.ico', 'icon-192.png', 'apple-touch-icon.png')


def build_not_found():
    text = PAGE.format(title='404', header=make_header(''), main_class='not-found', main_attr='', wall_expect='',
                       sections='<img src="/公用/404/404-插画.compressed.webp" width="1672" height="941" fetchpriority="high" alt=""><div class="not-found-copy"><h1>这里没有这页。</h1><p>地址可能已经变化，也可能从未存在。</p><a class="pill" href="/">返回系统首页</a></div>')
    style = '''<style>
body{background:#f7f2ec}.not-found{position:relative;margin-top:79px}.not-found>img{display:block;width:100%;height:auto}
.not-found-copy{position:absolute;left:5%;top:31%;max-width:29%;color:#171c19;font-family:Arial,"SiteSans","HarmonyOS Sans SC","PingFang SC","Microsoft YaHei",sans-serif}
.not-found-copy h1{margin:0;font-size:clamp(28px,2.8vw,49px);line-height:1.2;font-weight:800;letter-spacing:-.04em}
.not-found-copy p{margin:20px 0 24px;font-size:clamp(14px,1.15vw,20px);line-height:1.7;color:#3d4440}
.not-found-copy .pill{padding:.65em 1.15em;border-radius:12px;font:600 clamp(14px,1.15vw,20px)/1.3 Arial,"Site404Button","Microsoft YaHei",sans-serif;background:linear-gradient(#fffffff0,#eef3eff0);border:1px solid #ffffffc9;box-shadow:0 3px 10px #36544138,inset 0 1px 2px #fff;color:#17221b}
</style>'''
    text = text.replace('</head>', style + '</head>')
    text = text.replace('</head>', '<meta name="robots" content="noindex, follow"></head>')
    text = text.replace('/wall/wall.css', '/rules/rules.css')
    text = text.replace('<link rel="stylesheet" href="/wall/wall-extra.css">', '')
    text = text.replace('<script src="/wall/wall.js"></script>', '')
    (SITE / '404.html').write_text(text, encoding='utf-8')


def build_page_heads(real_pages, skill_cards):
    """只在组装副本的 head 里加正式地址、摘要、分享图和浅色声明，文字来自现有稿，并返回发布页面采用的正文图。"""
    from urllib.parse import quote
    metadata, titles = {}, {}
    illustrations = set()
    live_descriptions = json.loads((S / 'live/pages.json').read_text(encoding='utf-8'))
    for pid, pages in real_pages.items():
        if not pages:
            continue
        raw = (SITE / pid / 'content.js').read_text(encoding='utf-8')
        data = json.JSONDecoder().raw_decode(raw.split('window.PAGE_DATA = ', 1)[1])[0]
        project_name = next((page['名字'] for page in pages if page['种类'] == '主页'), '')
        for page in pages:
            path = SITE / page['地址'].lstrip('/')
            if page['种类'] == '子页':
                titles[path] = ' · '.join(filter(None, (page['名字'], project_name)))
            key = re.search(r'data-page="([^"]+)"', path.read_text(encoding='utf-8'))[1]
            cards = data[key]
            illustrations.update((SITE / pid / card['image']).resolve() for card in cards)
            cover = cards[0]
            lines = [s.strip() for s in cover['imageText'].splitlines() if s.strip()]
            description = page['它是什么'] or ' '.join(lines[1:])
            description = re.sub(r'^[（(][^）)]{1,12}[）)]', '', description)
            image = '/' + pid + '/' + cover['image']
            variants = list_thumbnails({'图': image})
            if variants:
                image = next((url for width, url in variants if width >= 960), variants[-1][1])
            metadata[path] = (description, image)
    guides = {c['ID']: [c['地址'], re.split(r'(?<=[。！？])', metadata[SITE / c['地址'].lstrip('/')][0], maxsplit=1)[0]]
              for c in skill_cards if c['真']}
    moved = SITE / 'live/agents/moved.js'
    moved.write_text('window.AgentSkillGuides = ' + json.dumps(guides, ensure_ascii=False) + ';\n' + moved.read_text(encoding='utf-8'), encoding='utf-8')
    for path in SITE.rglob('*.html'):
        text = path.read_text(encoding='utf-8')
        original_title = html.unescape(re.search(r'<title>(.*?)</title>', text, re.S)[1])
        title = titles.get(path, original_title)
        if path.parent == SITE / 'rules' and path.name.startswith('topic-'):
            heading = re.search(r'<h1\b[^>]*\bdata-source-title\b[^>]*>(.*?)</h1>', text, re.S)[1]
            title = html.unescape(re.sub(r'<[^>]*>', '', heading)).strip() + ' · 规则'
        if path.parent.name in ('mcp', 'computer-access'):
            title = {'mcp': '连接电脑', 'computer-access': '授权与状态'}[path.parent.name]
        if title != original_title:
            text = re.sub(r'<title>.*?</title>', lambda _: f'<title>{html.escape(title)}</title>', text, count=1, flags=re.S)
        if path.is_relative_to(SITE / 'live'):
            route = '/' + path.relative_to(SITE).as_posix().removesuffix('index.html')
            metadata[path] = (live_descriptions.get(route, title + '的当前状态与相关记录。'), '/images/screen1-text-v2.webp')
        main = text.split('<main', 1)[-1]
        article = re.split(r'<article\b[^>]*class="rules-body"[^>]*>', main, maxsplit=1)[-1]
        paragraphs = re.findall(r'<p\b[^>]*>(.*?)</p>', article, re.S)
        first = next((re.sub(r'<[^>]*>', '', p).strip() for p in paragraphs if re.sub(r'<[^>]*>', '', p).strip()), '')
        if not first:
            label = re.search(r'<section\b[^>]*aria-label="([^"]+)"', main)
            first = label[1] if label else title
        images = re.findall(r'<img\b[^>]*>', main)
        image_tag = next((tag for tag in images if 'class="piece__art"' in tag), images[0] if images else '')
        image_ref = re.search(r'(?:data-src|src)="([^"]+)"', image_tag)
        image = posixpath.normpath(posixpath.join('/' + path.parent.relative_to(SITE).as_posix(), image_ref[1])) if image_ref else '/images/screen1-text-v2.webp'
        variants = re.search(r"data-variants='([^']+)'", image_tag)
        if variants and (small := json.loads(html.unescape(variants[1]))):
            image = next((url for width, url in small if width >= 960), small[-1][1])
        if path == SITE / 'index.html' and image_tag:
            first = re.search(r'alt="([^"]+)"', image_tag)[1]
        description, image = metadata.get(path, (html.unescape(first), image))
        description = re.split(r'(?<=[。！？])', description, maxsplit=1)[0]
        tags = '<meta name="color-scheme" content="only light">\n<style>:root{color-scheme:only light}</style>\n'
        tags += '<link rel="icon" href="/favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
        if path != SITE / '404.html':
            route = '/' + path.relative_to(SITE).as_posix()
            if route.endswith('index.html'):
                route = route[:-10]
            canonical = 'https://wly0829.cn' + quote(route, safe='/')
            tags += f'<link rel="canonical" href="{canonical}">\n<meta property="og:url" content="{canonical}">\n'
        for attribute, key, value in [('name', 'description', description), ('property', 'og:title', title),
                                      ('property', 'og:description', description), ('property', 'og:type', 'website'), ('property', 'og:image', image)]:
            tags += f'<meta {attribute}="{key}" content="{html.escape(value, quote=True)}">\n'
        text = re.sub(r'<link\b[^>]*rel="icon"[^>]*>', '', text)
        text = text.replace('</head>', tags + '</head>', 1)
        path.write_text(text, encoding='utf-8')
    return illustrations


def finish_page_heads():
    # 压图先识别根相对地址，完成后再给分享爬虫使用绝对地址。
    from urllib.parse import quote
    for name in SITE_ICONS:
        source = WEB / '公用' / '图标' / name
        if source.suffix == '.png':
            with Image.open(source.with_suffix('.webp')) as icon: icon.save(SITE / name, 'PNG')
        elif source.is_file():
            shutil.copy2(source, SITE / name)
    for path in SITE.rglob('*.html'):
        text = path.read_text(encoding='utf-8')
        text = re.sub(r'(<meta property="og:image" content=")([^"]+)',
                      lambda m: m[1] + 'https://wly0829.cn' + quote(html.unescape(m[2]), safe='/'), text)
        path.write_text(text, encoding='utf-8')


def build_live():
    source = S / 'live'
    if source.is_dir():
        shutil.copytree(source, SITE / 'live', ignore=shutil.ignore_patterns(
            '_fixtures', '__pycache__', '*.py', '*.ps1', '*.md', 'pages.json'))


def build_live_fallback():
    """本机用 WLY_LIVE_FALLBACK_CMD 配整条命令；输出参数写成 \"{out}\"。设了却没生成就让构建失败。"""
    out = SITE / 'live/_fallback.json'
    out.unlink(missing_ok=True)
    command = os.environ.get('WLY_LIVE_FALLBACK_CMD', '').strip()
    if not command:
        return
    try:
        if '{out}' not in command:
            raise ValueError('命令缺少 {out}')
        out.parent.mkdir(parents=True, exist_ok=True)
        result = subprocess.run(command.replace('{out}', str(out)), shell=True, timeout=120,
                                stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
                                text=True, encoding='utf-8', errors='replace')
        if result.returncode:
            tail = ' | '.join((result.stderr or '').strip().splitlines()[-3:])
            raise ValueError(f'命令退出 {result.returncode}' + (f'：{tail}' if tail else ''))
        data = live_fallback.read_checked_fallback(out)
        print(f'实况垫底文件：{len(data["resources"])} 个资源，数据截止 {data.get("at", "未知")}')
    except (OSError, ValueError, subprocess.TimeoutExpired) as error:
        out.unlink(missing_ok=True)
        print(f'实况垫底文件没生成：{error}', flush=True)
        raise SystemExit(f'设了 WLY_LIVE_FALLBACK_CMD 却没生成实况垫底文件，构建停下：{error}') from error


def assemble():
    ART_CACHE.mkdir(parents=True, exist_ok=True)
    projects, skills = step(load_catalog)
    for build in (build_home, build_header, build_rules, build_trust_modal, build_access_pages, build_wall_assets):
        step(build)
    shutil.copytree(WEB / '公用' / 'motion', SITE / 'motion', ignore=shutil.ignore_patterns('*.md'))
    pcards, scards, real_pages, n_p, n_s = step(build_lists, projects, skills)
    n_html = step(build_project_pages, real_pages)
    step(build_principles)
    step(build_not_found)
    step(build_live)
    illustrations = step(build_page_heads, real_pages, scards)
    step(subset_fonts)
    step(web_fonts)
    real_p = [c['名字'] for c in pcards if c['真']]
    real_s = [c['名字'] for c in scards if c['真']]
    print(f'项目 {len(pcards)} 个，做好的 {len(real_p)} 个：{"、".join(real_p) or "无"}')
    print(f'技能 {len(scards)} 个，做好的 {len(real_s)} 个：{"、".join(real_s) or "无"}')
    print(f'没做好的摆法：{SETTINGS["没做好的怎么摆"]}；列表页挂了 项目 {n_p} 张、技能 {n_s} 张')
    print(f'项目里的网页 {n_html} 张换上了真页眉')
    exec(compile((HERE / '压图.py').read_text(encoding='utf-8'), str(HERE / '压图.py'), 'exec'), compression := {})
    step(compression['optimize'], SITE, illustrations)
    step(finish_page_heads)


def main():
    global OUT, CACHE, ART_CACHE, FULL
    ap = argparse.ArgumentParser()
    ap.add_argument('--只检查', action='store_true')
    ap.add_argument('--output', type=Path, default=OUT)
    ap.add_argument('--不检查', action='store_true', help='交整站构建叠入实况后统一检查')
    ap.add_argument('--full', action='store_true', help='重跑组装和生成页，图与字体仍按内容缓存')
    ap.add_argument('--cache-dir', type=Path, default=CACHE, help='可指定空目录测全冷构建')
    args = ap.parse_args()
    OUT = args.output.resolve()
    CACHE, FULL = args.cache_dir.resolve(), args.full
    ART_CACHE = CACHE / 'art' / version('Pillow')
    try:
        policy = load_public_policy()
    except (ValueError, OSError) as error:
        sys.exit(str(error))
    if not args.只检查:
        step(font_sources)
        if SITE.exists():
            shutil.rmtree(SITE)
        inputs = [*source_files(), *rule_inputs(), HERE.parents[1] / 'app/computer-access-model.js', WEBSITE_PROJECTS]
        dependencies = '|'.join(version(name) for name in ('Pillow', 'fonttools', 'brotli', 'beautifulsoup4', 'markdown', 'markdown-it-py', 'mistune', 'Pygments'))
        key = hashlib.sha256((step(input_key, inputs) + dependencies).encode()).hexdigest()
        def create():
            SITE.mkdir()
            assemble()
        cached_tree('assembled', key, SITE, create)
        # 导出实时数据不进组装缓存；缓存命中时也重新取，失败时清掉旧副本。
        step(build_live_fallback)
        added, changed, removed = step(sync)
        if not (added or changed or removed):
            print('和上次比没有任何变化，site/ 一个文件没动')
        report('新增', added)
        report('改了', changed)
        report('删了', removed)
        shutil.rmtree(SITE)
    if args.不检查:
        return
    baseline = word_policy.scan_baseline(OUT, policy=policy)
    print('公开底线检查：' + json.dumps(baseline, ensure_ascii=False))
    if baseline:
        sys.exit(1)
    receipt = OUT / '.build-receipt.json'
    preserved = set(json.loads(receipt.read_text(encoding='utf-8'))['preserved_cockpit_files']) if receipt.is_file() else set()
    files = {p.relative_to(OUT).as_posix() for p in OUT.rglob('*') if p.is_file()}
    formal = load_formal_public_policy()
    extra = {'words': sorted(set(policy['words']) - set(formal['words']))}
    approved = []
    new_hits = check_public_words(OUT, policy, files - preserved, approved=approved)
    formal_hits = check_public_words(OUT, formal, preserved, formal_public_word_pattern, approved=approved)
    extra_hits = check_public_words(OUT, extra, preserved, approved=approved)
    print(f'AI 判原样放 {len(approved)} 处：' + json.dumps(approved, ensure_ascii=False))
    for label, hits, count, note in [('新站公开词', new_hits, len(policy['words']), ''),
                                    ('原实况正式公开词', formal_hits, len(formal['words']), ''),
                                    ('原实况额外词', extra_hits, len(extra['words']), '，仅记录')]:
        for page, word, sentence in hits:
            print(f'{label}命中（只是提示，不拦）：{page} → {word} → {sentence}')
        print(f'{label}检查命中 {len(hits)} 处（{count} 词，只是提示，不拦{note}）')
    bad, page_warnings = check_links()
    report_page_links(page_warnings)
    old_bad = [(page, ref) for page, ref in bad if page.split('#', 1)[0] in preserved]
    bad = [(page, ref) for page, ref in bad if page.split('#', 1)[0] not in preserved]
    print(f'保留旧实况站内链接或按钮异常 {len(old_bad)} 处（仅记录）')
    for page, ref in old_bad:
        print(f'  保留旧件 {page} → {ref}')
    if bad:
        print(f'新站站内链接或按钮异常 {len(bad)} 处：')
        for page, ref in bad:
            print(f'  {page} → {ref}')
    else:
        print('站内资源和按钮检查通过')
    if bad:
        sys.exit(1)


if __name__ == '__main__':
    main()

from pathlib import Path
from urllib.parse import unquote, urlsplit
import hashlib, json, math, re, sys
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src/runtime/bird/tools/site'))
import prepare_living_batch as living
HERO = ROOT / 'sources/assets/wly0829-cn/wly0829-cn-12-overview-illustration-v1.png'
RUNTIME_TAG = re.compile(r'<link\b(?=[^>]*\bdata-living-runtime\b)[^>]*>|<script\b(?=[^>]*\bdata-living-runtime\b)[^>]*>.*?</script\s*>', re.I | re.S)
PROBE_POINTS = tuple((x, y) for y in (.08, .5, .92) for x in (.08, .5, .92))
HERO_PERCH = (.78, .48)

def attach(text, data, candidate, geometries):
    screen = data['screens'][0]
    indices = living.first_parts(data)
    if screen['id'] != 'wly0829-cn-01' or not indices or any(i is None for i in indices.values()): raise ValueError('新总看板缺横竖首屏分片')
    hero_sha = hashlib.sha256(HERO.read_bytes()).hexdigest()
    config = {'schema': 'living-art/1', 'page': data['page'], 'art': data['page'], 'speed_reference': 2.5, 'paper': [255, 255, 255]}
    binding = {}
    for orientation, index in indices.items():
        part = screen['parts'][index]
        geometry = geometries[(screen['id'], orientation)]
        frame = next((item for item in geometry['parts'] if item.get('image') == part['image']), None)
        if frame is None or frame.get('size') != part['size']: raise ValueError('当前分片缺少对应 geometry 记录：' + orientation)
        url = urlsplit(part['src'])
        image_path = Path(candidate) / unquote(url.path.lstrip('/'))
        if url.scheme or url.netloc or not image_path.is_file(): raise ValueError('首屏分片必须来自当前候选：' + orientation)
        if hashlib.sha256(image_path.read_bytes()).hexdigest() != frame.get('sha256'): raise ValueError('候选分片 SHA 与当前 geometry 不符：' + orientation)
        art = next((item for item in geometry['illustrations'] if Path(item.get('source_filename') or item.get('reference_src') or '').name == HERO.name and (item.get('reference_sha256') or item.get('reference_sha')) == hero_sha), None)
        if art is None: raise ValueError('首屏 hero 插画源已变或定位缺失：' + orientation)
        rect = art['rect']
        width, height = part['size']
        if len(rect) != 4 or rect[2] <= 0 or rect[3] <= 0 or rect[0] < 0 or rect[1] < 0 or rect[0] + rect[2] > width or rect[1] + rect[3] > height: raise ValueError('首屏插画实测框越界：' + orientation)
        box = [round(rect[j] / part['size'][j % 2], 6) for j in range(4)]
        # toBox applies (point - box origin) / box size; keep this perch in whole-part ratios.
        perch = {'x': round(box[0] + HERO_PERCH[0] * box[2], 6), 'y': round(box[1] + HERO_PERCH[1] * box[3], 6), 'facing': 'left', 'span': 0, 'name': '总看板首屏插画窗台'}
        with living.Image.open(image_path) as image:
            small = image.convert('RGB').resize((200, max(1, math.floor(image.height * 200 / image.width + .5))), living.Image.Resampling.BILINEAR)
            probe = [[x, y, *small.getpixel((max(0, min(small.width - 1, round(x * small.width - .5))), max(0, min(small.height - 1, round(y * small.height - .5)))))] for x, y in PROBE_POINTS]
        config[orientation] = {
            'image': {'size': part['size']}, 'box': box, 'masks': [], 'effects': [],
            'bird': {'perches': [perch], 'size': .08, 'from': 'right', 'minSize': 18},
            'probe': probe, 'source_sha256': hero_sha,
        }
        binding[orientation] = {'src': part['src'], 'size': part['size'], 'source_sha256': hero_sha, 'rect': box}
    payload = json.dumps(config, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    config_url = f'/_living/{data["page"]}/bird-source.{hashlib.sha256(payload).hexdigest()[:12]}/config.json'
    target = Path(candidate) / config_url.lstrip('/')
    tags = list(RUNTIME_TAG.finditer(text))
    attributes = [living.attributes(match[0]) for match in tags]
    styles = [attrs.get('href') for match, attrs in zip(tags, attributes) if match[0].lower().startswith('<link')]
    scripts = [attrs.get('src') for match, attrs in zip(tags, attributes) if match[0].lower().startswith('<script')]
    if len(tags) != 3 or len(styles) != 1 or len(scripts) != 2 or not all(styles + scripts): raise ValueError('原页面活画运行时样式/引擎/适配器 URL 不唯一')
    runtime = {'style': styles[0], 'engine': scripts[0], 'adapter': scripts[1]}
    patched = living.patch_html(RUNTIME_TAG.sub('', text), data, indices, config_url, runtime, binding, set())
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(payload)
    return patched

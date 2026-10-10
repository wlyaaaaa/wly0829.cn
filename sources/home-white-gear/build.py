"""Encode the approved native inputs and rebind the retained homepage in place."""
import hashlib
import io
import json
import re
from pathlib import Path
from PIL import Image, features

ROOT = Path(__file__).resolve().parent
AVIF = dict(quality=60, speed=6, subsampling='4:4:4', max_threads=2)
PLATE = dict(quality=93, method=6, exact=True)
FALLBACK = dict(lossless=False, quality=85, method=6, alpha_quality=100, exact=True)


def digest(body):
    return hashlib.sha256(body).hexdigest()


def encode(image, format, parameters):
    buffer = io.BytesIO()
    image.save(buffer, format, **parameters)
    return buffer.getvalue()


def build(public, home):
    public, home = Path(public).resolve(), Path(home).resolve()
    html = home.read_text(encoding='utf-8')
    engine_ref = re.search(r'/(_shared/home-living/hero-live\.[a-f0-9]+\.js)', html)
    if not engine_ref:
        raise ValueError('Retained homepage lacks its native HeroLive engine')
    engine_path = public / engine_ref[1]
    engine = engine_path.read_text(encoding='utf-8')
    config_ref = re.search(r'new URL\("(hero-live\.config\.[a-f0-9]+\.json)"', engine)
    if not config_ref:
        raise ValueError('Native engine config reference is missing')
    config_path = engine_path.parent / config_ref[1]
    config = config_path.read_text(encoding='utf-8')
    inventory = json.loads((ROOT.parent / 'signature/assets-manifest.json').read_text('utf-8'))['items']
    if len(inventory) != 9:
        raise ValueError('Expected the five static images and four active plates')
    masters, inputs = {}, []
    for name in ('master-h', 'master-v', 'plate-h', 'plate-h-nobird', 'plate-v', 'plate-v-nobird',
                 'native-h', 'native-v-fallback'):
        path = ROOT / (name + '.png')
        image = Image.open(path).convert('RGB')
        expected = {'native-h': (1672, 941), 'native-v-fallback': (941, 1637)}.get(
            name, (2880, 1621) if '-h' in name else (1280, 2227))
        if image.size != expected:
            raise ValueError(f'Wrong master dimensions: {path.name}: {image.size}')
        masters[name] = image
        inputs.append(dict(path='sources/home-white-gear/' + path.name,
                           sha256=digest(path.read_bytes()), dimensions=list(image.size)))
    replacements, hashes, images = {}, {}, []
    for item in inventory:
        directory = 'assets' if item['kind'] == 'static' else '_shared/home-living/assets'
        old = public / directory / item['new_name']
        if digest(old.read_bytes()) != item['sha256']:
            raise ValueError('Copied asset differs from the approved source: ' + old.name)
        if old.name not in (html if item['kind'] == 'static' else config):
            raise ValueError('Approved source image is not actively referenced: ' + old.name)
        orientation = item['orientation']
        master_name = ('master-' if item['kind'] == 'static' else 'plate-') + orientation
        if item['kind'] == 'static' and orientation == 'h' and ('-1920-' in old.name or 'fallback640' in old.name):
            master_name = 'native-h'
        elif item['kind'] == 'static' and orientation == 'v' and 'fallback640' in old.name:
            master_name = 'native-v-fallback'
        if item['kind'] == 'living' and 'nobird' in old.name:
            master_name += '-nobird'
        image = masters[master_name]
        dimensions = tuple(item['dimensions'])
        format = 'AVIF' if old.suffix == '.avif' else 'WEBP'
        parameters = AVIF if format == 'AVIF' else PLATE
        steps = []
        if 'fallback640' in old.name:
            size = (1280, 720) if orientation == 'h' else (828, 1440)
            body = encode(image.resize(size, Image.Resampling.LANCZOS), 'WEBP', FALLBACK)
            image = Image.open(io.BytesIO(body)).convert('RGB')
            steps.append(dict(format='WEBP', dimensions=list(size), parameters=FALLBACK))
            parameters = dict(quality=85, method=2)
        image = image.resize(dimensions, Image.Resampling.LANCZOS) if image.size != dimensions else image
        body = encode(image, format, parameters)
        sha = digest(body)
        name = old.stem.rsplit('-', 1)[0] + '-white-gear-' + sha[:12] + old.suffix
        destination = old.with_name(name)
        destination.write_bytes(body)
        steps.append(dict(format=format, dimensions=list(dimensions), parameters=parameters))
        images.append(dict(before=old.relative_to(public).as_posix(),
                           path=destination.relative_to(public).as_posix(), sha256=sha,
                           bytes=len(body), dimensions=list(dimensions), master=master_name + '.png', encoding=steps))
        replacements[old.name], hashes[item['sha256']] = name, sha
    for old, new in replacements.items():
        html, config = html.replace(old, new), config.replace(old, new)
    for old, new in hashes.items():
        html = html.replace(old, new)
    config_body = config.encode('utf-8')
    config_name = 'hero-live.config.' + digest(config_body)[:10] + '.json'
    (config_path.parent / config_name).write_bytes(config_body)
    if engine.count(config_ref[1]) != 1:
        raise ValueError('Native engine config anchor is ambiguous')
    engine_body = engine.replace(config_ref[1], config_name).encode('utf-8')
    engine_name = 'hero-live.' + digest(engine_body)[:10] + '.js'
    (engine_path.parent / engine_name).write_bytes(engine_body)
    html = html.replace(engine_path.name, engine_name)
    home.write_text(html, encoding='utf-8', newline='')
    bindings = []
    for old, name, body in ((config_path, config_name, config_body), (engine_path, engine_name, engine_body)):
        bindings.append(dict(before=old.relative_to(public).as_posix(),
                             path=(old.parent / name).relative_to(public).as_posix(),
                             sha256=digest(body), bytes=len(body)))
    return dict(inputs=inputs, images=images, bindings=bindings,
                encoder=dict(pillow=Image.__version__, webp=features.version('webp'), avif=features.version('avif')))

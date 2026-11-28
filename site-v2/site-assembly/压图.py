"""Prune unused assembly assets and optimize the remaining images by format."""
import argparse
import html
import re
import struct
import zlib
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
from tempfile import NamedTemporaryFile
from urllib.parse import unquote

from PIL import Image

IMAGE_REF = re.compile(r"""(?<=["'`(])[^"'`\r\n<>(){}]+?\.(?:png|webp|jpe?g|gif|svg|avif|ico|json)\b""", re.I)
IMAGE_EXT = {'.png', '.webp', '.jpg', '.jpeg', '.gif', '.svg', '.avif', '.ico'}


def is_lossless_webp(path):
    with path.open('rb') as source:
        riff = source.read(12)
        if riff[:4] != b'RIFF' or riff[8:] != b'WEBP':
            return False
        # Extended WebP can put ICC or alpha chunks before the actual image.
        while len(chunk := source.read(8)) == 8:
            tag = chunk[:4]
            if tag == b'VP8L':
                return True
            if tag in (b'VP8 ', b'ANIM', b'ANMF'):
                return False
            length = int.from_bytes(chunk[4:], 'little')
            source.seek(length + length % 2, 1)
    return False


def replace_smaller(path, data):
    saved = path.stat().st_size - len(data)
    if saved <= 0:
        return 0
    stream = NamedTemporaryFile(dir=path.parent, delete=False)
    temporary = Path(stream.name)
    try:
        with stream:
            stream.write(data)
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)
    return saved


def compress_webp(path):
    if not is_lossless_webp(path):
        return None
    output = BytesIO()
    with Image.open(path) as image:
        metadata = {key: image.info[key] for key in ('icc_profile', 'exif', 'xmp') if image.info.get(key)}
        image.save(output, 'WEBP', quality=90, method=6, alpha_quality=100, exact=True, **metadata)
    return replace_smaller(path, output.getbuffer())


def compress_png(path):
    # Recompress only the PNG image stream, preserving its exact pixels and other chunks.
    source = path.read_bytes()
    cursor = 8  # PNG signature
    chunks = []
    while cursor < len(source):
        size, tag = struct.unpack_from('>I4s', source, cursor)
        end = cursor + 12 + size
        if tag == b'IDAT':
            if not chunks:
                first = cursor
            last = end
            chunks.append(source[cursor + 8:end - 4])
        elif chunks:
            break
        cursor = end
    if not chunks:
        raise ValueError(f'PNG 缺少图像数据：{path}')
    compressed = zlib.compress(zlib.decompress(b''.join(chunks)), level=9)
    chunk = b'IDAT' + compressed
    data = source[:first] + struct.pack('>I', len(compressed)) + chunk + struct.pack('>I', zlib.crc32(chunk)) + source[last:]
    return replace_smaller(path, data)


def compress_images(paths, *, site=None):
    encoders = {'.webp': compress_webp, '.png': compress_png}
    # JPEG、已有损或动图 WebP、SVG、GIF、AVIF 和 ICO 按现有编码原样发布。
    unique = {path.resolve() for path in paths if path.suffix.lower() in encoders}
    ordered = sorted(unique)
    with ThreadPoolExecutor(max_workers=4) as pool:
        savings = 0
        count = 0
        for path, saved in zip(ordered, pool.map(lambda path: encoders[path.suffix.lower()](path), ordered)):
            if saved is None:
                continue
            savings += saved
            count += saved > 0
            if site is not None:
                status = f'省 {saved} 字节' if saved else '未变小，原样保留'
                print(f'压图：{path.relative_to(site).as_posix()}，{status}', flush=True)
    print(f'压图：压小 {count} 张，省 {savings} 字节', flush=True)
    return count, savings


def optimize(site, _illustrations=()):
    site = site.resolve()
    images = {p.resolve() for p in site.rglob('*') if p.suffix.lower() in IMAGE_EXT}
    jsons = {p.resolve() for p in site.rglob('*.json')}
    texts = {p: p.read_bytes().decode('utf-8') for p in site.rglob('*')
             if (p.suffix in ('.html', '.css', '.js') or p.name == 'project.json') and not p.name.endswith('.b64.js')}

    def target(file, token):
        ref = unquote(html.unescape(token)).replace('\\/', '/')
        if ':' in ref or '${' in ref:
            return None
        base = site if ref.startswith('/') else file.parent
        candidates = [(base / ref.lstrip('/')).resolve()]
        if '/' not in ref:
            candidates.append((file.parent / 'assets/buttons' / ref).resolve())
        return next((p for p in candidates if p in images or p in jsons), None)

    used = {p for f, text in texts.items() for m in IMAGE_REF.finditer(text) if (p := target(f, m[0]))}
    # 被引用的 JSON 里写全的图和 JSON 也算有人用（例如实况项目外观表 looks.json 列的 47 幅画），顺着引用一层层找。
    scanned = {f.resolve() for f in texts}
    pending = [p for p in used if p in jsons and p not in scanned]
    while pending:
        found = pending.pop()
        scanned.add(found)
        for m in IMAGE_REF.finditer(found.read_bytes().decode('utf-8')):
            if (p := target(found, m[0])) and p not in used:
                used.add(p)
                if p in jsons and p not in scanned:
                    pending.append(p)
    json_removed = []
    for p in sorted(jsons - used):
        if p.name == 'project.json' or p == (site / '公用/页名到地址.json').resolve():
            continue  # project.json 是页面配置；页名到地址.json 还供组装的灰按钮检查使用。
        json_removed.append(dict(path=p.relative_to(site).as_posix(), bytes=p.stat().st_size))
        p.unlink()
    removed = []
    for p in sorted(images - used):
        if p.is_relative_to((site / 'images').resolve()):
            continue
        removed.append(dict(path=p.relative_to(site).as_posix(), bytes=p.stat().st_size))
        p.unlink()
        images.remove(p)
    print(f'素材整理：拿掉未引用图 {len(removed)} 张、未引用 JSON {len(json_removed)} 份')
    return compress_images(images, site=site)


if __name__ == '__main__':
    class PathListParser(argparse.ArgumentParser):
        def convert_arg_line_to_args(self, line):
            line = line.lstrip('\ufeff')
            return [line] if line else []

    parser = PathListParser(description='把指定的无损 WebP 正文图原尺寸压小，只有变小才替换。', fromfile_prefix_chars='@')
    parser.add_argument('paths', type=Path, nargs='+', help='WebP 路径，或 @清单.txt（每行一条路径）')
    args = parser.parse_args()
    if any(path.suffix.lower() != '.webp' for path in args.paths):
        parser.error('只接受 .webp 文件路径')
    compress_images(args.paths)

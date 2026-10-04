"""Package existing watercolor icons for hardware and authority status.

No generation or publication. Source files remain unchanged. --output-root is the
release root; all public paths are /assets/live-hardware/*.webp.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

SOURCES = {
    'cpu': 'icons/齿轮.png',
    'gpu': 'round3/clean-assets/png/11-显卡-clean.png',
    'storage': 'round3/clean-assets/png/21-外接硬盘-clean.png',
    'network': 'round3/clean-assets/png/46-地球-clean.png',
    'display': 'icons/显示器.png',
    'personal-data': 'round3/clean-assets/png/04-锁-clean.png',
    'unrestricted': 'icons/盖章通行证.png',
    'windows': 'icons/显示器.png',
}


def prepare(library, output_root):
    destination = output_root / 'assets' / 'live-hardware'
    destination.mkdir(parents=True, exist_ok=True)
    result = []
    for name, relative in SOURCES.items():
        source, target = library / relative, destination / (name + '.webp')
        with Image.open(source) as original:
            asset = original.convert('RGBA')
            asset.thumbnail((176, 176), Image.Resampling.LANCZOS)
            asset.save(target, format='WEBP', quality=88, method=6)
        result.append({'name': name, 'source': str(source), 'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                       'public_path': '/assets/live-hardware/' + target.name, 'bytes': target.stat().st_size,
                       'sha256': hashlib.sha256(target.read_bytes()).hexdigest()})
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--library', required=True, type=Path)
    parser.add_argument('--output-root', required=True, type=Path)
    parser.add_argument('--receipt', type=Path)
    args = parser.parse_args()
    result = prepare(args.library, args.output_root)
    if args.receipt:
        args.receipt.parent.mkdir(parents=True, exist_ok=True)
        args.receipt.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
    print(json.dumps({'icons': len(result), 'total_bytes': sum(icon['bytes'] for icon in result)}))

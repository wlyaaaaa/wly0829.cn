"""Apply owned live-view sources to a prepared static release, preserving other patches.

Run this before the integrator computes the final release manifest. No upload,
publication, source-snapshot refresh or credential access is performed.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
LIVE_START = "(function(){'use strict';\nconst unknown={text:'暂时读不到',state:'unknown'};"


def patch_shared_runtime(text: str) -> str:
    original = text
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    if LIVE_START not in text:
        return original
    start = text.index(LIVE_START)
    end = text.index('\n})();', start) + len('\n})();')
    text = text[:start] + (HERE / 'site-live-runtime.js').read_text('utf8').rstrip() + text[end:]
    # This exact function is owned by live rendering; navigation, viewer and
    # scroll-history changes elsewhere in the shared app stay byte-equivalent.
    marker = 'function displayTypesetStatus('
    if marker in text:
        start = text.index(marker)
        end = text.index('\nfunction layout()', start)
        text = text[:start] + (HERE / 'typeset-live-display.js').read_text('utf8').rstrip() + '\n' + text[end:]
    return text


def patch_b2_runtime(text: str) -> str:
    model = re.search(r"from ['\"]([^'\"]*b2-access-model[^'\"]*\.js)['\"]", text)
    if not model:
        raise ValueError('B2 status model import is missing')
    source = (HERE / 'b2-live-runtime.js').read_text('utf8').replace('./b2-access-model.js', model.group(1))
    spec = importlib.util.spec_from_file_location('cockpit_cache', HERE / 'prepare-cockpit-cache.py')
    cache = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(cache)
    source = cache.patch_cockpit_cache(source)
    relay = '/* Relay only the existing cockpit automation read to todayRiver. */'
    if relay in text:
        # Preserve integration-2's existing relay exactly while replacing the
        # owned renderer. The river continues to receive this same status read.
        start = text.index(relay)
        end = text.index('function render(){', start)
        source = source.replace('function render(){', text[start:end] + 'function render(){\n relayTodayRiver();', 1)
    return source


def update_release(root: Path) -> dict:
    root = root.resolve()
    html = {p: p.read_text('utf8') for p in root.rglob('*.html')}
    assets = set()
    for page, text in html.items():
        for url in re.findall(r'(?:src|href)=["\"]([^"\"]+)["\"]', text):
            if '?' in url or '#' in url or '://' in url:
                continue
            path = root / url.lstrip('/') if url.startswith('/') else page.parent / url
            if re.fullmatch(r'(?:app-(?:loading-)?[0-9a-f]+\.js|b2-(?:typeset|layout|live)-[0-9a-f]+\.(?:js|css))', path.name) and path.is_file():
                assets.add(path.resolve())
    replacements = {}
    for asset in sorted(assets):
        original = asset.read_text('utf8')
        if asset.name.startswith('app-'):
            patched = patch_shared_runtime(original)
            stem, length = asset.stem.rsplit('-', 1)[0] + '-', len(asset.stem.rsplit('-', 1)[1])
        elif asset.name.startswith('b2-layout-'):
            patched = original if 'window.SiteLiveRuntime.readStatus(' in original else original.replace("window.SiteLiveRuntime.retryStatus(()=>apiRequest(base,refresh?'/status?refresh=1':'/status',{signal,timeout:window.SiteLiveRuntime.readTimeoutMs}),signal)", "data.kind==='cockpit'?window.SiteLiveRuntime.readStatus(signal,refresh):window.SiteLiveRuntime.retryStatus(()=>apiRequest(base,refresh?'/status?refresh=1':'/status',{signal,timeout:window.SiteLiveRuntime.readTimeoutMs}),signal)")
            patched = patched.replace('function readStatus(options){if(!formal){', "function readStatus(options){if(!formal&&!(data.kind==='cockpit'&&['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname))){")
            stem, length = 'b2-layout-', 20
        elif asset.suffix == '.css':
            patched = (HERE / 'b2-live.css').read_text('utf8')
            stem, length = 'b2-live-', 12
        else:
            patched = patch_b2_runtime(original)
            stem, length = 'b2-typeset-', 16
        if patched == original:
            continue
        target = asset.with_name(stem + hashlib.sha256(patched.encode('utf8')).hexdigest()[:length] + asset.suffix)
        target.write_text(patched, encoding='utf8', newline='\n')
        replacements[asset] = target
    changed_pages = []
    for page, text in html.items():
        updated = re.sub(r'(connect-src\s+[^;"<>]*)', lambda m: m[0] if 'https://live.wly0829.cn' in m[0].split() else m[0] + ' https://live.wly0829.cn', text)
        for before, after in replacements.items():
            old_absolute = '/' + before.relative_to(root).as_posix()
            new_absolute = '/' + after.relative_to(root).as_posix()
            updated = updated.replace(old_absolute, new_absolute)
            if before.parent == page.parent / 'assets':
                updated = updated.replace('assets/' + before.name, 'assets/' + after.name)
        if updated != text:
            page.write_text(updated, encoding='utf8', newline='\n')
            changed_pages.append(page.relative_to(root).as_posix())
    return {'schema': 'website.live-fix-update.v1', 'changed_pages': changed_pages,
            'assets': [{'before': a.relative_to(root).as_posix(), 'after': b.relative_to(root).as_posix(),
                        'sha256': hashlib.sha256(b.read_bytes()).hexdigest()} for a, b in replacements.items()]}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('release_root', type=Path)
    parser.add_argument('--receipt', type=Path)
    args = parser.parse_args()
    receipt = update_release(args.release_root)
    if args.receipt:
        args.receipt.parent.mkdir(parents=True, exist_ok=True)
        args.receipt.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print(json.dumps({'changed_pages': len(receipt['changed_pages']), 'changed_assets': len(receipt['assets'])}))

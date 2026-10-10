"""Local runtime transport and loopback status reads; authorization writes stay on their API."""
import json
from pathlib import Path
import re

TEXT = {'.html', '.js', '.mjs', '.css', '.json', '.svg'}
HOSTED = {'.js', '.mjs', '.css', '.woff', '.woff2', '.ttf', '.otf'}
URL = re.compile(r'https://wly0829-img-media-shanghai\.oss-cn-shanghai\.aliyuncs\.com/[^"\'<>`\\\s]*?\.(?:mjs|js|css|woff2?|ttf|otf|json|png|webp|avif|jpe?g|svg|mp4)(?=[^A-Za-z0-9]|$)')
OLD_RUNTIME = re.compile(r'https?://[^"\'<>`\s\\]+/releases/[^"\'<>`\s\\]+\.(?:mjs|js|css)(?=[^A-Za-z0-9]|$)')


def patch_preview_reader(text):
    if 'window.SiteB2=' not in text or 'const reader=createStatusReader' not in text or 'const preview=' in text:
        return text
    text = text.replace('const currentHost=', "const preview=['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname);\nconst currentHost=", 1)
    text = text.replace('formal=isAccessOrigin(location.origin,window.top===window)', 'formal=isAccessOrigin(location.origin,window.top===window)||preview', 1)
    return text.replace("return data.kind==='cockpit'?window.SiteLiveRuntime.readStatus", "return (data.kind==='cockpit'||preview)?window.SiteLiveRuntime.readStatus", 1)


def localize(root, snapshot, patch_readers=False):
    changed = []
    for path in Path(root).rglob('*'):
        if not path.is_file() or path.suffix not in TEXT or path.name == 'release-manifest.json': continue
        before = path.read_text('utf8'); text = before
        if patch_readers and path.suffix == '.js': text = patch_preview_reader(text)
        text = URL.sub(lambda m: snapshot['runtime_urls'].get(m[0], m[0]), text)
        if text != before:
            path.write_text(text, encoding='utf8', newline=''); changed.append(path.relative_to(root).as_posix())
    return changed


def verify(root):
    bad = []
    for path in Path(root).rglob('*'):
        if path.is_file() and path.suffix in TEXT and path.name != 'release-manifest.json':
            urls = OLD_RUNTIME.findall(path.read_text('utf8'))
            if urls: bad.append({'file': path.relative_to(root).as_posix(), 'urls': sorted(set(urls))})
    if bad: raise ValueError('Old-release stylesheet/script references remain: ' + json.dumps(bad[:8], ensure_ascii=False))
    return {'status': 'pass', 'old_runtime_references': 0}

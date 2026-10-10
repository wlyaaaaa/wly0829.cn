"""构建后与候选站逐字节对照：python tests/test_retained_access.py <候选站目录>。"""
import hashlib
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]).resolve()
retained = root / 'src/chrome/retained'
manifest = json.loads((retained / 'manifest.json').read_text(encoding='utf-8'))
original = (source / 'computer-access/index.html').read_bytes()
assert (retained / 'computer-access.html').read_bytes() == original
assert manifest['pages']['computer-access']['sha256'] == hashlib.sha256(original).hexdigest()
built = (root / 'dist/computer-access/index.html').read_text(encoding='utf-8')
old = original.decode('utf-8')
data = lambda text: json.loads(re.search(r'<script id="page-data"[^>]*>(.*?)</script>', text, re.S)[1])
assert data(built) == data(old), '原屏幕、表单与动作清单必须完整保留'
assert data(built)['screens'], '不得清空原屏幕清单'
scripts = lambda text: set(re.findall(r'<script[^>]+src="([^"]+)"', text))
assert scripts(old) <= scripts(built), '原运行件不得缺失'
assert '/_living/live-dom.js' not in scripts(built), '不叠加新排版适配层'
assert 'cockpit-offline.css' not in built and 'cockpit-offline.js' not in built
for rel, item in manifest['files'].items():
    candidate = source / rel
    copied = root / 'public' / rel
    assert hashlib.sha256(candidate.read_bytes()).hexdigest() == item['sha256'], rel
    assert candidate.read_bytes() == copied.read_bytes(), rel
for url in scripts(old):
    if url.startswith('/'):
        assert (root / 'dist' / url.lstrip('/').split('?')[0]).is_file(), url
assert 'retainedPage(\'computer-access\')' in (root / 'src/pages/computer-access/index.astro').read_text()
print(json.dumps({'status': 'pass', 'pageBytes': len(original), 'screens': len(data(built)['screens']),
                  'originalScripts': len(scripts(old)), 'verifiedFiles': len(manifest['files'])}))

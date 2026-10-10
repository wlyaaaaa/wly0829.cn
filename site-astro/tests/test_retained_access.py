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
# 保留页不再挂阿里云 10 月 7 日旧发布目录：候选站里的旧目录绝对前缀统一按本站根路径对照
original = (source / 'computer-access/index.html').read_bytes().replace(
    b'https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com/releases/2h-20261007-bird-atlas/', b'/').replace(
    # 翻页路由表放在授权页自己的目录，免得构建收尾把全站共用的旧路由表删掉
    b'/_album/routes-6ea42164336398a179a1.json', b'/computer-access/assets/routes-6ea42164336398a179a1.json')
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

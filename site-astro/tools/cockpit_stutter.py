"""把已有卡顿详情页及其完整依赖交给 Astro 静态目录。"""
import shutil
import sys
import hashlib
from pathlib import Path
from runpy import run_path
from tempfile import TemporaryDirectory


def build(public):
    public = Path(public).resolve()
    scripts = Path(__file__).resolve().parents[2] / 'scripts'
    sys.path.insert(0, str(scripts))
    with TemporaryDirectory(dir=public.parent) as staging:
        result = run_path(str(scripts / 'prepare-stutter-page.py'))['prepare'](public, Path(staging) / 'output')
        shutil.copytree(Path(result.pop('output')) / 'cockpit/stutter', public / 'cockpit/stutter', dirs_exist_ok=True)
    page = public / 'cockpit/stutter/index.html'
    page.write_text(page.read_text(encoding='utf-8').replace('</head>', '<link rel="stylesheet" href="/_interactions/anchor-offset.css"></head>').replace('</body>', '<script src="/_interactions/anchor-offset.js" defer></script></body>'), encoding='utf-8', newline='')
    body = page.read_bytes()
    result['files']['cockpit/stutter/index.html'] = {'sha256': hashlib.sha256(body).hexdigest(), 'bytes': len(body)}
    return result

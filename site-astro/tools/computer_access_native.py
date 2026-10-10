"""原样保留授权页的界面，办理逻辑始终取当前唯一实现。"""
import hashlib
import re
from pathlib import Path
from runpy import run_path


def build(public, page):
    public, page = Path(public), Path(page)
    root = Path(__file__).resolve().parents[2]
    text = page.read_text(encoding='utf-8')
    url = re.search(r'(?:data-)?src="([^"]*b2-(?:typeset|live)-[\w]+\.js)"', text)[1]
    source = public / url.lstrip('/') if url.startswith('/') else public / 'computer-access' / url
    model = (root / 'app/computer-access-model.js').read_bytes()
    model_target = source.with_name('b2-access-model-' + hashlib.sha256(model).hexdigest()[:12] + '.js')
    model_target.write_bytes(model)
    patch = run_path(str(root / 'scripts/update-live-release.py'))['patch_b2_runtime']
    runtime = patch(source.read_text(encoding='utf-8'))
    runtime = re.sub(r"from ['\"][^'\"]*b2-access-model[^'\"]*\.js['\"]", "from './" + model_target.name + "'", runtime, count=1)
    digest = hashlib.sha256(runtime.encode('utf-8')).hexdigest()
    target = source.with_name('b2-typeset-' + digest[:20] + '.js')
    target.write_text(runtime, encoding='utf-8', newline='')
    page.write_text(text.replace(url, '/' + target.relative_to(public).as_posix()), encoding='utf-8', newline='')
    return {'runtime': target.relative_to(public).as_posix(), 'sha256': digest,
            'model': model_target.relative_to(public).as_posix(), 'model_sha256': hashlib.sha256(model).hexdigest()}

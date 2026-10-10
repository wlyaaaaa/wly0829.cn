"""保留页面的原定位器采用全站实测固定栏高度。"""
import hashlib
import re
from pathlib import Path


def build(public, page):
    public, page = Path(public), Path(page)
    text = page.read_text(encoding='utf-8')
    url = re.search(r'(?:data-)?src="(/_typeset/runtime/app-[\w]+\.js)"', text)[1]
    source = public / url.lstrip('/')
    runtime = source.read_text(encoding='utf-8')
    old = 'offset=h+t+8'
    new = 'offset=Math.max(h+t+8,parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fixed-anchor-offset"))||0)'
    if runtime.count(old) != 1 and runtime.count(new) != 1:
        raise ValueError('保留页面的固定栏定位器发生变化')
    runtime = runtime.replace(old, new)
    digest = hashlib.sha256(runtime.encode('utf-8')).hexdigest()
    target = source.with_name('app-' + digest[:20] + '.js')
    target.write_text(runtime, encoding='utf-8', newline='')
    page.write_text(text.replace(url, '/' + target.relative_to(public).as_posix()), encoding='utf-8', newline='')
    return {'runtime': target.relative_to(public).as_posix(), 'sha256': digest}

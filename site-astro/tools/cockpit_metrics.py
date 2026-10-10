"""复用驾驶舱摘要原实现，只修保留页面的 E 盘容量读取。"""
import hashlib
import re
from pathlib import Path


def build(public, cockpit):
    public, cockpit = Path(public), Path(cockpit)
    canonical = (Path(__file__).resolve().parents[2] / 'scripts/b2-live-runtime.js').read_text(encoding='utf-8')
    def block(text):
        scope = text.index('function cpInsightRows(){')
        end = text.index(' const cleanup=', scope)
        marker = next(m for m in (' const eValue=', ' const unwrapped=', ' const e=') if m in text[scope:end])
        return text.index(marker, scope, end), end
    start, end = block(canonical)
    replacement = canonical[start:end]
    text = cockpit.read_text(encoding='utf-8')
    url = re.search(r'data-src="([^"]*/b2-typeset-[\w]+\.js)"', text)[1]
    source = public / url.lstrip('/')
    runtime = source.read_text(encoding='utf-8')
    start, end = block(runtime)
    runtime = runtime[:start] + replacement + runtime[end:]
    digest = hashlib.sha256(runtime.encode('utf-8')).hexdigest()
    target = source.with_name('b2-typeset-' + digest[:20] + '.js')
    target.write_text(runtime, encoding='utf-8', newline='')
    cockpit.write_text(text.replace(url, '/' + target.relative_to(public).as_posix()), encoding='utf-8', newline='')
    return {'runtime': target.relative_to(public).as_posix(), 'sha256': digest}

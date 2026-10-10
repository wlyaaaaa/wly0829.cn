"""调整保留驾驶舱的原挂载：河在状态卡后，电脑和远程在左栏、云端在右栏。"""
import hashlib
import re
from pathlib import Path


STYLE = '''
.cp-river{grid-column:1/-1}
.cp-services{grid-column:span 3;display:grid;grid-template-columns:minmax(0,1fr);gap:20px;align-content:start;min-width:0}
.cp-services>.cp-section{grid-column:auto}
@media(max-width:767px){.cp-river,.cp-services{grid-column:1}.cp-services{gap:14px}}
'''


def build(public, cockpit):
    public, cockpit = Path(public), Path(cockpit)
    text = cockpit.read_text(encoding='utf-8')
    match = re.search(r'data-src="([^"]*/b2-typeset-[\w]+\.js)"', text)
    if not match:
        raise ValueError('驾驶舱原挂载脚本入口发生变化')
    url = match[1]
    source = public / url.lstrip('/')
    runtime = source.read_text(encoding='utf-8')
    replacements = [
        ('cockpitUI.today.body.prepend(todayRiverHost)', 'cockpitUI.river.prepend(todayRiverHost)'),
        ('today.body.prepend(todayRiverHost)', 'river.prepend(todayRiverHost)'),
        ("const events=cpNode('div','cp-events')",
         "const river=cpNode('section','cp-section cp-river');river.id='cp-river';\n const events=cpNode('div','cp-events')"),
        ('grid.append(conclusion.node,authority.node,computer.node,remote.node,conditions,cloud.node,today.node);',
         "const services=cpNode('div','cp-services');services.append(computer.node,remote.node);\n grid.append(conclusion.node,authority.node,river,services,cloud.node,conditions,today.node);"),
        ('manage,computer,remote,cloud,today,events,', 'manage,computer,remote,cloud,today,river,events,'),
        ("[['cp-computer','电脑']", "[['cp-river','今天的河'],['cp-computer','电脑']"),
    ]
    for before, after in replacements:
        if runtime.count(before) != 1:
            raise ValueError('驾驶舱原挂载发生变化，不能套用布局：' + before)
        runtime = runtime.replace(before, after)
    # 河的原尺寸、记录和提示样式一并迁移，不改变动效、取数或授权逻辑。
    match = re.search(r'<link\b[^>]*href="([^"]*/b2-live-[\w]+\.css)"', text)
    if not match:
        raise ValueError('驾驶舱原样式入口发生变化')
    css_url = match[1]
    css_source = public / css_url.lstrip('/')
    css = css_source.read_text(encoding='utf-8')
    if '.cp-today #today-river' not in css:
        raise ValueError('驾驶舱原河流样式入口发生变化')
    css = css.replace('.cp-today #today-river', '.cp-river #today-river') + STYLE
    digest = hashlib.sha256(runtime.encode('utf-8')).hexdigest()
    target = source.with_name('b2-typeset-' + digest[:20] + '.js')
    css_digest = hashlib.sha256(css.encode('utf-8')).hexdigest()
    css_target = css_source.with_name('b2-live-' + css_digest[:20] + '.css')
    target.write_text(runtime, encoding='utf-8', newline='')
    css_target.write_text(css, encoding='utf-8', newline='')
    text = text.replace(url, '/' + target.relative_to(public).as_posix())
    text = text.replace(css_url, '/' + css_target.relative_to(public).as_posix())
    cockpit.write_text(text, encoding='utf-8', newline='')
    return {'runtime': target.relative_to(public).as_posix(), 'sha256': digest,
            'stylesheet': css_target.relative_to(public).as_posix(), 'stylesheet_sha256': css_digest}

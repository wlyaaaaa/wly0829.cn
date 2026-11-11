"""按当前 page.json、layout.json 生成单页排版截图；不构建全站、不发布。"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[2]
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('page', help='页名，例如 pcconfig')
ap.add_argument('--screens', help='屏号，逗号分隔；默认前两屏')
ap.add_argument('--out', type=Path, required=True, help='截图目录')
ap.add_argument('--prefix', default='preview', help='截图文件名前缀')
ap.add_argument('--work', type=Path, default=Path(r'E:\Cache\wly-site-build\bw\t1-render'))
args = ap.parse_args()
started = time.monotonic()
try:
    source = ROOT / 'sources/pages' / args.page / 'page.json'
    data = json.loads(source.read_text('utf-8'))
    selected = args.screens.split(',') if args.screens else [s['id'] for s in data['screens'] if not s.get('hidden')][:2]
    if set(selected) - {s['id'] for s in data['screens']}:
        raise ValueError('屏号不存在，请核对 --screens')
    work = args.work.resolve(); out = args.out.resolve(); out.mkdir(parents=True, exist_ok=True)
    os.environ.update(CONVERT_OUT_MD=str(work / 'md'), BLOCK_MD_DIR=str(work / 'md'), BLOCK_WORK_DIR=str(work))
    subprocess.run([sys.executable, '-B', '-X', 'utf8', str(ROOT / 'site-astro/tools/convert_page.py'), args.page], check=True)
    sys.path.insert(0, str(ROOT / 'site-astro/tools'))
    import render_blocks as rb
    from engine.render import FIT_JS
    from playwright.sync_api import sync_playwright
    original_parse = rb.parse_md
    def selected_parse(path):
        fm, screens = original_parse(path)
        return fm, [(meta, text) for meta, text in screens if meta['screen']['id'] in selected]
    rb.parse_md = selected_parse
    registry, owner, css, warnings = rb.load_registry()
    fm, page, jobs = rb.prepare_page(args.page, registry, [str(ROOT / 'src/typeset/style/base.css')] + css, 'local-preview')
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=rb.CHROME, headless=True, args=['--disable-gpu', '--disable-lcd-text'])
        context = browser.new_context(viewport={'width': 1672, 'height': 900}, device_scale_factor=1)
        context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(('file:', 'data:')) else route.abort())
        for job in jobs:
            if job['o'] != 'h': continue
            tab = context.new_page(); tab.goto(Path(job['html']).as_uri())
            tab.evaluate(rb.HYDRATE_JS.replace('%FIT%', FIT_JS), None)
            tab.evaluate('document.fonts.ready')
            tab.evaluate("document.documentElement.style.zoom = String(1440 / 1672)")
            tab.set_viewport_size({'width': 1440, 'height': 900})
            tab.add_style_tag(content='html,body{overflow-x:hidden!important}')
            target = out / f'{args.prefix}-{job["screen"]}.png'
            tab.screenshot(path=str(target), clip={'x': 0, 'y': 0, 'width': 1440, 'height': tab.evaluate('Math.ceil(document.body.getBoundingClientRect().height)')}, full_page=True); tab.close()
            print('已出图：' + str(target), flush=True)
        browser.close()
    print(f'完成：{len(selected)} 屏，宽 1440，耗时 {time.monotonic() - started:.1f} 秒；session_kind=local_render；Chrome={rb.CHROME}')
except Exception as error:
    print('单页出图失败：' + str(error), file=sys.stderr)
    sys.exit(1)

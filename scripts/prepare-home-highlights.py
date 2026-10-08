"""Render the one homepage result screen from its owning project numbers."""
import importlib.util
import json
from pathlib import Path
import re
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT/'src/typeset'))
from engine.content import bound_json
from engine.render import render_page
from engine.parse import expected_text


def input_paths():
    from engine import assets
    paths = {ROOT/'config/render.lock.json', *(Path(assets.ASSET_ROOT)/name for name in ('_library/REQUESTS-READY.json','_library/asset-map.jsonl','manifest.jsonl','title-content-regions.json'))}
    def read(path):
        paths.add(Path(path).resolve())
        return Path(path).read_text('utf8')
    page = bound_json(ROOT/'sources/creative/static-home/highlights-page.json', read)
    layout = json.loads(read(ROOT/'sources/creative/static-home/highlights-layout.json'))
    paths.update(Path(row['path']) for screen in page['screens'] for row in assets.for_screen(screen['id'], 'title'))
    paths.update(Path(assets.ASSET_ROOT)/icon for row in layout for block in row['blocks'] for icon in block.get('icons', []))
    paths.update(p for p in (ROOT/'src/typeset').rglob('*') if p.suffix in ('.py','.css','.js','.json','.jsonl','.png','.woff2','.ttf'))
    return {p.resolve() for p in paths if p.is_file()}


def practice_entry(text):
    text = re.sub(r'<div\b[^>]*data-home-practice-link[^>]*>[\s\S]*?</div>', '', text)
    text, count = re.subn(r'(?=<div\b[^>]*\bid="story"[^>]*>)', '<div class="screen-control-row" data-home-practice-link><a href="/how/#practice">我的AI实践</a></div>', text, count=1)
    if count != 1:
        raise ValueError('Homepage practice entry needs the actual story anchor')
    return text


def prepare_fragment(text, data, scratch):
    text = practice_entry(text)
    if not any(s['id']=='home-04' for s in data.get('screens', [])):
        return text, {}, None
    from playwright.sync_api import sync_playwright
    scratch = Path(scratch); scratch.mkdir(parents=True, exist_ok=True)
    source = ROOT/'sources/creative/static-home/highlights-page.json'
    layout = ROOT/'sources/creative/static-home/highlights-layout.json'
    content = bound_json(source); authored = content['screens'][0]
    lock = json.loads((ROOT/'config/render.lock.json').read_text('utf8'))
    spec = importlib.util.spec_from_file_location('home_highlights_builder', HERE/'build-typeset-site.py')
    builder = importlib.util.module_from_spec(spec); spec.loader.exec_module(builder)
    builder.ASSET_CACHE = scratch/'asset-cache'; builder.ASSET_CACHE.mkdir(exist_ok=True)
    model = {'id':'home-04','title':authored['title'],'section':'highlights','shape':'screen','layouts':{}}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=lock['chrome']['path'], headless=True, args=lock['args'])
        try:
            report = render_page('home-highlights', do_compare=False, out_root=str(scratch), browser=browser,
                                 spec_file=str(layout), source_file=str(source))
            if report['failed'] or report['incomplete']:
                raise ValueError('Homepage result screen did not pass its actual typeset checks')
            for orient in ('h', 'v'):
                original = scratch/'home-highlights'/f'home-highlights-01-{orient}.png'
                width, height = builder.png_size(original)
                page = browser.new_page(viewport={'width':width,'height':200}, device_scale_factor=2)
                page.goto((scratch/'home-highlights/html'/f'home-highlights-01-{orient}.html').as_uri())
                page.evaluate('async()=>{await document.fonts.ready;await window.__typesetReady;}')
                image = scratch/f'home-highlights-{orient}-2x.png'; page.screenshot(path=str(image), full_page=True); page.close()
                url = builder.asset(image, scratch/'assets', 'home-highlights')
                hot = json.loads(original.with_suffix('.links.json').read_text('utf8'))
                links = [{'id':f'home-04-link-{i}-0','text':h['text'],'href':h['href'],
                          'rect':[h['x']/width,h['y']/height,h['w']/width,h['h']/height], 'text_only':True} for i,h in enumerate(hot)]
                model['layouts'][orient] = {'orientation':orient,'size':[width,height],'source_size':[width*2,height*2],
                    'crop':[0,0,width*2,height*2], 'viewer':{'src':url,'sha256':builder.hybrid.digest(scratch/'assets'/url.lstrip('/')),
                    'width':width*2,'height':height*2},'links':links,'anchors':[],'live':[],'screenshots':[],
                    'cards':[],'numbers':[],'dots':[],'arrows':[]}
        finally:
            browser.close()
    picture = ''.join(f'<source media="(orientation:{"landscape" if o=="h" else "portrait"})" srcset="{model["layouts"][o]["viewer"]["src"]}">' for o in ('h','v'))
    transcript = '\n'.join(expected_text(authored['text']))
    import html
    replacement = f'<section class="screen shape-screen" id="home-04" data-screen="home-04" data-section="highlights"><picture>{picture}<img src="{model["layouts"]["h"]["viewer"]["src"]}" loading="lazy" decoding="async" alt="" aria-describedby="home-04-equivalent-text"></picture><div class="overlays"></div><div class="screen-equivalent-text" id="home-04-equivalent-text" data-screen-transcript="home-04">{html.escape(transcript)}</div></section>'
    text, replaced = re.subn(r'<section\b[^>]*id="home-04"[^>]*>[\s\S]*?</section>', lambda m:replacement, text, count=1)
    if replaced != 1:
        raise ValueError('Homepage result screen must have one actual owning section')
    text = re.sub(r'<style\b[^>]*data-home-compact[^>]*>[\s\S]*?</style>', '', text)
    data['screens'] = [model if s['id']=='home-04' else s for s in data['screens']]
    files = {p.relative_to(scratch/'assets').as_posix():p.read_bytes() for p in (scratch/'assets').rglob('*') if p.is_file()}
    return text, files, {'source':str(source),'typeset':report,'device_scale_factor':2,'transport':'existing pixel-verified lossless encoder','source_numbers':authored['text']}

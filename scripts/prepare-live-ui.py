"""Apply the finished live display to a task-owned prepared site. No publication.

Run after the typeset build and before the final manifest. The screen artwork,
river implementation, other owner overlays and existing addressed assets remain.
"""
from __future__ import annotations
import argparse, hashlib, importlib.util, json, re
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent

def module(name, filename):
    spec = importlib.util.spec_from_file_location(name, HERE / filename)
    result = importlib.util.module_from_spec(spec); spec.loader.exec_module(result)
    return result

def proof(payload):
    return {'sha256': hashlib.sha256(payload).hexdigest(), 'bytes': len(payload)}

def patch_layout(text):
    # Legacy builds split appearance helpers around their page/motion prelude.
    # Replace only owned functions, retaining those variables and other overlays.
    source=(HERE/'typeset-layout.js').read_text('utf8')
    start_marker='/* typeset-live-flow-v1 */'; end_marker='/* end-typeset-live-flow-v1 */'
    start=source.index(start_marker); end=source.index(end_marker,start)+len(end_marker)
    flow=source[start:end]
    install='function installTypeset(section,screen){'; next_function='function fitTypesetShot('
    if install not in text:return text
    if start_marker in text:
        start=text.index(start_marker); end=text.index(end_marker,start)+len(end_marker)
        text=text[:start]+flow+text[end:]
    else:text=text.replace(install,flow+'\n'+install,1)
    start=text.index(install); end=text.index(next_function,start)
    source_start=source.index(install); source_end=source.index(next_function,source_start)
    return text[:start]+source[source_start:source_end]+text[end:]

def prepare(site, library, font=None, sprite=None, label_map=None, pages=None):
    site = Path(site).resolve(); library = Path(library).resolve()
    changes = []; assets = []
    page_scope=None if pages is None else {Path(page).as_posix()for page in pages}
    def addressed(stem, suffix, payload):
        rel = '_typeset/runtime/' + stem + '-' + proof(payload)['sha256'][:20] + suffix
        target = site / rel; target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() and target.read_bytes() != payload: raise ValueError('Addressed asset differs: ' + rel)
        target.write_bytes(payload); assets.append({'path': rel, **proof(payload)})
        return '/' + rel
    palette = ':root{--title:#0a7232;--text:#2e4675;--accent:#0a7a33;--link:rgb(9,145,54);--line:#bfe8cc;--cardbg:#fbfefc;--soft:#edfbf3;--badge:#13803d}\n'
    font_ref = None
    if font:
        from fontTools.ttLib import TTFont
        import io
        source = TTFont(font, recalcTimestamp=False); source.flavor = 'woff2'; out = io.BytesIO(); source.save(out)
        font_ref = addressed('live-sans', '.woff2', out.getvalue())
    else:
        existing_fonts=sorted((site/'_typeset/runtime').glob('live-sans-*.woff2'))
        if existing_fonts:font_ref='/'+existing_fonts[0].relative_to(site).as_posix()
    if font_ref:
        palette += '@font-face{font-family:"Sans";src:url("' + font_ref + '") format("woff2");font-weight:100 900;font-display:swap}\n'
    css = palette + (HERE/'live-hardware-ui.css').read_text('utf8') + '\n' + (HERE/'live-status-ui.css').read_text('utf8')
    ui_css = addressed('live-ui', '.css', css.encode('utf8'))
    ui_js = addressed('live-ui', '.js', ((HERE/'live-hardware-ui.js').read_text('utf8') + '\n' + (HERE/'live-status-ui.js').read_text('utf8')).encode('utf8'))
    model_ref = addressed('b2-access-model', '.js', (HERE.parent/'app/computer-access-model.js').read_bytes())
    hardware_icons = module('hardware_assets', 'prepare-live-hardware-assets.py').prepare(library, site)
    icons = {}
    for name, source in {'status':'笔记本电脑.png','backup':'硬盘循环.png','cloud':'云对勾.png','acceptance':'打勾清单.png','watch':'日历时钟.png','health':'工具箱.png'}.items():
        path = library/'icons'/source
        # Reuse an existing library asset; only its public delivery format changes.
        import io
        out = io.BytesIO()
        with Image.open(path) as im:
            im = im.convert('RGBA'); im.thumbnail((128,128), Image.Resampling.LANCZOS); im.save(out, 'WEBP', quality=90, method=6)
        icons[name] = addressed('live-icon-'+name, '.webp', out.getvalue())
    icons.update({'run':icons['status'],'config':icons['backup'],'wechat':icons['backup'],'image':icons['backup'],'sync':icons['status'],'panel':icons['status'],'capture':icons['status'],'grafana':icons['status'],'lessons':icons['watch'],'week':icons['watch'],'practice':icons['acceptance']})
    icons.update({'cockpit-remote':icons['status'],'cockpit-backups':icons['backup'],'cockpit-tasks':icons['watch'],'cockpit-attention':icons['acceptance'],'cockpit-projects':icons['status'],'cockpit-today':icons['watch']})
    update = module('live_update', 'update-live-release.py')
    layout_css = addressed('typeset-layout', '.css', (HERE/'typeset-layout.css').read_bytes())
    b2_css = addressed('b2-live', '.css', (HERE/'b2-live.css').read_bytes())
    changed_refs = {}
    def resolve(page, url):
        if url.startswith(('http:','https:','data:')): return None
        p = site/url.lstrip('/') if url.startswith('/') else page.parent/url
        return p.resolve() if p.is_file() else None
    for page in sorted(site.rglob('*.html')):
        if page_scope is not None and page.relative_to(site).as_posix()not in page_scope:continue
        before = page.read_bytes(); text = before.decode('utf8')
        data_match = re.search(r'<script\b[^>]*\bid="page-data"[^>]*>(.*?)</script>', text, re.S)
        if not data_match: continue
        data = json.loads(data_match[1]); has_live = any(part.get('native_live') or part.get('live') for s in data.get('screens',[]) for part in [*s.get('parts',[]), *s.get('layouts',{}).values()])
        if not has_live: continue
        for old in set(re.findall(r'<script\b[^>]*\bsrc="([^"]+)"', text)):
            path = resolve(page, old)
            if not path or not re.fullmatch(r'(?:app-[0-9a-f]+|b2-(?:live|typeset)-[0-9a-f]+)\.js',path.name): continue
            if path not in changed_refs:
                original = path.read_text('utf8')
                if path.name.startswith('app-'):
                    original = original.replace('\r\n','\n')
                    original=patch_layout(original)
                    patched = update.patch_shared_runtime(original)
                    changed_refs[path] = addressed('app', '.js', patched.encode('utf8'))
                else:
                    patched = update.patch_b2_runtime(original)
                    patched = re.sub(r"from ['\"][^'\"]*b2-access-model[^'\"]*\.js['\"]", "from '"+model_ref+"'", patched, count=1)
                    changed_refs[path] = addressed('b2-typeset', '.js', patched.encode('utf8'))
            text = text.replace(old, changed_refs[path])
        for old in re.findall(r'<link\b[^>]*\bhref="([^"]+)"',text):
            if re.search(r'/typeset-layout-[0-9a-f]+\.css$',old):text=text.replace(old,layout_css)
            if re.search(r'b2-live-[0-9a-f]+\.css$',old):text=text.replace(old,b2_css)
        data.setdefault('shared',{})['live_status_icons']=icons
        # Dynamic renderers use string maps and constructed URLs. Declare their
        # exact dependencies in the existing native src graph before assembly.
        data['shared']['live_status_asset_dependencies']=[{'src':url}for url in sorted(
            set(icons.values())|{item['public_path']for item in hardware_icons})]
        text=re.sub(r'(<script\b[^>]*\bid="page-data"[^>]*>).*?(</script>)',lambda m:m[1]+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+m[2],text,count=1,flags=re.S)
        text=re.sub(r'<link[^>]*data-live-ui[^>]*>|<script[^>]*data-live-ui[^>]*>.*?</script>','',text,flags=re.S)
        # Older releases merged layout CSS into motion-* rather than linking a
        # typeset-layout asset. Always load this current sheet explicitly.
        text=text.replace('<head>','<head><script data-live-ui defer src="'+ui_js+'"></script>',1)
        tags='<link data-live-ui rel="stylesheet" href="'+layout_css+'"><link data-live-ui rel="stylesheet" href="'+ui_css+'">'
        text=text.replace('</head>',tags+'</head>',1)
        after=text.encode('utf8')
        if after!=before: page.write_bytes(after); changes.append({'path':page.relative_to(site).as_posix(),'before':proof(before),'after':proof(after)})
    toc = None
    if sprite and label_map:
        target=site/'_shared'/Path(sprite).name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(Path(sprite).read_bytes())
        toc=module('toc', 'prepare-toc-consistency.py').prepare_toc(site,json.loads(Path(label_map).read_text('utf8')),pages=page_scope)
    result={'schema':'wly.live-ui-preparation.v1','site':str(site),'changed_pages':changes,'assets':assets,'hardware_icons':hardware_icons,'toc':toc,'external_write':False,'manifest_action':'Rehash the complete candidate after all owner overlays; this preparation is not a publication.'}
    if page_scope is not None:result['selected_page_paths']=sorted(page_scope)
    return result


def prepare_recipe(site, recipe, pages=None):
    """Replay the delivered UI before assembly, with every consumed input bound."""
    recipe = Path(recipe).resolve()
    config = json.loads(recipe.read_text('utf8'))
    if config.get('schema') != 'wly.live-ui-recipe.v1':
        raise ValueError('Unsupported live UI preparation recipe')
    paths = {key: Path(config[key]).resolve() for key in ('library', 'font', 'sprite', 'label_map')}
    hardware = module('bound_hardware_assets', 'prepare-live-hardware-assets.py')
    consumed = [recipe, paths['font'], paths['sprite'], paths['label_map']]
    consumed += [HERE / name for name in (
        'prepare-live-ui.py', 'prepare-live-hardware-assets.py', 'update-live-release.py',
        'site-live-runtime.js', 'typeset-live-display.js', 'b2-live-runtime.js', 'prepare-cockpit-cache.py',
        'prepare-toc-consistency.py', 'toc-consistency.css', 'toc-consistency.js',
        'typeset-layout.js', 'typeset-layout.css', 'b2-live.css',
        'live-hardware-ui.css', 'live-hardware-ui.js', 'live-status-ui.css', 'live-status-ui.js')]
    consumed += [HERE.parent / 'app/computer-access-model.js']
    consumed += [paths['library'] / relative for relative in set(hardware.SOURCES.values())]
    consumed += [paths['library'] / 'icons' / name for name in
        ('笔记本电脑.png', '硬盘循环.png', '云对勾.png', '打勾清单.png', '日历时钟.png', '工具箱.png')]
    inputs = {str(path): proof(path.read_bytes()) for path in consumed}
    result = prepare(site, **paths, pages=pages)
    result.pop('site')
    result['status'] = 'prepared' if result['toc']['status'] == 'prepared' else 'needs_assets'
    for path, expected in inputs.items():
        if proof(Path(path).read_bytes()) != expected:
            raise ValueError('Live UI input changed during preparation: ' + path)
    result['recipe_path'] = str(recipe)
    result['recipe_sha256'] = inputs[str(recipe)]['sha256']
    return result, inputs

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--site',type=Path,required=True);p.add_argument('--library',type=Path,required=True);p.add_argument('--font',type=Path);p.add_argument('--sprite',type=Path);p.add_argument('--label-map',type=Path);p.add_argument('--receipt',type=Path,required=True);a=p.parse_args()
    result=prepare(a.site,a.library,a.font,a.sprite,a.label_map);a.receipt.parent.mkdir(parents=True,exist_ok=True);a.receipt.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps({'changed_pages':len(result['changed_pages']),'assets':len(result['assets']),'toc_pages':result['toc']['page_count'] if result['toc'] else 0}))
if __name__=='__main__':main()

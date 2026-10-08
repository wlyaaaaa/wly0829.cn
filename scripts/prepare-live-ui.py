"""Apply the finished live display to a task-owned prepared site. No publication.

Run after the typeset build and before the final manifest. The screen artwork,
river implementation, other owner overlays and existing addressed assets remain.
"""
from __future__ import annotations
import argparse, hashlib, html, importlib.util, json, re, shutil
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent

def module(name, filename):
    spec = importlib.util.spec_from_file_location(name, HERE / filename)
    result = importlib.util.module_from_spec(spec); spec.loader.exec_module(result)
    return result

def proof(payload):
    return {'sha256': hashlib.sha256(payload).hexdigest(), 'bytes': len(payload)}


def cockpit_title_inputs(library):
    """Reuse the six accepted title bitmaps at their original pixel resolution."""
    library = Path(library).resolve(); manifest = library / 'asset-map.jsonl'; reuse = library.parent / 'cockpit/compact-titles.json'
    expected = {'cockpit-01', 'cockpit-02', 'cockpit-03', 'cockpit-06', 'cockpit-07', 'cockpit-09'}
    chosen = {}
    rows = [json.loads(line) for line in manifest.read_text('utf8').splitlines()]
    rows += json.loads(reuse.read_text('utf8'))['titles']
    for row in rows:
        if row.get('screen_id') not in expected or row.get('role') != 'title' or row.get('slot_ordinal') != 1:
            continue
        path = library.parent / row['asset']
        if row.get('status') != 'ready' or row.get('text_verified') is not True or proof(path.read_bytes())['sha256'] != row.get('sha256'):
            raise ValueError('Accepted cockpit title differs: ' + row['screen_id'])
        with Image.open(path) as image: size = list(image.size)
        chosen[row['screen_id']] = {'path': path, 'size': size}
    if set(chosen) != expected: raise ValueError('The cockpit requires all six accepted bitmap titles')
    return chosen, [manifest, reuse, *[row['path'] for row in chosen.values()]]


def toc_unify_package(package):
    """Read the approved 85-page/75-label package without implicit fallbacks."""
    package = Path(package).resolve()
    consumed = [package / name for name in (
        'prepare-toc-unify.py', 'label-map-webp-visible-ink.json',
        'pages-to-unify.json', 'manifest.json',
        'runtime/toc-consistency.css', 'runtime/toc-consistency.js')]
    label_map = json.loads(consumed[1].read_text('utf8'))
    pages = json.loads(consumed[2].read_text('utf8'))
    manifest = json.loads(consumed[3].read_text('utf8'))
    if (len(pages) != 85 or len(set(pages)) != 85 or 'index.html' not in pages
            or '404.html' not in pages or len(label_map) != 75
            or manifest.get('expected_labels') != 75 or manifest.get('available_labels') != 75
            or manifest.get('missing') or len(manifest.get('items', [])) != 75):
        raise ValueError('TOC unification requires the approved 85 pages and 75 labels')
    if any(Path(page).as_posix() != page or page.startswith('/') or '..' in Path(page).parts
           or not page.endswith('.html') for page in pages):
        raise ValueError('TOC page scope contains an invalid relative HTML path')
    items = {item['text']: item for item in manifest['items']}
    if set(items) != set(label_map):
        raise ValueError('TOC manifest and label map differ')
    images = []
    for name, label in label_map.items():
        item = items[name]
        relative = item['webp']
        if (Path(relative).parent.as_posix() != 'images' or Path(relative).suffix != '.webp'
                or label['src'] != '/_shared/nav-unify-standard/' + Path(relative).name
                or label['size'] != item['size']):
            raise ValueError('TOC bitmap path or size differs: ' + name)
        image = package / relative
        if proof(image.read_bytes())['sha256'] != item['webp_sha256']:
            raise ValueError('TOC bitmap changed: ' + str(image))
        w, h = label['size']
        ink = [label['ink_left'] * w, label['ink_top'] * h,
               label['ink_right'] * w, label['ink_bottom'] * h]
        if any(abs(value - expected) > 1e-6 for value, expected in zip(ink, item['ink_box_alpha16'])):
            raise ValueError('TOC visible ink differs: ' + name)
        images.append(image)
    if len({image.name for image in images}) != 75:
        raise ValueError('TOC bitmap names are not unique')
    return package, label_map, pages, images, consumed + images


def prepare_toc_recipe(site, recipe):
    """Refresh the declared directories using the approved complete package."""
    recipe, site = Path(recipe).resolve(), Path(site).resolve()
    config = json.loads(recipe.read_text('utf8'))
    if config.get('schema') != 'wly.live-ui-recipe.v1' or not config.get('toc_unify_package'):
        raise ValueError('A live UI recipe with the approved TOC package is required')
    package, label_map, pages, images, consumed = toc_unify_package(config['toc_unify_package'])
    selection = config.get('toc_pages')
    if selection is not None:
        if not selection or len(selection) != len(set(selection)) or not set(selection) <= set(pages):
            raise ValueError('TOC selection must be a nonempty unique subset of the registered scope')
        pages = selection
    inputs = {str(path): proof(path.read_bytes()) for path in [recipe, HERE / 'prepare-live-ui.py', *consumed]}
    # Fail before copying or changing anything if the complete declared scope is absent.
    for relative in pages:
        page = site / relative
        if not page.is_file():
            raise ValueError('Complete TOC page is missing: ' + relative)
        text = page.read_text('utf8')
        nav = re.search(r'<nav\b[^>]*class="toc"[^>]*>.*?</nav>', text, re.S)
        if not nav or not re.search(r'<a\b[^>]*data-section=', nav[0]):
            raise ValueError('Complete TOC page lacks its original directory: ' + relative)
        if relative=='rules/charter/index.html' and 'class="toc-inner toc-text"' in nav[0]: continue
        names = {html.unescape(name) for name in re.findall(r'data-label-[hv]="([^"]+)"', nav[0])}
        if names - label_map.keys():
            raise ValueError('TOC labels are missing on ' + relative + ': ' + ', '.join(sorted(names - label_map.keys())))
    target = site / '_shared/nav-unify-standard'
    target.mkdir(parents=True, exist_ok=True)
    builder = module('live_ui_asset_builder', 'build-assembled-site.py')
    for image in images:
        builder.copy_release_asset(image, target / image.name)
    spec = importlib.util.spec_from_file_location('approved_toc_unify', package / 'prepare-toc-unify.py')
    approved = importlib.util.module_from_spec(spec); spec.loader.exec_module(approved)
    result = approved.prepare_toc(site, label_map, pages)
    if (result.get('status') != 'prepared' or result.get('page_count') != len(pages)
            or result.get('missing_labels') or {item['page'] for item in result.get('pages', [])} != set(pages)):
        raise ValueError('Approved TOC helper did not prepare the complete registered page scope')
    stylesheet = HERE / 'toc-consistency.css'
    inputs[str(stylesheet)] = proof(stylesheet.read_bytes())
    css_url = '/_typeset/runtime/toc-consistency-' + inputs[str(stylesheet)]['sha256'][:20] + '.css'
    (site / css_url.lstrip('/')).write_bytes(stylesheet.read_bytes())
    for row in result['pages']:
        target_page = site / row['page']
        body = target_page.read_bytes().replace(result['assets']['.css'].encode(), css_url.encode())
        target_page.write_bytes(body)
        row['after_sha256'] = proof(body)['sha256']
        row['changed'] = row['after_sha256'] != row['before_sha256']
    result['assets']['.css'] = css_url
    result['changed_page_count'] = sum(row['changed'] for row in result['pages'])
    for path, expected in inputs.items():
        if proof(Path(path).read_bytes()) != expected:
            raise ValueError('TOC input changed during preparation: ' + path)
    result['recipe_path'] = str(recipe)
    result['recipe_sha256'] = inputs[str(recipe)]['sha256']
    result['package_path'] = str(package)
    result['bitmap_count'] = len(images)
    return result, inputs

def patch_layout(text):
    # Legacy builds split appearance helpers around their page/motion prelude.
    # Replace only owned functions, retaining those variables and other overlays.
    source=(HERE/'typeset-layout.js').read_text('utf8')
    start_marker='/* typeset-live-flow-v1 */'; end_marker='/* end-typeset-live-flow-v1 */'
    start=source.index(start_marker); end=source.index(end_marker,start)+len(end_marker)
    flow=source[start:end]
    install='function installTypeset(section,screen){'; next_function='function displayTypesetStatus('
    if install not in text:return text
    # SiteAudit owns rendered slots; inactive copies may intentionally have no span.
    audit="slots:[...document.querySelectorAll('.slot')].map"
    active="slots:[...document.querySelectorAll('.slot')].filter(c=>{const r=c.getBoundingClientRect();return c.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&r.width>0&&r.height>0;}).map"
    if text.count(audit)==1:text=text.replace(audit,active,1)
    elif text.count(active)!=1:raise ValueError('Unsupported legacy SiteAudit slot enumeration')
    reading='const typesetReadingState='
    if text.count(reading)!=1:raise ValueError('Unsupported legacy reading state')
    begin=text.index(reading); finish=text.index(start_marker,begin)
    source_begin=source.index(reading)
    text=text[:begin]+source[source_begin:source.index(start_marker,source_begin)]+text[finish:]
    hash_guard='if(readingRevision!==typesetReadingState.revision||location.hash!==hash||!target.isConnected)return;'
    hash_cancel=hash_guard+'window.TypesetLiveFlow?.cancelReader?.();'
    if text.count(hash_guard)!=1:raise ValueError('Unsupported legacy hash placement')
    if hash_cancel not in text:text=text.replace(hash_guard,hash_cancel,1)
    hash_finish=';place();requestAnimationFrame(place);'
    hash_settle=hash_finish+'readingLayoutReady().then(place);'
    if hash_finish not in text:raise ValueError('Unsupported legacy hash settling')
    if hash_settle not in text:text=text.replace(hash_finish,hash_settle,1)
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
        if not target.exists(): target.write_bytes(payload)
        assets.append({'path': rel, **proof(payload)})
        return '/' + rel
    palette = ':root{--title:#0a7232;--text:#2e4675;--accent:#0a7a33;--link:rgb(9,145,54);--line:#bfe8cc;--cardbg:#fbfefc;--soft:#edfbf3;--badge:#13803d}\n'
    if not font:
        existing_fonts=sorted((site/'_typeset/runtime').glob('live-sans-[0-9a-f]*.woff2'))
        font = existing_fonts[0] if existing_fonts else None
        if not font:
            from fontTools.ttLib import TTFont
            for part in sorted((site/'_typeset/runtime').glob('live-sans-part-*.woff2')):
                with TTFont(part) as face:ranges=','.join('U+'+format(cp,'X') for cp in sorted(face.getBestCmap()))
                palette += '@font-face{font-family:"Sans";src:url("/'+part.relative_to(site).as_posix()+'") format("woff2");font-weight:100 900;font-display:swap;unicode-range:'+ranges+'}\n'
    if font:
        from fontTools.ttLib import TTFont
        from fontTools import subset
        import io
        source_bytes = Path(font).read_bytes()
        source = TTFont(io.BytesIO(source_bytes), recalcTimestamp=False)
        groups = {}
        for codepoint in sorted(source.getBestCmap()):
            groups.setdefault(codepoint // 128, []).append(codepoint)
        supported = set(source.getBestCmap())
        runtime_points = {ord(c) for name in ('b2-live-runtime.js','site-live-runtime.js','live-hardware-ui.js','live-status-ui.js') for c in (HERE/name).read_text('utf8')}
        source.close()
        options = subset.Options(); options.layout_features = ['*']; options.notdef_outline = True
        for block, codepoints in groups.items():
            face = TTFont(io.BytesIO(source_bytes), recalcTimestamp=False)
            cutter = subset.Subsetter(options=options); cutter.populate(unicodes=codepoints); cutter.subset(face)
            face.flavor = 'woff2'; out = io.BytesIO(); face.save(out); face.close()
            ref = addressed('live-sans-part-'+format(block, 'x'), '.woff2', out.getvalue())
            ranges = ','.join('U+'+format(cp, 'X') for cp in codepoints)
            palette += '@font-face{font-family:"Sans";src:url("'+ref+'") format("woff2");font-weight:100 900;font-display:swap;unicode-range:'+ranges+'}\n'
    font_css = addressed('live-fonts', '.css', palette.encode('utf8'))
    css = palette.split('@font-face',1)[0] + (HERE/'live-hardware-ui.css').read_text('utf8') + '\n' + (HERE/'live-status-ui.css').read_text('utf8')
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
    cockpit_titles = {}
    if page_scope is None or 'cockpit/index.html' in page_scope:
        title_rows, _ = cockpit_title_inputs(library)
        cockpit_titles = {screen: {'src': addressed(screen+'-title', '.png', row['path'].read_bytes()), 'size': row['size'], 'title': [0, 0, 1, 1]} for screen, row in title_rows.items()}
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
        if not has_live:
            for old in sorted(set(re.findall(r'<script\b[^>]*\bsrc="([^"]+)"', text))):
                path = resolve(page, old)
                if not path or not re.fullmatch(r'app-[0-9a-f]+\.js', path.name): continue
                if path not in changed_refs:
                    patched = update.patch_shared_runtime(patch_layout(path.read_text('utf8').replace('\r\n','\n')))
                    changed_refs[path] = addressed('app', '.js', patched.encode('utf8'))
                text = text.replace(old, changed_refs[path])
            after = text.encode('utf8')
            if after != before:
                page.write_bytes(after); changes.append({'path':page.relative_to(site).as_posix(),'before':proof(before),'after':proof(after)})
            continue
        if font:
            points = sorted((set(map(ord, text)) | runtime_points) & supported)
            face = TTFont(io.BytesIO(source_bytes), recalcTimestamp=False)
            cutter = subset.Subsetter(options=options); cutter.populate(unicodes=points); cutter.subset(face)
            face.flavor = 'woff2'; out = io.BytesIO(); face.save(out); face.close()
            ref = addressed('live-sans-page', '.woff2', out.getvalue())
            ranges = ','.join('U+'+format(cp, 'X') for cp in points)
            page_face = '@font-face{font-family:"Sans";src:url("'+ref+'") format("woff2");font-weight:100 900;font-display:swap;unicode-range:'+ranges+'}\n'
            ui_css = addressed('live-ui-page', '.css', (css+'\n'+page_face).encode('utf8'))
        for old in sorted(set(re.findall(r'<script\b[^>]*\bsrc="([^"]+)"', text))):
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
        if data.get('kind') == 'cockpit': data['shared']['cockpit_titles'] = cockpit_titles
        # Dynamic renderers use string maps and constructed URLs. Declare their
        # exact dependencies in the existing native src graph before assembly.
        data['shared']['live_status_asset_dependencies']=[{'src':url}for url in sorted(
            set(icons.values())|{item['public_path']for item in hardware_icons}|{row['src'] for row in cockpit_titles.values() if data.get('kind') == 'cockpit'})]
        text=re.sub(r'(<script\b[^>]*\bid="page-data"[^>]*>).*?(</script>)',lambda m:m[1]+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+m[2],text,count=1,flags=re.S)
        text=re.sub(r'<link[^>]*data-live-ui[^>]*>|<script[^>]*data-live-ui[^>]*>.*?</script>','',text,flags=re.S)
        # Older releases merged layout CSS into motion-* rather than linking a
        # typeset-layout asset. Always load this current sheet explicitly.
        text=text.replace('<head>','<head><script data-live-ui defer src="'+ui_js+'"></script>',1)
        tags='<link data-live-ui data-live-fonts rel="stylesheet" media="print" href="'+font_css+'"><link data-live-ui rel="stylesheet" href="'+layout_css+'"><link data-live-ui rel="stylesheet" href="'+ui_css+'">'
        text=text.replace('</head>',tags+'</head>',1)
        after=text.encode('utf8')
        if after!=before: page.write_bytes(after); changes.append({'path':page.relative_to(site).as_posix(),'before':proof(before),'after':proof(after)})
    toc = None
    if sprite and label_map:
        target=site/'_shared'/Path(sprite).name;target.parent.mkdir(parents=True,exist_ok=True);module('live_ui_asset_builder', 'build-assembled-site.py').copy_release_asset(sprite,target)
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
    config = {key: str((HERE.parent/Path(value)).resolve()) if key in {'library','font','sprite','label_map','toc_unify_package'} else value for key,value in config.items()}
    unify = config.get('toc_unify_package')
    paths = {key: Path(config[key]).resolve() for key in
             (('library', 'font') if unify else ('library', 'font', 'sprite', 'label_map'))}
    hardware = module('bound_hardware_assets', 'prepare-live-hardware-assets.py')
    consumed = [recipe, *[path for key, path in paths.items() if key != 'library']]
    toc_pages = None
    if unify:
        _, _, toc_pages, _, toc_inputs = toc_unify_package(unify)
        if pages is not None and not set(pages) <= set(toc_pages):
            raise ValueError('Live UI page selection differs from the approved TOC scope')
        consumed += toc_inputs
    consumed += [HERE / name for name in (
        'prepare-live-ui.py', 'prepare-live-hardware-assets.py', 'update-live-release.py',
        'site-live-runtime.js', 'typeset-live-display.js', 'b2-live-runtime.js', 'prepare-cockpit-cache.py',
        'typeset-layout.js', 'typeset-layout.css', 'b2-live.css',
        'live-hardware-ui.css', 'live-hardware-ui.js', 'live-status-ui.css', 'live-status-ui.js')]
    if not unify:
        consumed += [HERE / name for name in ('prepare-toc-consistency.py', 'toc-consistency.css', 'toc-consistency.js')]
    consumed += [HERE.parent / 'app/computer-access-model.js']
    if pages is None or 'cockpit/index.html' in pages:
        _, title_inputs = cockpit_title_inputs(paths['library']); consumed += title_inputs
    consumed += [paths['library'] / relative for relative in set(hardware.SOURCES.values())]
    consumed += [paths['library'] / 'icons' / name for name in
        ('笔记本电脑.png', '硬盘循环.png', '云对勾.png', '打勾清单.png', '日历时钟.png', '工具箱.png')]
    inputs = {str(path): proof(path.read_bytes()) for path in consumed}
    result = prepare(site, **paths, pages=pages)
    result.pop('site')
    if unify:
        # The builder's early candidate has no homepage. The owning builder
        # finalizes this bound package on the complete site after creative replay.
        result['toc'] = {'schema': 'wly.toc-unify.v1', 'status': 'pending_complete_site',
                         'page_count': 0, 'missing_labels': [], 'selected_page_paths': toc_pages}
        result['status'] = 'prepared_pending_toc'
    else:
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

"""Render a separate public rule image generation from frozen source HTML.

The existing typeset renderer owns Chrome, G1-G6, splitting and hotspots. This
adapter replaces only its HTML input and in-memory expected literal projection;
it never writes the original page, spec, HTML, PNG, manifest or report.
"""
from __future__ import annotations
import argparse
from datetime import datetime, timedelta, timezone
import importlib.util
import json
import os
import re
from pathlib import Path
import shutil
import sys
import time

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import rule_original_contract as contract
from public_page_contract import local_values


def load_module(name, filename):
    spec = importlib.util.spec_from_file_location(name, filename)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module


def read(path): return json.loads(Path(path).read_text('utf-8-sig'))
def digest(path): return contract.sha_bytes(Path(path).read_bytes())
def write(path, value):
    path = Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf8')


def inventory_sources(path, names):
    """An explicitly supplied inventory owns the exact frozen source locator."""
    sources = {}
    for line in Path(path).read_text('utf-8-sig').splitlines():
        if not line.strip(): continue
        row = json.loads(line)
        if row['page'] not in names: continue
        source = Path(row['source_path']).resolve()
        if row['page'] in sources and sources[row['page']] != source:
            raise ValueError('Inventory has multiple source files: ' + row['page'])
        if row.get('source_sha256') != digest(source):
            raise ValueError('Inventory source SHA differs from frozen source: ' + row['page'])
        sources[row['page']] = source
    if set(names) - set(sources):
        raise ValueError('Rule pages absent from supplied inventory: ' + ', '.join(sorted(set(names) - set(sources))))
    return sources


def frozen_inputs(typeset_root, engine_root):
    snapshot_path = Path(typeset_root).parent / 'snapshot.json'
    if not snapshot_path.is_file(): return {}, None
    snapshot = read(snapshot_path)
    if snapshot.get('status') != 'pass': raise ValueError('Producer input snapshot is not stable')
    if snapshot.get('producer_root') and Path(snapshot['producer_root']).resolve() != engine_root:
        raise ValueError('Projection engine must be the complete producer in this frozen snapshot')
    for entry in snapshot['files']:
        target = Path(entry['snapshot_path'])
        if digest(target) != entry['snapshot_sha256'] or target.stat().st_size != entry['snapshot_bytes']:
            raise ValueError('Frozen producer input changed: ' + str(target))
    for dependency in snapshot.get('external_dependencies', []):
        target = Path(dependency['original_path'])
        if digest(target) != dependency['sha256'] or target.stat().st_size != dependency['bytes']:
            raise ValueError('Producer host dependency changed: ' + str(target))
    proof = {'path': str(snapshot_path.resolve()), 'sha256': digest(snapshot_path),
             **({'producer_root': snapshot['producer_root']} if snapshot.get('producer_root') else {})}
    bindings = {os.path.normcase(str(Path(source).resolve())): str(Path(target).resolve())
                for source, target in snapshot.get('resource_map', {}).items()}
    return bindings, proof


def require_snapshot_input(path, bindings, proof):
    if proof and proof.get('producer_root') and os.path.normcase(str(Path(path).resolve())) not in {
            os.path.normcase(target) for target in bindings.values()}:
        raise ValueError('Projection input is outside this frozen producer generation: ' + str(path))


def bound_resource(value, bindings):
    if not isinstance(value, str) or not value: return value
    # Source/spec bytes remain in the raw snapshot. Only exact registered local
    # resource values in this derivative move to their already frozen copy.
    if value.startswith('file:'):
        from urllib.parse import urlsplit, unquote
        path = unquote(urlsplit(value).path)
        if re.match(r'^/[A-Za-z]:/', path): path = path[1:]
        target = bindings.get(os.path.normcase(str(Path(path).resolve())))
        return Path(target).as_uri() if target else value
    if Path(value).is_absolute():
        return bindings.get(os.path.normcase(str(Path(value).resolve())), value)
    return value


def project_version_reference(value, old_first, new_first):
    if old_first==new_first:return value
    prefix,separator,suffix=value.partition('|')
    normalized=lambda text:re.sub(r'[\s#*`]+','',text)
    if normalized(prefix) and normalized(old_first).startswith(normalized(prefix)):
        return new_first+(separator+suffix if separator else '')
    return value


def project_html(document):
    # Use the same declared source roots as source capture, then retain the
    # existing project_original_html semantics. Renderer dependencies stay
    # as private build inputs, outside the website's public runtime fields.
    result = document
    # Local paths can span zero-width wbr elements; project the contiguous
    # declared original blocks as well, preserving all other HTML exactly.
    from html.parser import HTMLParser
    offsets = [0] + [match.end() for match in re.finditer('\n', result)]
    class Blocks(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=False); self.stack = []; self.ranges = []
        def at(self):
            line, column = self.getpos(); return offsets[line - 1] + column
        def handle_starttag(self, tag, attrs):
            data = dict(attrs)
            selected = contract.source_root(tag, data, ((t, a) for t, a, _, _ in self.stack))
            inherited = self.stack[-1][3] if self.stack else False
            if tag not in contract.HTML_VOID_TAGS:
                self.stack.append((tag, data, self.at() if selected and not inherited else None, selected or inherited))
        def handle_startendtag(self, tag, attrs):
            self.handle_starttag(tag, attrs)
            if tag not in contract.HTML_VOID_TAGS: self.handle_endtag(tag)
        def handle_endtag(self, tag):
            for index in range(len(self.stack) - 1, -1, -1):
                if self.stack[index][0] == tag:
                    _, _, start, _ = self.stack[index]
                    if start is not None: self.ranges.append((start, self.at() + len('</' + tag + '>')))
                    del self.stack[index:]; break
    parser = Blocks(); parser.feed(result)
    for start, end in sorted(parser.ranges, reverse=True):
        result = result[:start] + contract.project_original_html(result[start:end],keep_render_dependencies=True) + result[end:]
    # Source body equality is checked immediately after this transformation.
    # The publication wrapper must not call a projected copy "unchanged".
    return result.replace('一字不改','公开副本')


def verify_projection(root, *, seal=False):
    root=Path(root).resolve();proof_path=root/'rule-public-projection.json';proof=read(proof_path)
    pin_path=HERE.parent/'config/assembled-rules-pin.json';pin=read(pin_path)
    if proof.get('schema')!='wly.rule-public-projection.v1' or proof.get('contract')!=contract.excerpt_contract_id(pin['version']) or proof.get('pin_sha256')!=digest(pin_path):
        raise ValueError('Public projection is not bound to this fixed rule pin')
    if not seal and proof.get('status')!='pass':raise ValueError('Public projection has not completed renderer verification')
    if proof.get('input_snapshot'):
        binding = proof['input_snapshot']; snapshot_path = Path(binding['path'])
        if digest(snapshot_path) != binding['sha256']: raise ValueError('Frozen producer snapshot binding changed')
        frozen_inputs(Path(proof['raw_root']), Path(proof['engine_root']))
    builder=load_module('checked_projection_builder',HERE/'build-assembled-site.py')
    typeset=load_module('checked_projection_typeset',HERE/'build-typeset-site.py')
    publication=load_module('checked_projection_transcript',HERE/'audit-page-publication.py')
    expected=pin['excerpt_contract']['excerpts'];identities={(row['excerpt_id'],row['orientation']) for row in proof['records']}
    if len(identities)!=len(proof['records']) or identities!={(identity,orientation) for identity in expected for orientation in ('h','v')}:
        raise ValueError('Public projection does not cover all fixed source screens and both orientations')
    pages={entry['page']:entry for entry in proof['projected_pages']}
    for entry in pages.values():
        for file_key,sha_key in [('source_file','source_sha256'),('raw_source_file','raw_source_sha256'),('spec_file','spec_sha256'),('raw_spec_file','raw_spec_sha256')]:
            if digest(entry[file_key])!=entry[sha_key]:raise ValueError('Projection source or spec changed: '+entry['page'])
        report=read(root/entry['page']/'report.json')
        if Path(report['source']).resolve()!=Path(entry['source_file']).resolve():
            raise ValueError('Quality report still describes raw images instead of the independent public source')
    for row in proof['records']:
        page=root/row['page'];raw_html=Path(proof['raw_root'])/row['page']/'html'/(row['screen']+'-'+row['orientation']+'.html')
        if digest(raw_html)!=row['raw_html_sha256']:raise ValueError('Frozen raw original HTML changed')
        public_html=page/'html'/raw_html.name;document=public_html.read_text('utf8')
        semantic=contract.project_original_html(typeset.original_rule_html(document))
        if builder.typeset_prose_digest(semantic)!=expected[row['excerpt_id']]['rendered_text_sha256']:
            raise ValueError('Actual public HTML changed the fixed source excerpt')
        if local_values(publication.rendered_text(document)):raise ValueError('Actual public image HTML contains a visible local path')
        quality=next((item for item in read(page/'report.json')['screens'] if item.get('screen')==row['screen'] and item.get('orientation')==row['orientation']),None)
        if not quality or quality.get('status')!='pass' or quality.get('issues') or quality.get('incomplete'):
            raise ValueError('Actual public image does not pass the existing quality gates')
        images=next(item['images'] for item in read(page/'page-manifest.json')['screens'] if item['screen']==row['screen'])
        outputs=[{**image,'sha256':digest(page/image['image']),'links_sha256':digest(page/image['links'])}
                 for image in images if image['orientation']==row['orientation']]
        if not outputs:raise ValueError('Public image orientation is missing')
        if not seal and (row.get('public_html_sha256')!=digest(public_html) or row.get('outputs')!=outputs):
            raise ValueError('Public HTML/PNG/hotspots changed after the sealed projection')
        row.update(public_html_sha256=digest(public_html),outputs=outputs)
    if proof.get('inventory') and digest(proof['inventory']['path'])!=proof['inventory']['sha256']:
        raise ValueError('Projected inventory changed')
    if seal:
        proof.update(status='pass',completed_at_beijing=datetime.now(timezone(timedelta(hours=8))).isoformat())
        write(proof_path,proof)
    return proof
def projection_digest(proof): return contract.sha_bytes(json.dumps({k: proof[k] for k in ('contract', 'pin_sha256', 'records')}, sort_keys=True).encode())


def main():
    if len(sys.argv)>1 and sys.argv[1]=='verify':
        check=argparse.ArgumentParser(description='Verify/seal one actual public projection generation')
        check.add_argument('--root',type=Path,required=True);check.add_argument('--seal',action='store_true')
        args=check.parse_args(sys.argv[2:]);proof=verify_projection(args.root,seal=args.seal)
        print(json.dumps({'status':'pass','records':len(proof['records']),'sha256':digest(args.root/'rule-public-projection.json')},ensure_ascii=False));return
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--typeset-root', type=Path, required=True)
    parser.add_argument('--page-root', type=Path, required=True)
    parser.add_argument('--engine-root', type=Path, required=True, help='Existing typeset-proto package directory')
    parser.add_argument('--inventory',type=Path,help='Producer inventory; writes a derivative with projected source paths')
    parser.add_argument('--output', type=Path, required=True, help='Fresh, separate derivative typeset root')
    parser.add_argument('--prepare-only', action='store_true', help='Freeze/project HTML without running Chrome')
    args = parser.parse_args()
    for name in ('typeset_root', 'page_root', 'engine_root', 'output'):
        setattr(args, name, getattr(args, name).resolve())
    if args.output.exists() or args.output.is_relative_to(args.typeset_root) or args.typeset_root.is_relative_to(args.output):
        raise ValueError('Public derivative must be a fresh directory separate from the raw generation')
    pin = contract.load_pin(HERE.parent); pin_path = HERE.parent / 'config/assembled-rules-pin.json'
    builder = load_module('projection_builder', HERE / 'build-assembled-site.py')
    typeset = load_module('projection_typeset', HERE / 'build-typeset-site.py')
    publication = load_module('projection_transcript', HERE / 'audit-page-publication.py')
    names = list(dict.fromkeys(entry['page'] for entry in pin['excerpt_contract']['excerpts'].values()))
    sources = inventory_sources(args.inventory, names) if args.inventory else {}
    bindings, snapshot_proof = frozen_inputs(args.typeset_root, args.engine_root)
    args.output.mkdir(parents=True)
    # Retain every non-source screen from the same raw page generation. The
    # existing renderer merges only the selected source screen records below.
    for name in names + (['rules-home'] if (args.typeset_root / 'rules-home').is_dir() else []):
        shutil.copytree(args.typeset_root / name, args.output / name,
                        ignore=shutil.ignore_patterns('compare', '.render.lock'))
    prepared = {}; page_data = {}; records = []; exported=[]
    for name in names:
        source = sources[name] if args.inventory else args.page_root / name / 'page.json'; page = read(source)
        require_snapshot_input(source, bindings, snapshot_proof)
        page_data[name] = page;version_labels={}
        for screen in page['screens']:
            identity = screen.get('source_excerpt_id')
            if screen.get('shape') != 'source_text': continue
            expected = contract.excerpt_entry(pin, identity)
            if not expected or expected['page'] != name or expected['screen'] != screen['id']:
                raise ValueError('Source screen does not bind the fixed excerpt: ' + screen['id'])
            raw_source = Path(page['based_on']['file']); original = digest(raw_source)
            if original != expected['source_sha256'] or page['based_on']['sha256'] != original:
                raise ValueError('Source changed after the fixed excerpt pin')
            declared = [item if isinstance(item,str) else item['text'] for item in screen.get('source',{}).get('omit',[])]
            if declared != expected['selection']['approved_omissions']:
                raise ValueError('Per-screen omission declaration differs from approved source range')
            for orientation in ('h', 'v'):
                raw_html = args.typeset_root / name / 'html' / (screen['id'] + '-' + orientation + '.html')
                require_snapshot_input(raw_html, bindings, snapshot_proof)
                document = raw_html.read_text('utf8'); projected = project_html(document)
                source_html = contract.project_original_html(typeset.original_rule_html(projected))
                if builder.typeset_prose_digest(source_html) != expected['rendered_text_sha256']:
                    raise ValueError('Projected HTML differs from independent source excerpt: ' + screen['id'] + '/' + orientation)
                if local_values(publication.rendered_text(projected), 'visible-public-rule-text'):
                    raise ValueError('A visible local literal remains outside the canonical source projection')
                target = args.output / name / 'html' / raw_html.name
                target.write_text(projected, encoding='utf8')
                row = {'page': name, 'screen': screen['id'], 'orientation': orientation,
                       'excerpt_id': identity, 'raw_html_sha256': digest(raw_html),
                       'public_html_sha256': digest(target), 'source_sha256': original,
                       'excerpt_rendered_text_sha256': expected['rendered_text_sha256']}
                records.append(row); prepared[(name, screen['id'], orientation)] = (projected, row)
            old_first=screen['text'].split('\n',1)[0]
            screen['text'] = contract.public_markdown(screen['text'], expected['relative_file'], apply_omissions=False)
            for link in screen.get('links', []): link['href'] = contract.source_link_target(link['href'])
            first,separator,rest=screen['text'].partition('\n')
            screen['text']=first.replace('一字不改','公开副本')+(separator+rest if separator else '')
            version_labels[screen['id']]=(old_first,screen['text'].split('\n',1)[0])
        selected={screen['id'] for screen in page['screens'] if screen.get('shape')=='source_text'}
        for screen in page['screens']:
            for screenshot in screen.get('screenshots', []):
                for field in ('file', 'full'):
                    if field in screenshot: screenshot[field] = bound_resource(screenshot[field], bindings)
        original_spec=args.engine_root/'specs'/(name+'.json')
        require_snapshot_input(original_spec, bindings, snapshot_proof)
        spec=read(original_spec)
        # Only authored selector/text fields of original screens can change.
        # Resource values bind to byte-identical frozen inputs when available.
        def project_spec(value,key=None,labels=None):
            if isinstance(value,dict):return {field:project_spec(item,field,labels) for field,item in value.items()}
            if isinstance(value,list):return [project_spec(item,key,labels) for item in value]
            if isinstance(value,str) and key in {'text_ref','text','lead','body','title','label','description'}:
                projected=contract.public_markdown(value,contract.document_for_page(name),apply_omissions=False)
                if key=='text_ref' and labels:projected=project_version_reference(projected,*labels)
                return projected
            return bound_resource(value, bindings)
        spec=[project_spec(item,labels=version_labels[item['screen']]) if item.get('screen') in selected else item for item in spec]
        source_target=args.output/'projected-pages'/name/'page.json';spec_target=source_target.with_name('spec.json')
        write(source_target,page);write(spec_target,spec)
        exported.append({'page':name,'source_file':str(source_target),'source_sha256':digest(source_target),
                         'raw_source_file':str(source),'raw_source_sha256':digest(source),'spec_file':str(spec_target),'spec_sha256':digest(spec_target),
                         'raw_spec_file':str(original_spec),'raw_spec_sha256':digest(original_spec),'screens':sorted(selected)})
    proof = {'schema': 'wly.rule-public-projection.v1', 'contract': contract.excerpt_contract_id(pin['version']),
             'prepared_at_beijing': datetime.now(timezone(timedelta(hours=8))).isoformat(),
             'pin_sha256': digest(pin_path), 'raw_root': str(args.typeset_root),
             'engine_root': str(args.engine_root),
             **({'input_snapshot': snapshot_proof} if snapshot_proof else {}),
             'status': 'prepared' if args.prepare_only else 'rendering', 'records': records, 'pages': names,
             'projected_pages':exported}
    inventory_path=args.inventory or args.typeset_root.parent/'typeset-inventory/screens.jsonl'
    if inventory_path.is_file():
        source_map={entry['page']:entry for entry in exported};rows=[]
        for line in inventory_path.read_text('utf8').splitlines():
            if not line.strip():continue
            row=json.loads(line);entry=source_map.get(row['page'])
            if entry:row.update(source_path=entry['source_file'],source_sha256=entry['source_sha256'])
            rows.append(row)
        target=args.output/'projected-inventory.jsonl'
        target.write_text(''.join(json.dumps(row,ensure_ascii=False)+'\n' for row in rows),encoding='utf8')
        proof['inventory']={'path':str(target),'sha256':digest(target),'raw_inventory_sha256':digest(inventory_path)}
    write(args.output / 'rule-public-projection.json', proof)
    if args.prepare_only:
        print(json.dumps({'status': 'prepared', 'html_directions': len(records), 'output': str(args.output)}, ensure_ascii=False)); return
    os.environ['TYPESET_ASSET_ROOT'] = str(HERE.parent/'sources/assets')
    sys.path.insert(0, str(args.engine_root))
    from engine import render as renderer
    from playwright.sync_api import sync_playwright
    chrome = Path(os.environ.get('WLY_RENDER_CHROME', renderer.CHROME))
    if not chrome.is_file(): raise ValueError('Installed owner Chrome is unavailable')
    runtime = args.output / 'runtime-temp'; runtime.mkdir()
    for key in ('TEMP', 'TMP', 'TMPDIR'): os.environ[key] = str(runtime)
    class Browser:
        def __init__(self, context): self.context = context
        def new_page(self, viewport=None, device_scale_factor=1):
            if device_scale_factor != 1: raise ValueError('Producer viewport must use DPR=1')
            page = self.context.new_page()
            if viewport: page.set_viewport_size(viewport)
            return page
    summaries = []
    with sync_playwright() as playwright:
        context = playwright.chromium.launch_persistent_context(str(args.output / 'chrome-profile'), executable_path=str(chrome),
                    headless=True, device_scale_factor=1, viewport={'width':941, 'height':200}, args=['--disable-gpu', '--disable-lcd-text'])
        try:
            for name in names:
                entry=next(item for item in exported if item['page']==name)
                report=renderer.render_page(name,screens=entry['screens'],do_compare=False,out_root=str(args.output),browser=Browser(context),
                    spec_file=entry['spec_file'],source_file=entry['source_file'])
                summary = {key:report[key] for key in ('page','passed','total','incomplete','failed')}; summaries.append(summary)
                print(json.dumps(summary,ensure_ascii=False),flush=True)
                if report['incomplete'] or report['failed']: raise ValueError('Public projection renderer did not pass all existing program gates: ' + name)
        finally: context.close()
    for row in records:
        root = args.output / row['page']; manifest = read(root / 'page-manifest.json')
        images = next(entry['images'] for entry in manifest['screens'] if entry['screen'] == row['screen'])
        rendered=root/'html'/(row['screen']+'-'+row['orientation']+'.html')
        semantic=contract.project_original_html(typeset.original_rule_html(rendered.read_text('utf8')))
        if builder.typeset_prose_digest(semantic)!=row['excerpt_rendered_text_sha256']:
            raise ValueError('Rendered public image HTML no longer matches the independent excerpt')
        if local_values(publication.rendered_text(rendered.read_text('utf8'))):
            raise ValueError('Rendered public image still contains a visible local path')
        row['public_html_sha256'] = digest(rendered)
        row['outputs'] = [{**image, 'sha256':digest(root/image['image']), 'links_sha256':digest(root/image['links'])}
                          for image in images if image['orientation']==row['orientation']]
    proof.update(status='pass', render_summaries=summaries,
                 completed_at_beijing=datetime.now(timezone(timedelta(hours=8))).isoformat())
    write(args.output / 'rule-public-projection.json', proof)
    verify_projection(args.output)
    print(json.dumps({'status':'pass','html_directions':len(records),'output':str(args.output)},ensure_ascii=False))


if __name__ == '__main__':
    main()

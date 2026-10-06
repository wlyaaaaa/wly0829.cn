"""Replay sealed original images and complete pinned sources into the rules workbench."""
from __future__ import annotations

import argparse
import hashlib
import html
import importlib.util
import json
from pathlib import Path
import re
import struct
import sys
from urllib.parse import unquote, urlsplit

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path: sys.path.insert(0, str(HERE))
import rule_original_contract as contract

BEGIN = '<!-- rule-original-workbench:start -->'
END = '<!-- rule-original-workbench:end -->'
DATA = re.compile(r'<script\b[^>]*\bid=["\']page-data["\'][^>]*>(.*?)</script>', re.S)


def module(name, filename):
    spec = importlib.util.spec_from_file_location(name, HERE / filename)
    value = importlib.util.module_from_spec(spec); spec.loader.exec_module(value)
    return value


def prepare(site_root, projection_manifest):
    root = Path(site_root).resolve(); manifest = Path(projection_manifest).resolve()
    inputs = {}; changed = []

    def bind(path, expected=None):
        path = Path(path).resolve(); payload = path.read_bytes()
        proof = {'sha256': hashlib.sha256(payload).hexdigest(), 'bytes': len(payload)}
        if expected and proof['sha256'] != expected: raise ValueError('Workbench input SHA differs: ' + str(path))
        inputs[str(path)] = proof
        return payload

    def publish(relative, payload):
        target = root / relative.lstrip('/')
        if not target.is_file() or target.read_bytes() != payload:
            target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(payload)
            changed.append(target.relative_to(root).as_posix())

    pin_path = HERE.parent / 'config/assembled-rules-pin.json'
    pin = json.loads(bind(pin_path))
    mappings_path = HERE.parent / 'config/rule-navigation-mappings.json'
    mappings = json.loads(bind(mappings_path))
    proof = json.loads(bind(manifest)); projection_root = manifest.parent
    projection = module('workbench_projection', 'prepare-rule-public-projection.py')
    typeset = module('workbench_typeset', 'build-typeset-site.py')
    publication = module('workbench_publication', 'audit-page-publication.py')
    # Reuse the sealed producer generation's original source/spec/HTML/PNG gate.
    projection.verify_projection(projection_root)
    snapshot_path = Path(proof['input_snapshot']['path'])
    snapshot = json.loads(bind(snapshot_path, proof['input_snapshot']['sha256']))
    for item in snapshot['files']:
        inputs[str(Path(item['snapshot_path']).resolve())] = {'sha256': item['snapshot_sha256'], 'bytes': item['snapshot_bytes']}
    for item in snapshot.get('external_dependencies', []):
        inputs[str(Path(item['original_path']).resolve())] = {'sha256': item['sha256'], 'bytes': item['bytes']}
    if proof.get('inventory'): bind(proof['inventory']['path'], proof['inventory']['sha256'])
    for entry in proof['projected_pages']:
        for field in ('source', 'raw_source', 'spec', 'raw_spec'):
            bind(entry[field + '_file'], entry[field + '_sha256'])
    # Include every local program directly loaded by this replay and its consumers.
    for filename in ('prepare-rule-workbench-originals.py', 'rule_original_contract.py',
                     'prepare-rule-public-projection.py', 'build-typeset-site.py', 'build-assembled-site.py',
                     'audit-page-publication.py', 'public_page_contract.py', 'hybrid-release.py',
                     'update-live-release.py', 'prepare-motion-release.py'):
        bind(HERE / filename)

    home = root / 'rules/index.html'; original = home.read_text('utf8')
    original = re.sub(re.escape(BEGIN) + r'.*?' + re.escape(END), '', original, flags=re.S)
    match = DATA.search(original)
    if not match: raise ValueError('Rules home must retain its existing native page-data')
    home_data = json.loads(match[1]); home_screens = [s['id'] for s in home_data.get('screens', [])]
    home_input_sha = contract.sha_bytes(original.encode('utf8'))
    home_data_sha = contract.sha_bytes(match[1].encode('utf8'))
    excerpts = pin['excerpt_contract']['excerpts']
    grouped = {}
    for identity, excerpt in excerpts.items(): grouped.setdefault(excerpt['page'], []).append((identity, excerpt))
    logical = {v['excerpt_id'].split('/')[0]: unquote(urlsplit(k).query).removeprefix('rule=')
               for k, v in mappings['entries'].items()}
    records = {(r['excerpt_id'], r['orientation']): r for r in proof['records']}
    page_sources = {e['page']: json.loads(Path(e['source_file']).read_text('utf8')) for e in proof['projected_pages']}
    topics = []; rows = []; markup = []
    used_ids = set(re.findall(r'\bid=["\']([^"\']+)', original))
    for page, entries in grouped.items():
        source = page_sources[page]; based = source['based_on']; relative = contract.document_for_page(page)
        expected = pin['documents'][relative]
        source_file = Path(based['file']); source_bytes = bind(source_file, expected['source_sha256'])
        release = source_file.parents[len(Path(relative).parts) - 1]
        bind(release / 'release.json', pin['release_record_sha256'])
        public = contract.public_markdown(source_bytes.decode('utf-8-sig'), relative).encode('utf8')
        public_sha = contract.sha_bytes(public)
        if public_sha != expected['public_source_sha256']: raise ValueError('Complete original projection differs: ' + page)
        public_src = '/_typeset/rule-sources/' + public_sha + '.md'; publish(public_src, public)
        topic = {'page': page, 'logical_id': logical[page], 'relative_file': relative, 'title': source['title'],
                 'src': public_src, 'public_source_sha256': public_sha, 'first_screen': entries[0][1]['screen']}
        topics.append(topic)
        markup.append('<section class="rule-original-panel" id="rule-panel-' + logical[page] + '" data-rule-topic="' + logical[page] + '"><h3>' + html.escape(source['title']) + '</h3><p><a href="' + public_src + '">阅读完整原文（Markdown）</a></p>')
        bind(projection_root / page / 'page-manifest.json'); bind(projection_root / page / 'report.json')
        source_screens = {s['id']: s for s in source['screens']}
        for identity, excerpt in entries:
            sid = excerpt['screen']; src = source_screens[sid]
            variants = {}; parts = []; fragments = []
            for orientation in ('h', 'v'):
                record = records[(identity, orientation)]
                actual_html = bind(projection_root / page / 'html' / (sid + '-' + orientation + '.html'), record['public_html_sha256']).decode('utf8')
                bind(Path(proof['raw_root']) / page / 'html' / (sid + '-' + orientation + '.html'), record['raw_html_sha256'])
                variants[orientation] = actual_html
                for output in record['outputs']:
                    image = projection_root / page / output['image']; payload = bind(image, output['sha256'])
                    width, height = struct.unpack('>II', payload[16:24])
                    hotspots = json.loads(bind(projection_root / page / output['links'], output['links_sha256']))
                    target = '/_typeset/rule-originals/' + output['sha256'][:20] + '-' + output['image']
                    publish(target, payload)
                    part = {'src': target, 'sha256': output['sha256'], 'orientation': orientation,
                            'size': [width, height], 'hotspots': hotspots}
                    parts.append(part)
                    links = []
                    for hot in hotspots:
                        href = hot.get('href', ''); box = [hot.get(k) for k in ('x', 'y', 'w', 'h')]
                        if hot.get('kind') != 'link' or not href or any(not isinstance(n, (int, float)) for n in box):
                            raise ValueError('Original source contains an unsupported hotspot: ' + sid)
                        x, y, w, h = box
                        if x < 0 or y < 0 or w <= 0 or h <= 0 or x + w > width + 1 or y + h > height + 1:
                            raise ValueError('Original source hotspot is outside its image: ' + sid)
                        links.append('<a class="overlay-link" href="' + html.escape(href, quote=True) + '" aria-label="' + html.escape(hot.get('text', ''), quote=True) + '" style="position:absolute;left:' + str(100*x/width) + '%;top:' + str(100*y/height) + '%;width:' + str(100*w/width) + '%;height:' + str(100*h/height) + '%"></a>')
                    fragments.append('<div class="rule-original-image" data-original-orientation="' + orientation + '" style="position:relative"><img src="' + target + '" width="' + str(width) + '" height="' + str(height) + '" loading="lazy" decoding="async" alt="' + html.escape(source['title'], quote=True) + '原文" style="display:block;width:100%;height:auto"><div class="overlays">' + ''.join(links) + '</div></div>')
            body = contract.project_original_html(typeset.original_rule_html(variants['h']))
            transcript = publication.rendered_text('<body>' + body + '</body>')
            record = records[(identity, 'h')]
            meta = {'relative_file': relative, 'version': pin['version'], 'source_sha256': expected['source_sha256'],
                    'public_source_sha256': public_sha, 'src': public_src, 'excerpt_id': identity,
                    'excerpt_contract': contract.excerpt_contract_id(pin['version']), 'original_html': body,
                    'omitted_count': excerpt['approved_omitted_count'], 'rendered_input_sha256': record['public_html_sha256'],
                    'raw_rendered_input_sha256': record['raw_html_sha256'], 'public_projection_sha256': projection.projection_digest(proof)}
            rows.append({'id': sid, 'render_mode': 'typeset', 'shape': 'source_text', 'title': src.get('title', ''),
                         'source_version': pin['version'], 'source_meta': meta, 'parts': parts,
                         'transcript_sha256': contract.sha_bytes(' '.join(transcript.split()).encode('utf8'))})
            aliases = []
            for alias in excerpt.get('heading_aliases', []):
                if alias not in used_ids: aliases.append('<span id="' + html.escape(alias, quote=True) + '"></span>'); used_ids.add(alias)
            markup.append('<section class="rule-original-screen" id="' + sid + '" data-screen="' + sid + '" data-rule-excerpt="' + identity + '">' + ''.join(aliases) + ''.join(fragments) + '<pre class="screen-equivalent-text" data-rule-original-text="' + identity + '">' + html.escape(transcript) + '</pre></section>')
        markup.append('</section>')

    # Source-relative topic links use the same fixed original screen when a detail
    # document does not exist. Existing detail routes retain native navigation.
    topic_by_slug = {('charter' if t['page'] == 'charter' else t['page'].removeprefix('rule-')): t for t in topics}
    def source_destination(href):
        parsed = urlsplit(href); slug = parsed.path.strip('/').removeprefix('rules/')
        topic = topic_by_slug.get(slug)
        if not topic or not parsed.path.startswith('/rules/'): return href
        detail = root / parsed.path.lstrip('/') / 'index.html'
        if detail.is_file(): return href
        owned = [(identity, entry) for identity, entry in grouped[topic['page']]]
        fragment = unquote(parsed.fragment)
        selected = next((e['screen'] for _, e in owned if fragment and fragment in e.get('heading_aliases', [])), topic['first_screen'])
        return '/rules/?rule=' + topic['logical_id'] + '#' + selected
    content = ''.join(markup)
    content = re.sub(r'(<a\b[^>]*\bhref=")([^"]+)(")', lambda m: m[1] + html.escape(source_destination(html.unescape(m[2])), quote=True) + m[3], content)
    for row in rows:
        for part in row['parts']:
            for hot in part['hotspots']: hot['href'] = source_destination(hot['href'])
    data = {'schema': contract.WORKBENCH_SCHEMA, 'version': pin['version'], 'topics': topics, 'screens': rows,
            'pin_sha256': inputs[str(pin_path.resolve())]['sha256'], 'projection_sha256': projection.projection_digest(proof)}
    selector = ''.join('<a id="rule-tab-' + t['logical_id'] + '" href="/rules/?rule=' + t['logical_id'] + '#rule-panel-' + t['logical_id'] + '">' + html.escape(t['title']) + '</a>' for t in topics)
    style = '<style>.rule-original-workbench{margin:3rem 0}.rule-original-selector{display:flex;gap:.6rem;flex-wrap:wrap;margin:1rem 0}.rule-original-selector a{border:1px solid #adc8b0;border-radius:.5rem;padding:.5rem .8rem;color:#28563a;background:#fff}.rule-original-panel{scroll-margin-top:7rem}.rule-original-panel[hidden]{display:none}.rule-original-image[data-original-orientation="v"]{display:none}.rule-original-screen{scroll-margin-top:7rem;margin:1rem 0}@media(max-width:767.98px){.rule-original-image[data-original-orientation="h"]{display:none}.rule-original-image[data-original-orientation="v"]{display:block}}</style>'
    script = '''<script>(function(){const root=document.getElementById('rule-original-workbench');const panels=[...root.querySelectorAll('[data-rule-topic]')];function select(){let target=null;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch(e){}const owner=target&&target.closest('[data-rule-topic]');const query=new URLSearchParams(location.search).get('rule');const current=owner||panels.find(p=>p.dataset.ruleTopic===query)||panels[0];panels.forEach(p=>p.hidden=p!==current);root.querySelectorAll('.rule-original-selector a').forEach(a=>a.setAttribute('aria-current',a.id==='rule-tab-'+current.dataset.ruleTopic?'true':'false'));if(target&&root.contains(target))requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}root.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const u=new URL(a.href,location.href);if(u.pathname!==location.pathname||!u.searchParams.has('rule'))return;e.preventDefault();history.pushState(null,'',u.href);select()});addEventListener('hashchange',select);addEventListener('popstate',select);select()})();</script>'''
    block = BEGIN + style + '<section class="rule-original-workbench" id="rule-original-workbench"><h2>规则原文</h2><p>选择约法或专题，阅读 ' + html.escape(pin['version']) + ' 版的原文字图；每个专题也保留完整文本原文。</p><nav class="rule-original-selector" aria-label="规则原文专题">' + selector + '</nav>' + content + '</section><script id="rule-workbench-data" type="application/json">' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c') + '</script>' + script + END
    if '</main>' not in original: raise ValueError('Rules home has no native content container')
    assembled = original.replace('</main>', block + '</main>', 1)
    contract.parse_workbench_metadata(assembled, pin)
    publish('rules/index.html', assembled.encode('utf8'))
    validation = contract.validate_rule_workbench(root, pin)
    if validation['findings']: raise ValueError(json.dumps(validation['findings'], ensure_ascii=False))
    parsed = contract.parse_workbench_metadata(assembled, pin)
    facts = type('WorkbenchFacts', (), {'rule_workbench_metadata': parsed, 'ids': set(re.findall(r'\bid=["\']([^"\']+)', assembled))})()
    targets = {href: contract.rule_original_fallback(href, mapping, {'rules/index.html': facts}) for href, mapping in mappings['entries'].items()}
    if any(not value for value in targets.values()): raise ValueError('Old source anchor lacks an exact original fallback')
    return {'schema': 'wly.rule-original-workbench-preparation.v1', 'status': 'pass', 'changed_files': sorted(set(changed)),
            'inputs': inputs, 'topics': topics, 'topics11': len(topics), 'excerpt_count': len(rows),
            'legacy_targets': targets, 'legacy_reference_count': len(mappings['references']),
            'home_screens_preserved': home_screens, 'home_input_sha256': home_input_sha,
            'home_page_data_sha256': home_data_sha, 'proof': validation}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site-root', type=Path, required=True)
    parser.add_argument('--projection-manifest', type=Path, required=True)
    parser.add_argument('--report', type=Path)
    args = parser.parse_args(); result = prepare(args.site_root, args.projection_manifest)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print(json.dumps({k: v for k, v in result.items() if k not in {'inputs', 'topics'}}, ensure_ascii=False))


if __name__ == '__main__': main()

"""更新专用编号块：export 导出，write 生成草稿；合入由 update.py 接三关。"""
from editorial_ledger import atomic_write_bytes, atomic_write_text
import argparse
from copy import deepcopy
from difflib import SequenceMatcher
from hashlib import sha256
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path[:0] = [str(ROOT / 'src/typeset'), str(ROOT / 'site-astro/tools')]
from engine.content import bound_json
from engine.layout import assign_by_spec, _starts, LIST_TYPES
from engine.parse import parse, normalize, original_markdown, node_text
from convert_page import heal_text_refs
from apply_edits import locate, whole_number

TEXT = {'prose', 'content_card', 'feature_card', 'dialogue', 'bullet_list', 'step_list', 'callout'}
def read(path): return json.loads(Path(path).read_text('utf-8-sig'))
def save(path, value):
    path = Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    atomic_write_text(path, json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
def at(value, path):
    for key in path: value = value[key]
    return value
def ref_key(key): return key.endswith(('_ref', '_refs')) or key in ('ref', 'labels', 'row_note_from', 'paragraph_header_prefix', 'inset_prefixes', 'inset_paras')
def refs(value, path=(), active=False):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in ('icon_map', 'item_icon_map') and isinstance(child, dict):
                for name in child: yield path+(key, '@'+name), name
            yield from refs(child, path + (key,), active or ref_key(key))
    elif isinstance(value, list):
        for i, child in enumerate(value): yield from refs(child, path + (i,), active)
    elif active and isinstance(value, str): yield path, value

def nodes_for(raw, visible):
    text = raw['text']; literal = '\n' not in text and '\\n' in text
    lines = text.split('\\n' if literal else '\n'); offsets, pos = [], 0
    for line in lines:
        offsets.append((pos, pos + len(line))); pos += len(line) + (2 if literal else 1)
    shown = normalize(visible['text'], preserve_codes=original_markdown(visible)).split('\n')
    if len(lines) != len(shown): raise ValueError('模板改变行数，无法定位原文区间')
    nodes, cursor = parse(visible['text'], markdown_links=original_markdown(visible)), 0
    for node in nodes:
        spans = []
        for line in node['src']:
            index = next((i for i in range(cursor, len(shown)) if shown[i].strip() == line.strip()), None)
            if index is None: raise ValueError('解析节点无法对应原文行')
            spans.append(offsets[index]); cursor = index + 1
        node['_source'], node['_lines'] = node['src'][:], spans
    return nodes

def line_spans(node):
    src, original = node['src'], node['_source']
    hits = [i for i in range(len(original) - len(src) + 1) if original[i:i + len(src)] == src]
    if len(hits) != 1: raise ValueError('节点原文区间不唯一')
    return node['_lines'][hits[0]:hits[0] + len(src)]
def span(node):
    lines = line_spans(node)
    return lines[0][0], lines[-1][1]
def count_between(nodes, start, end):
    return sum(len(node_text(dict(n, src=[line for line, (a, b) in zip(n['src'], line_spans(n)) if start <= a < end]))) for n in nodes)
def candidates(nodes):
    for node in nodes:
        yield node, span(node)[0]
        if node['type'] in LIST_TYPES:
            for line, (a, b) in zip(node['src'], line_spans(node)): yield dict(node, src=[line], raw=line), a

def bind(raw, visible, layouts):
    nodes = nodes_for(raw, visible); result = {}
    for orient in ('h', 'v'):
        if orient not in layouts: raise ValueError(f"{raw['id']}: 缺少 {orient} 摆法")
        blocks, incomplete = layouts[orient]['blocks'], []
        assigned = assign_by_spec(nodes, blocks, [], incomplete)
        if incomplete: raise ValueError(f"{raw['id']} {orient}: {incomplete}")
        groups = {i: {'nodes': g['nodes'], 'start': min(span(n)[0] for n in g['nodes'])}
                  for i, g in enumerate(assigned) if g['nodes']}
        starts = sorted(g['start'] for g in groups.values())
        if starts and starts[0] != 0: groups[next(i for i, g in groups.items() if g['start'] == starts[0])]['start'] = 0
        starts = sorted(g['start'] for g in groups.values())
        for g in groups.values(): g['end'] = next((s for s in starts if s > g['start']), len(raw['text']))
        result[orient] = groups
    return result

def model(root, slug, page=None, layout=None):
    root = Path(root); folder = root / 'sources/pages' / slug
    page = deepcopy(page if page is not None else read(folder / 'page.json'))
    layout = deepcopy(layout if layout is not None else read(folder / 'layout.json'))
    overrides = {str((folder / 'page.json').resolve()): page, str((folder / 'layout.json').resolve()): layout}
    def load(path):
        value = overrides.get(str(Path(path).resolve()))
        return json.dumps(value, ensure_ascii=False) if value is not None else Path(path).read_text('utf-8-sig')
    shown = bound_json(folder / 'page.json', read=load, root=root)
    resolved = bound_json(folder / 'layout.json', read=load, root=root)
    screens = {}
    for raw, visible in zip(page['screens'], shown['screens']):
        layouts = {item.get('orientation', 'h'): item for item in resolved if item['screen'] == raw['id']}
        heal_text_refs(visible, {'layout': layouts})
        groups = bind(raw, visible, layouts)
        screens[raw['id']] = (raw, visible, layouts, groups)
    return page, layout, screens

def number_rows(registry, slug, page):
    for row in registry['records']:
        if row.get('page') != slug: continue
        field = row.get('field', row.get('page_field', '')) or ''
        match = re.fullmatch(r'screens\[(\d+)\]\.text', field)
        if field and not match: continue
        sid = page['screens'][int(match[1])]['id'] if match else row.get('screen')
        if sid and (match or row.get('page_pattern') or 'start' in row): yield row, sid

def export_page(root, slug, capacities=None):
    page, layout, screens = model(root, slug); root = Path(root)
    files = [f'sources/pages/{slug}/page.json', f'sources/pages/{slug}/layout.json', 'sources/refresh/registry.json']
    out = dict(schema='wly.content-blocks.v1', page=slug, base={f: sha256((root/f).read_bytes()).hexdigest() for f in files}, blocks=[])
    numbers = {}
    for row, sid in number_rows(read(root/files[2]), slug, page):
        try: start, end = locate(screens[sid][0]['text'], row)
        except (ValueError, IndexError) as exc: raise ValueError(f"{row['id']}: 登记数定位失败: {exc}") from exc
        numbers[row['id']] = (sid, start, end)
    for sid, (raw, visible, layouts, groups) in screens.items():
        source_nodes = nodes_for(raw, visible)
        cuts = sorted({0, len(raw['text']), *(g['start'] for gs in groups.values() for g in gs.values())})
        for start, end in zip(cuts, cuts[1:]):
            item = dict(id=len(out['blocks'])+1, screen=sid, start=start, end=end, text=raw['text'][start:end], layouts={})
            item['chars'] = count_between(source_nodes, start, end)
            item['numbers'] = [rid for rid, (s, a, b) in numbers.items() if s == sid and a < end and start < b]
            for orient, gs in groups.items():
                item['layouts'][orient] = []
                for index, g in gs.items():
                    if g['start'] >= end or g['end'] <= start: continue
                    count = sum(len(node_text(n)) for n in g['nodes']); key = f'{sid}/{orient}/{index}'
                    cap = (capacities or {}).get(key, count)
                    item['layouts'][orient].append(dict(block=index, start=g['start'], end=g['end'], type=layouts[orient]['blocks'][index]['type'], chars=count, capacity=cap, remaining=cap-count, capacity_basis='measured' if key in (capacities or {}) else 'existing_text'))
            out['blocks'].append(item)
    return out

def write_draft(root, document, edits, run_dir):
    root, run_dir = Path(root), Path(run_dir)
    for file, digest in document['base'].items():
        if sha256((root/file).read_bytes()).hexdigest() != digest: raise ValueError(f'作者源已变: {file}')
    slug = document['page']; page, layout, screens = model(root, slug)
    fields = ('id', 'screen', 'start', 'end', 'text')
    if [tuple(b[k] for k in fields) for b in document['blocks']] != [tuple(b[k] for k in fields) for b in export_page(root, slug)['blocks']]:
        raise ValueError('有块没匹配上，导出编号或原文区间不完整')
    operations = {}
    for edit in edits:
        if edit['block'] not in {b['id'] for b in document['blocks']}: raise ValueError('未知块编号')
        operations.setdefault(edit['block'], []).append(edit)
    registry = read(root/'sources/refresh/registry.json'); base_rows = deepcopy([r for r in registry['records'] if r.get('page') == slug]); changed = False
    for sid, (raw, visible, layouts, groups) in screens.items():
        units = [deepcopy(b) for b in document['blocks'] if b['screen'] == sid]; chunks, position = [], 0
        for unit in units:
            actions = operations.get(unit['id'], []); core = [e for e in actions if e['action'] != '其后加']
            if len(core) > 1: raise ValueError('同一块重复改写')
            edit = core[0] if core else {'action': '不动'}; action = edit['action']
            if action not in ('不动', '改成', '删'): raise ValueError('未知块动作')
            text = unit['text'] if action == '不动' else '' if action == '删' else edit['text']
            literal = '\n' not in raw['text'] and '\\n' in raw['text']
            if literal: text = text.replace('\n', '\\n')
            if action == '改成' and not text.strip(): raise ValueError('空改稿请使用删')
            if action == '改成' and text != unit['text']:
                suffix = re.search(r'(?:\s|\\n)*$', unit['text'])[0]
                text = re.sub(r'(?:\s|\\n)*$', '', text) + suffix
            unit.update(new_start=position, new_text=text); chunks.append(text); position += len(text)
            unit['new_end'] = position; unit['added'] = []
            for addition in (e for e in actions if e['action'] == '其后加'):
                sep = '\\n\\n' if literal else '\n\n'; value = addition['text'].replace('\n', '\\n') if literal else addition['text']
                value = sep + value + sep
                unit['added'].append((position, position+len(value))); chunks.append(value); position += len(value)
        new_text = ''.join(chunks)
        if new_text == raw['text']: continue
        changed = True; old_text = raw['text']; raw['text'] = new_text
        # 在真实作者串中迁移偏移；相同字串不跨块搜索，改开头也不会串到另一块。
        def move(offset, ending=False):
            for u in units:
                if u['start'] <= offset < u['end'] or ending and offset == u['end']:
                    local = offset-u['start']
                    for tag, a, b, c, d in SequenceMatcher(None, u['text'], u['new_text'], autojunk=False).get_opcodes():
                        if not ending and tag == 'insert' and local == a: return u['new_start']+c
                        if ending and local == b and b > a: return u['new_start']+d
                        if a <= local < b: return u['new_start'] + (c+local-a if tag == 'equal' else c) if tag != 'delete' else None
            return len(new_text) if offset == len(old_text) else None
        source = (root/f'sources/pages/{slug}/page.json').resolve()
        resolved = bound_json(source, read=lambda p: json.dumps(page, ensure_ascii=False) if Path(p).resolve() == source else Path(p).read_text('utf-8-sig'), root=root)
        new_visible = next(s for s in resolved['screens'] if s['id'] == sid)
        new_nodes = nodes_for(raw, new_visible)
        def lead(offset, exact=False):
            node = next((n for n in new_nodes if span(n)[0] <= offset < span(n)[1]), None)
            if node is None: node = next((n for n in new_nodes if span(n)[0] >= offset), None)
            if node is None: raise ValueError('改写后没有对应节点')
            if exact: return node.get('name', node.get('text', node_text(node))), span(node)[0]
            if node['type'] in LIST_TYPES:
                index = next((i for i, (a, b) in enumerate(line_spans(node)) if b > offset), 0)
                return node_text(dict(node, src=[node['src'][index]]))[:24], line_spans(node)[index][0]
            return node_text(node)[:24], span(node)[0]
        for orient, gs in groups.items():
            originals = layouts[orient]['blocks']; rebuilt, expected = [], []
            caps = {m['block']: m['capacity'] for u in units for m in u['layouts'][orient]}
            for index, spec in enumerate(originals):
                if index not in gs: rebuilt.append(spec); continue
                group = gs[index]; segments = []
                for u in units:
                    if not group['start'] <= u['start'] < group['end']: continue
                    if u['new_text']:
                        if segments and segments[-1][2] is spec and segments[-1][1] == u['new_start']: segments[-1][1] = u['new_end']
                        else: segments.append([u['new_start'], u['new_end'], spec])
                    for a, b in u['added']:
                        count = count_between(new_nodes, a, b)
                        text_blocks = sorted((j for j in gs if originals[j]['type'] in TEXT), key=lambda j: gs[j]['start'])
                        before = [j for j in text_blocks if gs[j]['start'] < u['end']]; after = [j for j in text_blocks if gs[j]['start'] >= u['end']]
                        neighbors = before[-1:] + after[:1]
                        template = next((originals[j] for j in neighbors if caps[j] >= count), None)
                        if template is None: raise ValueError(f'{sid} {orient}: 相邻文字块装不下新块')
                        segments.append([a, b, deepcopy(template)])
                anchors, cursors = {}, {}
                for path, ref in refs(spec):
                    if path == ('text_ref',): continue
                    heading = 'heading_refs' in path
                    node_ref = isinstance(path[-1], str) and (path[-1].endswith('text_ref') or path[-1].startswith('@'))
                    node_ref = node_ref or bool(set(path) & {'inner_split_ref', 'inner_left_refs', 'inner_right_refs', 'emphasis_ref', 'motion_card_refs', 'number_ref', 'node_ref', 'paragraph_header_prefix', 'inset_prefixes', 'inset_paras'})
                    if heading or node_ref:
                        hits = [(pos, None) for pos in {pos for n, pos in candidates(group['nodes']) if (n.get('name', n.get('text')) == ref if heading else _starts(n, ref))}]
                    else:
                        hits = [(group['start']+m.start(), group['start']+m.end()) for m in re.finditer(re.escape(ref), old_text[group['start']:group['end']])]
                        if not hits:
                            chars = [(ch, i) for i, ch in enumerate(old_text[group['start']:group['end']]) if not ch.isspace() and ch not in '*`']
                            pattern = re.escape(re.sub(r'[\s*`]', '', ref))
                            hits = [(group['start']+chars[m.start()][1], group['start']+chars[m.end()-1][1]+1) for m in re.finditer(pattern, ''.join(ch for ch, i in chars)) if m.end()>m.start()]
                        if 'segment_refs' in path or 'branch_refs' in path:
                            hits = [hit for hit in hits if hit[0] >= cursors.get(path[:-1], group['start'])][:1]
                            if hits: cursors[path[:-1]] = hits[0][1]
                    if len(hits) != 1: raise ValueError(f'嵌套引用定位不到或不唯一: {ref}')
                    x, y = hits[0]; anchors[path] = (move(x), move(y, True) if y is not None else None, heading)
                for a, b, template in segments:
                    def rebound(value, path=(), active=False):
                        if isinstance(value, dict):
                            out = {}
                            for k, v in value.items():
                                if path and path[-1] in ('icon_map', 'item_icon_map'):
                                    name = rebound(k, path+('@'+k,), True)
                                    if name is not None: out[name] = v
                                    continue
                                p = path+(k,)
                                if p == ('text_ref',): out[k] = lead(a)[0]
                                else:
                                    child = rebound(v, p, active or ref_key(k))
                                    if not (active or ref_key(k)) or child not in (None, [], {}): out[k] = child
                            return None if 'text_ref' in value and 'text_ref' not in out else out
                        if isinstance(value, list): return [x for i, v in enumerate(value) if (x := rebound(v, path+(i,), active)) is not None]
                        if active and isinstance(value, str):
                            x, y, heading = anchors.get(path, (None, None, False)) if template is spec else (None, None, False)
                            if x is not None and a <= x < b: return new_text[x:y] if y is not None and y <= b else lead(x, heading)[0] if y is None else None
                            return None
                        return value
                    new_spec = rebound(template); new_spec['text_ref'] = lead(a)[0]
                    if template is not spec or len(segments) > 1: new_spec.pop('id', None)
                    rebuilt.append(new_spec); expected.append((len(rebuilt)-1, a, b))
            heads = [b['text_ref'] for b in rebuilt if b.get('text_ref')]
            if len(heads) != len(set(heads)): raise ValueError(f'{sid} {orient}: 同屏两块的新开头相同')
            layouts[orient]['blocks'] = rebuilt
            actual = bind(raw, new_visible, {orient: layouts[orient], ('v' if orient == 'h' else 'h'): layouts[orient]})[orient]
            for index, a, b in expected:
                wanted = [s for n in new_nodes for s in line_spans(n) if a <= s[0] < b]
                got = [s for n in actual[index]['nodes'] for s in line_spans(n)]
                if wanted != got:
                    raise ValueError(f'{sid} {orient}: 块 {index} 分到的原文不符')
                for path, ref in refs(rebuilt[index]):
                    heading = 'heading_refs' in path
                    if path != ('text_ref',) and (heading or isinstance(path[-1], str) and path[-1].endswith('text_ref')):
                        hits = {pos for n, pos in candidates(actual[index]['nodes']) if (n.get('name', n.get('text')) == ref if heading else _starts(n, ref))}
                        if len(hits) != 1: raise ValueError(f'嵌套引用定位不到或不唯一: {ref}')
            target = next(x for x in layout if x['screen'] == sid and x.get('orientation', 'h') == orient)
            target['blocks'] = rebuilt
        for row, rsid in number_rows(registry, slug, page):
            if rsid != sid: continue
            start, end = locate(old_text, row); fragment = old_text[start:end]
            unit = next(u for u in units if u['start'] <= start < u['end'])
            matches = list(re.finditer(row['page_pattern'], new_text, re.M)) if row.get('page_pattern') else []
            if len(matches) > 1: raise ValueError(f"{row['id']}: 登记数定位不到或不唯一")
            if matches:
                a, b = matches[0].span(1 if matches[0].lastindex else 0)
                if new_text[a:b] != fragment or not unit['new_start'] <= a < b <= unit['new_end']: raise ValueError(f"{row['id']}: 登记数值改变或移到了另一块")
            elif unit['text'] == unit['new_text']: a = unit['new_start'] + start-unit['start']
            else:
                hits = list(re.finditer(re.escape(fragment), unit['new_text']))
                if len(hits) != 1: raise ValueError(f"{row['id']}: 登记数定位不到或不唯一")
                a = unit['new_start'] + hits[0].start()
            if new_text[a:a+len(fragment)] != fragment: raise ValueError(f"{row['id']}: 登记数值改变")
            whole_number(new_text, a, a+len(fragment))
            b = a+len(fragment); pattern = re.escape(new_text[max(0,a-32):a])+'('+re.escape(fragment)+')'+re.escape(new_text[b:b+32])
            matches = list(re.finditer(pattern, new_text, re.M))
            if len(matches) != 1: raise ValueError(f"{row['id']}: 登记数定位不到或不唯一")
            row['page_pattern'] = pattern
            if 'start' in row or 'end' in row: row.update(start=a, end=b)
        for screen in page['screens']:
            if screen['id'] == sid: screen['text'] = new_text
    # 一个页草稿，三个作者文件；不动时直接保留原字节（含 BOM/CRLF）。
    values = [page, layout, registry]; payloads = {}
    for file, value in zip(document['base'], values):
        original = (root/file).read_bytes()
        payloads[file] = original if read(root/file) == value or not changed else (json.dumps(value, ensure_ascii=False, indent=2)+'\n').encode('utf8')
    draft = run_dir/slug; draft.mkdir(parents=True, exist_ok=True)
    for file, payload in payloads.items():
        dest = draft/file; dest.parent.mkdir(parents=True, exist_ok=True); atomic_write_bytes(dest, payload)
    base = dict(document['base']); asset = f'sources/assets/{slug}/manifest.jsonl'
    if (root/asset).is_file():
        raw = (root/asset).read_bytes(); dest = draft/asset; dest.parent.mkdir(parents=True, exist_ok=True)
        atomic_write_bytes(dest, raw); base[asset] = sha256(raw).hexdigest(); payloads[asset] = raw
    manifest = dict(page=slug, base=base, files=list(payloads), registry_base=base_rows)
    asset_map = 'sources/assets/_library/asset-map.jsonl'
    if (root/asset_map).is_file():
        lines = [line for line in (root/asset_map).read_bytes().splitlines(True) if line.strip() and json.loads(line).get('page') == slug]
        dest = draft/asset_map; dest.parent.mkdir(parents=True, exist_ok=True); atomic_write_bytes(dest, b''.join(lines))
        manifest.update(asset_base=[json.loads(line) for line in lines], files=manifest['files']+[asset_map])
    save(draft/'draft.json', manifest)
    return draft

def asset_rows(raw):
    return [json.loads(line) for line in raw.decode('utf8').splitlines() if line.strip()]

def draft_updates(root, draft):
    """只核基线和准备写入，不动作者源；同组的所有页先一起核完。"""
    root, draft = Path(root), Path(draft); manifest = read(draft/'draft.json'); p = manifest['page']
    registry_file = 'sources/refresh/registry.json'; asset_map = 'sources/assets/_library/asset-map.jsonl'
    files = {f'sources/pages/{p}/page.json', f'sources/pages/{p}/layout.json'}
    if (asset := f'sources/assets/{p}/manifest.jsonl') in manifest['files']: files.add(asset)
    extras = {asset_map} if 'asset_base' in manifest else set()
    if p != draft.name or set(manifest['files']) != files | {registry_file} | extras: raise ValueError('草稿混入别页文件')
    for file in files:
        target = root/file; digest = sha256(target.read_bytes()).hexdigest() if target.exists() else None
        if file not in manifest['base'] or digest != manifest['base'][file]: raise ValueError('作者源已变：'+file)
    registry = read(root/registry_file)
    if [r for r in registry['records'] if r.get('page') == p] != manifest['registry_base']: raise ValueError('作者源已变：本页数字登记')
    rows = [r for r in read(draft/registry_file)['records'] if r.get('page') == p]
    materials = asset_rows((draft/asset_map).read_bytes()) if extras else None
    if extras and ([r for r in asset_rows((root/asset_map).read_bytes()) if r.get('page') == p] != manifest['asset_base']
                   or any(r.get('page') != p for r in materials)): raise ValueError('作者源已变或混入别页：本页素材行')
    return {f: (draft/f).read_bytes() for f in files}, rows, materials

def merge_draft(root, draft):
    raise ValueError('草稿须由 tools/update.py merge 接三关并合入')

def main():
    parser = argparse.ArgumentParser(description=__doc__); parser.add_argument('--root', type=Path, default=ROOT)
    sub = parser.add_subparsers(dest='command', required=True)
    p = sub.add_parser('export'); p.add_argument('page'); p.add_argument('--out', type=Path, required=True); p.add_argument('--capacities', type=Path)
    p = sub.add_parser('write'); p.add_argument('blocks', type=Path); p.add_argument('edits', type=Path); p.add_argument('--run-dir', type=Path, required=True)
    p = sub.add_parser('merge'); p.add_argument('draft', type=Path)
    args = parser.parse_args()
    try:
        if args.command == 'export': save(args.out, export_page(args.root, args.page, read(args.capacities) if args.capacities else None))
        elif args.command == 'write': print(write_draft(args.root, read(args.blocks), read(args.edits), args.run_dir))
        else: merge_draft(args.root, args.draft)
    except (OSError, ValueError, KeyError, IndexError) as exc: parser.exit(1, f'{exc}\n')

if __name__ == '__main__': main()

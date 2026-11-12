"""草稿只在短路径工作副本试建；逐页回执接 program 关。"""
from hashlib import sha256
from pathlib import Path
import os
import shutil
import subprocess
import sys
import time
import uuid

from update_gates import Run, draft_hash, git, read, write
from update_numbers import require_numbers
from block_tool import draft_updates, export_page
from checks import check_update
from freshness import display_readback
from apply_edits import display_fragment, field_at, locate
from engine.content import bound_json


def public_owner(item, work, dist, routes):
    file = (work / item['file']).resolve()
    for page, route in routes.items():
        if file == dist / route.lstrip('/') / 'index.html' or file == dist / route.lstrip('/'):
            return page
        if any(file.is_relative_to(work / prefix / page) for prefix in ('sources/pages', 'sources/assets')):
            return page
        if file in [work / f'site-astro/src/content/{kind}/{page}.{ext}' for kind, ext in [('pages', 'md'), ('rendered', 'json')]]:
            return page


def number_errors(work, dist, page, records, proofs):
    errors = []
    current = bound_json(work / f'sources/pages/{page}/page.json', root=work, read=lambda p: Path(p).read_text('utf8'))
    for proof in proofs:
        record = next((r for r in records if r['id'] == proof['record_id'] and r['page'] == page), None)
        if record is None: continue
        try:
            locator = proof['locator']; field = record.get('field', record.get('page_field')) or locator.get('logical_field', locator['field'])
            if record.get('page_number') and not any(record.get(k) for k in ('field', 'page_field', 'page_pattern')):
                text = next(n['text'] for n in current['registry']['numbers'] if n['id'] == record['page_number']); a, b = locate(text, record, number=True)
            else:
                parent, key = field_at(current, field); text = str(parent[key]); a, b = locate(text, record)
            fragment = display_fragment(text, a, b)
            if text[a:b] != str(proof['value']) or display_readback(work, dist, page, fragment) != 'verified':
                raise ValueError('新值或新上下文没有进入本轮页面')
        except (OSError, ValueError, KeyError, IndexError, StopIteration) as error:
            errors.append(dict(code='number_not_displayed', message=proof['record_id'] + '：' + str(error)))
    return errors


def trial(directory, baseline_dist, baseline_rendered, checks_input):
    from update import replace_asset_rows
    require_numbers(directory)
    run = Run(directory); state = run.load(); root = Path(state['root'])
    names = [p for p, r in state['pages'].items() if r['status'] == 'active' and 'content' in r['passed']
             and 'program' not in r['passed'] and (run.directory / 'drafts' / p / 'draft.json').is_file()]
    if not names: return dict(pages=[], passed=True, message='没有待试建的内容过关草稿')
    bundle = read(checks_input)
    for key in ('published_blocks', 'number_relations'): bundle[key]  # C1/C2 的已发布基线与本轮关系。
    baseline_dist, baseline_rendered = Path(baseline_dist).resolve(), Path(baseline_rendered).resolve()
    if not (baseline_dist / 'index.html').is_file(): raise ValueError('缺完整旧成品，无法核对站内链接')
    token = uuid.uuid4().hex[:10]; output = run.directory / 'trials' / token
    output.mkdir(parents=True); work = Path('E:/Cache/wly-site-build/t') / token
    work.parent.mkdir(parents=True, exist_ok=True); dist = work / 'dist'
    started = time.monotonic(); rows = {p: dict(page=p, passed=True, errors=[], warnings=[]) for p in names}
    digests = {p: draft_hash(run.directory, p) for p in names}
    for p in names:
        if digests[p] != state['pages'][p].get('draft_sha256'):
            rows[p]['errors'].append(dict(code='draft_changed', message='内容过关后草稿已改，须重走三关'))
    for p in names: run.apply('step-start', p, 'program')
    def command(args, log, *, json_output=False):
        with (output / log).open('w', encoding='utf8') as handle:
            result = subprocess.run([str(a) for a in args], cwd=work, env={**os.environ, 'BLOCK_WORK_DIR': 'E:/Cache/wly-site-build/bw/f3'},
                                    stdout=handle, stderr=subprocess.PIPE if json_output else subprocess.STDOUT, text=True, encoding='utf8')
        if result.returncode not in (0, 1): raise ValueError(f'{log} 命令失败：{result.returncode}')
        return read(output / log) if json_output else result
    try:
        git(root, 'worktree', 'add', '--detach', str(work), 'HEAD')
        shutil.copytree(baseline_dist, dist, ignore=shutil.ignore_patterns('release-*.json', '.build-receipt.json'))
        node_modules = work / 'site-astro/node_modules'
        if (root / 'site-astro/node_modules').is_dir(): node_modules.symlink_to(root / 'site-astro/node_modules', target_is_directory=True)
        else:
            installed = command(['npm.cmd' if os.name == 'nt' else 'npm', 'ci', '--prefix', work / 'site-astro', '--no-audit', '--no-fund'], 'dependencies.log')
            if installed.returncode: raise ValueError('试建依赖安装失败，见 dependencies.log')
        registry_file = 'sources/refresh/registry.json'; registry = read(work / registry_file)
        asset_file = 'sources/assets/_library/asset-map.jsonl'; assets = (work / asset_file).read_bytes()
        for p in names:
            if rows[p]['errors']: continue
            try:
                files, numbers, materials = draft_updates(root, run.directory / 'drafts' / p)
                for f, raw in files.items():
                    target = work / f; target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(raw)
                registry['records'] = [r for r in registry['records'] if r.get('page') != p] + numbers
                if materials is not None: assets = replace_asset_rows(assets, p, materials)
            except (ValueError, KeyError, OSError) as error:
                rows[p]['errors'].append(dict(code='draft_invalid', message=str(error)))
        write(work / registry_file, registry); (work / asset_file).write_bytes(assets)
        marker = work / 'sources/assets/_library/REQUESTS-READY.json'; value = read(marker)
        value['asset_map_sha256'] = sha256(assets).hexdigest(); write(marker, value)
        selected = [p for p in names if not rows[p]['errors']]
        built = dict(pages=[])
        if selected:
            command([sys.executable, '-B', '-X', 'utf8', work / 'scripts/build-site.py', '--trial-pages', ','.join(selected),
                     '--dist', dist, '--report', output / 'build.json', '--baseline-rendered', baseline_rendered], 'build.log')
            built = read(output / 'build.json')
        routes = {p['page']: p['route'] for p in built['pages'] if p.get('route')}
        good = []
        for result in built['pages']:
            row = rows[result['page']]; row.update(result)
            if result['passed']:
                p = result['page']; good.append(p)
                page = read(work / f'sources/pages/{p}/page.json'); page['html'] = Path(result['html']).read_text('utf8')
                try:
                    current = export_page(work, p)
                    checked = check_update(dict(bundle, changed_pages=[p], pages={p: page}, blocks={p: current}))['pages'][0]
                    row['errors'] += checked['errors']; row['warnings'] += checked['warnings']
                    row['errors'] += number_errors(work, dist, p, registry['records'], read(run.directory / 'numbers/apply-report.json').get('record_readback', []))
                except (OSError, ValueError, KeyError) as error:
                    row['errors'].append(dict(code='program_input_invalid', message=str(error)))
            elif result.get('route'):
                route = result['route'].lstrip('/'); old = baseline_dist / route
                old = old / 'index.html' if not old.suffix else old
                if old.is_file():
                    target = dist / old.relative_to(baseline_dist); target.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(old, target)
        public = command(['node', work / 'scripts/verify-public-content.mjs', '--dist', dist, '--incremental'], 'public.json', json_output=True)
        shared = []
        for item in public['findings']:
            owner = public_owner(item, work, dist, routes)
            if owner: rows[owner]['errors'].append(dict(code='public_content', message=str(item)))
            else: shared.append(item)
        if shared:
            for row in rows.values(): row['errors'].append(dict(code='public_shared', message='共用文件公开检查未过，见 public.json'))
        if good:
            command([sys.executable, '-B', '-X', 'utf8', work / 'site-astro/tools/scan_glance.py', '--dist', dist,
                     '--pages', ','.join(routes[p] for p in good), '--out', output / 'scan'], 'scan.log')
            scans = {p['page']: p for p in read(output / 'scan/page-checks.json')['pages']}
            for p in good:
                rows[p]['errors'] += scans[routes[p]]['errors']; rows[p]['warnings'] += scans[routes[p]]['warnings']
        changes = []
        layout = read(output / 'layout-diff.json') if (output / 'layout-diff.json').exists() else dict(changes=[], errors=[])
        for error in layout['errors']:
            if error['page'] in rows: rows[error['page']]['errors'].append(dict(code='layout_baseline', message=error['message']))
        for p in good:
            try: a, b = read(baseline_rendered / (p + '.json')), read(work / f'site-astro/src/content/rendered/{p}.json')
            except (OSError, ValueError) as error:
                rows[p]['errors'].append(dict(code='layout_baseline', message=str(error))); continue
            old = {s['id']: s for s in a['screens']}
            for screen in b['screens']:
                sid = screen['id']; flipped = [c for c in layout['changes'] if c['page'] == p and c['screen'] == sid]
                if old.get(sid) != screen or flipped: changes.append(dict(page=p, screen=sid, content_changed=old.get(sid) != screen, layout_changed=bool(flipped)))
        write(output / 'screens.json', dict(changes=changes, screenshots=str(output / 'scan/scan-result.json'), layout=layout))
    except (OSError, ValueError, KeyError, subprocess.SubprocessError) as error:
        for row in rows.values(): row['errors'].append(dict(code='trial_failed', message=str(error)))
    for p, row in rows.items():
        if digests[p] != draft_hash(run.directory, p): row['errors'].append(dict(code='draft_changed', message='试建期间草稿变化'))
        row['passed'] = not row['errors']; artifact = output / (p + '.json'); write(artifact, row)
        try:
            run.apply('pass' if row['passed'] else 'reject', p, 'program', artifact=str(artifact), reason='；'.join(e['message'] for e in row['errors']))
        except ValueError as error:
            row['errors'].append(dict(code='gate_rejected', message=str(error))); row['passed'] = False; write(artifact, row)
            run.apply('reject', p, 'program', artifact=str(artifact), reason=str(error))
    receipt = dict(schema='wly.page-checks.v1', stage='trial', pages=list(rows.values()), passed=all(r['passed'] for r in rows.values()),
                   worktree=str(work), dist=str(dist), output=str(output), seconds=round(time.monotonic() - started, 3))
    write(output / 'layout-notes.json', dict(schema='wly.layout-notes.v1', findings=[dict(page=r['page'], **w) for r in rows.values() for w in r['warnings'] if w['code'] in {'blank', 'imbalance'}]))
    write(output / 'trial.json', receipt); write(run.directory / 'trial.json', receipt)
    return receipt

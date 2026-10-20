"""Record every changed publication source, including paths without known owners."""
import argparse
import hashlib
import json
import os
import re
import subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
GENERATED = ('site-release/', *(f'site-astro/public/{name}/' for name in
             ('assets', '_shared', '_living', '_album', '_typeset', '_chrome')))
def git(repo, *args):
    return subprocess.run(['git', '-C', str(repo), *args], check=True, capture_output=True).stdout
def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))
def source_paths(repo, names):
    names = sorted(set(names))
    if not names: return []
    ignored = subprocess.run(['git', '-C', str(repo), 'check-ignore', '--no-index', '-z', '--stdin'],
                             input=('\0'.join(names)+'\0').encode(), capture_output=True)
    if ignored.returncode not in (0, 1): raise ValueError(ignored.stderr.decode('utf8'))
    excluded = set(ignored.stdout.decode('utf8').split('\0'))
    return [name for name in names if not name.startswith(GENERATED) and name not in excluded]
def snapshot(repo=ROOT):
    repo = Path(repo)
    names = git(repo, 'ls-files', '-z', '--cached', '--others', '--exclude-standard').decode('utf8').split('\0')
    result = {}
    for name in source_paths(repo, filter(None, names)):
        path = repo/name
        if path.is_symlink(): result[name] = hashlib.sha256(os.readlink(path).encode('utf8')).hexdigest()
        elif path.is_file():
            with path.open('rb') as stream: result[name] = hashlib.file_digest(stream, 'sha256').hexdigest()
        elif path.exists(): raise ValueError('Source is not a file: '+name)
    return result
def git_snapshot(repo, ref):
    entries = {}
    for row in git(repo, 'ls-tree', '-rz', '--full-tree', ref).split(b'\0'):
        if row:
            meta, name = row.split(b'\t', 1)
            mode, kind, oid = meta.split()
            entries[name.decode('utf8')] = (kind, oid)
    result = {}
    with subprocess.Popen(['git', '-C', str(repo), 'cat-file', '--batch'], stdin=subprocess.PIPE, stdout=subprocess.PIPE) as proc:
        for name in source_paths(repo, entries):
            kind, oid = entries[name]
            if kind != b'blob':
                proc.stdin.close(); raise ValueError('Baseline source is not a blob: '+name)
            proc.stdin.write(oid+b'\n'); proc.stdin.flush()
            size = int(proc.stdout.readline().split()[2]); digest = hashlib.sha256()
            while size:
                chunk = proc.stdout.read(min(size, 1024*1024))
                if not chunk: raise ValueError('Incomplete Git blob: '+name)
                digest.update(chunk); size -= len(chunk)
            proc.stdout.read(1); result[name] = digest.hexdigest()
        proc.stdin.close()
        if proc.wait(): raise ValueError('Git source snapshot failed')
    return result
def rule_pin(value):
    value = value or {}
    if 'verified_current' in value:
        if value.get('status') != 'pass' or value.get('reason') != 'e_rules_active_verified': raise ValueError('Rules Inspect did not pass')
        value = value['verified_current']
    version, sha = value.get('version', value.get('release_id')), value.get('ruleset_sha256')
    return {'version': version, 'ruleset_sha256': sha} if version and sha else None
def owners(path, projects):
    result = {key: set() for key in ('rules', 'projects', 'skills', 'pages')}
    aliases = {alias: project['id'] for project in projects for alias in
               (project['id'], Path(project.get('ai_refresh', {}).get('content_path') or '').parent.name)}
    for project in projects:
        if path == project.get('ai_refresh', {}).get('content_path'):
            result['projects'].add(project['id']); result['pages'].add(project['id'])
    match = re.match(r'(?:sources/(?:pages|bird/(?:art|prepared))/|site-astro/src/(?:content/pages|chrome/runtime)/)([^/.]+)', path)
    if match:
        page = match[1]; result['pages'].add(page)
        if page.startswith('rule-'): result['rules'].add(page[5:])
        elif page.startswith('skill-'): result['skills'].add(page[6:])
        else:
            owner = next((alias for alias in sorted(aliases, key=len, reverse=True) if page == alias or page.startswith(alias+'-')), None)
            if owner: result['projects'].add(aliases[owner])
    if path.startswith('sources/rules/') or path == 'config/assembled-rules-pin.json':
        result['rules'].add(Path(path).stem.removeprefix('agents.')); result['pages'].add('rules')
    if path.startswith(('skills/', 'plugins/')) and '/skills/' in '/'+path:
        result['skills'].add(path.split('skills/', 1)[1].split('/')[0])
    return {key: sorted(ids) for key, ids in result.items() if ids} or {'other': [path]}
def changes(previous_manifest, current_rules, current_snapshot=None, root=ROOT, baseline_ref=None):
    root = Path(root); previous = read(previous_manifest) if isinstance(previous_manifest, (str, Path)) else previous_manifest
    ref = baseline_ref or previous.get('baseline_production_commit')
    old = previous.get('publication_snapshot')
    if old is None and not ref: raise ValueError('Previous publication has no source snapshot; supply --baseline-ref')
    source = 'publication_snapshot' if old is not None else 'git_source_tree'
    if ref: ref = git(root, 'rev-parse', '--verify', ref+'^{commit}').decode().strip()
    if old is None: old = git_snapshot(root, ref)
    current = snapshot(root) if current_snapshot is None else current_snapshot
    old_rules = next((pin for key in ('rules_pin', 'publication_rules', 'active_rules', 'assembled_rules_pin', 'rules') if (pin := rule_pin(previous.get(key)))), None)
    old_rules = old_rules or rule_pin(previous.get('publication_changes', {}).get('rules', {}).get('after'))
    if not old_rules and ref: old_rules = rule_pin(json.loads(git(root, 'show', ref+':config/assembled-rules-pin.json')))
    new_rules = rule_pin(current_rules)
    if not old_rules or not new_rules: raise ValueError('Both previous and verified current rule pins are required')
    registry = root/'config/panel-projects.json'; projects = read(registry).get('projects', []) if registry.exists() else []
    if ref:
        try: projects += json.loads(git(root, 'show', ref+':config/panel-projects.json')).get('projects', [])
        except subprocess.CalledProcessError: pass
    rows = [{'path': path, 'action': 'added' if path not in old else 'deleted' if path not in current else 'modified',
             'before': old.get(path), 'after': current.get(path), 'owners': owners(path, projects)}
            for path in sorted(set(old) | set(current)) if old.get(path) != current.get(path)]
    affected = {key: sorted({owner for row in rows for owner in row['owners'].get(key, [])}) for key in ('rules', 'projects', 'skills', 'pages', 'other')}
    if old_rules != new_rules: affected['rules'] = sorted(set(affected['rules']) | {'release'})
    return {'schema': 'wly.publication-changes.v1', 'baseline': {'source': source, 'commit': ref}, 'files': rows,
            'affected': affected, 'rules': {'before': old_rules, 'after': new_rules, 'changed': old_rules != new_rules}, 'publication_snapshot': current}
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('baseline-ref', 'previous-manifest', 'rules', 'output', 'snapshot-output'):
        parser.add_argument('--'+name, required=name in ('previous-manifest', 'rules', 'output'))
    args = parser.parse_args(); report = changes(args.previous_manifest, read(args.rules), baseline_ref=args.baseline_ref)
    for path, value in ((args.output, report), (args.snapshot_output, report['publication_snapshot'])):
        if path:
            target = Path(path); target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    print(json.dumps({'status': 'pass', 'changed_files': len(report['files']), 'affected': report['affected']}, ensure_ascii=False))
if __name__ == '__main__': main()

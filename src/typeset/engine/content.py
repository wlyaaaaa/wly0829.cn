"""Resolve authored content references before rendering and freezing the same text."""
import json
from pathlib import Path
import re


def bound_json(path, read=None):
    read = read or (lambda p: Path(p).read_text('utf8'))
    text = read(Path(path))
    if '{{' not in text:
        return json.loads(text)
    root = Path(__file__).resolve().parents[3]
    names = {ref.split('.')[0] for ref in re.findall(r'\{\{([^{}]+)\}\}', text)}
    pages = {p.parent.name: json.loads(read(p)) for p in sorted((root/'sources/pages').glob('*/page.json')) if 'scale' in names or p.parent.name in names}
    projects = [p for p in pages.values() if p.get('kind') in ('project', 'frozen')]
    scale = {key: sum(p.get('status') == value for p in projects) for key, value in [('common', '常用'), ('occasional', '偶尔用'), ('frozen', '冻结')]}
    scale.update(total=len(projects), in_use=scale['common']+scale['occasional'], public=sum(p['public'] for p in projects), private=sum(not p['public'] for p in projects), features=sum(len(p['registry']['features']) for p in projects), retired_features=sum(len(p['registry']['features']) for p in projects if p['kind']=='frozen'))
    values = {**pages, 'scale': scale, 'roster': json.loads(read(root/'config/model-roster.json')) if 'roster' in names else {}, 'stories': json.loads(read(root/'scripts/how-demo-data.json')) if 'stories' in names else {}}
    if 'group_counts' in names:
        directory = pages.get('projects-home') or json.loads(read(root/'sources/pages/projects-home/page.json'))
        visible = {s['id'] for s in directory['screens'] if s.get('shape') == 'card' and not s.get('hidden', False)}
        values['group_counts'] = {g['id']: sum(sid in visible for sid in g['cards']) for g in directory['registry']['groups']}
    def replace(match):
        value = values
        for key in (match[1] or match[2]).split('.'):
            value = (value[int(key)] if key.isdigit() else next(row for row in value if row.get('id', row.get('scenario'))==key)) if isinstance(value, list) else value[key]
        if match[1]:
            return json.dumps(value, ensure_ascii=False)
        if not isinstance(value, (str, int, float)):
            raise ValueError('Content reference must name a text or number: '+match[1])
        return json.dumps(str(value), ensure_ascii=False)[1:-1]
    return json.loads(re.sub(r'"\{\{([^{}]+)\}\}"|\{\{([^{}]+)\}\}', replace, text))

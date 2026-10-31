"""Find rule explanations that have not been checked against their source snapshot."""
import json
from pathlib import Path


def pending(root):
    rows = []
    for path in sorted((Path(root) / 'sources/pages').glob('*/page.json')):
        page = json.loads(path.read_text('utf-8-sig'))
        if page.get('kind') not in {'charter', 'rule-topic', 'rules-home'}:
            continue
        source = page.get('based_on') or {}
        checked = page.get('explanation_based_on') or {}
        current_hash = source.get('sha256') or source.get('ruleset_sha256')
        if current_hash and checked.get('sha256') == current_hash:
            continue
        relative = source.get('file', '').removeprefix('sources/rules/')
        old = checked.get('release') or '未登记'
        new = source.get('release') or '未知'
        command = (f'git diff --no-index -- "E:/.agents/releases/{old}/{relative}" '
                   f'"E:/.agents/releases/{new}/{relative}"')
        if relative == 'release.json':
            command = (f'git diff --no-index -- "E:/.agents/releases/{old}" '
                       f'"E:/.agents/releases/{new}"')
        rows.append({'page': page['page'], 'title': page.get('title', page['page']),
                     'checked_release': old, 'current_release': new,
                     'checked_sha256': checked.get('sha256'), 'current_sha256': current_hash,
                     'diff_command': command})
    return rows


def task_lines(rows):
    lines = ['## 规则讲解待核对（原文哈希已变化）', '']
    lines += [f"- {r['title']}（{r['page']}）：讲解按 {r['checked_release']} 写；"
              f"当前快照 {r['current_release']}；原文差异：`{r['diff_command']}`"
              for r in rows] or ['无。']
    return lines + ['']

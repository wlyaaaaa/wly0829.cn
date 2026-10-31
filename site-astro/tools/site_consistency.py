"""Build-time comparisons against the authored project pages and owner sources."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SUPPLY = Path(r'E:\.agents\config\personal-skill-supply.json')
ROSTER = Path(r'E:\.agents\config\model-roster.json')


def read(path):
    return json.loads(Path(path).read_text('utf-8-sig'))


def pages(root=ROOT):
    return {p.parent.name: read(p) for p in sorted((Path(root) / 'sources/pages').glob('*/page.json'))}


def projects(all_pages):
    return {name: page for name, page in all_pages.items()
            if page.get('kind') in ('project', 'frozen') and not page.get('parent')}


def frozen(all_pages):
    return {name: page for name, page in projects(all_pages).items() if page.get('status') == '冻结'}


def project_directory(home, all_pages):
    """Resolve the frozen group from page status; authored cards supply layout only."""
    home = json.loads(json.dumps(home, ensure_ascii=False))
    groups = home['registry']['groups']; stop = next(g for g in groups if g['id'] == 'g-frozen')
    screens = {s['id']: s for s in home['screens']}
    cards = {s['id']: s for s in home['screens'] if s.get('shape') == 'card'}
    by_url = {}
    for sid, screen in cards.items():
        for link in screen.get('links') or []:
            if link.get('href', '').endswith('/') and link['href'].startswith('/projects/'):
                by_url.setdefault(link['href'], sid)
    frozen_pages = frozen(all_pages)
    frozen_urls = {p['url'] for p in frozen_pages.values()}
    original_frozen = list(stop.get('cards') or [])
    order = {sid: i for i, sid in enumerate(original_frozen + list(cards))}
    for group in groups:
        if group is stop:
            continue
        group['members'] = [url for url in group['members'] if url not in frozen_urls]
        group['cards'] = [sid for sid in group['cards'] if sid not in {by_url.get(url) for url in frozen_urls}]
    stop['members'] = sorted(frozen_urls, key=lambda url: order.get(by_url.get(url), 10**9))
    stop['cards'] = [by_url[url] for url in stop['members'] if url in by_url]
    missing = sorted(frozen_urls - by_url.keys())
    if missing:
        raise ValueError('冻结项目缺少项目总页卡片：' + '、'.join(missing))
    for page in frozen_pages.values():
        card = cards[by_url[page['url']]]
        detail = page.get('registry', {}).get('frozen_card') or {}
        if not detail.get('reason') or not detail.get('now'):
            raise ValueError('冻结项目缺少卡片原因或现在：' + page['url'])
        text = card['text']
        text = re.sub(r'(?m)^停下原因：.*$', '停下原因：' + detail['reason'], text)
        text = re.sub(r'(?m)^现在：.*$', '现在：' + detail['now'], text)
        if '停下原因：' not in text or '现在：' not in text:
            text = text.replace('\n直达：', '\n停下原因：' + detail['reason'] + '\n现在：' + detail['now'] + '\n直达：')
        card['text'] = re.sub(r'(?m)(\*\*〔[^〕]+〕\*\*\s+)(常用|偶尔用)', r'\1冻结', text, count=1)
    # Each group heading is followed by its current members, even after a status change.
    ordered = [home['screens'][0]]
    for group in groups:
        ordered += [screens[group['screen']]] + [screens[sid] for sid in group['cards']]
    if len({s['id'] for s in ordered}) != len(home['screens']):
        raise ValueError('项目总页分组没有覆盖每一屏或重复了卡片')
    home['screens'] = ordered
    return home


def audit(root=ROOT, supply=SUPPLY, roster=ROSTER, rules=None):
    root = Path(root); all_pages = pages(root); site_projects = projects(all_pages); site_frozen = frozen(all_pages)
    mentions = []
    home_frozen = next((g for g in project_directory(all_pages['projects-home'], all_pages)['registry']['groups']
                        if g['id'] == 'g-frozen'), None) if 'projects-home' in all_pages else None
    home_skip = set((home_frozen or {}).get('cards', [])) | {str((home_frozen or {}).get('screen', ''))}
    for name, page in all_pages.items():
        if name in site_frozen:
            continue
        for screen in page.get('screens') or []:
            if name == 'projects-home' and screen['id'] in home_skip:
                continue
            body = screen.get('text') or ''
            for frozen_name, target in site_frozen.items():
                label = target.get('title') or ''
                if label and label in body:
                    mentions.append({'page': name, 'screen': screen['id'], 'project': frozen_name,
                                     'display_name': label, 'excerpt': next((line[:180] for line in body.splitlines() if label in line), '')})
    result = {'frozen_projects': [{'page': n, 'url': p['url'], 'display_name': p['title']}
                                  for n, p in site_frozen.items()], 'frozen_mentions': mentions, 'warnings': []}
    registry = read(root / 'config/panel-projects.json')['projects']
    repos = {row['route'].rstrip('/') + '/': row.get('source', {}).get('repo', '').split('/')[-1].lower()
             for row in registry}
    def repo(page):
        return (repos.get(page['url']) or str(page.get('repo_url') or '').rstrip('/').split('/')[-1]
                or page['page']).lower()
    if rules is None:
        try:
            import sys
            sys.path.insert(0, str(root / 'scripts'))
            import astro_rules
            active = astro_rules.inspect()
            rules = next(Path(path) for path in active['artifact_paths'].values()
                         if str(path).replace('\\', '/').endswith('/agents.context-sources.md'))
        except Exception as error:
            result['warnings'].append('活动规则专题入口不可用：' + str(error)[:160])
    if rules and Path(rules).is_file():
        text = Path(rules).read_text('utf8')
        section = text.split('冻结名单只维护在这里。', 1)[-1].split('## 三档维护', 1)[0]
        expected = {m.lower() for m in re.findall(r'\|\s*`([\w.-]+)`\s*\|', section)}
        result['rule_frozen'] = {'source_file': str(rules),
            'site_not_rules': [p['title'] for p in site_frozen.values() if repo(p) not in expected],
            'rules_not_site': [p['title'] for n, p in site_projects.items() if repo(p) in expected and n not in site_frozen]}
    else:
        result['rule_frozen'] = {'skipped': '活动规则专题文件不存在'}; result['warnings'].append('活动规则冻结名单未读取')
    if Path(supply).is_file():
        installed = {s['name'] for s in read(supply)['skills'] if s.get('install') is True}
        excluded = read(root / 'config/skill-site-exclusions.json')['excluded']
        site_skills = {n[6:] for n, p in all_pages.items() if n.startswith('skill-') and p.get('kind') == 'skill'}
        bundled = {'documents', 'pdf'}
        result['skills'] = {'source_file': str(supply), 'missing': sorted(installed - site_skills - set(excluded)),
            'excluded': {k: excluded[k] for k in sorted(installed & set(excluded))},
            'orphan': sorted(site_skills - installed - bundled), 'bundled': sorted(site_skills & bundled)}
    else:
        result['skills'] = {'skipped': '技能供应文件不存在'}; result['warnings'].append('技能供应清单未读取')
    if Path(roster).is_file():
        current = read(roster)
        candidates = {r['model']: r for r in current['hosts']['codex']['root_openai']['dispatchable']}
        candidates.update({r['model']: r for r in current['hosts']['claude']['dispatchable'] if isinstance(r, dict) and 'model' in r})
        stories = read(root / 'scripts/how-demo-data.json')['stories']; mismatches = []
        aliases = {'GPT-6 Luna': 'gpt-6-luna', 'GPT-6.1 Sol': 'gpt-6.1-sol',
                   'GPT-6.1 Terra': 'gpt-6.1-terra', 'GPT-6 Astra': 'gpt-6-astra',
                   'Opus 5.5': 'claude-opus-5-5'}
        for i, story in enumerate(stories):
            for j, step in enumerate(story.get('rows') or []):
                label = step.get('model') or ''
                found = next(((alias, model) for alias, model in aliases.items() if alias in label), None)
                if not found:
                    continue
                alias, model = found; effort = re.search(r'·\s*(low|medium|high|ultra|max|xhigh)', label)
                luna_wrong = model == 'gpt-6-luna' and (not effort or effort[1] != 'low' or '生图' not in step.get('task', ''))
                sol_wrong = model == 'gpt-6.1-sol' and effort and effort[1] in ('high', 'xhigh')
                if model not in candidates or luna_wrong or sol_wrong:
                    mismatches.append({'story': i + 1, 'step': j + 1, 'task': step.get('task'), 'model': label,
                                       'source': model, 'reason': '现行 Luna 只用于生图、low' if luna_wrong else
                                       '现行 Sol 不使用 high 或旧 xhigh' if sol_wrong else '型号不在现行名单'})
        result['models'] = {'source_file': str(roster), 'mismatches': mismatches,
                            'source_date': current.get('updated_beijing_date')}
    else:
        result['models'] = {'skipped': '模型清单文件不存在'}; result['warnings'].append('模型清单未读取')
    for label, count in [('冻结正文提及', len(mentions)),
                         ('冻结规则差异', len(result['rule_frozen'].get('site_not_rules', [])) + len(result['rule_frozen'].get('rules_not_site', []))),
                         ('技能清单差异', len(result['skills'].get('missing', [])) + len(result['skills'].get('orphan', []))),
                         ('演示模型差异', len(result['models'].get('mismatches', [])))]:
        if count:
            result['warnings'].append(f'{label} {count} 处')
    return result

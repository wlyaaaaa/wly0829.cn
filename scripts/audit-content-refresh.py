"""Audit selected author-source inventories and dated numbers without rewriting content."""
import argparse
from collections import Counter
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import re
import subprocess
import sys
ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT/'scripts/content-refresh'), str(ROOT/'src/typeset')]
from checks import audit_pages
from engine.content import bound_json
SUPPLY = Path('E:/.agents/config/personal-skill-supply.json')
ENTRY = Path('E:/.agents/tools/Invoke-EAgentRulesRelease.ps1')
SKILL_ALIASES = {'learning': 'career-development', 'document-materials': 'personal-formal-documents'}
UNSELECTED_PERSONAL_DOMAINS = {'personal-litigation', 'personal-romance'}
PROJECT_ALIASES = {'github-local-index': 'github-index', 'codex-local-remote': 'codex-remote',
    'wechatdirect': 'wechat-direct', 'work-delivery-copilot': 'work-delivery', 'openclaw': 'openclaw-gateway',
    'personal-formal-documents': 'document-materials', 'codex-agent-model-benchmark': 'cacb'}
DATE = re.compile(r'(?:(20\d{2})\s*(?:年|[-/])\s*)?(\d{1,2})\s*(?:月|[-/])\s*(\d{1,2})(?:\s*[–—~～至]\s*(\d{1,2}))?\s*日?')
MARKER = re.compile(r'截至|观察|观测|快照日期|统计于')
NUMBER = re.compile(r'(?<![A-Za-z0-9_])\d[\d,]*(?:\.\d+)?(?:\s*[万亿])?(?![\d._])')
def difference(expected, actual):
    return {'missing': sorted(set(expected)-set(actual)), 'retired_or_unselected': sorted(set(actual)-set(expected)),
            'duplicate': sorted(name for name, count in Counter(actual).items() if count > 1)}
def dated_numbers(path, screen, first, now, unknown):
    if screen.get('section') in ('history', 'evolution', 'timeline') or re.search('演进|沿革|历史阶段', screen.get('title', '')): return []
    text = screen.get('text', ''); anchors = []
    paragraphs = list(re.finditer(r'\S[\s\S]*?(?=\n\s*\n|$)', text))
    for paragraph in paragraphs:
        if not MARKER.search(paragraph[0]): continue
        for match in DATE.finditer(paragraph[0]):
            try:
                year, month, day, end = match.groups(); observed = datetime(int(year or now.year), int(month), int(end or day)).date()
                if not year and observed > now.date(): observed = observed.replace(year=observed.year-1)
                anchors.append((paragraph.start()+match.start(), observed, year is None))
            except ValueError: unknown.append({'path': path, 'screen': screen.get('id'), 'reason': 'Unknown: 无法解析快照日期', 'text': match[0]})
    if not anchors and re.search(r'(?:截至|快照日期)[^\n]{0,15}(?:Unknown|未知|未提供|未记录|待补)', text) and NUMBER.search(DATE.sub('', text)):
        unknown.append({'path': path, 'screen': screen.get('id'), 'reason': 'Unknown: 固定数字的快照日期未提供或无法定位'})
    rows = []
    for index, paragraph in enumerate(paragraphs):
        if not anchors: continue
        offset, observed, inferred = min(anchors, key=lambda anchor: abs(anchor[0]-paragraph.start()))
        age = (now.date()-observed).days
        if age <= 7: continue
        masked = DATE.sub(lambda match: ' '*len(match[0]), paragraph[0])
        masked = re.sub(r'\b\d{1,2}:\d{2}(?::\d{2})?\b|^\s*\d+[.)、]', lambda match: ' '*len(match[0]), masked, flags=re.M)
        numbers = [{'value': match[0], 'offset': match.start()} for match in NUMBER.finditer(masked)]
        if not numbers: continue
        card = bool(first and (re.search('数字卡|大数字', screen.get('scene', '')) or re.search(r'(?m)^\s*(?:-\s*)?\*\*\d', paragraph[0])))
        rows.append({'path': path, 'screen': screen.get('id'), 'paragraph': index, 'sentence': paragraph[0],
            'date': observed.isoformat(), 'days': age, 'year_inferred': inferred, 'date_scope': '同屏最近的带日期快照声明',
            'numbers': numbers, 'first_screen': first, 'number_card': card,
            'action': '更新来源；无新数时保留截至日期，并从首屏数字卡移至有日期的证据说明' if card else '核对来源，保留截至日期'})
    return rows
def audit(root=ROOT, now=None):
    root = Path(root).resolve(); now = datetime.fromisoformat(now) if isinstance(now, str) else now or datetime.now(timezone(timedelta(hours=8)))
    if now.tzinfo is None: now = now.replace(tzinfo=timezone(timedelta(hours=8)))
    now = now.astimezone(timezone(timedelta(hours=8))); unknown = []
    def read(path):
        def local_read(source):
            return Path(source).read_text('utf-8-sig')
        try: return bound_json(path, local_read, root=root) if Path(path).name == 'page.json' else json.loads(local_read(path))
        except (OSError, ValueError, KeyError, IndexError, StopIteration) as error:
            unknown.append({'path': str(path), 'reason': 'Unknown: '+type(error).__name__}); return {}
    supply = read(SUPPLY); registry = read(root/'config/panel-projects.json'); order = read(root/'config/final-project-order.json')
    try:
        inspect = json.loads(subprocess.run(['pwsh', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', str(ENTRY), '-Mode', 'Inspect', '-Json'],
            check=True, capture_output=True, encoding='utf8', timeout=30).stdout)
        if inspect.get('status') != 'pass' or inspect.get('reason') != 'e_rules_active_verified': raise ValueError('Inspect 未通过')
        active = inspect['verified_current']
    except (OSError, ValueError, KeyError, subprocess.SubprocessError) as error:
        active = {}; unknown.append({'path': str(ENTRY), 'reason': 'Unknown: '+str(error)})
    pages = [(str(path.relative_to(root)).replace('\\', '/'), read(path)) for path in sorted((root/'sources/pages').glob('*/page.json'))]
    if not pages: unknown.append({'path': 'sources/pages', 'reason': 'Unknown: 作者源清单不可用或为空'})
    try: app = (root/'app/content-skills.js').read_text('utf-8-sig')
    except OSError: app = ''; unknown.append({'path': 'app/content-skills.js', 'reason': 'Unknown: 已选能力定义不可用'})
    definitions = re.findall(r'\bslug:\s*["\']([^"\']+)["\']([\s\S]*?)(?=\bslug:|$)', app)
    if not definitions: unknown.append({'path': 'app/content-skills.js', 'reason': 'Unknown: 无法提取已选能力'})
    canonical = lambda name: SKILL_ALIASES.get(name, name)
    host = [name for name, body in definitions if re.search(r'sourceKind:\s*["\']host_integrated', body)]
    selected = [canonical(name) for name, body in definitions if name not in host]
    retired = {item.get('name') if isinstance(item, dict) else item for item in supply.get('retired_skills', [])}
    local = [item['name'] for item in supply.get('skills', []) if item.get('install') is True and item['name'] not in retired]
    author_skills = [canonical(data.get('url', '').strip('/').split('/')[-1]) for path, data in pages if data.get('kind') == 'skill']
    expected_skills = sorted(set(local)-UNSELECTED_PERSONAL_DOMAINS)
    skills = {'current': sorted(local), 'website_app_selected': sorted(selected), 'website_author_source': sorted(author_skills),
        'selected_current': expected_skills, 'unselected_local': sorted(set(local)-set(expected_skills)), 'host_capabilities_outside_personal_supply': host,
        **difference(expected_skills, author_skills), 'app_retired': sorted(set(selected)-set(local)),
        'app_missing_selected': sorted(set(expected_skills)-set(selected))}
    expected_projects = [item['id'] for item in order.get('projects', []) if item.get('state') == 'published']
    selected_projects = [item for item in registry.get('projects', []) if item.get('enabled') is True]
    author_projects = [PROJECT_ALIASES.get(data.get('page'), data.get('page')) for path, data in pages if data.get('kind') in ('project', 'frozen')]
    missing_sources = [item['id'] for item in selected_projects if item['id'] in expected_projects and not (root/(item.get('ai_refresh', {}).get('content_path') or '__missing__')).is_file()]
    for name in missing_sources: unknown.append({'project': name, 'reason': 'Unknown: 已选项目的注册网站内容源缺失'})
    projects = {'current_selected': expected_projects, 'website_registry': [item['id'] for item in selected_projects], 'website_author_source': author_projects,
        **difference(expected_projects, author_projects), 'registry_mismatches': difference(expected_projects, [item['id'] for item in selected_projects]), 'selected_source_missing': missing_sources}
    expected_rules = ['charter' if item['logical_id'] == 'agents_root_rules' else Path(item['relative_path']).stem.removeprefix('agents.') for item in active.get('catalog', {}).get('documents', [])]
    author_rules = ['charter' if data.get('kind') == 'charter' or data.get('page') == 'agents-charter' else data.get('page', '').removeprefix('rule-') for path, data in pages if data.get('kind') in ('rule-topic', 'charter') or data.get('page') == 'agents-charter']
    rules = {'current': expected_rules, 'website_author_source': author_rules, **difference(expected_rules, author_rules), 'version': active.get('release_id', 'Unknown'), 'ruleset_sha256': active.get('ruleset_sha256', 'Unknown')}
    counts = []; versions = []; stale = []; stale_unknown = []
    actual_counts = {'技能': len(author_skills), '项目': len(author_projects), '专题': sum(data.get('kind') == 'rule-topic' for path, data in pages)}
    for path, data in pages:
        for index, screen in enumerate(data.get('screens', [])):
            text = screen.get('text', '')
            if screen.get('section') == 'history': continue
            stale += dated_numbers(path, screen, index == 0 or screen.get('section') == 'top', now, stale_unknown)
            for match in re.finditer(r'(\d+)\s*个[\s·*]*(在用的\s*)?(技能|项目|专题)', text):
                if data.get('page') not in ('skills-home', 'projects-home', 'rules-home', 'agents'): continue
                if match[3] == '项目' and (data.get('page') != 'projects-home' or '〕' in text[max(0, match.start()-8):match.start()]): continue
                actual = sum(page.get('kind') == 'project' for _, page in pages) if match[2] and match[3] == '项目' else actual_counts[match[3]]
                if int(match[1]) != actual: counts.append({'path': path, 'screen': screen.get('id'), 'claim': match[0], 'declared': int(match[1]), 'actual_subpages': actual, 'scope': match[3]})
            if data.get('page') == 'projects-home' and index == 0:
                total = re.search(r'\|\s*\*\*(\d+)\s*个\*\*\s*\|', text)
                if total and int(total[1]) != len(author_projects): counts.append({'path': path, 'screen': screen.get('id'), 'claim': total[0], 'declared': int(total[1]), 'actual_subpages': len(author_projects), 'scope': '项目总数表'})
            for match in re.finditer(r'(?:当前|现行|活动|生效的一版|原文)[^\n]{0,80}?\b(E\d+)\b|\b(E\d+)\b[^\n]{0,35}(?:当前|现行|活动)', text):
                # A legend comparing two example generations is not a claim
                # that either generation is the current release.
                if len(set(re.findall(r'\bE\d+\b', match[0]))) > 1: continue
                version = match[1] or match[2]
                if active and version != active['release_id']: versions.append({'path': path, 'screen': screen.get('id'), 'claim': match[0], 'declared': version, 'current': active['release_id']})
            meta = screen.get('source_meta') or {}
            rule_source = data.get('kind') in ('rule-topic', 'charter', 'rules-home') or meta.get('relative_file', '').startswith(('AGENTS.md', 'docs/contracts/agents.'))
            declared = (meta.get('version') or screen.get('source_version')) if rule_source else None
            if declared and active and active['release_id'] not in re.findall(r'(?<![A-Za-z0-9])E\d+(?!\d)', str(declared)): versions.append({'path': path, 'screen': screen.get('id'), 'declared': declared, 'current': active['release_id']})
    relative = 'sources/rules/release.json' if (root/'sources/rules/release.json').exists() else 'config/assembled-rules-pin.json'
    pin = read(root/relative); pinned_version = pin.get('version', pin.get('release_id', 'Unknown'))
    rules['pin_source'] = relative
    if active and (pinned_version != active['release_id'] or pin.get('ruleset_sha256') != active['ruleset_sha256']): versions.append({'path': relative, 'declared': pinned_version, 'current': active['release_id'], 'ruleset_sha256_match': pin.get('ruleset_sha256') == active['ruleset_sha256']})
    duplicates = []
    for url, count in Counter(data.get('url') for _, data in pages if data.get('url') is not None).items():
        if count < 2: continue
        owning = [{'path': path, 'page': data.get('page'), 'kind': data.get('kind')} for path, data in pages if data.get('url') == url]
        clear_owners = all(item['page'] and item['kind'] for item in owning) and len({item['kind'] for item in owning}) == len(owning)
        duplicates.append({'url': url, 'owners': owning, 'blocking': not clear_owners, 'reason': '不同页面类型的明确别名' if clear_owners else '相同类型的重复网址或归属不明'})
    cards = [row for row in stale if row['number_card']]
    for row in (*stale, *stale_unknown): row['tier'] = 'advisory'
    refresh_registry = read(root/'sources/refresh/registry.json')
    writing = audit_pages(root/'sources/pages', now.date(), refresh_registry.get('retired_names', []), refresh_registry.get('interface_url_allowlist', {}))
    misaligned = any(item.get(key) for item in (skills, projects, rules, projects['registry_mismatches']) for key in ('missing', 'retired_or_unselected', 'duplicate', 'app_retired', 'app_missing_selected', 'selected_source_missing')) or counts or versions or any(item['blocking'] for item in duplicates) or any(row['tier'] == 'block' for row in writing['findings'])
    return {'schema': 'wly.content-refresh-audit.v1', 'observed_at_beijing': now.isoformat(), 'status': 'Unknown' if unknown else 'block' if misaligned else 'pass',
        'aligned': not unknown and not bool(misaligned), 'skills': skills, 'projects': projects, 'rules': rules,
        'website_author_source': [{'path': path, 'page': data.get('page'), 'kind': data.get('kind'), 'url': data.get('url')} for path, data in pages],
        'duplicate_urls': duplicates, 'count_mismatches': counts, 'version_mismatches': versions, 'unknown': unknown, 'stale_numbers': stale,
        'stale_date_unknown': stale_unknown, 'writing_audit': writing,
        'stale_summary': {'paragraphs': len(stale), 'numbers': sum(len(row['numbers']) for row in stale), 'first_screen_paragraphs': sum(row['first_screen'] for row in stale), 'first_screen_numbers': sum(len(row['numbers']) for row in stale if row['first_screen']), 'first_screen_number_card_paragraphs': len(cards)},
        'boundaries': ['个人技能子页按本机 personal-skill-supply.json 中 install=true 的当前清单核对；仅排除本次网站明确不展示的 personal-litigation、personal-romance 两领域，新增已安装技能同样进入缺页检查。', '两个领域的排除来自本次网站选择，不是 L3 敏感规则；不扩展到全部厂商技能或未选项目库。', '宿主集成能力不属于个人技能供应清单，安装及版本为 Unknown，未计入个人技能子页预期。', '固定数字为阿拉伯数字出现次数；移除日期、时间和列表序号，不推定新实数。', '日期适用于同屏最近的快照声明；无年份按最近过去的同月日解释，演进历史屏排除。', '旧固定数字及日期未知只提醒；完整页面写法审计附报告，仅 tier=block 影响对齐。页面审计不采集来源，不改正文或数字。']}
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True); parser.add_argument('--require-aligned', action='store_true')
    parser.add_argument('--root', type=Path, default=ROOT); parser.add_argument('--now')
    args = parser.parse_args(); report = audit(args.root, args.now)
    args.output.parent.mkdir(parents=True, exist_ok=True); args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    print(json.dumps({'status': report['status'], 'aligned': report['aligned'], 'stale_summary': report['stale_summary'], 'output': str(args.output)}, ensure_ascii=False))
    if args.require_aligned and not report['aligned']: raise SystemExit(1)
if __name__ == '__main__': main()

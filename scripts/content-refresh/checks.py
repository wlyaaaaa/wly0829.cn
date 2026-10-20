"""Read visible author copy; findings are review leads, never automatic edits."""
from datetime import date, datetime, timedelta, timezone
import json
from pathlib import Path
import re
from urllib.parse import urlsplit
DATE = re.compile(r'(?:(20\d{2})\s*(?:年|[-/])\s*)?(\d{1,2})\s*(?:月|[-/])\s*(\d{1,2})(?:\s*[–—~～至-]\s*(\d{1,2}))?\s*日?')
URL = re.compile(r'https?://(?:<端口>|[^\s<>\[\]〔〕（）()\u3002，；“”`])+')
LOCAL = re.compile(r'(?<![A-Za-z0-9])[A-Za-z]:[\\/][^\s`\u3002，；“”]+|\\\\[A-Za-z0-9][^\s`\u3002，；“”]+|/(?:Users|home|mnt|tmp)/[^\s`]+')
COMMIT = re.compile(r'(?<![A-Za-z0-9])(?=[a-fA-F0-9]{7,40}(?![A-Za-z0-9]))(?=[a-fA-F0-9]*[a-fA-F])[a-fA-F0-9]{7,40}(?![A-Za-z0-9])')
VERSION = re.compile(r'(?:现行|当前|活动|现在用|生效)[^\n。！？]{0,80}\bE2\d{2}\b|\bE2\d{2}\b[^\n。！？]{0,35}(?:现行|当前|活动|生效)')
MENU = re.compile(r'(?:\[\d{1,2}\]|\(\d{1,2}\))\s*\S')
HISTORY = re.compile(r'演进|沿革|历史阶段|历史记录')
PAST = re.compile(r'曾经|当时|此前|旧版|原先|以前|退役|停用|冻结|迁移到|改名为|更名为|撤下|转由')
NUMBER = re.compile(r'(?<![A-Za-z0-9_.])\d[\d,]*(?:\.\d+)?(?![\d._])')
WORDS = {'text', 'title', 'caption', 'name', 'tagline', 'label', 'value', 'number', 'description', 'status', 'nav_title'}
BLOCK = {'interface-url', 'commit-id', 'terminal-menu', 'fixed-rule-version', 'count-mismatch'}
SKILL_COUNT = re.compile(r'(?<!\d)(\d+)\s*个\s*(?:在用的\s*)?(个人\s*|插件\s*)?技能|(?:(个人|插件)\s*)?技能(?:有|共|一共|合计|总共|总计)\s*(\d+)\s*个?')


def _scoped_skill_count(text, matched):
    # 安装来源子集不能与网站全部详情页比较；后面的独立合计仍会被检查。
    return bool(matched[2] or matched[3] or re.search(
        r'(?:个人|插件|安装|供应|供给|源码|目录)[^。！？；，,\n\d]{0,20}$', text[:matched.start()]))

def _copy(value, field=''):
    """Whitelist rendered words, excluding paths, URLs, scene and metadata."""
    if isinstance(value, dict):
        for key, item in value.items():
            path = f'{field}.{key}' if field else key
            if key in WORDS and isinstance(item, (str, int, float)):
                yield path, str(item)
            elif key in {'card', 'cards', 'screenshots', 'buttons', 'links'}:
                yield from _copy(item, path)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from _copy(item, f'{field}[{index}]')

def _endpoint(url):
    parsed = urlsplit(url)
    host = parsed.hostname or ''
    return bool(re.match(r'^(?:localhost$|127\.|0\.0\.0\.0$|\[?::1|api\.|mcp\.|live\.|status\.)', host)
                or re.search(r'/(?:api(?:/|$)|__status|computer-access(?:/|$)|v\d+(?:/|$))', parsed.path))


def _numbers(text):
    text = DATE.sub('', text)
    text = re.sub(r'\b\d{1,2}:\d{2}(?::\d{2})?\b|^\s*\d+[.)、]|[①-⑳]', '', text)
    text = re.sub(r'第\s*\d+\s*(?:组|项|步|章|屏|阶段)|(?<!\w)#\d+\b|20\d{2}\s*年', '', text)
    text = re.sub(r'\b[A-Za-z][A-Za-z0-9_-]*\d[A-Za-z0-9_.-]*\b|(?:Python|Windows|GPT[- ]?|PowerShell|PS)\s*\d+(?:\.\d+)*(?:\s*/\s*\d+(?:\.\d+)*)*|\d+(?:\.\d+)+\s*版', '', text, flags=re.I)
    return len(NUMBER.findall(text))

def audit_pages(pages_root: Path, today: date | None = None, retired_names=(), interface_url_allowlist=None) -> dict:
    """No host reads; line numbers are one-based within the named visible field."""
    today = today or datetime.now(timezone(timedelta(hours=8))).date()
    pages_root = Path(pages_root)
    if interface_url_allowlist is None:
        registry_path = pages_root.parent/'refresh/registry.json'
        try:
            interface_url_allowlist = json.loads(registry_path.read_text('utf-8-sig')).get('interface_url_allowlist', {})
        except (OSError, ValueError):
            interface_url_allowlist = {}
    paths = sorted(pages_root.rglob('page.json'))
    findings, documents = [], []
    for path in paths:
        page = str(path.relative_to(pages_root)).replace('\\', '/')
        try:
            data = json.loads(path.read_text(encoding='utf-8-sig'))
        except (OSError, ValueError) as error:
            findings.append(dict(page=page, screen='', field='', line=1, code='unreadable-page', tier='advisory', excerpt='', message=f'页面无法读取：{type(error).__name__}'))
            continue
        documents.append((page, data))
    skill_total = None if findings else sum(data.get('kind') == 'skill' for _, data in documents)
    for page, data in documents:
        kind = data.get('kind')
        if kind == 'skill-redirect': continue
        first = next(iter(data.get('screens', [])), {})
        identity = data.get('page', '').removeprefix('skill-') if kind == 'skill' else data.get('page', '')
        if kind in {'skill', 'project'} and identity in retired_names and data.get('status') not in {'frozen', '冻结', '已冻结', 'historical', '历史'} and first.get('section') not in {'history', 'evolution', 'timeline'} and not HISTORY.search(first.get('title', '')):
            findings.append(dict(page=page, screen=first.get('id', ''), field='title', line=1, code='retired-current-entry', tier='block', excerpt=str(data.get('title', ''))[:220], message='已退役入口仍登记为现行页，核对去向，不自动删'))
        for number in data.get('registry', {}).get('numbers', []) if data.get('page') in {'skills-home', 'agents'} else []:
            matched = re.match(r'\s*(\d+)\s*个', number.get('text', '')) if number.get('id') == 'n-skills' else None
            if re.search(r'个人|插件|安装|供应|供给', number.get('meaning', '') + number.get('text', '')):
                continue
            if matched and skill_total is not None and int(matched[1]) != skill_total:
                findings.append(dict(page=page, screen=next(iter(number.get('screens', [])), first.get('id', '')), field='registry.numbers[n-skills].text', line=1, code='count-mismatch', tier='block', excerpt=number['text'], message=f'技能登记数{matched[1]}与kind=skill子页实数{skill_total}不符。'))
        for screen in data.get('screens', []):
            if kind in {'rule-topic', 'charter', 'rules-home'} and (screen.get('source_excerpt_id') or (screen.get('source_meta') or {}).get('excerpt_id')): continue
            historical = screen.get('section') in {'history', 'evolution', 'timeline'} or bool(HISTORY.search(screen.get('title', '')))
            top = screen.get('section') == 'top' or screen.get('id') == first.get('id')
            retired_page = data.get('kind') in {'retired', 'redirect', 'skill-redirect', 'retired-skill', 'retired-project'} or bool(re.search(r'退役|去向|已停用', data.get('title', '')))
            for field, text in _copy(screen):
                raw_menu = len(MENU.findall(text)) >= 2 and bool(re.search(r'终端|菜单|请选择', text))
                for line_number, line in enumerate(text.splitlines(), 1):
                    def add(code, message):
                        tier = 'block' if code in BLOCK or (code == 'stale-as-of' and top) else 'advisory'
                        findings.append(dict(page=page, screen=screen.get('id', ''), field=field, line=line_number, code=code, tier=tier, excerpt=line[:220], message=message))
                    if any(_endpoint(match[0]) and match[0] not in interface_url_allowlist.get(data.get('page'), ()) for match in URL.finditer(line)):
                        add('interface-url', '正文含接口网址；人工核对是否应放在技术与依据中。')
                    if LOCAL.search(URL.sub('', line)):
                        add('local-path', '正文含本机路径；人工核对读者解释和技术依据的位置。')
                    if COMMIT.search(URL.sub('', line)) and re.search(r'提交|commit|\b(?:main|master|HEAD)\b', line, re.I):
                        add('commit-id', '正文含提交号；人工核对是否应放在技术与依据中。')
                    if raw_menu and MENU.search(line):
                        add('terminal-menu', '疑似照贴终端菜单；改写为读者能操作的步骤，保留必要依据。')
                    dated_version = '截至' in line and DATE.search(line.split('截至', 1)[1]) and not re.search(r'当前|现在|现行|活动|目前|正在', line)
                    if not historical and not dated_version and not PAST.search(line) and VERSION.search(line):
                        add('fixed-rule-version', '把现行规则写成固定 E2xx；应由活动规则生成，历史版本保留。')
                    if data.get('page') in {'skills-home', 'agents'} and skill_total is not None and not historical and not PAST.search(line):
                        for matched in SKILL_COUNT.finditer(line):
                            if not _scoped_skill_count(line, matched) and int(matched[1] or matched[4]) != skill_total:
                                add('count-mismatch', f'声明技能数{matched[1] or matched[4]}与kind=skill子页实数{skill_total}不符。')
                    bold_number = re.match(r'^\s*(?:[-*]\s*)?\*\*\s*(?:[①-⑳]\s*)?\d', line)
                    plain_number = re.match(r'^\s*(?:[-*]\s*)?\d[^｜|]*[｜|]', line) and not re.match(r'^\s*\d+[.)、]', line)
                    metric = field.endswith(('.value', '.number')) or bool(bold_number or plain_number)
                    if metric and not historical and _numbers(line) >= 2:
                        add('multiple-card-numbers', '同一数字卡出现两个以上数量；人工核对并拆清口径。')
                    if not historical and '截至' in line:
                        dated = line.split('截至', 1)[1]
                        dates = list(DATE.finditer(dated))
                        if dates:
                            try:
                                selected = dates[0]
                                for candidate in dates[1:]:
                                    if not re.fullmatch(r'\s*(?:到|至|[-–—~～])\s*', dated[selected.end():candidate.start()]):
                                        break
                                    selected = candidate
                                year, month, day, end = selected.groups()
                                observed = date(int(year or today.year), int(month), int(end or day))
                                if not year and observed > today:
                                    observed = observed.replace(year=observed.year - 1)
                                if (today - observed).days > 7:
                                    add('stale-as-of', f'截至日期已超过7天（{observed.isoformat()}）；重取，取不到则保留日期并移出首屏。')
                            except ValueError:
                                add('invalid-as-of', '截至日期无法解析；人工核对原日期，不猜新日期。')
                    if not historical and not retired_page:
                        for name in retired_names:
                            for sentence in re.split(r'[。！？；]', line):
                                if name and name in sentence and not PAST.search(sentence):
                                    add('retired-current-mention', f'已退役名称仍出现在现行说明中：{name}；核对去向，勿自动删除。')
                                    break
    return {'pages_checked': len(paths), 'findings': findings}

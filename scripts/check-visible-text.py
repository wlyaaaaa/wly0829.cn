"""Read-only Chrome/Playwright scan of the registered home-network preview."""
import argparse, asyncio, json, re, sys
from collections import defaultdict
from datetime import datetime, timezone
from urllib.parse import parse_qs, quote, urlsplit
from xml.etree import ElementTree
from playwright.async_api import Error, TimeoutError, async_playwright
LABEL = r"AI\s*在干活|正在干活|在干活|当时在干|在干|做完了?|已完成|本人对话|AI\s*对话|对话|计划任务|项目|等你|等本人|自动维护|帮手"
NUM = r"[0-9][0-9,]*(?:\.[0-9]+)?"
COUNTS = re.compile(
    rf"(?P<a>{LABEL})\s*[:：]?\s*(?P<lower>至少\s*)?(?P<n>{NUM})(?![\d.,/:：]|\s*步|\s*个\s*(?:当时)?在干)(?:\s*(?P<unit_a>[个件场项次条]))?"
    rf"|(?P<b>{NUM})\s*(?P<unit_b>[个件场项次条])\s*(?P<c>{LABEL})(?![的名内没也总标])"
)
WINDOW = re.compile(r"近\s*\d+\s*(?:小时|天)|\d+\s*小时内|今天|昨天|本周|本月|全部|"
                    r"近[一两三七十]+天|截至[^·|。]{0,22}|断开前|离线前|当时|此刻|本人对话")
ALIAS = {"做完": "做完了", "已完成": "做完了", "AI在干活": "在干", "正在干活": "在干",
         "在干活": "在干", "当时在干": "在干", "AI对话": "对话", "等本人": "等你"}
PATTERNS = {
    "状态并存": re.compile(r"(?:做完了|已完成)[^\n]{0,70}帮手\s*[1-9]\d*\s*个在干"),
    "英文状态": re.compile(r"(?<![\w/-])(?:in[_ -]progress|running|pending|queued|waiting|completed|"
                           r"done|failed|stopped|reconnecting|cancelled|unknown|idle|stale|warming)(?![\w/-])", re.I | re.ASCII),
    "英文字段": re.compile(r"(?<![\w/])(?:[a-z]+(?:_[a-z0-9]+)+|stepIndex|stepTotal|lastUpdate|viewerKind|(?:status|state|viewer)(?=\s*[:：=]))(?![\w/])", re.ASCII),
    "Markdown": re.compile(r"\*\*|__[^_\n]+__|[\x60]+|^\s*#{1,6}\s+\S", re.M),
    "拼行残留列表符": re.compile(r"[。！？.!?][-*+][ \t]+[A-Za-z\u3400-\u9fff]"),
    "样例文字": re.compile(r"你今天更想喝茶还是咖啡|(?<![\w/])(?:lorem ipsum|hello world|TODO|FIXME)(?![\w/])|"
                           r"测试数据|样例内容|示例标题|占位文案|待替换|这是(?:一条|一个)?测试", re.I | re.ASCII),
}
QUOTED = re.compile(r'“[^”\n]*”|「[^」\n]*」|『[^』\n]*』|"[^"\n]*"|\x60[^\x60\n]*\x60')
PREVIEW_LIST_MARKER = re.compile(r"(?:^[ \t]*|[。！？.!?])[-*+][ \t]+[A-Za-z\u3400-\u9fff]")
STEP = r"第\s*\d+(?:\s*[/／]\s*|\s*步\s*[/／，,·]?\s*(?:共|总共)\s*)(\d+)\s*步"
PLAN = "#plan .route-stop__text,[data-plan] li,[data-step] .step-text,details ol > li"
HOST_NAMES = ('Claude', 'Codex', 'Antigravity')
INTERNAL = re.compile(r'归一化|读数投影|状态投影|采集桶|判词|水位|收口|回写|暖机|主驾驶|副驾驶')
READOUTS = {
    'head': ('projects', r'项目暂时读不到'), 'active': ('active', r'在用的项目暂时读不到'),
    'frozen': ('frozen', r'冻结的项目暂时读不到'), 'frozen_link': ('frozen', r'冻结数.{0,6}(?:读不到|没有记录)'),
    'changes': ('changes', r'项目变化暂时读不到'), 'skill_rows': ('skills', r'(?:技能使用|这些记录)暂时读不到'),
}
SNAPSHOT = r"""([step, plan]) => {
  const visible = e => e?.getClientRects().length && e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})
      && !e.closest('.sr-only,.visually-hidden,.screen-equivalent-text,[inert]');
  const all = (s, root=document) => [...root.querySelectorAll(s)].filter(visible);
  const text = e => (e?.innerText ?? e?.textContent ?? '').trim();
  const clean = e => text(e).replace(/\s+/g,' ');
  const root = document.querySelector('main') || document.body;
  const ruleSource = /^\/rules\/(?:index\.html|topic-[a-z-]+\.html)?$/.test(location.pathname)
      ? root.querySelector('article#rules-body.rules-body') : null;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const blocks = new Set(), progress = new Map(), rx = new RegExp(step);
  for (let n; n=walker.nextNode();) {
    const e = n.parentElement;
    if (!n.textContent.trim() || e.closest('script,style,template,noscript') || !visible(e)) continue;
    const range = document.createRange(); range.selectNode(n); if (![...range.getClientRects()].some(r => r.width > 1 && r.height > 1)) continue;
    const block = e.closest('p,h1,h2,h3,h4,h5,h6,li,td,dt,dd,a,button,summary,pre,[role=status]') || e;
    if (visible(block)) blocks.add(block);
    const raw = clean(e), hit = raw.match(rx); if (!hit || e.closest('[data-plan] li,#plan .route-stop')) continue;
    const row = e.closest('.row,details,article,[data-progress]') || root;
    const control = all('[data-detail],summary', row).find(b => !b.classList.contains('chat-think'));
    const href = all('a[href]', row).find(a => /^\/live\/(?:chat|task)\/\?id=/.test(a.getAttribute('href')))?.href;
    const scope = row.closest('#hero') ? root : row;
    const label = clean(all('.row__title,h1,h2,summary', row)[0]).slice(0,130);
    const ref = control?.getAttribute('data-detail');
    const candidates = all(plan, scope);
    progress.set(ref || href || label + hit[0], {raw:raw.slice(0,220), label, ref, href, expected:Number(hit[1]),
      summary: !ref && control?.tagName === 'SUMMARY' ? clean(control) : null, steps:candidates.filter(x => clean(x) && !x.querySelector('.live-mark__lock')).length});
  }
  const metrics = all('h1,h2,h3,h4,summary,#chats .card__head,#chats .card__summary,.screen-cell,.lb-card__title,'
      +'.hero__summary,.hero__sub,.hero__facts,.stat,.metric,.kv__row,.kpi,#recent-title,#active-title,#chat-counts > div > p',root);
  const slotSelector='.card,.row,.kv__row,.stat,.metric,.cell,.screen-cell,.piece,.project-cell,.route-card,.route-stop,tr:not(:has(th)),[data-live-cell]';
  const slots = all(slotSelector, root).filter(e => clean(e) || e.querySelector('img[alt]:not([alt=""])'));
  const slotSet = new Set(slots), groups = new Set(), masks = [];
  const markers = all('button:has(.live-mark__lock),.live-mark--pending,[data-private-placeholder]',root);
  for (const e of blocks) if (/^(?:有|另有|其中)?\s*\d+\s*(?:个|项|类|件|条|场)[^。]{0,45}(?:被隐藏|未公开|不对外展示|仅本人可见)/.test(clean(e))
      || /^(?:仅本人可见|本人才能看见|只对本人显示|这部分内容不公开)(?:$|[。·])/.test(clean(e))) markers.push(e);
  for (const e of markers) {
    const raw = clean(e); if (!raw) continue;
    const slot = e.closest(slotSelector);
    const n = Number(raw.match(/(?:另有|其中|^有)\s*(\d+)\s*[个项类件条场份处次]/)?.[1]) || 1;
    if (slotSet.has(slot) && n === 1) { if (groups.has(slot)) continue; groups.add(slot); }
    masks.push({raw, n, extra:n - Number(n===1 && slotSet.has(slot))});
  }
  const rendered = [...blocks, ...all('.screen-cell',root)];
  const selectedText = selector => all(selector, root).map(clean).filter(Boolean).join(' ');
  const readings = {catalog_total:selectedText('.catalog-total'), head:selectedText('#head'),active:selectedText('#active-list'),frozen:selectedText('#frozen-list'),
    frozen_link:selectedText('#projects [data-part="frozen"],#projects a[href*="state=frozen"]'),
    changes:selectedText('#changes-list'),skill_rows:selectedText('#record-body'),chat_hosts:selectedText('#chat-days')};
  const fields = {};
  const rowFields = '.row__title,.row__sub,.chat-preview__text,.stat__value,.pj-fig__v,td';
  for (const row of all('[data-key],[data-row-key]', root)) {
    const ident = row.dataset.rowKey || row.dataset.key, group = row.closest('section[id],article[id]')?.id || '';
    if (!ident || ident === 'empty') continue;
    all(rowFields,row).forEach((field,i) => {
      if (field.closest('[data-key],[data-row-key]') !== row || field.querySelector(rowFields) ||
          field.querySelector('.live-mark--owner,.live-mark--pending')) return;
      const markers = field.querySelectorAll('.live-mark--rewritten');
      if (markers.length > 1) return;
      const copy = field.cloneNode(true); copy.querySelectorAll('.live-mark').forEach(node => node.remove());
      const value = copy.textContent.replace(/\s+/g,' ').trim();
      if (value) fields[JSON.stringify([group,ident,field.tagName,i])] = {text:value,marked:!!markers.length};
    });
  }
  const lines = els => [...new Set(els.flatMap(e=>text(e).split('\n')).filter(Boolean))];
  const images = all('img', root).filter(e => {
    const r = e.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  });
  return {title:document.title, mode:text(document.querySelector('#wly-preview-view')),
    images:{visible:images.length, decoded:images.filter(e=>e.complete && e.naturalWidth>0).length},
    reduced_motion:matchMedia('(prefers-reduced-motion: reduce)').matches,
    lines:lines(rendered), ui_lines:ruleSource ? lines(rendered.filter(e=>!ruleSource.contains(e))) : null,
    preview_lines:lines(all('.chat-preview__text',root)), readings, fields,
    metrics:[...new Set([...metrics, ...all('#hero p,.card__head p,.card__summary p',root)].map(e => {
      const heading = e.parentElement?.matches('#chat-counts > div') ? clean(e.parentElement.querySelector('h2')) : '';
      return heading && e.tagName !== 'H2' ? heading + '：' + clean(e) : clean(e);
    }))],
    preview:clean(root).slice(0,200), skeleton:/正在读这一块最近的情况|正在读这一行的时间/.test(text(root)),
    links:all('a[href]').map(e=>e.href), progress:[...progress.values()],
    slots: slots.length, masks, plan:all("#plan .route-stop__text",root).length};
}"""
def route_of(url):
    p = urlsplit(url)
    return quote(p.path or "/", safe="/%") + (f"?{p.query}" if p.query else "")
def findings(lines, ui_lines=None, preview_lines=()):
    issues = []
    ui_lines = set(ui_lines) if ui_lines is not None else None
    preview_lines = set(preview_lines)
    for raw in lines:
        for category, pattern in PATTERNS.items():
            if category == '英文字段' and ui_lines is not None and raw not in ui_lines:
                continue
            text = raw
            if category == "拼行残留列表符":
                text = QUOTED.sub(lambda m: "\0" * len(m[0]), raw)
                if raw in preview_lines: pattern = PREVIEW_LIST_MARKER
            for match in dict.fromkeys(pattern.findall(text)):
                at = text.find(match); issues.append(dict(kind=category, text=raw[max(at - 55, 0):at + len(match) + 85],
                                   reason=f"可见文字匹配「{match}」，需按所在内容判断"))
    return issues
def sample_facts(packet, resource, query):
    data = packet.get('data')
    if not isinstance(data, dict): return set()
    if resource == 'home':
        row = data.get('projects') or {}
        return {k for k in ('active', 'frozen') if type(row.get(k)) is int}
    if resource == 'projects':
        return {query.get('state', ['frozen'])[0]} if type(data.get('total')) is int or data.get('items') else set()
    if resource == 'projects/changes' and (type(data.get('total')) is int or data.get('items')): return {'changes'}
    if resource == 'projects/agents/records' and query.get('section') in (['skill_rows'], ['skill_usage']) and data.get('items'):
        return {'skills'} | ({'skills_source_missing_host'} if not any('antigravity_d30' in row for row in data['items'] if isinstance(row, dict)) else set())
    if resource == 'chats' and (days := (data.get('stats') or {}).get('days')):
        return {'chat_hosts'} | ({'chat_hosts_source_missing_host'} if not any('antigravity' in day for day in days if isinstance(day, dict)) else set())
    return set()


def semantic_findings(route, readings, facts, lines):
    url = urlsplit(route)
    path = url.path
    issues = []
    if path.startswith('/live/'):
        for line in lines:
            if match := INTERNAL.search(QUOTED.sub('', line)):
                issues.append(dict(kind='可见内部词', text=line, reason=f'界面用语出现「{match[0]}」'))
    if path in {'/live/', '/live/projects/', '/live/records/'}:
        for slot, (key, pattern) in READOUTS.items():
            value = readings.get(slot, '')
            known = {'active', 'frozen'} & facts if key == 'projects' else key in facts
            if known and re.search(pattern, value):
                issues.append(dict(kind='有数据却说读不到', text=value, reason=f'同版接口已返回 {key} 可用读数'))
    if path == '/projects/' and (title := readings.get('catalog_total')):
        issues.append(dict(kind='已定意见回退', text=title, reason='讲解项目总目录已决定去掉这一行'))
    if path == '/live/traffic/':
        for line in lines:
            if '全部网络流量' in line:
                issues.append(dict(kind='已定意见回退', text=line, reason='海外流量页只展示海外流量'))
    for kind, show in (('skills', path == '/live/records/' and 'project=agents' in url.query),
                       ('chat_hosts', path == '/live/chats/')):
        visible = readings.get('skill_rows' if kind == 'skills' else kind, '')
        if show and kind in facts and visible:
            if kind + '_source_missing_host' in facts:
                issues.append(dict(kind='按宿主分家少一家', text='Antigravity', reason='本次同版接口没有返回这个软件的统计字段'))
            missing = [host for host in HOST_NAMES if host not in visible]
            if missing:
                issues.append(dict(kind='按宿主分家少一家', text='、'.join(missing), reason='这一张表按所用软件分组'))
    return issues


def compare_rewrites(pages):
    visible = {(r['role'], r['path']): r.pop('_fields', {}) if not r.get('coverage') else {} for r in pages}
    for r in pages: r.pop('_fields', None)
    for result in pages:
        if result['role'] != '公开版' or result.get('coverage'): continue
        owner = visible.get(('本人版', result['path']), {})
        for key, public in visible['公开版', result['path']].items():
            original = owner.get(key)
            if original and (public['marked'] or original['marked']) and public['text'] == original['text']:
                result['issues'].append(dict(kind='原文一致却说改写', text=public['text'], reason='同一行同一位置的本人版和公开版文字完全相同'))


def count_samples(metrics):
    for raw in metrics:
        if len(raw) > 360:
            continue
        for part in re.split(r"\s*[·｜|]\s*", raw):
            for m in COUNTS.finditer(part):
                label = re.sub(r"\s+", "", m["a"] or m["c"])
                near = part[max(0, m.start() - 45):m.end() + 45]
                if "被隐藏" in part: continue
                if re.search(r"帮手\s+\d+.*在干|(?:^|：)(?:(?:Claude|GPT|Gemini|Codex)\b|型号没记下)", raw) or re.match(r"\s*个\s*班", part[m.end():]):
                    continue
                scope = WINDOW.search(near) or WINDOW.match(raw)
                unit = m["unit_a"] or m["unit_b"] or ""
                yield (ALIAS.get(label, label), float((m["n"] or m["b"]).replace(",", "")),
                       re.sub(r"\s+", "", scope[0]) if scope else "", raw, bool(m["lower"] or "至少" in near), unit)
def compare(pages):
    counts = defaultdict(list)
    for result in pages:
        metrics = result.pop("metrics", [])
        for sample in dict.fromkeys(count_samples(metrics if "?id=" not in result["path"] else [])):
            counts[sample[0]].append((result, sample[1:]))
    for label, entries in counts.items():
        for page, (value, scope, raw, lower, unit) in entries:
            peers = [f"{other['role']} {other['path']}：{evidence}" for other, (n, s, evidence, bound, u) in entries
                     if n != value and not lower and not bound and (not scope or not s or scope == s)
                     and not (label == "等你" and {unit, u} == {"个", "件"})
                     and (page['role'] == other['role'] or page['path'] == other['path'])]
            if peers: page["issues"].append(dict(kind="同标签不同数", text=raw, label=label, scope=scope,
                    reason="数字不同；检查统计范围、身份和读数时间有没有写清", compare=list(dict.fromkeys(peers))))
async def snapshot(page, base, route, role, limit, viewer):
    result = dict(path=route, role=role, viewer=viewer, issues=[], network=[])
    facts, reads, viewers = set(), [], set()
    async def read_sample(response, resource, query):
        try:
            packet = await response.json()
            kind = (packet.get('viewer') or {}).get('kind')
            if kind:
                viewers.add(kind)
            if kind == viewer:
                facts.update(sample_facts(packet, resource, query))
        except (Error, ValueError, AttributeError): pass
    def observe(response):
        url = urlsplit(response.url)
        path = url.path
        if path == "/__live/screen": result["screen_view"] = response.request.headers.get("x-wly-view", "")
        resource = path.removeprefix('/__live/') if path.startswith('/__live/') else path.removeprefix('/computer-access/live/v1/')
        if response.status == 200 and resource != 'access' and (path.startswith('/__live/') or path.startswith('/computer-access/live/v1/')):
            reads.append(asyncio.create_task(read_sample(response, resource, parse_qs(url.query))))
        if response.status in (502, 503) and (path.startswith("/__live/") or response.request.is_navigation_request()):
            result["network"].append(dict(http=response.status, path=path, at=datetime.now(timezone.utc).isoformat()))
    page.on("response", observe)
    try:
        for attempt in range(2):
            response = await page.goto(base + route, wait_until="domcontentloaded", timeout=16000)
            if route.startswith(("/live/", "/projects/", "/computer-access/", "/mcp/")) or route == "/":
                try:
                    await page.wait_for_function(r"""() => {
                       const main=document.querySelector('main')?.innerText || '';
                       const mode=document.querySelector('#wly-preview-view')?.innerText || '';
                       const at=document.querySelector('.live-at')?.innerText || '';
                       const path=location.pathname, ready=path==='/' ? [...document.querySelectorAll('.screen-cell')].some(e=>/\d/.test(e.innerText)) : path.startsWith('/live/') ?
                         /读到|有一份|未开放|找不到/.test(at) || /没有说是哪个|需要本人设备/.test(main) : /看公开版|回本人版/.test(mode);
                       if (path === '/live/chats/' && !document.querySelector('.row--chat,#chat-counts p')) return false;
                       return ready && !/正在读这一块最近的情况|正在读这一行的时间/.test(main);
                    }""", timeout=8500 if route == "/" else 6200)
                    if route.startswith("/live/"): await page.wait_for_load_state("networkidle", timeout=2500)
                except TimeoutError: pass
            try:
                await page.wait_for_load_state('load', timeout=3500)
                await page.wait_for_function("""() => !document.getAnimations().some(a =>
                    a.playState === 'running' && Number.isFinite(a.effect?.getComputedTiming().endTime))""", timeout=1600)
            except TimeoutError:
                pass
            data = await page.evaluate(SNAPSHOT, [STEP, PLAN])
            if not data["skeleton"] and response and response.ok: break
        result.update(title=data["title"], final=route_of(page.url), http=response.status if response else None,
                      view=data["mode"], images=data["images"], reduced_motion=data["reduced_motion"],
                      text_lines=len(data["lines"]), metrics=data["metrics"],
                      links=data["links"], progress=data["progress"], plan=data["plan"])
        incomplete = data["skeleton"] or bool(result["network"] and len(data["lines"]) < 16)
        if not response or not response.ok or incomplete or not data["lines"] or urlsplit(page.url).netloc != urlsplit(base).netloc:
            result["coverage"] = "页面未完整读出：" + data["preview"]
        if route == "/" and role == "公开版" and result.get("screen_view") != "public":
            result["coverage"] = "首页没随公开版切换请求公开读数：" + data["preview"]
        if reads:
            _, pending = await asyncio.wait(reads, timeout=2)
            for pending_read in pending: pending_read.cancel()
        result["viewers_seen"] = sorted(viewers)
        wrong_view = viewers - {viewer} or data["mode"] and ("看公开版" if viewer == "owner" else "回本人版") not in data["mode"]
        if wrong_view or viewer == "owner" and route.startswith("/live/") and not (viewers or data["mode"]):
            result["coverage"] = "页面实际受众与入口不符" if wrong_view else "本页没能核对本人受众"
            for key in ("metrics", "links", "progress"):
                result.pop(key, None)
            return result
        result["issues"].extend(findings(data["lines"], data["ui_lines"], data["preview_lines"]))
        result['_fields'] = data['fields']
        result['issues'].extend(semantic_findings(route, data['readings'], facts, data['lines']))
        if role == "公开版":
            masked = sum(m["n"] for m in data["masks"])
            total = data["slots"] + sum(m["extra"] for m in data["masks"])
            result["privacy"] = dict(locked=masked, total=total, ratio=round(masked / total, 4) if total else None)
            if total and masked / total > limit:
                result["issues"].append(dict(kind="隐藏比例超限", review_only=True, text="｜".join(m["raw"] for m in data["masks"]),
                                              reason=f"{masked}/{total}（{masked/total:.1%}）超过 {limit:.0%}，请人工核对隐藏依据"))
        for item in (x for x in data["progress"] if x["steps"] < x["expected"]):
            button = (page.locator("button[data-detail=" + json.dumps(item["ref"], ensure_ascii=False) + "]:visible")
                      if item["ref"] else page.locator("summary:visible").filter(has_text=re.compile(r"^\s*"+re.escape(item["summary"])+r"\s*$"))
                      if item["summary"] and not item["href"] else None)
            if button is not None and await button.count() == 1:
                try:
                    row = button.locator("xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' row ') or self::details][1]")
                    await button.click(timeout=2500)
                    steps = row.locator("[data-plan] li:visible, ol > li:visible")
                    await steps.first.wait_for(timeout=4600)
                    item["steps"] = await steps.evaluate_all("els=>els.filter(e=>e.innerText.trim()&&!e.querySelector('.live-mark__lock')).length")
                except Error: pass
                item["attempted"] = True
                if await row.count():
                    result["links"].extend(await row.locator("a[href]:visible").evaluate_all("links=>links.map(a=>a.href)"))
                    result["issues"].extend(findings((await row.inner_text(timeout=1000)).splitlines()))
    except Error as exc:
        result["coverage"] = f"浏览器读取失败：{exc.message.splitlines()[0]}"
    finally:
        page.remove_listener("response", observe)
    return result


async def verified_view(page, base, role):
    public = role == "公开版"
    entry = "/__view/" + ("public" if public else "owner") + "?back=/projects/"
    await page.goto(base + entry, wait_until="domcontentloaded", timeout=16000)
    if public:
        await page.locator("#wly-preview-view").filter(has_text="回本人版").wait_for(timeout=14000)
    origin = urlsplit(base)
    lan_port = await page.evaluate("""() => document.querySelector('meta[name="wly-lan-live-port"]')?.content""") if not public else None
    if not public and (not lan_port or not lan_port.isdecimal() or not 1024 <= int(lan_port) <= 65535 or int(lan_port) == origin.port):
        raise ValueError("请从家网登记的本人预览入口扫描")
    expected_port = origin.port if public else int(lan_port)
    def home_reply(response):
        url = urlsplit(response.url)
        return (response.status == 200 and url.scheme == origin.scheme and url.hostname == origin.hostname
                and url.port == expected_port and url.path == '/__live/home' and parse_qs(url.query).get('view') == ['header'])
    async with page.expect_response(home_reply, timeout=15000) as pending:
        await page.evaluate("() => { window.Live.get('home', {view:'header'}); }")
    packet = await (await pending.value).json()
    viewer = 'public' if public else 'owner'
    if not isinstance(packet, dict) or (packet.get('viewer') or {}).get('kind') != viewer:
        raise ValueError("入口实际返回的受众与所选版本不符")
    return viewer


async def scan(args):
    base = args.base_url.rstrip("/")
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="chrome", headless=True)
        contexts = {role: await browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="no-preference", service_workers="block")
                    for role in ("本人版", "公开版")}
        # Start the clean visitor window in the site's existing public view before any Live request.
        await contexts["公开版"].add_init_script(f"if (location.origin === {json.dumps(base)}) sessionStorage.setItem('wly-live-view','public')")
        for context in contexts.values():
            await context.route("**/*", lambda r: r.abort() if r.request.method not in {"GET", "HEAD"}
                                or urlsplit(r.request.url).path.endswith("/visitor-beacon.js")
                                or r.request.is_navigation_request() and urlsplit(r.request.url).netloc != urlsplit(base).netloc
                                else r.continue_())
        urls = set(map(route_of, args.page))
        if not urls:
            sitemap = await contexts["本人版"].request.get(base + "/sitemap.xml", timeout=15000, fail_on_status_code=True)
            urls = {route_of(e.text) for e in ElementTree.fromstring(await sitemap.body()).findall(".//{*}loc") if e.text}
        if not urls: raise ValueError("站点地图无页面")
        results = {}
        async def worker(role, index):
            paths = sorted(urls)[index::args.workers]
            page = await contexts[role].new_page()
            try:
                viewer = await verified_view(page, base, role)
                for path in paths:
                    results[role, path] = await snapshot(page, base, path, role, args.hide_limit / 100, viewer)
                    print(role, path, file=sys.stderr, flush=True)
            except (Error, ValueError) as exc:
                for path in paths: results.setdefault((role, path), dict(path=path, role=role, issues=[], coverage=str(exc).splitlines()[0]))
            finally:
                await page.close()
        jobs = lambda: (worker(role, i) for role in ("本人版", "公开版") for i in range(args.workers))
        await asyncio.gather(*jobs())
        detail = lambda s: urlsplit(s).path in {"/live/chat/", "/live/item/", "/live/task/", "/live/issue/", "/live/backup/", "/live/project/"}
        more = {route_of(href) for r in results.values() for href in r.pop("links", [])
                if urlsplit(href).netloc == urlsplit(base).netloc and (not urlsplit(href).query or args.details and detail(href))
                and urlsplit(href).path.endswith(("/", ".html"))} - urls
        if not args.page and (urls := more): await asyncio.gather(*jobs())
        for (role, _), r in results.items():
            r.pop("links", None)
            for step in r.get("progress", []):
                target = results.get((role, route_of(step["href"]))) if step.get("href") else None
                n = max(step["steps"], target.get("plan", 0) if target else 0)
                if n < step["expected"]:
                    where = "详情未完整读出" if target and target.get("coverage") else "点开后" if step.get("attempted") else "本页和已扫详情"
                    r["issues"].append(dict(kind="进度没有可见步骤", text=step["raw"], entry=step["label"],
                        reason=f"{where}：标了 {step['expected']} 步，只看到 {n} 步正文"))
        await browser.close()
    rows = sorted(results.values(), key=lambda r: (r["path"], r["role"]))
    compare(rows)
    compare_rewrites(rows)
    for row in rows: row["issues"] = list({json.dumps(i, ensure_ascii=False): i for i in row["issues"]}.values())
    return rows
if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("base_url", help="Preview origin, including http(s) scheme")
    cli.add_argument("--page", action="append", default=[], help="Repeat for specific paths; otherwise crawl sitemap + links")
    cli.add_argument("--details", action="store_true", help="Also visit visible per-record live links")
    cli.add_argument("--hide-limit", type=float, default=20, help="Report public pages above this percentage")
    cli.add_argument("--workers", type=int, choices=range(1, 5), default=2, help="Tabs per role")
    opts = cli.parse_args()
    if not 0 <= opts.hide_limit <= 100 or urlsplit(opts.base_url).scheme not in ("http", "https"):
        cli.error("Use an http(s) origin and a hide limit from 0 to 100")
    rows = asyncio.run(scan(opts))
    print(json.dumps(dict(at=datetime.now(timezone.utc).isoformat(), hide_limit=opts.hide_limit, pages=rows), ensure_ascii=False, indent=2))
    sys.exit(2 if any(row.get("coverage") for row in rows) else 0)

"""Click through a local build with just synthetic public and owner packets."""
from datetime import datetime, timedelta, timezone
from contextlib import nullcontext
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
from threading import Thread
from urllib.parse import parse_qs, urlsplit
from playwright.sync_api import expect, sync_playwright

PREVIEW = sys.argv[1] if sys.argv[1].startswith(('http://127.0.0.1:', 'http://localhost:')) else None
DIST = Path(sys.argv[1]).resolve(strict=True) if not PREVIEW else None
expect.set_options(timeout=20000)
CHROME = Path('C:/Program Files/Google/Chrome/Application/chrome.exe')
AT = datetime.now(timezone.utc).isoformat()
NEXT = (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
WINDOWS = {'id': 'backup', 'name': '夹具 Windows 备份', 'group': 'backup', 'source_readable': False, 'state': 'unknown'}
PICKUPS = [{'id': f'pickup-{i}', 'name': f'夹具动作{i}', 'automation_group': 'ai-pickup', 'trigger_text': '验收信号',
            'today_runs': n, 'today_runs_q': q, 'runs_at': AT, 'last': {'end': AT, 'result': 'ok'}, 'recent': [{'end': AT, 'result': 'ok'}]}
           for i, (n, q) in enumerate([(0, 'ok'), (69, 'partial'), (99, 'unknown')])]
SCHEDULE = {'id': 'schedule', 'name': '夹具 Codex 日程', 'automation_group': 'ai-schedule', 'scheduler': 'codex', 'schedule': '每日 23:00',
            'state': 'paused', 'last': {'start': AT, 'result': 'failed'}, 'recent': [{'start': AT, 'result': 'failed'}], 'next_at': None}
SCHEDULES = [SCHEDULE] + [dict(SCHEDULE, id=f'schedule-{i}', name=f'平台日程{i}', state='active', next_at=NEXT) for i in range(5)]

def packet(path, query, audience, old, maintenance):
    scope = query.get('scope', [''])[0]
    items = [dict(item) for item in PICKUPS]
    if audience == 'owner':
        items[0]['name'] = {'text': '夹具本人动作', 'visibility': 'owner'}
    if path == '/__live/home':
        return {'tasks': {'ran': 1, 'issues': 0}, 'screen': {'maintenance': 69, 'maintenance_q': 'ok'}}
    if path.startswith('/__live/tasks/'):
        return {**SCHEDULE, 'at': AT}
    if scope == 'ai-today':
        if maintenance in {'missing', 'zero'}:
            n = 0 if maintenance == 'zero' else None
            return {'total': n, 'maintenance_rounds': n, 'q': 'ok' if n == 0 else 'partial', 'items': []}
        return {**({'total': 69} if old else {'total': 69, 'maintenance_rounds': 69, 'q': 'partial', 'missing_sources': ['部分回执未读到']}),
                'items': [dict(t, rounds=n) for t, n in zip(items, [13, 56])]}
    if old:
        return {'total': 183, 'items': [WINDOWS, SCHEDULE], 'groups': [{'id': 'backup', 'items': [WINDOWS]}, {'id': 'ai-schedule', 'total': 1, 'items': [SCHEDULE]}]}
    if scope == 'scheduled':
        return {'total': 1, 'readable_total': 0, 'unreadable_total': 1, 'items': [WINDOWS],
                'groups': [{'id': 'backup', 'total': 1, 'items': [WINDOWS]}], 'changes7': None}
    return {'items': [WINDOWS, *items, *SCHEDULES],
            'automation_activity': {'today_runs': 70, 'today_runs_q': 'partial', 'at': AT,
                'recent': [{'id': 'done-once', 'name': '已退出清单的一次任务', 'start': AT, 'result': 'ok'},
                           {'id': SCHEDULE['id'], 'name': SCHEDULE['name'], 'start': AT, 'result': 'failed'}]},
            'groups': [
        {'id': 'ai-pickup', 'total': 3, 'items': items},
        {'id': 'ai-schedule', 'total': None, 'known_total': 6, 'gap': '部分平台日程还没读到', 'items': SCHEDULES},
    ]} if scope == 'automation' else {'items': []}


service = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=DIST)) if DIST else nullcontext()
with service as server, sync_playwright() as pw:
    origin = PREVIEW or f'http://127.0.0.1:{server.server_port}'
    if server: Thread(target=server.serve_forever, daemon=True).start()
    browser = pw.chromium.launch(executable_path=CHROME, headless=True, args=['--no-proxy-server'])
    for audience, old in [('public', False), ('owner', False), ('public', True)]:
        errors, writes, maintenance = [], [], 'positive'
        context = browser.new_context(viewport={'width': 1440, 'height': 900}, service_workers='block')

        def local(route):
            url = urlsplit(route.request.url)
            if not route.request.url.startswith(origin + '/') or route.request.method != 'GET':
                if route.request.method != 'GET' and url.path.startswith(('/__live/', '/__computer/')): writes.append(url.path)
                route.abort()
            elif url.path.startswith('/__live/'):
                route.fulfill(json={'seq': {'positive': 1, 'missing': 2, 'zero': 3}[maintenance], 'rev': f'task-test-{maintenance}', 'at': AT, 'now': AT, 'viewer': {'kind': audience},
                                    'data': packet(url.path, parse_qs(url.query), audience, old, maintenance)})
            else:
                route.continue_()

        context.route('**/*', local)
        page = context.new_page()
        page.on('pageerror', lambda e: errors.append((page.url, str(e))))
        page.goto(origin + '/', wait_until='domcontentloaded')
        for label, path in [('实时状态', '/live/'), ('它如何工作', '/principles/')]:
            entry = page.get_by_role('link', name=label, exact=True)
            expect(entry).to_be_visible()
            expect(entry).to_have_attribute('href', path)
        for label in ('计划任务', '自动任务'):
            expect(page.get_by_role('link', name=label, exact=True, include_hidden=True)).to_have_count(0)
        destinations = [('#tasks', '计划任务', '/live/tasks/'), ('#automation', '自动任务', '/live/automation/')]
        for card, label, path in destinations:
            page.goto(origin + '/live/', wait_until='domcontentloaded')
            page.locator(f'{card} [data-part="head"] a').filter(has_text=label).click()
            expect(page).to_have_url(origin + path)
            expect(page.get_by_role('heading', name=label, exact=True)).to_be_visible()
            text = ('不能单独核对' if old else '登记 1 项') if label == '计划任务' else ('AI 自动任务分组还没读到' if old else '部分平台日程还没读到')
            expect(page.get_by_text(text, exact=False).and_(page.locator(':visible')).first).to_be_visible()
            assert page.get_by_role('link', name='夹具 Windows 备份', exact=True).count() == int(label == '计划任务' and not old)
            if label == '计划任务' and not old:
                expect(page.locator('#changes')).to_contain_text('任务变更记录没读到')
                expect(page.locator('.task-compact [data-state="unknown"]').first).to_be_visible()
            if len(sys.argv) > 2 and not old: page.screenshot(path=Path(sys.argv[2]) / f'{audience}-{path.split("/")[2]}.png')
        if not old:
            assert '至少 69 次' in page.locator('#groups').inner_text() and '99 次' not in page.locator('#groups').inner_text()
            assert all(word in page.locator('#groups').inner_text() for word in ['0 次', '结束', '每日 23:00'])
            expect(page.locator('#recent')).to_contain_text('没跑成')
            expect(page.locator('#stats dd')).to_have_count(4)
            expect(page.locator('#stats dd').nth(1)).to_have_text('至少 70')
            expect(page.locator('#stats dd').nth(2)).to_have_text('至少 5')
            expect(page.locator('#recent')).to_contain_text('已退出清单的一次任务')
            expect(page.locator('#groups')).not_to_contain_text('已退出清单的一次任务')
            expect(page.locator('#groups')).not_to_contain_text('夹具 Codex 日程')
            page.get_by_role('button', name='展开（还有 1 项）').click()
            expect(page.get_by_role('link', name='平台日程4', exact=True)).to_be_visible()
            assert ('夹具本人动作' in page.locator('#groups').inner_text()) == (audience == 'owner')
            page.locator('#recent').get_by_role('link', name='夹具 Codex 日程', exact=True).click()
            expect(page.locator('[data-back]')).to_have_text('自动任务')
        page.goto(origin + '/live/tasks/?scope=ai-today', wait_until='domcontentloaded')
        expect(page.locator('#head')).to_contain_text('69 次')
        assert '种动作' not in page.locator('#head').inner_text() and '已读到 2 种' in page.locator('#groups').inner_text()
        for maintenance, headline, empty in [('missing', '维护记录未读到', '还没读到维护明细'), ('zero', '已观察到 0 次', '今天没有 AI 后台自动维护')]:
            page.reload(wait_until='domcontentloaded')
            expect(page.locator('#head')).to_contain_text(headline); expect(page.locator('#task-empty')).to_have_text(empty)
        assert not errors and not writes, (errors, writes)
        print(f'{audience} {"R20" if old else "R21"}: 保留两条入口、任务归类、次数与缺口通过，0 写请求、0 页面异常')
        context.close()
    browser.close()
    if server: server.shutdown()

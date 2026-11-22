"""Exercise month usage with fictional data through the page's normal entry."""
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
from threading import Thread
from urllib.parse import parse_qs, urlsplit
from playwright.sync_api import expect, sync_playwright

SOURCE = Path(sys.argv[1] if len(sys.argv) > 1 else 'site-v2').resolve(strict=True)
AT = datetime.now(timezone.utc).isoformat()
DAYS = [{'day': '2025-11-30', 'active': 86400}, {'day': '2026-06-07', 'active': 3600}, {'day': '2026-06-08', 'active': None, 'q': 'unknown'},
        {'day': '2026-06-09', 'active': 0}, {'day': '2026-06-10', 'active': 120, 'q': 'partial'}]


class QuietStatic(SimpleHTTPRequestHandler):
    def log_message(self, *_): pass


with ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietStatic, directory=SOURCE)) as server, sync_playwright() as pw:
    Thread(target=server.serve_forever, daemon=True).start()
    origin = f'http://127.0.0.1:{server.server_port}'
    browser = pw.chromium.launch(channel='msedge',
                                 headless=True, args=['--no-proxy-server'])
    for viewer, total, width in [('owner', 1241, 1440), ('public', 151, 390)]:
        page = browser.new_page(viewport={'width': width, 'height': 900}, is_mobile=width < 500, has_touch=width < 500)
        requests = {'first_month': 0, 'expired': 0}

        def local(route):
            if not route.request.url.startswith(origin + '/') or route.request.method != 'GET':
                return route.abort()
            url = urlsplit(route.request.url)
            if not url.path.startswith('/__live/'):
                return route.continue_()
            params = parse_qs(url.query)
            month = params.get('range') == ['30d']
            cursor = params.get('cursor',[None])[0]
            if cursor == 'expired':
                requests['expired'] += 1
                return route.fulfill(status=400, json={'error':'live_invalid_cursor'})
            offset = int(cursor or 0)
            count = min(405 - offset, int(params.get('limit',[5])[0]))
            next_cursor = str(offset + count) if offset + count < 405 else None
            if not cursor and month:
                requests['first_month'] += 1
                if requests['first_month'] == 1: next_cursor = 'expired'
            foreground = {'recent': [{'app': f'测试前台 {i}', 'at': AT, 'seconds': 4} for i in range(offset, offset+count)],
                          'recent_page': {'total': 405, 'has_more': next_cursor is not None, 'next_cursor': next_cursor}}
            data = {'window': {'label': '近一个月' if month else '近 72 小时', 'from': '2026-05-11T00:00:00+08:00', 'to': AT},
                    'year': {'calendar_from': '2025-12-01', 'calendar_to': '2026-06-10', 'days': DAYS}, 'summary': {'active': 3600},
                    'titles': [{'app': '测试程序', 'title': f'测试窗口 {i}', 'seconds': total - i} for i in range(total if month else 5)]}
            data.update(foreground)
            route.fulfill(json={'data': data, 'viewer': {'kind': viewer}, 'at': AT, 'now': AT,
                                'link': {'seen': AT}, 'seq': 1, 'rev': 'usage-test', 'stale_after': 300})

        page.route('**/*', local)
        page.goto(origin + '/live/usage/', wait_until='domcontentloaded')
        page.get_by_role('button', name='近一个月').click()
        expect(page.locator('[data-part=head]')).to_contain_text('近一个月')
        cal = page.locator('[data-key=year]')
        expect(cal.locator('.grp__name')).to_have_text('6 月起')
        expect(cal.locator('[data-day="2025-11-30"]')).to_have_count(0)
        expect(cal.locator('[data-day="2026-05-31"]')).to_have_count(0)
        expect(cal.locator('[data-day="2026-06-01"]')).to_have_class('vz-cal__dot is-none')
        expect(cal.locator('[data-day="2026-06-11"]')).to_have_count(0)
        expect(cal.locator('[data-x=total]')).to_contain_text('至少 1')
        expect(cal.locator('[data-day="2026-06-08"]')).to_have_class('vz-cal__dot is-none')
        expect(cal.locator('[data-day="2026-06-09"]')).to_have_class('vz-cal__dot is-zero')
        cal.locator('[data-day="2026-06-10"]').dispatch_event('pointerover')
        expect(cal.locator('.vz-tip')).to_contain_text('至少')
        titles = page.locator('[data-x=titles]')
        rows = titles.locator('.vz-rank__row[data-key]')
        expect(rows).to_have_count(24)
        titles.get_by_role('button', name='展开（还有').click()
        next_rows = titles.get_by_role('button', name='再显示')
        for _ in range((total - 25) // 100):
            next_rows.click()
        expect(rows).to_have_count(total)
        assert len(set(rows.evaluate_all('nodes => nodes.map(node => node.dataset.key)'))) == total
        foreground = page.locator('[data-x=recent]')
        foreground.get_by_role('button', name='展开').click()
        expect(foreground.locator('.vz-rank__row')).to_have_count(205)
        expect(page.locator('[data-x=rcount]')).to_contain_text('已从最新一条重新显示')
        assert requests['expired'] == 1 and requests['first_month'] == 2, requests
        foreground.get_by_role('button', name='再显示').click()
        expect(foreground.locator('.vz-rank__row')).to_have_count(405)
        assert len(set(foreground.locator('[data-key]').evaluate_all('nodes => nodes.map(node => node.dataset.key)'))) == 405
        expect(page.get_by_text('连续专注和切窗口')).to_have_count(0)
        print(f'{viewer} {width}px: 405 rows after one expired cursor; no switch row')
        page.close()
    browser.close()
    server.shutdown()

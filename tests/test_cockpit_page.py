"""Real installed Chrome checks of the compact cockpit; all status/actions are fictional."""
import importlib.util
import json
import os
from pathlib import Path
import re, hashlib, mimetypes
import time
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('COCKPIT_PAGE_QA_ROOT', 'E:/Cache/Codex/Temp/cockpit-page-20261007'))


def load_module(name, relative):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module


def fixture():
    now = time.time(); stamp = __import__('datetime').datetime.fromtimestamp(now, __import__('datetime').timezone.utc).isoformat()
    block = lambda items: {'state': 'ok', 'items': items, 'observed_at': stamp, 'max_age_seconds': 120}
    tasks = [{'id': 'test-task', 'project': '测试项目', 'enabled': True, 'state': 'success', 'mine': True, 'runs_today': True,
        'last_run_at': stamp, 'next_run_at': stamp, 'plain': {'name': '测试任务', 'what': '测试工作', 'stop': '测试停止入口', 'impact': '测试停止影响'}}]
    ids = ['computer_health', 'disk_space', 'traffic', 'remote', 'backups', 'drive_upload', 'aliyun_billing', 'today_changes']
    texts = ['电脑正常：不热不忙', '最紧的 C 盘还剩 15.5%', '套餐已用 20 / 100 GB，剩余 80 GB，10月31日重置，预计20天', '人不在也连得上', '备份都在期限内', '没在传，上次传完照片视频', '余额尚未读到', '今天 2 个项目有代码变化']
    cards = [{'id': key, 'display': {'text': text, 'state': 'ok', 'observed_at': stamp}} for key, text in zip(ids, texts)]
    need = [{'id': str(i), 'title': f'测试要求 {i}', 'action': {'where': None, 'href': None, 'due_at': None, 'due_text': '下次用时' if i == 0 else None, 'consequence': None, 'estimated_minutes': None}} for i in range(5)]
    return {'status': 'ok', 'observed_at_unix': now, 'served_at_unix': now, 'max_age_seconds': 120, 'state_version': 'fixture', 'default_minutes': 480,
        'host': {'screen_state': 'unlocked', 'observed_at_unix': now}, 'personal_data': {'state': 'unlocked', 'expires_at_unix': now + 3600}, 'unrestricted': {'state': 'inactive'},
        'factor': {'available': True}, 'public_actions': {'lock_data': False, 'end_unrestricted': False, 'lock_windows': False},
        'grafana': {'state': 'online', 'public_dashboard_state': 'reachable', 'public_dashboard_url': 'https://grafana.wly0829.cn/public-dashboards/' + 'a' * 32, 'public_dashboard_checked_at': stamp,
            'groups': {key: {'state': 'reachable', 'checked_at': stamp, 'url': 'https://grafana.wly0829.cn/public-dashboards/' + 'a' * 32} for key in ['cpu-gpu', 'memory-network']}},
        'automation': block(tasks), 'backups': block([]), 'pending': block([]), 'projects': block([]), 'today': block([]), 'remote_network': block([]),
        'cockpit': {'schema': 'pcconfig.cockpit.v1', 'observed_at': stamp, 'overall': {'state': 'warn', 'summary': '有 5 件事要你做（旧字段）'}, 'summary': {'text': '有 5 件事要你做'}, 'cards': cards, 'need_you': need,
            'know': [{'id': 'gap', 'kind': 'source_gap', 'source_id': 'test-source', 'title': '测试来源超过十分钟读不到'}], 'ai_following': {'count': 2}, 'source_gaps': [],
            'today_events': [{'id': 'backup', 'title': '今天 3 项备份完成'}], 'today_changes': {'deployment_verified': False, 'evidence': 'git_commits', 'commits': 2}}}

class CockpitPageTests(unittest.TestCase):
    def test_phone_and_desktop(self):
        from playwright.sync_api import sync_playwright
        OUT.mkdir(parents=True, exist_ok=True)
        os.environ['TEMP'] = os.environ['TMP'] = os.environ['TMPDIR'] = str(OUT)
        html = (ROOT / 'site-release/cockpit/index.html').read_text('utf8')
        titles, _ = load_module('cp_titles', 'scripts/prepare-live-ui.py').cockpit_title_inputs(ROOT / 'sources/assets/_library')
        data_match = re.search(r'(<script[^>]+id="page-data"[^>]*>)(.*?)(</script>)', html, re.S); data = json.loads(data_match[2])
        data.setdefault('shared', {})['cockpit_titles'] = {screen: {'src': f'/__test-title/{screen}.png', 'size': row['size'], 'title': [0, 0, 1, 1]} for screen, row in titles.items()}
        html = html[:data_match.start()] + data_match[1] + json.dumps(data, ensure_ascii=False) + data_match[3] + html[data_match.end():]
        html = re.sub(r'(<script[^>]*src=")[^"]*b2-typeset-[a-f0-9]+\.js', r'\1https://wly0829.cn/__test-b2.js', html, count=1)
        html = html.replace('</head>', '<link rel="stylesheet" href="https://wly0829.cn/__test-cp.css"></head>', 1)
        update = load_module('cp_update', 'scripts/update-live-release.py')
        river = load_module('cp_river', 'scripts/prepare-today-river.py')
        runtime = river.patch_runtime(update.patch_b2_runtime("from '/__b2-access-model.js'"))
        errors, writes, results = [], [], []
        state = {'value': fixture(), 'reads': 0}
        with sync_playwright() as pw:
            for width in [390, 1440]:
                state['value'] = fixture()
                context = pw.chromium.launch_persistent_context(str(OUT / f'profile-{width}'), executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True,
                    viewport={'width': width, 'height': 915 if width == 390 else 1000}, timezone_id='Asia/Shanghai')
                def route(r):
                    request = r.request; url = urlsplit(request.url)
                    if request.method not in ['GET', 'HEAD']:
                        body = request.post_data_json; writes.append({'path': url.path, 'body': body})
                        if url.path.endswith('/requests'): return r.fulfill(json={'state': 'pending', 'request_id': body['request_id'], 'csrf_token': 'fictional-only'})
                        if url.path.endswith('/verify'): return r.fulfill(json={'state': 'succeeded', 'request_id': url.path.split('/')[-2]})
                        return r.abort()
                    if url.hostname in ['live.wly0829.cn', 'mcp.wly0829.cn'] and ('/status' in url.path or url.path.endswith('/state')):
                        state['reads'] += 1; return r.fulfill(json=state['value'])
                    if url.path == '/cockpit/': return r.fulfill(body=html, content_type='text/html')
                    if url.path == '/__test-b2.js': return r.fulfill(body=runtime, content_type='text/javascript')
                    if url.path == '/__b2-access-model.js': return r.fulfill(body=(ROOT / 'app/computer-access-model.js').read_bytes(), content_type='text/javascript')
                    if url.path == '/__test-cp.css': return r.fulfill(body=(ROOT / 'scripts/b2-live.css').read_bytes(), content_type='text/css')
                    if url.path.startswith('/__test-title/'): return r.fulfill(body=titles[Path(url.path).stem]['path'].read_bytes(), content_type='image/png')
                    if url.hostname == 'grafana.wly0829.cn': return r.fulfill(body='<html lang="zh-CN"><body>虚构曲线</body></html>', content_type='text/html')
                    cached = OUT / 'preview-cache' / (hashlib.sha256(request.url.encode()).hexdigest() + Path(url.path).suffix)
                    if cached.is_file():
                        body = cached.read_bytes()
                        if Path(url.path).name.startswith('app-'): body = update.patch_shared_runtime(body.decode('utf8')).encode('utf8')
                        return r.fulfill(body=body, content_type=mimetypes.guess_type(url.path)[0] or 'application/octet-stream')
                    return r.continue_()
                context.route('**/*', route)
                page = context.pages[0]; page.on('pageerror', lambda error: errors.append(str(error)))
                page.goto('https://wly0829.cn/cockpit/', wait_until='domcontentloaded')
                page.locator('.cp-headline').filter(has_text='5 件事').wait_for(timeout=60000)
                page.wait_for_function("[...document.querySelectorAll('.cp-title-crop img')].every(e=>e.complete&&e.naturalWidth>0)", timeout=90000)
                self.assertEqual(page.locator('.cp-section .cp-title-crop img').count(), 6); self.assertEqual(page.locator('.cp-title-pending').count(), 0)
                self.assertEqual(page.locator('.cp-action-card').count(), 5)
                self.assertEqual(page.locator('.cp-headline').inner_text(), '有 5 件事要你做')
                self.assertIn('下次用时', page.locator('.cp-action-card').first.inner_text()); self.assertNotIn('期限未登记', page.locator('.cp-action-card').first.inner_text())
                self.assertEqual(page.locator('.cp-details iframe').count(), 0)
                self.assertFalse(page.evaluate('document.documentElement.scrollWidth>innerWidth'))
                self.assertIn('尚未读到发布记录', page.locator('.cp-changes').inner_text())
                self.assertIn('今天 3 项备份完成', page.locator('.cp-events').inner_text())
                self.assertIn('今天纠正：未统计；近7天：未统计', page.locator('.cp-basis').inner_text())
                state['value']['cockpit']['owner_corrections'] = {'status': 'pass', 'total': 0, 'history': [], 'text': '今天纠正：0；近7天：未统计'}; page.evaluate('SiteB2.refresh()'); page.locator('.cp-basis').filter(has_text='今天纠正：0；').wait_for()
                page.wait_for_function('window.todayRiver?.gl||document.querySelector("#today-river #stage")?.classList.contains("nogl")', timeout=60000)
                page.evaluate('todayRiver.seek(12)')
                page.screenshot(path=str(OUT / f'cockpit-{width}.png'), full_page=True)
                traffic = next(card for card in state['value']['cockpit']['cards'] if card['id'] == 'traffic'); original_traffic = traffic['display'].copy()
                for text, mode, age in [('套餐已用 20 / 100 GB，剩余 80 GB，10月31日重置，预计20天', 'ok', 10800), ('套餐读不到：没有提供套餐读数', 'unknown', 0), ('套餐缓存已用 20 / 100 GB，剩余 80 GB', 'stale', 90000)]:
                    observed = __import__('datetime').datetime.fromtimestamp(time.time() - age, __import__('datetime').timezone.utc).isoformat()
                    state['value']['automation']['items'][0]['traffic'] = {'package': {'status': 'unknown' if mode == 'unknown' else 'ok', 'used_gb': None if mode == 'unknown' else 20, 'total_gb': 100, 'remaining_gb': 80, 'updated_at_beijing': observed, 'stale': mode == 'stale'}, 'primary_metric': 'package.used_gb', 'today_gb': 3, 'srum': {'status': '已读取', 'updated_at_beijing': observed, 'today': {'upload_gb': 1, 'download_gb': 2, 'top': []}}}
                    traffic['display'] = {'text': text, 'state': mode, 'observed_at': observed}; state['value']['cockpit']['observed_at'] = observed; page.evaluate('SiteB2.refresh()')
                    row = page.locator('#cp-computer .cp-line').filter(has_text=text); row.wait_for(); self.assertEqual(row.get_attribute('data-state'), mode); self.assertNotIn('已用 3 GB', row.inner_text())
                    self.assertEqual(page.locator('.cp-action-card').count(), 5); self.assertEqual(page.locator('.cp-headline').inner_text(), '有 5 件事要你做')
                    if mode == 'stale': self.assertIn('这是 ', row.inner_text()); self.assertIn(' 的数', row.inner_text())
                traffic['display'] = original_traffic
                for position in ['middle', 'bottom']:
                    page.evaluate('(p)=>scrollTo({top:p==="middle"?document.documentElement.scrollHeight*.5:document.documentElement.scrollHeight,behavior:"instant"})', position)
                    rect = page.locator('.cp-refresh').bounding_box(); self.assertTrue(0 <= rect['y'] < 900); self.assertEqual(round(rect['width']), 44); self.assertEqual(round(rect['height']), 44)
                    self.assertTrue(page.locator('.cp-refresh').evaluate('e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e}'))
                    reads = state['reads']; page.locator('.cp-refresh').click(); page.wait_for_function('document.querySelector(".cp-refresh").getAttribute("aria-busy")==="false"'); self.assertGreater(state['reads'], reads)
                page.get_by_role('button', name='办理', exact=True).scroll_into_view_if_needed(); before = page.evaluate('scrollY')
                page.get_by_role('button', name='办理', exact=True).click()
                panel = page.locator('.cp-panel'); page.locator('#cp-hours').fill('2.5'); page.locator('#cp-code').fill('0' * 6)
                page.evaluate('window.cpOriginalPanel=document.querySelector(".cp-panel");window.cpOriginalFactor=document.querySelector("#cp-code")')
                for _ in range(5):
                    old = state['reads']; page.evaluate('SiteB2.refresh()'); page.wait_for_function('document.querySelector(".cp-refresh").getAttribute("aria-busy")==="false"')
                    self.assertGreater(state['reads'], old)
                self.assertTrue(page.evaluate('cpOriginalPanel===document.querySelector(".cp-panel")&&cpOriginalFactor===document.querySelector("#cp-code")'))
                self.assertEqual(page.locator('#cp-hours').input_value(), '2.5'); self.assertEqual(page.locator('#cp-code').input_value(), '0' * 6)
                self.assertEqual(page.evaluate('scrollY'), before)
                self.assertEqual(round(panel.bounding_box()['width']), 390 if width == 390 else 420)
                page.screenshot(path=str(OUT / f'panel-{width}.png'))
                page.get_by_role('button', name='两项一起', exact=True).click(); page.locator('.cp-primary').click()
                page.wait_for_function('document.querySelector("#cp-code").value===""')
                page.get_by_role('button', name='关闭办理面板', exact=True).click()
                self.assertEqual(page.evaluate('scrollY'), before)
                page.locator('.cp-details>summary').click()
                page.locator('.cp-original [data-b2-slot=cockpit-tasks]').first.filter(has_text='测试任务').wait_for(timeout=30000)
                self.assertIn('测试停止入口', page.locator('.cp-original').text_content())
                page.locator('.cp-details iframe').first.wait_for(state='attached')
                old = state['value']; state['value'] = {key: value for key, value in old.items() if key != 'cockpit'}
                page.evaluate('SiteB2.refresh()'); page.locator('.cp-headline').filter(has_text='结论正在读取').wait_for()
                self.assertEqual(page.locator('.cp-lamp').get_attribute('data-state'), 'unknown')
                state['value'] = old
                for _ in range(5):
                    page.reload(wait_until='domcontentloaded'); page.locator('.cp-headline').filter(has_text='5 件事').wait_for(timeout=60000)
                    page.wait_for_function('window.todayRiver?.model?.tasks.length>0'); self.assertGreater(page.locator('#today-river .boat').count(), 0)
                results.append({'width': width, 'panel_preserved': True, 'overflow': False, 'refreshes': 5, 'reloads_with_boats': 5, 'titles_loaded': 6, 'lazy_charts': True})
                context.close()
        self.assertEqual(errors, [])
        grants = [item for item in writes if item['path'].endswith('/requests')]
        self.assertEqual(len(grants), 2); self.assertTrue(all(item['body']['combined'] is True and item['body']['purpose'] == 'personal_data' for item in grants))
        (OUT / 'receipt.json').write_text(json.dumps({'results': results, 'page_errors': errors, 'fictional_post_count': len(writes), 'real_actions': 0}, ensure_ascii=False, indent=2), encoding='utf8')


if __name__ == '__main__': unittest.main()

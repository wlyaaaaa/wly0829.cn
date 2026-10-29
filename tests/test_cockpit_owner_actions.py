"""驾驶舱本人设备上的按钮：浏览器里跑现行 client.js，提交和撤回接口用模拟回执；数据和钥匙都是虚构的，只在 127.0.0.1 上跑。"""
from datetime import datetime, timedelta, timezone
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location('cockpit_native_harness', ROOT / 'tests' / 'cockpit_native_harness.py')
h = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(h)

ACTIONS = 'https://mcp.wly0829.cn/computer-access/api/cockpit/actions'
TOKEN = 'T' * 30 + '-abc_def12345'
CORS = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Cockpit-Device', 'Access-Control-Allow-Methods': 'POST', 'Cache-Control': 'no-store'}


def card(i, oa, **extra):
    return {'id': i, 'title': '示例事项 ' + i, 'headline': '示例事项 ' + i, 'ask_kind': 'action', 'owner_actions': oa, 'item_version': 'v-' + i, **extra}


def owner_view():
    return h.view(viewer={'kind': 'owner', 'device_state': 'ok', 'device_name': '示例设备'}, private_count=0, need_you=[
        card('n-done', ['note', 'done']),
        card('n-undo', ['done']),
        card('n-short', ['done']),
        card('n-retry', ['done']),
        card('n-changed', ['done']),
        card('n-fast', ['done']),
        card('n-gpt', ['done']),
        card('n-answer', ['answer'], ask_kind='decision', options=['先上', '一起上']),
        card('n-note', ['note']),
        card('n-snooze', ['snooze']),
    ], ai_running={'count': 1, 'stuck_count': 1, 'observed_at': h.ago(seconds=10), 'rows': [
        {'id': 'run-1', 'status': 'quota_exhausted', 'vendor': 'gpt', 'executor': 'gpt', 'title': '示例卡住的活', 'owner_actions': ['switch'], 'item_version': 'v-run'}]})


class CockpitOwnerActionsTests(unittest.TestCase):
    def test_click_submit_undo_and_errors(self):
        from playwright.sync_api import sync_playwright
        server = h.StatusServer()
        server.default = (200, owner_view(), 0)
        server.pages['/cockpit/'] = h.document(h.view())
        posts, errors, aborted = [], [], set()

        def fulfil(route):
            req = route.request
            if req.method == 'OPTIONS':
                return route.fulfill(status=204, headers=CORS)
            body = json.loads(req.post_data or '{}')
            posts.append({'url': req.url, 'device': req.headers.get('x-cockpit-device'), 'type': req.headers.get('content-type'), 'body': body})
            reply = lambda status, data: route.fulfill(status=status, headers=CORS, content_type='application/json', body=json.dumps(data, ensure_ascii=False))
            if req.url.endswith('/undo'):
                return reply(200, {'id': req.url.split('/')[-2], 'status': 'undone', 'message': '已撤回'})
            item = body.get('item_id')
            if item == 'n-retry' and item not in aborted:
                aborted.add(item)
                return route.abort('connectionreset')
            if item == 'n-changed':
                return reply(409, {'error': 'cockpit_item_changed', 'message': '这条刚更新过，请刷新后再点'})
            if item == 'n-fast':
                return reply(429, {'error': 'rate_limited', 'message': 'too many'})
            now = datetime.now(timezone.utc)
            until = now + (timedelta(seconds=2) if item == 'n-short' else timedelta(seconds=30))
            return reply(200, {'id': 'act-' + item, 'status': 'waiting_undo', 'created_at': h.iso(now), 'apply_at': h.iso(until), 'undo_until': h.iso(until), 'message': '已记录，30 秒内可以撤回'})

        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=h.CHROME, headless=True)
                context = browser.new_context(timezone_id='Asia/Shanghai')
                h.isolate(context)
                context.route(ACTIONS + '**', fulfil)
                context.add_init_script(f"try{{localStorage.setItem('wly-cockpit-device',{json.dumps(TOKEN)})}}catch{{}}")
                page = context.new_page()
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.goto(server.origin + '/cockpit/', wait_until='domcontentloaded')
                page.wait_for_selector('[data-oa="n-done"] [data-act="done"]', timeout=20000)
                box = lambda i: f'[data-oa="{i}"]'
                last = lambda: posts[-1]['body']

                # 办好了：连点两下只交一次；带钥匙、JSON、幂等键、条目版本、默认交给 Claude；卡片变灰，撤回倒数
                page.dblclick(box('n-done') + ' [data-act="done"]')
                page.wait_for_selector(box('n-done') + ' [data-undo]')
                done = [p for p in posts if p['body'].get('item_id') == 'n-done']
                self.assertEqual(len(done), 1)
                self.assertEqual(done[0]['device'], TOKEN)
                self.assertEqual(done[0]['type'], 'application/json')
                b = done[0]['body']
                self.assertRegex(b['idempotency_key'], r'^[A-Za-z0-9]{16,32}$')
                self.assertEqual({k: b[k] for k in ('item_id', 'action', 'executor', 'item_version')}, {'item_id': 'n-done', 'action': 'done', 'executor': 'claude', 'item_version': 'v-n-done'})
                self.assertIn('is-acted', page.get_attribute('#todo-n-done', 'class'))
                self.assertRegex(page.inner_text(box('n-done') + ' [data-left]'), r'^还剩 \d+ 秒$')

                # 撤回：POST …/<id>/undo，正文 {}；卡片回到能点的样子
                page.click(box('n-undo') + ' [data-act="done"]')
                page.click(box('n-undo') + ' [data-undo]')
                page.wait_for_selector(box('n-undo') + ' .cp-oa-note')
                self.assertTrue(posts[-1]['url'].endswith('/actions/act-n-undo/undo'))
                self.assertEqual(last(), {})
                self.assertEqual(page.inner_text(box('n-undo') + ' .cp-oa-note'), '已撤回')
                self.assertTrue(page.is_visible(box('n-undo') + ' [data-act="done"]'))

                # 撤回期过了：写“已交给 Claude（HH:MM）”
                page.click(box('n-short') + ' [data-act="done"]')
                page.wait_for_function(f"() => /已交给 Claude（\\d\\d:\\d\\d）/.test(document.querySelector('{box('n-short')}').innerText)", timeout=6000)

                # 网络断了一次：重试用同一个幂等键
                page.click(box('n-retry') + ' [data-act="done"]')
                page.wait_for_selector(box('n-retry') + ' [data-undo]', timeout=8000)
                keys = [p['body']['idempotency_key'] for p in posts if p['body'].get('item_id') == 'n-retry']
                self.assertEqual(len(keys), 2)
                self.assertEqual(len(set(keys)), 1)
                # 每次点击是新的键
                self.assertNotEqual(keys[0], b['idempotency_key'])

                # 409 条目变了：写中文说明 + “刷新”，点了重读数据
                page.click(box('n-changed') + ' [data-act="done"]')
                page.wait_for_selector(box('n-changed') + ' [data-oa-refresh]')
                self.assertIn('这条刚更新过，请刷新后再点', page.inner_text(box('n-changed') + ' .cp-oa-err'))
                reads = server.status_reads
                page.click(box('n-changed') + ' [data-oa-refresh]')
                page.wait_for_function(f'() => !document.querySelector(\'{box("n-changed")} .cp-oa-err\')')
                page.wait_for_timeout(500)
                self.assertGreater(server.status_reads, reads)

                # 429：点得太快了
                page.click(box('n-fast') + ' [data-act="done"]')
                page.wait_for_selector(box('n-fast') + ' .cp-oa-err')
                self.assertEqual(page.inner_text(box('n-fast') + ' .cp-oa-err'), '点得太快了，稍后再试')

                # 交给：Claude ▾ 点一下变 GPT，提交带 executor=gpt
                page.click(box('n-gpt') + ' [data-exec]')
                self.assertEqual(page.inner_text(box('n-gpt') + ' [data-exec]'), '交给：GPT ▾')
                page.click(box('n-gpt') + ' [data-act="done"]')
                page.wait_for_selector(box('n-gpt') + ' [data-undo]')
                self.assertEqual(last()['executor'], 'gpt')

                # 单题选项：题号 choice，值是原字符串，我的说明一起交
                self.assertTrue(page.is_disabled(box('n-answer') + ' [data-send="answer"]'))
                page.click(box('n-answer') + ' .cp-opt >> nth=1')
                page.fill(box('n-answer') + ' [data-qnote]', '示例说明')
                page.click(box('n-answer') + ' [data-send="answer"]')
                page.wait_for_selector(box('n-answer') + ' [data-undo]')
                self.assertEqual(last()['answers'], {'choice': {'value': '一起上', 'text': '示例说明'}})
                self.assertEqual(last()['action'], 'answer')

                # 回一句话：没写不能交，写了交 text
                page.click(box('n-note') + ' [data-act="note"]')
                self.assertTrue(page.is_disabled(box('n-note') + ' [data-send="note"]'))
                page.fill(box('n-note') + ' [data-text]', '示例一句话')
                page.click(box('n-note') + ' [data-send="note"]')
                page.wait_for_selector(box('n-note') + ' [data-undo]')
                self.assertEqual((last()['action'], last()['text'], last()['executor']), ('note', '示例一句话', 'claude'))

                # 晚点提醒：明早 9 点，不带 executor
                page.click(box('n-snooze') + ' [data-act="snooze"]')
                page.click(box('n-snooze') + ' [data-snooze="tomorrow_9"]')
                page.wait_for_selector(box('n-snooze') + ' [data-undo]')
                self.assertEqual((last()['action'], last()['until'], 'executor' in last()), ('snooze', 'tomorrow_9', False))

                # AI 正在跑卡住的行：改给另一家
                page.click(box('run-1') + ' [data-act="switch"]')
                page.wait_for_selector(box('run-1') + ' [data-undo]')
                self.assertEqual((last()['action'], last()['executor'], last()['item_version']), ('switch', 'claude', 'v-run'))
                context.close()
                browser.close()
        finally:
            server.close()
        self.assertEqual(errors, [])

    def test_public_view_has_no_owner_buttons(self):
        from playwright.sync_api import sync_playwright
        public = h.view(viewer={'kind': 'public', 'device_state': 'none', 'device_name': None}, private_count=0,
                        need_you=[{'id': 'n1', 'title': '示例公开事项：去办一下', 'ask_kind': 'action'}])
        server = h.StatusServer()
        server.default = (200, public, 0)
        server.pages['/cockpit/'] = h.document(h.view())
        posts = []
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=h.CHROME, headless=True)
                context = browser.new_context()
                h.isolate(context)
                context.route(ACTIONS + '**', lambda route: (posts.append(route.request.url), route.abort()))
                page = context.new_page()
                page.goto(server.origin + '/cockpit/', wait_until='domcontentloaded')
                page.wait_for_function("() => !document.querySelector('.cp-snap')", timeout=15000)
                page.wait_for_timeout(300)
                self.assertEqual(page.locator('[data-oa], .cp-oa-warn, #owner-recent').count(), 0)
                texts = page.locator('#top button, #need-you button').all_inner_texts()
                self.assertFalse(set(texts) & {'看见了', '知道了', '办好了', '不用了', '晚点提醒', '确认', '不对，重做', '回一句话', '撤回'})
                context.close()
                browser.close()
        finally:
            server.close()
        self.assertEqual(posts, [])


if __name__ == '__main__':
    unittest.main()

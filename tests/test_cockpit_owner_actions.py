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
        # “AI 在等你回”的新卡：答案送回原对话，不带交给谁
        card('n-wait', ['answer', 'delegate', 'unclear'], card_type='ai_wait', ask_kind='decision', conversation_title='示例对话', progress='示例做到一半',
             options=[{'value': 'A', 'text': '甲', 'recommended': True}, {'value': 'B', 'text': '乙'}]),
        card('n-unclear', ['unclear', 'done']),
    ], ai_running={'count': 1, 'stuck_count': 1, 'observed_at': h.ago(seconds=10), 'rows': [
        {'id': 'run-1', 'status': 'quota_exhausted', 'vendor': 'gpt', 'executor': 'gpt', 'title': '示例卡住的活', 'owner_actions': ['switch'], 'item_version': 'v-run'}]})


class CockpitOwnerActionsTests(unittest.TestCase):
    # test_click_submit_undo_and_errors 已删：它点的是已撤掉的“办完了 / 回一句话 / 没看懂”（done、note、unclear）和倒数“还剩 N 秒”。
    # 现行只有“知道了 / 晚点提醒 / 复制给 AI”，提交、撤回、失败恢复、410 自动重读由 tests/cockpit-owner-actions.test.mjs 覆盖。

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
                self.assertFalse(set(texts) & {'看见了', '知道了', '我办好了', '这件不做了', '晚点提醒', '确认', '不对，重做', '回一句话', '撤回', '你定就行', '我没看懂'})
                # 第三步：公开版一个能办事的按钮都没有（今天的河里的船是河自己的；电脑版顶栏的 ↻ 和队列的“一行一件 / 全部展开”只管看，不算）
                self.assertEqual(page.evaluate("[...document.querySelectorAll('.cp-page button')].filter(b => !b.closest('#today-river, .cp-tools, .cp-q-modes')).length"), 0)
                context.close()
                browser.close()
        finally:
            server.close()
        self.assertEqual(posts, [])


if __name__ == '__main__':
    unittest.main()

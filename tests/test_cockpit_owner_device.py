"""驾驶舱本人设备配对与钥匙：浏览器里跑现行 client.js；数据和钥匙都是虚构的，只在 127.0.0.1 上跑，配对接口用模拟响应。"""
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location('cockpit_native_harness', ROOT / 'tests' / 'cockpit_native_harness.py')
h = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(h)

PAIR = 'https://mcp.wly0829.cn/computer-access/api/cockpit-device/pair'
CODE = 'c' * 40 + '_-1'
TOKEN = 'T' * 30 + '-abc_def12345'
CORS = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Cache-Control': 'no-store'}


def owner_view(state='ok', kind='owner'):
    return h.view(viewer={'kind': kind, 'device_state': state, 'device_name': '示例设备' if kind == 'owner' else None}, private_count=1,
                  need_you=[{'id': 'n1', 'title': '示例私事 A：去办一下', 'ask_kind': 'do', 'owner_only': True, 'owner_detail': '示例具体说明'}])


class CockpitOwnerDeviceTests(unittest.TestCase):
    def run_page(self, body, pair=None, token=None, hash_=''):
        """开一页，返回（页面上的提示和页头字、本地钥匙、地址 hash、各次读取带的钥匙头、配对请求正文）。"""
        from playwright.sync_api import sync_playwright
        server = h.StatusServer()
        server.default = (200, body, 0)
        server.pages['/cockpit/'] = h.document(h.view())
        sent, posts, errors = [], [], []
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=h.CHROME, headless=True)
                context = browser.new_context(timezone_id='Asia/Shanghai')
                h.isolate(context)
                if pair is not None:
                    def fulfil(route):
                        if route.request.method == 'OPTIONS':
                            return route.fulfill(status=204, headers=CORS)
                        posts.append((route.request.post_data, route.request.headers.get('content-type')))
                        route.fulfill(status=pair[0], headers=CORS, content_type='application/json', body=json.dumps(pair[1]))
                    context.route(PAIR, fulfil)
                if token:
                    context.add_init_script(f"try{{if(!sessionStorage.getItem('seeded')){{localStorage.setItem('wly-cockpit-device',{json.dumps(token)});sessionStorage.setItem('seeded','1')}}}}catch{{}}")
                page = context.new_page()
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('request', lambda r: sent.append(r.headers.get('x-cockpit-device')) if '/__status' in r.url else None)
                page.goto(server.origin + '/cockpit/' + hash_, wait_until='domcontentloaded')
                page.wait_for_function("document.querySelector('[data-cp=viewer]').textContent.length > 0", timeout=20000)
                page.wait_for_timeout(300)
                out = (page.locator('[data-cp=viewer]').inner_text(), page.evaluate("localStorage.getItem('wly-cockpit-device')"), page.evaluate('location.hash'), sent, posts)
                context.close()
                browser.close()
        finally:
            server.close()
        self.assertEqual(errors, [])
        return out

    def test_pair_success_stores_key_and_sends_it(self):
        text, stored, hash_, sent, posts = self.run_page(owner_view(), pair=(200, {'schema': 'pcconfig.cockpit-device-pair.v1', 'status': 'pass', 'token': TOKEN, 'device': {'id': 'dev-0000abcd', 'name': '示例设备'}}), hash_='#pair=' + CODE)
        self.assertEqual(stored, TOKEN)
        self.assertEqual(hash_, '')
        self.assertEqual(posts, [(json.dumps({'code': CODE}, separators=(',', ':')), 'application/json')])
        self.assertIn('这台设备已设为本人设备，私人事项会直接显示', text)
        self.assertIn('本人设备 · 全部显示（其中 1 件公网看不到）', text)
        self.assertTrue(sent and all(s == TOKEN for s in sent), sent)

    def test_pair_failure_keeps_public_view(self):
        text, stored, hash_, sent, _ = self.run_page(h.view(viewer={'kind': 'public', 'device_state': 'none'}, private_count=1), pair=(400, {'status': 'error', 'error': 'cockpit_pair_invalid'}), hash_='#pair=' + CODE)
        self.assertIsNone(stored)
        self.assertEqual(hash_, '')
        self.assertIn('配对链接无效或已过期，请让 AI 重新发一个', text)
        self.assertIn('公开版 · 1 件私人事项只在本人设备上显示', text)
        self.assertTrue(sent and all(s is None for s in sent), sent)

    def test_invalid_key_is_dropped_but_unavailable_is_kept(self):
        text, stored, _, sent, _ = self.run_page(owner_view(state='invalid', kind='public'), token=TOKEN)
        self.assertIsNone(stored)
        self.assertEqual(sent[0], TOKEN)
        self.assertIn('这台设备的授权已失效', text)
        text, stored, _, sent, _ = self.run_page(owner_view(state='unavailable', kind='public'), token=TOKEN)
        self.assertEqual(stored, TOKEN)
        self.assertNotIn('失效', text)
        self.assertIn('公开版', text)


if __name__ == '__main__':
    unittest.main()

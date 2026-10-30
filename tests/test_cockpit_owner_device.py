"""驾驶舱本人设备配对与钥匙：浏览器里跑现行 client.js；数据和钥匙都是虚构的，只在 127.0.0.1 上跑，配对接口用模拟响应。"""
import importlib.util
import json
from pathlib import Path
import unittest
from urllib.parse import urlsplit

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
        self.assertIn('你的设备 · 全部显示（其中 1 件公网看不到）', text)
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

    def run_home(self, machine, kind='desktop', permission='granted'):
        """页面装成线上 https://wly0829.cn/cockpit/（内容来自 127.0.0.1 测试服务器），live 一路回得慢（1.5 秒），本机直读一路被拦截、立刻回。
        返回两次打开各自：本机标记、本机一路发了几次、页面顶上用的是哪一路的数（看示例事项标题）。permission：granted / denied / prompt。"""
        import asyncio
        from playwright.async_api import async_playwright
        home = 'http://127.0.0.1:18793/computer-access/api/status'
        server = h.StatusServer()
        server.pages['/cockpit/'] = h.document(h.view())

        def body(tag):
            v = owner_view()
            v['viewer'].update(device_machine=machine, device_kind=kind)
            v['need_you'][0]['title'] = f'示例私事：{tag}这一路'
            return json.dumps(v, ensure_ascii=False)

        async def main():
            out, hits, errors = [], [], []
            async with async_playwright() as pw:
                browser = await pw.chromium.launch(executable_path=h.CHROME, headless=True)
                context = await browser.new_context(timezone_id='Asia/Shanghai')
                await context.route('**/*', lambda route: route.abort())  # 只放行下面这几样，真实服务一个都不连

                async def site(route):
                    r = await route.fetch(url=server.origin + urlsplit(route.request.url).path)
                    await route.fulfill(response=r)

                async def live(route):
                    await asyncio.sleep(1.5)
                    try: await route.fulfill(status=200, headers=CORS, content_type='application/json', body=body('live'))
                    except Exception: pass

                async def mine(route):
                    hits.append(route.request.headers.get('x-cockpit-device'))
                    await route.fulfill(status=200, headers={**CORS, 'Access-Control-Allow-Headers': 'X-Cockpit-Device'}, content_type='application/json', body=body('本机'))
                await context.route('https://wly0829.cn/**', site)
                await context.route('https://live.invalid/**', live)
                await context.route(home + '*', mine)
                await context.add_init_script(f"try{{localStorage.setItem('wly-cockpit-device',{json.dumps(TOKEN)})}}catch{{}}")
                page = await context.new_page()
                if permission != 'prompt':
                    cdp = await context.new_cdp_session(page)
                    ctx_id = (await cdp.send('Target.getTargetInfo'))['targetInfo']['browserContextId']
                    for name in ('local-network-access', 'loopback-network'):
                        await cdp.send('Browser.setPermission', {'permission': {'name': name}, 'setting': permission, 'origin': 'https://wly0829.cn', 'browserContextId': ctx_id})
                page.on('pageerror', lambda e: errors.append(str(e)))
                for n in range(2):
                    hits.clear()
                    if n == 0: await page.goto('https://wly0829.cn/cockpit/', wait_until='domcontentloaded')
                    else: await page.reload(wait_until='domcontentloaded')
                    await page.wait_for_function("document.querySelector('.cp-ask, .cp-q') && !document.querySelector('.cp-snap')", timeout=20000)
                    await page.wait_for_timeout(2000)
                    used = 'live' if 'live这一路' in await page.locator('#need-you').inner_text() else '本机'
                    out.append((await page.evaluate("localStorage.getItem('wly-cockpit-home')"), len(hits), used, all(x == TOKEN for x in hits)))
                await browser.close()
            return out, errors
        try:
            out, errors = asyncio.run(main())
        finally:
            server.close()
        self.assertEqual(errors, [])
        return out

    def test_primary_machine_adds_local_route_others_never(self):
        # 主驾驶电脑：第一次只走线上、读到后记标记；再打开时多发本机一路（带钥匙），它先回就用它
        self.assertEqual(self.run_home('主驾驶'), [('1', 0, 'live', True), ('1', 1, '本机', True)])
        # 本人在“访问本地网络”授权框点了不允许：再也不发本机一路，照样用线上
        self.assertEqual(self.run_home('主驾驶', permission='denied'), [('1', 0, 'live', True), ('1', 0, 'live', True)])
        # 副驾驶、手机不记标记、不发
        self.assertEqual(self.run_home('副驾驶'), [(None, 0, 'live', True), (None, 0, 'live', True)])
        self.assertEqual(self.run_home('主驾驶', kind='phone'), [(None, 0, 'live', True), (None, 0, 'live', True)])


if __name__ == '__main__':
    unittest.main()

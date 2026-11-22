"""授权页：状态未读到或过旧时禁用按钮写原因；连不上时三格不留操作按钮。
读最终成品 dist，用本机预览和合成读层，不连接真实电脑。"""
import importlib.util
import json
import threading
import unittest
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
CHROME = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
TOOLS = ROOT / 'site-astro' / 'tools'

INFO = """() => ({states: [...document.querySelectorAll('.cell__state')].map(e => e.textContent),
  buttons: [...document.querySelectorAll('.cell__acts button')].map(b => ({disabled: b.disabled,
    reason: b.dataset.disabledReason || '', title: b.title}))})"""

LIVE = """mode => { window.Live = {refresh() {}, watch(resource, query, callbacks) {
  const now = Date.now(), at = new Date(now - 600000).toISOString();
  const meta = {source: 'net', at, viewer: {kind: 'owner'}};
  if (mode === 'stale') callbacks.data({entry: '/computer-access/', state_version: 'synthetic',
    personal_data: {state: 'unlocked', expires_at_unix: now / 1000 + 3600},
    unrestricted: {state: 'inactive'}, windows: {state: 'locked'},
    policy: {default_minutes: 1440, minimum_minutes: 30, maximum_minutes: 4320, factor: {available: false}}}, meta);
  callbacks.link({meta, viewer: meta.viewer, offline: mode === 'error',
    link: {state: mode === 'error' ? 'offline' : mode === 'stale' ? 'online' : 'unknown', basis: 'browser'}});
}}; }"""


class ComputerAccessReasonTests(unittest.TestCase):
    def test_every_disabled_form_button_says_why(self):
        if not ((DIST / 'computer-access' / 'index.html').is_file() and CHROME.is_file()):
            self.skipTest('需要完整构建的 dist 和本机 Chrome')
        from playwright.sync_api import sync_playwright
        spec = importlib.util.spec_from_file_location('scan_glance', TOOLS / 'scan_glance.py')
        sg = importlib.util.module_from_spec(spec); spec.loader.exec_module(sg)
        import tempfile
        with tempfile.TemporaryDirectory(prefix='ca-reasons-') as out:
            server = sg.make_server(DIST, out, 0, sg.read_json(DIST / 'release-manifest.json') if (DIST / 'release-manifest.json').is_file() else {})
            threading.Thread(target=server.serve_forever, daemon=True).start()
            try:
                with sync_playwright() as p:
                    browser = p.chromium.launch(executable_path=str(CHROME), headless=True)
                    for mode in ('loading', 'stale', 'error'):
                        for width, height in ((1920, 1080), (390, 844)):
                            with self.subTest(mode=mode, width=width):
                                context = browser.new_context(viewport={'width': width, 'height': height})
                                def local_only(route):
                                    request = route.request
                                    if request.method not in ('GET', 'HEAD') or not request.url.startswith(server.base + '/'):
                                        return route.abort()
                                    if urlsplit(request.url).path.startswith('/__proxy/') and sg.original_url(request.url).split('?')[0] not in server.local_objects:
                                        return route.abort()
                                    route.continue_()
                                context.route('**/*', local_only)
                                context.add_init_script('(' + LIVE + ')(' + json.dumps(mode) + ')')
                                page = context.new_page(); errors = []
                                page.on('pageerror', lambda error: errors.append(str(error)))
                                page.goto(server.base + '/computer-access/', wait_until='load', timeout=60000)
                                page.wait_for_selector('body.is-ready')
                                info = page.evaluate(INFO)
                                context.close()
                                self.assertEqual(errors, [])
                                if mode == 'error':
                                    self.assertEqual(info['states'], ['连不上'] * 3)
                                    self.assertEqual(info['buttons'], [])
                                    continue
                                disabled = [b for b in info['buttons'] if b['disabled']]
                                self.assertTrue(disabled, info)
                                self.assertEqual(len(disabled), len(info['buttons']), info)
                                for b in disabled:
                                    self.assertTrue(b['reason'], b)
                                    self.assertEqual(b['title'], b['reason'], b)
                    browser.close()
            finally:
                server.shutdown(); server.server_close()


if __name__ == '__main__':
    unittest.main()

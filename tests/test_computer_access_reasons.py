"""授权页办理区：还没读到状态、读不到电脑时，每个变灰的按钮都写明原因（扫描器“禁用要说明原因”同一判据）。
读最终成品 dist，用扫描器自己的本机预览服务；实时状态请求在浏览器里拦下（一直不回或直接断开），不连真实电脑。"""
import importlib.util
import json
import re
import threading
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
CHROME = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
TOOLS = ROOT / 'site-astro' / 'tools'

INFO = """() => { const s = document.getElementById('computer-access-02');
  const bs = [...s.querySelectorAll('button[data-b2-action]')].filter(b => b.getClientRects().length && getComputedStyle(b).visibility !== 'hidden');
  return { phase: document.body.dataset.b2StatusPhase, wait: s.querySelector('.o3-wait')?.innerText ?? '',
    buttons: bs.map(b => ({ action: b.dataset.b2Action, disabled: b.disabled, reason: b.dataset.disabledReason || '',
      title: b.title, described: (b.getAttribute('aria-describedby') || '').split(/\\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ') })) }; }"""


class ComputerAccessReasonTests(unittest.TestCase):
    def test_every_disabled_form_button_says_why(self):
        if not ((DIST / 'computer-access' / 'index.html').is_file() and CHROME.is_file()):
            self.skipTest('需要完整构建的 dist 和本机 Chrome')
        from playwright.sync_api import sync_playwright
        spec = importlib.util.spec_from_file_location('scan_glance', TOOLS / 'scan_glance.py')
        sg = importlib.util.module_from_spec(spec); spec.loader.exec_module(sg)
        pattern = re.compile(sg.read_json(TOOLS / 'scan_glance.json')['selectors']['disabled_reason_pattern'])
        import tempfile
        with tempfile.TemporaryDirectory(prefix='ca-reasons-') as out:
            server = sg.make_server(DIST, out, 0, sg.read_json(DIST / 'release-manifest.json') if (DIST / 'release-manifest.json').is_file() else {})
            threading.Thread(target=server.serve_forever, daemon=True).start()
            try:
                with sync_playwright() as p:
                    browser = p.chromium.launch(executable_path=str(CHROME), headless=True)
                    for mode, want in (('loading', '正在读取电脑状态'), ('error', '读不到电脑')):
                        for width, height in ((1920, 1080), (390, 844)):
                            with self.subTest(mode=mode, width=width):
                                context = browser.new_context(viewport={'width': width, 'height': height})
                                for glob in ('**/__proxy/mcp/**', '**/__proxy/live/**', '**/__status*'):
                                    context.route(glob, (lambda route: None) if mode == 'loading' else (lambda route: route.abort()))
                                page = context.new_page(); errors = []
                                page.on('pageerror', lambda error: errors.append(str(error)))
                                page.goto(server.base + '/computer-access/', wait_until='load', timeout=60000)
                                page.wait_for_function("(m) => document.body.dataset.b2StatusPhase === m", arg=mode, timeout=60000)
                                page.wait_for_timeout(500)
                                info = page.evaluate(INFO)
                                context.close()
                                self.assertEqual(errors, [])
                                self.assertIn(want, info['wait'])
                                disabled = [b for b in info['buttons'] if b['disabled']]
                                self.assertGreaterEqual(len(disabled), 9, info)
                                for b in disabled:
                                    self.assertTrue(b['reason'], b)
                                    self.assertIn(want, b['described'], b)
                                    self.assertTrue(pattern.search(b['title']), b)
                    browser.close()
            finally:
                server.shutdown(); server.server_close()


if __name__ == '__main__':
    unittest.main()

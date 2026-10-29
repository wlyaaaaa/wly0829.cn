"""手机通知打开 /cockpit/#<条目编号>：驾驶舱找到那一条，打开外面的折叠，滚过去并高亮。数据全部虚构，只在 127.0.0.1 上跑。"""
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location('cockpit_native_harness', ROOT / 'tests' / 'cockpit_native_harness.py')
h = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(h)


def fixture(with_new=True):
    at = h.ago(minutes=5)
    decisions = [{'id': f'dec-{i}', 'kind': 'ai_decision', 'text': f'虚构技术事项 {i}：结束；虚构依据。', 'at': at} for i in range(3)]
    need = [{'id': 'pending-old', 'title': '虚构旧待办：核对一次', 'ask_kind': 'do'}]
    if with_new:
        need.append({'id': 'pending-new', 'title': '虚构新待办：通知刚推的这一条', 'ask_kind': 'do'})
    return h.view(need_you=need, must_know={'state': 'ok', 'items': [{'id': 'fix-1', 'kind': 'repairing', 'text': '虚构在修的事', 'at': at}, *decisions]},
                  ai_running={'count': 1, 'stuck_count': 0, 'summary': '', 'observed_at': at,
                              'rows': [{'id': 'run-1', 'status': 'running', 'vendor': 'claude', 'model_text': '虚构型号', 'title': '虚构在跑的活'}]})


STATE = """id => { const n = [...document.querySelectorAll('[data-items]')].find(x => x.dataset.items.split(' ').includes(id));
  if (!n) return null; const r = n.getBoundingClientRect();
  return { hit: n.classList.contains('cp-hit'), inView: r.top >= 0 && r.top < innerHeight, closedAbove: !!n.parentElement.closest('details:not([open])') }; }"""


class CockpitItemAnchorTests(unittest.TestCase):
    def test_hash_opens_fold_scrolls_and_highlights(self):
        from playwright.sync_api import sync_playwright
        server = h.StatusServer()
        old, new = fixture(with_new=False), fixture()
        server.default = (200, new, 0)
        # 首帧只有旧数据：通知里的新条目要等读到新数据才出现
        server.pages['/cockpit/'] = h.document(old)
        server.pages['/cockpit/ai/'] = h.ledger_document(old)
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=h.CHROME, headless=True)
                context = browser.new_context(viewport={'width': 390, 'height': 700}, is_mobile=True, has_touch=True)
                h.isolate(context)
                page = context.new_page()
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                # 1 AI 自己定了的一条（第三步起在二级页“AI 的账本”）：驾驶舱读到数据后认出是 AI 的活，转到 /cockpit/ai/#<编号>，滚到、高亮
                page.goto(server.origin + '/cockpit/#dec-2', wait_until='domcontentloaded')
                page.wait_for_url('**/cockpit/ai/#dec-2', timeout=15000)
                page.wait_for_function("() => document.querySelector('.cp-hit')", timeout=15000)
                self.assertEqual(page.evaluate(STATE, 'dec-2'), {'hit': True, 'inView': True, 'closedAbove': False})
                # 1b 收在“其余 N 个”里的一行：打开折叠再高亮
                page.goto('about:blank')
                page.goto(server.origin + '/cockpit/#run-1', wait_until='domcontentloaded')
                page.wait_for_function("() => document.querySelector('.cp-run-row.cp-hit')", timeout=15000)
                self.assertEqual(page.evaluate(STATE, 'run-1'), {'hit': True, 'inView': True, 'closedAbove': False})
                # 2 只在新数据里的待办：读到后找到那张卡
                page.goto('about:blank')
                page.goto(server.origin + '/cockpit/#pending-new', wait_until='domcontentloaded')
                page.wait_for_function("() => document.querySelector('#todo-pending-new.cp-hit')", timeout=15000)
                self.assertTrue(page.evaluate(STATE, 'pending-new')['inView'])
                # 3 页面里改 # 也认：AI 正在跑的一行、页面元素自己的 id
                page.evaluate("location.hash = 'run-1'")
                page.wait_for_function("() => document.querySelector('.cp-run-row.cp-hit')", timeout=5000)
                page.evaluate("location.hash = 'todo-pending-old'")
                page.wait_for_function("() => document.querySelector('#todo-pending-old.cp-hit')", timeout=5000)
                # 4 分区落点照浏览器原样跳，不高亮整块
                page.evaluate("location.hash = 'need-you'")
                page.wait_for_timeout(300)
                self.assertFalse(page.evaluate("document.getElementById('need-you').classList.contains('cp-hit')"))
                self.assertEqual(errors, [])
                browser.close()
        finally:
            server.close()


if __name__ == '__main__':
    unittest.main()

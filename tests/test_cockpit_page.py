"""现行驾驶舱整页（site-astro 原生页）在真 Chrome 手机宽和电脑宽下的检查；所有状态和事项都是虚构的，只在 127.0.0.1 上跑。

2026-10-11（北京时间）ff4e8595 驾驶舱整页重做后，原测试针对的旧紧凑页（site-release/cockpit、B2 运行件、页内授权办理面板、
“学习方法”一行）已不存在。下面按现行页面验证同样的意思；随产品删除的检查在对应位置注明去向。
"""
from datetime import datetime, timedelta, timezone
import importlib.util
import itertools
import json
import os
from pathlib import Path
import unittest
import uuid

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location('cockpit_native_harness', ROOT / 'tests' / 'cockpit_native_harness.py')
h = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(h)
OUT = Path(os.environ.get('COCKPIT_PAGE_QA_ROOT', str(ROOT / '.publish' / 'cockpit-page' / uuid.uuid4().hex)))


def fixture(counter=itertools.count(1), **over):
    """5 件要你做的事（其中一件有题可选）、2 件交给 AI 的事、今天备份事件、代码变化、套餐流量卡。"""
    now = datetime.now(timezone.utc)
    stamp = h.iso(now)
    asked = next(counter)
    need = [{'id': f'need-{i}', 'title': f'虚构测试要求 {i}：按步骤核对一次', 'project': '虚构项目', 'severity': 'red', 'state': 'pending',
             'at': h.ago(hours=3), 'copy_ai_id': f'need-{i}', 'ask_kind': 'do', 'asked_count': asked} for i in range(4)]
    need[0]['due_at'] = h.iso(now + timedelta(hours=2))
    need.append({'id': 'need-q', 'title': '等你定：虚构选择题', 'headline': '虚构选择题', 'ask_kind': 'decide', 'copy_ai_id': 'need-q', 'asked_count': asked,
                 'questions': [{'id': 'q1', 'text': '选哪个', 'options': ['甲方案', '乙方案'], 'note': True}]})
    body = h.view(observed=stamp,
        need_you=need,
        ai_following=[{'id': 'ai-1', 'title': '虚构项目：整理一份日志', 'project': '虚构项目'}, {'id': 'ai-2', 'title': '虚构项目：核对一次备份', 'project': '虚构项目'}],
        changes={'state': 'ok', 'observed_at': stamp, 'today': {'commits': 2, 'repos_changed': 1, 'latest_at': stamp}, 'window_days': 7, 'commits_7d': 14},
        today_activity={'state': 'ok', 'observed_at': stamp, 'summary': {'tasks_run': 3, 'tasks_failed': 0, 'backups_done': 3},
                        'timeline': [{'at': stamp, 'kind': 'backup', 'text': '今天 3 项备份完成', 'level': 'ok'}], 'errors': []})
    body['sections']['computer'].append({'id': 'traffic', 'title': '套餐流量', 'text': '套餐已用 20 / 100 GB，剩余 80 GB', 'state': 'ok', 'observed_at': h.ago(hours=3)})
    for key, value in over.items():
        body[key] = value
    return body


class CockpitPageTests(unittest.TestCase):
    def test_phone_power_values_stay_inside_their_cells(self):
        from playwright.sync_api import sync_playwright
        OUT.mkdir(parents=True, exist_ok=True)
        server = h.StatusServer()
        body = fixture(power_today={'state': 'ok', 'observed_at': h.ago(seconds=5),
                                    'uptime_hours': 23.9, 'energy_kwh': 12.3, 'peak_watts': 999})
        server.default = (200, body, 0)
        server.pages['/cockpit/'] = h.document(body)
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=h.CHROME, headless=True)
                for width in (320, 390):
                    context = browser.new_context(viewport={'width': width, 'height': 915}, is_mobile=True, has_touch=True)
                    h.isolate(context)
                    page = context.new_page()
                    page.goto(server.origin + '/cockpit/', wait_until='domcontentloaded')
                    page.wait_for_function('window.CockpitData')
                    card = page.locator('.cp-power')
                    card.scroll_into_view_if_needed()
                    self.assertEqual(card.locator('small').all_text_contents(), ['小时', '度', '瓦'])
                    bounds = card.locator('.cp-stats3 li').evaluate_all('''cells => cells.map(cell => {
                        const c = cell.getBoundingClientRect();
                        const value = cell.querySelector('b').getBoundingClientRect();
                        const unit = cell.querySelector('small').getBoundingClientRect();
                        return {left: c.left, right: c.right, valueLeft: value.left, valueRight: value.right,
                                unitLeft: unit.left, unitRight: unit.right, overflow: cell.scrollWidth > cell.clientWidth};
                    })''')
                    for b in bounds:
                        self.assertFalse(b['overflow'], b)
                        self.assertGreaterEqual(min(b['valueLeft'], b['unitLeft']), b['left'])
                        self.assertLessEqual(max(b['valueRight'], b['unitRight']), b['right'])
                    page.screenshot(path=str(OUT / f'power-{width}.png'))
                    context.close()
                browser.close()
        finally:
            server.close()

    def test_phone_and_desktop(self):
        from playwright.sync_api import sync_playwright
        OUT.mkdir(parents=True, exist_ok=True)
        server = h.StatusServer()
        state = {'value': fixture}
        server.default = (200, lambda: state['value']() if callable(state['value']) else state['value'], 0)
        errors, results = [], []
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=h.CHROME, headless=True)
                for width in (390, 1440):
                    state['value'] = fixture
                    server.pages['/cockpit/'] = h.document(fixture(), {'虚构正常项目': '/projects/fixture-project/'})
                    context = browser.new_context(viewport={'width': width, 'height': 915 if width == 390 else 1000}, timezone_id='Asia/Shanghai')
                    h.isolate(context)
                    page = context.new_page()
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.goto(server.origin + '/cockpit/', wait_until='domcontentloaded')
                    page.wait_for_function('window.CockpitData')
                    sec = lambda: page.locator('.cp-sec-item').nth(3).locator('.cp-sec-word').inner_text().strip()
                    when = lambda v: page.evaluate("(v)=>import('/src/cockpit/model.js').then(m=>m.when(v))", v)
                    page.wait_for_function("document.querySelectorAll('.cp-sec-item')[3]?.querySelector('.cp-sec-word')?.textContent.trim()==='能'")

                    # 首屏：你现在 5 件事；5 张事项卡；期限照后端给的写，不出占位话
                    self.assertEqual(page.locator('.cp-you-n b').inner_text(), '5')
                    self.assertIn('件事', page.locator('.cp-you-n').inner_text())
                    self.assertEqual(page.locator('.cp-ask').count(), 5)
                    first = page.locator('.cp-ask').first.inner_text()
                    self.assertIn('前办', first)
                    for filler in ('期限未登记', '待补', '未统计'):
                        self.assertNotIn(filler, page.locator('.cp-page').inner_text())
                    # 6 个分区标题图和首屏两张标题图都加载出来
                    page.wait_for_function("[...document.querySelectorAll('.cp-page h1 img,.cp-page h2 img')].every(e=>e.complete&&e.naturalWidth>0)", timeout=30000)
                    self.assertEqual(page.locator('.cp-section .cp-head h2 img').count(), 6)
                    # 曲线不内嵌实时图；页面没有横向滚动
                    self.assertEqual(page.locator('iframe').count(), 0)
                    self.assertFalse(page.evaluate('document.documentElement.scrollWidth>innerWidth'))
                    self.assertIn('提交不等于已经上线', page.locator('.cp-code').inner_text())
                    self.assertIn('今天 3 项备份完成', page.locator('.cp-activity').inner_text())
                    # 原“学习方法：学习记录尚未读到”一行已随 ff4e8595 整页重做删除，页面不再有学习一栏。
                    self.assertIn('纠正次数还没读到', page.locator('.cp-words').inner_text())
                    state['value'] = lambda: fixture(owner_corrections={'status': 'pass', 'total': 0, 'date': datetime.now(timezone(timedelta(hours=8))).strftime('%Y-%m-%d'), 'history': []})
                    page.evaluate('CockpitData.refresh()')
                    page.locator('.cp-words').filter(has_text='次纠正 AI').wait_for()
                    self.assertEqual(page.locator('.cp-words .cp-big b').inner_text(), '0')
                    self.assertIn('今天', page.locator('.cp-words .cp-big').inner_text())
                    state['value'] = fixture

                    # 今天的河：船画出来
                    page.wait_for_function('window.todayRiver?.model?.tasks.length>0', timeout=60000)
                    self.assertGreater(page.locator('#today-river .boat').count(), 0)
                    page.evaluate('todayRiver.seek(12)')
                    page.screenshot(path=str(OUT / f'cockpit-{width}.png'), full_page=True)

                    # 套餐流量卡的三种情况：读到了、没读到、只有很久以前那次；首屏件数不跟着乱
                    traffic = page.locator('[data-cp="computer"] .cp-card').filter(has_text='套餐流量')
                    for mode, card in [('ok', {'text': '套餐已用 20 / 100 GB，剩余 80 GB', 'state': 'ok', 'observed_at': h.ago(hours=3)}),
                                       ('none', {'text': '', 'state': 'unavailable'}),
                                       ('stale', {'text': '套餐缓存已用 20 / 100 GB，剩余 80 GB', 'state': 'unavailable', 'observed_at': h.ago(hours=25)})]:
                        def body(card=card):
                            b = fixture()
                            b['sections']['computer'][-1] = {'id': 'traffic', 'title': '套餐流量', **card}
                            return b
                        state['value'] = body
                        page.evaluate('CockpitData.refresh()')
                        page.wait_for_function("(m)=>{const c=[...document.querySelectorAll('[data-cp=computer] .cp-card')].find(x=>x.textContent.includes('套餐流量'));return c&&c.classList.contains(m)}", arg='is-green' if mode == 'ok' else 'is-gray')
                        text = traffic.inner_text()
                        if mode == 'ok':
                            self.assertIn(card['text'], text)
                            self.assertIn(when(card['observed_at']) + ' 读到', text)
                        elif mode == 'none':
                            self.assertIn('还没读到', text)
                        else:
                            self.assertIn(card['text'], text)
                            self.assertIn('这是 ' + when(card['observed_at']) + ' 读到的，之后 25 小时没读到新的', text)
                        self.assertEqual(page.locator('.cp-ask').count(), 5)
                        self.assertEqual(page.locator('.cp-you-n b').inner_text(), '5')
                    state['value'] = fixture

                    # 正在作答的卡片：选了的答案、写的补充、展开的“其余几件”，刷新 5 次都原样留着，滚动位置不动
                    # （原测试的页内授权办理面板已随整页重做删除，安全和授权改为链到授权页办理；同样的“刷新不丢正在填的东西”落在这里。）
                    quiz = page.locator('.cp-ask#todo-need-q')
                    quiz.scroll_into_view_if_needed()
                    self.assertTrue(quiz.locator('[data-copy-answer]').is_disabled())
                    self.assertEqual(quiz.locator('.cp-hint').inner_text(), '先在上面选一项，才能复制答复')
                    self.assertEqual(quiz.locator('[data-copy-answer]').get_attribute('aria-describedby'), 'todo-need-q-hint')
                    quiz.get_by_role('button', name='乙方案', exact=True).click()
                    self.assertEqual(quiz.locator('.cp-hint').inner_text(), '按钮只复制一句话，贴到任意 AI 对话发送即可')
                    quiz.locator('[data-note]').fill('虚构补充说明')
                    page.locator('#ai-rest > summary').click()
                    before = page.evaluate('scrollY')
                    for _ in range(5):
                        reads = server.status_reads
                        self.assertTrue(page.evaluate('CockpitData.refresh()')['fresh'])
                        self.assertGreater(server.status_reads, reads)
                    self.assertIn('问过你', page.locator('.cp-ask#todo-need-q').inner_text())
                    self.assertEqual(quiz.get_by_role('button', name='乙方案', exact=True).get_attribute('aria-pressed'), 'true')
                    self.assertEqual(quiz.get_by_role('button', name='甲方案', exact=True).get_attribute('aria-pressed'), 'false')
                    self.assertEqual(quiz.locator('[data-note]').input_value(), '虚构补充说明')
                    self.assertFalse(quiz.locator('[data-copy-answer]').is_disabled())
                    self.assertTrue(page.evaluate("document.querySelector('#ai-rest').open"))
                    self.assertEqual(page.evaluate('scrollY'), before)
                    # 按钮只复制一句话，不发请求
                    quiz.get_by_role('button', name='问 AI', exact=True).click()
                    page.screenshot(path=str(OUT / f'answer-{width}.png'))

                    # 右下角刷新按钮：顶部、中间、底部都只有一个、固定在视口里、点得到，点了真去读
                    size = 42 if width == 390 else 44
                    for position in ('top', 'middle', 'bottom'):
                        page.evaluate("(p)=>scrollTo({top:p==='top'?0:p==='middle'?document.documentElement.scrollHeight*.5:document.documentElement.scrollHeight,behavior:'instant'})", position)
                        button = page.locator('[data-cockpit-refresh]')
                        self.assertEqual(button.count(), 1)
                        rect = button.bounding_box()
                        self.assertTrue(0 <= rect['y'] < page.viewport_size['height'] - rect['height'] + 1)
                        self.assertEqual((round(rect['width']), round(rect['height'])), (size, size))
                        self.assertEqual(page.locator('.cockpit-refresh-wrap').evaluate('e=>getComputedStyle(e).position'), 'fixed')
                        self.assertTrue(button.evaluate('e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}'))
                        reads = server.status_reads
                        button.click()
                        page.wait_for_function("document.querySelector('[data-cockpit-refresh]').getAttribute('aria-busy')==='false'&&document.querySelector('[data-cockpit-refresh-note]').textContent.startsWith('已更新')")
                        self.assertGreater(server.status_reads, reads)
                        if position == 'bottom':
                            self.assertLessEqual(abs(page.evaluate('document.documentElement.scrollHeight-innerHeight-scrollY')), 2)
                            page.screenshot(path=str(OUT / f'bottom-{width}.png'))

                    # 接口回的不是驾驶舱视图（旧全量里没有 cockpit 块）：当成这次没读到，保留上次读到的事项并写明时间
                    state['value'] = {'status': 'ok', 'observed_at_unix': 1}
                    page.evaluate('CockpitData.refresh()')
                    page.wait_for_function("document.querySelectorAll('.cp-sec-item')[3]?.querySelector('.cp-sec-word')?.textContent.trim()==='连不上'")
                    self.assertEqual(page.locator('.cp-ask').count(), 5)
                    self.assertRegex(page.locator('.cp-you-sub').inner_text(), r'这是 .+ 读到的')
                    # 读到的结论已经过期（总览 as_of 早于后端给的期限）：各分区的灯和首屏三格都写“读不到”
                    old = h.ago(minutes=10)
                    stale = fixture()
                    stale['overview'] = {**stale['overview'], 'as_of': old}
                    state['value'] = stale
                    page.evaluate('CockpitData.refresh()')
                    page.wait_for_function("document.querySelectorAll('.cp-sec-item')[3]?.querySelector('.cp-sec-word')?.textContent.trim()==='能'")
                    page.wait_for_function("[...document.querySelectorAll('.cp-lamp')].every(e=>e.textContent.includes('读不到'))")
                    self.assertEqual(page.locator('.cp-tri-cell.is-gray').count(), 3)
                    self.assertIn('上次 ', page.locator('.cp-tri').inner_text())
                    state['value'] = fixture

                    # 重新加载 5 次：每次都画出首帧并且河里有船
                    for _ in range(5):
                        page.reload(wait_until='domcontentloaded')
                        page.locator('.cp-you-n').filter(has_text='件事').wait_for(timeout=60000)
                        page.wait_for_function('window.todayRiver?.model?.tasks.length>0', timeout=60000)
                        self.assertGreater(page.locator('#today-river .boat').count(), 0)
                    results.append({'width': width, 'answers_preserved': True, 'overflow': False, 'refreshes': 5, 'reloads_with_boats': 5, 'titles_loaded': 6, 'iframes': 0})
                    context.close()
                browser.close()
        finally:
            server.close()
        self.assertEqual(errors, [])
        # 原测试核对页内授权面板发出的两次虚构授权请求；面板已删除，现在驾驶舱应当一个写请求都不发
        self.assertEqual(server.writes(), [])
        (OUT / 'receipt.json').write_text(json.dumps({'results': results, 'page_errors': errors, 'write_requests': len(server.writes()), 'real_actions': 0}, ensure_ascii=False, indent=2), encoding='utf8')


if __name__ == '__main__':
    unittest.main()

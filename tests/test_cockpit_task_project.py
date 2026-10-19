"""驾驶舱任务的归属项目（数据全部虚构）：后端任务对象带 project 时，精简视图和全量备用入口都把它传到“今天的河”，
展开说明（正常那一支和未知/出错走提醒那一支）首行显示“归属项目”；没有 project 时不出这一行，也不写“未知”占位。"""
import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COCKPIT = (ROOT / 'site-astro' / 'src' / 'cockpit').as_uri() + '/'
RIVER = ROOT / 'scripts' / 'today-river.js'


def river_parts():
    source = RIVER.read_text('utf8')
    helpers = source[source.index('const esc = '):source.index("const STATE = ")]
    helpers = helpers[:helpers.index('\n', helpers.index('const dkey = ')) + 1] + source[source.index('const whenText = '):source.index('// ---------- 画面 ----------')]
    pick = source[source.index('function pick(t, scroll'):source.index('function restorePick()')]
    return helpers, pick


SCRIPT = r"""
const assert = require('node:assert/strict'), vm = require('node:vm');
(async () => {
  const [base, helpers, pick] = process.argv.slice(1);
  const { normalize, riverSnapshot } = await import(base + 'model.js');
  const { fromFull } = await import(base + 'full-adapter.js');
  const at = '2026-10-12T14:59:30+08:00', now = new Date('2026-10-12T15:00:00+08:00');
  const item = (id, project) => ({ id, name: '虚构' + id, state: 'success', last_run_at: at, what: '虚构在做的事', ...(project ? { project } : {}) });

  // 精简视图：automation.items[].project 一路传到河的任务对象
  const lean = normalize({ schema: 'pcconfig.cockpit-view.v1', served_at: at, collected_at: at,
    automation: { state: 'ok', observed_at: at, items: [item('pages', '虚构项目（总看板）'), item('plain')] } });
  const snap = riverSnapshot(lean, now).automation.items;
  assert.equal(snap.find((t) => t.id === 'pages').project, '虚构项目（总看板）');
  assert.equal(snap.find((t) => t.id === 'plain').project, '');

  // 全量备用入口：automation.items[].project 也保留，名字仍取 plain.name
  const full = fromFull({ status: 'ok', automation: { items: [
    { id: 'pages', project: '虚构项目（总看板）', plain: { name: '虚构部署' }, state: 'success' },
    { id: 'plain', plain: { name: '虚构无归属' }, state: 'success' }] } });
  const ft = full.automation ? full.automation.items : full.tasks;
  const fa = (ft || []).find((t) => t.id === 'pages'), fb = (ft || []).find((t) => t.id === 'plain');
  assert.ok(fa, JSON.stringify(full).slice(0, 400));
  assert.equal(fa.project, '虚构项目（总看板）'); assert.equal(fa.name, '虚构部署'); assert.equal(fb.project, '');

  // 河的展开说明：正常那一支（six）和提醒那一支（pick 的未知/出错分支）
  const made = [];
  const card = () => { const p = { hidden: true, dataset: {}, html: '', set textContent(x) { this.html = String(x); }, set innerHTML(x) { this.html = x; },
    insertAdjacentHTML(where, x) { this.html = where === 'afterbegin' ? x + this.html : this.html + x; }, querySelector: () => ({}) }; made.push(p); return p; };
  const ctx = { picked: null, M: { now: now.getTime(), today: Math.floor((now.getTime() + 8 * 3600e3) / 864e5) }, mark: () => {}, $: () => ctx.cur,
    document: { dispatchEvent: () => true }, CustomEvent: class { constructor(n, o) { this.type = n; this.detail = o && o.detail; } } };
  vm.createContext(ctx);
  vm.runInContext(helpers + '\n' + pick + '\nthis.six = six; this.pick = pick;', ctx);
  const task = (raw, flag = null) => ({ i: 0, name: '虚构', group: 'daily', raw: { plain: { what: '虚构在做的事' }, ...raw }, flag, last: 0, next: 0 });

  const withP = ctx.six(ctx.M, task({ id: 'a', state: 'success', project: '虚构项目（总看板）' }));
  assert.match(withP, /<b>归属项目<\/b>虚构项目（总看板）/);
  assert.ok(withP.indexOf('归属项目') < withP.indexOf('在做什么'), '归属项目应在首行');
  const noP = ctx.six(ctx.M, task({ id: 'b', state: 'success' }));
  assert.doesNotMatch(noP, /归属项目/); assert.doesNotMatch(noP, /未知/);
  assert.match(ctx.six(ctx.M, task({ id: 'x', state: 'success', project: '<b>' })), /&lt;b&gt;/);

  ctx.cur = card(); ctx.pick(task({ id: 'c', state: 'unknown', project: '虚构项目（总看板）', public_message: '虚构没读到结果' }), false);
  assert.match(ctx.cur.html, /^<div class="owner"[^>]*><b>归属项目<\/b>虚构项目（总看板）<\/div>虚构没读到结果/);
  ctx.cur = card(); ctx.pick(task({ id: 'd', state: 'failed', public_message: '虚构出错了' }, 'bad'), false);
  assert.doesNotMatch(ctx.cur.html, /归属项目/);
  ctx.cur = card(); ctx.pick(task({ id: 'e', state: 'success', project: '虚构项目（总看板）' }), false);
  assert.match(ctx.cur.html, /归属项目/);
  ctx.URL = URL;
  ctx.cur = card(); ctx.pick(task({ id: 'gmail', state: 'unknown', project_url: 'https://script.google.com/home/projects/fixture/edit', plain: { what: '虚构转发', stop: '虚构停止', impact: '虚构影响' } }), false); assert.match(ctx.cur.html, /href="https:\/\/script\.google\.com\/home\/projects\/fixture\/edit" target="_blank" rel="noopener noreferrer">打开Google脚本项目<\/a>/); for (const label of ['在做什么', '上次什么时候跑的', '下次什么时候跑', '有没有出错', '怎么停', '停了影响什么', '虚构停止', '虚构影响']) assert.ok(ctx.cur.html.includes(label), label);
  ctx.cur = card(); ctx.pick({ ...task({ id: 'phone', state: 'failed', plain: { what: '换WiFi后连同一路由器' } }, 'ai'), name: '回家收手机数据' }, false); assert.match(ctx.cur.html, /换WiFi后连同一路由器/);
  process.stdout.write('ok');
})().catch((e) => { console.error(e); process.exit(1); });
"""


class TaskProjectTest(unittest.TestCase):
    def test_project_reaches_river_expansion(self):
        helpers, pick = river_parts()
        r = subprocess.run(['node', '-e', SCRIPT, COCKPIT, helpers, pick], text=True, capture_output=True, encoding='utf8')
        self.assertEqual(r.returncode, 0, r.stderr + r.stdout)
        self.assertEqual(r.stdout, 'ok')


if __name__ == '__main__':
    unittest.main()

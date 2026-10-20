"""驾驶舱 G4：每周 AI 体检一行（governance.last_run）、暂缓区标题和原因；字段没给时退回原来的显示。"""
import subprocess
import unittest
from pathlib import Path

COCKPIT = (Path(__file__).resolve().parents[1] / 'site-astro' / 'src' / 'cockpit').as_uri() + '/'

SCRIPT = r"""
const assert = require('node:assert/strict');
(async () => {
  const base = process.argv[1];
  const { normalize } = await import(base + 'model.js');
  const R = await import(base + 'render.js');
  const now = new Date('2026-10-12T18:00:00+08:00');
  const ctx = { now, offline: false, projectUrls: {}, img: {} };
  const ai = [{ id: 'a1', title: '甲项目：整理日志', project: '甲' }];
  const deferred = [{ title: '换键盘', action_owner: 'user', reason: '14 天没回应，你可能不想做，想做时说一声' }, { title: '等显卡驱动', action_owner: 'ai' }];
  const last_run = { started_at: '2026-10-12T13:00:00+08:00', ended_at: '2026-10-12T15:10:00+08:00', result: 'ok', summary: '修好两件',
    counts: { fixed: 5, closed: 3, following: 12, deferred: 2, need_you: 1 },
    actions: [1, 2, 3, 4].map((i) => ({ title: `行动 ${i}`, copy_ai_id: `act-${i}` })),
    auto_closed: [{ id: 'c1', title: '视频那条', evidence: '本人 06:05 在对话里选了 C' }],
    newly_deferred: [{ id: 'd1', title: '换键盘', reason: '14 天没回应' }], next_run_at: '2026-10-19T13:00:00+08:00' };
  const v = normalize({ schema: 'pcconfig.cockpit-view.v1', ai_following: ai, deferred, governance: { next_run_at: last_run.next_run_at, last_run } });
  const html = R.needYou(v, ctx);
  assert.match(html, /上次 AI 体检（10月12日 13:00）记录：当时修好 5、关掉 3、转暂缓 2、还在跟 12、待你办 1 件 · 下次 10月19日 13:00/);
  assert.match(html, /问 AI 详情/);
  const actions = html.match(/<details class="cp-more cp-gov-more" id="gov-actions"><summary>当时留下的说明 3 条<\/summary>.*?<\/details>/)?.[0];
  assert.ok(actions, '历史说明默认折叠，不带 open');
  assert.doesNotMatch(html, /data-copy-ai="act-|（在上面）/);
  assert.equal((actions.match(/问 AI 这条记录/g) || []).length, 3, '历史说明最多 3 条');
  assert.doesNotMatch(actions, /行动 4/);
  assert.match(actions, /这是上次体检的记录；现在要办的事以上面的当前待办为准。/);
  assert.match(actions, /data-copy-text="[^"]*10月12日 13:00 那一轮[^"]*governance\.last_run[^"]*体检回执[^"]*行动 1[^"]*先核对现在是否仍需处理/);
  assert.match(html, /现在没有要你动手的事。/);
  assert.match(html, /cp-gov-line"><span class="cp-dot is-neutral"/);
  assert.match(html, /<details class="cp-more cp-gov-more" id="gov-closed"><summary>那次自动关掉 1 件<\/summary>.*视频那条.*本人 06:05/);
  assert.match(html, /id="gov-deferred"><summary>那次新转暂缓 1 件/);
  assert.match(html, /暂缓 · 你有空时可以做（1 件，不急）/);
  assert.match(html, /为什么暂缓：14 天没回应，你可能不想做，想做时说一声<\/small>/);
  assert.match(html, /AI 在跟（1 件，等条件）/); assert.doesNotMatch(html, /暂缓 · AI/);
  // 没有交给 AI 的事时体检行照样出
  assert.match(R.needYou(normalize({ schema: 'pcconfig.cockpit-view.v1', governance: { last_run } }), ctx), /现在没有交给 AI 的事。<\/p><div class="cp-gov">/);
  // 后端没给 last_run / counts：不出体检行，其余照旧
  for (const governance of [{ next_run_at: last_run.next_run_at }, { last_run: { summary: 'x' } }, undefined]) {
    const old = R.needYou(normalize({ schema: 'pcconfig.cockpit-view.v1', ai_following: ai, deferred: [{ title: '换键盘', action_owner: 'user' }], governance }), ctx);
    assert.doesNotMatch(old, /cp-gov|这周 AI 体检|为什么暂缓/);
    assert.match(old, /交给 AI 的事：1 件/);
  }
  // 精简视图：暂缓原因透传
  const lean = normalize({ schema: 'pcconfig.cockpit-view.v1', deferred: [{ id: 'p1', title: '换键盘', reason: '14 天没回应' }] });
  assert.equal(lean.deferred[0].reason, '14 天没回应');
  // 后台任务只描述已接入项目：未知不能算零，下限不能说成精确数量。
  const work = (items) => R.needYou(normalize({ schema: 'pcconfig.cockpit-view.v1', ai_following: ai, ai_work: { items } }), ctx);
  const row = (n, extra = {}) => ({ project: '甲', running_tasks: n, running_automations: n, ...extra });
  const unknown = ['部分项目的 AI 后台任务状态暂时读不到', '部分项目的自动任务状态暂时读不到'];
  const zero = ['已接入的 AI 后台任务当前未运行', '已登记项目没有正在运行的自动任务'];
  for (const [items, expected] of [
    [[row(0), row(null)], unknown], [[row(0), row(0)], zero], [[{ project: '甲' }], unknown],
    ...['0', '2', NaN, -1, 0.5].map((n) => [[row(0), row(n)], unknown]),
  ]) {
    const text = work(items);
    for (const message of expected) assert.ok(text.includes(message), message);
    assert.match(text, /项目后台进展.*这里只统计已接入的后台任务，不代表所有 AI 聊天。/);
    assert.doesNotMatch(text, /现在没有 AI 对话在干活|现在没有自动任务在跑/);
  }
  for (const n of [1, 2]) {
    const text = work([row(n, { running_tasks_basis: 'confirmed_minimum' }), row(null)]);
    assert.ok(text.includes(`已读到的 AI 后台任务：甲 至少${n}个；另有项目状态未读到`));
    assert.match(text, /已读到的自动任务：甲(?: 2 个)?；另有项目状态未读到/);
  }
  assert.match(work([row(2, { running_tasks_basis: 'complete' })]), /已读到的 AI 后台任务：甲 2 个/);
  assert.doesNotMatch(work([]), /cp-aiwork|项目后台进展/);
})().catch((e) => { console.error(e); process.exit(1); });
"""


class CockpitG4GovernanceTest(unittest.TestCase):
    def test_governance_line_and_deferred(self):
        r = subprocess.run(['node', '-e', SCRIPT, COCKPIT], text=True, capture_output=True, encoding='utf8')
        self.assertEqual(r.returncode, 0, r.stderr + r.stdout)


if __name__ == '__main__':
    unittest.main()

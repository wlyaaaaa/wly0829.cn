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
  const { fromFull } = await import(base + 'full-adapter.js');
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
  assert.match(html, /这周 AI 体检（10月12日 13:00）：修好 5、关掉 3、转暂缓 2、还在跟 12、要你 1 件（在上面） · 下次 10月19日 13:00/);
  assert.match(html, /复制给 AI 问详情/);
  assert.equal((html.match(/data-copy-ai="act-/g) || []).length, 3, '行动项最多 3 条');
  assert.match(html, /<details class="cp-more cp-gov-more" id="gov-closed"><summary>本周自动关掉 1 件<\/summary>.*视频那条.*本人 06:05/);
  assert.match(html, /id="gov-deferred"><summary>本周新转暂缓 1 件/);
  assert.match(html, /暂缓 · 你有空时可以做（1 件，不急）/);
  assert.match(html, /为什么暂缓：14 天没回应，你可能不想做，想做时说一声 · 什么时候/);
  assert.match(html, /暂缓 · AI 等条件到了再做（1 件，你不用管）/);
  // 没有交给 AI 的事时体检行照样出
  assert.match(R.needYou(normalize({ schema: 'pcconfig.cockpit-view.v1', governance: { last_run } }), ctx), /现在没有交给 AI 的事。<\/p><div class="cp-gov">/);
  // 后端没给 last_run / counts：不出体检行，其余照旧
  for (const governance of [{ next_run_at: last_run.next_run_at }, { last_run: { summary: 'x' } }, undefined]) {
    const old = R.needYou(normalize({ schema: 'pcconfig.cockpit-view.v1', ai_following: ai, deferred: [{ title: '换键盘', action_owner: 'user' }], governance }), ctx);
    assert.doesNotMatch(old, /cp-gov|这周 AI 体检|为什么暂缓/);
    assert.match(old, /交给 AI 的事：1 件/);
  }
  // 全量接口：暂缓原因透传
  const full = fromFull({ cockpit: { detail_groups: { deferred: [{ id: 'p1', title: '换键盘', reason: '14 天没回应' }] } } });
  assert.equal(full.deferred[0].reason, '14 天没回应');
})().catch((e) => { console.error(e); process.exit(1); });
"""


class CockpitG4GovernanceTest(unittest.TestCase):
    def test_governance_line_and_deferred(self):
        r = subprocess.run(['node', '-e', SCRIPT, COCKPIT], text=True, capture_output=True, encoding='utf8')
        self.assertEqual(r.returncode, 0, r.stderr + r.stdout)


if __name__ == '__main__':
    unittest.main()

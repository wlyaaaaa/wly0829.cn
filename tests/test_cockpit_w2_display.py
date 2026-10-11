"""驾驶舱 W2 显示：时间写日期、电脑卡原因句、验收合并、项目红灯只给等你的、今天出错清单传给河。"""
import subprocess
import unittest
from pathlib import Path

COCKPIT = (Path(__file__).resolve().parents[1] / 'site-astro' / 'src' / 'cockpit').as_uri() + '/'

SCRIPT = r"""
const assert = require('node:assert/strict');
(async () => {
  const base = process.argv[1];
  const { normalize, riverSnapshot, when, ago } = await import(base + 'model.js');
  const R = await import(base + 'render.js');
  const now = new Date('2026-10-12T00:30:00+08:00');
  assert.equal(when('2026-10-11T23:58:00+08:00', now), '10月11日 23:58');
  assert.equal(when('2026-10-12T00:10:00+08:00', now), '00:10');
  assert.equal(ago('2026-10-10T14:18:00+08:00', now), '34 小时前');
  assert.equal(ago('2026-10-08T00:00:00+08:00', now), '4 天前');
  const v = normalize({
    schema: 'pcconfig.cockpit-view.v1',
    sections: {
      computer: [{ id: 'computer_health', title: '电脑资源', text: '处理器 24%', state: 'attention', observed_at: '2026-10-12T00:29:00+08:00' },
                 { id: 'traffic', title: '套餐流量', text: '已用 521 GB', state: 'unavailable', observed_at: '2026-10-10T14:18:00+08:00' }],
      remote: [{ id: 'remote', title: '远程连接', text: '远程连接在线', state: 'ok' }],
      backup_cloud: [{ id: 'drive_upload', title: 'Google Drive 上传', text: '上传器：现在有没有在上传还不知道。18:47 读到时没在传。', state: 'ok' }],
    },
    pc_health: { state: 'error', reason_code: 'resource_high', metrics: { nonpaged_pool_bytes: 8 * 2 ** 30, handle_count: 400000 }, changes_24h: { nonpaged_pool_bytes: 5 * 2 ** 30, handle_count: 1000 } },
    laptop: { state: 'online' },
    deferred: [{ title: '下次电脑卡住时，先按几个简单步骤查一下 最后核对：2026-10-10 20:11（北京时间）。' }, { title: '换键盘' }],
    today_activity: { summary: { errors: { owner: 1, other: 1 }, tasks_run: 9 },
      errors: [{ task_id: 'a', name: '小米妙享', at: '2026-10-11T23:36:00+08:00', owner: 'owner' }, { task_id: 'b', name: 'Edge 更新', at: '2026-10-11T23:40:00+08:00', owner: 'other' }],
      timeline: [1, 2, 3].map((i) => ({ at: `2026-10-12T00:0${i}:00+08:00`, kind: 'acceptance', text: `验收核对了 1 项，通过 ${i === 3 ? 1 : 0} 项`, level: 'ok' }))
        .concat([{ at: '2026-10-12T00:05:00+08:00', kind: 'failed', text: '小米妙享出错', level: 'act' }]) },
    projects: { items: [{ name: '甲', run_health: 'failed', overview: 'run_failed', waiting_user: 0 }, { name: '乙', run_health: 'unknown', overview: 'run_unknown', waiting_user: 2 }] },
  });
  const ctx = { now, offline: false, projectUrls: {}, img: {} };
  const pc = R.computer(v, ctx);
  assert.match(pc, /原因：系统资源超过了警戒线：非分页池（系统内核自己占的内存）现在 8 GB，24 小时涨了 5 GB/);
  assert.match(pc, /之前定过的办法（你有空时）：下次电脑卡住时，先按几个简单步骤查一下</);
  assert.doesNotMatch(pc, /换键盘/);
  assert.match(pc, /这是 10月10日 14:18 读到的，之后 34 小时没读到新的/);
  assert.match(pc, /笔记本（副机）：在线/);
  assert.match(R.backup(v, ctx), /上传器：18:47 读到时没在传。现在有没有在上传还不知道。/);
  const today = R.todayBlock(v, ctx);
  assert.equal((today.match(/验收/g) || []).length, 1, '验收只剩一行');
  assert.match(today, /AI 今天核对登记事项 3 次，一共核对 3 项次、1 项通过/);
  assert.match(today, /2 个出过错（你的任务 1 个、别的软件自带的 1 个）/);
  assert.match(today, /出过错的：小米妙享（23:36）、Edge 更新（23:40，别的软件自带）/);
  const proj = R.projects(v, ctx);
  assert.match(proj, /cp-proj is-yellow"[^>]*><h3>.*?甲/);
  assert.match(proj, /cp-proj is-red"[^>]*><h3>.*?乙/);
  assert.equal(riverSnapshot(v).today_errors.length, v.today_activity.summary.errors.owner + v.today_activity.summary.errors.other);
  // 字段没到：不加原因句、不加笔记本行、不出空框
  const bare = normalize({ schema: 'pcconfig.cockpit-view.v1', sections: { computer: [{ id: 'computer_health', title: '电脑资源', text: '处理器 24%', state: 'ok' }] } });
  const pc0 = R.computer(bare, ctx);
  assert.doesNotMatch(pc0, /原因：|笔记本|cp-plan/);
  assert.deepEqual(riverSnapshot(bare).today_errors, []);
})().catch((e) => { console.error(e); process.exit(1); });
"""


class CockpitW2DisplayTest(unittest.TestCase):
    def test_w2_display_rules(self):
        r = subprocess.run(['node', '-e', SCRIPT, COCKPIT], text=True, capture_output=True, encoding='utf8')
        self.assertEqual(r.returncode, 0, r.stderr + r.stdout)


if __name__ == '__main__':
    unittest.main()

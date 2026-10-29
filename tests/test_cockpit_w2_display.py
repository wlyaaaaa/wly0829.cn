"""驾驶舱 W2 显示：时间写日期、处理器卡不再自己猜资源原因、内存/系统资源卡用后端原文、首屏电脑摘要分开说、验收合并、项目红灯只给等你的、今天出错清单传给河。"""
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
      computer: [{ id: 'computer_health', title: '处理器', text: '电脑读数：处理器 24%，52℃', state: 'ok', observed_at: '2026-10-12T00:29:00+08:00' },
                 { id: 'system_resources', title: '内存/系统资源', text: '系统内核内存 8.5 GB，偏高；可分页内核内存 6.8 GB，偏高', state: 'attention', observed_at: '2026-10-12T00:29:00+08:00' },
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
  // 本人 10-12：内存引起的黄不能挂在处理器上；前端不再从 pc_health 自己挑触发项，用后端 system_resources 卡的原文
  assert.doesNotMatch(pc, /原因：|cp-reason|cp-plan|非分页池/);
  // 第三步：正常的读数只占一行
  assert.match(pc, /<li class="cp-fact" tabindex="0" title="电脑读数：处理器 24%，52℃"><span class="cp-dot is-green" aria-hidden="true"><\/span><b>处理器<\/b><span>电脑读数：处理器 24%，52℃<\/span><\/li>/);
  assert.match(pc, /cp-card is-yellow"><h3>.*?内存\/系统资源<\/h3><p>系统内核内存 8.5 GB，偏高；可分页内核内存 6.8 GB，偏高<\/p>/);
  // 首屏：总览给 ok 但资源卡亮黄时不能显示成全好；说的是资源，不是处理器
  const ov = { stale: () => false, lamp: () => '' };
  const top = R.page({ ...v, overview: { as_of: '2026-10-12T00:29:00+08:00', score: 90, signals: [{ id: 'computer', level: 'ok' }], reasons: [] } }, { ...ctx, ov });
  const cell = /<li class="cp-tri-cell is-(\w+)" data-signal="computer">(.*?)<\/li>/.exec(top);
  assert.ok(cell, '首屏有电脑格');
  // 颜色只看要不要你出手：没写要你做、写着交给 AI 的，用中性色写“AI 在管”，不用黄红
  assert.equal(cell[1], 'neutral');
  assert.match(cell[2], /AI 在管/);
  // 后端明说要你出手（owner_action: do）时才用黄
  const mine = R.page({ ...v, overview: { as_of: '2026-10-12T00:29:00+08:00', score: 90, signals: [{ id: 'computer', level: 'ok', owner_action: 'do' }], reasons: [] } }, { ...ctx, ov });
  assert.equal(/<li class="cp-tri-cell is-(\w+)" data-signal="computer">/.exec(mine)[1], 'yellow');
  assert.match(cell[2], /内存\/系统资源偏高/);
  assert.match(cell[2], /系统内核内存 8.5 GB，偏高/);
  assert.doesNotMatch(cell[2], /处理器偏热|处理器 24%/);
  assert.match(pc, /这是 10月10日 14:18 读到的，之后 34 小时没读到新的/);
  assert.match(pc, /笔记本（副机）<\/b><span>在线/);
  assert.match(R.backup(v, ctx), /上传器：18:47 读到时没在传。现在有没有在上传还不知道。/);
  const today = R.todayBlock(v, ctx);
  assert.equal((today.match(/验收/g) || []).length, 1, '验收只剩一行');
  assert.match(today, /AI 今天核对登记事项 3 次，一共核对 3 项次、1 项通过/);
  assert.match(today, /2 个出过错（你的任务 1 个、别的软件自带的 1 个）/);
  assert.match(today, /出过错的：小米妙享（23:36）、Edge 更新（23:40，别的软件自带）/);
  const proj = R.projects(v, ctx);
  // 等你动手的露在外面（红）；AI 在查的收进一行（黄）
  assert.match(proj, /<ul class="cp-proj-list"><li class="cp-proj is-red"[^>]*>.*?<b>乙<\/b>/);
  assert.match(proj, /<details class="cp-fold" id="proj-ai">.*<li class="cp-proj is-yellow"[^>]*>.*?<b>甲<\/b>/);
  const info = { name: '电脑配置与恢复', run_health: 'ok', overview: 'ok', know: [{ text: '自启动新增 2 条 <测试>', observed_at: '2026-10-12T00:20:00+08:00' }] };
  const known = R.projects(normalize({ projects: { items: [info] } }), ctx);
  assert.match(known, /cp-proj is-green.*<small>知道就行：自启动新增 2 条 &lt;测试&gt;<\/small>/);
  assert.doesNotMatch(R.projects(normalize({ projects: { items: [{ ...info, know: [] }] } }), ctx), /知道就行|cp-project-know/);
  assert.equal(riverSnapshot(v).today_errors.length, v.today_activity.summary.errors.owner + v.today_activity.summary.errors.other);
  // 字段没到：不加原因句、不加笔记本行、不出空框
  const bare = normalize({ schema: 'pcconfig.cockpit-view.v1', sections: { computer: [{ id: 'computer_health', title: '电脑资源', text: '处理器 24%', state: 'ok' }] } });
  const pc0 = R.computer(bare, ctx);
  assert.doesNotMatch(pc0, /原因：|笔记本|cp-plan/);
  assert.deepEqual(riverSnapshot(bare).today_errors, []);
  // 要你处理的卡（公开版、没有 owner_actions）：短标题不遮 next_step；不写“办完后”；空说明不出栏；一个按钮都没有
  const todo = { id: 'pending-1', copy_ai_id: 'pending-1', title: '十月旅游去哪 · 三方盲测对照', project: '', where: 'pc', minutes: 5,
    next_step: '两道题各选一个，点页里的“生成我的答复” 最后核对：2026-10-12 13:34（北京时间）。', done_when: 'AI 收到你的答复后关闭本条。',
    steps: ['在电脑上打开汇报页'], options: [], why_you: '这是你自己的选择', consequence: '待补说明', at: '2026-10-12T12:49:00+08:00' };
  const one = (x) => R.needCards(normalize({ schema: 'pcconfig.cockpit-view.v1', need_you: [x] }), ctx);
  const d = one({ ...todo, ask_kind: 'decision' });
  assert.match(d, /<ol class="cp-steps"><li>在电脑上打开汇报页<\/li><li>两道题各选一个，点页里的“生成我的答复”<\/li><\/ol>/);
  assert.match(d, /<p class="cp-ask-info">得在电脑前办，约 5 分钟<\/p>/);
  assert.doesNotMatch(d, /待补说明|不做会怎样|项目：|复制|最后核对|办完后|<button/);
  const a = one({ ...todo, ask_kind: 'action' });
  assert.doesNotMatch(a, /<button|data-copy/);
  const q = one({ ...todo, ask_kind: 'decision', questions: [{ id: 'q1', text: '去哪', options: ['海边', '山里'], note: true }, { id: 'q2', text: '几天', options: ['三天', '五天'] }] });
  assert.equal((q.match(/class="cp-q"/g) || []).length, 2);
  assert.match(q, /<b>第 1 题<\/b>去哪<\/p><ul class="cp-opts-text"><li>海边<\/li><li>山里<\/li><\/ul>/);
  assert.doesNotMatch(q, /data-note|<button/);
  // 旧条目只有 options：当成一道题
  assert.equal((one({ ...todo, options: ['甲', '乙'] }).match(/class="cp-q"/g) || []).length, 1);
})().catch((e) => { console.error(e); process.exit(1); });
"""


class CockpitW2DisplayTest(unittest.TestCase):
    def test_w2_display_rules(self):
        r = subprocess.run(['node', '-e', SCRIPT, COCKPIT], text=True, capture_output=True, encoding='utf8')
        self.assertEqual(r.returncode, 0, r.stderr + r.stdout)


if __name__ == '__main__':
    unittest.main()

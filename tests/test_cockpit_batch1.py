"""驾驶舱第一批改进（数据全部虚构）：开头一句话结论和待办标题、旧快照不冒充现在、读不到时卡片变淡、
颜色只看要不要你出手、出错只数没恢复的、体检说到哪一步、你得知道 / 网站上次发布（字段在才出）、首页备份措辞。"""
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COCKPIT = (ROOT / 'site-astro' / 'src' / 'cockpit').as_uri() + '/'
OVERVIEW = (ROOT / 'site-astro' / 'public' / '_overview' / 'overview-screen.js').as_uri()

SCRIPT = r"""
const assert = require('node:assert/strict');
(async () => {
  const [base, ovUrl] = process.argv.slice(1);
  const { normalize, riverSnapshot, govState } = await import(base + 'model.js');
  const R = await import(base + 'render.js');
  const OV = await import(ovUrl);
  const now = new Date('2026-10-12T15:00:00+08:00');
  const at = '2026-10-12T14:59:30+08:00';
  const ov = (extra = {}) => ({ schema: 'overview.v1', score: 53, level: 'act', as_of: at, stale_after_seconds: 180, owner_count: 1, owner_urgent: false, reasons: [],
    signals: [{ id: 'computer', level: 'act' }, { id: 'today_tasks', level: 'act', value: 2 }, { id: 'backup', level: 'ok', value: 0 }],
    sections: { need_you: { level: 'watch', word: '留意' }, computer: { level: 'act', word: '要处理' }, automation: { level: 'act', word: '要处理' }, backup_cloud: { level: 'ok', word: '正常' }, today: { level: 'act', word: '要处理' }, projects: { level: 'act', word: '要处理' } }, ...extra });
  const todo = { id: 'pending-trip', title: '虚构旅行去哪 · 对照', ask_kind: 'decision', minutes: 3, where: 'pc', questions: [{ id: 'T1', text: '去哪', options: ['甲地', '乙地'] }] };
  const base0 = {
    schema: 'pcconfig.cockpit-view.v1', served_at: at, collected_at: at, overview: ov(), need_you: [todo],
    sections: { computer: [{ id: 'computer_health', title: '处理器', text: '电脑读数：处理器 40%，60℃', state: 'ok', observed_at: at },
                           { id: 'system_resources', title: '内存/系统资源', text: '虚构内核内存偏高', state: 'attention', observed_at: at }],
                remote: [{ id: 'remote', title: '远程连接', text: '远程连接在线；网络正常', state: 'ok', observed_at: at }],
                backup_cloud: [{ id: 'backups', title: '备份', text: '虚构副本 5 类没拿到完成记录。交给 AI 核对，下面会写明是否已经开始。', state: 'attention', observed_at: at }],
                today: [{ id: 'learning', title: '学习进度', text: '虚构课程 2/28。进度文件超过 3 天没更新。', state: 'attention', observed_at: at }] },
    automation: { state: 'ok', observed_at: at, items: [
      { id: 'gov', name: '每周体检', state: 'running', last_run_at: '2026-10-12T12:58:00+08:00', note: '这周已跑过' },
      { id: 'bill', name: '虚构费用', state: 'success', failures_7d: 23, last_run_at: at },
      { id: 'flaky', name: '虚构反复失败', state: 'failed', failures_7d: 6, last_run_at: at }] },
    governance: { id: 'gov', next_run_at: '2026-10-19T12:56:00+08:00', last_run_ok: null, status_note: '这周已跑过', last_run: null },
    today_activity: { summary: { tasks_run: 40, tasks_failed: 2, errors: { owner: 2, other: 0 } }, errors: [
      { name: '虚构周检', at: '2026-10-12T11:30:00+08:00', owner: 'owner', recovered: false },
      { name: '虚构费用', at: '2026-10-12T12:00:00+08:00', owner: 'owner', recovered: true }] },
    security: { personal_data: { state: 'unlocked', expires_at: '2026-10-13T13:37:00+08:00' }, unrestricted: { state: 'inactive' }, windows: { state: 'unlocked' }, computer: { online: true, uptime_hours: 5 }, observed_at: at },
  };
  const ctx = { now, offline: false, projectUrls: {}, img: {}, ov: OV };
  const v = normalize(base0);

  // 1 开头：后端给的是 decision，标题照样列出来；动词按种类说；点标题跳到那张卡
  let o = R.REGIONS.overview(v, ctx);
  assert.match(o, /要你拍板 <b>1<\/b> 件事/);
  assert.match(o, /<a href="#todo-pending-trip">.*虚构旅行去哪 · 对照/);
  assert.match(o, /约 3 分钟.*要在电脑上办/);
  // 结论后半句：三格各一句；写着交给 AI 的用中性色
  assert.match(o, /其余都有人管：电脑内存\/系统资源偏高、自动任务今天 1 个出错还没恢复，AI 在管；备份都按时。/);
  // 2 自动任务只数没恢复的，已恢复的写在灰色小字；已恢复的反复出错不再挂着，仍失败的才挂
  assert.match(o, /今天 1 个出错还没恢复/);
  assert.match(o, /今天出过错、已恢复 1 个/);
  assert.match(o, /这周反复出错：虚构反复失败 6 次/);
  assert.doesNotMatch(o, /虚构费用 23 次/);
  // 3 颜色只看要不要你出手：三格没有红黄；健康分照旧在
  assert.doesNotMatch(o, /cp-tri-cell is-(red|yellow)/);
  assert.equal((o.match(/cp-tri-cell is-neutral/g) || []).length, 2);
  assert.match(o, /电脑健康 <b>53<\/b>/);
  // 分区灯：没有要你做的“要处理”换成“AI 在管”；要你做那一区照旧
  assert.match(R.REGIONS['lamp-computer'](v, ctx), /is-neutral.*AI 在管/);
  assert.doesNotMatch(R.REGIONS['lamp-computer'](v, ctx), /要处理/);
  assert.match(R.REGIONS['lamp-need-you'](v, ctx), /留意/);
  // 4 超过 3 件只列 3 个，写还有 N 件
  const many = normalize({ ...base0, overview: ov({ owner_count: 5 }), need_you: [1, 2, 3, 4, 5].map((i) => ({ id: 't' + i, title: '虚构事 ' + i, ask_kind: 'do' })) });
  o = R.REGIONS.overview(many, ctx);
  assert.equal((o.match(/<li><a href="#todo-t/g) || []).length, 3);
  assert.match(o, /还有 2 件 ↓/);
  assert.match(o, /要你动手 <b>5<\/b> 件事/);
  // 5 0 件：写“现在没有要你做的事”加三格各一句
  o = R.REGIONS.overview(normalize({ ...base0, overview: ov({ owner_count: 0 }), need_you: [] }), ctx);
  assert.match(o, /现在没有要你做的事<\/p><p class="cp-you-rest">电脑内存\/系统资源偏高、自动任务今天 1 个出错还没恢复，AI 在管；备份都按时。/);
  // 6 首帧是构建时的数：写明几点、正在读最新
  o = R.REGIONS.overview(v, { ...ctx, phase: 'snapshot' });
  assert.match(o, /class="cp-snap".*这是 10月12日 14:59 的数，不是现在的<span class="cp-snap-reading">，正在读最新…/);
  assert.doesNotMatch(R.REGIONS.overview(v, { ...ctx, phase: 'live' }), /cp-snap/);
  // 7 读不到电脑：事实卡变淡、灯灰、写读不到（最后几点读到），图表链接收起
  const vg = normalize({ ...base0, grafana: { links: [{ id: 'cpu-gpu', label: 'CPU 和显卡', url: 'https://example.invalid/d/1' }], url: 'https://example.invalid/' } });
  const off = R.computer(vg, { ...ctx, offline: true });
  assert.doesNotMatch(off, /cp-card is-(green|yellow|red|neutral)/);
  assert.match(off, /cp-card is-gray is-off/);
  assert.match(off, /读不到（最后 14:59 读到）/);
  assert.doesNotMatch(off, /example\.invalid/);
  assert.match(off, /图表链接先收起/);
  assert.match(R.computer(vg, ctx), /example\.invalid/);
  // 8 卡片：写着交给 AI 的是中性色；数据源停了是灰色；后端给了触发项才写
  assert.match(R.backup(v, ctx), /cp-card is-neutral/);
  const today = R.todayBlock(v, ctx);
  assert.match(today, /cp-card is-gray"><h3>.*学习进度/);
  assert.match(today, /数据源停了/);
  const trig = normalize({ ...base0, sections: { ...base0.sections, computer: [{ id: 'proxy_traffic', title: '本机代理流量', text: '近 60 分钟 2.1 GB，超过提醒线。', state: 'attention', observed_at: at, trigger_text: '虚构程序 1 小时上传超过 2GB' }] } });
  assert.match(R.computer(trig, ctx), /触发的是：虚构程序 1 小时上传超过 2GB/);
  assert.doesNotMatch(R.computer(v, ctx), /触发的是/);
  // owner_action 明说不用你：中性；明说要你：保留黄
  const own = (oa) => R.computer(normalize({ ...base0, sections: { ...base0.sections, computer: [{ id: 'x', title: '虚构卡', text: '虚构读数偏高', state: 'attention', observed_at: at, owner_action: oa }] } }), ctx);
  assert.match(own('none'), /cp-card is-neutral/);
  assert.match(own('do'), /cp-card is-yellow/);
  // 9 每周体检：不写“这周已跑过”，写到了哪一步
  assert.equal(govState(v, now).state, 'running');
  assert.match(R.needYou(v, ctx), /每周 AI 体检：10月12日 12:58 开始，正在跑（还没收到跑完的回执）/);
  const river = riverSnapshot(v, now);
  assert.equal(river.automation.items.find((t) => t.id === 'gov').plain.status_note, '10月12日 12:58 开始，正在跑（还没收到跑完的回执）');
  assert.doesNotMatch(JSON.stringify(river), /这周已跑过/);
  // 10 “你得知道”（后端 must_know）：字段不在不出；empty 一行；unavailable 照实说读不到；有条目最多 5 条，收起的折叠；远程卡按 must_know_id 跳过去
  assert.doesNotMatch(R.REGIONS.overview(v, ctx), /cp-know/);
  assert.match(R.REGIONS.overview(normalize({ ...base0, must_know: { state: 'empty', text: '没有要你知道的新事', items: [], archived_items: [] } }), ctx), /没有要你知道的新事/);
  const mkUn = R.REGIONS.overview(normalize({ ...base0, must_know: { state: 'unavailable', text: '', items: [], archived_items: [] } }), ctx);
  assert.match(mkUn, /你得知道：这会儿读不到.*不代表没有新事/);
  assert.doesNotMatch(mkUn, /没有要你知道的新事/);
  const items = [{ id: 'pending-net', kind: 'repairing', text: '虚构两台电脑网络偶尔断开。AI 在跟进，你不用操作。', at: '2026-10-12T14:00:00+08:00', exit_when: 'AI 核实解决后转为已恢复，3 天后收起' },
    ...[1, 2, 3, 4, 5].map((i) => ({ id: 'r' + i, kind: 'recovered', text: '虚构已恢复 ' + i, at: '2026-10-12T13:00:00+08:00' }))];
  const vk = normalize({ ...base0, must_know: { state: 'ok', text: '', items, archived_items: [{ id: 'old1', kind: 'report', text: '虚构旧汇报' }] },
    sections: { ...base0.sections, remote: [{ id: 'remote', title: '远程连接', text: '此刻能连上；间歇断开还在查。', state: 'ok', color: 'ok', observed_at: at, must_know_id: 'pending-net' }] } });
  o = R.REGIONS.overview(vk, ctx);
  assert.equal((o.match(/<li id="know-(pending|r)/g) || []).length, 5);
  assert.match(o, /AI 在修.*虚构两台电脑网络偶尔断开.*AI 核实解决后转为已恢复/);
  assert.match(o, /已恢复.*虚构已恢复 1/);
  assert.match(o, /最近收起的 1 条/);
  const remote = R.computer(vk, ctx);
  assert.match(remote, /此刻能连上；间歇断开还在查/);
  assert.match(remote, /href="#know-pending-net"/);
  // 11 网站上次成功发布（后端 website_release）：字段不在不出；成功一行用后端的话；读不到灰着
  assert.doesNotMatch(today, /cp-release/);
  assert.match(R.todayBlock(normalize({ ...base0, website_release: { state: 'success', published_at: '2026-10-12T08:18:37+08:00', version: 'c438b00a9f84', verified: true, text: '网站上次成功发布 10-12 08:18，回读通过，版本 c438b00a9f84' } }), ctx), /cp-release"><span class="cp-dot is-green".*网站上次成功发布 10-12 08:18，回读通过/);
  assert.match(R.todayBlock(normalize({ ...base0, website_release: { state: 'unavailable', verified: false } }), ctx), /cp-release is-off"><span class="cp-dot is-gray".*读不到/);
  // 11b 颜色读后端 color：卡片、首屏三格、分区灯、事项、自动任务的河
  const colored = normalize({ ...base0,
    overview: ov({ signals: [{ id: 'computer', level: 'act', color: 'neutral', ai_handling: 'AI 在管：虚构内存偏高在盯' }, { id: 'today_tasks', level: 'act', value: 1, recovered_today: 2, color: 'neutral' }, { id: 'backup', level: 'ok', value: 0, color: 'ok' }],
      sections: { need_you: { level: 'watch', color: 'yellow' }, computer: { level: 'act', color: 'neutral' }, automation: { level: 'act', color: 'neutral' }, backup_cloud: { level: 'ok', color: 'ok' }, today: { level: 'act', color: 'neutral' }, projects: { level: 'act', color: 'neutral' } },
      task_health: { current_repeated_7d: 0 } }),
    need_you: [{ ...todo, color: 'yellow', report_title: '虚构汇报页标题', last_checked_at: '2026-10-12T14:45:00+08:00' }],
    sections: { ...base0.sections, computer: [{ id: 'system_resources', title: '内存/系统资源', text: '虚构内核内存偏高', state: 'attention', color: 'neutral', ai_handling: 'AI 在管：虚构内存在盯', observed_at: at },
      { id: 'proxy_traffic', title: '本机代理流量', text: '今天 30 GB。', state: 'attention', color: 'neutral', observed_at: at, trigger_items: [{ reason: 'program_hour_upload', name: '虚构程序', value_gb: 3, threshold_gb: 2 }] }],
      today: [{ id: 'learning', title: '学习进度', text: '虚构课程 2/28', state: 'attention', color: 'unavailable', observed_at: at }] },
    automation: { ...base0.automation, items: [...base0.automation.items, { id: 'sw', name: '虚构软件维护', state: 'failed', color: 'neutral', ai_handling: 'AI 在管：虚构软件正在使用，本次更新暂缓' }] } });
  o = R.REGIONS.overview(colored, ctx);
  assert.match(o, /cp-tri-cell is-neutral" data-signal="computer">.*AI 在管<\/span>.*虚构内存偏高在盯/);
  assert.match(o, /今天 1 个出错还没恢复/);
  assert.match(o, /今天出过错、已恢复 2 个/);
  assert.doesNotMatch(o, /这周反复出错/);
  assert.match(R.REGIONS['lamp-need-you'](colored, ctx), /is-yellow.*要你处理/);
  assert.match(R.REGIONS['lamp-computer'](colored, ctx), /is-neutral.*AI 在管/);
  const pcc = R.computer(colored, ctx);
  assert.match(pcc, /cp-card is-neutral">.*内存\/系统资源.*AI 在管：虚构内存在盯/);
  assert.match(pcc, /触发的是：虚构程序 1 小时上传 3\.0GB，超过 2GB/);
  assert.match(R.todayBlock(colored, ctx), /cp-card is-gray">.*学习进度.*数据源停了/);
  const ask = R.needYou(colored, ctx);
  assert.match(ask, /cp-ask" id="todo-pending-trip">.*cp-dot is-yellow/);
  assert.match(ask, /汇报页：虚构汇报页标题/);
  assert.match(ask, /最后核对 14:45/);
  const rv = riverSnapshot(colored, now).automation.items.find((t) => t.id === 'sw');
  assert.equal(rv.color, 'neutral');
  assert.match(rv.ai_handling, /暂缓/);
  // 体检 phase：跑完写后端结果句；正在跑写几点开始
  const gv = (g) => R.needYou(normalize({ ...base0, governance: { ...base0.governance, ...g } }), ctx);
  assert.match(gv({ phase: 'completed', status_note: '跑完：修好8、关掉0、还在跟21、转暂缓6、要你2', last_run: { started_at: '2026-10-12T12:58:00+08:00', ended_at: '2026-10-12T14:53:00+08:00' } }), /每周 AI 体检：跑完：修好8、关掉0、还在跟21、转暂缓6、要你2（10月12日 14:53）/);
  assert.match(gv({ phase: 'running', last_run: { started_at: '2026-10-12T12:58:00+08:00' } }), /每周 AI 体检：10月12日 12:58 开始，正在跑/);
  // 首页小屏读 color
  const sm = OV.html(ov({ signals: [{ id: 'computer', level: 'act', color: 'neutral' }, { id: 'today_tasks', level: 'act', value: 1, recovered_today: 1, color: 'neutral' }, { id: 'backup', level: 'ok', value: 0, color: 'ok' }] }), { size: 'small', now: now.getTime() });
  assert.match(sm, /ov-sig is-neutral" data-signal="computer">.*?AI 在管/);
  assert.match(sm, /data-signal="today_tasks">.*?1<small>个没恢复<\/small>.*?AI 在管/);
  // 12 安全和授权：手机那一行
  assert.match(R.security(v, ctx), /cp-sec-line.*资料已解锁到 10月13日 13:37 · 无限制授权关 · 未锁屏 · 能连上/);
  // 12b 离线、首帧及读取失败都不能把旧安全状态当现在；恢复不改写原 view
  const securityBefore = JSON.stringify(v), liveSecurity = R.security(v, ctx);
  const priorStates = [v, { ...v, security: { ...v.security, personal_data: { state: 'locked' }, unrestricted: { state: 'active', expires_at: at }, windows: { state: 'locked' } } }];
  for (const [stateCtx, ok] of [[{ ...ctx, offline: true }, true], [{ ...ctx, phase: 'snapshot' }, true], [ctx, false]]) {
    for (const prior of priorStates) for (const observedAt of [at, null]) {
      const view = { ...prior, ok, security: { ...prior.security, observed_at: observedAt } }, before = JSON.stringify(view);
      const html = R.security(view, stateCtx), mobile = html.split('</a>')[0];
      const desktop = [...html.matchAll(/<a class="cp-sec-item"[^]*?<\/a>/g)].map((m) => m[0]);
      const lastRead = observedAt ? '上次 14:59 读到' : '还没读到过';
      assert.equal(desktop.length, 4);
      for (const item of desktop.slice(0, 3)) {
        assert.match(item, /cp-sec-word"><span class="cp-dot is-gray"[^>]*><\/span>没读到<\/span>/);
        assert.ok(item.includes(`<span class="cp-sec-sub">${lastRead}</span>`));
      }
      assert.match(mobile, /cp-dot is-gray/);
      assert.ok(mobile.includes(`资料、授权和锁屏状态没读到（${lastRead}）`));
      assert.doesNotMatch(mobile + desktop.slice(0, 3).join(''), /已解锁|锁着|开着|正常关着|已锁屏|未锁屏/);
      assert.ok(desktop[3].includes(stateCtx.offline || !ok ? '连不上' : '>能</span>'));
      assert.equal(JSON.stringify(view), before);
      assert.equal(R.security({ ...view, ok: true }, ctx), R.security({ ...prior, security: { ...prior.security, observed_at: observedAt } }, ctx));
    }
  }
  assert.equal(JSON.stringify(v), securityBefore);
  assert.equal(R.security(v, ctx), liveSecurity);
  // 14 下一步和大标题说的是同一件事时不再当成第 N 步接在后面；不同的事照旧接上
  const same = R.readTodo({ title: '虚构旅游去哪 · 三方对照', next_step: '虚构旅游去哪：甲、乙还是丙', steps: ['看这条下面的两道题'] }, now);
  assert.deepEqual(same.steps, ['看这条下面的两道题']);
  const diff = R.readTodo({ title: '虚构旅游去哪 · 三方对照', next_step: '先在电脑上打开汇报页', steps: ['看这条下面的两道题'] }, now);
  assert.deepEqual(diff.steps, ['看这条下面的两道题', '先在电脑上打开汇报页']);
  // 13 首页小屏：备份写“0 项有问题”，不写成“0 项 · 正常”
  const small = OV.html(ov(), { size: 'small', now: now.getTime() });
  assert.match(small, /data-signal="backup">.*?<span class="ov-sig-value">0<small>项有问题<\/small>/);
  // 首页小屏的颜色也只看要不要你出手：电脑、今天的任务有状况但没要你做时是中性色“AI 在管”，不再红色配“交给 AI”
  assert.match(small, /ov-sig is-neutral" data-signal="computer">.*?AI 在管/);
  assert.match(small, /ov-sig is-neutral" data-signal="today_tasks">.*?AI 在管/);
  assert.doesNotMatch(small, /交给 AI|ov-sig is-red/);
  const smallDo = OV.html(ov({ signals: [{ id: 'computer', level: 'act', owner_action: 'do' }, { id: 'today_tasks', level: 'act', value: 2, owner_action: 'know' }, { id: 'backup', level: 'ok', value: 0 }] }), { size: 'small', now: now.getTime() });
  assert.match(smallDo, /ov-sig is-red" data-signal="computer">.*?要你看/);
  assert.match(smallDo, /ov-sig is-yellow" data-signal="today_tasks">.*?要你知道/);
  // 后端给了 task_health 时，今天的任务只数还没恢复的；都恢复了就是正常
  const smallTh = (n) => OV.html(ov({ task_health: { unrecovered_today: n, recovered_today: 1 } }), { size: 'small', now: now.getTime() });
  assert.match(smallTh(1), /data-signal="today_tasks">.*?<span class="ov-sig-value">1<small>个没恢复<\/small>.*?AI 在管/);
  assert.match(smallTh(0), /ov-sig is-green" data-signal="today_tasks">.*?0<small>个没恢复<\/small>.*?正常/);
})().catch((e) => { console.error(e); process.exit(1); });
"""


class CockpitBatch1Test(unittest.TestCase):
    def test_batch1_rules(self):
        r = subprocess.run(['node', '-e', SCRIPT, COCKPIT, OVERVIEW], text=True, capture_output=True, encoding='utf8')
        self.assertEqual(r.returncode, 0, r.stderr + r.stdout)


if __name__ == '__main__':
    unittest.main()

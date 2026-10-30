// 驾驶舱前后端字段对齐（北京时间 2026-10-30 两份核对查出的说错、读错、颜色问题）：全部数据虚构。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, runLine, ownerNow, ledgerDue } from '../site-astro/src/cockpit/render.js';
import { html as ovHtml } from '../site-astro/public/_overview/overview-screen.js';

const now = new Date('2026-10-30T11:00:00+08:00'), at = '2026-10-30T10:58:00+08:00';
const base = (extra = {}) => ({ schema: 'pcconfig.cockpit-view.v1', served_at: at, ...extra });
const ov = { stale: () => false, lamp: () => '' };
const ctx = { now, offline: false, phase: 'live', projectUrls: {}, img: {}, ov };
const text = (h) => h.replace(/<[^>]*>/g, '');
const css = readFileSync(new URL('../site-astro/src/cockpit/cockpit.css', import.meta.url), 'utf8');

test('副机在不在线读 laptop.connection，不读自动任务健康的 laptop.state', () => {
  const remote = { remote: [{ id: 'r', title: '远程连接', text: '能连上', state: 'ok', observed_at: at }] };
  const on = REGIONS.computer(normalize(base({ sections: remote, laptop: { state: 'attention', connection: 'online' } })), ctx);
  assert.match(on, /<b>笔记本（副机）<\/b><span>在线<\/span>/);
  const off = REGIONS.computer(normalize(base({ sections: remote, laptop: { state: 'ok', connection: 'offline' } })), ctx);
  assert.match(off, /笔记本（副机）<\/b><span>离线/);
  // 只有 state（旧读法）不能当连接：不写在线也不写离线
  assert.doesNotMatch(REGIONS.computer(normalize(base({ sections: remote, laptop: { state: 'online' } })), ctx), /笔记本（副机）/);
});

test('AI 正在干活：排队、等你确认、等你解锁资料算还在办，照后端 status_text 写；卡住件数以后端 stuck_count 为准', () => {
  const row = (id, status, extra = {}) => ({ id, status, status_text: { queued: '在排队', waiting_confirm: '等你确认', waiting_data: '等你解锁个人资料', running: '在跑', network_retry: '网络在重连' }[status], vendor: 'claude', model_text: 'Claude Opus 5.5', last_activity_at: at, ...extra });
  const rows = [row('a', 'queued'), row('b', 'waiting_confirm'), row('c', 'waiting_data'), row('d', 'running'),
    // 调度来源的自动网络重连不算卡住（合同 C:23）；行上给了 stuck 就照它
    row('e', 'network_retry', { source_kind: 'cockpit_dispatch' })];
  const v = normalize(base({ viewer: { kind: 'owner', device_state: 'ok' }, ai_running: { count: 5, stuck_count: 0, observed_at: at, rows } }));
  assert.deepEqual(v.ai_running.rows.map((r) => r.status), ['queued', 'waiting_confirm', 'waiting_data', 'running', 'network_retry']);
  assert.deepEqual(v.ai_running.rows.map((r) => r.stuck), [false, false, false, false, false]);
  const html = REGIONS.home(v, ctx);
  assert.match(html, /AI 正在干活：5 个<\/h2>/);
  // 这几种状态词写在主行开头（左边那一列只放符号，不叠字）
  for (const s of ['在排队', '等你确认', '等你解锁个人资料']) assert.match(html, new RegExp(`<span class="cp-run-doing[^"]*"><span class="cp-run-word is-[a-z]+">${s}</span>`));
  assert.doesNotMatch(html, /多半已经结束|看不出在干嘛/);
  // 后端 stuck_count 说 1 个卡住（行上看不出来也照它）
  assert.equal(runLine({ count: 2, stuck_count: 1, rows: [] }), 'AI 在干活：2 个（1 个卡住）');
  const stuck = normalize(base({ ai_running: { count: 2, stuck_count: 2, observed_at: at, rows: [row('x', 'network_retry'), row('y', 'login_failed')] } }));
  assert.deepEqual(stuck.ai_running.rows.map((r) => r.stuck), [true, true]);
  assert.equal(runLine(stuck.ai_running), 'AI 在干活：2 个（2 个卡住，1 个要你看）');
  // 没给 stuck_count 的旧数据按行数
  assert.equal(normalize(base({ ai_running: { count: 1, observed_at: at, rows: [row('z', 'running', { stuck: true })] } })).ai_running.stuck_count, 1);
});

test('急不急读 overview.owner_urgent_count（数字）；行上截止只读 due_at，不从 done_when 猜', () => {
  const item = (id, extra = {}) => ({ id, title: '示例事 ' + id, ask_kind: 'action', ...extra });
  const v = normalize(base({ need_you: [item('a'), item('b')], overview: { owner_count: 2, owner_urgent: true, owner_urgent_count: 1 } }));
  assert.equal(ownerNow(v, now).urgent, 1);
  assert.match(REGIONS.overview(v, ctx), /cp-you-tag is-urgent">1 件急</);
  // 只有一件、不急：写“不急”，不写“都不急”
  const one = normalize(base({ need_you: [item('a')], overview: { owner_count: 1, owner_urgent: false, owner_urgent_count: 0 } }));
  assert.match(REGIONS.overview(one, ctx), /<span class="cp-you-tag">不急<\/span>/);
  // done_when 里写着日期也不当截止时间；due_at 才是
  const guess = normalize(base({ need_you: [item('a', { done_when: '2026-10-30 12:00 前做完' })] }));
  assert.equal(ownerNow(guess, now).items[0].r.hasDue, false);
  const due = normalize(base({ need_you: [item('a', { due_at: '2026-10-30T12:00:00+08:00' })] }));
  assert.equal(ownerNow(due, now).items[0].r.urgent, true);
  // 首页小屏同一口径，分数叫“电脑健康分”
  const small = (o) => text(ovHtml({ as_of: at, stale_after_seconds: 600, score: 46, signals: [], ...o }, { size: 'small', now: now.getTime() }));
  assert.match(small({ owner_count: 2, owner_urgent: true, owner_urgent_count: 1 }), /其中 1 件急/);
  assert.match(small({ owner_count: 1, owner_urgent: false, owner_urgent_count: 0 }), /不急/);
  assert.doesNotMatch(small({ owner_count: 1, owner_urgent: false, owner_urgent_count: 0 }), /都不急/);
  assert.match(small({ owner_count: 2, owner_urgent: false, owner_urgent_count: 0 }), /都不急/);
  assert.match(small({ owner_count: 0 }), /电脑健康分 46\/100/);
});

const ledgerView = (extra = {}) => normalize(base({
  ai_overdue: [
    { id: 'l1', title: '示例晚一天', overdue_since: '2026-10-29T10:00:00+08:00', overdue_days: 1, age_days: 20, stuck_reason: 'original_deadline_overdue', progress: '示例进展：已修好一半' },
    { id: 'l2', title: '示例晚九天', overdue_since: '2026-10-21T10:00:00+08:00', overdue_days: 9, age_days: 10, stuck_reason: 'original_deadline_overdue' },
    { id: 'l3', title: '示例没日子', age_days: 3, stuck_reason: 'undated_wake_condition' },
  ],
  ai_following: [
    { id: 'l1', title: '示例晚一天' }, { id: 'l2', title: '示例晚九天' }, { id: 'l3', title: '示例没日子' },
    { id: 'f1', title: '示例新期限', checkpoint_at: '2026-10-29T15:15:00+08:00', decision_due_at: '2026-10-30T18:00:00+08:00' },
    { id: 'f2', title: '示例明年', scheduled_at: '2027-09-06T09:00:00+08:00', scheduled_text: '约 9 月 6 日' },
    { id: 'f3', title: '示例没定日子' },
    { id: 'f4', title: '这件事的说明还不全，AI 会补好。' },
    ...['p1', 'p2', 'p3'].map((id) => ({ id, title: '一个平台上的结果还在等回复', placeholder: true })),
  ], ...extra }));

test('AI 账本：日期优先 AI 新定的期限、不是今年带年份、没日子写“—”；晚了按天数排；总句分开说', () => {
  assert.deepEqual(ledgerDue({ checkpoint_at: '2026-10-29T15:15:00+08:00', decision_due_at: '2026-10-30T18:00:00+08:00' }, now), { text: '10 月 30 日', old: '原定 10 月 29 日', at: Date.parse('2026-10-30T18:00:00+08:00') });
  assert.equal(ledgerDue({ scheduled_at: '2027-09-06T09:00:00+08:00', scheduled_text: '约 9 月 6 日' }, now).text, '约 2027 年 9 月 6 日');
  assert.equal(ledgerDue({}, now), null);
  const v = ledgerView({ viewer: { kind: 'owner', device_state: 'ok' } });
  const html = REGIONS.ledger(v, ctx);
  const table = /<table class="cp-ltable">([^]*?)<\/table>/.exec(html)?.[1] || '';
  // 晚了的按晚了几天从多到少；没天数的排后面
  assert.deepEqual([...table.matchAll(/cp-lt-title">(示例[^<]+)</g)].map((m) => m[1]).slice(0, 3), ['示例晚九天', '示例晚一天', '示例没日子']);
  assert.match(table, /示例新期限[^]*?<td class="cp-lt-due">10 月 30 日<small>原定 10 月 29 日<\/small><\/td><td class="cp-lt-lag"><span class="cp-lt-none">没晚<\/span>/);
  assert.match(table, /示例明年[^]*?<td class="cp-lt-due">约 2027 年 9 月 6 日<\/td>/);
  assert.match(table, /示例没定日子[^]*?<td class="cp-lt-due">—<\/td><td class="cp-lt-lag"><span class="cp-lt-none">—<\/span>/);
  assert.doesNotMatch(table, /没写</);
  assert.match(table, /<th class="cp-lt-due">该有结果的日子<\/th>/);
  assert.doesNotMatch(html, /回一句话/);
  // 窄屏列表：晚得多的在前，写出进展；原因代码写成人话，不露英文
  const list = /<div class="cp-ai" id="ai">([^]*?)<details class="cp-more" id="ai-rest">/.exec(html)?.[1] || '';
  assert.ok(list.indexOf('示例晚九天') < list.indexOf('示例晚一天'));
  assert.match(list, /原定 10 月 29 日，晚了 1 天 · 示例进展：已修好一半/);
  assert.match(list, /没写哪天该有结果，AI 在补上期限/);
  assert.doesNotMatch(html, /original_deadline_overdue|undated_wake_condition|ai_decision_due/);
  // 其余的分开说：有日子的“还没到日子”、没日子的“没定日子”；“说明还不全”的占位标题不列
  // 件数和筛选按钮、总句同一个数：不单列的照样计数，列表末尾写“另有 N 件没单列”
  assert.match(html, /<summary>其余 7 件：2 件还没到日子、5 件没定日子<\/summary>/);
  assert.match(html, /<p class="cp-ai-more">另有 3 件没单列（2 件同类私人事项，合在上面同名那行；1 件说明还没写全，AI 会补上）<\/p>/);
  assert.match(html, /<p class="cp-lt-more">另有 3 件没单列/);
  assert.doesNotMatch(html, /说明还不全/);
  // 进展是字符串时，复制内容不能把字符串自带的 .at 方法当成时间写进去
  assert.doesNotMatch(html, /native code/);
});

test('AI 账本公开版：标题一样的私人占位行合成一行；本人版行上有 open 就画“打开”组', () => {
  const pub = REGIONS.ledger(ledgerView({ viewer: { kind: 'public' } }), ctx);
  assert.equal((text(pub).match(/一个平台上的结果还在等回复/g) || []).length, 2); // 列表一行、表格一行
  assert.match(pub, /另有 2 件同类事（私人事项）/);
  const owner = { kind: 'owner', device_state: 'ok', device_kind: 'pc', device_machine: '副驾驶', capabilities: ['open', 'report'] };
  const open = { conversation: { machine: '主驾驶', url: 'claude://x', title: '示例' }, report: true, targets: [{ key: 'conversation', label: '打开对话' }] };
  const v = normalize(base({ viewer: owner, ai_overdue: [], ai_following: [{ id: 'o1', title: '示例有对话', checkpoint_at: '2026-11-02T10:00:00+08:00', open }] }));
  const html = REGIONS.ledger(v, ctx);
  assert.match(html, /data-open-item="o1" data-open-target="conversation">在主驾驶上打开对话/);
  assert.match(html, /data-report="o1">看汇报/);
});

test('AI 账本读不到电脑时保留“这是几点的数”；每周体检本周阶段和上次结果并列', () => {
  const g = { id: 'gov', next_run_at: '2026-11-02T13:04:00+08:00', phase: 'not_started',
    last_run: { started_at: '2026-10-22T18:34:00+08:00', counts: { fixed: 2, closed: 5, following: 40, deferred: 0, need_you: 3 } } };
  const v = normalize(base({ governance: g, ai_following: [{ id: 'a', title: '示例' }] }));
  const html = REGIONS.ledger(v, { ...ctx, offline: true });
  assert.match(html, /<p class="cp-snap">[^]*?读不到电脑，这是 10:58 的数<\/p>/);
  assert.doesNotMatch(REGIONS.ledger(v, ctx), /cp-snap/);
  assert.match(html, /本周 AI 体检：还没开始 · 下次 11月2日 13:04[^]*?上次 AI 体检（10月22日 18:34）记录：当时修好 2、关掉 5、转暂缓 0、还在跟 40、待你办 3 件</);
});

test('写着不用你管的 AI 晚了用中性色；你今天对 AI 说的话写截至几点；你放着的分两类', () => {
  assert.match(css, /\.cp-ai-cap \{[^}]*color: var\(--cp-neutral\)/);
  assert.match(css, /\.cp-lt-late \{[^}]*color: var\(--cp-neutral\)/);
  const oc = { complete: false, observed_at: '2026-10-30T10:10:00+08:00', by_category: [{ category: '纠正', count: 80 }, { category: '禁令', count: 3 }] };
  assert.match(REGIONS.today(normalize(base({ owner_corrections: oc })), ctx), /你今天对 AI 说的话：禁令 3、纠正 80（截至 10:10）<\/summary>/);
  const v = normalize(base({ deferred: Array.from({ length: 8 }, (_, i) => ({ id: 'd' + i, title: '示例等条件', action_owner: 'user' })), scheduled: [{ id: 's1', title: '示例甲' }, { id: 's2', title: '示例乙' }] }));
  assert.match(REGIONS.home(v, ctx), /<summary>你放着 10 件（等条件 8 · 排好日子 2）<\/summary>/);
});

test('存储页按返回的 max_age_seconds 判过期，给了预算依据就写出来', () => {
  const page = readFileSync(new URL('../site-astro/src/pages/cockpit/storage/index.astro', import.meta.url), 'utf8');
  assert.match(page, /data\.max_age_seconds/);
  assert.doesNotMatch(page, /age <= 7200000/);
  assert.match(page, /budget_used_bytes/);
  assert.match(page, /budget_basis/);
});

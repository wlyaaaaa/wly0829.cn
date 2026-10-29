// 驾驶舱本人设备上的按钮（后端条目上的 owner_actions）：只按 owner_actions 画；公开版没有这个字段就一个按钮都不画。全部数据虚构
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page } from '../site-astro/src/cockpit/render.js';
import { questionsFor, leftText, ownerBox, LABEL } from '../site-astro/src/cockpit/actions.js';

const now = new Date('2026-10-29T18:40:00+08:00');
const at = '2026-10-29T18:39:30+08:00';
const base = (extra = {}) => ({ schema: 'pcconfig.cockpit-view.v1', served_at: at, ...extra });
const ov = { stale: () => false, lamp: () => '' };
const ctx = (act) => ({ now, offline: false, phase: 'live', projectUrls: {}, img: {}, ov, ...(act ? { act } : {}) });
const acts = (state = {}, ui = {}) => ({ state: new Map(Object.entries(state)), ui: new Map(Object.entries(ui)), recent: new Map() });
const card = (id, oa, extra = {}) => ({ id, title: '示例事项 ' + id, headline: '示例事项 ' + id, ask_kind: 'action', owner_actions: oa, item_version: 'v-' + id, ...extra });
const BUTTONS = /data-act=|data-send=|data-exec|data-snooze|data-undo|cp-oa/;

test('没有 owner_actions（公开版、旧数据）：一个本人按钮都不画，页面和原来一样', () => {
  const plain = { id: 'n1', title: '示例事项：去办一下', ask_kind: 'action', why_you: '示例原因' };
  const v = normalize(base({ need_you: [plain], ai_following: [{ id: 'a1', title: '示例 AI 在跟' }], deferred: [{ id: 'd1', title: '示例暂缓', action_owner: 'user' }],
    must_know: { state: 'ok', items: [{ id: 'k1', kind: 'repairing', text: '示例在修的事，还在查' }] },
    ai_running: { count: 1, stuck_count: 0, observed_at: at, rows: [{ id: 'r1', status: 'running', vendor: 'claude', title: '示例活' }] } }));
  const html = page(v, ctx(acts()));
  assert.doesNotMatch(html, BUTTONS);
  assert.doesNotMatch(html, /owner-recent|你最近处理的|写不回|通知没发出去/);
  // 原来的复制按钮也去掉了（第三步）：没有 owner_actions 就一个按钮都没有
  assert.doesNotMatch(html, /<button[^>]*(data-copy|data-act|data-pick)/);
  assert.doesNotMatch(REGIONS['need-you'](v, ctx()), /<button|data-copy/);
  // owner_actions 是空数组也不画
  const empty = normalize(base({ need_you: [{ ...plain, owner_actions: [] }] }));
  assert.equal(REGIONS['need-you'](empty, ctx()), REGIONS['need-you'](normalize(base({ need_you: [plain] })), ctx()));
});

test('按钮只按 owner_actions 画，文字照定好的，不多加', () => {
  const all = ['note', 'seen', 'ack', 'done', 'dismiss', 'snooze', 'confirm', 'redo'];
  for (const a of all) {
    const v = normalize(base({ need_you: [card('n-' + a, [a])] }));
    const html = REGIONS['need-you'](v, ctx(acts()));
    const shown = [...html.matchAll(/data-act="(\w+)"[^>]*>([^<]+)</g)].map((m) => [m[1], m[2]]);
    assert.deepEqual(shown, [[a, LABEL[a]]], a);
    // 卡片上没有旧的复制按钮
    assert.doesNotMatch(html, /data-copy-text|data-copy-answer/);
  }
  // 卡片固定三句：做什么；为什么是你、不做会怎样；怎么办、大概多久
  const v = normalize(base({ need_you: [card('n-x', ['done', 'note'], { why_you: '只有你能碰到电脑', consequence: '今晚的备份会跳过一次', steps: ['把备份盘插回去'], minutes: 2, mobile_method: { kind: 'in_person' } })] }));
  const html = REGIONS['need-you'](v, ctx(acts()));
  assert.match(html, /<b>为什么是你<\/b>只有你能碰到电脑。<b>不做会怎样<\/b>今晚的备份会跳过一次。/);
  assert.match(html, /<b>怎么办<\/b>把备份盘插回去。<span class="cp-own-how">得在电脑前办，约 2 分钟<\/span>/);
  // 会交给 AI 的卡片带“交给：Claude ▾”；点过改成 GPT 就写 GPT
  assert.match(html, /data-exec[^>]*>交给：Claude ▾</);
  assert.match(REGIONS['need-you'](v, ctx(acts({}, { 'n-x': { executor: 'gpt' } }))), /data-exec[^>]*>交给：GPT ▾</);
});

test('答题：questions 用每题 id，options 是单题 choice；字符串选项以原字符串为值，对象选项用 value；每题都选了才能交', () => {
  assert.deepEqual(questionsFor({ options: ['先上', '一起上'] }), [{ id: 'choice', text: '', options: [{ value: '先上', text: '先上', detail: '', rec: false }, { value: '一起上', text: '一起上', detail: '', rec: false }] }]);
  // AI 建议最多一个：后面再标的不算
  assert.deepEqual(questionsFor({ options: [{ value: 'A', text: '甲', recommended: true, detail: ' 点了会怎样 ' }, { value: 'B', text: '乙', recommended: true }] })[0].options.map((o) => [o.rec, o.detail]), [[true, '点了会怎样'], [false, '']]);
  const x = card('q1', ['answer', 'note'], { ask_kind: 'decision', questions: [{ id: 'K1', text: '推哪些', options: [{ value: 'A', text: '只推三种' }, { value: 2, label: '都推' }] }, { id: 'K2', text: '夜里', options: ['照常推'] }] });
  assert.deepEqual(questionsFor(x).map((q) => [q.id, q.options.map((o) => o.value)]), [['K1', ['A', 2]], ['K2', ['照常推']]]);
  const one = REGIONS['need-you'](normalize(base({ need_you: [x] })), ctx(acts({}, { q1: { answers: { K1: { value: 'A' } } } })));
  assert.match(one, /data-qid="K1"/);
  assert.match(one, /data-val="&quot;A&quot;" aria-pressed="true"/);
  assert.match(one, /data-val="2" aria-pressed="false"/);
  assert.match(one, /data-send="answer" disabled/);
  assert.match(one, /每道题都选一个，才能交/);
  const both = REGIONS['need-you'](normalize(base({ need_you: [x] })), ctx(acts({}, { q1: { answers: { K1: { value: 'A' }, K2: { value: '照常推', text: '示例说明' } } } })));
  assert.match(both, /data-send="answer">交给 AI</);
  assert.match(both, /data-qnote[^>]*value="示例说明"/);
});

test('交出去以后：卡片变灰，回执的话 + 撤回 + 倒数；撤回期过了写点完会怎样；24 小时的写到几点前', () => {
  const x = card('n1', ['done', 'note']);
  const v = normalize(base({ need_you: [x] }));
  const receipt = { id: 'act-000', status: 'waiting_undo', created_at: '2026-10-29T18:39:50+08:00', apply_at: '2026-10-29T18:40:20+08:00', undo_until: '2026-10-29T18:40:20+08:00', message: '已记录，30 秒内可以撤回' };
  const done = REGIONS['need-you'](v, ctx(acts({ n1: { phase: 'done', action: 'done', executor: 'claude', receipt } })));
  assert.match(done, /class="cp-ask is-own is-acted"/);
  assert.match(done, /已记录，30 秒内可以撤回<\/span><button type="button" class="cp-btn cp-oa-undo" data-undo="act-000">撤回<\/button><span class="cp-oa-left" data-left="[^"]+">还剩 20 秒</);
  assert.doesNotMatch(done, /data-act=/);
  const later = (action, extra = {}) => REGIONS['need-you'](v, { ...ctx(acts({ n1: { phase: 'done', action, executor: 'gpt', receipt, ...extra } })), now: new Date('2026-10-29T18:41:00+08:00') });
  assert.match(later('done'), /<span class="cp-oa-msg">已记下。AI 会去核实，没问题这张卡就消失。<\/span>/);
  assert.match(later('note'), /已交给 GPT（18:40），办完会通知你。/);
  assert.match(later('dismiss'), /已移走，AI 记下你不做了。/);
  assert.match(later('snooze', { until: 'tomorrow_9' }), /好，明早 9 点再提醒你。/);
  assert.match(later('snooze', { until: '2026-11-03' }), /好，11 月 3 日 9 点再提醒你。/);
  assert.match(later('delegate'), /好，AI 按它的建议办；以后这类事它自己定。/);
  assert.match(later('unclear'), /AI 正在换个说法重写这张卡，写好会更新在这里。/);
  // 答案送回原对话（没选交给谁）
  assert.match(later('answer', { executor: undefined }), /已送回原来那个对话（18:40），AI 接着做，做完会通知你。/);
  // 撤回期里回执的 message 优先
  assert.match(REGIONS['need-you'](v, ctx(acts({ n1: { phase: 'done', action: 'delegate', receipt } }))), /已记录，30 秒内可以撤回/);
  assert.equal(leftText('2026-10-30T18:40:00+08:00', now), '明天 18:40 前可撤回');
  assert.equal(leftText('2026-10-29T23:10:00+08:00', now), '今天 23:10 前可撤回');
  assert.equal(leftText('2026-10-29T18:45:30+08:00', now), '还剩 5 分 30 秒');
  assert.equal(leftText('2026-10-29T18:39:00+08:00', now), '');
});

test('出错：写接口的中文说明；条目变了给“刷新”；按钮还在可以再点', () => {
  const v = normalize(base({ need_you: [card('n1', ['done'])] }));
  const html = REGIONS['need-you'](v, ctx(acts({ n1: { phase: 'error', action: 'done', error: '这条刚更新过，请刷新后再点', refresh: true } })));
  assert.match(html, /<p class="cp-oa-err" role="alert">这条刚更新过，请刷新后再点<button[^>]*data-oa-refresh>刷新<\/button><\/p>/);
  assert.match(html, /data-act="done">我办好了</);
  const sending = REGIONS['need-you'](v, ctx(acts({ n1: { phase: 'sending', action: 'done' } })));
  assert.match(sending, /data-act="done" disabled>/);
});

test('刷新后照显示后端记下的状态：已交给 Claude（HH:MM）、AI 核实中、你 HH:MM 点了看见了', () => {
  const v = normalize(base({ ai_following: [
    { id: 'a1', title: '示例已交', handed_to_ai: { executor: 'claude', at: '2026-10-29T18:20:00+08:00' }, owner_actions: ['note'] },
    { id: 'a2', title: '示例核实', verifying: true, handed_to_ai: { executor: 'gpt', at: '2026-10-29T18:00:00+08:00' }, owner_actions: ['note'] },
  ], deferred: [{ id: 'ai-wait-1', title: '示例看见', action_owner: 'user', seen_at: '2026-10-29T17:55:00+08:00', owner_actions: ['note', 'seen'] }] }));
  const html = REGIONS.ledger(v, ctx(acts())) + REGIONS.home(v, ctx(acts()));
  assert.match(html, /<p class="cp-oa-status">已交给 Claude（18:20）<\/p>/);
  assert.match(html, /<p class="cp-oa-status">AI 核实中<\/p>/);
  assert.match(html, /<p class="cp-oa-status">你 17:55 点了看见了<\/p>/);
  // 行里只有“回一句话”时，“交给：Claude ▾”放在展开的框里，不占按钮行
  assert.doesNotMatch(html, /cp-oa-bar[^>]*>[^]*?data-exec[^]*?<\/div>\s*<\/div>\s*<\/li>/);
  const open = REGIONS.ledger(v, ctx(acts({}, { a1: { open: 'note', text: '示例一句话' } })));
  assert.match(open, /<textarea[^>]*data-text[^>]*maxlength="500"[^>]*>示例一句话<\/textarea><div class="cp-oa-row"><button type="button" class="cp-oa-exec" data-exec[^>]*>交给：Claude ▾<\/button><button type="button" class="cp-btn cp-btn-main" data-send="note">交给 AI<\/button>/);
});

test('晚点提醒四个选择；AI 正在跑卡住的行“改给另一家”；你得知道的行有知道了、不对重做', () => {
  const v = normalize(base({ need_you: [card('n1', ['snooze'])],
    ai_running: { count: 2, stuck_count: 1, observed_at: at, rows: [
      { id: 'r1', status: 'quota_exhausted', vendor: 'gpt', executor: 'gpt', title: '示例卡住', owner_actions: ['note', 'switch'], item_version: 'v-r1' },
      { id: 'r2', status: 'network_retry', vendor: 'claude', title: '示例重连', owner_actions: ['switch'] }] },
    must_know: { state: 'ok', items: [{ id: 'k1', kind: 'report', text: '示例刚做完的事。后面的细节', owner_actions: ['note', 'redo'] }, { id: 'k2', kind: 'repairing', text: '示例在修', owner_actions: ['ack'] }] } }));
  const snooze = REGIONS['need-you'](v, ctx(acts({}, { n1: { open: 'snooze' } })));
  assert.deepEqual([...snooze.matchAll(/data-snooze="(\w+)"[^>]*>([^<]+)</g)].map((m) => [m[1], m[2]]), [['tomorrow_9', '明早 9 点'], ['three_days', '3 天后'], ['next_monday_9', '下周一 9 点']]);
  assert.match(snooze, /<span>选一天<\/span><input type="date" data-snooze-date min="2026-10-29">/);
  const top = REGIONS.home(v, ctx(acts()));
  // “AI 正在干活”只画“改给另一家”，不画“回一句话”
  assert.doesNotMatch(/id="ai-running".*?<\/div><div class="cp-know"/.exec(top)?.[0] || 'x', /data-act="note"/);
  assert.match(top, /data-oa="r1" data-ver="&quot;v-r1&quot;"><div class="cp-oa-bar"><button type="button" class="cp-btn" data-act="switch" data-to="claude">改给 Claude</);
  assert.match(top, /data-act="switch" data-to="gpt">改给 GPT</);
  assert.match(top, /data-act="redo" aria-expanded="false">不对，重做</);
  assert.match(top, /data-act="ack">知道了</);
});

test('你最近处理的（30 天）：默认收起，每行一句人话、交给谁、状态，能撤回的带撤回；顶上两种提示', () => {
  const recent = [
    { id: 'act-1', action: 'answer', status: 'waiting_undo', executor: 'claude', created_at: '2026-10-29T18:39:00+08:00', text: '18:39 你给‘示例一’交了答案', can_undo: true },
    { id: 'act-2', action: 'done', status: 'ready_for_ai', executor: 'gpt', created_at: '2026-10-29T18:00:00+08:00', text: '18:00 你把‘示例二’标成办好了', can_undo: false },
    { id: 'act-3', action: 'dismiss', status: 'undone', executor: 'claude', created_at: '2026-10-28T09:00:00+08:00', text: '09:00 你把‘示例三’标成不用了（已撤回）', can_undo: false },
    { id: 'act-4', action: 'snooze', status: 'rejected', executor: 'claude', created_at: '2026-10-29T08:00:00+08:00', error: 'item_closed', text: '08:00 你给‘示例四’设了晚点提醒', can_undo: false },
  ];
  const v = normalize(base({ need_you: [card('n1', ['note'])], owner_recent: recent, owner_actions_worker: { state: 'error' }, notification_status: 'failed', notification_message: '通知没发出去（18:20）' }));
  const html = REGIONS.overview(v, ctx(acts()));
  assert.match(html, /<details class="cp-recent" id="owner-recent"><summary>你最近处理的（30 天）<\/summary>/);
  assert.match(html, /<time>18:39<\/time>你给‘示例一’交了答案<\/span><span class="cp-recent-st">要交给 Claude，还能撤回<\/span><button[^>]*data-recent-undo="act-1">撤回</);
  assert.match(html, /<span class="cp-recent-st">已交给 GPT<\/span>/);
  assert.match(html, /<time>10月28日 09:00<\/time>你把‘示例三’标成不用了<\/span><span class="cp-recent-st">已撤回<\/span>/);
  // 英文代号不上页面
  assert.match(html, /<span class="cp-recent-st">没办成<\/span>/);
  assert.match(html, /<p class="cp-oa-warn" role="status">你点的处理暂时写不回，电脑在重试<\/p><p class="cp-oa-warn" role="status">通知没发出去（18:20）<\/p>/);
  // 精简视图顶层和全量 cockpit 下同一份都认
  assert.equal(normalize(base({ cockpit: { owner_recent: recent } })).owner_recent.length, 4);
  assert.equal(normalize(base({})).owner_recent, null);
});

test('构建时（没有 ctx.act）和没有编号的条目：照样能画，不报错', () => {
  const v = normalize(base({ need_you: [card('n1', ['done', 'note'])] }));
  assert.doesNotThrow(() => page(v, { now, offline: false, phase: 'snapshot', projectUrls: {}, img: {}, ov }));
  assert.equal(ownerBox({ title: '没有编号', owner_actions: ['note'] }, ctx()), '');
});

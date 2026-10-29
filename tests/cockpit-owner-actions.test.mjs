// 数据和接口均为虚构；不联网、不启动浏览器。
import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIONS, actsOf, actCls, ownerBox, actionToast, recentBlock, ownerWarn, questionsFor } from '../site-astro/src/cockpit/actions.js';
import { createActionController } from '../site-astro/src/cockpit/action-state.js';

const now = new Date('2026-10-29T18:40:00+08:00');
const at = '2026-10-29T18:39:30+08:00';
const act = () => ({ state: new Map(), ui: new Map(), recent: new Map() });
const ctx = (a = act(), kind = 'owner') => ({ now, act: a, viewer: { kind } });
const card = { id: 'n1', title: '示例事项', item_version: 'v1', owner_actions: ['ack', 'snooze'] };
const rig = (post) => {
  const a = act(), calls = [], loads = [], notices = [];
  const controller = createActionController({ act: a, url: '/fake/actions', post: async (...args) => { calls.push(args); return post(...args); },
    newKey: () => 'fictional-key', paint() {}, load() { loads.push(true); }, retired() { notices.push(true); }, now: () => now.getTime(), later() {} });
  return { a, calls, loads, notices, ...controller };
};
const ok = (id = 'receipt-1') => ({ ok: true, status: 200, j: { id } });

test('只允许知道了和晚点提醒；旧动作不画、不隐藏卡片', () => {
  const old = ['answer', 'note', 'seen', 'done', 'dismiss', 'confirm', 'redo', 'switch', 'delegate', 'unclear'];
  assert.deepEqual(ACTIONS, ['ack', 'snooze']);
  assert.deepEqual(actsOf({ ...card, owner_actions: [...old, ...ACTIONS] }), ACTIONS);
  assert.deepEqual(actsOf({ ...card, id: '' }), []);
  const html = ownerBox({ ...card, owner_actions: [...old, ...ACTIONS] }, ctx());
  assert.deepEqual([...html.matchAll(/data-act="([^"]+)"/g)].map((m) => m[1]), ACTIONS);
  assert.doesNotMatch(html, /data-send|data-exec|data-pick|data-text|data-qnote|data-left|textarea/);
  const a = act(); a.state.set('n1', { action: 'answer', phase: 'done' });
  assert.equal(actCls(card, ctx(a)), '');
});

test('复制不依赖动作或编号，额外链接在复制前；公开版误带动作、状态、私人回执也不显示', () => {
  const html = ownerBox({ title: '无编号卡', owner_actions: [] }, ctx(), { extra: '<a>打开</a>' });
  assert.match(html, /data-copy=/);
  assert.ok(html.indexOf('<a>打开</a>') < html.indexOf('data-copy='));
  assert.match(html, /aria-label="复制给 AI"/);
  assert.match(html, /<svg[^>]*aria-hidden="true"[^]*<span data-copy-caption>复制给 AI<\/span><\/button>/);
  const a = act(); a.state.set('n1', { action: 'ack', phase: 'done', toastUntil: now.getTime() + 5000 });
  for (const kind of ['public', null]) {
    assert.equal(ownerBox(card, ctx(a, kind)), '');
    assert.equal(actionToast(ctx(a, kind)), '');
    assert.equal(recentBlock({ owner_recent: [{ id: 'r', text: '私人回执' }] }, ctx(a, kind)), '');
    assert.equal(ownerWarn({ owner_actions_worker: { state: 'error' }, notification_status: 'failed' }, ctx(a, kind)), '');
    assert.equal(actCls(card, ctx(a, kind)), '');
  }
});

test('选项保留解释和第一条AI建议，不要求value或answer动作', () => {
  const q = questionsFor({ owner_actions: ['ack'], options: [{ text: '甲', detail: '甲的解释', recommended: true }, { value: 2, label: '乙', recommended: true }] });
  assert.deepEqual(q[0].options, [{ value: '甲', text: '甲', detail: '甲的解释', rec: true }, { value: 2, text: '乙', detail: '', rec: false }]);
});

test('正在发送就隐藏整条；顶端六秒短回执，无撤回倒数；提醒先选日期', () => {
  const a = act(); a.state.set('n1', { action: 'ack', title: '<示例>', phase: 'sending', toastUntil: now.getTime() + 6000 });
  assert.equal(actCls(card, ctx(a)), ' is-hidden-action');
  assert.match(actionToast(ctx(a)), /已收起「&lt;示例&gt;」.*data-undo="" data-undo-item="n1"/);
  assert.doesNotMatch(actionToast(ctx(a)), /data-left|还剩|倒数/);
  assert.equal(actionToast({ ...ctx(a), now: new Date(now.getTime() + 6001) }), '');
  a.ui.set('n1', { open: 'snooze' });
  const html = ownerBox(card, ctx(a));
  for (const [value, label] of [['tomorrow_9', '明早 9 点'], ['three_days', '3 天后'], ['next_monday_9', '下周一 9 点']]) assert.match(html, new RegExp(`data-snooze="${value}"[^>]*>${label}`));
  assert.match(html, /选一天<\/span><input type="date" data-snooze-date min="2026-10-29"/);
});

test('发送未返回先撤回：立即恢复卡片，拿到回执后补发一次undo', async () => {
  let resolve;
  const waiting = new Promise((r) => { resolve = r; });
  const r = rig((url) => url.endsWith('/undo') ? ok() : waiting);
  const pending = r.submit({ id: 'n1', title: '示例事项', version: 'v1' }, 'ack', { executor: 'gpt', answers: { q: '甲' } });
  assert.equal(actCls(card, ctx(r.a)), ' is-hidden-action');
  await r.undo('', 'n1');
  assert.equal(actCls(card, ctx(r.a)), '');
  assert.equal(r.a.state.get('n1').undoRequested, true);
  assert.equal(r.calls.length, 1);
  assert.deepEqual(r.calls[0][1], { item_id: 'n1', action: 'ack', idempotency_key: 'fictional-key', item_version: 'v1' });
  resolve(ok()); await pending;
  assert.deepEqual(r.calls[1], ['/fake/actions/receipt-1/undo', {}]);
  assert.equal(r.a.state.get('n1').phase, 'undone');
  assert.equal(r.loads.length, 1);
  assert.match(actionToast(ctx(r.a)), /已撤回「示例事项」/);
});

test('拒绝所有旧提交；失败恢复卡片、保留重试按钮，410只自动重读一次', async () => {
  const rejected = rig(() => ({ ok: false, status: 500, j: { message: '示例磁盘暂不可写' } }));
  for (const action of ['answer', 'note', 'seen', 'confirm', 'switch', 'delegate']) await rejected.submit({ id: 'n1' }, action);
  assert.equal(rejected.calls.length, 0);
  await rejected.submit({ id: 'n1' }, 'ack');
  assert.equal(actCls(card, ctx(rejected.a)), '');
  assert.match(ownerBox(card, ctx(rejected.a)), /data-act="ack">知道了.*没存上，再点一次：示例磁盘暂不可写/);
  await rejected.submit({ id: 'n1' }, 'ack');
  assert.equal(rejected.calls.length, 2);
  const retired = rig(() => ({ ok: false, status: 410, j: { error: 'cockpit_action_retired' } }));
  await retired.submit({ id: 'n1' }, 'ack');
  await retired.submit({ id: 'n2' }, 'snooze', { until: 'three_days' });
  assert.equal(retired.loads.length, 1);
  assert.equal(retired.notices.length, 1);
  assert.equal(retired.a.state.get('n1').error, '这个按钮已经取消，请刷新页面');
  assert.equal(retired.calls[1][1].until, 'three_days');
});

test('撤回失败保留真实错误且能重试，不冒充已撤回', async () => {
  const r = rig((url) => url.endsWith('/undo') ? { ok: false, status: 500, j: { message: '示例撤回未保存' } } : ok());
  await r.submit({ id: 'n1', title: '示例事项' }, 'ack'); await r.undo('receipt-1', 'n1');
  assert.equal(r.a.state.get('n1').phase, 'done');
  assert.match(actionToast(ctx(r.a)), /没撤回：示例撤回未保存/);
  assert.doesNotMatch(actionToast(ctx(r.a)), /已撤回/);
  assert.equal(r.loads.length, 1);
});

test('最近记录撤回失败显示原因并允许重试，成功后清掉本地错误', async () => {
  let failed = true;
  const r = rig(() => failed ? { ok: false, status: 500, j: { message: '示例撤回写回失败' } } : ok());
  const view = { owner_recent: [{ id: 'r1', action: 'ack', status: 'applied', title: '示例事项', can_undo: true }] };
  await r.undo('r1', null);
  assert.deepEqual(r.a.recent.get('r1'), { error: '没撤回：示例撤回写回失败' });
  const html = recentBlock(view, ctx(r.a));
  assert.match(html, /没撤回：示例撤回写回失败/);
  assert.match(html, /data-recent-undo="r1">撤回/);
  assert.doesNotMatch(html, /cp-recent-st">已收起/);
  failed = false; await r.undo('r1', null);
  assert.equal(r.a.recent.get('r1'), 'undone');
  assert.match(recentBlock(view, ctx(r.a)), /cp-recent-st">已撤回/);
  assert.doesNotMatch(recentBlock(view, ctx(r.a)), /没撤回|data-recent-undo/);
});

test('HTTP成功后异步写回失败会恢复条目、显示原因并允许重试', async () => {
  const r = rig(() => ok());
  await r.submit({ id: 'n1', title: '示例事项' }, 'ack');
  r.reconcile(['n1'], { owner_recent: [{ id: 'receipt-1', status: 'applied', error_message: '示例异步写回失败' }] });
  assert.equal(r.a.state.get('n1').phase, 'error');
  assert.equal(actCls(card, ctx(r.a)), '');
  assert.match(ownerBox(card, ctx(r.a)), /没存上，再点一次：示例异步写回失败/);
  await r.submit({ id: 'n1', title: '示例事项' }, 'ack');
  assert.equal(r.calls.length, 2);
});

test('worker回退仅同原标题、同动作且不早于这次点击；旧失败不恢复新动作', async () => {
  const r = rig(() => ok());
  await r.submit({ id: 'n1', title: '示例短标题', sourceTitle: '示例原标题' }, 'snooze', { until: 'tomorrow_9' });
  const w = (extra = {}) => ({ title: '示例原标题', action: 'snooze', at: '2026-10-29T18:40:00+08:00', message: '示例后台错误', ...extra });
  for (const failure of [w({ title: '另一标题' }), w({ action: 'ack' }), w({ at: '2026-10-29T18:39:58+08:00' })]) {
    r.reconcile(['n1'], { owner_actions_worker: { failed_items: [failure] } });
    assert.equal(r.a.state.get('n1').phase, 'done');
  }
  r.reconcile(['n1'], { owner_actions_worker: { failed_items: [w({ at: '2026-10-29T18:39:59+08:00' })] } });
  assert.equal(r.a.state.get('n1').phase, 'error');
  assert.match(r.a.state.get('n1').error, /示例后台错误/);
});

test('顶部标题不重新露出电脑路径，原始标题和复制内容完整保留', () => {
  const title = '示例汇报（路径 E:\\Fictional\\汇报.html）';
  const html = ownerBox({ ...card, title }, ctx());
  assert.match(html, /data-title="示例汇报"/);
  assert.ok(html.includes(`data-source-title="${title}"`));
  assert.ok(html.includes(`驾驶舱卡片：${title}`));
  const a = act(); a.state.set('n1', { phase: 'done', action: 'ack', title, toastUntil: now.getTime() + 6000 });
  assert.match(actionToast(ctx(a)), /已收起「示例汇报」/);
  assert.doesNotMatch(actionToast(ctx(a)), /Fictional|汇报\.html/);
});

test('重读先确认后端消失再重现才清本地收起，等待写回时仍隐藏且不能重复提交', async () => {
  const r = rig(() => ok());
  await r.submit({ id: 'n1', title: '示例事项' }, 'snooze', { until: 'tomorrow_9' });
  assert.equal(r.loads.length, 1);
  r.reconcile(['n1']);
  assert.equal(actCls(card, ctx(r.a)), ' is-hidden-action');
  await r.submit({ id: 'n1' }, 'ack');
  assert.equal(r.calls.length, 1);
  r.reconcile([]);
  assert.equal(r.a.state.get('n1').observedGone, true);
  r.reconcile(['n1']);
  assert.equal(r.a.state.has('n1'), false);
});

test('提醒迁入不急事项后可见，到期回来不沿用旧隐藏且可以再次提醒', async () => {
  const r = rig(() => ok());
  await r.submit({ id: 'n1', title: '示例事项' }, 'snooze', { until: 'tomorrow_9' });
  r.reconcile(['n1'], { need_you: [card], deferred: [card] });
  assert.equal(actCls(card, ctx(r.a)), ' is-hidden-action');
  r.reconcile(['n1'], { need_you: [], deferred: [card] });
  assert.equal(r.a.state.get('n1').movedToDeferred, true);
  assert.equal(actCls(card, ctx(r.a)), '');
  assert.match(actionToast(ctx(r.a)), /好，明早 9 点再提醒你.*data-undo="receipt-1" data-undo-item="n1"/);
  r.reconcile(['n1'], { need_you: [card], deferred: [] });
  assert.equal(actCls(card, ctx(r.a)), '');
  await r.submit({ id: 'n1', title: '示例事项' }, 'snooze', { until: 'three_days' });
  assert.equal(r.calls.length, 2);
  assert.equal(r.calls[1][1].until, 'three_days');
  assert.equal(actCls(card, ctx(r.a)), ' is-hidden-action');
});

test('提醒迁移后短回执仍能撤回，异步写回失败也仍恢复错误', async () => {
  const r = rig(() => ok());
  await r.submit({ id: 'n1', title: '示例事项' }, 'snooze', { until: 'tomorrow_9' });
  r.reconcile(['n1'], { need_you: [], deferred: [card] });
  await r.undo('receipt-1', 'n1');
  assert.deepEqual(r.calls[1], ['/fake/actions/receipt-1/undo', {}]);
  assert.equal(r.a.state.get('n1').phase, 'undone');
  assert.match(actionToast(ctx(r.a)), /已撤回「示例事项」/);
  await r.submit({ id: 'n1', title: '示例事项' }, 'snooze', { until: 'three_days' });
  r.reconcile(['n1'], { need_you: [], deferred: [card] });
  assert.equal(r.a.state.get('n1').movedToDeferred, true);
  r.reconcile(['n1'], { need_you: [], deferred: [card], owner_recent: [{ id: 'receipt-1', error_message: '示例提醒写回失败' }] });
  assert.equal(r.a.state.get('n1').phase, 'error');
  assert.equal(actCls(card, ctx(r.a)), '');
  assert.match(ownerBox(card, ctx(r.a)), /没存上，再点一次：示例提醒写回失败/);
});

test('最近记录用人话，error_message原样展示，即使状态错误地说applied也不装成功', () => {
  const html = recentBlock({ owner_recent: [
    { id: 'r1', action: 'ack', status: 'applied', title: '示例甲', can_undo: true },
    { id: 'r2', action: 'snooze', status: 'waiting_undo', title: '示例乙', until: 'tomorrow_9' },
    { id: 'r3', action: 'ack', status: 'applied', title: '示例丙', error_message: 'worker_write_failed <raw>' },
  ] }, ctx());
  assert.match(html, /已收起/); assert.match(html, /好，明早 9 点再提醒你/);
  assert.match(html, /没存上：worker_write_failed &lt;raw&gt;/);
  assert.doesNotMatch(html.slice(html.indexOf('示例丙')), /cp-recent-st">已收起/);
});

test('写回失败提示前两条的时间标题原因，多条给总数，旧字段仍走原提示', () => {
  const html = ownerWarn({ owner_actions_worker: { state: 'error', failed_items: ['甲', '乙', '丙'].map((title) => ({ title, created_at: at, error_message: '示例原因' })) } }, ctx());
  assert.match(html, /你 18:39 点的「甲」没存上：示例原因/);
  assert.match(html, /你 18:39 点的「乙」没存上：示例原因；等 3 条/);
  assert.doesNotMatch(html, /「丙」/);
  assert.match(ownerWarn({ owner_actions_worker: { state: 'error', failed_items: [{}] } }, ctx()), /你点的处理暂时写不回，电脑在重试/);
});

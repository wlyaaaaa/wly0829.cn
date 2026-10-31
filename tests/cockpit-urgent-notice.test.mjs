import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { needCards, ownerNow } from '../site-astro/src/cockpit/render.js';

const now = new Date('2026-10-31T20:00:00+08:00');
const ctx = { now, phase: 'live' };
const notice = { id: 'example-notice', title: '示例关键功能暂时不可用', attention_level: 'urgent', owner_action_required: false,
  action_owner: 'ai', ask_kind: 'ai', card_type: 'notice', mobile_method: { kind: 'none', label: '目前无需你操作' },
  progress: { text: 'AI 已隔离问题，正在恢复示例功能' }, owner_actions: ['ack', 'snooze'] };
const view = (items, kind = 'owner') => normalize({ schema: 'pcconfig.cockpit-view.v1', served_at: now.toISOString(),
  viewer: { kind, device_state: 'ok' }, need_you: items });

test('严重但 AI 能继续办的提醒不算本人动作，也不生成办理步骤', () => {
  const v = view([notice]), html = needCards(v, ctx);
  assert.equal(ownerNow(v, now).n, 0);
  assert.match(html, /严重需关注 <b>1<\/b> 件/);
  assert.match(html, /目前无需你操作，AI 继续处理/);
  assert.match(html, /AI 已隔离问题，正在恢复示例功能/);
  assert.doesNotMatch(html, /要你做|要你动手|怎么办|去办 →|undefined/);
  assert.match(html, /data-act="ack"/);
  assert.doesNotMatch(html, /data-act="(?:done|complete|delegate)"/);
});

test('严重提醒和普通本人待办分别计数，旧待办仍显示原步骤', () => {
  const task = { id: 'example-task', title: '示例本人待办', ask_kind: 'action', steps: ['完成示例操作'] };
  const v = view([notice, task]), html = needCards(v, ctx);
  assert.equal(ownerNow(v, now).n, 1);
  assert.match(html, /要你做 <b>1<\/b> 件 · 严重需关注 <b>1<\/b> 件/);
  assert.match(html, /要你动手/);
  assert.match(html, /完成示例操作/);
  const pub = needCards(view([{ ...notice, placeholder: true, title: '私人事项' }], 'public'), ctx);
  assert.match(pub, /目前无需你操作，AI 继续处理/);
  assert.doesNotMatch(pub, /要做什么|正在恢复示例功能|<button/);
});

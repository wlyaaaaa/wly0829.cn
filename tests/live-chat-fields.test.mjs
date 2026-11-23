import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const window = {}, document = {documentElement: {childNodes: []}, addEventListener() {}, getElementById: () => null};
const sandbox = {window, document, location: {pathname: '/'}, Node: {TEXT_NODE: 3, ELEMENT_NODE: 1},
  matchMedia: () => ({}), MutationObserver: class {observe() {}}};
for (const file of ['_lib/live-ui.js', 'chats/draw10.js']) {
  vm.runInNewContext(await readFile(new URL(`../site-v2/live/${file}`, import.meta.url), 'utf8'), sandbox);
}
Object.assign(window.LiveUI, {date: () => '11-19', time: () => '20:06', ago: () => '2 分钟前'});
const { plain, planInfo, rowState, stepWord, stepState, helperTotal, helperActivity } = window.LiveUI.chatFields;

test('chat pages share the recorded plan, wait kinds and total helper count', () => {
  const plan = [{ status: 'completed' }, { status: 'in_progress' }, { status: 'pending' }];
  assert.equal(planInfo({ plan, plan_summary: { total: 3, completed: 1, current: 2 } }).label, '第 2／3 步');
  assert.deepEqual(plan.map(p => stepWord(stepState(p))), ['做完了', '在干', '没开始']);
  assert.equal(planInfo({ plan, plan_summary: { total: 3, completed: 3, current: 2 } }).label, '');
  assert.equal(rowState({ state: 'waiting', wait_kind: 'tool' }, 'owner'), '在提问');
  assert.equal(rowState({ state: 'waiting', wait_kind: 'final' }, 'public'), '等本人回答');
  assert.equal(helperTotal({ helper_counts: { total: 4 }, helpers: { active: [{}] } }), 4);
  assert.equal(plain('## 结果\n**已核对** `notes.md`'), '结果\n已核对 notes.md');
  assert.deepEqual(['running', 'done', 'stopped', 'waiting', 'unknown'].map(state => helperActivity({state, at: '2026-11-19T20:06:00+08:00'}, 'now')), ['2 分钟前有动静', '完成于 11-19 20:06', '停止于 11-19 20:06', '最后记录于 11-19 20:06', '最后记录于 11-19 20:06']);
});

test('conversation cards show privacy once, keep specific errors, and identify Antigravity without a model', () => {
  const {cell, originLabel, quota, repeatsState} = window.LiveUI.chatFields;
  const privateChat = {visibility: 'owner'};
  assert.equal(cell('原内容', '进展', privateChat, 'owner', 0, true), '原内容');
  assert.equal(cell('原内容', '进展', privateChat, 'public', 0, true), '');
  // 本人 11-22：本人版给完整版，不挂“仅你可见”。
  assert.equal(cell({text: '原内容', visibility: 'owner'}, '进展', {}, 'owner', 0, true), '原内容');
  const failed = {state: 'failed', text: '5 小时额度用完 · 恢复时间 11月20日 10:00'};
  assert.equal(quota(failed, 'owner'), true);
  assert.equal(repeatsState(failed.text, failed, 'owner'), false);
  const {chatProgressText} = window.LiveUI;
  assert.equal(chatProgressText(failed.text, failed, 'owner'), '5 小时额度用完 · 恢复时间 11-20 10:00');
  const timed = '周额度用完 · 恢复时间 1月2日 06:24:39';
  assert.equal(chatProgressText(timed, failed, 'public'), '周额度用完 · 恢复时间 01-02 06:24:39');
  assert.equal(chatProgressText(timed, {state: 'done'}, 'public'), timed);
  assert.equal(repeatsState('做完了', {state: 'done'}, 'public'), true);
  const chat = {id: 'antigravity:fixture', model: null, dispatched_by: {kind: 'session'}};
  assert.equal(originLabel(chat), 'Antigravity · 别的对话开的');
  // 本人 11-23：Antigravity 没记型号的写 Gemini Carbon，别家照旧写“型号没记下”（M541）。
  assert.equal(window.LiveUI.draw10.modelName(chat), 'Gemini Carbon');
  assert.equal(window.LiveUI.draw10.modelName({id: 'claude:fixture', model: null}), '型号没记下');
});

test('the shared conversation labels distinguish a question from a finished reply in every client', () => {
  for (const provider of ['antigravity', 'claude', 'codex']) {
    const row = { id: `${provider}:test`, state: 'waiting' };
    for (const viewer of ['owner', 'public']) {
      assert.equal(rowState({ ...row, wait_kind: 'tool' }, viewer), '在提问');
      assert.equal(rowState({ ...row, wait_kind: 'final' }, viewer), '等本人回答');
      assert.equal(rowState({ ...row, state: 'ended_unknown' }, viewer), '结局没读到');
    }
    assert.deepEqual(['running', 'waiting', 'done', 'failed', 'stopped'].map(state => rowState({ ...row, state }, 'owner')),
      ['在干', '等本人', '做完了', '出错了', '已停止']);
  }
});

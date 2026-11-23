import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const window = {}, document = {documentElement: {childNodes: []}, addEventListener() {}, getElementById: () => null};
const sandbox = {window, document, location: {pathname: '/'}, Node: {TEXT_NODE: 3, ELEMENT_NODE: 1},
  matchMedia: () => ({}), MutationObserver: class {observe() {}}};
vm.runInNewContext(await readFile(new URL('../site-v2/live/_lib/live-ui.js', import.meta.url), 'utf8'), sandbox);
const U = window.LiveUI;
const plain = html => html.replace(/<[^>]*>/g, '');

test('choice answers copied to AI name the card and the question, so same-titled cards differ', () => {
  const question = {id: 'Q1', text: '寄哪一版？', options: ['甲', '乙']};
  const first = U.choiceText({id: 'pending-a', owner_source_id: 'card-1'}, '准备寄送一份说明', question, '甲');
  const second = U.choiceText({id: 'pending-b', owner_source_id: 'card-2'}, '准备寄送一份说明', {...question, id: 'Q2'}, '甲');
  assert.equal(first, '事项原编号 card-1（准备寄送一份说明），题号 Q1「寄哪一版」，我选：甲。请按编号接着办，要我做什么直接问我。');
  assert.notEqual(first, second);
  assert.match(U.choiceText({id: 'pending-c'}, '没有原编号的卡', question, '乙'), /^实况事项 pending-c（没有原编号的卡），题号 Q1/);
});

test('visitors see plain words where something is still withheld: no lock, no "另有 N 条" summary (new privacy rule 11-24)', () => {
  const pending = {value: null, visibility: 'pending', rewrite: 'pending', hidden_what: '事项内容'};
  assert.equal(U.fieldText(pending, 'public'), '事项内容仅本人可见');
  assert.equal(U.fieldHtml(pending, {name: '待办事项', place: 'title', kind: 'public'}), '事项内容仅本人可见');
  assert.equal(plain(U.fieldHtml(pending, {name: '这件事的内容', kind: 'public'})), '事项内容仅本人可见');
  assert.equal(U.fieldHtml({visibility: 'owner'}, {name: '待办事项', place: 'title', kind: 'public'}), '标题仅本人可见');
  assert.equal(plain(U.fieldHtml({value: null, visibility: 'owner', hidden_what: '对话标题'}, {kind: 'public'})), '对话标题仅本人可见');
  assert.doesNotMatch(U.fieldHtml({value: null, visibility: 'owner', hidden_what: '对话标题'}, {kind: 'public'}), /🔒|<button/);
  assert.equal(U.privateSummary(3, {unit: '项', what: '记录'}), '');
  assert.equal(U.hiddenMore(3, '项', '记录'), '');
  assert.equal(U.fieldHtml('来电号码：可信设备可见', {place: 'label', kind: 'public'}), '来电号码仅本人可见');
  // 一大块：原位一句普通字“这里是……，所以不予展示”
  const block = {value: null, visibility: 'owner', hidden_block: '这份材料的正文（8 页）'};
  assert.equal(plain(U.fieldHtml(block, {kind: 'public'})), '这里是这份材料的正文（8 页），所以不予展示');
  assert.equal(U.fieldText(block, 'public'), '这里是这份材料的正文（8 页），所以不予展示');
});

test('the owner version marks what visitors cannot see with the shared "访客看不到" tag', () => {
  assert.match(plain(U.visitorHiddenTag('这批文件的文件名', '量大', 'owner')), /^访客看不到$/);
  assert.match(U.visitorHiddenTag('这批文件的文件名', '量大', 'owner'), /访客版看不到这批文件的文件名。原因：量大。/);
  assert.equal(U.visitorHiddenTag('这批文件的文件名', '量大', 'public'), '');
  assert.match(plain(U.visitorHiddenMark({content_locked: true}, '这场对话', 'owner')), /^访客看不到$/);
});

test('the owner version shows the original words with no lock and no owner-only label', () => {
  assert.equal(U.fieldHtml({text: '原文在这里', visibility: 'owner'}, {name: '事项', kind: 'owner'}), '原文在这里');
  assert.equal(U.fieldText({text: '原文在这里', visibility: 'pending', rewrite: 'pending'}, 'owner'), '原文在这里');
  assert.equal(U.visibilityNote({visibility: 'owner'}, 'owner', '事项'), '');
  assert.doesNotMatch(U.fieldHtml({value: null, visibility: 'pending', rewrite: 'pending'}, {name: '这件事的内容', kind: 'owner'}), /仅本人可见|仅你可见|🔒/);
});

test('a batch write-back lists every failed card with its own reason and counts unconfirmed ones apart', async () => {
  // 假设的写回返回：applyOwnerItems([一件]) → { saved: [id], pending: 0|1, unconfirmed: 0|1, message }
  const replies = {
    a: {saved: ['a'], pending: 0, unconfirmed: 0},
    b: {saved: [], pending: 0, unconfirmed: 1, message: '还没收到结果，请重读这件事。'},
    c: {saved: [], pending: 0, unconfirmed: 0, message: '这条事项已经变化，请刷新后再处理。'},
    d: {saved: [], pending: 0, unconfirmed: 0, message: '这条事项不能这样处理，请刷新页面。'},
  };
  const calls = [];
  const live = {async applyOwnerItems(items, action) { calls.push([items.map(i => i.id), action]); return replies[items[0].id]; }};
  const cards = ['a', 'b', 'c', 'd'].map(id => ({id, text: `合成事项${id}`}));
  const result = await U.writeItems(live, cards, 'ack');
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [[['a'], 'ack'], [['b'], 'ack'], [['c'], 'ack'], [['d'], 'ack']]);
  assert.deepEqual([[...result.saved], result.pending, result.unconfirmed, result.failed.length], [['a'], 0, 1, 2]);
  assert.equal(result.text('已生效'), '已生效 1 件。\n还没确认 1 件，再点一次可继续核对。\n'
    + '没生效 2 件：「合成事项c」：这条事项已经变化，请刷新后再处理；「合成事项d」：这条事项不能这样处理，请刷新页面。');
});

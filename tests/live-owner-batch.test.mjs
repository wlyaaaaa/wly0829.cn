import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source = readFileSync(new URL('../site-v2/live/_lib/live-client.js', import.meta.url), 'utf8');

function client({owner = true, replies = []} = {}) {
  const stored = new Map([['wly-cockpit-device', 'F'.repeat(43)]]), posts = [];
  const localStorage = {get length() {return stored.size;}, key: i => [...stored.keys()][i],
    getItem: key => stored.get(key), setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key)};
  const sandbox = {window: {}, location: new URL('https://wly0829.cn/live/items/'), URLSearchParams, Intl, Date, AbortSignal, clearTimeout,
    setTimeout: () => 0, setInterval: () => 0, document: {addEventListener() {}}, localStorage, crypto: globalThis.crypto,
    fetch: async (url, init) => {
      if (init?.method !== 'POST') return Response.json({});
      posts.push({url, headers: init.headers, body: JSON.parse(init.body)});
      const reply = replies[posts.length - 1];
      if (reply instanceof Error) throw reply;
      return Response.json(reply ?? {status: 'applied'});
    }};
  vm.runInNewContext(source, sandbox);
  sandbox.window.Live.canOwnerAct = () => owner;
  return {live: sandbox.window.Live, posts};
}

test('batch confirmation writes each card once with its own idempotency key and reports partial results', async () => {
  const items = ['a', 'b', 'c'].map(id => ({id: 'pending-' + id, item_version: 'v-' + id}));
  const {live, posts} = client({replies: [{status: 'applied'}, {status: 'waiting_undo'}, {status: 'error', message: '这件事刚刚有变化'}]});
  const result = await live.applyOwnerItems(items, 'snooze');
  assert.deepEqual(posts.map(p => [p.body.item_id, p.body.item_version, p.body.action, p.body.direct, p.body.until]),
    [['pending-a', 'v-a', 'snooze', true, 'tomorrow_10'], ['pending-b', 'v-b', 'snooze', true, 'tomorrow_10'], ['pending-c', 'v-c', 'snooze', true, 'tomorrow_10']]);
  assert.equal(new Set(posts.map(p => p.body.idempotency_key)).size, 3);
  assert.ok(posts.every(p => p.url === 'https://mcp.wly0829.cn/computer-access/api/cockpit/actions' && p.headers['X-Cockpit-Device'] === 'F'.repeat(43)));
  assert.deepEqual([...result.saved], ['pending-a']);
  assert.equal(result.pending, 1);
  assert.equal(result.message, '这件事刚刚有变化');
});

test('timeout checks the original receipt and simultaneous clicks share the write', async () => {
  const {live, posts} = client({replies: [Error('Timeout'), {status: 'applied', id: 'first-receipt'}]});
  const item = {id: 'pending-a', item_version: 'v1'};
  const results = await Promise.all([live.ownerAction(item, 'ack'), live.ownerAction(item, 'ack')]);
  assert.equal(posts.length, 2);
  assert.deepEqual(posts[1], posts[0]);
  assert.deepEqual(results.map(result => result.id), ['first-receipt', 'first-receipt']);
});

test('each card version reuses only its own request through write-back', async () => {
  const {live, posts} = client({replies: [Error('Timeout'), Error('Timeout'), {status: 'applied'}, {status: 'waiting_undo'}, {status: 'applied'}]});
  const item = {id: 'pending-a', item_version: 'v1'};
  const first = await live.applyOwnerItems([item], 'snooze');
  assert.equal(first.unconfirmed, 1);
  const reloaded = {...item, item_version: 'v2'};
  assert.deepEqual([...(await live.applyOwnerItems([reloaded], 'snooze')).saved], [item.id]);
  assert.equal((await live.applyOwnerItems([item], 'snooze')).pending, 1);
  assert.deepEqual([...(await live.applyOwnerItems([item], 'snooze')).saved], [item.id]);
  assert.equal(posts.length, 5);
  for (const index of [1, 3, 4]) assert.deepEqual(posts[index], posts[0]);
  assert.equal(posts[2].body.item_version, 'v2');
  assert.notEqual(posts[2].body.idempotency_key, posts[0].body.idempotency_key);
});

test('an unpaired device writes nothing and is told it is not a trusted device', async () => {
  const {live, posts} = client({owner: false});
  const result = await live.applyOwnerItems([{id: 'pending-a', item_version: 'v'}], 'ack');
  assert.equal(posts.length, 0);
  assert.deepEqual([[...result.saved], result.message], [[], '不是可信设备']);
});

test('copy-to-AI texts carry the registered number; a follow-up decline copies the follow-up', () => {
  const {live} = client();
  const card = {id: 'pending-a', owner_source_id: 'fixture-card-1', text: '寄出合成样例'};
  assert.equal(live.copy(card, 'done'), '事项原编号 fixture-card-1（寄出合成样例）。我已办完，请核实后按编号关卡，要我做什么直接问我。');
  assert.equal(live.copy({...card, kind: 'choose'}, 'done'), '事项原编号 fixture-card-1（寄出合成样例）。我的回答：____。请处理后按编号关卡，要我做什么直接问我。');
  assert.equal(live.copy({...card, decline_followup: '退回合成样例'}, 'decline'), '事项原编号 fixture-card-1（寄出合成样例）。这一项我不办了。后续请处理：退回合成样例');
});

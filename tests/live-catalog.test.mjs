import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const script = readFileSync(new URL('../site-v2/live/_lib/live-catalog.js', import.meta.url), 'utf8');

test('the project directory keeps owner-only cards in the owner view', () => {
  const callbacks = {};
  const cards = new Set(), label = {};
  const template = {dataset: {catalog: 'projects'}, content: {firstElementChild: {
    cloneNode: () => ({querySelector: () => label, remove() {cards.delete(this);}}),
  }}};
  const list = {append: card => cards.add(card)};
  const document = {querySelector: key => ({'template[data-catalog]': template, '.hang--small': list})[key]};
  const window = {Live: {
    watch: (key, {state}, cb) => {assert.equal(key, 'projects'); callbacks[state] = cb;},
  }};
  vm.runInNewContext(script, {document, window});
  const roster = {items: [{id: 'project'}], total: 1, portfolio_hidden_count: 1};
  for (const state of ['active', 'frozen']) callbacks[state].data({...roster, portfolio_total: 46}, {viewer: {kind: 'public'}});
  assert.equal(cards.size, 0);
  callbacks.active.data({...roster, items: [{id: 'example', name: '样例项目', owner_catalog: true}]}, {viewer: {kind: 'owner'}});
  callbacks.frozen.data(roster, {viewer: {kind: 'owner'}});
  assert.equal(cards.size, 1);
  assert.equal(label.textContent, '样例项目');
  assert.equal([...cards][0].href, '/live/project/?id=example');
  callbacks.frozen.data(roster, {viewer: {kind: 'public'}});
  assert.equal(cards.size, 0);
  callbacks.active.link({publicPaused: true});
  assert.equal(cards.size, 0);
});

import test from 'node:test'; import assert from 'node:assert/strict';
import fs from 'node:fs'; import vm from 'node:vm';
test('cv redirects and attributes entry once, carries it to home, and preserves self exclusion', () => {
  const local = new Map(), session = new Map(), sent = [], redirects = [], storage = map => ({getItem: key => map.get(key), setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key)});
  const run = (pathname, search = '') => vm.runInNewContext(fs.readFileSync('scripts/visitor-beacon.js', 'utf8'), {URL, URLSearchParams, localStorage: storage(local), sessionStorage: storage(session), location: {pathname, search, replace: url => redirects.push(url)}, document: {hidden: false, referrer: '', readyState: 'loading', addEventListener() {}}, performance: {now: () => 0, getEntriesByType: () => []}, fetch: url => {sent.push(new URL(url).searchParams); return Promise.resolve();}, Image: class {set src(url) {sent.push(new URL(url).searchParams);}}, window: {}, setTimeout: fn => fn(), setInterval() {}, addEventListener() {}});
  run('/cv', '?self=0'); assert.deepEqual(redirects, ['/']); assert.equal(sent.at(-1).get('x-event'), 'entry'); assert.equal(sent.at(-1).get('x-entry'), 'cv'); const visitor = sent.at(-1).get('x-v');
  run('/'); assert.equal(sent.at(-1).get('x-entry'), 'cv'); assert.equal(sent.at(-1).get('x-v'), visitor); run('/'); assert.equal(sent.at(-1).get('x-entry'), '');
  run('/cv/'); assert.equal(sent.at(-1).get('x-entry'), ''); assert.deepEqual(redirects, ['/', '/']); run('/', '?self=1'); assert.equal(sent.at(-1).get('x-self'), '1'); run('/cv/'); assert.equal(sent.at(-1).get('x-self'), '1');
});

test('visible heartbeat and immediate resume retain cumulative time across hiding and bfcache', () => {
  let now = 0, sequence = 0, tick;
  const sent = [], handlers = {}, local = new Map(), storage = {getItem: key => local.get(key), setItem: (key, value) => local.set(key, value)};
  const record = url => sent.push(new URL(url).searchParams);
  const document = {hidden: false, referrer: '', readyState: 'complete', addEventListener: (name, fn) => {handlers[name] = fn;}};
  const context = {URL, URLSearchParams, crypto: {randomUUID: () => String(++sequence)}, localStorage: storage, sessionStorage: {getItem() {}, removeItem() {}},
    location: {pathname: '/', search: ''}, document, performance: {now: () => now, getEntriesByType: () => []}, window: {},
    fetch: url => {record(url); return Promise.resolve();}, Image: class {set src(url) {record(url);}}, setTimeout: fn => fn(),
    setInterval: (fn, ms) => {assert.equal(ms, 15000); tick = fn;}, addEventListener: (name, fn) => {handlers[name] = fn;}};
  vm.runInNewContext(fs.readFileSync('scripts/visitor-beacon.js', 'utf8'), context);
  assert.deepEqual(sent.map(p => p.get('x-event')), ['view', 'perf']);
  now = 15000; tick(); assert.equal(sent.at(-1).get('x-event'), 'heartbeat'); assert.equal(sent.at(-1).get('x-visible'), '15');
  now = 20000; document.hidden = true; handlers.visibilitychange(); handlers.pagehide(); const hiddenCount = sent.length;
  now = 80000; tick(); assert.equal(sent.length, hiddenCount); assert.equal(sent.at(-1).get('x-visible'), '20');
  document.hidden = false; handlers.visibilitychange(); assert.equal(sent.at(-1).get('x-event'), 'resume'); assert.equal(sent.at(-1).get('x-visible'), '20');
  handlers.visibilitychange(); handlers.pageshow({persisted: true}); assert.equal(sent.length, hiddenCount + 1);
  now = 95000; tick(); assert.equal(sent.at(-1).get('x-visible'), '35');
  now = 100000; handlers.pagehide(); const cachedCount = sent.length;
  now = 160000; tick(); assert.equal(sent.length, cachedCount); handlers.pageshow({persisted: true});
  assert.equal(sent.at(-1).get('x-event'), 'resume'); assert.equal(sent.at(-1).get('x-visible'), '40');
  handlers.pageshow({persisted: true}); assert.equal(sent.length, cachedCount + 1);
  now = 175000; tick(); assert.equal(sent.at(-1).get('x-visible'), '55');
  assert.equal(new Set(sent.map(p => p.get('x-id'))).size, 1);
});

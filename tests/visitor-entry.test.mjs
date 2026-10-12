import test from 'node:test'; import assert from 'node:assert/strict';
import fs from 'node:fs'; import vm from 'node:vm';
test('cv redirects and attributes entry once, carries it to home, and preserves self exclusion', () => {
  const local = new Map(), session = new Map(), sent = [], redirects = [], storage = map => ({getItem: key => map.get(key), setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key)});
  const run = (pathname, search = '') => vm.runInNewContext(fs.readFileSync('scripts/visitor-beacon.js', 'utf8'), {URL, URLSearchParams, localStorage: storage(local), sessionStorage: storage(session), location: {pathname, search, replace: url => redirects.push(url)}, document: {hidden: false, referrer: '', readyState: 'loading', addEventListener() {}}, performance: {now: () => 0, getEntriesByType: () => []}, fetch: url => {sent.push(new URL(url).searchParams); return Promise.resolve();}, Image: class {set src(url) {sent.push(new URL(url).searchParams);}}, window: {}, setTimeout: fn => fn(), addEventListener() {}});
  run('/cv', '?self=0'); assert.deepEqual(redirects, ['/']); assert.equal(sent.at(-1).get('x-event'), 'entry'); assert.equal(sent.at(-1).get('x-entry'), 'cv'); const visitor = sent.at(-1).get('x-v');
  run('/'); assert.equal(sent.at(-1).get('x-entry'), 'cv'); assert.equal(sent.at(-1).get('x-v'), visitor); run('/'); assert.equal(sent.at(-1).get('x-entry'), '');
  run('/cv/'); assert.equal(sent.at(-1).get('x-entry'), ''); assert.deepEqual(redirects, ['/', '/']); run('/', '?self=1'); assert.equal(sent.at(-1).get('x-self'), '1'); run('/cv/'); assert.equal(sent.at(-1).get('x-self'), '1');
});

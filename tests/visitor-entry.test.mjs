import test from 'node:test'; import assert from 'node:assert/strict';
import fs from 'node:fs'; import vm from 'node:vm';
test('cv redirects, carries one visit across pages, and starts a fresh visit on each click', () => {
  const local = new Map(), session = new Map(), sent = [], redirects = [], storage = map => ({getItem: key => map.get(key), setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key)});
  const run = (pathname, search = '', hostname = 'wly0829.cn', type = 'navigate') => vm.runInNewContext(fs.readFileSync('scripts/visitor-beacon.js', 'utf8'), {URL, URLSearchParams, localStorage: storage(local), sessionStorage: storage(session), location: {hostname, pathname, search, replace: url => redirects.push(url)}, document: {hidden: false, referrer: '', readyState: 'loading', addEventListener() {}}, performance: {now: () => 0, getEntriesByType: () => [{type}]}, fetch: url => {sent.push(new URL(url).searchParams); return Promise.resolve();}, Image: class {set src(url) {sent.push(new URL(url).searchParams);}}, window: {}, setTimeout: fn => fn(), setInterval() {}, addEventListener() {}});
  run('/cv', '?self=0'); assert.deepEqual(redirects, ['/']); assert.equal(sent.at(-1).get('x-event'), 'entry'); assert.equal(sent.at(-1).get('x-entry'), 'cv'); const visitor = sent.at(-1).get('x-v'), first = sent.at(-1).get('x-cv-session');
  run('/'); assert.equal(sent.at(-1).get('x-entry'), 'cv'); assert.equal(sent.at(-1).get('x-v'), visitor); run('/projects/demo/'); assert.equal(sent.at(-1).get('x-cv-session'), first);
  run('/live/'); assert.equal(sent.at(-1).get('x-v'), visitor);
  run('/live/', '?via=cv');
  const entryAndView = sent.filter(p => p.get('x-entry') === 'live-cv');
  const liveSession = entryAndView[0].get('x-cv-session');
  assert.deepEqual(entryAndView.map(p => p.get('x-event')), ['entry', 'view']);
  assert.ok(liveSession && liveSession !== first && entryAndView.every(p => p.get('x-via') === 'cv'));
  run('/live/', '?via=cv', 'wly0829.cn', 'reload');
  assert.deepEqual(sent.filter(p => p.get('x-entry') === 'live-cv').map(p => p.get('x-event')), ['entry', 'view', 'view']);
  run('/projects/demo/');
  assert.deepEqual([sent.at(-1).get('x-entry'), sent.at(-1).get('x-cv-session'), sent.at(-1).get('x-via')], ['live-cv', liveSession, 'cv']);
  run('/cv/'); assert.equal(sent.at(-1).get('x-entry'), 'cv'); assert.notEqual(sent.at(-1).get('x-cv-session'), first); assert.deepEqual(redirects, ['/', '/']); run('/', '?self=1'); assert.equal(sent.at(-1).get('x-self'), '1'); run('/cv/'); assert.equal(sent.at(-1).get('x-self'), '1');
  session.set('wly-site-cv-last', '0'); run('/'); assert.equal(sent.at(-1).get('x-entry'), '');
  const count = sent.length; run('/live/', '', '192.168.1.25'); run('/cv', '', 'localhost');
  assert.equal(sent.length, count); assert.equal(redirects.at(-1), '/');
  run('/cv/live/', '?example=discarded', 'device.ts.net');
  assert.equal(sent.length, count);
  assert.equal(redirects.at(-1), '/live/');
  for (const pathname of ['/cv/live', '/cv/live/']) {
    const start = sent.length;
    run(pathname, '?self=0&via=ignored');
    assert.equal(redirects.at(-1), '/live/');
    run('/live/');
    const events = sent.slice(start);
    const fields = ['x-event', 'x-entry', 'x-via', 'x-p'];
    assert.deepEqual(events.map(p => fields.map(key => p.get(key))), [['entry', 'live-cv', 'cv', pathname], ['view', 'live-cv', 'cv', '/live/']]);
    assert.ok(events[0].get('x-cv-session') && events[0].get('x-cv-session') === events[1].get('x-cv-session'));
  }
});
test('blocked session storage preserves the known visitor, self mark and cv entry', () => {
  const local = new Map([['wly-site-visitor', 'known'], ['wly-site-self', '1']]);
  for (const [pathname, destination, entry, via] of [['/cv', '/', 'cv', null], ['/cv/live/', '/live/', 'live-cv', 'cv']]) {
    const sent = [], redirects = [];
    vm.runInNewContext(fs.readFileSync('scripts/visitor-beacon.js', 'utf8'), {URL, URLSearchParams, localStorage: {getItem: key => local.get(key)}, sessionStorage: {getItem() {throw Error('blocked');}}, location: {hostname: 'wly0829.cn', pathname, search: '', replace: url => redirects.push(url)}, document: {hidden: false, referrer: ''}, performance: {now: () => 0, getEntriesByType: () => []}, fetch: url => {sent.push(new URL(url).searchParams); return Promise.resolve();}});
    assert.deepEqual(redirects, [destination]);
    const fields = ['x-event', 'x-v', 'x-self', 'x-entry', 'x-via', 'x-cv-session'];
    assert.deepEqual(sent.map(p => fields.map(key => p.get(key))), [['entry', 'known', '1', entry, via, '']]);
  }
});

test('visible heartbeat and immediate resume retain cumulative time across hiding and bfcache', () => {
  let now = 0, sequence = 0, tick;
  const sent = [], handlers = {}, local = new Map(), storage = {getItem: key => local.get(key), setItem: (key, value) => local.set(key, value)};
  const record = url => sent.push(new URL(url).searchParams);
  const document = {hidden: false, referrer: '', readyState: 'complete', addEventListener: (name, fn) => {handlers[name] = fn;}};
  const context = {URL, URLSearchParams, crypto: {randomUUID: () => String(++sequence)}, localStorage: storage, sessionStorage: {getItem() {}, removeItem() {}},
    location: {hostname: 'wly0829.cn', origin: 'https://wly0829.cn', pathname: '/', search: ''}, document, performance: {now: () => now, getEntriesByType: () => []}, window: {},
    fetch: url => {record(url); return Promise.resolve();}, Image: class {set src(url) {record(url);}}, setTimeout: fn => fn(),
    setInterval: (fn, ms) => {assert.equal(ms, 15000); tick = fn;}, addEventListener: (name, fn) => {handlers[name] = fn;}};
  vm.runInNewContext(fs.readFileSync('scripts/visitor-beacon.js', 'utf8'), context);
  assert.deepEqual(sent.map(p => p.get('x-event')), ['view', 'perf']);
  context.location.hash = '#needs'; handlers.hashchange?.();
  assert.equal(sent.filter(p => p.get('x-event') === 'view').length, 1);
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
  const links = ['/live/project/?id=private', 'https://example.invalid/?example=private', '/file?example=private'];
  for (const [index, href] of links.entries()) {
    const link = new URL(href, context.location.origin);
    link.getAttribute = () => href;
    link.hasAttribute = () => index === 2;
    handlers.click({type: 'click', button: 0, isTrusted: true, target: {closest: () => link}});
  }
  handlers['site-email-copied']();
  const actions = sent.filter(p => p.get('x-event') === 'action');
  assert.deepEqual(actions.map(p => p.get('x-action')), ['project_link', 'external_link', 'download', 'email_copy']);
  assert.ok(actions.every(p => !p.toString().includes('private')));
  assert.ok(sent.every(p => p.get('x-id') === sent[0].get('x-id') && p.get('x-v') === sent[0].get('x-v')));
});

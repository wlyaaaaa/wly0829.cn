import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../scripts/site-live-runtime.js', import.meta.url), 'utf8');
const direct = 'https://mcp.wly0829.cn/computer-access/api/status', edge = 'https://live.wly0829.cn/computer-access/state';
function boot(fetch, clock = { setTimeout, clearTimeout }) {
  const sandbox = { module: { exports: {} }, AbortController, Date, setTimeout, clearTimeout, fetch, ...clock };
  vm.runInNewContext(source, sandbox); return sandbox.module.exports;
}
const fresh = (tag) => ({ ok: true, json: async () => ({ observed_at_unix: Date.now() / 1000, tag }) });
// 挂着直到被取消；记下是不是被取消了
const hang = (signal, seen, url) => new Promise((_, reject) => signal.addEventListener('abort', () => { seen.push('aborted ' + url); reject(Error('aborted')); }, { once: true }));

test('both entrances are asked at once; the first valid answer wins and the slower one is cancelled', async () => {
  const seen = [];
  const api = boot(async (url, options) => {
    seen.push(url); assert.equal(options.credentials, 'include'); assert.equal(options.cache, 'no-store');
    return url.startsWith(edge) ? hang(options.signal, seen, 'edge') : fresh('direct');
  });
  const value = await api.readStatus(undefined, true, false);
  assert.equal(value.tag, 'direct');
  assert.deepEqual(seen, [edge + '?refresh=1', direct + '?refresh=1', 'aborted edge']);
  seen.length = 0;
  const other = boot(async (url, { signal }) => { seen.push(url); return url === direct ? hang(signal, seen, 'direct') : fresh('edge'); });
  assert.equal((await other.readStatus(undefined, false, false)).tag, 'edge');
  assert.deepEqual(seen, [edge, direct, 'aborted direct']);
});

test('stale or malformed answers lose to the other entrance; localhost and cancellation keep their boundaries', async () => {
  const seen = [];
  const api = boot(async url => { seen.push(url); return url === edge ? { ok: true, json: async () => ({ observed_at_unix: 1 }) } : fresh('direct'); });
  assert.equal((await api.readStatus(undefined, false, false)).tag, 'direct'); assert.deepEqual(seen, [edge, direct]);
  seen.length = 0; await api.readStatus(undefined, true, true); assert.deepEqual(seen, ['/__status?refresh=1']);
  const ctl = new AbortController(); ctl.abort(); seen.length = 0;
  await assert.rejects(api.readStatus(ctl.signal, false, false)); assert.deepEqual(seen, []);
  const malformed = boot(async url => url === edge ? { ok: true, json: async () => { throw SyntaxError('truncated'); } } : fresh('direct'));
  assert.equal((await malformed.readStatus(undefined, false, false)).tag, 'direct');
});

test('when every entrance fails the last one decides: a 4xx is not retried, a 5xx is retried', async () => {
  let calls = 0;
  const forbidden = boot(async url => { calls++; return url === edge ? Promise.reject(TypeError('unreachable')) : { ok: false, status: 403 }; });
  await assert.rejects(forbidden.readStatus(undefined, false, false), error => error.httpStatus === 403);
  assert.equal(calls, 2);
  calls = 0;
  const clock = { setTimeout: (fn) => setTimeout(fn, 0), clearTimeout };
  const broken = boot(async () => { calls++; return { ok: false, status: 502 }; }, clock);
  await assert.rejects(broken.readStatus(undefined, false, false), error => error.httpStatus === 502);
  assert.equal(calls, 6);
});

test('one round ends after the read budget even if every entrance hangs', async () => {
  const timers = [], seen = [];
  const clock = { setTimeout(fn, delay) { const t = { fn, delay }; timers.push(t); return t; }, clearTimeout(t) { const i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); } };
  const api = boot(async () => { throw Error('unused'); }, clock);
  const read = api.raceStatus([edge, direct], (url, signal) => hang(signal, seen, url), undefined, 8000);
  assert.deepEqual(timers.map(t => t.delay), [8000]);
  timers[0].fn();
  await assert.rejects(read);
  assert.deepEqual(seen.sort(), ['aborted ' + direct, 'aborted ' + edge].sort());
  assert.equal(timers.length, 0);
});

test('local proxy can finish a slow first failure and fallback before the browser deadline', async () => {
  let elapsed = 0; const timers = new Set();
  const clock = { setTimeout(fn, delay) { const t = { fn, at: elapsed + delay }; timers.add(t); return t; }, clearTimeout(t) { timers.delete(t); } };
  const api = boot(async (_url, { signal }) => {
    elapsed = 8500; // 6s upstream timeout, then 2.5s successful fallback.
    for (const t of timers) if (t.at <= elapsed) t.fn();
    assert.equal(signal.aborted, false); return fresh('local');
  }, clock);
  await api.readStatus(undefined, false, true); assert.equal(timers.size, 0);
});

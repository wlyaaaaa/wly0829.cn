import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../scripts/site-live-runtime.js', import.meta.url), 'utf8');
const direct = 'https://mcp.wly0829.cn/computer-access/api/status', edge = 'https://live.wly0829.cn/computer-access/state';
const key = 'site-live-endpoint:v1';
function boot(saved, fetch, clock = { setTimeout, clearTimeout }) {
  const sandbox = { module: { exports: {} }, AbortController, Date, setTimeout, clearTimeout, fetch,
    sessionStorage: { getItem: k => saved.get(k), setItem: (k, v) => saved.set(k, v) }, ...clock };
  vm.runInNewContext(source, sandbox); return sandbox.module.exports;
}
const fresh = () => ({ ok: true, json: async () => ({ observed_at_unix: Date.now() / 1000 }) });
test('new pages prefer direct compressed status and remember a successful fallback for navigation', async () => {
  const saved = new Map(), seen = [];
  const first = boot(saved, async (url, options) => {
    seen.push(url); assert.equal(options.credentials, 'include'); assert.equal(options.cache, 'no-store');
    if (url.startsWith(direct)) throw TypeError('unreachable'); return fresh();
  });
  await first.readStatus(undefined, true, false);
  assert.deepEqual(seen, [direct + '?refresh=1', edge + '?refresh=1']);
  seen.length = 0;
  await boot(saved, async url => { seen.push(url); return fresh(); }).readStatus(undefined, false, false);
  assert.deepEqual(seen, [edge]);
});
test('expired, future and unrecognized preferences cannot replace the fixed endpoint set', async () => {
  for (const value of [{ url: edge, at: Date.now() - 600001 }, { url: edge, at: Date.now() + 60000 },
    { url: 'https://untrusted.example/status', at: Date.now() }, null]) {
    const seen = [], saved = new Map([[key, JSON.stringify(value)]]);
    await boot(saved, async url => { seen.push(url); return fresh(); }).readStatus(undefined, false, false);
    assert.deepEqual(seen, [direct]);
  }
});
test('stale or malformed status falls back; localhost and cancellation keep their boundaries', async () => {
  const seen = [], saved = new Map();
  const api = boot(saved, async url => { seen.push(url); return url === direct ? { ok: true, json: async () => ({ observed_at_unix: 1 }) } : fresh(); });
  await api.readStatus(undefined, false, false); assert.deepEqual(seen, [direct, edge]);
  seen.length = 0; await api.readStatus(undefined, true, true); assert.deepEqual(seen, ['/__status?refresh=1']);
  const ctl = new AbortController(); ctl.abort(); seen.length = 0;
  await assert.rejects(api.readStatus(ctl.signal, false, false)); assert.deepEqual(seen, []);
  const malformed = boot(new Map(), async url => url === direct ? { ok: true, json: async () => { throw SyntaxError('truncated'); } } : fresh());
  await malformed.readStatus(undefined, false, false);
});
test('local proxy can finish a slow first failure and fallback before the browser deadline', async () => {
  let elapsed = 0; const timers = new Set();
  const clock = { setTimeout(fn, delay) { const t = { fn, at: elapsed + delay }; timers.add(t); return t; }, clearTimeout(t) { timers.delete(t); } };
  const api = boot(new Map(), async (_url, { signal }) => {
    elapsed = 8500; // 6s upstream timeout, then 2.5s successful fallback.
    for (const t of timers) if (t.at <= elapsed) t.fn();
    assert.equal(signal.aborted, false); return fresh();
  }, clock);
  await api.readStatus(undefined, false, true); assert.equal(timers.size, 0);
});

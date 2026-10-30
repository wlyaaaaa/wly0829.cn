import test from 'node:test';
import assert from 'node:assert/strict';
import onRequest from '../edge/edgeone/edge-functions/[[path]].js';

test('edge returns headers before the full body and streams without JS recompression', { timeout: 1000 }, async () => {
  const original = globalThis.fetch, originalCompression = globalThis.CompressionStream;
  const payload = JSON.stringify({ items: Array(300000).fill('虚构状态') });
  let stream, forwarded, signal;
  globalThis.CompressionStream = class { constructor() { throw Error('must not compress'); } };
  globalThis.fetch = async (url, init) => {
    forwarded = url; signal = init.signal;
    assert.equal(new Headers(init.headers).get('Accept-Encoding'), 'identity');
    return new Response(new ReadableStream({ start(controller) { stream = controller; } }),
      { headers: { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip', 'Content-Length': '20' } });
  };
  try {
    const response = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state?view=cockpit&refresh=1&extra=ignore', { headers: { Origin: 'https://wly0829.cn', 'Accept-Encoding': 'gzip, br' } }) });
    assert.equal(response.status, 200); assert.equal(signal.aborted, false);
    assert.equal(response.headers.get('Content-Encoding'), null);
    assert.equal(response.headers.get('Content-Length'), null);
    assert.equal(response.headers.get('Vary'), 'Origin, Accept-Encoding, X-Cockpit-Device');
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://wly0829.cn');
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    assert.equal(forwarded, 'https://mcp.wly0829.cn/computer-access/api/status?view=cockpit&refresh=1');
    stream.enqueue(new TextEncoder().encode(payload)); stream.close();
    assert.equal(await response.text(), payload);
    let cancelled = false;
    globalThis.fetch = async () => new Response(new ReadableStream({ cancel() { cancelled = true; } }));
    const head = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state', { method: 'HEAD' }) });
    assert.equal(await head.text(), ''); assert.equal(cancelled, true);
    globalThis.fetch = async () => { throw Error('upstream failed'); };
    const failed = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state', { headers: { Origin: 'https://other.example' } }) });
    assert.equal(failed.status, 504); assert.equal(failed.headers.get('Access-Control-Allow-Origin'), null);
    assert.match(failed.headers.get('Cache-Control'), /no-store/);
  } finally { globalThis.fetch = original; globalThis.CompressionStream = originalCompression; }
});

test('cockpit edge forwards only a well-formed device key and allows it in preflight', async () => {
  const original = globalThis.fetch, seen = [], key = 'A'.repeat(21) + '-_' + 'b9'.repeat(10);
  globalThis.fetch = async (url, init) => { seen.push(new Headers(init.headers).get('X-Cockpit-Device')); return new Response('{"schema":"pcconfig.cockpit-view.v1"}', { headers: { 'Content-Type': 'application/json' } }); };
  try {
    const pre = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state?view=cockpit', { method: 'OPTIONS', headers: { Origin: 'https://wly0829.cn', 'Access-Control-Request-Headers': 'x-cockpit-device' } }) });
    assert.equal(pre.status, 204);
    assert.match(pre.headers.get('Access-Control-Allow-Headers'), /X-Cockpit-Device/);
    assert.equal(seen.length, 0);
    for (const value of [key, key + 'x', 'short', key.slice(0, 42) + '=', '']) {
      const headers = { Origin: 'https://wly0829.cn' };
      if (value) headers['X-Cockpit-Device'] = value;
      const response = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state?view=cockpit', { headers }) });
      assert.equal(response.status, 200);
      assert.match(response.headers.get('Cache-Control'), /no-store/);
      assert.match(response.headers.get('Vary'), /X-Cockpit-Device/);
      // 钥匙不回显在任何响应头里
      assert.ok(![...response.headers.values()].some((h) => value && h.includes(value)));
    }
    assert.deepEqual(seen, [key, null, null, null, null]);
  } finally { globalThis.fetch = original; }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import onRequest from '../edge/edgeone/edge-functions/[[path]].js';

test('cockpit edge recompresses decoded JSON and respects gzip negotiation', async () => {
  const original = globalThis.fetch, payload = JSON.stringify({ schema: 'pcconfig.cockpit-view.v1', items: Array(30000).fill('虚构状态') });
  let forwarded;
  globalThis.fetch = async (url) => {
    forwarded = url;
    // fetch 的正文已经解码，原上游编码头不能直接转发。
    return new Response(payload, { headers: { 'Content-Type': 'application/json', 'Content-Encoding': 'br' } });
  };
  try {
    for (const [encoding, zipped] of [['gzip, br', true], ['br', false], ['gzip;q=0, br', false], ['gzip;q=0.5', true]]) {
      const response = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state?view=cockpit&refresh=1&extra=ignore', { headers: { Origin: 'https://wly0829.cn', 'Accept-Encoding': encoding } }) });
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('Content-Encoding'), zipped ? 'gzip' : null);
      assert.equal((zipped ? gunzipSync(bytes) : bytes).toString(), payload);
      if (zipped) assert.ok(bytes.length < Buffer.byteLength(payload) / 2);
      assert.equal(response.headers.get('Vary'), 'Origin, Accept-Encoding, X-Cockpit-Device');
      assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://wly0829.cn');
      assert.match(response.headers.get('Cache-Control'), /no-store/);
      assert.equal(forwarded, 'https://mcp.wly0829.cn/computer-access/api/status?view=cockpit&refresh=1');
    }
    const head = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state', { method: 'HEAD', headers: { 'Accept-Encoding': 'gzip' } }) });
    assert.equal(head.headers.get('Content-Encoding'), 'gzip');
    assert.equal(await head.text(), '');
    const originalCompression = globalThis.CompressionStream;
    try {
      globalThis.CompressionStream = class { constructor() { throw new TypeError('runtime compression unavailable'); } };
      const fallback = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state', { headers: { 'Accept-Encoding': 'gzip' } }) });
      assert.equal(fallback.status, 200);
      assert.equal(await fallback.text(), payload);
      assert.equal(fallback.headers.get('Content-Encoding'), null);
      assert.equal(fallback.headers.get('X-Compression-Result'), 'identity');
    } finally { globalThis.CompressionStream = originalCompression; }
    try {
      globalThis.CompressionStream = class {
        constructor(format) {
          const stream = new originalCompression(format), reader = stream.readable.getReader();
          this.writable = stream.writable;
          this.readable = { getReader: () => ({ read: async () => {
            const part = await reader.read(), value = part.value;
            return part.done ? part : { done: false, value: value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) };
          } }) };
        }
      };
      const bufferChunks = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state', { headers: { 'Accept-Encoding': 'gzip' } }) });
      assert.equal(gunzipSync(Buffer.from(await bufferChunks.arrayBuffer())).toString(), payload);
    } finally { globalThis.CompressionStream = originalCompression; }
  } finally { globalThis.fetch = original; }
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
import test from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import onRequest from '../edge/edgeone/edge-functions/[[path]].js';

test('cockpit edge recompresses decoded JSON and respects gzip negotiation', async () => {
  const original = globalThis.fetch, payload = JSON.stringify({ schema: 'pcconfig.cockpit-view.v1', items: Array(2000).fill('虚构状态') });
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
      assert.equal(response.headers.get('Vary'), 'Origin, Accept-Encoding');
      assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://wly0829.cn');
      assert.match(response.headers.get('Cache-Control'), /no-store/);
      assert.equal(forwarded, 'https://mcp.wly0829.cn/computer-access/api/status?view=cockpit&refresh=1');
    }
    const head = await onRequest({ request: new Request('https://live.wly0829.cn/computer-access/state', { method: 'HEAD', headers: { 'Accept-Encoding': 'gzip' } }) });
    assert.equal(head.headers.get('Content-Encoding'), 'gzip');
    assert.equal(await head.text(), '');
  } finally { globalThis.fetch = original; }
});

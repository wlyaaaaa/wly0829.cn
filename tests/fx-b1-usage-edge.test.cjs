const assert = require('node:assert/strict');
const {test} = require('node:test');

test('offline usage at every range or cursor returns only fallback metadata', async (t) => {
  const {default: handle} = await import('../edge/edgeone/edge-functions/[[path]].js');
  const packet = {viewer: {kind: 'public'}, data: {recent: [{name: 'saved'}]}};
  const at = '2026-11-20T10:00:00.000Z';
  const origin = 'https://origin.invalid';
  const path = '/computer-access/live/v1/computer/usage';
  const call = (query) => handle({request: new Request(`https://edge.invalid${path}${query}`), env: {LIVE_ORIGIN: origin}});
  const upstreamQueries = [];
  let online = true, cloudReads = 0, cacheReads = 0;
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (!url.startsWith(origin)) {
      cloudReads++;
      return Response.json({metadata_only: true, at, publication: {policy: 'policy-11', audience: 'a'.repeat(64)}, resources: {'computer/usage': packet}});
    }
    upstreamQueries.push(new URL(url).search);
    return online ? Response.json({data: {recent: [{name: 'live'}]}}) : new Response(null, {status: 502});
  });
  const originalCaches = globalThis.caches;
  globalThis.caches = {open: async () => { cacheReads++; throw Error('no cache'); }};
  t.after(() => { globalThis.caches = originalCaches; });

  const first = '?limit=5&range=72h';
  assert.equal((await call(first)).headers.get('X-Live-Source'), null);
  online = false;
  const offline = [first, '?range=24h', '?range=7d', '?range=30d', '?range=72h&range=30d', `${first}&cursor=next`, `${first}&cursor=`, '?range=72h&block=focus&snapshot=abc'];
  for (const query of offline) {
    const response = await call(query);
    assert.equal(response.status, 503, query);
    assert.equal(response.headers.get('X-Live-Source'), 'oss', query);
    const body = await response.json();
    assert.deepEqual(body, {error: 'snapshot_metadata_only', at: null, now: body.now}, query);
  }
  assert.deepEqual(upstreamQueries, [first, ...offline]);
  assert.deepEqual([cacheReads, cloudReads], [0, offline.length]);
});

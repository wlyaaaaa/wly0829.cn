import test from 'node:test';
import assert from 'node:assert/strict';
import handle from '../edge/edgeone/edge-functions/[[path]].js';

const oss = 'https://wly0829-img-media-shanghai.cn-shanghai.oss.aliyuncs.com/live/v1/fallback.json';
const origin = 'https://live.wly0829.cn/computer-access/live/v1/';
const at = '2026-11-17T12:00:00.000Z';
const policy = 'policy-11';
const audience = 'a'.repeat(64);
const call = (path = 'home', method = 'GET', headers = {}) =>
  handle({request: new Request(origin + path, {method, headers})});

test('computer response wins; an unverifiable cloud bundle only gives the public timestamp', async () => {
  const restore = globalThis.fetch;
  let online = true, cloudReads = 0, generation = audience;
  const title = 'old synthetic private title';
  const packet = {v: 1, at, viewer: {kind: 'public'}, data: {title}};
  const ownerPacket = {viewer: {kind: 'owner'}, data: {title: 'current owner original'}};
  globalThis.fetch = async (url, init) => {
    if (url === oss) {
      cloudReads++;
      assert.equal(init.cache, 'no-store');
      assert.equal(init.headers, undefined);
      return Response.json({metadata_only: true, at, publication: {policy, audience: generation},
        resources: {'chats/synthetic': packet}});
    }
    assert.equal(init.headers['X-Cockpit-Device'], 'a'.repeat(43));
    assert.equal(init.cache, 'no-store');
    if (online) {
      assert.equal(new URL(url).search, '?opened=page%2Fchat');
      return Response.json(ownerPacket, {headers: {'Cache-Control': 'private, no-store'}});
    }
    return new Response('offline', {status: 502});
  };
  const headers = {Origin: 'https://wly0829.cn', 'X-Cockpit-Device': 'a'.repeat(43)};
  try {
    const direct = await call('chats/synthetic?opened=page%2Fchat', 'GET', headers);
    assert.deepEqual(await direct.json(), ownerPacket);
    assert.equal(direct.headers.get('Cache-Control'), 'no-store');
    assert.equal(cloudReads, 0);
    online = false;
    const prior = await call('chats/synthetic', 'GET', headers);
    assert.equal(prior.status, 503);
    assert.equal(prior.headers.get('X-Live-Source'), 'oss');
    assert.equal(prior.headers.get('X-Live-Fallback-Policy'), policy);
    assert.equal(prior.headers.get('X-Live-Fallback-Audience'), audience);
    assert.match(prior.headers.get('Access-Control-Expose-Headers'), /X-Live-Fallback-Audience/);
    assert.equal(prior.headers.get('Cache-Control'), 'no-store');
    const safe = await prior.json();
    assert.deepEqual(safe, {at, error: 'snapshot_metadata_only', now: safe.now});
    generation = 'b'.repeat(64);
    const current = await call('chats/synthetic', 'HEAD', headers);
    assert.equal(current.status, 503);
    assert.equal(current.body, null);
    assert.equal(current.headers.get('X-Live-Fallback-Audience'), generation);
    assert.notEqual(prior.headers.get('ETag'), current.headers.get('ETag'));
    assert.equal(cloudReads, 2);
  } finally { globalThis.fetch = restore; }
});

test('reject broken or old fallback packages', async () => {
  const restore = globalThis.fetch;
  try {
    for (const reply of [
      () => new Response('', {status: 404}),
      () => {throw Error('network');},
      () => new Response('{bad'),
      () => Response.json({at, publication: {policy, audience}}),
      () => Response.json({metadata_only: true, at, publication: {policy: 'policy-9', audience}}),
      () => Response.json({metadata_only: true, at, publication: {policy}}),
    ]) {
      globalThis.fetch = async url => {if (url === oss) return reply(); throw Error('origin offline');};
      const response = await call();
      assert.equal(response.status, 503);
      assert.equal(response.headers.get('X-Live-Source'), null);
      assert.equal(response.headers.get('X-Live-Connection'), 'unreachable');
      assert.equal((await response.json()).error, 'snapshot_unavailable');
    }
  } finally { globalThis.fetch = restore; }
});

test('shutdown marker, OSS receipt and resource time stay independent', async t => {
  const value = {v: 1, seq: 1, metadata_only: true, at, publication: {policy, audience}, resources: {home: {at: '2026-11-17T11:50:00.000Z'}}};
  let status = 502, cloudReads = 0;
  t.mock.method(globalThis, 'fetch', async url => {
    if (url !== oss) return new Response('{}', {status});
    cloudReads++;
    return Response.json(value, {headers: {'Last-Modified': 'Tue, 17 Nov 2026 12:00:05 GMT'}});
  });
  for (const [marker, basis, originStatus, connection] of [
    [undefined, undefined, 502, 'unreachable'], [true, 'windows_poweroff', 502, 'unreachable'],
    [at, undefined, 502, 'unreachable'], [at, 'network_timeout', 502, 'unreachable'],
    [at, 'windows_poweroff', 502, 'host-off'], [at, 'windows_poweroff', 503, 'service'],
  ]) {
    [value.host_off_at, value.host_off_basis, status] = [marker, basis, originStatus];
    const response = await call();
    const body = await response.json(), confirmed = connection === 'host-off';
    assert.equal(response.status, 503);
    assert.deepEqual([response.headers.get('X-Live-Connection'), response.headers.get('X-Live-Offline-Since'), response.headers.get('X-Live-Last-Seen'), body.at], [connection, confirmed ? at : null, '2026-11-17T12:00:05.000Z', value.resources.home.at]);
    assert.deepEqual([body.host_off_basis, body.host_off_at], confirmed ? ['windows_poweroff', at] : [undefined, undefined]);
  }
  status = 502;
  const beforeScreen = cloudReads;
  const screen = await call('screen?refresh=1');
  assert.equal(screen.status, 503);
  assert.equal(cloudReads, beforeScreen);
  assert.deepEqual(['X-Live-Connection', 'X-Live-Source', 'X-Live-Offline-Since', 'X-Live-Last-Seen'].map(name => screen.headers.get(name)),
    ['unreachable', null, null, null]);
  const screenBody = await screen.json();
  assert.deepEqual(screenBody, {error: 'snapshot_unavailable', text: '暂时连不上电脑', now: screenBody.now});
});

test('origin withdrawals, missing details, temporary unavailability and empty statuses pass through', async () => {
  const restore = globalThis.fetch;
  let upstream, cloudReads = 0;
  globalThis.fetch = async (url, opts) => {
    if (url === oss) {cloudReads++; throw Error('unexpected fallback');}
    assert.equal(opts.headers['If-None-Match'], '"same"');
    return upstream;
  };
  const headers = {'If-None-Match': '"same"'};
  try {
    for (const status of [204, 205, 304]) {
      upstream = new Response(null, {status, headers: {ETag: '"same"'}});
      const response = await call('home', 'GET', headers);
      assert.equal(response.status, status);
      assert.equal(response.body, null);
      assert.equal(response.headers.get('ETag'), '"same"');
    }
    for (const [status, error] of [[403, 'live_origin'], [404, 'live_missing'], [503, 'live_public_paused'],
      [503, 'live_detail_unavailable'], [503, 'live_publication_revoked']]) {
      const payload = {error, text: 'synthetic response'};
      upstream = Response.json(payload, {status});
      const response = await call('chats/synthetic', 'GET', headers);
      assert.equal(response.status, status);
      assert.equal(response.headers.get('X-Live-Source'), null);
      assert.deepEqual(await response.json(), payload);
    }
    assert.equal(cloudReads, 0);
  } finally { globalThis.fetch = restore; }
});

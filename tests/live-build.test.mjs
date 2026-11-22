import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url);
const source = new URL('../site-v2/live/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('release-manifest.json', dist), 'utf8'));
const logicalByUrl = new Map(Object.entries(manifest.oss.objects).map(([logical, entry]) => [entry.url, logical]));
const artifact = url => new URL(logicalByUrl.get(url) || url.replace(/^\//, ''), dist);

test('the live snapshot is built with its S13 reader and without fixture payloads', async () => {
  const reader = manifest.oss.objects['live/_lib/live-client.js'];
  assert.ok(reader, 'the shared live reader is published');
  const fallback = manifest.oss.objects['live/_fallback.json']?.url;
  const identity = JSON.parse(await readFile(new URL('release-identity.json', dist), 'utf8'));
  const copy = identity.live_fallback;
  assert.equal(copy && copy.origin + '/' + copy.key, fallback);
  const expectedSource = await readFile(new URL('_lib/live-client.js', source), 'utf8');
  assert.deepEqual(await readFile(new URL('live/_lib/live-client.js', dist)), Buffer.from(expectedSource));
  for (const name of (await readdir(source, { recursive: true })).filter(name => name.endsWith('.html') && !name.includes('_fixtures'))) {
    const route = 'live/' + name.replaceAll('\\', '/');
    const html = await readFile(new URL(route, dist), 'utf8');
    assert.match(html, /<main[\s>]/, route);
    assert.match(html, /name="viewport" content="width=1440"/, route);
    assert.ok(html.includes(reader.url), `${route} uses the shared live reader`);
    assert.doesNotMatch(html, /http-equiv="refresh"/, route);
  }
  assert.ok(!Object.keys(manifest.oss.objects).some(name => name.startsWith('live/_fixtures/')));
});

test('old cockpit addresses redirect lightly and retain the incoming query and hash', async () => {
  for (const [route, target] of [
    ['cockpit/', '/live/'], ['cockpit/ai/', '/live/ledger/'],
    ['cockpit/storage/', '/live/storage/'], ['cockpit/stutter/', '/live/computer/#stutters']
  ]) {
    const html = await readFile(new URL(route + 'index.html', dist), 'utf8');
    assert.ok(Buffer.byteLength(html) < 2000, route);
    assert.match(html, /name="robots" content="noindex"/, route);
    assert.ok(html.includes(`href="${target}"`), route);
    const scripts = await Promise.all([...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].map(async ([, attrs, body]) => {
      const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
      return src ? readFile(artifact(src), 'utf8') : body;
    }));
    assert.ok(scripts.length, `${route} preserves query and hash with JavaScript`);
    for (const [search, hash] of [['', ''], ['?self=1&from=notice', '#pair=sample']]) {
      const jumps = [], location = { origin: 'https://wly0829.cn', search, hash, href: `https://wly0829.cn/${route}${search}${hash}`, replace: value => jumps.push(String(value)) };
      for (const script of scripts) vm.runInNewContext(script, { URL, URLSearchParams, location, window: { location } });
      const expected = new URL(target, 'https://wly0829.cn');
      expected.search = search; if (hash) expected.hash = hash;
      assert.deepEqual(jumps.map(value => new URL(value, location.href).href), [expected.href], route);
    }
  }
});

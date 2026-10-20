import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://wly0829.cn';
const snapshot = JSON.parse(await readFile(path.join(root, 'site-astro/sources/frozen-site/manifest.json'), 'utf8'));
const sources = await Promise.all((await readdir(path.join(root, 'sources/pages'))).map(async name => JSON.parse(await readFile(path.join(root, 'sources/pages', name, 'page.json'), 'utf8'))));
const documentPath = route => path.join(root, 'dist', route === '/' ? 'index.html' : route.endsWith('.html') ? route.slice(1) : route.slice(1) + 'index.html');
const documents = new Map(await Promise.all(snapshot.routes.map(async route => [route, await readFile(documentPath(route), 'utf8')])));
const decode = value => value?.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, entity => ({'&amp;':'&','&quot;':'"','&apos;':"'",'&#39;':"'",'&lt;':'<','&gt;':'>'})[entity]);
const meta = (html, name) => decode(html.match(new RegExp(`<meta\\b[^>]*\\b(?:name|property)="${name}"[^>]*\\bcontent="([^"]*)"`))?.[1]);
function assertCurrentDocument(html, route) {
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  assert.ok(canonical?.startsWith(siteUrl + '/'), `${route} lacks a site canonical`);
  if (/http-equiv="refresh"/.test(html) || /<meta[^>]*(?:robots|googlebot)[^>]*noindex/.test(html.split('</head>')[0])) return false;
  assert.equal(canonical, siteUrl + route, `${route} canonical drifted`);
  assert.match(html, /<main[\s>]/, `${route} lacks static content`);
  const source = sources.find(page => page.url === new URL(canonical).pathname);
  if (source && !['/', '/cockpit/', '/computer-access/'].includes(route)) {
    for (const screen of source.screens) assert.ok(html.includes(`id="${screen.id}"`), `${route} omits ${screen.id}`);
  }
  return true;
}

test('SEO, sitemap, robots and custom 404 match the current route set', async () => {
  const indexable = [];
  for (const [route, html] of documents) {
    if (!assertCurrentDocument(html, route)) continue;
    const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1]);
    assert.ok(title && meta(html, 'description')?.trim(), `${route} lacks title or description`);
    assert.equal(meta(html, 'og:title'), title, `${route} Open Graph title drifted`);
    assert.equal(meta(html, 'twitter:title'), title, `${route} Twitter title drifted`);
    assert.equal(meta(html, 'og:description'), meta(html, 'description'), `${route} Open Graph description drifted`);
    assert.equal(meta(html, 'og:url'), siteUrl + route, `${route} Open Graph URL drifted`);
    assert.match(meta(html, 'og:image') || '', /^https:\/\//, `${route} lacks a share image`);
    if (route.endsWith('/')) indexable.push(siteUrl + route);
  }
  const sitemap = await readFile(path.join(root, 'dist/sitemap.xml'), 'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).sort(), indexable.sort());
  assert.match(await readFile(path.join(root, 'dist/robots.txt'), 'utf8'), /Sitemap: https:\/\/wly0829\.cn\/sitemap\.xml/);
  const notFound = await readFile(path.join(root, 'dist/404.html'), 'utf8');
  assert.match(notFound, /啦啦啦，没找到页面啦/);
  assert.match(notFound, /name="robots" content="noindex/);
});

test('search ownership verification files survive the complete build', async () => {
  for (const name of ['baidu_verify_codeva-DRgaQnAmTK.html', 'sogousiteverification.txt']) {
    assert.deepEqual(await readFile(path.join(root, 'dist', name)), await readFile(path.join(root, 'public', name)), name);
  }
});

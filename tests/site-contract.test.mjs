import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://wly0829.cn';
const manifest = JSON.parse(await readFile(path.join(root, 'dist/release-manifest.json'), 'utf8'));
const verificationFiles = new Set(['baidu_verify_codeva-DRgaQnAmTK.html', 'sogousiteverification.txt']);
const routes = Object.keys(manifest.files).filter(name => name.endsWith('.html') && !verificationFiles.has(name))
  .map(name => '/' + (name.endsWith('index.html') ? name.slice(0, -10) : name));
const documentPath = route => path.join(root, 'dist', route === '/' ? 'index.html' : route.endsWith('.html') ? route.slice(1) : route.slice(1) + 'index.html');
const documents = new Map(await Promise.all(routes.map(async route => [route, await readFile(documentPath(route), 'utf8')])));
const decode = value => value?.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, entity => ({'&amp;':'&','&quot;':'"','&apos;':"'",'&#39;':"'",'&lt;':'<','&gt;':'>'})[entity]);
const meta = (html, name) => decode(html.match(new RegExp(`<meta\\b[^>]*\\b(?:name|property)="${name}"[^>]*\\bcontent="([^"]*)"`))?.[1]);
function assertCurrentDocument(html, route) {
  if (/http-equiv="refresh"/.test(html) || /<meta[^>]*(?:robots|googlebot)[^>]*noindex/.test(html.split('</head>')[0])) return false;
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  assert.ok(canonical?.startsWith(siteUrl + '/'), `${route} lacks a site canonical`);
  assert.equal(canonical, new URL(route, siteUrl).href, `${route} canonical drifted`);
  assert.match(html, /<main[\s>]/, `${route} lacks static content`);
  return true;
}

test('SEO, sitemap, robots and custom 404 match the current route set', async () => {
  const indexable = [];
  for (const [route, html] of documents) {
    if (!assertCurrentDocument(html, route)) continue;
    const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1]);
    assert.ok(title && meta(html, 'description')?.trim(), `${route} lacks title or description`);
    assert.equal(meta(html, 'og:title'), title, `${route} Open Graph title drifted`);
    assert.equal(meta(html, 'og:description'), meta(html, 'description'), `${route} Open Graph description drifted`);
    assert.equal(meta(html, 'og:url'), new URL(route, siteUrl).href, `${route} Open Graph URL drifted`);
    assert.match(meta(html, 'og:image') || '', /^https:\/\//, `${route} lacks a share image`);
    indexable.push(new URL(route, siteUrl).href);
  }
  const sitemap = await readFile(path.join(root, 'dist/sitemap.xml'), 'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(decode(m[1])).href).sort(), indexable.sort());
  assert.match(await readFile(path.join(root, 'dist/robots.txt'), 'utf8'), /Sitemap: https:\/\/wly0829\.cn\/sitemap\.xml/);
  const notFound = await readFile(path.join(root, 'dist/404.html'), 'utf8');
  assert.match(notFound, /这里没有这页/);
  assert.match(notFound, /href="\/"/);
  assert.match(notFound, /name="robots" content="noindex/);
  assert.doesNotMatch(notFound, /rel="canonical"/);
});

test('search ownership verification files survive the complete build', async () => {
  for (const name of ['baidu_verify_codeva-DRgaQnAmTK.html', 'sogousiteverification.txt']) {
    assert.deepEqual(await readFile(path.join(root, 'dist', name)), await readFile(path.join(root, 'public', name)), name);
  }
  const manifest = JSON.parse(await readFile(path.join(root, 'dist/release-manifest.json'), 'utf8'));
  assert.ok(manifest.files['sogousiteverification.txt'], 'Sogou ownership TXT must be a root Pages file');
  assert.ok(!manifest.oss.objects['sogousiteverification.txt'], 'Sogou ownership TXT must not be split to OSS');
});

test('old document skill links resolve to the skill and the project link resolves to its overview', () => {
  for (const route of ['/skills/document-materials/', '/skills/personal-formal-documents/'])
    assert.match(documents.get(route), /content="0;url=\/document-materials\/personal-formal-documents\.html"/);
  assert.match(documents.get('/projects/document-materials/'), /content="0;url=\/document-materials\/project\.html"/);
});

test('project subpages and rules topics identify the exact page in sharing metadata', () => {
  assert.equal(meta(documents.get('/agents/规矩落地.html'), 'og:title'), '规矩落地 · AI 百工谱');
  const topics = [...documents].filter(([route]) => route.startsWith('/rules/topic-'));
  const titles = topics.map(([, html]) => meta(html, 'og:title'));
  assert.ok(titles.length > 1);
  assert.equal(new Set(titles).size, titles.length);
  assert.equal(meta(documents.get('/rules/topic-engineering-delivery.html'), 'og:title'), '工程与交付 · 规则');
});

test('the wall includes page-find text at each link without duplicating the artwork accessible name', () => {
  for (const route of ['/projects/', '/skills/']) {
    const links = [...documents.get(route).matchAll(/<a class="piece"[^>]*>([\s\S]*?)<\/a>/g)];
    assert.ok(links.length > 0);
    for (const [, link] of links) {
      const label = link.match(/<span aria-hidden="true" class="piece__find-label">([^<]+)<\/span>/)?.[1];
      assert.ok(label && link.includes('alt="' + label + '"'));
    }
  }
});

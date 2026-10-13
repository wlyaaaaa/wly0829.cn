import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('release-manifest.json', dist), 'utf8'));
const logicalByUrl = new Map(Object.entries(manifest.oss.objects).map(([logical, entry]) => [entry.url, logical]));
const sceneryTypes = new Set(['sway', 'drift', 'glow', 'daylight', 'glint', 'part']);

async function assetFile(src, context) {
  assert.equal(typeof src, 'string', `${context} 缺少资源地址`);
  const url = src.replaceAll('&amp;', '&');
  const logical = logicalByUrl.get(url) || (url.startsWith('/') && !url.startsWith('//') ? url.slice(1) : null);
  assert.ok(logical, `${context} 无法映射到发布文件：${src}`);
  const file = new URL(logical, dist);
  assert.ok((await stat(file)).isFile(), `${context} 对应资源不是实际文件：${logical}`);
  return file;
}

for (const route of ['/how/', '/cockpit/', '/projects/wly0829-cn/', '/skills/documents/', '/skills/pdf/']) {
  test(`${route} 首屏有景物动效及完整遮罩资源`, async () => {
    const html = await readFile(new URL(`${route.slice(1)}index.html`, dist), 'utf8');
    const figure = html.match(/<figure\b[^>]*\bdata-living-config=(['"])(.*?)\1[^>]*>/i);
    assert.ok(figure, `${route} 首屏缺少 figure[data-living-config]`);
    const config = JSON.parse(await readFile(await assetFile(figure[2], `${route} 动效配置`), 'utf8'));
    for (const orientation of ['h', 'v']) {
      const side = config[orientation];
      assert.ok(Array.isArray(side?.effects) && side.effects.some(effect => sceneryTypes.has(effect.type)),
        `${route} ${orientation} 缺少景物动效`);
      for (const mask of side.masks || []) await assetFile(mask.src, `${route} ${orientation} 遮罩`);
    }
  });
}

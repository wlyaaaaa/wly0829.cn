import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const loader = await readFile(new URL('../site-v2/trial/first-projects/网站示意/公用/page-loader.js', import.meta.url), 'utf8');
const files = ['content.js', 'page.js', 'button-art.js'];

test('the reading page retries only the unavailable script and resumes its dependencies', async () => {
  for (const unavailable of files.slice(0, 2)) {
    const requests = [];
    let status, click, shown = false, fail = true;
    const element = () => ({
      append: () => {}, setAttribute: () => {}, remove: () => { if (shown) shown = false; },
      addEventListener: (_, callback) => { click = callback; },
    });
    const document = {
      querySelectorAll: () => files.map(src => ({ dataset: { src } })),
      createElement: type => type === 'p' ? (status = element()) : type === 'button' ? element() : { remove() {} },
      querySelector: selector => selector === '#pictures' ? { prepend(node) { assert.equal(node, status); shown = true; } } : null,
      head: { append(script) {
        requests.push(script.src);
        const missed = fail && script.src === unavailable;
        if (missed) fail = false;
        queueMicrotask(missed ? script.onerror : script.onload);
      } },
    };
    vm.runInNewContext(loader, { document });
    await new Promise(setImmediate);
    assert.equal(shown, true);
    assert.equal(requests.at(-1), unavailable);
    await click();
    assert.equal(shown, false);
    assert.deepEqual(requests, files.flatMap(file => file === unavailable ? [file, file] : [file]));
  }
});

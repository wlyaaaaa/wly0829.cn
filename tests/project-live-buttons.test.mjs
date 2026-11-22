import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

for (const [id, label, topic] of [['timeaudit', '看用电', 'power'], ['pcconfig', '看存储', 'storage']]) {
  test(`${id} links to its project live view and the topic page`, async () => {
    const folder = new URL(`../site-v2/trial/first-projects/网站示意/${id}/`, import.meta.url);
    const source = await readFile(new URL('content.js', folder), 'utf8');
    const [config, data] = source.split('window.PAGE_DATA = ');
    const { buttonArt } = JSON.parse(config.split('window.PROJECT_CONFIG = ')[1].trimEnd().slice(0, -1));
    const { project } = JSON.parse(data.trimEnd().slice(0, -1));
    const links = project.flatMap(card => card.buttons ?? []).filter(({ href }) => href?.startsWith('/live/'));
    assert.deepEqual(links.map(({ label, href }) => [label, href]), [['看实况', `/live/project/?id=${id}`], [label, `/live/${topic}/`]]);
    for (const { label } of links) await access(new URL('assets/buttons/' + buttonArt[label][0], folder));
  });
}

import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));

test('the website is a visible project and its card, counts and complete source agree', async () => {
  const page = await json('sources/pages/wly0829-cn/page.json');
  const home = await json('sources/pages/projects-home/page.json');
  const plan = await json('config/final-project-order.json');
  assert.equal(plan.projects.find(item => item.id === page.page)?.content_path, 'sources/pages/wly0829-cn/page.json');
  assert.equal(plan.non_card_explanations.some(item => item.id === 'website-presentation-infrastructure'), false);
  assert.equal(page.screens.length, 14);
  assert.equal(page.registry.features.length, 39);
  const card = home.screens.find(screen => screen.id === 'projects-home-20');
  assert.notEqual(card.hidden, true);
  assert.equal(card.card.href, page.url);
  assert.equal(card.card.github, page.repo_url);
  const urls = home.registry.groups.flatMap(group => group.members);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes(page.url));
  const pages = await Promise.all((await readdir(new URL('sources/pages/', root))).map(name => json(`sources/pages/${name}/page.json`)));
  const selected = pages.filter(item => urls.includes(item.url));
  assert.equal(selected.length, urls.length);
  assert.equal(home.registry.numbers.find(item => item.id === 'n-projects').text, `${selected.length} 个项目`);
  const features = selected.reduce((sum, item) => sum + item.registry.features.length, 0);
  assert.ok(home.registry.numbers.find(item => item.id === 'n-features').text.startsWith(`功能 ${features} 条`));
  const layout = await json('sources/pages/wly0829-cn/layout.json');
  for (const screen of page.screens) for (const orientation of ['h', 'v']) {
    assert.equal(layout.filter(item => item.screen === screen.id && item.orientation === orientation).length, 1);
  }
});

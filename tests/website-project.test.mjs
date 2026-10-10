import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));

test('the website is a visible project and its card, counts and complete source agree', async () => {
  const page = await json('sources/pages/wly0829-cn/page.json');
  const homeSource = await json('sources/pages/projects-home/page.json');
  const home = JSON.parse(execFileSync(process.env.PYTHON || 'python', ['-c',
    "import json; from src.typeset.engine.content import bound_json; print(json.dumps(bound_json('sources/pages/projects-home/page.json'), ensure_ascii=False))"
  ], { cwd: fileURLToPath(root), encoding: 'utf8', windowsHide: true, env: { ...process.env, PYTHONUTF8: '1' } }));
  assert.equal(homeSource.registry.numbers.find(item => item.id === 'n-projects').text, '{{scale.total}} 个项目');
  assert.ok(homeSource.registry.numbers.find(item => item.id === 'n-features').text.includes('{{scale.features}}'));
  const plan = await json('config/final-project-order.json');
  assert.equal(plan.projects.find(item => item.id === page.page)?.content_path, 'sources/pages/wly0829-cn/page.json');
  assert.equal(plan.non_card_explanations.some(item => item.id === 'website-presentation-infrastructure'), false);
  assert.equal(page.screens.length, 14);
  assert.equal(page.registry.features.length, 39);
  const card = home.screens.find(screen => screen.id === 'projects-home-20');
  assert.notEqual(card.hidden, true);
  assert.equal(card.card.href, page.url);
  assert.equal(card.card.github, page.repo_url);
  const canonicalProjectUrl = url => ({ '/projects/codex-local-remote/': '/projects/codex-remote/', '/projects/github-local-index/': '/projects/github-index/' }[url] || url);
  const urls = home.registry.groups.flatMap(group => group.members).map(canonicalProjectUrl);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes(page.url));
  const pages = await Promise.all((await readdir(new URL('sources/pages/', root))).map(name => json(`sources/pages/${name}/page.json`)));
  const selected = pages.filter(item => urls.includes(item.url));
  assert.equal(selected.length, urls.length);
  const projectPages = pages.filter(item => ['project', 'frozen'].includes(item.kind));
  assert.deepEqual(new Set(urls), new Set(projectPages.map(item => item.url)));
  assert.equal(home.registry.numbers.find(item => item.id === 'n-projects').text, `${projectPages.length} 个项目`);
  assert.equal(home.registry.numbers.find(item => item.id === 'n-projects').text, `${selected.length} 个项目`);
  const features = selected.reduce((sum, item) => sum + item.registry.features.length, 0);
  assert.ok(home.registry.numbers.find(item => item.id === 'n-features').text.startsWith(`功能 ${features} 条`));
  const layout = await json('sources/pages/wly0829-cn/layout.json');
  for (const screen of page.screens) for (const orientation of ['h', 'v']) {
    assert.equal(layout.filter(item => item.screen === screen.id && item.orientation === orientation).length, 1);
  }
});

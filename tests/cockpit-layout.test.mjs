import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../site-astro/src/cockpit/cockpit.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rules = (selector) => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter((m) => m[1].trim() === selector).map((m) => m[2]).join(';');

test('定稿布局：左侧吸顶总览、右侧内容；手机按指定顺序单列', () => {
  assert.match(rules('.cp-dashboard'), /grid-template-columns:\s*370px minmax\(0, 1fr\)/);
  assert.match(rules('.cp-dashboard'), /grid-template-areas:\s*"sidebar workspace"/);
  assert.match(rules('.cp-sidebar'), /position:\s*sticky;\s*top:\s*120px/);
  assert.match(rules('.cp-sidebar, .cp-workspace'), /display:\s*contents/);
  assert.match(rules('.cp-dashboard'), /"intro" "art" "need" "home" "status" "facts"/);
  assert.match(rules('.cp-facts-wall'), /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.doesNotMatch(rules('.cp-facts-wall'), /columns:\s*[23]/);
});

test('窄列表上下排、名称不断开，消息进展和下一步完整可见', () => {
  assert.match(rules('.cp-wait li'), /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.doesNotMatch(rules('.cp-wait li'), /minmax\(12em/);
  assert.match(rules('.cp-ailist > li:has(> .cp-oa)'), /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(rules('.cp-proj-list b'), /white-space:\s*nowrap/);
  assert.doesNotMatch(css, /\.cp-(?:facts|proj-list)\s*\{\s*grid-template-columns:\s*repeat\(2,/);
  assert.match(rules('.cp-know-text :is(.cp-detail, .cp-know-progress, .cp-know-next)'), /white-space:\s*normal;\s*overflow:\s*visible/);
  assert.doesNotMatch(rules('.cp-know-text small'), /display:\s*none/);
  assert.doesNotMatch(rules('.cp-score'), /display:\s*none/);
});

test('即时收起隐藏整条，运行行的打开与复制共用按钮行', () => {
  assert.match(rules('.cp-page .is-hidden-action'), /display:\s*none !important/);
  assert.match(rules('.cp-run-row > .cp-oa'), /grid-column:\s*1 \/ -1/);
  assert.match(rules('.cp-run-row .cp-oa-bar'), /display:\s*flex;\s*flex-wrap:\s*wrap/);
});

test('全站组件：共享卡片、叶子毛笔标题、按钮与数字格，保留完整阅读和图标', () => {
  const base = readFileSync(new URL('../src/typeset/style/base.css', import.meta.url), 'utf8');
  for (const name of ['title', 'text', 'accent', 'line', 'muted']) {
    const value = new RegExp(`--${name}:\\s*([^;]+)`).exec(base)?.[1].trim();
    assert.ok(css.includes(`--${name}: ${value};`), name);
  }
  for (const name of ['comp-text/cards', 'comp-hub/headings', 'comp-hub/link_stats', 'comp-text/buttons']) {
    assert.ok(css.includes(`@import "../../../src/typeset/components/${name}.css"`));
    const shared = readFileSync(new URL(`../src/typeset/components/${name}.css`, import.meta.url), 'utf8');
    assert.doesNotMatch(shared, /(?:^|})\s*(?:html|body|:root|nav|\*)\s*[{,]/m);
  }
  assert.match(rules('.cp-main-title img'), /display:\s*block/);
  assert.match(rules('.cp-block-heading .hub-leaf'), /leaf-l\.png/);
  assert.match(rules('.cp-block-heading .hub-brush'), /strip-brush\.png/);
  assert.match(rules('.cp-page .ct-inline-action'), /min-width:\s*0/);
  assert.match(rules('.cp-page [data-copy] svg'), /width:\s*15px;\s*height:\s*15px/);
  assert.match(rules('.cp-page .cp-ask'), /grid-template-columns:\s*minmax\(0, 1fr\) auto/);
  assert.match(rules('.cp-status'), /grid-template-columns:\s*repeat\(2,/);
  assert.match(rules('.cp-page .cp-tri-status .cp-dot'), /display:\s*inline-block/);
  assert.match(rules('.cp-score-meter'), /width:\s*100%;\s*height:\s*7px/);
  assert.match(css, /@container \(max-width: 600px\)/);
  assert.match(rules('.cp-know-list > li > .cp-oa'), /grid-column:\s*1 \/ -1;\s*grid-row:\s*auto/);
  assert.doesNotMatch(css, /#ai-following-table[^{}]*\.cp-oa[^{}]*\{[^}]*visibility:\s*hidden/);
});

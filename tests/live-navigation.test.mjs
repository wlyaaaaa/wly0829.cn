import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../site-v2/live/_lib/live-ui.js', import.meta.url), 'utf8');
const base = 'http://example.test';

function boot(path, previous, previousPublic = false) {
  const click = {};
  const location = new URL(path, base);
  const link = Object.assign(new URL('/live/', base), {
    textContent: '实况', style: {}, hasAttribute: () => false,
    addEventListener: (type, fn) => { click[type] = fn; },
  });
  const history = { length: 2, returns: 0, back() { this.returns++; } };
  const window = { addEventListener() {}, LiveView: { isPublic: () => false }, navigation: previous && {
    currentEntry: { index: 1, getState: () => null }, updateCurrentEntry() {},
    entries: () => [{ url: new URL(previous, base).href, getState: () => ({ livePublicView: previousPublic }) }],
  } };
  const document = {
    documentElement: { childNodes: [] }, addEventListener() {},
    getElementById: () => ({ querySelector: () => true, querySelectorAll: () => [] }),
    querySelectorAll: () => [link],
  };
  const event = { button: 0, currentTarget: link, preventDefault() { this.defaultPrevented = true; } };
  vm.runInNewContext(source, { window, document, location, history, URL, Node: { TEXT_NODE: 3, ELEMENT_NODE: 1 },
    matchMedia: () => ({}), MutationObserver: class { observe() {} } });
  return { ...window.LiveUI, click, history, event, link };
}

test('finished reply previews remove a joined list marker in both views', () => {
  const { chatPreviewSummary } = boot('/live/', null);
  for (const kind of ['owner', 'public'])
    assert.equal(chatPreviewSummary('- 已完成。- CPU 正常。* 两处已核对。“原样。- CPU”“- ”、x-y、Done.+ CPU, 3 - 2。- 12℃\n  + 结论\n2. 保留', { state: 'done' }, kind),
      '已完成。CPU 正常。两处已核对。“原样。- CPU”“- ”、x-y、Done. CPU, 3 - 2。- 12℃\n结论\n2. 保留');
});

test('usage header keeps its live overview link native, unlike other live headers', () => {
  for (const path of ['/live/usage/', '/live/usage/index.html']) {
    const { click, link } = boot(path, '/live/computer/');
    assert.equal(click.click, undefined);
    assert.equal(link.href, base + '/live/');
  }
  assert.equal(typeof boot('/live/computer/', '/live/').click.click, 'function');
});

test('body back requires an ordinary click, matching destination and matching audience', () => {
  for (const [previous, ctrlKey, expected, previousPublic] of [[null, false, 0], ['/live/computer/', false, 0], ['/live/?project=x', false, 0], ['/live/', true, 0], ['/live/', false, 0, true], ['/live/', false, 1]]) {
    const { restoreBack, history, event } = boot('/live/usage/', previous, previousPublic);
    restoreBack(Object.assign(event, { ctrlKey }));
    assert.deepEqual([history.returns, !!event.defaultPrevented], [expected, !!expected]);
  }
});

test('body back to an overview card ignores the card hash only when the previous page is the overview', () => {
  for (const [previous, expected] of [['/live/', 1], ['/live/#projects', 1], ['/live/computer/', 0], ['/live/?project=x', 0]]) {
    const { restoreBack, history, event, link } = boot('/live/backups/', previous);
    link.hash = '#backups';
    restoreBack(event);
    assert.deepEqual([history.returns, !!event.defaultPrevented], [expected, !!expected]);
  }
});

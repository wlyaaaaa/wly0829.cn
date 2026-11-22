import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
test('FN3 hover uses sentences and interception counts for both viewers; time still uses minutes', () => {
  const node = () => {
    const bySelector = new Map();
    return { children: [], style: {}, clientWidth: 320, clientHeight: 140, classList: { add() {}, remove() {}, toggle() {} },
      querySelector(s) { if (!bySelector.has(s)) bySelector.set(s, node()); return bySelector.get(s); },
      querySelectorAll() { return []; }, get firstElementChild() { return this.querySelector('svg'); },
      getBoundingClientRect() { return { left: 0, width: 320 }; }, setAttribute() {}, replaceChildren() {}, append() {} };
  };
  const window = { LiveUI: { esc: String, html(el, value) { el.innerHTML = value; }, pointing(plot, hover) { plot.hover = hover; } } };
  const context = vm.createContext({ window, document: { createElement: node, createElementNS: node }, ResizeObserver: class { observe() {} } });
  for (const name of ['_lib/live-chart.js', '_lib/live-viz.js', 'project/additions.js'])
    vm.runInContext(readFileSync(new URL('../site-v2/live/' + name, import.meta.url), 'utf8'), context);
  const first = { date: '2026-11-19', total: 143 }, second = { date: '2026-11-20', total: 270 };
  for (const viewer of ['owner', 'public']) {
    const [card] = window.ProjectAdditions.cards('agents', {}, viewer, { corrections: { refresh: 'archive', days: [first, second], hook_days: [{ ...first, total: 5 }] } }, String);
    const viz = node(); window.ProjectAdditions.render(card, { viz }, window.LiveUI.html, window.LiveViz.bars);
    const host = viz.querySelector('[data-addition-chart="rule-effect"]');
    host.querySelector('.vz-bars__plot').hover({ clientX: 90 });
    assert.match(host.querySelector('.chart__vals').innerHTML, /<b>143 句<\/b>.*<b>5 次<\/b>/);
    assert.doesNotMatch(host.querySelector('.chart__axis').innerHTML, /分钟|小时/);
  }
  const time = node(), series = [{ id: 'usage', label: '在用' }];
  window.LiveViz.bars(time, { unit: '分钟', series }).set({ labels: [{ text: '今天' }], values: { usage: [4] } });
  time.querySelector('.vz-bars__plot').hover({ clientX: 90 });
  assert.match(time.querySelector('.chart__vals').innerHTML, /<b>4 分钟<\/b>/);
});

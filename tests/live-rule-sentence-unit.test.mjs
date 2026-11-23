import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
test('bar chart hover keeps the unit it was given (minutes stay minutes)', () => {
  const node = () => {
    const bySelector = new Map();
    return { children: [], style: {}, clientWidth: 320, clientHeight: 140, classList: { add() {}, remove() {}, toggle() {} },
      querySelector(s) { if (!bySelector.has(s)) bySelector.set(s, node()); return bySelector.get(s); },
      querySelectorAll() { return []; }, get firstElementChild() { return this.querySelector('svg'); },
      getBoundingClientRect() { return { left: 0, width: 320 }; }, setAttribute() {}, replaceChildren() {}, append() {} };
  };
  const window = { LiveUI: { esc: String, html(el, value) { el.innerHTML = value; }, pointing(plot, hover) { plot.hover = hover; } } };
  const context = vm.createContext({ window, document: { createElement: node, createElementNS: node }, ResizeObserver: class { observe() {} } });
  for (const name of ['_lib/live-chart.js', '_lib/live-viz.js'])
    vm.runInContext(readFileSync(new URL('../site-v2/live/' + name, import.meta.url), 'utf8'), context);
  const time = node(), series = [{ id: 'usage', label: '在用' }];
  window.LiveViz.bars(time, { unit: '分钟', series }).set({ labels: [{ text: '今天' }], values: { usage: [4] } });
  time.querySelector('.vz-bars__plot').hover({ clientX: 90 });
  assert.match(time.querySelector('.chart__vals').innerHTML, /<b>4 分钟<\/b>/);
});

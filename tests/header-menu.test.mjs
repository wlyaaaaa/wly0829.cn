import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../scripts/header-menu.js', import.meta.url), 'utf8');
function fixture() {
  const listeners = new Map(), events = {};
  const element = (selector = '') => ({
    dataset: {}, attrs: {}, visible: true, style: {
      value: 'auto', priority: 'important',
      getPropertyValue() { return this.value; }, getPropertyPriority() { return this.priority; },
      setProperty(_, value, priority = '') { this.value = value; this.priority = priority; },
      removeProperty() { this.value = ''; this.priority = ''; }
    },
    setAttribute(key, value) { this.attrs[key] = value; }, hasAttribute(key) { return key in this.attrs; },
    matches(value) { return value === selector; },
    closest(value) { return value.split(', ').includes(selector) ? this : null; },
    getClientRects() { return this.visible ? [{}] : []; }
  });
  const open = element('#open-menu'), close = element('.close-menu'), link = element('a[href]');
  const menu = Object.assign(element(), {
    open: false, showModal() { this.open = true; }, close() { this.open = false; events.close?.({}); },
    contains(target) { return [close, link].includes(target); },
    addEventListener(type, fn) { events[type] = fn; },
    getBoundingClientRect() { return { left: 10, right: 90, top: 10, bottom: 90 }; }
  });
  const document = {
    body: element(), documentElement: element(),
    querySelector: () => menu, querySelectorAll: () => [open],
    addEventListener(type, fn, capture) { assert.equal(capture, true); listeners.set(type, fn); }
  };
  const windowEvents = {};
  const scope = { document, getComputedStyle: () => ({ visibility: 'visible' }),
    addEventListener(type, fn) { windowEvents[type] = fn; } };
  const run = () => vm.runInNewContext(source, scope);
  run();
  const click = (target, extras = {}) => {
    const event = { target, prevented: false, stopped: false, clientX: 50, clientY: 50,
      preventDefault() { this.prevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...extras };
    listeners.get('click')(event);
    return event;
  };
  return { open, close, menu, link, document, events, windowEvents, run, click, listeners };
}

test('opens without a legacy runtime and takes over legacy controls only once', () => {
  const f = fixture(), handler = f.listeners.get('click'); f.run();
  assert.equal(f.listeners.get('click'), handler);
  assert.equal(f.click(f.open).stopped, true); assert.equal(f.menu.open, true);
  assert.equal(f.open.attrs['aria-expanded'], 'true');
  assert.equal(f.open.attrs['aria-controls'], 'menu'); assert.equal(f.open.attrs['aria-haspopup'], 'dialog');
  assert.equal(f.document.body.style.value, 'hidden');
  f.click(f.close); assert.equal(f.menu.open, false); assert.equal(f.document.body.style.value, 'auto');
  assert.equal(f.document.body.style.priority, 'important');
});

test('menu links retain default navigation and other listeners; only actual backdrop closes', () => {
  const f = fixture(); f.click(f.open); f.click(f.menu);
  assert.equal(f.menu.open, true);
  f.click(f.menu, { clientX: 0 }); assert.equal(f.menu.open, false);
  f.click(f.open); const event = f.click(f.link);
  assert.equal(f.menu.open, false); assert.equal(event.prevented, false); assert.equal(event.stopped, false);
});

test('Escape and native close keep accessibility and scroll state synchronized', () => {
  const f = fixture(); f.click(f.open); let prevented = false;
  f.events.cancel({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true); assert.equal(f.open.attrs['aria-expanded'], 'false');
  assert.equal(f.document.documentElement.style.value, 'auto');
  f.click(f.open); f.menu.close(); assert.equal(f.open.attrs['aria-expanded'], 'false');
});

test('page lifecycle closes overlays and resizing respects actual trigger visibility', () => {
  const f = fixture(); f.click(f.open); f.windowEvents.resize(); assert.equal(f.menu.open, true);
  f.open.visible = false; f.windowEvents.resize(); assert.equal(f.menu.open, false);
  f.open.visible = true;
  for (const type of ['pagehide', 'pageshow']) {
    f.click(f.open); f.windowEvents[type](); assert.equal(f.menu.open, false);
    assert.equal(f.document.body.style.value, 'auto');
  }
});

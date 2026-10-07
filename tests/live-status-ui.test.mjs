import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const sandbox = { module: { exports: {} }, Intl, Date };
vm.runInNewContext(readFileSync(new URL('../scripts/live-status-ui.js', import.meta.url), 'utf8'), sandbox);
const ui = sandbox.module.exports;

test('success, failure, waiting and unreadable remain visually distinct', () => {
  assert.equal(ui.view({ state: 'ok', text: '运行正常' }, { slot: 'run' }).tone, 'ok');
  assert.equal(ui.view({ state: 'failed', text: '上次运行失败' }, { slot: 'run' }).tone, 'failed');
  assert.equal(ui.view({ state: 'waiting', text: '2 项待验收' }, { slot: 'acceptance' }).tone, 'waiting');
  assert.equal(ui.view({ state: 'unknown', text: '暂时读不到' }, { slot: 'run' }).tone, 'unknown');
  assert.equal(ui.view({ state: 'ok' }, { slot: 'run' }).tone, 'unknown');
  assert.equal(ui.view(null, { slot: 'backup' }).body, '暂时读不到');
});

test('historical success never becomes a current green status', () => {
  const result = Object.freeze({ state: 'ok', text: '运行正常', cached: true, readAt: 1791063000 });
  const model = ui.view(result, { slot: 'run' });
  assert.equal(model.state, 'offline');
  assert.equal(model.tone, 'unknown');
  assert.equal(model.history, true);
  assert.equal(model.sourceState, 'ok');
  assert.equal(result.state, 'ok');
  assert.equal(ui.view({ state: 'ok', text: '运行正常', source: { status: 'unavailable' } }).tone, 'unknown');
  assert.equal(ui.view({ state: 'offline', text: '读不到电脑 · 还没读到过', cached: false }).history, false);
});

test('reader-supplied observation time renders in Beijing independently of browser timezone', () => {
  assert.equal(ui.view({ state: 'failed', text: '失败', readAt: '2026-10-04T01:26:00Z' }).timeLabel, '北京时间 09:26 读取');
  assert.equal(ui.view({ state: 'offline', text: '读不到电脑', cached: true, readAt: '2026-10-03T23:59:00Z' }).timeLabel, '北京时间 2026年10月4日 07:59 读到');
  assert.equal(ui.view({ state: 'unknown', text: '读不到', readAt: '2026-10-04 09:26:00' }).timeLabel, '尚无成功读数');
  assert.equal(ui.view({ state: 'unknown', text: '读不到', readAt: 0 }).time, null);
});

test('titles use existing semantic mapping and preserve the reader text', () => {
  assert.equal(ui.view({ state: 'unknown', text: '暂时读不到' }, { slot: 'internal-key' }).title, '当前状态');
  assert.equal(ui.view({ state: 'ok', text: '运行正常' }, { slot: 'run', title: '本项目运行' }).title, '本项目运行');
  const model = ui.view({ state: 'offline', text: '读不到电脑 · 当时：运行正常 · 上次读到 今天 09:26 · 当前状态未知' }, { slot: 'run' });
  assert.equal(model.lines.length, 4);
  assert.equal(model.lines.join(' · '), model.body);
  assert.equal(ui.view({ state: 'unknown' }).body.includes('0'), false);
});

test('asset and detail links use ordinary copied URLs without local filesystem references', () => {
  assert.equal(ui.view({ text: '在线', state: 'ok', href: 'https://example.invalid/chart' }, { icon: '/_shared/cloud-1234.png' }).href, 'https://example.invalid/chart');
  assert.equal(ui.view({ text: '在线', state: 'ok', href: 'javascript:alert(1)' }).href, null);
  assert.equal(ui.view({ text: '在线', state: 'ok' }, { icon: 'file:///E:/private/icon.png' }).icon, null);
  assert.equal(ui.view({ text: '在线', state: 'ok' }, { slot: 'cloud', icons: { cloud: '/_shared/cloud-1234.png' } }).icon, '/_shared/cloud-1234.png');
});

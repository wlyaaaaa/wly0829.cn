import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const script = readFileSync(new URL('../site-astro/src/scripts/live-dom.js', import.meta.url), 'utf8');
async function boot(empty_text = {}, cached = null, pending = false, b2 = false) {
  const node = () => ({ dataset: {}, children: [], className: '', textContent: '', hidden: false,
    setAttribute(k, v) { this[k] = v; }, removeAttribute(k) { delete this[k]; },
    append(...v) { this.children.push(...v); }, replaceChildren(...v) { this.children = v; }, closest() { return null; } });
  const boxes = ['run', 'local'].map(k => Object.assign(node(), { dataset: { href: k } }));
  const main = { prepend(n) { main.notice = n; } }, root = node();
  const pd = { page: 'test', project: 'test', kind: b2 ? 'mcp' : 'project', status_binding: { empty_text } };
  const document = { documentElement: root, body: node(), hidden: false,
    querySelector: s => s === '#page-data' ? { textContent: JSON.stringify(pd) } : main,
    querySelectorAll: () => boxes, createElement: node, addEventListener() {}, dispatchEvent() {} };
  let timeout, rejected = pending === 'failed', values = {}, storage = cached ? JSON.stringify(cached) : null;
  const window = { SiteLiveRuntime: { readStatus: async () => {
    if (pending === true) return new Promise(() => {}); if (rejected) throw Error('offline'); return {};
  }, parse: (_, k) => values[k] || { state: 'unknown' } } };
  const context = { window, document, localStorage: { getItem: () => storage, setItem: (_, v) => { storage = v; } },
    Intl, Date, AbortController, Event, Element: class {}, addEventListener() {},
    setTimeout: (f, ms) => { assert.equal(ms, 2000); timeout = f; }, setInterval() {}, MutationObserver: class { observe() {} } };
  if (b2) window.SiteB2 = { getSnapshot: () => ({ phase: rejected ? 'error' : 'ready' }), value: k => values[k] };
  vm.runInNewContext(script, context); await new Promise(resolve => setImmediate(resolve));
  return { window, boxes, main, root, timeout: () => timeout(), text: k => boxes[k].dataset.liveText,
    refresh: async (next, fail = false) => { values = next; rejected = fail; await window.LiveDom.refresh(); } };
}
test('首次读取只占位两秒，超时整块提示一次；成功后恢复', async () => {
  const p = await boot({}, null, true);
  assert.equal(p.boxes[0].dataset.state, 'empty'); assert.equal(p.main.notice, undefined);
  p.timeout(); assert.equal(p.root.dataset.liveDom, 'unavailable');
  assert.equal(p.main.notice.textContent, '暂时读不到实时状态');
  assert.ok(p.boxes.every(b => b.dataset.state !== 'empty' && !b.dataset.liveText));
  const q = await boot(); q.timeout(); assert.equal(q.window.LiveDom.state, 'live');
});
test('首次读取立即失败也等到两秒才提示，不重复到每个项', async () => {
  const p = await boot({}, null, 'failed'); assert.equal(p.window.LiveDom.state, 'empty');
  assert.equal(p.main.notice, undefined); p.timeout(); assert.equal(p.main.notice.textContent, '暂时读不到实时状态');
});
test('读到数据但整页无值，显示默认或作者文案；按文字写入', async () => {
  const p = await boot({ local: '<b>按需启动</b>' });
  assert.equal(p.window.LiveDom.state, 'live'); assert.equal(p.text(0), '现在没有这一项的记录');
  assert.equal(p.text(1), '<b>按需启动</b>'); assert.equal(p.boxes[1].children[1].textContent, p.text(1));
  assert.equal(p.main.notice, undefined); assert.ok(p.boxes.every(b => b.dataset.state !== 'empty'));
});
test('后续缺项改为空态，断线保留最后值并提示一次，恢复清除提示', async () => {
  const p = await boot(); await p.refresh({ run: { text: '正在运行', state: 'running' } });
  await p.refresh({}, true); assert.equal(p.text(0), '正在运行'); assert.equal(p.boxes[0].dataset.state, 'cached');
  const notice = p.main.notice; assert.match(notice.textContent, /北京时间/);
  await p.refresh({}, true); assert.equal(p.main.notice, notice);
  await p.refresh({}); assert.equal(p.text(0), '现在没有这一项的记录'); assert.ok(notice.hidden);
});
test('已有缓存首次断线保持原有行为；SiteB2 成功无值也显示人话', async () => {
  const at = Date.now(), p = await boot({}, { project: 'test', at, values: { run: { text: '旧值', at, state: 'ok' } } }, 'failed');
  p.timeout(); assert.equal(p.text(0), '旧值'); assert.match(p.main.notice.textContent, /北京时间/);
  const q = await boot({}, null, false, true); assert.equal(q.text(1), '现在没有这一项的记录');
});

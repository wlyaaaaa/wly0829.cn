import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../scripts/today-river.js', import.meta.url), 'utf8');
const lines = source.split('\n');
const helpers = lines.find(line => line.startsWith('const esc =')) + '\n' +
  source.slice(source.indexOf('const parse ='), source.indexOf('let seed ='));
const render = vm.runInNewContext(helpers + '\n' +
  source.slice(source.indexOf('function sort(snap)'), source.indexOf('// ---------- 画面 ----------')) +
  `\nraw => { const m = sort({automation:{observed_at:'2026-11-06T08:00:00Z',items:[raw]}}); return six(m,m.tasks[0]); }`, { URL });
const phone = (extra = {}) => ({ state: 'success', enabled: true,
  plain: { name: '合成手机收取', status_note: '复制 2 份、转写 0 段、待转写 1 段；转写方式：云端' },
  outcomes: { kind: 'phone_personalos_pull', media_autopull: { status: 'ok' } }, ...extra });

test('手机媒体成功详情保留运行状态并显示最近结果', () => {
  const html = render(phone());
  assert.match(html, /有没有出错<\/b>没有，上次运行正常/);
  assert.match(html, /最近结果<\/b>复制 2 份、转写 0 段、待转写 1 段；转写方式：云端/);
});
test('等待连接、失败和 AI 在管时也显示当前已有说明', () => {
  for (const extra of [{ status_note: '手机未连接，稍后自动再试' },
    { state: 'failed', status_note: '合成失败原因' },
    { state: 'failed', color: 'neutral', ai_handling: 'AI 在管：合成处理中' }]) {
    const html = render(phone(extra));
    assert.match(html, /最近结果<\/b>/);
    assert.ok(html.includes(extra.ai_handling?.replace(/^AI 在管：/, '') || extra.status_note));
  }
});
test('其他任务、无媒体结果和空说明保持原输出', () => {
  for (const extra of [{ outcomes: { kind: 'other', media_autopull: {} } },
    { outcomes: { kind: 'phone_personalos_pull' } }, { plain: { name: '合成手机收取' } }])
    assert.doesNotMatch(render(phone(extra)), /最近结果/);
});
test('最近结果转义接口文本', () => {
  const html = render(phone({ status_note: '<img src=x onerror=alert(1)>' }));
  assert.match(html, /最近结果<\/b>&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html, /<img/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { copyText, ownerBox } from '../site-astro/src/cockpit/actions.js';
import { copyToClipboard } from '../site-astro/src/cockpit/clipboard.js';

const now = new Date('2026-10-29T18:40:00+08:00');
test('复制完整卡片：固定开场、进展、原因、步骤、选项建议、确认、北京时间和编号', () => {
  const text = copyText({ id: 'fixture-1', headline: '示例标题', progress: { text: '示例已做到第二步' }, why_you: '示例需要你选择', consequence: '示例会暂停',
    steps: ['示例第一步', '示例第二步'], options: [{ value: 'a', text: '示例甲', detail: '示例甲的说明', recommended: true }, { value: 'b', text: '示例乙' }],
    confirmation: { to: '示例收件方', content: '示例消息正文', amount: '示例 10 元', target: '示例目标' },
    created_at: '2026-10-29T10:00:00Z', due_at: '2026-10-30T01:00:00Z', updated_at: '2026-10-29T10:30:00Z', path: 'V:\\Fictional\\示例报告.html' });
  assert.ok(text.startsWith('先用大白话给我解释这是什么事、为什么找我、现在到哪一步、我可以怎么做；先别执行任何操作。我下了明确命令，你就直接去做，不用再问我确认。\n\n驾驶舱卡片：示例标题'));
  assert.match(text, /现在：示例已做到第二步\n为什么找我：示例需要你选择\n不做会怎样：示例会暂停/);
  assert.match(text, /怎么办：\n1\. 示例第一步\n2\. 示例第二步/);
  assert.match(text, /要我选的：\n示例甲（AI 建议）：示例甲的说明\n示例乙/);
  assert.match(text, /要我确认的：\n发给：示例收件方\n发什么：示例消息正文\n花多少：示例 10 元\n删什么：示例目标/);
  assert.match(text, /时间：登记 10月29日 18:00；截止 10月30日 09:00；更新 10月29日 18:30/);
  assert.match(text, /路径：V:\\Fictional\\示例报告.html\n编号：fixture-1$/);
});

test('无值行省略、无编号照样复制、data-copy转义后不能注入HTML', () => {
  const title = '示例 <button data-act="ack"> & "标题"';
  const text = copyText({ title });
  assert.equal(text.split('\n').length, 3);
  assert.doesNotMatch(text, /编号：|时间：|怎么办：|现在：|要我选的：|要我确认的：/);
  const html = ownerBox({ title }, { now, viewer: { kind: 'owner' } });
  assert.match(html, /data-copy="[^]*&lt;button data-act=&quot;ack&quot;&gt; &amp; &quot;标题&quot;/);
  assert.doesNotMatch(html, /<button data-act="ack">/);
  assert.equal((html.match(/<button/g) || []).length, 1);
});

test('原始进展、正在做、最近回复和下一步里的路径都完整保留并去重', () => {
  const text = copyText({ title: '示例', progress: { summary: '进展 V:\\Fictional\\progress.md' }, doing: '正在核对 V:\\Fictional\\doing.md',
    latest_reply: { summary: '最近回复 V:\\Fictional\\reply.md' }, next_step: '下一步 V:\\Fictional\\next.md', latest_progress: '进展 V:\\Fictional\\progress.md' });
  for (const name of ['progress', 'doing', 'reply', 'next']) assert.ok(text.includes(`V:\\Fictional\\${name}.md`));
  assert.equal((text.match(/progress\.md/g) || []).length, 1);
});

test('运行详情、状态、开始和最近活动时间保留原始上下文', () => {
  const text = copyText({ title: '示例运行', detail: '详情 E:\\Fictional\\运行报告.html', status: 'network_retry',
    started_at: '2026-10-29T10:00:00Z', last_activity_at: '2026-10-29T10:30:00Z' });
  assert.ok(text.includes('现在：详情 E:\\Fictional\\运行报告.html'));
  assert.match(text, /状态：网络在重连/);
  assert.match(text, /时间：开始 10月29日 18:00；最近活动 10月29日 18:30/);
  const timed = copyText({ status: 'quota_exhausted', status_text: '本轮额度用完了', progress: { at: '2026-10-29T10:10:00Z' }, latest_reply: { at: '2026-10-29T10:20:00Z' } });
  assert.match(timed, /状态：本轮额度用完了/);
  assert.match(timed, /进展 10月29日 18:10；最近回复 10月29日 18:20/);
});

const fakeDocument = (result = true) => {
  const events = [], area = { style: {}, setAttribute(k, v) { events.push([k, v]); }, select() { events.push('select'); }, remove() { events.push('remove'); } };
  const doc = { activeElement: { focus() { events.push('focus'); } }, createElement(tag) { assert.equal(tag, 'textarea'); return area; }, body: { append(node) { assert.equal(node, area); events.push('append'); } }, execCommand(cmd) { assert.equal(cmd, 'copy'); events.push('copy'); return result; } };
  return { doc, area, events };
};
test('优先原生剪贴板，成功时不建文本框', async () => {
  const writes = [];
  const ok = await copyToClipboard('示例原文', { clipboard: { async writeText(text) { writes.push(text); } } }, { createElement() { throw new Error('不应创建'); } });
  assert.equal(ok, true); assert.deepEqual(writes, ['示例原文']);
});
test('剪贴板拒绝后回退隐藏textarea，复制完清除并恢复焦点', async () => {
  const { doc, area, events } = fakeDocument();
  assert.equal(await copyToClipboard('V:\\Fictional\\示例', { clipboard: { async writeText() { throw new Error('denied'); } } }, doc), true);
  assert.equal(area.value, 'V:\\Fictional\\示例');
  assert.match(area.style.cssText, /left:-9999px/);
  assert.deepEqual(events.slice(-4), ['select', 'copy', 'remove', 'focus']);
});
test('两个复制入口都失败时返回失败，不伪装成功，仍清理文本框', async () => {
  const { doc, events } = fakeDocument(false);
  assert.equal(await copyToClipboard('示例', {}, doc), false);
  assert.deepEqual(events.slice(-2), ['remove', 'focus']);
});

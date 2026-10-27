// 驾驶舱本人版 / 公开版的显示：全部数据虚构（“示例私事 A”这类中性示例）
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page, viewerLine, PRIVATE_TITLE } from '../site-astro/src/cockpit/render.js';

const now = new Date();
const base = (extra = {}) => ({ schema: 'pcconfig.cockpit-view.v1', served_at: now.toISOString(), ...extra });
const ctx = { now, offline: false, phase: 'live', projectUrls: {}, img: {} };
const ph = (id, extra = {}) => ({ id, ask_kind: 'do', state: 'pending', owner_only: true, placeholder: true, title: PRIVATE_TITLE, steps: [], ...extra });

test('本人版：页头小字、仅你可见标签和一行“具体”', () => {
  const v = normalize(base({
    viewer: { kind: 'owner', device_state: 'ok', device_name: '示例设备' }, private_count: 2,
    need_you: [{ id: 'n1', title: '示例私事 A：去办一下', ask_kind: 'do', owner_only: true, owner_detail: '示例平台 10月20日 回复说还要补一份示例材料' },
      { id: 'n2', title: '示例技术事项：核对一次备份', ask_kind: 'do', owner_detail: null }],
    ai_following: [{ id: 'a1', title: '示例私事 B：等对方回复', owner_only: true, owner_detail: '上次进展 10月25日' }],
    deferred: [{ id: 'd1', title: '示例私事 C', action_owner: 'user', owner_only: true, owner_detail: 'x'.repeat(260) }],
  }));
  assert.deepEqual(v.viewer, { kind: 'owner', device_state: 'ok', device_name: '示例设备' });
  assert.equal(v.private_count, 2);
  assert.equal(viewerLine(v), '<span class="cp-viewer-line is-owner">本人设备 · 全部显示（其中 2 件公网看不到）</span>');
  const need = REGIONS['need-you'](v, ctx);
  assert.equal((need.match(/class="cp-own">仅你可见/g) || []).length, 3);
  assert.match(need, /<span class="cp-detail" tabindex="0" title="示例平台 10月20日 回复说还要补一份示例材料">具体：示例平台/);
  assert.match(need, /具体：上次进展 10月25日/);
  // “具体”最多 200 字；没有具体的行不出这一行
  assert.ok(need.includes('具体：' + 'x'.repeat(200) + '<') && !need.includes('x'.repeat(201)));
  assert.equal((need.match(/cp-detail/g) || []).length, 3);
  assert.doesNotMatch(need, /is-private|data-pub/);
  // 双登记：带 public_title 的行，标签悬停或点开显示公网那句
  const pub = REGIONS['need-you'](normalize(base({ need_you: [{ id: 'n3', title: '示例私事 D', ask_kind: 'do', owner_only: true, public_title: '周一上午打一个电话' }] })), ctx);
  assert.match(pub, /<span class="cp-own" tabindex="0" title="公网显示为：周一上午打一个电话" data-pub="公网显示为：周一上午打一个电话">仅你可见<\/span>/);
  // 0 件私事时仍标本人设备，不加括号
  assert.equal(viewerLine(normalize(base({ viewer: { kind: 'owner', device_state: 'ok' }, private_count: 0 }))), '<span class="cp-viewer-line is-owner">本人设备 · 全部显示</span>');
});

test('公开版：占位行灰显只剩标题和编号按钮，页头标注件数', () => {
  const v = normalize(base({
    viewer: { kind: 'public', device_state: 'none', device_name: null }, private_count: 3,
    need_you: [ph('n1', { questions: null, mobile_method: null }), { id: 'n2', title: '示例技术事项：核对一次备份', ask_kind: 'do' }],
    ai_following: [ph('a1', { owner_detail: '不该出现' })],
    deferred: [ph('d1', { action_owner: 'user' }), ph('d2', { action_owner: 'user', title: '周一上午打一个电话' })],
    must_know: { state: 'ok', items: [{ id: 'k1', kind: 'report', placeholder: true, owner_only: true, title: PRIVATE_TITLE, text: null }] },
  }));
  assert.equal(viewerLine(v), '<span class="cp-viewer-line">公开版 · 3 件私人事项只在本人设备上显示</span>');
  const need = REGIONS['need-you'](v, ctx);
  const card = /<article class="cp-ask is-private" id="todo-n1">.*?<\/article>/.exec(need)?.[0] || '';
  assert.ok(card.includes(PRIVATE_TITLE) && card.includes('data-copy-ai="n1"'));
  assert.doesNotMatch(card, /data-copy-answer|data-copy-text|cp-quiz|cp-chip|去办/);
  assert.ok(need.includes(`<li class="is-wait is-private"><span title="私人事项，详情只在本人设备上显示">${PRIVATE_TITLE}</span></li>`));
  assert.ok(need.includes(`<li class="is-private"><span title="私人事项，详情只在本人设备上显示">${PRIVATE_TITLE}</span></li>`));
  // 占位行的公开说法不一定是默认占位字，照行里的 title 显示
  assert.ok(need.includes('<li class="is-private"><span title="私人事项，详情只在本人设备上显示">周一上午打一个电话</span></li>'));
  assert.doesNotMatch(need, /仅你可见|cp-detail|不该出现|还没核对过|等你方便时/);
  // 你得知道的占位行照样占一条，计数不变
  const ov = REGIONS.overview(v, { ...ctx, ov: { stale: () => false, lamp: () => '' } });
  assert.match(ov, /<li id="know-k1" class="is-report is-private">.*私人事项（只在本人设备上显示）/);
  // 公开版不会露出“本人设备”
  assert.doesNotMatch(page(v, ctx), /本人设备 · 全部显示/);
});

test('没有 viewer / private_count 的旧数据：什么都不加，和原来一样', () => {
  const row = { id: 'n1', title: '示例技术事项：核对一次备份', ask_kind: 'do' };
  const old = normalize(base({ need_you: [row] }));
  assert.equal(old.viewer, null);
  assert.equal(old.private_count, null);
  assert.equal(viewerLine(old), '');
  assert.equal(viewerLine(normalize(base({ viewer: { kind: 'public', device_state: 'none' }, private_count: 0 }))), '');
  assert.equal(REGIONS['need-you'](old, ctx), REGIONS['need-you'](normalize(base({ need_you: [row], private_count: 0 })), ctx));
  assert.match(page(old, ctx), /<p class="cp-viewer" data-cp="viewer" role="status"><\/p>/);
  // 页头提示（配对结果）在任何一版都显示
  assert.equal(viewerLine(old, { notice: '示例提示' }), '<span class="cp-viewer-note">示例提示</span>');
});

test('AI 已定逐行显示全部决定并可复制修改，普通消息仍限五条', () => {
  const decisions = Array.from({ length: 9 }, (_, i) => ({ id: `decision-${i}`, kind: 'ai_decision', text: `示例决定 ${i}：结束；理由：现状已恢复`, at: now.toISOString(), exit_when: '决定满 14 天后收起' }));
  const reports = Array.from({ length: 6 }, (_, i) => ({ id: `report-${i}`, kind: 'report', text: `示例汇报 ${i}` }));
  const v = normalize(base({ must_know: { state: 'ok', items: [...reports, ...decisions] }, verdict: { state: 'attention', color: 'yellow' }, summary: { text: '满 14 天待 AI 定 1 件' } }));
  const html = REGIONS.overview(v, { ...ctx, ov: { stale: () => false, lamp: () => '' } });
  assert.equal((html.match(/class="is-ai_decision"/g) || []).length, 9);
  assert.equal((html.match(/class="is-report"/g) || []).length, 5);
  assert.equal((html.match(/>复制给 AI<\/button>/g) || []).length, 9);
  assert.match(html, /条目编号 decision-8；我不同意这条 AI 决定/);
  assert.match(html, /<span class="cp-dot is-yellow"[^>]*><\/span>现在没有要你做的事/);
  const hidden = normalize(base({ must_know: { state: 'ok', items: [{ ...ph('private-ai'), kind: 'ai_decision', text: null }] } }));
  const publicHtml = REGIONS.overview(hidden, { ...ctx, ov: { stale: () => false, lamp: () => '' } });
  assert.match(publicHtml, /条目编号 private-ai；我不同意/);
  assert.doesNotMatch(publicHtml, /当前决定：/);
});

test('满 14 天未定事项留在 AI 区，显示 AI 决定提醒和具体说明', () => {
  const due = { id: 'ai-due', title: '示例技术事项', awaiting_ai_decision: true, age_days: 14, overdue_text: '限期已到，待 AI 重新定' };
  const late = { id: 'ai-late', title: '示例稍晚事项', age_days: 3, overdue_since: now.toISOString(), overdue_days: 1 };
  const v = normalize(base({ ai_following: [due, late], ai_overdue: [due, late] }));
  const html = REGIONS['need-you'](v, ctx);
  assert.match(html, /满 14 天待 AI 定 1 件 · 1 件过了约定日子/);
  assert.match(html, /限期已到，待 AI 重新定/);
  assert.match(html, /由 AI 直接定，你不用逐条选/);
});

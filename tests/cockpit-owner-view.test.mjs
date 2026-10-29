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
  assert.equal(viewerLine(v), '<span class="cp-viewer-line is-owner">你的设备 · 全部显示（其中 2 件公网看不到）</span>');
  const need = REGIONS['need-you'](v, ctx) + REGIONS.home(v, ctx) + REGIONS.ledger(v, ctx);
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
  assert.equal(viewerLine(normalize(base({ viewer: { kind: 'owner', device_state: 'ok' }, private_count: 0 }))), '<span class="cp-viewer-line is-owner">你的设备 · 全部显示</span>');
});

test('公开版：占位行灰显只剩标题，一个按钮都没有，页头标注件数', () => {
  const v = normalize(base({
    viewer: { kind: 'public', device_state: 'none', device_name: null }, private_count: 3,
    need_you: [ph('n1', { questions: null, mobile_method: null }), { id: 'n2', title: '示例技术事项：核对一次备份', ask_kind: 'do' }],
    ai_following: [ph('a1', { owner_detail: '不该出现' })],
    deferred: [ph('d1', { action_owner: 'user' }), ph('d2', { action_owner: 'user', title: '周一上午打一个电话' })],
    must_know: { state: 'ok', items: [{ id: 'k1', kind: 'report', placeholder: true, owner_only: true, title: PRIVATE_TITLE, text: null }] },
  }));
  assert.equal(viewerLine(v), '<span class="cp-viewer-line">公开版 · 3 件私人事项只在本人设备上显示</span>');
  const need = REGIONS['need-you'](v, ctx) + REGIONS.home(v, ctx) + REGIONS.ledger(v, ctx);
  const card = /<article class="cp-ask is-private" id="todo-n1" data-items="n1">.*?<\/article>/.exec(need)?.[0] || '';
  assert.ok(card.includes(PRIVATE_TITLE));
  // 公开版一个按钮都没有（原来的复制按钮也去掉了）
  assert.doesNotMatch(need, /<button|data-copy/);
  assert.doesNotMatch(card, /cp-quiz|cp-chip|去办/);
  assert.ok(need.includes(`<li class="is-wait is-private" data-items="a1"><span title="私人事项，详情只在本人设备上显示">${PRIVATE_TITLE}</span></li>`));
  assert.ok(need.includes(`<li class="is-private" data-items="d1"><span title="私人事项，详情只在本人设备上显示">${PRIVATE_TITLE}</span></li>`));
  // 占位行的公开说法不一定是默认占位字，照行里的 title 显示
  assert.ok(need.includes('<li class="is-private" data-items="d2"><span title="私人事项，详情只在本人设备上显示">周一上午打一个电话</span></li>'));
  assert.doesNotMatch(need, /仅你可见|cp-detail|不该出现|还没核对过|等你方便时/);
  // 你得知道的占位行照样占一条，计数不变
  const ov = REGIONS.home(v, { ...ctx, ov: { stale: () => false, lamp: () => '' } });
  assert.match(ov, /<li id="know-k1" class="is-report is-private" data-items="k1">.*私人事项（只在本人设备上显示）/);
  // 公开版不会露出“本人设备”
  assert.doesNotMatch(page(v, ctx), /你的设备 · 全部显示/);
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

test('AI 已定去“AI 的账本”逐条看，不同意的点“不同意，改一下”；你得知道最多 5 行，多的折成“其余 N 条”', () => {
  const decisions = Array.from({ length: 9 }, (_, i) => ({ id: `decision-${i}`, kind: 'ai_decision', text: `示例决定 ${i}：结束；现状已恢复`, at: now.toISOString(), exit_when: '决定满 14 天后收起' }));
  const reports = Array.from({ length: 6 }, (_, i) => ({ id: `report-${i}`, kind: 'report', text: `示例汇报 ${i}` }));
  const v = normalize(base({ must_know: { state: 'ok', items: [...reports, ...decisions] }, verdict: { state: 'attention', color: 'yellow' } }));
  const c = { ...ctx, ov: { stale: () => false, lamp: () => '' } };
  const home = REGIONS.home(v, c), led = REGIONS.ledger(v, c);
  assert.equal((led.match(/class="is-ai_decision"/g) || []).length, 9);
  assert.doesNotMatch(home, /is-ai_decision|AI 自己定了/);
  assert.match(led, /AI 定了：不再跟进，这条结束<\/span><span class="cp-know-dec-why">原因：现状已恢复<\/span>/);
  // 6 条汇报 = 6 行：露前 4 行，其余 2 条折起来（汇报一条不丢）
  assert.equal((home.match(/class="is-report"/g) || []).length, 6);
  const main = /<ul class="cp-know-list">(.*?)<\/ul><details class="cp-know-rest"/.exec(home)?.[1] || '';
  assert.equal((main.match(/<li id="know-report-/g) || []).length, 4);
  assert.match(home, /<details class="cp-know-rest" id="know-rest"><summary>其余 2 条<\/summary>/);
  assert.doesNotMatch(home + led, /复制给 AI|data-copy/);
  assert.match(REGIONS.overview(v, c), /<span class="cp-dot is-yellow"[^>]*><\/span>现在没有要你做的事/);
  // 本人设备上 AI 已定那条的“回一句话”写成“不同意，改一下”
  const own = normalize(base({ must_know: { state: 'ok', items: [{ ...decisions[0], owner_actions: ['note', 'ack'] }] } }));
  assert.match(REGIONS.ledger(own, c), /data-act="ack"[^>]*>知道了<\/button><button type="button" class="cp-btn" data-act="note" aria-expanded="false">不同意，改一下<\/button>/);
  const hidden = normalize(base({ must_know: { state: 'ok', items: [{ ...ph('private-ai'), kind: 'ai_decision', text: null }] } }));
  const publicHtml = REGIONS.ledger(hidden, c);
  assert.match(publicHtml, /<li id="know-private-ai" class="is-ai_decision is-private" data-items="private-ai"><span class="cp-know-dec-topic">私人事项（只在本人设备上显示）<\/span><\/li>/);
});

test('满 14 天还没结果的、过了自己定的日子的：在“AI 的账本”里写人话，不在首屏', () => {
  const due = { id: 'ai-due', title: '示例技术事项', awaiting_ai_decision: true, age_days: 16, overdue_text: '限期已到，待 AI 重新定' };
  const late = { id: 'ai-late', title: '示例稍晚事项', age_days: 3, overdue_since: '2026-10-27T12:00:00+08:00', overdue_days: 2 };
  const bare = { id: 'ai-bare', title: '', project: '示例项目' };
  const v = normalize(base({ ai_following: [due, late, bare], ai_overdue: [due, late] }));
  const html = REGIONS.ledger(v, ctx);
  assert.match(html, /AI 自己有 2 件晚了，在补（不用你管）/);
  assert.match(html, /跟了 16 天还没结果，AI 这周要么定期限修好，要么结束/);
  assert.match(html, /原定 10 月 27 日，晚了 2 天/);
  // 还没写清要办什么的空条目不给你看
  assert.doesNotMatch(html, /ai-bare|还没写清要办什么/);
  assert.doesNotMatch(REGIONS['need-you'](v, ctx) + REGIONS.home(v, ctx), /示例技术事项|示例稍晚事项/);
  assert.match(REGIONS.home(v, ctx), /<a class="cp-go" href="\/cockpit\/ai\/">AI 手上还有 3 件自己的活，2 件比它自己定的日子晚了（不用你管）<\/a>/);
});

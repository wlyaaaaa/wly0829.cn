// 驾驶舱首屏与精简卡片：全部数据虚构。
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page, ledgerPage, plain, factCards } from '../site-astro/src/cockpit/render.js';

const now = new Date('2026-10-29T19:40:00+08:00'), at = '2026-10-29T19:39:30+08:00';
const base = (extra = {}) => ({ schema: 'pcconfig.cockpit-view.v1', served_at: at, ...extra });
const ov = { stale: () => false, lamp: () => '' };
const acts = (state = {}, ui = {}) => ({ state: new Map(Object.entries(state)), ui: new Map(Object.entries(ui)), recent: new Map() });
const ctx = (act) => ({ now, offline: false, phase: 'live', projectUrls: {}, img: {}, ov, ...(act ? { act } : {}) });
const own = (extra = {}) => normalize(base({ viewer: { kind: 'owner', device_state: 'ok' }, ...extra }));
const AW = ['answer', 'note', 'seen', 'ack', 'snooze', 'dismiss', 'delegate', 'unclear'];
const wait = (extra = {}) => ({ id: 'aw-1', card_type: 'ai_wait', conversation_title: '示例案卡重排', asked_at: '2026-10-29T17:42:00+08:00',
  progress: '示例：案卡已排好，只差时间线放哪还没定。', title: '完整时间线放在哪？', ask_kind: 'decision', why_you: '这会改变你阅读的顺序',
  options: [{ value: 'A', text: '保持现在这样', detail: '和另一份一致，不用再改', recommended: true }, { value: 'B', text: '移到最前面', detail: '要重排一遍' }],
  consequence: '不回的话它就停在这一步。', owner_actions: AW, item_version: 'v-aw-1', ...extra });
const textOnly = (h) => h.replace(/<[^>]*>/g, '');

test('等待卡首行只露标题、原因和三个按钮；问题、选项、进展与后果保存在默认关闭详情', () => {
  const html = REGIONS['need-you'](own({ need_you: [wait()] }), ctx(acts()));
  const main = /<div class="cp-ask-main">([^]*?)<\/div>/.exec(html)?.[1] || '';
  assert.match(main, /完整时间线放在哪？/);
  assert.match(main, /class="cp-ask-why">这会改变你阅读的顺序/);
  assert.doesNotMatch(main, /案卡已排好|保持现在这样|不回的话/);
  assert.match(html, /<details class="cp-ask-details" id="todo-aw-1-details"><summary>怎么办 ›<\/summary>/);
  for (const s of ['「示例案卡重排」那个对话 · 17:42 问的', '它做到哪', '保持现在这样 · AI 建议（只是说明，不能点）', '和另一份一致，不用再改', '移到最前面', '不回的话它就停在这一步。']) assert.ok(html.includes(s), s);
  assert.match(html, /data-act="ack"[^>]*>知道了/);
  assert.match(html, /data-act="snooze"[^>]*>晚点提醒/);
  assert.match(html, /data-copy="[^]*data-copy-caption>复制给 AI<\/span><\/button>/);
  assert.doesNotMatch(html, /data-pick|data-send|data-q-pick|data-exec|data-qnote|data-add|我没看懂|你定就行/);
});

test('旧等待卡补人话标题；公开卡仍能读选项，但没有处理按钮', () => {
  const old = { id: 'aw-0', card_type: 'ai_wait', title: '有一个 AI 对话在等你回复', ask_kind: 'cooperate', owner_actions: ['note', 'seen', 'snooze', 'dismiss'] };
  const html = REGIONS['need-you'](own({ need_you: [old] }), ctx(acts()));
  assert.match(html, /有个对话在等你回话，但它没写问题/);
  assert.doesNotMatch(html, /data-act="seen"|data-act="note"|data-act="dismiss"/);
  const pub = REGIONS['need-you'](normalize(base({ viewer: { kind: 'public' }, need_you: [wait()] })), ctx());
  assert.match(pub, /<ul class="cp-oa-opts is-text"><li><b>保持现在这样 · AI 建议（只是说明，不能点）<\/b>/);
  assert.doesNotMatch(pub, /<button|data-copy/);
});

test('四类卡统一精简；确认详情、步骤数和完成说明保留', () => {
  const v = own({ need_you: [
    { id: 'q1', card_type: 'question', title: '示例拍板', ask_kind: 'decision', options: ['甲', '乙'] },
    { id: 't1', card_type: 'task', title: '示例动手', ask_kind: 'action', steps: ['第一步', '第二步'], completion_text: '做完即可' },
    { id: 'c1', card_type: 'confirm', title: '示例确认', ask_kind: 'action', confirmation_kind: 'message', confirmation: { to: '示例收件人', content: '示例内容' } }, wait(),
  ] });
  const html = REGIONS['need-you'](v, ctx(acts()));
  assert.deepEqual([...html.matchAll(/<h3 class="cp-sub cp-need-k">([^<]+)<\/h3>/g)].map((m) => m[1]), ['AI 在等你回话', '要你确认', '要你动手', '要你拍板']);
  assert.equal((html.match(/class="cp-ask-main"/g) || []).length, 4);
  assert.equal((html.match(/<details class="cp-ask-details"/g) || []).length, 4);
  assert.match(html, /<summary>怎么办（2 步） ›<\/summary>/);
  assert.match(html, /<dt>发给<\/dt><dd>示例收件人<\/dd><\/div><div><dt>发什么<\/dt><dd>示例内容<\/dd>/);
  assert.match(html, /做完即可/);
  assert.doesNotMatch(html, /data-pick|data-q-pick|data-lb/);
  assert.equal(REGIONS['need-you'](normalize(base({ need_you: [] })), ctx()), '<span class="cp-anchor" id="pending"></span>');
});

test('路径留给复制，屏幕写办事位置和详细说明；中文不会被全局误改', () => {
  const x = { id: 'n1', title: '示例事项：去看一下汇报在电脑上：示例汇报（路径 E:\\示例\\汇报.html）', ask_kind: 'action', mobile_method: { kind: 'computer_mcp' }, minutes: 3 };
  const html = REGIONS['need-you'](own({ need_you: [x] }), ctx(acts()));
  assert.match(textOnly(html), /手机上能办，约 3 分钟/);
  assert.match(textOnly(html), /详细说明在电脑上/);
  assert.doesNotMatch(textOnly(html), /MCP|E:\\|办完后/);
  assert.match(html, /data-copy="[^]*E:\\示例\\汇报.html/);
  assert.equal(plain('确认是你本人；本人设备'), '确认是你本人；本人设备');
  assert.equal(plain('要你做 1 件（其中 1 件借电脑 MCP）'), '要你做 1 件（其中 1 件得借电脑办）');
});

test('知道了即时隐藏整张卡，顶部独立回执可撤回；默认全部展开', () => {
  const x = { id: 'k1', title: '示例', ask_kind: 'action', owner_actions: ['ack', 'snooze'] };
  const state = acts({ k1: { phase: 'sending', action: 'ack', title: '示例', toastUntil: now.getTime() + 5000 } });
  const v = own({ need_you: [x, { ...x, id: 'k2' }, { ...x, id: 'k3' }] });
  const html = page(v, ctx(state));
  assert.match(html, /class="cp-q is-open is-hidden-action"/);
  assert.match(html, /class="cp-ask is-own ct-card is-hidden-action"/);
  assert.match(html, /data-cp="action-toast"><p[^>]*role="status"><span>已收起「示例」/);
  assert.match(html, /data-undo-item="k1">撤回/);
  assert.equal((html.match(/data-q="[^"]+"/g) || []).length, 3);
  assert.equal((html.match(/class="cp-q-row [^"]+"[^>]*aria-expanded="true"/g) || []).length, 3);
  assert.match(html, /要你做 <b>2<\/b> 件/);
});

test('顶上一句话沿用当前结论；无结论时统一“要你做 N 件”，AI自己的活保留入口', () => {
  const todo = { id: 'n1', title: '示例', ask_kind: 'action' };
  const v = normalize(base({ need_you: [todo], verdict: { text: '要你做 1 件（都能在手机上办） · AI 在跟 63 件' } }));
  assert.match(REGIONS.overview(v, ctx()), />要你做 1 件（都能在手机上办）</);
  assert.doesNotMatch(REGIONS.overview(v, ctx()), /AI 在跟/);
  assert.match(REGIONS.overview(normalize(base({ need_you: [todo] })), ctx()), /要你做 <b>1<\/b> 件/);
  const full = page(normalize(base({ need_you: [todo], ai_running: { count: 1, observed_at: at, rows: [{ id: 'r', status: 'running' }] }, must_know: { state: 'ok', items: [{ id: 'k', kind: 'repairing', text: '示例在修' }] } })), ctx());
  const pos = ['data-cp="overview"', 'data-cp="overview-tri"', 'id="need-you"', 'id="ai-running"', 'class="cp-know"', 'class="cp-lines"', 'id="tasks"', 'id="computer"', 'id="today"', 'id="backup"', 'id="projects"'].map((s) => full.indexOf(s));
  assert.ok(pos.every((n) => n >= 0));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos);
  assert.match(full, /<span class="cp-h1-text">驾驶舱<\/span>/);
  assert.match(full, /<span class="cp-section-title">今天的动态<\/span>/);
});

test('不急事项写明何时再做；停了的数据只在集中入口展示', () => {
  const v = normalize(base({ stale_summary: { text: '示例流量这 1 块数据停了 3 天以上', ids: ['traffic'] },
    deferred: [{ id: 'd1', title: '示例卡顿', action_owner: 'user', deferred_reason: '等到这个时候再办：随时：下次电脑卡住时' }, { id: 'd2', title: '示例AI等待', action_owner: 'ai' }],
    scheduled: [{ id: 's1', title: '示例导出', scheduled_text: '约 11 月 20 日' }],
    sections: { computer: [{ id: 'traffic', title: '示例流量', text: '示例', state: 'unavailable', observed_at: '2026-10-20T10:00:00+08:00' }] } }));
  const html = REGIONS.home(v, ctx());
  // 两类分开写：等条件再办的、已经排好日子的
  assert.match(html, /你放着 2 件（等条件 1 · 排好日子 1）/);
  assert.match(html, /下次电脑卡住时再做/);
  assert.match(html, /排在约 11 月 20 日/);
  // 停了满 3 天：首屏只留一行入口，账本页照旧可见（本人 10-30 批准第 5 项）
  assert.match(html, /另 1 样停了 3 天以上，在 AI 的账本里 ›/);
  assert.match(REGIONS.ledger(v, ctx()), /示例流量<\/b><span>10\/20 起读不到（最后一次/);
  assert.doesNotMatch(html, /示例AI等待|等到这个时候再办/);
  assert.doesNotMatch(REGIONS.computer(v, ctx()), /示例流量/);
  assert.match(REGIONS.ledger(v, ctx()), /示例AI等待/);
});

test('事实卡分层不变；AI账本每条可复制，公开版不泄漏本人操作', () => {
  const cards = [{ id: 'a', title: '甲', text: '甲：正常', state: 'ok' }, { id: 'b', title: '乙', text: '乙在修', state: 'attention', owner_action: 'none' }, { id: 'c', title: '丙', text: '丙要你插盘', state: 'red', owner_action: 'do' }];
  const html = factCards(cards, now);
  assert.match(html, /<article class="cp-card is-red ct-card">/);
  assert.match(html, /<li class="cp-fact is-fold"><details>/);
  assert.match(html, /<b>甲<\/b><span>正常<\/span>/);
  assert.doesNotMatch(html, /data-copy/);
  const data = { ai_following: [{ id: 'a1', title: '示例AI在跟', owner_actions: ['note'] }], must_know: { state: 'ok', items: [{ id: 'd1', kind: 'ai_decision', text: '示例事：结束；示例原因。', owner_actions: ['ack'] }] } };
  const owner = ledgerPage(own(data), ctx(acts()));
  assert.match(owner, /data-copy=/);
  assert.doesNotMatch(owner, /data-act="note"|data-lb|data-send=/);
  const pub = ledgerPage(normalize(base({ viewer: { kind: 'public' }, ...data })), ctx());
  assert.doesNotMatch(pub, /data-copy|data-act|data-lb/);
});

test('公开版总件数包含未展示私事时解释差额；本人设备标注完整显示', () => {
  const v = own({ private_count: 2, need_you: [wait()] });
  assert.match(REGIONS.viewer(v, ctx()), /你的设备 · 全部显示（其中 2 件公网看不到）/);
  const pub = normalize(base({ viewer: { kind: 'public' }, private_count: 18, need_you: [{ id: 'p1', title: '示例占位', placeholder: true, ask_kind: 'cooperate' }], verdict: { need_you: 3 }, overview: { owner_count: 3, owner_urgent: false, owner_urgent_count: 0 } }));
  assert.match(REGIONS.overview(pub, ctx()), /另 2 件是私人事项，只在你的设备上显示/);
  pub.overview.owner_count = 2;
  assert.doesNotMatch(REGIONS.overview(pub, ctx()), /另 \d+ 件是私人事项/);
});

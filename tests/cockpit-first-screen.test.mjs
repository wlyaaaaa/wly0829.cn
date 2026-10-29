// 驾驶舱第三步（本人 2026-10-29 18:42—18:51：“太谜语人”“还不好用”）：首屏只放本人的事、“AI 在等你回”卡、点完说清会怎样、
// AI 自己的活去二级页“AI 的账本”、事实区正常的只占一行。全部数据虚构
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page, ledgerPage, plain, factCards } from '../site-astro/src/cockpit/render.js';

const now = new Date('2026-10-29T19:40:00+08:00');
const at = '2026-10-29T19:39:30+08:00';
const base = (extra = {}) => ({ schema: 'pcconfig.cockpit-view.v1', served_at: at, ...extra });
const ov = { stale: () => false, lamp: () => '' };
const ctx = (act) => ({ now, offline: false, phase: 'live', projectUrls: {}, img: {}, ov, ...(act ? { act } : {}) });
const acts = (state = {}, ui = {}) => ({ state: new Map(Object.entries(state)), ui: new Map(Object.entries(ui)), recent: new Map() });
const AW = ['answer', 'note', 'snooze', 'dismiss', 'delegate', 'unclear'];
const wait = (extra = {}) => ({ id: 'aw-1', card_type: 'ai_wait', conversation_title: '示例案卡重排', asked_at: '2026-10-29T17:42:00+08:00',
  progress: '示例：案卡已排好，只差时间线放哪还没定。', title: '完整时间线放在哪？', ask_kind: 'decision',
  options: [{ value: 'A', text: '保持现在这样', detail: '和另一份一致，不用再改', recommended: true }, { value: 'B', text: '移到最前面', detail: '要重排一遍' }],
  consequence: '不回的话它就停在这一步。', owner_actions: AW, item_version: 'v-aw-1', ...extra });

test('“AI 在等你回”卡：哪个对话几点问的 → 它做到哪 → 要你定 → 选项（AI 建议是主按钮、旁边写点了会怎样）→ 不回会怎样 → 你定就行、我没看懂', () => {
  const html = REGIONS['need-you'](normalize(base({ need_you: [wait()] })), ctx(acts()));
  assert.match(html, /<h3 class="cp-sub cp-need-k">AI 在等你回话<\/h3>/);
  const card = /<article class="cp-ask is-own is-wait" id="todo-aw-1" data-items="aw-1">.*<\/article>/.exec(html)?.[0] || '';
  const order = ['「示例案卡重排」那个对话 · 17:42 问的', '<b>它做到哪</b>', '<span class="cp-own-k">要你定</span><span>完整时间线放在哪？', '保持现在这样 · AI 建议', '和另一份一致，不用再改', '移到最前面', '<b>不回会怎样</b>', '你定就行', '我没看懂', '补一句'];
  const pos = order.map((t) => card.indexOf(t));
  assert.ok(pos.every((p) => p >= 0), JSON.stringify(pos));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos);
  // 只有一道题：点选项就直接交（data-pick），AI 建议那项是主按钮；答案送回原对话，不选交给谁
  assert.match(card, /<button type="button" class="cp-btn cp-opt cp-btn-main" data-pick data-val="&quot;A&quot;">保持现在这样 · AI 建议<\/button><span class="cp-oa-detail">和另一份一致，不用再改<\/span>/);
  assert.match(card, /<button type="button" class="cp-btn cp-opt" data-pick data-val="&quot;B&quot;">移到最前面<\/button>/);
  assert.match(card, /data-oa="aw-1" data-ver="&quot;v-aw-1&quot;" data-noexec>/);
  assert.doesNotMatch(card, /data-exec|data-send="answer"|data-qnote|交给 AI|回一句话/);
  // “补一句”：先写一句再点选项
  const add = REGIONS['need-you'](normalize(base({ need_you: [wait()] })), ctx(acts({}, { 'aw-1': { open: 'add', answers: { choice: { text: '示例补充' } } } })));
  assert.match(add, /<input class="cp-note cp-oa-qnote" type="text" data-qnote maxlength="500" placeholder="补一句（写好再点上面的选项）"[^>]*value="示例补充">/);
  assert.match(add, /data-add aria-expanded="true">补一句</);
});

test('旧的“AI 在等你回”卡（没有对话名、做到哪这些新字段）照第二步的样子；没有按钮时选项只列字', () => {
  const old = { id: 'aw-0', card_type: 'ai_wait', title: '有一个 AI 对话在等你回复', ask_kind: 'cooperate', owner_actions: ['note', 'seen', 'snooze', 'dismiss'] };
  const html = REGIONS['need-you'](normalize(base({ need_you: [old] })), ctx(acts()));
  assert.match(html, /<article class="cp-ask is-own" id="todo-aw-0"/);
  assert.doesNotMatch(/<article.*<\/article>/.exec(html)[0], /is-wait|cp-wait-src|它做到哪/);
  assert.match(html, /data-act="seen">看见了</);
  // 公开版（没有 owner_actions）：新卡也只写字，选项列成字，一个按钮都没有
  const pub = REGIONS['need-you'](normalize(base({ need_you: [wait({ owner_actions: undefined })] })), ctx());
  assert.match(pub, /<ul class="cp-oa-opts is-text"><li><b>保持现在这样 · AI 建议<\/b><span class="cp-oa-detail">和另一份一致，不用再改<\/span><\/li>/);
  assert.doesNotMatch(pub, /<button/);
});

test('卡片分组：AI 在等你回话 → 要你确认 → 要你动手 → 要你拍板；确认卡写清发给谁、发什么', () => {
  const v = normalize(base({ need_you: [
    { id: 'q1', card_type: 'question', title: '示例拍板', ask_kind: 'decision', options: ['甲', '乙'], owner_actions: ['answer'] },
    { id: 't1', card_type: 'task', title: '示例动手', ask_kind: 'action', owner_actions: ['done'] },
    { id: 'c1', card_type: 'confirm', title: '示例确认', ask_kind: 'action', confirmation_kind: 'message', confirmation: { to: '示例收件人', content: '示例内容' }, owner_actions: ['confirm'] },
    wait(),
  ] }));
  const html = REGIONS['need-you'](v, ctx(acts()));
  assert.deepEqual([...html.matchAll(/<h3 class="cp-sub cp-need-k">([^<]+)<\/h3>/g)].map((m) => m[1]), ['AI 在等你回话', '要你确认', '要你动手', '要你拍板']);
  assert.match(html, /<p class="cp-own-kind">要你确认 · 发消息<\/p>/);
  assert.match(html, /<dt>发给<\/dt><dd>示例收件人<\/dd><\/div><div><dt>发什么<\/dt><dd>示例内容<\/dd>/);
  // 一个要你做的都没有：这一块整块不出
  assert.equal(REGIONS['need-you'](normalize(base({ need_you: [] })), ctx()), '');
});

test('卡片上的字：在哪办写“手机上能办 / 得在电脑前办”，不写 MCP；电脑上的路径只写“详细说明在电脑上”；不写“办完后”', () => {
  const x = { id: 'n1', title: '示例事项：去看一下汇报在电脑上：示例汇报（路径 E:\\示例\\汇报.html）', ask_kind: 'action', mobile_method: { kind: 'computer_mcp' }, done_when: '示例：AI 核对过就关', minutes: 3 };
  const pub = REGIONS['need-you'](normalize(base({ need_you: [x] })), ctx());
  assert.match(pub, /手机上能办，约 3 分钟/);
  assert.match(pub, /<p class="cp-path">详细说明在电脑上<\/p>/);
  assert.doesNotMatch(pub, /MCP|E:\\|示例\\汇报|办完后/);
  const own = REGIONS['need-you'](normalize(base({ need_you: [{ ...x, owner_actions: ['done'], mobile_method: { kind: 'in_person' } }] })), ctx(acts()));
  assert.match(own, /得在电脑前办，约 3 分钟<\/span><span class="cp-own-path">详细说明在电脑上<\/span>/);
  assert.doesNotMatch(own, /MCP|E:\\|办完后/);
  assert.equal(plain('要你做 1 件（都能在手机上办，其中 1 件借电脑 MCP）'), '要你做 1 件（都能在手机上办，其中 1 件得借电脑办）');
  // 别的字不在显示路径换（后端契约）：“确认是你本人”不能变成“确认是你你”
  assert.equal(plain('下次弹出“确认是你本人”的窗口；本人设备'), '下次弹出“确认是你本人”的窗口；本人设备');
});

test('看见了、知道了：卡收起只留标题和回执；“这件不做了”等按钮文字照定好的', () => {
  const x = { id: 'k1', title: '示例', ask_kind: 'action', owner_actions: ['seen'] };
  const receipt = { id: 'act-1', undo_until: '2026-10-30T19:40:00+08:00', created_at: at };
  const html = REGIONS['need-you'](normalize(base({ need_you: [x] })), ctx(acts({ k1: { phase: 'done', action: 'seen', receipt } })));
  assert.match(html, /class="cp-ask is-own is-acted is-folded"/);
  assert.match(html, /收起了。<\/span><button[^>]*data-undo="act-1">撤回<\/button><span class="cp-oa-left"[^>]*>明天 19:40 前可撤回</);
});

test('首屏：顶上那一句用后端 verdict.text；旧格式只取“要你……”那一段，AI 的事不上来', () => {
  const todo = { id: 'n1', title: '示例', ask_kind: 'action' };
  const v = normalize(base({ need_you: [todo], verdict: { color: 'yellow', text: '要你回 AI 1 个问题（手机上点一下就行）' } }));
  assert.match(REGIONS.overview(v, ctx()), /<div class="cp-you is-said"><p class="cp-you-n"><span class="cp-you-said">要你回 AI 1 个问题（手机上点一下就行）<\/span><span class="cp-you-tag">都不急<\/span><\/p>/);
  const old = normalize(base({ need_you: [todo], verdict: { text: '要你做 1 件（都能在手机上办，其中 1 件借电脑 MCP） · AI 在跟 63 件（其中 17 件过期） · 你暂缓 7 件' } }));
  const oh = REGIONS.overview(old, ctx());
  assert.match(oh, />要你做 1 件（都能在手机上办，其中 1 件得借电脑办）</);
  assert.doesNotMatch(oh, /AI 在跟|暂缓|<ol|<li/);
  const aiOnly = normalize(base({ need_you: [todo], verdict: { text: 'AI 在跟 63 件 · 你暂缓 7 件' } }));
  assert.match(REGIONS.overview(aiOnly, ctx()), /要你动手 <b>1<\/b> 件事/);
  // 整页的顺序：顶上一句 → 要你做／要你回 → AI 正在干活、你得知道、几行入口 → 三格 → 事实区
  const full = page(normalize(base({ need_you: [todo], ai_running: { count: 1, observed_at: at, rows: [{ id: 'r', status: 'running', vendor: 'claude' }] }, must_know: { state: 'ok', items: [{ id: 'k', kind: 'repairing', text: '示例在修' }] } })), ctx());
  const idx = ['data-cp="overview"', 'id="need-you"', 'id="ai-running"', 'class="cp-know"', 'class="cp-lines"', 'data-cp="overview-tri"', 'id="tasks"', 'id="computer"', 'id="today"', 'id="backup"', 'id="projects"'].map((t) => full.indexOf(t));
  assert.ok(idx.every((p) => p >= 0), JSON.stringify(idx));
  assert.deepEqual([...idx].sort((a, b) => a - b), idx);
  assert.doesNotMatch(full, /data-copy|全部 \d+ 件一起交给 AI|问 AI|复制给手机上的 AI/);
});

test('首屏几行入口：AI 的账本 ›、你放着 N 件不急的事 ›（写人话的“什么时候再做”）、停了 3 天以上的数据合成一句', () => {
  const v = normalize(base({
    ai_ledger_summary: { text: 'AI 手上还有 4 件自己的活，1 件晚了（不用你管）', open: 4, late: 1 },
    stale_summary: { text: '示例流量这 1 块数据停了 3 天以上，AI 在修', ids: ['traffic'] },
    deferred: [
      { id: 'd1', title: '示例：查一下卡顿', action_owner: 'user', deferred_reason: '等到这个时候再办：随时：下次电脑卡住时' },
      { id: 'd2', title: '示例：按一下键', action_owner: 'user', deferred_reason: '按登记条件暂缓：你方便时（约 1 分钟）', done_when: '示例办完后' },
      { id: 'd3', title: '示例：没写原因', action_owner: 'user', deferred_reason: '还没写清为什么暂缓' },
      { id: 'd4', title: '示例：AI 等条件', action_owner: 'ai', deferred_reason: '等对方回复' },
    ],
    scheduled: [{ id: 's1', title: '示例：月度导出', scheduled_text: '约 11 月 20 日' }, { id: 's2', title: '示例：旧字段', schedule_text: '约 12 月 1 日' }],
    sections: { computer: [{ id: 'traffic', title: '示例流量', text: '示例', state: 'unavailable', observed_at: '2026-10-20T10:00:00+08:00' }, { id: 'cpu', title: '处理器', text: '处理器：12%', state: 'ok' }] },
  }));
  const html = REGIONS.home(v, ctx());
  assert.match(html, /<a class="cp-go" href="\/cockpit\/ai\/">AI 手上还有 4 件自己的活，1 件晚了（不用你管）<\/a>/);
  assert.match(html, /<details class="cp-fold cp-mine" id="mine-wait"><summary>你放着 5 件不急的事<\/summary>/);
  assert.match(html, /示例：查一下卡顿<\/span><small>下次电脑卡住时再做<\/small>/);
  assert.match(html, /示例：按一下键<\/span><small>你方便时再做（约 1 分钟）<\/small>/);
  assert.match(html, /示例：没写原因<\/span><\/li>/);
  assert.match(html, /<small>排在约 11 月 20 日<\/small>/);
  assert.match(html, /<small>排在约 12 月 1 日<\/small>/);
  assert.doesNotMatch(html, /示例：AI 等条件|办完后|等到这个时候再办|还没写清为什么暂缓/);
  assert.match(html, /<details class="cp-fold cp-stale-fold" id="stale-cards"><summary><span class="cp-dot is-gray" aria-hidden="true"><\/span>示例流量这 1 块数据停了 3 天以上，AI 在修<\/summary>.*<b>示例流量<\/b><span>最后一次是 10月20日 10:00<\/span>/);
  // 收进那一句的卡，电脑区不再单列；AI 等条件的那件在“AI 的账本”
  const pc = REGIONS.computer(v, ctx());
  assert.doesNotMatch(pc, /示例流量/);
  assert.match(pc, /<li class="cp-fact" tabindex="0" title="处理器：12%"><span class="cp-dot is-green" aria-hidden="true"><\/span><b>处理器<\/b><span>12%<\/span><\/li>/);
  assert.match(REGIONS.ledger(v, ctx()), /<section class="cp-ledger-sec" id="ai-wait"><h2>AI 等条件再做的<\/h2>.*示例：AI 等条件/);
});

test('事实区：正常的一行；AI 在管、读不到的一行、点开是原来那张卡；要你出手的整张卡', () => {
  const cards = [
    { id: 'a', title: '甲', text: '甲：正常', state: 'ok' },
    { id: 'b', title: '乙', text: '乙在修', state: 'attention', owner_action: 'none', observed_at: at },
    { id: 'c', title: '丙', text: '丙要你插盘', state: 'red', owner_action: 'do', observed_at: at },
  ];
  const html = factCards(cards, now);
  assert.match(html, /<div class="cp-grid"><article class="cp-card is-red">.*丙要你插盘/);
  assert.match(html, /<li class="cp-fact is-fold"><details><summary><span class="cp-dot is-neutral" aria-hidden="true"><\/span><b>乙<\/b><span>在修<\/span><\/summary><article class="cp-card is-neutral">/);
  assert.match(html, /<li class="cp-fact" tabindex="0" title="甲：正常">.*<b>甲<\/b><span>正常<\/span><\/li>/);
  // 事实卡上不再有“交给 AI 处理”的复制按钮
  assert.doesNotMatch(html, /<button|data-copy/);
});

test('二级页“AI 的账本”：在跟的、晚了的、AI 已定、等条件的、每周体检和项目后台；公开版一个按钮都没有', () => {
  const v = normalize(base({
    ai_following: [{ id: 'a1', title: '示例 AI 在跟', owner_actions: ['note'] }], ai_overdue: [],
    must_know: { state: 'ok', items: [{ id: 'd1', kind: 'ai_decision', text: '示例事：结束；示例原因。' }] },
    governance: { last_run: { started_at: at, counts: { fixed: 1, closed: 2 }, actions: [{ title: '示例说明' }] } },
  }));
  const own = ledgerPage(v, ctx(acts()));
  assert.match(own, /<p class="cp-back"><a href="\/cockpit\/">← 回驾驶舱<\/a><\/p><h1 class="cp-ledger-h1">AI 的账本<\/h1>/);
  for (const id of ['ai-following', 'ai-decided', 'ai-health']) assert.ok(own.includes(`id="${id}"`), id);
  assert.match(own, /data-act="note"[^>]*>回一句话</);
  assert.doesNotMatch(own, /问 AI|data-copy/);
  const pub = ledgerPage(normalize(base({ ai_following: [{ id: 'a1', title: '示例 AI 在跟' }], must_know: { state: 'ok', items: [{ id: 'd1', kind: 'ai_decision', text: '示例事：结束；示例原因。' }] } })), { ...ctx(), phase: 'snapshot' });
  // 公开版只有看哪些的切换（全部 / 晚了 / 没晚），没有处理按钮
  assert.doesNotMatch(pub.replace(/<span class="cp-q-modes"[^]*?<\/span>/g, ''), /<button/);
  assert.match(pub, /<p class="cp-snap">/);
});

test('问题卡和“AI 在等你回”卡：“晚点提醒”“这件不做了”降成按钮行下面一行小字链接；动手卡、确认卡照旧在按钮行', () => {
  const v = normalize(base({ need_you: [
    wait(),
    { id: 'q2', card_type: 'question', title: '示例拍板', ask_kind: 'decision', options: ['甲', '乙'], owner_actions: ['answer', 'snooze', 'dismiss', 'delegate', 'unclear'] },
    { id: 't2', card_type: 'task', title: '示例动手', ask_kind: 'action', owner_actions: ['done', 'snooze', 'dismiss'] },
    { id: 'c2', card_type: 'confirm', title: '示例确认', ask_kind: 'action', confirmation_kind: 'message', owner_actions: ['confirm', 'snooze', 'dismiss'] },
  ] }));
  const html = REGIONS['need-you'](v, ctx(acts()));
  const box = (id) => new RegExp(`<div class="cp-oa is-card" data-oa="${id}"[^>]*>.*?(?=<\/article>)`).exec(html)?.[0] || '';
  for (const id of ['aw-1', 'q2']) {
    const b = box(id), bar = /<div class="cp-oa-bar">.*?<\/div>/.exec(b)?.[0] || '';
    assert.match(bar, /data-act="delegate">你定就行<.*data-act="unclear">我没看懂</);
    assert.doesNotMatch(bar, /晚点提醒|这件不做了/);
    assert.match(b, /<p class="cp-oa-minor"><button type="button" class="cp-btn cp-oa-link" data-act="snooze" aria-expanded="false">晚点提醒<\/button><button type="button" class="cp-btn cp-oa-link" data-act="dismiss">这件不做了<\/button><\/p>/);
  }
  for (const id of ['t2', 'c2']) {
    const b = box(id);
    assert.match(/<div class="cp-oa-bar">.*?<\/div>/.exec(b)?.[0] || '', /晚点提醒.*这件不做了/);
    assert.doesNotMatch(b, /cp-oa-minor|cp-oa-link/);
  }
  // 点了“晚点提醒”：时间选项照常在下面展开
  const open = REGIONS['need-you'](v, ctx(acts({}, { 'q2': { open: 'snooze' } })));
  assert.match(open, /data-act="snooze" aria-expanded="true">晚点提醒<\/button>.*<div class="cp-oa-panel cp-oa-snooze">/);
});

test('顶上标签对本人说“你”；公开版那句的件数比下面露出来的多时，下面一行“另 N 件是私人事项”，算不准就不写', () => {
  const own = normalize(base({ viewer: { kind: 'owner', device_state: 'ok' }, private_count: 2, need_you: [wait()] }));
  assert.match(REGIONS.viewer(own, ctx(acts())), /你的设备 · 全部显示（其中 2 件公网看不到）/);
  const ph = { id: 'p1', title: '有一个 AI 对话在等你回复', placeholder: true, owner_only: true, ask_kind: 'cooperate' };
  const pub = (extra) => normalize(base({ viewer: { kind: 'public' }, private_count: 18, need_you: [ph],
    verdict: { text: '要你回 AI 2 个问题、办 1 件事（手机上点一下就行）', need_you: 3 }, overview: { owner_count: 3, owner_urgent: 0 }, ...extra }));
  const line = (v) => /<p class="cp-you-sub cp-you-private">([^<]+)<\/p>/.exec(REGIONS.overview(v, ctx()))?.[1] || '';
  assert.equal(line(pub()), '另 2 件是私人事项，只在你的设备上显示');
  // 访客看的标注不变
  assert.match(REGIONS.viewer(pub(), ctx()), /公开版 · 18 件私人事项只在本人设备上显示/);
  // 算不准：总件数两处对不上、没有 private_count、差的比私人件数还多、露出来的已经够数，都不写
  assert.equal(line(pub({ overview: { owner_count: 2, owner_urgent: 0 } })), '');
  assert.equal(line(pub({ private_count: undefined })), '');
  assert.equal(line(pub({ private_count: 1 })), '');
  assert.equal(line(pub({ verdict: { text: '要你做 1 件', need_you: 1 }, overview: { owner_count: 1, owner_urgent: 0 } })), '');
  // 本人版不写这一行
  assert.equal(line(normalize(base({ viewer: { kind: 'owner' }, private_count: 18, need_you: [wait()], verdict: { need_you: 3 }, overview: { owner_count: 3 } }))), '');
});

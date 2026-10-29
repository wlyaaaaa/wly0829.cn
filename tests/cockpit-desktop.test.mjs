// 驾驶舱第四步：电脑版（宽度 ≥1200）首屏。顶栏一行、左栏“要你做 N 件”队列（一行一件、展开一件）、右栏固定、卡上的“打开”组。
// 窄屏不变由样式保证（新加的外框窄屏上 display: contents / none），这里测画出来的结构和规则。全部数据虚构
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page, openGroup, Q_KEY, LF_KEY, LB_KEY, needCount, decisionOf } from '../site-astro/src/cockpit/render.js';

const now = new Date('2026-10-29T21:40:00+08:00');
const at = '2026-10-29T21:39:30+08:00';
const base = (extra = {}) => ({ schema: 'pcconfig.cockpit-view.v1', served_at: at, ...extra });
const ov = { stale: () => false, lamp: () => '' };
const ctx = (act, extra = {}) => ({ now, offline: false, phase: 'live', projectUrls: {}, img: {}, ov, ...(act ? { act } : {}), ...extra });
const acts = (state = {}, ui = {}) => ({ state: new Map(Object.entries(state)), ui: new Map(Object.entries(ui)), recent: new Map() });
const AW = ['answer', 'note', 'snooze', 'dismiss', 'delegate', 'unclear'];
const wait = (id, extra = {}) => ({ id, card_type: 'ai_wait', conversation_title: '示例对话' + id, asked_at: '2026-10-29T20:50:00+08:00', progress: '示例进度',
  title: '示例问题' + id, ask_kind: 'decision', options: [{ value: 'A', text: '甲', recommended: true }, { value: 'B', text: '乙' }], owner_actions: AW, ...extra });
const queue = () => [wait('w1'), wait('w2'),
  { id: 'c1', card_type: 'confirm', title: '示例确认', ask_kind: 'action', confirmation_kind: 'message', owner_actions: ['confirm', 'dismiss'] },
  { id: 't1', card_type: 'task', title: '示例动手', ask_kind: 'action', owner_actions: ['done', 'snooze'] }];
const rows = (html) => [...html.matchAll(/<div class="cp-q-row[^"]*" data-q-open="([^"]+)"[^>]*aria-expanded="(true|false)">(.*?)<\/div>/g)].map((m) => ({ id: m[1], open: m[2] === 'true', body: m[3] }));

test('队列：每件一行（类型、对话名、问题、几点问的），默认第一件展开；行上只有“AI 在等你回”给 AI 建议按钮，确认卡、动手卡的行上没有按钮', () => {
  const html = REGIONS['need-you'](normalize(base({ need_you: queue(), overview: { owner_count: 4 } })), ctx(acts()));
  assert.match(html, /<h2 class="cp-q-n">要你做 <b>4<\/b> 件<\/h2>/);
  assert.match(html, /data-q-mode="rows"[^>]*>一行一件<\/button><button[^>]*data-q-mode="all"[^>]*>全部展开<\/button>/);
  const r = rows(html);
  assert.deepEqual(r.map((x) => [x.id, x.open]), [['w1', true], ['w2', false], ['c1', false], ['t1', false]]);
  assert.match(r[1].body, /<span class="cp-q-tag is-wait">等你回<\/span><span class="cp-q-text"><b class="cp-q-src">「示例对话w2」<\/b><span class="cp-q-title">示例问题w2<\/span><\/span><small class="cp-q-at">20:50 问的<\/small>/);
  assert.match(r[1].body, /<button type="button" class="cp-btn cp-q-pick" data-q-pick="w2" data-val="&quot;A&quot;">甲 · AI 建议<\/button>/);
  assert.match(r[2].body, /<span class="cp-q-tag is-confirm">要你确认<\/span>/);
  assert.doesNotMatch(r[2].body + r[3].body, /<button/);
  // 展开的卡和第三步一样完整；行和卡在同一个外框里
  assert.match(html, /<div class="cp-q is-open" data-q="w1"><div class="cp-q-row is-wait"[^>]*>.*?<\/div><article class="cp-ask is-own is-wait" id="todo-w1"/);
});

test('队列：点过哪件展开哪件（act.ui）；那件办完不在了回到第一件；点“收起”一件都不展开；交出去的行变灰、不再给 AI 建议按钮', () => {
  const v = normalize(base({ need_you: queue() }));
  const open = (ui, state = {}) => rows(REGIONS['need-you'](v, ctx(acts(state, ui)))).filter((x) => x.open).map((x) => x.id);
  assert.deepEqual(open({ [Q_KEY]: { open: 't1' } }), ['t1']);
  assert.deepEqual(open({ [Q_KEY]: { open: 'gone' } }), ['w1']);
  assert.deepEqual(open({ [Q_KEY]: { open: '' } }), []);
  const done = REGIONS['need-you'](v, ctx(acts({ w2: { phase: 'done', action: 'answer', receipt: { id: 'r1' } } })));
  assert.match(done, /<div class="cp-q is-acted" data-q="w2">/);
  assert.doesNotMatch(rows(done).find((x) => x.id === 'w2').body, /cp-q-pick/);
});

test('队列只有一两件：不给“一行一件 / 全部展开”，带一个记号让右栏铺开；私人占位行没有行，卡照旧', () => {
  const ph = { id: 'p1', title: '有一个 AI 对话在等你回复', placeholder: true, owner_only: true, ask_kind: 'cooperate' };
  const html = REGIONS['need-you'](normalize(base({ viewer: { kind: 'public' }, need_you: [ph] })), ctx());
  assert.match(html, /<span class="cp-q-few" hidden><\/span>/);
  assert.doesNotMatch(html, /<button|cp-q-row/);
  assert.match(html, /<div class="cp-q is-open"><article class="cp-ask is-private" id="todo-p1"/);
  assert.doesNotMatch(REGIONS['need-you'](normalize(base({ need_you: queue() })), ctx(acts())), /cp-q-few/);
});

test('“打开”组：没有 open 字段一个都不画；这台就是对话所在的电脑直接链到 claude://；别的电脑和手机是“在主驾驶上打开”；看汇报、打开文件夹看接口能不能用', () => {
  const x = { id: 'w1', open: { conversation: { app: 'claude', title: '示例', url: 'claude://code/continue?session=local_demo', machine: '主驾驶' }, report: true,
    targets: [{ key: 'conversation', label: '打开对话' }, { key: 'report', label: '打开汇报页' }, { key: 'path:0', label: '打开文件夹「示例」' }, { key: 'path:1', label: '打开文件「示例.md」' }, { key: 'folder', label: '认不得的 key' }] } };
  const viewer = (machine, kind = 'pc', capabilities = ['open', 'report']) => normalize(base({ viewer: { kind: 'owner', device_kind: kind, device_machine: machine, capabilities } })).viewer;
  assert.equal(openGroup({ id: 'w1' }, viewer('主驾驶')), '');
  const here = openGroup(x, viewer('主驾驶'));
  assert.match(here, /<a class="cp-open-a" href="claude:\/\/code\/continue\?session=local_demo">打开对话 ↗<\/a>/);
  assert.match(here, /data-report="w1">看汇报</);
  assert.match(here, /data-open-item="w1" data-open-target="path:0">打开文件夹「示例」</);
  assert.match(here, /data-open-target="path:1">打开文件「示例.md」</);
  // 认得的 key 只有 conversation、report、path:0—path:4；有“看汇报”时不再列“打开汇报页”
  assert.doesNotMatch(here, /认不得的 key|打开汇报页/);
  // 不知道是哪台电脑（后端给空字符串）：当别的电脑，“在主驾驶上打开”
  assert.match(openGroup(x, viewer('')), /data-open-target="conversation">在主驾驶上打开对话</);
  // 没有“看汇报”能力时，“打开汇报页”照样能让主驾驶打开；open.report 不是 true 就没有“看汇报”
  assert.match(openGroup(x, viewer('副驾驶', 'pc', ['open'])), /data-open-target="report">在主驾驶上打开汇报页</);
  assert.doesNotMatch(openGroup({ ...x, open: { ...x.open, report: false } }, viewer('主驾驶')), /data-report=/);
  const there = openGroup(x, viewer('副驾驶'));
  assert.doesNotMatch(there, /claude:\/\//);
  assert.match(there, /data-open-target="conversation">在主驾驶上打开对话</);
  assert.match(there, /data-open-target="path:0">在主驾驶上打开文件夹「示例」</);
  assert.match(openGroup(x, viewer(null, 'phone')), /<span class="cp-open is-phone"/);
  // 接口不能用就不画对应的按钮；地址不是 claude:// / codex:// 的不当链接
  assert.equal(openGroup(x, viewer('副驾驶', 'pc', [])), '');
  assert.doesNotMatch(openGroup({ ...x, open: { ...x.open, conversation: { ...x.open.conversation, url: 'javascript:alert(1)' } } }, viewer('主驾驶')), /<a /);
});

test('等你回的卡：电脑上“打开”组在卡头右端，手机上放到卡的最后；没有 open 字段时卡和第三步一样', () => {
  const v = (kind) => normalize(base({ viewer: { kind: 'owner', device_kind: kind, device_machine: '主驾驶', capabilities: ['open'] },
    need_you: [wait('w1', { open: { conversation: { app: 'claude', url: 'claude://code/continue?session=local_x', machine: '主驾驶' }, targets: [{ key: 'conversation', label: '打开对话' }] } })] }));
  const pc = REGIONS['need-you'](v('pc'), ctx(acts()));
  assert.match(pc, /<div class="cp-card-head"><p class="cp-wait-src">「示例对话w1」那个对话 · 20:50 问的<\/p><span class="cp-open"/);
  const phone = REGIONS['need-you'](v('phone'), ctx(acts()));
  assert.match(phone, /<p class="cp-wait-src">「示例对话w1」那个对话 · 20:50 问的<\/p><p class="cp-own-s">/);
  assert.match(phone, /<p class="cp-open-tail"><span class="cp-open is-phone"[^>]*><button[^>]*>在主驾驶上打开对话<\/button><\/span><\/p><\/article>/);
  const old = REGIONS['need-you'](normalize(base({ need_you: [wait('w1')] })), ctx(acts()));
  assert.doesNotMatch(old, /cp-card-head|cp-open/);
});

test('整页：顶栏（标题、那句话、哪台设备几点读到、↻、?）、左栏队列、右栏（AI 正在干活、你得知道、状态）', () => {
  const v = normalize(base({ viewer: { kind: 'owner', device_state: 'ok', device_kind: 'pc', device_machine: '副驾驶' }, private_count: 2, need_you: queue() }));
  const html = page(v, ctx(acts()));
  const order = ['<div class="cp-topbar">', 'class="cp-hero-copy"', 'data-cp="overview"', '<div class="cp-tools">', 'data-cp-reload', 'id="cp-help"', '</div>\n  </div>\n  <div class="cp-need" id="need-you"',
    '<aside class="cp-rail"', 'data-cp="home"', '<div class="cp-status">', 'data-cp="overview-tri"', 'data-cp="security"', '</aside>'];
  const pos = order.map((t) => html.indexOf(t));
  assert.ok(pos.every((p) => p >= 0), JSON.stringify(pos));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos);
  assert.match(REGIONS.meta(v, ctx(acts())), /<span class="cp-meta-at">副驾驶 · 21:39 读到<\/span><span class="cp-meta-sub">全部显示，其中 2 件公网看不到<\/span>/);
  assert.match(REGIONS.meta(normalize(base({ viewer: { kind: 'public' }, private_count: 18 })), ctx()), /公开版 · 21:39 读到.*18 件私人事项只在本人设备上显示/);
  assert.match(REGIONS.meta(v, ctx(acts(), { offline: true })), /副驾驶 · 读不到电脑（最后 21:39）/);
});

test('“AI 正在跑”的行主行永远不用标题：doing →进展 →最近回复 →“还没写进展”；标题只做灰色标签；在等你回话的写卡上的问题', () => {
  const run = (rows, extra = {}) => normalize(base({ ai_running: { count: rows.length, observed_at: at, rows, ...extra } }));
  const html = REGIONS.home(run([
    { id: 'r1', status: 'running', vendor: 'claude', model_text: 'Claude Opus 5.5', title: '示例旧标题', doing: '改左栏队列的样式', step_index: 3, step_total: 8,
      progress: { text: '队列的行已经画好', at: '2026-10-29T21:36:00+08:00' } },
    { id: 'r2', status: 'running', vendor: 'gpt', model_text: 'GPT Sol', title: 'task_rename_v2', progress: '核对完 312 个文件', last_activity_at: '2026-10-29T19:40:00+08:00' },
    { id: 'r3', status: 'running', vendor: 'gpt', model_text: 'GPT Sol', title: '只有标题的活' },
    { id: 'r6', status: 'running', vendor: 'claude', model_text: 'Claude Opus 5.5', title: '示例会话名', latest_reply: { text: '表格已经改成三列了', at: '2026-10-29T21:30:00+08:00' } },
    { id: 'r7', status: 'running', vendor: 'claude', model_text: 'Claude Opus 5.5', title: '示例会话名 2', latest_reply: '我先去核对一下', latest_reply_at: '2026-10-29T21:10:00+08:00' },
    { id: 'r8', status: 'running', vendor: 'gpt', model_text: 'GPT Sol', title: '示例任务名', latest_reply: { text: '对完了 40 个', at: '2026-10-29T21:20:00+08:00', time_source: 'file_mtime' } },
  ]), ctx(acts()));
  const row = (id) => new RegExp(`<li class="cp-run-row[^"]*"[^>]*data-items="${id}">(.*?)</li>`).exec(html)?.[1] || '';
  assert.match(row('r1'), /<span class="cp-run-doing">正在做：改左栏队列的样式<\/span><small class="cp-run-step">第 3 步\/共 8 步<\/small><small class="cp-run-meta"><span class="cp-run-name">示例旧标题<\/span>队列的行已经画好 · Claude Opus 5.5 · 4 分钟前还在动<\/small>/);
  assert.match(row('r2'), /<span class="cp-run-doing">核对完 312 个文件<\/span><small class="cp-run-meta"><span class="cp-run-name">task_rename_v2<\/span>GPT Sol · 2 小时前还在动<\/small>/);
  assert.match(row('r3'), /<span class="cp-run-doing is-empty">还没写进展<\/span><small class="cp-run-meta"><span class="cp-run-name">只有标题的活<\/span>GPT Sol<\/small>/);
  assert.match(row('r6'), /<span class="cp-run-doing">最近回复：表格已经改成三列了<\/span><small class="cp-run-step">21:30 回的<\/small><small class="cp-run-meta"><span class="cp-run-name">示例会话名<\/span>Claude Opus 5.5<\/small>/);
  assert.match(row('r7'), /最近回复：我先去核对一下<\/span><small class="cp-run-step">[^<]+回的<\/small>/);
  // 时间是文件修改时间（time_source=file_mtime）时前面加“约”
  assert.match(row('r8'), /最近回复：对完了 40 个<\/span><small class="cp-run-step">约 21:20 回的<\/small><small class="cp-run-meta"><span class="cp-run-name">示例任务名<\/span>/);
  assert.doesNotMatch(html, /cp-run-title/);
  // 在等你回话：对上“AI 在等你回”卡（同一个对话名或对话链接）就写卡上的问题，点一下跳到那张卡；对不上用进展那句
  const w = (extra) => ({ id: 'aw1', card_type: 'ai_wait', conversation_title: '示例对话甲', title: '用方案甲还是乙？', ask_kind: 'decision', ...extra });
  const wv = normalize(base({ need_you: [w({}), w({ id: 'aw2', conversation_title: '别的对话', title: '别的问题', open: { conversation: { app: 'claude', title: 'x', url: 'claude://resume?session=abc' } } })],
    ai_running: { count: 3, observed_at: at, rows: [
      { id: 'w1', status: 'waiting_owner', title: '示例对话甲', doing: '等你……' },
      { id: 'w2', status: 'waiting_owner', title: '对不上的对话', progress: '列好了两个方案' },
      { id: 'w3', status: 'waiting_owner', title: '链接对上的', open: { conversation: { app: 'claude', title: 'x', url: 'claude://resume?session=abc' } } }] } }));
  const wh = REGIONS.home(wv, ctx(acts()));
  const wrow = (id) => new RegExp(`<li class="cp-run-row[^"]*"[^>]*data-items="${id}">(.*?)</li>`).exec(wh)?.[1] || '';
  assert.match(wrow('w1'), /<a class="cp-run-doing cp-run-goto" href="#aw1">在等你回话：用方案甲还是乙？<\/a>/);
  assert.doesNotMatch(wh, /正在做：等你/);
  assert.match(wrow('w2'), /<span class="cp-run-doing">在等你回话：列好了两个方案<\/span>/);
  assert.match(wrow('w3'), /href="#aw2">在等你回话：别的问题<\/a>/);
  // 停了没做完、早就停了：末尾一行小字（停了的行已经列出来时不重复数）
  assert.match(REGIONS.home(run([{ id: 'r4', status: 'running', title: '示例' }], { stopped_count: 2, stale_count: 3 }), ctx(acts())), /<p class="cp-run-stale">另有 2 件停了，没做完、3 件早就停了<\/p>/);
  assert.match(REGIONS.home(run([{ id: 'r5', status: 'stopped', title: '示例' }], { stopped_count: 1 }), ctx(acts())), /停了，没做完/);
  assert.doesNotMatch(REGIONS.home(run([{ id: 'r5', status: 'stopped', title: '示例' }], { stopped_count: 1 }), ctx(acts())), /另有 1 件停了/);
});

test('后端 10 月 29 日起的字段：完成说明读 completion_text（不拿 done_when 当提示）；顶上那句只取第一句；没读到的来源写影响；今天核对了几件', () => {
  const todo = { id: 't9', card_type: 'task', title: '示例动手事', ask_kind: 'action', steps: ['第一步'], done_when: 'AI 核对示例条件满足后关掉', completion_text: '做完上面几步就行，剩下 AI 收尾。', owner_actions: ['done'] };
  const v = normalize(base({ need_you: [todo], verdict: { text: '要你动手 1 件。还有 8 件事等合适时候再办。AI 手上还有 69 件自己的活。', need_you: 1 } }));
  const need = REGIONS['need-you'](v, ctx(acts()));
  assert.match(need, /<p class="cp-own-done">做完上面几步就行，剩下 AI 收尾。<\/p>/);
  assert.doesNotMatch(need, /AI 核对示例条件满足后关掉/);
  assert.match(REGIONS.overview(v, ctx(acts())), /<span class="cp-you-said">要你动手 1 件。<\/span>/);
  assert.doesNotMatch(REGIONS.overview(v, ctx(acts())), /还有 8 件事/);
  // 没有要你做的事：圆点和那句话包在一起，不单独换行
  const none = normalize(base({ verdict: { text: '现在没有要你动手或回话的事。还有 8 件事等合适时候再办。', need_you: 0, color: 'yellow' } }));
  assert.match(REGIONS.overview(none, ctx(acts())), /<div class="cp-you is-none is-said">.*<span class="cp-you-said">现在没有要你动手或回话的事。<\/span>/);
  const t = REGIONS.today(normalize(base({ source_gaps: [{ title: '示例来源', since: at, impact: '下面“今天代码”的数可能少算' }],
    today_activity: { state: 'ok', observed_at: at, summary: { tasks_run: 3, tasks_failed: 0, acceptance_text: 'AI 今天核对了 25 件事，22 件确认办完、已关掉。' }, timeline: [{ at, text: '示例' }] } })), ctx(acts()));
  assert.match(t, /示例来源.*<small class="cp-gap-impact">下面“今天代码”的数可能少算<\/small>/);
  assert.match(t, /<p class="cp-cap cp-acceptance">AI 今天核对了 25 件事，22 件确认办完、已关掉。<\/p>/);
});

test('账本页电脑版表格：AI 在跟（晚了的在前、AI 定了一行、技术细节收起、可筛）；AI 自己定了（有 batch 才能勾选、一次知道了）', () => {
  const late = { id: 'f1', title: '示例晚了的事', overdue_since: '2026-10-20T10:00:00+08:00', overdue_days: 9, latest_progress: '示例进展甲', owner_actions: ['note'],
    decision_summary: '示例晚了的事：在 11 月 5 日前处理好；本轮周治理技术核对 growth_present=false' };
  const ok = { id: 'f2', title: '示例没晚的事', scheduled_text: '约 11 月 6 日', owner_actions: ['note'] };
  const dec = (id, extra = {}) => ({ id, kind: 'ai_decision', text: `示例决定${id}：结束跟进；示例原因${id}`, at, owner_actions: ['ack', 'note'], ...extra });
  const mk = (viewer) => normalize(base({ viewer, ai_following: [late, ok], ai_overdue: [late], must_know: { state: 'ok', items: [dec('d1'), dec('d2'), dec('d3', { owner_actions: null })] } }));
  const own = REGIONS.ledger(mk({ kind: 'owner', device_state: 'ok', capabilities: ['batch'] }), ctx(acts()));
  const follow = /<div class="cp-lt" id="ai-following-table">.*?<\/table>/.exec(own)?.[0] || '';
  assert.deepEqual([...follow.matchAll(/<tr class="(is-late|is-ok)/g)].map((m) => m[1]), ['is-late', 'is-ok']);
  assert.match(follow, /<td class="cp-lt-due">10 月 20 日<\/td><td class="cp-lt-lag"><span class="cp-lt-late">晚 9 天<\/span><\/td><td class="cp-lt-prog"><span>示例进展甲<\/span>/);
  assert.match(follow, /<td class="cp-lt-due">约 11 月 6 日<\/td><td class="cp-lt-lag"><span class="cp-lt-none">没晚<\/span>/);
  assert.match(follow, /<div class="cp-ai-dec"><span>AI 定了：在 11 月 5 日前处理好<\/span><details class="cp-tech" id="dect-f1"><summary>技术细节<\/summary><p>本轮周治理技术核对 growth_present=false<\/p><\/details><\/div>/);
  assert.match(follow, /data-lshow="all" aria-pressed="true">全部 2<.*data-lshow="late" aria-pressed="false">晚了 1<.*data-lshow="ok" aria-pressed="false">没晚 1</);
  assert.match(follow, /<th class="cp-lt-act">/);
  // 窄屏列表那行也有“AI 定了”
  assert.match(own, /<div class="cp-ai-dec"><span>AI 定了：在 11 月 5 日前处理好<\/span><details class="cp-tech" id="decl-f1">/);
  assert.deepEqual(decisionOf({ title: '甲', decision_summary: '甲：结束跟进' }), { what: '结束跟进', basis: '' });
  // 筛选记在 act.ui：只看晚了的、按字筛
  const f = REGIONS.ledger(mk({ kind: 'owner' }), ctx(acts({}, { [LF_KEY]: { show: 'late' } })));
  assert.match(f, /<tr class="is-ok"[^>]* hidden>/);
  assert.match(REGIONS.ledger(mk({ kind: 'owner' }), ctx(acts({}, { [LF_KEY]: { q: '没晚' } }))), /按“没晚”筛.*<tr class="is-late"[^>]* hidden>/);
  // AI 自己定了：有 batch 才有勾选和“全部知道了”；只勾能“知道了”的；“回一句话”写成“不同意”
  const decT = /<div class="cp-lt" id="ai-decided-table">.*?<\/table>/.exec(own)?.[0] || '';
  assert.match(decT, /<button type="button" class="cp-btn cp-btn-main" data-lb-ack>全部知道了（2 件）<\/button>/);
  assert.equal((decT.match(/data-lb="/g) || []).length, 2);
  assert.match(decT, /<td class="cp-lt-dec">不再跟进，这条结束<\/td><td class="cp-lt-why">示例原因d1<\/td>/);
  assert.match(decT, />不同意<\/button>/);
  const picked = REGIONS.ledger(mk({ kind: 'owner', capabilities: ['batch'] }), ctx(acts({}, { [LB_KEY]: { sel: ['d2'] } })));
  assert.match(picked, /data-lb="d2" checked/);
  assert.match(picked, />选中的 1 件都知道了</);
  const noBatch = REGIONS.ledger(mk({ kind: 'owner', capabilities: [] }), ctx(acts()));
  assert.doesNotMatch(noBatch, /data-lb|全部知道了/);
  // 一行都不能点（公开版、没给按钮）：不留最后那一列
  const bare = REGIONS.ledger(normalize(base({ ai_following: [{ id: 'f3', title: '示例' }], ai_overdue: [] })), ctx(acts()));
  assert.doesNotMatch(bare, /<th class="cp-lt-act">/);
});

test('“?”里有键盘说明；标签页“(N) 驾驶舱”的 N 和顶上“要你做”同一个数', () => {
  const v = normalize(base({ need_you: queue() }));
  const html = page(v, ctx(acts()));
  const help = /<div class="cp-help-pop">(.*?)<\/div><\/details>/.exec(html)?.[1] || '';
  for (const k of ['j', 'k', '1', '9', 'Enter', 'o', 'n', 's', 'u', '?']) assert.match(help, new RegExp(`<kbd>${k.replace('?', '[?]')}</kbd>`), k);
  assert.match(help, /每 3 分钟/);
  assert.equal(needCount(v, now), 4);
  assert.equal(needCount(normalize(base({})), now), 0);
});

test('事实区包在一个外框里（电脑版两栏 / 三栏，窄屏不变）', () => {
  const html = page(normalize(base({})), ctx(acts()));
  assert.match(html, /<div class="cp-facts-wall">\s*<section class="cp-section" id="tasks">/);
  assert.match(html, /id="projects">.*<\/section>\s*<\/div>$/s);
});

test('看过截图后的四处：“具体：”不和“进展：”叠；AI 正在干活的数和列出来的行对得上；没写问题的旧等你回卡写清哪个对话；手机三小块也写那一句', () => {
  // 1) 正文已经以“进展：”这类标签开头时不再加“具体：”
  const k = normalize(base({ must_know: { state: 'ok', items: [{ id: 'k1', kind: 'repairing', text: '示例在修', owner_detail: '进展：示例进展' }, { id: 'k2', kind: 'report', text: '示例汇报', owner_detail: '示例平台 10 月回复了' }] } }));
  const home = REGIONS.home(k, ctx(acts()));
  assert.match(home, /title="进展：示例进展">进展：示例进展<\/span>/);
  assert.doesNotMatch(home, /具体：进展：/);
  assert.match(home, />具体：示例平台 10 月回复了<\/span>/);
  // 2) 卡住 1 + 在干活 2 + 停了 1 + 看不出 1：标题“AI 在干活：3 个（1 个卡住要你看），另 1 件停了没做完、1 件看不出在干嘛”，“其余 4 个”= 真列出来的 4 行
  const rows = [{ id: 'q', status: 'quota_exhausted' }, { id: 'a', status: 'running' }, { id: 'b', status: 'waiting_owner' }, { id: 'c', status: 'stopped' }, { id: 'd', status: 'unknown' }];
  const run = REGIONS.home(normalize(base({ ai_running: { count: 3, observed_at: at, rows } })), ctx(acts()));
  assert.match(run, /AI 在干活：3 个（1 个卡住要你看），另 1 件停了没做完、1 件看不出在干嘛<\/span>/);
  const rest = /<summary>其余 (\d+) 个<\/summary><ul class="cp-run-list">(.*?)<\/ul>/.exec(run);
  assert.equal(Number(rest[1]), (rest[2].match(/<li class="cp-run-row/g) || []).length);
  assert.equal(Number(rest[1]), 4);
  // 3) 没写问题的旧卡：有对话名写“「对话名」那个对话在等你回话”并给“打开对话”；没有对话名照实说没写问题
  const old = (extra = {}) => ({ id: 'aw-old', card_type: 'ai_wait', title: '有一个 AI 对话在等你回复', ask_kind: 'cooperate', owner_actions: ['note', 'seen'], ...extra });
  const withConv = old({ open: { conversation: { app: 'claude', title: '示例对话甲', url: 'claude://code/continue?session=local_old', machine: '主驾驶' }, targets: [{ key: 'conversation', label: '打开对话' }] } });
  const v = (x) => normalize(base({ viewer: { kind: 'owner', device_kind: 'pc', device_machine: '副驾驶', capabilities: ['open', 'report', 'batch'] }, need_you: [x, wait('w2'), wait('w3')] }));
  const need = REGIONS['need-you'](v(withConv), ctx(acts()));
  assert.match(need, /<span class="cp-q-title">「示例对话甲」那个对话在等你回话<\/span>/);
  assert.match(need, /<h3 class="cp-ask-title"><span>「示例对话甲」那个对话在等你回话/);
  assert.match(need, /data-open-item="aw-old" data-open-target="conversation">在主驾驶上打开对话</);
  assert.doesNotMatch(need, /有一个 AI 对话在等你回复/);
  assert.match(REGIONS['need-you'](v(old()), ctx(acts())), /有个对话在等你回话，但它没写问题/);
});

test('线上真数据自查：要你做的只有一两件时都展开；等你回卡没写是哪个对话时照实说', () => {
  const two = REGIONS['need-you'](normalize(base({ need_you: [wait('w1', { conversation_title: null }), { id: 't1', card_type: 'task', title: '示例动手', ask_kind: 'action', owner_actions: ['done'] }] })), ctx(acts()));
  assert.equal((two.match(/<div class="cp-q is-open[^"]*" data-q=/g) || []).length, 2);
  assert.match(two, /<p class="cp-wait-src">一个 AI 对话（没写是哪个） · [^<]+ 问的<\/p>/);
  // 三件以上照旧只展开一件
  assert.equal((REGIONS['need-you'](normalize(base({ need_you: queue() })), ctx(acts())).match(/<div class="cp-q is-open[^"]*" data-q=/g) || []).length, 1);
});

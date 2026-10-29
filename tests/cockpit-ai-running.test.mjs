// 驾驶舱“AI 正在干活”和收拢后的“你得知道”（本人 2026-10-29 14:40、14:58 的要求；18:42—18:51 嫌谜语、不好用后第三步再收）：全部数据虚构
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page, firstSentence, runLine, RUN_LOOK, helperText } from '../site-astro/src/cockpit/render.js';

const now = new Date('2026-10-29T15:40:00+08:00');
const at = '2026-10-29T15:39:30+08:00';
const base = (extra = {}) => ({ schema: 'pcconfig.cockpit-view.v1', served_at: at, ...extra });
const ov = { stale: () => false, lamp: () => '' };
const ctx = { now, offline: false, phase: 'live', projectUrls: {}, img: {}, ov };
const todo = { id: 'n1', title: '示例选择题：选一个做法', ask_kind: 'decision', headline: '示例选择题' };

const row = (status, extra = {}) => ({ id: 'run-' + status, status, vendor: 'claude', model: 'claude-opus-5-5', model_text: 'Claude Opus 5.5', effort: 'high', kind: 'conversation',
  title: '示例活 ' + status, started_at: '2026-10-29T15:00:00+08:00', last_activity_at: at, detail: '示例说明 ' + status, helpers: 0, ...extra });
const running = (rows, extra = {}) => ({ count: rows.length, stuck_count: rows.filter((r) => ['network_retry', 'quota_exhausted', 'login_failed', 'stopped'].includes(r.status)).length,
  summary: '', observed_at: at, gaps: ['示例缺口'], rows, ...extra });

test('没有 ai_running 字段：这块不出，也不报错', () => {
  for (const bad of [undefined, null, 'x', 3, [], [{ status: 'running' }]]) {
    const v = normalize(base({ need_you: [todo], ...(bad === undefined ? {} : { ai_running: bad }) }));
    assert.equal(v.ai_running, null);
    assert.doesNotMatch(REGIONS.overview(v, ctx) + REGIONS.home(v, ctx), /cp-run|AI 在干活|AI 正在干活/);
    assert.doesNotThrow(() => page(v, ctx));
  }
});

test('首屏只露件数和卡住要你看的（额度、登录）；其余收进“其余 N 个”；状态是颜色 + 符号 + 人话', () => {
  const rows = [row('running', { helpers: 2 }), row('unknown', { vendor: 'gpt', model_text: '', title: '示例 Codex 对话' }), row('waiting_owner'), row('stopped'),
    row('network_retry'), row('quota_exhausted', { vendor: 'gpt', model_text: 'GPT Sol', status_text: '额度用完' }), row('login_failed'), row('mystery_state')];
  const v = normalize(base({ need_you: [todo], ai_running: running(rows, { summary: '示例：AI 在跑 8 个，3 个卡住' }) }));
  assert.equal(v.ai_running.rows.find((r) => r.id === 'run-mystery_state').status, 'unknown');
  const html = REGIONS.home(v, ctx);
  // 卡住要你看的只算额度和登录；停了没做完、看不出在干嘛的不算在干活
  // 标题的数和列出来的行对得上：5 个在干活（含 2 个卡住）+ 另 1 件停了没做完、2 件看不出在干嘛 = 卡住 2 行 + 其余 6 行
  assert.match(html, /class="hub-heading cp-run-sum">AI 正在干活：5 个（2 个卡住要你看），另 1 件停了没做完、2 件看不出在干嘛<\/h2>[^]*?class="cp-run-at">15:39 读到的<\/span>/);
  const stuck = /<ul class="cp-run-list is-stuck">(.*?)<\/ul>/.exec(html)?.[1] || '';
  assert.deepEqual([...stuck.matchAll(/<li class="cp-run-row is-([a-z_]+) /g)].map((m) => m[1]), ['quota_exhausted', 'login_failed']);
  const rest = /<details class="cp-run-all" id="run-all"><summary>其余 6 个<\/summary><ul class="cp-run-list">(.*?)<\/ul><\/details>/.exec(html)?.[1] || '';
  assert.deepEqual([...rest.matchAll(/<li class="cp-run-row is-([a-z_]+) /g)].map((m) => m[1]), ['network_retry', 'stopped', 'waiting_owner', 'running', 'unknown', 'unknown']);
  const look = Object.fromEntries([...html.matchAll(/<li class="cp-run-row is-([a-z_]+) is-live" data-items="run-\w+"><span class="cp-run-st is-(\w+)"><i aria-hidden="true">(.)<\/i><span class="cp-run-word">([^<]+)<\/span><\/span>/g)].map((m) => [m[1], [m[2], m[3], m[4]]]));
  assert.deepEqual(look, { login_failed: ['red', '○', '登录失效'], quota_exhausted: ['red', '○', '额度用完'], network_retry: ['yellow', '◐', '网络在重连'],
    waiting_owner: ['blue', '◆', '在等你回话'], stopped: ['gray', '■', '停了，没做完'], unknown: ['gray', '？', '看不出在干嘛（多半已经结束）'], running: ['green', '●', '在干活'] });
  assert.equal(Object.keys(RUN_LOOK).length, 7);
  // 主行永远不用标题（本人：“驾驶舱肯定不能取标题”）：没有 doing、进展、最近回复时写“还没写进展”，标题只做灰色小标签
  assert.match(html, /<span class="cp-run-doing is-empty">还没写进展<\/span><small class="cp-run-meta"><span class="cp-run-name">示例活 running<\/span>Claude Opus 5.5 · 它叫了 2 个助手 · [^<]*还在动<\/small>/);
  // 没给型号显示名时退回“GPT”；不出型号代号和字段名
  assert.match(html, /<span class="cp-run-name">示例 Codex 对话<\/span>GPT · /);
  assert.doesNotMatch(html, /claude-opus-5-5|conversation|示例缺口|high|判断不了|没正常结束|cp-run-title/);
  // 首屏顺序：AI 正在干活 → 你得知道 → 几行入口；总览那一句不再带“AI 在跑”
  const v2 = normalize(base({ need_you: [todo], ai_running: running([row('running')]), must_know: { state: 'ok', items: [{ id: 'k1', kind: 'repairing', text: '示例在修' }] } }));
  const h2 = REGIONS.home(v2, ctx);
  assert.ok(h2.indexOf('id="ai-running"') < h2.indexOf('class="cp-know"') && h2.indexOf('class="cp-know"') < h2.indexOf('class="cp-lines"'));
  assert.doesNotMatch(REGIONS.overview(v2, ctx), /AI 在跑|cp-you-ai/);
  // 没有卡住的：只写件数，点开看是哪几个
  assert.match(h2, /AI 正在干活：1 个<\/h2>.*<summary>看是哪 1 个<\/summary>/);
});

test('件数那一句：一个都没有写“现在没有 AI 在干活”；读不全照实说', () => {
  assert.equal(runLine({ count: 2, stuck_count: 0, rows: [] }), 'AI 在干活：2 个');
  assert.equal(runLine({ count: 0, stuck_count: 0, rows: [] }), '现在没有 AI 在干活');
  assert.equal(runLine({ count: 0, stuck_count: 0, rows: [], unread: true }), 'AI 干活情况读不全');
  const none = REGIONS.home(normalize(base({ need_you: [todo], ai_running: { count: 0, stuck_count: 0, summary: '', observed_at: at, rows: [] } })), ctx);
  assert.match(none, /class="cp-run is-empty"[^]*?class="hub-heading cp-run-sum">现在没有 AI 在干活<\/h2>/);
  assert.doesNotMatch(none, /cp-run-list/);
  // 帮手说明换成人话
  assert.equal(helperText('刚刚还在动，+9 个帮手：4 个在跑、5 个判断不了'), '刚刚还在动，它叫了 9 个助手，4 个在干活');
  assert.equal(helperText('+3 个帮手'), '它叫了 3 个助手');
});

test('公开版：只写两句（几个在干活、卡在额度还是登录；按型号数），不列在做什么，也不写早就停了的', () => {
  const pub = (status, model_text, vendor = 'claude') => ({ id: 'p-' + status + model_text, status, vendor, model_text, title: '一件 AI 活', placeholder: true, helpers: 3 });
  const rows = [...Array.from({ length: 4 }, () => pub('running', 'Claude Opus 5.5')), pub('network_retry', 'Claude Opus 5.5'),
    pub('quota_exhausted', 'GPT Sol', 'gpt'), pub('login_failed', 'GPT Sol', 'gpt'), pub('running', 'GPT Sol', 'gpt'), pub('unknown', '', 'gpt')];
  const block = running(rows, { summary: 'AI 在跑 9 个，3 个卡住了，另有 2 件早就停了', stale_count: 2 });
  const html = REGIONS.home(normalize(base({ viewer: { kind: 'public', device_state: 'none' }, ai_running: block })), ctx);
  assert.match(html, /class="cp-run is-public"[^]*?class="hub-heading cp-run-sum">AI 正在干活：8 个（额度 1 个、登录 1 个卡住）<\/h2>[^]*?class="cp-run-at">15:39 读到的<\/span>/);
  assert.match(html, /<p class="cp-run-models">Claude Opus 5.5 5 个 · GPT Sol 3 个<\/p>/);
  assert.doesNotMatch(html, /一件 AI 活|cp-run-list|cp-run-row|早就停了|个帮手|个助手|<button/);
  // 只凭行上的 placeholder 也认（没有 viewer 字段时）；网络重连、停了没做完不算卡住要你看
  const two = REGIONS.home(normalize(base({ ai_running: running([pub('network_retry', 'GPT Sol', 'gpt'), pub('network_retry', 'GPT Sol', 'gpt'), pub('stopped', 'Claude Opus 5.5')]) })), ctx);
  assert.match(two, /class="hub-heading cp-run-sum">AI 正在干活：2 个<\/h2>/);
  assert.match(two, /<p class="cp-run-models">GPT Sol 2 个<\/p>/);
  // 读不到电脑时淡下去，写明是几点读到的
  const off = REGIONS.home(normalize(base({ ai_running: running([pub('running', 'GPT Sol', 'gpt')]) })), { ...ctx, offline: true });
  assert.match(off, /<div class="cp-run is-public is-off" id="ai-running">.*读不到电脑，这是 15:39 读到的/);
});

test('本人版：只有早停数量而没有明细时不出空话；帮手说明只写一次', () => {
  const longHelp = '刚刚还在动，+9 个帮手：4 个在跑、2 个额度用完（GPT Sol，最长 37 分钟没动静）、3 个判断不了';
  const block = running([row('running', { helpers: 9, detail: longHelp }), row('waiting_owner', { helpers: 1 })], { summary: 'AI 在跑 2 个，另有 3 件早就停了', stale_count: 3 });
  const html = REGIONS.home(normalize(base({ viewer: { kind: 'owner', device_state: 'ok' }, ai_running: block })), ctx);
  assert.match(html, /class="hub-heading cp-run-sum">AI 正在干活：2 个<\/h2>/);
  assert.doesNotMatch(html, /cp-run-stale|早就停了/);
  assert.equal((html.match(/个助手/g) || []).length, 2);
  assert.match(html, /Claude Opus 5.5 · 它叫了 9 个助手，4 个在干活 · [^<]*还在动<\/small>/);
  assert.match(html, /<span class="cp-run-doing is-empty">在等你回话<\/span><small class="cp-run-meta"><span class="cp-run-name">示例活 waiting_owner<\/span>Claude Opus 5.5 · 它叫了 1 个助手 · /);
  // 没有在干活的、但有早就停了的：一行“现在没有 AI 在干活”，下面小字
  const none = REGIONS.home(normalize(base({ ai_running: { count: 0, stuck_count: 0, stale_count: 2, summary: '现在没有 AI 在跑，另有 2 件早就停了', observed_at: at, gaps: [], rows: [] } })), ctx);
  assert.match(none, /class="hub-heading cp-run-sum">现在没有 AI 在干活<\/h2>[^]*?class="cp-run-at">15:39 读到的<\/span>/);
  assert.doesNotMatch(none, /cp-run-stale|早就停了/);
  // 公开版这一句不出；没有 stale_count 字段时什么都不加
  const pubNone = REGIONS.home(normalize(base({ viewer: { kind: 'public', device_state: 'none' }, ai_running: { count: 0, stuck_count: 0, stale_count: 2, summary: '', observed_at: at, gaps: [], rows: [] } })), ctx);
  assert.doesNotMatch(pubNone, /早就停了/);
  assert.doesNotMatch(REGIONS.home(normalize(base({ ai_running: running([row('running')]) })), ctx), /cp-run-stale/);
  // 这次读不全：不说成“没有 AI 在干活”
  const unread = normalize(base({ ai_running: { count: 0, stuck_count: 0, stale_count: 0, summary: 'AI 运行情况暂时读不全', observed_at: null, gaps: ['codex_sqlite_unavailable'], rows: [] } }));
  const uh = REGIONS.home(unread, ctx);
  assert.match(uh, /class="hub-heading cp-run-sum">AI 干活情况暂时读不全<\/h2>/);
  assert.doesNotMatch(uh, /没有 AI 在干活|codex_sqlite/);
});

test('你得知道只留真跟你有关的：AI 在修排最前、汇报只露第一句；已恢复挪到自动任务区，AI 已定挪到“AI 的账本”', () => {
  const recovered = ['示例费用', '示例原话补漏', '示例流量记录', '示例内存记录', '示例手机数据'].map((n, i) => ({ id: `recovered:t${i}`, kind: 'recovered', text: `${n}已恢复，AI 已核对最近一次成功。`, at: `2026-10-2${i + 4}T12:00:00+08:00`, exit_when: '确认恢复满 3 天后收起' }));
  const decisions = [
    { id: 'd0', kind: 'ai_decision', text: '示例备份盘同步与恢复验收：限期到 2026-10-31 18:30（北京时间）；周治理：示例组 warning/example_code，其它组完成。', decision_due_at: '2026-10-31T18:30:00+08:00', at },
    { id: 'd1', kind: 'ai_decision', text: '示例故障由 AI 根治：示例驱动，减少卡顿：限期到 2026-11-05 21:00（北京时间）；已满14天。', at },
    { id: 'd2', kind: 'ai_decision', text: '示例高内存占用：结束；守护持续正常。', at },
  ];
  const report = { id: 'task-result:gov', kind: 'report', text: '每周体检这次没有完成，未关47增至57，AI跟40增至45……', at, exit_when: '结果记录满 3 天后收起' };
  const repairing = { id: 'pending-net', kind: 'repairing', text: '示例两台电脑上网偶尔断开，原因还没查清。', at, exit_when: 'AI 核实解决后转为已恢复，3 天后收起' };
  const v = normalize(base({ must_know: { state: 'ok', items: [...recovered, ...decisions, report, repairing], archived_items: [] } }));
  const html = REGIONS.home(v, ctx);
  const top = /<ul class="cp-know-list">(.*?)<\/ul><\/div>/.exec(html)?.[1] || '';
  assert.deepEqual([...top.matchAll(/<li id="(know-[\w:-]+)"/g)].map((m) => m[1]), ['know-pending-net', 'know-task-resultgov']);
  assert.doesNotMatch(html, /cp-know-rest|中断过|AI 自己定了|复制给 AI/);
  assert.match(html, /<details class="cp-know-fold" id="know-task-resultgov-open"><summary>每周体检这次没有完成<\/summary><div class="cp-know-sub"><p>未关47增至57，AI跟40增至45……<\/p>/);
  // 已恢复：自动任务区开头一行，点开是哪几项
  const tasks = REGIONS.tasks(v, ctx);
  assert.match(tasks, /<summary><span class="cp-dot is-green" aria-hidden="true"><\/span>后台 5 项功能中断过，现在都恢复了<\/summary><ul class="cp-know-sub"><li id="know-recoveredt0" data-items="recovered:t0"><span>示例费用<\/span><small>10月24日 12:00 确认恢复<\/small>/);
  // AI 已定：二级页逐条写什么事、AI 定了什么、一句原因；英文代号收进“技术细节”
  const led = REGIONS.ledger(v, ctx);
  assert.match(led, /<span class="cp-know-dec-topic">示例备份盘同步与恢复验收<\/span><span class="cp-know-dec-what">AI 定了：限期到 10月31日 18:30<\/span><details class="cp-tech"><summary>技术细节<\/summary><p>周治理：示例组 warning\/example_code，其它组完成<\/p><\/details>/);
  assert.match(led, /<span class="cp-know-dec-topic">示例故障由 AI 根治：示例驱动，减少卡顿<\/span><span class="cp-know-dec-what">AI 定了：限期到 11月5日 21:00<\/span><span class="cp-know-dec-why">原因：已满14天<\/span>/);
  assert.match(led, /<span class="cp-know-dec-topic">示例高内存占用<\/span><span class="cp-know-dec-what">AI 定了：不再跟进，这条结束<\/span>/);
  for (const id of ['know-recovered-open', 'know-task-resultgov-open']) assert.ok((html + tasks).includes(`id="${id}"`), id);
  assert.deepEqual(firstSentence({ text: '示例汇报 0' }), ['示例汇报 0', '']);
  assert.deepEqual(firstSentence({ text: '短句，后面' }), ['短句，后面', '']);
  // 同一项恢复过两次算一项
  const twice = REGIONS.tasks(normalize(base({ must_know: { state: 'ok', items: [recovered[3], { ...recovered[3], id: 'recovered:again', at: '2026-10-28T12:00:00+08:00' }, recovered[4]] } })), ctx);
  assert.match(twice, /后台 2 项功能中断过，现在都恢复了.*示例内存记录（中断过 2 次）<\/span><small>10月28日 12:00 确认恢复/);
});

test('你得知道超过 5 行：露前 4 行（AI 在修和影响你的事在前），其余折成“其余 N 条”', () => {
  const items = [
    ...Array.from({ length: 5 }, (_, i) => ({ id: `r${i}`, kind: 'report', text: `示例汇报 ${i}` })),
    { id: 'x1', kind: 'done', text: '示例：你交的活做完了' },
    { id: 'rec1', kind: 'recovered', text: '示例甲已恢复。' }, { id: 'dec1', kind: 'ai_decision', text: '示例决定：结束；示例依据。' },
    { id: 'fix1', kind: 'repairing', text: '示例在修' },
  ];
  const html = REGIONS.home(normalize(base({ must_know: { state: 'ok', items } })), ctx);
  const main = /<ul class="cp-know-list">(.*?)<\/ul><details class="cp-know-rest"/.exec(html)?.[1] || '';
  assert.deepEqual([...main.matchAll(/<li id="(know-\w+)"/g)].map((m) => m[1]), ['know-fix1', 'know-x1', 'know-r0', 'know-r1']);
  assert.match(html, /<details class="cp-know-rest" id="know-rest"><summary>其余 3 条<\/summary><ul class="cp-know-list"><li id="know-r2"/);
  assert.doesNotMatch(html, /know-rec1|know-dec1/);
});

test('每个条目都带自己的编号（data-items），手机通知打开 /cockpit/#<条目编号> 时找得到', () => {
  const v = normalize(base({
    need_you: [{ id: 'n-1', copy_ai_id: 'pub-n-1', title: '示例待办：做一下', ask_kind: 'do' }],
    ai_following: [{ id: 'a-1', title: '示例 AI 在跟的事' }], deferred: [{ id: 'w-1', title: '示例暂缓', action_owner: 'user' }],
    must_know: { state: 'ok', items: [{ id: 'rec:1', kind: 'recovered', text: '示例甲已恢复。' }, { id: 'rec:2', kind: 'recovered', text: '示例甲已恢复。' }, { id: 'k-1', kind: 'repairing', text: '示例在修' }] },
    ai_running: running([row('running')]),
  }));
  const html = REGIONS['need-you'](v, ctx) + REGIONS.home(v, ctx) + REGIONS.tasks(v, ctx) + REGIONS.ledger(v, ctx);
  for (const ids of ['n-1 pub-n-1', 'a-1', 'w-1', 'rec:1 rec:2', 'k-1', 'run-running']) assert.ok(html.includes(`data-items="${ids}"`), ids);
  // 顶上那一句不带编号，免得先找到它
  assert.doesNotMatch(REGIONS.overview(v, ctx), /data-items/);
});

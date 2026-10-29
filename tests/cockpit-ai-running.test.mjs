// 驾驶舱“AI 正在跑”和收拢后的“你得知道”（本人 2026-10-29 14:40、14:58 的要求）：全部数据虚构
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page, firstSentence, runLine, RUN_LOOK } from '../site-astro/src/cockpit/render.js';

const now = new Date('2026-10-29T15:40:00+08:00');
const at = '2026-10-29T15:39:30+08:00';
const base = (extra = {}) => ({ schema: 'pcconfig.cockpit-view.v1', served_at: at, ...extra });
const ov = { stale: () => false, lamp: () => '' };
const ctx = { now, offline: false, phase: 'live', projectUrls: {}, img: {}, ov };
const todo = { id: 'n1', title: '示例选择题：选一个做法', ask_kind: 'decision', headline: '示例选择题' };

const row = (status, extra = {}) => ({ id: 'run-' + status, status, vendor: 'claude', model: 'claude-opus-5-5', model_text: 'Claude Opus 5.5', effort: 'high', kind: 'conversation',
  title: '示例活 ' + status, started_at: '2026-10-29T15:00:00+08:00', last_activity_at: at, detail: '示例说明 ' + status, helpers: 0, ...extra });
const running = (rows, extra = {}) => ({ count: rows.length, stuck_count: rows.filter((r) => ['network_retry', 'quota_exhausted', 'login_failed'].includes(r.status)).length,
  summary: '', observed_at: at, gaps: ['示例缺口'], rows, ...extra });

test('没有 ai_running 字段：这块不出、总览句不加，也不报错', () => {
  for (const bad of [undefined, null, 'x', 3, [], [{ status: 'running' }]]) {
    const v = normalize(base({ need_you: [todo], ...(bad === undefined ? {} : { ai_running: bad }) }));
    assert.equal(v.ai_running, null);
    const html = REGIONS.overview(v, ctx);
    assert.doesNotMatch(html, /cp-run|cp-you-ai|AI 在跑|AI 正在跑/);
    assert.doesNotThrow(() => page(v, ctx));
  }
});

test('每行：状态（颜色 + 符号 + 字）+ 标题，第二行“型号 · 一句话”；卡住的在前', () => {
  const rows = [row('running', { helpers: 2 }), row('unknown', { vendor: 'gpt', model_text: '', title: '示例 Codex 对话' }), row('waiting_owner'), row('stopped'),
    row('network_retry'), row('quota_exhausted', { vendor: 'gpt', model_text: 'GPT Sol', status_text: '额度用完' }), row('login_failed'), row('mystery_state')];
  const v = normalize(base({ need_you: [todo], ai_running: running(rows, { summary: '示例：AI 在跑 8 个，3 个卡住' }) }));
  assert.equal(v.ai_running.rows.find((r) => r.id === 'run-mystery_state').status, 'unknown');
  const html = REGIONS.overview(v, ctx);
  const order = [...html.matchAll(/<li class="cp-run-row is-([a-z_]+)">/g)].map((m) => m[1]);
  assert.deepEqual(order, ['login_failed', 'quota_exhausted', 'network_retry', 'waiting_owner', 'stopped', 'unknown', 'unknown', 'running']);
  // 颜色和符号：在跑绿●、网络在重连黄◐、额度用完红○、登录失效红○、等你回蓝◆、停了灰■、判断不了灰？
  const look = Object.fromEntries([...html.matchAll(/<li class="cp-run-row is-([a-z_]+)"><span class="cp-run-st is-(\w+)"><i aria-hidden="true">(.)<\/i>([^<]+)<\/span>/g)].map((m) => [m[1], [m[2], m[3], m[4]]]));
  assert.deepEqual(look, { login_failed: ['red', '○', '登录失效'], quota_exhausted: ['red', '○', '额度用完'], network_retry: ['yellow', '◐', '网络在重连'],
    waiting_owner: ['blue', '◆', '等你回'], stopped: ['gray', '■', '停了，没正常结束'], unknown: ['gray', '？', '判断不了'], running: ['green', '●', '在跑'] });
  assert.equal(Object.keys(RUN_LOOK).length, 7);
  assert.match(html, /<span class="cp-run-title">示例活 running<\/span><small class="cp-run-meta">Claude Opus 5.5 · 示例说明 running · \+2 个帮手<\/small>/);
  // 没给型号显示名时退回“GPT”；不出型号代号和字段名
  assert.match(html, /示例 Codex 对话<\/span><small class="cp-run-meta">GPT · 示例说明 unknown<\/small>/);
  assert.doesNotMatch(html, /claude-opus-5-5|conversation|示例缺口|high/);
  // 块放在“需要你”和“你得知道”之间
  const v2 = normalize(base({ need_you: [todo], ai_running: running([row('running')]), must_know: { state: 'ok', items: [{ id: 'k1', kind: 'repairing', text: '示例在修' }] } }));
  const h2 = REGIONS.overview(v2, ctx);
  assert.ok(h2.indexOf('cp-you') < h2.indexOf('id="ai-running"') && h2.indexOf('id="ai-running"') < h2.indexOf('class="cp-know"'));
  assert.match(html, /<span class="cp-run-sum">示例：AI 在跑 8 个，3 个卡住<\/span><span class="cp-run-at">15:39 读到的<\/span>/);
});

test('总览句加“AI 在跑 N 个（M 个卡住）”，M 为 0 不写括号；一个都没有时只一行“现在没有 AI 在跑”', () => {
  const stuck = normalize(base({ need_you: [todo], ai_running: running([row('running'), row('quota_exhausted'), row('running')]) }));
  assert.match(REGIONS.overview(stuck, ctx), /<p class="cp-you-n">.*<a class="cp-you-ai is-stuck" href="#ai-running">AI 在跑 3 个（1 个卡住）<\/a><\/p>/);
  const calm = normalize(base({ ai_running: running([row('running')]) }));
  const calmHtml = REGIONS.overview(calm, ctx);
  assert.match(calmHtml, /现在没有要你做的事<a class="cp-you-ai" href="#ai-running">AI 在跑 1 个<\/a>/);
  assert.equal(runLine({ count: 2, stuck_count: 0 }), 'AI 在跑 2 个');
  const none = REGIONS.overview(normalize(base({ need_you: [todo], ai_running: { count: 0, stuck_count: 0, summary: '', observed_at: at, rows: [] } })), ctx);
  assert.match(none, /<div class="cp-run is-empty" id="ai-running"><p class="cp-run-none"><span class="cp-run-k">AI 正在跑<\/span><span>现在没有 AI 在跑<\/span>/);
  assert.doesNotMatch(none, /cp-run-list/);
  assert.match(none, />没有 AI 在跑<\/a>/);
});

test('公开版：后端已把标题换成“一件 AI 活”、不给一句话，照显示，不另造文字', () => {
  const pub = { id: 'p1', status: 'running', vendor: 'claude', model_text: 'Claude Opus 5.5', title: '一件 AI 活', helpers: 0 };
  const html = REGIONS.overview(normalize(base({ viewer: { kind: 'public', device_state: 'none' }, ai_running: running([pub]) })), ctx);
  assert.match(html, /<span class="cp-run-title">一件 AI 活<\/span><small class="cp-run-meta">Claude Opus 5.5<\/small><\/li>/);
  // 读不到电脑时淡下去，写明是几点读到的
  const off = REGIONS.overview(normalize(base({ ai_running: running([pub]) })), { ...ctx, offline: true });
  assert.match(off, /<div class="cp-run is-off" id="ai-running">.*读不到电脑，这是 15:39 读到的/);
});

test('你得知道收拢：16 行合成 4 行，AI 在修排最前；已恢复、AI 已定各一行，汇报只露第一句', () => {
  const recovered = ['示例费用', '示例原话补漏', '示例流量记录', '示例内存记录', '示例手机数据'].map((n, i) => ({ id: `recovered:t${i}`, kind: 'recovered', text: `${n}已恢复，AI 已核对最近一次成功。`, at: `2026-10-2${i + 4}T12:00:00+08:00`, exit_when: '确认恢复满 3 天后收起' }));
  const decisions = [
    { id: 'd0', kind: 'ai_decision', text: '示例备份盘同步与恢复验收：限期到 2026-10-31 18:30（北京时间）；周治理：示例组 warning/example_code，其它组完成。', decision_due_at: '2026-10-31T18:30:00+08:00', at },
    { id: 'd1', kind: 'ai_decision', text: '示例故障由 AI 根治：示例驱动，减少卡顿：限期到 2026-11-05 21:00（北京时间）；已满14天。', at },
    { id: 'd2', kind: 'ai_decision', text: '示例高内存占用：结束；守护持续正常。', at },
    ...Array.from({ length: 6 }, (_, i) => ({ id: `d${i + 3}`, kind: 'ai_decision', text: `示例决定 ${i}：结束；示例依据。`, at })),
  ];
  const report = { id: 'task-result:gov', kind: 'report', text: '每周体检这次没有完成，未关47增至57，AI跟40增至45……', at, exit_when: '结果记录满 3 天后收起' };
  const repairing = { id: 'pending-net', kind: 'repairing', text: '示例两台电脑上网偶尔断开，原因还没查清。', at, exit_when: 'AI 核实解决后转为已恢复，3 天后收起' };
  const v = normalize(base({ must_know: { state: 'ok', items: [...recovered, ...decisions, report, repairing], archived_items: [] } }));
  const html = REGIONS.overview(v, ctx);
  const top = [...html.matchAll(/<ul class="cp-know-list">(.*)<\/ul><\/div>/g)][0]?.[1] || '';
  const rows = [...top.matchAll(/<li id="(know-[\w:-]+)" class="([^"]+)">(?:<span class="cp-know-tag[^>]*>[^<]*<\/span>)/g)].map((m) => m[1]);
  assert.deepEqual(rows, ['know-pending-net', 'know-task-resultgov', 'know-recovered', 'know-decisions']);
  assert.doesNotMatch(html, /cp-know-rest/);
  assert.match(html, /<summary>后台 5 项功能中断过，现在都恢复了<\/summary><ul class="cp-know-sub"><li id="know-recoveredt0"><span>示例费用<\/span><small>10月24日 12:00 确认恢复<\/small>/);
  assert.match(html, /<summary>AI 自己定了 9 件技术问题<\/summary>/);
  assert.match(html, /<span class="cp-know-dec-topic">示例备份盘同步与恢复验收<\/span><span class="cp-know-dec-what">AI 定：限期到 10月31日 18:30<\/span><span class="cp-know-dec-why">依据：周治理：示例组 warning\/example_code，其它组完成<\/span>/);
  assert.match(html, /<span class="cp-know-dec-topic">示例故障由 AI 根治：示例驱动，减少卡顿<\/span><span class="cp-know-dec-what">AI 定：限期到 11月5日 21:00<\/span>/);
  assert.match(html, /<span class="cp-know-dec-topic">示例高内存占用<\/span><span class="cp-know-dec-what">AI 定：不再跟进，这条结束<\/span>/);
  assert.equal((html.match(/>复制给 AI<\/button>/g) || []).length, 9);
  assert.match(html, /<details class="cp-know-fold" id="know-task-resultgov-open"><summary>每周体检这次没有完成<\/summary><div class="cp-know-sub"><p>未关47增至57，AI跟40增至45……<\/p>/);
  // 每个折叠都带 id，每分钟换字时保持展开
  for (const id of ['know-recovered-open', 'know-decisions-open', 'know-task-resultgov-open']) assert.ok(html.includes(`id="${id}"`), id);
  assert.deepEqual(firstSentence({ text: '示例汇报 0' }), ['示例汇报 0', '']);
  assert.deepEqual(firstSentence({ text: '短句，后面' }), ['短句，后面', '']);
  // 只有一条已恢复时不合并，照原样一行
  const one = REGIONS.overview(normalize(base({ must_know: { state: 'ok', items: [recovered[0]] } })), ctx);
  assert.match(one, /<li id="know-recoveredt0" class="is-recovered"><span class="cp-know-tag is-green">已恢复<\/span><span class="cp-know-text">示例费用已恢复/);
  // 同一项恢复过两次算一项
  const twice = REGIONS.overview(normalize(base({ must_know: { state: 'ok', items: [recovered[3], { ...recovered[3], id: 'recovered:again', at: '2026-10-28T12:00:00+08:00' }, recovered[4]] } })), ctx);
  assert.match(twice, /后台 2 项功能中断过，现在都恢复了.*示例内存记录（中断过 2 次）<\/span><small>10月28日 12:00 确认恢复/);
});

test('合完还超过 5 行：露前 4 行（AI 在修和影响你的事在前），其余折成“其余 N 条”', () => {
  const items = [
    ...Array.from({ length: 3 }, (_, i) => ({ id: `r${i}`, kind: 'report', text: `示例汇报 ${i}` })),
    { id: 'x1', kind: 'done', text: '示例：你交的活做完了' },
    { id: 'rec1', kind: 'recovered', text: '示例甲已恢复。' }, { id: 'rec2', kind: 'recovered', text: '示例乙已恢复。' },
    { id: 'dec1', kind: 'ai_decision', text: '示例决定：结束；示例依据。' },
    { id: 'fix1', kind: 'repairing', text: '示例在修' },
  ];
  const html = REGIONS.overview(normalize(base({ must_know: { state: 'ok', items } })), ctx);
  const main = /<p class="cp-know-k">你得知道<\/p><ul class="cp-know-list">(.*?)<\/ul><details class="cp-know-rest"/.exec(html)?.[1] || '';
  assert.deepEqual([...main.matchAll(/<li id="(know-\w+)"/g)].map((m) => m[1]), ['know-fix1', 'know-x1', 'know-r0', 'know-r1']);
  assert.match(html, /<details class="cp-know-rest" id="know-rest"><summary>其余 3 条<\/summary><ul class="cp-know-list"><li id="know-r2"/);
  assert.match(html, /id="know-rest">.*后台 2 项功能中断过.*AI 自己定了 1 件技术问题/);
});

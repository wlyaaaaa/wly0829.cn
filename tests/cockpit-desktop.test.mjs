// 驾驶舱第四步：电脑版（宽度 ≥1200）首屏。顶栏一行、左栏“要你做 N 件”队列（一行一件、展开一件）、右栏固定、卡上的“打开”组。
// 窄屏不变由样式保证（新加的外框窄屏上 display: contents / none），这里测画出来的结构和规则。全部数据虚构
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page, openGroup, Q_KEY } from '../site-astro/src/cockpit/render.js';

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
    targets: [{ key: 'conversation', label: '打开对话' }, { key: 'folder', label: '打开文件夹「示例」' }] } };
  const viewer = (machine, kind = 'pc', capabilities = ['open', 'report']) => normalize(base({ viewer: { kind: 'owner', device_kind: kind, device_machine: machine, capabilities } })).viewer;
  assert.equal(openGroup({ id: 'w1' }, viewer('主驾驶')), '');
  const here = openGroup(x, viewer('主驾驶'));
  assert.match(here, /<a class="cp-open-a" href="claude:\/\/code\/continue\?session=local_demo">打开对话 ↗<\/a>/);
  assert.match(here, /data-report="w1">看汇报</);
  assert.match(here, /data-open-item="w1" data-open-target="folder">打开文件夹「示例」</);
  const there = openGroup(x, viewer('副驾驶'));
  assert.doesNotMatch(there, /claude:\/\//);
  assert.match(there, /data-open-target="conversation">在主驾驶上打开对话</);
  assert.match(there, /data-open-target="folder">在主驾驶上打开文件夹「示例」</);
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

test('“AI 正在跑”的行：有 doing 主行写“正在做：……”和第几步，第二行进展 · 型号 · 多久前还在动，标题降成灰色标签；没有 doing 用进展那句；两样都没有才用标题', () => {
  const run = (rows, extra = {}) => normalize(base({ ai_running: { count: rows.length, observed_at: at, rows, ...extra } }));
  const html = REGIONS.home(run([
    { id: 'r1', status: 'running', vendor: 'claude', model_text: 'Claude Opus 5.5', title: '示例旧标题', doing: '改左栏队列的样式', step_index: 3, step_total: 8,
      progress: { text: '队列的行已经画好', at: '2026-10-29T21:36:00+08:00' } },
    { id: 'r2', status: 'running', vendor: 'gpt', model_text: 'GPT Sol', title: 'task_rename_v2', progress: '核对完 312 个文件', last_activity_at: '2026-10-29T19:40:00+08:00' },
    { id: 'r3', status: 'running', vendor: 'gpt', model_text: 'GPT Sol', title: '只有标题的活' },
  ]), ctx(acts()));
  const row = (id) => new RegExp(`<li class="cp-run-row[^"]*"[^>]*data-items="${id}">(.*?)</li>`).exec(html)?.[1] || '';
  assert.match(row('r1'), /<span class="cp-run-doing">正在做：改左栏队列的样式<\/span><small class="cp-run-step">第 3 步\/共 8 步<\/small><small class="cp-run-meta"><span class="cp-run-name">示例旧标题<\/span>队列的行已经画好 · Claude Opus 5.5 · 4 分钟前还在动<\/small>/);
  assert.match(row('r2'), /<span class="cp-run-doing">核对完 312 个文件<\/span><small class="cp-run-meta"><span class="cp-run-name">task_rename_v2<\/span>GPT Sol · 2 小时前还在动<\/small>/);
  assert.match(row('r3'), /<span class="cp-run-title">只有标题的活<\/span>/);
  assert.doesNotMatch(row('r3'), /cp-run-doing|还在动/);
  // 停了没做完、早就停了：末尾一行小字（停了的行已经列出来时不重复数）
  assert.match(REGIONS.home(run([{ id: 'r4', status: 'running', title: '示例' }], { stopped_count: 2, stale_count: 3 }), ctx(acts())), /<p class="cp-run-stale">另有 2 件停了，没做完、3 件早就停了<\/p>/);
  assert.match(REGIONS.home(run([{ id: 'r5', status: 'stopped', title: '示例' }], { stopped_count: 1 }), ctx(acts())), /停了，没做完/);
  assert.doesNotMatch(REGIONS.home(run([{ id: 'r5', status: 'stopped', title: '示例' }], { stopped_count: 1 }), ctx(acts())), /另有 1 件停了/);
});

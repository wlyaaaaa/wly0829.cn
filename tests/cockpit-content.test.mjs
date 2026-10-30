// 内容回归只使用虚构数据，不读取线上接口或真实私人事项。
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page, needCount } from '../site-astro/src/cockpit/render.js';
const now = new Date('2026-10-30T10:00:00+08:00'), at = '2026-10-30T09:59:00+08:00';
const ctx = { now, phase: 'live', offline: false, ov: { stale: () => false, lamp: () => '' }, projectUrls: {} };
const view = (extra = {}, kind = 'owner') => normalize({ schema: 'pcconfig.cockpit-view.v1', served_at: at, viewer: { kind, capabilities: ['open'], device_machine: '副驾驶', device_kind: 'phone' }, ...extra });
const visible = (h) => h.replace(/<[^>]*>/g, '');
const copyOf = (h) => [...h.matchAll(/data-copy="([^"]*)"/g)].map((m) => m[1]).join('\n');

test('运行每行都有复制，打开对话在同一按钮行；最近动静优先真正活动，路径原文只进复制', () => {
  const source = { id: 'r1', status: 'running', title: '示例对话 E:\\示例\\项目', doing: '读取 E:\\示例\\原件.txt',
    progress: { text: '已保存到 E:\\示例\\输出.txt', at: '2026-10-30T08:00:00+08:00' }, last_activity_at: at,
    open: { conversation: { machine: '主驾驶', url: 'claude://example' }, targets: [{ key: 'conversation', label: '打开对话' }] } };
  const v = view({ ai_running: { count: 1, observed_at: at, rows: [source] } });
  const html = REGIONS.home(v, ctx), bar = /<div class="cp-oa-bar">([^]*?)<\/div>/.exec(html)?.[1] || '';
  assert.match(visible(html), /1 分钟前还在动/);
  assert.doesNotMatch(visible(html), /2 小时前还在动|E:\\/);
  assert.match(copyOf(html), /E:\\示例\\原件.txt/);
  assert.match(copyOf(html), /E:\\示例\\输出.txt/);
  assert.ok(bar.indexOf('在主驾驶上打开对话') >= 0 && bar.indexOf('data-copy=') > bar.indexOf('在主驾驶上打开对话'));
  assert.equal((html.match(/AI 正在干活/g) || []).length, 1);
});

test('真实早停明细可展开并逐条复制；只有数量不编出明细，公开版不显示早停任务', () => {
  const ai_running = { count: 0, observed_at: at, stale_count: 4, rows: [], stale_rows: [{ id: 'old', status: 'stopped', doing: '示例停止任务', title: '示例旧任务' }] };
  const own = REGIONS.home(view({ ai_running }), ctx);
  assert.match(own, /<details class="cp-run-stale" id="run-stale"><summary>另有 1 件已经停了<\/summary>/);
  assert.match(own, /示例停止任务/);
  assert.match(own, /data-copy=/);
  const pub = REGIONS.home(view({ ai_running }, 'public'), ctx);
  assert.doesNotMatch(pub, /示例停止任务|早就停了|cp-run-stale|data-copy/);
});

test('要你做的过去期限与急不急分开；乐观隐藏让卡、顶栏与标签件数一致，失败和撤回恢复', () => {
  const item = { id: 'n', title: '示例待办', urgent: false, due_at: '2026-10-29T09:00:00+08:00', owner_actions: ['ack', 'snooze'] };
  const v = view({ need_you: [item], verdict: { text: '要你做 1 件' }, overview: { owner_count: 1, owner_urgent: 0 } });
  assert.match(REGIONS.overview(v, ctx), /过了原定时间，但不急/);
  assert.match(REGIONS['need-you'](v, ctx), /class="cp-ask-why">过了原定时间，但不急/);
  for (const phase of ['sending', 'done']) {
    const cx = { ...ctx, act: { state: new Map([['n', { action: 'ack', phase }]]) } };
    assert.equal(needCount(v, now, cx), 0);
    assert.match(REGIONS.overview(v, cx), /现在没有要你做的事/);
  }
  for (const phase of ['error', 'undone']) assert.equal(needCount(v, now, { ...ctx, act: { state: new Map([['n', { action: 'ack', phase }]]) } }), 1);
  const future = view({ need_you: [{ ...item, due_at: '2026-11-02T09:00:00+08:00' }] });
  assert.doesNotMatch(REGIONS['need-you'](future, ctx), /过了原定时间/);
});

test('你得知道完整显示进展、下一步和时间；只给知道了与复制，标签按内容类型写', () => {
  const item = { id: 'k', kind: 'repairing', text: '示例间歇断网仍在排查。', progress: '已排除示例网卡和两端线路，继续检查链路上的重连。',
    next_step: '观察下一次断开并对照两端记录，确定是不是同一个触发点。', next_run_at: '2026-10-30T11:30:00+08:00', owner_actions: ['ack', 'snooze', 'redo', 'note'] };
  const html = REGIONS.home(view({ must_know: { state: 'ok', items: [item, { id: 'f', kind: 'new_feature', text: '示例新功能已可用。' }, { id: 'r', kind: 'report', text: '示例任务跑完了，没有查到结果。' }] } }), ctx);
  assert.match(html, /class="cp-know-progress">进展：已排除示例网卡和两端线路，继续检查链路上的重连。/);
  assert.match(html, /class="cp-know-next">下一步：观察下一次断开并对照两端记录，确定是不是同一个触发点。 · 10月30日 11:30/);
  for (const tag of ['在修', '新功能', '结果']) assert.ok(html.includes('">' + tag + '</span>'));
  assert.match(html, /data-act="ack"/);
  assert.doesNotMatch(html, /data-act="snooze"|data-act="redo"|data-act="note"|>汇报</);
  const pub = REGIONS.home(view({ must_know: { state: 'ok', items: [item] } }, 'public'), ctx);
  assert.doesNotMatch(pub, /data-copy|data-act/);
});

test('空待办保留刷新挂载点；有事和读不到时仍提供内容', () => {
  const empty = view({ need_you: [] });
  assert.equal(REGIONS['need-you'](empty, ctx), '<span class="cp-anchor" id="pending"></span>');
  assert.match(page(empty, ctx), /<div class="cp-need" id="need-you" data-cp="need-you"><span class="cp-anchor" id="pending"><\/span><\/div>/);
  const item = { id: 'later', title: '示例后来出现的事', owner_actions: ['snooze'] };
  assert.match(REGIONS['need-you'](view({ need_you: [item] }), ctx), /示例后来出现的事/);
  assert.equal(REGIONS['need-you'](view({ need_you: [item] }), { ...ctx, act: { state: new Map([['later', { action: 'snooze', phase: 'done' }]]) } }), '<span class="cp-anchor" id="pending"></span>');
  assert.match(REGIONS['need-you'](normalize({}), ctx), /还没读到/);
});

test('你得知道的正文、具体、进展与下一步重复时每句只显示一次，不丢补充和时间', () => {
  const progress = '已排除示例配置问题，继续检查连接记录。', next = '对照下一次断开的记录。';
  const count = (text, part) => text.split(part).length - 1;
  for (const kind of ['repairing', 'report', 'new_feature', 'just_completed']) {
    const item = { id: 'dedup', kind, text: '示例连接仍在核对，完整结论稍后给出。', owner_detail: `进展：${progress}下一步：${next}`,
      progress: { text: progress }, next_step: next, next_at: '2026-10-30T11:30:00+08:00' };
    const html = REGIONS.home(view({ must_know: { state: 'ok', items: [item] } }), ctx), text = visible(html);
    assert.equal(count(text, progress), 1, kind + ' progress');
    assert.equal(count(text, next), 1, kind + ' next');
    for (const label of ['进展：', '下一步：']) assert.equal(count(text, label), 1, kind + ' ' + label);
    assert.match(text, /10月30日 11:30/);
    const inBody = { ...item, text: `示例连接正在核对。进展：${progress}下一步：${next}10月30日 11:30`, owner_detail: `进展：${progress}`, progress: '进展：' + progress };
    const bodyHtml = REGIONS.home(view({ must_know: { state: 'ok', items: [inBody] } }), ctx), bodyText = visible(bodyHtml);
    for (const part of [progress, next, '10月30日 11:30']) assert.equal(count(bodyText, part), 1, kind + ' ' + part);
  }
  const long = '示例连接记录需要逐项核对，'.repeat(22) + '末尾结论要完整保留。';
  const full = REGIONS.home(view({ must_know: { state: 'ok', items: [{ id: 'long', kind: 'repairing', text: '示例主句。',
    owner_detail: '进展：' + long, latest_progress: long, next_step: next }] } }), ctx);
  assert.equal(count(visible(full), long), 1);
  assert.match(visible(full), /下一步：对照下一次断开的记录。/);
  const unique = REGIONS.home(view({ must_know: { state: 'ok', items: [{ id: 'unique', kind: 'repairing', text: '示例主句。',
    owner_detail: '独有的补充信息。', progress, next_step: next }] } }), ctx);
  for (const part of ['独有的补充信息。', progress, next]) assert.equal(count(visible(unique), part), 1);
});

test('状态格按整词标记且保留原始文字和转义', () => {
  const v = view({ overview: { signals: [{ id: 'backup', level: 'watch' }], reasons: [{ section: 'backup_cloud', text: '开发配置备份失败 <示例>', delta: -10 }] } });
  const html = REGIONS['overview-tri'](v, ctx);
  assert.match(html, /<span class="cp-status-word">失败<\/span>/);
  assert.match(visible(html), /开发配置备份失败 &lt;示例&gt;/);
  assert.doesNotMatch(html, /<示例>/);
});

test('旧临时目录回收一行说明，原数字和路径保存在详情及复制', () => {
  const text = '旧临时目录回收：示例清了 12 项，保留 3 项；明细在 E:\\示例\\回收.json。';
  const html = REGIONS.home(view({ must_know: { state: 'ok', items: [{ id: 'cleanup', kind: 'report', text }] } }), ctx);
  assert.match(html, /<summary>旧临时目录回收情况，展开看明细<\/summary>/);
  assert.ok(html.includes('<p>' + text + '</p>'));
  assert.ok(copyOf(html).includes(text));
});

test('电脑健康分写清只算电脑、自动任务和备份；备份失败第一行与顶部状态格为同一条', () => {
  const v = view({ overview: { score: 54, as_of: at, signals: [{ id: 'backup', level: 'watch', value: 1 }], reasons: [{ section: 'backup_cloud', text: '示例开发配置备份失败', delta: -10 }] },
    sections: { backup_cloud: [{ id: 'g', title: 'G盘备份', text: '示例正常', state: 'ok', observed_at: at }] } });
  const html = REGIONS['overview-tri'](v, ctx), backup = REGIONS.backup(v, ctx);
  assert.match(html, /cp-score-title[^]*?>电脑健康分<\/h2>/);
  assert.match(html, /cp-score-value hub-field-value">54<\/b><small>\/100/);
  assert.match(html, /<progress class="cp-score-meter" max="100" value="54"/);
  // 后端规则：你的事、AI 的事不扣电脑健康分；不能再写“算上你的事、AI 的事”
  assert.match(html, /只算电脑、自动任务和备份；你的事、AI 的事不扣分/);
  assert.doesNotMatch(html, /算上你的事|整体健康分/);
  assert.match(visible(html), /示例开发配置备份失败/);
  assert.match(backup, /id="backups"><\/span><p class="cp-line cp-backup-current">示例开发配置备份失败/);
  // 扣了 3 项备份：状态格第一行和备份区开头都写真实件数，不只写第一项
  const three = view({ overview: { score: 46, as_of: at, signals: [{ id: 'backup', level: 'act', value: 3, color: 'neutral' }],
    reasons: ['开发配置备份失败', '电脑使用与性能记录失败', '电脑配置与恢复失败'].map((text) => ({ section: 'backup_cloud', text, delta: -10 })) } });
  assert.match(visible(/data-signal="backup"[^]*?<b class="cp-tri-status">([^]*?)<\/b>/.exec(REGIONS['overview-tri'](three, ctx))?.[1] || ''), /^3 项备份失败（开发配置等）$/);
  assert.match(REGIONS.backup(three, ctx), /cp-backup-current">3 项备份失败（开发配置等）<\/p>/);
  assert.doesNotMatch(REGIONS['overview-tri'](view(), ctx), /<progress/);
  const normal = REGIONS['overview-tri'](view({ overview: { signals: [{ id: 'computer', level: 'ok' }, { id: 'backup', level: 'ok' }] } }), ctx);
  assert.doesNotMatch(normal, /cp-tri-short/);
  assert.match(normal, /cp-tri-status">[^]*?<span class="cp-status-word">正常<\/span><\/b>/);
});

test('跨日旧动态集中归位；读不到与数据停了分开，只显示一次同一时间', () => {
  const v = view({ sections: { today: [{ id: 'old', title: '示例旧进度', text: '示例进度超过 3 天没更新', observed_at: '2026-10-20T10:00:00+08:00' },
    { id: 'none', title: '示例未知来源', text: '这次没有读数', state: 'unavailable' }, { id: 'new', title: '示例今天', text: '今天新增一项', state: 'ok', observed_at: at }] } });
  const today = REGIONS.today(v, ctx), home = REGIONS.home(v, ctx);
  assert.doesNotMatch(today, /示例旧进度|示例未知来源/);
  assert.match(today, /示例今天/);
  // 本人 10-30 批准第 5 项：每样写清谁在管；停了满 3 天的不在首屏列，收在 AI 的账本“停了的数据”里
  assert.doesNotMatch(home, /示例旧进度/);
  assert.match(home, /另 1 样停了 3 天以上，在 AI 的账本里 ›/);
  assert.match(REGIONS.ledger(v, ctx), /示例旧进度<\/b><span>10\/20 起读不到，AI 在查（最后一次 10月20日 10:00）/);
  assert.match(home, /示例未知来源<\/b><span>今天还没读到新的<\/span>/);
  assert.equal((visible(home).match(/10月20日 10:00/g) || []).length, 0);
  assert.doesNotMatch(home, /已核实来源|来源检查通过/);
});

test('侧栏和工作区使用全站组件，同时保留全部动态分区与锚点', () => {
  const v = view({ need_you: [{ id: 'n', title: '示例待办' }], ai_running: { count: 1, rows: [{ id: 'r', status: 'running' }] },
    must_know: { state: 'ok', items: [{ id: 'k', kind: 'report', text: '示例结果' }] }, overview: { score: 54 } });
  const html = page(v, ctx), sidebar = /<aside class="cp-sidebar">([^]*?)<\/aside>/.exec(html)?.[1] || '';
  assert.match(html, /<section class="cp-dashboard c-text" id="top">/);
  for (const cls of ['cp-intro cp-hero-copy', 'cp-status c-hub-stats', 'cp-mobile-status-heading', 'cp-hero-art']) assert.ok(sidebar.includes(cls), cls);
  assert.doesNotMatch(sidebar, /data-cp="need-you"|data-cp="home"/);
  assert.match(html, /<div class="cp-workspace c-text"><div class="cp-need"/);
  assert.match(html, /cp-ask is-own ct-card/);
  assert.match(html, /cp-score hub-stat-field ct-card/);
  assert.equal((html.match(/class="cp-block-heading c-title-strip /g) || []).length, 10);
  assert.equal((html.match(/class="hub-leaf hub-leaf-l"/g) || []).length, 10);
  assert.equal((html.match(/class="hub-brush"/g) || []).length, 10);
  for (const region of ['overview', 'overview-tri', 'need-you', 'home', 'tasks', 'security', 'computer', 'backup', 'projects', 'today', 'today-date', 'viewer', 'meta', 'action-toast']) {
    assert.equal((html.match(new RegExp('data-cp="' + region + '"', 'g')) || []).length, 1, region);
  }
  for (const id of ['top', 'need-you', 'pending', 'ai-running', 'tasks', 'computer', 'today', 'backup', 'backups', 'projects']) assert.ok(html.includes('id="' + id + '"'), id);
});


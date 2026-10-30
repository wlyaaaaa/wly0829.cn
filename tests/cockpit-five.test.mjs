// 本人 10-30 11:44 批准的驾驶舱五项（健康分扣在哪、状态格谁在管、手机三行状态条、新出现的标“新”、收掉重复的字）：全部数据虚构。
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, page, scoreGroups } from '../site-astro/src/cockpit/render.js';

const now = new Date('2026-10-30T12:00:00+08:00'), at = '2026-10-30T11:59:30+08:00';
const ov = { stale: () => false, lamp: () => '' };
const ctx = (extra = {}) => ({ now, offline: false, phase: 'live', projectUrls: {}, img: {}, ov, ...extra });
const textOnly = (h) => h.replace(/<[^>]*>/g, '');
const sec = (color = 'neutral', extra = {}) => ({ level: 'act', word: '要处理', color, owner_action: 'none', owner_action_needed: false, ai_handling: color === 'neutral' ? 'AI 在管' : '', ...extra });
const overview = (extra = {}) => ({
  schema: 'overview.v1', score: 46, level: 'act', as_of: at, stale_after_seconds: 180,
  reasons: [
    { text: '今天你的自动任务尚未确认恢复 2 个', delta: -16, section: 'today' },
    { text: '示例甲备份失败', delta: -10, section: 'backup_cloud' },
    { text: '示例乙记录失败', delta: -10, section: 'backup_cloud' },
    { text: '示例丙配置失败', delta: -10, section: 'backup_cloud' },
    { text: '近 7 天 1 个任务反复出错', delta: -8, section: 'automation' },
  ],
  rules: [{ text: '示例规则一', delta: -8 }, { text: '示例规则二', delta: 0 }],
  signals: [{ id: 'computer', level: 'ok', color: 'ok' }, { id: 'today_tasks', level: 'act', value: 2, recovered_today: 1, color: 'neutral', ai_handling: 'AI 在管' },
    { id: 'backup', level: 'act', value: 3, color: 'neutral', ai_handling: 'AI 在管' }],
  sections: { today: sec(), backup_cloud: sec(), automation: sec(), computer: sec('ok', { level: 'ok' }), projects: sec('ok', { level: 'ok' }), need_you: sec('ok', { level: 'ok' }) },
  ...extra,
});
const view = (extra = {}) => normalize({ schema: 'pcconfig.cockpit-view.v1', served_at: at, overview: overview(), ...extra });

test('健康分：大数字下面直接写最大的几项扣分，点开每行写谁在管、修好能回到几分，点哪行跳到那块', () => {
  const groups = scoreGroups(overview());
  assert.deepEqual(groups.map((g) => [g.label, g.delta, g.anchor]), [['备份 3 项失败', -30, 'backup'], ['自动任务 2 个没恢复', -16, 'tasks'], ['近 7 天 1 个任务反复出错', -8, 'tasks']]);
  assert.deepEqual(groups[0].names, ['示例甲', '示例乙记录', '示例丙配置']);
  const html = REGIONS['overview-tri'](view(), ctx());
  const top = textOnly(/<span class="cp-score-top">([^]*?)<\/span><span class="cp-score-why/.exec(html)?.[1] || '');
  assert.equal(top, '备份 3 项失败 −30 · 自动任务 2 个没恢复 −16 · 近 7 天 1 个任务反复出错 −8 ›');
  assert.match(html, /<a class="cp-score-go" href="#backup">[^]*?−30<\/b><small class="cp-score-fix">AI 在修，不用你管 · 修好能回到 76 分<\/small>/);
  assert.match(html, /<a class="cp-score-go" href="#tasks">[^]*?自动任务 2 个没恢复[^]*?修好能回到 62 分/);
  assert.match(html, /全部修好是 100 分。/);
  assert.match(html, /<details class="cp-score-rules" id="score-rules"><summary>分数怎么算（2 条）<\/summary>/);
  // 扣分的数字不用红色：颜色只看要不要你出手
  assert.doesNotMatch(html, /cp-score-body"><div><h4>扣分的地方/);
  // 要你看的那块写“要你看”
  const mine = REGIONS['overview-tri'](view({ overview: overview({ sections: { ...overview().sections, backup_cloud: sec('yellow', { owner_action: 'do', owner_action_needed: true }) } }) }), ctx());
  assert.match(mine, /href="#backup">[^]*?<small class="cp-score-fix">要你看 · 修好能回到 76 分/);
  // 没有扣分：写“没有扣分的地方”，不出“全部修好”
  const full = REGIONS['overview-tri'](view({ overview: overview({ score: 100, reasons: [] }) }), ctx());
  assert.match(full, /<span class="cp-score-top">没有扣分的地方/);
  assert.doesNotMatch(full, /全部修好/);
});

test('健康分：读到时间和页面时间一样时不另写，旧 15 分钟以上才写几点读到', () => {
  assert.doesNotMatch(REGIONS['overview-tri'](view(), ctx()), /cp-score-why[^]*?读到/);
  const old = REGIONS['overview-tri'](view({ overview: overview({ as_of: '2026-10-30T11:30:00+08:00' }) }), ctx());
  assert.match(old, /<span class="cp-score-why hub-field-body">[^<]*<small>10月30日 11:30 读到<\/small>/);
});

test('状态四格：第二行小字写要不要你管；AI 在管的点用加深的蓝灰，和读不到的灰点分开', () => {
  const html = REGIONS['overview-tri'](view(), ctx());
  const who = (id) => textOnly(new RegExp(`data-signal="${id}"[^]*?<span class="cp-tri-who">([^]*?)</span></span>`).exec(html)?.[1] || '');
  assert.equal(who('backup'), 'AI 在修，不用你管');
  assert.equal(who('tasks'), 'AI 在修，不用你管');
  assert.equal(who('computer'), '不用你管');
  assert.match(html, /data-signal="backup"[^]*?<b class="cp-tri-status"><span class="cp-dot is-neutral"/);
  const mine = REGIONS['overview-tri'](view({ overview: overview({ signals: [{ id: 'computer', level: 'ok' }, { id: 'today_tasks', level: 'ok', value: 0 }, { id: 'backup', level: 'act', value: 1, owner_action: 'do' }] }) }), ctx());
  assert.match(mine, /data-signal="backup"[^]*?<span class="cp-tri-who"><span>要你看<\/span>/);
  const off = REGIONS['overview-tri'](view(), ctx({ ov: { stale: () => true, lamp: () => '' } }));
  assert.match(off, /data-signal="backup"[^]*?cp-dot is-gray[^]*?<span class="cp-tri-who"><span>上次 11:59 读到<\/span>/);
});

test('状态四格的样式：第二行不再藏起来，AI 在管的点比读不到的灰点深', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../site-astro/src/cockpit/cockpit.css', import.meta.url), 'utf8');
  const tail = css.slice(css.lastIndexOf('本人 10-30 批准第 2 项'));
  assert.match(tail, /\.cp-page \.cp-status \.cp-tri-who \{ display: block;/);
  assert.match(tail, /\.cp-page \.cp-dot\.is-neutral \{ background: #3f6b91; \}/);
});

test('手机三行状态条：要你做几件、AI 干活卡没卡住、电脑几分扣在哪，点哪行跳到哪块；电脑版不显示，插画挪到页尾', async () => {
  const need = [{ id: 'n1', card_type: 'task', title: '示例要你动手', ask_kind: 'action' }];
  const running = { count: 2, stuck_count: 0, observed_at: at, rows: [{ id: 'r1', status: 'running', title: '示例对话甲' }, { id: 'r2', status: 'running', title: '示例对话乙' }] };
  const rows = (h) => [...h.matchAll(/<(a|p) class="cp-strip-row"(?: href="#([^"]+)")?>([^]*?)<\/\1>/g)].map((m) => [m[2] || '', textOnly(m[3])]);
  assert.deepEqual(rows(REGIONS.strip(view({ need_you: need, ai_running: running }), ctx())), [
    ['need-you', '要你做 1 件，不急'], ['ai-running', 'AI 在干活 2 个，没卡住'], ['status', '电脑 46 分：备份 3 项失败，AI 在修']]);
  const stuck = { ...running, stuck_count: 1, rows: [{ id: 'r1', status: 'login_failed', stuck: true }, running.rows[1]] };
  assert.deepEqual(rows(REGIONS.strip(view({ ai_running: stuck, overview: overview({ score: 100, reasons: [] }) }), ctx())), [
    ['', '现在没有要你做的事'], ['ai-running', 'AI 在干活 2 个，1 个卡住，要你看'], ['status', '电脑 100 分：一切正常']]);
  assert.match(REGIONS.strip(view(), ctx({ ov: { stale: () => true, lamp: () => '' } })), /href="#status"><span class="cp-dot is-gray"[^>]*><\/span><span>电脑：读不到（上次 11:59）<\/span>/);
  const html = page(view({ need_you: need }), ctx());
  assert.ok(html.indexOf('data-cp="strip"') > html.indexOf('data-cp="overview"') && html.indexOf('data-cp="strip"') < html.indexOf('id="status"'));
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../site-astro/src/cockpit/cockpit.css', import.meta.url), 'utf8');
  const tail = css.slice(css.lastIndexOf('本人 10-30 批准第 3 项'));
  assert.match(tail, /^[^]*?\.cp-strip \{ display: none; \}\n[^]*?@media \(max-width: 1199\.98px\)/);
  assert.match(tail, /grid-template-areas: "intro" "need" "home" "status" "facts" "art";/);
});

test('AI 正在干活读不全：count、observed_at 都是 null、没带 gaps、没有行时写“读不全”，三行状态条也不写 0 个；旧快照有整数照旧', () => {
  const raw = { count: null, stopped_count: null, stale_count: null, stale_unknown_count: null, stuck_count: null, observed_at: null, summary: 'AI运行情况暂时读不全', rows: [] };
  const v = view({ ai_running: raw });
  assert.equal(v.ai_running.unread, true);
  assert.equal(v.ai_running.stale_count, null);
  assert.equal(v.ai_running.stuck_count, null);
  assert.equal(v.ai_running.stopped_count, null);
  assert.match(REGIONS.home(v, ctx()), /<h2 class="hub-heading[^"]*">AI 干活情况暂时读不全<\/h2>/);
  assert.doesNotMatch(REGIONS.home(v, ctx()), /现在没有 AI 在干活/);
  const s = REGIONS.strip(v, ctx());
  assert.match(s, /href="#ai-running"><span class="cp-dot is-gray"[^>]*><\/span><span>AI 干活情况暂时读不全<\/span>/);
  assert.doesNotMatch(s, /AI 在干活 0 个/);
  // 旧快照：有整数、有时间，照旧写原数
  const old = view({ ai_running: { count: 0, stale_count: 2, stuck_count: 0, observed_at: at, rows: [] } });
  assert.equal(old.ai_running.unread, false);
  assert.equal(old.ai_running.stale_count, 2);
  assert.match(REGIONS.home(old, ctx()), /现在没有 AI 在干活/);
});

test('收掉重复的字：分区说明句进“?”、正常和 AI 在管不挂标签、结果满 2 天收起、今天的动态不重复任务数', () => {
  const v = view({ must_know: { state: 'ok', items: [
    { id: 'k-old', kind: 'report', text: '示例旧结果，三天前的', at: '2026-10-27T10:00:00+08:00' },
    { id: 'k-new', kind: 'report', text: '示例新结果，今天的', at: '2026-10-30T10:00:00+08:00' },
    { id: 'k-fix', kind: 'repairing', text: '示例在修，三天前开始', at: '2026-10-27T10:00:00+08:00' }] },
    today_activity: { summary: { tasks_run: 46, backups_done: 2 }, timeline: [{ at, kind: 'backup', text: '示例备份完成', level: 'ok' }] } });
  const html = page(v, ctx({ ov: { stale: () => false, lamp: (s) => `<span class="ov-sec">${s?.word || ''}</span>` } }));
  assert.doesNotMatch(html, /<p>电脑自己在做的事，有没有按时做、做成没有。<\/p>/);
  assert.match(html, /<dl class="cp-keys cp-help-secs"><dt>自动任务<\/dt><dd>电脑自己在做的事/);
  assert.doesNotMatch(html, /ov-sec is-neutral|>AI 在管<\/span>/);
  const know = REGIONS.home(v, ctx());
  const top = know.slice(0, know.indexOf('id="know-old"'));
  assert.match(top, /示例新结果/);
  assert.match(top, /示例在修/);
  assert.doesNotMatch(top, /示例旧结果/);
  assert.match(know, /<summary>最近收起的 1 条<\/summary><p class="cp-know-note">结果满 2 天自动收到这里。<\/p>[^]*?示例旧结果/);
  const today = REGIONS.today(v, ctx());
  assert.match(today, /<summary>电脑后台今天做的事：完成 2 项备份，记了 1 件事<\/summary>/);
  assert.doesNotMatch(today, /跑了 46 个任务/);
});

test('停了的数据：后端没给处理方只写事实；给了 ai_handling 或 handler 在处理才写谁在管', () => {
  const card = (extra) => ({ id: 'traffic', title: '示例流量', text: '示例流量数据停在 10 月 29 日。', state: 'unavailable', observed_at: '2026-10-29T19:14:00+08:00', ...extra });
  const home = (c) => textOnly(REGIONS.home(view({ stale_summary: { text: '示例流量停了', ids: ['traffic'] }, sections: { computer: [c] } }), ctx()));
  assert.match(home(card()), /示例流量（10\/29 起读不到）/);
  assert.doesNotMatch(home(card()), /AI 在查/);
  assert.match(home(card({ ai_handling: 'AI 在修采集。' })), /示例流量（10\/29 起读不到，AI 在修采集）/);
  assert.match(home(card({ handler: { kind: 'running' } })), /示例流量（10\/29 起读不到，AI 在处理）/);
  assert.doesNotMatch(home(card({ handler: { kind: 'scheduled' } })), /AI 在处理/);
});

test('新出现的标“新”：只存编号和时间；第一次打开不标；新冒出、AI 关掉按上次比；顶上一句小字', async () => {
  const seen = await import('../site-astro/src/cockpit/seen.js');
  const v = view({ need_you: [{ id: 'n1', title: '示例甲' }, { id: 'n2', title: '示例乙' }], must_know: { state: 'ok', items: [{ id: 'k1', kind: 'report', text: '示例结果' }, { id: 'd1', kind: 'ai_decision', text: '示例：结束' }] },
    ai_following: [{ id: 'f1', title: '示例跟进' }], ai_running: { count: 1, observed_at: at, rows: [{ id: 'r1', status: 'running' }] } });
  assert.deepEqual(seen.trackedIds(v, 'home'), ['n1', 'n2', 'k1']);
  assert.deepEqual(seen.trackedIds(v, 'ledger'), ['f1', 'd1']);
  // 存的只有编号和时间，没有标题正文
  const raw = seen.serializeSeen(1000, ['n1', 'k1']);
  assert.deepEqual(JSON.parse(raw), { v: 1, at: 1000, ids: ['n1', 'k1'] });
  assert.doesNotMatch(raw, /示例/);
  assert.equal(seen.parseSeen('坏数据'), null);
  // 第一次打开（没存过）不标
  assert.deepEqual(seen.compare(null, ['n1']), { fresh: [], closed: 0 });
  const prev = seen.parseSeen(seen.serializeSeen(Date.parse('2026-10-29T23:10:00+08:00'), ['n1', 'old1', 'old2']));
  const c = seen.compare(prev, seen.trackedIds(v, 'home'));
  assert.deepEqual(c, { fresh: ['n2', 'k1'], closed: 2 });
  assert.equal(seen.sinceText({ at: prev.at, fresh: 2, closed: 2 }, now), '你上次 10月29日 23:10 来过，之后新冒出 2 件、AI 关掉 2 件');
  assert.equal(seen.sinceText({ at: Date.parse('2026-10-30T09:05:00+08:00'), fresh: 1, closed: 0 }, now), '你上次 09:05 来过，之后新冒出 1 件');
  assert.equal(seen.sinceText({ at: prev.at, fresh: 0, closed: 0 }, now), '');
  // 页面上：ctx.since 有变化才写那一句
  assert.match(REGIONS.overview(v, ctx({ since: { at: prev.at, fresh: 2, closed: 2 } })), /<p class="cp-since">你上次 10月29日 23:10 来过，之后新冒出 2 件、AI 关掉 2 件<\/p>/);
  assert.doesNotMatch(REGIONS.overview(v, ctx()), /cp-since/);
  assert.match(REGIONS.ledger(v, ctx({ since: { at: prev.at, fresh: 1, closed: 0 } })), /<p class="cp-since">你上次 10月29日 23:10 来过，之后新冒出 1 件<\/p>/);
  // 小绿点：按编号生成样式（行和卡都认 data-items，账本表格行认 data-ids），没有新的就是空
  const css = seen.newCss(['n2', 'a"b']);
  assert.match(css, /\[data-items~="n2"\]/);
  assert.match(css, /\[data-ids~="a\\"b"\]/);
  assert.match(css, /content: "新"/);
  assert.equal(seen.newCss([]), '');
  assert.match(REGIONS.ledger(normalize({ schema: 'pcconfig.cockpit-view.v1', served_at: at, viewer: { kind: 'owner' }, ai_following: [{ id: 'f1', title: '示例跟进' }] }), ctx()), /<tr class="is-ok"[^>]*data-ids="f1"/);
});

test('账本件数对齐：筛选按钮和总句同一个数，合并的同类私人事项、说明还没写全的照样计数并在末尾写明', () => {
  const ph = (id) => ({ id, title: '一件私人 AI 活', placeholder: true });
  const following = [{ id: 'a', title: '示例甲', overdue_days: 2, overdue_since: '2026-10-28T10:00:00+08:00' }, { id: 'b', title: '说明还不全' }, ph('p1'), ph('p2'), ph('p3'), { id: 'c', title: '示例丙' }];
  const v = normalize({ schema: 'pcconfig.cockpit-view.v1', served_at: at, viewer: { kind: 'public' }, ai_following: following, ai_overdue: [following[0]],
    counts: { ai_following: 6 }, ai_ledger_summary: { text: 'AI 待处理还有 6 件事，1 件比它自己定的日子晚了（不用你管）。', open: 6, late: 1 } });
  const html = REGIONS.ledger(v, ctx());
  assert.match(html, /data-lshow="all" aria-pressed="true">全部 6<[^]*?data-lshow="late" aria-pressed="false">晚了 1<[^]*?data-lshow="ok" aria-pressed="false">没晚 5</);
  assert.match(html, /AI 待处理还有 6 件事/);
  assert.match(html, /<p class="cp-lt-more">另有 3 件没单列（2 件同类私人事项，合在上面同名那行；1 件说明还没写全，AI 会补上）<\/p>/);
  assert.match(html, /<summary>其余 5 件/);
  // 首页那行和账本页总句同一句
  assert.match(REGIONS.home(v, ctx()), /<a class="cp-go" href="\/cockpit\/ai\/">AI 待处理还有 6 件事/);
});

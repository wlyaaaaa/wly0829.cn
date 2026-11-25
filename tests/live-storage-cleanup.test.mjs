import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const GiB = 2 ** 30;
function load(document = { getElementById: () => ({ addEventListener() {} }) }) {
  const fmt = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const window = { LiveUI: { sp: s => String(s ?? ''), fieldText: s => typeof s === 'string' || Number.isFinite(s) ? String(s) : '', esc: s => String(s ?? ''), time: s => fmt.format(new Date(s)), date: s => s.slice(5, 10) }, LiveChart: { hues: {} } };
  const context = vm.createContext({ window, document, Intl, Date, Math, JSON, Number, String, Array, Set, Map });
  for (const file of ['kit.js', 'cleanup.js', 'draw10.js', 'disks.js']) vm.runInContext(readFileSync(new URL(`../site-v2/live/storage/${file}`, import.meta.url), 'utf8'), context);
  if (document.getElementById('category-growth')) {
    vm.runInContext(readFileSync(new URL('../site-v2/live/storage/growth.js', import.meta.url), 'utf8'), context);
  }
  return window;
}
test('存储占位优先读结构化标记，旧用语作为普通文本', () => {
  const { StorageKit: K } = load();
  const record = { content_locked: true, value: '原始标题' };
  assert.equal(K.field(record, '标题', 'public'), '标题仅本人可见');
  assert.equal(K.field(record, '标题', 'owner'), '原始标题');
  assert.equal(K.field('分类名称仅本人可见', '分类', 'public'), '分类名称仅本人可见');
  assert.equal(K.field('仅本人可见', '分类名称', 'public'), '分类名称仅本人可见');
  assert.equal(K.field('分类名称仅本人可见', '分类', 'owner'), '');
  assert.equal(K.field('可信设备可见', '标题', 'public'), '可信设备可见');
  assert.equal(K.field('正在换说法', '标题', 'public'), '正在换说法');
  const legacy = { value: '实际原字', visibility: 'owner', hidden: true };
  assert.equal(K.field(legacy, '标题', 'public'), '实际原字');
  assert.equal(K.splitRows([legacy], 'public').hidden, 0);
  assert.equal(K.splitRows([record, {}], 'public').hidden, 1);
  assert.equal(K.splitRows([record, {}], 'owner').visible.length, 2);
});

test('逐盘本人版列出全部用途，公开版不再合成“另有 N 条……仅本人可见”（新私事规则 11-24）', () => {
  const elements = new Map(['disks', 'disks-note', 'disks-foot'].map(id => [id, { querySelectorAll: () => [] }]));
  const { StorageDisks: disks } = load({ getElementById: id => elements.get(id) });
  const categories = Array.from({ length: 12 }, (_, i) => ({ label: `用途项 ${i + 1}`, bytes: (15 - i) * GiB }));
  categories.push({ content_locked: true, label: '不可给访客的用途原名', bytes: GiB });
  categories.push({ label: '用途名称仅本人可见', bytes: GiB });
  const data = { volumes: [{ id: 'E:', total: 600 * GiB, free: 200 * GiB, directories: [], categories }] };
  disks.render(data, 'owner');
  const owner = elements.get('disks').innerHTML;
  assert.match(owner, /用途项 12/);
  assert.match(owner, /不可给访客的用途原名/);
  assert.doesNotMatch(owner, /还有 \d+ 条|仅本人可见|🔒/);
  disks.render(data, 'public');
  const publicHtml = elements.get('disks').innerHTML;
  assert.doesNotMatch(publicHtml, /另有 \d+ 条/);
  assert.match(publicHtml, /用途名称仅本人可见/);
  assert.doesNotMatch(publicHtml, /不可给访客的用途原名/);
});

test('每日净增用同一盘的相邻北京时间日期补值，缺日不跨过', () => {
  const { StorageGrowth: G } = load();
  const day = n => Date.parse(`2026-11-${n}T20:00:00+08:00`) / 1000;
  const volume = { id: 'C:', space_history: { points: [[day(19), 200 * GiB], [day(20), 190 * GiB], [day(22), 160 * GiB]] } };
  const item = { days: [{ date: '2026-11-20' }, { date: '2026-11-21' }, { date: '2026-11-22' }, { date: '2026-11-23', growth: 0 }] };
  const rows = G.growthDays(item, volume);
  assert.equal(rows[0].growth, 10 * GiB);
  assert.equal(rows[0].fromFree, true);
  assert.equal(rows[1].gap, '缺当天的空闲读数');
  assert.equal(rows[2].gap, '缺前一天的空闲读数');
  assert.equal(rows[3].growth, 0);
});

test('合计缺失时从 G、H 盘补恢复包大小，只读到一块写下界', () => {
  const { StorageGrowth: G } = load();
  const item = { id: 'recovery_versions', bytes: null };
  const disk = (id, bytes) => ({ id, categories: [{ id: item.id, bytes, complete: true }] });
  const partial = G.supplementUsage(item, [disk('H:', 303104)]);
  assert.equal(partial.bytes, 303104);
  assert.equal(partial.complete, false);
  const both = G.supplementUsage(item, [disk('G:', 131072), disk('H:', 303104)]);
  assert.equal(both.bytes, 434176);
  assert.equal(both.complete, true);
  assert.equal(G.supplementUsage({ ...item, bytes: 0 }, [disk('H:', 303104)]).bytes, 0);
  const category = { id: 'claude_conversations', bytes: null };
  const measured = { id: category.id, bytes: GiB, complete: true };
  const known = G.supplementUsage(category, [
    { id: 'E:', categories: [measured] }, { id: 'V:', categories: [measured] },
    { id: 'C:', categories: [{ ...measured, content_locked: true }] },
  ], 'public');
  assert.equal(known.bytes, GiB);
  assert.equal(known.complete, false);
});

test('走势图悬停只显示指向日期真实测过的余量', () => {
  const { StorageCleanup: C, StorageKit: K } = load();
  const today = Date.parse('2026-11-22T02:00:00+08:00');
  const data = { series: [{ id:'E', pts: [[today, 400 * GiB], [today + 3600000, 450 * GiB]] }] };
  assert.equal(C.trendReading(data, today + 2700000)[0].point[1], 450 * GiB);
  assert.equal(C.trendReading(data, today - K.DAY).length, 0);
  assert.equal(K.tone({ level: 'yellow' }, { days: 85 }), 'green');
});

const run = (hoursAgo, extra = {}) => {
  const end = new Date(Date.now() - hoursAgo * 3600000);
  return { started_at: new Date(end - 600000).toISOString(), finished_at: end.toISOString(), result: 'ok', freed_bytes: 10 * GiB, protected_deleted: 0, ...extra };
};

test('存储容量和走势图都按 1024 进制写 Windows 单位', () => {
  const { StorageKit: K, StorageCleanup: C } = load();
  assert.equal(K.size(1_073_741_824), '1 GB');
  assert.equal(K.size(0.8 * GiB), '819 MB');
  assert.equal(K.size(2 ** 19), '512 KB');
  assert.equal(K.size(2 ** 20), '1 MB');
  assert.equal(K.size(1010 * GiB), '1010 GB');
  assert.equal(K.size(1024 * GiB - 1), '1023 GB');
  assert.equal(K.size(1024 * GiB), '1 TB');
  assert.equal(K.size(1076 * GiB), '1.05 TB');
  assert.equal(C.ticks(1000 * GiB).list.at(-1).text, '1000 GB');
  assert.ok(C.ticks(GiB / 2).list.some(t => t.text === '400 MB'));
  assert.ok(C.ticks(GiB * 1.3 * 1024).list.some(t => t.text === '512 GB'));
});

test('云盘用原始字节重算，旧摘要的十进制余量不会重复显示', () => {
  const { StorageDraw10: C } = load();
  const html = C.cloud({
    google_drive: { free_bytes: 2 ** 40, used_bytes: 0.8 * GiB, days_until_full: 20, text: 'Google 云盘还剩 1.10 TB，约 20 天满' },
    aliyun_oss: { used_bytes: 1_073_741_824 },
  }, 'owner');
  // 每段数字包在各自的 <span> 里，先去掉标签再比页面上读到的那句话。
  assert.match(html.replace(/<[^>]+>/g, ''), /剩余 1 TB · 已用 819 MB · 约 20 天满/);
  assert.match(html, /阿里云对象存储.*已用 1 GB/);
  assert.doesNotMatch(html, /1\.10 TB/);
  assert.match(C.billing({ days_remaining_rounded: 587 }, 'owner'), /阿里云账户可用余额估计还能用 587 天/);
});

test('自动清理回执：近 7 天合计、页首轻重顺序', () => {
  const { StorageCleanup: C } = load();
  const runs = [run(1, { freed_bytes: 600 * GiB }), run(7), run(13), run(24 * 8)];
  const g = C.digest({ cleanup: { interval_hours: 6, runs } });
  assert.equal(g.total, 620 * GiB);
  assert.equal(g.week.length, 3);
  assert.equal(C.alarm({ cleanup: { runs } }), null);
  assert.equal(C.alarm({ cleanup: { runs: [run(1, { result: 'error', error: '磁盘忙' }), ...runs] } }).tone, 'amber');
  assert.equal(C.alarm({ cleanup: { runs: [run(1, { result: 'error' }), run(2, { protected_deleted: 2 })] } }).tone, 'red');
  assert.match(C.alarm({ cleanup: { interval_hours: 6, runs: [run(20)] } }).text, /没按时跑/);
  assert.equal(C.digest({}), null);
});

test('多久满：按近 14 天空闲的实际变化算，60 天内会满才写天数', () => {
  const { StorageKit: K } = load();
  const DAY = 86400, end = Date.parse('2026-11-22T00:00:00+08:00') / 1000;
  const history = (freeAt) => ({ points: Array.from({ length: 21 }, (_, i) => [end - (20 - i) * DAY, freeAt(20 - i)]) });
  const at = new Date(end * 1000).toISOString();
  // 空闲每天少 10 GB，还剩 200 GB：约 20 天满（后台的 days_to_full 不再用）
  const shrinking = { total: 1000 * GiB, free: 200 * GiB, at, days_to_full: 500, space_history: history(d => (200 + d * 10) * GiB) };
  assert.equal(K.outlook(shrinking), '约 20 天满');
  // 中间腾出过一大块，14 天里空闲净增：60 天内不会满
  const cleaned = { total: 3000 * GiB, free: 987 * GiB, at, space_history: history(d => (d < 1 ? 987 : 400 + d * 5) * GiB) };
  assert.equal(K.outlook(cleaned), '60 天内不会满');
  // 只有两天读数：数据还不够预测
  assert.equal(K.outlook({ total: 322 * GiB, free: 298 * GiB, at, space_history: { points: [[end - DAY, 300 * GiB], [end, 299 * GiB]] } }), '数据还不够预测');
  assert.equal(K.outlook({ state: 'offline' }), '离线');
  const finish = end * 1000 + 3600000;
  const data = { volumes: [shrinking], cleanup: { runs: [{
    started_at: at, finished_at: new Date(finish).toISOString(),
    volumes: [{ id: 'C:', free_before: 200 * GiB, free_after: 600 * GiB }],
  }] } };
  shrinking.id = 'C:';
  const forecast = K.forecast(shrinking, data), chart = load().StorageCleanup.trendData(data, null, finish);
  assert.equal(forecast.end[1], 600 * GiB);
  assert.equal(chart.series[0].pts.at(-1)[1], forecast.end[1]);
});

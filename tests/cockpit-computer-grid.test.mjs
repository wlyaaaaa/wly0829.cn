// 驾驶舱“电脑”分区网格卡和横幅左边那一组（本人北京时间 2026-10-31 选定 A 版，同日改成 3×3 按组排）：全部数据虚构。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { computer } from '../site-astro/src/cockpit/render.js';

const now = new Date('2026-10-31T03:00:00+08:00'), at = '2026-10-31T02:59:00+08:00';
const ctx = { now, offline: false, phase: 'live', projectUrls: {}, img: {} };
const css = readFileSync(new URL('../site-astro/src/cockpit/cockpit.css', import.meta.url), 'utf8');
const pc = (t) => ({ state: 'ok', color: 'ok', observed_at: at, ...t });
const GB = 2 ** 30;
const cats = (...extra) => [{ id: 'ai_cache_total', label: '虚构合计', bytes: null, partial_bytes: 200 * GB, complete: false, budget_bytes: 300 * GB, alert: 'measurement_incomplete' },
  { id: 'claude_temp', bytes: 100 * GB, complete: true, alert: null }, { id: 'codex_temp', bytes: null, partial_bytes: 30 * GB, complete: false, alert: 'measurement_incomplete' }, ...extra];
const view = (extra = {}) => normalize({
  schema: 'pcconfig.cockpit-view.v1', served_at: at,
  sections: {
    computer: [pc({ id: 'computer_health', title: '处理器', text: '电脑读数：处理器 29%，66.6℃' }), pc({ id: 'system_resources', title: '内存/系统资源', text: '内存/系统资源正常' }),
      pc({ id: 'disk_space', title: '磁盘余量', text: '磁盘够用：最紧的是 C 盘还剩 83.6 GiB（13.9%）。' }),
      pc({ id: 'traffic', title: '套餐流量', text: '套餐已用 521.1/604.7 GB，剩余 83.6 GB（虚构缓存）' }),
      pc({ id: 'proxy_traffic', title: '本机代理流量', text: '今天上网 5.1 GB，近 60 分钟 2.9 GB。没超提醒线。按代理内核累计计算。' }),
      pc({ id: 'temp_reclaim', title: '旧临时目录回收', text: '今天 00:19 把 200 个闲置满 7 天的虚构目录（约 2.3 GB）放进回收站，之后由回收站清理清掉。' })],
    remote: [pc({ id: 'remote', title: '远程连接', text: '此刻能连上；间歇断开还在查。', must_know_id: 'pending-net' })],
  },
  laptop: { state: 'attention', connection: 'online' },
  storage_pressure: { state: 'warn', observed_at: at, max_age_seconds: 50400, categories: cats() },
  grafana: { links: [{ id: 'cpu-gpu', label: 'CPU 和显卡', url: 'https://example.invalid/a' }, { id: 'memory-network', label: '内存和网络', url: 'https://example.invalid/b' }, { id: 'overview', label: '总览', url: 'https://example.invalid/c' }], url: 'https://example.invalid/' },
  ...extra,
});
const cells = (h) => [...h.matchAll(/<article class="cp-card is-(\w+)[^"]*cp-tile"[^>]*><h3>.*?<\/span>(.*?)<\/h3><p class="cp-big">(.*?)<\/p>|<div class="cp-tile-gap"/g)].map((m) => (m[2] ? [m[2], m[3].replace(/<[^>]*>/g, ''), m[1]] : '空'));

test('电脑区：9 张数据卡按组排成 3×3，大数字从原句里取，Grafana 三张单独一排', () => {
  const h = computer(view(), ctx);
  assert.deepEqual(cells(h), [['处理器', '29% 66.6℃', 'green'], ['内存/系统资源', '正常', 'green'], ['磁盘余量', '83.6 GiB', 'green'],
    ['AI 临时文件', '至少 200 GiB', 'green'], ['旧临时目录回收', '2.3 GB', 'green'], ['存储占用与增长', '正常', 'green'],
    ['流量', '5.1 GB', 'green'], ['远程连接', '能连上', 'green'], ['笔记本（副机）', '在线', 'green']]);
  assert.match(h, /<progress max="100" value="86" aria-label="已用 86%"><\/progress><small>已用 86%<\/small><\/p><p class="cp-sub">C 盘还剩 13\.9%/);
  assert.match(h, /cp-sub">今天上网 · 近 60 分钟 2\.9 GB · 没超提醒线 · 套餐已用 521\.1\/604\.7 GB<\/p><details class="cp-tile-more">/);
  assert.match(h, /cp-sub">今天 00:19 放进回收站 200 个<\/p><details/);
  assert.match(h, /cp-sub">预算 300 GiB · Claude 100 GiB · Codex 至少 30 GiB<\/p><a class="cp-tile-go" href="\/cockpit\/storage\/">/);
  assert.match(h, /id="remote">.*间歇断开还在查 · <a class="cp-net" href="#know-pending-net">看这里 →<\/a>/);
  const links = [...h.matchAll(/<a class="cp-link-card ct-card[^"]*" href="[^"]+" target="_blank" rel="noopener"><b>([^<]+)<\/b>.*?↗/g)].map((m) => m[1]);
  assert.deepEqual(links, ['CPU 和显卡', '内存和网络', '图表后台登录']);
  // 图表链接固定三张：这次没拿到某张图的地址，照样占格、链到后台登录（本人 10-31：怎么又消失一个）
  const one = computer(view({ grafana: { links: [{ id: 'memory-network', label: '内存和网络', url: 'https://example.invalid/b' }], url: 'https://example.invalid/' } }), ctx);
  assert.deepEqual([...one.matchAll(/<a class="cp-link-card ct-card[^"]*" href="([^"]+)"[^>]*><b>([^<]+)<\/b>/g)].map((m) => [m[2], m[1]]),
    [['CPU 和显卡', 'https://example.invalid/login'], ['内存和网络', 'https://example.invalid/b'], ['图表后台登录', 'https://example.invalid/login']]);
  assert.match(one, /cp-chart is-off" href="https:\/\/example\.invalid\/login"[^>]*><b>CPU 和显卡<\/b><small>这张图的公开地址这次没拿到，登录后台能看/);
  // 图表网页整个打不开：三张照样占格变灰，不给链接，登录那张写几点检查的
  const down = computer(view({ grafana: { state: 'unavailable', checked_at: '2026-10-31T02:30:00+08:00', links: [] } }), ctx);
  assert.equal((down.match(/<div class="cp-link-card ct-card cp-chart is-off">/g) || []).length, 3);
  assert.doesNotMatch(down, /<a class="cp-link-card/);
  assert.match(down, /<b>图表后台登录<\/b><small>图表网页现在打不开（上次检查 02:30）<\/small>/);
  // 副机连接没判断出来：占格写“读不到”，说清不是离线
  assert.match(computer(view({ laptop: { connection: 'unknown' } }), ctx), /笔记本（副机）<\/h3><p class="cp-big">读不到<\/p><p class="cp-sub">这次没判断出它在不在线，不等于离线<\/p>/);
  // 套餐流量停了：不接套餐那段，卡数不变
  assert.doesNotMatch(computer(view({ stale_summary: { text: '这些数据没再更新：套餐流量', ids: ['traffic'] } }), ctx), /套餐已用/);
});

test('存储：AI 临时文件只看自己的 alert，整体状况在“存储占用与增长”那张卡，直接写数字', () => {
  const others = [{ id: 'recycle_bin', label: 'E 盘当前用户回收站', alert: 'budget', bytes: 25 * GB, complete: true, budget_bytes: 20 * GB },
    { id: 'claude_conversations', label: 'Claude 对话记录', alert: 'budget', bytes: 21 * GB, complete: true, budget_bytes: 18 * GB },
    { id: 'backup_g', label: 'G 盘整卷已用空间', alert: 'weekly_growth', bytes: 1489 * GB, complete: true, weekly_growth_bytes: 455 * GB, growth_limit_bytes: 70 * GB },
    { id: 'backup_h', label: 'H 盘整卷已用空间', alert: 'weekly_growth', bytes: 1480 * GB, complete: true, weekly_growth_bytes: 468 * GB, growth_limit_bytes: 70 * GB }];
  const h = computer(view({ storage_pressure: { state: 'warn', observed_at: at, categories: cats(...others) } }), ctx);
  assert.deepEqual(cells(h).slice(3, 6).map((c) => [c[0], c[1], c[2]]), [['AI 临时文件', '至少 200 GiB', 'green'], ['旧临时目录回收', '2.3 GB', 'green'], ['存储占用与增长', '25 GiB 回收站', 'yellow']]);
  // 超得最多的做大字，其余一项一行：超预算的先，再按一周增长从多到少
  assert.match(h, /25 GiB <small>回收站<\/small><\/p><p class="cp-sub">预算 20 GiB<\/p><ul class="cp-tile-rows"><li><span>Claude 对话记录<\/span><b>21 GiB<\/b><small>预算 18 GiB<\/small><\/li>/);
  assert.match(h, /<li><span>H 盘<\/span><b>一周 \+468 GiB<\/b><small>已用 1,480 GiB · 提醒线一周 70 GiB<\/small><\/li><li><span>G 盘<\/span><b>一周 \+455 GiB<\/b>/);
  assert.doesNotMatch(h, /类超预算|AI 在处理|有存储类别/);
  // 后端没给字节数时照实写“超过预算”，不编数
  assert.match(computer(view({ storage_pressure: { state: 'warn', observed_at: at, categories: cats({ id: 'x', label: '虚构类别', alert: 'budget' }) } }), ctx), /超过预算 <small>虚构类别<\/small>/);
  const own = cats(); own[0] = { ...own[0], alert: 'budget' };
  assert.match(computer(view({ storage_pressure: { state: 'warn', observed_at: at, categories: own } }), ctx), /is-yellow ct-card cp-tile"><h3>.*?AI 临时文件<\/h3><p class="cp-big">至少 200 GiB<\/p>.*?<p>要留意：超过预算<\/p>/);
});

test('取不到数字照写原句不编数；缺卡留空位不拉宽；读不到电脑时链接卡收起只留一行', () => {
  const odd = view({ sections: { computer: [pc({ id: 'disk_space', title: '磁盘余量', text: '虚构磁盘说法没有数字' }), pc({ id: 'x', title: '虚构卡', text: '虚构读数偏高', state: 'attention', color: 'yellow' })], remote: [] }, storage_pressure: {} });
  const h = computer(odd, ctx);
  assert.deepEqual(cells(h), ['空', '空', ['磁盘余量', '正常', 'green'], ['AI 临时文件', '读不到', 'gray'], '空', ['存储占用与增长', '读不到', 'gray'],
    '空', ['远程连接', '读不到', 'gray'], ['笔记本（副机）', '在线', 'green'], ['虚构卡', '要留意', 'yellow'], '空', '空']);
  assert.match(h, /cp-sub">虚构磁盘说法没有数字<\/p>/);
  assert.match(h, /要留意<\/p><p>虚构读数偏高<\/p>/);
  assert.doesNotMatch(h, /<details class="cp-tile-more"><summary>详情<\/summary><p>(还没读到)?<\/p>/);
  const off = computer(view(), { ...ctx, offline: true });
  assert.equal((off.match(/is-off cp-tile/g) || []).length, 9);
  assert.equal((off.match(/读不到（最后/g) || []).length, 1);
  assert.doesNotMatch(off, /cp-link-card|example\.invalid|cp-net/);
  assert.match(off, /图表链接先收起/);
});

test('排法和横幅那一组写在 CSS 里：≥768 三张等宽不拉宽，↻ ? 紧跟第一行“读到”', () => {
  assert.match(css, /@media \(min-width: 768px\) \{\s*\.cp-pc-grid \{ grid-template-columns: repeat\(3, minmax\(0, 1fr\)\); \}/);
  assert.doesNotMatch(css, /\.cp-pc-grid > [^{]*\{ grid-column: (span|1 \/ -1)/);
  assert.match(css, /\.cp-pc-links \{ display: grid; grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.cp-page \.cp-tools > \.cp-meta \{ display: contents; \}/);
  assert.match(css, /\.cp-tools \.cp-meta-at \{ order: 1;[^}]*\}\s*\.cp-tools > \[data-cp-reload\] \{ order: 2; \}\s*\.cp-tools > \.cp-help \{ order: 3; \}\s*\.cp-tools \.cp-meta-sub \{ order: 4; flex: 1 0 100%; \}/);
  assert.match(css, /\.cp-page \.cp-tool \{ position: relative; width: 28px;[^}]*\}\s*\.cp-page \.cp-tool::before \{ content: ""; position: absolute; inset: -8px; \}/);
  assert.match(css, /--cp-title-pad: calc\(var\(--cp-title-h\) \* 30 \/ 198\)/);
});

test('远程卡进了“没再更新”也照样占格写原句；正在跑的卡写“正在跑”，不写读不到（本人 10-31 18:03）', () => {
  const v = view({ stale_summary: { text: '这些数据没再更新：远程连接', ids: ['remote', 'temp_reclaim'] } });
  v.sections.remote[0] = { ...v.sections.remote[0], text: '远程连接在线；串流运行中；网络正常', state: 'stale', must_know_id: undefined };
  const i = v.sections.computer.findIndex((c) => c.id === 'temp_reclaim');
  v.sections.computer[i] = { ...v.sections.computer[i], state: 'reading', color: 'unavailable', text: '回收站清理这一轮还在运行，虚构结果要等执行回执写完；电脑配置负责。' };
  const h = computer(v, ctx), grid = cells(h);
  assert.equal(grid.filter((x) => x !== '空').length >= 9, true);
  assert.deepEqual(grid.find((x) => x[0] === '远程连接')?.[1], '在线');
  assert.deepEqual(grid.find((x) => x[0] === '旧临时目录回收')?.slice(1), ['正在跑', 'neutral']);
  assert.doesNotMatch(h, /还没读到/);
});

test('一张卡什么都没给（没内容、没原因、没时间）时说清后台没写原因，不写“还没读到”', () => {
  const v = view();
  v.sections.remote = [];
  const h = computer(v, ctx);
  assert.deepEqual(cells(h).find((x) => x[0] === '远程连接')?.[1], '读不到');
  assert.match(h, /这次没读到，后台也没写原因/);
  assert.doesNotMatch(h, /还没读到/);
});

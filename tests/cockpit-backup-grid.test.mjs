// 驾驶舱“备份和云端”卡片网格（本人北京时间 2026-10-31 12:54：排版不好看，一句“还没读到”不知何意）：全部数据虚构。
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { backup } from '../site-astro/src/cockpit/render.js';

const now = new Date('2026-10-31T13:00:00+08:00'), at = '2026-10-31T12:59:00+08:00';
const ctx = { now, offline: false, phase: 'live', projectUrls: {}, img: {} };
const c = (t) => ({ state: 'ok', color: 'ok', observed_at: at, ...t });
const view = (cards, extra = {}) => normalize({ schema: 'pcconfig.cockpit-view.v1', served_at: at, sections: { backup_cloud: cards }, ...extra });
const cells = (h) => [...h.matchAll(/<article class="cp-card is-(\w+)[^"]*cp-tile"[^>]*><h3>.*?<\/span>(.*?)<\/h3><p class="cp-big">(.*?)<\/p>/g)].map((m) => [m[2], m[3].replace(/<[^>]*>/g, ''), m[1]]);

// 和 10-31 12:50 本机接口同样子的五张卡：后端还没给结构化数字时
const today = [
  c({ id: 'backups', title: '备份', state: 'attention', color: 'neutral', ai_handling: 'AI 在管', text: '副本清单从今天 12:46起没读到；下面相关的数可能不全，AI 会核对。' }),
  c({ id: 'drive_upload', title: 'Google Drive 上传', state: 'unavailable', color: 'unavailable', observed_at: '2026-10-27T17:26:55+08:00', text: 'Google Drive：10 月 27 日 17:26上传记录，停在 760/775 个；现在传完没有，AI 还要核对。' }),
  c({ id: 'aliyun_billing', title: '阿里云费用', state: 'attention', color: 'neutral', ai_handling: 'AI 在管', observed_at: '2026-10-31T02:00:02+08:00', text: '阿里云费用从今天 03:00起没读到；下面相关的数可能不全，AI 会核对。' }),
  c({ id: 'copy_drive', title: 'Google 云盘副本', state: 'unavailable', color: 'unavailable', observed_at: null, text: '暂时读不到' }),
  c({ id: 'copy_photos', title: 'Google 相册副本', state: 'unavailable', color: 'unavailable', observed_at: null, text: '暂时读不到' }),
];

test('备份和云端：和电脑区一样的卡片网格，按备份、两份副本、上传、费用排', () => {
  const h = backup(view(today), ctx);
  assert.match(h, /<div class="cp-pc-grid cp-bk-grid">/);
  assert.deepEqual(cells(h).map((x) => x[0]), ['备份', '备份盘 G 和 H', 'Google 云盘副本', 'Google 相册副本', 'Google Drive 上传', '阿里云费用']);
  // 上传进度从原句取出数字画进度条，原句收进“详情”
  assert.match(h, /760\/775 <small>个<\/small><\/p><p class="cp-meter"><progress max="100" value="98"/);
  assert.match(h, /10月27日 17:26 之后没再传/);
  // 副本读不到：说清是什么没读到、为什么、谁在管，不只写“还没读到”
  const copy = h.slice(h.indexOf('Google 云盘副本'), h.indexOf('Google 相册副本'));
  assert.match(copy, /副本清单从今天 12:46起没读到，这份副本有多大、几时同步的跟着读不到；AI 在管/);
  assert.doesNotMatch(h, /<p class="cp-sub">还没读到<\/p>/);
  assert.doesNotMatch(h, /<ul class="cp-facts/);
});

test('后端给了结构化数字就写大数字：几项备份正常、余额、副本大小；missing_reason 照写', () => {
  const cards = [
    c({ id: 'backups', title: '备份', state: 'attention', color: 'neutral', text: '1 项备份要留意', items_total: 9, items_ok: 8, last_success_at: '2026-10-31T12:49:55+08:00',
      failing: [{ name: '虚构配置备份', last_success_at: '2026-10-30T12:48:00+08:00' }] }),
    c({ id: 'copy_drive', title: 'Google 云盘副本', bytes: 300 * 2 ** 30, files: 12345, last_synced_at: '2026-10-31T04:00:00+08:00' }),
    c({ id: 'copy_photos', title: 'Google 相册副本', state: 'unavailable', color: 'unavailable', observed_at: null, text: '暂时读不到', missing_reason: '虚构原因：相册副本这台电脑上还没接入，PCConfig 在接' }),
    c({ id: 'drive_upload', title: 'Google Drive 上传', uploaded: 775, total: 775, category: '音乐和录音' }),
    c({ id: 'aliyun_billing', title: '阿里云费用', state: 'attention', color: 'neutral', ai_handling: 'AI 在管', observed_at: '2026-10-31T02:00:02+08:00', text: '阿里云费用从今天 03:00起没读到；AI 会核对。', balance_yuan: 42.47, month_spend_yuan: 39.888, runway_days: 700.05 }),
  ];
  const h = backup(view(cards), ctx);
  assert.deepEqual(cells(h), [['备份', '8/9 项正常', 'neutral'], ['备份盘 G 和 H', '读不到', 'gray'], ['Google 云盘副本', '300 GiB', 'green'], ['Google 相册副本', '读不到', 'gray'], ['Google Drive 上传', '775/775 个', 'green'], ['阿里云费用', '¥42.47 余额', 'neutral']]);
  assert.match(h, /最近一次成功 12:49<\/p><ul class="cp-tile-rows"><li><span>虚构配置备份<\/span><b>没成功<\/b><small>上次成功 10月30日 12:48<\/small>/);
  // 正在跑的写“正在跑”，不标没成功；没成功的写几点没成功
  const two = backup(view([c({ id: 'backups', title: '备份', items_total: 5, items_ok: 4, failing: [
    { name: '虚构文档备份', state: 'warn', last_success_at: '2026-10-30T12:48:00+08:00', last_failed_at: '2026-10-31T13:00:01+08:00' },
    { name: '虚构同步', state: 'running', last_success_at: '2026-10-30T16:58:25+08:00' }] })]), ctx);
  assert.match(two, /<span>虚构文档备份<\/span><b>没成功<\/b><small>13:00 没成功 · 上次成功 10月30日 12:48<\/small>/);
  assert.match(two, /<span>虚构同步<\/span><b>正在跑<\/b><small>上次成功 10月30日 16:58<\/small>/);
  assert.match(h, /12,345 个文件 · 04:00 同步过/);
  assert.match(h, /虚构原因：相册副本这台电脑上还没接入，PCConfig 在接/);
  assert.match(h, /音乐和录音 · 都传完了/);
  assert.match(h, /本月花了 ¥39\.89 · 约够 700 天<\/p>.*?AI 在管 · 02:00 读到/);
});

test('备份盘 G 和 H：已用、一周涨多少、按近一周速度几天到预算线、核对过几类', () => {
  const GB = 2 ** 30, at2 = '2026-10-31T12:55:00+08:00';
  const disk = (id, bytes, grow, alert = null) => ({ id, label: id === 'backup_g' ? 'G 盘整卷已用空间' : 'H 盘整卷已用空间', bytes, complete: true, weekly_growth_bytes: grow, budget_bytes: 1769 * GB, growth_limit_bytes: 70 * GB, alert });
  const own = c({ id: 'backups', title: '备份', text: 'G 盘有 19 类备份已经核对，另外 1 类 AI 还在核对；H 盘有 20 类备份已经核对。' });
  const sp = (g, h) => ({ storage_pressure: { state: 'warn', observed_at: at2, max_age_seconds: 50400, categories: [g, h] } });
  const h = backup(view([own], sp(disk('backup_g', 1097 * GB, 64 * GB), disk('backup_h', 1480 * GB, 468 * GB, 'weekly_growth'))), ctx);
  // 先到预算线的那块做大字：H 盘还剩 289 GiB、一周涨 468 GiB，约 4 天
  assert.deepEqual(cells(h)[1], ['备份盘 G 和 H', '约 4 天 H 盘到预算线', 'yellow']);
  assert.match(h, /<li><span>G 盘已用 1,097 GiB<\/span><b>一周 \+64 GiB<\/b><small>预算 1,769 GiB · 核对过 19 类，1 类在核对<\/small><\/li><li><span>H 盘已用 1,480 GiB<\/span><b>一周 \+468 GiB<\/b><small>预算 1,769 GiB · 核对过 20 类<\/small>/);
  // 两块盘都没变多：写“够用”，不算天数
  const calm = backup(view([own], sp(disk('backup_g', 900 * GB, -5 * GB), disk('backup_h', 900 * GB, 0))), ctx);
  assert.deepEqual(cells(calm)[1], ['备份盘 G 和 H', '够用 近一周没变多', 'green']);
  assert.match(calm, /一周 −5 GiB/);
});

test('一张备份卡都没有时也占一格写读不到；读不到电脑时卡片变淡', () => {
  assert.deepEqual(cells(backup(view([]), ctx)), [['备份', '读不到', 'gray'], ['备份盘 G 和 H', '读不到', 'gray']]);
  const off = backup(view(today), { ...ctx, offline: true });
  assert.equal((off.match(/is-off cp-tile/g) || []).length, 6);
});


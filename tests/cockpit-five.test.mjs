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

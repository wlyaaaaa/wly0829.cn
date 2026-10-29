// 驾驶舱“过了原定时间”小标签：need_you 行带 overdue_text 时标题旁显示；全部数据虚构（中性示例）
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../site-astro/src/cockpit/model.js';
import { REGIONS, PRIVATE_TITLE } from '../site-astro/src/cockpit/render.js';

const now = new Date();
const base = (extra = {}) => ({ schema: 'pcconfig.cockpit-view.v1', served_at: now.toISOString(), ...extra });
const ctx = { now, offline: false, phase: 'live', projectUrls: {}, img: {} };
const ovCtx = { ...ctx, ov: { stale: () => false, lamp: () => '' } };
const late = (days) => ({ overdue_since: '2026-10-20', overdue_days: days, overdue_text: days ? `过了原定时间 ${days} 天` : '今天已过原定时间' });

test('normalize 原样透传 overdue_since / overdue_days / overdue_text', () => {
  const v = normalize(base({ need_you: [{ id: 'n1', title: '示例事项：核对一次备份', ask_kind: 'do', ...late(3) }] }));
  assert.equal(v.need_you[0].overdue_text, '过了原定时间 3 天');
  assert.equal(v.need_you[0].overdue_days, 3);
  assert.equal(v.need_you[0].overdue_since, '2026-10-20');
});

test('有 overdue_text：详情保留原期限，首行解释不急；公开占位不带私人详情', () => {
  const v = normalize(base({
    need_you: [
      { id: 'n1', title: '示例事项：核对一次备份', ask_kind: 'do', ...late(3) },
      { id: 'n2', title: '示例事项：选一种整理方式', ask_kind: 'decision', ...late(0) },
      { id: 'n3', title: '示例私事 A', ask_kind: 'do', owner_only: true, ...late(5) },
      { id: 'n4', ask_kind: 'do', owner_only: true, placeholder: true, title: PRIVATE_TITLE, ...late(8) },
    ],
  }));
  const need = REGIONS['need-you'](v, ctx);
  assert.match(need, /要你动手/);
  assert.match(need, /要你拍板/);
  for (const text of ['过了原定时间 3 天', '今天已过原定时间', '过了原定时间 5 天']) assert.ok(need.includes('<span class="cp-late">' + text + '</span>'));
  assert.match(need, /class="cp-ask-why">过了原定时间，但不急/);
  assert.ok(need.includes(PRIVATE_TITLE));
  assert.equal((need.match(/class="cp-late"/g) || []).length, 3);
  // 首屏顶上只有一句话，不再重复列标题；标签只在卡片上
  assert.doesNotMatch(REGIONS.overview(v, ovCtx), /cp-late/);
});

test('标签文字会转义，过长截断', () => {
  const v = normalize(base({ need_you: [{ id: 'n1', title: '示例事项', ask_kind: 'do', overdue_text: '<b>过了</b>' + '天'.repeat(60) }] }));
  const need = REGIONS['need-you'](v, ctx);
  assert.ok(need.includes('<span class="cp-late">&lt;b&gt;过了&lt;/b&gt;'));
  assert.ok(!need.includes('天'.repeat(40)));
});

test('没有 overdue_text：空白值不制造逾期提示', () => {
  const rows = [{ id: 'n1', title: '示例事项：核对一次备份', ask_kind: 'do' }, { id: 'n2', title: '示例事项：选一种整理方式', ask_kind: 'decision' }];
  const plain = normalize(base({ need_you: rows }));
  const empty = normalize(base({ need_you: rows.map((r) => ({ ...r, overdue_text: '  ', overdue_days: null })) }));
  const need = REGIONS['need-you'](plain, ctx);
  assert.doesNotMatch(need, /cp-late|原定时间/);
  assert.doesNotMatch(REGIONS['need-you'](empty, ctx), /cp-late|过了原定时间/);
  assert.doesNotMatch(REGIONS.overview(plain, ovCtx), /cp-late/);
});

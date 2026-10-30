import test from 'node:test';
import assert from 'node:assert/strict';
import { security } from '../site-astro/src/cockpit/render.js';

// 安全和授权那格：按自己的读取时间判断新旧，超过总览同一个时限就写“没读到”，不拿旧状态报平安
const now = new Date('2026-10-30T15:30:00Z');
const cell = (observed_at, overview = { stale_after_seconds: 180 }) => security({
  ok: true, overview,
  security: { observed_at, personal_data: { state: 'unlocked', expires_at: '2026-10-31T07:56:00Z' }, unrestricted: { state: 'inactive' }, windows: { state: 'unlocked' }, computer: {} },
}, { now, phase: 'live' }).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

test('安全和授权：刚读到写“都正常”，过了时限写“没读到”和上次读到的时间', () => {
  assert.match(cell('2026-10-30T15:29:00Z'), /都正常.*资料解锁到/);
  assert.match(cell('2026-10-30T15:20:00Z'), /没读到.*上次 .*读到/);
});

test('安全和授权：总览缺了不连累这格，没给时限按 15 分钟算', () => {
  assert.match(cell('2026-10-30T15:20:00Z', null), /都正常/);
  assert.match(cell('2026-10-30T15:10:00Z', null), /没读到/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../site-v2/first-layer/connect-auth/demo/auth.js', import.meta.url), 'utf8');
test('authorization expiry uses Beijing today, tomorrow and weekday across midnight', () => {
  const format = source.slice(source.indexOf('  const BJ ='), source.indexOf('  const fresh ='));
  class Clock extends Date { static now() { return Date.parse('2026-11-16T15:30:00Z'); } }
  const context = vm.createContext({ Date: Clock, clock: () => Clock.now() / 1000 });
  vm.runInContext(format, context);
  for (const [date, expected] of [
    ['2026-11-16T23:40:05+08:00', '到今天 23:40'],
    ['2026-11-17T00:04:00+08:00', '到明天 00:04'],
    ['2026-11-20T10:04:00+08:00', '到周五 10:04'],
  ]) assert.equal(context.untilText(Date.parse(date)), expected);
});

test('access requires a post-action body and measures its age on the server clock', () => {
  const at = '2026-11-16T15:30:00Z', time = Date.parse(at), DateWithSkew = class extends Date {
    static now() { return time + 600_000; }
  };
  const context = { Date: DateWithSkew, performance: { now: () => 1000 }, serverClock: { at, received: 500 },
    online: true, readAfter: 7, meta: { at, source: 'net', status: 304, dataRead: 7 },
    state: { personal_data: {} }, fields: { pd: 'personal_data' } };
  vm.runInNewContext(source.slice(source.indexOf('  const clock ='), source.indexOf('  const grantKeys =')) + '\nthis.fresh = fresh;', context);
  assert.equal(context.fresh('pd'), false);
  Object.assign(context.meta, { status: 200, dataRead: 8 });
  assert.equal(context.fresh('pd'), true);
  context.state.personal_data.observed_at_unix = time / 1000 - 121;
  assert.equal(context.fresh('pd'), false);
  delete context.state.personal_data.observed_at_unix;
  context.meta.source = 'copy';
  assert.equal(context.fresh('pd'), false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('authorization expiry uses Beijing today, tomorrow and weekday across midnight', async () => {
  const source = await readFile(new URL('../site-v2/first-layer/connect-auth/demo/auth.js', import.meta.url), 'utf8');
  const format = source.slice(source.indexOf('  const BJ ='), source.indexOf('  const fresh ='));
  class Clock extends Date { static now() { return Date.parse('2026-11-16T15:30:00Z'); } }
  const context = vm.createContext({ Date: Clock });
  vm.runInContext(format, context);
  for (const [date, expected] of [
    ['2026-11-16T23:40:05+08:00', '到今天 23:40'],
    ['2026-11-17T00:04:00+08:00', '到明天 00:04'],
    ['2026-11-20T10:04:00+08:00', '到周五 10:04'],
  ]) assert.equal(context.untilText(Date.parse(date)), expected);
});

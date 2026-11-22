import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const src = readFileSync(new URL('../site-v2/first-layer/connect-auth/demo/connect.js', import.meta.url), 'utf8');
test('开机时长在一天前显示小时和分钟，满一天显示天和小时', () => {
  const code = src.slice(src.indexOf('  function uptimeText('), src.indexOf('  // —— 分段选择'));
  const mainUptime = {};
  const draw = vm.runInNewContext(code + '\nshowUptime', { mainUptime });
  for (const [uptime_seconds, expected] of [[null, ''], [0, '主机已开机 0 小时 0 分钟'], [3719.5, '主机已开机 1 小时 1 分钟'], [86400, '主机已开机 1 天 0 小时'], [183600, '主机已开机 2 天 3 小时'], [undefined, '']]) {
    draw({ uptime_seconds });
    assert.equal(mainUptime.textContent, expected);
    assert.equal(mainUptime.hidden, !expected);
  }
});

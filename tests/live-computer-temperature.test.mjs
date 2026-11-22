import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../site-v2/live/computer/page.js', import.meta.url), 'utf8');
const between = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const chartLines = vm.runInNewContext([
  between('  const retiredGpuTemperature', '  // ================='),
  between('  const hasSamples', '  function groupHasReadings'),
  between('  function chartLines', '  function paintCharts'),
  'chartLines',
].join('\n'));

test('legacy hotspot packets never become core temperatures or duplicate a core line', () => {
  const points = (id, value, group = '电源和温度') => ({ id, group, points: [[1, value]] });
  const legacy = points('gpu-core-temp', 53);
  const hotspot = { ...points('gpu-hotspot', 107), sensor_source: 'lhm' };
  const core = points('gpu-temp', 57);
  const get = (...series) => JSON.stringify(chartLines('电源和温度', { series }));
  assert.equal(get(hotspot), '[]');
  assert.equal(get(hotspot, points('gpu-temp', null), legacy),
    JSON.stringify([{ ...legacy, id: 'gpu-temp', label: '显卡核心温度' }]));
  assert.equal(get(hotspot, core, legacy), JSON.stringify([{ ...core, label: '显卡核心温度' }]));
  const long = points('gpu-heat-90d', 68, '长期');
  assert.equal(JSON.stringify(chartLines('长期', { series: [points('gpu-hotspot-90d', 108, '长期'), long] })),
    JSON.stringify([long]));
});

test('temperature legend uses chart samples while the individual readings keep their sensor time', () => {
  const points = '2026-11-20T09:06:00+08:00', live = '2026-11-20T09:31:00+08:00';
  const reading = vm.runInNewContext([
    between('  function reading(', '  const DAY'),
    'reading',
  ].join('\n'), {
    series: () => ({ group: '电源和温度', unit: '℃' }),
    snapshot: () => ({ at: live, value: 68 }),
    iso: at => at || null, sameBasis: () => false, stale: () => false,
    span: '24h', bucket: () => '分钟均值', OLD_HISTORY: {}, V: { dur: () => '' },
  });
  for (const id of ['cpu-temp', 'gpu-temp']) {
    assert.equal(reading(id, { value: 67, at: points }, null, 'hero').at, points);
    assert.equal(reading(id, { value: 67, at: points }, null, 'hero').value, 67);
    assert.equal(reading(id, null, null, 'chip').at, live);
  }
});

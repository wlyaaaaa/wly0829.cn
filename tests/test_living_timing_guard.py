"""Execute source and shipped guards with delayed animation-frame callbacks."""
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
CHECK = r'''
const vm = require('node:vm'), assert = require('node:assert/strict');
let input = ''; process.stdin.on('data', s => input += s);
process.stdin.on('end', () => {
  const {code, name} = JSON.parse(input);
  for (const reportOnly of [true, false]) for (const gap of [1100, 120]) {
    let now = 0; const stops = [], logs = [];
    const factory = vm.runInNewContext(code + ';' + name, {
      performance: {now: () => now}, console: {info: s => logs.push(s)}
    });
    const guard = factory({label: 'test', ...(reportOnly ? {reportOnly: true} : {}), shared: {scrollingUntil: 0},
      shouldRun: () => true, exempt: () => false, stop: s => stops.push(s)});
    guard.reset(); let draws = 0, blocked = false;
    for (let i = 0; i < 80; i++) {
      now += gap;
      if (guard.check(now)) {blocked = true; break;}
      draws++;
    }
    assert.equal(guard.state().trigger.rule, gap === 1100 ? 'long-frames' : 'slow-median');
    assert.equal(blocked, !reportOnly);
    assert.equal(stops.length, reportOnly ? 0 : 1);
    if (reportOnly) {
      assert.equal(draws, 80);
      assert.ok(logs.every(s => !s.includes('退回静态')));
      for (let i = 0; i < 180; i++) {now += 16.7; assert.equal(guard.check(now), false);}
      assert.ok(guard.state().trigger);
    } else assert.equal(stops[0], 'slow-frames');
  }
});
'''


class TimingGuard(unittest.TestCase):
    def check_guard(self, text, name, end):
        start = text.index('function ' + name + '(')
        code = text[start:text.index(end, start)]
        subprocess.run(['node', '-e', CHECK], input=json.dumps({'code': code, 'name': name}),
                       text=True, check=True, capture_output=True)

    def test_source(self):
        source = (ROOT / 'src/runtime/living/src/living.js').read_text('utf-8')
        self.check_guard(source, 'makeGuard', '// ---------- 看得见吗')
        self.assertIn('shared, reportOnly: true, stop:', source)

    def test_shipped(self):
        site = ROOT / 'site-astro'
        engine = json.loads((site / 'src/chrome/living-engine.json').read_text('utf-8'))['fixed']
        source = (site / 'public/_living/_engine' / engine).read_text('utf-8')
        self.check_guard(source, 'zt', 'function cn(')
        self.assertIn('zt({label:"LivingArt",reportOnly:!0,', source)
        self.assertIn('guardFactory:U?H=>zt({...H,reportOnly:!0}):null,', source)


if __name__ == '__main__':
    unittest.main()

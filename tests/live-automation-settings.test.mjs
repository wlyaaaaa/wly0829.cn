import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const code = name => readFileSync(new URL('../site-v2/live/' + name, import.meta.url), 'utf8');
const token = 't'.repeat(43);
function client(origin, key, response, isPublic = false) {
  const calls = [];
  let popups = 0;
  const window = { LiveView: { isPublic: () => isPublic }, TrustModal: { show() { popups++; } } };
  vm.runInNewContext(code('_lib/live-client.js'), { window, location: new URL(origin + '/live/automation/'),
    document: { addEventListener() {} }, localStorage: { getItem: () => key }, URLSearchParams, Intl, Date,
    AbortSignal, setTimeout, clearTimeout, fetch: async (url, request) => {
      calls.push([url, request]);
      return response();
    } });
  return { save: window.Live.automationSetting, calls, popups: () => popups };
}

test('automation settings require pairing, use each origin own path, and never retry failed writes', async () => {
  const request = { operation: 'type-mode', id: 'backup', value: { mode: 'off' } };
  for (const [origin, endpoint] of [
    ['https://wly0829.cn', 'https://mcp.wly0829.cn/computer-access/api/cockpit/automation-settings'],
    ['http://127.0.0.1:5412', '/__computer/cockpit/automation-settings'],
  ]) {
    const get = (status, body) => () => Response.json(body, { status });
    const good = client(origin, token, get(200, { status: 'saved', current: { mode: 'off' } }));
    assert.equal((await good.save(request)).status, 'saved');
    assert.equal(good.calls.length, 1);
    const [[url, sent]] = good.calls;
    assert.equal(url, endpoint);
    assert.equal(sent.headers['X-Cockpit-Device'], token);
    assert.deepEqual(JSON.parse(sent.body), request);
    const follow = { operation: 'type-effort', id: 'backup', value: null };
    const reset = client(origin, token, get(200, { status: 'saved', current: { effort: null } }));
    assert.equal((await reset.save(follow)).current.effort, null);
    assert.deepEqual(JSON.parse(reset.calls[0][1].body), follow);
    const revoked = client(origin, token, get(403, { status: 'error', error: 'cockpit_owner_required' }));
    assert.equal((await revoked.save(request)).error, 'cockpit_owner_required');
    assert.equal(revoked.popups(), 1);
    assert.equal(revoked.calls.length, 1);
    for (const [key, publicView] of [['', false], [token, true]]) {
      const guest = client(origin, key, get(200, {}), publicView);
      assert.equal((await guest.save({ operation: 'access' })).error, 'cockpit_owner_required');
      assert.equal(guest.calls.length, 0);
      assert.equal(guest.popups(), 1);
    }
  }
});

test('automation lamp reads the background-AI level, reason and attention count, and turns gray without a level', () => {
  const window = {};
  vm.runInNewContext(code('automation/presentation.js'), { window });
  const { lamp, tag } = window.AutomationPresentation;
  const data = { level: 'blue', why: '示例备份由 AI 接手', attention_count: 0, failed: 17 };
  assert.deepEqual({ ...lamp(data) }, { level: 'blue', why: data.why, attention: 0 });
  assert.equal(lamp(data, true).level, 'gray');
  assert.deepEqual({ ...lamp({ ...data, level: undefined }) }, { level: 'gray', why: '读不到后台 AI 的状态', attention: null });
  assert.deepEqual({ ...lamp({ level: 'green' }) }, { level: 'green', why: '', attention: null });
  assert.equal(tag('repair', 'Sol', String), '<span class="auto-tag" data-kind="repair">修毛病 · Sol</span>');
  assert.equal(tag('unknown', 'Sol', String), '');
});

test('automation work page shows one work and the read-only categories for owner and visitor (the old overview is retired)', () => {
  const how_to = { description: ['测试范围', '测试例子', '关了照样留回执', '要你本人恢复原件'], steps: ['要你本人确认'] };
  const types = ['backup', 'ai-review', 'ai-stalled'].map(id => ({ id, title: id, how_to, setting: { mode: 'on', effort: null }, model_effort: 'high', model: 'Sol', sources: [{ at: '2026-11-20T01:00:00Z' }] }));
  const routines = [{ id: 'claude-guidance', producer: 'Claude', label: 'Claude 指导', trigger_text: '一件活三次没修好时', today_count: 0, at: '2026-11-20T11:39:00Z', plan_count: 1 }];
  const other_automatic_chats = [{ id: 'event-root', producer: 'Codex', label: '事件叫起', state_text: '正在跑', actual_model: 'GPT Sol' }];
  const scheduled_activities = [
    { id: 'codex-weekly', producer: 'Codex', label: '每周基座体检', period: '每周一 09:00 (Asia/Shanghai)', state_text: '正在跑', status: 'warn', level: 'yellow', at: '2026-11-20T00:00:00Z',
      recent_runs: [{ at: '2026-11-20T09:00:00Z', chat_state: 'running', actual_model: 'GPT Sol' }, { at: '2026-11-19T09:00:00Z', status: 'failed' }] },
    { id: 'claude-once', producer: 'Claude', label: '隔离一次性', state_text: '跑完了', status: 'no_conclusion', period: '一次性', href: '/live/task/?id=claude-once',
      at: '2026-11-20T08:00:00Z' },
    { id: 'claude-paused', producer: 'Claude', label: '隔离暂停', state_text: '已暂停', status: 'ok' },
    { id: 'antigravity-missed', producer: 'Antigravity', label: '隔离漏跑任务', state_text: '等下次', period: '每小时',
      status: 'warn', level: 'yellow', notice: '到点未启动', stop: '在原平台暂停', next_at: '2026-11-20T14:00:00Z' },
  ];
  function render(audience, type = '', extra = {}, detail = null) {
    const listeners = new Map(), root = { querySelectorAll: () => [], addEventListener() {} };
    const dialog = { querySelector: () => ({ addEventListener() {} }) };
    const window = { Live: { watch(key, _, events) { listeners.set(key, events.phase); } },
      LiveUI: { esc: String, fieldHtml: value => value ?? '', fieldText: String, topbar() {}, minutes: n => `${n} 分钟`,
        status: data => ({ lamp: data?.level ? `<span data-level="${data.level}"></span>` : '' }),
        date: value => value.slice(0, 10), time: value => value.slice(11, 16),
        html(el, html) { el.innerHTML = html; } },
      LiveLight: { lightUp() {} }, LiveBoard: { icon: () => '' } };
    const context = { window, URL, URLSearchParams, requestAnimationFrame() {},
      location: new URL('https://wly0829.cn/live/automation/' + (detail ? '?work=' + detail.work.id : type ? '?type=' + type : '')),
      document: { getElementById: id => ({ 'work-queue': root, 'automation-legacy': {}, 'automation-setting': dialog })[id], querySelector: () => ({}) } };
    vm.createContext(context);
    vm.runInContext(code('automation/presentation.js'), context);
    vm.runInContext(code('automation/work.js'), context);
    listeners.get(detail ? 'automation/work/' + detail.work.id : type ? 'automation/types/' + type : 'automation')({ now: '2026-11-21T02:00:00Z', data: { ...types.find(row => row.id === type),
      enabled: true, audience, types, routines, scheduled_activities, other_automatic_chats, ...extra, ...detail } });
    return root.innerHTML;
  }
  for (const audience of ['owner', 'public']) {
    const work = { id: 'holder', title: '隔离修理', group: 'running', state_text: '已占位 · 会话状态未读到' };
    const rounds = [{ id: '1', label: '验收', status: 'running', requested_effort: 'xhigh', executor: '未确认型号' },
      { id: '2', label: '修理', chat_state: 'running', chat_state_text: '在跑', actual_model: 'GPT Sol', last_activity_at: '2026-11-20T09:00:00Z' }];
    const detail = render(audience, '', {}, { work, rounds });
    assert.match(detail, /已占位 · 会话状态未读到.*验收 · 会话状态未读到.*修理 · 在跑 · GPT Sol · 上次动静 2026-11-20 09:00/s);
    assert.doesNotMatch(detail, /进行中|xhigh|未确认型号/);
    assert.match(detail, /id="round-1" class="is-past".*id="round-2" class="is-current".*class="is-future".*独立验收.*class="is-future".*关单/s);
    assert.match(detail, /修理路线：这次没读到，下一轮会自动再读。/);
    assert.match(render(audience, '', {}, { work, rounds, repair_route: '路线甲', result_text: '结果乙' }), /修理路线：路线甲.*结果：结果乙/s);
    assert.doesNotMatch(render(audience, '', {}, { work: { ...work, group: 'done' }, rounds }), /is-current|is-future/);
    const verification = { id: 'verify', type_id: 'acceptance', title: '核实本人事项', group: 'followup', state_text: '等回执再核实' };
    const waiting = render(audience, '', {}, { work: verification, rounds: [
      { id: 'r1', label: '验收', end_at: '2026-11-21T00:00:00Z', verdict: 'not_fixed', proof: { business: '没修好' } },
    ] });
    assert.match(waiting, /等回执再核实.*核实结论.*还不能确认/s);
    assert.doesNotMatch(waiting, /is-future|修理路线|关单|没修好/);
    const confirmed = render(audience, '', {}, { work: { ...verification, group: 'done', state_text: '已经核实' }, rounds: [
      { id: 'r2', label: '验收', end_at: '2026-11-21T01:00:00Z', verdict: 'fixed', proof: { business: '回执符合原条件' } },
    ] });
    assert.match(confirmed, /已经核实.*核实结论.*回执符合原条件/s);
    assert.doesNotMatch(confirmed, /is-future|修理路线|关单/);
    for (const type of ['ai-review', 'ai-stalled']) {
      assert.match(render(audience, type), /这一类只显示，不派人修.*管：.*比如.*不管：/s);
      assert.doesNotMatch(render(audience, type), /data-setting|默认档位|关了：|设置记录/);
    }
    const backup = render(audience, 'backup');
    assert.match(backup, /<span class="aw-type__model">Sol · high<\/span>.*管：<\/b>(?:<[^>]+>)*测试范围.*关了：.*aw-example-tag">比如<.*设置记录.*这里还看不到.*不管：<\/b>要(?:你)?本人恢复原件/s);
    const steps = backup.match(/<ul class="aw-mechanism__rows">(.*?)<\/ul>/s)?.[1] || '';
    assert.ok(steps.replace(/<[^>]+>/g, '').includes(audience === 'owner' ? '什么时候派：要你本人确认' : '什么时候派：要本人确认'));
    assert.match(render(audience, 'backup', { setting_log: [] }), /设置记录.*还没改过设置/s);
  }
});

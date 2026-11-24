import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../site-v2/first-layer/connect-auth/demo/auth.js', import.meta.url), 'utf8');
function setup(owner = false) {
  const calls = [], messages = [], receipts = [], failures = [];
  const context = vm.createContext({
    local: false, busy: false, pending: null, disconnected: false, fresh: () => true,
    state: owner ? { state_version: 'v1', personal_data: { state: 'unlocked' } } : { personal_data: { state: 'private' } },
    meta: { viewer: { kind: owner ? 'owner' : 'public' } }, fields: { pd: 'personal_data' }, kinds: { pd: 'personal-data' },
    lockIds: {}, deals: { pd: { sync() {} } }, base: '', readAfter: 0, clock: () => 123,
    cooldownUntil: 0, cooldownRead: null, openKey: null,
    crypto: { randomUUID: () => `request-${calls.length}` }, localStorage: { getItem: () => owner ? 'device' : null },
    window: { Live: { refresh() {} }, TrustModal: { show() { throw Error('unexpected modal'); } } },
    remember(value) { context.pending = value; }, render() {}, setOpen() {},
    message: text => messages.push(text), receipt(value) { receipts.push(value); context.pending = null; },
    begin() {}, waiting() {}, failed: (_key, text) => failures.push(text),
    recovery: { start() {} }, errorMessages: {}, untilText: String,
    reductionFailureResult: error => ({ state: 'failed', error: error.data.error }),
    apiRequest: async (_base, path, options) => {
      if (path === '/requests/cooldown') return { cooldown_until_unix: context.sourceCooldown || 0 };
      calls.push({ path, ...JSON.parse(JSON.stringify(options)) });
      if (context.failure) throw { data: { error: context.failure } };
      if (context.required) { context.required = false; throw { data: { error: 'public_totp_required' } }; }
      return context.response || { status: 'pass', state: 'succeeded', action: 'personal-data', personal_data: { state: 'locked' } }; },
  });
  vm.runInContext(source.slice(source.indexOf('  const lockMessages'), source.indexOf('  function message')), context);
  vm.runInContext(source.slice(source.indexOf('  function openLock'), source.indexOf('  const recovery =')), context);
  return { context, calls, messages, receipts, failures };
}

test('public lock uses the existing code flow, omits absent version, and retries required with the same ID', async () => {
  const { context: c, calls, messages } = setup();
  c.fresh = () => false;
  await c.lock('pd');
  assert.equal(calls.length, 0);
  assert.equal(messages[0], '输动态码确认是本人');
  c.state.state_version = 'public-must-not-send';
  await c.lock('pd', '123456');
  assert.deepEqual(calls[0].body, { request_id: 'request-0', totp: '123456' });
  assert.equal(calls[0].path, '/locks/personal-data');
  const fallback = setup(true); fallback.context.required = true;
  await fallback.context.lock('pd');
  await fallback.context.lock('pd', '654321');
  assert.equal(fallback.calls[0].body.request_id, fallback.calls[1].body.request_id);
  assert.equal(fallback.calls[1].body.totp, '654321');
});

test('HTTP 200 blocked receipts show the failure notice and use a new ID for the next code', async () => {
  for (const [error, text] of Object.entries({ totp_verification_failed: '码不对，这次没办成，请再输一次', public_totp_code_already_used: '码用过了，请等下一个再输', public_totp_format_invalid: '请填完整的六位码', public_totp_not_ready: '验证器暂时用不了。', public_totp_cooldown: '456000 再试' })) {
    const { context: c, calls, failures, receipts } = setup();
    c.response = { status: 'blocked', state: 'failed', error, cooldown_until_unix: error === 'public_totp_cooldown' ? 456 : 0 };
    await c.lock('pd');
    await c.lock('pd', '000000');
    assert.equal(failures.at(-1), text);
    assert.equal(c.pending, null);
    assert.equal(receipts.length, 0);
    assert.equal(c.state.personal_data.state, 'private');
    c.response = null;
    await c.lock('pd', '123456');
    assert.notEqual(calls[0].body.request_id, calls[1].body.request_id);
    assert.equal(receipts[0].state, 'succeeded');
  }
});

test('paired device still locks directly without a code', async () => {
  const { context: c, calls, receipts } = setup(true);
  await c.lock('pd');
  assert.deepEqual(calls[0].body, { request_id: 'request-0', state_version: 'v1' });
  assert.equal(calls[0].device, 'device');
  assert.equal(receipts[0].state, 'succeeded');
  c.failure = 'public_state_changed';
  await c.lock('pd');
  assert.equal(calls.length, 3);   // 旧状态被拒：重读一次、换新编号再办一次
  assert.notEqual(calls[1].body.request_id, calls[2].body.request_id);
  assert.equal(receipts[1].error, 'public_state_changed');
  assert.equal(receipts[1].state, 'failed');
});

test('the authorization form only uses its separately read source deadline', async () => {
  const { context: c, messages } = setup();
  c.state.policy = { factor: { cooldown_until_unix: 99999 } };
  c.openKey = 'pd';
  c.sourceCooldown = 456;
  c.refreshCooldown();
  await c.cooldownRead;
  assert.equal(c.cooldownUntil, 456);
  assert.equal(messages.at(-1), '456000 再试');
  c.sourceCooldown = 0;
  c.refreshCooldown();
  await c.cooldownRead;
  assert.equal(c.cooldownUntil, 0);
});

test('public lock receipt records the lock time separately from private state',()=>{
 const lockedAt={},fixed=Date.UTC(2026,10,16,19,11),c={lockedAt,BJ:8*3600e3,pad:n=>String(n).padStart(2,'0'),Date:class extends Date{static now(){return fixed}},state:{personal_data:{state:'private'}},fields:{pd:'personal_data'},openKey:'pd',pending:null,setOpen(){},message(){},remember(){},waiting(){},settle(){},successText:()=>['',''],toast(){},celebrate(){},keysOf:()=>[],grantResultNeedsQuery:()=>false,cooldownText:()=>'',unsure:''};
 vm.runInNewContext(source.slice(source.indexOf('  function receipt('),source.indexOf('  async function query('))+';this.receive=receipt;',c);
 c.receive({action:'personal-data',state:'succeeded'});assert.equal(lockedAt.pd,'03:11');
});

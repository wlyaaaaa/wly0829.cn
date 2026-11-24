// 真状态由共享读层提供；写操作复用原授权模型及 Cookie 会话。
(async () => {
  const { HOST_ORIGIN, apiRequest, createGrantAttempt, createGrantRecovery, grantResultNeedsQuery, canRestartUnsubmittedGrant, isAccessOrigin,
    durationMinutes, remainingMinutes, reductionFailureResult, successfulGrantSnapshot, successfulReductionSnapshot } = await import('/app/computer-access-model.js');
  if (!window.Live) await new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = '/live/_lib/live-client.js'; s.onload = resolve; s.onerror = reject; document.head.append(s); });
  const local = !isAccessOrigin(location.origin, window.top === window);
  const base = location.origin === HOST_ORIGIN ? '' : HOST_ORIGIN;
  const fields = { pd: 'personal_data', ur: 'unrestricted', win: 'windows' };
  const kinds = { pd: 'personal-data', ur: 'unrestricted', win: 'windows' };
  const cells = Object.fromEntries([...document.querySelectorAll('.cell')].map(e => [e.dataset.key, e]));
  const bar = document.getElementById('dealbar'), wrap = bar.querySelector('.dealbar__wrap');
  // 请求发出去以后，在那一块的“锁定／结束”后面摆一颗“取消请求”（本人 11-24：查看原请求没有意义，去掉；取消请求放锁定后面，请求后显示）
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button'; cancelButton.className = 'btn btn--cancel'; cancelButton.textContent = '取消请求'; cancelButton.dataset.moPress = '';
  const storageKey = 'site-v2-access-request';
  const lockIds = {}, lockedAt = {};
  let state = null, meta = {}, online = false, disconnected = false, openKey = null, busy = false, attempt = null, pending = null, readAfter = 0, winMessage = '', inlineAction = null;
  let reading = true;   // 第一份授权状态回来之前：三块都写“正在读…”，不摆按钮，不写像出错的“状态未知”
  let cooldownUntil = 0, cooldownRead = null;
  let notice = null, shown = null;   // 这一页最近一张成功／失败浮窗；刚办成、新读数还没跟上时先照回执显示的那几项
  if (!local) { try { pending = JSON.parse(sessionStorage.getItem(storageKey) || 'null'); } catch {} }
  const clock = () => Date.now() / 1000;
  // 照定稿样板：到今天 18:30／到明天 10:04／到周一 10:04，按北京时间换日。
  const BJ = 8 * 3600e3;
  const dayOf = ms => Math.floor((ms + BJ) / 86400e3);
  const pad = n => String(n).padStart(2, '0');
  function untilText(ms) {
    const d = new Date(ms + BJ), diff = dayOf(ms) - dayOf(Date.now());
    const day = diff <= 0 ? '今天' : diff === 1 ? '明天' : '周' + '日一二三四五六'[d.getUTCDay()];
    return `到${day} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  }
  const fresh = () => online && meta.source === 'net' && Number.isFinite(Date.parse(meta.at)) && Math.abs(clock() - Date.parse(meta.at) / 1000) <= 120 && Date.parse(meta.at) / 1000 >= readAfter;
  const entry = () => { if (state?.entry) window.open(state.entry, '_blank', 'noopener'); };
  const unsure = '结果还没确认，页面会自己再核对。';
  const errorMessages = {
    totp_verification_failed: '码不对，这次没办成，请再输一次', invalid_totp: '码不对，这次没办成，请再输一次',
    public_totp_code_already_used: '码用过了，请等下一个再输',
    public_totp_format_invalid: '请填完整的六位码', public_factor_not_submitted: '验证码还没提交。请重新输入验证码，继续这次请求。',
    public_totp_cooldown: '要等一会儿，再试。', cooldown: '要等一会儿，再试。',
    public_totp_not_ready: '验证器暂时用不了。', factor_unavailable: '验证器暂时用不了。',
    public_request_expired: '超时了，请重新办。', expired: '超时了，请重新办。',
    public_state_changed: '状态变了，请重新办。', state_conflict: '状态变了，请重新办。', state_version_mismatch: '状态变了，请重新办。',
    public_access_busy: '电脑正在忙，稍后再试。', public_access_entry_failed: '这次没办成，请再试。',
    public_request_temporarily_busy: '电脑正在办理其他请求，请稍后再试。',
    public_request_rate_limited: '这条连接提交太频繁，请稍后再试。',
    public_request_source_capacity: '这条连接有待确认的请求或近期记录已满，请稍后再试。',
    public_access_response_unknown: unsure, public_action_result_unknown: unsure,
    public_duration_total_exceeds_72_hours: '超过 72 小时了，请少填些。', duration_limit: '超过 72 小时了，请少填些。',
    cancelled: '这次已取消。', disabled: '这一步已停用。',
  };
  const lockMessages = {
    totp_verification_failed: '码不对，这次没办成，请再输一次', public_totp_code_already_used: '码用过了，请等下一个再输',
    public_totp_format_invalid: '请填完整的六位码', public_totp_cooldown: '要等一会儿，再试。',
    public_totp_not_ready: '验证器暂时用不了。', public_state_changed: '状态变了，请再按一次',
  };
  const cooldownText = () => cooldownUntil > clock() ? `${untilText(cooldownUntil * 1000)} 再试` : '';

  function refreshCooldown() {
    if (local || busy || disconnected || cooldownRead) return;
    const before = readAfter;
    cooldownRead = apiRequest(base, '/requests/cooldown', { timeout: 4000 }).then(value => {
      if (readAfter !== before || !Number.isFinite(value.cooldown_until_unix)) return;
      cooldownUntil = value.cooldown_until_unix;
      if (openKey) {
        if (cooldownText()) message(cooldownText());
        deals[openKey].sync();
      }
    }).catch(() => {}).finally(() => { cooldownRead = null; });
  }
  function message(text) {
    if (pending?.action === 'windows') { winMessage = text; return; }
    const key = openKey || pending?.key;
    if (key && text) setOpen(key);
    const msg = deals[key]?.root.querySelector('.go__msg');
    if (msg) {
      const root = deals[key].root, locking = root.classList.contains('is-lock');
      // 锁定、结束：上面一行说怎么办，下面一行只放“几点再试”这类要一直看着的话；码不对这类结果走浮窗
      if (locking) { const hint = document.createElement('span'), note = document.createElement('span'); hint.className = 'lock-hint'; hint.textContent = `打开手机验证器，输入六位动态码后点${({ pd: '锁定', ur: '结束', win: '锁屏' })[key]}`; note.className = 'lock-error'; note.textContent = text && text !== '输动态码确认是本人' ? text : ''; msg.replaceChildren(hint, note); }
      else msg.textContent = text;
      msg.classList.toggle('is-shown', locking || !!text);
    }
  }
  // 成功、失败都弹全站共用的通知浮窗（本人选的 B 版：一个样子，带 × 和倒计时细线）；新的一次开始就收掉上一张
  function toast(ok, head, name = '') {
    notice?.close();
    notice = window.SiteNotice?.() || null;
    notice?.set(ok ? 'ok' : 'fail', head, { name, hold: ok ? 7000 : 10000 });
  }
  const keysOf = value => ['pd', 'ur'].filter(k => value?.[fields[k]] && value[fields[k]].state !== 'not_requested');
  // 等结果：那一块的边框绕一圈绿光、码格里一道光流过，直到出结果
  function waiting(keys, on) {
    for (const k of Object.keys(cells)) cells[k].classList.toggle('is-waiting', on && keys.includes(k));
    for (const k of ['pd', 'ur', 'win']) {
      const root = deals[k].root, active = on && keys.includes(k);
      root.classList.toggle('is-waiting', active);
      if (active) { root.classList.remove('has-error'); root.querySelectorAll('.code input').forEach(b => { b.placeholder = '•'; }); }
    }
  }
  function begin(keys) { notice?.close(); notice = null; if (openKey) message(openKeyLocking() ? cooldownText() : ''); waiting(keys, true); }
  const openKeyLocking = () => !!openKey && deals[openKey].root.classList.contains('is-lock');
  function failed(key, head) {
    waiting([], false);
    toast(false, head);
    const root = openKey === key && deals[key]?.root;
    if (!root) return;
    root.classList.add('has-error');
    const code = root.querySelector('.code'); code.classList.remove('is-wrong'); void code.offsetWidth; code.classList.add('is-wrong');
  }
  // 办成那一刻：灯荡开光波、卡片泛起绿光、时间翻到位（1 秒，一次）
  function celebrate(keys) {
    for (const k of keys) { const cell = cells[k]; cell.classList.remove('is-success'); void cell.offsetWidth; cell.classList.add('is-success'); setTimeout(() => cell.classList.remove('is-success'), 1400); }
  }
  // 刚办成：照回执先把新状态画上，新读数跟上之前不退回旧的（本人 11-24：授权成功刷新很慢）
  function settle(value) {
    const next = value.action ? successfulReductionSnapshot(state, value, true) || lockedSnapshot(value) : successfulGrantSnapshot(state, value, true);
    if (!next) return;
    const keys = value.action ? [({ 'personal-data': 'pd', unrestricted: 'ur', windows: 'win' })[value.action]] : keysOf(value);
    shown = { at: clock(), parts: Object.fromEntries(keys.map(k => [fields[k], next[fields[k]]])) };
    state = next;
  }
  function lockedSnapshot(value) {
    if (value.action === 'windows') return state?.windows ? { ...state, state_version: '', windows: { ...state.windows, state: 'locked' } } : null;
    const key = ({ 'personal-data': 'pd', unrestricted: 'ur' })[value.action];
    if (!key || state?.[fields[key]]?.state === 'private') return null;
    return { ...state, state_version: '', [fields[key]]: { ...state?.[fields[key]], state: key === 'pd' ? 'locked' : 'inactive', expires_at_unix: 0 } };
  }
  function keepShown(value) {
    if (!shown || !value) return value;
    const left = Object.entries(shown.parts).filter(([k]) => !(value[k]?.observed_at_unix >= shown.at) && clock() - shown.at < 60);
    if (!left.length) { shown = null; return value; }
    return { ...value, ...Object.fromEntries(left) };
  }
  function successText(value, before) {
    if (value.action) return [({ 'personal-data': '个人资料已锁上', unrestricted: '无限制授权已结束', windows: 'Windows 已锁屏' })[value.action], ''];
    const keys = keysOf(value), until = k => untilText(value[fields[k]].expires_at_unix * 1000);
    const verb = k => remainingMinutes(before?.[fields[k]], clock()) > 0 ? '已延长' : k === 'pd' ? '已解锁' : '已开启';
    const name = { pd: '个人资料', ur: '无限制授权' };
    if (keys.length === 1 && Number.isFinite(value[fields[keys[0]]]?.expires_at_unix)) return [`${name[keys[0]]}${verb(keys[0])} · ${until(keys[0])}`, ''];
    if (keys.length === 2 && keys.every(k => Number.isFinite(value[fields[k]]?.expires_at_unix))) return ['两项都办好了', keys.map(k => `${name[k]}${until(k)}`).join(' · ')];
    return ['办好了', ''];
  }
  function remember(value) {
    pending = value && grantResultNeedsQuery(value) ? { request_id: value.request_id, action: value.action, state: value.state, factor_submitted: value.factor_submitted, request_created: value.request_created, key: openKey || pending?.key || ({ 'personal-data': 'pd', unrestricted: 'ur' }[value.action]) } : null;
    // Store no factor, CSRF token or local authority; reload only queries this ID.
    if (pending) sessionStorage.setItem(storageKey, JSON.stringify(pending)); else sessionStorage.removeItem(storageKey);
  }
  function receipt(value) {
    if (!value) return;
    if (Number.isFinite(value.cooldown_until_unix)) cooldownUntil = value.cooldown_until_unix;
    const lockedKey = ({ 'personal-data': 'pd', unrestricted: 'ur' })[value.action];
    if (value.state === 'succeeded' && lockedKey && state?.[fields[lockedKey]]?.state === 'private') {
      const d = new Date(Date.now() + BJ);
      lockedAt[lockedKey] = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
    }
    {
      waiting([], false);
      const windows = value.action === 'windows';
      const key = windows ? 'win' : openKey || pending?.key || (value.action === 'unrestricted' || value.personal_data?.state === 'not_requested' ? 'ur' : 'pd');
      const stateText = windows ? ({ public_windows_lock_disabled: '锁屏入口已停用', interactive_screen_lock_noninteractive: '没有可锁的桌面' }[value.error]) || (!errorMessages[value.error] && '这次没锁上')
        : { failed: '这次没办成，请再试。', expired: '超时了，请重新办。', partial: '有一项没办成，请看状态。' }[value.state];
      if (windows) winMessage = '';
      if (value.state === 'succeeded') {
        const before = state; settle(value);
        const [head, name] = successText(value, before);
        setOpen(null); toast(true, head, name);
        if (!value.action) celebrate(keysOf(value));
      } else if (value.state === 'cancelled' && !grantResultNeedsQuery(value)) { message(''); toast(true, '已取消这次请求'); }
      else if (grantResultNeedsQuery(value)) { if (windows) winMessage = '锁屏结果还没确认'; else message(cooldownText() || errorMessages[value.error] || stateText || unsure); }
      else {
        if (!value.action && openKey !== key) setOpen(key, false);
        if (openKey === key) message(cooldownText());
        failed(key, cooldownText() || errorMessages[value.error] || stateText || '这次没办成，请再试。');
      }
    }
    remember(value);
  }
  async function query(cancel = false) {
    if (local) return entry();
    if (busy || !pending) return;
    busy = true; render();
    try {
      const old = pending, path = '/requests/' + encodeURIComponent(old.request_id);
      let value = await apiRequest(base, path);
      if (cancel && value.csrf_token) value = await apiRequest(base, path + '/cancel', { method: 'POST', csrf: value.csrf_token, body: {} });
      const awaitingCode = !old.action && old.factor_submitted === false && value.state === 'pending';
      receipt({ ...value, action: old.action || value.action, request_created: true,
        factor_submitted: value.factor_submitted ?? old.factor_submitted,
        ...(awaitingCode && { error: 'public_factor_not_submitted' }) });
    } catch (error) {
      if (!pending?.action && canRestartUnsubmittedGrant(pending, null, error)) { message('码还没提交，请重新办。'); remember(null); }
      else message(unsure);
    }
    finally { busy = false; render(); window.Live.refresh(); }
  }
  function canRetryPending(key) {
    return !!pending && !pending.action && pending.key === key && pending.state === 'pending' && pending.request_created && pending.factor_submitted === false;
  }
  async function submit(key, hours, combined, code) {
    if (local) return entry();
    const retry = canRetryPending(key);
    if (busy || disconnected || (pending ? !retry : !fresh() || !state?.state_version)) return;
    const id = retry ? pending.request_id : crypto.randomUUID(); busy = true; readAfter = clock();
    begin(combined ? ['pd', 'ur'] : [key]);
    try {
      remember({ request_id: id, state: 'pending', request_created: retry, factor_submitted: false });
      attempt = createGrantAttempt({ requestId: id, existing: retry, body: { purpose: fields[key], combined, duration_hours: hours, state_version: state?.state_version, save_default: false },
        api: (p, o) => apiRequest(base, p, o), onCreated: value => remember({ ...value, request_created: true, factor_submitted: false }),
        onVerificationStarted: () => remember({ ...pending, state: 'verifying', factor_submitted: true }) });
      render(); receipt(await attempt.run(code));
    } catch (error) {
      const text = errorMessages[error.data?.error];
      if (text && text !== unsure && !grantResultNeedsQuery(pending)) failed(key, text); else { waiting([], false); message(text || unsure); }
    }
    finally { attempt = null; busy = false; waiting([], false); render(); window.Live.refresh(); if (openKey) refreshCooldown(); if (pending) recovery.start(); }
  }
  function openLock(key, id = crypto.randomUUID()) {
    lockIds[key] = id; setOpen(key, true); message(cooldownText() || '输动态码确认是本人'); render(); refreshCooldown();
  }
  // 锁定、结束：配对过的设备随时直接点（再点一下确认），不等“状态是最新的”；没配对的设备输动态码办。两种设备走同一个接口。
  async function lock(key, code) {
    if (local) return entry();
    const owner = meta.viewer?.kind === 'owner';
    if (busy || pending || disconnected) return;
    if (!owner && !code) return openLock(key);
    const action = kinds[key]; let id = code ? lockIds[key] : crypto.randomUUID(); busy = true; readAfter = clock();
    begin([key]);
    try {
      for (let round = 0; ; round++) {
        remember({ request_id: id, action, state: 'pending' }); render();
        try {
          const value = await apiRequest(base, '/locks/' + action, { method: 'POST', body: { request_id: id, ...(owner && state?.state_version ? { state_version: state.state_version } : {}), ...(code ? { totp: code } : {}) }, device: localStorage.getItem('wly-cockpit-device') });
          if (value.status === 'blocked') throw { data: value };
          receipt({ ...value, action });
          break;
        } catch (error) {
          // 配对过的设备拿着旧状态点的：重读一次、用新状态再办一次
          if (!(owner && !code && round === 0 && error?.data?.error === 'public_state_changed')) throw error;
          remember(null); await window.Live.refresh(); id = crypto.randomUUID();
        }
      }
    } catch (error) {
      const data = error.data, reason = data?.error;
      if (reason === 'public_totp_required') { remember(null); waiting([], false); openLock(key, id); }
      else if (code && (reason?.startsWith('public_totp_') || reason === 'totp_verification_failed' || reason === 'public_state_changed')) {
        remember(null); lockIds[key] = crypto.randomUUID();
        if (reason === 'public_state_changed') await window.Live.refresh();
        if (Number.isFinite(data.cooldown_until_unix)) cooldownUntil = data.cooldown_until_unix;
        message(cooldownText());
        failed(key, cooldownText() || lockMessages[reason]);
      } else { receipt(reductionFailureResult(error, id, action)); if (reason === 'cockpit_owner_required') window.TrustModal?.show(); }
    }
    finally { busy = false; waiting([], false); render(); window.Live.refresh(); if (openKey) refreshCooldown(); if (pending) recovery.start(); }
  }
  const recovery = createGrantRecovery(() => query(), { canQuery: () => !local && !!pending && !busy });
  cancelButton.onclick = async () => {
    if (local) return entry();
    if (attempt) { try { receipt(await attempt.cancel()); } catch { message('取消还没确认，页面会自己再核对。'); } }
    else await query(true);
    render();
  };
  const deals = {};
  for (const key of ['pd', 'ur', 'win']) {
    const frag = document.getElementById('deal-tpl').content.cloneNode(true), root = frag.querySelector('.deal');
    root.dataset.key = key; bar.querySelector('.dealbar__deals').append(frag);
    const chips = [...root.querySelectorAll('.chip[data-h]')], own = root.querySelector('.chip--own input'), fill = root.querySelector('.chip--fill');
    const boxes = [...root.querySelectorAll('.code input')], go = root.querySelector('.go__btn');
    const both = root.querySelector('.both input'), ownChip = own.closest('.chip--own'); let hours = '', touched = false;
    function pick(h) { hours = String(h); chips.forEach(c => c.setAttribute('aria-checked', String(c.dataset.h === hours))); own.value = chips.some(c => c.dataset.h === hours) ? '' : hours; ownChip.setAttribute('aria-checked', String(!!own.value)); }
    // 还能加多少：总上限（72 小时）减去这次要办的那几项里剩得最多的；按 0.1 小时往下取整，不会超
    function room() {
      const p = state?.policy;
      if (!p || !Number.isFinite(p.maximum_minutes)) return null;
      const keys = both.checked ? ['personal_data', 'unrestricted'] : [fields[key]];
      return Math.max(0, p.maximum_minutes - Math.max(...keys.map(k => remainingMinutes(state[k], clock()) || 0)));
    }
    const roomHours = m => Math.floor(m / 6) / 10;
    // 填的超过还能加的，直接收回到上限（本人 11-24）
    function clamp() {
      const m = room(), asked = parseFloat(hours);
      if (m === null || !(asked > 0) || asked * 60 <= m || m < (state.policy.minimum_minutes || 30)) return;
      pick(roomHours(m));
    }
    chips.forEach(c => c.onclick = () => { touched = true; pick(c.dataset.h); sync(); });
    own.oninput = () => { touched = true; hours = own.value; chips.forEach(c => c.setAttribute('aria-checked', 'false')); ownChip.setAttribute('aria-checked', String(!!own.value)); sync(); };
    fill.onclick = () => { const m = room(); if (m === null) return; touched = true; pick(roomHours(m)); sync(); };
    const code = () => boxes.map(b => b.value).join('');
    function sync() {
      const p = state?.policy, retry = canRetryPending(key);
      root.classList.toggle('is-retry', retry);
      go.classList.toggle('is-busy', busy && root.classList.contains('is-waiting'));
      // 可用不足的预设置灰；“补充到上限”和自己填的格子写明还能加几小时（本人 11-24：上限 72 小时）
      const m = room(), least = p?.minimum_minutes || 30;
      clamp();
      for (const c of chips) {
        const over = m !== null && durationMinutes(c.dataset.h) > m;
        c.disabled = over; c.title = over ? `超过还能加的 ${roomHours(m)} 小时` : '';
      }
      fill.disabled = m === null || m < least;
      fill.title = m === null ? '' : m < least ? '已经到 72 小时上限' : `补到 ${roomHours(m)} 小时（总共最多 72 小时）`;
      own.disabled = m !== null && m < least;
      own.setAttribute('aria-label', `自己填几小时，0.5 到 ${m === null ? 72 : roomHours(m)}`);
      const minutes = durationMinutes(hours);
      const keys = both.checked ? ['personal_data', 'unrestricted'] : [fields[key]];
      if (root.classList.contains('is-lock')) { go.disabled = busy || !!pending || disconnected || !/^\d{6}$/.test(code()) || cooldownUntil > clock(); return; }
      go.textContent = retry ? '重新验证' : '验证';
      if (retry) { go.disabled = busy || disconnected || !/^\d{6}$/.test(code()) || cooldownUntil > clock(); return; }
      go.disabled = busy || !!pending || !fresh() || !/^\d{6}$/.test(code()) || minutes === null || !p?.factor?.available || cooldownUntil > clock() || minutes < p.minimum_minutes || keys.some(k => (remainingMinutes(state[k], clock()) || 0) + minutes > p.maximum_minutes);
    }
    boxes.forEach((box, i) => {
      box.oninput = () => { if (root.classList.contains('has-error')) { root.classList.remove('has-error'); boxes.forEach(b => { b.placeholder = ''; }); } box.value = box.value.replace(/\D/g, '').slice(-1); if (box.value) boxes[i + 1]?.focus(); sync(); };
      box.onkeydown = e => { if (e.key === 'Backspace' && !box.value) boxes[i - 1]?.focus(); if (e.key === 'Enter' && !go.disabled) go.click(); };
      box.onpaste = e => { root.classList.remove('has-error'); boxes.forEach(b => { b.placeholder = ''; }); e.preventDefault(); [...e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6 - i)].forEach((n, j) => { boxes[i + j].value = n; }); sync(); };
    });
    both.onchange = sync;
    go.onclick = () => { const typed = code(); boxes.forEach(b => { b.value = ''; }); root.classList.contains('is-lock') ? lock(key, typed) : submit(key, hours, both.checked, typed); };
    deals[key] = { root, sync, defaults() { if (!touched && Number.isFinite(state?.policy?.default_minutes)) pick(state.policy.default_minutes / 60); },
      clear() { if (!root.classList.contains('is-waiting') && !root.classList.contains('has-error')) boxes.forEach(b => { b.placeholder = ''; }); } };
  }
  function setOpen(key, locking = deals[key]?.root.classList.contains('is-lock')) {
    inlineAction = null;
    openKey = key; bar.classList.toggle('is-open', !!key);
    if (key) { deals[key].root.classList.toggle('is-lock', !!locking); deals[key].root.querySelector('.go__btn').classList.toggle('btn--ink', !locking); deals[key].root.querySelector('.go__btn').textContent = locking ? ({ pd: '锁定', ur: '结束', win: '锁屏' })[key] : '验证'; }
    for (const k of ['pd', 'ur', 'win']) { cells[k].classList.toggle('is-open', key === k); deals[k].root.classList.toggle('is-active', key === k); }
    if (key) { const b = cells[key].querySelector(`[data-kind="${locking ? 'close' : 'open'}"]`); if (b) wrap.style.setProperty('--nx', (b.getBoundingClientRect().left + b.offsetWidth / 2 - wrap.getBoundingClientRect().left) + 'px'); }
  }
  const offlineNote = document.createElement('p'); offlineNote.className = 'auth-offline'; document.querySelector('.cells').after(offlineNote);
  function render() {
    const missingStatus = '授权状态暂时读不到，刷新后再试。';
    offlineNote.hidden = !disconnected;
    cancelButton.disabled = busy && !attempt;
    for (const [key, cell] of Object.entries(cells)) {
      const grant = state?.[fields[key]], active = key === 'win' ? grant?.state === 'unlocked' : remainingMinutes(grant, clock()) > 0;
      const privateState = grant?.state === 'private';
      cell.classList.toggle('is-on', !disconnected && active);
      cell.classList.toggle('is-private', !disconnected && privateState);
      cell.classList.toggle('has-receipt', !disconnected && !!lockedAt[key]);
      const stateLine = cell.querySelector('.cell__state');
      const loading = reading && !disconnected && !state;
      stateLine.textContent = disconnected ? '连不上' : loading ? '正在读…' : !state ? missingStatus
        : privateState ? '' : key === 'win' ? winMessage || ({ locked: '已锁屏', unlocked: '没锁', no_session: '没有登录' }[grant?.state] || '还没读到')
        : active ? untilText(grant.expires_at_unix * 1000) : !grant || grant.state === 'unknown' ? '状态未知' : key === 'pd' ? '锁着' : '关着';
      if (privateState && !disconnected) {
        const note = document.createElement('button'); note.type = 'button'; note.className = 'trust-note'; note.dataset.trustView = '';
        note.textContent = '可信设备可见'; stateLine.append(note);
      }
      let result = cell.querySelector('.cell__receipt');
      if (!result) { result = document.createElement('p'); result.className = 'cell__receipt'; result.setAttribute('aria-live', 'polite'); stateLine.after(result); }
      result.hidden = disconnected || !lockedAt[key]; result.replaceChildren();
      if (!result.hidden) { const title = document.createElement('strong'), time = document.createElement('span'); title.textContent = key === 'pd' ? '已锁上' : '已结束'; time.textContent = `${lockedAt[key]} ${key === 'pd' ? '锁上' : '结束'}`; result.append(title, time); }
      const acts = cell.querySelector('.cell__acts'); acts.replaceChildren();
      cell.querySelector('.cell__inline')?.remove();
      const actions = disconnected || loading || key === 'win' && pending?.action === 'windows' ? [] : key === 'win' ? (grant?.state === 'locked' || grant?.state === 'no_session' ? [] : [['锁屏', 'close']])
        : [[active ? '延长' : key === 'pd' ? '解锁' : '开启', 'open'], ...(active || privateState ? [[key === 'pd' ? '锁定' : '结束', 'close']] : [])];
      for (const [label, kind] of actions) {
        const b = document.createElement('button'); b.className = 'btn'; b.textContent = label; b.dataset.kind = kind;
        // 禁用时写明原因（悬停可见，扫描也认 data-disabled-reason）。锁定、结束随时能点，不等“状态是最新的”（本人 11-24）
        const anytime = kind === 'close' && !local;
        const why = !state ? missingStatus : !anytime && !state.entry ? '办理入口还没读到' : local ? '' : busy ? '正在办上一步'
          : pending ? '还有一步在等确认' : !anytime && !privateState && (!fresh() || !state.state_version) ? '状态不是最新的，刷新后再试' : '';
        b.disabled = !!why; if (why) { b.dataset.disabledReason = why; b.title = why; }
        const inline = local || kind === 'close' && meta.viewer?.kind === 'owner' && !privateState;
        if (inline) b.setAttribute('aria-expanded', String(inlineAction?.key === key && inlineAction?.kind === kind));
        else if (kind === 'open' && !privateState) b.setAttribute('aria-expanded', String(openKey === key && !deals[key].root.classList.contains('is-lock')));
        else if (kind === 'close') b.setAttribute('aria-expanded', String(openKey === key && deals[key].root.classList.contains('is-lock')));
        b.onclick = () => {
          if (inline) {
            const again = inlineAction?.key === key && inlineAction?.kind === kind;
            setOpen(null);
            inlineAction = again ? null : { key, kind, label };
            render();
            if (!again) cells[key].querySelector('.cell__inline :is(a,button)')?.focus();
          } else if (privateState) {
            if (kind === 'close') lock(key);
            else window.TrustModal?.show();
          } else if (kind === 'open') {
            setOpen(openKey === key ? null : key, false);
            render();
            if (openKey) refreshCooldown();
            cells[key].querySelector('[data-kind="open"]')?.focus();
          } else lock(key);
        };
        acts.append(b);
      }
      // 这一块的请求发出去、还没出结果时，“取消请求”跟在锁定／结束后面
      if (key !== 'win' && !disconnected && pending && !pending.action && pending.key === key && grantResultNeedsQuery(pending)) acts.append(cancelButton);
      if (inlineAction?.key === key && !disconnected && !pending && actions.some(([, kind]) => kind === inlineAction.kind)) {
        const panel = document.createElement('p'); panel.className = 'cell__inline';
        if (local && inlineAction.kind === 'open') {
          const go = document.createElement('button'); go.type = 'button'; go.className = 'btn';
          go.textContent = `去授权页验证并${inlineAction.label}`; go.onclick = entry;
          panel.append(go);
        } else if (local) {
          const link = document.createElement('a');
          link.href = state.entry; link.target = '_blank'; link.rel = 'noopener';
          link.textContent = '限时通行证 ↗';
          panel.append(`在原授权入口完成${inlineAction.label}。`, link);
        } else {
          const confirm = document.createElement('button'); confirm.type = 'button'; confirm.className = 'btn';
          confirm.textContent = `确认${inlineAction.label}`;
          confirm.onclick = () => { inlineAction = null; lock(key); };
          panel.append(confirm);
        }
        acts.after(panel);
      }
    }
    for (const d of Object.values(deals)) { d.defaults(); d.sync(); d.clear(); }
  }
  window.addEventListener('focus', () => { window.Live.refresh(); if (openKey) refreshCooldown(); if (!local && pending && !busy) recovery.start(); });
  window.addEventListener('resize', () => { if (openKey) setOpen(openKey); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { setOpen(null); render(); } });
  function renderLink(s) {
    meta = s.meta;
    window.CockpitViewer = s.viewer;
    disconnected = s.offline;
    // 回了话（读到、读不到、连不上）就不再算“正在读”；还在等第一次回话的照旧写“正在读…”
    if (!['idle', 'wait', 'slow'].includes(s.phase)) reading = false;
    online = !disconnected && s.link?.state === 'online';
    document.body.classList.toggle('live-off', disconnected);
    if (s.meta.source === 'net' && s.meta.status >= 200 && s.meta.status < 400) winMessage = '';
    if (disconnected) {
      const at = s.shownAt || s.cutoffAt;
      offlineNote.textContent = '电脑开机后自己恢复' + (at ? ` · 北京时间 ${window.Live.stamp(at)} 最后读到` : '');
      setOpen(null);
    }
    render();
  }
  window.Live.watch('access', {}, { data(value) { state = keepShown(value); winMessage = ''; }, link: renderLink });
  // 进场那一下绿点逐个亮起；之后状态变了灯立刻跟着变
  document.body.classList.add('auth-entering'); setTimeout(() => document.body.classList.remove('auth-entering'), 2600);
  render(); document.body.classList.add('is-ready');
  if (!local && pending) recovery.start();
})().catch(() => { document.body.classList.add('is-ready'); const p = document.createElement('p'); p.textContent = '授权状态还没读到，请重新加载。'; document.getElementById('stage').prepend(p); });

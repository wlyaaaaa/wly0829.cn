// 真状态由共享读层提供；写操作复用原授权模型及 Cookie 会话。
(async () => {
  const { HOST_ORIGIN, apiRequest, createGrantAttempt, createGrantRecovery, grantResultNeedsQuery, canRestartUnsubmittedGrant, isAccessOrigin,
    durationMinutes, remainingMinutes, reductionFailureResult } = await import('/app/computer-access-model.js');
  if (!window.Live) await new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = '/live/_lib/live-client.js'; s.onload = resolve; s.onerror = reject; document.head.append(s); });
  const local = !isAccessOrigin(location.origin, window.top === window);
  const base = location.origin === HOST_ORIGIN ? '' : HOST_ORIGIN;
  const fields = { pd: 'personal_data', ur: 'unrestricted', win: 'windows' };
  const kinds = { pd: 'personal-data', ur: 'unrestricted', win: 'windows' };
  const cells = Object.fromEntries([...document.querySelectorAll('.cell')].map(e => [e.dataset.key, e]));
  const bar = document.getElementById('dealbar'), wrap = bar.querySelector('.dealbar__wrap');
  const queryButton = document.createElement('button'), cancelButton = document.createElement('button');
  queryButton.className = cancelButton.className = 'btn'; queryButton.textContent = '查询原请求'; cancelButton.textContent = '取消本次请求';
  const controls = document.createElement('div'); controls.append(queryButton, cancelButton); bar.before(controls);
  const storageKey = 'site-v2-access-request';
  const lockIds = {}, lockedAt = {};
  let state = null, meta = {}, online = false, disconnected = false, openKey = null, busy = false, attempt = null, pending = null, readAfter = 0, winMessage = '', inlineAction = null;
  let reading = true;   // 第一份授权状态回来之前：三块都写“正在读…”，不摆按钮，不写像出错的“状态未知”
  let cooldownUntil = 0, cooldownRead = null;
  if (!local) { try { pending = JSON.parse(sessionStorage.getItem(storageKey) || 'null'); } catch {} }
  if (!local && /^[a-f0-9-]{36}$/i.test(new URLSearchParams(location.search).get('request') || '')) pending = { request_id: new URLSearchParams(location.search).get('request') };
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
  const errorMessages = {
    totp_verification_failed: '码不对，这次没办成。', invalid_totp: '码不对，这次没办成。',
    public_totp_code_already_used: '码用过了，请等下一个。',
    public_totp_format_invalid: '请填完整的六位码。', public_factor_not_submitted: '验证码还没提交。请重新输入验证码，继续这次请求。',
    public_totp_cooldown: '要等一会儿，再试。', cooldown: '要等一会儿，再试。',
    public_totp_not_ready: '验证器暂时用不了。', factor_unavailable: '验证器暂时用不了。',
    public_request_expired: '超时了，请重新办。', expired: '超时了，请重新办。',
    public_state_changed: '状态变了，请重新办。', state_conflict: '状态变了，请重新办。', state_version_mismatch: '状态变了，请重新办。',
    public_access_busy: '电脑正在忙，稍后再试。', public_access_entry_failed: '这次没办成，请再查询。',
    public_request_temporarily_busy: '电脑正在办理其他请求，请稍后再试。',
    public_request_rate_limited: '这条连接提交太频繁，请稍后再试。',
    public_request_source_capacity: '这条连接有待确认的请求或近期记录已满，请稍后再试。',
    public_access_response_unknown: '结果还没确认，请再查询。', public_action_result_unknown: '结果还没确认，请再查询。',
    public_duration_total_exceeds_72_hours: '超过 72 小时了，请少填些。', duration_limit: '超过 72 小时了，请少填些。',
    cancelled: '这次已取消。', disabled: '这一步已停用。',
  };
  const lockMessages = {
    totp_verification_failed: '码不对', public_totp_code_already_used: '码用过了，等下一个',
    public_totp_format_invalid: '请填六位码', public_totp_cooldown: '稍后再试',
    public_totp_not_ready: '验证器暂时用不了', public_state_changed: '状态变了，再按一次',
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
      root.classList.toggle('has-error', locking && !!text && text !== '输动态码确认是本人');
      if (locking) { const hint = document.createElement('span'), error = document.createElement('span'); hint.className = 'lock-hint'; hint.textContent = `打开手机验证器，输入六位动态码后点${key === 'pd' ? '锁定' : '结束'}`; error.className = 'lock-error'; error.textContent = text && text !== '输动态码确认是本人' ? `${text}，请再输一次` : ''; msg.replaceChildren(hint, error); }
      else msg.textContent = text;
      msg.classList.toggle('is-shown', locking || !!text);
    }
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
    if (value.action === 'windows') winMessage = value.state === 'succeeded' ? '' : grantResultNeedsQuery(value) ? '锁屏结果还没确认' : ({ public_windows_lock_disabled: '锁屏入口已停用', interactive_screen_lock_noninteractive: '没有可锁的桌面' }[value.error]) || '这次没锁上';
    else {
      if (!openKey && !pending?.key) setOpen(value.action === 'unrestricted' || value.personal_data?.state === 'not_requested' ? 'ur' : 'pd');
      message(value.state === 'succeeded' ? '' : cooldownText() || errorMessages[value.error] || ({ failed: '这次没办成，请再试。', cancelled: '这次已取消。', expired: '超时了，请重新办。', partial: '有一项没办成，请看状态。' }[value.state]) || '结果还没确认，请再查询。');
      if (value.state === 'succeeded') setOpen(null);
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
      else message('结果还没确认，请再查询。');
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
    try {
      remember({ request_id: id, state: 'pending', request_created: retry, factor_submitted: false });
      attempt = createGrantAttempt({ requestId: id, existing: retry, body: { purpose: fields[key], combined, duration_hours: hours, state_version: state?.state_version, save_default: false },
        api: (p, o) => apiRequest(base, p, o), onCreated: value => remember({ ...value, request_created: true, factor_submitted: false }),
        onVerificationStarted: () => remember({ ...pending, state: 'verifying', factor_submitted: true }) });
      render(); receipt(await attempt.run(code));
    } catch (error) { message(errorMessages[error.data?.error] || '结果还没确认，请再查询。'); }
    finally { attempt = null; busy = false; render(); window.Live.refresh(); if (openKey) refreshCooldown(); if (pending) recovery.start(); }
  }
  function openLock(key, id = crypto.randomUUID()) {
    lockIds[key] = id; setOpen(key, true); message(cooldownText() || '输动态码确认是本人'); render(); refreshCooldown();
  }
  async function lock(key, code) {
    if (local) return entry();
    if (busy || pending || disconnected || meta.viewer?.kind === 'owner' && (!fresh() || !state?.state_version)) return;
    if (meta.viewer?.kind !== 'owner' && !code) return key === 'win' ? window.TrustModal?.show() : openLock(key);
    const id = code ? lockIds[key] : crypto.randomUUID(), action = kinds[key]; busy = true; readAfter = clock();
    try {
      remember({ request_id: id, action, state: 'pending' }); render();
      const value = await apiRequest(base, '/locks/' + action, { method: 'POST', body: { request_id: id, ...(meta.viewer?.kind === 'owner' ? { state_version: state.state_version } : {}), ...(code ? { totp: code } : {}) }, device: localStorage.getItem('wly-cockpit-device') });
      if (value.status === 'blocked') throw { data: value };
      receipt({ ...value, action });
    } catch (error) {
      const data = error.data, reason = data?.error;
      if (key !== 'win' && reason === 'public_totp_required') { remember(null); openLock(key, id); }
      else if (key !== 'win' && code && (reason?.startsWith('public_totp_') || reason === 'totp_verification_failed' || reason === 'public_state_changed')) {
        remember(null); lockIds[key] = crypto.randomUUID();
        if (reason === 'public_state_changed') await window.Live.refresh();
        if (Number.isFinite(data.cooldown_until_unix)) cooldownUntil = data.cooldown_until_unix;
        message(cooldownText() || lockMessages[reason]);
      } else { receipt(reductionFailureResult(error, id, action)); if (reason === 'cockpit_owner_required') window.TrustModal?.show(); }
    }
    finally { busy = false; render(); window.Live.refresh(); if (openKey) refreshCooldown(); if (pending) recovery.start(); }
  }
  const recovery = createGrantRecovery(() => query(), { canQuery: () => !local && !!pending && !busy });
  queryButton.onclick = () => query();
  cancelButton.onclick = async () => {
    if (local) return entry();
    if (attempt) { try { receipt(await attempt.cancel()); } catch { message('取消还没确认，请再查询。'); } }
    else await query(true);
    render();
  };
  const deals = {};
  for (const key of ['pd', 'ur']) {
    const frag = document.getElementById('deal-tpl').content.cloneNode(true), root = frag.querySelector('.deal');
    root.dataset.key = key; bar.querySelector('.dealbar__deals').append(frag);
    const chips = [...root.querySelectorAll('.chip[data-h]')], own = root.querySelector('.chip--own input');
    const boxes = [...root.querySelectorAll('.code input')], go = root.querySelector('.go__btn');
    const both = root.querySelector('.both input'); let hours = '', touched = false;
    function pick(h) { hours = String(h); chips.forEach(c => c.setAttribute('aria-checked', String(c.dataset.h === hours))); own.value = chips.some(c => c.dataset.h === hours) ? '' : hours; }
    chips.forEach(c => c.onclick = () => { touched = true; pick(c.dataset.h); sync(); });
    own.oninput = () => { touched = true; hours = own.value; chips.forEach(c => c.setAttribute('aria-checked', 'false')); sync(); };
    const code = () => boxes.map(b => b.value).join('');
    function sync() {
      const p = state?.policy, minutes = durationMinutes(hours), retry = canRetryPending(key);
      root.classList.toggle('is-retry', retry);
      const keys = both.checked ? ['personal_data', 'unrestricted'] : [fields[key]];
      if (root.classList.contains('is-lock')) { go.disabled = busy || !!pending || disconnected || meta.viewer?.kind === 'owner' && !fresh() || !/^\d{6}$/.test(code()) || cooldownUntil > clock(); return; }
      go.textContent = retry ? '重新验证' : '验证';
      if (retry) { go.disabled = busy || disconnected || !/^\d{6}$/.test(code()) || cooldownUntil > clock(); return; }
      go.disabled = busy || !!pending || !fresh() || !/^\d{6}$/.test(code()) || minutes === null || !p?.factor?.available || cooldownUntil > clock() || minutes < p.minimum_minutes || keys.some(k => (remainingMinutes(state[k], clock()) || 0) + minutes > p.maximum_minutes);
    }
    boxes.forEach((box, i) => {
      box.oninput = () => { root.classList.remove('has-error'); box.value = box.value.replace(/\D/g, '').slice(-1); if (box.value) boxes[i + 1]?.focus(); sync(); };
      box.onkeydown = e => { if (e.key === 'Backspace' && !box.value) boxes[i - 1]?.focus(); if (e.key === 'Enter' && !go.disabled) go.click(); };
      box.onpaste = e => { root.classList.remove('has-error'); e.preventDefault(); [...e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6 - i)].forEach((n, j) => { boxes[i + j].value = n; }); sync(); };
    });
    both.onchange = sync;
    go.onclick = () => { const typed = code(); boxes.forEach(b => { b.value = ''; }); root.classList.contains('is-lock') ? lock(key, typed) : submit(key, hours, both.checked, typed); };
    deals[key] = { root, sync, defaults() { if (!touched && Number.isFinite(state?.policy?.default_minutes)) pick(state.policy.default_minutes / 60); } };
  }
  function setOpen(key, locking = deals[key]?.root.classList.contains('is-lock')) {
    inlineAction = null;
    openKey = key; bar.classList.toggle('is-open', !!key);
    if (key) { deals[key].root.classList.toggle('is-lock', !!locking); deals[key].root.querySelector('.go__btn').classList.toggle('btn--ink', !locking); deals[key].root.querySelector('.go__btn').textContent = locking ? key === 'pd' ? '锁定' : '结束' : '验证'; }
    for (const k of ['pd', 'ur']) { cells[k].classList.toggle('is-open', key === k); deals[k].root.classList.toggle('is-active', key === k); }
    if (key) { const b = cells[key].querySelector(`[data-kind="${locking ? 'close' : 'open'}"]`); if (b) wrap.style.setProperty('--nx', (b.getBoundingClientRect().left + b.offsetWidth / 2 - wrap.getBoundingClientRect().left) + 'px'); }
  }
  const offlineNote = document.createElement('p'); offlineNote.className = 'auth-offline'; document.querySelector('.cells').after(offlineNote);
  function render() {
    const missingStatus = '授权状态暂时读不到，刷新后再试。';
    offlineNote.hidden = !disconnected;
    controls.hidden = !pending || disconnected;
    queryButton.disabled = busy; cancelButton.disabled = busy && !attempt || !!pending?.action;
    cancelButton.title = pending?.action ? '这次请求已经提交，不能取消' : '';
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
        // 禁用时写明原因（悬停可见，扫描也认 data-disabled-reason）；条件和原来一样
        const why = !state ? missingStatus : !state.entry ? '办理入口还没读到' : local ? '' : busy ? '正在办上一步'
          : pending ? '还有一步在等确认' : !privateState && (!fresh() || !state.state_version) ? '状态不是最新的，刷新后再试' : '';
        b.disabled = !!why; if (why) { b.dataset.disabledReason = why; b.title = why; }
        const inline = local || kind === 'close' && meta.viewer?.kind === 'owner' && !privateState;
        if (inline) b.setAttribute('aria-expanded', String(inlineAction?.key === key && inlineAction?.kind === kind));
        else if (kind === 'open' && !privateState) b.setAttribute('aria-expanded', String(openKey === key && !deals[key].root.classList.contains('is-lock')));
        b.onclick = () => {
          if (inline) {
            const again = inlineAction?.key === key && inlineAction?.kind === kind;
            setOpen(null);
            inlineAction = again ? null : { key, kind, label };
            render();
            if (!again) cells[key].querySelector('.cell__inline :is(a,button)')?.focus();
          } else if (privateState) {
            if (kind === 'close' && key !== 'win') lock(key);
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
    if (pending?.action === 'windows') cells.win.querySelector('.cell__acts').append(controls);
    else bar.before(controls);
    for (const d of Object.values(deals)) { d.defaults(); d.sync(); }
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
  window.Live.watch('access', {}, { data(value) { state = value; winMessage = ''; }, link: renderLink });
  render(); document.body.classList.add('is-ready');
  if (!local && pending) recovery.start();
})().catch(() => { document.body.classList.add('is-ready'); const p = document.createElement('p'); p.textContent = '授权状态还没读到，请重新加载。'; document.getElementById('stage').prepend(p); });

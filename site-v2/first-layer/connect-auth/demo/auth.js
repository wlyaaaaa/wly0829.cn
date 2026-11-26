// 真状态由共享读层提供；写操作复用原授权模型及 Cookie 会话。
(async () => {
  // 第一次共用脚本（授权模块、实况脚本）没下到（断网、被拦）：先挂一句“授权状态还没读到，请重新加载。”；
  // 网络回来、页面回到前台，或在前台每过一分钟，再取一次没下到的那份，取到了收起这句、照常往下走（M983）。模块失败过浏览器会记着，再取时带个序号
  const MODEL = '/app/computer-access-model.js';
  let model = null, tries = 0;
  await new Promise(resolve => {
    let fetching = false, note = null, retry = 0;
    const script = src => new Promise((ok, fail) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => { s.remove(); fail(); }; document.head.append(s); });
    async function fetchShared(first) {
      if (fetching || (document.hidden && first !== true)) return;
      fetching = true;
      try {
        model ||= await import(tries ? `${MODEL}?retry=${tries}` : MODEL);
        if (!window.Live) await script('/live/_lib/live-client.js');
      } catch {
        tries++; fetching = false; retry ||= setInterval(fetchShared, 60000);
        if (!note) { note = document.createElement('p'); note.textContent = '授权状态还没读到，请重新加载。'; document.getElementById('stage').prepend(note); document.body.classList.add('is-ready'); }
        return;
      }
      clearInterval(retry); removeEventListener('online', fetchShared); document.removeEventListener('visibilitychange', fetchShared);
      note?.remove(); resolve();
    }
    addEventListener('online', fetchShared); document.addEventListener('visibilitychange', fetchShared);
    fetchShared(true);
  });
  const { HOST_ORIGIN, apiRequest, createGrantAttempt, createGrantRecovery, grantResultNeedsQuery, canRestartUnsubmittedGrant, isAccessOrigin,
    durationMinutes, remainingMinutes, reductionFailureResult, successfulGrantSnapshot, successfulReductionSnapshot } = model;
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
  let state = null, meta = {}, online = false, disconnected = false, openKey = null, busy = false, attempt = null, pending = null, winMessage = '', inlineAction = null;
  let actionSequence = 0, readAfter = 0, serverClock;
  let reading = true;   // 第一份授权状态回来之前：三块都写“正在读…”，不摆按钮，不写像出错的“状态未知”
  let cooldownUntil = 0, cooldownRead = null;
  let notice = null, shown = null;   // 这一页最近一张成功／失败浮窗；刚办成、新读数还没跟上时先照回执显示的那几项
  // Windows 解锁：自己的冷却、卡片上那行“待确认”；锁屏和解锁共用 Windows 那一块输码框，winUnlock 记开着的是解锁
  let windowsUnlockCooldown = 0, windowsUnlockReceipt = '', winUnlock = false;
  if (!local) { try { pending = JSON.parse(sessionStorage.getItem(storageKey) || 'null'); } catch {} }
  if (pending?.action === 'windows-unlock') windowsUnlockReceipt = '解锁结果待确认';
  // 锁屏结果还没出来：卡上状态照实留着，“锁屏结果还没确认”写在状态下面那行，直到查到结果
  if (pending?.action === 'windows') winMessage = '锁屏结果还没确认';
  const clock = () => (serverClock ? Date.parse(serverClock.at) + performance.now() - serverClock.received : Date.now()) / 1000;
  // 照定稿样板：到今天 18:30／到明天 10:04／到周一 10:04，按北京时间换日。
  const BJ = 8 * 3600e3;
  const dayOf = ms => Math.floor((ms + BJ) / 86400e3);
  const pad = n => String(n).padStart(2, '0');
  function untilText(ms) {
    const d = new Date(ms + BJ), diff = dayOf(ms) - dayOf(clock() * 1000);
    const day = diff <= 0 ? '今天' : diff === 1 ? '明天' : '周' + '日一二三四五六'[d.getUTCDay()];
    return `到${day} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  }
  const fresh = key => {
    const at = state?.[fields[key]]?.observed_at_unix ?? Date.parse(meta.at) / 1000;
    return online && meta.source === 'net' && (meta.status === 200 || meta.status === 304)
      && meta.dataRead > readAfter && Math.abs(clock() - at) <= 120;
  };
  const grantKeys = (key, combined) => combined ? ['pd', 'ur'] : [key];
  // Windows 那一格：读到状态后“锁屏”“解锁”两个按钮一直并排都在（本人 11-26 04:27：“能不能锁屏和解锁按钮同时显示呢”）。
  // 点了先看两分钟内的读数：不用办的（没锁点解锁、已锁点锁屏、没有登录会话、后台没开远程解锁）不开码格，卡上直接说一句（本人 04:34：“点解锁就提示一个东西就行了”）；
  // 锁着、读数旧了或读不准的照常开码格，由电脑那头按真状态办（电脑本来没锁时后台直接回已解锁，不提交密码；没有登录会话时不核码）
  const windowsIs = s => state?.windows?.state === s && Math.abs(clock() - state.windows.observed_at_unix) <= 120;
  const windowsReadAs = s => state?.policy?.actions?.unlock_windows === true && windowsIs(s);
  const noSessionText = '电脑现在没有登录会话，解不了锁';
  const windowsHints = {
    unlock: () => windowsIs('unlocked') ? '电脑现在没锁，不用解锁' : windowsIs('no_session') ? noSessionText : state?.policy?.actions?.unlock_windows !== true ? '远程解锁没开' : '',
    close: () => windowsIs('locked') ? '电脑已经锁着' : windowsIs('no_session') ? '电脑现在没有登录会话，不用锁屏' : '',
  };
  const canOfferWindowsUnlock = () => !windowsHints.unlock();
  let windowsHint = '';   // 卡上那句提示是点哪个按钮给的（unlock／close）；读数变了、那句不再成立就收掉，开码格、点别的也收掉
  function refreshAccess() {
    // Reads started before this action returned cannot enable another action.
    readAfter = window.Live.readSequence();
    return window.Live.refreshPath('access', true);
  }
  // 请求号：浏览器有 randomUUID 就用；局域网明文 HTTP 这类非安全环境没有它，用 getRandomValues 拼 UUIDv4（设版本位和变体位）
  function requestId() {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = b[6] & 0x0f | 0x40; b[8] = b[8] & 0x3f | 0x80;
    const h = Array.from(b, n => n.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }
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
  const cooldownText = (until = cooldownUntil) => until > clock() ? `${untilText(until * 1000)} 再试` : '';
  const unlocking = () => openKey === 'win' && winUnlock;
  // 没配对的设备一分钟内合计输错 12 次：所有没配对的设备暂停输码，到 cooldown_until_unix 为止；配对过的设备不受影响（密码中心 public_totp_anonymous_paused）。
  // 大字写清是怎么回事，小字照回执带的说明显示，再写几点再试
  const PAUSED = 'public_totp_anonymous_paused', pausedHead = '陌生设备输错太多次，输码暂停了';
  errorMessages[PAUSED] = lockMessages[PAUSED] = `${pausedHead}，稍后再试；配对过的设备不受影响`;
  const pausedName = (data, until, label = '') => [data?.message || '配对过的设备不受影响，稍后再试', [label, cooldownText(until)].filter(Boolean).join(' · ')].filter(Boolean).join('\n');

  function refreshCooldown() {
    if (local || busy || disconnected || cooldownRead || unlocking()) return;
    const before = actionSequence;
    cooldownRead = apiRequest(base, '/requests/cooldown', { timeout: 4000 }).then(value => {
      if (actionSequence !== before || !Number.isFinite(value.cooldown_until_unix)) return;
      cooldownUntil = value.cooldown_until_unix;
      if (openKey && !unlocking()) {
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
      if (locking) { const hint = document.createElement('span'), note = document.createElement('span'); hint.className = 'lock-hint'; hint.textContent = `打开手机验证器，输入六位动态码后点${key === 'win' && winUnlock ? '解锁' : ({ pd: '锁定', ur: '结束', win: '锁屏' })[key]}`; note.className = 'lock-error'; note.textContent = text && text !== '输动态码确认是本人' ? text : ''; msg.replaceChildren(hint, note); }
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
  // 两项一起办只办成一项（partial）：两项都有了结果就不用再查；还有一项没出结果的照旧查原号
  const openParts = value => keysOf(value).filter(k => ['unknown', 'pending', 'verifying'].includes(value[fields[k]].state));
  const needsQuery = value => value?.state === 'partial' && !value.action ? openParts(value).length > 0 : grantResultNeedsQuery(value);
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
  function failed(key, head, name = '') {
    waiting([], false);
    toast(false, head, name);
    const root = openKey === key && deals[key]?.root;
    if (!root) return;
    root.classList.add('has-error');
    const code = root.querySelector('.code'); code.classList.remove('is-wrong'); void code.offsetWidth; code.classList.add('is-wrong');
    code.querySelector('input')?.focus();   // 没办成要重输：码格已清空，光标回第一格
  }
  // 办成那一刻：灯荡开光波、卡片泛起绿光、时间翻到位（1 秒，一次）
  function celebrate(keys) {
    for (const k of keys) { const cell = cells[k]; cell.classList.remove('is-success'); void cell.offsetWidth; cell.classList.add('is-success'); setTimeout(() => cell.classList.remove('is-success'), 1400); }
  }
  // 刚办成：照回执先把新状态画上，新读数跟上之前不退回旧的（本人 11-24：授权成功刷新很慢）
  function settle(value) {
    const next = value.action ? successfulReductionSnapshot(state, value, true) || lockedSnapshot(value) : successfulGrantSnapshot(state, value, true);
    if (!next) return;
    const keys = value.action ? [({ 'personal-data': 'pd', unrestricted: 'ur', windows: 'win', 'windows-unlock': 'win' })[value.action]] : keysOf(value);
    shown = { at: clock(), parts: Object.fromEntries(keys.map(k => [fields[k], next[fields[k]]])) };
    state = next;
  }
  function lockedSnapshot(value) {
    if (value.action === 'windows' || value.action === 'windows-unlock') return state?.windows ? { ...state, state_version: '', windows: { ...state.windows, state: value.action === 'windows' ? 'locked' : 'unlocked' } } : null;
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
    if (value.action) return [({ 'personal-data': '个人资料已锁上', unrestricted: '无限制授权已结束', windows: 'Windows 已锁屏', 'windows-unlock': 'Windows 已解锁' })[value.action], ''];
    const keys = keysOf(value), until = k => untilText(value[fields[k]].expires_at_unix * 1000);
    const verb = k => remainingMinutes(before?.[fields[k]], clock()) > 0 ? '已延长' : k === 'pd' ? '已解锁' : '已开启';
    const name = { pd: '个人资料', ur: '无限制授权' };
    if (keys.length === 1 && Number.isFinite(value[fields[keys[0]]]?.expires_at_unix)) return [`${name[keys[0]]}${verb(keys[0])} · ${until(keys[0])}`, ''];
    if (keys.length === 2 && keys.every(k => Number.isFinite(value[fields[k]]?.expires_at_unix))) return ['两项都办好了', keys.map(k => `${name[k]}${until(k)}`).join(' · ')];
    return ['办好了', ''];
  }
  function remember(value) {
    pending = value && needsQuery(value) ? { request_id: value.request_id, action: value.action, state: value.state, factor_submitted: value.factor_submitted, request_created: value.request_created, key: openKey || pending?.key || ({ 'personal-data': 'pd', unrestricted: 'ur' }[value.action]) } : null;
    // Store no factor, CSRF token or local authority; reload only queries this ID.
    if (pending) sessionStorage.setItem(storageKey, JSON.stringify(pending)); else sessionStorage.removeItem(storageKey);
  }
  function receipt(value, directWrite = false, windowsAtSubmit = null) {
    if (!value) return;
    if (value.action === 'windows-unlock') {
      // Windows 解锁：只有 succeeded 算解开；失败像别的动作一样弹失败浮窗、码格标红；结果没出来的在卡片上写“待确认”，页面自己查原号
      waiting([], false);
      if (Number.isFinite(value.cooldown_until_unix)) windowsUnlockCooldown = value.cooldown_until_unix;
      windowsUnlockReceipt = '';
      if (value.state === 'succeeded') {
        // 提交以后又来了更新的读数，就以读数为准，回执不盖掉它
        if (windowsAtSubmit && state?.windows === windowsAtSubmit) settle(value);
        setOpen(null); toast(true, successText(value)[0]);
      } else if (grantResultNeedsQuery(value)) { windowsUnlockReceipt = '解锁结果待确认'; if (openKey === 'win') setOpen(null); }
      else if (value.error === 'public_windows_console_unavailable') {
        // 电脑没有登录会话：再输码也解不了，收起码框；后台先查会话、没有就不核码，回执带 factor_consumed:false
        setOpen(null);
        toast(false, noSessionText, value.factor_consumed === false ? 'Windows 解锁 · 码没用掉' : 'Windows 解锁');
      } else {
        const wait = cooldownText(windowsUnlockCooldown);
        if (unlocking()) message(wait);
        if (value.error === PAUSED) failed('win', pausedHead, pausedName(value, windowsUnlockCooldown, 'Windows 解锁'));
        else failed('win', wait || lockMessages[value.error] || ({
          public_windows_unlock_disabled: '解锁入口已停用',
          public_windows_credential_unavailable: '电脑上保存的登录凭据不可用，这次没解锁',
        }[value.error]) || '这次没解锁', 'Windows 解锁');
      }
      remember(value);
      return;
    }
    if (Number.isFinite(value.cooldown_until_unix)) cooldownUntil = value.cooldown_until_unix;
    const lockedKey = ({ 'personal-data': 'pd', unrestricted: 'ur' })[value.action];
    // 没配对的设备看不到真状态，锁上／结束成功后卡上记一笔“已锁上／已结束”。电脑的回执不带办理时刻，就不写时刻，不拿浏览器时间补
    if (directWrite && value.state === 'succeeded' && lockedKey && state?.[fields[lockedKey]]?.state === 'private') lockedAt[lockedKey] = true;
    {
      waiting([], false);
      const windows = value.action === 'windows';
      const key = windows ? 'win' : openKey || pending?.key || (value.action === 'unrestricted' || value.personal_data?.state === 'not_requested' ? 'ur' : 'pd');
      const stateText = windows ? ({ public_windows_lock_disabled: '锁屏入口已停用', interactive_screen_lock_noninteractive: '没有可锁的桌面' }[value.error]) || (!errorMessages[value.error] && '这次没锁上')
        : { failed: '这次没办成，请再试。', expired: '超时了，请重新办。', partial: '有一项没办成，请看状态。' }[value.state];
      if (windows) winMessage = '';
      if (value.state === 'succeeded') {
        if (windows) windowsUnlockReceipt = '';
        const before = state; settle(value);
        const [head, name] = successText(value, before);
        setOpen(null); toast(true, head, name);
        if (!value.action) celebrate(keysOf(value));
      } else if (value.state === 'partial' && !value.action) {
        // 两项一起办只办成一项：办成的那项照回执画上新截止、卡片亮一下，浮窗逐项写哪项办成、哪项没成；
        // 另一项还没出结果的，只确认办成的那项，另一项写“结果还没确认”，接着查原号
        // 同一次请求会再查几次，“办成了”不分解锁还是延长（查第二次时卡上已是新截止），卡片只在截止头一回换上时亮一下
        const keys = keysOf(value), open = openParts(value);
        const ok = keys.filter(k => value[fields[k]].state === 'succeeded'), drawn = ok.filter(k => value[fields[k]].expires_at_unix > 0);
        if (drawn.length) {
          const next = { ...state, state_version: '' };
          for (const k of drawn) next[fields[k]] = { ...state?.[fields[k]], state: value[fields[k]].current_state || (k === 'pd' ? 'unlocked' : 'active'), expires_at_unix: value[fields[k]].expires_at_unix };
          const fresh = drawn.filter(k => state?.[fields[k]]?.expires_at_unix !== value[fields[k]].expires_at_unix);
          shown = { at: clock(), parts: Object.fromEntries(drawn.map(k => [fields[k], next[fields[k]]])) };
          state = next; celebrate(fresh);
        }
        const name = { pd: '个人资料', ur: '无限制授权' };
        const lines = keys.map(k => ok.includes(k) ? `${name[k]}办成了${drawn.includes(k) ? ' · ' + untilText(value[fields[k]].expires_at_unix * 1000) : ''}`
          : open.includes(k) ? `${name[k]}结果还没确认` : `${name[k]}没办成`);
        if (open.length) message(`${lines.join('；')}，页面会自己再核对。`);
        else { setOpen(null); toast(false, '办成一项，请看各自状态。', lines.join('；')); }
      } else if (value.state === 'cancelled' && value.request_created === false) {
        // 点取消时请求根本没建成（比如被电脑拒了）：不弹“已取消”的绿勾，照实说这次没发出去、为什么
        message(''); toast(false, '这次请求没发出', errorMessages[value.reason || value.error] || '');
      } else if (value.state === 'cancelled' && !needsQuery(value)) { message(''); toast(true, '已取消这次请求'); }
      else if (needsQuery(value)) { if (windows) { winMessage = '锁屏结果还没确认'; if (openKey === 'win') setOpen(null); } else message(cooldownText() || errorMessages[value.error] || stateText || unsure); }
      else {
        if (!value.action && openKey !== key) setOpen(key, false);
        if (openKey === key) message(cooldownText());
        if (value.error === PAUSED) failed(key, pausedHead, pausedName(value, cooldownUntil, windows ? 'Windows 锁屏' : ''));
        else failed(key, cooldownText() || errorMessages[value.error] || stateText || '这次没办成，请再试。', windows ? 'Windows 锁屏' : '');
      }
    }
    remember(value);
  }
  // 查原请求明确查不到（第一次提交没到电脑，或回执已过五分钟）：上次的结果确认不了。收起这次请求，重新给输码入口，再办用新请求号；页面自己不重办
  // 现在的状态里这一步已经用不着了（比如上次其实锁上了），就不再开码框，只请他看现在的状态
  function lost(old) {
    const key = ({ 'personal-data': 'pd', unrestricted: 'ur', windows: 'win', 'windows-unlock': 'win' })[old.action];
    const unlock = old.action === 'windows-unlock', needsCode = unlock || key === 'pd' || meta.viewer?.kind !== 'owner';
    const grant = state?.[fields[key]];
    const again = unlock ? canOfferWindowsUnlock() : key === 'win' ? !['locked', 'no_session'].includes(grant?.state) : remainingMinutes(grant, clock()) > 0 || grant?.state === 'private';
    remember(null); waiting([], false); winMessage = ''; windowsUnlockReceipt = '';
    toast(false, '上次的结果确认不了', !again ? '请看现在的状态' : needsCode ? '请输新码再办一次' : '请再按一次');
    if (unlock) {
      if (again) { setOpen('win', true, true); message(cooldownText(windowsUnlockCooldown) || '输动态码确认是本人'); }
      else windowsUnlockReceipt = '上次的结果确认不了';
    } else if (key && needsCode && again) openLock(key);
    else if (openKey === key) setOpen(null);   // 不再开码框时，收起刚才写着“结果还没确认”的那一栏
  }
  // 锁定、结束、锁屏、解锁的结果没出来：起头那几次查完以后，每 30 秒再查一次原号，直到出结果或查不到（回执最多留五分钟），
  // 不靠刷新或切回这个标签页（页面写着“会自己再核对”）。只查不重办
  let recheckTimer = 0;
  function recheckLater() { clearTimeout(recheckTimer); recheckTimer = setTimeout(() => { if (pending?.action) query(); }, 30000); }
  async function query(cancel = false) {
    if (local) return entry();
    if (busy || !pending) return;
    busy = true; if (cancel) actionSequence++; render();
    const old = pending;
    try {
      const path = '/requests/' + encodeURIComponent(old.request_id);
      let value = await apiRequest(base, path);
      if (pending !== old) return;   // 查的途中这次请求已经有了结果（比如“取消请求”先回了话），这次查到的不再算数
      if (old.action && value.error === 'public_request_not_found') return lost(old);
      if (cancel && value.csrf_token) value = await apiRequest(base, path + '/cancel', { method: 'POST', csrf: value.csrf_token, body: {} });
      const awaitingCode = !old.action && old.factor_submitted === false && value.state === 'pending';
      receipt({ ...value, action: old.action || value.action, request_created: true,
        factor_submitted: value.factor_submitted ?? old.factor_submitted,
        ...(awaitingCode && { error: 'public_factor_not_submitted' }) });
    } catch (error) {
      if (pending !== old) return;
      if (!pending?.action && canRestartUnsubmittedGrant(pending, null, error)) { message('码还没提交，请重新办。'); remember(null); }
      else if (pending?.action && error?.data?.error === 'public_request_not_found') lost(pending);
      else if (pending?.action === 'windows-unlock') windowsUnlockReceipt = '解锁结果待确认';
      else message(unsure);
    }
    finally { busy = false; if (cancel || !pending) refreshAccess(); render(); if (pending?.action) recheckLater(); }
  }
  function canRetryPending(key) {
    return !!pending && !pending.action && pending.key === key && pending.state === 'pending' && pending.request_created && pending.factor_submitted === false;
  }
  async function submit(key, hours, combined, code) {
    if (local) return entry();
    const retry = canRetryPending(key);
    if (busy || disconnected || (pending ? !retry : !grantKeys(key, combined).every(fresh) || !state?.state_version)) return;
    const id = retry ? pending.request_id : requestId(); busy = true; actionSequence++;
    begin(grantKeys(key, combined));
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
    finally { attempt = null; busy = false; waiting([], false); refreshAccess(); render(); if (openKey) refreshCooldown(); if (pending) recovery.start(); }
  }
  function openLock(key, id = requestId()) {
    lockIds[key] = id; setOpen(key, true, false); message(cooldownText() || '输动态码确认是本人'); render(); refreshCooldown();
  }
  // 锁定、结束、锁屏：配对过的设备随时直接点（再点一下确认），不等“状态是最新的”；没配对的设备输动态码办。两种设备走同一个接口。
  // 锁定个人资料例外：配对和没配对的设备都要输码（本人定：关闭个人资料授权须验证码）。带码的不附状态版本，对当前状态办，免得旧版本白白用掉一个码。
  async function lock(key, code) {
    if (local) return entry();
    const owner = meta.viewer?.kind === 'owner';
    if (busy || pending || disconnected) return;
    if ((!owner || key === 'pd') && !code) return openLock(key);
    const action = kinds[key]; let id = code ? lockIds[key] : requestId(); busy = true; actionSequence++;
    begin([key]);
    try {
      for (let round = 0; ; round++) {
        remember({ request_id: id, action, state: 'pending' }); render();
        try {
          const value = await apiRequest(base, '/locks/' + action, { method: 'POST', body: { request_id: id, ...(owner && !code && state?.state_version ? { state_version: state.state_version } : {}), ...(code ? { totp: code } : {}) }, device: localStorage.getItem('wly-cockpit-device') });
          if (value.status === 'blocked') throw { data: value };
          receipt({ ...value, action }, true);
          break;
        } catch (error) {
          // 配对过的设备拿着旧状态点的：重读一次、用新状态再办一次
          if (!(owner && !code && round === 0 && error?.data?.error === 'public_state_changed')) throw error;
          remember(null); await refreshAccess(); id = requestId();
        }
      }
    } catch (error) {
      const data = error.data, reason = data?.error;
      if (reason === 'public_totp_required') { remember(null); waiting([], false); openLock(key, id); }
      else if (code && (reason?.startsWith('public_totp_') || reason === 'totp_verification_failed' || reason === 'public_state_changed')) {
        remember(null); lockIds[key] = requestId();
        if (Number.isFinite(data.cooldown_until_unix)) cooldownUntil = data.cooldown_until_unix;
        message(cooldownText());
        if (reason === PAUSED) failed(key, pausedHead, pausedName(data, cooldownUntil, key === 'win' ? 'Windows 锁屏' : ''));
        else failed(key, cooldownText() || lockMessages[reason], key === 'win' ? 'Windows 锁屏' : '');
      } else {
        if (code) lockIds[key] = requestId();   // 这个号已经有了结果，再输码换新号
        receipt(reductionFailureResult(error, id, action)); if (reason === 'cockpit_owner_required') window.TrustModal?.show();
      }
    }
    finally { busy = false; waiting([], false); refreshAccess(); render(); if (openKey) refreshCooldown(); if (pending) recovery.start(); }
  }
  const recovery = createGrantRecovery(() => query(), { canQuery: () => !local && !!pending && !busy });
  // Windows 解锁：配对和没配对的设备都输六位码；正文只有请求号和码，不附状态版本
  async function unlockWindows(code) {
    if (local) return entry();
    if (busy || pending || disconnected || !canOfferWindowsUnlock() || windowsUnlockCooldown > clock() || !/^\d{6}$/.test(code)) return;
    const request_id = requestId(), action = 'windows-unlock', windowsAtSubmit = state.windows;
    busy = true; actionSequence++; windowsUnlockReceipt = '';
    begin(['win']);
    try {
      remember({ request_id, action, state: 'pending' }); render();
      const result = await apiRequest(base, '/unlocks/windows', { method: 'POST', body: { request_id, totp: code } });
      receipt({ ...result, action }, true, windowsAtSubmit);
    } catch (error) { receipt(reductionFailureResult(error, request_id, action)); }
    finally { busy = false; waiting([], false); refreshAccess(); render(); if (pending) recovery.start(); }
  }
  cancelButton.onclick = async () => {
    if (local) return entry();
    if (attempt) { try { receipt(await attempt.cancel()); } catch { message('取消还没确认，页面会自己再核对。'); } finally { refreshAccess(); } }
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
      const keys = grantKeys(key, both.checked);
      if (key === 'win' && winUnlock) { go.disabled = busy || !!pending || disconnected || !canOfferWindowsUnlock() || !/^\d{6}$/.test(code()) || windowsUnlockCooldown > clock(); return; }
      if (root.classList.contains('is-lock')) { go.disabled = busy || !!pending || disconnected || !/^\d{6}$/.test(code()) || cooldownUntil > clock(); return; }
      go.textContent = retry ? '重新验证' : '验证';
      if (retry) { go.disabled = busy || disconnected || !/^\d{6}$/.test(code()) || cooldownUntil > clock(); return; }
      go.disabled = busy || !!pending || !keys.every(fresh) || !/^\d{6}$/.test(code()) || minutes === null || !p?.factor?.available || cooldownUntil > clock() || minutes < p.minimum_minutes || keys.some(k => (remainingMinutes(state[fields[k]], clock()) || 0) + minutes > p.maximum_minutes);
    }
    boxes.forEach((box, i) => {
      box.oninput = () => { if (root.classList.contains('has-error')) { root.classList.remove('has-error'); boxes.forEach(b => { b.placeholder = ''; }); } box.value = box.value.replace(/\D/g, '').slice(-1); if (box.value) boxes[i + 1]?.focus(); sync(); };
      box.onkeydown = e => { if (e.key === 'Backspace' && !box.value) boxes[i - 1]?.focus(); if (e.key === 'Enter' && !go.disabled) go.click(); };
      box.onpaste = e => { root.classList.remove('has-error'); boxes.forEach(b => { b.placeholder = ''; }); e.preventDefault(); [...e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6 - i)].forEach((n, j) => { boxes[i + j].value = n; }); sync(); };
    });
    both.onchange = sync;
    // 提交时把光标从码格里拿走：回车提交后格子里不留闪着的光标和黑框（本人 11-24 M800）
    go.onclick = () => { const typed = code(); boxes.forEach(b => { b.value = ''; }); if (boxes.includes(document.activeElement)) document.activeElement.blur(); if (key === 'win' && winUnlock) unlockWindows(typed); else if (root.classList.contains('is-lock')) lock(key, typed); else submit(key, hours, both.checked, typed); };
    deals[key] = { root, sync, defaults() { if (!touched && Number.isFinite(state?.policy?.default_minutes)) pick(state.policy.default_minutes / 60); },
      clear() { if (!root.classList.contains('is-waiting') && !root.classList.contains('has-error')) boxes.forEach(b => { b.placeholder = ''; }); } };
  }
  // unlock：Windows 那一块开的是解锁（样子和锁屏一样只有码格，按钮写“解锁”）；不给就沿用现在开着的那种
  function setOpen(key, locking = deals[key]?.root.classList.contains('is-lock'), unlock = key === 'win' && unlocking()) {
    inlineAction = null; windowsHint = '';
    unlock = key === 'win' && !!unlock;
    if (openKey === 'win' && (key !== 'win' || unlock !== winUnlock)) deals.win.root.querySelectorAll('.code input').forEach(box => { box.value = ''; });
    openKey = key; winUnlock = unlock; bar.classList.toggle('is-open', !!key);
    if (key) { deals[key].root.classList.toggle('is-lock', !!locking); deals[key].root.querySelector('.go__btn').classList.toggle('btn--ink', !locking); deals[key].root.querySelector('.go__btn').textContent = unlock ? '解锁' : locking ? ({ pd: '锁定', ur: '结束', win: '锁屏' })[key] : '验证'; }
    for (const k of ['pd', 'ur', 'win']) { cells[k].classList.toggle('is-open', key === k); deals[k].root.classList.toggle('is-active', key === k); }
    if (key) { const b = cells[key].querySelector(`[data-kind="${unlock ? 'unlock' : locking ? 'close' : 'open'}"]`); if (b) wrap.style.setProperty('--nx', (b.getBoundingClientRect().left + b.offsetWidth / 2 - wrap.getBoundingClientRect().left) + 'px'); }
  }
  const offlineNote = document.createElement('p'); offlineNote.className = 'auth-offline'; document.querySelector('.cells').after(offlineNote);
  function render() {
    const missingStatus = '授权状态暂时读不到，刷新后再试。';
    if (unlocking() && !busy && !canOfferWindowsUnlock()) setOpen(null);
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
        : privateState ? '' : key === 'win' ? ({ locked: '已锁屏', unlocked: '没锁', no_session: '没有登录' }[grant?.state] || '还没读到')
        : active ? untilText(grant.expires_at_unix * 1000) : !grant || grant.state === 'unknown' ? '状态未知' : key === 'pd' ? '锁着' : '关着';
      if (privateState && !disconnected) {
        const note = document.createElement('button'); note.type = 'button'; note.className = 'trust-note'; note.dataset.trustView = '';
        note.textContent = '可信设备可见'; stateLine.append(note);
      }
      let result = cell.querySelector('.cell__receipt');
      if (!result) { result = document.createElement('p'); result.className = 'cell__receipt'; result.setAttribute('aria-live', 'polite'); stateLine.after(result); }
      if (key === 'win' && windowsHint && !windowsHints[windowsHint]()) windowsHint = '';
      const winNote = key === 'win' && ((windowsHint && windowsHints[windowsHint]()) || winMessage || windowsUnlockReceipt || (windowsReadAs('no_session') ? noSessionText : ''));
      result.hidden = disconnected || !(key === 'win' ? winNote : lockedAt[key]); result.replaceChildren();
      if (!result.hidden && key === 'win') result.textContent = winNote;
      else if (!result.hidden) { const title = document.createElement('strong'); title.textContent = key === 'pd' ? '已锁上' : '已结束'; result.append(title); }
      const acts = cell.querySelector('.cell__acts'); acts.replaceChildren();
      cell.querySelector('.cell__inline')?.remove();
      const actions = disconnected || loading || key === 'win' && ['windows', 'windows-unlock'].includes(pending?.action) ? [] : key === 'win' ? [['锁屏', 'close'], ['解锁', 'unlock']]
        : [[active ? '延长' : key === 'pd' ? '解锁' : '开启', 'open'], ...(active || privateState ? [[key === 'pd' ? '锁定' : '结束', 'close']] : [])];
      for (const [label, kind] of actions) {
        const b = document.createElement('button'); b.className = 'btn'; b.textContent = label; b.dataset.kind = kind;
        // 禁用时写明原因（悬停可见，扫描也认 data-disabled-reason）。锁定、结束随时能点，不等“状态是最新的”（本人 11-24）；
        // Windows 解锁也随时能点：读数旧了、读不准照样开码格，由电脑那头按真状态办
        const anytime = (kind === 'close' || kind === 'unlock') && !local;
        const why = !state ? missingStatus : !anytime && !state.entry ? '办理入口还没读到' : local ? '' : busy ? '正在办上一步'
          : pending ? '还有一步在等确认' : !anytime && !privateState && (!fresh(key) || kind !== 'unlock' && !state.state_version) ? '状态不是最新的，刷新后再试' : '';
        b.disabled = !!why; if (why) { b.dataset.disabledReason = why; b.title = why; }
        // 配对设备点锁定个人资料也开码格（要输码），只有结束授权、锁屏还是“再点一下确认”
        const inline = local || kind === 'close' && meta.viewer?.kind === 'owner' && !privateState && key !== 'pd';
        if (inline) b.setAttribute('aria-expanded', String(inlineAction?.key === key && inlineAction?.kind === kind));
        else if (kind === 'unlock') b.setAttribute('aria-expanded', String(unlocking()));
        else if (kind === 'open' && !privateState) b.setAttribute('aria-expanded', String(openKey === key && !deals[key].root.classList.contains('is-lock')));
        else if (kind === 'close') b.setAttribute('aria-expanded', String(openKey === key && deals[key].root.classList.contains('is-lock') && !unlocking()));
        b.onclick = () => {
          // Windows：读数说不用办（没锁点解锁、已锁点锁屏、没有登录会话、后台没开远程解锁），收起码格，卡上说一句
          if (key === 'win' && windowsHints[kind]?.()) { setOpen(null); windowsHint = kind; render(); cells.win.querySelector(`[data-kind="${kind}"]`)?.focus(); return; }
          if (inline) {
            const again = inlineAction?.key === key && inlineAction?.kind === kind;
            setOpen(null);
            inlineAction = again ? null : { key, kind, label };
            render();
            if (!again) cells[key].querySelector('.cell__inline :is(a,button)')?.focus();
          } else if (kind === 'unlock') {
            const again = unlocking();
            setOpen(again ? null : 'win', true, !again);
            if (!again) message(cooldownText(windowsUnlockCooldown) || '输动态码确认是本人');
            render();
            cells.win.querySelector('[data-kind="unlock"]')?.focus();
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
  window.addEventListener('focus', () => { if (openKey) refreshCooldown(); if (!local && pending && !busy) recovery.start(); });
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
    if (s.meta.source === 'net' && (s.meta.status === 200 || s.meta.status === 304) && s.now !== serverClock?.at && Number.isFinite(Date.parse(s.now))) {
      serverClock = { at: s.now, received: performance.now() };
    }
    if (disconnected) {
      const at = s.shownAt || s.cutoffAt;
      offlineNote.textContent = '电脑开机后自己恢复' + (at ? ` · 北京时间 ${window.Live.stamp(at)} 最后读到` : '');
      setOpen(null);
    }
    render();
  }
  window.Live.watch('access', {}, { data(value) { state = keepShown(value); if (pending?.action !== 'windows') winMessage = ''; }, link: renderLink });
  // 进场那一下绿点逐个亮起；之后状态变了灯立刻跟着变
  document.body.classList.add('auth-entering'); setTimeout(() => document.body.classList.remove('auth-entering'), 2600);
  render(); document.body.classList.add('is-ready');
  if (!local && pending) recovery.start();
})().catch(() => { document.body.classList.add('is-ready'); const p = document.createElement('p'); p.textContent = '授权状态还没读到，请重新加载。'; document.getElementById('stage').prepend(p); });

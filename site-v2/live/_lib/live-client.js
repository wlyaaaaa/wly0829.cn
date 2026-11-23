// 浏览器取数：页面只订阅当前资源；副本始终隔开设备、受众和筛选。
(() => {
  'use strict';
  // 正式站（wly0829.cn 和 www）连正式接口；本机、局域网预览和扫描走自己的 /__live/ 代理
  const site = /(^|\.)wly0829\.cn$/i.test(location.hostname);
  const localFallback = !site || document.currentScript?.src?.startsWith(location.origin + '/');
  const base = site ? 'https://live.wly0829.cn/computer-access/live/v1/' : '/__live/';
  const PAIR_URL = site ? 'https://mcp.wly0829.cn/computer-access/api/cockpit-device/pair' : '/__computer/cockpit-device/pair';
  const fixture = new URLSearchParams(location.search).get('fixture');
  // “看公开版”只管实况页（/live/ 下面）；根首页、授权与状态、连接电脑等没有访客版，本人设备上始终按本人读（本人 11-22 09:29，M518）。
  const publicView = /^\/live(?:\/|$)/.test(location.pathname) && (() => {
    if (window.LiveView) return window.LiveView.isPublic();
    try { return window.sessionStorage?.getItem('wly-live-view') === 'public'; }
    catch { return false; } // 浏览器禁用会话存储时没有已保存的选择。
  })();
  const lanPort = Number(globalThis.document?.querySelector?.('meta[name="wly-lan-live-port"]')?.content);
  const lanBase = !site && location.protocol === 'http:' && location.port === '8829' &&
    Number.isInteger(lanPort) && lanPort >= 1024 && lanPort <= 65535 && lanPort !== 8829
    ? 'http://' + location.hostname + ':' + lanPort + '/__live/' : '';
  function readRequest(path, token) {
    const lan = Boolean(lanBase && !token && !publicView && path.split('?')[0] !== 'access');
    return { lan, url: (lan ? lanBase : base) + path,
      headers: lan ? {} : opened.headers(token),
      credentials: lan || site ? 'omit' : 'same-origin' };
  }
  // v2：上线时换前缀，各设备上 v1 存下的旧副本（上线前几天的数）一次作废，并顺手删掉
  const prefix = 'wly-live-v2:' + (fixture === null ? 'net' : 'fixture:' + fixture) + ':' + (publicView ? 'public:' : '');
  const visitorNetCopy = /^wly-live-v2:net:(?:public:)?(?:none|[a-f0-9]+):public:/;
  const ownerNetCopy = /^wly-live-v2:net:(?:public:)?(?:none|[a-f0-9]+):owner:([^?]+)/;
  // 与后台 owner_original_resource 一致：这些详情只在当前页面保留原文。
  const ownerOriginalResource = resource => /^(?:chats|items|reports|projects)\//.test(resource) &&
    !['items/closed', 'projects/changes'].includes(resource);
  const visitorPolicy = 'policy-10'; // 与后端导出和云端接口的访客规则代号一致。
  const validAudience = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      const resource = ownerNetCopy.exec(key)?.[1];
      if (key?.startsWith('wly-live-v1:') || visitorNetCopy.test(key) || ownerOriginalResource(resource)) localStorage.removeItem(key);
    }
  } catch { /* 浏览器可能禁用存储。 */ }
  // 演示：?fixture&slow=3000 让示意数晚 3 秒到（看加载中）；slow=12000 看“这块要多读一会儿”。真数不认这个开关。
  const demoSlow = fixture === null ? 0 : Math.max(0, Number(new URLSearchParams(location.search).get('slow')) || 0);
  // 示意数只给预览看样子：站内 /live/ 链接都带上示意参数，点进点出都还是示意数（页眉“实况”等不归页面拼的链接也补上）。
  // 第一层那套示意数（本人 ?fixture、访客 ?fixture=public）的项目名册单薄，名册换成 47 个项目那套；从那套回到别的页再换回来。
  // 真数网址不带 fixture，这段不起作用。
  function fixtureFor(path, linked, current) {
    const sets = { '': 'review1-projects', public: 'review1-projects-public' };
    const back = { 'review1-projects': '', 'review1-projects-public': 'public' };
    if (linked !== null && linked !== current) return null;   // 链接自己指定了别的示意数，照它
    const projectPage = path === '/live/projects/' || path === '/live/project/';
    const want = path === '/live/projects/' && current in sets ? sets[current] : !projectPage && current in back ? back[current] : current;
    return want === linked ? null : want;
  }
  if (fixture !== null && typeof MutationObserver === 'function' && typeof document === 'object') {
    const carry = (a) => {
      const raw = a.getAttribute('href');
      if (!raw || !raw.startsWith('/live/')) return;
      const url = new URL(raw, location.origin), want = fixtureFor(url.pathname, url.searchParams.get('fixture'), fixture);
      if (want === null) return;
      url.searchParams.set('fixture', want);
      a.setAttribute('href', url.pathname + url.search.replace(/([?&]fixture)=(?=&|$)/, '$1') + url.hash);
    };
    const sweep = (node) => { if (node.matches?.('a[href]')) carry(node); node.querySelectorAll?.('a[href^="/live/"]').forEach(carry); };
    new MutationObserver((list) => { for (const m of list) if (m.type === 'attributes') carry(m.target); else m.addedNodes.forEach(sweep); })
      .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
    sweep(document);
  }
  const entries = new Map();
  // RF142：只把可枚举的页卡名写到请求上，与资源缓存键和筛选参数分开。
  const opened = (() => {
    const pages = 'home apps automation backup backups chat chats computer environment issue item items ledger notifications phone phone/apps power project projects records security smooth storage task tasks traffic usage'.split(' ');
    const pageOf = path => {
      const match = /^\/live(?:\/(.*))?$/.exec(path || '');
      const name = match?.[1]?.replace(/(?:^|\/)index\.html$/, '').replace(/\/$/, '') || 'home';
      return match && pages.includes(name) ? name : '';
    };
    const page = pageOf(location.pathname);
    const homeCards = 'needs chats ledger computer phone tasks backups projects'.split(' ');
    const links = {
      computer: 'storage traffic power smooth apps usage security environment',
      phone: 'phone/apps notifications backups', items: 'item', chats: 'chat', ledger: 'issue',
      tasks: 'task automation', automation: 'task tasks', projects: 'project records', project: 'records', backups: 'backup'
    };
    const dossier = { '#lead-more': 'summary', '#questions-more': 'questions', '#events-more': 'events', '#raw-more': 'raw' };
    const folds = {
      home: { ...Object.fromEntries(homeCards.map(name => [`#${name} details`, name])),
        '[data-part="more-changes"]': ['projects', /^projects\/changes$/] },
      chats: { '[data-detail]': ['detail', /^chats\//], '.chat-think': 'thinking', 'details.row__sub': 'helpers', 'details.row__text,.lb-card__more': 'recent' },
      items: { '[data-detail]': ['detail', /^items\//], '[data-text-toggle],details.brief': 'summary' },
      item: dossier, issue: dossier, ledger: { '#working-more': 'working', '#waiting-more': 'waiting' },
      chat: { '#helpers-more': 'helpers', '#log-more': 'log' }, task: { '#runs-more': 'runs', 'details.brief': 'summary' },
      backup: { '#files-more': ['files', /^backups\/[^/]+\/files$/], '.backup-path': 'locations' },
      backups: { '#more': 'sets', '.backup-note': 'restore' },
      computer: { '#stability-more,.stability-panel details': ['stability', /^computer\/stability$/], '.display-recovery': 'display-recovery' },
      storage: { '#volumes-more': 'volumes', '#ssd-more': 'ssd', '#categories-more,.storage-cleanup': 'categories', '#database-details': 'database' },
      projects: { '#active-more': 'active', '#frozen-more': 'frozen', '#changes-more': 'changes' },
      project: { '[data-part="detail"]': 'detail', '.pj-sec [data-p="more"],.pj-all': ['section', /^projects\/[^/]+\/records$/],
        '.pj-notes': 'notes', '.pj-rh-events': 'version-history' },
      records: { '#archive-records': ['archives', /^projects\/[^/]+\/records$/] },
      notifications: { '.delivery-associations': 'associations', '[data-batch-fold]': 'batches', '.delivery-message': 'message', '[data-delivery-process]': 'process' },
      environment: { '.env-path,.env-details:not(.env-normal > .env-details)': el => el.closest('.grp')?.dataset.key === 'runtime' ? 'runtime' : 'startup' },
      phone: { 'details': 'details' },
      apps: { 'details': 'details' }, security: { '.vz-audit__head,.security-audit-group details': 'audit' }
    };
    let current, initial, pageSent = false;
    const summaries = new WeakMap();
    const cardPrefix = 'card/' + page + '/';
    const cardKey = name => cardPrefix + name;
    const isCard = key => typeof key === 'string' && key.startsWith(cardPrefix) && /^[a-z0-9_-]+$/.test(key.slice(cardPrefix.length));
    const add = (url, key) => url + (url.includes('?') ? '&' : '?') + 'opened=' + key;
    const visible = () => !document.hidden && !document.prerendering;
    const headers = token => {
      if (window.LiveView) return window.LiveView.headers(token);
      if (publicView) return site ? {} : { 'X-Wly-View': 'public' };
      return token ? { 'X-Cockpit-Device': token } : {};
    };
    async function send(key) {
      if (!page || fixture !== null || !visible() || publicPaused) return;
      const requestHeaders = headers(device());
      if (!requestHeaders['X-Cockpit-Device']) return;
      try {
        await fetch(add(base + 'home', key), { cache: 'no-store', credentials: site ? 'omit' : 'same-origin',
          headers: requestHeaders, keepalive: true, signal: AbortSignal.timeout(15000) });
      } catch { /* 计数随一次打开发送，失败不重试。 */ }
    }
    function linkKey(link) {
      const target = new URL(link.href, location.href);
      if (target.origin !== location.origin || target.searchParams.has('fixture') || link.matches('.back,[data-back],[download]')) return;
      const to = pageOf(target.pathname);
      if (to === page && isCard(link.dataset.liveOpened)) return link.dataset.liveOpened;
      if (!to || to === page) return;
      if (page === 'home') {
        const name = link.closest('.card')?.id;
        return homeCards.includes(name) ? cardKey(name) : undefined;
      }
      if (links[page]?.split(' ').includes(to)) return cardKey(to.split('/').at(-1));
    }
    function click(e) {
      if (!e.isTrusted || !e.target.closest || e.defaultPrevented || e.altKey || !visible()) return;
      const target = e.target, link = target.closest('a[href]');
      if (link) { const key = linkKey(link); if (key) send(key); return; }
      if (e.type === 'auxclick') return;
      const control = target.closest('summary,button,[role="button"],input,select,textarea,[contenteditable],[role="link"]');
      if (!control) { if (!window.getSelection?.()?.toString().trim()) homeLink(target.closest('.card')); return; }
      const detail = control.matches('summary') ? control.parentElement : null;
      const el = detail || control;
      if (detail && (detail.tagName !== 'DETAILS' || detail.open)) return;
      if (!detail && control.getAttribute('aria-expanded') !== 'false') return;
      for (const [selector, value] of Object.entries(folds[page] || {})) {
        if (!el.matches(selector)) continue;
        const [name, resource] = Array.isArray(value) ? value : [typeof value === 'function' ? value(el) : value];
        const key = cardKey(name);
        if (detail) summaries.set(detail, { key, event: e });
        else {
          const action = current = { event: e, resource, key };
          setTimeout(() => {
            if (current === action) current = null;
            if (!action.sent && control.getAttribute('aria-expanded') === 'true') send(key);
          }, 0);
        }
        return;
      }
    }
    function homeLink(card) {
      if (page !== 'home' || !homeCards.includes(card?.id)) return;
      const link = card.querySelector('.head__link');
      const key = link && linkKey(link);
      if (key) send(key);
    }
    if (page && fixture === null) {
      document.addEventListener('click', click, true);
      document.addEventListener('auxclick', e => { if (e.button === 1) click(e); }, true);
      if (page === 'home') document.addEventListener('keydown', e => {
        if (e.isTrusted && e.key === 'Enter' && e.target.matches?.('.card')) homeLink(e.target);
      }, true);
      document.addEventListener('toggle', e => {
        const action = summaries.get(e.target);
        summaries.delete(e.target);
        if (action && !action.event.defaultPrevented && e.target.open) send(action.key);
      }, true);
      window.addEventListener?.('pageshow', e => { if (e.persisted && pageSent) send('page/' + page); });
    }
    return {
      headers,
      card(key) { if (isCard(key)) return send(key); },
      first(e) { initial ||= e; },
      initial: () => pageSent ? null : initial,
      attach(url, e, isInitial, requestHeaders, card) {
        if (!page || fixture !== null || !visible() || !requestHeaders['X-Cockpit-Device']) return url;
        if (isCard(card)) return add(url, card);
        if (current?.event.eventPhase && !current.sent && current.resource?.test(e.resource)) {
          current.sent = true;
          return add(url, current.key);
        }
        if (isInitial && !pageSent) { pageSent = true; return add(url, 'page/' + page); }
        return url;
      }
    };
  })();
  const currentEntries = () => [...entries.values()].filter(e => e.token === device());
  const connectionEntries = () => currentEntries().filter(e => !e.stopped);
  const publicPauseText = '实况暂时不公开';
  let publicPaused = false, publicationVersion = 0, pausedEntry;
  let connectionSequence = 0;
  const observedConnection = (e, link) => { e.receivedAt = ++connectionSequence; e.link = e.validatedLink = link; };
  // 等电脑当轮的新数据最多 10 秒（本人 11-23 09:04）：10 秒内拿到就照常显示、不挂提示；公网回的是云端存的那份（X-Live-Source: oss）不算拿到。
  // 10 秒到了本页主数据（页面第一个订的那份，实况首页是 home）还没有新的，就挂“连不上 · 下面是几点的数据”；浏览器自己断网立刻挂。
  // 辅助读口（ai-messages、tasks 这类）10 秒拿不到新的，只在它那一块写明下面是几点的旧数，不把整页报成连不上。一读到新的就收。
  const FRESH_WAIT_MS = 10000;
  // 连上那一刻：整页所有块马上重取；网站出了新版就整页重新载入，回到原来看的位置（本人 07:52“连上我看公网还不是新的页面”）。
  const RELOAD_Y = 'wly-live-reload-y';
  let loadedRelease = null, restoreY = (() => { try { const y = sessionStorage.getItem(RELOAD_Y); sessionStorage.removeItem(RELOAD_Y); return y == null ? null : Number(y); } catch { return null; } })();
  const releaseId = () => fetch('/release-identity.json' + '?at=' + Date.now(), { cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(8000) })
    .then(r => r.ok ? r.json() : null).then(j => j?.release_id || null).catch(() => null);
  function reloadPage() {
    try { sessionStorage.setItem(RELOAD_Y, String(Math.round(globalThis.scrollY || 0))); } catch { /* 存不下就只靠浏览器自己回到原位置 */ }
    location.reload();
  }
  function reconnected() {
    later(() => refresh(false), 0);
    Promise.all([loadedRelease, releaseId()]).then(([was, now]) => { if (was && now && was !== now) reloadPage(); });
  }
  let mainResource = null;
  // 翻页取的一批（带 cursor）只管它自己那一处：读不到不算整页连不上，也不当本页主数据（M553）
  const paged = e => new URLSearchParams(e.query).has('cursor');
  const isMain = e => !paged(e) && (!mainResource || e.resource === mainResource);
  const freshArrived = e => { clearTimeout(e.freshWait); e.freshWait = 0; };
  const awaitFresh = e => { if (!e.freshWait && !paged(e)) e.freshWait = later(() => { e.freshWait = 0; staleAfterWait(e); }, FRESH_WAIT_MS); };
  function staleAfterWait(e) {
    if (publicPaused || e.stopped || e.token !== device()) return;
    if (isMain(e)) {
      observedConnection(e, { state: 'offline', basis: e.missStatus ? 'response' : 'browser', reason: e.missReason || 'unreachable' });
    } else {
      if (!e.error) e.error = '暂时读不到';
      if (e.data !== null && Number.isFinite(Date.parse(e.at))) e.fallbackNote = `这是 ${shortStamp(e.at)} 的旧数，现在读不到新的。`;
    }
    settle(e);
    emit(e);
  }
  const latestConnection = () => connectionEntries().filter(e => e.receivedAt != null)
    .sort((a, b) => b.receivedAt - a.receivedAt)[0]?.validatedLink;
  const offline = () => !publicPaused && latestConnection()?.state === 'offline';
  // 只有确认关机（副屏那格回 on: false）才算没开机；心跳停了只说明电脑从那时起没回应，可能还开着。
  const hostOffline = link => link?.reason === 'host-off';
  const heartbeatStopped = link => link?.basis === 'heartbeat' && link.heartbeat === 'stopped';
  const latestStamp = stamps => stamps.filter(at => Number.isFinite(Date.parse(at))).sort((a, b) => Date.parse(a) - Date.parse(b)).at(-1) || null;
  const dataAt = e => e.data === null ? null : e.resource === 'screen' && offline()
    ? latestStamp((e.lastCells || []).filter(cell => cell.id !== 'computer' || !hostOffline(latestConnection())).map(cell => cell.source_at)) : e.at;
  const shownUpTo = () => latestStamp(connectionEntries().map(dataAt));
  let connectionOffline = false, pageAt = null;
  const returning = (() => { try { return performance.getEntriesByType('navigation')[0]?.type === 'back_forward'; } catch { return false; } })();
  const fromLive = document.referrer?.startsWith(location.origin + '/live/');
  const returningHome = /^\/live\/(?:index\.html)?$/.test(location.pathname) && (returning || !!fromLive);
  let timer, fallback, clockOffset = 0, viewerToken = '', viewerKind = 'public', rejectedToken = '';
  const clock = () => new Date(Date.now() + clockOffset).toISOString();
  const time = (() => {
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
    return at => formatter.format(new Date(at));
  })();
  const dateFormat = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const stamp = at => dateFormat.format(new Date(at)).slice(5) + ' ' + time(at);
  const shortStamp = at => dateFormat.format(new Date(at)) === dateFormat.format(new Date(clock())) ? time(at) : stamp(at);
  const itemDetail = e => e.resource.startsWith('items/') && e.resource !== 'items/closed';
  function storage(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(prefix + key) || 'null');
      if (value === null) localStorage.removeItem(prefix + key);
      else localStorage.setItem(prefix + key, JSON.stringify(value));
    } catch { /* 浏览器禁止存储时，本次读取仍可用。 */ }
    return null;
  }
  function device() {
    try {
      const token = localStorage.getItem('wly-cockpit-device');
      return /^[A-Za-z0-9_-]{43}$/.test(token || '') ? token : '';
    } catch { return ''; }
  }
  // 配对先于任何资源建档，避免第一读和副本沿用新设备的访客身份。
  async function pair() {
    const match = /^#pair=([A-Za-z0-9_-]{43})$/.exec(location.hash);
    try {
      history.replaceState(null, '', location.pathname + location.search);
      if (match) {
        const response = await fetch(PAIR_URL, { method: 'POST', credentials: 'omit', cache: 'no-store',
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: match[1] }),
          signal: AbortSignal.timeout(12000) });
        const body = response.ok ? await response.json() : null;
        if (body?.status === 'pass' && /^[A-Za-z0-9_-]{43}$/.test(body.token || '')) {
          localStorage.setItem('wly-cockpit-device', body.token);
          if (device() === body.token) return '这台设备已设为本人设备，私人事项会直接显示';
        }
      }
    } catch { /* 格式、接口和本地存储失败，都用同一句提示。 */ }
    return '配对链接无效或已过期，请让 AI 重新发一个';
  }
  const paired = location.hash?.startsWith('#pair=') ? pair() : null;
  let pairing = paired;
  paired?.then(() => { pairing = null; });
  const cacheKey = (e, kind) => e.identity + ':' + kind + ':' + e.path;
  const canKeepBrowserCopy = e => fixture !== null || e.viewer.kind === 'owner' && !ownerOriginalResource(e.resource);
  const visitMetrics = new Set('visitors pageviews daily top_pages devices cohorts dwell speed crawlers'.split(' '));
  const oldVisits = (m, section) => m?.external_visits !== true && (visitMetrics.has(m?.id) || (section === 'more-data' && m?.visibility === 'owner' && m.mode === 'static'));
  function siteVisitScope(e, data) {
    if (fixture !== null || data == null) return data;
    const siteProject = 'projects/wly0829.cn', gap = '这份记录无法区分站外来访';
    // 缺站外标记时分两种说：这次没读到（后台没给数、给了 gap，如“这次没读到站外来访统计”）照后台写；旧记录有数却分不出站外，才写上面那句
    const why = m => m?.value == null && m?.count == null && typeof m?.gap === 'string' && m.gap && !/^(?:没有记录|最近一次记录于)/.test(m.gap) ? m.gap : gap;
    if (e.resource === siteProject) for (const section of data.sections || []) for (const m of section.metrics || []) {
      if (oldVisits(m, section.id)) { const text = why(m); Object.assign(m, { value: null, count: null, at: null, scope: null, text, gap: text, q: 'unknown' }); }
    }
    if (e.resource === [siteProject, 'records'].join('/') && visitMetrics.has(new URLSearchParams(e.query).get('section')) && data.external_visits !== true) {
      return { items: null, total: null, next: null, q: 'unknown', gap: data.items == null && typeof data.gap === 'string' && data.gap ? data.gap : gap };
    }
    const roster = e.resource === 'home' ? data.projects : e.resource === 'projects' ? data : null;
    for (const row of roster?.items || []) if (row.id === 'wly0829.cn' && oldVisits(row.headline)) row.headline = null;
    return data;
  }
  const overview = e => e.resource === 'home' && !new URLSearchParams(e.query).has('view');
  // 只在返回本窗口刚读过的同一份总览时先画副本。未配对的家网本人版也要先有本窗口的成功读数。
  function recentHomeRead(e, remember = false) {
    if (!overview(e) || !/^\/live\/(?:index\.html)?$/.test(location.pathname)) return false;
    try {
      const key = prefix + 'overview:' + cacheKey(e, e.viewer.kind);
      if (remember) {
        if (e.viewer.kind !== 'owner' || e.token || e.previewOwner) sessionStorage.setItem(key, String(Date.now()));
        return;
      }
      const readAt = Number(sessionStorage.getItem(key));
      return readAt > 0 && Date.now() - readAt <= 30 * 60000;
    } catch { return false; }
  }
  function browserCopy(e, homeReturn = false) {
    if (!canKeepBrowserCopy(e)) return null;
    if (!homeReturn && fixture === null && !site && !e.token && e.viewer.kind === 'owner') return null;
    const copy = storage(cacheKey(e, e.viewer.kind));
    return copy?.viewer?.kind === e.viewer.kind && copy.data != null && Number.isFinite(Date.parse(copy.at)) ? { ...copy, data: siteVisitScope(e, copy.data) } : null;
  }
  function entry(resource, query) {
    const params = new URLSearchParams(query || {});
    if (query && typeof query === 'object' && !(query instanceof URLSearchParams)) {
      for (const key of Object.keys(query)) if (query[key] == null) params.delete(key);
    }
    params.sort();
    const path = resource.replace(/^\/+/, '') + (params.size ? '?' + params : '');
    const token = device();
    // 用完整钥匙的128位指纹区分设备，缓存键不再复制钥匙。
    const identity = token ? [...token].reduce((hash, char) => BigInt.asUintN(128,
      (hash ^ BigInt(char.charCodeAt(0))) * 0x1000000000000000000013bn),
    0x6c62272e07bb014262b821756295c58dn).toString(16) : 'none';
    const id = identity + ':' + path;
    if (entries.has(id)) return entries.get(id);
    const viewer = storage('viewer:' + identity) || { kind: 'public', device: token ? 'unavailable' : 'none' };
    const e = { path, resource: resource.replace(/^\/+/, ''), query: params.toString(), token, identity, viewer,
      data: null, at: null, seq: -1, rev: null, now: null, etag: null, instance: null, status: 0,
      source: fixture === null ? 'net' : 'fixture', link: { state: 'unknown', basis: 'browser' },
      validatedLink: { state: 'unknown', basis: 'browser' }, warming: false,
      error: '', listeners: new Set(), pending: null };
    // 示意数平时每次现读（看得到加载中）；退回上一页时和真数一样先用存下的那份立刻画好（返回时页面往卡片里缩，底下不能是空的）
    const homeReturn = returningHome && recentHomeRead(e);
    const copy = !publicPaused && (homeReturn || (fixture === null ? viewer.kind === 'public' : returning)) ? browserCopy(e, homeReturn) : null;
    if (copy && (homeReturn || fixture !== null || Date.now() - Date.parse(copy.at) <= 30 * 60000)) {
      Object.assign(e, copy, { source: fixture === null ? 'copy' : 'fixture',
        link: { state: 'unknown', basis: 'browser' } });
      if (homeReturn) window.LiveView?.owner(e.viewer);
    }
    entries.set(id, e);
    return e;
  }
  // —— 什么时候算“在读”：加载中的样子只看这里给的 phase ——
  // 只管第一次、手上还没有可展示数据的那一读：
  //   idle 刚开始读，2.5 秒内只留卡框；wait 过了 2.5 秒还在读；slow 过了 10 秒还在读；
  //   接口回 202（正在准备）也算还在读，隔 2、4、8…秒（最多 15 秒）再问一次。
  //   ready 有数（电脑不在线时存下的旧数也算）；none 读完了、这块就是没有数；gone 连不上、这块又没存下来。
  // 定时重读、手动重读、换回前台再读，都不出加载样子。
  // 页面要跟着变，watch 时给 phase 回调：每次 link 之后都会调；2.5 秒、10 秒到点时只调 phase（没接的页面不受打扰）。
  const WAIT_MS = 2500, SLOW_MS = 10000;
  const later = (fn, ms) => { const t = setTimeout(fn, ms); t?.unref?.(); return t; };
  function begin(e) {
    if (e.reading || e.answered || e.data !== null || !e.listeners.size) return;
    const r = e.reading = { shown: false, slow: false, tries: 0, retry: null };
    r.timers = [later(() => { r.shown = true; if (e.reading === r) emit(e, true); }, WAIT_MS),
      later(() => { r.slow = true; if (e.reading === r) emit(e, true); }, SLOW_MS)];
  }
  function end(e) {
    if (!e.reading) return;
    e.reading.timers.forEach(clearTimeout);
    clearTimeout(e.reading.retry);
    e.reading = null;
  }
  // 一次读完以后：202 还在准备就接着等、过一会儿再问；别的都算这一读有了结果
  function settle(e) {
    const r = e.reading;
    if (r && e.data === null && e.warming && e.listeners.size) {
      clearTimeout(r.retry);
      r.retry = later(() => { if (!document.hidden && e.reading === r) read(e); }, Math.min(15000, 2000 * 2 ** r.tries++));
      return;
    }
    e.answered = true;
    end(e);
  }
  function phase(e) {
    if (publicPaused) return 'paused';
    if (e.data !== null) return 'ready';
    if (offline()) return 'gone';
    if (e.reading) return e.reading.slow ? 'slow' : e.reading.shown ? 'wait' : 'idle';
    return e.answered ? 'none' : 'idle';
  }
  function snapshot(e, link = e.link) {
    const disconnected = offline();
    const remoteText = link?.basis !== 'browser' && link?.text;
    let text = remoteText || e.error || '';
    const at = dataAt(e), resourceAt = !publicPaused && Number.isFinite(Date.parse(at)) ? at : null;
    const upTo = disconnected ? resourceAt || shownUpTo() : null;
    const off = !publicPaused && hostOffline(link), silent = !publicPaused && !off && heartbeatStopped(link);
    const seen = link.basis === 'heartbeat' && (link.seen || link.since);
    const reason = disconnected ? off || silent ? (Number.isFinite(Date.parse(seen)) ? `电脑自 ${shortStamp(seen)} 起连不上` : '电脑不在线')
      : link.reason === 'service' ? '实况服务暂不可用'
      : link.reason === 'owner-read' ? '暂时读不到本人实况'
      : link.basis === 'browser' ? (globalThis.navigator?.onLine === false ? '当前设备未连接网络' : '连不上实况服务') : '连不上电脑' : '';
    const line = at => `${reason} · ${at ? `下面是 ${shortStamp(at)} 的数据。` : '这页没有可显示的上次数据。'}`;
    if (disconnected) text = line(upTo);
    if (publicPaused) text = publicPauseText;
    if (!text && e.data === null) text = e.warming ? '正在准备' : '没有记录';
    const stage = phase(e);
    // 本块没有最后一份数据时明确说明，不承诺页面会自行补齐。
    const say = publicPaused ? publicPauseText : stage === 'gone' ? '这一块没有可显示的上次数据。' : '';
    const now = publicPaused ? null : disconnected ? resourceAt || upTo : e.now;
    const viewer = publicPaused ? { kind: 'public', device: 'none' } : e.viewer;
    const pairNotice = !publicPaused && e.previewOwner && viewer.kind === 'public' && viewer.device === 'invalid'
      ? '这台设备的配对已失效，正在显示公开版。重新配对后可查看本人实况。' : '';
    return { meta: { at: publicPaused ? null : e.at, seq: e.seq, rev: e.rev, viewer,
      source: e.source, status: publicPaused ? 503 : e.status, withdrawn: !!e.withdrawn }, link, viewer, now,
      shownAt: resourceAt, cutoffAt: upTo, publicPaused, offline: disconnected, warming: !publicPaused && e.warming,
      text, reason, hostOff: off, silent, pageAt: disconnected ? shownUpTo() : null,
      pageAtText: disconnected && shownUpTo() ? shortStamp(shownUpTo()) : '',
      pageText: disconnected ? line(shownUpTo()) : pairNotice, pairNotice, phase: stage, say };
  }
  function present(e) {
    const disconnected = offline(), detail = itemDetail(e);
    if (disconnected && fixture === null && (detail || e.viewer.kind === 'public') && e.data !== null) forgetData(e, true);
    const observed = latestConnection();
    const link = disconnected ? (observed?.state === 'offline' ? observed : { ...e.link, state: 'offline', basis: 'browser' }) : e.link;
    const state = snapshot(e, link);
    const note = publicPaused ? '' : e.fallbackNote || '';
    const say = state.offline && state.phase === 'gone' && detail ? '这一条现在看不了' : state.say;
    const data = state.offline && e.resource === 'screen' && e.data ? { ...e.data, cells: e.lastCells || [] } : e.data;
    return { ...state, say, data: publicPaused ? null : data, fallbackNote: note,
      meta: { ...state.meta, fallbackNote: note } };
  }
  function emit(e, onlyPhase = false) {
    const state = present(e);
    if (connectionOffline && !state.offline && !publicPaused) reconnected();
    const changed = connectionOffline !== state.offline || state.offline && pageAt !== shownUpTo(); connectionOffline = state.offline; pageAt = shownUpTo();
    document.documentElement?.classList?.toggle('live-offline', offline());
    window.LiveLight?.offline(offline());
    window.LiveUI?.connection?.(state);
    for (const listener of e.listeners) {
      if (onlyPhase) { listener.callbacks.phase?.(state); continue; }
      const version = e.data === null ? null : e.viewer.kind + ':' + e.rev + ':' + (e.source === 'fallback');
      if (listener.version !== version && (e.data !== null || listener.version !== undefined)) {
        listener.version = version;
        listener.callbacks.data?.(state.data, state.meta);
      }
      listener.callbacks.link?.(state);
      listener.callbacks.phase?.(state);
    }
    if (changed) for (const other of currentEntries()) if (other !== e && other.listeners.size) emit(other);
    if (restoreY != null && isMain(e) && e.data !== null) {
      const y = restoreY; restoreY = null;
      requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(0, y)));
    }
    return state;
  }
  function save(e) {
    if (e.data === null) return;   // 示意数也存一份（键里带 fixture，和真数分开），只在退回来时用
    rememberScreen(e);
    if (!canKeepBrowserCopy(e)) return;
    storage(cacheKey(e, e.viewer.kind), { data: e.data, at: e.at, seq: e.seq, rev: e.rev, stale_after: e.stale_after, refresh_seconds: e.refresh_seconds,
      viewer: e.viewer, now: e.now, etag: e.etag, validatedLink: e.validatedLink, lastCells: e.lastCells });
    if (e.status === 200 || e.status === 304) recentHomeRead(e, true);
  }
  function rememberScreen(e, cells = e.data?.cells, at = e.at) {
    if (e.resource !== 'screen') return;
    const previous = new Map((e.lastCells || []).map(cell => [cell.id, cell]));
    for (const cell of cells || []) {
      const sampled = cell.source_at ?? cell.at ?? at;
      const known = cell.id === 'computer' ? Number.isFinite(cell.cpu_c) || Number.isFinite(cell.uptime)
        : Number.isInteger(cell.n) && !['unknown', 'warming'].includes(cell.q);
      if (known && Date.parse(sampled) >= (Date.parse(previous.get(cell.id)?.source_at) || 0)) previous.set(cell.id, { ...cell, source_at: sampled });
    }
    e.lastCells = [...previous.values()];
  }
  function forgetData(e, forgetCopy = false) {
    if (forgetCopy) storage(cacheKey(e, e.viewer.kind), null);
    Object.assign(e, { data: null, at: null, seq: -1, rev: null, etag: null, lastCells: null, fallbackNote: '' });
  }
  function audience(e, viewer) {
    if (!viewer) return;
    // 设备刚被拒绝时，先前已发出的读数也不能把本人份画回来。
    if (viewer.device === 'invalid' && e.token && rejectedToken !== e.token) { rejectedToken = e.token; publicationVersion++; }
    if (viewer.kind === 'owner' && rejectedToken === e.token) rejectedToken = '';
    window.LiveView?.owner(viewer);
    viewerToken = e.token; viewerKind = viewer.kind;
    storage('viewer:' + e.identity, viewer);
    if (viewer.kind !== e.viewer.kind) forgetData(e);
    e.viewer = viewer;
    if (viewer.device === 'invalid') {
      // 明确失效后，同设备其它资源也不能继续展示本人内容。
      for (const other of entries.values()) {
        if (other.identity !== e.identity) continue;
        storage(cacheKey(other, 'owner'), null);
        if (other !== e && other.viewer.kind === 'owner') {
          other.viewer = viewer;
          forgetData(other, itemDetail(other)); clearFailure(other);
          if (itemDetail(other)) other.status = 403;
          emit(other);
        }
      }
    }
  }
  function failed(e, status, body, via) {
    e.status = status; e.warming = false;
    if (status === 403 || status === 410 || status === 404 && body?.error === 'live_missing') {
      e.withdrawn = true;
      forgetData(e, true);
      e.source = fixture === null ? 'net' : 'fixture';
    }
    if (status === 403) {
      audience(e, { kind: 'public', device: 'invalid' });
    }
    e.error = status === 403 ? '这部分只对本人开放' : [404, 410, 503].includes(status) ? '暂时读不到' : body?.text || '';
    if (paged(e)) return;
    const reachable = status >= 400 && status < 500 || /^live_((source|variant|detail)_unavailable|publication_revoked)$/.test(body?.error || '');
    const reason = via || (body?.error === 'owner_read_failed' ? 'owner-read' :
      body?.error === 'preview_upstream_not_listening' || [500, 503].includes(status) && !body?.error?.startsWith('snapshot_') ? 'service' : 'unreachable');
    if (!body?.link && !reachable && !(e.validatedLink?.basis === 'heartbeat' && e.validatedLink?.heartbeat === 'stopped')) {
      e.missReason = reason; e.missStatus = status;
      if (globalThis.navigator?.onLine !== false) { awaitFresh(e); return; }
      freshArrived(e); // 浏览器断网时立刻挂；10 秒的等待从重新联网后那一读算起
    } else freshArrived(e);
    observedConnection(e, body?.link || (reachable
      ? { state: 'online', basis: 'response', since: e.link?.since || clock() }
      : e.validatedLink?.basis === 'heartbeat' && e.validatedLink?.heartbeat === 'stopped' ? e.validatedLink
      : { state: 'offline', basis: status ? 'response' : 'browser', reason }));
  }
  function clearFailure(e) {
    clearTimeout(e.failure?.retry); clearTimeout(e.failure?.fallback);
    e.failure = null;
  }
  function stopPolling() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  const ACTIVITY_POLL_SECONDS = 30, DEFAULT_POLL_SECONDS = 60;
  const pollSeconds = e => e.path === 'screen' || e.path === 'chats' || /^chats\/[^/?]+$/.test(e.path)
    ? ACTIVITY_POLL_SECONDS : DEFAULT_POLL_SECONDS;
  function startPolling() {
    if (!timer && !publicPaused && currentEntries().some(e => e.listeners.size)) {
      let activityOnly = false;
      timer = setInterval(() => {
        activityOnly = !activityOnly;
        if (!document.hidden) refresh(activityOnly ? 'activity' : true);
      }, ACTIVITY_POLL_SECONDS * 1000);
    }
  }
  function pausePublication(e) {
    if (publicPaused) return present(e);
    publicPaused = true;
    pausedEntry = e;
    publicationVersion++;
    viewerKind = 'public';
    stopPolling();
    fallback = null;
    // 访客已读过的浏览器副本也清掉，免得回到其它页时先画出旧数。
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (visitorNetCopy.test(key)) localStorage.removeItem(key);
      }
    } catch { /* 浏览器可能禁用存储。 */ }
    const all = currentEntries();
    for (const item of all) {
      forgetData(item, true);
      clearFailure(item);
      end(item);
      Object.assign(item, { status: 503, warming: false, error: '', answered: true, now: null, receivedAt: null, source: 'net',
        link: { state: 'unknown', basis: 'browser' }, validatedLink: null });
    }
    window.LiveUI?.publicPause?.(true, publicPauseText);
    for (const item of all) if (item.listeners.size) emit(item);
    return present(e);
  }
  function revokePublication(e, body) {
    publicationVersion++;
    fallback = null;
    const affected = currentEntries().filter(item => item === e || item.viewer.kind === 'public');
    for (const item of affected) {
      forgetData(item, true);
      clearFailure(item);
      item.withdrawn = true;
      item.source = 'net';
      failed(item, 503, body);
      settle(item);
    }
    for (const item of affected) if (item !== e && item.listeners.size) emit(item);
  }
  function restoreBrowserCopy(e) {
    if (e.data === null && !itemDetail(e)) {
      const copy = browserCopy(e);
      if (copy) Object.assign(e, copy, { source: 'copy', etag: null, now: e.now || copy.now, validatedLink: e.validatedLink });
    }
    rememberScreen(e);
  }
  async function retryFailure(e, retryCopy, notListening = false) {
    if (publicPaused || paged(e)) return;
    restoreBrowserCopy(e);
    const f = e.failure ||= { tries: 0, fallback: later(async () => {
      f.fallback = null;
      await useFallback(e, f);
      if (e.failure === f) { settle(e); emit(e); }
    }, 15000) };
    clearTimeout(f.retry);
    // 本机首页在服务尚未监听时把前几次问询摊开；15 秒离线副本计时照旧。
    // 读不到时先隔 2、4 秒再问，之后一直每 10 秒问一次，不越隔越久；页面切到后台时停，切回来马上重读（visibilitychange）。
    const delays = notListening ? [2000, 2000, 2000, 2000, 6000] : [2000, 4000];
    const delay = f.tries < delays.length ? delays[f.tries] : 10000;
    f.tries++;
    f.retry = later(() => { if (!document.hidden && e.token === device() && e.failure === f) read(e); }, delay);
    if ((retryCopy || offline()) && e.source !== 'fallback') { await useFallback(e, f); if (e.failure === f) settle(e); }
  }
  function fallbackMetadata(e, at, proof) {
    if (e.withdrawn || e.viewer.kind === 'owner' && e.data !== null || typeof at !== 'string' ||
        !Number.isFinite(Date.parse(at)) || proof?.policy !== visitorPolicy || !validAudience(proof.audience)) return;
    forgetData(e, e.viewer.kind === 'public');
    Object.assign(e, { at: new Date(at).toISOString(), rev: 'metadata-' + proof.audience, source: 'fallback',
      fallbackNote: `公开备用包生成于北京时间 ${stamp(at)}，详情暂时读不到。` });
  }
  async function usePackagedCopy(e) {
    if (fixture !== null || publicPaused || !offline() || e.withdrawn || e.link.reason === 'owner-read' || e.source === 'fallback') return;
    const failure = e.failure;
    if (!fallback) {
      // 发布时只换同版成品登记中的数据地址，页面脚本不随备用包换版。
      const options = { cache: 'no-cache', credentials: 'omit', signal: AbortSignal.timeout(15000) };
      const json = r => r.ok ? r.json() : null;
      const request = fetch('/release-identity.json', options).then(json).then(identity => {
        const copy = identity?.live_fallback;
        if (!copy) return null;
        const address = localFallback ? copy.path : copy.origin + '/' + copy.key;
        return fetch(address, options).then(json);
      }).catch(() => null).then(file => {
        const proof = file?.publication;
        if (file?.metadata_only === true && proof?.policy === visitorPolicy && validAudience(proof.audience)) {
          return { at: file.at, proof };
        }
        if (fallback === request) fallback = null;
        return null;
      });
      fallback = request;
    }
    const file = await fallback;
    if (publicPaused || !failure || e.failure !== failure) return;
    fallbackMetadata(e, file?.at, file?.proof);
  }
  async function useFallback(e, failure) {
    if (!offline()) return;
    await usePackagedCopy(e);
    if (fixture !== null || publicPaused || e.failure !== failure || e.token !== device() || itemDetail(e)) return;
    if (e.source !== 'fallback' && Number.isFinite(Date.parse(e.at))) {
      const sameDay = dateFormat.format(Date.parse(e.at)) === dateFormat.format(Date.now());
      e.fallbackNote = `这是 ${sameDay ? time(e.at) : stamp(e.at)} 的旧数，现在读不到新的。`;
    }
  }
  function read(e, isInitial = false, card, retryCopy = false) {
    if (e.pending && e.requestVersion === publicationVersion) return e.pending;
    const version = e.requestVersion = publicationVersion;
    begin(e); awaitFresh(e);
    e.requestedAt = Date.now();
    const request = (async () => {
      let response, body, directLan = false;
      if (demoSlow) await new Promise(resolve => later(resolve, demoSlow));
      try {
        const target = fixture === null ? readRequest(e.path, e.token) : {
          url: '/live/_fixtures/' + (fixture ? encodeURIComponent(fixture) + '/' : '') + e.resource + '.json',
          headers: {}, credentials: 'same-origin'
        };
        directLan = Boolean(target.lan);
        const url = opened.attach(target.url, e, isInitial, target.headers, card);
        response = await fetch(url, { cache: 'no-store', credentials: target.credentials,
          headers: { ...target.headers,
            ...(e.etag ? { 'If-None-Match': e.etag } : {}) }, signal: AbortSignal.timeout(15000) });
        if (version !== publicationVersion || publicPaused && response.headers.get('X-Live-Source') === 'oss') return present(e);
        if (response.status !== 204 && response.status !== 304) body = await response.json().catch(error => { if (response.ok) throw error; return null; });
      } catch {
        if (version !== publicationVersion || e.token !== device() || publicPaused || e.stopped) return present(e);
        let notListening = false;
        if (directLan && e.resource === 'home') {
          const probe = await fetch(base + 'access', { cache: 'no-store', credentials: 'omit',
            signal: AbortSignal.timeout(3000) }).catch(() => null);
          if (probe?.status === 502) notListening =
            (await probe.json().catch(() => null))?.error === 'preview_upstream_not_listening';
        }
        if (version !== publicationVersion || e.token !== device() || publicPaused || e.stopped) return present(e);
        failed(e, 0, null, notListening ? 'service' : undefined);
        await retryFailure(e, retryCopy, notListening);
        return emit(e);
      }
      if (version !== publicationVersion || e.token !== device()) return present(e);
      const oss = response.headers.get('X-Live-Source') === 'oss';
      if (!oss && body?.error === 'live_public_paused') return pausePublication(e);
      if (!oss && body?.error === 'live_publication_revoked') {
        revokePublication(e, body);
        if (!e.stopped) await retryFailure(e, false);
        return emit(e);
      }
      if (!site && body?.viewer) e.previewOwner = directLan && body.viewer.kind === 'owner' || response.headers.get('X-Wly-Preview-View') === 'owner';
      // 退订后仍遵守停公开和设备失效；该订阅本身不再读数、重试或参与整页离线判断。
      if (e.stopped && response.status !== 403 && body?.error !== 'live_missing') return present(e);
      if (publicPaused) {
        if (oss || response.status !== 200 || !body || body.error) return present(e);
        publicPaused = false;
        pausedEntry = null;
        startPolling();
      }
      const responseNow = !oss && Number.isFinite(Date.parse(body?.now)) ? body.now : response.headers.get('Date');
      if (Number.isFinite(Date.parse(responseNow))) { e.now = new Date(responseNow).toISOString(); clockOffset = Date.parse(responseNow) - Date.now(); }
      const via = response.headers.get('X-Live-Connection');
      if (oss) {
        failed(e, 503, null, via || 'unreachable');
        restoreBrowserCopy(e);
        if (fixture === null && body?.error === 'snapshot_metadata_only' && offline()) fallbackMetadata(e, body.at, {
          policy: response.headers.get('X-Live-Fallback-Policy'), audience: response.headers.get('X-Live-Fallback-Audience')
        });
        await retryFailure(e, retryCopy); if (e.data !== null || offline()) settle(e); return emit(e);
      }
      e.status = response.status; e.error = '';
      if (response.status === 304) {
        clearFailure(e); freshArrived(e); e.fallbackNote = '';
        observedConnection(e, e.validatedLink?.basis === 'heartbeat' ? e.validatedLink : { state: 'online', basis: 'response' });
        e.source = fixture === null ? 'net' : 'fixture';
      } else if (response.ok) {
        freshArrived(e);
        if (!loadedRelease && fixture === null && isMain(e)) loadedRelease = releaseId();
        const wasFallback = e.source === 'fallback';
        const instance = /^"live-([a-f0-9]{16})-/.exec(response.headers.get('ETag'))?.[1];
        const viewer = body?.viewer;
        audience(e, viewer);
        const link = body?.link || { state: 'online', basis: 'response' };
        const hostOff = e.resource === 'screen' && body?.data?.cells?.some(cell => cell.id === 'computer' && cell.on === false);
        observedConnection(e, hostOff ? { ...link, state: 'offline', reason: 'host-off' } : heartbeatStopped(link) ? { ...link, state: 'offline' } : link);
        e.warming = response.status === 202 || body?.q === 'warming';
        if (fixture === null && itemDetail(e) && e.link.state === 'offline' && e.viewer.device !== 'invalid') {
          if (!wasFallback) forgetData(e, true);
          await retryFailure(e, retryCopy);
          settle(e);
          return emit(e);
        }
        clearFailure(e);
        if (itemDetail(e) && e.viewer.device === 'invalid') {
          forgetData(e, true);
          e.status = 403; e.error = '这部分只对本人开放';
        } else if (e.source === 'copy' && e.data !== null && e.warming && body?.data == null) {
          settle(e);
          return emit(e);
        } else if (body?.data != null && (wasFallback || e.source === 'copy' ||
                   (instance && instance !== e.instance) || body.seq >= e.seq)) {
          e.data = siteVisitScope(e, body.data); e.seq = body.seq; e.rev = body.rev; e.at = body.at;
          e.withdrawn = false;
          e.instance = instance;
          e.stale_after = body.stale_after; e.refresh_seconds = body.refresh_seconds;
        }
        e.fallbackNote = '';
        e.source = fixture === null ? 'net' : 'fixture';
        e.etag = e.status === 403 ? null : response.headers.get('ETag');
        save(e);
      } else {
        failed(e, response.status, body, via);
        if (![403, 404, 410].includes(response.status)) {
          const notListening = !site && fixture === null && e.resource === 'home' &&
            /^\/live(?:\/(?:index\.html)?)?$/.test(location.pathname) &&
            response.status === 502 && body?.error === 'preview_upstream_not_listening';
          await retryFailure(e, retryCopy, notListening);
          return emit(e);
        }
        clearFailure(e);
      }
      settle(e);
      return emit(e);
    })().finally(() => { if (e.pending === request) e.pending = null; });
    return e.pending = request;
  }
  async function refresh(onlyDue, fresh = false) {
    if (pairing) return pairing.then(() => refresh(onlyDue, fresh));
    const polling = onlyDue === true || onlyDue === 'activity';
    if (publicPaused && polling) return { ok: false, at: null };
    // 点页面上的刷新：和浏览器刷新一样从头读。页面早先顺手取过、现在没在显示的那几份（翻页、展开、探测）
    // 当作已退订：不再拿它们上一回（或还在路上那一读）的“连不上”压住整页，也不再重读，页面再要时 get 会重新订上；
    // 正在显示的每份都整份重读，不带上一回的条件和重试计时。
    if (fresh) for (const e of entries.values()) {
      clearFailure(e); e.etag = null;
      if (!e.listeners.size) { e.stopped = true; e.receivedAt = null; end(e); }
    }
    const active = [...entries.values()].filter(e => !e.stopped
      && (onlyDue !== 'activity' || pollSeconds(e) === ACTIVITY_POLL_SECONDS
        && !e.failure && e.validatedLink?.state !== 'offline')
      && (e.listeners.size || e.receivedAt != null && e.validatedLink?.state === 'offline')).map(e => {
      if (e.token === device()) return e;
      const next = entry(e.resource, e.query);
      if (e.listeners.size) next.stopped = false;
      for (const listener of e.listeners) { listener.entry = next; next.listeners.add(listener); }
      e.listeners.clear();
      emit(next);
      return next;
    });
    const probe = publicPaused && (active[0] || entry(pausedEntry.resource, pausedEntry.query));
    const states = probe ? [await read(probe)] : [];
    if (publicPaused) return { ok: false, at: null };
    const due = polling ? active.filter(e => e.failure || !e.refresh_seconds || e.refresh_seconds <= pollSeconds(e)
      || Date.now() - e.requestedAt >= e.refresh_seconds * 1000) : active;
    states.push(...await Promise.all(due.filter(e => e !== probe).map(e => read(e, false, undefined, true))));
    if (probe && !publicPaused) window.LiveUI?.publicPause?.(false, publicPauseText);
    return {
      ok: states.every(s => s.meta.status >= 200 && s.meta.status < 400),
      at: states.map(s => s.shownAt).filter(Boolean).sort().at(-1) || null
    };
  }
  function watch(resource, query, callbacks) {
    if (pairing) {
      let subscription, stopped = false;
      pairing.then(() => { if (!stopped) subscription = watch(resource, query, callbacks); });
      return { stop() { stopped = true; subscription?.stop(); } };
    }
    const e = entry(resource, query), listener = { callbacks, version: undefined, entry: e };
    mainResource ||= resource;
    e.stopped = false;
    e.listeners.add(listener);
    opened.first(e);
    if (!document.hidden && !publicPaused) read(e, true);
    if (publicPaused || e.data !== null) emit(e);
    startPolling();
    return { stop() {
      const e = listener.entry;
      if (!e.listeners.delete(listener) || e.listeners.size) return;
      e.stopped = true;
      end(e);
      clearFailure(e);
      if (![...entries.values()].some(item => item.listeners.size)) stopPolling();
      if (connectionOffline !== offline()) emit(e);
    } };
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    const e = opened.initial();
    if (!publicPaused && e?.listeners.size && e.token === device()) read(e, true);
    refresh();
  });
  window.addEventListener?.('online', () => refresh(false, true));
  function get(resource, query, card, { fallbackOnFailure = false } = {}) {
    if (pairing) return pairing.then(() => get(resource, query, card, { fallbackOnFailure }));
    const e = entry(resource, query);
    if (publicPaused) return Promise.resolve(present(e));
    e.stopped = false;
    if (e.pending) opened.card(card);
    // 返回时，点开才读的明细也先照存下的画；现读在后台补，不挡住回来的第一帧。
    if (returning && e.data !== null && (fixture !== null || e.viewer.kind === 'owner')) { read(e, true, card); return Promise.resolve(present(e)); }
    if (!paged(e)) return read(e, true, card, fallbackOnFailure);
    // 这一批没读到（连不上或服务出错）：隔 2 秒、5 秒自己再取，还不行才交回页面在那一处写“这一批没读到”（M553）
    return (async () => {
      let state = await read(e, true, card);
      for (const wait of [2000, 5000]) {
        if (state.data != null || state.meta?.status >= 400 && state.meta.status < 500 || e.stopped) break;
        await new Promise(resolve => later(resolve, wait));
        state = await read(e, true, card);
      }
      return state;
    })();
  }
  function afterReady(ready, callbacks) {
    // 请求和静态资源一起起跑。画面准备好时只交付每种通知的最新状态。
    let queued = new Map();
    ready.then(() => {
      const latest = queued;
      queued = null;
      for (const [name, args] of latest) callbacks[name](...args);
    });
    return Object.fromEntries(Object.entries(callbacks).map(([name, callback]) => [name, (...args) => {
      if (!queued) return callback(...args);
      queued.delete(name);
      queued.set(name, args);
    }]));
  }
  const antigravityOpenMessages = {
    antigravity_conversation_missing: ['Antigravity 找不到这段对话，请刷新实况。', 'Antigravity 还没有索引这段对话的项目，请稍后重试。'],
    antigravity_conversation_ambiguous: ['Antigravity 有同名对话，无法确认原对话。请在应用里选择。'],
    antigravity_open_busy: ['台式机正在打开另一段 Antigravity 对话，请稍后重试。'],
    antigravity_open_unavailable: [
      '台式机暂时无法打开 Antigravity 对话，请稍后重试。', '无法打开 Antigravity 对话，请在应用内搜索标题。',
      '台式机上的 Antigravity 桌面暂时不可用，请登录电脑后重试。', 'Antigravity 的“搜索会话”入口无法使用，请在应用里按 Ctrl+K 搜索。',
      'Antigravity 搜索里没有唯一对应的结果。请在应用里核对标题和项目。', 'Antigravity 没有确认已切到原对话，请在台式机上核对。',
    ],
  };
  async function open(itemId, target, href) {
    // 本机产物和事项共用打开接口；别名及其相对路径原样交回电脑。
    if (href && typeof href === 'object') ({ item_id: itemId, target } = href);
    if (typeof href === 'string' && /^(file:|[a-z]:[\\/]|\\\\)/i.test(href)) {
      let path = href;
      if (/^file:/i.test(href)) {
        try {
          path = decodeURIComponent(href.replace(/^file:\/\/\/(?=[a-z]:)/i, '').replace(/^file:\/\//i, '//'));
          path = path.replace(/\//g, '\\');
        } catch { /* 地址含无效转义时仍能复制原地址。 */ }
      }
      return { ok: false, text: '这是电脑上的文件', path };
    }
    if (fixture !== null) return { ok: false, text: '示意按钮；没有在电脑上打开' };
    const token = device();
    if (viewerKind !== 'owner') return { ok: false, text: '仅本人设备可以打开' };
    if (!token || token !== viewerToken) return { ok: false, text: site ? '请先连接电脑，再打开这项内容' : '本机预览不能打开电脑上的文件，请从正式实况打开' };
    if (!itemId || !target) return { ok: false, text: '没有可打开的目标，请重读后再试' };
    const antigravity = target === 'conversation' && /^antigravity:/i.test(itemId);
    try {
      const url = site ? 'https://mcp.wly0829.cn/computer-access/api/cockpit/open' : '/__computer/cockpit/open';
      const response = await fetch(url, { method: 'POST', cache: 'no-store', credentials: 'omit',
        headers: { 'Content-Type': 'application/json', 'X-Cockpit-Device': token },
        body: JSON.stringify({ item_id: itemId, target }), signal: AbortSignal.timeout(antigravity ? 18000 : 12000) });
      const body = await response.json().catch(() => null);
      if (response.status === 403) {
        viewerKind = 'public';
        const detail = body?.error === 'cockpit_owner_required'
          && currentEntries().find(e => e.token === token && e.resource === `items/${encodeURIComponent(itemId)}`);
        if (detail) {
          failed(detail, 403, body); clearFailure(detail); settle(detail); emit(detail);
        }
      }
      const antigravityError = typeof body?.error === 'string' && body.error.startsWith('antigravity_');
      const fixed = response.status === 503 && target === 'conversation' && antigravityError && antigravityOpenMessages[body.error];
      const text = fixed ? fixed.find(message => message === body.message?.replaceAll?.('主驾驶', '台式机')) || fixed[0]
        : !antigravity && !antigravityError && ![404, 503].includes(response.status) && typeof body?.message === 'string' && /[一-鿿]/.test(body.message) ? body.message : '';
      return { ok: response.ok, text: text || (response.ok ? '已在电脑上打开'
        : response.status === 403 ? '设备已失效，没打开，请重新连接电脑'
        : response.status === 404 ? '目标已不存在，没打开，请重读后再试'
        : response.status === 429 ? '点得太快了，没打开，稍后再试' : '电脑没打开，稍后再试') };
    } catch { return { ok: false, text: '连不上电脑，没打开，稍后再试' }; }
  }
  async function automationSetting(data) {
    await pairing;
    const token = publicView ? '' : device();
    const denied = { status: 'error', error: 'cockpit_owner_required' };
    if (fixture !== null || !token) {
      window.TrustModal?.show();
      return denied;
    }
    const url = site ? 'https://mcp.wly0829.cn/computer-access/api/cockpit/automation-settings' : '/__computer/cockpit/automation-settings';
    try {
      const response = await fetch(url, { method: 'POST', cache: 'no-store', credentials: 'omit',
        headers: { 'Content-Type': 'application/json', 'X-Cockpit-Device': token },
        body: JSON.stringify(data), signal: AbortSignal.timeout(12000) });
      const reply = await response.json();
      if (response.status === 403 && reply?.error === denied.error) {
        window.LiveView?.owner?.({ kind: 'public', device: 'invalid' });
        window.TrustModal?.show();
      }
      return response.status < 500 && reply?.status ? reply : { status: 'unknown' };
    } catch { return { status: 'unknown' }; }
  }
  const ownerWrites = new Map();
  async function sendOwnerAction(token, data) {
    const url = site ? 'https://mcp.wly0829.cn/computer-access/api/cockpit/actions' : '/__computer/cockpit/actions';
    try {
      const response = await fetch(url, { method: 'POST', cache: 'no-store', credentials: site ? 'omit' : 'same-origin',
        headers: { 'Content-Type': 'application/json', ...(site ? { 'X-Cockpit-Device': token } : opened.headers(token)) },
        // 后台忙时一笔要一分多钟才回（11-23 本人点的两笔 76、88 秒）：等足两分钟，别 15 秒就放弃再排一笔
        body: JSON.stringify(data), signal: AbortSignal.timeout(120000) });
      const result = await response.json();
      if (response.status === 403 && result?.error === 'cockpit_owner_required') {
        viewerKind = 'public';
        window.LiveView?.owner({ kind: 'public', device: 'invalid' });
      }
      if (response.status < 500 && result?.status) return result;
    } catch { /* 原请求可能已经写入，须按同一提交编号核对。 */ }
    return null;
  }
  // 浏览器自己断网时马上重读一次，立刻挂“连不上”（联网时的重读在上面 online 那一行）。
  globalThis.addEventListener?.('offline', () => { if (!publicPaused) refresh(false); });
  window.Live = { reload: reloadPage, watch, refresh, open, paired, offline, readRequest, automationSetting, upTo: shownUpTo, stamp, returningHome,
    get, afterReady, markOpened: opened.card,
    copy(item, intent = 'ask') {
      if (intent === 'stop' && /^task-/.test(item.id)) {
        const name = String(item.name || item.title || '自动任务').replace(/\s+/g, ' ').slice(0, 90);
        return `请看实况任务 ${item.id}（${name}）：请说明怎么停、停了会影响什么，先不要停止。`;
      }
      const text = String(item.text || item.title || item.name || '').replace(/\s+/g, ' ').slice(0, 90).replace(/[。！？；]+$/, '');
      if (intent === 'done' && item.kind === 'choose') {
        const card = item.owner_source_id ? '事项原编号 ' + item.owner_source_id : '实况事项 ' + item.id;
        return card + (text ? '（' + text + '）' : '') + '。我的回答：____。请处理后按编号关卡，要我做什么直接问我。';
      }
      if (item.owner_source_id && ['done', 'decline', 'ask'].includes(intent)) {
        const heading = '事项原编号 ' + item.owner_source_id + (text ? '（' + text + '）' : '') + '。';
        // 问情况就是复制给 AI（本人 11-22 16:04）：带原编号，AI 能按编号查、按编号关
        if (intent === 'ask') return heading + '请说明这件事现在的情况；我已经办完的，请核实后按编号关卡；要我做什么直接问我。';
        if (intent === 'done') return heading + '我已办完，请核实后按编号关卡，要我做什么直接问我。';
        if (item.decline_followup) return heading + '这一项我不办了。后续请处理：' + item.decline_followup;
      }
      const ending = { ask: '请说明现在的情况。', done: '我已办完，请核实。',
        decline: '这次不办。', later: '稍后再办。' }[intent] || '请说明现在的情况。';
      return '请看实况 ' + item.id + '：' + (text ? text + '，' : '') + ending;
    },
    canOwnerAct() {
      const token = device();
      return (site || Boolean(lanBase)) && fixture === null && !publicView && !offline() &&
        viewerKind === 'owner' && !!token && token === viewerToken;
    },
    async applyOwnerItems(items, action, followReceipt = false) {
      const saved = [];
      let pending = 0, unconfirmed = 0, message = '没有确认保存，请重读这件事。', error = '';
      for (const item of items) {
        const result = await window.Live.ownerAction(item, action, followReceipt);
        if (result.status === 'applied') saved.push(item.id);
        else if (result.status === 'waiting_undo') pending++;
        else if (result.status === 'unknown') { unconfirmed++; message = result.message; }
        else if (result.error === 'cockpit_owner_required') { message = '不是可信设备'; error = result.error; }
        else { if (result.message) message = result.message; error = result.error || ''; }
      }
      return { saved, pending, unconfirmed, message, error };
    },
    async ownerAction(item, action, followReceipt = false) {
      if (!window.Live.canOwnerAct()) return { status: 'error', error: 'cockpit_owner_required', message: '不是可信设备' };
      const token = device();
      const key = JSON.stringify([token, item.id, item.item_version, action]);
      let write = ownerWrites.get(key);
      if (!write) {
        const data = { item_id: item.id, item_version: item.item_version, action, direct: true,
          idempotency_key: Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('') };
        if (action === 'snooze') data.until = 'tomorrow_10';
        write = { data, request: null };
        ownerWrites.set(key, write);
      }
      write.request ||= (async () => {
        let result = await sendOwnerAction(token, write.data);
        // 后端按原请求编号先查回执，事项已经变动也仍能确认原操作；没回或还在写，就拿同一编号接着查。
        if (followReceipt) {
          const started = Date.now();
          let lastReply = started;
          // 读数卡住时页面会显示连不上，这里照样拿同一编号去查；最多查两分半钟。
          while ((!result || result.status === 'waiting_undo') && device() === token && Date.now() - lastReply < 90000 && Date.now() - started < 150000) {
            await new Promise(resolve => setTimeout(resolve, Date.now() - started < 60000 ? 3000 : 15000));
            if (device() !== token) break;
            result = await sendOwnerAction(token, write.data);
            if (result) lastReply = Date.now();
          }
          if (result?.status === 'waiting_undo' || result?.error === 'cockpit_owner_required') result = null;
        } else if (!result && device() === token && window.Live.canOwnerAct()) {
          result = await sendOwnerAction(token, write.data);
        }
        write.request = null;
        if (result && result.status !== 'waiting_undo') ownerWrites.delete(key);
        return result || { status: 'unknown', message: followReceipt
          ? '暂时没读到办理结果，稍后刷新可以看最新状态。' : '还没确认结果，再点一次可继续核对。' };
      })();
      return write.request;
    }
  };
})();

(() => {
  const endpoint = 'https://wly0829-img-media-shanghai.cn-shanghai.oss.aliyuncs.com/_v.gif';
  const randomId = () => globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);
  const rootEntry = /^\/cv\/?$/.test(location.pathname);
  const liveEntry = /^\/cv\/live\/?$/.test(location.pathname);
  const redirectTo = rootEntry ? '/' : liveEntry ? '/live/' : '';
  const canonical = location.hostname === 'wly0829.cn';
  if (!canonical && (liveEntry || location.hostname !== 'www.wly0829.cn')) {
    if (redirectTo) location.replace(redirectTo);
    return;
  }
  let visitor = '', self = false, entry = '', cvSession = '', device = '', storageReadable = false;
  const query = new URLSearchParams(location.search);
  const viaKey = 'wly-site-via';
  const cvKey = 'wly-site-cv-session';
  const lastSourceKey = 'wly-site-cv-last';
  const sourceActive = () => Date.now() - Number(sessionStorage.getItem(lastSourceKey) || 0) <= 30 * 60 * 1000;
  const shortSource = value => value && value.length <= 32 && !/[^A-Za-z0-9-]/.test(value) ? value : '';
  const isCvSource = value => value === 'cv' || (value.length > 3 && value.startsWith('cv-'));
  const sources = canonical && /^\/live\/?$/.test(location.pathname) ? query.getAll('via') : [];
  let via = liveEntry ? 'cv' : sources.length === 1 ? shortSource(sources[0]) : '';
  const invalidSource = sources.length > 0 && !via;
  const liveCv = isCvSource(via);
  try {
    if (query.get('self') === '1') localStorage.setItem('wly-site-self', '1');
    if (query.get('self') === '0') localStorage.removeItem('wly-site-self');
    self = localStorage.getItem('wly-site-self') === '1';
    device = localStorage.getItem('wly-cockpit-device') || '';
    visitor = localStorage.getItem('wly-site-visitor') || '';
    if (!visitor) {
      visitor = randomId();
      localStorage.setItem('wly-site-visitor', visitor);
    }
    storageReadable = true;
  } catch { visitor ||= randomId(); }
  entry = rootEntry ? 'cv' : liveCv ? 'live-cv' : '';
  let newEntry = Boolean(redirectTo || via);
  let sessionReady = false;
  try {
    const active = sourceActive();
    if (!redirectTo && via && active && via === sessionStorage.getItem(viaKey) && performance.getEntriesByType?.('navigation')[0]?.type === 'reload') {
      newEntry = liveCv && !sessionStorage.getItem(cvKey);
    }
    if (newEntry || !active || invalidSource) {
      if (via) sessionStorage.setItem(viaKey, via);
      else sessionStorage.removeItem(viaKey);
      if (entry) sessionStorage.setItem(cvKey, randomId());
      else sessionStorage.removeItem(cvKey);
    }
    if (canonical) via = shortSource(sessionStorage.getItem(viaKey));
    if (!via || isCvSource(via)) cvSession = sessionStorage.getItem(cvKey) || '';
    if (cvSession) entry = isCvSource(via) ? 'live-cv' : 'cv';
    if (cvSession || via) sessionStorage.setItem(lastSourceKey, String(Date.now()));
    sessionReady = true;
  } catch { /* 会话存储受限不丢失浏览器编号和入口。 */ }
  self = query.get('self') === '1' || (query.get('self') !== '0' && self);
  const monitor = query.get('monitor') === '1' || query.get('automation') === '1' || query.has('fixture') || globalThis.navigator?.webdriver === true;
  const internal = self || monitor || /^#pair=[A-Za-z0-9_-]{43}$/.test(location.hash || '');
  let classification;
  if (!internal && /^[A-Za-z0-9_-]{43}$/.test(device)) {
    // The device credential goes only to its existing authentication origin.
    classification = fetch('https://mcp.wly0829.cn/computer-access/api/visitor-audience', {
      headers: {'X-Cockpit-Device': device}, credentials: 'omit', cache: 'no-store', signal: globalThis.AbortSignal?.timeout?.(3000)
    }).then(response => response.ok ? response.json() : null).then(result => result?.audience).catch(() => null);
  }
  const pageId = randomId();
  let visibleMs = 0, visibleSince = document.hidden ? null : performance.now(), lastLeave = -1;
  // The published project links are the allowlist for query-based identifiers.
  const catalogUrl = document.currentScript?.src && new URL('/live/project/cover-links.json', location.origin);
  let catalog;
  const projectId = ({pathname, search}) => {
    const id = /^\/live\/project\/?$/.test(pathname) ? new URLSearchParams(search).get('id')
      : /^\/projects\/([^/]+)(?:\/|$)/.exec(pathname)?.[1] || /^\/([^/]+)\/project\.html$/.exec(pathname)?.[1];
    return /^[A-Za-z0-9_.-]{1,64}$/.test(id || '') ? id : '';
  };
  const resolveProject = id => (catalog ||= fetch(catalogUrl, {credentials: 'omit', signal: globalThis.AbortSignal?.timeout?.(1500)})
    .then(response => response.ok ? response.json() : {}).catch(() => ({})))
    .then(data => Object.hasOwn(data, id) ? data[id] : Object.values(data).includes(id) ? id : '');
  const send = (event, keepalive = false, action = '', target = '', project = '') => {
    try {
      if (sessionReady && (cvSession || via)) {
        if (!sourceActive()) {
          sessionStorage.removeItem(cvKey);
          sessionStorage.removeItem(viaKey);
          cvSession = '';
          entry = '';
          via = '';
        } else if (!document.hidden) sessionStorage.setItem(lastSourceKey, String(Date.now()));
      }
      // 来源分布只需域名和路径，避免把来源网址中的凭据查询串写入日志。
      const ref = document.referrer ? new URL(document.referrer) : null;
      const params = new URLSearchParams({
        'x-v': visitor, 'x-p': location.pathname, 'x-entry': entry, 'x-cv-session': cvSession,
        'x-ref': ref ? ref.origin + ref.pathname : '',
        'x-self': self ? '1' : '0', 'x-monitor': monitor ? '1' : '0',
        'x-r': randomId(), 'x-ms': String(Math.round(performance.now())),
        'x-id': pageId, 'x-event': event,
        'x-visible': String(Math.round(visibleMs + (visibleSince === null ? 0 : Math.max(0, performance.now() - visibleSince))) / 1000)
      });
      if (via) params.set('x-via', via);
      if (action) params.set('x-action', action);
      if (target) params.set('x-target', target);
      const navigation = performance.getEntriesByType?.('navigation')[0];
      for (const [key, value] of [['ttfb', navigation?.responseStart], ['dom', navigation?.domComplete], ['load', navigation?.loadEventEnd]]) {
        if (value > 0) params.set('x-' + key, String(Math.round(value - navigation.startTime)));
      }
      const beacon = () => {
        const url = endpoint + '?' + params;
        if (keepalive) {
          fetch(url, {method: 'GET', mode: 'no-cors', keepalive: true, credentials: 'omit', cache: 'no-store'}).catch(() => {});
          return;
        }
        const beacon = new Image(1, 1);
        window.__siteVisitorBeacon = beacon;
        beacon.onload = beacon.onerror = () => {
          if (window.__siteVisitorBeacon === beacon) delete window.__siteVisitorBeacon;
        };
        beacon.src = url;
      };
      const deliver = audience => {
        params.set('x-audience', audience === 'external' || audience === 'internal' ? audience : 'unknown');
        if (classification && audience === 'internal') params.set('x-audience-source', 'device');
        const id = audience === 'external' && (event === 'view' ? projectId(location) : project);
        if (id === 'wly0829.cn') params.set('x-project', id);
        else if (id && catalogUrl) {
          resolveProject(id).then(known => {
            if (known) params.set('x-project', known);
            beacon();
          }, beacon);
          return;
        }
        beacon();
      };
      if (classification) classification.then(deliver).catch(() => {});
      else deliver(internal ? 'internal' : canonical && storageReadable ? 'external' : 'unknown');
    } catch { /* 统计失败不影响网页。 */ }
  };
  if (newEntry) send('entry', true);
  if (redirectTo) { location.replace(redirectTo); return; }
  // Page listeners (omitted from the inline redirect script).
  const reportAction = (kind, target, project) => send('action', true, kind, target, project);
  const linkAction = event => {
    if (!event.isTrusted || event.button !== (event.type === 'auxclick' ? 1 : 0)) return;
    const link = event.target?.closest?.('a[href]');
    const href = link?.getAttribute('href')?.trim();
    if (!href || href.startsWith('#')) return;
    const target = /^(?:www\.)?github\.com$/.test(link.hostname) ? 'github' : /\.pdf$/i.test(link.pathname) ? 'pdf' : '';
    if (link.hasAttribute('download')) {
      reportAction('download', target);
    } else if (link.protocol === 'https:' || link.protocol === 'http:') {
      if (link.origin !== location.origin) reportAction('external_link', target);
      else if (target === 'pdf') reportAction('download', target);
      else if (/^\/(?:projects|live\/projects?)(?:\/|$)|^\/[^/]+\/project\.html$/.test(link.pathname)) reportAction('project_link', '', projectId(link));
    }
  };
  document.addEventListener('site-email-copied', () => reportAction('email_copy'));
  document.addEventListener('click', linkAction, true);
  document.addEventListener('auxclick', linkAction, true);
  const leave = () => {
    if (visibleSince !== null) { visibleMs += Math.max(0, performance.now() - visibleSince); visibleSince = null; }
    // hidden 和 pagehide 可能连续触发；同页累计值只发一次，恢复后继续增加。
    if (lastLeave !== visibleMs) { lastLeave = visibleMs; send('leave', true); }
  };
  const resume = () => {
    if (!document.hidden && visibleSince === null) { visibleSince = performance.now(); send('resume'); }
  };
  setTimeout(() => send('view'), 0);
  if (document.readyState === 'complete') setTimeout(() => send('perf'), 0);
  else addEventListener('load', () => setTimeout(() => send('perf'), 0), {once: true});
  document.addEventListener('visibilitychange', () => document.hidden ? leave() : resume());
  addEventListener('pagehide', leave);
  addEventListener('pageshow', event => { if (event.persisted) resume(); });
  setInterval(() => { if (!document.hidden && visibleSince !== null) send('heartbeat'); }, 15000);
})();

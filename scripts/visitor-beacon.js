(() => {
  const endpoint = 'https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com/_v.gif';
  const randomId = () => globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);
  let visitor = '', self = false;
  const query = new URLSearchParams(location.search);
  try {
    if (query.get('self') === '1') localStorage.setItem('wly-site-self', '1');
    if (query.get('self') === '0') localStorage.removeItem('wly-site-self');
    self = localStorage.getItem('wly-site-self') === '1';
    visitor = localStorage.getItem('wly-site-visitor') || '';
    if (!visitor) {
      visitor = randomId();
      localStorage.setItem('wly-site-visitor', visitor);
    }
  } catch { visitor = ''; }
  self = query.get('self') === '1' || (query.get('self') !== '0' && self);
  const pageId = randomId();
  let visibleMs = 0, visibleSince = document.hidden ? null : performance.now(), lastLeave = -1;
  const send = (event, leaving = false) => {
    try {
      // 来源分布只需域名和路径，避免把来源网址中的凭据查询串写入日志。
      const ref = document.referrer ? new URL(document.referrer) : null;
      const params = new URLSearchParams({
        'x-v': visitor, 'x-p': location.pathname,
        'x-ref': ref ? ref.origin + ref.pathname : '',
        'x-self': self ? '1' : '0', 'x-monitor': query.get('monitor') === '1' ? '1' : '0',
        'x-r': randomId(), 'x-ms': String(Math.round(performance.now())),
        'x-id': pageId, 'x-event': event,
        'x-visible': String(Math.round(visibleMs + (visibleSince === null ? 0 : Math.max(0, performance.now() - visibleSince))) / 1000)
      });
      const navigation = performance.getEntriesByType?.('navigation')[0];
      for (const [key, value] of [['ttfb', navigation?.responseStart], ['dom', navigation?.domComplete], ['load', navigation?.loadEventEnd]]) {
        if (value > 0) params.set('x-' + key, String(Math.round(value - navigation.startTime)));
      }
      const url = endpoint + '?' + params;
      if (leaving) {
        fetch(url, {method: 'GET', mode: 'no-cors', keepalive: true, credentials: 'omit', cache: 'no-store'}).catch(() => {});
        return;
      }
      const beacon = new Image(1, 1);
      window.__siteVisitorBeacon = beacon;
      beacon.onload = beacon.onerror = () => {
        if (window.__siteVisitorBeacon === beacon) delete window.__siteVisitorBeacon;
      };
      beacon.src = url;
    } catch { /* 统计失败不影响网页。 */ }
  };
  const leave = () => {
    if (visibleSince !== null) { visibleMs += Math.max(0, performance.now() - visibleSince); visibleSince = null; }
    // hidden 和 pagehide 可能连续触发；同页累计值只发一次，恢复后继续增加。
    if (lastLeave !== visibleMs) { lastLeave = visibleMs; send('leave', true); }
  };
  const resume = () => { if (!document.hidden && visibleSince === null) visibleSince = performance.now(); };
  setTimeout(() => send('view'), 0);
  if (document.readyState === 'complete') setTimeout(() => send('perf'), 0);
  else addEventListener('load', () => setTimeout(() => send('perf'), 0), {once: true});
  document.addEventListener('visibilitychange', () => document.hidden ? leave() : resume());
  addEventListener('pagehide', leave);
  addEventListener('pageshow', event => { if (event.persisted) resume(); });
})();

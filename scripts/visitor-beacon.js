(() => {
  const endpoint = 'https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com/_v.gif';
  let visitor = '', self = false;
  const query = new URLSearchParams(location.search);
  try {
    if (query.get('self') === '1') localStorage.setItem('wly-site-self', '1');
    if (query.get('self') === '0') localStorage.removeItem('wly-site-self');
    self = localStorage.getItem('wly-site-self') === '1';
    visitor = localStorage.getItem('wly-site-visitor') || '';
    if (!visitor) {
      visitor = crypto.randomUUID();
      localStorage.setItem('wly-site-visitor', visitor);
    }
  } catch { visitor = ''; }
  self = query.get('self') === '1' || (query.get('self') !== '0' && self);
  const send = () => {
    try {
      // 来源分布只需域名和路径，避免把来源网址中的凭据查询串写入日志。
      const ref = document.referrer ? new URL(document.referrer) : null;
      const params = new URLSearchParams({
        'x-v': visitor, 'x-p': location.pathname,
        'x-ref': ref ? ref.origin + ref.pathname : '',
        'x-self': self ? '1' : '0', 'x-monitor': query.get('monitor') === '1' ? '1' : '0',
        'x-r': crypto.randomUUID(), 'x-ms': String(Math.round(performance.now()))
      });
      const beacon = new Image(1, 1);
      window.__siteVisitorBeacon = beacon;
      beacon.onload = beacon.onerror = () => {
        if (window.__siteVisitorBeacon === beacon) delete window.__siteVisitorBeacon;
      };
      beacon.src = endpoint + '?' + params;
    } catch { /* 统计失败不影响网页。 */ }
  };
  setTimeout(send, 0);
  addEventListener('pageshow', event => { if (event.persisted) setTimeout(send, 0); });
})();

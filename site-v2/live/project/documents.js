const namespace = '__documents';
const prefix = `/${namespace}/`;
const policy = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'">`;

function connection() {
  const port = Number(document.querySelector('meta[name="wly-lan-live-port"]')?.content);
  if (location.protocol === 'http:' && Number.isInteger(port) && port >= 1024 && port <= 65535 &&
      port !== Number(location.port)) return { origin: `http://${location.hostname}:${port}`, base: '', token: '' };
  if (location.protocol !== 'https:' || !['wly0829.cn', 'www.wly0829.cn'].includes(location.hostname)) return null;
  const token = localStorage.getItem('wly-cockpit-device');
  return /^[A-Za-z0-9_-]{43}$/.test(token || '') ? { origin: 'https://mcp.wly0829.cn', base: '/computer-access', token } : null;
}

function eligible(state) {
  return state?.data != null && state.meta.source === 'net' && [200, 304].includes(state.meta.status) &&
    state.viewer.kind === 'owner' && !state.offline && !state.warming && !window.LiveView?.isPublic();
}

export function mount(project, anchor, state) {
  let frame, size, route, list, current, waiting, timer, note;
  function clear() {
    clearTimeout(timer);
    waiting?.abort();
    size?.disconnect();
    frame?.remove();
    note?.remove();
    frame = size = route = list = current = waiting = note = null;
  }
  // 这块读不到（不是“这个项目没有”）时留一句为什么，一分钟后自动再读，不让整块无声消失
  function unavailable() {
    if (!note) { note = document.createElement('p'); note.className = 'row__sub'; note.style.margin = '16px 0'; anchor.before(note); }
    note.textContent = `${project === 'wly0829.cn' ? '来访人明细' : '项目文档'}这次没读到（连接后台出错），1 分钟后自动再读。`;
  }
  const active = () => eligible(state()) && !document.hidden && navigator.onLine;

  function address(raw, target) {
    if (typeof raw !== 'string' || !raw.startsWith(prefix)) throw new Error('Invalid document address');
    const url = new URL(target.base + raw, target.origin);
    if (url.origin !== target.origin || !url.pathname.startsWith(target.base + prefix) || url.hash) {
      throw new Error('Invalid document address');
    }
    url.searchParams.set('view', 'owner');
    return url;
  }

  function show(html, url) {
    if (!frame) {
      frame = document.createElement('iframe');
      frame.setAttribute('sandbox', 'allow-same-origin allow-forms');
      frame.referrerPolicy = 'no-referrer';
      frame.style.cssText = 'display:block;width:100%;border:0;margin:16px 0';
      frame.addEventListener('load', () => {
        const doc = frame?.contentDocument;
        if (!doc?.body || doc.URL !== 'about:srcdoc') return;
        if (doc.body.hasAttribute('data-document-list')) list = current;
        frame.title = doc.title || '项目文档';
        size?.disconnect();
        size = new ResizeObserver(() => { if (frame?.contentDocument === doc) frame.style.height = doc.body.offsetHeight + 'px'; });
        size.observe(doc.body);
        doc.addEventListener('submit', event => {
          event.preventDefault();
          const form = event.target, button = event.submitter;
          const start = form.querySelector('[data-document-through]');
          const end = start && form.elements.namedItem(start.dataset.documentThrough);
          if (end?.value && start.value > end.value) {
            start.setCustomValidity(start.dataset.documentMessage);
            start.reportValidity();
            start.setCustomValidity('');
            return;
          }
          const action = button?.getAttribute('formaction') || form.getAttribute('action');
          const method = (button?.getAttribute('formmethod') || form.method).toUpperCase();
          const fields = new FormData(form, button);
          if (form.hasAttribute('data-document-back') && list) return void read(list);
          if (method === 'POST') return void read(action, fields);
          const target = connection();
          if (!target) return clear();
          const url = address(action, target);
          for (const [name, value] of fields) url.searchParams.set(name, value);
          void read(url.pathname.slice(target.base.length) + url.search);
        });
        doc.addEventListener('change', ({ target }) => {
          if (target.form?.hasAttribute('data-document-autosubmit') && !target.hasAttribute('data-document-manual')) {
            target.form.requestSubmit();
          }
        });
      });
      anchor.before(frame);
    }
    current = url;
    frame.srcdoc = policy + html.replace(/^\s*<!doctype html>/i, '');
  }

  async function read(url, fields) {
    if (!active()) return clear();
    const target = connection();
    if (!target) return clear();
    waiting?.abort();
    const request = waiting = new AbortController();
    clearTimeout(timer);
    try {
      const fetchDoc = async (raw, body) => {
        const headers = target.token ? { 'X-Cockpit-Device': target.token } : {};
        if (body) headers['Content-Type'] = 'application/json';
        const result = await fetch(address(raw, target), {
          method: body ? 'POST' : 'GET', headers, body, cache: 'no-store', credentials: 'omit',
          redirect: 'error', referrerPolicy: 'no-referrer',
          signal: AbortSignal.any([request.signal, AbortSignal.timeout(12000)])
        });
        if (!result.ok && result.status !== 400) throw Object.assign(new Error('Document unavailable'), { status: result.status });
        return result.json();
      };
      if (!url) {
        const { url: found } = await fetchDoc(prefix + '?' + new URLSearchParams({ project }));
        if (request !== waiting || !active()) return;
        address(found, target);
        if (found !== route) current = list = null;
        route = found;
        if (frame?.contentDocument?.querySelector('details[open],input:focus,textarea:focus,select:focus')) return;
        url = current || route;
      }
      const { html } = await fetchDoc(url, fields && JSON.stringify(Object.fromEntries(fields)));
      if (request === waiting && active() && target.token === connection()?.token) {
        if (typeof html !== 'string') throw new Error('Invalid document');
        note?.remove(); note = null;
        show(html, url);
      }
    } catch (error) {
      if (request === waiting) {
        clear();
        if (error?.status !== 404 && error?.name !== 'AbortError' && active()) { unavailable(); timer = setTimeout(read, 60000); }
      }
    } finally {
      if (request === waiting) {
        waiting = null;
        if (active() && route) timer = setTimeout(read, 60000);
      }
    }
  }
  function update() {
    if (!active()) clear();
    else if (!frame && !waiting) void read();
  }
  document.addEventListener('visibilitychange', update);
  addEventListener('pagehide', clear);
  addEventListener('pageshow', update);
  addEventListener('offline', clear);
  addEventListener('online', update);
  addEventListener('storage', (event) => {
    if (event.key === 'wly-cockpit-device') clear();
  });
  update();
  return update;
}

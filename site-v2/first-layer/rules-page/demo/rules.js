// 规则文章页的目录：
// 1. 点目录，在本页滑到那一节，标题落在浮动页眉下面（位置由 CSS 的 scroll-margin-top 定）。
// 2. 往下读时标出读到的那一项：标题进到窗口上面四成就算读到；滑到底时标最后一个露出来的。
// 3. 点了哪项就先标哪项，直到读的人自己再滑。
(() => {
  const toc = document.querySelector('.rules-toc');
  if (!toc) return;

  const readItems = () => [...toc.querySelectorAll('a[href^="#"]')]
    .map(a => ({ a, el: document.getElementById(decodeURIComponent(a.hash.slice(1))) }))
    .filter(item => item.el);
  let items = readItems();

  let current = null;
  let pinned = null;
  let ticking = false;

  function mark(item) {
    if (item === current) return;
    if (current) {
      current.a.classList.remove('is-current');
      current.a.removeAttribute('aria-current');
    }
    current = item;
    if (item) {
      item.a.classList.add('is-current');
      item.a.setAttribute('aria-current', 'location');
    }
  }

  function pick() {
    const line = innerHeight * 0.4;
    const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    let found = null;
    let foundTop = -Infinity;
    for (const item of items) {
      const top = item.el.getBoundingClientRect().top;
      const limit = atBottom ? innerHeight - 40 : line;
      if (top <= limit && top > foundTop) {
        found = item;
        foundTop = top;
      }
    }
    return found;
  }

  function update() {
    ticking = false;
    mark(pinned || pick());
  }

  function schedule() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  toc.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const item = items.find(entry => entry.a === link);
    if (!item) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    pinned = item;
    mark(item);
    item.el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  // 读的人自己动了（滚轮、触摸、键盘、拖滚动条），就回到按位置标
  const release = () => {
    if (!pinned) return;
    pinned = null;
    schedule();
  };
  for (const type of ['wheel', 'touchstart', 'keydown', 'mousedown']) {
    addEventListener(type, event => {
      if (type === 'mousedown' && toc.contains(event.target)) return;
      release();
    }, { passive: true });
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('popstate', () => { pinned = null; schedule(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  update();

  const page = document.querySelector('[data-rule-release][data-rule-page]');
  const body = document.getElementById('rules-body'), count = page?.querySelector('[data-rule-count]');
  const title = page?.querySelector('[data-source-title]'), list = toc.querySelector('ol');
  if (!count || !title || !list || !body) return;
  const { ruleRelease: releaseId, rulePage } = page.dataset;
  const publicParts = [title.innerHTML, list.innerHTML, body.innerHTML, count.innerHTML];
  const official = /(^|\.)wly0829\.cn$/i.test(location.hostname);
  const path = 'rules/' + rulePage + '?release=' + encodeURIComponent(releaseId);
  const lanPort = Number(document.querySelector('meta[name="wly-lan-live-port"]')?.content);
  const lan = !official && location.protocol === 'http:' && location.port === '8829' && lanPort >= 1024 && lanPort <= 65535;
  const isPublic = () => {
    try {
      return window.LiveView?.isPublic() || sessionStorage.getItem('wly-live-view') === 'public' ||
        !official && /(?:^|;\s*)wly-preview-view=public(?:;|$)/.test(document.cookie);
    } catch { return true; }
  };
  const device = () => {
    try {
      const token = localStorage.getItem('wly-cockpit-device');
      return /^[A-Za-z0-9_-]{43}$/.test(token || '') ? token : '';
    } catch { return ''; }
  };
  let owner = false, timer, active;
  function render(parts, original) {
    if (owner === original) return;
    owner = original;
    [title, list, body, count].forEach((node, i) => { node.innerHTML = parts[i]; });
    items = readItems();
    pinned = null;
    current = null;
    update();
  }
  function clear() {
    clearTimeout(timer);
    active?.abort();
    active = null;
    render(publicParts, false);
  }
  async function readOwner() {
    if (document.hidden || isPublic() || !navigator.onLine || new URLSearchParams(location.search).has('fixture')) return;
    const token = device();
    if (!token && !lan) return;
    const request = active = new AbortController();
    const directLan = !token && lan;
    const base = official ? 'https://mcp.wly0829.cn/computer-access/live/v1/'
      : directLan ? 'http://' + location.hostname + ':' + lanPort + '/__live/' : '/__live/';
    try {
      const response = await fetch(base + path, {
        cache: 'no-store', credentials: official || directLan ? 'omit' : 'same-origin',
        headers: token ? { 'X-Cockpit-Device': token } : {},
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(8000)])
      });
      const value = response.ok ? await response.json() : null;
      if (active !== request) return;
      if (!value || value.release !== releaseId || isPublic() || token !== device()) {
        render(publicParts, false);
      } else {
        const heading = new DOMParser().parseFromString(value.source_title, 'text/html').querySelector('[data-source-title]');
        if (!heading) throw new Error('Missing rule title');
        render([heading.innerHTML, value.toc, value.body, '约法 ' + value.charter_words + ' 字<br>' + value.topic_words + ' 字'], true);
        window.LiveView?.owner({ kind: 'owner' });
      }
    } catch {
      if (active === request) render(publicParts, false);
    } finally {
      if (active === request) timer = setTimeout(readOwner, 15000);
    }
  }
  function refreshOwner() { clear(); readOwner(); }
  document.addEventListener('visibilitychange', refreshOwner);
  addEventListener('storage', event => { if (event.key === 'wly-cockpit-device' || event.key === 'wly-live-view') refreshOwner(); });
  addEventListener('offline', clear);
  addEventListener('online', refreshOwner);
  addEventListener('pagehide', clear);
  addEventListener('pageshow', event => { if (event.persisted) refreshOwner(); });
  readOwner();
})();

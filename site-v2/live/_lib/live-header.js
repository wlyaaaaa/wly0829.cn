(() => {
  'use strict';
  const PROBE_MS = 30000;
  const ready = (data, meta) => data != null && meta.status >= 200 && meta.status < 400;
  const unsupported = status => [400, 404, 405, 422, 501].includes(status);
  function watch(query, callbacks, { keepRevoked = false } = {}) {
    const { Live } = window;
    let header, full, timer, stopped = false;
    function schedule() {
      timer = setTimeout(() => { if (document.hidden) schedule(); else start(); }, PROBE_MS);
    }
    function start() {
      let switching = false;
      header = Live.watch('home', { ...query, view: 'header' }, {
        data(d, meta) { if (!stopped && (!full || ready(d, meta))) callbacks.data?.(d, meta); },
        phase(s) { if (!stopped && !full && !switching) callbacks.phase?.(s); },
        link(s) {
          if (stopped || switching) return;
          const { status } = s.meta;
          if (keepRevoked && s.meta.publicationRevoked) {
            if (full) { full.stop(); full = null; }
            callbacks.link?.(s);
            return;
          }
          const denied = s.publicPaused || status === 401 || status === 403;
          if (full && (denied || ready(s.data, s.meta))) {
            full.stop();
            full = null;
            if (denied) callbacks.data?.(null, s.meta);
          }
          if (!denied && !s.warming && (s.data == null || full) && (status >= 400 || ['none', 'gone'].includes(s.phase))) {
            switching = true;
            // watch 可以同步回放副本；等订阅返回后再切换。
            queueMicrotask(() => {
              if (stopped) return;
              header.stop();
              header = null;
              full ||= Live.watch('home', query, callbacks);
              if (stopped) full.stop();
              else if (!unsupported(status)) schedule();
            });
          } else if (!full) callbacks.link?.(s);
        }
      });
      if (stopped) header.stop();
    }
    start();
    return { stop() { stopped = true; clearTimeout(timer); header?.stop(); full?.stop(); } };
  }
  window.LiveHeader = { watch };
})();

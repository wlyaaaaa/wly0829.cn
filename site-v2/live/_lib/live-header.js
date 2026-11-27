(() => {
  'use strict';
  const unsupported = status => [400, 404, 405, 422, 501].includes(status);
  function watch(query, callbacks) {
    const { Live } = window;
    let full, switching = false, stopped = false;
    const header = Live.watch('home', { ...query, view: 'header' }, {
      data(d, meta) { if (!stopped && !switching) callbacks.data?.(d, meta); },
      phase(s) { if (!stopped && !switching) callbacks.phase?.(s); },
      link(s) {
        if (stopped || switching) return;
        if (!s.publicPaused && !s.warming && s.data == null && !s.meta.withdrawn && unsupported(s.meta.status)) {
          switching = true;
          // watch 可以同步回放副本；等订阅返回后再切换。
          queueMicrotask(() => {
            if (stopped) return;
            header.stop();
            full = Live.watch('home', query, callbacks);
            if (stopped) full.stop();
          });
        } else callbacks.link?.(s);
      }
    });
    return { stop() { stopped = true; header.stop(); full?.stop(); } };
  }
  window.LiveHeader = { watch };
})();

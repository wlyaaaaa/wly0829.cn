// 可见时才订阅；收起订阅后，保留页面已经画出来的曲线。
window.watchComputerChartViewport = function (groups, subscribe) {
  const subscriptions = new Map(groups.map(group => [group, { targets: new Set(), lastRead: -Infinity }]));
  const visible = new Set();
  const observed = new Set();
  let printing = false;
  const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!observed.has(target)) continue;
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
    }
    update();
  }) : null;

  function update() {
    for (const [group, state] of subscriptions) {
      clearTimeout(state.resume);
      state.resume = null;
      if (observer && !printing && ![...state.targets].some(target => visible.has(target))) {
        if (state.pending) {
          const remaining = state.pending - Date.now();
          if (remaining > 0) { state.resume = setTimeout(update, remaining); continue; }
          state.pending = null;
        }
        state.watch?.stop();
        state.watch = null;
      } else if (!state.watch && !state.starting) {
        const delay = 60000 - (Date.now() - state.lastRead);
        if (delay > 0 && !printing) state.resume = setTimeout(update, delay);
        else {
          state.lastRead = Date.now();
          state.starting = true;
          state.pending = state.lastRead + 15000;
          state.watch = subscribe(group, ready => {
            state.lastRead = Date.now();
            if (ready && state.pending) {
              state.pending = null;
              if (state.resume) update();
            }
          });
          state.starting = false;
        }
      }
    }
  }
  function beforePrint() { printing = true; update(); }
  function afterPrint() { printing = false; update(); }
  window.addEventListener('beforeprint', beforePrint);
  window.addEventListener('afterprint', afterPrint);
  return {
    targets(getTargets) {
      const next = new Set();
      for (const [group, state] of subscriptions) {
        state.targets = new Set(getTargets(group));
        for (const target of state.targets) next.add(target);
      }
      for (const target of observed) if (!next.has(target)) {
        observer?.unobserve(target);
        observed.delete(target);
        visible.delete(target);
      }
      let added = false;
      for (const target of next) if (!observed.has(target)) {
        added = true;
        observed.add(target);
        observer?.observe(target);
      }
      if (!observer || !added) update();
    },
    stop() {
      observer?.disconnect();
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
      for (const state of subscriptions.values()) {
        clearTimeout(state.resume);
        state.watch?.stop();
      }
      subscriptions.clear();
    },
  };
};

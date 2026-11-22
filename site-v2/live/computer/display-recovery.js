(() => {
  const U = window.LiveUI;
  let row = null, resource = null, watcher = null;
  function html() {
    if (!row) return '';
    const status = { 'healthy-noop': '本来正常，没有恢复动作', repaired: '已经恢复', 'not-eligible': '这次不需要恢复', 'restart-did-not-recover-three-screens': '重启后仍未恢复三屏' };
    const actions = { RestartGpu: '重启显卡', RestartGpuOnce: '重启一次显卡', None: '没有动作' };
    const field = v => U.fieldHtml(v ?? '没有记录');
    return `<details class="display-recovery"><summary class="live-disclosure">屏幕最近一次自动恢复${row.at ? ` · ${U.esc(U.date(row.at))} ${U.esc(U.time(row.at))}` : ''} · ${field(status[row.status] || row.status)}</summary><p class="row__sub">恢复前 ${field(row.before?.count)} 屏 · 恢复后 ${field(row.after?.count)} 屏</p><p class="row__sub">采取的动作：${field(actions[row.action] || row.action)}</p></details>`;
  }
  function watch(href, changed) {
    if (href === resource) return;
    watcher?.stop(); resource = href; row = null;
    if (!href) return;
    watcher = window.Live.watch(href.replace(/^.*\/live\/v1\//, '').replace(/^\/(?:__live\/)?/, ''), null, {
      data(d) { row = [...(d?.rows || [])].sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0] || null; changed(); },
    });
  }
  window.DisplayRecovery = { html, watch };
})();

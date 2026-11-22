(() => {
  function order(rows, enabled) {
    return enabled ? [...rows].sort((a, b) => (Number.isFinite(b.age_days) ? b.age_days : -Infinity) - (Number.isFinite(a.age_days) ? a.age_days : -Infinity)) : rows;
  }
  function bind(changed) {
    const button = document.getElementById('wait-order');
    button.addEventListener('click', () => {
      const enabled = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(enabled)); changed(enabled);
    });
  }
  window.LedgerWaitOrder = { order, bind };
})();

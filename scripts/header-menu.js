(() => {
  const menu = document.querySelector('dialog#menu');
  const triggers = [...document.querySelectorAll('#open-menu, a[href="#menu"]')];
  if (!menu || !triggers.length || menu.dataset.headerMenuReady) return;
  menu.dataset.headerMenuReady = 'true';
  if (!menu.hasAttribute('aria-label') && !menu.hasAttribute('aria-labelledby')) menu.setAttribute('aria-label', '全站菜单');
  let savedOverflow;
  const sync = () => {
    for (const trigger of triggers) {
      trigger.setAttribute('aria-controls', 'menu');
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', String(menu.open));
    }
    if (menu.open && !savedOverflow) {
      savedOverflow = [document.documentElement, document.body].map(element => [element,
        element.style.getPropertyValue('overflow'), element.style.getPropertyPriority('overflow')]);
      for (const [element] of savedOverflow) element.style.setProperty('overflow', 'hidden');
    } else if (!menu.open && savedOverflow) {
      for (const [element, value, priority] of savedOverflow) {
        if (value) element.style.setProperty('overflow', value, priority);
        else element.style.removeProperty('overflow');
      }
      savedOverflow = null;
    }
  };
  const close = () => { if (menu.open) menu.close(); sync(); };
  document.addEventListener('click', event => {
    const control = event.target.closest?.('#open-menu, .close-menu, a[href="#menu"]');
    if (control && (triggers.includes(control) || menu.contains(control))) {
      event.preventDefault(); event.stopImmediatePropagation();
      if (control.matches('.close-menu')) close();
      else { if (!menu.open) menu.showModal(); sync(); }
      return;
    }
    if (!menu.open) return;
    if (event.target.closest?.('a[href]') && menu.contains(event.target)) close();
    else if (event.target === menu) {
      const rect = menu.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    }
  }, true);
  menu.addEventListener('close', sync);
  menu.addEventListener('cancel', event => { event.preventDefault(); close(); });
  addEventListener('pagehide', close);
  addEventListener('pageshow', close);
  addEventListener('resize', () => { if (!triggers.some(trigger => trigger.getClientRects().length && getComputedStyle(trigger).visibility !== 'hidden')) close(); });
  sync();
})();

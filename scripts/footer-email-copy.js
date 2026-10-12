(() => {
  let notice, timer;
  document.addEventListener('click', async event => {
    const link = event.target.closest?.('footer a[href="mailto:hello@wly0829.cn"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !navigator.clipboard?.writeText) return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText('hello@wly0829.cn');
      if (!notice) {
        notice = document.createElement('div');
        notice.dataset.footerEmailCopyStatus = '';
        notice.setAttribute('role', 'status');
        notice.style.cssText = 'position:fixed;right:20px;bottom:20px;max-width:calc(100vw - 40px);padding:10px 16px;border:1px solid #d4ddd7;border-radius:8px;background:white;color:#32634a;box-shadow:0 2px 10px #0001;z-index:10000';
        document.body.append(notice);
      }
      notice.textContent = '邮箱地址已复制'; notice.hidden = false;
      clearTimeout(timer); timer = setTimeout(() => { notice.hidden = true; }, 2200);
    } catch { location.href = link.href; }
  });
})();

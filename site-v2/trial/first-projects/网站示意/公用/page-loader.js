(() => {
  const cover = document.querySelector('[data-initial-cover] > img');
  if (cover) {
    const root = document.documentElement;
    const pictures = document.getElementById('pictures');
    pictures.style.setProperty('--picture-scale', Math.min(1, document.body.clientWidth / pictures.offsetWidth));
    if (root.classList.contains('mo-cover-refresh')) {
      cover.addEventListener('animationend', () => {
        root.classList.remove('mo-cover-refresh');
        root.style.removeProperty('--mo-refresh-cover');
        cover.setAttribute('data-cover-carried', '');
      }, { once: true });
    }
    const failed = () => cover.setAttribute('data-cover-error', '');
    const show = () => cover.decode().then(() => {
      cover.removeAttribute('data-cover-pending');
      cover.removeAttribute('data-cover-error');
    }, failed);
    cover.addEventListener('load', show);
    cover.addEventListener('error', failed);
    if (cover.complete) cover.naturalWidth ? show() : failed();
  }

  const pending = [...document.querySelectorAll('script[type="application/x-project-script"]')];
  const status = document.createElement('p');
  const retry = document.createElement('button');
  status.className = 'project-load-status';
  status.setAttribute('role', 'status');
  retry.type = 'button';
  retry.textContent = '重试正文';
  status.append('正文暂时没有加载出来。', retry);

  async function load() {
    retry.disabled = true;
    while (pending.length) {
      const script = document.createElement('script');
      script.src = pending[0].dataset.src;
      const loaded = await new Promise(resolve => {
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.head.append(script);
      });
      if (!loaded) {
        script.remove();
        document.querySelector('#pictures').prepend(status);
        retry.disabled = false;
        return;
      }
      pending.shift();
    }
    status.remove();
  }

  retry.addEventListener('click', load);
  load();
})();

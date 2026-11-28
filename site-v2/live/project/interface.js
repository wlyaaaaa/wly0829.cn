function showImage(image, url, failed = null) {
  image.onerror = () => {
    image.onerror = failed;
    image.src = url + '?retry=1';
  };
  image.src = url;
}

export async function mountInterface(id, host, words = html => html, { embedded = false, note = '', pageSize } = {}) {
  const response = await fetch('/live/project/interface-data.json');
  if (!response.ok) throw new Error('界面图清单暂时读不到');
  const shots = (await response.json())[id];
  if (!shots?.length) return;

  const style = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: '/live/project/interface.css' });
  await new Promise((resolve, reject) => {
    style.onload = resolve;
    style.onerror = () => { style.remove(); reject(new Error('界面样式暂时读不到')); };
    document.head.append(style);
  });

  const { esc } = window.LiveUI;
  const section = document.createElement('section');
  section.className = embedded ? 'pj-interface pj-interface--embedded' : 'pj-interface pj-card glass';
  if (!embedded) section.setAttribute('aria-labelledby', 'pj-interface-title');
  section.innerHTML = `
    ${embedded ? '' : '<h2 id="pj-interface-title">界面</h2><p>点图看大图</p>'}
    <div class="pj-interface-grid"></div>
    ${pageSize && shots.length > pageSize ? `<nav class="pj-interface-pages" aria-label="截图分页">
      <button type="button" class="more" data-page-step="-1">‹ 上一页</button>
      <span aria-live="polite"></span>
      <button type="button" class="more" data-page-step="1">下一页 ›</button>
    </nav>` : ''}
    ${embedded && note ? `<p>${esc(note)}</p>` : ''}
    <dialog class="pj-interface-view" aria-label="界面大图">
      <p class="pj-interface-status" role="status" hidden></p>
      <figure><img decoding="async" alt="" hidden></figure>
      <p class="pj-interface-caption"></p>
      <p class="pj-interface-scroll" hidden>滚动看整张图 ↓</p>
      <form class="pj-interface-controls" method="dialog">
        <button type="button" class="btn btn--sm">上一张</button>
        <button type="button" class="btn btn--sm">下一张</button>
        <button type="submit" class="btn btn--sm" autofocus>关闭</button>
      </form>
    </dialog>`;

  const dialog = section.querySelector('dialog');
  const [previous, next] = dialog.querySelectorAll('button');
  const frame = dialog.querySelector('figure');
  const full = frame.querySelector('img'), caption = dialog.querySelector('.pj-interface-caption');
  const status = dialog.querySelector('.pj-interface-status'), hint = dialog.querySelector('.pj-interface-scroll');
  let selected = 0;
  function showReady() {
    const scrollable = shots[selected][3] || full.naturalHeight >= 3 * full.naturalWidth;
    dialog.style.setProperty('--pj-interface-image-width', full.naturalWidth + 'px');
    frame.classList.toggle('is-scrollable', scrollable);
    if (scrollable) frame.tabIndex = 0;
    else frame.removeAttribute('tabindex');
    status.hidden = true;
    full.hidden = false;
    frame.scrollTop = 0;
    hint.hidden = !scrollable || frame.scrollHeight <= frame.clientHeight;
  }
  full.addEventListener('load', showReady);
  function imageFailed() { status.textContent = '图片暂时打不开'; }
  function show(index) {
    const [, original, label] = shots[index];
    selected = index;
    full.hidden = hint.hidden = true;
    frame.classList.remove('is-scrollable');
    frame.removeAttribute('tabindex');
    status.hidden = false;
    status.textContent = '图片加载中';
    full.removeAttribute('src');
    showImage(full, original, imageFailed);
    full.alt = label;
    caption.textContent = label;
    previous.disabled = index === 0;
    next.disabled = index === shots.length - 1;
  }
  previous.onclick = () => show(selected - 1);
  next.onclick = () => show(selected + 1);
  dialog.onclick = e => { if (e.target === dialog) dialog.close(); };

  const observer = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) if (isIntersecting) {
      showImage(target, target.dataset.thumb);
      observer.unobserve(target);
    }
  }, { rootMargin: '0px 0px 160px' });
  const grid = section.querySelector('.pj-interface-grid');
  const pager = section.querySelector('.pj-interface-pages');
  const size = pager ? pageSize : shots.length;
  const pages = Math.ceil(shots.length / size);
  let galleryPage = 0;
  function draw() {
    const start = galleryPage * size;
    observer.disconnect();
    grid.innerHTML = shots.slice(start, start + size).map(([, , label, , short = label]) => `
      <figure>
        <button type="button" class="pj-interface-thumb" aria-haspopup="dialog" aria-label="看大图：${esc(label)}">
          <img decoding="async" alt=""><span class="pj-interface-zoom" aria-hidden="true"></span>
        </button>
        <figcaption>${words(esc(embedded ? short : label))}</figcaption>
      </figure>`).join('');
    grid.querySelectorAll('.pj-interface-thumb').forEach((button, offset) => {
      const index = start + offset, thumb = button.querySelector('img');
      // 只有一张图时放大摆，直接用原图。
      thumb.dataset.thumb = shots[index][shots.length === 1 ? 1 : 0];
      observer.observe(thumb);
      button.onclick = () => { show(index); dialog.showModal(); };
    });
    if (pager) {
      pager.querySelector('span').textContent = `${galleryPage + 1} / ${pages} · 共 ${shots.length} 张`;
      pager.firstElementChild.disabled = galleryPage === 0;
      pager.lastElementChild.disabled = galleryPage === pages - 1;
    }
  }
  if (pager) pager.onclick = e => {
    const button = e.target.closest('[data-page-step]');
    if (!button) return;
    galleryPage += Number(button.dataset.pageStep);
    draw();
  };
  draw();
  if (embedded) host.append(section);
  else host.after(section);
}

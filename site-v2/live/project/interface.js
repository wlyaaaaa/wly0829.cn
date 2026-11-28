function showImage(image, url) {
  image.onerror = () => {
    image.onerror = null;
    image.src = url + '?retry=1';
  };
  image.src = url;
}

export async function mountInterface(id, host, words = html => html, { embedded = false, note = '' } = {}) {
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
    <div class="pj-interface-grid">${shots.map(([, , label, , caption = label]) => `
      <figure>
        <button type="button" class="pj-interface-thumb" aria-haspopup="dialog" aria-label="看大图：${esc(label)}">
          <img decoding="async" alt=""><span class="pj-interface-zoom" aria-hidden="true"></span>
        </button>
        <figcaption>${words(esc(embedded ? caption : label))}</figcaption>
      </figure>`).join('')}
    </div>
    ${embedded && note ? `<p>${esc(note)}</p>` : ''}
    <dialog class="pj-interface-view" aria-label="界面大图">
      <figure><img decoding="async" alt=""><figcaption></figcaption></figure>
      <form class="pj-interface-controls" method="dialog">
        <button type="button" class="btn btn--sm">上一张</button>
        <button type="button" class="btn btn--sm">下一张</button>
        <button type="submit" class="btn btn--sm" autofocus>关闭</button>
      </form>
    </dialog>`;

  const dialog = section.querySelector('dialog');
  const [previous, next] = dialog.querySelectorAll('button');
  const frame = dialog.querySelector('figure');
  const full = frame.querySelector('img'), caption = frame.querySelector('figcaption');
  let selected = 0;
  full.onload = () => {
    const scrollable = shots[selected][3] || full.naturalHeight >= 3 * full.naturalWidth;
    dialog.style.setProperty('--pj-interface-image-width', full.naturalWidth + 'px');
    frame.classList.toggle('is-scrollable', scrollable);
    if (scrollable) frame.tabIndex = 0;
    else frame.removeAttribute('tabindex');
    frame.scrollTop = 0;
  };
  function show(index) {
    const [, original, label] = shots[index];
    selected = index;
    frame.scrollTop = 0;
    full.removeAttribute('src');
    showImage(full, original);
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
  section.querySelectorAll('.pj-interface-thumb').forEach((button, index) => {
    const thumb = button.querySelector('img');
    // 只有一张图时图放大到卡内六成，缩略图（560 像素宽）不够清楚，直接用原图
    thumb.dataset.thumb = shots[index][shots.length === 1 ? 1 : 0];
    observer.observe(thumb);
    button.onclick = () => { show(index); dialog.showModal(); };
  });
  if (embedded) host.append(section);
  else host.after(section);
}

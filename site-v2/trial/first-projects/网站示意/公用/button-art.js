(() => {
  const config = window.PROJECT_CONFIG;
  const hasLazyLoader = !!document.getElementById('topbar');
  function decorate(control, [file, , w, h]) {
    const image = new Image();
    image.alt = '';
    image.loading = 'lazy';
    if (w && h) { image.width = w; image.height = h; image.style.aspectRatio = `${w}/${h}`; }
    const show = () => image.decode().then(() => {
      if (!w && control.matches('.pill--art')) control.style.aspectRatio = `${image.naturalWidth}/${image.naturalHeight}`;
      control.classList.add('has-button-art');
    }, () => {});
    image.addEventListener('load', show);
    if (hasLazyLoader) image.dataset.src = buttonAsset(file);
    else image.src = buttonAsset(file);
    control.prepend(image);
  }
  for (const control of document.querySelectorAll('#pictures .pill--art')) {
    decorate(control, config.buttonArt[control.textContent.trim()]);
  }
  for (const control of document.querySelectorAll('#pictures .more.art')) decorate(control, config.detailArt);
})();

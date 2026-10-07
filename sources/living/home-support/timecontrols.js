/* 首页原有时间选择使用正式场景接口，不进入预览模式。 */
{
  const home = document.querySelector('#home-01'), hero = home?.__heroLive, labels = JSON.parse(document.querySelector('#page-data').textContent).shared.nav_labels;
  if (hero?.setDaytime && !document.querySelector('[data-home-daytimes]')) {
    const controls = document.createElement('nav'); controls.dataset.homeDaytimes = ''; controls.setAttribute('aria-label', '首页画面时间');
    for (const [mode, label] of [['morning','清晨'],['day','白天'],['evening','傍晚'],['night','晚上'],['cycle','一分钟循环一天']]) {
      const button = document.createElement('button'), image = new Image(); button.type = 'button'; button.setAttribute('aria-label', label); button.dataset.daytime = mode; button.setAttribute('aria-pressed', 'false');
      image.src = labels[label].src; image.alt = ''; image.width = labels[label].size[0]; image.height = labels[label].size[1]; button.append(image);
      button.addEventListener('click', () => { hero.setDaytime(mode); for (const item of controls.children) item.setAttribute('aria-pressed', String(item === button)); }); controls.append(button);
    }
    home.after(controls);
  }
}

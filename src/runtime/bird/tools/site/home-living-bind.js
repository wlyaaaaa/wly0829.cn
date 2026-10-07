/* 首页活画只订阅 SiteStatus 的既有读取；不创建 reader、轮询或存储。 */
(() => {
  'use strict';
  const page = JSON.parse(document.querySelector('#page-data').textContent);
  if (page.home_living !== true || page.page !== 'home') return;
  const container = document.querySelector('#home-01');
  const image = container?.querySelector('picture img');
  if (!container || !image || !window.HeroLive) return;
  image.__heroNativePlates = {landscape: page.screens[0].layouts.h.viewer.avif, portrait: page.screens[0].layouts.v.viewer.avif};
  const initial = {state: 'off', title: '暂时读不到电脑', detail: '还没读到电脑状态'};
  const hero = window.HeroLive.mount(container, {plateImage: image, status: initial, intro: false});
  const controls = document.createElement('div'); controls.className = 'home-time-controls'; controls.setAttribute('role', 'group'); controls.setAttribute('aria-label', '选择这次画面的时间');
  Object.assign(controls.style, {position:'absolute',right:'12px',bottom:'15%',display:'flex',flexWrap:'wrap',justifyContent:'flex-end',gap:'6px',maxWidth:'calc(100% - 24px)',zIndex:'4'});
  for (const [mode, label] of [['morning','清晨'],['day','白天'],['evening','傍晚'],['night','晚上'],['cycle','一分钟循环一天']]) {
    const button = document.createElement('button'); button.type = 'button'; button.disabled = true; button.dataset.daytime = mode; button.setAttribute('aria-label', label); button.setAttribute('aria-pressed', 'false');
    const picture = document.createElement('img'); picture.alt = label; picture.height = 24; picture.width = label.length * 17 + 4;
    picture.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${picture.width}" height="24"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Noto Sans SC,sans-serif" font-size="16" font-weight="600" fill="#0c6932">${label}</text></svg>`);
    Object.assign(button.style, {display:'flex',alignItems:'center',justifyContent:'center',minWidth:'60px',minHeight:'44px',padding:'6px 10px',border:'1px solid #badfc9',borderRadius:'12px',background:'#fff',cursor:'pointer'});
    button.append(picture); button.addEventListener('click', () => { hero.setDaytime(mode); for (const item of controls.children) { const active = item === button; item.setAttribute('aria-pressed', String(active)); item.style.background = active ? '#e8f5ed' : '#fff'; } }); controls.append(button);
  }
  const placeControls = () => Object.assign(controls.style, matchMedia('(orientation:portrait)').matches ? {top:'12px',bottom:'auto'} : {top:'auto',bottom:'15%'});
  placeControls(); document.addEventListener('site-layout', placeControls);
  container.append(controls); hero.ready.then(() => { for (const button of controls.children) button.disabled = typeof hero.setDaytime !== 'function'; });

  // 原图已经完整显示，初次接管和转方向都保持文字、按钮完整。
  // 新方向仍等待实际画层就绪再显示，不开启改变正式文案的 preview 模式。
  let visibleLayer = null, pendingLayer = null, orientationSkips = 0, waitFrame = 0, showFrame = 0, showingLayer = null;
  const revealLayer = layer => {
    if (showFrame && showingLayer === layer) return;
    if (showFrame) cancelAnimationFrame(showFrame);
    showingLayer = layer;
    showFrame = requestAnimationFrame(() => {
      showFrame = 0; showingLayer = null;
      if (layer.isConnected && visibleLayer === layer) layer.style.visibility = '';
    });
  };
  const continueScene = () => {
    const layer = container.querySelector('.hero-live-layer');
    if (!layer) return;
    const pill = layer.querySelector('[data-hl="spill"]');
    if (pill) Object.assign(pill.style, {maxWidth:'620px',whiteSpace:'normal',overflowWrap:'anywhere',lineHeight:'1.2',boxSizing:'border-box'});
    if (layer === visibleLayer) {
      if (layer.style.visibility === 'hidden' && hero.diagnostics().phase !== 'loading') revealLayer(layer);
      return;
    }
    if (!visibleLayer) { visibleLayer = layer; return; }
    if (pendingLayer !== layer) { pendingLayer = layer; layer.style.visibility = 'hidden'; }
    if (!layer.classList.contains('is-ready') || hero.diagnostics().phase === 'loading') {
      if (!waitFrame) waitFrame = requestAnimationFrame(() => { waitFrame = 0; continueScene(); });
      return;
    }
    visibleLayer = layer; pendingLayer = null; orientationSkips++;
    // 引擎接管后的画面已完整；下一帧显示新方向的图层。
    revealLayer(layer);
  };
  const scenes = new MutationObserver(continueScene);
  scenes.observe(container, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
  continueScene();
  addEventListener('pagehide', () => {
    scenes.disconnect();
    if (waitFrame) cancelAnimationFrame(waitFrame);
    if (showFrame) cancelAnimationFrame(showFrame);
    waitFrame = showFrame = 0; showingLayer = null;
  });
  addEventListener('pageshow', () => {
    scenes.observe(container, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
    continueScene();
  });
  const update = snapshot => {
    if (!snapshot?.overall) return;
    const full = snapshot.overall;
    window.HeroLive.setStatus(full);
    for (const button of container.querySelectorAll('[data-link-id="home-01-link-2-0"],[data-hot-id="home-01-link-2-0"]')) {
      const text = (full.pendingCount > 0 ? '有 ' + full.pendingCount + ' 件要我做' : '现在正不正常') + ' → 驾驶舱';
      button.textContent = text; button.setAttribute('aria-label', text);
      const portrait = matchMedia('(orientation:portrait)').matches, box = portrait ? [.040625,.9389312977,.91953125,.0538841491] : [.2631944444,.8593460827,.2114583333,.0808143122];
      Object.assign(button.style, {left:box[0]*100+'%',top:portrait?'calc('+((box[1]+box[3])*100)+'% - max(44px, '+box[3]*100+'%))':box[1]*100+'%',width:box[2]*100+'%',height:box[3]*100+'%',display:'flex',alignItems:'center',justifyContent:'center',background:'#fff',color:'#0c6932',border:'2px solid #15964f',borderRadius:'999px',whiteSpace:'nowrap',fontSize:'clamp(14px,1.4vw,22px)',minHeight:'44px',padding:'4px 8px',boxSizing:'border-box',textDecoration:'none'});
    }
  };
  document.addEventListener('site-status', event => update(event.detail));
  document.addEventListener('site-layout', () => update(window.SiteStatus?.snapshot?.()));
  update(window.SiteStatus?.snapshot?.());
  window.HomeLiving = Object.freeze({ready: hero.ready.then(() => true), diagnostics: () => ({...hero.diagnostics(), orientationSkips})});
})();

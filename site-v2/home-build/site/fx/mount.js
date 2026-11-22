// 所有模块使用原画坐标；登记顺序也是从下到上的叠放顺序。
(() => {
'use strict';
const home = window.HOME, layer = home.fx;
const garden = layer.parentElement.querySelector('.garden');
// 仅调参页的嵌入预览可以挑模块。直接打开首页始终挂全部动效。
const filter = parent === window ? null : new URLSearchParams(location.search).get('fx')?.split(',');
const registry = [
  { name: 'waterfall', title: '瀑布', api: 'WlyWaterfall', z: 0,
    sliders: [['speed','速度',1,.05,'倍'],['drops','水滴',1,.05,'倍'],['splash','水花',1,.05,'倍']] },
  { name: 'lights', title: '灯效', api: 'WlyLights', z: 1, opening: 'boot',
    sliders: [['screen','小屏',.2,.05,'幅度'],['gpu','显卡灯',.5,.1,'快慢'],['psu','电源灯',.2,.05,'强弱'],['ram','内存灯',.5,.1,'快慢'],['water','波光',.2,.05,'强弱'],['panel','副屏',.2,.05,'幅度']] },
  { name: 'fans', title: '风扇', api: 'WlyFans', z: 2, opening: 'spinUp',
    sliders: [['speed','转速',.3,.05,'圈/秒'],['glow','彩光',0,.5,'圈/分']] },
  { name: 'ambient', title: '云雾', api: 'WlyAmbient', z: 3, opening: 'boot', bootElement: 'root',
    sliders: [['mist','云雾',0,.05,''],['dust','浮尘',0,.05,'',4],['speed','快慢',.3,.05,''],['clouds','云动',0,.05,''],['sun','阳光',0,.05,'']], toggles: [['petals','花瓣']] }
];
registry.forEach(d => { d.values = { ...HOME_CONFIG.fx[d.name] }; d.on = true; });
layer.style.isolation = 'isolate'; // 子层 z-index 不越过后面的标题层。
let active = [], localImage, timer, generation = 0, resolution = 0;
let started = false, bootAt = 0, paused = false;
const drawCosts = new Map(), drawDue = new Map();
// 只在绘制本身占满一帧时错开刷新；不数帧率，不改采样密度或任何效果。
function drawFrame(def, now, paint) {
  const cost = [...drawCosts.values()].reduce((sum, value) => sum + value, 0);
  const interval = started && now - bootAt >= 5000 && cost > 24 ? cost * 2 : 0;
  if (interval && now < (drawDue.get(def.name) || 0)) return;
  const at = performance.now();
  paint();
  const finished = performance.now(), elapsed = finished - at, previous = drawCosts.get(def.name);
  drawDue.set(def.name, finished + interval);
  drawCosts.set(def.name, previous == null ? elapsed : previous + (elapsed - previous) * 0.1);
}
// 动效一直开着（见网站 AGENTS.md）：只看镜头起没起来，不看“减少动态”
const enabled = () => !!home.camera();
const picked = () => registry.filter(d => filter?.includes(d.name));
const selected = () => (picked().length ? picked() : registry).filter(d => window[d.api]);
const imagesReady = async () => {
  await home.firstScreenReady;
  await garden.decode();
  await home.screen?.ready;   // 副屏那张亮屏小图：灯效要拿它当贴图
};
function imageSource() {
  if (location.protocol !== 'file:') return Promise.resolve(garden);
  if (!localImage) localImage = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'images/screen1.b64.js';
    script.onload = async () => {
      const image = new Image(); image.src = window.WLY_SCREEN1;
      try { await image.decode(); resolve(image); } catch (error) { reject(error); }
    };
    script.onerror = reject;
    document.head.append(script);
  });
  return localImage;
}
function visibility() {
  for (const item of active) {
    item.box.style.opacity = item.def.on ? '1' : '0';
    if (item.skyBox) item.skyBox.style.opacity = item.box.style.opacity;
    item.handle.setVisible?.(item.def.on);
    if (document.hidden || !started || paused || !item.def.on || !item.handle.ready) item.handle.pause();
    else item.handle.resume();
  }
}
function dispose(items) {
  for (const item of items) { item.handle.destroy(); item.box.remove(); item.skyBox?.remove(); }
}
function protect(box) {
  // 在模块自己的恢复绘制完成后才露出画布；丢失期间原画自然透出。
  box.addEventListener('webglcontextlost', e => {
    e.target.setAttribute('data-fx-lost', '');
    console.warn('[home fx] context lost; original image exposed', box.dataset.fx);
    setTimeout(sendState, 0);
  }, true);
  box.addEventListener('webglcontextrestored', e => requestAnimationFrame(() => {
    if (!e.target.getContext('webgl2')?.isContextLost()) e.target.removeAttribute('data-fx-lost');
  }), true);
}
async function refresh() {
  const ticket = ++generation;
  // 镜头还没起来：副屏先用那张亮屏小图。
  if (!enabled()) { dispose(active); active = []; resolution = 0; home.screen?.still(); return; }
  try {
    await imagesReady();
    const image = await imageSource();
    if (ticket !== generation || !enabled()) return;
    // 把固定电脑视口的缩小算进去，额外留 25% 放大余量；桌面和 Ctrl 缩放仍是原清晰度。
    const viewport = window.visualViewport;
    const displayScale = viewport ? Math.min(1, viewport.width * viewport.scale / innerWidth * 1.25) : 1;
    const next = layer.clientWidth / garden.naturalWidth * devicePixelRatio * displayScale;
    if (!next || (active.length && Math.abs(next - resolution) < 0.01)) return;
    // 先释放旧上下文，重挂时最多仍是 12 张，不短暂翻倍到 24 张。
    const previous = new Map(active.map(i => [i.def.name, i.handle.time]));
    dispose(active); active = [];
    // 给主动让出的上下文一个事件循环，再建下一组，8 张上限下也不短暂挤掉别的效果。
    await new Promise(requestAnimationFrame);
    if (ticket !== generation || !enabled()) return;
    const items = [];
    // 建立顺序与 z-index 无关。现在正好8张；意外再超限时，先舍弃灯效这一张。
    for (const def of selected().sort((a, b) => (a.name === 'lights' ? -1 : b.name === 'lights' ? 1 : 0))) {
      const box = document.createElement('div');
      box.dataset.fx = def.name;
      box.style.cssText = `position:absolute;inset:0;z-index:${def.z};opacity:0;pointer-events:none`;
      layer.append(box); protect(box);
      const item = { def, box, handle: null };
      if (def.name === 'ambient') {
        item.skyBox = box.cloneNode(); item.skyBox.dataset.fx = 'ambient-sky';
        item.skyBox.style.zIndex = '-1'; layer.append(item.skyBox); protect(item.skyBox);
      }
      items.push(item);
      const ready = new Promise((resolve, reject) => {
        item.handle = window[def.api].mount(box, {
          ...def.values, image, resolution: next, skyContainer: item.skyBox, panel: home.screen?.fx,
          drawFrame: (now, paint) => drawFrame(def, now, paint),
          onReady(handle) { handle.pause(); resolve(handle); },
          onError(error) { console.error(`[home ${def.name}]`, error); reject(error); }
        });
        item.handle.pause();
      });
      try { await ready; }
      catch (error) { dispose([item]); items.pop(); continue; }
      if (ticket !== generation || !enabled()) { dispose(items); return; }
      if (started) {
        const age = previous.get(def.name) ?? (performance.now() - bootAt) / 1000;
        item.handle.setTime?.(age);
        item.handle.setBootTime?.((performance.now() - bootAt) / 1000);
        const bootElement = item.handle[def.bootElement]?.firstElementChild;
        bootElement?.getAnimations().forEach(a => {
          const elapsed = performance.now() - bootAt;
          if (elapsed >= a.effect.getTiming().duration) a.finish();
          else { a.pause(); a.currentTime = elapsed; }
        });
        item.handle.pause();
      }
      item.handle.pause();
    }
    active = items; resolution = next;
    // 灯效没挂上，或副屏这一处没画成（小图进不了贴图）：副屏退回那张亮屏小图，字照常显示。
    if (!active.find(i => i.def.name === 'lights')?.handle.panelReady) home.screen?.still();
    if (!started && active.length && !document.hidden) open();
    else { active.forEach(i => { i.box.style.opacity = '1'; }); visibility(); }
    sendState();
  } catch (error) { console.error('[home fx image]', error); }
}
function open() {
  started = true; bootAt = performance.now();
  for (const item of active) {
    if (item.def.opening === 'spinUp') item.handle.spinUp({ ...item.def.values.spinUp, to: item.def.values.speed });
    else if (item.def.opening) item.handle[item.def.opening](item.def.values.bootSeconds);
    item.handle.pause();
    item.box.style.opacity = '1';
  }
  performance.mark('home-fx-start');
  home.fxStartedAt = bootAt;
  visibility();
  console.info('[home fx] opening', registry.filter(d => active.some(i => i.def === d)).map(d => d.name).join(','));
}
home.fxModules = {
  status: () => ({ quality: 1, disabled: [],
    lostLights: active.find(i => i.def.name === 'lights')?.handle.patches.filter(p => p.canvas.hasAttribute('data-fx-lost')).map(p => ({screen:'水冷头小屏',gpu:'显卡灯',ram:'内存灯',psu:'电源灯',water:'水面波光',panel:'副屏'}[p.key])) || [] }),
  list: () => registry.map(d => ({ ...d, available: !!window[d.api], params: { ...d.values }, defaults: HOME_CONFIG.fx[d.name], handle: active.find(i => i.def === d)?.handle })),
  set(name, params) { const d = registry.find(d => d.name === name); Object.assign(d.values, params); active.find(i => i.def === d)?.handle.set(params); visibility(); },
  toggle(name, on) { registry.find(d => d.name === name).on = on; visibility(); },
  replay() { active.forEach(i => i.handle.setTime?.(0)); open(); },
  pause(value) { paused = value; visibility(); },
  original(value) { layer.style.opacity = value ? '0' : '1'; },
  reset() { registry.forEach(d => { d.values = { ...HOME_CONFIG.fx[d.name] }; d.on = true; active.find(i => i.def === d)?.handle.set(d.values); }); paused = false; visibility(); }
};
// 跨文档接口也适用于 file:// 的不透明来源；内部页直接嵌入首页，无需复制首页结构。
const sendState = () => parent.postMessage({ type: 'home-fx-state', modules: home.fxModules.list().map(({ handle, ...d }) => d), status: home.fxModules.status() }, '*');
window.addEventListener('message', e => {
  if (parent === window || e.source !== parent || e.data?.type !== 'home-fx-command') return;
  const { action, args = [] } = e.data;
  if (['set','toggle','replay','pause','original','reset'].includes(action)) home.fxModules[action](...args);
  sendState();
});
window.addEventListener('keydown', e => { if (parent !== window && e.key.toLowerCase() === 'h') parent.postMessage({ type: 'home-fx-key', key: 'h' }, '*'); });
const schedule = () => { clearTimeout(timer); timer = setTimeout(refresh, 120); };
new ResizeObserver(schedule).observe(layer);
window.addEventListener('resize', schedule);
document.addEventListener('visibilitychange', () => {
  if (!started && active.length && !document.hidden) open();
  visibility();
});
refresh();
})();


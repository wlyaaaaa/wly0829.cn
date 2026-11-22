const data = window.PAGE_DATA[document.body.dataset.page];
const config = window.PROJECT_CONFIG;
const coverTitle = config.pages[document.body.dataset.page].title || config.title;
const buttonAsset = file => file.includes('/') ? file : 'assets/buttons/' + file;
const pictures = document.querySelector('#pictures'), dialog = document.querySelector('#details');
const drawer = document.querySelector('.drawer'), detailBody = document.querySelector('.detail-body');
const shot = document.querySelector('.detail-shot'), closeButton = document.querySelector('#close');
for (const [key,value] of Object.entries(config.theme)) document.documentElement.style.setProperty(`--${key}`,value);
document.documentElement.style.setProperty('--project-background',`url("${new URL(config.background,document.baseURI).href}")`);
const escapeHtml = s => s.replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function reference(name) {
  const target = data.find(item => item.title === name);
  const href = target ? `#${target.id}` : config.references[name];
  return href ? `<a class="reference" href="${href}">〔${escapeHtml(name)}〕 →</a>` : `<span class="reference unavailable">〔${escapeHtml(name)}〕</span>`;
}
function dress(text, quotes = false) {
  const token = /`[^`]+`|\*\*[^*]+\*\*|“[^”\n]{1,12}”|〔[^〕]+〕|\d+(?:\.\d+)?\s*(?:秒|分钟|小时|天|个|次|项|处|条|张|份|家|%)/g;
  let result = '', end = 0;
  for (const match of text.matchAll(token)) {
    result += escapeHtml(text.slice(end,match.index)); const value = match[0];
    if (value[0] === '`') result += `<code>${escapeHtml(value.slice(1,-1)).replace(/([/\\.])/g,'$1<wbr>')}</code>`;
    else if (value.startsWith('**')) result += `<strong>${escapeHtml(value.slice(2,-2))}</strong>`;
    else if (value[0] === '“') result += quotes ? `<span class="quote">${escapeHtml(value)}</span>` : escapeHtml(value);
    else if (value[0] === '〔') result += reference(value.slice(1,-1));
    else result += `<span class="number">${escapeHtml(value)}</span>`;
    end = match.index + value.length;
  }
  return result + escapeHtml(text.slice(end));
}
const sentences = text => (text.match(/[^。]+。?|。/g) || []).map(s=>`<p>${dress(s,true)}</p>`).join('');
function parseItem(text) {
  const lines = text.split('\n'), children = lines.slice(1).filter(s=>s.trim()).map(s=>s.trim().replace(/^[-*]\s/,''));
  let main = lines[0], type = 'point', step = '';
  if (/^>\s?/.test(main)) {type = 'notice';main = main.replace(/^>\s?/,'');}
  else if (/^\d+\.\s/.test(main)) {type = 'step';step = main.match(/^\d+/)[0];main = main.replace(/^\d+\.\s/,'');}
  else if (/^\*\*[^*]+\*\*$/.test(main)) return {type:'heading',main:main.slice(2,-2),children};
  const named = main.match(/^([^：，。；,;]{1,14})：([\s\S]*)$/);
  return {type,step,children,name:named?.[1],main:named ? named[2] : main};
}
const panes = new Map(), shots = new Map(), paginations = new Map();
const detailCount = item => item.detail.filter(text=>parseItem(text).type !== 'heading').length;
function fitPictures() {
  pictures.style.setProperty('--picture-scale',Math.min(1,document.documentElement.clientWidth / pictures.offsetWidth));
}
const notes = pictures.querySelector(':scope > .owner-note, :scope > .owner-notes');
const firstPicture = pictures.querySelector('[data-initial-cover]');
let active, opener, originalRect;
data.forEach((item,index) => {
  const figure = (!index && firstPicture) || document.createElement('section'); figure.className = 'picture';figure.id = item.id;
  figure.classList.toggle('buttons-below',!!item.buttonsBelow);
  const count = detailCount(item);
  const title = escapeHtml(item.title);
  const fallbackTitle = index === 0 && item.title === '封面' ? escapeHtml(coverTitle) : title;
  if (figure !== firstPicture) {
    figure.innerHTML = `<img ${index ? 'data-src' : 'src'}="${item.image}" data-cover-pending width="${item.width}" height="${item.height}" alt="${title}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}><h2 class="picture-title-fallback">${fallbackTitle}</h2>`;
    const image = figure.firstElementChild;
    if (image.naturalWidth) image.removeAttribute('data-cover-pending');
    else image.addEventListener('load', () => image.removeAttribute('data-cover-pending'), { once: true });
  }
  figure.insertAdjacentHTML('beforeend', `<div class="picture-actions"></div><button class="more${config.detailArt ? ' art' : ''}" type="button" title="细节 ${count} 条" aria-label="展开细节：${title}" aria-expanded="false" aria-controls="details"><span class="more-label">展开细节</span><b>${count}</b>${config.detailArt ? '' : '<i aria-hidden="true">→</i>'}</button>`);
  const actions = figure.querySelector('.picture-actions');
  if (item.buttonArea) {
    const [left, bottom, width] = item.buttonArea;
    actions.classList.add('picture-actions--placed');
    Object.assign(actions.style, {left: `${left}%`, bottom: `${bottom}%`, maxWidth: `${width}%`});
  }
  item.buttons.forEach(button => {
    const el = document.createElement(button.href ? 'a' : 'button');
    const art = config.buttonArt?.[button.label];
    el.className = `pill ${art ? 'pill--art' : 'pill--text'}`;
    if (art) {
      const [, width, w, h] = art;
      el.style.setProperty('--button-width', width);
      if (w && h) el.style.aspectRatio = `${w}/${h}`;
    }
    const label = document.createElement('span');
    label.className = 'button-label';
    label.textContent = button.label;
    el.append(label);
    if (button.href) el.href = button.href;else {el.type = 'button';el.disabled = true;el.title = '页面尚未建立';}
    actions.append(el);
  });
  figure.querySelector('.more').addEventListener('click',event => openDetails(item,event.currentTarget));
  if (figure !== firstPicture) pictures.insertBefore(figure, notes);
});
fitPictures();
function buildPane(item) {
  const pane = document.createElement('div');pane.className = 'detail-pane';pane.dataset.picture = item.id;
  const entries = item.detail.map(parseItem), named = entries.map((entry,i)=>({...entry,i})).filter(e=>e.name && !['出处','源码'].includes(e.name));
  let order = 1, number = 0;
  if (named.length >= 4) pane.innerHTML = `<nav class="quick-index" aria-label="本栏速查" style="--order:${order++}">${named.map(e=>`<a href="#${item.id}-detail-${e.i}">${escapeHtml(e.name)}</a>`).join('')}</nav>`;
  const article = document.createElement('div');article.className = 'detail-entries';
  entries.forEach((entry,i) => {
    if (['出处','源码'].includes(entry.name)) return;
    const el = document.createElement(entry.type === 'heading' ? 'h3' : 'section');el.id = `${item.id}-detail-${i}`;
    el.className = `detail-item ${entry.type}`;el.style.setProperty('--order',order++);
    if (entry.type === 'heading') el.textContent = entry.main;
    else {
      number++;el.dataset.number = entry.step || String(number).padStart(2,'0');
      el.innerHTML = `<div class="item-copy">${entry.name ? `<h3>${dress(entry.name)}</h3>` : ''}${sentences(entry.main)}</div>`;
      if (entry.children.length) {
        const lines = entry.children.some(s=>/^(?:>\s?|\d+\.\s)/.test(s));
        const pairs = !lines && entry.children.every(s=>/^([^：，。；]{1,14})：/.test(s));
        el.querySelector('.item-copy').insertAdjacentHTML('beforeend',`<div class="subitems ${pairs ? 'pairs' : lines ? 'lines' : 'tags'}">${entry.children.map(s=>{const child=parseItem(s);return `<div>${pairs ? `<h4>${dress(child.name)}</h4>${sentences(child.main)}` : dress(s.replace(/^>\s?/,''))}</div>`;}).join('')}</div>`);
      }
    }
    article.append(el);
  });pane.append(article);
  const sources = document.createElement('footer');sources.className = 'sources';sources.style.setProperty('--order',order++);
  entries.filter(e=>['出处','源码'].includes(e.name)).forEach(entry=>{
    const row = document.createElement('div');row.className = 'source-row';
    const repo = entry.main.match(/`([^`]+\/[^`]+)`/);
    row.innerHTML = `<b>${entry.name}</b><div>${entry.name === '源码' && repo ? `<a class="source-link" href="https://github.com/${escapeHtml(repo[1])}" target="_blank" rel="noopener">${dress(entry.main)} ↗</a>` : dress(entry.main)}</div>`;sources.append(row);
  });pane.append(sources);
  const index = data.indexOf(item), pagination = document.createElement('nav');pagination.className = 'pagination';pagination.ariaLabel = '翻张';pagination.dataset.picture = item.id;pagination.style.setProperty('--order',order++);
  for (const delta of [-1,1]) {
    const next = data[index+delta];if (!next) {pagination.append(document.createElement('span'));continue;}
    const button = document.createElement('button');button.type = 'button';button.textContent = delta < 0 ? `‹ 上一张 ${next.title}` : `下一张 ${next.title} ›`;
    button.addEventListener('click',()=>openDetails(next));pagination.append(button);
  }paginations.set(item.id,pagination);return pane;
}
function placeShot() {
  const pad = 20, width = dialog.clientWidth - drawer.offsetWidth - 3*pad;
  const scale = Math.min(1,width/active.width,(dialog.clientHeight-2*pad)/active.height);
  shot.style.width = `${active.width}px`;
  shot.style.setProperty('--shot-x',`${pad}px`);shot.style.setProperty('--shot-y',`${(dialog.clientHeight-active.height*scale)/2}px`);shot.style.setProperty('--shot-scale',scale);
}
// 全站动效（motion.js）给的开合口子；没有它或动效关着时，照原来瞬间开合。
const motion = () => (window.MOTION_DETAIL && window.MOTION_DETAIL.active() ? window.MOTION_DETAIL : null);
function fillDetails(item) {
  document.querySelector('#detail-title').innerHTML = item.title.split(/([A-Za-z]+)/).map(part => /^[A-Za-z]+$/.test(part) ? `<span class="title-latin">${escapeHtml(part)}</span>` : escapeHtml(part)).join('');
  document.querySelector('.detail-meta').textContent = `${config.pages[document.body.dataset.page].meta}　${String(data.indexOf(item)+1).padStart(2,'0')} / ${String(data.length).padStart(2,'0')}`;
  document.querySelector('.detail-count').textContent = `${detailCount(item)} 条细节`;
  if (!panes.has(item.id)) panes.set(item.id,buildPane(item));
  if (!shots.has(item.id)) {
    const imageLayer = document.createElement('div');imageLayer.className = 'shot-layer';imageLayer.dataset.picture = item.id;
    imageLayer.innerHTML = `<img src="${item.image}" data-cover-pending width="${item.width}" height="${item.height}" alt="${escapeHtml(item.title)}">`;
    const image = imageLayer.firstElementChild;
    const show = () => image.decode().then(() => image.removeAttribute('data-cover-pending'), () => {});
    image.addEventListener('load', show);
    if (image.naturalWidth) show();
    shots.set(item.id,imageLayer);
  }
  detailBody.replaceChildren(panes.get(item.id));shot.replaceChildren(shots.get(item.id));
  drawer.querySelector('.pagination')?.remove();drawer.append(paginations.get(item.id));
}
function openDetails(item,button) {
  const M = motion(), state = document.body.dataset.detailState, previous = active;
  if (M && state === 'closing') return;
  const flipping = M && dialog.open && state === 'open' && previous && previous !== item;
  if (opener) opener.setAttribute('aria-expanded','false');
  active = item;opener = button || document.querySelector(`#${item.id} .more`);
  originalRect = document.querySelector(`#${item.id} > img`).getBoundingClientRect();
  if (flipping) {
    M.flip({dir: data.indexOf(item) > data.indexOf(previous) ? 1 : -1, shot, drawer, apply: () => {fillDetails(item);placeShot();}});
    document.body.dataset.activePicture = item.id;opener.setAttribute('aria-expanded','true');detailBody.scrollTop = 0;updateProgress();
    return;
  }
  const wasOpen = dialog.open && state === 'open';
  fillDetails(item);
  document.body.classList.add('reading');document.body.dataset.detailState = 'open';document.body.dataset.activePicture = item.id;
  if (!dialog.open) dialog.showModal();
  dialog.classList.add('open');opener.setAttribute('aria-expanded','true');detailBody.scrollTop = 0;updateProgress();placeShot();closeButton.focus({preventScroll:true});
  if (M && !wasOpen) M.open({shot, drawer, from: originalRect, item});
}
function closeDetails() {
  const M = motion();
  if (M) {
    if (document.body.dataset.detailState !== 'open') return;
    document.body.dataset.detailState = 'closing';
    M.close({shot, drawer, item: active}, () => {
      dialog.classList.remove('open');dialog.close();document.body.classList.remove('reading');document.body.dataset.detailState = 'closed';delete document.body.dataset.activePicture;
      opener.setAttribute('aria-expanded','false');opener.focus({preventScroll:true});
    });
    return;
  }
  document.body.dataset.detailState = 'closing';dialog.classList.remove('open');
  shot.style.setProperty('--shot-x',`${originalRect.left}px`);shot.style.setProperty('--shot-y',`${originalRect.top-document.querySelector('.site-header').offsetHeight}px`);shot.style.setProperty('--shot-scale',originalRect.width/active.width);
  dialog.close();document.body.classList.remove('reading');document.body.dataset.detailState = 'closed';delete document.body.dataset.activePicture;
  opener.setAttribute('aria-expanded','false');opener.focus({preventScroll:true});
}
closeButton.addEventListener('click',closeDetails);
dialog.addEventListener('cancel',event=>{event.preventDefault();closeDetails();});
document.querySelector('.detail-stage').addEventListener('click',event=>{if (!event.composedPath().includes(drawer)) closeDetails();});
detailBody.addEventListener('click',event=>{
  const link = event.target.closest('a[href^="#"]');if (!link) return;
  event.preventDefault();const id = link.getAttribute('href').slice(1);
  if (link.closest('.quick-index')) document.getElementById(id).scrollIntoView({block:'start'});
  else if (data.some(item=>item.id === id)) openDetails(data.find(item=>item.id === id));
});
function updateProgress() {
  const max = detailBody.scrollHeight-detailBody.clientHeight;
  dialog.style.setProperty('--read-progress',`${max > 0 ? Math.max(6,detailBody.scrollTop/max*100) : 100}%`);
  detailBody.classList.toggle('can-scroll',max > 0 && detailBody.scrollTop < max-2);
}
detailBody.addEventListener('scroll',updateProgress,{passive:true});
addEventListener('resize',()=>{fitPictures();if (dialog.open) {placeShot();updateProgress();}});
document.body.dataset.detailState = 'closed';

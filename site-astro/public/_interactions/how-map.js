/* 全景图使用页面登记的实际关系；名单、鼠标、触屏和键盘共用同一邻接数据。 */
(() => {
  'use strict';
  const section = document.getElementById('how-02'), source = document.getElementById('how-map-data');
  if (!section || !source || section.dataset.howMapReady) return;
  const data = JSON.parse(source.textContent), names = new Map(data.nodes.map(n => [n.id, n]));
  const neighbours = new Map(data.nodes.map(n => [n.id, new Set([n.id])]));
  for (const r of data.relations) { neighbours.get(r.from)?.add(r.to); neighbours.get(r.to)?.add(r.from); }
  const items = [...section.querySelectorAll('.hub-grouped-item')];
  const stem = text => text.trim().split(/[（(]/)[0];
  for (const item of items) {
    const node = data.nodes.find(n => stem(item.textContent) === stem(n.name));
    if (!node) continue;
    item.dataset.howNode = node.id;
    if (!item.querySelector('a')) { item.tabIndex = 0; item.setAttribute('role', 'button'); }
  }
  const nodes = items.filter(item => item.dataset.howNode), hover = matchMedia('(hover: hover)');
  const style = document.createElement('style');
  style.textContent = `#how-02 [data-how-node]{border-radius:6px;transition:opacity .15s,background-color .15s;cursor:pointer}
    #how-02 .how-map-dim{opacity:.3}#how-02 .how-map-related{background:#edf8f0;box-shadow:inset 3px 0 #70ba8b}
    #how-02 .how-map-current{background:#def2e5;box-shadow:inset 4px 0 #13803d}#how-02 [data-how-node]:focus-visible{outline:2px solid #13803d;outline-offset:3px}
    .how-map-relations{padding:16px 24px;border:1px solid #cfe3d3;border-radius:12px;background:#f6fbf7;color:#334d63;font:16px/1.7 system-ui}
    .how-map-relations[hidden]{display:none}.how-map-relations h3{margin:0 0 8px;color:#285d3c;font-size:18px}.how-map-relations-list{max-height:24rem;overflow:auto}
    .how-map-relation{padding:8px 0;border-top:1px solid #dceadf}.how-map-relation svg{width:54px;height:16px;vertical-align:middle;margin:0 6px;color:#13803d}
    .how-map-relation small{display:block}.how-map-relation a{color:#276942;text-decoration:underline}
    @media(prefers-reduced-motion:reduce){#how-02 [data-how-node]{transition:none}}`;
  document.head.append(style);
  const panel = document.createElement('aside'); panel.className = 'how-map-relations'; panel.hidden = true;
  panel.setAttribute('aria-label', '所选项目的上下游'); panel.setAttribute('aria-live', 'polite'); section.append(panel);
  let selected = null, pointer = '', timer = 0;
  const nodeFor = target => target instanceof Element ? target.closest('[data-how-node]') : null;
  function name(id) {
    const el = document.createElement('span'); el.textContent = names.get(id)?.name || id; return el;
  }
  function focus(id) {
    clearTimeout(timer); selected = names.has(id) ? id : null;
    const adjacent = neighbours.get(selected);
    for (const node of nodes) {
      node.classList.toggle('how-map-dim', !!selected && !adjacent.has(node.dataset.howNode));
      node.classList.toggle('how-map-related', !!selected && adjacent.has(node.dataset.howNode));
      node.classList.toggle('how-map-current', selected === node.dataset.howNode);
      if (node.getAttribute('role') === 'button') node.setAttribute('aria-pressed', String(selected === node.dataset.howNode));
    }
    section.dataset.howMapFocus = selected || ''; panel.replaceChildren(); panel.hidden = !selected;
    if (!selected) return;
    const heading = document.createElement('h3'); heading.textContent = names.get(selected).name + '的上下游'; panel.append(heading);
    const list = document.createElement('div'); list.className = 'how-map-relations-list'; panel.append(list);
    for (const r of data.relations.filter(r => r.from === selected || r.to === selected)) {
      const row = document.createElement('div'); row.className = 'how-map-relation';
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); line.setAttribute('viewBox', '0 0 54 16'); line.setAttribute('aria-hidden', 'true');
      const dash = r.kind === '文字' ? '6 4' : r.kind === '状态' ? '1 4' : '';
      line.innerHTML = `<path d="${r.kind === '画面' ? 'M1 5H46 M1 11H46' : 'M1 8H46'}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="${dash}"/><path d="M44 3L51 8L44 13" fill="none" stroke="currentColor" stroke-width="2"/>`;
      const description = document.createElement('small'); description.textContent = r.kind + '：' + r.what;
      row.append(name(r.from), line, name(r.to), description); list.append(row);
    }
  }
  section.addEventListener('pointerdown', e => { pointer = e.pointerType; });
  section.addEventListener('pointerover', e => { const node = nodeFor(e.target); if (node && e.pointerType === 'mouse' && hover.matches) focus(node.dataset.howNode); });
  section.addEventListener('pointerout', e => { if (e.pointerType === 'mouse' && nodeFor(e.target) && !nodeFor(e.relatedTarget)) focus(null); });
  section.addEventListener('focusin', e => { const node = nodeFor(e.target); if (node && pointer !== 'touch') focus(node.dataset.howNode); });
  section.addEventListener('focusout', e => { if (nodeFor(e.target) && !nodeFor(e.relatedTarget)) focus(null); });
  section.addEventListener('click', e => {
    const node = nodeFor(e.target);
    if (node && (pointer === 'touch' || !hover.matches) && e.detail !== 0 && selected !== node.dataset.howNode) {
      e.preventDefault(); e.stopImmediatePropagation(); focus(node.dataset.howNode);
    } else if (!node && !panel.contains(e.target)) focus(null);
  }, true);
  section.addEventListener('keydown', e => {
    if (e.key === 'Escape') focus(null);
    const node = nodeFor(e.target);
    if (node && !node.querySelector('a') && ['Enter', ' '].includes(e.key)) { e.preventDefault(); focus(node.dataset.howNode); }
  });
  function hashFocus() {
    const id = decodeURIComponent(location.hash.slice(1)); if (!names.has(id)) return;
    focus(id); section.scrollIntoView({block: 'start', behavior: 'auto'}); timer = setTimeout(() => focus(null), 6000);
  }
  section.dataset.howMapReady = 'true'; addEventListener('hashchange', hashFocus); hashFocus();
})();

/* 全景图：点一项，下方弹出“它从谁拿、交给谁”的卡，清单里给有往来的项目标“给它 / 它给”；关系数据来自页面登记。 */
(() => {
  'use strict';
  const section = document.getElementById('how-02'), source = document.getElementById('how-map-data');
  if (!section || !source || section.dataset.howMapReady) return;
  const data = JSON.parse(source.textContent), names = new Map(data.nodes.map(n => [n.id, n]));
  const items = [...section.querySelectorAll('.hub-grouped-item')];
  const stem = text => text.trim().split(/[（(]/)[0];
  for (const item of items) {
    const node = data.nodes.find(n => stem(item.textContent) === stem(n.name));
    if (!node) continue;
    item.dataset.howNode = node.id;
    const tag = document.createElement('span'); tag.className = 'how-map-tag'; tag.setAttribute('aria-hidden', 'true'); item.append(tag);
    if (!item.querySelector('a')) { item.tabIndex = 0; item.setAttribute('role', 'button'); }
  }
  const nodes = items.filter(item => item.dataset.howNode);
  const style = document.createElement('style');
  style.textContent = `#how-02 [data-how-node]{position:relative;border-radius:8px;margin:0 -8px;padding-left:8px;padding-right:8px;transition:opacity .15s,background-color .15s,color .15s;cursor:pointer}
    #how-02 [data-how-node]:hover{background:#f0f8f2}
    #how-02 .how-map-dim{opacity:.4}
    #how-02 .how-map-related{background:#f0f8f2}
    #how-02 .how-map-current,#how-02 .how-map-current:hover{background:#13803d;color:#fff;font-weight:700;opacity:1}
    #how-02 .how-map-current a{color:#fff;text-decoration-color:rgba(255,255,255,.6)}
    #how-02 .how-map-tag{display:none;margin-left:.5em;padding:0 .5em;border:1px solid #8cc7a0;border-radius:999px;background:#fff;color:#1f6b3a;font-size:.72em;font-weight:600;line-height:1.6;vertical-align:.12em;white-space:nowrap}
    #how-02 .how-map-related .how-map-tag,#how-02 .how-map-current .how-map-tag{display:inline-block}
    #how-02 .how-map-current .how-map-tag{border-color:#fff;background:#fff;color:#13803d}
    #how-02 [data-how-node]:focus-visible{outline:2px solid #13803d;outline-offset:2px}
    .how-map-card{position:fixed;left:50%;bottom:16px;z-index:60;box-sizing:border-box;width:min(980px,calc(100% - 32px));max-height:min(52vh,560px);overflow:auto;transform:translateX(-50%);padding:18px 24px 20px;border:1px solid #9fcfae;border-radius:14px;background:#fff;box-shadow:0 10px 34px rgba(20,70,40,.18);color:#2f4a3a;font:16px/1.65 system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif}
    .how-map-card[hidden]{display:none}
    .how-map-card-head{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;padding-right:72px}
    .how-map-card h3{margin:0;color:#13803d;font-size:21px}
    .how-map-card-sum{color:#5b7264;font-size:15px}
    .how-map-close{position:absolute;top:12px;right:14px;border:1px solid #cfe3d3;border-radius:999px;background:#fff;color:#2f5a3e;font:inherit;font-size:14px;padding:2px 12px;cursor:pointer}
    .how-map-cols{display:grid;grid-template-columns:1fr 1fr;gap:6px 28px;margin-top:10px}
    .how-map-col h4{margin:0 0 4px;color:#285d3c;font-size:15px}
    .how-map-col ul{margin:0;padding:0;list-style:none}
    .how-map-col li{padding:6px 0;border-top:1px solid #e3efe6}
    .how-map-col .how-map-none{color:#7a8c80}
    .how-map-peer{border:0;padding:0;background:none;color:#13803d;font:inherit;font-weight:700;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
    .how-map-kind{display:inline-block;margin-left:6px;padding:0 6px;border-radius:4px;background:#eef6f0;color:#4d6b57;font-size:12px;line-height:1.7;vertical-align:.1em}
    .how-map-go{display:inline-block;margin-top:12px;padding:6px 16px;border-radius:999px;background:#13803d;color:#fff;font-weight:600;text-decoration:none}
    .how-map-go:hover{background:#0f6a32}
    @media(max-width:767px){.how-map-card{left:0;bottom:0;width:100%;max-height:48vh;transform:none;border-radius:16px 16px 0 0;padding:16px 16px 18px}.how-map-cols{grid-template-columns:1fr}.how-map-card h3{font-size:19px}}
    @media(prefers-reduced-motion:reduce){#how-02 [data-how-node]{transition:none}}`;
  document.head.append(style);
  const card = document.createElement('aside'); card.className = 'how-map-card how-map-relations'; card.hidden = true;
  card.setAttribute('aria-label', '所选项目和谁有往来'); card.setAttribute('aria-live', 'polite'); document.body.append(card);
  let selected = null;
  const nodeFor = target => target instanceof Element ? target.closest('[data-how-node]') : null;
  const label = id => names.get(id)?.name || id;
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  function column(title, rows, peerOf, empty) {
    const col = el('div', 'how-map-col'), list = el('ul');
    col.append(el('h4', '', title + (rows.length ? `（${rows.length}）` : '')), list);
    if (!rows.length) list.append(el('li', 'how-map-none', empty));
    for (const r of rows) {
      const li = el('li', 'how-map-relation'), peer = el('button', 'how-map-peer', label(peerOf(r)));
      peer.type = 'button'; peer.dataset.howPeer = peerOf(r);
      li.append(peer, document.createTextNode('：' + r.what), el('span', 'how-map-kind', r.kind)); list.append(li);
    }
    return col;
  }
  function focus(id) {
    selected = names.has(id) ? id : null;
    const incoming = data.relations.filter(r => r.to === selected), outgoing = data.relations.filter(r => r.from === selected);
    const gives = new Set(incoming.map(r => r.from)), takes = new Set(outgoing.map(r => r.to));
    for (const node of nodes) {
      const n = node.dataset.howNode, give = gives.has(n), take = takes.has(n), current = n === selected;
      node.classList.toggle('how-map-current', current);
      node.classList.toggle('how-map-related', !!selected && !current && (give || take));
      node.classList.toggle('how-map-dim', !!selected && !current && !give && !take);
      node.querySelector('.how-map-tag').textContent = current ? '你点的' : give && take ? '互相给' : give ? '给它' : take ? '它给' : '';
      if (node.getAttribute('role') === 'button') node.setAttribute('aria-pressed', String(current));
    }
    section.dataset.howMapFocus = selected || ''; card.replaceChildren(); card.hidden = !selected;
    if (!selected) return;
    const peers = new Set([...gives, ...takes]); peers.delete(selected);
    const head = el('div', 'how-map-card-head');
    head.append(el('h3', '', label(selected)), el('span', 'how-map-card-sum', `和 ${peers.size} 项有往来，清单里已标出“给它”“它给”`));
    const close = el('button', 'how-map-close', '收起 ×'); close.type = 'button'; close.dataset.howClose = '';
    const cols = el('div', 'how-map-cols');
    cols.append(column('它从这些地方拿', incoming, r => r.from, '不从别处拿东西'), column('它交给这些地方', outgoing, r => r.to, '不往别处交东西'));
    card.append(close, head, cols);
    const href = names.get(selected).href;
    if (href) { const go = el('a', 'how-map-go', `进入「${label(selected)}」的页面 →`); go.href = href; card.append(go); }
  }
  function visibleItem(id) { return nodes.find(n => n.dataset.howNode === id && n.getClientRects().length); }
  function keepAboveCard(item) {
    if (!item || card.hidden) return;
    const room = innerHeight - card.getBoundingClientRect().height - 16, bottom = item.getBoundingClientRect().bottom;
    if (bottom > room) scrollBy({top: bottom - room, behavior: 'auto'});
  }
  card.addEventListener('click', e => {
    const peer = e.target instanceof Element && e.target.closest('[data-how-peer]');
    if (peer) { focus(peer.dataset.howPeer); const item = visibleItem(peer.dataset.howPeer); item?.scrollIntoView({block: 'center', behavior: 'auto'}); keepAboveCard(item); }
    else if (e.target instanceof Element && e.target.closest('[data-how-close]')) focus(null);
  });
  // 普通点击先选中（不跳页），再点同一项或点卡上的按钮才进页面；带修饰键的点击和键盘回车照常打开链接。
  section.addEventListener('click', e => {
    if (card.contains(e.target)) return;
    const node = nodeFor(e.target);
    if (!node) { focus(null); return; }
    if (e.detail === 0 || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (selected === node.dataset.howNode && node.querySelector('a')) return;
    e.preventDefault(); e.stopImmediatePropagation(); focus(node.dataset.howNode); keepAboveCard(node);
  }, true);
  section.addEventListener('focusin', e => { const node = nodeFor(e.target); if (node && e.target.matches(':focus-visible')) focus(node.dataset.howNode); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && selected) focus(null); });
  section.addEventListener('keydown', e => {
    const node = nodeFor(e.target);
    if (node && !node.querySelector('a') && ['Enter', ' '].includes(e.key)) { e.preventDefault(); focus(node.dataset.howNode); }
  });
  document.addEventListener('click', e => { if (selected && !section.contains(e.target) && !card.contains(e.target)) focus(null); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { if (selected && !entries[0].isIntersecting) focus(null); }).observe(section);
  function hashFocus() {
    const id = decodeURIComponent(location.hash.slice(1)); if (!names.has(id)) return;
    focus(id); (visibleItem(id) || section).scrollIntoView({block: 'center', behavior: 'auto'});
  }
  section.dataset.howMapReady = 'true'; addEventListener('hashchange', hashFocus); hashFocus();
})();

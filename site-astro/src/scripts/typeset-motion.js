/* 将动效接到真实正文元素；循环层只更新位置，滚动不重建时间线。 */
(() => {
  const root = document.querySelector('main.ts-page');
  if (!root || !('IntersectionObserver' in window)) return;
  const numbers = '.num,[data-role=num],.dd-chart-number,.hub-number-value,[data-motion-text=number],.ct-step-number,.slot-step-number';
  const tokenFor = text => { if (typeof motionNumberToken==='function') return motionNumberToken(text); const numeric=text.match(/[+-]?\d[\d,]*(?:\.\d+)?/)?.[0] || text.match(/[⓪①-⑳]/)?.[0];
    return numeric ? {numeric,value:/\d/.test(numeric)?Number(numeric.replaceAll(',','')):numeric==='⓪'?0:numeric.codePointAt(0)-0x2460+1,notation:/\d/.test(numeric)?'decimal':'circled'} : null; };
  const textFor = (n,value,last) => { if (typeof motionNumberText==='function') return motionNumberText(n,value,last); if (last) return n.text; const decimals=(n.numeric.split('.')[1]||'').length;
    return n.text.replace(n.numeric,n.notation==='circled'?(Math.round(value)===0?'⓪':String.fromCodePoint(0x2460+Math.round(value)-1)):value.toLocaleString('en-US',{useGrouping:n.numeric.includes(','),minimumFractionDigits:decimals,maximumFractionDigits:decimals})); };
  const dots = '.dot,.status-dot,.ds-status-dot,.legend-dot,.hub-status-dot,[data-role=status-dot],.feature-status-dot,.mock-status-dot,.legend-color-dot,.live-dot';
  const arrows = '.sequence-arrow,.arrow,.flow-arrow,[data-comp=arrow],.ds-source-arrow-glyph,.ds-judgement-arrow-symbol';
  const cards = '.card,.ct-card';
  const gridCards = '.ts-card-grid > .ts-screen';
  const partEntry = root.dataset.entryMotion === 'cards', partGroups = new WeakMap();
  const cardEligible = el => !el.parentElement?.closest(cards);
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const visible = el => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < innerHeight; };
  const moving = () => !document.hidden && !reduced.matches && !document.body.classList.contains('motion-off');
  const duration = name => ({cards:900,numbers:1200,seam:1400,update:1800})[name];
  const played = new WeakSet(), animations = new Map(), layers = new Map(), active = new Set();
  function animate(owner, el, frames, options, cleanup = () => {}) {
    const a = el.animate(frames, options); animations.set(a, owner);
    a.finished.then(() => { animations.delete(a); cleanup(); }).catch(() => { animations.delete(a); played.delete(owner); cleanup(); });
  }
  function position(host, rect, e) {
    const b = host.getBoundingClientRect(), scale = b.width / host.offsetWidth;
    Object.assign(e.style, {left:((rect.left-b.left)/scale-host.clientLeft)+'px',top:((rect.top-b.top)/scale-host.clientTop)+'px',width:rect.width/scale+'px',height:rect.height/scale+'px'});
  }
  function overlay(host, rect, cls) {
    const e = document.createElement('span'); e.className = 'sample-overlay ' + cls;
    e.setAttribute('aria-hidden', 'true'); e.dataset.tsMotionOverlay = ''; position(host, rect, e); host.append(e); return e;
  }
  function numberFragment(el, token) {
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); let node;
    while ((node=walker.nextNode())) { const start=node.nodeValue.indexOf(token.numeric); if(start<0)continue;
      const range=document.createRange(); range.setStart(node,start); range.setEnd(node,start+token.numeric.length);
      return {rect:range.getBoundingClientRect(),style:getComputedStyle(node.parentElement),text:token.numeric}; }
    return null;
  }
  function enterCard(el, group, art = null) { played.add(el);
    const options={duration:duration('cards'),delay:Math.max(0,group.indexOf(el))*60,easing:'ease-out',fill:'backwards'};
    animate(el,el,[{opacity:0,translate:'0 80px'},{opacity:1,translate:'0 0'}],options);
    // 环境插画在画布外；和画布里的原图同一时刻、同一屏幕距离移动。
    if (art) { const host=el.closest('.ts-canvas'), scale=host.getBoundingClientRect().width/host.offsetWidth;
      animate(el,art,[{opacity:0,translate:`0 ${80*scale}px`},{opacity:1,translate:'0 0'}],options); }
  }
  function enterParts(host) {
    if (!partEntry || !moving() || host.closest(gridCards)) return;
    const sec=host.closest('.ts-screen');
    if (!sec || sec.classList.contains('ts-entering') || sec.dataset.seen) return;
    let group=partGroups.get(host);
    if (!group) {
      // 只选真正的正文组件；含卡片的容器由原有卡片进场负责，避免父子叠播。
      group=[...host.querySelectorAll('[data-comp],.hub-stat-extra')].filter(el=>!el.closest(cards)&&!el.querySelector(cards));
      group=group.filter(el=>!group.some(parent=>parent!==el&&parent.contains(el)));
      partGroups.set(host,group);
    }
    const visibleGroup=group.filter(visible);
    for (const el of visibleGroup) if (!played.has(el)) {
      const art=el.matches('[data-comp=illustration]')&&el.querySelector('[data-ts-art]')?host.parentElement.querySelector(':scope > .ts-art'):null;
      enterCard(el,visibleGroup,art);
    }
  }
  function enter(el) {
    if (!moving() || !visible(el) || played.has(el)) return;
    if (el.matches(gridCards)) { enterCard(el,[...el.parentElement.children].filter(visible)); return; }
    const host = el.closest(cards) || el.closest('.ts-canvas'); if (!host) return;
    if (el.matches(cards) && (!cardEligible(el)||el.closest(gridCards))) return;
    if (el.matches(numbers)) {
      if (document.fonts.status !== 'loaded') return;
      const text = el.textContent.trim(), token = tokenFor(text);
      if (!token || el.querySelector(numbers)) return;
      const fragment=numberFragment(el,token); if (!fragment) return;
      played.add(el);
      // 只覆盖真实数字文本框；单位留在原 DOM，字号、行高和位置不进入数带。
      const e = overlay(host, fragment.rect, 'number-roll'), track = document.createElement('span');
      track.className = 'number-track'; track.style.width='100%'; const decimals = (token.numeric.split('.')[1] || '').length;
      for (let i=0;i<=20;i++) { const row=document.createElement('span'); row.textContent=textFor({text:fragment.text,...token},+(token.value*(1-(1-i/20)**3)).toFixed(decimals),i===20); track.append(row); }
      for (const key of ['fontSize','fontFamily','fontWeight','fontStyle','fontStretch','fontVariantNumeric','letterSpacing','color']) e.style[key]=fragment.style[key];
      e.append(track); animate(el, track, [{transform:'translateY(0)'},{transform:'translateY(-95.238095%)'}], {duration:duration('numbers'),easing:'steps(20,end)',fill:'forwards'},()=>e.remove());
    } else if (el.matches(cards)) {
      const group=[...el.parentElement.querySelectorAll(cards)].filter(x=>visible(x)&&cardEligible(x));
      enterCard(el,group);
    } else {
      played.add(el);
      el.classList.add('sample-seam'); setTimeout(()=>el.classList.remove('sample-seam'),duration('seam'));
    }
  }
  function activeDot(el) {
    const owner=el.closest('[data-state],[data-status]'), state=el.dataset.state||el.dataset.status||owner?.dataset.state||owner?.dataset.status;
    if (el.matches('.dot-x,.dot-off,.hub-status-frozen') || ['off','unknown','pending','uncertain','unused','ring','failed','error','offline','disabled','loading','paused','cached','fact'].includes(state)) return false;
    if (el.matches('.dot.dot-on,[data-role=status-dot][data-ct-dot-xywh]') || ['on','ok','active','running','enabled','valid','normal'].includes(state)) return true;
    const label=el.dataset.text||el.getAttribute('aria-label')||el.parentElement?.textContent||'';
    return !/[○✕×]|停用|待定|待验收|待实施|未启用|未运行|没用过|说不准|未知|离线|暂停|冻结/.test(label) && /在用|正常|正在运行|已启用|有效/.test(label);
  }
  function clear(host) { for (const e of layers.get(host)?.values()||[]) e.remove(); layers.delete(host); }
  function decorate(host) {
    if (!moving() || !visible(host)) { clear(host); return; }
    const existing=layers.get(host)||new Map(), kept=new Set();
    const add=(key,rect,cls,owner)=>{
      if (rect.width<=1||rect.height<=1||rect.bottom<=0||rect.top>=innerHeight) return;
      let e=existing.get(key); if (e?.className!=='sample-overlay '+cls) { e?.remove(); e=null; }
      const mount=owner?.closest(cards)||host;
      if (!e) { e=overlay(mount,rect,cls); existing.set(key,e); if (cls.startsWith('arrow-flow')) e.innerHTML='<i></i>'; }
      else position(mount,rect,e);
      if (cls.startsWith('arrow-flow')) e.style.setProperty('--travel',(cls.includes('vertical')?e.offsetHeight:e.offsetWidth)+'px');
      kept.add(key);
    };
    for (const el of host.querySelectorAll(dots)) if (activeDot(el)&&!el.dataset.incomplete) add(el,el.getBoundingClientRect(),'status-pulse',el);
    for (const el of host.querySelectorAll(arrows)) { const r=el.getBoundingClientRect(); add(el,r,'arrow-flow'+(r.height>r.width?' vertical':''),el); }
    for (const el of host.querySelectorAll('.c-sequence .sequence-item,.ds-node,.ds-layer,.ds-pair-connector,.ds-judgement-row,.dd-sample')) for (const pseudo of ['::before','::after']) {
      const s=getComputedStyle(el,pseudo), connector=el.closest('.c-sequence')?.dataset.connector;
      const painted=s.backgroundImage!=='none'||!['transparent','rgba(0, 0, 0, 0)'].includes(s.backgroundColor)||['borderLeftWidth','borderRightWidth','borderTopWidth','borderBottomWidth'].some(k=>parseFloat(s[k])>1);
      if (el.matches('.dd-sample')&&pseudo==='::after'&&s.borderRadius==='50%' || s.content==='none'||s.display==='none'||s.position!=='absolute'||!s.clipPath.includes('polygon')&&!(['arrow','ribbon','line'].includes(connector)&&painted)) continue;
      const proxy=document.createElement('span');
      for (const k of ['position','left','top','right','bottom','width','height','transform','transformOrigin','boxSizing','marginLeft','marginTop','marginRight','marginBottom','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderTopStyle','borderRightStyle','borderBottomStyle','borderLeftStyle']) proxy.style[k]=s[k];
      proxy.style.visibility='hidden'; el.append(proxy); const r=proxy.getBoundingClientRect(); proxy.remove();
      el._tsMotionKeys ||= {}; el._tsMotionKeys[pseudo] ||= {}; add(el._tsMotionKeys[pseudo],r,'arrow-flow'+(r.height>r.width?' vertical':''),el);
    }
    for (const [key,e] of existing) if (!kept.has(key)) { e.remove(); existing.delete(key); }
    layers.set(host,existing);
  }
  let queued=false;
  function refresh() {
    if (queued) return; queued=true;
    requestAnimationFrame(()=>{ queued=false; for (const host of active) {
      const gridCard=host.closest(gridCards); if(gridCard)enter(gridCard);
      decorate(host); enter(host); for (const el of host.querySelectorAll(numbers+','+cards)) enter(el);
      enterParts(host);
      const sec=host.closest('.ts-screen'), r=sec.getBoundingClientRect(), limit=innerWidth<600?5:12.5;
      sec.style.setProperty('--sample-y',moving()?Math.max(-limit,Math.min(limit,(r.top-innerHeight*.45)*.035))+'px':'0px');
    }});
  }
  const observer=new IntersectionObserver(entries=>{for (const row of entries) {
    const host=row.target; if (row.isIntersecting) active.add(host); else { active.delete(host); clear(host); }
  } refresh();});
  const observe=()=>root.querySelectorAll('.ts-canvas').forEach(el=>observer.observe(el));
  if (partEntry) { observe(); document.fonts.ready.then(refresh); } else document.fonts.ready.then(observe);
  addEventListener('scroll',refresh,{passive:true}); addEventListener('resize',refresh); addEventListener('pageshow',refresh);
  function sync() { if (!moving()) { for (const a of animations.keys()) a.cancel(); for (const el of root.querySelectorAll('.sample-updated')) el.classList.remove('sample-updated'); for (const host of active) if (host.classList.contains('sample-seam')) { played.delete(host); host.classList.remove('sample-seam'); } } refresh(); }
  document.addEventListener('site-motion',sync); document.addEventListener('visibilitychange',sync); reduced.addEventListener('change',sync);
  const values=new WeakMap(); root.querySelectorAll('[data-hot=live][data-state]').forEach(el=>values.set(el,el.textContent));
  new MutationObserver(records=>{let changed=false;for (const row of records) {
    const el=(row.target instanceof Element?row.target:row.target.parentElement)?.closest('[data-hot=live][data-state]');
    if (!el) continue; const text=el.textContent,old=values.get(el); values.set(el,text); changed=true;
    if (old&&old!==text&&moving()&&visible(el)&&el.dataset.state!=='loading') { el.classList.remove('sample-updated'); requestAnimationFrame(()=>el.classList.add('sample-updated')); setTimeout(()=>el.classList.remove('sample-updated'),duration('update')); }
  } if (changed) refresh();}).observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-state']});
})();

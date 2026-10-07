/* 工程10专用：保留原文字树，原例外小牌挂位、实际占高及安全分张后绘五条避字线。 */
(() => {
  'use strict';
  // 专用脚本若被重复挂载，先清旧层/观察器；仍只有一个有效五线实例。
  window.__engineeringStepPortsPrototype?.disconnect?.();
  const NS = 'http://www.w3.org/2000/svg';
  const sourceSelector = '[data-comp="points_card"] .ct-points-card .ct-list > li[data-target]';
  const flowSelector = '[data-comp="flow"]';
  const expected = [1, 2, 3, 3, 5];
  const pendingAttribute = 'data-step-ports-layout-pending';
  const pendingReason = 'comp-text 工程10：原例外挂位、唯一安全切口与五线路由尚待脚本完整核验。';
  const originalScript = document.currentScript;
  let scope = null, svg = null, closed = false;
  let observed = new Set();
  let marker = null, refreshing = false;
  const writes = new Map(), ownAttributes = new Map();
  const horizontalNaturalHeights = new WeakMap();
  let fontRevision = 0;
  let rootReceipt = null;
  const ownPendingAttributes = new WeakMap();
  const state = { linesReady: false, layoutPending: true, error: null, lineCount: 0, revision: 0, cutY:null, direction:null };

  function failure(code) {
    state.error = code; state.linesReady = false; state.layoutPending = true; state.lineCount = 0;
    state.cutY=null;state.direction=null;
    rootPending(true);
    if(marker){marker.remove();writes.delete(marker);ownAttributes.delete(marker);marker=null;}
    if (svg) {
      svg.replaceChildren();
      svg.dataset.overlayError = code;
      svg.dataset.stepPortsState = 'composition-error';
      svg.dataset.incomplete = '工程10布局、保字、切口或避字线路尚未全部通过';
    }
  }

  // 只接管生产者明确保留的这对属性；同名属性的新外部值不由本实例覆盖。
  function rootPending(pending) {
    if(!rootReceipt)return;
    const {root,last}=rootReceipt;
    for(const [attribute,value]of [[pendingAttribute,pending?'true':null],['data-incomplete',pending?pendingReason:null]]) {
      if(root.getAttribute(attribute)!==last[attribute] || last[attribute]===value)continue;
      if(value===null)root.removeAttribute(attribute);else root.setAttribute(attribute,value);
      last[attribute]=root.getAttribute(attribute);
      let own=ownPendingAttributes.get(root);
      if(!own)ownPendingAttributes.set(root,own={});
      own[attribute]=last[attribute];
    }
  }
  function bindRootReceipt(page) {
    const roots=Array.from(page.querySelectorAll('[data-comp="points_card"]'));
    const root=roots.length===1?roots[0]:null;
    if(rootReceipt?.root===root)return;
    rootPending(true);rootReceipt=null;
    if(root && root.getAttribute(pendingAttribute)==='true' && root.getAttribute('data-incomplete')===pendingReason)
      rootReceipt={root,last:{[pendingAttribute]:'true','data-incomplete':pendingReason}};
  }

  // 逐属性保存；只撤回仍等于本实例末次写值的项，尊重其他消费者的新改动。
  function write(node, property, value) {
    value = String(value);
    if (node.style.getPropertyValue(property) === value) return;
    let entries = writes.get(node);
    if (!entries) writes.set(node, entries = new Map());
    if (!entries.has(property)) entries.set(property, { before:node.style.getPropertyValue(property), priority:node.style.getPropertyPriority(property), last:null, lastPriority:null });
    node.style.setProperty(property, value);
    entries.get(property).last = node.style.getPropertyValue(property);
    entries.get(property).lastPriority = node.style.getPropertyPriority(property);
    rememberAttributes(node);
  }
  function cardClass(node, wanted) {
    if (node.classList.contains('card') === wanted) return;
    let entries = writes.get(node);
    if (!entries) writes.set(node, entries = new Map());
    if (!entries.has('@card')) entries.set('@card', { before:node.classList.contains('card'), last:null });
    node.classList.toggle('card', wanted); entries.get('@card').last = wanted;
    rememberAttributes(node);
  }
  function rememberAttributes(node) {
    ownAttributes.set(node, { style:node.getAttribute('style'), class:node.getAttribute('class') });
  }
  function restore(node, entries) {
    for (const [property, entry] of entries) {
      if (property === '@card') {
        if (node.classList.contains('card') === entry.last) node.classList.toggle('card', entry.before);
      } else if (node.style.getPropertyValue(property) === entry.last && node.style.getPropertyPriority(property) === entry.lastPriority) {
        if (entry.before) node.style.setProperty(property, entry.before, entry.priority);
        else node.style.removeProperty(property);
      }
    }
  }
  function releaseOldNodes(nodes) {
    const live = new Set(nodes);
    for (const [node, entries] of writes) if (!live.has(node)) {
      restore(node, entries); writes.delete(node); ownAttributes.delete(node);
    }
  }
  function styles(node, values) { for (const [property,value] of Object.entries(values)) write(node,property,value); }
  function pixel(value) { return Number(value.toFixed(3)) + 'px'; }
  function absoluteAt(node, x, y) {
    const parent = node.offsetParent;
    const r = parent ? parent.getBoundingClientRect() : { left:0, top:0 };
    const left = parent ? r.left + (parent.clientLeft || 0) - (parent.scrollLeft || 0) : -(window.scrollX || 0);
    const top = parent ? r.top + (parent.clientTop || 0) - (parent.scrollTop || 0) : -(window.scrollY || 0);
    write(node,'left',pixel(x-left)); write(node,'top',pixel(y-top));
  }

  function visible(node) {
    for (let at = node; at; at = at.parentElement) {
      const css = getComputedStyle(at);
      if (css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) === 0) return false;
      if (at === scope) break;
    }
    return true;
  }

  function rect(node, code) {
    if (!visible(node)) throw code + '-hidden';
    const r = node.getBoundingClientRect();
    if (![r.left, r.top, r.width, r.height].every(Number.isFinite) || r.width <= 0 || r.height <= 0) throw code + '-empty';
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  // 与实际collector同口径：可见文字Range各行内缩1px，不以缺Range的mock冒避字证据。
  function textObstacles(page) {
    if (!document.createTreeWalker || !document.createRange) throw 'route-measurement-unavailable';
    const walker = document.createTreeWalker(page, 4);
    const range = document.createRange(), boxes = [];
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || !String(node.nodeValue || '').trim() || ownGraphic(parent) || !visible(parent)) continue;
      if (/^(SCRIPT|STYLE)$/i.test(parent.tagName || parent.tag || '')) continue;
      const css = getComputedStyle(parent);
      if (css.color === 'transparent' || /rgba\([^)]*,\s*0\s*\)/.test(css.color || '')) continue;
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (![r.left,r.top,r.width,r.height].every(Number.isFinite)) throw 'route-range-invalid';
        if (r.width > 2 && r.height > 2) boxes.push({ left:r.left+1, top:r.top+1, right:r.left+r.width-1, bottom:r.top+r.height-1 });
      }
    }
    if (!boxes.length) throw 'route-measurement-empty';
    return boxes;
  }

  function intersects(a, b, r) {
    if (Math.abs(a.x-b.x) < 1e-7)
      return a.x >= r.left && a.x <= r.right && Math.max(a.y,b.y) >= r.top && Math.min(a.y,b.y) <= r.bottom;
    if (Math.abs(a.y-b.y) < 1e-7)
      return a.y >= r.top && a.y <= r.bottom && Math.max(a.x,b.x) >= r.left && Math.min(a.x,b.x) <= r.right;
    throw 'route-segment-unsupported';
  }

  function safe(points, base, obstacles) {
    if (points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<base.left||p.x>base.left+base.width||p.y<base.top||p.y>base.top+base.height)) return false;
    for (let i=1;i<points.length;i++) if (obstacles.some(r=>intersects(points[i-1],points[i],r))) return false;
    return true;
  }

  // 横版只走主卡底至原标签顶的局部空带；不再提供整页外轨兜底。
  function routesTouch(points, prior) {
    for (let i=1;i<prior.length;i++) {
      const a=prior[i-1], b=prior[i];
      const r={left:Math.min(a.x,b.x),right:Math.max(a.x,b.x),top:Math.min(a.y,b.y),bottom:Math.max(a.y,b.y)};
      for (let j=1;j<points.length;j++) if(intersects(points[j-1],points[j],r))return true;
    }
    return false;
  }

  function route(a, b, pair, base, obstacles, priorRoutes) {
    const available=points=>safe(points,base,obstacles)&&!priorRoutes.some(prior=>routesTouch(points,prior));
    const vertical = pair.direction === 'vertical';
    if (!vertical && pair.direction !== 'horizontal') throw 'route-direction-unsupported';
    if(!vertical){
      const start={x:a.left+a.width/2,y:a.top};
      const fraction=pair.step===3?(pair.ordinal===2?1/3:2/3):1/2;
      const end={x:b.left+b.width*fraction,y:b.top+b.height};
      if(start.y<=end.y+2)throw 'route-local-gap';
      const directEnd={x:start.x,y:end.y};
      if(Math.abs(start.x-end.x)<0.05&&available([start,directEnd]))return [start,directEnd];
      for(const level of [0.5,0.35,0.65,0.2,0.8]){
        const y=end.y+(start.y-end.y)*level;
        const points=[start,{x:start.x,y},{x:end.x,y},end];
        if(available(points))return points;
      }
      throw 'route-no-safe-candidate';
    }
    for (const side of ['right','left']) {
      const start={x:side==='right'?a.left+a.width:a.left,y:a.top+a.height/2};
      // 同一步的多个例外用反向次序分配边缘端口；外轨包住内轨，不共终点。
      const fraction=(pair.targetCount-pair.targetOrdinal)/(pair.targetCount+1);
      const end={x:side==='right'?b.left+b.width:b.left,y:b.top+b.height*fraction};
      for (let attempt=0;attempt<5;attempt++) {
        const offset=2+((4-pair.ordinal+attempt)%5)*3;
        const rail=side==='right'?base.left+base.width-offset:base.left+offset;
        const points=[start,{x:rail,y:start.y},{x:rail,y:end.y},end];
        if (available(points)) return points;
      }
    }
    throw 'route-no-safe-candidate';
  }

  function synchronize(nodes) {
    const next = new Set(nodes);
    for (const node of observed) if (!next.has(node)) resizeObserver.unobserve(node);
    for (const node of next) if (!observed.has(node)) resizeObserver.observe(node);
    observed = next;
  }

  function chooseScope() {
    const local = originalScript?.closest?.('#page');
    if (local?.isConnected) return local;
    const pages = Array.from(document.querySelectorAll('#page'));
    if (pages.length !== 1) throw pages.length ? 'scope-ambiguous' : 'scope-missing';
    return pages[0];
  }

  function ensureLayer(page) {
    if (!svg) {
      svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'step-port-prototype-lines');
      svg.setAttribute('aria-hidden', 'true');
      svg.dataset.incomplete = '工程10布局、保字、切口或避字线路尚未全部通过';
      // 固定视口层按#page实际外框定位，不修改#page定位样式或任何原文字节点。
      Object.assign(svg.style, { position: 'fixed', overflow: 'visible', pointerEvents: 'none', zIndex: '1' });
    }
    if (svg.parentElement !== page) page.append(svg);
  }

  function readPairs(page) {
    const sources = Array.from(page.querySelectorAll(sourceSelector));
    if (sources.length !== 5) throw 'source-count';
    const flows = Array.from(page.querySelectorAll(flowSelector));
    if (flows.length !== 1) throw flows.length ? 'flow-ambiguous' : 'flow-missing';
    const flow = flows[0], items = Array.from(flow.querySelectorAll('.sequence-item-flow[data-index]'));
    if (items.length !== 5) throw 'step-count';
    const cards = new Map();
    for (let index = 0; index < 5; index++) {
      const match = items.filter(item => item.dataset.index === String(index));
      if (match.length !== 1) throw 'step-index-ambiguous';
      const item = match[0], number = Array.from(item.querySelectorAll('.dg-number'));
      if (number.length !== 1) throw number.length ? 'step-number-ambiguous' : 'step-number-missing';
      if (!visible(number[0]) || number[0].innerText.trim() !== String(index + 1)) throw 'step-number-mismatch';
      const target = Array.from(item.querySelectorAll('.sequence-card'));
      if (target.length !== 1) throw target.length ? 'step-card-ambiguous' : 'step-card-missing';
      cards.set(index + 1, target[0]);
    }
    const pairs=sources.map((source, ordinal) => {
      if(!visible(source))throw 'source-hidden';
      const raw = source.dataset.target;
      if (raw !== String(expected[ordinal])) throw 'source-target-mismatch';
      const prefix = /^\s*第\s*(\d+)\s*步/.exec(source.innerText);
      if (!prefix || Number(prefix[1]) !== Number(raw)) throw 'source-number-mismatch';
      return { source, target: cards.get(Number(raw)), item:items.find(item=>item.dataset.index===String(Number(raw)-1)), flow, step: Number(raw), ordinal, direction:flow.dataset.direction };
    });
    for(const pair of pairs){const group=pairs.filter(p=>p.target===pair.target);pair.targetCount=group.length;pair.targetOrdinal=group.indexOf(pair);}
    return pairs;
  }

  function layout(page,pairs) {
    const flow=pairs[0].flow, vertical=pairs[0].direction==='vertical';
    if(!vertical && pairs[0].direction!=='horizontal')throw 'layout-direction';
    const roots=Array.from(page.querySelectorAll('[data-comp="points_card"]'));
    if(roots.length!==1)throw 'layout-points-root';
    const root=roots[0], section=pairs[0].source.closest('.ct-points-card');
    const heads=Array.from(root.querySelectorAll('.ct-card-head'));
    const lists=Array.from(root.querySelectorAll('.ct-list'));
    const chains=Array.from(flow.querySelectorAll('.sequence-chain'));
    if(!section||heads.length!==1||lists.length!==1||chains.length!==1)throw 'layout-structure';
    const head=heads[0], chain=chains[0], items=Array.from(flow.querySelectorAll('.sequence-item-flow[data-index]'));
    const wrappers=[root,section,...Array.from(root.querySelectorAll('.ct-card-body, .ct-point-copy, .ct-list'))];
    const live=[...wrappers,flow,chain,head,...pairs.map(p=>p.source),...items,...items.flatMap(i=>Array.from(i.querySelectorAll('.sequence-card'))),...(marker?[marker]:[])];
    releaseOldNodes(live);
    cardClass(section,false);
    styles(root,{position:'absolute',left:'0px',top:'0px',width:'100%',height:'0px',margin:'0px',padding:'0px',display:'block'});
    for(const node of wrappers.slice(1))styles(node,{position:'static',display:'block',height:'0px',margin:'0px',padding:'0px',border:'0px',background:'none','box-shadow':'none',overflow:'visible'});
    styles(head,{position:'absolute',margin:'0px',padding:'0px',border:'0px',background:'none','box-sizing':'border-box',height:'auto'});
    for(const pair of pairs){cardClass(pair.source,true);styles(pair.source,{position:'absolute',display:'block','list-style':'none',margin:'0px',padding:'0.35em 0.45em',border:'2px solid var(--line)','border-radius':'var(--radius)',background:'var(--card-bg, var(--cardbg))','box-shadow':'var(--card-shadow, none)','box-sizing':'border-box',height:'auto','max-width':'none'});}
    const css=getComputedStyle(chain), flowBox=rect(flow,'flow');
    const parsedGap=parseFloat(css.rowGap||css.gap), gap=Number.isFinite(parsedGap)&&parsedGap>0?parsedGap:16;
    write(head,'width',pixel(flowBox.width));
    if(vertical){
      write(flow,'padding-bottom','0px');
      for(const item of items) {
        const card=item.querySelectorAll('.sequence-card')[0];
        write(card,'flex','none');
      }
    } else {
      // 横版维持原五列共享的等高主卡，仅在flow尾部扩出标题、标签和线路空间。
      for(const item of items){write(item,'min-height','0px');write(item.querySelectorAll('.sequence-card')[0],'flex','1');}
    }
    for(const pair of pairs){
      const b=rect(pair.target,'target');
      const width=vertical?b.width-gap*2:b.width;
      if(width<=0)throw 'layout-source-width';
      write(pair.source,'width',pixel(width));
    }
    const heights=pairs.map(p=>{
      if(vertical)return rect(p.source,'source').height;
      const css=getComputedStyle(p.source), width=rect(p.source,'source').width;
      const key=[width,p.source.innerText,css.fontFamily,css.fontSize,css.fontWeight,css.lineHeight,css.letterSpacing,fontRevision].join('|');
      const previous=horizontalNaturalHeights.get(p.source);
      if(previous?.key===key)return previous.height;
      write(p.source,'min-height','0px');
      const height=rect(p.source,'source').height;
      horizontalNaturalHeights.set(p.source,{key,height});return height;
    }), headHeight=rect(head,'heading').height;
    let cut=null;
    if(vertical){
      for(const item of items){
        const card=item.querySelectorAll('.sequence-card')[0], cardBox=rect(card,'target'), itemBox=rect(item,'item');
        const attached=pairs.filter(p=>p.item===item), step=Number(item.dataset.index)+1;
        let extra=attached.length?gap+attached.reduce((s,p)=>s+heights[p.ordinal],0)+(attached.length-1)*gap:0;
        if(step===1)extra+=headHeight+gap;
        if(step===3)extra+=gap*2;
        write(item,'min-height',pixel(cardBox.top-itemBox.top+cardBox.height+extra));
      }
      for(const item of items){
        const cardBox=rect(item.querySelectorAll('.sequence-card')[0],'target');
        let y=cardBox.top+cardBox.height+gap;
        if(item.dataset.index==='0'){absoluteAt(head,cardBox.left,y);y+=headHeight+gap;}
        for(const pair of pairs.filter(p=>p.item===item)){
          absoluteAt(pair.source,cardBox.left+gap,y);y+=heights[pair.ordinal]+gap;
        }
      }
      const third=items.find(i=>i.dataset.index==='2'), fourth=items.find(i=>i.dataset.index==='3');
      // 第3步后的真实分张点两侧不保留脱离上游的主链箭头。
      write(third,'--sequence-forward-connector-content','none');
      const attached=pairs.filter(p=>p.step===3).map(p=>rect(p.source,'source'));
      const contentBottom=Math.max(...attached.map(r=>r.top+r.height),rect(third.querySelectorAll('.sequence-card')[0],'target').top+rect(third.querySelectorAll('.sequence-card')[0],'target').height);
      const itemBox=rect(third,'item'), fourthBox=rect(fourth.querySelectorAll('.sequence-card')[0],'target');
      cut=(contentBottom+itemBox.top+itemBox.height)/2;
      if(cut<=contentBottom+2||cut>=itemBox.top+itemBox.height-2||cut>=fourthBox.top-2)throw 'layout-cut-gap';
      if(!marker){marker=document.createElement('div');marker.setAttribute('data-page-break','true');marker.setAttribute('data-step-ports-cut','step-3');marker.setAttribute('aria-hidden','true');styles(marker,{position:'absolute',width:'0px',height:'0px','pointer-events':'none'});root.append(marker);}
      else if(marker.parentElement!==root)root.append(marker);
      absoluteAt(marker,flowBox.left,cut);
    } else {
      marker?.remove(); marker=null;
      const boxes=items.map(i=>rect(i.querySelectorAll('.sequence-card')[0],'target'));
      const cardBottom=Math.max(...boxes.map(r=>r.top+r.height));
      const titleY=cardBottom+gap*2;
      absoluteAt(head,flowBox.left,titleY);
      const labelTop=titleY+headHeight+gap, commonHeight=Math.max(...heights);
      for(const pair of pairs){const b=rect(pair.target,'target');const left=pair.ordinal===3?rect(items.find(i=>i.dataset.index==='3').querySelectorAll('.sequence-card')[0],'target').left:b.left;write(pair.source,'min-height',pixel(commonHeight));absoluteAt(pair.source,left,labelTop);}
      const bottom=labelTop+commonHeight;
      const originalContentBottom=Math.max(...items.map(i=>{const b=rect(i,'item');return b.top+b.height;}));
      write(flow,'padding-bottom',pixel(bottom-originalContentBottom+gap));
    }
    synchronize([page,flow,chain,head,...pairs.map(p=>p.source),...items,...items.flatMap(i=>Array.from(i.querySelectorAll('.sequence-card'))),...items.flatMap(i=>Array.from(i.querySelectorAll('.dg-number')))]);
    const boxes=pairs.map(p=>({...p,a:rect(p.source,'source'),b:rect(p.target,'target')}));
    const currentPage=rect(page,'scope');
    const heading=rect(head,'heading');
    for(const r of [...boxes.flatMap(p=>[p.a,p.b]),heading])if(r.left<currentPage.left-1||r.left+r.width>currentPage.left+currentPage.width+1||r.top<currentPage.top-1||r.top+r.height>currentPage.top+currentPage.height+1)throw 'layout-outside-page';
    for(const pair of boxes)if(pair.a.top<pair.b.top+pair.b.height-1)throw 'layout-source-not-below';
    for(const pair of boxes)for(const item of items){const r=rect(item.querySelectorAll('.sequence-card')[0],'target');if(Math.min(pair.a.left+pair.a.width,r.left+r.width)>Math.max(pair.a.left,r.left)+1&&Math.min(pair.a.top+pair.a.height,r.top+r.height)>Math.max(pair.a.top,r.top)+1)throw 'layout-source-card-overlap';}
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
      const a=boxes[i].a,b=boxes[j].a;if(Math.min(a.left+a.width,b.left+b.width)>Math.max(a.left,b.left)+1&&Math.min(a.top+a.height,b.top+b.height)>Math.max(a.top,b.top)+1)throw 'layout-labels-overlap';
    }
    if(!vertical&&Math.max(...boxes.map(p=>p.a.top+p.a.height))-Math.min(...boxes.map(p=>p.a.top+p.a.height))>1)throw 'layout-bottom-alignment';
    if(!vertical&&Math.max(...boxes.map(p=>p.a.height))-Math.min(...boxes.map(p=>p.a.height))>1)throw 'layout-label-height';
    if(cut!==null)for(const card of page.querySelectorAll('.card')){const b=rect(card,'card');if(b.top<cut-1&&b.top+b.height>cut+1)throw 'layout-cut-card';}
    if(cut!==null&&page.querySelectorAll('[data-page-break]').length!==1)throw 'layout-cut-ambiguous';
    return {boxes,cut};
  }

  function refresh() {
    if (closed || refreshing) return;
    refreshing=true;
    state.revision++;
    try {
      const page = chooseScope();
      if (scope !== page) {
        scope = page; synchronize([scope]); ensureLayer(scope);
      }
      ensureLayer(scope);
      bindRootReceipt(scope);
      const pairs = readPairs(scope), arranged=layout(scope,pairs), base = rect(scope, 'scope'), obstacles = textObstacles(scope);
      const measured = arranged.boxes.map(pair => {
        const {a,b}=pair;
        if (Math.min(a.left + a.width, b.left + b.width) > Math.max(a.left, b.left) &&
            Math.min(a.top + a.height, b.top + b.height) > Math.max(a.top, b.top)) throw 'ports-overlap';
        return { ...pair, a, b };
      });
      const geometry=[];
      for(const pair of measured)geometry.push({...pair,points:route(pair.a,pair.b,pair,base,obstacles,geometry.map(line=>line.points))});
      if(arranged.cut!==null)for(const line of geometry)for(let i=1;i<line.points.length;i++)if(Math.min(line.points[i-1].y,line.points[i].y)<arranged.cut&&Math.max(line.points[i-1].y,line.points[i].y)>arranged.cut)throw 'route-crosses-cut';
      svg.replaceChildren();
      Object.assign(svg.style, { left: base.left + 'px', top: base.top + 'px', width: base.width + 'px', height: base.height + 'px' });
      svg.setAttribute('viewBox', `0 0 ${base.width} ${base.height}`);
      for (const line of geometry) {
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('data-line-id', 'exception-' + line.ordinal);
        path.setAttribute('data-source-ordinal', String(line.ordinal));
        path.setAttribute('data-target-step', String(line.step));
        path.setAttribute('d',line.points.map((p,index)=>`${index?'L':'M'} ${p.x-base.left} ${p.y-base.top}`).join(' '));
        path.setAttribute('data-route',line.direction==='horizontal'?'local-target-label-range-checked':'outside-gutter-range-checked');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'var(--accent)');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('stroke-dasharray', '5 5');
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        svg.append(path);
      }
      delete svg.dataset.overlayError;
      rootPending(false);
      delete svg.dataset.incomplete;
      svg.dataset.stepPortsState = 'layout-and-lines-ready';
      state.error = null; state.linesReady = true; state.layoutPending=false; state.lineCount = 5;
      state.cutY=arranged.cut;state.direction=pairs[0].direction;
    } catch (error) {
      failure(typeof error === 'string' ? error : 'runtime-error');
    } finally {
      refreshing=false;
    }
  }

  function ownGraphic(node) {
    return node === marker || node === svg || node?.closest?.('svg') != null || node?.parentElement?.closest?.('svg') != null;
  }
  const resizeObserver = new ResizeObserver(refresh);
  const mutationObserver = new MutationObserver(records => {
    if (records.some(record => {
      if (ownGraphic(record.target)) return false;
      if(record.type==='attributes' && [pendingAttribute,'data-incomplete'].includes(record.attributeName)){
        const own=ownPendingAttributes.get(record.target);
        if(own && Object.prototype.hasOwnProperty.call(own,record.attributeName) && record.target.getAttribute(record.attributeName)===own[record.attributeName])return false;
      }
      if(record.type==='attributes' && ['style','class'].includes(record.attributeName)){
        const last=ownAttributes.get(record.target);
        if(last && record.target.getAttribute(record.attributeName)===last[record.attributeName])return false;
      }
      if (record.type === 'childList') {
        const changed = [...record.addedNodes, ...record.removedNodes];
        if (changed.length && changed.every(ownGraphic)) return false;
      }
      return true;
    })) refresh();
  });

  function disconnect() {
    if (closed) return;
    closed = true; resizeObserver.disconnect(); mutationObserver.disconnect(); observed.clear();
    rootPending(true);rootReceipt=null;
    window.removeEventListener('resize', refresh);
    window.removeEventListener('scroll', refresh, true);
    document.removeEventListener('load', refresh, true);
    document.removeEventListener('DOMContentLoaded', refresh);
    document.fonts?.removeEventListener?.('loadingdone', fontRefresh);
    if (svg) { svg.replaceChildren(); svg.remove(); }
    marker?.remove();marker=null;
    for(const [node,entries]of writes)restore(node,entries);
    writes.clear();ownAttributes.clear();
    state.error = null; state.linesReady = false; state.layoutPending=true; state.lineCount = 0;state.cutY=null;state.direction=null;
  }

  function fontRefresh(){fontRevision++;refresh();}

  mutationObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData:true,
    attributeFilter: ['class', 'style', 'data-target', 'data-index', 'data-direction', 'data-orient', pendingAttribute, 'data-incomplete'] });
  window.addEventListener('resize', refresh);
  window.addEventListener('scroll', refresh, true);
  document.addEventListener('load', refresh, true);
  document.fonts?.addEventListener?.('loadingdone', fontRefresh);
  document.fonts?.ready.then(fontRefresh);
  window.__engineeringStepPortsPrototype = { refresh, disconnect, getStatus: () => ({ ...state }) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
  else refresh();
})();

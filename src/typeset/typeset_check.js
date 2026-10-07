// 独立浏览器排版检查。page.evaluate(本文件) 返回结果，并安装 TypesetChecks。
// 修排版时复用 TypesetChecks.collectTextBlocks / measureTextBlock，勿复制候选逻辑。
(() => {
  'use strict';
  const VERSION = 'typeset-dom-v4';
  const IGNORE = 'script,style,noscript,template,svg,[aria-hidden="true"],.deco,.ghost,[data-typeset-ignore]';
  const LABELS = 'label,strong,b,th,dt,[data-typeset-label],[data-role="label"],[data-role="field_name"],[data-table-header="true"],.table-label,.nowlabel,.livename,.ct-dialogue-label,.ct-point-label,.ct-action-entry-label,.mock-source-label,.hub-field-label,.hub-stat-name,.hub-stat-label,.hub-number-label,.stat .name,.legend-item,.ct-tag,.ct-point-corner-tag,.feature-maintenance-label,.c-slot-live-maintenance-label,.hub-directory-flow-label';
  const CARDS = '.card,[data-typeset-card]';
  const segmenter = new Intl.Segmenter('zh-CN', {granularity: 'grapheme'});
  const useful = s => !/^[\s\u200b-\u200f\ufeff]*$/u.test(s);
  const chars = s => [...segmenter.segment(s)].filter(p => useful(p.segment)).length;
  const round = x => Math.round(x * 100) / 100;
  const rect = r => ({x: round(r.left + scrollX), y: round(r.top + scrollY), w: round(r.width), h: round(r.height)});
  const median = ns => { const s = ns.slice().sort((a,b) => a-b); return s[Math.floor(s.length/2)]; };
  const cssCache = new Map();
  const css = e => { if (!cssCache.has(e)) cssCache.set(e, getComputedStyle(e)); return cssCache.get(e); };
  const alphaZero = color => color === 'transparent' || /(?:rgba|hsla)\([^)]*,\s*0(?:\.0+)?\s*\)$/.test(color) || /\/\s*0(?:\.0+)?\s*\)$/.test(color);
  function visible(e, root) {
    if (!e || e.closest(IGNORE)) return false;
    for (let a=e; a; a=a.parentElement) {
      const s = css(a);
      if (s.display === 'none' || s.visibility === 'hidden' || s.visibility === 'collapse' || Number(s.opacity) === 0 || s.contentVisibility === 'hidden') return false;
      if (a === root) break;
    }
    const s = css(e), r = e.getBoundingClientRect();
    if (parseFloat(s.fontSize) === 0 || alphaZero(s.color) || alphaZero(s.webkitTextFillColor)) return false;
    if (r.width <= 0 || r.height <= 0) return false;
    // 常见无障碍辅助字被压在 1px 裁剪框内，不是页面上的可见文字。
    if (r.width <= 2 && r.height <= 2 && (s.overflow === 'hidden' || s.clip !== 'auto' || s.clipPath !== 'none')) return false;
    const q = root.getBoundingClientRect();
    return r.right > q.left && r.left < q.right && r.bottom > q.top && r.top < q.bottom;
  }
  function selector(e, root) {
    if (e===root) return root.id ? '#'+CSS.escape(root.id) : root.localName;
    if (e.id) return '#' + CSS.escape(e.id);
    const parts = [];
    for (let a=e; a && a!==root; a=a.parentElement) {
      let part = a.localName;
      const classes = [...a.classList].filter(c => !/^o-[hv]$/.test(c)).slice(0,3);
      if (classes.length) part += '.' + classes.map(c => CSS.escape(c)).join('.');
      if (a.parentElement) part += ':nth-child(' + ([...a.parentElement.children].indexOf(a)+1) + ')';
      parts.unshift(part);
    }
    return (root.id ? '#'+CSS.escape(root.id) : root.localName) + ' > ' + parts.join(' > ');
  }
  function ownerOf(node, root) {
    for (let e=node.parentElement; e && e!==root; e=e.parentElement) {
      const d = css(e).display;
      // 真正的行内链接/strong/span 随段落量；独立 inline-block/flex/grid 盒各自量。
      if (d === 'contents' || d === 'inline') continue;
      return e;
    }
    return root;
  }
  function textNodes(e, root=e) {
    const out=[], walker=document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    let n;
    while ((n=walker.nextNode())) if (useful(n.data) && visible(n.parentElement,root)) out.push(n);
    return out;
  }
  function collectTextBlocks(root=document.querySelector('#page') || document.body) {
    cssCache.clear();
    const byOwner = new Map();
    for (const n of textNodes(root,root)) {
      const e = ownerOf(n,root);
      if (!byOwner.has(e)) byOwner.set(e,[]);
      byOwner.get(e).push(n);
    }
    // 有自身正文的段落/表格单元格，行内原子盒仍是整段可见内容的一部分。
    // 盒自身保留独立候选；只含并排盒、没有正文的父容器不合并成段。
    for (const element of byOwner.keys()) {
      if (!element.matches('p,li,td,th,dt,dd')) continue;
      byOwner.set(element,textNodes(element,root).filter(n=>{
        const chain=[];
        for (let e=n.parentElement;e && e!==element;e=e.parentElement) chain.unshift(e);
        for (const e of chain) {
          const display=css(e).display;
          if (display==='inline' || display==='contents') continue;
          if (/^inline-(block|flex|grid)$/.test(display)) return true;
          return false;
        }
        return true;
      }));
    }
    return [...byOwner].map(([element,nodes]) => ({element,nodes,isPre:!!element.closest('pre'),selector:selector(element,root)}));
  }
  function measureTextBlock(block) {
    const rows=[], range=document.createRange();
    let text='';
    for (const n of block.nodes) {
      text += n.data;
      for (const p of segmenter.segment(n.data)) {
        if (!useful(p.segment)) continue;
        range.setStart(n,p.index); range.setEnd(n,p.index+p.segment.length);
        const r = [...range.getClientRects()].find(q => q.width>0.05 && q.height>0.05);
        if (!r) continue;
        // 以实际字框垂直重合归行；行内字号/加粗差异不会变成另一行。
        let row = rows.find(a => Math.min(a.bottom,r.bottom)-Math.max(a.top,r.top) > Math.min(a.bottom-a.top,r.height)*0.5);
        if (!row) { row={top:r.top,bottom:r.bottom,left:r.left,right:r.right,text:'',chars:0}; rows.push(row); }
        row.top=Math.min(row.top,r.top); row.bottom=Math.max(row.bottom,r.bottom);
        row.left=Math.min(row.left,r.left); row.right=Math.max(row.right,r.right);
        row.text += p.segment; row.chars += 1;
      }
    }
    rows.sort((a,b)=>a.top-b.top || a.left-b.left);
    return {text:text.trim(),chars:chars(text),lines:rows.map(a=>({text:a.text,chars:a.chars,rect:rect({left:a.left,top:a.top,width:a.right-a.left,height:a.bottom-a.top})}))};
  }
  function lineHeight(e) { const s=css(e), n=parseFloat(s.lineHeight); return n>0 ? n : parseFloat(s.fontSize)*1.2; }
  function collectLabels(root=document.querySelector('#page') || document.body) {
    const out=[];
    for (const element of root.querySelectorAll(LABELS)) {
      if (!visible(element,root) || element.closest('pre')) continue;
      const nodes=textNodes(element,root), text=nodes.map(n=>n.data).join('').trim(), length=chars(text);
      if (length<1 || length>24) continue;
      if (element.matches('strong,b') && !element.matches('[data-typeset-label]')) {
        const owner=ownerOf(nodes[0],root), before=document.createRange();
        before.selectNodeContents(owner);
        if (owner!==element && owner.contains(element)) before.setEndBefore(element);
        else before.setEnd(owner,0);
        const leading=chars(before.toString())===0;
        const colon=/[：:]\s*$/.test(text) || /^[\s　]*[：:]/.test(element.nextSibling?.textContent || '');
        if (!leading || (!colon && !element.matches('.hub-directory-flow-label,.stat .name,[data-role="label"],[data-role="field_name"]'))) continue;
      }
      if (out.some(a=>a.element.contains(element) && a.text===text)) continue;
      out.push({element,nodes,text,selector:selector(element,root)});
    }
    return out;
  }
  function labelMetrics(label,root) {
    const element=label.element,s=css(element),clone=element.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.cssText='position:absolute;left:-100000px;top:0;display:inline-block;width:max-content;min-width:0;max-width:none;height:auto;white-space:nowrap;visibility:hidden;';
    for (const name of ['fontFamily','fontSize','fontWeight','fontStyle','fontStretch','fontFeatureSettings','fontVariationSettings','letterSpacing','wordSpacing','lineHeight']) clone.style[name]=s[name];
    for (const child of clone.querySelectorAll('*')) { child.removeAttribute('id');child.style.whiteSpace='nowrap';child.style.display='inline'; }
    document.body.appendChild(clone);
    const r=document.createRange();r.selectNodeContents(clone);const width=r.getBoundingClientRect().width;clone.remove();
    const field=element.closest('.table-field,.feature-field,[data-typeset-field]') || element.parentElement;
    const contentWidth=e=>{const q=css(e);return e.clientWidth-parseFloat(q.paddingLeft)-parseFloat(q.paddingRight);};
    return {natural_width:round(width),parent_content_width:round(contentWidth(element.parentElement)),field_content_width:round(contentWidth(field)),field_selector:selector(field,root),needs_own_line:width>contentWidth(element.parentElement)+1};
  }
  function cardLineHeight(e,root) {
    const bodies=[...e.querySelectorAll('.body,.prose,[data-role="body"],p,li')].filter(n=>visible(n,root));
    return median((bodies.length?bodies:[e]).map(lineHeight));
  }
  function horizontalOwner(card,root,cards) {
    for (let e=card.parentElement;e && root.contains(e);e=e.parentElement) {
      const s=css(e);
      if (!(s.display.includes('grid') || (s.display.includes('flex') && !s.flexDirection.startsWith('column')))) continue;
      const branches=[...e.children].filter(n=>cards.some(c=>c===n || n.contains(c)));
      if (branches.length<2) continue;
      const r=card.getBoundingClientRect();
      if (branches.some(n=>!n.contains(card) && !card.contains(n) && n.getBoundingClientRect().left>=r.right-2) ||
          branches.some(n=>!n.contains(card) && !card.contains(n) && n.getBoundingClientRect().right<=r.left+2)) return e;
    }
    return null;
  }
  function compoundSequenceRow(element) {
    const row=element.closest('.sequence-row');
    if (!row) return null;
    const items=[...row.children].filter(e=>e.matches('.sequence-item'));
    return items.length>1 && items.some(e=>e.querySelector('.sequence-main-and-branch')) ? row : null;
  }
  function cardObjects(root) {
    const out=new Set();
    for (const card of root.querySelectorAll(CARDS)) {
      if (!visible(card,root)) continue;
      const row=compoundSequenceRow(card);
      if (row) {
        // 同排有复合节点时，所有节点均用完整item量，内部主卡与分支不跨配。
        for (const item of row.children) if (item.matches('.sequence-item') && visible(item,root)) out.add(item);
      } else out.add(card);
    }
    return [...out];
  }
  function componentOf(e) { return e.closest('[data-comp]'); }
  function shellRole(e) {
    if (e.matches('.sequence-item')) return 'sequence_item';
    for (const [role,sel] of [['sequence_card','.sequence-card'],['dialogue_frame','.ct-dialogue-frame'],['dialogue_bubble','.ct-bubble'],['points_card','.ct-points-card,.ct-point-card,.ct-point-item'],['content_card','.side'],['stat_card','.stat,.hub-stat-field'],['notice','.c-text-notice'],['table_card','.table-card']]) if (e.matches(sel)) return role;
    return 'generic_card';
  }
  function columnProfile(card,col) {
    const component=componentOf(card),comp=component?.dataset.comp || '',role=shellRole(card);
    const outerCards=[...col.querySelectorAll(CARDS)].filter(e=>e.closest('.col')===col && !e.parentElement.closest(CARDS)?.closest('.col')?.isSameNode(col));
    const first=outerCards[0],principal=first?componentOf(first)?.dataset.comp || '':comp;
    const modules=component?[...col.querySelectorAll('[data-comp]')].filter(e=>e.dataset.comp===comp && e.closest('.col')===col && ![...function*(x){while(x=x.parentElement){if(x===col)break;yield x}}(e)].some(a=>a.dataset.comp===comp)):[];
    const moduleIndex=component?modules.indexOf(component):0;
    const peers=component?[component,...component.querySelectorAll(CARDS)].filter(e=>e.matches(CARDS) && componentOf(e)===component && shellRole(e)===role):outerCards.filter(e=>shellRole(e)===role);
    const cardIndex=peers.indexOf(card);
    const nested=!!card.parentElement.closest(CARDS)?.closest('.col')?.isSameNode(col);
    return {component:comp,principal,role,module_index:moduleIndex,card_index:cardIndex,
            module_count:modules.length,card_count:peers.length,nested};
  }
  function classifyPeerRow(row,root=document.querySelector('#page') || document.body) {
    const parent=row.element || (row.selector?root.querySelector(row.selector):null);
    const cards=(row.cards || row.items || []).map(c=>c.element || c.e || (c.selector?root.querySelector(c.selector):null)).filter(Boolean);
    const independent=reason=>({logical_peer:false,reason});
    if (!parent || cards.length<2) return independent('unresolved_topology');
    if (parent.matches('[data-flow="independent_columns"],[data-flow="masonry"],.feature-masonry-grid')) return independent('explicit_independent_columns');
    // 显式等高行比较每栏的完整外卡，允许统计卡和说明卡使用不同组件。
    if (parent.matches('.row.eqh') && cards.every(c=>c.closest('.col')?.parentElement===parent)) {
      const columns=cards.map(c=>c.closest('.col'));
      if (new Set(columns).size===cards.length && cards.every((c,i)=>!c.parentElement.closest(CARDS)?.closest('.col')?.isSameNode(columns[i])))
        return {logical_peer:true,reason:'explicit_column_containers',measurement:'column_surface'};
    }
    // 明确同排等高优先；没有明确声明的原文栏仍各自往下续排。
    if (cards.some(c=>c.closest('[data-comp="source_text_card"],.source-prose'))) return independent('independent_source_columns');
    if (parent.matches('.sequence-timeline-columns') || cards.some(c=>c.closest('.sequence-timeline-columns')) && new Set(cards.map(c=>c.closest('.sequence-chain[data-axis="vertical"]'))).size>1) return independent('independent_timeline_columns');
    if (parent.matches('.sequence-main-and-branch') || cards.some(c=>c.closest('.sequence-main-and-branch')) && !parent.matches('.sequence-row')) return independent('independent_sequence_branches');
    if (parent.matches('.sequence-row') && compoundSequenceRow(cards[0])) {
      if (!cards.every(c=>c.matches('.sequence-item') && c.parentElement===parent)) return independent('requires_sequence_item_proxy');
      return {logical_peer:true,reason:'composite_sequence_items',measurement:'sequence_item'};
    }
    const cols=cards.map(c=>c.closest('.col'));
    const outerRows=cols.map(c=>c?.closest('.row'));
    const crossColumns=cols.every(Boolean) && new Set(cols).size>1 && outerRows.every(r=>r===parent);
    if (crossColumns) {
      if (cards.some(c=>c.closest('.sequence-chain[data-axis="vertical"]'))) return independent('independent_vertical_sequences');
      const profiles=cards.map((c,i)=>columnProfile(c,cols[i])),first=profiles[0];
      const result={column_profiles:profiles};
      if (profiles.some(p=>p.nested)) return {...result,...independent('nested_column_card_shells')};
      if (profiles.some(p=>p.principal!==p.component)) return {...result,...independent('auxiliary_column_components')};
      if (profiles.some(p=>p.component!==first.component || p.role!==first.role || p.principal!==first.principal)) return {...result,...independent('different_column_roles')};
      if (profiles.some(p=>p.module_count!==first.module_count || p.card_count!==first.card_count)) return {...result,...independent('independent_column_card_stacks')};
      if (profiles.some(p=>p.module_index!==first.module_index || p.card_index!==first.card_index || p.card_index<0)) return {...result,...independent('different_column_card_indices')};
      return {...result,logical_peer:true,reason:'matching_column_card_indices'};
    }
    return {logical_peer:true,reason:'shared_horizontal_container'};
  }
  function isPeerRow(row,root) { return classifyPeerRow(row,root).logical_peer; }
  function cardRows(root) {
    const cards=cardObjects(root);
    const groups=new Map();
    for (const e of cards) {
      const parent=horizontalOwner(e,root,cards);
      if (!parent) continue;
      if (!groups.has(parent)) groups.set(parent,[]);
      groups.get(parent).push(e);
    }
    const out=[];
    for (const [parent,items] of groups) {
      const rows=[];
      const surfaces=parent.matches('.row.eqh')?items.filter(e=>!items.some(a=>a!==e && a.contains(e))):items;
      for (const e of surfaces.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top || a.getBoundingClientRect().left-b.getBoundingClientRect().left)) {
        const r=e.getBoundingClientRect(), lh=cardLineHeight(e,root);
        const step=e.closest('.ct-point-step-unit');
        // 卡外插画高低不同，仍是同一横排的步骤，不能按卡顶把五步拆散。
        const sameSteps=a=>step && parent.matches('.row') && a.items.every(c=>c.e.closest('.ct-point-step-unit') && c.e.closest('.col')?.parentElement===parent) && e.closest('.col')?.parentElement===parent;
        const sameContainers=a=>parent.matches('.row.eqh') && e.closest('.col')?.parentElement===parent && a.items.every(c=>c.e.closest('.col')?.parentElement===parent);
        let row=rows.find(a=>(sameSteps(a) || sameContainers(a) || Math.abs(a.top-r.top)<=Math.max(3,Math.min(a.lh,lh)*0.5)) && a.items.every(c=>!c.e.contains(e) && !e.contains(c.e) && (c.r.right<=r.left+2 || r.right<=c.r.left+2)));
        if (!row) { row={top:r.top,lh,items:[]}; rows.push(row); }
        row.items.push({e,r,lh});
      }
      for (const row of rows) {
        if (row.items.length<2) continue;
        row.items.sort((a,b)=>a.r.left-b.r.left);
        const bottomAligned=parent.matches('.row.eqh') || row.items.every(c=>c.e.closest('.ct-point-step-unit'));
        const heights=row.items.map(c=>c.r.height), delta=Math.max(...heights)-Math.min(...heights), bottoms=row.items.map(c=>c.r.bottom), bottomDelta=Math.max(...bottoms)-Math.min(...bottoms), deviation=bottomAligned?bottomDelta:Math.max(delta,bottomDelta), threshold=Math.max(...row.items.map(c=>c.lh));
        const peer=classifyPeerRow({element:parent,items:row.items},root);
        out.push({selector:selector(parent,root),classification:deviation<=1?'equal':deviation>threshold+0.001?'uneven':'within_one_line',alignment:bottomAligned?'bottom':'height_and_bottom',height_delta:Math.round(delta*10000)/10000,bottom_delta:Math.round(bottomDelta*10000)/10000,line_height:Math.round(threshold*10000)/10000,...peer,cards:row.items.map(c=>({selector:selector(c.e,root),measurement_kind:c.e.matches('.sequence-item')?'sequence_item':'card',rect:rect(c.r),text:textNodes(c.e,root).map(n=>n.data).join('').trim()}))});
      }
    }
    return out;
  }
  function check(options={}) {
    options=options || {};
    const root=options.root || document.querySelector('#page') || document.body;
    const blocks=collectTextBlocks(root), orphans=[], wrapped=[], pre=[];
    for (const block of blocks) {
      const m=measureTextBlock(block);
      if (block.isPre) { pre.push({selector:block.selector,chars:m.chars}); continue; }
      if (m.chars>=6 && m.lines.length>1 && m.lines.at(-1).chars<3) orphans.push({selector:block.selector,rect:rect(block.element.getBoundingClientRect()),text:m.text,chars:m.chars,line_count:m.lines.length,last_line:m.lines.at(-1),lines:m.lines});
    }
    for (const label of collectLabels(root)) {
      const m=measureTextBlock(label);
      if (m.lines.length>1) wrapped.push({selector:label.selector,tag:label.element.localName,component:label.element.closest('[data-comp]')?.dataset.comp || '',rect:rect(label.element.getBoundingClientRect()),text:m.text,chars:m.chars,lines:m.lines,...labelMetrics(label,root)});
    }
    const rows=cardRows(root), uneven=rows.filter(r=>r.classification==='uneven' && r.logical_peer);
    return {version:VERSION,counts:{orphan_lines:orphans.length,uneven_card_rows:uneven.length,wrapped_labels:wrapped.length,text_blocks:blocks.length,card_rows:rows.length,logical_card_rows:rows.filter(r=>r.logical_peer).length,physical_uneven_card_rows:rows.filter(r=>r.classification==='uneven').length,independent_card_rows:rows.filter(r=>!r.logical_peer).length,independent_uneven_card_rows:rows.filter(r=>!r.logical_peer && r.classification==='uneven').length,equal_card_rows:rows.filter(r=>r.classification==='equal').length,within_one_line_card_rows:rows.filter(r=>r.classification==='within_one_line').length,excluded_pre_blocks:pre.length},orphan_lines:orphans,uneven_card_rows:uneven,wrapped_labels:wrapped,card_rows:rows,excluded_pre_blocks:pre};
  }
  globalThis.TypesetChecks={version:VERSION,collectTextBlocks,measureTextBlock,collectLabels,labelMetrics,cardRows,classifyPeerRow,isPeerRow,check};
  globalThis.TypesetCheck={...globalThis.TypesetChecks,audit:check,textBlocks:collectTextBlocks,lines:measureTextBlock};
  return check;
})()

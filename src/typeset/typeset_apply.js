// 集成原型。先执行 typeset_check.js；待 fonts.ready 与组件自身布局完成后 evaluate 本文件。
// 只用 checker 的真实候选和行测量，不另建排除标准；未能修的逐条记在 receipt.unresolved。
globalThis.TypesetApply = () => {
  'use strict';
  const C = globalThis.TypesetChecks;
  if (!C) throw new Error('typeset_apply 需要先加载 TypesetChecks');
  const root = document.querySelector('#page') || document.body;
  const receipt = {version:'typeset-apply-v3',labels:[],tails:[],widths:[],cards:[],unresolved:[]};
  const segmenter = new Intl.Segmenter('zh-CN',{granularity:'grapheme'});
  const useful = s => !/^[\s\u200b-\u200f\ufeff]*$/u.test(s);
  const short = m => m.chars >= 6 && m.lines.length > 1 && m.lines.at(-1).chars < 3;
  const protectedSelector = 'a,[data-hot],button,input,img,svg,[data-motion-region],[data-motion-icon-arrow],[data-motion-dots],[data-role="status-dot"],[data-motion-text]';
  const fixedSelector = '.mock-label-overlay,.dd-overlay-label,.ds-map-overlay,[data-typeset-fixed]';
  function keepLatinWords() {
    // 组件先处理原链接/按钮，再按真正的文字节点包整词；不解析 HTML 字符串或改动属性。
    for(const element of root.querySelectorAll('.tb,.mock-source-label')) {
      if(!/flex|grid/.test(getComputedStyle(element).display) || !/[A-Za-z]/.test(element.textContent))continue;
      if(![...element.childNodes].some(n=>n.nodeType===Node.TEXT_NODE && useful(n.data)))continue;
      const inlineTags=['WBR','BR','B','STRONG','EM','I','SPAN','CODE'];
      const functional='a,[data-hot],button,input,img,svg,[id],[data-motion-text],[data-role="status-dot"],[data-motion-region],[data-motion-icon-arrow],[data-motion-dots]';
      if([...element.children].some(c=>!inlineTags.includes(c.tagName)||c.matches(functional)||c.querySelector(functional)))continue;
      const owner=document.createElement('span');owner.dataset.typesetInlineText='true';owner.style.minWidth='0';
      owner.append(...element.childNodes);element.append(owner);
    }
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
    let node;
    while(node=walker.nextNode()) {
      if(!node.parentElement.closest('script,style,svg,.ghost,[data-typeset-word]') && /[A-Za-z]/.test(node.data)) nodes.push(node);
    }
    let count=0;
    const canvas=document.createElement('canvas').getContext('2d');
    for(const text of nodes) {
      const fragment=document.createDocumentFragment();let end=0;
      const parent=text.parentElement,style=getComputedStyle(parent);
      const textBox=parent.closest('.tb')||parent,boxStyle=getComputedStyle(textBox);
      const available=textBox.clientWidth-(parseFloat(boxStyle.paddingLeft)||0)-(parseFloat(boxStyle.paddingRight)||0);
      const inPath=!!parent.closest('code,.mono,pre') ||
        (text.previousSibling?.nodeName==='WBR' && /[/\\]/.test(parent.textContent)) || /[/\\]/.test(text.data);
      canvas.font=style.fontStyle+' '+style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
      for(const match of text.data.matchAll(/[A-Za-z][A-Za-z0-9]*(?:['’][A-Za-z0-9]+)*/g)) {
        if(match[0].length===1)continue;
        fragment.append(text.data.slice(end,match.index));
        // 长路径的驼峰目录标识符按完整英文词分界；名字/普通正文仍为整词单元。
        const parts=inPath && canvas.measureText(match[0]).width>available
          ? match[0].split(/(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/) : [match[0]];
        parts.forEach((word,i)=>{
          if(i)fragment.append(document.createElement('wbr'));
          const span=document.createElement('span');span.dataset.typesetWord='true';span.textContent=word;fragment.append(span);
        });
        end=match.index+match[0].length;count++;
      }
      fragment.append(text.data.slice(end));
      if(end && /flex|grid/.test(style.display)) {
        // 保持原匿名文字项为一个子项，避免固定图内column容器把前缀与词逐个排成多行。
        const owner=document.createElement('span');owner.dataset.typesetInlineText='true';owner.style.minWidth='0';owner.append(fragment);text.replaceWith(owner);
      } else text.replaceWith(fragment);
    }
    receipt.latin_words=count;
  }
  function constrained(el) {
    if (el.closest('pre,'+fixedSelector)) return 'pre或固定图内文字';
    for (let p=el;p && p!==root;p=p.parentElement) {
      if (['absolute','fixed'].includes(getComputedStyle(p).position)) return '文字依赖固定坐标';
    }
    return '';
  }
  function applyLabels() {
    C.collectTextBlocks(root); // 清 checker 的计算样式缓存。
    for (const card of root.querySelectorAll('.c-table[data-orient="v"] .table-card')) {
      const fields=[...card.querySelectorAll('.table-field')];
      const data=fields.map(field=>{
        const element=field.querySelector('.table-label');
        if (!element) return {field,element:null,width:0};
        const m=C.labelMetrics({element},root);
        return {field,element,width:m.natural_width};
      });
      const widest=Math.ceil(Math.max(0,...data.map(x=>x.width)));
      for (const {field,element,width} of data) {
        if (!element) continue;
        const s=getComputedStyle(field),available=field.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight);
        const fs=parseFloat(s.fontSize),gap=parseFloat(s.columnGap)||8;
        // 沿用原38%标签宽预算；超预算就让值用下一整行，避免长字段挤成六字窄值列。
        const below=widest>available*.38 || widest+gap+fs*6>available;
        element.style.whiteSpace='nowrap';element.style.overflowWrap='normal';element.style.wordBreak='normal';
        field.style.gridTemplateColumns=below?'minmax(0,1fr)':widest+'px minmax(0,1fr)';
        if (below) {
          field.style.rowGap='4px';
          for (const value of field.querySelectorAll(':scope > .table-cell')) value.style.gridColumn='1 / -1';
        }
        receipt.labels.push({text:element.textContent,width,available,value_below:below});
        if (width>available+1) receipt.unresolved.push({kind:'label',text:element.textContent,reason:'完整字段名仍宽于卡片；需增加字段容器宽度或调整该表呈现',width,available});
      }
    }
  }
  function tailRange(block) {
    const pieces=[];
    for (const node of block.nodes) for (const p of segmenter.segment(node.data)) {
      if (useful(p.segment)) pieces.push({node,start:p.index,end:p.index+p.segment.length});
    }
    if (pieces.length<4) return null;
    const a=pieces.at(-4),b=pieces.at(-1),range=document.createRange();
    range.setStart(a.node,a.start);range.setEnd(b.node,b.end);
    // 同一文本节点内包尾段不会克隆或拆分任何原链接/带ID元素。
    if (a.node===b.node && !a.node.parentElement.closest('[data-motion-text],[data-role="status-dot"]')) return range;
    // a/data-hot必须整体移动，绝不拆分或复制。首字符落在链接内时扩大到完整链接。
    for (const boundary of [a.node,b.node]) {
      // 整词span可能套在原链接或带ID元素内；保护完整祖先链，不能让最近span遮住外层原子。
      for (let atom=boundary.parentElement;atom && atom!==block.element;atom=atom.parentElement) {
        if (!atom.matches('a,[data-hot],button,[id],[data-typeset-word]')) continue;
        if (!block.element.contains(atom)) break;
        if (atom.contains(a.node)) range.setStartBefore(atom);
        if (atom.contains(b.node)) range.setEndAfter(atom);
      }
    }
    for (const atom of block.element.querySelectorAll(protectedSelector)) {
      if (!range.intersectsNode(atom)) continue;
      if (!atom.matches('a,[data-hot],button')) return null;
      const check=document.createRange();check.selectNode(atom);
      if (range.compareBoundaryPoints(Range.START_TO_START,check)>0 || range.compareBoundaryPoints(Range.END_TO_END,check)<0) return null;
    }
    return range;
  }
  function adjustWidth(block,before) {
    const el=block.element,style=getComputedStyle(el);
    if (!['block','list-item','table-cell'].includes(style.display) || el.querySelector('img,svg,[data-motion-text],[data-role="status-dot"]')) return false;
    const prior=el.style.paddingRight,padding=parseFloat(style.paddingRight)||0,fs=parseFloat(style.fontSize);
    // 跨节点尾段不能完整收拢时，微调正文右留白，避免拆链接或复制带ID节点。
    for (let quarter=1;quarter<=8;quarter++) {
      const extra=fs*quarter/4;
      if (el.clientWidth-padding-extra<fs*4) break;
      el.style.paddingRight=(padding+extra)+'px';
      const current=C.collectTextBlocks(root).find(x=>x.element===el);
      if (current) {
        const after=C.measureTextBlock(current);
        if (!short(after) && after.lines.length<=before.lines.length+1) {
          receipt.widths.push({selector:block.selector,padding_added:extra,before:before.lines.at(-1).text,after:after.lines.at(-1).text});
          return true;
        }
      }
    }
    el.style.paddingRight=prior;
    return false;
  }
  function applyText() {
    for (const block of C.collectTextBlocks(root)) {
      const reason=constrained(block.element);
      if (!block.isPre && !reason) block.element.style.textWrapStyle='pretty';
    }
    // 标签调整后再量。mono/路径照样参加；只是固定图内坐标与pre不强改。
    for (const block of C.collectTextBlocks(root)) {
      const before=C.measureTextBlock(block);
      if (!short(before)) continue;
      const why=constrained(block.element);
      if (block.isPre || why) {
        receipt.unresolved.push({kind:'orphan',selector:block.selector,text:before.text,reason:why||'pre格式约束'});continue;
      }
      if (/flex|grid/.test(getComputedStyle(block.element).display)) {
        receipt.unresolved.push({kind:'orphan',selector:block.selector,text:before.text,reason:'文字拥有者为flex/grid；直接尾span会改变子项，需在原单一正文子项内处理'});continue;
      }
      const range=tailRange(block);
      if (!range) {
        if (adjustWidth(block,before)) continue;
        receipt.unresolved.push({kind:'orphan',selector:block.selector,text:before.text,reason:'尾段含动效、图片或不能整体移动的热区'});continue;
      }
      const span=document.createElement('span');span.dataset.typesetTail='true';
      span.style.whiteSpace='nowrap';span.style.overflowWrap='normal';span.style.wordBreak='normal';
      const kept=range.extractContents(),crossNode=kept.childNodes.length>1;span.appendChild(kept);range.insertNode(span);
      C.collectTextBlocks(root);
      const renewed=C.collectTextBlocks(root).find(x=>x.element===block.element);
      const after=renewed?C.measureTextBlock(renewed):before;
      const r=span.getBoundingClientRect(),e=block.element.getBoundingClientRect();
      if (short(after) || r.width>block.element.clientWidth+1 || r.right>e.right+1 || r.left<e.left-1) {
        span.replaceWith(...span.childNodes);block.element.normalize();
        if (adjustWidth(block,before)) continue;
        receipt.unresolved.push({kind:'orphan',selector:block.selector,text:before.text,reason:'尾段整体放不下或末行仍短，已撤回'});
      } else receipt.tails.push({selector:block.selector,text:before.text,before:before.lines.at(-1).text,after:after.lines.at(-1).text,cross_node:crossNode});
    }
  }
  function equalCards() {
    // 先齐前排才会出现下一排的真实对应关系；只补同结构、同级卡片。
    // 独立纵排和下挂支线由checker明确区分，不能机械地越拉越高。
    for (let pass=0;pass<4;pass++) {
      C.collectTextBlocks(root);
      let changed=0;
      for (const row of C.cardRows(root)) {
        if (row.logical_peer!==true || row.bottom_delta<=1) continue;
        const parent=root.querySelector(row.selector);
        if (!parent || parent.closest('.feature-masonry-grid,[data-flow="masonry"],[data-flow="independent_columns"]')) continue;
        const cards=row.cards.map(c=>root.querySelector(c.selector)).filter(Boolean);
        if (cards.length!==row.cards.length) continue;
        const bottom=Math.max(...cards.map(card=>card.getBoundingClientRect().bottom));
        const heights=cards.map(card=>bottom-card.getBoundingClientRect().top);
        cards.forEach(card=>{
          card.style.minHeight=(bottom-card.getBoundingClientRect().top)+'px';
          if (card.matches('.card.side') && !card.querySelector('.sideic,img,svg')) card.style.alignItems='flex-start';
        });
        receipt.cards.push({selector:row.selector,before_delta:row.height_delta,before_bottom_delta:row.bottom_delta,min_heights:heights,count:cards.length,pass:pass+1});
        changed++;
      }
      if (!changed) break;
    }
  }
  function equalCompoundCards() {
    for (const row of root.querySelectorAll('.sequence-row')) {
      const items=[...row.children].filter(e=>e.matches('.sequence-item'));
      if (items.length<2 || !row.querySelector('.sequence-main-and-branch:not([data-side="right"])')) continue;
      const cards=items.map(item=>item.querySelector(':scope > .sequence-card,:scope > .sequence-main-and-branch > .sequence-main-card'));
      if (cards.some(card=>!card)) continue;
      const height=Math.max(...cards.map(card=>card.getBoundingClientRect().height));
      // 主卡齐高，支线继续留在原节点下面；卡不随带支线的整节点再次伸展。
      for (const card of cards) {
        card.style.flex='0 0 auto';card.style.height=height+'px';card.style.minHeight=height+'px';
      }
      receipt.cards.push({kind:'compound_main_cards',count:cards.length,min_height:height});
    }
  }
  function balanceRows() {
    // 并排栏按实测高度均衡：先在原宽 0.6～1.6 倍内挪栏宽让各栏一样高；
    // 仍不齐时依次试①②挪一张独立说明卡、③长栏后段绕到短栏下方用整宽。不删字、不改字号、不改画风。
    for (const row of root.querySelectorAll('.row')) {
      const cols=[...row.children];
      if (cols.length<2 || cols.some(c=>!c.matches('.col')) || row.matches('.card-notes') ||
          row.closest('.c-diagram') || row.querySelector('[data-comp="chapter_title"],.title-wrap,[data-flow],.feature-masonry-grid')) continue;
      // 横版短卡和侧栏保留审定分栏，不能为齐高移到整宽或绕成通栏。
      const text=C.collectTextBlocks(row).map(block=>C.measureTextBlock(block));
      const compact=text.length && text.every(block=>block.lines.every(line=>line.chars<=40));
      const cards=[...row.querySelectorAll('.card')].filter(card=>!card.closest('[data-comp="flow"],[data-comp="screenshot"],.c-diagram'));
      const shortCards=cards.length>=3 && cards.every(card=>card.textContent.trim().length<=160);
      const preserveCompact=document.body.classList.contains('o-h') && compact &&
          (shortCards || row.querySelector('[data-comp="document_mock"],[data-comp="notice"],[data-comp="comparison"]'));
      const prior=row.style.alignItems;row.style.alignItems='start';
      const hs=()=>cols.map(c=>c.getBoundingClientRect().height);
      let h=hs(),w=cols.map(c=>c.getBoundingClientRect().width);
      const H0=Math.max(...h),total=w.reduce((a,b)=>a+b,0);
      if (H0-Math.min(...h)<Math.max(80,H0*.12)) {row.style.alignItems=prior;continue;}
      const w0=[...w],set=v=>{row.style.gridTemplateColumns=v.map(x=>`minmax(0,${x.toFixed(1)}fr)`).join(' ');};
      const cost=(hh,ww)=>{const H=Math.max(...hh);return hh.reduce((a,x,i)=>a+ww[i]*(H-x),0)+total*.3*Math.max(0,H-H0);};
      const widths=()=>{
        // 正文块不许挤到一行不足 12 个字（短标签按自身字数；原本就更窄的不比原来更窄）。
        const texts=cols.map(c=>[...c.querySelectorAll('.tb,p,li')].filter(e=>/\S/.test(e.textContent)).map(e=>[e,Math.min(e.clientWidth,Math.min(12,e.textContent.trim().length)*parseFloat(getComputedStyle(e).fontSize))]));
        const narrow=i=>texts[i].some(([e,min])=>e.clientWidth<min-1);
        const lo=w0.map(x=>x*.6),hi=w0.map(x=>x*1.6);
        let best=cost(h,w),step=total*.025;
        for (let it=0;it<40;it++) {
          const t=h.indexOf(Math.max(...h)),m=h.indexOf(Math.min(...h));
          let ok=false;
          for (const [a,b] of [[t,m],[m,t]]) {
            const v=[...w];v[a]+=step;v[b]-=step;
            if (v[a]>hi[a] || v[b]<lo[b]) continue;
            set(v);const vh=hs(),c=cost(vh,v);
            if (c<best-1 && !narrow(b)) {w=v;h=vh;best=c;ok=true;break;}
          }
          if (!ok) {if (step<total*.006) break;step/=2;}
        }
        set(w);h=hs();
      };
      const before=h.map(Math.round);
      // 栏宽之外的补救：①最高栏末尾有一张别的栏没有对应位置的“多出来的”独立说明卡，先把它挪到这一行下面占整宽；
      // ②挪宽后短栏下仍空一大截，把紧跟这一行的独立说明卡挪进最短栏底部。只挪卡片/要点/提示/清单/正文段，
      // 挪后再均衡一次；空白没减半就撤回。各栏块数一样时是上下两排的构图，不拆。
      const solo='[data-comp="content_card"],[data-comp="points_card"],[data-comp="notice"],[data-comp="bullet_list"],[data-comp="prose"]';
      let moved='';
      const attempt=(name,go,undo)=>{
        const H1=Math.max(...h),gap1=H1-Math.min(...h),keep=[...w];
        if (preserveCompact || moved || gap1<=Math.max(120,H1*.2) || !go()) return;
        h=hs();widths();
        if (Math.max(...h)<=H1*1.1 && Math.max(...h)-Math.min(...h)<gap1*.5) moved=name;
        else {undo();w=keep;set(w);h=hs();}
      };
      const tc=cols[h.indexOf(Math.max(...h))],tail=tc.lastElementChild;
      attempt('push',()=>{if (tc.children.length<2 || !tail.matches(solo) || cols.some(c=>c!==tc && c.children.length>=tc.children.length)) return false;row.after(tail);return true;},()=>tc.append(tail));
      if (!moved) widths();
      const nx=row.nextElementSibling;
      attempt('pull',()=>{if (!nx?.matches(solo) || nx.textContent.trim().length>160) return false;cols[h.indexOf(Math.min(...h))].append(nx);return true;},()=>row.after(nx));
      if (!moved && cost(h,w)>cost(before,w0)*.65) {w=w0;set(w);h=hs();}  // 省不到三成空白就保持原构图
      // ③两栏仍一长一短：短栏只占长栏前 k 块的高度，长栏第 k 块以后跨两栏用整宽（DOM 顺序不变，只改网格位置）。
      const sI=h.indexOf(Math.min(...h)),lc=cols[1-sI],kids=cols.length===2?[...lc.children].filter(c=>getComputedStyle(c).display!=='none'):[];
      if (!preserveCompact && !moved && kids.length>=2 && Math.max(...h)-h[sI]>Math.max(120,Math.max(...h)*.2)) {
        w=w0;set(w);h=hs();
        const top=lc.getBoundingClientRect().top,k=kids.findIndex(c=>c.getBoundingClientRect().bottom-top>=h[sI]-1)+1;
        if (k>0 && k<kids.length) {
          row.style.rowGap=(parseFloat(getComputedStyle(lc).rowGap)||12)+'px';lc.style.display='contents';
          Object.assign(cols[sI].style,{gridColumn:String(sI+1),gridRow:`1 / span ${k}`});
          kids.forEach((c,i)=>Object.assign(c.style,{gridColumn:i<k?String(2-sI):'1 / -1',gridRow:String(i+1)}));
          moved='wrap';h=[row.getBoundingClientRect().height];
        }
      }
      row.style.alignItems=prior;
      receipt.balance.push({kind:'widths',before,after:h.map(Math.round),moved,widths:w.map(x=>Math.round(x/total*100))});
    }
  }
  function fillPage() {
    // 电脑整屏有最小高度（16:9 等）时，内容不够高的余量平均分到各块之间，不在底部留一条白带。
    if (!document.body.classList.contains('o-h') || !parseFloat(root.style.minHeight)) return;
    const top=root.getBoundingClientRect().top,pad=parseFloat(getComputedStyle(root).paddingBottom)||0;
    const used=Math.max(...[...root.children].map(e=>e.getBoundingClientRect().bottom-top))+pad;
    const spare=parseFloat(root.style.minHeight)-used;
    if (spare>parseFloat(root.style.minHeight)*.03) {
      if ([...root.children].filter(e=>e.getBoundingClientRect().height>0).length===1) root.style.minHeight=used+'px';
      root.style.justifyContent='space-evenly';receipt.page_fill=Math.round(spare);
    }
  }
  receipt.balance=[];
  keepLatinWords();balanceRows();applyLabels();
  receipt.extra_labels=globalThis.TypesetApplyResidual({rerunMain:false});
  applyText();equalCompoundCards();equalCards();fillPage();
  C.collectTextBlocks(root);
  receipt.after=C.check({root});
  globalThis.TypesetApplyReceipt=receipt;
  return receipt;
};

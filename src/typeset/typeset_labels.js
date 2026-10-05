// 短标签、术语、实时名与按钮正文内层；不改变统计说明句的布局。
globalThis.TypesetApplyResidual = (options={}) => {
  const C=globalThis.TypesetChecks,root=document.querySelector('#page')||document.body;
  const receipt={version:'typeset-labels-v1',tags:[],terms:[],live:[],buttons:[],unresolved:[]};
  const number=v=>parseFloat(v)||0;
  const contentWidth=e=>{const s=getComputedStyle(e);return e.clientWidth-number(s.paddingLeft)-number(s.paddingRight);};
  function natural(el){C.collectTextBlocks(root);return C.labelMetrics({element:el},root).natural_width;}
  function nowrap(el){el.style.whiteSpace='nowrap';el.style.overflowWrap='normal';el.style.wordBreak='normal';}
  function fixed(el){for(let p=el;p&&p!==root;p=p.parentElement)if(['absolute','fixed'].includes(getComputedStyle(p).position)||p.matches('[data-typeset-fixed],.mock-label-overlay,.dd-overlay-label,.ds-map-overlay'))return true;return false;}
  for(const host of root.querySelectorAll('.c-text-tags')) {
    const tags=[...host.querySelectorAll(':scope > .ct-tag,:scope > .ct-tag-unit > .ct-tag')];
    const data=tags.map(tag=>{const s=getComputedStyle(tag),unit=tag.closest('.ct-tag-unit')||tag;const text=natural(tag);
      const border=number(s.borderLeftWidth)+number(s.borderRightWidth),padding=number(s.paddingLeft)+number(s.paddingRight);
      const others=[...unit.children].filter(x=>x!==tag).reduce((n,x)=>n+x.getBoundingClientRect().width,0);
      const gap=unit===tag?0:number(getComputedStyle(unit).columnGap)*Math.max(0,unit.children.length-1);
      return{tag,unit,text,tagWidth:Math.ceil(text+padding+border+1),need:Math.ceil(text+padding+border+others+gap+1)};});
    const widest=Math.max(0,...data.map(x=>x.need));
    // 独立标签列放不下时，令这个仅含标签的原col占父row整排；不移动DOM。
    const col=host.parentElement,row=col?.parentElement;
    if(widest>contentWidth(host)+1&&col?.matches('.col')&&col.children.length===1&&row?.matches('.row')&&widest<=contentWidth(row)) col.style.gridColumn='1 / -1';
    for(const d of data){
      if(fixed(d.tag)){receipt.unresolved.push({kind:'tag',text:d.tag.textContent,reason:'固定图内坐标'});continue;}
      const available=contentWidth(host),own=d.unit.getBoundingClientRect().width;
      if(d.need>available+1){receipt.unresolved.push({kind:'tag',text:d.tag.textContent,reason:'完整胶囊及原分隔点超过整排宽度',need:d.need,available});continue;}
      const inGrid=getComputedStyle(host).display.includes('grid');
      if(inGrid&&d.need>own+1)d.unit.style.gridColumn='1 / -1';
      nowrap(d.tag);d.tag.style.flex='0 0 auto';d.tag.style.width=d.tagWidth+'px';d.tag.style.minWidth=d.tagWidth+'px';
      if(d.unit!==d.tag){d.unit.style.minWidth=d.need+'px';d.unit.style.flex='0 0 auto';}
      receipt.tags.push({text:d.tag.textContent,need:d.need,available,whole_row:inGrid&&d.need>own+1});
    }
  }
  for(const list of root.querySelectorAll('.ct-terms')){
    const terms=[...list.querySelectorAll(':scope > .ct-term')];
    const widest=Math.ceil(Math.max(0,...terms.map(t=>t.querySelector('dt')?natural(t.querySelector('dt')):0)));
    for(const term of terms){const label=term.querySelector(':scope > dt');if(!label)continue;
      const width=contentWidth(term),fs=number(getComputedStyle(term).fontSize),gap=number(getComputedStyle(term).columnGap)||fs*.5;
      if(widest>width+1){receipt.unresolved.push({kind:'dt',text:label.textContent,reason:'术语完整宽度超过整排',need:widest,available:width});continue;}
      nowrap(label);const below=widest+gap+fs*6>width;
      term.style.display='grid';term.style.gridTemplateColumns=below?'minmax(0,1fr)':widest+'px minmax(0,1fr)';
      if(below)for(const value of term.querySelectorAll(':scope > dd'))value.style.gridColumn='1 / -1';
      receipt.terms.push({text:label.textContent,width:widest,available:width,value_below:below});
    }
  }
  for(const label of root.querySelectorAll('.livename')){
    const slot=label.closest('.liveslot');if(!slot||fixed(label))continue;
    const width=natural(label),available=contentWidth(slot),s=getComputedStyle(slot),gap=number(s.columnGap)||0;
    const boxes=[...slot.children].filter(x=>x!==label);const minimum=boxes.reduce((n,x)=>n+Math.max(number(getComputedStyle(x).minWidth),96),0);
    if(width>available+1){receipt.unresolved.push({kind:'livename',text:label.textContent,reason:'实时名超过整排',need:width,available});continue;}
    nowrap(label);label.style.flex='0 0 auto';label.style.maxWidth='none';label.style.minWidth=Math.ceil(width)+'px';
    const below=width+minimum+gap>available;
    if(below){slot.style.flexDirection='column';slot.style.alignItems='stretch';for(const box of boxes){box.style.flex='none';box.style.width='100%';box.style.minWidth='0';}}
    receipt.live.push({text:label.textContent,width,available,value_below:below});
  }
  C.collectTextBlocks(root);
  for(const block of C.collectTextBlocks(root)){
    const m=C.measureTextBlock(block),el=block.element;
    if(m.chars<6||m.lines.length<2||m.lines.at(-1).chars>=3||!el.matches('a,button,[data-hot]')||!/flex|grid/.test(getComputedStyle(el).display))continue;
    if(fixed(el)||el.querySelector('img,svg,input,button,[data-motion-region],[data-motion-icon-arrow],[data-motion-dots],[data-comp="arrow"],[data-role="status-dot"]')){
      receipt.unresolved.push({kind:'button',text:m.text,reason:'按钮包含固定图位或动效，不能把全部子项包成文字内层'});continue;}
    let copy=el.querySelector(':scope > [data-typeset-button-copy]');
    if(!copy){copy=document.createElement('span');copy.dataset.typesetButtonCopy='true';Object.assign(copy.style,{display:'block',width:'100%',minWidth:'0',maxWidth:'100%'});copy.append(...el.childNodes);el.append(copy);}
    receipt.buttons.push({text:m.text,before:m.lines.at(-1).text});
  }
  // 主算法在单一正文内层包尾段，并在标签布局改变后重新处理正文与同排卡。
  if(options.rerunMain!==false&&typeof globalThis.TypesetApply==='function')receipt.main=globalThis.TypesetApply();
  C.collectTextBlocks(root);if(options.rerunMain!==false)receipt.after=C.check({root});
  globalThis.TypesetResidualReceipt=receipt;return receipt;
};

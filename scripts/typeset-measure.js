(async()=>{
 const plan=await(await fetch('/__typeset/geometry-plan')).json(),existing=await(await fetch('/__typeset/geometry-existing')).json(),records=existing.geometry_version===2?existing.records:[];
 const fit=await(await fetch('/__typeset/geometry-fit')).json();
 const params=new URLSearchParams(location.search),limit=Number(params.get('limit')||100),page=params.get('page');let measured=0;
 const state=document.querySelector('#state'),frame=document.createElement('iframe');document.body.append(frame);
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const bounded=async(p,ms,label)=>Promise.race([p,sleep(ms).then(()=>{throw Error(label+' timeout');})]);
 async function save(complete){return fetch('/__typeset/geometry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({schema:'wly.typeset-geometry.v1',geometry_version:2,fit_input:fit.input,complete,records,measured_at_beijing:new Date().toLocaleString('sv-SE',{timeZone:'Asia/Shanghai'})+'+08:00',method:'Chrome DOM rectangles at producer viewport height 200 with hidden scrollbars and producer FIT_JS; no screenshot or image viewing'})});}
 for(let i=0;i<plan.length;i++){
  const item=plan[i];state.textContent=`量测 ${i+1}/${plan.length}：${item.screen}-${item.orientation}`;
  if(page&&item.page!==page)continue;
  const prior=records.find(x=>x.screen===item.screen&&x.orientation===item.orientation&&x.measurement_recipe==='producer-components-v6'&&JSON.stringify(x.motion_source)===JSON.stringify(item.motion_source)&&x.fit_sha256===fit.input.sha256&&x.html_sha256===item.html_sha256&&JSON.stringify(x.parts)===JSON.stringify(item.parts)&&!x.issues?.length&&!x.broken_images?.length);
  if(prior)continue;
  if(measured>=limit)break;
  measured++;
  const oldIndex=records.findIndex(x=>x.screen===item.screen&&x.orientation===item.orientation);if(oldIndex>=0)records.splice(oldIndex,1);
  try{
   frame.width=String(item.viewport_width);
   await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('reference load timeout')),20000);frame.onload=()=>{try{if(frame.contentWindow.location.pathname!==new URL(item.url,location.href).pathname)return;}catch(e){return;}clearTimeout(timer);resolve();};frame.src=item.url;});
   const win=frame.contentWindow,doc=win.document;await bounded(doc.fonts.ready,5000,'fonts');
   await bounded(Promise.all([...doc.images].map(im=>im.decode().catch(()=>{}))),8000,'images');await sleep(0);
   win.eval('('+fit.javascript+')()');
   const rect=el=>{const r=el.getBoundingClientRect();return [r.left,r.top+win.scrollY,r.width,r.height];};
   const liveRects=[...doc.querySelectorAll('[data-hot=live]')].map(rect);
   const valid=r=>r[2]>1&&r[3]>1&&r[0]>=-1&&r[1]>=-1;
   let cards=[...doc.querySelectorAll('.card')].filter(el=>!el.closest('[aria-hidden=true]')).map(rect).filter(valid);
   if(!cards.length)cards=[...doc.querySelectorAll('main#page>.row> .col > :not(.ill):not(.title-wrap),main#page>.c-prose,main#page>.c-text')].map(rect).filter(valid);
   cards=cards.filter(r=>!liveRects.some(l=>Math.max(0,Math.min(r[0]+r[2],l[0]+l[2])-Math.max(r[0],l[0]))*Math.max(0,Math.min(r[1]+r[3],l[1]+l[3])-Math.max(r[1],l[1]))>r[2]*r[3]*.5));
   const normalize=text=>text.replace(/[\s,，]/g,'');const oldNumbers=item.motion_numbers||[];
   const numbers=oldNumbers.length?[...doc.querySelectorAll('.num,[data-role=num],.dg-number,.feature-number,.dd-chart-number,.hub-number-value,.ct-step-number,.slot-step-number,.ghost,.brushfont,.dg-heading,.hub-heading,.sechead')].map(el=>{
    const text=el.textContent.trim(),m=text.match(/[+-]?\d[\d,]*(?:\.\d+)?/),legacy=oldNumbers.some(n=>normalize(n.text)===normalize(text)),stat=el.matches('.num,[data-role=num],.dd-chart-number,.hub-number-value');
    const r=rect(el.matches('.ghost')?el.closest('.title-wrap'):el);return m&&(legacy||stat)?{text,numeric:m[0],value:Number(m[0].replaceAll(',','')),rect:r,basis:legacy?'legacy number text in producer DOM':'current statistic field in producer DOM'}:null;
   }).filter(x=>x&&valid(x.rect)):[];
   const dots=[...doc.querySelectorAll('.dot,.status-dot,.legend-dot,.hub-status-dot,[data-role=status-dot],.feature-status-dot,.mock-status-dot,.legend-color-dot,.hub-status,.ct-point-status')].map(el=>{
    const r=rect(el),cs=win.getComputedStyle(el),cross=el.matches('.dot-x,[data-state=off]'),pill=el.matches('.hub-status,.ct-point-status'),crossStyle=cross?win.getComputedStyle(el,'::before'):null;
    const colour=cross&&crossStyle.backgroundColor!=='rgba(0, 0, 0, 0)'?crossStyle.backgroundColor:pill&&cs.backgroundColor!=='rgba(0, 0, 0, 0)'?cs.backgroundColor:cross?cs.color:cs.backgroundColor!=='rgba(0, 0, 0, 0)'?cs.backgroundColor:cs.color;
    return {rect:r,shape:cross?'cross':pill?'pill':'circle',colour,basis:'Existing producer DOM marker; preserve its shape and colour'};
   }).filter(x=>valid(x.rect));
   const arrows=[...doc.querySelectorAll('.sequence-arrow,.arrow,.flow-arrow,[data-comp=arrow],.ds-source-arrow-glyph,.ds-judgement-arrow-symbol')].map(el=>{const r=rect(el);return {rect:r,direction:r[3]>r[2]?'v':'h'};}).filter(x=>valid(x.rect));
   for(const el of doc.querySelectorAll('.c-sequence .sequence-item,.ds-node,.ds-layer,.ds-pair-connector,.ds-judgement-row,.dd-sample'))for(const pseudo of ['::before','::after']){
    const cs=win.getComputedStyle(el,pseudo),connector=el.closest('.c-sequence')?.dataset.connector,painted=cs.backgroundImage!=='none'||!['transparent','rgba(0, 0, 0, 0)'].includes(cs.backgroundColor)||['borderLeftWidth','borderRightWidth','borderTopWidth','borderBottomWidth'].some(k=>parseFloat(cs[k])>1);
    const pin=el.matches('.dd-sample')&&pseudo==='::after'&&cs.borderRadius==='50%';
    if(cs.content==='none'||cs.display==='none'||cs.position!=='absolute'||!pin&&!cs.clipPath.includes('polygon')&&!(['arrow','ribbon','line'].includes(connector)&&painted))continue;
    const proxy=doc.createElement('span');for(const key of ['position','left','top','right','bottom','width','height','transform','transformOrigin','boxSizing','marginLeft','marginTop','marginRight','marginBottom','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderTopStyle','borderRightStyle','borderBottomStyle','borderLeftStyle'])proxy.style[key]=cs[key];proxy.style.visibility='hidden';proxy.style.pointerEvents='none';el.append(proxy);const r=rect(proxy);proxy.remove();
    if(valid(r)){if(pin)dots.push({rect:r,shape:'circle',colour:cs.backgroundColor,basis:'Existing producer CSS annotation pin; not a live status lamp'});else arrows.push({rect:r,direction:r[3]>r[2]?'v':'h',basis:'computed '+pseudo+' connector in producer DOM'});}
   }
   const illustrations=[...doc.querySelectorAll('[data-comp=illustration] img,.ill img')].map(im=>({src:im.getAttribute('src'),natural_size:[im.naturalWidth,im.naturalHeight],rect:rect(im)})).filter(x=>valid(x.rect));
   records.push({...item,measurement_recipe:'producer-components-v6',fit_sha256:fit.input.sha256,measured_height:doc.documentElement.scrollHeight,measured_width:doc.documentElement.clientWidth,overflow_width:doc.documentElement.scrollWidth,
                 cards,numbers,dots,arrows,illustrations,broken_images:[...doc.images].filter(im=>!im.complete||!im.naturalWidth).map(im=>im.src),issues:Math.abs(doc.documentElement.scrollHeight-item.source_height)>2?['rendered DOM height differs from PNG generation']:[]});
  }catch(e){records.push({...item,issues:[String(e)]});}
  if(measured%25===0)await save(false);
 }
 frame.remove();
 const pending=plan.filter(item=>!records.some(x=>x.screen===item.screen&&x.orientation===item.orientation&&x.measurement_recipe==='producer-components-v6'&&JSON.stringify(x.motion_source)===JSON.stringify(item.motion_source)&&x.fit_sha256===fit.input.sha256&&x.html_sha256===item.html_sha256&&JSON.stringify(x.parts)===JSON.stringify(item.parts)&&!x.issues?.length&&!x.broken_images?.length)).length,complete=pending===0;
 const response=await save(complete);
 state.dataset.done='true';state.dataset.complete=String(complete);
 state.dataset.pending=String(pending);
 state.textContent=response.ok?`本批量测结束：新增 ${measured}，累计 ${records.length}/${plan.length} 个版面，${records.filter(x=>x.issues.length).length} 个需核对，结果已保存。`:'结果保存失败';
})().catch(e=>document.querySelector('#state').textContent='量测失败：'+e);

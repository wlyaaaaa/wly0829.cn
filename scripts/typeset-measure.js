const TYPESET_DOT_POLICY='current-active-status-v1';
const TYPESET_DOT_SELECTOR='.dot,.status-dot,.ds-status-dot,.legend-dot,.hub-status-dot,[data-role=status-dot],.feature-status-dot,.mock-status-dot,.legend-color-dot,.hub-status,.ct-point-status';
function typesetStatusState(el){
 const owner=el.closest('[data-state],[data-status]'),state=el.dataset.state||el.dataset.status||owner?.dataset.state||owner?.dataset.status||'',label=el.dataset.text||el.getAttribute('aria-label')||el.closest('.hub-status,.ct-point-status')?.textContent||el.parentElement?.textContent||'';
 if(el.matches('.dot-x,.dot-off,.hub-status-frozen')||['off','unknown','pending','uncertain','unused','ring','failed','error','offline','disabled','loading','paused'].includes(state))return 'inactive';
 if(el.matches('.dot.dot-on')||['on','ok','active','running','enabled','valid','normal'].includes(state)||el.matches('[data-role=status-dot][data-ct-dot-xywh]'))return 'active';
 if(/[○✕×]|停用|待定|待验收|待实施|未启用|未运行|没用过|说不准|未知|离线|暂停|冻结/.test(label))return 'inactive';
 if(/在用|正常|正在运行|已启用|有效/.test(label))return 'active';
 return 'non_status';
}
function typesetNumberToken(text){
 const match=text.match(/[+-]?\d[\d,]*(?:\.\d+)?/);
 if(match)return {numeric:match[0],value:Number(match[0].replaceAll(',','')),notation:'decimal'};
 const circled=text.match(/[⓪①-⑳]/);return circled?{numeric:circled[0],value:circled[0]==='⓪'?0:circled[0].codePointAt(0)-0x2460+1,notation:'circled'}:null;
}
(async()=>{
 const params=new URLSearchParams(location.search),selection=(params.get('pages')||params.get('page')||'').split(',').filter(Boolean);
 const plan=(await(await fetch('/__typeset/geometry-plan')).json()).filter(item=>!selection.length||selection.includes(item.page)),existing=await(await fetch('/__typeset/geometry-existing')).json(),records=existing.geometry_version===2?existing.records:[];
 const fit=await(await fetch('/__typeset/geometry-fit')).json();
 const limit=Number(params.get('limit')||100);let measured=0;
 const state=document.querySelector('#state'),frame=document.createElement('iframe');document.body.append(frame);
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const bounded=async(p,ms,label)=>Promise.race([p,sleep(ms).then(()=>{throw Error(label+' timeout');})]);
 async function save(complete){return fetch('/__typeset/geometry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({schema:'wly.typeset-geometry.v1',geometry_version:2,fit_input:fit.input,complete,records,measured_at_beijing:new Date().toLocaleString('sv-SE',{timeZone:'Asia/Shanghai'})+'+08:00',method:'Chrome DOM rectangles at producer viewport height 200 with hidden scrollbars and producer FIT_JS; no screenshot or image viewing'})});}
 for(let i=0;i<plan.length;i++){
  const item=plan[i];state.textContent=`量测 ${i+1}/${plan.length}：${item.screen}-${item.orientation}`;
  const prior=records.find(x=>x.screen===item.screen&&x.orientation===item.orientation&&x.measurement_recipe==='producer-components-v8'&&x.layout_readiness==='fit-typeset-ready-two-frames-v1'&&x.dot_capability?.policy===TYPESET_DOT_POLICY&&JSON.stringify(x.motion_source)===JSON.stringify(item.motion_source)&&x.fit_sha256===fit.input.sha256&&x.html_sha256===item.html_sha256&&JSON.stringify(x.parts)===JSON.stringify(item.parts)&&!x.issues?.length&&!x.broken_images?.length);
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
   if(win.__typesetReady)await bounded(win.__typesetReady,15000,'typeset ready');
   await bounded(new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve))),5000,'layout frames');
   const rect=el=>{const r=el.getBoundingClientRect();return [r.left,r.top+win.scrollY,r.width,r.height];};
   const liveRects=[...doc.querySelectorAll('[data-hot=live]')].map(rect);
   const valid=r=>r[2]>1&&r[3]>1&&r[0]>=-1&&r[1]>=-1;
   let cards=[...doc.querySelectorAll('.card')].filter(el=>!el.closest('[aria-hidden=true]')).map(rect).filter(valid);
   if(!cards.length)cards=[...doc.querySelectorAll('main#page>.row> .col > :not(.ill):not(.title-wrap),main#page>.c-prose,main#page>.c-text')].map(rect).filter(valid);
   cards=cards.filter(r=>!liveRects.some(l=>Math.max(0,Math.min(r[0]+r[2],l[0]+l[2])-Math.max(r[0],l[0]))*Math.max(0,Math.min(r[1]+r[3],l[1]+l[3])-Math.max(r[1],l[1]))>r[2]*r[3]*.5));
   const normalize=text=>text.replace(/[\s,，]/g,'');const oldNumbers=item.motion_numbers||[];
   const numbers=oldNumbers.length?[...doc.querySelectorAll('.num,[data-role=num],.dg-number,.feature-number,[data-motion-text=number],.dd-chart-number,.hub-number-value,.ct-step-number,.slot-step-number,.ghost,.brushfont,.dg-heading,.hub-heading,.sechead')].map(el=>{
    const text=el.textContent.trim(),m=typesetNumberToken(text),legacy=oldNumbers.some(n=>normalize(n.text)===normalize(text)||m?.notation==='circled'&&Number(n.value??n.numeric)===m.value&&normalize(text)===m.numeric),stat=el.matches('.num,[data-role=num],.dd-chart-number,.hub-number-value');
    const r=rect(el.matches('.ghost')?el.closest('.title-wrap'):el);return m&&(legacy||stat)?{text,...m,rect:r,basis:legacy?'legacy number semantic value in current producer DOM':'current statistic field in producer DOM'}:null;
   }).filter(x=>x&&valid(x.rect)):[];
   const dotIssues=[],dotObservations=[],dots=[];
   for(const el of doc.querySelectorAll(TYPESET_DOT_SELECTOR)){
    if(el.matches('.hub-status,.ct-point-status')&&el.querySelector(TYPESET_DOT_SELECTOR))continue;
    const status=typesetStatusState(el),r=rect(el),cs=win.getComputedStyle(el),measurable=valid(r)&&cs.display!=='none'&&(cs.visibility!=='hidden'||el.hasAttribute('data-ct-dot-xywh'));
    const observation={selector:el.className||el.getAttribute('data-role'),state:status,measurable,rect:r,placement:el.dataset.ctDotPlacement||null};dotObservations.push(observation);
    if(status!=='active')continue;
    if(!measurable||el.dataset.incomplete){dotIssues.push('active status marker is not measurable: '+observation.selector+(el.dataset.incomplete?' '+el.dataset.incomplete:''));continue;}
    const pill=el.matches('.hub-status,.ct-point-status');
    if(pill){dotIssues.push('active status capsule lacks a separately measurable dot: '+observation.selector);continue;}
    const colour=cs.backgroundColor!=='rgba(0, 0, 0, 0)'?cs.backgroundColor:cs.color;
    dots.push({rect:r,shape:'circle',colour,state:'active',policy:TYPESET_DOT_POLICY,basis:'Current active status marker in producer DOM'});
   }
   const dotCapability={policy:TYPESET_DOT_POLICY,status:dots.length?'present':dotIssues.length?'measurement_failed':'no_corresponding_element',active_markers:dotObservations.filter(x=>x.state==='active').length,measured_markers:dots.length,observations:dotObservations};
   const arrows=[...doc.querySelectorAll('.sequence-arrow,.arrow,.flow-arrow,[data-comp=arrow],.ds-source-arrow-glyph,.ds-judgement-arrow-symbol')].map(el=>{const r=rect(el);return {rect:r,direction:r[3]>r[2]?'v':'h'};}).filter(x=>valid(x.rect));
   for(const el of doc.querySelectorAll('.c-sequence .sequence-item,.ds-node,.ds-layer,.ds-pair-connector,.ds-judgement-row,.dd-sample'))for(const pseudo of ['::before','::after']){
    const cs=win.getComputedStyle(el,pseudo),connector=el.closest('.c-sequence')?.dataset.connector,painted=cs.backgroundImage!=='none'||!['transparent','rgba(0, 0, 0, 0)'].includes(cs.backgroundColor)||['borderLeftWidth','borderRightWidth','borderTopWidth','borderBottomWidth'].some(k=>parseFloat(cs[k])>1);
    const pin=el.matches('.dd-sample')&&pseudo==='::after'&&cs.borderRadius==='50%';
    if(pin||cs.content==='none'||cs.display==='none'||cs.position!=='absolute'||!cs.clipPath.includes('polygon')&&!(['arrow','ribbon','line'].includes(connector)&&painted))continue;
    const proxy=doc.createElement('span');for(const key of ['position','left','top','right','bottom','width','height','transform','transformOrigin','boxSizing','marginLeft','marginTop','marginRight','marginBottom','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderTopStyle','borderRightStyle','borderBottomStyle','borderLeftStyle'])proxy.style[key]=cs[key];proxy.style.visibility='hidden';proxy.style.pointerEvents='none';el.append(proxy);const r=rect(proxy);proxy.remove();
    if(valid(r))arrows.push({rect:r,direction:r[3]>r[2]?'v':'h',basis:'computed '+pseudo+' connector in producer DOM'});
   }
   const illustrations=[...doc.querySelectorAll('[data-comp=illustration] img,.ill img,img.mock-base-art')].map(im=>({src:im.getAttribute('src'),natural_size:[im.naturalWidth,im.naturalHeight],rect:rect(im)})).filter(x=>valid(x.rect));
   records.push({...item,measurement_recipe:'producer-components-v8',layout_readiness:'fit-typeset-ready-two-frames-v1',dot_capability:dotCapability,fit_sha256:fit.input.sha256,measured_height:doc.documentElement.scrollHeight,measured_width:doc.documentElement.clientWidth,overflow_width:doc.documentElement.scrollWidth,
                 cards,numbers,dots,arrows,illustrations,broken_images:[...doc.images].filter(im=>!im.complete||!im.naturalWidth).map(im=>im.src),issues:[...dotIssues,...(Math.abs(doc.documentElement.scrollHeight-item.source_height)>2?['rendered DOM height differs from PNG generation']:[])]});
  }catch(e){records.push({...item,issues:[String(e)]});}
  if(measured%25===0)await save(false);
 }
 frame.remove();
 const pending=plan.filter(item=>!records.some(x=>x.screen===item.screen&&x.orientation===item.orientation&&x.measurement_recipe==='producer-components-v8'&&x.layout_readiness==='fit-typeset-ready-two-frames-v1'&&x.dot_capability?.policy===TYPESET_DOT_POLICY&&JSON.stringify(x.motion_source)===JSON.stringify(item.motion_source)&&x.fit_sha256===fit.input.sha256&&x.html_sha256===item.html_sha256&&JSON.stringify(x.parts)===JSON.stringify(item.parts)&&!x.issues?.length&&!x.broken_images?.length)).length,complete=pending===0;
 const response=await save(complete);
 state.dataset.done='true';state.dataset.complete=String(complete);
 state.dataset.pending=String(pending);
 state.textContent=response.ok?`本批量测结束：新增 ${measured}，累计 ${records.length}/${plan.length} 个版面，${records.filter(x=>x.issues.length).length} 个需核对，结果已保存。`:'结果保存失败';
})().catch(e=>document.querySelector('#state').textContent='量测失败：'+e);

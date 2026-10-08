/* Run actual Chrome DOM checks in sequential same-origin viewports, without image inspection. */
(async()=>{
 const build=await(await fetch('/__typeset/build-report')).json();
 const chosen=new URLSearchParams(location.search).get('pages')?.split(',');
 const names=chosen||Object.keys(build.pages),pages={};
 const frame=document.createElement('iframe');frame.height='1000';frame.title='页面程序验收';document.body.append(frame);
 const state=document.querySelector('#state'),log=document.querySelector('#results');
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const query=new URLSearchParams(location.search),nativeState=document.querySelector('#native-state');
 const baseline=query.has('baseline')?null:build.quality_baseline,prior=width=>baseline?.pages?.[control.page]?.[width];const missingMotion=(width,kind,part,key)=>!baseline||(part?prior(width)?.motion?.some(x=>x.kind===kind&&x.part===part&&(!key||x.key===key)):prior(width)?.preserved?.includes(kind))||!prior(width);
 const requestedWait=Number(query.get('static_wait_ms'));
 const routeWait=Number.isFinite(requestedWait)&&requestedWait>0?requestedWait:30000;
 const decodeWait=Number.isFinite(requestedWait)&&requestedWait>0?requestedWait:25000;
 // Native driver: open /__typeset/qa?native=1 (optionally &pages=name,name).
 // Poll window.TypesetQA.request. For reduced_motion use real browser media
 // emulation. Hidden-document checks navigate an actual playing iframe away
 // and capture its native visibilitychange; they need no JS state override.
 // External conditions resume only after native browser APIs observe them.
 // Do not rewrite either API or assign an observed result from the driver.
 const control=window.TypesetQA={phase:'running',page:null,request:null,pages,
  snapshot:()=>({phase:control.phase,page:control.page,request:control.request,pages}),result:null};
 let requestId=0;
 async function load(url,width,options={}){
  frame.width=String(width);frame.height=String(options.initialHeight||options.height||1000);
  const target=new URL(url,location.origin);target.searchParams.delete('audit');
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('route load timeout')),routeWait);frame.onload=()=>{clearTimeout(timer);resolve();};frame.src=target.href;});
  const win=frame.contentWindow,doc=win.document;
  for(let n=0;n<120&&!win.SiteAudit;n++)await sleep(50);
  if(!win.SiteAudit)throw Error('页面运行件未初始化');
  const mediaReady=win.eval("(async()=>{loadFooter();await Promise.all(mediaImages.map(load));await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));await document.fonts.ready;await window.pageLiving?.ready;motion();const images=[...document.images].filter(i=>i.getAttribute('src'));await Promise.all(images.map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));return {fonts:document.fonts.status,images:images.length,failed_images:images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc||i.src)};})()");
  const ready=await Promise.race([mediaReady,sleep(decodeWait).then(()=>{throw Error('image decode timeout');})]);
  if(ready.failed_images.length)throw Error('image decode incomplete: '+ready.failed_images.join(', '));
  const phaseKey=['cockpit','computer-access','mcp'].includes(JSON.parse(doc.querySelector('#page-data').textContent).kind)?'b2StatusPhase':doc.querySelector('.typeset-live')?'statusPhase':null;
  if(phaseKey){
   const deadline=performance.now()+routeWait;while(!['ready','error'].includes(doc.body.dataset[phaseKey])){if(performance.now()>deadline)throw Error('status initial read did not settle');await sleep(50);}
   await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
  }
  await sleep(options.audit===false?0:80);return {win,doc};
 }
 async function closeDialog(dialog,button){
  if(!dialog?.open||!button)return;
  // Native close handlers restore focus/reading position asynchronously.
  // Finish that real event before the next independent interaction check.
  await new Promise((resolve,reject)=>{const closed=()=>{clearTimeout(timer);resolve();},timer=setTimeout(()=>{dialog.removeEventListener('close',closed);reject(Error('native dialog close timeout'));},5000);dialog.addEventListener('close',closed,{once:true});button.click();});
 }
 function sourceBox(win,host,rect){
  const flow=win.TypesetLiveFlow?.sourceBox?.(host,rect);if(flow)return flow;
  const image=host.querySelector(':scope > picture > img')?.getBoundingClientRect();if(!image)return null;
  return {left:image.left+rect[0]*image.width,top:image.top+rect[1]*image.height,width:rect[2]*image.width,height:rect[3]*image.height,image_width:image.width,image_height:image.height};
 }
 function baseBox(el){
  const parent=el.offsetParent?.getBoundingClientRect();return parent?{left:parent.left+el.offsetLeft,top:parent.top+el.offsetTop,width:el.offsetWidth,height:el.offsetHeight}:el.getBoundingClientRect();
 }
 function rectError(actual,expected){return !expected?Infinity:Math.max(Math.abs(actual.left-expected.left),Math.abs(actual.top-expected.top),Math.abs(actual.width-expected.width),Math.abs(actual.height-expected.height));}
 function frozenRect(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===4&&b.length===4&&a.every((value,index)=>Number.isFinite(value)&&Math.abs(value-b[index])<=.00001);}
 function optionalSourceTile(win,host,tile,part){
  const region=tile.parentElement,cards=region?.querySelector(':scope > .typeset-live-flow-cards'),slots=cards?[...cards.children]:[];
  if(!tile.hidden||!tile.classList.contains('typeset-live-flow-masked')||!region?.classList.contains('typeset-live-flow-region')||win.getComputedStyle(tile).display!=='none'||tile.getClientRects().length||!slots.length)return false;
  // Optional feedback replaces its source band completely, even while feedback
  // is present. Only these two registered cells own an intentionally hidden raster.
  return slots.every(el=>{const slot=el.dataset.b2Slot||el.dataset.slot,cell=win.TypesetLiveFlow?.liveCell?.(host,el),frozen=(part.native_live||[]).find(entry=>entry.hot_id===el.dataset.hotId)||(part.live||[]).find(entry=>entry.slot===slot);
   return ['ca-toast','ca-results'].includes(slot)&&cell?.node===el&&cell.collapseWhenEmpty===true&&cell.slot===slot&&frozen?.slot===slot&&frozenRect(cell.rect,frozen.rect);
  });
 }
 function sourceImages(win,host,part){
  const flow=host.classList.contains('typeset-live-flow-ready'),images=flow?[...host.querySelectorAll('.typeset-live-flow-image')]:[host.querySelector(':scope > picture > img')],issues=[];
  if(!images.length||images.some(image=>!image))return ['source image missing'];
  const width=host.clientWidth,height=width*part.size[1]/part.size[0],url=new URL(part.src,win.location.href).href;
  for(const image of images){
   const box=image.getBoundingClientRect(),optional=flow&&optionalSourceTile(win,host,image.parentElement,part);
   if(image.src!==url||image.currentSrc&&image.currentSrc!==url||image.naturalWidth!==part.size[0]||image.naturalHeight!==part.size[1])issues.push('source image identity/dimensions');
   if(!optional&&(Math.abs(box.width-width)>1||Math.abs(box.height-height)>1))issues.push('source image render scale');
   if(flow){const tile=image.parentElement,left=Number(tile.dataset.sourceLeft),right=Number(tile.dataset.sourceRight),start=Number(tile.dataset.sourceStart),end=Number(tile.dataset.sourceEnd),frame=tile.getBoundingClientRect();
    const columns=tile.parentElement,cards=columns?.querySelector(':scope > .typeset-live-flow-replacement > .typeset-live-flow-cards'),nodes=cards?[...cards.children]:[],cell=nodes.length===1&&win.TypesetLiveFlow?.liveCell?.(host,nodes[0]),mask=cell?.maskRect||cell?.rect,row=columns?.classList.contains('typeset-live-flow-row');
    const members=cell?.members||[cell],bound=cell&&mask?.[2]>.9&&columns.classList.contains('typeset-live-flow-columns')&&win.getComputedStyle(tile).overflowY==='visible'&&members.every(member=>{const hot=part.hotspots.find(h=>h.id===member?.node?.dataset.hotId);return hot&&liveGeometry(win,host,member.node,hot,part)===true;});
    const side=bound&&((Math.abs(left)<.00001&&Math.abs(right-mask[0])<.00001)||(Math.abs(left-mask[0]-mask[2])<.00001&&Math.abs(right-1)<.00001));
    const frameHeight=side&&(row&&Math.abs(start-mask[1])<.00001&&Math.abs(end-mask[1]-mask[3])<.00001||!row&&!cell.flowRow&&start===0&&end===1)?Math.min((end-start)*height,row?cards.offsetHeight:cards.parentElement.offsetHeight):(end-start)*height;
    if(![left,right,start,end].every(Number.isFinite)||left<0||right>1||start<0||end>1||right<=left||end<=start||!optional&&(Math.abs(box.left-(frame.left-left*width))>1||Math.abs(box.top-(frame.top-start*height))>1||Math.abs(frame.width-(right-left)*width)>1||Math.abs(frame.height-frameHeight)>1))issues.push('source image tile binding');
    const clip=win.getComputedStyle(image).clipPath||'',coordinates=[...clip.matchAll(/([-+]?\d*\.?\d+(?:e[-+]?\d+)?)(%|px)/gi)];let cropped=false;
    if(clip.startsWith('inset(')&&coordinates.every(value=>value[2]==='%')){const values=coordinates.map(value=>Number(value[1])/100),expanded=values.length===1?[values[0],values[0],values[0],values[0]]:values.length===2?[...values,...values]:values.length===3?[...values,values[1]]:values;cropped=expanded.length===4&&expanded.every((value,index)=>Math.abs(value-[start,1-right,1-end,left][index])<=.00001);}
    if(clip.startsWith('polygon(evenodd,')&&coordinates.slice(0,10).every(value=>value[2]==='px')){const outer=[left*width,start*height,right*width,start*height,right*width,end*height,left*width,end*height,left*width,start*height];cropped=coordinates.length>=10&&outer.every((value,index)=>Math.abs(value-Number(coordinates[index][1]))<=1);}
    if(!cropped)issues.push('source image tile crop');
   }
  }
  return unique(issues);
 }
 function liveGeometry(win,host,el,hot,part){
  const cell=win.TypesetLiveFlow?.liveCell?.(host,el);if(!cell)return null;
  const frozen=(part.native_live||[]).find(entry=>entry.hot_id===hot.id)||(part.live||[]).find(entry=>entry.slot===hot.slot);
  const registered=cell.members?.find(member=>member.node===el)||cell;
  const native=el.dataset.b2Slot,slot=hot.slot||frozen?.slot;
  if(hot.kind!=='live'||!frozen||native&&native!==slot||!native&&el.dataset.slot!==slot||!frozenRect(frozen.rect,hot.rect)||!frozenRect(registered.rect,frozen.rect)||registered.slot&&registered.slot!==slot)return false;
  const cards=cell.node.parentElement;if(!cards?.classList.contains('typeset-live-flow-cards'))return false;
  const area=cards.getBoundingClientRect(),box=el.getBoundingClientRect(),sourceWidth=host.clientWidth;
  if(box.width<=0||box.height<=0||box.left<area.left-1||box.top<area.top-1||box.right>area.right+1||box.bottom>area.bottom+1)return false;
  const expectedWidth=cards.closest('.typeset-live-flow-replacement')?(cell.maskRect||cell.rect)[2]*sourceWidth:sourceWidth;
  if(Math.abs(area.width-expectedWidth)>1.5)return false;
  if(cell.members){
   for(const member of cell.members){const binding=(part.native_live||[]).find(entry=>entry.hot_id===member.node.dataset.hotId);if(!binding||binding.slot!==member.slot||!frozenRect(binding.rect,member.rect))return false;}
   const top=Math.max(0,Math.min(...cell.members.map(member=>member.rect[1]))-cell.groupPadding),bottom=Math.min(1,Math.max(...cell.members.map(member=>member.rect[1]+member.rect[3]))+cell.groupPadding);
   if(!frozenRect(cell.rect,[.02,top,.96,bottom-top]))return false;
  }
  const parent=el.parentElement,style=win.getComputedStyle(parent),parentBox=parent.getBoundingClientRect(),siblings=[...parent.children];
  if(style.display==='grid'){
   const tracks=style.gridTemplateColumns.split(/\s+/).map(Number.parseFloat),gap=Number.parseFloat(style.columnGap)||0,index=siblings.indexOf(el),column=index%tracks.length,padding=Number.parseFloat(style.paddingLeft)||0,left=parentBox.left+padding+tracks.slice(0,column).reduce((sum,value)=>sum+value,0)+gap*column;
   if(!tracks.length||tracks.some(value=>!Number.isFinite(value)||value<=0)||Math.abs(box.left-left)>1.5||Math.abs(box.width-tracks[column])>1.5)return false;
  }
  const summary=slot==='cockpit-pc'&&cell.flowRow===true?el.querySelector('details.b2-hardware-read-detail:not([open]) > summary'):null,minimum=summary&&contentVisible(win,summary)&&summary.getBoundingClientRect().height>0?summary.getBoundingClientRect().height:94;
  if(frozen.live_part!=='lamp'&&box.height<Math.min(minimum,frozen.rect[3]*sourceWidth*part.size[1]/part.size[0])-1)return false;
  const registeredSiblings=siblings.map(node=>cell.members?.find(member=>member.node===node)||win.TypesetLiveFlow?.liveCell?.(host,node)).filter(Boolean);
  for(let i=1;i<registeredSiblings.length;i++){const before=registeredSiblings[i-1].rect,after=registeredSiblings[i].rect;if(after[1]<before[1]-.00001||Math.abs(after[1]-before[1])<=.00001&&after[0]<before[0]-.00001)return false;}
  return true;
 }
 function hiddenGrafanaGroups(win,section,screen){
  if(screen.id!=='cockpit-04'||section.dataset.screen!==screen.id||!section.hidden||win.getComputedStyle(section).display!=='none'||section.querySelector('iframe'))return null;
  const active=[...section.querySelectorAll('.typeset-part')].filter(host=>!host.hidden),expected=screen.parts.filter(part=>part.both||part.orientation===(win.innerWidth<768?'v':'h'));if(!active.length||active.length!==expected.length)return null;
  const slots=[];for(let index=0;index<active.length;index++){
   const host=active[index],part=expected[index],layout=host._layout,images=[...host.querySelectorAll(':scope > picture > img,.typeset-live-flow-image')],url=new URL(part.src,win.location.href).href;if(!layout||host.dataset.orientation!==part.orientation||layout.image!==part.image||layout.orientation!==part.orientation||JSON.stringify(layout.size)!==JSON.stringify(part.size)||new URL(layout.src,win.location.href).href!==url||!images.length||images.some(im=>!im.complete||im.naturalWidth!==part.size[0]||im.naturalHeight!==part.size[1]||(im.currentSrc||im.src)!==url))return null;
   const entries=part.native_live||[],mounted=[...host.querySelectorAll('[data-hot-id]')];if(entries.length!==2||part.hotspots.length!==2||mounted.length!==2||entries.map(entry=>entry.live_part).sort().join(',')!=='cpu-gpu,memory-network')return null;
   for(const entry of entries){const matches=mounted.filter(el=>el.dataset.hotId===entry.hot_id),el=matches[0],hot=part.hotspots.find(hot=>hot.id===entry.hot_id),cell=el&&win.TypesetLiveFlow?.liveCell?.(host,el);
    if(matches.length!==1||entry.slot!=='cockpit-grafana'||hot?.kind!=='live'||hot.slot!==entry.slot||hot.live_part!==entry.live_part||el.dataset.b2Slot!==entry.slot||el.dataset.livePart!==entry.live_part||cell?.node!==el||cell.compactFrame!==true||cell.slot!==entry.slot||cell.livePart!==entry.live_part||!frozenRect(hot.rect,entry.rect)||!frozenRect(cell.rect,entry.rect)||!frozenRect(cell.maskRect||cell.rect,entry.mask_rect||entry.rect)||!el.hidden||el.dataset.optionalEmpty!=='true'||el.dataset.grafanaEmptyReason!=='grafana-groups-unreadable'||win.getComputedStyle(el).display!=='none'||el.getClientRects().length||el.querySelector('iframe'))return null;
    slots.push({screen:screen.id,part:part.image,hot_id:hot.id,slot:entry.slot,live_part:entry.live_part,kind:'unavailable_chart_group',semantic_status:'grafana_groups_unreadable',status:'pass',visible_rect:null,visible_text_rects:[],probes:[]});
   }
  }return slots;
 }
 /* typeset-content-acceptance-v1 */
 function contentBox(r){return {left:r.left,top:r.top,right:r.right??r.left+r.width,bottom:r.bottom??r.top+r.height,width:r.width,height:r.height};}
 function contentIntersection(a,b){const left=Math.max(a.left,b.left),top=Math.max(a.top,b.top),right=Math.min(a.right,b.right),bottom=Math.min(a.bottom,b.bottom);return right>left&&bottom>top?{left,top,right,bottom,width:right-left,height:bottom-top}:null;}
 function contentVisible(win,el){for(let node=el;node?.nodeType===1;node=node.parentElement){const s=win.getComputedStyle(node);if(s.display==='none'||['hidden','collapse'].includes(s.visibility)||Number(s.opacity)===0)return false;if(node.tagName==='DETAILS'&&!node.open&&node!==el&&!node.querySelector(':scope > summary')?.contains(el))return false;}return !!el?.getClientRects().length;}
 function contentClip(win,el){
  if(!contentVisible(win,el))return null;
  let box=contentBox(el.getBoundingClientRect());
  for(let node=el;node?.nodeType===1&&box;node=node.parentElement){
   const s=win.getComputedStyle(node),r=contentBox(node.getBoundingClientRect());
   if(['hidden','clip','auto','scroll'].includes(s.overflowX))box=contentIntersection(box,{...box,left:r.left+node.clientLeft,right:r.left+node.clientLeft+node.clientWidth});
   if(box&&['hidden','clip','auto','scroll'].includes(s.overflowY))box=contentIntersection(box,{...box,top:r.top+node.clientTop,bottom:r.top+node.clientTop+node.clientHeight});
   if(box&&s.clipPath.startsWith('inset(')){
    const values=[...s.clipPath.matchAll(/([-+]?\d*\.?\d+)(%|px)/g)].map(m=>[Number(m[1]),m[2]]),v=values.length===1?[values[0],values[0],values[0],values[0]]:values.length===2?[...values,...values]:values.length===3?[...values,values[1]]:values;
    if(v.length===4){const px=v.map(([n,u],i)=>u==='%'?n/100*(i%2?r.width:r.height):n);box=contentIntersection(box,{left:r.left+px[3],top:r.top+px[0],right:r.right-px[1],bottom:r.bottom-px[2]});}
   }
  }
  return box;
 }
 function contentText(win,root){
  const doc=win.document,walker=doc.createTreeWalker(root,win.NodeFilter.SHOW_TEXT),entries=[];
  while(walker.nextNode()){const node=walker.currentNode,el=node.parentElement;if(!node.textContent.trim()||!contentVisible(win,el))continue;const clip=contentClip(win,el);if(!clip)continue;
   const key=e=>[...e.classList].sort().join(' '),hot=el.closest('[data-hot-id]'),host=el.closest('.typeset-part'),peers=hot?[hot,...hot.querySelectorAll(el.tagName)].filter(e=>e.tagName===el.tagName&&key(e)===key(el)):[el],r=contentBox(el.getBoundingClientRect());
   const probe={hot,host,hotId:hot?.dataset.hotId,tag:el.tagName,classes:key(el),ordinal:peers.indexOf(el),count:peers.length,rect:{...r,top:r.top+win.scrollY,bottom:r.bottom+win.scrollY},phase:[doc.body.dataset.b2StatusPhase,doc.body.dataset.statusPhase,hot?.dataset.state].join('|'),node,nodeOrdinal:[...el.childNodes].filter(n=>n.nodeType===3).indexOf(node),nodeCount:[...el.childNodes].filter(n=>n.nodeType===3).length};
   const range=doc.createRange();range.selectNodeContents(node);
   for(const [lineOrdinal,r] of [...range.getClientRects()].entries()){const box=contentIntersection(contentBox(r),clip);if(box)entries.push({el,text:node.textContent.trim(),box,probe:{...probe,lineOrdinal}});}
  }
  return entries;
 }
 function contentPaints(win,el,x,y){
  if(!contentVisible(win,el))return false;
  const s=win.getComputedStyle(el),r=el.getBoundingClientRect(),alpha=value=>value!=='transparent'&&value!=='rgba(0, 0, 0, 0)'&&!/rgba\([^)]*,\s*0\s*\)/.test(value);
  if(['IMG','VIDEO','CANVAS','SVG','IFRAME'].includes(el.tagName)||s.backgroundImage!=='none'||alpha(s.backgroundColor))return true;
  if((x<r.left+parseFloat(s.borderLeftWidth)||x>r.right-parseFloat(s.borderRightWidth)||y<r.top+parseFloat(s.borderTopWidth)||y>r.bottom-parseFloat(s.borderBottomWidth))&&[s.borderLeftColor,s.borderRightColor,s.borderTopColor,s.borderBottomColor].some(alpha))return true;
  for(const node of el.childNodes)if(node.nodeType===3&&node.textContent.trim()&&alpha(s.color)){const range=win.document.createRange();range.selectNodeContents(node);if([...range.getClientRects()].some(b=>x>=b.left&&x<b.right&&y>=b.top&&y<b.bottom))return true;}
  for(const pseudo of ['::before','::after']){const p=win.getComputedStyle(el,pseudo);if(!['none','normal'].includes(p.content)&&(p.backgroundImage!=='none'||alpha(p.backgroundColor)))return true;}
  return false;
 }
 function contentBlocker(win,target,x,y){
  const stack=win.document.elementsFromPoint(x,y),index=stack.indexOf(target);if(index<0)return {reason:'target_not_in_painted_hit_stack'};
  for(const above of stack.slice(0,index)){if(above.contains(target)||target.contains(above))continue;if(contentPaints(win,above,x,y))return {reason:'painted_cover',tag:above.tagName,id:above.id,class_name:above.className};}
  return null;
 }
 async function contentProbe(win,target,box,points=[[.2,.2],[.5,.2],[.8,.2],[.2,.5],[.5,.5],[.8,.5],[.2,.8],[.5,.8],[.8,.8]],textMeta=null){
  const records=[],key=e=>[...e.classList].sort().join(' '),rect=e=>{const r=contentBox(e.getBoundingClientRect());return {...r,top:r.top+win.scrollY,bottom:r.bottom+win.scrollY};};
  const hot=textMeta?.hot||target.closest('[data-hot-id]'),host=textMeta?.host||target.closest('.typeset-part'),tag=textMeta?.tag||target.tagName,classes=textMeta?.classes??key(target),hotId=textMeta?.hotId||hot?.dataset.hotId;
  const peers=h=>[h,...h.querySelectorAll(tag)].filter(e=>e.tagName===tag&&key(e)===classes),initial=hot?peers(hot):[target],ordinal=textMeta?.ordinal??initial.indexOf(target),count=textMeta?.count??initial.length,original=textMeta?.rect||rect(target);
  let bound=target,previous=original,area=contentBox(box),textNode=textMeta?.node,rebound=0;
  const phase=()=>[win.document.body.dataset.b2StatusPhase,win.document.body.dataset.statusPhase,bound.closest('[data-hot-id]')?.dataset.state].join('|');let state=textMeta?.phase??phase();
  const resolve=()=>{if(!hotId)return bound.isConnected&&bound.tagName===tag&&key(bound)===classes?bound:null;const anchors=[...(host?.isConnected?host:win.document).querySelectorAll('[data-hot-id]')].filter(e=>e.dataset.hotId===hotId);if(anchors.length!==1)return null;const list=peers(anchors[0]);return list.length===count&&ordinal>=0?list[ordinal]||null:null;};
  const currentArea=()=>{const clip=contentClip(win,bound);if(!clip)return null;const current=rect(bound);let region;
   if(textMeta){const nodes=[...bound.childNodes].filter(n=>n.nodeType===3),node=nodes[textMeta.nodeOrdinal];if(!node?.textContent.trim())return null;if(nodes.length!==textMeta.nodeCount)return null;const range=win.document.createRange();range.selectNodeContents(node);const line=range.getClientRects()[textMeta.lineOrdinal];if(!line)return null;textNode=node;region=contentBox(line);region={...region,top:region.top+win.scrollY,bottom:region.bottom+win.scrollY};}
   else{if(original.width<=0||original.height<=0)return null;region=contentBox({left:current.left+(box.left-original.left)*current.width/original.width,top:current.top+(box.top-original.top)*current.height/original.height,width:box.width*current.width/original.width,height:box.height*current.height/original.height});}
   return contentIntersection(region,{...clip,top:clip.top+win.scrollY,bottom:clip.bottom+win.scrollY});
  };
  for(const [fx,fy] of points){let failure=null;
   for(let attempt=0;attempt<=2;attempt++){
    const dx=area.left+area.width*fx,dy=area.top+area.height*fy;win.scrollTo({top:dy-win.innerHeight*.45,behavior:'instant'});await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
    const connected=bound.isConnected,staleText=textMeta&&(!textNode?.isConnected||textNode.parentElement!==bound),now=connected?rect(bound):null,next=connected?currentArea():null,changed=!connected||staleText||bound.tagName!==tag||key(bound)!==classes||hotId&&bound.closest('[data-hot-id]')?.dataset.hotId!==hotId||Math.max(Math.abs(now.width-previous.width),Math.abs(now.height-previous.height))>.00001||phase()!==state||next&&Math.max(Math.abs(next.width-area.width),Math.abs(next.height-area.height))>.00001;
    if(changed){if(rebound>=2){failure={reason:'target_rebind_limit'};break;}rebound++;const current=resolve();if(!current){failure={reason:'target_rebind_missing_or_nonunique'};break;}bound=current;const fresh=currentArea();if(!fresh){failure={reason:'current_content_range_missing'};break;}area=fresh;previous=rect(bound);state=phase();continue;}
    if(!next){failure={reason:'current_content_range_missing'};break;}area=next;break;
   }
   const dx=area.left+area.width*fx,dy=area.top+area.height*fy,y=dy-win.scrollY,blocker=failure||(dx<0||dx>=win.innerWidth||y<0||y>=win.innerHeight?{reason:'outside_viewport'}:contentBlocker(win,bound,dx,y));
   const clip=bound.isConnected?contentClip(win,bound):null,sampleClip=clip?{...clip,top:clip.top+win.scrollY,bottom:clip.bottom+win.scrollY}:null;
   records.push({point:[dx,y],scroll_y:win.scrollY,blocker,connected:bound.isConnected,current_rect:bound.isConnected?contentBox(bound.getBoundingClientRect()):null,hit_stack:win.document.elementsFromPoint(dx,y).map(e=>({tag:e.tagName,id:e.id,class_name:e.getAttribute('class')||''})),rebound_count:rebound,sample_box:failure?null:area,sample_text:textMeta&&textNode?.isConnected&&textNode.parentElement===bound?textNode.textContent.trim():null,sample_target_box:bound.isConnected?rect(bound):null,sample_clip:sampleClip});
  }
  return records;
 }
 function contentCoverPoints(win,target,box){
  const points=[],seen=new Set();
  // Include each intersecting painted layer, so a small opaque corner mask
  // cannot hide between the regular screenshot probes, even with no pointer events.
  for(const el of win.document.querySelectorAll('body *')){
   if(el===target||el.contains(target)||target.contains(el))continue;
   const clip=contentClip(win,el);if(!clip)continue;const r={...clip,top:clip.top+win.scrollY,bottom:clip.bottom+win.scrollY},intersection=contentIntersection(box,r);if(!intersection)continue;
   const x=intersection.left+intersection.width/2,y=intersection.top+intersection.height/2;if(!contentPaints(win,el,x,y-win.scrollY))continue;
   const point=[(x-box.left)/box.width,(y-box.top)/box.height],key=point.map(n=>n.toFixed(5)).join(',');if(!seen.has(key)){seen.add(key);points.push(point);}
  }
  return points;
 }
 function contentSubtract(box,cut){const overlap=contentIntersection(box,cut);if(!overlap)return [box];return [
  {left:box.left,top:box.top,right:box.right,bottom:overlap.top},
  {left:box.left,top:overlap.bottom,right:box.right,bottom:box.bottom},
  {left:box.left,top:overlap.top,right:overlap.left,bottom:overlap.bottom},
  {left:overlap.right,top:overlap.top,right:box.right,bottom:overlap.bottom}
 ].filter(r=>r.right>r.left&&r.bottom>r.top).map(r=>({...r,width:r.right-r.left,height:r.bottom-r.top}));}
 function contentBlankRegions(blocks,viewport){
  const valid=blocks.filter(r=>[r.left,r.top,r.width,r.height].every(Number.isFinite)&&r.width>0&&r.height>0).map(contentBox);if(!valid.length)return {content_region:null,components:[],issues:['no measured visible content blocks']};
  // Exact rectangle-edge decomposition. Four-neighbour components are true
  // two-dimensional empty regions; no whole-width band or container fill.
  const xs=[...new Set(valid.flatMap(r=>[r.left,r.right]))].sort((a,b)=>a-b),ys=[...new Set(valid.flatMap(r=>[r.top,r.bottom]))].sort((a,b)=>a-b),nx=xs.length-1,ny=ys.length-1,stride=nx+1,diff=new Int32Array(stride*(ny+1)),xmap=new Map(xs.map((x,i)=>[x,i])),ymap=new Map(ys.map((y,i)=>[y,i]));
  for(const r of valid){const x0=xmap.get(r.left),x1=xmap.get(r.right),y0=ymap.get(r.top),y1=ymap.get(r.bottom);diff[y0*stride+x0]++;diff[y0*stride+x1]--;diff[y1*stride+x0]--;diff[y1*stride+x1]++;}
  const cells=new Uint8Array(nx*ny);
  for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const k=y*stride+x;diff[k]+=(x?diff[k-1]:0)+(y?diff[k-stride]:0)-(x&&y?diff[k-stride-1]:0);cells[y*nx+x]=diff[k]>0?1:0;}
  const heights=new Float64Array(nx);let largest={area_px2:0,viewport_fraction:0,bounds:null};
  for(let y=0;y<ny;y++){
   for(let x=0;x<nx;x++)heights[x]=cells[y*nx+x]?0:heights[x]+ys[y+1]-ys[y];
   const stack=[];
   for(let x=0;x<=nx;x++){let start=x;const h=x<nx?heights[x]:0;while(stack.length&&stack.at(-1).height>h){const previous=stack.pop();start=previous.start;const area=previous.height*(xs[x]-xs[start]);if(area>largest.area_px2)largest={area_px2:area,viewport_fraction:area/(viewport.width*viewport.height),bounds:{left:xs[start],top:ys[y+1]-previous.height,width:xs[x]-xs[start],height:previous.height}};}if(!stack.length||stack.at(-1).height<h)stack.push({start,height:h});}
  }
  const components=[];let total=0;
  for(let seed=0;seed<cells.length;seed++){if(cells[seed])continue;const queue=[seed];cells[seed]=2;let area=0,left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
   for(let head=0;head<queue.length;head++){const k=queue[head],x=k%nx,y=Math.floor(k/nx);area+=(xs[x+1]-xs[x])*(ys[y+1]-ys[y]);left=Math.min(left,xs[x]);top=Math.min(top,ys[y]);right=Math.max(right,xs[x+1]);bottom=Math.max(bottom,ys[y+1]);for(const next of [x?k-1:-1,x<nx-1?k+1:-1,y?k-nx:-1,y<ny-1?k+nx:-1])if(next>=0&&!cells[next]){cells[next]=2;queue.push(next);}}
   total+=area;if(area>viewport.width*viewport.height*.15)components.push({area_px2:area,viewport_fraction:area/(viewport.width*viewport.height),bounds:{left,top,width:right-left,height:bottom-top},cells:queue.length,status:'candidate_requires_visual_review'});
  }
  return {content_region:{left:xs[0],top:ys[0],width:xs.at(-1)-xs[0],height:ys.at(-1)-ys[0]},coordinate_cells:nx*ny,empty_area_px2:total,threshold_fraction:.15,decision_method:'Largest empty rectangle in actual content bounds; broad four-neighbour components remain visual-review candidates because narrow paragraph/column gaps connect',definite_fail:largest.viewport_fraction>.15,largest_empty_rectangle:largest,components:components.sort((a,b)=>b.area_px2-a.area_px2),issues:[]};
 }
 function contentStaticRects(win,host,part){
  const content=part.content_occupancy;if(content?.policy!=='semantic-content-rects-v1'||!Array.isArray(content.blocks)||!['source_html_sha256','source_png_sha256','fit_sha256','measurement_sha256'].every(k=>/^[a-f0-9]{64}$/.test(content[k]||'')))return null;
  const tiles=[...host.querySelectorAll('.typeset-live-flow-tile')],sources=tiles.length?tiles.map(tile=>({im:tile.querySelector('.typeset-live-flow-image'),rect:[Number(tile.dataset.sourceLeft),Number(tile.dataset.sourceStart),Number(tile.dataset.sourceRight)-Number(tile.dataset.sourceLeft),Number(tile.dataset.sourceEnd)-Number(tile.dataset.sourceStart)]})):[{im:host.querySelector(':scope > picture > img'),rect:[0,0,1,1]}];
  const masks=[...(part.native_live||[]),...(part.live||[])].map(item=>item.mask_rect||item.rect),blocks=[];
  for(const block of content.blocks){if(!['text','drawing'].includes(block.kind))continue;const r=block.rect;let pieces=[{left:r[0],top:r[1],right:r[0]+r[2],bottom:r[1]+r[3],width:r[2],height:r[3]}];for(const mask of masks)pieces=pieces.flatMap(piece=>contentSubtract(piece,{left:mask[0],top:mask[1],right:mask[0]+mask[2],bottom:mask[1]+mask[3]}));
   for(const source of sources){if(!source.im||!contentVisible(win,source.im))continue;const im=source.im.getBoundingClientRect(),q=source.rect,sourceRect={left:q[0],top:q[1],right:q[0]+q[2],bottom:q[1]+q[3]};for(const piece of pieces){const clipped=contentIntersection(piece,sourceRect);if(clipped)blocks.push({left:im.left+clipped.left*im.width,top:im.top+win.scrollY+clipped.top*im.height,width:clipped.width*im.width,height:clipped.height*im.height});}}
  }
  return blocks;
 }
 async function contentAcceptance(win,doc,data){
  const issues=[],screens=[],screenshots=[],liveSlots=[],style=doc.createElement('style');
  // Pointer behaviour changes hit testing only. Making all layers participate
  // prevents pointer-events:none images/masks from disappearing from evidence.
  style.textContent='html *{pointer-events:auto!important}';doc.head.append(style);
  try{
   for(const section of doc.querySelectorAll('.typeset-screen')){
    const s=data.screens.find(item=>item.id===section.dataset.screen);
    if(!s)continue;
    const unavailable=hiddenGrafanaGroups(win,section,s);if(unavailable){liveSlots.push(...unavailable);screens.push({screen:s.id,semantic_status:'grafana_groups_unreadable',slots:unavailable,status:'pass'});continue;}
    for(const host of section.querySelectorAll('.typeset-part:not([hidden])')){
     const part=s.parts.find(item=>item.image===(host._layout?.image||host.dataset.part))||host._layout,staticBlocks=contentStaticRects(win,host,part),blocks=staticBlocks||[];if(!staticBlocks)issues.push(part.image+':content occupancy evidence missing');
     for(const hot of part.hotspots.filter(item=>['screenshot','live'].includes(item.kind))){const el=[...host.querySelectorAll('[data-hot-id]')].find(node=>node.dataset.hotId===hot.id);if(!el)continue;
      win.scrollTo({top:win.scrollY+el.getBoundingClientRect().top-win.innerHeight*.3,behavior:'instant'});await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
      if(hot.kind==='screenshot'){
       const wraps=[...el.querySelectorAll('.typeset-shot-crop')],before=wraps.find(wrap=>wrap.classList.contains('compare-before')),split=before?contentClip(win,before):null;
       for(let index=0;index<hot.shots.length;index++){
        const wrap=wraps[index],img=wrap?.querySelector('img');let visible=img?contentClip(win,img):null;
        if(visible&&before&&wrap!==before&&split)visible=contentIntersection(visible,{...visible,left:Math.max(visible.left,split.right)});
        let regions=visible?[visible]:[];for(const control of el.querySelectorAll('input[type=range],.typeset-compare-open')){const clip=contentClip(win,control);if(clip)regions=regions.flatMap(region=>contentSubtract(region,clip));}visible=regions.sort((a,b)=>b.width*b.height-a.width*a.height)[0]||null;
        const record={screen:s.id,part:part.image,hot_id:hot.id,source_index:index,role:hot.shots[index].role||null,natural_size:img?[img.naturalWidth,img.naturalHeight]:[0,0],visible_rect:visible,probes:[]};
        if(!img?.complete||!img.naturalWidth||!img.naturalHeight||!visible||visible.width<=0||visible.height<=0){record.status='fail';issues.push(part.image+':screenshot not visibly rendered '+hot.id+'/'+index);}
        else{const y=win.scrollY,imageBox=contentBox(img.getBoundingClientRect()),box={...visible,top:visible.top+y,bottom:visible.bottom+y},points=[[.2,.2],[.5,.2],[.8,.2],[.2,.5],[.5,.5],[.8,.5],[.2,.8],[.5,.8],[.8,.8],...contentCoverPoints(win,img,box)];record.probes=await contentProbe(win,img,box,points);record.status=record.probes.some(probe=>probe.blocker)?'fail':'pass';if(record.status==='fail')issues.push(part.image+':screenshot covered '+hot.id+'/'+index);else{const last=record.probes.at(-1),current=last?.sample_target_box;record.sample_regions=regions.map(region=>current&&last.sample_clip?contentIntersection(contentBox({left:current.left+(region.left-imageBox.left)*current.width/imageBox.width,top:current.top+(region.top-imageBox.top)*current.height/imageBox.height,width:region.width*current.width/imageBox.width,height:region.height*current.height/imageBox.height}),last.sample_clip):null).filter(Boolean);for(const region of record.sample_regions)blocks.push({left:region.left,top:region.top,width:region.width,height:region.height});}}
        screenshots.push(record);
       }
      }else{
       if(['ca-toast','ca-results'].includes(hot.slot)&&el.hidden&&el.dataset.optionalEmpty==='true'&&win.getComputedStyle(el).display==='none'&&!el.getClientRects().length){
        liveSlots.push({screen:s.id,part:part.image,hot_id:hot.id,slot:hot.slot,kind:'optional_feedback',semantic_status:'no_operation_feedback',status:'pass',visible_rect:null,visible_text_rects:[],probes:[]});
        continue;
       }
       if(hot.slot==='cockpit-grafana'&&hot.live_part==='memory-network'&&el.hidden&&el.dataset.optionalEmpty==='true'&&el.dataset.grafanaEmptyReason==='grafana-groups-unreadable'&&win.getComputedStyle(el).display==='none'&&!el.getClientRects().length){
        liveSlots.push({screen:s.id,part:part.image,hot_id:hot.id,slot:hot.slot,kind:'optional_feedback',semantic_status:'shared_primary_grafana_failure',status:'pass',visible_rect:null,visible_text_rects:[],probes:[]});
        continue;
       }
       const scope=el.querySelector('.live-status-value,.b2-card-list')||el,text=contentText(win,scope),clip=contentClip(win,el),lamp=hot.live_part==='lamp'&&el.classList.contains('typeset-lamp'),input=['ca-form-hours','ca-form-code'].includes(hot.slot)&&el.tagName==='INPUT';
       const meaning=lamp?(el.getAttribute('aria-label')||'').trim():input?(el.value||el.getAttribute('placeholder')||el.getAttribute('aria-label')||'').trim():text.map(entry=>entry.text).join(' '),state=el.dataset.state||null;
       const inputText=input?(el.value||el.getAttribute('placeholder')||''):null;
       const record={screen:s.id,part:part.image,hot_id:hot.id,slot:hot.slot,kind:lamp?'status_lamp':input?'form_input':'visible_text',state,text:input?inputText:meaning,...(input?{input_label:el.getAttribute('aria-label'),input_empty:!inputText,semantic_status:inputText?'input_value_present':'awaiting_user_input'}:{}),visible_text_rects:text.map(entry=>entry.box),visible_rect:clip,probes:[]};
       if(!meaning||!clip||clip.width<=0||clip.height<=0||lamp&&(!state||!contentPaints(win,el,clip.left+clip.width/2,clip.top+clip.height/2))){record.status='fail';issues.push(part.image+':empty or invisible live content '+hot.slot);}
       else{const y=win.scrollY,targets=(lamp||input?[{el,box:clip}]:contentText(win,el)).map(target=>({...target,box:{...target.box,top:target.box.top+y}}));for(const target of targets){const b=target.box,probes=await contentProbe(win,target.el,b,[[.5,.5]],target.probe);record.probes.push(...probes);if(probes.every(probe=>!probe.blocker)&&!input)for(const {sample_box:q} of probes)if(q)blocks.push({left:q.left,top:q.top,width:q.width,height:q.height});}record.status=record.probes.some(probe=>probe.blocker)?'fail':'pass';if(record.status==='fail')issues.push(part.image+':live content covered '+hot.slot);
        // The two schema-owned form fields are user input, not status values.
        // An empty labelled input is never counted as a filled content block.
        if(input&&inputText&&record.status==='pass'){const cs=win.getComputedStyle(el),ctx=doc.createElement('canvas').getContext('2d');ctx.font=cs.font;const w=Math.min(ctx.measureText(inputText).width,clip.width),h=Math.min(parseFloat(cs.fontSize)||0,clip.height);if(w>0&&h>0)blocks.push({left:clip.left+parseFloat(cs.paddingLeft||0),top:clip.top+y+(clip.height-h)/2,width:w,height:h});}
       }
       record.sample_texts=record.probes.map(p=>p.sample_text).filter(t=>t!==null&&t!==undefined);record.sample_boxes=record.probes.map(p=>p.sample_box).filter(Boolean);
       liveSlots.push(record);
      }
     }
     for(const node of host.querySelectorAll('[data-today-river] h3,[data-today-river] p'))for(const text of contentText(win,node)){const y=win.scrollY,b={...text.box,top:text.box.top+y},probes=await contentProbe(win,text.el,b,[[.5,.5]],text.probe);if(probes.some(probe=>probe.blocker))issues.push(part.image+':river explanation covered');else for(const {sample_box:q} of probes)if(q)blocks.push({left:q.left,top:q.top,width:q.width,height:q.height});}
     for(const hot of part.hotspots.filter(item=>item.kind==='button'&&item.action)){const node=[...host.querySelectorAll('[data-hot-id]')].find(el=>el.dataset.hotId===hot.id);if(!node)continue;for(const text of contentText(win,node)){const y=win.scrollY,b={...text.box,top:text.box.top+y},probes=await contentProbe(win,text.el,b,[[.5,.5]],text.probe);if(probes.some(probe=>probe.blocker))issues.push(part.image+':native button text covered '+hot.id);else for(const {sample_box:q} of probes)if(q)blocks.push({left:q.left,top:q.top,width:q.width,height:q.height});}}
     const empty=staticBlocks?contentBlankRegions(blocks,{width:win.innerWidth,height:win.innerHeight}):{components:[],issues:[]},proof=part.content_occupancy;const sourceBinding=proof?Object.fromEntries(['policy','method','source_html_sha256','source_png_sha256','fit_sha256','measurement_sha256'].map(key=>[key,proof[key]])):null;const before=prior(win.innerWidth)?.blank?.[part.image]||0,fraction=empty.largest_empty_rectangle?.viewport_fraction||0,regression=baseline?{before,after:fraction,tolerance:.02,worse:fraction>Math.max(.15,before+.02)}:null;
     screens.push({screen:s.id,part:part.image,source_binding:sourceBinding,content_blocks:blocks.length,...empty,regression});issues.push(...empty.issues.map(issue=>part.image+':'+issue));if(regression?regression.worse:empty.definite_fail)issues.push(part.image+':continuous blank rectangle exceeds 15% of viewport');
    }
   }
  }finally{style.remove();win.scrollTo(0,0);}
  return {policy:'visible-content-and-continuous-blank-v1',viewport:{width:win.innerWidth,height:win.innerHeight},screenshots,live_slots:liveSlots,screens,issues:[...new Set(issues)],status:issues.length?'fail':'pass'};
 }
 /* end-typeset-content-acceptance-v1 */
 async function check(url,width,entry){
  const{win,doc}=await load(url,width),issues=[],geometryDiagnostics=[],geometrySemantics=[];
  const d=JSON.parse(doc.querySelector('#page-data').textContent);
  if(!win.matchMedia('(prefers-reduced-motion:reduce)').matches)issues.push('static layout did not observe native reduced motion');
  for(const screen of d.screens||[])for(const part of screen.parts||[])part.content_occupancy=entry?.content_occupancy?.parts?.[part.image];
  if(win.innerWidth!==width)issues.push('viewport width '+win.innerWidth);
  if(!d.typeset)issues.push('route did not select typeset page');
  if(['project','frozen'].includes(d.kind)&&d.repository_visibility==='PUBLIC'&&d.repo_url&&!Array.from(doc.querySelectorAll('a[href]')).some(el=>el.getClientRects().length&&el.getAttribute('href')===d.repo_url))issues.push('registered public repository has no visible link '+d.repo_url);
  if(doc.documentElement.scrollWidth>width+1)issues.push('horizontal overflow '+doc.documentElement.scrollWidth);
  const images=[...doc.images].filter(i=>i.getAttribute('src'));
  for(const im of images)if(!im.complete||!im.naturalWidth)issues.push('image not loaded '+im.getAttribute('src'));
  const model=new Map(d.screens.map(s=>[s.id,s]));let hotspots=0,live=0,shots=0,parts=0;const targets=[];
  const ids=[...doc.querySelectorAll('[id]')].map(x=>x.id);if(new Set(ids).size!==ids.length)issues.push('duplicate anchor IDs');
  for(const section of doc.querySelectorAll('.typeset-screen')){
   const s=model.get(section.dataset.screen),active=[...section.querySelectorAll('.typeset-part')].filter(p=>!p.hidden),expected=s.parts.filter(p=>p.both||p.orientation===(width<768?'v':'h'));
   if(active.length!==expected.length)issues.push(s.id+':orientation part count');
   const unavailable=hiddenGrafanaGroups(win,section,s);if(unavailable){geometrySemantics.push({screen:s.id,semantic_status:'grafana_groups_unreadable',slots:unavailable});live+=unavailable.length;parts+=active.length;continue;}
   for(let n=0;n<active.length;n++){
    const host=active[n],p=expected[n],r=host.getBoundingClientRect(),im=host.querySelector(':scope > picture > img'),image=sourceBox(win,host,[0,0,1,1]);parts++;
    if(im.naturalWidth!==p.size[0]||im.naturalHeight!==p.size[1])issues.push(p.image+':PNG dimensions differ');
    for(const issue of sourceImages(win,host,p))issues.push(p.image+':'+issue);
    if(!image||image.image_width<=0||Math.abs(image.image_height-image.image_width*p.size[1]/p.size[0])>1)issues.push(p.image+':image aspect ratio');
    const mounted=[...host.querySelectorAll('[data-hot-id]')];
    for(const h of p.hotspots){
     const el=mounted.find(e=>e.dataset.hotId===h.id);
     if(!el){issues.push(p.image+':hotspot not mounted '+h.kind+' '+(h.href||h.target));continue;}
     if(h.kind==='live'&&['ca-toast','ca-results'].includes(h.slot)&&el.hidden&&el.dataset.optionalEmpty==='true'){live++;continue;}
     if(h.kind==='live'&&h.slot==='cockpit-grafana'&&h.live_part==='memory-network'&&el.hidden&&el.dataset.optionalEmpty==='true'&&el.dataset.grafanaEmptyReason==='grafana-groups-unreadable'&&win.getComputedStyle(el).display==='none'&&!el.getClientRects().length){live++;continue;}
     if(mounted.filter(e=>e.dataset.hotId===h.id).length!==1)issues.push(p.image+':duplicate mounted hotspot '+h.id);
     const er=el.getBoundingClientRect(),px=h.rect_px;
     const flowLive=liveGeometry(win,host,el,h,p),want=sourceBox(win,host,[px[0]/p.size[0],px[1]/p.size[1],px[2]/p.size[0],px[3]/p.size[1]]);
     if(flowLive===false||flowLive===null&&rectError(er,want)>1.5){issues.push(p.image+':hotspot geometry '+h.id);geometryDiagnostics.push({screen:s.id,hot_id:h.id,live_binding:flowLive,actual:{left:er.left,top:er.top,width:er.width,height:er.height},expected:want,parent_class:el.parentElement?.className,style:el.style.cssText,source_rect:h.rect});}
     if(er.left<r.left-1||er.top<r.top-1||er.right>r.right+1||er.bottom>r.bottom+1)issues.push(p.image+':hotspot outside image '+h.id);
     if(h.invalid)issues.push(p.image+':unbound target '+(h.href||h.target));
     if(h.kind==='link'||h.kind==='button'){
      if(h.reference_only){if(h.href!==null||typeof h.original_href!=='string'||el.tagName!=='SPAN'||el.hasAttribute('href')||el.tabIndex!==0||!el.title.includes(h.original_href)||el.getAttribute('aria-label')!==el.title)issues.push(p.image+':reference-only support document');}
      else if(h.action){if(el.dataset.b2Action!==h.action)issues.push(p.image+':native button target');}
      else if(!h.invalid){if(el.getAttribute('href')!==h.href)issues.push(p.image+':link target');targets.push(h.href);}
      hotspots++;
     }else if(h.kind==='live'){
       if(!(el.textContent.trim()||el.tagName==='INPUT'||el.classList.contains('typeset-lamp')||h.slot==='ca-toast'))issues.push(p.image+':empty live slot '+h.slot);
      live++;
     }else if(h.kind==='screenshot'){
      if(el.querySelectorAll('img').length!==h.shots.length)issues.push(p.image+':screenshot source count');
      if(h.shots.length>1&&!el.querySelector('input[type=range]'))issues.push(p.image+':comparison slider missing');
      for(let j=0;j<h.shots.length;j++){
       const sh=h.shots[j],wrap=el.querySelectorAll('.typeset-shot-crop')[j],img=wrap?.querySelector('img');
       if(!wrap||wrap.dataset.crop!==JSON.stringify([0,0,...sh.size]))issues.push(p.image+':screenshot complete-image binding');
       if(!img||img.getAttribute('src')!==sh.src||img.naturalWidth!==sh.size[0]||img.naturalHeight!==sh.size[1])issues.push(p.image+':screenshot source');
       if(wrap&&img){
        const wr=wrap.getBoundingClientRect(),ir=img.getBoundingClientRect(),scale=Math.min(wr.width/sh.size[0],wr.height/sh.size[1],1.25);
        if(scale<=0||ir.width<=0||ir.height<=0||Math.abs(ir.width-sh.size[0]*scale)>1.5||Math.abs(ir.height-sh.size[1]*scale)>1.5||ir.left<wr.left-1.5||ir.top<wr.top-1.5||ir.right>wr.right+1.5||ir.bottom>wr.bottom+1.5)issues.push(p.image+':screenshot clipped, stretched or has no visible area');
       }
      }
      shots++;
     }
    }
    if(s.shape==='card'&&s.primary_href){const main=host.querySelector('[data-synthetic="legacy-card-primary"]');if(!main||main.getAttribute('href')!==s.primary_href)issues.push(p.image+':synthetic card primary target');else{const er=main.getBoundingClientRect();if(Math.max(Math.abs(er.left-r.left),Math.abs(er.top-r.top),Math.abs(er.width-r.width),Math.abs(er.height-r.height))>1.5)issues.push(p.image+':synthetic card primary geometry');targets.push(s.primary_href);}}
    for(const card of p.interactive_cards||[]){const surface=[...host.querySelectorAll('.typeset-card-feedback')].find(el=>el.dataset.cardId===card.id),main=surface?.querySelector('.raster-card-main');if(!surface||!main||main.getAttribute('href')!==card.href)issues.push(p.image+':new card feedback target '+card.id);else{const er=surface.getBoundingClientRect(),want=sourceBox(win,host,card.rect);if(rectError(er,want)>1.5)issues.push(p.image+':new card feedback geometry '+card.id);targets.push(card.href);}}
   }
  }
  for(const link of doc.querySelectorAll('.toc a[href]'))targets.push(link.getAttribute('href'));
  for(const h of targets){const u=new URL(h,win.location.href);if(u.origin!==win.location.origin)continue;
   if(u.pathname===win.location.pathname&&u.hash){if(!doc.getElementById(decodeURIComponent(u.hash.slice(1))))issues.push('anchor target missing '+h);}
  }
  // Hit-testing checks the actual top element, including sticky navigation and neighbouring overlays.
  let hitChecks=0;const hitDiagnostics=[];
  for(const el of doc.querySelectorAll('.typeset-part:not([hidden]) :is(.hotspot,.b2-image-action,.typeset-screenshot)')){
   const synthetic=!el.dataset.hotId&&(el.dataset.synthetic||el.classList.contains('card-main')||el.classList.contains('raster-card-main'));
   const probes=synthetic?[[.1,.1],[.5,.1],[.9,.1],[.1,.5],[.5,.5],[.9,.5],[.1,.9],[.5,.9],[.9,.9]]:[[.5,.5]];
   // Each original card point must be reachable after scrolling. A fixed
   // back-to-top button can legitimately cover a bottom-viewport point;
   // move that same document point, never exempt the covering element.
   for(const [x,y]of probes){const before=el.getBoundingClientRect();win.scrollTo({top:win.scrollY+before.top+before.height*y-260,behavior:'instant'});
    await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
    const b=el.getBoundingClientRect(),px=b.left+b.width*x,py=b.top+b.height*y,top=doc.elementFromPoint(px,py),part=el.closest('.typeset-part'),internal=synthetic&&top&&part.contains(top)&&top.closest('[data-hot-id],.typeset-live,.b2-native,.typeset-screenshot');
    if(px<0||px>=width||py<0||py>=win.innerHeight||top!==el&&!el.contains(top)&&!internal){issues.push('hotspot obstructed '+(el.dataset.hotId||el.dataset.synthetic||el.className));hitDiagnostics.push({screen:el.closest('[data-screen]')?.dataset.screen,hot_id:el.dataset.hotId||el.dataset.synthetic||null,probe:[px,py],scroll_y:win.scrollY,blocker:top?{tag:top.tagName,class_name:top.className,id:top.id,href:top.getAttribute('href')}:null});}hitChecks++;
   }
  }
  win.scrollTo(0,0);
  const content=await contentAcceptance(win,doc,d);issues.push(...content.issues);
  for(const s of d.screens)for(const id of s.screen_anchors||[])if(!ids.includes(id))issues.push('source anchor missing '+id);
   const grids=[...doc.querySelectorAll('.typeset-card-grid')].map(g=>{const css=win.getComputedStyle(g),columns=css.gridTemplateColumns.split(' '),gap=parseFloat(css.columnGap)||0,track=(g.clientWidth-(columns.length-1)*gap)/columns.length;return {cards:g.children.length,columns:columns.length,fills_track:[...g.children].every(c=>Math.abs(c.getBoundingClientRect().width-track)<1)};});
   if(d.page==='projects-home'&&(!grids.length||grids.some(g=>g.columns!==(width<768?1:2))))issues.push('project card grid columns');
   if(grids.some(g=>!g.fills_track))issues.push('project card does not fill grid track');
  return {width,height:1000,route:url,browser_condition:win.matchMedia('(prefers-reduced-motion:reduce)').matches?'reduce':'no-preference',images:images.length,active_parts:parts,hotspots,live_slots:live,screenshot_slots:shots,content_acceptance:content,hit_checks:hitChecks,hit_diagnostics:hitDiagnostics,geometry_diagnostics:geometryDiagnostics,geometry_semantics:geometrySemantics,scroll_width:doc.documentElement.scrollWidth,ids,internal_targets:targets,grids,issues:[...new Set(issues)],status:issues.length?'fail':'pass'};
 }
 const effectNames=new Set(['cards','numbers','dots','arrows','screen_enter','seam','depth','update','ambient','back_top','footer_signature','navigation','viewer','brief','live','screenshots','compare','card_feedback']);
 const geometryKeys=['cards','numbers','dots','arrows'];
 const unique=xs=>[...new Set(xs)],equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 function rectOf(item){return Array.isArray(item)?item:item?.rect;}
 function floatingCardCount(screen,part){if(screen.shape==='card')return 0;const excluded=[...(part.interactive_cards||[]),...(part.card_text_only||[])].map(c=>c.rect);return(part.cards||[]).filter(r=>!excluded.some(q=>Math.max(0,Math.min(r[0]+r[2],q[0]+q[2])-Math.max(r[0],q[0]))*Math.max(0,Math.min(r[1]+r[3],q[1]+q[3])-Math.max(r[1],q[1]))>Math.min(r[2]*r[3],q[2]*q[3])*.7)).length;}
 async function cssRules(doc){const list=[];function visit(rules){for(const rule of rules){if(rule.selectorText)list.push(rule);if(rule.cssRules)visit(rule.cssRules);}}
  for(const sheet of doc.styleSheets){try{visit(sheet.cssRules);}catch(error){
   const proof=build.oss_objects?.[sheet.href];if(!proof)throw Error('External CSS has no bound actual object: '+sheet.href);
   const response=await fetch(sheet.href,{mode:'cors',credentials:'omit'}),buffer=await response.arrayBuffer();
   if(response.status!==200||buffer.byteLength!==proof.bytes||await hashBytes(buffer)!==proof.sha256)throw Error('External CSS bytes differ: '+sheet.href);
   const parsed=new doc.defaultView.CSSStyleSheet();parsed.replaceSync(new TextDecoder().decode(buffer));visit(parsed.cssRules);
  }}return list;}
 function selectorParts(text){let depth=0,start=0;const parts=[];for(let i=0;i<text.length;i++){if(text[i]==='('||text[i]==='[')depth++;else if(text[i]===')'||text[i]===']')depth--;else if(text[i]===','&&depth===0){parts.push(text.slice(start,i));start=i+1;}}parts.push(text.slice(start));return parts;}
 function feedbackRules(el,rules){return rules.filter(rule=>/:(hover|active|focus-visible)/.test(rule.selectorText)&&selectorParts(rule.selectorText).some(selector=>{try{return el.matches(selector.replace(/:(hover|active|focus-visible)/g,'').replace(/::?(before|after)/g,''));}catch{return false;}})).map(rule=>({selector:rule.selectorText,transform:rule.style.transform,opacity:rule.style.opacity,outline:rule.style.outline,box_shadow:rule.style.boxShadow}));}
 async function normalEffects(url,width){
  // Start with an empty viewport so first-entry animations cannot finish while
  // image decoding runs. Expand the real viewport after attaching observers.
  const {win,doc}=await load(url,width,{audit:false,initialHeight:1}),data=JSON.parse(doc.querySelector('#page-data').textContent),issues=[];
  const observed=new Set(),samples=[],sampleIds=new Set(),observedDots=new Set(),rules=await cssRules(doc);
  const counts=Object.fromEntries(geometryKeys.map(key=>[key,0]));let running=0,binding=true,nativeBound=true,backTopCheck=null,normalMedia=null;
  const stateObserved={normal_branch:new URL(win.location.href).searchParams.get('audit')!=='1'&&doc.body.dataset.audit!=='true',reduced_motion:win.matchMedia('(prefers-reduced-motion:reduce)').matches,hidden:doc.hidden};
  const capabilityCounts={cards:0,numbers:0,arrows:0,screenshots:0,card_feedback:0},partCapabilities=[];
  if(!data.typeset)issues.push('normal route did not select the current typeset page');
  if(!stateObserved.normal_branch)issues.push('normal branch unexpectedly entered audit mode');
  if(stateObserved.reduced_motion||stateObserved.hidden)issues.push('normal effects require visible page and no reduced motion');
  function capture(){
   const animations=doc.getAnimations().filter(a=>a.playState==='running');running=Math.max(running,animations.length);
   if(doc.body.dataset.sampleDepth==='on'&&win.SiteSamples?.options.depth&&[...doc.querySelectorAll('.typeset-part:not([hidden])')].some(el=>el.style.getPropertyValue('--sample-y')&&win.getComputedStyle(el).translate!=='none'))observed.add('depth');
   if(doc.querySelector('.ambient-motion .watercolour-wash')?.getAnimations().some(a=>a.playState==='running'))observed.add('ambient');
   for(const el of doc.querySelectorAll('.sample-overlay,.entering,.sample-seam,.sample-updated')){
    let kind=el.classList.contains('sample-card')?'cards':el.classList.contains('number-roll')?'numbers':el.classList.contains('status-pulse')?'dots':el.classList.contains('arrow-flow')?'arrows':el.classList.contains('entering')?'screen_enter':el.classList.contains('sample-seam')?'seam':el.classList.contains('sample-updated')?'update':null;
    if(!kind)continue;
    if(el.classList.contains('sample-overlay')&&win.getComputedStyle(el).pointerEvents!=='none')issues.push('decorative motion overlay intercepts pointer events: '+kind);
    const host=el.closest('.typeset-part'),screen=el.closest('.typeset-screen'),active=el.getAnimations({subtree:true}).filter(a=>a.playState==='running');
    const pseudo=kind==='seam'?'::before':kind==='update'?'::after':null,style=win.getComputedStyle(el,pseudo);
    if(!active.length&&(style.animationName==='none'||style.animationPlayState!=='running'))continue;
    let bound=true;
    if(geometryKeys.includes(kind)){
     const r=el._motionRect,layout=host?._layout,entries=layout?.[kind]||[];
     bound=!!host&&!host.hidden&&Array.isArray(r)&&entries.some(entry=>equal(rectOf(entry),r));
     if(bound)bound=rectError(baseBox(el),sourceBox(win,host,r))<=2;
     if(kind==='dots'&&data.motion_capabilities?.dots?.policy==='current-active-status-v1'&&!entries.some(entry=>equal(rectOf(entry),r)&&entry.state==='active'&&entry.policy==='current-active-status-v1')){bound=false;issues.push('breathing dot is not a current active status marker');}
     if(kind==='numbers'){
      const number=entries.find(entry=>equal(rectOf(entry),r));
      if(number?.notation==='circled'&&el.querySelector('.number-track')?.lastElementChild?.textContent!==number.text){bound=false;issues.push('circled number loses its final original glyph');}
     }
     if(!bound){binding=false;issues.push('normal effect not bound to current part geometry: '+kind+' '+(host?.dataset.part||''));}
    }
    if(bound){observed.add(kind);if(kind==='dots')observedDots.add(host.dataset.part+':'+el.dataset.effectKey);}
    const id=kind+':'+(host?.dataset.part||screen?.dataset.screen||'')+':'+(el.dataset.effectKey||JSON.stringify(el._motionRect)||'');
    if(!sampleIds.has(id)){sampleIds.add(id);const diagnostic=!bound&&geometryKeys.includes(kind)?{geometry_actual:baseBox(el),geometry_expected:sourceBox(win,host,el._motionRect),parent_class:el.parentElement?.className}:{};samples.push({kind,effect_key:el.dataset.effectKey||null,screen:screen?.dataset.screen||null,part:host?.dataset.part||null,rect:el._motionRect||null,layout_bound:bound,running_animations:active.length,animation_name:style.animationName,...diagnostic});}
   }
  }
  const sampling=win.setInterval(capture,40),observer=new win.MutationObserver(()=>win.queueMicrotask(capture));observer.observe(doc.querySelector('.paper'),{subtree:true,childList:true,attributes:true,attributeFilter:['class','style'],characterData:true});
  try{
   frame.height='1000';win.scrollTo({top:0,behavior:'instant'});await sleep(180);
   const layoutDeadline=performance.now()+decodeWait;
   while(!win.eval("typeof resizing!=='undefined'&&!resizing&&typeof typesetReadingState!=='undefined'&&typesetReadingState.width===innerWidth&&typesetReadingState.height===innerHeight")){if(performance.now()>layoutDeadline)throw Error('normal effects viewport layout did not settle');await sleep(50);}
   const normalImages=[...doc.images].filter(i=>i.getAttribute('src'));
   await Promise.race([Promise.all(normalImages.map(i=>i.decode().catch(()=>{}))),sleep(decodeWait).then(()=>{throw Error('normal image decode timeout');})]);
   normalMedia={images:normalImages.length,failed_images:normalImages.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc||i.src),bird_atlas:normalImages.filter(i=>(i.currentSrc||i.src).includes('/bird-atlas.')).map(i=>({src:i.currentSrc||i.src,loaded:i.complete&&i.naturalWidth>0,natural_width:i.naturalWidth,natural_height:i.naturalHeight}))};if(normalMedia.failed_images.length)issues.push('normal image decode incomplete: '+normalMedia.failed_images.join(', '));
   capture();
   const model=new Map(data.screens.map(screen=>[screen.id,screen]));
   for(const section of doc.querySelectorAll('.typeset-screen')){
    const screen=model.get(section.dataset.screen);
    if(hiddenGrafanaGroups(win,section,screen)){for(const host of section.querySelectorAll('.typeset-part:not([hidden])'))partCapabilities.push({part:host.dataset.part,source_bound:true,unavailable:'grafana_groups_unreadable'});continue;}
    for(const host of section.querySelectorAll('.typeset-part:not([hidden])')){
     const part=screen?.parts[[...section.querySelectorAll('.typeset-part')].indexOf(host)],layout=host._layout,im=host.querySelector('picture img');
     if(!part||!layout||!equal(layout,part)||im.getAttribute('src')!==part.src){binding=false;issues.push('normal layout/image binding differs: '+host.dataset.part);continue;}
     partCapabilities.push({part:host.dataset.part,source_bound:true,counts:{cards:floatingCardCount(screen,part),numbers:part.numbers.length,dots:part.dots.length,arrows:part.arrows.length}});
     capabilityCounts.cards+=floatingCardCount(screen,part);capabilityCounts.numbers+=part.numbers.length;capabilityCounts.arrows+=part.arrows.length;
     capabilityCounts.screenshots+=part.hotspots.filter(h=>h.kind==='screenshot').length;
     capabilityCounts.card_feedback+=(part.interactive_cards||[]).length+(screen.shape==='card'&&screen.primary_href?1:0);
     const positions=[0];
     for(const key of geometryKeys){const entries=part[key]||[];counts[key]+=entries.length;
      for(const entry of entries){const r=rectOf(entry);if(!Array.isArray(r)||r.length!==4||r.some(n=>!Number.isFinite(n))||r[0]<0||r[1]<0||r[2]<=0||r[3]<=0||r[0]+r[2]>1.002||r[1]+r[3]>1.002){binding=false;issues.push('invalid current motion rectangle: '+host.dataset.part+' '+key);}}
      if(entries.length)positions.push(...(key==='dots'?entries:[entries[0]]).map(entry=>rectOf(entry)[1]*host._mediaHeight));
     }
     const slots=[...host.querySelectorAll('[data-typeset-kind=live]')];
     if(slots.length&&slots.every(el=>el.textContent.trim()||el.tagName==='INPUT'||el.classList.contains('typeset-lamp')||el.dataset.b2Slot==='ca-toast'))observed.add('live');
     for(const hot of part.hotspots.filter(h=>h.action)){
      const el=[...host.querySelectorAll('[data-hot-id]')].find(e=>e.dataset.hotId===hot.id);
      if(!el||el.tagName!=='BUTTON'||el.type!=='button'||el.dataset.b2Action!==hot.action||typeof el.onclick!=='function'){nativeBound=false;issues.push('native action is not bound to a button: '+hot.id);}
     }
     for(const y of unique(positions.map(n=>Math.round(n)))){const b=host.getBoundingClientRect();win.scrollTo({top:Math.max(0,win.scrollY+b.top+y-250),behavior:'instant'});await new Promise(resolve=>win.requestAnimationFrame(()=>{capture();win.requestAnimationFrame(resolve);}));await sleep(100);capture();}
     if(data.motion_capabilities?.dots?.policy==='current-active-status-v1')for(let i=0;i<(part.dots||[]).length;i++)if(!observedDots.has(host.dataset.part+':dot:'+i)&&missingMotion(width,'dots',host.dataset.part,'dot:'+i))issues.push('active status dot has no normal animation observation: '+host.dataset.part+' '+i);
    }
   }
   const slot=doc.querySelector('.typeset-part:not([hidden]) .slot[data-slot],.typeset-part:not([hidden]) .b2-slot[data-b2-slot]:not(input)');
   if(slot){const text=slot.querySelector('span'),previous=text?.textContent,title=slot.getAttribute('title'),marker=doc.createTextNode(' · QA');
    {const b=slot.getBoundingClientRect();win.scrollTo({top:Math.max(0,win.scrollY+b.top-250),behavior:'instant'});await sleep(100);capture();
     // A reversible local state change exercises the site's existing observer;
     // no status endpoint or native authority action is invoked.
     slot.title=(title||slot.textContent.trim())+' · QA';if(text)text.textContent=previous+' · QA';else slot.append(marker);await sleep(100);capture();if(text)text.textContent=previous;else marker.remove();if(title===null)slot.removeAttribute('title');else slot.setAttribute('title',title);await sleep(40);
    }
   }
   const hotspots=[...doc.querySelectorAll('.typeset-part:not([hidden]) .hotspot')],cssFeedback=hotspots.every(el=>feedbackRules(el,rules).some(rule=>rule.opacity==='1'||rule.transform&&rule.transform!=='none'||rule.outline||rule.box_shadow&&rule.box_shadow!=='none'));
   if(!cssFeedback)issues.push('normal hotspot CSS feedback is missing');
   const cards=[...doc.querySelectorAll('.typeset-card-feedback,.raster-card,.typeset-screen.shape-card:has(.card-main)')];
   if(cards.some(card=>feedbackRules(card,rules).some(rule=>rule.transform&&rule.transform!=='none'||rule.outline||rule.box_shadow&&rule.box_shadow!=='none'))&&!doc.body.classList.contains('motion-off'))observed.add('card_feedback');
   const menu=doc.querySelector('#menu'),menuTrigger=doc.querySelector('#open-menu,a[href="#menu"]'),menuClose=doc.querySelector('.close-menu');
   if(win.SiteToc?.update&&menuTrigger&&menu&&menuClose){menuTrigger.click();const opened=menu.open;await closeDialog(menu,menuClose);if(opened&&!menu.open&&win.SiteToc.update().entries.length)observed.add('navigation');}
   const viewer=doc.querySelector('#image-viewer'),viewerImage=doc.querySelector('.typeset-part:not([hidden]) picture img');
   if(win.SiteImageViewer?.openGallery&&viewerImage&&viewer){win.SiteImageViewer.openGallery([{src:viewerImage.src,title:'本地程序验收'}]);const opened=viewer.open&&!!viewer.querySelector('.viewer-stage img').getAttribute('src');await closeDialog(viewer,viewer.querySelector('.viewer-close'));if(opened&&!viewer.open)observed.add('viewer');}
   if(win.SiteBrief?.open){win.SiteBrief.open();const brief=doc.querySelector('#ai-brief'),goal=brief?.querySelector('input[name=goal]');if(goal){goal.value='核对当前页面';goal.dispatchEvent(new win.Event('input',{bubbles:true}));if(brief.open&&!brief.querySelector('.brief-copy').disabled&&brief.querySelector('.brief-preview').textContent.length<=150)observed.add('brief');await closeDialog(brief,brief.querySelector('.brief-close'));}}
   for(const el of doc.querySelectorAll('.typeset-part:not([hidden]) .typeset-screenshot')){
    const range=el.querySelector('input[type=range]'),trigger=range?el.querySelector('.typeset-compare-open'):el;
    if(range){const value=range.value;range.value='27';range.dispatchEvent(new win.Event('input',{bubbles:true}));if(el.style.getPropertyValue('--compare-position')==='27%')observed.add('compare');range.value=value;range.dispatchEvent(new win.Event('input',{bubbles:true}));}
    trigger?.click();if(viewer?.open&&viewer.querySelector('.viewer-stage img').getAttribute('src'))observed.add('screenshots');await closeDialog(viewer,viewer?.querySelector('.viewer-close'));
   }
   const footer=doc.querySelector('footer'),signature=doc.querySelector('.footer-signature-trigger');
   if(footer&&signature&&typeof signature.onclick==='function'){win.scrollTo({top:doc.documentElement.scrollHeight,behavior:'instant'});signature.click();for(let n=0;n<20;n++){if(doc.querySelector('.footer-landscape.is-celebrating')||doc.querySelector('.footer-bubble:not([hidden])')){observed.add('footer_signature');break;}await sleep(30);}}
   const top=doc.querySelector('.back-to-top');
   if(top&&typeof top.onclick==='function'){const max=Math.max(0,doc.documentElement.scrollHeight-win.innerHeight),dest=Math.min(max,win.innerHeight*.8);win.scrollTo({top:dest,behavior:'instant'});await sleep(80);const before=win.scrollY;backTopCheck={requested_scroll_y:dest,scroll_y_before:before,button_hidden:top.hidden,samples:[before]};top.click();for(let n=0;n<90&&win.scrollY>2;n++){await sleep(40);backTopCheck.samples.push(win.scrollY);}backTopCheck.scroll_y_after=win.scrollY;if(before>2&&win.scrollY<=2)observed.add('back_top');}
   capture();win.scrollTo({top:0,behavior:'instant'});
   return {width:win.innerWidth,height:win.innerHeight,browser_condition:stateObserved.reduced_motion?'reduce':'no-preference',normal_media:normalMedia,normal_branch:stateObserved.normal_branch,reduced_motion:stateObserved.reduced_motion,hidden:stateObserved.hidden,new_geometry_bound:binding,geometry_counts:counts,capability_counts:capabilityCounts,part_capabilities:partCapabilities,effects_capabilities:data.motion_capabilities,running_animation_count:running,hotspot_css_feedback:cssFeedback,hotspot_count:hotspots.length,native_buttons_bound:nativeBound,hero_video_attached:!!doc.querySelector('video.hero-video'),video_spec:data.video||null,motion_appearance:win.SiteMotionAppearance||null,preserved:[...observed],back_top_check:backTopCheck,samples,issues:unique(issues)};
  }finally{win.clearInterval(sampling);observer.disconnect();}
 }
 async function checkEffects(entry){
  const expected=entry.effects_expected,checks=[],issues=[];
  const currentAbsent=(c,name)=>{const cap=entry.effects_capabilities?.[name];return cap?.policy==='current-bound-layout-v1'&&cap.status==='no_corresponding_element'&&cap.count_h===0&&cap.count_v===0&&equal(c.effects_capabilities?.[name],cap)&&c.capability_counts?.[name]===0&&c.new_geometry_bound;};
  const currentPartAbsent=(c,old)=>{const matches=(c.part_capabilities||[]).filter(part=>part.part===old.part),part=matches[0];return c.new_geometry_bound&&matches.length===1&&part.source_bound&&(geometryKeys.includes(old.kind)&&part.counts?.[old.kind]===0||old.kind==='seam'&&part.unavailable==='grafana_groups_unreadable');};
  if(!Array.isArray(expected)||expected.some(name=>!effectNames.has(name)))issues.push('build effects inventory is missing or invalid');
  for(const width of [1440,390])try{let c=await normalEffects(entry.url,width);
   for(let n=0;n<3&&baseline&&(prior(width)?.preserved?.some(k=>!currentAbsent(c,k)&&!c.preserved.includes(k))||prior(width)?.motion?.some(o=>!currentAbsent(c,o.kind)&&!currentPartAbsent(c,o)&&!c.samples.some(s=>s.kind===o.kind&&s.part===o.part&&(!o.key||s.effect_key===o.key)))||c.issues.some(x=>x.startsWith('active status dot has no normal animation observation:')));n++){const v=await normalEffects(entry.url,width);if(!equal(c.geometry_counts,v.geometry_counts)||!equal(c.capability_counts,v.capability_counts))v.issues.push('retry layout inventory changed');const samples=[...new Map([...c.samples,...v.samples].map(s=>[[s.kind,s.part,s.effect_key,JSON.stringify(s.rect)].join(':'),s])).values()],preserved=unique([...c.preserved,...v.preserved]),notes=unique([...c.issues,...v.issues]).filter(x=>{const m=x.match(/active status dot has no normal animation observation: (\S+) (\d+)$/);return !m||!samples.some(s=>s.kind==='dots'&&s.part===m[1]&&s.effect_key==='dot:'+m[2]);});c={...v,samples,preserved,issues:notes,running_animation_count:Math.max(c.running_animation_count,v.running_animation_count),normal_branch:c.normal_branch&&v.normal_branch,new_geometry_bound:c.new_geometry_bound&&v.new_geometry_bound,hotspot_css_feedback:c.hotspot_css_feedback&&v.hotspot_css_feedback,native_buttons_bound:c.native_buttons_bound&&v.native_buttons_bound};}
   checks.push(c);}catch(error){checks.push({width,issues:[String(error)],preserved:[],normal_branch:false,new_geometry_bound:false,hotspot_css_feedback:false,native_buttons_bound:false,geometry_counts:{cards:0,numbers:0,dots:0,arrows:0},running_animation_count:0});}
  const preserved=unique(checks.flatMap(c=>c.preserved)),geometrySha=entry.geometry_sha256||entry.geometry_binding?.sha256||build.geometry_sha256||build.geometry_snapshot?.sha256||null;
  issues.push(...checks.flatMap(c=>c.issues));
  if(entry.motion_appearance&&checks.some(c=>!equal(c.motion_appearance,entry.motion_appearance)))issues.push('normal runtime uses a different motion appearance');
  const dots=entry.effects_capabilities?.dots;
  if(dots&&(dots.policy!=='current-active-status-v1'||!['present','no_corresponding_element'].includes(dots.status)||(dots.status==='present')!==expected.includes('dots')||(dots.status==='present')!==checks.some(c=>c.geometry_counts.dots>0)))issues.push('current active-status capability does not match the expected effects');
  for(const name of ['cards','numbers','arrows','screenshots','card_feedback']){const cap=entry.effects_capabilities?.[name];if(!cap){if(checks.some(c=>c.effects_capabilities?.[name]))issues.push('build current layout capability is missing: '+name);continue;}
   if(cap.policy!=='current-bound-layout-v1'||!['present','no_corresponding_element'].includes(cap.status)||(cap.status==='present')!==expected?.includes(name)||checks.some(c=>!equal(c.effects_capabilities?.[name],cap)||c.capability_counts?.[name]!==cap[c.width<768?'count_v':'count_h']))issues.push('current layout capability does not match normal branch: '+name);
   for(const c of checks)if(c.capability_counts?.[name]>0&&!c.preserved.includes(name)&&missingMotion(c.width,name))issues.push('current effect has no normal-branch observation at '+c.width+': '+name);
  }
  for(const c of checks)for(const name of new Set([...(expected||[]),...(prior(c.width)?.preserved||[])]))if(!currentAbsent(c,name)&&!c.preserved.includes(name)&&missingMotion(c.width,name))issues.push('original effect has no normal-branch observation at '+c.width+': '+name);for(const c of checks)for(const old of prior(c.width)?.motion||[])if(!currentAbsent(c,old.kind)&&!currentPartAbsent(c,old)&&!c.samples?.some(x=>x.kind===old.kind&&x.part===old.part&&(!old.key||x.effect_key===old.key)&&x.layout_bound))issues.push('screen effect regressed at '+c.width+': '+old.part+' '+old.kind);
  if(!/^[a-f0-9]{64}$/.test(geometrySha||''))issues.push('current geometry snapshot hash is missing');
  return {status:issues.length?'fail':'pass',expected:expected||[],preserved,issues:unique(issues),evidence:{normal_branch:checks.every(c=>c.normal_branch),new_geometry_bound:checks.every(c=>c.new_geometry_bound),geometry_sha256:geometrySha,geometry_counts:Object.fromEntries(geometryKeys.map(key=>[key,checks.reduce((n,c)=>n+c.geometry_counts[key],0)])),running_animation_count:Math.max(0,...checks.map(c=>c.running_animation_count)),hotspot_css_feedback:checks.every(c=>c.hotspot_css_feedback),native_buttons_bound:checks.every(c=>c.native_buttons_bound),checks}};
 }
 async function hashBytes(buffer){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))].map(n=>n.toString(16).padStart(2,'0')).join('');}
 async function videoFiles(entry){
  const files=[];
  for(const kind of ['video','mask']){const prefix=kind==='video'?'src':'mask',spec=entry.video_expected,url=new URL(spec[prefix],new URL(entry.url,location.origin)).href,item={kind,url,http_status:null,bytes:null,sha256:null,expected_bytes:spec[prefix+'_bytes'],expected_sha256:spec[prefix+'_sha256'],status:'fail'};
   try{const response=await fetch(url,{cache:'no-store'}),buffer=await response.arrayBuffer();item.http_status=response.status;item.bytes=buffer.byteLength;item.sha256=await hashBytes(buffer);if(response.status===200&&item.bytes===item.expected_bytes&&item.sha256===item.expected_sha256)item.status='pass';}catch(error){item.issue=String(error);}files.push(item);
  }return files;
 }
 function videoPosition(win,doc,section){
  const r=section?.getBoundingClientRect();
  return {scroll_y:win.scrollY,scroll_top:doc.scrollingElement?.scrollTop??null,scroll_height:doc.documentElement.scrollHeight,viewport_width:win.innerWidth,viewport_height:win.innerHeight,section_rect:r?{top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}:null,section_visible:!!r&&!!section.getClientRects().length&&r.bottom>0&&r.top<win.innerHeight};
 }
 async function positionVideo(win,doc,section,offscreen){
  // Expanding the real iframe may still be restoring its previous reading point.
  // Reuse the normal-effects readiness condition before intentional positioning.
  const layoutDeadline=performance.now()+decodeWait;
  while(!win.eval("typeof resizing!=='undefined'&&!resizing&&typeof typesetReadingState!=='undefined'&&typesetReadingState.width===innerWidth&&typesetReadingState.height===innerHeight")){
   if(performance.now()>layoutDeadline)throw Error('video viewport layout did not settle');
   await sleep(50);
  }
  // Resize/layout restoration can run after a fixed timeout, particularly
  // when several QA tabs decode images together. Exercise real scrolling and
  // wait for the requested position and rectangle to stay stable instead.
  const samples=[];let previous=null,stable=0,target=0;
  for(let n=0;n<30;n++){
   target=offscreen?Math.max(0,doc.documentElement.scrollHeight-win.innerHeight):0;
   if(n===0||Math.abs(win.scrollY-target)>1)win.scrollTo({top:target,behavior:'instant'});
   await sleep(80);const p=videoPosition(win,doc,section);samples.push(p);
   const placed=p.viewport_height===1000&&Math.abs(p.scroll_y-target)<=1&&(!offscreen||!p.section_visible);
   const unchanged=previous&&Math.abs(p.scroll_y-previous.scroll_y)<=1&&p.scroll_height===previous.scroll_height&&p.viewport_height===previous.viewport_height&&p.section_rect&&previous.section_rect&&Math.abs(p.section_rect.top-previous.section_rect.top)<=1&&Math.abs(p.section_rect.bottom-previous.section_rect.bottom)<=1;
   stable=placed?(unchanged?stable+1:1):0;previous=p;
   if(stable>=3)return {method:'native_scroll_and_stable_geometry',requested_scroll_y:target,stable:true,samples};
  }
  return {method:'native_scroll_and_stable_geometry',requested_scroll_y:target,stable:false,samples};
 }
 async function waitHeroPlaying(win,doc){
  for(let n=0;n<180;n++){const v=doc.querySelector('video.hero-video');if(v&&!v.hidden&&!v.paused&&v.readyState>=2&&win.SiteHero?.phase==='playing')return true;await sleep(80);}return false;
 }
 async function waitHeroStopped(win,doc){
  const started=Date.now(),samples=[];
  for(let n=0;n<30;n++){
   const v=doc.querySelector('video.hero-video'),phase=win.SiteHero?.phase||null;
   samples.push({elapsed_ms:Date.now()-started,phase,attached:!!v,video_paused:v?.paused??null,video_hidden:v?.hidden??null,current_time:v?.currentTime||0});
   if(phase==='image'&&(!v||v.paused&&v.hidden))return {observed:true,samples};
   await sleep(80);
  }
  return {observed:false,samples};
 }
 async function videoGate(entry,caseName){
  const width=caseName==='below_width'?1023:caseName==='portrait'?390:1440,expectedPlaying=caseName==='desktop'&&entry.video_expected.mount_allowed!==false;
  const {win,doc}=await load(entry.url,width,{audit:false,initialHeight:1});
  const data=JSON.parse(doc.querySelector('#page-data').textContent),section=doc.querySelector('.typeset-screen .typeset-part[data-orientation=h]')||doc.querySelector('.screen');
  frame.height='1000';
  const visiblePosition=await positionVideo(win,doc,section,false);let beforeScroll=null;
  if(caseName==='offscreen'&&entry.video_expected.mount_allowed!==false){
   const started=await waitHeroPlaying(win,doc),v=doc.querySelector('video.hero-video');
   beforeScroll={...videoPosition(win,doc,section),playing:started,phase:win.SiteHero?.phase||null,current_time:v?.currentTime||0,video_paused:v?.paused??null,video_hidden:v?.hidden??null};
  }
  const placement=caseName==='offscreen'?await positionVideo(win,doc,section,true):visiblePosition;
  const gate={case:caseName,width:win.innerWidth,height:win.innerHeight,browser_condition:win.matchMedia('(prefers-reduced-motion:reduce)').matches?'reduce':'no-preference',expected_mounted:expectedPlaying,expected_playing:expectedPlaying,mounted:false,playing:false,attached:false,hidden:doc.hidden,reduced_motion:win.matchMedia('(prefers-reduced-motion:reduce)').matches,portrait:win.matchMedia('(orientation:portrait)').matches,section_visible:false,phase:win.SiteHero?.phase||null,time_advanced:false,status:'fail',issues:[]};
  const spec=entry.video_expected;
  gate.scroll_placement=placement;gate.before_scroll=beforeScroll;
  if(!placement.stable)gate.issues.push('native video viewport/scroll geometry did not settle');
  if(caseName==='offscreen'&&entry.video_expected.mount_allowed!==false&&(!beforeScroll?.playing||!beforeScroll.section_visible||beforeScroll.video_paused||beforeScroll.video_hidden))gate.issues.push('offscreen transition did not start from actual visible playback');
  if(!data.video||!equal(data.video.rect,spec.rect)||data.video.src!==spec.src||data.video.mask!==spec.mask)gate.issues.push('normal hero does not bind expected video/mask/geometry');
  const condition=()=>caseName==='reduced_motion'?win.matchMedia('(prefers-reduced-motion:reduce)').matches:caseName==='document_hidden'?doc.hidden:!win.matchMedia('(prefers-reduced-motion:reduce)').matches&&!doc.hidden;
  if(!condition())gate.issues.push('required native browser condition not observed');
  if(expectedPlaying)await waitHeroPlaying(win,doc);
  else{gate.pause_observation=await waitHeroStopped(win,doc);if(!gate.pause_observation.observed)gate.issues.push('native hero pause/hide response was not observed');}
  const video=doc.querySelector('video.hero-video'),before=video?.currentTime||0;gate.position_before=videoPosition(win,doc,section);
  const observedAt=Date.now();gate.playback_samples=[{elapsed_ms:0,current_time:before}];
  await sleep(350);gate.playback_samples.push({elapsed_ms:Date.now()-observedAt,current_time:video?.currentTime||0});
  // Decoder startup under concurrent page checks may outlast one fixed sample.
  // Require real playback advancement within a bound; never infer it from play().
  while(expectedPlaying&&video&&Math.abs(video.currentTime-before)<=.01&&Date.now()-observedAt<2000){await sleep(100);gate.playback_samples.push({elapsed_ms:Date.now()-observedAt,current_time:video.currentTime});}
  gate.position_after=videoPosition(win,doc,section);
  const rect=section?.getBoundingClientRect();Object.assign(gate,{width:win.innerWidth,height:win.innerHeight,hidden:doc.hidden,reduced_motion:win.matchMedia('(prefers-reduced-motion:reduce)').matches,portrait:win.matchMedia('(orientation:portrait)').matches,section_visible:!!rect&&!!section.getClientRects().length&&rect.bottom>0&&rect.top<win.innerHeight,attached:!!video,mounted:!!video&&!video.hidden&&win.getComputedStyle(video).display!=='none',playing:!!video&&!video.hidden&&!video.paused&&!video.ended&&video.readyState>=2,phase:win.SiteHero?.phase||null,time_advanced:!!video&&Math.abs(video.currentTime-before)>.01,current_time_before:before,current_time_after:video?.currentTime||0,video_paused:video?video.paused:null,video_hidden:video?video.hidden:null});
  if(gate.mounted!==expectedPlaying||gate.playing!==expectedPlaying||gate.time_advanced!==expectedPlaying||expectedPlaying&&!gate.attached)gate.issues.push('video mount/play result differs from required condition');
  if(!expectedPlaying&&gate.attached&&(!gate.video_paused||!gate.video_hidden))gate.issues.push('disallowed video remained active in the retained DOM');
  if(gate.phase!==(expectedPlaying?'playing':'image'))gate.issues.push('hero runtime phase is unexpected: '+gate.phase);
  if(caseName==='offscreen'&&gate.section_visible)gate.issues.push('hero was not outside the viewport');
  if(caseName==='offscreen'&&(!gate.position_before.section_rect||!gate.position_after.section_rect||Math.abs(gate.position_after.scroll_y-gate.position_before.scroll_y)>1||Math.abs(gate.position_after.section_rect.top-gate.position_before.section_rect.top)>1||Math.abs(gate.position_after.section_rect.bottom-gate.position_before.section_rect.bottom)>1))gate.issues.push('offscreen scroll/hero rectangle changed during playback observation');
  if(caseName==='desktop'&&(!gate.section_visible||gate.portrait||gate.hidden||gate.reduced_motion))gate.issues.push('desktop condition was not visible 1440 landscape');
  if(caseName==='portrait'&&!gate.portrait)gate.issues.push('portrait media condition was not observed');
  if(!condition())gate.issues.push('native browser condition changed before observation completed');
  gate.issues=unique(gate.issues);gate.status=gate.issues.length?'fail':'pass';return gate;
 }
 async function hiddenNavigationGate(entry){
  // Headless Chrome keeps the top-level page visible when another headless tab
  // is selected. Navigating this real iframe away does emit visibilitychange
  // with hidden=true on its old document. Keep the old objects to inspect the
  // site's own pause/hide response after that event, rather than overriding it.
  const before=await videoGate(entry,'desktop'),win=frame.contentWindow,doc=win.document,runtime=win.SiteHero,video=doc.querySelector('video.hero-video'),section=doc.querySelector('.typeset-screen .typeset-part[data-orientation=h]')||doc.querySelector('.screen'),source=win.location.href;
  let timer,listener;
  const observed=new Promise((resolve,reject)=>{
   listener=()=>{if(!doc.hidden)return;
    const rect=section?.getBoundingClientRect(),style=video?win.getComputedStyle(video):null;
    const gate={case:'document_hidden',width:win.innerWidth,height:win.innerHeight,browser_condition:win.matchMedia('(prefers-reduced-motion:reduce)').matches?'reduce':'no-preference',expected_mounted:false,expected_playing:false,mounted:!!video&&!video.hidden&&style?.display!=='none'&&!doc.hidden,playing:!!video&&!video.hidden&&!video.paused&&!video.ended&&video.readyState>=2,attached:!!video,hidden:doc.hidden,reduced_motion:win.matchMedia('(prefers-reduced-motion:reduce)').matches,portrait:win.matchMedia('(orientation:portrait)').matches,section_visible:!!rect&&!!section.getClientRects().length&&rect.bottom>0&&rect.top<win.innerHeight,phase:runtime?.phase||null,time_advanced:false,current_time_before:video?.currentTime||0,current_time_after:null,video_paused:video?video.paused:null,video_hidden:video?video.hidden:null,method:'navigation_visibilitychange',visibility_event_observed:true,visibility_state:doc.visibilityState,source_url:source,endpoint:'about:blank',parent_hidden:document.hidden,before_navigation:before,status:'fail',issues:[]};
    clearTimeout(timer);doc.removeEventListener('visibilitychange',listener);resolve(gate);
   };
   doc.addEventListener('visibilitychange',listener);
   timer=setTimeout(()=>reject(Error('native iframe navigation visibilitychange was not observed')),10000);
  });
  frame.src='about:blank';
  try{const gate=await observed;await sleep(350);gate.current_time_after=video?.currentTime||0;gate.time_advanced=!!video&&gate.current_time_after>gate.current_time_before+.01;
   if(before.status!=='pass'||entry.video_expected.mount_allowed!==false&&!before.playing||!before.section_visible||before.hidden)gate.issues.push('hidden transition did not start from its required visible media state');
   if(!gate.hidden||gate.visibility_state!=='hidden'||!gate.visibility_event_observed)gate.issues.push('native hidden visibility observation is missing');
   if(gate.mounted||gate.playing||gate.time_advanced||gate.phase!=='image')gate.issues.push('hero did not stop at the native hidden transition');
   if(gate.attached&&(!gate.video_paused||!gate.video_hidden))gate.issues.push('retained hero did not pause/hide before navigation');
   if(gate.reduced_motion||gate.portrait||gate.parent_hidden)gate.issues.push('hidden transition was mixed with another blocking condition');
   gate.issues=unique(gate.issues);gate.status=gate.issues.length?'fail':'pass';return gate;
  }finally{clearTimeout(timer);doc.removeEventListener('visibilitychange',listener);}
 }
 function missingGate(caseName,issue){return {case:caseName,width:null,height:null,expected_mounted:false,expected_playing:false,mounted:null,playing:null,attached:null,hidden:null,reduced_motion:null,portrait:null,section_visible:null,phase:null,time_advanced:null,status:'fail',issues:[issue]};}
 async function environment(condition,value){
  const actual=()=>condition==='reduced_motion'?matchMedia('(prefers-reduced-motion:reduce)').matches:document.hidden;
  if(actual()===value)return true;
  if(query.get('native')!=='1')return false;
  control.phase='awaiting_native';control.request={id:++requestId,condition,value,status:'waiting'};
  nativeState.textContent='等待浏览器原生条件：'+condition+' = '+value;
  const limit=Math.max(1000,Math.min(120000,Number(query.get('native_timeout_ms'))||30000)),deadline=Date.now()+limit;
  while(actual()!==value&&Date.now()<deadline)await sleep(100);
  const observed=actual()===value;control.request={...control.request,status:observed?'observed':'unavailable'};control.phase='running';return observed;
 }
 function settleVideo(proof){proof.issues=unique([...proof.files.filter(f=>f.status!=='pass').map(f=>'video asset bytes/hash check failed: '+f.kind),...proof.gates.flatMap(g=>g.issues)]);const cases=new Set(proof.gates.map(g=>g.case)),complete=proof.files.length===2&&proof.gates.length===6&&['desktop','below_width','portrait','offscreen','reduced_motion','document_hidden'].every(name=>cases.has(name));proof.status=proof.issues.length?'fail':complete?'pass':'pending';}
 const videoNames=[];
  for(let i=0;i<names.length;i++){
  const name=names[i],p=build.pages[name],checks=[];
  control.page=name;
  state.textContent=`正在验收 ${i+1}/${names.length}：${name}`;
  if(!await environment('reduced_motion',true))throw Error('native static layout condition unavailable');
  if(p.url)for(const width of [1440,390])try{checks.push(await check(p.url,width,p));}catch(e){checks.push({width,status:'fail',issues:[String(e)]});}
  if(!await environment('reduced_motion',false))throw Error('native normal condition was not restored');
  const issues=[...(p.issues||[])];
  const effects=p.url?await checkEffects(p):{status:'fail',expected:p.effects_expected||[],preserved:[],issues:['built route is missing'],evidence:{normal_branch:false,new_geometry_bound:false,geometry_sha256:null,geometry_counts:{cards:0,numbers:0,dots:0,arrows:0},running_animation_count:0,hotspot_css_feedback:false,native_buttons_bound:false}};
  let videoChecks={status:'fail',issues:[],files:[],gates:[],mounted:false};
  if(p.video_expected===null){
   const normalChecks=effects.evidence?.checks||[],observed=normalChecks.length===2&&normalChecks.every(c=>c.normal_branch&&typeof c.hero_video_attached==='boolean'&&c.video_spec===null),hasVideo=normalChecks.some(c=>c.hero_video_attached===true);videoChecks.mounted=hasVideo;videoChecks.issues=hasVideo?['page without original video mounted a hero']:observed?[]:['current normal-branch no-video observation is missing'];videoChecks.status=observed&&!hasVideo?'pass':'fail';
  }else if(p.video_expected&&p.url){
   videoChecks.files=await videoFiles(p);
   for(const caseName of ['desktop','below_width','portrait','offscreen'])try{videoChecks.gates.push(await videoGate(p,caseName));}catch(error){videoChecks.gates.push({...missingGate(caseName,String(error)),expected_mounted:caseName==='desktop',expected_playing:caseName==='desktop'});}
   videoNames.push(name);settleVideo(videoChecks);
  }else videoChecks.issues.push('build video inventory or route is missing');
  pages[name]={url:p.url,quality_page:name,status:p.status==='built'&&checks.length===2&&checks.every(x=>x.status==='pass')&&effects.status==='pass'&&videoChecks.status==='pass'?'pass':'fail',checks,effects,video_checks:videoChecks,build_issues:issues};
  log.textContent+=`${name}：${pages[name].status}；${checks.flatMap(x=>x.issues).slice(0,3).join('；')}\n`;
  }
  // Emulate each browser condition once for all original-video pages. The
  // condition must be in place before a fresh normal-branch page is loaded.
  for(const condition of ['reduced_motion'])if(videoNames.length){
   control.page=null;const available=await environment(condition,true);
   try{for(const name of videoNames){control.page=name;const proof=pages[name].video_checks;
    state.textContent='正在验收视频降低动效条件：'+name;
    if(available)try{proof.gates.push(await videoGate(build.pages[name],condition));}catch(error){proof.gates.push(missingGate(condition,String(error)));}
    else proof.gates.push(missingGate(condition,'needs_native: real browser '+condition+' condition was not exercised'));
    settleVideo(proof);
   }}finally{control.page=null;const restored=await environment(condition,false);if(!restored)for(const name of videoNames){pages[name].video_checks.issues.push('native condition was not restored: '+condition);pages[name].video_checks.status='fail';}}
  }
  for(const name of videoNames){control.page=name;state.textContent='正在验收视频原生隐藏暂停：'+name;const proof=pages[name].video_checks;try{proof.gates.push(await hiddenNavigationGate(build.pages[name]));}catch(error){proof.gates.push(missingGate('document_hidden',String(error)));}settleVideo(proof);}
  control.request=null;
  const targets=new Map();
  for(const name of names)for(const c of pages[name].checks){
   for(const href of c.internal_targets||[]){const u=new URL(href,new URL(c.route,location.origin));if(u.origin===location.origin||u.hostname==='wly0829.cn')targets.set(u.pathname,(targets.get(u.pathname)||new Set()).add(decodeURIComponent(u.hash.slice(1))));}
  }
  const routeIds=new Map(Object.values(pages).filter(x=>x.url&&x.checks[0]?.ids).map(x=>[x.url,new Set(x.checks[0].ids)])),routeAttempts=[];
  for(const path of targets.keys())if(!routeIds.has(path)){
   try{let response;for(let attempt=0;attempt<2;attempt++)try{response=await fetch(path);routeAttempts.push({path,attempt:attempt+1,http_status:response.status});break;}catch(error){routeAttempts.push({path,attempt:attempt+1,error:String(error)});if(!(error instanceof TypeError)||attempt===1)throw error;await sleep(100);}if(!response.ok)throw Error('HTTP '+response.status);const t=await response.text(),doc=new DOMParser().parseFromString(t,'text/html'),ids=new Set([...doc.querySelectorAll('[id]')].map(x=>x.id));const d=doc.querySelector('#page-data');if(d&&['project','frozen'].includes(JSON.parse(d.textContent).kind))ids.add('ai-brief');routeIds.set(path,ids);}catch(e){routeAttempts.push({path,status:'fail',error:String(e)});routeIds.set(path,null);}
  }
  for(const name of names){const p=pages[name];for(const c of p.checks){for(const href of c.internal_targets||[]){const u=new URL(href,new URL(c.route,location.origin));if(u.origin!==location.origin&&u.hostname!=='wly0829.cn')continue;const ids=routeIds.get(u.pathname),hash=decodeURIComponent(u.hash.slice(1));if(!ids)c.issues.push('internal route unavailable '+href);else if(hash&&!ids.has(hash))c.issues.push('cross-page anchor missing '+href);}c.issues=[...new Set(c.issues)];c.status=c.issues.length?'fail':'pass';}p.status=build.pages[name].status==='built'&&p.checks.length===2&&p.checks.every(x=>x.status==='pass')&&p.effects.status==='pass'&&p.video_checks.status==='pass'?'pass':'fail';}
 frame.remove();
  const evidence={schema:'wly.typeset-verification.v1',build_report_sha256:build.build_report_sha256,release_id:build.release_id,pages,route_attempts:routeAttempts,method:'Chrome DOM in same-origin frames; no screenshots or image inspection',summary:{passed:Object.values(pages).filter(x=>x.status==='pass').length,failed:Object.values(pages).filter(x=>x.status==='fail').length}};
 control.result=evidence;control.phase='saving';
 const response=await fetch('/__typeset/result',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(evidence)});
 state.textContent=response.ok?`验收结束：${evidence.summary.passed} 页通过，${evidence.summary.failed} 页未通过，回执已保存。`:'回执保存失败：'+response.status;
 control.phase=response.ok?'complete':'save_failed';nativeState.textContent='正常分支和视频条件的实际观察已写入验收回执。';
})().catch(e=>{document.querySelector('#state').textContent='验收程序失败：'+e;if(window.TypesetQA){window.TypesetQA.phase='error';window.TypesetQA.error=String(e);}});

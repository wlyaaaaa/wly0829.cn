// Shared appearance helpers also run on the existing homepage runtime.
function motionNumberToken(text){
 const ordinary=String(text).match(/[+-]?\d[\d,]*(?:\.\d+)?/);
 if(ordinary)return {numeric:ordinary[0],value:Number(ordinary[0].replaceAll(',','')),notation:'decimal'};
 const circled=String(text).match(/[⓪①-⑳]/);
 return circled?{numeric:circled[0],value:circled[0]==='⓪'?0:circled[0].codePointAt(0)-0x2460+1,notation:'circled'}:null;
}
function motionNumberText(number,value,final){
 if(final)return number.text;
 const glyph=number.notation==='circled'?(Math.round(value)===0?'⓪':Math.round(value)>=1&&Math.round(value)<=20?String.fromCodePoint(0x2460+Math.round(value)-1):String(Math.round(value))):String(value);
 return number.text.replace(number.numeric,glyph);
}
function motionDotEnabled(marker){
 if(Array.isArray(marker))return true; // Legacy homepage has only image coordinates.
 if(marker.policy==='current-active-status-v1')return marker.state==='active';
 return !['cross','pill'].includes(marker.shape)&&!String(marker.basis||'').includes('annotation pin');
}
function motionDuration(name){return SiteMotionAppearance.duration_ms[name]/SiteMotionAppearance.speed_multiplier;}
function motionDelay(milliseconds){return milliseconds/SiteMotionAppearance.speed_multiplier;}
function motionLeafPosition(width,gap,index,count){
 const size=width<600?28:40+index%3*7,drift=(index%2?35:-30)*SiteMotionAppearance.amplitude;
 const desired=gap>45?(index%2?width-gap*(.25+(index%3)*.24):gap*(.18+(index%3)*.24)):width*(.12+index*.76/Math.max(1,count-1));
 const low=Math.min(width*.3,Math.max(0,-drift)+size*1.5),high=Math.max(low,width-Math.max(0,drift)-size*1.5);
 return Math.max(low,Math.min(high,desired));
}
function installMotionExperience(config){
 const accelerated=new WeakSet(),rm=matchMedia('(prefers-reduced-motion:reduce)'),policy=config.stall_insurance;
 const state={stalled:false,reason:null,slow_frames:0,observed_ms:0,observed_frames:0,median_fps:null,slow_fraction:0,animation_running:false};
 let frame=0,last=null,eligibleAt=0,animationCheckAt=0;const samples=[];
 function speedCSS(){
  for(const animation of document.getAnimations()){
   if(!(animation instanceof CSSAnimation||animation instanceof CSSTransition)||accelerated.has(animation)||animation.effect?.target?.closest?.('video.hero-video'))continue;
   animation.updatePlaybackRate(config.speed_multiplier);accelerated.add(animation);
  }
 }
 document.addEventListener('animationstart',speedCSS,true);document.addEventListener('transitionrun',speedCSS,true);
 speedCSS();
 const eligible=()=>!document.hidden&&!rm.matches&&!document.body.classList.contains('motion-off')&&!state.stalled;
 function animationRunning(now){
  if(now<animationCheckAt)return state.animation_running;
  animationCheckAt=now+policy.animation_check_ms;
  state.animation_running=document.getAnimations().some(animation=>{
   const target=animation.effect?.target;if(animation.playState!=='running'||!target?.isConnected)return false;
   const rect=target.getBoundingClientRect();if(rect.width<=0||rect.height<=0||rect.bottom<=0||rect.top>=innerHeight||rect.right<=0||rect.left>=innerWidth)return false;
   const style=getComputedStyle(target);return style.display!=='none'&&style.visibility!=='hidden'&&style.opacity!=='0';
  });
  return state.animation_running;
 }
 function pauseStalledVideo(){
  if(!state.stalled)return;
  for(const video of document.querySelectorAll('video.hero-video')){video.pause();video.hidden=true;video.classList.remove('ready');}
 }
 document.addEventListener('play',pauseStalledVideo,true);document.addEventListener('playing',pauseStalledVideo,true);document.addEventListener('site-motion',pauseStalledVideo);
 function clearWindow(){samples.length=0;state.slow_frames=0;state.observed_ms=0;state.observed_frames=0;state.median_fps=null;state.slow_fraction=0;}
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=null;state.animation_running=false;clearWindow();}
 function sample(){
  const now=performance.now(); // Actual callback delivery, never an accelerated animation clock.
  frame=0;if(!eligible()){stop();return;}
  const observing=now>=eligibleAt&&animationRunning(now);
  if(!observing){last=null;clearWindow();}
  else if(last!==null){const gap=now-last;
   // A single decode/GC pause starts a fresh observation. Even sustained gaps
   // above this ceiling are conservatively left alone instead of guessed at.
   if(gap>=policy.isolated_frame_reset_ms)clearWindow();
   else{
    samples.push({start:last,end:now,gap});while(samples.length&&samples[0].start<now-policy.window_ms)samples.shift();
    const gaps=samples.map(sample=>sample.gap).sort((a,b)=>a-b),count=gaps.length,mid=Math.floor(count/2);
    const median=count%2?gaps[mid]:(gaps[mid-1]+gaps[mid])/2;
    state.observed_frames=count;state.observed_ms=now-samples[0].start;state.median_fps=1000/median;
    state.slow_frames=gaps.filter(value=>value>1000/policy.maximum_median_fps).length;state.slow_fraction=state.slow_frames/count;
    if(state.observed_ms>=policy.minimum_observed_ms&&count>=policy.minimum_frames&&state.median_fps<policy.maximum_median_fps&&state.slow_fraction>=policy.minimum_slow_fraction){
     state.stalled=true;state.reason='severe-frame-stall';
     console.warn(`[SiteMotionInsurance] 实测 ${state.median_fps.toFixed(1)} FPS，持续 ${(state.observed_ms/1000).toFixed(1)} 秒；本页退回静态。`);
     document.body.classList.add('motion-stalled');motion();pauseStalledVideo();return;
    }
   }
  }
  last=observing?now:null;frame=requestAnimationFrame(sample);
 }
 function reset(){stop();animationCheckAt=0;if(eligible()){eligibleAt=performance.now()+policy.startup_grace_ms;frame=requestAnimationFrame(sample);
  for(const section of document.querySelectorAll('.screen')){const rect=section.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight)reveal(section);}
 }speedCSS();}
 // Scrolling/resize can briefly drop frames; never count their settling time.
 const settle=()=>{last=null;clearWindow();animationCheckAt=0;eligibleAt=Math.max(eligibleAt,performance.now()+policy.scroll_quiet_ms);};
 document.addEventListener('scroll',settle,{passive:true});window.addEventListener('resize',settle,{passive:true});
 rm.addEventListener('change',reset);document.addEventListener('visibilitychange',reset);reset();
 window.SiteMotionInsurance={get snapshot(){return {...state,checking:!!frame,observing:!!frame&&state.animation_running&&performance.now()>=eligibleAt,reduced_motion:rm.matches,hidden:document.hidden};}};
}
function motionCSSProperties(config){
 const scale=config.amplitude,b=config.baseline,d=config.duration_ms;
 return {'--motion-amplitude':String(scale),'--motion-card-enter-y':b.card_enter_px*scale+'px','--motion-screen-enter-y':b.screen_enter_px*scale+'px',
  '--motion-hover-y':-b.hover_px*scale+'px','--motion-card-hover-y':-b.card_hover_px*scale+'px','--motion-pulse-scale':String(1+b.pulse_scale_delta*scale),
  '--motion-seam-start':String(1-b.seam_scale_delta*scale),'--motion-ripple-end':String(1+b.ripple_scale_delta*scale),
  '--motion-card-duration':d.cards+'ms','--motion-screen-duration':d.screen_enter+'ms','--motion-pulse-duration':d.pulse+'ms',
  '--motion-arrow-duration':d.arrows+'ms','--motion-seam-duration':d.seam+'ms','--motion-update-duration':d.update+'ms'};
}
/* Manifest geometry is normalized against each complete PNG, never cropped. */
const typesetReadingState={width:innerWidth,height:innerHeight,revision:0,saved:null};
// Layout coordinates exclude entrance/parallax transforms and span all image parts.
function readingScreenGeometry(el){
 let top=0;for(let node=el;node;node=node.offsetParent)top+=node.offsetTop;
 return {top,height:el.offsetHeight};
}
function rememberReadingPosition(){
 // A resize can deliver a scroll event before its resize event. Keep the old
 // reading point until the new manifest layout has finished replacing it.
 if(resizing||innerWidth!==typesetReadingState.width||innerHeight!==typesetReadingState.height)return;
 const offset=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0;
 const point=scrollY+offset,screens=[...document.querySelectorAll('.screen')];
 let el=screens.find(s=>{const r=readingScreenGeometry(s);return r.height&&r.top+r.height>point;});
 // A grid row can contain distinct screens at the same reading line. Keep
 // the restored screen only while it still shares and covers that row.
 const preferredId=typesetReadingState.saved?.id||readingPosition?.id;
 const preferred=preferredId&&screens.find(s=>s.dataset.screen===preferredId);
 if(el&&preferred&&preferred.parentElement===el.parentElement){
  const first=readingScreenGeometry(el),r=readingScreenGeometry(preferred);
  if(r.top===first.top&&r.height&&r.top<=point&&r.top+r.height>point)el=preferred;
 }
 if(el){const r=readingScreenGeometry(el);readingPosition={id:el.dataset.screen,fraction:(scrollY+offset-r.top)/r.height,atTop:scrollY<2};}else readingPosition=null;
}
function cancelReadingResize(){
 const revision=++typesetReadingState.revision;
 if(resizeFrame)cancelAnimationFrame(resizeFrame);resizeFrame=0;
 if(resizing)layout();
 resizing=false;typesetReadingState.saved=null;
 typesetReadingState.width=innerWidth;typesetReadingState.height=innerHeight;
 return revision;
}
function resizeLayout(){
 if(!resizing){typesetReadingState.saved=readingPosition;resizing=true;}
 const revision=++typesetReadingState.revision,saved=typesetReadingState.saved;
 if(resizeFrame)cancelAnimationFrame(resizeFrame);
 resizeFrame=requestAnimationFrame(()=>{
  resizeFrame=0;layout();
  const el=saved&&[...document.querySelectorAll('.screen')].find(s=>s.dataset.screen===saved.id);
  // Manifest aspect ratios reserve dimensions before downloads. Decode the
  // destination screen, then let shared header/TOC layout settle before placing.
  const images=el?[...el.querySelectorAll('.typeset-part:not([hidden]) picture img')]:[];
  Promise.all([document.fonts.ready,...images.map(load)]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(revision!==typesetReadingState.revision)return;
   if(saved?.atTop)scrollTo({top:0,behavior:'instant'});
   else if(el&&saved){
    const r=readingScreenGeometry(el),top=Math.max(0,r.top+r.height*saved.fraction-updateAnchorOffset());
    const needed=Math.max(0,top+innerHeight-document.documentElement.scrollHeight);
    if(needed)document.body.style.paddingBottom=(parseFloat(getComputedStyle(document.body).paddingBottom)||0)+Math.ceil(needed)+'px';
    scrollTo({top,behavior:'instant'});
   }
   resizing=false;typesetReadingState.saved=null;
   typesetReadingState.width=innerWidth;typesetReadingState.height=innerHeight;
   rememberReadingPosition();window.SiteToc?.update();
  })));
 });
}
document.addEventListener('click',event=>{
 const node=event.target instanceof Element?event.target:event.target?.parentElement;
 const link=node?.closest('a[href]');
 if(node?.closest('.back-to-top')||(link&&link.hash&&link.hash!=='#menu'&&link.origin===location.origin&&link.pathname===location.pathname))cancelReadingResize();
},true);
for(const event of ['wheel','touchstart'])addEventListener(event,cancelReadingResize,{passive:true});
addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))cancelReadingResize();});
/* typeset-live-flow-v1 */
(function(){
 const states=new WeakMap(),hosts=new Set();let frame=0;
 const validRect=rect=>Array.isArray(rect)&&rect.length===4&&rect.every(Number.isFinite)&&rect[0]>=0&&rect[1]>=0&&rect[2]>0&&rect[3]>0&&rect[0]+rect[2]<=1.001&&rect[1]+rect[3]<=1.001;
 const isLamp=cell=>(cell.livePart||cell.live_part||cell.node?.dataset.livePart)==='lamp';
 function plan(cells,height,obstacles=[]){
  const entries=cells.filter(cell=>validRect(cell.rect)&&!isLamp(cell)).map(cell=>({...cell,maskRect:validRect(cell.maskRect)?cell.maskRect:cell.rect})).sort((a,b)=>a.rect[1]-b.rect[1]||a.rect[0]-b.rect[0]);
  const bands=[];
  for(const cell of entries){const r=cell.maskRect,large=r[2]>.55&&r[3]*height>=80,padding=large?0:Math.min(.025,Math.max(16/Math.max(1,height),r[3]*.6));bands.push({start:Math.max(0,r[1]-padding),end:Math.min(1,r[1]+r[3]+padding),cells:[cell]});}
  function merge(){
   bands.sort((a,b)=>a.start-b.start);
   for(let i=1;i<bands.length;i++)if(bands[i].start<=bands[i-1].end+.00001){const a=bands[i-1],b=bands[i];a.end=Math.max(a.end,b.end);a.cells.push(...b.cells);bands.splice(i--,1);}
  }
  merge();
  // A static link/button intersecting the cut must remain in one unbroken tile.
  // Full-screen hit areas do not define a raster text boundary.
  for(const band of bands){
   const first=Math.min(...band.cells.map(cell=>cell.maskRect[1])),last=Math.max(...band.cells.map(cell=>cell.maskRect[1]+cell.maskRect[3]));
   for(const r of obstacles){
    if(!validRect(r)||r[3]>.4)continue;
    // Padding must not pull a footer button that originally followed the live
    // row into its header. Keep source order when inserting the taller cards.
    if(r[1]>=last&&r[1]<band.end)band.end=r[1];
    else if(r[1]+r[3]<=first&&r[1]+r[3]>band.start)band.start=r[1]+r[3];
    else if(r[1]<last&&r[1]+r[3]>first){band.start=Math.min(band.start,r[1]);band.end=Math.max(band.end,r[1]+r[3]);}
   }
  }
  merge();
  for(const band of bands){band.cells.sort((a,b)=>a.rect[1]-b.rect[1]||a.rect[0]-b.rect[0]);const mask=band.cells[0].maskRect;band.replace=!band.cells.some(cell=>cell.collapseWhenEmpty)&&band.cells.length===1&&(band.cells[0].forceOverlay===true||mask[2]>.55&&mask[3]*height>=80);}
  return bands;
 }
 function move(parent,node){
  if(parent.moveBefore&&parent.isConnected&&node.isConnected)parent.moveBefore(node,null);else parent.append(node);
 }
 function sourceRect(node){
  if(validRect(node._sourceRect))return node._sourceRect;
  if(validRect(node._motionRect))return node._motionRect;
  if(validRect(node._card?.rect))return node._card.rect;
  const values=['left','top','width','height'].map(key=>node.style[key]);
  if(values.every(value=>value.endsWith('%'))){const rect=values.map(value=>parseFloat(value)/100);if(validRect(rect))return rect;}
  return null;
 }
 function remember(state,node){
  if(state.boxes.has(node))return;
  const rect=sourceRect(node);if(rect)state.boxes.set(node,{rect,style:node.style.cssText});
 }
 function makeTile(state,start,end,masked=[],columns=[0,1]){
  const document=state.host.ownerDocument,tile=document.createElement('div');tile.className='typeset-live-flow-tile';if(masked.length)tile.classList.add('typeset-live-flow-masked');tile.dataset.sourceStart=String(start);tile.dataset.sourceEnd=String(end);
  const image=document.createElement('img');image.className='typeset-live-flow-image';image.alt='';image.setAttribute('aria-hidden','true');image.decoding='async';image.draggable=false;image.src=state.source.currentSrc||state.source.getAttribute('src')||state.source.dataset.src||state.host._layout.src;
  const layer=document.createElement('div');layer.className='typeset-live-flow-layer';tile.append(image,layer);
  tile.dataset.sourceLeft=String(columns[0]);tile.dataset.sourceRight=String(columns[1]);
  const record={node:tile,image,layer,start,end,masked,columns};state.tiles.push(record);return record;
 }
 function mask(tile,width,height){
  const [left,right]=tile.columns,top=tile.start,bottom=tile.end,origin=[left*width,top*height];
  // Crop only source pixels. Links and motion in the sibling layer may span
  // a cut; clipping the whole tile would make those real targets unreachable.
  if(!tile.masked.length){tile.image.style.clipPath='inset('+[top,1-right,1-bottom,left].map(value=>value*100+'%').join(' ')+')';return;}
  // Even-odd polygons remove only the original live rectangles, retaining all
  // surrounding raster text and decorations. Every tile uses the same source.
  const points=[origin,[right*width,top*height],[right*width,bottom*height],[left*width,bottom*height],origin];
  for(const cell of tile.masked){const r=cell.maskRect,x=r[0]*width,y=r[1]*height,right=(r[0]+r[2])*width,bottom=(r[1]+r[3])*height;points.push([x,y],[x,bottom],[right,bottom],[right,y],[x,y],origin);}
  tile.image.style.clipPath='polygon(evenodd,'+points.map(p=>p[0]+'px '+p[1]+'px').join(',')+')';
 }
 function tileFor(state,rect){
  const middle=rect[0]+rect[2]/2,epsilon=.00001;
  // CSSOM rounds percentage styles; boundary points belong to the following
  // tile whether their source came from the manifest or its rounded style.
  return state.tiles.find(tile=>rect[1]>=tile.start-epsilon&&rect[1]<tile.end-epsilon&&middle>=tile.columns[0]-epsilon&&middle<tile.columns[1]-epsilon)||state.tiles.at(-1);
 }
 function update(state){
  const host=state.host;if(!host.isConnected||host.hidden)return;
  const width=host.clientWidth,height=width*host._layout.size[1]/host._layout.size[0];host._mediaHeight=height;
  const sourceURL=state.source.currentSrc||state.source.getAttribute('src')||state.source.dataset.src||host._layout.src;
  for(const tile of state.tiles){
   if(tile.image.getAttribute('src')!==sourceURL)tile.image.src=sourceURL;
   tile.node.style.height=(tile.end-tile.start)*height+'px';Object.assign(tile.image.style,{width:width+'px',height:height+'px',left:-tile.columns[0]*width+'px',top:-tile.start*height+'px'});mask(tile,width,height);
  }
  for(const band of state.bands)if(band.optional)band.node.hidden=band.cells.every(cell=>cell.node.hidden);
  for(const band of state.bands)if(band.replace&&!band.column&&!band.row){
   const rect=band.cells[0].maskRect,offset=(rect[1]-band.start)*height;
   Object.assign(band.cards.style,{marginTop:-((band.end-band.start)*height-offset)+'px',marginLeft:rect[0]*width+'px',width:rect[2]*width+'px',minHeight:(band.end-rect[1])*height+'px'});
   band.cells[0].node.style.setProperty('--typeset-live-min-height',Math.max(94,rect[3]*height)+'px');
  }
  for(const band of state.bands)if(band.row)band.cells[0].node.style.setProperty('--typeset-live-min-height',Math.max(94,band.cells[0].maskRect[3]*height)+'px');
  if(state.column)state.column.cell.node.style.setProperty('--typeset-live-min-height',Math.max(94,state.column.rect[3]*height)+'px');
  const columnDelta=state.column?Math.max(0,state.column.cell.node.offsetHeight-state.column.rect[3]*height):0;
  const dynamic=new Set(state.cells.filter(cell=>!isLamp(cell)).map(cell=>cell.node));
  for(const node of [...state.overlay.children])if(!dynamic.has(node)){remember(state,node);}
  for(const [node,box]of state.boxes){
   if(!node.isConnected){state.boxes.delete(node);continue;}
   if(dynamic.has(node))continue;
   if(node.classList.contains('typeset-card-feedback')){
    const a=box.rect,intersects=state.cells.some(cell=>{if(isLamp(cell))return false;const b=validRect(cell.maskRect)?cell.maskRect:cell.rect;return a[0]<b[0]+b[2]&&a[0]+a[2]>b[0]&&a[1]<b[1]+b[3]&&a[1]+a[3]>b[1];});
    // The source tiles already paint this card. Repainting its old full image
    // would leave a second copy of controls after the live region grows.
    node.classList.toggle('typeset-live-flow-repaint-suppressed',intersects);
   }
   const rect=box.rect,tile=state.column?null:tileFor(state,rect);
   if(state.column){
    const r=state.column.rect,overlaps=rect[0]<r[0]+r[2]&&rect[0]+rect[2]>r[0],below=rect[1]>=r[1]+r[3]-.00001;
    move(state.column.layer,node);Object.assign(node.style,{left:rect[0]*width+'px',top:(rect[1]*height+(overlaps&&below?columnDelta:0))+'px',width:rect[2]*width+'px',height:rect[3]*height+'px'});continue;
   }
   if(!tile)continue;
   move(tile.layer,node);Object.assign(node.style,{left:(rect[0]-tile.columns[0])*width+'px',top:(rect[1]-tile.start)*height+'px',width:rect[2]*width+'px',height:rect[3]*height+'px'});
  }
  host.dataset.liveFlowHeight=String(host.offsetHeight);
 }
 function reset(host){
  const state=states.get(host);if(!state)return;
  state.observer?.disconnect();
  state.resizeObserver?.disconnect();
  for(const [node,box]of state.boxes)if(node.isConnected){move(state.overlay,node);node.style.cssText=box.style;node.classList.remove('typeset-live-flow-repaint-suppressed');}
  for(const cell of state.cells)if(cell.node.isConnected){move(state.overlay,cell.node);cell.node.style.removeProperty('--typeset-live-min-height');}
  state.container.remove();host.classList.remove('typeset-live-flow-ready');delete host.dataset.liveFlowHeight;states.delete(host);hosts.delete(host);
 }
 function apply(host,cells){
  const entries=(cells||[]).filter(cell=>cell.node&&validRect(cell.rect));
  const dynamic=entries.filter(cell=>!isLamp(cell));
  if(!dynamic.length){reset(host);return null;}
  let state=states.get(host);
  const signature=JSON.stringify(entries.map(cell=>[cell.rect,cell.maskRect||cell.rect,isLamp(cell),cell.forceOverlay===true,cell.flowRow===true,cell.compactFrame===true]));
  if(state&&state.signature===signature&&state.cells.length===entries.length&&entries.every((cell,index)=>cell.node===state.cells[index].node)){update(state);return state;}
  const focus=host.contains(host.ownerDocument.activeElement)?host.ownerDocument.activeElement:null;
  reset(host);
  const picture=host.querySelector(':scope > picture'),source=picture?.querySelector('img'),overlay=host.querySelector(':scope > .overlays')||host.querySelector(':scope > .typeset-layer');
  if(!source||!overlay||!host._layout?.size)return null;
  const document=host.ownerDocument,container=document.createElement('div');container.className='typeset-live-flow';
  state={host,source,picture,overlay,container,cells:entries,signature,boxes:new Map(),tiles:[],bands:[]};
  const dynamicNodes=new Set(dynamic.map(cell=>cell.node));for(const node of [...overlay.children])if(!dynamicNodes.has(node))remember(state,node);
  for(const cell of entries)if(isLamp(cell))state.boxes.set(cell.node,{rect:cell.rect,style:cell.node.style.cssText});
  const height=host.clientWidth*host._layout.size[1]/host._layout.size[0],bands=plan(entries,height,[...state.boxes.values()].map(box=>box.rect));
  host.classList.add('typeset-live-flow-ready');host.append(container);
  if(dynamic.every(cell=>cell.compactFrame)){
   // These rectangles are pure chart frames. Keep the source introduction and
   // footer; replace the reserved blank bands with the actual card height.
   // An unavailable chart is a short notice, and an iframe grows naturally.
   let cursor=0;
   for(const band of bands){
    if(band.start>cursor+.00001)container.append(makeTile(state,cursor,band.start).node);
    const region=document.createElement('div');region.className='typeset-live-flow-region typeset-live-flow-compact-frame';
    const cards=document.createElement('div');cards.className='typeset-live-flow-cards';cards.style.setProperty('--typeset-live-columns',1);region.append(cards);container.append(region);
    for(const cell of band.cells)move(cards,cell.node);
    state.bands.push({node:region,cards,start:band.start,end:band.end,cells:band.cells,replace:false,compact:true});cursor=band.end;
   }
   if(cursor<1-.00001)container.append(makeTile(state,cursor,1).node);
  }else if(bands.length===1&&bands[0].replace&&!bands[0].cells[0].flowRow){
   // A large blank beside an illustration is a column replacement. Keeping
   // the side columns uncut prevents a long static paragraph from being torn
   // at the blank frame's lower edge when the live card grows.
   const cell=bands[0].cells[0],r=cell.maskRect,right=r[0]+r[2],bottom=r[1]+r[3];container.classList.add('typeset-live-flow-columns');container.style.gridTemplateColumns=r[0]+'fr '+r[2]+'fr '+Math.max(0,1-right)+'fr';
   container.append(makeTile(state,0,1,[],[0,r[0]]).node);
   const center=document.createElement('div');center.className='typeset-live-flow-column typeset-live-flow-replacement';container.append(center);
   if(r[1]>0)center.append(makeTile(state,0,r[1],[],[r[0],right]).node);
   const cards=document.createElement('div');cards.className='typeset-live-flow-cards';center.append(cards);move(cards,cell.node);
   if(bottom<1)center.append(makeTile(state,bottom,1,[],[r[0],right]).node);
   container.append(makeTile(state,0,1,[],[right,1]).node);
   const layer=document.createElement('div');layer.className='typeset-live-flow-layer typeset-live-flow-global-layer';container.append(layer);
   state.column={rect:r,cell,layer};state.bands.push({node:center,cards,start:r[1],end:bottom,cells:[cell],replace:true,column:true});
  }else{
   let cursor=0;
   for(const band of bands){
   if(band.start>cursor+.00001)container.append(makeTile(state,cursor,band.start).node);
   if(band.replace){
    // Multiple forced replacements keep each original button row after its
    // live field. A negative margin would cover those source pixels.
    const cell=band.cells[0],r=cell.maskRect,right=r[0]+r[2],bottom=r[1]+r[3];
    if(r[1]>band.start)container.append(makeTile(state,band.start,r[1]).node);
    const row=document.createElement('div');row.className='typeset-live-flow-columns typeset-live-flow-row';row.style.gridTemplateColumns=r[0]+'fr '+r[2]+'fr '+Math.max(0,1-right)+'fr';container.append(row);
    row.append(makeTile(state,r[1],bottom,[],[0,r[0]]).node);
    const center=document.createElement('div');center.className='typeset-live-flow-column typeset-live-flow-replacement';row.append(center);
    const cards=document.createElement('div');cards.className='typeset-live-flow-cards';center.append(cards);move(cards,cell.node);
    row.append(makeTile(state,r[1],bottom,[],[right,1]).node);
    if(bottom<band.end)container.append(makeTile(state,bottom,band.end).node);
    state.bands.push({node:row,cards,start:r[1],end:bottom,cells:[cell],replace:true,row:true});cursor=band.end;continue;
   }
   const region=document.createElement('div');region.className='typeset-live-flow-region';if(band.replace)region.classList.add('typeset-live-flow-replacement');
   const optional=band.cells.every(cell=>cell.collapseWhenEmpty),raster=makeTile(state,band.start,band.end,band.cells);raster.node.hidden=optional;region.append(raster.node);
   const cards=document.createElement('div');cards.className='typeset-live-flow-cards';cards.style.setProperty('--typeset-live-columns',optional?1:Math.min(3,band.cells.length));region.append(cards);container.append(region);
   for(const cell of band.cells)move(cards,cell.node);
   state.bands.push({node:region,cards,start:band.start,end:band.end,cells:band.cells,replace:band.replace,optional});cursor=band.end;
   }
   if(cursor<1-.00001)container.append(makeTile(state,cursor,1).node);
  }
  states.set(host,state);hosts.add(host);update(state);
  // Normal motion creates source-bound overlays after the live flow is ready.
  // Place those additions before the next rendering/observation checkpoint.
  state.observer=new MutationObserver(records=>{if(states.get(host)===state&&records.some(record=>record.addedNodes.length))update(state);});
  state.observer.observe(overlay,{childList:true});
  // Fonts and nested live content can resize a card after its render request.
  // Keep source-bound controls aligned with that actual height, including shrink.
  state.resizeObserver=new ResizeObserver(()=>request(host));
  for(const cell of dynamic)state.resizeObserver.observe(cell.node);
  if(focus?.isConnected&&host.ownerDocument.activeElement!==focus)focus.focus({preventScroll:true});
  return state;
 }
 function request(host){
  if(host&&!states.has(host))return;
  if(frame)return;frame=requestAnimationFrame(()=>{frame=0;for(const target of [...hosts]){const state=states.get(target);if(!target.isConnected){hosts.delete(target);continue;}if(state)update(state);}});
 }
 function sourceBox(host,rect){
  const state=states.get(host);if(!state||!validRect(rect))return null;
  const tile=state.column?state.tiles[0]:tileFor(state,rect);
  if(!tile)return null;
  const image=tile.image.getBoundingClientRect();
  let delta=0;
  if(state.column){const live=state.column.rect,overlap=rect[0]<live[0]+live[2]&&rect[0]+rect[2]>live[0];if(overlap&&rect[1]>=live[1]+live[3]-.00001)delta=Math.max(0,state.column.cell.node.getBoundingClientRect().height-live[3]*image.height);}
  return {left:image.left+rect[0]*image.width,top:image.top+rect[1]*image.height+delta,width:rect[2]*image.width,height:rect[3]*image.height,image_width:image.width,image_height:image.height};
 }
 function liveCell(host,node){
  const state=states.get(host);return state?.cells.find(cell=>!isLamp(cell)&&(cell.node===node||cell.node.contains(node)))||null;
 }
 window.TypesetLiveFlow={apply,request,reset,plan,sourceBox,liveCell};
 document.addEventListener('live-status-layout',()=>request());window.addEventListener('resize',()=>request(),{passive:true});document.fonts?.ready.then(()=>request());
})();
/* end-typeset-live-flow-v1 */
function installTypeset(section,screen){
 const mobile=innerWidth<768,mode=mobile?'v':'h';
 section.style.aspectRatio='auto';section.style.height='';section.dataset.layout=mode;
 const hosts=[...section.querySelectorAll('.typeset-part')];
 for(let i=0;i<screen.parts.length;i++){
  const part=screen.parts[i],host=hosts[i],active=part.both||part.orientation===mode;
  if(host._typesetInstalled===part&&host.dataset.active===String(active)&&host.classList.contains('typeset-live-flow-ready')){
   host._mediaHeight=host.clientWidth*part.size[1]/part.size[0];window.TypesetLiveFlow?.request(host);
   for(const card of host.querySelectorAll('.typeset-card-feedback')){
    const visual=card.querySelector('.raster-card-visual'),rect=card._card?.rect;
    if(visual&&rect)Object.assign(visual.style,{backgroundSize:host.clientWidth+'px '+host._mediaHeight+'px',backgroundPosition:-rect[0]*host.clientWidth+'px '+(-rect[1]*host._mediaHeight)+'px'});
   }
   for(const wrap of host.querySelectorAll('.typeset-shot-crop'))fitTypesetShot(wrap);
   continue;
  }
  window.TypesetLiveFlow?.reset(host);host._typesetInstalled=part;
  host.hidden=!active;host.dataset.active=String(active);host._layout=part;
  host._mediaHeight=host.clientWidth*part.size[1]/part.size[0];host.dataset.shape=screen.shape;
  const overlay=host.querySelector('.overlays');overlay.replaceChildren();
  if(!active)continue;
  const pictureImage=host.querySelector('picture img');if(host.getBoundingClientRect().top<innerHeight+600)load(pictureImage);
  if(screen.shape==='card'&&screen.primary_href){const main=makeLink({href:screen.primary_href,text:screen.title,rect:[0,0,1,1]},'hotspot card-main');main.dataset.synthetic='legacy-card-primary';overlay.append(main);}
  const cardHosts=[];
  for(const card of part.interactive_cards||[]){
   const surface=document.createElement('div');surface.className='raster-card typeset-card-feedback';surface.dataset.cardId=card.id;surface._card=card;rectStyle(surface,card.rect);
   const main=makeLink({...card,rect:[0,0,1,1]},'hotspot raster-card-main');main.dataset.synthetic='legacy-card-surface';main.dataset.cardId=card.id;
   const visual=document.createElement('span');visual.className='raster-card-visual';
   Object.assign(visual.style,{backgroundImage:`url("${pictureImage.currentSrc||part.src}")`,backgroundSize:`${host.clientWidth}px ${host._mediaHeight}px`,backgroundPosition:`${-card.rect[0]*host.clientWidth}px ${-card.rect[1]*host._mediaHeight}px`});
   surface.append(visual,main);overlay.append(surface);cardHosts.push(surface);
  }
  for(const hot of part.hotspots){
   if(hot.action||part.native_live.some(x=>x.hot_id===hot.id))continue;
   let el;
   if(hot.kind==='link'||hot.kind==='button'){
    if(hot.invalid){el=document.createElement('span');el.className='typeset-unbound';el.textContent='动作待接入';}
    else{el=makeLink(hot);el.dataset.typesetKind=hot.kind;if(screen.primary_href&&hot.href!==screen.primary_href)el.dataset.cardSecondary='true';}
   }else if(hot.kind==='live'){
    el=document.createElement('a');el.className='slot typeset-live';el.dataset.slot=hot.slot;el.dataset.livePart=hot.live_part||'';el.setAttribute('role','status');
    el.innerHTML='<i aria-hidden="true"></i><span>暂时读不到</span>';el.dataset.state='unknown';
   }else if(hot.kind==='screenshot'){
    el=document.createElement(hot.shots?.length>1?'div':'button');if(el.tagName==='BUTTON')el.type='button';el.className='typeset-screenshot';el.setAttribute('aria-label','查看截图：'+(hot.shots?.[0]?.caption||screen.title));
    const shots=hot.shots||[];el.dataset.compare=String(shots.length>1);
    const show=()=>window.SiteImageViewer?.openGallery(shots.map(s=>({src:new URL(s.full||s.src,location.href).href,title:s.caption})),0,el);
    for(const shot of shots){const wrap=document.createElement('span'),stage=document.createElement('span'),im=new Image();wrap.className='typeset-shot-crop';stage.className='typeset-shot-stage';im.src=shot.src;im.alt=shot.caption;im.decoding='async';im.dataset.role=shot.role;wrap.dataset.crop=JSON.stringify([0,0,...shot.size]);stage.append(im);wrap.append(stage);el.append(wrap);wrap._shot=shot;if(shots.length>1&&shot.role==='before')wrap.classList.add('compare-before');}
    if(shots.length>1){const range=document.createElement('input');range.type='range';range.min='0';range.max='100';range.value='50';range.setAttribute('aria-label','拖动比较改前改后');range.oninput=()=>{el.style.setProperty('--compare-position',range.value+'%');};el.style.setProperty('--compare-position','50%');const open=document.createElement('button');open.type='button';open.className='typeset-compare-open';open.textContent='查看完整截图';open.onclick=show;el.append(range,open);}else el.onclick=show;
   }
   if(el){el._sourceRect=hot.rect;el.dataset.hotId=hot.id;el.dataset.typesetKind=hot.kind;el.dataset.target=hot.target||hot.href;el.dataset.rectPx=JSON.stringify(hot.rect_px);
    const card=(hot.kind==='link'||hot.kind==='button')&&cardHosts.find(c=>{const b=c._card.rect,r=hot.rect;return r[0]>=b[0]-.001&&r[1]>=b[1]-.001&&r[0]+r[2]<=b[0]+b[2]+.001&&r[1]+r[3]<=b[1]+b[3]+.001;});
    if(card){const b=card._card.rect,r=hot.rect;rectStyle(el,[(r[0]-b[0])/b[2],(r[1]-b[1])/b[3],r[2]/b[2],r[3]/b[3]]);if(hot.href!==card._card.href)el.dataset.cardSecondary='true';card.append(el);}
    else{rectStyle(el,hot.rect);overlay.append(el);}
   }
  }
  for(const wrap of overlay.querySelectorAll('.typeset-shot-crop'))fitTypesetShot(wrap);
  const flowCells=[...overlay.querySelectorAll('.typeset-live')].map(node=>{
   const hot=part.hotspots.find(hot=>hot.id===node.dataset.hotId),cell=hot||[...(part.live||[]),...(part.native_live||[])].find(cell=>cell.slot===node.dataset.slot);
   return cell?{node,rect:cell.rect,livePart:cell.live_part||node.dataset.livePart,compactFrame:part.compact_live===true}:null;
  }).filter(Boolean);
  if(flowCells.length)window.TypesetLiveFlow?.apply(host,flowCells);
 }
 const active=screen.parts.filter(x=>x.both||x.orientation===mode),first=active[0];
 section._layout={size:[first?.size[0]||1672,active.reduce((sum,x)=>sum+x.size[1],0)],cards:[],numbers:[],live:[],anchors:[],links:[]};
}
function fitTypesetShot(wrap){
 // Screenshot evidence uses the complete original at its own aspect ratio.
 // Old source crop hints must not magnify one strip of a window or hide controls.
 const shot=wrap._shot,c=[0,0,...shot.size],stage=wrap.querySelector('.typeset-shot-stage'),im=stage.querySelector('img'),w=c[2]-c[0],h=c[3]-c[1],bounds=wrap.getBoundingClientRect(),scale=Math.min(bounds.width/w,bounds.height/h,1.25);
 Object.assign(stage.style,{left:(bounds.width-w*scale)/2+'px',top:(bounds.height-h*scale)/2+'px',width:w*scale+'px',height:h*scale+'px'});
 Object.assign(im.style,{left:-c[0]*scale+'px',top:-c[1]*scale+'px',width:shot.size[0]*scale+'px',height:shot.size[1]*scale+'px'});
}
function displayTypesetStatus(payload,phase,parse,data){
 for(const el of document.querySelectorAll('.typeset-live')){
  const result=phase==='ready'?parse(payload,el.dataset.slot,data.project):{text:'暂时读不到',state:'unknown'};
  const prefix=data.status_binding?.prefixes?.[el.dataset.slot];
  const value=(prefix?prefix+'：':'')+(result.text||'暂时读不到');
  el.querySelector('span').textContent=value;el.title=value;el.dataset.state=result.state||'unknown';
  if(result.href){el.href=result.href;el.target='_blank';el.rel='noopener';}else el.removeAttribute('href');
  const part=el.closest('.typeset-part'),fs=Math.max(12,Math.min(22,part.clientWidth/part._layout.size[0]*26));
  el.style.fontSize=fs+'px';
 }
}

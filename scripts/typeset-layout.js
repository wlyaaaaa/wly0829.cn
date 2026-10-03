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
 const el=[...document.querySelectorAll('.screen')].find(s=>{const r=readingScreenGeometry(s);return r.height&&r.top+r.height>scrollY+offset;});
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
function installTypeset(section,screen){
 const mobile=innerWidth<768,mode=mobile?'v':'h';
 section.style.aspectRatio='auto';section.style.height='';section.dataset.layout=mode;
 const hosts=[...section.querySelectorAll('.typeset-part')];
 for(let i=0;i<screen.parts.length;i++){
  const part=screen.parts[i],host=hosts[i],active=part.both||part.orientation===mode;
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
    for(const shot of shots){const wrap=document.createElement('span'),stage=document.createElement('span'),im=new Image();wrap.className='typeset-shot-crop';stage.className='typeset-shot-stage';im.src=shot.src;im.alt=shot.caption;im.decoding='async';im.dataset.role=shot.role;wrap.dataset.crop=JSON.stringify(shot.crop||[0,0,...shot.size]);stage.append(im);wrap.append(stage);el.append(wrap);wrap._shot=shot;if(shots.length>1&&shot.role==='before')wrap.classList.add('compare-before');}
    if(shots.length>1){const range=document.createElement('input');range.type='range';range.min='0';range.max='100';range.value='50';range.setAttribute('aria-label','拖动比较改前改后');range.oninput=()=>{el.style.setProperty('--compare-position',range.value+'%');};el.style.setProperty('--compare-position','50%');const open=document.createElement('button');open.type='button';open.className='typeset-compare-open';open.textContent='查看完整截图';open.onclick=show;el.append(range,open);}else el.onclick=show;
   }
   if(el){el.dataset.hotId=hot.id;el.dataset.typesetKind=hot.kind;el.dataset.target=hot.target||hot.href;el.dataset.rectPx=JSON.stringify(hot.rect_px);
    const card=(hot.kind==='link'||hot.kind==='button')&&cardHosts.find(c=>{const b=c._card.rect,r=hot.rect;return r[0]>=b[0]-.001&&r[1]>=b[1]-.001&&r[0]+r[2]<=b[0]+b[2]+.001&&r[1]+r[3]<=b[1]+b[3]+.001;});
    if(card){const b=card._card.rect,r=hot.rect;rectStyle(el,[(r[0]-b[0])/b[2],(r[1]-b[1])/b[3],r[2]/b[2],r[3]/b[3]]);if(hot.href!==card._card.href)el.dataset.cardSecondary='true';card.append(el);}
    else{rectStyle(el,hot.rect);overlay.append(el);}
   }
  }
  for(const wrap of overlay.querySelectorAll('.typeset-shot-crop'))fitTypesetShot(wrap);
 }
 const active=screen.parts.filter(x=>x.both||x.orientation===mode),first=active[0];
 section._layout={size:[first?.size[0]||1672,active.reduce((sum,x)=>sum+x.size[1],0)],cards:[],numbers:[],live:[],anchors:[],links:[]};
}
function fitTypesetShot(wrap){
 const shot=wrap._shot,c=shot.crop||[0,0,...shot.size],stage=wrap.querySelector('.typeset-shot-stage'),im=stage.querySelector('img'),w=c[2]-c[0],h=c[3]-c[1],scale=Math.min(wrap.clientWidth/w,wrap.clientHeight/h);
 Object.assign(stage.style,{left:(wrap.clientWidth-w*scale)/2+'px',top:(wrap.clientHeight-h*scale)/2+'px',width:w*scale+'px',height:h*scale+'px'});
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

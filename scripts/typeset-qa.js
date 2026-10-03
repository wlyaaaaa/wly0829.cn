/* Run actual Chrome DOM checks in sequential same-origin viewports, without image inspection. */
(async()=>{
 const build=await(await fetch('/__typeset/build-report')).json();
 const chosen=new URLSearchParams(location.search).get('pages')?.split(',');
 const names=chosen||Object.keys(build.pages),pages={};
 const frame=document.createElement('iframe');frame.height='1000';frame.title='页面程序验收';document.body.append(frame);
 const state=document.querySelector('#state'),log=document.querySelector('#results');
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const query=new URLSearchParams(location.search),nativeState=document.querySelector('#native-state');
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
  const target=new URL(url,location.origin);target.searchParams.delete('audit');if(options.audit!==false)target.searchParams.set('audit','1');
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('route load timeout')),30000);frame.onload=()=>{clearTimeout(timer);resolve();};frame.src=target.href;});
  const win=frame.contentWindow,doc=win.document;
  for(let n=0;n<120&&!win.SiteAudit;n++)await sleep(50);
  if(!win.SiteAudit)throw Error('页面运行件未初始化');
  await Promise.race([win.SiteAudit.ready(),sleep(25000).then(()=>{throw Error('image decode timeout');})]);
  await sleep(options.audit===false?0:80);return {win,doc};
 }
 async function closeDialog(dialog,button){
  if(!dialog?.open||!button)return;
  // Native close handlers restore focus/reading position asynchronously.
  // Finish that real event before the next independent interaction check.
  await new Promise((resolve,reject)=>{const closed=()=>{clearTimeout(timer);resolve();},timer=setTimeout(()=>{dialog.removeEventListener('close',closed);reject(Error('native dialog close timeout'));},5000);dialog.addEventListener('close',closed,{once:true});button.click();});
 }
 async function check(url,width){
  const{win,doc}=await load(url,width),issues=[];
  const d=JSON.parse(doc.querySelector('#page-data').textContent);
  if(win.innerWidth!==width)issues.push('viewport width '+win.innerWidth);
  if(!d.typeset)issues.push('route did not select typeset page');
  if(doc.documentElement.scrollWidth>width+1)issues.push('horizontal overflow '+doc.documentElement.scrollWidth);
  const images=[...doc.images].filter(i=>i.getAttribute('src'));
  for(const im of images)if(!im.complete||!im.naturalWidth)issues.push('image not loaded '+im.getAttribute('src'));
  const model=new Map(d.screens.map(s=>[s.id,s]));let hotspots=0,live=0,shots=0,parts=0;const targets=[];
  const ids=[...doc.querySelectorAll('[id]')].map(x=>x.id);if(new Set(ids).size!==ids.length)issues.push('duplicate anchor IDs');
  for(const section of doc.querySelectorAll('.typeset-screen')){
   const s=model.get(section.dataset.screen),active=[...section.querySelectorAll('.typeset-part')].filter(p=>!p.hidden),expected=s.parts.filter(p=>p.both||p.orientation===(width<768?'v':'h'));
   if(active.length!==expected.length)issues.push(s.id+':orientation part count');
   for(let n=0;n<active.length;n++){
    const host=active[n],p=expected[n],r=host.getBoundingClientRect(),im=host.querySelector('picture img');parts++;
    if(im.naturalWidth!==p.size[0]||im.naturalHeight!==p.size[1])issues.push(p.image+':PNG dimensions differ');
    if(Math.abs(r.height-r.width*p.size[1]/p.size[0])>1)issues.push(p.image+':image aspect ratio');
    const mounted=[...host.querySelector('.overlays').querySelectorAll('[data-hot-id]')];
    for(const h of p.hotspots){
     const el=mounted.find(e=>e.dataset.hotId===h.id);
     if(!el){issues.push(p.image+':hotspot not mounted '+h.kind+' '+(h.href||h.target));continue;}
     const er=el.getBoundingClientRect(),px=h.rect_px;
     const want=[r.left+px[0]*r.width/p.size[0],r.top+px[1]*r.height/p.size[1],px[2]*r.width/p.size[0],px[3]*r.height/p.size[1]];
     if(Math.max(Math.abs(er.left-want[0]),Math.abs(er.top-want[1]),Math.abs(er.width-want[2]),Math.abs(er.height-want[3]))>1.5)issues.push(p.image+':hotspot geometry '+h.id);
     if(er.left<r.left-1||er.top<r.top-1||er.right>r.right+1||er.bottom>r.bottom+1)issues.push(p.image+':hotspot outside image '+h.id);
     if(h.invalid)issues.push(p.image+':unbound target '+(h.href||h.target));
     if(h.kind==='link'||h.kind==='button'){
      if(h.action){if(el.dataset.b2Action!==h.action)issues.push(p.image+':native button target');}
      else if(!h.invalid){if(el.getAttribute('href')!==(h.original_href||h.href))issues.push(p.image+':link target');targets.push(h.original_href||h.href);}
      hotspots++;
     }else if(h.kind==='live'){
       if(!(el.textContent.trim()||el.tagName==='INPUT'||el.classList.contains('typeset-lamp')||h.slot==='ca-toast'))issues.push(p.image+':empty live slot '+h.slot);
      live++;
     }else if(h.kind==='screenshot'){
      if(el.querySelectorAll('img').length!==h.shots.length)issues.push(p.image+':screenshot source count');
      if(h.shots.length>1&&!el.querySelector('input[type=range]'))issues.push(p.image+':comparison slider missing');
      for(let j=0;j<h.shots.length;j++){const sh=h.shots[j],wrap=el.querySelectorAll('.typeset-shot-crop')[j],img=wrap?.querySelector('img');if(!wrap||wrap.dataset.crop!==JSON.stringify(sh.crop||[0,0,...sh.size]))issues.push(p.image+':screenshot crop binding');if(!img||img.getAttribute('src')!==sh.src||img.naturalWidth!==sh.size[0]||img.naturalHeight!==sh.size[1])issues.push(p.image+':screenshot source');}
      shots++;
     }
    }
    if(s.shape==='card'&&s.primary_href){const main=host.querySelector('[data-synthetic="legacy-card-primary"]');if(!main||main.getAttribute('href')!==s.primary_href)issues.push(p.image+':synthetic card primary target');else{const er=main.getBoundingClientRect();if(Math.max(Math.abs(er.left-r.left),Math.abs(er.top-r.top),Math.abs(er.width-r.width),Math.abs(er.height-r.height))>1.5)issues.push(p.image+':synthetic card primary geometry');targets.push(s.primary_href);}}
    for(const card of p.interactive_cards||[]){const surface=[...host.querySelectorAll('.typeset-card-feedback')].find(el=>el.dataset.cardId===card.id),main=surface?.querySelector('.raster-card-main');if(!surface||!main||main.getAttribute('href')!==card.href)issues.push(p.image+':new card feedback target '+card.id);else{const er=surface.getBoundingClientRect(),cr=card.rect,want=[r.left+cr[0]*r.width,r.top+cr[1]*r.height,cr[2]*r.width,cr[3]*r.height];if(Math.max(Math.abs(er.left-want[0]),Math.abs(er.top-want[1]),Math.abs(er.width-want[2]),Math.abs(er.height-want[3]))>1.5)issues.push(p.image+':new card feedback geometry '+card.id);targets.push(card.href);}}
   }
  }
  for(const h of targets){const u=new URL(h,win.location.href);if(u.origin!==win.location.origin)continue;
   if(u.pathname===win.location.pathname&&u.hash){if(!doc.getElementById(decodeURIComponent(u.hash.slice(1))))issues.push('anchor target missing '+h);}
  }
  // Hit-testing checks the actual top element, including sticky navigation and neighbouring overlays.
  let hitChecks=0;
  for(const el of doc.querySelectorAll('.typeset-part:not([hidden]) :is(.hotspot,.b2-image-action,.typeset-screenshot)')){
   const r=el.getBoundingClientRect(),synthetic=!el.dataset.hotId&&(el.dataset.synthetic||el.classList.contains('card-main')||el.classList.contains('raster-card-main'));win.scrollTo(0,win.scrollY+r.top+(synthetic?0:r.height/2)-260);await sleep(0);const b=el.getBoundingClientRect();let measured=0;
   const probes=synthetic?[[.1,.1],[.5,.1],[.9,.1],[.1,.5],[.5,.5],[.9,.5],[.1,.9],[.5,.9],[.9,.9]]:[[.5,.5]];
   for(const [x,y]of probes){const px=b.left+b.width*x,py=b.top+b.height*y;if(px<0||px>=width||py<0||py>=win.innerHeight)continue;const top=doc.elementFromPoint(px,py),part=el.closest('.typeset-part'),internal=synthetic&&top&&part.contains(top)&&top.closest('[data-hot-id],.typeset-live,.b2-native,.typeset-screenshot');
    if(top!==el&&!el.contains(top)&&!internal)issues.push('hotspot obstructed '+(el.dataset.hotId||el.dataset.synthetic||el.className));hitChecks++;measured++;
   }
   if(!measured){const current=el.getBoundingClientRect();win.scrollTo(0,win.scrollY+current.top+current.height/2-260);await sleep(0);const centered=el.getBoundingClientRect(),px=centered.left+centered.width/2,py=centered.top+centered.height/2,top=doc.elementFromPoint(px,py),part=el.closest('.typeset-part'),internal=synthetic&&top&&part.contains(top)&&top.closest('[data-hot-id],.typeset-live,.b2-native,.typeset-screenshot');if(px<0||px>=width||py<0||py>=win.innerHeight||top!==el&&!el.contains(top)&&!internal)issues.push('hotspot has no unobstructed viewport probe '+(el.dataset.hotId||el.dataset.synthetic||el.className));hitChecks++;}
  }
  win.scrollTo(0,0);
  for(const s of d.screens)for(const id of s.screen_anchors||[])if(!ids.includes(id))issues.push('source anchor missing '+id);
   const grids=[...doc.querySelectorAll('.typeset-card-grid')].map(g=>{const css=win.getComputedStyle(g),columns=css.gridTemplateColumns.split(' '),gap=parseFloat(css.columnGap)||0,track=(g.clientWidth-(columns.length-1)*gap)/columns.length;return {cards:g.children.length,columns:columns.length,fills_track:[...g.children].every(c=>Math.abs(c.getBoundingClientRect().width-track)<1)};});
   if(d.page==='projects-home'&&(!grids.length||grids.some(g=>g.columns!==(width<768?1:2))))issues.push('project card grid columns');
   if(grids.some(g=>!g.fills_track))issues.push('project card does not fill grid track');
  return {width,height:1000,route:url,images:images.length,active_parts:parts,hotspots,live_slots:live,screenshot_slots:shots,hit_checks:hitChecks,scroll_width:doc.documentElement.scrollWidth,ids,internal_targets:targets,grids,issues:[...new Set(issues)],status:issues.length?'fail':'pass'};
 }
 const effectNames=new Set(['cards','numbers','dots','arrows','screen_enter','seam','depth','update','ambient','back_top','footer_signature','navigation','viewer','brief','live','screenshots','compare','card_feedback']);
 const geometryKeys=['cards','numbers','dots','arrows'];
 const unique=xs=>[...new Set(xs)],equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 function rectOf(item){return Array.isArray(item)?item:item?.rect;}
 function cssRules(doc){const list=[];function visit(rules){for(const rule of rules){if(rule.selectorText)list.push(rule);if(rule.cssRules)visit(rule.cssRules);}}for(const sheet of doc.styleSheets){try{visit(sheet.cssRules);}catch{}}return list;}
 function selectorParts(text){let depth=0,start=0;const parts=[];for(let i=0;i<text.length;i++){if(text[i]==='('||text[i]==='[')depth++;else if(text[i]===')'||text[i]===']')depth--;else if(text[i]===','&&depth===0){parts.push(text.slice(start,i));start=i+1;}}parts.push(text.slice(start));return parts;}
 function feedbackRules(el,rules){return rules.filter(rule=>/:(hover|active|focus-visible)/.test(rule.selectorText)&&selectorParts(rule.selectorText).some(selector=>{try{return el.matches(selector.replace(/:(hover|active|focus-visible)/g,'').replace(/::?(before|after)/g,''));}catch{return false;}})).map(rule=>({selector:rule.selectorText,transform:rule.style.transform,opacity:rule.style.opacity,outline:rule.style.outline,box_shadow:rule.style.boxShadow}));}
 async function normalEffects(url,width){
  // Start with an empty viewport so first-entry animations cannot finish while
  // image decoding runs. Expand the real viewport after attaching observers.
  const {win,doc}=await load(url,width,{audit:false,initialHeight:1}),data=JSON.parse(doc.querySelector('#page-data').textContent),issues=[];
  const observed=new Set(),samples=[],sampleIds=new Set(),rules=cssRules(doc);
  const counts=Object.fromEntries(geometryKeys.map(key=>[key,0]));let running=0,binding=true,nativeBound=true,backTopCheck=null;
  const stateObserved={normal_branch:new URL(win.location.href).searchParams.get('audit')!=='1'&&doc.body.dataset.audit!=='true',reduced_motion:win.matchMedia('(prefers-reduced-motion:reduce)').matches,hidden:doc.hidden};
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
     if(bound){const h=host._mediaHeight||host.clientHeight,w=host.clientWidth;bound=Math.max(Math.abs(el.offsetLeft-r[0]*w),Math.abs(el.offsetTop-r[1]*h),Math.abs(el.offsetWidth-r[2]*w),Math.abs(el.offsetHeight-r[3]*h))<=2;}
     if(!bound){binding=false;issues.push('normal effect not bound to current part geometry: '+kind+' '+(host?.dataset.part||''));}
    }
    if(bound)observed.add(kind);
    const id=kind+':'+(host?.dataset.part||screen?.dataset.screen||'')+':'+(el.dataset.effectKey||JSON.stringify(el._motionRect)||'');
    if(!sampleIds.has(id)&&samples.length<160){sampleIds.add(id);samples.push({kind,screen:screen?.dataset.screen||null,part:host?.dataset.part||null,rect:el._motionRect||null,layout_bound:bound,running_animations:active.length,animation_name:style.animationName});}
   }
  }
  const observer=new win.MutationObserver(capture);observer.observe(doc.querySelector('.paper'),{subtree:true,childList:true,attributes:true,attributeFilter:['class','style'],characterData:true});
  try{
   frame.height='1000';win.scrollTo({top:0,behavior:'instant'});await sleep(180);capture();
   const model=new Map(data.screens.map(screen=>[screen.id,screen]));
   for(const section of doc.querySelectorAll('.typeset-screen')){
    const screen=model.get(section.dataset.screen);
    for(const host of section.querySelectorAll('.typeset-part:not([hidden])')){
     const part=screen?.parts[[...section.querySelectorAll('.typeset-part')].indexOf(host)],layout=host._layout,im=host.querySelector('picture img');
     if(!part||!layout||!equal(layout,part)||im.getAttribute('src')!==part.src){binding=false;issues.push('normal layout/image binding differs: '+host.dataset.part);continue;}
     const positions=[0];
     for(const key of geometryKeys){const entries=part[key]||[];counts[key]+=entries.length;
      for(const entry of entries){const r=rectOf(entry);if(!Array.isArray(r)||r.length!==4||r.some(n=>!Number.isFinite(n))||r[0]<0||r[1]<0||r[2]<=0||r[3]<=0||r[0]+r[2]>1.002||r[1]+r[3]>1.002){binding=false;issues.push('invalid current motion rectangle: '+host.dataset.part+' '+key);}}
      if(entries.length)positions.push(rectOf(entries[0])[1]*host._mediaHeight);
     }
     const slots=[...host.querySelectorAll('[data-typeset-kind=live]')];
     if(slots.length&&slots.every(el=>el.textContent.trim()||el.tagName==='INPUT'||el.classList.contains('typeset-lamp')||el.dataset.b2Slot==='ca-toast'))observed.add('live');
     for(const hot of part.hotspots.filter(h=>h.action)){
      const el=[...host.querySelectorAll('[data-hot-id]')].find(e=>e.dataset.hotId===hot.id);
      if(!el||el.tagName!=='BUTTON'||el.type!=='button'||el.dataset.b2Action!==hot.action||typeof el.onclick!=='function'){nativeBound=false;issues.push('native action is not bound to a button: '+hot.id);}
     }
     for(const y of unique(positions.map(n=>Math.round(n)))){const b=host.getBoundingClientRect();win.scrollTo({top:Math.max(0,win.scrollY+b.top+y-250),behavior:'instant'});await sleep(100);capture();}
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
   if(top&&typeof top.onclick==='function'){const max=Math.max(0,doc.documentElement.scrollHeight-win.innerHeight),dest=Math.min(max,win.innerHeight*.8);win.scrollTo({top:dest,behavior:'instant'});await sleep(80);const before=win.scrollY;backTopCheck={requested_scroll_y:dest,scroll_y_before:before,button_hidden:top.hidden,samples:[before]};top.click();for(let n=0;n<45&&win.scrollY>2;n++){await sleep(40);backTopCheck.samples.push(win.scrollY);}backTopCheck.scroll_y_after=win.scrollY;if(before>2&&win.scrollY<=2)observed.add('back_top');}
   capture();win.scrollTo({top:0,behavior:'instant'});
   return {width:win.innerWidth,height:win.innerHeight,normal_branch:stateObserved.normal_branch,reduced_motion:stateObserved.reduced_motion,hidden:stateObserved.hidden,new_geometry_bound:binding,geometry_counts:counts,running_animation_count:running,hotspot_css_feedback:cssFeedback,hotspot_count:hotspots.length,native_buttons_bound:nativeBound,hero_video_attached:!!doc.querySelector('video.hero-video'),video_spec:data.video||null,preserved:[...observed],back_top_check:backTopCheck,samples,issues:unique(issues)};
  }finally{observer.disconnect();}
 }
 async function checkEffects(entry){
  const expected=entry.effects_expected,checks=[],issues=[];
  if(!Array.isArray(expected)||expected.some(name=>!effectNames.has(name)))issues.push('build effects inventory is missing or invalid');
  for(const width of [1440,390])try{checks.push(await normalEffects(entry.url,width));}catch(error){checks.push({width,issues:[String(error)],preserved:[],normal_branch:false,new_geometry_bound:false,hotspot_css_feedback:false,native_buttons_bound:false,geometry_counts:{cards:0,numbers:0,dots:0,arrows:0},running_animation_count:0});}
  const preserved=unique(checks.flatMap(c=>c.preserved)),geometrySha=entry.geometry_sha256||entry.geometry_binding?.sha256||build.geometry_sha256||build.geometry_snapshot?.sha256||null;
  issues.push(...checks.flatMap(c=>c.issues));
  for(const name of expected||[])if(!preserved.includes(name))issues.push('original effect has no normal-branch observation: '+name);
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
  const width=caseName==='below_width'?1023:caseName==='portrait'?390:1440,expectedPlaying=caseName==='desktop';
  const {win,doc}=await load(entry.url,width,{audit:false,initialHeight:1});
  const data=JSON.parse(doc.querySelector('#page-data').textContent),section=doc.querySelector('.typeset-screen .typeset-part[data-orientation=h]')||doc.querySelector('.screen');
  frame.height='1000';
  const visiblePosition=await positionVideo(win,doc,section,false);let beforeScroll=null;
  if(caseName==='offscreen'){
   const started=await waitHeroPlaying(win,doc),v=doc.querySelector('video.hero-video');
   beforeScroll={...videoPosition(win,doc,section),playing:started,phase:win.SiteHero?.phase||null,current_time:v?.currentTime||0,video_paused:v?.paused??null,video_hidden:v?.hidden??null};
  }
  const placement=caseName==='offscreen'?await positionVideo(win,doc,section,true):visiblePosition;
  const gate={case:caseName,width:win.innerWidth,height:win.innerHeight,expected_mounted:expectedPlaying,expected_playing:expectedPlaying,mounted:false,playing:false,attached:false,hidden:doc.hidden,reduced_motion:win.matchMedia('(prefers-reduced-motion:reduce)').matches,portrait:win.matchMedia('(orientation:portrait)').matches,section_visible:false,phase:win.SiteHero?.phase||null,time_advanced:false,status:'fail',issues:[]};
  const spec=entry.video_expected;
  gate.scroll_placement=placement;gate.before_scroll=beforeScroll;
  if(!placement.stable)gate.issues.push('native video viewport/scroll geometry did not settle');
  if(caseName==='offscreen'&&(!beforeScroll?.playing||!beforeScroll.section_visible||beforeScroll.video_paused||beforeScroll.video_hidden))gate.issues.push('offscreen transition did not start from actual visible playback');
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
    const gate={case:'document_hidden',width:win.innerWidth,height:win.innerHeight,expected_mounted:false,expected_playing:false,mounted:!!video&&!video.hidden&&style?.display!=='none'&&!doc.hidden,playing:!!video&&!video.hidden&&!video.paused&&!video.ended&&video.readyState>=2,attached:!!video,hidden:doc.hidden,reduced_motion:win.matchMedia('(prefers-reduced-motion:reduce)').matches,portrait:win.matchMedia('(orientation:portrait)').matches,section_visible:!!rect&&!!section.getClientRects().length&&rect.bottom>0&&rect.top<win.innerHeight,phase:runtime?.phase||null,time_advanced:false,current_time_before:video?.currentTime||0,current_time_after:null,video_paused:video?video.paused:null,video_hidden:video?video.hidden:null,method:'navigation_visibilitychange',visibility_event_observed:true,visibility_state:doc.visibilityState,source_url:source,endpoint:'about:blank',parent_hidden:document.hidden,before_navigation:before,status:'fail',issues:[]};
    clearTimeout(timer);doc.removeEventListener('visibilitychange',listener);resolve(gate);
   };
   doc.addEventListener('visibilitychange',listener);
   timer=setTimeout(()=>reject(Error('native iframe navigation visibilitychange was not observed')),10000);
  });
  frame.src='about:blank';
  try{const gate=await observed;await sleep(350);gate.current_time_after=video?.currentTime||0;gate.time_advanced=!!video&&gate.current_time_after>gate.current_time_before+.01;
   if(before.status!=='pass'||!before.playing||!before.section_visible||before.hidden)gate.issues.push('hidden transition did not start from actual visible playback');
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
  if(p.url)for(const width of [1440,390])try{checks.push(await check(p.url,width));}catch(e){checks.push({width,status:'fail',issues:[String(e)]});}
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
  pages[name]={url:p.url,status:p.status==='built'&&checks.length===2&&checks.every(x=>x.status==='pass')&&effects.status==='pass'&&videoChecks.status==='pass'?'pass':'fail',checks,effects,video_checks:videoChecks,build_issues:issues};
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
  const routeIds=new Map(Object.values(pages).filter(x=>x.url&&x.checks[0]?.ids).map(x=>[x.url,new Set(x.checks[0].ids)]));
  for(const path of targets.keys())if(!routeIds.has(path)){
   try{const response=await fetch(path);if(!response.ok)throw Error('HTTP '+response.status);const t=await response.text(),doc=new DOMParser().parseFromString(t,'text/html'),ids=new Set([...doc.querySelectorAll('[id]')].map(x=>x.id));const d=doc.querySelector('#page-data');if(d&&['project','frozen'].includes(JSON.parse(d.textContent).kind))ids.add('ai-brief');routeIds.set(path,ids);}catch(e){routeIds.set(path,null);}
  }
  for(const name of names){const p=pages[name];for(const c of p.checks){for(const href of c.internal_targets||[]){const u=new URL(href,new URL(c.route,location.origin));if(u.origin!==location.origin&&u.hostname!=='wly0829.cn')continue;const ids=routeIds.get(u.pathname),hash=decodeURIComponent(u.hash.slice(1));if(!ids)c.issues.push('internal route unavailable '+href);else if(hash&&!ids.has(hash))c.issues.push('cross-page anchor missing '+href);}c.issues=[...new Set(c.issues)];c.status=c.issues.length?'fail':'pass';}p.status=build.pages[name].status==='built'&&p.checks.length===2&&p.checks.every(x=>x.status==='pass')&&p.effects.status==='pass'&&p.video_checks.status==='pass'?'pass':'fail';}
 frame.remove();
 const evidence={schema:'wly.typeset-verification.v1',build_report_sha256:build.build_report_sha256,release_id:build.release_id,pages,method:'Chrome DOM in same-origin frames; no screenshots or image inspection',summary:{passed:Object.values(pages).filter(x=>x.status==='pass').length,failed:Object.values(pages).filter(x=>x.status==='fail').length}};
 control.result=evidence;control.phase='saving';
 const response=await fetch('/__typeset/result',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(evidence)});
 state.textContent=response.ok?`验收结束：${evidence.summary.passed} 页通过，${evidence.summary.failed} 页未通过，回执已保存。`:'回执保存失败：'+response.status;
 control.phase=response.ok?'complete':'save_failed';nativeState.textContent='正常分支和视频条件的实际观察已写入验收回执。';
})().catch(e=>{document.querySelector('#state').textContent='验收程序失败：'+e;if(window.TypesetQA){window.TypesetQA.phase='error';window.TypesetQA.error=String(e);}});

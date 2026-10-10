/* motion-appearance-v1 */
window.SiteMotionAppearance={"schema":"wly.motion-appearance.v1","release_stage":"after-oss-first-release","selection":"本人要求：默认全效果，速度 2.5 倍；AI建议的幅度2.5倍保留，具体观感待本人验收","visual_acceptance":"pending_owner_review","amplitude":2.5,"speed_multiplier":2.5,"default_all_effects":true,"baseline":{"parallax_desktop_px":5,"parallax_phone_px":2,"parallax_slope":0.014,"card_enter_px":32,"screen_enter_px":40,"hover_px":2,"card_hover_px":3,"pulse_scale_delta":0.5,"seam_scale_delta":0.05,"ripple_scale_delta":0.08},"duration_ms":{"cards":900,"card_stagger":120,"numbers":1200,"number_cleanup":1500,"screen_enter":800,"pulse":3000,"arrows":2800,"seam":1400,"update":1800},"duration_basis":"实际首版原时长；JS视觉动画/延迟/清理除以速度倍率，现有CSS动画与过渡的真实时间线播放率设为2.5；受保护视频模块的播放率与准入不改","stall_insurance":{"selection":"本人最新要求：仅前台且动画正在播放，连续约5秒明显低FPS才退本页静态；AI补充保守的观察窗口和排除办法","startup_grace_ms":2000,"scroll_quiet_ms":1000,"animation_check_ms":250,"window_ms":6000,"minimum_observed_ms":5000,"minimum_frames":8,"maximum_median_fps":10,"minimum_slow_fraction":0.9,"isolated_frame_reset_ms":1200,"policy":"前台、非减少动态、视口内真实动画正在运行；打开或恢复前2秒、滚动或转屏后1秒均不计。最近6秒连续观察至少5秒、至少8帧，中位数低于10FPS且90%以上帧间隔超过100ms才触发。单次>=1200ms长帧清空观察，宁可不触发；后台和无动画时也清空。触发只保存在当前页面内存，不写浏览器存储、不影响下页，console仅一行给出实测FPS和持续秒数。"},"dot_policy":"current-active-status-v1","dot_policy_note":"真实在用/正常/运行/有效状态标记呼吸；空圈、叉、停用、待定及装饰注释点不挂。明确保留且绑定原资产的透明状态点仍按实际标记测量。新版面无对应元素不算缺项；量测失败仍阻断。","acceptance_items":["桌面纸面视差上限 ±12.5px，手机 ±5px；需要本人判断一眼可见且不晃眼","卡片进入位移80px、有效360ms，整屏进入100px、有效320ms；需要本人判断节奏与晃动","呼吸环最大2.25倍、有效1.2秒一周期；箭头光点有效1.12秒，路径仍绑定原标记","数字滚动有效480ms，圈号始终保持圈号；最终数字不变","接缝、状态涟漪、水彩及落叶的幅度增加；保持系统减少动态、后台暂停和原交互","MM-02：恢复正常动态后，视差与尚未播放的数字重新生效；只按真实系统媒体状态验","MM-03：桌面和手机均默认六条落叶，响应式位置/尺寸适配但不减效果档；逐条检查横向轨迹能进入视口","速度和幅度分开核实；全开不读设备硬件性能等级，保险只看实际严重卡顿，不添加音乐"]};
"use strict";
/* 只选构建期记录的编码版本边界；不读像素、不测文字、不量线。 */
(()=>{'use strict';const data=JSON.parse(document.querySelector('#page-data').textContent),bindings=new WeakMap();
function bind(){for(const span of document.querySelectorAll('.nav-label[data-indicator="image-label"]')){const im=span.querySelector('img'),entry=data.shared.nav_labels?.[span.dataset.labelText];if(!im||!entry)continue;
 let apply=bindings.get(im);if(!apply){apply=()=>{if(!im.complete||!im.naturalWidth)return;const format=(im.currentSrc||im.src).split('?')[0].endsWith('.avif')?'avif':'webp',edge=entry.encoded_edges?.[format]||entry;span.style.setProperty('--ink-left',edge.ink_left*100+'%');span.style.setProperty('--ink-right',(1-edge.ink_right)*100+'%');span.style.setProperty('--ink-bottom',edge.ink_bottom*100+'%');span.dataset.inkLeft=edge.ink_left;span.dataset.inkRight=edge.ink_right;span.dataset.inkBottom=edge.ink_bottom;span.dataset.labelReady='true';};bindings.set(im,apply);span.dataset.labelBound='true';im.addEventListener('load',apply);im.decode().then(apply).catch(()=>{});}apply();
 }}window.SiteIndicators={bind};document.addEventListener('site-layout',bind);addEventListener('load',bind);addEventListener('pageshow',bind);bind();})();

;
/* 下划线属于链接本身；此模块只决定当前节，不计算线的位置或宽度。 */
(function(){'use strict';
function selectSection(entries,probe,atEnd=false){if(!entries.length)return null;if(atEnd)return entries.at(-1).id;let active=entries[0].id;for(const entry of entries)if(entry.top<=probe+1)active=entry.id;return active;}
if(typeof module!=='undefined'&&module.exports){module.exports={selectSection};return;}
const nav=document.querySelector('.toc');if(!nav)return;
const links=[...nav.querySelectorAll('a[data-section]')];let active=null;
function pageTop(el){let y=0;for(let node=el;node;node=node.offsetParent)y+=node.offsetTop;return y;}
function entries(){const first=new Map();for(const node of document.querySelectorAll('.screen[data-section]'))if(node.getClientRects().length&&!first.has(node.dataset.section))first.set(node.dataset.section,node);return links.map(link=>{const node=first.get(link.dataset.section)||document.getElementById(link.dataset.section);return node?{id:link.dataset.section,top:pageTop(node),node}:null;}).filter(Boolean);}
function update(){
 const list=entries(),header=document.querySelector('header'),offset=(header?.offsetHeight||0)+(nav.getClientRects().length?nav.offsetHeight:0)+24;
 const atEnd=scrollY>0&&scrollY+innerHeight>=document.documentElement.scrollHeight-2;
 const next=selectSection(list,scrollY+offset,atEnd),changed=active!==next;active=next;
 for(const link of links){if(link.dataset.section===next){if(link.getAttribute('aria-current')!=='location')link.setAttribute('aria-current','location');}else if(link.hasAttribute('aria-current'))link.removeAttribute('aria-current');}
 // 仅在当前项或视口变化时把链接水平滚进目录可见范围；与线的几何无关。
 if(nav.getClientRects().length){const link=links.find(a=>a.dataset.section===next),scroller=nav.querySelector('.toc-inner');if(link&&scroller){const a=link.getBoundingClientRect(),b=scroller.getBoundingClientRect();if(a.left<b.left+8)scroller.scrollLeft+=a.left-b.left-8;else if(a.right>b.right-8)scroller.scrollLeft+=a.right-b.right+8;}}
 return {active,changed,offset,entries:list.map(({id,top})=>({id,top}))};
}
addEventListener('scroll',update,{passive:true});addEventListener('resize',update);addEventListener('load',update);addEventListener('pageshow',update);addEventListener('hashchange',update);
document.addEventListener('visibilitychange',update);document.addEventListener('site-layout',update);document.addEventListener('load',update,true);
document.fonts?.ready.then(update);document.fonts?.addEventListener('loadingdone',update);
if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(update);observer.observe(document.querySelector('.paper'));observer.observe(nav);}
nav.addEventListener('click',e=>{if((e.target instanceof Element?e.target:e.target?.parentElement)?.closest('a[data-section]')){update();setTimeout(update,0);setTimeout(update,320);}});
window.SiteToc={update,entries:()=>entries().map(({id,top})=>({id,top})),get active(){return active;}};update();
})();

;
'use strict';
const page=JSON.parse(document.querySelector('#page-data').textContent),mq=matchMedia('(orientation:portrait)'),rm=matchMedia('(prefers-reduced-motion:reduce)');
const audit=new URLSearchParams(location.search).get('audit')==='1';if(audit){document.body.dataset.audit='true';document.body.classList.add('motion-off');}
window.siteAssetBackground=src=>{const avif=page.shared.avif_assets?.[src],fallback=`url("${src}")`,value=avif?`image-set(url("${avif}") type("image/avif"),url("${src}") type("image/webp"))`:fallback;return CSS.supports('background-image',value)?value:fallback;};
const mediaImages=[...document.querySelectorAll('.screen picture img')];
function loadFooter(){const footer=document.querySelector('footer');for(const node of footer.querySelectorAll('[data-lazy-style]')){node.setAttribute('style',node.dataset.lazyStyle);delete node.dataset.lazyStyle;}for(const node of footer.querySelectorAll('source[data-lazy-srcset]')){node.srcset=node.dataset.lazySrcset;delete node.dataset.lazySrcset;}for(const im of footer.querySelectorAll('img[data-lazy-src]')){im.loading='eager';im.fetchPriority='low';im.src=im.dataset.lazySrc;delete im.dataset.lazySrc;}window.SiteIndicators?.bind();}
if(audit||!('IntersectionObserver'in window))loadFooter();else{const footerObserver=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){loadFooter();footerObserver.disconnect();}},{rootMargin:'400px 0px'});footerObserver.observe(document.querySelector('footer'));}
function load(im){im.loading='eager';const pic=im.closest('picture');pic.querySelectorAll('source[data-srcset]').forEach(s=>{s.srcset=s.dataset.srcset;delete s.dataset.srcset;});if(im.dataset.srcset){im.srcset=im.dataset.srcset;delete im.dataset.srcset;}if(im.dataset.src){im.src=im.dataset.src;delete im.dataset.src;}return im.decode().catch(()=>{});}
if(audit||!('IntersectionObserver'in window)){mediaImages.forEach(load);}else{const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){load(e.target);observer.unobserve(e.target);}}),{rootMargin:'600px 0px'});mediaImages.filter(i=>i.dataset.src).forEach(i=>observer.observe(i));}
function rectStyle(el,r){Object.assign(el.style,{left:r[0]*100+'%',top:r[1]*100+'%',width:r[2]*100+'%',height:r[3]*100+'%'});}
function orientation(){return page.typeset?(innerWidth<768?'v':'h'):(mq.matches?'v':'h');}
function fitText(cell,referenceSize){const span=cell.querySelector('span');if(!span)return;let font=Math.min(cell.clientHeight*.47,referenceSize||999);cell.style.fontSize=Math.max(6,font)+'px';for(let i=0;i<12&&(span.scrollWidth>cell.clientWidth-5||span.scrollHeight>cell.clientHeight-3);i++)cell.style.fontSize=(parseFloat(cell.style.fontSize)*.92)+'px';}
function navLabel(text){const span=document.createElement('span'),item=page.shared.nav_labels?.[text];span.className='nav-label';span.dataset.labelText=text;if(!item){span.classList.add('nav-label-fallback');span.dataset.indicator='text-label';span.textContent=text;return span;}span.dataset.indicator='image-label';span.dataset.inkLeft=item.ink_left;span.dataset.inkRight=item.ink_right;span.style.setProperty('--ink-left',item.ink_left*100+'%');span.style.setProperty('--ink-right',(1-item.ink_right)*100+'%');span.style.setProperty('--ink-bottom',item.ink_bottom*100+'%');const picture=document.createElement('picture'),avif=page.shared.avif_assets?.[item.src],im=new Image();picture.className='asset-picture';if(avif){const source=document.createElement('source');source.type='image/avif';source.srcset=avif;picture.append(source);}im.className='image-label';im.width=item.size[0];im.height=item.size[1];span.style.setProperty('--label-scale',1/(item.ink_bottom-item.ink_top));im.alt=text;im.decoding='async';picture.append(im);span.append(picture);im.src=item.src;return span;}
function sharedComponent(host,key,custom){const component=custom||page.shared.components[key];host.replaceChildren();host.classList.toggle('component',!!component);if(!component)return false;const im=new Image();im.decoding='async';im.loading=host.dataset.component==='header'?'eager':'lazy';im.width=component.size[0];im.height=component.size[1];im.alt='';const avif=page.shared.avif_assets?.[component.src];if(avif){const picture=document.createElement('picture'),source=document.createElement('source');picture.className='asset-picture';source.type='image/avif';source.srcset=avif;picture.append(source,im);host.append(picture);}else host.append(im);im.src=component.src;for(const link of component.links){const a=document.createElement('a');a.className='hotspot';a.dataset.indicator='hotspot-glow';a.dataset.indicatorRect=JSON.stringify(link.rect);a.href=link.href;a.setAttribute('aria-label',link.text);if(link.href.startsWith('#'))a.dataset.section=link.href.slice(1);rectStyle(a,link.rect);if(link.href==='#menu'){const w=host.clientWidth,h=w*component.size[1]/component.size[0];if(w&&h){const bw=Math.min(w,Math.max(44,w*link.rect[2])),bh=Math.min(h,Math.max(44,h*link.rect[3])),cx=w*(link.rect[0]+link.rect[2]/2),cy=h*(link.rect[1]+link.rect[3]/2);rectStyle(a,[Math.max(0,Math.min(w-bw,cx-bw/2))/w,Math.max(0,Math.min(h-bh,cy-bh/2))/h,bw/w,bh/h]);}}if(link.href==='/'+page.family+'/')a.setAttribute('aria-current','page');host.append(a);}for(const slot of component.slots){const value=page.neighbors[slot.slot];if(!value)continue;const a=document.createElement('a');a.className='slot';a.href=value.href;const span=document.createElement('span');span.textContent=value.title;a.append(span);rectStyle(a,slot.rect);host.append(a);requestAnimationFrame(()=>fitText(a));}return true;}
function installSourceFrames(){
 const frame=page.shared.art?.source_frames?.[innerWidth<600?'v':'h'];
 for(const section of document.querySelectorAll('.source-article')){section.classList.toggle('has-source-frame',!!frame);if(!frame)continue;
  const widths=frame.slices.map(n=>n*frame.scale);section.style.setProperty('--source-frame',window.siteAssetBackground(frame.src));section.style.setProperty('--frame-slices',frame.slices.join(' '));section.style.setProperty('--frame-widths',widths.map(n=>n+'px').join(' '));section.style.setProperty('--frame-top',widths[0]+'px');section.style.setProperty('--frame-side',widths[3]+'px');section.dataset.frameOrientation=innerWidth<600?'v':'h';
 }
}
function installShared(){
 installSourceFrames();
 const o=orientation(),compact=o==='v'||innerWidth<1000,host=document.querySelector('[data-component=header]');
 host.replaceChildren();host.hidden=true;document.querySelector('.desktop-masthead').hidden=compact;document.querySelector('.portrait-nav').style.display=compact?'flex':'none';
 if(page.shared.art?.header_tile)document.documentElement.style.setProperty('--nav-band-tile',window.siteAssetBackground(page.shared.art.header_tile));
 document.querySelector('[data-component=menu]').hidden=true;document.querySelector('#menu nav').hidden=false;
 const endHost=document.querySelector('[data-component=page-end]'),generic=page.shared.art?.page_navigation;
 if(generic)installPageNavigation(endHost,generic);
 else{const end=page.kind.endsWith('-home')?null:page.page_end?.[o];endHost.closest('.page-end').hidden=!end;if(end)sharedComponent(endHost,'page-end',end);else endHost.replaceChildren();}
 for(const link of document.querySelectorAll('.toc-text a')){const text=o==='v'?link.dataset.labelV:link.dataset.labelH;if(link.dataset.renderedLabel!==text){link.replaceChildren(navLabel(text));link.dataset.renderedLabel=text;}}
 updateAnchorOffset();
}
function updateAnchorOffset(){const h=document.querySelector('header').getBoundingClientRect().height,toc=document.querySelector('.toc'),t=toc.getClientRects().length?toc.getBoundingClientRect().height:0,offset=h+t+8;document.documentElement.style.setProperty('--header-height',h+'px');document.documentElement.style.setProperty('--anchor-offset',offset+'px');return offset;}

function installPageNavigation(host,art){
 const nav=host.closest('.page-end');host.replaceChildren();host.className='page-nav-links';nav.classList.add('shared-page-end');
 if(page.kind.endsWith('-home')){nav.hidden=true;return;}
 for(const side of ['previous','next']){const item=page.neighbors?.[side],asset=art[side];if(!item||!asset)continue;
  const a=document.createElement('a'),image=new Image(),title=document.createElement('span');a.className='page-nav-link '+side;a.href=item.href;a.rel=side==='previous'?'prev':'next';a.setAttribute('aria-label',(side==='previous'?'上一个：':'下一个：')+item.title);
  image.src=asset.src;image.width=asset.size[0];image.height=asset.size[1];image.alt='';image.className='page-nav-direction';image.loading=audit?'eager':'lazy';image.decoding='async';
  title.className='page-nav-title';title.textContent=item.title;
  if(side==='previous')a.append(image,title);else a.append(title,image);host.append(a);
 }
 nav.hidden=!host.childElementCount;
}

function makeLink(data,kind='hotspot'){const a=document.createElement('a');a.className=kind;a.dataset.linkId=data.id||'';if(data.button)a.dataset.button='true';if(data.secondary)a.dataset.cardSecondary='true';a.draggable=false;a.dataset.indicator='hotspot-glow';a.dataset.indicatorRect=JSON.stringify(data.rect);a.href=data.href;a.setAttribute('aria-label',data.text);rectStyle(a,data.rect);return a;}
function secondaryLink(data,peers,width,height){return {...data,secondary:true,rect:cardTouchRect(data,peers,width,height)};}
function installRasterCards(section,lay,overlay){
 const embedded=(lay.interactive_cards||[]).filter(c=>!c.whole),used=new Set(),image=section.querySelector('picture img');
 used.arrowIds=new Set();
 for(const card of embedded){
  const r=card.rect,host=document.createElement('div'),visual=document.createElement('span'),bed=document.createElement('span');bed.className='raster-card-bed';bed.style.backgroundColor=card.background||'#fff';rectStyle(bed,r);overlay.append(bed);host.className='raster-card';host.dataset.cardId=card.id;host.dataset.mainHref=card.href;rectStyle(host,r);visual.className='raster-card-visual';visual.setAttribute('aria-hidden','true');
  const paint=()=>{if(image.currentSrc){visual.style.backgroundImage=`url("${image.currentSrc}")`;visual.style.backgroundSize=section.clientWidth+'px '+(section._mediaHeight||section.clientHeight)+'px';visual.style.backgroundPosition=-r[0]*section.clientWidth+'px '+(-r[1]*(section._mediaHeight||section.clientHeight))+'px';}};paint();image.addEventListener('load',paint,{once:true});host.append(visual);
  const main=makeLink({...card,id:card.main_id,rect:[0,0,1,1]},'hotspot raster-card-main');main.removeAttribute('data-indicator');host.append(main);used.add(card.main_id);
  const titleArrow=lay.links.find(h=>h.id===card.main_id)?.arrow_rect;if(titleArrow&&titleArrow[0]>=r[0]&&titleArrow[1]>=r[1]&&titleArrow[0]+titleArrow[2]<=r[0]+r[2]&&titleArrow[1]+titleArrow[3]<=r[1]+r[3]){host.append(makeLink({...card,id:card.main_id,rect:[(titleArrow[0]-r[0])/r[2],(titleArrow[1]-r[1])/r[3],titleArrow[2]/r[2],titleArrow[3]/r[3]]}));used.arrowIds.add(card.main_id);}
  const localPeers=lay.links.filter(h=>{const q=h.text_rect||h.rect;return q[0]>=r[0]-.002&&q[1]>=r[1]-.002&&q[0]+q[2]<=r[0]+r[2]+.002&&q[1]+q[3]<=r[1]+r[3]+.002}).map(h=>{const q=h.text_rect||h.rect;return {...h,whole:false,rect:[(q[0]-r[0])/r[2],(q[1]-r[1])/r[3],q[2]/r[2],q[3]/r[3]]};});
  for(const hit of lay.links){const q=hit.rect;if(hit.id===card.main_id||used.has(hit.id)||q[0]<r[0]-.002||q[1]<r[1]-.002||q[0]+q[2]>r[0]+r[2]+.002||q[1]+q[3]>r[1]+r[3]+.002)continue;const local={...hit,rect:[(q[0]-r[0])/r[2],(q[1]-r[1])/r[3],q[2]/r[2],q[3]/r[3]]},extra=hit.href!==card.href;host.append(makeLink(extra?secondaryLink(local,localPeers,r[2]*section.clientWidth,r[3]*section.clientHeight):local));used.add(hit.id);const a=hit.arrow_rect;if(a&&a[0]>=r[0]&&a[1]>=r[1]&&a[0]+a[2]<=r[0]+r[2]&&a[1]+a[3]<=r[1]+r[3]){const markerData={...hit,rect:[(a[0]-r[0])/r[2],(a[1]-r[1])/r[3],a[2]/r[2],a[3]/r[3]]};const marker=makeLink(extra?secondaryLink(markerData,localPeers,r[2]*section.clientWidth,r[3]*section.clientHeight):markerData);marker.dataset.linkPart='arrow';host.append(marker);used.arrowIds.add(hit.id);}}
  for(const link of host.querySelectorAll('a:not(.raster-card-main)')){if(link.href!==main.href)link.dataset.cardSecondary='true';else delete link.dataset.cardSecondary;}
  host.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!(e.target instanceof Element?e.target:e.target?.parentElement)?.closest('[data-card-secondary]'))host.classList.add('is-pressed');});for(const event of ['pointerup','pointercancel'])host.addEventListener(event,()=>host.classList.remove('is-pressed'));host.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')host.classList.remove('is-pressed');});
  overlay.append(host);
 }
 return used;
}
function ruleLabelText(label,meta){
 if(label.kind==='example')return label.template;
 if(meta?.verified!==true||!/^E\d+$/.test(meta.version||'')||!/^[a-f0-9]{64}$/.test(meta.ruleset_sha256||'')||!meta.activation_label)return '规则版本未核验';
 return label.template.replaceAll('{{version}}',meta.version).replaceAll('{{activation}}',meta.activation_label);
}
function installRuleLabels(section,lay,meta){
 const overlay=section.querySelector('.overlays');
 for(const label of lay.rule_labels||[]){
  const el=document.createElement('span');el.className='rule-release-label';el.dataset.kind=label.kind;el.dataset.imageSha=label.source_sha256;el.textContent=ruleLabelText(label,meta);rectStyle(el,label.rect);
  Object.assign(el.style,{backgroundColor:label.background,color:label.colour,fontWeight:String(label.weight),fontSize:(label.font_height*section.clientWidth/lay.size[0])+'px'});overlay.append(el);
  let font=parseFloat(el.style.fontSize);while(font>7&&(el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1)){font*=.97;el.style.fontSize=font+'px';}
 }
}
function cardTouchRect(hit,links,width,height){
 const r=hit.rect,cx=r[0]+r[2]/2,cy=r[1]+r[3]/2;let left=0,right=1,top=0,bottom=1;
 // 只能向真实文字周围的空白扩展。上下紧邻的入口按纵向空隙分界，
 // 不因中心横坐标略有不同就把热区从文字上横向挪开。
 for(const other of links){if(other===hit||other.whole)continue;const o=other.rect;
  if(o[0]+o[2]<=r[0])left=Math.max(left,(o[0]+o[2]+r[0])/2);
  else if(r[0]+r[2]<=o[0])right=Math.min(right,(r[0]+r[2]+o[0])/2);
  if(o[1]+o[3]<=r[1])top=Math.max(top,(o[1]+o[3]+r[1])/2);
  else if(r[1]+r[3]<=o[1])bottom=Math.min(bottom,(r[1]+r[3]+o[1])/2);
 }
 const w=Math.min(right-left,Math.max(r[2],44/width)),h=Math.min(bottom-top,Math.max(r[3],44/height));return [Math.max(left,Math.min(right-w,cx-w/2)),Math.max(top,Math.min(bottom-h,cy-h/2)),w,h];
}
function removeLiveBanner(section,lay){
 const d=lay.live_detection,b=d?.enclosing_banner;if(!d?.caption)return;
 const scale=section.clientWidth/lay.size[0],base=section._mediaHeight;
 const start=b?b[1]-4:Math.min(d.caption[1],...(d.selected||[]).map(r=>r[1]))-16;
 const end=b?b[3]+4:Math.max(d.caption[3],...(d.selected||[]).map(r=>r[3]))+16;
 const top=Math.max(0,(start-lay.crop[1])*scale),bottom=Math.min(base,(end-lay.crop[1])*scale),gap=bottom-top;
 if(gap<=0)return;section._removedLiveBand={top,bottom,gap};section.dataset.liveBanner='removed';
 section.style.aspectRatio='auto';section.style.height=(base-gap)+'px';const picture=section.querySelector('picture');picture.style.clipPath=`inset(0 0 ${base-top}px 0)`;
 if(base-bottom>1){const tail=document.createElement('div'),copy=new Image(),source=picture.querySelector('img');tail.className='live-banner-tail';tail.setAttribute('aria-hidden','true');Object.assign(tail.style,{top:top+'px',height:(base-bottom)+'px'});Object.assign(copy.style,{width:section.clientWidth+'px',top:-bottom+'px'});const paint=()=>{if(source.currentSrc)copy.src=source.currentSrc;};paint();source.addEventListener('load',paint,{once:true});tail.append(copy);section.insertBefore(tail,section.querySelector('.overlays'));}
 const clipped=[];for(const el of section.querySelector('.overlays').children){const y=el.offsetTop,h=el.offsetHeight;if(y>=bottom-1){el.style.top=(y-gap)+'px';}else if(y+h>top+1){el.hidden=true;for(const link of el.matches('a.hotspot')?[el]:el.querySelectorAll('a.hotspot')){if(link.href&&!link.hash.includes('ai-brief'))clipped.push({href:link.getAttribute('href'),text:link.getAttribute('aria-label')});}}}
 let row=document.querySelector('.screen-control-row[data-screen="'+section.dataset.screen+'"]');if(!row&&clipped.length){row=document.createElement('nav');row.className='screen-control-row';row.dataset.screen=section.dataset.screen;row.setAttribute('aria-label','首屏入口');section.after(row);}if(row){row.replaceChildren();const seen=new Set();for(const link of clipped){if(!link.text||seen.has(link.href))continue;seen.add(link.href);const a=document.createElement('a');a.href=link.href;a.textContent=link.text+' ↗';row.append(a);}row.hidden=!row.childElementCount;}
}
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
// Canonical page identity also covers homepage aliases without guessing URLs.
const motionAppearancePage=typeof document==='undefined'?null:JSON.parse(document.getElementById('page-data')?.textContent||'{}').page;
function motionAppearanceSpeed(config){return motionAppearancePage&&motionAppearancePage!=='home'?1.75:config.speed_multiplier;}
function motionDuration(name){return SiteMotionAppearance.duration_ms[name]/motionAppearanceSpeed(SiteMotionAppearance);}
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
   const target=animation.effect?.target;
   if(!(animation instanceof CSSAnimation||animation instanceof CSSTransition)||accelerated.has(animation)||target?.closest?.('video.hero-video,#today-river'))continue;
   const speed=target?.closest?.('.lb-stage,.lb-page,#one-sentence')?config.speed_multiplier:motionAppearanceSpeed(config);
   animation.updatePlaybackRate(speed);accelerated.add(animation);
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
 const line=Math.max(offset,Math.min(240,innerHeight/4)),x=innerWidth/2,hit=document.elementFromPoint(x,line);
 const semantic=readingPosition?.nodeRevision===typesetReadingState.revision&&readingPosition.node?.isConnected?readingPosition.node:hit?.closest('p,h1,h2,h3,h4,tr,[data-row-key],[data-source-node],[data-panorama-node]')||[...document.querySelectorAll('.how-panorama-visual')].find(el=>{const r=el.getBoundingClientRect();return r.width&&r.height&&r.left<=x&&r.right>=x&&r.top<=line&&r.bottom>=line;});
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
 if(el){const r=readingScreenGeometry(el),maxScroll=Math.max(0,document.documentElement.scrollHeight-innerHeight);readingPosition={id:el.dataset.screen,fraction:(scrollY+offset-r.top)/r.height,gap:Math.min(0,scrollY+offset-r.top),atTop:scrollY<2,atBottom:maxScroll>0&&Math.abs(scrollY-maxScroll)<=1};}else readingPosition=null;
 if(semantic){const identity=['data-panorama-node','data-source-node','data-row-key','id'].find(name=>semantic.getAttribute(name));
 readingPosition={...(readingPosition||{}),node:semantic,nodeTop:semantic.getBoundingClientRect().top,nodeOwner:semantic.closest('[data-screen],section'),nodeIdentity:identity?[identity,semantic.getAttribute(identity)]:null};}
}
function cancelReadingResize(){
 const revision=++typesetReadingState.revision;
 if(resizeFrame)cancelAnimationFrame(resizeFrame);resizeFrame=0;
 if(resizing)layout();
 resizing=false;typesetReadingState.saved=null;document.body.style.paddingBottom='';
 typesetReadingState.width=innerWidth;typesetReadingState.height=innerHeight;
 return revision;
}
function readingLayoutReady(){
 const kind=JSON.parse(document.querySelector('#page-data').textContent).kind,key=['cockpit','computer-access','mcp'].includes(kind)?'b2StatusPhase':document.querySelector('.typeset-live')?'statusPhase':null;
 return document.fonts.ready.then(()=>new Promise(resolve=>{const settle=()=>{if(key&&!['ready','error'].includes(document.body.dataset[key]))requestAnimationFrame(settle);else requestAnimationFrame(()=>requestAnimationFrame(resolve));};settle();}));
}
function resizeLayout(){
 if(!resizing){rememberReadingPosition();typesetReadingState.saved=readingPosition;resizing=true;}
 const revision=++typesetReadingState.revision,saved=typesetReadingState.saved;
 if(resizeFrame)cancelAnimationFrame(resizeFrame);
 resizeFrame=requestAnimationFrame(()=>{
  resizeFrame=0;document.body.style.paddingBottom='';layout();
  const el=saved&&[...document.querySelectorAll('.screen')].find(s=>s.dataset.screen===saved.id);
  // Manifest aspect ratios reserve dimensions before downloads. Decode the
  // destination screen, then let shared header/TOC layout settle before placing.
  const images=el?[...el.querySelectorAll('.typeset-part:not([hidden]) picture img')]:[],navigationImages=[...document.querySelectorAll('#site-header img,.toc img')];
  Promise.all([document.fonts.ready,readingLayoutReady(),...images.map(load),...navigationImages.map(im=>im.decode().catch(()=>{}))]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(revision!==typesetReadingState.revision)return;
   const owner=saved?.nodeOwner?.isConnected?saved.nodeOwner:saved?.nodeOwner?.id&&document.getElementById(saved.nodeOwner.id),identity=saved?.nodeIdentity;
   const anchor=saved?.node?.isConnected&&saved.node.getClientRects().length?saved.node:identity&&owner&&[...owner.querySelectorAll(saved.node.tagName+'['+identity[0]+'="'+CSS.escape(identity[1])+'"]')].find(node=>node.getClientRects().length);
   if(saved?.atTop)scrollTo({top:0,behavior:'instant'});
   else if(saved?.atBottom)scrollTo({top:Math.max(0,document.documentElement.scrollHeight-innerHeight),behavior:'instant'});
   else if(anchor)scrollBy({top:anchor.getBoundingClientRect().top-saved.nodeTop,behavior:'instant'});
   else if(el&&saved){
    const r=readingScreenGeometry(el);
    // A screen's preceding whitespace is a pixel gap, not part of its image.
    const previousEnd=Math.max(0,...[...document.querySelectorAll('.screen')].map(readingScreenGeometry).filter(box=>box.height&&box.top<r.top).map(box=>box.top+box.height));
    const within=saved.fraction<0?Math.max(saved.gap,previousEnd-r.top):r.height*saved.fraction,naturalMax=Math.max(0,document.documentElement.scrollHeight-innerHeight-(parseFloat(document.body.style.paddingBottom)||0));
    const top=Math.max(0,Math.min(r.top+within-updateAnchorOffset(),saved.fraction<0?naturalMax:Infinity));
    const needed=Math.max(0,top+innerHeight-document.documentElement.scrollHeight);
    if(needed&&saved.fraction>=0)document.body.style.paddingBottom=(parseFloat(getComputedStyle(document.body).paddingBottom)||0)+Math.ceil(needed)+'px';
    scrollTo({top,behavior:'instant'});
   }
   if(saved?.node)setTimeout(()=>{if(revision!==typesetReadingState.revision)return;const current=identity&&owner&&[...owner.querySelectorAll(saved.node.tagName+'['+identity[0]+'="'+CSS.escape(identity[1])+'"]')].find(node=>node.getClientRects().length)||anchor;if(current?.isConnected){scrollBy({top:current.getBoundingClientRect().top-saved.nodeTop,behavior:'instant'});readingPosition={...saved,node:current,nodeTop:saved.nodeTop,nodeOwner:owner,nodeIdentity:identity,nodeRevision:revision};}resizing=false;typesetReadingState.saved=null;},800);
   if(!saved?.node){resizing=false;typesetReadingState.saved=null;}
   typesetReadingState.width=innerWidth;typesetReadingState.height=innerHeight;
   rememberReadingPosition();if(anchor)readingPosition={...(readingPosition||{}),node:anchor,nodeTop:anchor.getBoundingClientRect().top,nodeOwner:owner,nodeIdentity:identity,nodeRevision:typesetReadingState.revision};window.SiteToc?.update();
  })));
 });
}
document.addEventListener('click',event=>{
 const node=event.target instanceof Element?event.target:event.target?.parentElement;
 const link=node?.closest('a[href]');
 if(node?.closest('.back-to-top')||(link&&link.hash&&link.hash!=='#menu'&&link.origin===location.origin&&link.pathname===location.pathname))cancelReadingResize();
},true);
addEventListener('pointerdown',event=>{if(event.isTrusted&&event.clientX>=document.documentElement.clientWidth)cancelReadingResize();},{capture:true,passive:true});
for(const event of ['wheel','touchstart'])addEventListener(event,cancelReadingResize,{passive:true});
addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))cancelReadingResize();});
/* typeset-live-flow-v1 */
(function(){
 const states=new WeakMap(),hosts=new Set(),pending=new Set();let frame=0,readerInput=0;
 for(const type of ['wheel','touchmove','keydown','resize','click','pointerdown','hashchange'])window.addEventListener(type,()=>readerInput++,{passive:true,capture:true});
 function preserveReader(){
  if(resizing||innerWidth!==typesetReadingState.width||innerHeight!==typesetReadingState.height)return ()=>{};
  const line=Math.min(180,innerHeight/4),hit=document.elementFromPoint(innerWidth/2,line);
  const semantic=el=>el?.closest('article,[data-row-key]:not(details)');
  const node=semantic(hit)||semantic(document.elementFromPoint(innerWidth/4,line))||hit?.closest('.cp-section,.typeset-part,#today-river')||[...document.querySelectorAll('.cp-section,.typeset-part:not([hidden]),#today-river')].find(el=>{const r=el.getBoundingClientRect();return r.top<=line&&r.bottom>line;});
  if(!node)return ()=>{};
  const top=node.getBoundingClientRect().top,host=node.closest('.cp-section,.typeset-part,#today-river'),key=node.dataset.rowKey,input=readerInput,at=performance.now(),revision=typesetReadingState.revision,width=innerWidth,height=innerHeight;
  const place=()=>{const current=node.isConnected?node:key&&host?.querySelector('[data-row-key="'+CSS.escape(key)+'"]');if(!resizing&&revision===typesetReadingState.revision&&width===innerWidth&&height===innerHeight&&input===readerInput&&current?.isConnected){const delta=current.getBoundingClientRect().top-top;if(Math.abs(delta)>.5)window.scrollBy({top:delta,behavior:'instant'});}};
  return ()=>{requestAnimationFrame(()=>requestAnimationFrame(place));setTimeout(()=>{place();requestAnimationFrame(()=>requestAnimationFrame(place));},Math.max(0,800-(performance.now()-at)));};
 }
 const validRect=rect=>Array.isArray(rect)&&rect.length===4&&rect.every(Number.isFinite)&&rect[0]>=0&&rect[1]>=0&&rect[2]>0&&rect[3]>0&&rect[0]+rect[2]<=1.001&&rect[1]+rect[3]<=1.001;
 const isLamp=cell=>(cell.livePart||cell.live_part||cell.node?.dataset.livePart)==='lamp';
 function plan(cells,height,obstacles=[]){
  const entries=cells.filter(cell=>validRect(cell.rect)&&!isLamp(cell)).map(cell=>({...cell,maskRect:validRect(cell.maskRect)?cell.maskRect:cell.rect})).sort((a,b)=>a.rect[1]-b.rect[1]||a.rect[0]-b.rect[0]);
  const bands=[];
  for(const cell of entries){const r=cell.maskRect,large=r[2]>.55&&r[3]*height>=80,padding=large||cell.compactFrame===true?0:Math.min(.025,Math.max(16/Math.max(1,height),r[3]*.6));bands.push({start:Math.max(0,r[1]-padding),end:Math.min(1,r[1]+r[3]+padding),cells:[cell]});}
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
  if(node.parentNode===parent)return;
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
  const image=document.createElement('img');image.className='typeset-live-flow-image';image.alt='';image.setAttribute('aria-hidden','true');image.decoding='async';image.loading='lazy';image.fetchPriority='low';image.draggable=false;image.src=state.source.currentSrc||state.source.getAttribute('src')||state.source.dataset.src||state.host._layout.src;
  const layer=document.createElement('div');layer.className='typeset-live-flow-layer';tile.append(image,layer);
  tile.dataset.sourceLeft=String(columns[0]);tile.dataset.sourceRight=String(columns[1]);
  const record={node:tile,image,layer,start,end,masked,columns,state};state.tiles.push(record);return record;
 }
 function mask(tile,width,height){
  const [left,right]=tile.columns,top=tile.start,bottom=tile.end,origin=[left*width,top*height];
  const removed=tile.masked.map(cell=>cell.maskRect);
  for(const cell of tile.state.cells)if(cell.node.hidden){const r=cell.rect,pad=56/tile.state.host._layout.size[1],x=Math.max(left,r[0]),y=Math.max(top,r[1]-pad),w=Math.min(right,r[0]+r[2])-x,h=Math.min(bottom,r[1]+r[3])-y;if(w>0&&h>0)removed.push([x,y,w,h]);}
  // Opaque native controls replace their bitmap button/input, including its
  // antialiased outline. Retaining it produces a second border at the corners.
  for(const [node,box]of tile.state.boxes)if(node.isConnected&&node.matches('.b2-image-action:disabled,.b2-image-action[data-label-changing=true],.b2-image-action[data-b2-action=submit],input.b2-slot')){
   const r=box.rect,px=2/width,py=2/height,x=Math.max(left,r[0]-px),y=Math.max(top,r[1]-py),endX=Math.min(right,r[0]+r[2]+px),endY=Math.min(bottom,r[1]+r[3]+py);
   if(endX>x&&endY>y)removed.push([x,y,endX-x,endY-y]);
  }
  // Crop only source pixels. Links and motion in the sibling layer may span
  // a cut; clipping the whole tile would make those real targets unreachable.
  if(!removed.length){tile.image.style.clipPath='inset('+[top,1-right,1-bottom,left].map(value=>value*100+'%').join(' ')+')';return;}
  // Even-odd polygons remove only the original live rectangles, retaining all
  // surrounding raster text and decorations. Every tile uses the same source.
  const points=[origin,[right*width,top*height],[right*width,bottom*height],[left*width,bottom*height],origin];
  for(const r of removed){const x=r[0]*width,y=r[1]*height,right=(r[0]+r[2])*width,bottom=(r[1]+r[3])*height;points.push([x,y],[x,bottom],[right,bottom],[right,y],[x,y],origin);}
  tile.image.style.clipPath='polygon(evenodd,'+points.map(p=>p[0]+'px '+p[1]+'px').join(',')+')';
 }
 function tileFor(state,rect){
  const middle=rect[0]+rect[2]/2,epsilon=.00001;
  // CSSOM rounds percentage styles; boundary points belong to the following
  // tile whether their source came from the manifest or its rounded style.
  return state.tiles.find(tile=>rect[1]>=tile.start-epsilon&&rect[1]<tile.end-epsilon&&middle>=tile.columns[0]-epsilon&&middle<tile.columns[1]-epsilon)||state.tiles.at(-1);
 }
 function measure(state){
  const host=state.host;if(!host.isConnected||host.hidden)return null;
  return {width:host.clientWidth,columnHeight:state.column?.cell.node.offsetHeight||0,hostHeight:host.offsetHeight};
 }
 function update(state,box=measure(state)){
  const host=state.host;if(!host.isConnected||host.hidden)return;
  if(!box)return;
  const width=box.width,height=width*host._layout.size[1]/host._layout.size[0];host._mediaHeight=height;
  const cockpit=host.closest('[data-screen^="cockpit-"]'),heightKey='site-layout-height-v1:'+location.pathname+':'+cockpit?.dataset.screen+':'+host._layout.orientation+':'+width;
  if(cockpit)try{host.style.minHeight=document.body.dataset.b2StatusPhase==='loading'?(Number(localStorage.getItem(heightKey))||height)+'px':'';if(document.body.dataset.b2StatusPhase==='ready')localStorage.setItem(heightKey,String(host.offsetHeight));}catch{}
  const sourceURL=state.source.currentSrc||state.source.getAttribute('src')||state.source.dataset.src||host._layout.src;
  const emptyStrip=host._layout.compact_live===true&&state.cells.every(cell=>cell.node.hidden);
  const firstLive=Math.min(...state.cells.map(cell=>cell.rect[1])),lastLive=Math.max(...state.cells.map(cell=>cell.rect[1]+cell.rect[3]));
  for(const tile of state.tiles){
   if(tile.image.getAttribute('src')!==sourceURL)tile.image.src=sourceURL;
   tile.node.style.height=(tile.end-tile.start)*height+'px';Object.assign(tile.image.style,{width:width+'px',height:height+'px',left:-tile.columns[0]*width+'px',top:-tile.start*height+'px'});mask(tile,width,height);
   tile.node.hidden=tile.optional||tile.collapseWhenEmpty&&tile.masked.every(cell=>cell.node.hidden)||emptyStrip&&tile.start>=firstLive-.00001&&tile.end<=lastLive+.00001;
   if(emptyStrip&&tile.start===0){const end=Math.max(0,firstLive-120/host._layout.size[1]);tile.node.style.height=end*height+'px';tile.image.style.clipPath='inset(0 0 '+(1-end)*100+'% 0)';}
  }
  for(const band of state.bands)if(band.optional)band.node.hidden=band.cells.every(cell=>cell.node.hidden);
  for(const band of state.bands)if(band.replace&&!band.column&&!band.row){
   const rect=band.cells[0].maskRect,offset=(rect[1]-band.start)*height;
   Object.assign(band.cards.style,{marginTop:-((band.end-band.start)*height-offset)+'px',marginLeft:rect[0]*width+'px',width:rect[2]*width+'px',minHeight:'0px'});
   band.cells[0].node.style.setProperty('--typeset-live-min-height','0px');
  }
  for(const band of state.bands)if(band.row)band.cells[0].node.style.setProperty('--typeset-live-min-height','0px');
  if(state.column)state.column.cell.node.style.setProperty('--typeset-live-min-height','0px');
  for(const band of state.bands)if(band.row&&band.cells[0].maskRect[2]>.9)for(const tile of state.tiles)if(tile.node.parentNode===band.node)tile.node.style.height=Math.min((tile.end-tile.start)*height,band.cards.offsetHeight)+'px';
  if(state.column?.rect[2]>.9)for(const tile of [state.tiles[0],state.tiles.at(-1)])tile.node.style.height=Math.min(height,state.column.cell.node.parentElement.parentElement.offsetHeight)+'px';
  const columnDelta=state.column?box.columnHeight-state.column.rect[3]*height:0;
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
  if(host.dataset.liveFlowHeight!==String(box.hostHeight))host.dataset.liveFlowHeight=String(box.hostHeight);
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
    const cards=document.createElement('div');cards.className='typeset-live-flow-cards';cards.style.setProperty('--typeset-live-columns',Math.min(3,band.cells.length));region.append(cards);container.append(region);
    for(const cell of band.cells){move(cards,cell.node);cell.node.style.setProperty('--typeset-live-min-height','0px');}
    state.bands.push({node:region,cards,start:band.start,end:band.end,cells:band.cells,replace:false,compact:true,optional:true});cursor=band.end;
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
   const optional=band.cells.every(cell=>cell.collapseWhenEmpty),raster=makeTile(state,band.start,band.end,band.cells);
   raster.optional=band.cells.every(cell=>['ca-toast','ca-results'].includes(cell.slot));
   raster.collapseWhenEmpty=optional;
   raster.node.hidden=raster.optional||optional&&band.cells.every(cell=>cell.node.hidden);
   region.append(raster.node);
   const sameRow=band.cells.every(cell=>Math.abs(cell.rect[1]-band.cells[0].rect[1])<.00001);
   const cards=document.createElement('div');cards.className='typeset-live-flow-cards';cards.style.setProperty('--typeset-live-columns',optional&&!sameRow?1:Math.min(3,band.cells.length));region.append(cards);container.append(region);
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
  for(const target of hosts)if(!target.isConnected){hosts.delete(target);pending.delete(target);}
  for(const target of host?[host]:hosts)pending.add(target);
  if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const batch=[...pending].map(target=>states.get(target)).filter(Boolean).map(state=>[state,measure(state)]);pending.clear();for(const [state,box]of batch)update(state,box);if(!resizing)rememberReadingPosition();});
 }
 function sourceBox(host,rect){
  const state=states.get(host);if(!state||!validRect(rect))return null;
  const tile=state.column?state.tiles[0]:tileFor(state,rect);
  if(!tile)return null;
  const image=tile.image.getBoundingClientRect();
  let delta=0;
  if(state.column){const live=state.column.rect,overlap=rect[0]<live[0]+live[2]&&rect[0]+rect[2]>live[0];if(overlap&&rect[1]>=live[1]+live[3]-.00001)delta=state.column.cell.node.getBoundingClientRect().height-live[3]*image.height;}
  return {left:image.left+rect[0]*image.width,top:image.top+rect[1]*image.height+delta,width:rect[2]*image.width,height:rect[3]*image.height,image_width:image.width,image_height:image.height};
 }
 function liveCell(host,node){
  const state=states.get(host);return state?.cells.find(cell=>!isLamp(cell)&&(cell.node===node||cell.node.contains(node)))||null;
 }
 window.TypesetLiveFlow={apply,request,reset,plan,sourceBox,liveCell,preserveReader,cancelReader:()=>readerInput++};
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
    if(hot.reference_only){el=document.createElement('span');el.className='hotspot';el.tabIndex=0;el.style.cursor='help';el.title='此辅助文档未随规则快照发布：'+hot.original_href;el.setAttribute('aria-label',el.title);}
    else if(hot.invalid){el=document.createElement('span');el.className='typeset-unbound';el.textContent='动作待接入';}
    else{el=makeLink(hot);el.dataset.typesetKind=hot.kind;if(screen.primary_href&&hot.href!==screen.primary_href)el.dataset.cardSecondary='true';}
   }else if(hot.kind==='live'){
    el=document.createElement('a');el.className='slot typeset-live';el.dataset.slot=hot.slot;el.dataset.livePart=hot.live_part||'';el.setAttribute('role','status');
    el.innerHTML='<i aria-hidden="true"></i><span>暂时读不到</span>';el.dataset.state='unknown';
   }else if(hot.kind==='screenshot'){
    el=document.createElement(hot.shots?.length>1?'div':'button');if(el.tagName==='BUTTON')el.type='button';el.className='typeset-screenshot';el.setAttribute('aria-label','查看截图：'+(hot.shots?.[0]?.caption||screen.title));
    const shots=hot.shots||[];el.dataset.compare=String(shots.length>1);
    const show=()=>window.SiteImageViewer?.openGallery(shots.map(s=>({src:new URL(s.full||s.src,location.href).href,title:s.caption})),0,el);
    for(const shot of shots){const wrap=document.createElement('span'),stage=document.createElement('span'),im=new Image();wrap.className='typeset-shot-crop';stage.className='typeset-shot-stage';im.loading='lazy';im.fetchPriority='low';im.src=shot.src;im.alt=shot.caption;im.decoding='async';im.dataset.role=shot.role;wrap.dataset.crop=JSON.stringify([0,0,...shot.size]);stage.append(im);wrap.append(stage);el.append(wrap);wrap._shot=shot;if(shots.length>1&&shot.role==='before')wrap.classList.add('compare-before');}
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
   return cell?{node,rect:cell.rect,livePart:cell.live_part||node.dataset.livePart,compactFrame:part.compact_live===true,collapseWhenEmpty:true}:null;
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
  const result=parse(payload,el.dataset.slot,data.project);
  const slot=el.dataset.slot,part=el.closest('.typeset-part');
  el.hidden=result.empty===true;
  el.dataset.optionalEmpty=String(result.empty===true);
  if(el.hidden){el.replaceChildren();continue;}
  const title=data.status_binding?.prefixes?.[slot]||data.status_binding?.labels?.[slot];
  if(window.LiveStatusUI){
   window.LiveStatusUI.decorate(el,result,{slot,project:data.project,title,readAt:result.readAt,cached:result.cached,compact:true,icons:data.shared?.live_status_icons});
   const scale=part?part.clientWidth/(part._layout?.size?.[0]||part.clientWidth):1;
   el.style.fontSize=Math.max(14,Math.min(18,scale*32))+'px';
   el.style.lineHeight='1.5';el.style.overflow='visible';el.style.whiteSpace='normal';
  }else{
   // The build loads the component before this adapter. Preserve truthful text
   // if an older prepared release has not yet received that asset.
   const value=(title?title+'：':'')+(result.text||'暂时读不到');
   el.replaceChildren(document.createElement('i'),document.createElement('span'));
   el.querySelector('span').textContent=value;el.title=value;el.dataset.state=result.cached?'offline':result.state||'unknown';el.dataset.cached=String(!!result.cached);
   el.style.fontSize='14px';el.style.lineHeight='1.5';el.style.overflow='visible';
   if(result.href){el.href=result.href;el.target='_blank';el.rel='noopener';}else el.removeAttribute('href');
  }
 }
 // The image-page owner can expand its geometry using the rendered card height.
 // This adapter neither reads another source nor changes poster placement.
 document.dispatchEvent(new CustomEvent('live-status-layout',{detail:{phase}}));
}

function layout(){window.SiteStatus?.resetLayout();arrangeGrids();document.documentElement.style.setProperty('--group-title-color',page.theme?.group_title_colour||'#065c34');const o=orientation();for(const s of page.screens){const section=document.querySelector('[data-screen="'+s.id+'"]');if(s.render_mode==='typeset'){installTypeset(section,s);continue;}if(s.render_mode==='source_text'||s.render_mode==='text'||s.render_mode==='card'){section.dataset.layout=s.render_mode;section._layout={cards:[],numbers:[]};continue;}const target=s.shape==='card'?'h':s.shape==='strip'?(innerWidth<600?'v':'h'):o;const lay=s.layouts[target]||s.layouts.h;section.dataset.layout=s.shape==='card'?'card':s.layouts[target]?target:'h-fallback';section.classList.toggle('is-placeholder',!!lay.placeholder);const label=section.querySelector('.placeholder-label');if(label){label.hidden=!lay.placeholder;label.querySelector('span').textContent=lay.placeholder_reason||'图片未到';}section.querySelector('.live-banner-tail')?.remove();section.querySelector('picture').style.clipPath='';section._removedLiveBand=null;section.style.height='';section.style.aspectRatio=lay.size.join('/');section._mediaHeight=section.clientWidth*lay.size[1]/lay.size[0];const overlay=section.querySelector('.overlays');overlay.style.height=section._mediaHeight+'px';overlay.replaceChildren();
 const used=installRasterCards(section,lay,overlay);
 const wholeCard=(lay.interactive_cards||[]).find(c=>c.whole);
 const wholePeers=lay.links.map(h=>({...h,whole:false,rect:h.text_rect||h.rect}));
 for(const h of lay.links){if(used.has(h.id))continue;const extra=!!wholeCard&&h.href!==wholeCard.href;const hit=makeLink(extra?secondaryLink(h,wholePeers,section.clientWidth,section.clientHeight):h,h.whole?'hotspot card-main':'hotspot');if(s.shape==='card'&&!h.whole&&!h.text_only&&innerWidth<600)rectStyle(hit,cardTouchRect(h,lay.links,section.clientWidth,section.clientHeight));overlay.append(hit);}
 for(const h of lay.links){if(h.arrow_rect&&!used.arrowIds.has(h.id)){const extra=!!wholeCard&&h.href!==wholeCard.href;const raw={...h,rect:h.arrow_rect};const marker=makeLink(extra?secondaryLink(raw,wholePeers,section.clientWidth,section.clientHeight):raw);marker.dataset.linkPart='arrow';overlay.append(marker);}}
 for(const a of lay.anchors){const el=document.createElement('span');el.className='point-anchor';el.id=a.id;el.style.left=a.rect[0]*100+'%';el.style.top=a.rect[1]*100+'%';overlay.append(el);}
 let strip=document.querySelector('.live-strip[data-screen="'+s.id+'"]');
 if(lay.live.length){if(!strip){strip=document.createElement('div');strip.className='live-strip';strip.dataset.screen=s.id;strip.setAttribute('role','status');strip.hidden=true;section.after(strip);}strip.replaceChildren();const label=document.createElement('strong');label.className='live-strip-label';label.textContent='现在';strip.append(label);for(const c of lay.live){const el=document.createElement('a');el.className='slot';el.dataset.slot=c.slot;el.dataset.state='loading';el.setAttribute('role','status');el.innerHTML='<i aria-hidden="true"></i><span></span>';strip.append(el);}
 const detection=lay.live_detection,banner=detection?.enclosing_banner;const start=banner?banner[1]-4:detection?.caption?Math.min(detection.caption[1],...(detection.selected||[]).map(r=>r[1]))-16:null;section.dataset.liveBanner=start===null?'unlocated':'located';
 }else strip?.remove();
 installRuleLabels(section,lay,page.rule_release);
 // 小标记明确提示截图可放大；完整原件由现有查看器打开。
 for(const shot of lay.screenshots||[]){const hit=document.createElement('button');hit.type='button';hit.className='shot-hit';hit.dataset.shotId=shot.id;hit.setAttribute('aria-label','放大截图：'+shot.caption);hit.title='查看完整截图';rectStyle(hit,shot.rect);hit.innerHTML='<span class="shot-zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="6"></circle><path d="m15 15 6 6M10 7v6M7 10h6"></path></svg></span>';hit.onclick=()=>window.SiteImageViewer?.openGallery([{src:new URL('assets/'+shot.src,location.href).href,title:shot.caption}],0,hit);overlay.append(hit);}
 for(const r of []){const d=document.createElement('i');d.className='status-pulse';rectStyle(d,r);overlay.append(d);}
 for(const ar of []){const d=document.createElement('span');d.className='arrow-flow'+(ar.direction==='v'?' vertical':'');rectStyle(d,ar.rect);d.innerHTML='<i></i>';d.style.setProperty('--travel',(ar.direction==='v'?section.clientHeight*ar.rect[3]:section.clientWidth*ar.rect[2])+'px');overlay.append(d);}
 section._layout=lay;
 if(lay.live.length)removeLiveBanner(section,lay);
 }
 document.querySelectorAll('.project-metric strong').forEach(n=>{n.style.fontSize='';let size=parseFloat(getComputedStyle(n).fontSize);while(n.scrollWidth>n.clientWidth+1&&size>12){size=Math.max(12,size*.94);n.style.fontSize=size+'px';}});
 installShared();ensureScreenAnchorSpace();scenery();window.SiteIndicators?.bind();window.SiteToc?.update();document.dispatchEvent(new Event('site-layout'));
}
function arrangeGrids(){for(const grid of document.querySelectorAll('.card-grid')){const fixed=page.kind==='projects-home'&&!mq.matches;grid.style.justifyContent=fixed?'flex-start':'';const cells=[...grid.children],limit=fixed?2:innerWidth<600?1:innerWidth<1200?2:3;let remaining=cells.length,offset=0;while(remaining){let n=fixed?2:Math.min(limit,remaining);if(limit===3&&(remaining===4||remaining===5))n=2;for(let i=0;i<Math.min(n,remaining);i++){cells[offset+i].style.setProperty('--row-columns',n);const img=cells[offset+i].querySelector('picture img');if(img){const size=Math.ceil((Math.min(1600,innerWidth-(innerWidth<600?20:48))-(n-1)*24)/n)+'px';img.sizes=size;cells[offset+i].querySelectorAll('picture source').forEach(source=>source.sizes=size);}}const consumed=Math.min(n,remaining);offset+=consumed;remaining-=consumed;}}}
function scenery(){document.querySelector('.scenery')?.replaceChildren();document.body.classList.remove('has-background-art');document.body.style.removeProperty('--page-background');}

function motion(){const enabled=!rm.matches&&!audit&&!document.body.classList.contains('motion-stalled');document.body.classList.toggle('motion-off',!enabled);document.body.classList.toggle('paused',document.hidden);if(!enabled)document.querySelectorAll('.number-roll,.card-mask').forEach(x=>x.remove());document.dispatchEvent(new CustomEvent('site-motion',{detail:{enabled,hidden:document.hidden}}));}
rm.addEventListener('change',motion);document.addEventListener('visibilitychange',motion);
const menu=document.querySelector('#menu');function showMenu(){menu.showModal();}document.querySelector('#open-menu').onclick=showMenu;document.querySelector('.close-menu').onclick=()=>menu.close();menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
document.addEventListener('click',e=>{const a=(e.target instanceof Element?e.target:e.target?.parentElement)?.closest('a[href="#menu"]');if(a){e.preventDefault();showMenu();}});
const viewer=document.querySelector('#image-viewer');document.querySelector('.close-viewer').onclick=()=>viewer.close();
let readingPosition=null,resizing=false,resizeFrame=0;
function ensureScreenAnchorSpace(){document.body.style.paddingBottom='';const last=[...document.querySelectorAll('.screen')].at(-1);if(!last)return;let top=0;for(let node=last;node;node=node.offsetParent)top+=node.offsetTop;const offset=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0;const needed=Math.max(0,top-offset+innerHeight-document.documentElement.scrollHeight);if(needed>0)document.body.style.paddingBottom=Math.ceil(needed)+'px';}
document.fonts.ready.then(()=>window.SiteToc?.update());mq.addEventListener('change',resizeLayout);addEventListener('resize',resizeLayout);addEventListener('scroll',rememberReadingPosition,{passive:true});layout();motion();rememberReadingPosition();
function scrollToCurrentHash(){const readingRevision=cancelReadingResize();const hash=location.hash;document.querySelectorAll('.is-anchor-target').forEach(e=>e.classList.remove('is-anchor-target'));if(hash){const target=document.getElementById(decodeURIComponent(hash.slice(1)));if(target){const screen=target.closest('.screen');if(screen){screen.dataset.seen='1';screen.classList.add('is-anchor-target');screen.classList.remove('entering');screen.getAnimations().forEach(a=>a.cancel());}const place=()=>{if(readingRevision!==typesetReadingState.revision||location.hash!==hash||!target.isConnected)return;const offset=updateAnchorOffset(),top=scrollY+target.getBoundingClientRect().top,needed=Math.max(0,top-offset+innerHeight-document.documentElement.scrollHeight);if(needed>0)document.body.style.paddingBottom=(parseFloat(getComputedStyle(document.body).paddingBottom)||0)+Math.ceil(needed)+'px';scrollTo({top:Math.max(0,top-offset),behavior:'instant'});rememberReadingPosition();window.SiteToc?.update();};place();requestAnimationFrame(place);}}rememberReadingPosition();window.SiteToc?.update();}
let initialReadingRevision=typesetReadingState.revision;const restoreInitialHash=()=>{if(!resizing&&typesetReadingState.revision===initialReadingRevision){scrollToCurrentHash();initialReadingRevision=typesetReadingState.revision;}};
Promise.all([document.fonts.ready,...[...document.querySelectorAll('#site-header img,.toc img')].map(im=>im.decode().catch(()=>{}))]).then(()=>requestAnimationFrame(restoreInitialHash));addEventListener('hashchange',scrollToCurrentHash);
addEventListener('load',restoreInitialHash,{once:true});
document.addEventListener('dragstart',e=>{if((e.target instanceof Element?e.target:e.target?.parentElement)?.closest('.screen picture,.screen .overlays'))e.preventDefault();});
document.addEventListener('selectstart',e=>{const target=e.target instanceof Element?e.target:e.target?.parentElement;if(target?.closest('.screen picture,.screen .hotspot,.raster-card'))e.preventDefault();});
document.querySelectorAll('.screen picture img').forEach(im=>im.draggable=false);
document.querySelectorAll('.shape-card').forEach(card=>{const main=card.querySelector('.card-main,.project-main');for(const link of card.querySelectorAll('a:not(.card-main):not(.project-main)')){if(link.href!==main?.href)link.dataset.cardSecondary='true';else delete link.dataset.cardSecondary;}card.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&card.querySelector('.card-main,.project-main')&&!(e.target instanceof Element?e.target:e.target?.parentElement)?.closest('[data-card-secondary]'))card.classList.add('is-pressed');});for(const event of ['pointerup','pointercancel'])card.addEventListener(event,()=>card.classList.remove('is-pressed'));card.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')card.classList.remove('is-pressed');});});
// 插画视频由独立hero.js按首屏加载及可见性条件管理。

function reveal(section){if(section===document.querySelector('.screen')||section.classList.contains('shape-card'))return;if(section.dataset.seen||document.body.classList.contains('motion-off'))return;section.dataset.seen='1';section.classList.add('entering');section.addEventListener('animationend',e=>{if(e.target===section){section.classList.remove('entering');window.SiteToc?.update();}});

}
if('IntersectionObserver'in window){const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){reveal(e.target);observer.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.screen').forEach(x=>observer.observe(x));}
function gridAudit(){return [...document.querySelectorAll('.card-grid')].map(g=>{const r=g.getBoundingClientRect(),cells=[...g.children].map(c=>c.getBoundingClientRect()),rows=[];for(const c of cells){let row=rows.find(a=>Math.abs(a[0].top-c.top)<1);if(!row){row=[];rows.push(row);}row.push(c);}return {cards:cells.length,rowCounts:rows.map(a=>a.length),equalWithinRows:rows.every(a=>a.every(c=>Math.abs(c.width-a[0].width)<1&&Math.abs(c.height-a[0].height)<1)),fillsRows:rows.every(a=>Math.abs(a[0].left-r.left)<1&&Math.abs(a.at(-1).right-r.right)<1)};});}
window.SiteAudit={async ready(){loadFooter();await Promise.all(mediaImages.map(load));await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));await document.fonts.ready;motion();return this.measure();},measure(){return {textStrips:[...document.querySelectorAll('.text-strip')].map(s=>({heading:s.querySelector('h2').textContent,within:s.scrollWidth<=s.clientWidth+1,headingSize:getComputedStyle(s.querySelector('h2')).fontSize,descriptionSize:getComputedStyle(s.querySelector('p')).fontSize,colour:getComputedStyle(s.querySelector('h2')).color})),grids:gridAudit(),orientation:orientation(),width:innerWidth,height:innerHeight,tocVisible:document.querySelector('.toc').getClientRects().length>0,hasPortraitForAll:page.screens.every(s=>s.render_mode==='typeset'||s.render_mode==='source_text'||s.render_mode==='text'||s.shape==='card'||!!s.layouts.v),placeholderScreens:[...document.querySelectorAll('.screen.is-placeholder')].map(s=>s.dataset.screen),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,images:[...document.images].filter(i=>i.getAttribute('src')).map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.currentSrc})),slots:[...document.querySelectorAll('.slot')].map(c=>({slot:c.dataset.slot,text:c.textContent.trim(),fits:c.scrollWidth<=c.clientWidth+1&&c.scrollHeight<=c.clientHeight+1&&c.querySelector('span').getBoundingClientRect().width<=c.clientWidth+1})),layouts:[...document.querySelectorAll('.screen')].map(s=>s.dataset.layout),anchors:[...document.querySelectorAll('.point-anchor')].map(a=>({id:a.id,inside:a.offsetLeft>=0&&a.offsetLeft<=a.parentElement.clientWidth&&a.offsetTop>=0&&a.offsetTop<=a.parentElement.clientHeight})),links:[...document.querySelectorAll('.hotspot')].filter(a=>a.getClientRects().length).map(a=>({label:a.getAttribute('aria-label'),inside:a.offsetLeft>=-1&&a.offsetTop>=-1&&a.offsetLeft+a.offsetWidth<=a.parentElement.clientWidth+1&&a.offsetTop+a.offsetHeight<=a.parentElement.clientHeight+1})),animations:document.getAnimations().filter(a=>a.playState==='running').length};}};
// 截图模式自己加载页尾与原文插画，直接打开URL也能得到完整画面。
if(audit)void window.SiteAudit.ready();

;
(function(){'use strict';
const unknown={text:'暂时读不到',state:'unknown'};
const readTimeoutMs=8000;
const statusEndpoints=['https://live.wly0829.cn/computer-access/state','https://mcp.wly0829.cn/computer-access/api/status'];
let successfulEndpoint=null;
async function readStatus(signal,refresh=false,local=['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname)){
 return retryStatus(async()=>{
  let failure;
  const endpoints=local?['/__status']:successfulEndpoint?[successfulEndpoint,...statusEndpoints.filter(url=>url!==successfulEndpoint)]:statusEndpoints;
  for(const url of endpoints){
   if(signal?.aborted)throw signal.reason;
   const controller=new AbortController(),abort=()=>controller.abort(),timer=setTimeout(abort,readTimeoutMs);
   signal?.addEventListener('abort',abort,{once:true});
   try{
    const response=await fetch(url+(refresh?'?refresh=1':''),{credentials:'include',cache:'no-store',signal:controller.signal});
    if(!response.ok){const error=Error('HTTP_'+response.status);error.httpStatus=response.status;throw error;}
    const next=await response.json();if(!freshStatus(next))throw Error('expired_snapshot');if(!local)successfulEndpoint=url;return next;
   }catch(error){failure=error;if(signal?.aborted)throw error;}
   finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
  }
  throw failure;
 },signal);
}
async function retryStatus(read,signal){
 for(let attempt=0;;attempt++)try{return await read();}catch(error){
  if(attempt===2||signal?.aborted||error.httpStatus>=400&&error.httpStatus<500||/^HTTP_4/.test(error.message||''))throw error;
  await new Promise((resolve,reject)=>{const abort=()=>{clearTimeout(timer);reject(error);};const timer=setTimeout(()=>{signal?.removeEventListener('abort',abort);resolve();},500*(attempt+1));signal?.addEventListener('abort',abort,{once:true});});
 }
}
function freshStatus(data,now=Date.now()){
 const maxAge=(Number(data?.max_age_seconds)||120)*1000,fresh=t=>Number.isFinite(t)&&t>0&&t*1000<=now+60000&&now-t*1000<=maxAge;
 if(!fresh(data?.served_at_unix??data?.observed_at_unix))return false;
 const sources=Object.values(data?.display_cache?.collectors||{});
 const screen=data?.host?.screen_state?.value??data?.host?.screen_state;
 if(sources.length&&(['locked','unlocked','no_session'].includes(screen)&&fresh(data?.host?.sources?.screen_state?.observed_at_unix)||['personal_data','unrestricted'].some(key=>['locked','unlocked','active','inactive','expired','revoked','closing'].includes(data?.[key]?.state)&&fresh(data[key].observed_at_unix))))return true;
 return sources.length?sources.some(s=>fresh(s.observed_at_unix)||s.observed_at_unix==null&&s.state==='reading'&&fresh(s.unavailable_since_unix??s.refresh_started_at_unix)):fresh(data?.observed_at_unix);
}
function connectionText(at,loading=false){const date=Number.isFinite(at)&&at>0?new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(at*1000)):null;return (loading?'正在连接电脑。':'读不到电脑：可能电脑不在线，也可能是你这边的网络连不上它。')+(date?'最后读到是 '+date+'（北京时间）。':'还没读到过。');}
function formatTime(value,now){const t=typeof value==='string'?Date.parse(value):NaN;if(!Number.isFinite(t)||t>now)return null;const parts=d=>Object.fromEntries(new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(d)).map(p=>[p.type,p.value]));const d=parts(t),n=parts(now);return (d.year===n.year&&d.month===n.month&&d.day===n.day?'今天':(d.year===n.year?'':d.year+'年')+d.month+'月'+d.day+'日')+' '+d.hour+':'+d.minute;}
function taskResult(task,now){if(!task)return unknown;if(task.enabled===false||task.state==='disabled')return {text:'已停用',state:'disabled'};const labels={success:'正常',warn:'需要留意',failed:'失败',running:'正在运行'};const t=formatTime(task.last_run_at,now);return t&&Object.hasOwn(labels,task.state)?{text:labels[task.state]+' · '+t,state:task.state==='success'?'ok':task.state}:unknown;}
function parse(data,slot,project,now=Date.now(),historical=false){
 function items(name,states){const b=data?.[name];if(!b||!states.includes(b.state)&&!(historical&&b.state==='stale')||!Array.isArray(b.items))return null;const t=Date.parse(b.observed_at);return Number.isFinite(t)&&t<=now+60000&&(historical||now-t<=(Number(b.max_age_seconds)||120)*1000)?b.items:null;}
 if(slot==='run'){const row=items('projects',['ok','empty','partial'])?.find(x=>x.project===project);const labels={ok:'运行正常',failed:'上次运行失败',overdue:'有任务没按时跑',not_applicable:'暂无启用中的任务'};return row&&Object.hasOwn(labels,row.run_health)?{text:labels[row.run_health],state:row.run_health}:unknown;}
 if(slot==='cloud'){
  if(project==='照片视频录音管理'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='照片视频录音云端维护');return taskResult(task,now);}
  if(project!=='中文语音转写')return unknown;
  const row=items('projects',['ok','empty','partial'])?.find(x=>x.project==='中文语音转写');
  const cloud=row?.cloud_review;
  if(!cloud||['stale','unavailable'].includes(row.state)||!['state','free_until','last_run_at','last_result','failure_reason'].every(key=>Object.hasOwn(cloud,key))||!['success','failed','none'].includes(cloud.last_result))return unknown;
  if(cloud.state==='auto'){
   if(cloud.last_result==='failed')return {text:'最近一次复核失败',state:'failed'};
   const until=typeof cloud.free_until==='string'?Date.parse(cloud.free_until):NaN;
   if(!Number.isFinite(until))return unknown;
   const parts=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'numeric',day:'numeric'}).formatToParts(new Date(until));
   const month=parts.find(p=>p.type==='month').value,day=parts.find(p=>p.type==='day').value;
   return {text:`自动复核中（免费到 ${month} 月 ${day} 日）`,shortText:'自动复核中',state:'ok'};
  }
  const labels={paused:'已暂停',expired:'免费期已到，不再自动',error:'出错已停'};
  return Object.hasOwn(labels,cloud.state)?{text:labels[cloud.state],state:cloud.state}:unknown;
 }
 if(slot==='acceptance'){const row=items('projects',['ok','partial','empty'])?.find(x=>x.project===project);const n=row?.waiting_user_count;return Number.isInteger(n)&&n>=0?{text:n?`${n} 项待验收`:'没有待验收',state:n?'waiting':'ok'}:unknown;}
 if(slot==='watch'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='AI 工具升级观察');if(!task)return unknown;if(task.enabled===false||task.state==='disabled')return {text:'平时停着',state:'disabled'};return task.enabled===true?taskResult(task,now):unknown;}
 if(slot==='local'||slot==='panel')return unknown;
 if(slot==='config'||slot==='wechat'){const name=slot==='config'?'开发配置备份':'微信聊天备份';const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name===name);const item=task&&items('backups',['ok','partial','empty'])?.find(x=>x.id===task.id&&x.project===project);const t=item&&formatTime(item.last_success_at,now);return t?{text:'上次成功 '+t,state:item.state==='stale'?'overdue':'ok'}:unknown;}
 if(slot==='health'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='内存盘维护');return taskResult(task,now);}
 if(slot==='capture'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='串流画面切换');const state=task?.related_status?.capture;const labels={success:'正常',failed:'异常',warn:'需要留意'};return Object.hasOwn(labels,state)?{text:labels[state],state:state==='success'?'ok':state}:unknown;}
 if(slot==='sync'){const rows=items('projects',['ok','partial','empty'])?.filter(x=>x.mode==='repository');if(!rows?.length)return unknown;let yes=0,no=0,unread=0;for(const row of rows){const g=row.github_sync,t=Date.parse(g?.observed_at);if(!g||!Number.isFinite(t)||t>now+60000||now-t>600000){unread++;continue;}if(g.state==='in_sync')yes++;else if(['ahead','behind','diverged','local_ahead','remote_ahead','out_of_sync'].includes(g.state))no++;else unread++;}return {text:`已同步 ${yes} 个 · 未同步 ${no} 个`+(unread?` · ${unread} 个缺少当前读数`:''),state:unread?'warn':no?'overdue':'ok'};}
 if(slot==='grafana'){const g=data?.grafana,t=Date.parse(g?.checked_at);if(g?.state==='reachable'&&Number.isFinite(t)&&t<=now+60000&&now-t<=300000&&typeof g.url==='string'&&/^https:\/\//.test(g.url))return {text:'在线',state:'ok',href:g.url};return unknown;}
 if(['lessons','week','practice'].includes(slot)){
  const row=items('projects',['ok','empty','partial'])?.find(x=>x.project==='学习方法');const metrics=row?.metrics;if(!metrics||!historical&&['stale','unavailable'].includes(row.state))return unknown;
  const integer=v=>Number.isInteger(v)&&v>=0;
  if(slot==='lessons'){const m=metrics.lessons;return m&&integer(m.done)&&integer(m.total)&&m.done<=m.total?{text:`已学 ${m.done}/${m.total} 课`,state:'learning'}:unknown;}
  if(slot==='week'){const m=metrics.sessions_7d;return m&&integer(m.count)&&integer(m.minutes)?{text:`近 7 天 ${m.count}次 · ${m.minutes}分钟`,state:'learning'}:unknown;}
  const p=metrics.practice;if(!p)return unknown;const pieces=[];for(const [key,label,a,b]of [['algorithm','算法','done','total'],['java_review','复习','done','total'],['quiz','答题','correct','asked'],['experiments','实验','done','planned']]){const v=p[key];if(v&&integer(v[a])&&integer(v[b])&&v[a]<=v[b])pieces.push(`${label} ${v[a]}/${v[b]}`);}return pieces.length?{text:pieces.join(' · '),state:'learning'}:unknown;
 }
 if(slot==='backup'){const list=items('backups',['ok','empty']);if(!list)return unknown;let ok=0,bad=0;for(const b of list){if(b.enabled===false||b.state==='disabled')continue;if(b.enabled!==true)return unknown;if(b.state==='success'&&Number.isFinite(Date.parse(b.last_success_at)))ok++;else bad++;}return {text:`备份 ${ok}项正常 · ${bad}项要看`,state:bad?'overdue':'ok'};}
 if(slot==='image'){const today=items('today',['ok','empty']);if(!today)return unknown;const valid=t=>Number.isFinite(t)&&t<=now;const complete=today.filter(x=>x.type==='system_backup_completed').map(x=>Date.parse(x.at)).filter(valid);const started=today.filter(x=>x.type==='system_backup_started').map(x=>Date.parse(x.at)).filter(valid);if(complete.length){const last=Math.max(...complete);if(started.length&&Math.max(...started)>last)return {text:'镜像 正在做',state:'running'};return {text:'镜像 今天 '+new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(last)),state:'ok'};}return {text:started.length?'镜像 正在做':'镜像 今天还没做',state:started.length?'running':'none'};}
 return unknown;
}
function fitCloud(cell,result,minFont=6,maxFont=Infinity){
 const span=cell.querySelector('span'),initial=Math.max(minFont,Math.min(maxFont,cell.clientHeight*.7));
 const overflow=()=>cell.scrollWidth>cell.clientWidth+1||cell.scrollHeight>cell.clientHeight+1;
 function fit(text){span.textContent=text;let fs=initial;cell.style.fontSize=fs+'px';while(fs>minFont&&overflow()){fs=Math.max(minFont,fs*.9);cell.style.fontSize=fs+'px';}}
 fit(result.text);if(overflow()&&result.shortText)fit(result.shortText);
}
function unifyBannerFonts(cells,minimum){
 if(!cells.length)return null;
 const font=Math.max(minimum,Math.min(...cells.map(c=>parseFloat(c.style.fontSize)||minimum)));
 for(const cell of cells){cell.style.fontSize=font+'px';cell.style.justifyContent='center';cell.style.alignItems='center';cell.style.textAlign='center';const span=cell.querySelector('span');if(span.style.whiteSpace!=='pre-line'){span.style.whiteSpace='nowrap';cell.style.whiteSpace='nowrap';if(cell.scrollWidth>cell.clientWidth+1){span.style.whiteSpace='normal';cell.style.whiteSpace='normal';}}}
 return font;
}
function cacheKey(page,slot){return `site-live:v1:${page}:${slot}`;}
function readLast(storage,page,slot,project,now=Date.now()){try{const c=JSON.parse(storage.getItem(cacheKey(page,slot)));return c&&c.project===project&&typeof c.result?.text==='string'&&c.result.state!=='unknown'&&Number.isFinite(c.at)&&c.at<=now+60000?c:null;}catch{return null;}}
function readCache(storage,page,slot,project,now=Date.now()){const c=readLast(storage,page,slot,project,now);return c&&now-c.at<86400000?c:null;}
function offlineResult(c,now=Date.now()){return c?{text:'读不到电脑 · 当时：'+c.result.text+' · 上次读到 '+formatTime(new Date(c.at).toISOString(),now)+(now-c.at>=86400000?'（已超过24小时）':'')+' · 当前状态未知',state:'offline',cached:true,readAt:c.at/1000}: {text:'读不到电脑 · 还没读到过',state:'offline',cached:false};}
const helpers={parse,fitCloud,unifyBannerFonts,readCache,readLast,offlineResult,cacheKey,formatTime,connectionText,freshStatus,readTimeoutMs,retryStatus,readStatus};
if(typeof module!=='undefined'&&module.exports){module.exports=helpers;return;}
window.SiteLiveRuntime=helpers;
window.dispatchEvent?.(new Event('site-live-ready'));
const page=JSON.parse(document.querySelector('#page-data').textContent),loading={text:'读取中',state:'loading'};
let last=null,busy=false,controller=null,phase='loading',offline=false,cancelledForVisibility=false;const history=[];let started=0;
const lastValues=new Map();
function resetOfflineLayout(){
 for(const section of document.querySelectorAll('.offline-expanded')){section.classList.remove('offline-expanded');section.style.height='';section.style.aspectRatio=section._layout.size.join('/');section.querySelector('picture').style.clipPath='';for(const [el,style]of section._offlineStyles||[])if(el.isConnected)el.style.cssText=style;section._offlineStyles=null;section.querySelectorAll('.offline-tail,.offline-notice').forEach(e=>e.remove());}
}
function offlineNotice(section,texts){if(section.classList.contains('typeset-screen'))return;
 const lay=section._layout,base=section.clientWidth*lay.size[1]/lay.size[0],banner=lay.live_detection?.enclosing_banner;const cut=banner?(banner[3]-lay.crop[1])*section.clientWidth/lay.size[0]+3:Math.max(...lay.live.map(c=>(c.rect[1]+c.rect[3])*base))+10;
 const notice=document.createElement('div');notice.className='offline-notice';notice.setAttribute('role','status');notice.textContent=[...new Set(texts)].join('；');const left=Math.min(...lay.live.map(c=>c.rect[0]*section.clientWidth));Object.assign(notice.style,{left:left+'px',top:cut+'px',width:(section.clientWidth-left-12)+'px'});section.append(notice);const extra=notice.offsetHeight+12;
 const picture=section.querySelector('picture'),tail=document.createElement('div'),copy=new Image();tail.className='offline-tail';tail.setAttribute('aria-hidden','true');Object.assign(tail.style,{top:(cut+extra)+'px',height:(base-cut)+'px'});copy.src=picture.querySelector('img').currentSrc;Object.assign(copy.style,{width:section.clientWidth+'px',top:-cut+'px'});tail.append(copy);section.append(tail);
 const children=[...section.querySelector('.overlays').children];section._offlineStyles=children.map(e=>[e,e.style.cssText]);const boxes=children.map(e=>({e,x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight}));section.style.height=(base+extra)+'px';section.style.aspectRatio='auto';picture.style.clipPath=`inset(0 0 ${Math.max(0,base-cut)}px 0)`;section.classList.add('offline-expanded');for(const b of boxes)Object.assign(b.e.style,{left:b.x+'px',top:(b.y+(b.y>=cut?extra:0))+'px',width:b.w+'px',height:b.h+'px'});
}
function currentResult(slot){
 const connected=last&&freshStatus(last)&&(phase==='ready'||phase==='loading');
 const optional=['learning','ai-cli-profile-manager','pc-panel-hub'].includes(page.page);
 let result=connected?(slot==='run'&&page.page==='remote-control'?{text:'电脑连接服务在线',state:'ok',readAt:last.served_at_unix??last.observed_at_unix}:parse(last,slot,page.project)):unknown;
 const block=slot==='grafana'?'grafana':['config','wechat','backup'].includes(slot)?'backups':['image'].includes(slot)?'today':['watch','cloud','health','capture'].includes(slot)?'automation':'projects';
 const source=last?.[block],readAt=result.readAt||Number(source?.observed_at_unix)||Date.parse(source?.observed_at||source?.checked_at)/1000;
 const row=source?.items?.find(x=>x.project===page.project);
 const outdated=connected&&(source?.state==='stale'||['stale','unavailable'].includes(row?.state)||Number.isFinite(readAt)&&Date.now()/1000-readAt>(Number(source?.max_age_seconds)||120));
 if(outdated)result=unknown;
 if(result.state!=='unknown')return {...result,readAt:Number.isFinite(readAt)?readAt:undefined};
 let cached=lastValues.get(slot);try{cached ||= readCache(localStorage,page.page,slot,page.project)||readLast(localStorage,page.page,slot,page.project);}catch{}
 if(optional){
  const previous=connected?parse(last,slot,page.project,Date.now(),true):unknown;
  const old=previous.state!=='unknown'?{result:previous,at:Date.parse(row?.updated_at||row?.observed_at||source?.observed_at)}:cached;
  if(old&&Number.isFinite(old.at)){const parts=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'numeric',day:'numeric'}).formatToParts(new Date(old.at)),date=parts.find(p=>p.type==='month').value+'月'+parts.find(p=>p.type==='day').value+'日';return {...old.result,text:old.result.text+' · 最后更新 '+date+'（已过期）',state:'stale',cached:true,retained:true,readAt:old.at/1000};}
 }
 if(slot==='local'||slot==='panel')return {text:slot==='local'?'此网页尚未读到本地模型实时状态':'此网页尚未读到面板实时状态',state:'unknown'};
 if(last&&phase!=='ready'&&cached)return {...cached.result,text:cached.result.text+' · '+Math.max(0,Math.floor((Date.now()-cached.at)/60000))+' 分钟前读到',state:'unknown',cached:true,retained:true,readAt:cached.at/1000};
 if(connected&&source?.collection_state==='reading')return cached?{...offlineResult(cached),text:'此项正在读取 · 当时：'+cached.result.text+' · 上次读到 '+formatTime(new Date(cached.at).toISOString(),Date.now()),state:'unknown'}:{text:'正在读取这一项 · 还没读到过',state:'loading',readAt:undefined};
 if(connected)return cached?{...offlineResult(cached),text:'此项当前读不到 · 当时：'+cached.result.text+' · 上次读到 '+formatTime(new Date(cached.at).toISOString(),Date.now()),state:'unknown'}:{text:result.text!==unknown.text?result.text:source?.state==='stale'?'这一项的读数已过期':'这一项暂时读不到',state:'unknown'};
 if(phase==='loading'&&!last)return cached?{...offlineResult(cached),text:'正在重新读取 · '+cached.result.text,retained:true}:loading;
 return offlineResult(cached);
}
function display(){
 resetOfflineLayout();
 for(const strip of document.querySelectorAll('.live-strip')){
  const cells=[...strip.querySelectorAll('[data-slot]')],results=cells.map(cell=>currentResult(cell.dataset.slot));
  const readable=results.length>0&&results.every(result=>result.state!=='unknown'||result.retained);strip.hidden=!readable;
  cells.forEach((cell,i)=>{const result=results[i],prefix=page.status_binding?.prefixes?.[cell.dataset.slot],text=readable?(prefix?prefix+'：':'')+result.text:'';cell.querySelector('span').textContent=text;cell.title=text;cell.dataset.state=readable?result.state:'unknown';cell.dataset.cached=String(!!result.cached);
   if(readable&&result.href){cell.href=result.href;cell.setAttribute('role','link');cell.target='_blank';cell.rel='noopener';}else{cell.removeAttribute('href');cell.setAttribute('role','status');}
  });
 }
 if(typeof displayTypesetStatus==='function')displayTypesetStatus(last,phase,(_payload,slot)=>currentResult(slot),page);
 const failed=phase==='error'||phase==='ready'&&!freshStatus(last),waiting=phase==='loading'&&!last;
 let notice=document.querySelector('[data-computer-read-notice]');
 if((failed||waiting)&&document.querySelector('main')&&(document.querySelector('[data-slot]')||page.home_living===true)){
  if(!notice){notice=document.createElement('aside');notice.dataset.computerReadNotice='true';notice.setAttribute('role','status');notice.style.cssText='margin:12px 24px;padding:12px 16px;border:1px solid #d4ddd7;border-radius:8px;background:white;color:#68766f;line-height:1.5';document.querySelector('main')?.prepend(notice);}
  const times=[...document.querySelectorAll('[data-slot]')].map(cell=>currentResult(cell.dataset.slot).readAt).filter(Number.isFinite);let saved=0;try{saved=Number(localStorage.getItem('computer-last-read-v1'))||0;}catch{}
  const at=Number(last?.observed_at_unix)|| (times.length?Math.max(...times):saved);
  notice.textContent=(last&&phase==='error'?'连接暂时中断，下面保留 '+Math.max(0,Math.floor((Date.now()/1000-at)/60))+' 分钟前读到的数据。':connectionText(at,waiting))+(at>0?'旧数只表示当时的状态。':'');
  const link=document.createElement('a');link.href='/mcp/';link.textContent='查看连接电脑页的副机备用入口';notice.append(' ',link);notice.hidden=false;
 }else if(notice)notice.hidden=true;
 document.body.dataset.statusPhase=phase;
 const snap={phase,at:performance.now(),elapsedMs:started?performance.now()-started:0,slots:[...document.querySelectorAll('[data-slot]')].map(c=>({slot:c.dataset.slot,text:c.textContent.trim(),cached:false}))};history.push(snap);if(history.length>20)history.shift();
}
async function refresh(){
 if(busy||document.hidden||!document.querySelector('[data-slot]'))return;
 busy=true;phase='loading';offline=false;cancelledForVisibility=false;started=performance.now();display();controller=new AbortController();
 try{
  last=await readStatus(controller.signal);phase='ready';document.body.dataset.statusError='';
  if(phase==='ready')try{localStorage.setItem('computer-last-read-v1',String(Date.now()/1000));}catch{}
  if(phase==='ready')for(const cell of document.querySelectorAll('[data-slot]')){const slot=cell.dataset.slot,result=currentResult(slot);if(!['unknown','loading'].includes(result.state)){const saved={project:page.project,result,at:Number.isFinite(result.readAt)?result.readAt*1000:Date.now()};lastValues.set(slot,saved);try{localStorage.setItem(cacheKey(page.page,slot),JSON.stringify(saved));}catch{}}}
 }catch(e){phase=cancelledForVisibility?'loading':'error';offline=!cancelledForVisibility&&(e.name==='AbortError'||e.name==='TypeError'||/^HTTP_5/.test(e.message||''));document.body.dataset.statusError=e.name==='AbortError'?'timeout':e.message;}
 finally{busy=false;display();}
}
document.addEventListener('site-layout',()=>{display();if(phase==='loading'&&!started&&!last&&!busy)refresh();});addEventListener('resize',display);
document.fonts?.ready.then(display);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelledForVisibility=true;controller?.abort();}else refresh();});display();refresh();setInterval(refresh,60000);
window.SiteStatus={parse,refresh,history,resetLayout:resetOfflineLayout};
})();

;
/* 水彩流动、回顶与两个小彩蛋；不改变生成图里的正文与数字。 */
(()=>{'use strict';
 const data=JSON.parse(document.querySelector('#page-data').textContent),ambient=document.querySelector('.ambient-motion');
 let enabled=false;
 const canMove=()=>!document.body.classList.contains('motion-off')&&!document.hidden;
 function setup(){ambient.querySelectorAll('.watercolour-wash,.falling-leaf').forEach(e=>e.remove());if(document.body.classList.contains('motion-off'))return;for(let i=0;i<3;i++){const wash=document.createElement('i');wash.className='watercolour-wash';wash.style.setProperty('--wash-index',i);ambient.append(wash);}const paper=document.querySelector('.paper').getBoundingClientRect(),gap=Math.max(0,paper.left),n=6;for(let i=0;i<n;i++){if(!data.shared.leaves.length)break;const leaf=new Image();leaf.decoding='async';leaf.fetchPriority='low';leaf.src=data.shared.leaves[i%data.shared.leaves.length];leaf.alt='';leaf.className='falling-leaf';const position=motionLeafPosition(innerWidth,gap,i,n);leaf.style.left=position+'px';leaf.style.setProperty('--fall-time',(15+i*2)+'s');leaf.style.setProperty('--fall-delay',(-i*3-2)+'s');leaf.style.setProperty('--leaf-size',(innerWidth<600?28:40+i%3*7)+'px');leaf.style.setProperty('--drift',(i%2?35:-30)+'px');ambient.append(leaf);}}
 function updateMotion(){enabled=canMove();if(enabled&&!ambient.querySelector('.watercolour-wash'))setup();ambient.classList.toggle('is-paused',!enabled);}
 document.addEventListener('site-motion',updateMotion);addEventListener('resize',()=>{setup();updateMotion();});setup();updateMotion();
 const top=document.querySelector('.back-to-top'),bird=document.querySelector('.easter-bird'),footer=document.querySelector('footer'),bubble=document.querySelector('.footer-bubble');
 if(data.shared.art?.back_to_top){top.replaceChildren();const im=new Image();im.src=data.shared.art.back_to_top;im.alt='';top.append(im);}
 if(data.shared.art?.easter_bird){const im=new Image();im.src=data.shared.art.easter_bird;im.alt='';bird.append(im);}
 let returning=false,flightTimer=0,bubbleTimer=0;
 function hideBird(){clearTimeout(flightTimer);bird.hidden=true;bird.classList.remove('flying');}
 function showBird(){
  if(!canMove()||!data.shared.art?.easter_bird)return;
  const screen=document.querySelector('.ts-screen,.screen');if(!screen||!bird)return;const r=screen.getBoundingClientRect(),first=data.screens.find(s=>s.layouts?.[screen.dataset.layout]||s.layouts?.h),lay=first?.layouts?.[screen.dataset.layout]||first?.layouts?.h,title=lay?.title_rect;
  const w=innerWidth<600?100:150,x=title?r.left+(title[0]+title[2])*r.width+10:r.left+r.width*.35,y=title?r.top+title[1]*r.height:r.top+18;
  bird.style.width=w+'px';bird.style.left=Math.max(8,Math.min(innerWidth-w-8,x))+'px';bird.style.top=Math.max(65,y)+'px';bird.hidden=false;bird.classList.remove('flying');requestAnimationFrame(()=>bird.classList.add('flying'));clearTimeout(flightTimer);flightTimer=setTimeout(hideBird,motionDelay(2300));
 }
 function updateTop(){top.hidden=scrollY<innerHeight*.65||footer.getBoundingClientRect().top<innerHeight;if(returning&&scrollY<=2){returning=false;showBird();}}
 top.onclick=()=>{returning=true;scrollTo({top:0,behavior:canMove()?'smooth':'instant'});requestAnimationFrame(updateTop);};
 addEventListener('scroll',updateTop,{passive:true});addEventListener('resize',updateTop);updateTop();
 const signature=document.querySelector('.footer-signature-trigger');signature.onclick=async()=>{
  const done=document.querySelector('.scenery-done'),landscape=document.querySelector('.footer-landscape');
  if(done){if(!canMove())return;try{await done.decode();}catch{return;}if(!canMove())return;landscape.classList.add('is-celebrating');clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>landscape.classList.remove('is-celebrating'),motionDelay(1800));return;}
  const box=data.shared.art?.footer_bubble,im=document.querySelector('.scenery-subject');if(!canMove()||!box||!im||!bubble)return;
  const host=bubble.parentElement.getBoundingClientRect(),r=im.getBoundingClientRect();Object.assign(bubble.style,{left:r.left-host.left+r.width*box[0]+'px',top:r.top-host.top+r.height*box[1]+'px',width:r.width*box[2]+'px',height:r.height*box[3]+'px'});
  bubble.hidden=false;let font=Math.max(6,r.height*box[3]*.65);bubble.style.fontSize=font+'px';while(bubble.scrollWidth>bubble.clientWidth+1&&font>5){font*=.94;bubble.style.fontSize=font+'px';}clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>bubble.hidden=true,motionDelay(1800));
 };
 document.addEventListener('site-motion',()=>{if(!canMove()){hideBird();clearTimeout(bubbleTimer);if(bubble)bubble.hidden=true;document.querySelector('.footer-landscape')?.classList.remove('is-celebrating');}});
 window.SiteMotion={get enabled(){return enabled;},get frames(){return document.getAnimations().filter(a=>a.playState==='running').length;},refresh:updateMotion};
})();

;
/* 已选七项通用动效；位置只读构建证据，访客端不识图。 */
(()=>{'use strict';
const query=new URLSearchParams(location.search);
const d=JSON.parse(document.querySelector('#page-data').textContent);
const names={cards:'卡片逐张浮现',dots:'状态灯呼吸',arrows:'箭头光点',numbers:'数字从 0 滚到实际值',seam:'翻页水彩衔接',depth:'纸面轻视差',update:'新状态涟漪'};
const on=Object.fromEntries(Object.keys(names).map(k=>[k,true]));
// Numbers follow the live shared reduced-motion guard.
const visible=new Set(),played=new WeakMap(),animations=new Set();const mode=/^[abcde]$/.test(query.get('bg')||'')?query.get('bg'):'a';
background();if(query.get('audit')==='1')return;
const enabled=()=>!document.body.classList.contains('motion-off'),moving=()=>enabled()&&!document.hidden;
function displayY(s,y){const b=s._removedLiveBand;return b&&y>=b.bottom?y-b.gap:y;}
function rect(e,r,s){const height=s._mediaHeight||s.clientHeight;Object.assign(e.style,{left:r[0]*100+'%',top:displayY(s,r[1]*height)/height*100+'%',width:r[2]*100+'%',height:r[3]*100+'%'});}
function make(s,cls,r){const e=document.createElement('span');e.className='sample-overlay '+cls;e.setAttribute('aria-hidden','true');e._motionRect=r;rect(e,r,s);s.querySelector('.overlays').append(e);return e;}
function animate(e,frames,options,done){const a=e.animate(frames,options);animations.add(a);a.finished.then(()=>{animations.delete(a);done?.();}).catch(()=>animations.delete(a));return a;}
function cancel(s){s.querySelectorAll('.sample-overlay').forEach(e=>{e.getAnimations({subtree:true}).forEach(a=>a.cancel());e.remove();});s.classList.remove('sample-seam');s.style.removeProperty('--sample-y');}
function inView(s,r){const b=s.getBoundingClientRect(),height=s._mediaHeight||s.clientHeight,y=height*r[1],band=s._removedLiveBand;if(band&&y+height*r[3]>band.top&&y<band.bottom)return false;const top=b.top+displayY(s,y);return top<innerHeight&&top+height*r[3]>0;}
function enter(s){if(!moving()||s.classList.contains('offline-expanded')||s.classList.contains('is-anchor-target')||!s._layout)return;const l=s._layout;let seen=played.get(s);if(!seen||seen.layout!==l){seen={layout:l,keys:new Set()};played.set(s,seen);}function start(key,r){if(seen.keys.has(key)||(r&&!inView(s,r)))return false;seen.keys.add(key);return true;}
 let cardOrder=0;
 if(on.cards&&!(s.classList.contains('shape-card')||s.dataset.shape==='card'))(l.cards||[]).forEach((r,i)=>{if([...(l.interactive_cards||[]),...(l.card_text_only||[])].some(c=>{const q=c.rect,ix=Math.max(0,Math.min(r[0]+r[2],q[0]+q[2])-Math.max(r[0],q[0])),iy=Math.max(0,Math.min(r[1]+r[3],q[1]+q[3])-Math.max(r[1],q[1]));return ix*iy>Math.min(r[2]*r[3],q[2]*q[3])*.7;})||!start('card:'+i,r))return;const base=make(s,'sample-card-base',r),e=make(s,'sample-card',r),im=s.querySelector('picture img');const w=s.clientWidth,h=(s._mediaHeight||s.clientHeight);e.style.animation='none';e.style.backgroundImage=`url("${im.currentSrc||im.src}")`;e.style.backgroundSize=`${w}px ${h}px`;e.style.backgroundPosition=`${-r[0]*w}px ${-r[1]*h}px`;animate(e,[{opacity:0,transform:'translateY('+SiteMotionAppearance.baseline.card_enter_px*SiteMotionAppearance.amplitude+'px)'},{opacity:1,transform:'translateY(0)'}],{duration:motionDuration('cards'),delay:cardOrder++*motionDuration('card_stagger'),fill:'both',easing:'ease-out'},()=>{e.remove();base.remove();});});
 if(on.numbers)(l.numbers||[]).forEach((n,i)=>{if(!start('number:'+i,n.rect))return;const e=make(s,'number-roll',n.rect),track=document.createElement('span');track.className='number-track';const steps=20,decimal=(n.numeric.split('.')[1]||'').length;for(let i=0;i<=steps;i++){const item=document.createElement('span');const value=Number((n.value*(1-(1-i/steps)**3)).toFixed(decimal));item.textContent=motionNumberText(n,value,i===steps);track.append(item);}e.append(track);let size=Math.max(14,(s._mediaHeight||s.clientHeight)*n.rect[3]*.85);e.style.fontSize=size+'px';while(track.scrollWidth>e.clientWidth&&size>10)e.style.fontSize=--size+'px';const cleanup=setTimeout(()=>e.remove(),motionDuration('number_cleanup'));animate(track,[{transform:'translateY(0)'},{transform:`translateY(-${steps*100/(steps+1)}%)`}],{duration:motionDuration('numbers'),easing:`steps(${steps},end)`,fill:'forwards'},()=>{clearTimeout(cleanup);e.remove();});});
 if(on.seam&&!(s.classList.contains('shape-card')||s.dataset.shape==='card')&&start('seam')){s.classList.add('sample-seam');setTimeout(()=>s.classList.remove('sample-seam'),motionDuration('seam'));}
}
function decorate(s){if(!moving()||!s._layout||s.classList.contains('offline-expanded'))return;const l=s._layout,candidates=[];
 if(on.dots)(l.dots||[]).forEach((item,i)=>{const r=Array.isArray(item)?item:item.rect;if(motionDotEnabled(item)&&inView(s,r))candidates.push({...(Array.isArray(item)?{}:item),key:'dot:'+i,rect:r});});
 if(on.arrows)(l.arrows||[]).forEach((a,i)=>{if(inView(s,a.rect))candidates.push({...a,key:'arrow:'+i});});
 const active=new Set();for(const e of s.querySelectorAll('.status-pulse,.arrow-flow')){if(!candidates.some(c=>c.key===e.dataset.effectKey))e.remove();else active.add(e.dataset.effectKey);}
 for(const a of candidates){if(active.has(a.key))continue;const arrow=a.key.startsWith('arrow:'),e=make(s,arrow?'arrow-flow'+(a.direction==='v'?' vertical':''):'status-pulse',a.rect);e.dataset.effectKey=a.key;if(!arrow&&a.shape){e.dataset.markerShape=a.shape;e.style.setProperty('--marker-colour',a.colour||'#198452');}if(arrow){e.innerHTML='<i></i>';e.style.setProperty('--travel',(a.direction==='v'?(s._mediaHeight||s.clientHeight)*a.rect[3]:s.clientWidth*a.rect[2])+'px');}}
}
function refresh(){document.body.dataset.sampleDepth=on.depth&&enabled()?'on':'off';for(const s of document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part:not([hidden])')){cancel(s);if(visible.has(s)){decorate(s);enter(s);}}if(!enabled()){for(const a of animations)a.cancel();document.querySelectorAll('.sample-updated').forEach(e=>e.classList.remove('sample-updated'));}background();}
const observer=new IntersectionObserver(es=>{for(const e of es){const s=e.target;s.classList.toggle('sample-offscreen',!e.isIntersecting);if(e.isIntersecting){visible.add(s);decorate(s);enter(s);}else{visible.delete(s);cancel(s);s.getAnimations().forEach(a=>{if(animations.has(a))a.cancel();});}}},{threshold:0});document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part').forEach(s=>observer.observe(s));
let scrollPending=false;addEventListener('scroll',()=>{if(scrollPending||!moving())return;scrollPending=true;requestAnimationFrame(()=>{scrollPending=false;const mobile=innerWidth<600,limit=(mobile?SiteMotionAppearance.baseline.parallax_phone_px:SiteMotionAppearance.baseline.parallax_desktop_px)*SiteMotionAppearance.amplitude;for(const s of visible){for(const e of s.querySelectorAll('.sample-overlay'))if(e._motionRect&&!inView(s,e._motionRect)){e.getAnimations({subtree:true}).forEach(a=>a.cancel());e.remove();}decorate(s);enter(s);const r=s.getBoundingClientRect();s.style.setProperty('--sample-y',on.depth?Math.max(-limit,Math.min(limit,(r.top-innerHeight*.45)*SiteMotionAppearance.baseline.parallax_slope*SiteMotionAppearance.amplitude))+'px':'0px');}if(mode==='d')document.querySelector('.ambient-motion')?.style.setProperty('--background-scroll',Math.min(45,scrollY*.012)+'px');});},{passive:true});
const values=new WeakMap();new MutationObserver(()=>{for(const s of document.querySelectorAll('.slot[data-slot],.b2-slot[data-b2-slot]')){const key=s,text=(s.title||s.textContent||s.getAttribute('aria-label')||'').trim(),old=values.get(key);values.set(key,text);if(on.update&&moving()&&old&&old!==text&&s.dataset.state!=='loading'&&visible.has((s.closest('.typeset-part')||s.closest('.screen')))){s.classList.remove('sample-updated');requestAnimationFrame(()=>{if(moving())s.classList.add('sample-updated');});setTimeout(()=>s.classList.remove('sample-updated'),motionDuration('update'));}}}).observe(document.querySelector('.paper'),{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','data-state']});
function background(){const ambient=document.querySelector('.ambient-motion');if(!ambient||ambient.dataset.background===mode)return;ambient.dataset.background=mode;ambient.querySelectorAll('.background-effect,.sample-plant').forEach(e=>e.remove());const assets=d.shared.art?.backgrounds||{};ambient.style.backgroundImage=assets[mode]?(window.siteAssetBackground?.(assets[mode])||`url("${assets[mode]}")`):'none';for(let i=0;i<3;i++){const e=document.createElement('i');e.className='background-effect';e.style.setProperty('--i',i);ambient.append(e);}if(['c','d'].includes(mode)&&d.shared.leaves.length)for(let i=0;i<4;i++){const leaf=new Image();leaf.src=d.shared.leaves[i%d.shared.leaves.length];leaf.className='sample-plant';leaf.style.setProperty('--i',i);ambient.append(leaf);}}
document.addEventListener('site-layout',refresh);document.addEventListener('site-motion',()=>{document.body.dataset.sampleDepth=on.depth&&enabled()?'on':'off';if(!enabled())refresh();else if(document.hidden){for(const a of animations)a.pause();}else{for(const a of animations)if(a.playState==='paused')a.play();for(const s of visible){decorate(s);enter(s);}}});refresh();window.SiteSamples={options:on,refresh,counts:()=>d.motion_counts,visible:()=>visible.size};
})();


;
/* 短续作说明；截图和明确画廊共用完整大图查看器。 */
(()=>{'use strict';const data=JSON.parse(document.querySelector('#page-data').textContent);
const viewer=document.querySelector('#image-viewer');let images=[],current=0,zoom=1,returnFocus=null,returnPosition=null;
viewer.classList.add('full-image-viewer');viewer.innerHTML='<div class="viewer-toolbar"><button class="viewer-close" aria-label="关闭大图">关闭</button><button class="viewer-prev" aria-label="上一张">←</button><span class="viewer-caption"></span><button class="viewer-next" aria-label="下一张">→</button><button class="viewer-less" aria-label="缩小">−</button><button class="viewer-more" aria-label="放大">＋</button><a target="_blank" rel="noopener">最大尺寸 ↗</a></div><div class="viewer-stage"><img alt=""></div>';
const stage=viewer.querySelector('.viewer-stage'),image=stage.querySelector('img');image.decoding='async';
function draw(){const item=images[current];if(!item)return;image.src=item.src;image.alt=item.title;viewer.querySelector('.viewer-caption').textContent=item.title+(images.length>1?' · '+(current+1)+'/'+images.length:'');viewer.querySelector('a').href=item.src;viewer.querySelector('.viewer-prev').hidden=viewer.querySelector('.viewer-next').hidden=images.length<2;viewer.querySelector('.viewer-prev').disabled=current===0;viewer.querySelector('.viewer-next').disabled=current===images.length-1;zoom=1;stage.scrollTo(0,0);scale();}
function scale(){image.style.width=zoom===1?'auto':Math.round(Math.min(image.naturalWidth||innerWidth,innerWidth-40)*zoom)+'px';image.style.maxWidth=zoom===1?'100%':'none';image.style.maxHeight=zoom===1?'100%':'none';stage.classList.toggle('zoomed',zoom>1);}
function show(list,index=0,trigger=document.activeElement){if(!list.length)return;if(!viewer.open){returnFocus=trigger;returnPosition={left:scrollX,top:scrollY};}images=list;current=Math.max(0,Math.min(list.length-1,index));draw();if(!viewer.open)viewer.showModal();}
function next(step){current=Math.max(0,Math.min(images.length-1,current+step));draw();}
viewer.querySelector('.viewer-close').onclick=()=>viewer.close();viewer.querySelector('.viewer-prev').onclick=()=>next(-1);viewer.querySelector('.viewer-next').onclick=()=>next(1);viewer.querySelector('.viewer-more').onclick=()=>{zoom=Math.min(4,zoom+.5);scale();};viewer.querySelector('.viewer-less').onclick=()=>{zoom=Math.max(1,zoom-.5);scale();};viewer.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();next(1);}if(e.key==='ArrowLeft'){e.preventDefault();next(-1);}});image.ondblclick=()=>{zoom=zoom>1?1:2;scale();};
const touches=new Map();let pinch=null;
function distance(){const p=[...touches.values()];return p.length===2?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0;}
stage.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;touches.set(e.pointerId,{x:e.clientX,y:e.clientY});try{stage.setPointerCapture(e.pointerId);}catch{}if(touches.size===2)pinch={distance:distance(),zoom};e.preventDefault();});
stage.addEventListener('pointermove',e=>{if(!touches.has(e.pointerId))return;const previous=touches.get(e.pointerId);touches.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touches.size===2&&pinch&&pinch.distance){zoom=Math.max(1,Math.min(4,pinch.zoom*distance()/pinch.distance));scale();}else if(touches.size===1&&zoom>1){stage.scrollLeft-=e.clientX-previous.x;stage.scrollTop-=e.clientY-previous.y;}e.preventDefault();});
for(const event of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(event,e=>{touches.delete(e.pointerId);if(touches.size<2)pinch=null;});viewer.addEventListener('close',()=>{touches.clear();pinch=null;if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});if(returnPosition)window.scrollTo({...returnPosition,behavior:'instant'});returnFocus=returnPosition=null;});
// 截图放大标记与画廊显式调用同一入口。
window.SiteImageViewer={openGallery:show};
if(!['project','frozen'].includes(data.kind))return;
const dialog=document.createElement('dialog');dialog.id='ai-brief';dialog.className='brief-dialog';dialog.innerHTML='<form method="dialog"><button class="brief-close" aria-label="关闭续作说明">关闭</button></form><h2>复制 AI 续作说明</h2><label>这次处理哪里<select name="scope"><option>整个项目</option></select></label><label>目标<input name="goal" type="text" placeholder="例如：检查备份失败的原因并修好" autocomplete="off"></label><p class="brief-preview"></p><button class="brief-copy" type="button" disabled>复制</button><p class="brief-status" role="status"></p>';document.body.append(dialog);
const scope=dialog.querySelector('select'),goal=dialog.querySelector('input'),preview=dialog.querySelector('.brief-preview'),copy=dialog.querySelector('.brief-copy'),status=dialog.querySelector('.brief-status');
for(const a of document.querySelectorAll('.toc a')){if(a.dataset.section==='top')continue;const o=document.createElement('option');o.value=a.dataset.section;o.textContent=a.dataset.fullLabel||a.dataset.labelH||a.textContent;scope.append(o);}
function generate(){const repo=data.status_binding?.repo||(data.repo_url?data.repo_url.replace(/^https:\/\/github.com\//,''):'页面未提供仓库地址');const lead=`项目：${data.title}；仓库：${repo}；范围：${scope.options[scope.selectedIndex].textContent}；目标：`,tail='。先读项目的 AGENTS.md 和说明，按现行规则做。';goal.maxLength=Math.max(10,150-lead.length-tail.length);preview.textContent=goal.value.trim()?lead+goal.value.trim()+tail:'';copy.disabled=!goal.value.trim()||preview.textContent.length>150;status.textContent=preview.textContent.length>150?'请把目标再写短一些。':'';}
goal.oninput=scope.onchange=generate;generate();copy.onclick=async()=>{try{await navigator.clipboard.writeText(preview.textContent);status.textContent='已复制。';}catch{status.textContent='自动复制未成功，请选中上面的说明复制。';}};
function open(){dialog.showModal();goal.focus();}
function fallback(){document.querySelector('.continuation-entry')?.remove();const first=document.querySelector('.screen');if(!first)return;const bounds=first.getBoundingClientRect(),has=[...first.querySelectorAll('a')].some(a=>a.hash==='#ai-brief'&&a.getClientRects().length&&a.getBoundingClientRect().bottom<=bounds.bottom);if(has)return;const row=document.createElement('div');row.className='continuation-entry';const b=document.createElement('button');b.textContent='复制 AI 续作说明 ↗';b.onclick=open;row.append(b);first.after(row);}
document.addEventListener('click',e=>{const a=(e.target instanceof Element?e.target:e.target?.parentElement)?.closest('a');if(a&&a.hash==='#ai-brief'&&a.pathname===location.pathname){e.preventDefault();open();}});document.addEventListener('site-layout',fallback);fallback();if(location.hash==='#ai-brief')open();window.SiteBrief={generate,open};
})();

;
/* 只播放人工标注的插画面片；字始终来自底图。原地址流式播放，canplay 后淡入。 */
(()=>{'use strict';const d=JSON.parse(document.querySelector('#page-data').textContent),spec=d.video;if(!spec)return;const state={phase:'image',reason:null};window.SiteHero=state;if(spec.mount_allowed!==true){state.reason='illustration-compatibility';return;}
const query=new URLSearchParams(location.search),rm=matchMedia('(prefers-reduced-motion:reduce)'),portrait=matchMedia('(orientation:portrait)'),section=document.querySelector('.typeset-screen .typeset-part[data-orientation=h]')||document.querySelector('.screen'),hero=section?.querySelector('picture img');if(!hero)return;
let visible=false,video=null,pending=false;
const allowed=()=>query.get('audit')!=='1'&&!rm.matches&&!document.hidden&&!portrait.matches&&innerWidth>=1024&&visible;
async function readyImages(){if(document.readyState!=='complete')await new Promise(r=>addEventListener('load',r,{once:true}));const images=[...document.images].filter(i=>{const b=i.getBoundingClientRect();return i.getAttribute('src')&&b.bottom>0&&b.top<innerHeight;});await Promise.all(images.map(i=>i.decode()));}
function reveal(){requestAnimationFrame(()=>requestAnimationFrame(()=>{if(video&&allowed()&&video.readyState>=3&&!video.paused)video.classList.add('ready');}));}
async function update(){
 if(video){const r=spec.rect;video.style.top=r[1]*(section._mediaHeight||section.clientHeight)+'px';video.style.height=r[3]*(section._mediaHeight||section.clientHeight)+'px';}
 if(!allowed()){if(video){video.pause();video.hidden=true;video.classList.remove('ready');}state.phase='image';return;}
 if(video){video.hidden=false;video.play().then(()=>{if(allowed()&&!video.paused){state.phase='playing';reveal();}}).catch(()=>{video.hidden=true;state.phase='image';});return;}
 if(pending||navigator.connection?.saveData)return;pending=true;
 try{state.phase='waiting-images';await readyImages();if(!allowed())return;
  const mask=new Image();mask.src=spec.mask;await mask.decode();if(!allowed())return;
  video=document.createElement('video');video.className='hero-video';video.muted=true;video.loop=true;video.playsInline=true;video.preload='auto';video.defaultPlaybackRate=spec.playback_rate||1;video.playbackRate=spec.playback_rate||1;video.style.transitionDuration=(spec.intro_fade_seconds??.5)+'s';video.setAttribute('aria-hidden','true');const r=spec.rect;Object.assign(video.style,{left:r[0]*100+'%',top:r[1]*(section._mediaHeight||section.clientHeight)+'px',width:r[2]*100+'%',height:r[3]*(section._mediaHeight||section.clientHeight)+'px',right:'auto',bottom:'auto',maskImage:`url("${spec.mask}")`,webkitMaskImage:`url("${spec.mask}")`});
  video.addEventListener('canplay',reveal);video.addEventListener('playing',()=>{if(allowed()){state.phase='playing';reveal();}});video.addEventListener('error',()=>{video.hidden=true;state.phase='image';state.reason='decode-error';});
  state.phase='loading';video.src=spec.src;section.insertBefore(video,section.querySelector('.overlays'));await video.play();if(allowed()&&!video.paused){state.phase='playing';reveal();}
 }catch(error){state.phase='image';state.reason=String(error);if(video)video.hidden=true;}finally{pending=false;}
}
new IntersectionObserver(es=>{visible=es[0].isIntersecting;update();}).observe(section);for(const event of ['visibilitychange','site-motion','site-layout'])document.addEventListener(event,update);addEventListener('resize',update);rm.addEventListener('change',update);addEventListener('pagehide',()=>{if(video)video.pause();});
})();

for(const [key,value]of Object.entries(motionCSSProperties(SiteMotionAppearance)))document.documentElement.style.setProperty(key,value);
installMotionExperience(SiteMotionAppearance);

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
nav.addEventListener('click',e=>{if(e.target.closest('a[data-section]')){update();setTimeout(update,0);setTimeout(update,320);}});
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
  host.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!e.target.closest('[data-card-secondary]'))host.classList.add('is-pressed');});for(const event of ['pointerup','pointercancel'])host.addEventListener(event,()=>host.classList.remove('is-pressed'));host.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')host.classList.remove('is-pressed');});
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
/* Manifest geometry is normalized against each complete PNG, never cropped. */
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

function motion(){const enabled=!rm.matches&&!audit;document.body.classList.toggle('motion-off',!enabled);document.body.classList.toggle('paused',document.hidden);if(!enabled)document.querySelectorAll('.number-roll,.card-mask').forEach(x=>x.remove());document.dispatchEvent(new CustomEvent('site-motion',{detail:{enabled,hidden:document.hidden}}));}
rm.addEventListener('change',motion);document.addEventListener('visibilitychange',motion);
const menu=document.querySelector('#menu');function showMenu(){menu.showModal();}document.querySelector('#open-menu').onclick=showMenu;document.querySelector('.close-menu').onclick=()=>menu.close();menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
document.addEventListener('click',e=>{const a=e.target.closest('a[href="#menu"]');if(a){e.preventDefault();showMenu();}});
const viewer=document.querySelector('#image-viewer');document.querySelector('.close-viewer').onclick=()=>viewer.close();
let readingPosition=null,resizing=false,resizeFrame=0;
function ensureScreenAnchorSpace(){document.body.style.paddingBottom='';const last=[...document.querySelectorAll('.screen')].at(-1);if(!last)return;let top=0;for(let node=last;node;node=node.offsetParent)top+=node.offsetTop;const offset=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0;const needed=Math.max(0,top-offset+innerHeight-document.documentElement.scrollHeight);if(needed>0)document.body.style.paddingBottom=Math.ceil(needed)+'px';}
function rememberReadingPosition(){if(resizing)return;const offset=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0;const screens=[...document.querySelectorAll('.screen')];const el=screens.find(s=>{const r=s.getBoundingClientRect();return r.bottom>offset;});if(el){const r=el.getBoundingClientRect();readingPosition={id:el.dataset.screen,fraction:(offset-r.top)/r.height,atTop:scrollY<2};}}
function resizeLayout(){if(resizeFrame)return;resizing=true;const saved=readingPosition;resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;layout();if(saved&&!saved.atTop){const el=document.querySelector('[data-screen="'+saved.id+'"]');if(el){const r=el.getBoundingClientRect(),offset=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'))||0;scrollTo({top:scrollY+r.top+r.height*saved.fraction-offset,behavior:'instant'});}}else if(saved?.atTop)scrollTo({top:0,behavior:'instant'});resizing=false;rememberReadingPosition();window.SiteToc?.update();});}
document.fonts.ready.then(()=>window.SiteToc?.update());mq.addEventListener('change',resizeLayout);addEventListener('resize',resizeLayout);addEventListener('scroll',rememberReadingPosition,{passive:true});layout();motion();
function scrollToCurrentHash(){const hash=location.hash;document.querySelectorAll('.is-anchor-target').forEach(e=>e.classList.remove('is-anchor-target'));if(hash){const target=document.getElementById(decodeURIComponent(hash.slice(1)));if(target){const screen=target.closest('.screen');if(screen){screen.dataset.seen='1';screen.classList.add('is-anchor-target');screen.classList.remove('entering');screen.getAnimations().forEach(a=>a.cancel());}const place=()=>{if(location.hash!==hash||!target.isConnected)return;const offset=updateAnchorOffset(),top=scrollY+target.getBoundingClientRect().top,needed=Math.max(0,top-offset+innerHeight-document.documentElement.scrollHeight);if(needed>0)document.body.style.paddingBottom=(parseFloat(getComputedStyle(document.body).paddingBottom)||0)+Math.ceil(needed)+'px';scrollTo({top:Math.max(0,top-offset),behavior:'instant'});rememberReadingPosition();window.SiteToc?.update();};place();requestAnimationFrame(place);}}rememberReadingPosition();window.SiteToc?.update();}
Promise.all([document.fonts.ready,...[...document.querySelectorAll('#site-header img,.toc img')].map(im=>im.decode().catch(()=>{}))]).then(()=>requestAnimationFrame(scrollToCurrentHash));addEventListener('hashchange',scrollToCurrentHash);
addEventListener('load',scrollToCurrentHash,{once:true});
document.addEventListener('dragstart',e=>{if(e.target.closest('.screen picture,.screen .overlays'))e.preventDefault();});
document.addEventListener('selectstart',e=>{const target=e.target instanceof Element?e.target:e.target?.parentElement;if(target?.closest('.screen picture,.screen .hotspot,.raster-card'))e.preventDefault();});
document.querySelectorAll('.screen picture img').forEach(im=>im.draggable=false);
document.querySelectorAll('.shape-card').forEach(card=>{const main=card.querySelector('.card-main,.project-main');for(const link of card.querySelectorAll('a:not(.card-main):not(.project-main)')){if(link.href!==main?.href)link.dataset.cardSecondary='true';else delete link.dataset.cardSecondary;}card.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&card.querySelector('.card-main,.project-main')&&!e.target.closest('[data-card-secondary]'))card.classList.add('is-pressed');});for(const event of ['pointerup','pointercancel'])card.addEventListener(event,()=>card.classList.remove('is-pressed'));card.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')card.classList.remove('is-pressed');});});
// 插画视频由独立hero.js按首屏加载及可见性条件管理。

function reveal(section){if(section===document.querySelector('.screen')||section.classList.contains('shape-card'))return;if(section.dataset.seen)return;section.dataset.seen='1';if(document.body.classList.contains('motion-off'))return;section.classList.add('entering');section.addEventListener('animationend',e=>{if(e.target===section){section.classList.remove('entering');window.SiteToc?.update();}});

}
if('IntersectionObserver'in window){const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){reveal(e.target);observer.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.screen').forEach(x=>observer.observe(x));}
function gridAudit(){return [...document.querySelectorAll('.card-grid')].map(g=>{const r=g.getBoundingClientRect(),cells=[...g.children].map(c=>c.getBoundingClientRect()),rows=[];for(const c of cells){let row=rows.find(a=>Math.abs(a[0].top-c.top)<1);if(!row){row=[];rows.push(row);}row.push(c);}return {cards:cells.length,rowCounts:rows.map(a=>a.length),equalWithinRows:rows.every(a=>a.every(c=>Math.abs(c.width-a[0].width)<1&&Math.abs(c.height-a[0].height)<1)),fillsRows:rows.every(a=>Math.abs(a[0].left-r.left)<1&&Math.abs(a.at(-1).right-r.right)<1)};});}
window.SiteAudit={async ready(){loadFooter();await Promise.all(mediaImages.map(load));await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));await document.fonts.ready;motion();return this.measure();},measure(){return {textStrips:[...document.querySelectorAll('.text-strip')].map(s=>({heading:s.querySelector('h2').textContent,within:s.scrollWidth<=s.clientWidth+1,headingSize:getComputedStyle(s.querySelector('h2')).fontSize,descriptionSize:getComputedStyle(s.querySelector('p')).fontSize,colour:getComputedStyle(s.querySelector('h2')).color})),grids:gridAudit(),orientation:orientation(),width:innerWidth,height:innerHeight,tocVisible:document.querySelector('.toc').getClientRects().length>0,hasPortraitForAll:page.screens.every(s=>s.render_mode==='typeset'||s.render_mode==='source_text'||s.render_mode==='text'||s.shape==='card'||!!s.layouts.v),placeholderScreens:[...document.querySelectorAll('.screen.is-placeholder')].map(s=>s.dataset.screen),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,images:[...document.images].filter(i=>i.getAttribute('src')).map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.currentSrc})),slots:[...document.querySelectorAll('.slot')].map(c=>({slot:c.dataset.slot,text:c.textContent.trim(),fits:c.scrollWidth<=c.clientWidth+1&&c.scrollHeight<=c.clientHeight+1&&c.querySelector('span').getBoundingClientRect().width<=c.clientWidth+1})),layouts:[...document.querySelectorAll('.screen')].map(s=>s.dataset.layout),anchors:[...document.querySelectorAll('.point-anchor')].map(a=>({id:a.id,inside:a.offsetLeft>=0&&a.offsetLeft<=a.parentElement.clientWidth&&a.offsetTop>=0&&a.offsetTop<=a.parentElement.clientHeight})),links:[...document.querySelectorAll('.hotspot')].filter(a=>a.getClientRects().length).map(a=>({label:a.getAttribute('aria-label'),inside:a.offsetLeft>=-1&&a.offsetTop>=-1&&a.offsetLeft+a.offsetWidth<=a.parentElement.clientWidth+1&&a.offsetTop+a.offsetHeight<=a.parentElement.clientHeight+1})),animations:document.getAnimations().filter(a=>a.playState==='running').length};}};
// 截图模式自己加载页尾与原文插画，直接打开URL也能得到完整画面。
if(audit)void window.SiteAudit.ready();

;
(function(){'use strict';
const unknown={text:'暂时读不到',state:'unknown'};
function formatTime(value,now){const t=typeof value==='string'?Date.parse(value):NaN;if(!Number.isFinite(t)||t>now)return null;const parts=d=>Object.fromEntries(new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(d)).map(p=>[p.type,p.value]));const d=parts(t),n=parts(now);return (d.year===n.year&&d.month===n.month&&d.day===n.day?'今天':(d.year===n.year?'':d.year+'年')+d.month+'月'+d.day+'日')+' '+d.hour+':'+d.minute;}
function taskResult(task,now){if(!task)return unknown;const labels={success:'正常',warn:'需要留意',failed:'失败',running:'正在运行',disabled:'已停用'};const t=formatTime(task.last_run_at,now);return t&&Object.hasOwn(labels,task.state)?{text:labels[task.state]+' · '+t,state:task.state==='success'?'ok':task.state}:unknown;}
function parse(data,slot,project,now=Date.now()){
 function items(name,states){const b=data?.[name];if(!b||!states.includes(b.state)||!Array.isArray(b.items))return null;const t=Date.parse(b.observed_at);return Number.isFinite(t)&&t<=now+60000&&now-t<=(Number(b.max_age_seconds)||120)*1000?b.items:null;}
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
 if(slot==='watch'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='AI 工具升级观察');if(!task)return unknown;if(task.enabled===false||task.state==='disabled')return {text:'平时停着',state:'disabled'};const t=formatTime(task.last_run_at,now);return task.enabled===true&&t?{text:'上次 '+t,state:'ok'}:unknown;}
 if(slot==='local'||slot==='panel')return unknown; // 当前接口没有本机模型状态、机箱屏画面实际更新时间，不能拿其他时间代替。
 if(slot==='config'||slot==='wechat'){const name=slot==='config'?'开发配置备份':'微信聊天备份';const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name===name);const item=task&&items('backups',['ok','partial','empty'])?.find(x=>x.id===task.id&&x.project===project);const t=item&&formatTime(item.last_success_at,now);return t?{text:'上次成功 '+t,state:item.state==='stale'?'overdue':'ok'}:unknown;}
 if(slot==='health'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='内存盘维护');return taskResult(task,now);}
 if(slot==='capture'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='串流画面切换');const state=task?.related_status?.capture;const labels={success:'正常',failed:'异常',warn:'需要留意'};return Object.hasOwn(labels,state)?{text:labels[state],state:state==='success'?'ok':state}:unknown;}
 if(slot==='sync'){const rows=items('projects',['ok','empty'])?.filter(x=>x.mode==='repository');if(!rows?.length)return unknown;let yes=0,no=0;for(const row of rows){const g=row.github_sync,t=Date.parse(g?.observed_at);if(!g||!Number.isFinite(t)||t>now+60000||now-t>600000)return unknown;if(g.state==='in_sync')yes++;else if(['ahead','behind','diverged','local_ahead','remote_ahead','out_of_sync'].includes(g.state))no++;else return unknown;}return {text:`已同步 ${yes} 个 · 未同步 ${no} 个`,state:no?'overdue':'ok'};}
 if(slot==='grafana'){const g=data?.grafana,t=Date.parse(g?.checked_at);if(g?.state==='reachable'&&Number.isFinite(t)&&t<=now+60000&&now-t<=300000&&typeof g.url==='string'&&/^https:\/\//.test(g.url))return {text:'在线',state:'ok',href:g.url};return unknown;}
 if(['lessons','week','practice'].includes(slot)){
  const row=items('projects',['ok','empty','partial'])?.find(x=>x.project==='学习方法');const metrics=row?.metrics;if(!metrics||row.state==='stale'||row.state==='unavailable')return unknown;
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
function offlineResult(c){return c?{text:'电脑不在线，最后一次读到是 '+new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(c.at)),state:'offline'}:unknown;}
if(typeof module!=='undefined'&&module.exports){module.exports={parse,fitCloud,unifyBannerFonts,readCache,readLast,offlineResult,cacheKey,formatTime};return;}
const page=JSON.parse(document.querySelector('#page-data').textContent),loading={text:'读取中',state:'loading'};
let last=null,busy=false,controller=null,phase='loading',offline=false,cancelledForVisibility=false;const history=[];let started=0;
function resetOfflineLayout(){
 for(const section of document.querySelectorAll('.offline-expanded')){section.classList.remove('offline-expanded');section.style.height='';section.style.aspectRatio=section._layout.size.join('/');section.querySelector('picture').style.clipPath='';for(const [el,style]of section._offlineStyles||[])if(el.isConnected)el.style.cssText=style;section._offlineStyles=null;section.querySelectorAll('.offline-tail,.offline-notice').forEach(e=>e.remove());}
}
function offlineNotice(section,texts){if(section.classList.contains('typeset-screen'))return;
 const lay=section._layout,base=section.clientWidth*lay.size[1]/lay.size[0],banner=lay.live_detection?.enclosing_banner;const cut=banner?(banner[3]-lay.crop[1])*section.clientWidth/lay.size[0]+3:Math.max(...lay.live.map(c=>(c.rect[1]+c.rect[3])*base))+10;
 const notice=document.createElement('div');notice.className='offline-notice';notice.setAttribute('role','status');notice.textContent=[...new Set(texts)].join('；');const left=Math.min(...lay.live.map(c=>c.rect[0]*section.clientWidth));Object.assign(notice.style,{left:left+'px',top:cut+'px',width:(section.clientWidth-left-12)+'px'});section.append(notice);const extra=notice.offsetHeight+12;
 const picture=section.querySelector('picture'),tail=document.createElement('div'),copy=new Image();tail.className='offline-tail';tail.setAttribute('aria-hidden','true');Object.assign(tail.style,{top:(cut+extra)+'px',height:(base-cut)+'px'});copy.src=picture.querySelector('img').currentSrc;Object.assign(copy.style,{width:section.clientWidth+'px',top:-cut+'px'});tail.append(copy);section.append(tail);
 const children=[...section.querySelector('.overlays').children];section._offlineStyles=children.map(e=>[e,e.style.cssText]);const boxes=children.map(e=>({e,x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight}));section.style.height=(base+extra)+'px';section.style.aspectRatio='auto';picture.style.clipPath=`inset(0 0 ${Math.max(0,base-cut)}px 0)`;section.classList.add('offline-expanded');for(const b of boxes)Object.assign(b.e.style,{left:b.x+'px',top:(b.y+(b.y>=cut?extra:0))+'px',width:b.w+'px',height:b.h+'px'});
}
function display(){
 resetOfflineLayout();
 for(const strip of document.querySelectorAll('.live-strip')){
  const cells=[...strip.querySelectorAll('[data-slot]')],results=cells.map(cell=>phase==='ready'?parse(last,cell.dataset.slot,page.project):unknown);
  const readable=results.length>0&&results.every(result=>result.state!=='unknown');strip.hidden=!readable;
  cells.forEach((cell,i)=>{const result=results[i],prefix=page.status_binding?.prefixes?.[cell.dataset.slot],text=readable?(prefix?prefix+'：':'')+result.text:'';cell.querySelector('span').textContent=text;cell.title=text;cell.dataset.state=readable?result.state:'unknown';cell.dataset.cached='false';
   if(readable&&result.href){cell.href=result.href;cell.setAttribute('role','link');cell.target='_blank';cell.rel='noopener';}else{cell.removeAttribute('href');cell.setAttribute('role','status');}
  });
 }
 displayTypesetStatus(last,phase,parse,page);
 document.body.dataset.statusPhase=phase;
 const snap={phase,at:performance.now(),elapsedMs:started?performance.now()-started:0,slots:[...document.querySelectorAll('[data-slot]')].map(c=>({slot:c.dataset.slot,text:c.textContent.trim(),cached:false}))};history.push(snap);if(history.length>20)history.shift();
}
async function refresh(){
 if(busy||document.hidden||!document.querySelector('[data-slot]'))return;
 busy=true;phase='loading';offline=false;cancelledForVisibility=false;started=performance.now();display();controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
 try{
  const local=['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname);
  const response=await fetch(local?'/__status':'https://mcp.wly0829.cn/computer-access/api/status',{credentials:'include',cache:'no-store',signal:controller.signal});if(!response.ok)throw Error('HTTP_'+response.status);
  last=await response.json();phase='ready';document.body.dataset.statusError='';
  for(const cell of document.querySelectorAll('[data-slot]')){const slot=cell.dataset.slot,result=parse(last,slot,page.project);if(result.state!=='unknown')try{localStorage.setItem(cacheKey(page.page,slot),JSON.stringify({project:page.project,result,at:Date.now()}));}catch{}}
 }catch(e){last=null;phase=cancelledForVisibility?'loading':'error';offline=!cancelledForVisibility&&(e.name==='AbortError'||e.name==='TypeError'||/^HTTP_5/.test(e.message||''));document.body.dataset.statusError=e.name==='AbortError'?'timeout':e.message;}
 finally{clearTimeout(timer);busy=false;display();}
}
document.addEventListener('site-layout',()=>{display();if(!last&&!busy)refresh();});addEventListener('resize',display);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelledForVisibility=true;controller?.abort();}else refresh();});display();refresh();setInterval(refresh,60000);
window.SiteStatus={parse,refresh,history,resetLayout:resetOfflineLayout};
})();

;
/* 水彩流动、回顶与两个小彩蛋；不改变生成图里的正文与数字。 */
(()=>{'use strict';
 const data=JSON.parse(document.querySelector('#page-data').textContent),ambient=document.querySelector('.ambient-motion');
 let enabled=false;
 const canMove=()=>!document.body.classList.contains('motion-off')&&!document.hidden;
 function setup(){ambient.querySelectorAll('.watercolour-wash,.falling-leaf').forEach(e=>e.remove());if(document.body.classList.contains('motion-off'))return;for(let i=0;i<3;i++){const wash=document.createElement('i');wash.className='watercolour-wash';wash.style.setProperty('--wash-index',i);ambient.append(wash);}const paper=document.querySelector('.paper').getBoundingClientRect(),gap=Math.max(0,paper.left),n=innerWidth<600?3:6;for(let i=0;i<n;i++){if(!data.shared.leaves.length)break;const leaf=new Image();leaf.decoding='async';leaf.fetchPriority='low';leaf.src=data.shared.leaves[i%data.shared.leaves.length];leaf.alt='';leaf.className='falling-leaf';const side=i%2,position=gap>45?(side?innerWidth-gap*(.25+(i%3)*.24):gap*(.18+(i%3)*.24)):innerWidth*(.12+i*.29);leaf.style.left=position+'px';leaf.style.setProperty('--fall-time',(15+i*2)+'s');leaf.style.setProperty('--fall-delay',(-i*3-2)+'s');leaf.style.setProperty('--leaf-size',(innerWidth<600?28:40+i%3*7)+'px');leaf.style.setProperty('--drift',(i%2?35:-30)+'px');ambient.append(leaf);}}
 function updateMotion(){enabled=canMove();if(enabled&&!ambient.querySelector('.watercolour-wash'))setup();ambient.classList.toggle('is-paused',!enabled);}
 document.addEventListener('site-motion',updateMotion);addEventListener('resize',()=>{setup();updateMotion();});setup();updateMotion();
 const top=document.querySelector('.back-to-top'),bird=document.querySelector('.easter-bird'),footer=document.querySelector('footer'),bubble=document.querySelector('.footer-bubble');
 if(data.shared.art?.back_to_top){top.replaceChildren();const im=new Image();im.src=data.shared.art.back_to_top;im.alt='';top.append(im);}
 if(data.shared.art?.easter_bird){const im=new Image();im.src=data.shared.art.easter_bird;im.alt='';bird.append(im);}
 let returning=false,flightTimer=0,bubbleTimer=0;
 function hideBird(){clearTimeout(flightTimer);bird.hidden=true;bird.classList.remove('flying');}
 function showBird(){
  if(!canMove()||!data.shared.art?.easter_bird)return;
  const screen=document.querySelector('.screen'),r=screen.getBoundingClientRect(),first=data.screens.find(s=>s.layouts?.[screen.dataset.layout]||s.layouts?.h),lay=first?.layouts?.[screen.dataset.layout]||first?.layouts?.h,title=lay?.title_rect;
  const w=innerWidth<600?100:150,x=title?r.left+(title[0]+title[2])*r.width+10:r.left+r.width*.35,y=title?r.top+title[1]*r.height:r.top+18;
  bird.style.width=w+'px';bird.style.left=Math.max(8,Math.min(innerWidth-w-8,x))+'px';bird.style.top=Math.max(65,y)+'px';bird.hidden=false;bird.classList.remove('flying');requestAnimationFrame(()=>bird.classList.add('flying'));clearTimeout(flightTimer);flightTimer=setTimeout(hideBird,2300);
 }
 function updateTop(){top.hidden=scrollY<innerHeight*.65||footer.getBoundingClientRect().top<innerHeight;if(returning&&scrollY<=2){returning=false;showBird();}}
 top.onclick=()=>{returning=true;scrollTo({top:0,behavior:canMove()?'smooth':'instant'});requestAnimationFrame(updateTop);};
 addEventListener('scroll',updateTop,{passive:true});addEventListener('resize',updateTop);updateTop();
 const signature=document.querySelector('.footer-signature-trigger');signature.onclick=async()=>{
  const done=document.querySelector('.scenery-done'),landscape=document.querySelector('.footer-landscape');
  if(done){if(!canMove())return;try{await done.decode();}catch{return;}if(!canMove())return;landscape.classList.add('is-celebrating');clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>landscape.classList.remove('is-celebrating'),1800);return;}
  const box=data.shared.art?.footer_bubble,im=document.querySelector('.scenery-subject');if(!canMove()||!box||!im||!bubble)return;
  const host=bubble.parentElement.getBoundingClientRect(),r=im.getBoundingClientRect();Object.assign(bubble.style,{left:r.left-host.left+r.width*box[0]+'px',top:r.top-host.top+r.height*box[1]+'px',width:r.width*box[2]+'px',height:r.height*box[3]+'px'});
  bubble.hidden=false;let font=Math.max(6,r.height*box[3]*.65);bubble.style.fontSize=font+'px';while(bubble.scrollWidth>bubble.clientWidth+1&&font>5){font*=.94;bubble.style.fontSize=font+'px';}clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>bubble.hidden=true,1800);
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
on.numbers=!matchMedia('(prefers-reduced-motion:reduce)').matches;
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
 if(on.cards&&!(s.classList.contains('shape-card')||s.dataset.shape==='card'))(l.cards||[]).forEach((r,i)=>{if([...(l.interactive_cards||[]),...(l.card_text_only||[])].some(c=>{const q=c.rect,ix=Math.max(0,Math.min(r[0]+r[2],q[0]+q[2])-Math.max(r[0],q[0])),iy=Math.max(0,Math.min(r[1]+r[3],q[1]+q[3])-Math.max(r[1],q[1]));return ix*iy>Math.min(r[2]*r[3],q[2]*q[3])*.7;})||!start('card:'+i,r))return;const base=make(s,'sample-card-base',r),e=make(s,'sample-card',r),im=s.querySelector('picture img');const w=s.clientWidth,h=(s._mediaHeight||s.clientHeight);e.style.animation='none';e.style.backgroundImage=`url("${im.currentSrc||im.src}")`;e.style.backgroundSize=`${w}px ${h}px`;e.style.backgroundPosition=`${-r[0]*w}px ${-r[1]*h}px`;animate(e,[{opacity:0,transform:'translateY(32px)'},{opacity:1,transform:'translateY(0)'}],{duration:900,delay:cardOrder++*120,fill:'both',easing:'ease-out'},()=>{e.remove();base.remove();});});
 if(on.numbers)(l.numbers||[]).forEach((n,i)=>{if(!start('number:'+i,n.rect))return;const e=make(s,'number-roll',n.rect),track=document.createElement('span');track.className='number-track';const steps=20,decimal=(n.numeric.split('.')[1]||'').length;for(let i=0;i<=steps;i++){const item=document.createElement('span');const value=Number((n.value*(1-(1-i/steps)**3)).toFixed(decimal));item.textContent=n.text.replace(n.numeric,i===steps?n.numeric:String(value));track.append(item);}e.append(track);let size=Math.max(14,(s._mediaHeight||s.clientHeight)*n.rect[3]*.85);e.style.fontSize=size+'px';while(track.scrollWidth>e.clientWidth&&size>10)e.style.fontSize=--size+'px';const cleanup=setTimeout(()=>e.remove(),1500);animate(track,[{transform:'translateY(0)'},{transform:`translateY(-${steps*100/(steps+1)}%)`}],{duration:1200,easing:`steps(${steps},end)`,fill:'forwards'},()=>{clearTimeout(cleanup);e.remove();});});
 if(on.seam&&!(s.classList.contains('shape-card')||s.dataset.shape==='card')&&start('seam')){s.classList.add('sample-seam');setTimeout(()=>s.classList.remove('sample-seam'),1400);}
}
function decorate(s){if(!moving()||!s._layout||s.classList.contains('offline-expanded'))return;const l=s._layout,candidates=[];
 if(on.dots)(l.dots||[]).forEach((item,i)=>{const r=Array.isArray(item)?item:item.rect;if(inView(s,r))candidates.push({...(Array.isArray(item)?{}:item),key:'dot:'+i,rect:r});});
 if(on.arrows)(l.arrows||[]).forEach((a,i)=>{if(inView(s,a.rect))candidates.push({...a,key:'arrow:'+i});});
 const active=new Set();for(const e of s.querySelectorAll('.status-pulse,.arrow-flow')){if(!candidates.some(c=>c.key===e.dataset.effectKey))e.remove();else active.add(e.dataset.effectKey);}
 for(const a of candidates){if(active.has(a.key))continue;const arrow=a.key.startsWith('arrow:'),e=make(s,arrow?'arrow-flow'+(a.direction==='v'?' vertical':''):'status-pulse',a.rect);e.dataset.effectKey=a.key;if(!arrow&&a.shape){e.dataset.markerShape=a.shape;e.style.setProperty('--marker-colour',a.colour||'#198452');}if(arrow){e.innerHTML='<i></i>';e.style.setProperty('--travel',(a.direction==='v'?(s._mediaHeight||s.clientHeight)*a.rect[3]:s.clientWidth*a.rect[2])+'px');}}
}
function refresh(){document.body.dataset.sampleDepth=on.depth&&enabled()?'on':'off';for(const s of document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part:not([hidden])')){cancel(s);if(visible.has(s)){decorate(s);enter(s);}}if(!enabled()){for(const a of animations)a.cancel();document.querySelectorAll('.sample-updated').forEach(e=>e.classList.remove('sample-updated'));}background();}
const observer=new IntersectionObserver(es=>{for(const e of es){const s=e.target;s.classList.toggle('sample-offscreen',!e.isIntersecting);if(e.isIntersecting){visible.add(s);decorate(s);enter(s);}else{visible.delete(s);cancel(s);s.getAnimations().forEach(a=>{if(animations.has(a))a.cancel();});}}},{threshold:0});document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part').forEach(s=>observer.observe(s));
let scrollPending=false;addEventListener('scroll',()=>{if(scrollPending||!moving())return;scrollPending=true;requestAnimationFrame(()=>{scrollPending=false;const mobile=innerWidth<600,limit=mobile?2:5;for(const s of visible){for(const e of s.querySelectorAll('.sample-overlay'))if(e._motionRect&&!inView(s,e._motionRect)){e.getAnimations({subtree:true}).forEach(a=>a.cancel());e.remove();}decorate(s);enter(s);const r=s.getBoundingClientRect();s.style.setProperty('--sample-y',on.depth?Math.max(-limit,Math.min(limit,(r.top-innerHeight*.45)*.014))+'px':'0px');}if(mode==='d')document.querySelector('.ambient-motion')?.style.setProperty('--background-scroll',Math.min(45,scrollY*.012)+'px');});},{passive:true});
const values=new WeakMap();new MutationObserver(()=>{for(const s of document.querySelectorAll('.slot[data-slot],.b2-slot[data-b2-slot]')){const key=s,text=(s.title||s.textContent||s.getAttribute('aria-label')||'').trim(),old=values.get(key);values.set(key,text);if(on.update&&moving()&&old&&old!==text&&s.dataset.state!=='loading'&&visible.has((s.closest('.typeset-part')||s.closest('.screen')))){s.classList.remove('sample-updated');requestAnimationFrame(()=>{if(moving())s.classList.add('sample-updated');});setTimeout(()=>s.classList.remove('sample-updated'),1800);}}}).observe(document.querySelector('.paper'),{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','data-state']});
function background(){const ambient=document.querySelector('.ambient-motion');if(!ambient||ambient.dataset.background===mode)return;ambient.dataset.background=mode;ambient.querySelectorAll('.background-effect,.sample-plant').forEach(e=>e.remove());const assets=d.shared.art?.backgrounds||{};ambient.style.backgroundImage=assets[mode]?(window.siteAssetBackground?.(assets[mode])||`url("${assets[mode]}")`):'none';for(let i=0;i<3;i++){const e=document.createElement('i');e.className='background-effect';e.style.setProperty('--i',i);ambient.append(e);}if(['c','d'].includes(mode)&&d.shared.leaves.length)for(let i=0;i<4;i++){const leaf=new Image();leaf.src=d.shared.leaves[i%d.shared.leaves.length];leaf.className='sample-plant';leaf.style.setProperty('--i',i);ambient.append(leaf);}}
document.addEventListener('site-layout',refresh);document.addEventListener('site-motion',()=>{if(!enabled())refresh();else if(document.hidden){for(const a of animations)a.pause();}else{for(const a of animations)if(a.playState==='paused')a.play();for(const s of visible){decorate(s);enter(s);}}});refresh();window.SiteSamples={options:on,refresh,counts:()=>d.motion_counts,visible:()=>visible.size};
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
document.addEventListener('click',e=>{const a=e.target.closest('a');if(a&&a.hash==='#ai-brief'&&a.pathname===location.pathname){e.preventDefault();open();}});document.addEventListener('site-layout',fallback);fallback();if(location.hash==='#ai-brief')open();window.SiteBrief={generate,open};
})();

;
/* 只播放人工标注的插画面片；字始终来自底图。下载完成前不会挂载video。 */
(()=>{'use strict';const d=JSON.parse(document.querySelector('#page-data').textContent),spec=d.video;if(!spec)return;
const query=new URLSearchParams(location.search),rm=matchMedia('(prefers-reduced-motion:reduce)'),portrait=matchMedia('(orientation:portrait)'),section=document.querySelector('.typeset-screen .typeset-part[data-orientation=h]')||document.querySelector('.screen'),hero=section?.querySelector('picture img');if(!hero)return;
let visible=false,video=null,controller=null,attempts=0,pending=false,blobUrl=null;const state={phase:'image',reason:null};window.SiteHero=state;
const allowed=()=>query.get('audit')!=='1'&&!rm.matches&&!document.hidden&&!portrait.matches&&innerWidth>=1024&&visible;
async function readyImages(){if(document.readyState!=='complete')await new Promise(r=>addEventListener('load',r,{once:true}));const images=[...document.images].filter(i=>{const b=i.getBoundingClientRect();return i.getAttribute('src')&&b.bottom>0&&b.top<innerHeight;});await Promise.all(images.map(i=>i.decode()));}
async function update(){
 if(video){const r=spec.rect;video.style.top=r[1]*(section._mediaHeight||section.clientHeight)+'px';video.style.height=r[3]*(section._mediaHeight||section.clientHeight)+'px';}
 if(!allowed()){controller?.abort();if(video){video.pause();video.hidden=true;video.classList.remove('ready');}state.phase='image';return;}
 if(video){video.hidden=false;video.play().then(()=>state.phase='playing').catch(()=>{video.hidden=true;state.phase='image';});return;}
 if(pending||attempts>=2||navigator.connection?.saveData)return;pending=true;
 try{state.phase='waiting-images';await readyImages();if(!allowed())return;attempts++;controller=new AbortController();state.phase='downloading';const timer=setTimeout(()=>controller.abort(),spec.download_timeout_ms||6000);let blob;
  try{const response=await fetch(spec.src,{signal:controller.signal,cache:'force-cache'});if(!response.ok)throw new Error('HTTP '+response.status);blob=await response.blob();}finally{clearTimeout(timer);controller=null;}
  if(blob.size>2_000_000)throw new Error('video-too-large');if(!allowed())return;
  const mask=new Image();mask.src=spec.mask;await mask.decode();if(!allowed())return;
  blobUrl=URL.createObjectURL(blob);video=document.createElement('video');video.className='hero-video';video.muted=true;video.loop=true;video.playsInline=true;video.preload='auto';video.defaultPlaybackRate=spec.playback_rate||1;video.playbackRate=spec.playback_rate||1;video.style.transitionDuration=(spec.intro_fade_seconds??.5)+'s';video.setAttribute('aria-hidden','true');const r=spec.rect;Object.assign(video.style,{left:r[0]*100+'%',top:r[1]*(section._mediaHeight||section.clientHeight)+'px',width:r[2]*100+'%',height:r[3]*(section._mediaHeight||section.clientHeight)+'px',right:'auto',bottom:'auto',maskImage:`url("${spec.mask}")`,webkitMaskImage:`url("${spec.mask}")`});video.src=blobUrl;section.insertBefore(video,section.querySelector('.overlays'));video.addEventListener('playing',()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{if(allowed()&&!video.paused){video.classList.add('ready');state.phase='playing';}}));});video.addEventListener('error',()=>{video.hidden=true;state.phase='image';state.reason='decode-error';});await video.play();
 }catch(error){state.phase='image';state.reason=error.name==='AbortError'?'slow-or-background':String(error);if(video)video.hidden=true;}finally{pending=false;}
}
new IntersectionObserver(es=>{visible=es[0].isIntersecting;update();}).observe(section);for(const event of ['visibilitychange','site-motion','site-layout'])document.addEventListener(event,update);addEventListener('resize',update);rm.addEventListener('change',update);addEventListener('pagehide',()=>{controller?.abort();if(blobUrl)URL.revokeObjectURL(blobUrl);});
})();

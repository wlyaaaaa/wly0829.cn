(() => {
 'use strict';
 document.addEventListener('load',e=>{if(e.target.matches?.('link[data-live-fonts]'))e.target.media='all';},true);
 const watched=new WeakSet(),notes=new Map();
 let firstPaint=false;
 const active=host=>{const owner=host.closest('[data-orientation]')||host;return !owner.dataset.orientation||owner.dataset.both==='true'||owner.dataset.orientation===(innerWidth<768?'v':'h');};
 const loaded=im=>im.complete&&im.naturalWidth>0;
 function hostFor(im){
  let host=im.closest('.typeset-part')||im.closest('picture')||im.parentElement;
  while(getComputedStyle(host).display==='contents')host=host.parentElement;
  return host;
 }
 function notice(host,im){
  if(!active(host)||loaded(im)){notes.get(im)?.remove();notes.delete(im);delete im._loadingWrap;im.classList.remove('image-loading-pending');im.style.removeProperty('--image-loading-height');return;}
  im.classList.add('image-loading-pending');const state=im.dataset.resourceRetryState||(im.hasAttribute('data-resource-retry-failed')?'failed':'loading');
  const width=+im.getAttribute('width'),height=+im.getAttribute('height');if(width&&height)im.style.setProperty('--image-loading-height',im.getBoundingClientRect().width*height/width+'px');
  const value=state==='again'?'还是没加载出来，可能是网络慢，过一会儿再试':state==='failed'?'这张图没加载出来':'图片加载中…';
  if(!notes.has(im)){
   const wrap=document.createElement('div'),note=document.createElement('div');wrap.className='image-loading-wrap';note.className='image-loading-note';note.setAttribute('role','status');
   note.innerHTML='<span aria-hidden="true"></span><div></div><small></small>';wrap.append(note);host.append(wrap);notes.set(im,wrap);im._loadingWrap=wrap;
  }
  const wrap=notes.get(im),note=wrap.firstChild,r=im.getBoundingClientRect(),p=host.getBoundingClientRect();
  if(getComputedStyle(host).position==='static')host.style.position='relative';
  Object.assign(wrap.style,{left:r.left-p.left+'px',top:r.top-p.top+'px',width:r.width+'px',height:r.height+'px'});
  wrap.classList.toggle('image-loading-compact',r.width<180||r.height<110);note.title=value;note.setAttribute('aria-label',value);
  note.firstChild.textContent=state==='loading'?'▧':'▧╱';note.children[1].textContent=value;
  const caption=im.alt||im.closest('figure')?.querySelector('figcaption')?.textContent.trim();note.children[2].textContent=caption?'图：'+caption:'';
 }
 function loadNear(im,r){
  const host=hostFor(im);if(!active(host)||(!im.dataset.src&&!im.dataset.srcset&&!im.closest('picture')?.querySelector('source[data-srcset]')))return;
  r||=host.getBoundingClientRect();if(!firstPaint&&r.top>=innerHeight)return;
  im.fetchPriority=r.top<innerHeight&&r.bottom>0?'high':'low';im.loading='eager';
  for(const s of im.closest('picture')?.querySelectorAll('source[data-srcset]')||[]){s.srcset=s.dataset.srcset;delete s.dataset.srcset;}
  for(const key of ['srcset','src'])if(im.dataset[key]){im[key]=im.dataset[key];delete im.dataset[key];}
  notice(host,im);
 }
 const near=new IntersectionObserver(rows=>rows.forEach(row=>{if(row.isIntersecting)loadNear(row.target,row.boundingClientRect);}),{rootMargin:Math.round(innerHeight*2)+'px 0px'});
 function scan(){
  // Read every bound before inserting notes, avoiding one layout per picture.
  const rows=[...document.querySelectorAll('img')].map(im=>{const host=hostFor(im);return {im,host,r:active(host)?im.getBoundingClientRect():null};});
  for(const {im,host,r} of rows){
   if(!watched.has(im)){watched.add(im);near.observe(im);im.addEventListener('load',()=>notice(host,im));im.addEventListener('error',()=>notice(host,im));}
   notice(host,im);if(r&&r.bottom>0&&r.top<innerHeight*3)loadNear(im,r);
  }
 }
 const style=document.createElement('style');style.textContent='img.image-loading-pending[width][height]{height:var(--image-loading-height)}img.image-loading-pending:is(:not([width]),:not([height])){aspect-ratio:16/9}img.image-loading-pending:not([width]){width:100%;height:auto}.image-loading-wrap{position:absolute;z-index:6;background:#f1f3f2;pointer-events:none;display:grid;place-items:center}.image-loading-note{box-sizing:border-box;padding:12px;color:#58645d;font:15px/1.6 system-ui;text-align:center;max-width:100%;overflow-wrap:anywhere}.image-loading-note>span{font-size:24px}.image-loading-note small{display:block;font-size:12px}.image-loading-compact .image-loading-note{padding:0}.image-loading-compact .image-loading-note>div,.image-loading-compact small{display:none}.image-loading-compact .image-loading-note>span{font-size:16px}.image-loading-note .resource-retry-button{margin-top:8px!important}';document.head.append(style);
 const ownNotice=row=>row.target.closest?.('.image-loading-wrap')||(row.type==='childList'&&[...row.addedNodes,...row.removedNodes].every(node=>node.nodeType===1&&node.classList.contains('image-loading-wrap')));
 new MutationObserver(rows=>{if(!rows.every(ownNotice))scan();}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset','data-src','data-srcset','data-resource-retry-failed','data-resource-retry-state']});addEventListener('resize',scan);document.addEventListener('site-layout',scan);document.addEventListener('load',e=>{if(e.target.tagName==='LINK')scan();},true);scan();
 // Keep the first viewport ahead of nearby prefetch until it has painted.
 requestAnimationFrame(()=>requestAnimationFrame(()=>{firstPaint=true;scan();}));
})();

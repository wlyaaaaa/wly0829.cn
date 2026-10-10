(() => {
 'use strict';
 function activateImages(){
  let anchor;try{anchor=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{}
  const requested=anchor?.closest('.ts-screen')||anchor;
  for(const im of document.querySelectorAll('img')){
   const r=im.getBoundingClientRect(),eager=r.width>0&&r.height>0&&(requested?.contains(im)||r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth);
   im.loading=eager?'eager':'lazy';if(eager)im.fetchPriority='high';
   for(const s of im.closest('picture')?.querySelectorAll('source[data-srcset]')||[]){s.srcset=s.dataset.srcset;delete s.dataset.srcset;}
   if(im.dataset.tsSrc){if(im.dataset.tsSrc.startsWith('/'))im.crossOrigin='anonymous';im.src=im.dataset.tsSrc;delete im.dataset.tsSrc;}
   for(const key of ['srcset','src'])if(im.dataset[key]){im[key]=im.dataset[key];delete im.dataset[key];}
   if(im.hasAttribute('data-resource-retry-failed')&&!im.naturalWidth)im.closest('.title-img')?.classList.add('title-image-failed');
  }
  for(const im of document.querySelectorAll('svg image[data-ts-src]')){im.setAttribute('href',im.dataset.tsSrc);delete im.dataset.tsSrc;}
 }
 document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement)e.target.closest('.title-img')?.classList.add('title-image-failed');},true);
 document.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement)e.target.closest('.title-img')?.classList.remove('title-image-failed');if(e.target.matches?.('link[data-live-fonts]'))e.target.media='all';},true);
 const style=document.createElement('style');style.textContent='.title-img.title-image-failed img{opacity:0}.title-img.title-image-failed .ghost{color:var(--title,#0a7232);font-family:"Brush",serif;font-size:var(--fs-name,30px)}.title-img.title-image-failed.al-center{text-align:center}';document.head.append(style);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',activateImages,{once:true});else activateImages();
})();

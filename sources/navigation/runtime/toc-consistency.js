/* Preserve drawn labels; normalize each bitmap using its measured ink rectangle. */
(()=>{
 const nav=document.querySelector('.toc[data-toc-consistency]'),data=document.getElementById('toc-label-data');if(!nav||!data)return;
 const images=JSON.parse(data.textContent);
 function labels(){
  for(const link of nav.querySelectorAll('a[data-section]')){
   const label=(innerWidth<768?link.dataset.labelV:link.dataset.labelH)||link.dataset.labelH,item=images[label];if(!item)continue;
   if(link.firstElementChild?.dataset.uniformLabel===label)continue;
   const span=document.createElement('span'),picture=document.createElement('picture'),im=new Image(),[w,h]=item.size,scale=18/(h*(item.ink_bottom-item.ink_top));span.className='nav-label';span.dataset.indicator='image-label';span.dataset.labelText=label;span.dataset.labelReady='true';span.dataset.uniformLabel=label;
   span.style.setProperty('--toc-label-width',w*scale*(item.ink_right-item.ink_left)+'px');span.style.setProperty('--toc-bitmap-height',h*scale+'px');span.style.setProperty('--toc-bitmap-left',-w*scale*item.ink_left+'px');span.style.setProperty('--toc-bitmap-top',-h*scale*item.ink_top+'px');picture.className='asset-picture';im.className='image-label';im.alt=label;im.src=item.src;picture.append(im);span.append(picture);link.replaceChildren(span);link.dataset.renderedLabel=label;
  }
  window.SiteToc?.update();
 }
 labels();document.addEventListener('site-layout',labels);addEventListener('pageshow',labels);addEventListener('resize',labels);
})();

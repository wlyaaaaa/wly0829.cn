/* Preserve drawn labels; normalize each bitmap using its measured ink rectangle. */
(()=>{
 const nav=document.querySelector('.toc[data-toc-consistency]');if(!nav)return;
 // 没有标签图数据（或某一项没有图）时不退出：保留文字标签，宽度按文字算，不能留下宽 0 的空图
 let images={};try{const data=document.getElementById('toc-label-data');images=data?JSON.parse(data.textContent)||{}:{};}catch{images={};}
 function text(link,label){const span=document.createElement('span');span.className='nav-label';span.dataset.labelText=label;span.textContent=label;link.replaceChildren(span);link.dataset.renderedLabel=label;link.dataset.labelFallback='text';}
 function labels(){
  for(const link of nav.querySelectorAll('a[data-section]')){
   const label=(innerWidth<768?link.dataset.labelV:link.dataset.labelH)||link.dataset.labelH,item=images[label];if(!item){if(label&&!link.textContent.trim())text(link,label);continue;}
   if(link.firstElementChild?.dataset.uniformLabel===label)continue;
   const span=document.createElement('span'),picture=document.createElement('picture'),im=new Image(),[w,h]=item.size,scale=18/(h*(item.ink_bottom-item.ink_top));span.className='nav-label';span.dataset.indicator='image-label';span.dataset.labelText=label;span.dataset.labelReady='true';span.dataset.uniformLabel=label;
   span.style.setProperty('--toc-label-width',w*scale*(item.ink_right-item.ink_left)+'px');span.style.setProperty('--toc-bitmap-height',h*scale+'px');span.style.setProperty('--toc-bitmap-left',-w*scale*item.ink_left+'px');span.style.setProperty('--toc-bitmap-top',-h*scale*item.ink_top+'px');picture.className='asset-picture';im.className='image-label';im.alt=label;im.src=item.src;picture.append(im);span.append(picture);link.replaceChildren(span);link.dataset.renderedLabel=label;
  }
  window.SiteToc?.update();
 }
 labels();document.addEventListener('site-layout',labels);addEventListener('pageshow',labels);addEventListener('resize',labels);
 // 站点脚本之后才把文字换成标签图时也要补回文字；只在出现空标签时改动，不会自我循环
 new MutationObserver(()=>{if([...nav.querySelectorAll('a[data-section]')].some(a=>!a.textContent.trim()&&!images[(innerWidth<768?a.dataset.labelV:a.dataset.labelH)||a.dataset.labelH]))labels();}).observe(nav,{childList:true,subtree:true});
})();

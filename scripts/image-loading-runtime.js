(() => {
 'use strict';
 const main=document.querySelector('main');if(!main)return;
 for(const link of document.querySelectorAll('link[data-live-fonts]')){const apply=()=>link.media='all';if(link.sheet)apply();else link.addEventListener('load',apply,{once:true});}
 const watched=new WeakSet(),notes=new Map();
 const active=host=>!host.dataset.orientation||host.dataset.both==='true'||host.dataset.orientation===(innerWidth<768?'v':'h');
 const loaded=im=>im.complete&&im.naturalWidth>0;
 function notice(host,im){
  if(!active(host)||loaded(im)){notes.get(host)?.remove();notes.delete(host);return;}
  const screen=host.closest('.screen'),text=document.getElementById(screen.id+'-equivalent-text');
  const mode=host.dataset.orientation?(innerWidth<768?'v':'h'):(matchMedia('(orientation:portrait)').matches?'v':'h');
  const body=text?.querySelector('[data-transcript-orientation="'+mode+'"]')||text?.querySelector('[data-transcript-orientation]')||text;
  const value='图片正在加载，先读本段说明。\n\n'+(body?.textContent.trim()||im.alt||'本段图片正在传输；稍后会在原位置显示。');
  if(notes.has(host)){const note=notes.get(host).firstChild;if(note.textContent!==value)note.textContent=value;return;}
  const wrap=document.createElement('div'),note=document.createElement('div');wrap.className='image-loading-wrap';wrap.setAttribute('aria-hidden','true');note.className='image-loading-note';
  note.textContent=value;wrap.append(note);host.append(wrap);notes.set(host,wrap);
 }
 function loadNear(im){
  const host=im.closest('.typeset-part')||im.closest('.screen');if(!active(host))return;
  im.fetchPriority=host.getBoundingClientRect().top<innerHeight?'high':'low';im.loading='eager';
  for(const s of im.closest('picture').querySelectorAll('source[data-srcset]')){s.srcset=s.dataset.srcset;delete s.dataset.srcset;}
  for(const key of ['srcset','src'])if(im.dataset[key]){im[key]=im.dataset[key];delete im.dataset[key];}
  notice(host,im);
 }
 const near=new IntersectionObserver(rows=>rows.forEach(row=>{if(row.isIntersecting){const im=row.target.querySelector('picture img');if(im)loadNear(im);}}),{rootMargin:Math.round(innerHeight*2)+'px 0px'});
 function scan(){
  for(const im of document.querySelectorAll('.screen picture img')){
   const host=im.closest('.typeset-part')||im.closest('.screen');
   if(!watched.has(im)){watched.add(im);near.observe(host);im.addEventListener('load',()=>notice(host,im));im.addEventListener('error',()=>notice(host,im));}
   if(active(host)){notice(host,im);const r=host.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight*3)loadNear(im);}
  }
 }
 const style=document.createElement('style');style.textContent='.image-loading-wrap{position:absolute;inset:0;z-index:4;pointer-events:none}.image-loading-note{position:sticky;top:calc(var(--anchor-offset,90px) + 8px);margin:12px;padding:18px;background:#fff;border:1px solid #d4ddd7;border-radius:10px;color:#284b3b;font:16px/1.7 system-ui;white-space:pre-line;max-height:calc(100vh - 160px);overflow:auto;pointer-events:auto}';document.head.append(style);
 new MutationObserver(scan).observe(main,{childList:true,subtree:true});addEventListener('resize',scan);document.addEventListener('site-layout',scan);scan();
})();

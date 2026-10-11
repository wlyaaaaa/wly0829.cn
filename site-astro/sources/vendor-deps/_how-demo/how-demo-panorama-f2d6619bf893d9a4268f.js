/* Direct panorama neighbours come from the frozen how source registry. */
(()=>{'use strict';
const section=document.getElementById('how-02'),source=document.querySelector('[data-how-panorama-data]');
if(!section||!source||section.dataset.panoramaInitialized)return;
section.dataset.panoramaInitialized='true';
const data=JSON.parse(source.textContent),ids=new Set(data.nodes.map(n=>n.id));
const binding=new Map(data.hotspots.map(h=>[h.hot_id,h.node]));
const neighbours=new Map([...ids].map(id=>[id,new Set([id])]));
for(const [from,to] of data.relations){neighbours.get(from).add(to);neighbours.get(to).add(from);}
const hover=matchMedia('(hover:hover)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
let selected=null,timer=0,nodes=[],visuals=[],pointerType='';
function paint(){
 const adjacent=neighbours.get(selected);
 for(const node of nodes)node.classList.toggle('how-panorama-dim',!!selected&&!adjacent?.has(node.dataset.panoramaNode));
 for(const node of visuals){
  const related=!!adjacent?.has(node.dataset.panoramaNode);
  node.classList.toggle('how-panorama-dim',!!selected&&!related);
  node.classList.toggle('how-panorama-related',!!selected&&related);
  node.classList.toggle('how-panorama-current',selected===node.dataset.panoramaNode);
 }
 section.dataset.panoramaFocus=selected||'';
 section.dataset.panoramaRelated=adjacent?[...adjacent].filter(id=>visuals.some(n=>n.dataset.panoramaNode===id)).sort().join(' '):'';
 section.dataset.panoramaReduced=String(reduce.matches);
}
function focus(id){clearTimeout(timer);selected=ids.has(id)?id:null;paint();}
function refresh(){
 nodes=[...section.querySelectorAll('a[data-hot-id]')].filter(node=>binding.has(node.dataset.hotId));
 for(const node of nodes){node.dataset.panoramaNode=binding.get(node.dataset.hotId);node.classList.add('how-panorama-node');}
 for(const host of section.querySelectorAll('.typeset-part:not([hidden])')){
  const overlay=host.querySelector('.overlays');if(!overlay||!host._layout)continue;
  for(const item of data.visuals.filter(v=>v.part===host._layout.image)){
   if(overlay.querySelector('.how-panorama-visual[data-panorama-node="'+CSS.escape(item.node)+'"]'))continue;
   const visual=document.createElement('span');visual.className='how-panorama-visual';visual.dataset.panoramaNode=item.node;visual.setAttribute('aria-hidden','true');
   const [x,y,w,h]=item.rect;Object.assign(visual.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'});overlay.append(visual);
  }
 }
 visuals=[...section.querySelectorAll('.typeset-part:not([hidden]) .how-panorama-visual')];
 section.dataset.panoramaReady=String(new Set(visuals.map(n=>n.dataset.panoramaNode)).size===ids.size);
 paint();
}
const nodeFor=target=>target?.closest?.('.how-panorama-node');
section.addEventListener('pointerdown',event=>{pointerType=event.pointerType;});
section.addEventListener('pointerover',event=>{const node=nodeFor(event.target);if(node&&event.pointerType==='mouse'&&hover.matches)focus(node.dataset.panoramaNode);});
section.addEventListener('pointerout',event=>{if(event.pointerType==='mouse'&&hover.matches&&nodeFor(event.target)&&!nodeFor(event.relatedTarget))focus(null);});
section.addEventListener('focusin',event=>{const node=nodeFor(event.target);if(node&&(node.matches(':focus-visible')||!(pointerType==='touch'||!hover.matches)))focus(node.dataset.panoramaNode);});
section.addEventListener('focusout',event=>{if(nodeFor(event.target)&&!nodeFor(event.relatedTarget))focus(null);});
section.addEventListener('click',event=>{
 const node=nodeFor(event.target);
 if(node&&(pointerType==='touch'||!hover.matches)&&event.detail!==0){
  if(selected!==node.dataset.panoramaNode){event.preventDefault();focus(node.dataset.panoramaNode);}
 }else if(!node)focus(null);
});
section.addEventListener('keydown',event=>{if(event.key==='Escape')focus(null);});
function hashFocus(){
 const id=decodeURIComponent(location.hash.slice(1));
 if(!ids.has(id))return;
 focus(id);section.scrollIntoView({block:'start',behavior:'auto'});timer=setTimeout(()=>focus(null),6000);
}
new MutationObserver(refresh).observe(section,{childList:true,subtree:true});
reduce.addEventListener('change',paint);addEventListener('hashchange',hashFocus);
refresh();hashFocus();
})();

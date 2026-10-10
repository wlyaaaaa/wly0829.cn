document.addEventListener('click', event => {
 const button=event.target.closest?.('button.typeset-screenshot');
 if(!button||button.dataset.compare==='true'||!window.SiteImageViewer)return;
 const data=JSON.parse(document.querySelector('#page-data').textContent);
 const shots=data.screens.flatMap(s=>s.parts.flatMap(p=>p.hotspots.filter(h=>h.kind==='screenshot').flatMap(h=>h.shots||[])));
 const chosen=new URL(button.querySelector('img')?.getAttribute('src'),location.href);
 chosen.searchParams.delete('__wly_resource_retry');
 const selected=shots.find(s=>new URL(s.src,location.href).href===chosen.href);
 const items=[...new Map(shots.map(s=>[s.full||s.src,s])).values()];
 if(!selected||items.length<2)return;
 event.preventDefault();event.stopImmediatePropagation();
 window.SiteImageViewer.openGallery(items.map(s=>({src:new URL(s.full||s.src,location.href).href,title:s.caption})),items.findIndex(s=>(s.full||s.src)===(selected.full||selected.src)),button);
},true);
function displayTypesetStatus(payload,phase,parse,data){
 for(const el of document.querySelectorAll('.typeset-live')){
  const result=parse(payload,el.dataset.slot,data.project);
  const slot=el.dataset.slot,part=el.closest('.typeset-part');
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

function displayTypesetStatus(payload,phase,parse,data){
 for(const el of document.querySelectorAll('.typeset-live')){
  const result=parse(payload,el.dataset.slot,data.project);
  const prefix=data.status_binding?.prefixes?.[el.dataset.slot];
  const value=(prefix?prefix+'：':'')+(result.text||'暂时读不到');
  el.querySelector('span').textContent=value;el.title=value;el.dataset.state=result.state||'unknown';el.dataset.cached=String(!!result.cached);
  if(result.href){el.href=result.href;el.target='_blank';el.rel='noopener';}else el.removeAttribute('href');
  const part=el.closest('.typeset-part'),preferred=Math.max(12,Math.min(22,part.clientWidth/part._layout.size[0]*26));
  const span=el.querySelector('span');span.style.whiteSpace='normal';el.style.lineHeight='1.15';el.style.overflow='visible';el.style.fontSize=preferred+'px';
  let font=preferred;
  const overflows=()=>{const box=el.getBoundingClientRect(),text=span.getBoundingClientRect();return text.width>el.clientWidth-10||text.height>el.clientHeight-8||text.top<box.top+2||text.bottom>box.bottom-2||text.right>box.right-2||text.left<box.left+2;};
  while(font>8&&overflows()){font=Math.max(8,font*.94);el.style.fontSize=font+'px';}
 }
}

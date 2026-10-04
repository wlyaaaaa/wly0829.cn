/* Public static resource recovery. No status/API reads, storage or polling. */
(() => {
'use strict';
const policy=__RESOURCE_RETRY_POLICY__;
const delay=1000,key='__wly_resource_retry',pageToken=Math.random().toString(36).slice(2);
const imageState=new WeakMap(),scriptState=new WeakMap(),stylesheetState=new WeakMap(),dynamicScripts=new WeakSet(),buttons=new Set();
const base=location.href,publicOrigins=new Set([location.origin,...policy.origins]);
const canonical=value=>{try{const u=new URL(value,base);u.searchParams.delete(key);return u.href;}catch{return '';}};
const dataURLs=new Set(policy.data.map(canonical)),scriptURLs=new Set(policy.scripts.map(canonical));
const stylesheetURLs=new Set((policy.stylesheets||[]).map(canonical));
const forbidden=u=>!/^(https?:)$/.test(u.protocol)||/\/(?:api|authorize|authorization)(?:\/|$)|\/__status(?:\/|$)/i.test(u.pathname);
function imageAllowed(value){try{const u=new URL(value,base);return !forbidden(u)&&publicOrigins.has(u.origin)&&/\.(?:avif|webp|png|jpe?g|gif|svg|ico)$/i.test(u.pathname);}catch{return false;}}
function retryURL(value,attempt){const u=new URL(canonical(value));u.searchParams.set(key,pageToken+'-'+attempt);return u.href;}
function record(kind,state,url,attempt){document.dispatchEvent(new CustomEvent('resource-retry',{detail:{kind,state,url:canonical(url),attempt,at:performance.now()}}));}
function selected(image){return image.currentSrc||image.src||'';}
function hideButton(state){if(state.button){state.button.remove();buttons.delete(state.button);state.button=null;}}
function retryImage(image,state,manual=false){
 clearTimeout(state.timer);state.timer=null;
 if(!image.isConnected||canonical(selected(image))!==state.url){hideButton(state);return;}
 const fresh=retryURL(state.url,manual?'manual-'+(++state.manual):'auto');
 state.waiting=false;state.reloading=true;hideButton(state);record('image',manual?'manual':'retry',state.url,manual?state.manual:1);
 const replaceSet=value=>value.split(',').map(part=>{const fields=part.trim().split(/\s+/);if(canonical(fields[0])===state.url)fields[0]=fresh;return fields.join(' ');}).join(', ');
 for(const source of image.closest('picture')?.querySelectorAll('source[srcset]')||[])source.srcset=replaceSet(source.srcset);
 if(image.srcset)image.srcset=replaceSet(image.srcset);
 // Keep the chosen density/source and crossorigin. A new query avoids a cached
 // broken Image response without substituting a lower resolution rendition.
 if(canonical(image.src)===state.url||!image.closest('picture'))image.src=fresh;
}
function placeButton(button){
 const image=button._image,r=image.getBoundingClientRect();
 if(r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth){button.hidden=true;return;}
 button.hidden=false;const w=button.offsetWidth||92,h=button.offsetHeight||32;
 const blockers=[...document.querySelectorAll('a,button,input,select,textarea,[role="button"]')].filter(e=>!e.classList.contains('resource-retry-button')).map(e=>e.getBoundingClientRect()).filter(q=>q.width&&q.height&&q.bottom>0&&q.top<innerHeight);
 const candidates=[[Math.min(innerWidth-w-8,r.right-w),Math.max(8,Math.min(innerHeight-h-8,r.bottom-h))],[8,innerHeight-h-8],[innerWidth-w-8,innerHeight-h-8]];
 for(let y=8;y<innerHeight-h;y+=Math.max(h+8,48))for(let x=8;x<innerWidth-w;x+=Math.max(w+8,100))candidates.push([x,y]);
 const available=candidates.find(([x,y])=>x>=0&&y>=0&&x+w<=innerWidth&&y+h<=innerHeight&&!blockers.some(q=>x<q.right&&x+w>q.left&&y<q.bottom&&y+h>q.top));
 if(available){Object.assign(button.style,{position:'fixed',left:available[0]+'px',top:available[1]+'px'});button.hidden=false;}
 else{
  // A page covered entirely by original controls keeps their hit areas. The
  // recovery button then remains in its own final document row.
  Object.assign(button.style,{position:'relative',left:'',top:''});
 }
}
function showButton(image,state){
 if(!image.isConnected||state.button)return;
 const button=document.createElement('button');button.type='button';button.className='resource-retry-button';button.textContent='重新加载';button.setAttribute('aria-label','重新加载图片'+(image.alt?'：'+image.alt:''));
 Object.assign(button.style,{zIndex:'2147483000',boxSizing:'border-box',margin:'0',padding:'5px 10px',fontFamily:'inherit',fontSize:'14px',lineHeight:'20px',color:'#065c34',background:'#fff',border:'1px solid #8bc6aa',borderRadius:'6px',cursor:'pointer',pointerEvents:'auto',width:'auto',height:'auto'});
 button._image=image;state.button=button;buttons.add(button);document.body.append(button);placeButton(button);
 button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();retryImage(image,state,true);});
}
document.addEventListener('error',event=>{
 const image=event.target;
 if(!(image instanceof HTMLImageElement)||!imageAllowed(selected(image)))return;
 const url=canonical(selected(image));let state=imageState.get(image);
 if(!state||state.url!==url){clearTimeout(state?.timer);hideButton(state||{});state={url,auto:0,manual:0,waiting:false,timer:null,button:null};imageState.set(image,state);}
 if(!state.auto){state.auto=1;state.waiting=true;record('image','waiting',url,0);state.timer=setTimeout(()=>{state.timer=null;if(state.waiting)retryImage(image,state);},delay);}
 else{state.reloading=false;record('image','failed',url,1);showButton(image,state);}
},true);
document.addEventListener('load',event=>{const image=event.target;if(image instanceof HTMLImageElement){const state=imageState.get(image);if(state){clearTimeout(state.timer);state.timer=null;hideButton(state);state.waiting=false;state.reloading=false;if(canonical(selected(image))===state.url)record('image','loaded',state.url,state.auto);}}},true);
for(const event of ['scroll','resize'])addEventListener(event,()=>{for(const button of buttons)placeButton(button);},{passive:true});

function stylesheetAllowed(link){return link instanceof HTMLLinkElement&&link.rel.toLowerCase().split(/\s+/).includes('stylesheet')&&link.href&&stylesheetURLs.has(canonical(link.href))&&!forbidden(new URL(link.href,base));}
function recoverStylesheet(link){
 if(!stylesheetAllowed(link))return;
 const url=canonical(link.href);let state=stylesheetState.get(link);
 if(state&&state.url===url){if(state.attempted){record('stylesheet','failed',url,1);}return;}
 clearTimeout(state?.timer);state={url,waiting:true,attempted:false,timer:null};stylesheetState.set(link,state);
 link.removeAttribute('data-resource-retry-failed');record('stylesheet','waiting',url,0);
 state.timer=setTimeout(()=>{state.timer=null;
  if(!state.waiting||!link.isConnected||!stylesheetAllowed(link)||canonical(link.href)!==state.url)return;
  state.waiting=false;state.attempted=true;record('stylesheet','retry',url,1);
  // The same LINK preserves cascade order, attributes and original handlers.
  link.href=retryURL(state.url,'stylesheet');
 },delay);
}
document.addEventListener('error',event=>{if(event.isTrusted&&event.target instanceof HTMLLinkElement)recoverStylesheet(event.target);},true);
document.addEventListener('load',event=>{const link=event.target,state=stylesheetState.get(link);if(event.isTrusted&&state){clearTimeout(state.timer);state.timer=null;state.waiting=false;link.removeAttribute('data-resource-retry-failed');if(canonical(link.href)===state.url)record('stylesheet','loaded',state.url,state.attempted?1:0);}},true);
for(const link of document.querySelectorAll('link[data-resource-retry-stylesheet][data-resource-retry-failed="1"]'))recoverStylesheet(link);

// Initial entries require a captured real element load error. Dynamic entries
// keep their existing failure/handler semantics; execution errors are not loads.
const create=Document.prototype.createElement;
Document.prototype.createElement=function(name,...args){const element=create.call(this,name,...args);if(this===document&&String(name).toLowerCase()==='script')dynamicScripts.add(element);return element;};
function recoverScript(script,initial=false){
 if(!(script instanceof HTMLScriptElement)||!script.src||!scriptURLs.has(canonical(script.src))||forbidden(new URL(script.src,base)))return;
 let state=scriptState.get(script);
 if(state)return;
 script.removeAttribute('data-resource-retry-failed');
 state={relay:false,original:script,url:canonical(script.src),initial,timer:null};scriptState.set(script,state);record('script','waiting',script.src,0);
 state.timer=setTimeout(()=>{
  state.timer=null;
  if(!script.isConnected||canonical(script.src)!==state.url)return;
  const retry=document.createElement('script');
  for(const attribute of script.attributes)if(!['src','onload','onerror'].includes(attribute.name))retry.setAttribute(attribute.name,attribute.value);
  retry.async=script.async;if(script.nonce)retry.nonce=script.nonce;
  retry.src=retryURL(script.src,'script');scriptState.set(retry,state);record('script','retry',script.src,1);
  const finish=kind=>{state.relay=true;record('script',kind==='load'?'loaded':'failed',script.src,1);script.dispatchEvent(new Event(kind));retry.remove();};
  retry.addEventListener('load',()=>finish('load'),{once:true});
  retry.addEventListener('error',()=>finish('error'),{once:true});
  script.after(retry);
 },delay);
}
document.addEventListener('error',event=>{
 const script=event.target;
 if(!(script instanceof HTMLScriptElement)||!script.src||!scriptURLs.has(canonical(script.src)))return;
 const initial=script.hasAttribute('data-resource-retry-initial')&&script.getAttribute('data-resource-retry-failed')==='1';
 if(!initial&&!dynamicScripts.has(script))return;
 const state=scriptState.get(script);if(state?.relay)return;
 if(dynamicScripts.has(script)&&(!state||script===state.original))event.stopImmediatePropagation();
 recoverScript(script,initial);
},true);
document.addEventListener('load',event=>{const script=event.target,state=scriptState.get(script);if(event.isTrusted&&state?.initial&&script===state.original&&!state.relay){clearTimeout(state.timer);state.timer=null;state.relay=true;record('script','loaded',script.src,0);}},true);
for(const script of document.querySelectorAll('script[data-resource-retry-initial][data-resource-retry-failed="1"]'))recoverScript(script,true);

const nativeFetch=window.fetch;
window.fetch=async function(input,options){
 const value=input instanceof Request?input.url:String(input),method=String(options?.method||(input instanceof Request?input.method:'GET')).toUpperCase();
 let allowed=false;try{allowed=method==='GET'&&dataURLs.has(canonical(value))&&!forbidden(new URL(value,base));}catch{}
 if(!allowed)return nativeFetch.call(this,input,options);
 const signal=options?.signal||(input instanceof Request?input.signal:null);
 let first,failure;
 try{first=await nativeFetch.call(this,input,options);if(first.ok)return first;}catch(error){failure=error;}
 if(signal?.aborted){if(failure)throw failure;return first;}
 record('data','waiting',value,0);await new Promise(resolve=>setTimeout(resolve,delay));
 if(signal?.aborted)throw signal.reason||new DOMException('Aborted','AbortError');
 record('data','retry',value,1);
 // Fetches do not use the document module map. Preserve the reader's options,
 // actual Response and body; no retry is applied to real status/API requests.
 try{const response=await nativeFetch.call(this,input,{...options,cache:'reload'});record('data',response.ok?'loaded':'failed',value,1);return response;}
 catch(error){record('data','failed',value,1);throw error;}
};
})();

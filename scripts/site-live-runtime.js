(function(){'use strict';
const unknown={text:'暂时读不到',state:'unknown'};
const readTimeoutMs=8000;
async function retryStatus(read,signal){
 for(let attempt=0;;attempt++)try{return await read();}catch(error){
  if(attempt===2||signal?.aborted||error.httpStatus>=400&&error.httpStatus<500||/^HTTP_4/.test(error.message||''))throw error;
  await new Promise((resolve,reject)=>{const abort=()=>{clearTimeout(timer);reject(error);};const timer=setTimeout(()=>{signal?.removeEventListener('abort',abort);resolve();},500*(attempt+1));signal?.addEventListener('abort',abort,{once:true});});
 }
}
function freshStatus(data,now=Date.now()){
 const maxAge=(Number(data?.max_age_seconds)||120)*1000,fresh=t=>Number.isFinite(t)&&t>0&&t*1000<=now+60000&&now-t*1000<=maxAge;
 if(!fresh(data?.served_at_unix??data?.observed_at_unix))return false;
 const sources=Object.values(data?.display_cache?.collectors||{});
 const screen=data?.host?.screen_state?.value??data?.host?.screen_state;
 if(sources.length&&(['locked','unlocked','no_session'].includes(screen)&&fresh(data?.host?.sources?.screen_state?.observed_at_unix)||['personal_data','unrestricted'].some(key=>['locked','unlocked','active','inactive','expired','revoked','closing'].includes(data?.[key]?.state)&&fresh(data[key].observed_at_unix))))return true;
 return sources.length?sources.some(s=>fresh(s.observed_at_unix)||s.observed_at_unix==null&&s.state==='reading'&&fresh(s.unavailable_since_unix??s.refresh_started_at_unix)):fresh(data?.observed_at_unix);
}
function connectionText(at,loading=false){const date=Number.isFinite(at)&&at>0?new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(at*1000)):null;return (loading?'正在连接电脑。':'读不到电脑：可能电脑不在线，也可能是你这边的网络连不上它。')+(date?'最后读到是 '+date+'（北京时间）。':'还没读到过。');}
function formatTime(value,now){const t=typeof value==='string'?Date.parse(value):NaN;if(!Number.isFinite(t)||t>now)return null;const parts=d=>Object.fromEntries(new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(d)).map(p=>[p.type,p.value]));const d=parts(t),n=parts(now);return (d.year===n.year&&d.month===n.month&&d.day===n.day?'今天':(d.year===n.year?'':d.year+'年')+d.month+'月'+d.day+'日')+' '+d.hour+':'+d.minute;}
function taskResult(task,now){if(!task)return unknown;if(task.enabled===false||task.state==='disabled')return {text:'已停用',state:'disabled'};const labels={success:'正常',warn:'需要留意',failed:'失败',running:'正在运行'};const t=formatTime(task.last_run_at,now);return t&&Object.hasOwn(labels,task.state)?{text:labels[task.state]+' · '+t,state:task.state==='success'?'ok':task.state}:unknown;}
function parse(data,slot,project,now=Date.now()){
 function items(name,states){const b=data?.[name];if(!b||!states.includes(b.state)||!Array.isArray(b.items))return null;const t=Date.parse(b.observed_at);return Number.isFinite(t)&&t<=now+60000&&now-t<=(Number(b.max_age_seconds)||120)*1000?b.items:null;}
 if(slot==='run'){const row=items('projects',['ok','empty','partial'])?.find(x=>x.project===project);const labels={ok:'运行正常',failed:'上次运行失败',overdue:'有任务没按时跑',not_applicable:'暂无启用中的任务'};return row&&Object.hasOwn(labels,row.run_health)?{text:labels[row.run_health],state:row.run_health}:unknown;}
 if(slot==='cloud'){
  if(project==='照片视频录音管理'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='照片视频录音云端维护');return taskResult(task,now);}
  if(project!=='中文语音转写')return unknown;
  const row=items('projects',['ok','empty','partial'])?.find(x=>x.project==='中文语音转写');
  const cloud=row?.cloud_review;
  if(!cloud||['stale','unavailable'].includes(row.state)||!['state','free_until','last_run_at','last_result','failure_reason'].every(key=>Object.hasOwn(cloud,key))||!['success','failed','none'].includes(cloud.last_result))return unknown;
  if(cloud.state==='auto'){
   if(cloud.last_result==='failed')return {text:'最近一次复核失败',state:'failed'};
   const until=typeof cloud.free_until==='string'?Date.parse(cloud.free_until):NaN;
   if(!Number.isFinite(until))return unknown;
   const parts=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'numeric',day:'numeric'}).formatToParts(new Date(until));
   const month=parts.find(p=>p.type==='month').value,day=parts.find(p=>p.type==='day').value;
   return {text:`自动复核中（免费到 ${month} 月 ${day} 日）`,shortText:'自动复核中',state:'ok'};
  }
  const labels={paused:'已暂停',expired:'免费期已到，不再自动',error:'出错已停'};
  return Object.hasOwn(labels,cloud.state)?{text:labels[cloud.state],state:cloud.state}:unknown;
 }
 if(slot==='acceptance'){const row=items('projects',['ok','partial','empty'])?.find(x=>x.project===project);const n=row?.waiting_user_count;return Number.isInteger(n)&&n>=0?{text:n?`${n} 项待验收`:'没有待验收',state:n?'waiting':'ok'}:unknown;}
 if(slot==='watch'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='AI 工具升级观察');if(!task)return unknown;if(task.enabled===false||task.state==='disabled')return {text:'平时停着',state:'disabled'};return task.enabled===true?taskResult(task,now):unknown;}
 if(slot==='local'||slot==='panel')return {text:slot==='local'?'此接口未提供本机模型服务状态':'此接口未提供机箱屏画面更新时间',state:'unknown'};
 if(slot==='config'||slot==='wechat'){const name=slot==='config'?'开发配置备份':'微信聊天备份';const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name===name);const item=task&&items('backups',['ok','partial','empty'])?.find(x=>x.id===task.id&&x.project===project);const t=item&&formatTime(item.last_success_at,now);return t?{text:'上次成功 '+t,state:item.state==='stale'?'overdue':'ok'}:unknown;}
 if(slot==='health'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='内存盘维护');return taskResult(task,now);}
 if(slot==='capture'){const task=items('automation',['ok','partial','empty'])?.find(x=>x.project===project&&x.plain?.name==='串流画面切换');const state=task?.related_status?.capture;const labels={success:'正常',failed:'异常',warn:'需要留意'};return Object.hasOwn(labels,state)?{text:labels[state],state:state==='success'?'ok':state}:unknown;}
 if(slot==='sync'){const rows=items('projects',['ok','partial','empty'])?.filter(x=>x.mode==='repository');if(!rows?.length)return unknown;let yes=0,no=0,unread=0;for(const row of rows){const g=row.github_sync,t=Date.parse(g?.observed_at);if(!g||!Number.isFinite(t)||t>now+60000||now-t>600000){unread++;continue;}if(g.state==='in_sync')yes++;else if(['ahead','behind','diverged','local_ahead','remote_ahead','out_of_sync'].includes(g.state))no++;else unread++;}return {text:`已同步 ${yes} 个 · 未同步 ${no} 个`+(unread?` · ${unread} 个缺少当前读数`:''),state:unread?'warn':no?'overdue':'ok'};}
 if(slot==='grafana'){const g=data?.grafana,t=Date.parse(g?.checked_at);if(g?.state==='reachable'&&Number.isFinite(t)&&t<=now+60000&&now-t<=300000&&typeof g.url==='string'&&/^https:\/\//.test(g.url))return {text:'在线',state:'ok',href:g.url};return unknown;}
 if(['lessons','week','practice'].includes(slot)){
  const row=items('projects',['ok','empty','partial'])?.find(x=>x.project==='学习方法');const metrics=row?.metrics;if(!metrics||row.state==='stale'||row.state==='unavailable')return unknown;
  const integer=v=>Number.isInteger(v)&&v>=0;
  if(slot==='lessons'){const m=metrics.lessons;return m&&integer(m.done)&&integer(m.total)&&m.done<=m.total?{text:`已学 ${m.done}/${m.total} 课`,state:'learning'}:unknown;}
  if(slot==='week'){const m=metrics.sessions_7d;return m&&integer(m.count)&&integer(m.minutes)?{text:`近 7 天 ${m.count}次 · ${m.minutes}分钟`,state:'learning'}:unknown;}
  const p=metrics.practice;if(!p)return unknown;const pieces=[];for(const [key,label,a,b]of [['algorithm','算法','done','total'],['java_review','复习','done','total'],['quiz','答题','correct','asked'],['experiments','实验','done','planned']]){const v=p[key];if(v&&integer(v[a])&&integer(v[b])&&v[a]<=v[b])pieces.push(`${label} ${v[a]}/${v[b]}`);}return pieces.length?{text:pieces.join(' · '),state:'learning'}:unknown;
 }
 if(slot==='backup'){const list=items('backups',['ok','empty']);if(!list)return unknown;let ok=0,bad=0;for(const b of list){if(b.enabled===false||b.state==='disabled')continue;if(b.enabled!==true)return unknown;if(b.state==='success'&&Number.isFinite(Date.parse(b.last_success_at)))ok++;else bad++;}return {text:`备份 ${ok}项正常 · ${bad}项要看`,state:bad?'overdue':'ok'};}
 if(slot==='image'){const today=items('today',['ok','empty']);if(!today)return unknown;const valid=t=>Number.isFinite(t)&&t<=now;const complete=today.filter(x=>x.type==='system_backup_completed').map(x=>Date.parse(x.at)).filter(valid);const started=today.filter(x=>x.type==='system_backup_started').map(x=>Date.parse(x.at)).filter(valid);if(complete.length){const last=Math.max(...complete);if(started.length&&Math.max(...started)>last)return {text:'镜像 正在做',state:'running'};return {text:'镜像 今天 '+new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(last)),state:'ok'};}return {text:started.length?'镜像 正在做':'镜像 今天还没做',state:started.length?'running':'none'};}
 return unknown;
}
function fitCloud(cell,result,minFont=6,maxFont=Infinity){
 const span=cell.querySelector('span'),initial=Math.max(minFont,Math.min(maxFont,cell.clientHeight*.7));
 const overflow=()=>cell.scrollWidth>cell.clientWidth+1||cell.scrollHeight>cell.clientHeight+1;
 function fit(text){span.textContent=text;let fs=initial;cell.style.fontSize=fs+'px';while(fs>minFont&&overflow()){fs=Math.max(minFont,fs*.9);cell.style.fontSize=fs+'px';}}
 fit(result.text);if(overflow()&&result.shortText)fit(result.shortText);
}
function unifyBannerFonts(cells,minimum){
 if(!cells.length)return null;
 const font=Math.max(minimum,Math.min(...cells.map(c=>parseFloat(c.style.fontSize)||minimum)));
 for(const cell of cells){cell.style.fontSize=font+'px';cell.style.justifyContent='center';cell.style.alignItems='center';cell.style.textAlign='center';const span=cell.querySelector('span');if(span.style.whiteSpace!=='pre-line'){span.style.whiteSpace='nowrap';cell.style.whiteSpace='nowrap';if(cell.scrollWidth>cell.clientWidth+1){span.style.whiteSpace='normal';cell.style.whiteSpace='normal';}}}
 return font;
}
function cacheKey(page,slot){return `site-live:v1:${page}:${slot}`;}
function readLast(storage,page,slot,project,now=Date.now()){try{const c=JSON.parse(storage.getItem(cacheKey(page,slot)));return c&&c.project===project&&typeof c.result?.text==='string'&&c.result.state!=='unknown'&&Number.isFinite(c.at)&&c.at<=now+60000?c:null;}catch{return null;}}
function readCache(storage,page,slot,project,now=Date.now()){const c=readLast(storage,page,slot,project,now);return c&&now-c.at<86400000?c:null;}
function offlineResult(c,now=Date.now()){return c?{text:'读不到电脑 · 当时：'+c.result.text+' · 上次读到 '+formatTime(new Date(c.at).toISOString(),now)+(now-c.at>=86400000?'（已超过24小时）':'')+' · 当前状态未知',state:'offline',cached:true,readAt:c.at/1000}: {text:'读不到电脑 · 还没读到过',state:'offline',cached:false};}
const helpers={parse,fitCloud,unifyBannerFonts,readCache,readLast,offlineResult,cacheKey,formatTime,connectionText,freshStatus,readTimeoutMs,retryStatus};
if(typeof module!=='undefined'&&module.exports){module.exports=helpers;return;}
window.SiteLiveRuntime=helpers;
const page=JSON.parse(document.querySelector('#page-data').textContent),loading={text:'读取中',state:'loading'};
let last=null,busy=false,controller=null,phase='loading',offline=false,cancelledForVisibility=false;const history=[];let started=0;
const lastValues=new Map();
function resetOfflineLayout(){
 for(const section of document.querySelectorAll('.offline-expanded')){section.classList.remove('offline-expanded');section.style.height='';section.style.aspectRatio=section._layout.size.join('/');section.querySelector('picture').style.clipPath='';for(const [el,style]of section._offlineStyles||[])if(el.isConnected)el.style.cssText=style;section._offlineStyles=null;section.querySelectorAll('.offline-tail,.offline-notice').forEach(e=>e.remove());}
}
function offlineNotice(section,texts){if(section.classList.contains('typeset-screen'))return;
 const lay=section._layout,base=section.clientWidth*lay.size[1]/lay.size[0],banner=lay.live_detection?.enclosing_banner;const cut=banner?(banner[3]-lay.crop[1])*section.clientWidth/lay.size[0]+3:Math.max(...lay.live.map(c=>(c.rect[1]+c.rect[3])*base))+10;
 const notice=document.createElement('div');notice.className='offline-notice';notice.setAttribute('role','status');notice.textContent=[...new Set(texts)].join('；');const left=Math.min(...lay.live.map(c=>c.rect[0]*section.clientWidth));Object.assign(notice.style,{left:left+'px',top:cut+'px',width:(section.clientWidth-left-12)+'px'});section.append(notice);const extra=notice.offsetHeight+12;
 const picture=section.querySelector('picture'),tail=document.createElement('div'),copy=new Image();tail.className='offline-tail';tail.setAttribute('aria-hidden','true');Object.assign(tail.style,{top:(cut+extra)+'px',height:(base-cut)+'px'});copy.src=picture.querySelector('img').currentSrc;Object.assign(copy.style,{width:section.clientWidth+'px',top:-cut+'px'});tail.append(copy);section.append(tail);
 const children=[...section.querySelector('.overlays').children];section._offlineStyles=children.map(e=>[e,e.style.cssText]);const boxes=children.map(e=>({e,x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight}));section.style.height=(base+extra)+'px';section.style.aspectRatio='auto';picture.style.clipPath=`inset(0 0 ${Math.max(0,base-cut)}px 0)`;section.classList.add('offline-expanded');for(const b of boxes)Object.assign(b.e.style,{left:b.x+'px',top:(b.y+(b.y>=cut?extra:0))+'px',width:b.w+'px',height:b.h+'px'});
}
function currentResult(slot){
 const connected=last&&freshStatus(last)&&(phase==='ready'||phase==='loading');
 let result=connected?(slot==='run'&&page.page==='remote-control'?{text:'电脑连接服务在线',state:'ok',readAt:last.served_at_unix??last.observed_at_unix}:parse(last,slot,page.project)):unknown;
 const block=slot==='grafana'?'grafana':['config','wechat','backup'].includes(slot)?'backups':['image'].includes(slot)?'today':['watch','cloud','health','capture'].includes(slot)?'automation':'projects';
 const source=last?.[block],readAt=result.readAt||Number(source?.observed_at_unix)||Date.parse(source?.observed_at||source?.checked_at)/1000;
 if(connected&&['run','lessons','week','practice'].includes(slot)){const row=source?.items?.find(x=>x.project===page.project);if(['stale','unavailable'].includes(row?.state))result={text:row.state==='stale'?'这一项的来源读数已过期':'这一项的采集结果不可用',state:'unknown'};}
 if(result.state!=='unknown')return {...result,readAt:Number.isFinite(readAt)?readAt:undefined};
 let cached=lastValues.get(slot);try{cached ||= readCache(localStorage,page.page,slot,page.project)||readLast(localStorage,page.page,slot,page.project);}catch{}
 if(last&&phase!=='ready'&&cached)return {...cached.result,text:cached.result.text+' · '+Math.max(0,Math.floor((Date.now()-cached.at)/60000))+' 分钟前读到',state:'unknown',cached:true,retained:true,readAt:cached.at/1000};
 if(connected&&source?.collection_state==='reading')return cached?{...offlineResult(cached),text:'此项正在读取 · 当时：'+cached.result.text+' · 上次读到 '+formatTime(new Date(cached.at).toISOString(),Date.now()),state:'unknown'}:{text:'正在读取这一项 · 还没读到过',state:'loading',readAt:undefined};
 if(connected)return cached?{...offlineResult(cached),text:'此项当前读不到 · 当时：'+cached.result.text+' · 上次读到 '+formatTime(new Date(cached.at).toISOString(),Date.now()),state:'unknown'}:{text:result.text!==unknown.text?result.text:source?.state==='stale'?'这一项的读数已过期':source?.state==='unavailable'?'这一项的采集结果不可用':slot==='watch'&&source?.items?.some(x=>x.project===page.project&&x.plain?.name==='AI 工具升级观察')?'升级观察的采集结果不可用':'此接口尚未提供'+(page.status_binding?.labels?.[slot]||'这一项')+'数据',state:'unknown'};
 if(phase==='loading'&&!last)return cached?{...offlineResult(cached),text:'正在重新读取 · '+cached.result.text,retained:true}:loading;
 return offlineResult(cached);
}
function display(){
 resetOfflineLayout();
 for(const strip of document.querySelectorAll('.live-strip')){
  const cells=[...strip.querySelectorAll('[data-slot]')],results=cells.map(cell=>currentResult(cell.dataset.slot));
  const readable=results.length>0&&results.every(result=>result.state!=='unknown'||result.retained);strip.hidden=!readable;
  cells.forEach((cell,i)=>{const result=results[i],prefix=page.status_binding?.prefixes?.[cell.dataset.slot],text=readable?(prefix?prefix+'：':'')+result.text:'';cell.querySelector('span').textContent=text;cell.title=text;cell.dataset.state=readable?result.state:'unknown';cell.dataset.cached=String(!!result.cached);
   if(readable&&result.href){cell.href=result.href;cell.setAttribute('role','link');cell.target='_blank';cell.rel='noopener';}else{cell.removeAttribute('href');cell.setAttribute('role','status');}
  });
 }
 if(typeof displayTypesetStatus==='function')displayTypesetStatus(last,phase,(_payload,slot)=>currentResult(slot),page);
 const failed=phase==='error'||phase==='ready'&&!freshStatus(last),waiting=phase==='loading'&&!last;
 let notice=document.querySelector('[data-computer-read-notice]');
 if((failed||waiting)&&document.querySelector('main')&&(document.querySelector('[data-slot]')||page.home_living===true)){
  if(!notice){notice=document.createElement('aside');notice.dataset.computerReadNotice='true';notice.setAttribute('role','status');notice.style.cssText='margin:12px 24px;padding:12px 16px;border:1px solid #d4ddd7;border-radius:8px;background:white;color:#68766f;line-height:1.5';document.querySelector('main')?.prepend(notice);}
  const times=[...document.querySelectorAll('[data-slot]')].map(cell=>currentResult(cell.dataset.slot).readAt).filter(Number.isFinite);let saved=0;try{saved=Number(localStorage.getItem('computer-last-read-v1'))||0;}catch{}
  const at=Number(last?.observed_at_unix)|| (times.length?Math.max(...times):saved);
  notice.textContent=(last&&phase==='error'?'连接暂时中断，下面保留 '+Math.max(0,Math.floor((Date.now()/1000-at)/60))+' 分钟前读到的数据。':connectionText(at,waiting))+(at>0?'旧数只表示当时的状态。':'');
  const link=document.createElement('a');link.href='/mcp/';link.textContent='查看连接电脑页的副机备用入口';notice.append(' ',link);notice.hidden=false;
 }else if(notice)notice.hidden=true;
 document.body.dataset.statusPhase=phase;
 const snap={phase,at:performance.now(),elapsedMs:started?performance.now()-started:0,slots:[...document.querySelectorAll('[data-slot]')].map(c=>({slot:c.dataset.slot,text:c.textContent.trim(),cached:false}))};history.push(snap);if(history.length>20)history.shift();
}
async function refresh(){
 if(busy||document.hidden||!document.querySelector('[data-slot]'))return;
 busy=true;phase='loading';offline=false;cancelledForVisibility=false;started=performance.now();display();controller=new AbortController();
 try{
  const local=['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname);
  last=await retryStatus(async()=>{const signal=typeof AbortSignal==='function'&&AbortSignal.any?AbortSignal.any([controller.signal,AbortSignal.timeout(readTimeoutMs)]):controller.signal;const response=await fetch(local?'/__status':'https://mcp.wly0829.cn/computer-access/api/status',{credentials:'include',cache:'no-store',signal});if(!response.ok)throw Error('HTTP_'+response.status);const next=await response.json();if(!freshStatus(next))throw Error('expired_snapshot');return next;},controller.signal);phase='ready';document.body.dataset.statusError='';
  if(phase==='ready')try{localStorage.setItem('computer-last-read-v1',String(Date.now()/1000));}catch{}
  if(phase==='ready')for(const cell of document.querySelectorAll('[data-slot]')){const slot=cell.dataset.slot,result=currentResult(slot);if(!['unknown','loading'].includes(result.state)){const saved={project:page.project,result,at:Number.isFinite(result.readAt)?result.readAt*1000:Date.now()};lastValues.set(slot,saved);try{localStorage.setItem(cacheKey(page.page,slot),JSON.stringify(saved));}catch{}}}
 }catch(e){phase=cancelledForVisibility?'loading':'error';offline=!cancelledForVisibility&&(e.name==='AbortError'||e.name==='TypeError'||/^HTTP_5/.test(e.message||''));document.body.dataset.statusError=e.name==='AbortError'?'timeout':e.message;}
 finally{busy=false;display();}
}
document.addEventListener('site-layout',()=>{display();if(phase==='loading'&&!started&&!last&&!busy)refresh();});addEventListener('resize',display);
document.fonts?.ready.then(display);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelledForVisibility=true;controller?.abort();}else refresh();});display();refresh();setInterval(refresh,60000);
window.SiteStatus={parse,refresh,history,resetLayout:resetOfflineLayout};
})();

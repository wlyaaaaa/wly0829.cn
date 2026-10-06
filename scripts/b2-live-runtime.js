import {HOST_ORIGIN,apiRequest,createStatusReader,createGrantAttempt,durationMinutes,minutesLabel,remainingMinutes,grantLabel,canEndGrant,isAccessOrigin,markGrantVerificationSubmitted,readGrantStage,grantResultNeedsQuery,canRestartUnsubmittedGrant,queryResultUpdate,reductionFailureResult,successfulGrantSnapshot,successfulReductionSnapshot,unresolvedAction,errorMessages,capacity,adaptStatus,reading,numeric,rate,networkConnection,beijingTime,freshStatus,hardwareSnapshot} from './b2-access-model.js';

// The owner's cockpit lamp policy; partial reads keep their own unknown state.
const lampPolicy={computerMaxAge:120,unreadableGrace:600,taskWarnFailures:2,taskErrorFailures:4,backupWarnAge:{daily:36*3600,weekly:9*86400},backupErrorAge:{daily:48*3600,weekly:14*86400},diskWarnFraction:.1,diskErrorFraction:.05,systemDiskMinBytes:15*1024**3};

const data=JSON.parse(document.querySelector('#page-data').textContent);

if(!['cockpit','computer-access','mcp'].includes(data.kind))throw Error('B2运行件只接选定页面');

const currentHost=location.origin===HOST_ORIGIN,formal=isAccessOrigin(location.origin,window.top===window),base=currentHost?'':HOST_ORIGIN;

let status=null,phase='loading',lastRead=0,problem='',purpose='personal_data',combined=false,saveDefault=false,hours='',hoursTouched=false,code='',busy=false,grant=null,attempt=null,actions=[],result=null,toast='',toastState='unknown',toastTimer=null;

const grantKey='site-b2-access-request-v1',actionsKey='site-b2-access-actions-v1';

const elements=new Map();
const todayRiverHost=document.querySelector('[data-today-river]');
const lastGrafanaGroups=new Map();

const liveAnchors=data.b2_live_anchors||[];

let target=liveAnchors.find(x=>x.id===decodeURIComponent(location.hash.slice(1)))||null;

const clock=()=>Date.now()/1000;

const timeFormatter=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const time=t=>{if(!Number.isFinite(t)||t<=0)return '时间未知';const parts=d=>Object.fromEntries(timeFormatter.formatToParts(new Date(d)).map(p=>[p.type,p.value]));const d=parts(t*1000),now=parts(Date.now());return (d.year===now.year&&d.month===now.month&&d.day===now.day?'今天':(d.year===now.year?'':d.year+'年')+d.month+'月'+d.day+'日')+' '+d.hour+':'+d.minute;};

const known=v=>v===null||v===undefined?'读不到':String(v);

const validRequest=id=>/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id||'');

const grantState=g=>!authorizationFresh(g)?'unknown':remainingMinutes(g,clock())===0?'warn':['unlocked','active'].includes(g?.state)?'ok':['locked','inactive','revoked','expired'].includes(g?.state)?'closed':['opening','closing'].includes(g?.state)?'warn':['error','failed'].includes(g?.state)?'error':'unknown';

const blockTime=b=>Number.isFinite(b?.observed_at_unix)?b.observed_at_unix:Date.parse(b?.observed_at||b?.checked_at)/1000;
function grafanaTime(){
 const g=status?.grafana||status?.services?.grafana;
 if(!Object.hasOwn(g||{},'public_dashboard_checked_at'))return blockTime(g);
 const at=g.public_dashboard_checked_at;
 return typeof at==='string'&&/(?:Z|[+-]\d{2}:\d{2})$/i.test(at)?Date.parse(at)/1000:NaN;
}
const grafanaGroupTitles={'cpu-gpu':'处理器和显卡曲线','memory-network':'内存和网络曲线'};
function grafanaGroupRow(part){
 const group=(status?.grafana||status?.services?.grafana)?.groups?.[part],stamp=group?.checked_at;
 const readAt=typeof stamp==='string'&&/(?:Z|[+-]\d{2}:\d{2})$/i.test(stamp)?Date.parse(stamp)/1000:NaN;
 const maxAge=group&&Object.hasOwn(group,'max_age_seconds')?group.max_age_seconds:300;
 const row={title:grafanaGroupTitles[part],text:'曲线暂时打不开',state:'unknown',cached:false,readAt};
 if(online()&&group?.state==='reachable'&&Number.isFinite(maxAge)&&maxAge>0&&Number.isFinite(readAt)&&readAt>0&&readAt<=clock()&&clock()-readAt<=maxAge&&/^https:\/\/grafana\.wly0829\.cn\/public-dashboards\/[a-f0-9]{32}\/?(?:\?theme=(?:light|dark))?$/i.test(group.url||''))return {...row,text:'可查看近24小时曲线',iframe:group.url,state:'ok'};
 return row;
}
function grafanaGroupValue(part){
 const selected=grafanaGroupRow(part),primary=part==='cpu-gpu'?selected:grafanaGroupRow('cpu-gpu'),secondary=part==='memory-network'?selected:grafanaGroupRow('memory-network');
 if(!primary.iframe&&!secondary.iframe){
  if(part==='memory-network')return {...selected,empty:true,emptyReason:'grafana-groups-unreadable'};
  const groups=(status?.grafana||status?.services?.grafana)?.groups;
  if(online()&&['cpu-gpu','memory-network'].every(key=>groups?.[key]?.state==='unavailable'&&groups[key].url===null&&groups[key].checked_at===null))return {...selected,title:'近24小时曲线',text:'手机版图表稍后上线。',readAt:null,planned:true};
  return {...selected,title:'近24小时曲线',text:'两组曲线暂时打不开\n处理器和显卡观察：'+time(primary.readAt)+'\n内存和网络观察：'+time(secondary.readAt)};
 }
 return selected;
}
const staticHardwareFields=new Set(['model','cores','threads','total_bytes','vram_total_bytes','letter']);
function blockHealth(key){const b=status?.[key];if(!b||['unavailable','unknown'].includes(b.state))return 'unknown';if(['failed','error'].includes(b.state))return 'error';const at=blockTime(b);if(b.state==='stale'||!Number.isFinite(at)||at>clock()+60||clock()-at>(Number(b.max_age_seconds)||120))return 'stale';return ['ok','partial','empty'].includes(b.state)?'ok':'unknown';}
const rawList=key=>['ok','partial','empty','stale'].includes(status?.[key]?.state)&&Array.isArray(status[key].items)?status[key].items:null;
let historical=false;
const list=key=>historical?rawList(key):blockHealth(key)==='ok'?rawList(key):null;
const name=x=>x?.plain?.name||x?.name||x?.plain_title||x?.project||'名称暂未提供';
const stateText=s=>({success:'正常',failed:'失败',error:'出错',warn:'需要留意',stale:'已过期',overdue:'没按时完成',running:'正在运行',disabled:'已停用',unknown:'状态未知',never:'还没运行',unavailable:'暂时读不到'})[s]||'状态未知';
const cadenceText=s=>({daily:'每天',weekly:'每周',monthly:'每月',hourly:'每小时',manual:'手动运行',on_change:'变更时',on_login:'登录时',on_startup:'开机时'})[s]||'周期说明暂未提供';
const rowState=rows=>rows?.some(x=>x.enabled!==false&&['failed','error'].includes(x.state))?'error':rows?.some(x=>x.enabled!==false&&['warn','stale','overdue'].includes(x.state))?'warn':!rows||rows.some(x=>x.enabled!==false&&(!['success','running','disabled','never'].includes(x.state)||x.state==='success'&&!Number.isFinite(Date.parse(x.last_success_at||x.last_run_at))))?'unknown':'ok';
function hardwareHealth(){
 const hw=status?.hardware;if(!hw||['unknown','unavailable'].includes(hw.state))return 'unknown';
 const unwrapped=v=>v&&typeof v==='object'&&Object.hasOwn(v,'value')?v.value:v;
 const groups=[{row:hw.cpu,fields:['model','usage_percent','temperature_celsius','power_watts']},{row:hw.memory,fields:['used_bytes','total_bytes']},{row:hw.network,fields:['connected','download_bytes_per_second','upload_bytes_per_second']},{row:hw.display,fields:['width_px','height_px','refresh_hz']},...(hw.gpus||[]).map(row=>({row,fields:['model','usage_percent','temperature_celsius','vram_used_bytes','vram_total_bytes']})),...(hw.volumes||[]).filter(v=>unwrapped(v.connected)!==false).map(row=>({row,fields:['letter','free_bytes','total_bytes']}))];
 let unknown=false,stale=hw.state==='stale';
 for(const {row,fields} of groups){
  if(!row||['unknown','unavailable','error','failed'].includes(row.state)){unknown=true;continue;}
  if(row.state==='stale')stale=true;
  for(const field of fields){const metric=row[field],source=row.sources?.[field],actual=unwrapped(metric);if(actual===null||actual===undefined||actual===''||typeof actual==='number'&&!Number.isFinite(actual)||['unknown','unavailable','error','failed'].includes(metric?.state)||['unknown','unavailable','error','failed'].includes(source?.status))unknown=true;if(metric?.state==='stale'||source?.status==='stale')stale=true;const sampled=metric?.observed_at_unix??source?.observed_at_unix;if(!staticHardwareFields.has(field)&&Number.isFinite(sampled)&&(sampled>clock()+60||clock()-sampled>(Number(row.max_age_seconds||hw.max_age_seconds)||120)))stale=true;}
  const at=blockTime(row);if(Number.isFinite(at)&&(at>clock()+60||clock()-at>(Number(row.max_age_seconds||hw.max_age_seconds)||120)))stale=true;
 }
 return stale?'stale':unknown?'unknown':'ok';
}
function projectHealth(){const rows=list('projects');if(!rows)return 'unknown';if(rows.some(x=>x.frozen!==true&&(x.failed_count>0||['failed','run_failed','acceptance_failed'].includes(x.overview)||x.run_health==='failed')))return 'error';if(rows.some(x=>x.frozen!==true&&(['run_unknown','unknown'].includes(x.overview)||['unknown','unavailable','stale'].includes(x.state)||x.run_health==='unknown')))return 'unknown';if(rows.some(x=>x.frozen!==true&&(x.waiting_user_count>0||x.waiting_ai_count>0||x.on_hold_count>0||x.overview==='run_overdue'||x.run_health==='overdue')))return 'warn';return 'ok';}

const online=()=>phase==='ready'&&freshStatus(status,clock());
const authorizationTime=g=>g?.observed_at_unix??status?.display_cache?.collectors?.authorization?.observed_at_unix??status?.observed_at_unix;
const authorizationFresh=g=>online()&&Number.isFinite(authorizationTime(g))&&clock()-authorizationTime(g)<=120&&authorizationTime(g)<=clock()+60&&(Number.isFinite(g?.observed_at_unix)||status?.display_cache?.collectors?.authorization?.state!=='error');
const windowsTime=()=>status?.host?.sources?.screen_state?.observed_at_unix??status?.host?.screen_state?.observed_at_unix??status?.host?.observed_at_unix??(status?.display_cache?null:status?.observed_at_unix);
const windowsFresh=()=>online()&&Number.isFinite(windowsTime())&&clock()-windowsTime()<=120&&windowsTime()<=clock()+60&&!['unknown','unavailable','error','failed','stale'].includes(status?.host?.sources?.screen_state?.status);

const offline=(at=lastRead)=>window.SiteLiveRuntime?.connectionText?.(at,phase==='loading')||((phase==='loading'?'正在连接电脑。':'读不到电脑：可能电脑不在线，也可能是你这边的网络连不上它。')+(at?'最后读到是 '+new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(at*1000))+'（北京时间）。':'还没读到过。'));
const lastContact=()=>{try{return lastRead||Number(localStorage.getItem('computer-last-read-v1'))||0;}catch{return lastRead;}};

const stateLabel=(grant,key)=>{

 if(!authorizationFresh(grant))return status?.display_cache?.collectors?.authorization?.state==='reading'?'正在读取授权状态':'当前状态读不到';

 const mins=remainingMinutes(grant,clock());

 if(mins!==null)return mins>0?'开着，到 '+time(grant.expires_at_unix)+'（还剩 '+minutesLabel(mins)+'）':'已到期，等电脑确认';

 if(grant?.state==='locked')return '锁着';if(grant?.state==='inactive')return '关着';

 return grantLabel(grant,clock());

};

function message(text,state='warn'){toast=text;toastState=state;clearTimeout(toastTimer);render();toastTimer=setTimeout(()=>{toast='';render();},10000);}

function rememberGrant(request){grant=request;try{request?sessionStorage.setItem(grantKey,request.request_id):sessionStorage.removeItem(grantKey);}catch{}}

function rememberAction(value){actions=[...actions.filter(x=>x.request_id!==value.request_id),value];try{sessionStorage.setItem(actionsKey,JSON.stringify(actions.map(({request_id,action,state,error})=>({request_id,action,state,error}))));}catch{}}

try{const id=sessionStorage.getItem(grantKey);if(validRequest(id))grant={request_id:id,state:'unknown',factor_submitted:readGrantStage(sessionStorage,id)};const old=JSON.parse(sessionStorage.getItem(actionsKey)||'[]');if(Array.isArray(old))actions=old.filter(x=>validRequest(x.request_id)&&['personal-data','unrestricted','windows'].includes(x.action)).map(x=>({...x,state:'unknown'}));}catch{}

const linkedRequest=new URLSearchParams(location.search).get('request');

if(validRequest(linkedRequest))rememberGrant({request_id:linkedRequest,state:'unknown',factor_submitted:readGrantStage(sessionStorage,linkedRequest)});

const lampReadKey='site-cockpit-read-gaps-v1',lampReads=new Map();
let lastCompleteLamp=null;
try{const saved=JSON.parse(localStorage.getItem(lampReadKey));for(const [key,at] of Object.entries(saved?.since||{}))if(Number.isFinite(at)&&at>0&&at<=clock())lampReads.set(key,at);if(['ok','warn','error'].includes(saved?.lamp?.state))lastCompleteLamp=saved.lamp;}catch{}
const timestamp=v=>Number.isFinite(v)?v:Date.parse(v)/1000;
const taskInLamp=x=>x.enabled!==false&&x.external!==true&&x.project!=='电脑上别的软件'&&(x.mine??x.plain?.mine)!==false;
const taskNotConnected=x=>x.availability!=null?x.availability==='not_connected':x.enabled==null&&x.source&&x.source!=='windows';
const failureCount=x=>Number.isInteger(x.consecutive_failures)&&x.consecutive_failures>=0?x.consecutive_failures:null;
function projectReadMissing(x){
 if(['unknown','unavailable','stale'].includes(x.state))return true;
 if(!(['run_unknown','unknown'].includes(x.overview)||x.run_health==='unknown'))return false;
 const tasks=list('automation')?.filter(task=>task.project===x.project&&taskInLamp(task));
 // Unconnected manual entries and never-run tasks are known gaps in results,
 // not failures to read the project or the Windows scheduler.
 return !tasks?.length||tasks.some(task=>!taskNotConnected(task)&&task.availability!=='available'&&!['success','running','disabled','never','failed','error','warn','overdue'].includes(task.state));
}
function saveLampReads(){try{localStorage.setItem(lampReadKey,JSON.stringify({since:Object.fromEntries(lampReads),lamp:lastCompleteLamp}));}catch{}}
function readGaps(){
 const gaps=[],active=new Set();
 function add(key,label,source,expiredAt){
  active.add(key);const declared=timestamp(source?.unavailable_since_unix??source?.unavailable_since),previous=lampReads.get(key);
  const starts=[declared,expiredAt,previous].filter(t=>Number.isFinite(t)&&t>0&&t<=clock());
  const since=starts.length?Math.min(...starts):clock();lampReads.set(key,since);
  gaps.push({key,label,since,overGrace:clock()-since>lampPolicy.unreadableGrace});
 }
 for(const [key,label] of Object.entries({automation:'自动任务',backups:'备份运行记录',pending:'待处理事项',today:'今天动态',projects:'项目状态',remote_network:'远程和网络',backup_inventory:'备份副本证据'})){
  const b=status?.[key],health=blockHealth(key),rows=rawList(key);
  if(health!=='ok'||!rows){const at=blockTime(b);add(key,label,b,health==='stale'&&Number.isFinite(at)?at+(Number(b?.max_age_seconds)||120):undefined);continue;}
  if(key==='automation'){
   if(b.missing_count>0)add(key,label,b);
   for(const x of rows.filter(taskInLamp))if(!taskNotConnected(x)&&(['unavailable','stale'].includes(x.state)||x.availability==='unavailable'||x.state==='unknown'&&x.availability!=='available'))add(key+':'+x.id,'自动任务“'+name(x)+'”',x);
  }else if(key==='backups'){
   for(const x of rows.filter(taskInLamp))if(['unknown','unavailable'].includes(x.state)||!Number.isFinite(timestamp(x.last_success_at))&&x.state!=='never')add(key+':'+x.id,'备份“'+name(x)+'”的成功记录',x);
  }else if(key==='projects'){
   for(const x of rows.filter(x=>x.frozen!==true))if(projectReadMissing(x))add(key+':'+(x.id||x.project),'项目“'+name(x)+'”的运行状态',x);
  }else if(key==='remote_network'){
   const labels={internet:'互联网连接',tailscale:'远程网络',secondary_laptop:'副机在线状态',sunshine:'串流服务',system_proxy:'代理状态',windows_update_restart:'Windows 重启状态'};
   for(const x of rows)if(['unknown','unavailable','stale'].includes(x.state))add(key+':'+x.id,labels[x.id]||name(x),x);
  }else if(key==='backup_inventory'){
   for(const group of rows)for(const x of (group.items||[]).filter(x=>taskInLamp(x)&&x.role!=='original'))if(['unknown','unavailable'].includes(x.protection)||x.destination_state==='unregistered'||['unknown','unavailable'].includes(x.freshness))add(key+':'+x.id,'“'+group.name+'”里的备份“'+name(x)+'”的副本证据',x);
  }
 }
 if(hardwareHealth()!=='ok'){
  const hw=status?.hardware,rows=[hw?.cpu,hw?.memory,hw?.network,hw?.display,...(hw?.gpus||[]),...(hw?.volumes||[])];
  const expired=[];
  for(const row of rows.filter(Boolean)){
   const maxAge=Number(row.max_age_seconds||hw?.max_age_seconds)||120,at=blockTime(row);
   if(Number.isFinite(at)&&clock()-at>maxAge)expired.push(at+maxAge);
   for(const [field,source]of Object.entries(row.sources||{})){const sample=source?.observed_at_unix;if(!staticHardwareFields.has(field)&&Number.isFinite(sample)&&clock()-sample>maxAge)expired.push(sample+maxAge);}
  }
  const collector=status?.display_cache?.collectors?.hardware,hardwareAt=status?.hardware_observed_at_unix??collector?.observed_at_unix;
  if(Number.isFinite(hardwareAt)&&clock()-hardwareAt>(Number(hw?.max_age_seconds)||120))expired.push(hardwareAt+(Number(hw?.max_age_seconds)||120));
  add('hardware','硬件状态',collector||hw,expired.length?Math.min(...expired):undefined);
 }
 const authoritySource=status?.display_cache?.collectors?.authorization;
 for(const [key,label] of [['personal_data','个人资料开关状态'],['unrestricted','无限制授权状态']]){const g=status?.[key],at=authorizationTime(g),expired=Number.isFinite(at)&&clock()-at>120?at+120:undefined;if(!authorizationFresh(g)||!g?.state||['unknown','unavailable'].includes(g.state))add(key,label,Number.isFinite(g?.observed_at_unix)?g:authoritySource||g,expired);}
 const screenAt=windowsTime();if(!windowsFresh()||!['locked','unlocked','no_session'].includes(status?.host?.screen_state))add('windows','锁屏状态',status?.host?.sources?.screen_state||status?.host,Number.isFinite(screenAt)&&clock()-screenAt>120?screenAt+120:undefined);
 for(const key of lampReads.keys())if(!active.has(key))lampReads.delete(key);
 saveLampReads();return gaps;
}
function backupLamp(x){
 const at=timestamp(x.last_success_at),age=clock()-at;
 if(Number.isFinite(at)&&lampPolicy.backupErrorAge[x.cadence]&&age>lampPolicy.backupErrorAge[x.cadence])return 'error';
 if(Number.isFinite(at)&&lampPolicy.backupWarnAge[x.cadence]&&age>lampPolicy.backupWarnAge[x.cadence])return 'warn';
 return 'ok';
}
function diskLamp(x){
 if(x.connected===false||x.connected?.value===false)return 'ok';
 const free=numeric(x.free_bytes),total=numeric(x.total_bytes),drive=x.letter?.value??x.letter??x.drive;
 if(free===null||!total)return 'ok';
 if(free/total<lampPolicy.diskErrorFraction||String(drive).toUpperCase()==='C:'&&free<lampPolicy.systemDiskMinBytes)return 'error';
 return free/total<lampPolicy.diskWarnFraction?'warn':'ok';
}
function summary(){
 if(!online())return {text:offline(status?.observed_at_unix||lastRead),state:'unknown'};
 const gaps=readGaps(),tasks=(list('automation')||[]).filter(taskInLamp),backups=(list('backups')||[]).filter(taskInLamp),disks=(status?.hardware?.volumes||[]).map(diskLamp);
 const errors=[],warnings=[];
 for(const x of tasks)if(['failed','error'].includes(x.state)){const count=failureCount(x);if(count>=lampPolicy.taskErrorFailures)errors.push(name(x)+'连续失败 '+count+' 次');else if(count>=lampPolicy.taskWarnFailures)warnings.push(name(x)+'连续失败 '+count+' 次');}
 for(const x of backups){const lamp=backupLamp(x);if(lamp==='error')errors.push(name(x)+'超过两个备份周期没成功');else if(lamp==='warn')warnings.push(name(x)+'备份超期');}
 if(disks.includes('error'))errors.push('磁盘空间不足，需要马上处理');else if(disks.includes('warn'))warnings.push('磁盘剩余空间不足 10%');
 const business={state:errors.length?'error':warnings.length?'warn':'ok',text:errors.length?errors.join('，'):warnings.length?warnings.join('，'):'都正常'};
 if(!gaps.length){lastCompleteLamp=business;saveLampReads();const count=pendingRows().filter(x=>!x.empty).length;return business.state==='ok'&&count?{text:'灯况正常，有 '+count+' 件事待处理',state:'ok'}:business;}
 if(gaps.some(x=>x.overGrace))return business.state==='error'?{...business,text:business.text+'；还有状态读不到超过 10 分钟'}:{text:'有状态读不到超过 10 分钟，请查看要我处理的事',state:'warn'};
 const rank={ok:0,warn:1,error:2};
 const held=lastCompleteLamp&&rank[lastCompleteLamp.state]>rank[business.state]?lastCompleteLamp:business;
 return {state:held.state,text:held.state==='ok'?'电脑在线，有状态正在确认（10 分钟内先保持灯况）':held.text+'；还有状态正在确认'};
}

function rowText(rows,empty){return rows.length?rows: [{text:empty}];}

/* Today river cockpit count/group fix. */
function ranToday(x){
 const at=Date.parse(x.last_run_at),observed=blockTime(status?.automation)*1000;
 const captured=Number.isFinite(observed)?observed:Number(status?.observed_at_unix)*1000;
 const day=ms=>Math.floor((ms+28800000)/86400000);
 return x.enabled===true&&x.state!=='disabled'&&Number.isFinite(at)&&Number.isFinite(captured)&&at<=captured&&day(at)===day(captured);
}
function taskGroupName(id){
 const supplied=status?.automation?.groups?.find(g=>g.id===id)?.name;
 if(typeof supplied==='string'&&supplied.trim())return supplied;
 return ({backup:'备份',upkeep:'日常维护',remote:'远程和网络',ai:'AI 自动任务',daily:'日常任务',system:'系统任务',cloud:'云端任务',external:'其他软件的任务'})[id]||(/[\u3400-\u9fff]/.test(id||'')?id:'尚未提供中文组名');
}
/* End today river cockpit count/group fix. */

function inventoryRows(){
 const groups=list('backup_inventory');if(!groups)return [{text:'备份副本证据读不到'}];
 const protection={verified_copy:'副本已核实',unverified_copy:'副本还未核实',no_copy:'没有副本',unknown:'副本证据读不到',unavailable:'副本证据读不到',original:'原件'};
 const freshness={within_policy:'在登记期限内',overdue:'已超期',stale:'记录已过期',unknown:'新旧读不到',unavailable:'新旧读不到'};
 return groups.map(group=>({key:'inventory:'+group.id,text:group.name||'备份位置',children:(group.items||[]).map(x=>({key:x.id||name(x),text:name(x)+' · '+(x.role==='original'?'原件':protection[x.protection]||'副本状态读不到'),detail:[x.role==='original'?'此项是原件登记':freshness[x.freshness]||'新旧读不到',Number.isInteger(x.count)?x.count+' 项':'数量读不到',capacity(x.bytes),x.last_success_at?'最近成功 '+time(timestamp(x.last_success_at)):'最近成功时间读不到',x.next_run_at?'下次 '+time(timestamp(x.next_run_at)):''].filter(Boolean).join('；')}))}));
}
function cloudRows(){
 const rows=list('cloud');if(!rows)return [{text:'云端维护记录读不到'}];
 const labels={completed:'最近一次已完成',running:'正在处理',idle:'空闲',paused:'已暂停',failed:'出错',error:'出错',unknown:'读不到',unavailable:'读不到'};
 return rows.map(x=>({key:'cloud:'+x.id,text:name(x)+' · '+(labels[x.state]||'状态读不到'),detail:[x.provider==='google_drive'?'Google云盘':x.provider==='r2'?'云端存储':'云端',x.observed_at?'上次记录 '+time(timestamp(x.observed_at)):'记录时间读不到',x.inventory&&Number.isInteger(x.inventory.uploaded)&&Number.isInteger(x.inventory.total)?'登记库存累计 '+x.inventory.uploaded+'/'+x.inventory.total+' 项（不是本批进度）':'',x.plain?.stop,x.plain?.impact].filter(Boolean).join('；')}));
}

function taskRows(tasks,brief){

 const problematic=[],groups=new Map(),late=new Map();

 for(const x of tasks){const highlight=target?.id==='remote-control'&&['远程操作桌面','远程维护（管理员）','远程维护（系统级）'].includes(x.plain?.name)||target?.id==='sunshine-remote-streaming'&&x.project===target.api_project;const row={key:(x.project||'')+':'+name(x),highlight,text:name(x)+' · '+(taskNotConnected(x)?'运行记录未接入':x.state==='unknown'&&x.availability==='available'?'运行结果未确认':({failed:'出错',warn:'要留意',success:'正常',running:'在运行',disabled:'停用',unknown:'暂时读不到',never:'还没运行过',overdue:'过期'})[x.state]||'状态暂时读不到')+' · 上次 '+time(Date.parse(x.last_run_at)/1000)+' · 下次 '+time(Date.parse(x.next_run_at)/1000),detail:[x.plain?.what||'还没写说明',x.schedule_zh,x.plain?.stop,x.plain?.impact,x.plain?.status_note||x.status_note].filter(Boolean).join('；')};

 if(x.enabled!==false&&x.project!=='电脑上别的软件'&&['failed','warn','overdue','unknown'].includes(x.state)){problematic.push(row);continue;}

 const lateGroup=x.enabled===false?'停用的任务':x.project==='电脑上别的软件'?'电脑上别的软件':null,key=lateGroup||x.group||'尚未分组',bucket=lateGroup?late:groups;if(!bucket.has(key))bucket.set(key,[]);bucket.get(key).push(row);}

 return [{text:brief},...problematic,...[...groups,...late].map(([name,children])=>({key:'group:'+name,text:(late.has(name)?name:taskGroupName(name))+'（'+children.length+'）',children,open:children.some(x=>x.highlight)}))];

}

function pendingRows(){

 const tasks=list('automation'),backups=list('backups'),pending=list('pending'),out=[];

 for(const x of tasks||[])if(taskInLamp(x)){
  if(['failed','error'].includes(x.state)){const count=failureCount(x);out.push({text:name(x)+'：任务出错'+(count===null?'，连续失败次数暂未确认':'（连续 '+count+' 次）'),href:'#tasks'});}
  else if(taskNotConnected(x))out.push({text:name(x)+'：运行记录还没接入，不能确认运行结果',href:'#tasks'});
  else if(x.state==='unknown'&&x.availability==='available')out.push({text:name(x)+'：记录已读到，运行结果还不能确认',href:'#tasks'});
 }

 for(const x of backups||[])if(taskInLamp(x)&&(['failed','error','stale','warn'].includes(x.state)||backupLamp(x)!=='ok'))out.push({text:name(x)+'：'+(backupLamp(x)!=='ok'?'备份超期':({failed:'上次备份失败',error:'上次备份出错',stale:'备份记录已过期',warn:'备份要留意'})[x.state]),href:'#backups'});

 for(const x of status?.hardware?.volumes||[])if(diskLamp(x)!=='ok')out.push({text:reading(x.letter||x.drive)+' 剩余 '+capacity(x.free_bytes),href:'#pc'});

 for(const x of pending||[])if(x.who==='me'&&['pending','waiting_user','waiting'].includes(x.state))out.push({text:x.plain_title||x.title||'待本人验收',href:'#projects'});

 for(const x of list('projects')||[])if(x.frozen!==true){if(x.failed_count>0||['run_failed','acceptance_failed'].includes(x.overview))out.push({text:name(x)+'：有失败记录待核对',href:'#projects'});else if(!projectReadMissing(x)&&(['run_unknown','unknown'].includes(x.overview)||x.run_health==='unknown'))out.push({text:name(x)+'：运行结果还未确认，请查看未接入的任务记录',href:'#projects'});}
 for(const x of status?.remote_network?.items||[])if(x.id==='windows_update_restart'&&x.state==='pending')out.push({text:'Windows 更新：等待重启',href:'#remote'});
 for(const gap of readGaps())out.push({key:'read-gap:'+gap.key,text:gap.label+'暂时读不到；从 '+time(gap.since)+' 起'+(gap.overGrace?'，已经超过 10 分钟':'，10 分钟内先保持灯况'),href:gap.key.startsWith('hardware')?'#pc':gap.key.startsWith('backup')?'#backups':gap.key.startsWith('automation')?'#tasks':gap.key.startsWith('remote')?'#remote':['personal_data','unrestricted','windows'].includes(gap.key)?'#security':gap.key==='today'?'#today':'#projects'});

 return out.length?out:[{text:'没有要我处理的',empty:true}];

}

function liveValue(slot){

 if(slot==='ca-form'){

  const minutes=durationMinutes(hours),keys=combined?['personal_data','unrestricted']:[purpose],cool=status?.factor?.cooldown_until_unix;

  if(cool>clock())return {text:`验证暂不可用（冷却中）。请在 ${Math.ceil((cool-clock())/60)} 分钟后重试（${time(cool)}）。已有授权保持`,state:'warn'};

  if(!online())return {text:phase==='loading'?'正在连接电脑，读到状态后才能办理。':'当前读不到电脑，暂时不能办理。请确认电脑已开机联网，再刷新状态。',state:'unknown'};
  if(!formal)return {text:'当前打开的是本地预览，暂时不能办理。请在网站或电脑自己的授权页上办理。',state:'unknown'};
  if(!status?.state_version)return {text:'电脑还没有提供本次办理所需的状态，请刷新后再试。',state:'unknown'};
  if(status?.factor?.available!==true)return {text:'电脑上的验证器暂不可用，当前不能办理。已有授权保持。',state:'unknown'};

  return {text:'本次：'+keys.map(k=>k==='personal_data'?'个人资料':'无限制授权').join(' + ')+' · '+(minutes===null?'请填0.5～72小时':minutesLabel(minutes)),state:minutes===null?'warn':'ok'};

 }

 if(slot==='ca-toast')return {text:toast,state:toast?toastState:'closed',empty:!toast};

 if(slot==='ca-results'){
  const records=[grant,...actions].filter(Boolean),labels={succeeded:'已完成',failed:'未完成',pending:'等待处理',verifying:'正在验证',unknown:'结果尚未确认',partial:'部分完成',cancelled:'已取消',expired:'已到期'};
  if(!records.length)return {text:'',state:'closed',operation:true,empty:true};
  const rows=records.map(item=>({key:item.request_id,text:(({'personal-data':'个人资料锁定',unrestricted:'结束无限制授权',windows:'Windows锁屏'})[item.action]||'本次授权')+' · '+(labels[item.state]||'结果尚未确认'),detail:item.error?(errorMessages[item.error]||'电脑未提供这次错误的说明'):item.state==='unknown'?'请查询这次结果，确认后再办理下一次。':undefined}));
  return {rows,state:records.some(item=>item.state==='failed')?'error':records.some(item=>['pending','verifying','unknown','partial'].includes(item.state))?'warn':'closed',operation:true};
 }

 if(slot==='ca-form-hours'||slot==='ca-form-code')return {input:true};

 if(slot==='ca-connection')return {text:phase==='loading'?'正在连接主机 · 正在读取…':online()?'主机在线 · 读取完成 '+time(lastRead):(problem==='server'?'连接服务异常':'暂时无法连接电脑')+(lastRead?' · 上次读取 '+time(lastRead):' · 尚未读取'),state:online()?'ok':phase==='loading'?'loading':problem==='server'?'error':'unknown'};

 if(!online())return {text:phase==='loading'?'正在读取…':offline(),state:'unknown'};

 const host=status.host||{},hw=status.hardware||{},tasks=(list('automation')||[]).filter(x=>target?.lands_on!=='cockpit-tasks'||!target?.api_project||x.project===target.api_project),backups=list('backups')||[];

 const todayTasks=tasks.filter(ranToday),failed=todayTasks.filter(x=>x.state==='failed'),next=tasks.filter(x=>x.enabled===true&&Number.isFinite(Date.parse(x.next_run_at))).sort((a,b)=>Date.parse(a.next_run_at)-Date.parse(b.next_run_at))[0];

 const lastBackup=backups.filter(x=>Number.isFinite(Date.parse(x.last_success_at))).sort((a,b)=>Date.parse(b.last_success_at)-Date.parse(a.last_success_at))[0];

 if(slot==='mcp-secondary'){const peer=list('remote_network')?.find(x=>x.id==='secondary_laptop');return {text:peer?.state==='online'?'副机在线':peer?.state==='offline'?'副机不在线':'副机状态读不到',state:peer?.state==='online'?'ok':peer?.state==='offline'?'closed':'unknown'};}

 const taskBrief=`今天跑了 ${todayTasks.length} 个，出错 ${failed.length} 个`+(next?'；下一个 '+name(next)+' '+time(Date.parse(next.next_run_at)/1000):'；下次运行暂时未知');

 if(slot==='cockpit-overall')return summary();

 if(slot==='cockpit-quick-1'||slot==='mcp-main')return {text:'电脑在线 · 已开机 '+(Number.isFinite(host.uptime_seconds)?minutesLabel(Math.floor(host.uptime_seconds/60)):'时长未知'),state:'ok'};

 if(slot==='cockpit-quick-2'||slot==='ca-personal-data'||slot==='cockpit-security')return {text:stateLabel(status.personal_data,'personal_data'),state:grantState(status.personal_data)};

 if(slot==='cockpit-quick-3'||slot==='ca-unrestricted'||slot==='cockpit-security-unrestricted')return {text:stateLabel(status.unrestricted,'unrestricted'),state:grantState(status.unrestricted)};

 if(slot==='cockpit-quick-4')return {text:list('automation')?taskBrief:'自动任务暂时读不到',state:rowState(list('automation'))};

 if(slot==='cockpit-quick-5')return {text:lastBackup?name(lastBackup)+' 最近成功 '+time(Date.parse(lastBackup.last_success_at)/1000):'最近成功的备份暂时未知',state:rowState(list('backups'))};

 if(slot==='ca-windows'||slot==='cockpit-security-windows'){if(!windowsFresh())return {text:'锁屏状态读不到',state:'unknown'};return {text:(({locked:'已锁屏',unlocked:'未锁屏',no_session:'没人登录'})[host.screen_state]||'读不到'),state:host.screen_state==='unlocked'?'ok':['locked','no_session'].includes(host.screen_state)?'closed':'unknown'};}

 if(slot==='mcp-grants')return {rows:[{text:'个人资料：'+stateLabel(status.personal_data),state:grantState(status.personal_data)},{text:'无限制授权：'+stateLabel(status.unrestricted),state:grantState(status.unrestricted)}],state:authorizationFresh()?'ok':'unknown'};

 if(slot==='cockpit-attention')return {rows:pendingRows(),state:summary().state};

 if(slot==='cockpit-remote'){
  const rows=list('remote_network');if(!rows)return {text:status?.remote_network?.collection_state==='reading'?'正在读取远程和网络':'远程和网络读不到',state:'unknown'};
  const labels={tailscale:'远程网络',secondary_laptop:'副机',sunshine:'串流服务',system_proxy:'系统代理',internet:'互联网连接',windows_update_restart:'Windows重启'};
  const states={online:'在线',offline:'不在线',running:'在运行',stopped:'已停止',enabled:'已开启',disabled:'已关闭',ok:'连接正常',not_pending:'没有待重启',pending:'需要重启',unknown:'读不到',unavailable:'读不到',stale:'读数已过期'};
  return {text:'电脑连接服务：在线',rows:rows.map(x=>({key:x.id,text:(labels[x.id]||name(x))+'：'+(states[x.state]||'状态读不到'),state:['unknown','unavailable','stale'].includes(x.state)?'unknown':['offline','stopped','pending'].includes(x.state)?'warn':'ok',detail:'北京时间 '+time(timestamp(x.observed_at))+' 读的',highlight:target?.id==='sunshine-remote-streaming'&&x.id==='sunshine'})),state:rows.some(x=>['unknown','unavailable','stale'].includes(x.state))?'unknown':rows.some(x=>['offline','stopped','pending'].includes(x.state))?'warn':'ok'};
 }

 if(slot==='cockpit-grafana'){

  const g=status.grafana||status.services?.grafana,publicUrl=g?.public_dashboard_url||g?.public_panel_url||g?.public_url;
  // PCConfig returns public_url only after the anonymous dashboard API works.
  // Its state/url describe the separate /login probe, so that probe may fail
  // while the independently verified public dashboard remains available.
  const currentPublicRoute=g?.public_dashboard_state==null&&/^https:\/\/grafana\.wly0829\.cn\/public-dashboards\/[a-f0-9]{32}\/?(?:\?theme=(?:light|dark))?$/i.test(g?.public_url||'');

  if((g?.public_dashboard_state==='reachable'||currentPublicRoute)&&/^https:\/\//.test(publicUrl||'')&&!/\/login(?:[/?#]|$)/.test(publicUrl))return {iframe:publicUrl,state:'ok'};

  if(g?.state==='reachable'&&g.url==='https://grafana.wly0829.cn/')return {text:'监控网页已响应 · 打开图表网页',href:g.url,state:'ok'};

  return {text:'曲线暂时打不开',state:'unknown'};

 }

 if(slot==='cockpit-pc'&&(!status.hardware||['unavailable','unknown'].includes(status.hardware.state)||status.display_cache?.collectors?.hardware?.state==='reading'&&!hardwareSnapshot(status)))return {text:status.display_cache?.collectors?.hardware?.state==='reading'?'硬件正在读取':'硬件状态暂时读不到',state:'unknown'};

 if(slot==='cockpit-pc')return {hardwareDisplay:hardwareSnapshot(status),cacheable:!!hardwareSnapshot(status),rows:[{text:'处理器：'+reading(hw.cpu?.model)+' · '+reading(hw.cpu?.usage_percent,'%')+' · '+reading(hw.cpu?.temperature_celsius,'℃')+' · '+reading(hw.cpu?.power_watts,'W')},...(hw.gpus||[]).map(g=>({text:'显卡：'+reading(g.model)+' · '+reading(g.usage_percent,'%')+' · '+reading(g.temperature_celsius,'℃')+' · 显存 '+capacity(g.vram_used_bytes)+' / '+capacity(g.vram_total_bytes)})),{text:'内存：'+capacity(hw.memory?.used_bytes)+' / '+capacity(hw.memory?.total_bytes)},...(hw.volumes||[]).map(v=>({text:reading(v.letter||v.drive||'磁盘').replace(/:+$/,'')+'：'+(v.connected===false?'没接上':capacity(v.free_bytes)+' / '+capacity(v.total_bytes))})),{text:'网络：'+networkConnection(hw.network)+' · 下行 '+rate(hw.network?.download_bytes_per_second)+' · 上行 '+rate(hw.network?.upload_bytes_per_second)},{text:'屏幕：'+reading(hw.display?.width_px)+' × '+reading(hw.display?.height_px)+' · '+reading(hw.display?.refresh_hz,'Hz')}],state:hardwareHealth()==='ok'?'ok':'unknown'};

 if(slot==='cockpit-tasks'&&!list('automation'))return {text:'自动任务暂时读不到',state:'unknown'};

 if(slot==='cockpit-tasks')return {rows:taskRows(tasks,taskBrief),state:rowState(list('automation'))};

 if(slot==='cockpit-backups'&&!list('backups'))return {text:'备份暂时读不到',state:'unknown'};

 if(slot==='cockpit-backups')return {rows:[...rowText(backups.map(x=>({key:(x.project||'')+':'+name(x),highlight:!!target?.api_project&&x.project===target.api_project,text:name(x)+' · '+stateText(x.state)+' · 最近成功 '+time(Date.parse(x.last_success_at)/1000),state:rowState([x]),detail:[x.plain?.what,x.destination,x.scope_note,cadenceText(x.cadence)].filter(Boolean).join('；')})),'当前没有登记的备份'),{key:'inventory',text:'副本和保存位置',children:inventoryRows().flatMap(group=>group.children?.length?group.children.map(row=>({...row,text:group.text+' · '+row.text})):[group])},{key:'cloud',text:'云端维护',children:cloudRows()}],state:rowState(backups)};

 if(slot==='cockpit-projects'){

  if(target?.id==='learning')return {rows:[{text:'学习进度不放驾驶舱，在学习方法页看',href:'/projects/learning/'}],state:'ok'};

  if(!list('projects'))return {text:'项目状态暂时读不到',state:'unknown'};

  const rows=(list('projects')||[]).filter(x=>x.frozen!==true&&(x.waiting_user_count>0||x.waiting_ai_count>0||x.on_hold_count>0||x.failed_count>0||['run_failed','acceptance_failed','run_overdue','run_unknown'].includes(x.overview))).map(x=>({key:x.project||x.title,highlight:!!target?.api_project&&x.project===target.api_project,open:target?.id==='pending',detail:(list('pending')||[]).filter(p=>p.project===x.project).map(p=>(p.plain_title||'条目标题读不到')+' · '+({me:'我',ai:'AI'})[p.who]+' · '+(p.when||'核验时机读不到')).join('；'),text:(x.project||x.title)+'：'+(x.health_reason||'有事项待处理'),href:x.website_url&&/^https:\/\/wly0829.cn\//.test(x.website_url)?x.website_url:null}));

  return {rows:rowText(rows,'项目都正常，没有等验收的'),state:projectHealth()};

 }

 if(slot==='cockpit-today'){

  if(!list('today'))return {text:'今天动态暂时读不到',state:'unknown'};

  const seen=new Set(),labels={system_backup_started:'系统镜像备份开始',system_backup_completed:'系统镜像备份完成',computer_reboot_completed:'电脑重启完成',stutter_captured:'电脑卡住，已自动留下现场'};

  const rows=(list('today')||[]).filter(x=>x.id&&!seen.has(x.id)&&seen.add(x.id)).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)).map(x=>({text:time(Date.parse(x.at)/1000)+' · '+(labels[x.type]||(x.type==='task_completed'?(tasks.find(t=>t.id===x.task_id)?.plain?.name||'任务')+'完成':x.type==='task_failed'?(tasks.find(t=>t.id===x.task_id)?.plain?.name||'任务')+'出错':x.type==='acceptance_checked'?'核对了 '+known(x.count)+' 项，'+(x.passed===x.count?'都通过':'通过 '+known(x.passed)+' 项'):x.plain_title||'事件详情暂未提供'))}));

  return {rows:rowText(rows,'今天还没有动态'),state:'ok'};

 }

 return {text:'还没接上',state:'unknown'};

}

const slotKeys={
 'cockpit-quick-4':['automation'],'cockpit-quick-5':['backups'],'cockpit-tasks':['automation'],
 'cockpit-backups':['backups','backup_inventory','cloud'],'cockpit-projects':['projects'],'cockpit-today':['today'],'cockpit-remote':['remote_network'],
 'cockpit-attention':['automation','backups','projects','pending','hardware'],'cockpit-pc':['hardware'],
 'cockpit-grafana':['grafana'],'cockpit-overall':['automation','backups','projects','pending','today','hardware']
};
function slotHealth(slot){const keys=slotKeys[slot];if(!keys)return clock()-lastRead<=120?'ok':'stale';const states=keys.map(k=>k==='hardware'?hardwareHealth():k==='grafana'?(()=>{const g=status?.grafana||status?.services?.grafana,at=grafanaTime();return g&&Number.isFinite(at)&&at>0&&at<=clock()+(Object.hasOwn(g,'public_dashboard_checked_at')?0:60)&&clock()-at<=(Number(g.max_age_seconds)||300)?'ok':'stale';})():blockHealth(k));return states.includes('error')?'error':states.includes('unknown')?'unknown':states.includes('stale')?'stale':'ok';}
function slotTime(slot){
 if(slot==='cockpit-grafana')return grafanaTime();
 const authorityKey=({'ca-personal-data':'personal_data','cockpit-security':'personal_data','cockpit-quick-2':'personal_data','ca-unrestricted':'unrestricted','cockpit-security-unrestricted':'unrestricted','cockpit-quick-3':'unrestricted'})[slot];
 if(authorityKey)return authorizationTime(status?.[authorityKey]);
 if(slot==='ca-windows'||slot==='cockpit-security-windows')return windowsTime();
 const times=(slotKeys[slot]||[]).map(k=>k==='hardware'?(status?.hardware_observed_at_unix??status?.display_cache?.collectors?.hardware?.observed_at_unix??Math.min(...[status?.hardware?.cpu,status?.hardware?.memory,status?.hardware?.network,status?.hardware?.display,...(status?.hardware?.gpus||[])].map(blockTime).filter(Number.isFinite))):blockTime(status?.[k]));return times.filter(t=>Number.isFinite(t)&&t>0).length?Math.min(...times.filter(t=>Number.isFinite(t)&&t>0)):authorizationTime();
}
function expiredValue(result,at){const note='数据已过期 · 上次读到 '+time(at);return {...result,text:result.rows||result.iframe?result.text:result.text+'\n'+note,notice:result.rows||result.iframe?note:null,state:'unknown',cacheable:false,cached:true};}
function value(slot){
 const result=liveValue(slot);if(data.kind!=='cockpit'||!slot.startsWith('cockpit-')||!online())return result;
 const health=slotHealth(slot);
 // Grafana has a 300-second check interval; the general dashboard blocks use
 // 120 seconds. Do not turn a still-current live iframe into historical data.
 if(slot==='cockpit-grafana')return health==='ok'?result:{text:'曲线暂时打不开',state:'unknown',cached:false};
 if((health==='stale'||(slotKeys[slot]||[]).some(key=>key!=='hardware'&&blockHealth(key)==='stale'))&&slot!=='cockpit-overall'&&slot!=='cockpit-attention'){
  historical=true;let old;try{old=liveValue(slot);}finally{historical=false;}
  if(old.rows||old.iframe||old.state!=='unknown')return {...expiredValue(old,slotTime(slot)),cacheable:slot==='cockpit-pc'&&!!old.rows};
 }
 if(health!=='ok'&&['error','warn'].includes(result.state))return {...result,text:result.text?result.text+' · 还有状态暂时读不到':result.text};
 if(slot==='cockpit-pc'&&health==='unknown'&&result.rows){const hw=status?.hardware||{},known=v=>{const raw=v&&typeof v==='object'&&Object.hasOwn(v,'value')?v.value:v;return raw!==null&&raw!==undefined&&raw!==''&&!['unknown','unavailable','error','failed','stale'].includes(v?.state);};const readings=[hw.cpu?.model,hw.cpu?.usage_percent,hw.memory?.used_bytes,hw.network?.connected,hw.display?.width_px,...(hw.gpus||[]).flatMap(g=>[g.model,g.usage_percent]),...(hw.volumes||[]).flatMap(v=>[v.letter,v.free_bytes])];return {...result,cacheable:readings.some(known)};}
 return result;
}
function syncChildren(parent,desired){
 const old=[...parent.childNodes],used=new Set();
 for(let i=0;i<desired.length;i++){
  const wanted=desired[i],key=wanted.nodeType===1?wanted.dataset.rowKey:null;
  let node=key?old.find(x=>!used.has(x)&&x.nodeType===1&&x.dataset.rowKey===key):old[i];
  if(!node||used.has(node)||node.nodeType!==wanted.nodeType||node.nodeName!==wanted.nodeName)node=wanted;
  else if(node.nodeType===3){if(node.nodeValue!==wanted.nodeValue)node.nodeValue=wanted.nodeValue;}
  else if(node.nodeType===1){
   for(const attr of [...node.attributes])if(attr.name!=='open'&&!wanted.hasAttribute(attr.name))node.removeAttribute(attr.name);
   for(const attr of [...wanted.attributes])if(attr.name!=='open'&&node.getAttribute(attr.name)!==attr.value)node.setAttribute(attr.name,attr.value);
   if(wanted.onclick)node.onclick=wanted.onclick;
   syncChildren(node,[...wanted.childNodes]);
  }
  used.add(node);if(parent.childNodes[i]!==node)parent.insertBefore(node,parent.childNodes[i]||null);
 }
 for(const node of [...parent.childNodes])if(!used.has(node))node.remove();
}
const liveTitles={'cockpit-overall':'这台电脑现在','cockpit-attention':'要我处理的事','cockpit-quick-1':'电脑在线','cockpit-quick-2':'个人资料','cockpit-quick-3':'无限制授权','cockpit-quick-4':'自动任务','cockpit-quick-5':'最近备份','cockpit-remote':'远程和网络','cockpit-grafana':'近24小时曲线','cockpit-tasks':'自动任务','cockpit-backups':'备份和云端','cockpit-security':'个人资料','cockpit-security-unrestricted':'无限制授权','cockpit-security-windows':'Windows锁屏','cockpit-projects':'项目状态','cockpit-today':'今天的动态','ca-personal-data':'个人资料','ca-unrestricted':'无限制授权','ca-windows':'Windows锁屏','ca-connection':'电脑连接','ca-form':'本次办理','ca-toast':'操作提示','ca-results':'办理结果','mcp-main':'主机','mcp-secondary':'副机','mcp-grants':'主机授权'};
function rectStyle(el,r){el._sourceRect=r;Object.assign(el.style,{position:'absolute',left:r[0]*100+'%',top:r[1]*100+'%',width:r[2]*100+'%',height:r[3]*100+'%',pointerEvents:'auto'});}

function liveGroup(section,cells,className,padding=.012){
 const top=Math.max(0,Math.min(...cells.map(cell=>cell.rect[1]))-padding),bottom=Math.min(1,Math.max(...cells.map(cell=>cell.rect[1]+cell.rect[3]))+padding);
 const group=document.createElement('div');group.className='b2-live-group '+className;group.dataset.rowKey=className;
 const main=document.createElement('div'),quick=document.createElement('div');main.className='b2-overview-main';quick.className='b2-live-group-grid';
 for(const cell of cells){Object.assign(cell.node.style,{position:'relative',left:'auto',top:'auto',width:'100%',height:'auto'});if(cell.livePart==='lamp'){cell.node.classList.add('b2-overview-lamp');main.prepend(cell.node);}else if(cell.livePart==='summary')main.append(cell.node);else quick.append(cell.node);}
 if(main.childNodes.length)group.append(main);if(quick.childNodes.length)group.append(quick);
 section.querySelector('.overlays').append(group);
 return {node:group,rect:[.02,top,.96,bottom-top],maskRect:[.02,top,.96,bottom-top],forceOverlay:true,members:cells,groupPadding:padding};
}

function mount(){
 if(todayRiverHost)document.querySelector('[data-screen="cockpit-01"]')?.after(todayRiverHost);

 for(const section of document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part:not([hidden])')){

  const layout=section._layout;if(!layout)continue;
  const screenId=section.dataset.screen||section.closest('[data-screen]')?.dataset.screen;

  document.querySelector(`.live-strip[data-screen="${section.dataset.screen}"]`)?.remove();

  for(const old of section.querySelectorAll('.b2-native'))old.remove();

  const liveCells=[];

  for(const cell of layout.native_live||layout.live||[]){

   const node=document.createElement(cell.slot==='ca-form-hours'||cell.slot==='ca-form-code'?'input':'div');node.className='b2-native b2-slot';node.dataset.b2Slot=cell.slot;node.dataset.livePart=cell.live_part||'';node.dataset.hotId=cell.hot_id||'';node.dataset.typesetKind='live';node.setAttribute('role',node.tagName==='INPUT'?'textbox':'status');rectStyle(node,cell.rect);

   if(node.tagName==='INPUT'){

    const duration=cell.slot==='ca-form-hours';node.type='text';node.inputMode=duration?'decimal':'numeric';node.autocomplete='off';node.setAttribute('aria-label',duration?'授权时长（小时）':'6位动态验证码');node.value=duration?hours:code;if(!duration){node.maxLength=6;node.pattern='[0-9]{6}';}

    node.addEventListener('input',()=>{if(duration){hoursTouched=true;hours=node.value;}else{code=node.value.replace(/\D/g,'').slice(0,6);node.value=code;}render();});

   }

   section.querySelector('.overlays').append(node);
   if(node.tagName!=='INPUT'&&cell.live_part!=='lamp')node.classList.add('b2-ui-slot');
   if(cell.slot==='ca-connection')node.classList.add('b2-connection-chip');
   liveCells.push({node,rect:cell.rect,maskRect:cell.mask_rect,livePart:cell.live_part,slot:cell.slot,collapseWhenEmpty:['ca-toast','ca-results'].includes(cell.slot),compactFrame:cell.slot==='cockpit-grafana'});

  }

  for(const entry of layout.native_actions||[]){const button=document.createElement('button');button.className='b2-native b2-image-action';button.type='button';button.dataset.b2Action=entry.action;button.dataset.baseLabel=entry.text;button.textContent=entry.text;button.dataset.hotId=entry.hot_id||'';button.dataset.typesetKind='button';button.setAttribute('aria-label',entry.text);button.title=entry.text;rectStyle(button,entry.rect);button.onclick=()=>{if(entry.copy_text){navigator.clipboard.writeText(entry.copy_text).then(()=>message('已复制。','ok')).catch(()=>message('未能写入剪贴板，请检查浏览器剪贴板权限。','error'));}else action(entry.action);};section.querySelector('.overlays').append(button);}
  let flowCells=liveCells.filter(cell=>cell.node.tagName!=='INPUT'&&cell.slot!=='ca-connection');
  if(screenId==='cockpit-01'){
   const overview=flowCells.filter(cell=>cell.slot==='cockpit-overall'||cell.slot.startsWith('cockpit-quick-'));
   if(overview.length){flowCells=flowCells.filter(cell=>!overview.includes(cell));flowCells.push(liveGroup(section,overview,'b2-overview-group'));}
  }else if(screenId==='cockpit-02'){for(const cell of flowCells)if(cell.slot==='cockpit-pc'){cell.forceOverlay=true;cell.flowRow=true;}}
  else if(screenId==='mcp-01'&&flowCells.length){if(layout.compact_live===true){for(const cell of flowCells)cell.compactFrame=true;}else flowCells=[liveGroup(section,flowCells,'b2-mcp-group',.035)];}
  else if(screenId==='computer-access-01'){
   const grants=flowCells.filter(cell=>['ca-personal-data','ca-unrestricted','ca-windows'].includes(cell.slot));
   if(grants.length>1&&Math.max(...grants.map(cell=>cell.rect[1]))-Math.min(...grants.map(cell=>cell.rect[1]))<.02){flowCells=flowCells.filter(cell=>!grants.includes(cell));const group=liveGroup(section,grants,'b2-authority-group');group.flowRow=true;flowCells.push(group);}
   else for(const cell of grants){cell.forceOverlay=true;cell.flowRow=true;}
  }
  window.TypesetLiveFlow?.apply(section,flowCells);

 }

 if(data.kind==='computer-access'&&!document.querySelector('[data-b2-hardware-summary]')){const summary=document.createElement('div');summary.dataset.b2HardwareSummary='true';summary.className='b2-hardware-summary';document.querySelector('[data-screen="computer-access-01"]')?.after(summary);}

 render();

 if(todayRiverHost){document.querySelector('.b2-overview-main')?.after(todayRiverHost);todayRiverHost.style.pointerEvents='auto';}

}

function render(){
 if(online())for(const key of Object.keys(grafanaGroupTitles)){const row=grafanaGroupRow(key);if(row.iframe)lastGrafanaGroups.set(key,row);}

 if(typeof globalToast!=='undefined'&&globalToast._rendered!==JSON.stringify([toast,toastState])){globalToast._rendered=JSON.stringify([toast,toastState]);globalToast.hidden=!toast;globalToast.textContent=toast;globalToast.dataset.state=toastState;if(toast){const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','关闭提示');close.onclick=()=>{toast='';clearTimeout(toastTimer);render();};globalToast.append(close);}}
 const widths=new Map([...document.querySelectorAll('[data-b2-slot]')].map(el=>el.closest('.typeset-part')||el.closest('.screen')).filter(Boolean).map(section=>[section,section.clientWidth]));

 for(const el of document.querySelectorAll('[data-b2-slot]')){

  const slot=el.dataset.b2Slot,valueRow=value(slot);
  const grouped=slot==='cockpit-grafana'&&Object.hasOwn(grafanaGroupTitles,el.dataset.livePart),cachedGroup=lastGrafanaGroups.get(el.dataset.livePart),displayRow=grouped?(phase==='error'&&cachedGroup?{...cachedGroup,state:'unknown',cached:true,retained:true,notice:Math.max(0,Math.floor((clock()-cachedGroup.readAt)/60))+' 分钟前读到 · 当前状态未知',cachedAt:cachedGroup.readAt*1000}:grafanaGroupValue(el.dataset.livePart)):valueRow;
  const section=(el.closest('.typeset-part')||el.closest('.screen')),layout=section._layout,font=el.classList.contains('b2-ui-slot')?16:Math.max(11,Math.min(18,widths.get(section)/layout.size[0]*30));
  const signature=JSON.stringify([displayRow,slotTime(slot),font,target?.id,online(),phase,lastContact()]);
  if(el.tagName!=='INPUT'&&el._rendered===signature)continue;
  el._rendered=signature;
  el.dataset.state=displayRow.state||'unknown';
  if(grouped&&!displayRow.retained){el.dataset.cached='false';delete el.dataset.lastReadAt;el.dataset.grafanaEmptyReason=displayRow.emptyReason||'';}

  el.style.fontSize=font+'px';
  el.hidden=displayRow.empty===true;el.dataset.optionalEmpty=String(el.hidden);
  if(el.hidden){el.replaceChildren();window.TypesetLiveFlow?.request(section);continue;}

  if(el.tagName==='INPUT'){el.disabled=busy||!formal||!online()||!status?.state_version||status?.factor?.available!==true||status?.factor?.cooldown_until_unix>clock()||!!grant&&grantResultNeedsQuery(grant);if(document.activeElement!==el)el.value=slot==='ca-form-hours'?hours:code;continue;}

  if(slot==='ca-connection'){
   const dot=document.createElement('i'),label=document.createElement('strong'),stamp=document.createElement('small');dot.className='live-status-dot';dot.style.position='static';label.style.gridColumn='2';label.textContent=online()?'电脑在线':phase==='loading'?'正在连接':lastRead?'连接暂时中断':'读不到电脑';stamp.textContent=lastRead&&phase==='error'?Math.max(0,Math.floor((clock()-lastRead)/60))+' 分钟前读到':lastContact()?'上次 '+time(lastContact()):'还没读到过';syncChildren(el,[dot,label,stamp]);continue;
  }

  const content=document.createElement('div');

  if(target?.lands_on==='cockpit-tasks'&&slot==='cockpit-tasks'&&target.api_project){const filter=document.createElement('button');filter.type='button';filter.className='b2-filter';filter.textContent='只看：'+target.site_title+' · 看全部';filter.onclick=()=>{target=null;history.replaceState(null,'',location.pathname+location.search+'#tasks');render();};content.append(filter);}

  if(slot==='cockpit-pc'&&window.LiveHardwareUI){const displayed=displayRow.hardwareCached?{...status,hardware:displayRow.hardwareDisplay?.hardware,hardware_observed_at_unix:displayRow.hardwareDisplay?.hardware_observed_at_unix}:online()?status:displayRow.hardwareDisplay;content.append(window.LiveHardwareUI.render(document,displayed,{mode:'full',cached:!online(),hardwareCached:displayRow.hardwareCached===true,at:displayRow.cachedAt?displayRow.cachedAt/1000:slotTime(slot)}));}

  else if(displayRow.iframe){const note=document.createElement('p');note.className='b2-chart-loading-note';note.textContent='公开曲线会在下方加载，首次打开可能稍慢。';const frame=document.createElement('iframe');frame.src=displayRow.iframe;frame.title=grouped?displayRow.title:'近24小时硬件曲线';frame.loading='lazy';frame.className='b2-grafana-frame';content.append(note,frame);}

  else if(displayRow.rows)for(const row of displayRow.rows){if(row.children){const group=document.createElement('details');group.dataset.rowKey=row.key||row.text;group.open=row.open===true;const title=document.createElement('summary');title.textContent=row.text;group.append(title);for(const child of row.children){const detail=document.createElement('details');detail.dataset.rowKey=child.key||child.text;detail.open=child.highlight===true;if(child.highlight)detail.dataset.highlight='true';const title=document.createElement('summary');title.textContent=child.text;const p=document.createElement('p');p.textContent=child.detail;detail.append(title,p);group.append(detail);}content.append(group);continue;}const item=document.createElement(row.detail?'details':row.href?'a':'p');item.dataset.rowKey=row.key||row.text;if(row.detail){item.open=row.open===true||row.highlight===true;const summary=document.createElement('summary');summary.textContent=row.text;const description=document.createElement('p');description.textContent=row.detail;item.append(summary,description);}else{item.textContent=row.text;if(row.href)item.href=row.href;}if(row.state)item.dataset.state=row.state;if(row.highlight)item.dataset.highlight='true';content.append(item);}

  else if(el.dataset.livePart==='lamp'){el.setAttribute('aria-label',displayRow.text||'状态未知');el.classList.add('typeset-lamp');}else content.textContent=displayRow.text;

  if(displayRow.notice){const notice=document.createElement('p');notice.className='b2-history-notice';notice.textContent=displayRow.notice;content.append(notice);}
  if(el.classList.contains('b2-ui-slot')&&slot!=='cockpit-pc'&&window.LiveStatusUI){
   const headline=displayRow.text||displayRow.rows?.[0]?.text||(displayRow.iframe?'可查看近24小时硬件曲线':'此项读不到');
   const card=window.LiveStatusUI.render(document,{...displayRow,text:headline,readAt:grouped?displayRow.readAt:displayRow.cachedAt?displayRow.cachedAt/1000:slotTime(slot)},{title:grouped?displayRow.title:liveTitles[slot]||'当前状态',slot,icons:data.shared?.live_status_icons});
   if(displayRow.operation||displayRow.planned){card.querySelector('.live-status-meta')?.remove();card.title=(grouped?displayRow.title:liveTitles[slot]||'办理结果')+'：'+headline;}
   if(displayRow.rows||displayRow.iframe){if(displayRow.rows)card.querySelector('.live-status-value')?.remove();const list=document.createElement('div');list.className='b2-card-list';list.dataset.rowKey='rows:'+slot;list.append(...content.childNodes);card.insertBefore(list,card.querySelector('.live-status-meta'));}
   else content.replaceChildren();
   content.replaceChildren(card);
  }
  syncChildren(el,[...content.childNodes]);el.dataset.cached=String(!!displayRow.cached);
  window.TypesetLiveFlow?.request(section);
 }

 for(const b of document.querySelectorAll('[data-b2-action]')){

  const a=b.dataset.b2Action,requiresAuthority=!['refresh','results','query','host-query','copy-note','copy-address'].includes(a);let disabled=busy||(requiresAuthority&&(!formal||!online()||!status?.state_version));

  if(a==='submit'&&grant&&grantResultNeedsQuery(grant)){b.textContent=busy?'正在查询…':'查询本次结果';b.setAttribute('aria-label','查询本次结果');b.disabled=busy;continue;}

  if(a==='submit'){b.textContent=combined?'验证并办理两项':purpose==='personal_data'?(remainingMinutes(status?.personal_data,clock())>0?'验证并延长资料授权':'验证并解锁资料'):(remainingMinutes(status?.unrestricted,clock())>0?'验证并延长无限制授权':'验证并开启无限制授权');b.setAttribute('aria-label',b.textContent);const minutes=durationMinutes(hours),keys=combined?['personal_data','unrestricted']:[purpose];disabled||=minutes===null||!/^\d{6}$/.test(code)||status?.factor?.available!==true||status.factor.cooldown_until_unix>clock()||keys.some(k=>(remainingMinutes(status?.[k],clock())||0)+minutes>4320)||!!grant&&grantResultNeedsQuery(grant);}

  if(a.startsWith('choose-'))disabled||=status?.factor?.available!==true||status?.factor?.cooldown_until_unix>clock();

  if(a.startsWith('lock-')){const kind=a.slice(5),field=kind==='windows'?'lock_windows':kind==='personal-data'?'lock_data':'end_unrestricted';disabled||=status?.public_actions?.[field]!==true||(kind==='personal-data'&&!canEndGrant(status?.personal_data,clock()))||(kind==='unrestricted'&&!canEndGrant(status?.unrestricted,clock()))||(kind==='windows'&&status?.host?.screen_state!=='unlocked')||actions.some(x=>x.action===kind&&unresolvedAction(x));}

  b.disabled=disabled;b.dataset.labelChanging=String(!!b.textContent&&b.textContent!==b.dataset.baseLabel);if(['combined','save-default'].includes(a))b.setAttribute('aria-pressed',String(a==='combined'?combined:saveDefault));if(a.startsWith('purpose-'))b.setAttribute('aria-pressed',String(a==='purpose-'+purpose));b.dataset.selected=a==='combined'?String(combined):a==='save-default'?String(saveDefault):a==='purpose-'+purpose?'true':'false';

 }

 const hardwareSummary=document.querySelector('[data-b2-hardware-summary]');if(hardwareSummary&&window.LiveHardwareUI){const old=value('cockpit-pc'),displayed=old.hardwareCached?{...status,hardware:old.hardwareDisplay?.hardware,hardware_observed_at_unix:old.hardwareDisplay?.hardware_observed_at_unix}:online()?status:old.hardwareDisplay;syncChildren(hardwareSummary,[window.LiveHardwareUI.render(document,displayed,{mode:'compact',cached:!online(),hardwareCached:old.hardwareCached===true,at:old.cachedAt?old.cachedAt/1000:slotTime('cockpit-pc')})]);}
 let connectionNotice=document.querySelector('[data-b2-connection-notice]');if(!online()){
  if(!connectionNotice){connectionNotice=document.createElement('aside');connectionNotice.dataset.b2ConnectionNotice='true';connectionNotice.className='b2-connection-notice';connectionNotice.setAttribute('role','status');document.querySelector('main')?.prepend(connectionNotice);}
  const text=lastRead&&phase==='error'?'连接暂时中断，下面保留 '+Math.max(0,Math.floor((clock()-lastRead)/60))+' 分钟前读到的数据。':offline(lastContact());if(connectionNotice._rendered!==text){connectionNotice._rendered=text;connectionNotice.textContent=text;const link=document.createElement('a');link.href='/mcp/';link.textContent='查看连接电脑页的副机备用入口（两台电脑都需开机联网）';connectionNotice.append(' ',link);}if(connectionNotice.hidden)connectionNotice.hidden=false;
 }else if(connectionNotice&&!connectionNotice.hidden)connectionNotice.hidden=true;
 if(document.body.dataset.b2StatusPhase!==phase)document.body.dataset.b2StatusPhase=phase;if(dialog.open)results();

}

async function acceptGrant(value,fresh){

 result=value;

 if(value.state==='succeeded'){

  if(fresh)status=successfulGrantSnapshot(status,value,true)||status;

  rememberGrant({...grant,...value,factor_submitted:grant?.factor_submitted});message(fresh?(value.default_saved===false?'办理成功；默认时长未保存。':'办理成功。'):'已确认这次办理当时成功，当前授权以最新状态为准。','ok');

 }else{rememberGrant({...grant,...value,factor_submitted:grant?.factor_submitted});message(errorMessages[value.error]||(['unknown','verifying','pending','partial'].includes(value.state)?'本次结果尚未确认，请查询同一请求。':'本次办理未完成，已有授权保持。'),value.state==='failed'?'error':'warn');if(value.request_created===false||!grantResultNeedsQuery(value))rememberGrant({...grant,...value,factor_submitted:grant?.factor_submitted});}

}

async function submit(){

 if(busy||!formal||!online()||!/^\d{6}$/.test(code))return;

 const minutes=durationMinutes(hours),keys=combined?['personal_data','unrestricted']:[purpose];

 if(minutes===null||status?.factor?.available!==true||status.factor.cooldown_until_unix>clock()||keys.some(k=>(remainingMinutes(status?.[k],clock())||0)+minutes>4320)||grant&&grantResultNeedsQuery(grant))return;

 busy=true;reader.invalidate();const id=crypto.randomUUID(),submitted=code;code='';rememberGrant({request_id:id,state:'pending',factor_submitted:false});render();

 attempt=createGrantAttempt({requestId:id,body:{purpose,combined,save_default:saveDefault,duration_hours:hours,state_version:status.state_version},api:(p,o)=>apiRequest(base,p,o),onCreated:r=>rememberGrant({...r,factor_submitted:false}),onVerificationStarted:requestId=>{if(!markGrantVerificationSubmitted(sessionStorage,requestId))throw Error('请求阶段未保存，验证码未提交');rememberGrant({...grant,factor_submitted:true});}});

 try{const value=await attempt.run(submitted);if(value)await acceptGrant(value,attempt.factorSubmitted);}catch(error){rememberGrant({...grant,state:'unknown',error:error.data?.error});message('本次结果尚未确认，请查询同一请求，不要重复提交验证码。');}finally{attempt=null;busy=false;render();reader.read({replace:true});}

}

async function query(){

 if(busy||!grant?.request_id)return;

 busy=true;render();try{const value=await apiRequest(base,'/requests/'+encodeURIComponent(grant.request_id));if(canRestartUnsubmittedGrant(grant,value)){rememberGrant(null);message('本次尚未提交验证码，请按当前状态重新办理。');}else await acceptGrant(queryResultUpdate(grant,value,clock()),false);}catch(error){if(canRestartUnsubmittedGrant(grant,null,error)){rememberGrant(null);message('原请求未建立，已有授权保持。');}else message('本次查询未完成，原请求已保留。');}finally{busy=false;render();reader.read({replace:true});}

}

async function lock(kind,priorId){

 if(busy||!priorId&&(!formal||!online()||!status?.state_version))return;

 const field=kind==='windows'?'lock_windows':kind==='personal-data'?'lock_data':'end_unrestricted';

 if(!priorId&&(status?.public_actions?.[field]!==true||(kind==='personal-data'&&!canEndGrant(status?.personal_data,clock()))||(kind==='unrestricted'&&!canEndGrant(status?.unrestricted,clock()))||(kind==='windows'&&status?.host?.screen_state!=='unlocked')||actions.some(x=>x.action===kind&&unresolvedAction(x))))return;

 busy=true;reader.invalidate();const id=priorId||crypto.randomUUID();if(!priorId)rememberAction({request_id:id,action:kind,state:'pending'});render();

 try{const value=await apiRequest(base,priorId?'/requests/'+encodeURIComponent(id):'/locks/'+kind,priorId?{}:{method:'POST',body:{state_version:status.state_version,request_id:id},timeout:15000});rememberAction(priorId?queryResultUpdate(actions.find(x=>x.request_id===id)||{request_id:id,action:kind},value,clock()):{request_id:id,action:kind,...value});if(!priorId)status=successfulReductionSnapshot(status,{action:kind,...value},true)||status;message(value.state==='succeeded'?(priorId?'已确认这次操作当时成功，当前状态以最新读取为准。':kind==='personal-data'?(value.personal_data?.state==='closing'?'资料访问已结束，正在关闭资料。':'个人资料已锁定。'):kind==='unrestricted'?'无限制授权已结束。':'Windows锁屏已完成。'):'本次结果尚未确认，请查询同一请求。',value.state==='succeeded'?'ok':value.state==='failed'?'error':'warn');}catch(error){rememberAction(priorId?{request_id:id,action:kind,state:'unknown',error:error.data?.error}:reductionFailureResult(error,id,kind,false));message('本次结果尚未确认，原请求已保留。');}finally{busy=false;render();reader.read({replace:true});}

}

const dialog=document.createElement('dialog');dialog.className='b2-results';dialog.innerHTML='<button type="button" class="b2-results-close">关闭</button><h2>操作结果</h2><div class="b2-results-body"></div>';document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();

const globalToast=document.createElement('div');globalToast.className='b2-global-toast';globalToast.setAttribute('role','status');globalToast.hidden=true;document.body.append(globalToast);

function results(){const body=dialog.querySelector('.b2-results-body');body.replaceChildren();for(const item of [grant,...actions].filter(Boolean)){const p=document.createElement('p');p.textContent=({'personal-data':'个人资料锁定',unrestricted:'结束无限制授权',windows:'Windows锁屏'})[item.action]||'本次授权';p.textContent+='：'+({succeeded:'已完成',failed:'未完成',pending:'等待处理',verifying:'正在验证',unknown:'结果尚未确认',partial:'部分完成',cancelled:'已取消',expired:'已到期'})[item.state];for(const key of ['personal_data','unrestricted'])if(item[key]&&item[key].state!=='not_requested')p.textContent+=' · '+(key==='personal_data'?'个人资料':'无限制授权')+'：'+known(item[key].state)+(item[key].expires_at_unix?'，到 '+time(item[key].expires_at_unix):'');if(item.error)p.textContent+=' · '+(errorMessages[item.error]||'电脑未提供该错误的说明');const button=document.createElement('button');button.textContent=busy?'正在查询…':'查询结果';button.disabled=busy;button.onclick=()=>item.action?lock(item.action,item.request_id):query();p.append(button);const link=document.createElement('a');link.href=HOST_ORIGIN+'/computer-access/?request='+encodeURIComponent(item.request_id);link.textContent='在主机查询此请求';link.target='_blank';link.rel='noopener';p.append(link);body.append(p);}if(!body.children.length)body.textContent='当前没有待查询的操作。';if(!dialog.open)dialog.showModal();}

function action(key){

 if(busy)return;

 if(key==='refresh')return reader.read({replace:true,refresh:true});if(key==='results')return results();if(key==='query')return query();if(key==='host-query'){if(grant?.request_id)window.open(HOST_ORIGIN+'/computer-access/?request='+encodeURIComponent(grant.request_id),'_blank','noopener');else message('当前没有待查询的操作。');return;}

 if(!formal||!online()||busy)return;

 if(key.startsWith('choose-')){purpose=key.slice(7);combined=false;document.querySelector('[data-screen="computer-access-02"]')?.scrollIntoView({behavior:'smooth',block:'start'});document.querySelector('[data-b2-slot="ca-form-hours"]')?.focus({preventScroll:true});}

 else if(key.startsWith('purpose-'))purpose=key.slice(8);

 else if(key==='combined')combined=!combined;

 else if(key==='save-default')saveDefault=!saveDefault;

 else if(key.startsWith('hours-')){hoursTouched=true;hours=key.slice(6);}

 else if(key==='submit')return grant&&grantResultNeedsQuery(grant)?query():submit();

 else if(key.startsWith('lock-'))return lock(key.slice(5));

 render();

}

const reader=createStatusReader((signal,{refresh})=>window.SiteLiveRuntime.retryStatus(()=>apiRequest(base,refresh?'/status?refresh=1':'/status',{signal,timeout:window.SiteLiveRuntime.readTimeoutMs}),signal),value=>{status=adaptStatus(value);if(!value.hardware)delete status.hardware;phase='ready';lastRead=Number.isFinite(value.observed_at_unix)?value.observed_at_unix:clock();problem='';if(!hoursTouched&&Number.isFinite(value.default_minutes))hours=String(value.default_minutes/60);render();},error=>{phase='error';problem=error.httpStatus>=500?'server':'connection';render();});

function readStatus(options){if(!formal){phase='error';problem='connection';render();return Promise.resolve();}return reader.read(options);}

let pollTimer;

function schedule(){clearTimeout(pollTimer);if(formal&&!document.hidden)pollTimer=setTimeout(async()=>{if(!busy)await readStatus();schedule();},60000);}

document.addEventListener('visibilitychange',()=>{clearTimeout(pollTimer);if(document.hidden)reader.invalidate();else{if(!busy)readStatus({replace:true});schedule();}});

document.addEventListener('site-layout',mount);mount();if(!document.hidden)readStatus();if(formal&&validRequest(linkedRequest))query();schedule();setInterval(()=>{if(!document.hidden)render();},15000);

addEventListener('hashchange',()=>{target=liveAnchors.find(x=>x.id===decodeURIComponent(location.hash.slice(1)))||null;render();});

window.SiteB2={refresh:()=>readStatus({replace:true}),getSnapshot:()=>({phase,lastRead,requestId:grant?.request_id,actions:actions.map(x=>({request_id:x.request_id,action:x.action,state:x.state})),slots:[...document.querySelectorAll('[data-b2-slot]')].map(x=>({slot:x.dataset.b2Slot,text:x.textContent,disabled:x.disabled}))}),value};

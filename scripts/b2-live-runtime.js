import {HOST_ORIGIN,apiRequest,createStatusReader,createGrantAttempt,durationMinutes,minutesLabel,remainingMinutes,grantLabel,canEndGrant,isAccessOrigin,markGrantVerificationSubmitted,readGrantStage,grantResultNeedsQuery,canRestartUnsubmittedGrant,queryResultUpdate,reductionFailureResult,successfulGrantSnapshot,successfulReductionSnapshot,unresolvedAction,errorMessages,capacity,adaptStatus,reading,numeric,rate,networkConnection,beijingTime,freshStatus,hardwareSnapshot} from './b2-access-model.js';

// The owner's cockpit lamp policy; partial reads keep their own unknown state.
const lampPolicy={computerMaxAge:120,unreadableGrace:600,taskWarnFailures:2,taskErrorFailures:4,backupWarnAge:{daily:36*3600,weekly:9*86400},backupErrorAge:{daily:48*3600,weekly:14*86400},diskWarnFraction:.1,diskErrorFraction:.05,systemDiskMinBytes:15*1024**3};

const data=JSON.parse(document.querySelector('#page-data').textContent);

if(!['cockpit','computer-access','mcp'].includes(data.kind))throw Error('B2运行件只接选定页面');

const currentHost=location.origin===HOST_ORIGIN,formal=isAccessOrigin(location.origin,window.top===window),base=currentHost?'':HOST_ORIGIN;

let status=null,phase='loading',lastRead=0,statusReading=false,problem='',purpose='personal_data',combined=false,saveDefault=false,hours='',hoursTouched=false,code='',busy=false,grant=null,attempt=null,actions=[],result=null,toast='',toastState='unknown',toastTimer=null;

const grantKey='site-b2-access-request-v1',actionsKey='site-b2-access-actions-v1';

const elements=new Map();
const todayRiverHost=document.querySelector('[data-today-river]');
const lastGrafanaGroups=new Map();
let navigatingForm=0;

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
  return {...selected,empty:true,emptyReason:'grafana-groups-unreadable'};
 }
 return selected.iframe?selected:{...selected,empty:true,emptyReason:'grafana-group-unreadable'};
}
const staticHardwareFields=new Set(['model','cores','threads','total_bytes','vram_total_bytes','letter','connection_type']);
function blockHealth(key){const b=status?.[key];if(!b||['unavailable','unknown'].includes(b.state))return 'unknown';if(['failed','error'].includes(b.state))return 'error';const at=blockTime(b);if(b.state==='stale'||!Number.isFinite(at)||at>clock()+60||clock()-at>(Number(b.max_age_seconds)||120))return 'stale';return ['ok','partial','empty'].includes(b.state)?'ok':'unknown';}
const rawList=key=>['ok','partial','empty','stale'].includes(status?.[key]?.state)&&Array.isArray(status[key].items)?status[key].items:null;
let historical=false;
const list=key=>historical?rawList(key):blockHealth(key)==='ok'?rawList(key):null;
const name=x=>x?.plain?.name||x?.name||x?.plain_title||x?.project||'名称暂未提供';
const stateText=s=>({success:'正常',failed:'失败',error:'出错',warn:'需要留意',stale:'已过期',overdue:'没按时完成',running:'正在运行',disabled:'已停用',unknown:'状态未知',never:'还没运行',unavailable:'暂时读不到'})[s]||'状态未知';
const cadenceText=s=>({daily:'每天',weekly:'每周',monthly:'每月',hourly:'每小时',manual:'手动运行',on_change:'变更时',on_login:'登录时',on_startup:'开机时'})[s]||'周期说明暂未提供';
const rowState=rows=>rows?.some(x=>x.enabled!==false&&['failed','error'].includes(x.state))?'error':rows?.some(x=>x.enabled!==false&&['warn','stale','overdue'].includes(x.state))?'warn':!rows||rows.some(x=>x.enabled!==false&&(!['success','running','disabled','never'].includes(x.state)||x.state==='success'&&!Number.isFinite(Date.parse(x.last_success_at||x.last_run_at))))?'unknown':'ok';
function hardwareReadGaps(){
 const hw=status?.hardware;if(!hw||['unknown','unavailable','error','failed'].includes(hw.state))return [{key:'hardware',label:'硬件状态',source:hw,health:'unknown'}];
 const unwrapped=v=>v&&typeof v==='object'&&Object.hasOwn(v,'value')?v.value:v;
 const groups=[['cpu','处理器',hw.cpu,['model','usage_percent','temperature_celsius','power_watts']],['memory','内存',hw.memory,['used_bytes','total_bytes']],['network','网络',hw.network,[Object.hasOwn(hw.network||{},'connected')?'connected':'connection_type','download_bytes_per_second','upload_bytes_per_second',...['latency_ms','jitter_ms','packet_loss_percent'].filter(f=>Object.hasOwn(hw.network||{},f))]],['display','屏幕',hw.display,['width_px','height_px','refresh_hz']],...(hw.gpus||[]).map((row,i)=>['gpu'+i,'显卡'+(i+1),row,['model','usage_percent','temperature_celsius','vram_used_bytes','vram_total_bytes']]),...(hw.volumes||[]).filter(v=>unwrapped(v.connected)!==false).map(row=>['disk'+unwrapped(row.letter),unwrapped(row.letter)+'磁盘',row,['letter','free_bytes','total_bytes']])];
 const labels={model:'型号',usage_percent:'占用率',temperature_celsius:'温度',power_watts:'功耗',used_bytes:'已用容量',total_bytes:'总容量',connected:'连接状态',connection_type:'连接类型',download_bytes_per_second:'下载速度',upload_bytes_per_second:'上传速度',latency_ms:'延迟',jitter_ms:'抖动',packet_loss_percent:'丢包率',width_px:'宽度',height_px:'高度',refresh_hz:'刷新率',vram_used_bytes:'已用显存',vram_total_bytes:'总显存',letter:'盘符',free_bytes:'剩余空间'},gaps=[];
 const collector=status?.display_cache?.collectors?.hardware,hardwareAt=hardwareSnapshot(status)?.observed_at_unix;
 for(const [id,label,row,fields] of groups)for(const field of fields){
  const metric=row?.[field],source=row?.sources?.[field],actual=unwrapped(metric),sampled=metric?.observed_at_unix??source?.observed_at_unix??blockTime(row),maxAge=Number(row?.max_age_seconds||hw.max_age_seconds)||120;
  const missing=!row||actual===null||actual===undefined||actual===''||typeof actual==='number'&&!Number.isFinite(actual)||[row.state,metric?.state,source?.status].some(s=>['unknown','unavailable','error','failed'].includes(s));
  const old=Number.isFinite(hardwareAt)&&(hardwareAt>clock()+60||clock()-hardwareAt>maxAge)||!staticHardwareFields.has(field)&&Number.isFinite(sampled)&&(sampled>clock()+60||clock()-sampled>maxAge);
  const stale=old||collector?.state==='error'||[metric?.state,source?.status].includes('stale')||!metric?.state&&!source?.status&&row?.state==='stale';
  const expiredAt=Math.min(...[hardwareAt,staticHardwareFields.has(field)?NaN:sampled].filter(t=>Number.isFinite(t)&&clock()-t>maxAge).map(t=>t+maxAge));
  if(missing||stale)gaps.push({key:'hardware:'+id+':'+field,label:'硬件：'+label+'的'+labels[field]+'当前读数',source:source||metric,expiredAt,health:stale?'stale':'unknown'});
 }
 return gaps;
}
function hardwareHealth(){const gaps=hardwareReadGaps();return gaps.some(x=>x.health==='stale')?'stale':gaps.length?'unknown':'ok';}
function projectRowHealth(x){
 if(x.frozen===true)return 'ok';
 if(x.failed_count>0||['failed','run_failed','acceptance_failed'].includes(x.overview)||x.run_health==='failed')return 'error';
 if(['run_unknown','unknown'].includes(x.overview)||['unknown','unavailable','stale'].includes(x.state)||x.run_health==='unknown')return 'unknown';
 return x.waiting_user_count>0||x.waiting_ai_count>0||x.on_hold_count>0||x.overview==='run_overdue'||x.run_health==='overdue'?'warn':'ok';
}
function projectHealth(){const rows=list('projects');if(!rows)return 'unknown';const states=rows.map(projectRowHealth);return ['error','unknown','warn'].find(state=>states.includes(state))||'ok';}
function backupAlertHeadline(rows){
 const state=rowState(rows),problem=state!=='ok'&&rows.find(x=>x.enabled!==false&&rowState([x])===state);
 return problem?name(problem)+'：'+(state==='unknown'&&problem.state==='success'?'最近成功时间读不到':stateText(problem.state))+(problem.status_note||problem.plain?.status_note||problem.reason?'；'+(problem.status_note||problem.plain?.status_note||problem.reason):''):undefined;
}
function projectAlertHeadline(){
 const state=projectHealth();
 return state==='ok'?'项目都正常':state==='error'?'有项目出了问题，下面逐项说明':state==='unknown'?'有些项目还没读到结果，下面说明你是否需要操作':'有项目需要确认，下面逐项说明';
}

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
 for(const gap of hardwareReadGaps())add(gap.key,gap.label,gap.source,gap.expiredAt);
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
 const gapGroups=new Map(),gapTitles={hardware:'电脑读数',automation:'自动任务',backups:'备份运行记录',projects:'项目状态',remote_network:'远程和网络',backup_inventory:'备份副本证据'};
 for(const gap of readGaps()){const key=gap.key.split(':')[0];if(!gapGroups.has(key))gapGroups.set(key,[]);gapGroups.get(key).push(gap);}
 for(const [key,gaps] of gapGroups){const since=Math.min(...gaps.map(g=>g.since)),suffix='；从 '+time(since)+' 起'+(gaps.some(g=>g.overGrace)?'，已经超过 10 分钟':'，10 分钟内先保持灯况');
  const row={key:'read-gap:'+key,text:key==='hardware'?'电脑读数从 '+time(since)+' 起读不到（共 '+gaps.length+' 项），已 '+Math.max(0,Math.floor((clock()-since)/60))+' 分钟':(gaps.length===1?gaps[0].label:gapTitles[key]||gaps[0].label)+'暂时读不到'+(gaps.length>1?'（共 '+gaps.length+' 项）':'')+suffix,href:key==='hardware'?'#pc':key.startsWith('backup')?'#backups':key==='automation'?'#tasks':key==='remote_network'?'#remote':['personal_data','unrestricted','windows'].includes(key)?'#security':key==='today'?'#today':'#projects'};
  if(gaps.length>1)row.children=gaps.map(g=>({key:'read-gap:'+g.key,text:g.label,detail:'暂时读不到；从 '+time(g.since)+' 起'}));out.push(row);
 }

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

 const taskBrief=`今天跑了 ${todayTasks.length} 个（含常驻和高频任务），出错 ${failed.length} 个`+(next?'；下一个 '+name(next)+' '+time(Date.parse(next.next_run_at)/1000):'；下次运行暂时未知');

 if(slot==='cockpit-overall')return summary();

 if(slot==='cockpit-quick-1'||slot==='mcp-main')return {text:'电脑在线 · 已开机 '+(Number.isFinite(host.uptime_seconds)?minutesLabel(Math.floor(host.uptime_seconds/60)):'时长未知'),state:'ok'};

 if(slot==='cockpit-quick-2'||slot==='ca-personal-data'||slot==='cockpit-security')return {text:stateLabel(status.personal_data,'personal_data'),state:grantState(status.personal_data)};

 if(slot==='cockpit-quick-3'||slot==='ca-unrestricted'||slot==='cockpit-security-unrestricted')return {text:stateLabel(status.unrestricted,'unrestricted'),state:grantState(status.unrestricted)};

 if(slot==='cockpit-quick-4')return {text:list('automation')?taskBrief:'自动任务暂时读不到',state:rowState(list('automation'))};

 if(slot==='cockpit-quick-5')return {text:(lastBackup?name(lastBackup)+' 最近成功 '+time(Date.parse(lastBackup.last_success_at)/1000):'最近成功的备份暂时未知')+backups.filter(x=>x.enabled!==false&&['warn','stale','overdue','failed','error'].includes(x.state)).map(x=>'；'+name(x)+'：'+(x.status_note||x.plain?.status_note||x.reason||stateText(x.state))).join(''),state:rowState(list('backups'))};

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

  return {text:'曲线暂时打不开',state:'unknown',empty:true};

 }

 if(slot==='cockpit-pc'&&(!status.hardware||['unavailable','unknown'].includes(status.hardware.state)||status.display_cache?.collectors?.hardware?.state==='reading'&&!hardwareSnapshot(status)))return {text:status.display_cache?.collectors?.hardware?.state==='reading'?'硬件正在读取':'硬件状态暂时读不到',state:'unknown'};

 if(slot==='cockpit-pc')return {hardwareDisplay:hardwareSnapshot(status),cacheable:!!hardwareSnapshot(status),rows:[{text:'处理器：'+reading(hw.cpu?.model)+' · '+reading(hw.cpu?.usage_percent,'%')+' · '+reading(hw.cpu?.temperature_celsius,'℃')+' · '+reading(hw.cpu?.power_watts,'W')},...(hw.gpus||[]).map(g=>({text:'显卡：'+reading(g.model)+' · '+reading(g.usage_percent,'%')+' · '+reading(g.temperature_celsius,'℃')+' · 显存 '+capacity(g.vram_used_bytes)+' / '+capacity(g.vram_total_bytes)})),{text:'内存：'+capacity(hw.memory?.used_bytes)+' / '+capacity(hw.memory?.total_bytes)},...(hw.volumes||[]).map(v=>({text:reading(v.letter||v.drive||'磁盘').replace(/:+$/,'')+'：'+(v.connected===false?'没接上':capacity(v.free_bytes)+' / '+capacity(v.total_bytes))})),{text:'网络：'+networkConnection(hw.network)+' · 下行 '+rate(hw.network?.download_bytes_per_second)+' · 上行 '+rate(hw.network?.upload_bytes_per_second)},{text:'屏幕：'+reading(hw.display?.width_px)+' × '+reading(hw.display?.height_px)+' · '+reading(hw.display?.refresh_hz,'Hz')}],state:hardwareHealth()==='ok'?'ok':'unknown'};

 if(slot==='cockpit-tasks'&&!list('automation'))return {text:'自动任务暂时读不到',state:'unknown'};

 if(slot==='cockpit-tasks')return {rows:taskRows(tasks,taskBrief),state:rowState(list('automation'))};

 if(slot==='cockpit-backups'&&!list('backups'))return {text:'备份暂时读不到',state:'unknown'};

 if(slot==='cockpit-backups')return {text:backupAlertHeadline(backups),rows:[...rowText(backups.map(x=>({key:(x.project||'')+':'+name(x),highlight:!!target?.api_project&&x.project===target.api_project,text:name(x)+' · '+stateText(x.state)+' · 最近成功 '+time(Date.parse(x.last_success_at)/1000),state:rowState([x]),detail:[x.plain?.what,x.destination,x.scope_note,cadenceText(x.cadence)].filter(Boolean).join('；')})),'当前没有登记的备份'),{key:'inventory',text:'副本和保存位置',children:inventoryRows().flatMap(group=>group.children?.length?group.children.map(row=>({...row,text:group.text+' · '+row.text})):[group])},{key:'cloud',text:'云端维护',children:cloudRows()}],state:rowState(backups)};

 if(slot==='cockpit-projects'){

  if(target?.id==='learning')return {rows:[{text:'学习进度不放驾驶舱，在学习方法页看',href:'/projects/learning/'}],state:'ok'};

  if(!list('projects'))return {text:'项目状态暂时读不到',state:'unknown'};

  const rows=(list('projects')||[]).filter(x=>x.frozen!==true).map(x=>({key:x.project||x.title,highlight:!!target?.api_project&&x.project===target.api_project,open:target?.id==='pending',detail:(list('pending')||[]).filter(p=>p.project===x.project).map(p=>(p.plain_title||'这件事的说明暂时读不到')+' · '+({me:'需要你确认',ai:'由 AI 检查，你暂时不用操作'})[p.who]+' · '+(p.when||'还没写什么时候检查')).join('；'),text:(x.project||x.title)+'：'+(x.waiting_user_count>0?'要你做 · ':x.waiting_ai_count>0?'AI 在跟 · ':projectRowHealth(x)!=='ok'?'知道就行 · ':'')+(x.health_reason||(projectRowHealth(x)==='ok'?'正常':'这次没读到完整说明')),href:x.website_url&&/^https:\/\/wly0829.cn\//.test(x.website_url)?x.website_url:null}));

  return {text:projectAlertHeadline(),rows:rowText(rows,'项目都正常，没有等验收的'),state:projectHealth()};

 }

 if(slot==='cockpit-today'){

  if(!list('today'))return {text:'今天动态暂时读不到',state:'unknown'};

  const seen=new Set(),labels={system_backup_started:'系统镜像备份开始',system_backup_completed:'系统镜像备份完成',computer_reboot_completed:'电脑重启完成',computer_restarted:'电脑重启完成',stutter_captured:'电脑卡住，已自动留下现场',freeze_captured:'电脑卡住，已自动留下现场'};

  let background=0;const actions={task_completed:'完成',backup_completed:'备份完成',task_failed:'出错',automation_failed:'出错'},named=[...(list('automation')||[]),...backups];
  const rows=(list('today')||[]).filter(x=>x.id&&!seen.has(x.id)&&seen.add(x.id)).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)).flatMap(x=>{
   const task=named.find(t=>t.id===x.task_id),taskName=task?.plain?.name||task?.name||x.plain_title?.trim();
   const reviewed=['acceptance_checked','acceptance_reviewed'].includes(x.type)&&Number.isInteger(x.count)&&x.count>=0&&Number.isInteger(x.passed)&&x.passed>=0&&x.passed<=x.count;
   const title=labels[x.type]||(reviewed?'核对了 '+x.count+' 项，'+(x.passed===x.count?'都通过':'通过 '+x.passed+' 项'):actions[x.type]&&taskName?taskName+' · '+actions[x.type]:x.plain_title?.trim());
   if(!title){background++;return [];}return [{text:time(Date.parse(x.at)/1000)+' · '+title}];
  });
  if(background)rows.push({text:'另有 '+background+' 条后台事件'});

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
 if(slot==='cockpit-grafana')return health==='ok'?result:{text:'曲线暂时打不开',state:'unknown',cached:false,empty:true};
 if((health==='stale'&&slot!=='cockpit-pc'||(slotKeys[slot]||[]).some(key=>key!=='hardware'&&blockHealth(key)==='stale'))&&slot!=='cockpit-overall'&&slot!=='cockpit-attention'){
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

let cockpitUI=null;
function cpNode(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!=null)node.textContent=text;return node;}
function cpButton(text,key){const button=cpNode('button','cp-button',text);button.type='button';if(key){button.dataset.b2Action=key;button.dataset.baseLabel=text;button.onclick=()=>action(key);}return button;}
function cpTitle(screen,text){
 const heading=cpNode('h2','cp-title'),label=cpNode('span','visually-hidden',text);heading.append(label);
 let album;try{album=JSON.parse(document.querySelector('#album-page')?.textContent||'null');}catch{}
 const source=data.shared?.cockpit_titles?.[screen]||album?.nodes?.find(node=>node.screen===screen&&node.title&&node.orientation==='h')||album?.nodes?.find(node=>node.screen===screen&&node.title);
 if(source){const [x,y,w,h]=source.title,frame=cpNode('span','cp-title-crop'),image=cpNode('img'),ratio=w*source.size[0]/(h*source.size[1]);frame.style.aspectRatio=String(ratio);frame.style.width=`min(100%, calc(var(--cp-title-height,54px) * ${ratio}))`;if(screen==='cockpit-01')heading.classList.add('cp-title-main');image.src=source.src;image.alt='';image.decoding='async';image.style.cssText=`width:${100/w}%;height:${100/h}%;left:${-100*x/w}%;top:${-100*y/h}%`;frame.append(image);heading.append(frame);}
 else heading.append(cpNode('span','cp-title-pending',text));return heading;
}
function cpSection(id,title,screen){const node=cpNode('section','cp-section');node.id=id;node.setAttribute('aria-label',title);node.append(cpTitle(screen,title));const body=cpNode('div','cp-rows');node.append(body);return {node,body};}
function cpLine(text,state='unknown'){const row=cpNode('p','cp-line',text);row.dataset.state=state==='attention'?'warn':state;return row;}
function cpSafeHref(value){if(typeof value!=='string')return null;try{const url=new URL(value,location.href);return ['https:','http:'].includes(url.protocol)?url.href:null;}catch{return null;}}
function cpOpenDetails(anchor){if(!cockpitUI)return;cockpitUI.details.open=true;render();const node=document.getElementById(anchor);node?.scrollIntoView({behavior:'smooth',block:'start'});}
function cpPanel(open){
 if(!cockpitUI)return;const {panel,shade,root,details,manage}=cockpitUI;
 panel.hidden=shade.hidden=!open;root.inert=details.inert=cockpitUI.bar.inert=open;
 if(open){cockpitUI.previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';panel.querySelector('[data-cp-purpose]')?.focus({preventScroll:true});}
 else{document.body.style.overflow=cockpitUI.previousOverflow||'';manage.focus({preventScroll:true});}
}
function mountCockpit(){
 if(cockpitUI){if(todayRiverHost)cockpitUI.today.body.prepend(todayRiverHost);return;}
 const paper=document.querySelector('main .paper')||document.querySelector('main');if(!paper)return;
 const original=[...paper.children],root=cpNode('div','cp-cockpit'),bar=cpNode('header','cp-bar');
 const lamp=cpNode('span','cp-lamp'),headline=cpNode('strong','cp-headline','正在读取'),stamp=cpNode('time','cp-stamp');
 lamp.setAttribute('role','img');const refresh=cpButton('↻','refresh');refresh.classList.add('cp-refresh');refresh.setAttribute('aria-label','刷新驾驶舱');bar.append(lamp,headline,stamp,refresh);root.append(cpNode('div','cp-bar-space'));document.body.append(bar);document.documentElement.style.setProperty('--cp-toc-offset',(document.querySelector('.toc')?.getBoundingClientRect().height||0)+'px');
 const grid=cpNode('div','cp-grid'),conclusion=cpSection('cp-conclusion','驾驶舱','cockpit-01'),authority=cpSection('cp-security','安全和授权','cockpit-07');
 conclusion.node.classList.add('cp-conclusion');authority.node.classList.add('cp-security');
 const need=cpNode('div','cp-need'),know=cpNode('div','cp-know'),following=cpNode('details','cp-following'),followingLabel=cpNode('summary',null,'AI 在跟：读取中');following.append(followingLabel);conclusion.body.append(need,know,following);
 const grants=cpNode('div','cp-authority-items'),manage=cpButton('办理');manage.onclick=()=>cpPanel(true);authority.body.append(grants,manage);
 const computer=cpSection('cp-computer','电脑','cockpit-02'),remote=cpSection('cp-remote','远程和网络','cockpit-03'),cloud=cpSection('cp-cloud','备份和云端','cockpit-06'),today=cpSection('cp-today','今天的动态','cockpit-09');today.node.classList.add('cp-today');
 const events=cpNode('div','cp-events'),basis=cpNode('p','cp-line cp-basis'),changes=cpNode('div','cp-changes');today.body.append(events,basis,changes);if(todayRiverHost)today.body.prepend(todayRiverHost);
 grid.append(conclusion.node,authority.node,computer.node,remote.node,cloud.node,today.node);root.append(grid);
 const jump=cpNode('nav','cp-jump');jump.setAttribute('aria-label','驾驶舱区块');for(const [id,text]of [['cp-computer','电脑'],['cp-remote','远程'],['cp-cloud','备份云端'],['cp-today','今天'],['cp-details','明细']]){const link=cpNode('a','cp-button',text);link.href='#'+id;if(id==='cp-details')link.onclick=()=>{details.open=true;};jump.append(link);}root.append(jump);
 const details=cpNode('details','cp-details');details.id='cp-details';details.append(cpNode('summary',null,'明细 · 自动任务、硬件、副本、24 小时曲线、这块怎么看'));
 const archive=cpNode('div','paper cp-original');for(const child of original)if(child!==todayRiverHost)archive.append(child);details.append(archive);details.addEventListener('toggle',()=>{if(details.open)render();});paper.append(root,details);
 const shade=cpNode('div','cp-shade'),panel=cpNode('aside','cp-panel');shade.hidden=panel.hidden=true;shade.onclick=()=>cpPanel(false);panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','cp-panel-title');
 const top=cpNode('header','cp-panel-header'),title=cpNode('h2',null,'办理授权');title.id='cp-panel-title';const close=cpButton('×');close.setAttribute('aria-label','关闭办理面板');close.onclick=()=>cpPanel(false);top.append(title,close);panel.append(top);
 const form=cpNode('form','cp-form');form.onsubmit=event=>{event.preventDefault();action('submit');};
 const selection=cpNode('fieldset','cp-selection');selection.append(cpNode('legend',null,'1 · 办理什么'));const choices=cpNode('div','cp-choices');
 for(const [key,label]of [['personal_data','个人资料'],['unrestricted','全局授权'],['both','两项一起']]){const button=cpButton(label);button.dataset.cpPurpose=key;button.onclick=()=>{if(busy||grant&&grantResultNeedsQuery(grant))return;purpose=key==='both'?'personal_data':key;combined=key==='both';render();};choices.append(button);}selection.append(choices);form.append(selection);
 const durationLabel=cpNode('label','cp-field-label','2 · 开多久（小时）');durationLabel.htmlFor='cp-hours';const duration=cpNode('input','cp-input');duration.id='cp-hours';duration.type='text';duration.inputMode='decimal';duration.autocomplete='off';duration.oninput=()=>{hoursTouched=true;hours=duration.value;render();};form.append(durationLabel,duration);
 const shortcuts=cpNode('div','cp-shortcuts');for(const value of [.5,2,8,24])shortcuts.append(cpButton(value+' 小时','hours-'+value));form.append(shortcuts);
 const defaultLabel=cpNode('label','cp-default'),defaultInput=cpNode('input');defaultInput.type='checkbox';defaultInput.onchange=()=>{saveDefault=defaultInput.checked;render();};defaultLabel.append(defaultInput,'设为以后默认');form.append(defaultLabel);
 const codeLabel=cpNode('label','cp-field-label','3 · 6 位验证码');codeLabel.htmlFor='cp-code';const factor=cpNode('input','cp-input cp-code');factor.id='cp-code';factor.type='text';factor.inputMode='numeric';factor.pattern='[0-9]{6}';factor.maxLength=6;factor.autocomplete='off';factor.oninput=()=>{code=factor.value.replace(/\D/g,'').slice(0,6);factor.value=code;render();};
 const feedback=cpNode('p','cp-form-feedback');feedback.setAttribute('role','status');const submitButton=cpButton('验证并办理','submit');submitButton.type='submit';submitButton.onclick=null;submitButton.classList.add('cp-primary');form.append(codeLabel,factor,feedback,submitButton);
 form.append(cpNode('p','cp-form-note','个人资料与全局授权分别计时。已有授权加时，刷新保持原期限；验证码只提交给电脑。'));
 const reductions=cpNode('div','cp-reductions');for(const [text,key]of [['锁定资料','lock-personal-data'],['结束授权','lock-unrestricted'],['Windows 锁屏','lock-windows'],['操作结果','results']])reductions.append(cpButton(text,key));form.append(reductions);panel.append(form);document.body.append(shade,panel);
 panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();cpPanel(false);}if(event.key==='Tab'){const controls=[...panel.querySelectorAll('button,input,a')].filter(node=>!node.disabled&&!node.hidden),first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}});
 cockpitUI={root,details,archive,bar,lamp,headline,stamp,refresh,need,know,followingLabel,grants,manage,computer,remote,cloud,today,events,basis,changes,panel,shade,selection,duration,factor,defaultInput,feedback};
 document.body.classList.add('cockpit-rearranged');
 const riverHelp=()=>{const legend=todayRiverHost?.querySelector('#legend');if(legend&&!legend.closest('details')){const help=cpNode('details','cp-river-help');help.append(cpNode('summary',null,'这块怎么看'));legend.before(help);help.append(legend);}};riverHelp();document.addEventListener('today-river-ready',riverHelp);
 for(const [id,section]of [['pc',computer],['remote',remote],['backups',cloud],['security',authority],['today',today]]){const old=document.getElementById(id);if(old&&archive.contains(old))old.id='cp-original-'+id;const anchor=cpNode('span','cp-anchor');anchor.id=id;section.node.prepend(anchor);}
 const navigate=()=>{const id=decodeURIComponent(location.hash.slice(1));if(archive.querySelector('[id="'+CSS.escape(id)+'"]'))details.open=true;};addEventListener('hashchange',navigate);navigate();
}
function cpDisplay(card,fallback){
 const display=card?.display;if(display?.state==='hidden')return null;
 const text=display?.text||fallback||'状态正在读取',at=timestamp(display?.observed_at),stale=display?.state==='stale'||!!display?.text&&!online();
 return cpLine(text+(stale?' · '+(Number.isFinite(at)&&at>0?'这是 '+time(at)+' 的数':'这是缓存，数据时间未登记'):''),stale?'stale':online()?display?.state||'unknown':'unknown');
}
function renderCockpit(){
 if(!cockpitUI)return;const ui=cockpitUI,cockpit=status?.cockpit,ready=online()&&cockpit?.schema==='pcconfig.cockpit.v1';
 const overall=ready?cockpit.overall:{state:'unknown',summary:phase==='loading'?'正在读取电脑状态':online()?'结论正在读取':'暂时读不到电脑'},summary=ready?cockpit.summary?.text||overall.summary:overall.summary;
 ui.lamp.dataset.state=overall.state==='attention'?'warn':overall.state||'unknown';ui.lamp.setAttribute('aria-label',summary||'结论未知');ui.headline.textContent=summary||'结论尚未读到';ui.headline.title=ui.headline.textContent;
 ui.stamp.textContent=statusReading?'读取中':lastRead?'读于 '+time(lastRead).replace('今天 ',''):'读取中';ui.stamp.dateTime=lastRead?new Date(lastRead*1000).toISOString():'';ui.stamp.title=lastRead?beijingTime(lastRead):'尚未读到';ui.refresh.disabled=busy||statusReading||phase==='loading';ui.refresh.setAttribute('aria-busy',String(statusReading));
 const need=ready?cockpit.need_you||[]:[],know=ready?cockpit.know||[]:[];const needNodes=need.length?[cpNode('h3',null,'要你做（'+need.length+'）')]:[];
 const cards=cpNode('div','cp-action-grid');cards.dataset.count=String(need.length);
 for(const item of need){const card=cpNode('article','cp-action-card');card.dataset.rowKey=item.id;card.append(cpNode('h4',null,item.title));const a=item.action||{};
  card.append(cpNode('p',null,a.where||'办理地点未登记'));card.append(cpNode('p',null,a.due_at?'期限：'+time(timestamp(a.due_at)):a.due_text||item.when||'期限未登记'));card.append(cpNode('p',null,a.consequence||'不做的影响未登记'));if(Number.isFinite(a.estimated_minutes))card.append(cpNode('small',null,'约 '+a.estimated_minutes+' 分钟'));
  const href=cpSafeHref(a.href);if(href){const link=cpNode('a','cp-button',a.label||'去办理');link.href=href;card.append(link);}else{const button=cpButton('查看已登记要求');button.onclick=()=>cpOpenDetails('projects');card.append(button);}cards.append(card);}
 if(need.length)needNodes.push(cards);else needNodes.push(cpLine(ready?'没有要你做的事':'结论正在读取',ready?'ok':'unknown'));syncChildren(ui.need,needNodes);
 const knowNodes=know.length?[cpNode('h3',null,'知道就行（'+know.length+'）'),...know.map(item=>cpLine(item.title,'unknown'))]:[];
 if(ready&&!need.length&&!know.length&&!cockpit.ai_following?.count)knowNodes.push(cpLine('都正常，没有要你做的事','ok'));syncChildren(ui.know,knowNodes);ui.followingLabel.textContent='AI 在跟：'+(ready?String(cockpit.ai_following?.count??0)+' 条':'读取中');
 const compactGrant=(key)=>!authorizationFresh(status?.[key])?'读不到':remainingMinutes(status?.[key],clock())>0?(key==='personal_data'?'已解锁':'已开启'):stateLabel(status?.[key]);
 const labels=[['个人资料',compactGrant('personal_data'),grantState(status?.personal_data),'personal_data'],['全局授权',compactGrant('unrestricted'),grantState(status?.unrestricted),'unrestricted'],['Windows',windowsFresh()?({'locked':'已锁屏','unlocked':'未锁屏','no_session':'没人登录'})[status?.host?.screen_state]||'未知':'读不到',windowsFresh()?'ok':'unknown'],['电脑',online()?'在线':'读不到',online()?'ok':'unknown']];
 syncChildren(ui.grants,labels.map(([label,text,state,key])=>{const item=cpNode('div','cp-authority');item.dataset.state=state;item.append(cpNode('span',null,label),cpNode('strong',null,text));if(key&&authorizationFresh(status?.[key])&&remainingMinutes(status?.[key],clock())>0)item.append(cpNode('small',null,'到 '+time(status[key].expires_at_unix).replace('今天 ','')));return item;}));
 const byId=new Map((cockpit?.schema==='pcconfig.cockpit.v1'?cockpit.cards||[]:[]).map(card=>[card.id,card]));const gaps=(ready?cockpit.source_gaps||[]:[]).filter(gap=>clock()-timestamp(gap.since)>600),missing=new Set(gaps.flatMap(gap=>gap.card_ids||[]));
 for(const [section,ids,fallbacks]of [[ui.computer,['computer_health','disk_space','traffic'],['电脑读数正在读取','磁盘剩余正在读取','套餐流量尚未读到']],[ui.remote,['remote'],['远程状态正在读取']],[ui.cloud,['backups','drive_upload','aliyun_billing'],['备份状态正在读取','Drive 上传状态正在读取','阿里云余额尚未读到']]]){
  const nodes=[];for(let i=0;i<ids.length;i++){if(missing.has(ids[i]))continue;const row=cpDisplay(byId.get(ids[i]),fallbacks[i]);if(row)nodes.push(row);}for(const gap of gaps)if((gap.card_ids||[]).some(id=>ids.includes(id))&&!know.some(item=>item.source_id===gap.source_id))nodes.push(cpLine((gap.title||'来源')+'从 '+time(timestamp(gap.since))+' 起读不到，AI 在跟','unknown'));syncChildren(section.body,nodes);
 }
 const todayEvents=ready?cockpit.today_events:undefined;syncChildren(ui.events,Array.isArray(todayEvents)?todayEvents.length?todayEvents.map(item=>cpLine(item.title||'事件内容尚未读到','ok')):[cpLine('今天还没有新事件','ok')]:[cpLine('今天的事件正在读取')]);
 const corrections=ready?cockpit.owner_corrections:null;ui.basis.textContent='基座 · '+(corrections?.text||'今天纠正：未统计；近7天：未统计');ui.basis.dataset.state=corrections?.status==='pass'?'ok':'unknown';
 const changeNodes=[cpNode('h3',null,'今天代码变化')],change=cpDisplay(byId.get('today_changes'),'今天代码变化尚未读到');if(change)changeNodes.push(change);
 changeNodes.push(cpNode('h3',null,'今天上线'),cpLine('尚未读到发布记录'));syncChildren(ui.changes,changeNodes);
 if(document.activeElement!==ui.duration)ui.duration.value=hours;if(document.activeElement!==ui.factor)ui.factor.value=code;ui.defaultInput.checked=saveDefault;ui.selection.disabled=busy||!!grant&&grantResultNeedsQuery(grant);ui.duration.disabled=ui.selection.disabled;ui.defaultInput.disabled=ui.selection.disabled;
 ui.factor.disabled=busy||!formal||!online()||!status?.state_version||status?.factor?.available!==true||status?.factor?.cooldown_until_unix>clock()||!!grant&&grantResultNeedsQuery(grant);
 for(const button of ui.panel.querySelectorAll('[data-cp-purpose]'))button.setAttribute('aria-pressed',String(button.dataset.cpPurpose===(combined?'both':purpose)));
 ui.feedback.textContent=liveValue('ca-form').text+(grant&&grantResultNeedsQuery(grant)?'；本次结果尚未确认，请查询原请求。':'');
}

function mount(){
 if(todayRiverHost&&data.kind!=='cockpit')document.querySelector('[data-screen="cockpit-01"]')?.after(todayRiverHost);

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

  for(const entry of layout.native_actions||[]){const button=document.createElement('button');button.className='b2-native b2-image-action';button.type='button';button.dataset.b2Action=entry.action;if(entry.action==='save-default')button.setAttribute('role','checkbox');button.dataset.baseLabel=entry.text;button.textContent=entry.text;button.dataset.hotId=entry.hot_id||'';button.dataset.typesetKind='button';button.setAttribute('aria-label',entry.text);button.title=entry.text;rectStyle(button,entry.rect);button.onclick=()=>{if(entry.copy_text){navigator.clipboard.writeText(entry.copy_text).then(()=>message('已复制。','ok')).catch(()=>message('未能写入剪贴板，请检查浏览器剪贴板权限。','error'));}else action(entry.action);};section.querySelector('.overlays').append(button);}
  let flowCells=liveCells.filter(cell=>cell.node.tagName!=='INPUT'&&cell.slot!=='ca-connection');
  if(screenId==='cockpit-01'){
   const overview=flowCells.filter(cell=>cell.slot==='cockpit-overall'||cell.slot.startsWith('cockpit-quick-'));
   if(overview.length){flowCells=flowCells.filter(cell=>!overview.includes(cell));flowCells.push(liveGroup(section,overview,'b2-overview-group'));}
  }else if(screenId==='cockpit-02'){for(const cell of flowCells)if(cell.slot==='cockpit-pc'){cell.forceOverlay=true;cell.flowRow=true;}}
  else if(screenId==='mcp-01'&&flowCells.length){if(layout.compact_live===true){for(const cell of flowCells)cell.compactFrame=true;}else flowCells=[liveGroup(section,flowCells,'b2-mcp-group',.035)];}
  else if(screenId==='computer-access-01'){
   const grants=flowCells.filter(cell=>['ca-personal-data','ca-unrestricted','ca-windows'].includes(cell.slot));
   const entrance=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('b2-card-enter');entrance.unobserve(entry.target);}});
   grants.forEach((cell,index)=>{cell.node.style.setProperty('--b2-enter-delay',index*80+'ms');entrance.observe(cell.node);});
   if(grants.length>1&&Math.max(...grants.map(cell=>cell.rect[1]))-Math.min(...grants.map(cell=>cell.rect[1]))<.02){flowCells=flowCells.filter(cell=>!grants.includes(cell));const group=liveGroup(section,grants,'b2-authority-group');group.flowRow=true;flowCells.push(group);}
   else for(const cell of grants){cell.forceOverlay=true;cell.flowRow=true;}
  }
  window.TypesetLiveFlow?.apply(section,flowCells);

 }

 if(data.kind==='computer-access'&&!document.querySelector('[data-b2-hardware-summary]')){const summary=document.createElement('div');summary.dataset.b2HardwareSummary='true';summary.className='b2-hardware-summary';document.querySelector('[data-screen="computer-access-01"]')?.after(summary);}

 if(data.kind==='cockpit')mountCockpit();
 render();

 if(todayRiverHost&&data.kind!=='cockpit'){document.querySelector('.b2-overview-main')?.after(todayRiverHost);todayRiverHost.style.pointerEvents='auto';}

}

function render(){
 const restoreReading=window.TypesetLiveFlow?.preserveReader?.();
 if(online())for(const key of Object.keys(grafanaGroupTitles)){const row=grafanaGroupRow(key);if(row.iframe)lastGrafanaGroups.set(key,row);}

 if(typeof globalToast!=='undefined'&&globalToast._rendered!==JSON.stringify([toast,toastState])){globalToast._rendered=JSON.stringify([toast,toastState]);globalToast.hidden=!toast;globalToast.textContent=toast;globalToast.dataset.state=toastState;if(toast){const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','关闭提示');close.onclick=()=>{toast='';clearTimeout(toastTimer);render();};globalToast.append(close);}}
 const widths=new Map([...document.querySelectorAll('[data-b2-slot]')].map(el=>el.closest('.typeset-part')||el.closest('.screen')).filter(Boolean).map(section=>[section,section.clientWidth]));

 for(const el of document.querySelectorAll('[data-b2-slot]')){

  const slot=el.dataset.b2Slot;if(slot==='cockpit-grafana'&&el.closest('.cp-details:not([open])'))continue;const valueRow=value(slot);
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

  if(slot==='cockpit-pc'&&window.LiveHardwareUI){
   const displayed=displayRow.hardwareCached?{...status,hardware:displayRow.hardwareDisplay?.hardware,hardware_observed_at_unix:displayRow.hardwareDisplay?.hardware_observed_at_unix}:online()?status:displayRow.hardwareDisplay,at=displayRow.cachedAt?displayRow.cachedAt/1000:slotTime(slot);
   const hardware=window.LiveHardwareUI.render(document,displayed,{mode:'full',cached:!online(),hardwareCached:displayRow.hardwareCached===true,at});
   if(displayRow.hardwareCached||!status?.hardware||['unknown','unavailable','failed','error','stale'].includes(status.hardware.state)||status.display_cache?.collectors?.hardware?.state==='error'){
    const detail=document.createElement('details'),title=document.createElement('summary');detail.className='b2-hardware-read-detail';detail.dataset.rowKey='hardware-read-detail';title.textContent=Number.isFinite(at)&&(displayRow.hardwareCached||!online()||status.hardware?.state==='stale')?'这是 '+time(at)+' 的电脑读数，之后没读到':'电脑读数暂时读不到，点开看明细';detail.append(title,hardware);content.append(detail);
   }else content.append(hardware);
  }

  else if(displayRow.iframe){const note=document.createElement('p');note.className='b2-chart-loading-note';note.textContent='公开曲线会在下方加载，首次打开可能稍慢。';const frame=document.createElement('iframe');frame.src=displayRow.iframe;frame.title=grouped?displayRow.title:'近24小时硬件曲线';frame.loading='lazy';frame.className='b2-grafana-frame';content.append(note,frame);}

  else if(displayRow.rows)for(const row of displayRow.rows){if(row.children){const group=document.createElement('details');group.dataset.rowKey=row.key||row.text;group.open=row.open===true;const title=document.createElement('summary');title.textContent=row.text;group.append(title);for(const child of row.children){const detail=document.createElement('details');detail.dataset.rowKey=child.key||child.text;detail.open=child.highlight===true;if(child.highlight)detail.dataset.highlight='true';const title=document.createElement('summary');title.textContent=child.text;const p=document.createElement('p');p.textContent=child.detail;detail.append(title,p);group.append(detail);}content.append(group);continue;}const item=document.createElement(row.detail?'details':row.href?'a':'p');item.dataset.rowKey=row.key||row.text;if(row.detail){item.open=row.open===true||row.highlight===true;const summary=document.createElement('summary');summary.textContent=row.text;const description=document.createElement('p');description.textContent=row.detail;item.append(summary,description);}else{item.textContent=row.text;if(row.href)item.href=row.href;}if(row.state)item.dataset.state=row.state;if(row.highlight)item.dataset.highlight='true';content.append(item);}

  else if(el.dataset.livePart==='lamp'){el.setAttribute('aria-label',displayRow.text||'状态未知');el.classList.add('typeset-lamp');}else content.textContent=displayRow.text;

  if(displayRow.notice){const notice=document.createElement('p');notice.className='b2-history-notice';notice.textContent=displayRow.notice;content.append(notice);}
  if(el.classList.contains('b2-ui-slot')&&slot!=='cockpit-pc'&&window.LiveStatusUI){
   const headline=displayRow.text||displayRow.rows?.[0]?.text||(displayRow.iframe?'可查看近24小时硬件曲线':'此项读不到');
   const card=window.LiveStatusUI.render(document,{...displayRow,text:headline,readAt:grouped?displayRow.readAt:displayRow.cachedAt?displayRow.cachedAt/1000:slotTime(slot)},{title:grouped?displayRow.title:liveTitles[slot]||'当前状态',slot,icons:data.shared?.live_status_icons});
   if(displayRow.operation||displayRow.planned){card.querySelector('.live-status-meta')?.remove();card.title=(grouped?displayRow.title:liveTitles[slot]||'办理结果')+'：'+headline;}
   if(displayRow.rows||displayRow.iframe){if(displayRow.rows){card.querySelector('.live-status-value')?.remove();slot==='cockpit-today'&&headline==='今天还没有动态'&&content.firstChild?.textContent===headline&&content.firstChild.remove();}const list=document.createElement('div');list.className='b2-card-list';list.dataset.rowKey='rows:'+slot;list.append(...content.childNodes);card.insertBefore(list,card.querySelector('.live-status-meta'));}
   else content.replaceChildren();
   content.replaceChildren(card);
  }
  syncChildren(el,[...content.childNodes]);el.dataset.cached=String(!!displayRow.cached);
  window.TypesetLiveFlow?.request(section);
 }
 const chartScreen=document.querySelector('[data-screen="cockpit-04"]');
 if(chartScreen)chartScreen.hidden=[...chartScreen.querySelectorAll('.typeset-part:not([hidden]) [data-b2-slot="cockpit-grafana"]')].every(node=>node.hidden);

 for(const b of document.querySelectorAll('[data-b2-action]')){

  const a=b.dataset.b2Action,requiresAuthority=!['refresh','results','query','host-query','copy-note','copy-address'].includes(a);let disabled=busy||(requiresAuthority&&(!formal||!online()||!status?.state_version));

  if(a==='submit'&&grant&&grantResultNeedsQuery(grant)){b.textContent=busy?'正在查询…':'查询本次结果';b.setAttribute('aria-label','查询本次结果');b.disabled=busy;continue;}

  if(a==='submit'){b.textContent=combined?'验证并办理两项':purpose==='personal_data'?(remainingMinutes(status?.personal_data,clock())>0?'验证并延长资料授权':'验证并解锁资料'):(remainingMinutes(status?.unrestricted,clock())>0?'验证并延长无限制授权':'验证并开启无限制授权');b.setAttribute('aria-label',b.textContent);const minutes=durationMinutes(hours),keys=combined?['personal_data','unrestricted']:[purpose];disabled||=minutes===null||!/^\d{6}$/.test(code)||status?.factor?.available!==true||status.factor.cooldown_until_unix>clock()||keys.some(k=>(remainingMinutes(status?.[k],clock())||0)+minutes>4320)||!!grant&&grantResultNeedsQuery(grant);}

  if(a.startsWith('choose-'))disabled||=status?.factor?.available!==true||status?.factor?.cooldown_until_unix>clock();

  if(a.startsWith('lock-')){const kind=a.slice(5),field=kind==='windows'?'lock_windows':kind==='personal-data'?'lock_data':'end_unrestricted';disabled||=status?.public_actions?.[field]!==true||(kind==='personal-data'&&!canEndGrant(status?.personal_data,clock()))||(kind==='unrestricted'&&!canEndGrant(status?.unrestricted,clock()))||(kind==='windows'&&status?.host?.screen_state!=='unlocked')||actions.some(x=>x.action===kind&&unresolvedAction(x));}

  b.disabled=disabled;b.dataset.labelChanging=String(!!b.textContent&&b.textContent!==b.dataset.baseLabel);if(a==='combined')b.setAttribute('aria-pressed',String(combined));if(a==='save-default')b.setAttribute('aria-checked',String(saveDefault));if(a.startsWith('purpose-'))b.setAttribute('aria-pressed',String(a==='purpose-'+purpose));b.dataset.selected=a==='combined'?String(combined):a==='save-default'?String(saveDefault):a==='purpose-'+purpose?'true':'false';

 }

 const hardwareSummary=document.querySelector('[data-b2-hardware-summary]');if(hardwareSummary&&window.LiveHardwareUI){const old=value('cockpit-pc'),displayed=old.hardwareCached?{...status,hardware:old.hardwareDisplay?.hardware,hardware_observed_at_unix:old.hardwareDisplay?.hardware_observed_at_unix}:online()?status:old.hardwareDisplay;syncChildren(hardwareSummary,[window.LiveHardwareUI.render(document,displayed,{mode:'compact',cached:!online(),hardwareCached:old.hardwareCached===true,at:old.cachedAt?old.cachedAt/1000:slotTime('cockpit-pc')})]);}
 let connectionNotice=document.querySelector('[data-b2-connection-notice]');if(!online()){
  if(!connectionNotice){connectionNotice=document.createElement('aside');connectionNotice.dataset.b2ConnectionNotice='true';connectionNotice.className='b2-connection-notice';connectionNotice.setAttribute('role','status');document.querySelector('main')?.prepend(connectionNotice);}
  const text=lastRead&&phase==='error'?'连接暂时中断，下面保留 '+Math.max(0,Math.floor((clock()-lastRead)/60))+' 分钟前读到的数据。':offline(lastContact());if(connectionNotice._rendered!==text){connectionNotice._rendered=text;connectionNotice.textContent=text;const link=document.createElement('a');link.href='/mcp/';link.textContent='查看连接电脑页的副机备用入口（两台电脑都需开机联网）';connectionNotice.append(' ',link);}if(connectionNotice.hidden)connectionNotice.hidden=false;
 }else if(connectionNotice&&!connectionNotice.hidden)connectionNotice.hidden=true;
 if(document.body.dataset.b2StatusPhase!==phase)document.body.dataset.b2StatusPhase=phase;if(dialog.open)results();
 if(data.kind==='cockpit')renderCockpit();

import {HOST_ORIGIN,apiRequest,createStatusReader,createGrantAttempt,durationMinutes,minutesLabel,remainingMinutes,grantLabel,canEndGrant,isAccessOrigin,markGrantVerificationSubmitted,readGrantStage,grantResultNeedsQuery,canRestartUnsubmittedGrant,queryResultUpdate,reductionFailureResult,successfulGrantSnapshot,successfulReductionSnapshot,unresolvedAction,errorMessages,capacity,adaptStatus,reading,numeric,rate,networkConnection,beijingTime} from './b2-access-model-4ec8751fbae9.js';
const data=JSON.parse(document.querySelector('#page-data').textContent);
if(!['cockpit','computer-access','mcp'].includes(data.kind))throw Error('B2运行件只接选定页面');
const currentHost=location.origin===HOST_ORIGIN,formal=isAccessOrigin(location.origin,window.top===window),base=currentHost?'':HOST_ORIGIN;
let status=null,phase='loading',lastRead=0,problem='',purpose='personal_data',combined=false,saveDefault=false,hours='',hoursTouched=false,code='',busy=false,grant=null,attempt=null,actions=[],result=null,toast='',toastState='unknown',toastTimer=null;
const grantKey='site-b2-access-request-v1',actionsKey='site-b2-access-actions-v1';
const elements=new Map();
const liveAnchors=data.b2_live_anchors||[];
let target=liveAnchors.find(x=>x.id===decodeURIComponent(location.hash.slice(1)))||null;
const clock=()=>Date.now()/1000;
const time=t=>Number.isFinite(t)&&t>0?new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(t*1000)):'时间未知';
const known=v=>v===null||v===undefined?'读不到':String(v);
const validRequest=id=>/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id||'');
const grantState=g=>!online()?'unknown':remainingMinutes(g,clock())===0?'warn':['unlocked','active'].includes(g?.state)?'ok':['locked','inactive','revoked','expired'].includes(g?.state)?'closed':['opening','closing'].includes(g?.state)?'warn':['error','failed'].includes(g?.state)?'error':'unknown';
const list=(key)=>['ok','partial','empty'].includes(status?.[key]?.state)&&Array.isArray(status[key].items)?status[key].items:null;
const online=()=>phase==='ready';
const offline=()=>lastRead?'电脑不在线，最后一次读到是 '+time(lastRead):'暂时读不到电脑';
const stateLabel=(grant,key)=>{
 if(!online())return '当前状态未知';
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
function summary(){
 if(!online())return {text:offline(),state:'unknown'};
 const tasks=list('automation'),backups=list('backups'),pending=list('pending'),today=list('today');
 const failedTasks=(tasks||[]).filter(x=>x.enabled===true&&x.state==='failed'&&x.mine===true),badBackup=(backups||[]).filter(x=>x.enabled===true&&['failed','stale'].includes(x.state));
 if(failedTasks.length||badBackup.length)return {text:`${badBackup.length} 项备份要处理，${failedTasks.length} 个任务出错`,state:'error'};
 const volumeWarn=(status?.hardware?.volumes||[]).some(x=>x.connected!==false&&numeric(x.free_bytes)!==null&&numeric(x.total_bytes)>0&&numeric(x.free_bytes)/numeric(x.total_bytes)<.1);
 const warn=(tasks||[]).some(x=>x.enabled===true&&(['warn','overdue'].includes(x.state)||x.state==='failed'&&x.mine!==true))||(backups||[]).some(x=>x.enabled===true&&x.state==='warn')||['automation','backups','hardware'].some(k=>status?.[k]?.state==='stale')||[status?.hardware?.cpu,status?.hardware?.memory,status?.hardware?.network,status?.hardware?.display,...(status?.hardware?.gpus||[]),...(status?.hardware?.volumes||[])].some(x=>x?.state==='stale')||volumeWarn;
 if(warn)return {text:'有项目需要留意',state:'warn'};
 if(!tasks||!backups||!pending||!today||(backups||[]).some(x=>x.enabled===true&&!Number.isFinite(Date.parse(x.last_success_at))))return {text:'有状态块暂时读不到',state:'unknown'};
 return {text:'都正常',state:'ok'};
}
function rowText(rows,empty){return rows.length?rows: [{text:empty}];}
function taskRows(tasks,brief){
 const problematic=[],groups=new Map(),late=new Map();
 for(const x of tasks){const highlight=target?.id==='remote-control'&&['远程操作桌面','远程维护（管理员）','远程维护（系统级）'].includes(x.plain?.name)||target?.id==='sunshine-remote-streaming'&&x.project===target.api_project;const row={highlight,text:(x.plain?.name||x.id||'任务身份读不到')+' · '+(({failed:'出错',warn:'要留意',success:'正常',running:'在运行',disabled:'停用',unknown:'读不到',never:'没跑过',overdue:'过期'})[x.state]||'状态读不到')+' · 上次 '+time(Date.parse(x.last_run_at)/1000)+' · 下次 '+time(Date.parse(x.next_run_at)/1000),detail:[x.plain?.what||'还没写说明',x.schedule_zh,x.plain?.stop,x.plain?.impact,x.status_note].filter(Boolean).join('；')};
 if(x.enabled!==false&&x.project!=='电脑上别的软件'&&['failed','warn','overdue','unknown'].includes(x.state)){problematic.push(row);continue;}
 const lateGroup=x.enabled===false?'停用的任务':x.project==='电脑上别的软件'?'电脑上别的软件':null,key=lateGroup||x.group||'尚未分组',bucket=lateGroup?late:groups;if(!bucket.has(key))bucket.set(key,[]);bucket.get(key).push(row);}
 return [{text:brief},...problematic,...[...groups,...late].map(([name,children])=>({text:name+'（'+children.length+'）',children,open:children.some(x=>x.highlight)}))];
}
function pendingRows(){
 const tasks=list('automation'),backups=list('backups'),pending=list('pending'),out=[];
 for(const x of tasks||[])if(x.enabled===true&&x.mine===true&&x.state==='failed')out.push({text:(x.plain?.name||x.id)+'：任务出错',href:'#tasks'});
 for(const x of backups||[])if(x.enabled===true&&['failed','stale','warn'].includes(x.state))out.push({text:(x.plain?.name||x.plain_title||x.id)+'：'+({failed:'备份失败',stale:'备份过期',warn:'备份要留意'})[x.state],href:'#backups'});
 for(const x of status?.hardware?.volumes||[])if(x.connected!==false&&numeric(x.free_bytes)!==null&&numeric(x.total_bytes)>0&&numeric(x.free_bytes)/numeric(x.total_bytes)<.1)out.push({text:(x.letter||x.drive)+' 剩余 '+capacity(x.free_bytes),href:'#pc'});
 for(const x of pending||[])if(x.who==='me'&&['pending','waiting_user','waiting'].includes(x.state))out.push({text:x.plain_title||x.title||'待本人验收',href:'#projects'});
 for(const key of ['automation','backups','pending','today'])if(!list(key))out.push({text:({automation:'自动任务',backups:'备份',pending:'验收',today:'今天动态'})[key]+'暂时读不到'});
 return rowText(out,'没有要我处理的');
}
function value(slot){
 if(slot==='ca-form'){
  const minutes=durationMinutes(hours),keys=combined?['personal_data','unrestricted']:[purpose],cool=status?.factor?.cooldown_until_unix;
  if(cool>clock())return {text:`验证暂不可用（冷却中）。请在 ${Math.ceil((cool-clock())/60)} 分钟后重试（${time(cool)}）。已有授权保持`,state:'warn'};
  return {text:'本次：'+keys.map(k=>k==='personal_data'?'个人资料':'无限制授权').join(' + ')+' · '+(minutes===null?'请填0.5～72小时':minutesLabel(minutes)),state:minutes===null?'warn':'ok'};
 }
 if(slot==='ca-toast')return {text:toast||'',state:toast?toastState:'unknown'};
 if(slot==='ca-form-hours'||slot==='ca-form-code')return {input:true};
 if(slot==='mcp-secondary')return {text:'还没接上',state:'unknown'};
 if(slot==='ca-connection')return {text:phase==='loading'?'正在连接主机 · 正在读取…':online()?'主机在线 · 读取完成 '+time(lastRead):(problem==='server'?'连接服务异常':'暂时无法连接电脑')+(lastRead?' · 上次读取 '+time(lastRead):' · 尚未读取'),state:online()?'ok':phase==='loading'?'loading':problem==='server'?'error':'unknown'};
 if(!online())return {text:phase==='loading'?'正在读取…':offline(),state:'unknown'};
 const host=status.host||{},hw=status.hardware||{},tasks=(list('automation')||[]).filter(x=>target?.lands_on!=='cockpit-tasks'||!target?.api_project||x.project===target.api_project),backups=list('backups')||[];
 const todayTasks=tasks.filter(x=>x.enabled===true&&x.runs_today===true),failed=todayTasks.filter(x=>x.state==='failed'),next=tasks.filter(x=>x.enabled===true&&Number.isFinite(Date.parse(x.next_run_at))).sort((a,b)=>Date.parse(a.next_run_at)-Date.parse(b.next_run_at))[0];
 const lastBackup=backups.filter(x=>Number.isFinite(Date.parse(x.last_success_at))).sort((a,b)=>Date.parse(b.last_success_at)-Date.parse(a.last_success_at))[0];
 const taskBrief=`今天跑了 ${todayTasks.length} 个，出错 ${failed.length} 个`+(next?'；下一个 '+(next.plain?.name||next.id)+' '+time(Date.parse(next.next_run_at)/1000):'；下次运行暂时未知');
 if(slot==='cockpit-overall')return summary();
 if(slot==='cockpit-quick-1'||slot==='mcp-main')return {text:'电脑在线 · 已开机 '+(Number.isFinite(host.uptime_seconds)?minutesLabel(Math.floor(host.uptime_seconds/60)):'时长未知'),state:'ok'};
 if(slot==='cockpit-quick-2'||slot==='ca-personal-data'||slot==='cockpit-security')return {text:stateLabel(status.personal_data,'personal_data'),state:grantState(status.personal_data)};
 if(slot==='cockpit-quick-3'||slot==='ca-unrestricted'||slot==='cockpit-security-unrestricted')return {text:stateLabel(status.unrestricted,'unrestricted'),state:grantState(status.unrestricted)};
 if(slot==='cockpit-quick-4')return {text:list('automation')?taskBrief:'自动任务暂时读不到',state:!list('automation')?'unknown':failed.length?'warn':'ok'};
 if(slot==='cockpit-quick-5')return {text:lastBackup?(lastBackup.plain?.name||lastBackup.plain_title||lastBackup.id)+' 最近成功 '+time(Date.parse(lastBackup.last_success_at)/1000):'最近成功的备份暂时未知',state:lastBackup?'ok':'unknown'};
 if(slot==='ca-windows'||slot==='cockpit-security-windows')return {text:(({locked:'已锁屏',unlocked:'没锁屏',no_session:'没人登录'})[host.screen_state]||'读不到')+(slot==='ca-windows'?'\n已开机 '+(Number.isFinite(host.uptime_seconds)?minutesLabel(Math.floor(host.uptime_seconds/60)):'时长读不到')+' · 本次开机 '+beijingTime(host.boot_time_unix)+'\n'+known(host.windows_version):''),state:host.screen_state==='unlocked'?'ok':['locked','no_session'].includes(host.screen_state)?'closed':'unknown'};
 if(slot==='mcp-grants')return {rows:[{text:'个人资料：'+stateLabel(status.personal_data),state:grantState(status.personal_data)},{text:'无限制授权：'+stateLabel(status.unrestricted),state:grantState(status.unrestricted)}],state:'unknown'};
 if(slot==='cockpit-attention')return {rows:pendingRows(),state:summary().state};
 if(slot==='cockpit-remote')return {rows:['电脑 MCP','串流','Tailscale','副机','代理和联网','Windows 更新'].map(text=>({text:text+'：还没接上',highlight:target?.id==='remote-control'&&text==='电脑 MCP'||target?.id==='sunshine-remote-streaming'&&text==='串流'})),state:'unknown'};
 if(slot==='cockpit-grafana'){
  const g=status.grafana||status.services?.grafana,publicUrl=g?.public_dashboard_url||g?.public_panel_url;
  if(g?.public_dashboard_state==='reachable'&&/^https:\/\//.test(publicUrl||'')&&!/\/login(?:[/?#]|$)/.test(publicUrl))return {iframe:publicUrl,state:'ok'};
  return {text:'曲线暂时打不开',state:'unknown'};
 }
 if(slot==='cockpit-pc'&&!status.hardware)return {text:'硬件状态暂时读不到',state:'unknown'};
 if(slot==='cockpit-pc')return {rows:[{text:'处理器：'+reading(hw.cpu?.model)+' · '+reading(hw.cpu?.usage_percent,'%')+' · '+reading(hw.cpu?.temperature_celsius,'℃')+' · '+reading(hw.cpu?.power_watts,'W')},...(hw.gpus||[]).map(g=>({text:'显卡：'+reading(g.model)+' · '+reading(g.usage_percent,'%')+' · '+reading(g.temperature_celsius,'℃')+' · 显存 '+capacity(g.vram_used_bytes)+' / '+capacity(g.vram_total_bytes)})),{text:'内存：'+capacity(hw.memory?.used_bytes)+' / '+capacity(hw.memory?.total_bytes)},...(hw.volumes||[]).map(v=>({text:(v.letter||'磁盘')+'：'+(v.connected===false?'没接上':capacity(v.free_bytes)+' / '+capacity(v.total_bytes))})),{text:'网络：'+networkConnection(hw.network)+' · 下行 '+rate(hw.network?.download_bytes_per_second)+' · 上行 '+rate(hw.network?.upload_bytes_per_second)},{text:'屏幕：'+reading(hw.display?.width_px)+' × '+reading(hw.display?.height_px)+' · '+reading(hw.display?.refresh_hz,'Hz')}],state:'ok'};
 if(slot==='cockpit-tasks'&&!list('automation'))return {text:'自动任务暂时读不到',state:'unknown'};
 if(slot==='cockpit-tasks')return {rows:taskRows(tasks,taskBrief),state:failed.length?'warn':'ok'};
 if(slot==='cockpit-backups'&&!list('backups'))return {text:'备份暂时读不到',state:'unknown'};
 if(slot==='cockpit-backups')return {rows:rowText(backups.map(x=>({highlight:!!target?.api_project&&x.project===target.api_project,text:(x.plain?.name||x.plain_title||x.id)+' · '+known(x.state)+' · 最近成功 '+time(Date.parse(x.last_success_at)/1000),detail:[x.plain?.what,x.destination,x.scope_note,x.cadence].filter(Boolean).join('；')})),'当前没有登记的备份'),state:'ok'};
 if(slot==='cockpit-projects'){
  if(target?.id==='learning')return {rows:[{text:'学习进度不放驾驶舱，在学习方法页看',href:'/projects/learning/'}],state:'ok'};
  if(!list('projects'))return {text:'项目状态暂时读不到',state:'unknown'};
  const rows=(list('projects')||[]).filter(x=>x.frozen!==true&&(x.waiting_user_count>0||x.waiting_ai_count>0||x.on_hold_count>0||x.failed_count>0||['run_failed','acceptance_failed','run_overdue','run_unknown'].includes(x.overview))).map(x=>({highlight:!!target?.api_project&&x.project===target.api_project,open:target?.id==='pending',detail:(list('pending')||[]).filter(p=>p.project===x.project).map(p=>(p.plain_title||'条目标题读不到')+' · '+({me:'我',ai:'AI'})[p.who]+' · '+(p.when||'核验时机读不到')).join('；'),text:(x.project||x.title)+'：'+(x.health_reason||'有事项待处理'),href:x.website_url&&/^https:\/\/wly0829.cn\//.test(x.website_url)?x.website_url:null}));
  return {rows:rowText(rows,'项目都正常，没有等验收的'),state:rows.length?'warn':'ok'};
 }
 if(slot==='cockpit-today'){
  if(!list('today'))return {text:'今天动态暂时读不到',state:'unknown'};
  const seen=new Set(),labels={system_backup_started:'系统镜像备份开始',system_backup_completed:'系统镜像备份完成',computer_reboot_completed:'电脑重启完成',stutter_captured:'电脑卡住，已自动留下现场'};
  const rows=(list('today')||[]).filter(x=>x.id&&!seen.has(x.id)&&seen.add(x.id)).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)).map(x=>({text:time(Date.parse(x.at)/1000)+' · '+(labels[x.type]||(x.type==='task_completed'?(tasks.find(t=>t.id===x.task_id)?.plain?.name||'任务')+'完成':x.type==='task_failed'?(tasks.find(t=>t.id===x.task_id)?.plain?.name||'任务')+'出错':x.type==='acceptance_checked'?'核对了 '+known(x.count)+' 项，'+(x.passed===x.count?'都通过':'通过 '+known(x.passed)+' 项'):x.plain_title||'事件详情暂未提供'))}));
  return {rows:rowText(rows,'今天还没有动态'),state:'ok'};
 }
 return {text:'还没接上',state:'unknown'};
}
function rectStyle(el,r){Object.assign(el.style,{position:'absolute',left:r[0]*100+'%',top:r[1]*100+'%',width:r[2]*100+'%',height:r[3]*100+'%',pointerEvents:'auto'});}
function mount(){
 for(const section of document.querySelectorAll('.screen:not(.typeset-screen),.typeset-part:not([hidden])')){
  const layout=section._layout;if(!layout)continue;
  document.querySelector(`.live-strip[data-screen="${section.dataset.screen}"]`)?.remove();
  for(const old of section.querySelectorAll('.b2-native'))old.remove();
  for(const cell of layout.native_live||layout.live||[]){
   const node=document.createElement(cell.slot==='ca-form-hours'||cell.slot==='ca-form-code'?'input':'div');node.className='b2-native b2-slot';node.dataset.b2Slot=cell.slot;node.dataset.livePart=cell.live_part||'';node.dataset.hotId=cell.hot_id||'';node.dataset.typesetKind='live';node.setAttribute('role',node.tagName==='INPUT'?'textbox':'status');rectStyle(node,cell.rect);
   if(node.tagName==='INPUT'){
    const duration=cell.slot==='ca-form-hours';node.type='text';node.inputMode=duration?'decimal':'numeric';node.autocomplete='off';node.setAttribute('aria-label',duration?'授权时长（小时）':'6位动态验证码');node.value=duration?hours:code;if(!duration){node.maxLength=6;node.pattern='[0-9]{6}';}
    node.addEventListener('input',()=>{if(duration){hoursTouched=true;hours=node.value;}else{code=node.value.replace(/\D/g,'').slice(0,6);node.value=code;}render();});
   }
   section.querySelector('.overlays').append(node);
  }
  for(const entry of layout.native_actions||[]){const button=document.createElement('button');button.className='b2-native b2-image-action';button.type='button';button.dataset.b2Action=entry.action;button.dataset.baseLabel=entry.text;button.dataset.hotId=entry.hot_id||'';button.dataset.typesetKind='button';button.setAttribute('aria-label',entry.text);button.title=entry.text;rectStyle(button,entry.rect);button.onclick=()=>{if(entry.copy_text){navigator.clipboard.writeText(entry.copy_text).then(()=>message('已复制。','ok')).catch(()=>message('未能写入剪贴板，请检查浏览器剪贴板权限。','error'));}else action(entry.action);};section.querySelector('.overlays').append(button);}
 }
 render();
}
function render(){
 if(typeof globalToast!=='undefined'){globalToast.hidden=!toast;globalToast.textContent=toast;globalToast.dataset.state=toastState;if(toast){const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','关闭提示');close.onclick=()=>{toast='';clearTimeout(toastTimer);render();};globalToast.append(close);}}
 for(const el of document.querySelectorAll('[data-b2-slot]')){
  const slot=el.dataset.b2Slot,valueRow=value(slot);el.dataset.state=valueRow.state||'unknown';
  const section=(el.closest('.typeset-part')||el.closest('.screen')),layout=section._layout,font=Math.max(11,Math.min(18,section.clientWidth/layout.size[0]*30));el.style.fontSize=font+'px';
  if(el.tagName==='INPUT'){el.disabled=busy||!formal||!online()||status?.factor?.cooldown_until_unix>clock()||!!grant&&grantResultNeedsQuery(grant);if(document.activeElement!==el)el.value=slot==='ca-form-hours'?hours:code;continue;}
  el.replaceChildren();
  if(target?.lands_on==='cockpit-tasks'&&slot==='cockpit-tasks'&&target.api_project){const filter=document.createElement('button');filter.type='button';filter.className='b2-filter';filter.textContent='只看：'+target.site_title+' · 看全部';filter.onclick=()=>{target=null;history.replaceState(null,'',location.pathname+location.search+'#tasks');render();};el.append(filter);}
  if(valueRow.iframe){const frame=document.createElement('iframe');frame.src=valueRow.iframe;frame.title='近24小时硬件曲线';frame.loading='lazy';el.append(frame);}
  else if(valueRow.rows)for(const row of valueRow.rows){if(row.children){const group=document.createElement('details');group.open=row.open===true;const title=document.createElement('summary');title.textContent=row.text;group.append(title);for(const child of row.children){const detail=document.createElement('details');detail.open=child.highlight===true;if(child.highlight)detail.dataset.highlight='true';const title=document.createElement('summary');title.textContent=child.text;const p=document.createElement('p');p.textContent=child.detail;detail.append(title,p);group.append(detail);}el.append(group);continue;}const item=document.createElement(row.detail?'details':row.href?'a':'p');if(row.detail){item.open=row.open===true||row.highlight===true;const summary=document.createElement('summary');summary.textContent=row.text;const description=document.createElement('p');description.textContent=row.detail;item.append(summary,description);}else{item.textContent=row.text;if(row.href)item.href=row.href;}if(row.state)item.dataset.state=row.state;if(row.highlight)item.dataset.highlight='true';el.append(item);}
  else if(el.dataset.livePart==='lamp'){el.setAttribute('aria-label',valueRow.text||'状态未知');el.classList.add('typeset-lamp');}else el.textContent=valueRow.text;
 }
 for(const b of document.querySelectorAll('[data-b2-action]')){
  const a=b.dataset.b2Action,requiresAuthority=!['refresh','results','query','host-query','copy-note','copy-address'].includes(a);let disabled=busy||(requiresAuthority&&(!formal||!online()||!status?.state_version));
  if(a==='submit'&&grant&&grantResultNeedsQuery(grant)){b.textContent=busy?'正在查询…':'查询本次结果';b.setAttribute('aria-label','查询本次结果');b.disabled=busy;continue;}
  if(a==='submit'){b.textContent=combined?'验证并办理两项':purpose==='personal_data'?(remainingMinutes(status?.personal_data,clock())>0?'验证并延长资料授权':'验证并解锁资料'):(remainingMinutes(status?.unrestricted,clock())>0?'验证并延长无限制授权':'验证并开启无限制授权');b.setAttribute('aria-label',b.textContent);const minutes=durationMinutes(hours),keys=combined?['personal_data','unrestricted']:[purpose];disabled||=minutes===null||!/^\d{6}$/.test(code)||status?.factor?.available!==true||status.factor.cooldown_until_unix>clock()||keys.some(k=>(remainingMinutes(status?.[k],clock())||0)+minutes>4320)||!!grant&&grantResultNeedsQuery(grant);}
  if(a.startsWith('choose-'))disabled||=status?.factor?.available!==true||status?.factor?.cooldown_until_unix>clock();
  if(a.startsWith('lock-')){const kind=a.slice(5),field=kind==='windows'?'lock_windows':kind==='personal-data'?'lock_data':'end_unrestricted';disabled||=status?.public_actions?.[field]!==true||(kind==='personal-data'&&!canEndGrant(status?.personal_data,clock()))||(kind==='unrestricted'&&!canEndGrant(status?.unrestricted,clock()))||(kind==='windows'&&status?.host?.screen_state!=='unlocked')||actions.some(x=>x.action===kind&&unresolvedAction(x));}
  b.disabled=disabled;b.dataset.labelChanging=String(!!b.textContent&&b.textContent!==b.dataset.baseLabel);if(['combined','save-default'].includes(a))b.setAttribute('aria-pressed',String(a==='combined'?combined:saveDefault));if(a.startsWith('purpose-'))b.setAttribute('aria-pressed',String(a==='purpose-'+purpose));b.dataset.selected=a==='combined'?String(combined):a==='save-default'?String(saveDefault):a==='purpose-'+purpose?'true':'false';
 }
 document.body.dataset.b2StatusPhase=phase;if(dialog.open)results();
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
const reader=createStatusReader((signal,{refresh})=>apiRequest(base,refresh?'/status?refresh=1':'/status',{signal,timeout:10000}),value=>{status=adaptStatus(value);if(!value.hardware)delete status.hardware;phase='ready';lastRead=Number.isFinite(value.observed_at_unix)?value.observed_at_unix:clock();problem='';if(!hoursTouched&&Number.isFinite(value.default_minutes))hours=String(value.default_minutes/60);render();},error=>{status=null;phase='error';problem=error.httpStatus>=500?'server':'connection';render();});
function readStatus(options){if(!formal){phase='error';problem='connection';render();return Promise.resolve();}return reader.read(options);}
let pollTimer;
function schedule(){clearTimeout(pollTimer);if(formal&&!document.hidden)pollTimer=setTimeout(async()=>{if(!busy)await readStatus();schedule();},60000);}
document.addEventListener('visibilitychange',()=>{clearTimeout(pollTimer);if(document.hidden)reader.invalidate();else{if(!busy)readStatus({replace:true});schedule();}});
document.addEventListener('site-layout',mount);mount();if(!document.hidden)readStatus();if(formal&&validRequest(linkedRequest))query();schedule();setInterval(()=>{if(!document.hidden)render();},15000);
addEventListener('hashchange',()=>{target=liveAnchors.find(x=>x.id===decodeURIComponent(location.hash.slice(1)))||null;render();});
window.SiteB2={refresh:()=>readStatus({replace:true}),getSnapshot:()=>({phase,lastRead,requestId:grant?.request_id,actions:actions.map(x=>({request_id:x.request_id,action:x.action,state:x.state})),slots:[...document.querySelectorAll('[data-b2-slot]')].map(x=>({slot:x.dataset.b2Slot,text:x.textContent,disabled:x.disabled}))}),value};

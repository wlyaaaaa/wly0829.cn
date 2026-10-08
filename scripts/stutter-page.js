(() => {
  'use strict';
  const c=JSON.parse(document.querySelector('#stutter-copy').textContent), $=id=>document.getElementById(id);
  const say=(id,text)=>$(id).textContent=text, fill=(key,values={})=>c[key].replace(/\{([\w-]+)\}/g,(all,k)=>values[k]??all);
  const valid=n=>typeof n==='number'&&Number.isFinite(n), fresh=(at,limit=180)=>valid(at)&&at>0&&Date.now()/1000-at>=-60&&Date.now()/1000-at<=limit;
  const date=t=>{if(!valid(t))return c.unknown;const fmt=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}),parts=d=>Object.fromEntries(fmt.formatToParts(new Date(d)).map(p=>[p.type,p.value])),p=parts(t*1000),today=parts(Date.now());return (p.year===today.year&&p.month===today.month&&p.day===today.day?'今天':p.month+'月'+p.day+'日')+' '+p.hour+':'+p.minute;};
  const duration=s=>valid(s)?s<3600?Math.floor(s/60)+c.minute:s<86400?Math.floor(s/3600)+c.hour:Math.floor(s/86400)+c.day+(Math.floor(s%86400/3600)?' '+Math.floor(s%86400/3600)+c.hour:''):c.unknown;
  let snapshot=null, health={}, points=[], issues=[], busy=false, controller, allIssues=[];
  function button(id,rows,key,minimum=1){const b=$(id);b.hidden=id==='copy-all'?false:rows.length<minimum;b.disabled=!rows.length;b.textContent=fill(rows.length?key:'copy-none',{N:rows.length});b.setAttribute('aria-label',rows.length?fill(id.replace('copy','aria'),{N:rows.length}):b.textContent);}
  function chart(){
    const key=$('metric').value, usable=points.filter(p=>valid(p.metrics?.[key])), percent=key==='commit_ratio', unit=percent?'%':key.endsWith('_bytes')?'GiB':'', factor=percent?100:key.endsWith('_bytes')?1/1024**3:1;
    $('chart').hidden=usable.length<2;$('chart-note').hidden=usable.length<2;if(usable.length<2)return;
    const xMax=Math.max(1,...usable.map(p=>(p.t-p.boot)/3600)), yMax=Math.max(1,...usable.map(p=>p.metrics[key]*factor))*1.1, svg=$('chart').querySelector('svg'), width=innerWidth<=640?400:720;svg.setAttribute('viewBox',`0 0 ${width} 240`);svg.replaceChildren();
    const node=(name,attrs,text)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;svg.append(n);};
    for(let i=0;i<4;i++){const y=190-i*50;node('line',{x1:58,x2:width-30,y1:y,y2:y,class:'grid'});node('text',{x:4,y:y+5},(yMax*i/3).toFixed(percent?0:1)+unit);}
    for(let i=0;i<4;i++)node('text',{x:58+i*(width-90)/3,y:222,'text-anchor':i===3?'end':i===0?'start':'middle'},(xMax*i/3).toFixed(1)+c.hour);
    let path='',last=null;for(const p of usable){const x=58+(p.t-p.boot)/3600/xMax*(width-90),y=190-p.metrics[key]*factor/yMax*150;path+=(last&&p.t-last.t<=900&&p.boot===last.boot?'L':'M')+x+' '+y+' ';node('circle',{cx:x,cy:y,r:2});last=p;}node('path',{d:path,class:'curve'});
    say('chart-note',fill('chart-note',{metric:c[key]}));
  }
  function render(data){
    snapshot=data;const raw=data.hardware?.health?.pc_health||{}, source=data.display_cache?.collectors?.hardware;
    health={...raw,state:fresh(raw.observed_at_unix,raw.max_age_seconds)&&!['error','stale'].includes(source?.state)?raw.state:'unknown'};
    const host=data.host||{}, uptime=fresh(host.sources?.uptime_seconds?.observed_at_unix,120)?host.uptime_seconds:null, span=duration(uptime), at=raw.observed_at_unix, h=health;
    const governance=data.automation?.items?.find(row=>row.id===c.governance_id), next=fresh(Date.parse(data.automation?.observed_at)/1000,data.automation?.max_age_seconds||600)&&governance?.enabled!==false?Date.parse(governance?.next_run_at)/1000:null;
    const values={uptime:span,when:date(at),next:valid(next)&&next>Date.now()/1000?date(next).split(' ')[0]:null};
    const normal=h.state==='ok', warming=normal&&h.trend_state==='warming', tail=fill(h.state==='unknown'?(values.next?'tail-next':'tail-unknown'):(values.next?'tail-alert-next':'tail-alert'),values);
    let headline=fill(normal?'normal':h.state==='unknown'?'unconfirmed':h.reason_code?.startsWith('resource_growth')?'growth':'high',values);
    if(warming&&valid(h.recording_started_at_unix))headline+=fill('warming',{remaining:Math.max(0,Math.ceil(25-(at-h.recording_started_at_unix)/3600))});
    if(!normal)headline+=' '+tail;if(h.reason_code?.endsWith('_data_gap'))headline+=' '+c['data-gap'];
    say('headline',headline);document.querySelector('.hero').setAttribute('data-state',h.state);say('read-at',fill('read-at',values));
    points=fresh(at,h.max_age_seconds)&&Array.isArray(h.trend_points)?h.trend_points.filter(p=>valid(p.t)&&valid(p.boot)&&p.boot<=p.t&&p.t<=at&&at-p.t<=90000):[];
    const boot=points.at(-1)?.boot;points=points.filter(p=>p.boot===boot);const start=points[0]?.t;
    say('trend-note',points.length?fill(h.trend_state==='ok'?'recording-ready':'recording',{start:date(start),hours:(h.coverage_hours||0).toFixed(1)}):c['no-points']);chart();
    const cause=h.reason_code?.startsWith('resource_growth')?c['cause-growth']:h.reason_code?.startsWith('resource_high')?c['cause-high']:null;
    say('causes',cause||'');say('cause-status',normal?c['cause-clear']:cause?c['cause-unconfirmed']:c['unknown-short']);
    const card=data.cockpit?.cards?.find(r=>r.id==='computer_health'), notice=data.cockpit?.know?.find(r=>r.id==='pc-health'), row=notice||card;
    issues=['warn','error'].includes(h.state)&&row?[{...row,title:c.title,text:headline,missing:!row.ai_hint}]:[];
    const rank=r=>r.severity==='red'?0:r.severity==='yellow'?1:2, eligible=r=>r.current!==false&&r.resolved!==true&&(r.ai_hint||['red','yellow'].includes(r.severity))&&r.state!=='waiting_for_unlock';
    allIssues=[...new Map([...(data.cockpit?.need_you||[]),...(data.cockpit?.know||[])].filter(eligible).map(r=>[r.id,{...r,missing:!r.ai_hint}])).values()].sort((a,b)=>rank(a)-rank(b)||Date.parse(a.first_seen_at||a.at_beijing||a.observed_at)-Date.parse(b.first_seen_at||b.at_beijing||b.observed_at));
    button('copy-one',issues,'copy-one');button('copy-block',issues,'copy-block',2);button('copy-all',allIssues,'copy-all');
    $('urgent-title').hidden=$('urgent-note').hidden=!issues.length;say('copy-felt',issues.length?c['copy-one']:c.felt);
    const started=Date.parse(notice?.execution_started_at)/1000;say('ai-status',valid(started)&&started<=Date.now()/1000&&notice?.ai_action?fill('ai-running',{action:notice.ai_action,start:date(started)}):fill(values.next?'ai-next':'ai-none',values));
    $('metrics').replaceChildren();for(const key of ['commit_ratio','available_bytes','handle_count','nonpaged_pool_bytes','paged_pool_bytes']){const dt=document.createElement('dt'),dd=document.createElement('dd'),n=h.metrics?.[key];dt.textContent=c[key];dd.textContent=valid(n)?(key==='commit_ratio'?(n*100).toFixed(1)+'%':key.endsWith('_bytes')?(n/1024**3).toFixed(2)+' GiB':n.toLocaleString('zh-CN')):c.unknown;$('metrics').append(dt,dd);}
  }
  async function copy(kind){
    const rows=kind==='all'?allIssues:issues, at=date(snapshot?.hardware?.health?.pc_health?.observed_at_unix), row=rows[0], values={N:rows.length,id:row?.id,title:row?.title,line:row?.text||row?.what_happened||row?.title,at,uptime:duration(snapshot?.host?.uptime_seconds)};
    values.rows=rows.map((r,i)=>`${i+1}. ${kind==='all'?'['+(r.severity==='red'?c.red:r.severity==='yellow'?c.yellow:c.unknown_label)+'] ':''}id=${r.id}：${r.title}${r.missing?c['missing-hint']:''}`).join('\n');
    const feltRow=snapshot?.cockpit?.know?.find(r=>r.id==='pc-health')||snapshot?.cockpit?.cards?.find(r=>r.id==='computer_health');
    if(kind==='felt'){values.id=feltRow?.id||'computer_health';values.title=c.title;values.line=$('headline').textContent;}
    const text=kind==='felt'&&!feltRow?.ai_hint?c['felt-prefix']+'\n'+fill('one-missing-prompt',values):fill(kind==='felt'?'felt-prompt':kind==='all'?'all-prompt':kind==='block'?'block-prompt':row?.missing?'one-missing-prompt':'one-prompt',values);
    try{await navigator.clipboard.writeText(text);say('copy-feedback',fill(kind==='all'||kind==='block'?'copied-many':'copied-one',values));$('copy-manual').hidden=true;}catch{say('copy-feedback',c['copy-failed']);$('copy-manual').hidden=false;$('copy-manual').value=text;}
  }
  async function refresh(){
    if(busy||document.hidden)return;busy=true;$('refresh').disabled=true;controller=new AbortController();
    try{render(await window.SiteLiveRuntime.readStatus(controller.signal));}catch{say('headline',snapshot?fill('offline-prior',{at:date(snapshot.hardware?.health?.pc_health?.observed_at_unix)}):c.offline);document.querySelector('.hero').setAttribute('data-state','unknown');$('chart').hidden=true;$('copy-all').disabled=true;say('copy-all',c['copy-wait']);$('copy-one').hidden=$('copy-block').hidden=true;}finally{busy=false;$('refresh').disabled=false;}
  }
  $('metric').onchange=chart;$('refresh').onclick=refresh;for(const kind of ['one','block','all','felt'])$('copy-'+kind).onclick=()=>copy(kind);
  document.addEventListener('visibilitychange',()=>document.hidden?controller?.abort():refresh());addEventListener('resize',chart);refresh();setInterval(refresh,60000);
})();

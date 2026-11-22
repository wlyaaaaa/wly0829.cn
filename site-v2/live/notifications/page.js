(() => {
  'use strict';
  const U=window.LiveUI,L=window.LiveLight,V=window.LiveViz,$=id=>document.getElementById(id),{esc}=U;
  U.date = window.LiveChart.date;
  const params=new URLSearchParams(location.search),fixture=params.has('fixture'),resource='notifications/deliveries',sync=window.LiveChart.sync();
  const stamp=t=>t&&typeof t==='object'?t:t?`${U.date(t)===U.date(new Date().toISOString())?'':U.date(t)+' '}${U.time(t)}`:(U.offline?.()?'':U.collectionText()),at=r=>r.at||r.started_at||r.queued_at;
  const HOUR=3600000, DAY=24*HOUR;
  const parse=t=>typeof t==='string'?Date.parse(t):NaN;
  const beijingDay=t=>new Date(t+8*HOUR).toISOString().slice(0,10);
  function interval(from,to){
    if(!hasWindow({from,to}))return '';
    const start=beijingDay(parse(from)),end=beijingDay(parse(to)),display=d=>start.slice(0,4)===end.slice(0,4)?d.slice(5):d;
    return `${display(start)} ${U.time(from)}–${start===end?'':display(end)+' '}${U.time(to)}`;
  }
  const combine=values=>values.find(v=>v&&typeof v==='object')||values.filter(Boolean).join(' · ');
  const lower=(o,key)=>[o,o?.[key]].some(v=>v?.lower_bound===true||v?.at_least===true||v?.isPartial===true)||o?.q==='partial'&&(!Array.isArray(o.partial)||o.partial.includes(key));
  const countText=(o,key,n)=>n==null?(U.offline?.()?'':U.collectionText('',o)):`${lower(o,key)?'至少 ':''}${n}`;
  // 到没到：手机回了“已弹出”、或 Gmail 收下发出，算到了；其余按人话分三种。
  const kindOf=r=>r.status==='sent'?'sent':r.status==='failed'?'failed':r.status==='not_started'?'not_started':'unsure';
  const stateWords={sent:'到了',failed:'没到',not_started:'没发出去',unsure:'还没确认到没到'};
  const stateWord=r=>typeof r.status==='object'&&r.status?r.status:stateWords[kindOf(r)];
  const isMail=r=>['mail','email'].includes(r.channel);
  const classNames={ai_wait:'AI 等你回答',ai_done:'AI 回复了',done:'做完了',ai_stopped:'AI 停了',need_you:'要你做的事',know:'要你知道的事',later:'你放着的事',urgent:'大问题',
    report_question:'汇报页出题',report_update:'汇报页更新',notice:'AI 留言',notice_keep:'AI 留言',notice_urgent:'急事',undelivered:'之前没送到的提醒'};
  const you=()=>viewer==='owner'?'你':'本人';
  const className=r=>{const list=[].concat(r.class??[]).map(c=>classNames[c]).filter(Boolean);return [...new Set(list)].map(v=>viewer==='owner'?v:v.replace(/你/g,'本人')).join('、');};
  const routeNames={lan:'局域网',cloud:'云端',tailscale:'Tailscale',direct:'直连',bluetooth:'蓝牙'};
  const channel=r=>isMail(r)?'邮件':r.channel==='phone'?'手机':r.channel_label||r.channel_name||r.channel||'';
  const way=r=>{
    if(r.route&&typeof r.route==='object')return r.route;
    if(r.channel!=='phone')return channel(r);
    const road=routeNames[r.route]||(typeof r.route==='string'?r.route:'');
    return road?`手机（经${road}）`:'手机';
  };
  // 卡在哪一步、为什么：前半句是哪一步，冒号后是原因。
  function stuck(r){
    const k=kindOf(r),e=r.error_code,mail=isMail(r);
    if(k==='sent')return '';
    if(k==='not_started')return e==='start'?'没开始发：发信程序没启动起来':'还没开始发：还在排队';
    const step=mail?'卡在交给 Gmail 那一步':'卡在推到手机那一步';
    const why={interrupted:'正发的时候通知程序重启了，没等到回话',timeout:mail?'发信程序超时，没等到 Gmail 回话':'等手机回话超时',auth:mail?'Gmail 登录验证没通过':'手机那边验证没通过',
      start:'发送程序没启动起来',invalid:mail?'Gmail 的回话看不懂，不知道发出去没有':'手机的回话看不懂',exception:'发送程序出错了'}[e]
      ||(mail?(k==='failed'?'Gmail 没收下':'Gmail 没回确认，不知道发出去没有'):(k==='failed'?'手机没回“已弹出”':'没等到手机回话'));
    return `${step}：${why}`;
  }
  const shortWhy=r=>{const s=stuck(r);return s.slice(s.indexOf('：')+1).split('，')[0];};
  const sec=v=>{if(v&&typeof v==='object')return v;if(v==null)return '';const [n,unit]=v>=3600?[v/3600,'小时']:v>=60?[v/60,'分钟']:v>0&&v<1?[v*1000,'毫秒']:[v,'秒'];return `${Number(n.toFixed(n<10?1:0))} ${unit}`;};
  const took=r=>{
    const q=r.queue_seconds,s=r.send_seconds;
    if(r.status==='not_started')return '';
    if(typeof q==='number'&&typeof s==='number')return q>=60?`排队 ${sec(q)}才开始发，发了 ${sec(s)}`:`用了 ${sec(q+s)}`;
    return typeof s==='number'?`发了 ${sec(s)}`:'';
  };
  const marked=o=>o?.visibility==='owner'||o?.public==='owner',provided=field=>field&&typeof field==='object'&&!Array.isArray(field)?field.text??field.value:field;
  // 本人版原样给全；访客版藏起来的地方写“〈哪一样〉仅本人可见”。
  const lock=what=>`<span class="notify-private">${esc(what)}仅本人可见</span>`;
  function shown(v,what){
    if(v&&typeof v==='object'){
      if((v.hidden||v.hidden_block||marked(v))&&viewer!=='owner')return lock(what);
      const t=provided(v);return t==null?'':esc(String(t));
    }
    return v==null?'':esc(String(v));
  }
  const hiddenBatch=r=>viewer!=='owner'&&(r.hidden||marked(r));
  const titleOf=r=>{const v=r.title??r.text??r.body;return v==null||v===''?'':shown(v,'提醒标题');};
  function notificationLinks(r){
    if(!Array.isArray(r.keys)||viewer!=='owner')return '';
    const ids=[...new Set(r.keys.filter(key=>typeof key==='string'&&key.startsWith('pending:')).map(key=>key.slice(8).replace(/:urgent$/,'')).filter(Boolean))];
    return ids.map((id,index)=>{
      const url=new URL('/live/',location.origin);url.searchParams.set('item',id);url.hash='needs';
      if(fixture)url.searchParams.set('fixture',params.get('fixture'));
      return `<a class="more" href="${esc(url.pathname+url.search+url.hash)}">回到原事${ids.length>1?` ${index+1}`:''}，看现在的状态 ›</a>`;
    }).join(' · ');
  }
  const what=r=>{const t=titleOf(r),c=className(r);return [c?`「${esc(c)}」那条`:'一条提醒',t].filter(Boolean).join('：');};
  const hero=$('hero'),heroRead=U.reading(hero.querySelector('.card__body'),{ghost:U.ghost.card(2),name:'通知发送回执'});
  const boards=Object.fromEntries(['attention','overview','history'].map(k=>[k,V.board($(k),{key:`notifications-v3-${k}`,sync,
    ...(k==='overview'?{reading:hourReading}:{})})]));
  const rates=V.figures($('delivery-rates'));
  let page=null,all=null,issues=[],history=[],payload=null,viewer='public',now=null,cutoff=null,phase='idle',first=true,headline='',attentionScope='',historyScope='';
  let reading=null,shown_=null,collecting=false,redraw=false,emailScope=null,emailOpenScope=null;
  const bar=U.topbar({ask:()=>`帮我看看通知发送回执：${headline||U.collectionText()}，没到的是哪几条、为什么。`});
  function hourReading(id,point,t,surface){
    if(surface!=='hero'||point?.value==null||!Number.isFinite(point.at)||!payload)return null;
    const start=point.at*1000,end=Math.min(Math.floor(start/HOUR)*HOUR+HOUR,parse(payload.to));
    const a=new Date(start).toISOString(),b=new Date(end).toISOString();
    return {value:point.value,unit:'条',caption:interval(a,b)||stamp(a)};
  }
  L.add(hero);
  document.querySelectorAll('.stage a[href^="/live/"]').forEach(a=>{if(fixture){const u=new URL(a.href);u.searchParams.set('fixture',params.get('fixture'));a.href=u;}});
  const mode=key=>{const bins=new Map();all.filter(r=>r.status==='sent'&&typeof r[key]==='number').forEach(r=>bins.set(r[key],(bins.get(r[key])??0)+1));return [...bins].sort((a,b)=>b[1]-a[1])[0]?.[0];};
  const privateLine=(r,unit='条')=>r.private_count?lock(`另有 ${r.private_count} ${unit}提醒`):lock('这条提醒');
  const batchFolds=new Set();
  function rememberBatchFold(e){
    const key=e.target.dataset.batchFold;if(!key)return;
    if(e.target.open)batchFolds.add(key);else batchFolds.delete(key);
  }
  function attentionChapter(el){
    el.innerHTML='<div data-attention-groups></div><p class="delivery-note" data-attention-private hidden></p>';
    function draw(){
      const cards=issues.map(r=>r.private_count||hiddenBatch(r)?`<div class="delivery-private">${privateLine(r)}</div>`
        :`<div class="stut__card" data-status="${esc(kindOf(r))}"><span class="stut__t"><small>${at(r)&&typeof at(r)==='object'?'':U.date(at(r))===U.date(new Date().toISOString())?'':esc(U.date(at(r)))}</small>${at(r)&&typeof at(r)==='object'?shown(at(r),'时刻'):esc(U.time(at(r)))}</span>`
          +`<span class="stut__s">${shown(stateWord(r),'到没到')}</span><span class="stut__w"><b class="notify-what">${what(r)} · 走${shown(channel(r),'渠道')}</b>`
          +`<span class="notify-why">${esc(stuck(r))}</span>${notificationLinks(r)?`<span class="notify-link">${notificationLinks(r)}</span>`:''}`
          +`${took(r)?`<small class="notify-took">${shown(took(r),'耗时')}</small>`:''}</span></div>`);
      U.html(el.querySelector('[data-attention-groups]'),issues.length?`<div class="stut">${cards.join('')}</div>`
        :`<p class="delivery-note">${Array.isArray(page?.attention_rows)?page.attention_window?.complete===false?`有记录的部分里，给${you()}的提醒都到了`:`近 24 小时给${you()}的提醒都到了`:page?.attention_rows===null?'没到的清单这次没读到':'已读到的记录里，提醒都到了'}</p>`);
      const note=el.querySelector('[data-attention-private]'),count=issues.filter(r=>!r.private_count&&!hiddenBatch(r)).length;
      note.hidden=viewer==='owner'||!count;
      note.textContent=note.hidden?'':`这 ${count} 条各是哪件事，仅本人可见。`;
    }
    return {set:draw};
  }
  function historyChapter(el){
    el.addEventListener('toggle',rememberBatchFold,true);
    el.innerHTML='<p class="delivery-note" data-baseline></p><div data-history-groups></div><button class="more delivery-more" type="button" data-delivery-more hidden></button><p class="delivery-note" data-history-private hidden></p>';
    el.querySelector('[data-delivery-more]').onclick=()=>collect();
    function draw(){
      const q=mode('queue_seconds'),s=mode('send_seconds');
      el.querySelector('[data-baseline]').textContent=q!=null&&s!=null?`平常一条从排队到发完大约 ${sec(q+s)}。`:'';
      const table=rows=>'<table class="delivery-table"><thead><tr><th>时间</th><th>什么提醒</th><th>走哪路</th><th>到没到</th></tr></thead><tbody>'+rows.map(r=>{
        if(r.private_count||hiddenBatch(r))return `<tr><td colspan="4">${privateLine(r)}</td></tr>`;
        const k=kindOf(r),links=notificationLinks(r);
        return `<tr data-status="${esc(k)}"><td>${shown(stamp(at(r)),'时刻')}</td><td>${what(r)}${links?`<div>${links}</div>`:''}</td><td>${shown(way(r),'路线')}</td>`
          +`<td><span class="notify-state">${shown(stateWord(r),'到没到')}</span>${k!=='sent'?`<div class="notify-why">${esc(stuck(r))}</div>`:''}${took(r)?`<small class="notify-took">${shown(took(r),'耗时')}</small>`:''}</td></tr>`;
      }).join('')+'</tbody></table>';
      const groups=new Map();
      for(const r of history){const key=r.private_count||hiddenBatch(r)?'private':isMail(r)?'email':r.channel||'other';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
      const note=el.querySelector('[data-history-private]');note.hidden=viewer==='owner'||!history.length;note.textContent=note.hidden?'':'每一条对应哪件事，仅本人可见。';
      U.html(el.querySelector('[data-history-groups]'),[...groups].map(([key,items])=>{
        const id=`channel-${key}`,label=key==='private'?'其他提醒':key==='email'?'邮件':key==='phone'?'手机':channel(items[0])||'其他';
        return `<section class="delivery-group"><p class="delivery-note">${esc(label)} · ${items.length} 条</p>${table(items.slice(0,5))}${items.length>5?`<details data-batch-fold="${esc(id)}"${batchFolds.has(id)?' open':''}><summary class="more live-disclosure delivery-more"><span class="delivery-more__closed">展开（还有 ${items.length-5} 条）</span><span class="delivery-more__open">收起</span><span class="more__chev" aria-hidden="true">›</span></summary>${table(items.slice(5))}</details>`:''}</section>`;
      }).join(''));
    }
    return {set:draw};
  }
  function paint(){
    const absent=all===null&&(!!U.offline?.()||['none','gone'].includes(phase));['hero','attention','all-records'].forEach(id=>$(id).hidden=absent);$('missing').hidden=!absent;if(absent){$('missing').innerHTML=`<span class="lamp" aria-hidden="true"></span>${U.offline?.()?'这块没存下来，连上后补上。':'通知发送记录暂时读不到'}`;return;}
    const wait=all===null&&!['none','gone'].includes(phase),series=key=>payload?.series.find(s=>s.id===key)?.points.map(p=>p[1])||[];
    const known=series('total').filter(Number.isFinite),peak=known.length?Math.max(...known):null;
    const figure=(key,label,value,fields)=>({key,label,value,unit:'次',text:value!=null&&fields.some(k=>lower(page?.delivery24??page,k))?`至少 ${value} 次`:undefined});
    const kinds=new Set(issues.map(kindOf)),title=!issues.length?'没到的提醒':kinds.size===1&&kinds.has('unsure')?`还没确认到没到的 ${issues.length} 次`:kinds.size===1&&kinds.has('failed')?`没到的 ${issues.length} 次`:`没到或还没确认的 ${issues.length} 次`;
    boards.attention.set([{key:'attention',...page?.groups?.find(g=>g.key==='attention'),name:title,wait,line:attentionScope,palette:['apricot','violet'],figures:[],build:attentionChapter}]);
    boards.overview.set([{key:'overview',...page?.groups?.find(g=>g.key==='overview'),name:'每小时发了多少',wait,line:payload?.scope||U.collectionText(),palette:['teal','blue'],
      figures:[figure('peak',payload&&!payload.complete?'有记录的一小时最多':'一小时最多',peak,['total']),figure('latest-hour','最后一小时没到',series('attention').at(-1)??null,['attention','failed','pending','unconfirmed'])],
      chips:[{key:'hourly',label:'每小时的提醒',unit:'次',floor:0,lines:[{id:'sent',label:'到了',hue:'teal'},{id:'attention',label:'没到或没确认',hue:'apricot'}]}],
      say:()=>payload?.note||'每小时到了多少、没到多少'}]);
    boards.history.set([{key:'history',...page?.groups?.find(g=>g.key==='history'),name:'每一次',wait,line:!all?U.collectionText():(historyScope||'这次没读到明细'),palette:['blue','teal'],figures:[],build:historyChapter}]);
    if(payload)Object.values(boards).forEach(b=>b.data(payload));
    if(all){heroRead.done();L.lightUp([hero,...Object.values(boards).flatMap(b=>b.cards())]);}
    if(all===null&&['none','gone'].includes(phase))rates.set(null);
    loadingRows();
  }
  function loadingRows(){const ghost=$('attention').querySelector('.grp__ghost');if(ghost&&!ghost.querySelector('.fog__row'))ghost.innerHTML=U.ghost.rows(4);}
  function deliveryRates(d,end){
    const stats=d.delivery7,channels=stats?.channels,supplied=Array.isArray(channels),full=supplied&&stats.complete===true&&!incomplete(stats)&&!channels.some(incomplete);
    const hasRows=Array.isArray(d.rows),windowRows=all.filter(r=>parse(at(r))>=end-7*DAY&&parse(at(r))<=end);
    $('rates-title').textContent=full?'近 7 天到了多少':supplied?'近 7 天到了多少（只算有记录的部分）':'近 7 天到了多少（只算已读到的记录）';
    const totals=channels?.length?Object.fromEntries(['sent','total'].map(key=>[key,channels.map(r=>r[key]).find(v=>v&&typeof v==='object')||(channels.every(r=>validCount(r[key]))?channels.reduce((n,r)=>n+r[key],0):null)])):null;
    if(totals){totals.partial=['sent','total'].filter(key=>lower(stats,key)||channels.some(r=>lower(r,key)));totals.q=totals.partial.length?'partial':'ok';}
    const kind=r=>r.channel==='mail'?'email':r.channel;
    rates.set([...new Set(['all','phone','email',...(channels||windowRows).map(kind).filter(Boolean)])].map((key,i)=>{
      const rows=key==='all'?windowRows:windowRows.filter(r=>kind(r)===key),aggregate=key==='all'?totals:channels?.find(r=>kind(r)===key);
      const sent=supplied?aggregate?.sent:hasRows?rows.filter(r=>r.status==='sent').length:null,total=supplied?aggregate?.total:hasRows?rows.length:null;
      if(U.offline?.()&&sent==null&&total==null)return null;
      const rate=validCount(sent)&&validCount(total)&&total>0&&sent<=total?sent/total:null,q=supplied?aggregate:d,markedValue=[sent,total].find(v=>v&&typeof v==='object');
      const sub=sent==null||total==null?[sent!=null?`到了 ${countText(q,'sent',sent)} 次`:'',total!=null?`共 ${countText(q,'total',total)} 次`:''].filter(Boolean).join(' · '):`到了 ${countText(q,'sent',sent)} / ${countText(q,'total',total)} 次`;
      return {key,label:key==='all'?'全部':channel(aggregate||rows[0]||{channel:key}),text:markedValue??(rate!=null?`${Number((100*rate).toFixed(1))}%`:total===0?(full?'这 7 天没有发':'这部分没有发'):U.collectionText()),frac:rate,hue:full?['violet','teal','blue'][i<3?i:Array.from(key).reduce((n,c)=>(n+c.codePointAt(0))%3,0)]:'apricot',sub:markedValue||sub};
    }).filter(Boolean));
    const email=channels?.find(r=>kind(r)==='email');
    const emailDetails=$('email-gaps');
    emailScope=emailOpenScope??(full&&hasWindow(stats)&&validCount(email?.sent)&&validCount(email?.total)&&email.total>email.sent
      ?{count:email.total-email.sent,from:parse(stats.from),to:parse(stats.to)}:null);
    emailDetails.hidden=!emailScope;
    // 展开后按钮改说“收起”，一眼看得出已经打开、怎么收（M506）
    if(emailScope)U.html(emailDetails.querySelector('summary'),`<span class="disclosure-closed">看这 7 天没确认到的 ${emailScope.count} 封邮件</span><span class="disclosure-open">收起这 ${emailScope.count} 封邮件</span><span class="disclosure-chev" aria-hidden="true">›</span>`);
    else emailDetails.open=false;
    if(emailDetails.open)drawEmailGaps();
    const notes=[interval(stats?.from,stats?.to),stats?.gap,...(channels||[]).map(r=>r.gap)].filter(Boolean);
    U.html($('rates-note'),[...new Set(notes)].map(v=>typeof v==='string'?esc(plainGap(v)):shown(v,'记录范围')).join(' · '));
    $('rates-note').hidden=!$('rates-note').innerHTML;
  }
  const plainGap=v=>v.replace(/^发送日志未覆盖完整七天或有不完整记录，只统计(?:有记录|已读)的批次$/,'记录不满 7 天或有残缺，只算有记录的').replace('只统计已读批次','只算有记录的').replace(/批次/g,'次').replace(/批/g,'次');
  function emailGapRows(rows,scope=emailScope){
    return scope?(rows||[]).filter(r=>isMail(r)&&r.status!=='sent'&&parse(at(r))>=scope.from&&parse(at(r))<=scope.to):[];
  }
  function drawEmailGaps(){
    let rows=emailGapRows(all,emailOpenScope??emailScope);
    if(emailOpenScope){
      if(emailOpenScope.rows?.length>rows.length)rows=emailOpenScope.rows;
      else emailOpenScope.rows=rows;
    }
    const cards=rows.map(r=>r.private_count||hiddenBatch(r)
      ?`<li>${privateLine(r,'封')}</li>`
      :`<li><b>${esc(U.date(at(r))+' '+U.time(at(r)))}</b> · ${what(r)} · ${esc(stateWord(r))}<div class="notify-why">${esc(stuck(r))}</div></li>`);
    const missing=(emailOpenScope??emailScope)?.count>rows.length;
    U.html($('email-gaps').querySelector('[data-email-gaps]'),(cards.length?`<ul class="rows list">${cards.join('')}</ul>`:'')
      +(missing?`<p class="delivery-note">${collecting?'正在查这一周的邮件…':U.offline?.()?'其余几封没有存到这份离线数据里。':'其余几封暂时没读到。'}</p>`:''));
  }
  $('email-gaps').addEventListener('toggle',async e=>{
    if(!e.target.open){emailOpenScope=null;if(shown_)show(shown_);return;}
    if(!emailScope)return;
    const scope=emailOpenScope={...emailScope};
    if(emailGapRows(all,scope).length<scope.count&&reading?.next){
      const request=collect(Infinity,batch=>emailGapRows(batch.rows,scope).length>=scope.count);
      drawEmailGaps();
      await request;
    }
    drawEmailGaps();
  });
  const validCount=n=>Number.isInteger(n)&&n>=0,incomplete=o=>o?.complete===false||['partial','unknown'].includes(o?.q)||lower(o,'total')||lower(o,'sent');
  const hasWindow=w=>parse(w?.from)<=parse(w?.to);
  const gapNames={log_unavailable:'发送记录',before_first_receipt:'最早一条之前的记录',unknown_start:'记录从哪天开始',invalid_receipt:'发送结果',missing_completion_time:'发完的时刻'};
  function hourly(d,summary,from,end,recent,counts,loadedFrom,loadedTo,detailComplete){
    const start=Math.floor(from/HOUR)*HOUR,bins=Array.from({length:Math.floor((end-start)/HOUR)+1},()=>null);
    const source=summary?.hourly,reported=Array.isArray(source),gaps=(d.coverage?.gaps||[]).filter(g=>!hasWindow(g)||parse(g.to)>from&&parse(g.from)<=end);
    const totalsMatch=(n,s)=>n===summary?.total&&s===summary?.sent;
    let complete=false;
    if(reported){
      let damaged=false;
      for(const r of source){
        const time=parse(r?.at),i=Math.floor((time-start)/HOUR);
        if(!(time>=start&&time<=end)){damaged=true;continue;}
        const valid=!bins[i]&&validCount(r.sent)&&validCount(r.attention)&&(r.total===undefined||r.total===r.sent+r.attention);
        bins[i]=valid?[r.sent,r.attention]:[];damaged||=!valid;
      }
      const sum=i=>bins.reduce((n,b)=>n+(b?.[i]??0),0);
      complete=!incomplete(summary)&&!damaged&&totalsMatch(sum(0)+sum(1),sum(0));
    } else {
      complete=detailComplete&&(summary?(!incomplete(summary)&&totalsMatch(counts.total,counts.sent)):(loadedFrom<=from&&loadedTo>=end));
      for(const r of recent){
        const i=Math.floor((parse(at(r))-start)/HOUR);
        (bins[i]??=[0,0])[r.status==='sent'?0:1]++;
      }
    }
    const missing_intervals=[];
    const points=bins.map((bucket,i)=>{
      const left=Math.max(from,start+i*HOUR),right=Math.min(end,start+(i+1)*HOUR);
      const gap=gaps.find(g=>!hasWindow(g)||parse(g.from)<right&&parse(g.to)>left);
      const covered=complete||!gap&&(reported?bucket&&gaps.length>0:loadedFrom<=left&&loadedTo>=right);
      const values=bucket?.length===0||!covered&&!bucket?.some(Boolean)?[null,null]:bucket??[0,0];
      if(values[0]===null&&left<right){
        const reason=gap?provided(gap.text)||gapNames[gap.reason]:undefined,previous=missing_intervals.at(-1);
        if(previous?.[1]===left/1000&&previous[2]===reason)previous[1]=right/1000;
        else missing_intervals.push([left/1000,right/1000,reason]);
      }
      const [sent,attention]=values;
      return [left/1000,sent,attention,sent==null?null:sent+attention];
    });
    const total=points.reduce((n,p)=>n+(p[3]??0),0),sent=points.reduce((n,p)=>n+(p[1]??0),0);
    const scope=complete?'近 24 小时':reported?'有记录的部分':'已读到的记录';
    const note=!points.some(p=>p[3]!=null)?'这段时间每小时发了多少还没读到':complete&&total>0&&total===sent?`近 24 小时 ${total} 次全部到了`:
      [`${scope} ${total} 次，到了 ${sent} 次`,!complete&&validCount(summary?.total)?`这段时间一共 ${countText(summary,'total',summary.total)} 次`:''].filter(Boolean).join(' · ');
    const series=['sent','attention','total'].map((id,i)=>({id,label:['到了','没到或没确认','全部'][i],unit:'条',points:points.map(p=>[p[0],p[i+1]])}));
    const a=new Date(from).toISOString(),b=new Date(end).toISOString();return {from:a,to:b,series,complete,scope:`${interval(a,b)} · ${scope}`,note,bucket_seconds:3600,missing_intervals};
  }
  function attentionRows(d,rows){
    const list=Array.isArray(d.attention_rows)?d.attention_rows:d.attention_rows===null?[]:rows.filter(r=>r.status!=='sent');
    const times=list.map(at).filter(t=>Number.isFinite(parse(t))).sort((a,b)=>parse(a)-parse(b)),a=times[0],b=times.at(-1);
    const end=parse(d.window?.to),window=d.attention_window;
    const bounds=hasWindow(window)?window:d.attention_rows!==undefined&&Number.isFinite(end)?{from:new Date(end-DAY).toISOString(),to:d.window.to}:null;
    const scoped=bounds&&(!a||parse(a)>=parse(bounds.from)&&parse(b)<=parse(bounds.to));
    attentionScope=scoped?[`近 24 小时（${interval(bounds.from,bounds.to)}）`,window?.complete===false?'只算有记录的部分':''].filter(Boolean).join(' · ')
      :[d.attention_rows===undefined?'已读到的记录':'',interval(a,b)].filter(Boolean).join(' · ');
    return [...list].sort((x,y)=>(parse(at(y))||-Infinity)-(parse(at(x))||-Infinity));
  }
  function tally(rows){
    const counts={total:rows.length,sent:0,failed:0,pending:0,unconfirmed:0};
    for(const {status} of rows)counts[status==='not_started'?'pending':['sent','failed'].includes(status)?status:'unconfirmed']++;
    return counts;
  }
  const audience=meta=>JSON.stringify([meta.viewer?.kind,meta.viewer?.device]);
  // 同一批分页共用采集窗口，rev 只对应单页。
  const snapshot=(d,meta)=>d.window?.from&&d.window?.to
    ?JSON.stringify([d.window.from,d.window.to])
    :meta.seq>=0?meta.seq:meta.rev;
  function appendRows(batch,rows){
    for(const row of rows){
      const id=row.batch_id??row.id;
      if(typeof id==='string'&&id!==''||typeof id==='number'){
        if(batch.ids.has(id))continue;
        batch.ids.add(id);
      }
      batch.rows.push(row);
    }
  }
  function show(batch){
    shown_=batch;renderDelivery(batch);
  }
  async function collect(depth,complete){
    if(!reading?.next||collecting)return;
    depth??=Math.max(shown_?.sources.length??1,reading.sources.length+1);
    const viewerKey=reading.audience;
    let rebased=false;
    collecting=true;updateHistoryControl();
    try {
      while(reading?.audience===viewerKey&&reading.next&&reading.sources.length<depth&&!complete?.(reading)){
        const batch=reading,cursor=batch.next;
        const response=fixture?{data:batch.first.pages?.[cursor]}:await window.Live.get(resource,{cursor},undefined,{fallbackOnFailure:true}).catch(()=>null);
        if(batch!==reading)continue;
        const data=response?.data;
        const saved=response?.meta?.source==='fallback';
        if((response?.meta?.status>=400&&!saved)||!Array.isArray(data?.rows)||data.next===cursor){batch.failed=true;show(batch);return;}
        if(!fixture&&(audience(response.meta)!==viewerKey||snapshot(data,response.meta)!==batch.version)){
          if(!rebased){
            rebased=true;
            await window.Live.get(resource,null).catch(()=>null);
            if(batch!==reading)continue;
          }
          batch.failed=true;return;
        }
        batch.sources.push(data);appendRows(batch,data.rows);batch.next=data.next;batch.failed=false;
      }
      if(reading?.audience===viewerKey)show(reading);
    } finally {
      collecting=false;
      updateHistoryControl();
    }
  }
  function updateHistoryControl(){
    const button=$('history').querySelector('[data-delivery-more]');
    if(!button)return;
    button.hidden=!reading?.next;
    button.disabled=collecting;
    button.textContent=reading?.failed?(U.offline?.()?'更早的记录没有存下来，连上后再读 ›':'更早的记录暂时读不到，再试一次 ›'):'再显示更早的记录 ›';
  }
  function clearDelivery(){
    page=all=payload=emailScope=emailOpenScope=null;headline=attentionScope=historyScope='';issues=[];
    $('email-gaps').hidden=true;$('email-gaps').open=false;
    U.html($('head'),U.head('通知发送回执',{lamp:false}));
    ['note','latest','attention-note','rates-note','coverage-note','all-sub'].forEach(id=>U.html($(id),''));
    $('attention-note').hidden=true;
    heroRead.done(false);L.tone(hero,'none');rates.set(null);
    Object.values(boards).forEach(b=>b.set([]));
    paint();
  }
  // 首屏那句话：没到的按“渠道 + 原因”归拢，几条一句说完。
  function problemLine(rows){
    const parts=[['failed','没到'],['not_started','没发出去'],['unsure','还没确认到没到']].map(([k,label])=>{
      const list=rows.filter(r=>!r.private_count&&!hiddenBatch(r)&&kindOf(r)===k);if(!list.length)return '';
      const groups=new Map();for(const r of list){const key=`${channel(r)}（${k==='not_started'?shortWhy(r)||'还在排队':shortWhy(r)}）`;groups.set(key,(groups.get(key)??0)+1);}
      const detail=[...groups].map(([key,n])=>key.replace('（',` ${n} 次（`)).join('、');
      return `${list.length} 次${label}：${detail}`;
    }).filter(Boolean);
    const hidden=rows.reduce((n,r)=>n+(r.private_count||(hiddenBatch(r)?1:0)),0);
    if(hidden)parts.push(`另有 ${hidden} 次没到的提醒仅本人可见`);
    return parts.join('；');
  }
  function renderDelivery({first:d,rows,next,sources}){
    page=d;
    all=rows.sort((a,b)=>(parse(at(b))||-Infinity)-(parse(at(a))||-Infinity));
    const times=all.map(at).filter(t=>Number.isFinite(parse(t))),oldest=parse(times.at(-1)),latest=parse(times[0]);
    const observed=d.window,readEnd=parse(cutoff||now)||Date.now(),rateEnd=parse(d.delivery7?.to)||readEnd;
    const summary=hasWindow(d.delivery24)?d.delivery24:null,end=summary?parse(summary.to):parse(observed?.to)||readEnd,from=summary?parse(summary.from):end-DAY;
    const inWindow=r=>parse(at(r))>=from&&parse(at(r))<=end,recent=all.filter(inWindow),counts=tally(recent);
    const detailsKnown=Array.isArray(d.rows)&&all.length===times.length&&!sources.some(incomplete);
    const loadedFrom=detailsKnown?next?oldest:parse(d.coverage?.from)||oldest:Infinity,loadedTo=parse(observed?.to)||latest;
    const detailComplete=detailsKnown&&(!next||oldest<from)&&(!hasWindow(observed)||parse(observed.from)<=from&&loadedTo>=end);
    payload=hourly(d,summary,from,end,recent,counts,loadedFrom,loadedTo,detailComplete);
    deliveryRates(d,rateEnd);
    issues=attentionRows(d,all);history=all;
    const totals=summary||(Array.isArray(d.rows)?counts:{});
    const scope=summary?(incomplete(summary)?'（只算有记录的部分）':''):payload.complete?'':'（只算已读到的记录）';
    const allArrived=validCount(totals.total)&&validCount(totals.sent)&&totals.total>0&&totals.total===totals.sent&&!issues.length;
    // 首句按渠道说：手机没有“已弹出”回执，只能说发到手机几条；邮件说交给 Gmail 几条。后台给了近 24 小时分渠道的数才这样写。
    const perChannel=Array.isArray(summary?.channels)?[['phone','发到手机'],['email','邮件交给 Gmail']].map(([id,label])=>{
      const c=summary.channels.find(c=>c.channel===id||id==='email'&&c.channel==='mail');
      return c&&validCount(c.sent)&&!(validCount(c.total)&&c.total===0)?`${label} ${countText(c,'sent',c.sent)} 次`:'';
    }).filter(Boolean).join('、'):'';
    // 后台按“发送批次”数：一次发送可能含两件事，所以写“次”不写“条”；近 24 小时这句写它自己的截止时刻，和下面明细读到的时刻分开（M501、M063）
    const dayEnd=summary&&Number.isFinite(parse(summary.to))?`（截至 ${stamp(summary.to)}）`:'',most=Math.max(1,...recent.map(r=>Number.isFinite(r.count)?r.count:1)),multi=most>1?`（有的一次含 ${most} 件事）`:'';
    headline=!validCount(totals.total)?'近 24 小时发了多少次提醒，还没读到'
      :totals.total===0?`近 24 小时${dayEnd}${scope}没有给${you()}发提醒`
      :`近 24 小时${dayEnd}${scope}给${you()}发了 ${countText(summary||d,'total',totals.total)} 次提醒${multi}，${perChannel||(allArrived?'全部到了':`到了 ${validCount(totals.sent)?countText(summary||d,'sent',totals.sent):U.collectionText()} 次`)}`;
    const row=all[0];
    const gaps=d.coverage?.gaps||[],failed=d.read_error??(gaps.some(g=>g.reason==='log_unavailable')||/打不开|读取失败|读取超时/.test(provided(d.gap)||''));
    const sourceAt=Object.hasOwn(d,'source_at')?d.source_at:observed?.to??d.coverage?.at??d.at,stale=d.gray_reason==='stale'||d.q==='stale'||d.stale===true||d.state==='stale';
    const cutoffOnly=v=>{
      const text=U.sp(v),time=/(?:((?:\d{4}-)?\d\d-\d\d)\s+)?(\d\d:\d\d)/.exec(text);
      return time&&time[2]===U.time(sourceAt)&&(!time[1]||time[1].endsWith(U.date(sourceAt).slice(-5)))&&
        (U.isReadingCutoff(v)||/^(?:上次记录于|沿用)\s*\d/.test(text));
    };
    const oldReading=stale&&!failed&&['gray','off'].includes(d.level)&&Number.isFinite(parse(sourceAt));
    const staleLine=oldReading?`记录读到 ${stamp(sourceAt)} 为止`:'';
    // 后台的 why 是第一条没到的结果类别（“结果未知”这类），首屏那句已经说清，不再重复。
    // 后台汇总句“通知尚未确认送达等 N 项”“通知发送失败等 N 项”和上面逐条点名的是同一组数，有那一行时不再说第二遍（M278）
    const why=oldReading&&cutoffOnly(d.why)||/^(?:结果未确认|结果未知|失败|未开始)$/.test(U.sp(d.why||''))||issues.length&&/^通知(?:尚未确认送达|发送失败)/.test(U.sp(d.why||''))?'':d.why;
    const missingNames={...gapNames,at:'发完的时刻',queue_seconds:'排队用时',send_seconds:'发送用时',delivery24:'近 24 小时的统计',delivery7:'近 7 天的统计',attention_rows:'没到的清单',...d.missing_names};
    // 没到的那几条上一行已经逐条点名，这里不再另写“N 项要处理”
    const header=U.status({...d,gray_count:undefined,attention_count:issues.length?0:d.attention_count,why:why||(!failed&&['gray','off'].includes(d.level)&&!oldReading?'通知记录没有更新':undefined),
      stale_text:oldReading?staleLine:d.stale_text},{missingNames,showZeroFixing:false,cutoffShown:oldReading?cutoffOnly:undefined});
    const namedMissing=header.tone==='gray'?[]:Object.entries(d.missing||{}).map(([key,reason])=>combine([missingNames[key]||(/[\u3400-\u9fff]/.test(key)?key:''),/[\u3400-\u9fff]/.test(reason)||typeof reason==='object'?reason:'']));
    const coverageNotes=[...new Set([...(d.coverage?.missing||[]),...namedMissing,...sources.filter(incomplete).map(o=>o.gap),...gaps.map(g=>g.text||combine([gapNames[g.reason]&&'缺'+gapNames[g.reason],interval(g.from,g.to)]))])].filter(v=>v&&!(oldReading&&cutoffOnly(v)));
    U.html($('head'),header.lamp+U.head(headline,{lamp:false}));
    const problems=problemLine(issues);
    U.html($('note'),problems?`${esc(problems)} <a class="more" href="#attention">看是哪几次 ›</a>`:'');
    U.html($('latest'),row?`最近一条：${shown(stamp(at(row)),'时刻')}，发到${shown(channel(row),'渠道')}，${shown(stateWord(row),'到没到')}`:'');
    const attentionNote=$('attention-note');
    U.html(attentionNote,[header.note].filter(Boolean).map(line=>`<span>${line}</span>`).join(''));
    attentionNote.hidden=!attentionNote.innerHTML;
    U.html($('coverage-note'),coverageNotes.map(v=>typeof v==='string'?esc(plainGap(v)):shown(v,'记录范围')).filter(Boolean).join(' · '));
    $('coverage-note').hidden=!$('coverage-note').innerHTML;
    const bounds=[times.at(-1),times[0],...sources.flatMap(o=>[o.records_window?.from,o.records_window?.to])]
      .filter(t=>Number.isFinite(parse(t))).sort((a,b)=>parse(a)-parse(b));
    const span=interval(bounds[0],bounds.at(-1));
    historyScope=Array.isArray(d.rows)?`已读到 ${all.length} 次${span?`（${span}）`:''}`:'';
    const week=d.delivery7?.channels,weekSent=Array.isArray(week)&&week.every(r=>validCount(r.sent)&&validCount(r.total))?[week.reduce((n,r)=>n+r.sent,0),week.reduce((n,r)=>n+r.total,0)]:null;
    const weekEnd=Number.isFinite(parse(d.delivery7?.to))?`（截至 ${stamp(d.delivery7.to)}）`:'';
    U.html($('all-sub'),weekSent?`近 7 天${weekEnd}${weekSent[1]} 次，到了 ${weekSent[0]} 次 · 里面有每小时的走势和每一次的明细`:'近 7 天的比例、每小时的走势和每一次的明细');
    L.tone(hero,header.tone);paint();updateHistoryControl();if(first){first=false;boards.attention.open('attention',true);boards.overview.open('overview',true);boards.history.open('history',true);}
  }
  paint();boards.attention.open('attention',true);
  window.Live.watch(resource,null,{
    data(d,meta){
      const kind=audience(meta),sameViewer=kind===reading?.audience,available=Array.isArray(d?.rows)||!!(d?.delivery24||d?.delivery7);
      const version=available?snapshot(d,meta):null;
      viewer=meta.viewer.kind;redraw=true;
      if(available&&sameViewer&&version===reading.version){
        reading.first=d;reading.sources[0]=d;
        return;
      }
      if(!available||!sameViewer){shown_=null;emailOpenScope=null;$('email-gaps').open=false;}
      reading=available?{audience:kind,version,first:d,rows:[],ids:new Set(),next:d.next,sources:[d]}:null;
      if(Array.isArray(d?.rows))appendRows(reading,d.rows);
    },
    link(s){
      const fallback=s.fallbackNote||s.meta?.fallbackNote;
      bar?.set(s.offline?{...s,cutoffAt:null}:s);L.offline(s.offline);U.list($('notices'),s.offline?[{key:'offline',cls:'notice glass',html:`<span class="lamp" aria-hidden="true"></span><span>${U.fieldHtml(fallback?s.text.split(' · ',1)[0]:s.text,{name:'连接状态',place:'body',kind:viewer})}</span>`}]:[]);
      const draw=redraw||now!==s.now||cutoff!==s.cutoffAt;
      now=s.now;cutoff=s.cutoffAt;
      if(redraw&&!reading){phase='none';clearDelivery();}
      else if(reading&&!shown_)show(reading);
      else if(reading&&reading!==shown_&&!collecting&&!reading.failed&&!s.offline){
        if(reading.next&&shown_.sources.length>1)collect(shown_.sources.length);
        else show(reading);
      } else if(shown_&&draw&&!collecting&&(reading===shown_||s.offline))renderDelivery(shown_);
      redraw=false;
      U.blockNote(hero.querySelector('.card__body'),!s.offline&&fallback&&s.shownAt&&['copy','fallback'].includes(s.meta?.source)?{...s,fallbackNote:`这次没有读到新记录，正在显示 ${U.date(s.shownAt)} 的上一份通知明细。`}:s);
    },
    phase(s){phase=s.phase;if(!s.data){heroRead.set(s);Object.values(boards).forEach(b=>b.phase(s));if(s.phase==='none'||s.phase==='gone')clearDelivery();}}
  });
  requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('is-ready')));
})();

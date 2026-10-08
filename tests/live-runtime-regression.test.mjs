import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
const model=await import(new URL('../app/computer-access-model.js',import.meta.url));

const now = Date.parse('2026-10-04T02:00:00+08:00');
const iso = n => new Date(n).toISOString();
class TestDate extends Date { static now() { return now; } }
const sharedSource = readFileSync(new URL('../scripts/site-live-runtime.js', import.meta.url), 'utf8');
const sharedSandbox = { module: { exports: {} }, Date: TestDate, Intl, Object, Number, Map, Set };
vm.runInNewContext(sharedSource, sharedSandbox);
const live = sharedSandbox.module.exports;
const compiledB2=execFileSync('python',['-c',"import importlib.util,pathlib; p=pathlib.Path('scripts/prepare-cockpit-cache.py'); s=importlib.util.spec_from_file_location('cockpit_cache',p); m=importlib.util.module_from_spec(s); s.loader.exec_module(m); print(m.patch_cockpit_cache(pathlib.Path('scripts/b2-live-runtime.js').read_text(encoding='utf8')))"] ,{cwd:fileURLToPath(new URL('..',import.meta.url)),encoding:'utf8'});
function storage() { const values = new Map(); return { getItem: k => values.get(k) || null, setItem: (k,v) => values.set(k,v), removeItem: k => values.delete(k) }; }
function block(items) { return { state: items.length ? 'ok' : 'empty', items, observed_at: iso(now), max_age_seconds: 120 }; }
function fixture() {
 const sample = raw => ({ ...raw, state: 'ok', sources: Object.fromEntries(Object.keys(raw).map(k => [k, { status: 'ok', observed_at_unix: now/1000 }])) });
 return {
  observed_at_unix: now/1000, host: { screen_state: 'unlocked', uptime_seconds: 600 }, personal_data: { state: 'unlocked', expires_at_unix: now/1000+90000 }, unrestricted: { state: 'inactive' },
  automation: block([{ id: 'task-privatehash', enabled: true, mine: true, state: 'success', plain: { name: '每日检查', what: '检查设备' }, last_run_at: '2026-09-28T02:30:00+08:00', next_run_at: '2026-10-05T02:30:00+08:00' }]),
  backups: block([{ id: 'task-backuphash', name: '中文备份', project: '中文备份', enabled: true, state: 'success', cadence: 'daily', last_success_at: iso(now-3600000) }]),
  remote_network: block([{id:'internet',state:'online'}]),backup_inventory: block([]),
  projects: block([{ project: '示例项目', state: 'ok', run_health: 'ok', overview: 'ok', failed_count: 0 }]), pending: block([]), today: block([]),
  hardware: { state: 'ok', cpu: sample({ model: '处理器', usage_percent: 12, temperature_celsius: 40, power_watts: 20 }), memory: sample({ used_bytes: 8*1024**3, total_bytes: 32*1024**3 }), network: sample({ connected: true, download_bytes_per_second: 0, upload_bytes_per_second: 0 }), display: sample({ width_px: 1440, height_px: 1000, refresh_hz: 60 }), volumes: [sample({ letter: 'E:', free_bytes: 100*1024**3, total_bytes: 200*1024**3 })] }
 };
}
function cockpit(saved=storage()) {
 let current=now;class ClockDate extends Date {static now(){return current;}}
 const source=compiledB2.replace(/^import[^\n]*\n/,'');
 const pure=source.slice(0,source.indexOf('function rectStyle('));
 const slots=['cockpit-overall','cockpit-quick-1','cockpit-quick-2','cockpit-quick-3','cockpit-quick-4','cockpit-quick-5','cockpit-pc','cockpit-tasks','cockpit-backups','cockpit-projects','cockpit-today','cockpit-attention','cockpit-remote','cockpit-grafana','cockpit-security','cockpit-security-unrestricted','cockpit-security-windows'];
 const sandbox={...model,Date:ClockDate,Intl,URLSearchParams,localStorage:saved,sessionStorage:storage(),window:{SiteLiveRuntime:live,top:null},location:{origin:'https://wly0829.cn',hash:'',search:''},document:{querySelector:()=>({textContent:JSON.stringify({kind:'cockpit',page:'cockpit',project:null,screens:[{parts:[{native_live:slots.map(slot=>({slot}))}]}]})}),querySelectorAll:()=>[]},setTimeout:(...args)=>setTimeout(...args).unref(),clearTimeout};
 sandbox.window.top=sandbox.window;
 const copying=source.slice(source.indexOf('function cpCopyMeta('),source.indexOf('function cpNoticeNode('));
 vm.runInNewContext(pure+copying+"\nglobalThis.subject={value,time,slotTime,grafanaGroupValue,summary,cpTyped,cpItemTime,pendingRows,cpCopyMeta,cpCopyRecords,cpCopyPrompt,cpCopyReady,operationRecords(request,items=[]){grant=request;actions=items;},set(data,p='ready',at=data?.observed_at_unix){status=data?adaptStatus(data):null;phase=p;lastRead=p==='ready'?clock():at||0;if(p==='ready')rememberCockpitValues(lastRead*1000);}};",sandbox);
 return {...sandbox.subject,advance(ms){current+=ms;}};
}
const groupUrls={all:'https://grafana.wly0829.cn/public-dashboards/cccccccccccccccccccccccccccccccc?theme=light','cpu-gpu':'https://grafana.wly0829.cn/public-dashboards/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa?theme=light','memory-network':'https://grafana.wly0829.cn/public-dashboards/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb?theme=light'};
function groupedFixture(){const data=fixture();data.grafana={state:'reachable',checked_at:iso(now),public_dashboard_state:'reachable',public_dashboard_checked_at:iso(now),public_dashboard_url:groupUrls.all,groups:Object.fromEntries(['cpu-gpu','memory-network'].map((part,i)=>[part,{state:'reachable',checked_at:iso(now-(i+1)*60000),url:groupUrls[part],max_age_seconds:300}]))};return data;}

test('cockpit read completion rearms the observer deadline once without busy polling',async()=>{
 const source=readFileSync(new URL('../scripts/b2-live-runtime.js',import.meta.url),'utf8');
 const start=source.indexOf('let pollTimer,pollObserverTried=null;'),end=source.indexOf("document.addEventListener('visibilitychange'",start);
 let seconds=1080,timer,calls=0,healthy=true;
 const sandbox={formal:true,document:{hidden:false},busy:false,statusReading:false,data:{kind:'cockpit'},status:{automation:{observed_at_unix:1000,max_age_seconds:120}},
  blockTime:b=>b.observed_at_unix,blockHealth:()=>healthy?'ok':'stale',online:()=>true,clock:()=>seconds,
  clearTimeout(){},setTimeout(fn,delay){timer={fn,delay};return timer;},async readStatus(options){calls++;assert.equal(typeof options.refresh,'boolean');}};
 vm.runInNewContext(source.slice(start,end)+'\nglobalThis.rearm=schedule;',sandbox);
 sandbox.rearm();assert.equal(timer.delay,20000);
 seconds=1100;await timer.fn();assert.equal(calls,1);assert.equal(timer.delay,60000);
 sandbox.rearm();assert.equal(timer.delay,60000);assert.equal(calls,1);
 sandbox.status.automation.observed_at_unix=1080;seconds=1160;sandbox.rearm();assert.equal(timer.delay,20000);
 sandbox.busy=true;await timer.fn();assert.equal(calls,1);assert.equal(timer.delay,60000);
 sandbox.busy=false;sandbox.rearm();seconds=1180;await timer.fn();assert.equal(calls,2);
 healthy=false;sandbox.rearm();assert.equal(timer.delay,60000);
 sandbox.document.hidden=true;sandbox.rearm();assert.equal(calls,2);
 assert.match(source,/render\(\);schedule\(\);\},error=>/);
});

test('authorization result surface distinguishes no request, unknown outcome and an actual receipt, even offline',()=>{
 const app=cockpit();app.set(fixture());assert.equal(app.value('ca-results').empty,true);assert.equal(app.value('ca-toast').empty,true);
 app.operationRecords({request_id:'request',state:'unknown'});let result=app.value('ca-results');assert.equal(result.state,'warn');assert.match(result.rows[0].text,/结果尚未确认/);assert.match(result.rows[0].detail,/请查询/);
 app.operationRecords({request_id:'request',state:'succeeded'});app.set(null,'error',now/1000);result=app.value('ca-results');assert.match(result.rows[0].text,/已完成/);assert.equal(result.operation,true);assert.notEqual(result.state,'ok');
});

test('a fresh partial authority readback retains only that field while an expired collector remains a gap',()=>{
 const data=fixture(),app=cockpit();data.served_at_unix=now/1000;
 data.display_cache={collectors:{authorization:{state:'error',observed_at_unix:now/1000-900},hardware:{state:'ready',observed_at_unix:now/1000},dashboard:{state:'ready',observed_at_unix:now/1000}}};
 data.personal_data={state:'locked',observed_at_unix:now/1000};app.set(data);
 assert.equal(app.value('ca-personal-data').state,'closed');assert.match(app.value('ca-personal-data').text,/锁着/);
 assert.equal(app.value('ca-unrestricted').state,'unknown');
 assert.equal(app.value('cockpit-attention').state,'unknown');assert.match(app.summary().text,/事项明细.*没读到/);
});

test('LC-01/02: source-backed drive letters and backup names remain readable Chinese',()=>{
 const app=cockpit(),data=fixture();data.cockpit={detail_groups:{need_you:[],ai_following:[],deferred:[],history:[]}};app.set(data);
 const pc=app.value('cockpit-pc');assert.ok(pc.rows.some(x=>x.text.startsWith('E：')));assert.ok(!JSON.stringify(pc).includes('[object Object]'));assert.ok(!pc.rows.some(x=>x.text.includes('::')||x.text.includes(':：')));
 const backup=app.value('cockpit-backups');assert.match(backup.rows[0].text,/中文备份/);assert.ok(!JSON.stringify(backup).includes('[object Object]'));
});
test('LC-05: past, future and next-year timestamps retain Beijing calendar dates',()=>{
 const app=cockpit(),data=fixture();data.backups.items[0].last_success_at='2026-09-28T10:30:00+08:00';app.set(data);
 assert.match(app.time(Date.parse('2026-09-28T10:30:00+08:00')/1000),/9月28日 10:30/);
 assert.match(app.time(Date.parse('2026-10-05T02:30:00+08:00')/1000),/10月5日 02:30/);
 assert.match(app.time(Date.parse('2027-01-01T00:30:00+08:00')/1000),/2027年1月1日 00:30/);
 assert.match(app.value('cockpit-security').text,/10月5日 03:00/);
});
test('LC-04: a missing hardware metric remains unknown; absent typed groups cannot assert a current conclusion',()=>{
 for(const patch of [data=>data.hardware.cpu.sources.temperature_celsius.status='unavailable',data=>data.hardware.memory.used_bytes=null,data=>data.hardware.volumes[0].sources.free_bytes.status='unknown',data=>data.hardware.gpus=[{state:'ok',model:'显卡',usage_percent:null,temperature_celsius:40,vram_used_bytes:0,vram_total_bytes:1024}]]){
  const data=fixture();patch(data);const app=cockpit();app.set(data);assert.notEqual(app.value('cockpit-pc').state,'ok');assert.equal(app.value('cockpit-overall').state,'unknown');assert.match(app.value('cockpit-overall').text,/当前结论不完整/);
 }
});
test('LC-07: upgrade observation failure is a failed result',()=>{
 const data=fixture();data.automation.items[0]={...data.automation.items[0],project:'AI 工具入口',plain:{name:'AI 工具升级观察'},state:'failed',last_run_at:iso(now-60000)};
 const result=live.parse(data,'watch','AI 工具入口',now);assert.equal(result.state,'failed');assert.match(result.text,/失败/);
});
test('unreadable metrics from one hardware source fold into one row with complete details',()=>{
 const data=fixture();data.hardware.cpu.usage_percent=null;data.hardware.cpu.temperature_celsius=null;data.hardware.memory.used_bytes=null;
 const app=cockpit();app.set(data);const rows=app.pendingRows().filter(x=>x.key?.startsWith('read-gap:hardware'));
 assert.equal(rows.length,1);assert.match(rows[0].text,/电脑读数从 今天 02:00 起读不到（共 3 项）/);assert.equal(rows[0].children.length,3);
 assert.ok(rows[0].children.some(x=>x.text.includes('处理器的温度')));assert.ok(rows[0].children.every(x=>x.detail.includes('今天 02:00')));
});
test('a stale live chart cannot be represented or cached as a historical chart',()=>{
 const data=fixture();data.grafana={checked_at:iso(now-3600000),public_dashboard_state:'reachable',public_dashboard_url:'https://fixture.invalid/chart'};
 const app=cockpit();app.set(data);let chart=app.value('cockpit-grafana');assert.equal(chart.state,'unknown');assert.equal(chart.cached,false);assert.equal(chart.iframe,undefined);
 app.set(null,'error',now/1000);chart=app.value('cockpit-grafana');assert.equal(chart.cached,false);assert.equal(chart.iframe,undefined);
});

test('the current public status dashboard field mounts the anonymous chart and respects explicit failures',()=>{
 const data=fixture(),url='https://grafana.wly0829.cn/public-dashboards/51a17a102edc4d859e35ef7934ca5664?theme=light';
 data.grafana={state:'reachable',checked_at:iso(now),url:'https://grafana.wly0829.cn/',public_url:url};
 const app=cockpit();app.set(data);assert.equal(app.value('cockpit-grafana').iframe,url);
 data.grafana.state='unavailable';data.grafana.url=null;data.grafana.collection_state='ready';app.set(data);assert.equal(app.value('cockpit-grafana').iframe,url);assert.equal(app.value('cockpit-grafana').state,'ok');
 data.grafana.checked_at=iso(now-180000);app.set(data);const current=app.value('cockpit-grafana');assert.equal(current.iframe,url);assert.equal(current.state,'ok');assert.notEqual(current.cached,true);
 data.grafana.checked_at=iso(now);
 data.grafana.public_dashboard_state='unavailable';app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);
 delete data.grafana.public_dashboard_state;data.grafana.public_url='https://grafana.wly0829.cn/login';app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);
 data.grafana.public_url=url;data.grafana.checked_at=iso(now-3600000);app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);
});

test('Grafana public observation time is independent of the login probe clock',()=>{
 const data=fixture(),url='https://grafana.wly0829.cn/public-dashboards/51a17a102edc4d859e35ef7934ca5664?theme=light';
 data.grafana={state:'unavailable',checked_at:iso(now-3600000),public_dashboard_state:'reachable',public_dashboard_checked_at:iso(now-180000),public_dashboard_url:url};
 const app=cockpit();app.set(data);assert.equal(app.value('cockpit-grafana').iframe,url);assert.equal(app.value('cockpit-grafana').state,'ok');assert.equal(app.slotTime('cockpit-grafana'),now/1000-180);
 data.grafana.checked_at=iso(now);data.grafana.public_dashboard_checked_at=iso(now-301000);app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);assert.equal(app.value('cockpit-grafana').state,'unknown');assert.equal(app.value('cockpit-grafana').cached,false);assert.equal(app.slotTime('cockpit-grafana'),now/1000-301);
 data.grafana.public_dashboard_checked_at=iso(now-300000);app.set(data);assert.equal(app.value('cockpit-grafana').iframe,url);
 data.grafana.max_age_seconds=60;data.grafana.public_dashboard_checked_at=iso(now-61000);app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);
});

test('a present null or invalid public clock never falls back to a fresh login observation',()=>{
 const url='https://grafana.wly0829.cn/public-dashboards/51a17a102edc4d859e35ef7934ca5664?theme=light';
 for(const stamp of [null,'','not-a-date',0,false,{},'2026-10-04T02:00:00']){
  const data=fixture();data.grafana={state:'reachable',checked_at:iso(now),public_url:url,public_dashboard_state:'reachable',public_dashboard_url:url,public_dashboard_checked_at:stamp};
  const app=cockpit();app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);assert.equal(app.value('cockpit-grafana').state,'unknown');assert.equal(app.value('cockpit-grafana').cached,false);assert.equal(Number.isNaN(app.slotTime('cockpit-grafana')),true);
 }
});

test('future public observations and explicit public failures cannot mount a chart',()=>{
 const data=fixture(),url='https://grafana.wly0829.cn/public-dashboards/51a17a102edc4d859e35ef7934ca5664?theme=light';
 data.grafana={state:'reachable',checked_at:iso(now),url:'https://grafana.wly0829.cn/',public_url:url,public_dashboard_state:'reachable',public_dashboard_url:url,public_dashboard_checked_at:iso(now+1)};
 const app=cockpit();app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);
 data.grafana.public_dashboard_checked_at=iso(now);data.grafana.public_dashboard_state='unavailable';app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);
});

test('legacy Grafana sources without a separate public timestamp retain their original clock',()=>{
 const data=fixture(),url='https://grafana.wly0829.cn/public-dashboards/51a17a102edc4d859e35ef7934ca5664?theme=light';
 data.grafana={state:'reachable',checked_at:iso(now-180000),public_url:url};
 const app=cockpit();app.set(data);assert.equal(app.value('cockpit-grafana').iframe,url);assert.equal(app.slotTime('cockpit-grafana'),now/1000-180);
 data.grafana.checked_at=iso(now-301000);app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);
 data.grafana.checked_at=iso(now+30000);app.set(data);assert.equal(app.value('cockpit-grafana').iframe,url);assert.equal(app.slotTime('cockpit-grafana'),now/1000+30);
 data.grafana.checked_at=iso(now+61000);app.set(data);assert.equal(app.value('cockpit-grafana').iframe,undefined);
});
test('native Grafana groups select exact independent URLs and observation times while desktop keeps canonical',()=>{
 const data=groupedFixture(),app=cockpit();app.set(data);
 for(const [part,age]of [['cpu-gpu',60],['memory-network',120]]){const row=app.grafanaGroupValue(part);assert.equal(row.iframe,groupUrls[part]);assert.equal(row.state,'ok');assert.equal(row.readAt,now/1000-age);assert.equal(row.cached,false);assert.notEqual(row.text,'曲线暂时打不开');}
 assert.equal(app.value('cockpit-grafana').iframe,groupUrls.all);
});
test('group freshness does not inherit canonical, login or the other group clock',()=>{
 const data=groupedFixture(),app=cockpit();data.grafana.checked_at=iso(now-3600000);data.grafana.public_dashboard_checked_at=iso(now-3600000);app.set(data);
 assert.equal(app.value('cockpit-grafana').iframe,undefined);assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,groupUrls['cpu-gpu']);assert.equal(app.grafanaGroupValue('memory-network').iframe,groupUrls['memory-network']);
 data.grafana.checked_at=iso(now);data.grafana.public_dashboard_checked_at=iso(now);data.grafana.groups['cpu-gpu'].checked_at=iso(now-301000);app.set(data);
 const cpu=app.grafanaGroupValue('cpu-gpu');assert.equal(cpu.iframe,undefined);assert.equal(cpu.state,'unknown');assert.equal(cpu.readAt,now/1000-301);assert.equal(app.grafanaGroupValue('memory-network').iframe,groupUrls['memory-network']);assert.equal(app.value('cockpit-grafana').iframe,groupUrls.all);
 data.grafana.groups['cpu-gpu'].checked_at=iso(now-300000);app.set(data);assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,groupUrls['cpu-gpu']);
});
test('one failed group leaves the other chart visible; unavailable groups keep an explained position and recover',()=>{
 const data=groupedFixture(),app=cockpit();data.grafana.groups['memory-network']={state:'unavailable',checked_at:iso(now),url:null,max_age_seconds:300};app.set(data);
 assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,groupUrls['cpu-gpu']);let memory=app.grafanaGroupValue('memory-network');assert.equal(memory.iframe,undefined);assert.equal(memory.state,'unknown');assert.notEqual(memory.empty,true);assert.equal(memory.readAt,now/1000);
 data.grafana.groups['cpu-gpu']={state:'unavailable',checked_at:null,url:null,max_age_seconds:300};app.set(data);
 assert.notEqual(app.grafanaGroupValue('cpu-gpu').empty,true);memory=app.grafanaGroupValue('memory-network');assert.notEqual(memory.empty,true);assert.match(memory.text,/现在打不开.*最后一次查询.*不影响/);assert.equal(memory.cached,false);
 app.set(groupedFixture());memory=app.grafanaGroupValue('memory-network');assert.equal(memory.iframe,groupUrls['memory-network']);assert.notEqual(memory.empty,true);
});

test('unregistered or failed mobile groups retain the unknown explanation without a promised launch',()=>{
 const data=groupedFixture(),app=cockpit();
 for(const part of ['cpu-gpu','memory-network'])data.grafana.groups[part]={state:'unavailable',url:null,checked_at:null,max_age_seconds:300};
 app.set(data);let row=app.grafanaGroupValue('cpu-gpu');assert.notEqual(row.empty,true);assert.equal(row.planned,undefined);assert.equal(Number.isFinite(row.readAt),false);assert.equal(row.state,'unknown');assert.equal(row.cached,false);assert.equal(row.iframe,undefined);assert.notEqual(app.grafanaGroupValue('memory-network').empty,true);assert.equal(app.value('cockpit-grafana').iframe,groupUrls.all);
 for(const observed of [{state:'unavailable',url:null,checked_at:iso(now-301000)},{state:'error',url:null,checked_at:iso(now)},{state:'reachable',url:'https://grafana.wly0829.cn/login',checked_at:iso(now)}]){
  const changed=structuredClone(data);changed.grafana.groups['cpu-gpu']=observed;app.set(changed);row=app.grafanaGroupValue('cpu-gpu');assert.notEqual(row.planned,true);assert.notEqual(row.empty,true);
 }
 app.set(data,'error');assert.notEqual(app.grafanaGroupValue('cpu-gpu').planned,true);
 const expired=structuredClone(data);expired.observed_at_unix-=121;app.set(expired);assert.notEqual(app.grafanaGroupValue('cpu-gpu').planned,true);
 app.set(groupedFixture());assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,groupUrls['cpu-gpu']);assert.notEqual(app.grafanaGroupValue('cpu-gpu').planned,true);
});
test('missing, invalid or future group observations never borrow a valid canonical timestamp',()=>{
 for(const stamp of [undefined,null,'','not-a-date',0,false,{},'2026-10-04T02:00:00',iso(now+1),iso(now+30000)]){
  const data=groupedFixture(),app=cockpit();data.grafana.groups['cpu-gpu'].checked_at=stamp;app.set(data);const cpu=app.grafanaGroupValue('cpu-gpu');assert.equal(cpu.iframe,undefined);assert.equal(cpu.state,'unknown');assert.equal(cpu.cached,false);assert.equal(app.grafanaGroupValue('memory-network').iframe,groupUrls['memory-network']);
  if(!String(stamp).endsWith('Z'))assert.equal(Number.isNaN(cpu.readAt),true);
 }
});
test('groups accept only this HTTPS public dashboard route and never borrow another URL',()=>{
 for(const url of [undefined,null,'','http://grafana.wly0829.cn/public-dashboards/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','https://example.invalid/public-dashboards/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','https://grafana.wly0829.cn/login','https://grafana.wly0829.cn/api/public/dashboards/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','https://grafana.wly0829.cn/public-dashboards/not-a-token','https://user:pass@grafana.wly0829.cn/public-dashboards/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa']){
  const data=groupedFixture(),app=cockpit();data.grafana.groups['cpu-gpu'].url=url;app.set(data);assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,undefined);assert.equal(app.grafanaGroupValue('cpu-gpu').state,'unknown');assert.equal(app.grafanaGroupValue('memory-network').iframe,groupUrls['memory-network']);
 }
 const data=groupedFixture(),app=cockpit();data.grafana.groups['cpu-gpu'].url=groupUrls['cpu-gpu'].replace('?theme=light','/?theme=dark');app.set(data);assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,data.grafana.groups['cpu-gpu'].url);
});
test('groups default to 300 seconds and reject invalid declared windows without a fallback',()=>{
 const data=groupedFixture(),app=cockpit();delete data.grafana.groups['cpu-gpu'].max_age_seconds;data.grafana.groups['cpu-gpu'].checked_at=iso(now-299000);app.set(data);assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,groupUrls['cpu-gpu']);
 data.grafana.groups['cpu-gpu'].checked_at=iso(now-301000);app.set(data);assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,undefined);
 for(const age of [null,0,-1,'300',NaN,Infinity]){data.grafana.groups['cpu-gpu'].checked_at=iso(now);data.grafana.groups['cpu-gpu'].max_age_seconds=age;app.set(data);assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,undefined);}
});
test('legacy sources keep the full desktop chart but cannot impersonate mobile groups or cache their URLs',()=>{
 const data=groupedFixture(),app=cockpit();delete data.grafana.groups;app.set(data);assert.equal(app.value('cockpit-grafana').iframe,groupUrls.all);
 assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,undefined);assert.equal(app.grafanaGroupValue('memory-network').iframe,undefined);
 app.set(groupedFixture());assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,groupUrls['cpu-gpu']);app.set(null,'error',now/1000);
 assert.equal(app.grafanaGroupValue('cpu-gpu').iframe,undefined);assert.equal(app.grafanaGroupValue('cpu-gpu').cached,false);assert.equal(app.grafanaGroupValue('memory-network').iframe,undefined);
});
test('cached cockpit and shared results keep values across errors and reloads without green lights',()=>{
 const saved=storage();let app=cockpit(saved);app.set(fixture());app.value('cockpit-pc');
 app.set(null,'error',now/1000);let result=app.value('cockpit-pc');assert.equal(result.state,'unknown');assert.match(JSON.stringify(result.rows),/处理器/);
 app=cockpit(saved);app.set(null,'error',0);result=app.value('cockpit-pc');assert.match(JSON.stringify(result.rows),/处理器/);
 saved.setItem(live.cacheKey('old','watch'),JSON.stringify({project:'AI 工具入口',result:{text:'失败 · 9月28日 10:30',state:'failed'},at:now-2*86400000}));
 assert.equal(live.readCache(saved,'old','watch','AI 工具入口',now),null);const old=live.readLast(saved,'old','watch','AI 工具入口',now);const history=live.offlineResult(old,now);assert.equal(history.state,'offline');assert.match(history.text,/上次读到 10月2日 02:00.*超过24小时/);
});

test('lamp policy: fresh HTTP responses cannot hide an expired whole-computer snapshot',()=>{
 const data=fixture();data.observed_at_unix=now/1000-121;const app=cockpit();app.set(data);assert.equal(app.value('cockpit-overall').state,'unknown');assert.match(app.summary().text,/读不到电脑.*可能电脑不在线.*最后读到/);
});
test('offline: initial loading immediately exposes cached public values and an honest last-read label',()=>{
 const saved=storage(),first=cockpit(saved);first.set(fixture());const next=cockpit(saved);next.set(null,'loading',0);
 const old=next.value('cockpit-pc');assert.equal(old.state,'unknown');assert.match(JSON.stringify(old.rows),/处理器/);assert.match(JSON.stringify(old.rows),/上次读到/);
 assert.match(next.value('cockpit-overall').text,/正在连接电脑/);assert.equal(next.value('cockpit-attention').state,'unknown');
 next.set(null,'error',0);assert.match(next.value('cockpit-overall').text,/可能电脑不在线.*网络连不上/);
 next.set(fixture());assert.equal(next.summary().state,'unknown');
});
test('offline: never-seen data says so and the shared read deadline is bounded',()=>{
 const app=cockpit();app.set(null,'error',0);assert.match(app.value('cockpit-overall').text,/还没读到过/);assert.match(live.connectionText(0),/还没读到过/);assert.equal(live.readTimeoutMs,8000);assert.equal(live.freshStatus({observed_at_unix:now/1000-121},now),false);
});

test('display cache: first warming contact is online, repeated failed empty samples cannot renew it',()=>{
 const source={state:'reading',observed_at_unix:null,refresh_started_at_unix:now/1000-1,unavailable_since_unix:null};
 const data={served_at_unix:now/1000,observed_at_unix:null,display_cache:{collectors:{authorization:{...source},hardware:{...source},dashboard:{...source}}}};
 assert.equal(live.freshStatus(data,now),true);assert.equal(model.freshStatus(data,now/1000),true);
 for(const collector of Object.values(data.display_cache.collectors))collector.unavailable_since_unix=now/1000-900;
 assert.equal(live.freshStatus(data,now),false);assert.equal(model.freshStatus(data,now/1000),false);
 const app=cockpit();app.set(data);assert.equal(app.summary().state,'unknown');
});

test('display cache: ready warming replies keep prior public hardware without restoring current certainty',()=>{
 const app=cockpit();app.set(fixture());
 const data=fixture();delete data.hardware;data.served_at_unix=now/1000;data.observed_at_unix=null;
 data.display_cache={collectors:{authorization:{state:'reading',observed_at_unix:null,refresh_started_at_unix:now/1000},hardware:{state:'reading',observed_at_unix:null,refresh_started_at_unix:now/1000},dashboard:{state:'reading',observed_at_unix:null,refresh_started_at_unix:now/1000}}};
 app.set(data);const value=app.value('cockpit-pc');assert.equal(value.state,'unknown');assert.equal(value.hardwareCached,true);assert.ok(value.hardwareDisplay);assert.match(JSON.stringify(value.rows),/上次读到/);
});
test('offline: readable historical hardware remains cached when another telemetry field is stale',()=>{
 const saved=storage(),data=fixture();data.hardware.network.sources.download_bytes_per_second.status='stale';const app=cockpit(saved);app.set(data);assert.equal(app.value('cockpit-pc').state,'unknown');
 const next=cockpit(saved);next.set(null,'loading',0);const value=next.value('cockpit-pc');assert.equal(value.state,'unknown');assert.ok(value.rows.some(x=>/处理器/.test(x.text)));assert.match(value.rows[0].text,/上次读到/);
});
test('legacy home without typed display boots, updates ordinary live strips and retains offline values',async()=>{
 const saved=storage(),span={textContent:''};
 const cell={dataset:{slot:'run'},querySelector:()=>span,setAttribute(){},removeAttribute(){},get textContent(){return span.textContent;}};
 const strip={hidden:true,querySelectorAll:()=>[cell]};
 const document={hidden:false,body:{dataset:{}},fonts:{ready:Promise.resolve()},addEventListener(){},querySelector:selector=>selector==='#page-data'?{textContent:JSON.stringify({kind:'home',page:'home',project:'示例项目'})}:selector==='[data-slot]'?cell:null,querySelectorAll:selector=>selector==='.live-strip'?[strip]:selector==='[data-slot]'?[cell]:[]};
 let fail=false;
 const sandbox={Date:TestDate,Intl,Object,Number,Map,Set,AbortController,performance,document,window:{},location:{hostname:'wly0829.cn'},localStorage:saved,addEventListener(){},setTimeout:(callback,delay)=>{if(delay<=1000)queueMicrotask(callback);return 0;},clearTimeout(){},setInterval:()=>0,fetch:async()=>{if(fail)throw new TypeError('local simulated failure');return {ok:true,json:async()=>fixture()};}};
 assert.equal(sandbox.displayTypesetStatus,undefined);
 vm.runInNewContext(sharedSource,sandbox);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(document.body.dataset.statusPhase,'ready');assert.equal(strip.hidden,false);assert.equal(span.textContent,'运行正常');assert.equal(cell.dataset.state,'ok');
 fail=true;await sandbox.window.SiteStatus.refresh();
 assert.equal(document.body.dataset.statusPhase,'error');assert.equal(strip.hidden,false);assert.match(span.textContent,/运行正常.*\d+ 分钟前读到/);assert.notEqual(cell.dataset.state,'ok');
});

test('expired project metrics can retain genuine old values; unsupported fields remain absent',()=>{
 const data=fixture();data.projects=block([{project:'学习方法',state:'stale',metrics:{lessons:{done:3,total:28}}}]);data.projects.state='stale';data.projects.observed_at=iso(now-86400000);
 assert.equal(live.parse(data,'lessons','学习方法',now).state,'unknown');assert.equal(live.parse(data,'lessons','学习方法',now,true).text,'已学 3/28 课');assert.equal(live.parse(data,'panel','双屏信息中心',now).state,'unknown');
 const app=cockpit();data.backups.items[0].state='warn';app.set(data);assert.match(app.value('cockpit-quick-5').text,/当前结论不完整/);
});

test('typed summary and detail rows consume one source classification, with unknown when it is absent',()=>{
 const data=fixture(),app=cockpit(),item={id:'typed-ai',title:'测试任务没有完成',source_id:'automation',current:true,resolved:false,action_owner:'ai',owner_action_required:false,severity:'yellow',what_happened:'最近那轮没完成，由 AI 核对',execution_started_at:null};
 data.cockpit={detail_summary:'AI 需核对 1 项（是否已开始未记录）',summary:{state:'attention'},detail_groups:{need_you:[],ai_following:[item],deferred:[],history:[]}};app.set(data);
 assert.equal(app.summary().text,data.cockpit.detail_summary);assert.equal(app.value('cockpit-tasks').rows.find(row=>row.key===item.id).group,'ai_following');assert.match(JSON.stringify(app.value('cockpit-tasks').rows),/是否已开始.*未记录/);
 delete data.cockpit.detail_groups;app.set(data);assert.equal(app.summary().state,'unknown');assert.match(app.summary().text,/当前结论不完整/);
});
test('typed registration and read clocks remain distinct; terminal history has no current unknown or completion estimate',()=>{
 const app=cockpit();app.set(fixture());const row=app.cpTyped({id:'past',title:'已通过的要求',source_id:'pending',state:'passed',history_category:'passed',current:false,resolved:true,what_happened:'已通过，留作记录',observed_at:iso(now),registration_date:'2026-09-28'},'history');
 assert.match(JSON.stringify(row.facts),/已通过，留作记录/);assert.ok(!row.facts.some(fact=>fact.label==='完成时间'||fact.label==='当前情况'));assert.match(app.cpItemTime(row),/本轮读取于 今天 02:00/);
 delete row.observed_at;assert.equal(app.cpItemTime(row),'登记于 2026-09-28');row.at='2026-09-28T10:30:00+08:00';row.at_kind='registration';assert.equal(app.cpItemTime(row),'登记于 9月28日 10:30');
});

test('AI handoff excludes closed and historic records and waits for the notice contract',()=>{
 const app=cockpit(),data=fixture();data.cockpit={cards:[{id:'normal',notice_kind:null}],detail_groups:{need_you:[],ai_following:[],deferred:[],history:[]}};app.set(data);assert.equal(app.cpCopyReady(),true);
 const row={id:'issue',title:'提醒',current:true,notice_kind:'warn',severity:'yellow',ai_hint:{last_error:'PRIVATE_ERROR',log_ref:'PRIVATE_PATH'}};
 assert.equal(app.cpCopyMeta(row,'公共一句话').hasHint,true);assert.equal(app.cpCopyMeta({...row,ai_hint:null},'公共一句话').hasHint,false);
 for(const excluded of [{treatment_category:'C'},{earlier:true},{current:false},{current:null},{group:'history'},{group:'deferred'},{resolved:true},{notice_kind:null},{notice_kind:'unknown',ai_hint:null}])assert.equal(app.cpCopyMeta({...row,...excluded},'公共一句话'),null);
 delete data.cockpit.cards[0].notice_kind;app.set(data);assert.equal(app.cpCopyReady(),false);app.set(data,'error');assert.equal(app.cpCopyMeta(row,'公共一句话'),null);
});
test('AI handoff deduplicates exact IDs and copies source time without private detail',()=>{
 const app=cockpit(),data=fixture();data.observed_at_unix-=120;app.set(data);
 const record=(id,color,at)=>app.cpCopyMeta({id,title:id,current:true,notice_kind:color==='未知'?'unknown':'warn',severity:color==='红'?'red':'yellow',first_seen_at:at,ai_hint:{last_error:'PRIVATE_ERROR',log_ref:'PRIVATE_PATH'}},'公共一句话');
 const newer=record('yellow-new','黄',iso(now-60000)),older=record('yellow-old','黄',iso(now-120000)),red=record('red','红',null),unknown=record('unknown','未知',null);
 const rows=app.cpCopyRecords({querySelectorAll:()=>[newer,red,unknown,older,newer].map(_cpCopy=>({_cpCopy}))},true);assert.deepEqual(Array.from(rows,row=>row.id),['red','yellow-old','yellow-new','unknown']);
 const prompt=app.cpCopyPrompt(rows,'all','');assert.match(prompt,/http:\/\/127\.0\.0\.1:18793\/computer-access\/api\/status/);assert.match(prompt,/页面读到时间：10月4日 01:58（北京时间）。/);assert.doesNotMatch(prompt,/PRIVATE_|公共一句话/);
 const missing={...red,hasHint:false};assert.match(app.cpCopyPrompt([missing],'item',''),/id=red 这一条还没有 ai_hint/);assert.match(app.cpCopyPrompt([missing],'block','电脑'),/id=red：red（还没有 ai_hint）/);
});

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
 const sandbox={...model,Date:ClockDate,Intl,URLSearchParams,localStorage:saved,sessionStorage:storage(),window:{SiteLiveRuntime:live,top:null},location:{origin:'https://wly0829.cn',hash:'',search:''},document:{querySelector:()=>({textContent:JSON.stringify({kind:'cockpit',page:'cockpit',project:null,screens:[{parts:[{native_live:slots.map(slot=>({slot}))}]}]})}),querySelectorAll:()=>[]},setTimeout,clearTimeout};
 sandbox.window.top=sandbox.window;
 vm.runInNewContext(pure+"\nglobalThis.subject={value,time,summary,operationRecords(request,items=[]){grant=request;actions=items;},set(data,p='ready',at=data?.observed_at_unix){status=data?adaptStatus(data):null;phase=p;lastRead=p==='ready'?clock():at||0;if(p==='ready')rememberCockpitValues(lastRead*1000);}};",sandbox);
 return {...sandbox.subject,advance(ms){current+=ms;}};
}

test('authorization result surface distinguishes no request, unknown outcome and an actual receipt, even offline',()=>{
 const app=cockpit();app.set(fixture());assert.match(app.value('ca-results').text,/当前没有办理记录/);
 app.operationRecords({request_id:'request',state:'unknown'});let result=app.value('ca-results');assert.equal(result.state,'warn');assert.match(result.rows[0].text,/结果尚未确认/);assert.match(result.rows[0].detail,/请查询/);
 app.operationRecords({request_id:'request',state:'succeeded'});app.set(null,'error',now/1000);result=app.value('ca-results');assert.match(result.rows[0].text,/已完成/);assert.equal(result.operation,true);assert.notEqual(result.state,'ok');
});

test('LC-01/02: source-backed drive letters and backup names remain readable Chinese',()=>{
 const app=cockpit();app.set(fixture());
 const pc=app.value('cockpit-pc');assert.ok(pc.rows.some(x=>x.text.startsWith('E：')));assert.ok(!JSON.stringify(pc).includes('[object Object]'));assert.ok(!pc.rows.some(x=>x.text.includes('::')||x.text.includes(':：')));
 const backup=app.value('cockpit-backups');assert.match(backup.rows[0].text,/中文备份 · 正常/);assert.match(backup.rows[0].detail,/每天/);assert.ok(!JSON.stringify(backup).includes('task-backuphash'));
 assert.match(app.value('cockpit-quick-5').text,/中文备份/);
});
test('LC-03/04: single failures are pending; partial reads keep their own unknown state during grace',()=>{
 let data=fixture(),app=cockpit();data.projects.items[0].failed_count=1;data.projects.items[0].overview='run_failed';app.set(data);assert.equal(app.value('cockpit-overall').state,'ok');assert.match(app.value('cockpit-overall').text,/待处理/);
 data=fixture();data.projects.state='unavailable';app=cockpit();app.set(data);assert.equal(app.value('cockpit-overall').state,'ok');assert.match(app.value('cockpit-overall').text,/正在确认/);
 data=fixture();data.projects.items[0].overview='run_unknown';app=cockpit();app.set(data);assert.equal(app.value('cockpit-overall').state,'ok');assert.match(app.value('cockpit-attention').rows.at(-1).text,/运行状态.*读不到/);
 data=fixture();data.hardware={state:'unavailable'};app=cockpit();app.set(data);assert.equal(app.value('cockpit-pc').state,'unknown');
 data=fixture();data.backups.items[0].state='failed';app=cockpit();app.set(data);assert.equal(app.value('cockpit-backups').state,'error');assert.equal(app.value('cockpit-quick-5').state,'error');
});
test('LC-05: past, future and next-year timestamps retain Beijing calendar dates',()=>{
 const app=cockpit(),data=fixture();data.backups.items[0].last_success_at='2026-09-28T10:30:00+08:00';app.set(data);
 assert.match(app.value('cockpit-backups').rows[0].text,/9月28日 10:30/);
 const task=app.value('cockpit-tasks').rows.flatMap(x=>x.children||[x]).find(x=>x.text.includes('每日检查')&&x.text.includes('上次'));assert.match(task.text,/9月28日 02:30/);assert.match(task.text,/10月5日 02:30/);
 assert.match(app.time(Date.parse('2027-01-01T00:30:00+08:00')/1000),/2027年1月1日 00:30/);
 assert.match(app.value('cockpit-security').text,/10月5日 03:00/);
});
test('LC-04: a missing hardware metric remains unknown and is named in pending during grace',()=>{
 for(const patch of [data=>data.hardware.cpu.sources.temperature_celsius.status='unavailable',data=>data.hardware.memory.used_bytes=null,data=>data.hardware.volumes[0].sources.free_bytes.status='unknown',data=>data.hardware.gpus=[{state:'ok',model:'显卡',usage_percent:null,temperature_celsius:40,vram_used_bytes:0,vram_total_bytes:1024}]]){
  const data=fixture();patch(data);const app=cockpit();app.set(data);assert.notEqual(app.value('cockpit-pc').state,'ok');assert.match(app.value('cockpit-overall').text,/正在确认/);assert.ok(app.value('cockpit-attention').rows.some(x=>/硬件状态.*读不到/.test(x.text)));
 }
});
test('LC-07: upgrade observation failure is a failed result',()=>{
 const data=fixture();data.automation.items[0]={...data.automation.items[0],project:'AI 工具入口',plain:{name:'AI 工具升级观察'},state:'failed',last_run_at:iso(now-60000)};
 const result=live.parse(data,'watch','AI 工具入口',now);assert.equal(result.state,'failed');assert.match(result.text,/失败/);
});
test('LC-08: expired blocks preserve their actual prior value with time and a non-green state',()=>{
 const data=fixture();for(const key of ['automation','backups','projects','pending','today'])data[key].observed_at=iso(now-3600000);
 const app=cockpit();app.set(data);const backup=app.value('cockpit-backups');assert.equal(backup.state,'unknown');assert.match(backup.rows[0].text,/中文备份/);assert.match(backup.notice,/数据已过期.*上次读到 今天 01:00/);assert.equal(app.value('cockpit-overall').state,'warn');
});
test('a stale live chart cannot be represented or cached as a historical chart',()=>{
 const data=fixture();data.grafana={checked_at:iso(now-3600000),public_dashboard_state:'reachable',public_dashboard_url:'https://fixture.invalid/chart'};
 const app=cockpit();app.set(data);let chart=app.value('cockpit-grafana');assert.equal(chart.state,'unknown');assert.equal(chart.cached,false);assert.equal(chart.iframe,undefined);
 app.set(null,'error',now/1000);chart=app.value('cockpit-grafana');assert.equal(chart.cached,false);assert.equal(chart.iframe,undefined);
});
test('cached cockpit and shared results keep values across errors and reloads without green lights',()=>{
 const saved=storage();let app=cockpit(saved);app.set(fixture());app.value('cockpit-backups');
 app.set(null,'error',now/1000);let result=app.value('cockpit-backups');assert.equal(result.state,'unknown');assert.match(result.rows[1].text,/中文备份/);assert.match(result.rows[0].text,/上次读到 今天 02:00/);
 app=cockpit(saved);app.set(null,'error',0);result=app.value('cockpit-backups');assert.match(result.rows[1].text,/中文备份/);
 saved.setItem(live.cacheKey('old','watch'),JSON.stringify({project:'AI 工具入口',result:{text:'失败 · 9月28日 10:30',state:'failed'},at:now-2*86400000}));
 assert.equal(live.readCache(saved,'old','watch','AI 工具入口',now),null);const old=live.readLast(saved,'old','watch','AI 工具入口',now);const history=live.offlineResult(old,now);assert.equal(history.state,'offline');assert.match(history.text,/上次读到 10月2日 02:00.*超过24小时/);
});

test('lamp policy: all normal, a 5-minute gap, a 15-minute gap, computer offline and overdue backup',()=>{
 let data=fixture(),app=cockpit();app.set(data);assert.equal(app.summary().state,'ok');assert.equal(app.summary().text,'都正常');
 data=fixture();data.remote_network.items[0]={id:'internet',state:'unknown',unavailable_since:iso(now-5*60000)};app=cockpit();app.set(data);
 assert.equal(app.summary().state,'ok');assert.match(app.summary().text,/正在确认/);assert.ok(app.value('cockpit-attention').rows.some(x=>/互联网连接.*从 今天 01:55 起/.test(x.text)));
 data.remote_network.items[0].unavailable_since=iso(now-15*60000);app=cockpit();app.set(data);assert.equal(app.summary().state,'warn');assert.match(app.value('cockpit-attention').rows.at(-1).text,/01:45.*超过 10 分钟/);
 app.set(null,'error');assert.equal(app.summary().state,'unknown');
 data=fixture();data.backups.items[0].last_success_at=iso(now-37*3600000);app=cockpit();app.set(data);assert.equal(app.summary().state,'warn');assert.match(app.summary().text,/备份超期/);
});
test('lamp policy: fresh HTTP responses cannot hide an expired whole-computer snapshot',()=>{
 const data=fixture();data.observed_at_unix=now/1000-121;const app=cockpit();app.set(data);assert.equal(app.value('cockpit-overall').state,'unknown');assert.match(app.summary().text,/读不到电脑.*可能电脑不在线.*最后读到/);
});
test('lamp policy: repeated observations and reloads retain the first unreadable time; recovery resets it',()=>{
 const saved=storage(),app=cockpit(saved);let data=fixture();data.remote_network.items[0].state='unknown';app.set(data);
 app.advance(5*60000);data=fixture();data.observed_at_unix+=300;data.remote_network.observed_at=iso(now+300000);data.remote_network.items[0].state='unknown';app.set(data);assert.equal(app.summary().state,'ok');
 const reloaded=cockpit(saved);reloaded.advance(11*60000);data=fixture();data.observed_at_unix+=660;for(const key of ['automation','backups','pending','today','projects','remote_network','backup_inventory'])data[key].observed_at=iso(now+660000);
 for(const group of [data.hardware.cpu,data.hardware.memory,data.hardware.network,data.hardware.display,...data.hardware.volumes])for(const source of Object.values(group.sources))source.observed_at_unix+=660;
 data.remote_network.items[0].state='unknown';reloaded.set(data);assert.equal(reloaded.summary().state,'warn');assert.match(reloaded.value('cockpit-attention').rows.at(-1).text,/02:00/);
 data.remote_network.items[0].state='online';reloaded.set(data);assert.equal(reloaded.summary().state,'ok');
 data.remote_network.items[0].state='unknown';reloaded.set(data);assert.equal(reloaded.summary().state,'ok');assert.match(reloaded.value('cockpit-attention').rows.at(-1).text,/02:11/);
});
test('lamp policy: task streaks are 1 green, 2 yellow and 4 red; external and disabled tasks are excluded',()=>{
 for(const [count,expected] of [[1,'ok'],[2,'warn'],[4,'error']]){const data=fixture();data.automation.items[0].state='failed';data.automation.items[0].consecutive_failures=count;const app=cockpit();app.set(data);assert.equal(app.summary().state,expected);assert.ok(app.value('cockpit-attention').rows.some(x=>/任务出错/.test(x.text)));}
 const data=fixture();data.automation.items.push({id:'external',project:'电脑上别的软件',enabled:true,state:'failed',consecutive_failures:8},{id:'disabled',enabled:false,state:'failed',consecutive_failures:8});const app=cockpit();app.set(data);assert.equal(app.summary().state,'ok');
});
test('lamp policy: never-run tasks and read-but-unknown results are not lost reads',()=>{
 const data=fixture();data.automation.state='partial';data.automation.items[0]={...data.automation.items[0],state:'never',last_run_at:null,next_run_at:iso(now+3600000),availability:'available'};
 data.automation.items.push({id:'unknown-code',enabled:true,state:'unknown',availability:'available',plain:{name:'未知结果任务'}},{id:'manual',enabled:null,state:'unknown',source:'codex',availability:'not_connected',plain:{name:'按需周检'}});
 const app=cockpit();app.set(data);assert.equal(app.summary().state,'ok');assert.match(app.summary().text,/待处理/);assert.ok(!app.value('cockpit-attention').rows.some(x=>/读不到/.test(x.text)));assert.ok(app.value('cockpit-attention').rows.some(x=>/还没接入/.test(x.text)));
});
test('lamp policy: empty blocks are known and backup evidence gaps are independently timed',()=>{
 const data=fixture();data.today={...data.today,state:'empty',items:[]};data.backup_inventory={...data.backup_inventory,state:'partial',items:[{id:'other',items:[{id:'copy',name:'测试备份',enabled:true,protection:'unknown',freshness:'unknown',unavailable_since:iso(now-15*60000)}]}]};
 const app=cockpit();app.set(data);assert.equal(app.summary().state,'warn');assert.ok(app.value('cockpit-attention').rows.some(x=>/测试备份.*副本证据.*超过 10 分钟/.test(x.text)));
});
test('lamp policy: a project derived from unconnected manual tasks is a result gap, not an unreadable block',()=>{
 const data=fixture();Object.assign(data.projects.items[0],{overview:'run_unknown',run_health:'unknown'});Object.assign(data.automation.items[0],{project:'示例项目',enabled:null,state:'unknown',source:'laptop',availability:'not_connected'});
 const app=cockpit();app.set(data);assert.equal(app.summary().state,'ok');assert.ok(app.value('cockpit-attention').rows.some(x=>/运行结果还未确认/.test(x.text)));assert.ok(!app.value('cockpit-attention').rows.some(x=>/读不到/.test(x.text)));
});
test('lamp policy: an original-data inventory is not a failed backup-copy receipt',()=>{
 const data=fixture();data.backup_inventory.state='partial';data.backup_inventory.items=[{id:'g',name:'原件',items:[{id:'original',role:'original',protection:'unknown',freshness:'unknown',unavailable_since:iso(now-15*60000)}]}];
 const app=cockpit();app.set(data);assert.equal(app.summary().state,'ok');assert.equal(app.summary().text,'都正常');
});
test('lamp policy: daily and weekly overdue thresholds, low disks and system disk red threshold',()=>{
 for(const [cadence,hours,expected] of [['daily',36,'ok'],['daily',37,'warn'],['daily',49,'error'],['weekly',9*24,'ok'],['weekly',9*24+1,'warn'],['weekly',14*24+1,'error']]){const data=fixture();data.backups.items[0].cadence=cadence;data.backups.items[0].last_success_at=iso(now-hours*3600000);const app=cockpit();app.set(data);assert.equal(app.summary().state,expected);}
 for(const [drive,free,total,expected] of [['E:',9,100,'warn'],['E:',4,100,'error'],['C:',14,50,'error']]){const data=fixture();Object.assign(data.hardware.volumes[0],{letter:drive,free_bytes:free*1024**3,total_bytes:total*1024**3});const app=cockpit();app.set(data);assert.equal(app.summary().state,expected);}
});
test('lamp policy: a short partial read holds a previously known yellow lamp',()=>{
 const data=fixture(),app=cockpit();data.automation.items[0].state='failed';data.automation.items[0].consecutive_failures=2;app.set(data);assert.equal(app.summary().state,'warn');
 data.automation.state='unavailable';app.set(data);assert.equal(app.summary().state,'warn');assert.match(app.summary().text,/正在确认/);
});
test('lamp policy: an old red lamp is held only during grace; an unrelated long read gap is yellow',()=>{
 const data=fixture(),app=cockpit();Object.assign(data.automation.items[0],{state:'failed',consecutive_failures:4});app.set(data);assert.equal(app.summary().state,'error');
 data.automation.items[0].state='success';data.backup_inventory={state:'unavailable',unavailable_since:iso(now-15*60000),observed_at:iso(now),max_age_seconds:120};app.set(data);assert.equal(app.summary().state,'warn');
 data.automation.items[0].state='failed';app.set(data);assert.equal(app.summary().state,'error');
});
test('offline: initial loading immediately exposes cached public values and an honest last-read label',()=>{
 const saved=storage(),first=cockpit(saved);first.set(fixture());const next=cockpit(saved);next.set(null,'loading',0);
 const old=next.value('cockpit-backups');assert.equal(old.state,'unknown');assert.match(old.rows[1].text,/中文备份/);assert.match(old.rows[0].text,/上次读到/);
 assert.match(next.value('cockpit-overall').text,/正在连接电脑.*最后读到/);assert.ok(next.value('cockpit-attention').rows.some(x=>x.href==='/mcp/'));
 next.set(null,'error',0);assert.match(next.value('cockpit-overall').text,/可能电脑不在线.*网络连不上/);
 next.set(fixture());assert.equal(next.summary().state,'ok');
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

test('display cache: expired authorization is a timed yellow gap while fresh WTS remains readable',()=>{
 const data=fixture();data.served_at_unix=now/1000;data.host.sources={screen_state:{status:'ok',observed_at_unix:now/1000}};
 data.display_cache={collectors:{authorization:{state:'error',observed_at_unix:now/1000-900,unavailable_since_unix:now/1000-780},hardware:{state:'ready',observed_at_unix:now/1000},dashboard:{state:'ready',observed_at_unix:now/1000}}};
 const app=cockpit();app.set(data);assert.equal(app.summary().state,'warn');assert.equal(app.value('cockpit-security').state,'unknown');assert.equal(app.value('cockpit-security-windows').state,'ok');
 assert.equal(model.freshScreen(data,now/1000),true);data.host.sources.screen_state.observed_at_unix-=900;assert.equal(model.freshScreen(data,now/1000),false);
});

test('display cache: old hardware timestamps retain their original expiry across a fresh service reply',()=>{
 const data=fixture();data.served_at_unix=now/1000;data.hardware_observed_at_unix=now/1000-900;
 data.host.sources={screen_state:{status:'ok',observed_at_unix:now/1000}};
 data.display_cache={collectors:{authorization:{state:'ready',observed_at_unix:now/1000},hardware:{state:'error',observed_at_unix:now/1000-900,unavailable_since_unix:now/1000-780},dashboard:{state:'ready',observed_at_unix:now/1000}}};
 for(const row of [data.hardware.cpu,data.hardware.memory,data.hardware.network,data.hardware.display,...data.hardware.volumes])for(const source of Object.values(row.sources))source.observed_at_unix-=900;
 const app=cockpit();app.set(data);assert.equal(app.summary().state,'warn');assert.equal(app.value('cockpit-pc').state,'unknown');
});

test('display cache: ready warming replies keep prior public hardware without restoring current certainty',()=>{
 const app=cockpit();app.set(fixture());
 const data=fixture();delete data.hardware;data.served_at_unix=now/1000;data.observed_at_unix=null;
 data.display_cache={collectors:{authorization:{state:'reading',observed_at_unix:null,refresh_started_at_unix:now/1000},hardware:{state:'reading',observed_at_unix:null,refresh_started_at_unix:now/1000},dashboard:{state:'reading',observed_at_unix:null,refresh_started_at_unix:now/1000}}};
 app.set(data);const value=app.value('cockpit-pc');assert.equal(value.state,'unknown');assert.equal(value.hardwareCached,true);assert.ok(value.hardwareDisplay);assert.match(JSON.stringify(value.rows),/上次读到/);
});
test('task reads: declared unavailability wins over legacy manual-entry inference',()=>{
 const data=fixture();data.automation.items[0]={...data.automation.items[0],enabled:null,source:'codex',availability:'unavailable',state:'unknown',unavailable_since:iso(now-15*60000)};
 const app=cockpit();app.set(data);assert.equal(app.summary().state,'warn');assert.ok(app.value('cockpit-attention').rows.some(x=>/自动任务.*读不到/.test(x.text)));
});
test('offline: readable historical hardware remains cached when another telemetry field is stale',()=>{
 const saved=storage(),data=fixture();data.hardware.network.state='stale';const app=cockpit(saved);app.set(data);assert.equal(app.value('cockpit-pc').state,'unknown');
 const next=cockpit(saved);next.set(null,'loading',0);const value=next.value('cockpit-pc');assert.equal(value.state,'unknown');assert.ok(value.rows.some(x=>/处理器/.test(x.text)));assert.match(value.rows[0].text,/上次读到/);
});
test('lamp policy: unreadable security status is a local gap, never a computer-offline claim',()=>{
 const data=fixture();data.personal_data={state:'unknown',unavailable_since:iso(now-15*60000)};const app=cockpit();app.set(data);assert.equal(app.summary().state,'warn');assert.ok(app.value('cockpit-attention').rows.some(x=>/个人资料开关状态.*读不到/.test(x.text)&&x.href==='#security'));
});
test('legacy home without typed display boots, updates ordinary live strips and retains offline values',async()=>{
 const saved=storage(),span={textContent:''};
 const cell={dataset:{slot:'run'},querySelector:()=>span,setAttribute(){},removeAttribute(){},get textContent(){return span.textContent;}};
 const strip={hidden:true,querySelectorAll:()=>[cell]};
 const document={hidden:false,body:{dataset:{}},fonts:{ready:Promise.resolve()},addEventListener(){},querySelector:selector=>selector==='#page-data'?{textContent:JSON.stringify({kind:'home',page:'home',project:'示例项目'})}:selector==='[data-slot]'?cell:null,querySelectorAll:selector=>selector==='.live-strip'?[strip]:selector==='[data-slot]'?[cell]:[]};
 let fail=false;
 const sandbox={Date:TestDate,Intl,Object,Number,Map,Set,AbortController,performance,document,window:{},location:{hostname:'wly0829.cn'},localStorage:saved,addEventListener(){},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,fetch:async()=>{if(fail)throw new TypeError('local simulated failure');return {ok:true,json:async()=>fixture()};}};
 assert.equal(sandbox.displayTypesetStatus,undefined);
 vm.runInNewContext(sharedSource,sandbox);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(document.body.dataset.statusPhase,'ready');assert.equal(strip.hidden,false);assert.equal(span.textContent,'运行正常');assert.equal(cell.dataset.state,'ok');
 fail=true;await sandbox.window.SiteStatus.refresh();
 assert.equal(document.body.dataset.statusPhase,'error');assert.equal(strip.hidden,false);assert.match(span.textContent,/运行正常.*上次读到/);assert.notEqual(cell.dataset.state,'ok');
});

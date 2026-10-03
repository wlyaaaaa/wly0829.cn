import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
const releaseRoot=process.env.WLY_TEST_RELEASE_ROOT || fileURLToPath(new URL('../site-release/',import.meta.url));
const model=await import(pathToFileURL(path.join(releaseRoot,'cockpit/assets/b2-access-model-4ec8751fbae9.js')).href);

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
  backups: block([{ id: 'task-backuphash', name: '中文备份', project: '中文备份', enabled: true, state: 'success', cadence: 'daily', last_success_at: '2026-09-28T10:30:00+08:00' }]),
  projects: block([{ project: '示例项目', state: 'ok', run_health: 'ok', overview: 'ok', failed_count: 0 }]), pending: block([]), today: block([]),
  hardware: { state: 'ok', cpu: sample({ model: '处理器', usage_percent: 12, temperature_celsius: 40, power_watts: 20 }), memory: sample({ used_bytes: 8*1024**3, total_bytes: 32*1024**3 }), network: sample({ connected: true, download_bytes_per_second: 0, upload_bytes_per_second: 0 }), display: sample({ width_px: 1440, height_px: 1000, refresh_hz: 60 }), volumes: [sample({ letter: 'E:', free_bytes: 100*1024**3, total_bytes: 200*1024**3 })] }
 };
}
function cockpit(saved=storage()) {
 const source=compiledB2.replace(/^import[^\n]*\n/,'');
 const pure=source.slice(0,source.indexOf('function rectStyle('));
 const slots=['cockpit-overall','cockpit-quick-1','cockpit-quick-2','cockpit-quick-3','cockpit-quick-4','cockpit-quick-5','cockpit-pc','cockpit-tasks','cockpit-backups','cockpit-projects','cockpit-today','cockpit-attention','cockpit-remote','cockpit-grafana','cockpit-security','cockpit-security-unrestricted','cockpit-security-windows'];
 const sandbox={...model,Date:TestDate,Intl,URLSearchParams,localStorage:saved,sessionStorage:storage(),window:{SiteLiveRuntime:live,top:null},location:{origin:'https://wly0829.cn',hash:'',search:''},document:{querySelector:()=>({textContent:JSON.stringify({kind:'cockpit',page:'cockpit',project:null,screens:[{parts:[{native_live:slots.map(slot=>({slot}))}]}]})}),querySelectorAll:()=>[]},setTimeout,clearTimeout};
 sandbox.window.top=sandbox.window;
 vm.runInNewContext(pure+"\nglobalThis.subject={value,time,summary,set(data,p='ready',at=data?.observed_at_unix){status=data?adaptStatus(data):null;phase=p;lastRead=p==='ready'?clock():at||0;if(p==='ready')rememberCockpitValues(lastRead*1000);}};",sandbox);
 return sandbox.subject;
}

test('LC-01/02: source-backed drive letters and backup names remain readable Chinese',()=>{
 const app=cockpit();app.set(fixture());
 const pc=app.value('cockpit-pc');assert.ok(pc.rows.some(x=>x.text.startsWith('E:：')));assert.ok(!JSON.stringify(pc).includes('[object Object]'));
 const backup=app.value('cockpit-backups');assert.match(backup.rows[0].text,/中文备份 · 正常/);assert.match(backup.rows[0].detail,/每天/);assert.ok(!JSON.stringify(backup).includes('task-backuphash'));
 assert.match(app.value('cockpit-quick-5').text,/中文备份/);
});
test('LC-03/04: failed and unknown project/hardware/backup states cannot say all normal',()=>{
 let data=fixture(),app=cockpit();data.projects.items[0].failed_count=1;data.projects.items[0].overview='run_failed';app.set(data);assert.equal(app.value('cockpit-overall').state,'error');
 data=fixture();data.projects.state='unavailable';app=cockpit();app.set(data);assert.equal(app.value('cockpit-overall').state,'unknown');
 data=fixture();data.projects.items[0].overview='run_unknown';app=cockpit();app.set(data);assert.equal(app.value('cockpit-overall').state,'unknown');
 data=fixture();data.hardware={state:'unavailable'};app=cockpit();app.set(data);assert.equal(app.value('cockpit-pc').state,'unknown');
 data=fixture();data.backups.items[0].state='failed';app=cockpit();app.set(data);assert.equal(app.value('cockpit-backups').state,'error');assert.equal(app.value('cockpit-quick-5').state,'error');
});
test('LC-05: past, future and next-year timestamps retain Beijing calendar dates',()=>{
 const app=cockpit();app.set(fixture());
 assert.match(app.value('cockpit-backups').rows[0].text,/9月28日 10:30/);
 const task=app.value('cockpit-tasks').rows.flatMap(x=>x.children||[x]).find(x=>x.text.includes('每日检查')&&x.text.includes('上次'));assert.match(task.text,/9月28日 02:30/);assert.match(task.text,/10月5日 02:30/);
 assert.match(app.time(Date.parse('2027-01-01T00:30:00+08:00')/1000),/2027年1月1日 00:30/);
 assert.match(app.value('cockpit-security').text,/10月5日 03:00/);
});
test('LC-04: a missing visible hardware metric or unavailable field source cannot turn green',()=>{
 for(const patch of [data=>data.hardware.cpu.sources.temperature_celsius.status='unavailable',data=>data.hardware.memory.used_bytes=null,data=>data.hardware.volumes[0].sources.free_bytes.status='unknown',data=>data.hardware.gpus=[{state:'ok',model:'显卡',usage_percent:null,temperature_celsius:40,vram_used_bytes:0,vram_total_bytes:1024}]]){
  const data=fixture();patch(data);const app=cockpit();app.set(data);assert.notEqual(app.value('cockpit-pc').state,'ok');assert.notEqual(app.value('cockpit-overall').state,'ok');
 }
});
test('LC-07: upgrade observation failure is a failed result',()=>{
 const data=fixture();data.automation.items[0]={...data.automation.items[0],project:'AI 工具入口',plain:{name:'AI 工具升级观察'},state:'failed',last_run_at:iso(now-60000)};
 const result=live.parse(data,'watch','AI 工具入口',now);assert.equal(result.state,'failed');assert.match(result.text,/失败/);
});
test('LC-08: expired blocks preserve their actual prior value with time and a non-green state',()=>{
 const data=fixture();for(const key of ['automation','backups','projects','pending','today'])data[key].observed_at=iso(now-3600000);
 const app=cockpit();app.set(data);const backup=app.value('cockpit-backups');assert.equal(backup.state,'unknown');assert.match(backup.rows[0].text,/中文备份/);assert.match(backup.notice,/数据已过期.*上次读到 今天 01:00/);assert.equal(app.value('cockpit-overall').state,'unknown');
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
 assert.equal(live.readCache(saved,'old','watch','AI 工具入口',now),null);const old=live.readLast(saved,'old','watch','AI 工具入口',now);const history=live.offlineResult(old,now);assert.equal(history.state,'failed');assert.match(history.text,/上次读到 10月2日 02:00.*超过24小时/);
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

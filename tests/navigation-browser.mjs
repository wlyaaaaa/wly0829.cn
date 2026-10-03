// Run against a prepared directory with a host Chrome CDP driver supplied by CLI.
// It never opens a window, reads the owner's browser profile or captures images.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const options={};for(let i=2;i<process.argv.length;i+=2)options[process.argv[i].replace(/^--/,'')]=process.argv[i+1];
if(!options.root||!options.driver||!options.out)throw new Error('--root, --driver and --out are required');
const root=path.resolve(options.root),out=path.resolve(options.out);
const {launch,sleep,write}=await import(pathToFileURL(path.resolve(options.driver)));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.xml':'application/xml','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.mp4':'video/mp4'};
const server=createServer(async(req,res)=>{try{
  let target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403).end();return;}
  if((await stat(target)).isDirectory())target=path.join(target,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream','cache-control':'no-store'});res.end(await readFile(target));
}catch{res.writeHead(404).end('not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const runtime=options.runtime?path.resolve(options.runtime):path.join(out,'chrome-runtime');
await mkdir(out,{recursive:true});
const browser=await launch({runtime}),tab=await browser.tab(),c=tab.cdp;
const log=[],errors=[];let scope='';c.on('Runtime.exceptionThrown',e=>errors.push({scope,message:e.exceptionDetails?.exception?.description||e.exceptionDetails?.text}));
const record=(kind,value)=>{log.push({scope,kind,...value});write(path.join(out,'browser-regression.json'),{base,chrome:browser.version,log,errors});};
async function waitReady(){for(let n=0;n<120;n++){if(await c.evaluate("document.readyState==='complete'&&location.href!=='about:blank'"))break;await sleep(100);}await sleep(450);}
async function go(route){await c.send('Page.navigate',{url:base+route});await waitReady();}
async function click(expression,{touch=false}={}){
  await c.evaluate(`(()=>{const e=${expression};if(!e)throw new Error('click target absent');e.scrollIntoView({block:'center',behavior:'instant'});})()`);
  await sleep(500);
  const p=await c.evaluate(`(()=>{const e=${expression};const b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`);
  if(touch){await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  else{await c.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await c.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});}
}
const state=()=>c.evaluate(`({url:location.pathname+location.search+location.hash,y:scrollY,width:innerWidth,height:innerHeight,dpr:devicePixelRatio,selectedTab:document.querySelector('[data-project-reading-tab][aria-selected="true"]')?.dataset.projectReadingTab,selectedRule:document.querySelector('[data-rule-panel]:not([hidden])')?.dataset.rulePanel,targetExists:!location.hash||!!document.getElementById(decodeURIComponent(location.hash.slice(1))),overflow:document.documentElement.scrollWidth-innerWidth})`);
const cases=[
  ['/projects/codex-memory/','/projects/openclaw/'],
  ['/projects/personal-formal-documents/','/skills/personal-formal-documents/'],
  ['/projects/remote-control/','/projects/codex-remote/'],
  ['/projects/sunshine-remote-streaming/','/projects/codex-remote/'],
  ['/skills/daily-preferences/','/projects/work-delivery-copilot/'],
  ['/skills/reply-as-me/','/skills/personal-formal-documents/'],
  ['/projects/ai-cli-profile-manager/','/projects/github-index/'],
  ['/projects/openclaw/','/projects/codex-remote/'],
  ['/projects/personal-formal-documents/','/projects/work-delivery-copilot/']
];
const viewers=['ai-cli-profile-manager','emerald-veil','localocr','meshclip-kit','pc-panel-hub','proxyclean','ramdisk-guardian','timeaudit','video-scaffold','work-delivery-copilot'].map(x=>'/projects/'+x+'/').concat('/skills/pdf-render-safe/');
try{
  for(const mobile of [false,true]){
    scope=mobile?'小米 15 Pro 竖屏':'电脑 1440';
    await c.send('Emulation.setDeviceMetricsOverride',{width:mobile?412:1440,height:mobile?915:900,deviceScaleFactor:mobile?3.5:1,mobile,screenOrientation:{type:'portraitPrimary',angle:0}});
    await c.send('Emulation.setTouchEmulationEnabled',{enabled:mobile,maxTouchPoints:5});
    const version=browser.version.Browser.replace('HeadlessChrome','Chrome');
    await c.send('Emulation.setUserAgentOverride',{userAgent:mobile?'Mozilla/5.0 (Linux; Android 15; Xiaomi 15 Pro) AppleWebKit/537.36 (KHTML, like Gecko) '+version+' Mobile Safari/537.36':browser.version['User-Agent'],platform:mobile?'Linux armv8l':'Win32'});
    for(const [source,target] of cases){
      await go(source);await click(`[...document.querySelectorAll('a[href]')].find(e=>e.getAttribute('href')===${JSON.stringify(target)}&&e.getClientRects().length)`,{touch:mobile});await waitReady();
      const s=await state();assert.equal(s.url,target);record('named-navigation',{source,target,state:s});
    }
    for(const [source,target,rule] of [
      ['/skills/cloud-asset-channel/','/rules/?rule=privacy_data_contract#rule-panel-privacy_data_contract','privacy_data_contract'],
      ['/projects/ai-cli-profile-manager/','/rules/?rule=execution_coordination_contract#rule-panel-execution_coordination_contract','execution_coordination_contract'],
      ['/projects/personal-expression/','/rules/?rule=privacy_data_contract#rule-panel-privacy_data_contract','privacy_data_contract']]){
      await go(source);await click(`[...document.querySelectorAll('a[href]')].find(e=>e.getAttribute('href')===${JSON.stringify(target)}&&e.getClientRects().length)`,{touch:mobile});await waitReady();
      const s=await state();assert.equal(s.selectedRule,rule);assert.equal(s.targetExists,true);record('rule-navigation',{source,target,state:s});
    }
    for(const skill of ['documents','pdf']){
      await go('/skills/'+skill+'/');await click(`document.querySelector('[data-project-reading-tab="technical"]')`,{touch:mobile});
      await click(`document.querySelector('a[href="/skills/#skill-${skill}"]')`,{touch:mobile});await waitReady();
      const s=await state();assert.equal(s.url,'/skills/#skill-'+skill);assert.equal(s.targetExists,true);record('host-capability-catalog',{skill,state:s});
    }
    await go('/search/?q='+encodeURIComponent('微信'));
    const targets=await c.evaluate(`[...document.querySelectorAll('main a[href]')].filter(e=>!e.closest('.site-footer')).map(e=>e.getAttribute('href')).filter(x=>x.startsWith('/projects/')||x.startsWith('/skills/'))`);
    assert.ok(targets.length);assert.ok(targets.every(x=>!x.startsWith('/docs/')&&!x.startsWith('/#system-')));
    await click(`[...document.querySelectorAll('main a[href]')].find(e=>e.getAttribute('href')===${JSON.stringify(targets[0])}&&e.getClientRects().length)`,{touch:mobile});await waitReady();
    record('search-click',{targets,target:await state()});
    for(const hash of ['project-reading-panel-technical','module-technical']){
      await go('/projects/devconfig-backup/#'+hash);
      await c.evaluate(`scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`);await sleep(250);
      const footer=`document.querySelector('.site-footer a[href="/"]')`;
      await c.evaluate(`(${footer}).scrollIntoView({block:'center',behavior:'instant'})`);await sleep(150);
      const before=await state();await click(footer,{touch:mobile});await waitReady();
      const history=await c.send('Page.getNavigationHistory');await c.send('Page.navigateToHistoryEntry',{entryId:history.entries[history.currentIndex-1].id});
      const samples=[];for(const delay of [300,700,1500,2500]){await sleep(delay);samples.push(await state());}
      assert.ok(samples.every(s=>s.selectedTab==='technical'&&Math.abs(s.y-before.y)<=2),JSON.stringify({before,samples}));
      record('history-position',{hash,before,samples});
    }
    await go('/projects/github-index/');
    const header=await c.evaluate(`document.querySelector('[data-grafana-entry]').getAttribute('href')`);assert.equal(header,'/cockpit/#grafana');record('legacy-header',{href:header});
    for(const route of ['/projects/','/projects/github-index/','/projects/llm-backend-toolkit/']){
      await go(route);const bad=await c.evaluate(`[...document.querySelectorAll('a[href]')].filter(e=>/github\\.com\\/wlyaaaaa\\/(github-local-index|llm-backend-toolkit)(?:\\/|$)/.test(e.href)).map(e=>e.href)`);assert.deepEqual(bad,[]);record('private-repository',{route,bad});
    }
    for(const route of viewers){
      await go(route);await c.evaluate(`window.__selectstartTargets=[];document.addEventListener('selectstart',e=>window.__selectstartTargets.push(e.target.nodeType),true)`);
      await click(`[...document.querySelectorAll('.typeset-screenshot:not([data-compare="true"]),.typeset-compare-open')].find(e=>e.getClientRects().length)`,{touch:mobile});await sleep(350);
      assert.equal(await c.evaluate(`document.querySelector('#image-viewer').open`),true);
      const plus=`[...document.querySelectorAll('#image-viewer button')].find(e=>e.textContent.trim()==='＋'||e.textContent.trim()==='+')`;
      if(await c.evaluate(`!!(${plus})`)){await click(plus,{touch:mobile});await sleep(150);}
      // Select events can target Text; dispatch that exact DOM target as well as tap the controls.
      await c.evaluate(`(()=>{const button=document.querySelector('#image-viewer .viewer-close');button.firstChild.dispatchEvent(new Event('selectstart',{bubbles:true,cancelable:true}));})()`);
      await click(`document.querySelector('#image-viewer .viewer-close')`,{touch:mobile});await sleep(200);
      const details=await c.evaluate(`({open:document.querySelector('#image-viewer').open,targets:window.__selectstartTargets})`);
      assert.equal(details.open,false);assert.ok(details.targets.includes(3));record('viewer-text-event',{route,...details});
    }
  }
  assert.deepEqual(errors,[]);record('complete',{status:'pass'});
}catch(error){record('failure',{error:error.stack});throw error;}finally{
  await tab.close();await browser.close();await new Promise(r=>server.close(r));
}

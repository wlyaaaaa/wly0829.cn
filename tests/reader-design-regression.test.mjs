import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import vm from 'node:vm';
import {projectCatalog,rulesSnapshot,panelSnapshot} from '../app/site-content.js';
import {searchPanel,globalSearchEntries} from '../app/search.js';
import {createCompactSearchEntry,searchCompactEntries} from '../app/compact-search.js';
import {ruleReaderGuides} from '../app/content-rule-reader.js';
import {systemHomeChapters} from '../app/system-home-content.js';
import {publicSearchText} from '../app/public-search-projection.js';
const file=(p)=>readFile(fileURLToPath(new URL('../dist/'+p,import.meta.url)),'utf8');
const region=(html,id)=>html.split('data-project-reading-panel="'+id+'"')[1]?.split('data-project-reading-panel=')[0]||'';
const visibleText=(html)=>html.replace(/<[^>]*>/g,'').replaceAll('&quot;','\"').replaceAll('&#x27;',"'").replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>');
// The owner requires local path literals to leave public prose; all other
// product and reference meaning must still survive the two reading layers.
const normalizeAnnotated=(text)=>publicSearchText(text).replaceAll('（本机路径）','').replace(/([A-Za-z0-9_.+/-]+)（[^）]*）/g,'$1').replace(/\s+/g,'');

async function createReadingFixture(initialHash){
 const runtime=await readFile(fileURLToPath(new URL('../static-site/main.jsx',import.meta.url)),'utf8');
 const start=runtime.indexOf('function initializeProjectReadingLayers()');
 const end=runtime.indexOf('\nfunction ensureOpenAncestors(target)',start);
 assert.ok(start>=0&&end>start,'project reading runtime entrypoint is missing');
 const source=runtime.slice(start,end);
 const listeners={},historyEntries=[];
 const makePanel=(id)=>({id:`project-reading-panel-${id}`,dataset:{projectReadingPanel:id},hidden:id==='technical',scrolls:0,closest(selector){assert.equal(selector,'[data-project-reading-panel]');return this;},scrollIntoView(){this.scrolls++;}});
 const panels=['product','technical'].map(makePanel);
 const makeClassList=()=>({toggle(){}});
 const tabs=['product','technical'].map(id=>({dataset:{projectReadingTab:id},attributes:{},classList:makeClassList(),setAttribute(name,value){this.attributes[name]=value;},addEventListener(name,handler){this[`on${name}`]=handler;},focus(){}}));
 const nav={querySelectorAll(selector){assert.equal(selector,'[data-project-reading-tab]');return tabs;}};
 const aliases={
  'module-product':panels[0],
  'module-technical':panels[1],
  'deep-heading':panels[1]
 };
 for(const [id,panel]of Object.entries(aliases)) aliases[id]={closest(selector){assert.equal(selector,'[data-project-reading-panel]');return panel;},scrollIntoView(){}};
 const document={
  querySelector(selector){assert.equal(selector,'.project-reading-nav');return nav;},
  querySelectorAll(selector){assert.equal(selector,'[data-project-reading-panel]');return panels;},
  getElementById(id){return panels.find(panel=>panel.id===id)||aliases[id]||null;}
 };
 const window={
  location:{hash:initialHash},
  history:{pushState(state,_title,hash){historyEntries.push({state,hash});window.location.hash=hash;}},
  addEventListener(name,handler){listeners[name]=handler;},
  requestAnimationFrame(callback){callback();}
 };
 vm.runInNewContext(`${source}\nfunction ensureOpenAncestors(target) { return target; }\ninitializeProjectReadingLayers();`,{window,document});
 return {window,panels,tabs,listeners,historyEntries};
}
test('current usage sections render before technical evidence',async()=>{
 for(const slug of ['chinese-asr','localocr','ai-cli-profile-manager','pcconfig']){
  const source=JSON.parse(await readFile(new URL(`../sources/pages/${slug}/page.json`,import.meta.url),'utf8'));
  const html=await file(source.url.slice(1)+'index.html'),usage=source.screens.filter(screen=>screen.section==='usage');
  const technical=source.screens.find(screen=>screen.section==='tech');assert.ok(usage.length&&technical);
  for(const screen of usage)assert.ok(html.indexOf(`id="${screen.id}"`)>=0&&html.indexOf(`id="${screen.id}"`)<html.indexOf(`id="${technical.id}"`),slug);
 }
});
test('ASR model choices name concrete roles and leave inactive models visibly inactive',()=>{
 const p=projectCatalog.find(e=>e.project.slug==='chinese-asr').project,text=JSON.stringify(p.operatingChoices);
 for(const name of ['Qwen3-ASR','SenseVoice','FireRed','Fun-ASR','Paraformer','Whisper','ForcedAligner','CAM++'])assert.ok(text.includes(name),name);
 const whisper=p.operatingChoices.rows.find(r=>JSON.stringify(r).includes('Whisper'));
 assert.match(whisper.choice,/目前只是登记的配置/);
 assert.match(whisper.result,/现在无法直接运行/);
 assert.match(whisper.boundary,/不是本地失败后的自动备用/);
 assert.match(text,/文案|旁白/);assert.match(text,/云端|上传/);assert.match(text,/不自动|明确/);
});
test('reviewed primary rules are not confused with compatibility documents or complete inventory',()=>{
 assert.ok(rulesSnapshot.rules.length>0);
 assert.ok(panelSnapshot.releaseInventory.length>rulesSnapshot.rules.length);
 assert.ok(panelSnapshot.releaseInventory.some(r=>r.logicalId==='rules_catalog'));
 assert.ok(!rulesSnapshot.rules.some(r=>r.logicalId==='rules_catalog'||r.logicalId==='authorization_delegation_contract'));
});
test('natural model requests are discoverable in full and compact project search',()=>{
 const entries=globalSearchEntries.filter(e=>e.type!=='项目内容').map(e=>createCompactSearchEntry(e));
 for(const q of ['Qwen3-ASR','FireRedASR2','ForcedAligner']){
  assert.ok(searchPanel(q).some(e=>e.href.startsWith('/projects/chinese-asr')),q);
  assert.ok(searchCompactEntries(entries,q).some(e=>e.href.startsWith('/projects/chinese-asr')),q);
 }
});



test('familiar file formats stay unexpanded and current limits distinguish supported work',async()=>{
 const html=await file('skills/md-to-pdf/index.html');
 assert.doesNotMatch(visibleText(html),/Markdown（轻量标记文本）|PDF（便携文档格式）/);
 const unsuitable=html.match(/<section\b[^>]*data-section="limits"[^>]*>([\s\S]*?)(?=<section\b[^>]*class="ts-screen"|<\/main>)/)?.[1]||'';
 assert.ok(unsuitable,'ordinary unsuitable-use explanation is missing');
 assert.doesNotMatch(visibleText(unsuitable),/不修改 Markdown/,'preserving the source is a normal boundary, not an unsuitable use');
 assert.match(visibleText(unsuitable),/不交给它.*Word、PPT、Excel/s,'current unsupported formats remain explicit');
});

test('Skill directory and details render their current authored names and routes',async()=>{
 const directory=await file('skills/index.html'),directoryText=visibleText(directory);
 const pageSource=await readFile(fileURLToPath(new URL('../app/page.jsx',import.meta.url)),'utf8');
 assert.match(pageSource,/skill-card-top"><strong>\{annotateTerms\(item\.title\)\}/);
 assert.match(pageSource,/<h1>\{annotateTerms\(item\.title\)\}<\/h1>/);
 for(const item of (await import('../app/content-skills.js')).skills){
  const slug=item.slug==='document-materials'?'personal-formal-documents':item.slug;
  const source=JSON.parse(await readFile(new URL(`../sources/pages/skill-${slug}/page.json`,import.meta.url),'utf8'));
  assert.ok(directoryText.includes(source.title),`${item.slug} current title missing from directory`);
  const detail=await file(source.url.slice(1)+'index.html');
  assert.ok(visibleText(detail).includes(source.title),`${item.slug} current title missing from detail`);
  assert.ok(detail.includes(`href="https://wly0829.cn${source.url}"`),`${item.slug} canonical route missing`);
 }
});

test('high-confidence natural needs reach the intended owner first',()=>{
 const cases=[
  ['恢复 Windows 系统','/projects/pcconfig/recovery-backup'],
  ['找合同里的那句话','/projects/personal-materials/verified-open'],
  ['把录音转成文字','/projects/chinese-asr/task-routing'],
  ['帮我学懂这个概念','/projects/learning/plain-language'],
  ['昨晚电脑为什么卡','/projects/timeaudit/hardware-performance'],
  ['备份开发配置','/projects/devconfig-backup'],
  ['整理这份工作需求','/projects/work-delivery'],
  ['看昨天微信怎么聊的','/projects/wechat-direct/bounded-chat-context'],
  ['修复代理残留','/projects/proxyclean/dead-port-and-route-cleanup'],
  ['两台电脑之间传文件','/projects/meshclip-kit/kde-connect-pairing-sync'],
  ['测试 AI 编码能力','/projects/cacb/deterministic-verification']
 ];
 for(const [query,href] of cases) assert.equal(searchPanel(query,'all')[0]?.href,href,query);
});

test('current maintenance contracts do not freeze an obsolete E generation or rule count',async()=>{
 const registry=JSON.parse(await readFile(fileURLToPath(new URL('../config/panel-projects.json',import.meta.url)),'utf8'));
 const agents=registry.projects.find(item=>item.id==='agents');
 const reviewed=agents.impact_sources.find(item=>item.kind==='reviewed-current-release-contract');
 assert.ok(reviewed);
 assert.ok(reviewed.paths.includes('releases/current-rules.json'));
 assert.ok(reviewed.paths.includes('releases/*/AGENTS.md'));
 assert.ok(reviewed.paths.includes('releases/*/rules-catalog.json'));
 assert.ok(reviewed.paths.every(value=>!/^releases\/E\d+\//.test(value)),reviewed.paths.join(','));
 const rootRules=await readFile(fileURLToPath(new URL('../AGENTS.md',import.meta.url)),'utf8')
  + '\n' + await readFile(fileURLToPath(new URL('../docs/design/panel-content-contract.md',import.meta.url)),'utf8');
 const readme=await readFile(fileURLToPath(new URL('../README.md',import.meta.url)),'utf8');
 assert.doesNotMatch(rootRules,/five current rules/);
 assert.doesNotMatch(readme,/五份活动规则|活动规则E\d+/);
});




test('legacy layer and deep-heading hashes select the owning tab and history restores it',async()=>{
 for(const [hash,expected]of [['#quick','product'],['#project-reading-panel-quick','product'],['#product','product'],['#module-product','product'],['#technical','technical'],['#module-technical','technical'],['#deep-heading','technical']]){
  const fixture=await createReadingFixture(hash);
  const active=fixture.tabs.find(tab=>tab.attributes['aria-selected']==='true');
  assert.equal(active?.dataset.projectReadingTab,expected,`${hash} selected the wrong reading tab`);
  assert.equal(fixture.panels.find(panel=>panel.dataset.projectReadingPanel===expected).hidden,false,`${hash} left the owning content hidden`);
 }
 const fixture=await createReadingFixture('#project-reading-panel-product');
 fixture.tabs[1].onclick({button:0,preventDefault(){}});
 fixture.tabs[0].onclick({button:0,preventDefault(){}});
 assert.deepEqual(fixture.historyEntries.map(item=>item.hash),['#project-reading-panel-technical','#project-reading-panel-product']);
 assert.deepEqual(fixture.historyEntries.map(item=>Object.keys(item.state).sort()),[['readingLayer'],['readingLayer']]);
 fixture.window.location.hash=fixture.historyEntries[0].hash;
 fixture.listeners.popstate({state:fixture.historyEntries[0].state});
 assert.equal(fixture.tabs.find(tab=>tab.attributes['aria-selected']==='true')?.dataset.projectReadingTab,'technical','Back must restore the tab represented by the history entry');
 assert.equal(fixture.panels.find(panel=>panel.dataset.projectReadingPanel==='technical').hidden,false);
});


test('human Rules search leads with ordinary questions instead of contract names',()=>{
 const cases=[
  ['AI 什么时候必须再问我','authorization_contract'],
  ['取消验证会不会把私人资料锁住','privacy_data_contract'],
  ['多个任务怎么不互相覆盖','execution_coordination_contract'],
  ['怎么才算真的做完','engineering_delivery_contract'],
  ['该用哪个工具','capabilities_runtime_contract'],
  ['规则怎么更新不乱套','rule_release_contract']
 ];
 for(const [query,id] of cases){
  const first=searchPanel(query,'rules')[0];
  assert.equal(first && first.href,'/rules?rule='+id,query);
  assert.equal(first && first.title,ruleReaderGuides[id].title,query);
 }
});


test('Rules navigation uses durable URLs and leaves vertical scrolling to the document',async()=>{
 const pageSource=await readFile(fileURLToPath(new URL('../app/page.jsx',import.meta.url)),'utf8');
 const runtimeSource=await readFile(fileURLToPath(new URL('../static-site/main.jsx',import.meta.url)),'utf8');
 const styleSource=await readFile(fileURLToPath(new URL('../app/style.css',import.meta.url)),'utf8');
 assert.match(pageSource,/href=\{"\/rules\/\?rule=" \+ rule\.logicalId \+ "#rule-panel-" \+ rule\.logicalId\}/);
 assert.match(runtimeSource,/\.rule-selector-list a\[id\^='rule-tab-'\]/);
 assert.match(runtimeSource,/new URLSearchParams\(window\.location\.search\)\.get\("rule"\)/);
 assert.match(runtimeSource,/target\.scrollIntoView\(\{ block: "start" \}\)/);
 const selectorBlock=styleSource.match(/\.rule-selector-panel\s*\{([\s\S]*?)\}/)?.[1]||'';
 assert.match(selectorBlock,/position:\s*sticky/);
 assert.match(selectorBlock,/overflow:\s*visible/);
 assert.doesNotMatch(selectorBlock,/overflow-y:\s*(auto|scroll)/);
});

test('large disclosure cards use owner-requested plus-minus affordance',async()=>{
 const styleSource=await readFile(fileURLToPath(new URL('../app/style.css',import.meta.url)),'utf8');
 assert.match(styleSource,/Large disclosure cards: visible owner-preferred plus\/minus affordance/);
 assert.match(styleSource,/content:\s*"\+"/);
 assert.match(styleSource,/content:\s*"−"/);
});

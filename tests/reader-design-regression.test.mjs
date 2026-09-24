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
const file=(p)=>readFile(fileURLToPath(new URL('../dist/'+p,import.meta.url)),'utf8');
const region=(html,id)=>html.split('data-project-reading-panel="'+id+'"')[1]?.split('data-project-reading-panel=')[0]||'';
const visibleText=(html)=>html.replace(/<[^>]*>/g,'').replaceAll('&quot;','\"').replaceAll('&#x27;',"'").replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>');
const normalizeAnnotated=(text)=>text.replace(/([A-Za-z0-9_.+/-]+)（[^）]*）/g,'$1').replace(/\s+/g,'');

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
test('choices are available in the first reading layer, not hidden only in technical reference',async()=>{
 for(const slug of ['chinese-asr','localocr','ai-cli-profile-manager','llm-backend-toolkit','pcconfig']){
  const {project:p}=projectCatalog.find(e=>e.project.slug===slug);assert.ok(p.operatingChoices?.rows.length);
  const html=await file('projects/'+slug+'/index.html'),product=region(html,'product');
  assert.match(product,/project-operating-choices/);assert.doesNotMatch(region(html,'technical'),/project-operating-choices/);
  for(const r of p.operatingChoices.rows)for(const key of ['need','choice','result','boundary'])assert.ok(typeof r[key]==='string'&&r[key].trim(),slug+':'+key);
 }
});
test('project evolution appears once in Product with its original stage evidence attached',async()=>{
 const pageSource=await readFile(fileURLToPath(new URL('../app/page.jsx',import.meta.url)),'utf8');
 const stageSource=pageSource.slice(pageSource.indexOf('function ProjectEvolutionStage'),pageSource.indexOf('function ProjectOverview'));
 assert.match(stageSource,/stage\.commit[\s\S]*?stage\.evidence/,'stage evidence must render from its owning milestone');
 assert.match(stageSource,/evolution-stage-evidence[\s\S]*?阶段依据/);
 for(const {project:p}of projectCatalog){
  const h=await file(p.route.replace(/^\//,'')+'/index.html'),product=region(h,'product'),productText=visibleText(product),technical=region(h,'technical');
  assert.equal((h.match(/class="evolution-timeline"/g)||[]).length,1,p.slug);
  assert.match(product,/evolution-timeline/,p.slug);
  assert.doesNotMatch(technical,/evolution-timeline|演化证据/,p.slug);
  for(const stage of p.evolution){
   const evidence=[...(stage.commit?[{date:stage.date,note:stage.title||stage.result,commit:stage.commit}]:[]),...(stage.evidence||[])];
   for(const item of evidence){
    assert.ok(item.date?.trim(),`${p.slug} evolution evidence date missing`);
    assert.ok(item.note?.trim(),`${p.slug} evolution evidence note missing`);
    for(const value of [item.date,item.note,item.commit].filter(Boolean)) assert.ok(normalizeAnnotated(productText).includes(normalizeAnnotated(value)),`${p.slug} evolution product layer lost source evidence: ${value}`);
   }
  }
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


test('every project module has an ordinary request and an owning module route from Product', async()=>{
 let moduleCount=0;
 const pageSource=await readFile(fileURLToPath(new URL('../app/page.jsx',import.meta.url)),'utf8');
 assert.match(pageSource,/currentProject\.usageExamples\.filter\(\(candidate\) => candidate\.moduleSlug === item\.slug\)/,'Product module index must render each module’s authored usage examples');
 for(const {project:p,modules} of projectCatalog){
  moduleCount+=modules.length;
  for(const module of modules){
   const usage=p.usageExamples.find(item=>item.moduleSlug===module.slug);
   assert.ok(usage?.ask?.trim(),`${p.slug}/${module.slug} lacks representative need`);
  }
  const html=await file(p.route.replace(/^\//,'')+'/index.html');
  const product=region(html,'product');
  assert.match(product,/project-capability-overview/,p.slug);
  for(const module of modules){
   const canonical=`${p.route}/${module.slug}/`;
   assert.ok(product.includes(`href="${canonical}"`),`${p.slug}/${module.slug} is missing from Product`);
  }
 }
 assert.equal(projectCatalog.length,33);
 assert.equal(moduleCount,206);
});

test('familiar file formats stay unexpanded and normal boundaries do not become unsuitable uses',async()=>{
 const html=await file('skills/md-to-pdf/index.html');
 assert.doesNotMatch(visibleText(html),/Markdown（轻量标记文本）|PDF（便携文档格式）/);
 const unsuitable=html.split('<h3>不适合这样用</h3>')[1]?.split('</article>')[0]||'';
 assert.ok(unsuitable,'ordinary unsuitable-use explanation is missing');
 assert.doesNotMatch(visibleText(unsuitable),/不修改 Markdown/,'preserving the source is a normal boundary, not an unsuitable use');
 assert.match(html,/skill-execution-reference/,'precise execution contracts remain available');
});

test('Skill directory and details lead with human names while retaining technical identity',async()=>{
 const directory=await file('skills/index.html'),directoryText=visibleText(directory);
 const pageSource=await readFile(fileURLToPath(new URL('../app/page.jsx',import.meta.url)),'utf8');
 assert.match(pageSource,/skill-card-top"><strong>\{annotateTerms\(item\.title\)\}/);
 assert.match(pageSource,/<h1>\{annotateTerms\(item\.title\)\}<\/h1>/);
 for(const item of (await import('../app/content-skills.js')).skills){
  for(const token of item.title.split(/\s+/).filter(Boolean)) assert.ok(directoryText.includes(token),`${item.slug} human title token missing: ${token}`);
  assert.ok(directoryText.includes(`Skill · ${item.name}`),`${item.slug} technical identity missing from directory`);
  const detail=await file(`skills/${item.slug}/index.html`),detailText=visibleText(detail);
  const h1=detail.match(/<h1>([\s\S]*?)<\/h1>/)?.[1]||'';
  const h1Text=visibleText(h1);
  for(const token of item.title.split(/\s+/).filter(Boolean)) assert.ok(h1Text.includes(token),`${item.slug} detail human title token missing: ${token}`);
  assert.ok(detailText.includes(`Skill · ${item.name}`),`${item.slug} detail loses technical identity`);
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
 const rootRules=await readFile(fileURLToPath(new URL('../AGENTS.md',import.meta.url)),'utf8');
 const readme=await readFile(fileURLToPath(new URL('../README.md',import.meta.url)),'utf8');
 assert.doesNotMatch(rootRules,/five current rules/);
 assert.doesNotMatch(readme,/五份活动规则|活动规则E\d+/);
});


test('Rules default to ordinary situations while complete human and technical layers remain available',async()=>{
 assert.equal(Object.keys(ruleReaderGuides).length,rulesSnapshot.rules.length);
 const html=await file('rules/index.html');
 assert.match(html,/不用先学 AI 规则/);
 assert.match(html,/rule-reader-deep-dive/);
 assert.match(html,/rule-technical-details/);
 assert.match(html,/rules-technical-dashboard/);
 assert.match(html,/class="rule-reader-deep-dive"[^>]*\sopen(?:=""|\s|>)/);
 assert.match(html,/class="rule-technical-details"[^>]*\sopen(?:=""|\s|>)/);
 assert.match(html,/class="rules-technical-dashboard"[^>]*\sopen(?:=""|\s|>)/);
 for(const rule of rulesSnapshot.rules){
  const reader=ruleReaderGuides[rule.logicalId];
  assert.ok(reader,rule.logicalId);
  assert.ok(reader.answer.trim(),rule.logicalId+' answer missing');
  assert.ok(reader.sections.length,rule.logicalId+' complete human guide missing');
  assert.ok(reader.examples.length,rule.logicalId+' real example missing');
  assert.ok(html.includes(reader.title),rule.logicalId+' human title missing from page');
  assert.ok(html.includes(rule.logicalId),rule.logicalId+' technical topic identity missing from its owning page');
 }
});

test('project, module and Skill pages render two real tabs with complete product and technical content',async()=>{
 const mod=await import('../app/content-skills.js');
 const {skills}=mod;
 const pageSource=await readFile(fileURLToPath(new URL('../app/page.jsx',import.meta.url)),'utf8');
 const translationsStart=pageSource.indexOf('const translatedTerms = {');
 const translationsEnd=pageSource.indexOf('\n};',translationsStart);
 const termTranslations=new Map([...pageSource.slice(translationsStart,translationsEnd).matchAll(/^\s*"([^"]+)":\s*"([^"]+)"/gm)].map(match=>[match[1],match[2]]));
 assert.match(pageSource,/const projectReadingLayers = \[\s*\{ id: "product", label: "产品用法" \},\s*\{ id: "technical", label: "技术与依据" \}\s*\]/);
 const assertTwoPanels=(html,label)=>{
  const tabs=[...html.matchAll(/<a\b[^>]*role="tab"[^>]*data-project-reading-tab="(product|technical)"[^>]*>/g)];
  assert.deepEqual(tabs.map(match=>match[1]),['product','technical'],`${label} must expose exactly the two intended tabs`);
  assert.equal((html.match(/data-project-reading-tab=/g)||[]).length,2,`${label} has extra reading tabs`);
  const panel=(id)=>{
   const marker=html.indexOf(`data-project-reading-panel="${id}"`);
   assert.ok(marker>=0,`${label} lacks the ${id} panel`);
   const start=html.lastIndexOf('<section',marker);
   const next=html.indexOf('data-project-reading-panel=',marker+1);
   const end=next<0?html.length:html.lastIndexOf('<section',next);
   return html.slice(start,end);
  };
  const product=panel('product'),technical=panel('technical');
  assert.match(product,/id="project-reading-panel-product"[^>]*role="tabpanel"/);
  assert.doesNotMatch(product.slice(0,220),/\shidden(?:=""|\s|>)/,`${label} Product must be visible in the static document`);
  assert.match(technical,/id="project-reading-panel-technical"[^>]*role="tabpanel"/);
  assert.match(technical.slice(0,240),/\shidden(?:=""|\s|>)/,`${label} Technical starts hidden while remaining in SSR HTML`);
  return {product,technical};
 };
 for(const {project:p,modules} of projectCatalog){
  const html=await file(p.route.replace(/^\//,'')+'/index.html');
  const {product,technical}=assertTwoPanels(html,p.slug+' overview');
  assert.ok(p.usageEntry?.trim(),`${p.slug} overview lacks its ordinary starting point`);
  assert.ok(normalizeAnnotated(visibleText(product)).includes(normalizeAnnotated(p.usageEntry)),`${p.slug} overview hides its ordinary starting point`);
  assert.ok(Array.isArray(p.usageInputs),`${p.slug} overview must state its actual input needs`);
  for(const input of p.usageInputs) assert.ok(normalizeAnnotated(visibleText(product)).includes(normalizeAnnotated(input)),`${p.slug} overview loses supplied input guidance: ${input}`);
  assert.ok(p.operatingFlow?.length,`${p.slug} overview lacks its product flow`);
  for(const step of p.technicalOperatingFlow||[]) for(const value of [step.title,step.detail]) assert.ok(normalizeAnnotated(visibleText(technical)).includes(normalizeAnnotated(value)),`${p.slug} technical flow loses ${value}`);
  for(const section of p.technicalSections||[]) for(const value of [section.title,...section.paragraphs]) assert.ok(normalizeAnnotated(visibleText(technical)).includes(normalizeAnnotated(value)),`${p.slug} loses technical reference: ${value}`);
  for(const module of modules){
   const moduleHtml=await file(`${p.route.replace(/^\//,'')}/${module.slug}/index.html`);
   const panels=assertTwoPanels(moduleHtml,`${p.slug}/${module.slug}`),productText=normalizeAnnotated(visibleText(panels.product)),technicalText=normalizeAnnotated(visibleText(panels.technical));
   assert.ok(module.usageEntry?.trim(),`${p.slug}/${module.slug} lacks its module-specific request path`);
   assert.ok(productText.includes(normalizeAnnotated(module.usageEntry)),`${p.slug}/${module.slug} hides its module-specific request path`);
   assert.ok(Array.isArray(module.usageInputs),`${p.slug}/${module.slug} must state its input needs; automatic functions may need no new materials`);
   for(const input of module.usageInputs) assert.ok(productText.includes(normalizeAnnotated(input)),`${p.slug}/${module.slug} loses input guidance: ${input}`);
   assert.ok(module.productFlow?.length,`${p.slug}/${module.slug} lacks its product flow`);
   for(const step of module.productFlow) for(const value of [step.title,step.detail]) assert.ok(productText.includes(normalizeAnnotated(value)),`${p.slug}/${module.slug} product flow loses ${value}`);
   for(const value of [module.why,module.example,module.result].filter(Boolean)) assert.ok(productText.includes(normalizeAnnotated(value)),`${p.slug}/${module.slug} product meaning is missing: ${value}`);
   for(const section of module.technicalSections||[]) for(const value of [section.title,...section.paragraphs]) assert.ok(technicalText.includes(normalizeAnnotated(value)),`${p.slug}/${module.slug} loses technical reference: ${value}`);
   for(const value of [module.status,module.teaser,module.problem,module.relation,...(module.implementation||[]),...(module.flow||[]),...(module.boundaries||[]),...(module.verification||[]),...(module.decisionImpact||[]),...(module.concepts||[]).flatMap(item=>[termTranslations.get(item.term)||item.term,item.explanation]),...(module.sources||[]).flatMap(item=>[item.path,item.role]),...(module.failures||[]).flatMap(item=>[item.condition,item.response])].filter(Boolean)) assert.ok(technicalText.includes(normalizeAnnotated(value)),`${p.slug}/${module.slug} technical reference is missing: ${value}`);
  }
 }
 for(const item of skills){
  const html=await file('skills/'+item.slug+'/index.html');
  const {product,technical}=assertTwoPanels(html,`Skill ${item.slug}`),productText=normalizeAnnotated(visibleText(product)),technicalText=normalizeAnnotated(visibleText(technical));
  assert.match(product,/skill-reader-quick|skill-reader-product/,item.slug);
  assert.ok(item.usageEntry?.trim(),`${item.slug} lacks an ordinary starting point`);
  assert.ok(Array.isArray(item.usageInputs),`${item.slug} must state its input needs without inventing required materials`);
  for(const value of [...item.useWhen,...item.avoidWhen]) assert.ok(productText.includes(normalizeAnnotated(value)),`${item.slug} hides a complete use/avoid rule: ${value}`);
  for(const value of [item.usageEntry,...item.usageInputs,...(item.productProcesses||[]).flatMap(process=>[process.title,process.request,process.input,process.action,process.result,process.boundary])].filter(Boolean)) assert.ok(productText.includes(normalizeAnnotated(value)),`${item.slug} product meaning is missing: ${value}`);
  for(const section of item.technicalSections||[]) for(const value of [section.title,...section.paragraphs,...(section.commands||[])]) assert.ok(technicalText.includes(normalizeAnnotated(value)),`${item.slug} technical reference is missing: ${value}`);
  for(const value of [...item.inputs,...item.outputs,...item.flow,...item.boundaries,...item.dependencies]) assert.ok(technicalText.includes(normalizeAnnotated(value)),`${item.slug} loses technical operating detail: ${value}`);
 }
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

test('System starts from real work and keeps composition visible before operational details',async()=>{
 const html=await file('index.html');
 assert.match(html,/先看：你可以直接让 AI 做哪些事/);
 assert.match(html,/从一件具体事情开始/);
 assert.match(html,/这套系统实际由什么组成/);
 assert.equal((html.match(/data-system-section-link=/g)||[]).length,systemHomeChapters.length);
 for(const chapter of systemHomeChapters){assert.match(html,new RegExp(`data-system-section-link="${chapter.id}"`));assert.ok(html.includes(chapter.label),chapter.id+' section label missing');}
 assert.ok(html.indexOf('id="system-workflows"')<html.indexOf('id="system-inside"'));
 assert.ok(html.indexOf('id="system-inside"')<html.indexOf('id="system-automation-details"'));
 assert.match(html,/<section[^>]+id="system-inside"/);
 assert.doesNotMatch(html,/class="system-frame system-reader-details"[^>]*\sopen(?:=""|\s|>)/);
 assert.doesNotMatch(html,/class="system-directories"/,'duplicated end-of-page directory must stay merged with existing navigation');
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

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

async function fixture(type='navigate') {
  const runtime=await readFile(new URL('../static-site/main.jsx',import.meta.url),'utf8');
  const start=runtime.indexOf('function initializeProjectReadingLayers()');
  const end=runtime.indexOf('\nfunction ensureOpenAncestors(target)',start);
  const events={},frames=[],panels=['product','technical'].map(id=>({
    id:'project-reading-panel-'+id,dataset:{projectReadingPanel:id},hidden:id==='technical',scrolls:0,
    closest(){return this;},scrollIntoView(){this.scrolls++;}
  }));
  const tabs=panels.map(panel=>({dataset:{projectReadingTab:panel.dataset.projectReadingPanel},classList:{toggle(){}},setAttribute(){},addEventListener(){},focus(){}}));
  const document={querySelector(){return{querySelectorAll(){return tabs;}};},querySelectorAll(){return panels;},getElementById(id){return panels.find(p=>p.id===id)||(id==='module-technical'?panels[1]:null);}};
  const window={location:{hash:'#module-technical'},performance:{getEntriesByType(){return[{type}];}},addEventListener(name,handler){events[name]=handler;},requestAnimationFrame(fn){frames.push(fn);},history:{pushState(){}}};
  vm.runInNewContext(runtime.slice(start,end)+'\nfunction ensureOpenAncestors(){}\ninitializeProjectReadingLayers();',{window,document});
  const flush=()=>{while(frames.length)frames.shift()();};flush();
  return{events,panels,window,flush};
}

test('direct technical hashes reveal their tab and position',async()=>{
  const f=await fixture();assert.equal(f.panels[1].hidden,false);assert.equal(f.panels[1].scrolls,1);
});

test('back-forward document and bfcache restore leave the native saved viewport alone',async()=>{
  const f=await fixture('back_forward');assert.equal(f.panels[1].hidden,false);assert.equal(f.panels[1].scrolls,0);
  f.events.pageshow({persisted:true});f.flush();assert.equal(f.panels[1].scrolls,0);
});

test('popstate plus its native hashchange preserve position while a new hash still scrolls',async()=>{
  const f=await fixture();const before=f.panels[1].scrolls;
  f.events.popstate({});f.events.hashchange({});f.flush();assert.equal(f.panels[1].scrolls,before);
  f.window.location.hash='#project-reading-panel-product';f.events.hashchange({});f.flush();assert.equal(f.panels[0].scrolls,1);
});

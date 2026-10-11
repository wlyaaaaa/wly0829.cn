import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../site-astro/src/scripts/typeset-motion.js',import.meta.url),'utf8');
function fixture({enabled=true,off=false,reduced=false,hidden=false,screenSeen=false,screenEntering=false,invisible=false}={}) {
 const calls=[],events={},media={matches:reduced,addEventListener:(_,fn)=>events.reduce=fn};
 class Node {
  constructor(kind,comp='') {this.kind=kind;this.comp=comp;this.children=[];this.dataset={};this.offsetWidth=1000;this.style={setProperty(){}};
   const names=new Set();this.classList={contains:n=>names.has(n),add:n=>names.add(n),remove:n=>names.delete(n)};}
  append(...nodes){for(const n of nodes){n.parentElement=this;this.children.push(n);}}
  contains(n){return n===this||this.children.some(c=>c.contains(n));}
  matches(q){return q==='.card,.ct-card'?this.kind==='card':q==='.ts-canvas'?this.kind==='canvas':q==='.ts-screen'?this.kind==='screen':q==='[data-comp=illustration]'?this.comp==='illustration':false;}
  closest(q){return this.matches(q)?this:this.parentElement?.closest(q)||null;}
  querySelectorAll(q){const all=this.children.flatMap(c=>[c,...c.querySelectorAll('*')]);
   if(q==='*')return all;if(q==='.ts-canvas')return all.filter(n=>n.kind==='canvas');
   if(q==='[data-comp],.hub-stat-extra')return all.filter(n=>n.comp);
   if(q==='.card,.ct-card'||q.startsWith('.num,'))return all.filter(n=>n.kind==='card');return [];}
  querySelector(q){if(q==='[data-ts-art]')return this.children.find(n=>n.kind==='image')||null;
   if(q===':scope > .ts-art')return this.children.find(n=>n.kind==='art')||null;return this.querySelectorAll(q)[0]||null;}
  getBoundingClientRect(){let n=this;while(n){if(n.invisible)return {top:0,bottom:0,width:0,height:0};n=n.parentElement;}return {top:10,bottom:510,width:500,height:500};}
  animate(frames,options){let reject;const a={finished:new Promise((_,r)=>reject=r),cancel(){a.cancelled=true;reject();}};calls.push({node:this,frames,options,a});return a;}
 }
 const root=new Node('root'),sec=new Node('screen'),wrap=new Node('wrap'),host=new Node('canvas'),art=new Node('art');
 const title=new Node('part','chapter_title'),prose=new Node('part','prose'),nested=new Node('part','section_heading'),ill=new Node('part','illustration'),cardGroup=new Node('part','content_card'),card=new Node('card');
 prose.append(nested);ill.append(new Node('image'));cardGroup.append(card);host.append(title,prose,ill,cardGroup);wrap.append(host,art);sec.append(wrap);root.append(sec);
 if(enabled)root.dataset.entryMotion='cards';if(screenSeen)sec.dataset.seen='1';if(screenEntering)sec.classList.add('ts-entering');host.invisible=invisible;
 const body=new Node('body');if(off)body.classList.add('motion-off');
 const document={hidden,body,fonts:{ready:Promise.resolve()},querySelector:()=>root,addEventListener:(n,fn)=>events[n]=fn};
 class IO{constructor(fn){this.fn=fn;}observe(target){this.fn([{target,isIntersecting:true}]);}}
 vm.runInNewContext(source,{document,window:{IntersectionObserver:IO},IntersectionObserver:IO,MutationObserver:class{observe(){}},matchMedia:()=>media,
  innerHeight:900,innerWidth:1200,requestAnimationFrame:fn=>fn(),addEventListener:(n,fn)=>events[n]=fn,setTimeout(){},Element:Node});
 return {calls,events,document,media,title,prose,nested,ill,art,card,cardGroup};
}
test('opted pages animate outer text and synchronized art with the existing card timing',()=>{
 const f=fixture(),parts=f.calls.filter(c=>[f.title,f.prose,f.ill].includes(c.node));
 assert.equal(parts.length,3);assert.deepEqual(parts.map(c=>c.options.delay),[0,60,120]);
 for(const c of parts){assert.equal(c.options.duration,900);assert.equal(c.frames[0].translate,'0 80px');assert.equal(c.frames[0].opacity,0);assert.equal(c.frames[1].opacity,1);}
 const art=f.calls.find(c=>c.node===f.art);assert.equal(art.options.delay,120);assert.equal(art.frames[0].translate,'0 40px');
 assert.equal(f.calls.some(c=>c.node===f.nested||c.node===f.cardGroup),false);assert.equal(f.calls.filter(c=>c.node===f.card).length,1);
 f.events.scroll();assert.equal(f.calls.filter(c=>c.node===f.title).length,1);
});
test('ordinary pages keep their existing cards and do not opt into text entrance',async()=>{
 const f=fixture({enabled:false});await Promise.resolve();
 assert.equal(f.calls.some(c=>c.node===f.title||c.node===f.art),false);assert.equal(f.calls.filter(c=>c.node===f.card).length,1);
});
test('whole-screen entrance, disabled motion, reduced motion and hidden pages suppress parts',()=>{
 for(const options of [{screenSeen:true},{screenEntering:true},{off:true},{reduced:true},{hidden:true},{invisible:true}]){
  const f=fixture(options);assert.equal(f.calls.some(c=>c.node===f.title||c.node===f.art),false);
 }
});
test('motion cancellation removes running effects without writing hidden fallback styles',()=>{
 for(const signal of ['site-motion','visibilitychange','reduce']){
  const f=fixture();if(signal==='site-motion')f.document.body.classList.add('motion-off');else if(signal==='visibilitychange')f.document.hidden=true;else f.media.matches=true;
  f.events[signal]();assert.ok(f.calls.every(c=>c.a.cancelled));assert.equal(f.title.style.opacity,undefined);assert.equal(f.art.style.opacity,undefined);
 }
});
